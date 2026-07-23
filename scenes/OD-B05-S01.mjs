/* ============================================================
   SCENE  OD-B05-S01 — Hermes Carries the Decree
   A thin Halfworld COMPOSITION module. It places existing atlas assets on one
   master clock; it never redraws them. The engine runs ONE dotify + scene card
   pass over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The gods meet again and Athena presses the case of Odysseus and Telemachus.
     2. Zeus orders Hermes to tell Calypso that Odysseus must depart without escort.
     3. Hermes straps on his sandals, takes his wand, and skims across the sea.
     4. He reaches Ogygia, enters Calypso's fragrant cavern, and finds her
        weaving at the fire.

   Staging (a left->right causal tableau on one clock, back -> front):
     the Olympian council hall frames the LEFT (beats 1-2 — the gods in session,
     the decree given, its portal opening on Calypso's distant island)
       -> Calypso's Ogygia cavern-and-grove frames the RIGHT (beat 4 / exit —
          the fragrant cave with its hearth and standing loom, the destination)
       -> the sea-crossing flight field bridges them across the CENTER (beat 3 —
          a low rapid skim thrown from the near sea-edge toward the far)
       -> Hermes himself flies FOREGROUND-CENTER, the swift messenger caught
          mid-crossing, sandals winged, gaze thrown down the road
       -> his herald's WAND, taken up for the errand, rides in his right hand.
   Olympus (the order) on the left, Ogygia (the arrival) on the right, the sea
   between them — the whole errand read on one clock.
   ============================================================ */
import { placeInstance, clamp, clamp01, lerp, smooth } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import hall   from "../assets/location/olympian-council-hall.mjs";
import cavern from "../assets/location/ogygia-cavern-and-grove.mjs";
import flight from "../assets/divine_fx/sea-crossing-flight.mjs";
import hermes from "../assets/character/hermes.mjs";
import wand   from "../assets/prop/hermess-wand.mjs";

export const scene = {
  id:"OD-B05-S01",
  title:"Hermes Carries the Decree",
  book:1,

  beats:[
    "The gods meet again and Athena presses the case of Odysseus and Telemachus.",
    "Zeus orders Hermes to tell Calypso that Odysseus must depart without divine escort.",
    "Hermes straps on his sandals, takes his wand, and skims across the sea.",
    "He reaches Ogygia, enters Calypso's fragrant cavern, and finds her weaving at the fire.",
  ],
  exitState:"He reaches Ogygia, enters Calypso's fragrant cavern, and finds her weaving at the fire.",
  duration:42,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // back -> front
    // beats 1-2: the Olympian council hall, LEFT — the gods in session, Zeus's
    // order given; its back-wall portal already frames Calypso's distant island.
    { asset:"location.olympian-council-hall", instance:"hall_01",
      anchor:{x:.22,y:1.00}, scale:.86, pose:"assembled" },

    // beat 4 / exit: Calypso's Ogygia cavern-and-grove, RIGHT — the fragrant
    // cave with its hearth and standing loom, the errand's destination.
    { asset:"location.ogygia-cavern-and-grove", instance:"cavern_01",
      anchor:{x:.80,y:1.00}, scale:.84, pose:"day" },

    // beat 3: the sea-crossing flight field, CENTER — a low rapid skim thrown
    // from the near sea-edge (Olympus) toward the far (Ogygia).
    { asset:"divine_fx.sea-crossing-flight", instance:"flight_01",
      anchor:{x:.50,y:.90}, scale:.60, pose:"skimming" },

    // the swift messenger himself, foreground-center, mid-crossing — his own
    // built-in caduceus stowed for locomotion (the prop wand carries the staff).
    { asset:"character.hermes", instance:"hermes_01",
      anchor:{x:.46,y:.99}, scale:.52, pose:"named",
      gaze:{x:.24,y:.04}, band:"threeq" },

    // his herald's wand, taken up for the errand, riding in his right hand.
    { asset:"prop.hermess-wand", instance:"wand_01",
      anchor:{x:.563,y:.948}, scale:.40, pose:"carry" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beats 1-2: Hermes is named and commanded in the council — a listening turn
    { op:"actor.pose", target:"hermes_01", at:0.0,  args:{ pose:"named" } },
    { op:"actor.gaze", target:"hermes_01", at:0.0,  args:{ gaze:{x:-.20,y:.04} } },
    // beat 3: dispatched — he takes flight, then settles into pure locomotion
    { op:"actor.pose", target:"hermes_01", at:3.0,  args:{ pose:"dispatched" } },
    { op:"actor.gaze", target:"hermes_01", at:3.0,  args:{ gaze:{x:.16,y:-.24} } },
    { op:"fx.play",    target:"flight_01", at:3.0,  args:{} },
    { op:"actor.pose", target:"hermes_01", at:6.0,  args:{ pose:"flying" } },
    { op:"actor.gaze", target:"hermes_01", at:6.0,  args:{ gaze:{x:.24,y:.04} } },
    // beat 4 (exit): he reaches Ogygia and enters the cavern, presenting the word
    { op:"actor.pose", target:"hermes_01", at:30.0, args:{ pose:"delivering" } },
    { op:"actor.gaze", target:"hermes_01", at:30.0, args:{ gaze:{x:.34,y:.02} } },
    { op:"timeline.capture", target:"OD-B05-S01", at:40.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify + card
     pass. Back -> front: the council hall (left), the cavern (right), the sea
     crossing (center), then Hermes and his wand in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the sea-crossing animates 0 -> 1 across the middle of the clock, so a
    // single render lands the streak mid-sea between the two lands.
    const fxT = clamp01((t - 2.0) / 13.0);
    // the wand rides carried at the council, streaks in travel while he crosses,
    // then settles back to carried as he arrives and presents the decree.
    const wandMode = t < 3 ? "carry" : (t < 28 ? "travel" : "carry");
    // whether Hermes has left the ground yet (his built-in staff stays stowed —
    // the prop wand is the herald's staff in this scene).
    const airborne = t >= 3;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "hall_01"){
        mod = hall;
        // full assembled hall — its portal frames Calypso's island (the target)
        state = { layers:["sky","backwall","portal","throne","columns","floor"] };
      } else if (c.instance === "cavern_01"){
        mod = cavern;
        // the fragrant cave with hearth + loom lit — the exit tableau's home
        state = { layers:["sky","sea","floor","woods","massif","cavemouth",
                          "hearth","loom","shore","springs","vines","birds"] };
      } else if (c.instance === "flight_01"){
        mod = flight;
        state = { t:fxT, intensity:1.15, dir:1,
                  layers:["sky","sea","field","wake","spray","streak","source","target"] };
      } else if (c.instance === "hermes_01"){
        mod = hermes;
        const speaking = t >= 30;   // presenting the decree at the cave
        state = { t:0.5, band:c.band, pose:s.pose, gaze:s.gaze,
                  mouth: speaking ? 0.75 : 0.16, staff:false };
      } else { // wand_01
        mod = wand;
        state = { mode:wandMode, t:0.5 };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
