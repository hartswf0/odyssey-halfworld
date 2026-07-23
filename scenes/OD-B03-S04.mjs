/* ============================================================
   SCENE  OD-B03-S04 — Orestes as the Measure
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Nestor tells how Aegisthus murdered Agamemnon and how Orestes later
        took revenge — the remembered parable he holds up.
     2. He urges Telemachus to become a son whose deed will be sung.
     3. Telemachus wishes for the power to punish the suitors but doubts the
        gods will grant it.
     4. Athena, as Mentor, rebukes his despair — a willing god can save a mortal.

   Stage layout (back -> front):
     Nestor's palace + courtyard at Pylos (full-frame backdrop)
       -> the Orestes/Aegisthus revenge tableau, conjured as a memory panel to
          the right (the measure Nestor keeps re-lighting)
       -> Nestor, foreground left, warning finger raised over the parable
       -> Telemachus, mid-ground, wishing then doubting
       -> Athena as Mentor, near-right, rebuking his despair (exit state).
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace      from "../assets/location/nestors-palace-and-courtyard.mjs";
import memory      from "../assets/divine_fx/orestes-and-aegisthus-memory-tableau.mjs";
import nestor      from "../assets/character/nestor.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import athena      from "../assets/character/athena-as-mentor.mjs";

export const scene = {
  id:"OD-B03-S04",
  title:"Orestes as the Measure",
  book:1,
  beats:[
    "Nestor tells how Aegisthus murdered Agamemnon and how Orestes later took revenge.",
    "He urges Telemachus to become a son whose deed will be sung.",
    "Telemachus wishes for the power to punish the suitors but doubts the gods will grant it.",
    "Athena rebukes his despair and insists a willing god can save a mortal.",
  ],
  exitState:"Athena rebukes his despair and insists a willing god can save a mortal.",
  duration:30,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // Pylos: Nestor's palace and courtyard hold the whole scene
    { asset:"location.nestors-palace-and-courtyard", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"morning-prep" },

    // the revenge parable itself — conjured to the right as the remembered
    // measure Nestor keeps re-lighting for the prince
    { asset:"divine_fx.orestes-and-aegisthus-memory-tableau", instance:"memory_01",
      anchor:{x:.815,y:1.00}, scale:.56, pose:"tableau" },

    // Nestor, foreground left: the storyteller turning to a raised warning
    { asset:"character.nestor", instance:"nestor_01",
      anchor:{x:.155,y:.995}, scale:.62, pose:"nestor_telling",
      gaze:{x:.34,y:-.42}, band:"threeq" },

    // Telemachus, mid-ground: absorbing the lesson, wishing, then doubting
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.355,y:1.00}, scale:.52, pose:"lean_forward",
      gaze:{x:.10,y:-.05}, band:"threeq" },

    // Athena as Mentor, near-right: the rebuke of despair — the exit state
    { asset:"character.athena-as-mentor", instance:"athena_01",
      anchor:{x:.520,y:1.00}, scale:.54, pose:"mentor_still",
      gaze:{x:-.22,y:0}, band:"threeq" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 1: the memory opens; Nestor's hand rises to a warning over the deed
    { op:"fx.play",    target:"memory_01",       at:1.0,  args:{} },
    { op:"actor.pose", target:"nestor_01",       at:3.0,  args:{ pose:"nestor_warning" } },
    { op:"actor.gaze", target:"nestor_01",       at:3.0,  args:{ gaze:{x:.18,y:-.06} } },

    // beat 3: the prince wishes for the power to punish the suitors...
    { op:"actor.pose", target:"telemachus_01",   at:12.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus_01",   at:12.0, args:{ gaze:{x:.32,y:-.06} } },
    // ...then doubts the gods will grant it
    { op:"actor.pose", target:"telemachus_01",   at:17.0, args:{ pose:"skepticism" } },
    { op:"actor.gaze", target:"telemachus_01",   at:17.0, args:{ gaze:{x:-.24,y:0} } },

    // beat 4: Athena rebukes the despair — a willing god can save a mortal
    { op:"actor.pose", target:"athena_01",       at:22.0, args:{ pose:"mentor_command" } },
    { op:"actor.gaze", target:"athena_01",       at:22.0, args:{ gaze:{x:-.16,y:-.02} } },

    { op:"timeline.capture", target:"OD-B03-S04", at:29.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: palace backdrop, the memory panel, then the three figures. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the memory sweeps murder -> return -> repayment, and settles emphatic on
    // the REPAYMENT cell (Orestes' vengeance = the measure) as the scene closes
    const memT = 0.6 + t * 0.18;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "palace_01"){
        mod = palace;
        state = {}; // full courtyard, its own preview layers
      } else if (c.instance === "memory_01"){
        mod = memory;
        // all three cells present; late in the scene bias the glow onto
        // REPAYMENT so the vengeance-as-model lands with the exit
        const late = clamp01((t - 18) / 8);
        state = { t:memT,
                  glow:[ lerp(0.72,0.55,late), lerp(0.60,0.55,late), lerp(0.72,1.0,late) ],
                  layers:["thread","murder","return","repayment"] };
      } else {
        // named figures: fold pose/gaze/band from the timeline
        mod = c.instance === "nestor_01" ? nestor
            : c.instance === "telemachus_01" ? telemachus
            : athena;
        state = { t:t*0.5, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
