/* character.arete — the wise, powerful queen of the Phaeacians.
   CHARACTER asset. A mature, dignified woman in a rich robe over a long gown,
   wearing a FINE UPRIGHT CROWN (a full pointed crown, not Helen's low brow-band),
   carried with regal stillness and seated authority. Her identity beat is the
   shrewd, perceptive face — a queen who READS you before she speaks.

   Distinct from Helen (radiant, low luminous diadem, upright openness) and from
   Penelope (dark drawn grief-veil): Arete reads STILL, UPRIGHT, and CROWNED —
   a tall crown high on the head, a heavy ornamented robe, a measured assessing
   gaze. Where Helen throws a hand up in recognition, Arete's hand rises only in
   a MEASURED receiving gesture, palm up, weighing the appeal.

   Scene function:
     OD-B07-S03 — powerful queen receiving the central appeal before speaking
     OD-B07-S04 — forensic observer reading textile authorship before testing

   Built on the engine hero rig with a custom mantle/robe drape (behind), a rich
   ornamented gown skirt (over the legs), and a tall pointed crown (in front,
   tracking the rig head anchors). All solid grays so the engine's dotify POST
   pass supplies the halftone — no pre-dithering here. */
import { makeFigure, INK, gray } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

const params = {
  skin:"#e6ddce", hairColor:"#7d766c",       // mature dignified skin, iron-gray hair
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:true, bareLegs:false, scale:1.03,   // tall, robed, upright
};

const fig = makeFigure(params);

/* ---- custom poses for Arete's beats ----
   The rig reads brow/frown/jaw/eye channels ONLY from the pose definition, so
   each signature needs its own authored pose. POSES is a shared module
   singleton, so registering here makes these ids resolvable by composeStatic. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"arete", n, opt:hands?{hands}:{} }; }

// SIGNATURE — MEASURED RECEIVING (OD-B07-S03): the queen receives the central
// appeal before she speaks. Upright, still, crowned. The near hand turns UP and
// out in a slow, measured "present it to me" receiving gesture — palm open, held
// low and deliberate, NOT flung. The face is the identity beat: one brow lifted,
// eyes lightly narrowed in shrewd assessment, mouth composed and closed, gaze
// level and steady. Seated authority conveyed by stillness, not motion.
P("arete_receive", {
  browUp:.34, browKnit:.14, eyeNarrow:.34, smile:.06, mouthAsym:.28, jaw:0,
  headRoll:-.05, headYaw:.05, neckRoll:-.03, spineLean:-.02, chestOpen:.22,
  armRUpper:-.86, armRLower:.74, handRotR:.22, shoulderLiftR:.04,   // near hand turns palm-up, low + measured
  armLUpper:.14, armLLower:-.22,                                     // far arm settled, regal
}, ["relaxed","palm_up"]);

// FORENSIC OBSERVER (OD-B07-S04): she reads the textile's authorship before she
// tests the account. Head tilts and lowers a touch over the cloth, eyes narrowed
// hard in scrutiny, brows knit in concentration, mouth pressed. The near hand is
// held forward and turned inward as if lifting/turning the woven edge to the
// light. Cool, exacting, perceptive — a queen weighing evidence.
P("arete_forensic", {
  browUp:.08, browKnit:.42, eyeNarrow:.6, frown:.14, mouthAsym:.2, jaw:0,
  headPitch:.2, neckPitch:.1, headRoll:.08, headYaw:-.1, headY:.05,
  gazeX:.22, gazeY:.34, spineLean:-.06,
  armRUpper:-1.04, armRLower:.9, handRotR:.34, shoulderLiftR:.08,   // near hand turns the cloth to inspect
  armLUpper:.2, armLLower:-.3,
}, ["relaxed","offering"]);

// MEASURED SPEECH (after receiving): she delivers her judgement. Jaw opens on
// the weighed word, one brow still lifted in authority, the near hand makes a
// small deliberate downward point — a ruling, not a plea.
P("arete_speak", {
  browUp:.3, browKnit:.16, eyeNarrow:.24, smile:.08, mouthAsym:.18, jaw:.34,
  headRoll:-.04, headYaw:.06, spineLean:-.03,
  armRUpper:-1.12, armRLower:.26, handRotR:.12, shoulderLiftR:.05,
  armLUpper:.16, armLLower:-.24,
}, ["relaxed","point"]);

// REGAL STILLNESS (baseline): upright, crowned, hands settled, a composed and
// faintly shrewd level gaze. The anti-drama — presence held in stillness.
P("arete_poise", {
  browUp:.16, browKnit:.08, eyeNarrow:.16, smile:.05, mouthAsym:.12,
  headRoll:-.03, spineLean:-.01, chestOpen:.16,
  armLUpper:.12, armLLower:-.2, armRUpper:-.12, armRLower:.2,
}, ["relaxed","relaxed"]);

/* Mantle / robe drape + long hair — a heavy ornamented mantle falls behind the
   shoulders (reading "rich robe" + seated weight), with an iron-gray hair mass
   framing the face. Drawn BEFORE the figure (behind it). Solid grays; dotify
   supplies the texture. */
function drawMantleAndHair(ctx, W, H){
  const cx = W*0.50, crownY = H*0.150, shY = H*0.560;
  // mantle first (behind everything) — a rich robe that DRAPES from the shoulders
  // (a shaped shawl-collar, not a full-height slab): it rises to a soft collar
  // behind the neck, then falls open and wide to the hem, framing the figure with
  // costly weight while leaving the head clear against the paper.
  ctx.fillStyle = gray(0x4c); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  const collarY = H*0.335;            // top of the mantle sits at the shoulders
  ctx.beginPath();
  ctx.moveTo(cx - W*0.070, collarY - H*0.010);                              // collar, left of neck
  ctx.quadraticCurveTo(cx - W*0.190, H*0.395, cx - W*0.208, H*0.560);       // shoulder shrugs outward
  ctx.quadraticCurveTo(cx - W*0.250, H*0.75, cx - W*0.196, H*0.885);        // falls to the hem
  ctx.quadraticCurveTo(cx, H*0.925, cx + W*0.196, H*0.885);
  ctx.quadraticCurveTo(cx + W*0.250, H*0.75, cx + W*0.208, H*0.560);
  ctx.quadraticCurveTo(cx + W*0.190, H*0.395, cx + W*0.070, collarY - H*0.010);  // shoulder back to collar
  ctx.quadraticCurveTo(cx, collarY + H*0.030, cx - W*0.070, collarY - H*0.010);  // collar dip behind neck
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // shawl-collar highlight — a lighter inner border rolling over the shoulders
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - W*0.066, collarY + H*0.004);
  ctx.quadraticCurveTo(cx - W*0.150, H*0.40, cx - W*0.168, H*0.55);
  ctx.moveTo(cx + W*0.066, collarY + H*0.004);
  ctx.quadraticCurveTo(cx + W*0.150, H*0.40, cx + W*0.168, H*0.55);
  ctx.stroke();
  // mantle folds — a few heavy vertical creases in the falling cloth
  ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.170, H*0.58);
    ctx.quadraticCurveTo(cx + s*W*0.225, H*0.72, cx + s*W*0.180, H*0.85);
    ctx.stroke();
  }
  // hair mass over the mantle — iron gray, framing the face
  ctx.fillStyle = gray(0x5e); ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - W*0.130, crownY + H*0.055);
  ctx.quadraticCurveTo(cx - W*0.168, H*0.32, cx - W*0.124, shY);
  ctx.quadraticCurveTo(cx, shY + H*0.045, cx + W*0.124, shY);
  ctx.quadraticCurveTo(cx + W*0.168, H*0.32, cx + W*0.130, crownY + H*0.055);
  ctx.quadraticCurveTo(cx, crownY - H*0.010, cx - W*0.130, crownY + H*0.055);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

/* Rich gown skirt — a heavy ornamented bell of cloth falling from a high waist
   to the ankles, drawn OVER the rig's legs. Mid-dark gray (richer than Helen's
   light gown), with a decorated hem BORDER of jewel dots so it reads as a
   costly royal robe. Solid gray; the dotify pass supplies the weave. */
function drawGown(ctx, W, H){
  const cx = W*0.50, waistY = H*0.590, hemY = H*0.905;
  const wTop = W*0.090, wHem = W*0.176;
  ctx.fillStyle = gray(0x82); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.88, H*0.78, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.024, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.88, H*0.78, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.012, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // vertical pleats
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (let i=-2;i<=2;i++){
    const tx = i/2.3;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.014);
    ctx.quadraticCurveTo(cx + tx*wHem*0.9, H*0.78, cx + tx*wHem, hemY - H*0.006);
    ctx.stroke();
  }
  // ornamented hem BORDER — a bright band + a run of jewel dots (the royal robe)
  ctx.strokeStyle = INK; ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(cx - wHem*0.95, hemY - H*0.028);
  ctx.quadraticCurveTo(cx, hemY - H*0.004, cx + wHem*0.95, hemY - H*0.028);
  ctx.stroke();
  ctx.fillStyle = gray(0xdc);
  for (let i=-4;i<=4;i++){
    const t = i/4.4;
    const jx = cx + t*wHem*0.92, jy = hemY - H*0.016 + Math.pow(Math.abs(t),1.6)*H*0.012;
    ctx.beginPath(); ctx.arc(jx, jy, W*0.0085, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
  }
  // high waist sash — a broad jewelled girdle
  ctx.fillStyle = gray(0x6a); ctx.strokeStyle = INK; ctx.lineWidth = 3.6; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY - H*0.006);
  ctx.quadraticCurveTo(cx, waistY + H*0.008, cx + wTop, waistY - H*0.006);
  ctx.quadraticCurveTo(cx, waistY + H*0.026, cx - wTop, waistY - H*0.006);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

/* The crown — a FULL, tall royal crown (a jewelled circlet with several upright
   points/spikes), sitting HIGH on the crown of the head (well above the brow,
   the opposite of Helen's low diadem). A run of jewel studs across the band and
   a bright central gem. Drawn AFTER the figure using the rig's reported head +
   crown anchors so it tracks the pose. Bright metallic gray so it glints. */
function drawCrown(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.10;
  const bandY = cy - R*1.02;          // HIGH on the head, over the hairline dome
  const halfW = R*0.94;
  const bandH = R*0.30;

  // circlet band (a solid ring across the top of the head)
  ctx.fillStyle = gray(0xba); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - halfW, bandY);
  ctx.quadraticCurveTo(cx, bandY - R*0.14, cx + halfW, bandY);          // top edge, slight arch
  ctx.lineTo(cx + halfW*0.98, bandY + bandH);
  ctx.quadraticCurveTo(cx, bandY + bandH + R*0.10, cx - halfW*0.98, bandY + bandH);  // bottom edge, sits on the hair
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // upright points/spikes of the crown — five tapering peaks rising from the band
  ctx.fillStyle = gray(0xc8); ctx.strokeStyle = INK; ctx.lineWidth = 3;
  const peaks = [-0.78, -0.4, 0, 0.4, 0.78];
  const peakH = [0.44, 0.62, 0.86, 0.62, 0.44];
  for (let k=0;k<peaks.length;k++){
    const px = cx + peaks[k]*halfW;
    const ph = R*peakH[k];
    const halfBase = R*0.16;
    ctx.beginPath();
    ctx.moveTo(px - halfBase, bandY);
    ctx.lineTo(px, bandY - ph);
    ctx.lineTo(px + halfBase, bandY);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // a little gem ball tops each peak
    ctx.fillStyle = gray(0xe4);
    ctx.beginPath(); ctx.arc(px, bandY - ph - R*0.02, R*0.055, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = gray(0xc8);
  }

  // jewel studs along the band (ink dots)
  ctx.fillStyle = INK;
  for (const t of [-0.6, -0.2, 0.2, 0.6]){
    const jx = cx + t*halfW, jy = bandY + bandH*0.5;
    ctx.beginPath(); ctx.arc(jx, jy, R*0.045, 0, Math.PI*2); ctx.fill();
  }
  // central gem — bright with an ink rim (a fixed radiant point on the band)
  ctx.fillStyle = gray(0xea); ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.arc(cx, bandY + bandH*0.5, R*0.085, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.arc(cx, bandY + bandH*0.5, R*0.034, 0, Math.PI*2); ctx.fill();
}

export const asset = {
  id:"character.arete",
  type:"CHARACTER",
  name:"Arete",
  statusWord:"SHREWD",
  scene:"OD-B07-S03",

  params,
  layers:["shadow","mantle","hair-back","legs","dress","far-arm","neck","head","face","hair-front","near-arm","gown","crown"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.21},
    crownGem:{x:.50,y:.135}, rightHand:{x:.66,y:.52}, leftHand:{x:.34,y:.60},
    receiveGrip:{x:.66,y:.50}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // regal stillness baseline — upright, crowned, faintly shrewd level gaze
      neutral:    { preview:{ pose:"arete_poise", gaze:{x:0,y:.02}, t:0.5 } },
      // OD-B07-S03 SIGNATURE — receiving the central appeal: near hand turns
      // palm-up in a measured receiving gesture, brow lifted, eyes assessing
      receiving:  { preview:{ pose:"arete_receive", gaze:{x:.12,y:.04}, t:0.5 } },
      // OD-B07-S04 — forensic observer reading the textile: gaze down on the
      // cloth, eyes narrowed hard, brows knit in scrutiny, hand turning the weave
      forensic:   { preview:{ pose:"arete_forensic", gaze:{x:.22,y:.34}, t:0.5 } },
      // measured judgement — jaw open on the weighed word, a small ruling point
      speaking:   { preview:{ pose:"arete_speak", gaze:{x:.06,y:.02}, t:0.5 } },
      // three-quarter turn for staging variety
      profile:    { preview:{ pose:"three_quarter_left", band:"threeq", gaze:{x:-.3,y:.04}, browUp:.16, eyeNarrow:.2, mouthAsym:.16, t:0.5 } },
    },
    edges:[["neutral","receiving"],["receiving","forensic"],["forensic","speaking"],
           ["speaking","neutral"],["neutral","profile"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — SHREWD: the queen receiving the appeal. Near hand turned
  // palm-up in a slow measured receiving gesture, one brow lifted, eyes lightly
  // narrowed in assessment, mouth composed and closed, gaze level and steady,
  // the tall crown a fixed authority above the face.
  preview:()=>({ pose:"arete_receive", gaze:{x:.12,y:.04},
                 browUp:.34, browKnit:.14, eyeNarrow:.34, mouthAsym:.28,
                 t:0.5, status:"SHREWD", progress:.22 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // heavy mantle + iron-gray hair behind the figure
    drawMantleAndHair(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // rich ornamented gown skirt draped over the legs
    drawGown(ctx, W, H);
    // tall pointed crown high on the head, tracking the rig's head + crown
    const head  = (r && r.anchors && r.anchors.head)  || { x:0.5, y:0.20 };
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.5, y:0.11 };
    drawCrown(ctx, W, H, head, crown);
    return r;
  },
};
export default asset;
