/* ============================================================
   validate-halfworld-memory.mjs
   Check every emitted MEMORY against WHAT THE LOADER ACTUALLY TOUCHES.

   Not against the README — against halfworld-studio.html. Each rule below cites
   the line of the loader that would read (or crash on) the field:

     load()             /^halfworld\/v[12]$/.test(p.schema)      -> else null
     normalizeProject() Object.assign(newProject(), p)           -> needs cast{},
                        for(const i of out.instances||[])          instances[],
                        for(const r of out.score.rows||[])         score.rows[]
                        out.scenes = out.scenes||{}                (score.rows is
                                                                    NOT guarded —
                                                                    a missing
                                                                    `score` throws)
     initCharRuntime()  normalizeSpec(c.spec,c.id): spec.skin must be "#..."
                        or the entire spec is discarded for a preset
                        c.F = c.face||0        -> face must be a NUMBER
                        if(!POSES[c.pose]) c.pose='neutral'
                        c.decals = {head:[],torso:[]}
     mkMetrics(spec)    spec.h, spec.build, spec.headS as numbers -> NaN geometry
     mkCharTones(spec)  spec.shirt through mkTone()
     drawAsset()        a.grid.cols / a.grid.rows / a.grid.cells  -> UNGUARDED
                        deref: a gridless asset is a hard TypeError
     P.assets[i.assetId]                                          -> every
                        instance must resolve to an asset
     clampX/clampZ      x in [-10,10], z in [0.04,1]
     scoredState()      u=(t-r.s)/r.d  -> r.d must be > 0; r.s,r.d are SECONDS
     parseCues(m)       pose=<key of POSES> | walk=<x>,<z> | face=<FACINGS key>
                        anything else is SILENTLY DROPPED — so an unparseable
                        cue is a warning, not an error, but it is dead weight
     sceneSnap()        each scenes[name] = {cast,assets,instances,score}
     loadScene()        P.score = snap.score  -> every snapshot needs a score

   Usage: node harness/validate-halfworld-memory.mjs [halfworld]
   ============================================================ */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = resolve(ROOT, process.argv[2] || "halfworld");

/* the loader's own closed vocabularies, transcribed */
const POSES = new Set(["neutral","look left","look right","look up","look down","3/4 left","3/4 right",
  "profile left","profile right","turn back","head tilt","nod","head shake","happy","laughing","angry",
  "skeptical","surprised","sad","tired","arms crossed","shrug","one arm raised","both raised","open arms",
  "pointing","thumbs up","peace","wave","stop","thinking","hands near face","self touch","hold stick",
  "hold cup","phone call","carry box","walk"]);
const FACINGS = new Set(["left", "right", "front", "back"]);
const WORLD_X = 10;

const num = v => typeof v === "number" && Number.isFinite(v);
const hex = v => typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v);

function checkStage(where, snap, E, W) {
  const err = m => E.push(`${where}: ${m}`);
  const warn = m => W.push(`${where}: ${m}`);
  if (!snap || typeof snap !== "object") return err("snapshot is not an object");
  for (const k of ["cast", "assets", "instances", "score"])
    if (snap[k] == null) err(`missing ${k} (sceneSnap/loadScene read all four)`);
  if (typeof snap.cast !== "object" || Array.isArray(snap.cast)) err("cast must be an id->char map");
  if (typeof snap.assets !== "object" || Array.isArray(snap.assets)) err("assets must be an id->asset map");
  if (!Array.isArray(snap.instances)) err("instances must be an array");

  /* CAST */
  for (const [id, c] of Object.entries(snap.cast || {})) {
    if (c.id !== id) err(`cast.${id}.id !== key (normalizeProject sets c.id=id, but a mismatch means the score's c will not find it)`);
    const s = c.spec;
    if (!s || typeof s !== "object") { err(`cast.${id}.spec missing`); continue; }
    if (!hex(s.skin)) err(`cast.${id}.spec.skin must be "#rrggbb" — normalizeSpec discards the whole spec otherwise`);
    for (const k of ["h", "build", "headS"]) if (!num(s[k])) err(`cast.${id}.spec.${k} must be a number — mkMetrics computes geometry from it`);
    if (!hex(s.shirt)) err(`cast.${id}.spec.shirt must be a colour — mkCharTones passes it to mkTone`);
    if (!num(c.face)) err(`cast.${id}.face must be a NUMBER (facing), not an object — initCharRuntime does c.F=c.face||0`);
    if (!POSES.has(c.pose)) warn(`cast.${id}.pose "${c.pose}" is not in POSES — initCharRuntime rewrites it to 'neutral'`);
    if (!num(c.x) || c.x < -WORLD_X || c.x > WORLD_X) err(`cast.${id}.x ${c.x} outside clampX [-10,10]`);
    if (!num(c.z) || c.z < 0.04 || c.z > 1) err(`cast.${id}.z ${c.z} outside clampZ [0.04,1]`);
    if (!c.decals || !Array.isArray(c.decals.head) || !Array.isArray(c.decals.torso)) warn(`cast.${id}.decals not {head:[],torso:[]}`);
  }

  /* ASSETS — the law of the dot */
  for (const [aid, a] of Object.entries(snap.assets || {})) {
    if (a.id !== aid) err(`assets.${aid}.id !== key`);
    if (typeof a.word !== "string" || !a.word) err(`assets.${aid}.word missing (findInst/labels read it)`);
    const g = a.grid;
    if (!g) { err(`assets.${aid}.grid MISSING — drawAsset dereferences a.grid.cols unguarded: hard crash`); continue; }
    if (!num(g.cols) || g.cols < 1) err(`assets.${aid}.grid.cols invalid`);
    if (!num(g.rows) || g.rows < 1) err(`assets.${aid}.grid.rows invalid`);
    if (!Array.isArray(g.cells) || !g.cells.length) { err(`assets.${aid}.grid.cells empty`); continue; }
    for (const c of g.cells) {
      if (!num(c.i) || !num(c.j) || !num(c.v)) { err(`assets.${aid}.grid has a malformed cell`); break; }
      if (c.i < 0 || c.i >= g.cols || c.j < 0 || c.j >= g.rows) { err(`assets.${aid}.grid cell (${c.i},${c.j}) outside ${g.cols}x${g.rows}`); break; }
      if (c.v <= 0 || c.v > 1) { err(`assets.${aid}.grid cell v=${c.v} outside (0,1] — ink 0-7 normalised`); break; }
    }
  }

  /* INSTANCES */
  for (const i of snap.instances || []) {
    if (!i.id) err("an instance has no id");
    if (!snap.assets[i.assetId]) err(`instance ${i.id} points at missing asset "${i.assetId}" — drawAsset returns early and the thing is invisible`);
    if (!num(i.x) || i.x < -WORLD_X || i.x > WORLD_X) err(`instance ${i.id}.x ${i.x} outside clampX`);
    if (!num(i.z) || i.z < 0.04 || i.z > 1) err(`instance ${i.id}.z ${i.z} outside clampZ`);
    if (!num(i.scale) || i.scale <= 0) err(`instance ${i.id}.scale invalid`);
    if (i.rot == null) warn(`instance ${i.id}.rot missing (normalizeProject backfills 0)`);
  }

  /* SCORE */
  const sc = snap.score;
  if (!sc || typeof sc !== "object") return err("score missing — normalizeProject does out.score.rows with NO guard: TypeError");
  if (!num(sc.fps)) err("score.fps must be a number");
  if (!Array.isArray(sc.rows)) return err("score.rows must be an array");
  const castIds = new Set(Object.keys(snap.cast || {}));
  for (const r of sc.rows) {
    if (!r.id) warn("a score row has no id (the drawer keys edits by it)");
    if (typeof r.c !== "string" || !r.c) err("a score row has no channel c");
    if (!num(r.s) || r.s < 0) err(`row ${r.id} s=${r.s} invalid (SECONDS from 0)`);
    if (!num(r.d) || r.d <= 0) err(`row ${r.id} d=${r.d} invalid — scoredState divides by r.d`);
    if (typeof r.t !== "string") err(`row ${r.id}.t must be a string`);
    if (typeof r.m !== "string") err(`row ${r.id}.m must be a string`);
    if (!castIds.has(r.c)) warn(`row ${r.id} addresses "${r.c}", which is not a cast id — scoredState will never apply it`);
    for (const part of String(r.m || "").split(";")) {
      const k = part.slice(0, part.indexOf("=")).trim(), v = part.slice(part.indexOf("=") + 1).trim();
      if (!part.trim()) continue;
      if (part.indexOf("=") < 0) { warn(`row ${r.id} cue "${part.trim()}" has no '=' — parseCues drops it`); continue; }
      if (k === "pose") { if (!POSES.has(v)) warn(`row ${r.id} pose="${v}" not in POSES — dropped`); }
      else if (k === "walk") {
        const [x, z] = v.split(",").map(Number);
        if (!num(x) || !num(z)) warn(`row ${r.id} walk="${v}" unparseable`);
        else if (x < -WORLD_X || x > WORLD_X || z < 0.04 || z > 1) warn(`row ${r.id} walk=${v} will be clamped`);
      }
      else if (k === "face") { if (!FACINGS.has(v)) warn(`row ${r.id} face="${v}" not in FACINGS — dropped`); }
      else warn(`row ${r.id} cue key "${k}" is not pose|walk|face — parseCues drops it`);
    }
  }
}

/* ---- run ---------------------------------------------------------------- */
const files = readdirSync(DIR).filter(f => /\.memory\.json$/.test(f)).sort();
let totalE = 0, totalW = 0, failed = 0;
const rows = [];
for (const f of files) {
  const E = [], W = [];
  let P;
  try { P = JSON.parse(readFileSync(resolve(DIR, f), "utf8")); }
  catch (e) { console.log(`FAIL ${f}: unparseable — ${e.message}`); failed++; continue; }

  if (!/^halfworld\/v[12]$/.test(P.schema || "")) E.push(`schema "${P.schema}" fails load()'s /^halfworld\\/v[12]$/`);
  if (P.schema === "halfworld/v1") W.push("v1 is accepted but normalizeProject FORCES every cast.face to 0 — facings would be destroyed");
  for (const k of ["cast", "assets", "instances", "score", "scenes", "ledger"])
    if (P[k] == null) E.push(`top-level ${k} missing`);
  if (!Array.isArray(P.ledger)) E.push("ledger must be an array");
  if (!Number.isFinite(P.nextId)) E.push("nextId must be a number (nid() increments it)");
  checkStage("project", P, E, W);
  for (const [name, snap] of Object.entries(P.scenes || {})) checkStage(`scenes["${name}"]`, snap, E, W);

  totalE += E.length; totalW += W.length;
  if (E.length) failed++;
  rows.push({ file: f, scenes: Object.keys(P.scenes || {}).length, errors: E.length, warnings: W.length, E: E.slice(0, 6), W });
}

for (const r of rows) {
  console.log(`${r.errors ? "FAIL" : "ok  "} ${r.file}  scenes=${String(r.scenes).padStart(2)}  errors=${r.errors}  warnings=${r.warnings}`);
  for (const e of r.E) console.log(`       ERROR   ${e}`);
}
/* warning taxonomy — these are the honest lossy edges, not defects */
const CLASSES = [
  [/is not a cast id/, "score row addresses a non-cast channel (narrator, ensemble, off-stage speaker)"],
  [/not in POSES/, "pose outside halfworld's 38-key vocabulary"],
  [/not in FACINGS/, "face cue outside left|right|front|back"],
  [/will be clamped/, "walk target outside world bounds"],
  [/rot missing/, "instance.rot absent"],
  [/decals not/, "cast.decals shape"],
  [/parseCues drops it/, "unrecognised cue key"],
];
const tally = new Map();
for (const r of rows) for (const w of (r.W || [])) {
  const hit = CLASSES.find(([re]) => re.test(w));
  const k = hit ? hit[1] : "other";
  tally.set(k, (tally.get(k) || 0) + 1);
}
console.log("\nwarning taxonomy (lossy edges, not defects):");
for (const [k, v] of [...tally].sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
console.log(`\n${files.length} files · ${failed} failing · ${totalE} errors · ${totalW} warnings`);
process.exit(totalE ? 1 : 0);
