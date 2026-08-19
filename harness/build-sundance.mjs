#!/usr/bin/env node
/* ============================================================================
   build-sundance.mjs — THE SCORE AND THE SOUNDTRACK, FROM ONE DERIVATION.

   "SPOKEN INTO BEING" — a short film in which the Odyssey prints itself out
   of its own words. The page (odyssey-sundance.html) renders the picture; this
   script builds the sound; BOTH read film/sundance-score.json, and this script
   is the only thing that writes it. Every timing in that file is derived from
   drive/voice-manifest.json by segment lookup — nothing is hand-copied,
   because hand-copied numbers are how a mouth drifts off its voice.

   THE FILM (one visual subject and one print mode per cue; the wavefront is
   driven by the voice wherever the speaker is on screen):

     1  INVOCATION   the page becomes the council of the gods as the narrator
                     opens Book One                                    (PAGE)
     2  COUNCIL      Athena's appeal — her face written in her own line,
                     letters becoming picture at the speed of her voice(BREATH)
     3  SHROUD       Antinous tells the loom trick while the cloth weaves to
                     dots and unweaves to text — the mode IS the trick(BREATH)
     4  WINDS        the bag opens; only what escapes writes          (MOVING)
     5  CYCLOPS      Polyphemus laments; his picture exhales into the
                     prophecy's words                                 (INHALE)
     6  RAFT         Calypso names the trees; the raft holds; only the
                     sea writes                                       (MOVING)
     7  SCAR         her palm finds the seam; the trace writes itself (MOVING)
     8  DOGS         Odysseus, contempt, his own voice — the line lands
                     on his face and becomes it                          (MIX)
     9  BED          Penelope's order · the eruption · the recognition —
                     the full page emerging into the one thing that
                     cannot be moved                                    (PAGE)
    10  EXHALE       the film breathes back to prose; the title sets

     node harness/build-sundance.mjs            score + soundtrack
     node harness/build-sundance.mjs --score    score only (no ffmpeg)
   ========================================================================= */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FF = ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg"].find(existsSync) || "ffmpeg";
const FP = FF.replace(/ffmpeg$/, "ffprobe");
const SCORE_ONLY = process.argv.includes("--score");

const man = JSON.parse(readFileSync(join(ROOT, "drive/voice-manifest.json")));
const scr = Object.fromEntries(JSON.parse(readFileSync(join(ROOT, "drive/drive-script.json"))).scenes.map(s => [s.id, s]));
const lines = JSON.parse(readFileSync(join(ROOT, "viewer/spoken-lines.json"))).lines || {};
const L = (d) => (d && d.sourceTurnId && lines[d.sourceTurnId] && lines[d.sourceTurnId].line) || (d && d.text) || "";

function pick(sc, pat, kinds) {
  const s = scr[sc], m = man[sc];
  for (const kind of kinds)
    for (const v of m.segments) {
      const d = s.segments[v.gi];
      if (d.kind !== kind) continue;
      if (new RegExp(pat, "i").test(L(d))) return { v, d };
    }
  throw new Error(`no segment for ${sc} /${pat}/`);
}

/* the full text of a scene, in film order — the page's printing material */
function sceneText(sc) {
  return (scr[sc].segments || []).map(L).filter(Boolean).join(" ")
    .replace(/\s+/g, " ").trim();
}

/* ---- the cues -------------------------------------------------------------
   trim: how much of the recording to use (0 = whole). A trim always carries a
   0.9s fade, because a hard cut mid-speech is an error and sounds like one. */
const PLAN = [
  /* THE ATLAS IS THE SUBJECT. Every cue below is a real staged scene or a real
     asset module from viewer/manifest-lite.json, chosen by a density census of
     all 152 scenes and all 430 assets — the film prints in words, and a form
     that gives the printer only a few dozen inked cells gives it no sentence
     to say. The first cut of this film showed 1.2% of the atlas; this one is
     built out of it. The authored faces and artifacts stay, but as PUNCTUATION
     between real scenes rather than as the film's body. */
  { id: "cold",    dur: 6.0,  subject: { kind: "title" },                                                  mode: "page",   text: "OD-B01-S01" },

  /* I · THE COUNCIL — a real staged scene, and the poem's opening */
  { id: "invoke",  scene: "OD-B01-S01", pat: "Book one",            kinds: ["SCENE_HEADER"],
    subject: { kind: "scene", id: "OD-B01-S01" },                          mode: "page",   gapAfter: 1.6 },
  { id: "council", scene: "OD-B01-S01", pat: "Father Zeus",         kinds: ["DIALOGUE"],
    subject: { kind: "face", face: "athena", emo: "appeal" },              mode: "breath", gapAfter: 1.6 },

  /* II · TROY — the horse, from inside it. 24% ink, the densest thing in the atlas */
  { id: "horse",   scene: "OD-B04-S04", pat: "Hear the horse|horse's",  kinds: ["DIALOGUE"],
    subject: { kind: "asset", id: "ensemble.hidden-greek-warriors" },      mode: "breath", trim: 15, gapAfter: 1.4 },
  { id: "horsein", scene: "OD-B04-S04", pat: "Deiphobus|belly|hollow|called",  kinds: ["DIALOGUE","NARRATION","AUDITORY_ACTION"],
    subject: { kind: "asset", id: "location.wooden-horse-interior" },      mode: "page",   trim: 13, gapAfter: 1.6 },

  /* III · THE CAVE — the staged scene, then the blinding, then the lament */
  { id: "cave",    scene: "OD-B09-S06", pat: "flock|cave|stone|fold|milk", kinds: ["DIALOGUE","NARRATION","AUDITORY_ACTION"],
    subject: { kind: "scene", id: "OD-B09-S06" },                          mode: "moving", trim: 14, gapAfter: 1.2 },
  { id: "blind",   scene: "OD-B09-S09", pat: "What ails you",        kinds: ["DIALOGUE"],
    subject: { kind: "scene", id: "OD-B09-S09" },                          mode: "moving", trim: 17, gapAfter: 1.2 },
  { id: "cyclops", scene: "OD-B09-S11", pat: "prophecy comes home",  kinds: ["DIALOGUE"],
    subject: { kind: "face", face: "polyphemus", emo: "anguish" },         mode: "inhale", trim: 13, gapAfter: 1.6 },

  /* IV · THE SEA — Poseidon's storm as the atlas draws it */
  { id: "storm",   scene: "OD-B05-S05", pat: ".",                    kinds: ["DIALOGUE","NARRATION","AUDITORY_ACTION"],
    subject: { kind: "asset", id: "environment.four-wind-storm" },         mode: "moving", trim: 16, gapAfter: 1.2 },
  { id: "wreck",   scene: "OD-B05-S05", pat: "raft|timber|spar|swim|shore", kinds: ["NARRATION","AUDITORY_ACTION","DIALOGUE"],
    subject: { kind: "asset", id: "vehicle.destroyed-fleet" },             mode: "page",   trim: 12, gapAfter: 1.6 },

  /* V · THE DEAD — the underworld pit, and the prophecy that names the oar */
  { id: "pit",     scene: "OD-B11-S01", pat: "pit|blood|ewe|ram|trench", kinds: ["NARRATION","AUDITORY_ACTION","DIALOGUE"],
    subject: { kind: "asset", id: "location.cimmerian-shore-and-underworld-pit" }, mode: "page", trim: 14, gapAfter: 1.2 },
  { id: "tiresias",scene: "OD-B11-S03", pat: "Thrinacia|Hear me, all", kinds: ["DIALOGUE"],
    subject: { kind: "scene", id: "OD-B11-S03" },                          mode: "breath", trim: 22, gapAfter: 1.6 },

  /* VI · THE LOOM — the trick, in the trick's own material */
  { id: "shroud",  scene: "OD-B02-S02", pat: "loom|web|unravel",     kinds: ["DIALOGUE"],
    subject: { kind: "art", art: "shroud" },                               mode: "weave",  trim: 20, gapAfter: 1.6 },

  /* VII · THE HALL — the real staged slaughter, and the man who calls it */
  { id: "bow",     scene: "OD-B21-S01", pat: "bow|axe|contest|string", kinds: ["DIALOGUE","NARRATION","AUDITORY_ACTION"],
    subject: { kind: "scene", id: "OD-B21-S01" },                          mode: "moving", trim: 14, gapAfter: 1.0 },
  { id: "dogs",    scene: "OD-B22-S01", pat: "You dogs",             kinds: ["DIALOGUE"],
    subject: { kind: "face", face: "odysseus", emo: "contempt" },          mode: "mix",    gapAfter: 1.0 },
  { id: "hall",    scene: "OD-B20-S05", pat: "heads are wrapped",    kinds: ["DIALOGUE"],
    subject: { kind: "scene", id: "OD-B20-S05" },                          mode: "still",  gapAfter: 1.8 },

  /* VIII · THE BED — the recognition, and the one thing that cannot be moved */
  { id: "bed1",    scene: "OD-B23-S04", pat: "carry the great bed",  kinds: ["DIALOGUE"],
    subject: { kind: "face", face: "penelope", emo: "resolve" },           mode: "mix",    gapAfter: 0.7 },
  { id: "bedact",  scene: "OD-B23-S04", pat: "axe|built it myself|roofed|olive", kinds: ["AUDITORY_ACTION","NARRATION","DIALOGUE"],
    subject: { kind: "art", art: "bed" },                                  mode: "page",   trim: 12, gapAfter: 0.7 },
  { id: "bed2",    scene: "OD-B23-S04", pat: "Do not be angry",      kinds: ["DIALOGUE"],
    subject: { kind: "art", art: "bed" },                                  mode: "hold",   gapAfter: 1.2 },

  { id: "exhale",  dur: 20.0, subject: { kind: "title" },                                                  mode: "inhale", text: "OD-B23-S04" },
];

/* ---- absolute times -------------------------------------------------------
   Voice starts 0.7s into its cue; the picture leads slightly, which reads as
   the film breathing in before it speaks. */
const LEAD = 0.7;
let t = 0;
const cues = [];
for (const c of PLAN) {
  const cue = { id: c.id, mode: c.mode, subject: c.subject, t0: +t.toFixed(3) };
  if (c.scene) {
    const { v, d } = pick(c.scene, c.pat, c.kinds);
    const vdur = c.trim ? Math.min(c.trim, v.dur) : v.dur;
    cue.scene = c.scene;
    cue.text = L(d);
    cue.sceneText = sceneText(c.scene);
    cue.speaker = d.speakerName || d.speakerId;
    cue.voice = { file: man[c.scene].file, start: v.start, dur: +vdur.toFixed(3),
                  fade: c.trim && c.trim < v.dur ? 0.9 : 0.25, at: +(t + LEAD).toFixed(3) };
    cue.dur = +(LEAD + vdur + (c.gapAfter || 1.5)).toFixed(3);
  } else {
    cue.dur = c.dur;
    cue.sceneText = c.text ? sceneText(c.text) : "";
  }
  t += cue.dur;
  cues.push(cue);
}
const TOTAL = +t.toFixed(3);

/* THE BED IS A SIDE OF THE ALBUM, NOT ONE TRACK.
   A single 198s track under a 283s film left the last twenty-one seconds in
   absolute digital silence — the exhale played over nothing, and the length
   check passed because the file was the right length, just empty at the end.
   The album is scored to this poem beat for beat, so the bed now changes with
   the movement: each entry starts at a named CUE, not a hardcoded second, and
   runs until the next one takes over. Anchoring to cue ids means re-timing the
   cut re-times the music with it. */
/* gain is per movement, not per film: the bed sits at -26 UNDER speech, but
   the two voiceless cues — the cold open and the exhale — are the bed alone,
   and at -26 the ending measured -46 dB, which is nearly nothing. Those two
   come up. */
const BED = [
  { from: "cold",   gain: -19, file: "audio/BRONZE COUNCIL/Bronze Council, Waking Son - 01_Aegean Resolve - Treblo.ogg" },
  { from: "shroud", file: "audio/BRONZE COUNCIL/Bronze Council, Waking Son - 19_Scar, Loom, Rooted Memory - Treblo.ogg" },
  { from: "bow",    file: "audio/BRONZE COUNCIL/Bronze Council, Waking Son - 22_Arrow Law, Cleansed Hall - Treblo.ogg" },
  { from: "bed1",   file: "audio/BRONZE COUNCIL/Bronze Council, Waking Son - 23_False Wedding, Rooted Bed - Treblo.ogg" },
  { from: "exhale", gain: -17, file: "audio/BRONZE COUNCIL/Bronze Council, Waking Son - 24_Ghosts, Orchard, Peace - Treblo.ogg" },
];
const XF = 2.5;                     /* movements overlap by this much */
const beds = BED.map((b, i) => {
  const c = cues.find((x) => x.id === b.from);
  if (!c) throw new Error(`bed anchored to a cue that is not in the cut: ${b.from}`);
  const next = BED[i + 1] ? cues.find((x) => x.id === BED[i + 1].from) : null;
  const at = c.t0, end = next ? next.t0 : TOTAL;
  return { file: b.file, at: +at.toFixed(3), dur: +(end - at + (next ? XF : 0)).toFixed(3),
           fadeIn: i === 0 ? 3 : XF, fadeOut: next ? XF : 6, gainDb: b.gain ?? -26 };
});
for (const b of beds) {                       /* a movement must FIT its track */
  const d = +execFileSync(FP, ["-v", "error", "-show_entries", "format=duration",
    "-of", "default=nw=1:nk=1", join(ROOT, b.file)], { encoding: "utf8" }).trim();
  if (d < b.dur - 0.05)
    throw new Error(`bed track is shorter than its movement: ${b.file} is ${d.toFixed(1)}s, needs ${b.dur.toFixed(1)}s`);
}

const score = {
  title: "SPOKEN INTO BEING",
  subtitle: "THE ODYSSEY · PRINTED IN ITS OWN WORDS",
  total: TOTAL, lead: LEAD,
  beds,
  cues,
};
mkdirSync(join(ROOT, "film"), { recursive: true });
writeFileSync(join(ROOT, "film/sundance-score.json"), JSON.stringify(score, null, 1));
console.log(`SCORE  ${cues.length} cues · ${TOTAL.toFixed(1)}s (${Math.floor(TOTAL / 60)}m${String(Math.round(TOTAL % 60)).padStart(2, "0")}s)`);
for (const c of cues)
  console.log(`  ${c.t0.toFixed(1).padStart(6)}s  ${c.id.padEnd(8)} ${c.mode.padEnd(7)} ` +
    (c.voice ? `voice ${c.voice.dur.toFixed(1)}s [${(c.speaker || "").slice(0, 12)}]` : "(silent)"));
if (SCORE_ONLY) process.exit(0);

/* ---- the soundtrack -------------------------------------------------------
   Each slice: atrim from the scene's own recording, faded at both ends, then
   delayed to its absolute position and mixed. The bed runs underneath at
   gainDb with a long tail fade. amix normalizes by default and would duck
   everything — normalize=0 keeps the levels authored. */
const inputs = [], chains = [], mixIn = [];
let idx = 0;
for (const c of cues) {
  if (!c.voice) continue;
  inputs.push("-i", join(ROOT, c.voice.file));
  const inFade = 0.06, outFade = c.voice.fade;
  chains.push(`[${idx}:a]atrim=${c.voice.start}:${c.voice.start + c.voice.dur},asetpts=PTS-STARTPTS,` +
    `afade=t=in:d=${inFade},afade=t=out:st=${(c.voice.dur - outFade).toFixed(3)}:d=${outFade},` +
    `aresample=44100,adelay=${Math.round(c.voice.at * 1000)}|${Math.round(c.voice.at * 1000)}[v${idx}]`);
  mixIn.push(`[v${idx}]`);
  idx++;
}
/* one input per movement of the bed, each trimmed from its own head, faded,
   and delayed to the cue it belongs to. Neighbours overlap by XF so a movement
   hands over instead of stopping. */
for (let b = 0; b < score.beds.length; b++) {
  const bd = score.beds[b];
  inputs.push("-i", join(ROOT, bd.file));
  chains.push(`[${idx}:a]atrim=0:${bd.dur},asetpts=PTS-STARTPTS,volume=${bd.gainDb}dB,` +
    `afade=t=in:d=${bd.fadeIn},afade=t=out:st=${(bd.dur - bd.fadeOut).toFixed(2)}:d=${bd.fadeOut},` +
    `aresample=44100,adelay=${Math.round(bd.at * 1000)}|${Math.round(bd.at * 1000)}[b${b}]`);
  mixIn.push(`[b${b}]`);
  idx++;
}
/* duration=FIRST cut the mix at the first input's length — the invocation
   slice, ~18 seconds — and apad then filled the other three minutes with
   silence. The length check passed (it only measures duration) and every
   loudness probe happened to land after the cut. duration=longest keeps every
   delayed slice; apad still squares off the tail. */
chains.push(`${mixIn.join("")}amix=inputs=${mixIn.length}:normalize=0:duration=longest,` +
  `apad=whole_dur=${TOTAL},atrim=0:${TOTAL},alimiter=limit=0.97[a]`);

const AOUT = join(ROOT, "film/sundance-audio.m4a");
console.log(`\nAUDIO  mixing ${idx - score.beds.length} voice slices + ${score.beds.length} bed movements …`);
const r = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", ...inputs,
  "-filter_complex", chains.join(";"), "-map", "[a]",
  "-c:a", "aac", "-b:a", "192k", "-ar", "44100", AOUT]);
if (r.status !== 0) { console.error("** audio build failed **\n" + String(r.stderr).slice(-800)); process.exit(1); }

const got = +execFileSync(FP, ["-v", "error", "-show_entries", "format=duration",
  "-of", "default=nw=1:nk=1", AOUT], { encoding: "utf8" }).trim();
console.log(`  film/sundance-audio.m4a · ${got.toFixed(2)}s (score ${TOTAL.toFixed(2)}s · off by ${(got - TOTAL).toFixed(3)}s)`);
if (Math.abs(got - TOTAL) > 0.15) { console.error("** soundtrack does not match the score — refusing **"); process.exit(1); }
console.log("  OK");
