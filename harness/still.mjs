#!/usr/bin/env node
/* ============================================================================
   still.mjs — GRAB FRAMES THROUGH THE FILM'S OWN RENDERER.

   Not a preview, not an approximation. This drives the exact call the film
   render drives — window.__sync.render.frame(t) at the film's size — and
   writes the composite canvas out as a PNG. A still taken this way is a frame
   of the film; anything else is a picture of something that resembles it, and
   the whole history of this project is defects that looked fine in the
   resembling thing.

   WHY IT TAKES SCENE IDS AND NOT SECONDS

   A time is meaningless to look at. "OD-B09-S04@0.6" is a scene and a fraction
   through it, which is how you actually ask for a shot — and it stays valid
   when the audio is remeasured and every absolute offset moves.

     node harness/still.mjs --out before OD-B09-S04@0.6 OD-B21-S02@0.35
     node harness/still.mjs --out after --shot CLOSE --book 9      sample a book
   ========================================================================= */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "/Users/gaia/node_modules/playwright/index.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const OUT = arg("--out", "still");
const W = +arg("--w", 1280), H = Math.round(W * 9 / 16);
const DIR = join(ROOT, "renders", "tests");
const picks = process.argv.slice(2).filter((a) => /^OD-B\d+-S\d+/.test(a));
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
page.on("pageerror", (e) => console.log(`  page error: ${e.message}`));
await page.goto(`http://127.0.0.1:${port}/odyssey-syncwatch.html?render=1`, { waitUntil: "load", timeout: 180000 });
await page.waitForFunction(() => window.__sync && window.__sync.render, null, { timeout: 180000 });
await page.evaluate(({ w, h }) => window.__sync.render.size(w, h), { w: W, h: H });

const FILM = await page.evaluate(() => window.__sync.FILM.map((s) => ({ id: s.id, offset: s.offset, total: s.total })));
const want = picks.length ? picks : FILM.slice(0, 6).map((s) => `${s.id}@0.5`);

console.log(`STILLS → renders/tests/  ${W}x${H}\n`);
for (const spec of want) {
  const [id, fracS] = spec.split("@");
  const sc = FILM.find((s) => s.id === id);
  if (!sc) { console.log(`  ${spec}: no such scene`); continue; }
  const frac = Math.max(0, Math.min(0.999, +fracS || 0.5));
  const t = sc.offset + sc.total * frac;
  const meta = await page.evaluate(async (t) => await window.__sync.render.frame(t), t);
  const b64 = await page.evaluate(() => window.__sync.panes.C.toDataURL("image/png").split(",")[1]);
  const name = `${OUT}-${id}-${Math.round(frac * 100)}.png`;
  writeFileSync(join(DIR, name), Buffer.from(b64, "base64"));
  console.log(`  ${name}  ${meta.shot}${meta.subject ? " · " + meta.subject : ""}`);
}
await browser.close(); srv.close();
