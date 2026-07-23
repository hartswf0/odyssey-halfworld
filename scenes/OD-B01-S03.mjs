/* ============================================================
   SCENE  OD-B01-S03 — The Stranger at the Threshold
   Book 1. A THIN Halfworld composition module: it places existing asset
   instances on one clock. It does NOT redraw any asset.

   Beats (causal order):
     1. Athena arrives disguised as Mentes and waits at the outer gate.
     2. The suitors gamble and feast while servants prepare wine and meat.
     3. Telemachus notices the unattended stranger and crosses the hall in shame.
     4. He greets her, takes her spear, and leads her from the suitors' noise.

   Composition (back -> front):
     location.odysseuss-palace-threshold-and-hall  (full-bleed hall)
     ensemble.palace-servants                       (attendants, mid-hall)
     ensemble.the-suitors                           (carousing, hall centre-right)
     character.athena-as-mentes                     (left threshold, waiting)
     character.telemachus                           (crossing from the hall)

   The engine runs ONE dotify + scene card over the whole stage, so every
   instance shares a single halftone. Deterministic (no Date/random).
   Verify:  node harness/render-scene.mjs scenes/OD-B01-S03.mjs --t 8
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

import loc         from "../assets/location/odysseuss-palace-threshold-and-hall.mjs";
import athena      from "../assets/character/athena-as-mentes.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import suitors     from "../assets/ensemble/the-suitors.mjs";
import servants    from "../assets/ensemble/palace-servants.mjs";

const MODS = {
  "location.odysseuss-palace-threshold-and-hall": loc,
  "character.athena-as-mentes": athena,
  "character.telemachus": telemachus,
  "ensemble.the-suitors": suitors,
  "ensemble.palace-servants": servants,
};

export const scene = {
  id:"OD-B01-S03",
  title:"The Stranger at the Threshold",
  book:1,
  beats:[
    "Athena arrives disguised as Mentes and waits at the outer gate.",
    "The suitors gamble and feast while servants prepare wine, tables, and meat.",
    "Telemachus notices the unattended stranger and crosses the hall in shame.",
    "He greets her, takes her spear, and leads her away from the suitors' noise.",
  ],
  exitState:"Telemachus has greeted the disguised stranger, taken her bronze spear, and led her away from the suitors' noise toward a private seat set apart by the door.",
  duration:24,

  cast:[
    // back: the whole royal hall, gate + porch threshold + spear-rack + feast + stair
    { asset:"location.odysseuss-palace-threshold-and-hall", instance:"hall",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"occupied",
      render:{ layers:["backwall","upperstair","columns","spearrack","feast","guestseat","porchgate","floor"] } },

    // attendants working deeper in the hall (wine / carving / clearing / opening paths)
    { asset:"ensemble.palace-servants", instance:"servants",
      anchor:{x:.55,y:.62}, scale:.42,
      render:{ attention:.5, density:.7, spread:1.0, reacting:false } },

    // the suitors carousing across the centre-right benches, ignoring the door.
    // Layer subset drops their self-contained backwall/floor/baked-stranger so
    // they composite cleanly onto the location.
    { asset:"ensemble.the-suitors", instance:"suitors",
      anchor:{x:.66,y:.99}, scale:.60,
      render:{ layers:["bgrow","bgtable","fgrow","fgtable"], attention:0, wave:0, density:1.0 } },

    // Athena disguised as Mentes, standing at the left threshold, watching in.
    { asset:"character.athena-as-mentes", instance:"athena_mentes",
      anchor:{x:.14,y:.90}, scale:.46, pose:"three_quarter_left", band:"threeq",
      gaze:{x:.25,y:0}, render:{ t:0.4 } },

    // Telemachus — begins grieving among the suitors, then crosses the hall.
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.47,y:.93}, scale:.50, pose:"grief", band:"threeq",
      gaze:{x:0,y:.4}, render:{ t:0.4 } },
  ],

  timeline:[
    // beat 1 — Athena waits, eyes turned into the hall
    { op:"actor.gaze", target:"athena_mentes", at:0.0, args:{ gaze:{x:.25,y:0} } },
    // beat 3 — Telemachus lifts from grief, notices the stranger, and crosses
    { op:"actor.pose", target:"telemachus",    at:3.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus",    at:3.0, args:{ gaze:{x:-.35,y:0} } },
    { op:"actor.move", target:"telemachus",    at:5.0, args:{ anchor:{x:.33,y:.905} } },
    // beat 4 — greeting: he offers hospitality; she uncrosses into a composed guest
    { op:"actor.pose", target:"telemachus",    at:12.0, args:{ pose:"offering_hand" } },
    { op:"actor.pose", target:"athena_mentes", at:12.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"athena_mentes", at:12.0, args:{ gaze:{x:.1,y:0} } },
    // he leads her away from the benches toward the private seat by the door
    { op:"actor.move", target:"telemachus",    at:18.0, args:{ anchor:{x:.24,y:.88} } },
    { op:"actor.move", target:"athena_mentes", at:18.0, args:{ anchor:{x:.20,y:.86} } },
    { op:"timeline.capture", target:"OD-B01-S03", at:23.0, args:{ label:"EXIT" } },
  ],

  // Draw every cast instance in SOLID tones into the offscreen buffer at time t.
  // The engine runs the single dotify + card pass over the whole stage.
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    for (const c of scene.cast){
      const mod = MODS[c.asset];
      if (!mod) continue;
      const s = st[c.instance] || {};
      if (s.visible === false) continue;
      const anchor = s.anchor || c.anchor;
      // static per-instance render config (layers / ensemble controls / breath)
      // then the folded timeline state (pose / band / gaze) on top.
      const state = {
        ...(c.render || {}),
        pose: s.pose,
        band: c.band,
        gaze: s.gaze || c.gaze,
      };
      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
