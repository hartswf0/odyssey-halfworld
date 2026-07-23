/* character.antinous — the ringleader of the suitors.
   CHARACTER asset. Young, strong, arrogant noble: fine tunic + cloak, a
   short well-kept beard, and a face built to accuse. His whole body is a
   jabbing finger — the confident predator who reframes his own greed as a
   grievance against Penelope.
   Atlas scene: OD-B02-S02 — the confident accuser. */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* ---- bespoke poses: the accusatory jab + the commanding sneer stance.
   Registered additively onto the shared rig table so the runtime can drive
   them by id. A hard forward point of the right arm, shoulders squared,
   chest thrown open, weight rocked onto the front foot. */
HERO_POSES.jabbing_accusation = {
  id:"jabbing_accusation", label:"jabbing accusation", group:"emotion",
  n:{ bodyYaw:-.22, spineLean:-.24, chestOpen:.5, rootScale:1.08,
      armRUpper:-1.62, armRLower:.06, handRotR:.1, shoulderLiftR:.2,
      armLUpper:-.34, armLLower:-.62, handRotL:-.2,
      headYaw:-.22, gazeX:-.4, browKnit:.7, eyeNarrow:.4, frown:.35, mouthAsym:.6 },
  opt:{ hands:["fist","point"] },
};
HERO_POSES.commanding_stance = {
  id:"commanding_stance", label:"commanding stance", group:"emotion",
  n:{ bodyYaw:.14, spineLean:.1, chestOpen:.7, rootScale:1.06,
      armLUpper:-.98, armLLower:-1.2, armRUpper:.7, armRLower:1.35,
      handRotL:-.35, handRotR:.35, browKnit:.4, eyeNarrow:.3, mouthAsym:.55 },
  opt:{ hands:["fist","relaxed"] },
};

const params = {
  skin:"#d8c2a4", hairColor:"#20170f",
  hair:"short", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.02,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.antinous",
  type:"CHARACTER",
  name:"Antinous",
  statusWord:"ARROGANT",
  scene:"OD-B02-S02",

  params,
  layers:["shadow","cloak","hair-back","legs","torso","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    rightHand:{x:.74,y:.50}, leftHand:{x:.36,y:.62},
    accusingFinger:{x:.80,y:.48}, cupGrip:{x:.34,y:.62},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // baseline swagger — chin up, three-quarter, a cool contemptuous look
      neutral:  { preview:{ pose:"three_quarter_right", gaze:{x:.18,y:-.06},
                            browKnit:.2, eyeNarrow:.22, mouthAsym:.4, t:0.5 } },
      // mid-speech — jaw dropped on a word, brows knit, sneer holding
      speaking: { preview:{ pose:"commanding_stance", jaw:.5, browKnit:.45,
                            eyeNarrow:.28, mouthAsym:.5, gaze:{x:.1,y:-.04}, t:0.5 } },
      // THE SIGNATURE — the jabbing accusatory point: arm thrust out, finger
      // extended, brows crushed down, eyes narrowed, mouth skewed in a sneer
      accusing: { preview:{ pose:"jabbing_accusation", browKnit:.72, eyeNarrow:.42,
                            frown:.35, mouthAsym:.6, jaw:.22, gaze:{x:-.42,y:.02}, t:0.5 } },
      // sneering scorn — lip curled, chin lifted, looking down his nose
      sneering: { preview:{ pose:"skepticism", browKnit:.4, browUp:.16,
                            eyeNarrow:.45, mouthAsym:.72, gaze:{x:-.2,y:-.1}, t:0.5 } },
      // full command — both arms squared, laying down the law of the hall
      demanding:{ preview:{ pose:"confrontation", browKnit:.7, eyeNarrow:.35,
                            frown:.45, mouthAsym:.4, jaw:.3, gaze:{x:0,y:0}, t:0.5 } },
    },
    edges:[["neutral","speaking"],["speaking","neutral"],["neutral","accusing"],
           ["accusing","sneering"],["neutral","sneering"],["neutral","demanding"],
           ["speaking","accusing"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — ARROGANT: the accuser mid-jab. Right arm thrust forward,
  // finger pointed off-frame at Penelope, brows crushed into a knot, eyes
  // narrowed to slits, mouth skewed into a sneer. Predation dressed as grievance.
  preview:()=>({ pose:"jabbing_accusation",
                 browKnit:.72, eyeNarrow:.42, frown:.35, mouthAsym:.6, jaw:.22,
                 gaze:{x:-.42,y:.02}, t:0.5, status:"ARROGANT", progress:.28 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
