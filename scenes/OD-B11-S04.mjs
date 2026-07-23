/* ============================================================
   SCENE  OD-B11-S04 — Anticleia and the Three Embraces
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus permits his mother Anticleia to drink and she recognizes him.
     2. She describes Penelope's fidelity, Telemachus's position, and Laertes's
        isolated grief.
     3. She reveals that longing for Odysseus, not disease, caused her death.
     4. Odysseus tries three times to embrace her, but his arms pass through the
        shade.

   Stage layout (back -> front, one master clock), read LEFT -> RIGHT as the
   scene's causal arc:
     ITHACA FAMILY MEMORY fills the whole field as a faint recollection — the
     three domestic fragments she names (Penelope at the loom, Telemachus at the
     feast, Laertes on his farm), floating far off behind everything.
       -> ODYSSEUS at the LEFT foreground, arms opening toward his mother: he has
          let her drink, known her, and now reaches to hold her, gaze fixed right.
       -> ANTICLEIA'S SHADE at CENTRE, whole and speaking: the recognized mother
          telling him the truths of home and then that longing for him, not
          disease, was her death — pose moving neutral -> speaking -> grieving.
       -> the INTANGIBLE EMBRACE EFFECT at the RIGHT: the SAME mother coming apart
          into rising wisps as the living arms close through her, tallied by the
          three attempt-markers — beat 4, the contact that cannot hold.
   Anticleia stands twice on one clock ON PURPOSE: present-in-word at centre, and
   absent-in-body at right — she is both there to be heard and impossible to hold,
   which is the whole grief of the scene. The memory of home behind, Odysseus
   reaching across it, the mother speaking, the mother dispersing: one still.

   Exit / continuity: Odysseus tries three times to embrace her, but his arms pass
   through the shade.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import anticleia from "../assets/character/anticleias-shade.mjs";
import odysseus from "../assets/character/odysseus.mjs";
import embrace from "../assets/divine_fx/intangible-embrace-effect.mjs";
import memory from "../assets/divine_fx/ithaca-family-memory.mjs";

export const scene = {
  id:"OD-B11-S04",
  title:"Anticleia and the Three Embraces",
  book:1,
  beats:[
    "Odysseus permits his mother Anticleia to drink and she recognizes him.",
    "She describes Penelope's fidelity, Telemachus's position, and Laertes's isolated grief.",
    "She reveals that longing for Odysseus, not disease, caused her death.",
    "Odysseus tries three times to embrace her, but his arms pass through the shade.",
  ],
  exitState:"Odysseus tries three times to embrace her, but his arms pass through the shade.",
  duration:34,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // ITHACA FAMILY MEMORY — the faint full-frame backdrop: the domestic truths
    // she names, recalled from far off (Penelope's loom, Telemachus's feast,
    // Laertes's farm). Kept low + misted so it sits behind the figures.
    { asset:"divine-fx.ithaca-family-memory", instance:"memory_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // ODYSSEUS — LEFT foreground: having let her drink and known her, he opens his
    // arms toward his mother, gaze fixed right on her face.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.205,y:1.00}, scale:.62, pose:"offering_hand", band:"front",
      gaze:{x:.34,y:-.02} },

    // ANTICLEIA'S SHADE — CENTRE, whole and speaking: the recognized mother, veiled,
    // her lower body trailing into wisps, telling him of home and her death.
    { asset:"character.anticleias-shade", instance:"anticleia_01",
      anchor:{x:.50,y:.995}, scale:.80, pose:"anticleia_calm", band:"front",
      gaze:{x:-.10,y:.06} },

    // INTANGIBLE EMBRACE EFFECT — RIGHT: the same mother dispersing into rising
    // wisps as the living arms close through her, three attempts tallied. Its own
    // dim FIELD layer is dropped so the memory backdrop and the single scene floor
    // read through — the effect contributes the shade-that-will-not-be-held.
    { asset:"divine-fx.intangible-embrace-effect", instance:"embrace_01",
      anchor:{x:.775,y:1.00}, scale:.66 },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus lets her drink and knows her — hand offered toward her, gaze
    // to her face (pose held from the cast default)
    { op:"actor.pose", target:"odysseus_01",  at:0.0,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01",  at:0.0,  args:{ gaze:{x:.34,y:-.02} } },
    // beat 2: she speaks the truths of home — Penelope, Telemachus, Laertes
    { op:"actor.pose", target:"anticleia_01", at:7.0,  args:{ pose:"anticleia_speak" } },
    { op:"actor.gaze", target:"anticleia_01", at:7.0,  args:{ gaze:{x:-.08,y:0} } },
    // beat 3: she reveals that longing for him, not disease, was her death
    { op:"actor.pose", target:"anticleia_01", at:15.0, args:{ pose:"anticleia_grieve" } },
    { op:"actor.gaze", target:"anticleia_01", at:15.0, args:{ gaze:{x:.04,y:.42} } },
    // beat 4 (exit): Odysseus opens both arms to embrace her; the shade disperses
    // and his arms pass through — three times
    { op:"actor.pose", target:"odysseus_01",  at:23.0, args:{ pose:"arms_open" } },
    { op:"fx.play",    target:"embrace_01",   at:23.0, args:{} },
    { op:"timeline.capture", target:"OD-B11-S04", at:33.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the faint memory backdrop, Odysseus reaching, the whole mother
     speaking, then the dispersing embrace on the right. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "memory_01"){
        mod = memory;
        // the mind sweeps her three named loved ones in turn over the scene; kept
        // misted so the whole field stays a faint recollection behind the figures.
        state = { t: t*0.20, mist:0.30, status:"YEARNING", progress:0.5,
                  layers:["thread","penelope","telemachus","laertes","mist"] };

      } else if (c.instance === "embrace_01"){
        mod = embrace;
        // the three embraces. Drive the internal attempt-cycle from the scene clock
        // once Odysseus reaches (fx.play at 23.0); before that it holds the neutral
        // dispersing money-shot so the ungraspable mother reads across the whole
        // still. Field dropped (the scene has its own backdrop + floor).
        const ft = (s.fxT != null) ? s.fxT : 0;
        const reaching = t >= 23.0;
        // walk attempts 1 -> 2 -> 3 across the reach; one grasp/dispersal cycle each
        const cyc = reaching ? Math.min(2.999, ft / 2.6) : 0.42;
        const attempt = reaching ? Math.min(3, 1 + Math.floor(ft / 2.6)) : 2;
        const phase = reaching ? (cyc - Math.floor(cyc)) : 0.42;
        state = { t:phase, attempt, intensity:1.0,
                  status:"UNGRASPED", progress: scene.duration ? t/scene.duration : .5,
                  layers:["shade","wisps","arms","markers"] };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns the
        // anchor/scale. Emotion channels ride on the pose so each beat reads clearly.
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };

        if (c.instance === "odysseus_01"){
          mod = odysseus;
          // recognition -> the reach: brows lift with grief as he opens his arms to
          // hold the mother he cannot hold.
          const reaching = t >= 23.0;
          state.browUp   = reaching ? .5  : .3;
          state.browKnit = reaching ? .5  : .12;
          state.frown    = reaching ? .35 : .08;
          state.eyeNarrow= reaching ? .18 : 0;
          state.smile    = 0;

        } else { // anticleia_01 — the whole, speaking mother
          mod = anticleia;
          // her pose already carries the grief/tenderness channels; add a parted jaw
          // while she speaks so beat 2 reads as speech.
          const speaking = t >= 7.0 && t < 15.0;
          if (speaking){ state.jaw = .4; state.mouth = .4; }
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
