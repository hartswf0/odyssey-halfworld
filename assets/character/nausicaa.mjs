/* character.nausicaa — the young Phaeacian princess, daughter of Alcinous.
   CHARACTER asset. A fresh, graceful girl in a simple BELTED gown with long
   loose hair and a slim LIGHT FILLET (a thin diadem band — NOT the jewelled
   crown of the older queens). Where Helen reads as a jewelled, regal presence
   and Penelope as a dark, veiled, bowed dome, Nausicaa reads YOUNG and OPEN:
   a slighter frame, a bright unshadowed face, a single high belt, and a plain
   band of gold across the brow. Her arc runs dreamy -> practical initiative ->
   poised courage, so her signature is an INITIATIVE gesture: the near hand out,
   directing / holding ground, chin lifted, a bright youthful face.

   Scene function:
     OD-B06-S01 — dream susceptibility to practical initiative + concealed anticipation
     OD-B06-S02 — energetic leader at work, relaxed ball-game player
     OD-B06-S03 — startled but divinely steadied, holding ground as companions scatter
     OD-B06-S04 — admiration held inside careful public instructions

   Built on the engine hero rig with a custom long-hair drape (behind), a simple
   belted gown skirt (over the legs), and a slim fillet band (in front, tracking
   the rig head anchors). All solid grays so the engine's dotify POST pass
   supplies the halftone — no pre-dithering here. */
import { makeFigure, INK, gray } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

const params = {
  skin:"#f1e7d6", hairColor:"#5c4630",        // fresh youthful skin, warm loose hair
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:0.94,   // a slighter, younger frame
};

const fig = makeFigure(params);

/* ---- custom poses for Nausicaa's beats ----
   The rig reads brow/frown/jaw/eye channels ONLY from the pose definition, so
   each signature needs its own authored pose. POSES is a shared module
   singleton, so registering here makes these ids resolvable by composeStatic. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"nausicaa", n, opt:hands?{hands}:{} }; }

// SIGNATURE — PRACTICAL INITIATIVE (OD-B06-S01/S02): the near hand thrusts out
// and points the way, chin lifted, gaze following the gesture, a bright decisive
// smile with brows up. The girl who wakes from a dream and takes charge.
P("nausicaa_directing", {
  browUp:.34, browKnit:.04, smile:.28, eyeWide:.12, jaw:.14,
  headYaw:.14, headRoll:-.05, spineLean:-.08, chestOpen:.45,
  armRUpper:-1.5, armRLower:.12, handRotR:.16, shoulderLiftR:.1,   // near hand points the way
  armLUpper:.18, armLLower:-.28,                                    // far arm graceful at side
}, ["relaxed","point"]);

// DREAMY SUSCEPTIBILITY -> CONCEALED ANTICIPATION (OD-B06-S01): soft eyes lifted
// and slid aside, head tilted, a private half-smile she keeps to herself, the
// near hand drifting up toward the cheek. Wonder held quietly inside.
P("nausicaa_dreaming", {
  browUp:.3, eyeNarrow:.2, smile:.2, mouthAsym:.26,
  headRoll:.14, headPitch:-.1, neckRoll:.08, gazeX:.3, gazeY:-.24, spineLean:.03,
  shoulderLiftL:.34, armLUpper:-.52, armLLower:-1.72, handRotL:.34,   // hand drifts up to the cheek
  armRUpper:-.14, armRLower:.3,
}, ["open_palm","relaxed"]);

// ENERGETIC BALL-GAME PLAYER (OD-B06-S02): arm flung up to catch the ball, a
// bright open laugh, eyes crinkled, weight rising — relaxed, girlish, quick.
P("nausicaa_ballgame", {
  smile:1, jaw:.42, eyeNarrow:.5, cheek:.5, browUp:.3,
  spineLean:.06, rootY:-.03, shoulderLiftL:.5,
  armLUpper:2.5, armLLower:-.2, handRotL:.2,                          // near arm up, catching
  armRUpper:-.62, armRLower:.9,
}, ["open_palm","relaxed"]);

// POISED COURAGE — HOLDING GROUND (OD-B06-S03): startled but divinely steadied.
// She plants and faces forward, the near hand rising palm-out to hold her place,
// eyes a touch wide but level, brows up in surprise yet the jaw set. Others
// scatter; she does not.
P("nausicaa_holding", {
  browUp:.42, browKnit:.12, eyeWide:.34, frown:.06,
  headRoll:-.03, spineLean:-.02, rootScale:1.02,
  shoulderLiftR:.24, armRUpper:-1.12, armRLower:-.34, handRotR:.2,    // near hand up, palm out, holding ground
  armLUpper:.12, armLLower:-.22,
}, ["relaxed","stop"]);

// CAREFUL PUBLIC INSTRUCTIONS (OD-B06-S04): she gives measured directions with an
// offering hand, jaw just open on the word, but the admiration is held inside —
// a suppressed, skewed half-smile and lightly narrowed eyes keep it composed.
P("nausicaa_instructing", {
  browUp:.2, browKnit:.06, smile:.16, mouthAsym:.32, eyeNarrow:.18, jaw:.24,
  headYaw:-.08, headRoll:.05, spineLean:-.05,
  armRUpper:-1.02, armRLower:.6, handRotR:.12, shoulderLiftR:.06,     // offering the instruction forward
  armLUpper:.2, armLLower:-.32,
}, ["relaxed","offering"]);

// composed baseline — fresh, upright, a faint bright smile
P("nausicaa_poise", {
  browUp:.16, smile:.18, eyeWide:.06,
  headRoll:-.02, spineLean:-.02, chestOpen:.22,
  armLUpper:.14, armLLower:-.22, armRUpper:-.14, armRLower:.22,
}, ["relaxed","relaxed"]);

/* Long hair drape — a soft loose mass behind the head/shoulders so she reads as
   long-haired. Warmer + a touch shorter than the queens' (a girl's loose hair,
   not a matron's veiled fall). Drawn BEFORE the figure (behind it). Solid gray;
   dotify supplies the texture. */
function drawHairDrape(ctx, W, H){
  const cx = W*0.50, crownY = H*0.150, shY = H*0.520;
  ctx.fillStyle = gray(0x4a); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.132, crownY + H*0.050);
  ctx.quadraticCurveTo(cx - W*0.170, H*0.30, cx - W*0.120, shY);
  ctx.quadraticCurveTo(cx, shY + H*0.048, cx + W*0.120, shY);
  ctx.quadraticCurveTo(cx + W*0.170, H*0.30, cx + W*0.132, crownY + H*0.050);
  ctx.quadraticCurveTo(cx, crownY - H*0.030, cx - W*0.132, crownY + H*0.050);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // a couple of loose strands falling forward over the shoulders
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.124, crownY + H*0.070);
    ctx.quadraticCurveTo(cx + s*W*0.156, H*0.32, cx + s*W*0.118, shY - H*0.02);
    ctx.stroke();
  }
}

/* Simple belted gown skirt — a light bell of cloth from a high belt to the
   ankles, drawn OVER the rig's legs. Simpler + brighter than the queens':
   fewer pleats, a single clear belt, one soft drape fold, reading YOUNG and
   plain. Solid gray; the dotify pass supplies the weave. */
function drawGown(ctx, W, H){
  const cx = W*0.50, waistY = H*0.585, hemY = H*0.905;
  const wTop = W*0.080, wHem = W*0.150;
  ctx.fillStyle = gray(0xba); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.86, H*0.78, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.024, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.86, H*0.78, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // a few light vertical pleats (fewer than the queens — a plainer dress)
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (let i=-1;i<=1;i++){
    const tx = i/1.6;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.012);
    ctx.quadraticCurveTo(cx + tx*wHem*0.92, H*0.78, cx + tx*wHem, hemY - H*0.004);
    ctx.stroke();
  }
  // the BELT — a clear high band with a small knot, the defining detail
  ctx.fillStyle = gray(0x6a); ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop*1.02, waistY - H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.014, cx + wTop*1.02, waistY - H*0.004);
  ctx.lineTo(cx + wTop*1.02, waistY + H*0.014);
  ctx.quadraticCurveTo(cx, waistY + H*0.032, cx - wTop*1.02, waistY + H*0.014);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // belt knot + short hanging tie
  ctx.fillStyle = gray(0x6a); ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.ellipse(cx, waistY + H*0.008, W*0.014, H*0.012, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.006, waistY + H*0.018);
  ctx.lineTo(cx - W*0.010, waistY + H*0.058);
  ctx.moveTo(cx + W*0.006, waistY + H*0.018);
  ctx.lineTo(cx + W*0.012, waistY + H*0.056);
  ctx.stroke();
}

/* The fillet — a slim, LIGHT diadem band arcing low across the bright brow with a
   single small central point. Deliberately plain (no side finials, no run of
   jewels): a young girl's simple gold band, the anti-Helen. Drawn AFTER the
   figure using the rig's reported head + crown anchors so it tracks the pose. */
function drawFillet(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.10;
  const bandY = cy - R*0.60;          // low across the forehead, over the skin
  const halfW = R*0.92;

  // thin metallic band (two close arcs) — bright mid gray
  ctx.fillStyle = gray(0xc4); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - halfW, bandY + R*0.05);
  ctx.quadraticCurveTo(cx, bandY - R*0.34, cx + halfW, bandY + R*0.05);   // top edge, gentle arch
  ctx.quadraticCurveTo(cx + halfW*0.96, bandY + R*0.11, cx + halfW*0.88, bandY + R*0.13);
  ctx.quadraticCurveTo(cx, bandY - R*0.14, cx - halfW*0.88, bandY + R*0.13);  // bottom edge (thin band)
  ctx.quadraticCurveTo(cx - halfW*0.96, bandY + R*0.11, cx - halfW, bandY + R*0.05);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // a single small central point (a modest leaf) — the ONLY ornament
  ctx.fillStyle = gray(0xd2);
  ctx.beginPath();
  ctx.moveTo(cx - R*0.10, bandY - R*0.10);
  ctx.quadraticCurveTo(cx, bandY - R*0.50, cx + R*0.10, bandY - R*0.10);
  ctx.quadraticCurveTo(cx, bandY - R*0.02, cx - R*0.10, bandY - R*0.10);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // a small bright centre dot
  ctx.fillStyle = gray(0xe6); ctx.strokeStyle = INK; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, bandY - R*0.02, R*0.05, 0, Math.PI*2); ctx.fill(); ctx.stroke();
}

export const asset = {
  id:"character.nausicaa",
  type:"CHARACTER",
  name:"Nausicaa",
  statusWord:"SPIRITED",
  scene:"OD-B06-S01",

  params,
  layers:["shadow","hair-drape","legs","dress","far-arm","neck","head","face","hair-front","near-arm","gown","fillet"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.21},
    filletPoint:{x:.50,y:.15}, rightHand:{x:.68,y:.52}, leftHand:{x:.34,y:.60},
    ballGrip:{x:.34,y:.30}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // composed, fresh baseline — upright, faint bright smile
      neutral:     { preview:{ pose:"nausicaa_poise", gaze:{x:0,y:.02}, t:0.5 } },
      // OD-B06-S01 — dreamy susceptibility drifting into concealed anticipation
      dreaming:    { preview:{ pose:"nausicaa_dreaming", gaze:{x:.3,y:-.24}, t:0.5 } },
      // OD-B06-S01/S02 SIGNATURE — practical initiative: near hand points the way
      directing:   { preview:{ pose:"nausicaa_directing", gaze:{x:.4,y:.02}, t:0.5 } },
      // OD-B06-S02 — relaxed ball-game player, arm up to catch, bright laugh
      playing:     { preview:{ pose:"nausicaa_ballgame", gaze:{x:-.2,y:-.3}, t:0.5 } },
      // OD-B06-S03 — startled but divinely steadied, holding ground
      holding:     { preview:{ pose:"nausicaa_holding", gaze:{x:.06,y:0}, t:0.5 } },
      // OD-B06-S04 — careful public instructions, admiration held inside
      instructing: { preview:{ pose:"nausicaa_instructing", gaze:{x:-.12,y:.04}, t:0.5 } },
    },
    edges:[["neutral","dreaming"],["dreaming","directing"],["directing","playing"],
           ["playing","holding"],["holding","instructing"],["instructing","neutral"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — SPIRITED: the moment of practical initiative. Near hand
  // thrust out to point the way, chin lifted, gaze following the gesture, a
  // bright decisive smile with brows up, the slim fillet a plain bright band.
  preview:()=>({ pose:"nausicaa_directing", gaze:{x:.4,y:.02},
                 browUp:.34, smile:.28, eyeWide:.12, jaw:.14,
                 t:0.5, status:"SPIRITED", progress:.22 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // long loose hair behind the figure
    drawHairDrape(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // simple belted gown draped over the legs
    drawGown(ctx, W, H);
    // slim light fillet across the brow, tracking the rig's head + crown anchors
    const head  = (r && r.anchors && r.anchors.head)  || { x:0.5, y:0.20 };
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.5, y:0.13 };
    drawFillet(ctx, W, H, head, crown);
    return r;
  },
};
export default asset;
