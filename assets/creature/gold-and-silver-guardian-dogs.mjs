/* creature.gold-and-silver-guardian-dogs — immortal metal watchdogs of the
   threshold (the deathless hounds Hephaestus wrought to guard Alcinous' door).
   CREATURE asset: a matched PAIR of quadruped metal hounds flanking a central
   doorway, built from fully custom engine-primitive geometry (NOT the figure
   rig). One BRIGHT (silver / light tone), one DARK-MID (gold), each in a rigid
   heraldic guard stance — columnar legs, erect neck, pricked ears, gaze fixed
   on the threshold. Metallic SHEEN is faked with a lighter specular band + a
   crescent highlight over the flank (all flat grays; the engine POST pass
   supplies the dot-matrix halftone — do NOT pre-dither).
   States watch / orient / allow / bar. Collision zones per hound.
   Atlas: OD-B07-S02 — immortal metal hounds with watch, orient, allow, bar. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});

/* ---- two metal palettes (flat ink levels; POST -> dots). silver reads bright
   (few dots), gold reads mid (more dots). sheen = specular highlight level. ---- */
const SILVER = { body:3, near:4, far:5, neck:3, ear:5, muzzle:4, sheen:1, spec:1 };
const GOLD   = { body:5, near:6, far:6, neck:5, ear:6, muzzle:6, sheen:3, spec:2 };

/* ---------- metal hound head: skull, muzzle/jaw, pricked ears, fixed eye ---------- */
function drawHead(pen, HC, rx, ry, dir, U, metal, { earUp=1, gazeDown=0, mouth=0 }={}){
  const g = pen.ctx;
  const T_EAR = toneSolid(inkLevel(metal.ear));
  const T_MUZ = toneSolid(inkLevel(metal.muzzle));
  const T_HEAD = toneSolid(inkLevel(metal.body));

  // ---- ears: sharp metal blades, pricked toward the threshold ----
  const earLift = lerp(ry*0.35, ry*1.85, clamp(earUp,0,1));   // earUp<0 => laid back
  const earBack = earUp < 0 ? ry*0.9 : 0;                      // bar: ears flattened back
  const ear = (bx, tipDX)=>{
    pen.paint(()=>{
      g.moveTo(HC.x - dir*rx*0.15 + bx, HC.y - ry*0.55);
      g.lineTo(HC.x + dir*rx*0.45 + bx, HC.y - ry*0.30);
      g.lineTo(HC.x + dir*(rx*0.02+tipDX) + bx - dir*earBack, HC.y - ry*0.30 - earLift + earBack*0.5);
      g.closePath();
    }, T_EAR, 4);
  };
  ear(-dir*rx*0.12, -rx*0.04);                 // far ear
  // ---- muzzle + lower jaw (front of head) ----
  const mTip = P(HC.x + dir*(rx*0.58+U*0.30), HC.y + ry*0.22);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.18, HC.y - ry*0.34);
    g.quadraticCurveTo(HC.x + dir*(rx*0.72+U*0.16), HC.y - ry*0.12, mTip.x, mTip.y);
    g.lineTo(mTip.x - dir*U*0.02, mTip.y + ry*0.40 + mouth*ry*0.55);   // jaw drops open when barring
    g.quadraticCurveTo(HC.x + dir*rx*0.55, HC.y + ry*0.78, HC.x + dir*rx*0.02, HC.y + ry*0.84);
    g.closePath();
  }, T_MUZ, 4);
  // ---- skull (angular metal head) ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, 7); }, T_HEAD, 4);
  // near ear (over skull)
  ear(dir*rx*0.10, rx*0.02);
  // ---- forged crest ridge down the skull (metal seam) ----
  pen.ink(()=>{ g.moveTo(HC.x - dir*rx*0.55, HC.y - ry*0.30); g.lineTo(HC.x + dir*rx*0.35, HC.y - ry*0.05); }, 2.2);
  // ---- brow / stop crease ----
  pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.14, HC.y - ry*0.14); g.lineTo(HC.x + dir*rx*0.46, HC.y + ry*0.02); }, 2.2);
  // ---- eye (fixed metal gaze) ----
  const eye = P(HC.x + dir*rx*0.42, HC.y - ry*0.08 + gazeDown*ry*0.30);
  g.fillStyle = INK; g.beginPath(); g.ellipse(eye.x, eye.y, rx*0.15, rx*0.12, 0, 0, 7); g.fill();
  // tiny inset specular dot (near-paper) to catch the metal glint
  g.fillStyle = inkLevel(metal.spec); g.beginPath(); g.arc(eye.x - dir*rx*0.05, eye.y - rx*0.04, rx*0.04, 0, 7); g.fill();
  // ---- nose ----
  g.fillStyle = INK; g.beginPath(); g.ellipse(mTip.x + dir*rx*0.02, mTip.y + ry*0.02, rx*0.16, rx*0.13, 0, 0, 7); g.fill();
  // ---- mouth line / bared teeth when barring ----
  pen.ink(()=>{
    g.moveTo(mTip.x - dir*U*0.02, mTip.y + ry*0.28);
    g.lineTo(HC.x + dir*rx*0.30, HC.y + ry*0.52 + mouth*ry*0.30);
  }, 2.2);
  if (mouth > 0.4){ // fangs
    g.fillStyle = inkLevel(1);
    for (let i=0;i<3;i++){
      const fx = mTip.x - dir*(U*0.02 + i*rx*0.16);
      g.beginPath(); g.moveTo(fx, mTip.y + ry*0.24);
      g.lineTo(fx - dir*rx*0.05, mTip.y + ry*0.24);
      g.lineTo(fx - dir*rx*0.025, mTip.y + ry*0.24 + rx*0.16*mouth); g.closePath(); g.fill();
    }
  }
}

/* ---------- one columnar (heraldic-rigid) leg ---------- */
function drawLeg(pen, hip, knee, paw, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(paw.x,paw.y); }, tone, w*0.86);
  // blocky metal paw
  pen.paint(()=>{ g.ellipse(paw.x, paw.y - w*0.10, w*0.9, w*0.5, 0, 0, 7); }, tone, 3.5);
}

/* ---------- metal SHEEN: a lighter specular band + crescent over the flank ---------- */
function drawSheen(pen, W, C, R, metal, U){
  const g = pen.ctx;
  const light = inkLevel(metal.sheen);
  // long specular band riding the top of the back/withers
  pen.fillPath(()=>{
    g.moveTo(W.x, W.y + U*0.03);
    g.quadraticCurveTo((W.x+C.x)/2, W.y - U*0.05, C.x, C.y + U*0.04);
    g.quadraticCurveTo((W.x+C.x)/2, W.y + U*0.10, W.x, W.y + U*0.03);
    g.closePath();
  }, light);
  // crescent glint on the shoulder mass
  pen.fillPath(()=>{ g.ellipse(W.x + (R.x-W.x)*0.28, W.y + U*0.22, U*0.10, U*0.16, 0, 0, 7); }, light);
}

/* ---------- one guardian hound (rigid heraldic) ---------- */
function drawHound(pen, cx, groundY, S, dir, metal, cfg, t){
  const g = pen.ctx;
  const U = S*0.25;
  const T_BODY = toneSolid(inkLevel(metal.body));
  const T_NEAR = toneSolid(inkLevel(metal.near));
  const T_FAR  = toneSolid(inkLevel(metal.far));
  const T_NECK = toneSolid(inkLevel(metal.neck));
  const T_TAIL = toneSolid(inkLevel(metal.body));

  const seated = !!cfg.seated;
  const lean = (cfg.lean||0);                 // forward lean into the gap (bar)
  const bodyH = S*(seated ? 0.185 : 0.150);
  const shoulderX = cx + dir*(U*0.34 + lean*U);
  const hipX      = cx - dir*U*0.34;
  const back = groundY - bodyH;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx + dir*lean*U*0.5, groundY+4, U*0.72, U*0.14, 0, 0, 7); g.fill(); g.restore();

  if (seated){ drawSeated(pen, cx, groundY, S, dir, metal, cfg, t); return; }

  // key torso points (rigid barrel, level back)
  const W  = P(shoulderX,              back);                    // withers
  const C  = P(hipX,                   back + bodyH*0.03);       // croup
  const CF = P(shoulderX + dir*U*0.20, back + bodyH*0.62);       // chest front
  const CB = P(shoulderX + dir*U*0.06, back + bodyH*1.10);       // belly front
  const BR = P(hipX + dir*U*0.06,      back + bodyH*1.05);       // belly rear
  const R  = P(hipX - dir*U*0.18,      back + bodyH*0.46);       // rear thigh

  // ---- upright plumed tail (rigid, heraldic) ----
  const tailBase = P(hipX - dir*U*0.14, back + bodyH*0.20);
  const tailTip  = P(hipX - dir*U*0.30, back - bodyH*1.05);
  const tailCtl  = P(hipX - dir*U*0.42, back - bodyH*0.35);
  pen.limb(()=>{ g.moveTo(tailBase.x,tailBase.y); g.quadraticCurveTo(tailCtl.x,tailCtl.y,tailTip.x,tailTip.y); }, T_TAIL, U*0.11);
  pen.paint(()=>{ g.ellipse(tailTip.x, tailTip.y, U*0.09, U*0.14, 0, 0, 7); }, T_TAIL, 3.5); // plume tip

  // ---- FAR legs (columnar, straight down; drawn first, darker) ----
  const off = dir*U*0.06;
  drawLeg(pen, P(shoulderX-off, back+bodyH*0.30), P(shoulderX-off, back+bodyH*0.66),
          P(shoulderX-off, groundY), U*0.11, T_FAR);
  drawLeg(pen, P(hipX-off, back+bodyH*0.40), P(hipX-off, back+bodyH*0.70),
          P(hipX-off, groundY), U*0.11, T_FAR);

  // ---- torso ----
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.12, W.y - bodyH*0.06, W.x, W.y);
    g.quadraticCurveTo(cx, W.y - bodyH*0.02, C.x, C.y);
    g.quadraticCurveTo(hipX - dir*U*0.12, C.y + bodyH*0.06, R.x, R.y);
    g.quadraticCurveTo(hipX - dir*U*0.02, BR.y, BR.x, BR.y);
    g.quadraticCurveTo(cx, BR.y + bodyH*0.04, CB.x, CB.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.18, CB.y - bodyH*0.02, CF.x, CF.y);
    g.closePath();
  }, T_BODY, 4.5);

  // ---- erect neck up to a high head ----
  const headLift = cfg.headLift ?? 1.0;
  const HC = P(shoulderX + dir*(U*0.20 + lean*U*0.4), back - bodyH*(1.05*headLift));
  const rx = U*0.22, ry = U*0.18;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.02, W.y + bodyH*0.02);                 // nape at withers
    g.quadraticCurveTo(HC.x - dir*rx*0.7, HC.y - ry*0.2, HC.x - dir*rx*0.2, HC.y - ry*0.2);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.5);                         // throat top
    g.quadraticCurveTo(shoulderX + dir*U*0.26, back - bodyH*0.10, CF.x, CF.y); // throat -> chest
    g.closePath();
  }, T_NECK, 4.5);

  // ---- metal sheen over back + shoulder ----
  drawSheen(pen, W, C, R, metal, U);

  // ---- head ----
  drawHead(pen, HC, rx, ry, dir, U, metal, { earUp: cfg.earUp, gazeDown: cfg.gazeDown||0, mouth: cfg.mouth||0 });

  // ---- NEAR legs (over body, columnar) ----
  drawLeg(pen, P(shoulderX, back+bodyH*0.30), P(shoulderX, back+bodyH*0.66),
          P(shoulderX, groundY), U*0.12, T_NEAR);
  drawLeg(pen, P(hipX, back+bodyH*0.40), P(hipX, back+bodyH*0.70),
          P(hipX, groundY), U*0.12, T_NEAR);
}

/* ---------- seated guardian (haunches down — the ALLOW / stood-aside pose) ---------- */
function drawSeated(pen, cx, groundY, S, dir, metal, cfg, t){
  const g = pen.ctx;
  const U = S*0.25;
  const bodyH = S*0.185;
  const T_BODY = toneSolid(inkLevel(metal.body));
  const T_NEAR = toneSolid(inkLevel(metal.near));
  const T_FAR  = toneSolid(inkLevel(metal.far));
  const T_NECK = toneSolid(inkLevel(metal.neck));
  const shoulderX = cx + dir*U*0.24;
  const hipX      = cx - dir*U*0.30;

  // curled metal tail on the ground behind the haunch
  const tb = P(hipX - dir*U*0.16, groundY - bodyH*0.30);
  pen.limb(()=>{ g.moveTo(tb.x,tb.y);
    g.quadraticCurveTo(hipX - dir*U*0.44, groundY - bodyH*0.02, hipX - dir*U*0.18, groundY - bodyH*0.01); },
    T_BODY, U*0.10);

  // far foreleg (straight, weight-bearing)
  drawLeg(pen, P(shoulderX - dir*U*0.06, groundY-bodyH*0.86), P(shoulderX - dir*U*0.06, groundY-bodyH*0.44),
          P(shoulderX - dir*U*0.04, groundY), U*0.11, T_FAR);

  // haunch
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.02, groundY - bodyH*0.34, U*0.30, bodyH*0.42, 0, 0, 7); }, T_BODY, 4.5);
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.26, groundY - bodyH*0.03, U*0.16, U*0.07, 0, 0, 7); }, T_NEAR, 3.5); // rear paw

  // torso rising from seated rear to high shoulders
  const W  = P(shoulderX, groundY - bodyH*1.04);
  const CF = P(shoulderX + dir*U*0.22, groundY - bodyH*0.56);
  const CB = P(shoulderX + dir*U*0.06, groundY - bodyH*0.20);
  const C  = P(hipX + dir*U*0.02, groundY - bodyH*0.62);
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.12, W.y - bodyH*0.06, W.x, W.y);
    g.quadraticCurveTo(cx - dir*U*0.02, groundY - bodyH*0.90, C.x, C.y);
    g.quadraticCurveTo(hipX + dir*U*0.24, groundY - bodyH*0.42, hipX + dir*U*0.30, groundY - bodyH*0.28);
    g.quadraticCurveTo(cx + dir*U*0.06, groundY - bodyH*0.12, CB.x, CB.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.18, CB.y - bodyH*0.04, CF.x, CF.y);
    g.closePath();
  }, T_BODY, 4.5);

  // neck up to head (turned a touch aside — passage granted)
  const HC = P(shoulderX + dir*U*0.42, groundY - bodyH*1.42);
  const rx = U*0.21, ry = U*0.18;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.04, groundY - bodyH*1.00);
    g.quadraticCurveTo(HC.x - dir*rx*0.8, HC.y - ry*0.2, HC.x - dir*rx*0.2, HC.y - ry*0.2);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.5);
    g.quadraticCurveTo(shoulderX + dir*U*0.30, groundY - bodyH*0.64, CF.x, CF.y);
    g.closePath();
  }, T_NECK, 4.5);

  drawSheen(pen, W, C, P(hipX,groundY-bodyH*0.5), metal, U);
  drawHead(pen, HC, rx, ry, dir, U, metal, { earUp: cfg.earUp, gazeDown: cfg.gazeDown||0, mouth:0 });

  // near foreleg
  drawLeg(pen, P(shoulderX + dir*U*0.02, groundY-bodyH*0.86), P(shoulderX + dir*U*0.02, groundY-bodyH*0.44),
          P(shoulderX + dir*U*0.04, groundY), U*0.12, T_NEAR);
}

/* ---------- central DOORWAY the pair flanks (background threshold) ---------- */
function drawDoorway(pen, W, H, groundY, state){
  const g = pen.ctx;
  const cx = W*0.5, dw = W*0.135, top = H*0.335;
  const jw = W*0.022;
  // jambs + arch frame (mid tone stone, framing the guardians)
  pen.paint(()=>{ g.rect(cx-dw/2 - jw, top, jw, groundY-top); }, toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.rect(cx+dw/2, top, jw, groundY-top); }, toneSolid(inkLevel(4)), 4);
  // opening: light interior when watching/allowing, darker when barred
  const barred = state.pose === "bar";
  const openLvl = state.pose === "allow" ? 2 : (barred ? 5 : 3);
  pen.paint(()=>{
    g.moveTo(cx-dw/2, groundY);
    g.lineTo(cx-dw/2, top+dw*0.5);
    g.quadraticCurveTo(cx, top-dw*0.18, cx+dw/2, top+dw*0.5);
    g.lineTo(cx+dw/2, groundY);
    g.closePath();
  }, toneSolid(inkLevel(openLvl)), 4);
  // faint light spill on the sill when passage is allowed
  if (state.pose === "allow"){
    g.fillStyle = inkLevel(1);
    g.beginPath(); g.ellipse(cx, groundY, dw*0.7, H*0.018, 0, 0, 7); g.fill();
  }
  // arch voussoir band + keystone
  pen.ink(()=>{ g.moveTo(cx-dw/2-jw*0.4, top+dw*0.5); g.quadraticCurveTo(cx, top-dw*0.4, cx+dw/2+jw*0.4, top+dw*0.5); }, 3.5);
  pen.paint(()=>{ g.rect(cx-W*0.018, top-dw*0.42, W*0.036, dw*0.28); }, toneSolid(inkLevel(5)), 3);
}

/* ---------- pose config per state ---------- */
function cfgFor(pose){
  switch(pose){
    case "orient": return { earUp:1.0,  headLift:1.06, gazeDown:0.0,  mouth:0,   lean:0.05, seated:false };
    case "allow":  return { earUp:0.35, headLift:1.0,  gazeDown:0.10, mouth:0,   lean:0,    seated:true  };
    case "bar":    return { earUp:-1,   headLift:0.60, gazeDown:0.28, mouth:1,   lean:0.16, seated:false };
    case "watch":
    default:       return { earUp:0.85, headLift:1.0,  gazeDown:0.0,  mouth:0,   lean:0,    seated:false };
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 1.02;
  const groundY = H*0.66;
  const t = state.t || 0;
  const cfg = cfgFor(state.pose || "watch");

  // faint shared threshold ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  // doorway between the guardians
  drawDoorway(pen, W, H, groundY, state);

  // SILVER hound at left, facing inward (+x) ; GOLD hound at right, facing inward (-x)
  drawHound(pen, W*0.205, groundY, S, +1, SILVER, cfg, t);
  drawHound(pen, W*0.795, groundY, S, -1, GOLD,   cfg, t);
}

export const asset = {
  id:"creature.gold-and-silver-guardian-dogs",
  type:"CREATURE",
  name:"Gold-and-silver guardian dogs",
  statusWord:"DEATHLESS",
  scene:"OD-B07-S02",

  // procedural knobs
  params:{
    count:2,
    left:"silver",         // bright metal (light tone)
    right:"gold",          // dark-mid metal
    stance:"heraldic",     // rigid columnar guard stance
    faceInward:true,       // both orient toward the central doorway
    sheen:1.0,             // 0..1 specular strength
  },
  // back -> front draw order each hound honors
  layers:["shadow","doorway","tail","far-legs","body","neck","sheen","head","ears","muzzle","near-legs","eye"],
  // normalized 0..1 attachment / attention anchors (pair + threshold)
  anchors:{
    "silver:paws":{x:.235,y:.84}, "silver:head":{x:.33,y:.42}, "silver:gaze":{x:.46,y:.44},
    "gold:paws":{x:.765,y:.84},   "gold:head":{x:.67,y:.42},   "gold:gaze":{x:.54,y:.44},
    "doorway:center":{x:.50,y:.55}, "doorway:sill":{x:.50,y:.66}, "doorway:arch":{x:.50,y:.24},
    "intruder":{x:.50,y:.90}, "camera:pair":{x:.50,y:.52},
  },
  // metal footprints for placement / pathing / collision
  zones:{
    "silver:collision":{ x0:.10,y0:.60,x1:.42,y1:.90 },
    "gold:collision":{ x0:.58,y0:.60,x1:.90,y1:.90 },
    "threshold":{ x0:.40,y0:.24,x1:.60,y1:.66 },
    walkable:{ x0:.03,y0:.70,x1:.97,y1:.96 },
  },
  states:{
    initial:"watch",
    nodes:{
      watch:{  preview:{ pose:"watch"  } },   // rigid, ears up, gaze on threshold
      orient:{ preview:{ pose:"orient" } },   // heads snap toward an approacher, leaning in
      allow:{  preview:{ pose:"allow"  } },   // seated aside, ears eased — passage granted
      bar:{    preview:{ pose:"bar"    } },    // heads lowered, jaws open, braced across the gap
    },
    edges:[
      ["watch","orient"],["orient","allow"],["orient","bar"],
      ["allow","watch"],["bar","watch"],["bar","orient"],["allow","orient"],
    ],
  },
  channels:["pose","gaze","attention","ear","jaw","sheen"],

  preview:()=>({ pose:"watch", t:0, status:"DEATHLESS", progress:.24 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
