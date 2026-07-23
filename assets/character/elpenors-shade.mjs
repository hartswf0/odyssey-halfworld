/* character.elpenors-shade — the newly-dead sailor, met first among the dead.
   CHARACTER asset. Reuses Elpenor's YOUTH identity (slight build, short
   stature, beardless, tousled hair, a plain sailor's tunic, bare legs) but
   recast as a PALE TRANSLUCENT shade: pale skin, hollow recessed eyes, the
   figure drawn faint so the dotify pass yields a wispy half-there ghost, and
   the lower body washed out into the paper (a shade has no solid footing).
   Expressive signature: an imploring two-handed reach + a bewildered pleading
   face — newly dead, confused but specific, begging for burial and memory.
   Built on the engine hero rig; registers bespoke reaching/drift poses.
   Atlas: OD-B11-S02 (the first shade at the pit — pleads for completion). */
import { makeFigure, HERO_POSES } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke poses (additive; shared table). Distinct ids so they never
   collide with the living Elpenor's tumble poses. ---- */
HERO_POSES.shade_implore = { id:"shade_implore", label:"imploring reach", group:"shade",
  n:{ spineLean:-.34, chestOpen:.7, headPitch:-.05,
      armLUpper:.92, armLLower:-.60, armRUpper:-.92, armRLower:.60,
      shoulderLiftL:.5, shoulderLiftR:.5, rootY:-.06, rootScale:.99,
      hipL:.05, kneeL:.06, hipR:-.05, kneeR:.06 },
  opt:{ hands:["offering","offering"] } };

HERO_POSES.shade_bewildered = { id:"shade_bewildered", label:"bewildered plea", group:"shade",
  n:{ spineLean:.06, headRoll:.22, headYaw:.16, neckRoll:.12,
      armLUpper:.50, armLLower:-.42, armRUpper:-.92, armRLower:.86,
      shoulderLiftR:.34, rootY:-.06, rootScale:.98,
      hipL:.05, kneeL:.06, hipR:-.05, kneeR:.06 },
  opt:{ hands:["relaxed","palm_up"] } };

HERO_POSES.shade_drift = { id:"shade_drift", label:"wispy drift", group:"shade",
  n:{ spineLean:.04, headPitch:.14, headRoll:.08, rootY:-.10, rootScale:.96,
      armLUpper:.40, armLLower:-.50, armRUpper:-.40, armRLower:.50,
      hipL:.04, kneeL:.05, hipR:-.04, kneeR:.05 }, opt:{} };

/* Elpenor's youth identity, paled out for the shade. */
const params = {
  skin:"#ece3d1", hairColor:"#6b5c46",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:0.86,
};

const fig = makeFigure(params);

// head radius the rig will use, for placing the hollow eye sockets
const HEAD_R = (W,H)=> Math.min(H*0.9, W*1.26) * (params.scale||1) * 0.105;

export const asset = {
  id:"character.elpenors-shade",
  type:"CHARACTER",
  name:"Elpenor's shade",
  statusWord:"PLEADING",
  scene:"OD-B11-S02",

  params,
  layers:["lower-fade","shadow","hair-back","legs","torso","far-arm","neck","head","face","hollow-eyes","hair-front","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.24}, crown:{x:.50,y:.16}, eyes:{x:.50,y:.25},
    rightHand:{x:.70,y:.52}, leftHand:{x:.30,y:.52},
    hip:{x:.50,y:.64}, feet:{x:.50,y:.92},
  },
  states:{
    initial:"pleading",
    nodes:{
      // OD-B11-S02 — each node sets its own face channels; the plea rides on
      // high-raised inner brows (worry), wide staring eyes, a fallen-open mouth.
      // the signature: both hands reaching out of the pit, begging for burial
      pleading:  { preview:{ pose:"shade_implore", gaze:{x:.05,y:-.28},
                             browUp:.85, browKnit:.34, eyeWide:.55, jaw:.34,
                             frown:.22, t:0.5 } },
      // newly dead and disoriented — head tilted, one palm turned up in question
      confused:  { preview:{ pose:"shade_bewildered", gaze:{x:.22,y:-.04},
                             browUp:.7, browKnit:.46, eyeWide:.42, jaw:.2,
                             mouthAsym:.34, t:0.5 } },
      // speaking his specific need — memory, a barrow, his oar planted on it
      speaking:  { preview:{ pose:"reach_forward", gaze:{x:.1,y:-.14},
                             browUp:.6, browKnit:.24, eyeWide:.32, jaw:.56,
                             t:0.5 } },
      // drifting — the plea spent, the shade thins and sinks back toward Erebus
      drifting:  { preview:{ pose:"shade_drift", gaze:{x:-.06,y:.14},
                             browUp:.4, eyeNarrow:.26, jaw:.14, mouthAsym:.16,
                             frown:.2, t:0.5 } },
    },
    edges:[["pleading","confused"],["confused","speaking"],["speaking","pleading"],
           ["pleading","drifting"],["drifting","pleading"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","blink"],

  // CARD SIGNATURE — PLEADING: the pale shade pitched forward, both hands
  // reaching out of frame in an imploring beg, inner brows shot up in worry,
  // eyes staring wide and hollow, mouth fallen open on his name. Faint,
  // half-there, unmistakably a newly-dead soul asking to be made whole.
  preview:()=>({ pose:"shade_implore", gaze:{x:.05,y:-.28},
                 browUp:.85, browKnit:.34, eyeWide:.55, jaw:.34, frown:.22,
                 t:0.5, status:"PLEADING", progress:.14 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;

    // wispy translucency: draw the whole figure faint so the dotify pass thins
    // the ink and lets the paper bleed through — a half-there shade. Pale skin
    // (near paper) means the body barely stamps dots; the contour carries it.
    ctx.save();
    ctx.globalAlpha = (state && typeof state.ghostAlpha==="number") ? state.ghostAlpha : 0.52;
    const r = fig.draw(ctx, W, H, state);

    // hollow eyes: recessed dark sockets sunk over the rig's eyes, so the shade
    // stares out of empty hollows. Placed from the returned head anchor.
    if (r && r.anchors && r.anchors.head && !(state && state.noHollow)){
      const hx = r.anchors.head.x*W, hy = r.anchors.head.y*H, R = HEAD_R(W,H);
      ctx.fillStyle = "#2b2b2b";
      for (const s of [-1,1]){
        ctx.beginPath();
        ctx.ellipse(hx + s*R*0.34, hy - R*0.05, R*0.17, R*0.23, 0, 0, Math.PI*2);
        ctx.fill();
      }
    }
    ctx.restore();

    // faint lower body: wash the legs out into the paper (white == offscreen
    // field) with a downward gradient, so the shade dissolves below the waist.
    const gy0 = H*0.55;
    const grad = ctx.createLinearGradient(0, gy0, 0, H);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.6, "rgba(255,255,255,0.62)");
    grad.addColorStop(1, "rgba(255,255,255,0.92)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, gy0, W, H - gy0);

    return r;
  },
};
export default asset;
