/* ============================================================
   SCENE  OD-B11-S07 — Achilles Chooses Life in Retrospect
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Achilles approaches with Patroclus, Antilochus, and Ajax nearby.
     2. Odysseus praises his honor among the dead, but Achilles rejects death's glory.
     3. He asks about Peleus and Neoptolemus.
     4. Odysseus recounts Neoptolemus's courage at Troy; Achilles strides away rejoicing.
     5. Ajax alone refuses reconciliation and withdraws in silence.

   Stage layout (back -> front, one master clock):
     the CIMMERIAN SHORE + UNDERWORLD PIT holds the whole sunless field — the
     dead sea, the grove, the trench where the blood was poured and the shades
     throng.
       -> the NEOPTOLEMUS-AT-TROY MEMORY rises glowing at upper-right: the four
          proud memory-cells (council, horse, combat, departure) that Odysseus's
          telling calls up, and that flare Achilles back to pride.
       -> PATROCLUS & ANTILOCHUS, the pale honor guard, flank the center where
          Achilles arrives — silent attendance on either side.
       -> AJAX's shade, a huge hulking armored figure at the far left, refusing:
          the eloquent silence, back half-turned, that will withdraw unanswered.
       -> ACHILLES's shade centre-left: approaching in regret, rejecting the
          glory of the dead, then REVIVED by his son's fame and striding off proud.
       -> ODYSSEUS centre-foreground right, turned in to the pit, first praising
          Achilles, then recounting Neoptolemus's courage at Troy.
   The praise, the rejection of death's glory, the question after son and father,
   the proud memory of Neoptolemus, Achilles's rejoicing stride and Ajax's
   silent refusal — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import shore from "/assets/location/cimmerian-shore-and-underworld-pit.mjs";
import memory from "/assets/divine_fx/neoptolemus-at-troy-memory.mjs";
import guard from "/assets/character/patroclus-and-antilochus.mjs";
import ajax from "/assets/character/ajaxs-shade.mjs";
import achilles from "/assets/character/achilless-shade.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B11-S07",
  title:"Achilles Chooses Life in Retrospect",
  book:1,
  beats:[
    "Achilles approaches with Patroclus, Antilochus, and Ajax nearby.",
    "Odysseus praises his honor among the dead, but Achilles rejects death's glory.",
    "He asks about Peleus and Neoptolemus.",
    "Odysseus recounts Neoptolemus's courage at Troy; Achilles strides away rejoicing.",
    "Ajax alone refuses reconciliation and withdraws in silence.",
  ],
  exitState:"Ajax alone refuses reconciliation and withdraws in silence.",
  duration:36,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // CIMMERIAN SHORE + UNDERWORLD PIT — the sunless backdrop: dead sea, grove,
    // the trench where the shades throng. Fills the whole field behind the cast.
    { asset:"location.cimmerian-shore-and-underworld-pit", instance:"shore_01",
      anchor:{x:.5,y:1.00}, scale:1.0 },

    // NEOPTOLEMUS-AT-TROY MEMORY — the glowing four-cell tableau at upper-right
    // that Odysseus's telling calls up and that revives Achilles to pride.
    { asset:"divine_fx.neoptolemus-at-troy-memory", instance:"memory_01",
      anchor:{x:.82,y:.72}, scale:.46 },

    // PATROCLUS & ANTILOCHUS — the pale honor guard flanking the center where
    // Achilles arrives; two-figure asset, silent attendance. Set BACK and up so
    // they read as faint background attendants, not the foreground drama.
    { asset:"character.patroclus-and-antilochus", instance:"guard_01",
      anchor:{x:.42,y:.78}, scale:.46 },

    // AJAX's shade — far left, the huge armored figure refusing reconciliation;
    // will turn his back and withdraw in silence (the scene exit).
    { asset:"character.ajaxs-shade", instance:"ajax_01",
      anchor:{x:.11,y:1.00}, scale:.56, pose:"ajax_cold", band:"front",
      gaze:{x:.5,y:.14} },

    // ACHILLES's shade — centre-left foreground: approaches in regret, rejects the
    // glory of the dead, is revived by his son's fame, strides off proud.
    { asset:"character.achilless-shade", instance:"achilles_01",
      anchor:{x:.42,y:1.00}, scale:.58, pose:"ach_regret", band:"front",
      gaze:{x:.2,y:.42} },

    // ODYSSEUS — centre-foreground right, turned in to the pit: praising Achilles,
    // then recounting Neoptolemus's courage at Troy.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.66,y:1.00}, scale:.50, pose:"torso_open", band:"front",
      gaze:{x:-.4,y:.04} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Achilles approaches with his companions; Ajax stands off, cold.
    { op:"actor.pose", target:"achilles_01", at:0.0,  args:{ pose:"ach_regret" } },
    { op:"actor.gaze", target:"achilles_01", at:0.0,  args:{ gaze:{x:.2,y:.42} } },
    { op:"actor.pose", target:"ajax_01",     at:0.0,  args:{ pose:"ajax_cold" } },
    // beat 2: Odysseus praises Achilles's honor among the dead...
    { op:"actor.pose", target:"odysseus_01", at:6.0,  args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus_01", at:6.0,  args:{ gaze:{x:-.4,y:.04} } },
    // ...but Achilles rejects death's glory — the bitter confession across the pit.
    { op:"actor.pose", target:"achilles_01", at:9.0,  args:{ pose:"ach_confess" } },
    { op:"actor.gaze", target:"achilles_01", at:9.0,  args:{ gaze:{x:.32,y:.24} } },
    // beat 3: he asks after Peleus and Neoptolemus — turning toward Odysseus.
    { op:"actor.gaze", target:"achilles_01", at:15.0, args:{ gaze:{x:.36,y:.06} } },
    // beat 4: Odysseus recounts Neoptolemus's courage — the proud memory surfaces...
    { op:"fx.play",    target:"memory_01",   at:18.0, args:{} },
    // ...and Achilles is revived by his son's fame, then strides off rejoicing.
    { op:"actor.pose", target:"achilles_01", at:22.0, args:{ pose:"ach_revived" } },
    { op:"actor.gaze", target:"achilles_01", at:22.0, args:{ gaze:{x:.05,y:-.18} } },
    { op:"actor.pose", target:"achilles_01", at:28.0, args:{ pose:"ach_stride" } },
    { op:"actor.gaze", target:"achilles_01", at:28.0, args:{ gaze:{x:.16,y:-.04} } },
    // beat 5 (exit): Ajax alone refuses reconciliation and withdraws in silence.
    { op:"actor.pose", target:"ajax_01",     at:30.0, args:{ pose:"ajax_back" } },
    { op:"actor.gaze", target:"ajax_01",     at:30.0, args:{ gaze:{x:0,y:.1} } },
    { op:"timeline.capture", target:"OD-B11-S07", at:35.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the sunless shore + pit, the glowing Troy memory, the flanking
     honor guard, Ajax refusing at the left, Achilles centre-left, Odysseus front. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "shore_01"){
        mod = shore;
        // the full sunless rite: dead sea, grove, the trench where the shades
        // throng around the blood; ghost-ring present the whole scene.
        state = { t, status:"SUNLESS", progress:.4,
                  layers:["sky","sea","grove","shore","rivers","ship","ghostring","trench"] };

      } else if (c.instance === "memory_01"){
        mod = memory;
        // Odysseus's telling calls up the four proud memory-cells; they surface
        // and flare (fx.play at 18.0) as he recounts Neoptolemus at Troy.
        const mt = (s.fxT != null) ? s.fxT : Math.max(0, t - 18.0);
        const on = Math.min(1, mt / 6);
        state = { t:mt, glow:[.55+.2*on, .5+.2*on, .5+.2*on, .55+.2*on],
                  status:"PROUD", progress:.5,
                  layers:["thread","council","horse","combat","departure"] };

      } else if (c.instance === "guard_01"){
        mod = guard;
        // the pale honor guard: silent attendance while Achilles arrives, lifting
        // to a quiet welcome once he is revived and strides off.
        const variant = t < 22 ? "attending" : "greeting";
        state = { variant, status: variant==="greeting" ? "WELCOMING" : "ATTENDING" };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale. Emotion channels ride on the pose so each reads clearly.
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };

        if (c.instance === "ajax_01"){
          mod = ajax;
          // the eloquent silence: cold shoulder, then turning his back to withdraw
          // unanswered. Never speaks — jaw shut, resentment held.
          state.jaw = 0; state.browKnit = .4; state.frown = .2;
          state.mouthAsym = t < 30 ? .26 : .1;

        } else if (c.instance === "achilles_01"){
          mod = achilles;
          // the arc: bowed regret -> bitter confession -> revived by his son's
          // fame -> proud martial stride. Face channels track the pose.
          const p = state.pose;
          if (p === "ach_regret"){ state.browUp=.55; state.browKnit=.5; state.frown=.5; state.jaw=.4; }
          else if (p === "ach_confess"){ state.browUp=.5; state.browKnit=.4; state.frown=.34; state.jaw=.6; }
          else if (p === "ach_revived"){ state.browUp=.5; state.browKnit=.06; state.smile=.32; state.eyeWide=.3; state.jaw=.34; }
          else { state.browUp=.18; state.browKnit=.16; state.smile=.14; state.eyeNarrow=.14; } // ach_stride

        } else { // odysseus_01
          mod = odysseus;
          // praising Achilles across the pit, then recounting his son's courage —
          // open speaking pose, warm, turned in to the dead.
          state.jaw = .6; state.smile = t >= 18 ? .34 : .3; state.browUp = .34;
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
