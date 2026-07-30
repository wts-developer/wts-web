#!/usr/bin/env python3
"""Publish the tuition page + chatbot UAT plan to Notion.

Creates, under a parent page you choose, one hub page containing the
briefing content plus two inline databases: Test Cases (seeded) and Bug
Reports (empty, ready for testers).

Setup (one time):
  1. Create an internal integration at https://www.notion.so/my-integrations
     in the WTS workspace and copy its secret.
  2. On the Notion page that should contain the plan: ... menu ->
     Connections -> add your integration.
  3. Grab that page's id from its URL (the 32-hex-character tail; dashes
     optional).

Run:
  NOTION_TOKEN=secret_xxx NOTION_PARENT_PAGE_ID=xxxx python3 publish_notion.py

Standard library only, matching this repo's build convention. Rerunning
creates a fresh page each time (nothing is overwritten); delete old
copies in Notion if you iterate.
"""
import json
import os
import sys
import time
import urllib.request
from pathlib import Path


def load_dotenv():
    """Read KEY=VALUE lines from a .env next to this script, if present.

    Real environment variables win over .env values. The .env file is
    gitignored; copy .env.example to .env and paste your values in.
    """
    env_file = Path(__file__).resolve().parent / ".env"
    if not env_file.is_file():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


load_dotenv()

TOKEN = os.environ.get("NOTION_TOKEN", "").strip()
PARENT = os.environ.get("NOTION_PARENT_PAGE_ID", "").strip().replace("-", "")
UAT_URL = "https://wts-developer.github.io/wts-web/tuition-estimator/?api=https://hedwig-webchat-api.onrender.com"

if not TOKEN or not PARENT:
    sys.exit("Set NOTION_TOKEN and NOTION_PARENT_PAGE_ID (see docstring).")


def api(method, path, payload=None):
    req = urllib.request.Request(
        f"https://api.notion.com/v1/{path}",
        data=json.dumps(payload).encode() if payload is not None else None,
        method=method,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            out = json.load(resp)
    except urllib.error.HTTPError as e:
        sys.exit(f"Notion API error {e.code} on {path}:\n{e.read().decode()}")
    time.sleep(0.4)  # stay politely under the ~3 req/s limit
    return out


# ---- tiny block builders --------------------------------------------

def rt(text, bold=False, code=False, link=None):
    node = {"type": "text", "text": {"content": text}}
    if link:
        node["text"]["link"] = {"url": link}
    ann = {}
    if bold:
        ann["bold"] = True
    if code:
        ann["code"] = True
    if ann:
        node["annotations"] = ann
    return node


def block(kind, rich, **extra):
    return {"object": "block", "type": kind, kind: {"rich_text": rich, **extra}}


def h1(t):
    return block("heading_1", [rt(t)])


def h2(t):
    return block("heading_2", [rt(t)])


def p(*nodes):
    return block("paragraph", list(nodes))


def bullet(*nodes):
    return block("bulleted_list_item", list(nodes))


def num(*nodes):
    return block("numbered_list_item", list(nodes))


def callout(emoji, *nodes):
    return block("callout", list(nodes), icon={"type": "emoji", "emoji": emoji})


def divider():
    return {"object": "block", "type": "divider", "divider": {}}


# ---- page content ----------------------------------------------------

PAGE_BLOCKS = [
    callout("🎯",
            rt("What we're testing: ", bold=True),
            rt("the new Tuition Savings Calculator and the tuition chat "
               "assistant, embedded together on a living copy of the "
               "wts.edu tuition page. Use this exact link so the chat "
               "answers from the live engine: "),
            rt("UAT test page", link=UAT_URL),
            rt(". Please test on both a desktop browser and your phone.")),
    p(rt("Timebox: about 30 minutes. Work through the Test Cases table "
         "below, mark each Pass or Fail, and file anything broken or "
         "confusing in Bug Reports. Confusing counts as much as broken: "
         "if you had to think twice, that is a finding.")),

    h2("Before you start"),
    num(rt("Open the "), rt("UAT test page", link=UAT_URL),
        rt(" and hard refresh (Cmd+Shift+R, or Ctrl+Shift+R on Windows) "
           "so you have the latest build.")),
    num(rt("The first chat reply can take up to 30 seconds if the answer "
           "service was idle. Later replies are fast. Not a bug.")),
    num(rt("Claim a few unassigned rows in Test Cases by putting your "
           "name in Tester, or just start at the top.")),

    h2("Known quirks (please do not file these)"),
    bullet(rt("Estimates include the $100 application fee, so totals read "
              "$100 higher than tuition alone. The calculator and the "
              "chatbot both do this, on purpose.")),
    bullet(rt("This is a captured copy of the tuition page: some header "
              "and footer links lead to the real wts.edu site. That is "
              "expected; use the back button.")),
    bullet(rt("The chat allows 20 messages per minute per person. "
              "Rapid-fire testing may briefly hit that limit.")),
    bullet(rt("Advanced-degree enrollment deposits (ThM, DMin, PhD) are "
              "intentionally not shown yet; policy is being confirmed.")),

    h2("How to report"),
    p(rt("File bugs in the Bug Reports table below. A good report has: "
         "what you did (exact clicks and values), what you expected, "
         "what actually happened, and your device and browser. "
         "Screenshots are gold: drag them into the row. If in doubt "
         "whether something is a bug, file it anyway.")),
    divider(),
]

STATUS_OPTIONS = [
    {"name": "Not started", "color": "gray"},
    {"name": "Pass", "color": "green"},
    {"name": "Fail", "color": "red"},
    {"name": "Blocked", "color": "yellow"},
]

AREA_OPTIONS = [
    {"name": "Calculator", "color": "blue"},
    {"name": "Chatbot", "color": "purple"},
    {"name": "Cross-check", "color": "orange"},
    {"name": "Mobile", "color": "pink"},
]

# (area, title, steps, expected)
CASES = [
    ("Calculator", "Select each program card",
     "In Step 1, click every program card, including both on-campus MDiv "
     "variants.",
     "Each card highlights when selected; Step 3 updates every time; the "
     "white summary panel shows the right full program name and modality "
     "pill(s)."),
    ("Calculator", "MATS baseline estimate",
     "Select MATS (Online). Leave outside support at $0, start term "
     "September 2026.",
     "Estimated cost after support reads $26,425 (tuition $26,325 plus "
     "the $100 application fee)."),
    ("Calculator", "Over-cap outside support (MATS)",
     "MATS selected with the Matching Scholarship. Enter 6000 in "
     "additional support.",
     "Outside Support shows $6,000, Westminster Scholarship Support shows "
     "$5,000 (the cap), and the estimate drops by $11,000 total."),
    ("Calculator", "Scholarship selector changes the math (MATS)",
     "On MATS, switch from Matching Scholarship to the Advancing Women's "
     "Ministry Scholarship, with $2,500 outside support entered.",
     "The match disappears, Westminster support becomes 25% of tuition, "
     "outside support still applies, the footnote about matchable "
     "sources disappears, and the asterisk leaves the Outside Support "
     "box."),
    ("Calculator", "Maximum Matching Scholarship button",
     "On each of MAC, online MDiv, and online MAR, click the wide "
     "'Maximum Matching Scholarship amount' button.",
     "The support field fills with the shown amount and Westminster "
     "Scholarship Support equals it exactly. The button is absent for "
     "AWM, PhD, and on-campus programs."),
    ("Calculator", "Start term changes the numbers",
     "On MATS, change 'When do you plan to start?' from September 2026 "
     "to September 2027.",
     "The estimate rises (all credits price at $750), and the note under "
     "the dropdown explains the $675 to $750 increase at June 2027."),
    ("Calculator", "On-campus programs show scholarship value",
     "Select MDiv (On Campus) General Ministries, then Pastoral Fellows, "
     "then MAR (On Campus).",
     "Step 2 disappears, the results card becomes Step 2, tuition before "
     "support shows about $212,010 / $243,978 / $159,026 respectively, "
     "estimated cost is $100 (application fee), and the footnote covers "
     "the Commitment Fee and $250 per-term student fee."),
    ("Calculator", "Doctoral and ThM programs",
     "Select ThM, DMin, and PhD in turn. For DMin, enter 6800 as "
     "ministry partner payments.",
     "ThM shows both modality pills. DMin lands at $13,700 with $6,800 "
     "entered (brochure scenario plus application fee). PhD shows no "
     "matching box and notes committee scholarships."),
    ("Calculator", "Tiles match the pie chart",
     "With any program and support amounts entered, compare the three "
     "colored boxes to the pie chart legend.",
     "Names, colors, and dollar amounts agree between boxes and pie; "
     "gold is the estimated cost in both."),
    ("Chatbot", "Open and close the chat",
     "Click 'Get instant answers' bottom-right; send 'hi'; close and "
     "reopen the panel.",
     "Panel opens with a greeting, responds to hi, and the transcript "
     "survives close and reopen."),
    ("Chatbot", "MATS cost with a raise",
     "Ask: How much does the MATS cost if I raise $3,000?",
     "A formatted breakdown shows blended tuition ($675/hr then $750/hr "
     "from June 2027), a $3,000 raise matched by $3,000 from WTS, and a "
     "bottom line of $20,425."),
    ("Chatbot", "Online MDiv with pace",
     "Ask: How much does the online MDiv cost at 2 courses per term?",
     "The reply includes a plan line (2 courses/term, about 19 terms) "
     "and the blended rate header, and mentions the matching "
     "scholarship's $675 per term / 25% from AY27-28 structure."),
    ("Chatbot", "Nonsense input",
     "Ask something unrelated, like 'what is the cafeteria menu'.",
     "A polite fallback points you to an admissions counselor; no error, "
     "no crash, no made-up numbers."),
    ("Cross-check", "Calculator and chatbot agree",
     "In the calculator: MATS, matching scholarship, $3,000 support. In "
     "the chat: ask the same MATS $3,000 question.",
     "Both land on the same bottom line to the dollar ($20,425)."),
    ("Mobile", "Calculator layout on a phone",
     "Open the UAT link on your phone. Work through Steps 1 to 3 for any "
     "program.",
     "Cards stack cleanly with pills in the same position on every card, "
     "buttons are comfortably tappable and readable, nothing overflows "
     "sideways."),
    ("Mobile", "Chat on a phone",
     "On your phone, open the chat, send two questions, close and reopen.",
     "The panel fits the screen, the keyboard does not cover the input, "
     "and the transcript persists."),
    ("Cross-check", "Copy check everywhere",
     "Read every visible sentence in Steps 1 to 3 and one full chat "
     "reply, on either device.",
     "No typos, no stale numbers, nothing confusing or misleading. File "
     "wording nits as Low severity bugs; they are wanted."),
]

SEVERITY_OPTIONS = [
    {"name": "Blocker", "color": "red"},
    {"name": "High", "color": "orange"},
    {"name": "Medium", "color": "yellow"},
    {"name": "Low", "color": "gray"},
]


def main():
    page = api("POST", "pages", {
        "parent": {"page_id": PARENT},
        "icon": {"type": "emoji", "emoji": "🧮"},
        "properties": {"title": {"title": [rt("Tuition Calculator + Chatbot UAT")]}},
        "children": PAGE_BLOCKS,
    })
    page_id = page["id"]
    print(f"page created: {page['url']}")

    cases_db = api("POST", "databases", {
        "parent": {"type": "page_id", "page_id": page_id},
        "is_inline": True,
        "title": [rt("Test Cases")],
        "properties": {
            "Case": {"title": {}},
            "Area": {"select": {"options": AREA_OPTIONS}},
            "Steps": {"rich_text": {}},
            "Expected result": {"rich_text": {}},
            "Status": {"select": {"options": STATUS_OPTIONS}},
            "Tester": {"rich_text": {}},
            "Notes": {"rich_text": {}},
        },
    })
    print("test cases database created")

    for i, (area, title, steps, expected) in enumerate(CASES, 1):
        api("POST", "pages", {
            "parent": {"database_id": cases_db["id"]},
            "properties": {
                "Case": {"title": [rt(f"{i:02d}. {title}")]},
                "Area": {"select": {"name": area}},
                "Steps": {"rich_text": [rt(steps)]},
                "Expected result": {"rich_text": [rt(expected)]},
                "Status": {"select": {"name": "Not started"}},
            },
        })
    print(f"seeded {len(CASES)} test cases")

    api("POST", "databases", {
        "parent": {"type": "page_id", "page_id": page_id},
        "is_inline": True,
        "title": [rt("Bug Reports")],
        "properties": {
            "Bug": {"title": {}},
            "Area": {"select": {"options": AREA_OPTIONS}},
            "Severity": {"select": {"options": SEVERITY_OPTIONS}},
            "Steps to reproduce": {"rich_text": {}},
            "Expected": {"rich_text": {}},
            "Actual": {"rich_text": {}},
            "Device / browser": {"rich_text": {}},
            "Status": {"select": {"options": [
                {"name": "New", "color": "red"},
                {"name": "Triaged", "color": "yellow"},
                {"name": "Fixed", "color": "green"},
                {"name": "Won't fix", "color": "gray"},
            ]}},
        },
    })
    print("bug reports database created")
    print("done")


if __name__ == "__main__":
    main()
