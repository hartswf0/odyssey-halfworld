#!/usr/bin/env node
/* ============================================================================
   build-film.mjs — ASSEMBLY. Title, picture, sound, one file.

   ODYSSEY.mp4 =  odyssey-title-beflix.html   (the 128×96 BEFLIX frame where
                                               every dot is a scene, sorting
                                               itself into the word)
                + odyssey-syncwatch.html's PLAN CAMERA, all 152 scenes
                + the studio recordings under the album beds.

   This script owns only the joins. The picture comes from render-film.mjs and
   the sound from build-film-audio.mjs; if their outputs are already on disk it
   uses them, and if they are not it runs them, so `node harness/build-film.mjs`
   from a clean tree makes the whole film.

   THE TITLE IS RENDERED, NOT CLICKED. The page has a FRAMES button that walks
   the clock and downloads a PNG per frame; that is for a human. Here the same
   clock is walked through S.render(t) — the page's own frame function — with
   the pixels going out over a socket, and the title is encoded at the FILM's
   size and frame rate so that title and picture concatenate without a
   re-encode.

   USAGE
     node harness/build-film.mjs                  # everything, 1280x720 @24
     node harness/build-film.mjs --hd             # 1920x1080 @30
     node harness/build-film.mjs --no-title       # picture + sound only
     node harness/build-film.mjs --title-only     # just rebuild the title reel

   OUTPUT  film/ODYSSEY.mp4  ·  film/README.md
   ========================================================================== */

import { chromium } from "/Users/gaia/node_modules/playwright/index.mjs";
import WS from "/Users/gaia/node_modules/ws/index.js";
const { WebSocketServer } = WS;
import { spawn } from "node:child_process";
import { mkdir, writeFile, stat, readFile } from "node:fs/promises";
import { existsSync, createReadStream } from "node:fs";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { stat as statCb } from "node:fs/promises";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FFMPEG  = process.env.FFMPEG  || "/Users/gaia/anaconda3/bin/ffmpeg";
const FFPROBE = process.env.FFPROBE || "/Users/gaia/anaconda3/bin/ffprobe";
const FILM = resolve(ROOT, "film");

const A = process.argv.slice(2);
const arg  = (k, d) => { const i = A.indexOf("--" + k); return i < 0 ? d : A[i + 1]; };
const flag = k => A.includes("--" + k);
const HD  = flag("hd");
const W   = +arg("w", HD ? 1920 : 1280);
const H   = +arg("h", HD ? 1080 : 720);
const FPS = +arg("fps", HD ? 30 : 24);
const BV  = arg("bitrate", HD ? "20M" : "10M");
const WORKERS = arg("workers", "8");
const NO_TITLE   = flag("no-title");
const TITLE_ONLY = flag("title-only");
/* the title's music. The page defaults to BRONZE COUNCIL 1 and the film's
   Book I bed is the same track, so the cut from title to film is a continuation
   rather than a change of record. */
const TITLE_TRACK = arg("title-track", "bronze-council:1");

const V_OUT = join(FILM, "odyssey-video.mp4");
const A_OUT = join(FILM, "odyssey-audio.m4a");
const T_OUT = join(FILM, "odyssey-title.mp4");
const OUT   = resolve(ROOT, arg("out", "film/ODYSSEY.mp4"));

const sh = (cmd, args, opts = {}) => new Promise((res, rej) => {
  const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], ...opts });
  let out = "", err = "";
  p.stdout.on("data", d => out += d); p.stderr.on("data", d => err += d);
  p.on("error", rej);
  p.on("close", c => c === 0 ? res({ out, err }) : rej(new Error(cmd + " exit " + c + "\n" + err.slice(-2500))));
});
const run = (cmd, args) => new Promise((res, rej) => {
  const p = spawn(cmd, args, { stdio: "inherit", cwd: ROOT });
  p.on("close", c => c === 0 ? res() : rej(new Error(cmd + " " + args.join(" ") + " exit " + c)));
});
const probe = async (f, ent) => (await sh(FFPROBE, ["-v", "error", "-show_entries", ent,
  "-of", "default=nw=1:nk=1", f])).out.trim();
const fmtT = s => { s = Math.max(0, s); const h = s / 3600 | 0, m = (s / 60 | 0) % 60;
  return `${h}:${String(m).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`; };

const MIME = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".css": "text/css", ".ogg": "audio/ogg",
  ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".m4a": "audio/mp4" };
const startStatic = () => new Promise(res => {
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

/* ══════════════════════════════════════════════════════════════════════════
   THE TITLE REEL
   ════════════════════════════════════════════════════════════════════════ */
async function buildTitle() {
  const srv = await startStatic();
  const base = `http://127.0.0.1:${srv.address().port}`;
  const wss = new WebSocketServer({ port: 0, perMessageDeflate: false, maxPayload: 64e6 });
  await new Promise(r => wss.on("listening", r));
  const wsPort = wss.address().port;

  const browser = await chromium.launch({ headless: true, args: ["--mute-audio", "--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on("pageerror", e => console.error("  [title] page error:", String(e).slice(0, 200)));

  /* snap=1 lets the page put its movement boundaries on the track's onsets —
     that is the authored behaviour, and it is what the browser does when you
     give it a track. The duration that comes back is the one we encode. */
  const url = `${base}/odyssey-title-beflix.html?w=${W}&snap=1&track=${encodeURIComponent(TITLE_TRACK)}`;
  console.log("[title] " + url.replace(base, ""));
  await page.goto(url, { waitUntil: "load", timeout: 240000 });
  await page.waitForFunction(() => window.__beflix && window.__beflix.ready, null, { timeout: 240000 });
  const warm = await page.evaluate(() => window.__beflix.warm());
  const rep = await page.evaluate(() => { const S = window.__beflix;
    return { duration: S.report().duration, boundaries: S.boundaries || S.report().boundaries,
      snapped: S.snapped, bpm: S.bpm, onsets: S.beats.length, track: S.track,
      grid: S.report().grid, legibility: S.report().legibility }; });
  console.log(`[title] ${rep.duration}s · ${rep.snapped ? "snapped to " + rep.onsets + " onsets @" + rep.bpm + "bpm" : "nominal boundaries"}`
    + ` · ${rep.track ? rep.track.album + " " + rep.track.num + " — " + rep.track.title : "silent"}`
    + ` · thumbs ${warm.thumbs} · ${warm.fullLoaded} full renders`);

  const cv = await page.evaluate(() => { const c = document.getElementById("stage");
    return [c.width, c.height]; });
  if (cv[0] !== W || cv[1] !== H)
    console.log(`[title] NOTE canvas is ${cv[0]}x${cv[1]}, film is ${W}x${H} — scaling on encode`);

  const frames = Math.round(rep.duration * FPS);
  /* MATCH THE FILM'S COLOUR EXACTLY. render-film.mjs writes full-range
     (yuvj420p / color_range=pc) because pane C's paper is 253 and a limited
     range roundtrip would eat the top three values. The title has to agree or
     the two reels cannot be concatenated without a re-encode — and if they
     were joined anyway the second SPS would be ignored and one of them would
     play with the wrong contrast. */
  const vf = ((cv[0] !== W || cv[1] !== H) ? `scale=${W}:${H}:flags=neighbor,` : "")
    + "scale=in_range=full:out_range=full,format=yuv420p";
  const vpath = join(FILM, ".title-video.mp4");
  const ff = spawn(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error",
    "-color_range", "pc",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${cv[0]}x${cv[1]}`, "-r", String(FPS), "-i", "-",
    "-vf", vf, "-color_range", "pc",
    "-c:v", "h264_videotoolbox", "-b:v", BV, "-allow_sw", "1",
    "-movflags", "+faststart", "-f", "mp4", vpath], { stdio: ["pipe", "ignore", "pipe"] });
  let ffErr = ""; ff.stderr.on("data", d => ffErr += d);
  ff.stdin.on("error", () => {});
  const ffDone = new Promise((res, rej) => ff.on("close", c =>
    c === 0 ? res() : rej(new Error("ffmpeg exit " + c + "\n" + ffErr.slice(-2000)))));
  let got = 0;
  wss.on("connection", ws => ws.on("message", m => { got++; ff.stdin.write(m); }));

  await page.evaluate(async ({ wsPort }) => {
    const ws = new WebSocket("ws://127.0.0.1:" + wsPort);
    ws.binaryType = "arraybuffer";
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    window.__filmSock = ws;
  }, { wsPort });

  const BATCH = 60;
  for (let f = 0; f < frames; f += BATCH) {
    const n = Math.min(BATCH, frames - f);
    await page.evaluate(async ({ f0, n, fps }) => {
      const S = window.__beflix, ws = window.__filmSock;
      const cv = document.getElementById("stage");
      const g = cv.getContext("2d", { willReadFrequently: true });
      for (let k = 0; k < n; k++) {
        S.render((f0 + k) / fps);
        const d = g.getImageData(0, 0, cv.width, cv.height).data;
        const m = d.length >> 2, rgb = new Uint8Array(m * 3);
        for (let i = 0, j = 0; j < m * 3; i += 4, j += 3) {
          rgb[j] = d[i]; rgb[j + 1] = d[i + 1]; rgb[j + 2] = d[i + 2];
        }
        ws.send(rgb.buffer);
        while (ws.bufferedAmount > 8 * m) await new Promise(r => setTimeout(r, 0));
      }
    }, { f0: f, n, fps: FPS });
    process.stdout.write(`\r[title] ${Math.min(f + BATCH, frames)}/${frames} frames   `);
  }
  await page.evaluate(async () => { const ws = window.__filmSock;
    while (ws.bufferedAmount > 0) await new Promise(r => setTimeout(r, 2)); });
  await new Promise(r => setTimeout(r, 200));
  ff.stdin.end(); await ffDone;
  console.log(`\r[title] ${got} frames encoded            `);
  await browser.close(); wss.close(); srv.close();

  /* the title's own music, under it, fading into the film's Book I bed */
  const ALB = JSON.parse(await readFile(resolve(ROOT, "audio/albums.json"), "utf8"));
  const [aid, num] = TITLE_TRACK.includes(":") ? TITLE_TRACK.split(":") : ["bronze-council", TITLE_TRACK];
  const alb = (ALB.albums || []).find(a => a.id === aid) || ALB.albums[0];
  const trk = alb.tracks.find(t => t.num === +num) || alb.tracks[0];
  const apath = join(FILM, ".title-audio.m4a");
  await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error",
    "-i", resolve(ROOT, alb.dir, trk.file),
    "-af", `atrim=end=${rep.duration},asetpts=PTS-STARTPTS,`
      + `afade=t=in:st=0:d=1.5,afade=t=out:st=${Math.max(0, rep.duration - 2.4).toFixed(2)}:d=2.4,`
      + `volume=0.55`,
    "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2", apath]);

  await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error",
    "-i", vpath, "-i", apath, "-c", "copy", "-shortest", "-movflags", "+faststart", T_OUT]);
  console.log(`[title] ${T_OUT.replace(ROOT + "/", "")} · ${await probe(T_OUT, "format=duration")}s`);
  return { ...rep, frames: got };
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════════════ */
async function main() {
  await mkdir(FILM, { recursive: true });
  const t0 = Date.now();
  let titleInfo = null;

  if (!NO_TITLE && (TITLE_ONLY || !existsSync(T_OUT))) titleInfo = await buildTitle();
  else if (existsSync(T_OUT)) console.log("[title] already built — reusing " + T_OUT.replace(ROOT + "/", ""));
  if (TITLE_ONLY) return;

  if (!existsSync(V_OUT)) {
    console.log("[film] rendering the picture (this is the long one)…");
    await run("node", ["harness/render-film.mjs", "--w", String(W), "--h", String(H),
      "--fps", String(FPS), "--bitrate", BV, "--workers", WORKERS]);
  } else console.log("[film] picture already rendered — reusing " + V_OUT.replace(ROOT + "/", ""));

  if (!existsSync(A_OUT)) {
    console.log("[film] building the audio master…");
    await run("node", ["harness/build-film-audio.mjs"]);
  } else console.log("[film] audio already built — reusing " + A_OUT.replace(ROOT + "/", ""));

  /* ── PICTURE: title + film, no re-encode ── */
  const parts = [];
  if (!NO_TITLE && existsSync(T_OUT)) parts.push(join(FILM, ".title-video.mp4"));
  parts.push(V_OUT);
  const lf = join(FILM, ".concat-video.txt");
  await writeFile(lf, parts.map(p => `file '${p}'`).join("\n") + "\n");
  const vcat = join(FILM, ".all-video.mp4");
  console.log("[film] joining picture…");
  await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0",
    "-i", lf, "-c", "copy", "-f", "mp4", vcat]);

  /* ── SOUND: title music + the audio master, one encode ── */
  const acat = join(FILM, ".all-audio.m4a");
  console.log("[film] joining sound…");
  if (!NO_TITLE && existsSync(join(FILM, ".title-audio.m4a"))) {
    await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error",
      "-i", join(FILM, ".title-audio.m4a"), "-i", A_OUT,
      "-filter_complex", "[0:a][1:a]concat=n=2:v=0:a=1[out]", "-map", "[out]",
      "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2", acat]);
  } else await sh("/bin/cp", [A_OUT, acat]);

  /* ── MUX ── */
  console.log("[film] muxing → " + OUT.replace(ROOT + "/", ""));
  await sh(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", "-i", vcat, "-i", acat,
    "-c", "copy", "-movflags", "+faststart", OUT]);

  const dur = +await probe(OUT, "format=duration");
  const vdur = +await probe(vcat, "format=duration");
  const adur = +await probe(acat, "format=duration");
  const sz = (await stat(OUT)).size;
  const info = (await sh(FFPROBE, ["-v", "error", "-show_entries",
    "stream=index,codec_type,codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels",
    "-of", "default=nw=1", OUT])).out.trim();
  console.log(`\n[film] ── ${OUT.replace(ROOT + "/", "")}`);
  console.log(info.split("\n").map(l => "        " + l).join("\n"));
  console.log(`        duration ${fmtT(dur)} · picture ${fmtT(vdur)} · sound ${fmtT(adur)}`
    + ` · drift ${(vdur - adur).toFixed(3)}s`);
  console.log(`        ${(sz / 1e9).toFixed(2)} GB · assembled in ${((Date.now() - t0) / 60000).toFixed(1)} min`);

  await writeReadme({ dur, vdur, adur, sz, titleInfo, info });
  return OUT;
}

/* ══════════════════════════════════════════════════════════════════════════
   THE NOTE THAT SHIPS INSTEAD OF THE FILE
   ════════════════════════════════════════════════════════════════════════ */
async function writeReadme({ dur, vdur, adur, sz, titleInfo, info }) {
  const filmDur = +await probe(V_OUT, "format=duration");
  const audDur  = +await probe(A_OUT, "format=duration");
  const tDur = existsSync(T_OUT) ? +await probe(T_OUT, "format=duration") : 0;
  const md = `# ODYSSEY — the film

\`film/ODYSSEY.mp4\` is **not in this repository.** It is ${(sz / 1e9).toFixed(1)} GB.
Everything needed to make it again is, and this note is how.

    node harness/build-film.mjs

That one command builds all three parts and joins them. It takes about
${(dur / 60 / 45).toFixed(0)}–${(dur / 60 / 30).toFixed(0)} minutes on an M3 Max with eight render workers, and it is resumable:
finished picture segments in \`film/.segments/\` are skipped on a rerun, so a
crash or a Ctrl-C costs you one segment, not the film.

## What it is

| | |
|---|---|
| duration | **${fmtT(dur)}** |
| title | ${fmtT(tDur)} — \`odyssey-title-beflix.html\`, 128×96 cells, every dot a scene |
| picture | ${fmtT(filmDur)} — \`odyssey-syncwatch.html\` pane C, the PLAN CAMERA, 152 scenes |
| sound | ${fmtT(audDur)} — 152 studio recordings over the album beds |
| streams | ${info.split("\n").filter(l => /codec_name|width|height|r_frame_rate|pix_fmt|sample_rate|channels/.test(l)).join(", ")} |

The clock is not a decision. It is the sum of the 152 recordings in
\`drive/voice-manifest.json\`, taken in id order: **9877.21 s = 2 h 44 m 37 s.**
The page builds that clock in the browser and the harness builds the same clock
in node out of the same file, which is why a frame at *t* and a sample at *t*
are the same instant.

## The three parts

### 1 · \`harness/build-film-audio.mjs\` → \`film/odyssey-audio.m4a\`

Concatenates the 152 recordings, each **padded or trimmed to the duration the
manifest claims** rather than to its own — the recordings drift from the
manifest by up to 0.1 s each and the drift is reported at the top of every run.
Under them, each book's mapped album track, looped to cover the book, at 0.18,
ducked to 0.10 while a voice segment sounds. The duck is not a sidechain: the
manifest gives the exact interval of every spoken segment in the film, so the
envelope is *drawn* — 150 ms raised cosine on each edge — written as a 1 kHz
WAV whose sample values are the gain, and multiplied into the bed with
\`amultiply\`. Book seams get a 1.6 s fade out / 1.2 s fade in; they land in the
2.4 s of bed-only breath the scene timings already carry.

### 2 · \`harness/render-film.mjs\` → \`film/odyssey-video.mp4\`

Playwright drives \`odyssey-syncwatch.html?render=1\` headlessly. For frame *n*
it sets the clock to exactly *n/fps*, redraws pane C synchronously, and pushes
the raw pixels out over a WebSocket straight into an ffmpeg stdin pipe. **No
PNG is ever written.** Pane C is two colours — paper \`#fdfdfa\`, ink \`#0a0a0a\`
— so one byte per pixel carries it losslessly and the paper's warmth is put
back on the far side with a three-term \`lutrgb\` (verified exact: 253 → 253,253,250).

The render is cut into segments **on scene boundaries**, which is what makes
resumption free: the page snaps its camera whenever the scene id changes, so a
segment that starts at a scene start has exactly the camera state a continuous
pass would have given it. Segments are independent, so several render at once.

    node harness/render-film.mjs --workers 8 --chunk 150      # default
    node harness/render-film.mjs --hd                         # 1920x1080 @30
    node harness/render-film.mjs --estimate                   # cost, no render

### 3 · \`harness/build-film.mjs\` → \`film/ODYSSEY.mp4\`

Renders the title through its own \`S.render(t)\` at the film's size and frame
rate (so title and picture concatenate with \`-c copy\`), lays its music under
it, and muxes the audio master.

## The one change to a page

\`odyssey-syncwatch.html\` gained a \`?render=1\` mode — a commented block at the
top of its script and five guards below it. With the flag absent \`RENDER\` is
\`false\` and every guard falls through to the code that was there before. This
was checked, not assumed: the page was driven to eight timecodes with and
without the patch and the ink counts of all five panes, the camera rectangle,
the resolved subject and the caption text came back **identical**.

## Rebuilding a part

    rm film/odyssey-audio.m4a  && node harness/build-film-audio.mjs
    rm -rf film/.segments      && node harness/render-film.mjs
    node harness/build-film.mjs --title-only
    node harness/build-film.mjs                # rejoins whatever exists

*Built ${new Date().toISOString().slice(0, 16).replace("T", " ")} · ffmpeg h264_videotoolbox · Chromium via Playwright.*
`;
  await writeFile(join(FILM, "README.md"), md);
  console.log("[film] wrote film/README.md");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error("\n" + (e.stack || e)); process.exit(1); });
}
