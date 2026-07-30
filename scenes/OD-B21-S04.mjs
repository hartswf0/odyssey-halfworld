/* ============================================================
   SCENE  OD-B21-S04 — Odysseus Recruits the Herdsmen      (Od. 21.188–244)
   Book XXI, scene 4. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its immediate
   predecessor OD-B21-S03, whose computed exit occupancy this scene imports.

   Beats (causal order, one master clock):
     1. Antinous has put the bow by until tomorrow, and the beggar follows the
        two herdsmen OUT of the hall by the side door into the private flank of
        the yard — the one piece of the compound the men in the hall cannot see
        into. He tests them there: if a god put Odysseus in this yard this
        minute, which side would you be on?
     2. They answer without hedging. Philoetius prays for the day; Eumaeus prays
        for it too, and the answer is what buys them the truth.
     3. He draws the rag back off his right thigh and shows them the tusk wound,
        and says the words: I am he, home in the twentieth year.
     4. Both men read the mark, both know it, and they take hold of him and weep
        on the blind ground behind the wall.
     5. He stops the weeping before it can be heard indoors and gives three
        orders that are all geography: Eumaeus is to put the bow and quiver into
        his hands when he asks for them, Philoetius is to shut the courtyard gate
        and lash it fast, and between them they are to bolt the women in.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. NOTHING HAND-PLACED. Every body in this scene is resolved by STATION NAME
      through a plan, and `blockingAt()` does the arithmetic. There is not one
      invented coordinate in the blocking table.

   B. THE PLAN IS THE SET'S OWN (brief §A, "author a small local plan"). This
      scene plays OUTDOORS, so it is not the megaron and not the hut — but the
      outdoor set it plays on, `location.palace-outer-yard`, was authored for
      exactly this scene and it ALREADY EXPORTS a `makePlan()` of its own, with
      its anchors projected from that plan rather than eyeballed. Authoring a
      second, private table of yard stations here would be the collage mistake
      the brief exists to stop: two tables for one yard, and the paint agreeing
      with neither. So the local plan below is built with `makePlan()` as the
      brief asks, but its station table OPENS with the set's own stations, and
      adds exactly THREE — the three places outside the side door the men are
      standing on when the scene opens. Every other name this scene uses
      (`oath_l`/`oath_c`/`oath_r`, `lee_wall`, `gate_sill`, `door_sill`,
      `oath_watch`) is the SET'S, so a body on it stands on ground the set has
      painted for it: the oath trio lands exactly on the three pairs of
      footprints the `oath` state scuffs into the dirt.

   C. CONTACT TRIO, not a contact pair (brief §B). Three men embrace here, so
      two paired stations are not enough. The set ships `oath_l` / `oath_c` /
      `oath_r` — three stations 0.09 apart in plan x on the blind patch — and
      this scene widens that gauge to 0.12 as `stand_l` / `stand_c` / `stand_r`,
      DERIVED from the set's three by a declared offset rather than invented,
      because draft 1 rendered the set's own spacing as one tangle with three
      heads on it. The three bodies now resolve about 110px apart on a 1120px
      frame, which at this figure height is an embrace and not a collision, and
      they are still inside the trodden ellipse the `oath` state paints. Nobody
      is ever assigned a station another body holds.

   D. ONE BODY, ONE GUISE CHANNEL (brief §C). Odysseus is
      `character.odysseus-b16` with `guise:"beggar"`, and he STAYS in rags —
      Athena does not touch him in this scene and there is no restoration flare,
      because the proof offered here is not a new body, it is an old scar. But
      the recognition is not nothing, so the guise channel carries it: from the
      declaration onward the guise becomes `{from:"beggar", to:"king", u}` with
      u ramping only to 0.34. That is BELOW the module's `snapAt` of 0.5, so the
      garment does NOT snap — the rags stay rags — while scale, skin and hair
      colour lerp continuously and the beggar's stoop comes out of him in front
      of the two men who have just been told who he is. One body, no cut, and
      the one discontinuity the guise channel has is never crossed.

   E. THE ROOM IS STATE (brief §D). One field, `location.palace-outer-yard`,
      cast ONCE, with its state channel driven by the clock: `private` while the
      test is being put and the scar shown, then `oath` from the moment the
      pledge closes — which lays the three pairs of footprints into the patch
      the three men are standing on. The gate is NOT barred here: that is S06's
      work and S06's state.

   F. THE PROOF IS A PLATE, NOT A BODY PART. `set_piece.scar-proof` is a
      deposition diagram — an aperture cut in the rag, the welt, two witness
      sightline cones, a tally of assents and an oath seal. It is not a limb to
      be pasted onto a 200px figure; it is the EXHIBIT, and it is laid into the
      frame the way OD-B21-S03 lays its tallow panel: a windowed plate over its
      own paper field and one hard rule, top right, on sky the set leaves empty.
      Its four modes are stepped by the same clock that moves the bodies —
      covered while his hand is still going down to the rag, presented when the
      flaps are clamped back, witnessed when both men have looked, sworn when
      the pledge closes. The plate and the men are one event.

   G. SHEET SIZE IS THE WHOLE TRICK (device verbatim from OD-B21-S03). The proof
      plate's rules are typed in FIXED PIXELS, so drawn on its 660x880 design
      sheet and blitted down to the 282px the sky can spare — a 0.44 reduction —
      every rule in it lands at under 2px and the welt prints as a scatter of
      stray dots. Drawn instead on a 330x440 sheet the geometry halves while
      those fixed rules do not, so the same window blits at 0.89 and the plate
      keeps a hard contour the dot lattice can actually resolve.

   H. ONE DEPTH QUEUE. Everything standing on this floor is pushed with its live
      blocked z and drawn far -> near, so the near herdsmen close in FRONT of
      the man they are taking hold of and nobody is stacked wrong.

   I. STRUCTURED HANDOFF (brief §E/§G). `exitOccupancy` is computed by
      `occupancyAt()` and exported as a NAMED binding. S05 goes back inside, so
      it will have to translate these yard stations into hall stations — the map
      belongs to the scene that crosses the threshold, not to this one.

   Verify:
     node harness/render-scene.mjs scenes/OD-B21-S04.mjs --t 10   (coming out)
     node harness/render-scene.mjs scenes/OD-B21-S04.mjs --t 56   (the embrace)
     node harness/render-scene.mjs scenes/OD-B21-S04.mjs --t 72   (the orders)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import yard, { plan as YARD_PLAN } from "../assets/location/palace-outer-yard.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import philoetius from "../assets/character/philoetius.mjs";
import proof      from "../assets/set_piece/scar-proof.mjs";

/* CONTINUITY IN — the previous scene's computed exit occupancy. */
import { exitOccupancy as PREV_EXIT } from "./OD-B21-S03.mjs";

const FIELD_ASSET = "location.palace-outer-yard";
const D = 80;

/* ---- THE LOCAL PLAN (note B) --------------------------------------------
   The set's own stations, plus the three the door needs. The three added ones
   are the only new geometry in this file, and they exist for one reason: three
   men who have just come through one doorway must not open the scene on top of
   each other. The set's `door_sill` / `door_foot` are 24px apart on a 1120px
   frame, which is fine for a prop and useless for two bodies, so the men open
   from three stations spread across the door's own step and staggered in depth,
   ordered left -> right to MATCH the left -> right order of the oath trio they
   walk to. That ordering is what keeps three lanes from crossing: nobody
   overtakes anybody, so no two bodies ever converge on one point. */
const YS = YARD_PLAN.stations;
/* THE CONTACT TRIO, RE-GAUGED (note C). The set's own `oath_l`/`oath_c`/`oath_r`
   sit 0.090 apart in plan x, which resolves to 80px on a 1120px frame. At the
   figure height this set actually needs (K_YARD below, ~228px of body) 80px is
   inside the arm span of `eum_grieve` and `phi_clasp`, and draft 1 rendered the
   embrace as one tangle with three heads on it. So the trio is widened by
   exactly 0.030 in plan x and 0.010 in z, DERIVED from the set's own stations
   rather than invented: ±0.120 from the centre of the patch, which is still
   inside the trodden ellipse the `oath` state scuffs (its rx is 0.120), so the
   men still stand on the footprints the set paints for them — 25px of screen
   from the print's centre, well inside one pair of feet.

   AND THE TRIO IS STAGGERED IN DEPTH, not laid out on one line. Draft 2 put all
   three at nearly one z, so all three heads landed within 20px of y=0.58 —
   which is exactly where the yard wall's first two bays carry their top
   courses. Three faces printed on one masonry band. Pushing the two herdsmen
   NEARER by different amounts (+0.030 and +0.050 in z, both still inside the
   trodden ellipse, whose rz is 0.076) drops their feet, lifts their crowns
   clear of that course, and turns a row of three into a triangle closing on
   the man in the middle — which is what an embrace looks like from outside it.
   The z offsets are also what keeps the depth queue honest: the two men who
   take hold of him are unambiguously in FRONT of him. */
const OFF = (s, dx, dz) => ({ x:+(s.x + dx).toFixed(4), z:+(s.z + dz).toFixed(4) });

const yardPlan = makePlan({
  id:"palace-outer-yard-s04",
  name:"The private flank of the yard",
  notes:"location.palace-outer-yard's own plan (imported, not re-authored) plus "
       +"three door-step stations and the re-gauged contact trio. "
       +"`out_l`/`out_c`/`out_r` are ordered left to right and so are "
       +"`stand_l`/`stand_c`/`stand_r`, so the three walks are three parallel "
       +"lanes and cross nowhere.",
  stations:{
    ...YARD_PLAN.stations,
    out_l: { x:0.300, z:0.430 },   // a pace down the dead west side of the door
    out_c: { x:0.420, z:0.330 },   // square on the step, where the beggar halts
    out_r: { x:0.560, z:0.235 },   // along the wall toward the re-entrant corner
    stand_l: OFF(YS.oath_l, -0.030,  0.030),   // CONTACT TRIO — Eumaeus, near left
    stand_c: OFF(YS.oath_c,  0.000,  0.000),   //              — Odysseus, far centre
    stand_r: OFF(YS.oath_r,  0.020,  0.050),   //              — Philoetius, nearest right
  },
  fixtures:YARD_PLAN.fixtures,
});

/* ---- THE CLOCK ---------------------------------------------------------- */
const GATHER   = 17;   // all three off the step and onto the blind ground
const TEST     = 20;   // >>> the test: whose side would you be on?
const ANSWER   = 28;   // Philoetius prays for the day; Eumaeus prays for it too
const SHOW     = 36;   // his hand goes down to the rag over the right thigh
const OPEN     = 40;   // >>> the flaps clamped back; the welt readable
const DECLARE  = 43;   // "I am he. Home, in the twentieth year."
const SEEN     = 48;   // both sightlines land; both assents struck
const EMBRACE  = 53;   // they take hold of him and weep on the blind ground
const SWORN    = 62;   // >>> the proof closes as a pledge; the yard is `oath`
const ORDERS   = 66;   // the three orders, which are all geography

/* ---- CONTINUITY IN, TRANSLATED (brief §F) -------------------------------
   S03 ended INSIDE, in the megaron. A station only exists in its own plan, so
   every inherited hall station has to be translated or dropped, and dropping is
   the point: the hall is still full of people and not one of them comes out
   here. THREE bodies cross the threshold and thirteen do not.

   Dropped, deliberately: penelope (`pillar_l`) and telemachus (`throne`), who
   are still in the hall and must be, because S05 finds them there; antinous
   (`stair_up`), leiodes (`bench_r2`), eurymachus (`pillar_r`) and melanthius
   (`postern`), the men this scene is being kept secret FROM; the `maids` and
   the emptied axe chest at `storeroom`; the brazier and the fat burning down at
   `table_l`; and `bow` at `pillar_r` — the bow is the whole subject of the
   first order given here and it stays lying on the stand indoors while the
   order is given, which is exactly why the order has to be given. */
const HALL_TO_YARD = {
  corner_dead:  "out_c",   // the beggar, out of his corner and through the door
  bench_l1:     "out_l",   // Eumaeus, up off the left bench and after him
  doorway_maid: "out_r",   // Philoetius, out of the servants' door and after him
};
const INITIAL = Object.fromEntries(Object.entries(PREV_EXIT)
  .map(([who, st]) => [who, HALL_TO_YARD[st]])
  .filter(([, st]) => st));

/* ---- BLOCKING. Stations, not coordinates (notes A, B, C). ---------------
   Six moves. Three walk them off the door step onto the blind patch, in three
   non-crossing lanes, Philoetius first because he is nearest the corner and
   has furthest to go round; three walk them off it again on the three orders.
   Between t=17 and t=66 nobody moves at all, because for those forty-nine
   seconds the scene is three men standing still saying the only true things
   any of them say in the poem. */
const MOVES = [
  { who:"philoetius", from:"out_r", to:"stand_r", t0: 2, t1:11 },
  { who:"odysseus",   from:"out_c", to:"stand_c", t0: 3, t1:14 },
  { who:"eumaeus",    from:"out_l", to:"stand_l", t0: 5, t1:17 },
  /* the three orders, each one a walk to the fixture it is about. Eumaeus is
     sent to `route_a`, the near head of the slab run, and NOT to `door_sill`:
     the sill IS the doorway, the doorway is the darkest hole in this set, and
     draft 1 put a man's whole torso inside it where his silhouette stopped
     existing. `route_a` is one pace short of the step, on the dressed slabs,
     against the lit face of the flank wall — he is unmistakably a man about to
     go in, and he is still a man. */
  { who:"eumaeus",    from:"stand_l", to:"route_a",     t0:ORDERS+1, t1:76 },
  { who:"philoetius", from:"stand_r", to:"gate_sill",   t0:ORDERS+2, t1:77 },
  { who:"odysseus",   from:"stand_c", to:"oath_watch",  t0:ORDERS+4, t1:78 },
];

/* ---- THE ROOM'S STATE (note E) ------------------------------------------ */
const YARD_STATE  = t => (t >= SWORN ? "oath" : "private");
const YARD_LAYERS = ["sky","yard","sight","flank","roof","halldoor","armsdoor",
                     "wall","gate","route","oath","post","kerb","foreground"];

/* ---- THE BOX A BODY IS DRAWN IN (verbatim device from S01 / S02 / S03) ---
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide), and every character module in this repo lays its garment out in
   fractions of its box WIDTH, so a landscape box turns a body into a bell.
   Every figure here is drawn into the PORTRAIT box the atlas uses for
   characters, 660/880, and blitted. FIG_FLOOR is the rig's own floor line:
   figure-hero plants the ankles at 0.90 of its box height.

   K_YARD is this set's one height for an adult, and unlike the hall's it is
   SOLVED, not inherited. The set's side door is 0.235 plan-height at z=0.16,
   which draws 0.160 of H; the yard wall bays are 0.096–0.138, which draw about
   0.08–0.11 of H. Against that masonry a 1.75m man standing on the oath patch
   (z≈0.70, where the set's own footprints are) wants a drawn body of about
   0.27 of H — 205px on a 760px frame. The rig fills 0.78 of its box between
   crown and ankle, and project() returns 1.026 at that depth, so
   K_YARD = 0.27 / 0.78 / 1.026 = 0.34. That is smaller than the hall's 0.46,
   which is correct: the hall is a box the camera is inside and this is a yard
   with a building at the far end of it.

   DRAFT 1 RENDERED AT 0.34 AND IT WAS TOO SMALL — three 205px men on a 760px
   frame, and worse, their heads landed at y≈0.58, dead on the top course of the
   yard wall's first bay, so three faces printed against masonry instead of
   against paper. 0.39 lifts the drawn body to 0.292 of H (222px) and the heads
   to y≈0.53, clear ABOVE the wall course and onto the open field. It costs
   strictness: depth-corrected against the 2.8m side door these men now read
   about 1.35x life size. That is the same trade every scene in this atlas
   makes — the hall's 0.46 is looser still — and it is the right one, because a
   scene whose entire subject is two men reading a mark on a third man's leg
   cannot be built out of figures whose faces do not resolve. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
const K_YARD    = 0.39;

/* blit a module into a box of a chosen aspect, anchored by a point INSIDE the
   box. `fx`/`fy` say where in the box the anchor lands (0..1). `sig` is
   required: keyedModuleCanvas caches on pose/band/mode/t only, so without it a
   change of gaze, brow or guise returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* PLATE — blit one declared WINDOW of a whole-frame drawing, keyed, so the
   drawing's own frame furniture stays out of frame and the sheet it is drawn on
   can be chosen independently of the space it lands in (note G). */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* A DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses. Keyed straight onto the set, the yard
   wall and the roof course run through the drawing and it stops reading as a
   diagram. (Verbatim device from OD-B20-S03 / OD-B21-S01..S03.) */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

/* ---- THE PROOF PLATE (notes F, G) ---------------------------------------
   Drawn on a HALF sheet, 330x440, and windowed to everything that carries the
   deposition — aperture, welt, both clamped flaps, both witness stations and
   their cones, the tally of assents, the oath seal and the book numeral. It
   lands top RIGHT, on the only part of this frame the set leaves as open sky:
   the flank and its roof stop at plan x 0.62 and the yard wall's own courses
   all sit below y 0.59, so nothing in the set is covered by it. */
const PRF_SHEET_W = 330, PRF_SHEET_H = 440;
const PRF_WIN = { x0:.020, y0:.055, x1:.980, y1:.940 };
const PRF_DST = { x0:.700, y0:.045, x1:.952, y1:.500 };

const proofMode = t => t < OPEN ? "covered"
                     : t < SEEN ? "presented"
                     : t < SWORN ? "witnessed"
                     :             "sworn";
const proofAssent = t => t < SEEN ? 0 : t < SEEN + 3 ? 1 : 2;

/* ---- THE GUISE RAMP (note D) --------------------------------------------
   0 until he says the words, then up to 0.34 — never past the module's snapAt
   of 0.5, so the rags never become a tunic. What moves is the stoop. */
const GU0 = DECLARE, GU1 = SWORN, GU_MAX = 0.34;
const guiseRamp = t => t <= GU0 ? 0
                     : t >= GU1 ? GU_MAX
                     : GU_MAX * (t - GU0) / (GU1 - GU0);

export const scene = {
  id:"OD-B21-S04",
  title:"Odysseus Recruits the Herdsmen",
  book:21,
  plan:"palace-outer-yard-s04",
  duration:D,
  beats:[
    "Odysseus follows Eumaeus and Philoetius outside and tests their loyalty.",
    "He reveals the scar and declares that he is Odysseus.",
    "The herdsmen embrace him and weep, then swear support.",
    "Odysseus assigns Eumaeus to deliver the bow, Philoetius to lock the "
      + "courtyard gate, and both to secure the women.",
  ],

  exitState:
    "Late on Apollo's feast day, in the PRIVATE FLANK of the compound — the " +
    "strip of ground beside the megaron between the hall's side door, the low " +
    "door of the arms store and the courtyard gate, the one piece of the " +
    "precinct the hall cannot see into. The set is no longer in its `private` " +
    "state but in its `oath` state, and the difference is three pairs of " +
    "footprints scuffed into the blind patch behind the wall where three men " +
    "stood close enough to hold each other: the ground itself is now evidence " +
    "that this happened. The proof has been given and closed. The rag is back " +
    "over the thigh, but `set_piece.scar-proof` is in its `sworn` mode with " +
    "both assents struck and the seal added — Eumaeus and Philoetius have both " +
    "read the tusk wound above the right knee and both know what it means, and " +
    "that knowledge is the only weapon Odysseus has added to his side all day. " +
    "He is still the beggar: no god has touched him, the rags have not changed, " +
    "and the guise ramp stopped at 0.34, well short of the garment snap — what " +
    "is different is that he is standing up straight in front of two men who " +
    "know who he is. He holds `oath_watch`, the near ground that keeps the lit " +
    "side door in view, because the next thing that happens is indoors and he " +
    "has to walk back into it before he is missed. THE THREE ORDERS ARE GIVEN " +
    "AND NONE OF THEM IS CARRIED OUT YET, which is the whole content of this " +
    "handoff. Eumaeus has them and is standing one pace short of the side door, " +
    "on the near head of the dressed slab run (`route_a`), about to go back in: " +
    "when the beggar asks for the bow he is " +
    "to put the bow and the quiver into his hands and not argue about it, and " +
    "the bow is still lying where Eurymachus set it down, on the stand at the " +
    "right-hand roof pillar inside. Philoetius has them and is on the gate step " +
    "(`gate_sill`), one pace inside the opening between the piers: he is to " +
    "shut the courtyard gate's leaves, bar them, and lash the bar fast with the " +
    "ship's cable made fast to the mooring post beside it — the gate is still " +
    "STANDING OPEN in this frame and the ring on the post is still empty. " +
    "Between them they are to bolt the doors of the women's hall so that no " +
    "woman gets out to the town when the noise starts. Nobody in the megaron " +
    "knows any of this: Penelope is still at the left pillar, Telemachus in his " +
    "own chair, Antinous at the foot of the queen's stair, the whole beaten " +
    "house on its benches, and the brazier and the wheel of fat burning down at " +
    "the left-hand table. The next scene goes back through that side door.",
  exitOccupancy:occupancyAt(yardPlan, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    odysseus:"none — the seam between scenes covers the walk through the side " +
             "door. He opens the scene square on the step at `out_c`, having " +
             "just come out of the near corner of the hall, and is on the " +
             "blind patch (`stand_c`) by t=14",
    eumaeus:"none — up off the left bench in the hall and out after him; opens " +
            "at `out_l`, a pace down the dead west side of the doorway, and " +
            "reaches `stand_l` at t=17",
    philoetius:"none — out of the servants' door and along the wall toward the " +
               "re-entrant corner; opens at `out_r`, walks FIRST because he " +
               "has furthest to go round, and holds `stand_r` from t=11",
  },
  exits:{
    eumaeus:"to the hall, through the side door — he leaves the blind patch at " +
            "t=67 and is standing on `route_a` from t=76, one pace short of the " +
            "step, carrying the first order. He does not go through: the " +
            "threshold is S05's cut",
    philoetius:"to the gate — off the patch at t=68, on `gate_sill` from t=77, " +
               "carrying the second order. The gate is still open when the " +
               "scene ends; shutting it is S06",
    odysseus:"nowhere yet — he comes forward to `oath_watch` at t=78, the near " +
             "ground that keeps the lit doorway in view, and waits there",
  },
  walkable:{
    allowed:["out_l","out_c","out_r","stand_l","stand_c","stand_r","oath_watch",
             "lee_wall","route_a","door_sill","door_foot","gate_sill","gate_mouth",
             "yard_centre","corner"],
    forbidden:["seen_ground"],
    note:"`seen_ground` is INSIDE the painted sightline cone — the wedge of " +
         "yard the side door can see. The set paints it, so it is a fact of " +
         "the picture and not a director's opinion, and no station used by any " +
         "body in this scene lies in it. That is the only reason the yard is " +
         "safe and the only reason this conversation can happen at all.",
  },
  depthOrder:"one queue, sorted on the live blocked z of every body and drawn " +
             "far -> near. The proof plate is an overlay and is always last.",
  gazeTargets:{
    odysseus:"the two men, alternately, then the lit doorway from t=66",
    eumaeus:"the beggar's face until t=36, the welt from t=36 to t=52, his face again after",
    philoetius:"the beggar's face until t=36, the welt from t=36 to t=52, then up, on the oath",
  },
  attachments:{
    "set_piece.scar-proof":"attaches to character.odysseus-b16 at thigh.right, " +
      "above knee.right, outer side — declared by the set piece itself. It is " +
      "STAGED as the deposition plate rather than painted onto a 200px figure: " +
      "the exhibit is the evidence being read, not a texture on a leg. Its " +
      "mode is stepped by this scene's clock (covered -> presented -> " +
      "witnessed -> sworn) and its two witness stations are Eumaeus and " +
      "Philoetius in that order.",
  },
  soundSources:[
    { at:"stand_c", what:"the test and the declaration, kept low", from:TEST, to:SEEN },
    { at:"stand_l", what:"two men weeping — the one sound that could carry indoors",
      from:EMBRACE, to:SWORN },
    { at:"door_hall", what:"the beaten house behind the wall, muffled", from:0, to:D },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"yard_01",
      anchor:{x:.50,y:.99}, scale:1.0 },
    /* the atlas job names `character.odysseus-as-beggar`; Book XVI+ casts the
       continuity body `character.odysseus-b16` with guise:"beggar" instead
       (brief §C) — one module, one guise channel, never a cut. */
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.45,y:.60}, scale:.34, band:"threeq", pose:"walk_neutral" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.37,y:.68}, scale:.34, band:"threeq", pose:"walk_neutral" },
    { asset:"character.philoetius", instance:"philoetius",
      anchor:{x:.53,y:.60}, scale:.34, band:"threeq", pose:"walk_neutral" },
    { asset:"set-piece.scar-proof", instance:"proof_01",
      anchor:{x:.83,y:.50}, scale:.26 },
  ],

  timeline:[
    { op:"actor.pose",  target:"philoetius", at:0,        args:{ pose:"walk_neutral" } },
    { op:"actor.pose",  target:"odysseus",   at:0,        args:{ pose:"walk_neutral" } },
    { op:"actor.pose",  target:"eumaeus",    at:0,        args:{ pose:"walk_neutral" } },

    { op:"actor.pose",  target:"philoetius", at:11,       args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"philoetius", at:11,       args:{ gaze:{ x:-.34, y:.06 } } },
    { op:"actor.pose",  target:"odysseus",   at:GATHER,   args:{ pose:"three_quarter_left" } },
    { op:"actor.pose",  target:"eumaeus",    at:GATHER,   args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:GATHER,   args:{ gaze:{ x:.36, y:.02 } } },

    /* the test */
    { op:"actor.pose",  target:"odysseus",   at:TEST,     args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",   at:TEST,     args:{ gaze:{ x:-.30, y:.04 } } },
    { op:"actor.pose",  target:"philoetius", at:TEST+4,   args:{ pose:"phi_wonder" } },

    /* the answer */
    { op:"actor.pose",  target:"philoetius", at:ANSWER,   args:{ pose:"phi_grievance" } },
    { op:"actor.pose",  target:"eumaeus",    at:ANSWER+3, args:{ pose:"eum_speak" } },
    { op:"actor.pose",  target:"odysseus",   at:ANSWER+5, args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:ANSWER+5, args:{ gaze:{ x:.30, y:.02 } } },

    /* the rag, the welt, the words */
    { op:"actor.pose",  target:"odysseus",   at:SHOW,     args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:SHOW,     args:{ gaze:{ x:.06, y:.44 } } },
    { op:"set.state",   target:"proof_01",   at:SHOW,     args:{ state:"covered" } },
    { op:"actor.gaze",  target:"eumaeus",    at:SHOW,     args:{ gaze:{ x:.30, y:.48 } } },
    { op:"actor.gaze",  target:"philoetius", at:SHOW,     args:{ gaze:{ x:-.30, y:.48 } } },
    { op:"set.state",   target:"proof_01",   at:OPEN,     args:{ state:"presented" } },
    { op:"actor.pose",  target:"eumaeus",    at:OPEN,     args:{ pose:"hands_near_face" } },
    { op:"actor.pose",  target:"philoetius", at:OPEN,     args:{ pose:"phi_wonder" } },
    { op:"actor.pose",  target:"odysseus",   at:DECLARE,  args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"odysseus",   at:DECLARE,  args:{ gaze:{ x:0, y:-.06 } } },
    { op:"set.state",   target:"proof_01",   at:SEEN,     args:{ state:"witnessed" } },
    { op:"actor.gaze",  target:"eumaeus",    at:SEEN,     args:{ gaze:{ x:.34, y:-.02 } } },
    { op:"actor.gaze",  target:"philoetius", at:SEEN,     args:{ gaze:{ x:-.32, y:-.02 } } },

    /* they take hold of him */
    { op:"actor.pose",  target:"eumaeus",    at:EMBRACE,  args:{ pose:"eum_grieve" } },
    { op:"actor.pose",  target:"philoetius", at:EMBRACE,  args:{ pose:"phi_clasp" } },
    { op:"actor.pose",  target:"odysseus",   at:EMBRACE,  args:{ pose:"grief" } },
    { op:"actor.gaze",  target:"odysseus",   at:EMBRACE,  args:{ gaze:{ x:0, y:.30 } } },

    /* the pledge, and then the orders */
    { op:"set.state",   target:"proof_01",   at:SWORN,    args:{ state:"sworn" } },
    { op:"actor.pose",  target:"philoetius", at:SWORN,    args:{ pose:"phi_oath" } },
    { op:"actor.pose",  target:"eumaeus",    at:SWORN,    args:{ pose:"eum_welcome" } },
    { op:"actor.pose",  target:"odysseus",   at:SWORN,    args:{ pose:"torso_open" } },
    { op:"set.state",   target:"yard_01",    at:SWORN,    args:{ state:"oath" } },
    { op:"actor.pose",  target:"odysseus",   at:ORDERS,   args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:ORDERS,   args:{ gaze:{ x:-.20, y:-.08 } } },
    { op:"actor.pose",  target:"eumaeus",    at:ORDERS+1, args:{ pose:"walk_neutral" } },
    { op:"actor.pose",  target:"philoetius", at:ORDERS+2, args:{ pose:"walk_neutral" } },
    { op:"actor.pose",  target:"eumaeus",    at:76,       args:{ pose:"eum_listen" } },
    { op:"actor.pose",  target:"philoetius", at:77,       args:{ pose:"phi_resolve" } },
    { op:"actor.pose",  target:"odysseus",   at:78,       args:{ pose:"three_quarter_left" } },
    { op:"timeline.capture", target:"OD-B21-S04", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(yardPlan, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.06 + 0.90 * (t / D));
    const gu     = guiseRamp(t);

    /* --- 1. THE SET. One field; it paints the world, its own plan is the plan
       every body below is standing on, and everything else keys onto it. ---- */
    placeInstance(offctx, W, H, yard, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:YARD_STATE(t), t:breath, layers:YARD_LAYERS,
        status: t >= ORDERS ? "THREE ORDERS"
              : t >= SWORN  ? "SWORN"
              : t >= OPEN   ? "THE MARK"
              : t >= TEST   ? "OUT OF SIGHT"
              :               "OUT OF THE HALL",
        progress:prog,
      },
    });

    /* --- 2. ONE DEPTH QUEUE (note H). ----------------------------------- */
    const queue = [];
    const push = (d, draw) => queue.push({ d, draw });

    /* one figure, from the plan, into the portrait box, at this set's one adult
       height times this station's own depth falloff. Not one coordinate is
       written here: p comes from blockingAt(). */
    const figure = (who, mod, extra, statusOf) => {
      const p = blk[who], s = st[who] || {};
      const scale = K_YARD * p.scale;
      const pose  = p.moving ? "walk_neutral" : (s.pose || "neutral");
      const gaze  = s.gaze || { x:0, y:.06 };
      const ex    = extra(t);
      const state = {
        t: p.moving ? (t * 0.40) % 4 : breath,
        band:"threeq", pose, gaze,
        status: statusOf(t), progress:prog,
        ...ex,
      };
      const sig = `${who}|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
                + `|${Math.round(t)}|${ex.guise && ex.guise.u != null
                                        ? Math.round(ex.guise.u*24) : "-"}`;
      push(p.d, () => {
        place(offctx, W, H, mod, {
          x:p.x, y:p.y, hFrac:scale, ar:FIG_AR, fx:0.5, fy:FIG_FLOOR,
          pad:FIG_PAD, state, sig,
        });
      });
    };

    /* ODYSSEUS — ONE body, ONE guise channel, and the rags never leave him
       (note D). The ramp runs from the declaration to the pledge and stops at
       0.34, under the garment snap: the stoop comes out, the clothes do not
       change, and there is no flare because no god is involved in this one. */
    figure("odysseus", odysseus,
      tt => ({
        guise: gu <= 0 ? "beggar" : { from:"beggar", to:"king", u:gu },
        browKnit: tt >= EMBRACE ? .46 : tt >= TEST ? .34 : .22,
        browUp:   tt >= ORDERS ? .26 : tt >= EMBRACE ? .42 : tt >= DECLARE ? .34 : .12,
        eyeNarrow:tt >= ORDERS ? .40 : tt >= TEST && tt < SHOW ? .40 : .18,
        eyeWide:  tt >= DECLARE && tt < EMBRACE ? .22 : 0,
        frown:    tt >= EMBRACE && tt < SWORN ? .40 : 0,
        smile:    tt >= SWORN && tt < ORDERS ? .24 : tt >= ANSWER && tt < SHOW ? .14 : 0,
        jaw:      tt >= DECLARE && tt < SEEN ? .34 : tt >= ORDERS ? .26 : 0,
        mouthAsym:tt >= TEST && tt < ANSWER ? .44 : .10,
      }),
      tt => tt >= ORDERS  ? "THREE ORDERS"
          : tt >= SWORN   ? "HIS OWN TWO MEN"
          : tt >= EMBRACE ? "TWENTY YEARS"
          : tt >= DECLARE ? "I AM HE"
          : tt >= SHOW    ? "THE TUSK WOUND"
          : tt >= ANSWER  ? "THEY WILL DO"
          : tt >= TEST    ? "WHOSE SIDE"
          :                 "OUT OF THE HALL");

    /* EUMAEUS — the man who has already said everything he thinks; he answers
       the test out of grief, refuses the mark for a moment, and then holds on.
       His hospitality pose does the pledge, because that is what it is. */
    figure("eumaeus", eumaeus,
      tt => {
        const doubting = tt >= SHOW && tt < OPEN;
        const struck   = tt >= OPEN && tt < EMBRACE;
        const weeping  = tt >= EMBRACE && tt < SWORN;
        const pledging = tt >= SWORN;
        return {
          browUp:   struck ? .72 : weeping ? .66 : pledging ? .36 : .40,
          browKnit: weeping ? .52 : doubting ? .44 : .30,
          frown:    weeping ? .52 : doubting ? .16 : 0,
          eyeWide:  struck ? .46 : 0,
          eyeNarrow:doubting ? .40 : weeping ? .24 : .08,
          smile:    pledging ? .34 : 0,
          jaw:      struck ? .30 : tt >= ANSWER && tt < SHOW ? .42 : 0,
          cheek:    pledging ? .28 : 0,
        };
      },
      tt => tt >= ORDERS  ? "THE BOW, THEN"
          : tt >= SWORN   ? "TO THE LAST MAN"
          : tt >= EMBRACE ? "WEEPING"
          : tt >= OPEN    ? "THAT IS THE SCAR"
          : tt >= SHOW    ? "HE CANNOT BE"
          : tt >= ANSWER  ? "I PRAY FOR IT"
          : tt >= TEST    ? "LISTENING"
          :                 "AFTER HIM");

    /* PHILOETIUS — the module ships `phi_oath` for exactly this scene: the
       scar shown, the oath sworn, the hand straight up. He goes wonder ->
       grievance -> wonder -> clasp -> oath, which is the module's own Book XXI
       path through its state graph. */
    figure("philoetius", philoetius,
      tt => {
        const wondering = tt >= OPEN && tt < EMBRACE;
        const clasping  = tt >= EMBRACE && tt < SWORN;
        const swearing  = tt >= SWORN && tt < ORDERS;
        return {
          browUp:   wondering ? .86 : clasping ? .74 : swearing ? .56 : .38,
          browKnit: clasping ? .52 : swearing ? .36 : .24,
          eyeWide:  wondering ? .62 : swearing ? .32 : 0,
          eyeNarrow:clasping ? .34 : .16,
          frown:    clasping ? .46 : 0,
          jaw:      wondering ? .24 : swearing ? .24 : tt >= ANSWER && tt < SHOW ? .46 : 0,
          mouthAsym:tt >= ANSWER && tt < SHOW ? .24 : .06,
        };
      },
      tt => tt >= ORDERS  ? "THE GATE, THEN"
          : tt >= SWORN   ? "SWORN"
          : tt >= EMBRACE ? "BOTH HIS HANDS"
          : tt >= OPEN    ? "THE MARK ITSELF"
          : tt >= ANSWER  ? "I PRAY FOR IT"
          : tt >= TEST    ? "WHAT IS HE ASKING"
          :                 "ROUND THE CORNER");

    queue.sort((a, b) => a.d - b.d).forEach(q => q.draw());

    /* --- 3. THE PROOF PLATE. An overlay, always last (notes F, G). ------- */
    if (t >= SHOW){
      const mode = proofMode(t);
      const assent = proofAssent(t);
      detailField(offctx, W, H, PRF_DST);
      plate(offctx, W, H, proof, PRF_SHEET_W, PRF_SHEET_H, PRF_WIN, PRF_DST,
            { mode, assent, t: mode === "covered" ? 0 : 0.6,
              status: mode === "sworn" ? "SWORN" : "SHOWN", progress:prog },
            `proof|${mode}|${assent}`);
    }
  },
};
export default scene;

/* named binding so OD-B21-S05 can `import { exitOccupancy as INITIAL }`.
   S05 plays back INSIDE the megaron, so every station below is a YARD station
   and S05 must declare its own YARD_TO_HALL map and translate — `door_sill`
   becomes the hall's `postern` side of the same doorway, `gate_sill` is not in
   the hall at all and Philoetius is correctly dropped from S05's opening
   occupancy, because he is out at the gate doing what he was told. */
export const exitOccupancy = scene.exitOccupancy;
