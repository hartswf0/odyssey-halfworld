/* ============================================================
   SCENE  OD-B05-S04 — Building the Raft
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Calypso leads Odysseus to tall trees and gives him axe, adze, augers,
        cloth, and cord.
     2. He fells, trims, bores, joins, decks, and fences the timbers over four
        days.
     3. He rigs mast, yard, sail, steering oar, and ballast.
     4. Calypso bathes and clothes him, loads food and water, and sends a warm
        wind behind the raft.

   Stage layout (Ogygia's cut-grove above the water, back -> front):
     the timber grove set fills the field (sky, treeline, shore, cut-zone) —
       -> Odysseus's raft mid-stage on the shore, growing from loose felled
          logs to a lashed, rigged, and finally sailing craft on one clock
       -> the shipbuilding tool set laid out on the worksite ground, its focus
          moving axe -> adze -> auger -> line as the work proceeds
       -> Calypso, immortal, to the left: first supplying the tools, then (exit)
          the tender send-off with the warm following wind
       -> Odysseus foreground, the working hands — felling, joining, rigging,
          and at last standing to his launched raft.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import grove    from "../assets/location/ogygia-timber-grove.mjs";
import raft     from "../assets/vehicle/odysseuss-raft.mjs";
import tools    from "../assets/prop/shipbuilding-tool-set.mjs";
import calypso  from "../assets/character/calypso.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B05-S04",
  title:"Building the Raft",
  book:1,
  beats:[
    "Calypso leads Odysseus to tall trees and gives him axe, adze, augers, cloth, and cord.",
    "He fells, trims, bores, joins, decks, and fences the timbers over four days.",
    "He rigs mast, yard, sail, steering oar, and ballast.",
    "Calypso bathes and clothes him, loads food and water, and sends a warm wind behind the raft.",
  ],
  exitState:"Calypso bathes and clothes him, loads food and water, and sends a warm wind behind the raft.",
  duration:48,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the cut timber grove above the water — full-field background set
    { asset:"location.ogygia-timber-grove", instance:"grove_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"standing" },

    // the raft itself, on the shore worksite — carries its own construction clock
    { asset:"vehicle.odysseuss-raft", instance:"raft_01",
      anchor:{x:.63,y:.99}, scale:.60, pose:"logs" },

    // the shipbuilding tool set, laid out on the worksite ground
    { asset:"prop.shipbuilding-tool-set", instance:"tools_01",
      anchor:{x:.83,y:.985}, scale:.30, pose:"laid-out" },

    // Calypso, immortal, giving the tools and later the send-off
    { asset:"character.calypso", instance:"calypso_01",
      anchor:{x:.20,y:.99}, scale:.40, pose:"calypso_supply",
      gaze:{x:.30,y:.14}, band:"threeq" },

    // Odysseus, the working hands, foreground
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.44,y:1.00}, scale:.44, pose:"walk_neutral",
      gaze:{x:.22,y:.06}, band:"threeq" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Calypso leads him to the trees and hands over the tools
    { op:"actor.pose", target:"calypso_01",  at:0.0,  args:{ pose:"calypso_supply" } },
    { op:"actor.pose", target:"tools_01",    at:2.0,  args:{ pose:"axe-ready" } },
    { op:"actor.pose", target:"odysseus_01", at:3.0,  args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus_01", at:3.0,  args:{ gaze:{x:-.24,y:.02} } },

    // beat 2: four days of felling, trimming, boring, joining, decking, fencing
    { op:"actor.pose", target:"odysseus_01", at:6.0,  args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:6.0,  args:{ gaze:{x:.30,y:.10} } },
    { op:"actor.pose", target:"raft_01",     at:6.0,  args:{ pose:"logs" } },
    { op:"actor.pose", target:"tools_01",    at:9.0,  args:{ pose:"adze-ready" } },
    { op:"actor.pose", target:"raft_01",     at:14.0, args:{ pose:"lashed" } },
    { op:"actor.pose", target:"tools_01",    at:16.0, args:{ pose:"auger-ready" } },

    // beat 3: he rigs mast, yard, sail, steering oar, and ballast
    { op:"actor.pose", target:"tools_01",    at:24.0, args:{ pose:"line-ready" } },
    { op:"actor.pose", target:"raft_01",     at:26.0, args:{ pose:"rigged" } },
    { op:"actor.pose", target:"tools_01",    at:30.0, args:{ pose:"cloth-ready" } },
    { op:"actor.pose", target:"odysseus_01", at:32.0, args:{ pose:"offering_hand" } },

    // beat 4 (exit): Calypso bathes and clothes him, stows food and water, and
    // sends a warm following wind — the raft stands off under full sail
    { op:"actor.pose", target:"raft_01",     at:40.0, args:{ pose:"sailing" } },
    { op:"actor.pose", target:"calypso_01",  at:40.0, args:{ pose:"calypso_tender" } },
    { op:"actor.gaze", target:"calypso_01",  at:40.0, args:{ gaze:{x:.34,y:.06} } },
    { op:"actor.pose", target:"odysseus_01", at:42.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus_01", at:42.0, args:{ gaze:{x:.20,y:-.06} } },
    { op:"actor.pose", target:"calypso_01",  at:45.0, args:{ pose:"calypso_release" } },
    { op:"timeline.capture", target:"OD-B05-S04", at:47.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the grove set, the raft, the tools, Calypso, Odysseus.
     Non-figure assets (grove/raft/tools) carry custom channels, so their timeline
     `pose` string is folded into their own state channels here. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const wave = t * 0.6;   // shared gentle water/idle motion

    // tool pose -> {focus, lift, status}
    const TOOLFOCUS = {
      "laid-out":  { focus:null,    lift:0, status:"STOWED" },
      "axe-ready": { focus:"axe",   lift:1, status:"AXE" },
      "adze-ready":{ focus:"adze",  lift:1, status:"ADZE" },
      "auger-ready":{focus:"auger", lift:1, status:"AUGER" },
      "line-ready":{ focus:"line",  lift:1, status:"MEASURE" },
      "cords-ready":{focus:"cords", lift:1, status:"CORDS" },
      "cloth-ready":{focus:"cloth", lift:1, status:"SAILCLOTH" },
    };

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "grove_01"){
        mod = grove;
        // clear the stand as the timbers come down: standing -> felling -> cleared
        const layers = t < 12
          ? ["sky","treeline","shore","stand","dragpaths","cutzone","worksite"]
          : t < 40
          ? ["sky","treeline","shore","stand","dragpaths","cutzone","worksite"]
          : ["sky","treeline","shore","dragpaths","cutzone","worksite"];
        state = { layers, status:"HARVESTABLE", progress:clamp01(t/48), t:wave };
      } else if (c.instance === "raft_01"){
        mod = raft;
        const mode = s.pose || "logs";
        state = { mode, t:wave, status:mode.toUpperCase() };
      } else if (c.instance === "tools_01"){
        mod = tools;
        const tf = TOOLFOCUS[s.pose || "laid-out"] || TOOLFOCUS["laid-out"];
        state = { ...tf, t:wave, progress:clamp01(t/48) };
      } else {
        // the two figures: fold pose/gaze/band from the timeline; placeInstance
        // owns the anchor/scale
        mod = c.instance === "calypso_01" ? calypso : odysseus;
        state = { t:0.5, band:c.band, gaze:c.gaze, pose:c.pose, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
