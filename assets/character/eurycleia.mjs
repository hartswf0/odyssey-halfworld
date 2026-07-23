/* character.eurycleia — the loving old nurse of the house of Odysseus.
   CHARACTER asset. Elderly woman: headscarf (opaque kerchief), long dress under
   a working apron, a slightly stooped bearing. Expressive across an emotional
   arc — hands clasped in tender worry, both hands flung up in alarm, a bowed
   tearful collapse, and a resolute finger-to-lips secrecy.
   Scene function: OD-B02-S06 — the loving nurse moving from alarm and tears to
   disciplined secrecy. Built on the engine hero rig with a custom opaque
   headscarf (front), a long dress skirt + apron (over the legs), and a thin
   gray hair fringe (behind), all in solid grays so the engine's dotify POST
   pass supplies the halftone. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  skin:"#dccfbd", hairColor:"#b7b1a6",
  hair:"short", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:0.94,
};

const fig = makeFigure(params);

/* ---- custom poses for Eurycleia's emotional beats ----
   The rig reads brow/frown/jaw channels from the pose definition, so each
   characterful signature needs its own pose. POSES is a module singleton
   shared with figure-hero, so registering here makes these ids resolvable by
   the rig's composeStatic. An elderly, slightly-stooped carriage is baked into
   every pose via a small forward spineLean + lifted shoulders. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"eurycleia", n, opt:hands?{hands}:{} }; }

// BASELINE — the loving nurse: hands clasped together at the breast, shoulders
// drawn up, brows lifted-and-knit into a habitual tender worry, mouth soft.
P("eury_clasp", {
  browUp:.4, browKnit:.3, frown:.14, eyeNarrow:.06,
  headPitch:.1, neckPitch:.06, headRoll:-.05, gazeY:.06, spineLean:.08,
  shoulderLiftL:.34, shoulderLiftR:.34,
  armLUpper:-.28, armLLower:-1.42, handRotL:.22,   // forearm up + in, hands meet
  armRUpper:.28, armRLower:1.42, handRotR:-.22,
}, ["open_palm","open_palm"]);

// ALARM — both hands thrown up, shoulders high, eyes wide, brows shot up, jaw
// dropped on a gasp; still tearful-worried in the brow. The recognition-cry.
// Hands held wide at chest height (not colliding at center) so they read as a
// startled, palms-out gesture.
P("eury_alarm", {
  browUp:.78, browKnit:.34, eyeWide:.55, jaw:.42, frown:.22,
  headY:-.08, headPitch:-.05, neckPitch:-.03, spineLean:-.12,
  shoulderLiftL:.64, shoulderLiftR:.64,
  armLUpper:-.52, armLLower:-1.52, handRotL:.15,   // hands up + apart, palms out
  armRUpper:.52, armRLower:1.52, handRotR:-.15,
}, ["open_palm","open_palm"]);

// TEARS — head bowed, gaze cast down, one hand lifted to wipe the eye, the far
// hand fallen to her side; deep grief brows (up AND knit) with a heavy frown.
P("eury_weep", {
  browUp:.74, browKnit:.5, frown:.55, eyeNarrow:.34,
  headPitch:.44, headY:.16, neckPitch:.22, headRoll:.08, gazeY:.46, gazeX:.04,
  spineLean:.14,
  shoulderLiftL:.5, armLUpper:-.6, armLLower:-2.04, handRotL:.44,  // hand to the eye
  armRUpper:.2, armRLower:.62, shoulderLiftR:.1,                    // far arm hangs
}, ["open_palm","relaxed"]);

// SECRECY — the resolute turn: a single finger lifted to the lips, brows pulled
// down and knit into discipline, eyes narrowed, a level sidelong gaze; the far
// hand drawn low across the body. "Not a word."
P("eury_hush", {
  browKnit:.6, browUp:.1, eyeNarrow:.34, frown:.06,
  headPitch:.04, headYaw:.06, neckYaw:.04, gazeX:.18, gazeY:.02,
  spineLean:.02, shoulderLiftR:.2,
  armRUpper:.6, armRLower:1.92, handRotR:-.18,   // right hand up to the lips (point)
  armLUpper:-.14, armLLower:-.72, handRotL:.2,   // left hand drawn low across body
}, ["relaxed","point"]);

/* Long dress skirt — a bell of cloth from the waist to the ankles, drawn OVER
   the rig's legs so the nurse reads as robed. Solid mid-gray; dotify supplies
   the weave. Narrow at the waist so the hands stay clear at the sides. */
function drawSkirt(ctx, W, H){
  const cx = W*0.50, waistY = H*0.600, hemY = H*0.902;
  const wTop = W*0.090, wHem = W*0.162;
  ctx.fillStyle = gray(0x82); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.92, H*0.78, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.024, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.92, H*0.78, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // vertical folds
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (let i=-2;i<=2;i++){
    const tx = i/2.4;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.012);
    ctx.quadraticCurveTo(cx + tx*wHem*0.95, H*0.78, cx + tx*wHem, hemY - H*0.004);
    ctx.stroke();
  }
}

/* Working apron — a lighter panel over the front of the skirt, from a waistband
   down to just above the hem, with a small bib rising to the chest and two ties
   at the waist. Lighter gray than the skirt so it reads as a separate layer. */
function drawApron(ctx, W, H){
  const cx = W*0.50, bibTopY = H*0.520, waistY = H*0.612, hemY = H*0.842;
  const wBibTop = W*0.048, wWaist = W*0.070, wHem = W*0.116;
  ctx.fillStyle = gray(0xc8); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  // apron panel (bib -> waist -> skirt drop)
  ctx.beginPath();
  ctx.moveTo(cx - wBibTop, bibTopY);
  ctx.lineTo(cx + wBibTop, bibTopY);
  ctx.lineTo(cx + wWaist, waistY);
  ctx.quadraticCurveTo(cx + wHem*0.9, H*0.75, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.018, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx - wHem*0.9, H*0.75, cx - wWaist, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // waistband
  ctx.strokeStyle = INK; ctx.lineWidth = 3.4; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wWaist, waistY); ctx.quadraticCurveTo(cx, waistY + H*0.012, cx + wWaist, waistY);
  ctx.stroke();
  // ties trailing off each hip
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - wWaist, waistY); ctx.quadraticCurveTo(cx - W*0.10, waistY + H*0.02, cx - W*0.11, waistY + H*0.055);
  ctx.moveTo(cx + wWaist, waistY); ctx.quadraticCurveTo(cx + W*0.10, waistY + H*0.02, cx + W*0.11, waistY + H*0.055);
  ctx.stroke();
  // faint vertical apron seam
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(cx, waistY + H*0.014); ctx.lineTo(cx, hemY - H*0.01);
  ctx.stroke();
}

/* The headscarf (kerchief) — an OPAQUE cloth wrapping the crown, drawn over the
   hair, coming to soft points at the shoulders and dipping low onto the
   forehead so it reads as a tied working headscarf, not a sheer veil. A small
   knot sits at the crown. Drawn AFTER the figure using the rig's reported head
   + crown anchors so it tracks the pose. */
function drawScarf(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.10;
  // ends near the jaw/neck — a snug kerchief that FRAMES the face rather than a
  // long hood that drapes to the torso (which reads as loose hair)
  const jawY = cy + R*1.05;   // where the cloth band tucks in beside the jaw
  const tipY = cy + R*1.80;   // the little tied tails hanging past the chin

  ctx.fillStyle = gray(0x74); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  // outer edge: from the left tail, up the side, over the crown, down the right
  ctx.moveTo(cx - R*0.86, tipY);
  ctx.quadraticCurveTo(cx - R*1.34, jawY, cx - R*1.30, cy - R*0.30);
  ctx.quadraticCurveTo(cx - R*1.20, cy - R*1.66, cx, cy - R*1.62);
  ctx.quadraticCurveTo(cx + R*1.20, cy - R*1.66, cx + R*1.30, cy - R*0.30);
  ctx.quadraticCurveTo(cx + R*1.34, jawY, cx + R*0.86, tipY);
  // inner edge (face opening) — dips LOW onto the forehead, leaving only the
  // face oval clear so alarm / grief / resolve all read
  ctx.quadraticCurveTo(cx + R*1.02, jawY, cx + R*0.96, cy - R*0.66);
  ctx.quadraticCurveTo(cx + R*0.66, cy - R*0.96, cx, cy - R*0.94);
  ctx.quadraticCurveTo(cx - R*0.66, cy - R*0.96, cx - R*0.96, cy - R*0.66);
  ctx.quadraticCurveTo(cx - R*1.02, jawY, cx - R*0.86, tipY);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // knot at the crown
  ctx.fillStyle = gray(0x58); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(cx + R*0.10, cy - R*1.54, R*0.24, R*0.17, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  // scarf folds — a few soft ink creases arcing over the crown and down the frame
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*R*1.14, cy - R*0.90);
    ctx.quadraticCurveTo(cx + s*R*1.24, jawY - R*0.1, cx + s*R*0.92, tipY - R*0.15);
    ctx.stroke();
  }
  // brow-band crease where the cloth meets the forehead
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(cx - R*0.94, cy - R*0.62);
  ctx.quadraticCurveTo(cx, cy - R*0.90, cx + R*0.94, cy - R*0.62);
  ctx.stroke();
}

export const asset = {
  id:"character.eurycleia",
  type:"CHARACTER",
  name:"Eurycleia",
  statusWord:"FAITHFUL",
  scene:"OD-B02-S06",

  params,
  layers:["shadow","hair-fringe","legs","dress","far-arm","neck","head","face","near-arm","skirt","apron","scarf"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.21}, crown:{x:.50,y:.14}, eyes:{x:.50,y:.22},
    scarfPeak:{x:.50,y:.09}, rightHand:{x:.62,y:.44}, leftHand:{x:.38,y:.44},
    hip:{x:.50,y:.62}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // baseline — the loving nurse, hands clasped in habitual tender worry
      neutral:  { preview:{ pose:"eury_clasp", gaze:{x:0,y:.08}, t:0.5 } },
      // OD-B02-S06 beat 1: ALARM — both hands flung up, eyes wide, a gasp
      alarmed:  { preview:{ pose:"eury_alarm", gaze:{x:.04,y:-.04}, mouth:.5, t:0.5 } },
      // OD-B02-S06 beat 2: TEARS — head bowed, hand to the eye, grief brows
      weeping:  { preview:{ pose:"eury_weep", gaze:{x:.04,y:.46}, mouth:-1, t:0.5 } },
      // OD-B02-S06 beat 3: SECRECY — finger to lips, brows knit into discipline
      secretive:{ preview:{ pose:"eury_hush", gaze:{x:.18,y:.02}, t:0.5 } },
      // a plain three-quarter view for staging continuity
      profile:  { preview:{ pose:"three_quarter_right", gaze:{x:.2,y:.06}, t:0.5 } },
    },
    edges:[["neutral","alarmed"],["alarmed","weeping"],["weeping","secretive"],
           ["secretive","neutral"],["neutral","profile"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — FAITHFUL: the loving nurse, both hands clasped together at
  // her breast, shoulders drawn up, brows lifted-and-knit into a habitual tender
  // worry, gaze softly lowered — the anxious devotion that defines her.
  preview:()=>({ pose:"eury_clasp", gaze:{x:0,y:.08},
                 browUp:.4, browKnit:.3, frown:.14,
                 t:0.5, status:"FAITHFUL", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    const r = fig.draw(ctx, W, H, st);
    // long dress skirt draped over the legs, then the working apron on top
    drawSkirt(ctx, W, H);
    drawApron(ctx, W, H);
    // opaque headscarf in front, tracking the rig's head + crown anchors
    const head  = (r && r.anchors && r.anchors.head)  || { x:0.5, y:0.21 };
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.5, y:0.14 };
    drawScarf(ctx, W, H, head, crown);
    return r;
  },
};
export default asset;
