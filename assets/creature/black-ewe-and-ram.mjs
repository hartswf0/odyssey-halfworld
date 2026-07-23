/* creature.black-ewe-and-ram — the sacrificial pair at the pit's edge:
   a solid-BLACK EWE (hornless) + a solid-BLACK horned RAM, the pair Odysseus
   cuts over the trench to summon the dead.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. Each sheep is built the same way — a heavy near-black scalloped
   FLEECE (dark wool blob + deeper underside), four short dark cloven legs
   (upper/lower segments + a split hoof block), a dark wedge HEAD with eye,
   ear, nostril; the RAM adds a pair of pale BONE curl-HORNS (the read that
   separates ram from ewe), the EWE is hornless and a touch smaller/slimmer.
   The ritual furniture — a low offering STONE and a blood TRENCH/bowl — is
   procedural too. States (channels drive them):
     · handling   — both stood, heads up, a handler's hand steadying the ram
     · cut        — ram's head hauled up & back, throat bared, the sacrificial
                    KNIFE laid to the throat (ewe waits alongside)
     · blood-flow — ram head-down over the trench, a dark stream running from
                    the throat into the pooling bowl (scales with `blood`)
     · fallen     — the ram down on its side, legs folded, life gone; ewe bows
     · offering    — both laid out on the offering stone, the completed rite
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B11-S01 — sacrificial pair with handling / cut / blood-flow /
   fallen / offering states, articulated legs/head/horns, near-black fleece. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- tone levels (flat grays; POST turns them into dots).
   The fleece is "black" but reads as a DEEP mid-gray so internal contour and
   the dot texture survive (a true black blob loses all form). The pale bone
   horns (level 2) pop hard against the dark ram; the blood runs full ink. ---- */
const T_FLEECE   = ()=> toneSolid(inkLevel(5));   // near-black wool
const T_FLEECE_D = ()=> toneSolid(inkLevel(6));   // shaded underside / creases
const T_FLEECE_H = ()=> toneSolid(inkLevel(4));   // a lifted lobe (form on the back)
const T_FACE     = ()=> toneSolid(inkLevel(6));   // dark wedge face
const T_MUZZLE   = ()=> toneSolid(inkLevel(5));   // slightly lifted muzzle plane
const T_EAR      = ()=> toneSolid(inkLevel(5));
const T_LEGN     = ()=> toneSolid(inkLevel(6));   // near legs (bold)
const T_LEGF     = ()=> toneSolid(inkLevel(5));   // far legs (dimmer)
const T_HOOF     = ()=> toneSolid(inkLevel(7));   // hard split hoof
const T_HORN     = ()=> toneSolid(inkLevel(2));   // pale bone curl-horn (near)
const T_HORNF    = ()=> toneSolid(inkLevel(3));   // far curl-horn (behind)
const T_TAIL     = ()=> toneSolid(inkLevel(5));
const T_BLOOD    = ()=> toneSolid(inkLevel(7));   // the blood stream + pool
const T_BLADE    = ()=> toneSolid(inkLevel(2));   // pale knife blade
const T_HILT     = ()=> toneSolid(inkLevel(7));   // dark hilt
const T_HAND     = ()=> toneSolid(inkLevel(4));   // handler's steadying hand
const T_STONE    = ()=> toneSolid(inkLevel(3));   // offering stone
const T_STONETOP = ()=> toneSolid(inkLevel(4));
const T_BOWL     = ()=> toneSolid(inkLevel(4));   // trench / catch-bowl rim

/* a scalloped WOOL blob: a closed bumpy outline around an ellipse — the read
   that makes the body woolly. bumps = fleece lobes; depth pushes each out. */
function woolBlob(g, cx, cy, rx, ry, bumps, depth=0.24, seed=0){
  const pts=[];
  for(let i=0;i<bumps;i++){
    const a=(i/bumps)*TAU;
    const j = 1 + (((i*7+seed*13)%5)-2)*0.035;    // deterministic per-lobe jitter
    pts.push({x:cx+Math.cos(a)*rx*j, y:cy+Math.sin(a)*ry*j});
  }
  g.moveTo(pts[0].x, pts[0].y);
  for(let i=0;i<bumps;i++){
    const q=pts[(i+1)%bumps];
    const a2 = (i+0.5)/bumps*TAU;
    const b = Math.min(rx,ry)*depth;
    g.quadraticCurveTo(cx+Math.cos(a2)*(rx+b), cy+Math.sin(a2)*(ry+b), q.x, q.y);
  }
  g.closePath();
}

/* a few fleece creases so the dark wool reads as wool, not a slab */
function fleeceCreases(pen, cx, cy, rx, ry, dir){
  pen.seam(()=>{ pen.ctx.moveTo(cx-rx*0.55, cy-ry*0.10);
    pen.ctx.quadraticCurveTo(cx, cy-ry*0.02, cx+rx*0.55, cy-ry*0.12); }, 2);
  pen.seam(()=>{ pen.ctx.moveTo(cx-rx*0.42, cy+ry*0.28);
    pen.ctx.quadraticCurveTo(cx, cy+ry*0.34, cx+rx*0.42, cy+ry*0.26); }, 2);
  pen.seam(()=>{ pen.ctx.moveTo(cx-dir*rx*0.10, cy-ry*0.55);
    pen.ctx.lineTo(cx-dir*rx*0.02, cy+ry*0.20); }, 2);
}

/* a RAM curl-horn: a bold forward-coiling spiral tapering from the poll.
   `off` nudges the pair apart; tone/wScale distinguish near vs far horn. */
function drawRamHorn(pen, HC, hr, dir, off, tone, wScale){
  const g = pen.ctx;
  const cxh = HC.x - dir*hr*0.20 + off, cyh = HC.y - hr*0.14;
  const spiral = (wfrac, seg0, seg1)=>{
    pen.limb(()=>{
      let first=true;
      for(let i=seg0;i<=seg1;i++){
        const f=i/30;
        const a = -Math.PI*0.08 + f*TAU*1.28;            // ~1.3 coils, curling forward
        const r = hr*1.22*(1-f*0.60);
        const x = cxh + dir*Math.cos(a)*r;
        const y = cyh + Math.sin(a)*r;
        if(first){ g.moveTo(x,y); first=false; } else g.lineTo(x,y);
      }
    }, tone, hr*wfrac*wScale);
  };
  spiral(0.60, 0, 15);     // thick base coil
  spiral(0.40, 15, 30);    // tapered tip coil
  // growth ridges across the coil
  pen.ink(()=>{
    for(let i=1;i<=5;i++){
      const f=i/6, a=-Math.PI*0.08+f*TAU*1.28, r=hr*1.22*(1-f*0.60);
      const x=cxh+dir*Math.cos(a)*r, y=cyh+Math.sin(a)*r;
      const nx=Math.cos(a+Math.PI/2), ny=Math.sin(a+Math.PI/2), tk=hr*0.26*(1-f*0.5);
      g.moveTo(x-nx*tk, y-ny*tk); g.lineTo(x+nx*tk, y+ny*tk);
    }
  }, 2);
}

/* the sheep HEAD: dark wedge skull, floppy ear, eye + nostril; ram gets the
   pair of pale bone curl-horns, the ewe is hornless (a plain poll). */
function drawSheepHead(pen, HC, hr, dir, { horned=false, gaze=0, tilt=0 }={}){
  const g = pen.ctx;
  // tilt rotates the muzzle up (throat-baring): + tilt lifts the nose
  const up = tilt;

  // ---- FAR horn first (behind the skull) ----
  if (horned) drawRamHorn(pen, HC, hr, dir, -dir*hr*0.18, T_HORNF(), 1.0);

  // ---- far ear stub behind the face ----
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.28, HC.y-hr*0.16);
    g.quadraticCurveTo(HC.x-dir*hr*1.00, HC.y-hr*0.02, HC.x-dir*hr*0.95, HC.y+hr*0.40);
    g.quadraticCurveTo(HC.x-dir*hr*0.48, HC.y+hr*0.16, HC.x-dir*hr*0.26, HC.y+hr*0.06);
    g.closePath();
  }, T_EAR(), 3);

  // ---- dark wedge FACE (poll -> Roman nose -> jaw) ----
  const noseLift = up*hr*0.55;
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.40, HC.y-hr*0.70);                       // poll (top back)
    g.quadraticCurveTo(HC.x+dir*hr*0.52, HC.y-hr*0.64,              // brow
                       HC.x+dir*hr*0.98, HC.y-hr*0.16-noseLift);    // nose bridge
    g.quadraticCurveTo(HC.x+dir*hr*1.48, HC.y+hr*0.12-noseLift,     // Roman-nose muzzle
                       HC.x+dir*hr*1.38, HC.y+hr*0.50-noseLift);    // nose tip
    g.quadraticCurveTo(HC.x+dir*hr*1.18, HC.y+hr*0.76-noseLift*0.5, // lower lip
                       HC.x+dir*hr*0.78, HC.y+hr*0.78);             // chin
    g.quadraticCurveTo(HC.x+dir*hr*0.05, HC.y+hr*0.90,              // jaw
                       HC.x-dir*hr*0.28, HC.y+hr*0.42);             // throat
    g.closePath();
  }, T_FACE(), 4);
  // muzzle plane (a shade lighter so the head has form)
  pen.paint(()=>{ g.ellipse(HC.x+dir*hr*1.06, HC.y+hr*0.24-noseLift, hr*0.34, hr*0.24, 0.2*dir,0,TAU); }, T_MUZZLE(), 0);

  // ---- NEAR horn (over the skull, bolder) ----
  if (horned) drawRamHorn(pen, HC, hr, dir, dir*hr*0.02, T_HORN(), 1.15);

  // ---- near floppy ear hanging forward in front of the poll ----
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.02, HC.y-hr*0.18);
    g.quadraticCurveTo(HC.x+dir*hr*0.66, HC.y+hr*0.04, HC.x+dir*hr*0.58, HC.y+hr*0.50);
    g.quadraticCurveTo(HC.x+dir*hr*0.28, HC.y+hr*0.22, HC.x+dir*hr*0.05, HC.y+hr*0.04);
    g.closePath();
  }, T_EAR(), 3);

  // ---- eye (bright ring + dark pupil on the dark face) + nostril + mouth ----
  const ex = HC.x+dir*hr*0.44, ey = HC.y-hr*0.06 + gaze*hr*0.2;
  g.fillStyle="#efefe8"; g.beginPath(); g.ellipse(ex, ey, hr*0.13, hr*0.15, 0,0,TAU); g.fill();
  g.fillStyle=INK; g.beginPath(); g.ellipse(ex+dir*hr*0.02, ey, hr*0.065, hr*0.085, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(HC.x+dir*hr*1.30, HC.y+hr*0.34-noseLift, hr*0.08, hr*0.06, 0.3*dir, 0,TAU); g.fill();
  pen.ink(()=>{ g.moveTo(HC.x+dir*hr*1.34, HC.y+hr*0.50-noseLift);
                g.lineTo(HC.x+dir*hr*0.98, HC.y+hr*0.60); }, 2.2);

  // throat contact point (for knife + blood)
  return { throat:P(HC.x+dir*hr*0.10, HC.y+hr*0.52) };
}

/* ONE short cloven leg: two segments (hip->knee->foot) + a split hoof block.
   fold 0 = planted straight; fold 1 = knee buckled under (a fallen limb). */
function drawLeg(pen, hip, foot, w, tone, dir, bend, fold=0){
  const g = pen.ctx;
  const kx = lerp(hip.x, foot.x, 0.5) + dir*bend + fold*dir*w*0.9;
  const ky = lerp(hip.y, foot.y, 0.52) - fold*w*0.4;
  const knee = P(kx, ky);
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.82);
  pen.paint(()=>{ g.rect(foot.x - w*0.58, foot.y - w*0.10, w*0.50, w*0.50); }, T_HOOF(), 2.4);
  pen.paint(()=>{ g.rect(foot.x + w*0.08, foot.y - w*0.10, w*0.50, w*0.50); }, T_HOOF(), 2.4);
}

/* the whole STANDING sheep, profile facing +dir, feet on groundY, unit U.
   opts: horned, scale, headDrop 0..1 (nose to ground), headBack 0..1 (head
   hauled up & back, throat bared for the cut), stride, t. returns { throat }. */
function drawStandingSheep(pen, cx, groundY, U, dir, opts={}){
  const g = pen.ctx;
  const horned  = !!opts.horned;
  const s       = opts.scale ?? 1;
  const headDrop= clamp01(opts.headDrop ?? 0);
  const headBack= clamp01(opts.headBack ?? 0);
  const stride  = opts.stride || 0;
  const t       = opts.t || 0;

  const bodyRx=U*1.05*s, bodyRy=U*0.72*s;
  const legLen=U*0.60*s;
  const bob = Math.sin(t*2+cx*0.01)*U*0.010;
  const cy = groundY - legLen - bodyRy*0.50 + bob;

  // ---- ground shadow ----
  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+5, bodyRx*0.96, U*0.14, 0,0,TAU); g.fill(); g.restore();

  const legTopY = cy+bodyRy*0.28;
  const foreX = cx+dir*bodyRx*0.52, hindX = cx-dir*bodyRx*0.56;
  const sw = stride*U*0.24;

  // ---- FAR legs (behind, dimmer, inset) ----
  drawLeg(pen, P(foreX-dir*U*0.12, legTopY), P(foreX-dir*U*0.12+sw*0.7, groundY), U*0.145*s, T_LEGF(), dir, U*0.05);
  drawLeg(pen, P(hindX-dir*U*0.12, legTopY), P(hindX-dir*U*0.12-sw*0.7, groundY), U*0.145*s, T_LEGF(), dir, -U*0.05);

  // ---- woolly BODY (big scalloped near-black fleece) ----
  pen.paint(()=>{ woolBlob(g, cx, cy, bodyRx, bodyRy, 16, 0.22, Math.round(cx)); }, T_FLEECE(), 5);
  // lifted top-back lobe (form) + shaded underside
  pen.paint(()=>{ g.ellipse(cx-dir*bodyRx*0.10, cy-bodyRy*0.34, bodyRx*0.62, bodyRy*0.34, 0,0,TAU); }, T_FLEECE_H(), 0);
  pen.paint(()=>{ g.ellipse(cx, cy+bodyRy*0.48, bodyRx*0.76, bodyRy*0.32, 0,0,TAU); }, T_FLEECE_D(), 0);
  fleeceCreases(pen, cx, cy, bodyRx, bodyRy, dir);

  // ---- short woolly TAIL at the rear (-dir) ----
  pen.paint(()=>{
    const tb=P(cx-dir*bodyRx*0.92, cy+bodyRy*0.06);
    g.moveTo(tb.x, tb.y-U*0.12);
    g.quadraticCurveTo(tb.x-dir*U*0.22, cy+bodyRy*0.52, tb.x-dir*U*0.04, cy+bodyRy*0.64);
    g.quadraticCurveTo(tb.x+dir*U*0.08, cy+bodyRy*0.28, tb.x, tb.y-U*0.12);
    g.closePath();
  }, T_TAIL(), 3.5);

  // ---- neck + head placement ----
  const headR = U*0.40*s;
  // three key head positions: raised (neutral), grazing (down), hauled-back (cut)
  const HCraise = P(cx+dir*(bodyRx*0.94), cy-bodyRy*0.32+bob);
  const HCgraze = P(cx+dir*(bodyRx*1.02), groundY-headR*0.50);
  const HCback  = P(cx+dir*(bodyRx*0.58), cy-bodyRy*1.10+bob);   // up & back over the withers
  let HC = P(lerp(HCraise.x, HCgraze.x, headDrop), lerp(HCraise.y, HCgraze.y, headDrop));
  HC = P(lerp(HC.x, HCback.x, headBack), lerp(HC.y, HCback.y, headBack));
  const tilt = headBack;   // head thrown back -> muzzle up, throat bared

  // thick woolly neck wedge from shoulder/withers to head
  pen.paint(()=>{
    g.moveTo(cx+dir*bodyRx*0.44, cy-bodyRy*0.40);
    g.quadraticCurveTo(lerp(cx,HC.x,0.55)+dir*U*0.04, lerp(cy-bodyRy,HC.y,0.5),
                       HC.x-dir*headR*0.28, HC.y-headR*0.52);
    g.lineTo(HC.x-dir*headR*0.02, HC.y+headR*0.62);
    g.quadraticCurveTo(cx+dir*bodyRx*0.60, cy+bodyRy*0.10, cx+dir*bodyRx*0.40, cy-bodyRy*0.02);
    g.closePath();
  }, T_FLEECE(), 4.5);

  const h = drawSheepHead(pen, HC, headR, dir, { horned, gaze: headDrop*0.3, tilt });

  // ---- NEAR legs (over body) ----
  drawLeg(pen, P(foreX, legTopY), P(foreX+sw, groundY), U*0.17*s, T_LEGN(), dir, U*0.06);
  drawLeg(pen, P(hindX, legTopY), P(hindX-sw, groundY), U*0.17*s, T_LEGN(), dir, -U*0.06);

  return { throat:h.throat, HC, cy, bodyRx, bodyRy };
}

/* the whole FALLEN / OFFERED sheep — down on its side, legs folded and
   sticking out toward the viewer, head laid low. baseY = the surface it lies
   on (ground for `fallen`, stone top for `offering`). */
function drawLyingSheep(pen, cx, baseY, U, dir, opts={}){
  const g = pen.ctx;
  const horned = !!opts.horned;
  const s      = opts.scale ?? 1;
  const bodyRx = U*1.20*s, bodyRy = U*0.60*s;
  const cy = baseY - bodyRy*0.72;

  // ---- ground/stone contact shadow ----
  g.save(); g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, baseY+3, bodyRx*1.02, U*0.12, 0,0,TAU); g.fill(); g.restore();

  // ---- folded legs sticking out (drawn behind the body) : four stubs ----
  const legTone=[T_LEGF(),T_LEGF(),T_LEGN(),T_LEGN()];
  const legs=[
    { x:cx-dir*bodyRx*0.44, ang:-0.5 }, { x:cx-dir*bodyRx*0.20, ang:-0.2 },
    { x:cx+dir*bodyRx*0.16, ang: 0.2 }, { x:cx+dir*bodyRx*0.40, ang: 0.5 },
  ];
  legs.forEach((L,i)=>{
    const hipY = cy+bodyRy*0.30;
    const kx = L.x + dir*Math.cos(L.ang)*U*0.34, ky = hipY - Math.abs(Math.sin(L.ang))*U*0.06 + U*0.20;
    const fx = kx + dir*U*0.30, fy = ky + U*0.10;
    pen.limb(()=>{ g.moveTo(L.x,hipY); g.lineTo(kx,ky); }, legTone[i], U*0.15*s);
    pen.limb(()=>{ g.moveTo(kx,ky); g.lineTo(fx,fy); }, legTone[i], U*0.12*s);
    pen.paint(()=>{ g.rect(fx-U*0.05, fy-U*0.02, U*0.11, U*0.13); }, T_HOOF(), 2.2);
  });

  // ---- the lying woolly BODY (elongated blob) ----
  pen.paint(()=>{ woolBlob(g, cx, cy, bodyRx, bodyRy, 16, 0.20, Math.round(cx)); }, T_FLEECE(), 5);
  pen.paint(()=>{ g.ellipse(cx-dir*bodyRx*0.06, cy-bodyRy*0.24, bodyRx*0.66, bodyRy*0.34, 0,0,TAU); }, T_FLEECE_H(), 0);
  pen.paint(()=>{ g.ellipse(cx, cy+bodyRy*0.42, bodyRx*0.80, bodyRy*0.34, 0,0,TAU); }, T_FLEECE_D(), 0);
  fleeceCreases(pen, cx, cy, bodyRx, bodyRy*1.1, dir);

  // ---- tail ----
  pen.paint(()=>{ g.ellipse(cx-dir*bodyRx*0.98, cy+bodyRy*0.20, U*0.10, U*0.16, 0.2*dir,0,TAU); }, T_TAIL(), 3);

  // ---- neck + head laid low forward (+dir), resting near the surface ----
  const headR = U*0.38*s;
  const HC = P(cx+dir*(bodyRx*1.02), baseY-headR*0.66);
  pen.paint(()=>{
    g.moveTo(cx+dir*bodyRx*0.60, cy-bodyRy*0.10);
    g.quadraticCurveTo(cx+dir*bodyRx*0.95, cy+bodyRy*0.30, HC.x-dir*headR*0.30, HC.y-headR*0.40);
    g.lineTo(HC.x-dir*headR*0.05, HC.y+headR*0.55);
    g.quadraticCurveTo(cx+dir*bodyRx*0.72, cy+bodyRy*0.62, cx+dir*bodyRx*0.52, cy+bodyRy*0.36);
    g.closePath();
  }, T_FLEECE(), 4.5);
  drawSheepHead(pen, HC, headR, dir, { horned, gaze:0.5, tilt:0 });

  return { HC, cy };
}

/* the sacrificial KNIFE laid to a throat point, blade angled down the throat.
   grip 0..1 opens the cut (blade drawn across). */
function drawKnife(pen, throat, dir, U){
  const g = pen.ctx;
  const bx = throat.x + dir*U*0.02, by = throat.y - U*0.04;
  const bl = U*0.52, bw = U*0.12;
  const ang = 0.5*dir;                       // blade angling down-forward across the throat
  const tipX = bx + dir*Math.cos(ang)*bl, tipY = by + Math.sin(ang)*bl;
  // blade (pale metal triangle)
  pen.paint(()=>{
    g.moveTo(bx - dir*bw*0.2, by - bw*0.5);
    g.lineTo(tipX, tipY);
    g.lineTo(bx + dir*bw*0.2, by + bw*0.5);
    g.closePath();
  }, T_BLADE(), 2.6);
  pen.ink(()=>{ g.moveTo(bx, by); g.lineTo(tipX, tipY); }, 1.6);   // spine glint
  // hilt (dark) back off the throat toward the handler (-dir/up)
  const hx = bx - dir*U*0.16, hy = by - U*0.16;
  pen.paint(()=>{ g.moveTo(bx - dir*bw*0.2, by - bw*0.5);
    g.lineTo(hx - dir*bw*0.1, hy);
    g.lineTo(hx + dir*bw*0.4, hy + bw*0.6);
    g.lineTo(bx + dir*bw*0.2, by + bw*0.5); g.closePath(); }, T_HILT(), 3);
}

/* a HANDLER'S hand steadying the beast at the poll — a compact palm + fingers
   curling over the head, a short forearm angling back off-frame (used in cut).
   `back` is the direction the forearm runs away from the beast. */
function drawHand(pen, x, y, U, back){
  const g = pen.ctx;
  const pw=U*0.40, ph=U*0.26;
  // short forearm angling up-back toward the (off-frame) priest
  pen.limb(()=>{ g.moveTo(x, y); g.lineTo(x+back*U*0.42, y-U*0.34); }, T_HAND(), U*0.14);
  // palm
  pen.paint(()=>{ g.ellipse(x, y, pw*0.5, ph*0.5, 0,0,TAU); }, T_HAND(), 3.5);
  // four fingers curling DOWN over the poll (grip)
  for(let i=0;i<4;i++){
    const fx = x - back*U*0.10 + (i-1.5)*pw*0.24;
    pen.paint(()=>{ g.moveTo(fx-pw*0.08, y);
      g.lineTo(fx-pw*0.08, y+ph*0.75); g.quadraticCurveTo(fx, y+ph*0.98, fx+pw*0.08, y+ph*0.75);
      g.lineTo(fx+pw*0.08, y); g.closePath(); }, T_HAND(), 2.6);
  }
}

/* a lead ROPE from the ram's muzzle running up-forward off frame — the
   ritual handling read (used in `handling`). */
function drawLeadRope(pen, throat, dir, U){
  pen.ink(()=>{
    pen.ctx.moveTo(throat.x, throat.y-U*0.10);
    pen.ctx.quadraticCurveTo(throat.x+dir*U*0.55, throat.y-U*0.55,
                             throat.x+dir*U*0.95, throat.y-U*0.90);
  }, 2.8);
}

/* the blood TRENCH / catch-bowl at the pit's edge, plus a running stream from
   a throat point. blood 0..1 scales the stream length + pool. */
function drawTrench(pen, bx, groundY, U, pool){
  const g = pen.ctx;
  const bw=U*1.0, bh=U*0.30;
  // bowl / trench rim (an open half-ellipse dug into the ground)
  pen.paint(()=>{ g.ellipse(bx, groundY, bw*0.5, bh*0.5, 0, 0, Math.PI); }, T_BOWL(), 4);
  pen.ink(()=>{ g.ellipse(bx, groundY, bw*0.5, bh*0.32, 0, Math.PI, TAU); }, 3);
  // dark pooled blood inside
  if (pool>0){
    pen.paint(()=>{ g.ellipse(bx, groundY-bh*0.02, bw*0.42*clamp01(pool+0.2), bh*0.30*clamp01(pool+0.2), 0, 0, Math.PI); }, T_BLOOD(), 0);
  }
}
function drawBloodStream(pen, from, to, U, flow){
  if (flow<=0) return;
  const g = pen.ctx;
  const midX = lerp(from.x, to.x, 0.5) + U*0.06;
  const y1 = lerp(from.y, to.y, flow);      // stream reaches down as flow rises
  // main falling ribbon
  pen.limb(()=>{ g.moveTo(from.x, from.y);
    g.quadraticCurveTo(midX, lerp(from.y,to.y,0.5), to.x, y1); }, T_BLOOD(), U*0.055);
  // a couple of trailing droplets
  for(let i=1;i<=3;i++){
    const f = i/4;
    const dx = lerp(from.x, to.x, f) + Math.sin(i*2.1)*U*0.04;
    const dy = lerp(from.y, y1, f) + U*0.05;
    if (dy<y1) { pen.paint(()=>{ g.ellipse(dx, dy, U*0.05, U*0.07, 0,0,TAU); }, T_BLOOD(), 0); }
  }
}

/* the offering STONE (low slab the completed pair is laid upon) */
function drawStone(pen, sx, groundY, U, W){
  const g = pen.ctx;
  const sw=W*0.52, sh=U*0.42;
  const topY=groundY-sh;
  pen.paint(()=>{ g.rect(sx-sw*0.5, topY, sw, sh); }, T_STONE(), 5);
  pen.paint(()=>{ g.rect(sx-sw*0.54, topY-sh*0.16, sw*1.08, sh*0.20); }, T_STONETOP(), 4);
  pen.ink(()=>{ g.moveTo(sx-sw*0.5, topY+sh*0.5); g.lineTo(sx+sw*0.5, topY+sh*0.5); }, 2.4);
  pen.ink(()=>{ g.moveTo(sx-sw*0.16, topY+sh*0.16); g.lineTo(sx-sw*0.16, topY+sh); }, 2.4);
  pen.ink(()=>{ g.moveTo(sx+sw*0.22, topY+sh*0.5); g.lineTo(sx+sw*0.22, topY+sh); }, 2.4);
  return topY - sh*0.16;   // stone top surface
}

/* ================= SCENE ================= */
function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const t = state.t || 0;
  const pose = state.pose || "handling";
  const groundY = H*0.68;
  const U = Math.min(W, H) * 0.190;

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  // the pair faces OUTWARD — ewe (left, hornless) faces left, ram (right,
  // horned) faces right — so each reads as a complete, separate silhouette.
  const eweX = W*0.31, ramX = W*0.63;

  if (pose === "offering"){
    // both laid out on a low offering stone, the completed rite
    const topY = drawStone(pen, W*0.5, groundY, U, W);
    drawLyingSheep(pen, W*0.34, topY, U, -1, { horned:false, scale:0.9 });
    drawLyingSheep(pen, W*0.66, topY, U, +1, { horned:true, scale:1.0 });
    return;
  }

  if (pose === "fallen"){
    // ram down on its side; ewe stands bowed alongside (facing away, left)
    drawStandingSheep(pen, W*0.24, groundY, U, -1, { horned:false, scale:0.9, headDrop:0.85, t });
    drawLyingSheep(pen, W*0.64, groundY, U, +1, { horned:true, scale:1.0 });
    return;
  }

  if (pose === "blood-flow"){
    // ewe waits (left); ram head-down over the trench, blood into the bowl
    drawStandingSheep(pen, eweX, groundY, U, -1, { horned:false, scale:0.9, headDrop:0.3, t });
    const trenchX = W*0.91;
    drawTrench(pen, trenchX, groundY, U, clamp01((state.blood ?? 0.7)));
    const ram = drawStandingSheep(pen, ramX, groundY, U, +1, {
      horned:true, scale:1.0, headDrop:0.7, t,
    });
    drawBloodStream(pen, ram.throat, P(ram.throat.x+U*0.36, groundY-U*0.04), U, clamp01(state.blood ?? 0.7));
    return;
  }

  if (pose === "cut"){
    // ewe waits (left); ram's head hauled up & back, throat bared, knife laid on
    drawStandingSheep(pen, eweX, groundY, U, -1, { horned:false, scale:0.9, headDrop:0.15, t });
    const ram = drawStandingSheep(pen, ramX, groundY, U, +1, {
      horned:true, scale:1.0, headBack:0.85, t,
    });
    drawKnife(pen, ram.throat, +1, U);
    drawHand(pen, ram.HC.x - U*0.06, ram.HC.y - U*0.66, U, -1);   // steadying hand over the poll
    return;
  }

  // default: "handling" — both stood, heads up, ram on a lead rope
  drawStandingSheep(pen, eweX, groundY, U, -1, { horned:false, scale:0.9, headDrop:0.1, t });
  const ram = drawStandingSheep(pen, ramX, groundY, U, +1, {
    horned:true, scale:1.0, headDrop:0.05, t,
  });
  drawLeadRope(pen, ram.throat, +1, U);
}

export const asset = {
  id:"creature.black-ewe-and-ram",
  type:"CREATURE",
  name:"Black ewe and ram",
  statusWord:"SACRIFICIAL",
  scene:"OD-B11-S01",

  // procedural knobs
  params:{
    pair:["ewe","ram"],       // hornless ewe + horned ram
    fleece:"#161616",         // near-black wool
    hornBone:"#e6e2d4",       // pale bone curl-horn (ram only)
    fleeceBumps:16,           // scallop lobes on the wool blob
    hornCoils:1.3,            // ram curl-horn forward turns
    eweScale:0.9,             // ewe a touch smaller than the ram
    collision:true,           // hoof-footprint zones exposed for placement
  },
  // back -> front draw order (each animal layered internally)
  layers:["ground","stone","trench","shadow","far-legs","fleece","fleece-form",
          "tail","neck","far-horn","face","near-horn","near-ear","eye",
          "near-legs","knife","blood","hand"],
  // normalized 0..1 attention / contact / handling anchors
  anchors:{
    "ewe:back":{x:.30,y:.52}, "ewe:head":{x:.44,y:.50},
    "ram:back":{x:.62,y:.50}, "ram:head":{x:.76,y:.46},
    "ram:throat":{x:.74,y:.55},        // where the knife is laid / blood springs
    "ram:withers":{x:.58,y:.48},
    "knife:grip":{x:.70,y:.40},        // handler's blade hand
    "hand:handler":{x:.56,y:.40},      // steadying hand at the poll
    "trench:mouth":{x:.86,y:.72},      // the blood-catch pit
    "stone:top":{x:.50,y:.64},         // the offering slab surface
    "camera:rite":{x:.50,y:.52},
  },
  // hoofprint / body footprints for placement, pathing + collision
  zones:{
    "ewe:body":{ x0:.14,y0:.44,x1:.44,y1:.72 },
    "ram:body":{ x0:.46,y0:.42,x1:.80,y1:.72 },
    "trench:precinct":{ x0:.78,y0:.66,x1:.98,y1:.80 },
    walkable:{ x0:.04,y0:.66,x1:.96,y1:.92 },
  },
  states:{
    initial:"handling",
    nodes:{
      handling:{     preview:{ pose:"handling",   t:0.2 } },  // both stood, ram steadied
      cut:{          preview:{ pose:"cut",         t:0.3 } },  // throat bared, knife laid on
      "blood-flow":{ preview:{ pose:"blood-flow",  t:0.5, blood:0.75 } },  // stream into the trench
      fallen:{       preview:{ pose:"fallen",      t:0.6 } },  // ram down on its side
      offering:{     preview:{ pose:"offering",    t:0.8 } },  // both laid on the stone
    },
    edges:[
      ["handling","cut"],["cut","blood-flow"],["blood-flow","fallen"],
      ["fallen","offering"],["handling","offering"],
    ],
  },
  channels:["pose","headBack","headDrop","blood","gaze","t"],

  preview:()=>({ pose:"handling", t:0.2, status:"SACRIFICIAL", progress:.22 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
