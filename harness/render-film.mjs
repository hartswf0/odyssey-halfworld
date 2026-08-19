#!/usr/bin/env node
/* ============================================================================
   render-film.mjs — THE PICTURE. odyssey-syncwatch.html's PLAN CAMERA,
   rendered offline, frame by frame, into an mp4.

   WHAT IT DRIVES. The page opened with ?render=1 (see the guarded block at
   the top of odyssey-syncwatch.html) stops its own clock, stops its audio,
   stops panes A/B/D/E, and exposes __sync.render.frame(t) — set the clock to
   exactly t, redraw pane C, resolve. Nothing in the page reads wall time: the
   liveness layer is driven from the film clock, which is n/fps here, so frame
   n is a pure function of n and the render is reproducible on any machine at
   any speed.

   WHY THERE IS NO PNG ANYWHERE. 237,000 frames is 170 GB of PNG and an hour
   of filesystem. Instead each frame's pixels leave the browser over a
   WebSocket as raw bytes and go straight into an ffmpeg stdin pipe. Pane C
   is two colours — paper #fdfdfa and ink #0a0a0a — so ONE byte per pixel
   carries it losslessly; the paper's warmth is put back on the far side with
   a three-term lutrgb (verified exact: 253→253,253,250 and 10→10,10,10).

   WHY IT RENDERS IN SEGMENTS. A three-hour render that loses everything to
   one crash is not a deliverable. Segments are cut ON SCENE BOUNDARIES,
   which is also what makes them free: the page's camera snaps whenever the
   scene id changes (`if(CAM.scene!==sc.id) Object.assign(CAM,tgt)`), so a
   segment that begins at a scene start has exactly the camera state it would
   have had in one continuous pass. Finished segments are skipped on rerun,
   and — because they are independent — several can render at once.

   USAGE
     node harness/render-film.mjs                       # 1280x720 @24, 6 workers
     node harness/render-film.mjs --hd                  # 1920x1080 @30
     node harness/render-film.mjs --from 8709.51 --to 8769.51 --out film/x.mp4
     node harness/render-film.mjs --workers 8 --chunk 240
     node harness/render-film.mjs --estimate            # cost only, render nothing

   OUTPUT  film/odyssey-video.mp4 — h264_videotoolbox, yuv420p (full range),
           +faststart, no audio.
   ========================================================================== */

import { chromium } from "/Users/gaia/node_modules/playwright/index.mjs";
import WS from "/Users/gaia/node_modules/ws/index.js";
const { WebSocketServer } = WS;
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile, rm, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat as statCb } from "node:fs/promises";
import { extname } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FFMPEG  = process.env.FFMPEG  || "/Users/gaia/anaconda3/bin/ffmpeg";
const FFPROBE = process.env.FFPROBE || "/Users/gaia/anaconda3/bin/ffprobe";

/* ── args ────────────────────────────────────────────────────────────────── */
const A = process.argv.slice(2);
const arg  = (k, d) => { const i = A.indexOf("--" + k); return i < 0 ? d : A[i + 1]; };
const flag = k => A.includes("--" + k);
const HD   = flag("hd");
const W    = +arg("w",   HD ? 1920 : 1280);
const H    = +arg("h",   HD ? 1080 : 720);
const FPS  = +arg("fps", HD ? 30 : 24);
const BV   = arg("bitrate", HD ? "20M" : "10M");
const WORKERS = +arg("workers", 6);
const CHUNK   = +arg("chunk", 300);            // target segment length, seconds
const FROM = arg("from") != null ? +arg("from") : null;
const TO   = arg("to")   != null ? +arg("to")   : null;
const OUT  = resolve(ROOT, arg("out", "film/odyssey-video.mp4"));
const SEGDIR = resolve(ROOT, arg("segdir", `film/.segments/${W}x${H}@${FPS}`));
const ESTIMATE = flag("estimate");
const FORCE = flag("force");

/* the camera ease is authored for the live page's ~13 Hz redraw (k=.34, about
   half a second to settle). Re-solve it for the render's frame rate so the
   move lasts the same WALL time it does in the browser: (1-k)^fps must equal
   (1-.34)^13. */
const EASE = +(1 - Math.pow(Math.pow(1 - 0.34, 13), 1 / FPS)).toFixed(5);

const sh = (cmd, args, opts = {}) => new Promise((res, rej) => {
  const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], ...opts });
  let out = "", err = "";
  p.stdout.on("data", d => out += d); p.stderr.on("data", d => err += d);
  p.on("error", rej);
  p.on("close", c => c === 0 ? res({ out, err }) : rej(new Error(cmd + " exit " + c + "\n" + err.slice(-2500))));
});
const fmtT = s => { s = Math.max(0, Math.round(s)); const h = s / 3600 | 0, m = (s / 60 | 0) % 60;
  return (h ? h + "h" : "") + String(m).padStart(2, "0") + "m" + String(s % 60).padStart(2, "0") + "s"; };

/* ── a static server of our own, so the run is self-contained ────────────── */
const MIME = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".css": "text/css", ".ogg": "audio/ogg",
  ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".mp4": "video/mp4",
  ".webm": "video/webm", ".svg": "image/svg+xml", ".m4a": "audio/mp4" };
function startStatic() {
  return new Promise(res => {
    const srv = createServer(async (req, rq) => {
      try {
        let p = decodeURIComponent(req.url.split("?")[0]);
        if (p === "/") p = "/index.html";
        const f = resolve(ROOT, "." + p);
        if (!f.startsWith(ROOT)) { rq.writeHead(403); return rq.end(); }
        const st = await statCb(f);
        rq.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream",
          "cache-control": "no-store", "content-length": st.size });
        createReadStream(f).pipe(rq);
      } catch { rq.writeHead(404); rq.end("404"); }
    });
    srv.listen(0, "127.0.0.1", () => res(srv));
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   1 · THE SEGMENT PLAN
   Cut only on scene starts, and use ceil() so the first frame of a segment
   always lands INSIDE its opening scene — which is what makes the page snap
   the camera there, exactly as a continuous pass would.

   AND ALSO CUT ON EVERY BOOK BOUNDARY.

   The question that prompted this was "shouldn't we render each book
   individually and join them, to recover better?" — right instinct, wrong
   unit, and the numbers say why:

       24 books · shortest 4m15s · median 6m12s · LONGEST 12m59s · 3.1x spread

   Making the book the recovery unit makes recovery WORSE. A crash nineteen
   minutes into Book 9 loses thirteen minutes; a 300s segment loses five, and a
   120s segment loses two. It also wrecks the parallelism: with workers pulling
   whole books, wall time can never beat the longest single book while other
   workers sit idle.

   What the instinct is right about is the OUTPUT. A book is the meaningful
   unit of this film and twenty-four watchable files are worth having. Those
   are two different jobs, and they only conflict if you use one boundary for
   both.

   So: segments stay small for recovery AND never straddle a book. Every
   segment then belongs to exactly one book, per-book files are a free concat
   of a contiguous run of them, and nothing has to be rendered twice.
   ════════════════════════════════════════════════════════════════════════ */
function planSegments(FILM, TOTAL, fps, chunkSec, from, to) {
  const t0 = from == null ? 0 : Math.max(0, from);
  const t1 = to   == null ? TOTAL : Math.min(TOTAL, to);
  const F0 = Math.ceil(t0 * fps), F1 = Math.round(t1 * fps);
  const cuts = [F0];
  let prevBook = null;
  for (const s of FILM) {
    const f = Math.ceil(s.offset * fps);
    if (f <= F0 || f >= F1) { prevBook = s.book; continue; }
    const bookChanged = prevBook != null && s.book !== prevBook;
    const long = (f - cuts[cuts.length - 1]) / fps >= chunkSec;
    if (bookChanged || long) cuts.push(f);
    prevBook = s.book;
  }
  cuts.push(F1);
  /* which book owns a frame — used to label segments and to group them into
     per-book files afterwards */
  const bookAt = (f) => {
    let b = FILM.length ? FILM[0].book : null;
    for (const s of FILM) { if (Math.ceil(s.offset * fps) <= f) b = s.book; else break; }
    return b;
  };
  const segs = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    if (cuts[i + 1] <= cuts[i]) continue;
    segs.push({ i: segs.length, f0: cuts[i], f1: cuts[i + 1], book: bookAt(cuts[i]),
      t0: cuts[i] / fps, t1: cuts[i + 1] / fps, frames: cuts[i + 1] - cuts[i] });
  }
  return segs;
}

const VF = "scale=in_range=full:out_range=full,format=gbrp," +
  "lutrgb=b='clip(val*0.98765+0.1235,0,255)'," +
  "scale=out_range=full,format=yuv420p";

/* ══════════════════════════════════════════════════════════════════════════
   2 · ONE WORKER — one browser, one segment at a time.
   ════════════════════════════════════════════════════════════════════════ */
async function renderSegment(worker, seg, baseUrl, wsPort, onFrame) {
  const file = join(SEGDIR, `seg-${String(seg.i).padStart(4, "0")}.mp4`);
  const page = worker.page;

  const ff = spawn(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error",
    "-color_range", "pc", "-f", "rawvideo", "-pix_fmt", "gray",
    "-s", `${W}x${H}`, "-r", String(FPS), "-i", "-",
    "-vf", VF, "-color_range", "pc",
    "-c:v", "h264_videotoolbox", "-b:v", BV, "-allow_sw", "1",
    "-movflags", "+faststart", "-f", "mp4", file + ".part"],
    { stdio: ["pipe", "ignore", "pipe"] });
  let ffErr = ""; ff.stderr.on("data", d => ffErr += d);
  const ffDone = new Promise((res, rej) => {
    ff.on("close", c => c === 0 ? res() : rej(new Error("ffmpeg exit " + c + "\n" + ffErr.slice(-2000))));
  });
  ff.stdin.on("error", () => {});

  /* the socket this worker's frames arrive on. One per segment: the page
     opens it, we bind it to this ffmpeg's stdin, ordering is the socket's. */
  worker.sink = buf => { onFrame(); if (!ff.stdin.write(buf)) worker.paused = true; };
  ff.stdin.on("drain", () => { worker.paused = false; });

  const log = [];
  const BATCH = 120;
  for (let f = seg.f0; f < seg.f1; f += BATCH) {
    const n = Math.min(BATCH, seg.f1 - f);
    const r = await page.evaluate(async ({ f0, n, fps }) => {
      const R = window.__sync.render;
      const cv = document.getElementById("cvC");
      const g = cv.getContext("2d", { willReadFrequently: true });
      const ws = window.__filmSock;
      const out = [];
      for (let k = 0; k < n; k++) {
        const info = await R.frame((f0 + k) / fps);
        const d = g.getImageData(0, 0, cv.width, cv.height).data;
        const m = d.length >> 2, gray = new Uint8Array(m);
        for (let i = 0, j = 0; j < m; i += 4, j++) gray[j] = d[i];
        ws.send(gray.buffer);
        out.push(info.scene + "|" + info.shot + "|" + (info.subject || ""));
        /* backpressure: never let more than a few frames queue in the socket */
        while (ws.bufferedAmount > 6 * m) await new Promise(r => setTimeout(r, 0));
      }
      return out;
    }, { f0: f, n, fps: FPS });
    r.forEach((s, k) => log.push({ f: f + k, s }));
    if (worker.abort) throw new Error("aborted");
  }

  /* drain the socket before closing the pipe or the tail frames are lost */
  await page.evaluate(async () => { const ws = window.__filmSock;
    while (ws.bufferedAmount > 0) await new Promise(r => setTimeout(r, 2)); });
  await new Promise(r => setTimeout(r, 150));
  ff.stdin.end();
  await ffDone;

  const { out } = await sh(FFPROBE, ["-v", "error", "-count_frames", "-select_streams", "v:0",
    "-show_entries", "stream=nb_read_frames", "-of", "default=nw=1:nk=1", file + ".part"]);
  const got = +out.trim();
  if (got !== seg.frames) throw new Error(`seg ${seg.i}: encoded ${got} frames, wanted ${seg.frames}`);
  await sh("/bin/mv", [file + ".part", file]);
  await writeFile(file + ".log.json", JSON.stringify({ seg: seg.i, f0: seg.f0, f1: seg.f1,
    fps: FPS, w: W, h: H, shots: compressLog(log) }));
  return file;
}

/* the shot log, run-length encoded: [firstFrame, "scene|SIZE|subject"] */
function compressLog(log) {
  const out = []; let prev = null;
  for (const e of log) { if (e.s !== prev) { out.push([e.f, e.s]); prev = e.s; } }
  return out;
}

async function makeWorker(id, baseUrl, wsPort) {
  const browser = await chromium.launch({ headless: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox", "--mute-audio"] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const w = { id, browser, page, sink: null, paused: false, abort: false };
  page.on("pageerror", e => console.error(`  [w${id}] page error: ${String(e).slice(0, 200)}`));
  await page.goto(`${baseUrl}/odyssey-syncwatch.html?render=1`, { waitUntil: "load", timeout: 180000 });
  await page.waitForFunction(() => !!window.__sync && !!window.__sync.render, null, { timeout: 180000 });
  await page.evaluate(async ({ w, h, ease, wsPort, id }) => {
    window.__sync.render.size(w, h);
    window.__sync.render.ease(ease);
    const ws = new WebSocket("ws://127.0.0.1:" + wsPort + "/?w=" + id);
    ws.binaryType = "arraybuffer";
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    window.__filmSock = ws;
  }, { w: W, h: H, ease: EASE, wsPort, id });
  return w;
}

/* ══════════════════════════════════════════════════════════════════════════
   3 · MAIN
   ════════════════════════════════════════════════════════════════════════ */
export async function main() {
  await mkdir(SEGDIR, { recursive: true });
  await mkdir(dirname(OUT), { recursive: true });

  const srv = await startStatic();
  const baseUrl = `http://127.0.0.1:${srv.address().port}`;

  /* the timeline comes from the PAGE, not from a second implementation of it */
  const probe = await chromium.launch({ headless: true });
  const pp = await probe.newPage();
  await pp.goto(`${baseUrl}/odyssey-syncwatch.html?render=1`, { waitUntil: "load", timeout: 180000 });
  await pp.waitForFunction(() => !!window.__sync, null, { timeout: 180000 });
  const { FILM, TOTAL } = await pp.evaluate(() => ({
    FILM: window.__sync.FILM.map(s => ({ id: s.id, book: s.book, offset: s.offset, total: s.total })),
    TOTAL: window.__sync.TOTAL }));
  await probe.close();

  const segs = planSegments(FILM, TOTAL, FPS, CHUNK, FROM, TO);
  const totalFrames = segs.reduce((a, s) => a + s.frames, 0);
  console.log(`[film] ${FILM.length} scenes · ${TOTAL.toFixed(2)}s · ${W}x${H} @${FPS}fps`
    + ` · ease ${EASE} · ${segs.length} segments · ${totalFrames} frames`);
  {
    const ls = segs.map(s => s.t1 - s.t0).sort((a, b) => a - b);
    const nb = new Set(segs.map(s => s.book)).size;
    console.log(`[film] segments span ${nb} books · shortest ${fmtT(ls[0])} · median ` +
      `${fmtT(ls[ls.length >> 1])} · longest ${fmtT(ls[ls.length - 1])}`);
    console.log(`[film] a crash costs at most the longest segment in flight: ${fmtT(ls[ls.length - 1])} × ${WORKERS} workers`);
  }

  /* which segments are already in the can? */
  const done = new Set();
  if (!FORCE) for (const s of segs) {
    const f = join(SEGDIR, `seg-${String(s.i).padStart(4, "0")}.mp4`);
    if (existsSync(f)) { try {
      const { out } = await sh(FFPROBE, ["-v", "error", "-count_frames", "-select_streams", "v:0",
        "-show_entries", "stream=nb_read_frames", "-of", "default=nw=1:nk=1", f]);
      if (+out.trim() === s.frames) done.add(s.i);
    } catch {} }
  }
  const todo = segs.filter(s => !done.has(s.i));
  const todoFrames = todo.reduce((a, s) => a + s.frames, 0);
  if (done.size) console.log(`[film] ${done.size} segments already complete — ${todo.length} to render`);

  if (ESTIMATE) {
    srv.close();
    const est = 0.055;                       // measured ms/frame on this machine
    console.log(`[film] estimate: ${todoFrames} frames × ~${(est * 1000) | 0} ms`
      + ` ÷ ${WORKERS} workers ≈ ${fmtT(todoFrames * est / WORKERS)}`
      + ` · ~${(todoFrames / FPS * (parseFloat(BV) / 8)).toFixed(1)} MB at ${BV}`);
    return;
  }

  /* ── the frame sink ── */
  const wss = new WebSocketServer({ port: 0, perMessageDeflate: false, maxPayload: 64e6 });
  await new Promise(r => wss.on("listening", r));
  const wsPort = wss.address().port;
  const byId = new Map();
  wss.on("connection", (ws, req) => {
    const id = +(new URL(req.url, "http://x").searchParams.get("w") || 0);
    ws.on("message", m => { const w = byId.get(id); if (w && w.sink) w.sink(m); });
  });

  const nW = Math.max(1, Math.min(WORKERS, todo.length || 1));
  console.log(`[film] booting ${nW} render workers…`);
  const workers = [];
  for (let i = 0; i < nW; i++) {
    const w = await makeWorker(i, baseUrl, wsPort);
    byId.set(i, w); workers.push(w);
  }

  /* ── the pool ── */
  const t0 = Date.now();
  let framesDone = 0, segsDone = 0, curScene = "—";
  let queue = todo.slice();
  const tick = () => {
    const el = (Date.now() - t0) / 1000;
    const rate = framesDone / Math.max(0.001, el);
    const left = (todoFrames - framesDone) / Math.max(0.001, rate);
    process.stdout.write(`\r[film] ${framesDone}/${todoFrames} frames · `
      + `${rate.toFixed(1)} fps · elapsed ${fmtT(el)} · eta ${fmtT(left)} · `
      + `seg ${segsDone}/${todo.length} · ${curScene}          `);
  };
  const timer = setInterval(tick, 2000);

  const failedSegs = [];
  const runner = async w => {
    while (queue.length) {
      const seg = queue.shift();
      curScene = (FILM.find(s => s.offset <= seg.t0 && seg.t0 < s.offset + s.total) || {}).id || "—";
      /* RETRY, then set aside — do not take the run down.
         A segment failed once here ("seg 18: encoded 272 frames, wanted 4508")
         and killed the other forty-seven, which is the exact thing cutting the
         film into segments was supposed to prevent. Recovery that still loses
         the whole run on one bad segment is not recovery.

         Each attempt gets a FRESH PAGE — the previous one is why the segment
         stopped delivering frames, and reusing it just fails again — and a
         segment that will not render after three tries is recorded and skipped
         so the remaining work still lands. The run then ends non-zero naming
         exactly what is missing, and rerunning picks up only those. */
      let ok = false;
      for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
        try {
          await renderSegment(w, seg, baseUrl, wsPort, () => { framesDone++; });
          ok = true;
        } catch (e) {
          console.error(`\n[film] segment ${seg.i} attempt ${attempt}/3 failed: ${e.message}`);
          try { await rm(join(SEGDIR, `seg-${String(seg.i).padStart(4, "0")}.mp4.part`), { force: true }); } catch {}
          if (attempt < 3) {
            try { await w.page.close(); } catch {}
            try { w.page = await w.browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 }); } catch {}
            await new Promise(r => setTimeout(r, 1500));
          } else {
            failedSegs.push(seg.i);
            console.error(`[film] segment ${seg.i} SET ASIDE — the rest of the run continues.`);
          }
        }
      }
      segsDone++;
    }
  };
  await Promise.all(workers.map(runner));
  clearInterval(timer); tick(); console.log("");
  if (failedSegs.length) {
    console.error(`\n[film] ${failedSegs.length} segment(s) did not render: ${failedSegs.join(" ")}`);
    console.error(`[film] rerun the same command — the ${segs.length - failedSegs.length} finished ones are skipped.`);
  }

  for (const w of workers) await w.browser.close();
  wss.close(); srv.close();

  /* ── concat ── */
  const list = segs.map(s => `file '${join(SEGDIR, `seg-${String(s.i).padStart(4, "0")}.mp4`)}'`).join("\n");
  const lf = join(SEGDIR, "concat.txt");
  await writeFile(lf, list + "\n");
  /* ── per-book files, free: every segment belongs to exactly one book ── */
  if (!arg("no-books", null) && !process.argv.includes("--no-books")) {
    const bdir = resolve(ROOT, "film/books");
    await mkdir(bdir, { recursive: true });
    const byBook = new Map();
    for (const s of segs) { const k = s.book ?? "0"; (byBook.get(k) || byBook.set(k, []).get(k)).push(s); }
    console.log(`[film] ${byBook.size} per-book files → film/books/`);
    for (const [book, list] of [...byBook.entries()].sort((a, b) =>
        String(a[0]).localeCompare(String(b[0]), undefined, { numeric: true }))) {
      const bl = list.map(s => `file '${join(SEGDIR, `seg-${String(s.i).padStart(4, "0")}.mp4`)}'`).join("\n");
      const blf = join(SEGDIR, `book-${String(book).padStart(2, "0")}.txt`);
      await writeFile(blf, bl);
      const out = join(bdir, `odyssey-book-${String(book).padStart(2, "0")}.mp4`);
      const secs = list.reduce((n, s) => n + (s.t1 - s.t0), 0);
      await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0",
        "-i", blf, "-c", "copy", "-movflags", "+faststart", out]);
      console.log(`[film]   book ${String(book).padStart(2)} · ${list.length} segments · ${fmtT(secs)}`);
    }
  }

  if (failedSegs.length) {
    console.error(`[film] NOT concatenating: the film would have ${failedSegs.length} hole(s) in it.`);
    process.exitCode = 1;
    return null;
  }
  /* `out` and `sz` are declared HERE, not inside the else. Wrapping the concat
     in a block to guard against holes put both out of scope for the report
     below, so a render that had just written 237,053 correct frames finished
     with `ReferenceError: out is not defined` — the work was fine and only the
     receipt was broken, which is a cruel way to end two hours. */
  console.log(`[film] concatenating ${segs.length} segments → ${OUT.replace(ROOT + "/", "")}`);
  await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0",
    "-i", lf, "-c", "copy", "-movflags", "+faststart", OUT]);
  const { out } = await sh(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries",
    "stream=width,height,r_frame_rate,pix_fmt,nb_frames:format=duration", "-of", "default=nw=1", OUT]);
  const sz = (await stat(OUT)).size;
  console.log(`\n[film] ── ${OUT.replace(ROOT + "/", "")}`);
  console.log(out.trim().split("\n").map(l => "        " + l).join("\n"));
  console.log(`        ${(sz / 1e9).toFixed(2)} GB · wall ${fmtT((Date.now() - t0) / 1000)}`);
  return OUT;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error("\n" + (e.stack || e)); process.exit(1); });
}
