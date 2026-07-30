/* ============================================================
   SCENE  OD-B23-S03 — The False Wedding Noise            (Od. 23.153–230)
   Book XXIII, scene 3. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its hall siblings
   OD-B23-S02, OD-B22-S01 and OD-B21-S01.

   Beats (causal order, one master clock):
     1. Odysseus bathes while Athena restores his stature and beauty.
     2. Phemius plays the lyre and the household dances so neighbours believe a
        wedding is underway.
     3. Odysseus returns radiant, but Penelope still refuses immediate
        recognition.
     4. The king accuses her heart of being harder than stone.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. THE ROOM IS THE SAME ROOM, IN THE SAME STATE. The field is
      location.megaron-hall in state `cleaned`, at anchor (.50,.99) scale 1.0,
      with the same layer list OD-B23-S02 used — so this hall registers to the
      pixel on S02's, and on B19-S02's, B21-S01's and B22-S01's. `throne`,
      `axes` and `litter` are dropped for the reasons S02 recorded: the throne
      plinth stands across the near spine where the son's corner is, and
      `cleaned` draws nothing at all with the other two (M.axes false,
      M.litter "none"). `racks` is kept with bare pegs — the arms are still out
      of the hall, which is why the sound of a wedding is a defence and not a
      decoration.
      NO SECOND ROOM IS BUILT FOR THE BATH. Homer sends Odysseus out of the
      megaron to be washed (23.153: Eurynome bathed him and rubbed him with
      oil); the bath is not this room, and this scene does not invent a second
      field for it. He walks to the plan's `postern` — the side door to the
      passage, the door this house actually uses for everything that is not the
      great doors — and is NOT DRAWN while he is standing on it (see note E).
      The bath happens through that door, off frame, which is where Homer puts
      it.

   B. NO HAND-PLACED ANCHORS FOR ANY BODY. Every body in this file resolves
      through scenes/_plans/megaron.mjs by station NAME, through blockingAt().
      There is not one literal coordinate in the staging of a person. The two
      things in the frame that are NOT bodies — the dance floor and the emitter
      readout — are placed off named stations and off frame furniture
      respectively, and both are argued below (notes F, G). The cast anchors in
      `cast[]` are contract placeholders; stage() overrides every one of them.

   C. THE THREE INHERITED MARKS DO NOT MOVE, AND THE FOURTH BODY KEEPS THE
      RIGHT WALL. S02 exports { penelope:"pillar_r", odysseus:"pillar_l",
      telemachus:"corner_dead" }; all three are megaron stations, so this scene
      needs no translation table (brief note F) and imports the occupancy
      straight. Penelope holds `pillar_r` for the whole scene — she has not
      spent her test and she does not cross the room to a man she will not yet
      know. Telemachus holds `corner_dead` for the whole scene, for the reason
      S02 rendered three times and wrote down: every near diagonal out of the
      middle of this hall passes across one of his parents, and the hearth ring
      eats the centre, so he is given no route. Odysseus leaves `pillar_l` and
      comes back to it (23.164 sits him down again opposite his wife).
      PHEMIUS IS DECLARED, ONCE, AND HE IS THE ONLY NEW BODY. S02's exitState
      ends "the bard sent for", so he opens the scene standing in the household
      doorway (`doorway_maid`) and takes the floor at the foot of the hall stair
      (`stair_up`) when the music starts. That route is two right-wall
      stations — it never leaves the right side of the room, so it crosses
      nobody: measured at 1120x760, at mid-leg he is a 332px body spanning
      x 850–970 while the queen spans 686–796, and at rest at `stair_up` he is
      a 357px body spanning 874–1002 with 78px of clear paper between his
      shoulder and hers. `bench_r1` and `bench_r2` were both checked first and
      both fail: bench_r1 puts him at x 776–902, straight through the queen, and
      bench_r2 leaves 24px, which is nothing once the phorminx — cradled at the
      figure's waist and rising to the shoulder — is added to his left side.

   D. NOBODY TOUCHES ANYBODY, SO THERE IS NO CONTACT PAIR. This is still the
      scene in which the two of them do not close: he comes back a king, walks
      to the pillar opposite hers, and speaks across the fire. The embrace is
      the next scene, after the bed. The four marks used are chosen to stay
      apart at every second, measured at 1120x760 with K = 0.52:
        odysseus   `pillar_l`     (.338,.690)  307px body, x 324–434
        penelope   `pillar_r`     (.662,.690)  305px body, x 686–796
        telemachus `corner_dead`  (.123,.910)  363px body, x  73–203
        phemius    `stair_up`     (.837,.793)  357px body, x 874–1002
      252px of clear paper between the two at the pillars, 121px between the son
      and his father, 78px between the bard and the queen. No two marks are
      occupied at once, and the only two routes in the scene (his to the side
      door and back, and the bard's down his own wall) are on opposite sides of
      the room and cross neither each other nor anybody standing still.
      K IS S02's K AND NOT B22-S01's. 0.42 was tried first, because this scene
      carries five human elements instead of three and a smaller figure would
      have given the dance more floor. It fails at exactly the mark S02
      identified: at 0.42 a body seated against a roof-pillar is 255px tall and
      91px wide, the pillar is painted 57px wide at that depth, and its two hard
      contour lines run down THROUGH the figure. The dance was made to fit the
      room instead (note F).

   E. ONE BODY, ONE RAMP, AND THE RAMP FINISHES WHAT S02 STARTED. Odysseus is
      character.odysseus-b16 throughout — never a cut to
      character.odysseus-restored, which is what the atlas' job list asks for
      and which is precisely the collage the guise channel exists to stop. S02
      held him at { from:"beggar", to:"restored", u:0.44 } and said in writing
      that S03 continues the same ramp from 0.44 to 1 and that the garment snap
      belongs on the frame he comes out of the bath. That is what happens here:
      u runs 0.44 -> 1 across BACK0..RESTORED (t 30–36) while he walks back in
      through the side door, so skin, hair and height interpolate continuously
      and the garment SNAPS at u = 0.5 — which is BENT to land on t = 33, the
      middle of the flare window and the peak of its envelope, for the reason
      recorded at the ramp itself: a straight lerp out of 0.44 fires the snap
      0.64s after the window opens, with the corridor at 11% of its envelope,
      and the t=33 plate showed the flare peaking two and a half seconds AFTER
      the discontinuity it exists to cover.
      divine_fx.athenas-restoration is cast for exactly that window and is
      handed his live resolved box, so the corridor wraps the body that is
      changing — the flare exists to cover the one discontinuity and it is put
      nowhere else.
      HE IS NOT DRAWN BETWEEN GONE AND BACK0. From t = 8, when he arrives at
      `postern`, to t = 30, when he starts back, he is through that door being
      washed, and drawing him standing on the threshold for twenty-two seconds
      would say the opposite of the beat. His station is still resolved by the
      plan for the whole of that time — the occupancy is continuous even though
      the picture is not — so the handoff is unaffected. This is also what makes
      the dance possible: with `pillar_l` empty for the middle third of the
      scene the far floor is free, and the household gets a floor to dance on
      that is not somebody's head.

   F. THE DANCE FLOOR IS ONE STATION, AND IT IS TWO DANCERS, NOT NINE.
      ensemble.household-dancers draws its own hall — a pale wall, a pale floor,
      a dado, garlands and two door slabs — and honours no `layers` state, so
      cast whole it repaints the room. It is therefore blitted as ONE KEYED
      WINDOW of its own floor band, at threshold 0.60 instead of the default
      0.895: the shell's upper field is inkLevel(1) (luminance .859) and its
      floor is inkLevel(2) (.714), and both are cleared by the border flood at
      .60, while the front band's garments (levels 4 and 5, .427 and .286), the
      hard contour, the clap bursts and the stamped-foot rings all survive.
      `showDoors`, `showSound` and `showGuardedFloor` are all false: the megaron
      paints its own doors and this window is laid INSIDE them, the escape arcs
      are struck on a door point 0.795 of the ensemble's own box and would sweep
      in from outside the crop as loose rings with nothing at their centre, and
      the hatched "floor nobody dances over" is the blood — which in a `cleaned`
      hall has been scoured away, so drawing it would contradict the room. What
      IS kept of the ensemble's sound is the part that is attached to a body and
      survives the pitch: the stamped-foot rings and the clap bursts.
      TWO DANCERS, AND THE ARITHMETIC IS THE REASON. The ensemble lays its nine
      members on three internal depth bands whose footlines are .548 / .712 /
      .930 of its box. That spread is far stronger than this hall's projection:
      sized so the front band sits on the far floor, the mid band's feet land at
      y .41 and the back band's at y .26 — up the far wall and in the roof, with
      no floor under either. So the window keeps the FRONT BAND ONLY
      (`depth:"foreground"`), at `spread` 0.60, and crops to its first two
      members: f1, a long chiton stamping, and f2, a short tunic clapping with
      its head broken off the dance toward the doors. f3 is a second stamping
      chiton — the same silhouette as f1 — and cropping it costs the picture
      nothing but buys 130px of paper.
      THE SIZE IS TAKEN FROM THE ARCHITECTURE, NOT FROM THE DEPTH LAW, AND THAT
      IS THE ONE THING THE FIRST PLATE GOT WRONG. The window is laid down so its
      footline falls on `door_main` — the great doors, which is the whole point
      of the noise: it is made just inside the open doors so it goes into the
      street. One station gives both coordinates. Draft 1 then sized the dancers
      off the plan's depth law, which says a body at z .10 is 250px tall, and it
      was rendered and thrown out: location.megaron-hall paints its own great
      doors 224px wide with an opening of 156 x 142px, so a "correct" 250px
      figure standing in that doorway is nearly twice the height of the door it
      is standing in, and two of them at 165px filled the one big light shape in
      the whole composition — the open doorway — with a solid dark mass and took
      the room's brightest plane out of the frame. The plan's depth law and the
      hall's own masonry disagree at this depth, and the masonry wins, because
      the masonry is what the audience measures the body against. The dancers
      are therefore 128px: a shade under the 142px door they stand in front of,
      which is what a person in a doorway looks like.
      At 128px the two of them stand at x 511 and 608 inside a box of x 452–668,
      y 257–419 — which is the doorway, almost exactly (the door leaf runs
      448–672). They are two dark figures framed in the one bright opening in the
      room, on the floor in front of the sill, with 18px of clear paper between
      the near one and the king's pillar (ends x 434) and 18px between the far
      one and the queen's (begins x 686). Their feet at y 409 are 25px above the
      crown of Odysseus' head at 434, so nobody is standing on anybody, and
      117px above the hearth ring (y 526–580), so the fire is not inside
      anyone's tunic.

   G. THE EMITTER DIAGRAM IS CUT, AND IT WAS CUT OFF THE PLATE, NOT ON A HUNCH.
      sound_source.false-wedding-music is a whole-frame diagram in three bands:
      the hall / wall / street section on top, then a reach profile and a
      deception readout, then three rhythm lanes. OD-B23-S02 cast it, rendered
      it and cut it, and wrote down why: at the ~190px the hall wall allows, the
      wall section, the five wavefronts and the two receivers fall below the dot
      pitch and what prints is a scatter of loose rings and a little roof glyph.
      This scene did not take that on trust. It cast a DIFFERENT and much more
      favourable version of the same idea — a tighter crop at a bigger size:
      window x .545–.965, y .070–.435 of the asset's own box (the outdoor half
      only: the palace wall in section, the jambed gate, the two gain chevrons,
      the street fan, the kerb, the two houses, the two passers-by; the hall
      side, the profile, the readout and the rhythm lanes all cropped away),
      blitted keyed at 302 x 261px into the upper-left quarter, which is the one
      region of this composition that is neither architecture nor somebody's
      head. It was rendered at t=21 and read back, and it fails the same way:
      the wall courses print as a ladder of small empty rectangles, the gain
      chevrons as one blob, the two receivers as two loose ring clusters and the
      houses as one 60px roof glyph, with nothing tying them together — a page of
      debris in the corner of a room. Enlarging it is not available: the only
      clear rectangle in this frame is about 360 x 285px, the diagram needs its
      whole width to read as a section at all, and every other 336px square is
      architecture or a head.
      SO THE NOISE IS CARRIED BY THINGS THAT SURVIVE THE HALFTONE, and every one
      of them is already in the frame: the bard's phorminx up and played at the
      foot of the stair; the household's own STAMPED-FOOT RINGS and CLAP BURSTS,
      which the ensemble draws as hard ink at 0.30–0.42 alpha and which come
      through the dot pitch cleanly; the two of them planted in the OPEN GREAT
      DOORS, which is the aperture the sound leaves by, so the picture states the
      geometry the diagram was going to state; the room's own status word; and the
      declared `sound[]` cues and exitState, which hand S04 an emitter that is
      PLAYING, at full reach, and BELIEVED. Nothing in this scene depends on a
      diagram, and nothing in it is type.

   H. ONE MIRROR EACH, AND NOBODY IS SWITCHED. Odysseus is `mirror:true` for the
      whole scene, as in S02 and B22-S01: he stands on the left and every act of
      his goes to screen right — his eyes across at the queen, his arm out to
      her, his hand down to his son. The rig's reaching poses are authored to
      screen left, so the mirror is what puts them on the queen. Nobody else is
      mirrored: the queen and the bard are both on the right and everything of
      theirs goes left, and the son is given only symmetric poses plus an
      explicit gaze. Explicit gaze is applied after the mirror is composed, so
      every gaze in the timeline is already in final screen terms (+x = right).

   I. TONE. The room is `cleaned` — a lift-0 state that lifts the floor one
      level lighter still — and the dance window and the emitter window are both
      keyed, so the paper shows through both of them. Hand-drawn ctx overpaint
      in this file is ZERO: every mark on the plate is made by a module. Nothing
      here draws a full-width band: the hall's near boards stop at x 401 and
      restart at 719, the emitter's wall section is 32px wide and its street
      kerb is a broken line, and the dance window is 289px wide in a 1120px
      frame. The darkest masses are the far doorway's own furniture, the bard's
      phorminx and the five small flames of a fresh fire.

   J. THE BOX A BODY IS DRAWN IN. placeInstance() hands a module a box of the
      STAGE's aspect (1120x760), and character.penelope lays her veil, hair
      drape and skirt out in box-W fractions, so in a landscape box she renders
      as a wide bell with the veil off her shoulder. Every figure is therefore
      blitted through placeFig() into an upright box — 0.75 for the queen, 0.95
      for the three men, who are rig plus (for the bard) one identity prop. The
      rig plants its ankles at 0.90 of its own box, and min(h*0.9, w*1.26) is
      h-limited for any aspect above 0.714, so hFrac = K*p.scale gives all four
      exactly the body height the landscape regime would have given them. Same
      law, same K, same boxes as S02.

   CONTINUITY IN — imported, and for the first time in this book NOT translated:
   OD-B23-S02 exports { penelope:"pillar_r", odysseus:"pillar_l",
   telemachus:"corner_dead" }, all three megaron stations of the room this scene
   plays in, so the occupancy is spread straight into INITIAL and nobody is
   dropped. `phemius:"doorway_maid"` is the one DECLARED addition, and it is
   declared because S02's exitState declares it: the bard has been sent for.

   CONTINUITY OUT — computed, never written:
   { penelope:"pillar_r", odysseus:"pillar_l", telemachus:"corner_dead",
     phemius:"stair_up" }.

   Verify (the dance with the king out of the room, and the accusation):
     node harness/render-scene.mjs scenes/OD-B23-S03.mjs --t 21
     node harness/render-scene.mjs scenes/OD-B23-S03.mjs --t 60
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, lerp }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import penelope    from "../assets/character/penelope.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import phemius     from "../assets/character/phemius.mjs";
import dancers     from "../assets/ensemble/household-dancers.mjs";
import restoration from "../assets/divine_fx/athenas-restoration.mjs";
/* sound_source.false-wedding-music is deliberately NOT imported: see note G.
   It was cast, rendered and cut. The noise is on the bodies and the doors. */

const FIELD_ASSET = "location.megaron-hall";
const D = 68;

/* the scoured hall, minus the throne plinth that swallows the near spine and
   the two layers `cleaned` draws nothing with (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth","furniture"];

/* ---- THE CLOCK ---------------------------------------------------------- */
const BATH0    =  3;   // he gets up from the pillar and goes to be washed
const GONE     =  8;   // he is through the side door; not drawn from here
const BARD     = 11;   // the bard leaves the household doorway
const CUE      = 15;   // the emitter, cued: nothing out through the wall yet
const MUSIC    = 17;   // the lyre; the household comes in by the great doors
const FLOOR    = 24;   // the floor is up and the bed is carrying into the street
const BACK0    = 30;   // he comes back out of the passage
const RESTORED = 36;   // the ramp completes: the king, whole
const BACK1    = 38;   // he arrives back at the left roof-pillar
const SEATED   = 39;   // down again at the pillar opposite hers
const BELIEVED = 44;   // outside, the town has decided the queen has married
const REFUSE   = 48;   // and she still will not know him
const STONE    = 56;   // "no other woman's heart would be this hard"

/* ---- CONTINUITY IN: imported, untranslated (all megaron stations) -------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B23-S02.mjs";
const INITIAL = {
  ...PREV_EXIT,            // penelope pillar_r, odysseus pillar_l, telemachus corner_dead
  phemius:"doorway_maid",  // sent for at the end of S02; waiting in the household door
};

/* ---- BLOCKING. Stations, not coordinates (notes B, C). ------------------- */
const MOVES = [
  // out to the bath through the side door, and back a king
  { who:"odysseus", from:"pillar_l",     to:"postern",   t0:BATH0, t1:GONE  },
  { who:"odysseus", from:"postern",      to:"pillar_l",  t0:BACK0, t1:BACK1 },
  // the bard down his own wall to the foot of the stair, and no further
  { who:"phemius",  from:"doorway_maid", to:"stair_up",  t0:BARD,  t1:MUSIC - 1 },
  // NOBODY ELSE MOVES (note C): the queen keeps her test and her pillar, and the
  // son has no clean route out of the corner he had scoured.
];

/* ---- THE RAMP. One u drives the body AND the flare (note E). -------------
   THE RAMP IS BENT, ON PURPOSE, AND THE BEND IS THE WHOLE POINT OF PUTTING A
   FLARE HERE AT ALL. S02 leaves him at u=0.44 and the garment snaps at u=0.5,
   so a straight 0.44 -> 1 lerp across a six-second window fires the snap 0.64s
   after the window opens — at which point the restoration corridor is at 11% of
   its envelope and covers nothing. Rendered at t=33 that is exactly what
   happened: the flare peaked two and a half seconds AFTER the discontinuity it
   exists to hide. So the ramp crawls through the last sliver of beggar and runs
   after it: 0.44 -> 0.50 over BACK0..SNAP, then 0.50 -> 1 over SNAP..RESTORED.
   The snap now lands on SNAP=33, which is the middle of the flare window and
   the peak of its envelope. Continuous params (skin, hair, height) still travel
   the whole way; only their pacing changes. */
const R0 = BACK0, R1 = RESTORED, SNAP = 33;
const ramp = t => t <= R0   ? 0.44
              : t >= R1     ? 1
              : t <= SNAP   ? lerp(0.44, 0.50, (t - R0) / (SNAP - R0))
              :               lerp(0.50, 1.00, (t - SNAP) / (R1 - SNAP));
/* he is off frame between arriving at the side door and starting back */
const offstage = t => t >= GONE && t < BACK0;

/* ---- ONE FIGURE SCALE for the whole cast; the plan's depth law does the
   rest (note D). Same K as OD-B23-S02, for the same rendered reason. ------- */
const K = 0.52;

/* ---- placeFig — blit a module into an upright box anchored on the rig's own
   floor line (note J). `sig` is required: keyedModuleCanvas caches on
   pose/band/t only, so without it a change of gaze or brow returns the
   previous frame's canvas. -------------------------------------------------- */
const AR_QUEEN  = 660 / 880;     // the atlas' character box
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

/* ---- THE DANCE FLOOR (note F) -------------------------------------------
   The window is measured in the ensemble's own box: its front band stands its
   feet on 0.930 of the box at a member unit of 0.315, so a member's ink runs
   from footY - 0.894u (head crown) to footY + 0.010u (the strike rings), and
   reaches 0.111 of the box either side of its centre once the arms are out. At
   `spread` 0.60 the three front members centre on 0.326 / 0.506 / 0.680; this
   window opens 0.115 outboard of the first and closes 0.115 outboard of the
   second, and its top edge at 0.622 clears the crowns at 0.6484 while cutting
   the shell's dado, garlands and the broken dance-track dashes above them. */
const DANCE_CW = 760, DANCE_CH = 760;
const DANCE_WIN  = { x0:.208, y0:.622, x1:.624, y1:.948 };
const DANCE_FEET = .930;         // the band's footline, in the ensemble's box
const DANCE_UNIT = .2378;        // a front-band body's height, in box heights
const DANCE_BODY = 128;          // px on the plate — off the DOOR, not the depth
                                 // law: the hall paints its opening 142px tall
                                 // and a person in a doorway is just under it
                                 // (note F; 165 was rendered and thrown out)
const DANCE_THR  = 0.60;         // clears the ensemble's own pale hall (note F)
function danceDst(W, H){
  const wx = DANCE_WIN.x1 - DANCE_WIN.x0, wy = DANCE_WIN.y1 - DANCE_WIN.y0;
  const h  = DANCE_BODY * wy / DANCE_UNIT;      // window height, on the plate
  const w  = h * wx / wy;                       // undistorted
  const p  = megaron.at("door_main");           // ONE station: just inside the doors
  const fy = (DANCE_FEET - DANCE_WIN.y0) / wy;  // where the footline sits in the window
  return { x: p.x * W - 0.5 * w, y: p.y * H - fy * h, w, h, d: p.d };
}
function placeDance(offctx, W, H, state){
  const dst = danceDst(W, H);
  const sig = `hd|${Math.round((state.beat ?? 0) * 24)}`
            + `|${Math.round((state.wave ?? 0) * 20)}`
            + `|${Math.round((state.secret ?? 0) * 20)}`
            + `|${Math.round((state.attention ?? 0) * 20)}`;
  const cv = keyedModuleCanvas(dancers, DANCE_CW, DANCE_CH, state, sig, DANCE_THR);
  offctx.drawImage(cv,
    DANCE_WIN.x0 * DANCE_CW, DANCE_WIN.y0 * DANCE_CH,
    (DANCE_WIN.x1 - DANCE_WIN.x0) * DANCE_CW,
    (DANCE_WIN.y1 - DANCE_WIN.y0) * DANCE_CH,
    dst.x, dst.y, dst.w, dst.h);
}

/* THE EMITTER READOUT that used to live here — the diagram's outdoor half,
   window x .545–.965 / y .070–.435, keyed at 302 x 261px into the upper-left
   quarter — is CUT. It was written, rendered at t=21 and read back off the
   plate, and it printed as debris (note G). The window and the destination are
   left recorded in note G so the next agent does not spend the render. */

export const scene = {
  id:"OD-B23-S03",
  title:"The False Wedding Noise",
  book:23,
  plan:"megaron",
  duration:D,
  beats:[
    "Odysseus bathes while Athena restores his stature and beauty.",
    "Phemius plays the lyre and the household dances so neighbours believe a wedding is underway.",
    "Odysseus returns radiant, but Penelope still refuses immediate recognition.",
    "The king accuses her heart of being harder than stone.",
  ],
  exitState:
    "Night in the scoured hall, and the house is roaring. The false wedding is " +
    "PLAYING and it is BELIEVED: Phemius holds the lyre at the foot of the hall " +
    "stair (`stair_up`) and does not stop, two of the household stamp and clap " +
    "on the floor just inside the open great doors, and the bed of noise is " +
    "carrying through the palace wall and out into the street, where the town " +
    "has decided the queen has married at last instead of counting its dead " +
    "sons. sound_source.false-wedding-music is at full intensity, full reach, " +
    "believed:true, and it is NOT stopped — it runs on under the whole of the " +
    "next scene. Odysseus has been washed and Athena has finished him: he is " +
    "ONE body at guise u=1, `restored`, the ramp S02 held at 0.44 completed " +
    "across his walk back in from the side door, the garment snapped at u=0.5 " +
    "under the restoration flare and nothing cut. He is back down against the " +
    "left roof-pillar (`pillar_l`) opposite his wife, taller and darker-haired " +
    "than the man who left the room, and he has said the last thing this scene " +
    "exists for: no other woman's heart would hold out against her husband like " +
    "this — hers is harder than stone. Penelope holds the right roof-pillar " +
    "(`pillar_r`) across the fire, and SHE HAS STILL NOT SAID HIS NAME. She has " +
    "watched him come back changed and has not risen, not crossed, not spoken " +
    "the word; she has one test left and it is the bed, and it is still hers to " +
    "spend. Telemachus has not moved out of the near-left corner " +
    "(`corner_dead`) he had scoured; he has seen his father made whole and has " +
    "said nothing to his mother since she was answered. Nobody in the room has " +
    "touched anybody. S04 opens on exactly this: the same hall, the same four " +
    "marks, the noise still going out through the wall, and the bed to come.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    odysseus:"none — he is already down against `pillar_l`, inherited from S02. " +
             "He EXITS to the bath through `postern` at t=3 and RE-ENTERS " +
             "through it at t=30 (note E)",
    penelope:"none — she holds `pillar_r` from the first frame to the last",
    telemachus:"none — he is already in the near-left corner (`corner_dead`)",
    phemius:"entrance:household door (`doorway_maid`) — declared, because S02's " +
            "exitState declares him sent for; he is standing in that doorway at " +
            "t=0 and takes the floor at BARD=11",
    dancers_01:"entrance:great doors — the household comes in on the order at " +
               "MUSIC=17 and dances on the floor in the open `door_main`",
    noise:"NOT AN INSTANCE IN THIS SCENE (note G). The emitter is CUED at t=15 " +
          "by S02's handoff, struck at MUSIC=17, carrying at FLOOR=24 and " +
          "believed at 44, and all four are carried on the bodies, the open " +
          "doors and the declared `sound[]` cues — the diagram itself was cast, " +
          "rendered and cut",
    restore_01:"not a body: exists only for the guise snap, t=30..36",
  },
  exits:{
    odysseus:"none at the end — he holds `pillar_l` into S04. His one exit is " +
             "mid-scene and it is the bath: `postern`, t=8..30, off frame",
    penelope:"none — she holds `pillar_r` into S04",
    telemachus:"none — he holds `corner_dead` into S04",
    phemius:"none — he holds `stair_up` into S04, still playing",
    dancers_01:"none — the floor is still up when the scene ends",
    noise:"none to make — the bed is HELD, not decayed; S04 inherits it playing",
  },
  walkable:"the megaron's own `walkable` band (x .12–.88, y .55–.98) minus the " +
           "exclusions this scene respects: the hearth ring (screen x 475–645, " +
           "y 526–580), the four bench boxes and two board boxes `cleaned` puts " +
           "back in order, and the near throne footprint — which is why the " +
           "`throne` layer is dropped rather than walked over. Two routes are " +
           "used and they are on opposite walls: `pillar_l`<->`postern` on the " +
           "left, `doorway_maid`->`stair_up` on the right. The dance occupies " +
           "the far floor inside `door_main` and nobody walks through it.",
  depthOrder:"one queue, computed: the hall's layers; then the dance window, " +
             "whose station `door_main` is the farthest ground in the room " +
             "(d .10); then the four figures sorted by their own resolved plan " +
             "depth so " +
             "the nearer body is drawn later — the bard (d .40 rising to .66) " +
             "and the two at the pillars (d .44) before the son (d .90); then " +
             "the restoration flare, which is over everything because it is " +
             "light and not a thing in the room.",
  gazeTargets:{
    odysseus:"across the fire at her before he goes; the side door as he goes; " +
             "on the way back, the floor and then straight at her; at his son " +
             "once, for the noise; and at the end fixed on her and nowhere else",
    penelope:"his face and his poor clothing while he is still in the room; the " +
             "dance floor and the doors while he is gone — she is listening to " +
             "her own false wedding; then him, from the moment he comes back " +
             "through the door, without moving her body; and at the end still " +
             "him, and still no name",
    telemachus:"the household doorway for the bard; the dance floor; up-right at " +
               "his father coming back restored; then down, and across at his " +
               "mother, and nothing said",
    phemius:"the strings, then the floor he is playing for, then the great doors " +
            "and the street beyond them — he is playing at the town, not at the " +
            "room",
    dancers_01:"the dance for most of them; f2's head breaks off it toward the " +
               "doors (`secret`), and the composure wave sweeps that face back " +
               "onto the mask as the town starts to believe it",
  },
  attachments:[
    { at:BATH0, who:"odysseus", change:"nothing in his hands; he leaves the pillar " +
      "for the bath through the side door" },
    { at:GONE,  who:"odysseus", change:"OFF FRAME through `postern`: washed and " +
      "oiled, and Athena's work begins on him out there" },
    { at:BACK0, who:"odysseus", change:"the guise ramp opens, u 0.44 -> 1; the " +
      "garment SNAPS at u=0.5 (bent to t=33) and divine_fx.athenas-restoration is on " +
      "exactly that window, keyed to his live resolved box" },
    { at:MUSIC, who:"phemius",  change:"the phorminx comes up off his waist and is " +
      "played; `lyre:true` for the whole scene, never stowed" },
    { at:MUSIC, who:"dancers_01", change:"the household attaches to the floor " +
      "inside the great doors and does not leave it" },
    { at:"never", who:"penelope", change:"nothing in her hands, and nothing " +
      "changes: she does not rise, cross, or speak his name in this scene" },
  ],
  sound:[
    { at:BATH0, source:"postern",   cue:"a door on the passage; water poured in another room" },
    { at:BARD,  source:"doorway_maid", cue:"the bard's feet on the flags, and the phorminx knocking once against his hip" },
    { at:CUE,   source:"stair_up",  cue:"two strings tried, and the hall going quiet to listen" },
    { at:MUSIC, source:"stair_up",  cue:"the lyre — a bridal measure, played much too loud for four people" },
    { at:MUSIC + 2, source:"door_main", cue:"feet on the floor: stamping, clapping, women's voices raised on purpose" },
    { at:FLOOR, source:"door_main", cue:"the bed of it going out through the wall — the street starts to hear a wedding" },
    { at:BACK0, source:"postern",   cue:"one man's step coming back in, and nobody but the queen hears it over the noise" },
    { at:BELIEVED, source:"door_main", cue:"the town, outside, saying it: she has married at last" },
    { at:STONE, source:"pillar_l",  cue:"under all of it, level and hard: no other woman's heart would be like this" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"cleaned" },
    { asset:"ensemble.household-dancers", instance:"dancers_01",
      anchor:{x:.500,y:.538}, scale:.20 },
    { asset:"character.phemius", instance:"phemius",
      anchor:{x:.837,y:.793}, scale:.55, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.338,y:.690}, scale:.46, band:"threeq", pose:"arms_crossed" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.662,y:.690}, scale:.46, band:"threeq", pose:"arms_crossed" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.123,y:.911}, scale:.62, band:"threeq", pose:"three_quarter_right" },
    { asset:"divine-fx.athenas-restoration", instance:"restore_01",
      anchor:{x:.50,y:.99}, scale:1.0 },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at:0.0,      args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",   at:0.0,      args:{ gaze:{ x:.30, y:.08 } } },
    { op:"actor.pose", target:"penelope",   at:0.0,      args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"penelope",   at:0.0,      args:{ gaze:{ x:-.34, y:.10 } } },
    { op:"actor.pose", target:"telemachus", at:0.0,      args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"telemachus", at:0.0,      args:{ gaze:{ x:.34, y:-.04 } } },
    { op:"actor.pose", target:"phemius",    at:0.0,      args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"phemius",    at:0.0,      args:{ gaze:{ x:-.30, y:.06 } } },
    // 1. the bath
    { op:"actor.gaze", target:"odysseus",   at:BATH0,    args:{ gaze:{ x:-.24, y:.10 } } },
    { op:"actor.gaze", target:"penelope",   at:BATH0,    args:{ gaze:{ x:-.40, y:.06 } } },
    // 2. the bard, the lyre, the floor
    { op:"actor.pose", target:"telemachus", at:BARD,     args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"telemachus", at:BARD,     args:{ gaze:{ x:.42, y:-.10 } } },
    { op:"actor.pose", target:"phemius",    at:CUE,      args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"phemius",    at:CUE,      args:{ gaze:{ x:-.10, y:.34 } } },
    { op:"actor.gaze", target:"phemius",    at:MUSIC,    args:{ gaze:{ x:-.36, y:.02 } } },
    { op:"actor.pose", target:"telemachus", at:MUSIC,    args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:MUSIC,    args:{ gaze:{ x:.30, y:-.16 } } },
    { op:"actor.gaze", target:"penelope",   at:MUSIC,    args:{ gaze:{ x:-.16, y:-.22 } } },
    { op:"actor.pose", target:"phemius",    at:FLOOR,    args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"phemius",    at:FLOOR,    args:{ gaze:{ x:-.42, y:-.14 } } },
    // 3. he comes back
    { op:"fx.play",    target:"restore_01", at:BACK0,    args:{ dir:"restore" } },
    { op:"actor.gaze", target:"penelope",   at:BACK0,    args:{ gaze:{ x:-.38, y:.02 } } },
    { op:"actor.pose", target:"odysseus",   at:BACK1,    args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus",   at:BACK1,    args:{ gaze:{ x:.36, y:.00 } } },
    { op:"actor.pose", target:"telemachus", at:BACK1,    args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"telemachus", at:BACK1,    args:{ gaze:{ x:.28, y:-.24 } } },
    { op:"actor.pose", target:"penelope",   at:SEATED,   args:{ pose:"guarded_withdrawal" } },
    // 4. she will not, and he says what her heart is
    { op:"actor.pose", target:"odysseus",   at:REFUSE,   args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:REFUSE,   args:{ gaze:{ x:.40, y:.04 } } },
    { op:"actor.pose", target:"telemachus", at:REFUSE,   args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"telemachus", at:REFUSE,   args:{ gaze:{ x:.10, y:.34 } } },
    { op:"actor.pose", target:"odysseus",   at:STONE,    args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",   at:STONE,    args:{ gaze:{ x:.34, y:-.02 } } },
    { op:"actor.pose", target:"penelope",   at:STONE,    args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"penelope",   at:STONE,    args:{ gaze:{ x:-.36, y:-.02 } } },
    { op:"timeline.capture", target:"OD-B23-S03", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.08 + 0.88 * (t / D));
    const u      = ramp(t);
    const changing = t > R0 && t < R1;
    const gone   = offstage(t);

    /* --- 1. THE HALL, `cleaned` (note A). It paints the room; everything else
       keys onto it. Placed like every other Book XVI+ hall scene. --------- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"cleaned", t:breath, layers:HALL_LAYERS,
        status: t < GONE     ? "HE GOES TO BE WASHED"
              : t < MUSIC    ? "THE BARD IS SENT FOR"
              : t < FLOOR    ? "STRIKE UP A WEDDING"
              : t < BACK0    ? "LET THE STREET HEAR IT"
              : t < SEATED   ? "ATHENA FINISHES HIM"
              : t < REFUSE   ? "THE KING, WHOLE"
              : t < STONE    ? "STILL SHE WILL NOT"
              :                "HARDER THAN STONE",
        progress: prog,
      },
    });

    /* --- 2. THE DANCE, on the floor in the open great doors (note F).
       The farthest ground in the room, so it is drawn before every body.
       Nothing is laid in this room's air; the emitter diagram is cut (note G). */
    if (t >= MUSIC){
      const on   = clamp01((t - MUSIC) / 6);         // the floor filling up
      const beat = (t * 0.92) % 1;                   // deterministic rhythm
      placeDance(offctx, W, H, {
        formation:"line", depth:"foreground", density:1.0, spread:0.60,
        beat,
        secret:    lerp(1.0, 0.72, clamp01((t - MUSIC) / (BELIEVED - MUSIC))),
        wave:      clamp01((t - MUSIC - 4) / (BELIEVED - MUSIC)),
        waveLag:   0.75,
        attention: lerp(0.95, 0.35, clamp01((t - MUSIC) / (BELIEVED - MUSIC))),
        showDoors:false, showSound:false, showGuardedFloor:false,
        status: t >= BELIEVED ? "BELIEVED" : t >= FLOOR ? "STAMPING" : "DANCING",
        progress: lerp(0.20, 0.92, on),
      });
    }

    /* --- 3. THE BODIES, nearer drawn later (note D). --------------------- */
    const order = ["phemius", "odysseus", "penelope", "telemachus"]
      .filter(who => !(who === "odysseus" && gone))
      .sort((a, b) => (blk[a].d - blk[b].d) || (blk[a].x - blk[b].x));

    for (const who of order){
      const p = blk[who];
      const s = st[who] || {};
      const hFrac = K * p.scale;

      if (who === "odysseus"){
        /* ONE BODY, ONE RAMP (note E). Mirrored once and never switched
           (note H): he stands on the left and everything he does goes right. */
        const guise  = u >= 1 ? "restored" : { from:"beggar", to:"restored", u };
        const going  = t >= BATH0 && t < GONE;
        const coming = t >= BACK0 && t < BACK1;
        const whole  = t >= BACK1 && t < REFUSE;
        const asking = t >= REFUSE && t < STONE;
        const hard   = t >= STONE;
        const pose = p.moving ? "walk_neutral" : (s.pose || "arms_crossed");
        const gaze = s.gaze || { x:.30, y:.08 };
        placeFig(offctx, W, H, odysseus, {
          x:p.x, y:p.y, hFrac, ar:AR_MAN,
          state:{
            t: p.moving ? (t * 0.44) % 4 : breath,
            guise, band:"threeq", mirror:true, pose, gaze,
            browUp:   coming ? .34 : whole ? .28 : asking ? .22 : .12,
            browKnit: hard ? .56 : asking ? .38 : going ? .28 : .16,
            eyeNarrow:hard ? .44 : going ? .34 : .18,
            eyeWide:  coming ? .16 : 0,
            jaw:      hard ? .40 : asking ? .30 : 0,
            mouthAsym:hard ? .34 : whole ? .18 : .10,
            smile:    whole ? .20 : 0,
            frown:    hard ? .30 : 0,
            status: hard   ? "HARDER THAN STONE"
                  : asking ? "NO OTHER WOMAN WOULD"
                  : whole  ? "HE IS HIMSELF AGAIN"
                  : coming ? "ATHENA'S WORK"
                  : going  ? "TO BE WASHED" : "HE WILL BATHE",
            progress: prog,
          },
          sig:`ody|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${Math.round(u*40)}|${going?1:0}|${coming?1:0}|${whole?1:0}`
             + `|${asking?1:0}|${hard?1:0}|${p.moving?1:0}`,
        });

      } else if (who === "penelope"){
        /* the queen: perfectly still for sixty-eight seconds, in the atlas'
           upright character box (note J). Only her face moves. */
        const listening = t >= MUSIC && t < BACK0;
        const watching  = t >= BACK0 && t < REFUSE;
        const refusing  = t >= REFUSE;
        const pose = s.pose || "arms_crossed";
        const gaze = s.gaze || { x:-.34, y:.10 };
        placeFig(offctx, W, H, penelope, {
          x:p.x, y:p.y, hFrac, ar:AR_QUEEN,
          state:{
            t:breath, band:"threeq", pose, gaze,
            mouth: 0,
            browUp:   watching ? .40 : refusing ? .26 : listening ? .30 : .28,
            browKnit: refusing ? .42 : watching ? .30 : .32,
            eyeNarrow:refusing ? .34 : listening ? .28 : .18,
            eyeWide:  watching ? .30 : 0,
            frown:    refusing ? .26 : listening ? .20 : .14,
            jaw:      0,
            status: refusing  ? "SHE WILL NOT KNOW HIM"
                  : watching  ? "SOMETHING IS CHANGED"
                  : listening ? "HER OWN WEDDING, FAKED"
                  :             "SHE KEEPS HER TEST",
            progress: prog,
          },
          sig:`pen|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${listening?1:0}|${watching?1:0}|${refusing?1:0}`,
        });

      } else if (who === "phemius"){
        /* the bard: the household door, then the foot of the stair, then he
           does not stop. The phorminx is never stowed. */
        const playing  = t >= MUSIC;
        const carrying = t >= FLOOR;
        const pose = p.moving ? "walk_neutral" : (s.pose || "three_quarter_left");
        const gaze = s.gaze || { x:-.30, y:.06 };
        placeFig(offctx, W, H, phemius, {
          x:p.x, y:p.y, hFrac, ar:AR_MAN,
          state:{
            t: p.moving ? (t * 0.42) % 4 : breath,
            band:"threeq", pose, gaze, lyre:true,
            mouth:    playing ? (carrying ? .62 : .44) : 0,
            browUp:   playing ? .30 : .18,
            browKnit: carrying ? .26 : .20,
            eyeNarrow:playing ? .24 : .12,
            status: carrying ? "LOUD ENOUGH FOR THE STREET"
                  : playing  ? "A WEDDING SONG"
                  : p.moving ? "HE TAKES THE FLOOR" : "THE BARD, SENT FOR",
            progress: prog,
          },
          sig:`phe|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${playing?1:0}|${carrying?1:0}|${p.moving?1:0}`,
        });

      } else {
        /* the son: the scoured corner, held all scene. Never mirrored, and
           given only symmetric poses plus an explicit gaze (note H). */
        const calling = t >= BARD && t < MUSIC;
        const hearing = t >= MUSIC && t < BACK1;
        const seeing  = t >= BACK1 && t < REFUSE;
        const silent  = t >= REFUSE;
        const pose = s.pose || "three_quarter_right";
        const gaze = s.gaze || { x:.34, y:-.04 };
        placeFig(offctx, W, H, telemachus, {
          x:p.x, y:p.y, hFrac, ar:AR_MAN,
          state:{
            t:breath, band:"threeq", pose, gaze,
            browUp:   seeing ? .50 : calling ? .34 : .24,
            browKnit: silent ? .38 : hearing ? .22 : .14,
            eyeWide:  seeing ? .40 : 0,
            eyeNarrow:silent ? .26 : hearing ? .18 : .10,
            jaw:      calling ? .42 : seeing ? .22 : 0,
            frown:    silent ? .22 : 0,
            status: silent  ? "HE SAYS NOTHING"
                  : seeing  ? "HIS FATHER, WHOLE"
                  : hearing ? "THE HOUSE IS ROARING"
                  : calling ? "THE BARD, AND THE FLOOR"
                  :           "HE HOLDS THE ORDER",
            progress: prog,
          },
          sig:`tel|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${calling?1:0}|${hearing?1:0}|${seeing?1:0}|${silent?1:0}`,
        });
      }
    }

    /* --- 4. THE FLARE: the same u as the body, keyed to where the body
       actually is, and on nothing but the snap window (note E). ----------- */
    if (changing && !gone){
      const p  = blk.odysseus;
      const uu = clamp01((t - R0) / (R1 - R0));
      placeInstance(offctx, W, H, restoration, {
        anchor:{ x:.50, y:.99 }, scale:1.0,
        state:{
          t:uu, dir:"restore", spark:1.0,
          figure:{ x:p.x, y:p.y, w:0.22 * p.scale, h:0.64 * p.scale },
          status:"RESTORING", progress:uu,
        },
      });
    }
  },
};
export default scene;

/* named binding so OD-B23-S04 can `import { exitOccupancy as INITIAL }`.
   All four marks are megaron stations and S04 plays in this same hall, so it
   needs no translation table. */
export const exitOccupancy = scene.exitOccupancy;
