/* ============================================================
   SCENE  OD-B21-S02 — The Contest Is Set                   (Od. 21.63–139)
   Book XXI, scene 2. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its immediate
   predecessor OD-B21-S01, whose exit occupancy this scene imports.

   Beats (causal order, one master clock):
     1. Penelope names the terms: she will marry whoever strings the bow of
        Iphitus and shoots an arrow through all twelve axe heads.
     2. Eumaeus and Philoetius weep at the sight of their master's weapon;
        Antinous rebukes them for it in front of the whole hall.
     3. Telemachus cuts one long trench down the spine of the floor and plants
        the twelve axes in it, in a dead-straight line, and takes up the bow.
     4. Three times he tries it. On the fourth he nearly has it strung — and
        his father, the beggar in the near corner, shakes his head at him.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ONE ROOM, ONE PLAN, NOTHING HAND-PLACED. Every body in this scene is
      resolved through scenes/_plans/megaron.mjs by STATION NAME, and no
      coordinate is invented anywhere in the file. No local plan is authored
      because the scene never leaves the hall: there is exactly one room and it
      already has a plan. The whole scene is a table of moves between named
      stations; `blockingAt()` does the arithmetic.

   B. THE ROOM IS STATE, AND THE STATE IS THE THIRD BEAT (brief note D). The
      hall is `location.megaron-hall`, cast ONCE, and its `state` channel does
      the work the atlas would otherwise ask a second location to do:
        · `feast` for the first act — Apollo's feast day, the tables still
          laden, exactly as OD-B20-S03 dressed the room and OD-B21-S01 left it;
        · `contest` from TRENCH=44 — the state whose own name is this book:
          benches and tables shoved back to the walls, the fire raked flush,
          the doors shut, and the TRENCH cut down the spine.
      And the twelve axes are the same room's `axes` LAYER, held back until
      ALIGNED=65. That is the point worth reading twice: the room draws its
      trench under `contest` and its axes under a layer, so dropping the layer
      for seventeen seconds gives a cut, empty trench with nothing in it yet —
      the son digging — and restoring it stands the twelve up in the sockets
      the room itself decided. The count and the line are the ROOM's, placed by
      `megaron.ray("axe_first","axe_last",u)`, which is the same ray the arrow
      flies down in S06. Nothing here builds or casts a second hall, a second
      trench, or a second set of axes.
      `racks` stays dropped, as in S01: the spears and shields came off these
      walls in Book XIX and are lying in the arms store.

   C. THE TWELVE ARE COUNTED ONCE, ANYWHERE IN THE FRAME. Three different
      modules in this repo can draw twelve axe heads, so the rule here is that
      only one of them ever has them at a time:
        · `prop.twelve-axe-heads` (mode `stored`, the chest with the lid thrown
          back and the heads flat in two courses of six) is the chest S01 set
          down at `axe_first`. It is drawn from t=0 until CLEAR0=30 and then
          never again — the heads are out of it, and a chest still full of them
          standing beside a planted line would be a lie about how many there
          are. Its occupancy goes back to `storeroom`, where it came from.
        · the ROOM has them from ALIGNED on, planted, on the plan's own ray.
        · `set_piece.axe-alignment-lane` never draws its lane in this frame at
          all (note D).
      So the frame holds twelve axe heads at every moment: in the chest, then
      in the floor.

   D. THE ALIGNMENT LANE IS TWO VERIFICATION WINDOWS, NOT A SECOND LANE (the
      B20-S03 / B21-S01 window idiom). `set_piece.axe-alignment-lane` is a
      whole-frame INSTRUMENT: it lays its own lane diagonally across its canvas
      near-left to far-right, with a sightline, an arrow, a stance plate, a
      count block of seven-segment numerals, and two verification insets. Cast
      whole into this room it would print a SECOND axe line, at a different
      angle from the one the plan owns, and its numerals would fall to ~20px
      and dissolve in the dot lattice. So it is blitted through TWO declared
      windows, one at a time, and its own lane, arrow, count and stance plate
      are cropped out on purpose:
      the SOCKET SECTION: one axe cut through — blade, eye, lug, haft, the
      socket cavity with its hatch, the planting-depth bracket, and the eye
      datum with its pass-through arrow — in the top right, from the moment the
      spade goes in. Draft 1 also called out the module's APERTURE inset (the
      twelve heads nested one inside the next), and it was cut: its own geometry
      is typed in FIXED PIXELS against a 660x880 canvas (`AXE_PX(k, W=660,
      H=880)` ignores the canvas it is drawn on), so it is a tall thin stack of
      four concentric silhouettes that at any size a hall frame can spare reads
      as a totem rather than as a hole. The section survives because it is the
      one drawing in the module that says what this beat is: a head planted
      haft-down in a socket, at a stated depth, with its eye on a datum.
      ONE window, ONE slot, and the STATE does the rest: the module draws the
      eye datum and the pass-through arrow only when its sightline is lit, so
      `laid` -> `aligned` at ALIGNED makes the proof appear inside the same
      panel — the line being proved, in the window, on the frame it is proved
      on. The window is 1:1 with the module's own design size, so its 4–5.5px
      rules stay 4–5.5px. Every numeral in the module — the seven-segment "12"
      and its tally comb at x .078–.435, y .775–.900 — falls outside it, along
      with the module's own lane, sightline rule, stance plate, mark and arrow.
      Nothing in this scene depends on type at all.

   E. WHY NOBODY STANDS ON THE SPINE OR THE SILL. Homer puts Telemachus on the
      threshold to try the bow, and the first layout did that. It fails for a
      measured reason: the plan's axe line is at plan x .500 for its whole
      length, so it projects to frame x .500 at every depth, and the head of
      the line (`axe_first`, z .28) has its ring at y .531 with its helve base
      at y .616 — that is, straddling the ankles of anybody standing at
      `threshold` (feet y .564) or `door_main` (feet y .531). A figure is drawn
      after the room, so his shins take the ring off the farthest axe, and the
      count is plot. The same is true at the near end: a body at `shot_mark` or
      `throne` (feet y .862 / .891) covers the four nearest and biggest axes
      outright.
      So the lane and the sill are kept EMPTY for the whole scene, and the four
      attempts are staged at the right-hand roof-pillar, mirroring the queen at
      the left-hand one — which also turns him to face the suitors he is
      performing for, and hands S03 a clear sill and a clear lane, which is
      what the rest of the book is about. Telemachus is on the spine only while
      he is digging and planting it, which is the one time a body belongs there,
      and the `axes` layer is off for every frame of it.
      TWO THINGS ABOUT THAT LANE ARE THE ROOM'S DECISION AND ARE LEFT ALONE.
      The plan runs the trench from z .24 to z .78 straight through the hearth
      ring (z .445–.595), so walking the line means walking through the hearth —
      which is why the room rakes its fire FLUSH in `contest` and why the beat is
      staged in that state and no other; and because the line is at plan x .500
      for its whole length it projects to frame x .500 at every depth, so the
      twelve print as one receding column of rings about 0.03 of the frame wide
      rather than as twelve separate axes. That is the geometry the arrow needs
      in S06 and it is not something a scene may re-improvise. What the scene can
      do is say what the shape of one of them is, at a size that survives the dot
      lattice — which is exactly what the section window is for (note D).

   F. THE BOW CHANGES HANDS WITHOUT SLIDING ACROSS THE FLOOR. `prop.odysseuss-
      bow` is placed off its CARRIER's live blocked box, never off an anchor of
      its own, so it cannot drift off the body that is holding it:
        · 0 -> LAY=30 in Penelope's hands, mode `carried` — the state
          OD-B21-S01 handed over, minus the quiver, which is kept in the prose
          and in `attachments` but not drawn (see the note on it below).
        · LAY -> TAKE=68 NOT DRAWN. She sets both down; the hall looks at them
          on the floor; he picks the bow up. A weapon gliding across a floor
          with nobody's hands on it is worse than one that arrives between two
          shots (S01's own rule, applied to its own prop).
        · TAKE -> D in Telemachus's hands, mode `carried`, at the hip on
          the near side of his body, so the crescent runs over paper and over
          his own light tunic rather than over the shut doors.
      The bow is NEVER put in mode `strung`. He does not string it; that is the
      content of the scene. The strain is carried by his pose and by the status
      word, and the weapon stays reflexed with its string coiled off one ear.

   G. SIX BODIES, ONE FLOOR, SORTED BY THE PLAN'S OWN Z. Draw order is not
      written down here; it is COMPUTED every frame from the live blocked depth
      of each body, so Telemachus is behind Antinous while he stands at the
      right pillar (z .44) and in front of him while he is planting the near end
      of the line (z .74) — the same walk, the right occlusion at both ends.
      The six stations were chosen for separation in the projection, not on the
      plan: measured through `project()`, their ink intervals in frame width are
        odysseus  `corner_dead`  .045–.201   eumaeus    `postern`      .199–.309
        penelope  `pillar_l`     .276–.400   telemachus `pillar_r`     .600–.724
        philoetius`doorway_maid` .726–.848   antinous   `stair_up`     .766–.908
      which is a left three and a right three with one 3%-of-frame overlap on
      each side and a clear 0.20 of frame down the middle for the lane. Draft 1
      had Antinous on `bench_r1` and the cowherd on the stair, and it failed for
      a reason worth keeping: Antinous then stood at z .62 with his ink from
      .681, in FRONT of both the son and the son's bow, and the climax of the
      scene printed behind the head of the man watching it. He is moved back to
      the foot of the queen's stair, which is the one clear near-right ground
      that starts outboard of the bow, and the cowherd takes the servants' door.
      No two faces are within a head of each other; the only overlaps left are
      Antinous over the lower body of the herdsman he is rebuking and the son's
      bow over the far shoulder of that herdsman, both correct in depth. Nobody
      shares a station with anybody, at any time on the clock.

   H. WHO IS NOT DRAWN, AND WHY THAT IS NOT A HOLE.
        · THE TWO WOMEN. `maids` are inherited at `doorway_maid` and are moved
          off it, through the postern to `storeroom`, with the emptied chest
          between them (CLEAR0=30 -> CLEAR1=36). They are not drawn, which is
          the state S01 itself ends in (it stops drawing them at t=77 of 78):
          `ensemble.loyal-maids` returns member heights in ABSOLUTE pixels, so
          it is right at exactly one size — its own — and the one wall this hall
          had to spare for a 1:1 window is the wall the alignment window is on.
          Their one action here, taking the chest back up the passage, happens
          off frame, which is how S01 emptied the crate too. They are still
          carried in the occupancy and handed on to S03, at `storeroom`.
        · THE CROWD. `ensemble.the-suitors` is not cast. Its deep row prints on
          the baseline of `bench_l1`/`bench_r1` — where two of these six bodies
          stand — at 0.60 of a size that is not this plan's, and its front row
          is the near-solid black band across the bottom third that S01 had to
          drop. With six named figures, a planted axe line and two windows
          already on this floor, adding it would cost the frame its paper and
          its scale at once. The suitors are carried by the room (the `feast`
          tables and, from TRENCH, the benches shoved to the walls they are
          sitting on) and by ANTINOUS, who is their voice in this beat and is
          cast as a body.

   I. TONE. Both room states are placed at lift 0 — the dark states (`night`,
      `battle`, `aftermath`) are Book XXII's and are never touched here — and
      the room gets LIGHTER as the scene runs, not darker: `contest` clears the
      laden tables and the feast litter out of the near floor at TRENCH and
      leaves cut stone, a raked hearth and twelve rings. No hand-drawn ctx
      overpaint is added to any figure anywhere in this file; every mark on
      every body is the shared rig plus that character's own module.

   CONTINUITY IN — computed, not asserted:
     import { exitOccupancy as INITIAL } from "./OD-B21-S01.mjs";
   which is { penelope:"pillar_l", maids:"doorway_maid", axes:"axe_first" } —
   all three of them megaron stations, so no translation table is needed
   (S01 ends in this same room). Nobody is dropped. The three bodies this
   scene adds — telemachus, eumaeus, philoetius, antinous, odysseus — are
   declared from the plan by name in ADDED, and merged in.

   CONTINUITY OUT — computed from the plan, never written:
     { penelope:"pillar_l", maids:"storeroom", axes:"storeroom",
       telemachus:"pillar_r", eumaeus:"postern", philoetius:"doorway_maid",
       antinous:"stair_up", odysseus:"corner_dead" }

   Verify (the terms and the weeping; the planting; the fourth attempt):
     node harness/render-scene.mjs scenes/OD-B21-S02.mjs --t 20
     node harness/render-scene.mjs scenes/OD-B21-S02.mjs --t 52
     node harness/render-scene.mjs scenes/OD-B21-S02.mjs --t 72
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import hall        from "../assets/location/megaron-hall.mjs";
import penelope    from "../assets/character/penelope.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import eumaeus     from "../assets/character/eumaeus.mjs";
import philoetius  from "../assets/character/philoetius.mjs";
import antinous    from "../assets/character/antinous.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import bow         from "../assets/prop/odysseuss-bow.mjs";
import chest       from "../assets/prop/twelve-axe-heads.mjs";
import lane        from "../assets/set_piece/axe-alignment-lane.mjs";

/* CONTINUITY IN — the previous scene's computed exit occupancy. */
import { exitOccupancy as PREV_EXIT } from "./OD-B21-S01.mjs";

const HALL_ASSET = "location.megaron-hall";
const D = 88;

/* ---- THE CLOCK ---------------------------------------------------------- */
const TERMS   = 4;    // "the man who strings it and shoots through the axes"
const SEEN    = 11;   // the two herdsmen take in what she is holding
const WEEP    = 14;   // and weep over their master's weapon
const REBUKE  = 22;   // Antinous rebukes them in front of the hall
const LAY     = 30;   // she sets the bow and the quiver down; hands empty
const CLEAR0  = 30, CLEAR1 = 36;   // the emptied chest goes back to the passage
const SPADE0  = 34, SPADE1 = 41;   // Telemachus takes the spade to the near end
const TRENCH  = 44;   // >>> the hall goes `contest`: cleared, and the trench cut
const PLANT0  = 48, PLANT1 = 62;   // he plants the twelve, walking up the line
const BACK0   = 62, BACK1 = 68;    // and steps off the lane to the right pillar
const ALIGNED = 65;   // >>> the `axes` layer: the twelve stand on one line
const TAKE    = 68;   // he takes up the bow
const TRY1 = 70, TRY2 = 74, TRY3 = 78, TRY4 = 82;
const SIGNAL  = 85;   // the beggar shakes his head; the boy gives it up

/* ---- THE ROOM (note B) --------------------------------------------------
   `racks` dropped, as in S01 — the arms are in the store since Book XIX.
   `axes` is held back until the twelfth is in the ground. */
const HALL_BASE = ["shell","roof","farwall","doors","sill","postern","maidsdoor",
                   "stair","pillars","lane","hearth","furniture","litter","throne"];
const hallLayers = t => t >= ALIGNED ? [...HALL_BASE, "axes"] : HALL_BASE;
const hallState  = t => t >= TRENCH ? "contest" : "feast";

/* ---- CONTINUITY IN + the bodies this scene adds (note A) ---------------- */
const ADDED = {
  telemachus:"pillar_r",     // the son, at the right-hand roof pillar
  eumaeus:"postern",         // the swineherd, by the side door
  philoetius:"doorway_maid", // the cowherd, at the mouth of the servants' door
  antinous:"stair_up",       // the suitors' voice, at the foot of her stair
  odysseus:"corner_dead",    // the beggar, apart, nearest the camera
};
const INITIAL = { ...PREV_EXIT, ...ADDED };

/* ---- BLOCKING. Stations, not coordinates (notes A, E, G). ---------------- */
const MOVES = [
  /* the emptied chest goes back where S01 brought it from, and the two women
     who carried it in go with it — off frame, both of them (note H). They MUST
     move: S01 stood them off at `doorway_maid`, and `doorway_maid` is the one
     clear standing ground on the right of this plan, so the cowherd is on it.
     Leaving them there would hand S03 two entries on one station, which is the
     collision the plan exists to prevent — and a prop travelling with its own
     carriers to one station is S01's own idiom (its `maids` and `axes` both
     resolve to `axe_first` while the chest is between them). */
  { who:"maids",      from:"doorway_maid", to:"storeroom", t0:CLEAR0, t1:CLEAR1 },
  { who:"axes",       from:"axe_first", to:"storeroom", t0:CLEAR0, t1:CLEAR1,
    kind:"prop" },
  // the son: to the near end of the spine, up the line planting, then off it
  { who:"telemachus", from:"pillar_r",  to:"axe_last",  t0:SPADE0, t1:SPADE1 },
  { who:"telemachus", from:"axe_last",  to:"axe_first", t0:PLANT0, t1:PLANT1 },
  { who:"telemachus", from:"axe_first", to:"pillar_r",  t0:BACK0,  t1:BACK1  },
];

/* ---- THE BOX A BODY IS DRAWN IN (verbatim device from S01) ---------------
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide), and every character module in this repo lays its garment out in
   fractions of its box WIDTH, so a landscape box turns a body into a bell.
   Every figure here is drawn into the PORTRAIT box the atlas uses for
   characters, 660/880, and blitted. FIG_FLOOR is the rig's own floor line:
   figure-hero plants the ankles at 0.90 of its box height. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
/* ONE height for every adult in this room, times the plan's own depth falloff.
   S01 used 0.50 in this hall for a single figure with the floor to herself.
   Six bodies stand on this floor, and 0.46 is the height at which the nearest
   of them (the beggar at `corner_dead`, z .90) is 0.40 of the frame instead of
   0.43 and the architecture still reads over his head. */
const K_HALL = 0.46;

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
   shows between its lines and the plate's frame furniture, headers and numerals
   stay out of frame. `cw`/`ch` is the canvas the drawing is made on; `dst` is
   where the window lands, in frame fractions. */
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
   (Verbatim device from OD-B20-S03 / OD-B21-S01.) */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

/* ---- THE CHEST OF AXE HEADS: mode `stored`, cropped to the chest ---------
   Constants lifted from OD-B21-S01 so this is the same chest, at the same
   crop, on the same station it was set down on. rowGeo(): the row band is
   x .050..912 with pitch (x1-x0)/12, and chest() insets by 0.30 pitch a side
   and runs y .571..725; the window is that box plus a 2% margin. The header,
   the ledger, the caliper and the depth gauge are cropped out on purpose. */
const AXE_CW = 389, AXE_CH = 638;
const AXE_WIN = { x0:.050, y0:.545, x1:.912, y1:.752 };

/* ---- THE QUIVER IS NOT DRAWN, AND THAT IS A MEASUREMENT --------------------
   S01 gave the queen `prop.quiver-and-arrows` beside the bow, cropped to the
   quiver body and its standing bundle of shafts, and it worked there because she
   had a whole store to herself. Solved for this hall it is 0.62 of a body height
   tall and 0.017 of the frame WIDE — a 19px dotted stub against her own skirt,
   with the bow's crescent and her veil arc through it — and an object nobody can
   name is worse than an object that arrives between two shots. It stays in the
   prose exit state and in `attachments`: it comes in with her, it goes down with
   the bow at LAY, and Telemachus never needs it, because he never gets to the
   point of nocking anything. */

/* ---- THE BOW (constants from S01, measured off
   renders/prop__odysseuss-bow__carried.png, 1320x1750): in mode `carried` the
   bow lies on the diagonal of its box, ink (.06,.10)-(.79,.72), and the grip
   block — the ivory plate under the carry strap — is at (.667,.566). */
const BOW_AR   = FIG_AR;
const BOW_H    = 0.88;
const BOW_GRIP = { x:0.667, y:0.566 };
/* WHICH SIDE THE BOW GOES ON, AND WHY IT IS THE RIGHT (measured, draft 2).
   Relative to its grip the `carried` crescent reaches 0.607 of its box width
   to the LEFT and only 0.123 to the right, so the side the grip sits on decides
   which plane the whole weapon prints against. Put on the far/LEFT hand — S01's
   rule, correct in the arms store — it landed here on the postern door's plane
   and the swineherd's hide cloak for the queen, and on the great doors' shut
   panel for the son, and in draft 1 it was invisible in BOTH frames. It goes on
   the NEAR/RIGHT hand instead, 0.19 of a body height outboard — her own
   half-width plus a hand's breadth — so the crescent sweeps back across the
   LIGHT face of the roof-pillar each of them is standing at (the pillars are
   the lightest vertical planes in this room) and across the figure's own light
   veil or tunic, where a hard black contour reads. Both are drawn AFTER their
   carrier for exactly that reason.
   AND IT IS CARRIED LOW, BY BOTH OF THEM. Draft 2 held it at chest height and
   the cup of the crescent closed round the son's head and round the queen's
   veil: the bow's ink stands 0.47 of its box ABOVE its own grip, so a grip at
   0.55 of a body height puts the upper ear level with the crown, and the arc,
   the head, the pillar edge and the wall rail all crossed in the same 60px.
   The grip goes at 0.16 of a body height instead — hip height, which is where a
   man braces a bow he cannot bend and where anyone carrying a 1550mm weapon
   actually holds it — and that drops the whole crescent onto the lit floor
   plane, clear under every head in the frame. It is the same offset for both
   carriers: one rule, no per-figure nudge. */
const BOW_OUT  = 0.19;      // outboard of the spine: half-width + a hand
const BOW_LOW  = 0.16;      // hip height

/* ---- THE TWO ALIGNMENT WINDOWS (note D) ---------------------------------
   The module is drawn on its own design canvas, 660x880, because its inset
   geometry is typed in pixels against exactly that size (`AXE_PX(k, W=660,
   H=880)`) and does not scale with the canvas; both windows are then laid down
   at 0.72 of 1:1, which keeps its 4–5.5px rules at 3–4px.
     SECTION  declared box x .455–.940, y .700–.935; ink measured x .580–.926,
              y .724–.908 (floor breaks, socket cavity and hatch, planting-depth
              bracket, haft, blade, lug, eye, datum dashes, pass-through arrow).
              Window = the box + a margin, so its corner brackets survive.
     APERTURE declared box x .058–.318, y .085–.360; ink x .073–.303,
              y .091–.347 (four nested heads, the clear hole, three datum
              ticks). Window = the box + a margin.
   Both windows exclude the module's own lane, sightline rule, stance plate,
   mark, arrow and count block. Their destinations are solved to clear every
   head in the frame: the section's bottom edge sits at y .280 against the
   swineherd's crown at .320, the aperture's at y .320 against the cowherd's
   at .434. */
const LANE_CW = 660, LANE_CH = 880;
const SEC_WIN = { x0:.437, y0:.684, x1:.958, y1:.951 };
const SEC_DST = { x0:.700, y0:.055, x1:.961, y1:.318 };
const SEC_IN  = SPADE1;
const laneState = t => ({
  /* `laid` -> `aligned` on the same window: the module draws the eye datum and
     the pass-through arrow only when the sightline is lit, so the state change
     IS the proof appearing in the section — one instrument, one slot, two
     states, and no second lane anywhere in the frame. */
  layers: t >= ALIGNED ? ["section","sightline"] : ["section"],
  t:0.5, arrowQ:-0.075,
  status: t >= ALIGNED ? "ALIGNED" : "PLANTED",
  progress: t >= ALIGNED ? .55 : .28,
});

export const scene = {
  id:"OD-B21-S02",
  title:"The Contest Is Set",
  book:21,
  plan:"megaron",
  duration:D,
  beats:[
    "Penelope names the terms: she marries the man who strings the bow and shoots through all twelve axes.",
    "Eumaeus and Philoetius weep at the sight of their master's weapon; Antinous rebukes them for it.",
    "Telemachus cuts one long trench down the spine of the floor and plants the twelve axes in a straight line.",
    "He tries the bow three times; on the fourth he nearly strings it, and Odysseus signals him to stop.",
  ],
  exitState:
    "Late on the afternoon of Apollo's feast day, in the megaron, which is now " +
    "in its CONTEST state: the tables and benches are shoved back against the " +
    "walls, the hearth is raked flush, the great doors are shut, and one long " +
    "trench is cut down the spine of the floor from `axe_first` to `axe_last` " +
    "with the twelve axe heads planted haft-down in it, every socket eye at one " +
    "height on one line — the line `megaron.ray(\"axe_first\",\"axe_last\",u)`, " +
    "which is the line the arrow will travel. The chest they came in is back at " +
    "the mouth of the arms passage (`storeroom`), empty. Telemachus stands at " +
    "the right-hand roof-pillar (`pillar_r`) with the bow of Iphitus in his " +
    "hands, still unstrung and still reflexed with its string coiled off one " +
    "ear: he has tried it three times and on the fourth he had it all but bent " +
    "when his father, the beggar sitting apart in the near corner " +
    "(`corner_dead`), shook his head at him — so he has set the butt down and " +
    "given it up, and says he is too weak, and calls on the suitors to try. " +
    "Penelope holds the left-hand roof-pillar (`pillar_l`) with her hands " +
    "empty; the quiver of arrows she carried in lies where she set it down. " +
    "Eumaeus is by the side door (`postern`) and Philoetius at the mouth of " +
    "the servants' door (`doorway_maid`), both of them wept out and both " +
    "rebuked; Antinous is at the foot of the queen's stair (`stair_up`) with " +
    "the suitors behind him, and it is his turn next. The two women who " +
    "carried the axe chest in are gone with it, back through the postern to the " +
    "mouth of the arms passage (`storeroom`), off the floor and out of the " +
    "lane. THE SILL " +
    "(`threshold`) AND THE WHOLE LANE ARE EMPTY, and nothing has been shot.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    penelope:"none — she is already at `pillar_l`, inherited from S01",
    telemachus:"already in the hall; enters the LANE at `axe_last` (SPADE1=41) " +
               "and leaves it at `axe_first` (BACK0=62)",
    eumaeus:"already in the hall at `postern`, come up from the farm in XX",
    philoetius:"already in the hall at `doorway_maid`",
    antinous:"already in the hall at `stair_up`",
    odysseus:"already in the hall at `corner_dead`, in guise `beggar` since XVII",
    maids:"none — inherited at `doorway_maid`; they leave with the chest",
  },
  exits:{
    penelope:"none — she holds `pillar_l` into S03",
    telemachus:"none — he holds `pillar_r` with the bow in his hands",
    eumaeus:"none", philoetius:"none", antinous:"none — he is next to try",
    odysseus:"none — he holds `corner_dead`",
    axes:"the emptied chest goes back to `storeroom` (CLEAR0=30), off frame",
    maids:"out through the postern with it, to `storeroom` — off the floor",
    bow:"none — it stays in Telemachus's hands into S03",
  },
  walkable:"the megaron's walkable band, MINUS four things: the hearth ring " +
           "(plan x .395–.605, z .445–.595); the bench and table stations, " +
           "which in `feast` paint laden furniture through a standing body and " +
           "in `contest` are shoved 0.07–0.12 outboard against the walls; the " +
           "LANE itself (plan x .472–.528, z .24–.78), which is walked only by " +
           "Telemachus and only while the `axes` layer is off; and the SILL " +
           "(`threshold`) with `door_main`, which are kept empty for the whole " +
           "scene because a body standing there takes the ring off the far " +
           "axe (note E).",
  depthOrder:"ONE queue, computed every frame from each body's live blocked z " +
             "and sorted far->near: the room paints the field, then the chest " +
             "(z .28), then the six bodies in whatever order their own depths " +
             "put them that second — which is why Telemachus is behind Antinous " +
             "at the right pillar (z .44) and in front of him at the near end " +
             "of the trench (z .74) — then what each of them carries, painted " +
             "immediately after its carrier, then the two alignment windows, " +
             "which are overlays and are always last.",
  gazeTargets:{
    penelope:"level at the hall while she names the terms, down at the weapon " +
             "as she sets it down, then across at her son for the four attempts",
    telemachus:"his mother, then Antinous, then down at the trench and the " +
               "sockets, then the bow in his hands, then — on the last beat — " +
               "down and left, at the beggar in the corner",
    eumaeus:"the bow in the queen's hands, then the floor, then away from Antinous",
    philoetius:"the bow, then the floor, then the boy on the pillar",
    antinous:"the two weeping herdsmen, then the bow, then the boy",
    odysseus:"his son, without a break, from the first frame to the last",
  },
  attachments:[
    { at:0,      who:"penelope",   change:"prop.odysseuss-bow at her grip, mode " +
      "`carried`, carried low at the hip — the state S01 handed over, with the " +
      "quiver of arrows in her other hand (not drawn: note on the quiver above)" },
    { at:LAY,    who:"penelope",   change:"both leave her hands: the bow and the " +
      "quiver go down on the floor and the bow is NOT drawn again until it is " +
      "picked up (note F)" },
    { at:CLEAR0, who:"axes",       change:"the chest is empty; the two women take " +
      "it up and carry it back through the postern to `storeroom` — off frame, " +
      "because a chest still full of heads standing beside a planted line would " +
      "be a lie about the count. `maids` and `axes` travel together and hold " +
      "the same station at the end, the way a carried thing does" },
    { at:PLANT0, who:"telemachus", change:"the twelve heads go into the trench, " +
      "haft-down, one every step as he walks up the line" },
    { at:ALIGNED,who:"hall_01",    change:"the room's `axes` layer comes on: the " +
      "twelve stand in their sockets on the plan's own ray" },
    { at:ALIGNED,who:"lane_01",    change:"state `laid` -> `aligned`; the window " +
      "changes from the socket section to the aperture" },
    { at:TAKE,   who:"telemachus", change:"prop.odysseuss-bow attaches at his " +
      "grip, mode `carried`, on the far side of his body" },
    { at:SIGNAL, who:"telemachus", change:"the butt goes down; his hands stay on " +
      "it but the strain comes off" },
  ],
  sound:[
    { at:TERMS,   source:"pillar_l",   cue:"the terms, named once, in a level voice" },
    { at:WEEP,    source:"postern",    cue:"two grown men crying, badly, at the side of the room" },
    { at:REBUKE,  source:"stair_up",   cue:"one voice over them, pleased with itself" },
    { at:LAY,     source:"pillar_l",   cue:"horn and sinew set down on stone" },
    { at:CLEAR1,  source:"storeroom",  cue:"an empty chest going back up the passage" },
    { at:TRENCH,  source:"axe_last",   cue:"bronze into packed earth; the tables going back to the walls" },
    { at:PLANT0,  source:"axe_last",   cue:"twelve helves tamped home, one at a time, evenly" },
    { at:ALIGNED, source:"axe_first",  cue:"nothing — the whole hall looking down one line" },
    { at:TRY1,    source:"pillar_r",   cue:"a young man's breath going out of him" },
    { at:TRY4,    source:"pillar_r",   cue:"horn creaking, and the hall starting to believe it" },
    { at:SIGNAL,  source:"corner_dead",cue:"no sound at all: a beggar moving his head" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:HALL_ASSET, instance:"hall_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"prop.twelve-axe-heads", instance:"axes_01",
      anchor:{x:.50,y:.62}, scale:.22, state:"stored" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.25,y:.60}, scale:.36, band:"threeq", pose:"eum_listen" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.34,y:.69}, scale:.41, band:"threeq", pose:"penelope_plea" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.66,y:.69}, scale:.41, band:"threeq", pose:"lean_forward" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.75,y:.77}, scale:.45, band:"threeq", pose:"three_quarter_right" },
    { asset:"character.philoetius", instance:"philoetius",
      anchor:{x:.84,y:.79}, scale:.46, band:"threeq", pose:"phi_wonder" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.12,y:.91}, scale:.51, band:"threeq", pose:"three_quarter_left" },
    { asset:"prop.odysseuss-bow", instance:"bow_01",
      anchor:{x:.30,y:.62}, scale:.41, state:"carried" },
    { asset:"set_piece.axe-alignment-lane", instance:"lane_01",
      anchor:{x:.15,y:.28}, scale:.22, state:"laid" },
  ],

  timeline:[
    /* 1. the terms */
    { op:"actor.pose",  target:"penelope",   at:0.0,     args:{ pose:"penelope_plea" } },
    { op:"actor.gaze",  target:"penelope",   at:0.0,     args:{ gaze:{ x:.22, y:.02 } } },
    { op:"actor.pose",  target:"eumaeus",    at:0.0,     args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:0.0,     args:{ gaze:{ x:.30, y:.06 } } },
    { op:"actor.pose",  target:"philoetius", at:0.0,     args:{ pose:"phi_wonder" } },
    { op:"actor.gaze",  target:"philoetius", at:0.0,     args:{ gaze:{ x:-.34, y:.08 } } },
    { op:"actor.pose",  target:"telemachus", at:0.0,     args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"telemachus", at:0.0,     args:{ gaze:{ x:-.34, y:.04 } } },
    { op:"actor.pose",  target:"antinous",   at:0.0,     args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"antinous",   at:0.0,     args:{ gaze:{ x:-.30, y:.02 } } },
    { op:"actor.pose",  target:"odysseus",   at:0.0,     args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:0.0,     args:{ gaze:{ x:.42, y:-.10 } } },
    { op:"actor.pose",  target:"penelope",   at:TERMS,   args:{ pose:"penelope_plea" } },
    /* 2. the weeping, and the rebuke */
    { op:"actor.pose",  target:"eumaeus",    at:SEEN,    args:{ pose:"eum_grieve" } },
    { op:"actor.pose",  target:"eumaeus",    at:WEEP,    args:{ pose:"eum_grieve" } },
    { op:"actor.gaze",  target:"eumaeus",    at:WEEP,    args:{ gaze:{ x:.14, y:.46 } } },
    { op:"actor.pose",  target:"philoetius", at:WEEP,    args:{ pose:"phi_weeping" } },
    { op:"actor.gaze",  target:"philoetius", at:WEEP,    args:{ gaze:{ x:-.10, y:.44 } } },
    { op:"actor.pose",  target:"penelope",   at:WEEP,    args:{ pose:"neutral" } },
    { op:"actor.gaze",  target:"penelope",   at:WEEP,    args:{ gaze:{ x:-.12, y:.14 } } },
    { op:"actor.pose",  target:"antinous",   at:REBUKE,  args:{ pose:"jabbing_accusation" } },
    { op:"actor.gaze",  target:"antinous",   at:REBUKE,  args:{ gaze:{ x:-.36, y:-.06 } } },
    { op:"actor.pose",  target:"eumaeus",    at:REBUKE+4,args:{ pose:"eum_ward" } },
    { op:"actor.gaze",  target:"eumaeus",    at:REBUKE+4,args:{ gaze:{ x:.40, y:.10 } } },
    { op:"actor.pose",  target:"philoetius", at:REBUKE+4,args:{ pose:"phi_grievance" } },
    { op:"actor.pose",  target:"telemachus", at:REBUKE+2,args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:REBUKE+2,args:{ gaze:{ x:.30, y:.06 } } },
    /* 3. the bow down, the trench, the twelve */
    { op:"actor.pose",  target:"penelope",   at:LAY,     args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"penelope",   at:LAY,     args:{ gaze:{ x:.06, y:.42 } } },
    { op:"prop.state",  target:"axes_01",    at:CLEAR0,  args:{ mode:"stored" } },
    { op:"actor.pose",  target:"penelope",   at:LAY+4,   args:{ pose:"penelope_grief" } },
    { op:"actor.gaze",  target:"penelope",   at:LAY+4,   args:{ gaze:{ x:.08, y:.34 } } },
    { op:"actor.pose",  target:"telemachus", at:SPADE1,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"telemachus", at:SPADE1,  args:{ gaze:{ x:.02, y:.52 } } },
    { op:"set.state",   target:"hall_01",    at:TRENCH,  args:{ state:"contest" } },
    { op:"set.state",   target:"lane_01",    at:SEC_IN,  args:{ state:"laid" } },
    { op:"actor.pose",  target:"eumaeus",    at:PLANT0,  args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:PLANT0,  args:{ gaze:{ x:.34, y:.30 } } },
    { op:"actor.pose",  target:"philoetius", at:PLANT0,  args:{ pose:"phi_resolve" } },
    { op:"actor.gaze",  target:"philoetius", at:PLANT0,  args:{ gaze:{ x:-.36, y:.26 } } },
    { op:"actor.pose",  target:"antinous",   at:PLANT0,  args:{ pose:"skepticism" } },
    { op:"actor.gaze",  target:"antinous",   at:PLANT0,  args:{ gaze:{ x:-.28, y:.24 } } },
    { op:"set.state",   target:"hall_01",    at:ALIGNED, args:{ state:"contest", layers:"+axes" } },
    { op:"set.state",   target:"lane_01",    at:ALIGNED, args:{ state:"aligned" } },
    /* 4. four attempts, and the head-shake */
    { op:"prop.state",  target:"bow_01",     at:TAKE,    args:{ mode:"carried" } },
    { op:"actor.pose",  target:"telemachus", at:TAKE,    args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"telemachus", at:TAKE,    args:{ gaze:{ x:-.18, y:.30 } } },
    { op:"actor.pose",  target:"telemachus", at:TRY1,    args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"telemachus", at:TRY1,    args:{ gaze:{ x:-.14, y:.34 } } },
    { op:"actor.pose",  target:"penelope",   at:TRY1,    args:{ pose:"neutral" } },
    { op:"actor.gaze",  target:"penelope",   at:TRY1,    args:{ gaze:{ x:.38, y:.02 } } },
    { op:"actor.pose",  target:"telemachus", at:TRY2,    args:{ pose:"reach_forward" } },
    { op:"actor.pose",  target:"telemachus", at:TRY3,    args:{ pose:"lean_forward" } },
    { op:"actor.pose",  target:"telemachus", at:TRY4,    args:{ pose:"both_hands_raised" } },
    { op:"actor.gaze",  target:"telemachus", at:TRY4,    args:{ gaze:{ x:-.10, y:.24 } } },
    { op:"actor.pose",  target:"penelope",   at:TRY4,    args:{ pose:"hands_near_face" } },
    { op:"actor.gaze",  target:"penelope",   at:TRY4,    args:{ gaze:{ x:.34, y:-.02 } } },
    { op:"actor.pose",  target:"antinous",   at:TRY4,    args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"antinous",   at:TRY4,    args:{ gaze:{ x:-.24, y:.02 } } },
    { op:"actor.pose",  target:"odysseus",   at:SIGNAL,  args:{ pose:"rapid_head_shake" } },
    { op:"actor.gaze",  target:"odysseus",   at:SIGNAL,  args:{ gaze:{ x:.44, y:-.14 } } },
    { op:"actor.pose",  target:"telemachus", at:SIGNAL,  args:{ pose:"head_lowered" } },
    { op:"actor.gaze",  target:"telemachus", at:SIGNAL,  args:{ gaze:{ x:-.46, y:.32 } } },
    { op:"timeline.capture", target:"OD-B21-S02", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.10 + 0.84 * (t / D));

    /* --- 1. THE ROOM. One field; it paints the world and everything else keys
       onto it. Placed the way every Book XVI+ scene places this hall — anchor
       (.50,.99), scale 1.0 — so it registers on B18–B21's hall exactly. ----- */
    placeInstance(offctx, W, H, hall, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:hallState(t), t:breath, layers:hallLayers(t),
        status: t >= ALIGNED ? "TWELVE ON ONE LINE"
              : t >= TRENCH  ? "THE TRENCH"
              :                "APOLLO'S FEAST DAY",
        progress:prog,
      },
    });

    /* --- 2. ONE DEPTH QUEUE (note G). Everything that stands on the floor is
       pushed with its live blocked z and drawn far -> near, so an occlusion is
       never a guess about who is in front. ---------------------------------- */
    const queue = [];
    const push = (d, draw) => queue.push({ d, draw });

    /* the chest S01 set down at the head of the line — drawn until the heads
       come out of it, then gone for good (note C) */
    if (t < CLEAR0){
      const a = blk.axes;
      const wF = 0.285 * (a.scale / 0.75);
      const hF = wF * (W / H) * ((AXE_WIN.y1 - AXE_WIN.y0) * AXE_CH)
                              / ((AXE_WIN.x1 - AXE_WIN.x0) * AXE_CW);
      push(a.d, () => propAt(offctx, W, H, chest, {
        x:a.x, y:a.y, wFrac:wF, hFrac:hF,
        cw:AXE_CW, ch:AXE_CH, win:AXE_WIN,
        state:{ mode:"stored", t:0.5, status:"TWELVE", progress:.28 },
        sig:"chest|stored",
      }));
    }

    /* one figure, from the plan, into the portrait box, at the room's one
       height times this station's own depth falloff */
    const figure = (who, mod, extra, statusOf) => {
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
        /* WHAT SHE / HE CARRIES — keyed to this body's live blocked box, so a
           weapon in a hand cannot drift off it (note F). The grip goes in the
           FAR hand, a quarter of a body height outboard of the spine, which is
           a half-width plus a hand's breadth: the crescent then stands almost
           clear of the silhouette and runs over paper instead of over hair and
           cloth. (Offsets verbatim from S01, where they were solved over three
           drafts.) */
        const bodyH = scale * 0.78;
        const holdsBow = (who === "penelope" && t < LAY)
                      || (who === "telemachus" && t >= TAKE);
        if (holdsBow){
          const straining = who === "telemachus" && t >= TRY1 && t < SIGNAL;
          place(offctx, W, H, bow, {
            x: p.x + BOW_OUT * bodyH,
            y: p.y - BOW_LOW * bodyH,
            hFrac: scale * BOW_H, ar:BOW_AR,
            fx:BOW_GRIP.x, fy:BOW_GRIP.y, pad:0.05,
            state:{ mode:"carried", t:0.5, flex:0, owner:3,
                    status: who === "telemachus" ? "UNSTRUNG" : "CARRIED",
                    progress:.18 },
            sig:"bow|carried",
          });
        }
      });
    };

    /* --- 3. THE SIX BODIES ------------------------------------------------ */
    figure("penelope", penelope,
      tt => {
        const naming = tt < WEEP, setting = tt >= LAY && tt < LAY + 4;
        const amazed = tt >= TRY4;
        return {
          mouth: naming ? .55 : 0,
          browUp:   amazed ? .72 : naming ? .40 : .30,
          browKnit: naming ? .34 : setting ? .46 : .24,
          frown:    tt >= LAY + 4 && tt < TRY1 ? .44 : 0,
          eyeWide:  amazed ? .46 : .06,
          jaw:      naming ? .42 : amazed ? .30 : 0,
        };
      },
      tt => tt >= TRY4    ? "HE ALMOST HAS IT"
          : tt >= TRY1    ? "HER SON, TRYING"
          : tt >= LAY     ? "HER HANDS EMPTY"
          : tt >= WEEP    ? "SHE HAS SAID IT"
          :                 "THE TERMS");

    figure("telemachus", telemachus,
      tt => {
        const digging  = tt >= SPADE1 && tt < BACK0;
        const straining= tt >= TRY1 && tt < SIGNAL;
        const last     = tt >= TRY4 && tt < SIGNAL;
        const stopped  = tt >= SIGNAL;
        return {
          browUp:   last ? .34 : stopped ? .40 : .26,
          browKnit: straining ? .62 : digging ? .40 : .18,
          frown:    stopped ? .40 : straining ? .28 : 0,
          eyeNarrow:straining ? .34 : .08,
          jaw:      last ? .46 : straining ? .26 : 0,
          mouth:    stopped ? -1 : 0,
        };
      },
      tt => tt >= SIGNAL  ? "HE GIVES IT UP"
          : tt >= TRY4    ? "THE FOURTH TIME"
          : tt >= TRY1    ? "THREE TIMES"
          : tt >= TAKE    ? "HE TAKES IT UP"
          : tt >= PLANT0  ? "TWELVE, IN A LINE"
          : tt >= SPADE1  ? "ONE LONG TRENCH"
          :                 "THE SON");

    figure("eumaeus", eumaeus,
      tt => {
        const weeping = tt >= SEEN && tt < REBUKE + 4;
        const warding = tt >= REBUKE + 4 && tt < PLANT0;
        return {
          browUp:   weeping ? .66 : .40,
          browKnit: weeping ? .50 : warding ? .58 : .28,
          frown:    weeping ? .52 : warding ? .30 : 0,
          eyeNarrow:warding ? .34 : 0,
          mouth:    weeping ? -1 : 0,
        };
      },
      tt => tt >= PLANT0     ? "HE WATCHES"
          : tt >= REBUKE + 4 ? "REBUKED"
          : tt >= SEEN       ? "HIS MASTER'S BOW"
          :                    "LOYAL");

    figure("philoetius", philoetius,
      tt => {
        const weeping = tt >= WEEP && tt < REBUKE + 4;
        const bitter  = tt >= REBUKE + 4 && tt < PLANT0;
        return {
          browUp:   weeping ? .88 : .34,
          browKnit: weeping ? .58 : bitter ? .52 : .26,
          frown:    weeping ? .56 : bitter ? .36 : 0,
          eyeWide:  weeping ? .38 : .10,
          mouth:    weeping ? -1 : 0,
        };
      },
      tt => tt >= PLANT0     ? "FAITHFUL"
          : tt >= REBUKE + 4 ? "REBUKED"
          : tt >= WEEP       ? "WEEPING"
          :                    "THE COWHERD");

    figure("antinous", antinous,
      tt => {
        const jeering = tt >= REBUKE && tt < PLANT0;
        const uneasy  = tt >= TRY4;
        return {
          browKnit: jeering ? .72 : uneasy ? .58 : .34,
          browUp:   uneasy ? .24 : .12,
          eyeNarrow:jeering ? .42 : .26,
          frown:    uneasy ? .34 : 0,
          jaw:      jeering ? .48 : 0,
          mouthAsym:jeering ? .54 : .30,
        };
      },
      tt => tt >= TRY4    ? "HE SEES IT TOO"
          : tt >= PLANT0  ? "HIS TURN NEXT"
          : tt >= REBUKE  ? "THE REBUKE"
          :                 "ARROGANT");

    figure("odysseus", odysseus,
      tt => ({
        guise:"beggar",
        browKnit: tt >= SIGNAL ? .50 : .24,
        browUp:   tt >= SIGNAL ? .34 : .12,
        eyeNarrow:tt >= SIGNAL ? .28 : .38,
        smile:    tt >= TRY4 && tt < SIGNAL ? .14 : .04,
      }),
      tt => tt >= SIGNAL ? "NO. NOT YOU"
          : tt >= TRY1   ? "HIS SON, TRYING"
          :                "THE BEGGAR");

    queue.sort((a, b) => a.d - b.d).forEach(q => q.draw());

    /* --- 4. THE ALIGNMENT WINDOW. An overlay, always last (note D). ------- */
    if (t >= SEC_IN){
      detailField(offctx, W, H, SEC_DST);
      plate(offctx, W, H, lane, LANE_CW, LANE_CH, SEC_WIN, SEC_DST,
            laneState(t), `lane|${t >= ALIGNED ? "aligned" : "laid"}`);
    }
  },
};
export default scene;

/* named binding so OD-B21-S03 can `import { exitOccupancy as INITIAL }`.
   S03 plays in this same hall and every station in it is a megaron station, so
   it needs no translation table — only the suitors it puts on the sill. */
export const exitOccupancy = scene.exitOccupancy;
