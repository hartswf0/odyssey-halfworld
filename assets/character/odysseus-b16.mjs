/* character.odysseus-b16 — the continuity Odysseus. Book XVI onward.
   ADDITIVE: does not modify or shadow character.odysseus. Books I–XV keep
   casting the originals; Book XVI+ scenes cast THIS id.

   Reconciles six drifted modules into one body with a `guise` channel:
     king          <- odysseus.mjs                (exemplar, unchanged base)
     restored      <- odysseus-restored.mjs       (scale 1.08 preserved)
     beggar        <- odysseus-as-beggar.mjs      (skin #c4bba9, rags)
     old-beggar    <- odysseus-as-old-beggar.mjs  (ashen, grey, stooped)
     trojan-beggar <- odysseus-as-trojan-beggar.mjs
   `odysseus-memory-variant` is NOT a guise: it was params-identical to the
   base but for scale 1.05, i.e. a state that became a file. It is the
   `remembered` state below.

   Book 16 usage:
     S01/S06  guise:"beggar"
     S03      guise:{ from:"beggar", to:"restored", u }   <- the reveal
     S04      guise:"restored"
   One skin ramp, one scale ramp, one hairColor ramp. The rags snap to tunic
   under Athena's flare at u=0.5 — put divine-fx.athenas-restoration on that
   exact frame. */
import { makeGuiseFigure } from "../../engine/guise.mjs";

/* the one true body — lifted verbatim from assets/character/odysseus.mjs */
const BASE = {
  skin:"#cdb89a", hairColor:"#241d16",
  hair:"curly", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.0,
};

const GUISES = {
  king:            {},
  restored:        { scale:1.08 },
  beggar:          { skin:"#c4bba9", hairColor:"#a9a49b", hair:"short",
                     garment:"rags", cloak:false, scale:0.90 },
  "old-beggar":    { skin:"#bdb4a6", hairColor:"#b6b2ab", hair:"short",
                     garment:"rags", cloak:false, scale:0.88 },
  "trojan-beggar": { hairColor:"#2b261f", garment:"rags", cloak:false, scale:0.98 },
};

const fig = makeGuiseFigure(BASE, GUISES, { id:"odysseus-b16", snapAt:0.5 });

export const asset = {
  id:"character.odysseus-b16",
  type:"CHARACTER",
  name:"Odysseus",
  statusWord:"CRAFTY",
  scene:"OD-B16-S03",
  continuityOf:"character.odysseus",
  guises:Object.keys(GUISES),

  params:BASE,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face","hair-front","beard","near-arm"],
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    spearGrip:{x:.68,y:.55}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  channels:["guise","gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  states:{
    initial:"neutral",
    nodes:{
      neutral:   { preview:{ guise:"king", pose:"three_quarter_left", gaze:{x:-.14,y:.02},
                             smile:.12, browUp:.06, t:0.5 } },
      crafty:    { preview:{ guise:"king", pose:"offering_hand", smile:.52, mouthAsym:.62,
                             browUp:.4, browKnit:.12, eyeNarrow:.3, gaze:{x:.42,y:-.06}, t:0.4 } },
      remembered:{ preview:{ guise:"king", pose:"three_quarter_left", scaleHint:1.05,
                             browUp:.18, gaze:{x:-.10,y:-.04}, t:0.5 } },
      /* --- Book 16 --- */
      begging:   { preview:{ guise:"beggar", pose:"offering_hand", browKnit:.34, browUp:.30,
                             eyeNarrow:.26, frown:.22, gaze:{x:.12,y:.28}, t:0.5 } },
      watching:  { preview:{ guise:"beggar", pose:"three_quarter_left", eyeNarrow:.34,
                             browKnit:.22, smile:.06, gaze:{x:.38,y:.04}, t:0.5 } },
      revealing: { preview:{ guise:{from:"beggar",to:"restored",u:0.5},
                             pose:"one_arm_raised", jaw:.34, browUp:.46, eyeWide:.30,
                             gaze:{x:0,y:-.06}, t:0.5 } },
      acknowledged:{ preview:{ guise:"restored", pose:"torso_open", smile:.28, browUp:.30,
                             eyeWide:.14, gaze:{x:0,y:.02}, t:0.5 } },
      weeping:   { preview:{ guise:"restored", pose:"grief", frown:.6, browKnit:.5, browUp:.4,
                             eyeNarrow:.2, gaze:{x:0,y:.5}, t:0.5 } },
      plotting:  { preview:{ guise:"restored", pose:"offering_hand", smile:.30, mouthAsym:.54,
                             browKnit:.30, eyeNarrow:.36, gaze:{x:.34,y:.06}, t:0.4 } },
      reveiled:  { preview:{ guise:{from:"restored",to:"beggar",u:0.72},
                             pose:"three_quarter_left", browKnit:.28, eyeNarrow:.24,
                             gaze:{x:-.20,y:.16}, t:0.5 } },
    },
    edges:[["neutral","crafty"],["neutral","begging"],["begging","watching"],
           ["watching","revealing"],["revealing","acknowledged"],
           ["acknowledged","weeping"],["weeping","plotting"],["plotting","reveiled"],
           ["reveiled","begging"],["neutral","remembered"]],
  },

  /* CARD SIGNATURE — unchanged from the exemplar, so the card catalog reads
     continuous with Books I–XV. */
  preview:()=>({ guise:"king", pose:"offering_hand",
                 smile:.52, mouthAsym:.62, browUp:.4, browKnit:.12, eyeNarrow:.3,
                 gaze:{x:.42,y:-.06}, t:0.4, status:"CRAFTY", progress:.22 }),

  /** the surface at a moment — divine-fx assets read this so the flare is
      tinted to the body it is transforming, not to a guessed grey. */
  surfaceAt(state){ return fig.specAt(state && state.guise); },

  draw(ctx, W, H, state){
    return fig.draw(ctx, W, H, state || {});
  },
};
export default asset;
