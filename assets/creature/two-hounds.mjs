/* creature.two-hounds — paired canine companions of Telemachus.
   CREATURE asset. Two quadruped hounds (NOT humanoid): fully custom
   geometry built from engine primitives — articulated legs (upper/lower
   segments + paws), neck + gaze head, pricked ears + muzzle/jaw, and a
   curling tail. States idle / sit / alert / pace; the preview shows the
   pair in a guarding composition (one seated, one standing alert), both
   orienting toward an off-frame threat. Drawn in SOLID grays + hard
   contour; the engine POST pass supplies the dot-matrix halftone.
   Atlas: OD-B02-S01 — paired canine companions pacing, sitting, orienting. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- tone levels (flat grays; POST turns them into dots) ---- */
const T_BODY = ()=> toneSolid(inkLevel(4));
const T_HEAD = ()=> toneSolid(inkLevel(4));
const T_NEARLEG = ()=> toneSolid(inkLevel(5));
const T_FARLEG  = ()=> toneSolid(inkLevel(6));
const T_EAR  = ()=> toneSolid(inkLevel(6));
const T_MUZZLE = ()=> toneSolid(inkLevel(5));
const T_TAIL = ()=> toneSolid(inkLevel(4));

const P = (x,y)=>({x,y});

/* ---------- shared head (skull, muzzle/jaw, pricked ears, gaze eye) ---------- */
function drawHead(pen, HC, rx, ry, dir, U, { earUp=1, gazeDown=0, mouth=0 }={}){
  const g = pen.ctx;
  // ---- ears (behind skull) : pointed, pricked toward threat ----
  const earLift = lerp(ry*0.5, ry*1.7, earUp);
  const ear = (bx, tipDX)=>{
    pen.paint(()=>{
      g.moveTo(HC.x - dir*rx*0.15 + bx, HC.y - ry*0.55);
      g.lineTo(HC.x + dir*rx*0.45 + bx, HC.y - ry*0.35);
      g.lineTo(HC.x + dir*(rx*0.05+tipDX) + bx, HC.y - ry*0.35 - earLift);
      g.closePath();
    }, T_EAR(), 4);
  };
  ear(-dir*rx*0.10, -rx*0.05);          // far ear (slightly back)
  // ---- neck-side skull ----
  // ---- muzzle + lower jaw (front of head) ----
  const mTip = P(HC.x + dir*(rx*0.55+U*0.30), HC.y + ry*0.30);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.20, HC.y - ry*0.30);       // top of nose bridge
    g.quadraticCurveTo(HC.x + dir*(rx*0.7+U*0.18), HC.y - ry*0.10, mTip.x, mTip.y); // muzzle top -> tip
    g.lineTo(mTip.x - dir*U*0.02, mTip.y + ry*0.42);    // nose -> lip
    g.quadraticCurveTo(HC.x + dir*rx*0.55, HC.y + ry*0.75, HC.x + dir*rx*0.05, HC.y + ry*0.82); // jaw
    g.closePath();
  }, T_MUZZLE(), 4);
  // ---- skull ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, 7); }, T_HEAD(), 4);
  // near ear (over skull)
  ear(dir*rx*0.10, rx*0.02);
  // ---- brow / stop crease ----
  pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.15, HC.y - ry*0.15); g.lineTo(HC.x + dir*rx*0.45, HC.y); }, 2.5);
  // ---- eye (gaze) ----
  const eye = P(HC.x + dir*rx*0.40, HC.y - ry*0.10 + gazeDown*ry*0.35);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, rx*0.14, rx*0.11, 0, 0, 7); g.fill();
  // ---- nose ----
  g.beginPath(); g.ellipse(mTip.x + dir*rx*0.02, mTip.y + ry*0.02, rx*0.16, rx*0.13, 0, 0, 7); g.fill();
  // ---- mouth line ----
  pen.ink(()=>{
    g.moveTo(mTip.x - dir*U*0.02, mTip.y + ry*0.30);
    g.lineTo(HC.x + dir*rx*0.30, HC.y + ry*0.55 + mouth*ry*0.2);
  }, 2.5);
}

/* ---------- one leg: two segments + paw ---------- */
function drawLeg(pen, hip, knee, paw, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(paw.x,paw.y); }, tone, w*0.82);
  pen.paint(()=>{ g.ellipse(paw.x, paw.y - w*0.15, w*0.85, w*0.5, 0, 0, 7); }, tone, 3.5);
}

/* ---------- STANDING hound (idle / alert / pace) ---------- */
function drawStanding(pen, cx, groundY, S, dir, pose, t){
  const g = pen.ctx;
  const U = S*0.255;
  const bodyH = S*(pose==="pace" ? 0.150 : 0.160);
  const shoulderX = cx + dir*U*0.34;
  const hipX      = cx - dir*U*0.34;
  const alert = pose==="alert" ? 1 : 0;
  const back = bodyH*(1.0 + alert*0.03);

  // key torso points
  const W  = P(shoulderX,             groundY - back);
  const C  = P(hipX,                  groundY - back*0.95);
  const CF = P(shoulderX + dir*U*0.22, groundY - back*0.58);
  const CB = P(shoulderX + dir*U*0.10, groundY - back*0.30);
  const BR = P(hipX + dir*U*0.10,      groundY - back*0.30);
  const R  = P(hipX - dir*U*0.16,      groundY - back*0.64);

  // pace swing offsets
  const ph = t*4;
  const sw = pose==="pace" ? Math.sin(ph)*U*0.14 : 0;
  const lift = pose==="pace" ? Math.max(0,Math.sin(ph))*S*0.035 : 0;
  const sw2 = pose==="pace" ? Math.sin(ph+Math.PI)*U*0.14 : 0;
  const lift2 = pose==="pace" ? Math.max(0,Math.sin(ph+Math.PI))*S*0.035 : 0;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+4, U*0.7, U*0.14, 0, 0, 7); g.fill(); g.restore();

  // ---- tail (behind body) ----
  const tailBase = P(hipX - dir*U*0.12, groundY - back*0.82);
  const tailTip = alert
    ? P(hipX - dir*U*0.34, groundY - back*1.18)
    : P(hipX - dir*U*0.36, groundY - back*0.55);
  const tailCtl = alert
    ? P(hipX - dir*U*0.34, groundY - back*0.98)
    : P(hipX - dir*U*0.40, groundY - back*0.80);
  pen.limb(()=>{ g.moveTo(tailBase.x,tailBase.y); g.quadraticCurveTo(tailCtl.x,tailCtl.y,tailTip.x,tailTip.y); }, T_TAIL(), U*0.11);

  // ---- FAR legs (drawn first, darker) ----
  const off = dir*U*0.07;
  drawLeg(pen, P(shoulderX-off, groundY-back*0.82), P(shoulderX-off+dir*U*0.03, groundY-back*0.42),
          P(shoulderX-off+dir*U*0.05 - sw2, groundY - lift2), U*0.11, T_FARLEG());
  drawLeg(pen, P(hipX-off, groundY-back*0.80), P(hipX-off+dir*U*0.09, groundY-back*0.44),
          P(hipX-off+dir*U*0.02 - sw, groundY - lift), U*0.11, T_FARLEG());

  // ---- torso ----
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.14, W.y - bodyH*0.10, W.x, W.y);      // chest -> withers
    g.quadraticCurveTo(cx, W.y - bodyH*0.04, C.x, C.y);                          // back
    g.quadraticCurveTo(hipX - dir*U*0.14, C.y + bodyH*0.02, R.x, R.y);           // croup -> rear thigh
    g.quadraticCurveTo(hipX - dir*U*0.06, BR.y, BR.x, BR.y);                     // rear -> belly rear
    g.quadraticCurveTo(cx, BR.y + bodyH*0.06, CB.x, CB.y);                       // belly
    g.quadraticCurveTo(shoulderX + dir*U*0.20, CB.y - bodyH*0.04, CF.x, CF.y);   // chest bottom -> front
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- neck (fill wedge from withers/chest up to head) ----
  const HC = P(shoulderX + dir*U*0.36, groundY - back*(1.30 + alert*0.20));
  const rx = U*0.22, ry = U*0.18;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.02, groundY - back*0.96);                       // nape at withers
    g.quadraticCurveTo(HC.x - dir*rx*0.7, HC.y - ry*0.3, HC.x - dir*rx*0.2, HC.y - ry*0.2);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.5);                                  // throat top at head
    g.quadraticCurveTo(shoulderX + dir*U*0.28, groundY - back*0.66, CF.x, CF.y); // throat -> chest
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- head ----
  drawHead(pen, HC, rx, ry, dir, U, { earUp: pose==="pace"?0.55:(alert?1:0.75), gazeDown: pose==="pace"?0.25:0 });

  // ---- NEAR legs (over body) ----
  drawLeg(pen, P(shoulderX, groundY-back*0.82), P(shoulderX+dir*U*0.03, groundY-back*0.42),
          P(shoulderX+dir*U*0.05 + sw, groundY - lift), U*0.12, T_NEARLEG());
  drawLeg(pen, P(hipX, groundY-back*0.80), P(hipX+dir*U*0.09, groundY-back*0.44),
          P(hipX+dir*U*0.02 + sw2, groundY - lift2), U*0.12, T_NEARLEG());
}

/* ---------- SITTING hound (haunches down, forelegs straight, head up) ---------- */
function drawSit(pen, cx, groundY, S, dir, t){
  const g = pen.ctx;
  const U = S*0.255;
  const bodyH = S*0.185;
  const shoulderX = cx + dir*U*0.26;
  const hipX      = cx - dir*U*0.30;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx - dir*U*0.10, groundY+4, U*0.66, U*0.15, 0, 0, 7); g.fill(); g.restore();

  // ---- curled tail on the ground (behind haunch) ----
  const tb = P(hipX - dir*U*0.16, groundY - bodyH*0.30);
  pen.limb(()=>{ g.moveTo(tb.x,tb.y);
    g.quadraticCurveTo(hipX - dir*U*0.42, groundY - bodyH*0.05, hipX - dir*U*0.20, groundY - bodyH*0.02); },
    T_TAIL(), U*0.10);

  // ---- FAR forelimb (straight, darker) ----
  drawLeg(pen, P(shoulderX - dir*U*0.06, groundY-bodyH*0.86), P(shoulderX - dir*U*0.06, groundY-bodyH*0.44),
          P(shoulderX - dir*U*0.04, groundY), U*0.11, T_FARLEG());

  // ---- haunch (big rounded thigh on the ground) ----
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.02, groundY - bodyH*0.34, U*0.30, bodyH*0.40, 0, 0, 7); }, T_BODY(), 4.5);
  // ---- folded rear paw pointing forward ----
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.26, groundY - bodyH*0.03, U*0.16, U*0.07, 0, 0, 7); }, T_NEARLEG(), 3.5);

  // ---- torso: high shoulders sloping down to seated rear ----
  const W  = P(shoulderX, groundY - bodyH*1.02);
  const CF = P(shoulderX + dir*U*0.22, groundY - bodyH*0.56);
  const CB = P(shoulderX + dir*U*0.06, groundY - bodyH*0.20);
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.12, W.y - bodyH*0.06, W.x, W.y);        // chest -> withers
    g.quadraticCurveTo(cx - dir*U*0.02, groundY - bodyH*0.88, hipX + dir*U*0.02, groundY - bodyH*0.62); // back down to haunch
    g.quadraticCurveTo(hipX + dir*U*0.24, groundY - bodyH*0.42, hipX + dir*U*0.30, groundY - bodyH*0.28); // over haunch front
    g.quadraticCurveTo(cx + dir*U*0.06, groundY - bodyH*0.12, CB.x, CB.y);          // belly to chest bottom
    g.quadraticCurveTo(shoulderX + dir*U*0.18, CB.y - bodyH*0.04, CF.x, CF.y);
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- neck up to raised head ----
  const HC = P(shoulderX + dir*U*0.40, groundY - bodyH*1.42);
  const rx = U*0.21, ry = U*0.18;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.04, groundY - bodyH*0.98);
    g.quadraticCurveTo(HC.x - dir*rx*0.8, HC.y - ry*0.2, HC.x - dir*rx*0.2, HC.y - ry*0.2);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.5);
    g.quadraticCurveTo(shoulderX + dir*U*0.30, groundY - bodyH*0.64, CF.x, CF.y);
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- head (ears up, watchful) ----
  drawHead(pen, HC, rx, ry, dir, U, { earUp: 0.9, gazeDown: 0 });

  // ---- NEAR forelimb (straight, weight-bearing) ----
  drawLeg(pen, P(shoulderX + dir*U*0.02, groundY-bodyH*0.86), P(shoulderX + dir*U*0.02, groundY-bodyH*0.44),
          P(shoulderX + dir*U*0.04, groundY), U*0.12, T_NEARLEG());
}

/* ---------- one hound dispatch ---------- */
function drawHound(pen, cx, groundY, S, dir, pose, t){
  if (pose==="sit") drawSit(pen, cx, groundY, S, dir, t);
  else drawStanding(pen, cx, groundY, S, dir, pose, t);
}

/* poses per scene state: [leftHound, rightHound] */
function posePair(pose){
  switch(pose){
    case "idle":  return ["idle","idle"];
    case "sit":   return ["sit","sit"];
    case "alert": return ["alert","alert"];
    case "pace":  return ["pace","pace"];
    default:      return ["sit","alert"];   // "guard" — the neutral pair composition
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 1.12;
  const groundY = H*0.655;
  const t = state.t || 0;
  const [pL, pR] = posePair(state.pose || "guard");
  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.04, groundY+2); ctx.lineTo(W*0.96, groundY+2); ctx.stroke(); ctx.restore();
  // left hound, right hound — both orient right toward off-frame threat
  const tPace = pR==="pace" ? t+0.5 : t;   // desync pacing legs
  drawHound(pen, W*0.275, groundY, S, +1, pL, t);
  drawHound(pen, W*0.62, groundY, S, +1, pR, tPace);
}

export const asset = {
  id:"creature.two-hounds",
  type:"CREATURE",
  name:"Two hounds",
  statusWord:"WATCHFUL",
  scene:"OD-B02-S01",

  // procedural knobs
  params:{
    count:2,
    stance:"guard",       // guard (sit+alert) | idle | sit | alert | pace
    faceDir:+1,           // both orient toward +x (off-frame threat)
    breedMass:1.0,        // body mass multiplier
    earPrick:1.0,         // 0..1 ear alertness
  },
  // back -> front draw order each hound honors
  layers:["shadow","tail","far-legs","body","neck","head","ears","muzzle","near-legs","eye"],
  // normalized 0..1 attachment / attention anchors (pair of dogs)
  anchors:{
    "left:paws":{x:.31,y:.82}, "left:head":{x:.42,y:.55}, "left:gaze":{x:.50,y:.52},
    "right:paws":{x:.70,y:.82}, "right:head":{x:.83,y:.53}, "right:gaze":{x:.94,y:.50},
    "threat":{x:.98,y:.50}, "handler:telemachus":{x:.06,y:.80},
    "camera:pair":{x:.50,y:.55},
  },
  // canine footprints for placement / pathing / collision
  zones:{
    "left:collision":{ x0:.16,y0:.60,x1:.52,y1:.90 },
    "right:collision":{ x0:.54,y0:.58,x1:.90,y1:.90 },
    walkable:{ x0:.06,y0:.70,x1:.96,y1:.94 },
  },
  states:{
    initial:"guard",
    nodes:{
      guard:{ preview:{ pose:"guard" } },   // one seated, one standing alert
      idle:{  preview:{ pose:"idle"  } },   // both relaxed, standing
      sit:{   preview:{ pose:"sit"   } },   // both seated
      alert:{ preview:{ pose:"alert" } },   // both up, ears pricked toward threat
      pace:{  preview:{ pose:"pace", t:0.4 } }, // both walking (animate t)
    },
    edges:[
      ["guard","alert"],["guard","idle"],["idle","sit"],["idle","pace"],
      ["sit","alert"],["alert","pace"],["pace","alert"],["alert","idle"],
    ],
  },
  channels:["pose","gaze","attention","gait","tail","ear"],

  preview:()=>({ pose:"guard", t:0, status:"WATCHFUL", progress:.22 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
