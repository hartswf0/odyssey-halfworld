#!/usr/bin/env node
/* ============================================================================
   assemble.mjs — TITLE + FILM + CREDITS, AS ONE COPY.

   ---------------------------------------------------------------------------
   THE MISTAKE THIS REPLACES, WHICH TOOK FOUR ATTEMPTS AND A USER TELLING ME

   The title was rendered as its OWN deliverable — 1920x1080 at 30fps, its own
   encoder, its own bitrate — and then I tried to attach it to a 1280x720/24
   film. Four goes:

     1 · concat demuxer, mismatched everything          rejected
     2 · downscale + re-encode + concat                 played here, not there
     3 · MPEG-TS round trip                             took the WRONG params
                                                        (yuv420p/unknown over a
                                                        yuvj420p/pc film)
     4 · this

   Every one of those was a way of reconciling two things that should never
   have differed. The user's question — "why not reshoot the title the same as
   the books" — is the whole answer, and it is embarrassing that it took being
   asked:

       DO NOT BUILD A DELIVERABLE AND THEN ATTACH IT.
       BUILD IT THE WAY THE THING IT ATTACHES TO WAS BUILT.

   So the title and the credits are rendered at the FILM's size and rate, and
   encoded with the FILM's exact ffmpeg invocation — the same one in
   render-film.mjs, character for character:

       -color_range pc  -c:v h264_videotoolbox  -b:v 10M  -allow_sw 1

   They become segment -1 and segment 67. Assembly is `-c copy` over a list,
   which is what the 66 body segments already do, and there is nothing left to
   reconcile because nothing differs.

   THE CHECK. Every piece must report the same codec parameters before anything
   is concatenated. A mismatch stops the run and prints the offending field,
   rather than producing a file that plays on the machine that made it.

     node harness/assemble.mjs              title + film + credits
     node harness/assemble.mjs --check      compare parameters, build nothing
   ========================================================================= */

import { existsSync, statSync, writeFileSync, rmSync, renameSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const FF = ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg"].find((p) => existsSync(p)) || "ffmpeg";
const FP = FF.replace(/ffmpeg$/, "ffprobe");

const VIDEO   = join(ROOT, "film", "odyssey-video.mp4");     // the 66 body segments, silent
const MASTER  = join(ROOT, "film", "odyssey-audio.m4a");
const TITLE   = join(ROOT, "film", ".title-seg.mp4");
const CREDITS = join(ROOT, "film", ".credits-seg.mp4");
const OUT     = join(ROOT, "film", "ODYSSEY.mp4");
const TITLE_AUD = join(ROOT, "film", ".title-aud.m4a");
/* the album has a track written for exactly this job */
const END_TITLES = join(ROOT, "audio", "HOMECOMING",
  "The Odyssey Homecoming - Slot C26 (End Titles) - Treblo.ogg");
let titleSrc = TITLE, creditsSrc = CREDITS;

/* the film's own encode, lifted from render-film.mjs so it cannot drift */
const FILM_VARGS = ["-color_range", "pc", "-c:v", "h264_videotoolbox",
                    "-b:v", "10M", "-allow_sw", "1", "-pix_fmt", "yuvj420p"];

const probe = (f, keys) => {
  try {
    return execFileSync(FP, ["-v", "error", "-select_streams", "v:0", "-show_entries",
      `stream=${keys}`, "-of", "default=nw=1:nk=1", f], { encoding: "utf8" }).trim().split("\n");
  } catch { return null; }
};
const dur = (f) => { try { return +execFileSync(FP, ["-v", "error", "-show_entries",
  "format=duration", "-of", "default=nw=1:nk=1", f], { encoding: "utf8" }).trim(); } catch { return 0; } };
const fmt = (s) => `${Math.floor(s / 3600)}h${String(Math.floor(s / 60) % 60).padStart(2, "0")}m${String(Math.round(s % 60)).padStart(2, "0")}s`;

/* ---- 1 · render title and credits AT THE FILM'S SPEC --------------------- */
const FPS = (probe(VIDEO, "r_frame_rate") || ["24/1"])[0].split("/")[0];
const [VW, VH] = probe(VIDEO, "width,height") || [1280, 720];
console.log(`\nASSEMBLE — everything at ${VW}x${VH} @${FPS}, encoded as the film is\n`);

/* render-title.mjs writes the SILENT cut to `<out>.silent.mp4` and only
   produces `<out>` itself when it manages to mux a track. Asking for
   --no-audio therefore leaves the file somewhere I was not looking, and the
   run reported "0h00m00s" twice and carried on. Check both names, and let the
   title keep the music it already has. */
function renderPiece(page, out, label, wantAudio) {
  const silent = out.replace(/\.mp4$/, "") + ".silent.mp4";
  const found = () => (existsSync(out) ? out : existsSync(silent) ? silent : null);
  if (found() && !process.argv.includes("--force")) {
    console.log(`  ${label}: reusing ${found().replace(ROOT + "/", "")} (${fmt(dur(found()))})`);
    return found();
  }
  console.log(`  ${label}: rendering at ${VW}x${VH} @${FPS}…`);
  const args = [join(ROOT, "harness", "render-title.mjs"),
    "--page", page, "--w", String(VW), "--fps", String(FPS), "--out", out];
  if (!wantAudio) args.push("--no-audio");
  const r = spawnSync("node", args, { stdio: ["ignore", "pipe", "pipe"], cwd: ROOT });
  const f = found();
  if (r.status !== 0 || !f) {
    console.error(`  ** ${label} render failed **\n${String(r.stdout).slice(-500)}\n${String(r.stderr).slice(-500)}`);
    process.exit(1);
  }
  console.log(`  ${label}: ${fmt(dur(f))}  (${f.replace(ROOT + "/", "")})`);
  return f;
}

if (!CHECK) {
  titleSrc   = renderPiece("odyssey-title.html", TITLE, "title", true);
  creditsSrc = renderPiece("odyssey-credits.html", CREDITS, "credits", false);

  /* re-encode each to the FILM's exact parameters. One pass, 33s and ~60s of
     material — the body of the film is never touched. */
  /* keep the title's music aside before the video is conformed */
  if (titleSrc) {
    const r0 = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-i", titleSrc,
      "-vn", "-c:a", "aac", "-ar", "44100", "-ac", "2", "-b:a", "192k", TITLE_AUD]);
    if (r0.status !== 0) console.log(`  title has no audio track — the head will be silent`);
  }
  /* A conformed piece is video-only, so re-running would "reuse" a title with
     no music and hand back a silent head. Conform only what is not already at
     spec, and never re-encode a piece twice — generational loss on a halftone
     is visible immediately. */
  const SPEC = (probe(VIDEO, "width,height,pix_fmt,color_range") || []).join("|");
  for (const [src, dst, label] of [[titleSrc, TITLE, "title"], [creditsSrc, CREDITS, "credits"]]) {
    if (src === dst && (probe(dst, "width,height,pix_fmt,color_range") || []).join("|") === SPEC
        && !process.argv.includes("--force")) {
      console.log(`  ${label}: already at the film's spec`); continue;
    }
    const tmp = dst.replace(/\.mp4$/, ".spec.mp4");
    const r = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-i", src,
      "-vf", "scale=out_range=full,format=yuvj420p", ...FILM_VARGS,
      "-an", "-movflags", "+faststart", tmp]);
    if (r.status !== 0) { console.error(`  ** ${label} conform failed **`); process.exit(1); }
    if (src !== dst) rmSync(src, { force: true });
    renameSync(tmp, dst);
  }
}

/* ---- 2 · every piece must agree, field by field -------------------------- */
const KEYS = "width,height,pix_fmt,color_range,profile,level,r_frame_rate";
const pieces = [["title", TITLE], ["film", VIDEO], ["credits", CREDITS]];
const rows = pieces.map(([n, f]) => ({ n, f, p: probe(f, KEYS) }));
console.log(`\n  ${"".padEnd(9)}${KEYS.split(",").map((k) => k.padEnd(12)).join("")}`);
for (const r of rows) console.log(`  ${r.n.padEnd(9)}${(r.p || []).map((v) => String(v).padEnd(12)).join("")}`);
const ref = rows.find((r) => r.n === "film").p;
const bad = rows.filter((r) => !r.p || r.p.join("|") !== ref.join("|"));
if (bad.length) {
  console.error(`\n  ** ${bad.map((b) => b.n).join(" and ")} do not match the film — refusing to concat **`);
  process.exit(1);
}
console.log(`\n  every piece identical — a copy concat is safe`);
if (CHECK) process.exit(0);

/* ---- 3 · picture: title + 66 segments + credits, one copy ---------------- */
const lf = join(ROOT, "film", ".assemble.txt");
writeFileSync(lf, [TITLE, VIDEO, CREDITS].map((f) => `file '${f}'`).join("\n") + "\n");
const pic = join(ROOT, "film", ".assembled.mp4");
console.log(`\n  concatenating picture…`);
if (spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0",
  "-i", lf, "-c", "copy", "-movflags", "+faststart", pic]).status !== 0) {
  console.error("  ** picture concat failed **"); process.exit(1);
}
const tD = dur(TITLE), fD = dur(VIDEO), cD = dur(CREDITS), pD = dur(pic);
console.log(`  ${fmt(tD)} + ${fmt(fD)} + ${fmt(cD)} = ${fmt(tD + fD + cD)} · got ${fmt(pD)}` +
  (Math.abs(pD - (tD + fD + cD)) < 0.5 ? "  ✓" : "  ** SHORT **"));

/* ---- 4 · sound: silence under the title, the master, silence under credits */
console.log(`  building the sound bed…`);
const aud = join(ROOT, "film", ".assembled.m4a");
/* The head must be EXACTLY the title's picture length or everything after it
   slides. Pad the title's own music with silence, then cut to length — that
   holds whether the track is short, long, or missing. */
const haveTA = existsSync(TITLE_AUD);
const headIn = haveTA ? ["-i", TITLE_AUD]
                      : ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"];
const headF = `[0:a]aresample=44100,apad,atrim=0:${tD.toFixed(3)},asetpts=PTS-STARTPTS[h]`;

/* The first assembly ran silence under the credits and I nearly shipped 95
   seconds of nothing at the end of a film that is otherwise scored throughout.
   A tail that goes quiet reads as a file that broke, not as an ending. */
const haveET = existsSync(END_TITLES);
const tailIn = haveET ? ["-i", END_TITLES]
                      : ["-f", "lavfi", "-t", cD.toFixed(3), "-i", "anullsrc=r=44100:cl=stereo"];
const tailF = haveET
  ? `[2:a]aresample=44100,apad,atrim=0:${cD.toFixed(3)},asetpts=PTS-STARTPTS,volume=0.62,` +
    `afade=t=in:st=0:d=4,afade=t=out:st=${(cD - 7).toFixed(3)}:d=7[c]`
  : `[2:a]anull[c]`;
console.log(`  head: ${haveTA ? "the title's own music" : "silence"} · ${tD.toFixed(1)}s`);
console.log(`  tail: ${haveET ? "HOMECOMING · Slot C26 (End Titles)" : "silence"} · ${cD.toFixed(1)}s`);
const r2 = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error",
  ...headIn, "-i", MASTER, ...tailIn,
  "-filter_complex", `${headF};${tailF};[h][1:a][c]concat=n=3:v=0:a=1[a]`, "-map", "[a]",
  "-c:a", "aac", "-b:a", "192k", aud]);
if (r2.status !== 0) { console.error("  ** audio build failed **"); process.exit(1); }
console.log(`  sound ${fmt(dur(aud))}`);

console.log(`  muxing…`);
if (spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-i", pic, "-i", aud,
  "-map", "0:v:0", "-map", "1:a:0", "-c", "copy", "-movflags", "+faststart", OUT]).status !== 0) {
  console.error("  ** mux failed **"); process.exit(1);
}
for (const f of [lf, pic, aud]) rmSync(f, { force: true });
/* TITLE_AUD stays: it is the only copy of the head's music once the title has
   been conformed to video-only, and deleting it made a re-run silent. */

const o = dur(OUT);
const p = probe(OUT, KEYS);
console.log(`\n  film/ODYSSEY.mp4 · ${fmt(o)} · ${(statSync(OUT).size / 1073741824).toFixed(2)} GB`);
console.log(`  ${p.join(" · ")}`);
console.log(`  title 0s → ${tD.toFixed(1)}s · film → ${(tD + fD).toFixed(1)}s · credits → ${o.toFixed(1)}s\n`);
