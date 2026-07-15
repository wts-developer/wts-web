/* WTS tuition chat logic. Written shadow-DOM-aware: everything scopes off
   the `root` (shadow root) and `app` (`.wts-chat` wrapper) passed to
   runChat(root, app, config) - no bare document.* DOM lookups, so build.py
   can inline this file without rewriting it.

   Talks to the Hedwig web-chat API (hedwig/webchat/ in the
   hedwig-admissions-slackbot repo): POST {apiBase}/api/chat
   {"message": "..."} -> {"reply": <Slack-mrkdwn string>, "routed": bool}.
   The reply is Slack mrkdwn because the same engine serves Slack; the
   mini-renderer below covers the three constructs tuition answers use
   (``` code blocks, *bold*, _italic_). */

function runChat(root, app, config) {
  "use strict";

  var STORAGE_KEY = "wtsTuitionChat.v1";
  var MAX_TRANSCRIPT = 40;

  // Cost-framed questions only: the engine answers duration questions
  // ("how long at N courses/term?") with a cost-first reply that reads
  // mismatched, so don't suggest that phrasing until the engine has a
  // duration-first framing.
  var SUGGESTIONS = [
    "How much does the MATS cost if I raise $3,000?",
    "What would the MAC cost me with 6 transfer credits?",
  ];

  var WELCOME =
    "Hi! I can estimate what a Westminster program would cost you, " +
    "including scholarships and how far the money you raise can go. " +
    "Try one of these, or ask in your own words:";

  var launcher = app.querySelector(".wts-chat__launcher");
  var panel = app.querySelector(".wts-chat__panel");
  var closeBtn = app.querySelector(".wts-chat__close");
  var messagesEl = app.querySelector(".wts-chat__messages");
  var form = app.querySelector(".wts-chat__composer");
  var input = app.querySelector(".wts-chat__input");
  var sendBtn = app.querySelector(".wts-chat__send");

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

  var state = loadState();
  if (!Array.isArray(state.transcript)) state.transcript = [];

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
    SUGGESTIONS.forEach(function (q) {
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
    addBubble("bot", WELCOME);
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
    return fetch(config.apiBase.replace(/\/$/, "") + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
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
        addBubble("bot", payload.reply);
        record("bot", payload.reply);
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

  // ---- open/close ------------------------------------------------------

  function setOpen(open) {
    app.classList.toggle("wts-chat--open", open);
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label",
      open ? "Close tuition assistant chat" : "Open tuition assistant chat");
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
  if (state.open) setOpen(true);
}
