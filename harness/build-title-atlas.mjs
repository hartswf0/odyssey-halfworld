/* ============================================================================
   build-title-atlas.mjs — pack the title corpus into a handful of sprite
   sheets so odyssey-title.html can open on a phone.

   THE PROBLEM. odyssey-title.html fetched 886 separate PNGs (34 MB, avg 39 KB)
   before it could start — 886 round trips on a high-latency link — and then
   threw most of those pixels away: the tiles are 165×220 / 220×149 but the
   PHOTO MOSAIC draws them at ~7.75 design px and the COLLAGE/MONTAGE
   movements at 60–120 px.

   WHAT THIS WRITES
     viewer/title-atlas-micro.webp        720×720, every tile at 24×24,
                                          CENTRE-CROPPED SQUARE — exactly how
                                          drawSquare() crops. Serves the whole
                                          mosaic movement.
     viewer/title-atlas-thumb-N.webp      2016×… , every tile at cell 96,
                                          CONTAIN-fitted inside the cell so the
                                          collage keeps each tile's real aspect.
     viewer/title-atlas.json              the index.

   WHY WebP: these are grayscale halftones on warm paper — flat, few colours,
   hard edges. The script encodes every sheet as both PNG and WebP and prints
   the ratio it actually measured.

   THE LUMINANCE PROBLEM — and why this runs in Chromium.
   The page's tile→cell assignment is sorted by `lumDark`, which the page used
   to MEASURE in the browser: downscale the PNG to 40px, crush it through a
   canvas filter, average a 48×48 stretch of that. Re-sampling the corpus in a
   different engine would perturb those means by ~1e-3, which is enough to swap
   neighbours in the sorted reservoir and change every assignment hash.
   So this builder runs the page's OWN measurement code, verbatim, in the same
   engine, and bakes the results into the atlas. The atlas path then reproduces
   the per-PNG path's assignment hashes exactly — and, as a bonus, becomes
   independent of the viewer's image resampler, which the old path was not.

   ADDITIVE: reads renders/tiles/*.png + viewer/title-tiles.json; writes only
   viewer/title-atlas*. The per-tile PNGs stay on disk (they carry `mean`, and
   the FRAMES export and the punch-in may still want full resolution).

   Usage:  node harness/build-title-atlas.mjs [--quality 0.92] [--limit N]
   ========================================================================== */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const ARG = process.argv.slice(2);
const argOf = (k, d) => { const i = ARG.indexOf(k); return i >= 0 ? ARG[i + 1] : d; };
const QUALITY = +argOf("--quality", 0.92);
const LIMIT = +argOf("--limit", 0);

/* the two cells. MICRO is what the mosaic draws (7.75 design px, ~6 device px
   at 1920 — 24 is already 4× oversampled). THUMB is what the collage draws
   (60–120 design px, ≤96 device px at 1920). */
const MICRO = 24, THUMB = 96;
const MICRO_COLS = 30;                 // 30×30 = 900 cells ≥ 886, sheet 720×720
const THUMB_COLS = 21;                 // 21×96 = 2016 ≤ 2048
const THUMB_ROWS = 21;                 // 441 tiles a sheet
const PAPER = "#f4f4f0";

const MIME = { ".html":"text/html", ".mjs":"text/javascript", ".js":"text/javascript",
               ".json":"application/json", ".png":"image/png", ".webp":"image/webp" };

const BUILDER_PAGE = `<!doctype html><meta charset="utf-8"><title>atlas builder</title><body></body>`;

function startServer(){
  return new Promise(res => {
    const srv = createServer(async (req, resp) => {
      try{
        const p = decodeURIComponent(req.url.split("?")[0]);
        if (p === "/__atlas-builder"){
          resp.writeHead(200, { "content-type":"text/html" });
          return resp.end(BUILDER_PAGE);
        }
        const f = resolve(ROOT, "." + p);
        if (!f.startsWith(ROOT)){ resp.writeHead(403); return resp.end(); }
        const body = await readFile(f);
        resp.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream" });
        resp.end(body);
      }catch(e){ resp.writeHead(404); resp.end("404"); }
    });
    srv.listen(0, "127.0.0.1", () => res({ srv, port: srv.address().port }));
  });
}

/* ── the in-page builder. Everything inside runs in Chromium. ─────────────── */
async function inPage(cfg){
  const { tiles, MICRO, THUMB, MICRO_COLS, THUMB_COLS, THUMB_ROWS, PAPER, QUALITY } = cfg;

  /* ---- verbatim copies of odyssey-title.html's measurement chain ---- */
  const fitTo = (w,h,max) => { const s = Math.min(1, max/Math.max(w,h));
    return [Math.max(1,Math.round(w*s)), Math.max(1,Math.round(h*s))]; };
  const scratch = document.createElement("canvas");
  scratch.width = scratch.height = 48;
  const sctx = scratch.getContext("2d", { willReadFrequently:true });
  function measure(img){
    sctx.fillStyle = PAPER; sctx.fillRect(0,0,48,48);
    sctx.drawImage(img, 0, 0, 48, 48);
    const d = sctx.getImageData(0,0,48,48).data;
    let s = 0; for (let i=0;i<d.length;i+=4) s += (d[i]*.299 + d[i+1]*.587 + d[i+2]*.114);
    return s / (48*48) / 255;
  }
  const crushCv = document.createElement("canvas");
  const crushG = crushCv.getContext("2d");
  async function crush(src){
    crushCv.width = src.width; crushCv.height = src.height;
    crushG.fillStyle = PAPER; crushG.fillRect(0,0,src.width,src.height);
    crushG.filter = "grayscale(1) contrast(1.85) brightness(0.58)";
    crushG.drawImage(src, 0, 0);
    crushG.filter = "none";
    return await createImageBitmap(crushCv);
  }
  const MICRO_MAX = 40;                        // the page's own micro budget
  /* ------------------------------------------------------------------ */

  const sheet = (w,h) => { const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d", { alpha:false });
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.fillStyle = PAPER; g.fillRect(0,0,w,h);
    return { c, g }; };

  const n = tiles.length;
  const microRows = Math.ceil(n / MICRO_COLS);
  const micro = sheet(MICRO_COLS*MICRO, microRows*MICRO);

  const perSheet = THUMB_COLS * THUMB_ROWS;
  const nSheets = Math.ceil(n / perSheet);
  const thumbs = [];
  for (let s=0; s<nSheets; s++){
    const count = Math.min(perSheet, n - s*perSheet);
    const rows = Math.ceil(count / THUMB_COLS);
    thumbs.push(sheet(THUMB_COLS*THUMB, rows*THUMB));
  }

  const out = [], bad = [];
  for (let k=0; k<n; k++){
    const T = tiles[k];
    let probe;
    try{
      const r = await fetch(T.file);
      if (!r.ok) throw new Error("HTTP " + r.status);
      probe = await createImageBitmap(await r.blob());
    }catch(e){ bad.push({ id:T.id, file:T.file, err:String(e.message||e) }); continue; }

    const w = probe.width, h = probe.height;

    /* MICRO — cover-fit then centre-crop, so the cell is the same square
       drawSquare() would have cropped at draw time. */
    const cs = MICRO / Math.min(w,h);
    const [cw, ch] = [Math.max(MICRO, Math.round(w*cs)), Math.max(MICRO, Math.round(h*cs))];
    const cover = await createImageBitmap(probe, { resizeWidth:cw, resizeHeight:ch, resizeQuality:"high" });
    const mc = k % MICRO_COLS, mr = Math.floor(k / MICRO_COLS);
    micro.g.drawImage(cover, Math.floor((cw-MICRO)/2), Math.floor((ch-MICRO)/2), MICRO, MICRO,
                      mc*MICRO, mr*MICRO, MICRO, MICRO);
    cover.close && cover.close();

    /* THUMB — contain-fit, centred in the cell. The collage draws each tile
       into a box of its own aspect ratio, so the sheet must not crop. */
    const [tw, th] = fitTo(w, h, THUMB);
    const si = Math.floor(k / perSheet), ii = k % perSheet;
    const tc = ii % THUMB_COLS, tr = Math.floor(ii / THUMB_COLS);
    const fit = await createImageBitmap(probe, { resizeWidth:tw, resizeHeight:th, resizeQuality:"high" });
    thumbs[si].g.drawImage(fit, tc*THUMB + Math.floor((THUMB-tw)/2), tr*THUMB + Math.floor((THUMB-th)/2));
    fit.close && fit.close();

    /* LUMINANCE — the page's own chain, so the assignment hashes survive. */
    const [mw, mh] = fitTo(w, h, MICRO_MAX);
    const micro40 = await createImageBitmap(probe, { resizeWidth:mw, resizeHeight:mh, resizeQuality:"high" });
    const lumMeasured = measure(micro40);
    const crushed = await crush(micro40);
    const lumCrushed = measure(crushed);
    micro40.close && micro40.close(); crushed.close && crushed.close();
    probe.close && probe.close();

    out.push({ id:T.id, i:k, sheet:si, w, h, lumMeasured, lumCrushed });
    if (k % 50 === 0) window.__progress = k;
  }

  /* ── encode. Every sheet twice, so the ratio in the report is measured. ── */
  const toBlob = (c, type, q) => new Promise(r => c.toBlob(r, type, q));
  const b64 = async blob => {
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = ""; const CH = 0x8000;
    for (let i=0;i<buf.length;i+=CH) s += String.fromCharCode.apply(null, buf.subarray(i, i+CH));
    return btoa(s);
  };
  const encode = async ({ c }) => {
    const png = await toBlob(c, "image/png");
    const webp = await toBlob(c, "image/webp", QUALITY);
    const probes = {};
    for (const q of [0.75, 0.85, 1.0]) probes["q" + q] = (await toBlob(c, "image/webp", q)).size;
    return { w:c.width, h:c.height, pngBytes:png.size, webpBytes:webp.size,
             probes, data: await b64(webp) };
  };

  return {
    micro: await encode(micro),
    thumbs: await Promise.all(thumbs.map(encode)),
    tiles: out, bad,
    microRows, nSheets, perSheet
  };
}

/* ── driver ───────────────────────────────────────────────────────────────── */
const man = JSON.parse(readFileSync(resolve(ROOT, "viewer/title-tiles.json"), "utf8"));
let tiles = man.tiles.map(t => ({ file:t.file, id:t.id || t.file, w:+t.w||0, h:+t.h||0 }));
if (LIMIT) tiles = tiles.slice(0, LIMIT);
console.log(`corpus: ${tiles.length} tiles from viewer/title-tiles.json`);

const { srv, port } = await startServer();
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", e => console.error("  [page error]", e.message));
await page.goto(`http://127.0.0.1:${port}/__atlas-builder`, { waitUntil:"load" });

const t0 = Date.now();
const R = await page.evaluate(inPage, {
  tiles, MICRO, THUMB, MICRO_COLS, THUMB_COLS, THUMB_ROWS, PAPER, QUALITY
});
await browser.close(); srv.close();

if (R.bad.length) console.error(`  ${R.bad.length} tiles failed to load:`,
  R.bad.slice(0,4).map(b=>b.id).join(", "));

/* write the sheets */
const microFile = "viewer/title-atlas-micro.webp";
writeFileSync(resolve(ROOT, microFile), Buffer.from(R.micro.data, "base64"));
const thumbFiles = R.thumbs.map((s, i) => {
  const f = `viewer/title-atlas-thumb-${i}.webp`;
  writeFileSync(resolve(ROOT, f), Buffer.from(s.data, "base64"));
  return f;
});

/* mean polarity — decided once here, exactly as the page decided it, from the
   manifest `mean` correlated against the luminance we just measured. */
const meanById = new Map(man.tiles.map(t => [t.id || t.file, +t.mean]));
let sx=0, sy=0, nn=0;
for (const t of R.tiles){ sx += meanById.get(t.id); sy += t.lumMeasured; nn++; }
const mx = sx/nn, my = sy/nn;
let cov = 0;
for (const t of R.tiles) cov += (meanById.get(t.id)-mx) * (t.lumMeasured-my);
const meanPolarity = cov >= 0 ? "luminance" : "ink";

/* THE KEY IS THE CORPUS INDEX, NOT THE ID. A scene appears in the corpus once
   per sampled second — 152 scenes, 456 scene tiles, 582 distinct ids for 886
   tiles — so `id` is not a key here. Every lookup below is by position in
   viewer/title-tiles.json, which is the order the page reads too. `id` rides
   along so a stale atlas can be detected and rejected. */
const lumCrushed = new Array(tiles.length).fill(null);
for (const t of R.tiles) lumCrushed[t.i] = t.lumCrushed;

/* only carry w/h when the source PNG disagrees with title-tiles.json — the
   page derives every sub-rect arithmetically from the manifest's dimensions. */
const dims = {};
for (const t of R.tiles){
  const m = tiles[t.i];
  if (!m || +m.w !== t.w || +m.h !== t.h) dims[t.i] = { w:t.w, h:t.h };
}
const dupIds = tiles.length - new Set(tiles.map(t => t.id)).size;

const atlas = {
  built: new Date().toISOString(),
  source: "viewer/title-tiles.json",
  count: R.tiles.length,
  note: "sub-rects are arithmetic: col = i % cols, row = (i / cols)|0. MICRO cells "
      + "are centre-cropped squares; THUMB cells contain the tile at its own aspect, "
      + "centred (see fit). micro.tiles[].i IS the corpus index; a thumb tile's corpus "
      + "index is sheet * thumb.perSheet + i. Ids repeat (a scene is sampled at "
      + "several seconds) — key on the corpus index, never the id.",
  micro: { file: microFile, cell: MICRO, cols: MICRO_COLS, rows: R.microRows,
           fit: "cover-crop to square",
           tiles: R.tiles.map(t => ({ id:t.id, i:t.i })) },
  thumb: { files: thumbFiles, cell: THUMB, cols: THUMB_COLS, rows: THUMB_ROWS,
           perSheet: R.perSheet, fit: "contain, centred in cell",
           tiles: R.tiles.map(t => ({ id:t.id, sheet:t.sheet, i:t.i % R.perSheet })) },
  meanPolarity,
  lumCrushed,
  dims,
  crush: "grayscale(1) contrast(1.85) brightness(0.58)",
  missing: R.bad.map(b => b.id)
};
writeFileSync(resolve(ROOT, "viewer/title-atlas.json"), JSON.stringify(atlas));

/* ── the report ───────────────────────────────────────────────────────────── */
const sheets = [{ name:microFile, ...R.micro }, ...R.thumbs.map((s,i)=>({ name:thumbFiles[i], ...s }))];
const sumW = sheets.reduce((a,s)=>a+s.webpBytes, 0);
const sumP = sheets.reduce((a,s)=>a+s.pngBytes, 0);
const jsonBytes = statSync(resolve(ROOT,"viewer/title-atlas.json")).size;

console.log(`\ntitle atlas — ${R.tiles.length} tiles, ${sheets.length} sheets, ${(Date.now()-t0)/1000|0}s`);
for (const s of sheets)
  console.log(`  ${s.name.padEnd(34)} ${String(s.w).padStart(4)}×${String(s.h).padStart(4)}  `
    + `webp ${(s.webpBytes/1024).toFixed(1).padStart(7)} KB   png ${(s.pngBytes/1024).toFixed(1).padStart(8)} KB   `
    + `×${(s.pngBytes/s.webpBytes).toFixed(2)} smaller   [q.75 ${(s.probes["q0.75"]/1024)|0}K  q.85 ${(s.probes["q0.85"]/1024)|0}K  q1 ${(s.probes.q1/1024)|0}K]`);
console.log(`  ${"viewer/title-atlas.json".padEnd(34)} ${(jsonBytes/1024).toFixed(1)} KB`);
console.log(`  TOTAL webp ${(sumW/1024/1024).toFixed(2)} MB · png ${(sumP/1024/1024).toFixed(2)} MB `
  + `· WebP is ${(sumP/sumW).toFixed(2)}× smaller · quality ${QUALITY}`);
console.log(`  + json ⇒ ${((sumW+jsonBytes)/1024/1024).toFixed(2)} MB in ${sheets.length+1} requests`);
console.log(`  meanPolarity: ${meanPolarity} · dims overrides: ${Object.keys(dims).length} `
  + `· missing: ${R.bad.length} · repeated ids (keyed by corpus index): ${dupIds}`);
