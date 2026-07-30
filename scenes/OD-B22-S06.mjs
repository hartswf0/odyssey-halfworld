/* ============================================================
   SCENE  OD-B22-S06 — The Hall Is Cleared   (Od. 22.297–380)
   Book XXII, scene 6. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its predecessor,
   scenes/OD-B22-S05.mjs, whose room, figure law, hoist law and near-floor
   register are inherited here verbatim.

   Beats (causal order, one master clock):
     1. The four come off the sill and drive what is left of them down the hall
        like falcons among smaller birds.
     2. Leiodes breaks out of the rout, takes the king by the knees and pleads
        that he only ever read the entrails; he is killed anyway.
     3. Phemius the bard and Medon the herald ask for their lives, and
        Telemachus speaks for the herald: these two are not of the company.
     4. The bard and the herald are spared and sent out to the courtyard.
     5. The living work the floor of the blood-filled hall for anything still
        breathing.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. THE ROOM ADVANCES, AND THIS IS THE SCENE S05 DEFERRED IT TO.
      The atlas asks for `location.aftermath-hall`. There is no such room:
      that is location.megaron-hall in state `aftermath`, cast at S01–S05's
      anchor (.50,.99) and scale 1.0 so the hall registers to the pixel on all
      six shots. S05's note A held the state at `contest` because `battle`'s
      lift:1 printed the room as a grey mass with nothing to justify it, and
      handed the advance on to "S06, where the room is cleared and the state
      change has litter and wreck to justify it". So it lands here: doors
      barred, fire dead and scattered, sky hazed, and `litter:"blood"` — six
      pools keyed on `corner_dead` and the near stations, spent arrows in the
      floor and three more standing in the left pillar. THE COMPENSATION FOR
      lift:1 IS THE LAYER LIST AND THE POPULATION: the layer list is S01–S05's,
      plus `litter`, minus `stair` (`furniture` and `throne` stay dropped for
      the reasons S01 gives), and the ten bodies of S05 are down to five, so the
      upper third, the near-left corner and the whole right-hand floor stay
      paper. `stair` goes for a blocking reason, not a tonal one: the flight up
      to Penelope's chamber has its foot at x 937, and the diviner goes down
      on `bench_r2`, x 888, so seven lifted treads and a dark upper door print
      straight through the body this whole scene turns on. The stair comes
      back in S08, where the hall is empty of them and Eurycleia climbs it. A hall one level darker with half the ink standing in it is
      lighter than S05's frame, not heavier.

   B. NO HAND-PLACED ANCHORS, AND THE MOVES ARE THE PURSUIT. Every body — and
      the ENSEMBLE's whole line — resolves through scenes/_plans/megaron.mjs by
      station NAME; there is not one hand anchor on a figure in this file. The
      four defenders leave the sill and the store door and come out onto the
      floor between DRIVE and DRIVE+12, which is beat 1; the herald crosses to
      the great doors at SPARED, which is beat 4.

   C. THE THREE MEN ARE ONE INSTANCE, AND THE PLAN DRIVES ITS LINE.
      ensemble.telemachus-eumaeus-and-philoetius is authored for exactly this
      shot ("coordinated finishers checking flanks and survivors", scene
      OD-B22-S06 on the module itself), and it is the only drawing of those
      three men in this scene — casting the three CHARACTER rigs as well would
      print each of them twice. The box is not placed, it is SOLVED, every
      frame, off the centre man's own blocked station:
        · FOOTLINE  = blk.telemachus.y            (the plan's floor)
        · HEIGHT    = the same figure law every rig body in this file uses,
                      FIG_INK·K·scale·H, divided by the member's own ink
                      fraction — so a man in the ensemble is exactly as tall as
                      a man in the room would be standing on that mark
        · WIDTH     = height × the stage's own aspect, so the roster keeps the
                      proportion it was authored at and the men stand about one
                      body-height apart instead of inside each other
        · CENTRE X  = blk.telemachus.x
      The wings are then the asset's own roster offsets (±0.278·CW) about that
      centre: the ENSEMBLE owns its formation, the PLAN owns its ground. The
      occupancy still records which ground each of the three is working —
      `table_l` for the centre man, `bench_l2` and `axe_last` for the wings —
      so S07 receives three separate men and not a box.
      `showShell`, `debris`, `foreground` and `background` are ALL OFF: the
      shell is a second megaron (its own floor plane, dado, columns, architrave
      and two flank doorways would print over this room's), the foreground crop
      is a fourth overturned table across the bottom edge, the debris field is a
      second litter over `litter:"blood"`, and `background:0` is the asset's own
      documented way of leaving exactly the three named men. What is left on
      that canvas is three armed bodies and nothing else, which is what a scene
      wants from an ensemble standing in an authored room.

   D. NOBODY STANDS ON A FIXTURE. The spine carries the twelve axe helves from
      `axe_first` to `axe_last` and the hearth ring runs y 504..597, so the
      centre of the floor is not standing ground in this room. The line is
      therefore centred on `table_l` and the king is over on `table_r`; the
      only figure on the spine is the bard at the great doors, where the floor
      is the sill lane and nothing is set into it.

   E. THE CONTACT PAIR IS A REAL PAIR OF STATIONS, AND THE SUPPLIANT IS THE
      NEARER BODY. Leiodes takes the king by the knees, so the two of them must
      not resolve to one mark:
        · leiodes   `bench_r2`  (888, 640) — nearest camera, biggest, LOWEST
        · odysseus  `table_r`   (800, 618) — a step deeper and to his left
      88px of x and 22px of y apart at two different depths. Draft 2 had these
      two the other way round, with the diviner deeper than the king, and the
      depth law then drew him SMALLER and HIGHER — his head came out 14px under
      Odysseus' own and he read as a second man standing beside him, not as a
      man on the floor at his knees. Reversed, the suppliant is 22px lower, one
      depth band bigger, and drawn IN FRONT of the king's legs, which is what
      taking a man by the knees looks like from the front. Odysseus is NOT
      mirrored: the rig's directive poses are authored to screen LEFT and the
      hall, the sweep line, the bard and the great doors he sends them out of
      are all to his left from x 800; the one thing on his right is the man at
      his knees, and looking down at him is a gaze, not an arm.

   F. WHO IS DROPPED, AND WHY. S05 hands over eleven keys. Five bodies are
      drawn here and the rest are dropped from the PICTURE while keeping their
      keys and stations in the occupancy, so S07 (the maids carry the bodies
      out) receives the room exactly as S05 left it:
        · `suitors` — ensemble.suitor-terror-wave held the near-left corner in
          a 415×380 box. A second crowd box cannot share the near band with a
          950px sweep line without the finishers standing inside the mass, and
          the atlas casts no crowd in S06. Beat 1 is the pursuit that finishes
          them; what the pursuit LEAVES is what the room now prints there —
          `litter:"blood"`, whose largest pool is keyed on `corner_dead`.
        · `eurymachus`, `amphinomus`, `antinous` — their three stations
          (`pillar_l`, `pillar_r`, `bench_r1`) are the ground the sweep line
          and the king now stand on, and four corpse rigs on the working
          footline is the collision this convention exists to prevent.
        · `athena` — she went up to the roof beam in S05 and never came back
          down. The plan authors no roof station, so her key would have to be
          parked on the floor station she rose from and pretend to be a body in
          a scene that is nothing but bodies. She is not in this room in any
          sense the floor can record, and she is dropped.
      One station carries two keys for the first six seconds: the herald comes
      out from under the chair at the side door, `postern`, which is where S05
      left Philoetius. Nothing is ever drawn on that mark twice — the ENSEMBLE
      draws Philoetius on its own line from the first frame (note C) and his
      plan key is bookkeeping until DRIVE takes it off the door.
      NOTHING that is dropped is dropped from the OCCUPANCY except Athena;
      everything else is bookkept and handed on.

   G. TONE. Five rig figures with ZERO ctx overpaint — no pixel of any body is
      drawn by this file — plus one ensemble box whose heaviest marks are
      beards, crests, spearheads and shield bosses and whose big shapes (four
      pale shields, four pale corslets, eight pale greaves) are LIGHT planes
      inside hard contours. No detail window, no register strip, no overlay of
      any kind: S03–S05 carried the armour register along the bottom band
      because there was gear still to issue, and there is not. The bottom band
      is floor.

   CONTINUITY IN — INHERITED, NOT ASSERTED.
      import { exitOccupancy as INITIAL } from "./OD-B22-S05.mjs";
   S05 ends in THIS room and every station it hands over is a megaron station,
   so no translation table is needed. Three keys are added — `leiodes`, who
   breaks out of the rout at `table_r`; `phemius` at the great doors; `medon`
   at the side door — and one, `athena`, is dropped (note F).

   Verify (the plea at the knees, and the floor being worked):
     node harness/render-scene.mjs scenes/OD-B22-S06.mjs --t 26
     node harness/render-scene.mjs scenes/OD-B22-S06.mjs --t 72
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01 }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import finishers   from "../assets/ensemble/telemachus-eumaeus-and-philoetius.mjs";
import leiodes     from "../assets/character/leiodes.mjs";
import phemius     from "../assets/character/phemius.mjs";
import medon       from "../assets/character/medon.mjs";
import melanthius  from "../assets/character/melanthius-b22.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 78;

/* the same room S01–S05 leave behind, layer for layer, plus `litter` (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","pillars","lane","hearth","axes","litter"];

/* ---- THE CLOCK ---------------------------------------------------------- */
const DRIVE   = 6;    // the four come off the sill and the store door
const KNEES   = 20;   // Leiodes has the king by the knees
const REFUSE  = 28;   // "you prayed often enough that I should not come home"
const KILLED  = 34;   // the stroke
const APPEAL  = 42;   // the bard and the herald ask for their lives
const CONFIRM = 50;   // Telemachus speaks for the herald
const SPARED  = 58;   // out into the courtyard with you
const GONE    = 66;   // they are through the doors
const SEARCH  = 68;   // the floor is worked for anything still breathing

const ramp = (t, a, b) => clamp01((t - a) / Math.max(1e-6, b - a));

/* ---- CONTINUITY IN (note "CONTINUITY IN", note F) ----------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B22-S05.mjs";
const ENTERING = { leiodes:"bench_r2", phemius:"door_main", medon:"postern" };
const INITIAL = (() => {
  const o = { ...PREV_EXIT, ...ENTERING };
  delete o.athena;                     // aloft on the roof beam since S05 (note F)
  return o;
})();

/* ---- BLOCKING. Stations, not coordinates. ------------------------------- */
const MOVES = [
  // beat 1 — the four come out onto the floor and drive them down the hall
  { who:"odysseus",   from:"threshold", to:"table_r",  t0:DRIVE,  t1:DRIVE+12 },
  { who:"telemachus", from:"axe_last",  to:"table_l",  t0:DRIVE,  t1:DRIVE+12 },
  { who:"eumaeus",    from:"table_l",   to:"bench_l2", t0:DRIVE,  t1:DRIVE+12 },
  { who:"philoetius", from:"postern",   to:"axe_last", t0:DRIVE,  t1:DRIVE+12 },
  // beat 4 — the herald crosses to the doors and goes out
  { who:"medon",      from:"postern",   to:"threshold", t0:SPARED, t1:GONE-2 },
];

/* one figure scale for the whole cast; the plan's depth law does the rest.
   K, FIG_INK and FIG_INK_W are S01–S05's, unchanged. */
const K = 0.42;
const FIG_INK = 0.752;

/* placeFigure — verbatim in intent from S01–S05: the lift puts FEET on the
   mark. Every figure in this scene is pure rig with no ctx-drawn cloth. */
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  placeInstance(offctx, W, H, mod, {
    anchor:{ x:anchor.x, y:anchor.y + 0.10 * scale }, scale, state,
  });
}

/* ---- THE ROOM'S OWN CEILING LAW, and the hanging man (S05 note H) -------- */
const ceilAt = z => 0.50 - (0.30 + 0.26 * Math.pow(z, 1.08));
const HOIST_TOP = 0.111, CROWN_CLEAR = 0.018;
function hoistExtra(H, p){
  const boxH   = H * K * p.scale;
  const boxTop = (p.y + 0.10 * K * p.scale) * H - boxH;
  return Math.max(0, boxTop + HOIST_TOP * boxH - (ceilAt(p.d) + CROWN_CLEAR) * H);
}

/* ---- THE SWEEP LINE, solved off the plan every frame (note C) ------------
   MEMBER_INK: the front-band member's surviving ink height as a fraction of the
   box, read off the asset's own numbers — s = 0.420·CH·1.05 for the centre man,
   shoulders at 0.720·s under the footline and the crest teeth another 0.1505·s
   above that, so 0.8705 × 0.441 = 0.384. MEMBER_FOOT is the asset's own
   footline plus the formation's `push` on the centre man. */
const MEMBER_INK  = 0.384;
const MEMBER_FOOT = 0.915;
/* WIDTH = height × 1.15, and NOT the stage's own 1.474: the roster throws the
   wing men ±0.278·CW off the centre, so at the stage aspect the line is 526px
   wide, which with the centre man on `table_l` puts Eumaeus half outside the
   left margin and stands Philoetius on the spine among the axe helves. 1.15 is
   the widest box whose left man clears the frame edge — 205px of pitch against
   a 148px member, so the three still stand clear of each other even when
   `converge` pulls the roster in to 0.82 of its spread. */
const LINE_AR = 1.15;
const PUSH = { "cordon":0, "sweep-line":0.010, "flank-split":0, "wedge":0.045,
               "converge":0.030, "check-bodies":0.015, "stand-down":0 };
function lineBox(W, H, p, formation){
  const ch = FIG_INK * K * p.scale * H / MEMBER_INK;
  const cw = ch * LINE_AR;
  return {
    cw, ch,
    x: p.x * W - cw / 2,
    y: p.y * H - (MEMBER_FOOT + (PUSH[formation] ?? 0)) * ch,
  };
}
function placeLine(offctx, W, H, p, state){
  const b = lineBox(W, H, p, state.formation);
  const sig = `fin|${state.formation}|${Math.round((state.sweep ?? 0) * 24)}`
            + `|${Math.round((state.attention ?? 0) * 20)}`
            + `|${Math.round((state.resolve ?? 0) * 20)}`
            + `|${Math.round((state.wave ?? 2) * 20)}|${Math.round(b.cw)}`;
  offctx.drawImage(
    keyedModuleCanvas(finishers, Math.round(b.cw), Math.round(b.ch), state, sig),
    b.x, b.y);
  return b;
}
/* the drill on the clock. The sweep channel walks guard -> scan -> probe ->
   check; the formation says who is looking where. Nothing here is a branch in
   the body — one number renders it (the asset's own contract). */
function lineAt(t){
  const closing = ramp(t, DRIVE, KNEES);
  const working = ramp(t, SEARCH, D - 4);
  return {
    formation: t < DRIVE   ? "cordon"
             : t < KNEES   ? "wedge"
             : t < APPEAL  ? "converge"
             : t < SEARCH  ? "flank-split"
             :               "check-bodies",
    /* the ladder is held in its UPRIGHT half until the floor is actually being
       worked. Draft 1 ran it to 0.56 by KNEES and the three men, at 246px of
       ink each, printed as three crouched pale masses that read as more
       overturned furniture; a man checking a body is only legible as a man if
       the frame has first seen him standing. */
    sweep:  t < DRIVE  ? 0.08
          : t < KNEES  ? 0.10 + 0.20 * closing
          : t < SEARCH ? 0.34
          :              0.40 + 0.24 * working,
    stagger:0.26, span:0.55, density:1.0,
    attention: t < KNEES   ? 0.55
             : t < CONFIRM ? 0.92
             : t < SEARCH  ? 0.34
             :               0.24,
    resolve: t < KNEES ? 0.72 : t < SEARCH ? 0.88 : 1.0,
    wave: t >= CONFIRM && t < CONFIRM + 6 ? ramp(t, CONFIRM, CONFIRM + 6) : 1.4,
    waveSpread:0.22,
    /* the shell, the debris field, the near crop and the posted pair are all
       OFF: this room is already built and this scene supplies its own dead. */
    showShell:false, foreground:0, background:0, debris:0,
    status: t < DRIVE   ? "THE SILL IS HELD"
          : t < KNEES   ? "LIKE FALCONS AMONG SMALLER BIRDS"
          : t < APPEAL  ? "CLOSING ON HIM"
          : t < SEARCH  ? "THE FLANKS"
          :               "CHECKING THE FLOOR",
  };
}

export const scene = {
  id:"OD-B22-S06",
  title:"The Hall Is Cleared",
  book:22,
  plan:"megaron",
  duration:D,
  beats:[
    "Odysseus and the three with him come off the sill and drive what is left of the suitors down the hall like falcons among smaller birds.",
    "Leiodes breaks out of the rout, takes the king by the knees and pleads that he only ever read the entrails and never laid a hand on a woman of the house.",
    "The king refuses the plea — the diviner prayed often enough that he should not come home — and kills him where he kneels.",
    "Phemius the bard and Medon the herald ask for their lives, and Telemachus speaks for the herald: these two are not of the company.",
    "The bard and the herald are spared and sent out through the great doors to the courtyard.",
    "The living work the floor of the blood-filled hall for anything still breathing.",
  ],
  exitState:
    "The megaron, NOW IN ITS `aftermath` STATE — great doors still barred, the " +
    "hearth dead and its embers scattered, the clerestory hazed, the twelve axe " +
    "helves still standing down the spine, the wall pegs still bare, and the " +
    "floor carrying what the killing left: six blood pools keyed on " +
    "`corner_dead` and the near stations, spent arrows in the boards and three " +
    "more standing in the left roof-pillar. This is the state S05 deferred " +
    "here, and it does not advance again until the hall is washed in S08. " +
    "THE HALL IS CLEARED: the last of the suitors are down, and the mass that " +
    "held `corner_dead` from S02 to S05 is a heap of bodies on the ground it " +
    "was driven into — its key and its station are handed on unchanged for the " +
    "maids to carry out in S07, as are the three named dead (Eurymachus at " +
    "`pillar_r`, Amphinomus at `pillar_l`, Antinous across his own board at " +
    "`bench_r1`) and the defenders' panoplies (`arms`) at `axe_first`. " +
    "LEIODES IS DEAD at `bench_r2`, on his face where he knelt: he begged at the " +
    "king's knees, was refused, and went down with his head still speaking. " +
    "THE BARD AND THE HERALD ARE ALIVE AND OUT OF THE ROOM: Phemius went " +
    "through the great doors (`door_main`) with the lyre still in his hands, " +
    "Medon crossed from the side door and followed him over the sill " +
    "(`threshold`); both are in the courtyard by the altar of Zeus and neither " +
    "is a body on this floor any longer. " +
    "THE FOUR ARE ON THEIR FEET AND WORKING THE ROOM: Odysseus over the body " +
    "at `table_r`, as himself, guise `restored`; the sweep line out " +
    "across the near floor with Telemachus at its centre on `table_l`, Eumaeus " +
    "on `bench_l2` and Philoetius at the last axe helve (`axe_last`), spears " +
    "levelled and heads down over the boards. MELANTHIUS STILL HANGS in the " +
    "arms-store (`storeroom`), bound 1 hoist 1, crown close under the roof " +
    "beams, alive — S07 takes him down. Athena is not on this floor: she has " +
    "been on the roof beam since S05 and her key is not carried forward.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"aftermath" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.71,y:.81}, scale:.43, band:"threeq", pose:"confrontation" },
    { asset:"ensemble.telemachus-eumaeus-and-philoetius", instance:"finishers",
      anchor:{x:.28,y:.81}, scale:.84, state:"cordon" },
    { asset:"character.leiodes", instance:"leiodes",
      anchor:{x:.79,y:.84}, scale:.44, band:"threeq", pose:"leiodes_reluctant" },
    { asset:"character.phemius", instance:"phemius",
      anchor:{x:.50,y:.54}, scale:.29, band:"threeq", pose:"head_lowered" },
    { asset:"character.medon", instance:"medon",
      anchor:{x:.25,y:.60}, scale:.33, band:"threeq", pose:"guarded_withdrawal" },
    { asset:"character.melanthius-b22", instance:"melanthius",
      anchor:{x:.22,y:.63}, scale:.34, band:"threeq", pose:"m22_hoist" },
  ],

  timeline:[
    // opening frame = S05's closing frame
    { op:"actor.pose",  target:"odysseus",   at:0.0,      args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",   at:0.0,      args:{ gaze:{ x:-.44, y:.10 } } },
    { op:"actor.pose",  target:"leiodes",    at:0.0,      args:{ pose:"leiodes_reluctant" } },
    { op:"actor.pose",  target:"phemius",    at:0.0,      args:{ pose:"head_lowered" } },
    { op:"actor.pose",  target:"medon",      at:0.0,      args:{ pose:"guarded_withdrawal" } },
    { op:"actor.pose",  target:"melanthius", at:0.0,      args:{ pose:"m22_hoist" } },
    { op:"crowd.state", target:"finishers",  at:0.0,      args:{ formation:"cordon" } },
    // 1. off the sill, and down the hall
    { op:"actor.pose",  target:"odysseus",   at:DRIVE,    args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:DRIVE,    args:{ gaze:{ x:-.52, y:.14 } } },
    { op:"crowd.state", target:"finishers",  at:DRIVE,    args:{ formation:"wedge" } },
    { op:"sound.cue",   target:"finishers",  at:DRIVE,    args:{ src:"threshold", cue:"the hall going over like a field of small birds" } },
    // 2. the diviner at the knees
    { op:"actor.pose",  target:"leiodes",    at:KNEES,    args:{ pose:"leiodes_supplicate" } },
    { op:"actor.gaze",  target:"leiodes",    at:KNEES,    args:{ gaze:{ x:-.32, y:-.46 } } },
    { op:"actor.pose",  target:"odysseus",   at:KNEES,    args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:KNEES,    args:{ gaze:{ x:.30, y:.46 } } },
    { op:"crowd.state", target:"finishers",  at:KNEES,    args:{ formation:"converge" } },
    { op:"sound.cue",   target:"leiodes",    at:KNEES,    args:{ src:"bench_r2", cue:"I only ever read the burnt offerings" } },
    // 3. the refusal and the stroke
    { op:"actor.pose",  target:"odysseus",   at:REFUSE,   args:{ pose:"confrontation" } },
    { op:"sound.cue",   target:"odysseus",   at:REFUSE,   args:{ src:"table_r", cue:"you prayed often enough that I should not come home" } },
    { op:"actor.pose",  target:"odysseus",   at:KILLED,   args:{ pose:"one_arm_raised" } },
    { op:"actor.pose",  target:"leiodes",    at:KILLED,   args:{ pose:"crouch" } },
    { op:"actor.gaze",  target:"leiodes",    at:KILLED,   args:{ gaze:{ x:-.04, y:.54 } } },
    { op:"actor.pose",  target:"odysseus",   at:KILLED+5, args:{ pose:"torso_open" } },
    // 4. the bard and the herald
    { op:"actor.pose",  target:"phemius",    at:APPEAL,   args:{ pose:"protective_block" } },
    { op:"actor.gaze",  target:"phemius",    at:APPEAL,   args:{ gaze:{ x:.34, y:-.10 } } },
    { op:"actor.pose",  target:"medon",      at:APPEAL,   args:{ pose:"urgent_warning" } },
    { op:"actor.gaze",  target:"medon",      at:APPEAL,   args:{ gaze:{ x:.36, y:-.06 } } },
    { op:"actor.pose",  target:"odysseus",   at:APPEAL,   args:{ pose:"listening" } },
    { op:"actor.gaze",  target:"odysseus",   at:APPEAL,   args:{ gaze:{ x:-.40, y:-.04 } } },
    { op:"sound.cue",   target:"phemius",    at:APPEAL,   args:{ src:"door_main", cue:"no man taught me; a god put the song in me" } },
    { op:"crowd.state", target:"finishers",  at:CONFIRM,  args:{ formation:"converge", note:"Telemachus speaks for the herald" } },
    { op:"sound.cue",   target:"finishers",  at:CONFIRM,  args:{ src:"table_l", cue:"hold — Medon looked after me in this house" } },
    // 5. spared, and out
    { op:"actor.pose",  target:"odysseus",   at:SPARED,   args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:SPARED,   args:{ gaze:{ x:-.56, y:-.10 } } },
    { op:"actor.pose",  target:"phemius",    at:SPARED,   args:{ pose:"walk_neutral" } },
    { op:"actor.pose",  target:"medon",      at:SPARED,   args:{ pose:"walk_neutral" } },
    { op:"crowd.state", target:"finishers",  at:SPARED,   args:{ formation:"flank-split" } },
    { op:"actor.exit",  target:"phemius",    at:GONE,     args:{ via:"door_main", note:"out to the altar of Zeus in the yard" } },
    { op:"actor.exit",  target:"medon",      at:GONE,     args:{ via:"threshold", note:"over the sill after the bard" } },
    // 6. the floor
    { op:"crowd.state", target:"finishers",  at:SEARCH,   args:{ formation:"check-bodies" } },
    { op:"actor.pose",  target:"odysseus",   at:SEARCH,   args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:SEARCH,   args:{ gaze:{ x:-.34, y:.40 } } },
    { op:"timeline.capture", target:"OD-B22-S06", at:76.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);   // deterministic idle phase
    const prog   = clamp01(0.12 + 0.84 * (t / D));

    /* --- 1. THE HALL, now in `aftermath`. It paints the room (note A). ---- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"aftermath", t:breath, layers:HALL_LAYERS,
        status: t < KNEES   ? "DRIVEN DOWN THE HALL"
              : t < KILLED  ? "A MAN AT THE KNEES"
              : t < APPEAL  ? "NO QUARTER"
              : t < SPARED  ? "TWO OF THEM ASKING"
              : t < SEARCH  ? "OUT INTO THE YARD"
              :               "NOTHING LEFT STANDING",
        progress: prog,
      },
    });

    /* --- 2. EVERY BODY, ordered back to front by its own resolved depth --- */
    const draw = [];

    /* MELANTHIUS — hanging where S04 and S05 left him, on the same computed
       lift, sorting behind the store door (S05 note H). */
    {
      const p = blk.melanthius;
      const lift = hoistExtra(H, p);
      draw.push({ d:p.d - 0.12, run(){
        placeFigure(offctx, W, H, melanthius, {
          anchor:{ x:p.x, y:p.y - lift / H }, scale: K * p.scale,
          state:{
            t:breath, band:"threeq", pose:"m22_hoist",
            gaze:{ x:-.18, y:.44 },
            bound:1, hoist:1, suspension:"cord",
            status:"STILL HANGING", progress:prog,
          },
        });
      }});
    }

    /* PHEMIUS — the bard at the great doors, the lyre never out of his hands.
       Gone from the floor at GONE: he is in the yard (note F). */
    if (t < GONE){
      const p = blk.phemius, s = st.phemius || {};
      const asking = t >= APPEAL && t < SPARED;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, phemius, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t:breath, band:"threeq", lyre:true,
            pose: s.pose || "head_lowered",
            gaze: s.gaze || { x:.10, y:.40 },
            browUp:   asking ? .64 : .34,
            browKnit: asking ? .40 : .34,
            eyeWide:  asking ? .52 : .12,
            jaw:      asking ? .34 : 0,
            frown:    asking ? .20 : .30,
            status: t < APPEAL ? "AT THE DOORS"
                  : asking     ? "A GOD PUT THE SONG IN ME"
                  :              "GOING OUT",
            progress: prog,
          },
        });
      }});
    }

    /* MEDON — the herald out from under the chair at the side door, then
       across to the sill and out after the bard. */
    if (t < GONE){
      const p = blk.medon, s = st.medon || {};
      const asking = t >= APPEAL && t < SPARED;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, medon, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            /* mirrored: the rig's appealing arm is authored to screen LEFT and
               the man he is appealing to is at x 888, across the hall */
            t:breath, band:"threeq", mirror:true,
            pose: s.pose || "guarded_withdrawal",
            gaze: s.gaze || { x:.44, y:.06 },
            browUp:   asking ? .72 : .46,
            browKnit: asking ? .34 : .28,
            eyeWide:  asking ? .58 : .40,
            jaw:      asking ? .36 : .06,
            frown:    .18,
            status: t < APPEAL ? "UNDER THE CHAIR"
                  : asking     ? "SPEAK FOR ME, BOY"
                  :              "OVER THE SILL",
            progress: prog,
          },
        });
      }});
    }

    /* THE SWEEP LINE — one instance, three men, box solved off the centre
       man's blocked station every frame (note C). */
    {
      const p = blk.telemachus;
      const ls = lineAt(t);
      /* the heads pull onto whatever the line is being told to look at: the
         king while the diviner is at his knees, the floor afterwards. */
      const b0 = lineBox(W, H, p, ls.formation);
      const o  = blk.odysseus;
      const focus = t < APPEAL
        ? { x:(o.x * W - b0.x) / b0.cw, y:(o.y * H - b0.y) / b0.ch }
        : { x:0.50, y:0.78 };
      draw.push({ d:p.d, run(){
        placeLine(offctx, W, H, p, { ...ls, focus, t:Math.min(.98, t / D),
                                     progress:prog });
      }});
    }

    /* LEIODES — the diviner: out of the rout, at the knees, refused, killed,
       and then the body on the floor the sweep steps over. */
    {
      const p = blk.leiodes, s = st.leiodes || {};
      const pleading = t >= KNEES && t < KILLED;
      const dead     = t >= KILLED;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, leiodes, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            /* not mirrored: he is on the king's right hand at x 888 and
               everything he does — the reach, the head, the eyes — goes
               screen LEFT, which is where the knees are */
            t:breath, band:"threeq",
            pose: s.pose || "leiodes_reluctant",
            gaze: s.gaze || { x:-.36, y:.24 },
            blink:    dead ? 1 : 0,
            browUp:   dead ? .12 : pleading ? .88 : .46,
            browKnit: dead ? .34 : pleading ? .30 : .40,
            eyeWide:  dead ? 0 : pleading ? .66 : .22,
            eyeNarrow:0,
            jaw:      dead ? .44 : pleading ? .34 : .06,
            frown:    dead ? .50 : .34,
            status: dead     ? "HIS HEAD STILL SPEAKING"
                  : pleading ? "I NEVER TOUCHED A WOMAN OF THIS HOUSE"
                  :            "OUT OF THE ROUT",
            progress: prog,
          },
        });
      }});
    }

    /* ODYSSEUS — nearest the camera on the near-right bench ground, and he
       never turns his back on the room. One guise, no mirror (note E). */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const judging  = t >= KNEES && t < KILLED;
      const striking = t >= KILLED && t < KILLED + 5;
      const hearing  = t >= APPEAL && t < SPARED;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t:breath, guise:"restored", band:"threeq",
            pose: s.pose || "confrontation",
            gaze: s.gaze || { x:-.44, y:.10 },
            browUp:   hearing ? .34 : .14,
            browKnit: striking ? .62 : judging ? .56 : .44,
            eyeNarrow:striking ? .52 : .36,
            eyeWide:  0,
            jaw:      striking ? .42 : judging ? .30 : .14,
            mouthAsym:.22,
            frown:    judging ? .34 : striking ? .30 : .10,
            status: t < KNEES   ? "DRIVE THEM"
                  : judging     ? "YOU PRAYED I WOULD NOT COME HOME"
                  : striking    ? "THEN TAKE IT"
                  : hearing     ? "SAY IT AGAIN"
                  : t < SEARCH  ? "GET OUT INTO THE YARD"
                  :               "TURN THEM OVER",
            progress: prog,
          },
        });
      }});
    }

    draw.sort((a, b) => a.d - b.d).forEach(x => x.run());
  },
};
export default scene;

/* named binding so OD-B22-S07 can `import { exitOccupancy as INITIAL }`.
   S07 plays in this same hall and the courtyard beyond it, so every station
   below is a megaron station and it needs no translation table. */
export const exitOccupancy = scene.exitOccupancy;
