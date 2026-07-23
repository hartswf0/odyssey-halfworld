/* ============================================================
   SCENE  OD-B09-S07 — The First Killings
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus claims they are survivors of Agamemnon's fleet and invokes
        Zeus's protection of strangers.
     2. Polyphemus mocks the gods and demands to know where the ship is.
     3. Odysseus lies that Poseidon smashed it against the rocks.
     4. The Cyclops seizes two men, smashes them on the floor, and devours them raw.
     5. He drinks milk and sleeps among his animals while the survivors pray in horror.

   Stage layout (back -> front, one master clock):
     the CAVE FLOOR AND BLOOD STATE as the full-bleed set — dark cavern walls,
     the receding flagstone ground, and the same stone carrying the event of the
     killing: clean -> struck (fracture star) -> a dark pool welling.
       -> POLYPHEMUS, the colossal one-eyed brute right of centre: contempt
          erupting into predatory violence (poly_brutal), then, sated, slumping
          into satiated sleep (poly_sleep), single eye shut, among his beasts.
       -> the TWO SEIZED SAILORS caught in his fist, dead centre and lifted off
          the ground: grabbed -> slammed (impact) -> hanging lifeless.
       -> ODYSSEUS, foreground left, human-small against the giant: pleading the
          survivor's claim and the lie of the wrecked ship, then bowed in grief
          and horror as the crew prays.
       -> the TERRIFIED SAILORS huddled in the front, frozen witnesses recoiling
          from the wrath, hands flung up, eyes on the sealed cave mouth.
   The claim, the mockery, the lie, the seizing-and-dashing, and the sated sleep —
   all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import caveFloor from "../assets/set_piece/cave-floor-and-blood-state.mjs";
import polyphemus from "../assets/character/polyphemus.mjs";
import seizedSailors from "../assets/character/two-seized-sailors.mjs";
import odysseus from "../assets/character/odysseus.mjs";
import terrifiedSailors from "../assets/ensemble/terrified-sailors.mjs";

export const scene = {
  id:"OD-B09-S07",
  title:"The First Killings",
  book:1,
  beats:[
    "Odysseus claims they are survivors of Agamemnon's fleet and invokes Zeus's protection of strangers.",
    "Polyphemus mocks the gods and demands to know where the ship is.",
    "Odysseus lies that Poseidon smashed it against the rocks.",
    "The Cyclops seizes two men, smashes them on the floor, and devours them raw.",
    "He drinks milk and sleeps among his animals while the survivors pray in horror.",
  ],
  exitState:"He drinks milk and sleeps among his animals while the survivors pray in horror.",
  duration:42,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the full-bleed set: dark cavern walls, receding flagstone ground, and the
    // killing carried on the same stone (its phase driven off the master clock)
    { asset:"set_piece.cave-floor-and-blood-state", instance:"cave_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // POLYPHEMUS, colossal one-eyed brute, right of centre: casual contempt
    // erupting into predatory violence, then slumping sated into sleep
    { asset:"character.polyphemus", instance:"polyphemus_01",
      anchor:{x:.66,y:1.00}, scale:.92, pose:"poly_brutal", band:"front",
      gaze:{x:-.20,y:-.02} },

    // the TWO SEIZED SAILORS caught in the giant's fist, lifted off the ground
    // in his grasp: grabbed -> slammed -> lifeless (variant driven off the clock)
    { asset:"character.two-seized-sailors", instance:"seized_01",
      anchor:{x:.545,y:.60}, scale:.44, pose:"grabbed" },

    // ODYSSEUS, foreground left, human-small: pleading the survivor's claim and
    // the lie of the wrecked ship, then bowed in grief as the crew prays
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.275,y:.99}, scale:.44, pose:"speaking", band:"threeq",
      gaze:{x:.42,y:-.10} },

    // the TERRIFIED SAILORS huddled in the front: frozen witnesses recoiling,
    // hands flung up, eyes tracking the sealed cave mouth
    { asset:"ensemble.terrified-sailors", instance:"crew_01",
      anchor:{x:.46,y:1.00}, scale:.60 },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus pleads the survivor's claim and invokes Zeus of strangers
    { op:"actor.pose", target:"odysseus_01",   at:0.0,  args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01",   at:0.0,  args:{ gaze:{x:.42,y:-.10} } },
    // beat 2: the Cyclops mocks the gods and demands where the ship is —
    // contempt already curling toward violence, the single eye glaring down
    { op:"actor.pose", target:"polyphemus_01", at:2.0,  args:{ pose:"poly_brutal" } },
    // beat 3: Odysseus lies that Poseidon smashed the ship on the rocks
    { op:"actor.gaze", target:"odysseus_01",   at:4.0,  args:{ gaze:{x:.36,y:.04} } },
    // beat 4: the brute seizes two men and dashes them on the floor — the stone
    // is struck, then a dark pool wells; the victims go from grabbed to lifeless
    { op:"actor.pose", target:"polyphemus_01", at:6.0,  args:{ pose:"poly_brutal" } },
    // beat 5 (exit): sated, he slumps into sleep among his beasts, eye shut, while
    // Odysseus and the crew bow, praying in horror over the blood-stained stone
    { op:"actor.pose", target:"odysseus_01",   at:26.0, args:{ pose:"grieving" } },
    { op:"actor.gaze", target:"odysseus_01",   at:26.0, args:{ gaze:{x:0,y:.5} } },
    { op:"actor.pose", target:"polyphemus_01", at:32.0, args:{ pose:"poly_sleep" } },
    { op:"actor.gaze", target:"polyphemus_01", at:32.0, args:{ gaze:{x:0,y:.2} } },
    { op:"timeline.capture", target:"OD-B09-S07", at:40.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the cave set, the giant, the seized victims in his grip,
     Odysseus, then the terrified crew huddled in the foreground. Character poses
     fold from the timeline; the set's blood-phase and the victims' variant are
     stepped deterministically off the same clock. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the same stone carries the escalating event: bare -> struck -> welling pool
    const floorPhase = t < 6 ? "clean" : t < 10 ? "impact" : "blood";
    // the victims: caught -> slammed on the floor -> hanging lifeless
    const seizedVariant = t < 6 ? "grabbed" : t < 12 ? "impact" : "lifeless";
    // Polyphemus's single eye tracks his pose: glaring in the rage, shut in sleep
    const polyPose = (st.polyphemus_01 && st.polyphemus_01.pose) || "poly_brutal";
    const polyEye  = polyPose === "poly_sleep" ? "shut" : "glare";

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "cave_01"){
        mod = caveFloor;
        // the full set at the current event phase; walls+floor+flags+rubble+event
        state = { phase:floorPhase,
                  layers:["walls","floor","flags","rubble","event"] };

      } else if (c.instance === "seized_01"){
        mod = seizedSailors;
        state = { variant:seizedVariant };

      } else if (c.instance === "crew_01"){
        mod = terrifiedSailors;
        // frozen witnesses in the cave: drop the overhead Zeus bolt/rays (this is
        // the sealed cavern, not open sky) but keep the sealed exit — the boulder
        // that shut the cave mouth — on the left, away from the giant
        state = { terror:0.92, wave:1.0, waveLag:0.35, attention:0.55,
                  formation:"recoil-cluster", exitSide:-1,
                  showZeus:false, showRays:false, showExit:true };

      } else if (c.instance === "polyphemus_01"){
        mod = polyphemus;
        state = { t:0.5, band:s.band || c.band, pose:polyPose,
                  eye:polyEye, gaze:s.gaze || c.gaze };

      } else {
        // Odysseus: fold pose/gaze/band from the timeline
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
