/* ============================================================
   OD-B01-S02 — Athena's Two-Part Plan
   A thin Halfworld composition module. It COMPOSES existing assets on one
   clock — it never redraws them. The council's speech (S01) resolves into a
   divided operation: Hermes to Ogygia to free the father, Athena to Ithaca to
   rouse the son. The scene closes on Athena arming — golden sandals fastened,
   bronze spear taken up — and stepping off Olympus onto the descent route.

   Stage geography (back -> front):
     · the Olympus-to-Ithaca descent fills the field as the divine route that
       binds the two halves of the plan (summit node up, Ithacan shore down).
     · Hermes stands right of the corridor, named and readied as the messenger.
     · Athena stands left-foreground, moving from counsel into departure.
     · her bronze spear is planted at her side (taken up), and the golden winged
       sandals charge at her feet (fastened) — her exit equipment.

   Verify: node harness/render-scene.mjs scenes/OD-B01-S02.mjs --t 8
   ============================================================ */
import athena  from "../assets/character/athena.mjs";
import hermes  from "../assets/character/hermes.mjs";
import sandals from "../assets/prop/golden-winged-sandals.mjs";
import spear   from "../assets/prop/athenas-bronze-spear.mjs";
import descent from "../assets/divine_fx/olympus-to-ithaca-descent.mjs";
import { placeInstance, clamp01, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

export const scene = {
  id:"OD-B01-S02",
  title:"Athena's Two-Part Plan",
  book:1,
  beats:[
    "Athena proposes sending Hermes to Ogygia with the decree that Calypso release Odysseus.",
    "She assigns herself the journey to Ithaca to awaken courage in Telemachus.",
    "The gods accept the divided operation: release the father and activate the son.",
    "Athena fastens her golden sandals, takes her spear, and leaves Olympus.",
  ],
  exitState:"Athena fastens her golden sandals, takes her spear, and leaves Olympus.",
  duration:40,

  cast:[
    // distant/backdrop first, foreground actors last
    { asset:"divine_fx.olympus-to-ithaca-descent", instance:"descent01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"descending" },
    { asset:"prop.athenas-bronze-spear", instance:"spear01",
      anchor:{x:.14,y:.99}, scale:.58, pose:"plant" },
    { asset:"character.hermes", instance:"hermes01",
      anchor:{x:.75,y:.955}, scale:.50, pose:"three_quarter_left", gaze:{x:-.2,y:0} },
    { asset:"character.athena", instance:"athena01",
      anchor:{x:.27,y:.965}, scale:.56, pose:"point", gaze:{x:.35,y:0} },
    { asset:"prop.golden-winged-sandals", instance:"sandals01",
      anchor:{x:.205,y:.995}, scale:.28, pose:"glowing" },
  ],

  timeline:[
    // beat 1 — Athena names Hermes for Ogygia; the messenger is readied
    { op:"actor.gaze", target:"athena01", at:5.0,  args:{ gaze:{x:.42,y:0} } },
    { op:"actor.pose", target:"athena01", at:5.0,  args:{ pose:"open-palm" } },
    { op:"actor.pose", target:"hermes01", at:6.0,  args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"hermes01", at:6.0,  args:{ gaze:{x:.15,y:-.1} } },
    // beat 2 — she assigns herself the road to Ithaca (looks down the corridor)
    { op:"actor.pose", target:"athena01", at:14.0, args:{ pose:"command" } },
    { op:"actor.gaze", target:"athena01", at:14.0, args:{ gaze:{x:-.15,y:.32} } },
    // beat 3 — the gods accept the divided operation
    { op:"actor.pose", target:"athena01", at:23.0, args:{ pose:"open-palm" } },
    { op:"actor.gaze", target:"athena01", at:23.0, args:{ gaze:{x:.1,y:0} } },
    // beat 4 — armed, she strides off Olympus onto the descent
    { op:"actor.pose", target:"athena01", at:31.0, args:{ pose:"stride" } },
    { op:"actor.gaze", target:"athena01", at:31.0, args:{ gaze:{x:-.2,y:.25} } },
    { op:"actor.pose", target:"hermes01", at:31.0, args:{ pose:"one_arm_raised" } },
    { op:"timeline.capture", target:"OD-B01-S02", at:39.0, args:{ label:"EXIT" } },
  ],

  /* Draw every cast instance in SOLID tones into the offscreen buffer at time
     t. The engine runs ONE dotify + card pass over the whole stage, so the
     scene shares a single halftone. Deterministic — clock only, no random. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const dur = scene.duration || 40;
    const p = clamp01(t/dur);

    // ---- back: the divine route (Olympus summit -> Ithacan shore) ----
    // t drives the descent so the corridor opens as the plan resolves.
    placeInstance(offctx, W, H, descent, {
      anchor:{x:.50,y:1.00}, scale:1.00,
      state:{ t: clamp01(p*1.05), intensity:1.0, spread:1.0 },
    });

    // ---- Athena's spear, planted at her side (taken up near departure) ----
    const spearMode = t < dur*0.72 ? "plant" : "raise";
    placeInstance(offctx, W, H, spear, {
      anchor:{x:.14,y:.99}, scale:.58, state:{ mode: spearMode, t },
    });

    // ---- Hermes, right of the corridor, herald's staff in hand ----
    placeInstance(offctx, W, H, hermes, {
      anchor:{x:.75,y:.955}, scale:.50,
      state:{ ...st.hermes01, staff:true, t },
    });

    // ---- Athena, left-foreground; band turns to three-quarter as she departs ----
    const aSt = { ...st.athena01, t };
    if (aSt.pose === "stride") aSt.band = "threeq";
    placeInstance(offctx, W, H, athena, {
      anchor:{x:.27,y:.965}, scale:.56, state: aSt,
    });

    // ---- the golden winged sandals: a charged emblem on the ground beside her
    //      (fastened before departure), lifting into flight near the exit ----
    const glow = clamp01(0.42 + p*1.1);
    const fly  = t > dur*0.78 ? clamp01((p-0.78)/0.22) : 0;
    placeInstance(offctx, W, H, sandals, {
      anchor:{x:.205,y:.995}, scale:.28,
      state:{ glow, fly, spread: clamp01(0.30 + glow*0.4 + fly*0.5), t },
    });
  },
};
export default scene;
