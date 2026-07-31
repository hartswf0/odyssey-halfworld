/* media-pane.mjs — drop-in synced panes for OTHER MEDIA (ukiyo-e, cartoon, clay, video)
   -------------------------------------------------------------------------------------
   odyssey-syncwatch.html renders every pane procedurally. This module adds panes that are
   fed from files on disk instead — the same scene at the same instant, in another medium.
   The master clock stays authoritative: nothing here has its own timebase.

   WIRE IT IN (one line, plus two to build a pane):

       import { loadMediaManifest, makeMediaPane } from "./viewer/media-pane.mjs";

       const media = await loadMediaManifest();                       // null if not built yet
       const pane  = makeMediaPane("ukiyo-e", media);                 // pane.el is a DOM node
       row.appendChild(pane.el);
       // …in the per-frame update, alongside the procedural panes:
       pane.show(sceneId, tLocal, sceneTotal);

   Build the manifest with:  node harness/build-media-manifest.mjs
   Convention:               media/<styleName>/<...OD-BNN-SNN...>.<ext>   (see media/README.md)

   Framework-free, no external libraries, no globals. Never throws out of show().
*/

export const SCENE_TOTAL = 152;

const SCENE_RE = /OD-?B(\d{1,2})-?S(\d{1,2})/i;
const pad2 = n => String(n).padStart(2, "0");

/** "od-b17-s03_take2" | "ODB17S03" -> "OD-B17-S03" (null when there is no id) */
export function normaliseSceneId(id) {
  const m = SCENE_RE.exec(String(id ?? ""));
  return m ? `OD-B${pad2(+m[1])}-S${pad2(+m[2])}` : null;
}

/* Resolve everything relative to THIS module so the same code works from the repo root
   (odyssey-syncwatch.html) and from inside viewer/ (the demo page). */
const HERE = new URL("./", import.meta.url);        // …/viewer/
const REPO = new URL("../", import.meta.url);       // …/odyssey-halfworld/

/** fetch viewer/media-manifest.json — returns the manifest, or null if it isn't there yet. */
export async function loadMediaManifest(url) {
  try {
    const u = url ? new URL(url, HERE) : new URL("media-manifest.json", HERE);
    const r = await fetch(u, { cache: "no-store" });
    if (!r.ok) return null;
    const m = await r.json();
    return (m && typeof m === "object" && m.styles) ? m : null;
  } catch { return null; }
}

/** style names in the manifest, in drop order — handy for "one pane per style". */
export function mediaStyles(manifest) {
  return manifest && manifest.styles ? Object.keys(manifest.styles) : [];
}

/* ── THE LOOK: warm paper, hard contour, letterspaced caps ─────────────────────────── */
const CSS = `
.mpane{position:relative;display:flex;flex-direction:column;background:#f4f4f0;color:#141414;
  border:2px solid #141414;overflow:hidden;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
  min-width:0;min-height:0}
.mpane-hd{display:flex;align-items:baseline;gap:8px;padding:5px 7px;border-bottom:2px solid #141414;
  background:#f4f4f0;flex:0 0 auto}
.mpane-hd b{font:900 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.28em;text-transform:uppercase}
.mpane-hd i{font:700 8px/1 Helvetica,Arial,sans-serif;letter-spacing:.16em;font-style:normal;color:#8a8a86}
.mpane-hd u{margin-left:auto;font:700 8px/1 Helvetica,Arial,sans-serif;letter-spacing:.14em;
  text-decoration:none;color:#0033cc}
.mpane-stage{position:relative;flex:1 1 auto;min-height:0;background:#f4f4f0;overflow:hidden}
.mpane-stage>img,.mpane-stage>video{position:absolute;inset:0;width:100%;height:100%;
  object-fit:contain;background:#f4f4f0;opacity:0;transition:opacity 250ms linear;display:block}
.mpane-stage>img.on,.mpane-stage>video.on{opacity:1}
.mpane-ph{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;
  justify-content:center;gap:9px;text-align:center;padding:14px;background:#f4f4f0;
  background-image:radial-gradient(#141414 0.7px,transparent 0.8px);background-size:7px 7px}
.mpane-ph.on{display:flex}
.mpane-ph .card{border:2px solid #141414;background:#f4f4f0;padding:12px 16px;max-width:92%}
.mpane-ph .sty{font:900 10px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.32em;text-transform:uppercase}
.mpane-ph .sid{font:700 9px/1.6 Helvetica,Arial,sans-serif;letter-spacing:.22em;color:#0033cc;margin-top:5px}
.mpane-ph .msg{font:700 8px/1.6 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;
  color:#8a8a86;margin-top:7px}
.mpane-ft{flex:0 0 auto;padding:4px 7px;border-top:1px solid #d8d6cf;background:#f4f4f0;
  font:700 8px/1.2 Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8a8a86;
  display:flex;gap:8px}
.mpane-ft s{text-decoration:none;margin-left:auto;color:#141414}
`;
let cssDone = false;
function ensureCSS(doc) {
  if (cssDone || !doc) return;
  const s = doc.createElement("style");
  s.setAttribute("data-media-pane", "1");
  s.textContent = CSS;
  (doc.head || doc.documentElement).appendChild(s);
  cssDone = true;
}

/* ── segment selection ─────────────────────────────────────────────────────────────── */
/** Which item of `items` is on screen at fraction u (0..1)?
    Numbered beats set the timing (a beat holds until the next beat's share begins);
    otherwise the scene duration is divided evenly. Returns an index. */
export function pickIndex(items, u) {
  const n = items.length;
  if (n <= 1) return 0;
  const f = Math.min(0.999999, Math.max(0, Number.isFinite(u) ? u : 0));
  const beats = items.map(it => it.beat);
  if (beats.every(b => typeof b === "number" && Number.isFinite(b))) {
    const lo = beats[0], hi = beats[n - 1] + 1;      // items are pre-sorted by beat
    const span = hi - lo;
    if (span > 0) {
      const at = lo + f * span;
      let i = 0;
      while (i + 1 < n && beats[i + 1] <= at) i++;
      return i;
    }
  }
  return Math.min(n - 1, Math.floor(f * n));
}

/* ── the pane ──────────────────────────────────────────────────────────────────────── */
/**
 * makeMediaPane(styleName, manifest, opts?) -> pane
 *   pane = { style, label, el, show(sceneId, tLocal, sceneTotal, nextSceneId?),
 *            has(sceneId), coverage(), items(sceneId), destroy() }
 */
export function makeMediaPane(styleName, manifest, opts = {}) {
  const doc = opts.document || (typeof document !== "undefined" ? document : null);
  const style = String(styleName || "");
  const entry = (manifest && manifest.styles && manifest.styles[style]) || { label: null, count: 0, items: {} };
  const items = entry.items || {};
  const label = entry.label || style.replace(/[_\s]+/g, " ").trim().toUpperCase() || "MEDIA";
  const of = opts.of || SCENE_TOTAL;
  const base = opts.base ? new URL(opts.base, HERE) : REPO;
  const seekHz = opts.seekHz || 8;
  const sceneIds = Object.keys(items).sort();

  ensureCSS(doc);

  /* DOM */
  const el = doc ? doc.createElement("div") : null;
  let stage = null, imgA = null, imgB = null, vid = null, ph = null, phSid = null, phMsg = null, ftMid = null, hdSid = null;
  if (el) {
    el.className = "mpane";
    el.dataset.style = style;
    el.innerHTML =
      `<div class="mpane-hd"><b></b><i></i><u></u></div>` +
      `<div class="mpane-stage">` +
        `<img alt="" decoding="async">` +
        `<img alt="" decoding="async">` +
        `<video muted playsinline preload="auto"></video>` +
        `<div class="mpane-ph"><div class="card">` +
          `<div class="sty"></div><div class="sid"></div><div class="msg"></div>` +
        `</div></div>` +
      `</div>` +
      `<div class="mpane-ft"><span></span><s></s></div>`;
    const hd = el.querySelector(".mpane-hd");
    hd.querySelector("b").textContent = label;
    hdSid = hd.querySelector("i");
    stage = el.querySelector(".mpane-stage");
    [imgA, imgB] = stage.querySelectorAll("img");
    vid = stage.querySelector("video");
    vid.muted = true; vid.defaultMuted = true; vid.loop = false; vid.controls = false;
    ph = stage.querySelector(".mpane-ph");
    ph.querySelector(".sty").textContent = label;
    phSid = ph.querySelector(".sid");
    phMsg = ph.querySelector(".msg");
    ftMid = el.querySelector(".mpane-ft span");
    const cov = coverage();
    hd.querySelector("u").textContent = `${cov.scenes}/${cov.of}`;
    el.querySelector(".mpane-ft s").textContent = `${cov.pct}% COVERED`;
    ftMid.textContent = `${entry.count || 0} FILES`;
    imgA.addEventListener("error", () => placeholder(curId, "image failed to load"));
    imgB.addEventListener("error", () => placeholder(curId, "image failed to load"));
    vid.addEventListener("error", () => placeholder(curId, "video failed to load"));
  }

  /* state */
  let curId = null;         // scene id currently mounted
  let curKey = null;        // file currently displayed
  let front = null;         // which <img> is visible
  let lastSeek = 0;
  const prefetched = new Set();
  const cache = new Map();  // file -> Image (kept small: current + next scene)

  const url = file => new URL(String(file).replace(/^\/+/, ""), base).href;

  function has(sceneId) {
    const id = normaliseSceneId(sceneId);
    return !!(id && items[id] && items[id].length);
  }
  function listFor(sceneId) {
    const id = normaliseSceneId(sceneId);
    return (id && items[id]) ? items[id].slice() : [];
  }
  function coverage() {
    const scenes = sceneIds.length;
    return { scenes, of, pct: of ? Math.round((scenes / of) * 1000) / 10 : 0 };
  }

  function placeholder(sceneId, msg) {
    if (!el) return;
    ph.classList.add("on");
    phSid.textContent = normaliseSceneId(sceneId) || String(sceneId || "—");
    phMsg.textContent = msg || `no ${label} for this scene`;
    imgA.classList.remove("on"); imgB.classList.remove("on"); vid.classList.remove("on");
    if (hdSid) hdSid.textContent = normaliseSceneId(sceneId) || "";
  }

  function showImage(file) {
    if (curKey === file) return;
    const back = (front === imgA) ? imgB : imgA;
    const pre = cache.get(file);
    back.src = (pre && pre.src) ? pre.src : url(file);
    back.classList.add("on");
    if (front) front.classList.remove("on");
    front = back;
    vid.classList.remove("on");
    ph.classList.remove("on");
    curKey = file;
  }

  function showVideo(file, u) {
    if (curKey !== file) {
      vid.src = url(file);
      try { vid.pause(); } catch {}
      vid.classList.add("on");
      imgA.classList.remove("on"); imgB.classList.remove("on"); front = null;
      ph.classList.remove("on");
      curKey = file;
      lastSeek = 0;
    }
    const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
    if (now - lastSeek < 1000 / seekHz) return;      // throttle: scrub, don't fight the clock
    lastSeek = now;
    const d = vid.duration;
    if (!Number.isFinite(d) || d <= 0) return;       // metadata not in yet — next tick
    const want = Math.min(d - 0.02, Math.max(0, u * d));
    if (Math.abs(vid.currentTime - want) > 0.04) { try { vid.currentTime = want; } catch {} }
    if (!vid.paused) { try { vid.pause(); } catch {} }   // master clock is authority
  }

  /** prefetch ONLY the given scene's assets (images decoded, video metadata only) */
  function prefetch(sceneId) {
    const id = normaliseSceneId(sceneId);
    if (!id || prefetched.has(id) || !items[id] || typeof Image === "undefined") return;
    prefetched.add(id);
    for (const it of items[id]) {
      if (it.kind !== "image" || cache.has(it.file)) continue;
      const im = new Image();
      im.decoding = "async";
      im.src = url(it.file);
      cache.set(it.file, im);
    }
    // keep the cache polite: current scene + one ahead
    if (cache.size > 24) {
      const keep = new Set([...(items[curId] || []), ...(items[id] || [])].map(i => i.file));
      for (const k of [...cache.keys()]) if (!keep.has(k)) cache.delete(k);
      prefetched.clear(); prefetched.add(id); if (curId) prefetched.add(curId);
    }
  }
  const nextAfter = id => {
    const i = sceneIds.indexOf(id);
    return i >= 0 && i + 1 < sceneIds.length ? sceneIds[i + 1] : null;
  };

  function show(sceneId, tLocal, sceneTotal, nextSceneId) {
    try {
      if (!el) return;
      const id = normaliseSceneId(sceneId);
      const list = (id && items[id]) || null;
      if (id !== curId) {
        curId = id; curKey = null;
        if (hdSid) hdSid.textContent = id || String(sceneId || "");
        const nxt = normaliseSceneId(nextSceneId) || (id ? nextAfter(id) : null);
        if (nxt) prefetch(nxt);
        if (list) prefetch(id);
      }
      if (!list || !list.length) { placeholder(sceneId); return; }

      const total = (Number.isFinite(sceneTotal) && sceneTotal > 0) ? sceneTotal : 1;
      const u = Math.min(1, Math.max(0, (Number.isFinite(tLocal) ? tLocal : 0) / total));
      const it = list[pickIndex(list, u)] || list[0];

      if (it.kind === "video") {
        // fraction inside this item's own slice, so a clip that covers one beat still maps 0→1
        showVideo(it.file, list.length > 1 ? sliceU(list, u) : u);
      } else {
        showImage(it.file);
      }
    } catch (e) {
      try { placeholder(sceneId, "media error"); } catch {}
    }
  }

  /** u remapped into the current item's own slice (used for multi-item video) */
  function sliceU(list, u) {
    const i = pickIndex(list, u);
    const n = list.length;
    const beats = list.map(x => x.beat);
    let lo, hi;
    if (beats.every(b => typeof b === "number" && Number.isFinite(b))) {
      const b0 = beats[0], b1 = beats[n - 1] + 1, span = (b1 - b0) || 1;
      lo = (beats[i] - b0) / span;
      hi = ((i + 1 < n ? beats[i + 1] : b1) - b0) / span;
    } else { lo = i / n; hi = (i + 1) / n; }
    return hi > lo ? Math.min(1, Math.max(0, (u - lo) / (hi - lo))) : 0;
  }

  function destroy() {
    try { if (vid) { vid.removeAttribute("src"); vid.load(); } } catch {}
    cache.clear(); prefetched.clear();
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  return { style, label, el, show, has, coverage, items: listFor, prefetch, destroy,
           get sceneIds() { return sceneIds.slice(); } };
}

/** convenience: one pane per style in the manifest, in drop order. */
export function makeAllMediaPanes(manifest, opts = {}) {
  return mediaStyles(manifest).map(s => makeMediaPane(s, manifest, opts));
}
