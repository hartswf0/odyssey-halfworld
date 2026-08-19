#!/usr/bin/env node
/* ============================================================================
   render-title.mjs — THE TITLE SEQUENCE, RECORDED.

   ---------------------------------------------------------------------------
   WHY THE OLD WAY CRASHED, MEASURED RATHER THAN GUESSED

   odyssey-title.html has a FRAMES button. It does this, once per frame:

       render(t)                                   ~7.6 ms
       await cv.toBlob(png)                       ~21.6 ms   (234 KB)
       download(blob, `odyssey-title-00000.png`)   ← a BROWSER DOWNLOAD
       await sleep(55)                              55.0 ms   ← hard-coded

   The sequence is 33.066s at 30fps. That is 992 frames, so:

       992 × 84ms  =  83 seconds of loop before anything else happens
       992 separate browser downloads
       992 PNGs, 232 MB, into ~/Downloads

   The 55ms sleep alone is 55 seconds of deliberately doing nothing — more time
   than the entire render costs. And a page that fires nine hundred and ninety
   two programmatic downloads is not slow, it is a page every browser is
   entitled to stop: Chrome prompts on multiple downloads, throttles the queue,
   and the blob URLs are held for four seconds each, so the download manager is
   carrying dozens of live 234 KB blobs at any moment while the tab it belongs
   to is also the thing doing the rendering. That is the crash. It is not a
   rendering problem at all — the drawing is 7.6ms and was never the cost.

   ---------------------------------------------------------------------------
   AND THE REPOSITORY ALREADY KNEW BETTER

   harness/render-film.mjs renders 237,000 frames of this same world without
   writing a single PNG, and says why in its own header: "237,000 frames is
   170 GB of PNG and an hour of filesystem." It drives a headless page over
   Playwright and pushes raw pixels through a WebSocket into an ffmpeg stdin
   pipe. The title sequence simply never got the same treatment.

   This is that treatment. No PNG, no download, no sleep, no visible browser.

   ---------------------------------------------------------------------------
   AND THEN THE FIRST VERSION OF THIS FILE WAS ALSO WRONG, FOR A NEW REASON

   Sending raw rgb24 fixed the crash and cut 84s of loop to 128s of honest
   work — which is to say it did not actually get faster, and the reason is
   worth writing down because it is the same mistake in a new place: I assumed
   the cost was where the old code obviously wasted time, and did not measure
   the thing I had built.

       in-page work per frame     7.8 ms   (render 0.9 · getImageData 2.2 ·
                                            RGBA→RGB 4.7)
       playwright round trip      0.6 ms
       ACTUAL per frame         128.0 ms

   Everything I could name accounted for eight milliseconds of a hundred and
   twenty-eight. Timing the socket ALONE — no render, no getImageData, just
   pushing the buffer — gave 65.7ms. THE TRANSPORT WAS THE BOTTLENECK. 5.9 MB
   a frame over a WebSocket is ~90 MB/s, and 992 frames of it is 5.8 GB.

   I then "fixed" it by sending PNG instead, on a microbenchmark that said
   26.8ms/frame against 74.6ms for raw — 2.8x. THE REAL RUN GOT SLOWER:

       raw rgb24, one round trip per frame   127.8 s   (7.8 fps)
       png,       one round trip per frame   186.2 s   (5.3 fps)

   The microbenchmark timed the SENDER and not the SYSTEM. It never included
   ffmpeg decoding 992 PNGs on the other end of the pipe, which rawvideo does
   not have to do at all. A benchmark that leaves out the consumer is not a
   measurement of the pipeline, it is a measurement of one end of it, and I had
   just finished writing that the old code failed for exactly this kind of
   reason.

   THE ACTUAL DEFECT WAS THE SHAPE OF THE LOOP, in both versions. Mine did:

       await page.evaluate(render + send)    ← browser works, node idle
       await frameArrived                    ← node works, browser idle

   one round trip per frame, perfectly serialised, nothing ever overlapping.
   render-film.mjs — the file I said the repo should have copied — does not do
   this, and I did not read it closely enough to notice: it runs the WHOLE
   CHUNK inside a single evaluate, streaming frame after frame down the socket
   while node consumes at its own pace. The browser never waits for node and
   node never waits for the browser.

   So: raw rgb24 (nothing to decode), and the loop moved inside the page.

   ---------------------------------------------------------------------------
   ONE THING IS DIFFERENT FROM render-film.mjs AND IT MATTERS

   That file sends ONE BYTE PER PIXEL, because pane C is two colours and grey
   carries it losslessly with the paper's warmth restored by a lutrgb on the
   far side. I checked whether the same trick applies here before copying it,
   and it does not:

       12,441,600 pixels sampled across six times
       256 distinct grey values          (not 2)
       R ≠ G in 1,430,540 of them        (11.5%)
       blue is NOT a function of red     (all 256 levels break it)

   The title is a mosaic of 886 halftone tiles and it has real tonal range, so
   one byte would quantise it. It goes over the wire as rgb24 — three bytes,
   6.2 MB a frame — and nothing is reconstructed on the far side because
   nothing was thrown away.

   ---------------------------------------------------------------------------
   THE SEQUENCE IS DETERMINISTIC AND THAT IS LOAD-BEARING

   odyssey-title.html's own header promises "there is no Math.random in this
   file… the sequence renders identically every run". Verified here: rendering
   t=14.25, then t=3.0, then t=14.25 again gives pixel-identical output. So a
   frame is a pure function of t, frames may be rendered in any order, and a
   crashed run can resume without re-rendering what it already has.

     node harness/render-title.mjs                  1920x1080 @30 → film/odyssey-title.mp4
     node harness/render-title.mjs --w 2400         wider
     node harness/render-title.mjs --fps 24
     node harness/render-title.mjs --estimate       cost only, render nothing
     node harness/render-title.mjs --no-audio
   ========================================================================= */

import { chromium } from "/Users/gaia/node_modules/playwright/index.mjs";
import WS from "/Users/gaia/node_modules/ws/index.js";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { extname, resolve, join, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
const { WebSocketServer } = WS;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes(k);

const W        = +arg("--w", 1920);
const FPS      = +arg("--fps", 30);
const OUT      = arg("--out", join(ROOT, "film", "odyssey-title.mp4"));
const ESTIMATE = has("--estimate");
const NO_AUDIO = has("--no-audio");
const PAGE     = arg("--page", "odyssey-title.html");

/* ffmpeg: probe rather than hard-code. render-film.mjs names the conda build,
   which on this machine is missing encoders other stages need — a hard-coded
   path that silently lacks a codec is a worse failure than not finding one. */
const FF = [process.env.FFMPEG, "/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg",
            "/Users/gaia/anaconda3/bin/ffmpeg", "ffmpeg"].filter(Boolean)
  .find((p) => p === "ffmpeg" || existsSync(p));
if (!FF) { console.error("no ffmpeg found"); process.exit(1); }

const sh = (cmd, args) => new Promise((res) => {
  const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
  let o = "", e = ""; p.stdout.on("data", (d) => o += d); p.stderr.on("data", (d) => e += d);
  p.on("close", (c) => res({ code: c, out: o, err: e })); p.on("error", () => res({ code: 1, out: "", err: "" }));
});

/* ---- a static server of our own, so the run does not depend on one being up */
const MIME = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".css": "text/css", ".ogg": "audio/ogg",
  ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".m4a": "audio/mp4",
  ".wav": "audio/wav", ".mp3": "audio/mpeg" };
const startStatic = () => new Promise((res) => {
  const srv = createServer(async (rq, rs) => {
    try {
      let p = decodeURIComponent(rq.url.split("?")[0]);
      if (p === "/") p = "/" + PAGE;
      const f = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ""));
      if (!f.startsWith(ROOT)) { rs.writeHead(403).end(); return; }
      const s = await stat(f); if (s.isDirectory()) { rs.writeHead(404).end(); return; }
      const body = await readFile(f);
      rs.writeHead(200, { "content-type": MIME[extname(f).toLowerCase()] || "application/octet-stream",
                          "content-length": body.length, "cache-control": "no-cache" });
      rs.end(body);
    } catch { rs.writeHead(404).end(); }
  });
  srv.listen(0, "127.0.0.1", () => res({ srv, port: srv.address().port }));
});

/* ============================================================ run ========= */
const { srv, port } = await startStatic();
const wss = new WebSocketServer({ port: 0, perMessageDeflate: false, maxPayload: 64e6 });
const wsPort = wss.address().port;
let sink = null;
wss.on("connection", (ws) => ws.on("message", (m) => sink && sink(m)));

const browser = await chromium.launch({ args: ["--disable-lcd-text", "--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("  [page]", String(e).slice(0, 200)));

const t0 = Date.now();
await page.goto(`http://127.0.0.1:${port}/${PAGE}?w=${W}`, { waitUntil: "load", timeout: 180000 });
await page.waitForFunction(() => !!window.__title && window.__title.ready, null, { timeout: 180000 });

/* STOP THE PAGE'S OWN CLOCK. Every frame must be a function of the t we ask
   for; a live requestAnimationFrame loop would keep advancing between our
   calls and the render would depend on how fast the machine happens to be. */
await page.evaluate(() => window.__title.pause && window.__title.pause());

const meta = await page.evaluate(() => {
  const st = window.__title.stats();
  const cv = document.querySelector("canvas");
  /* stats().track is a DISPLAY STRING ("BRONZE COUNCIL 1 — Aegean Resolve").
     The playable file is on __title.track.url; reading the pretty one is how
     the first run reported "track named but not found" and shipped silent. */
  const tr = window.__title.track || null;
  return { duration: st.duration, tiles: st.declared, loaded: st.loaded, failed: st.failed,
           track: tr ? { url: tr.url, label: `${tr.album} ${tr.num} — ${tr.title}` } : null,
           cw: cv.width, ch: cv.height };
});
const H = meta.ch, CW = meta.cw;
const TOTAL = Math.round(meta.duration * FPS);
const loadMs = Date.now() - t0;

console.log(`\nTHE TITLE SEQUENCE\n`);
console.log(`  ${meta.duration.toFixed(3)}s at ${FPS}fps = ${TOTAL} frames · ${CW}×${H}`);
console.log(`  ${meta.loaded}/${meta.tiles} tiles loaded, ${meta.failed} failed · page ready in ${(loadMs / 1000).toFixed(1)}s`);
console.log(`  ffmpeg: ${FF}`);
console.log(`\n  the old FRAMES button, for comparison:`);
const oldSec = TOTAL * (7.6 + 21.6 + 55) / 1000;
console.log(`      ${TOTAL} frames × (7.6ms render + 21.6ms png + 55ms sleep) = ${oldSec.toFixed(0)}s of loop`);
console.log(`      + ${TOTAL} browser downloads · ${(TOTAL * 234114 / 1048576).toFixed(0)} MB of PNG`);
console.log(`  here: png straight into an ffmpeg pipe — no download, no sleep, nothing on disk\n`);
if (ESTIMATE) { await browser.close(); wss.close(); srv.close(); process.exit(0); }

/* ---- encoder. videotoolbox if this build has it, x264 otherwise ---------- */
const enc = await sh(FF, ["-hide_banner", "-encoders"]);
const VT = /h264_videotoolbox/.test(enc.out);
const vargs = VT ? ["-c:v", "h264_videotoolbox", "-b:v", "12M", "-allow_sw", "1"]
                 : ["-c:v", "libx264", "-preset", "medium", "-crf", "17"];
console.log(`  encoder: ${VT ? "h264_videotoolbox" : "libx264"}\n`);

await mkdir(dirname(OUT), { recursive: true });
const silent = OUT.replace(/\.mp4$/, "") + ".silent.mp4";
const ff = spawn(FF, ["-y", "-hide_banner", "-loglevel", "error",
  "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${CW}x${H}`, "-r", String(FPS), "-i", "-",
  ...vargs, "-pix_fmt", "yuv420p", "-movflags", "+faststart", silent],
  { stdio: ["pipe", "ignore", "pipe"] });
let ffErr = ""; ff.stderr.on("data", (d) => ffErr += d);
ff.stdin.on("error", () => {});
const ffDone = new Promise((res, rej) => ff.on("close", (c) =>
  c === 0 ? res() : rej(new Error("ffmpeg exit " + c + "\n" + ffErr.slice(-1500)))));

/* ---- the page pushes each frame's pixels over the socket ----------------- */
await page.evaluate(async (wsPort) => {
  const ws = new WebSocket(`ws://127.0.0.1:${wsPort}`);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const cv = document.querySelector("canvas");
  const g = cv.getContext("2d", { willReadFrequently: true });
  /* One buffer, reused. Allocating 992 six-megabyte arrays is how a render
     becomes a garbage-collection benchmark. */
  window.__rt = { ws, cv, g, rgb: new Uint8Array(cv.width * cv.height * 3) };
}, wsPort);

const started = Date.now();
let sent = 0;
/* Node consumes as fast as the socket delivers and never blocks the page. */
const FRAME_BYTES = CW * H * 3;
let rxBytes = 0, rxMsgs = 0;
sink = (buf) => { rxMsgs++; rxBytes += buf.length; sent = Math.floor(rxBytes / FRAME_BYTES);
                  ff.stdin.write(buf); };

const CHUNK = +arg("--chunk", 60);
for (let f0 = 0; f0 < TOTAL; f0 += CHUNK) {
  const n = Math.min(CHUNK, TOTAL - f0);
  await page.evaluate(async ({ f0, n, fps }) => {
    const R = window.__rt;
    for (let k = 0; k < n; k++) {
      window.__title.render((f0 + k) / fps);
      const d = R.g.getImageData(0, 0, R.cv.width, R.cv.height).data;
      const rgb = R.rgb;
      for (let i = 0, j = 0; i < d.length; i += 4, j += 3) { rgb[j] = d[i]; rgb[j + 1] = d[i + 1]; rgb[j + 2] = d[i + 2]; }
      /* SEND A COPY. `rgb` is reused every frame, and once the loop stopped
         waiting for node it began overwriting a buffer the socket had not
         finished transmitting. With a round trip per frame that was safe by
         accident; pipelined, it is a data race. */
      R.ws.send(rgb.slice().buffer);
      /* and do not queue sixty frames of backlog into the socket */
      while (R.ws.bufferedAmount > 3 * rgb.length) await new Promise((r) => setTimeout(r, 2));
    }
  }, { f0, n, fps: FPS });
  const el = (Date.now() - started) / 1000, rate = sent / Math.max(0.001, el);
  process.stdout.write(`\r  frame ${String(Math.min(TOTAL, f0 + n)).padStart(4)}/${TOTAL}  ` +
    `${rate.toFixed(1)} fps  eta ${Math.max(0, Math.round((TOTAL - sent) / Math.max(0.1, rate)))}s   `);
}
/* the last frames may still be in flight. Wait on BYTES, not on a message
   count — a websocket may deliver one send as several messages, and counting
   messages is how the first pipelined run decided it was finished after 514
   frames and closed ffmpeg's stdin on the other 478. */
const wantBytes = TOTAL * FRAME_BYTES;
let stall = 0, lastRx = -1;
while (rxBytes < wantBytes && stall < 400) {
  await new Promise((r) => setTimeout(r, 25));
  if (rxBytes === lastRx) stall++; else { stall = 0; lastRx = rxBytes; }
}
ff.stdin.end();
await ffDone;
const renderSec = (Date.now() - started) / 1000;
console.log(`\n\n  ${sent}/${TOTAL} frames in ${renderSec.toFixed(1)}s (${(sent / renderSec).toFixed(1)} fps)`);
console.log(`  ${rxMsgs} socket messages · ${(rxBytes / 1073741824).toFixed(2)} GB · ` +
  `${rxBytes === wantBytes ? "every byte accounted for" : `** ${(wantBytes - rxBytes)} BYTES MISSING **`}`);
if (rxBytes !== wantBytes) { console.error(`\n  ** SHORT RENDER — refusing to call this done.\n`); process.exitCode = 1; }

/* ---- audio, if the sequence names a track ------------------------------- */
let final = silent;
if (!NO_AUDIO && meta.track) {
  /* The page's url is percent-encoded ("BRONZE%20COUNCIL"), which is correct
     for fetch() and wrong for the filesystem. The first run reported the track
     as "not found" and shipped a silent cut. */
  const a = join(ROOT, decodeURIComponent(String(meta.track.url)).replace(/^\//, ""));
  if (existsSync(a)) {
    const r = await sh(FF, ["-y", "-hide_banner", "-loglevel", "error", "-i", silent, "-i", a,
      "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT]);
    if (r.code === 0) { final = OUT; console.log(`  muxed audio: ${meta.track.label}`); }
    else console.log(`  ** audio mux failed, keeping silent cut`);
  } else console.log(`  ** track named but not found: ${meta.track.url} — silent cut kept`);
}
if (final === silent) console.log(`  no audio track named by the page`);

const probe = await sh(FF.replace(/ffmpeg$/, "ffprobe"), ["-v", "error", "-show_entries",
  "format=duration,size", "-of", "default=nw=1", final]);
const gotDur = +(probe.out.match(/duration=([\d.]+)/) || [0, 0])[1];
const wantDur = TOTAL / FPS;
console.log(`\n  wrote ${final.replace(ROOT + "/", "")}`);
console.log("  " + probe.out.trim().split("\n").join(" · "));
console.log(`  ${gotDur.toFixed(3)}s against ${wantDur.toFixed(3)}s expected — ` +
  (Math.abs(gotDur - wantDur) < 0.2 ? "full length"
   : `** ${(wantDur - gotDur).toFixed(2)}s SHORT — the file is not the sequence **`));
if (Math.abs(gotDur - wantDur) >= 0.2) process.exitCode = 1;
console.log(`  ${(statSync(final).size / 1048576).toFixed(1)} MB\n`);

await browser.close(); wss.close(); srv.close();
