/* WTS tuition chat logic. Written shadow-DOM-aware: everything scopes off
   the `root` (shadow root) and `app` (`.wts-chat` wrapper) passed to
   runChat(root, app, config) - no bare document.* DOM lookups, so build.py
   can inline this file without rewriting it.

   Talks to the Hedwig web-chat API (hedwig/webchat/ in the
   hedwig-admissions-slackbot repo): POST {apiBase}/api/chat
   {"message": "...", "conversation": token|null} -> {"reply": <Slack-mrkdwn
   string>, "routed": bool, "outro": str|null, "source": "agent"|"engine",
   "conversation": token|null}. The outro is the generic closing boilerplate
   (no hidden fees, talk to your counselor); it arrives as its own field
   so the widget can show it once per conversation instead of after
   every answer. The reply is Slack mrkdwn because the same engine
   serves Slack; the mini-renderer below covers the three constructs
   tuition answers use (``` code blocks, *bold*, _italic_).

   source "agent" means the Admissions Assistant (an Agentforce agent)
   answered; "engine" means Hedwig's own tuition calculator did. The
   conversation token keeps the assistant's context from one message to
   the next. config.agentKey, when the embedding page sets one, goes in
   the X-Webchat-Key header: Hedwig limits the assistant to requests that
   carry it until launch. The public wts.edu embed sets none. */

function runChat(root, app, config) {
  "use strict";

  var STORAGE_KEY = "wtsTuitionChat.v1";
  var MAX_TRANSCRIPT = 40;

  // Cost-framed questions only: the engine answers duration questions
  // ("how long at N courses/term?") with a cost-first reply that reads
  // mismatched, so don't suggest that phrasing until the engine has a
  // duration-first framing.
  var SUGGESTIONS = [
    "What would the MAC cost me with 6 transfer credits?",
  ];

  var WELCOME =
    "Hi! I can estimate what a Westminster program would cost you, " +
    "including scholarships and how far the money you raise can go. " +
    "Try one of these, or ask in your own words:";

  // AI mode: the Admissions Assistant, an AI, answers. The copy has to say so
  // before anyone types, so it turns on from the embed's config, and also
  // from the first answer the assistant gives.
  var AI_SUGGESTIONS = SUGGESTIONS.concat([
    "When is the application deadline for the online MDiv?",
  ]);
  var AI_WELCOME =
    "Hi! I'm the Admissions Assistant. Ask me about tuition, " +
    "scholarships, application deadlines or how to apply. Try one of " +
    "these, or ask in your own words:";
  var AI_PLACEHOLDER = "Ask about tuition, scholarships or applying\u2026";
  var AI_DISCLAIMER =
    "You're chatting with an AI assistant. It answers from Westminster's " +
    "published tuition and admissions information and can make mistakes: " +
    "confirm details with an admissions counselor.";

  var launcher = app.querySelector(".wts-chat__launcher");
  var panel = app.querySelector(".wts-chat__panel");
  var closeBtn = app.querySelector(".wts-chat__close");
  var expandBtn = app.querySelector(".wts-chat__expand");
  var messagesEl = app.querySelector(".wts-chat__messages");
  var form = app.querySelector(".wts-chat__composer");
  var input = app.querySelector(".wts-chat__input");
  var sendBtn = app.querySelector(".wts-chat__send");
  var disclaimerEl = app.querySelector(".wts-chat__disclaimer");

  // ---- session persistence (open state + transcript survive page
  // navigation within the visit, reset when the tab closes) ----------

  function loadState() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* storage full or blocked: chat still works, just won't persist */ }
  }

  // ---- theme -----------------------------------------------------------
  // config.theme: "light" (default: wts.edu has no dark mode, and a dark
  // chat on a light page looks broken), "dark", or "auto" for pages that
  // have a dark mode: follow the page when it marks its theme (data-theme
  // on <html>, or a "dark" class), else the visitor's system setting, and
  // keep following both as they change.
  var theme = config.theme || "light";
  var systemDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var pageRoot = document.documentElement;

  function isDark() {
    if (theme === "dark") return true;
    if (theme !== "auto") return false;
    var page = pageRoot.getAttribute("data-theme");
    if (page === "dark") return true;
    if (page === "light") return false;
    if (pageRoot.classList.contains("dark")) return true;
    return !!(systemDark && systemDark.matches);
  }

  function applyTheme() {
    app.classList.toggle("wts-chat--dark", isDark());
  }

  applyTheme();
  if (theme === "auto") {
    if (systemDark) {
      if (systemDark.addEventListener) systemDark.addEventListener("change", applyTheme);
      else if (systemDark.addListener) systemDark.addListener(applyTheme);
    }
    new MutationObserver(applyTheme).observe(pageRoot, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
  }

  var state = loadState();
  if (!Array.isArray(state.transcript)) state.transcript = [];
  // The closing boilerplate shows once per browser session; the flag
  // rides the same sessionStorage state as the transcript.
  if (typeof state.outroShown !== "boolean") state.outroShown = false;
  if (typeof state.conversation !== "string") state.conversation = null;

  function setAiMode() {
    state.ai = true;
    input.placeholder = AI_PLACEHOLDER;
    disclaimerEl.textContent = AI_DISCLAIMER;
  }
  if (config.agentKey || config.ai || state.ai) setAiMode();

  // ---- mrkdwn mini-renderer -----------------------------------------

  function escapeHtml(s) {
    // [<] not a bare < : the mockup build inlines this file into a <script>
    // block and escapes every `</` to `<\/`, which would corrupt a /</g
    // regex literal. The character class sidesteps the sequence entirely.
    return s.replace(/&/g, "&amp;").replace(/[<]/g, "&lt;").replace(/[>]/g, "&gt;");
  }

  function inlineMrkdwn(s) {
    // Bold/italic only; the escapes above make this injection-safe.
    return s
      .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
      .replace(/_([^_\n]+)_/g, "<em>$1</em>");
  }

  function renderMrkdwn(text) {
    var html = "";
    // Fences split the message into alternating text / code segments.
    var segments = escapeHtml(text).split(/```/);
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      if (i % 2 === 1) {
        html += "<pre>" + seg.replace(/^\n+|\n+$/g, "") + "</pre>";
      } else {
        var paras = seg.split(/\n{2,}/);
        for (var j = 0; j < paras.length; j++) {
          var p = paras[j].replace(/^\n+|\n+$/g, "");
          if (p) html += "<p>" + inlineMrkdwn(p).replace(/\n/g, "<br>") + "</p>";
        }
      }
    }
    return html;
  }

  // ---- transcript rendering -----------------------------------------

  // Shrink a code block's mono face until its widest line fits the
  // bubble, so the cost table reads without side-scrolling. Floor at
  // 9px for legibility; if the widest line still doesn't fit there,
  // soft-wrap it (only the longest lines wrap; the aligned money rows
  // are narrower and keep their columns). No-op while the panel is
  // hidden (clientWidth 0) - fitAllPres() re-runs on open for a
  // transcript restored into a closed panel.
  function fitPre(pre) {
    if (!pre.clientWidth) return;
    var size = 11.5;
    pre.classList.remove("wts-chat__pre--wrap");
    pre.style.fontSize = size + "px";
    while (size > 9 && pre.scrollWidth > pre.clientWidth) {
      size -= 0.5;
      pre.style.fontSize = size + "px";
    }
    if (pre.scrollWidth > pre.clientWidth) {
      pre.classList.add("wts-chat__pre--wrap");
    }
  }

  function fitAllPres() {
    var pres = messagesEl.querySelectorAll("pre");
    for (var i = 0; i < pres.length; i++) fitPre(pres[i]);
  }

  function addBubble(who, text, opts) {
    var div = document.createElement("div");
    div.className = "wts-chat__msg wts-chat__msg--" + (who === "user" ? "user" : "bot");
    if (opts && opts.error) div.className += " wts-chat__msg--error";
    if (who === "user") {
      div.textContent = text;
    } else {
      div.innerHTML = renderMrkdwn(text);
    }
    var pres = who === "user" ? [] : div.querySelectorAll("pre");
    if (pres.length) div.className += " wts-chat__msg--wide";
    messagesEl.appendChild(div);
    // Fit after insertion - scrollWidth/clientWidth are 0 off-DOM.
    for (var i = 0; i < pres.length; i++) fitPre(pres[i]);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function record(who, text) {
    state.transcript.push({ who: who, text: text });
    if (state.transcript.length > MAX_TRANSCRIPT) {
      state.transcript = state.transcript.slice(-MAX_TRANSCRIPT);
    }
    saveState();
  }

  function addSuggestionChips() {
    var wrap = document.createElement("div");
    wrap.className = "wts-chat__chips";
    (state.ai ? AI_SUGGESTIONS : SUGGESTIONS).forEach(function (q) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "wts-chat__chip";
      chip.textContent = q;
      chip.addEventListener("click", function () { send(q); });
      wrap.appendChild(chip);
    });
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showWelcome() {
    addBubble("bot", state.ai ? AI_WELCOME : WELCOME);
    addSuggestionChips();
  }

  function restoreTranscript() {
    if (!state.transcript.length) {
      showWelcome();
      return;
    }
    state.transcript.forEach(function (m) { addBubble(m.who, m.text); });
  }

  // ---- talk to the API ------------------------------------------------

  function askBackend(text) {
    if (typeof config.mock === "function") {
      // Demo/mockup mode: canned answers, no network. See dist/index.html.
      return Promise.resolve(config.mock(text));
    }
    var headers = { "Content-Type": "application/json" };
    if (config.agentKey) headers["X-Webchat-Key"] = config.agentKey;
    return fetch(config.apiBase.replace(/\/$/, "") + "/api/chat", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ message: text, conversation: state.conversation }),
    }).then(function (resp) {
      return resp.json().then(function (payload) {
        if (!resp.ok) {
          // 4xx payloads may carry displayable copy in `reply`.
          var err = new Error("api " + resp.status);
          err.reply = payload && payload.reply;
          throw err;
        }
        return payload;
      });
    });
  }

  var pending = false;

  // Hold the typing indicator on screen for a beat even when the answer
  // comes back instantly (mock mode, warm API): an immediate wall of
  // text reads as a search result, a short pause reads as a chat.
  function typingPause(payload, startedAt) {
    var target = 800 + Math.random() * 700;
    var remaining = target - (Date.now() - startedAt);
    if (remaining <= 0) return Promise.resolve(payload);
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(payload); }, remaining);
    });
  }

  function send(text) {
    text = (text || "").trim();
    if (!text || pending) return;
    pending = true;
    sendBtn.disabled = true;
    input.value = "";

    addBubble("user", text);
    record("user", text);

    var typing = document.createElement("div");
    typing.className = "wts-chat__msg wts-chat__msg--bot";
    typing.innerHTML = '<span class="wts-chat__typing"><i></i><i></i><i></i></span>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    var startedAt = Date.now();

    askBackend(text)
      .then(function (payload) { return typingPause(payload, startedAt); })
      .then(function (payload) {
        typing.remove();
        // A reply without a token ends the assistant's conversation (the
        // engine answered, or the session lapsed); the next message starts
        // a fresh one.
        state.conversation = payload.conversation || null;
        if (payload.source === "agent" && !state.ai) setAiMode();
        addBubble("bot", payload.reply);
        record("bot", payload.reply);
        if (payload.outro && !state.outroShown) {
          state.outroShown = true;
          addBubble("bot", payload.outro);
          record("bot", payload.outro); // record() also persists the flag
        }
      })
      .catch(function (err) {
        typing.remove();
        var reply = err.reply ||
          "Sorry - I couldn't reach the tuition service just now. " +
          "Please try again in a moment, or email admissions@wts.edu.";
        addBubble("bot", reply, { error: true });
        record("bot", reply);
      })
      .finally(function () {
        pending = false;
        sendBtn.disabled = false;
        input.focus();
      });
  }

  // ---- larger / smaller ------------------------------------------------
  // Remembered for the visit with the transcript; a new tab starts small.

  function setExpanded(expanded) {
    app.classList.toggle("wts-chat--expanded", expanded);
    expandBtn.setAttribute("aria-pressed", String(expanded));
    var label = expanded ? "Make the chat smaller" : "Make the chat larger";
    expandBtn.setAttribute("aria-label", label);
    expandBtn.title = label;
    state.expanded = expanded;
    saveState();
    // Cost tables were sized for the old width.
    fitAllPres();
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  expandBtn.addEventListener("click", function () {
    setExpanded(!app.classList.contains("wts-chat--expanded"));
  });

  // ---- open/close ------------------------------------------------------

  function setOpen(open) {
    app.classList.toggle("wts-chat--open", open);
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label",
      open ? "Close admissions assistant chat" : "Open admissions assistant chat");
    state.open = open;
    // Opening collapses the labeled launcher pill to the quieter icon
    // circle. Deliberately not persisted: a fresh page load gets the
    // full "Get instant answers" pill back, so the entry point stays
    // prominent on every page of the visit.
    if (open) app.classList.add("wts-chat--engaged");
    saveState();
    if (open) {
      fitAllPres();
      input.focus();
    }
  }

  launcher.addEventListener("click", function () {
    setOpen(!app.classList.contains("wts-chat--open"));
  });
  closeBtn.addEventListener("click", function () {
    setOpen(false);
    launcher.focus();
  });
  panel.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setOpen(false);
      launcher.focus();
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    send(input.value);
  });
  // Explicit Enter handling too: implicit form submission is skipped for
  // synthetic key events (test drivers) and some IME edge cases.
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      send(input.value);
    }
  });

  restoreTranscript();
  if (state.expanded) setExpanded(true);
  if (state.open) setOpen(true);
}
