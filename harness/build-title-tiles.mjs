/* ============================================================
   build-title-tiles.mjs  ·  odyssey-halfworld
   Builds the TILE CORPUS for the ODYSSEY title sequence: every image
   this project owns, rendered small (~220px), indexed with its mean
   luminance, in ATLAS ORDER (which is the first movement of the
   sequence — the catalogue).

   Sources
     · assets/<type>/<slug>.mjs   → one tile each (renders/tiles/asset__<type>__<slug>.png)
     · scenes/OD-B*.mjs           → three tiles each, at t = 0.15/0.5/0.85 · duration
                                    (renders/tiles/scene__<ID>__t<0.15>.png)
     · viewer/media-manifest.json → other-medium stills, INDEXED IN PLACE (never re-rendered)

   Mean luminance is computed IN THE PAGE (canvas → 220px tile → 8×8 → Rec.709 luma),
   so no PNG decoder and no new dependency. Reused tiles are measured by decoding the
   existing PNG in the same browser; per-tile means are cached in
   renders/tiles/_tile-cache.json so re-runs are cheap.

   Usage
     node harness/build-title-tiles.mjs               # incremental (mtime reuse)
     node harness/build-title-tiles.mjs --force       # re-render everything
     node harness/build-title-tiles.mjs --pool 6      # worker pages (default 5)
     node harness/build-title-tiles.mjs --limit 12    # smoke test: first N of each kind
     node harness/build-title-tiles.mjs --tile 220    # tile long edge in px

   OUTPUT  viewer/title-tiles.json   (schema is a contract — see SCHEMA below)
   ============================================================ */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import {
  writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync, statSync,
} from "node:fs";
import { dirname, resolve, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TILES_DIR = resolve(ROOT, "renders", "tiles");          // renders/ is already gitignored
const CACHE_FILE = resolve(TILES_DIR, "_tile-cache.json");
const OUT = resolve(ROOT, "viewer", "title-tiles.json");

const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : dflt;
};
const FORCE = argv.includes("--force");
const POOL = Math.max(1, Math.min(8, +flag("pool", 5)));
const LIMIT = +flag("limit", 0) || 0;
const TILE = +flag("tile", 220) || 220;
const MOMENTS = [0.15, 0.5, 0.85];

const TYPE_ORDER = ["CHARACTER", "CREATURE", "LOCATION", "PROP", "ENSEMBLE", "DIVINE_FX",
                    "SET_PIECE", "ENVIRONMENT", "VEHICLE", "SOUND_SOURCE", "WEARABLE"];
const typeRank = t => { const i = TYPE_ORDER.indexOf(String(t).toUpperCase()); return i < 0 ? 99 : i; };
const bookOfSceneId = id => { const m = /OD-B(\d{1,2})/i.exec(String(id || "")); return m ? +m[1] : null; };
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/* ── static server (same shape as harness/render.mjs) ───────────────────────────── */
const MIME = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
               ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
               ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
               ".css": "text/css" };
function startServer() {
  return new Promise(res => {
    const srv = createServer(async (req, resp) => {
      try {
        let p = decodeURIComponent(req.url.split("?")[0]);
        if (p === "/") p = "/harness/render-harness.html";
        const f = resolve(ROOT, "." + p);
        if (!f.startsWith(ROOT)) { resp.writeHead(403); return resp.end(); }
        const body = await readFile(f);
        resp.writeHead(200, {
          "content-type": MIME[extname(f)] || "application/octet-stream",
          "cache-control": "no-store",
        });
        resp.end(body);
      } catch (e) { resp.writeHead(404); resp.end("404 " + e.message); }
    });
    srv.listen(0, "127.0.0.1", () => res({ srv, port: srv.address().port }));
  });
}

/* ── in-page measurement (no PNG decoder needed) ────────────────────────────────── */
/* Runs after the harness page has parked window.__RESULT__. Downscales the stage
   canvas to a ~TILE tile, then that tile to 8×8, and averages Rec.709 luma. */
const GRAB = (tile) => {
  const r = window.__RESULT__ || { ok: false, errors: ["no result"], warnings: [] };
  const cv = document.getElementById("stage");
  if (!cv || !cv.width) return { ok: false, errors: (r.errors || []).concat("no canvas"), warnings: r.warnings || [] };
  const s = Math.min(tile / cv.width, tile / cv.height);
  const w = Math.max(1, Math.round(cv.width * s)), h = Math.max(1, Math.round(cv.height * s));
  const o = document.createElement("canvas"); o.width = w; o.height = h;
  const g = o.getContext("2d"); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  g.drawImage(cv, 0, 0, w, h);
  const m = document.createElement("canvas"); m.width = 8; m.height = 8;
  const mg = m.getContext("2d", { willReadFrequently: true });
  mg.imageSmoothingEnabled = true; mg.imageSmoothingQuality = "high";
  mg.drawImage(o, 0, 0, 8, 8);
  const d = mg.getImageData(0, 0, 8, 8).data;
  let sum = 0;
  for (let i = 0; i < 64; i++) sum += (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
  return { ok: !!r.ok, errors: r.errors || [], warnings: r.warnings || [],
           mean: sum / 64, w, h, dataURL: o.toDataURL("image/png") };
};

/* Measure an already-written PNG (reused tiles + other-medium stills). */
const MEASURE = async (url) => {
  const img = new Image();
  img.src = url;
  await img.decode();
  const w = img.naturalWidth, h = img.naturalHeight;
  const m = document.createElement("canvas"); m.width = 8; m.height = 8;
  const mg = m.getContext("2d", { willReadFrequently: true });
  mg.imageSmoothingEnabled = true; mg.imageSmoothingQuality = "high";
  mg.drawImage(img, 0, 0, 8, 8);
  const d = mg.getImageData(0, 0, 8, 8).data;
  let sum = 0;
  for (let i = 0; i < 64; i++) sum += (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
  return { mean: sum / 64, w, h };
};

/* ── job collection ─────────────────────────────────────────────────────────────── */
const dirsIn = d => (existsSync(d) ? readdirSync(d).filter(f => {
  try { return statSync(join(d, f)).isDirectory(); } catch { return false; }
}) : []);
const mtime = p => { try { return statSync(p).mtimeMs; } catch { return 0; } };

/* engine changes invalidate every tile, so fold engine mtimes into staleness */
function engineStamp() {
  let newest = 0;
  const eng = resolve(ROOT, "engine");
  const walk = d => { for (const f of (existsSync(d) ? readdirSync(d) : [])) {
    const p = join(d, f); let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p); else if (f.endsWith(".mjs")) newest = Math.max(newest, st.mtimeMs);
  } };
  walk(eng);
  return newest;
}

async function collectAssets() {
  const jobs = [], failed = [];
  for (const type of dirsIn(resolve(ROOT, "assets")).sort()) {
    for (const f of readdirSync(resolve(ROOT, "assets", type)).sort()) {
      if (!f.endsWith(".mjs") || f.startsWith("_")) continue;
      const relPath = `assets/${type}/${f}`;
      const slug = f.replace(/\.mjs$/, "");
      let id = `${type}.${slug}`, atype = type.toUpperCase(), book = null;
      try {
        const m = await import(pathToFileURL(resolve(ROOT, relPath)).href);
        const a = m.asset || m.default || {};
        if (a.id) id = a.id;
        if (a.type) atype = String(a.type).toUpperCase();
        book = bookOfSceneId(a.scene);
      } catch (e) {
        failed.push({ id, stage: "import", why: String(e.message || e).slice(0, 140) });
      }
      jobs.push({
        kind: "asset", id, type: atype.toLowerCase(), book, t: null,
        src: relPath, modUrl: "/" + relPath,
        file: `renders/tiles/asset__${type}__${slug}.png`,
        harness: "/harness/render-harness.html", q: { pipeline: "MESH", w: 660, h: 880, dpr: 1 },
        sortKey: [book == null ? 999 : book, typeRank(atype), id],
      });
    }
  }
  return { jobs, failed };
}

async function collectScenes() {
  const jobs = [], failed = [];
  const files = readdirSync(resolve(ROOT, "scenes"))
    .filter(f => /^OD-B\d{2}-S\d{2}\.mjs$/i.test(f)).sort();
  for (const f of files) {
    const relPath = `scenes/${f}`;
    const id = f.replace(/\.mjs$/, "");
    let duration = 40;
    try {
      const m = await import(pathToFileURL(resolve(ROOT, relPath)).href);
      const s = m.scene || m.default || {};
      if (Number.isFinite(s.duration) && s.duration > 0) duration = s.duration;
    } catch (e) {
      failed.push({ id, stage: "import", why: String(e.message || e).slice(0, 140) });
    }
    for (const frac of MOMENTS) {
      const t = Math.round(duration * frac * 100) / 100;
      jobs.push({
        kind: "scene", id, type: "scene", book: bookOfSceneId(id), t: frac,
        src: relPath, modUrl: "/" + relPath,
        file: `renders/tiles/scene__${id}__t${frac}.png`,
        harness: "/harness/render-scene-harness.html",
        q: { pipeline: "MESH", w: 1120, h: 760, dpr: 1, t },
        sortKey: [id, frac],
      });
    }
  }
  return { jobs, failed };
}

function collectMedia() {
  const jobs = [];
  const p = resolve(ROOT, "viewer", "media-manifest.json");
  if (!existsSync(p)) return jobs;
  let man; try { man = JSON.parse(readFileSync(p, "utf8")); } catch { return jobs; }
  for (const style of Object.keys(man.styles || {}).sort()) {
    const items = man.styles[style].items || {};
    for (const sceneId of Object.keys(items).sort()) {
      for (const rec of items[sceneId] || []) {
        if (rec.kind && rec.kind !== "image") continue;      // stills only
        if (!existsSync(resolve(ROOT, rec.file))) continue;
        jobs.push({
          kind: "media", id: `${sceneId}/${style}/${rec.file.split("/").pop()}`,
          type: String(style).toLowerCase(), book: bookOfSceneId(sceneId), t: null,
          src: rec.file, file: rec.file, measureOnly: true,
          sortKey: [style, sceneId, rec.file],
        });
      }
    }
  }
  return jobs;
}

/* ── main ───────────────────────────────────────────────────────────────────────── */
async function main() {
  const t0 = Date.now();
  if (!existsSync(TILES_DIR)) mkdirSync(TILES_DIR, { recursive: true });

  let cache = {};
  if (!FORCE && existsSync(CACHE_FILE)) { try { cache = JSON.parse(readFileSync(CACHE_FILE, "utf8")); } catch {} }

  console.error("collecting …");
  const A = await collectAssets();
  const S = await collectScenes();
  const media = collectMedia();
  const importFailed = [...A.failed, ...S.failed];

  let assets = A.jobs.sort((a, b) =>
    (a.sortKey[0] - b.sortKey[0]) || (a.sortKey[1] - b.sortKey[1]) || cmp(a.sortKey[2], b.sortKey[2]));
  let scenes = S.jobs.sort((a, b) => cmp(a.sortKey[0], b.sortKey[0]) || (a.sortKey[1] - b.sortKey[1]));
  let mediaJobs = media.sort((a, b) =>
    cmp(a.sortKey[0], b.sortKey[0]) || cmp(a.sortKey[1], b.sortKey[1]) || cmp(a.sortKey[2], b.sortKey[2]));

  if (LIMIT) { assets = assets.slice(0, LIMIT); scenes = scenes.slice(0, LIMIT); mediaJobs = mediaJobs.slice(0, LIMIT); }

  const jobs = [...assets, ...scenes, ...mediaJobs];   // this order IS the catalogue order
  const ENGINE = engineStamp();

  for (const j of jobs) {
    const png = resolve(ROOT, j.file);
    const srcM = Math.max(mtime(resolve(ROOT, j.src)), j.measureOnly ? 0 : ENGINE);
    const pngM = mtime(png);
    const cached = cache[j.file];
    j.reuse = !FORCE && pngM > 0 && pngM >= srcM;
    j.haveMean = !!(j.reuse && cached && cached.srcM === srcM && Number.isFinite(cached.mean));
    if (j.measureOnly) { j.reuse = true; j.haveMean = !!(cached && cached.srcM === srcM && Number.isFinite(cached.mean)); }
    j.srcM = srcM;
    if (j.haveMean) { j.mean = cached.mean; j.w = cached.w; j.h = cached.h; }
  }

  const toRender = jobs.filter(j => !j.reuse);
  const toMeasure = jobs.filter(j => j.reuse && !j.haveMean);
  const cachedN = jobs.filter(j => j.haveMean).length;

  console.error(`  ${assets.length} assets · ${scenes.length} scene frames · ${mediaJobs.length} media stills`);
  console.error(`  render ${toRender.length} · measure-only ${toMeasure.length} · from cache ${cachedN}`);
  if (importFailed.length) console.error(`  ${importFailed.length} module(s) failed to import (see report)`);

  const { srv, port } = await startServer();
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();

  const failures = [];
  let done = 0;
  const total = toRender.length + toMeasure.length;
  const tick = (label) => {
    done++;
    if (done % 25 === 0 || done === total) {
      const el = (Date.now() - t0) / 1000;
      const rate = done / Math.max(el, 0.001);
      const eta = (total - done) / Math.max(rate, 0.001);
      console.error(`  [${String(done).padStart(4)}/${total}] ${el.toFixed(0)}s  ${rate.toFixed(1)}/s  eta ${eta.toFixed(0)}s   ${label}`);
    }
  };

  /* one page per worker; workers pull from a shared queue */
  const queue = [...toRender];
  const mQueue = [...toMeasure];

  async function worker() {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    page.on("pageerror", () => {});
    page.on("console", () => {});
    for (;;) {
      const j = queue.shift();
      if (!j) break;
      try {
        const q = new URLSearchParams({ mod: j.modUrl, ...Object.fromEntries(Object.entries(j.q).map(([k, v]) => [k, String(v)])) });
        await page.goto(`${base}${j.harness}?${q}`, { waitUntil: "load", timeout: 45000 });
        await page.waitForFunction("window.__DONE__===true", { timeout: 45000 });
        const r = await page.evaluate(GRAB, TILE);
        const threw = (r.errors || []).some(e => String(e).startsWith("THROW:"));
        if (threw || !r.dataURL) {
          failures.push({ id: j.id, t: j.t, kind: j.kind, why: (r.errors || ["no image"])[0].slice(0, 200) });
        } else {
          writeFileSync(resolve(ROOT, j.file), Buffer.from(r.dataURL.split(",")[1], "base64"));
          j.mean = r.mean; j.w = r.w; j.h = r.h; j.fresh = true;
          if (!r.ok) j.invalid = true;                       // rendered fine, contract complained
        }
      } catch (e) {
        failures.push({ id: j.id, t: j.t, kind: j.kind, why: String(e.message || e).split("\n")[0].slice(0, 200) });
      }
      tick(j.id);
    }
    /* measure pass: decode already-written PNGs / other-medium stills */
    if (mQueue.length) {
      await page.goto(`${base}/harness/render-harness.html`, { waitUntil: "domcontentloaded" }).catch(() => {});
      for (;;) {
        const j = mQueue.shift();
        if (!j) break;
        try {
          const r = await page.evaluate(MEASURE, `${base}/${j.file}`);
          j.mean = r.mean; j.w = r.w; j.h = r.h;
        } catch (e) {
          failures.push({ id: j.id, t: j.t, kind: j.kind, why: "measure: " + String(e.message || e).split("\n")[0].slice(0, 160) });
        }
        tick(j.id);
      }
    }
    await page.close();
  }

  await Promise.all(Array.from({ length: POOL }, worker));
  await browser.close();
  srv.close();

  /* ── write cache + manifest ───────────────────────────────────────────────────── */
  const nextCache = { ...cache };
  const tiles = [];
  for (const j of jobs) {
    if (!Number.isFinite(j.mean)) continue;                  // failed → not indexed
    nextCache[j.file] = { mean: j.mean, w: j.w, h: j.h, srcM: j.srcM };
    tiles.push({
      file: j.file, id: j.id, kind: j.kind, type: j.type,
      book: j.book == null ? null : j.book,
      t: j.t == null ? null : j.t,
      mean: Math.round(j.mean * 1e4) / 1e4,
      w: j.w, h: j.h,
    });
  }
  writeFileSync(CACHE_FILE, JSON.stringify(nextCache));
  writeFileSync(OUT, JSON.stringify({ built: new Date().toISOString(), count: tiles.length, tiles }, null, 1));

  /* ── report ───────────────────────────────────────────────────────────────────── */
  const by = k => tiles.filter(t => t.kind === k).length;
  const hist = new Array(10).fill(0);
  for (const t of tiles) hist[Math.min(9, Math.max(0, Math.floor(t.mean * 10)))]++;
  const el = (Date.now() - t0) / 1000;
  const freshN = jobs.filter(j => j.fresh).length;
  const reuseN = jobs.filter(j => j.reuse && Number.isFinite(j.mean)).length;

  const L = [];
  L.push(`\n══ TITLE TILE CORPUS ═════════════════════════════════════════`);
  L.push(`wall clock        ${el.toFixed(1)}s   (pool ${POOL}, tile ${TILE}px)`);
  L.push(`indexed           ${tiles.length} tiles  · asset ${by("asset")} · scene ${by("scene")} · media ${by("media")}`);
  L.push(`rendered fresh    ${freshN}`);
  L.push(`reused            ${reuseN}   (${cachedN} of those straight from the mean cache)`);
  L.push(`failed            ${failures.length}`);
  L.push(`\nmean-luminance histogram (10 buckets):`);
  const max = Math.max(1, ...hist);
  hist.forEach((n, i) => {
    const pct = tiles.length ? (n / tiles.length * 100) : 0;
    L.push(`  ${(i / 10).toFixed(1)}–${((i + 1) / 10).toFixed(1)}  ${String(n).padStart(5)}  ${pct.toFixed(1).padStart(5)}%  ${"█".repeat(Math.round(n / max * 40))}`);
  });
  const occupied = hist.filter(n => n / Math.max(tiles.length, 1) >= 0.05).length;
  const topTwo = hist.slice().sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a + b, 0) / Math.max(tiles.length, 1);
  if (occupied <= 2 || topTwo > 0.9) {
    L.push(`\n!!! TONAL SPREAD WARNING !!!`);
    L.push(`!!! ${(topTwo * 100).toFixed(1)}% of tiles land in just two buckets; only ${occupied} bucket(s) hold >=5%.`);
    L.push(`!!! This corpus CANNOT form legible letterforms as-is — the title sequence`);
    L.push(`!!! will need per-tile contrast adjustment (or per-tile crop/invert) to build ODYSSEY.`);
  } else {
    L.push(`\ntonal spread OK: ${occupied} of 10 buckets hold >=5% of the corpus.`);
  }
  if (importFailed.length) {
    L.push(`\nmodules that failed to IMPORT (${importFailed.length}):`);
    for (const f of importFailed) L.push(`  · ${f.id} — ${f.why}`);
  }
  if (failures.length) {
    L.push(`\nmodules that failed to RENDER (${failures.length}):`);
    for (const f of failures.slice(0, 60)) L.push(`  · ${f.id}${f.t != null ? ` @t${f.t}` : ""} [${f.kind}] — ${f.why}`);
    if (failures.length > 60) L.push(`  … +${failures.length - 60} more`);
  } else {
    L.push(`\nno render failures.`);
  }
  const invalid = jobs.filter(j => j.invalid);
  if (invalid.length) L.push(`\n(${invalid.length} tile(s) rendered but failed contract validation — still indexed.)`);
  L.push(`\nwrote  viewer/title-tiles.json  (${tiles.length} tiles)`);
  L.push(`tiles  renders/tiles/            (gitignored)`);
  L.push(`══════════════════════════════════════════════════════════════`);
  console.log(L.join("\n"));
}

main().catch(e => { console.error(e); process.exit(1); });
