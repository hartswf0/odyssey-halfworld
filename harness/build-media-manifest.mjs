/* build-media-manifest.mjs — scan media/<style>/ drop folders and emit viewer/media-manifest.json
   so odyssey-syncwatch can show the SAME scene rendered in other media (ukiyo-e prints,
   cartoon panels, claymation stills, video clips) as extra synced panes.

   Usage:  node harness/build-media-manifest.mjs
           node harness/build-media-manifest.mjs --quiet      (no per-style missing list)
           node harness/build-media-manifest.mjs --missing 20 (how many missing ids to list)

   CONVENTION (see media/README.md):
       media/<styleName>/<anything-containing-a-scene-id>.<ext>
   The scene id is found anywhere in the filename, case-insensitively, and normalised to the
   canonical OD-BNN-SNN form. Everything else in the name is free — takes, prompts, tool names.

   OUTPUT viewer/media-manifest.json
   { built, styles: { <styleName>: { label, count, items: { <SCENE-ID>: [ {file,beat,kind,w?,h?} ] } } } }
*/
import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync, openSync, readSync, closeSync } from "node:fs";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MEDIA = resolve(ROOT, "media");
const OUT = resolve(ROOT, "viewer", "media-manifest.json");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);

const argv = process.argv.slice(2);
const QUIET = argv.includes("--quiet");
const MISSING_N = (() => { const i = argv.indexOf("--missing"); return i >= 0 ? Math.max(0, +argv[i + 1] || 0) : 8; })();

/* ── scene ids: the canonical 152 come from scenes/*.mjs ─────────────────────────── */
function canonicalScenes() {
  const d = resolve(ROOT, "scenes");
  if (!existsSync(d)) return [];
  return readdirSync(d)
    .filter(f => f.endsWith(".mjs") && !f.startsWith("_"))
    .map(f => f.replace(/\.mjs$/, ""))
    .filter(id => SCENE_RE.test(id))
    .map(normaliseId)
    .sort();
}

/* ── id extraction + normalisation ───────────────────────────────────────────────── */
const SCENE_RE = /OD-?B(\d{1,2})-?S(\d{1,2})/i;
const pad2 = n => String(n).padStart(2, "0");

/** "od-b17-s03_take2" | "ODB17S09" | "OD-B22-S01-beat3" -> "OD-B17-S03" (or null) */
export function normaliseId(name) {
  const m = SCENE_RE.exec(String(name));
  return m ? `OD-B${pad2(+m[1])}-S${pad2(+m[2])}` : null;
}

/** beat number, read ONLY from the part of the name after the scene id, so the book/scene
 *  digits can never be mistaken for a beat. `-beat3`, `_beat3`, `-b3`, `_b3` all work. */
export function beatOf(name) {
  const s = String(name);
  const m = SCENE_RE.exec(s);
  if (!m) return null;
  const tail = s.slice(m.index + m[0].length);
  const b = /(?:[-_. ])(?:beat|b)(\d{1,3})\b/i.exec(tail);
  return b ? +b[1] : null;
}

export function kindOf(file) {
  const e = extname(file).toLowerCase();
  if (IMAGE_EXT.has(e)) return "image";
  if (VIDEO_EXT.has(e)) return "video";
  return null;
}

/** ukiyo-e -> "UKIYO-E", clay -> "CLAY", stop_motion -> "STOP MOTION" */
export function prettyLabel(folder) {
  return String(folder).replace(/[_\s]+/g, " ").trim().toUpperCase();
}

/* ── cheap intrinsic-size sniffing (never throws; undefined when unknown) ─────────── */
function dimensions(path) {
  let fd;
  try {
    fd = openSync(path, "r");
    const buf = Buffer.alloc(64 * 1024);
    const n = readSync(fd, buf, 0, buf.length, 0);
    const b = buf.subarray(0, n);
    // PNG
    if (n > 24 && b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    // JPEG
    if (n > 4 && b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i + 9 < n) {
        if (b[i] !== 0xff) { i++; continue; }
        const mk = b[i + 1];
        if (mk === 0xd8 || mk === 0x01 || (mk >= 0xd0 && mk <= 0xd7)) { i += 2; continue; }
        const len = b.readUInt16BE(i + 2);
        const isSOF = (mk >= 0xc0 && mk <= 0xcf) && mk !== 0xc4 && mk !== 0xc8 && mk !== 0xcc;
        if (isSOF) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
        i += 2 + len;
      }
    }
    // WEBP (VP8X and lossy VP8 )
    if (n > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const four = b.toString("ascii", 12, 16);
      if (four === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
      if (four === "VP8 " && b[23] === 0x9d && b[24] === 0x01 && b[25] === 0x2a)
        return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    }
  } catch { /* unknown is fine */ }
  finally { if (fd !== undefined) try { closeSync(fd); } catch {} }
  return null;
}

/* ── scan ─────────────────────────────────────────────────────────────────────────── */
function walk(dir, base = "") {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    let st; try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) out.push(...walk(full, base ? `${base}/${name}` : name));
    else out.push({ rel: base ? `${base}/${name}` : name, full, size: st.size });
  }
  return out;
}

export function buildManifest() {
  if (!existsSync(MEDIA)) mkdirSync(MEDIA, { recursive: true });
  const styles = {};
  const skipped = [];
  const styleDirs = readdirSync(MEDIA)
    .filter(f => !f.startsWith("."))
    .filter(f => { try { return statSync(join(MEDIA, f)).isDirectory(); } catch { return false; } })
    .sort();

  for (const style of styleDirs) {
    const items = {};
    let count = 0;
    for (const f of walk(join(MEDIA, style))) {
      const kind = kindOf(f.rel);
      if (!kind) { skipped.push(`${style}/${f.rel} (unknown extension)`); continue; }
      const id = normaliseId(f.rel.replace(/\//g, "-"));
      if (!id) { skipped.push(`${style}/${f.rel} (no scene id)`); continue; }
      const rec = { file: `media/${style}/${f.rel}`, beat: beatOf(f.rel.replace(/\//g, "-")), kind };
      if (kind === "image") { const d = dimensions(f.full); if (d) { rec.w = d.w; rec.h = d.h; } }
      (items[id] || (items[id] = [])).push(rec);
      count++;
    }
    // stable playback order: numbered beats first (ascending), then unnumbered, by filename
    for (const id of Object.keys(items)) {
      items[id].sort((a, b) => {
        const ab = a.beat == null ? Infinity : a.beat, bb = b.beat == null ? Infinity : b.beat;
        if (ab !== bb) return ab - bb;
        const af = a.file.toLowerCase(), bf = b.file.toLowerCase();   // byte-wise: same on every machine
        return af < bf ? -1 : af > bf ? 1 : (a.file < b.file ? -1 : a.file > b.file ? 1 : 0);
      });
    }
    const ordered = {};
    for (const id of Object.keys(items).sort()) ordered[id] = items[id];
    styles[style] = { label: prettyLabel(style), count, items: ordered };
  }
  return { manifest: { built: new Date().toISOString(), styles }, skipped };
}

/* ── run ──────────────────────────────────────────────────────────────────────────── */
const SCENES = canonicalScenes();
const OF = SCENES.length || 152;
const { manifest, skipped } = buildManifest();
if (!existsSync(dirname(OUT))) mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(manifest, null, 2));

const styleNames = Object.keys(manifest.styles);
console.log(`media manifest → viewer/media-manifest.json   (${styleNames.length} style${styleNames.length === 1 ? "" : "s"}, ${OF} canonical scenes)`);
if (!styleNames.length) {
  console.log(`  no style folders yet. Drop files as  media/<styleName>/<...OD-BNN-SNN...>.png`);
}
for (const s of styleNames) {
  const st = manifest.styles[s];
  const have = new Set(Object.keys(st.items));
  const missing = SCENES.filter(id => !have.has(id));
  const pct = OF ? Math.round((have.size / OF) * 1000) / 10 : 0;
  console.log(`  ${st.label}: ${have.size}/${OF} scenes  (${pct}%)  · ${st.count} file${st.count === 1 ? "" : "s"}`);
  if (!QUIET && missing.length && MISSING_N) {
    console.log(`      next to generate: ${missing.slice(0, MISSING_N).join(" ")}${missing.length > MISSING_N ? ` … +${missing.length - MISSING_N} more` : ""}`);
  }
}
if (skipped.length) {
  console.log(`  skipped ${skipped.length} file${skipped.length === 1 ? "" : "s"}:`);
  for (const s of skipped.slice(0, 10)) console.log(`      ${s}`);
  if (skipped.length > 10) console.log(`      … +${skipped.length - 10} more`);
}
