/* ============================================================
   SCENE  OD-B10-S08 — The Road to the Dead
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus asks Circe to honor her promise of homeward passage.
     2. She says he must first consult Tiresias in the land of the dead.
     3. Circe gives directions to Ocean's edge and the ritual for summoning spirits.
     4. Elpenor, sleeping on the roof, wakes confused, falls, and dies unnoticed.
     5. The crew launches in grief while Circe sends a favorable wind.

   Stage layout (back -> front, one master clock):
     CIRCE'S SAILING WIND fills the RIGHT of the field as the departure the whole
     instruction points toward — the pale sky, the driven sea, the black ship's
     belled sail and the dark edge of the world ahead (its own headland-Circe
     'source' layer dropped; the real Circe stands in that role).
       -> the UNDERWORLD ROUTE INSTRUCTIONS, a charted panel on the LEFT-centre:
          Ocean's stream, Persephone's grove, the meeting of the three rivers and
          the ritual trench — the road Circe describes, lighting leg by leg.
       -> ELPENOR mid-air between them, pitched off the roof, arms flung up on a
          last startled cry: the hapless death that goes unnoticed in the launch.
       -> CIRCE at the far left, guiding — one hand carrying the road, pointing
          Odysseus down toward the dead.
       -> ODYSSEUS centre-foreground, turned to her with an open petitioning palm,
          asking first for passage home and receiving the darker road instead.
   The plea, the sentence to the dead, the charted road, Elpenor's fall and the
   grieving launch on Circe's wind — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import circe from "../assets/character/circe.mjs";
import odysseus from "../assets/character/odysseus.mjs";
import elpenor from "../assets/character/elpenor.mjs";
import route from "../assets/set_piece/underworld-route-instructions.mjs";
import wind from "../assets/divine_fx/circes-sailing-wind.mjs";

export const scene = {
  id:"OD-B10-S08",
  title:"The Road to the Dead",
  book:1,
  beats:[
    "Odysseus asks Circe to honor her promise of homeward passage.",
    "She says he must first consult Tiresias in the land of the dead.",
    "Circe gives directions to Ocean's edge and the ritual for summoning spirits.",
    "Elpenor, sleeping on the roof, wakes confused, falls, and dies unnoticed.",
    "The crew launches in grief while Circe sends a favorable wind.",
  ],
  exitState:"The crew launches in grief while Circe sends a favorable wind.",
  duration:30,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // CIRCE'S SAILING WIND — the RIGHT-hand backdrop: the departure the whole
    // instruction bends toward. Sky, driven sea, the black ship's belled sail and
    // the dark rim of the world. Its own headland-Circe 'source' layer is dropped
    // (the real Circe below plays that part).
    { asset:"divine_fx.circes-sailing-wind", instance:"wind_01",
      anchor:{x:.76,y:1.00}, scale:.66 },

    // UNDERWORLD ROUTE INSTRUCTIONS — the charted panel on the left-centre: the
    // road to the dead Circe lays out (Ocean, grove, rivers' meeting, trench).
    { asset:"set_piece.underworld-route-instructions", instance:"route_01",
      anchor:{x:.34,y:.92}, scale:.60 },

    // ELPENOR — pitched off the roof mid-air between chart and sea, arms flung up
    // on a last startled cry; the death that passes unnoticed in the launch.
    { asset:"character.elpenor", instance:"elpenor_01",
      anchor:{x:.60,y:.52}, scale:.30, pose:"elpenor_fall", band:"front" },

    // CIRCE — far left foreground, guiding: carrying the road, pointing Odysseus
    // down to the dead.
    { asset:"character.circe", instance:"circe_01",
      anchor:{x:.15,y:1.00}, scale:.50, pose:"circe_guide", band:"front",
      gaze:{x:.34,y:.05} },

    // ODYSSEUS — centre-foreground, turned to Circe with an open petitioning palm:
    // asking for passage home, given the darker road.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.47,y:1.00}, scale:.48, pose:"offering_hand", band:"front",
      gaze:{x:-.34,y:-.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus petitions Circe for the homeward passage she promised —
    // open palm, turned to her
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.34,y:-.02} } },
    // beat 2 + 3: Circe answers — first the dead, then the road; she takes the
    // guiding stance and points the way (pose held from the cast default)
    { op:"actor.pose", target:"circe_01",    at:6.0,  args:{ pose:"circe_guide" } },
    { op:"actor.gaze", target:"circe_01",    at:6.0,  args:{ gaze:{x:.34,y:.05} } },
    // beat 4: Elpenor, startled from the roof, misses his footing and falls
    { op:"actor.pose", target:"elpenor_01",  at:16.0, args:{ pose:"elpenor_fall" } },
    // Odysseus, learning the road runs through the dead, turns from petition to
    // a heavier, downcast look as the launch is prepared
    { op:"actor.gaze", target:"odysseus_01", at:18.0, args:{ gaze:{x:-.10,y:.14} } },
    // beat 5 (exit): the crew launches in grief while Circe sends a favorable wind
    { op:"fx.play",    target:"wind_01",     at:22.0, args:{} },
    { op:"timeline.capture", target:"OD-B10-S08", at:29.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the sailing-wind departure backdrop, the charted road panel,
     the falling Elpenor, then Circe and Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "wind_01"){
        mod = wind;
        // the departure the instruction points toward. The wind is Circe's gift:
        // it gathers once the crew launches (fx.play at 22.0) but the black ship
        // and dark rim read across the whole scene. Drop the FX's own headland
        // Circe ('source') — the real Circe stands in that role at the left.
        const wt = (s.fxT != null) ? s.fxT : Math.max(0, t - 22.0);
        const inten = 0.72 + 0.55 * Math.min(1, wt / 6);
        state = { t, intensity:inten, belly:0.9 + 0.25 * Math.min(1, wt / 6),
                  layers:["sky","rim","field","sea","hull","sail"] };

      } else if (c.instance === "route_01"){
        mod = route;
        // Circe charts the road leg by leg: Ocean -> grove -> rivers -> trench,
        // then the return path lights for the way back to the ship.
        const lit = t < 8 ? 1 : t < 14 ? 2 : 3;
        state = { t, lit, blood:0.55, showReturn: t >= 18, status:"CHARTED", progress:.9,
                  layers:["ground","ocean","graticule","frame","rivers","route",
                          "return","pip","grove","trench","nodes","labels"] };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale. Emotion channels ride on the pose so each reads clearly.
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };

        if (c.instance === "circe_01"){
          mod = circe;
          // guiding: the wand-hand carries the road she points down to the dead
          state.wandHand = "R"; state.wandLen = .28;
          state.browUp = .16; state.mouthAsym = .1;

        } else if (c.instance === "odysseus_01"){
          mod = odysseus;
          // petition -> the weight of the answer: brows lifted, gaze slid to Circe
          const g = null; // (no-op guard)
          const grieved = t >= 18;
          state.browUp = grieved ? .42 : .28;
          state.browKnit = grieved ? .4 : .08;
          state.smile = grieved ? 0 : .14;
          state.eyeNarrow = grieved ? .2 : 0;

        } else { // elpenor_01
          mod = elpenor;
          // the fall — eyes snapped wide, brows shot up, mouth open on a last cry
          state.eyeWide = .95; state.browUp = 1; state.jaw = .66; state.blink = 0;
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
