/* character.anticleias-shade — the pale ghost of Odysseus's mother in Hades.
   CHARACTER asset. An older woman: veil + long dress, a gentle sorrowful face,
   a TRANSLUCENT light tone, and a LOWER BODY that dissolves into wisps (a shade
   has no solid feet). Expressive: a tender reaching-but-not-touching gesture and
   a loving, grieving face.
   Scene function: OD-B11-S04 — the loving mother speaks domestic truth and
   explains her death, reaching for her son but never touching him.

   Built on the engine hero rig. The whole figure is kept PALE (light skin, light
   gray hair) so the dotify POST pass renders it as a sparse, see-through
   halftone. Custom layers add a pale mantle/veil over head + shoulders, and a
   pale skirt that trails off into wispy tendrils over the hidden legs + feet.
   All drawn in flat solid grays; the engine's dotify pass supplies the texture. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  skin:"#ece7dc", hairColor:"#c6c0b4",     // pale flesh, faded gray hair — a shade
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:0.95,
};

const fig = makeFigure(params);

/* ---- custom poses for Anticleia's beats ----
   The rig reads brow/frown/jaw channels ONLY from the pose definition, so each
   characterful signature needs its own registered pose. POSES is a module
   singleton shared with figure-hero, so registering here makes these ids
   resolvable by composeStatic. An aged, gently forward carriage (small spineLean
   + a lowered head) is baked into every beat. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"anticleia", n, opt:hands?{hands}:{} }; }

// SIGNATURE — REACHING, NOT TOUCHING: the near hand extended forward toward her
// son with an open, offered palm, the far hand drawn softly to her breast; grief
// brows (browUp AND browKnit) over a tender frown, the head tilted, gaze lifted
// to his face. The whole body leans toward him and stops just short.
P("anticleia_reach", {
  browUp:.56, browKnit:.4, frown:.3, eyeNarrow:.14,
  headPitch:.06, neckPitch:.03, headRoll:-.06, gazeY:-.02, gazeX:.12,
  spineLean:-.16, bodyYaw:-.12,
  shoulderLiftR:.16, armRUpper:-1.46, armRLower:.26, handRotR:.14,  // right hand reaching out, palm up
  shoulderLiftL:.28, armLUpper:-.30, armLLower:-1.34, handRotL:.30, // left hand drawn up to the breast
}, ["open_palm","offering"]);

// SPEAKING DOMESTIC TRUTH — OD-B11-S04: jaw parted on a gentle word, brows lifted
// tenderly, a soft open-handed gesture forward, gaze on her son. Loving, calm,
// explanatory — the mother telling him plainly how she died.
P("anticleia_speak", {
  browUp:.44, browKnit:.2, frown:.06, jaw:.4, eyeWide:.06,
  headPitch:-.02, headRoll:-.03, gazeX:.08, gazeY:.0,
  spineLean:-.06, neckPitch:.02,
  armRUpper:-1.02, armRLower:.6, handRotR:.1,     // gentle open gesture, palm offered
  armLUpper:.18, armLLower:.6,
}, ["relaxed","offering"]);

// GRIEVING — the loving grieving face at its fullest: head bowed, gaze cast low,
// the near hand lifted toward her own cheek, deep grief brows (up AND knit) with
// a heavy soft frown. Longing and sorrow with no anger.
P("anticleia_grieve", {
  browUp:.66, browKnit:.5, frown:.5, eyeNarrow:.26,
  headPitch:.34, headY:.14, neckPitch:.18, headRoll:.1, gazeY:.42, gazeX:.04,
  spineLean:.08,
  shoulderLiftL:.5, armLUpper:-.5, armLLower:-1.92, handRotL:.44,  // hand lifted toward the face
  armRUpper:.16, armRLower:.52,                                     // far arm hangs
}, ["open_palm","relaxed"]);

// CALM — a quiet standing beat for staging continuity: hands settled low, brows
// softly raised in habitual tenderness, gaze gently lowered.
P("anticleia_calm", {
  browUp:.32, browKnit:.16, frown:.08,
  headPitch:.08, neckPitch:.04, gazeY:.14,
  spineLean:.04, shoulderLiftL:.12, shoulderLiftR:.12,
  armLUpper:.14, armLLower:.28, armRUpper:-.14, armRLower:.28,
}, ["relaxed","relaxed"]);

/* Pale hair drape (BEHIND) — a soft faded mass at the shoulders so she reads as
   long, gray-haired under the veil. Light gray; the dotify pass keeps it sparse
   so it looks thin and ghostly. */
function drawHairDrape(ctx, W, H){
  const cx = W*0.50, crownY = H*0.155, shY = H*0.455;
  ctx.fillStyle = gray(0xb6); ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineJoin = "round";
  ctx.beginPath();
  // a soft rounded mass that tapers back IN toward the neck (no straight sides)
  ctx.moveTo(cx - W*0.075, shY);
  ctx.quadraticCurveTo(cx - W*0.158, H*0.28, cx - W*0.120, crownY + H*0.050);
  ctx.quadraticCurveTo(cx, crownY - H*0.030, cx + W*0.120, crownY + H*0.050);
  ctx.quadraticCurveTo(cx + W*0.158, H*0.28, cx + W*0.075, shY);
  ctx.quadraticCurveTo(cx, shY + H*0.030, cx - W*0.075, shY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

/* Pale mantle / shroud over the SHOULDERS + TORSO — a light gray cloth drawn over
   the (mid-gray) dress bodice to unify the whole figure as translucent. Narrow
   enough that the arms emerge from it as sleeves. Sits from the collar to the
   waist, where the wispy skirt takes over. */
function drawMantle(ctx, W, H){
  const cx = W*0.50, collarY = H*0.400, waistY = H*0.588;
  const wCollar = W*0.066, wChest = W*0.116, wWaist = W*0.092;
  ctx.fillStyle = gray(0xcc); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wCollar, collarY);
  ctx.quadraticCurveTo(cx - wChest, H*0.470, cx - wWaist, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.012, cx + wWaist, waistY);
  ctx.quadraticCurveTo(cx + wChest, H*0.470, cx + wCollar, collarY);
  ctx.quadraticCurveTo(cx, collarY - H*0.014, cx - wCollar, collarY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // soft neckline shadow + a couple of drape folds
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wCollar*0.7, collarY + H*0.006);
  ctx.quadraticCurveTo(cx, collarY + H*0.030, cx + wCollar*0.7, collarY + H*0.006);
  ctx.stroke();
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*wCollar*0.5, collarY + H*0.03);
    ctx.quadraticCurveTo(cx + s*wChest*0.55, H*0.475, cx + s*wWaist*0.4, waistY - H*0.02);
    ctx.stroke();
  }
}

/* Pale WISPY LOWER BODY — the shade has no solid legs or feet. A light skirt bell
   falls from the waist, then a still-paler mist covers the hidden legs/feet, and
   a fan of tapering tendrils trails off it, dissolving into the paper. Lightening
   toward the bottom makes the dotify pass thin the dots out to nothing. */
function drawWispyLower(ctx, W, H){
  const cx = W*0.50, waistY = H*0.588, bellY = H*0.780;
  const wTop = W*0.086, wBell = W*0.150;

  // 1) the more-present upper skirt bell
  ctx.fillStyle = gray(0xbe); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wBell*0.92, H*0.70, cx - wBell, bellY);
  ctx.quadraticCurveTo(cx, bellY + H*0.010, cx + wBell, bellY);
  ctx.quadraticCurveTo(cx + wBell*0.92, H*0.70, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // waist sash
  ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY + H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.016, cx + wTop, waistY + H*0.004);
  ctx.stroke();

  // 2) a very pale mist covering the hidden legs + feet (no outline)
  ctx.fillStyle = gray(0xdc);
  ctx.beginPath();
  ctx.moveTo(cx - wBell*0.98, bellY - H*0.010);
  ctx.quadraticCurveTo(cx - wBell*0.86, H*0.88, cx - wBell*0.46, H*0.955);
  ctx.quadraticCurveTo(cx, H*0.930, cx + wBell*0.46, H*0.955);
  ctx.quadraticCurveTo(cx + wBell*0.86, H*0.88, cx + wBell*0.98, bellY - H*0.010);
  ctx.closePath(); ctx.fill();

  // 3) a fan of tapering tendrils trailing off the hem — the dissolve
  const strands = [
    [-0.90, 0.868, 0xc6], [-0.68, 0.918, 0xd2], [-0.46, 0.884, 0xca],
    [-0.24, 0.948, 0xd8], [-0.04, 0.906, 0xcc], [ 0.16, 0.958, 0xda],
    [ 0.36, 0.892, 0xc8], [ 0.58, 0.936, 0xd4], [ 0.80, 0.876, 0xc6],
  ];
  for (const [fx, by, g] of strands){
    const x = cx + fx*wBell, topY = bellY - H*0.030, botY = H*by;
    const halfW = W*0.020*(1 - (by-0.86)*1.2);   // narrower for the longer strands
    ctx.fillStyle = gray(g);
    ctx.beginPath();
    ctx.moveTo(x - halfW, topY);
    ctx.quadraticCurveTo(x - halfW*0.5, (topY+botY)/2, x, botY);
    ctx.quadraticCurveTo(x + halfW*0.5, (topY+botY)/2, x + halfW, topY);
    ctx.closePath(); ctx.fill();
  }
  // 4) a few faint ink hairlines to give the wisps edges
  ctx.strokeStyle = "rgba(20,20,20,0.5)"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
  for (const [fx, by] of strands.filter((_,i)=> i%2===0)){
    const x = cx + fx*wBell, topY = bellY - H*0.020, botY = H*(by-0.008);
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.quadraticCurveTo(x + W*0.006, (topY+botY)/2, x, botY);
    ctx.stroke();
  }
}

/* The drawn VEIL — a sheer pale hood arching over the crown and falling past the
   temples onto the shoulders, framing (never hiding) the face so the tender grief
   reads. Lighter than Penelope's veil — this one is a shade's. Tracks the rig's
   reported head + crown anchors so it follows the pose. */
function drawVeil(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.10;
  // a CLOSE hood that frames the face and tucks back in beside the jaw — no long
  // vertical drop onto the shoulders (that read as a box)
  const jawY = cy + R*1.10;

  ctx.fillStyle = gray(0xce); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  // outer edge: from beside the left jaw, up and over the crown, down the right
  ctx.moveTo(cx - R*0.72, jawY);
  ctx.quadraticCurveTo(cx - R*1.30, cy - R*0.20, cx - R*1.14, cy - R*0.60);
  ctx.quadraticCurveTo(cx - R*1.04, cy - R*1.56, cx, cy - R*1.54);
  ctx.quadraticCurveTo(cx + R*1.04, cy - R*1.56, cx + R*1.14, cy - R*0.60);
  ctx.quadraticCurveTo(cx + R*1.30, cy - R*0.20, cx + R*0.72, jawY);
  // inner edge (face opening) back up and over, leaving the face oval clear
  ctx.quadraticCurveTo(cx + R*0.94, cy - R*0.30, cx + R*0.96, cy - R*0.78);
  ctx.quadraticCurveTo(cx + R*0.68, cy - R*1.16, cx, cy - R*1.14);
  ctx.quadraticCurveTo(cx - R*0.68, cy - R*1.16, cx - R*0.96, cy - R*0.78);
  ctx.quadraticCurveTo(cx - R*0.94, cy - R*0.30, cx - R*0.72, jawY);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // veil folds — soft short ink creases arcing over the crown down each temple
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*R*1.02, cy - R*1.08);
    ctx.quadraticCurveTo(cx + s*R*1.22, cy - R*0.55, cx + s*R*1.02, cy - R*0.10);
    ctx.stroke();
  }
}

export const asset = {
  id:"character.anticleias-shade",
  type:"CHARACTER",
  name:"Anticleia's shade",
  statusWord:"LONGING",
  scene:"OD-B11-S04",

  params,
  layers:["shadow","hair-drape","legs","dress","far-arm","neck","head","face",
          "hair-front","near-arm","mantle","skirt","veil"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.21},
    veilPeak:{x:.50,y:.08}, rightHand:{x:.70,y:.52}, leftHand:{x:.40,y:.50},
    heart:{x:.44,y:.48}, hip:{x:.50,y:.60}, wisps:{x:.50,y:.92},
  },
  states:{
    initial:"neutral",
    nodes:{
      // baseline — quiet standing sorrow, hands low, gaze softly lowered
      neutral:  { preview:{ pose:"anticleia_calm", gaze:{x:.02,y:.14},
                            browUp:.32, browKnit:.16, frown:.08, t:0.5 } },
      // SIGNATURE — reaching but not touching, grief brows, gaze lifted to her son
      reaching: { preview:{ pose:"anticleia_reach", gaze:{x:.12,y:-.02},
                            browUp:.56, browKnit:.4, frown:.3, eyeNarrow:.14, t:0.5 } },
      // OD-B11-S04 — speaking domestic truth, jaw parted, tender lifted brows
      speaking: { preview:{ pose:"anticleia_speak", gaze:{x:.08,y:0}, mouth:.4,
                            browUp:.44, browKnit:.2, jaw:.4, t:0.5 } },
      // the loving grieving face at its fullest — head bowed, hand to the cheek
      grieving: { preview:{ pose:"anticleia_grieve", gaze:{x:.04,y:.42}, mouth:-1,
                            browUp:.66, browKnit:.5, frown:.5, t:0.5 } },
      // a plain three-quarter view for staging continuity
      profile:  { preview:{ pose:"three_quarter_right", gaze:{x:.2,y:.08},
                            browUp:.3, browKnit:.14, t:0.5 } },
    },
    edges:[["neutral","reaching"],["reaching","speaking"],["speaking","grieving"],
           ["grieving","reaching"],["neutral","profile"],["reaching","neutral"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — LONGING: the pale mother reaching out with an offered palm
  // toward the son she cannot hold, the far hand pressed to her breast, grief
  // brows (lifted AND knit) over a tender frown, gaze lifted to his face, her
  // lower body trailing off into wisps.
  preview:()=>({ pose:"anticleia_reach", gaze:{x:.12,y:-.02},
                 browUp:.56, browKnit:.4, frown:.3, eyeNarrow:.14,
                 t:0.5, status:"LONGING", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // pale faded hair mass behind the figure
    drawHairDrape(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // pale mantle over the torso, then the wispy dissolving lower body
    drawMantle(ctx, W, H);
    drawWispyLower(ctx, W, H);
    // sheer pale veil in front, tracking the rig's head + crown anchors
    const head  = (r && r.anchors && r.anchors.head)  || { x:0.5, y:0.20 };
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.5, y:0.13 };
    drawVeil(ctx, W, H, head, crown);
    return r;
  },
};
export default asset;
