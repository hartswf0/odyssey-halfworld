/* character.odysseus-as-trojan-beggar — the disguise.
   Odysseus stripped of his king's tunic: same skin, same curly hair and
   beard (grizzled and filthy now), but scarred, in torn rags, folded down
   into a furtive stoop. The body reads as a beaten mendicant; the FACE does
   not — the eyes stay disciplined, narrow, sharply awake, sliding sideways
   from under a bowed brow. The whole point of the asset is that contrast:
   a wreck of a posture CONTAINING watchful observation and coiled force.
   Atlas performance: OD-B04-S03. Shares Odysseus' identity params so the
   two modules render as the same man in two skins. */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* ---- bespoke poses: register additively onto the shared rig table ----
   The library has no "hunched beggar", so we author two: a furtive folded
   stoop, and a coiled guarded stance for the concealed-force beat. */
HERO_POSES.beggar_stoop = { id:"beggar_stoop", label:"beggar stoop", group:"emotion",
  n:{ spineLean:-.3, crouch:.2, kneeL:.28, kneeR:.24, hipL:-.08, hipR:.06,
      headPitch:.42, headY:.12, neckPitch:.26,        // head bowed low
      shoulderLiftL:.52, shoulderLiftR:.58,           // shoulders drawn up around the neck
      armLUpper:-.42, armLLower:-1.12, handRotL:-.25, // left arm folded, clutching a bundle to the chest
      armRUpper:-.98, armRLower:.66, handRotR:.16,    // right arm out low, hand cupped to beg
      browKnit:.34, eyeNarrow:.3, rootScale:.9 },
  opt:{ hands:["fist","offering"] } };

HERO_POSES.coiled_watch = { id:"coiled_watch", label:"coiled watch", group:"emotion",
  n:{ spineLean:-.18, crouch:.28, kneeL:.38, kneeR:.32, hipL:-.1, hipR:.08,
      headPitch:.2, headYaw:-.24, neckYaw:-.16, headY:.06,
      shoulderLiftL:.46, shoulderLiftR:.54,
      armLUpper:-.54, armLLower:-1.22, handRotL:-.3,  // both arms hauled in, guarded
      armRUpper:.34, armRLower:1.18, handRotR:.3,
      browKnit:.62, eyeNarrow:.42, frown:.22, rootScale:.92 },
  opt:{ hands:["fist","fist"] } };

const params = {
  skin:"#cdb89a", hairColor:"#2b261f",   // same Odysseus skin; hair grizzled + filthy
  hair:"curly", beard:true, glasses:false,
  garment:"rags", cloak:false, bareLegs:true, scale:0.98,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.odysseus-as-trojan-beggar",
  type:"CHARACTER",
  name:"Odysseus as Trojan beggar",
  statusWord:"WATCHFUL",
  scene:"OD-B04-S03",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors — lowered / stooped from the upright king
  anchors:{
    head:{x:.49,y:.26}, crown:{x:.49,y:.18}, eyes:{x:.49,y:.27},
    rightHand:{x:.66,y:.66}, leftHand:{x:.40,y:.58},
    begBowl:{x:.68,y:.68}, staffGrip:{x:.38,y:.55}, hip:{x:.50,y:.70}, feet:{x:.50,y:.95},
  },
  states:{
    initial:"stooped",
    nodes:{
      // SIGNATURE — folded into a beggar's stoop, cupped hand out, yet the
      // eyes climb up out of the bowed head: narrow, knit, watching you.
      stooped:  { preview:{ pose:"beggar_stoop", browKnit:.34, eyeNarrow:.32,
                            gaze:{x:.06,y:-.36}, jaw:.05, t:0.5 } },
      // DISCIPLINED OBSERVATION — head kept low as cover, gaze slid hard to
      // the side, eyes pinched to slits, cataloguing the room.
      observing:{ preview:{ pose:"head_lowered", browKnit:.4, eyeNarrow:.55,
                            browUp:.05, gaze:{x:-.62,y:-.28}, t:0.42 } },
      // CONCEALED FORCE — the mendicant mask goes hard: arms hauled in,
      // brow slammed together, jaw set, a warrior coiled inside the rags.
      coiled:   { preview:{ pose:"coiled_watch", browKnit:.62, eyeNarrow:.44,
                            frown:.24, jaw:.06, gaze:{x:-.4,y:-.1}, t:0.4 } },
      // BEGGING — the performance for the crowd: palm up, brows lifted in a
      // supplicant's plea, mouth opening on a wheedled word. Pure cover.
      begging:  { preview:{ pose:"offering_hand", browUp:.5, browKnit:.16,
                            frown:.14, jaw:.34, eyeWide:.12, mouthAsym:.3,
                            gaze:{x:.24,y:.16}, t:0.5 } },
      // SHUFFLING — moving through the hall at a beaten, bent walk.
      shuffling:{ preview:{ pose:"walk_neutral", spineLean:-.16, browKnit:.28,
                            eyeNarrow:.3, gaze:{x:.12,y:-.2}, t:0.35 } },
    },
    edges:[["stooped","observing"],["observing","stooped"],["stooped","coiled"],
           ["coiled","stooped"],["stooped","begging"],["stooped","shuffling"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — WATCHFUL: the beggar's stoop, one hand cupped out of
  // frame, and the tell that gives him away — narrowed, knit, disciplined
  // eyes lifted up out of the bowed head, gaze slid sideways to watch.
  preview:()=>({ pose:"beggar_stoop", browKnit:.34, eyeNarrow:.32,
                 gaze:{x:.06,y:-.36}, jaw:.05, t:0.5, status:"WATCHFUL", progress:.2 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
