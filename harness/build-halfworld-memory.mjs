/* ============================================================
   build-halfworld-memory.mjs
   Emit the Odyssey corpus as HALFWORLD MEMORY objects — one per book.

   THE LOADER IS THE SPEC. Every shape below was read out of
   halfworld-studio.html (hartswf0/halfworld@main), not out of its README.
   Where the two disagree the loader wins; the disagreements are recorded in
   halfworld/CONTRACT-NOTES.md. The load-bearing ones:

     · schema is "halfworld/v2"           (README says v1; load() accepts v[12]
                                           and normalizeProject() upgrades v1 by
                                           FORCING cast.face=0 — so v1 would
                                           silently destroy every facing we
                                           emit. We emit v2.)
     · MEMORY is { schema, name, cast{}, assets{}, instances[], score{fps,rows},
                   scenes{}, ledger[], nextId, turn }
                                          (README's `stages`/`scores`/`worlds`
                                           do not exist. The project IS one
                                           stage; `scenes` is the map of frozen
                                           stages — character ⊂ scene ⊂ world.)
     · CAST is { id, spec, x, z, face, pose, decals }
                                          (README's `look` is `spec`; README's
                                           face:{style,tone} is a NUMBER — the
                                           facing angle. initCharRuntime does
                                           c.F = c.face || 0.)
     · spec.skin MUST be a "#rrggbb" string, or normalizeSpec() throws the whole
       spec away and substitutes a preset. spec.h / spec.build / spec.headS are
       read as numbers by mkMetrics(); spec.shirt is read by mkCharTones().
     · ASSET is { id, word, grid:{cols,rows,cells:[{i,j,v}]} }
                                          (README says {kind,dots}. drawAsset()
                                           dereferences a.grid.cols with no
                                           guard: an asset without a grid is a
                                           hard crash, so every asset here
                                           carries real measured ink.)
     · SCORE row { id, c, s, d, t, m } — s and d are SECONDS, not frames.
       scoredState() does u=(t-r.s)/r.d against a seconds playhead and tc()
       renders r.s as seconds. fps is 24 (const FPS=24 in the loader).
     · m accepts EXACTLY three cues: pose=<key of POSES>, walk=<x>,<z>,
       face=<left|right|front|back>. parseCues() silently drops anything else.
     · world units: x ∈ [-10,10] (clampX, WORLD_X=10), z ∈ [0.04,1] (clampZ).
       Plan space is x 0..1 / z 0..1 far..near, so z passes through untouched
       and x is placed on the loader's own axis: wx = (planX-0.5)*20.

   Everything the Odyssey carries that the contracts have no room for —
   exitOccupancy handoff, conceal/reveal, the guise ramp, fx phase, the true
   pose name, the delivery note — goes in `x_odyssey`, which a strict loader
   ignores (JSON.stringify keeps it; normalizeProject never touches it).

   Usage:
     node harness/build-halfworld-memory.mjs [--out halfworld] [--cache DIR]
                                             [--books 1-24] [--no-grids]
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import vm from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const J = p => JSON.parse(readFileSync(resolve(ROOT, p), "utf8"));

/* ---- args --------------------------------------------------------------- */
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const OUT      = resolve(ROOT, arg("--out", "halfworld"));
const CACHEDIR = resolve(arg("--cache", resolve(tmpdir(), "odyssey-halfworld-grids")));
const NO_GRIDS = argv.includes("--no-grids");
const BOOKS = (() => {
  const s = arg("--books", "1-24");
  const m = /^(\d+)-(\d+)$/.exec(s);
  if (m) { const a = []; for (let i = +m[1]; i <= +m[2]; i++) a.push(i); return a; }
  return s.split(",").map(Number);
})();

/* ============================================================
   1 · THE LOADER'S OWN VOCABULARIES, transcribed verbatim.
   These are not our choices. They are what parseCues/POSES/FACINGS accept.
   ============================================================ */
const HW_POSES = new Set([
  "neutral","look left","look right","look up","look down","3/4 left","3/4 right",
  "profile left","profile right","turn back","head tilt","nod","head shake","happy",
  "laughing","angry","skeptical","surprised","sad","tired","arms crossed","shrug",
  "one arm raised","both raised","open arms","pointing","thumbs up","peace","wave",
  "stop","thinking","hands near face","self touch","hold stick","hold cup",
  "phone call","carry box","walk",
]);
/* the facing number each halfworld pose imposes (POSES[p].facing), so `face`
   agrees with `pose` instead of fighting it. */
const HW_POSE_FACING = {
  "3/4 left": -0.62, "3/4 right": 0.62,
  "profile left": -1, "profile right": 1, "turn back": 1.6,
};
const WORLD_X = 10, HW_FPS = 24;
const clampX = x => Math.max(-WORLD_X, Math.min(WORLD_X, +x || 0));
const clampZ = z => Math.max(0.04, Math.min(1, +z || 0.5));
const r2 = n => Math.round(n * 100) / 100;
const r3 = n => Math.round(n * 1000) / 1000;

/* halfworld's own HERO preset. Used ONLY for the four spec fields the loader
   reads and the Odyssey corpus does not carry (build, headS, browW/eyeS/mouthW,
   shirt). Declared, never silently invented — see CONTRACT-NOTES §CAST. */
const HERO_DEFAULTS = { headS: 1.00, build: 1.00, browW: 1.0, eyeS: 1.00, mouthW: 1.00, shirt: "#d3d3cd" };

/* engine POSE_ID (42, ours) -> halfworld POSES key (38, theirs).
   A translation between two CLOSED vocabularies, not invented data. Entries
   marked LOSSY have no counterpart and fall to the nearest body attitude. */
const POSE_XLAT = {
  neutral_front:"neutral", breathing_idle:"neutral", weight_shift:"neutral",
  three_quarter_left:"3/4 left", three_quarter_right:"3/4 right",
  profile_left:"profile left", profile_right:"profile right", back_view:"turn back",
  walk_neutral:"walk", step_closer:"walk", step_away:"walk",
  head_left:"look left", head_right:"look right", head_lowered:"look down",
  repeated_nod:"nod", rapid_head_shake:"head shake",
  lean_forward:"neutral",      // LOSSY — halfworld has no torso lean
  lean_backward:"neutral",     // LOSSY
  crouch:"neutral",            // LOSSY — no crouch in the 38
  kneel:"neutral",             // LOSSY — no kneel in the 38
  torso_open:"open arms", arms_open:"open arms", open_palm:"open arms",
  offering_hand:"open arms",
  arms_crossed:"arms crossed", guarded_withdrawal:"arms crossed",
  one_arm_raised:"one arm raised", both_hands_raised:"both raised",
  enthusiasm:"both raised",
  shrug:"shrug", palm_up_question:"shrug",
  reach_forward:"stop", protective_block:"stop",
  pointing_arm:"pointing", hand_point:"pointing",
  hands_near_face:"hands near face", desperation:"hands near face",
  wave:"wave", skepticism:"skeptical", confrontation:"angry",
  grief:"sad", laughter:"laughing",
};

/* ============================================================
   2 · SOURCES
   ============================================================ */
console.error("· loading sources");
const manifest = J("viewer/odyssey-manifest.json");
const turnsDoc = J("viewer/performance-turns.json");
const linesDoc = J("viewer/spoken-lines.json");
const voice    = J("drive/voice-manifest.json");
const drive    = J("drive/drive-script.json");
const albums   = existsSync(resolve(ROOT, "audio/albums.json")) ? J("audio/albums.json") : null;

const LINES = linesDoc.lines || linesDoc;
const TURNS_BY_SCENE = turnsDoc.byScene;
const DRIVE_BY_SCENE = Object.fromEntries(drive.scenes.map(s => [s.id, s]));

const fh = await import(pathToFileURL(resolve(ROOT, "engine/figure-hero.mjs")).href);
const ENGINE_ALIAS = fh.POSE_ALIAS, ENGINE_IDS = new Set(fh.POSE_IDS);

/* --- assets -------------------------------------------------------------- */
const ASSETS = new Map();
for (const d of readdirSync(resolve(ROOT, "assets")).filter(x => statSync(resolve(ROOT, "assets", x)).isDirectory()))
  for (const f of readdirSync(resolve(ROOT, "assets", d)).filter(f => f.endsWith(".mjs"))) {
    const rel = `assets/${d}/${f}`;
    const m = await import(pathToFileURL(resolve(ROOT, rel)).href);
    if (m.asset) ASSETS.set(m.asset.id, { ...m.asset, _rel: rel });
  }

/* --- scenes -------------------------------------------------------------- */
const SCENES = new Map();
for (const f of readdirSync(resolve(ROOT, "scenes")).filter(f => /^OD-.*\.mjs$/.test(f)).sort()) {
  const m = await import(pathToFileURL(resolve(ROOT, "scenes", f)).href);
  if (m.scene) SCENES.set(m.scene.id, { ...m.scene, _file: `scenes/${f}`, _exitOccupancy: m.exitOccupancy || m.scene.exitOccupancy || null });
}

/* --- plans --------------------------------------------------------------- */
const PLANS = new Map();
for (const f of readdirSync(resolve(ROOT, "scenes/_plans")).filter(f => f.endsWith(".mjs"))) {
  const m = await import(pathToFileURL(resolve(ROOT, "scenes/_plans", f)).href);
  for (const v of Object.values(m)) if (v && typeof v === "object" && v.stations && v.at) PLANS.set(v.id, v);
}

/* ============================================================
   3 · MOVES / INITIAL — authored blocking, recovered from source.
   MOVES and INITIAL are module-local consts, so they are not importable. They
   are plain literals over a plain numeric clock, so they are read by lifting
   the file's own top-level numeric consts into a vm sandbox and evaluating the
   two literals there. This reads AUTHORED data; nothing is reconstructed. A
   scene whose literals do not evaluate contributes no walk cues and is counted.
   ============================================================ */
const STATS = { movesParsed: 0, movesDeclared: 0, movesFailed: [], initialParsed: 0, initialDeclared: 0, initialFailed: [] };

/* find the end of `const NAME = <init>;` — a `;` at bracket depth 0, outside
   any string, template or comment. */
function initEnd(src, from) {
  let d = 0, i = from, q = null;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (q) {
      if (c === "\\") { i += 2; continue; }
      if (c === q) q = null;
      i++; continue;
    }
    if (c === "/" && n === "/") { i = src.indexOf("\n", i); if (i < 0) return -1; continue; }
    if (c === "/" && n === "*") { i = src.indexOf("*/", i); if (i < 0) return -1; i += 2; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; i++; continue; }
    if (c === "(" || c === "[" || c === "{") d++;
    else if (c === ")" || c === "]" || c === "}") d--;
    else if (c === ";" && d === 0) return i;
    i++;
  }
  return -1;
}

async function readBlocking(file) {
  const src = readFileSync(resolve(ROOT, file), "utf8");
  const ctx = vm.createContext({ Object, Math, Array, JSON, Number, String, Boolean });

  /* bind the file's own named imports. Book XVI+ scenes chain continuity as
     `import { exitOccupancy as PREV_EXIT } from "./OD-B22-S01.mjs"`, so INITIAL
     is literally the previous scene's exit occupancy. Resolving it here is what
     makes the handoff real rather than re-improvised. */
  const impRe = /^import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']\s*;?/gm;
  let im;
  while ((im = impRe.exec(src))) {
    const spec = im[2];
    let ns; try { ns = await import(pathToFileURL(resolve(ROOT, dirname(file), spec)).href); } catch { continue; }
    for (const part of im[1].split(",")) {
      const m2 = /^\s*([\w$]+)(?:\s+as\s+([\w$]+))?\s*$/.exec(part);
      if (!m2) continue;
      const src_ = m2[1], as = m2[2] || m2[1];
      if (ns[src_] !== undefined) ctx[as] = ns[src_];
    }
  }

  /* run every top-level `const` declaration, in file order, as a `var` so it
     lands on the context. Anything that does not evaluate (a function body, a
     module reference we did not bind) is skipped; the clock, the station tables,
     INITIAL and MOVES all do. */
  const declRe = /^const\s+/gm;
  let dm;
  while ((dm = declRe.exec(src))) {
    const start = dm.index;
    const end = initEnd(src, start + 6);
    if (end < 0) continue;
    const stmt = src.slice(start, end + 1);
    if (/=>|\bfunction\b/.test(stmt.slice(0, stmt.indexOf("=") + 1))) continue;
    try { vm.runInContext("var " + stmt.slice(6), ctx, { timeout: 500 }); } catch { /* skip */ }
  }

  /* a scene may author its OWN plan inline (`export const forecourt =
     makePlan({...})`, or `const plan = makePlan({ stations:{...megaron.stations,
     ...EXTRA} })`) instead of importing a shared one. Those stations are just as
     authored as the shared ones, so a plan found in the module's exports or in
     its own top-level scope counts as authored blocking, not a reconstruction. */
  const looksPlan = v => v && typeof v === "object" && v.stations && typeof v.at === "function" && Object.keys(v.stations).length;
  let localPlan = null;
  for (const v of Object.values(ctx)) if (looksPlan(v)) { localPlan = v; break; }

  const MOVES = Array.isArray(ctx.MOVES) ? ctx.MOVES : null;
  const INITIAL = ctx.INITIAL && typeof ctx.INITIAL === "object" && !Array.isArray(ctx.INITIAL) ? ctx.INITIAL : null;
  if (/^const\s+MOVES\s*=/m.test(src)) { STATS.movesDeclared++; if (MOVES) STATS.movesParsed++; else STATS.movesFailed.push(file); }
  if (/^const\s+INITIAL\s*=/m.test(src)) { STATS.initialDeclared++; if (INITIAL) STATS.initialParsed++; else STATS.initialFailed.push(file); }
  return { MOVES, INITIAL, localPlan };
}
for (const sc of SCENES.values()) {
  const b = await readBlocking(sc._file);
  // an exported plan on the scene module itself wins over one found in scope
  const m = await import(pathToFileURL(resolve(ROOT, sc._file)).href);
  for (const v of Object.values(m))
    if (v && typeof v === "object" && v.stations && typeof v.at === "function" && Object.keys(v.stations).length) { b.localPlan = v; break; }
  Object.assign(sc, b);
}

/* ============================================================
   4 · GEOMETRY — plan space in, loader world units out.

   Plan space (engine/blocking.mjs): x 0..1 left..right, z 0..1 far..near.
   The projection every scene composes through is
       spread = 0.42 + 0.58 d ;  x' = 0.5 + (x-0.5)·spread
       y'     = 0.50 + 0.46 d^1.08
   which is a bijection on the domain, so a hand-anchored (x',y') inverts back
   to a plan (x,z) exactly. Scenes WITH a plan resolve by station name and are
   exact; scenes WITHOUT one (Books I–XV collages) are inverted from their
   authored screen anchor and their stage is flagged derived:true.
   ============================================================ */
const SPREAD_FAR = 0.42;
function planToWorld(px, pz) { return { x: clampX((px - 0.5) * 2 * WORLD_X), z: clampZ(pz) }; }
function invertAnchor(ax, ay) {
  const d = Math.max(0.08, Math.min(1, Math.pow(Math.max(1e-6, (ay - 0.50) / 0.46), 1 / 1.08)));
  const spread = SPREAD_FAR + (1 - SPREAD_FAR) * d;
  return { x: Math.max(0, Math.min(1, 0.5 + (ax - 0.5) / spread)), z: d };
}
function stationWorld(planId, station) {
  const p = PLANS.get(planId); const s = p && p.stations[station];
  return s ? planToWorld(s.x, s.z) : null;
}

/* ============================================================
   5 · POSE resolution — the repo's own resolver, then the vocabulary xlat.
   figure-hero.mjs line 238 is verbatim:
       poseId = POSE_ALIAS[poseId] || (POSES[poseId] ? poseId : "neutral_front")
   so a per-actor pose name the shared rig does not know already collapses to
   neutral_front in this repo. We reproduce that, plus one mechanical widening:
   an actor-prefixed name (`eum_listen`) is retried on its own tail against the
   SAME engine alias table. Nothing is guessed from English.
   ============================================================ */
const POSE_STATS = { uses: 0, exact: 0, alias: 0, strip: 0, none: 0 };
function resolveEnginePose(p) {
  if (!p) return null;
  POSE_STATS.uses++;
  if (ENGINE_ALIAS[p]) { POSE_STATS.alias++; return ENGINE_ALIAS[p]; }
  if (ENGINE_IDS.has(p)) { POSE_STATS.exact++; return p; }
  const parts = String(p).split(/[_-]/);
  for (let i = 1; i < parts.length; i++) {
    const tail = parts.slice(i).join("_");
    if (ENGINE_ALIAS[tail]) { POSE_STATS.strip++; return ENGINE_ALIAS[tail]; }
    if (ENGINE_IDS.has(tail)) { POSE_STATS.strip++; return tail; }
  }
  POSE_STATS.none++;
  return null;
}
function hwPose(odysseyPose) {
  const eng = resolveEnginePose(odysseyPose);
  const hw = eng ? POSE_XLAT[eng] : null;
  return hw && HW_POSES.has(hw) ? hw : "neutral";
}

/* ============================================================
   6 · CAST — figure params in, halfworld spec out.
   ============================================================ */
const HAIR_XLAT = { short: "cap", curly: "curly", long: "long", bald: "none" };
const GARMENT_XLAT = { robe: "dress", dress: "dress" };   // the rest pass through:
// halfworld only special-cases 'dress' and 'hoodie'; 'tunic'/'rags'/'armor' render
// as the default long garment AND keep their true word in the roster label, so
// passing them through is strictly more faithful than flattening to 'sweater'.
const CAST_STATS = { supplied: { build: 0, headS: 0, shirt: 0, face: 0 }, hairColorDropped: 0 };

function isRigCharacter(a) {
  return a && a.type === "CHARACTER" && a.params && typeof a.params.skin === "string" && a.params.skin[0] === "#";
}
/* LOCATION / ENVIRONMENT are the FIELD, not a placement. halfworld's STAGE
   contract has no backdrop slot — the ground plane is procedural and every
   entry in `instances` is a sprite anchored at an (x,z). A whole-room study
   downsampled into a 32-column sprite and hung on a floor mark is a black slab
   over the scene, so the room is recorded in x_odyssey.field instead of being
   forced into a shape the contract does not have. Reported as a gap. */
const FIELD_TYPES = new Set(["LOCATION", "ENVIRONMENT"]);
const isField = a => a && FIELD_TYPES.has(a.type);
function specFrom(params) {
  const p = params || {};
  CAST_STATS.supplied.build++; CAST_STATS.supplied.headS++; CAST_STATS.supplied.shirt++;
  if (p.hairColor) CAST_STATS.hairColorDropped++;
  return {
    skin: p.skin,                                        // ours -> theirs, exact
    hair: HAIR_XLAT[p.hair] || "none",
    beard: !!p.beard,
    glasses: !!p.glasses,                                // real; never faked
    garment: GARMENT_XLAT[p.garment] || p.garment || "tunic",
    h: typeof p.scale === "number" ? r3(p.scale) : 1,    // ours `scale` IS height
    ...HERO_DEFAULTS,                                    // build/headS/browW/eyeS/mouthW/shirt
  };
}
/* guise: ONE cast id, named look variants alongside it.
   Splitting a guise into one CAST id per look would break the loader outright —
   scoredState(id,t) seeds x,z from P.cast[id] and accumulates that id's walk
   cues only, so a guise change mid-scene would teleport the body and drop every
   row addressed to the other name. One body, one id. See CONTRACT-NOTES. */
function guiseVariants(a) {
  if (!a.guises || !a.guiseSpecs && !a.guiseDeltas) return null;
  return null; // filled below from the module's own GUISES if it exposes them
}

/* ============================================================
   7 · SPEAKERS — performance-turns `sp` is the TRUE speaker.
   drive-script.speakerId attributes ~76% of segments to PERFORMER.NARRATOR and
   is used ONLY for its per-segment audio timing, never for attribution.
   ============================================================ */
const SPK_STATS = { rows: 0, toCast: 0, toInstance: 0, narrator: 0, unbound: 0 };
/* A turn's `sp` names the PERSON; a scene casts a GUISE of that person
   (character.athena-as-mentor, character.odysseus-b16, sleeping-odysseus). The
   guise suffixes are a closed, authored set in assets/character/, so reducing to
   the person is a real join, not a guess. */
const baseName = id => String(id).replace(/^[a-z_-]+\./, "")
  .replace(/-as-[a-z-]+$/, "")                                       // -as-mentor, -as-beggar…
  .replace(/-(b16|revealed|restored|memory-variant)$/, "")           // continuity ids
  .replace(/^(sleeping|young|old)-/, "")                             // state-as-a-file ids
  .replace(/-under-leaves$/, "");
const isNarrator = sp => /^PERFORMER\./.test(String(sp || ""));
function resolveSpeaker(sp, castIndex) {
  if (!sp) return null;
  if (castIndex.byAsset.has(sp)) return castIndex.byAsset.get(sp);
  const b = baseName(sp);
  if (castIndex.byBase.has(b)) return castIndex.byBase.get(b);
  return null;
}

/* ============================================================
   8 · ASSET GRIDS — the law of the dot, measured not assumed.
   Every non-rig asset is drawn through the repo's OWN keyedModuleCanvas (which
   applies borderKey, the dot-law paper key), then area-averaged into a 32x22
   ink field, thresholded at the loader's own 0.14, quantised to ink 0..7, and
   BBOX-TRIMMED. The trim is the point: cols/rows are the extent of the ink, not
   the extent of the box, and the loader draws gw = grid.cols·u — so an asset's
   printed size is its measured art. That is the ink-fit rule.
   ============================================================ */
const GRID_W = 32, GRID_H = 22;                 // 1120x760, the stage's own box
const RENDER_W = 448, RENDER_H = 304;
const CACHE_FILE = resolve(CACHEDIR, `grids-${GRID_W}x${GRID_H}.json`);

async function buildGrids(ids) {
  if (!existsSync(CACHEDIR)) mkdirSync(CACHEDIR, { recursive: true });
  let cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};
  const todo = ids.filter(id => !cache[id]);
  if (!todo.length || NO_GRIDS) { console.error(`· grids: ${ids.length} (${todo.length} missing, cached ${ids.length - todo.length})`); return cache; }
  console.error(`· grids: rendering ${todo.length} assets through headless chromium`);
  const { chromium } = await import("playwright");
  const srv = createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/__grid") { res.writeHead(200, { "content-type": "text/html" }); return res.end("<!doctype html><meta charset=utf-8><body>"); }
    try {
      const f = resolve(ROOT, "." + p);
      if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      const ext = f.slice(f.lastIndexOf("."));
      const mime = { ".mjs": "text/javascript", ".js": "text/javascript", ".json": "application/json", ".html": "text/html" }[ext] || "application/octet-stream";
      const body = readFileSync(f);            // read BEFORE the header: a miss must 404, not crash the server
      res.writeHead(200, { "content-type": mime }); res.end(body);
    } catch { res.writeHead(404); res.end("404"); }
  });
  await new Promise(r => srv.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.goto(base + "/__grid", { waitUntil: "load" });

  const CHUNK = 20;
  for (let i = 0; i < todo.length; i += CHUNK) {
    const batch = todo.slice(i, i + CHUNK).map(id => ({ id, rel: "/" + ASSETS.get(id)._rel }));
    const out = await page.evaluate(async ({ batch, RENDER_W, RENDER_H, GRID_W, GRID_H }) => {
      const eng = await import("/engine/halfworld-engine.mjs");
      const res = {};
      for (const { id, rel } of batch) {
        try {
          const mod = (await import(rel)).asset;
          /* signature is (mod,w,h,state,sigExtra,thr=.895,pad=0) — thr is the
             dot-law paper cutoff and MUST keep its default; passing 0 here makes
             borderKey flood the whole frame and every grid comes back empty. */
          const cv = eng.keyedModuleCanvas(mod, RENDER_W, RENDER_H, mod.preview ? mod.preview() : {}, "grid", 0.895, 0);
          const g = cv.getContext("2d", { willReadFrequently: true });
          const w = cv.width, h = cv.height;
          const d = g.getImageData(0, 0, w, h).data;
          const sum = new Float64Array(GRID_W * GRID_H), cnt = new Float64Array(GRID_W * GRID_H);
          for (let y = 0; y < h; y++) {
            const jj = Math.min(GRID_H - 1, (y * GRID_H / h) | 0);
            for (let x = 0; x < w; x++) {
              const ii = Math.min(GRID_W - 1, (x * GRID_W / w) | 0);
              const o = (y * w + x) * 4, a = d[o + 3] / 255;
              const lum = (0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2]) / 255;
              const k = jj * GRID_W + ii;
              sum[k] += a * (1 - lum); cnt[k]++;
            }
          }
          let i0 = GRID_W, i1 = -1, j0 = GRID_H, j1 = -1; const raw = [];
          for (let j = 0; j < GRID_H; j++) for (let ii = 0; ii < GRID_W; ii++) {
            const k = j * GRID_W + ii;
            const v = cnt[k] ? sum[k] / cnt[k] : 0;
            if (v > 0.14) {                                  // the loader's own cutoff
              const q = Math.min(7, Math.max(1, Math.round(v * 7))) / 7;   // ink 1..7
              raw.push({ i: ii, j, v: Math.round(q * 1000) / 1000 });
              if (ii < i0) i0 = ii; if (ii > i1) i1 = ii; if (j < j0) j0 = j; if (j > j1) j1 = j;
            }
          }
          if (!raw.length) { res[id] = null; continue; }
          res[id] = { cols: i1 - i0 + 1, rows: j1 - j0 + 1, cells: raw.map(c => ({ i: c.i - i0, j: c.j - j0, v: c.v })) };
        } catch (e) { res[id] = null; }
      }
      return res;
    }, { batch, RENDER_W, RENDER_H, GRID_W, GRID_H });
    Object.assign(cache, out);
    process.stderr.write(`\r  ${Math.min(i + CHUNK, todo.length)}/${todo.length}`);
  }
  process.stderr.write("\n");
  await browser.close(); srv.close();
  // stable key order so the cache file itself is deterministic
  cache = Object.fromEntries(Object.keys(cache).sort().map(k => [k, cache[k]]));
  writeFileSync(CACHE_FILE, JSON.stringify(cache));
  return cache;
}

/* ============================================================
   9 · BUILD
   ============================================================ */
const sceneMeta = new Map(manifest.scenes.map(s => [s.id, s]));
const byBook = new Map();
for (const s of manifest.scenes) {
  if (!SCENES.has(s.id)) continue;
  if (!byBook.has(s.book)) byBook.set(s.book, []);
  byBook.get(s.book).push(s.id);
}
for (const v of byBook.values()) v.sort();

/* every non-rig asset actually cast anywhere in the emitted books */
const neededGrids = new Set();
for (const b of BOOKS) for (const sid of (byBook.get(b) || [])) {
  for (const c of SCENES.get(sid).cast || []) {
    const a = ASSETS.get(c.asset);
    if (a && !isRigCharacter(a) && !isField(a)) neededGrids.add(c.asset);
  }
}
const GRIDS = await buildGrids([...neededGrids].sort());

const GRID_STATS = { needed: neededGrids.size, have: 0, missing: [] };
for (const id of neededGrids) { if (GRIDS[id]) GRID_STATS.have++; else GRID_STATS.missing.push(id); }

/* ---- per scene: freeze one halfworld stage + score ----------------------- */
const SCENE_STATS = { total: 0, planned: 0, derived: 0, rowsDialogue: 0, rowsMove: 0, rowsPose: 0, timedFromAudio: 0, untimed: 0, fields: 0, gridless: 0 };

function buildScene(sid) {
  const sc = SCENES.get(sid);
  const meta = sceneMeta.get(sid) || {};
  const plan = (sc.plan && PLANS.get(sc.plan)) || sc.localPlan || null;
  const derived = !plan;
  SCENE_STATS.total++; derived ? SCENE_STATS.derived++ : SCENE_STATS.planned++;

  const cast = {}, assets = {}, instances = [], fields = [];
  const castIndex = { byAsset: new Map(), byBase: new Map(), byMember: new Map() };
  const posOf = new Map();          // instance -> {x,z}
  let nextId = 1; const nid = () => "n" + (nextId++);

  for (const c of sc.cast || []) {
    const a = ASSETS.get(c.asset);
    if (!a) continue;

    /* position: the plan station if there is one, else invert the anchor */
    let pl = null, exact = false;
    /* the cast names an instance `board_01` / `suitors_01`; INITIAL and MOVES
       name the same body `board` / `suitors`. Same actor, one authored index. */
    const bare = c.instance.replace(/_\d+$/, "");
    const station = sc.INITIAL && (sc.INITIAL[c.instance] || sc.INITIAL[bare]);
    if (plan && station && plan.stations[station]) { pl = plan.stations[station]; exact = true; }
    const p = exact ? planToWorld(pl.x, pl.z) : (() => { const iv = invertAnchor(c.anchor.x, c.anchor.y); return planToWorld(iv.x, iv.z); })();
    p.x = r2(p.x); p.z = r2(p.z);
    posOf.set(c.instance, p);

    if (isRigCharacter(a)) {
      const pose = hwPose(c.pose);
      const face = HW_POSE_FACING[pose] !== undefined ? HW_POSE_FACING[pose] : (c.band === "front" ? 0 : -0.62);
      CAST_STATS.supplied.face++;
      const entry = {
        id: c.instance, spec: specFrom(a.params), x: p.x, z: p.z,
        face, pose, decals: { head: [], torso: [] },
        x_odyssey: {
          asset: a.id, name: a.name, statusWord: a.statusWord || null,
          pose: c.pose || null, band: c.band || null,
          station: exact ? station : null, derivedFrom: exact ? null : { anchor: c.anchor, model: "blocking.project inverse" },
          hairColor: a.params.hairColor || null, cloak: !!a.params.cloak, bareLegs: !!a.params.bareLegs,
          figureScale: c.scale,
          ...(a.guises ? { guises: a.guises, guiseAt: c.state || null } : {}),
        },
      };
      cast[c.instance] = entry;
      castIndex.byMember.set(bare, c.instance);
      castIndex.byAsset.set(a.id, c.instance);
      castIndex.byBase.set(baseName(a.id), c.instance);
      if (a.continuityOf) { castIndex.byAsset.set(a.continuityOf, c.instance); castIndex.byBase.set(baseName(a.continuityOf), c.instance); }
    } else if (isField(a)) {
      fields.push({ asset: a.id, name: a.name, type: a.type, state: c.state || null, scale: c.scale, anchor: c.anchor });
      SCENE_STATS.fields++;
    } else {
      const grid = GRIDS[a.id];
      if (!grid) { SCENE_STATS.gridless++; continue; }       // never emit a gridless asset: drawAsset would crash
      const aid = "a_" + a.id.replace(/[^a-z0-9]+/gi, "_");
      if (!assets[aid]) {
        const fill = grid.cells.length / (grid.cols * grid.rows);
        assets[aid] = {
          id: aid, word: a.name.toLowerCase(), grid,
          x_odyssey: {
            asset: a.id, type: a.type, statusWord: a.statusWord || null,
            ink: { cols: grid.cols, rows: grid.rows, cells: grid.cells.length, fill: r3(fill) },
            /* a module that paints a whole-frame STUDY rather than an object on
               paper trims to a near-solid block. The scenes solve this with a
               hand-authored window per use; the contract has no window, so it is
               flagged instead of silently printed as a slab. */
            wholeFrame: fill > 0.85,
          },
        };
      }
      /* ink-fit: the authored `scale` is a fraction of the stage box; the loader
         prints cols·(W/16)·0.14·scale, so scale' = scale/(GRID_W·0.00875). cols
         cancels — the printed size follows the MEASURED art, never the box. */
      instances.push({
        id: nid(), assetId: aid, x: p.x, z: p.z,
        scale: r3((c.scale || 0.5) / (GRID_W * 0.00875)), rot: 0,
        x_odyssey: { instance: c.instance, state: c.state || null, authoredScale: c.scale, station: exact ? station : null },
      });
      castIndex.byMember.set(bare, c.instance);
      castIndex.byAsset.set(a.id, c.instance);
      castIndex.byBase.set(baseName(a.id), c.instance);
    }
  }

  /* ---------- SCORE ---------- */
  const rows = [];
  const rowId = () => "r" + (nextId++);

  /* (a) dialogue rows — true speaker, authored line, real studio timings */
  const turns = TURNS_BY_SCENE[sid] || [];
  const dsc = DRIVE_BY_SCENE[sid], vsc = voice[sid];
  const segTime = new Map();                                  // turnId -> {s,d}
  if (dsc && vsc) {
    const byGi = new Map(vsc.segments.map(g => [g.gi, g]));
    for (let gi = 0; gi < dsc.segments.length; gi++) {
      const seg = dsc.segments[gi], v = byGi.get(gi);
      if (!seg.sourceTurnId || !v) continue;
      const cur = segTime.get(seg.sourceTurnId);
      const s0 = v.start, s1 = v.start + v.dur;
      if (!cur) segTime.set(seg.sourceTurnId, { s: s0, e: s1 });
      else { cur.s = Math.min(cur.s, s0); cur.e = Math.max(cur.e, s1); }
    }
  }
  let cursor = 0;
  for (const tn of turns) {
    const ln = LINES[tn.id] || {};
    const who = resolveSpeaker(tn.sp, castIndex);
    SPK_STATS.rows++;
    if (who && cast[who]) SPK_STATS.toCast++;
    else if (who) SPK_STATS.toInstance++;
    else if (isNarrator(tn.sp)) SPK_STATS.narrator++;
    else SPK_STATS.unbound++;
    const tm = segTime.get(tn.id);
    let s, d;
    if (tm) { s = r2(tm.s); d = r2(Math.max(0.4, tm.e - tm.s)); SCENE_STATS.timedFromAudio++; }
    else { s = r2(cursor); d = 2; SCENE_STATS.untimed++; }
    cursor = Math.max(cursor, s + d);
    rows.push({
      /* c is the TRUE speaker from performance-turns.sp — never drive-script's
         speakerId, which files ~76% of segments under PERFORMER.NARRATOR. A
         narrator row keeps the channel name "NARRATOR": halfworld's SCORE has no
         bodiless voice, so the row is inert on the stage but real in the EDL. */
      id: rowId(), c: who || (isNarrator(tn.sp) ? "NARRATOR" : baseName(tn.sp)), s, d,
      t: (ln.line || "").trim(), m: "",
      x_odyssey: {
        turn: tn.id, speaker: tn.sp, speakerName: tn.spName, addressee: tn.ad,
        act: tn.act, tactic: tn.tactic || null, payload: tn.payload || null,
        direction: (ln.direction || "") || null, delivery: tn.delivery || null,
        conceal: tn.conceal || null, reveal: tn.reveal || null,
        timed: !!tm, audio: vsc ? vsc.file : null,
      },
    });
    SCENE_STATS.rowsDialogue++;
  }

  /* (b) movement rows — authored MOVES, plan stations, real t0/t1 */
  for (const mv of (sc.MOVES || [])) {
    if (!plan) continue;
    const to = plan.stations[mv.to], from = plan.stations[mv.from];
    if (!to) continue;
    const w = planToWorld(to.x, to.z);
    const d = Math.max(0.4, (mv.t1 ?? 0) - (mv.t0 ?? 0));
    rows.push({
      id: rowId(), c: castIndex.byMember.get(mv.who) || mv.who, s: r2(mv.t0 ?? 0), d: r2(d), t: "",
      m: `walk=${r2(w.x)},${r2(w.z)}`,
      x_odyssey: { move: { from: mv.from, to: mv.to }, planSpace: { x: to.x, z: to.z }, fromPlan: from ? { x: from.x, z: from.z } : null, plan: sc.plan },
    });
    SCENE_STATS.rowsMove++;
  }

  /* (c) pose rows — actor.pose ops, deduped after the vocabulary collapse */
  const last = new Map();
  for (const op of (sc.timeline || []).filter(o => o.op === "actor.pose").sort((a, b) => (a.at || 0) - (b.at || 0))) {
    const hp = hwPose(op.args && op.args.pose);
    if (last.get(op.target) === hp) continue;
    last.set(op.target, hp);
    if (!cast[op.target]) continue;                    // pose cues only bite on rig cast
    rows.push({
      id: rowId(), c: op.target, s: r2(op.at || 0), d: 1, t: "", m: `pose=${hp}`,
      x_odyssey: { pose: op.args.pose, resolved: hp },
    });
    SCENE_STATS.rowsPose++;
  }

  rows.sort((a, b) => a.s - b.s || String(a.c).localeCompare(String(b.c)) || String(a.m).localeCompare(String(b.m)));

  return {
    name: `${sid} · ${sc.title}`,
    snap: { cast, assets, instances, score: { fps: HW_FPS, rows } },
    x_odyssey: {
      id: sid, title: sc.title, book: sc.book, bookTitle: meta.bookTitle || null,
      duration: sc.duration, beats: sc.beats || meta.beats || [],
      plan: sc.plan || null, derived,
      /* the room. halfworld STAGE has nowhere to put this — see CONTRACT-NOTES. */
      field: fields,
      exitState: sc.exitState || null,
      exitOccupancy: sc._exitOccupancy || null,
      audio: vsc ? { file: vsc.file, total: vsc.total } : null,
      fx: (sc.timeline || []).filter(o => o.op === "fx.play" || o.op === "env.play")
        .map(o => ({ op: o.op, at: o.at, target: o.target, args: o.args || null })),
      sound: (sc.timeline || []).filter(o => o.op === "sound.cue").map(o => ({ at: o.at, target: o.target, args: o.args || null })),
      states: (sc.timeline || []).filter(o => /\.state$/.test(o.op)).map(o => ({ op: o.op, at: o.at, target: o.target, args: o.args || null })),
      gaze: (sc.timeline || []).filter(o => o.op === "actor.gaze").length,
      source: sc._file,
    },
    nextId,
  };
}

/* the world is text — so the document stays readable, but the INK does not get
   five lines per dot. Structure is indented; every grid.cells array is written
   on one line. Purely an encoding choice: JSON.parse sees the same object. */
function serialize(obj) {
  const stash = [];
  const swap = v => {
    if (Array.isArray(v)) return v.map(swap);
    if (v && typeof v === "object") {
      const o = {};
      for (const [k, x] of Object.entries(v)) o[k] = (k === "cells" && Array.isArray(x)) ? (stash.push(x), `@@INK${stash.length - 1}@@`) : swap(x);
      return o;
    }
    return v;
  };
  return JSON.stringify(swap(obj), null, 1)
    .replace(/"@@INK(\d+)@@"/g, (_, n) => JSON.stringify(stash[+n]));
}

/* ---- per book: one complete MEMORY -------------------------------------- */
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
const index = { schema: "halfworld/v2", corpus: "odyssey-halfworld", generator: "harness/build-halfworld-memory.mjs", grid: `${GRID_W}x${GRID_H}`, fps: HW_FPS, books: [] };
const sizes = [];

for (const book of BOOKS) {
  const ids = byBook.get(book) || [];
  if (!ids.length) continue;
  const built = ids.map(buildScene);
  const meta0 = sceneMeta.get(ids[0]) || {};
  const head = built[0];

  const P = {
    schema: "halfworld/v2",
    name: `ODYSSEY ${String(book).padStart(2, "0")} · ${(meta0.bookTitle || "").toUpperCase()}`,
    /* the project opens on the book's first scene; `scenes` holds them all —
       character ⊂ scene ⊂ world, exactly as sceneSnap()/loadScene() model it */
    cast: head.snap.cast,
    assets: head.snap.assets,
    instances: head.snap.instances,
    score: head.snap.score,
    scenes: Object.fromEntries(built.map(b => [b.name, b.snap])),
    ledger: [],
    nextId: built.reduce((m, b) => Math.max(m, b.nextId), 1),
    turn: 0,
    x_odyssey: {
      book, bookTitle: meta0.bookTitle || null,
      sceneOrder: built.map(b => b.name),
      scenes: Object.fromEntries(built.map(b => [b.name, b.x_odyssey])),
      albums: albums ? (albums.albums || albums).filter?.(a => (a.books || []).includes(book)) ?? null : null,
    },
  };
  P.ledger.push({ n: 1, src: "build", op: { op: "note", t: `odyssey book ${book} → halfworld/v2` } });
  built.forEach((b, i) => P.ledger.push({ n: i + 2, src: "build", op: { op: "scene-save", name: b.name } }));
  P.ledger.push({ n: P.ledger.length + 1, src: "build", op: { op: "note", t: `${Object.keys(P.scenes).length} scenes · ${built.reduce((m, b) => m + b.snap.score.rows.length, 0)} rows · grid ${GRID_W}x${GRID_H} · ink 0-7` } });

  const file = resolve(OUT, `odyssey.book-${String(book).padStart(2, "0")}.memory.json`);
  const text = serialize(P);
  writeFileSync(file, text);
  const bytes = Buffer.byteLength(text);
  sizes.push({ book, bytes });
  index.books.push({
    book, title: meta0.bookTitle || null,
    file: relative(ROOT, file),
    scenes: ids.length, sceneIds: ids,
    cast: Object.keys(P.cast).length,
    castTotal: built.reduce((m, b) => m + Object.keys(b.snap.cast).length, 0),
    assets: built.reduce((m, b) => m + Object.keys(b.snap.assets).length, 0),
    instances: built.reduce((m, b) => m + b.snap.instances.length, 0),
    rows: built.reduce((m, b) => m + b.snap.score.rows.length, 0),
    derivedStages: built.filter(b => b.x_odyssey.derived).length,
    bytes,
  });
}
index.totals = {
  books: index.books.length,
  scenes: index.books.reduce((m, b) => m + b.scenes, 0),
  cast: index.books.reduce((m, b) => m + b.castTotal, 0),
  stages: index.books.reduce((m, b) => m + b.scenes, 0),
  assets: index.books.reduce((m, b) => m + b.assets, 0),
  instances: index.books.reduce((m, b) => m + b.instances, 0),
  rows: index.books.reduce((m, b) => m + b.rows, 0),
  derivedStages: index.books.reduce((m, b) => m + b.derivedStages, 0),
  bytesBooks: index.books.reduce((m, b) => m + b.bytes, 0),
};
const idxText = JSON.stringify(index, null, 1);
writeFileSync(resolve(OUT, "odyssey.index.json"), idxText);
index.totals.bytesIndex = Buffer.byteLength(idxText);
index.totals.bytes = index.totals.bytesBooks + index.totals.bytesIndex;

/* ---- report ------------------------------------------------------------- */
const R = {
  out: relative(ROOT, OUT),
  totals: index.totals,
  perBook: sizes,
  scenes: SCENE_STATS,
  poses: { ...POSE_STATS, resolvedPct: +(100 * (POSE_STATS.uses - POSE_STATS.none) / POSE_STATS.uses).toFixed(1) },
  speakers: SPK_STATS,
  grids: { ...GRID_STATS, missing: GRID_STATS.missing.slice(0, 12) },
  blocking: { movesParsed: STATS.movesParsed, movesFailed: STATS.movesFailed, initialParsed: STATS.initialParsed },
  cast: CAST_STATS,
};
console.log(JSON.stringify(R, null, 1));
