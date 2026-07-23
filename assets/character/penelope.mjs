/* character.penelope — the veiled queen of Ithaca, faithful wife who waits.
   CHARACTER asset. Mature woman in a long dress under a sheer drawn veil,
   long hair framing the face; stable identity across views.
   Scene function: OD-B01-S06 — the veiled queen descends the stair in grief,
   then draws back in astonishment. Built on the engine hero rig with a custom
   veil hood (in front) and a long hair drape (behind), both in solid grays so
   the engine's dotify POST pass supplies the halftone. */
import { makeFigure, INK, gray } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

const params = {
  skin:"#e0d9cb", hairColor:"#33291f",
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:0.97,
};

const fig = makeFigure(params);

/* ---- custom poses for Penelope's dramatic beats ----
   The engine reads brow/frown channels ONLY from the pose definition, so the
   grief-with-a-lifted-hand signature needs its own pose. POSES is a module
   singleton shared with figure-hero, so registering here makes these ids
   resolvable by the rig's composeStatic. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"penelope", n, opt:hands?{hands}:{} }; }
// SIGNATURE — veiled queen in sorrow: grief brows (browUp+knit) + heavy frown,
// head bowed and gaze cast down, the near hand lifted to the veil at the cheek,
// the far hand drawn across the body clutching the breast.
P("penelope_grief", {
  browUp:.62, browKnit:.5, frown:.6, eyeNarrow:.22,
  headPitch:.3, headY:.12, neckPitch:.16, headRoll:.08, gazeY:.42, gazeX:.05,
  spineLean:.1,
  shoulderLiftL:.66, armLUpper:-.64, armLLower:-2.12, handRotL:.42,   // front hand lifted to the veil/cheek
  armRUpper:-.16, armRLower:.34, shoulderLiftR:.08,                    // far arm hangs at her side, uncrossed
}, ["open_palm","relaxed"]);
// a hand pressed higher, fingers to the temple — a deeper collapse into grief
P("penelope_mourn", {
  browUp:.72, browKnit:.46, frown:.55,
  headPitch:.44, headY:.16, neckPitch:.2, headRoll:.14, gazeY:.5,
  spineLean:.16, shoulderLiftL:.65, armLUpper:-.66, armLLower:-2.12, handRotL:.5,
  armRUpper:.18, armRLower:.7,
}, ["open_palm","relaxed"]);
// pleading / speaking through tears — jaw open, brows still grieved, one hand out
P("penelope_plea", {
  browUp:.7, browKnit:.3, frown:.28, jaw:.42, eyeWide:.18,
  headPitch:-.06, gazeY:-.05,
  spineLean:-.14, armRUpper:-1.12, armRLower:.42, handRotR:.2,
  armLUpper:.2, armLLower:-.3,
}, ["relaxed","offering"]);

/* Long hair drape — a soft mass behind the head/shoulders so the queen reads
   as long-haired even under the veil. Drawn BEFORE the figure (behind it) at
   fixed fractions estimated from the neutral head. Solid gray; dotify does the
   rest. */
function drawHairDrape(ctx, W, H){
  const cx = W*0.50, crownY = H*0.145, shY = H*0.545;
  ctx.fillStyle = gray(0x2c); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.150, crownY + H*0.055);
  ctx.quadraticCurveTo(cx - W*0.185, H*0.30, cx - W*0.150, shY);
  ctx.quadraticCurveTo(cx, shY + H*0.05, cx + W*0.150, shY);
  ctx.quadraticCurveTo(cx + W*0.185, H*0.30, cx + W*0.150, crownY + H*0.055);
  ctx.quadraticCurveTo(cx, crownY - H*0.035, cx - W*0.150, crownY + H*0.055);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

/* Long dress skirt — a bell of cloth falling from the waist to the ankles,
   drawn OVER the rig's legs so the queen reads as robed rather than trousered.
   Solid dress-gray; the dotify pass supplies the weave. Narrow at the waist so
   the hanging hands stay clear at the sides. */
function drawSkirt(ctx, W, H){
  const cx = W*0.50, waistY = H*0.610, hemY = H*0.905;
  const wTop = W*0.088, wHem = W*0.158;
  ctx.fillStyle = gray(0x9c); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.9, H*0.78, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.022, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.9, H*0.78, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // vertical pleats
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (let i=-2;i<=2;i++){
    const tx = i/2.4;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.012);
    ctx.quadraticCurveTo(cx + tx*wHem*0.95, H*0.78, cx + tx*wHem, hemY - H*0.004);
    ctx.stroke();
  }
  // waist sash
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY + H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.016, cx + wTop, waistY + H*0.004);
  ctx.stroke();
}

/* The drawn veil — a sheer hood in a lighter gray that arches over the crown
   and falls past the temples to the shoulders, framing (never hiding) the face
   so grief and astonishment read. Drawn AFTER the figure using the rig's
   reported head + crown anchors so it tracks the pose. */
function drawVeil(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.10;
  const shY = cy + R*3.15;

  ctx.fillStyle = gray(0xc2); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  // outer edge: up the left, over the crown, down the right
  ctx.moveTo(cx - R*1.58, shY);
  ctx.quadraticCurveTo(cx - R*1.66, cy - R*0.55, cx - R*1.22, cy - R*0.35);
  ctx.quadraticCurveTo(cx - R*1.10, cy - R*1.62, cx, cy - R*1.60);
  ctx.quadraticCurveTo(cx + R*1.10, cy - R*1.62, cx + R*1.22, cy - R*0.35);
  ctx.quadraticCurveTo(cx + R*1.66, cy - R*0.55, cx + R*1.58, shY);
  // inner edge (face opening) back up and over, leaving hair + face visible
  ctx.lineTo(cx + R*1.04, shY);
  ctx.quadraticCurveTo(cx + R*1.14, cy - R*0.20, cx + R*1.02, cy - R*0.80);
  ctx.quadraticCurveTo(cx + R*0.72, cy - R*1.22, cx, cy - R*1.20);
  ctx.quadraticCurveTo(cx - R*0.72, cy - R*1.22, cx - R*1.02, cy - R*0.80);
  ctx.quadraticCurveTo(cx - R*1.14, cy - R*0.20, cx - R*1.04, shY);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // veil folds — a few soft ink creases falling from the crown down each side
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*R*1.34, cy - R*0.90);
    ctx.quadraticCurveTo(cx + s*R*1.42, cy + R*0.9, cx + s*R*1.30, shY - R*0.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + s*R*1.12, cy - R*1.30);
    ctx.quadraticCurveTo(cx + s*R*1.24, cy - R*0.2, cx + s*R*1.16, cy + R*1.0);
    ctx.stroke();
  }
  // hem weight at the shoulders
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - R*1.58, shY); ctx.quadraticCurveTo(cx - R*1.3, shY + R*0.14, cx - R*1.04, shY);
  ctx.moveTo(cx + R*1.04, shY); ctx.quadraticCurveTo(cx + R*1.3, shY + R*0.14, cx + R*1.58, shY);
  ctx.stroke();
}

export const asset = {
  id:"character.penelope",
  type:"CHARACTER",
  name:"Penelope",
  statusWord:"GRIEVING",
  scene:"OD-B01-S06",

  params,
  layers:["shadow","hair-drape","legs","dress","far-arm","neck","head","face","hair-front","near-arm","skirt","veil"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.21},
    veilPeak:{x:.50,y:.08}, rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // calm composure — mouth closed, gaze quietly lowered, hands settled
      neutral:    { preview:{ pose:"neutral", gaze:{x:0,y:.15} } },
      // OD-B01-S06 beat 1: the veiled queen descends the stair in grief,
      // the near hand lifted to the veil at her cheek (SIGNATURE)
      grieving:   { preview:{ pose:"penelope_grief", gaze:{x:.05,y:.42}, mouth:-1 } },
      // deeper collapse — fingers to the temple, head bowed further
      mourning:   { preview:{ pose:"penelope_mourn", gaze:{x:0,y:.5}, mouth:-1 } },
      // pleading through tears — jaw open, one hand offered forward
      pleading:   { preview:{ pose:"penelope_plea", gaze:{x:.05,y:-.05}, mouth:.55 } },
      // OD-B01-S06 beat 2: she draws back in astonishment, both hands to her face
      astonished: { preview:{ pose:"hands_near_face", band:"threeq", gaze:{x:-.35,y:-.1}, mouth:.7 } },
      withdrawing:{ preview:{ pose:"guarded_withdrawal", band:"threeq", gaze:{x:-.4,y:0} } },
      profile:    { preview:{ pose:"profile_left", gaze:{x:-.4,y:.2} } },
    },
    edges:[["neutral","grieving"],["grieving","mourning"],["mourning","pleading"],
           ["pleading","astonished"],["astonished","withdrawing"],["withdrawing","neutral"],
           ["neutral","profile"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band"],

  preview:()=>({ pose:"penelope_grief", gaze:{x:.05,y:.42}, mouth:-1, t:0.35, status:"GRIEVING", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // long hair mass behind the figure
    drawHairDrape(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // long dress skirt draped over the legs
    drawSkirt(ctx, W, H);
    // sheer veil hood in front, tracking the rig's head + crown anchors
    const head  = (r && r.anchors && r.anchors.head)  || { x:0.5, y:0.20 };
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.5, y:0.13 };
    drawVeil(ctx, W, H, head, crown);
    return r;
  },
};
export default asset;
