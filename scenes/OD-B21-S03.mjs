/* ============================================================
   SCENE  OD-B21-S03 — The Suitors Fail the Bow            (Od. 21.140–273)
   Book XXI, scene 3. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its immediate
   predecessor OD-B21-S02, whose computed exit occupancy this scene imports.

   Beats (causal order, one master clock):
     1. Leiodes the diviner is the first to take it up. He cannot bend it, and
        pronounces over the hall that this bow will strip many a noble of life
        and breath. Antinous rebukes him for saying so.
     2. One after another the men strain, sweat and fail, and the bench of the
        beaten fills up behind the beggar, one man at a time.
     3. Antinous sends the goatherd for fire and fat: Melanthius sets a brazier
        down, holds the limb in the heat column and greases it.
     4. Warmed and greased, the bow still comes nowhere near. Eurymachus, the
        last and the best of them, hauls at it and is humiliated.
     5. Antinous postpones the contest for Apollo's feast: put the bow by,
        sacrifice, and try again tomorrow.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ONE ROOM, ONE PLAN, NOTHING HAND-PLACED. Every body and every prop in
      this scene is resolved through scenes/_plans/megaron.mjs by STATION NAME.
      No coordinate is invented: the scene is a table of moves between named
      stations and `blockingAt()` does the arithmetic. No local plan is
      authored, because the scene never leaves the hall — there is exactly one
      room here and it already has a plan.

   B. THE ROOM IS STATE, AND IT DOES NOT CHANGE (brief note D). The hall is
      `location.megaron-hall`, cast ONCE, in its `contest` state with the
      `axes` layer on, for every frame — which is exactly the room OD-B21-S02
      handed over: benches and tables shoved back to the walls, the hearth
      raked flush, one trench down the spine and the twelve heads standing in
      it. Nothing in this scene builds or casts a second hall, a second trench
      or a second set of axes; the twelve are the ROOM's, on the plan's own ray
      `megaron.ray("axe_first","axe_last",u)`, which is the line the arrow
      flies down in S06. `racks` stays dropped, as in S01 and S02 — the arms
      came off these walls in Book XIX. The room gets no darker as the scene
      runs: what changes is who is standing on the floor and what is in his
      hands.
      ONE MORE LAYER IS DROPPED, AND IT IS A TONE DECISION, NOT A GEOMETRY ONE.
      `postern` paints the side door as a solid dark leaf across x .19–.27,
      y .33–.72, and the goatherd — whose one heavy accent is a dark suitor's
      gift-mantle — stands IN that doorway all scene. Drafted with the layer on,
      the two fused into a single black mass with a face in it, which is the
      one thing this look cannot afford: the figure lost its legs, its arms and
      its cloak edge in one plane of ink. With the layer off he stands clear
      against the light wall and reads as a man. The STATION is untouched — the
      plan calls the postern load-bearing and it still is, occupied by exactly
      the man the plan's own note says uses it — and Book XXII, which needs the
      leaf drawn because Melanthius carries armour through it, is free to bring
      it back.

   C. WHY NOBODY IS ON THE LANE OR THE SILL (S02 note E, measured again here
      and still true). The plan's axe line sits at plan x .500 for its whole
      length, so it projects to frame x .500 at every depth: the twelve print
      as one receding column of rings about 0.03 of the frame wide, ink from
      y .531 (the far ring) to y .87 (the near helve). A figure is drawn AFTER
      the room, so a body standing anywhere in that column takes rings off the
      count, and the count is plot. `threshold`, `door_main`, `hearth`,
      `throne`, `shot_mark` and both axe stations are therefore EMPTY for the
      whole scene, and the frame keeps a clear 0.10-wide channel down its
      spine. Nobody crosses it either: every walk in this scene stays on its
      own side of the room.

   D. THE STATION BUDGET, WHICH IS WHAT DECIDED EVERYTHING ELSE. S02 lists the
      bench and table stations as NOT walkable, and draft 1 of this scene
      proved why the hard way: in `contest` the room paints the shoved-back
      furniture as solid blocks at x .11–.34 and .74–.93, y .77–.90, and every
      one of those six stations puts a body's feet at y .81–.84 — i.e. inside
      its own table. Leiodes at `table_r` had no legs. So the walkable stations
      in this hall are exactly seven — `corner_dead`, `postern`, `storeroom`,
      `pillar_l`, `pillar_r`, `stair_up`, `doorway_maid` — which is why S02 drew
      exactly six bodies, and it means a Book XXI scene cannot ADD a body to
      this floor without moving one off it. This scene moves the two S02 left
      on ground it needs, by canonical actions, in the first five seconds:
        telemachus `pillar_r` -> `throne`  — he leaned the bow against the door
                   post and sat down in his chair (21.137–139). That is what
                   frees THE STAND, and S02 had already established `pillar_r`
                   as the place a man in this hall tries this bow.
        eumaeus    `postern` -> `bench_l1` — the swineherd sits down on the
                   left bench, and the postern is the goatherd's door: the
                   plan's own note says so ("the postern is how Melanthius
                   fetches arms in XXII"). They cross on the step.
      Measured through `project()` at K_HALL, a body's ink is 0.139 x its
      station's depth scale wide, so the drawn intervals are
        odysseus    `corner_dead` .044–.202  feet .911   z .90
        melanthius  `postern`     .200–.308  feet .599   z .24
        the fire    `table_l`     .213–.358  ink y .583–.813 (a prop, 0.145
                    wide and low — a brazier standing in front of a table
                    block is an object in front of furniture, not a body
                    fused into it, which is why a PROP may hold a furniture
                    station and a body may not)
        THE STAND   `pillar_r`    .600–.724  feet .690   z .44
        antinous    `stair_up`    .767–.907  feet .794   z .66
      — a left three and a right two, whose only overlaps are 0.2% of frame
      (the beggar's shoulder over the goatherd's) and a brazier whose whole ink
      lies BELOW the goatherd's feet. The stand and Antinous do not touch at
      all. Nothing is coincident at any time on the clock.
      The rest of S02's cast is carried in the occupancy and NOT DRAWN — the
      device S02 itself used for the two women:
        penelope   `pillar_l` — present, leaning on the pillar of the roof
                   (21.64), and she speaks at 21.311, which is the NEXT scene.
        telemachus `throne` — and `throne` is at plan x .500: a body drawn
                   there stands ON the lane and takes rings off the twelve
                   (note C). He is seated in the room's own chair, which the
                   room draws.
        eumaeus `bench_l1`, philoetius `doorway_maid` — both wept out and
                   rebuked in S02; the swineherd is now on the bench the
                   ensemble seats men on.
        maids + the emptied axe chest `storeroom` — off frame since S02.
      And the two named challengers are drawn only WHILE THEY ARE THE MAN
      ACTING: Leiodes from the moment he stands up out of the line (RISE0) to
      the moment he sits back into it (BACK1), Eurymachus from TAKE0 on. Before
      and after that they are men on the benches, and the benches are drawn by
      `ensemble.suitor-bow-challengers`, whose `spent` clock is stepped at
      exactly those frames so the count of bodies in the room never changes:
      one man leaves the stand, one more sits down.

   E. THE LINE IS THE SECOND BEAT, AND IT IS THE BENCH, BY MEASUREMENT.
      `ensemble.suitor-bow-challengers` sizes its members in ABSOLUTE PIXELS
      (`s` 78–168 against its own sheet), so like every ensemble in this repo it
      is right at exactly one size — its own. Solved for this hall:
        · it is drawn on a canvas of 672x456 — 0.60 of the stage — and blitted
          at 1.667x, which puts a bench member at 0.28 of the frame height and
          0.22 of it as he actually sits. The same man solved through the plan
          at his own foot line stands 0.35, so the seated line reads one step
          DEEPER than the named bodies in front of it instead of competing with
          them, which is what draft 2 did at 2x.
        · the window is translated (-0.04, -0.04): the band moves left off the
          beggar and up onto deeper floor, which buys 6% of frame width of
          clearance from the goatherd and puts the four foot lines at y .556 to
          .728 — all of them above the near bodies' and all of them below the
          room's floor horizon at y .53.
        · `layers:["bench"]` ONLY, and this is the measurement that decided the
          whole layout. The module's line is a RECESSION: its queue path puts
          its men at x .700/.790/.800/.848 with ink .61–.86 and foot lines
          y .545–.757 — which is, to within 2% of frame, exactly the ground
          `table_r` (the stand, ink .643–.786) and `stair_up` (Antinous, ink
          .767–.907) stand on, and their foot lines are only 56px apart, so
          nothing separates them in depth either. Drafted with the queue in,
          the right half of the frame was six bodies of the same size in 0.36
          of frame width — a pile, not a line. Shifting it does not help: the
          recession is diagonal, so every shift big enough to clear the stand
          walks its far man onto the LANE. So the queue is dropped and the
          BENCH is kept: four seats at x .062–.286, foot lines y .596–.768, on
          the left wall, all four of them DEEPER than every named body on that
          side — and the bench is the half of the line that carries the beat,
          because `nB = ceil(spent·4)` is a count of men who have already
          failed. It runs 1 -> 4 across the scene. What the queue would have
          said, the room says: `contest` has the benches and tables shoved to
          the walls with the house sitting on them.
        · the other five layers stay off for reasons of their own. `hall` prints
          a second megaron. `stand` and `queue-near` print men at x .335/.596
          of the frame — Odysseus's ground, and the lane. `foreground` is two
          near cropped backs, i.e. two black masses across the bottom corners.
          `far` puts an eleven-man row at y .47–.52, ABOVE this room's floor
          horizon (y .53): men standing in the air. And `showHead`, `showBow`,
          `showNext` are false because a NAMED challenger and
          `prop.odysseuss-bow` are on the stand instead.

   F. THE BOW IS NEVER DRAWN WITHOUT HANDS ON IT (S02 note F, same rule, same
      constants — same object in the same book).
        · 0 -> YIELD in Leiodes's hands, mode `carried`, grip 0.19 of a body
          height outboard on the NEAR side and 0.16 down at the hip, so the
          crescent sweeps across the lit floor plane under every head in the
          frame instead of closing round one.
        · YIELD -> WARM NOT DRAWN. He hands it on; it goes down the line
          through hands this scene does not name. A weapon gliding across a
          floor with nobody holding it is worse than one that arrives between
          two shots.
        · WARM -> ASSIST it is the LIMB in `prop.bow-heating-fire-and-tallow`:
          the fire prop draws the stave it is serving (a registration stave
          with the required deflection dashed under it), held over the heat
          column by hands off frame. The bow is over the fire, so the bow is
          not in anybody's hands, and there is exactly one of it in the frame.
        · GRIP2 -> POSTPONE+2 in Eurymachus's hands, same two offsets.
        · It is NEVER put in mode `strung`. Nobody strings it; that is the
          whole content of the scene. Nor in `heated`/`greased`, which are
          whole-frame diagrams with their own floor rules and dashed heat
          zones — the fire prop is the instrument here, and the bow stays a
          reflexed crescent with its string coiled off one ear.

   G. THE FIRE IS ONE MODULE IN TWO VIEWS, BOTH CROPPED TO WHAT SURVIVES THE
      DOT LATTICE. `prop.bow-heating-fire-and-tallow` is a whole-sheet
      instrument: brazier, heat column, limb, required curve, tallow station,
      heat ladder, melt section, bend protractor, greased-limb section and a
      five-cell ledger, with its counts drawn as seven-segment numerals against
      its own 660x880 sheet. Cast whole at any size this hall can spare, every
      one of those gauges falls under 40px and dissolves. So it is blitted
      through TWO declared windows and everything else is cropped out on
      purpose:
        THE BRAZIER, on the floor at `table_l`: source x .065–.625,
        y .115–.684 — the limb and its dashed required curve, the heat
        chevrons, the pan with its rim, coal bed, flame tongues, ring handles
        and tripod, and the ground rule. Solved so the 0.46m pan prints 85px
        wide against a 1.75m man 281px tall at the same depth — 0.145 of the
        frame, a hair over that so the contour survives — and scaled off the plan's own prop falloff at its station.
        Melanthius stands one station BEHIND it (`bench_l1`, z .62 against the
        fire's .70), so the pan crosses his shins and the limb crosses his
        hands — which is what a man holding a bow in a heat column looks like,
        and it costs no hand-drawn overpaint to say it.
        THE TALLOW STATION, as an instrument panel: source x .565–.965,
        y .540–.700 — the platter, the cake with the wedge cut out of it, and
        the horn scoop — laid down at 1:1 against its own design size in the
        one clear wall this frame has, top right, on its own paper field with
        one hard rule (the S02 / B20-S03 window idiom). At 1:1 its 4px rules
        stay 4px. Every numeral in the module falls outside both windows.
      The panel appears when the brazier lands and then carries the whole
      remedy in its own state channel: `dormant` (the cake whole) -> `warm` ->
      `apply` (the wedge gone, the scoop loaded) -> `flex-assist` ->
      `ineffective`. Nothing in this scene depends on type at all.

   H. ONE DEPTH QUEUE, COMPUTED. Draw order is not written down: the room
      paints the field, the line is blitted behind everything (its nearest
      member sits at an equivalent z of .60, and the nearest named body at
      .62), and then every body and prop on the floor is pushed with its LIVE
      blocked z and drawn far -> near. That is why Melanthius is behind the
      brazier at one station and in front of the seated failures at the next,
      and why the beggar in the near corner is painted last, over everything.

   I. TONE. `contest` is a lift-0 state — the dark states (`night`, `battle`,
      `aftermath`) are Book XXII's and are never touched here — and the added
      ink is deliberately light: the fire prop's own levels put paper flame
      tongues over a level-6 coal bed, the ensemble's line is contour with
      nothing above level 5, and the two windows are paper fields. NO
      hand-drawn ctx overpaint is added to any figure anywhere in this file:
      every mark on every body is the shared rig plus that character's own
      module.

   CONTINUITY IN — computed, not asserted:
     import { exitOccupancy as INITIAL } from "./OD-B21-S02.mjs";
   which is { penelope:"pillar_l", maids:"storeroom", axes:"storeroom",
             telemachus:"pillar_r", eumaeus:"postern",
             philoetius:"doorway_maid", antinous:"stair_up",
             odysseus:"corner_dead" } — all megaron stations, so no translation
   table is needed and NOBODY IS DROPPED. The five things this scene adds are
   declared from the plan by name in ADDED and merged in: leiodes and the bow
   at `bench_r2`, eurymachus at `bench_r1`, melanthius still in the store
   passage at `storeroom`, and the
   brazier still in the household stores at `storeroom`.

   CONTINUITY OUT — computed from the plan, never written:
     { penelope:"pillar_l", maids:"storeroom", axes:"storeroom",
       telemachus:"throne", eumaeus:"bench_l1", philoetius:"doorway_maid",
       antinous:"stair_up", odysseus:"corner_dead", leiodes:"bench_r2",
       bow:"pillar_r", eurymachus:"pillar_r", melanthius:"postern",
       fire:"table_l" }
   The bow and the last man who failed with it hold the same station, the way a
   carried thing does — it is lying on the stand where he set it down, which is
   where Odysseus asks for it in S04.

   Verify (the omen; the fire and the fat; Eurymachus beaten):
     node harness/render-scene.mjs scenes/OD-B21-S03.mjs --t 32
     node harness/render-scene.mjs scenes/OD-B21-S03.mjs --t 72
     node harness/render-scene.mjs scenes/OD-B21-S03.mjs --t 98
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import hall        from "../assets/location/megaron-hall.mjs";
import leiodes     from "../assets/character/leiodes.mjs";
import eurymachus  from "../assets/character/eurymachus.mjs";
import melanthius  from "../assets/character/melanthius.mjs";
import antinous    from "../assets/character/antinous.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import challengers from "../assets/ensemble/suitor-bow-challengers.mjs";
import fire        from "../assets/prop/bow-heating-fire-and-tallow.mjs";
import bow         from "../assets/prop/odysseuss-bow.mjs";

/* CONTINUITY IN — the previous scene's computed exit occupancy. */
import { exitOccupancy as PREV_EXIT } from "./OD-B21-S02.mjs";

const HALL_ASSET = "location.megaron-hall";
const D = 112;

/* ---- THE CLOCK ---------------------------------------------------------- */
const RISE0 = 6,  RISE1 = 13;   // Leiodes leaves his seat for the stand
const BRACE = 17;               // instep against the belly of the bow
const FAIL  = 26;               // it does not move
const OMEN  = 32;               // he holds it off at arm's length: the prophecy
const REBUKE= 38;               // Antinous rebukes him for saying it
const YIELD = 43;               // he hands it on; the bow leaves the frame
const BACK0 = 44, BACK1 = 50;   // and he walks back to his seat, undrawn after
const ORDER = 46;               // "light a fire, Melanthius, and bring the fat"
const STEP1 = 55;               // he turns to the brazier as it comes through
const FIRE0 = 50, FIRE1 = 56;   // the brazier comes up from the stores
const WARM  = 58;               // >>> lit; the limb goes into the heat column
const TURNS = 62;               // the warmed bow goes down the line again
const APPLY = 70;               // a wedge off the cake; grease on the limb
const ASSIST= 80;               // warmed and greased, and still nowhere near
const TAKE0 = 86, TAKE1 = 92;   // Eurymachus stands up and comes to the stand
const GRIP2 = 92;               // the bow in the best man's hands
const STRAIN2 = 95;
const FAIL2 = 102;              // he cannot either; the humiliation
const POSTPONE = 106;           // >>> put it by until Apollo's feast tomorrow

/* ---- THE ROOM (note B) --------------------------------------------------
   ONE state, ONE layer set, for every frame: the room OD-B21-S02 handed over.
   `racks` dropped since Book XIX; `axes` on, because the twelve are planted. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill",
                     "maidsdoor","stair","pillars","lane","hearth","furniture",
                     "litter","throne","axes"];

/* ---- CONTINUITY IN + what this scene adds (note A) ---------------------- */
const ADDED = {
  leiodes:"bench_r2",      // the diviner, sitting apart on the near right
  bow:"bench_r2",          // in his hands: S02 ended with it out of the son's
  eurymachus:"bench_r1",   // the best of them, still seated, still smiling
  melanthius:"storeroom",  // the goatherd, coming up the store passage
  fire:"storeroom",        // the brazier and the fat, still in the stores
};
const INITIAL = { ...PREV_EXIT, ...ADDED };

/* ---- BLOCKING. Stations, not coordinates (notes A, C, D). ---------------
   Eight moves. Two of them are the displacements note D describes, and they
   happen in the first five seconds because they are what makes the ground; the
   rest are the contest. Not one move crosses the lane: the left half of the
   room walks on the left and the right half on the right. */
const MOVES = [
  // the ground: the son sits down in his chair, the swineherd takes the bench,
  // and the goatherd comes up out of the store passage into his own doorway
  { who:"telemachus", from:"pillar_r",  to:"throne",    t0:0, t1:5 },
  { who:"eumaeus",    from:"postern",   to:"bench_l1",  t0:0, t1:4 },
  { who:"melanthius", from:"storeroom", to:"postern",   t0:0, t1:5 },
  // the contest
  { who:"leiodes",    from:"bench_r2",  to:"pillar_r", t0:RISE0, t1:RISE1 },
  { who:"bow",        from:"bench_r2",  to:"pillar_r", t0:RISE0, t1:RISE1,
    kind:"prop" },
  { who:"leiodes",    from:"pillar_r",  to:"bench_r2", t0:BACK0, t1:BACK1 },
  { who:"fire",       from:"storeroom", to:"table_l",  t0:FIRE0, t1:FIRE1,
    kind:"prop" },
  { who:"eurymachus", from:"bench_r1",  to:"pillar_r", t0:TAKE0, t1:TAKE1 },
];

/* ---- THE BOX A BODY IS DRAWN IN (verbatim device from S01 / S02) ---------
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide), and every character module in this repo lays its garment out in
   fractions of its box WIDTH, so a landscape box turns a body into a bell.
   Every figure here is drawn into the PORTRAIT box the atlas uses for
   characters, 660/880, and blitted. FIG_FLOOR is the rig's own floor line:
   figure-hero plants the ankles at 0.90 of its box height. K_HALL is S02's
   one height for every adult in this room, unchanged, so a body cut between
   these two scenes does not change size. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
const K_HALL    = 0.46;

/* blit a module into a box of a chosen aspect, anchored by a point INSIDE the
   box. `fx`/`fy` say where in the box the anchor lands (0..1). `sig` is
   required: keyedModuleCanvas caches on pose/band/t only, so without it a
   change of gaze or brow returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* PLATE — blit one declared WINDOW of a whole-frame drawing, keyed, so the room
   shows between its lines and the drawing's frame furniture, headers and
   numerals stay out of frame. `cw`/`ch` is the canvas the drawing is made on;
   `dst` is where the window lands, in frame fractions. */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* place a windowed plate by its FOOT MARK — the middle of its bottom edge — so
   a prop stands on the ground the plan gave it instead of on a hand anchor. */
function propAt(offctx, W, H, mod, { x, y, wFrac, hFrac, cw, ch, win, state, sig }){
  plate(offctx, W, H, mod, cw, ch, win,
        { x0: x - wFrac / 2, y0: y - hFrac, x1: x + wFrac / 2, y1: y },
        state, sig);
}
/* A DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses. Keyed straight onto the room, the roof
   plane's rafters run through the drawing and it stops reading as a diagram.
   (Verbatim device from OD-B20-S03 / OD-B21-S01 / OD-B21-S02.) */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

/* ---- THE LINE OF CHALLENGERS (note E) -----------------------------------
   Half-stage canvas (560x380), blitted at 2x, in place: the BENCH band only,
   on the left wall where the plan keeps no station of its own but the room's
   `contest` state has shoved the benches. ENS_THR is the reason this works at
   all: the module opens by flooding its whole sheet with inkLevel(1), which is
   gray 219 — lum .859, i.e. DARKER than borderKey's default .895 cutoff, so at
   the default threshold that field is opaque paint and the blit prints a light
   rectangle over the doors, the pillars, the hearth and the twelve axes.
   Keyed at .845 the field is flood-cleared to the canvas border and the room
   shows between the seated men, while every tone the drawing actually uses
   (skin and tunics at level 2 = lum .714, hair at 4–6) survives untouched. */
const ENS_CW = 672, ENS_CH = 456;
const ENS_WIN = { x0:.04, y0:.30, x1:.42, y1:.82 };
const ENS_DST = { x0:.00, y0:.26, x1:.38, y1:.78 };
const ENS_THR = 0.845;

/* the line's own clock. `spent` is the asset's own counter — the share of the
   house that has already tried — and it is the second beat: it moves men from
   the queue onto the bench, `nB = ceil(spent·4)`, so raising it across the
   scene fills the bench one man at a time. It is stepped at exactly the two
   frames a named challenger stops being drawn, so the number of bodies in the
   room never changes. Deterministic in t. */
function lineState(t){
  const F = (formation, spent, fatigue, mock, attention) =>
    ({ formation, spent, fatigue, mock, attention, wave:1.4, waveSpread:.16,
       density:.75, effort:.35, contestant:3, foreground:0, seed:2103,
       showHall:false, showStand:false, showHead:false, showBow:false,
       showNext:false, layers:["bench"], t:0.5 });
  if (t < BRACE)   return F("queue",   .18, .12, .30, .85);
  if (t < FAIL)    return F("attempt", .18, .14, .22, .95);
  if (t < OMEN)    return F("fail",    .30, .22, .62, .95);
  if (t < YIELD)   return F("mock",    .34, .28, .85, .90);
  if (t < FIRE1)   return F("attempt", .45, .36, .40, .88);
  if (t < TURNS)   return F("warming", .50, .42, .28, .70);
  if (t < APPLY)   return F("attempt", .60, .48, .30, .90);
  if (t < ASSIST)  return F("warming", .65, .55, .26, .74);
  if (t < TAKE0)   return F("fail",    .75, .62, .58, .92);
  if (t < FAIL2)   return F("attempt", .80, .70, .30, .96);
  if (t < POSTPONE)return F("mock",    .90, .82, .80, .92);
  return             F("spent",   1.00, .95, .10, .45);
}

/* ---- THE BOW (constants from S01/S02, unchanged): in mode `carried` the bow
   lies on the diagonal of its box, ink (.06,.10)-(.79,.72), and the grip block
   — the ivory plate under the carry strap — is at (.667,.566). It goes on the
   NEAR hand, 0.19 of a body height outboard, and is carried LOW, at 0.16 of a
   body height — hip height, where a man braces a bow he cannot bend. */
const BOW_AR   = FIG_AR;
const BOW_H    = 0.88;
const BOW_GRIP = { x:0.667, y:0.566 };
const BOW_OUT  = 0.19;
const BOW_LOW  = 0.16;
/* ONE exception, and it is not a hand-tuned nudge: `character.leiodes` ships a
   declared anchor `offerOut` at (.87,.57) of its own box, measured on the
   `leiodes_omen` pose — the weapon held off at the full stretch of the right
   arm, which is that pose's entire content. Carried at the hip, the crescent
   closes round his torso in a hoop and the omen reads as a man in a barrel.
   For those frames only, the grip goes on the module's own anchor. */
const OFFER_GRIP = { x:0.87, y:0.57 };

/* ---- THE FIRE, TWO WINDOWS (note G) -------------------------------------
   Both are cut on the module's own design sheet, 660x880, because its gauges
   are laid out against exactly that sheet.
     BRAZIER  x .065–.625, y .115–.684 — limb + required curve, heat chevrons,
              pan, rim, coal bed, flames, handles, tripod, ground rule.
              Excludes: the header and its seven-segment counts, the melt
              section, the heat ladder, the tallow station, the bend
              protractor, the greased-limb section and the five-cell ledger.
     TALLOW   x .565–.965, y .540–.700 — platter, cake (with the wedge cut out
              of it in `apply`), horn scoop. Laid down at 1:1.
   FIRE_W is solved so the declared 0.46m pan prints 85px wide against a
   1.75m man 281px tall at this depth; FIRE_S is the plan's prop falloff at
   `table_l` (z .70), which the placement divides out so the brazier obeys the
   same depth law as everything else on this floor. */
const FIRE_CW = 660, FIRE_CH = 880;
const FIRE_WIN = { x0:.065, y0:.115, x1:.625, y1:.684 };
const FIRE_W   = 0.145;
const FIRE_S   = 0.874;
const TAL_WIN = { x0:.565, y0:.540, x1:.965, y1:.700 };
const TAL_DST = { x0:.720, y0:.058, x1:.956, y1:.243 };
/* AND THE BRAZIER IS DRAWN ON A HALF-SIZE SHEET, WHICH IS THE WHOLE TRICK.
   The module's rules are typed in FIXED PIXELS (`lineWidth` 4–5, tick radii
   3.6), so drawn on its 660x880 design sheet and blitted down to the 162x225
   the hall can spare — a 0.38 reduction — every rule in it lands at 1.5px and
   the pan prints as a scatter of stray dots with no contour at all. That is
   exactly what draft 3 did. Drawn instead on a 330x440 sheet the geometry
   halves while those fixed rules do NOT, so the same window blits at 0.77 and
   the brazier keeps a 3px hard contour, which is what the dot lattice needs to
   read a 0.46m object 97px wide (1.14x its declared size, which is the
   trade this look asks for: legible before literal). The tallow panel keeps the full design sheet,
   because it is laid down at 1:1 and wants the rules exactly as authored. */
const FIRE_SHEET_W = 330, FIRE_SHEET_H = 440;

const fireMode = t => t < WARM   ? "dormant"
                    : t < APPLY  ? "warm"
                    : t < ASSIST ? "apply"
                    : t < FAIL2  ? "flex-assist"
                    :              "ineffective";

export const scene = {
  id:"OD-B21-S03",
  title:"The Suitors Fail the Bow",
  book:21,
  plan:"megaron",
  duration:D,
  beats:[
    "Leiodes tries first, cannot bend the bow, and predicts it will destroy many suitors.",
    "One after another the men strain, sweat, and fail.",
    "Melanthius lights a fire and brings fat so the bow can be warmed and greased.",
    "Even Eurymachus cannot string it and suffers humiliation.",
    "Antinous postpones the contest for Apollo's festival feast.",
  ],
  exitState:
    "Evening of Apollo's feast day, in the megaron, still in its CONTEST " +
    "state: the tables and benches shoved back against the walls, the hearth " +
    "raked flush, the great doors shut, and the twelve axe heads standing " +
    "haft-down in the trench along the spine of the floor, every socket eye " +
    "on one line — untouched, because nothing has been shot and nobody has " +
    "stood on the lane or the sill all afternoon. The whole house has now " +
    "tried the bow of Iphitus and the whole house has failed it. Leiodes the " +
    "diviner, who was the first to take it up, is back in his place apart on " +
    "the near right (`bench_r2`) with the prophecy he made over it — that " +
    "this bow will strip many a noble of life and breath — still standing " +
    "unanswered except by Antinous's rebuke. Melanthius's remedy is on the " +
    "floor at `table_l`, burning down: a three-legged brazier with its coal " +
    "bed going grey, the wheel of fat cut into and slumped on its platter, " +
    "the horn scoop laid across it, and the goatherd himself in the side " +
    "doorway he fetched it through (`postern`), out of orders. The bow was " +
    "warmed in the heat column and " +
    "greased along the belly and it made no difference: the deficit sector " +
    "never closed. Eurymachus, the best of them, has just hauled at it in " +
    "front of the whole hall and been beaten in front of the whole hall, and " +
    "he is still standing on the stand — the right-hand roof pillar " +
    "(`pillar_r`), the same ground Telemachus tried it on in S02 — with the " +
    "bow lying where he set it down (`bow` -> `pillar_r`), unstrung, still " +
    "reflexed with its " +
    "string coiled off one ear. Antinous holds the foot of the queen's stair " +
    "(`stair_up`) and has just spoken the postponement: put the weapon by, " +
    "leave the axes standing where they are, pour libations, sacrifice to " +
    "Apollo the archer tomorrow, and try again in the morning — which every " +
    "man in the hall has agreed to with relief. Penelope holds `pillar_l`, " +
    "leaning on the pillar of the roof, and has not spoken yet; Telemachus " +
    "has been in his own chair (`throne`) since he leaned the bow aside at " +
    "the top of the scene; Eumaeus has sat down on the left bench " +
    "(`bench_l1`) and Philoetius holds the mouth of the servants' door " +
    "(`doorway_maid`); the two women and the emptied axe " +
    "chest are still at the mouth of the arms passage (`storeroom`). And the " +
    "beggar is where he has been since Book XVII, apart in the near corner " +
    "(`corner_dead`), having watched every man in the room fail with his own " +
    "bow, and it is now his turn to ask for it.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    telemachus:"none — he is at `pillar_r` when the scene opens and off it by " +
               "t=5: he leans the bow aside and sits down in his chair " +
               "(`throne`, 21.137–139), which is what frees THE STAND",
    eumaeus:"none — off the postern step to `bench_l1` by t=4, so the " +
            "goatherd can have his own door",
    leiodes:"none — already at `bench_r2`, with the bow, out of Telemachus's " +
            "hands in the seam between scenes; he stands up out of the line at " +
            "RISE0=6 (his first drawn frame) and reaches THE STAND at " +
            "`pillar_r` at RISE1=13",
    eurymachus:"none — already at `bench_r1`; he is not drawn until he stands " +
               "up for his turn (TAKE0=86) because until then he is a man on " +
               "a bench, and the benches are drawn by the ensemble",
    melanthius:"up the store passage: `storeroom` -> `postern` (t=0 to 5), " +
               "into the side doorway that is his in this plan",
    antinous:"none — already at `stair_up`, inherited from S02",
    odysseus:"none — already at `corner_dead`, in guise `beggar` since XVII",
    fire:"in from `storeroom` on Antinous's order (FIRE0=50), set down at " +
         "`table_l` (FIRE1=56); not drawn until it lands",
    challengers:"none — the house is seated when the scene opens, 18% spent: " +
                "Telemachus has already tried and failed, in S02",
  },
  exits:{
    leiodes:"off the stand to `bench_r2` (BACK1=50); not drawn after he sits — " +
            "from that frame he is one of the men the ensemble seats",
    eurymachus:"none — he holds the stand (`pillar_r`), beaten",
    melanthius:"none — he holds the postern doorway",
    antinous:"none — he holds `stair_up`; the postponement is his",
    odysseus:"none — he holds `corner_dead`",
    bow:"out of Leiodes's hands (YIELD=43), over the fire (WARM=58), into " +
        "Eurymachus's (GRIP2=92), and down on the stand at the postponement",
    fire:"none — it stays at `table_l`, burning down, into S04",
    penelope:"none", telemachus:"none — seated at `throne`",
    eumaeus:"none — seated at `bench_l1`", philoetius:"none",
    maids:"none — still off frame at `storeroom` with the emptied chest",
  },
  walkable:"the megaron's walkable band, MINUS four things: the LANE (plan " +
           "x .472–.528, z .24–.78) and the SILL (`threshold`, `door_main`), " +
           "which are empty for the whole scene because a body drawn there " +
           "takes rings off the twelve (note C); the hearth ring (plan " +
           "x .395–.605, z .445–.595), raked flush but still the fire; ALL SIX " +
           "bench and table stations, because `contest` paints the shoved-back " +
           "furniture as solid blocks at x .11–.34 and .74–.93, y .77–.90 and " +
           "every one of those stations stands a body's feet inside its own " +
           "table (note D) — they are seats and prop grounds in this scene, " +
           "walked across but never stood on; and the brazier's own footprint " +
           "at `table_l`, which is hot. Nobody crosses the spine: every move " +
           "stays on the side of the room it starts on.",
  depthOrder:"the room paints the field; then the seated LINE, blitted whole " +
             "behind everything on the floor (its nearest man sits at an " +
             "equivalent z of .55 and the shallowest named body stands at " +
             ".24, so one blit is correct for the whole bench); then ONE queue " +
             "of the floor's bodies and props, sorted every frame by their " +
             "LIVE blocked z, far -> near — the goatherd at the postern (.24), " +
             "the man at the stand (.44), Antinous (.66), the brazier (.70) " +
             "and the beggar (.90) painted last, over all of it; then what " +
             "each body carries, immediately after its carrier; then the " +
             "tallow panel, which is an overlay and is always last.",
  gazeTargets:{
    leiodes:"the bow in his own hands, then — on the omen — out at the hall " +
            "he is prophesying to, then down and away from Antinous",
    eurymachus:"the bow, then his own locked hands, then the floor",
    melanthius:"up at Antinous while he takes the order, then down into the " +
               "coals and along the limb he is greasing, then sideways at " +
               "the men still failing",
    antinous:"Leiodes while he speaks and while he is rebuked, then the " +
             "goatherd, then the bow, then the whole hall for the postponement",
    odysseus:"the bow, without a break, in whatever hands it is in",
    challengers:"the stand — the bench men are turned onto it by `attention` " +
                ".45–.96, and their heads go down with `fatigue` as the " +
                "afternoon wears on",
  },
  attachments:[
    { at:0,      who:"leiodes",    change:"prop.odysseuss-bow at his grip, mode " +
      "`carried`, near hand, hip height — handed on by Telemachus in the seam" },
    { at:YIELD,  who:"leiodes",    change:"the bow leaves his hands and is NOT " +
      "drawn: it goes down the line through hands this scene does not name" },
    { at:ORDER,  who:"antinous",   change:"the order goes to the goatherd" },
    { at:FIRE1,  who:"fire",       change:"prop.bow-heating-fire-and-tallow is " +
      "set down at `table_l`, mode `dormant`; the tallow panel opens" },
    { at:WARM,   who:"fire",       change:"mode `warm` — lit, and the LIMB of " +
      "the bow is in the heat column: the bow is over the fire, in nobody's hands" },
    { at:APPLY,  who:"fire",       change:"mode `apply` — a wedge cut off the " +
      "cake, the scoop loaded, the grease laid on the limb as a film collar" },
    { at:ASSIST, who:"fire",       change:"mode `flex-assist` — the limb bending " +
      "under a man, the achieved needle climbing, still short of required" },
    { at:GRIP2,  who:"eurymachus", change:"prop.odysseuss-bow at his grip, same " +
      "two offsets: the bow comes off the fire into the best man's hands" },
    { at:FAIL2,  who:"fire",       change:"mode `ineffective` — the fire burning " +
      "down, the deficit sector wide open and struck through" },
    { at:POSTPONE+2, who:"eurymachus", change:"the bow goes down on the stand " +
      "and is not drawn again in this scene" },
  ],
  sound:[
    { at:BRACE,    source:"pillar_r",   cue:"horn creaking, and a soft man's breath going out of him" },
    { at:FAIL,     source:"pillar_r",   cue:"the stave coming off the instep, unbent" },
    { at:OMEN,     source:"pillar_r",   cue:"a diviner's voice, pitched to the room, saying the wrong thing" },
    { at:REBUKE,   source:"stair_up",  cue:"one voice over him, contemptuous, and the hall laughing with it" },
    { at:ORDER,    source:"stair_up",  cue:"an order given to a servant without looking at him" },
    { at:WARM,     source:"table_l",   cue:"charcoal catching; fat beginning to run" },
    { at:TURNS,    source:"pillar_r",  cue:"men going at it in turn, and the same sound each time" },
    { at:APPLY,    source:"table_l",   cue:"a scoop dragged along horn" },
    { at:ASSIST,   source:"pillar_r",   cue:"greased horn, and still nothing" },
    { at:STRAIN2,  source:"pillar_r",   cue:"the best man in the house, straining" },
    { at:FAIL2,    source:"pillar_r",   cue:"a bow butt set down hard, and no laughing this time" },
    { at:POSTPONE, source:"stair_up",  cue:"a proposal everybody is relieved to accept" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:HALL_ASSET, instance:"hall_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"ensemble.suitor-bow-challengers", instance:"line_01",
      anchor:{x:.46,y:.86}, scale:.60, state:"queue" },
    { asset:"character.melanthius", instance:"melanthius",
      anchor:{x:.21,y:.84}, scale:.49, band:"threeq", pose:"mel_swagger" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.84,y:.79}, scale:.46, band:"threeq", pose:"three_quarter_right" },
    { asset:"prop.bow-heating-fire-and-tallow", instance:"fire_01",
      anchor:{x:.29,y:.81}, scale:.13, state:"dormant" },
    { asset:"character.leiodes", instance:"leiodes",
      anchor:{x:.71,y:.81}, scale:.47, band:"threeq", pose:"leiodes_reluctant" },
    { asset:"character.eurymachus", instance:"eurymachus",
      anchor:{x:.71,y:.81}, scale:.47, band:"threeq", pose:"lean_forward" },
    { asset:"prop.odysseuss-bow", instance:"bow_01",
      anchor:{x:.78,y:.75}, scale:.41, state:"carried" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.12,y:.91}, scale:.52, band:"threeq", pose:"three_quarter_left" },
  ],

  timeline:[
    /* 1. Leiodes: reluctant, straining, and then the omen */
    { op:"actor.pose",  target:"leiodes",    at:0.0,      args:{ pose:"leiodes_reluctant" } },
    { op:"actor.gaze",  target:"leiodes",    at:0.0,      args:{ gaze:{ x:-.40, y:.26 } } },
    { op:"actor.pose",  target:"antinous",   at:0.0,      args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"antinous",   at:0.0,      args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"actor.pose",  target:"melanthius", at:0.0,      args:{ pose:"mel_swagger" } },
    { op:"actor.gaze",  target:"melanthius", at:0.0,      args:{ gaze:{ x:.34, y:.30 } } },
    { op:"actor.pose",  target:"odysseus",   at:0.0,      args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:0.0,      args:{ gaze:{ x:.44, y:-.06 } } },
    { op:"actor.pose",  target:"leiodes",    at:BRACE,    args:{ pose:"leiodes_strain" } },
    { op:"actor.gaze",  target:"leiodes",    at:BRACE,    args:{ gaze:{ x:-.54, y:-.02 } } },
    { op:"set.state",   target:"line_01",    at:BRACE,    args:{ state:"strain" } },
    { op:"set.state",   target:"line_01",    at:FAIL,     args:{ state:"fail" } },
    { op:"actor.pose",  target:"leiodes",    at:OMEN,     args:{ pose:"leiodes_omen" } },
    { op:"actor.gaze",  target:"leiodes",    at:OMEN,     args:{ gaze:{ x:.46, y:.16 } } },
    { op:"set.state",   target:"line_01",    at:OMEN,     args:{ state:"mock" } },
    { op:"actor.pose",  target:"antinous",   at:REBUKE,   args:{ pose:"jabbing_accusation" } },
    { op:"actor.gaze",  target:"antinous",   at:REBUKE,   args:{ gaze:{ x:-.34, y:.06 } } },
    { op:"actor.pose",  target:"leiodes",    at:YIELD,    args:{ pose:"leiodes_yield" } },
    { op:"actor.gaze",  target:"leiodes",    at:YIELD,    args:{ gaze:{ x:.08, y:.44 } } },
    /* 2. the order for fire and fat, and the goatherd taking it */
    { op:"actor.pose",  target:"antinous",   at:ORDER,    args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"antinous",   at:ORDER,    args:{ gaze:{ x:-.44, y:.20 } } },
    { op:"actor.pose",  target:"melanthius", at:ORDER,    args:{ pose:"mel_fawn" } },
    { op:"actor.gaze",  target:"melanthius", at:ORDER,    args:{ gaze:{ x:.46, y:-.34 } } },
    { op:"prop.state",  target:"fire_01",    at:FIRE1,    args:{ mode:"dormant" } },
    { op:"actor.pose",  target:"melanthius", at:STEP1,    args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"melanthius", at:STEP1,    args:{ gaze:{ x:.10, y:.46 } } },
    /* 3. the fire, the fat, and the men still failing */
    { op:"prop.state",  target:"fire_01",    at:WARM,     args:{ mode:"warm" } },
    { op:"actor.pose",  target:"antinous",   at:WARM,     args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"antinous",   at:WARM,     args:{ gaze:{ x:-.36, y:.24 } } },
    { op:"set.state",   target:"line_01",    at:TURNS,    args:{ state:"strain" } },
    { op:"prop.state",  target:"fire_01",    at:APPLY,    args:{ mode:"apply" } },
    { op:"actor.pose",  target:"melanthius", at:APPLY,    args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"melanthius", at:APPLY,    args:{ gaze:{ x:.06, y:.42 } } },
    { op:"prop.state",  target:"fire_01",    at:ASSIST,   args:{ mode:"flex-assist" } },
    { op:"actor.pose",  target:"melanthius", at:ASSIST,   args:{ pose:"mel_jeer" } },
    { op:"actor.gaze",  target:"melanthius", at:ASSIST,   args:{ gaze:{ x:.48, y:.18 } } },
    { op:"actor.pose",  target:"antinous",   at:ASSIST,   args:{ pose:"skepticism" } },
    { op:"actor.gaze",  target:"antinous",   at:ASSIST,   args:{ gaze:{ x:-.28, y:.14 } } },
    /* 4. Eurymachus, and the humiliation */
    { op:"actor.pose",  target:"eurymachus", at:TAKE0,    args:{ pose:"walk_neutral" } },
    { op:"actor.gaze",  target:"eurymachus", at:TAKE0,    args:{ gaze:{ x:-.24, y:.18 } } },
    { op:"actor.pose",  target:"eurymachus", at:GRIP2,    args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"eurymachus", at:GRIP2,    args:{ gaze:{ x:-.18, y:.30 } } },
    { op:"actor.pose",  target:"eurymachus", at:STRAIN2,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"eurymachus", at:STRAIN2,  args:{ gaze:{ x:-.14, y:.34 } } },
    { op:"set.state",   target:"line_01",    at:STRAIN2,  args:{ state:"strain" } },
    { op:"actor.pose",  target:"eurymachus", at:STRAIN2+4,args:{ pose:"both_hands_raised" } },
    { op:"actor.pose",  target:"eurymachus", at:FAIL2,    args:{ pose:"head_lowered" } },
    { op:"actor.gaze",  target:"eurymachus", at:FAIL2,    args:{ gaze:{ x:-.10, y:.48 } } },
    { op:"prop.state",  target:"fire_01",    at:FAIL2,    args:{ mode:"ineffective" } },
    { op:"set.state",   target:"line_01",    at:FAIL2,    args:{ state:"mock" } },
    { op:"actor.pose",  target:"antinous",   at:FAIL2,    args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"antinous",   at:FAIL2,    args:{ gaze:{ x:-.20, y:.28 } } },
    /* 5. the postponement */
    { op:"actor.pose",  target:"antinous",   at:POSTPONE, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"antinous",   at:POSTPONE, args:{ gaze:{ x:-.26, y:-.10 } } },
    { op:"actor.pose",  target:"melanthius", at:POSTPONE, args:{ pose:"mel_swagger" } },
    { op:"actor.gaze",  target:"melanthius", at:POSTPONE, args:{ gaze:{ x:.40, y:.10 } } },
    { op:"set.state",   target:"line_01",    at:POSTPONE, args:{ state:"exhausted" } },
    { op:"timeline.capture", target:"OD-B21-S03", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.08 + 0.88 * (t / D));

    /* --- 1. THE ROOM. One field; it paints the world and everything else keys
       onto it. Placed the way every Book XVI+ scene places this hall — anchor
       (.50,.99), scale 1.0 — so it registers on B18–B21's hall exactly. ----- */
    placeInstance(offctx, W, H, hall, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"contest", t:breath, layers:HALL_LAYERS,
        status: t >= POSTPONE ? "PUT THE BOW BY"
              : t >= WARM     ? "FIRE AND FAT"
              : t >= FAIL     ? "NOT ONE OF THEM"
              :                 "THE TWELVE STAND",
        progress:prog,
      },
    });

    /* --- 2. THE LINE (note E). One blit, behind everything on the floor:
       every seated man in it stands deeper than the nearest named body. ---- */
    {
      const s = lineState(t);
      plate(offctx, W, H, challengers, ENS_CW, ENS_CH, ENS_WIN, ENS_DST,
            { ...s, status:"IN TURN", progress:prog },
            `line|${s.formation}|${Math.round(s.spent*50)}`
            + `|${Math.round(s.fatigue*50)}|${Math.round(s.mock*50)}`
            + `|${Math.round(s.attention*50)}`, ENS_THR);
    }

    /* --- 3. ONE DEPTH QUEUE (note H). Everything that stands on this floor is
       pushed with its live blocked z and drawn far -> near. ---------------- */
    const queue = [];
    const push = (d, draw) => queue.push({ d, draw });

    /* one figure, from the plan, into the portrait box, at the room's one
       height times this station's own depth falloff. `holds` says whether the
       bow is in this body's hands on this frame. */
    const figure = (who, mod, extra, statusOf, holds = () => false) => {
      const p = blk[who], s = st[who] || {};
      const scale = K_HALL * p.scale;
      const pose  = p.moving ? "walk_neutral" : (s.pose || "neutral");
      const gaze  = s.gaze || { x:0, y:.06 };
      const state = {
        t: p.moving ? (t * 0.40) % 4 : breath,
        band:"threeq", pose, gaze,
        status: statusOf(t), progress:prog,
        ...extra(t),
      };
      const sig = `${who}|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
                + `|${Math.round(t)}`;
      push(p.d, () => {
        place(offctx, W, H, mod, {
          x:p.x, y:p.y, hFrac:scale, ar:FIG_AR, fx:0.5, fy:FIG_FLOOR,
          pad:FIG_PAD, state, sig,
        });
        /* WHAT HE CARRIES — keyed to this body's live blocked box, so a weapon
           in a hand cannot drift off it (note F). Offsets verbatim from S01 /
           S02, where they were solved over three drafts. `holds` returns
           "hip" (the standing rule) or "offer" (the module's own anchor). */
        const grip = holds(t);
        if (grip){
          const bodyH = scale * 0.78;
          const boxW  = scale * FIG_AR * (H / W);       // the body box, in frame x
          place(offctx, W, H, bow, {
            x: grip === "offer" ? p.x + (OFFER_GRIP.x - 0.5) * boxW
                                : p.x + BOW_OUT * bodyH,
            y: grip === "offer" ? p.y + (OFFER_GRIP.y - FIG_FLOOR) * scale
                                : p.y - BOW_LOW * bodyH,
            hFrac: scale * BOW_H, ar:BOW_AR,
            fx:BOW_GRIP.x, fy:BOW_GRIP.y, pad:0.05,
            state:{ mode:"carried", t:0.5, flex:0, owner:3,
                    status:"UNSTRUNG", progress:.18 },
            sig:"bow|carried",
          });
        }
      });
    };

    /* MELANTHIUS — insolence downward, servility upward, and in between the
       one piece of work he does in the poem. He stands in his own doorway (the
       postern, note D) and the brazier he fetched burns on the floor in front
       of him: its whole ink lies below his feet, so his gaze and the clock do
       the joining, not an overlap. */
    figure("melanthius", melanthius,
      tt => {
        const fawning = tt >= ORDER && tt < STEP1;
        const working = tt >= STEP1 && tt < ASSIST;
        const jeering = tt >= ASSIST && tt < POSTPONE;
        return {
          browUp:   fawning ? .58 : working ? .22 : .06,
          browKnit: working ? .44 : jeering ? .40 : .34,
          eyeNarrow:jeering ? .54 : working ? .26 : .48,
          smile:    fawning ? .34 : jeering ? .12 : .10,
          mouthAsym:jeering ? .78 : fawning ? .30 : .70,
          jaw:      fawning ? .26 : 0,
        };
      },
      tt => tt >= POSTPONE ? "NO CREDIT"
          : tt >= ASSIST   ? "IT MADE NO ODDS"
          : tt >= APPLY    ? "GREASING IT"
          : tt >= STEP1    ? "WARMING IT"
          : tt >= ORDER    ? "AT ONCE, SIR"
          :                  "INSOLENT");

    /* ANTINOUS — the voice of the house: the rebuke, the order, the excuse. */
    figure("antinous", antinous,
      tt => {
        const rebuking = tt >= REBUKE && tt < ORDER;
        const ordering = tt >= ORDER && tt < WARM;
        const uneasy   = tt >= FAIL2 && tt < POSTPONE;
        const speaking = tt >= POSTPONE;
        return {
          browKnit: rebuking ? .74 : uneasy ? .62 : .34,
          browUp:   speaking ? .34 : uneasy ? .26 : .12,
          eyeNarrow:rebuking ? .44 : ordering ? .34 : .26,
          frown:    uneasy ? .40 : 0,
          jaw:      rebuking ? .48 : speaking ? .36 : 0,
          mouthAsym:rebuking ? .56 : .30,
        };
      },
      tt => tt >= POSTPONE ? "TOMORROW, THEN"
          : tt >= FAIL2    ? "NOT ONE OF US"
          : tt >= ORDER    ? "FIRE AND FAT"
          : tt >= REBUKE   ? "THE REBUKE"
          :                  "HIS TURN LAST");

    /* THE BRAZIER AND THE FAT — a prop on the floor, at the plan's own prop
       falloff, cropped to the brazier (note G). Drawn only once it has been
       set down: a brazier gliding across a floor is worse than one that
       arrives between two shots. */
    if (t >= FIRE1){
      const a  = blk.fire;
      const wF = FIRE_W * (a.scale / FIRE_S);
      const hF = wF * (W / H) * ((FIRE_WIN.y1 - FIRE_WIN.y0) * FIRE_SHEET_H)
                              / ((FIRE_WIN.x1 - FIRE_WIN.x0) * FIRE_SHEET_W);
      const mode = fireMode(t);
      push(a.d, () => propAt(offctx, W, H, fire, {
        x:a.x, y:a.y, wFrac:wF, hFrac:hF,
        cw:FIRE_SHEET_W, ch:FIRE_SHEET_H, win:FIRE_WIN,
        state:{ mode, t:0.5, status:"WARM", progress:prog },
        sig:`fire|brazier|${mode}`,
      }));
    }

    /* LEIODES — the diviner, drawn while he is the man acting: from the frame
       he stands up out of the line to the frame he sits back into it. */
    if (t >= RISE0 && t < BACK1){
      figure("leiodes", leiodes,
        tt => {
          const straining = tt >= BRACE && tt < OMEN;
          const omened    = tt >= OMEN && tt < YIELD;
          const rebuked   = tt >= REBUKE && tt < YIELD;
          const yielding  = tt >= YIELD;
          return {
            browUp:   omened ? .66 : yielding ? .34 : .28,
            browKnit: straining ? .58 : omened ? .52 : rebuked ? .50 : .22,
            frown:    yielding ? .44 : rebuked ? .30 : 0,
            eyeNarrow:straining ? .38 : .06,
            eyeWide:  omened ? .30 : 0,
            jaw:      straining ? .30 : 0,
            smile:    0,
          };
        },
        tt => tt >= YIELD ? "UNHEEDED"
            : tt >= OMEN  ? "OMEN-STRUCK"
            : tt >= FAIL  ? "IT DOES NOT MOVE"
            : tt >= BRACE ? "STRAINING"
            :               "RELUCTANT",
        tt => tt >= YIELD ? false : tt >= OMEN ? "offer" : "hip");
    }

    /* EURYMACHUS — the best of them, drawn from the moment he stands up. */
    if (t >= TAKE0){
      figure("eurymachus", eurymachus,
        tt => {
          const straining = tt >= STRAIN2 && tt < FAIL2;
          const last      = tt >= STRAIN2 + 4 && tt < FAIL2;
          const beaten    = tt >= FAIL2;
          return {
            browUp:   beaten ? .40 : last ? .30 : .26,
            browKnit: straining ? .66 : beaten ? .54 : .20,
            frown:    beaten ? .52 : straining ? .26 : 0,
            eyeNarrow:straining ? .40 : .18,
            jaw:      last ? .44 : 0,
            smile:    tt < GRIP2 ? .18 : 0,
            mouthAsym:tt < GRIP2 ? .70 : beaten ? .18 : .10,
          };
        },
        tt => tt >= FAIL2   ? "HUMILIATED"
            : tt >= STRAIN2 ? "EVERYTHING HE HAS"
            : tt >= GRIP2   ? "HE TAKES IT UP"
            :                 "THE BEST OF THEM",
        tt => (tt >= GRIP2 && tt < POSTPONE + 2) ? "hip" : false);
    }

    /* ODYSSEUS — the beggar in the near corner, watching his own bow go round
       the room. One body, one guise channel, no cut. */
    figure("odysseus", odysseus,
      tt => ({
        guise:"beggar",
        browKnit: tt >= FAIL2 ? .34 : .24,
        browUp:   tt >= POSTPONE ? .30 : .12,
        eyeNarrow:tt >= FAIL2 ? .30 : .38,
        smile:    tt >= FAIL2 ? .18 : tt >= FAIL ? .10 : .04,
      }),
      tt => tt >= POSTPONE ? "HIS TURN NOW"
          : tt >= FAIL2    ? "NOT ONE OF THEM"
          : tt >= WARM     ? "FIRE WILL NOT DO IT"
          : tt >= FAIL     ? "HIS OWN BOW"
          :                  "THE BEGGAR");

    queue.sort((a, b) => a.d - b.d).forEach(q => q.draw());

    /* --- 4. THE TALLOW PANEL. An overlay, always last (note G). ----------- */
    if (t >= FIRE1){
      const mode = fireMode(t);
      detailField(offctx, W, H, TAL_DST);
      plate(offctx, W, H, fire, FIRE_CW, FIRE_CH, TAL_WIN, TAL_DST,
            { mode, t:0.5, status:"WARM", progress:prog }, `fire|tallow|${mode}`);
    }
  },
};
export default scene;

/* named binding so OD-B21-S04 can `import { exitOccupancy as INITIAL }`.
   S04 plays in this same hall and every station in this scene is a megaron
   station, so it needs no translation table — the bow is lying on the stand
   at `pillar_r`, which is where the beggar asks for it. */
export const exitOccupancy = scene.exitOccupancy;
