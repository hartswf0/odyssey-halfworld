/* ============================================================
   SCENE  OD-B16-S05 — The Ambush Fails and the Suitors Divide
   Book XVI, scene 5 of 6. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs.

   ROOM. The SAME hall as S04 — location.megaron-hall, state "feast": tables
   laden, benches shoved about, the fire high, litter on the floor. The atlas's
   "night-palace-hall" and its cousins are this room in another state; no second
   hall is built or cast.

   CONTINUITY. S04's exitOccupancy is imported by name and used directly — same
   plan, same station names, so nothing needs translating this time. The two men
   S04 left in the hall are NOT cast here (this is the suitors' scene), so their
   stations pass through untouched into this scene's exitOccupancy: the hall
   does not move the people who are not in it.

   THE CROWD. ensemble.suitor-council carries the room — one asset, five
   formations, a reaction WAVE and a faction channel. It is placed as a keyed
   cutout at a threshold BELOW its own paper level so its full-canvas field is
   flooded away and the megaron behind it survives; its "hall" and "floor"
   layers are switched off for the same reason — this room already has a floor.
   Antinous and Amphinomus stand at the head of their blocs, on the plan, in
   front of the ranks.

   Beats (Od. 16.322–451):
     1. Telemachus's ship makes the harbour ahead of the ambush.
     2. A herald says it publicly before Eumaeus can say it privately.
     3. The suitors gather in alarm; Antinous proposes killing him outside town.
     4. Amphinomus puts a condition on it: not before a sign from Zeus.
     5. Penelope comes down on Antinous; Eurymachus promises what he will not do.

   Verify:  node harness/render-scene.mjs scenes/OD-B16-S05.mjs --t 12
            node harness/render-scene.mjs scenes/OD-B16-S05.mjs --t 42
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import council     from "../assets/ensemble/suitor-council.mjs";
import antinous    from "../assets/character/antinous.mjs";
import amphinomus  from "../assets/character/amphinomus.mjs";
import penelope    from "../assets/character/penelope.mjs";
import eurymachus  from "../assets/character/eurymachus.mjs";

import { exitOccupancy as PREV } from "./OD-B16-S04.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 50;

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   The suitors are already in the room when it opens; PREV brings Odysseus and
   Telemachus forward from S04 without either of them being staged here. */
const INITIAL = {
  ...PREV,
  antinous:   "bench_r1",
  amphinomus: "bench_l1",
  eurymachus: "bench_l2",
  penelope:   "stair_up",
};
const MOVES = [
  // the news lands and the ringleader takes the floor
  { who:"antinous",   from:"bench_r1", to:"table_r",     t0:16, t1:22 },
  // the one decent man crosses to answer him across the cleared corridor
  { who:"amphinomus", from:"bench_l1", to:"table_l",     t0:24, t1:30 },
  // she has heard it all from the gallery, and comes down
  { who:"penelope",   from:"stair_up", to:"axe_last",    t0:32, t1:39 },
  // the smooth one slides forward with his promise
  { who:"eurymachus", from:"bench_l2", to:"corner_dead", t0:38, t1:45 },
];

/* WHERE THE CROWD STANDS. ensemble.suitor-council draws its members at a FIXED
   pixel height (84px back band .. 158px front band) and lays its rows between
   0.46 and seatY of whatever canvas it is given — so the box, not the member
   size, decides where the ranks land. The megaron's floor begins at the horizon
   y=0.50 and runs to the near edge, so the box is sized to drop the back rank
   at y≈0.58 and the front rank at y≈0.78: every member stands ON the floor,
   none of them float on the far wall, and the four named speakers work in front
   of them at near-camera stations. */
const SEAT_Y   = 0.82;
const CROWD_H  = 0.50;                     // back rank y≈.56, front rank y≈.74
const CROWD_W  = 0.80;                     // wider than tall — a hall, not a column
const CROWD_AT = { x:.50, y:.830 };
const CROWD_RANKS = [6, 5, 4];             // thinned from the asset's [7,6,5] so
const CROWD_DENSITY = 0.85;                // the ranks read as bodies, not a wall

/* the reaction wave: the herald's word crossing the ranks left to right */
const W0 = 8, W1 = 17;
const waveAt = t => clamp((t - W0) / (W1 - W0), 0, 1);

/* the ensemble's formation is a function of the clock, not a hand-drawn frame */
function councilAt(t){
  if (t < W0)  return { formation:"council", attention:.90, heat:.12, wave:0,          waveSpread:.16, density:1.0, status:"ASSEMBLED"   };
  if (t < W1)  return { formation:"council", attention:.70, heat:.35, wave:waveAt(t),  waveSpread:.16, density:1.0, status:"ALARMED"     };
  if (t < 22)  return { formation:"council", attention:.85, heat:.92, wave:1.4,        density:1.0,    status:"IN UPROAR" };
  if (t < 30)  return { formation:"split",   attention:.95, heat:.95, wave:1.4, gap:.13, factionBalance:.72, density:1.0, status:"FOR MURDER" };
  if (t < 38)  return { formation:"split",   attention:.85, heat:.45, wave:1.4, gap:.24, factionBalance:.30, density:1.0, status:"FOR THE OMEN" };
  return         { formation:"huddle",  attention:.75, heat:.25, wave:1.4, density:.85, status:"CONCEALING" };
}

/* THE CROWD CUTOUT. ensemble.suitor-council floods its own canvas with
   inkLevel(1) before it draws anybody. placeInstance keys at lum >= .895, which
   leaves that field standing as an opaque panel over the room. Keying at .85
   instead — just under the level-1 paper — floods it away from the border and
   lands only the ranks on the megaron's own floor. */
function placeCrowd(offctx, W, H, anchor, wf, hf, state){
  const w = W * wf, h = H * hf;
  const x = anchor.x * W - w / 2, y = anchor.y * H - h;
  const sig = `${state.formation}|${Math.round((state.wave ?? 0)*20)}|${Math.round((state.heat ?? 0)*20)}|${Math.round((state.gap ?? 0)*40)}`;
  offctx.drawImage(keyedModuleCanvas(council, w, h, state, sig, 0.85), x, y);
}

export const scene = {
  id:"OD-B16-S05",
  title:"The Ambush Fails and the Suitors Divide",
  book:16,
  plan:"megaron",
  duration:D,
  beats:[
    "Telemachus's ship comes into the harbour ahead of the vessel sent to intercept it.",
    "A herald announces the prince's return in the open, before Eumaeus can deliver the message privately.",
    "The suitors gather in alarm; Antinous proposes killing him in the fields, outside the town.",
    "Amphinomus puts a condition on the murder — not until they have asked the will of Zeus.",
    "Penelope comes down on Antinous for plotting against her son, and Eurymachus falsely promises protection.",
  ],
  exitState:"The council has split and then closed ranks: the murder is agreed in principle but suspended on an omen, Penelope has named the plot aloud, and Eurymachus has publicly promised the boy's safety while intending nothing of the kind. Antinous holds the right-hand table, Amphinomus the left, Penelope the floor between them, Eurymachus the near corner.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"ensemble.suitor-council", instance:"council_01",
      anchor:{x:.50,y:.83}, scale:.50, blend:"multiply" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.29,y:.81}, scale:.37, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.72,y:.81}, scale:.37, band:"threeq", pose:"three_quarter_right" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.50,y:.83}, scale:.36, band:"threeq", pose:"penelope_grief" },
    { asset:"character.eurymachus", instance:"eurymachus",
      anchor:{x:.12,y:.91}, scale:.37, band:"threeq", pose:"skepticism" },
  ],

  timeline:[
    { op:"actor.pose", target:"antinous",   at: 0.0, args:{ pose:"arms_crossed" } },
    { op:"actor.pose", target:"amphinomus", at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose", target:"eurymachus", at: 0.0, args:{ pose:"appraising" } },
    { op:"crowd.state",target:"council_01", at: 0.0, args:{ formation:"council", status:"ASSEMBLED" } },
    { op:"crowd.state",target:"council_01", at: W0,  args:{ formation:"council", status:"ALARMED", wave:0 } },
    { op:"actor.pose", target:"antinous",   at:10.0, args:{ pose:"commanding_stance" } },
    { op:"actor.gaze", target:"antinous",   at:10.0, args:{ gaze:{ x:.12,y:-.06 } } },
    { op:"actor.pose", target:"amphinomus", at:12.0, args:{ pose:"lean_forward" } },
    { op:"crowd.state",target:"council_01", at:17.0, args:{ formation:"council", status:"IN UPROAR" } },
    { op:"actor.pose", target:"antinous",   at:20.0, args:{ pose:"jabbing_accusation" } },
    { op:"actor.gaze", target:"antinous",   at:20.0, args:{ gaze:{ x:-.42,y:.02 } } },
    { op:"crowd.state",target:"council_01", at:22.0, args:{ formation:"split", status:"FOR MURDER" } },
    { op:"actor.pose", target:"amphinomus", at:26.0, args:{ pose:"divine_condition" } },
    { op:"actor.gaze", target:"amphinomus", at:26.0, args:{ gaze:{ x:-.20,y:-.55 } } },
    { op:"crowd.state",target:"council_01", at:30.0, args:{ formation:"split", status:"FOR THE OMEN" } },
    { op:"actor.pose", target:"penelope",   at:33.0, args:{ pose:"penelope_plea" } },
    { op:"actor.pose", target:"penelope",   at:39.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"penelope",   at:39.0, args:{ gaze:{ x:.34,y:-.06 } } },
    { op:"actor.pose", target:"antinous",   at:39.0, args:{ pose:"skepticism" } },
    { op:"actor.pose", target:"amphinomus", at:40.0, args:{ pose:"uneasy_reserve" } },
    { op:"actor.pose", target:"eurymachus", at:42.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"eurymachus", at:42.0, args:{ gaze:{ x:.30,y:-.04 } } },
    { op:"crowd.state",target:"council_01", at:38.0, args:{ formation:"huddle", status:"CONCEALING" } },
    { op:"timeline.capture", target:"OD-B16-S05", at:48.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);
    const crowd = councilAt(t);

    /* the field first — it paints the room, everything else keys onto it */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"feast", t:0.55, progress:Math.min(.94, .2 + .7*(t/D)), status:"MISRULE" },
    });

    /* --- THE COUNCIL, behind the named men, on this room's floor --------- */
    placeCrowd(offctx, W, H, CROWD_AT, CROWD_W, CROWD_H, {
      ...crowd, seatY:SEAT_Y, showHall:false, showFocus:false,
      rows:3, perRow:CROWD_RANKS, density:CROWD_DENSITY,
      layers:["corridor","band-back","band-mid","band-front"],
      progress:Math.min(.95, t/D),
    });

    /* --- ANTINOUS: the head of the violence bloc ------------------------- */
    {
      const p = blk.antinous;
      const s = st.antinous || {};
      const pressing = t >= 17 && t < 32;
      const checked  = t >= 39;
      placeInstance(offctx, W, H, antinous, {
        anchor:{ x:p.x, y:p.y }, scale:0.42 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "arms_crossed",
          gaze: s.gaze || { x:.18, y:-.06 },
          browKnit: pressing ? .72 : .30,
          eyeNarrow: checked ? .45 : pressing ? .42 : .24,
          frown: pressing ? .35 : 0,
          mouthAsym: checked ? .72 : .50,
          jaw: pressing && t < 30 ? .28 : 0,
          status: checked ? "DENIED" : pressing ? "KILL HIM IN THE FIELDS" : "THE SHIP CAME BACK EMPTY",
          progress: Math.min(.96, .16 + .76*(t/D)),
        },
      });
    }

    /* --- AMPHINOMUS: the condition on the conspiracy --------------------- */
    {
      const p = blk.amphinomus;
      const s = st.amphinomus || {};
      const arguing = t >= 26 && t < 40;
      const uneasy  = t >= 40;
      placeInstance(offctx, W, H, amphinomus, {
        anchor:{ x:p.x, y:p.y }, scale:0.42 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "three_quarter_left",
          gaze: s.gaze || { x:-.14, y:.02 },
          browUp:   arguing ? .52 : uneasy ? .44 : .22,
          browKnit: uneasy ? .46 : .24,
          eyeWide:  arguing ? .14 : 0,
          frown:    uneasy ? .30 : 0,
          jaw:      arguing ? .40 : 0,
          status:   uneasy ? "MISGIVING" : arguing ? "NOT WITHOUT A SIGN" : "LISTENING",
          progress: Math.min(.96, .14 + .78*(t/D)),
        },
      });
    }

    /* --- PENELOPE: she comes down the stair and names the plot ----------- */
    if (t >= 30){
      const p = blk.penelope;
      const s = st.penelope || {};
      const naming = t >= 39;
      placeInstance(offctx, W, H, penelope, {
        anchor:{ x:p.x, y:p.y }, scale:0.41 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "penelope_grief",
          gaze: s.gaze || { x:.10, y:.18 },
          mouth: naming ? .35 : -.4,
          status: naming ? "AGAINST MY SON" : "THE QUEEN COMES DOWN",
          progress: Math.min(.96, .40 + .55*(t/D)),
        },
      });
    }

    /* --- EURYMACHUS: the promise he does not mean ------------------------ */
    if (t >= 34){
      const p = blk.eurymachus;
      const s = st.eurymachus || {};
      const promising = t >= 42;
      placeInstance(offctx, W, H, eurymachus, {
        anchor:{ x:p.x, y:p.y }, scale:0.42 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "skepticism",
          gaze: s.gaze || { x:-.24, y:.08 },
          smile: promising ? .42 : .18,
          mouthAsym: promising ? .46 : .74,
          browUp: promising ? .48 : .34,
          eyeNarrow: promising ? .22 : .48,
          jaw: promising ? .34 : 0,
          status: promising ? "NO HAND WILL TOUCH HIM" : "SCORNFUL",
          progress: Math.min(.96, .40 + .55*(t/D)),
        },
      });
    }
  },
};
export default scene;
export const exitOccupancy = scene.exitOccupancy;
