/* character.agamemnons-shade — the pale ghost of the murdered king of Mycenae.
   CHARACTER asset. In the House of the Dead (OD-B11-S06) the shade of
   Agamemnon relives his own murder: cut down at the homecoming feast by his
   wife Clytemnestra and Aegisthus. He gives Odysseus a bitter warning about
   trusting women, rages at his humiliation, and asks with anguished
   uncertainty whether his own son Orestes still lives.

   Built on the HALFTRACK hero rig. Distinct silhouette: a broad BEARDED
   warrior-king in battle ARMOR under a heavy cloak, faded near-white hair and
   beard, standing bare-shinned in sandals. He is a shade, so the whole figure
   is drawn TRANSLUCENT (paper bleeds through the dot pass). Over the armor sit
   bespoke WOUND-MARKS — the death-blows at throat and breast — drawn a touch
   more present than the ghostly body so the murder reads.

   EXPRESSIVENESS: the rig reads face channels from the composed POSE, so
   Agamemnon ships bespoke poses into the shared registry, each fusing a
   grieving-yet-furious brow (raised AND knit), a raging open jaw or a
   bitter-set mouth, and a gripping/warning arm. That is what lets the card
   actually EMOTE — a bitter warning wrapped around an anguished rage. */
import { makeFigure, HERO_POSES, INK, gray } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke Agamemnon poses (additive; shared table) ----
   Conventions: right arm carries the gesture (warns / grips / clenches); left
   arm shields the wounded breast or hangs. A heavy, broad, slightly forward
   carriage is baked into every beat (chestOpen + a low rootScale bulk). */

// THE CARD — BITTER WARNING: he leans in and thrusts a warning, half-gripping
// hand toward Odysseus, fingers hooked to seize, while his face burns — brows
// driven up AND knit in anguished fury, eyes narrowed to a glare, jaw parted on
// a hard bitter word ("trust no woman"). The far hand is clenched at the
// wounded breast. This is the warning and the rage in one frame.
HERO_POSES.aga_warn = { id:"aga_warn", label:"bitter warning", group:"agamemnon",
  n:{ browUp:.42, browKnit:.64, eyeNarrow:.42, frown:.34, jaw:.34, mouthAsym:.3,
      headPitch:-.06, neckPitch:-.03, headYaw:-.14, headRoll:.04,
      spineLean:-.22, bodyYaw:-.2, chestOpen:.42,
      armRUpper:-1.06, armRLower:.6, handRotR:.22, shoulderLiftR:.14,   // right hand thrust forward, gripping
      armLUpper:-.34, armLLower:-1.4, handRotL:.28,                      // left fist drawn to the wounded breast
      rootScale:1.06 },
  opt:{ hands:["point","fist"] } };

// ANGUISHED RAGE — reliving the murder at its peak: chin flung up, jaw wide on
// a roar, brows crushed together and lifted, eyes wide with fury, both arms
// wrenched up and clenched. The humiliation boiling over into an open cry.
HERO_POSES.aga_rage = { id:"aga_rage", label:"anguished rage", group:"agamemnon",
  n:{ browUp:.6, browKnit:.78, eyeWide:.4, frown:.5, jaw:.72, mouthAsym:.12,
      headPitch:-.24, neckPitch:-.12, headRoll:-.02,
      spineLean:-.18, chestOpen:.9, bodyYaw:-.04,
      armRUpper:-2.32, armRLower:-.28, shoulderLiftR:.6,   // right fist wrenched up
      armLUpper:2.32, armLLower:.28, shoulderLiftL:.6,      // left fist wrenched up
      rootScale:1.08 },
  opt:{ hands:["fist","fist"] } };

// HUMILIATION — reliving the shame of being cut down defenceless, "like an ox
// at the manger." Head bowed and turned aside, gaze cast low, brows knit over a
// deep frown, shoulders drawn in, one hand lifted to the throat-wound, the
// other guarding the breast. A stooped, shamed, inward beat.
HERO_POSES.aga_shame = { id:"aga_shame", label:"reliving humiliation", group:"agamemnon",
  n:{ browUp:.34, browKnit:.6, frown:.46, eyeNarrow:.44,
      headPitch:.4, neckPitch:.2, headYaw:.34, headY:.12, headRoll:.08, gazeY:.4,
      spineLean:.12, bodyYaw:.22,
      shoulderLiftL:.4, armLUpper:-.66, armLLower:-1.72, handRotL:.34,  // hand lifted to the throat wound
      armRUpper:.36, armRLower:1.28, handRotR:-.16,                      // right arm guards the breast
      rootScale:1.0 },
  opt:{ hands:["relaxed","relaxed"] } };

// PATERNAL UNCERTAINTY — the anguished question about his son Orestes: does the
// boy still live, and will he avenge me? Chin lifting to search, one open palm
// turned up in a pleading question, brows flung high AND knit with worry, gaze
// lifted and searching, jaw parted on the question. Grief without the rage.
HERO_POSES.aga_ask = { id:"aga_ask", label:"paternal uncertainty", group:"agamemnon",
  n:{ browUp:.78, browKnit:.44, frown:.22, eyeWide:.16, jaw:.3, mouthAsym:.06,
      headPitch:-.14, neckPitch:-.06, headRoll:.14, headYaw:.1, gazeY:-.12, gazeX:.14,
      spineLean:-.08, bodyYaw:-.06,
      armRUpper:-.92, armRLower:.78, handRotR:.12,     // right palm turned up, questioning
      armLUpper:.2, armLLower:.5,
      rootScale:1.0 },
  opt:{ hands:["relaxed","palm_up"] } };

// CALM — a quiet standing turn for staging continuity: heavy stance, hands low,
// brows habitually knit, a permanent bitter set to the mouth even at rest.
HERO_POSES.aga_calm = { id:"aga_calm", label:"grim rest", group:"agamemnon",
  n:{ browUp:.16, browKnit:.4, frown:.24, eyeNarrow:.24,
      headPitch:.06, chestOpen:.3,
      armLUpper:.16, armLLower:.34, armRUpper:-.16, armRLower:.34,
      rootScale:1.04 },
  opt:{ hands:["relaxed","relaxed"] } };

const params = {
  skin:"#ded8cc", hairColor:"#a49e90",   // pale shade flesh; faded grey hair + beard (reads bearded, still ghostly)
  hair:"short", beard:true, glasses:false,
  garment:"armor", cloak:true, bareLegs:true, scale:1.02,
};

const fig = makeFigure(params);

/* ---- WOUND-MARKS, drawn as bespoke overlay over the armor ----
   The death-blows: a gash across the throat and stab-wounds at the breast.
   Rendered in flat solid grays + hard contour (the POST pass supplies dots): a
   dark jagged gash core with a pale bruise-halo so each wound reads as a torn
   opening rather than a smudge. Kept a touch MORE present than the ghost body
   so the murder is legible. Placed relative to the reported head + hip anchors
   so they sit on the figure across poses. */
function drawWound(ctx, x, y, len, ang, w){
  ctx.save();
  ctx.translate(x, y); ctx.rotate(ang);
  // pale torn halo around the wound
  ctx.fillStyle = gray(0xc8);
  ctx.beginPath(); ctx.ellipse(0, 0, len*0.62, w*1.9, 0, 0, Math.PI*2); ctx.fill();
  // dark gash core — a jagged lens
  ctx.fillStyle = gray(0x22); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-len*0.5, 0);
  ctx.quadraticCurveTo(-len*0.16, -w, 0, -w*0.35);
  ctx.quadraticCurveTo(len*0.2, -w*1.1, len*0.5, 0);
  ctx.quadraticCurveTo(len*0.16, w, 0, w*0.35);
  ctx.quadraticCurveTo(-len*0.2, w*1.1, -len*0.5, 0);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // a couple of ragged edge nicks
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-len*0.2, -w*0.5); ctx.lineTo(-len*0.34, -w*1.5);
  ctx.moveTo(len*0.24, w*0.4); ctx.lineTo(len*0.36, w*1.4);
  ctx.stroke();
  ctx.restore();
}
function drawWounds(ctx, W, H, head, hip){
  const cx = (head ? head.x : 0.5) * W;
  const neckY = (head ? head.y : 0.20) * H + H*0.055;   // just under the chin
  const chestY = ((head ? head.y : 0.20) + (hip ? hip.y : 0.60)) * 0.5 * H - H*0.02;
  // throat gash — the killing cut, angled across the neck
  drawWound(ctx, cx - W*0.006, neckY, W*0.115, 0.12, H*0.012);
  // breast stab-wounds — a cluster over the heart
  drawWound(ctx, cx - W*0.055, chestY - H*0.01, W*0.072, 0.9, H*0.010);
  drawWound(ctx, cx + W*0.035, chestY + H*0.02, W*0.066, -0.7, H*0.010);
  drawWound(ctx, cx - W*0.008, chestY + H*0.045, W*0.058, 0.35, H*0.009);
}

export const asset = {
  id:"character.agamemnons-shade",
  type:"CHARACTER",
  name:"Agamemnon's shade",
  statusWord:"EMBITTERED",
  scene:"OD-B11-S06",

  params,
  layers:["shadow","hair-back","legs","armor","cloak","torso","far-arm","neck",
          "head","face","beard","near-arm","wounds"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    throatWound:{x:.50,y:.25}, breastWound:{x:.48,y:.42},
    rightHand:{x:.70,y:.48}, leftHand:{x:.42,y:.52},
    hip:{x:.50,y:.62}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"warning",
    nodes:{
      // THE beat — bitter warning, a gripping hand thrust out, face aflame
      warning:  { preview:{ pose:"aga_warn", gaze:{x:-.1,y:-.02},
                            browUp:.42, browKnit:.64, eyeNarrow:.42, frown:.34,
                            jaw:.34, mouthAsym:.3, status:"WARNING" } },
      // anguished rage — reliving the murder, both fists up, a wide roar
      raging:   { preview:{ pose:"aga_rage", gaze:{x:.02,y:-.16},
                            browUp:.6, browKnit:.78, eyeWide:.4, frown:.5,
                            jaw:.72, status:"RAGING" } },
      // reliving the humiliation — bowed, ashamed, hand to the throat wound
      humiliated:{ preview:{ pose:"aga_shame", gaze:{x:.1,y:.4},
                             browUp:.34, browKnit:.6, frown:.46, eyeNarrow:.44,
                             status:"HUMILIATED" } },
      // paternal uncertainty — the open, pleading question about Orestes
      asking:   { preview:{ pose:"aga_ask", gaze:{x:.14,y:-.12},
                            browUp:.78, browKnit:.44, frown:.22, jaw:.3,
                            status:"UNCERTAIN" } },
      // grim standing rest for staging continuity
      neutral:  { preview:{ pose:"aga_calm", gaze:{x:0,y:.04},
                            browUp:.16, browKnit:.4, frown:.24, status:"GRIM" } },
    },
    edges:[
      ["warning","raging"],["raging","humiliated"],["humiliated","asking"],
      ["asking","warning"],["neutral","warning"],["raging","neutral"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","solid",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — EMBITTERED: the murdered king leaning in to thrust a
  // warning, half-gripping hand at Odysseus, his other fist clenched at a
  // wounded breast, face burning with anguished fury — brows raised AND knit,
  // eyes narrowed to a glare, jaw parted on a bitter word — throat and breast
  // torn with the death-wounds, the whole ghost translucent.
  preview:()=>({ pose:"aga_warn", gaze:{x:-.1,y:-.02},
                 browUp:.42, browKnit:.64, eyeNarrow:.42, frown:.34,
                 jaw:.34, mouthAsym:.3, t:0.45, status:"EMBITTERED", progress:.22 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // a shade: draw the figure translucent. `solid` forces him fully present.
    const alpha = st.solid ? 1 : 0.62;
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = fig.draw(ctx, W, H, st);
    ctx.restore();
    // the death-wounds, a touch more present than the ghost body
    const head = (r && r.anchors && r.anchors.head) || { x:0.5, y:0.20 };
    const hip  = (r && r.anchors && r.anchors.hip)  || { x:0.5, y:0.60 };
    ctx.save();
    ctx.globalAlpha = st.solid ? 1 : Math.min(1, alpha + 0.22);
    drawWounds(ctx, W, H, head, hip);
    ctx.restore();
    return r;
  },
};
export default asset;
