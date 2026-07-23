/* character.helen — the radiant queen of Sparta, whose recognition is instant.
   CHARACTER asset. A beautiful woman in an elegant flowing gown, long hair, and
   a FINE JEWELLED DIADEM with a light veil that falls BEHIND the hair — the
   deliberate opposite of Penelope's grief-heavy drawn hood. Where Penelope
   reads as a dark, bowed, veiled dome, Helen reads OPEN, upright, and luminous:
   the diadem sits low and bright across an unshadowed brow.

   Scene function:
     OD-B04-S02 — radiant queen whose recognition is immediate + destabilizing
     OD-B04-S03 — controlled storyteller administering emotional chemistry
     OD-B04-S06 — gift-giver and omen-reader

   Built on the engine hero rig with a custom long-hair drape + veil train
   (behind), a flowing gown skirt (over the legs), and a diadem crown (in front,
   tracking the rig head anchors). All solid grays so the engine's dotify POST
   pass supplies the halftone — no pre-dithering here. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  skin:"#ede4d4", hairColor:"#4a3a28",     // luminous skin, warm mid hair (not Penelope's near-black)
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:1.0,   // upright, a touch taller than Penelope
};

const fig = makeFigure(params);

/* ---- custom poses for Helen's beats ----
   The rig reads brow/frown/jaw/eye channels ONLY from the pose definition, so
   each signature needs its own authored pose. POSES is a shared module
   singleton, so registering here makes these ids resolvable by composeStatic. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"helen", n, opt:hands?{hands}:{} }; }

// SIGNATURE — INSTANT RECOGNITION (OD-B04-S02): the near hand rises with a
// graceful open palm toward the one she has just placed, gaze fixed and steady,
// lips parting on an indrawn breath, brows lifting in dawning certainty. Poised,
// upright, unshadowed — recognition arriving whole.
P("helen_recognize", {
  browUp:.5, browKnit:.05, eyeWide:.24, smile:.18, jaw:.16, mouthAsym:.06,
  headRoll:-.06, headYaw:.06, neckRoll:-.04, spineLean:-.04, chestOpen:.4,
  shoulderLiftR:.6, armRUpper:-2.46, armRLower:.5, handRotR:.2,   // near hand lifts UP beside the head, open, presenting
  armLUpper:.16, armLLower:-.26,                                   // far arm settled, graceful
}, ["relaxed","open_palm"]);

// CONTROLLED STORYTELLER (OD-B04-S03): she administers the emotional chemistry —
// the drug into the wine — with a poised offering hand, a knowing half-smile,
// eyes lightly narrowed in composure, jaw just open on the measured word.
P("helen_storyteller", {
  browUp:.22, browKnit:.08, eyeNarrow:.28, smile:.24, mouthAsym:.34, jaw:.24,
  headRoll:.05, headYaw:-.08, spineLean:-.06,
  armRUpper:-1.02, armRLower:.62, handRotR:.12, shoulderLiftR:.06,   // offering the cup forward
  armLUpper:.2, armLLower:-.34,
}, ["relaxed","offering"]);

// GIFT-GIVER + OMEN-READER (OD-B04-S06): she offers a parting gift with the near
// hand while the far hand lifts and the gaze climbs to read the eagle-omen —
// wonder rising in the brow, lips parted, a queen reading the sky.
P("helen_omen", {
  browUp:.62, browKnit:.16, eyeWide:.3, jaw:.22, smile:.08,
  headPitch:-.22, neckPitch:-.12, headY:-.06, gazeY:-.4, gazeX:.28,
  spineLean:-.08, chestOpen:.5,
  armRUpper:-1.06, armRLower:.66, handRotR:.14,                       // near hand offers the gift
  shoulderLiftL:.44, armLUpper:.9, armLLower:-.42, handRotL:-.16,     // far hand lifts toward the sign
}, ["point","offering"]);

// composed baseline — upright, quietly regal, a faint welcoming smile
P("helen_poise", {
  browUp:.14, smile:.16, eyeNarrow:.06,
  headRoll:-.03, spineLean:-.02, chestOpen:.25,
  armLUpper:.12, armLLower:-.2, armRUpper:-.12, armRLower:.2,
}, ["relaxed","relaxed"]);

/* Long hair drape + veil train — a soft luminous mass behind the head/shoulders
   so she reads as long-haired, PLUS a light diaphanous veil train falling from
   the diadem past the shoulders (much longer + brighter than Penelope's dark
   hood). Drawn BEFORE the figure (behind it). Solid grays; dotify does the rest. */
function drawHairAndTrain(ctx, W, H){
  const cx = W*0.50, crownY = H*0.140, shY = H*0.560;
  // veil train first (behind the hair) — a bright, long fall of sheer cloth
  ctx.fillStyle = gray(0xcc); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.150, crownY + H*0.030);
  ctx.quadraticCurveTo(cx - W*0.235, H*0.42, cx - W*0.180, H*0.760);
  ctx.quadraticCurveTo(cx, H*0.800, cx + W*0.180, H*0.760);
  ctx.quadraticCurveTo(cx + W*0.235, H*0.42, cx + W*0.150, crownY + H*0.030);
  ctx.quadraticCurveTo(cx, crownY - H*0.020, cx - W*0.150, crownY + H*0.030);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // a couple of soft veil folds
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.150, H*0.24);
    ctx.quadraticCurveTo(cx + s*W*0.205, H*0.48, cx + s*W*0.160, H*0.72);
    ctx.stroke();
  }
  // hair mass over the veil — luminous warm gray, framing but not swallowing
  ctx.fillStyle = gray(0x44); ctx.strokeStyle = INK; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - W*0.128, crownY + H*0.050);
  ctx.quadraticCurveTo(cx - W*0.165, H*0.32, cx - W*0.126, shY);
  ctx.quadraticCurveTo(cx, shY + H*0.045, cx + W*0.126, shY);
  ctx.quadraticCurveTo(cx + W*0.165, H*0.32, cx + W*0.128, crownY + H*0.050);
  ctx.quadraticCurveTo(cx, crownY - H*0.030, cx - W*0.128, crownY + H*0.050);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

/* Flowing gown skirt — a graceful bell of light cloth falling from a high waist
   to the ankles, drawn OVER the rig's legs. Lighter gray than Penelope's gown +
   a diagonal drape fold so it reads as an elegant, moving garment rather than a
   plain column. Solid gray; the dotify pass supplies the weave. */
function drawGown(ctx, W, H){
  const cx = W*0.50, waistY = H*0.590, hemY = H*0.910;
  const wTop = W*0.084, wHem = W*0.168;
  ctx.fillStyle = gray(0xae); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.78, H*0.79, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.026, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.86, H*0.79, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.012, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // diagonal drape fold (a sash of gathered cloth crossing the skirt)
  ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop*0.7, waistY + H*0.014);
  ctx.quadraticCurveTo(cx - W*0.02, H*0.74, cx + wHem*0.72, hemY - H*0.03);
  ctx.stroke();
  // vertical pleats
  for (let i=-2;i<=2;i++){
    const tx = i/2.3;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.014);
    ctx.quadraticCurveTo(cx + tx*wHem*0.9, H*0.79, cx + tx*wHem, hemY - H*0.006);
    ctx.stroke();
  }
  // high waist sash
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY + H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.018, cx + wTop, waistY + H*0.004);
  ctx.stroke();
}

/* The diadem — a fine jewelled crown band that arcs LOW across the bright brow
   (well below the hairline dome) with a raised central point + side finials and
   a run of jewel studs. Drawn AFTER the figure using the rig's reported head +
   crown anchors so it tracks the pose. Deliberately open + luminous so the face
   stays fully visible — the anti-Penelope. */
function drawDiadem(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.10;
  const bandY = cy - R*0.52;          // low across the forehead, over the skin
  const halfW = R*0.98;

  // metallic band (two arcs) — bright mid gray so it glints against the hair
  ctx.fillStyle = gray(0xbe); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - halfW, bandY + R*0.06);
  ctx.quadraticCurveTo(cx, bandY - R*0.42, cx + halfW, bandY + R*0.06);   // top edge, arching up
  ctx.quadraticCurveTo(cx + halfW*0.98, bandY + R*0.16, cx + halfW*0.86, bandY + R*0.20);
  ctx.quadraticCurveTo(cx, bandY - R*0.10, cx - halfW*0.86, bandY + R*0.20);  // bottom edge
  ctx.quadraticCurveTo(cx - halfW*0.98, bandY + R*0.16, cx - halfW, bandY + R*0.06);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // raised central point (a small leaf/finial)
  ctx.fillStyle = gray(0xcc);
  ctx.beginPath();
  ctx.moveTo(cx - R*0.16, bandY - R*0.16);
  ctx.quadraticCurveTo(cx, bandY - R*0.86, cx + R*0.16, bandY - R*0.16);
  ctx.quadraticCurveTo(cx, bandY - R*0.06, cx - R*0.16, bandY - R*0.16);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // side finials
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*R*0.58, bandY - R*0.22);
    ctx.quadraticCurveTo(cx + s*R*0.66, bandY - R*0.52, cx + s*R*0.74, bandY - R*0.20);
    ctx.quadraticCurveTo(cx + s*R*0.66, bandY - R*0.12, cx + s*R*0.58, bandY - R*0.22);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // jewel studs along the band (ink dots + a bright central gem)
  ctx.fillStyle = INK;
  for (const t of [-0.72, -0.4, 0.4, 0.72]){
    const jx = cx + t*halfW, jy = bandY - Math.pow(Math.abs(t),1.4)*R*0.10 + R*0.055;
    ctx.beginPath(); ctx.arc(jx, jy, R*0.05, 0, Math.PI*2); ctx.fill();
  }
  // central gem — bright with an ink rim (a fixed radiant point)
  ctx.fillStyle = gray(0xe6); ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.arc(cx, bandY - R*0.02, R*0.085, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.arc(cx, bandY - R*0.02, R*0.032, 0, Math.PI*2); ctx.fill();
}

export const asset = {
  id:"character.helen",
  type:"CHARACTER",
  name:"Helen",
  statusWord:"RADIANT",
  scene:"OD-B04-S02",

  params,
  layers:["shadow","hair-train","legs","dress","far-arm","neck","head","face","hair-front","near-arm","gown","diadem"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.21},
    diademGem:{x:.50,y:.155}, rightHand:{x:.66,y:.44}, leftHand:{x:.34,y:.60},
    giftGrip:{x:.66,y:.46}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // composed, quietly regal baseline — upright, faint welcoming smile
      neutral:      { preview:{ pose:"helen_poise", gaze:{x:0,y:.02}, t:0.5 } },
      // OD-B04-S02 SIGNATURE — instant recognition: near hand lifts, gaze fixed,
      // lips part, brows rise in dawning certainty
      recognizing:  { preview:{ pose:"helen_recognize", gaze:{x:.14,y:-.02}, t:0.5 } },
      // OD-B04-S03 — controlled storyteller administering the emotional chemistry
      storytelling: { preview:{ pose:"helen_storyteller", gaze:{x:-.1,y:.04}, t:0.5 } },
      // OD-B04-S06 — gift-giver + omen-reader: offers a gift, gaze climbs to the sign
      omenreading:  { preview:{ pose:"helen_omen", gaze:{x:.28,y:-.4}, t:0.5 } },
      // three-quarter turn for staging variety
      profile:      { preview:{ pose:"three_quarter_right", band:"threeq", gaze:{x:.3,y:0}, browUp:.12, smile:.14, t:0.5 } },
    },
    edges:[["neutral","recognizing"],["recognizing","storytelling"],
           ["storytelling","omenreading"],["omenreading","neutral"],
           ["neutral","profile"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — RADIANT: the moment of recognition. Near hand raised in a
  // graceful open presentation, gaze fixed and level, lips just parted on an
  // indrawn breath, brows lifting, the diadem gem a fixed bright point above.
  preview:()=>({ pose:"helen_recognize", gaze:{x:.14,y:-.02},
                 browUp:.5, eyeWide:.24, smile:.18, jaw:.16,
                 t:0.5, status:"RADIANT", progress:.22 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // long hair + luminous veil train behind the figure
    drawHairAndTrain(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // flowing gown skirt draped over the legs
    drawGown(ctx, W, H);
    // fine jewelled diadem across the brow, tracking the rig's head + crown
    const head  = (r && r.anchors && r.anchors.head)  || { x:0.5, y:0.20 };
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.5, y:0.13 };
    drawDiadem(ctx, W, H, head, crown);
    return r;
  },
};
export default asset;
