/* ============================================================
   SCENE  OD-B17-S01 — Telemachus Returns to the Palace
   Book XVII, scene 1 of 7 — the first scene of the book. ADDITIVE: creates
   nothing, modifies nothing. Shape copied from the reference scene,
   scenes/OD-B16-S03.mjs.

   ROOM. The atlas asks for "location.palace-family-chamber". That is this room
   in its quiet state — location.megaron-hall, state "day": arms still on the
   wall racks, the fire low, the benches in order, the great doors ajar on the
   morning. Per rule D no second hall is built or cast; the "family chamber" is
   the megaron before the suitors come in for the day, and every position in it
   resolves through scenes/_plans/megaron.mjs. So the sill Telemachus crosses
   here is the sill he shoots from in XXI, the stair Penelope comes down is the
   stair she goes back up at the end of XVII, and the maids' doorway Eurycleia
   cries out of is the one the maids are dragged through in XXII.

   OFF-FRAME BEAT. Beat 1 happens on the hill, not in this room: at dawn
   Telemachus leaves the hut and tells Eumaeus to bring the beggar down to town
   later. Rather than cut two rooms into one stage, the scene OPENS on that
   order's consequence — the prince alone in the great doors at first light, the
   road behind him, the beggar deliberately NOT with him. Odysseus is therefore
   not cast at all: he is still at the farm, and the guise channel of
   character.odysseus-b16 is not touched by this scene.

   CONTACT PAIRS. Everyone who comes to him stops SHORT of his station:
   Telemachus holds `table_l`, Eurycleia runs out of `doorway_maid` as far as
   `bench_r1` and goes back, Penelope comes down `stair_up` to `axe_last`,
   Theoclymenus is walked from the sill to `table_r`. Four resting stations,
   four x positions across the frame (.29 / .50 / .72 / .79), no two bodies on
   one point.

   THREE THINGS THE ROOM ITSELF FORBIDS — each learned by rendering it and
   looking, not by reasoning about the plan:
     · THE HEARTH SITS ON THE SPINE. plan.ray(threshold→axe_last) runs straight
       through the fire, so a figure walking that line stands IN it and the
       flames come up between his legs. Every leg below is routed clear of the
       stone ring (plan x .395–.605, z .445–.595): the prince bends left, the
       seer bends right, the queen comes down inside z>.66.
     · A PILLAR BEHIND A FIGURE IS CAMOUFLAGE. `pillar_l`/`pillar_r` are the
       only lateral stations at mid depth, and a body standing at one is exactly
       the shaft's width: the column's two contours become his outline and the
       pillar base spreads under his feet like a plinth. `corner_dead` is worse
       — it sits in front of the left wall's shield rack and a figure there
       prints as one dark blob. The near band's benches and tables are
       horizontal and cost nothing, so the standing ground here is `table_l`,
       `axe_last`, `table_r`, `bench_r1`, `doorway_maid`.
     · THE QUEEN'S STAIR CROSSES THE RIGHT-HAND FURNITURE. The line from
       `stair_up` to `axe_last` passes over `bench_r1` and `table_r`, so nobody
       may be RESTING on either while she comes down. Eurycleia is therefore
       back in her doorway by t=25 and the seer does not reach `table_r` until
       t=36 — after she has crossed. Transits are allowed to overlap (a body
       walking behind another body is depth, and reads as depth); only resting
       positions are held clear.

   CONTINUITY IN. First scene of the book: there is no exitOccupancy upstream in
   Book XVII to import, and Book XVI ended in the hut, whose stations are not
   hall stations. So INITIAL is established here, from the plan, as four named
   megaron stations — the prince in the great doors, the seer on the road behind
   him, the nurse in the maids' doorway, the queen at the stair.

   CONTINUITY OUT. exitOccupancy is computed by occupancyAt(), never written by
   hand, and exported as a named binding so OD-B17-S02 can link it.

   Beats (Od. 17.1–166):
     1. At dawn Telemachus leaves the hut and orders Eumaeus to bring the beggar later.
     2. He reaches the palace; Eurycleia and Penelope embrace him in tears.
     3. He reports Nestor and Menelaus, withholding the plan and his father's return.
     4. Theoclymenus declares Odysseus already in Ithaca, preparing revenge.

   Verify:  node harness/render-scene.mjs scenes/OD-B17-S01.mjs --t 16
            node harness/render-scene.mjs scenes/OD-B17-S01.mjs --t 54
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field        from "../assets/location/megaron-hall.mjs";
import telemachus   from "../assets/character/telemachus.mjs";
import penelope     from "../assets/character/penelope.mjs";
import eurycleia    from "../assets/character/eurycleia.mjs";
import theoclymenus from "../assets/character/theoclymenus.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 62;

/* --- CONTINUITY IN. Stations, established from the plan. ------------------
   Prince and guest share `door_main` at t=0, which is legal because they are
   never both DRAWN there: Telemachus is off the doors by t=6, the seer is not
   staged until t=24. */
const INITIAL = {
  telemachus:   "door_main",     // in the great doors, come down from the farm
  theoclymenus: "door_main",     // his guest, still on the road behind him
  eurycleia:    "doorway_maid",  // the nurse, in the maids' door on the right wall
  penelope:     "stair_up",      // the queen, at the foot of her own stair
};

/* --- BLOCKING. Stations, not coordinates. -------------------------------- */
const MOVES = [
  // the prince: doors, sill, then a bend LEFT round the fire to his own table
  { who:"telemachus",   from:"door_main",    to:"threshold",   t0: 2, t1: 6 },
  { who:"telemachus",   from:"threshold",    to:"table_l",     t0: 7, t1:14 },
  // the nurse hears him, runs out of the passage as far as the bench, weeps,
  // and takes herself back to the door before the queen comes down
  { who:"eurycleia",    from:"doorway_maid", to:"bench_r1",    t0: 8, t1:14 },
  { who:"eurycleia",    from:"bench_r1",     to:"doorway_maid",t0:20, t1:25 },
  // the guest follows him in and holds the sill until he is given a place
  { who:"theoclymenus", from:"door_main",    to:"threshold",   t0:24, t1:28 },
  // the queen comes down her own stair and out onto the middle of her floor
  { who:"penelope",     from:"stair_up",     to:"axe_last",    t0:26, t1:34 },
  // and only then is the seer walked across to the right-hand table
  { who:"theoclymenus", from:"threshold",    to:"table_r",     t0:29, t1:36 },
];

export const scene = {
  id:"OD-B17-S01",
  title:"Telemachus Returns to the Palace",
  book:17,
  plan:"megaron",
  duration:D,
  beats:[
    "At dawn Telemachus leaves the hut and orders Eumaeus to bring the beggar later.",
    "He reaches the palace; Eurycleia and Penelope embrace him in tears.",
    "Telemachus reports what Nestor and Menelaus told him but withholds the plan and his father's return.",
    "Theoclymenus declares that Odysseus is already in Ithaca, preparing revenge.",
  ],
  exitState:"Morning in the hall, the suitors not yet in. Telemachus stands at the left-hand table having told his mother Pylos and Sparta and nothing else — the plan and his father are kept back. Penelope holds the middle of her own floor, half-persuaded and not daring to be. Eurycleia is back in the maids' doorway with the household's silence in her hands. Theoclymenus, given a place at the right-hand table, has declared aloud that Odysseus is already on Ithacan ground, sitting still and learning the suitors' ruin. The claim is now public in the house, the great doors are still ajar, and the beggar is on the road down from the farm.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ telemachus:"entrance:main", theoclymenus:"entrance:main",
              eurycleia:"doorway_maid",   penelope:"exit:stair" },
  exits:{ /* nobody leaves the room in this scene */ },
  walkable:"megaron zones.walkable + lane:spine, MINUS the hearth ring (the plan owns them)",
  sound:[
    { at: 0, source:"hearth",       cue:"low fire, banked all night, under everything" },
    { at: 2, source:"door_main",    cue:"the great doors pushed on their pivots" },
    { at: 9, source:"doorway_maid", cue:"the nurse's cry, and the maids behind her" },
    { at:27, source:"stair_up",     cue:"the queen's step coming down the stair" },
    { at:36, source:"table_l",      cue:"the prince's report, level and edited" },
    { at:52, source:"table_r",      cue:"the seer's declaration, thrown up at the roof" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"day" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:.79,y:.67}, scale:.40, band:"threeq", pose:"eury_clasp" },
    { asset:"character.theoclymenus", instance:"theoclymenus",
      anchor:{x:.72,y:.81}, scale:.42, band:"threeq", pose:"theo_alert" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.50,y:.83}, scale:.42, band:"threeq", pose:"penelope_grief" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.29,y:.81}, scale:.42, band:"threeq", pose:"walk_neutral" },
  ],

  timeline:[
    { op:"actor.pose", target:"telemachus",   at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"telemachus",   at: 0.0, args:{ gaze:{ x:.04, y:.06 } } },
    { op:"actor.pose", target:"eurycleia",    at: 0.0, args:{ pose:"eury_clasp" } },
    // the nurse sees him first, out of the passage
    { op:"actor.pose", target:"eurycleia",    at: 8.0, args:{ pose:"eury_alarm" } },
    { op:"actor.gaze", target:"eurycleia",    at: 8.0, args:{ gaze:{ x:-.44, y:.12 } } },
    { op:"actor.pose", target:"telemachus",   at:13.0, args:{ pose:"neutral_front" } },
    { op:"actor.gaze", target:"telemachus",   at:13.0, args:{ gaze:{ x:.30, y:-.02 } } },
    { op:"actor.pose", target:"eurycleia",    at:15.0, args:{ pose:"eury_weep" } },
    { op:"actor.gaze", target:"eurycleia",    at:15.0, args:{ gaze:{ x:-.40, y:.16 } } },
    { op:"actor.pose", target:"telemachus",   at:18.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"telemachus",   at:18.0, args:{ gaze:{ x:.34, y:.02 } } },
    // she takes herself back to the door; the guest comes in and holds the sill
    { op:"actor.pose", target:"eurycleia",    at:20.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"theoclymenus", at:24.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"eurycleia",    at:26.0, args:{ pose:"eury_clasp" } },
    { op:"actor.gaze", target:"eurycleia",    at:26.0, args:{ gaze:{ x:-.38, y:.08 } } },
    // the queen comes down her stair and out onto the floor
    { op:"actor.pose", target:"penelope",     at:26.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"penelope",     at:26.0, args:{ gaze:{ x:-.26, y:.06 } } },
    { op:"actor.pose", target:"telemachus",   at:30.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus",   at:30.0, args:{ gaze:{ x:.22, y:.10 } } },
    { op:"actor.pose", target:"penelope",     at:35.0, args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope",     at:35.0, args:{ gaze:{ x:-.34, y:-.04 } } },
    { op:"actor.pose", target:"theoclymenus", at:36.0, args:{ pose:"theo_alert" } },
    { op:"actor.gaze", target:"theoclymenus", at:36.0, args:{ gaze:{ x:-.30, y:.02 } } },
    // the report: Pylos and Sparta, and not one word more
    { op:"actor.pose", target:"telemachus",   at:36.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"telemachus",   at:36.0, args:{ gaze:{ x:.24, y:.16 } } },
    { op:"actor.pose", target:"penelope",     at:41.0, args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope",     at:41.0, args:{ gaze:{ x:-.30, y:.10 } } },
    { op:"actor.pose", target:"telemachus",   at:43.0, args:{ pose:"pointing_arm" } },
    { op:"actor.pose", target:"theoclymenus", at:44.0, args:{ pose:"theo_omen" } },
    { op:"actor.gaze", target:"theoclymenus", at:44.0, args:{ gaze:{ x:-.20, y:-.62 } } },
    // and the thing he will not say
    { op:"actor.pose", target:"telemachus",   at:49.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"telemachus",   at:49.0, args:{ gaze:{ x:.12, y:.26 } } },
    { op:"actor.pose", target:"eurycleia",    at:49.0, args:{ pose:"eury_hush" } },
    { op:"actor.gaze", target:"eurycleia",    at:49.0, args:{ gaze:{ x:-.36, y:.06 } } },
    // the seer says it for him
    { op:"actor.pose", target:"theoclymenus", at:52.0, args:{ pose:"theo_prophesy" } },
    { op:"actor.gaze", target:"theoclymenus", at:52.0, args:{ gaze:{ x:-.34, y:-.12 } } },
    { op:"actor.pose", target:"penelope",     at:52.0, args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"penelope",     at:52.0, args:{ gaze:{ x:.40, y:-.06 } } },
    { op:"actor.pose", target:"telemachus",   at:55.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus",   at:55.0, args:{ gaze:{ x:.40, y:.02 } } },
    { op:"actor.pose", target:"penelope",     at:58.0, args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope",     at:58.0, args:{ gaze:{ x:.34, y:.02 } } },
    { op:"timeline.capture", target:"OD-B17-S01", at:60.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);

    /* the field first — it paints the room, everything else keys onto it.
       ONE state for the whole scene: this is the hall before the day's misrule
       begins, so `day` (low fire, arms on the racks, benches in order, doors
       ajar on the morning) carries all four beats and keeps the frame light. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"day", t:0.42, progress:Math.min(.94, .2 + .7*(t/D)), status:"THE HALL" },
    });

    /* --- one queue, sorted by plan depth: the room decides who stands in
           front, not the order these blocks happen to be written in. ------- */
    const queue = [];
    const add = (d, draw) => queue.push({ d, draw });

    /* --- TELEMACHUS: up the spine, round the fire, to his own table ------- */
    {
      const p = blk.telemachus;
      const s = st.telemachus || {};
      const arriving  = t < 14;
      const greeted   = t >= 14 && t < 36;
      const reporting = t >= 36 && t < 49;
      const holding   = t >= 49 && t < 55;
      add(p.d, () => placeInstance(offctx, W, H, telemachus, {
        anchor:{ x:p.x, y:p.y }, scale:0.42 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "walk_neutral",
          gaze: s.gaze || { x:.04, y:.06 },
          browUp:   greeted ? .40 : holding ? .18 : .24,
          browKnit: holding ? .52 : reporting ? .26 : .12,
          eyeWide:  greeted ? .20 : 0,
          eyeNarrow:holding ? .30 : 0,
          smile:    greeted ? .18 : 0,
          frown:    holding ? .22 : 0,
          jaw:      reporting ? .34 : 0,
          status:   arriving  ? "HOME BY DAYBREAK"
                  : greeted   ? "HIS MOTHER'S ARMS"
                  : reporting ? "PYLOS AND SPARTA"
                  : holding   ? "SAYS NOTHING OF HIM"
                              : "LET THE SEER SPEAK",
          progress: Math.min(.96, .14 + .78*(t/D)),
        },
      }));
    }

    /* --- EURYCLEIA: out of the maids' door in tears, then back into it ---- */
    {
      const p = blk.eurycleia;
      const s = st.eurycleia || {};
      const crying  = t >= 8 && t < 20;
      const keeping = t >= 49;
      add(p.d, () => placeInstance(offctx, W, H, eurycleia, {
        anchor:{ x:p.x, y:p.y }, scale:0.40 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "eury_clasp",
          gaze: s.gaze || { x:-.30, y:.10 },
          browUp:   crying ? .70 : .42,
          browKnit: keeping ? .40 : crying ? .40 : .28,
          eyeWide:  t >= 8 && t < 15 ? .52 : 0,
          eyeNarrow:keeping ? .26 : 0,
          frown:    crying && t >= 15 ? .48 : 0,
          jaw:      t >= 8 && t < 15 ? .40 : 0,
          status:   keeping ? "THE HOUSE KEEPS IT"
                  : crying  ? "WEEPING OVER HIM"
                            : "THE FAITHFUL NURSE",
          progress: Math.min(.96, .22 + .70*(t/D)),
        },
      }));
    }

    /* --- PENELOPE: down the stair, across the floor, and not satisfied ---- */
    if (t >= 26){
      const p = blk.penelope;
      const s = st.penelope || {};
      const coming   = t < 35;
      const weeping  = t >= 35 && t < 41;
      const hearing  = t >= 41 && t < 52;
      const struck   = t >= 52;
      add(p.d, () => placeInstance(offctx, W, H, penelope, {
        anchor:{ x:p.x, y:p.y }, scale:0.42 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "penelope_grief",
          gaze: s.gaze || { x:-.30, y:.10 },
          browUp:   struck ? .62 : weeping ? .70 : .44,
          browKnit: hearing ? .44 : weeping ? .46 : .24,
          eyeWide:  struck ? .44 : 0,
          eyeNarrow:hearing ? .20 : 0,
          frown:    weeping ? .54 : hearing ? .28 : 0,
          jaw:      struck ? .30 : weeping ? .34 : 0,
          status:   coming  ? "THE QUEEN COMES DOWN"
                  : weeping ? "HER SON ALIVE"
                  : hearing ? "AND OF YOUR FATHER?"
                            : "IF THAT WORD WERE TRUE",
          progress: Math.min(.96, .30 + .64*(t/D)),
        },
      }));
    }

    /* --- THEOCLYMENUS: the guest at the sill who says the quiet part ------ */
    if (t >= 24){
      const p = blk.theoclymenus;
      const s = st.theoclymenus || {};
      const reading     = t >= 44 && t < 52;
      const prophesying = t >= 52;
      add(p.d, () => placeInstance(offctx, W, H, theoclymenus, {
        anchor:{ x:p.x, y:p.y }, scale:0.42 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "theo_alert",
          gaze: s.gaze || { x:-.28, y:.02 },
          browUp:   prophesying ? .58 : reading ? .54 : .34,
          browKnit: prophesying ? .34 : .24,
          eyeWide:  prophesying ? .50 : reading ? .46 : .18,
          jaw:      prophesying ? .40 : reading ? .24 : 0,
          status:   prophesying ? "HE IS ALREADY IN ITHACA"
                  : reading     ? "THE BIRD CAME ON THE RIGHT"
                                : "A GUEST, UNINTRODUCED",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* back → front, by the plan's own depth */
    queue.sort((a, b) => a.d - b.d).forEach(j => j.draw());
  },
};
export default scene;

/* named binding so OD-B17-S02 can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
