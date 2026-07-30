/* ============================================================
   SCENE  OD-B23-S05 — Odysseus Tells the Remaining Journey   (Od. 23.288–372)
   Book XXIII, scene 5 — the last scene of the book. ADDITIVE: adds nothing to
   Books I–XV, modifies no existing module (not even the room's own plan — see
   note B), and casts only assets that already exist. Shape copied from the
   reference scene scenes/OD-B16-S03.mjs and from its immediate predecessor
   scenes/OD-B23-S04.mjs.

   Beats (causal order, one master clock):
     1. In bed Odysseus and Penelope recount the years they spent apart.
     2. He tells her Tiresias's command to travel inland with an oar and appease
        Poseidon.
     3. He describes the eventual gentle death foretold for him.
     4. Penelope accepts that further movement remains even after homecoming.
     5. They sleep while Athena finally releases the dawn.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. THE ROOM IS THE THALAMOS, AND IT IS THE ROOM'S OWN STATE CHANNEL THAT
      TELLS BEAT 5. The field is location.marriage-chamber — the third authored
      room of the poem, built (its header says so) for this scene, cast at
      anchor (.50,.99) scale 1.0 so it fills the stage the way every Book XVI+
      field does. It is NOT the megaron and NOT the upper chamber; S04 kept the
      whole bed test in the hall precisely so this room could be entered here
      for the first time.
      The state channel carries the last beat, so nothing has to be hand-drawn
      for it:  `lamplit` (the maids have made the bed and gone, the torch-lamp
      high, the doors still standing open behind them) while they talk ->
      `night-held` at SLEEP (doors shut and barred, lamp low, the bedding
      SLEPT-IN with the near bolster dented, and the room's own dawn gauge in
      the right wall risen one step and pinned under a heavy STOP BAR: this is
      the held night S04 handed over, still running) -> `dawn` at RELEASE (the
      stop bar gone, the slot full of paper-white morning, two pools of light
      let onto the floor, one door leaf ajar, the lamp guttering out). Athena
      releasing the dawn is therefore drawn ONCE, as a change of state in the
      room she is holding, rather than twice as a room plus an effect: this is
      why divine-fx.athena-delays-dawn — S04's own instance, which it exported
      HELD and said S05 would spend — is deliberately NOT cast here. The same
      event, drawn where it is visible.
      TWO PASSES OF ONE FIELD, ON THE ROOM'S OWN DECLARED OCCLUSION ORDER, IS
      WHAT PUTS TWO BODIES *IN* THE BED (note C). location.marriage-chamber
      declares { bg:[shell,roof,farwall,gauge,doors], mid:[threshold,pegs,chest,
      bed,bedding], fg:[trunk,lamp] } — so the field is placed twice: BACK =
      shell, farwall, gauge, doors, threshold, pegs, chest, bed, then the two
      figures, then FRONT = bedding, trunk, lamp, light. The coverlet, the two
      bolsters, the rooted olive post and the torch are all drawn OVER the
      bodies, because in this room they are in front of them. Nothing is
      redrawn by hand; the same module paints both passes.
      ONE LAYER IS DROPPED, AND IT IS DROPPED ON A MEASUREMENT. `roof` paints
      four rafters and three tie beams cut into three pieces each; measured at
      1120x760 the three courses run y 203–212, 180–189 and 146–155, and their
      right-hand pieces span x 675–836, 698–892 and 732–973. That is inside the
      prophecy window (x 560–1090, y 20–298, note E), and the window's own
      content is a stepped route whose horizontal legs land at y 105, 165 and
      230 — three more bars, 15 to 40px off the three the ceiling would put
      there, which is stripe-on-stripe and the exact failure S04 recorded when
      it cast the Ocean and the yoke into its dawn crop. So the battens go and
      the route keeps the plane to itself. The ceiling PLANE is not lost:
      `shell` still paints it, with its hard wall/ceiling rail.

   B. NO HAND-PLACED ANCHORS, AND THE PLAN IS DERIVED, NOT EDITED.
      location.marriage-chamber authors its own plan (`thalamos`) and exports
      it; that file is not touched. The thalamos ships a contact pair for two
      bodies standing on either side of the bed (`bed_l`/`bed_r`) but no mark
      for a body IN it, so two marks are added in a DERIVED plan at the top of
      this file: PAIR_MID ± HALF_APART, at the depth of the bed's own head end.
      Both numbers were set off a rendered plate and both are recorded with the
      plate that set them (note C). `{ ...thalamos.stations,
      ...EXTRA }` inherits all fourteen thalamos stations UNCHANGED — asserted,
      not assumed: PLAN_IS_THALAMOS re-projects every one of them through both
      plans and compares x, y, scale and d, so if the room's plan ever moves,
      this scene's numbers move with it. An unknown station still throws, which
      is the cross-room check.

   C. THE CONTACT PAIR IS A BED, SO IT IS A PAIR IN TWO REGISTERS.
        odysseus  bed_in_l  (x .41, z .50)  screen x 489, body 321px
        penelope  bed_in_r  (x .57, z .50)  screen x 616, body 321px
      127px between centres at 1120x760: their silhouettes overlap by about
      27px, so they are touching and they share no coordinate. Two other
      spacings were rendered first. The bed's own bolster marks (u .29/.71 of
      the bed, 167px apart) leave 47px of PAPER between two people who have
      spent a book getting back into the same bed, and they printed as two
      separate sitters. Closing to 111px on PAIR_MID .47 fixed that and broke
      something else: at x 592 the queen's veil and hair drape — which she lays
      out in box-W fractions, so she is drawn half again as wide as the rig —
      came down onto the door jamb, which the room paints as a dark S(4) bar at
      x 538–565, and her head and the jamb printed as one mass. PAIR_MID .49
      with HALF_APART .08 puts her head at x 583–650, inside the doorway the
      room leaves PAPER-BRIGHT in `lamplit` (x 565–683) — she is read against
      light for the whole conversation — and his at x 456–523, clear of that
      jamb by 15px and clear of the rooted olive post (which ends at x 405) by
      7px. Each of them still has a bolster behind their head (the left spans
      x 462–570, the right 631–739).
      THE TWO REGISTERS ARE SIT AND LIE, AND THE SLIDE BETWEEN THEM IS THE ONLY
      MOTION IN THE SCENE.
        · SIT — the base (the rig's own ankle line) is laid on the MATTRESS,
          at py(z) − bedHeight·SZ(z) taken from the room's params, not on the
          floor. The body is then cut at the coverlet, so what stands above the
          bedding is head, chest and arms: two people sitting up in bed talking,
          with the covers at the waist. The cut is at the coverlet's own far
          edge (a horizontal at y 476, because y is a function of depth alone),
          plus 8px, so the seam falls UNDER the coverlet's 4px contour and the
          bedding — drawn after them in the FRONT pass — closes over it.
        · LIE — the same body, same station, same scale, slid down by 0.30 of
          its own height, which drops both crowns 96px from y 220 to y 316: they
          are lying back low in the bed with the bolsters in front of their
          chests, eyes shut, and their heads still land on the far wall's light
          ashlar. 0.52 was rendered first and thrown off the plate — it put both
          crowns at y 396, inside the headboard's inlay band (y 391–486) AND
          behind the two bolsters (y 460–500), and the two of them printed as
          two dark lumps among the inlay bars, not readable as people at all.
          Either way it is one continuous ramp over five seconds (SLEEP..SLEEP+5)
          on one body: no second module, no cut, no separate "sleeping" asset.
          That is the guise channel's rule (note G) applied to a posture.
      The clip is what makes the register honest: no figure's ink ever crosses
      the coverlet line, at any value of the ramp, so nobody's legs can appear
      standing on the bedding at the foot of the bed. Without it the queen's
      skirt — laid out at box fractions .61–.905, i.e. y 566–652 in the LIE
      register — would hang 76px through the covers past the coverlet's near
      edge at y 576.

   D. NOBODY ELSE IS IN THIS ROOM, AND NOBODY MOVES.
      MOVES IS EMPTY, AND THAT IS THE CORRECT BLOCKING OF THIS SCENE. Homer
      keeps all five beats inside one bed: they lie down, they talk all night,
      they sleep. Both bodies still resolve through the plan by station name for
      every frame, and exitOccupancy is still computed from the plan, so the
      handoff is structured exactly as it is in a scene full of walking. What
      changes across the clock is the sit->lie ramp, sixteen pose changes, sixteen
      gaze changes, the room's three states and the prophecy's four phases.
      THE OTHER THREE BODIES OF S04 ARE DROPPED, DECLARED (note K).

   E. THE PROPHECY IS A DIAGRAM ON THE ONE CLEAR PLANE, AND IT IS CROPPED DOWN
      TO WHAT PRINTS. divine_fx.inland-oar-prophecy was authored for this scene
      (`scene:"OD-B23-S05"` in its own header). Cast whole at scale 1.0 it would
      repaint the room; so, exactly as S04 did with its dawn, it is blitted as
      ONE KEYED WINDOW: layers `route / consequence / token`, window
      x .240–.965, y .240–.620 of its own box, onto the ceiling plane and the
      right wall above the lamp, at x 560–1090, y 20–298. What that crop holds
      is beats 2 and 4 whole — the prophecy arriving as dashes from off the
      window's top-left corner, the stepped ONE-WAY route inland with its dashes
      flowing and its two milestone rings, three low humps of inland ground, the
      borne-oar token walking that route on the scene's own clock, the arrowhead
      that closes it, and at the end the oar PLANTED upright in inland earth with
      the threefold offering smoking beside it and a check ring over it.
      THE CROP WAS TIGHTENED ONCE, OFF A PLATE, AND THAT IS THE WHOLE STORY OF
      THIS WINDOW. Draft 1 took x .020–.980 / y .225–.600 into a 620px box —
      the same route plus the sea band and the six-rank sea-knowledge gauge —
      and it printed as SCATTERED DEBRIS: a fifth of the width went on empty
      water, the route's dashes came out at 6.5px, the gauge's ranks at 13px and
      12px apart, and at that size the gauge read as a grid of loose boxes with a
      dashed line wandering away from it, not as one diagram. Cropping to the
      route's own bounding box gives every feature half again its size in the
      same 530px: 7.3px dashes, 15px milestone rings, a 37px planted marker, a
      14px token, a 19px check. The window is 1:1 — the source canvas is 731px,
      so the crop is 530x278 and needs no resampling, which matters because the
      module draws its contour in absolute pixel widths.
      WHAT IS CROPPED AWAY IS CROPPED FOR THE SAME REASON. The gauge falling
      from five blocks to an empty box with a slash (a people with no word for
      the sea) and the module's best idea — the identical silhouette read as an
      OAR in one panel and a WINNOWING FAN in the other, with a "reads-as" node
      between them — are both out. The readings band is 2.5:1 and the only
      rectangle in this room that would take it is 560px wide, which puts that
      panel's contour at 3.1px and its tossed grain at 2.3px, under this
      pipeline's dot pitch (MESH cell 5 at DPR 2 = 4.1 CSS px) — the failure the
      brief names, structure dissolving in the lattice. The misreading is still
      TOLD: it is beat 2's own line, the `mistaken` phase is on this clock, and
      it is what the queen looks up at. What is DRAWN is what survives drawing.
      IT DOES NOT GO OUT. The route is still open over them while they sleep,
      which is beat 4: the homecoming is not the end of the moving.
      IT IS NOT IN THE ROOM'S AIR ARBITRARILY, EITHER. The window's rectangle
      overlaps the top of the room's own dawn slot (x 834–906, reveal from
      y 240), but the crop's bottom-left and bottom-centre are EMPTY — the
      lowest ink in that column is the route's leg at y 230 — so no mark of the
      goddess' route lands on the goddess' own gauge, and the planted oar stands
      clear at x 1015, above the lamp and right of the slot.

   F. THE HORIZONTALS ARE ALL BROKEN, AND NOTHING IS TYPE. Every long run in
      this plate is the room's or the module's own broken generator: the far
      wall's five ashlar courses are drawn in four spans each with staggered
      joints, the coverlet's hem is in two pieces, the bed's rail groove in
      three, the sill under the dawn slot in two, and the prophecy's route is
      dashes, not rules. `roof`'s nine battens are dropped (note A), and the one
      long horizontal left in the plate is the far wall's own top edge, which is
      the room. There is no type anywhere in the scene — the module's only
      numerals live in its gauge, and the gauge is cropped out (note E) — and the
      only blue mark in the frame is the engine's own card.

   G. ONE BODY, ONE GUISE, NO FLARE. Odysseus is character.odysseus-b16 at guise
      `restored` for the whole scene: the channel is used, held at its end
      value. The ramp was spent in OD-B16-S03 and there is no discontinuity
      here, so divine_fx.athenas-restoration is not imported — the flare exists
      to cover the one snap, and putting it in the marriage chamber would
      un-tell the reveal.

   H. ONE MIRROR EACH, AND NOBODY IS SWITCHED. Odysseus is `mirror:true`
      throughout, as S02, S03, S04 and B22-S01 draw him: he is left of the
      spine and every act of his goes screen RIGHT — the arm that points at the
      route above them, the palm that lays out the death, the hand he puts out
      to her. Penelope is never mirrored: she is right of him at every frame, so
      her acts go screen LEFT and the rig's `reach_forward` — authored to screen
      left — is what turns her toward him when she answers. Explicit gaze is
      applied after the mirror is composed, so every gaze in this timeline is
      already in final screen terms (+x = right).

   I. THE BOX A BODY IS DRAWN IN, AND ITS SIZE. placeInstance hands a module a
      box of the STAGE's aspect and character.penelope lays her veil, hair drape
      and skirt out in box-W fractions, so both figures are blitted through
      placeFig() into an upright box — 0.75 for her, 0.95 for him — exactly as
      S04 does. K is 0.46 here, not S04's 0.52, and the difference is a MEASURED
      change of room, not of style: the thalamos has a low private ceiling
      (roofRise .21 against the megaron's) and its doorway is 160px tall, so a
      body sized for the great hall stands taller than the door it came through.
      At K=0.46 a body at the bed's depth is 321px against a door of 172px at
      that depth, its crown sits at y 220 — 8px under the far wall's top edge and
      61px under the ceiling at its own depth — and 240px of it stands above the
      coverlet: a person a little shorter than the doorway they came through,
      which is what this architecture will take.
      K WAS RAISED TWICE, OFF PLATES. At 0.34 (a 237px body) the two of them
      printed as two small dark blobs behind the bed and could not be read as
      people. At 0.42 they read, but their torsos were narrower than the
      headboard's inlay bands are long and got lost in them. At 0.46 the torso is
      about 90px wide with its own hard contour and wins over the bands it
      crosses.

   J. TONE. Hand-drawn ctx overpaint in this file is ZERO: every mark on the
      plate is made by a module. The room is `lamplit` (lift 0) for four fifths
      of the scene and `dawn` (lift 0, floorLift −1, two paper-white pools on
      the floor) at the end; only the fifteen seconds of held night are one
      level down. The far wall is a light plane, the floor is a light plane, the
      bed frame and the coverlet are the lightest tones in the room, and the
      open doorway in `lamplit` is paper — which is what the two heads are read
      against for the whole conversation. The darkest masses are the rooted
      olive post, the lamp's three flames and the hair of two people.

   K. CONTINUITY IN — imported, and translated with a declared map.
      OD-B23-S04 exports { odysseus:"embrace_l", penelope:"embrace_r",
      telemachus:"corner_dead", phemius:"passage", eurycleia:"doorway_maid" }.
      Those are megaron marks and this scene is in another room, so blockingAt
      would (correctly) throw on every one of them. The map is one line long:
        embrace_l -> bed_in_l      embrace_r -> bed_in_r
      The contact pair on the hall floor becomes the contact pair in the bed —
      the same two bodies, still touching, one room later, in the same left/right
      order, with the same handedness (note H). THE OTHER THREE ARE DROPPED, and
      dropping them is the point: `corner_dead`, `passage` and `doorway_maid`
      are places in the great hall, and Telemachus, Phemius and Eurycleia are
      still in it. Carrying them into the marriage chamber would put three
      bodies where the story has none.

   CONTINUITY OUT — computed, never written:
     { odysseus:"bed_in_l", penelope:"bed_in_r" }
   Both marks belong to this file's derived plan, so a Book XXIV scene that
   resumes in the thalamos off the authored plan alone should import
   `exitOccupancyThalamos` instead: the pair in the bed folds back onto the
   room's own standing pair `bed_l`/`bed_r`, which is where two people who get
   up out of that bed will be.

   Verify (the telling, under an open door; and the released dawn):
     node harness/render-scene.mjs scenes/OD-B23-S05.mjs --t 36
     node harness/render-scene.mjs scenes/OD-B23-S05.mjs --t 92
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, clamp01, smooth }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { plan as thalamos } from "../assets/location/marriage-chamber.mjs";
import odysseus from "../assets/character/odysseus-b16.mjs";
import penelope from "../assets/character/penelope.mjs";
import prophecy from "../assets/divine_fx/inland-oar-prophecy.mjs";
/* divine_fx.athena-delays-dawn is deliberately NOT imported: note A. The hold
   S04 handed over is spent through this room's own dawn gauge. */

const FIELD_ASSET = "location.marriage-chamber";
const D = 96;

/* the room, minus the nine ceiling battens that stripe the one clear plane
   (note A), split on the room's own declared occlusion order */
const BACK_LAYERS  = ["shell","farwall","gauge","doors","threshold","pegs","chest","bed"];
const FRONT_LAYERS = ["bedding","trunk","lamp","light"];

/* ---- THE ROOM'S OWN GEOMETRY, read off the module, never retyped --------- */
const BEDP    = field.params;                       // bedX0/X1/Z0/Z1, bedHeight
const SZ      = z => 0.60 + 0.50 * clamp(z, 0.08, 1);
const py      = z => 0.50 + 0.46 * Math.pow(z, 1.08);
/* the mattress: the room lifts the frame's top face bedHeight above the floor */
const mattressY = z => py(z) - BEDP.bedHeight * SZ(z);
/* the coverlet's FAR edge — the room lays it at z0+0.03, bedHeight+0.030 up.
   y is a function of depth alone, so this is a horizontal line, and it is the
   line every body in this bed is cut at (note C). */
const COVER_Z   = BEDP.bedZ0 + 0.030;
const COVER_LIFT= BEDP.bedHeight + 0.030;
const COVER_Y   = py(COVER_Z) - COVER_LIFT * SZ(COVER_Z);

/* ---- THE PLAN, DERIVED (note B) ----------------------------------------- */
const PAIR_MID  = 0.490;                             // 0.06 left of the bed's own
                                                     // centre: the door jamb (note C)
const HALF_APART= 0.080;                             // 127px between centres
const BED_HEAD_Z= 0.500;                             // their depth in the bed
const EXTRA = {
  bed_in_l:{ x:PAIR_MID - HALF_APART, z:BED_HEAD_Z }, // his side, by the post
  bed_in_r:{ x:PAIR_MID + HALF_APART, z:BED_HEAD_Z }, // hers, in the doorway's light
};
const plan = makePlan({
  id:"thalamos+b23s05",
  name:"The Marriage Chamber at Ithaca (+ the two marks in the bed)",
  notes:"DERIVED from location.marriage-chamber's own exported plan. Every " +
        "thalamos station is inherited unchanged and asserted below; only " +
        "bed_in_l and bed_in_r are new, and both are computed from the room's " +
        "own bed params. The olive post is NOT re-placed: it stays where the " +
        "room roots it.",
  stations:{ ...thalamos.stations, ...EXTRA },
});
export const PLAN_IS_THALAMOS = thalamos.names().every(n => {
  const a = thalamos.at(n), b = plan.at(n);
  return a.x === b.x && a.y === b.y && a.scale === b.scale && a.d === b.d;
});
if (!PLAN_IS_THALAMOS)
  throw new Error("[OD-B23-S05] derived plan drifted from location.marriage-chamber");

/* ---- THE CLOCK ---------------------------------------------------------- */
const HERS   =  0;   // she tells him what the twenty years were
const HIS    = 22;   // he tells her his own — the whole of it, told flat
const TELL0  = 30;   // Tiresias' last command      -> the window, `shore`
const ROUTE  = 40;   // inland, with the oar         -> `field`
const MISTKN = 52;   // a people who read it as a fan-> `mistaken`
const PLANT  = 60;   // planted, and Poseidon paid   -> `planted`
const DEATH  = 68;   // and then a gentle death, in sleek old age
const ACCEPT = 76;   // she answers: then there is hope of an escape from evil
const SLEEP  = 80;   // they lie down — the sit->lie ramp, 80..85
const RELEASE= 88;   // Athena lets the dawn go

/* ---- CONTINUITY IN: imported, and translated (note K) -------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B23-S04.mjs";
const HALL_TO_CHAMBER = { embrace_l:"bed_in_l", embrace_r:"bed_in_r" };
const INITIAL = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, st]) => [who, HALL_TO_CHAMBER[st]])
    .filter(([, st]) => st));

/* ---- BLOCKING. Stations, not coordinates — and nobody walks (note D). ---- */
const MOVES = [];

/* ---- THE ONE RAMP: sit -> lie, one body, no cut (note C) ---------------- */
const sink = t => t <= SLEEP ? 0 : smooth(clamp01((t - SLEEP) / 5));
/* how far down: 0.30 of the body's own height, measured off a plate. 0.52 was
   rendered first and thrown out — it put both crowns at y 396, inside the
   headboard's inlay band (y 391-486) and behind the two bolsters (460-500), and
   the two of them printed as two dark lumps among the inlay bars, unreadable as
   people. At 0.30 the crowns drop 96px to y 316 and both heads land clear on the
   far wall's light ashlar, with the bolsters in front of their chests. */
const LIE_DROP = 0.30;

/* ---- ONE FIGURE SCALE, and it is the room's, not the hall's (note I) ---- */
const K = 0.46;

/* ---- placeFig — blit a module into an upright box on its own floor line,
   CLIPPED at the coverlet so no body ever crosses the bedding (note C).
   `sig` is required: keyedModuleCanvas caches on pose/band/t only. --------- */
const AR_WOMAN  = 660 / 880;
const AR_MAN    = 0.95;
const FIG_FLOOR = 0.90;          // where figure-hero plants the ankles
const FIG_PAD   = 0.07;          // bleed, so a raised arm is never truncated
function placeFig(offctx, W, H, mod, { x, baseY, hFrac, ar = AR_MAN, fx = 0.5,
                                      state = {}, sig = "", clipY = null,
                                      pad = FIG_PAD, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  const dx = x * W - fx * w - pad * w;
  const dy = baseY - FIG_FLOOR * h - pad * h;
  if (clipY == null || clipY >= dy + cv.height){ offctx.drawImage(cv, dx, dy); return; }
  const keep = Math.round(clipY - dy);
  if (keep > 0) offctx.drawImage(cv, 0, 0, cv.width, keep, dx, dy, cv.width, keep);
}

/* ---- THE PROPHECY WINDOW (note E) --------------------------------------
   One keyed window of the route-and-consequence band, laid on the ceiling
   plane. The source canvas is 584 so the crop is 561x219 and the blit is 1:1:
   the module draws its contour in absolute pixel widths, and resampling is what
   would push its dashes and gauge ranks under the dot pitch. */
const OAR_C   = 731;
const OAR_WIN = { x0:.240, y0:.240, x1:.965, y1:.620 };
const OAR_DST = { x0:560/1120, y0:20/760, x1:1090/1120, y1:298/760 };
const OAR_LAYERS = ["route","consequence","token"];
function placeProphecy(offctx, W, H, state, sig){
  const cv = keyedModuleCanvas(prophecy, OAR_C, OAR_C, state, sig);
  offctx.drawImage(cv,
    OAR_WIN.x0 * OAR_C, OAR_WIN.y0 * OAR_C,
    (OAR_WIN.x1 - OAR_WIN.x0) * OAR_C, (OAR_WIN.y1 - OAR_WIN.y0) * OAR_C,
    OAR_DST.x0 * W, OAR_DST.y0 * H,
    (OAR_DST.x1 - OAR_DST.x0) * W, (OAR_DST.y1 - OAR_DST.y0) * H);
}

export const scene = {
  id:"OD-B23-S05",
  title:"Odysseus Tells the Remaining Journey",
  book:23,
  plan:"thalamos+b23s05",
  duration:D,
  beats:[
    "In bed Odysseus and Penelope recount the years they spent apart.",
    "He tells her Tiresias's command to travel inland with an oar and appease Poseidon.",
    "He describes the eventual gentle death foretold for him.",
    "Penelope accepts that further movement remains even after homecoming.",
    "They sleep while Athena finally releases the dawn.",
  ],
  exitState:
    "The marriage chamber at Ithaca, and the night is finally over. THE TWO OF " +
    "THEM ARE ASLEEP IN THE BED ODYSSEUS BUILT AROUND THE OLIVE, on the two " +
    "marks of its one contact pair (`bed_in_l` / `bed_in_r`, 127px between " +
    "centres, one pillow each, 27px of shared silhouette and no coordinate " +
    "shared), lying back low, head and shoulders " +
    "above the coverlet and the rest of them under it: the same two bodies that " +
    "ended S04 holding each other on the floor of the great hall, in the same " +
    "left/right order, one room later. THE ACCOUNT IS SETTLED. She has told him " +
    "what the twenty years in this house cost her and he has told her the whole " +
    "of his own, and then he told her the one part that is not over: Tiresias' " +
    "last command. divine_fx.inland-oar-prophecy has run its whole machine on " +
    "this clock — the prophecy issuing at the water's edge, the stepped ONE-WAY " +
    "route inland with its milestones, the borne-oar token walking that route, the " +
    "misreading (they will call the blade a winnowing fan, and that is the sign), " +
    "and PLANTED: the oar upright in inland earth, the threefold offering to " +
    "Poseidon smoking beside it, the route closed with a check. After that a " +
    "gentle death, at sea's distance from the sea, in sleek old age, with his " +
    "people prosperous around him. SHE HAS ACCEPTED IT — that the homecoming is " +
    "not the end of the moving — and THE ROUTE IS STILL DRAWN OVER THE BED while " +
    "they sleep: the household that Book XXIV inherits has one journey left in " +
    "it, and both of them know the shape of it. ATHENA HAS LET GO OF THE CLOCK. " +
    "The hold S04 exported is SPENT: location.marriage-chamber is in state " +
    "`dawn` — the stop bar that pinned the gauge at the sill is gone, the slot " +
    "in the right wall is full of paper-white morning, two pools of it are on " +
    "the floor, one door leaf is ajar and the torch-lamp is guttering with one " +
    "thread of smoke. The bedding is slept-in and the near bolster is dented. " +
    "Odysseus is ONE body at guise `restored`, held, no ramp and no flare: " +
    "nothing about him changed in this scene either. Telemachus, Phemius and " +
    "Eurycleia are all still in the great hall and none of them is in this room.",
  exitOccupancy:occupancyAt(plan, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    odysseus:"none — he is already in the bed at t=0, translated from S04's " +
             "`embrace_l` through the declared hall->chamber map (note K)",
    penelope:"none — already in the bed at `bed_in_r`, from S04's `embrace_r`",
    prophecy_01:"not a body: the window comes up at TELL0=30, the second he " +
                "starts on Tiresias, and it does not go down",
  },
  exits:{
    odysseus:"none — he holds `bed_in_l`, asleep, into Book XXIV",
    penelope:"none — she holds `bed_in_r`, asleep",
    prophecy_01:"none — the route is still open over them at the last frame " +
                "(note E): that is beat 4",
    "the held night":"RELEASED at 88 — the room's own dawn gauge loses its stop " +
                     "bar and fills. This is the one thing in the scene that ends.",
  },
  walkable:"the thalamos' own `walkable` band (x .10–.90, y .55–.99) minus the " +
           "bed's footprint, the cut paving around the root flare and the lamp " +
           "stand — and NONE OF IT IS USED: MOVES is empty, because all five " +
           "beats of this scene happen in one bed (note D). The two positions " +
           "in use are inside the bed's own footprint and are resolved off the " +
           "mattress, not the floor: base = py(z) − bedHeight·SZ(z), taken from " +
           "the room's params.",
  depthOrder:"one queue, and it is the room's own declared occlusion order: the " +
             "room's BACK layers (shell, far wall, dawn gauge, doors, step, " +
             "pegs, chest, bed frame and headboard); then the two bodies, sorted " +
             "by their resolved plan depth and then by x, each of them CLIPPED at " +
             "the coverlet line; then the room's FRONT layers — the coverlet and " +
             "the two bolsters, the rooted olive post (which occludes the bed it " +
             "carries), the torch-lamp and its light. The prophecy window is over " +
             "everything, because it is not a thing in the room at all.",
  gazeTargets:{
    odysseus:"her face while she tells him her twenty years; then past her, at " +
             "nothing, while he tells his own; then UP at the route above them " +
             "from TELL0 to PLANT — he is describing a map; then her again for " +
             "the death, level and unhurried; then her hand; then nothing, eyes " +
             "shut, from SLEEP",
    penelope:"him, the whole way, without once looking away — she looks up at the " +
             "route only at MISTKN, when the thing he is carrying stops being an " +
             "oar; then his face again; then nothing, eyes shut",
    prophecy_01:"n/a — its route points one way, inland, and its arrowhead and " +
                "check are at the far end of it",
  },
  attachments:[
    { at:TELL0,  who:"prophecy_01", change:"cast, `shore`: the prophecy issuing " +
      "at the water's edge, the route not yet walked, the gauge full" },
    { at:ROUTE,  who:"prophecy_01", change:"`field` — the token walking, the " +
      "token walking, the humps of inland ground coming up under it" },
    { at:MISTKN, who:"prophecy_01", change:"`mistaken` — the inland reading takes " +
      "over: what is on his shoulder is a winnowing fan, and that is the sign" },
    { at:PLANT,  who:"prophecy_01", change:"`planted` — the oar upright in the " +
      "earth, the threefold offering smoking, the route closed with a check" },
    { at:SLEEP,  who:"odysseus",    change:"sit -> lie: one continuous ramp over " +
      "five seconds, same body, same station, same scale (note C)" },
    { at:SLEEP,  who:"penelope",    change:"sit -> lie, on the same ramp" },
    { at:SLEEP,  who:"chamber_01",  change:"`night-held` — doors shut and barred, " +
      "lamp low, bedding SLEPT, the dawn gauge pinned under its stop bar" },
    { at:RELEASE,who:"chamber_01",  change:"`dawn` — the stop bar gone, the slot " +
      "full, two pools of morning on the floor, one leaf ajar, the lamp guttering" },
    { at:"never",who:"odysseus",    change:"nothing. Guise `restored`, held; no " +
      "ramp, no flare, no cut (note G)" },
  ],
  sound:[
    { at:HERS,    source:"bed_in_r", cue:"two voices, low, in a room with the door still open behind them" },
    { at:HIS,     source:"bed_in_l", cue:"one voice going on a long time — Ismarus to Ogygia, told flat" },
    { at:TELL0,   source:"bed_in_l", cue:"a change of register: this part has not happened yet" },
    { at:ROUTE,   source:"bed_in_l", cue:"an oar named as a thing to be carried on foot" },
    { at:MISTKN,  source:"bed_in_l", cue:"the one word the whole labour turns on — a fan for winnowing grain" },
    { at:PLANT,   source:"bed_in_l", cue:"three animals, named, to a god who is owed" },
    { at:DEATH,   source:"bed_in_l", cue:"his own death described without any pressure at all" },
    { at:ACCEPT,  source:"bed_in_r", cue:"her answer, six words long, and it is not a protest" },
    { at:SLEEP,   source:"bed_in_l", cue:"nothing further from either of them" },
    { at:RELEASE, source:"dawn_slot", cue:"the first thing in twenty-four hours to arrive on time" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"chamber_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"lamplit" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.436,y:.656}, scale:.42, band:"threeq", pose:"lean_forward" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.550,y:.656}, scale:.42, band:"threeq", pose:"penelope_plea" },
    { asset:"divine-fx.inland-oar-prophecy", instance:"prophecy_01",
      anchor:{x:.737,y:.392}, scale:.47, blend:"multiply" },
  ],

  timeline:[
    // 1. the years, hers first
    { op:"actor.pose", target:"penelope",    at:HERS,     args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope",    at:HERS,     args:{ gaze:{ x:-.26, y:.04 } } },
    { op:"actor.pose", target:"odysseus",    at:HERS,     args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus",    at:HERS,     args:{ gaze:{ x:.28, y:.06 } } },
    // 1b. then his
    { op:"actor.pose", target:"odysseus",    at:HIS,      args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus",    at:HIS,      args:{ gaze:{ x:.16, y:-.04 } } },
    { op:"actor.pose", target:"penelope",    at:HIS,      args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"penelope",    at:HIS,      args:{ gaze:{ x:-.30, y:.02 } } },
    // 2. Tiresias' command, and the route
    { op:"fx.play",    target:"prophecy_01", at:TELL0,    args:{ dir:"shore" } },
    { op:"actor.pose", target:"odysseus",    at:TELL0,    args:{ pose:"open_palm" } },
    { op:"actor.gaze", target:"odysseus",    at:TELL0,    args:{ gaze:{ x:.20, y:-.26 } } },
    { op:"actor.pose", target:"odysseus",    at:ROUTE,    args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus",    at:ROUTE,    args:{ gaze:{ x:.34, y:-.34 } } },
    { op:"actor.pose", target:"penelope",    at:MISTKN,   args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"penelope",    at:MISTKN,   args:{ gaze:{ x:-.10, y:-.30 } } },
    { op:"actor.pose", target:"odysseus",    at:MISTKN,   args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",    at:MISTKN,   args:{ gaze:{ x:.30, y:-.22 } } },
    { op:"actor.pose", target:"odysseus",    at:PLANT,    args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus",    at:PLANT,    args:{ gaze:{ x:.36, y:-.30 } } },
    { op:"actor.pose", target:"penelope",    at:PLANT,    args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"penelope",    at:PLANT,    args:{ gaze:{ x:-.28, y:.00 } } },
    // 3. the gentle death
    { op:"actor.pose", target:"odysseus",    at:DEATH,    args:{ pose:"open_palm" } },
    { op:"actor.gaze", target:"odysseus",    at:DEATH,    args:{ gaze:{ x:.26, y:.06 } } },
    { op:"actor.pose", target:"penelope",    at:DEATH,    args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope",    at:DEATH,    args:{ gaze:{ x:-.22, y:.10 } } },
    // 4. she accepts that there is still movement in it
    { op:"actor.pose", target:"penelope",    at:ACCEPT,   args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"penelope",    at:ACCEPT,   args:{ gaze:{ x:-.20, y:.04 } } },
    { op:"actor.pose", target:"odysseus",    at:ACCEPT,   args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"odysseus",    at:ACCEPT,   args:{ gaze:{ x:.22, y:.10 } } },
    // 5. they sleep; then the dawn is let go
    { op:"actor.pose", target:"odysseus",    at:SLEEP,    args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus",    at:SLEEP,    args:{ gaze:{ x:.06, y:.24 } } },
    { op:"actor.pose", target:"penelope",    at:SLEEP,    args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"penelope",    at:SLEEP,    args:{ gaze:{ x:-.06, y:.24 } } },
    { op:"timeline.capture", target:"OD-B23-S05", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(plan, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.06 + 0.90 * (t / D));
    const u      = sink(t);
    const clipY  = COVER_Y * H + 8;                       // the coverlet line
    const roomState = t < SLEEP ? "lamplit" : t < RELEASE ? "night-held" : "dawn";
    const status = t < HIS     ? "WHAT IT COST HER"
                 : t < TELL0   ? "AND WHAT IT COST HIM"
                 : t < MISTKN  ? "ONE LABOUR LEFT"
                 : t < PLANT   ? "A WINNOWING FAN"
                 : t < DEATH   ? "POSEIDON PAID"
                 : t < ACCEPT  ? "A GENTLE DEATH"
                 : t < SLEEP   ? "THEN THERE IS HOPE"
                 : t < RELEASE ? "THE NIGHT IS STILL HELD"
                 :               "THE DAWN IS LET GO";

    /* --- 1. THE ROOM, back layers (note A). It paints the room; everything
       else keys onto it. ------------------------------------------------- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{ state:roomState, t:breath, layers:BACK_LAYERS,
              status, progress:prog },
    });

    /* --- 2. THE TWO BODIES, in the bed, nearer drawn later, each clipped at
       the coverlet (note C). --------------------------------------------- */
    const order = ["odysseus","penelope"]
      .sort((a, b) => (blk[a].d - blk[b].d) || (blk[a].x - blk[b].x));

    for (const who of order){
      const p = blk[who];
      const s = st[who] || {};
      const hFrac = K * p.scale;
      const h     = H * hFrac;
      /* SIT on the mattress; LIE is the same body slid down LIE_DROP of itself */
      const baseY = mattressY(p.d) * H + u * LIE_DROP * h;

      if (who === "odysseus"){
        /* ONE BODY, ONE GUISE, HELD (note G). Mirrored once and never switched
           (note H): he is left of her and everything he does goes screen right. */
        const hearing = t < HIS;
        const telling = t >= HIS && t < TELL0;
        const route   = t >= TELL0 && t < DEATH;
        const dying   = t >= DEATH && t < SLEEP;
        const asleep  = t >= SLEEP;
        const pose = s.pose || "lean_forward";
        const gaze = s.gaze || { x:.28, y:.06 };
        placeFig(offctx, W, H, odysseus, {
          x:p.x, baseY, hFrac, ar:AR_MAN, clipY,
          state:{
            t:breath, guise:"restored", band:"threeq", mirror:true, pose, gaze,
            browUp:   asleep ? .06 : dying ? .30 : route ? .22 : hearing ? .34 : .18,
            browKnit: asleep ? .10 : hearing ? .40 : dying ? .26 : .18,
            eyeNarrow:asleep ? .92 : route ? .24 : .14,
            eyeWide:  0,
            jaw:      asleep ? 0 : route ? .30 : telling ? .34 : 0,
            mouthAsym:asleep ? 0 : .12,
            smile:    dying ? .18 : 0,
            frown:    hearing ? .32 : 0,
            status:   asleep ? "ASLEEP" : dying ? "AND THEN A GENTLE DEATH"
                    : route  ? "AN OAR, INLAND" : telling ? "TWENTY YEARS OF IT"
                    :          "HE LISTENS FIRST",
            progress: prog,
          },
          sig:`ody|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${hearing?1:0}|${telling?1:0}|${route?1:0}|${dying?1:0}`
             + `|${asleep?1:0}|${Math.round(u*20)}`,
        });

      } else {
        /* the queen: never mirrored, so her hands go screen left, at the man on
           her left (note H). In the atlas' upright box (note I). */
        const telling = t < HIS;
        const hearing = t >= HIS && t < MISTKN;
        const strange = t >= MISTKN && t < DEATH;
        const struck  = t >= DEATH && t < ACCEPT;
        const answer  = t >= ACCEPT && t < SLEEP;
        const asleep  = t >= SLEEP;
        const pose = s.pose || "penelope_plea";
        const gaze = s.gaze || { x:-.26, y:.04 };
        placeFig(offctx, W, H, penelope, {
          x:p.x, baseY, hFrac, ar:AR_WOMAN, clipY,
          state:{
            t:breath, band:"threeq", pose, gaze,
            mouth:    telling ? .48 : answer ? .38 : asleep ? -1 : 0,
            browUp:   struck ? .52 : strange ? .44 : telling ? .40 : asleep ? .08 : .30,
            browKnit: struck ? .40 : telling ? .34 : asleep ? .10 : .22,
            eyeNarrow:asleep ? .92 : answer ? .22 : .12,
            eyeWide:  strange ? .34 : 0,
            frown:    struck ? .34 : telling ? .22 : 0,
            status:   asleep ? "ASLEEP" : answer ? "THEN THERE IS HOPE"
                    : struck ? "HIS DEATH, DESCRIBED" : strange ? "A FAN?"
                    : hearing ? "SHE DOES NOT LOOK AWAY" : "WHAT IT COST HER",
            progress: prog,
          },
          sig:`pen|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${telling?1:0}|${hearing?1:0}|${strange?1:0}|${struck?1:0}`
             + `|${answer?1:0}|${asleep?1:0}|${Math.round(u*20)}`,
        });
      }
    }

    /* --- 3. THE ROOM, front layers: the coverlet and bolsters close over
       them, the rooted post stands in front of the bed it carries, the torch
       burns down (note A). ------------------------------------------------ */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{ state:roomState, t:breath, layers:FRONT_LAYERS,
              status, progress:prog },
    });

    /* --- 4. THE PROPHECY: one keyed window of the route band, on the ceiling
       plane, and it does not go down (note E). --------------------------- */
    if (t >= TELL0){
      const w = clamp01((t - TELL0) / (PLANT - TELL0));   // the route walked
      const phase = t >= PLANT  ? "planted"
                  : t >= MISTKN ? "mistaken"
                  : t >= ROUTE  ? "field" : "shore";
      placeProphecy(offctx, W, H, {
        t:w, phase, layers:OAR_LAYERS,
        status: phase === "planted" ? "PLANTED" : phase === "mistaken" ? "MISTAKEN"
              : phase === "field"   ? "FORETOLD" : "UTTERED",
        progress: clamp01(0.10 + 0.86 * w),
      }, `oar|${phase}|${Math.round(w*24)}`);
    }
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;

/* the same occupancy translated into PURE thalamos stations, for any Book XXIV
   scene that resumes in this room off the authored plan alone (brief note F:
   declare the map, do not guess). The pair in the bed folds onto the room's own
   standing contact pair, which is where two people who get out of that bed are:
   his side of it is the side the rooted post is on. */
const TO_THALAMOS = { bed_in_l:"bed_l", bed_in_r:"bed_r" };
export const exitOccupancyThalamos = Object.fromEntries(
  Object.entries(exitOccupancy)
    .map(([who, st]) => [who, st in TO_THALAMOS ? TO_THALAMOS[st] : st])
    .filter(([, st]) => st));
