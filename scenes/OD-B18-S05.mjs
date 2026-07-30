/* ============================================================
   SCENE  OD-B18-S05 — Melantho and Eurymachus Attack
   Book XVIII, scene 5 — the last scene of the book. ADDITIVE: creates nothing,
   modifies nothing; it only COMPOSES modules that already exist. Shape copied
   from the reference scene scenes/OD-B16-S03.mjs and from its Book XVIII
   siblings OD-B18-S01.mjs (the megaron-with-a-crowd case), OD-B18-S03.mjs (the
   registered-plate case) and OD-B18-S04.mjs (the one this scene inherits from).

   ROOM. location.megaron-hall, state "feast", with the SAME layer list S01, S03
   and S04 painted — so every fixture named here stands where those three shots
   put it: the great doors open in the far wall, THE SILL, the fire HIGH at the
   hearth (which is the light the maids are supposed to be tending), both
   pillars, the arms racks, the postern, the maids' door on the right, and the
   stair Penelope has just gone up. The `furniture`, `litter` and `throne`
   layers stay dropped for the reason S01 dropped them and nobody has undone:
   the floor was shoved open for the fight in S01 and the benches, the laden
   tables and the master's chair are still back against the walls. That is also
   what frees the bench/table stations to hold bodies at all, and it is what
   makes the ONE piece of furniture in this frame — the stool Eurymachus throws
   — the only thing standing on the open floor. ONE hall asset with a state
   channel; no second hall is built or cast.

   THE PICTURE. Three columns and no more. The megaron in this projection gives
   a near-band body about 0.17 of the frame of width, and its stations bunch:
   on the right flank `table_r` (.715), `bench_r1` (.749), `bench_r2` (.793) and
   `stair_up` (.837) all lie inside 0.12 of one another, and the left flank
   (`bench_l2` .207, `bench_l1` .251, `table_l` .285) is the same. So the room
   holds exactly THREE painted bodies at once — one left flank, one right flank,
   one on the spine — and this scene has FOUR named actors. The fourth is
   therefore rotated in on the CLOCK, which is what the beats ask for anyway:

     odysseus    threshold -> axe_first   THE SPINE. He starts on the sill where
                                          S01, S03 and S04 all leave him and
                                          steps two paces up the lane toward the
                                          braziers, which is the whole of his
                                          movement in 18.343: the maids are sent
                                          out and he stands holding the light
                                          himself. `axe_first` is used here
                                          purely as a floor point on the lane —
                                          the twelve helves belong to Book XXI
                                          and the `axes` layer is not painted in
                                          `feast`. Nobody else stands on x .500.
     eurymachus  table_l                  NEAR LEFT, his own table, and he does
                                          not move once: the mock, the offer of
                                          day-labour and the throw all come off
                                          one station. The stool is at his feet
                                          and the beggar is up the room to his
                                          right, so the throw crosses the frame
                                          from the near left to the far centre.
     melantho    doorway_maid -> table_r   the RIGHT flank, in two depths. She
                 -> doorway_maid          is painted from the first frame at the
                                          women's door with the brand-arm up
                                          (mth_torch — the duty she was given),
                                          comes down onto the near floor to the
                                          men's table for the other face
                                          (mth_intimacy, mth_laugh), and
                                          flounces back out through the same
                                          door (mth_dismiss). She is out of the
                                          picture at t=35.
     telemachus  bench_l1 -> bench_r1     inherited on the LEFT from S04 and
                                          moved across to the right-hand bench
                                          in the first ten seconds, while he is
                                          NOT painted — he has nothing to say
                                          until 18.405 and the left flank is
                                          Eurymachus's for the whole quarrel.
                                          He is painted from t=37, into the
                                          right flank Melantho has just left,
                                          and the rebuke is delivered across the
                                          full width of the room.

   WHY THE HANDOVER IS DONE THAT WAY, AND WHAT IT COSTS. Between t=14 and t=30
   Telemachus is blocked at `bench_r1` (.749) while Melantho is at `table_r`
   (.715) — thirty-four thousandths of the frame apart. If both were painted
   they would print as one clump, which is exactly why only one of them ever is:
   she is dropped from the drawing loop at t=35 and he enters it at t=37, with two
   seconds of clear paper between. They are DIFFERENT stations (a bench and a
   table, a few feet apart in a real hall), never the same coordinates, so rule
   B is not bent — but the two are never in the frame together and that is a
   staging decision, not an accident. The alternative was to leave him on
   `bench_l1` and walk him across at t=37, and that path takes him through x
   .500 at a nearer footline than the beggar's: for two seconds his head and
   chest would cross the beggar's legs. A pop-in on a vacated flank is cheaper
   than an occlusion of the one body the scene is about, and S04 set the
   precedent when it held Penelope out of the drawing loop until t=11.

   NOT PAINTED, NOT LOST. S04 hands over four bodies, all on MEGARON stations,
   so the occupancy is imported straight — no translation map is needed and none
   is invented (rule F only bites when the room changes).
   · PENELOPE is blocked `bench_r1` -> `stair_up` over the first five seconds and
     is never painted. Beat 1 is "after Penelope withdraws"; the withdrawal is
     the thing that lets the maids light the hall for the suitors at all, and it
     is over before the first frame of the quarrel. She stays in
     `exitOccupancy` at the head of her own stair, which is where Book XIX needs
     her.
   · AMPHINOMUS holds `bench_l2` and is not painted: the near-left flank holds
     one body and it has to be Eurymachus. He is still carried in the blocking
     and still handed on.
   · THE OTHER MAIDS are in the beat text and not in the picture. The atlas asks
     for `character.melantho` and she is the named one; ensemble.disloyal-maids
     is a Book XX asset that paints its own portico, route and forecourt hide,
     and casting it here would put a second room inside this one.

   ONE BODY, ONE GUISE, NO FLARE. The atlas asks for
   `character.odysseus-as-beggar`. That is character.odysseus-b16 with
   guise:"beggar" — the same body Books XVI and XVII used and the same one S01
   through S04 used, never a cut to a second module. The guise is held FLAT at
   "beggar" from the first frame to the last and there is no
   divine_fx.athenas-restoration in this scene: the restoration flare exists to
   cover the garment snap at u=0.5 and nothing about this man changes here. What
   changes is what his face and his spine are doing — he takes the maid's
   insult, warns her, answers the offer of day-labour with a challenge of work
   and war, and then ducks.

   THE MISSING PROP, AND WHAT STANDS IN FOR IT. The atlas asks for
   `prop.hall-lamps-and-missed-stool`. That module does not exist in this repo
   (book18/jobs.json lists it as an unbuilt job and there is no
   assets/prop/hall-lamps-*.mjs), and this agent was assigned a SCENE, so it is
   composed out of what is on the shelf rather than invented here:
   · the MISSED STOOL is prop.thrown-footstool, the low carpentered slab
     Book XVII already threw across this same hall — the right object, already
     in family, with a rigid-body rotation and its own throw states. TWO of them
     are used: `lift` (SEIZED — the slab off the floor at Eurymachus's near hand,
     with the module's grip ticks along the seized rail and its lift arrow above
     it) and `rest` (IT MISSED — standing on its four legs on the near
     flagstones, half the room away from where it started and well in front of
     the man it was thrown at). The cut between them at t=35.5 IS the throw, and
     it is covered on both sides: Odysseus goes into `crouch` a second before it
     (18.395, he ducked) and Eurymachus's arm is still out in `confrontation` a
     second after. `evidence` was the first choice for the landed state and was
     rejected off the render: at rot 1.78 the tumbled carpentry prints as a thin
     vertical armature — it reads as a short ladder, not a stool — and its marker
     peg and floor scuff sat down in the card's meter. `rest` is the only state
     in the module that shows four legs, a fret band and a top face at once, and
     a stool that lands upright is an ordinary thing for a stool to do.
   · the HALL LAMPS are the room's own light: `feast` paints the hearth fire
     HIGH (seven tongues) and it is the only light source the megaron has, plus
     Melantho's mth_torch, the pine-brand arm she holds up over the braziers in
     the first beat and abandons in the second. divine_fx.athenas-golden-lamp
     was NOT cast for this: that is the goddess's light in Book XIX and putting
     it in a room the gods are not lighting would be a continuity lie.
     Consequence, stated plainly: there is no drawn lamp-flame in the maid's
     fist. The rig reports a `torchGrip` anchor and draws no brand, and this
     scene does not overpaint one — hand-drawn ctx work on a figure is what
     pushed the six Odysseus modules out of family, and a scene places, never
     redraws.

   WHERE THE STOOL IS, TO THE THOUSANDTH. prop.thrown-footstool positions its
   carpentry at fixed fractions of whatever box it is given, and sizes it off
   the box WIDTH only, so the box is pure blocking:
       stool_x = boxLeft + P.cx * W     stool_y = boxBase - (1 - P.cy) * H
   Both boxes are given the module's authored 660:880 aspect
   (H = W * 1120 / (0.75 * 760)), because that is the only aspect at which its
   own floor line passes under its own feet — off-aspect the legs hang above the
   line or punch through it. The two widths differ (0.238 for `lift`, 0.228 for
   `rest`) so the stool prints the SAME size in both: the module scales the
   carpentry by P.s * boxW, and P.s is 0.288 in `lift` and 0.300 in `rest`. The
   landed box is solved on the stool's own top-front edge (its local origin) so
   its four feet come down on the module's floor line at y .880, which is .14 of
   the frame clear of the hearth ring above it and clear of both near flanks.

   WHY THERE IS NO `flight` PLATE, WHICH IS THE ONE THING THIS SCENE GAVE UP.
   Two drafts tried it and both failed on the module's own arc geometry: the
   dashed parabola spans 0.74 box-widths and puts the stool only 0.315 of that in
   from the left end, so an arc wide enough to STRADDLE the beggar (his
   silhouette is 0.16 of the frame) needs a box half the frame wide — which
   prints a footstool wider than a man. Draft 2 tried W=0.28/H=0.55: the flying
   slab came out 0.19 of the frame across, up among the rafters and the
   clerestory, and read as a piece of the roof coming loose. Draft 3 shrank it to
   W=0.20/H=0.34 and cleared his crown vertically; the trajectory was legal and
   the object still read as a dark diagonal wedge on the far wall rather than as
   a stool — a tumbled slab at 0.098 of the frame is under the size at which the
   dot lattice will give you four legs and a fret band. So the throw is carried
   by the CUT instead, which is what the two ground states are for.

   Beats (Od. 18.304–428):
     1. Penelope withdraws; the disloyal maids set the braziers going to light
        the hall for the suitors.
     2. Melantho tells the beggar to get out and sleep in a forge; he warns her
        that the master may yet come home and Penelope may hear of it.
     3. Eurymachus mocks his bald head, then offers him day-labour on a farm
        only to say he prefers begging to work.
     4. Odysseus answers with a challenge — set us both to mowing or to war and
        see who tires — and Eurymachus throws a footstool at him and misses.
     5. Telemachus rebukes the suitors for handling a guest that way and ends
        the night's disorder.

   Verify:  node harness/render-scene.mjs scenes/OD-B18-S05.mjs --t 5
            node harness/render-scene.mjs scenes/OD-B18-S05.mjs --t 20
            node harness/render-scene.mjs scenes/OD-B18-S05.mjs --t 36
            node harness/render-scene.mjs scenes/OD-B18-S05.mjs --t 45
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import melantho   from "../assets/character/melantho.mjs";
import eurymachus from "../assets/character/eurymachus.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import stool      from "../assets/prop/thrown-footstool.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 48;

/* the room, minus the benches, the laden tables, the litter and the master's
   chair — all still shoved back from the fight in S01. Identical to the list
   S01, S03 and S04 paint, so this is the same hall. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth"];

/* --- CONTINUITY IN. Computed upstream, imported straight. -----------------
   S04 ends {odysseus:"threshold", penelope:"bench_r1", telemachus:"bench_l1",
   amphinomus:"bench_l2"} — all MEGARON stations, all still true, so there is
   nothing to translate. The two bodies this scene brings into the book are
   declared by station name. */
import { exitOccupancy as PREV_EXIT } from "./OD-B18-S04.mjs";
const INITIAL = {
  ...PREV_EXIT,
  melantho:   "doorway_maid",   // in by the women's door, sent to tend the light
  eurymachus: "table_l",        // his own place at the near-left table
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Eurymachus has no row: he holds `table_l` for the whole scene, and every
   piece of the attack comes off that one station. */
const MOVES = [
  // the queen goes up her own stair — beat 1 is what happens AFTER that
  { who:"penelope",   from:"bench_r1",     to:"stair_up",     t0: 0, t1: 5 },
  // the son crosses to the right-hand bench before he is painted (see header)
  { who:"telemachus", from:"bench_l1",     to:"bench_r1",     t0: 2, t1:10 },
  // the beggar steps off the sill and up the lane to the braziers
  { who:"odysseus",   from:"threshold",    to:"axe_first",    t0:10, t1:16 },
  // the maid abandons the light for the men's table, then flounces out
  { who:"melantho",   from:"doorway_maid", to:"table_r",      t0: 8, t1:14 },
  { who:"melantho",   from:"table_r",      to:"doorway_maid", t0:30, t1:35 },
];

/* --- FIGURE SIZES (multiplied by the station's own plan scale) ------------
   0.50 on the sill is the size S01, S03 and S04 all give this body on this
   station, so the man in the doorway is the same man at the same distance in
   four consecutive shots; it carries with him up the lane. The three others sit
   at 0.43–0.44, which is the near-band size S04 arrived at after draft 1 put a
   near figure at 0.50 and its hair mass closed the gap to the drawn stair. At
   0.43 on `bench_r1` Telemachus prints ~0.17 of the frame wide (x .666–.834)
   and stops just short of the stair — the size and the station S04 settled on
   for Penelope. Melantho is one notch smaller again, 0.41, because draft 1 put
   her at 0.43 on `doorway_maid` and her akimbo elbow ran into the drawn stair;
   at 0.41 on `table_r` (x .631–.799) she clears the stair, and at the door she
   is only ever in the narrow mth_torch stance with the brand-arm straight up. */
const FIG_OD = 0.50, FIG_MTH = 0.41, FIG_EUR = 0.44, FIG_TEL = 0.43;

/* --- WHEN THINGS HAPPEN ------------------------------------------------- */
const MTH_OUT = 35;    // the maid is out of the picture (she reaches the door)
const TEL_IN  = 37;    // the son stands up to speak
const DUCK    = 34.5;  // the beggar sees it coming and goes down
const SEIZE   = 31;    // the stool is taken off the floor
const THROW   = 35.5;  // it leaves his hand, and the next thing the room shows
                       // of it is where it came down — the cut IS the throw

/* --- THE STOOL'S TWO BOXES ---------------------------------------------
   Solved from stool_x = boxLeft + P.cx*W, stool_y = boxBase - (1-P.cy)*H with
   the module's own POSE table (lift .50/.42/.288, rest .50/.522/.300). Both take
   the authored 660:880 aspect so the carpentry stands on the module's own floor
   line, and the two widths are picked so the stool prints the SAME size in both
   (its half-width is P.s * boxW): .238*.288 = .228*.300 ~ .0685. */
const ASPECT = 1120 / (0.75 * 760);          // 1.965 — the module's own aspect

const S_LIFT  = { w:0.238, h:0.238 * ASPECT, cx:0.50, cy:0.42  };
const S_LAND  = { w:0.228, h:0.228 * ASPECT, cx:0.50, cy:0.522 };
/* where the stool itself has to be, in frame coordinates (its top FRONT edge,
   which is the module's local origin) */
const AT_HAND = { x:0.345, y:0.640 };   // off the floor at Eurymachus's near hand
const AT_REST = { x:0.500, y:0.809 };   // down on the near flagstones, feet at .880
/* box placement solved from the above; boxes are anchored bottom-centre */
const boxFor = (S, at) => ({
  w:S.w, h:S.h,
  x: at.x + (0.5 - S.cx) * S.w,
  y: at.y + (1   - S.cy) * S.h,
});
const BOX_LIFT = boxFor(S_LIFT, AT_HAND);
const BOX_LAND = boxFor(S_LAND, AT_REST);

/* plates are keyed by hand so their light fields cannot stand as panels. */
function placePlate(offctx, W, H, mod, box, state, sig, thr = 0.895){
  const w = W * box.w, h = H * box.h;
  offctx.drawImage(keyedModuleCanvas(mod, w, h, state, sig, thr),
                   box.x * W - w / 2, box.y * H - h);
}

export const scene = {
  id:"OD-B18-S05",
  title:"Melantho and Eurymachus Attack",
  book:18,
  plan:"megaron",
  duration:D,
  beats:[
    "Penelope withdraws to her chamber and the disloyal maids set the braziers going to light the hall for the suitors.",
    "Melantho tells the beggar to clear out and sleep in a forge; he warns her the master may yet come home and the queen may hear of it.",
    "Eurymachus mocks his bald head, then offers him day-labour on a farm only to say he would rather beg than work.",
    "Odysseus answers with a challenge of work and war — set us both to mowing, or put us in the front rank, and see who tires — and Eurymachus throws a footstool at him and misses.",
    "Telemachus rebukes the suitors for handling a guest that way under his roof, and the night's disorder ends.",
  ],
  exitState:"The great hall late at night, doors still standing open, the fire high at the hearth and the benches and laden tables still shoved back against the walls from the fight in S01. Penelope has gone up her own stair to her chamber and is not in the room. The braziers the maids were set to tend are unattended: Melantho lit them, left them to insult the beggar, told him to go and sleep in a smith's forge, went to the suitors' table to be laughed with, and has flounced back out through the women's door with one look over her shoulder — she is out of the hall and she has not been punished. Odysseus is off the sill and two paces up the lane, standing at the light and holding it himself, still in the beggar's rags, bald and grey as Eurymachus said he was. He has been offered a day's wage for a day's work as an insult and has answered it with a challenge of mowing and of war. Eurymachus threw a footstool at his head from the near-left table and Odysseus ducked; the stool went over him and stands where it came down on the near flagstones, half the room from the table it was snatched off, and the man who threw it has turned away rather than look at the son of the house. Telemachus has come up off the right-hand bench and rebuked the suitors in front of all of them for letting a guest be handled that way under his roof; nobody has answered him back, and the night's disorder is over. Amphinomus is at his own bench on the left with the rest of the suitors. The hall is exactly as Book XIX will need it: the two doors, the sill, the stair, the arms still on the walls, and every man in it about to be sent home to bed.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"prop.thrown-footstool", instance:"stool_01",
      anchor:{x:BOX_LIFT.x,y:BOX_LIFT.y}, scale:S_LIFT.w, mode:"rest" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.37, band:"threeq", pose:"three_quarter_right" },
    { asset:"character.eurymachus", instance:"eurymachus",
      anchor:{x:.29,y:.81}, scale:.45, band:"threeq", pose:"skepticism" },
    { asset:"character.melantho", instance:"melantho",
      anchor:{x:.79,y:.67}, scale:.37, band:"threeq", pose:"mth_torch" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.75,y:.77}, scale:.42, band:"threeq", pose:"confrontation" },
  ],

  timeline:[
    // 1 the queen is gone and the maids are lighting the room
    { op:"actor.pose",  target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"odysseus",   at: 0.0, args:{ gaze:{ x:.30, y:.10 } } },
    { op:"actor.pose",  target:"melantho",   at: 0.0, args:{ pose:"mth_torch" } },
    { op:"actor.gaze",  target:"melantho",   at: 0.0, args:{ gaze:{ x:-.34, y:.20 } } },
    { op:"actor.pose",  target:"eurymachus", at: 0.0, args:{ pose:"skepticism" } },
    { op:"actor.gaze",  target:"eurymachus", at: 0.0, args:{ gaze:{ x:.30, y:-.04 } } },
    // 2 she abandons the braziers, comes down to the table, and starts on him
    { op:"actor.pose",  target:"melantho",   at: 8.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze",  target:"melantho",   at: 8.0, args:{ gaze:{ x:-.20, y:.16 } } },
    { op:"actor.pose",  target:"melantho",   at:14.0, args:{ pose:"mth_contempt" } },
    { op:"actor.gaze",  target:"melantho",   at:14.0, args:{ gaze:{ x:-.42, y:.22 } } },
    { op:"actor.pose",  target:"odysseus",   at:15.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"odysseus",   at:15.0, args:{ gaze:{ x:.40, y:.14 } } },
    { op:"actor.pose",  target:"melantho",   at:18.0, args:{ pose:"mth_jeer" } },
    { op:"actor.gaze",  target:"melantho",   at:18.0, args:{ gaze:{ x:-.48, y:.24 } } },
    { op:"actor.pose",  target:"odysseus",   at:19.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",   at:19.0, args:{ gaze:{ x:.46, y:.06 } } },
    // 3 the mock, the offer of day-labour, and the maid's other face
    { op:"actor.pose",  target:"eurymachus", at:22.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"eurymachus", at:22.0, args:{ gaze:{ x:.44, y:-.06 } } },
    { op:"actor.pose",  target:"melantho",   at:23.0, args:{ pose:"mth_intimacy" } },
    { op:"actor.gaze",  target:"melantho",   at:23.0, args:{ gaze:{ x:.34, y:-.30 } } },
    { op:"actor.pose",  target:"odysseus",   at:24.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"odysseus",   at:24.0, args:{ gaze:{ x:-.34, y:.10 } } },
    { op:"actor.pose",  target:"eurymachus", at:26.0, args:{ pose:"offering_hand" } },
    { op:"actor.pose",  target:"melantho",   at:27.0, args:{ pose:"mth_laugh" } },
    { op:"actor.gaze",  target:"melantho",   at:27.0, args:{ gaze:{ x:.08, y:-.10 } } },
    // 4 the challenge, the stool, the duck
    { op:"actor.pose",  target:"odysseus",   at:29.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at:29.0, args:{ gaze:{ x:-.40, y:.04 } } },
    { op:"actor.pose",  target:"melantho",   at:30.0, args:{ pose:"mth_dismiss" } },
    { op:"actor.gaze",  target:"melantho",   at:30.0, args:{ gaze:{ x:-.48, y:.22 } } },
    { op:"prop.state",  target:"stool_01",   at:SEIZE,args:{ mode:"lift" } },
    { op:"actor.pose",  target:"eurymachus", at:SEIZE,args:{ pose:"reach_forward" } },
    { op:"actor.pose",  target:"odysseus",   at:DUCK, args:{ pose:"crouch" } },
    { op:"actor.gaze",  target:"odysseus",   at:DUCK, args:{ gaze:{ x:-.30, y:-.28 } } },
    { op:"actor.pose",  target:"eurymachus", at:THROW,args:{ pose:"confrontation" } },
    { op:"prop.state",  target:"stool_01",   at:THROW,args:{ mode:"evidence" } },
    // 5 the son ends it
    { op:"actor.pose",  target:"odysseus",   at:39.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"odysseus",   at:39.0, args:{ gaze:{ x:.36, y:.06 } } },
    { op:"actor.pose",  target:"eurymachus", at:39.0, args:{ pose:"skepticism" } },
    { op:"actor.pose",  target:"telemachus", at:TEL_IN, args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:TEL_IN, args:{ gaze:{ x:-.44, y:-.02 } } },
    { op:"actor.pose",  target:"telemachus", at:40.0, args:{ pose:"pointing_arm" } },
    { op:"actor.pose",  target:"eurymachus", at:43.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.pose",  target:"telemachus", at:45.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"telemachus", at:45.0, args:{ gaze:{ x:-.30, y:.04 } } },
    { op:"timeline.capture", target:"OD-B18-S05", at:47.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);

    const lighting  = t <  8;                 // the braziers are being set going
    const crossing  = t >=  8 && t < 14;      // she leaves the light to them
    const insulting = t >= 14 && t < 22;      // "go and sleep in a forge"
    const mocking   = t >= 22 && t < 29;      // the bald head, the day's wage
    const throwing  = t >= 29 && t < TEL_IN;  // the challenge, the stool, the duck
    const ended     = t >= TEL_IN;            // the rebuke
    const ducking   = t >= DUCK && t < 39.5;
    const missed    = t >= THROW;

    /* the field first — it paints the room, everything else keys onto it */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"feast", t:0.55, layers:HALL_LAYERS,
              progress:Math.min(.94, .2 + .7*(t/D)),
              status: ended ? "THE NIGHT ENDS" : missed ? "IT MISSED"
                    : throwing ? "MISRULE" : mocking ? "THE BALD HEAD"
                    : insulting ? "THE MAID" : crossing ? "THE LIGHT IS LEFT"
                    : "THEY LIGHT THE HALL" },
    });

    /* --- THE STOOL, drawn BEFORE the bodies so nothing crosses a face -----
       Two boxes, two states, solved off the module's own POSE table, and the cut
       between them at t=35.5 is the throw. Both are on the module's authored
       aspect so the carpentry stands on its own floor line: seized at
       Eurymachus's near hand, then down on the flagstones at the near centre,
       where no station and no fixture stands. */
    if (t >= SEIZE){
      const down = t >= THROW;
      placePlate(offctx, W, H, stool, down ? BOX_LAND : BOX_LIFT,
        { mode: down ? "rest" : "lift", t:0.5,
          status: down ? "IT MISSED" : "SEIZED",
          progress: Math.min(.96, .3 + .6*(t/D)) },
        `st|${down ? "dn" : "lf"}`);
    }

    /* --- the painted bodies, ordered by the resolved footline ------------- */
    const draws = [];

    /* ODYSSEUS — one body, guise held flat at "beggar". He starts on the sill,
       steps up the lane to the light, takes the maid's insult with his arms
       folded, warns her, answers the offer of day-labour with a challenge, and
       ducks. He is the only body on the spine. */
    {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_OD * p.scale,
          state:{
            t:0.45, guise:"beggar", band:"threeq",
            pose: s.pose || "three_quarter_right",
            gaze: s.gaze || { x:.30, y:.10 },
            browUp:   ducking ? .46 : insulting ? .22 : .14,
            browKnit: throwing ? .48 : insulting ? .40 : mocking ? .34 : .16,
            eyeNarrow:mocking ? .40 : ended ? .30 : .22,
            eyeWide:  ducking ? .34 : 0,
            frown:    insulting ? .24 : throwing && !ducking ? .30 : 0,
            jaw:      throwing && !ducking ? .34 : 0,
            smile:    ended ? .20 : 0,
            mouthAsym:ended ? .40 : mocking ? .26 : .12,
            status:   ended ? "HE HOLDS THE LIGHT" : missed ? "IT MISSED"
                    : ducking ? "HE DUCKS" : throwing ? "SET US BOTH TO WORK"
                    : mocking ? "A DAY'S WAGE" : insulting ? "THE MASTER MAY COME"
                    : "THE BEGGAR",
            progress: Math.min(.96, .16 + .76*(t/D)),
          },
        });
      }});
    }

    /* EURYMACHUS — near left, one station, and every piece of the attack comes
       off it: banked contempt, the mock, the offer, the throw, and then a man
       who will not look at the son of the house. */
    {
      const p = blk.eurymachus;
      const s = st.eurymachus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, eurymachus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_EUR * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "skepticism",
            gaze: s.gaze || { x:.30, y:-.04 },
            smile:    mocking ? .46 : ended ? .06 : .18,
            mouthAsym:ended ? .30 : .72,
            browUp:   mocking ? .56 : ended ? .22 : .40,
            browKnit: throwing ? .52 : ended ? .40 : .22,
            eyeNarrow:ended ? .44 : throwing ? .34 : .28,
            jaw:      mocking ? .38 : throwing ? .30 : 0,
            frown:    ended ? .32 : 0,
            status:   ended ? "HE LOOKS AWAY" : missed ? "HE MISSED"
                    : throwing ? "THE STOOL" : mocking ? "A DAY'S WAGE"
                    : insulting ? "HE LETS HER" : "AT HIS TABLE",
            progress: Math.min(.96, .14 + .78*(t/D)),
          },
        });
      }});
    }

    /* MELANTHO — the brand-arm up at the women's door, then contempt, then the
       jeer, then the other face at the men's table, then out. Dropped from the
       drawing loop when she reaches the door: the right flank is Telemachus's
       from there on. */
    if (t < MTH_OUT){
      const p = blk.melantho;
      const s = st.melantho || {};
      const warm = t >= 23 && t < 30;
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, melantho, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_MTH * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "mth_torch",
            gaze: s.gaze || { x:-.34, y:.20 },
            /* no `mouth` field: her sneer lives in the pose's own mouthAsym and
               a mouth overlay here would flatten it (the asset says so). */
            browUp:   warm ? .42 : lighting ? .10 : .06,
            browKnit: warm ? .04 : insulting ? .46 : .24,
            eyeNarrow:warm ? .08 : .12,
            status:   t >= 30 ? "SHE LEAVES" : t >= 27 ? "LAUGHING"
                    : warm ? "FAVOURED" : insulting ? "SCORNFUL"
                    : lighting ? "TENDING" : "SHE CROSSES",
            progress: Math.min(.96, .12 + .80*(t/D)),
          },
        });
      }});
    }

    /* TELEMACHUS — not painted until he stands up to speak, into the flank the
       maid has just left. The rebuke crosses the whole width of the room, which
       is what `pointing_arm` is for: it throws the arm and the gaze to screen
       LEFT, and Eurymachus is at x .285. */
    if (t >= TEL_IN){
      const p = blk.telemachus;
      const s = st.telemachus || {};
      const closing = t >= 45;
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, telemachus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_TEL * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "confrontation",
            gaze: s.gaze || { x:-.44, y:-.02 },
            /* MIRRORED. He stands on the RIGHT flank and the man he is
               rebuking is on the LEFT, and every directed pose in the rig
               throws the RIGHT arm to screen right — draft 2 sent his pointing
               arm into the drawn stair behind him. mirrorNumeric() swaps the
               arm pairs, so the arm and the gaze both go across the hall. */
            mirror:true,
            mouth:   closing ? -.10 : -.40,
            browUp:  closing ? .18 : .26,
            browKnit:closing ? .30 : .52,
            frown:   closing ? .18 : .38,
            eyeNarrow:closing ? .30 : .18,
            jaw:     closing ? 0 : .34,
            status:  closing ? "IT ENDS HERE" : "UNDER MY ROOF",
            progress: Math.min(.96, .18 + .76*(t/D)),
          },
        });
      }});
    }

    draws.sort((a, b) => a.y - b.y).forEach(d => d.run());
  },
};
export default scene;

/* named binding so the next scene of the book can
   `import { exitOccupancy as INITIAL }` — the scene-object property alone
   cannot be linked.

   NOTE FOR THE NEXT SCENE (Book XIX opens in this room). These are MEGARON
   stations and can be imported straight. Five bodies are in it: Odysseus up the
   lane at `axe_first` (off the sill for the first time in three scenes),
   Telemachus on `bench_r1`, Eurymachus on `table_l`, Amphinomus on `bench_l2`,
   Penelope at the head of her own stair on `stair_up`. Melantho is at
   `doorway_maid`, i.e. in the women's doorway on her way out — if the next
   scene is the one where the maids are sent to their quarters, she is already
   standing in the right place for it. The thrown footstool is standing on the near
   flagstones in front of the beggar and belongs to the house; nothing carries
   it away. */
export const exitOccupancy = scene.exitOccupancy;
