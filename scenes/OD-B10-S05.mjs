/* ============================================================
   SCENE  OD-B10-S05 — Hermes Gives the Moly
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus arms himself and heads alone toward Circe's house despite
        Eurylochus's protest.
     2. Hermes meets him in the form of a young man and explains Circe's trap.
     3. He pulls the black-rooted, white-flowered moly from the earth and gives
        it to Odysseus.
     4. Hermes instructs him to resist the drug, draw his sword, and force Circe
        to swear an oath.

   Stage layout (back -> front, one master clock):
     FOREST MEETING PATH, full bleed — the narrow transitional route between the
     ship camp (near threshold, bottom) and Circe's palace (lit notch in the far
     treeline, top). The marked hidden divine-arrival spot sits just off the path
     at mid depth: this is where the god appears.
       -> the MOLY PLANT, staged on the arrival spot as a standalone diagram of
          the gift: rooted at first (in the earth), then uprooted (divinely
          pulled) as the god draws it, then held/offered — its milk-white bloom
          and black root the two-tone identity the beat turns on.
       -> ODYSSEUS, striding up the path from the camp, then halted mid-path to
          face the youth: gaze meeting Hermes, taking in the herb and the plan.
       -> HERMES AS A YOUNG MAN, standing on the path a step above Odysseus — the
          friendly roadside guide who reveals Circe's trap, pulls and offers the
          moly, then lays out the tactic: resist the drug, draw the sword, force
          the oath.
   The lone approach, the divine meeting, the pulled-and-given herb, and the
   whispered plan — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import forestPath from "../assets/location/forest-meeting-path.mjs";
import molyPlant  from "../assets/prop/moly-plant.mjs";
import odysseus   from "../assets/character/odysseus.mjs";
import hermes     from "../assets/character/hermes-as-young-man.mjs";

export const scene = {
  id:"OD-B10-S05",
  title:"Hermes Gives the Moly",
  book:1,
  beats:[
    "Odysseus arms himself and heads alone toward Circe's house despite Eurylochus's protest.",
    "Hermes meets him in the form of a young man and explains Circe's trap.",
    "He pulls the black-rooted, white-flowered moly from the earth and gives it to Odysseus.",
    "Hermes instructs him to resist the drug, draw his sword, and force Circe to swear an oath.",
  ],
  exitState:"Hermes instructs him to resist the drug, draw his sword, and force Circe to swear an oath.",
  duration:32,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // FOREST MEETING PATH — full bleed backdrop: the narrow route between camp
    // and palace with the marked hidden divine-arrival spot off the path
    { asset:"location.forest-meeting-path", instance:"path_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // THE MOLY PLANT — staged on the arrival spot as the diagram of the gift.
    // Starts rooted in the earth, then uprooted (divinely pulled), then offered.
    { asset:"prop.moly-plant", instance:"moly_01",
      anchor:{x:.50,y:.70}, scale:.24, pose:"rooted" },

    // ODYSSEUS — striding up from the camp, then halted mid-path to face the
    // youth and take in the herb and the plan
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.62,y:.92}, scale:.52, pose:"striding", band:"threeq",
      gaze:{x:-.28,y:-.06} },

    // HERMES AS A YOUNG MAN — the roadside guide a step up the path: reveals the
    // trap, pulls and offers the moly, then lays out the tactic
    { asset:"character.hermes-as-young-man", instance:"hermes_01",
      anchor:{x:.40,y:.78}, scale:.50, pose:"offering_hand", band:"threeq",
      gaze:{x:.24,y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus arms himself and heads alone up the path despite protest
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"striding" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:.10,y:-.02} } },
    // beat 2: Hermes meets him and explains Circe's trap — halts, meets the god,
    // Hermes leans in mid-explanation
    { op:"actor.pose", target:"odysseus_01", at:7.0,  args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus_01", at:7.0,  args:{ gaze:{x:-.28,y:-.06} } },
    { op:"actor.pose", target:"hermes_01",   at:7.0,  args:{ pose:"revealing" } },
    // beat 3: he pulls the moly from the earth and gives it — the plant lifts
    // from the soil (uprooted) and passes to the offered hand (held)
    { op:"actor.pose", target:"moly_01",     at:13.0, args:{ pose:"uprooted" } },
    { op:"actor.pose", target:"hermes_01",   at:15.0, args:{ pose:"guiding" } },
    { op:"actor.pose", target:"moly_01",     at:18.0, args:{ pose:"held" } },
    // beat 4 (exit): Hermes lays out the tactic — resist, draw, force the oath
    { op:"actor.pose", target:"hermes_01",   at:24.0, args:{ pose:"instructing" } },
    { op:"actor.gaze", target:"hermes_01",   at:24.0, args:{ gaze:{x:-.40,y:0} } },
    { op:"actor.gaze", target:"odysseus_01", at:24.0, args:{ gaze:{x:-.24,y:-.02} } },
    { op:"timeline.capture", target:"OD-B10-S05", at:31.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the forest meeting path, the moly plant on the arrival spot,
     then Odysseus and Hermes facing each other on the path. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "path_01"){
        mod = forestPath;
        // the empty navigable set with the divine-arrival mark showing
        state = forestPath.preview();

      } else if (c.instance === "moly_01"){
        mod = molyPlant;
        // the gift as a standalone diagram; the pose channel maps to the
        // plant's `mode` state machine (rooted -> uprooted -> held)
        state = { mode:s.pose || c.pose, t };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "hermes_01") ? hermes : odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
