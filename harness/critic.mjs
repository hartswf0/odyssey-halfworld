#!/usr/bin/env node
/* ============================================================================
   critic.mjs — WATCH THE FILM THE WAY A SUSPICIOUS VIEWER WOULD.

   Not "does it render". Rendering is not the bar. The bar is: can you SEE it,
   and is it worth seeing. Four hundred and thirty assets were authored for
   this film. Nobody has ever checked how many of them actually reach the
   screen at a size a human can read, and the honest guess is that a large
   number were drawn in loving detail and then shown at the size of a thumb.

   WHAT IT MEASURES, per scene and per asset:

     · ON-SCREEN HEIGHT, as a fraction of frame height, AFTER the camera crop.
       This is the number that matters and the one nothing in the pipeline has
       ever reported. An asset 0.06 of frame height is 43 pixels at 720p — it
       is below the resolving power of the halftone, so whatever was drawn
       inside it is not in the film, whatever the atlas says.
     · IN FRAME AT ALL. The camera crops to the speaker. A set piece placed at
       the edge of the stage during a CLOSE is simply absent, and no error is
       raised, because being cropped out is not a failure condition anywhere.
     · CROWDING. How many distinct bodies are inside the crop at once. Past
       about four, a 1280-wide frame cannot give any of them enough width to
       read, and the frame becomes the tangle the user kept flagging.

   AND, for the close-up question: which lines would actually earn a face.
   The film already marks one key beat per scene — but it picks it by LENGTH
   (`if(L>keyLen)`), which is a proxy for importance, not importance. This
   reports the key beats WITH their speakers and durations so the faces can be
   chosen deliberately, a shortlist rather than a cast of ninety.

     node harness/critic.mjs                  the full audit
     node harness/critic.mjs --json out.json  machine-readable
   ========================================================================= */

import { existsSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "/Users/gaia/node_modules/playwright/index.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const JSONOUT = arg("--json", null);

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
await page.goto(`http://127.0.0.1:${port}/odyssey-syncwatch.html?render=1`, { waitUntil: "load", timeout: 180000 });
await page.waitForFunction(() => window.__sync && window.__sync.render, null, { timeout: 240000 });
await page.evaluate(() => window.__sync.render.size(1280, 720));

console.log(`\nTHE CRITIC PASS — 152 scenes, every asset measured at the size it reaches the screen\n`);

/* Walk every scene. At each of three moments (open / key beat / close) read
   the layout and the camera rectangle, and record what each placed asset is
   actually worth on screen. */
const rows = await page.evaluate(async () => {
  const S = window.__sync, out = [];
  for (const sc of S.FILM) {
    let B = null;
    try { B = await S.sceneBundle(sc); } catch (e) { }
    if (!B || !B.rs) { out.push({ scene: sc.id, book: sc.book, dead: true }); continue; }
    const marks = [0.12, 0.5, 0.88];
    for (const m of marks) {
      const tS = sc.total * m;
      let placed = null;
      /* 672x456 IS THE STAGE. Passing 1120x760 here — the atlas card size —
         put every position in a coordinate system 1.67x larger than the camera
         rectangle it was about to be compared against, and the first run of
         this file duly reported that 43% of everything falls outside the crop.
         It was measuring a unit mismatch. */
      try { placed = B.rs.layout(672, 456, tS); } catch (e) { continue; }
      if (!placed) continue;
      /* drive the real clock so CAM is the real camera, not a guess */
      await S.render.frame(sc.offset + sc.total * m);
      const cam = S.shot.rect, size = S.shot.size;
      for (const p of placed) {
        const inX = p.x > cam.x && p.x < cam.x + cam.w;
        const hFrac = p.h / cam.h;                   // fraction of FRAME height
        out.push({ scene: sc.id, book: sc.book, mark: m, shot: size,
          asset: p.it && p.it.spId ? p.it.spId : (p.instance || "?"),
          type: p.type, inFrame: inX, hFrac: +hFrac.toFixed(4),
          crowd: placed.filter((q) => q.figure && q.x > cam.x && q.x < cam.x + cam.w).length });
      }
    }
  }
  return out;
});

/* key beats: the film's own nomination for the line that matters, per scene */
const beats = await page.evaluate(async () => {
  const S = window.__sync, out = [];
  for (const sc of S.FILM) {
    if (sc.keyGi < 0) { out.push({ scene: sc.id, book: sc.book, none: true }); continue; }
    /* the segments belong to the SCENE, not to the bundle — sc.segments for
       timing and sc.dsegs for the dialogue. Reading B.segs returned undefined
       for all 152 and the report said "0 speakers hold a key beat", which is
       not a finding, it is a typo wearing one. */
    const seg = (sc.segments || []).find((x) => x.gi === sc.keyGi);
    const d = sc.dsegs ? sc.dsegs[sc.keyGi] : null;
    out.push({ scene: sc.id, book: sc.book, len: sc.keyLen,
      speaker: d ? (d.speakerName || d.speakerId) : null,
      id: d ? d.speakerId : null,
      line: d ? String(S.lineOf(d) || "").slice(0, 90) : null,
      dur: seg ? +seg.dur.toFixed(1) : null });
  }
  return out;
});

await browser.close(); srv.close();
if (JSONOUT) writeFileSync(JSONOUT, JSON.stringify({ rows, beats }, null, 1));

/* ---- 1 · assets we made and never really showed -------------------------- */
const best = new Map();   // asset -> best on-screen height it ever achieves
const seen = new Map();   // asset -> times placed
for (const r of rows) {
  if (r.dead) continue;
  seen.set(r.asset, (seen.get(r.asset) || 0) + 1);
  const b = best.get(r.asset);
  if (!b || (r.inFrame && r.hFrac > b.hFrac)) if (r.inFrame) best.set(r.asset, r);
}
const READ = 0.18;   // ~130px at 720p: below this a drawn interior cannot print
const buried = [...seen.keys()]
  .map((a) => ({ a, n: seen.get(a), best: best.get(a) }))
  .filter((x) => !x.best || x.best.hFrac < READ)
  .sort((a, b) => b.n - a.n);

console.log(`── 1 · MADE, PLACED, NEVER LEGIBLE ──────────────────────────────`);
console.log(`   ${buried.length} of ${seen.size} placed assets never once reach ${READ} of frame height.`);
console.log(`   (${Math.round(READ * 720)}px at 720p — under that, whatever is drawn inside does not print.)\n`);
for (const x of buried.slice(0, 22))
  console.log(`   ${String(x.n).padStart(3)}× placed · best ${(x.best ? x.best.hFrac : 0).toFixed(3)} of frame · ${x.a}`);

/* ---- 2 · cropped clean out of frame -------------------------------------- */
const cropped = rows.filter((r) => !r.dead && !r.inFrame);
const byShot = {};
for (const r of rows) if (!r.dead) { (byShot[r.shot] ||= { in: 0, out: 0 })[r.inFrame ? "in" : "out"]++; }
console.log(`\n── 2 · PLACED BUT OUTSIDE THE CAMERA ────────────────────────────`);
for (const [s, v] of Object.entries(byShot))
  console.log(`   ${s.padEnd(6)} ${v.out} of ${v.in + v.out} placements fall outside the crop (${Math.round(v.out / (v.in + v.out) * 100)}%)`);

/* ---- 3 · crowding -------------------------------------------------------- */
const crowds = rows.filter((r) => !r.dead && r.crowd >= 5);
const crowdScenes = [...new Set(crowds.map((r) => r.scene))];
console.log(`\n── 3 · TOO MANY BODIES IN ONE FRAME ─────────────────────────────`);
console.log(`   ${crowdScenes.length} scenes put 5+ figures inside the crop at once.`);
console.log(`   ${crowdScenes.slice(0, 14).join("  ")}`);

/* ---- 4 · the faces actually worth building ------------------------------- */
const byWho = new Map();
for (const b of beats) {
  if (b.none || !b.speaker) continue;
  const e = byWho.get(b.speaker) || { n: 0, sec: 0, scenes: [] };
  e.n++; e.sec += b.dur || 0; e.scenes.push(b.scene);
  byWho.set(b.speaker, e);
}
const ranked = [...byWho.entries()].sort((a, b) => b[1].sec - a[1].sec);
const totalSec = ranked.reduce((s, [, v]) => s + v.sec, 0);
console.log(`\n── 4 · WHOSE FACE WOULD ACTUALLY BE ON SCREEN ───────────────────`);
console.log(`   ${ranked.length} distinct speakers hold a key beat, over ${Math.round(totalSec)}s of key-beat time.\n`);
let run = 0;
ranked.forEach(([who, v], i) => {
  run += v.sec;
  if (i < 18) console.log(`   ${String(i + 1).padStart(2)}. ${who.padEnd(26)} ${String(v.n).padStart(3)} beats · ${String(Math.round(v.sec)).padStart(4)}s · ${(run / totalSec * 100).toFixed(0)}% cumulative`);
});
for (const cut of [6, 10, 14, 20]) {
  const c = ranked.slice(0, cut).reduce((s, [, v]) => s + v.sec, 0);
  console.log(`   → build ${String(cut).padStart(2)} faces and you cover ${(c / totalSec * 100).toFixed(0)}% of key-beat time`);
}
console.log();
