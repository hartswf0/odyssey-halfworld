#!/usr/bin/env node
/* ============================================================================
   build-film-audio.mjs — THE AUDIO MASTER OF THE ODYSSEY FILM.

   The film's clock is not a decision anyone made: it is the sum of 152 studio
   recordings taken in id order. odyssey-syncwatch.html builds that clock in
   the browser out of drive/voice-manifest.json, and this script builds the
   SAME clock out of the SAME file, so a frame rendered at t and a sample
   played at t are the same instant of the same performance. If the two ever
   disagree, they disagree here first — which is why step 0 below reports the
   drift between every m4a's real duration and the duration the manifest
   claims, and why every scene is padded or trimmed to the manifest's number
   rather than to its own.

   UNDER THE VOICE, THE BED. Each book gets its mapped album track, looped to
   cover the book's span, at 0.18 — ducked to 0.10 while a voice segment is
   sounding. odyssey-drive.html does this with a 90 ms volume chase because a
   browser cannot see the future. We can: voice-manifest gives the exact start
   and duration of every spoken segment in the film, so the duck is drawn as
   an envelope, in advance, with a 150 ms raised-cosine on each edge — no
   sidechain, no pumping, no guessing where a line begins.

   HOW THE ENVELOPE IS APPLIED. As audio. The envelope is written as a 1 kHz
   mono WAV whose sample VALUES are the gain, resampled up to 44.1 k by ffmpeg
   and multiplied into the bed with amultiply. That is exact, it is one filter,
   and it does not need a 1000-term volume expression.

   USAGE
     node harness/build-film-audio.mjs                       # the whole film
     node harness/build-film-audio.mjs --from 8600 --to 8660 # a 60 s window
     node harness/build-film-audio.mjs --out film/x.m4a --bitrate 256k
     node harness/build-film-audio.mjs --keep                # keep the wav cache

   OUTPUT  film/odyssey-audio.m4a — AAC, 44.1 kHz, stereo.
   ========================================================================== */

import { spawn } from "node:child_process";
import { mkdir, writeFile, rm, stat } from "node:fs/promises";
import { openSync, writeSync, closeSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FFMPEG  = process.env.FFMPEG  || "/Users/gaia/anaconda3/bin/ffmpeg";
const FFPROBE = process.env.FFPROBE || "/Users/gaia/anaconda3/bin/ffprobe";

/* ── the bed law, straight off odyssey-syncwatch.html ─────────────────────
   `bed.volume=.18` and `DUCK.target = … ? .10 : .18`. The 150 ms ramp is
   ours: the page chases the target at 0.2 per 90 ms tick, which reaches it
   in about that long, so this is the same gesture drawn honestly. */
const BED_OPEN = 0.18, BED_DUCK = 0.10, RAMP = 0.150, ENV_HZ = 1000;
/* a book seam is a hard cut between two different pieces of music. It lands
   in a bed-only breath between scenes, so give it a real edge rather than a
   click: out at the end of the book, in at the head of the next. */
const SEAM_OUT = 1.6, SEAM_IN = 1.2;

/* ── args ────────────────────────────────────────────────────────────────── */
const A = process.argv.slice(2);
const arg = (k, d) => { const i = A.indexOf("--" + k); return i < 0 ? d : A[i + 1]; };
const flag = k => A.includes("--" + k);
const OUT     = resolve(ROOT, arg("out", "film/odyssey-audio.m4a"));
const BITRATE = arg("bitrate", "192k");
const FROM    = arg("from") != null ? +arg("from") : null;
const TO      = arg("to")   != null ? +arg("to")   : null;
const KEEP    = flag("keep");
const CACHE   = resolve(ROOT, "film/.audio-cache");

const sh = (cmd, args, opts = {}) => new Promise((res, rej) => {
  const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], ...opts });
  let out = "", err = "";
  p.stdout.on("data", d => out += d);
  p.stderr.on("data", d => { err += d; if (err.length > 400000) err = err.slice(-200000); });
  p.on("error", rej);
  p.on("close", c => c === 0 ? res({ out, err })
    : rej(new Error(cmd + " exit " + c + "\n" + err.slice(-3000))));
});
const probeDur = async f => {
  const { out } = await sh(FFPROBE, ["-v", "error", "-show_entries", "format=duration",
    "-of", "default=nw=1:nk=1", f]);
  return +out.trim();
};
const fmtT = s => { s = Math.max(0, s); const h = s / 3600 | 0, m = (s / 60 | 0) % 60;
  return `${h}:${String(m).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`; };

/* ══════════════════════════════════════════════════════════════════════════
   0 · THE CLOCK — rebuilt exactly as odyssey-syncwatch.html rebuilds it.
   ════════════════════════════════════════════════════════════════════════ */
export async function buildTimeline() {
  const rd = async p => JSON.parse(await (await import("node:fs/promises")).readFile(resolve(ROOT, p), "utf8"));
  const VMAN = await rd("drive/voice-manifest.json");
  const SCRIPT = await rd("drive/drive-script.json");
  const dScene = new Map(SCRIPT.scenes.map(s => [s.id, s]));
  const FILM = []; let off = 0;
  for (const id of Object.keys(VMAN).sort()) {              // id order IS the film
    const vm = VMAN[id], ds = dScene.get(id);
    if (!vm || !ds) continue;
    const total = +vm.total || 0;
    FILM.push({ id, book: ds.book, bookTitle: ds.bookTitle, title: ds.title || id,
      offset: off, total, file: vm.file, segments: vm.segments });
    off += total;
  }
  return { FILM, TOTAL: off };
}

/* ══════════════════════════════════════════════════════════════════════════
   1 · THE BED MAPPING — trackFor(book), same resolution order as the page.
   ════════════════════════════════════════════════════════════════════════ */
async function bedMap(books) {
  const ALB = JSON.parse(await (await import("node:fs/promises"))
    .readFile(resolve(ROOT, "audio/albums.json"), "utf8"));
  const trackFor = book => {
    for (const a of (ALB.albums || [])) {
      const t = (a.tracks || []).find(t => t.num === book);
      if (t) return { a, t };
    }
    const a = (ALB.albums || [])[0];
    if (!a || !a.tracks.length) return null;
    return { a, t: a.tracks[(((book - 1) % a.tracks.length) + a.tracks.length) % a.tracks.length] };
  };
  const out = new Map();
  for (const b of books) {
    const p = trackFor(b);
    if (!p) throw new Error("no bed track for book " + b);
    out.set(b, { file: resolve(ROOT, p.a.dir, p.t.file), album: p.a.name, title: p.t.title, num: p.t.num });
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════════════════
   2 · THE DUCK ENVELOPE — a WAV whose samples are the gain.
   ════════════════════════════════════════════════════════════════════════ */
function writeEnvelopeWav(path, spans, t0, t1) {
  const n = Math.max(1, Math.round((t1 - t0) * ENV_HZ));
  const g = new Float32Array(n).fill(BED_OPEN);
  const D = BED_OPEN - BED_DUCK, R = Math.max(1, Math.round(RAMP * ENV_HZ));
  /* raised cosine on both edges — a linear ramp on a music bed is audible as
     a corner, and this costs nothing. */
  const ease = u => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, u)));
  for (const [a, b] of spans) {
    const ia = Math.round((a - t0) * ENV_HZ), ib = Math.round((b - t0) * ENV_HZ);
    for (let i = Math.max(0, ia - R); i < Math.min(n, ib + R); i++) {
      const inD  = ease((i - (ia - R)) / R);                 // 0→1 entering
      const outD = ease(((ib + R) - i) / R);                 // 1→0 leaving
      const d = Math.min(inD, outD, 1);
      g[i] = Math.min(g[i], BED_OPEN - D * d);               // deepest duck wins
    }
  }
  /* WAV, IEEE float32, mono, ENV_HZ */
  const head = Buffer.alloc(44), bytes = n * 4;
  head.write("RIFF", 0); head.writeUInt32LE(36 + bytes, 4); head.write("WAVE", 8);
  head.write("fmt ", 12); head.writeUInt32LE(16, 16); head.writeUInt16LE(3, 20);
  head.writeUInt16LE(1, 22); head.writeUInt32LE(ENV_HZ, 24);
  head.writeUInt32LE(ENV_HZ * 4, 28); head.writeUInt16LE(4, 32); head.writeUInt16LE(32, 34);
  head.write("data", 36); head.writeUInt32LE(bytes, 40);
  const fd = openSync(path, "w");
  writeSync(fd, head);
  writeSync(fd, Buffer.from(g.buffer, g.byteOffset, bytes));
  closeSync(fd);
  return { samples: n, ducked: g.reduce((a, v) => a + (v < BED_OPEN - 1e-4 ? 1 : 0), 0) / n };
}

/* Every intermediate must be the length it was asked for, and must say so out
   loud. Tolerance is one frame at 24fps — the clock this has to land on. */
async function assertLen(file, label, want) {
  const got = await probeDur(file);
  const d = Math.abs(got - want);
  console.log(`      ${label} ${got.toFixed(3)}s against ${want.toFixed(3)}s expected` +
    (d < 0.042 ? "  ok" : `  ** ${(want - got).toFixed(3)}s SHORT **`));
  if (d >= 0.042) throw new Error(
    `${label} is ${(want - got).toFixed(3)}s short of the film clock — refusing to mix a truncated master.`);
  return got;
}

/* ══════════════════════════════════════════════════════════════════════════
   3 · MAIN
   ════════════════════════════════════════════════════════════════════════ */
async function main() {
  const { FILM, TOTAL } = await buildTimeline();
  const t0 = FROM == null ? 0 : Math.max(0, FROM);
  const t1 = TO   == null ? TOTAL : Math.min(TOTAL, TO);
  const WINDOW = FROM != null || TO != null;
  console.log(`[audio] ${FILM.length} scenes · TOTAL ${TOTAL.toFixed(2)}s (${fmtT(TOTAL)})`
    + (WINDOW ? ` · window ${t0.toFixed(2)}–${t1.toFixed(2)}s` : ""));

  await mkdir(CACHE, { recursive: true });
  await mkdir(dirname(OUT), { recursive: true });

  /* ── 0 · DRIFT. Does each recording actually last what the manifest says? ── */
  console.log("[audio] probing 152 recordings for drift…");
  const drifts = [];
  const scenes = FILM.filter(s => s.offset < t1 && s.offset + s.total > t0);
  const probeSet = WINDOW ? scenes : FILM;
  for (let i = 0; i < probeSet.length; i += 16) {
    const batch = probeSet.slice(i, i + 16);
    const ds = await Promise.all(batch.map(s => probeDur(resolve(ROOT, s.file)).catch(() => NaN)));
    batch.forEach((s, k) => drifts.push({ id: s.id, claim: s.total, real: ds[k], d: ds[k] - s.total }));
  }
  const bad = drifts.filter(d => !Number.isFinite(d.real));
  const worst = drifts.filter(d => Number.isFinite(d.d)).sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  const sumD = drifts.reduce((a, d) => a + (Number.isFinite(d.d) ? d.d : 0), 0);
  console.log(`[audio] drift: worst ${worst[0] ? worst[0].id + " " + worst[0].d.toFixed(3) + "s" : "—"}`
    + ` · |d|>0.05s in ${worst.filter(d => Math.abs(d.d) > 0.05).length} scenes`
    + ` · cumulative if unpadded ${sumD.toFixed(2)}s` + (bad.length ? ` · UNREADABLE ${bad.length}` : ""));
  if (bad.length) throw new Error("unreadable recordings: " + bad.map(b => b.id).join(","));
  console.log("[audio] every scene will be padded/trimmed to the MANIFEST duration,"
    + " so the master lands on the manifest clock exactly.");

  /* ── 1 · VOICE ────────────────────────────────────────────────────────── */
  const voiceWav = join(CACHE, WINDOW ? "voice-win.wav" : "voice.wav");
  {
    const ins = [];
    const parts = [];
    scenes.forEach((s, i) => {
      ins.push("-i", resolve(ROOT, s.file));
      parts.push(`[${i}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo,`
        + `apad,atrim=end=${s.total.toFixed(3)},asetpts=PTS-STARTPTS[v${i}]`);
    });
    let graph = parts.join(";\n") + ";\n"
      + scenes.map((_, i) => `[v${i}]`).join("") + `concat=n=${scenes.length}:v=0:a=1[cat]`;
    if (WINDOW) {
      const a = t0 - scenes[0].offset, b = t1 - scenes[0].offset;
      graph += `;\n[cat]atrim=start=${a.toFixed(3)}:end=${b.toFixed(3)},asetpts=PTS-STARTPTS[out]`;
    } else graph += `;\n[cat]anull[out]`;
    const gf = join(CACHE, "voice.filter");
    await writeFile(gf, graph);
    console.log(`[audio] 1/4 voice — concatenating ${scenes.length} recordings…`);
    await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...ins,
      "-filter_complex_script", gf, "-map", "[out]",
      "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", voiceWav]);
    /* CHECK IT, do not just print it. The Jul 31 run died inside this very
       step and left an 8234.35s voice.wav where the film is 9877.21s — 27
       minutes short. Nothing downstream would have noticed: step 4 mixes
       whatever length it is handed, and the master would have ended 27 minutes
       early with the number printed on screen the whole time. A stage that
       reports a duration without comparing it to the one it was asked for is
       not a check, it is a caption. */
    await assertLen(voiceWav, "voice.wav", t1 - t0);
  }

  /* ── 2 · BED ──────────────────────────────────────────────────────────── */
  const bedWav = join(CACHE, WINDOW ? "bed-win.wav" : "bed.wav");
  const books = [...new Set(scenes.map(s => s.book))].sort((a, b) => a - b);
  const BEDS = await bedMap(books);
  {
    const spans = books.map(b => {
      const ss = FILM.filter(s => s.book === b);
      return { book: b, start: ss[0].offset, span: ss.reduce((a, s) => a + s.total, 0) };
    });
    const ins = [], parts = [];
    spans.forEach((sp, i) => {
      ins.push("-stream_loop", "-1", "-i", BEDS.get(sp.book).file);
      parts.push(`[${i}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo,`
        + `atrim=end=${sp.span.toFixed(3)},asetpts=PTS-STARTPTS,`
        + `afade=t=in:st=0:d=${SEAM_IN},`
        + `afade=t=out:st=${Math.max(0, sp.span - SEAM_OUT).toFixed(3)}:d=${SEAM_OUT}[b${i}]`);
    });
    let graph = parts.join(";\n") + ";\n"
      + spans.map((_, i) => `[b${i}]`).join("") + `concat=n=${spans.length}:v=0:a=1[cat]`;
    const bedT0 = spans[0].start;
    graph += `;\n[cat]atrim=start=${(t0 - bedT0).toFixed(3)}:end=${(t1 - bedT0).toFixed(3)},`
      + `asetpts=PTS-STARTPTS[out]`;
    const gf = join(CACHE, "bed.filter");
    await writeFile(gf, graph);
    console.log(`[audio] 2/4 bed — ${spans.length} books · `
      + books.map(b => `${b}:${BEDS.get(b).title.slice(0, 18)}`).slice(0, 3).join(" ") + " …");
    await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...ins,
      "-filter_complex_script", gf, "-map", "[out]",
      "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", bedWav]);
    await assertLen(bedWav, "bed.wav", t1 - t0);
  }

  /* ── 3 · ENVELOPE ─────────────────────────────────────────────────────── */
  const envWav = join(CACHE, WINDOW ? "env-win.wav" : "env.wav");
  let envInfo;
  {
    const spans = [];
    for (const s of FILM) for (const v of s.segments) {
      const a = s.offset + v.start, b = a + v.dur;
      if (b > t0 && a < t1) spans.push([a, b]);
    }
    envInfo = writeEnvelopeWav(envWav, spans, t0, t1);
    console.log(`[audio] 3/4 duck envelope — ${spans.length} speech intervals · `
      + `${(envInfo.ducked * 100).toFixed(1)}% of the film is ducked to ${BED_DUCK}`);
  }

  /* ── 4 · MIX ──────────────────────────────────────────────────────────── */
  console.log("[audio] 4/4 mixing → " + OUT.replace(ROOT + "/", ""));
  const WANT_MASTER = t1 - t0;
  const mix =
    `[2:a]aresample=44100,pan=stereo|c0=c0|c1=c0[env];` +
    `[1:a][env]amultiply[bd];` +
    /* amix halves both inputs; volume=1.9 puts the sum back with ~1 dB of
       headroom, and the limiter catches the few places a loud line and an
       un-ducked bed land together. */
    `[0:a][bd]amix=inputs=2:duration=first:dropout_transition=0,volume=1.9,` +
    `alimiter=limit=0.97:level=0[out]`;
  await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error",
    "-i", voiceWav, "-i", bedWav, "-i", envWav,
    "-filter_complex", mix, "-map", "[out]",
    "-c:a", "aac", "-b:a", BITRATE, "-ar", "44100", "-ac", "2",
    "-movflags", "+faststart", OUT]);

  const dur = await probeDur(OUT), want = t1 - t0, sz = (await stat(OUT)).size;
  const frame = 1 / 24;
  console.log(`\n[audio] ── ${OUT.replace(ROOT + "/", "")}`);
  console.log(`        duration ${dur.toFixed(3)}s (${fmtT(dur)}) · want ${want.toFixed(3)}s`
    + ` · delta ${(dur - want).toFixed(3)}s ${Math.abs(dur - want) <= frame ? "✓ within one 24fps frame" : "✗ OUT OF TOLERANCE"}`);
  console.log(`        ${(sz / 1e6).toFixed(1)} MB · AAC ${BITRATE} · 44100 Hz stereo`);

  if (!KEEP) { for (const f of [voiceWav, bedWav, envWav]) await rm(f, { force: true }); }
  else console.log(`        cache kept in ${CACHE.replace(ROOT + "/", "")}`);
  return { dur, want };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(1); });
}
