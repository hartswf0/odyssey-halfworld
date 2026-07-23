/* character.calypso — the immortal nymph of Ogygia, lover and jailer of Odysseus.
   CHARACTER asset. A self-possessed goddess in a long flowing gown, loose
   immortal hair, and a subtle radiance — beautiful, proud, and stung when the
   man she keeps is ordered away. Stable identity across views.

   Scene function:
     OD-B05-S02 — welcome, outrage, wounded attachment, reluctant compliance
     OD-B05-S03 — lover & jailer: tenderness, persuasion, dignified release
     OD-B05-S04 — supplier & observer: helping without taking over

   Built on the engine hero rig (garment:"dress") with three custom solid-gray
   layers so the engine's dotify POST pass supplies the halftone:
     · a faint RADIANCE aureole behind the head (her divinity)
     · a loose long HAIR drape behind the figure
     · a flowing GOWN skirt drawn over the rig's legs
   The dramatic beats need brow/frown/jaw combos the base poses don't carry, so
   they are registered as bespoke poses on the shared POSES table. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  skin:"#ece3d2", hairColor:"#3a2c1c",
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

/* ---- bespoke poses for Calypso's beats ----
   composeStatic reads brow/frown/jaw ONLY from the pose def, so each signature
   emotion needs its own numeric pose. POSES is a shared module singleton, so
   registering here makes these ids resolvable by the rig. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"calypso", n, opt:hands?{hands}:{} }; }

// SIGNATURE — a gracious yet proud welcome: arms opened in offering, chin lifted
// (headY up), a warm but self-possessed smile, brows raised, a subtle radiance.
P("calypso_welcome", {
  chestOpen:.55, spineLean:-.05,
  armLUpper:.9, armLLower:-.42, handRotL:-.16,
  armRUpper:-.9, armRLower:.5, handRotR:.2,
  headY:-.07, headYaw:.06,
  smile:.34, browUp:.32,
}, ["open_palm","open_palm"]);

// OUTRAGE — the goddess rounds on the messenger: weight forward, one arm flung
// out in accusation, brows knit hard, frown, eyes narrowed, jaw dropped mid-shout.
P("calypso_outrage", {
  chestOpen:.28, spineLean:-.15, rootScale:1.05,
  armRUpper:-1.46, armRLower:.16, handRotR:.1,
  armLUpper:.52, armLLower:-.92, handRotL:-.2,
  headY:-.04, headYaw:-.06,
  browKnit:.78, frown:.5, eyeNarrow:.42, jaw:.34, mouthAsym:.32, browUp:.1,
}, ["fist","point"]);

// WOUNDED ATTACHMENT — the near hand drawn to her breast, the far hand still
// reaching after him; grief brows (up AND knit), frown, gaze cast down — hurt,
// but her spine stays upright (a proud goddess, not a collapse).
P("calypso_wounded", {
  spineLean:.05,
  armLUpper:-.52, armLLower:-1.5, handRotL:.42, shoulderLiftL:.4,   // near hand to the heart
  armRUpper:-1.04, armRLower:.5, handRotR:.16,                        // far hand reaching after him
  headPitch:.16, headY:.05, neckPitch:.1, gazeY:.32, gazeX:.06,
  browUp:.56, browKnit:.5, frown:.5, eyeNarrow:.2,
}, ["relaxed","offering"]);

// RELUCTANT COMPLIANCE / DIGNIFIED RELEASE — one hand offered open and forward,
// letting him go; head composed and near-level, a faint frown, gaze turned aside.
P("calypso_release", {
  spineLean:.03,
  armRUpper:-1.0, armRLower:.6, handRotR:.12,
  armLUpper:.34, armLLower:-.46, handRotL:-.12,
  headYaw:.12, headPitch:.08, headY:.0, gazeX:.24, gazeY:.12,
  browUp:.16, frown:.2, eyeNarrow:.12,
}, ["relaxed","offering"]);

// TENDERNESS / PERSUASION — leaning in, an offered hand, soft warm face — the
// lover trying to talk him into staying.
P("calypso_tender", {
  bodyYaw:.12, headYaw:.18, spineLean:-.28,
  armRUpper:-1.16, armRLower:.42, handRotR:.16,
  armLUpper:.26, armLLower:-.32, handRotL:-.1,
  headY:.02, gazeY:-.02,
  smile:.3, browUp:.34, eyeNarrow:.1,
}, ["relaxed","offering"]);

// SUPPLIER / OBSERVER — turned toward the task, one hand out with tools/aid,
// attentive and calm, a small helpful smile; she assists without taking over.
P("calypso_supply", {
  bodyYaw:-.14, headYaw:-.24, spineLean:-.12,
  armRUpper:-1.3, armRLower:.3, handRotR:.16,
  armLUpper:.22, armLLower:-.36,
  gazeX:-.36, gazeY:.18,
  smile:.18, browUp:.14,
}, ["relaxed","offering"]);

/* Subtle RADIANCE — a faint aureole of light-gray rays + ring behind the head.
   Kept light (near paper) so the dotify pass renders it as a soft scatter of
   dots, never competing with the hard contour. Fixed fractions from the neutral
   head; drawn FIRST (behind everything). */
function drawRadiance(ctx, W, H){
  const cx = W*0.50, cy = H*0.185, R = W*0.135;
  ctx.save();
  // soft faint disc
  ctx.fillStyle = gray(0xe4);
  ctx.beginPath(); ctx.arc(cx, cy, R*1.35, 0, 7); ctx.fill();
  // tapered rays
  ctx.fillStyle = gray(0xcf);
  for (let i=0;i<16;i++){
    const a = (i/16)*Math.PI*2 - Math.PI/2;
    const r0 = R*1.12, r1 = R*(1.7 + 0.18*(i%2));
    const wdt = 0.055;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a-wdt)*r0, cy+Math.sin(a-wdt)*r0);
    ctx.lineTo(cx+Math.cos(a)*r1,     cy+Math.sin(a)*r1);
    ctx.lineTo(cx+Math.cos(a+wdt)*r0, cy+Math.sin(a+wdt)*r0);
    ctx.closePath(); ctx.fill();
  }
  // faint ring
  ctx.strokeStyle = gray(0xc4); ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.arc(cx, cy, R*1.16, 0, 7); ctx.stroke();
  ctx.restore();
}

/* Loose immortal HAIR — a long soft mass behind the head/shoulders falling to
   mid-torso, wider and looser than a mortal's plait. Solid gray; dotify weaves
   it. Drawn BEFORE the figure (behind it) at fixed fractions. */
function drawHairDrape(ctx, W, H){
  const cx = W*0.50, crownY = H*0.135, dropY = H*0.575;
  ctx.fillStyle = gray(0x30); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.170, crownY + H*0.055);
  ctx.quadraticCurveTo(cx - W*0.215, H*0.34, cx - W*0.140, dropY);
  ctx.quadraticCurveTo(cx - W*0.075, dropY + H*0.028, cx, dropY + H*0.012);
  ctx.quadraticCurveTo(cx + W*0.075, dropY + H*0.028, cx + W*0.140, dropY);
  ctx.quadraticCurveTo(cx + W*0.215, H*0.34, cx + W*0.170, crownY + H*0.055);
  ctx.quadraticCurveTo(cx, crownY - H*0.040, cx - W*0.170, crownY + H*0.055);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // a few strand seams to keep it reading as flowing hair, not a helmet
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.120, crownY + H*0.02);
    ctx.quadraticCurveTo(cx + s*W*0.185, H*0.34, cx + s*W*0.120, dropY - H*0.02);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.060, crownY + H*0.01);
    ctx.quadraticCurveTo(cx + s*W*0.090, H*0.35, cx + s*W*0.050, dropY - H*0.01);
    ctx.stroke();
  }
}

/* Flowing GOWN skirt — a soft flared bell of cloth from a high waist to the
   ankles, drawn OVER the rig's legs so she reads as gowned rather than
   trousered. Narrow at the waist so gesturing hands stay clear at the sides. */
function drawSkirt(ctx, W, H){
  const cx = W*0.50, waistY = H*0.600, hemY = H*0.905;
  const wTop = W*0.082, wHem = W*0.175;
  ctx.fillStyle = gray(0x9a); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.78, H*0.79, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.026, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.78, H*0.79, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // soft vertical folds of the gown
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (let i=-2;i<=2;i++){
    const tx = i/2.2;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.012);
    ctx.quadraticCurveTo(cx + tx*wHem*0.92, H*0.79, cx + tx*wHem, hemY - H*0.004);
    ctx.stroke();
  }
  // high waist sash
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY + H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.018, cx + wTop, waistY + H*0.004);
  ctx.stroke();
}

export const asset = {
  id:"character.calypso",
  type:"CHARACTER",
  name:"Calypso",
  statusWord:"IMMORTAL",
  scene:"OD-B05-S02",

  params,
  layers:["radiance","hair-drape","legs","dress","far-arm","neck","head","face","hair-front","near-arm","skirt"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    halo:{x:.50,y:.185}, rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"welcome",
    nodes:{
      // OD-B05-S02: the gracious, proud welcome (SIGNATURE)
      welcome:    { preview:{ pose:"calypso_welcome", gaze:{x:.06,y:-.04}, t:0.5 } },
      // OD-B05-S02: she rounds on the messenger — outrage
      outrage:    { preview:{ pose:"calypso_outrage", gaze:{x:-.2,y:-.02}, t:0.5 } },
      // OD-B05-S02: wounded attachment — hand to the heart, still reaching
      wounded:    { preview:{ pose:"calypso_wounded", gaze:{x:.06,y:.32}, t:0.45 } },
      // OD-B05-S02 / S03: reluctant compliance, the dignified release
      release:    { preview:{ pose:"calypso_release", gaze:{x:.24,y:.12}, t:0.5 } },
      // OD-B05-S03: tenderness & persuasion — leaning in to keep him
      tender:     { preview:{ pose:"calypso_tender", gaze:{x:.1,y:-.02}, t:0.45 } },
      // OD-B05-S04: supplier & observer — helping with the raft, not taking over
      supplying:  { preview:{ pose:"calypso_supply", gaze:{x:-.34,y:.18}, t:0.5 } },
    },
    edges:[["welcome","outrage"],["outrage","wounded"],["wounded","release"],
           ["welcome","tender"],["tender","release"],["release","supplying"],
           ["supplying","welcome"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — IMMORTAL: the gracious-yet-proud welcome, arms opened,
  // chin lifted, a warm self-possessed smile under a subtle radiance.
  preview:()=>({ pose:"calypso_welcome", gaze:{x:.06,y:-.04},
                 t:0.5, status:"IMMORTAL", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // divinity behind, then loose hair behind the figure
    drawRadiance(ctx, W, H);
    drawHairDrape(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // flowing gown skirt draped over the rig's legs
    drawSkirt(ctx, W, H);
    return r;
  },
};
export default asset;
