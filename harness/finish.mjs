#!/usr/bin/env node
/* ============================================================================
   finish.mjs — CLOSE THE FILM OUT.

   Three steps that must happen in this order, each refusing to proceed on a
   result it cannot verify:

     1 · emit any book whose last segment has landed
     2 · give every book its slice of the audio master
     3 · mux the full film against the same master

   Nothing here renders. It is the last mile, and it exists as one command
   because doing it by hand at 2am is how a silent book gets shipped.

   THE ONE RULE. Every output is checked against the film clock before it is
   called done — the picture and the sound are built by different programs from
   one manifest, and the only way to know they still agree is to ask.

     node harness/finish.mjs
   ========================================================================= */

import { existsSync, statSync, readdirSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FF = ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg"].find((p) => existsSync(p)) || "ffmpeg";
const FP = FF.replace(/ffmpeg$/, "ffprobe");
const dur = (f) => { try { return +execFileSync(FP, ["-v", "error", "-show_entries", "format=duration",
  "-of", "default=nw=1:nk=1", f], { encoding: "utf8" }).trim(); } catch { return 0; } };
const fmt = (s) => `${Math.floor(s / 3600)}h${String(Math.floor(s / 60) % 60).padStart(2, "0")}m${String(Math.round(s % 60)).padStart(2, "0")}s`;
const run = (a, label) => { const r = spawnSync("node", a, { stdio: "inherit", cwd: ROOT });
  if (r.status !== 0) { console.error(`\n** ${label} failed **`); process.exit(1); } };

const VIDEO  = join(ROOT, "film", "odyssey-video.mp4");
const MASTER = join(ROOT, "film", "odyssey-audio.m4a");
const OUT    = join(ROOT, "film", "ODYSSEY.mp4");

console.log(`\n═══ 1 · BOOKS ═══`);
run(["harness/emit-books.mjs"], "emit-books");

console.log(`\n═══ 2 · BOOK AUDIO ═══`);
run(["harness/book-audio.mjs"], "book-audio");

console.log(`\n═══ 3 · THE FILM ═══`);
if (!existsSync(VIDEO)) { console.error(`  no ${VIDEO} — the render did not concatenate.`); process.exit(1); }
if (!existsSync(MASTER)) { console.error(`  no audio master.`); process.exit(1); }
const v = dur(VIDEO), a = dur(MASTER);
console.log(`  picture ${fmt(v)} · sound ${fmt(a)} · apart ${(v - a).toFixed(3)}s`);
if (Math.abs(v - a) >= 0.5) {
  console.error(`  ** they disagree by more than half a second — refusing to mux **`);
  process.exit(1);
}
const r = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-i", VIDEO, "-i", MASTER,
  "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "copy", "-shortest",
  "-movflags", "+faststart", OUT]);
if (r.status !== 0) { console.error("  ** mux failed **"); process.exit(1); }
const o = dur(OUT);
console.log(`  wrote film/ODYSSEY.mp4 · ${fmt(o)} · ${(statSync(OUT).size / 1073741824).toFixed(2)} GB`);
console.log(`  ${Math.abs(o - v) < 0.5 ? "full length" : `** ${(v - o).toFixed(2)}s SHORT **`}`);

/* ═══ 4 · THE TITLE, ON THE FRONT ═══
   Every file was correct and verified and the thing you actually watch still
   opened on Book 1, because the title was rendered as its own deliverable and
   nobody ever said to put it in front. It also could not simply be appended:
   the title masters at 1920x1080/30 and the film is 1280x720/24, different
   pixel range and a different audio rate, so a stream-copy concat is rejected
   and forcing one produces a broken file. The title is re-rendered NATIVELY at
   the film's frame rate rather than converted down — 30→24 drops every fifth
   frame, and the title is a continuously moving mosaic. */
const TITLE24 = join(ROOT, "film", ".title-24.mp4");
if (existsSync(TITLE24)) {
  const t = dur(TITLE24), f = dur(OUT);
  if (f > t + 60) {   // OUT does not already begin with the title
    console.log(`\n═══ 4 · THE TITLE ═══`);
    const norm = join(ROOT, "film", ".title-norm.mp4");
    const lf = join(ROOT, "film", ".titlecat.txt");
    const full = join(ROOT, "film", ".ODYSSEY-full.mp4");
    spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-i", TITLE24,
      "-vf", "scale=out_range=full,format=yuvj420p", "-c:v", "h264_videotoolbox",
      "-b:v", "12M", "-allow_sw", "1", "-color_range", "pc",
      "-c:a", "aac", "-ar", "44100", "-ac", "2", "-b:a", "192k", norm]);
    require("node:fs").writeFileSync(lf, `file '${norm}'\nfile '${OUT}'\n`);
    const r2 = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat",
      "-safe", "0", "-i", lf, "-c", "copy", "-movflags", "+faststart", full]);
    const g = dur(full), want = t + f;
    if (r2.status === 0 && Math.abs(g - want) < 0.5) {
      require("node:fs").renameSync(full, OUT);
      console.log(`  title ${t.toFixed(2)}s + film ${f.toFixed(2)}s = ${fmt(g)}  ✓`);
    } else console.error(`  ** title concat produced ${g.toFixed(2)}s, wanted ${want.toFixed(2)}s **`);
    for (const x of [norm, lf]) try { require("node:fs").rmSync(x, { force: true }); } catch {}
  }
}

console.log(`\n═══ WHAT YOU HAVE ═══`);
const books = readdirSync(join(ROOT, "film", "books")).filter((f) => f.endsWith(".mp4")).sort();
let silent = 0, bsec = 0;
for (const b of books) {
  const p = join(ROOT, "film", "books", b);
  const has = /audio/.test(execFileSync(FP, ["-v", "error", "-show_entries", "stream=codec_type",
    "-of", "default=nw=1:nk=1", p], { encoding: "utf8" }));
  if (!has) silent++;
  bsec += dur(p);
}
console.log(`  film/ODYSSEY.mp4          ${fmt(o)}  with sound`);
console.log(`  film/books/               ${books.length} books · ${fmt(bsec)}${silent ? ` · ${silent} STILL SILENT` : " · all with sound"}`);
console.log(`  film/odyssey-title.mp4    ${fmt(dur(join(ROOT, "film", "odyssey-title.mp4")))}`);
console.log(`  books total vs film: ${(bsec - v).toFixed(2)}s apart\n`);
if (silent || books.length !== 24) process.exitCode = 1;
