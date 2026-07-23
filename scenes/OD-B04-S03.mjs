/* ============================================================
   SCENE  OD-B04-S03 — Helen's Drug and the Beggar in Troy
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Helen mixes a drug into the wine that quiets grief and anger.
     2. She tells how Odysseus entered Troy disguised as a beaten slave.
     3. Helen alone recognized and bathed him; he revealed the Greek plan
        after binding her to secrecy.
     4. Odysseus killed Trojans and returned to the ships with intelligence.

   Stage layout (back -> front): the frame is a MEMORY frame. The present
   (Helen + her mixing bowl) sits in the foreground; her recollection of Troy
   (the interior set + Odysseus disguised as a beaten beggar) stands behind.

     the Troy interior memory set (faint, full frame — the recollected city)
       -> Odysseus as the Trojan beggar, folded into the remembered alley
       -> Helen's mixing bowl in the present foreground (the drug in the wine)
       -> Helen herself, the controlled storyteller, tending the bowl (front).

   One clock carries both times at once: as Helen's hand works the bowl
   (pour -> drug -> stir -> serve -> a calm field), the beggar behind her folds
   from a shuffling entrance to a watchful stoop to disciplined observation to
   coiled, concealed force — the story she is telling, played in the memory set.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import troy    from "../assets/location/troy-interior-memory-set.mjs";
import beggar  from "../assets/character/odysseus-as-trojan-beggar.mjs";
import bowl    from "../assets/prop/helens-mixing-bowl.mjs";
import helen   from "../assets/character/helen.mjs";

export const scene = {
  id:"OD-B04-S03",
  title:"Helen's Drug and the Beggar in Troy",
  book:1,
  beats:[
    "Helen mixes a drug into the wine that quiets grief and anger.",
    "She tells how Odysseus entered Troy disguised as a beaten slave.",
    "Helen alone recognized and bathed him; he revealed the Greek plan after binding her to secrecy.",
    "Odysseus killed Trojans and returned to the ships with intelligence.",
  ],
  exitState:"Odysseus killed Trojans and returned to the ships with intelligence.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the recollected city — an empty navigable set, faint memory tone, full
    // frame behind everything (gate, alleys, bathing chamber, escape postern)
    { asset:"location.troy-interior-memory-set", instance:"troy_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"remembered" },

    // Odysseus disguised — folded into the remembered alley, mid-depth, left of
    // centre, a beaten mendicant CONTAINING watchful, disciplined eyes
    { asset:"character.odysseus-as-trojan-beggar", instance:"beggar_01",
      anchor:{x:.335,y:.705}, scale:.44, pose:"shuffling",
      gaze:{x:.12,y:-.20}, band:"threeq" },

    // the present, foreground: the wide two-handled krater in which Helen mixes
    // the grief-drug (nepenthe) into the wine before serving it round
    { asset:"prop.helens-mixing-bowl", instance:"bowl_01",
      anchor:{x:.500,y:1.00}, scale:.36, pose:"pour" },

    // Helen — the controlled storyteller, foreground right, administering the
    // emotional chemistry with a poised offering hand and a knowing half-smile
    { asset:"character.helen", instance:"helen_01",
      anchor:{x:.720,y:1.00}, scale:.60, pose:"storytelling",
      gaze:{x:-.14,y:.06}, band:"front" },
  ],

  // ordered ops on ONE clock (render is sampled at --t). The characters fold
  // via stateAt(); the bowl's mix channels are derived from t in stage().
  timeline:[
    // beat 1: Helen settles into the telling as the drug goes into the wine
    { op:"actor.pose", target:"helen_01", at:0.0, args:{ pose:"storytelling" } },
    { op:"actor.gaze", target:"helen_01", at:0.0, args:{ gaze:{x:-.14,y:.06} } },

    // beat 2: Odysseus enters Troy disguised — a beaten shuffle folds into the
    // beggar's stoop, cupped hand out, but the eyes climb up, narrow, watching
    { op:"actor.pose", target:"beggar_01", at:6.0, args:{ pose:"stooped" } },
    { op:"actor.gaze", target:"beggar_01", at:6.0, args:{ gaze:{x:.06,y:-.36} } },

    // beat 3: recognized and bathed, then — sworn to secrecy — he gives up the
    // Greek plan: the mask goes to disciplined observation, cataloguing the room
    { op:"actor.pose", target:"beggar_01", at:14.0, args:{ pose:"observing" } },
    { op:"actor.gaze", target:"beggar_01", at:14.0, args:{ gaze:{x:-.62,y:-.28} } },
    // Helen's gaze drops to the private exchange she is recounting
    { op:"actor.gaze", target:"helen_01", at:14.0, args:{ gaze:{x:-.22,y:.10} } },

    // beat 4: concealed force breaks cover — he kills Trojans and slips back to
    // the ships with the intelligence: arms hauled in, brow slammed, jaw set
    { op:"actor.pose", target:"beggar_01", at:24.0, args:{ pose:"coiled" } },
    { op:"actor.gaze", target:"beggar_01", at:24.0, args:{ gaze:{x:-.4,y:-.10} } },

    { op:"timeline.capture", target:"OD-B04-S03", at:43.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: Troy memory set, the beggar in it, the bowl, Helen. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the mixing bowl folds off the same clock: wine poured -> the drug added
    // and spreading -> stirred through -> served round -> a calm field settling
    let bowlState;
    if      (t < 3)  bowlState = { fill:lerp(0.20,0.42,clamp01(t/3)), pour:1, drug:0, stir:0, serve:0, field:0 };
    else if (t < 6)  bowlState = { fill:0.58, pour:0, drug:1, stir:0, serve:0, field:0 };   // the grief-drug goes in
    else if (t < 18) bowlState = { fill:0.60, pour:0, drug:0, stir:1, serve:0, field:0 };   // stirred through the wine
    else if (t < 30) bowlState = { fill:0.55, pour:0, drug:0, stir:0, serve:1, field:0 };   // served round
    else             bowlState = { fill:0.50, pour:0, drug:0, stir:0, serve:0, field:1 };   // calm radiates
    bowlState.t = t;

    // as the story reaches the private nook (beat 3+), the memory narrows to the
    // hidden exchange and, at the end, to the escape route back to the ships
    let troyLayers;
    if      (t < 14) troyLayers = ["sky","citywall","gate","postern","farbuildings","alley","bath","nook","floor"];
    else if (t < 24) troyLayers = ["sky","citywall","gate","alley","bath","nook","floor"]; // recognition + bath + secret
    else             troyLayers = ["sky","citywall","gate","postern","alley","floor"];      // the way out held open

    for (const c of scene.cast){
      const s = st[c.instance] || {};

      if (c.instance === "troy_01"){
        placeInstance(offctx, W, H, troy, {
          anchor:c.anchor, scale:c.scale, state:{ layers:troyLayers } });
        continue;
      }
      if (c.instance === "bowl_01"){
        placeInstance(offctx, W, H, bowl, {
          anchor:c.anchor, scale:c.scale, state:bowlState });
        continue;
      }

      // characters: fold pose/gaze/band from the timeline, add breath phase
      const mod = c.instance === "beggar_01" ? beggar : helen;
      const state = { t, band:c.band, gaze:c.gaze, ...s };
      placeInstance(offctx, W, H, mod, {
        anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
