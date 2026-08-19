#!/usr/bin/env node
/* ============================================================================
   emit-books.mjs — PUT THE FINISHED BOOKS ON DISK NOW, NOT AT THE END.

   THE GAP THIS CLOSES, and it was mine.

   The ask was "render each book individually then join them together, to
   recover better." I made the segments book-aligned, which was right, and then
   wrote the per-book concat as the LAST step of render-film.mjs, which was
   not: for the whole two hours of a render, film/books/ stays empty. Nineteen
   books can be complete, verified, and sitting on disk as segments, and there
   is still nothing to watch. Recovery you cannot see is indistinguishable from
   no recovery at all.

   A book is finished the moment its last segment is. This emits it then.

   ---------------------------------------------------------------------------
   HOW IT KNOWS WHICH BOOK A SEGMENT IS, WITHOUT THE PLAN

   Each segment writes a log beside it holding its shot list, and every shot id
   carries its book: "OD-B07-S03". So the book of a segment is read off the
   render's own record rather than recomputed from a plan that might since have
   changed — which matters, because the plan changes whenever --chunk does.

   AND WHICH BOOKS ARE ACTUALLY DONE

   Segments are contiguous and numbered in time order, so: find the lowest
   segment index that is NOT complete, and every book that appears only in
   segments below it is finished. A book touching that index or beyond is still
   being written and is left alone. No book is ever emitted half-length.

     node harness/emit-books.mjs            emit every finished book
     node harness/emit-books.mjs --watch    keep emitting as the render lands them
   ========================================================================= */

import { readdirSync, existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const SEGDIR = resolve(ROOT, arg("--segdir", "film/.segments/1280x720@24"));
const OUTDIR = resolve(ROOT, "film/books");
const WATCH = process.argv.includes("--watch");
const FF = ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/Users/gaia/anaconda3/bin/ffmpeg"]
  .find((p) => existsSync(p)) || "ffmpeg";
const dur = (f) => { try { return +execFileSync(FF.replace(/ffmpeg$/, "ffprobe"),
  ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", f],
  { encoding: "utf8" }).trim(); } catch { return 0; } };
const fmt = (s) => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, "0")}s`;

function pass() {
  if (!existsSync(SEGDIR)) { console.log(`no segment dir: ${SEGDIR}`); return 0; }
  mkdirSync(OUTDIR, { recursive: true });

  /* every segment we have a LOG for — the log is written before the .part is
     renamed, so a log without a finished mp4 is a segment still in flight */
  const segs = [];
  for (const f of readdirSync(SEGDIR).filter((f) => /^seg-\d+\.mp4\.log\.json$/.test(f))) {
    const j = JSON.parse(readFileSync(join(SEGDIR, f), "utf8"));
    const mp4 = join(SEGDIR, `seg-${String(j.seg).padStart(4, "0")}.mp4`);
    const books = new Set((j.shots || []).map((s) => {
      const m = String(s[1] || "").match(/OD-B(\d+)-/); return m ? +m[1] : null;
    }).filter((b) => b != null));
    segs.push({ i: j.seg, mp4, done: existsSync(mp4), books: [...books] });
  }
  if (!segs.length) { console.log("no segments yet"); return 0; }
  segs.sort((a, b) => a.i - b.i);

  /* the frontier: the first segment not yet finished. Everything at or beyond
     it is unsafe to publish. */
  const maxSeen = segs[segs.length - 1].i;
  let frontier = maxSeen + 1;
  for (let i = 0; i <= maxSeen; i++) {
    const s = segs.find((x) => x.i === i);
    if (!s || !s.done) { frontier = i; break; }
  }

  const byBook = new Map();
  for (const s of segs) for (const b of s.books) {
    if (!byBook.has(b)) byBook.set(b, []);
    if (!byBook.get(b).some((x) => x.i === s.i)) byBook.get(b).push(s);
  }

  let wrote = 0, held = [];
  for (const [book, list] of [...byBook.entries()].sort((a, b) => a[0] - b[0])) {
    list.sort((a, b) => a.i - b.i);
    const out = join(OUTDIR, `odyssey-book-${String(book).padStart(2, "0")}.mp4`);
    /* PASS 2. "every segment I know about is done" is NOT the test, and it
       emitted Book 20 at 2m40s against its real 4m15s on the very first run.
       The list only holds segments that already have a LOG; the rest of the
       book has not been rendered yet, so a book still in progress looks
       complete because the missing pieces are invisible rather than unfinished.

       The correct test is a CLOSING WITNESS: a finished segment after this
       book's last one, belonging to a different book. That proves the render
       moved past this book and there is nothing more of it coming. Until that
       exists, the book is still being written — no matter how done the parts
       in hand look. */
    const lastI = list[list.length - 1].i;
    const closed = segs.some((s) => s.done && s.i > lastI && !s.books.includes(book));
    const ready = closed && list.every((s) => s.done && s.i < frontier);
    if (!ready) { held.push(book); continue; }
    if (existsSync(out)) continue;
    const lf = join(SEGDIR, `.book-${String(book).padStart(2, "0")}.txt`);
    writeFileSync(lf, list.map((s) => `file '${s.mp4}'`).join("\n") + "\n");
    const r = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat",
      "-safe", "0", "-i", lf, "-c", "copy", "-movflags", "+faststart", out]);
    if (r.status !== 0) { console.log(`  book ${book}: concat FAILED`); continue; }
    const d = dur(out);
    console.log(`  book ${String(book).padStart(2)} · ${list.length} segments · ${fmt(d)} · ` +
      `${(statSync(out).size / 1048576).toFixed(0)} MB  →  film/books/${out.split("/").pop()}`);
    wrote++;
  }
  const have = readdirSync(OUTDIR).filter((f) => f.endsWith(".mp4")).length;
  console.log(`  ${have} book file(s) on disk · frontier at segment ${frontier}` +
    (held.length ? ` · still rendering: ${held.join(" ")}` : ""));
  return wrote;
}

if (!WATCH) { console.log(`EMITTING FINISHED BOOKS\n`); pass(); }
else {
  console.log(`WATCHING ${SEGDIR}\n`);
  for (;;) {
    pass();
    const busy = spawnSync("pgrep", ["-f", "render-film.mjs"]).status === 0;
    if (!busy) { console.log("  render is not running — final pass done"); break; }
    await new Promise((r) => setTimeout(r, 30000));
  }
}
