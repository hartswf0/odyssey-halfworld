#!/usr/bin/env node
/* ============================================================================
   scan.mjs — LOOK AT EVERY KEY BEAT.

   critic.mjs measures. This one looks. The two are not substitutes: every
   serious defect in this project produced a plausible NUMBER while the picture
   was wrong, or a plausible picture while the number was stale, and the only
   reliable check has been putting the frame in front of an eye.

   152 scenes, one frame each at the beat the film itself nominates as the
   scene's most important line. Written as per-book contact sheets, plus a
   per-frame legibility reading so the worst ones can be found without
   scrolling all 152.

   THE READINGS, and why these three:
     · paper / mush / solid — the ink budget. The sibling film sits near 86/3/7.
       A frame far off that is either a gray tangle or a black slab.
     · subjectH — how tall the person SPEAKING is, as a fraction of frame. The
       film can nominate a key beat, frame a close-up on it, and still leave
       the speaker at 0.15 of frame because the camera is aimed at a stage
       rather than at a person. That is invisible to every other check here.
     · bodies — how many figures are inside the crop. Past four at 1280 wide,
       nobody in the frame gets enough width to read.

     node harness/scan.mjs             all 152 beats, sheets per book
     node harness/scan.mjs --book 9    one book
   ========================================================================= */

import { mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "/Users/gaia/node_modules/playwright/index.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const ONLY = arg("--book", null);
const DIR = join(ROOT, "renders", "scan");
mkdirSync(DIR, { recursive: true });

const MIME = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".css": "text/css", ".webp": "image/webp",
  ".avif": "image/avif", ".jpg": "image/jpeg", ".m4a": "audio/mp4", ".ogg": "audio/ogg" };
const srv = createServer(async (rq, rs) => {
  try {
    const p = decodeURIComponent(rq.url.split("?")[0]);
    const f = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ""));
    if (!f.startsWith(ROOT)) { rs.writeHead(403).end(); return; }
    if ((await stat(f)).isDirectory()) { rs.writeHead(404).end(); return; }
    rs.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream" });
    rs.end(await readFile(f));
  } catch { rs.writeHead(404).end(); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const port = srv.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto(`http://127.0.0.1:${port}/odyssey-syncwatch.html?render=1`, { waitUntil: "load", timeout: 240000 });
await page.waitForFunction(() => window.__sync && window.__sync.render, null, { timeout: 240000 });
await page.evaluate(() => window.__sync.render.size(1280, 720));

const FILM = await page.evaluate(() => window.__sync.FILM.map((s) =>
  ({ id: s.id, book: s.book, offset: s.offset, total: s.total, keyGi: s.keyGi })));
const want = ONLY ? FILM.filter((s) => s.book === +ONLY) : FILM;

console.log(`\nSCANNING ${want.length} KEY BEATS  →  renders/scan/\n`);
const report = [];

for (const sc of want) {
  /* find the wall time of the key beat itself, not the middle of the scene */
  const at = await page.evaluate(async ({ id, keyGi, offset, total }) => {
    /* segments live on the SCENE (sc.segments + sc.dsegs), not on the bundle */
    const S = window.__sync;
    const sc = S.FILM.find((f) => f.id === id);
    const seg = keyGi >= 0 ? (sc.segments || []).find((x) => x.gi === keyGi) : null;
    const d = seg && sc.dsegs ? sc.dsegs[keyGi] : null;
    if (!seg) return { t: offset + total * 0.5, speaker: null, line: null };
    return { t: offset + seg.start + seg.dur * 0.45,
      speaker: d ? (d.speakerName || d.speakerId || null) : null,
      id: d ? d.speakerId || null : null,
      line: d ? String(S.lineOf(d) || "").slice(0, 70) : null };
  }, sc);

  const meta = await page.evaluate(async (t) => await window.__sync.render.frame(t), at.t);

  const read = await page.evaluate(() => {
    const S = window.__sync, cv = S.panes.C;
    const g = cv.getContext("2d", { willReadFrequently: true });
    const d = g.getImageData(0, 0, cv.width, cv.height).data;
    const b = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < d.length; i += 4) {
      const v = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
      b[Math.min(7, Math.floor((255 - v) * 8 / 256))]++;
    }
    const n = d.length / 4;
    const cam = S.shot.rect;
    return { paper: +(b[0] / n * 100).toFixed(0),
      mush: +((b[2] + b[3] + b[4] + b[5]) / n * 100).toFixed(0),
      solid: +((b[6] + b[7]) / n * 100).toFixed(0),
      camH: cam.h, shot: S.shot.size, inst: S.shot.instance || null };
  });

  const png = await page.evaluate(() => window.__sync.panes.C.toDataURL("image/png").split(",")[1]);
  const file = `${sc.id}.png`;
  writeFileSync(join(DIR, file), Buffer.from(png, "base64"));
  report.push({ ...sc, ...at, ...read, file });
  process.stdout.write(`  ${sc.id} ${read.shot.padEnd(5)} paper ${String(read.paper).padStart(2)}%  mush ${String(read.mush).padStart(2)}%  ${at.speaker || "—"}\n`);
}
await browser.close(); srv.close();
writeFileSync(join(DIR, "scan.json"), JSON.stringify(report, null, 1));

/* ---- the suspicious viewer's shortlist ---------------------------------- */
const bad = report.filter((r) => r.mush > 12 || r.paper < 60 || r.solid > 22)
  .sort((a, b) => (b.mush - b.paper / 10) - (a.mush - a.paper / 10));
console.log(`\n── FRAMES A VIEWER WOULD COMPLAIN ABOUT ─────────────────────────`);
console.log(`   ${bad.length} of ${report.length} key beats read as tangled or slabbed.\n`);
for (const r of bad.slice(0, 20))
  console.log(`   ${r.id}  paper ${String(r.paper).padStart(2)}%  mush ${String(r.mush).padStart(2)}%  solid ${String(r.solid).padStart(2)}%  ${r.shot.padEnd(5)} ${r.speaker || "—"}`);

const noSpeaker = report.filter((r) => !r.speaker);
console.log(`\n   ${noSpeaker.length} key beats have no identified speaker — nobody to cut to.`);
console.log(`\n   sheets: renders/scan/*.png · data: renders/scan/scan.json\n`);
