/* ============================================================
   SCENE  OD-B11-S02 — Elpenor Asks for Burial
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Elpenor's unburied ghost approaches first and Odysseus weeps in recognition.
     2. The shade explains his roof fall and begs for funeral rites on Aeaea.
     3. He asks that his oar be planted over the mound as a sign of his life.
     4. Odysseus promises to perform the burial after returning from the dead.

   Stage layout (back -> front, one master clock):
     THE BLOOD-PIT BOUNDARY fills the whole field — the dug ritual trench with
     blood in the pit, the massed waiting dead pressing on the far side, and the
     sword-scored ward line that keeps the living speaker apart from them.
       -> ELPENOR'S OAR set on a small barrow at the right as a grave-marker: the
          sign of his life he begs be planted over his mound on Aeaea.
       -> ELPENOR'S SHADE risen first at the pit, pale and half-there, pitched
          forward out of the dark — bewildered, then speaking his fall, then both
          hands imploring for burial and for his oar.
       -> ODYSSEUS on the near living ground, weeping in recognition, then lifting
          an open vowing palm as he promises the rites once he returns from the dead.
   The recognition, the plea, the named oar and the promise — all on one clock.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import pit from "../assets/set_piece/blood-pit-boundary.mjs";
import oar from "../assets/prop/elpenors-oar.mjs";
import shade from "../assets/character/elpenors-shade.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B11-S02",
  title:"Elpenor Asks for Burial",
  book:1,
  beats:[
    "Elpenor's unburied ghost approaches first and Odysseus weeps in recognition.",
    "The shade explains his roof fall and begs for funeral rites on Aeaea.",
    "He asks that his oar be planted over the mound as a sign of his life.",
    "Odysseus promises to perform the burial after returning from the dead.",
  ],
  exitState:"Odysseus promises to perform the burial after returning from the dead.",
  duration:28,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // BLOOD-PIT BOUNDARY — full-field backdrop: the trench with blood, the
    // waiting dead on the far side, and the sword-scored ward line dividing the
    // living speaker from them.
    { asset:"set_piece.blood-pit-boundary", instance:"pit_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // ELPENOR'S OAR — a small barrow at the right, the oar set as a grave-marker:
    // the sign of his life he asks be planted over his mound.
    { asset:"prop.elpenors-oar", instance:"oar_01",
      anchor:{x:.83,y:.98}, scale:.46 },

    // ELPENOR'S SHADE — risen first at the pit edge, pale and half-there: he
    // approaches bewildered, speaks his fall, then implores with both hands.
    { asset:"character.elpenors-shade", instance:"shade_01",
      anchor:{x:.28,y:.88}, scale:.58, pose:"shade_bewildered", band:"front",
      gaze:{x:.22,y:-.04} },

    // ODYSSEUS — near living ground, weeping in recognition, then vowing the
    // burial with an open petitioning palm.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.66,y:1.00}, scale:.54, pose:"grief", band:"front",
      gaze:{x:-.30,y:.34} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the ghost comes first and Odysseus weeps in recognition
    { op:"actor.pose", target:"shade_01",    at:0.0,  args:{ pose:"shade_bewildered" } },
    { op:"actor.gaze", target:"shade_01",    at:0.0,  args:{ gaze:{x:.22,y:-.04} } },
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.30,y:.34} } },
    // beat 2: the shade explains his roof fall and begs for funeral rites
    { op:"actor.pose", target:"shade_01",    at:7.0,  args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"shade_01",    at:7.0,  args:{ gaze:{x:.10,y:-.14} } },
    // beat 3: he asks his oar be planted over the mound as a sign of his life
    { op:"actor.pose", target:"shade_01",    at:14.0, args:{ pose:"shade_implore" } },
    { op:"actor.gaze", target:"shade_01",    at:14.0, args:{ gaze:{x:.05,y:-.28} } },
    // beat 4 (exit): Odysseus promises the burial after returning from the dead —
    // grief lifts into an open vowing palm turned to the shade
    { op:"actor.pose", target:"odysseus_01", at:21.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01", at:21.0, args:{ gaze:{x:-.28,y:-.02} } },
    { op:"timeline.capture", target:"OD-B11-S02", at:27.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the blood-pit backdrop, the oar grave-marker, the shade, then
     Odysseus on the near ground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "pit_01"){
        mod = pit;
        // the trench full of blood, the dead pressing, the ward line holding them
        // back from the living speaker.
        state = { phase:"filled",
                  layers:["ground","deadside","trench","blood","boundary"],
                  status:"WARDED", progress:.55 };

      } else if (c.instance === "oar_01"){
        mod = oar;
        // set as a grave-marker on a small barrow — the sign of his life he asks
        // be planted (bound, with a name-tablet).
        state = { mode:"grave-marker", t:0, status:"GRAVE-MARKER", progress:.66 };

      } else if (c.instance === "shade_01"){
        mod = shade;
        // pale, half-there; fold pose/gaze from the timeline and add the matching
        // pleading face channels for the active beat.
        state = { t:0.5, band:s.band || c.band, pose:s.pose || c.pose,
                  gaze:s.gaze || c.gaze, ghostAlpha:0.52 };
        const p = state.pose;
        if (p === "reach_forward"){        // speaking his fall + begging rites
          state.browUp=.6; state.browKnit=.24; state.eyeWide=.32; state.jaw=.56;
        } else if (p === "shade_implore"){ // both hands imploring for the oar
          state.browUp=.85; state.browKnit=.34; state.eyeWide=.55; state.jaw=.34;
          state.frown=.22;
        } else {                            // bewildered approach
          state.browUp=.7; state.browKnit=.46; state.eyeWide=.42; state.jaw=.2;
          state.mouthAsym=.34;
        }

      } else { // odysseus_01
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band, pose:s.pose || c.pose,
                  gaze:s.gaze || c.gaze };
        const vowing = (s.pose === "offering_hand");
        if (vowing){                        // the promise — solemn, brows lifted
          state.browUp=.3; state.browKnit=.16; state.smile=0; state.eyeNarrow=.06;
        } else {                            // weeping in recognition
          state.frown=.6; state.browKnit=.5; state.browUp=.4; state.eyeNarrow=.2;
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
