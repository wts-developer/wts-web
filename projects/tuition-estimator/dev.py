#!/usr/bin/env python3
"""Dev server for live feedback sessions.

Serves dist/ on localhost, re-runs build.py whenever anything in src/ (or
build.py itself) changes, and injects a tiny poller into served HTML pages so
the browser reloads itself about a second after each successful rebuild.
Nothing here touches the committed build outputs' content.

Standard library only. Run with: python3 dev.py [port]   (default 8437)
"""
import subprocess
import sys
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8437

_version = 0
_lock = threading.Lock()


def snapshot():
    files = [ROOT / "build.py", *sorted((ROOT / "src").iterdir())]
    return tuple((f.name, f.stat().st_mtime_ns) for f in files if f.is_file())


def watcher():
    global _version
    last = None
    while True:
        try:
            snap = snapshot()
        except OSError:
            time.sleep(0.5)
            continue
        if snap != last:
            if last is not None:
                print("change detected, rebuilding...", flush=True)
            result = subprocess.run(
                [sys.executable, str(ROOT / "build.py")],
                capture_output=True, text=True, cwd=ROOT,
            )
            if result.returncode == 0:
                with _lock:
                    _version += 1
                print(result.stdout.strip(), flush=True)
            else:
                # Keep serving the last good build; the browser stays put.
                print("BUILD FAILED:\n" + result.stderr, flush=True)
            last = snap
        time.sleep(0.5)


RELOAD_SNIPPET = b"""<script>
(function () {
  var seen = null;
  setInterval(function () {
    fetch("/__version").then(function (r) { return r.text(); }).then(function (v) {
      if (seen === null) { seen = v; return; }
      if (v !== seen) { location.reload(); }
    }).catch(function () {});
  }, 1000);
})();
</script>"""


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        path = self.path.split("?")[0].split("#")[0]
        if path == "/__version":
            with _lock:
                body = str(_version).encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path == "/":
            path = "/index.html"
        if path.endswith(".html"):
            file = DIST / path.lstrip("/")
            if file.is_file():
                body = file.read_bytes().replace(
                    b"</body>", RELOAD_SNIPPET + b"</body>", 1
                )
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
        super().do_GET()

    def log_message(self, fmt, *args):
        pass


threading.Thread(target=watcher, daemon=True).start()
print(f"dev server ready: http://localhost:{PORT}/ (mockup)", flush=True)
print(f"standalone estimator: http://localhost:{PORT}/calculator-standalone.html", flush=True)
ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
