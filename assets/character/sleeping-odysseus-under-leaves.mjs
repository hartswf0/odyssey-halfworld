/* character.sleeping-odysseus-under-leaves — Book 6.
   Odysseus washed ashore on Scheria: salt-crusted, curled asleep in a
   mound of dead leaves under the twin olive-thickets, then stirring awake
   to a girl's voice on the wind. Keeps his identity (skin / curly hair /
   beard) but reclines — the hero rig is rotated to lie the figure down,
   a leaf-litter drift is drawn over the lower body, and the FACE carries
   the performance: closed lids -> half-open -> alert listening.
   Scene: OD-B06-S02 (hidden body shifting from deep sleep to alert). */
import { makeFigure, HERO_POSES, INK, clamp01, rnd } from "../../engine/halfworld-engine.mjs";

const params = {
  skin:"#c9bda6", hairColor:"#241d16",      // pale, salt-drained skin
  hair:"curly", beard:true, glasses:false,
  garment:"rags", cloak:false, bareLegs:true, scale:0.76,
};

const fig = makeFigure(params);

/* ---- bespoke poses: a tight fetal curl + a rising, listening lift ----
   Registered additively onto the shared hero table so the rig can drive them. */
HERO_POSES.curl_deep = { id:"curl_deep", label:"curled asleep", group:"torso",
  n:{ bodyYaw:-.28, crouch:1, spineLean:-.5, headPitch:.5, headRoll:.18, headY:.14,
      kneeL:1.55, kneeR:1.4, hipL:-.9, hipR:-.72, ankleL:.5, ankleR:.4,
      armLUpper:-.5, armLLower:-1.7, armRUpper:.42, armRLower:1.5,
      shoulderLiftL:.4, shoulderLiftR:.4, rootY:.16 },
  opt:{ hands:["relaxed","relaxed"] } };

HERO_POSES.curl_stir = { id:"curl_stir", label:"stirring", group:"torso",
  n:{ bodyYaw:-.34, crouch:.86, spineLean:-.32, headPitch:.24, headRoll:.06, headY:.06,
      kneeL:1.35, kneeR:1.2, hipL:-.78, hipR:-.6,
      armLUpper:-.42, armLLower:-1.4, armRUpper:.55, armRLower:1.1,
      shoulderLiftL:.28, shoulderLiftR:.2, rootY:.12 },
  opt:{ hands:["relaxed","relaxed"] } };

HERO_POSES.curl_listen = { id:"curl_listen", label:"alert listening", group:"torso",
  n:{ bodyYaw:-.4, crouch:.7, spineLean:-.12, headPitch:-.16, headYaw:.34, headRoll:-.05,
      kneeL:1.05, kneeR:.95, hipL:-.62, hipR:-.48,
      armLUpper:-.3, armLLower:-1.15, armRUpper:-1.15, armRLower:.55,
      shoulderLiftL:.18, rootY:.06 },
  opt:{ hands:["relaxed","relaxed"] } };

/* how far to tip the whole figure onto the ground (radians, counter-clockwise) */
const RECLINE = -1.06;

/* leaf-litter drift drawn over the lower body, in the rotated figure frame.
   Flat mid-grays + hard ink veins; the engine POST pass supplies the dots.
   Kept LIGHT and contained so distinct leaf shapes read instead of one blob. */
function drawLeaf(ctx, x, y, s, rot, fill){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
  ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-s,0);
  ctx.quadraticCurveTo(0,-s*0.6, s,0);
  ctx.quadraticCurveTo(0, s*0.6, -s,0);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-s*0.85,0); ctx.lineTo(s*0.85,0); ctx.stroke();
  ctx.restore();
}
function drawLeaves(ctx, W, H){
  const R = rnd(60613);
  // drift band over hips->shins in local (upright) coords; once reclined this
  // is the buried lower half. Contained so it does not swamp the figure.
  const cx = W*0.52, top = H*0.60, bot = H*0.90, wid = W*0.34;
  // light packed bed behind the loose leaves
  ctx.fillStyle = "#a29d92"; ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx-wid*0.8, bot);
  ctx.bezierCurveTo(cx-wid*0.9, top+H*.05, cx-wid*.3, top, cx, top+H*.015);
  ctx.bezierCurveTo(cx+wid*.5, top-H*.005, cx+wid*0.88, top+H*.06, cx+wid*0.8, bot);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  const tones = ["#b6b1a5","#8d8980","#a7a296"];
  const N = 64;
  for (let i=0;i<N;i++){
    const u = R(), v = R();
    const x = cx + (u*2-1)*wid*0.9;
    const y = top + v*(bot-top)*0.96 + H*0.015;
    if (Math.abs(x-cx) > wid*(0.5+0.5*(y-top)/(bot-top))) continue;
    const s = H*(0.024 + R()*0.024);
    drawLeaf(ctx, x, y, s, (R()*2-1)*Math.PI, tones[(i*5+((v*97)|0))%tones.length]);
  }
  // a few loose leaves spilling off the mound toward the chest / off the edge
  for (let i=0;i<9;i++){
    const x = cx + (R()*2-1)*wid*0.85;
    const y = top - H*0.015 - R()*H*0.05;
    drawLeaf(ctx, x, y, H*(0.018+R()*0.016), (R()*2-1)*Math.PI, tones[i%tones.length]);
  }
}

export const asset = {
  id:"character.sleeping-odysseus-under-leaves",
  type:"CHARACTER",
  name:"Sleeping Odysseus under leaves",
  statusWord:"BURIED",
  scene:"OD-B06-S02",

  params,
  layers:["ground","leaf-bed","shadow","legs","torso","far-arm","neck","head",
          "face","hair","beard","near-arm","leaf-litter"],
  // normalized 0..1 anchors — the reclined figure reads left-to-right:
  // head at left, buried feet at right, leaf mound over the lower body.
  anchors:{
    head:{x:.34,y:.40}, crown:{x:.28,y:.36}, eyes:{x:.35,y:.41},
    ear:{x:.40,y:.36}, chest:{x:.50,y:.56},
    buriedHip:{x:.62,y:.66}, buriedFeet:{x:.82,y:.78},
    leafMound:{x:.66,y:.70}, restingHand:{x:.42,y:.52},
  },
  states:{
    initial:"deep_sleep",
    nodes:{
      // deep sleep — lids sealed, brows soft, mouth slack, curled tight
      deep_sleep: { preview:{ pose:"curl_deep", blink:1, browUp:.05, jaw:.06,
                              smile:0, gaze:{x:0,y:.2}, t:0.5 } },
      // stirring — lids cracking, a small knit as the voice reaches him
      stirring:   { preview:{ pose:"curl_stir", blink:.55, browUp:.12, browKnit:.18,
                              eyeNarrow:.4, jaw:.04, gaze:{x:.2,y:.1}, t:0.5 } },
      // alert listening — eyes open, brows up, head turned toward the sound
      listening:  { preview:{ pose:"curl_listen", blink:0, browUp:.5, browKnit:.14,
                              eyeWide:.4, jaw:.1, gaze:{x:.55,y:-.08}, t:0.5 } },
    },
    edges:[["deep_sleep","stirring"],["stirring","listening"],
           ["listening","stirring"],["stirring","deep_sleep"]],
  },
  channels:["gaze","mouth","breath","pose","blink",
            "smile","browUp","browKnit","eyeWide","eyeNarrow","jaw"],

  // CARD SIGNATURE — BURIED: the deep-sleep beat. Body wound into a tight
  // fetal curl and tipped onto the sand, sealed lids, brows soft, one hand
  // near the face — the lower half swallowed by a drift of dead leaves.
  preview:()=>({ pose:"curl_deep", blink:1, browUp:.05, jaw:.06,
                 gaze:{x:0,y:.2}, t:0.5, status:"BURIED", progress:.18 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // recline the whole figure onto the ground, pivoting about its centroid,
    // then nudge the reclined mass up-left so it sits centered on the card.
    const cx = W*0.50, cy = H*0.56;
    ctx.save();
    ctx.translate(-W*0.15, -H*0.15);
    ctx.translate(cx, cy);
    ctx.rotate(RECLINE);
    ctx.translate(-cx, -cy);
    const res = fig.draw(ctx, W, H, state);
    // leaf litter over the lower/buried half — inside the same reclined frame
    drawLeaves(ctx, W, H);
    ctx.restore();
    return res;
  },
};
export default asset;
