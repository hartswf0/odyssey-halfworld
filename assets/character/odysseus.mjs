/* character.odysseus — the crafty king of Ithaca.
   EXEMPLAR CHARACTER asset. Reference module for the writer agents:
   shows how a CHARACTER composes the engine figure rig, declares anchors,
   a state machine, animation channels, and a neutral preview.
   Atlas: appears in 63 scenes — the continuity spine of the whole poem. */
import { makeFigure, INK } from "/engine/halfworld-engine.mjs";

const params = {
  skin:"#cdb89a", hairColor:"#241d16",
  hair:"curly", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.odysseus",
  type:"CHARACTER",
  name:"Odysseus",
  statusWord:"CRAFTY",
  scene:"OD-B05-S03",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    spearGrip:{x:.68,y:.55}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // calm baseline — three-quarter stance, quiet gaze, ghost of a smile
      neutral:  { preview:{ pose:"three_quarter_left", gaze:{x:-.14,y:.02},
                            smile:.12, browUp:.06, t:0.5 } },
      // mid-oration — arms thrown open, jaw dropped on a vowel, brows up
      speaking: { preview:{ pose:"torso_open", jaw:.6, smile:.3, browUp:.34,
                            eyeWide:.18, gaze:{x:.05,y:-.02}, t:0.5 } },
      // the signature: crafty half-smile + one lifted brow + open persuasive palm
      crafty:   { preview:{ pose:"offering_hand", smile:.52, mouthAsym:.62,
                            browUp:.4, browKnit:.12, eyeNarrow:.3,
                            gaze:{x:.42,y:-.06}, t:0.4 } },
      // grief — brows knit AND lift, mouth pulls down, head bows, eyes cast low
      grieving: { preview:{ pose:"grief", frown:.6, browKnit:.5, browUp:.4,
                            eyeNarrow:.2, gaze:{x:0,y:.5}, t:0.5 } },
      // hailing the shore — arm flung up, mouth open on a shout, eyes wide
      hailing:  { preview:{ pose:"one_arm_raised", jaw:.42, smile:.34,
                            browUp:.52, eyeWide:.34, gaze:{x:.1,y:-.12}, t:0.5 } },
      // striding on — walk cycle, jaw set, a determined knit
      striding: { preview:{ pose:"walk_neutral", browKnit:.2, eyeNarrow:.12,
                            gaze:{x:.08,y:0}, t:0.35 } },
    },
    edges:[["neutral","speaking"],["speaking","neutral"],["neutral","crafty"],
           ["neutral","grieving"],["neutral","hailing"],["neutral","striding"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — CRAFTY: a knowing half-smile (smile + skewed mouth),
  // one raised brow, sly narrowed eyes, gaze slid sideways as he sizes you up,
  // and an open-palm persuasive gesture reaching out of frame.
  preview:()=>({ pose:"offering_hand",
                 smile:.52, mouthAsym:.62, browUp:.4, browKnit:.12, eyeNarrow:.3,
                 gaze:{x:.42,y:-.06}, t:0.4, status:"CRAFTY", progress:.22 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
