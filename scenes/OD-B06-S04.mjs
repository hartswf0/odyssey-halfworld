/* ============================================================
   SCENE  OD-B06-S04 — Bath, Clothing, and the Road to Town
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The maids place food, oil, and clothing beside the river and withdraw
        while Odysseus washes.
     2. Athena makes him appear taller, stronger, and more radiant; Nausicaa
        admires him.
     3. He eats while the women fold and load the dry clothes.
     4. Nausicaa explains how to follow at a distance, wait in Athena's grove,
        and supplicate Queen Arete first.

   Stage layout (a stations tableau, back -> front, river-left to cityward):
     the ROAD FROM RIVER TO SCHERIA as the empty navigable set (full bleed):
       its poplar grove waiting-point, walls, gate, palace and harbor hold the
       whole exit geography Nausicaa points to in beat 4.
       -> ATHENA'S BEAUTIFICATION as a translucent before/after transformation
          field floating mid-left (the divine mechanism of beat 2: the grimy
          bathed source grown into the radiant taller target, sparkles + arrow).
       -> the folded PHAEACIAN TUNIC AND CLOAK set beside the river at far-left
          low (beat 1 given / beat 3 folded and loaded — the borrowed clothes).
       -> ODYSSEUS RESTORED, foreground centre-left, stood to full radiant
          height — the RESULT of the grace, composed and dignified.
       -> NAUSICAA, foreground right, first admiring him privately (beat 2),
          then giving her careful public instructions toward the road (beat 4).
   The bath's grace, the borrowed clothes, the restored man, and the road he must
   walk at a distance all held on one clock: the whole passage read in one still.
   ============================================================ */
import { placeInstance, clamp01 } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import road      from "../assets/location/road-from-river-to-scheria.mjs";
import grace     from "../assets/divine_fx/athenas-beautification.mjs";
import clothes   from "../assets/prop/phaeacian-tunic-and-cloak.mjs";
import odysseus  from "../assets/character/odysseus-restored.mjs";
import nausicaa  from "../assets/character/nausicaa.mjs";

export const scene = {
  id:"OD-B06-S04",
  title:"Bath, Clothing, and the Road to Town",
  book:1,
  beats:[
    "The maids place food, oil, and clothing beside the river and withdraw while Odysseus washes.",
    "Athena makes him appear taller, stronger, and more radiant; Nausicaa admires him.",
    "He eats while the women fold and load the dry clothes.",
    "Nausicaa explains how to follow at a distance, wait in Athena's grove, and supplicate Queen Arete first.",
  ],
  exitState:"Nausicaa explains how to follow at a distance, wait in Athena's grove, and supplicate Queen Arete first.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: river-mouth road -> grove -> walls/gate/harbor,
    // full bleed — the geography of beat 4's instructions
    { asset:"location.road-from-river-to-scheria", instance:"road_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beat 2: Athena's beautification as a floating before/after field, mid-left,
    // the divine mechanism that restores him (grimy source -> radiant target)
    { asset:"divine_fx.athenas-beautification", instance:"grace_01",
      anchor:{x:.215,y:.52}, scale:.40 },

    // beat 1 / beat 3: the borrowed Phaeacian tunic + cloak set beside the river,
    // folded (given, then folded back and loaded)
    { asset:"prop.phaeacian-tunic-and-cloak", instance:"clothes_01",
      anchor:{x:.135,y:.90}, scale:.24 },

    // beat 2 (result): Odysseus restored, foreground centre-left, stood to full
    // radiant height — composed, dignified, the man remade
    { asset:"character.odysseus-restored", instance:"odysseus_01",
      anchor:{x:.44,y:.965}, scale:.60, pose:"composed", band:"front",
      gaze:{x:.10,y:0} },

    // beat 2 / beat 4: Nausicaa, foreground right — admiring him privately, then
    // giving her careful instructions toward the road
    { asset:"character.nausicaa", instance:"nausicaa_01",
      anchor:{x:.77,y:.955}, scale:.52, pose:"dreaming", band:"front",
      gaze:{x:-.34,y:-.10} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the clothes lie folded by the river; Odysseus bathes off-frame
    // (carried by the grimy SOURCE of the grace field until it kindles)
    // beat 2: Athena pours grace — the transformation field kindles
    { op:"fx.play",    target:"grace_01",     at:2.0,  args:{} },
    // beat 2: he rises restored, radiant to his full height
    { op:"actor.pose", target:"odysseus_01",  at:6.0,  args:{ pose:"radiant" } },
    { op:"actor.gaze", target:"odysseus_01",  at:6.0,  args:{ gaze:{x:0,y:-.04} } },
    // beat 2: Nausicaa admires him, wonder held quietly inside
    { op:"actor.pose", target:"nausicaa_01",  at:7.0,  args:{ pose:"dreaming" } },
    { op:"actor.gaze", target:"nausicaa_01",  at:7.0,  args:{ gaze:{x:-.34,y:-.10} } },
    // beat 3: he eats, settling to composed dignity while the women fold + load
    { op:"actor.pose", target:"odysseus_01",  at:18.0, args:{ pose:"composed" } },
    { op:"actor.gaze", target:"odysseus_01",  at:18.0, args:{ gaze:{x:.06,y:.04} } },
    { op:"actor.pose", target:"nausicaa_01",  at:18.0, args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"nausicaa_01",  at:18.0, args:{ gaze:{x:.02,y:.08} } },
    // beat 4 (exit): Nausicaa's careful public instructions — follow at a
    // distance, wait in Athena's grove, supplicate Queen Arete first. Her hand
    // offers the way cityward; he listens, composed.
    { op:"actor.pose", target:"nausicaa_01",  at:30.0, args:{ pose:"instructing" } },
    { op:"actor.gaze", target:"nausicaa_01",  at:30.0, args:{ gaze:{x:-.14,y:.04} } },
    { op:"actor.pose", target:"odysseus_01",  at:31.0, args:{ pose:"composed" } },
    { op:"actor.gaze", target:"odysseus_01",  at:31.0, args:{ gaze:{x:.22,y:.02} } },
    { op:"timeline.capture", target:"OD-B06-S04", at:43.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the road set, the beautification field, the folded clothes,
     Odysseus restored, then Nausicaa. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "road_01"){
        mod = road;
        // full cityward route: grove waiting-point, walls/gate, palace + harbor
        state = { layers:["sky","harbor","walls","palace","grove","fields",
                          "road","lanes","waypoints"] };
      } else if (c.instance === "grace_01"){
        mod = grace;
        // drive the transformation off the fx.play cue; drop the opaque plinth so
        // it overlays the road as a translucent before/after diagram
        const fxT = (s.fxT != null) ? s.fxT : 0;
        const gt = clamp01(fxT / 8);   // grimy source -> radiant target by ~10s
        state = { t:gt, intensity:1.05,
                  layers:["radiance","before","after","proportion","sparkles"] };
      } else if (c.instance === "clothes_01"){
        mod = clothes;
        // the borrowed set folded beside the river (given, then folded back)
        state = { mode:"folded", t:t*0.4, wet:false };
      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "odysseus_01") ? odysseus : nausicaa;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
