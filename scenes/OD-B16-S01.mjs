/* ============================================================
   SCENE  OD-B16-S01 — The Son Reaches the Hut
   Book XVI, scene 1. ADDITIVE: adds nothing to Books I–XV and modifies no
   existing module. Shaped after the reference scene OD-B16-S03.

   THE SCENE IS DRAMATIC IRONY, AND THE IRONY IS BLOCKING.
   Three men are in this room and only two of them know who is in it. The
   composition must not tell the audience what the dialogue withholds, so:
     · Telemachus takes the honoured line — door -> centre_l -> seat_guest.
     · Eumaeus, the host, comes in off his pens, meets him on the contact pair
       at centre_r, then falls back to his fire.
     · Odysseus — character.odysseus-b16 with guise:"beggar" — never holds
       centre. He begins on the low stool at seat_guest, rises the moment the
       young master appears, hands the stool over and takes himself off to
       corner_dark, where he stays: the smallest, dimmest, most peripheral body
       in the room. The audience is looking at the father and being shown a
       beggar. That is the whole scene.

   THE DOGS ARE THE TELL. creature.friendly-farm-dogs are the SAME animals that
   put Odysseus on the ground in Book XIV. Here they do not bark: the pack runs
   recognise -> wag -> circle -> settle and never touches the `threat` preset.
   The absence of the bark is the first proof of who is at the door, and it is
   carried entirely by the creature rig's behaviour channels, so the pack holds
   one station and performs from it instead of walking.

   NO HAND-PLACED ANCHORS. Every position resolves through
   scenes/_plans/eumaeus-hut.mjs via blockingAt(). The anchors in cast[] are
   contract placeholders; stage() overrides all of them.

   ONE BODY. The atlas line for this scene names `character.odysseus-as-beggar`.
   In Book XVI+ that is not a separate module: it is character.odysseus-b16
   carrying guise:"beggar". Nothing here ever cuts between beggar and king.

   CONTACT PAIR. The kiss is a touch, so it uses the plan's pair — Telemachus
   at centre_l, Eumaeus at centre_r — and never resolves both men to one point.

   DEPTH ORDER IS COMPUTED. Four bodies move through a small room, so stage()
   sorts every placement by the plan depth d and draws far -> near. Overlaps
   then read as depth instead of collision, at every t, without hand-ordering.

   STRUCTURED HANDOFF. exitOccupancy is computed from the plan at t = DURATION,
   never written by hand, and OD-B16-S02 imports it as its INITIAL.

   Beats (Od. 16.4-45):
     1. Telemachus comes up to the steading and the dogs fawn instead of barking.
     2. Eumaeus drops what he is holding and kisses him like a father.
     3. The strange beggar rises and gives up the guest stool.
     4. Telemachus takes the seat beside the unknown man and asks for news.

   Verify:  node harness/render-scene.mjs scenes/OD-B16-S01.mjs --t 8
            node harness/render-scene.mjs scenes/OD-B16-S01.mjs --t 38
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { eumaeusHut } from "./_plans/eumaeus-hut.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/eumaeus-hut-interior.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import dogs       from "../assets/creature/friendly-farm-dogs.mjs";

const FIELD_ASSET = "location.eumaeus-hut-interior";   // agrees with _plans/eumaeus-hut.mjs
const D = 42;

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   OPENING POSITIONS. This is the first scene of the book, so INITIAL is
   authored here (there is no previous exitOccupancy to inherit) and every
   later Book XVI hut scene descends from it.
     telemachus  yard        — coming up the path, framed by the one door
     eumaeus     pen_wall    — at the pig pen on the right, off the door axis
     odysseus    seat_guest  — the beggar was given the stool the night before
     dogs        centre      — the pack is loose on the hut floor, facing the door
   The pack sits at `centre` rather than at `dog_post` for a measured reason:
   the creature asset is a depth-staggered PACK, three dogs on three ground
   lines inside its own box, and at dog_post's distance (z .18) the far row of
   that box lands above the far wall's floor line — dogs standing on the wall.
   `centre` is the nearest station that fits the whole pack on the floor.
*/
const INITIAL = {
  telemachus:"yard", eumaeus:"pen_wall", odysseus:"seat_guest", dogs:"centre",
};

const MOVES = [
  // 1 — the approach. He crosses the yard and stands in the one door.
  { who:"telemachus", from:"yard",       to:"door",       t0: 4, t1:11 },
  // 3 — the beggar is on his feet before he is spoken to, and the stool is
  //     empty long before the prince reaches it. Low status is a rule here,
  //     not a beat: he goes to the dark corner and stays.
  { who:"odysseus",   from:"seat_guest", to:"corner_dark",t0:12, t1:17 },
  // 2 — the welcome, on the contact pair. Eumaeus comes down the right side,
  //     Telemachus straight down the door axis; the paths never cross.
  { who:"telemachus", from:"door",       to:"centre_l",   t0:13, t1:19 },
  { who:"eumaeus",    from:"pen_wall",   to:"centre_r",   t0:14, t1:20 },
  // he goes back to his fire to feed the boy — and clears the right side
  { who:"eumaeus",    from:"centre_r",   to:"hearth",     t0:26, t1:31 },
  // 4 — only now does the son take the seat his father gave up
  { who:"telemachus", from:"centre_l",   to:"seat_guest", t0:33, t1:38 },
];

/* the dogs' behaviour ramp — the switch, not a move */
const dogPose = t => t < 6 ? "recognise" : t < 12 ? "wag"
               : t < 22 ? "circle" : "settle";

export const scene = {
  id:"OD-B16-S01",
  title:"The Son Reaches the Hut",
  book:16,
  plan:"eumaeus-hut",
  duration:D,
  beats:[
    "Telemachus comes up to Eumaeus's steading; the dogs that floored the beggar fawn on him and do not bark.",
    "Eumaeus drops what he is holding and kisses him like a father receiving a son given up for dead.",
    "The strange beggar rises and gives up the guest stool to the young master.",
    "Telemachus takes the seat beside the unknown man and asks for news of the house.",
  ],
  exitState:"Telemachus is seated on the guest stool with Eumaeus back at his hearth; the beggar — his father, unrecognized — has withdrawn to the dark corner, and the dogs are settled on the hut floor. Three men in the room and one secret.",
  exitOccupancy:occupancyAt(eumaeusHut, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0 },
    { asset:"creature.friendly-farm-dogs", instance:"dogs",
      anchor:{x:.50,y:.77}, scale:.62, pose:"recognise" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.73,y:.63}, scale:.55, band:"threeq", pose:"eum_listen" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.50,y:.53}, scale:.54, band:"threeq", pose:"walk_neutral" },
    // the atlas line says `character.odysseus-as-beggar`; in Book XVI+ that is
    // this one module carrying guise:"beggar".
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.63,y:.80}, scale:.56, band:"threeq", pose:"three_quarter_left" },
  ],

  timeline:[
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"eumaeus",    at: 0.0, args:{ pose:"eum_listen" } },
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose", target:"dogs",       at: 0.0, args:{ pose:"recognise" } },
    { op:"actor.pose", target:"dogs",       at: 6.0, args:{ pose:"wag" } },
    { op:"actor.pose", target:"eumaeus",    at: 9.0, args:{ pose:"eum_welcome" } },
    { op:"actor.gaze", target:"eumaeus",    at: 9.0, args:{ gaze:{x:-.30,y:-.10} } },
    { op:"actor.pose", target:"odysseus",   at:12.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:12.0, args:{ gaze:{x:-.18,y:.04} } },
    { op:"actor.pose", target:"dogs",       at:12.0, args:{ pose:"circle" } },
    { op:"actor.pose", target:"telemachus", at:13.0, args:{ pose:"step_closer" } },
    { op:"actor.pose", target:"odysseus",   at:17.0, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus",   at:17.0, args:{ gaze:{x:.30,y:.28} } },
    { op:"actor.pose", target:"telemachus", at:19.0, args:{ pose:"torso_open" } },
    { op:"actor.pose", target:"eumaeus",    at:20.0, args:{ pose:"arms_open" } },
    { op:"actor.pose", target:"dogs",       at:22.0, args:{ pose:"settle" } },
    { op:"actor.pose", target:"eumaeus",    at:26.0, args:{ pose:"eum_speak" } },
    { op:"actor.pose", target:"telemachus", at:33.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"telemachus", at:38.0, args:{ pose:"lean_forward" } },
    { op:"actor.pose", target:"eumaeus",    at:38.0, args:{ pose:"eum_listen" } },
    { op:"timeline.capture", target:"OD-B16-S01", at:41.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(eumaeusHut, MOVES, t, INITIAL);
    const prog = p => Math.min(.96, p + .74*(t/D));

    // the field first — it paints the room; the door is open, it is morning
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"day", t:0.5, progress:Math.min(.94,.18+.72*(t/D)), status:"THE HUT" },
    });

    /* Everything else is queued with its plan depth and drawn far -> near, so
       a body upstage of another is occluded by it at every t. */
    const q = [];
    const at = (who, draw) => q.push({ d: blk[who].d, draw });

    /* --- THE DOGS: the switch, held at their station ----------------------
       The pack asset stands its nearest dog on a ground line at 0.77 of its
       own box, so the box is dropped by the remaining 0.23 to put paws on the
       plan's floor line instead of floating the pack above it. */
    at("dogs", () => {
      const p = blk.dogs;
      const s = st.dogs || {};
      // size capped by distance so the box's own far row always lands on the
      // floor and never on the far wall (the pack holds still here, so the cap
      // never bites; OD-B16-S02 walks the pack out of the door under it).
      const S = Math.min(0.62, 1.30 * p.d) * p.scale;
      const pose = s.pose || dogPose(t);
      placeInstance(offctx, W, H, dogs, {
        anchor:{ x:p.x, y:p.y + 0.23*S }, scale:S,
        state:{
          t:(t*0.11) % 1, pose,
          status: pose === "settle" ? "SETTLED" : pose === "circle" ? "CIRCLING" : "FAWNING",
          progress: prog(.10),
        },
      });
    });

    /* --- EUMAEUS: the host. Recognition, then relief, then his fire ------- */
    at("eumaeus", () => {
      const p = blk.eumaeus;
      const s = st.eumaeus || {};
      const seen    = t >= 9;
      const weeping = t >= 20 && t < 26;
      placeInstance(offctx, W, H, eumaeus, {
        anchor:{ x:p.x, y:p.y }, scale:0.55 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "eum_listen",
          gaze: s.gaze || { x:-.20, y:.06 },
          smile:    weeping ? .18 : seen ? .44 : .06,
          browUp:   weeping ? .62 : seen ? .34 : .16,
          browKnit: weeping ? .48 : .08,
          frown:    weeping ? .34 : 0,
          cheek:    seen && !weeping ? .30 : .08,
          jaw:      t >= 26 && t < 38 ? .40 : 0,
          status:   weeping ? "WEEPING" : seen ? "HIS BOY" : "AT THE PENS",
          progress: prog(.16),
        },
      });
    });

    /* --- TELEMACHUS: arrival, welcome, the guest seat --------------------- */
    at("telemachus", () => {
      const p = blk.telemachus;
      const s = st.telemachus || {};
      const inside = t >= 11;
      const held   = t >= 20 && t < 27;
      const seated = t >= 38;
      placeInstance(offctx, W, H, telemachus, {
        anchor:{ x:p.x, y:p.y }, scale:0.54 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "walk_neutral",
          gaze: s.gaze || (inside ? { x:.24, y:.04 } : { x:.04, y:.12 }),
          smile:   held ? .38 : inside ? .22 : .06,
          browUp:  held ? .40 : .22,
          browKnit:seated ? .30 : .06,
          eyeWide: inside && !seated ? .22 : .10,
          status:  seated ? "WHAT NEWS" : held ? "HOME" : inside ? "THE YOUNG MASTER" : "COMING UP",
          progress: prog(.12),
        },
      });
    });

    /* --- ODYSSEUS: present, low, unrecognized -----------------------------
       guise:"beggar" throughout — there is no reveal in this scene. */
    at("odysseus", () => {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      const rising    = t >= 12 && t < 17;
      const withdrawn = t >= 17;
      placeInstance(offctx, W, H, odysseus, {
        anchor:{ x:p.x, y:p.y }, scale:0.56 * p.scale,
        state:{
          t:0.5, guise:"beggar", band:"threeq",
          pose: s.pose || "three_quarter_left",
          gaze: s.gaze || { x:.26, y:.02 },
          browUp:    rising ? .30 : .12,
          browKnit:  withdrawn ? .34 : .22,
          eyeNarrow: withdrawn ? .38 : .28,
          smile:     rising ? .10 : 0,
          frown:     withdrawn ? .16 : 0,
          status:    withdrawn ? "THE BEGGAR" : rising ? "TAKE MY SEAT" : "WATCHING",
          progress:  prog(.14),
        },
      });
    });

    q.sort((a,b) => a.d - b.d).forEach(o => o.draw());
  },
};
export const exitOccupancy = scene.exitOccupancy;
export default scene;
