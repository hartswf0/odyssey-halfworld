/* ============================================================
   SCENE  OD-B10-S06 — Odysseus Defeats Circe's Spell
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Circe serves Odysseus the drugged mixture and strikes him with her wand.
     2. The moly protects him; he draws his sword and rushes her.
     3. Circe recognizes the foretold man, kneels, and offers her bed.
     4. Odysseus requires the binding oath that she will not unman or harm him.
     5. Attendants bathe and feast him, but he refuses to eat while his crew
        remain imprisoned.

   Stage layout (back -> front, one master clock):
     BINDING OATH FIELD, full bleed, as the covenant backdrop — the pale sworn
     air, the covenant ground, the heavy binding RING with its clasped-hand
     oath-glyph, and the plumb oath-lines dropping to the ground. Its OWN party
     silhouettes, arms and disabled-wand layers are DROPPED: the real Circe and
     the real Odysseus stand in as the two covenant parties, and the real wand
     plays the struck-down power.
       -> CIRCE at the left, kneeling and swearing the binding oath — the
          foretold man recognized, her charm undone.
       -> ODYSSEUS at the right, standing firm over the sealed vow, hand out on
          the oath he required, refusing the feast while his crew stay penned.
       -> CIRCE'S WAND fallen at the lower left, its spell FIZZLED — the moly
          turned the transformation aside.
       -> the DRUGGED CUP set down at the foreground, its charm NULLIFIED — the
          drink that could not take him.
   The served cup, the failed strike, the recognition, the sworn oath and the
   refused feast — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import oathField from "../assets/divine_fx/binding-oath-field.mjs";
import circe from "../assets/character/circe.mjs";
import odysseus from "../assets/character/odysseus.mjs";
import wand from "../assets/prop/circes-wand.mjs";
import cup from "../assets/prop/drugged-cup.mjs";

export const scene = {
  id:"OD-B10-S06",
  title:"Odysseus Defeats Circe's Spell",
  book:1,
  beats:[
    "Circe serves Odysseus the drugged mixture and strikes him with her wand.",
    "The moly protects him; he draws his sword and rushes her.",
    "Circe recognizes the foretold man, kneels, and offers her bed.",
    "Odysseus requires the binding oath that she will not unman or harm him.",
    "Attendants bathe and feast him, but he refuses to eat while his crew remain imprisoned.",
  ],
  exitState:"He refuses to eat while his crew remain imprisoned.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // BINDING OATH FIELD — full bleed covenant backdrop. Keep the sworn air,
    // ground, binding ring + clasped-hand oath-glyph and the plumb oath-lines;
    // DROP its own figures/arms/wand so the real actors and the real wand play
    // those parts. Charges to BOUND over the clock.
    { asset:"divine_fx.binding-oath-field", instance:"oath_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // CIRCE — left covenant party, kneeling and swearing the binding oath, the
    // foretold man recognized and her charm undone
    { asset:"character.circe", instance:"circe_01",
      anchor:{x:.235,y:.94}, scale:.50, pose:"circe_oath", band:"threeq",
      gaze:{x:.24,y:-.02} },

    // ODYSSEUS — right covenant party, standing firm over the sealed vow, hand
    // out on the oath he required, refusing the feast while his crew stay penned
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.775,y:.955}, scale:.52, pose:"offering_hand", band:"threeq",
      gaze:{x:-.30,y:.02} },

    // CIRCE'S WAND — fallen at the lower left, its spell FIZZLED by the moly
    { asset:"prop.circes-wand", instance:"wand_01",
      anchor:{x:.115,y:.985}, scale:.30, pose:"fizzle" },

    // the DRUGGED CUP — set down at the foreground, its charm NULLIFIED
    { asset:"prop.drugged-cup", instance:"cup_01",
      anchor:{x:.585,y:.965}, scale:.20, pose:"nullified" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Circe serves the drugged cup and strikes with her wand
    { op:"fx.play",    target:"cup_01",      at:0.0,  args:{} },
    { op:"actor.pose", target:"circe_01",    at:0.0,  args:{ pose:"circe_strike" } },
    { op:"actor.pose", target:"wand_01",     at:0.0,  args:{ pose:"strike" } },
    // beat 2: the moly protects him; the strike fizzles and he rushes her
    { op:"actor.pose", target:"wand_01",     at:8.0,  args:{ pose:"fizzle" } },
    { op:"actor.pose", target:"odysseus_01", at:8.0,  args:{ pose:"one_arm_raised" } },
    // beat 3: Circe recognizes the foretold man, kneels and offers her bed
    { op:"actor.pose", target:"circe_01",    at:16.0, args:{ pose:"circe_seduce" } },
    // beat 4: Odysseus requires the binding oath — the covenant field is sworn
    { op:"actor.pose", target:"circe_01",    at:24.0, args:{ pose:"circe_oath" } },
    { op:"actor.pose", target:"odysseus_01", at:24.0, args:{ pose:"offering_hand" } },
    { op:"fx.play",    target:"oath_01",     at:24.0, args:{} },
    // beat 5 (exit): bathed and feasted, he refuses to eat while his crew stay penned
    { op:"actor.gaze", target:"odysseus_01", at:34.0, args:{ gaze:{x:-.34,y:.04} } },
    { op:"timeline.capture", target:"OD-B10-S06", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the covenant oath-field backdrop, then kneeling Circe and
     standing Odysseus as the two covenant parties, then the fizzled wand and
     the nullified cup in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "oath_01"){
        mod = oathField;
        // the covenant backdrop: sworn air + ground + binding ring + clasped-hand
        // oath-glyph + plumb oath-lines. Its own figures/arms/wand layers are
        // dropped — the real Circe, Odysseus and wand stand in. The vow charges
        // to BOUND once Odysseus requires it (fx.play at 24.0) and holds.
        const ct = (s.fxT != null) ? s.fxT : Math.max(0, t - 24.0);
        const inten = 0.32 + 0.9 * Math.min(1, ct / 6);
        state = { t:ct, intensity:inten,
                  bind:  Math.min(1, 0.30 + ct * 0.14),
                  reach: Math.min(1, 0.10 + ct * 0.16),
                  disable:0,
                  layers:["field","ground","oathlines","ring","clasp"] };

      } else if (c.instance === "wand_01"){
        mod = wand;
        // the transformation rod: strikes at first, then fizzles once the moly
        // turns the spell aside
        state = { mode:s.pose || c.pose, t };

      } else if (c.instance === "cup_01"){
        mod = cup;
        // the drugged cup: served laced, its charm nullified by the moly
        const nulled = (s.fxT != null) || t >= 8;
        state = nulled
          ? { fill:0.50, shimmer:0.0, tilt:0, grip:0, spell:0, nullified:1, t,
              status:"NULLIFIED", progress:.95 }
          : { fill:0.82, shimmer:0.5, tilt:0, grip:1, spell:0, nullified:0, t,
              status:"SERVED", progress:.22 };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "circe_01") ? circe : odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
