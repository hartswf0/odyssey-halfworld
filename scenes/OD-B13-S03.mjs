/* ============================================================
   SCENE  OD-B13-S03 — The Cretan Lie Meets Its Match
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The shepherd tells Odysseus he is in Ithaca; the hero suppresses his joy.
     2. He invents a Cretan identity and a story of killing a king's son and
        fleeing by Phoenician ship.
     3. Athena laughs, changes to her divine form, and praises his incurable cunning.
     4. Odysseus tests her loyalty and complains she abandoned him after Troy.
     5. She explains that Poseidon's anger required concealment, not open rescue.

   Stage layout (back -> front, read left -> right as the causal sweep on one clock):
     BACK   — ITHACA REVEALED: the disguising mist withdrawing from the familiar
              terrain the hero failed to know — the sheltered harbour of Phorcys,
              the wooded slope of Neriton with its still-veiled summit, the cave of
              the nymphs and the long-leaved olive. The land the shepherd names.
     CENTRE — SHEPHERD-TO-GODDESS TRANSFORMATION: the small floppy-capped shepherd
              on the left morphing into the tall radiant armored goddess on the
              right, a growth arrow spanning the change and an identity link proving
              one being through the disguise. The moment the lie meets its match.
     FRONT-L— ODYSSEUS: the crafty king, joy swallowed, spinning the Cretan lie with
              an open persuasive palm — then turning to test her and complain.
     FRONT-R— ATHENA: the bright-eyed goddess revealed, laughing at his cunning and
              then explaining, hand open, why Poseidon's anger demanded concealment.
   The named land, the transformation, the liar and the goddess who out-knows him —
   all held on one clock in a single still.
   ============================================================ */
import { placeInstance, clamp } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import ithaca from "/assets/environment/ithaca-revealed.mjs";
import transform from "/assets/divine_fx/shepherd-to-goddess-transformation.mjs";
import odysseus from "/assets/character/odysseus.mjs";
import athena from "/assets/character/athena.mjs";

const clamp01 = x => clamp(x, 0, 1);

export const scene = {
  id:"OD-B13-S03",
  title:"The Cretan Lie Meets Its Match",
  book:1,
  beats:[
    "The shepherd tells Odysseus he is in Ithaca and the hero suppresses his joy.",
    "He invents a Cretan identity and a story of killing a king's son and fleeing by Phoenician ship.",
    "Athena laughs, changes to her divine form, and praises his incurable cunning.",
    "Odysseus tests her loyalty and complains that she abandoned him after Troy.",
    "She explains that Poseidon's anger required concealment rather than open rescue.",
  ],
  exitState:"She explains that Poseidon's anger required concealment rather than open rescue.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // ITHACA REVEALED — full-frame backdrop: the disguising mist peeling back off
    // the harbour, shore, cave, olive and the wooded slope of Neriton. The land
    // the shepherd names and the hero pretends not to know.
    { asset:"environment.ithaca-revealed", instance:"ithaca_01",
      anchor:{x:.50, y:1.00}, scale:1.00 },

    // SHEPHERD-TO-GODDESS TRANSFORMATION — centre spectacle: the small capped
    // shepherd morphing into the tall armored goddess, growth arrow + identity
    // link across the change. The disguise dropping as the lie meets its match.
    { asset:"divine-fx.shepherd-to-goddess-transformation", instance:"morph_01",
      anchor:{x:.50, y:.94}, scale:.66 },

    // ODYSSEUS — front left: the crafty king, joy swallowed, spinning the Cretan
    // lie with an open persuasive palm, then turning to test and reproach her.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.205, y:1.00}, scale:.52, pose:"offering_hand", band:"threeq",
      gaze:{x:.40, y:-.04} },

    // ATHENA — front right: the bright-eyed goddess revealed, laughing at his
    // cunning, then explaining why Poseidon's anger demanded concealment.
    { asset:"character.athena", instance:"athena_01",
      anchor:{x:.805, y:1.00}, scale:.55, pose:"athena_resolute", band:"threeq",
      gaze:{x:-.42, y:-.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the shepherd names Ithaca; Odysseus, joy suppressed, guards his face
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:.34, y:.02} } },
    { op:"actor.pose", target:"athena_01",   at:0.0,  args:{ pose:"athena_resolute" } },
    { op:"actor.gaze", target:"athena_01",   at:0.0,  args:{ gaze:{x:-.40, y:.00} } },
    // beat 2: the Cretan lie — open persuasive palm, sly sidelong gaze
    { op:"actor.pose", target:"odysseus_01", at:8.0,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01", at:8.0,  args:{ gaze:{x:.42, y:-.05} } },
    // beat 3: Athena laughs and stands revealed, praising his cunning
    { op:"fx.play",    target:"morph_01",    at:14.0, args:{} },
    { op:"actor.pose", target:"athena_01",   at:16.0, args:{ pose:"athena_command" } },
    { op:"actor.gaze", target:"athena_01",   at:16.0, args:{ gaze:{x:-.34, y:-.05} } },
    // beat 4: Odysseus tests her and reproaches her absence after Troy
    { op:"actor.pose", target:"odysseus_01", at:24.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus_01", at:24.0, args:{ gaze:{x:.44, y:.04} } },
    // beat 5 (exit): she explains Poseidon's anger required concealment
    { op:"actor.pose", target:"athena_01",   at:32.0, args:{ pose:"athena_speak" } },
    { op:"actor.gaze", target:"athena_01",   at:32.0, args:{ gaze:{x:-.28, y:.00} } },
    { op:"timeline.capture", target:"OD-B13-S03", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the revealing land, the transformation, then the two figures. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "ithaca_01"){
        mod = ithaca;
        // the disguising mist withdraws across the scene: harbour/shore first,
        // the wooded slope and last the summit, so the land stands clear by the end.
        const reveal = clamp01(0.46 + (t / 40) * 0.54);
        state = { t: t * 0.05, reveal, dir:1,
                  wind: clamp01(1.15 - (t / 40) * 0.6),
                  layers:["sky","farHills","neriton","sea","harbor","shore","cave","olive","mist"],
                  status: reveal < 0.5 ? "CLEARING" : reveal < 0.86 ? "UNVEILING" : "REVEALED",
                  progress: clamp01(0.12 + 0.84 * (t / 40)) };

      } else if (c.instance === "morph_01"){
        mod = transform;
        // the shepherd disguise drops to the radiant goddess as the clock advances;
        // drop the fx's own opaque ground plane so the revealed land reads behind it.
        const ft = clamp01(0.08 + (t / 40) * 0.80);
        state = { t: ft, radiance: 1.0 + (t / 40) * 0.15,
                  layers:["field","light","shepherd","goddess","identity"],
                  status: ft < 0.35 ? "SHEPHERD" : ft < 0.7 ? "CHANGING" : "REVEALED",
                  progress: clamp01(0.10 + 0.85 * (t / 40)) };

      } else if (c.instance === "odysseus_01"){
        mod = odysseus;
        // joy swallowed while he lies (guarded, faint knit), turning to reproach
        // (brows up + knit, mouth working) once she stands revealed.
        const reproach = t >= 24;
        state = { t:0.5, band:c.band, pose:s.pose || c.pose, gaze:s.gaze || c.gaze,
                  smile: reproach ? 0 : 0.30, mouthAsym: reproach ? 0 : 0.5,
                  browUp: reproach ? 0.40 : 0.22, browKnit: reproach ? 0.34 : 0.20,
                  eyeNarrow: reproach ? 0.10 : 0.28, jaw: reproach ? 0.34 : 0 };

      } else { // athena_01 — the goddess revealed: laughs, praises, then explains
        mod = athena;
        const explaining = t >= 32;
        state = { t:0.45, band:c.band, pose:s.pose || c.pose, gaze:s.gaze || c.gaze,
                  smile: explaining ? 0.10 : 0.30, browUp: 0.30,
                  eyeWide: 0.30, jaw: explaining ? 0.34 : 0.20 };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
