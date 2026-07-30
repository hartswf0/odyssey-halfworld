/* ============================================================
   SCENE  OD-B23-S04 — The Bed Test                        (Od. 23.173–246)
   Book XXIII, scene 4. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module (not even scenes/_plans/megaron.mjs — see note B), and casts
   only assets that already exist. Shape copied from the reference scene,
   scenes/OD-B16-S03.mjs, and from its hall siblings OD-B23-S03, OD-B23-S02,
   OD-B22-S02 and OD-B21-S01.

   Beats (causal order, one master clock):
     1. Penelope orders Eurycleia to move the marriage bed outside the chamber
        for the stranger.
     2. Odysseus erupts: he built that bed around a living olive tree and no one
        could move it intact.
     3. The secret proves identity; Penelope runs to him and embraces him.
     4. She explains that fear of deception caused her delay.
     5. Athena holds back dawn while husband and wife weep and reunite.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. THE ROOM IS THE SAME ROOM, IN THE SAME STATE, AND THE FIRST FRAME IS
      S03's LAST. The field is location.megaron-hall in state `cleaned`, at
      anchor (.50,.99) scale 1.0 — the same asset, state, anchor and scale
      OD-B23-S03 and OD-B23-S02 used, so this hall registers to the pixel on
      theirs, and on B19-S02's, B21-S01's and B22-S01's. `throne`, `axes` and
      `litter` are dropped for the reasons S02 recorded (the throne plinth
      stands across the near spine where the son's corner is; `cleaned` draws
      nothing at all with the other two).
      ONE MORE LAYER IS DROPPED HERE THAN IN S03, AND IT WAS DROPPED OFF A
      PLATE. `furniture` paints the four benches and two boards as boxes rising
      off the floor, and `cleaned` puts them all back in order: measured at
      1120x760 the left pair covers screen x 160–407 with its TOP EDGES at
      y 538–618, and the right pair covers x 713–905 with the same tops. That
      band is exactly where this scene's two events happen — the near floor the
      bed the queen orders set up has to stand on, and the near floor the two of
      them finally close on — and draft 1 was rendered with the layer in: the
      king's feet at the embrace mark landed at y 546 against the left board's
      top edge at 542, so his legs vanished into the board, and the bed's foot
      end fused with the right bench at the same depth. That is the fixture-
      under-the-legs bug, and the layer is dropped rather than walked over,
      which is the same decision S02 and S03 made about the throne plinth. The
      hall still paints its shell, roof, far wall, great doors, sill, empty arms
      racks, both side doors, the stair, both roof-pillars, the floor lane and a
      fresh fire.
      Homer keeps this whole scene in the megaron: at 23.241
      Dawn would have come up ON THEM WEEPING, in the hall, before either of
      them has moved toward the chamber — the chamber is the NEXT scene. So no
      second room is built and location.marriage-chamber is deliberately not
      cast; it belongs to S05.
      At t=0 the frame is S03's exit frame exactly: four bodies on four
      inherited marks, the false wedding still going out through the wall.

   B. NO HAND-PLACED ANCHORS FOR ANY BODY — AND THE PLAN IS DERIVED, NOT
      EDITED. scenes/_plans/megaron.mjs is a tracked Books I–XV+ file and this
      scene does not touch it. But the megaron ships NO CONTACT PAIR, and this
      scene contains the one embrace the whole poem has been walking toward, so
      five marks are added in a DERIVED plan at the top of this file:
        embrace_l {x:.34,z:.74} / embrace_r {x:.46,z:.74}   the contact pair
        fire_near {x:.70,z:.74}                             a walk waypoint
        bed_mark  {x:.86,z:.87}                             where the bed stands
        passage   {x:.99,z:.36}   beyond the household door — off the room, like
                                  the plan's own `storeroom`, and nobody is ever
                                  DRAWN on it: it is a mark for bodies that have
                                  gone through that door or not come in yet
      `{ ...megaron.stations, ...EXTRA }` inherits every original station
      UNCHANGED — asserted, not assumed: PLAN_IS_MEGARON below re-projects all
      22 megaron stations through both plans and compares x, y, scale and d, so
      if the hall plan ever moves, this file's numbers move with it. An unknown
      station still throws, which is the cross-room check. Every body in this
      file resolves through this plan by station NAME; there is not one literal
      coordinate in the staging of a person, and the two things in the frame
      that are NOT bodies are placed off a named station too (notes F, G).

   C. CONTACT PAIR — SHE RUNS TO HIM, AND THEY LAND ON TWO MARKS, ON THE ONE
      PIECE OF FLOOR THAT WILL TAKE THEM. Od. 23.207: she ran straight to him
      and threw her arms round his neck. So the pair is on the NEAR floor, in
      front of the fire, and it is there because everywhere else in this room
      fails a rendered test:
        odysseus `embrace_l` (x .364, feet y .833)  359px body, x 351–464
        penelope `embrace_r` (x .466, feet y .833)  359px body, x 465–578
      114px between centres, one floor line, one size: the two rig silhouettes
      share an edge, and the queen's veil and hair drape — which she lays out in
      box-W fractions, so she is drawn half again as wide as the rig — overlap
      his shoulder by about 30px. They are touching and they share no coordinate.
      DRAFT 2 PUT THE PAIR 105px APART ON x .390/.483 AND IT WAS MOVED OFF THE
      PLATE: at .483 the queen stood dead on the hearth's own screen centre
      (x 560) with the fire's five flames rising behind her hip, and the two of
      them, the fire and the far doorway stacked into one vertical column in the
      middle of the frame. 22px to the left is enough: the fire now shows to the
      right of her, and the king's head clears the far doorway's dark opening
      (which begins at x 448) altogether. That is two people holding each
      other. `pillar_l` + `pillar_r` cannot do it (252px of paper between them —
      they are the two marks of the ARGUMENT, which is what S02 and S03 used
      them for); the megaron's only close pairs, `shot_mark`/`throne`, are both
      on x .50 and resolve to ONE screen x, stacking one body inside the other;
      and a pair at mid-depth (z .50) was written, rendered and thrown out — at
      feet y 545 both bodies stood inside the left board's painted box (note A),
      which is what got the `furniture` layer dropped and the pair moved four
      depth-steps nearer. At z .74 their feet are at y 633: 53px BELOW the
      hearth ring the hall paints at x 475–645 / y 526–580, so they stand in
      FRONT of the fire — which is where two people who have just found each
      other again in this house should be standing.
      HER ROUTE IS TWO LEGS SO THAT SHE NEVER WALKS THROUGH THE FIRE. Plan-space
      `pillar_r` -> `embrace_r` in one leg passes (x .61,z .59), feet (654,578),
      which puts her inside the ring. So she comes round the NEAR side of it:
      `pillar_r` -> `fire_near` -> `embrace_r`. Leg one is straight at the
      camera down her own side of the room (mid-leg: 322px body, x 695–801, feet
      578, the ring 50px to her left); leg two runs along the near floor at a
      constant z (mid-leg: x 590–702, feet 633, the ring 53px above her feet).
      She crosses nobody: her husband is at 380–493 and never on her side of the
      spine, her son is at 76–200, and the nurse is at 834–928.

   D. NOBODY ELSE IS EVER COINCIDENT, AND THE RIGHT WALL IS A ONE-BODY
      CORRIDOR. Measured at 1120x760 with K = 0.52, S03's K for S03's rendered
      reason (at 0.42 a body against a roof-pillar is 255px tall and 91px wide,
      the pillar is painted 57px wide at that depth, and its two hard contour
      lines run down THROUGH the figure):
        odysseus   pillar_l -> embrace_l                307 -> 359px body
        penelope   pillar_r -> fire_near -> embrace_r   307 -> 359px body
        telemachus corner_dead   (.123,.911)  393px body, x 76–200  (never moves)
        phemius    stair_up -> doorway_maid -> passage  348px, then off frame
        eurycleia  passage -> doorway_maid -> stair_up -> doorway_maid  299px
      The right-hand wall has to carry THREE bodies in this scene — the queen at
      her pillar, the bard still playing, and the nurse who is sent up the stair
      — and it cannot: the bard at `stair_up` spans 883–992, the nurse at
      `doorway_maid` spans 834–928 and the queen at `pillar_r` spans 693–790, so
      bard+nurse fuse over 94px at overlapping heights. Every other right-hand
      mark fails worse (`bench_r2` 830–946 against the nurse, `bench_r1`
      786–893 against both the queen's veil and the bed, `table_r` 745–857
      against the queen by 45px). So the corridor is used by ONE BODY AT A TIME,
      in sequence, and the sequence is the plot:
        · THE BARD IS PUT OUT FIRST (t 3–8). What is about to be tested in this
          room is the one secret in the house that only two people hold — S02
          already had the queen say she and her husband have private signs — and
          the noise must not stop. So Phemius takes the phorminx out through the
          household door into the passage and plays at the street from there. He
          is not drawn from the moment he is through the door (note E).
        · THE NURSE COMES IN BY THE DOOR HE WENT OUT BY (t 10–13), two seconds
          behind him — they pass each other in the corridor, off frame, which is
          what `passage` is for — and stands in the household doorway
          (`doorway_maid`, x 834–928, feet y 510) to be given the order. That is
          44px clear of the queen's veil and 24px above the bed's head end, and
          it is where a nurse called up from the household quarters stands.
        · SHE GOES UP THE STAIR (t 16–20) to strip the bed she has been told to
          carry out, and is off frame in the chamber for forty seconds.
        · SHE COMES BACK DOWN (t 60–64) having made that bed up where it stands,
          which is what flips the prop to `reunion` (note F), and stops in the
          same doorway. `doorway_maid` is held by exactly one drawn body at a
          time from end to end, and the two who share it — the bard going out at
          t=7 and the nurse coming in at t=10 — are three seconds apart. A door
          is the one mark two people are supposed to share, in turn.

   E. A BODY THROUGH A DOOR IS NOT DRAWN. S03's own precedent (Odysseus at
      `postern` for the bath): the station is still resolved by the plan for the
      whole time, so the occupancy is continuous even though the picture is not,
      and the handoff is unaffected. Phemius is undrawn from t=7; Eurycleia is
      undrawn before t=10 and between t=20 and t=60. Drawing the nurse standing
      on a stair tread for forty seconds would say the opposite of "she has gone
      up to move the bed".

   F. THE BED IS THE ONE OBJECT IN THE POEM THAT CANNOT BE CARRIED, SO IT IS
      DRAWN AS A PROPOSITION AND NOT AS FURNITURE — AND ITS FIVE STATES ARE
      WHAT SAY SO. prop.olive-tree-marriage-bed was authored for this scene
      (`scene:"OD-B23-S04"` in its own header) and it is a state machine:
      MADE · STRIPPED · IMMOVABLE · ROOTED · REUNION. It is NOT in the frame at
      t=0. It comes up on the queen's ORDER (t=13) in `stripped` — the bedding
      off, the tenon dashed into the post — because that is the moment the house
      is told to take it apart; it goes to `false-move` when he erupts (t=22),
      which draws the DISPLACED GHOST BED in dashes, the heavy push vector, the
      bar dead across it and the X, and the root anchor pin; it goes to `secret`
      when he tells how he built it (t=32), which cuts the floor away, puts the
      root mass under it, ghosts the lopped crown above the post and sets the
      growth-ring section; and at the end (t=66) it goes to `reunion` — bedding
      and coverlet back on, softened — but with `cutaway:0.86` passed on the
      module's own declared channel, so THE FLOOR STAYS CUT AND THE ROOTS STAY
      VISIBLE. That is the whole scene in one object: the bed is made up for
      them again and it is still growing out of the ground it was built in. A
      dashed ghost of itself displaced, a blocked push vector and a root mass
      under a cut floor are not furniture standing in a megaron; they are the
      argument, drawn.
      IT IS PLACED OFF A STATION, LIKE EVERYTHING ELSE, AND IT OBEYS THE DEPTH
      LAW. `bed_mark` {x:.86,z:.885} with `kind:"prop"` (k = 0.92), and the
      prop's own declared `contact:floor` anchor (.500,.615 of its box) is laid
      ON that station, so the bed stands on the floor the plan draws instead of
      on a number. Its box is BED_BASE · p.scale wide — the prop's size is set by
      box WIDTH, since its unit is s = 0.300·W — so it grows and shrinks with the
      station like a body does instead of being a fixed number of pixels. At
      x .86 / z .87 that is a 381px box, s = 114, and its ink runs x 798–1068,
      y 533–733: 23px below the nurse's feet in the doorway above it, 8px clear
      of the queen's veil at `pillar_r` (ends x 790), 153px clear of the hearth
      ring (ends x 645), and 9px above the card's rule — draft 2 sat 3px lower
      and the root tuft printed THROUGH the rule. At d .87 it is NEARER
      than the stair (x 896–1103, d .66), so where they meet it OCCLUDES the
      stair's lower flight, which is what a bed in the near right of a room does.
      A 280px bed against a 359px body is a bed a little shorter than a person is
      tall, one depth-step nearer the camera.
      THE UPPER-RIGHT CORNER WAS TRIED FIRST AND GIVEN UP: laid in over the stair
      as a chamber cutaway the only clear rectangle there is 255 x 215px, which
      puts the bed at 181px wide — the mortises at 5px, the ring section at 11px,
      the push vector at 12px, all of it under the dot pitch, which is exactly
      how S03's emitter diagram failed. The floor is where this object can be
      read, and the rendered plate says so: at 280px the woven ox-hide straps,
      the seven bored mortises, the dashed ghost and the root mass all hold.

   G. ATHENA IS A DURATION, NOT A BODY, AND SHE GETS THE ONE CLEAR PLANE.
      divine-fx.athena-delays-dawn was also authored for this scene and it
      declares itself a whole-frame diagram with its own night sky. Cast whole
      at scale 1.0 it repaints the room (placeInstance draws full-bleed above
      0.98 and drawSky fills the top 59% with inkLevel 2), and its sun would
      land on the hall floor at (420,580) — a sun sitting in front of the left
      pillar. So it is blitted as ONE KEYED WINDOW of the part of the plate that
      IS the beat: layers `sun / gate / clamp` only, window x .265–.715,
      y .430–.910 of its own box — the gate beam, whole, spanning the two posts
      it is sunk on, the broken horizon rule the light may not cross, the
      dashed clamp closed over the latch with one hard press-bar driving down on
      it (the goddess is a HOLE, which is the module's own idea and the best
      thing in it), the sun disc pressed up under the rule with every ray cut off
      flat, and the three heavy termination courses where the rays die.
      DRAFT 1 CAST `stream` AND `yoke` TOO AND THEY WERE CUT OFF THE PLATE. Both
      are horizontal-line generators — the Ocean is three courses of broken
      rules, the yoke is a beam with two collars — and with the gate's four rule
      spans and the sun's termination courses already in the crop, the rendered
      window printed as a LADDER of loose horizontal bars over the roof
      coffering, which is stripe-on-stripe and reads as debris. What is left is
      one object: a bar, a post, a clamp, and a sun that cannot get past them.
      WHAT ELSE IS CROPPED AWAY IS CROPPED FOR A REASON: the NIGHT SCALE (y .128)
      carries the hours-added readout, and although the module draws its
      numerals as seven-segment BAR GEOMETRY precisely so they survive, at the
      189px this frame can spare the digit cell is 9px wide and the bars go under
      the dot pitch — so the scale, the stars and the arrested star are all left
      out rather than printed as debris, the chariot is out of the crop, and the
      `chamber` aperture is left out because it lands on the son's head. AND THE
      CROP WAS WIDENED ONCE MORE AFTER DRAFT 2, FOR THE SAME REASON: at
      x .240–.600 the beam's span and both rule spans were cut into stubs and the
      second post was outside the frame, so what printed was a scatter of loose
      bars with a sun under them. x .265–.715 puts the beam's whole 0.372–0.628
      span between the posts at 0.328 and 0.672, so the gate reads as a gate.
      `sky` is
      left out too, so there is no tone field to key: the window is ink on the
      room's own paper.
      IT IS NOT IN THE ROOM'S AIR ARBITRARILY. It is laid on the near-left wall
      plane, x 40–257, y 40–272 — the one rectangle in this composition that is
      neither architecture nor somebody's head (the roof's coffering starts right
      of x 263, Odysseus at the embrace starts at x 351, the son's crown is at
      y 299, and the postern slab begins right of x 196 and below y 269) — and it
      comes up only at t=64, the moment Athena takes hold of the clock, so it
      shares the frame with nothing but the two of them weeping.

   H. ONE BODY, ONE GUISE, AND NO FLARE. Odysseus is character.odysseus-b16 at
      guise `restored` for the whole scene — the guise CHANNEL is used, held at
      its end value, which is the point of the channel: S03 spent the ramp
      0.44 -> 1 across his walk back from the bath and snapped the garment at
      u=0.5 under divine_fx.athenas-restoration. There is no discontinuity in
      this scene, so there is NO restoration flare in it; the flare exists to
      cover the one snap and putting it anywhere else would un-tell the reveal.
      What changes here is not his body, it is that she finally knows it.

   I. ONE MIRROR EACH, AND NOBODY IS SWITCHED. Odysseus is `mirror:true`
      throughout, exactly as S02, S03 and B22-S01 draw him: he stands left of
      the spine and every act of his goes screen RIGHT — his eyes across the
      fire at her, the arm that points at the bed on x 829, the arms he opens
      when she comes. Nobody else is mirrored. The queen is right of him at
      every moment of this scene, at her pillar and in his arms, so her acts go
      screen LEFT and the rig's `reach_forward` — authored to screen left — is
      what puts her arms round his neck unmirrored. The nurse and the bard are
      both right of everybody and reach left. The son is given only symmetric
      poses plus an explicit gaze, and explicit gaze is applied AFTER the mirror
      is composed, so every gaze in the timeline is already in final screen
      terms (+x = right).
      THE QUEEN'S ORDER IS THE ONE PLACE THIS COSTS SOMETHING: she gives it to a
      nurse standing on her right, and her reaching poses go left. She is
      therefore given `arms_open` — symmetric — plus a gaze of +.30, instead of
      being mirrored for six seconds and switched back.

   J. TONE, AND WHAT THIS FILE DOES NOT DRAW. Hand-drawn ctx overpaint in this
      file is ZERO: every mark on the plate is made by a module. Nothing here
      draws a full-width band — the hall's near boards stop at x 401 and restart
      at 719, the bed is 280px wide in a 1120px frame, the dawn window is 189px,
      the dawn's own gate is authored in three broken spans and only two of them
      are inside the crop, and its night axis (the one long horizontal in the
      plate) is cropped out. There is no type anywhere: the only numerals in
      either plate are the dawn's seven-segment bars and they are cropped away.
      The room is `cleaned`, a lift-0 state that lifts the floor one level
      lighter still, and both windows are keyed, so the paper shows through
      them. The darkest masses in the frame are the far doorway's furniture, the
      bed's rooted post and root mass, and the five small flames of a fresh fire.

   K. THE BOX A BODY IS DRAWN IN. placeInstance() hands a module a box of the
      STAGE's aspect, and character.penelope lays her veil, hair drape and skirt
      out in box-W fractions, so in a landscape box she renders as a wide bell.
      Every figure is therefore blitted through placeFig() into an upright box —
      0.75 for the two women, 0.95 for the three men. The rig plants its ankles
      at 0.90 of its own box and min(h·0.9, w·1.26) is h-limited for any aspect
      above 0.714, so hFrac = K·p.scale gives all five exactly the body height
      the landscape regime would have given them. Same law, same K, same boxes
      as S02 and S03.

   CONTINUITY IN — imported, and not translated:
   OD-B23-S03 exports { penelope:"pillar_r", odysseus:"pillar_l",
   telemachus:"corner_dead", phemius:"stair_up" }. All four are megaron
   stations, the derived plan inherits all four unchanged, and this scene plays
   in that same hall, so the occupancy is spread straight into INITIAL and
   NOBODY IS DROPPED. `eurycleia:"doorway_maid"` is the one DECLARED addition —
   the nurse is not inherited from S03 because S03 did not have her in the room;
   she is in the house (she is the one who woke the queen in S01) and she comes
   in through the household door on the order, undrawn until she does.

   CONTINUITY OUT — computed, never written:
   { odysseus:"embrace_l", penelope:"embrace_r", telemachus:"corner_dead",
     phemius:"passage", eurycleia:"doorway_maid" }.
   Three of those five are marks of THIS file's derived plan, so a scene that
   resumes in the hall off the authored plan alone should import
   `exitOccupancyMegaron` instead: the contact pair folds back onto the two
   roof-pillars (both free at the end of this scene) and the bard is dropped,
   because `passage` is not a place in this room. S05 plays in
   location.marriage-chamber and will translate either one.

   Verify (the order with the bed stripped, and the embrace under a held dawn):
     node harness/render-scene.mjs scenes/OD-B23-S04.mjs --t 15
     node harness/render-scene.mjs scenes/OD-B23-S04.mjs --t 70
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, lerp }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import penelope   from "../assets/character/penelope.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import phemius    from "../assets/character/phemius.mjs";
import eurycleia  from "../assets/character/eurycleia.mjs";
import bed        from "../assets/prop/olive-tree-marriage-bed.mjs";
import dawn       from "../assets/divine_fx/athena-delays-dawn.mjs";
/* divine_fx.athenas-restoration is deliberately NOT imported: note H. The ramp
   was spent in S03 and there is no discontinuity here to cover. */

const FIELD_ASSET = "location.megaron-hall";
const D = 78;

/* the scoured hall, minus the throne plinth that swallows the near spine, the
   two layers `cleaned` draws nothing with, and the benches and boards (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth"];

/* ---- THE PLAN, DERIVED (note B) -----------------------------------------
   The hall is authored once, in scenes/_plans/megaron.mjs, and that file is not
   touched. Five marks the megaron does not ship are added here and nothing
   else changes. */
const EXTRA = {
  embrace_l:{ x:.34, z:.74 },   // contact pair, on the near floor left of the fire
  embrace_r:{ x:.46, z:.74 },   // — 114px between centres, silhouettes touching
  fire_near:{ x:.70, z:.74 },   // waypoint: she comes round the NEAR side of the fire
  bed_mark: { x:.86, z:.87 },   // where the bed that cannot be moved stands
  passage:  { x:.99, z:.36 },   // beyond the household door: the corridor the bard
                                // goes out into and the nurse comes in from. Off
                                // the room, like the plan's own `storeroom`, and
                                // NOBODY IS EVER DRAWN ON IT.
};
const plan = makePlan({
  id:"megaron+b23s04",
  name:"The Great Hall at Ithaca (+ the bed test's three marks)",
  notes:"DERIVED from scenes/_plans/megaron.mjs. Every megaron station is " +
        "inherited unchanged and asserted so below; only embrace_l, embrace_r, " +
        "fire_near, bed_mark and passage are new.",
  stations:{ ...megaron.stations, ...EXTRA },
});
/* the assertion, so a change to the hall plan can never silently desync this
   scene's numbers from every other hall scene's */
export const PLAN_IS_MEGARON = megaron.names().every(n => {
  const a = megaron.at(n), b = plan.at(n);
  return a.x === b.x && a.y === b.y && a.scale === b.scale && a.d === b.d;
});
if (!PLAN_IS_MEGARON)
  throw new Error("[OD-B23-S04] derived plan drifted from _plans/megaron.mjs");

/* ---- THE CLOCK ---------------------------------------------------------- */
const BARD0  =  3;   // the bard is put out; the noise goes on from the passage
const BARD1  =  7;   // he is through the household door — not drawn from here
const BARD2  =  8;   // he is out in the passage, playing at the street
const NURSE  = 10;   // the nurse comes in through the door he went out by
const ORDER  = 13;   // "strip the bed and carry it out for him"  -> STRIPPED
const UP0    = 16;   // she goes up the stair to do it
const UP1    = 20;   // through the chamber door — not drawn from here
const ERUPT  = 22;   // he comes off the pillar                   -> IMMOVABLE
const SECRET = 32;   // the olive, the adze, the one rooted post  -> ROOTED
const KNOWN  = 42;   // her knees and her heart go
const RUN0   = 43;   // she runs — round the NEAR side of the fire
const RUN1   = 50;   // she arrives, and they touch
const EXPLAIN= 58;   // it was fear of being deceived, not coldness
const BACK0  = 60;   // the nurse comes down, the bed made up where it stands
const BACK1  = 64;   // she stops in the household doorway she came in by
const DAWN0  = 64;   // Athena takes hold of the clock             -> the window
const MADE   = 66;   // the coverlet is on it again                -> REUNION

/* ---- CONTINUITY IN: imported, untranslated (all megaron stations) -------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B23-S03.mjs";
const INITIAL = {
  ...PREV_EXIT,          // penelope pillar_r, odysseus pillar_l,
                         // telemachus corner_dead, phemius stair_up
  eurycleia:"passage",   // in the house, out in the household corridor, undrawn
};

/* ---- BLOCKING. Stations, not coordinates (notes B, C, D). ---------------- */
const MOVES = [
  // the bard is put out of the hall, and keeps playing on the other side of it
  { who:"phemius",   from:"stair_up",     to:"doorway_maid", t0:BARD0, t1:BARD1 },
  { who:"phemius",   from:"doorway_maid", to:"passage",      t0:BARD1, t1:BARD2 },
  // the nurse: in by the door he went out by, up the stair, and back down to it
  { who:"eurycleia", from:"passage",      to:"doorway_maid", t0:NURSE, t1:NURSE+3 },
  { who:"eurycleia", from:"doorway_maid", to:"stair_up",     t0:UP0,   t1:UP1   },
  { who:"eurycleia", from:"stair_up",     to:"doorway_maid", t0:BACK0, t1:BACK1 },
  // he comes off the pillar when he hears the bed described as movable
  { who:"odysseus",  from:"pillar_l",     to:"embrace_l",    t0:ERUPT, t1:ERUPT+4 },
  // she runs, round the NEAR side of the fire, and does not stop until she is
  // holding him
  { who:"penelope",  from:"pillar_r",     to:"fire_near",    t0:RUN0,  t1:RUN0+4 },
  { who:"penelope",  from:"fire_near",    to:"embrace_r",    t0:RUN0+4, t1:RUN1  },
  // TELEMACHUS DOES NOT MOVE (note D and S03's note C): every near diagonal out
  // of the middle of this hall passes across one of his parents, and tonight
  // they are the scene.
];

/* he is off frame from the moment he is through the household door; she is off
   frame before she comes in and while she is up in the chamber (note E) */
const bardOff  = t => t >= BARD1;
const nurseOff = t => t < NURSE || (t >= UP1 && t < BACK0);

/* ---- ONE FIGURE SCALE for the whole cast; the plan's depth law does the
   rest. Same K as S02 and S03, for the same rendered reason (note D). ------ */
const K = 0.52;

/* ---- placeFig — blit a module into an upright box anchored on the rig's own
   floor line (note K). `sig` is required: keyedModuleCanvas caches on
   pose/band/t only, so without it a change of gaze or brow returns the
   previous frame's canvas. -------------------------------------------------- */
const AR_WOMAN  = 660 / 880;     // the atlas' character box
const AR_MAN    = 0.95;          // rig plus, for the bard, one prop
const FIG_FLOOR = 0.90;          // where figure-hero plants the ankles
const FIG_PAD   = 0.07;          // bleed, so a raised arm is never truncated
function placeFig(offctx, W, H, mod, { x, y, hFrac, ar = AR_MAN, fx = 0.5,
                                       fy = FIG_FLOOR, state = {}, sig = "",
                                       pad = FIG_PAD, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* ---- THE BED (note F) ---------------------------------------------------
   The prop's size is set by box WIDTH — its unit is s = 0.300·W — so BW is the
   bed. BH only has to be tall enough to hold the lopped-crown ghost above the
   post (1.30·s up) and the root mass below the cut floor (0.46·s down): with
   s = 135 that is 238px of ink, and 320 gives it a 40px margin either side of
   the contact point. The window is laid so the prop's own declared
   `contact:floor` anchor sits ON `bed_mark`. */
const BED_BASE = 400;                                  // px at unit prop scale
const BED_AR   = 0.72;                                 // box height / box width
const BED_CONTACT = bed.anchors["contact:floor"];      // {x:.500,y:.615}
function placeBed(offctx, W, H, state, sig){
  const p  = plan.at("bed_mark", { kind:"prop" });     // kind:"prop" -> k = 0.92
  const w  = BED_BASE * p.scale, h = w * BED_AR;       // it obeys the depth law
  const cv = keyedModuleCanvas(bed, w, h, state, sig);
  offctx.drawImage(cv, p.x * W - BED_CONTACT.x * w,
                       p.y * H - BED_CONTACT.y * h);
}

/* ---- THE HELD DAWN (note G) --------------------------------------------
   One keyed window of the plate's own gate-and-disc quarter, on the near-left
   wall plane. The source canvas is deliberately SMALL (480) because the module
   draws its contour in absolute pixel widths: at 480 its 4–9px lines are still
   1–1.6 dots on the plate after a 0.99 blit, where a 760 canvas would have
   thinned them to half a dot. */
const DAWN_C   = 480;
const DAWN_WIN = { x0:.265, y0:.430, x1:.715, y1:.910 };
const DAWN_DST = { x0:40/1120, y0:40/760, x1:257/1120, y1:272/760 };
const DAWN_LAYERS = ["sun","gate","clamp"];
function placeDawn(offctx, W, H, state, sig){
  const cv = keyedModuleCanvas(dawn, DAWN_C, DAWN_C, state, sig);
  offctx.drawImage(cv,
    DAWN_WIN.x0 * DAWN_C, DAWN_WIN.y0 * DAWN_C,
    (DAWN_WIN.x1 - DAWN_WIN.x0) * DAWN_C, (DAWN_WIN.y1 - DAWN_WIN.y0) * DAWN_C,
    DAWN_DST.x0 * W, DAWN_DST.y0 * H,
    (DAWN_DST.x1 - DAWN_DST.x0) * W, (DAWN_DST.y1 - DAWN_DST.y0) * H);
}

export const scene = {
  id:"OD-B23-S04",
  title:"The Bed Test",
  book:23,
  plan:"megaron+b23s04",
  duration:D,
  beats:[
    "Penelope orders Eurycleia to move the marriage bed outside the chamber for the stranger.",
    "Odysseus erupts, explaining that he built the bed around a living olive tree and no one could move it intact.",
    "The secret proves identity; Penelope runs to him and embraces him.",
    "She explains that fear of deception caused her delay.",
    "Athena holds back dawn while husband and wife weep and reunite.",
  ],
  exitState:
    "The scoured hall, deep in a night that is no longer running. THE TEST IS " +
    "SPENT AND IT WENT THE ONLY WAY IT COULD: the queen ordered the marriage " +
    "bed stripped and carried out of the chamber for a stranger, and the " +
    "stranger came off the pillar and told her that no man alive could shift " +
    "it, because he cut the crown off a long-leaved olive that was growing in " +
    "the court, trimmed the trunk from the root up, dressed it true with the " +
    "adze, bored it, and joined the whole frame to that one post, which is " +
    "still in the ground. prop.olive-tree-marriage-bed has run its whole " +
    "machine on one clock — STRIPPED at the order, IMMOVABLE under the ghost " +
    "and the blocked push vector, ROOTED with the floor cut away and the root " +
    "mass showing, and now REUNION with the fleeces and the coverlet back on " +
    "it AND THE FLOOR STILL CUT: it is made up for them again and it has not " +
    "moved a finger's breadth. ODYSSEUS AND PENELOPE ARE TOUCHING for the " +
    "first time in twenty years, on the contact pair in the open floor in " +
    "front of the fire (`embrace_l` / `embrace_r`, 105px between " +
    "centres, four pixels of silhouette shared, no coordinate shared): she ran " +
    "round the far side of the fire and put her arms round his neck, and he is " +
    "weeping into her hair. She has said the thing she was keeping — it was " +
    "never coldness, it was the fear of a man who would come and say the words " +
    "and not be him. He is ONE body at guise `restored`, held, no ramp and no " +
    "flare: nothing about him changed in this scene, only what she knows. " +
    "ATHENA HAS HOLD OF THE CLOCK. divine-fx.athena-delays-dawn is at hold 1, " +
    "night 0.66, rise 0.30, watch 1 — the gate is down, the clamp is closed on " +
    "the latch, Dawn is pressed up under the rule with every ray cut off flat, " +
    "her chariot is chocked and her yoke is lying with both collars crossed " +
    "out. The night is not darker, it is LONGER, and it is still running when " +
    "this scene ends; S05 inherits it HELD and is the scene that spends it. " +
    "Telemachus has not moved out of the near-left corner (`corner_dead`) he " +
    "scoured; he has watched his parents recognize each other and has said " +
    "nothing. Eurycleia is back down off the stair, in the household doorway " +
    "the bed up in the chamber, and she keeps the house's other secret: the " +
    "dead are still in the outbuilding and the town outside still thinks it " +
    "heard a wedding. Phemius is out through the household door (`doorway_maid`) " +
    "and has never stopped playing — sound_source.false-wedding-music is still " +
    "at full reach, still believed, and nobody has told him to stop. S05 opens " +
    "on the two of them going up to that bed.",
  exitOccupancy:occupancyAt(plan, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    odysseus:"none — already down against `pillar_l`, inherited from S03",
    penelope:"none — already at `pillar_r`, inherited from S03",
    telemachus:"none — already in the near-left corner (`corner_dead`)",
    phemius:"none — inherited playing at `stair_up`. He EXITS through the " +
            "household door (`doorway_maid`, t=3..7) into the corridor beyond it " +
            "(`passage`, t=7..8) and is not drawn after t=7",
    eurycleia:"entrance:household door — she comes in from `passage` to " +
              "`doorway_maid` at t=10..13, three seconds after the bard went out " +
              "by it, and is undrawn before that. She EXITS up the chamber stair " +
              "(`stair_up`) at 16..20, is off frame for forty seconds, and " +
              "RE-ENTERS down it at BACK0=60",
    bed_01:"not a body and not an entrance: the prop is cast at ORDER=13, which " +
           "is the second the house is told to take it apart",
    dawn_01:"not a body: the held dawn comes up at DAWN0=64 and does not go down",
  },
  exits:{
    odysseus:"none — he holds `embrace_l` into S05",
    penelope:"none — she holds `embrace_r` into S05",
    telemachus:"none — he holds `corner_dead` into S05",
    phemius:"out through `doorway_maid` at t=7 to `passage` at t=8, and he keeps " +
            "playing on the far side of that door for the whole scene",
    eurycleia:"none at the end — she holds `doorway_maid`. Her one exit is " +
              "mid-scene and it is the stair, t=20..60, off frame in the chamber",
    bed_01:"none — the bed is the one thing in this poem that does not exit",
    dawn_01:"none — the hold is NOT released here. S05 releases it.",
  },
  walkable:"the megaron's own `walkable` band (x .12–.88, y .55–.98) minus the " +
           "exclusions this scene respects: the hearth ring (screen x 475–645, " +
           "y 526–580) — which is why the queen's run is two legs round the NEAR " +
           "side of it and not one straight line — the near throne footprint and " +
           "the six bench and board footprints, which is why the `throne` and " +
           "`furniture` layers are dropped rather than walked over (note A), and " +
           "from ORDER=13 the bed's own collision box at `bed_mark`. Three " +
           "routes are used: `pillar_l`->`embrace_l` and `pillar_r`->`fire_near`-> " +
           "`embrace_r` on the left and centre, and the right wall, which is a " +
           "one-body corridor used by the bard then the nurse in sequence.",
  depthOrder:"one queue, computed: the hall's layers; then the five figures " +
             "sorted by their own resolved plan depth so the nearer body is " +
             "drawn later — the nurse in the household doorway (d .40) and the " +
             "bard (d .66 falling to .40) and the two at the pillars (d .44) " +
             "before the pair on the near floor (d .74) before the son (d .90); " +
             "then the bed, which at d .885 with kind:`prop` is the nearest thing " +
             "in the room and is drawn over the lower flight of the stair it " +
             "stands in front of; then the held dawn, which is over everything " +
             "because it is not a thing in the room at all.",
  gazeTargets:{
    odysseus:"across the fire at her while she gives the order; then the bed, " +
             "hard, while he says what it is; then her face and nothing else " +
             "from the moment she moves, and down into her hair at the end",
    penelope:"the nurse at her shoulder for the order; then him, from the word " +
             "`olive` onward, without moving her body; then his face, close, " +
             "while she says what the twenty years cost; then nothing — her eyes " +
             "are shut",
    telemachus:"his mother while she gives the order; his father when he erupts; " +
               "then the two of them, and at the end the floor",
    phemius:"the strings, then the household door he is being sent through",
    eurycleia:"her mistress' mouth for the order, then the stair, then the two " +
              "of them holding each other, and then away — she has seen it and " +
              "she will not say it",
    bed_01:"n/a — but its push vector points at the door it was ordered through, " +
           "and its anchor pin points down",
    dawn_01:"n/a — the clamp looks at the latch and the disc looks at the rule",
  },
  attachments:[
    { at:ORDER,  who:"eurycleia", change:"the order lands in her hands: strip the " +
      "fleeces and the coverlet off the frame and bring the bedstead out" },
    { at:ORDER,  who:"bed_01", change:"cast, `stripped` — bedding OFF, the tenon " +
      "dashed into the bored post" },
    { at:ERUPT,  who:"bed_01", change:"`false-move` — the displaced ghost in " +
      "dashes, the push vector, the bar across it, the X, the root anchor pin" },
    { at:SECRET, who:"bed_01", change:"`secret` — the floor cut away, the root " +
      "mass, the lopped crown ghosted above the post, the growth-ring section" },
    { at:MADE,   who:"bed_01", change:"`reunion` with `cutaway:0.86` — bedding " +
      "and coverlet back on it, softened, AND THE FLOOR STILL CUT" },
    { at:RUN1,   who:"penelope", change:"her arms go round his neck; the two of " +
      "them are a contact pair from here to the end and never one mark" },
    { at:DAWN0,  who:"dawn_01",  change:"the clamp closes on the gate latch: " +
      "hold 0->1, night 0->0.66, and it is not released in this scene" },
    { at:"never", who:"odysseus", change:"nothing. Guise `restored`, held; no " +
      "ramp, no flare, no cut (note H)" },
  ],
  sound:[
    { at:0,       source:"doorway_maid", cue:"the lyre and the stamping, still going, one room away and through the wall" },
    { at:BARD0,   source:"stair_up",     cue:"the phorminx knocking once against the doorpost as he is put out" },
    { at:NURSE,   source:"doorway_maid", cue:"the nurse's feet on the flags, and a door left open behind her" },
    { at:ORDER,   source:"pillar_r",     cue:"the queen, level and public: strew him a bed OUTSIDE the chamber" },
    { at:UP0,     source:"stair_up",     cue:"her feet going up, and linen coming off a frame in a room overhead" },
    { at:ERUPT,   source:"pillar_l",     cue:"a man off a stone seat too fast — woman, that word cuts" },
    { at:SECRET,  source:"embrace_l",    cue:"the adze, the auger and the ox-hide, twenty years back, told flat" },
    { at:KNOWN,   source:"pillar_r",     cue:"her knees; then the one word she has not said in the whole book" },
    { at:RUN1,    source:"embrace_r",    cue:"two people not speaking, at all, for some time" },
    { at:EXPLAIN, source:"embrace_r",    cue:"it was never coldness — it was the fear of a man with the right words" },
    { at:DAWN0,   source:"pillar_l",     cue:"nothing at all from the east, for much longer than it should be" },
    { at:BACK0,   source:"stair_up",     cue:"the nurse coming down, and stopping on the last tread" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"cleaned" },
    { asset:"character.phemius", instance:"phemius",
      anchor:{x:.837,y:.793}, scale:.52, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.662,y:.690}, scale:.46, band:"threeq", pose:"guarded_withdrawal" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.338,y:.690}, scale:.46, band:"threeq", pose:"arms_crossed" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:.787,y:.671}, scale:.45, band:"threeq", pose:"eury_clasp" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.123,y:.911}, scale:.59, band:"threeq", pose:"three_quarter_right" },
    { asset:"prop.olive-tree-marriage-bed", instance:"bed_01",
      anchor:{x:.836,y:.903}, scale:.35 },
    { asset:"divine-fx.athena-delays-dawn", instance:"dawn_01",
      anchor:{x:.120,y:.379}, scale:.17, blend:"multiply" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at:0.0,      args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",   at:0.0,      args:{ gaze:{ x:.30, y:.06 } } },
    { op:"actor.pose", target:"penelope",   at:0.0,      args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"penelope",   at:0.0,      args:{ gaze:{ x:-.36, y:.04 } } },
    { op:"actor.pose", target:"telemachus", at:0.0,      args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"telemachus", at:0.0,      args:{ gaze:{ x:.32, y:-.04 } } },
    { op:"actor.pose", target:"phemius",    at:0.0,      args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"phemius",    at:0.0,      args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"actor.pose", target:"eurycleia",  at:0.0,      args:{ pose:"eury_clasp" } },
    { op:"actor.gaze", target:"eurycleia",  at:0.0,      args:{ gaze:{ x:-.26, y:.06 } } },
    // 1. the bard out, the nurse in, the order
    { op:"actor.gaze", target:"phemius",    at:BARD0,    args:{ gaze:{ x:.34, y:.02 } } },
    { op:"actor.pose", target:"penelope",   at:ORDER,    args:{ pose:"arms_open" } },
    { op:"actor.gaze", target:"penelope",   at:ORDER,    args:{ gaze:{ x:.30, y:.06 } } },
    { op:"actor.pose", target:"eurycleia",  at:ORDER,    args:{ pose:"eury_clasp" } },
    { op:"actor.gaze", target:"eurycleia",  at:ORDER,    args:{ gaze:{ x:-.30, y:.02 } } },
    { op:"actor.pose", target:"telemachus", at:ORDER,    args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"telemachus", at:ORDER,    args:{ gaze:{ x:.40, y:-.06 } } },
    { op:"actor.gaze", target:"odysseus",   at:ORDER,    args:{ gaze:{ x:.34, y:.02 } } },
    { op:"actor.pose", target:"eurycleia",  at:UP0,      args:{ pose:"eury_hush" } },
    // 2. he comes off the pillar; the bed cannot be moved
    { op:"actor.pose", target:"odysseus",   at:ERUPT,    args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",   at:ERUPT,    args:{ gaze:{ x:.38, y:.02 } } },
    { op:"actor.pose", target:"penelope",   at:ERUPT,    args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"penelope",   at:ERUPT,    args:{ gaze:{ x:-.40, y:.00 } } },
    { op:"actor.pose", target:"telemachus", at:ERUPT,    args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:ERUPT,    args:{ gaze:{ x:.28, y:-.12 } } },
    { op:"actor.pose", target:"odysseus",   at:ERUPT+6,  args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus",   at:ERUPT+6,  args:{ gaze:{ x:.44, y:.16 } } },
    // 3. the secret, and what it proves
    { op:"actor.pose", target:"odysseus",   at:SECRET,   args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"odysseus",   at:SECRET,   args:{ gaze:{ x:.40, y:.10 } } },
    { op:"actor.pose", target:"penelope",   at:SECRET,   args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"penelope",   at:SECRET,   args:{ gaze:{ x:-.42, y:.02 } } },
    { op:"actor.pose", target:"odysseus",   at:SECRET+6, args:{ pose:"torso_open" } },
    { op:"actor.pose", target:"penelope",   at:KNOWN,    args:{ pose:"penelope_plea" } },
    { op:"actor.pose", target:"odysseus",   at:KNOWN+3,  args:{ pose:"arms_open" } },
    { op:"actor.gaze", target:"odysseus",   at:KNOWN+3,  args:{ gaze:{ x:.26, y:.06 } } },
    { op:"actor.pose", target:"telemachus", at:KNOWN,    args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"telemachus", at:KNOWN,    args:{ gaze:{ x:.22, y:.04 } } },
    // the embrace: she reaches, unmirrored, at a man on her left
    { op:"actor.pose", target:"penelope",   at:RUN1,     args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"penelope",   at:RUN1,     args:{ gaze:{ x:-.24, y:.04 } } },
    { op:"actor.pose", target:"odysseus",   at:RUN1,     args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus",   at:RUN1,     args:{ gaze:{ x:.18, y:.22 } } },
    { op:"actor.pose", target:"telemachus", at:RUN1,     args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"telemachus", at:RUN1,     args:{ gaze:{ x:.24, y:.02 } } },
    // 4. what the twenty years cost
    { op:"actor.pose", target:"penelope",   at:EXPLAIN,  args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope",   at:EXPLAIN,  args:{ gaze:{ x:-.20, y:.00 } } },
    // 5. the dawn, held
    { op:"fx.play",    target:"dawn_01",    at:DAWN0,    args:{ dir:"hold" } },
    { op:"actor.pose", target:"penelope",   at:DAWN0+2,  args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope",   at:DAWN0+2,  args:{ gaze:{ x:-.16, y:.24 } } },
    { op:"actor.pose", target:"eurycleia",  at:BACK0,    args:{ pose:"eury_clasp" } },
    { op:"actor.gaze", target:"eurycleia",  at:BACK0,    args:{ gaze:{ x:-.40, y:.06 } } },
    { op:"actor.pose", target:"telemachus", at:DAWN0,    args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"telemachus", at:DAWN0,    args:{ gaze:{ x:.14, y:.30 } } },
    { op:"actor.pose", target:"eurycleia",  at:MADE+4,   args:{ pose:"eury_hush" } },
    { op:"timeline.capture", target:"OD-B23-S04", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(plan, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.06 + 0.90 * (t / D));

    /* --- 1. THE HALL, `cleaned` (note A). It paints the room; everything else
       keys onto it. Placed like every other Book XVI+ hall scene. --------- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"cleaned", t:breath, layers:HALL_LAYERS,
        status: t < ORDER   ? "ONE TEST LEFT"
              : t < ERUPT   ? "CARRY OUT THE BED"
              : t < SECRET  ? "NO MAN COULD MOVE IT"
              : t < KNOWN   ? "A LIVING OLIVE"
              : t < RUN1    ? "SHE KNOWS HIM"
              : t < DAWN0   ? "TWENTY YEARS"
              :               "THE NIGHT IS HELD",
        progress: prog,
      },
    });

    /* --- 2. THE BODIES, nearer drawn later (note D / depthOrder). -------- */
    const order = ["phemius","penelope","odysseus","eurycleia","telemachus"]
      .filter(who => !(who === "phemius"   && bardOff(t)))
      .filter(who => !(who === "eurycleia" && nurseOff(t)))
      .sort((a, b) => (blk[a].d - blk[b].d) || (blk[a].x - blk[b].x));

    for (const who of order){
      const p = blk[who];
      const s = st[who] || {};
      const hFrac = K * p.scale;

      if (who === "odysseus"){
        /* ONE BODY, ONE GUISE, HELD (note H). Mirrored once and never switched
           (note I): he stands left and everything he does goes screen right. */
        const hearing  = t < ERUPT;
        const erupting = t >= ERUPT && t < SECRET;
        const telling  = t >= SECRET && t < KNOWN;
        const opening  = t >= KNOWN && t < RUN1;
        const holding  = t >= RUN1;
        const pose = p.moving ? "walk_neutral" : (s.pose || "arms_crossed");
        const gaze = s.gaze || { x:.30, y:.06 };
        placeFig(offctx, W, H, odysseus, {
          x:p.x, y:p.y, hFrac, ar:AR_MAN,
          state:{
            t: p.moving ? (t * 0.46) % 4 : breath,
            guise:"restored", band:"threeq", mirror:true, pose, gaze,
            browUp:   holding ? .42 : opening ? .34 : telling ? .24 : .14,
            browKnit: erupting ? .58 : holding ? .48 : telling ? .30 : .18,
            eyeNarrow:erupting ? .44 : telling ? .30 : .16,
            eyeWide:  opening ? .22 : 0,
            jaw:      erupting ? .46 : telling ? .26 : 0,
            mouthAsym:erupting ? .30 : .12,
            smile:    opening ? .22 : 0,
            frown:    holding ? .54 : erupting ? .26 : 0,
            status: holding  ? "WEEPING"
                  : opening  ? "SHE KNOWS ME"
                  : telling  ? "I BUILT IT MYSELF"
                  : erupting ? "WOMAN, THAT WORD CUTS"
                  : hearing  ? "SHE IS TESTING ME" : "THE KING",
            progress: prog,
          },
          sig:`ody|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${erupting?1:0}|${telling?1:0}|${opening?1:0}|${holding?1:0}`
             + `|${p.moving?1:0}`,
        });

      } else if (who === "penelope"){
        /* the queen: still at her pillar for forty-three seconds, then the one
           crossing of this whole book. In the atlas' upright box (note K). */
        const ordering = t >= ORDER && t < ERUPT;
        const struck   = t >= ERUPT && t < KNOWN;
        const knowing  = t >= KNOWN && t < RUN1;
        const holding  = t >= RUN1;
        const pose = p.moving ? "walk_neutral" : (s.pose || "guarded_withdrawal");
        const gaze = s.gaze || { x:-.36, y:.04 };
        placeFig(offctx, W, H, penelope, {
          x:p.x, y:p.y, hFrac, ar:AR_WOMAN,
          state:{
            t: p.moving ? (t * 0.50) % 4 : breath,
            band:"threeq", pose, gaze,
            mouth:    ordering ? .40 : holding ? -1 : knowing ? .55 : 0,
            browUp:   struck ? .46 : knowing ? .40 : ordering ? .22 : .28,
            browKnit: holding ? .48 : struck ? .38 : .30,
            eyeNarrow:ordering ? .30 : holding ? .34 : .16,
            eyeWide:  struck ? .40 : knowing ? .30 : 0,
            frown:    holding ? .34 : knowing ? .18 : .12,
            status: holding  ? "TWENTY YEARS"
                  : knowing  ? "IT IS HIM"
                  : struck   ? "NOBODY KNOWS THAT"
                  : ordering ? "STREW HIM A BED OUTSIDE"
                  :            "SHE KEEPS HER TEST",
            progress: prog,
          },
          sig:`pen|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${ordering?1:0}|${struck?1:0}|${knowing?1:0}|${holding?1:0}`
             + `|${p.moving?1:0}`,
        });

      } else if (who === "eurycleia"){
        /* the nurse: in on the order, up the stair, and back down with the bed
           made. Her own registered poses (clasp, hush) and no mirror (note I). */
        const walking = p.moving;
        const told    = t >= ORDER && t < UP0;
        const backAgn = t >= BACK0;
        const pose = walking ? "walk_neutral" : (s.pose || "eury_clasp");
        const gaze = s.gaze || { x:-.26, y:.06 };
        placeFig(offctx, W, H, eurycleia, {
          x:p.x, y:p.y, hFrac, ar:AR_WOMAN,
          state:{
            t: walking ? (t * 0.48) % 4 : breath,
            band:"threeq", pose, gaze,
            mouth:    told ? .30 : 0,
            browUp:   told ? .46 : backAgn ? .38 : .34,
            browKnit: backAgn ? .34 : .28,
            eyeWide:  backAgn ? .30 : told ? .24 : 0,
            status: backAgn ? "THE BED IS MADE"
                  : told    ? "OUT OF THE CHAMBER?"
                  : walking ? "SHE IS SENT" : "THE NURSE",
            progress: prog,
          },
          sig:`eur|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${told?1:0}|${backAgn?1:0}|${walking?1:0}`,
        });

      } else if (who === "phemius"){
        /* the bard, put out of the hall and still playing. Never stows the
           phorminx: the noise is the household's only defence. */
        const pose = p.moving ? "walk_neutral" : (s.pose || "three_quarter_left");
        const gaze = s.gaze || { x:-.30, y:.06 };
        placeFig(offctx, W, H, phemius, {
          x:p.x, y:p.y, hFrac, ar:AR_MAN,
          state:{
            t: p.moving ? (t * 0.42) % 4 : breath,
            band:"threeq", pose, gaze, lyre:true,
            mouth:.44, browUp:.28, eyeNarrow:.22,
            status: p.moving ? "PUT OUT, STILL PLAYING" : "A WEDDING SONG",
            progress: prog,
          },
          sig:`phe|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${p.moving?1:0}`,
        });

      } else {
        /* the son: the scoured corner, held all scene. Never mirrored, and
           given only symmetric poses plus an explicit gaze (note I). */
        const hearing = t >= ORDER && t < ERUPT;
        const staring = t >= ERUPT && t < KNOWN;
        const seeing  = t >= KNOWN && t < DAWN0;
        const silent  = t >= DAWN0;
        const pose = s.pose || "three_quarter_right";
        const gaze = s.gaze || { x:.32, y:-.04 };
        placeFig(offctx, W, H, telemachus, {
          x:p.x, y:p.y, hFrac, ar:AR_MAN,
          state:{
            t:breath, band:"threeq", pose, gaze,
            browUp:   staring ? .48 : seeing ? .40 : hearing ? .34 : .22,
            browKnit: silent ? .32 : staring ? .26 : .14,
            eyeWide:  staring ? .38 : seeing ? .24 : 0,
            eyeNarrow:silent ? .28 : .10,
            jaw:      hearing ? .34 : 0,
            frown:    silent ? .18 : 0,
            status: silent  ? "HE SAYS NOTHING"
                  : seeing  ? "HIS MOTHER KNOWS HIM"
                  : staring ? "WHAT BED?"
                  : hearing ? "SHE ORDERED WHAT?" : "HE WAITS",
            progress: prog,
          },
          sig:`tel|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${hearing?1:0}|${staring?1:0}|${seeing?1:0}|${silent?1:0}`,
        });
      }
    }

    /* --- 3. THE BED, on its own station, nearest thing in the room (note F).
       Cast at the order, and it runs its whole machine on this clock. ------ */
    if (t >= ORDER){
      const config = t >= MADE   ? "reunion"
                   : t >= SECRET ? "secret"
                   : t >= ERUPT  ? "false-move"
                   :               "stripped";
      /* REUNION KEEPS THE CUT FLOOR (note F): the bed is made up for them again
         and it has still not moved. Every other state uses the config's own. */
      const cutaway = config === "reunion" ? 0.86 : undefined;
      placeBed(offctx, W, H, {
        config, t:breath, ...(cutaway != null ? { cutaway } : {}),
        status: config === "reunion"    ? "REUNION"
              : config === "secret"     ? "ROOTED"
              : config === "false-move" ? "IMMOVABLE" : "STRIPPED",
        progress: prog,
      }, `bed|${config}|${cutaway ?? "-"}|${Math.round(breath*8)}`);
    }

    /* --- 4. THE HELD DAWN: one keyed window on the near-left wall plane, and
       it is not released in this scene (note G). --------------------------- */
    if (t >= DAWN0){
      const u = clamp01((t - DAWN0) / 8);
      const hold = u, night = lerp(0, 0.66, u), rise = lerp(0.06, 0.30, u);
      placeDawn(offctx, W, H, {
        t: (t - DAWN0) * 0.5, hold, night, rise, watch:1,
        layers:DAWN_LAYERS, status:"HELD", progress:clamp01(0.20 + 0.72 * u),
      }, `dawn|${Math.round(hold*20)}|${Math.round(night*20)}|${Math.round(rise*20)}`);
    }
  },
};
export default scene;

/* named binding so OD-B23-S05 can `import { exitOccupancy as INITIAL }`. */
export const exitOccupancy = scene.exitOccupancy;

/* the same occupancy translated into PURE megaron stations, for any later scene
   that resumes in the hall off the authored plan alone (brief note F: declare
   the map, do not guess). The contact pair folds back onto the two roof-pillars
   — both are free at the end of this scene, and they are the marks the two of
   them have held all book, so the fold costs the join nothing — and the bard is
   DROPPED, because `passage` is not a place in this room: he is out in the
   household corridor and a scene that carries him back onto the floor would be
   putting a body where the story does not have one. Dropping a figure the story
   left on the other side of a door is the same operation as dropping one it left
   in another room. */
const TO_MEGARON = { embrace_l:"pillar_l", embrace_r:"pillar_r", passage:null };
export const exitOccupancyMegaron = Object.fromEntries(
  Object.entries(exitOccupancy)
    .map(([who, st]) => [who, st in TO_MEGARON ? TO_MEGARON[st] : st])
    .filter(([, st]) => st));
