/* ============================================================
   SCENE  OD-B12-S04 — Between Scylla and Charybdis
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The crew hears Charybdis roar and sees spray rising from the whirlpool.
     2. Odysseus keeps Scylla secret and orders the men to row hard along her cliff.
     3. He arms himself despite Circe's warning and searches the rock face.
     4. Scylla's six heads strike, lifting six screaming men from the ship.
     5. The survivors pass beyond both monsters while watching their companions
        die above them.

   Stage layout (back -> front, one master clock):
     NARROW MONSTER STRAIT fills the whole field — the sheer Scylla headland and
     her dark den at the left, the swallowing whirlpool at the right, the clear
     lane threading up between them to the exit. The world every body is set into.
       -> CHARYBDIS at the right: the great maelstrom heard first, seabed bared at
          the throat and a tower of spray heaved up (beat 1).
       -> SCYLLA on the left cliff: her six telescoping necks fanned out of the
          hidden den, snapping over the lane, then one head darting to seize and
          hauling its catch aloft (beat 4).
       -> the SIX SEIZED SAILORS lifted in an arc over the ship's benches, still
          rising early, flung fully aloft and screaming Odysseus's name by the end.
       -> ODYSSEUS at the foreground on the deck: hiding Scylla from the men and
          hailing them to row hard (beat 2), armed and searching the rock face
          (beat 3), then watching his companions die above him as they pass (5).
   The two monsters, the hero, the six taken men and the narrow lane between —
   all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import strait from "../assets/location/narrow-monster-strait.mjs";
import charybdis from "../assets/environment/charybdis.mjs";
import scylla from "../assets/creature/scylla.mjs";
import sailors from "../assets/ensemble/six-seized-sailors.mjs";
import odysseus from "../assets/character/odysseus.mjs";

const clamp01f = x => (x < 0 ? 0 : x > 1 ? 1 : x);

export const scene = {
  id:"OD-B12-S04",
  title:"Between Scylla and Charybdis",
  book:1,
  beats:[
    "The crew hears Charybdis roar and sees spray rising from the whirlpool.",
    "Odysseus keeps Scylla secret and orders the men to row hard along her cliff.",
    "He arms himself despite Circe's warning and searches the rock face.",
    "Scylla's six heads strike, lifting six screaming men from the ship.",
    "The survivors pass beyond both monsters while watching their companions die above them.",
  ],
  exitState:"The survivors pass beyond both monsters while watching their companions die above them.",
  duration:32,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // NARROW MONSTER STRAIT — the whole passage: Scylla's headland + den at the
    // left, the whirlpool at the right, the clear lane threading up to the exit.
    // The world every body below is staged into.
    { asset:"location.narrow-monster-strait", instance:"strait_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // CHARYBDIS — the maelstrom at the right, heard before it is seen: bared
    // seabed at the throat, a tower of spray heaved up on the roar.
    { asset:"environment.charybdis", instance:"charybdis_01",
      anchor:{x:.85,y:.94}, scale:.54 },

    // SCYLLA — the six-headed monster of the left cliff, necks fanned out of the
    // hidden den over the lane, then striking down to seize and haul aloft.
    { asset:"creature.scylla", instance:"scylla_01",
      anchor:{x:.24,y:.98}, scale:.82, pose:"necks-out" },

    // SIX SEIZED SAILORS — lifted in an arc over the ship's benches; still rising
    // early, flung fully aloft and calling Odysseus's name by the end.
    { asset:"ensemble.six-seized-sailors", instance:"sailors_01",
      anchor:{x:.49,y:.74}, scale:.52 },

    // ODYSSEUS — foreground on the deck: hides Scylla and hails the men to row,
    // arms himself and searches the rock face, then watches his men die above.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.53,y:1.00}, scale:.44, pose:"three_quarter_left", band:"threeq",
      gaze:{x:-.34,y:-.26} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Charybdis roars and throws up spray; Odysseus stares off toward the
    // cliff, keeping the greater terror to himself
    { op:"fx.play",    target:"charybdis_01", at:0.0,  args:{} },
    { op:"actor.gaze", target:"odysseus_01",  at:0.0,  args:{ gaze:{x:-.34,y:-.26} } },
    // beat 2: he hides Scylla and hails the crew to pull hard along her cliff
    { op:"actor.pose", target:"odysseus_01",  at:6.0,  args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus_01",  at:6.0,  args:{ gaze:{x:-.18,y:-.10} } },
    // beat 3: armed despite Circe's warning, he searches the sheer rock face
    { op:"actor.pose", target:"odysseus_01",  at:12.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus_01",  at:12.0, args:{ gaze:{x:-.42,y:-.34} } },
    // beat 4: Scylla's heads strike — one darts to seize, then hauls its catch up
    { op:"actor.pose", target:"scylla_01",    at:18.0, args:{ pose:"seize" } },
    { op:"actor.pose", target:"scylla_01",    at:23.0, args:{ pose:"lift" } },
    // beat 5 (exit): they pass beyond both monsters, the hero staring up in grief
    // at his companions dying above him
    { op:"actor.pose", target:"odysseus_01",  at:26.0, args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus_01",  at:26.0, args:{ gaze:{x:-.16,y:-.40} } },
    { op:"timeline.capture", target:"OD-B12-S04", at:31.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the strait, the whirlpool, Scylla's cliff, the six taken men,
     then Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "strait_01"){
        mod = strait;
        // the whole passage dressed: both hazards live, lane clear, spray up
        state = { t:1.2,
                  layers:["exit","water","charybdis","cliff","den","figtree","lane","spray"],
                  status:"THREADING", progress:.30 };

      } else if (c.instance === "charybdis_01"){
        mod = charybdis;
        // heard first on the roar (fx.play at 0): seabed bared, a tower of spray
        // heaved up. Spray rises early and eases as they slip past.
        const ft = (s.fxT != null) ? s.fxT : t;
        const spray = clamp01f(0.35 + ft * 0.05);
        state = { t, depth:0.85, seabed:0.35, spray, intensity:1.35,
                  layers:["sea","sound","suction","funnel","throat","geyser"],
                  status:"ROARING", progress: clamp01f(0.28 + t / 60) };

      } else if (c.instance === "scylla_01"){
        mod = scylla;
        // necks fanned and snapping over the lane, then one darts to seize (18)
        // and hauls its catch aloft (23). Pose folds off the timeline.
        state = { t, pose: s.pose || c.pose, status:"RAVENOUS", progress:.24 };

      } else if (c.instance === "sailors_01"){
        mod = sailors;
        // still rising off the benches early, hoisted and screaming by the seize,
        // flung fully aloft and calling Odysseus's name as they pass beyond
        if (t < 18){
          const r = clamp01f(t / 18);
          state = { t, lift:0.45 + 0.30*r, arcHeight:0.55 + 0.15*r,
                    terror:0.85, flail:0.7, wave:0.5, waveLag:0.85,
                    formation:"lifted-arc", status:"SNATCHING", progress:0.35 };
        } else if (t < 26){
          state = { t, lift:0.92, arcHeight:0.74, terror:0.95, flail:0.85,
                    wave:1.0, waveLag:0.35, formation:"lifted-arc",
                    status:"SEIZED", progress:0.55 };
        } else {
          state = { t, lift:0.98, arcHeight:0.82, terror:1.0, flail:0.9,
                    wave:1.0, waveLag:0.3, formation:"lifted-arc",
                    status:"CALLING", progress:0.72 };
        }

      } else { // odysseus_01 — the witness who hides the terror, hails, arms, grieves
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
        const hailing  = t >= 6  && t < 12;   // ordering the men to pull
        const searching = t >= 12 && t < 26;  // armed, scanning the rock face
        const grieving = t >= 26;             // watching his men die above
        state.browKnit = grieving ? .42 : searching ? .50 : .24;
        state.browUp   = grieving ? .48 : hailing ? .40 : .14;
        state.eyeWide  = hailing ? .30 : grieving ? .34 : .08;
        state.eyeNarrow = searching ? .26 : 0;
        state.frown    = grieving ? .55 : 0;
        state.smile    = 0;
        state.jaw      = hailing ? .48 : grieving ? .30 : .06;
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
