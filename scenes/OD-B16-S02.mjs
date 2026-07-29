/* ============================================================
   SCENE  OD-B16-S02 — Eumaeus Carries News to Penelope
   Book XVI, scene 2. ADDITIVE: adds nothing to Books I–XV and modifies no
   existing module. Shaped after the reference scene OD-B16-S03.

   THIS SCENE'S JOB IS TO EMPTY THE ROOM.
   The plan says so itself — scenes/_plans/eumaeus-hut.mjs: "One door.
   Telemachus enters through it in S01; Eumaeus leaves through it in S02, which
   is what empties the room for the reveal in S03." So the whole scene is one
   subtraction. Telemachus sends the herdsman down to town to tell his mother
   he is alive; Eumaeus goes out the one door and the dogs go out at his heel;
   and what is left is a father and a son who do not yet know they are alone
   together. Every later beat of Book XVI is paid for here.

   HOW THE EMPTYING IS ENFORCED, NOT ASSERTED.
     · `yard` is the plan's one station outside the room. A figure whose last
       station is `yard` has left, and exitOccupancy is computed and then
       filtered by that rule — so the handoff cannot claim someone is present
       who walked out. The exported occupancy contains exactly two names.
     · A body is drawn only while it is still in the room. Eumaeus is dropped
       once he is past the threshold and on the road; the pack is dropped by a
       measured test (see below), not by a hand-picked frame.

   INHERITED POSITIONS. INITIAL is imported from OD-B16-S01's computed
   exitOccupancy — nobody is re-placed by hand, so this scene opens on exactly
   the frame the last one closed on: the prince on the guest stool, the
   swineherd at his fire, the beggar in the dark corner, the dogs on the floor.

   ATHENA. The atlas gives her this scene and gives the next one the crossing.
   She appears in the yard, outside the one door, visible to Odysseus and to no
   one else — the signal, not yet the exit. Odysseus rises and turns to her but
   stays inside: OD-B16-S03 opens with him at his station and takes him out at
   its own t=2. The seam between the two scenes is a look, not a cut.

   NO HAND-PLACED ANCHORS; DEPTH ORDER IS COMPUTED — as in S01.
   NO CONTACT PAIR is needed: nothing in this scene touches. The two men speak
   across the hearth, and the parting is at the door.

   Beats (Od. 16.130–166):
     1. Telemachus has heard the stranger's Cretan story and asks Eumaeus to
        carry word to Penelope, privately, that her son is home.
     2. Eumaeus takes up his staff and goes out for the town road.
     3. The dogs go out at his heel and the room is left to two men.
     4. Athena stands in the yard, seen by Odysseus alone, and gives the sign.

   Verify:  node harness/render-scene.mjs scenes/OD-B16-S02.mjs --t 10
            node harness/render-scene.mjs scenes/OD-B16-S02.mjs --t 38
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { eumaeusHut } from "./_plans/eumaeus-hut.mjs";
import { stateAt } from "./_scene-contract.mjs";
import { exitOccupancy as S01_EXIT } from "./OD-B16-S01.mjs";

import field      from "../assets/location/eumaeus-hut-interior.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import athena     from "../assets/character/athena.mjs";
import dogs       from "../assets/creature/friendly-farm-dogs.mjs";

const FIELD_ASSET = "location.eumaeus-hut-interior";   // agrees with _plans/eumaeus-hut.mjs
const D = 44;

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   INITIAL is S01's computed exit, plus the one body S01 did not contain:
   Athena, who is outside in the yard from the first frame and simply is not
   seen until she chooses to be. She never occupies a station in the room. */
const INITIAL = { ...S01_EXIT, athena:"yard" };

const MOVES = [
  // 2 — the errand. Out of the room by the one door, then the town road.
  { who:"eumaeus",    from:"hearth",      to:"door",       t0:14, t1:20 },
  { who:"eumaeus",    from:"door",        to:"yard",       t0:20, t1:25 },
  // 3 — the pack follows the herdsman out; the floor is cleared with him
  { who:"dogs",       from:"centre",      to:"yard",       t0:18, t1:24 },
  // the son settles on the far bench to wait — where OD-B16-S03 opens him
  { who:"telemachus", from:"seat_guest",  to:"bench_far",  t0:28, t1:34 },
  // and only once the herdsman is gone does the beggar come nearer the fire.
  // Still off-centre, still the low bench: he is not the subject of any frame.
  { who:"odysseus",   from:"corner_dark", to:"bench_near", t0:30, t1:36 },
];

/* the room is what is INSIDE. `yard` is the one station beyond the door, so a
   figure resolved there has left — this is the rule the handoff is filtered by
   and the rule the drawing loop uses, so prose and picture cannot disagree. */
const OUTSIDE = new Set(["yard"]);

/* the same rule, applied to the picture: a body still crossing is still in
   frame (station is null while a move runs), a body that has LANDED outside is
   gone. Nothing is hidden on a hand-picked frame. */
const inRoom = p => p.station == null || !OUTSIDE.has(p.station);

const OCC = occupancyAt(eumaeusHut, MOVES, D, INITIAL);

const PACK_TAPER = 1.30;      // see the dogs' note in stage(): size capped by depth
const ATHENA_IN = 34;         // the sign — the last beat, held to the end
const EUMAEUS_GONE = 25;      // the beat: the door is empty, the two men are alone

export const scene = {
  id:"OD-B16-S02",
  title:"Eumaeus Carries News to Penelope",
  book:16,
  plan:"eumaeus-hut",
  duration:D,
  beats:[
    "Telemachus, having heard the stranger's Cretan story, asks Eumaeus to go down to town and tell Penelope privately that her son is home.",
    "Eumaeus takes up his staff and goes out through the one door for the farm-to-palace road.",
    "The dogs go out at his heel; the hut is left to two men and a fire.",
    "Athena stands in the yard beyond the door, seen by Odysseus and by no one else, and gives the sign that the recognition may begin.",
  ],
  exitState:"Eumaeus is on the road to the palace with the news; the dogs went out with him. The hut holds only Telemachus, on the far bench, and the beggar, moved up to the near bench — father and son alone and unknown to each other. Athena waits in the yard with the sign given; the crossing of the threshold is the first beat of OD-B16-S03.",
  /* computed, then filtered by the OUTSIDE rule: whoever ended in the yard is
     not in the room. What remains is exactly the two men. */
  exitOccupancy:Object.fromEntries(
    Object.entries(OCC).filter(([, station]) => !OUTSIDE.has(station))
  ),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0 },
    { asset:"character.athena", instance:"athena",
      anchor:{x:.50,y:.53}, scale:.56, band:"threeq", pose:"athena_command" },
    { asset:"creature.friendly-farm-dogs", instance:"dogs",
      anchor:{x:.50,y:.77}, scale:.62, pose:"settle" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.44,y:.73}, scale:.55, band:"threeq", pose:"eum_listen" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.63,y:.80}, scale:.54, band:"threeq", pose:"lean_forward" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.23,y:.75}, scale:.56, band:"threeq", pose:"head_lowered" },
  ],

  timeline:[
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"lean_forward" } },
    { op:"actor.pose", target:"eumaeus",    at: 0.0, args:{ pose:"eum_listen" } },
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"head_lowered" } },
    { op:"actor.pose", target:"dogs",       at: 0.0, args:{ pose:"settle" } },
    // open_palm, not pointing_arm: the rig's point throws the near arm out to
    // frame right, away from the man being addressed, who is at the hearth.
    { op:"actor.pose", target:"telemachus", at: 6.0, args:{ pose:"open_palm" } },
    { op:"actor.gaze", target:"telemachus", at: 6.0, args:{ gaze:{x:-.24,y:.06} } },
    { op:"actor.pose", target:"eumaeus",    at:10.0, args:{ pose:"repeated_nod" } },
    { op:"actor.pose", target:"eumaeus",    at:14.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"dogs",       at:16.0, args:{ pose:"recognise" } },
    { op:"actor.pose", target:"telemachus", at:18.0, args:{ pose:"torso_open" } },
    { op:"actor.pose", target:"dogs",       at:18.0, args:{ pose:"circle" } },
    { op:"actor.pose", target:"eumaeus",    at:20.0, args:{ pose:"step_away" } },
    { op:"actor.pose", target:"odysseus",   at:26.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose", target:"telemachus", at:28.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"odysseus",   at:30.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"telemachus", at:34.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:34.0, args:{ gaze:{x:.10,y:.18} } },
    { op:"actor.pose", target:"athena",     at:ATHENA_IN, args:{ pose:"athena_command" } },
    { op:"actor.pose", target:"odysseus",   at:36.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus",   at:36.0, args:{ gaze:{x:.30,y:-.24} } },
    { op:"timeline.capture", target:"OD-B16-S02", at:43.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(eumaeusHut, MOVES, t, INITIAL);
    const prog = p => Math.min(.96, p + .74*(t/D));

    // the field first — the door stands open all scene; it is still day
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"day", t:0.5, progress:Math.min(.94,.20+.72*(t/D)), status:"THE HUT" },
    });

    /* queued with plan depth, drawn far -> near */
    const q = [];
    const at = (who, draw) => q.push({ d: blk[who].d, draw });

    /* --- ATHENA: outside, and only Odysseus sees her ----------------------
       The one body the inRoom rule does not govern: she stands at `yard` for
       the whole scene because being outside the door is the point. She is
       drawn from the moment she chooses to be seen, and by the OUTSIDE rule
       she never appears in the room's occupancy. */
    if (t >= ATHENA_IN) at("athena", () => {
      const p = blk.athena;
      const s = st.athena || {};
      placeInstance(offctx, W, H, athena, {
        anchor:{ x:p.x, y:p.y }, scale:0.56 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "athena_command",
          gaze: s.gaze || { x:-.34, y:.26 },
          browUp:.30, eyeWide:.34,
          status:"THE SIGN", progress:prog(.20),
        },
      });
    });

    /* --- EUMAEUS: the errand, and the exit that empties the room -----------
       Drawn while he is in the hut and while he is crossing the threshold;
       dropped the moment the blocking lands him outside. The subtraction is
       the plan's, not a chosen frame's. */
    if (inRoom(blk.eumaeus)) at("eumaeus", () => {
      const p = blk.eumaeus;
      const s = st.eumaeus || {};
      const told   = t >= 10;
      const going  = t >= 14;
      placeInstance(offctx, W, H, eumaeus, {
        anchor:{ x:p.x, y:p.y }, scale:0.55 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "eum_listen",
          gaze: s.gaze || (going ? { x:-.06, y:-.16 } : { x:.28, y:.04 }),
          smile:   told && !going ? .30 : .08,
          browUp:  told ? .34 : .44,
          browKnit:going ? .22 : .30,
          cheek:   told && !going ? .24 : .06,
          jaw:     t >= 10 && t < 14 ? .28 : 0,
          status:  going ? "TO THE TOWN" : told ? "I WILL GO" : "AT THE FIRE",
          progress:prog(.18),
        },
      });
    });

    /* --- THE DOGS: they leave with the herdsman ---------------------------
       The pack asset is three dogs on three ground lines inside its own box
       (far row at 0.47, near row at 0.77), so the box carries its own depth.
       As the pack recedes toward the door there is less and less floor left in
       front of the far wall to hold that depth, and a fixed size would stand
       the far row on the wall. The size is therefore capped by the distance —
       PACK_TAPER * d — which is the same law the room is drawn by, and the
       pack simply shrinks out through the door instead of popping. */
    if (inRoom(blk.dogs)) at("dogs", () => {
      const p = blk.dogs;
      const s = st.dogs || {};
      const S = Math.min(0.62, PACK_TAPER * p.d) * p.scale;
      const pose = s.pose || "settle";
      placeInstance(offctx, W, H, dogs, {
        anchor:{ x:p.x, y:p.y + 0.23*S }, scale:S,
        state:{
          t:(t*0.11) % 1, pose,
          status: pose === "settle" ? "SETTLED" : "AT HIS HEEL",
          progress: prog(.10),
        },
      });
    });

    /* --- TELEMACHUS: he gives the order, then waits ----------------------- */
    at("telemachus", () => {
      const p = blk.telemachus;
      const s = st.telemachus || {};
      const ordering = t >= 6 && t < 18;
      const alone    = t >= EUMAEUS_GONE;
      placeInstance(offctx, W, H, telemachus, {
        anchor:{ x:p.x, y:p.y }, scale:0.54 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "lean_forward",
          gaze: s.gaze || { x:-.28, y:.06 },
          browKnit: ordering ? .38 : .18,
          browUp:   alone ? .26 : .20,
          eyeNarrow:ordering ? .26 : .08,
          eyeWide:  alone ? .18 : .10,
          frown:    ordering ? .18 : 0,
          jaw:      ordering ? .30 : 0,
          status:   alone ? "WAITING" : ordering ? "TELL MY MOTHER" : "LISTENING",
          progress: prog(.14),
        },
      });
    });

    /* --- ODYSSEUS: silent, low, and the only one who sees the goddess ------
       guise:"beggar" for the whole scene — the restoration belongs to S03. */
    at("odysseus", () => {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      const alone  = t >= EUMAEUS_GONE;
      const sees   = t >= ATHENA_IN;
      placeInstance(offctx, W, H, odysseus, {
        anchor:{ x:p.x, y:p.y }, scale:0.56 * p.scale,
        state:{
          t:0.5, guise:"beggar", band:"threeq",
          pose: s.pose || "head_lowered",
          gaze: s.gaze || { x:.22, y:.10 },
          browUp:    sees ? .42 : .14,
          browKnit:  sees ? .10 : .34,
          eyeNarrow: sees ? 0 : .36,
          eyeWide:   sees ? .34 : 0,
          frown:     alone && !sees ? .12 : 0,
          status:    sees ? "SHE IS THERE" : alone ? "ALONE WITH HIM" : "THE BEGGAR",
          progress:  prog(.16),
        },
      });
    });

    q.sort((a,b) => a.d - b.d).forEach(o => o.draw());
  },
};
export const exitOccupancy = scene.exitOccupancy;
export default scene;
