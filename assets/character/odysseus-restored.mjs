/* character.odysseus-restored — the man made radiant again.
   The SAME Odysseus (same skin, same curly hair, same beard) as the king and
   the Trojan beggar — but bathed by Phaeacian handmaids, anointed, and stood
   up to his full height. Where the beggar was grizzled, folded into a furtive
   stoop with disciplined eyes hidden under a bowed brow, this asset is the
   inversion: hair and beard clean and combed, a fresh tunic + cloak, the spine
   pulled UPRIGHT, chest lifted, chin level, a serene composed calm on the face,
   and a faint divine radiance breathed around him by Athena. The whole point of
   the asset is that contrast — the beaten mendicant restored to controlled,
   dignified beauty. Atlas performance: OD-B06-S04 (grime + concealment ->
   bathed dignity). Shares Odysseus' identity params so all three skins render
   as one man. */
import { makeFigure, HERO_POSES, INK } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke poses: register additively onto the shared rig table ----
   The library's grand poses (torso_open, arms_open) read as oration, not
   restored bearing. We author an upright, chest-lifted regal stance and a
   calm presenting gesture — dignity, not theatre. */
HERO_POSES.restored_bearing = { id:"restored_bearing", label:"restored bearing", group:"emotion",
  n:{ spineLean:.05, chestLift:.9, chestOpen:.24,          // spine pulled tall, chest open + lifted
      shoulderLiftL:.06, shoulderLiftR:.06,                // shoulders squared, not drawn up
      armLUpper:.30, armLLower:-.18, handRotL:-.06,        // arms hang easy and composed
      armRUpper:-.24, armRLower:.14, handRotR:.06,
      hipL:.02, hipR:-.02, browUp:.08, smile:.12, rootScale:1.0 },
  opt:{ hands:["relaxed","relaxed"] } };

HERO_POSES.restored_reveal = { id:"restored_reveal", label:"restored reveal", group:"emotion",
  n:{ spineLean:.07, chestLift:1.0, chestOpen:.5,          // upright, radiant, presented
      shoulderLiftL:.08, shoulderLiftR:.08,
      armLUpper:.74, armLLower:-.30, handRotL:-.16,        // both arms open in a calm, dignified present
      armRUpper:-.74, armRLower:.30, handRotR:.16,
      browUp:.14, smile:.14, rootScale:1.0 },
  opt:{ hands:["open_palm","open_palm"] } };

const params = {
  skin:"#cdb89a", hairColor:"#241d16",   // same Odysseus skin; hair clean + combed again (king's tone)
  hair:"curly", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.08,  // taller — stood to full height
};

const fig = makeFigure(params);

/* faint divine radiance — a ring of short light-gray rays breathed around the
   crown. Drawn in a pale tone so the engine's dotify POST pass renders it as a
   sparse halo of faint dots, never a solid mass. Drawn BEFORE the figure so the
   figure paints cleanly over it. */
function drawRadiance(ctx, W, H, head){
  const cx = head.x*W, cy = head.y*H;
  const r0 = W*0.19, r1 = W*0.30;   // ring sits just outside the head
  ctx.save();
  ctx.strokeStyle = "#d6d6d1";       // pale -> faint dots under dotify
  ctx.lineCap = "round";
  const N = 22;
  for (let i=0;i<N;i++){
    const a = (i/N)*Math.PI*2 - Math.PI/2;
    const wob = (i%2)? 0.86 : 1.0;   // alternating ray length for a shimmer feel
    ctx.lineWidth = (i%2)? 2.2 : 3.4;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
    ctx.lineTo(cx+Math.cos(a)*r1*wob, cy+Math.sin(a)*r1*wob);
    ctx.stroke();
  }
  // a soft aura ring
  ctx.strokeStyle = "#e0e0db"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r0*0.92, 0, Math.PI*2); ctx.stroke();
  ctx.restore();
}

export const asset = {
  id:"character.odysseus-restored",
  type:"CHARACTER",
  name:"Odysseus restored",
  statusWord:"RADIANT",
  scene:"OD-B06-S04",

  params,
  layers:["radiance","shadow","hair-back","legs","torso","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors — raised / squared vs the stooped beggar
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    rightHand:{x:.68,y:.56}, leftHand:{x:.32,y:.56},
    shoulder:{x:.50,y:.36}, hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"composed",
    nodes:{
      // SIGNATURE — stood to full height, arms opening in a calm present, a
      // serene faint smile, level gaze, radiance around the crown. Restored.
      radiant:  { preview:{ pose:"restored_reveal", smile:.16, browUp:.16,
                            eyeWide:.06, gaze:{x:0,y:-.04}, t:0.5 } },
      // COMPOSED — the baseline noble stance: upright, chest lifted, arms easy,
      // a quiet dignified calm, eyes level and untroubled.
      composed: { preview:{ pose:"restored_bearing", smile:.12, browUp:.06,
                            gaze:{x:.04,y:0}, t:0.5 } },
      // SPEAKING — measured, gracious address to his hosts: jaw dropped on a
      // vowel, brows lifted a touch, warm and open, still upright.
      speaking: { preview:{ pose:"restored_reveal", jaw:.44, smile:.24,
                            browUp:.3, eyeWide:.12, gaze:{x:.06,y:-.02}, t:0.5 } },
      // GREETING — a dignified salute to the shore that received him, one arm
      // lifted, chin high, a clear open face.
      greeting: { preview:{ pose:"one_arm_raised", smile:.2, browUp:.24,
                            eyeWide:.14, gaze:{x:.12,y:-.1}, t:0.5 } },
      // WALKING — moving out to the hall at full, unbent height, calm and even.
      walking:  { preview:{ pose:"walk_neutral", browUp:.06, smile:.08,
                            gaze:{x:.06,y:0}, t:0.35 } },
    },
    edges:[["composed","radiant"],["radiant","composed"],["composed","speaking"],
           ["speaking","composed"],["composed","greeting"],["composed","walking"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — RADIANT: Odysseus stood to his full restored height, arms
  // opening in a calm dignified present, a serene faint smile, level untroubled
  // gaze, and a faint divine radiance ringing his crown.
  preview:()=>({ pose:"restored_reveal", smile:.16, browUp:.16, eyeWide:.06,
                 gaze:{x:0,y:-.04}, t:0.5, status:"RADIANT", progress:.24 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // radiance behind: pre-paint a faint halo at the head anchor, then the
    // figure draws cleanly on top. (Uses the declared head anchor so it sits
    // right whether or not the rig has drawn yet.)
    drawRadiance(ctx, W, H, this.anchors.head);
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
