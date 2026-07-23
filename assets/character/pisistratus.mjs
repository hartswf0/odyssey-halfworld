/* character.pisistratus — Nestor's youngest son, the competent young prince.
   CHARACTER asset. Telemachus's road-companion in Book III: he does the
   driving, the hosting, and strikes up an easy peer bond on the ride south.
   Youthful and beardless where Odysseus is bearded and Telemachus dark-haired:
   sun-warmed skin, short sandy hair, a bright open host's face. */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

// A bespoke pose: the reins-in-hand charioteer — both arms forward and low,
// body pitched into the drive, chin up, watching the road. Registered
// additively onto the shared table so the runtime can drive it too.
HERO_POSES.driving_reins = {
  id:"driving_reins", label:"driving reins", group:"torso",
  n:{ spineLean:-.30, headPitch:-.14, chestLift:.2,
      armLUpper:.62, armLLower:-.9, armRUpper:-.62, armRLower:.9,
      handRotL:.2, handRotR:-.2, weightShift:.2, pelvisX:.06 },
  opt:{ hands:["fist","fist"] },
};

const params = {
  skin:"#dcc19a", hairColor:"#6b4a2a",   // sun-warmed skin, sandy-brown hair
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.02,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.pisistratus",
  type:"CHARACTER",
  name:"Pisistratus",
  statusWord:"GRACIOUS",
  scene:"OD-B03-S06",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face","hair-front","near-arm"],
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.66,y:.62}, leftHand:{x:.34,y:.62},
    reinGrip:{x:.62,y:.58}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // easy baseline — three-quarter RIGHT (mirrors Odysseus's left stance),
      // relaxed open face, the ghost of a young man's ready smile
      neutral:  { preview:{ pose:"three_quarter_right", gaze:{x:.16,y:.02},
                            smile:.16, browUp:.08, t:0.5 } },
      // THE SIGNATURE — hosting: arms flung open in welcome, broad warm smile,
      // brows lifted, eyes bright, greeting a guest into his father's halls
      hosting:  { preview:{ pose:"arms_open", smile:.62, browUp:.4, eyeWide:.22,
                            gaze:{x:0,y:-.02}, jaw:.14, t:0.5 } },
      // driving — the competent charioteer, reins in both fists, pitched into
      // the road, jaw set, a determined little knit as he handles the team
      driving:  { preview:{ pose:"driving_reins", browKnit:.16, eyeNarrow:.1,
                            browUp:.05, gaze:{x:.1,y:-.06}, t:0.4 } },
      // the peer bond — an open, animated aside, offering hand out, jaw dropped
      // mid-word, easy grin: talking to Telemachus like an equal
      bonding:  { preview:{ pose:"offering_hand", smile:.4, jaw:.4, browUp:.28,
                            eyeWide:.14, gaze:{x:.34,y:-.04}, t:0.5 } },
      // shared laughter — head back, eyes creased, the easy warmth of the ride
      laughing: { preview:{ pose:"laughter", smile:1, jaw:.7, eyeNarrow:.6,
                            cheek:.5, browUp:.2, gaze:{x:.06,y:.02}, t:0.5 } },
    },
    edges:[["neutral","hosting"],["hosting","neutral"],["neutral","driving"],
           ["driving","neutral"],["neutral","bonding"],["bonding","laughing"],
           ["laughing","neutral"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","cheek"],

  // CARD SIGNATURE — GRACIOUS: the young host, arms opened wide in welcome,
  // a broad warm smile, brows up and eyes bright, greeting a guest.
  preview:()=>({ pose:"arms_open",
                 smile:.62, browUp:.4, eyeWide:.22, jaw:.14,
                 gaze:{x:0,y:-.02}, t:0.5, status:"GRACIOUS", progress:.2 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
