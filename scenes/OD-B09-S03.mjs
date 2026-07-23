/* ============================================================
   SCENE  OD-B09-S03 — The Lotus-Eaters
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. A north wind drives the ships off course for nine days.
     2. They land among the Lotus-eaters and send three scouts inland.
     3. The inhabitants offer lotus; those who taste it lose all desire for home.
     4. Odysseus drags the weeping men back, binds them under the benches, and
        departs.

   Stage layout (back -> front, one master clock):
     the LOTUS SHORE AND MEADOW as the empty navigable set, full bleed: the
     becalmed sea and return-lane, the flowering food-field, the landing beach
     and the inland path the scouts wandered up.
       -> the LOTUS-EATERS, placid hosts clustered in the meadow, gently turned
          to the landing and holding out the honey-sweet blossoms — offering,
          never pursuing.
       -> a hero LOTUS FRUIT, the offered bloom made large at the point of
          contact: offered -> tasted -> euphoric -> removed as the beats turn.
       -> the THREE SCOUTS sent inland, read left-to-right as the whole
          seduction in one frame: one still exploring, one sunk dreamy over the
          lotus, one hauled back weeping and clinging to the ground.
       -> ODYSSEUS, foreground: the captain who catches the loss, drags the
          weeping men back, and orders immediate departure.
   The nine-day wind, the landing, the drugged forgetting and the forced return
   — all held on one clock in a single still.
   ============================================================ */
import { placeInstance, clamp, clamp01, lerp } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import shore from "/assets/location/lotus-shore-and-meadow.mjs";
import lotusEaters from "/assets/ensemble/lotus-eaters.mjs";
import lotusFruit from "/assets/prop/lotus-fruit.mjs";
import threeScouts from "/assets/ensemble/three-scouts.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B09-S03",
  title:"The Lotus-Eaters",
  book:1,
  beats:[
    "A north wind drives the ships off course for nine days.",
    "They land among the Lotus-eaters and send three scouts inland.",
    "The inhabitants offer lotus; those who taste it lose all desire for home.",
    "Odysseus drags the weeping men back, binds them under the benches, and departs.",
  ],
  exitState:"Odysseus drags the weeping men back and orders immediate departure.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: becalmed sea + return-lane, food-field, landing
    // beach and inland path — full bleed
    { asset:"location.lotus-shore-and-meadow", instance:"shore_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the LOTUS-EATERS — placid hosts clustered in the meadow, turned to the
    // landing on the left, holding out the blossoms; offering, not pursuing
    { asset:"ensemble.lotus-eaters", instance:"eaters_01",
      anchor:{x:.36,y:.86}, scale:.60 },

    // a hero LOTUS FRUIT — the offered bloom made large at the point of contact
    { asset:"prop.lotus-fruit", instance:"lotus_01",
      anchor:{x:.44,y:.66}, scale:.20, pose:"offered" },

    // the THREE SCOUTS sent inland — the seduction arc read left->right in one
    // frame: exploring, dreamy over the lotus, hauled back weeping
    { asset:"ensemble.three-scouts", instance:"scouts_01",
      anchor:{x:.62,y:.99}, scale:.66 },

    // ODYSSEUS, foreground right: catches the loss, drags the weeping men back,
    // orders immediate departure toward the waiting ships
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.83,y:1.00}, scale:.46, pose:"neutral", band:"threeq",
      gaze:{x:-.34,y:.04} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the nine-day wind — Odysseus watches the strange shore, wary
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.34,y:.04} } },
    // beat 2: the scouts are sent inland (staged in stage() as the exploring
    // reach of the seduction arc)
    // beat 3: the lotus is eaten — the fruit passes offered -> tasted -> euphoric
    // (staged in stage()); Odysseus catches the men not returning
    { op:"actor.gaze", target:"odysseus_01", at:16.0, args:{ gaze:{x:-.42,y:.10} } },
    // beat 4: Odysseus orders the men dragged back — arm flung up in command
    { op:"actor.pose", target:"odysseus_01", at:26.0, args:{ pose:"hailing" } },
    { op:"actor.gaze", target:"odysseus_01", at:26.0, args:{ gaze:{x:-.30,y:.02} } },
    // exit: immediate departure — the captain turns for the ships, driving them on
    { op:"actor.pose", target:"odysseus_01", at:36.0, args:{ pose:"striding" } },
    { op:"actor.gaze", target:"odysseus_01", at:36.0, args:{ gaze:{x:.34,y:.00} } },
    { op:"timeline.capture", target:"OD-B09-S03", at:42.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the shore set, the offering hosts, the hero lotus, the scout
     arc, then Odysseus in the foreground. The two ensembles + the prop read the
     progression of the seduction off the master clock deterministically. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const p  = clamp01(t / scene.duration);   // 0..1 across the scene

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "shore_01"){
        mod = shore;
        // the full navigable coast, ship-return lane still on the sea
        state = { layers:["sky","sea","route","headland","meadow","field","beach","path"] };

      } else if (c.instance === "eaters_01"){
        mod = lotusEaters;
        // placid hosts: warm offering early, drowsing calm as the beats deepen;
        // they always face the landing shore on their left, never pursuing
        state = { formation:"cluster",
                  serenity: lerp(0.78, 1.0, p),
                  offering: lerp(0.95, 0.55, p),
                  sway:0.35 };

      } else if (c.instance === "lotus_01"){
        mod = lotusFruit;
        // the offered bloom turns with the eating: offered -> tasted -> euphoric
        // (the honey height that erases home) -> removed as the men are hauled off
        const mode = t < 6 ? "offered"
                   : t < 15 ? "tasted"
                   : t < 28 ? "euphoric"
                   : "removed";
        state = { mode };

      } else if (c.instance === "scouts_01"){
        mod = threeScouts;
        // the seduction spread across the trio as a left->right reaction wave:
        // phase/attention deepen and the last scout gets a visible rescuer once
        // the drug has taken hold (past the midpoint)
        state = { formation:"spread",
                  lure:-1,
                  phase: clamp(lerp(0.6, 1.7, p), 0, 2),
                  wave:  lerp(0.5, 1.0, p),
                  attention: lerp(0.4, 0.85, p),
                  draggedIndex: p > 0.5 ? 2 : -1 };

      } else {
        // ODYSSEUS: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
