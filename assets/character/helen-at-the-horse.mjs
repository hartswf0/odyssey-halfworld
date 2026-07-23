/* character.helen-at-the-horse — Helen circling the wooden horse by night.
   CHARACTER asset (a Helen variant: gown, long hair, diadem). In the Odyssey
   (Book 4, Menelaus' tale) Helen walks around the hollow horse and calls out
   in the voices of the Argive wives, tempting the hidden men to answer —
   whether to betray or to test them stays ambiguous.
   Scene function: OD-B04-S04 — circling listener and vocal mimic whose
   intention remains unreadable: a sly listening face + a cupped hand to the
   mouth throwing a borrowed voice, the other hand beckoning.
   Built on the engine hero rig (identity = fair skin, long hair, dress) with
   a custom gold diadem, a long dress skirt and hair drape, all painted in
   solid grays so the engine's dotify POST pass supplies the halftone. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  skin:"#e7e0d2", hairColor:"#2b2118",
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:0.97,
};

const fig = makeFigure(params);

/* ---- custom poses for Helen's beat ----
   The rig reads brow/eye/mouth expression ONLY from the pose definition, so
   the "sly listening + cupped-hand-calling" signature needs its own pose.
   POSES is a module singleton shared with figure-hero, so registering here
   makes these ids resolvable by the rig's composeStatic. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"helen", n, opt:hands?{hands}:{} }; }

// SIGNATURE — HELEN THE MIMIC: head turned to listen at the horse's flank
// (to her left, the side she circles), eyes narrowed to a sly slit, mouth
// skewed in a knowing half-smile with the jaw parted on a called syllable;
// the NEAR/front (left) hand cupped up beside the mouth throwing a borrowed
// voice, the FAR (right) hand lifted low, beckoning the men to answer.
// (bodyYaw slightly negative => the rig draws the LEFT arm in FRONT, so the
// cupping hand reads clearly instead of hiding behind the torso.)
P("helen_mimic", {
  bodyYaw:-.16, headYaw:-.5, neckYaw:-.24, gazeX:-.62, gazeY:.02,
  smile:.34, mouthAsym:.66, eyeNarrow:.42, browUp:.24, browKnit:.06, jaw:.3,
  spineLean:-.05,
  armLUpper:-.72, armLLower:-1.98, shoulderLiftL:.5, handRotL:.4,  // near/front hand cupped to the mouth
  armRUpper:-.4, armRLower:.86, handRotR:-.15,                      // far hand low, beckoning
}, ["open_palm","palm_up"]);

// CALLING OUT — the same voice thrown louder: head lifted and turned, jaw wide
// on a shout, the near/front (left) arm flung up hailing toward the horse, the
// sly narrowing gone slack into an open call — but the skewed mouth keeps the
// intent unreadable.
P("helen_call", {
  bodyYaw:-.12, headYaw:-.42, neckYaw:-.2, gazeX:-.5, gazeY:-.12,
  smile:.28, mouthAsym:.4, jaw:.62, eyeWide:.2, browUp:.42,
  spineLean:-.12,
  armLUpper:2.46, armLLower:-.18, shoulderLiftL:.66, handRotL:.15,   // near arm raised, hailing/beckoning
  armRUpper:-.34, armRLower:.9, shoulderLiftR:.12,                    // far arm low at her side
}, ["open_palm","relaxed"]);

// SLY LISTEN — poised and quiet, head cocked to the wood, ear turned, a
// private curl at the mouth; hands settled, gathered low. The read is pure
// ambiguity: is she listening for a name to betray, or to be sure?
P("helen_listen", {
  bodyYaw:-.1, headYaw:-.44, neckYaw:-.22, headRoll:-.1, gazeX:-.55, gazeY:.08,
  smile:.2, mouthAsym:.5, eyeNarrow:.34, browUp:.16,
  armLUpper:-.3, armLLower:-.86, handRotL:.2,
  armRUpper:.28, armRLower:.72, handRotR:-.2,
}, ["relaxed","relaxed"]);

/* Long hair drape — a soft mass behind head/shoulders so Helen reads as
   long-haired under the diadem. Drawn BEFORE the figure (behind it). Solid
   gray; the dotify pass supplies the weave. */
function drawHairDrape(ctx, W, H){
  const cx = W*0.50, crownY = H*0.150, shY = H*0.560;
  ctx.fillStyle = gray(0x2a); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.150, crownY + H*0.055);
  ctx.quadraticCurveTo(cx - W*0.190, H*0.31, cx - W*0.146, shY);
  ctx.quadraticCurveTo(cx, shY + H*0.05, cx + W*0.146, shY);
  ctx.quadraticCurveTo(cx + W*0.190, H*0.31, cx + W*0.150, crownY + H*0.055);
  ctx.quadraticCurveTo(cx, crownY - H*0.035, cx - W*0.150, crownY + H*0.055);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

/* Long dress skirt — a bell of cloth from waist to ankles, drawn OVER the
   rig's legs so Helen reads as gowned rather than trousered. Narrow at the
   waist so the hanging arms stay clear. Solid dress-gray; dotify supplies the
   weave. */
function drawSkirt(ctx, W, H){
  const cx = W*0.50, waistY = H*0.612, hemY = H*0.905;
  const wTop = W*0.086, wHem = W*0.162;
  ctx.fillStyle = gray(0x9a); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
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

/* The diadem — a banded circlet arching over the hairline with a central jewel
   and a row of small points, the mark of the Spartan queen. Drawn AFTER the
   figure using the rig's reported head + crown anchors so it tracks the pose.
   Solid grays + ink edge; dotify does the rest. */
function drawDiadem(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.075;
  const band = R*0.93;                 // radius of the circlet from head center
  const a0 = -Math.PI/2 - 0.82, a1 = -Math.PI/2 + 0.82;  // spans the forehead

  ctx.lineCap = "butt"; ctx.lineJoin = "round";
  // dark band base (ink) then a lighter inlay stripe → a two-tone metal circlet
  ctx.strokeStyle = INK; ctx.lineWidth = R*0.20;
  ctx.beginPath(); ctx.arc(cx, cy, band, a0, a1); ctx.stroke();
  ctx.strokeStyle = gray(0xbe); ctx.lineWidth = R*0.11;
  ctx.beginPath(); ctx.arc(cx, cy, band, a0, a1); ctx.stroke();

  // small points rising from the band (a low tiara)
  ctx.fillStyle = gray(0x86); ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
  for (const f of [-0.62, -0.31, 0.31, 0.62]){
    const a = -Math.PI/2 + f;
    const bx = cx + Math.cos(a)*band, by = cy + Math.sin(a)*band;
    const tx = cx + Math.cos(a)*(band + R*0.18), ty = cy + Math.sin(a)*(band + R*0.18);
    const nx = -Math.sin(a), ny = Math.cos(a), s = R*0.06;
    ctx.beginPath();
    ctx.moveTo(bx - nx*s, by - ny*s);
    ctx.lineTo(tx, ty);
    ctx.lineTo(bx + nx*s, by + ny*s);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // central jewel — a small diamond at the crown of the band
  const jx = cx, jy = cy - band - R*0.02, jr = R*0.13;
  ctx.fillStyle = gray(0x64); ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(jx, jy - jr); ctx.lineTo(jx + jr*0.8, jy);
  ctx.lineTo(jx, jy + jr); ctx.lineTo(jx - jr*0.8, jy);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // facet glint
  ctx.strokeStyle = gray(0xe6); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(jx - jr*0.35, jy - jr*0.25); ctx.lineTo(jx, jy + jr*0.2); ctx.stroke();
}

export const asset = {
  id:"character.helen-at-the-horse",
  type:"CHARACTER",
  name:"Helen at the horse",
  statusWord:"AMBIGUOUS",
  scene:"OD-B04-S04",

  params,
  layers:["shadow","hair-drape","legs","dress","far-arm","neck","head","face","hair-front","near-arm","skirt","diadem"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.21},
    diademPeak:{x:.50,y:.11}, mouth:{x:.53,y:.24},
    rightHand:{x:.60,y:.30}, leftHand:{x:.30,y:.60},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // poised, quiet — head cocked, ear turned to the wood, a private curl
      neutral:  { preview:{ pose:"helen_listen", gaze:{x:-.55,y:.08}, t:0.5 } },
      // SIGNATURE beat: cupped hand to the mouth throwing a borrowed voice,
      // sly narrowed eyes, the far hand beckoning (OD-B04-S04)
      mimic:    { preview:{ pose:"helen_mimic", gaze:{x:-.62,y:.02},
                            smile:.34, mouthAsym:.66, eyeNarrow:.42, browUp:.24,
                            jaw:.3, t:0.5 } },
      // the call thrown louder — jaw wide, arm raised beckoning, still unreadable
      calling:  { preview:{ pose:"helen_call", gaze:{x:-.5,y:-.12},
                            jaw:.62, smile:.28, mouthAsym:.4, eyeWide:.2,
                            browUp:.42, t:0.5 } },
      // circling the horse — walk cycle, head still turned, listening as she goes
      circling: { preview:{ pose:"walk_neutral", band:"threeq", gaze:{x:-.5,y:.05},
                            mouthAsym:.4, eyeNarrow:.28, browUp:.14, t:0.35 } },
      // a colder read — narrowed, no smile, the mimicry turned toward betrayal
      scheming: { preview:{ pose:"helen_listen", eyeNarrow:.55, browKnit:.28,
                            mouthAsym:.5, smile:.06, gaze:{x:-.5,y:.1}, t:0.5 } },
      // profile at the flank of the horse
      profile:  { preview:{ pose:"profile_left", gaze:{x:-.4,y:.05},
                            mouthAsym:.4, eyeNarrow:.3, t:0.5 } },
    },
    edges:[["neutral","mimic"],["mimic","calling"],["calling","neutral"],
           ["neutral","circling"],["circling","mimic"],["neutral","scheming"],
           ["scheming","mimic"],["neutral","profile"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — AMBIGUOUS: head turned to listen, eyes narrowed to a sly
  // slit, a knowing skewed half-smile with the jaw parted on a called
  // syllable, the near hand cupped to the mouth throwing a voice, the far hand
  // low and beckoning.
  preview:()=>({ pose:"helen_mimic", gaze:{x:-.62,y:.02},
                 smile:.34, mouthAsym:.66, eyeNarrow:.42, browUp:.24,
                 browKnit:.06, jaw:.3, t:0.5, status:"AMBIGUOUS", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // long hair mass behind the figure
    drawHairDrape(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // long dress skirt draped over the legs
    drawSkirt(ctx, W, H);
    // the diadem, tracking the rig's head + crown anchors
    const head  = (r && r.anchors && r.anchors.head)  || { x:0.5, y:0.20 };
    const crown = (r && r.anchors && r.anchors.crown) || { x:0.5, y:0.13 };
    drawDiadem(ctx, W, H, head, crown);
    return r;
  },
};
export default asset;
