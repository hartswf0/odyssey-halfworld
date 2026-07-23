/* character.two-seized-sailors — two of Odysseus' crew caught in the giant's fist.
   A two-figure CHARACTER: draws BOTH sailor victims dangling in a giant's grip,
   flailing and screaming. Ordinary men in tunics — no armor, no rank — expressive
   terror faces and thrown-open limbs. A dark clenched giant hand clamps across
   their middles so they read as SEIZED and lifted off the deck.
   Composes the hero rig TWICE, one victim per side, each tilted as it hangs.
   States: grabbed / impact / lifeless / removed.
   Atlas scene: OD-B09-S07 — individual victim performers in the man-eater's grasp. */
import { makeFigure, INK } from "/engine/halfworld-engine.mjs";

// Sailor A — the younger crewman: lean, short dark hair, no beard, a touch smaller.
const paramsA = {
  skin:"#c7b092", hairColor:"#241c12",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:1.02,
};
// Sailor B — the older crewman: curly hair, short beard, a heavier frame.
// Distinct silhouette from A so the two victims never read as one doubled figure.
const paramsB = {
  skin:"#b6976f", hairColor:"#2c2114",
  hair:"curly", beard:true, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:1.08,
};

const figA = makeFigure(paramsA);
const figB = makeFigure(paramsB);

/* per-figure sub-states. `tilt` hangs the body askew (radians); `pose` +
   facial channels carry the terror. Each victim is drawn independently so
   they struggle in different directions. */
const V = {
  // GRABBED — the fist closes: both men wrench upward, arms flung high, mouths
  // torn open on a scream, eyes blown wide, brows shot up in raw panic.
  grabbed: {
    left:  { pose:"arms_open", tilt:-0.22, jaw:.78, eyeWide:.85, browUp:.95,
             frown:.32, mouthAsym:.15, gaze:{x:-.2,y:-.4}, t:.5 },
    right: { pose:"desperation", tilt:0.2, jaw:.64, eyeWide:.72, browUp:.9,
             frown:.4, mouthAsym:-.2, gaze:{x:.25,y:-.35}, t:.5 },
  },
  // IMPACT — swung and slammed: heads snap, arms claw wide at the air, faces at
  // maximum terror, jaws unhinged.
  impact: {
    left:  { pose:"desperation", tilt:-0.26, jaw:.9, eyeWide:.95, browUp:.7,
             browKnit:.35, frown:.5, mouthAsym:.4, gaze:{x:-.45,y:.15}, t:.5 },
    right: { pose:"arms_open", mirror:true, tilt:0.28, jaw:.82, eyeWide:.9,
             browUp:.75, browKnit:.3, frown:.45, gaze:{x:.5,y:.12}, t:.5 },
  },
  // LIFELESS — the struggle stops: limbs go slack, heads loll, eyes shut, mouths
  // fallen half-open. Both hang limp the same way, dead weight in the grip.
  lifeless: {
    left:  { pose:"head_lowered", tilt:-0.34, blink:1, jaw:.16, frown:.28,
             browUp:.12, eyeNarrow:.6, gaze:{x:0,y:.5}, t:.5 },
    right: { pose:"grief", tilt:0.28, blink:1, jaw:.1, frown:.3, browKnit:.18,
             browUp:.1, eyeNarrow:.55, gaze:{x:0,y:.55}, t:.5 },
  },
  // REMOVED — carried off / gone: rendered as faint ghosts of the two men, the
  // fist emptied. draw() dims the whole pass so the victims read as taken away.
  removed: {
    left:  { pose:"head_lowered", tilt:-0.5, blink:1, jaw:.14, frown:.2,
             eyeNarrow:.6, gaze:{x:0,y:.5}, t:.5 },
    right: { pose:"grief", tilt:0.38, blink:1, jaw:.1, frown:.24, eyeNarrow:.55,
             gaze:{x:0,y:.55}, t:.5 },
  },
};

const GRIP_Y = 0.66;   // the fist clamps across the hips (normalized H)

/* draw one victim into a box, tilted so it hangs askew from the fist. The
   pivot sits at the hip grip so the tilt swings the flailing upper body and
   dangling legs, faces kept readable above the grip. */
function drawVictim(ctx, W, H, fig, sub, cx){
  const boxW = W*0.62;
  const pivotY = H*GRIP_Y;
  ctx.save();
  ctx.translate(cx*W, pivotY);       // pivot at the grab point (hips)
  ctx.rotate(sub.tilt||0);           // hang askew
  ctx.translate(-boxW/2, -pivotY);   // draw the full figure in its box
  fig.draw(ctx, boxW, H, sub);
  ctx.restore();
}

/* the giant's clenched hand clamping across both men's hips — a PALE, flesh-
   toned fist so it reads clearly against the dark bodies: a back-of-hand bar
   with four separated fingers curling over the front (dark body showing in the
   gaps) and a hooking thumb. Sits LOW so the terror faces + flailing arms stay
   visible above it. Solid grays + hard contour; the POST pass adds the dots. */
function drawGiantGrip(ctx, W, H){
  const cx=W*0.5, cy=H*GRIP_Y, gw=W*0.74, gh=H*0.055;
  const hand="#a6a69e", handDeep="#8a8a82", crease="#4a4a44";
  ctx.save();
  ctx.lineJoin="round"; ctx.lineCap="round";
  // wrist wedge running off the right edge — implies the giant's arm
  ctx.fillStyle=handDeep; ctx.strokeStyle=INK; ctx.lineWidth=6;
  ctx.beginPath();
  ctx.moveTo(cx+gw*0.30, cy-gh*1.1);
  ctx.lineTo(W+20, cy-gh*2.2);
  ctx.lineTo(W+20, cy+gh*2.6);
  ctx.lineTo(cx+gw*0.30, cy+gh*1.4);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // back-of-hand bar behind the fingers
  ctx.fillStyle=hand; ctx.strokeStyle=INK; ctx.lineWidth=6;
  ctx.beginPath();
  ctx.moveTo(cx-gw*0.5, cy-gh*0.5);
  ctx.quadraticCurveTo(cx-gw*0.2, cy-gh*1.5, cx+gw*0.5, cy-gh*1.0);
  ctx.lineTo(cx+gw*0.5, cy+gh*0.6);
  ctx.quadraticCurveTo(cx, cy+gh*0.9, cx-gw*0.5, cy+gh*0.4);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // four separated fingers curling DOWN over the front of the victims
  const fN=4, span=gw*0.82, fW=span/fN;
  for(let i=0;i<fN;i++){
    const fx = cx - span*0.5 + i*fW + fW*0.5;
    const drop = gh*(2.6 - Math.abs(i-1.5)*0.35);   // middle fingers longer
    ctx.fillStyle=hand; ctx.strokeStyle=INK; ctx.lineWidth=6;
    ctx.beginPath();
    ctx.roundRect(fx-fW*0.34, cy-gh*0.2, fW*0.68, drop, fW*0.3);
    ctx.fill(); ctx.stroke();
    // knuckle crease across each finger
    ctx.strokeStyle=crease; ctx.lineWidth=3.5;
    ctx.beginPath();
    ctx.moveTo(fx-fW*0.24, cy+drop*0.42); ctx.lineTo(fx+fW*0.24, cy+drop*0.42);
    ctx.stroke();
  }
  // thumb, hooking in from the left over the near body
  ctx.fillStyle=hand; ctx.strokeStyle=INK; ctx.lineWidth=6;
  ctx.beginPath();
  ctx.ellipse(cx-gw*0.46, cy+gh*0.3, fW*0.44, gh*1.8, 0.55, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

export const asset = {
  id:"character.two-seized-sailors",
  type:"CHARACTER",
  name:"Two seized sailors",
  statusWord:"SEIZED",
  scene:"OD-B09-S07",

  params:{ sailorA:paramsA, sailorB:paramsB, figures:2 },
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face",
          "hair-front","beard","near-arm","giant-grip"],
  // normalized 0..1 anchors: each victim's head + a flailing hand, and the
  // giant's grip point that clamps them both.
  anchors:{
    sailorAHead:{x:.30,y:.16}, sailorAHand:{x:.20,y:.30},
    sailorBHead:{x:.70,y:.16}, sailorBHand:{x:.82,y:.30},
    gripPoint:{x:.50,y:.44}, feet:{x:.50,y:.90},
  },
  states:{
    initial:"grabbed",
    nodes:{
      grabbed:  { preview:{ variant:"grabbed" } },
      impact:   { preview:{ variant:"impact" } },
      lifeless: { preview:{ variant:"lifeless" } },
      removed:  { preview:{ variant:"removed" } },
    },
    edges:[["grabbed","impact"],["impact","lifeless"],
           ["lifeless","removed"],["grabbed","lifeless"]],
  },
  channels:["variant","pose","gaze","mouth","jaw","browUp","browKnit",
            "frown","eyeWide","eyeNarrow","blink"],

  // CARD SIGNATURE — SEIZED: both crewmen wrenched off the deck in the giant's
  // clenched fist, arms flung high, mouths torn open screaming, eyes blown wide.
  preview:()=>({ variant:"grabbed", status:"SEIZED", progress:.35 }),

  draw(ctx, W, H, state){
    const s = state || {};
    const v = V[s.variant] || V.grabbed;
    if (s.variant==="removed"){ ctx.save(); ctx.globalAlpha=0.28; }
    drawVictim(ctx, W, H, figA, v.left,  0.29);
    drawVictim(ctx, W, H, figB, v.right, 0.71);
    if (s.variant==="removed"){ ctx.restore(); }
    // the fist clamps across both, on top
    ctx.save();
    if (s.variant==="removed") ctx.globalAlpha=0.85;
    drawGiantGrip(ctx, W, H);
    ctx.restore();
  },
};
export default asset;
