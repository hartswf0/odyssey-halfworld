/* creature.enchanted-wolves-and-lions — Circe's drugged beasts.
   CREATURE asset. A wolf and a maned lion (NOT humanoid): fully custom
   quadruped geometry built from engine primitives — articulated legs
   (upper/lower segments + paws), lowered fawning neck + gaze head, and
   species-distinct silhouettes. The wolf has pricked triangular ears, a
   long narrow muzzle and a thick BUSHY plume tail; the lion has a jagged
   MANE ring, a short broad muzzle, small rounded ears and a thin TUFTED
   tail. Both behave like tame fawning dogs: heads lowered/forward,
   lolling tongues, tails wagging UP — an approaching, non-aggressive
   greeting toward arriving humans off-frame right. States fawn / approach
   / sit / rise. Drawn in SOLID grays + hard contour; the engine POST pass
   supplies the dot-matrix halftone.
   Atlas: OD-B10-S04 — dangerous silhouettes behaving like tame dogs. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- flat tone levels (POST turns them into dots) ---- */
const T_BODY    = ()=> toneSolid(inkLevel(4));
const T_HEAD    = ()=> toneSolid(inkLevel(4));
const T_NEARLEG = ()=> toneSolid(inkLevel(5));
const T_FARLEG  = ()=> toneSolid(inkLevel(6));
const T_EAR     = ()=> toneSolid(inkLevel(6));
const T_MUZZLE  = ()=> toneSolid(inkLevel(5));
const T_TAIL    = ()=> toneSolid(inkLevel(4));
const T_MANE    = ()=> toneSolid(inkLevel(6));
const T_TONGUE  = ()=> toneSolid(inkLevel(3));

const P = (x,y)=>({x,y});

/* ---------- one leg: two segments + paw ---------- */
function drawLeg(pen, hip, knee, paw, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(paw.x,paw.y); }, tone, w*0.82);
  pen.paint(()=>{ g.ellipse(paw.x, paw.y - w*0.15, w*0.85, w*0.5, 0, 0, 7); }, tone, 3.5);
}

/* ---------- lolling tongue (the "tame dog" tell) ---------- */
function drawTongue(pen, tip, dir, U){
  const g = pen.ctx;
  pen.paint(()=>{
    g.moveTo(tip.x - dir*U*0.02, tip.y + U*0.02);
    g.quadraticCurveTo(tip.x + dir*U*0.10, tip.y + U*0.10, tip.x + dir*U*0.06, tip.y + U*0.20);
    g.quadraticCurveTo(tip.x + dir*U*0.02, tip.y + U*0.26, tip.x - dir*U*0.02, tip.y + U*0.20);
    g.quadraticCurveTo(tip.x - dir*U*0.05, tip.y + U*0.10, tip.x - dir*U*0.02, tip.y + U*0.02);
    g.closePath();
  }, T_TONGUE(), 3);
  // center crease
  pen.ink(()=>{ g.moveTo(tip.x + dir*U*0.02, tip.y + U*0.06); g.lineTo(tip.x + dir*U*0.03, tip.y + U*0.18); }, 2);
}

/* ---------- WOLF head: long narrow muzzle, pricked ears ---------- */
function drawWolfHead(pen, HC, rx, ry, dir, U, { earUp=0.7, tongue=1, gazeDown=0.3 }={}){
  const g = pen.ctx;
  const earLift = lerp(ry*0.7, ry*1.9, earUp);
  const ear = (bx, tone)=>{
    pen.paint(()=>{
      g.moveTo(HC.x - dir*rx*0.10 + bx, HC.y - ry*0.55);
      g.lineTo(HC.x + dir*rx*0.42 + bx, HC.y - ry*0.30);
      g.lineTo(HC.x - dir*rx*0.02 + bx, HC.y - ry*0.30 - earLift);
      g.closePath();
    }, tone, 4);
  };
  ear(-dir*rx*0.16, T_EAR());                         // far ear
  // long tapered muzzle + jaw
  const mTip = P(HC.x + dir*(rx*0.85 + U*0.34), HC.y + ry*0.36);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.15, HC.y - ry*0.34);
    g.quadraticCurveTo(HC.x + dir*(rx*0.9 + U*0.20), HC.y - ry*0.14, mTip.x, mTip.y);
    g.lineTo(mTip.x - dir*U*0.02, mTip.y + ry*0.40);
    g.quadraticCurveTo(HC.x + dir*rx*0.55, HC.y + ry*0.78, HC.x + dir*rx*0.02, HC.y + ry*0.82);
    g.closePath();
  }, T_MUZZLE(), 4);
  // skull
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, 7); }, T_HEAD(), 4);
  ear(dir*rx*0.06, T_EAR());                            // near ear
  // brow / stop
  pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.12, HC.y - ry*0.12); g.lineTo(HC.x + dir*rx*0.48, HC.y + ry*0.02); }, 2.5);
  // soft (docile) eye
  const eye = P(HC.x + dir*rx*0.42, HC.y - ry*0.06 + gazeDown*ry*0.30);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, rx*0.12, rx*0.10, 0, 0, 7); g.fill();
  // nose
  g.beginPath(); g.ellipse(mTip.x + dir*rx*0.02, mTip.y + ry*0.02, rx*0.15, rx*0.12, 0, 0, 7); g.fill();
  // open, panting mouth line
  pen.ink(()=>{
    g.moveTo(mTip.x - dir*U*0.02, mTip.y + ry*0.26);
    g.lineTo(HC.x + dir*rx*0.30, HC.y + ry*0.58);
  }, 2.5);
  if (tongue) drawTongue(pen, P(mTip.x - dir*U*0.04, mTip.y + ry*0.30), dir, U);
}

/* ---------- LION head: jagged mane ring, broad muzzle, tufted look ---------- */
function drawLionHead(pen, HC, rx, ry, dir, U, { tongue=1, gazeDown=0.28, maneR=1 }={}){
  const g = pen.ctx;
  // --- MANE: jagged fur disc drawn BEHIND the skull ---
  const MR = rx*1.75*maneR;
  const spikes = 22;
  pen.paint(()=>{
    for(let i=0;i<=spikes;i++){
      const a = (i/spikes)*Math.PI*2;
      const jag = (i%2===0) ? 1.0 : 0.72;              // alternating spike/valley
      const r = MR*jag*(0.92 + 0.08*Math.sin(i*1.7));
      const x = HC.x + Math.cos(a)*r*0.92;
      const y = HC.y + Math.sin(a)*r;
      if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
    }
    g.closePath();
  }, T_MANE(), 4);
  // small rounded ears peeking over the mane
  const rear = (bx)=>{ pen.paint(()=>{ g.ellipse(HC.x + bx, HC.y - ry*0.85, rx*0.24, rx*0.24, 0, 0, 7); }, T_EAR(), 3.5); };
  rear(-dir*rx*0.30); rear(dir*rx*0.02);
  // short broad muzzle + heavy jaw
  const mTip = P(HC.x + dir*(rx*0.72 + U*0.14), HC.y + ry*0.40);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.18, HC.y - ry*0.30);
    g.quadraticCurveTo(HC.x + dir*(rx*0.78 + U*0.10), HC.y - ry*0.02, mTip.x, mTip.y);
    g.lineTo(mTip.x - dir*U*0.02, mTip.y + ry*0.46);
    g.quadraticCurveTo(HC.x + dir*rx*0.52, HC.y + ry*0.92, HC.x - dir*rx*0.02, HC.y + ry*0.90);
    g.closePath();
  }, T_MUZZLE(), 4);
  // skull (rounder, lighter than mane so it reads inside the ring)
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, 7); }, T_HEAD(), 4);
  // brow
  pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.06, HC.y - ry*0.14); g.lineTo(HC.x + dir*rx*0.46, HC.y + ry*0.02); }, 2.5);
  // soft eye
  const eye = P(HC.x + dir*rx*0.40, HC.y - ry*0.02 + gazeDown*ry*0.30);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, rx*0.13, rx*0.11, 0, 0, 7); g.fill();
  // broad nose
  g.beginPath(); g.ellipse(mTip.x + dir*rx*0.01, mTip.y + ry*0.04, rx*0.19, rx*0.14, 0, 0, 7); g.fill();
  // mouth
  pen.ink(()=>{
    g.moveTo(mTip.x - dir*U*0.02, mTip.y + ry*0.30);
    g.lineTo(HC.x + dir*rx*0.28, HC.y + ry*0.66);
  }, 2.5);
  if (tongue) drawTongue(pen, P(mTip.x - dir*U*0.04, mTip.y + ry*0.34), dir, U);
}

/* ---------- generic fawning quadruped body ---------- */
/* species: "wolf" | "lion".  pose: "fawn" | "approach" | "sit" | "rise" */
function drawBeast(pen, cx, groundY, S, dir, species, pose, t){
  const g = pen.ctx;
  const isLion = species==="lion";
  const U = S*0.255 * (isLion ? 1.06 : 0.92);
  const bodyH = S*(isLion ? 0.170 : 0.150);
  const shoulderX = cx + dir*U*0.34;
  const hipX      = cx - dir*U*0.34;
  const back = bodyH;

  const sitting = pose==="sit";
  // fawning: head dips & bobs low; approach: mild trot; wag on all friendly poses
  const wag = Math.sin(t*5.0 + (isLion?1.4:0)) ;      // -1..1 tail sway
  const bob = (pose==="fawn") ? Math.sin(t*2.4)*0.03 : 0;
  const step = pose==="approach";
  const ph = t*4.4 + (dir<0?Math.PI:0);
  const sw   = step ? Math.sin(ph)*U*0.16 : 0;
  const lift = step ? Math.max(0,Math.sin(ph))*S*0.038 : 0;
  const sw2  = step ? Math.sin(ph+Math.PI)*U*0.16 : 0;
  const lift2= step ? Math.max(0,Math.sin(ph+Math.PI))*S*0.038 : 0;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+4, U*0.78, U*0.15, 0, 0, 7); g.fill(); g.restore();

  if (sitting){
    drawSit(pen, cx, groundY, S, dir, species, t, wag);
    return;
  }

  // torso key points (a friendly, slightly play-bowed stance: front lower)
  const bowF = (pose==="fawn") ? 0.06 : 0.0;           // front-end dip for the play-bow
  const W  = P(shoulderX,              groundY - back*(1.0 - bowF));   // withers (front, lowered when fawning)
  const C  = P(hipX,                   groundY - back*1.02);          // croup (rump raised)
  const CF = P(shoulderX + dir*U*0.22, groundY - back*(0.52 - bowF*0.5)); // chest bottom
  const CB = P(shoulderX + dir*U*0.10, groundY - back*0.30);          // belly front
  const BR = P(hipX + dir*U*0.10,      groundY - back*0.32);          // belly rear
  const R  = P(hipX - dir*U*0.18,      groundY - back*0.66);          // rear thigh

  // ---- TAIL (wagging — the friendly signal) : species-specific ----
  if (isLion){
    // long THIN tail hanging back-and-down just behind the rump, small tuft
    // (a lion tail, kept close to the body so it never reads as a floating ball).
    const tb  = P(hipX - dir*U*0.04, groundY - back*0.84);
    const tipX = hipX - dir*U*(0.28 + 0.04*wag);
    const tipY = groundY - back*(0.52 + 0.05*wag);
    pen.limb(()=>{ g.moveTo(tb.x,tb.y);
      g.quadraticCurveTo(hipX - dir*U*0.34, groundY - back*0.74, tipX, tipY); }, T_TAIL(), U*0.05);
    pen.paint(()=>{ g.ellipse(tipX, tipY, U*0.085, U*0.11, 0, 0, 7); }, T_MANE(), 3.5); // tuft
  } else {
    // BUSHY plume: a FAT curved limb (thick lineWidth) + a fluffy rounded tip,
    // curling UP over the back — the wolf brush.
    const tb  = P(hipX - dir*U*0.06, groundY - back*0.84);
    const tipX = hipX - dir*U*(0.40 - 0.08*wag);
    const tipY = groundY - back*(1.24 + 0.08*wag);
    const ctl = P(hipX - dir*U*0.46, groundY - back*1.00);
    pen.limb(()=>{ g.moveTo(tb.x,tb.y); g.quadraticCurveTo(ctl.x,ctl.y,tipX,tipY); }, T_TAIL(), U*0.19);
    pen.paint(()=>{ g.ellipse(tipX, tipY, U*0.15, U*0.19, 0.5*dir, 0, 0, 7); }, T_TAIL(), 4); // fluffy tip
  }

  // ---- FAR legs (darker, drawn first) ----
  const off = dir*U*0.07;
  drawLeg(pen, P(shoulderX-off, groundY-back*0.82), P(shoulderX-off+dir*U*0.04, groundY-back*0.42),
          P(shoulderX-off+dir*U*0.06 - sw2, groundY - lift2), U*0.11, T_FARLEG());
  drawLeg(pen, P(hipX-off, groundY-back*0.80), P(hipX-off+dir*U*0.09, groundY-back*0.44),
          P(hipX-off+dir*U*0.02 - sw, groundY - lift), U*0.11, T_FARLEG());

  // ---- torso ----
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.14, W.y - bodyH*0.10, W.x, W.y);
    g.quadraticCurveTo(cx, W.y - bodyH*0.06, C.x, C.y);
    g.quadraticCurveTo(hipX - dir*U*0.14, C.y + bodyH*0.04, R.x, R.y);
    g.quadraticCurveTo(hipX - dir*U*0.06, BR.y, BR.x, BR.y);
    g.quadraticCurveTo(cx, BR.y + bodyH*0.08, CB.x, CB.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.20, CB.y - bodyH*0.04, CF.x, CF.y);
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- neck: lowered & forward (fawning), fill wedge withers -> head ----
  const headDrop = (pose==="fawn") ? 0.86 : 1.05;      // gently lowered head = docile (not merged into legs)
  const HC = P(shoulderX + dir*U*(0.44 + bob), groundY - back*(headDrop + bob));
  const rx = U*(isLion?0.26:0.22), ry = U*(isLion?0.22:0.18);
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.02, groundY - back*(1.0 - bowF)*0.96);
    g.quadraticCurveTo(HC.x - dir*rx*0.8, HC.y - ry*0.4, HC.x - dir*rx*0.2, HC.y - ry*0.2);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.6);
    g.quadraticCurveTo(shoulderX + dir*U*0.30, groundY - back*0.60, CF.x, CF.y);
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- head ----
  if (isLion) drawLionHead(pen, HC, rx, ry, dir, U, { gazeDown:0.30 });
  else        drawWolfHead(pen, HC, rx, ry, dir, U, { earUp:0.6, gazeDown:0.35 });

  // ---- NEAR legs (over body) ----
  drawLeg(pen, P(shoulderX, groundY-back*0.82), P(shoulderX+dir*U*0.04, groundY-back*0.42),
          P(shoulderX+dir*U*0.06 + sw, groundY - lift), U*0.12, T_NEARLEG());
  drawLeg(pen, P(hipX, groundY-back*0.80), P(hipX+dir*U*0.09, groundY-back*0.44),
          P(hipX+dir*U*0.02 + sw2, groundY - lift2), U*0.12, T_NEARLEG());
}

/* ---------- SITTING fawner (haunches down, head up & begging) ---------- */
function drawSit(pen, cx, groundY, S, dir, species, t, wag){
  const g = pen.ctx;
  const isLion = species==="lion";
  const U = S*0.255 * (isLion ? 1.06 : 0.92);
  const bodyH = S*(isLion ? 0.200 : 0.180);
  const shoulderX = cx + dir*U*0.26;
  const hipX      = cx - dir*U*0.30;

  // ---- tail wagging on the ground behind the haunch ----
  const tb = P(hipX - dir*U*0.16, groundY - bodyH*0.30);
  const twx = hipX - dir*U*(0.40 + 0.06*wag);
  if (isLion){
    pen.limb(()=>{ g.moveTo(tb.x,tb.y); g.quadraticCurveTo(twx, groundY - bodyH*0.02, hipX - dir*U*0.20, groundY - bodyH*0.02); }, T_TAIL(), U*0.06);
    pen.paint(()=>{ g.ellipse(hipX - dir*U*0.20, groundY - bodyH*0.02, U*0.11, U*0.12, 0,0,7); }, T_MANE(), 3.5);
  } else {
    pen.paint(()=>{
      g.moveTo(tb.x, tb.y);
      g.quadraticCurveTo(twx, groundY - bodyH*0.02, hipX - dir*U*0.18, groundY + U*0.02);
      g.quadraticCurveTo(hipX - dir*U*0.30, groundY - bodyH*0.12, tb.x + dir*U*0.04, tb.y + U*0.03);
      g.closePath();
    }, T_TAIL(), 4);
  }

  // far foreleg
  drawLeg(pen, P(shoulderX - dir*U*0.06, groundY-bodyH*0.86), P(shoulderX - dir*U*0.06, groundY-bodyH*0.44),
          P(shoulderX - dir*U*0.04, groundY), U*0.11, T_FARLEG());
  // haunch
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.02, groundY - bodyH*0.34, U*0.30, bodyH*0.40, 0, 0, 7); }, T_BODY(), 4.5);
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.26, groundY - bodyH*0.03, U*0.16, U*0.07, 0, 0, 7); }, T_NEARLEG(), 3.5);

  // torso
  const W  = P(shoulderX, groundY - bodyH*1.04);
  const CF = P(shoulderX + dir*U*0.22, groundY - bodyH*0.56);
  const CB = P(shoulderX + dir*U*0.06, groundY - bodyH*0.20);
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.12, W.y - bodyH*0.06, W.x, W.y);
    g.quadraticCurveTo(cx - dir*U*0.02, groundY - bodyH*0.90, hipX + dir*U*0.02, groundY - bodyH*0.62);
    g.quadraticCurveTo(hipX + dir*U*0.24, groundY - bodyH*0.42, hipX + dir*U*0.30, groundY - bodyH*0.28);
    g.quadraticCurveTo(cx + dir*U*0.06, groundY - bodyH*0.12, CB.x, CB.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.18, CB.y - bodyH*0.04, CF.x, CF.y);
    g.closePath();
  }, T_BODY(), 4.5);

  // neck up to raised, friendly head
  const HC = P(shoulderX + dir*U*0.40, groundY - bodyH*1.40);
  const rx = U*(isLion?0.25:0.21), ry = U*(isLion?0.21:0.18);
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.04, groundY - bodyH*1.00);
    g.quadraticCurveTo(HC.x - dir*rx*0.8, HC.y - ry*0.2, HC.x - dir*rx*0.2, HC.y - ry*0.2);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.5);
    g.quadraticCurveTo(shoulderX + dir*U*0.30, groundY - bodyH*0.64, CF.x, CF.y);
    g.closePath();
  }, T_BODY(), 4.5);

  if (isLion) drawLionHead(pen, HC, rx, ry, dir, U, { gazeDown:0.10 });
  else        drawWolfHead(pen, HC, rx, ry, dir, U, { earUp:0.7, gazeDown:0.12 });

  // near foreleg
  drawLeg(pen, P(shoulderX + dir*U*0.02, groundY-bodyH*0.86), P(shoulderX + dir*U*0.02, groundY-bodyH*0.44),
          P(shoulderX + dir*U*0.04, groundY), U*0.12, T_NEARLEG());
}

/* poses per scene state: [wolfPose, lionPose] */
function posePair(pose){
  switch(pose){
    case "approach": return ["approach","approach"];
    case "sit":      return ["sit","sit"];
    case "rise":     return ["approach","fawn"];
    default:         return ["fawn","fawn"];   // the neutral docile greeting
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 0.84;
  const groundY = H*0.60;
  const t = state.t || 0;
  const [pWolf, pLion] = posePair(state.pose || "fawn");

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.04, groundY+2); ctx.lineTo(W*0.96, groundY+2); ctx.stroke(); ctx.restore();

  // wolf (left) + lion (right); both orient RIGHT toward arriving humans off-frame
  drawBeast(pen, W*0.25, groundY, S, +1, "wolf", pWolf, t);
  drawBeast(pen, W*0.70, groundY, S, +1, "lion", pLion, t+0.6);
}

export const asset = {
  id:"creature.enchanted-wolves-and-lions",
  type:"CREATURE",
  name:"Enchanted wolves and lions",
  statusWord:"FAWNING",
  scene:"OD-B10-S04",

  // procedural knobs
  params:{
    species:["wolf","lion"],
    faceDir:+1,           // both orient toward +x (arriving humans)
    docile:1.0,           // 0 wild .. 1 tame/drugged (drives head-drop + tongue)
    wagRate:5.0,          // tail wag speed
    maneMass:1.0,         // lion mane fullness
    tailBush:1.0,         // wolf tail bushiness
  },
  // back -> front draw order each beast honors
  layers:["shadow","mane","tail","far-legs","body","neck","head","ears","muzzle","tongue","near-legs","eye"],
  // normalized 0..1 attachment / attention anchors
  anchors:{
    "wolf:paws":{x:.30,y:.84}, "wolf:head":{x:.44,y:.60}, "wolf:muzzle":{x:.52,y:.62},
    "lion:paws":{x:.70,y:.84}, "lion:head":{x:.82,y:.58}, "lion:muzzle":{x:.90,y:.60},
    "arrivals:humans":{x:.98,y:.72}, "camera:pair":{x:.50,y:.60},
  },
  // collision / footprints for placement + pathing
  zones:{
    "wolf:collision":{ x0:.14,y0:.56,x1:.56,y1:.90 },
    "lion:collision":{ x0:.52,y0:.52,x1:.94,y1:.90 },
    walkable:{ x0:.06,y0:.72,x1:.96,y1:.94 },
  },
  states:{
    initial:"fawn",
    nodes:{
      fawn:{     preview:{ pose:"fawn", t:0 } },      // heads low, tails wagging (neutral)
      approach:{ preview:{ pose:"approach", t:0.4 } },// trotting toward the humans (animate t)
      sit:{      preview:{ pose:"sit", t:0 } },       // both seated, begging
      rise:{     preview:{ pose:"rise", t:0.3 } },    // wolf comes up, lion still fawning
    },
    edges:[
      ["fawn","approach"],["approach","fawn"],["fawn","sit"],
      ["sit","fawn"],["fawn","rise"],["rise","approach"],
    ],
  },
  channels:["pose","gaze","wag","gait","docile","ear"],

  preview:()=>({ pose:"fawn", t:0, status:"FAWNING", progress:.24 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
