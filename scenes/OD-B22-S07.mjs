/* ============================================================
   SCENE  OD-B22-S07 — The Disloyal Maids   (Od. 22.417–477)
   Book XXII, scene 7. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its predecessor,
   scenes/OD-B22-S06.mjs, whose room, layer list, figure law, hoist law and
   near-floor register are inherited here verbatim.

   Beats (causal order, one master clock):
     1. Eurycleia comes to the women's door and names the twelve who went with
        the suitors and mocked the house.
     2. The twelve are made to carry the dead men out and then to scour the
        hall with water and sponges.
     3. Telemachus refuses them the clean sword: a ship's cable across the
        yard, and the twelve are lifted off the paving in a row.
     4. Melanthius is brought down out of the store, mutilated and killed.
     5. The house's corrupted labour is purged, and the yard is what is left.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. TWO ROOMS, TWO PLANS, ONE CLOCK — AND THE HANDOFF IS THE HALL'S.
      The naming happens in the megaron; the cable, the row and Melanthius are
      in the courtyard, which is a different place and not a state of the hall.
      So the scene crosses at CROSS=32 and is blocked through TWO plans:
        · scenes/_plans/megaron.mjs for everything before CROSS, and for the
          canonical bookkeeping of every body for the whole duration;
        · `courtyard`, a SMALL LOCAL plan authored at the top of this file with
          makePlan({id,name,stations}), for the drawing after CROSS.
      `exitOccupancy` is computed off the MEGARON — S08 is a hall scene (S06's
      note A hands the stair to it, "where the hall is empty of them and
      Eurycleia climbs it"), so the hall is the occupancy the chain needs, and
      the three who go outside are recorded on the hall stations they went out
      by (`threshold`, `door_main`, `postern`). `exitYardOccupancy` is exported
      beside it, computed off the courtyard plan, so the yard is structured too
      and nothing about the row of twelve is prose.

   B. THE HALL DOES NOT ADVANCE ITS STATE, AND THAT IS DELIBERATE.
      The atlas would like a hall that gets cleaner. S06's exitState says the
      `aftermath` state "does not advance again until the hall is washed in
      S08", and megaron-hall has no half-washed node — `cleaned` is doors open,
      fire fresh, furniture in order, sulphur burnt, which is S08's frame and
      not this one. So the field is location.megaron-hall in `aftermath` at
      S01–S06's anchor (.50,.99) and scale 1.0, on S06's layer list to the
      letter, and THE CLEANING IS CARRIED BY THE PROP INSTEAD (note F). A room
      that stayed put while the twelve worked it is the honest picture: they
      have carried the bodies out, and the floor is still what it is.

   C. NO HAND-PLACED FIGURE ANCHORS, IN EITHER ROOM. Every body resolves
      through a plan by station NAME; there is not one hand anchor on a figure
      in this file. In the yard the twelve are the exception that proves it:
      after CROSS ensemble.twelve-disloyal-maids IS THE FIELD — it paints the
      yard, the wall, the round-house, the gate, the cable and the register —
      so it is placed at the field anchor the way every location in this atlas
      is placed, and the plan still records the ground the row stands on
      (`line_mid`) so the handoff is structured.

   D. THE ENSEMBLE'S MEMBERS ARE ABSOLUTE PIXELS, SO THE BOX IS SOLVED, NOT
      GUESSED. twelve-disloyal-maids sizes a member in PIXELS (LINE 176..190,
      HAUL 126..268, scrub 150..252), not in fractions of its box, exactly as
      ensemble.armed-suitors does in S04. Everything else it draws — yard,
      wall, cable, register, station spacing — is a fraction of its canvas.
      Both facts together give the one control that matters: RENDER IT ON A
      SMALLER CANVAS AND BLIT IT UP. The composition is unchanged (fractions
      are zoom-invariant) and the women grow by exactly the blit factor. So
      MAIDS_ZOOM is solved per formation against the plan's own figure law —
      a woman standing on the row's floor line comes out the height the plan
      says a body standing there is, times WOMAN (0.94):
        line / herd / hanged  1.27   (row members 176..190 -> 224..241)
        carry                 1.08   (the haul's own ramp is steeper than the
                                      room's; 1.08 is the compromise that puts
                                      the middle of the file at plan height)
        scrub                 0.78   (DOWN, not up: s is a STANDING unit and
                                      the asset already ramps it to 252 at the
                                      near end, so the row's 1.27 gives a
                                      kneeling woman 257px of gown where a
                                      kneeling body should be ~0.6 of the 258px
                                      the plan gives a man standing there. At
                                      1.02 the twelve pooled hems — hemw .288,
                                      hemDrop negative, the gown on the stone —
                                      fused into one black band across the
                                      lower half of the yard with the register
                                      buried under it. At 0.78 the hems are
                                      113px against a 260px column pitch and
                                      twelve separate women are on their knees)
      Draft 1 blitted everything at 1.0 and the twelve came out at 74% of a man
      standing on the same line: they read as children, and the row stopped
      being twelve women of the house.

   E. THE HUDDLE IN THE HALL IS A BOX ON A STATION, AND IT ARRIVES LATE.
      Before NAME=14 the twelve are not in this room and are not drawn. Beat 1
      is the nurse fetching them, so they come in at the women's door and are
      set down at the LEFT ROOF-PILLAR — and the box is SOLVED off that
      station, never placed: the ensemble's own row centre (.510,.814 of its
      box) is put on the projected mark, so the huddle stands on the plan's
      floor and not on a guess. 760x543 at `pillar_l`, ZOOM 1.09 — the zoom
      solved at THAT station's depth (note D), not at the row's own, because
      that is the floor they are standing on.
      TWO THINGS ARE BEING SOLVED AT ONCE AND BOTH TOOK A DRAFT TO GET.
        · PITCH. The twelve stations are evenly spread across the asset's own
          canvas, so the box width IS the spacing. Draft 1 used 520 and the
          pitch came out 41px against a 73px hem: the twelve printed as one
          mash of gowns and stopped being countable, which for an asset whose
          entire subject is that there are TWELVE is the failure. At 760 the
          pitch is 58px against a 65px hem — they still touch, which is what a
          huddle does, and every head is separately visible.
        · DEPTH. Draft 2 keyed the box on `bench_l1` (z .62) with the row's own
          1.27, and the arithmetic then put the row's crowns at y 368 and
          Telemachus' crown, on `table_l` at z .70, at y 365 — THREE PIXELS
          APART. He vanished into them: same head height, same head size, one
          band of faces. Moved back to `pillar_l` (z .44) and zoomed 1.09, the
          row's feet are at 523 against his at 619 and their crowns at 324
          against his at 365 — he is 96px nearer the camera, 28% taller, and
          drawn after them. The huddle's left end still runs off the near-left
          edge into `corner_dead`, where the heap S02–S06 drove into the corner
          still is — the same overrun S04's crowd has had since S02.
      `showYard`, `showCable` and `showRegister` are ALL OFF and the layer list
      is `bodies` + the three rank bands: the yard is a second courtyard with
      its own paving, wall and round-house and would print straight through the
      megaron, and the register is the yard's instrument, not the hall's. What
      is left on that canvas is twelve women and four dead men, which is what a
      scene wants from an ensemble standing in an authored room.

   F. THE CLEANING IS A DETAIL WINDOW, BECAUSE THE HALL IS NOT WHERE THE
      CAMERA IS. prop.body-removal-and-cleaning-tools is authored as a whole
      3:4 plate whose whole point is the five-tile CLEANING TRANSITION —
      FOULED -> SCRAPED -> SPONGED -> RINSED -> CLEAN, with a caret on the live
      stage and a seven-segment per-cent. Solved as an object standing in the
      megaron it would dissolve, and after CROSS the hall is off-camera
      entirely. So it is laid down the way S03/S04 and OD-B21-S02 lay down
      their instruments: as a DETAIL WINDOW with its own paper field and one
      hard rule, blitted at a declared crop, drawn last.
        · WINDOW = x .048..0.952, y .648..0.905 of the prop's own 3:4 sheet —
          the five tiles, the registration brackets, the caret and the big
          station numerals. The kit band and the gauge's two-digit read are
          cropped OUT: at this reduction they are 12px marks in a dot lattice,
          which is the failure the brief names. What survives is GEOMETRY —
          five tiles losing their blots one stage at a time.
        · DESTINATION = x .578..0.950, y .048..0.2556 (417x158, the crop's own
          2.64 aspect, so nothing is stretched), the same top-right patch S04
          used, above every crown in either room.
        · PHASE walks stowed -> carrying -> scraping -> sponging -> rinsing ->
          cleaned on the master clock. It comes down at LINE, when the hall is
          clean and the yard becomes the subject, and THE CABLE TAKES ITS PLACE
          in the same rectangle — one window at a time, never two.

   G. THE CABLE IS A WINDOW TOO, AND IT SHOWS WHAT THE YARD CANNOT.
      The ensemble already draws the span, the twelve seizings and the nooses.
      What it cannot draw at that size is the RIG: the running noose, the round
      turn and two half hitches under the pillar capital, and the heaver
      swigging the standing part taut. prop.courtyard-execution-cable's upper
      STUDY BAND is exactly those three at scale, so the crop is x .042..0.972,
      y .118..0.358 and the yard elevation and the six-state ledger are cropped
      out — the elevation would restate the round-house and the post that are
      already standing in the picture. MODE walks looped -> suspended.

   H. NOBODY IS COINCIDENT, IN EITHER ROOM.
        HALL   Odysseus holds `table_r` (px 801, feet 619) — S06's mark, and he
               never leaves it: in the poem he stays in the megaron and calls
               for fire and sulphur while his son takes the women out. The
               nurse is at `doorway_maid` (px 881, feet 510), deeper, to his
               right and at the door the women come through — 80px of x and a
               whole depth band from the king. TELEMACHUS DOES NOT MOVE UNTIL
               HE LEAVES: he holds S06's own `table_l` (px 319, feet 619, 254px)
               and the huddle is keyed two bands DEEPER at `pillar_l` (feet 523,
               199px), so he is nearer, lower, larger and drawn after them —
               the four things that have to agree, and the same four the yard
               uses. A draft that sent him to `threshold` instead put him on
               the spine, where S06's note D says there is no standing ground:
               the twelve axe helves print a black column from y 470 to y 632
               straight through his legs and the far doors put a dark panel
               behind his head. Melanthius hangs in the store on S05/S06's own
               computed lift (note I): his toes come out at y 277, 47px above
               the tallest crown in the huddle.
        YARD   The row of twelve spans the whole plate at y .806..0.822, so the
               two named bodies are FOREGROUND, nearer and lower and bigger:
               Telemachus on `order_mark` (px 816, feet 699, 274px) and
               Melanthius on `block` (px 352, feet 685, 274px) — 464px apart,
               80px in front of the row's floor line, heads 425 and 411 against
               the row's 389. Nearer, lower, larger, in front: the three things
               that have to agree for a foreground figure to be one.

   I. THE HOIST AND THE LOWERING ARE BOTH SOLVED, NOT TYPED. In the hall,
      hoistExtra() is S05/S06's function verbatim — the room's own un-clamped
      ceiling law with HOIST_TOP measured off the module's card — so the man on
      the store beam hangs where he has hung for three scenes. In the yard the
      SAME crown measurement is run against the ensemble's own cable, whose
      height at his station comes from the asset's published cableY: crown 402
      against a span at 262, so 100px of lift at LOWER0 closing linearly to 0 at
      LOWER1. He is lowered onto the paving by geometry, and `hoist` and the
      pose go with it. No pixel of any body in this file is drawn by this file;
      ctx overpaint on every figure is ZERO.

   J. WHO IS DROPPED, AND WHY. S06 hands over fifteen keys. NOTHING is dropped
      from the OCCUPANCY. Six are dropped from the PICTURE, keeping their keys
      and stations so S08 receives the room as S06 left it:
        · `eumaeus`, `philoetius` — S06 drew the three of them as
          ensemble.telemachus-eumaeus-and-philoetius, which is authored for
          S06's sweep ("coordinated finishers checking flanks and survivors")
          and not for this one; the atlas casts no such line here, and casting
          it would print Telemachus twice. He is a CHARACTER rig in this scene
          and the other two are off the working floor, on the marks S06 left
          them (`bench_l2`, `axe_last`). NO STATION IN THIS FILE CARRIES TWO
          BODIES THAT ARE BOTH DRAWN — `pillar_l` carries the twelve and
          `amphinomus`, but the corpse is bookkeeping, and that is the whole
          list.
        · `suitors`, `eurymachus`, `amphinomus`, `antinous`, `leiodes` — the
          dead. Five corpse rigs on the near floor is the collision this
          convention exists to prevent, and the dead are not absent from the
          picture: `litter:"blood"` is still under everything, and the FOUR
          BODIES THE TWELVE ARE ABOUT TO CARRY are the ensemble's own `bodies`
          layer, laid behind the huddle where the plan puts the mid-floor.
        · `tables`, `board`, `arms` — props S03–S06 window in; this scene has
          two windows already and they are both this scene's business.
      Two keys are ADDED: `eurycleia` at `doorway_maid`, and `maids` at
      `pillar_l`. Odysseus is drawn although the atlas does not list him: he is
      standing at `table_r` when this scene opens because S06 put him there,
      and the order that starts it is his.

   K. TONE. Four rig figures with ZERO ctx overpaint, one ensemble box whose
      big shapes are LIGHT gowns (levels 1–2) with dark girdles and hair, a
      yard authored as paper paving under a paper wall with the dark held to
      the coping, the round-house doorway and the gate, and two windows that
      are mostly paper with the ink in the tiles, the blots and the cordage.
      No ACCENT marks anywhere: the POST pass quantizes by luminance and a blue
      mark prints BLACK. The hall keeps S06's frame — upper third, near-left
      corner and right-hand floor paper — and the yard's whole lower quarter,
      upper quarter and left half are paper by construction.

   CONTINUITY IN — INHERITED, NOT ASSERTED.
      import { exitOccupancy as INITIAL } from "./OD-B22-S06.mjs";
   S06 ends in THIS hall and every station it hands over is a megaron station,
   so no translation table is needed. The courtyard's initial occupancy IS
   translated, because a hall station does not exist in the yard plan: the
   three who go outside come through the gate lane and nobody else crosses.

   Verify (the naming in the hall, and the row in the yard):
     node harness/render-scene.mjs scenes/OD-B22-S07.mjs --t 20
     node harness/render-scene.mjs scenes/OD-B22-S07.mjs --t 84
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import eurycleia   from "../assets/character/eurycleia.mjs";
import melanthius  from "../assets/character/melanthius-b22.mjs";
import maids       from "../assets/ensemble/twelve-disloyal-maids.mjs";
import tools       from "../assets/prop/body-removal-and-cleaning-tools.mjs";
import cable       from "../assets/prop/courtyard-execution-cable.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 102;

/* ---- THE SECOND ROOM (note A). A SMALL LOCAL PLAN, authored here because the
   yard has none and the discipline holds outdoors. x 0 left..1 right,
   z 0 far..1 near, the same plan space the megaron is authored in. The
   stations are read off the ensemble's own published yard: the gate at .652
   ..0.752, the round-house at .140, the far post at .946, the cable between
   them, and the row of twelve on the line the asset calls LINE. ------------ */
export const courtyard = makePlan({
  id:"courtyard",
  name:"The Courtyard of the House of Odysseus",
  notes:"The hall gate is the only way back inside; the round-house takes the " +
        "near end of the cable and the post at the wall takes the far end. " +
        "The row of twelve stands between the wall and the camera.",
  stations:{
    gate_hall:  { x:.88, z:.18 },   // the way out of the megaron
    gate_lane:  { x:.70, z:.30 },   // the lane just outside it
    tholos:     { x:.06, z:.24 },   // the round-house — the cable's near anchor
    cable_post: { x:.98, z:.26 },   // the post at the wall foot — its far anchor
    wall_run:   { x:.50, z:.22 },
    laid_dead:  { x:.34, z:.36 },   // where the carried men are laid at the wall
    altar:      { x:.10, z:.44 },
    yard_mid:   { x:.50, z:.50 },
    line_head:  { x:.08, z:.68 },   // the row along the wall, left end
    line_mid:   { x:.50, z:.68 },
    line_tail:  { x:.92, z:.68 },   // right end
    block:      { x:.30, z:.88 },   // where Melanthius comes down
    order_mark: { x:.74, z:.92 },   // near foreground — where the order is given
  },
  fixtures:[
    { id:"execution_cable", kind:"prop", along:["tholos","cable_post"], count:12,
      note:"12 seizings, one running noose each — prop.courtyard-execution-cable" },
  ],
});

/* ---- THE CLOCK ---------------------------------------------------------- */
const NAME   = 14;   // the twelve are brought in and named
const WAVE1  = 18;   // the naming runs down them
const ORDER  = 26;   // carry them out, and then scour the floor
const CROSS  = 32;   // out of the hall — the yard
const STACK  = 40;   // the dead laid along the wall
const SCRUB  = 48;   // on their knees with sponges
const HERD   = 62;   // driven off the paving into the row
const LINE   = 68;   // wrists corded, twelve nooses waiting
const WAVE2  = 74;   // it reaches them one after another down the row
const LIFT0  = 80;   // the cable takes up
const LIFT1  = 88;   // clear of the paving, in a row
const LOWER0 = 88;   // Melanthius comes down out of the store
const LOWER1 = 94;   // on the paving
const KILL   = 97;

const ramp = (t, a, b) => clamp01((t - a) / Math.max(1e-6, b - a));

/* ---- CONTINUITY IN — INHERITED, NOT ASSERTED (note J) ------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B22-S06.mjs";
const ENTERING = { eurycleia:"doorway_maid", maids:"pillar_l" };
const INITIAL = { ...PREV_EXIT, ...ENTERING };

/* ---- BLOCKING, ROOM ONE. Stations, not coordinates. --------------------- */
const MOVES = [
  // beat 2/3 — the twelve, the son and the goatherd all leave the hall
  { who:"maids",      from:"pillar_l",  to:"threshold", t0:ORDER,  t1:CROSS },
  { who:"telemachus", from:"table_l",   to:"door_main", t0:ORDER,  t1:CROSS },
  { who:"melanthius", from:"storeroom", to:"postern",   t0:LOWER0-4, t1:LOWER0 },
];

/* ---- BLOCKING, ROOM TWO (note A). The hall stations do not exist out here,
   so the inherited occupancy is TRANSLATED and everyone the story leaves
   indoors is dropped: Odysseus stays in the megaron, the nurse stays at the
   women's door, and the dead, the props and the two herdsmen are hall
   bookkeeping. Three keys cross, and they all cross by the gate. ---------- */
const YARD_INITIAL = { maids:"gate_lane", telemachus:"gate_lane",
                       melanthius:"gate_hall" };
const YARD_MOVES = [
  { who:"telemachus", from:"gate_lane", to:"order_mark", t0:CROSS,  t1:CROSS+6 },
  { who:"maids",      from:"gate_lane", to:"yard_mid",   t0:CROSS,  t1:STACK  },
  { who:"maids",      from:"yard_mid",  to:"line_mid",   t0:HERD,   t1:LINE   },
  { who:"melanthius", from:"gate_hall", to:"block",      t0:LOWER0, t1:LOWER0+3 },
];

/* one figure scale for the whole cast; the plan's depth law does the rest.
   K and FIG_INK are S01–S06's, unchanged. */
const K = 0.42;
const FIG_INK = 0.752;
const WOMAN = 0.94;          // a woman of the house against the plan's own body

/* placeFigure — verbatim in intent from S01–S06: the lift puts FEET on the
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
/* the same crown, run against the ensemble's own span instead of a roof (I).
   CABLE_Y is the asset's published cableY() at his station; ROPE_DROP is how
   far under the span a bound man's crown hangs. */
const CABLE_Y = 0.345, ROPE_DROP = 0.052;
function lowerExtra(H, p, u){
  const boxH   = H * K * p.scale;
  const boxTop = (p.y + 0.10 * K * p.scale) * H - boxH;
  const crown  = boxTop + HOIST_TOP * boxH;
  return Math.max(0, crown - (CABLE_Y + ROPE_DROP) * H) * (1 - clamp01(u));
}

/* ---- THE TWELVE (note D). One blit, one zoom table, two placements. -----
   The ensemble is rendered on a canvas SMALLER than its destination and blown
   up: every fraction it draws survives untouched and only the pixel-sized
   members grow. The zoom per formation is solved against the plan's own figure
   law at the floor line that formation stands on. */
const MAIDS_ZOOM = { herd:1.27, line:1.27, hanged:1.27, carry:1.08, scrub:0.78 };
function blitMaids(offctx, rect, state){
  const z  = state.zoom ?? MAIDS_ZOOM[state.formation] ?? 1.20;
  const cw = Math.max(64, Math.round(rect.w / z));
  const ch = Math.max(64, Math.round(rect.h / z));
  const sig = `m12|${state.formation}|${Math.round((state.lift ?? 0) * 20)}`
            + `|${Math.round((state.wave ?? 2) * 20)}`
            + `|${Math.round((state.dread ?? 0) * 20)}`
            + `|${Math.round((state.attention ?? 0) * 20)}`
            + `|${state.bodies ?? 0}|${(state.layers || []).join("")}|${cw}`;
  offctx.drawImage(keyedModuleCanvas(maids, cw, ch, state, sig),
                   rect.x, rect.y, rect.w, rect.h);
}
/* THE HUDDLE'S BOX, solved every frame off the `maids` key's own blocked
   station (note E). ROW_X/ROW_Y are the asset's own row centre in box space
   (LINE runs .092..0.928 at y .806..0.822), so putting them on the projected
   mark stands the row on the plan's floor rather than on a guess — and because
   the point comes from blockingAt() and not from a station name, the box walks
   with the twelve when they are driven out at ORDER. */
const HUD = { cw:760, ch:543, rowX:0.510, rowY:0.814, zoom:1.09 };
function huddleRect(W, H, p){
  return { w:HUD.cw, h:HUD.ch,
           x: p.x * W - HUD.rowX * HUD.cw,
           y: p.y * H - HUD.rowY * HUD.ch };
}
/* the hall layers: twelve women and the four dead they are about to lift. The
   yard, the wall, the cable, the nooses, the register and the near pier are the
   COURTYARD's furniture and are off in this room (note E). */
const HUD_LAYERS = ["bodies","rank-back","rank-mid","rank-front"];
const YARD_LAYERS_NOCABLE =
  ["yard","wall","bodies","rank-back","rank-mid","rank-front","register","pier"];
const YARD_LAYERS =
  ["yard","wall","cable","bodies","rank-back","rank-mid","rank-front",
   "nooses","register","pier"];

/* the drill on the clock. One number renders each channel — nothing here is a
   branch in the body (the asset's own contract). */
function maidsAt(t){
  const naming  = ramp(t, WAVE1, WAVE1 + 9);      // the wave of the naming
  const dooming = ramp(t, WAVE2, WAVE2 + 6);      // the wave down the row
  const inHall  = t < CROSS;
  const formation = t < ORDER  ? "herd"
                  : t < CROSS  ? "herd"
                  : t < SCRUB  ? "carry"
                  : t < HERD   ? "scrub"
                  : t < LINE   ? "herd"
                  : t < LIFT0  ? "line"
                  :              "hanged";
  return {
    formation, count:12, density:1.0, spread:1.0, dir:-1,
    /* the wave is PARKED off the spine (>1) except in the two windows where it
       is actually travelling; a wave that never parks makes every frame the
       same frame. */
    wave: t >= WAVE1 && t < WAVE1 + 9 ? -0.2 + 1.5 * naming
        : t >= WAVE2 && t < WAVE2 + 6 ? -0.2 + 1.5 * dooming
        :                               1.8,
    waveSpread:0.17,
    attention: t < NAME   ? 0.30
             : t < ORDER  ? 0.86
             : t < SCRUB  ? 0.30
             : t < HERD   ? 0.16
             : t < LIFT0  ? 0.74
             :              0.0,
    dread: t < NAME   ? 0.46
         : t < CROSS  ? 0.66
         : t < SCRUB  ? 0.54
         : t < HERD   ? 0.48
         : t < LIFT0  ? 0.82
         :              1.0,
    lift: t < LIFT0 ? 0 : ramp(t, LIFT0, LIFT1),
    bodies: inHall ? 4 : t < STACK ? 2 : 6,
    showYard: !inHall, showCable: !inHall && t >= HERD, showRegister: !inHall,
    layers: inHall ? HUD_LAYERS : (t >= HERD ? YARD_LAYERS : YARD_LAYERS_NOCABLE),
    status: t < NAME   ? "AT THE WOMEN'S DOOR"
          : t < ORDER  ? "TWELVE OF FIFTY"
          : t < CROSS  ? "DRIVEN OUT"
          : t < STACK  ? "CARRYING OUT"
          : t < SCRUB  ? "STACKED"
          : t < HERD   ? "SCOURING"
          : t < LINE   ? "INTO THE ROW"
          : t < LIFT0  ? "IN LINE"
          : t < LIFT1  ? "TAKING UP"
          :              "IN A ROW",
  };
}

/* ---- WINDOW MACHINERY (device verbatim from S03 / S04 / OD-B21-S02) ----- */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
function detailField(offctx, W, H, dst){
  offctx.save(); offctx.fillStyle = PAPER;
  offctx.fillRect(dst.x0 * W, dst.y0 * H,
                  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
  offctx.restore();
}
function detailRule(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save(); offctx.strokeStyle = INK; offctx.lineWidth = 7;
  offctx.strokeRect(x + 3.5, y + 3.5, w - 7, h - 7); offctx.restore();
}

/* THE CLEANING STRIP (note F). Both props are authored against the harness
   card, 3:4, and are keyed at more than card resolution so the reduction has
   marks to give away. */
const TOOL_CW = 760, TOOL_CH = 1013;
const TOOL_WIN = { x0:.048, y0:.648, x1:.952, y1:.905 };   // 687 x 260, 2.64:1
const TOOL_DST = { x0:.578, y0:.048, x1:.950, y1:.2556 };  // 417 x 158, 2.64:1
const toolsAt = t => t < ORDER  ? { mode:"stowed",   load:0, lift:0, fill:1.00, wet:0.00, clean:0.00, phase:0 }
                   : t < CROSS  ? { mode:"carrying", load:1, lift:1, fill:1.00, wet:0.00, clean:0.14, phase:0 }
                   : t < SCRUB  ? { mode:"carrying", load:1, lift:1, fill:0.96, wet:0.05, clean:0.24, phase:0 }
                   : t < HERD   ? { mode:"scraping", load:0, lift:0, fill:0.86, wet:0.15, clean:0.38, phase:1 }
                   : t < LINE   ? { mode:"sponging", load:0, lift:0, fill:0.60, wet:1.00, clean:0.62, phase:2 }
                   :              { mode:"rinsing",  load:0, lift:0, fill:0.22, wet:0.80, clean:0.82, phase:3 };

/* THE RIG (note G). The study band only: the running noose, the pillar hitch
   and the heaver. The yard elevation is cropped out — it is standing in the
   picture already. */
const CBL_CW = 760, CBL_CH = 1013;
const CBL_WIN = { x0:.042, y0:.118, x1:.972, y1:.358 };    // 707 x 243, 2.91:1
const CBL_DST = { x0:.578, y0:.048, x1:.950, y1:.2366 };   // 417 x 143, 2.91:1

export const scene = {
  id:"OD-B22-S07",
  title:"The Disloyal Maids",
  book:22,
  plan:"megaron",
  duration:D,
  beats:[
    "Eurycleia comes to the women's door and names the twelve who went with the suitors and mocked the house.",
    "The twelve are made to carry the dead men out of the hall and then to scour the floor with water and sponges.",
    "Telemachus refuses them a clean death by the sword and makes a ship's cable fast across the courtyard.",
    "The twelve are set in a row under the cable and lifted off the paving together, like thrushes taken in a net.",
    "Melanthius is brought down out of the arms-store, mutilated and killed in the yard.",
    "The corrupted labour of the house is purged, and what is left standing in the yard is the rig and the row.",
  ],
  exitState:
    "THE HALL IS EMPTY OF THEM AND STILL IN ITS `aftermath` STATE — great doors " +
    "barred, hearth dead, clerestory hazed, the twelve axe helves standing down " +
    "the spine, and the floor still carrying S06's blood. The state does NOT " +
    "advance here: megaron-hall has no half-washed node, and the washing itself " +
    "is S08's, where Odysseus calls for fire and sulphur. What HAS changed is " +
    "that the dead are out of it: the heap that held `corner_dead` from S02, the " +
    "three named dead (Eurymachus at `pillar_r`, Amphinomus at `pillar_l`, " +
    "Antinous across his board at `bench_r1`) and Leiodes at `bench_r2` have all " +
    "been carried out to the courtyard wall by the twelve, and their keys and " +
    "stations are handed on unchanged only as the ground those bodies were " +
    "lifted off. ODYSSEUS NEVER LEFT THE MEGARON: he holds `table_r`, as " +
    "himself, guise `restored`, and the order that began this scene and the " +
    "order for fire that begins the next are both given from that mark. " +
    "EURYCLEIA IS IN THE HALL at the women's door (`doorway_maid`), having named " +
    "the twelve and having had them taken away from her; she is the body S08 " +
    "sends up the stair. TELEMACHUS IS OUT (`door_main`), THE TWELVE ARE OUT " +
    "(`threshold`) AND MELANTHIUS IS OUT (`postern`, dragged through the store " +
    "passage). IN THE COURTYARD, which `exitYardOccupancy` records: the twelve " +
    "hang in a row from the ship's cable strung between the round-house and the " +
    "post at the wall (`line_mid`), feet clear of the paving, formation " +
    "`hanged`, lift 1 — dead, and the cable's twelve seizings all loaded; " +
    "Telemachus stands in front of them on `order_mark` with the work finished; " +
    "MELANTHIUS IS DEAD on the paving at `block`, lowered out of the store, " +
    "bound and cut. The dead men the twelve carried are laid along the wall " +
    "foot (`laid_dead`). Nobody is left alive in that yard but Telemachus, and " +
    "the hall he goes back into is clean and empty and not yet purified.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from a plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"aftermath" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.71,y:.81}, scale:.43, band:"threeq", pose:"confrontation" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:.79,y:.67}, scale:.36, band:"threeq", pose:"eury_clasp" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.28,y:.81}, scale:.43, band:"threeq", pose:"confrontation" },
    { asset:"ensemble.twelve-disloyal-maids", instance:"maids",
      anchor:{x:.21,y:.84}, scale:.46, state:"herded" },
    { asset:"character.melanthius-b22", instance:"melanthius",
      anchor:{x:.22,y:.63}, scale:.34, band:"threeq", pose:"m22_hoist" },
    { asset:"prop.body-removal-and-cleaning-tools", instance:"kit",
      anchor:{x:.76,y:.15}, scale:.37, mode:"stowed" },
    { asset:"prop.courtyard-execution-cable", instance:"rig",
      anchor:{x:.76,y:.14}, scale:.37, mode:"looped" },
  ],

  timeline:[
    // opening frame = S06's closing frame
    { op:"actor.pose",  target:"odysseus",   at:0.0,     args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:0.0,     args:{ gaze:{ x:-.34, y:.40 } } },
    { op:"actor.pose",  target:"telemachus", at:0.0,     args:{ pose:"three_quarter_left" } },
    { op:"actor.pose",  target:"eurycleia",  at:0.0,     args:{ pose:"eury_clasp" } },
    { op:"actor.pose",  target:"melanthius", at:0.0,     args:{ pose:"m22_hoist" } },
    { op:"prop.state",  target:"kit",        at:0.0,     args:{ mode:"stowed" } },
    // 1. the nurse is sent for the women, and names them
    { op:"actor.pose",  target:"odysseus",   at:4.0,     args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:4.0,     args:{ gaze:{ x:.44, y:-.06 } } },
    { op:"sound.cue",   target:"odysseus",   at:4.0,     args:{ src:"table_r", cue:"call me the women who have disgraced this house" } },
    { op:"actor.pose",  target:"telemachus", at:8.0,     args:{ pose:"listening" } },
    { op:"actor.pose",  target:"eurycleia",  at:NAME,    args:{ pose:"eury_alarm" } },
    { op:"actor.gaze",  target:"eurycleia",  at:NAME,    args:{ gaze:{ x:-.52, y:.24 } } },
    { op:"crowd.state", target:"maids",      at:NAME,    args:{ formation:"herd" } },
    { op:"sound.cue",   target:"eurycleia",  at:WAVE1,   args:{ src:"doorway_maid", cue:"twelve of the fifty went their own way" } },
    { op:"actor.pose",  target:"telemachus", at:16.0,    args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:16.0,    args:{ gaze:{ x:-.40, y:.30 } } },
    // 2. carry them out, and then scour the floor
    { op:"actor.pose",  target:"eurycleia",  at:ORDER,   args:{ pose:"eury_hush" } },
    { op:"actor.pose",  target:"telemachus", at:ORDER,   args:{ pose:"pointing_arm" } },
    { op:"actor.pose",  target:"odysseus",   at:ORDER,   args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at:ORDER,   args:{ gaze:{ x:-.30, y:.30 } } },
    { op:"prop.state",  target:"kit",        at:ORDER,   args:{ mode:"carrying" } },
    { op:"crowd.state", target:"maids",      at:ORDER,   args:{ formation:"herd", note:"driven out through the great doors" } },
    { op:"sound.cue",   target:"telemachus", at:ORDER,   args:{ src:"threshold", cue:"carry them out, and then wash this floor" } },
    { op:"actor.exit",  target:"telemachus", at:CROSS,   args:{ via:"door_main", note:"out into the courtyard with the women" } },
    { op:"actor.exit",  target:"maids",      at:CROSS,   args:{ via:"threshold", note:"over the sill under guard" } },
    // 3. the yard: the dead laid at the wall, then the paving on their knees
    { op:"crowd.state", target:"maids",      at:CROSS,   args:{ formation:"carry" } },
    { op:"actor.pose",  target:"telemachus", at:CROSS+6, args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:CROSS+6, args:{ gaze:{ x:-.36, y:.26 } } },
    { op:"prop.state",  target:"kit",        at:SCRUB,   args:{ mode:"scraping" } },
    { op:"crowd.state", target:"maids",      at:SCRUB,   args:{ formation:"scrub" } },
    { op:"sound.cue",   target:"maids",      at:SCRUB,   args:{ src:"yard_mid", cue:"sponges going over the stone, and nobody speaking" } },
    { op:"prop.state",  target:"kit",        at:HERD,    args:{ mode:"sponging" } },
    { op:"crowd.state", target:"maids",      at:HERD,    args:{ formation:"herd" } },
    { op:"actor.pose",  target:"telemachus", at:HERD,    args:{ pose:"pointing_arm" } },
    // 4. the cable, the row, and the lift
    { op:"prop.state",  target:"rig",        at:LINE,    args:{ mode:"looped" } },
    { op:"crowd.state", target:"maids",      at:LINE,    args:{ formation:"line" } },
    { op:"sound.cue",   target:"telemachus", at:LINE,    args:{ src:"order_mark", cue:"no clean death by the sword for these" } },
    { op:"actor.pose",  target:"telemachus", at:WAVE2,   args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"telemachus", at:WAVE2,   args:{ gaze:{ x:-.30, y:-.10 } } },
    { op:"crowd.state", target:"maids",      at:LIFT0,   args:{ formation:"hanged" } },
    { op:"prop.state",  target:"rig",        at:LIFT0,   args:{ mode:"suspended" } },
    { op:"actor.pose",  target:"telemachus", at:LIFT1,   args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"telemachus", at:LIFT1,   args:{ gaze:{ x:-.20, y:-.16 } } },
    // 5. the goatherd
    { op:"actor.pose",  target:"melanthius", at:LOWER0,  args:{ pose:"m22_caught" } },
    { op:"actor.gaze",  target:"melanthius", at:LOWER0,  args:{ gaze:{ x:.52, y:-.10 } } },
    { op:"actor.pose",  target:"melanthius", at:LOWER1,  args:{ pose:"m22_truss" } },
    { op:"actor.pose",  target:"telemachus", at:LOWER1,  args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:LOWER1,  args:{ gaze:{ x:-.46, y:.30 } } },
    { op:"sound.cue",   target:"telemachus", at:KILL,    args:{ src:"block", cue:"and that was the last of the goatherd" } },
    { op:"timeline.capture", target:"OD-B22-S07", at:100.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const yard   = blockingAt(courtyard, YARD_MOVES, t, YARD_INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);   // deterministic idle phase
    const prog   = clamp01(0.10 + 0.86 * (t / D));
    const inHall = t < CROSS;
    const ms     = maidsAt(t);
    const draw   = [];

    if (inHall){
      /* --- ROOM ONE: the megaron, still `aftermath`, on S06's layers (B) --- */
      placeInstance(offctx, W, H, field, {
        anchor:{ x:.50, y:.99 }, scale:1.0,
        state:{
          state:"aftermath", t:breath,
          layers:["shell","roof","farwall","doors","sill","racks","postern",
                  "maidsdoor","pillars","lane","hearth","axes","litter"],
          status: t < NAME  ? "SEND FOR THE WOMEN"
                : t < ORDER ? "TWELVE OF THE FIFTY"
                :             "CARRY THEM OUT",
          progress: prog,
        },
      });

      /* MELANTHIUS — hanging where S04, S05 and S06 left him, on the same
         computed lift, sorting behind the store door (S05 note H). */
      {
        const p = blk.melanthius, lift = hoistExtra(H, p);
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

      /* THE HUDDLE — one instance, twelve women, box solved off the `maids`
         key's OWN blocked station every frame, so the group the plan is
         tracking and the group on the canvas are the same group; not drawn
         until the nurse has fetched them (note E). */
      if (t >= NAME){
        const p = blk.maids;
        const r = huddleRect(W, H, p);
        const e = blk.eurycleia;
        const focus = { x:(e.x * W - r.x) / r.w, y:(e.y * H - r.y) / r.h };
        draw.push({ d:p.d, run(){
          blitMaids(offctx, r, { ...ms, focus, zoom:HUD.zoom,
                                 t:Math.min(.98, t / D), progress:prog });
        }});
      }

      /* TELEMACHUS — off the near floor at t=8 so a 520px row can run across
         it, and at the sill by the time the women are brought in (note H). */
      {
        const p = blk.telemachus, s = st.telemachus || {};
        const ordering = t >= ORDER;
        draw.push({ d:p.d, run(){
          placeFigure(offctx, W, H, telemachus, {
            anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
            state:{
              t:breath, band:"threeq",
              pose: s.pose || "three_quarter_left",
              gaze: s.gaze || { x:-.30, y:.24 },
              browKnit: ordering ? .62 : .40,
              eyeNarrow:ordering ? .48 : .28,
              jaw:      ordering ? .34 : .08,
              frown:    .26,
              status: t < NAME  ? "WAITING ON THE NURSE"
                    : ordering  ? "CARRY THEM OUT"
                    :             "WHICH OF THEM",
              progress: prog,
            },
          });
        }});
      }

      /* EURYCLEIA — at the women's door, which is where the twelve come from
         and where she names them. Not mirrored: the rig's directive poses are
         authored to screen LEFT and the whole hall is to her left from x .787. */
      {
        const p = blk.eurycleia, s = st.eurycleia || {};
        const naming = t >= NAME && t < ORDER;
        draw.push({ d:p.d, run(){
          placeFigure(offctx, W, H, eurycleia, {
            anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
            state:{
              t:breath, band:"threeq",
              pose: s.pose || "eury_clasp",
              gaze: s.gaze || { x:-.36, y:.18 },
              browUp:   naming ? .68 : .40,
              browKnit: naming ? .40 : .30,
              eyeWide:  naming ? .46 : .10,
              jaw:      naming ? .34 : 0,
              frown:    t >= ORDER ? .34 : .16,
              status: t < NAME  ? "FETCHED FROM THE WOMEN'S ROOMS"
                    : naming    ? "TWELVE WENT THEIR OWN WAY"
                    :             "NOT A WORD",
              progress: prog,
            },
          });
        }});
      }

      /* ODYSSEUS — he never leaves the megaron (note H). One guise, no mirror:
         the door he is speaking to is on his right, and that is a gaze. */
      {
        const p = blk.odysseus, s = st.odysseus || {};
        const calling = t >= 4 && t < NAME;
        draw.push({ d:p.d, run(){
          placeFigure(offctx, W, H, odysseus, {
            anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
            state:{
              t:breath, guise:"restored", band:"threeq",
              pose: s.pose || "three_quarter_left",
              gaze: s.gaze || { x:-.34, y:.40 },
              browKnit: .52, eyeNarrow:.40, mouthAsym:.22,
              jaw: calling ? .38 : .12,
              frown: t >= ORDER ? .30 : .12,
              status: calling      ? "CALL THEM IN"
                    : t < ORDER    ? "NAME THEM"
                    :                "TAKE THEM OUT OF MY SIGHT",
              progress: prog,
            },
          });
        }});
      }

    } else {
      /* --- ROOM TWO: the yard. The ensemble IS the field (note C). -------- */
      blitMaids(offctx, { x:0, y:0, w:W, h:H },
                { ...ms, focus:{ x:courtyard.at("order_mark").x, y:0.62 },
                  t:Math.min(.98, t / D), progress:prog,
                  seed:2207 });

      /* MELANTHIUS — brought out of the store and lowered onto the paving by
         the same crown measurement the hall hoisted him by (note I). */
      if (t >= LOWER0){
        const p = yard.melanthius, s = st.melanthius || {};
        const u = ramp(t, LOWER0, LOWER1);
        const lift = lowerExtra(H, p, u);
        const dead = t >= KILL;
        draw.push({ d:p.d, run(){
          placeFigure(offctx, W, H, melanthius, {
            anchor:{ x:p.x, y:p.y - lift / H }, scale: K * p.scale,
            state:{
              t:breath, band:"threeq",
              pose: s.pose || "m22_caught",
              gaze: s.gaze || { x:.44, y:.10 },
              bound:1, hoist:1 - u, suspension:"cord",
              blink:   dead ? 1 : 0,
              browUp:  dead ? .10 : .74,
              browKnit:dead ? .30 : .44,
              eyeWide: dead ? 0 : .58,
              jaw:     dead ? .46 : .38,
              frown:   dead ? .52 : .30,
              status: dead     ? "THE LAST OF THE GOATHERD"
                    : u < .999 ? "COMING DOWN"
                    :            "ON THE PAVING",
              progress: prog,
            },
          });
        }});
      }

      /* TELEMACHUS — foreground, nearer and lower and bigger than the row,
         which is the only way a named body reads against twelve (note H). */
      {
        const p = yard.telemachus, s = st.telemachus || {};
        const rigging = t >= LINE && t < LIFT1;
        const done    = t >= LIFT1;
        draw.push({ d:p.d, run(){
          placeFigure(offctx, W, H, telemachus, {
            anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
            state:{
              t:breath, band:"threeq",
              pose: s.pose || "confrontation",
              gaze: s.gaze || { x:-.36, y:.26 },
              browKnit: rigging ? .70 : .52,
              eyeNarrow:rigging ? .54 : .34,
              jaw:      rigging ? .40 : .10,
              frown:    done ? .40 : .28,
              status: t < SCRUB ? "OUT AND ALONG THE WALL"
                    : t < HERD  ? "WORK IT UNTIL IT IS STONE AGAIN"
                    : t < LINE  ? "INTO THE ROW"
                    : rigging   ? "NOT BY THE SWORD"
                    : t < KILL  ? "IN A ROW"
                    :             "THE HOUSE IS CLEAN",
              progress: prog,
            },
          });
        }});
      }
    }

    draw.sort((a, b) => a.d - b.d).forEach(x => x.run());

    /* --- THE WINDOW. One at a time, in one rectangle (notes F, G). -------- */
    if (t < LINE){
      const k = toolsAt(t);
      detailField(offctx, W, H, TOOL_DST);
      plate(offctx, W, H, tools, TOOL_CW, TOOL_CH, TOOL_WIN, TOOL_DST,
            { ...k, focus:null, t:breath, status:k.mode.toUpperCase(),
              progress:k.clean },
            `kit|${k.mode}|${Math.round(k.clean * 20)}`);
      detailRule(offctx, W, H, TOOL_DST);
    } else {
      const mode = t < LIFT0 ? "looped" : "suspended";
      const load = t < LIFT0 ? 0 : ramp(t, LIFT0, LIFT1);
      detailField(offctx, W, H, CBL_DST);
      plate(offctx, W, H, cable, CBL_CW, CBL_CH, CBL_WIN, CBL_DST,
            { mode, loops:12, load, t:breath,
              status:mode.toUpperCase(), progress:prog },
            `cbl|${mode}|${Math.round(load * 20)}`);
      detailRule(offctx, W, H, CBL_DST);
    }
  },
};
export default scene;

/* named binding so OD-B22-S08 can `import { exitOccupancy as INITIAL }`.
   S08 plays in this same hall and every station below is a megaron station, so
   it needs no translation table. */
export const exitOccupancy = scene.exitOccupancy;

/* and the yard, recorded the same way, so the row of twelve is structured
   state and not prose (note A). */
export const exitYardOccupancy = occupancyAt(courtyard, YARD_MOVES, D, YARD_INITIAL);
