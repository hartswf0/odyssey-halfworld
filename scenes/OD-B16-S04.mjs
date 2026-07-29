/* ============================================================
   SCENE  OD-B16-S04 — The Plan against the Suitors
   Book XVI, scene 4 of 6. ADDITIVE: creates nothing, modifies nothing;
   it only COMPOSES assets that already exist.

   Shape copied from the reference scene, scenes/OD-B16-S03.mjs:
     · no hand-placed anchors — every position resolves through
       scenes/_plans/megaron.mjs via blockingAt()
     · ONE body for Odysseus — character.odysseus-b16 with guise:"restored",
       carried forward from the reveal in S03 (never a cut to .odysseus-restored)
     · structured handoff — exitOccupancy is computed, and S05 imports it

   ROOM. location.megaron-hall, state "day": the ordinary hall, arms still on
   the walls, fire low, benches in order — the room BEFORE the misrule of the
   feast, and the room this whole conversation is about. It is the one hall
   asset with a state channel; no second hall is built or cast.

   THE HANDOFF ACROSS A ROOM CHANGE. S03 ends with father and son at the
   contact pair centre_l / centre_r of the HUT plan. Those station names do not
   exist in the megaron — blockingAt() would throw, which is the cross-room
   continuity check doing its job. So the incoming occupancy is not discarded,
   it is TRANSLATED: each hut station maps to the megaron station that plays
   the same role, and the map is applied to the imported occupancy rather than
   to a guess. Change where S03 leaves them and this scene moves with it.

   Beats (Od. 16.226–320):
     1. Odysseus tells how the Phaeacians set him ashore, and asks the count.
     2. Telemachus counts the factions off — a hundred and eight, and heralds.
     3. Odysseus names Zeus and Athena, and lays out the removal of the arms.
     4. Telemachus is to go back, endure the insults, and tell no one.
     5. Eumaeus is given the errand of bringing the beggar down later.

   Verify:  node harness/render-scene.mjs scenes/OD-B16-S04.mjs --t 10
            node harness/render-scene.mjs scenes/OD-B16-S04.mjs --t 36
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import forceMap   from "../assets/set_piece/suitor-count-plan.mjs";
import weapons    from "../assets/prop/palace-weapons.mjs";

/* the atlas asks for "set-piece.suitor-force-map"; the built asset that IS the
   counted force map is set_piece.suitor-count-plan — the top-down palace chart
   with the suitor grid, the loyalist muster and the locked weapons cache. */
const FIELD_ASSET = "location.megaron-hall";
const D = 48;

/* --- CONTINUITY IN, translated across the room change --------------------
   NOTE ON THE IMPORT FORM. The brief's form is
       import { exitOccupancy as INITIAL } from "./OD-B16-S03.mjs";
   but the reference scene publishes its computed occupancy as a PROPERTY of
   the scene object (OD-B16-S03.mjs line 83) and exports no binding by that
   name, and S03 is a tracked file this scene may not touch. So the same
   structured handoff is read off the default export. From S04 onward the
   binding is also exported at module top level (bottom of this file), so S05
   and S06 can use the named form exactly as written in the brief. */
import S03 from "./OD-B16-S03.mjs";
const PREV = S03.exitOccupancy;
const HUT_TO_HALL = {
  // the hut's contact pair becomes the hall's two near-camera places: the
  // master's end of the room, and the bench along the left wall
  centre_r:"axe_last",   centre_l:"bench_l2",  centre:"axe_last",
  seat_guest:"bench_r1", bench_far:"bench_r1", bench_near:"bench_l1",
  door:"door_main",      yard:"door_main",     corner_dark:"corner_dead",
  hearth:"axe_last",     dog_post:"postern",   pen_wall:"stair_up",
};
const carry = (who, fallback) => HUT_TO_HALL[PREV[who]] || fallback;
const INITIAL = {
  odysseus:   carry("odysseus",   "axe_last"),
  telemachus: carry("telemachus", "bench_l2"),
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   The two men walk the room they mean to take: Telemachus counts the suitors
   off at the tables where they sit, Odysseus crosses to the arms on the wall
   to show which ones come down, and the son ends on the sill he must walk back
   out through. No pair of them ever resolves to one station. */
const MOVES = [
  { who:"telemachus", from:"bench_l2",  to:"table_l",   t0: 9, t1:15 },
  { who:"odysseus",   from:"axe_last",  to:"table_r",   t0:19, t1:25 },
  { who:"telemachus", from:"table_l",   to:"pillar_l",  t0:26, t1:32 },
  { who:"telemachus", from:"pillar_l",  to:"threshold", t0:38, t1:44 },
  // he draws back to the wall as his son goes out — and stays there, so no one
  // in S05 inherits a station he is still standing on.
  { who:"odysseus",   from:"table_r",   to:"bench_r2",  t0:43, t1:47 },
];

/* the chart and the arms are placed through the plan too — a set-piece is not
   allowed its own private geometry any more than a body is. */
const CHART_AT = "postern";     // the far-left wall, out of the walking lane
const ARMS_AT  = "doorway_maid"; // the weapon beam, high on the right wall
const CHART_IN = 6, CHART_OUT = 27;   // the count is up only while it is spoken

export const scene = {
  id:"OD-B16-S04",
  title:"The Plan against the Suitors",
  book:16,
  plan:"megaron",
  duration:D,
  beats:[
    "Odysseus tells how the Phaeacians set him ashore asleep, and asks how many suitors there are.",
    "Telemachus counts the factions off — Dulichium, Same, Zacynthus, Ithaca — and says two men cannot fight so many.",
    "Odysseus names Zeus and Athena as allies enough, and lays out the removal of the arms from the hall.",
    "Telemachus must go back to the palace, endure the insults, and tell no one — not Penelope, not Laertes.",
    "Eumaeus is given the errand: he is to bring the beggar down to the town later.",
  ],
  exitState:"Father and son have agreed the plan in the hall: the arms come off the walls, Telemachus goes back among the suitors and says nothing, and Eumaeus will bring the beggar down later. Telemachus stands on the threshold ready to walk back to the town; Odysseus has drawn back to the bench under the weapon beam.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"day" },
    { asset:"set_piece.suitor-count-plan", instance:"forcemap_01",
      anchor:{x:.25,y:.60}, scale:.30 },
    { asset:"prop.palace-weapons", instance:"weapons_01",
      anchor:{x:.66,y:.69}, scale:.34 },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.83}, scale:.50, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.21,y:.84}, scale:.47, band:"threeq", pose:"lean_forward" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at: 0.0, args:{ gaze:{ x:.26, y:-.06 } } },
    { op:"actor.pose", target:"odysseus",   at: 6.0, args:{ pose:"torso_open" } },
    { op:"prop.state", target:"forcemap_01",at: 6.0, args:{ focus:"all" } },
    { op:"actor.pose", target:"telemachus", at:11.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"telemachus", at:11.0, args:{ gaze:{ x:-.40, y:.06 } } },
    { op:"actor.pose", target:"telemachus", at:18.0, args:{ pose:"desperation" } },
    { op:"actor.pose", target:"odysseus",   at:20.0, args:{ pose:"one_arm_raised" } },
    { op:"prop.state", target:"weapons_01", at:25.0, args:{ mode:"displayed", note:"marked for removal" } },
    { op:"actor.pose", target:"odysseus",   at:25.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:25.0, args:{ gaze:{ x:.34, y:-.14 } } },
    { op:"actor.pose", target:"telemachus", at:27.0, args:{ pose:"lean_forward" } },
    { op:"prop.state", target:"forcemap_01",at:CHART_OUT, args:{ hide:true } },
    { op:"actor.pose", target:"odysseus",   at:32.0, args:{ pose:"confrontation" } },
    { op:"actor.pose", target:"telemachus", at:34.0, args:{ pose:"head_lowered" } },
    { op:"actor.pose", target:"odysseus",   at:39.0, args:{ pose:"pointing_arm" } },
    { op:"actor.pose", target:"telemachus", at:40.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"telemachus", at:40.0, args:{ gaze:{ x:.10, y:-.10 } } },
    { op:"timeline.capture", target:"OD-B16-S04", at:46.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);
    const counting = t >= 9  && t < 27;      // the tally of the suitors
    const arming   = t >= 19 && t < 34;      // the arms are the subject
    const sending  = t >= 32;                // go back and say nothing

    /* the field first — it paints the room, everything else keys onto it */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"day", t:0.35, hearth:0.4,
              progress:Math.min(.94, .2 + .7*(t/D)), status:"THE HALL" },
    });

    /* --- THE FORCE MAP: the count, drawn where the count is spoken ------- */
    if (t >= CHART_IN && t < CHART_OUT){
      const p = megaron.at(CHART_AT, { kind:"prop" });
      placeInstance(offctx, W, H, forceMap, {
        anchor:{ x:p.x, y:p.y - 0.100 }, scale:0.32 * p.scale,
        state:{ focus: t < 18 ? "all" : "routes", t:0.6,
                status:"COUNTED", progress:Math.min(.9, (t - CHART_IN)/22) },
      });
    }

    /* --- THE ARMS on the beam: still hanging. The removal itself is Book
       XIX; here they are only the object of the plan. ---------------------- */
    {
      const p = megaron.at(ARMS_AT, { kind:"prop" });
      placeInstance(offctx, W, H, weapons, {
        anchor:{ x:p.x, y:p.y - 0.02 }, scale:0.30 * p.scale,
        state:{ mode:"displayed", t:0,
                status: arming ? "TO COME DOWN" : "RACKED",
                progress: arming ? .30 : .10 },
      });
    }

    /* --- ODYSSEUS: restored, and now purely tactical --------------------- */
    {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      placeInstance(offctx, W, H, odysseus, {
        anchor:{ x:p.x, y:p.y }, scale:0.50 * p.scale,
        state:{
          t:0.45, guise:"restored", band:"threeq",
          pose: s.pose || "three_quarter_left",
          gaze: s.gaze || { x:-.12, y:.02 },
          browKnit: sending ? .44 : .22,
          eyeNarrow: arming ? .34 : .22,
          smile: arming && !sending ? .26 : 0,
          mouthAsym: arming ? .48 : .20,
          jaw: (t >= 6 && t < 9) || (t >= 20 && t < 25) ? .38 : 0,
          status: sending ? "SAY NOTHING" : arming ? "THE ARMS COME DOWN" : "HOW MANY",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      });
    }

    /* --- TELEMACHUS: the count, the arithmetic of it, then obedience ----- */
    {
      const p = blk.telemachus;
      const s = st.telemachus || {};
      const doubting = t >= 18 && t < 27;
      placeInstance(offctx, W, H, telemachus, {
        anchor:{ x:p.x, y:p.y }, scale:0.47 * p.scale,
        state:{
          t:0.45, band:"threeq",
          pose: s.pose || "lean_forward",
          gaze: s.gaze || { x:.24, y:-.06 },
          eyeWide:  doubting ? .46 : .18,
          browUp:   doubting ? .50 : .26,
          browKnit: sending ? .40 : counting ? .30 : .10,
          frown:    doubting ? .34 : 0,
          jaw:      counting && !doubting ? .34 : 0,
          status:   sending ? "I WILL TELL NO ONE"
                  : doubting ? "TWO AGAINST SO MANY"
                  : counting ? "A HUNDRED AND EIGHT" : "LISTENING",
          progress: Math.min(.96, .14 + .78*(t/D)),
        },
      });
    }
  },
};
export default scene;
export const exitOccupancy = scene.exitOccupancy;
