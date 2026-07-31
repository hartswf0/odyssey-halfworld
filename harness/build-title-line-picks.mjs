/* ============================================================
   build-title-line-picks.mjs · odyssey-halfworld
   Curation for odyssey-title-line.html — "show off the best generations".

   The line sequence shows 8–14 stills in the whole piece, so they have to be
   the strongest images in the repo, not a sample. This script measures every
   tile in viewer/title-tiles.json for computable image quality and writes a
   shortlist a human can read and edit by hand.

   MEASURES (per tile, decoded in a headless browser at 128px long edge)
     mean    Rec.709 luma, 0..1                    (already in title-tiles.json; re-measured)
     range   population stddev of luma             — flat/empty frames score near 0
     edge    Sobel gradient magnitude, normalised  — halftone structure + contour density
     ink     fraction of pixels below 0.45 luma    — guards against near-white cards

   SCORE   0.42·range' + 0.44·edge' + 0.14·midtone'      (' = normalised 0..1 over corpus)
     midtone' peaks when mean is near 0.62 — the exemplar's "plenty of paper showing"
     tonal balance. A near-black mass and a near-empty frame both fall away.

   PICKS
     · 12 stills, spread across the 24 books (>= 10 distinct books)
     · never two from the same scene id
     · scenes preferred (composed images); at most 3 exceptional asset cards
     · greedy: walk books in poem order, take that book's best unused candidate

   Usage
     node harness/build-title-line-picks.mjs                # measure + pick + write json
     node harness/build-title-line-picks.mjs --n 14         # different shortlist size
     node harness/build-title-line-picks.mjs --stills       # also render the picks big
     node harness/build-title-line-picks.mjs --force        # ignore the measure cache

   OUT  viewer/title-line-picks.json      (the shortlist — hand-editable)
        viewer/title-line-stills/*.webp   (--stills: full-res island images)
   ============================================================ */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TILES = resolve(ROOT, "viewer", "title-tiles.json");
const OUT = resolve(ROOT, "viewer", "title-line-picks.json");
const STILLS_DIR = resolve(ROOT, "viewer", "title-line-stills");
/* renders/tiles/** is whitelisted in .gitignore (the tile corpus is a deliverable),
   so the measure cache lives one level up where renders/* is still ignored */
const CACHE = resolve(ROOT, "renders", "_line-measure-cache.json");

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const N = Math.max(8, Math.min(14, +flag("n", 12) || 12));
const FORCE = argv.includes("--force");
const STILLS = argv.includes("--stills");
const MAX_ASSETS = 3;

/* ── static server ──────────────────────────────────────────────────────────── */
const MIME = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
               ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".css": "text/css" };
function startServer() {
  return new Promise(res => {
    const srv = createServer(async (req, resp) => {
      try {
        let p = decodeURIComponent(req.url.split("?")[0]);
        const f = resolve(ROOT, "." + p);
        if (!f.startsWith(ROOT)) { resp.writeHead(403); return resp.end(); }
        const body = await readFile(f);
        resp.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream", "cache-control": "no-store" });
        resp.end(body);
      } catch (e) { resp.writeHead(404); resp.end("404 " + e.message); }
    });
    srv.listen(0, "127.0.0.1", () => res({ srv, port: srv.address().port }));
  });
}

/* ── in-page measurement ────────────────────────────────────────────────────── */
const MEASURE = async (url) => {
  const img = new Image();
  img.src = url;
  await img.decode();
  const L = 128;
  const s = Math.min(L / img.naturalWidth, L / img.naturalHeight);
  const w = Math.max(2, Math.round(img.naturalWidth * s));
  const h = Math.max(2, Math.round(img.naturalHeight * s));
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  g.drawImage(img, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++)
    lum[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
  let sum = 0, ink = 0;
  for (let i = 0; i < lum.length; i++) { sum += lum[i]; if (lum[i] < 0.45) ink++; }
  const mean = sum / lum.length;
  let v = 0;
  for (let i = 0; i < lum.length; i++) { const dd = lum[i] - mean; v += dd * dd; }
  const range = Math.sqrt(v / lum.length);
  /* Sobel over the interior */
  let esum = 0, en = 0;
  const at = (x, y) => lum[y * w + x];
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const gx = -at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1)
             + at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1);
    const gy = -at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1)
             + at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1);
    esum += Math.hypot(gx, gy); en++;
  }
  return { mean, range, edge: esum / Math.max(en, 1) / 4, ink: ink / lum.length, w: img.naturalWidth, h: img.naturalHeight };
};

/* ── scoring ────────────────────────────────────────────────────────────────── */
const norm = (v, lo, hi) => hi > lo ? Math.max(0, Math.min(1, (v - lo) / (hi - lo))) : 0;
const pct = (arr, p) => { const a = arr.slice().sort((x, y) => x - y); return a[Math.max(0, Math.min(a.length - 1, Math.round(p * (a.length - 1))))]; };

function score(rows) {
  const rLo = pct(rows.map(r => r.range), 0.05), rHi = pct(rows.map(r => r.range), 0.98);
  const eLo = pct(rows.map(r => r.edge), 0.05), eHi = pct(rows.map(r => r.edge), 0.98);
  for (const r of rows) {
    const rangeN = norm(r.range, rLo, rHi);
    const edgeN = norm(r.edge, eLo, eHi);
    const midN = Math.max(0, 1 - Math.abs(r.mean - 0.62) / 0.30);
    r.rangeN = +rangeN.toFixed(4); r.edgeN = +edgeN.toFixed(4); r.midN = +midN.toFixed(4);
    r.score = +(0.42 * rangeN + 0.44 * edgeN + 0.14 * midN).toFixed(4);
    /* hard rejects: a flat frame, a near-black mass, a near-empty card */
    r.reject = r.range < 0.10 ? "flat"
             : r.mean < 0.30 ? "too dark"
             : r.mean > 0.90 ? "too empty"
             : r.ink < 0.04 ? "no ink"
             : null;
  }
  return rows;
}

/* greedy spread: one pass over the books in poem order, best unused per book */
function pick(rows, n) {
  const ok = rows.filter(r => !r.reject && r.book != null).sort((a, b) => b.score - a.score);
  const books = [...new Set(ok.map(r => r.book))].sort((a, b) => a - b);
  const takenScene = new Set(), takenBook = new Set();
  const out = [];
  let assets = 0;
  const tryTake = (r) => {
    if (out.length >= n) return false;
    if (takenScene.has(r.id)) return false;
    if (r.kind === "asset" && assets >= MAX_ASSETS) return false;
    takenScene.add(r.id); takenBook.add(r.book);
    if (r.kind === "asset") assets++;
    out.push(r);
    return true;
  };
  /* pass 1 — traverse the poem end to end: n evenly spaced books, first and last
     included, so the sequence lands in Book I and reaches Book XXIV. Within a book
     take its best SCENE (a composed image); fall back to its best asset card only
     while the asset budget lasts. */
  const ordered = [];
  for (let i = 0; i < n && books.length; i++)
    ordered.push(books[Math.round(i * (books.length - 1) / Math.max(1, n - 1))]);
  for (const b of books) if (!ordered.includes(b)) ordered.push(b);
  for (const b of ordered) {
    if (out.length >= n) break;
    if (takenBook.has(b)) continue;
    const pool = ok.filter(r => r.book === b && !takenScene.has(r.id));
    const bestScene = pool.find(r => r.kind === "scene");
    const bestAsset = pool.find(r => r.kind === "asset");
    /* an asset card gets in only if it is EXCEPTIONAL — clearly better than the
       best composed scene this book has to offer — and only 3 ever do */
    const cand = (bestAsset && assets < MAX_ASSETS
                  && (!bestScene || bestAsset.score > bestScene.score * 1.06))
                 ? bestAsset : (bestScene || (assets < MAX_ASSETS ? bestAsset : null));
    if (cand) tryTake(cand);
  }
  /* pass 2 — fill any remainder with the best left, still never two per scene */
  for (const r of ok) { if (out.length >= n) break; if (!takenBook.has(r.book)) tryTake(r); }
  for (const r of ok) { if (out.length >= n) break; tryTake(r); }
  return out.sort((a, b) => a.book - b.book || a.id.localeCompare(b.id));
}

/* ── main ───────────────────────────────────────────────────────────────────── */
async function main() {
  const t0 = Date.now();
  const tiles = JSON.parse(readFileSync(TILES, "utf8")).tiles.filter(t => t.kind !== "media");
  let cache = {};
  if (!FORCE && existsSync(CACHE)) { try { cache = JSON.parse(readFileSync(CACHE, "utf8")); } catch {} }

  const { srv, port } = await startServer();
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.goto(`${base}/harness/render-harness.html`, { waitUntil: "domcontentloaded" }).catch(() => {});

  const rows = [];
  let n = 0;
  for (const t of tiles) {
    let m = cache[t.file];
    if (!m) {
      try { m = await page.evaluate(MEASURE, `${base}/${t.file}`); cache[t.file] = m; }
      catch { continue; }
    }
    rows.push({ ...t, ...m });
    if (++n % 100 === 0) console.error(`  measured ${n}/${tiles.length}`);
  }
  try { writeFileSync(CACHE, JSON.stringify(cache)); } catch {}

  score(rows);
  const picks = pick(rows, N);

  /* ── high-res stills for the picks ────────────────────────────────────────── */
  if (STILLS) {
    if (!existsSync(STILLS_DIR)) mkdirSync(STILLS_DIR, { recursive: true });
    const scenesMod = {};
    for (const p of picks) {
      const isScene = p.kind === "scene";
      const modUrl = isScene ? `/scenes/${p.id}.mjs`
                             : `/assets/${p.type}/${p.id.split(".").slice(1).join(".")}.mjs`;
      let tSec = 8;
      if (isScene) {
        if (!scenesMod[p.id]) {
          try {
            const m = await import(new URL(`../scenes/${p.id}.mjs`, import.meta.url).href);
            scenesMod[p.id] = (m.scene || m.default || {}).duration || 40;
          } catch { scenesMod[p.id] = 40; }
        }
        tSec = Math.round(scenesMod[p.id] * p.t * 100) / 100;
      }
      const harness = isScene ? "/harness/render-scene-harness.html" : "/harness/render-harness.html";
      const q = new URLSearchParams(isScene
        ? { mod: modUrl, pipeline: "MESH", w: "1280", h: "868", dpr: "1", t: String(tSec) }
        : { mod: modUrl, pipeline: "MESH", w: "960", h: "1280", dpr: "1" });
      await page.goto(`${base}${harness}?${q}`, { waitUntil: "load", timeout: 60000 });
      await page.waitForFunction("window.__DONE__===true", { timeout: 60000 }).catch(() => {});
      /* BILEVEL + LOSSLESS. The renders are already ordered-dot halftone: the dots
         ARE the tone, so thresholding at mid-luma keeps the image and throws away
         only the anti-aliasing. That is both the house palette (paper, ink, nothing
         else) and a 14× file-size win — a 1280px still drops from ~630 KB of lossy
         webp to ~45 KB lossless, because a two-colour image is what webp-lossless
         is for. The page multiplies these over its own paper colour, so pure white
         becomes warm paper at draw time. */
      const url = await page.evaluate(() => {
        const cv = document.getElementById("stage");
        if (!cv || !cv.width) return null;
        const o = document.createElement("canvas");
        o.width = cv.width; o.height = cv.height;
        const g = o.getContext("2d", { willReadFrequently: true });
        g.drawImage(cv, 0, 0);
        const im = g.getImageData(0, 0, o.width, o.height), a = im.data;
        for (let i = 0; i < a.length; i += 4) {
          const l = 0.2126 * a[i] + 0.7152 * a[i + 1] + 0.0722 * a[i + 2];
          const v = l < 128 ? 0 : 255;
          a[i] = a[i + 1] = a[i + 2] = v; a[i + 3] = 255;
        }
        g.putImageData(im, 0, 0);
        return o.toDataURL("image/webp", 1);      // quality 1 → webp lossless
      });
      if (url && url.startsWith("data:image/webp")) {
        const f = `viewer/title-line-stills/${p.file.split("/").pop().replace(/\.png$/, "")}.webp`;
        writeFileSync(resolve(ROOT, f), Buffer.from(url.split(",")[1], "base64"));
        p.still = f;
        console.error(`  still ${f}`);
      }
    }
  } else {
    for (const p of picks) {
      const f = `viewer/title-line-stills/${p.file.split("/").pop().replace(/\.png$/, "")}.webp`;
      if (existsSync(resolve(ROOT, f))) p.still = f;
    }
  }

  await browser.close(); srv.close();

  const out = {
    built: new Date().toISOString(),
    note: "Shortlist for odyssey-title-line.html. HAND-EDITABLE: reorder, swap a file/id, "
        + "or override at runtime with ?picks=<tile ids, comma separated>. "
        + "`file` is the tile PNG; `still` (if present) is the full-res image the page prefers.",
    count: picks.length,
    picks: picks.map(p => ({
      id: p.id, kind: p.kind, type: p.type, book: p.book, t: p.t,
      file: p.file, still: p.still || null,
      mean: +p.mean.toFixed(4), range: +p.range.toFixed(4), edge: +p.edge.toFixed(4),
      ink: +p.ink.toFixed(4), score: p.score,
    })),
  };
  writeFileSync(OUT, JSON.stringify(out, null, 1));

  /* report */
  const L = [];
  L.push(`\n══ TITLE-LINE SHORTLIST ═══════════════════════════════════════`);
  L.push(`measured ${rows.length} tiles in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  L.push(`rejected ${rows.filter(r => r.reject).length} (flat / too dark / too empty / no ink)`);
  L.push(`\n bk  kind   id                                   range   edge   mean   score`);
  for (const p of picks)
    L.push(` ${String(p.book).padStart(2)}  ${p.kind.padEnd(6)} ${(p.id + (p.t != null ? `@${p.t}` : "")).padEnd(36)} `
         + `${p.range.toFixed(3)}  ${p.edge.toFixed(3)}  ${p.mean.toFixed(3)}  ${p.score.toFixed(3)}`);
  L.push(`\nbooks spanned   ${new Set(picks.map(p => p.book)).size} of 24`);
  L.push(`distinct scenes ${new Set(picks.map(p => p.id)).size} of ${picks.length}`);
  L.push(`asset cards     ${picks.filter(p => p.kind === "asset").length} (max ${MAX_ASSETS})`);
  L.push(`\nwrote ${OUT.replace(ROOT + "/", "")}`);
  L.push(`═══════════════════════════════════════════════════════════════`);
  console.log(L.join("\n"));
}
main().catch(e => { console.error(e); process.exit(1); });
