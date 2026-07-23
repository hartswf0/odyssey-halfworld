/* character.euryalus — the talented, arrogant Phaeacian youth-athlete.
   A young sprinter's build: no beard, short dark hair, a short athletic
   tunic, bare legs. Bearing is cocky — chin up, weight cocked, a sneer
   always ready. His careless insult triggers the games demonstration
   (OD-B08-S03); his pride then softens into a formal apology + gift
   transfer (OD-B08-S04). Composes the shared hero rig; registers three
   bespoke poses (cocky idle / dismissive flick / apology bow). */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* ---- bespoke poses: mutate the shared table ADDITIVELY ---- */
// cocky idle — arms crossed, weight cocked onto one hip, chin lifted,
// shoulders squared. A young athlete sizing you up.
HERO_POSES.euryalus_cocky = { id:"euryalus_cocky", label:"cocky idle", group:"euryalus",
  n:{ bodyYaw:.24, headYaw:-.16, headPitch:-.15, headRoll:.06,
      armLUpper:-1.0, armLLower:-1.34, armRUpper:1.0, armRLower:1.34,
      handRotL:-.4, handRotR:.4, weightShift:.7, pelvisX:.26, pelvisRot:.06,
      hipL:.18, hipR:-.06, shoulderTilt:.1, rootScale:1.03 },
  opt:{ hands:["fist","fist"] } };
// dismissive flick — head thrown away, nose up, a scornful hand flicked
// out to the side. The careless insult, made flesh.
HERO_POSES.euryalus_dismiss = { id:"euryalus_dismiss", label:"dismissive flick", group:"euryalus",
  n:{ bodyYaw:.30, headYaw:.52, gazeX:.62, headPitch:-.12, headRoll:.1,
      spineLean:.16, armRUpper:-1.8, armRLower:-.22, handRotR:.5,
      shoulderLiftR:.3, armLUpper:.4, armLLower:-.7, rootScale:1.04 },
  opt:{ hands:["relaxed","open_palm"] } };
// apology bow — pride broken, a deep formal bow from the waist, one hand
// extended forward offering the guest-gift.
HERO_POSES.euryalus_apology = { id:"euryalus_apology", label:"apology bow", group:"euryalus",
  n:{ bodyYaw:-.12, spineLean:-.52, headPitch:.52, headY:.14, neckPitch:.2,
      armRUpper:-1.08, armRLower:.56, handRotR:.15,
      armLUpper:.28, armLLower:-.5, rootY:.05, rootScale:.98 },
  opt:{ hands:["relaxed","offering"] } };

const params = {
  skin:"#c9b092", hairColor:"#20180f",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:0.98,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.euryalus",
  type:"CHARACTER",
  name:"Euryalus",
  statusWord:"COCKY",
  scene:"OD-B08-S03",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face","hair-front","near-arm"],
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.70,y:.56}, leftHand:{x:.30,y:.56},
    giftGrip:{x:.72,y:.55}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // baseline cockiness — arms crossed, chin up, a resting smirk
      neutral:  { preview:{ pose:"euryalus_cocky", smile:.18, mouthAsym:.5,
                            browUp:.22, eyeNarrow:.18, gaze:{x:-.2,y:-.04}, t:0.5 } },
      // boasting mid-taunt — jaw dropped on a jeer, brow up, wide grin skewed
      taunting: { preview:{ pose:"pointing_arm", jaw:.5, smile:.44, mouthAsym:.55,
                            browUp:.4, eyeWide:.18, gaze:{x:-.5,y:-.02}, t:0.5 } },
      // THE careless insult (OD-B08-S03) — sneer, narrowed eyes, one lifted
      // brow, head turned away, a scornful flick of the hand
      sneering: { preview:{ pose:"euryalus_dismiss", frown:.3, mouthAsym:.75,
                            browUp:.34, browKnit:.14, eyeNarrow:.5,
                            gaze:{x:.6,y:-.06}, t:0.45 } },
      // pride softened (OD-B08-S04) — a formal apology bow, gaze cast down,
      // brows lifted-and-knit in contrition, mouth pressed
      apology:  { preview:{ pose:"euryalus_apology", frown:.24, browUp:.42,
                            browKnit:.34, eyeNarrow:.2, gaze:{x:0,y:.5}, t:0.5 } },
      // offering the gift outright — reaching forward, an earnest half-smile
      offering: { preview:{ pose:"offering_hand", smile:.26, browUp:.3,
                            gaze:{x:.28,y:.08}, t:0.5 } },
    },
    edges:[["neutral","taunting"],["taunting","sneering"],["sneering","apology"],
           ["apology","offering"],["offering","neutral"],["neutral","sneering"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — COCKY: the arrogant sneer that starts the whole
  // episode. Head thrown away, nose up, narrowed eyes, one raised brow, a
  // curled skew of the lip, and a scornful flick of the hand out of frame.
  preview:()=>({ pose:"euryalus_dismiss",
                 frown:.3, mouthAsym:.75, browUp:.34, browKnit:.14, eyeNarrow:.5,
                 gaze:{x:.6,y:-.06}, t:0.45, status:"COCKY", progress:.2 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
