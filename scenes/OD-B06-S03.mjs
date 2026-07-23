/* ============================================================
   SCENE  OD-B06-S03 — The Naked Stranger Emerges
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus debates whether to clasp Nausicaa's knees or speak from a
        distance.
     2. Covering himself with a leafy branch, he emerges like a mountain lion.
     3. The maids flee, but Athena keeps Nausicaa steady.
     4. Odysseus praises her tactfully, asks for clothing and directions, and
        avoids touching her.
     5. Nausicaa answers with courage and assigns the maids to help him.

   Stage layout (the river washing-place, back -> front, sheltered thicket at
   centre where the stranger rises):
     the MAIDS' washing-place as the full-bleed set + the FEAR-SCATTER of the
     serving-girls fleeing from the thicket (the alarm source at centre)
       -> NAUSICAA at left-centre, planted and facing the stranger, holding
          her ground while the others run (poised courage)
       -> ATHENA'S COURAGE FIELD laid over her: grounding rings at the feet, a
          dead-true plumb down her spine, a firm forward gaze-line — the unseen
          goddess steadies the mortal (figure layer omitted; it reads on her)
       -> ODYSSEUS at centre-right, risen from the thicket like a lion, turned
          toward Nausicaa, an open persuasive hand offering tactful praise
       -> the LEAFY MODESTY BRANCH held before him, canopy aligned over his
          body — the cover he emerges behind.
   The debate, the emergence, the flight, the divine steadying, and the courteous
   plea all held on one clock: the whole encounter read in one still.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import maids        from "../assets/ensemble/nausicaas-maids.mjs";
import nausicaa     from "../assets/character/nausicaa.mjs";
import courageField from "../assets/divine_fx/athenas-courage-field.mjs";
import odysseus     from "../assets/character/odysseus.mjs";
import branch       from "../assets/prop/leafy-modesty-branch.mjs";

export const scene = {
  id:"OD-B06-S03",
  title:"The Naked Stranger Emerges",
  book:1,
  beats:[
    "Odysseus debates whether to clasp Nausicaa's knees or speak from a distance.",
    "Covering himself with a leafy branch, he emerges like a mountain lion.",
    "The maids flee, but Athena keeps Nausicaa steady.",
    "Odysseus praises her tactfully, asks for clothing and directions, and avoids touching her.",
    "Nausicaa answers with courage and assigns the maids to help him.",
  ],
  exitState:"Nausicaa answers with courage and assigns the maids to help him.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the washing-place set + the serving-girls fleeing from the thicket where
    // the stranger rises (full-bleed backdrop; the alarm/thicket sits centre)
    { asset:"ensemble.nausicaas-maids", instance:"maids_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beat 3: Nausicaa planted at left-centre, facing the stranger, holding her
    // ground while the maids scatter (poised courage)
    { asset:"character.nausicaa", instance:"nausicaa_01",
      anchor:{x:.34,y:.92}, scale:.50, pose:"nausicaa_holding",
      band:"front", gaze:{x:.30,y:.02} },

    // beat 3: Athena's courage field laid OVER Nausicaa (figure layer omitted so
    // the divine marks register on the real princess) — grounding rings, plumb
    // spine, firm forward gaze toward the stranger
    { asset:"divine_fx.athenas-courage-field", instance:"courage_01",
      anchor:{x:.375,y:1.00}, scale:.56 },

    // beats 1-4: Odysseus risen from the thicket at centre-right, turned toward
    // Nausicaa, offering tactful praise with an open persuasive hand
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.67,y:.94}, scale:.54, pose:"crouch",
      band:"threeq", gaze:{x:-.34,y:-.04} },

    // beat 2: the leafy modesty branch held before him, canopy aligned over his
    // body — the cover he emerges behind
    { asset:"prop.leafy-modesty-branch", instance:"branch_01",
      anchor:{x:.655,y:.82}, scale:.44 },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: he crouches hidden in the thicket, weighing his approach
    { op:"actor.pose", target:"odysseus_01", at:0.0, args:{ pose:"crouch" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0, args:{ gaze:{x:-.20,y:.10} } },
    // beat 2: covered by the branch, he rises and steps out like a mountain lion
    { op:"actor.pose", target:"odysseus_01", at:3.0, args:{ pose:"step_closer" } },
    { op:"actor.gaze", target:"odysseus_01", at:3.0, args:{ gaze:{x:-.30,y:-.02} } },
    // beat 3: Nausicaa holds her ground; the courage field takes
    { op:"fx.play",    target:"courage_01",  at:3.0, args:{} },
    { op:"actor.pose", target:"nausicaa_01", at:0.0, args:{ pose:"nausicaa_holding" } },
    // beat 4: he addresses her — open persuasive hand, tactful praise, no touch
    { op:"actor.pose", target:"odysseus_01", at:7.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01", at:7.0, args:{ gaze:{x:-.34,y:-.04} } },
    // beat 5 (exit): Nausicaa answers with courage and assigns the maids
    { op:"actor.pose", target:"nausicaa_01", at:34.0, args:{ pose:"nausicaa_instructing" } },
    { op:"actor.gaze", target:"nausicaa_01", at:34.0, args:{ gaze:{x:.28,y:.04} } },
    { op:"timeline.capture", target:"OD-B06-S03", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the maids' washing-place + fear-scatter, Nausicaa holding, the
     courage field over her, Odysseus risen and speaking, then the branch he
     covers himself with. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D = scene.duration;

    // the flight sweeps in fast the moment he rises; the divine field charges
    // toward STEADIED over the same clock
    const scatter  = clamp01(t/6) * 0.92;
    const reaction = clamp01(t/5);
    const inten    = lerp(0.30, 1.30, clamp01(t/12));
    const lock     = clamp01(inten*0.85);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "maids_01"){
        mod = maids;
        // the washing-place set + the startled flight from the centre thicket
        state = { formation:"fear-scatter", scatter, attention:1.0, reaction,
                  spread:1.1, density:1.0, showWater:true, showGarments:true,
                  showThicket:true, alarm:{ x:0.52, y:0.90 } };
      } else if (c.instance === "nausicaa_01"){
        mod = nausicaa;
        state = { t:0.5, band:c.band, pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      } else if (c.instance === "courage_01"){
        mod = courageField;
        // omit the field's own placeholder figure so the divine marks register
        // over the REAL Nausicaa placed beneath it
        state = { t, intensity:inten, lock,
                  layers:["source","rings","aura","plumb","gaze","glyph"] };
      } else if (c.instance === "odysseus_01"){
        mod = odysseus;
        state = { t:0.5, band:c.band, pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      } else { // branch_01
        mod = branch;
        // held before him in the modesty-alignment (cover) state
        state = { mode:"cover", t:t*0.4 };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
