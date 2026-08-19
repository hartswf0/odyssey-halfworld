#!/usr/bin/env node
/* ============================================================================
   book-audio.mjs — GIVE EACH BOOK ITS OWN SOUND.

   render-film.mjs is video only, and build-film-audio.mjs produces ONE
   continuous 2h44m master on the film clock. So a book file straight out of
   the render is silent, which is how nineteen of them were handed over looking
   broken. This slices the master at each book's own offset and muxes it in.

   ---------------------------------------------------------------------------
   THE OFFSET IS NOT COMPUTED HERE, IT IS ACCUMULATED FROM THE SAME CLOCK

   Both the picture and the master are built from drive/voice-manifest.json in
   scene-id order: the film's clock is the running sum of 152 recordings. A
   book's audio therefore begins at the sum of every scene before its first,
   and runs for the sum of its own. Recomputing that here from the same source
   is the only way the slice can be guaranteed to line up — anything derived
   from the video files instead would be a measurement of the result rather
   than of the intent, and would drift the moment a segment boundary moved.

   THE CHECK THAT MATTERS. A book's video duration and its audio slice must
   agree to within a frame. They are produced by two entirely separate programs
   from one manifest; if they ever disagree, this is where it shows, and it
   refuses to write rather than shipping a book whose sound runs ahead of its
   picture.

     node harness/book-audio.mjs              mux every book that has none
     node harness/book-audio.mjs --force      redo them all
     node harness/book-audio.mjs --plan       print the slice table, write nothing
   ========================================================================= */

import { existsSync, readdirSync, statSync, renameSync, rmSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "/Users/gaia/node_modules/playwright/index.mjs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, normalize } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BOOKS = join(ROOT, "film", "books");
const MASTER = join(ROOT, "film", "odyssey-audio.m4a");
const PLAN = process.argv.includes("--plan");
const FORCE = process.argv.includes("--force");
const FF = ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/Users/gaia/anaconda3/bin/ffmpeg"]
  .find((p) => existsSync(p)) || "ffmpeg";
const FP = FF.replace(/ffmpeg$/, "ffprobe");
const dur = (f) => { try { return +execFileSync(FP, ["-v", "error", "-show_entries",
  "format=duration", "-of", "default=nw=1:nk=1", f], { encoding: "utf8" }).trim(); } catch { return 0; } };
const fmt = (s) => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, "0")}s`;

if (!existsSync(MASTER)) { console.error(`no audio master at ${MASTER}`); process.exit(1); }
console.log(`THE BOOKS, WITH SOUND\n`);
console.log(`  master ${fmt(dur(MASTER))} · ${(statSync(MASTER).size / 1048576).toFixed(0)} MB\n`);

/* ---- the film clock, from the page that defines it ---------------------- */
const MIME = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".css": "text/css", ".webp": "image/webp",
  ".avif": "image/avif", ".jpg": "image/jpeg", ".m4a": "audio/mp4", ".ogg": "audio/ogg" };
const srv = createServer(async (rq, rs) => {
  try {
    const p = decodeURIComponent(rq.url.split("?")[0]);
    const f = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ""));
    if (!f.startsWith(ROOT)) { rs.writeHead(403).end(); return; }
    if ((await stat(f)).isDirectory()) { rs.writeHead(404).end(); return; }
    const b = await readFile(f);
    rs.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream" });
    rs.end(b);
  } catch { rs.writeHead(404).end(); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const port = srv.address().port;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
await page.goto(`http://127.0.0.1:${port}/odyssey-syncwatch.html?render=1`, { waitUntil: "load", timeout: 180000 });
await page.waitForFunction(() => window.__sync && window.__sync.FILM && window.__sync.FILM.length,
  null, { timeout: 180000 });
const FILM = await page.evaluate(() => window.__sync.FILM.map((s) => ({ book: s.book, offset: s.offset, total: s.total })));
await browser.close(); srv.close();

const spans = new Map();
for (const s of FILM) {
  const e = spans.get(s.book) || { t0: Infinity, t1: -Infinity };
  e.t0 = Math.min(e.t0, s.offset); e.t1 = Math.max(e.t1, s.offset + s.total);
  spans.set(s.book, e);
}

let done = 0, skipped = 0, failed = 0;
for (const f of readdirSync(BOOKS).filter((f) => /^odyssey-book-\d+\.mp4$/.test(f)).sort()) {
  const book = +f.match(/(\d+)\.mp4/)[1];
  const sp = spans.get(book);
  const path = join(BOOKS, f);
  if (!sp) { console.log(`  book ${book}: no span in the manifest`); failed++; continue; }
  const streams = execFileSync(FP, ["-v", "error", "-show_entries", "stream=codec_type",
    "-of", "default=nw=1:nk=1", path], { encoding: "utf8" });
  const hasAudio = /audio/.test(streams);
  const vdur = dur(path), adur = sp.t1 - sp.t0;

  if (PLAN) {
    console.log(`  book ${String(book).padStart(2)}  ${fmt(sp.t0)} → ${fmt(sp.t1)}  ` +
      `audio ${adur.toFixed(2)}s · video ${vdur.toFixed(2)}s  ` +
      `${Math.abs(adur - vdur) < 0.05 ? "agree" : `** ${(adur - vdur).toFixed(2)}s APART **`}` +
      `${hasAudio ? "  (already has sound)" : ""}`);
    continue;
  }
  if (hasAudio && !FORCE) { skipped++; continue; }

  /* the check: two programs, one manifest. If they disagree, do not ship it. */
  if (Math.abs(adur - vdur) >= 0.05) {
    console.log(`  book ${String(book).padStart(2)}  ** picture ${vdur.toFixed(2)}s vs sound ${adur.toFixed(2)}s ` +
      `— ${(adur - vdur).toFixed(2)}s apart, refusing to mux **`);
    failed++; continue;
  }
  const tmp = path.replace(/\.mp4$/, ".snd.mp4");
  const r = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error",
    "-i", path, "-ss", sp.t0.toFixed(3), "-t", adur.toFixed(3), "-i", MASTER,
    "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
    "-movflags", "+faststart", tmp]);
  if (r.status !== 0) { console.log(`  book ${book}: mux FAILED`); rmSync(tmp, { force: true }); failed++; continue; }
  const got = dur(tmp);
  if (Math.abs(got - vdur) >= 0.15) {
    console.log(`  book ${String(book).padStart(2)}  ** muxed to ${got.toFixed(2)}s, wanted ${vdur.toFixed(2)}s **`);
    rmSync(tmp, { force: true }); failed++; continue;
  }
  renameSync(tmp, path);
  console.log(`  book ${String(book).padStart(2)} · ${fmt(vdur)} · from ${fmt(sp.t0)} of the master · ` +
    `${(statSync(path).size / 1048576).toFixed(0)} MB  ✓`);
  done++;
}
if (!PLAN) console.log(`\n  ${done} muxed · ${skipped} already had sound · ${failed} refused`);
if (failed) process.exitCode = 1;
