/* creature.guard-dogs — the savage farm dogs of Eumaeus's steading.
   CREATURE asset. A PACK of four quadruped dogs (NOT humanoid) drawn from
   ONE dog template in aggressive + cowed poses: fully custom geometry built
   from engine primitives — articulated upper/lower leg segments + paws, a
   gaze head with pricked-or-flattened ears, an articulated muzzle/jaw that
   opens to BARE TEETH, raised neck/back HACKLES for the aggressive states,
   and a tail that lifts (dominant), streams (charging) or TUCKS (cowed).
   States: detect / charge (lunging, bared teeth) / surround / stone-scatter
   (recoiling, tails tucked) / recall / settle. Drawn in SOLID grays + hard
   contour; the engine POST pass supplies the dot-matrix halftone.
   Atlas: OD-B14-S01 — four aggressive dogs detect, charge, surround,
   scatter at a thrown stone, are recalled, and settle. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- flat tone levels (POST turns them into dots) ---- */
const T_BODY    = ()=> toneSolid(inkLevel(4));
const T_HEAD    = ()=> toneSolid(inkLevel(4));
const T_NEARLEG = ()=> toneSolid(inkLevel(5));
const T_FARLEG  = ()=> toneSolid(inkLevel(6));
const T_EAR     = ()=> toneSolid(inkLevel(6));
const T_MUZZLE  = ()=> toneSolid(inkLevel(5));
const T_TAIL    = ()=> toneSolid(inkLevel(4));
const T_HACKLE  = ()=> toneSolid(inkLevel(6));
const T_MOUTH   = ()=> toneSolid(inkLevel(7));   // dark open maw
const T_TOOTH   = ()=> toneSolid(inkLevel(1));   // near-paper fangs

const P = (x,y)=>({x,y});

/* ---------- per-pose configuration for the shared dog template ----------
   Absolute fractions of S (dog scale). One template, six behaviours. */
const POSE = {
  //          wither croup  headFwd headY  tail     ear   jaw teeth hackle lunge gait crouch
  alert:  { wither:0.160, croup:0.150, headFwd:0.30, headY:0.258, tail:"up",     ear:1.00, jaw:0.12, teeth:0, hackle:0.55, lunge:0, gait:0, crouch:0 },
  charge: { wither:0.110, croup:0.152, headFwd:0.46, headY:0.150, tail:"stream", ear:0.18, jaw:1.00, teeth:1, hackle:1.00, lunge:1, gait:1, crouch:0 },
  cower:  { wither:0.092, croup:0.104, headFwd:0.18, headY:0.082, tail:"tuck",   ear:0.00, jaw:0.00, teeth:0, hackle:0.00, lunge:0, gait:0, crouch:1 },
  trot:   { wither:0.150, croup:0.150, headFwd:0.36, headY:0.210, tail:"level",  ear:0.55, jaw:0.00, teeth:0, hackle:0.20, lunge:0, gait:1, crouch:0 },
};

/* ---------- one leg: two segments + paw ---------- */
function drawLeg(pen, hip, knee, paw, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(paw.x,paw.y); }, tone, w*0.82);
  pen.paint(()=>{ g.ellipse(paw.x, paw.y - w*0.15, w*0.85, w*0.5, 0, 0, 7); }, tone, 3.5);
}

/* ---------- dog head: skull, ears, articulated jaw, bared teeth ---------- */
function drawDogHead(pen, HC, rx, ry, dir, U, cfg){
  const g = pen.ctx;
  const earUp = cfg.ear, jaw = cfg.jaw, teeth = cfg.teeth, gazeDown = cfg.crouch?0.4:(cfg.lunge?0.15:0);

  // ---- ears: earUp=1 pricked forward/up, earUp=0 flattened back (cowed/aggressive-pinned) ----
  const ear = (bx, tone)=>{
    const tipUp   = P(HC.x + dir*(rx*0.02) + bx, HC.y - ry*0.35 - lerp(ry*0.4, ry*1.7, earUp));
    const tipBack = P(HC.x - dir*(rx*0.75) + bx, HC.y - ry*0.05);   // pinned straight back
    const tip = P(lerp(tipBack.x, tipUp.x, earUp), lerp(tipBack.y, tipUp.y, earUp));
    pen.paint(()=>{
      g.moveTo(HC.x - dir*rx*0.12 + bx, HC.y - ry*0.52);
      g.lineTo(HC.x + dir*rx*0.42 + bx, HC.y - ry*0.32);
      g.lineTo(tip.x, tip.y);
      g.closePath();
    }, tone, 4);
  };
  ear(-dir*rx*0.14, T_EAR());                           // far ear

  // ---- muzzle: upper jaw wedge (fixed) ----
  const noseTip = P(HC.x + dir*(rx*0.58 + U*0.30), HC.y + ry*0.24);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.18, HC.y - ry*0.32);
    g.quadraticCurveTo(HC.x + dir*(rx*0.72 + U*0.16), HC.y - ry*0.12, noseTip.x, noseTip.y);
    g.lineTo(noseTip.x - dir*U*0.02, noseTip.y + ry*0.20);              // to upper lip line
    g.quadraticCurveTo(HC.x + dir*rx*0.50, HC.y + ry*0.30, HC.x + dir*rx*0.10, HC.y + ry*0.22);
    g.closePath();
  }, T_MUZZLE(), 4);

  // ---- open maw + lower jaw (drops by jaw) : the aggressive bared-teeth tell ----
  const drop = jaw*ry*0.85;
  const commis = P(HC.x + dir*rx*0.14, HC.y + ry*0.24);                 // corner of mouth
  const chin   = P(noseTip.x - dir*U*0.04, noseTip.y + ry*0.20 + drop); // chin tip, dropped
  if (jaw > 0.02){
    // dark mouth interior
    pen.paint(()=>{
      g.moveTo(commis.x, commis.y);
      g.lineTo(noseTip.x - dir*U*0.02, noseTip.y + ry*0.20);
      g.lineTo(chin.x, chin.y);
      g.quadraticCurveTo(HC.x + dir*rx*0.40, chin.y + ry*0.10, commis.x, commis.y);
      g.closePath();
    }, T_MOUTH(), 3.5);
  }
  // lower jaw solid (under the maw)
  pen.paint(()=>{
    g.moveTo(commis.x, commis.y + ry*0.02);
    g.lineTo(chin.x, chin.y);
    g.quadraticCurveTo(chin.x - dir*U*0.10, chin.y + ry*0.22, HC.x + dir*rx*0.18, HC.y + ry*0.42 + drop*0.6);
    g.quadraticCurveTo(HC.x + dir*rx*0.10, HC.y + ry*0.30, commis.x, commis.y + ry*0.02);
    g.closePath();
  }, T_MUZZLE(), 4);

  // ---- skull ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, 7); }, T_HEAD(), 4);
  ear(dir*rx*0.06, T_EAR());                             // near ear (over skull)

  // ---- wrinkled snarl creases (aggression) ----
  if (teeth){
    pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.34, HC.y - ry*0.06); g.lineTo(HC.x + dir*rx*0.52, HC.y - ry*0.20); }, 2.2);
    pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.42, HC.y - ry*0.02); g.lineTo(HC.x + dir*rx*0.58, HC.y - ry*0.14); }, 2.2);
  }
  // ---- brow / stop crease ----
  pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.14, HC.y - ry*0.14); g.lineTo(HC.x + dir*rx*0.44, HC.y - ry*0.02); }, 2.4);

  // ---- eye (gaze) — hard glare when aggressive ----
  const eye = P(HC.x + dir*rx*0.40, HC.y - ry*0.08 + gazeDown*ry*0.35);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, rx*0.14, rx*0.11, 0, 0, 7); g.fill();

  // ---- nose ----
  g.fillStyle = INK; g.beginPath(); g.ellipse(noseTip.x + dir*rx*0.02, noseTip.y, rx*0.16, rx*0.13, 0, 0, 7); g.fill();

  // ---- BARED TEETH: light fang triangles across the open maw ----
  if (teeth && jaw > 0.2){
    g.fillStyle = inkLevel(1);
    const topY = noseTip.y + ry*0.20;                    // upper lip line
    const botY = chin.y;                                 // lower jaw line
    // upper canine + incisors (point DOWN)
    for (let i=0;i<3;i++){
      const fx = noseTip.x - dir*(U*0.05 + i*U*0.085);
      const fw = (i===0?rx*0.16:rx*0.10);
      g.beginPath();
      g.moveTo(fx - fw, topY); g.lineTo(fx + fw, topY);
      g.lineTo(fx, topY + (i===0?ry*0.42:ry*0.26)); g.closePath(); g.fill();
      g.strokeStyle=INK; g.lineWidth=1.6; g.stroke();
    }
    // lower canine + incisors (point UP)
    for (let i=0;i<2;i++){
      const fx = noseTip.x - dir*(U*0.09 + i*U*0.095);
      const fw = (i===0?rx*0.13:rx*0.09);
      g.beginPath();
      g.moveTo(fx - fw, botY); g.lineTo(fx + fw, botY);
      g.lineTo(fx, botY - (i===0?ry*0.34:ry*0.22)); g.closePath();
      g.fillStyle=inkLevel(1); g.fill(); g.strokeStyle=INK; g.lineWidth=1.6; g.stroke();
    }
  } else {
    // closed mouth line
    pen.ink(()=>{
      g.moveTo(noseTip.x - dir*U*0.02, noseTip.y + ry*0.16);
      g.lineTo(HC.x + dir*rx*0.24, HC.y + ry*0.30);
    }, 2.4);
  }
}

/* ---------- STANDING / LUNGING dog (alert / charge / cower / trot) ---------- */
function drawStandDog(pen, cx, gy, S, dir, pose, t){
  const g = pen.ctx;
  const cfg = POSE[pose] || POSE.alert;
  const U = S*0.24;
  const shoulderX = cx + dir*U*0.34;
  const hipX      = cx - dir*U*0.34;
  const withersY = gy - S*cfg.wither;
  const croupY   = gy - S*cfg.croup;

  // gait / lunge paw offsets
  const ph = t*4.6;
  const gA = cfg.gait ? Math.sin(ph)      : 0;
  const gB = cfg.gait ? Math.sin(ph+Math.PI) : 0;
  const swF  = cfg.lunge ? dir*U*0.42 : (cfg.gait ? dir*U*0.16*gA : 0);
  const swR  = cfg.lunge ? -dir*U*0.40 : (cfg.gait ? dir*U*0.16*gB : 0);
  const liftF = cfg.gait ? Math.max(0,gA)*S*0.03 : 0;
  const liftR = cfg.gait ? Math.max(0,gB)*S*0.03 : 0;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, gy+4, U*0.78, U*0.14, 0, 0, 7); g.fill(); g.restore();

  // key torso points
  const W  = P(shoulderX,              withersY);                    // withers
  const C  = P(hipX,                   croupY);                      // croup
  const CF = P(shoulderX + dir*U*0.20, gy - S*(cfg.wither*0.42));    // chest bottom (front)
  const CB = P(shoulderX + dir*U*0.06, gy - S*(cfg.wither*0.20));    // belly front
  const BR = P(hipX + dir*U*0.10,      gy - S*(cfg.croup*0.22));     // belly rear
  const R  = P(hipX - dir*U*0.16,      gy - S*(cfg.croup*0.62));     // rear thigh

  // ---- TAIL (behind body) ----
  const tb = P(hipX - dir*U*0.10, croupY + S*0.006);
  if (cfg.tail==="up"){
    // dominant raised sabre — a C-curl up and forward over the croup
    pen.limb(()=>{ g.moveTo(tb.x,tb.y);
      g.quadraticCurveTo(hipX - dir*U*0.30, croupY - S*0.115, hipX - dir*U*0.04, croupY - S*0.135); }, T_TAIL(), U*0.085);
  } else if (cfg.tail==="stream"){
    const wag = Math.sin(t*7)*U*0.03;
    pen.limb(()=>{ g.moveTo(tb.x,tb.y);
      g.quadraticCurveTo(hipX - dir*U*0.30, croupY - S*0.01, hipX - dir*U*0.50, croupY - S*0.045 + wag); }, T_TAIL(), U*0.08);
  } else if (cfg.tail==="level"){
    pen.limb(()=>{ g.moveTo(tb.x,tb.y);
      g.quadraticCurveTo(hipX - dir*U*0.28, croupY + S*0.02, hipX - dir*U*0.44, croupY + S*0.03); }, T_TAIL(), U*0.08);
  } else { // tuck — curled down & forward BETWEEN the legs (cowed)
    pen.limb(()=>{ g.moveTo(tb.x,tb.y);
      g.quadraticCurveTo(hipX - dir*U*0.14, gy - S*0.004, hipX + dir*U*0.08, gy - S*0.03); }, T_TAIL(), U*0.075);
  }

  // ---- FAR legs (darker, first) ----
  const off = dir*U*0.07;
  const fLegLen = cfg.crouch ? 0.5 : 0.82;               // crouched legs fold under
  drawLeg(pen, P(shoulderX-off, withersY + S*0.006), P(shoulderX-off+dir*U*(cfg.crouch?0.12:0.03), lerp(withersY,gy,0.55)),
          P(shoulderX-off+swF*0.9, gy - liftF), U*0.11, T_FARLEG());
  drawLeg(pen, P(hipX-off, croupY + S*0.006), P(hipX-off+dir*U*(cfg.crouch?-0.10:0.09), lerp(croupY,gy,0.52)),
          P(hipX-off+swR*0.9, gy - liftR), U*0.11, T_FARLEG());

  // ---- torso ----
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.14, W.y - S*0.012, W.x, W.y);       // chest -> withers
    g.quadraticCurveTo(cx, Math.min(W.y,C.y) - S*0.006, C.x, C.y);             // back
    g.quadraticCurveTo(hipX - dir*U*0.14, C.y + S*0.004, R.x, R.y);            // croup -> rear thigh
    g.quadraticCurveTo(hipX - dir*U*0.06, BR.y, BR.x, BR.y);                   // rear -> belly rear
    g.quadraticCurveTo(cx, BR.y + S*0.008, CB.x, CB.y);                        // belly
    g.quadraticCurveTo(shoulderX + dir*U*0.20, CB.y - S*0.006, CF.x, CF.y);    // chest bottom
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- raised HACKLES along the topline (aggression) ----
  if (cfg.hackle > 0.05){
    g.strokeStyle = INK; g.lineWidth = 2.4; g.lineJoin="round";
    g.beginPath();
    const n = 9;
    for (let i=0;i<=n;i++){
      const s = i/n;
      const bx = lerp(W.x, C.x, s);
      const by = lerp(W.y, C.y, s) - (i%2?S*0.028*cfg.hackle:0);
      if (i===0) g.moveTo(bx, by); else g.lineTo(bx, by);
    }
    g.stroke();
  }

  // ---- neck (fill wedge withers -> head) ----
  const HC = P(shoulderX + dir*S*cfg.headFwd, gy - S*cfg.headY);
  const rx = U*0.27, ry = U*0.215;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.02, withersY + S*0.006);
    g.quadraticCurveTo(HC.x - dir*rx*0.7, HC.y - ry*0.4, HC.x - dir*rx*0.2, HC.y - ry*0.2);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.55);
    g.quadraticCurveTo(shoulderX + dir*U*0.26, CF.y - S*0.01, CF.x, CF.y);
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- head ----
  drawDogHead(pen, HC, rx, ry, dir, U, cfg);

  // ---- NEAR legs (over body) ----
  drawLeg(pen, P(shoulderX, withersY + S*0.006), P(shoulderX+dir*U*(cfg.crouch?0.14:0.03), lerp(withersY,gy,0.55)),
          P(shoulderX+swF, gy - liftR), U*0.12, T_NEARLEG());
  drawLeg(pen, P(hipX, croupY + S*0.006), P(hipX+dir*U*(cfg.crouch?-0.12:0.09), lerp(croupY,gy,0.52)),
          P(hipX+swR, gy - liftF), U*0.12, T_NEARLEG());
}

/* ---------- SETTLED dog (lying down, calm) ---------- */
function drawSettleDog(pen, cx, gy, S, dir, t){
  const g = pen.ctx;
  const U = S*0.24;
  const bodyY = gy - S*0.055;                            // low lying body
  const shoulderX = cx + dir*U*0.36;
  const hipX      = cx - dir*U*0.40;
  const breath = Math.sin(t*1.4)*S*0.004;

  // shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, gy+3, U*0.9, U*0.14, 0, 0, 7); g.fill(); g.restore();

  // tail resting on the ground behind
  pen.limb(()=>{ g.moveTo(hipX - dir*U*0.10, gy - S*0.02);
    g.quadraticCurveTo(hipX - dir*U*0.44, gy - S*0.01, hipX - dir*U*0.30, gy - S*0.05); }, T_TAIL(), U*0.09);

  // folded rear haunch
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.04, gy - S*0.055, U*0.34, S*0.058, 0, 0, 7); }, T_BODY(), 4.5);

  // lying torso (long low loaf)
  pen.paint(()=>{
    g.moveTo(shoulderX + dir*U*0.30, gy - S*0.03);
    g.quadraticCurveTo(shoulderX + dir*U*0.16, bodyY - S*0.070 + breath, shoulderX - dir*U*0.02, bodyY - S*0.066 + breath); // chest/withers
    g.quadraticCurveTo(cx, bodyY - S*0.078 + breath, hipX + dir*U*0.10, bodyY - S*0.050);        // back
    g.quadraticCurveTo(hipX - dir*U*0.30, gy - S*0.02, hipX - dir*U*0.10, gy - S*0.006);          // rump to ground
    g.lineTo(shoulderX, gy - S*0.006);                                                            // belly on ground
    g.closePath();
  }, T_BODY(), 4.5);

  // outstretched forepaws on the ground
  drawLeg(pen, P(shoulderX, gy - S*0.05), P(shoulderX + dir*U*0.18, gy - S*0.02), P(shoulderX + dir*U*0.42, gy - S*0.004), U*0.10, T_FARLEG());
  drawLeg(pen, P(shoulderX + dir*U*0.02, gy - S*0.05), P(shoulderX + dir*U*0.20, gy - S*0.02), P(shoulderX + dir*U*0.46, gy - S*0.004), U*0.11, T_NEARLEG());

  // neck + raised-but-calm head resting forward
  const HC = P(shoulderX + dir*U*0.60, gy - S*0.10 + breath);
  const rx = U*0.24, ry = U*0.19;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.02, bodyY - S*0.060 + breath);
    g.quadraticCurveTo(HC.x - dir*rx*0.8, HC.y - ry*0.3, HC.x - dir*rx*0.2, HC.y - ry*0.2);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.55);
    g.quadraticCurveTo(shoulderX + dir*U*0.34, gy - S*0.05, shoulderX + dir*U*0.30, gy - S*0.03);
    g.closePath();
  }, T_BODY(), 4.5);
  drawDogHead(pen, HC, rx, ry, dir, U, { ear:0.7, jaw:0.0, teeth:0, crouch:0, lunge:0 });
}

/* ---------- dispatch ---------- */
function drawDog(pen, cx, gy, S, dir, pose, t){
  if (pose==="settle") drawSettleDog(pen, cx, gy, S, dir, t);
  else drawStandDog(pen, cx, gy, S, dir, pose, t);
}

/* ---------- pack formations per scene state ----------
   returns [{x, gy, sc, dir, pose}, ...] for the four dogs. x/gy normalized. */
function formation(state, W, H){
  const t = state.t || 0;
  // depth-staggered rows: far dogs smaller+higher, near dogs larger+lower
  switch(state.pose){
    case "detect": // four alert, all orienting toward the intruder off-frame right
      return [
        { x:0.16, gy:0.54, sc:0.66, dir:+1, pose:"alert" },
        { x:0.39, gy:0.72, sc:0.98, dir:+1, pose:"alert" },
        { x:0.61, gy:0.56, sc:0.70, dir:+1, pose:"alert" },
        { x:0.84, gy:0.74, sc:1.02, dir:+1, pose:"alert" },
      ];
    case "charge": // the whole pack lunging right, jaws open, hackles up
      return [
        { x:0.15, gy:0.55, sc:0.68, dir:+1, pose:"charge" },
        { x:0.38, gy:0.73, sc:1.00, dir:+1, pose:"charge" },
        { x:0.60, gy:0.57, sc:0.72, dir:+1, pose:"charge" },
        { x:0.83, gy:0.75, sc:1.04, dir:+1, pose:"charge" },
      ];
    case "surround": // ring: two face right (left flank), two face left (right flank)
      return [
        { x:0.16, gy:0.55, sc:0.66, dir:+1, pose:"alert" },
        { x:0.36, gy:0.74, sc:0.98, dir:+1, pose:"charge" },
        { x:0.64, gy:0.74, sc:0.98, dir:-1, pose:"charge" },
        { x:0.84, gy:0.55, sc:0.66, dir:-1, pose:"alert" },
      ];
    case "scatter": // stone thrown from center — recoil OUTWARD, cowed, tails tucked
      return [
        { x:0.13, gy:0.58, sc:0.72, dir:-1, pose:"cower" },
        { x:0.35, gy:0.74, sc:0.98, dir:-1, pose:"cower" },
        { x:0.65, gy:0.74, sc:0.98, dir:+1, pose:"cower" },
        { x:0.87, gy:0.58, sc:0.72, dir:+1, pose:"cower" },
      ];
    case "recall": // called off — trotting away to the left
      return [
        { x:0.20, gy:0.54, sc:0.66, dir:-1, pose:"trot" },
        { x:0.42, gy:0.72, sc:0.98, dir:-1, pose:"trot" },
        { x:0.62, gy:0.56, sc:0.70, dir:-1, pose:"trot" },
        { x:0.83, gy:0.74, sc:1.00, dir:-1, pose:"trot" },
      ];
    case "settle": // lying calm around the yard
      return [
        { x:0.18, gy:0.56, sc:0.70, dir:+1, pose:"settle" },
        { x:0.42, gy:0.74, sc:0.98, dir:-1, pose:"settle" },
        { x:0.64, gy:0.58, sc:0.74, dir:+1, pose:"settle" },
        { x:0.85, gy:0.75, sc:1.00, dir:-1, pose:"settle" },
      ];
    default: // "pack" — the neutral menacing composition (detect-into-surround)
      return [
        { x:0.16, gy:0.55, sc:0.66, dir:+1, pose:"alert" },
        { x:0.39, gy:0.73, sc:0.98, dir:+1, pose:"charge" },
        { x:0.62, gy:0.57, sc:0.72, dir:+1, pose:"alert" },
        { x:0.85, gy:0.75, sc:1.02, dir:+1, pose:"charge" },
      ];
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const t = state.t || 0;
  const base = Math.min(W, H) * 0.52;

  // faint shared ground band
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, H*0.70); ctx.lineTo(W*0.97, H*0.70); ctx.stroke(); ctx.restore();

  const pack = formation(state, W, H);
  // draw far (smaller/higher) dogs first for depth overlap
  const order = pack.map((d,i)=>({d,i})).sort((a,b)=> a.d.sc - b.d.sc);
  order.forEach(({d,i})=>{
    drawDog(pen, W*d.x, H*d.gy, base*d.sc, d.dir, d.pose, t + i*0.37);
  });
}

export const asset = {
  id:"creature.guard-dogs",
  type:"CREATURE",
  name:"Guard dogs",
  statusWord:"SAVAGE",
  scene:"OD-B14-S01",

  // procedural knobs — one dog TEMPLATE, drawn four times in formation
  params:{
    count:4,
    breedMass:1.0,        // body mass multiplier
    aggression:1.0,       // drives bared teeth + hackle raise in the aggressive states
    packSpread:1.0,       // formation width
    faceDir:+1,           // default orientation toward the off-frame intruder
  },
  // back -> front draw order each dog honors
  layers:["shadow","tail","far-legs","body","hackles","neck","head","ears","muzzle","jaw","teeth","near-legs","eye"],
  // normalized 0..1 attention / attachment anchors (neutral "pack" composition)
  anchors:{
    "dog1:head":{x:.28,y:.44}, "dog2:head":{x:.52,y:.55}, "dog3:head":{x:.73,y:.49},
    "dog4:head":{x:.95,y:.57}, "dog1:paws":{x:.18,y:.60}, "dog2:paws":{x:.40,y:.70},
    "dog3:paws":{x:.63,y:.64}, "dog4:paws":{x:.84,y:.72},
    "intruder":{x:.99,y:.55}, "stone:impact":{x:.50,y:.66},
    "handler:eumaeus":{x:.02,y:.80}, "camera:pack":{x:.50,y:.56},
  },
  // canine footprints for placement / pathing / collision
  zones:{
    "dog1:collision":{ x0:.08,y0:.52,x1:.34,y1:.80 },
    "dog2:collision":{ x0:.28,y0:.60,x1:.56,y1:.84 },
    "dog3:collision":{ x0:.52,y0:.54,x1:.78,y1:.80 },
    "dog4:collision":{ x0:.72,y0:.62,x1:.98,y1:.86 },
    walkable:{ x0:.04,y0:.56,x1:.98,y1:.94 },
  },
  states:{
    initial:"detect",
    nodes:{
      detect:{   preview:{ pose:"detect" } },     // four up, ears pricked toward intruder
      charge:{   preview:{ pose:"charge", t:0.3 } }, // pack lunging, bared teeth (animate t)
      surround:{ preview:{ pose:"surround" } },   // ring closed around the intruder
      scatter:{  preview:{ pose:"scatter" } },    // stone thrown — recoiling, cowed, tails tucked
      recall:{   preview:{ pose:"recall", t:0.4 } }, // called off, trotting away (animate t)
      settle:{   preview:{ pose:"settle" } },     // lying calm around the yard
    },
    edges:[
      ["detect","charge"],["charge","surround"],["surround","scatter"],
      ["scatter","recall"],["recall","settle"],["settle","detect"],
      ["detect","surround"],["surround","charge"],
    ],
  },
  channels:["pose","gaze","attention","gait","tail","ear","jaw"],

  preview:()=>({ pose:"detect", t:0, status:"SAVAGE", progress:.22 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
