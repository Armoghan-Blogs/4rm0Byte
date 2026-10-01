#!/usr/bin/env node
/**
 * termshot.mjs — render terminal transcripts to PNG for article illustrations.
 *
 * Matches the design language of the /terminal/ cyber-range page
 * (assets/css/terminal.css): same palette, same traffic-light chrome,
 * same prompt/ink colours.
 *
 * Usage:
 *   node scripts/termshot.mjs <bundle.json> [--out <dir>] [--scale <n>]
 *
 * <bundle.json> is an array of shots:
 *   [
 *     {
 *       "file": "01-ls-l.png",
 *       "title": "alice@web01: /var/log",
 *       "lines": [
 *         { "t": "cmd", "c": "ls -l /var/log" },
 *         { "t": "out", "c": "total 8" },
 *         { "t": "note", "c": "# comment" }
 *       ]
 *     }
 *   ]
 *
 * Line types: cmd (prompt + command), out (stdout), err (stderr),
 *             note (dimmed comment), ok (success), warn (warning), blank.
 */

import { readFile, mkdir } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

/**
 * Resolve Playwright from wherever it happens to live: a local
 * node_modules, the global install, or the npx cache. Lets the script run
 * without adding a heavy dev dependency to the repo.
 */
async function loadPlaywright() {
  const candidates = ["playwright", "playwright-core"];

  if (process.env.PLAYWRIGHT_MODULE) candidates.unshift(process.env.PLAYWRIGHT_MODULE);

  for (const name of candidates) {
    try {
      return await import(name);
    } catch {
      /* try the next candidate */
    }
  }

  // Fall back to scanning the npx cache for a playwright install.
  const npxRoot = join(process.env.HOME ?? "", ".npm/_npx");
  if (existsSync(npxRoot)) {
    for (const entry of readdirSync(npxRoot)) {
      const base = join(npxRoot, entry, "node_modules");
      for (const name of ["playwright", "playwright-core"]) {
        const p = join(base, name, "index.js");
        if (existsSync(p)) return await import(`file://${p}`);
      }
    }
  }

  console.error(
    "Could not resolve Playwright.\n" +
      "Install it with `npm i -D playwright` and `npx playwright install chromium`,\n" +
      "or set PLAYWRIGHT_MODULE to the package's entry point.",
  );
  process.exit(1);
}

const pw = await loadPlaywright();
const chromium = pw.chromium ?? pw.default?.chromium;

// ── Design tokens (mirrors assets/css/terminal.css) ────────────────────
const T = {
  bg1: "#06090f",
  bg2: "#0d1828",
  ink: "#d9e9ff",
  muted: "#8aa3c2",
  border: "rgba(120, 155, 195, 0.25)",
  cyan: "#00d7be",
  prompt: "#8fd4ff",
  green: "#7ff4ac",
  orange: "#ffbd85",
  red: "#ff9ab2",
};

const FONT_STACK = `"JetBrainsMono Nerd Font", "JetBrains Mono", "Noto Sans Mono", "DejaVu Sans Mono", monospace`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const LINE_COLORS = {
  out: T.ink,
  err: T.red,
  note: T.muted,
  ok: T.green,
  warn: T.orange,
  dim: T.muted,
};

/** Render a transcript line to HTML. */
function renderLine(line) {
  if (line.t === "blank") return `<div class="l">&nbsp;</div>`;

  if (line.t === "cmd") {
    // Optional prompt override, e.g. { "p": "root@web01:/var/log# " }
    const p = line.p ?? "$ ";
    return `<div class="l cmd"><span class="p">${esc(p)}</span>${esc(line.c)}<span class="cur"></span></div>`;
  }

  const color = LINE_COLORS[line.t] ?? T.ink;
  const extra = line.t === "note" || line.t === "dim" ? " italic" : "";
  return `<div class="l out" style="color:${color}"${extra ? " class-dim" : ""}>${esc(line.c)}</div>`;
}

function renderWindow(shot) {
  const title = shot.title ?? "Terminal";
  const body = (shot.lines ?? []).map(renderLine).join("\n");

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: transparent; }

  body {
    font-family: ${FONT_STACK};
    -webkit-font-smoothing: antialiased;
  }

  .win {
    width: ${shot.width ?? 1000}px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid ${T.border};
    background:
      radial-gradient(circle at 12% 14%, rgba(0, 215, 190, 0.10), transparent 34%),
      radial-gradient(circle at 88% 92%, rgba(255, 148, 82, 0.07), transparent 38%),
      linear-gradient(160deg, ${T.bg1} 0%, #09101a 48%, ${T.bg2} 100%);
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42);
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 0.42rem;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid ${T.border};
    background: rgba(10, 22, 35, 0.5);
  }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot.red   { background: #ff5f57; }
  .dot.amber { background: #febc2e; }
  .dot.green { background: #28c840; }
  .bar .t {
    margin: 0 0 0 0.5rem;
    font-size: 13px;
    color: ${T.muted};
    letter-spacing: 0.01em;
  }
  .bar .spacer { margin-left: auto; }
  .bar .badge {
    font-size: 11px;
    color: ${T.cyan};
    opacity: 0.85;
    letter-spacing: 0.04em;
    text-transform: lowercase;
  }

  .body {
    padding: 0.95rem 1.05rem 1.05rem;
    font-size: ${shot.fontSize ?? 15}px;
    line-height: 1.58;
  }

  .l {
    white-space: pre;
    color: ${T.ink};
  }
  .l.cmd { color: ${T.ink}; }
  .l .p { color: ${T.prompt}; }
  .l.class-dim { opacity: 0.92; }

  .cur {
    display: inline-block;
    width: 8px;
    height: 1.05em;
    margin-left: 2px;
    vertical-align: -2px;
    background: ${T.cyan};
    animation: blink 1.1s steps(1) infinite;
  }
  @keyframes blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
</style></head>
<body>
  <div class="win">
    <div class="bar">
      <span class="dot red"></span>
      <span class="dot amber"></span>
      <span class="dot green"></span>
      <p class="t">${esc(title)}</p>
      <span class="spacer"></span>
      ${shot.badge ? `<span class="badge">${esc(shot.badge)}</span>` : ""}
    </div>
    <div class="body">
${body}
    </div>
  </div>
</body></html>`;
}

// ── CLI ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const bundlePath = args.find((a) => !a.startsWith("--"));
if (!bundlePath) {
  console.error("usage: termshot.mjs <bundle.json> [--out <dir>] [--scale <n>]");
  process.exit(1);
}
const outFlag = args.indexOf("--out");
const scaleFlag = args.indexOf("--scale");
const browserFlag = args.indexOf("--browser");
const outDir = outFlag !== -1 ? args[outFlag + 1] : REPO_ROOT;
const scale = scaleFlag !== -1 ? Number(args[scaleFlag + 1]) : 2;

/**
 * Pick a Chromium binary: an explicit --browser / $CHROMIUM_PATH wins,
 * otherwise try the common system locations. Returns undefined to let
 * Playwright use its own bundled build.
 */
function resolveChromium() {
  const explicit = browserFlag !== -1 ? args[browserFlag + 1] : process.env.CHROMIUM_PATH;
  if (explicit) return explicit;

  const candidates = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  return candidates.find((p) => existsSync(p));
}

const shots = JSON.parse(await readFile(bundlePath, "utf8"));
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  // Playwright's bundled Chromium may not be downloaded; fall back to a
  // system browser so this works on a fresh machine.
  executablePath: resolveChromium(),
  args: ["--no-sandbox", "--font-render-hinting=none", "--disable-lcd-text"],
});
const page = await browser.newPage({
  viewport: { width: 1100, height: 700 },
  deviceScaleFactor: scale,
});

let n = 0;
for (const shot of shots) {
  const html = renderWindow(shot);
  await page.setContent(html, { waitUntil: "load" });
  // Let the webfont settle so metrics are stable before capture.
  await page.evaluate(() => document.fonts.ready);
  const el = await page.$(".win");
  const out = join(outDir, shot.file);
  await el.screenshot({ path: out });
  n++;
  console.log(`  ✓ ${shot.file}  (${shot.title ?? ""})`);
}

await browser.close();
console.log(`\n${n} screenshot(s) written to ${outDir}`);
