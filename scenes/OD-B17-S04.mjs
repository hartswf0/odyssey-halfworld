/* ============================================================
   SCENE  OD-B17-S04 — The Beggar Enters His Hall
   Book XVII, scene 4 of 7. ADDITIVE: creates nothing, modifies nothing; it
   only COMPOSES assets that already exist. Shape copied from the reference
   scene, scenes/OD-B16-S03.mjs, and from the two megaron siblings that solved
   this room before it — scenes/OD-B17-S01.mjs (four clean x lanes) and
   scenes/OD-B18-S01.mjs (a crowd over a hall, benches shoved out of the way).

   ROOM. location.megaron-hall, state "feast" — the hall in the middle of the
   suitors' day: doors open, fire high, arms still on the wall racks, bones and
   fallen cups on the floor. ONE hall asset with a state channel; no second hall
   is built or cast, and every position resolves through scenes/_plans/
   megaron.mjs by station NAME, so the sill this beggar sits on is the sill he
   shoots from in XXI.

   TWO LAYERS ARE DROPPED, each for a measured reason about this floor:
     · `furniture`. ensemble.suitors BAKES A BENCH UNDER EVERY MEMBER (156px
       wide, 34px deep, ink 5, drawn before the body). The hall's own `feast`
       furniture puts benches at bench_l1/l2/r1/r2 and laden tables at table_l /
       table_r — the same band of the same floor. Painted together they double:
       two bench tops a few pixels apart, and at dot scale that welds into one
       dark rail across the near band. So the room supplies the architecture and
       the ensemble supplies the suitors' seating, which is what the ensemble was
       drawn to do.
     · `throne`. The master's chair stands at `throne` (z .86) and its open back
       is a frame from y .777 to y .920 spanning x .424–.576 — the near spine,
       and precisely the one wide gap of bare paper the four benches leave in the
       near band. Painted, the bottom of the frame becomes five dark boxes in a
       row: bench, bench, chair, bench, bench, which is the striped-terrace
       failure with the furniture merely relabelled. It also closes the only lane
       a body could cross the near floor by. Nobody sits in that chair in this
       book and nobody may stand where it is, so it is not set out while the
       suitors hold the hall — which is the joke of the scene anyway.

   THE CROWD, AND WHY IT HAS ONE RANK. ensemble.suitors is the alias of
   ensemble.the-suitors: seated nobles with cups, dice and joints of meat, an
   `attention`/`wave` channel that turns heads toward the stranger at the door
   (this scene, exactly), and members drawn at FIXED PIXEL HEIGHT — 210px in the
   `fgrow` rank, 126px in `bgrow`. Fixed pixels have to be reconciled with the
   room's own size law h = H·s·(0.60+0.50z)·1.08, and only one rank survives it:
     · fgrow, 210px seated ⇒ a standing man of ~292px ⇒ s·(0.60+0.50z)·1.08
       lands at z ≈ 0.83. That is the near band, and it is where they sit.
     · bgrow, 126px seated ⇒ a standing man of ~175px ⇒ the same equation asks
       for z < 0. There is no depth in this hall at which the deep rank is the
       right size; placed anywhere on the floor it reads as children. So
       `bgrow` is switched off and the ranks come from TWO INSTANCES of the
       ensemble at ONE depth — suitors_l on the left-hand benches, suitors_r on
       the right — each with its own box, which is the only lever the asset
       gives on where a member lands.
   `backwall`, `floor`, `bgtable`, `fgtable` and `stranger` are off as well:
   the first two would stack a second room on this one, the tables are 0.6- and
   0.76-of-frame horizontal bars that would stripe the picture, and `stranger`
   is a BAKED cloaked figure in a baked doorway — the very thing the look
   forbids, and in this scene the stranger is a cast body with a name.

   FOUR X LANES, ONE PER BODY (the discipline B17-S01 earned in this room).
   The four seated members land at screen x .100 / .397 / .635 / .868, heads
   .073–.127, .370–.424, .608–.662, .841–.895, benches ±.046 after SHRINK. The
   named bodies are blocked so that no head is inside another body's silhouette:
     eumaeus     bench_l2  x .207  ink .164–.251  head .180–.234
     telemachus  table_l   x .285  ink .244–.327  head .258–.312
     antinous    bench_r1 → table_r  x .750 → .715   head .687–.741
     odysseus    threshold → bench_r2  x .500 → .793  head .765–.819
   Every named figure rises out of a GAP between two benches, and because the
   seated men are at z .83 — nearer than anybody standing — a bench that clips a
   distant shin is occlusion, not fusion: the beggar walks BEHIND the benches
   and is seen from the waist up, which is what a hall looks like from its own
   near end.

   THE FIRE IS ON THE SPINE, AND IT IS 0.125 OF FRAME HIGH IN THIS STATE. The
   hearth ring occupies plan x .395–.605 at z .445–.595 and `feast` gives it seven
   flames of solid ink 7 rising to y .60, so (a) plan.ray("threshold","axe_last")
   walks a man straight through the fire, and (b) — this one only the render
   showed — a body RESTING on the near spine has that black mass directly behind
   its torso and loses its whole contour into it. The first pass ended the round
   at `axe_last` and the beggar came out of the frame with flames for hips. So the
   round is bent to the RIGHT of the fire and STAYS there: threshold → bench_r2,
   one leg, ending at the near end of the right-hand bench. At its closest (plan
   z .445) the path is at plan x .662, clear of the ring's far lip by .057; at its
   end the man stands on open floor with the light wall of the stair behind him.
   It is also the truer blocking — the last man a beggar working that side comes
   to is Antinous, who is why the scene exists — and it puts the two of them a
   measured .078 apart in screen x with 27px of paper between their heads, the
   nearest thing this plan has to a contact pair on the right-hand side.
   ONE TICK OF THAT PATH IS KNOWN AND KEPT. Around t=37.5 the walking figure
   passes the fire at plan z .397 — deeper than the hearth's z .52 — so for about
   a second the top of one flame (a 37x46px patch at x .543–.576, y .60–.66)
   should be in FRONT of his hem and is painted behind it. It is a transit, not a
   rest, and the alternative is either a body standing in the fire or a route that
   leaves the benches he is begging from; a walking man briefly clipping a flame
   tip at the ankle is the cheapest of the three.

   ONE BODY, ONE GUISE. character.odysseus-b16 with guise held flat at
   "beggar" — the same body Athena restored in XVI and re-veiled, never
   character.odysseus-as-beggar. There is no transformation here and therefore
   no restoration flare: nobody in this room penetrates the disguise, and the
   whole content of the scene is that he can be spat at in his own house and
   stay inside it.

   CONTINUITY IN — computed, then TRANSLATED. OD-B17-S03 exports
   exitOccupancy = { odysseus:"aside", eumaeus:"gate_sill", argos:"argos_bed" }.
   Those are GATE-APPROACH stations and blockingAt() would (correctly) throw on
   them here, so GATE_TO_HALL maps the two who come in and DROPS the third:
     gate_sill  -> threshold   the swineherd, already up on the sill outside,
                               goes in first and stands on the hall's own sill
     aside      -> door_main   the beggar, a half step back in the lane, is in
                               the great doors a beat behind him
     argos_bed  -> (dropped)   the dog is dead in the lane. He does not come in.
   Telemachus and Antinous are not in that occupancy — they were never in the
   lane — so their opening stations are declared here from the plan: the prince
   at his own table where OD-B17-S01 left him, the ringleader at the right-hand
   bench where OD-B16-S05 and OD-B18-S01 both put him.

   TWO BODIES ON THE SPINE, NEVER AT ONCE. door_main (z .10) and threshold
   (z .16) are 27px apart on the screen and no two figures may hold them
   together. They never do: Odysseus is not STAGED until t=10 (he is still in
   the courtyard — Homer's own order, Eumaeus in first and the beggar after,
   leaning on his staff), and by t=18 the swineherd is off the sill and away to
   the left. The same rule frees the sill for the sitting: Odysseus holds it from
   t=20 to t=32 with nobody else within .246 of frame.

   THE BAG. prop.begging-bag was drawn for this scene (its own `scene` field
   says OD-B17-S04) and it carries the beat that the beats are about: closed
   coming in, OPEN on the sill, RECEIVING as the portions fall, LADEN by the end
   — most of them gave. It is placed through Odysseus's own blocked point, its
   `body` anchor on the rig's own hip anchor, so it is never a prop with private
   geometry. It is NOT set down on the sill while he sits: the render showed the
   sill's near face (ink 6, y .5445–.583) swallowing it whole, and in the lap the
   same silhouette falls across the open doorway, which `feast` paints at ink 0.

   Beats (Od. 17.328–491):
     1. Eumaeus enters first and Telemachus signals him to seat the beggar at the door.
     2. Odysseus crosses his own threshold unrecognized and hears Phemius singing.
     3. He begs from suitor to suitor to test each man's character.
     4. Most give food while Antinous demands to know who admitted him.

   Verify:  node harness/render-scene.mjs scenes/OD-B17-S04.mjs --t 20  (the sill)
            node harness/render-scene.mjs scenes/OD-B17-S04.mjs --t 38  (the round)
            node harness/render-scene.mjs scenes/OD-B17-S04.mjs --t 52  (Antinous asks)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import antinous   from "../assets/character/antinous.mjs";
import suitors    from "../assets/ensemble/suitors.mjs";
import bag        from "../assets/prop/begging-bag.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 58;

/* the room, minus the two layers argued out in the header. Everything
   load-bearing stays: shell, roof, far wall, the great doors, THE SILL, the
   arms racks, the postern, the maids' door, the stair, the two pillars, the
   dressed spine, the hearth, and the feast's own litter on the floor. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth","litter"];

/* --- SIZES -----------------------------------------------------------------
   One height for every man in this hall, times the plan's own falloff — the
   same MAN this book used in the lane outside (scenes/OD-B17-S02/S03), so the
   beggar who came up the lane is the beggar who comes through the door. */
const MAN = 0.36;
/* --- THE BOX A BODY IS DRAWN IN -------------------------------------------
   placeInstance() hands a module a box of the STAGE's aspect, 1120x760 = 1.474
   wide. engine/figure-hero.mjs sizes the skeleton off min(H*0.9, W*1.26) so the
   HEIGHT survives a wide box, but every width-relative decoration is stretched
   with W: character.eumaeus plants his herdsman's staff at W*0.335 and spreads
   his hide mantle to W*0.165 a side, and in a 1.474 box the staff stands a hand
   away from the man holding it (earned in OD-B17-S03, same three modules). So
   figures here are drawn into the PORTRAIT box makeRestage() uses for every
   character in the atlas, and blitted. FIG_PAD is bleed so a raised arm or the
   staff crown is never clipped. FIG_FLOOR is the rig's own ankle line: the box
   bottom is NOT the floor, and anchoring by it hangs every man a tenth of his
   own height above the ground the plan gave him. */
const FIG_AR    = 660 / 880;
const FIG_PAD   = 0.06;
const FIG_FLOOR = 0.90;
/* the scrip. prop.begging-bag lays its ink from y .14 to .81 of its own box, so
   a box 0.38 of the man's is a pouch about a fifth of his height — a carried
   bag, not a sack. Its own anchors say where the box goes: `body` at the hip
   while he walks, `contact:ground` on the floor while he sits. */
const BAG       = 0.38;
const BAG_BODY  = { x:.54, y:.610 };
/* (the bag's `contact:ground` anchor, .54/.795, is deliberately unused — see stage()) */

/* blit a module into a box of a chosen aspect, anchored by a point inside it.
   `fx`/`fy` say where in the box the anchor lands (0..1). sigExtra is REQUIRED:
   keyedModuleCanvas caches on pose/band/t only, so without it a change of gaze
   or brow returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* --- THE TWO CROWD BOXES --------------------------------------------------
   ensemble.suitors lays its `fgrow` members at lerp(box·0.22, box·0.80) and
   plants their benches on box·0.86, so the BOX is the placement. Each box below
   is solved backwards from where its two members must land:
       boxW = (x1 - x0)/0.58 ,  boxLeft = x0 - 0.22·boxW ,
       boxTop = FOOT − 0.86·boxH
   FOOT .875 is the near band (z .83) the member's own 210px demands. boxH .42
   plus 6% bleed keeps the bench legs (FOOT + .068) and the crowns (FOOT − .276)
   inside the canvas. The asset's deterministic jitter is ±0.015 of a box —
   ±7px here — and every lane above is cleared by more than that. */
const FOOT = 0.835, CROWD_H = 0.42, CROWD_PAD = 0.06;
/* SHRINK — earned from the first render, which is the only place it could be.
   The ensemble's member is 210px of SEATED man with a head 40% of that height:
   drawn at its native size on this stage it came out taller and far broader in
   the skull than any figure-hero body standing beside it, and its four 156px
   benches laid a near-continuous dark rail across the bottom of the frame — the
   two things the look forbids in one object. The asset gives no size channel, so
   the ensemble is drawn into a canvas 1/SHRINK larger and blitted down: member
   size falls to 139px (a seated man about two thirds of a standing one, which is
   what a seated man is) and the bench to 103px, which opens .19 of clear paper
   between one man and the next. Every box fraction below is unaffected — a point
   at internal fraction f still lands at box.left + f·box.w — so the four lanes
   are the lanes that were solved on paper. */
const SHRINK = 0.66;
const crowdBox = (x0, x1) => {
  const w = (x1 - x0) / 0.58;
  return { w, left: x0 - 0.22 * w, top: FOOT - 0.86 * CROWD_H, h: CROWD_H };
};
const CROWD_L = crowdBox(0.100, 0.390);     // the left-hand benches
const CROWD_R = crowdBox(0.635, 0.870);     // the right-hand benches
/* seeds chosen so the four men are not four of the same man: sprawl + dice on
   the left, joint of meat + dice on the right (variant is the ensemble's own
   second draw from the seed, so the choice is made by picking the seed). */
const SEED_L = 1701, SEED_R = 1811;

function placeCrowd(offctx, W, H, box, seed, state){
  const wS = W * box.w, hS = H * box.h;            // the box on the stage
  const wI = wS / SHRINK, hI = hS / SHRINK;        // the canvas it is drawn in
  const pad = CROWD_PAD;
  const sig = `${seed}|${Math.round((state.attention ?? 0)*20)}`
            + `|${Math.round((state.wave ?? 0)*20)}|${Math.round((state.t ?? 0)*8)}`;
  const cv = keyedModuleCanvas(suitors, wI, hI, { ...state, seed, rows:2,
    perRow:[2,0], density:1.0, layers:["fgrow"] }, sig, 0.895, pad);
  offctx.drawImage(cv, box.left * W - pad * wS, box.top * H - pad * hS,
                   cv.width * SHRINK, cv.height * SHRINK);
}

/* the hall's attention, as a function of the clock and nothing else. The
   asset's `wave` is a front travelling across its members from the door side;
   `attention` is how many hold their heads there once it has passed. */
const W0 = 30, W1 = 44;                       // the round: head after head turns
const waveAt = t => clamp((t - W0) / (W1 - W0), 0, 1);
function crowdAt(t){
  if (t < 12) return { attention:0.00, wave:0.00, status:"CAROUSING" };
  if (t < 20) return { attention:0.16, wave:0.00, status:"A MAN IN THE DOOR" };
  if (t < W0) return { attention:0.24, wave:0.00, status:"IGNORING HIM" };
  if (t < W1) return { attention:0.34, wave:waveAt(t), status:"HE COMES ROUND" };
  return        { attention:0.72, wave:1.00, status:"MOST OF THEM GAVE" };
}

/* --- CONTINUITY IN -------------------------------------------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B17-S03.mjs";
const GATE_TO_HALL = {
  gate_sill: "threshold",   // Eumaeus goes in first, onto the hall's own sill
  aside:     "door_main",   // the beggar a beat behind him, in the great doors
  /* argos_bed has no equivalent here on purpose: Argos is dead on the dung at
     the foot of the heap outside. The filter below drops him, which is the
     correct outcome and the reason the map is written out at all. */
};
const INHERITED = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, station]) => [who, GATE_TO_HALL[station]])
    .filter(([, station]) => station)
);
const INITIAL = {
  ...INHERITED,                                  // { eumaeus:"threshold", odysseus:"door_main" }
  eumaeus:    INHERITED.eumaeus  || "threshold",
  odysseus:   INHERITED.odysseus || "door_main",
  telemachus: "table_l",       // his own table, where OD-B17-S01 left him
  antinous:   "bench_r1",      // his place on the right-hand bench
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Odysseus is not DRAWN before STAGED_AT: he is still out in the courtyard, so
   the spine holds one body at a time and the sill is empty when he reaches it.
   Telemachus and Antinous never move — that is the scene. The prince may not
   act and the ringleader does not have to. */
const STAGED_AT = 10;
const MOVES = [
  // 1 — the swineherd off the sill and away to the prince, for the bread
  { who:"eumaeus",  from:"threshold", to:"bench_l2", t0: 8, t1:18 },
  // 2 — the beggar crosses his own threshold and sits down on the ash sill
  { who:"odysseus", from:"door_main", to:"threshold", t0:12, t1:20 },
  // 3 — the round: down the right-hand benches, clear of the fire, and he ends
  //     at the near end of them, in front of the last man he comes to
  { who:"odysseus", from:"threshold", to:"bench_r2",  t0:32, t1:46 },
  // 4 — the ringleader comes forward off his bench to his own table to ask it
  { who:"antinous", from:"bench_r1",  to:"table_r",   t0:40, t1:46 },
];

export const scene = {
  id:"OD-B17-S04",
  title:"The Beggar Enters His Hall",
  book:17,
  plan:"megaron",
  duration:D,
  beats:[
    "Eumaeus enters first and Telemachus signals him to seat the beggar at the door.",
    "Odysseus crosses his own threshold unrecognized and hears Phemius singing.",
    "He begs from suitor to suitor to test each man's character.",
    "Most give food while Antinous demands to know who admitted him.",
  ],
  exitState:"Midday in the great hall, the suitors at their meat with the fire high and the floor already littered. Odysseus has crossed his own threshold as a beggar and has not been recognized by anyone in the room: he came in behind the swineherd, was seated at the door on the ash sill by Telemachus's own order, heard Phemius singing to the lyre in his own house, and then went the round of the hall from man to man with the scrip open. Most of them gave — bread and meat out of the baskets — so the bag is LADEN and the tally of donors is written into its face. He has worked his way down the right-hand benches and now stands at the near end of them, at bench_r2, in front of the last man he came to. That man is Antinous, who has given nothing: he has come forward off his bench to his own table and demanded aloud of Eumaeus who brought this creature to the town. The question is now public, in front of everybody, and it is the first move of the quarrel that ends in XXII. The swineherd is at the prince's side at the near end of the left-hand bench with his answer — that Telemachus himself ordered it — still in his mouth. Telemachus holds his own table and his temper and says nothing, because saying anything is the one thing he has been told not to do. Nothing has been revealed; the guise is intact, no man in the room knows anything, the doors are still open, the arms are still on the walls, and the twelve axes have not been thought of yet.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ eumaeus:"entrance:main (threshold, in first)",
              odysseus:"entrance:main (door_main, staged at t=10, a beat behind him)",
              telemachus:"already at table_l from OD-B17-S01",
              antinous:"already at bench_r1", suitors:"already on their benches" },
  exits:{ /* nobody leaves the hall in this scene — that is the point of it */ },
  walkable:"megaron zones.walkable + lane:spine, MINUS the hearth ring (plan " +
           "x .395–.605, z .445–.595), MINUS the near band the seated ensemble " +
           "occupies (z ≈ .83), and MINUS the near spine, which is the empty " +
           "chair's ground and has the fire behind it. Resting ground here is " +
           "threshold, bench_l2, table_l, table_r, bench_r1, bench_r2.",
  depthOrder:"one queue, sorted by the plan's own z: antinous (.62 → .70) behind " +
             "telemachus (.70) behind odysseus (.10 → .16 → .76) behind " +
             "eumaeus (.76) behind the two seated ensembles (.83). The suitors " +
             "are the NEAREST bodies in the frame and are drawn last, so the " +
             "beggar passes behind their benches on his round.",
  gazeTargets:{ eumaeus:"the prince, then the beggar, then Antinous across the hall",
                telemachus:"the door, then the swineherd, then Antinous — never his father",
                odysseus:"the hall he owns, then the singing up under the roof, then each man's hands",
                antinous:"the beggar, then the swineherd he blames for him",
                suitors:"their cups and their dice, until the wave turns their heads to him" },
  attachments:[
    { at: 0, who:"odysseus", change:"beggar's staff and scrip carried (guise:beggar)" },
    { at:20, who:"bag_01",   change:"scrip opened in his lap on the sill (mode:open)" },
    { at:32, who:"bag_01",   change:"carried at the hip as he goes the round" },
    { at:36, who:"bag_01",   change:"held out open at each man in turn (mode:receiving)" },
    { at:46, who:"bag_01",   change:"laden — the portions crest the neck (mode:laden)" },
  ],
  sound:[
    { at: 0, source:"door_main",    cue:"the great doors on their pivots; the suitors' noise" },
    { at: 4, source:"table_l",      cue:"the prince's voice, low, to the swineherd only" },
    { at:14, source:"pillar_r",     cue:"Phemius on the lyre at the far end of the hall" },
    { at:20, source:"threshold",    cue:"a staff laid down on the ash sill" },
    { at:26, source:"hearth",       cue:"the fire, high, and fat going into it" },
    { at:34, source:"bench_r2",     cue:"bread out of the baskets, one man after another" },
    { at:44, source:"table_r",      cue:"Antinous, loud, over everybody: who brought him here" },
    { at:48, source:"bench_l2",     cue:"the swineherd answering, and the prince not answering" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.750,y:.774}, scale:.354, band:"threeq", pose:"arms_crossed" },
    /* (antinous comes forward to table_r, x .715/y .813, at t=40–46) */
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.285,y:.813}, scale:.364, band:"threeq", pose:"lean_forward" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.500,y:.538}, scale:.264, band:"threeq", pose:"walk_neutral" },
    { asset:"prop.begging-bag", instance:"bag_01",
      anchor:{x:.520,y:.538}, scale:.100 },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.207,y:.842}, scale:.381, band:"threeq", pose:"walk_neutral" },
    { asset:"ensemble.suitors", instance:"suitors_l",
      anchor:{x:.245,y:.875}, scale:.500 },
    { asset:"ensemble.suitors", instance:"suitors_r",
      anchor:{x:.753,y:.875}, scale:.405 },
  ],

  timeline:[
    // 1 — the swineherd in first, and the prince's signal
    { op:"actor.pose", target:"eumaeus",    at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eumaeus",    at: 0.0, args:{ gaze:{ x:-.26, y:.18 } } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at: 0.0, args:{ gaze:{ x:.10, y:-.28 } } },
    { op:"actor.pose", target:"antinous",   at: 0.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"antinous",   at: 0.0, args:{ gaze:{ x:-.18, y:-.04 } } },
    { op:"actor.pose", target:"telemachus", at: 6.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"telemachus", at: 6.0, args:{ gaze:{ x:.06, y:-.30 } } },
    { op:"actor.pose", target:"eumaeus",    at: 8.0, args:{ pose:"eum_listen" } },
    { op:"actor.gaze", target:"eumaeus",    at: 8.0, args:{ gaze:{ x:.30, y:.06 } } },
    // 2 — the beggar crosses his own threshold and hears the singing
    { op:"actor.pose", target:"odysseus",   at:10.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at:10.0, args:{ gaze:{ x:.08, y:.10 } } },
    { op:"prop.state", target:"bag_01",     at:10.0, args:{ mode:"closed" } },
    { op:"actor.pose", target:"telemachus", at:16.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"telemachus", at:16.0, args:{ gaze:{ x:-.34, y:.10 } } },
    { op:"actor.pose", target:"odysseus",   at:20.0, args:{ pose:"crouch" } },
    { op:"actor.gaze", target:"odysseus",   at:20.0, args:{ gaze:{ x:.34, y:.10 } } },
    { op:"prop.state", target:"bag_01",     at:20.0, args:{ mode:"open" } },
    { op:"actor.pose", target:"eumaeus",    at:22.0, args:{ pose:"eum_speak" } },
    { op:"actor.gaze", target:"eumaeus",    at:22.0, args:{ gaze:{ x:.36, y:.14 } } },
    { op:"actor.gaze", target:"odysseus",   at:26.0, args:{ gaze:{ x:.26, y:-.40 } } },
    // 3 — the round of the hall, man by man
    { op:"actor.pose", target:"odysseus",   at:32.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at:32.0, args:{ gaze:{ x:.30, y:.12 } } },
    { op:"crowd.state",target:"suitors_l",  at:W0,   args:{ wave:0, status:"HE COMES ROUND" } },
    { op:"crowd.state",target:"suitors_r",  at:W0,   args:{ wave:0, status:"HE COMES ROUND" } },
    { op:"actor.pose", target:"odysseus",   at:36.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:36.0, args:{ gaze:{ x:.40, y:.16 } } },
    { op:"prop.state", target:"bag_01",     at:36.0, args:{ mode:"receiving" } },
    { op:"actor.pose", target:"telemachus", at:38.0, args:{ pose:"skepticism" } },
    { op:"actor.gaze", target:"telemachus", at:38.0, args:{ gaze:{ x:.42, y:-.02 } } },
    { op:"actor.pose", target:"odysseus",   at:44.0, args:{ pose:"palm_up_question" } },
    { op:"actor.gaze", target:"odysseus",   at:44.0, args:{ gaze:{ x:.44, y:.02 } } },
    // 4 — most of them gave; Antinous asks who let him in
    { op:"actor.pose", target:"antinous",   at:44.0, args:{ pose:"jabbing_accusation" } },
    { op:"actor.gaze", target:"antinous",   at:44.0, args:{ gaze:{ x:-.46, y:.10 } } },
    { op:"crowd.state",target:"suitors_l",  at:W1,   args:{ wave:1, status:"MOST OF THEM GAVE" } },
    { op:"crowd.state",target:"suitors_r",  at:W1,   args:{ wave:1, status:"MOST OF THEM GAVE" } },
    { op:"prop.state", target:"bag_01",     at:46.0, args:{ mode:"laden" } },
    { op:"actor.pose", target:"eumaeus",    at:48.0, args:{ pose:"eum_ward" } },
    { op:"actor.gaze", target:"eumaeus",    at:48.0, args:{ gaze:{ x:.44, y:-.02 } } },
    { op:"actor.pose", target:"telemachus", at:50.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus", at:50.0, args:{ gaze:{ x:.46, y:-.04 } } },
    { op:"actor.pose", target:"odysseus",   at:52.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:52.0, args:{ gaze:{ x:.36, y:.06 } } },
    { op:"timeline.capture", target:"OD-B17-S04", at:56.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s     = stateAt(scene, t);
    const blk   = blockingAt(megaron, MOVES, t, INITIAL);
    const crowd = crowdAt(t);

    /* the field first — it paints the hall, the doors, the sill, the fire and
       the litter, and every body keys onto it. ONE state for the whole scene:
       the suitors are at their meat from the first frame to the last. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"feast", t:0.55, layers:HALL_LAYERS,
              progress:Math.min(.94, .18 + .76*(t/D)), status:"MISRULE" },
    });

    /* one queue, sorted by the plan's own depth: the room decides who stands in
       front, not the order these blocks happen to be written in. */
    const queue = [];
    const add = (d, draw) => queue.push({ d, draw });

    /* --- ANTINOUS: he never leaves his bench and never gives anything ----- */
    {
      const p = blk.antinous;
      const c = s.antinous || {};
      const asking = t >= 44;
      const pose = c.pose || "arms_crossed";
      add(p.d, () => place(offctx, W, H, antinous, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"ant|" + pose + "|" + (asking ? "q" : t >= 30 ? "w" : "i"),
        state:{
          t:0.5, band:"threeq",
          pose,
          gaze: c.gaze || { x:-.18, y:-.04 },
          browKnit: asking ? .74 : .30,
          browUp:   asking ? .18 : .10,
          eyeNarrow:asking ? .42 : .30,
          frown:    asking ? .44 : .16,
          jaw:      asking && t < 52 ? .52 : 0,
          mouthAsym:asking ? .28 : .46,
          status:   asking ? "WHO BROUGHT HIM TO THE TOWN"
                  : t >= 30 ? "HE GIVES NOTHING" : "AMUSED",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* --- TELEMACHUS: he gives the order, then holds his own temper -------- */
    {
      const p = blk.telemachus;
      const c = s.telemachus || {};
      const signalling = t >= 6 && t < 16;
      const giving     = t >= 16 && t < 32;
      const holding    = t >= 50;
      const pose = c.pose || "lean_forward";
      add(p.d, () => place(offctx, W, H, telemachus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"tel|" + pose + "|" + (holding?"h":giving?"g":signalling?"s":"w"),
        state:{
          t:0.5, band:"threeq",
          pose,
          gaze: c.gaze || { x:.10, y:-.28 },
          browUp:   signalling ? .30 : holding ? .22 : .18,
          browKnit: holding ? .62 : giving ? .24 : .16,
          eyeNarrow:holding ? .40 : .16,
          frown:    holding ? .48 : 0,
          smile:    giving ? .14 : 0,
          jaw:      signalling && t < 12 ? .34 : 0,
          mouthAsym:holding ? .22 : 0,
          status:   holding    ? "HE SAYS NOTHING"
                  : giving     ? "BREAD AND MEAT, AND BID HIM BEG"
                  : signalling ? "SEAT HIM AT THE DOOR" : "THE PRINCE'S TABLE",
          progress: Math.min(.96, .16 + .76*(t/D)),
        },
      }));
    }

    /* --- ODYSSEUS: one body, guise held flat at "beggar". Not staged until
       t=10 — he is still out in the courtyard, which is what keeps the spine
       to one body and the sill empty for him. --------------------------- */
    if (t >= STAGED_AT){
      const p = blk.odysseus;
      const c = s.odysseus || {};
      const crossing = t < 20;
      const sitting  = t >= 20 && t < 32;
      const hearing  = t >= 26 && t < 32;
      const begging  = t >= 32 && t < 44;
      const asked    = t >= 44;
      const pose = c.pose || "walk_neutral";
      const figH = MAN * p.scale;
      add(p.d, () => {
        place(offctx, W, H, odysseus, {
          x:p.x, y:p.y, hFrac:figH, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          sig:"ody|" + pose + "|" + (asked?"a":begging?"b":hearing?"l"
                                    :sitting?"s":"x"),
          state:{
            t:0.5, guise:"beggar", band:"threeq",
            pose,
            gaze: c.gaze || { x:.08, y:.10 },
            browUp:   hearing ? .48 : asked ? .34 : .22,
            browKnit: asked ? .30 : begging ? .34 : sitting ? .26 : .20,
            eyeNarrow:begging ? .34 : asked ? .26 : .16,
            eyeWide:  crossing && t < 16 ? .20 : 0,
            frown:    sitting && !hearing ? .22 : 0,
            smile:    begging ? .10 : 0,
            jaw:      begging && t < 40 ? .28 : 0,
            mouthAsym:begging ? .34 : asked ? .20 : .12,
            status:   asked    ? "THE LAST MAN HE COMES TO"
                    : begging  ? "FROM MAN TO MAN, TO KNOW THEM"
                    : hearing  ? "A SINGER IN HIS OWN HOUSE"
                    : sitting  ? "ON HIS OWN ASH THRESHOLD"
                               : "THE BEGGAR IN THE GREAT DOORS",
            progress: Math.min(.96, .14 + .78*(t/D)),
          },
        });
        /* THE SCRIP — through his blocked point, never a private anchor: its
           `body` anchor rides his hip, which is the rig's own anchor at 0.66 of
           the figure box, i.e. (0.90−0.66) of the box above the ground the plan
           gave him. It is NOT set down on the sill while he sits, though that is
           what a man does — the render showed why: the sill's near face is ink 6
           and the slab runs y .5445–.583, exactly where a bag at his feet lands,
           and the pouch disappeared into it. Held in the lap the same silhouette
           falls across the open doorway, which the `feast` state paints at
           ink 0 — the one patch of clean paper in the deep field, and the bag
           reads black against it. */
        const mode = t >= 46 ? "laden" : t >= 36 ? "receiving"
                   : t >= 20 ? "open"  : "closed";
        const bagH = BAG * figH;
        /* the scrip hangs on his INBOARD side — the side he is begging toward,
           away from the wall he is working. On the outboard side the second
           render had it land inside the near seated suitor at x .868, who is
           drawn after him and covered it: the LADEN bag is the payoff of the
           whole beat and it has to be the one thing in front of open floor. */
        const dx   = -0.042 * p.scale;
        place(offctx, W, H, bag, {
          x:p.x + dx, y:p.y - 0.24 * figH,
          hFrac:bagH, ar:FIG_AR, fx:BAG_BODY.x, fy:BAG_BODY.y, pad:0.04,
          sig:"bag|" + mode + "|" + Math.round(t * 2),
          state:{
            mode, t, open: mode === "closed" ? 0 : 1,
            status: mode === "laden" ? "LADEN" : mode === "receiving" ? "RECEIVING"
                  : mode === "open" ? "OPEN" : "CLOSED",
            progress: Math.min(.94, .12 + .8*(t/D)),
          },
        });
      });
    }

    /* --- EUMAEUS: in first, off the sill, and at the prince's side -------- */
    {
      const p = blk.eumaeus;
      const c = s.eumaeus || {};
      const listening = t >= 8 && t < 22;
      const speaking  = t >= 22 && t < 48;
      const warding   = t >= 48;
      const pose = c.pose || "walk_neutral";
      add(p.d, () => place(offctx, W, H, eumaeus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"eum|" + pose + "|" + (warding?"d":speaking?"s":listening?"l":"w"),
        state:{
          t:0.5, band:"threeq",
          pose,
          gaze: c.gaze || { x:-.26, y:.18 },
          browUp:   listening ? .50 : warding ? .34 : .28,
          browKnit: warding ? .62 : speaking ? .38 : .18,
          eyeNarrow:warding ? .36 : .12,
          frown:    warding ? .40 : 0,
          jaw:      speaking && t < 30 ? .40 : warding && t < 54 ? .44 : 0,
          mouthAsym:speaking ? .20 : 0,
          status:   warding   ? "THE PRINCE'S OWN ORDER"
                  : speaking  ? "BEG FROM THEM ALL, HE SAYS"
                  : listening ? "AT THE PRINCE'S HAND" : "IN FIRST, AHEAD OF HIM",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* --- THE SUITORS: the nearest bodies, on their own benches, drawn last.
       Two instances, one box each, one depth — see the header. -------------- */
    add(0.83, () => {
      placeCrowd(offctx, W, H, CROWD_L, SEED_L, { ...crowd, t:Math.min(.98, t/D) });
      placeCrowd(offctx, W, H, CROWD_R, SEED_R, { ...crowd, t:Math.min(.98, t/D) });
    });

    /* back → front, by the plan's own depth */
    queue.sort((a, b) => a.d - b.d).forEach(j => j.draw());
  },
};
export default scene;

/* named binding so OD-B17-S05 can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
