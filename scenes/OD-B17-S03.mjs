/* ============================================================
   SCENE  OD-B17-S03 — Argos Recognizes His Master
   Book XVII, scene 3 of 7. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from its
   sibling on this book's road, scenes/OD-B17-S02.mjs.

   WHERE. Not the hall and not the hut: the last thirty feet of lane outside
   Odysseus's own courtyard gate, with the mule-dung heaped against the
   precinct wall. location.palace-dung-heap-and-gate is the authored set and it
   is the ONLY thing that paints the field.

   THE PLAN IS INVERTED OUT OF THE SET, NOT GUESSED. That set places every
   fixture through the blocking law itself —
       x = 0.5 + (x-0.5)(0.42 + 0.58 z)      y = 0.50 + 0.46 z^1.08
   — and exports the resulting SCREEN anchors. So `st()` below runs project()
   BACKWARDS on the set's own exported anchor, solving z out of y and x out of
   the depth spread, and hands the result to makePlan(). blockingAt()'s forward
   projection then lands each body exactly on the ground as painted, at the
   size that patch of ground is painted. A station here is never a taste
   decision; it is the set's geometry read in reverse. Two consequences, both
   deliberate:
     · `heap:hollow` and `heap:crest` are anchors LIFTED off the ground by the
       mound's own height, so inverting them yields a shallower z than the
       heap's plan z (0.554 against 0.62). That is correct — the inversion
       reproduces the anchor's y exactly, which is what a point up the face of a
       mound should do — and it costs 3% of scale. Both are kept as stations and
       as the heap fixture even though no body stands on them; see argos_bed.
     · The set's size law SZu(z) = 0.60 + 0.50z is the same ramp project()
       uses, so — unlike the road in S02 — no bespoke sizeOf() is needed here.
       The plan owns where a body stands AND how big it is there.

   THE HEAP IS THE SCENE. This is a wide shot of a great house with a dung heap
   at its gate, and the one living thing in the frame that knows who has come
   home is lying on the heap. So the two men are blocked BESIDE the heap and
   never on it, and the dog is the only body in the left third of the frame.

   CONTACT-ADJACENT, NEVER COINCIDENT. Nothing in this scene touches — that IS
   the scene: the dog cannot get up and the master must not stoop to him. So the
   pair is authored as two stations a measured stride apart: `argos_bed` at
   screen .225/.891 and `heap_side` at .483/.852, and at the end of the scene
   `aside` at .426/.891 — the same depth band as the dog, .127 apart in plan x.
   Argos's ink ends at x≈.299 and Odysseus's begins at x≈.360, so there is about
   .06 of the frame — a clear hand's breadth of bare paper — between the dog's
   muzzle and his master's shin at the closest the two ever come. That gap is
   the whole distance of the episode and it is never closed. The dog faces +x
   (creature.argos is drawn in profile toward its master and has no flip
   channel), so the master must always stand to his RIGHT; that constraint, not
   taste, is why Odysseus works the left of the lane and Eumaeus the right.

   NOBODY'S BOX BOTTOM IS THEIR FLOOR. placeInstance() anchors an asset box by
   its bottom edge, and not one of these three modules puts its ground line
   there: creature.argos draws its litter at 0.64 of box height and figure-hero
   plants the rig's ankles at 0.90. Placed by the box, the dog floats a tenth of
   the frame and both men float fifty pixels — visible in the first two renders.
   So this scene blits through a local place() that takes the FRACTION OF THE BOX
   the anchor lands on (FIG_FLOOR, ARGOS_GROUND, ARGOS_SPINE), read off the
   modules' own constants. Nothing is nudged and nothing is overpainted.

   ONE BODY. Odysseus is character.odysseus-b16 with guise "beggar" — the same
   body Athena restored in XVI and re-veiled, never character.odysseus-as-
   beggar. There is no guise ramp and therefore no restoration flare: the only
   creature in Ithaca that penetrates the disguise is the dog, and it costs him
   nothing to be known by an animal. That is why this scene has no fx.

   CONTINUITY IN — computed, then TRANSLATED. OD-B17-S02 exports exitOccupancy
   and it is imported here. It is a ROAD occupancy: odysseus at `meet_above`
   (the throat of the narrows, uphill side), eumaeus at `throat` a pace below
   him, melanthius at `road_upper` and his goats at `road_far`, both driven on
   ahead. ROAD_TO_GATE carries the two who walk on into this shot up onto the
   lane and DROPS the other two: the goatherd and the suitors' best goats went
   in through this gate ahead of the pair and are already in the megaron, so
   they must not be standing in the lane. Dropping them is the point of writing
   the map out instead of skipping the import.

   CONTINUITY OUT. exitOccupancy is computed and exported as a named binding —
   { argos:"argos_bed", odysseus:"aside", eumaeus:"gate_sill" }: the dog dead at
   the foot of the heap, the beggar standing over him a half step back in the
   lane, the swineherd up on the gate sill about to go in ahead of him.

   Beats (Od. 17.290–327):
     1. Near the palace Odysseus sees his old dog Argos lying neglected on dung.
     2. Argos lifts his head, drops his ears, wags his tail at his master's scent.
     3. Odysseus turns aside to hide a tear and asks Eumaeus about the animal.
     4. After twenty years Argos dies as soon as he has recognized Odysseus.

   Verify:  node harness/render-scene.mjs scenes/OD-B17-S03.mjs --t 16   (the scent)
            node harness/render-scene.mjs scenes/OD-B17-S03.mjs --t 31   (the failed rise)
            node harness/render-scene.mjs scenes/OD-B17-S03.mjs --t 50   (the death)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp } from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt, SPREAD_FAR } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field    from "../assets/location/palace-dung-heap-and-gate.mjs";
import odysseus from "../assets/character/odysseus-b16.mjs";
import eumaeus  from "../assets/character/eumaeus.mjs";
import argos    from "../assets/creature/argos.mjs";

const FIELD_ASSET = "location.palace-dung-heap-and-gate";
const D = 56;

/* --- THE LOCAL PLAN, INVERTED OUT OF THE SET ------------------------------
   project() is  y = .50 + .46 z^1.08 ,  x = .5 + (xPlan-.5)(SPREAD_FAR + (1-SPREAD_FAR)z)
   unproject() solves it the other way. st(name, dx, dz) returns the plan
   station whose forward projection is the set's own exported anchor, optionally
   shifted dx across the lane and dz in depth, both in PLAN space (so a lateral
   step shrinks on screen with distance, which is what a lane does). */
const A = field.anchors;
function unproject(X, Y){
  const z = clamp(Math.pow(Math.max(1e-4, Y - 0.50) / 0.46, 1 / 1.08), 0.08, 1);
  const spread = SPREAD_FAR + (1 - SPREAD_FAR) * z;
  return { x: 0.5 + (X - 0.5) / spread, z };
}
const st = (name, dx = 0, dz = 0) => {
  const a = A[name];
  if (!a) throw new Error(`[OD-B17-S03] the set exports no anchor "${name}"`);
  const p = unproject(a.x, a.y);
  return { x: +(p.x + dx).toFixed(4), z: +clamp(p.z + dz, 0.10, 1).toFixed(4) };
};

export const gateApproach = makePlan({
  id:"gate-approach",
  name:"The Lane, the Dung Heap and the Courtyard Gate",
  notes:"Local plan for OD-B17-S03, inverted out of location.palace-dung-heap-" +
        "and-gate's own exported anchors so the plan and the painted ground are " +
        "one ground. The lane runs from camera up to the gate; the heap is piled " +
        "against the fouled left-hand run of the precinct wall; everything right " +
        "of the lane is masonry that still does its work.",
  stations:{
    // --- the lane, camera end: where the pair comes up off the road ----------
    lane_in_l:  st("entrance:road", -0.10),      // Odysseus's walk-on
    lane_in_r:  st("entrance:road",  0.13),      // Eumaeus's, abreast of him
    // --- the lane, one stage up. Two lanes either side of the cart ruts ------
    lane_low_l: st("lane:mid", -0.14, 0.16),
    lane_low_r: st("lane:mid",  0.18, 0.16),
    // --- ARGOS's ground, and the standing place beside it. THE PAIR. ---------
    // heap:hollow is the set's own anchor for the dog — the depression worn into
    // the near face of the mound — and at this figure size a body ON it CANNOT
    // BE SEEN. Earned from the render, not reasoned: the dog's coat is ink 2 and
    // his contour is 5px, the mound is ink 3 crowned with nine ink-4/5 lumps and
    // thirteen straw strokes, and the mound's screen extent (x .16–.47, y .65–.79)
    // swallows the whole animal. At t=16 and t=50 the first draft rendered no dog
    // at all — just more lumps. So `argos_bed` puts him a plan pace NEARER camera
    // and left, on the soiled ground the set stains at the heap's near foot: his
    // spine at y .891 with the mound rising behind him from y .79, and his tail
    // out past the mound's left edge onto bare paper. He is still lying on the
    // dung before the gate; he is now lying on the near skirt of it, which is the
    // only part of the heap that has paper behind a silhouette.
    argos_bed:   st("heap:foot", -0.119, 0.14),
    heap_hollow: st("heap:hollow"),
    heap_crest:  st("heap:crest"),
    // out of the heap's near foot and a pace nearer camera, in the lane. Not on
    // the mound: a man ON the heap's plan point resolves inside the mound's own
    // silhouette and the two weld into one dark mass at dot scale. The dz of
    // +0.06 was earned from the render too — at the heap's own depth the mound's
    // near-face contour ran straight through his shins and read as fusion, so he
    // is stood one pace forward, feet on clean ground BELOW the heap's stain,
    // with only his torso against the mound and his head clear of its crest.
    heap_side:   st("heap:foot",  0.16, 0.06),
    heap_lee:    st("heap:lee"),
    // --- the half step ASIDE. He turns his face away and wipes the tear ------
    // A step BACK toward camera and slightly left: out of the swineherd's
    // sightline, which is what "turned aside" has to mean when the man he is
    // hiding it from is standing up by the gate. It also brings him level with
    // the dog — same depth, .127 apart in plan x, .059 of clear paper between
    // their silhouettes — so the last frames of the scene are the master
    // standing over the animal, which is the picture the episode is for.
    aside:       st("heap:foot",  0.10, 0.14),
    // NOTE on where EUMAEUS does NOT stand. The right-hand lane edge is the
    // obvious place for him and it is unusable. The polished stone seat is a
    // perspective quad from plan x .70–.88 at z .46–.55, and its FAR corner
    // projects to screen x .637, not .714 — so a body anywhere from .58 rightward
    // has the seat's top face and front face running through its knees, and at
    // this figure size the lattice welds the two. Rendered, the swineherd came
    // out as a slab with stone rails through his legs. He therefore works the
    // apron instead: `apron_r` is open dressed ground with the dark gate throat
    // behind it, one depth band further off than the beggar, and it is also
    // where a man who is about to go in ahead of you would actually stand.
    // --- the kept side of the frame, standing ground that is not the lane ----
    seat_stone:  st("seat:stone"),
    basin:       st("basin:offering"),
    verge_r:     st("verge:right"),
    verge_l:     st("verge:left"),
    // --- the apron and the gateway itself -----------------------------------
    apron_c:     st("apron:centre"),
    apron_l:     st("apron:left"),
    apron_r:     st("apron:right"),
    gate_sill:   st("gate:sill"),
    gate_mouth:  st("gate:mouth"),
    // --- the road out, toward the town --------------------------------------
    lane_near:   st("lane:near"),
    road_out:    st("exit:road"),
  },
  fixtures:[
    { id:"dung_heap",   kind:"set_piece", at:"heap_crest" },
    { id:"stone_seat",  kind:"set_piece", at:"seat_stone" },
    { id:"offering_basin", kind:"set_piece", at:"basin" },
    { id:"court_gate",  kind:"portal",    at:"gate_mouth", leadsTo:"location.megaron-hall" },
  ],
});

/* --- SIZES -----------------------------------------------------------------
   One height for every man in this lane, times the plan's own falloff. The
   gate opening is 0.201 of frame height; a man standing on its sill comes to
   about three quarters of it, which is a cart gate, which is what a mule-dung
   heap gets carted out through. Small figures are correct: the argument of the
   shot is the house above them and the heap at its foot. */
const MAN = 0.36;
/* the dog. creature.argos's ink spans 3.78 U with U = 0.235 of its box height,
   so his nose-to-tail length is 0.888 of the box. Strict anatomical proportion
   (a hound 0.68 of a man's height, long) put him at 0.18 and the render showed
   why that fails: on this ground that is 190px of light coat inside a 350px
   lumpy mound, and he disappeared. 0.22 makes him a big lean hound about four
   fifths of a man's height long — the top of what the scale will bear — and it
   is the difference between an animal and a stain. */
const DOG = 0.22;
/* --- THE BOX A BODY IS DRAWN IN -------------------------------------------
   placeInstance() hands a module a box of the STAGE's aspect, 1120x760 = 1.474
   wide. For a set that is right; for a figure it is a bug, and the first render
   showed it plainly. engine/figure-hero.mjs sizes the skeleton off
   min(H*0.9, W*1.26) — so the body height survives a wide box — but every
   width-relative decoration is stretched with W: character.eumaeus plants his
   herdsman's staff at W*0.335 and spreads his hide shoulder-mantle to W*0.165 a
   side. In a 1.474 box the mantle came out half again too wide and the staff
   stood a clear hand away from the man holding it: he rendered as a slab on two
   sticks with a pole beside it, not a swineherd. So figures here are drawn into
   a PORTRAIT box and blitted, the same 660/880 aspect makeRestage() uses for
   every character in the atlas. FIG_PAD is bleed so a raised arm or the staff
   crown is never clipped by the narrower canvas.
   The dog gets a SQUARE box: creature.argos scales off min(w,h) and lays its
   ink from 0.02 to 0.91 of a square's width, so square is its true frame.
   ARGOS_GROUND / ARGOS_SPINE are the module's own constants — its ground line
   sits at 0.64 of box height and the animal is centred at 0.45 of box width —
   used to convert a plan point into a box corner. Nothing here is nudged. */
const FIG_AR  = 660 / 880;          // 0.75, makeRestage's own character aspect
const FIG_PAD = 0.06;
/* engine/figure-hero.mjs plants the rig's ankles on `floor = H*0.90` of its box
   and leaves the last tenth empty. Anchoring the box by its BOTTOM edge —
   placeInstance's law — therefore hangs every figure a tenth of its own height
   above the ground the plan gave it, which the first render showed as a 50px
   float under both men. FIG_FLOOR puts the rig's floor, not the box edge, on the
   plan point. */
const FIG_FLOOR = 0.90;
const ARGOS_AR     = 1.00;
const ARGOS_GROUND = 0.64;
const ARGOS_SPINE  = 0.45;

/* blit a module into a box of a chosen aspect, anchored by a point inside it.
   `fx`/`fy` say where in the box the anchor lands (0..1). sigExtra is REQUIRED:
   keyedModuleCanvas caches on pose/band/t only, so without it a change of gaze
   or brow returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, 0.895, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* --- CONTINUITY IN --------------------------------------------------------
   The previous scene's exit is a ROAD occupancy. Translate the two bodies that
   walk on into this shot and drop the two that went in ahead of them. */
import { exitOccupancy as PREV_EXIT } from "./OD-B17-S02.mjs";
const ROAD_TO_GATE = {
  meet_above: "lane_in_l",   // Odysseus, uphill side of the narrows -> the lane
  throat:     "lane_in_r",   // Eumaeus, a pace below him -> abreast in the lane
  /* road_upper (Melanthius) and road_far (his goats) have no equivalent here on
     purpose: the goatherd drove the suitors' best goats in through this very
     gate ahead of the pair and both are already in the megaron. They are
     dropped by the filter below, which is the correct outcome. */
};
const INHERITED = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, station]) => [who, ROAD_TO_GATE[station]])
    .filter(([, station]) => station)
);
const INITIAL = {
  ...INHERITED,                    // { odysseus:"lane_in_l", eumaeus:"lane_in_r" }
  odysseus: INHERITED.odysseus || "lane_in_l",
  eumaeus:  INHERITED.eumaeus  || "lane_in_r",
  argos:    "argos_bed",           // he has not moved off it in twenty years
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   "Leading" and "following" are expressed in TIME — the swineherd starts a
   beat later and arrives a beat later — never by putting two men on one point.
   Argos never moves: he has one station for the whole scene and dies on it. */
const MOVES = [
  // 1 — up the last of the lane. Odysseus takes the fouled left side, where
  //     the heap is, because that is where the road passes it.
  { who:"odysseus", from:"lane_in_l",  to:"lane_low_l", t0: 2, t1:10 },
  { who:"odysseus", from:"lane_low_l", to:"heap_side",  t0:12, t1:20 },
  { who:"eumaeus",  from:"lane_in_r",  to:"lane_low_r", t0: 3, t1:12 },
  { who:"eumaeus",  from:"lane_low_r", to:"apron_r",    t0:14, t1:22 },
  // 3 — he turns aside. A half step out into the lane, face away from the
  //     swineherd, and the tear is wiped where nobody sees it.
  { who:"odysseus", from:"heap_side",  to:"aside",      t0:32, t1:38 },
  // 4 — the swineherd goes up onto the sill to go in ahead of him.
  { who:"eumaeus",  from:"apron_r",    to:"gate_sill",  t0:50, t1:56 },
];

export const scene = {
  id:"OD-B17-S03",
  title:"Argos Recognizes His Master",
  book:17,
  plan:"gate-approach",
  duration:D,
  beats:[
    "Near the palace Odysseus sees his old dog Argos lying neglected on dung.",
    "Argos lifts his head, drops his ears, and wags his tail at the scent and voice of his master.",
    "Odysseus turns aside to hide a tear while asking Eumaeus about the animal.",
    "After twenty years Argos dies as soon as he has recognized Odysseus.",
  ],
  exitState:"Mid-morning in the lane outside Odysseus's own courtyard gate, the mule-dung still heaped against the fouled run of his precinct wall because no slave has carted it. Argos is dead on the soiled ground at the near foot of that heap, in the bed he wore into it — twenty years old, wasted, vermin-ridden, and the only creature in Ithaca that saw through the disguise. He lifted his head, dropped both ears flat in greeting, wagged, tried to rise, could not, and died in the same breath in which he recognized his master. Odysseus is standing a half step aside in the middle of the lane with his face turned away from the swineherd; he wiped the tear off unseen and covered it by asking, idly, whose fine dog that had been. Nothing was revealed: the guise is intact and no man in the frame knows anything. Eumaeus has answered — the dog of a man who died far from home, kept by nobody now the women no longer care — and has gone up onto the gate sill to go into the hall ahead of the beggar. Melanthius and the suitors' best goats are already inside through this gate. The threshold, the heap and the dead dog are the state the next scene inherits.",
  exitOccupancy:occupancyAt(gateApproach, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ odysseus:"entrance:road (lane_in_l)", eumaeus:"entrance:road (lane_in_r)",
              argos:"already on argos_bed — he has lain there twenty years" },
  exits:{ eumaeus:"exit:gate (via gate_sill, into location.megaron-hall)",
          argos:"none — he dies on his station", odysseus:"holds `aside` into the next scene" },
  walkable:"gate-approach stations on the lane and the apron, plus the kept " +
           "right-hand verge. The heap itself is NOT walkable: argos_bed is the " +
           "dog's ground and heap_side is the standing ground at the heap's foot.",
  depthOrder:"one queue, sorted by the plan's own z: eumaeus (.64, then .20 at " +
             "the gate) behind odysseus (.72–.77) behind argos (.86). The dog is " +
             "the NEAREST body in the frame — he is the only one the shot is " +
             "about — so he is drawn last and is never occluded by a man.",
  gazeTargets:{ odysseus:"the heap, then the dog, then away from Eumaeus, then Eumaeus, then the dog",
                eumaeus:"the beggar, then the dog, then the gate",
                argos:"his master — anchor gaze:master, off to his own +x" },
  attachments:[
    { at: 0, who:"odysseus", change:"beggar's staff and scrip carried (guise:beggar)" },
    { at:35, who:"odysseus", change:"hand comes up to the face — the tear wiped unseen" },
    { at:40, who:"odysseus", change:"hand opens away from the face; the question is the cover" },
    { at:30, who:"argos",    change:"forelegs propped under the chest — the rise that fails" },
    { at:48, who:"argos",    change:"head laid out flat, ear flat, eye closed, breath channel to zero" },
  ],
  sound:[
    { at: 0, source:"lane_near",   cue:"two pairs of feet in the dust of the lane" },
    { at: 8, source:"gate_mouth",  cue:"the suitors' noise coming out of the courtyard, far off" },
    { at:14, source:"argos_bed", cue:"flies over the heap; one thin sniff" },
    { at:20, source:"argos_bed", cue:"a tail on dry litter — the only sound he can still make" },
    { at:30, source:"argos_bed", cue:"claws scrabbling, a failed heave, nothing" },
    { at:40, source:"aside",       cue:"the beggar's voice, level, asking about a dog" },
    { at:42, source:"apron_r",     cue:"the swineherd answering, angry at the women" },
    { at:48, source:"argos_bed", cue:"the last breath. Then only the flies." },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"neglect" },
    { asset:"creature.argos", instance:"argos",
      anchor:{x:.237,y:.979}, scale:.245, pose:"neglected" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.635,y:.784}, scale:.358, band:"threeq", pose:"walk_neutral" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.399,y:.823}, scale:.373, band:"threeq", pose:"walk_neutral" },
  ],

  timeline:[
    // 1 — up the lane, and the heap comes into view
    { op:"actor.pose", target:"argos",    at: 0.0, args:{ pose:"neglected" } },
    { op:"actor.pose", target:"odysseus", at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus", at: 0.0, args:{ gaze:{ x:-.12, y:.14 } } },
    { op:"actor.pose", target:"eumaeus",  at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eumaeus",  at: 0.0, args:{ gaze:{ x:-.10, y:-.08 } } },
    { op:"actor.pose", target:"odysseus", at:12.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus", at:12.0, args:{ gaze:{ x:-.40, y:.34 } } },
    // 2 — the scent, then the one moment he is given
    { op:"actor.pose", target:"argos",    at:14.0, args:{ pose:"scent" } },
    { op:"actor.pose", target:"eumaeus",  at:16.0, args:{ pose:"eum_listen" } },
    { op:"actor.gaze", target:"eumaeus",  at:16.0, args:{ gaze:{ x:-.34, y:.12 } } },
    { op:"actor.pose", target:"argos",    at:20.0, args:{ pose:"recognize" } },
    { op:"actor.pose", target:"odysseus", at:21.0, args:{ pose:"weight_shift" } },
    { op:"actor.gaze", target:"odysseus", at:21.0, args:{ gaze:{ x:-.46, y:.30 } } },
    { op:"actor.pose", target:"argos",    at:26.0, args:{ pose:"wag" } },
    { op:"actor.pose", target:"odysseus", at:28.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"odysseus", at:28.0, args:{ gaze:{ x:-.42, y:.36 } } },
    { op:"actor.pose", target:"argos",    at:30.0, args:{ pose:"failed-rise" } },
    // 3 — he turns aside, wipes the tear, and covers it with a question
    { op:"actor.pose", target:"odysseus", at:33.0, args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus", at:33.0, args:{ gaze:{ x:-.24, y:.46 } } },
    { op:"actor.pose", target:"odysseus", at:35.0, args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"odysseus", at:35.0, args:{ gaze:{ x:-.30, y:.44 } } },
    { op:"actor.pose", target:"eumaeus",  at:36.0, args:{ pose:"eum_skeptic" } },
    { op:"actor.gaze", target:"eumaeus",  at:36.0, args:{ gaze:{ x:-.36, y:.06 } } },
    { op:"actor.pose", target:"odysseus", at:40.0, args:{ pose:"palm_up_question" } },
    { op:"actor.gaze", target:"odysseus", at:40.0, args:{ gaze:{ x:.40, y:.02 } } },
    { op:"actor.pose", target:"eumaeus",  at:42.0, args:{ pose:"eum_speak" } },
    { op:"actor.gaze", target:"eumaeus",  at:42.0, args:{ gaze:{ x:-.38, y:.14 } } },
    // 4 — the twentieth year ends
    { op:"actor.pose", target:"eumaeus",  at:46.0, args:{ pose:"eum_grieve" } },
    { op:"actor.gaze", target:"eumaeus",  at:46.0, args:{ gaze:{ x:-.44, y:.30 } } },
    { op:"actor.pose", target:"odysseus", at:47.0, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus", at:47.0, args:{ gaze:{ x:-.40, y:.42 } } },
    { op:"actor.pose", target:"argos",    at:48.0, args:{ pose:"death" } },
    { op:"actor.pose", target:"eumaeus",  at:50.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eumaeus",  at:50.0, args:{ gaze:{ x:-.08, y:-.14 } } },
    { op:"actor.pose", target:"odysseus", at:52.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus", at:52.0, args:{ gaze:{ x:-.40, y:.38 } } },
    { op:"timeline.capture", target:"OD-B17-S03", at:54.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s   = stateAt(scene, t);
    const blk = blockingAt(gateApproach, MOVES, t, INITIAL);

    /* the field first — it paints the lane, the wall, the gate and the heap,
       and every body keys onto it. The heap must be present for the whole
       scene, so the set holds one state: `neglect`. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"neglect", t:0.4,
              progress:Math.min(.94, .16 + .76*(t/D)), status:"FOULED" },
    });

    /* one queue, sorted by the plan's own depth: the lane decides who stands
       in front, not the order these blocks happen to be written in. */
    const queue = [];
    const add = (d, draw) => queue.push({ d, draw });

    /* --- ARGOS: the nearest body, and the only one who knows -------------- */
    {
      const p  = blk.argos;
      const c  = s.argos || {};
      const pose = c.pose || "neglected";
      const dead = t >= 48;
      add(p.d, () => place(offctx, W, H, argos, {
        // the plan point is his SPINE on the litter; the box is derived from it
        x:p.x, y:p.y, hFrac:DOG * p.scale, ar:ARGOS_AR,
        fx:ARGOS_SPINE, fy:ARGOS_GROUND,
        sig:"argos|" + pose + "|" + Math.round(t * 4),
        state:{
          pose, t,
          status: dead              ? "THE FATE OF BLACK DEATH SEIZED HIM"
                : pose==="failed-rise" ? "HE COULD NOT COME"
                : pose==="wag"          ? "HIS TAIL ON THE LITTER"
                : pose==="recognize"    ? "HE KNEW HIM"
                : pose==="scent"        ? "THE SCENT OF HIS MASTER"
                                        : "FULL OF VERMIN, ON THE DUNG",
          progress: Math.min(.96, .10 + .84*(t/D)),
        },
      }));
    }

    /* --- EUMAEUS: the right-hand lane edge, then up onto the sill --------- */
    {
      const p = blk.eumaeus;
      const c = s.eumaeus || {};
      const answering = t >= 42 && t < 46;
      const grieving  = t >= 46 && t < 50;
      const pose = c.pose || "walk_neutral";
      add(p.d, () => place(offctx, W, H, eumaeus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"eum|" + pose + "|" + (answering?"a":grieving?"g":t>=50?"go":"w"),
        state:{
          t:0.5, band:"threeq",
          pose,
          gaze: c.gaze || { x:-.20, y:.04 },
          browUp:   grieving ? .58 : answering ? .34 : .26,
          browKnit: answering ? .52 : grieving ? .40 : .14,
          eyeNarrow:answering ? .34 : .10,
          frown:    answering ? .38 : grieving ? .30 : 0,
          jaw:      answering ? .42 : 0,
          mouthAsym:answering ? .22 : 0,
          status:   grieving  ? "THE WOMEN DO NOT CARE FOR HIM"
                  : answering ? "THE DOG OF A MAN WHO DIED ABROAD"
                  : t >= 50   ? "IN AHEAD OF HIM"
                              : "BRINGING THE STRANGER UP",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* --- ODYSSEUS: one body, guise "beggar". Nothing is revealed here, and
       the dog is the only thing in Ithaca that does not need to be told. --- */
    {
      const p = blk.odysseus;
      const c = s.odysseus || {};
      const seeing  = t >= 12 && t < 21;
      const known   = t >= 21 && t < 32;
      const weeping = t >= 33 && t < 40;
      const asking  = t >= 40 && t < 47;
      const mourning= t >= 47;
      const pose = c.pose || "walk_neutral";
      add(p.d, () => place(offctx, W, H, odysseus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"ody|" + pose + "|" + (mourning?"m":asking?"q":weeping?"w"
                                  :known?"k":seeing?"s":"walk"),
        state:{
          t:0.5, guise:"beggar", band:"threeq",
          pose,
          gaze: c.gaze || { x:-.14, y:.16 },
          browUp:   weeping ? .52 : known ? .40 : mourning ? .44 : .24,
          browKnit: weeping ? .54 : mourning ? .48 : known ? .30 : asking ? .10 : .20,
          eyeWide:  known && t < 26 ? .24 : 0,
          eyeNarrow:asking ? .32 : weeping ? .30 : .18,
          frown:    weeping ? .50 : mourning ? .42 : 0,
          smile:    asking ? .10 : 0,
          jaw:      asking ? .30 : 0,
          mouthAsym:asking ? .34 : weeping ? .22 : 0,
          status:   mourning ? "TWENTY YEARS, AND ONE BREATH"
                  : asking   ? "WHOSE FINE DOG WAS THAT"
                  : weeping  ? "HE WIPED THE TEAR AWAY UNSEEN"
                  : known    ? "THE ONE THING THAT KNOWS HIM"
                  : seeing   ? "A DOG ON THE DUNG OF HIS OWN GATE"
                             : "THE BEGGAR COMING UP THE LANE",
          progress: Math.min(.96, .16 + .76*(t/D)),
        },
      }));
    }

    /* back → front, by the plan's own depth */
    queue.sort((a, b) => a.d - b.d).forEach(j => j.draw());
  },
};
export default scene;

/* named binding so OD-B17-S04 can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
