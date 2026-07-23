/* creature.cyclops-flock — the Cyclops Polyphemus' great flock of sheep + goats.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. TWO reusable templates — a woolly SHEEP (round scalloped fleece,
   short dark legs, small dark face, floppy ears, optional RAM curl-horn) and a
   leaner GOAT (smooth body, chin beard, short back-swept horns) — plus KID/LAMB
   young drawn at reduced scale. Members are placed and posed deterministically
   so the flock reads as ONE composition, never a flattened illustration. The
   fleece contour is a scalloped wool blob; goats stay crisp and lean so the two
   kinds separate at a glance. Legs carry stride offsets so a walking file reads.
   States: enter (file walking in) / sort (ewes and goats split at a hurdle-gate)
   / milking (a row of ewes stood over pails) / pair (dams paired with young that
   nurse) / sleep (the flock folded down for the night) / exit (streaming out).
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B09-S06 — enter, sort, stand for milking, pair with young, sleep, exit. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;

/* ---- tone levels (flat grays; POST turns them into dots) ----
   Sheep fleece reads LIGHT and cloudy; the dark face / legs / horns pop against
   it. Goats read a shade DARKER and smooth so the two kinds separate. */
const T_FLEECE  = ()=> toneSolid(inkLevel(2));   // woolly white fleece
const T_FLEECE2 = ()=> toneSolid(inkLevel(3));   // shaded underside of fleece
const T_FACE    = ()=> toneSolid(inkLevel(6));   // dark sheep face
const T_EAR     = ()=> toneSolid(inkLevel(5));   // floppy ear
const T_LEGN    = ()=> toneSolid(inkLevel(6));   // near legs (bold)
const T_LEGF    = ()=> toneSolid(inkLevel(5));   // far legs (dimmer)
const T_HOOF    = ()=> toneSolid(inkLevel(7));   // hard hoof
const T_RAMHORN = ()=> toneSolid(inkLevel(5));   // ram curl-horn
const T_GBODY   = ()=> toneSolid(inkLevel(4));   // goat hide (leaner, darker)
const T_GBELLY  = ()=> toneSolid(inkLevel(3));
const T_GFACE   = ()=> toneSolid(inkLevel(5));
const T_GHORN   = ()=> toneSolid(inkLevel(5));
const T_GHORNF  = ()=> toneSolid(inkLevel(4));
const T_BEARD   = ()=> toneSolid(inkLevel(5));
const T_PAIL    = ()=> toneSolid(inkLevel(5));   // milking pail
const T_MILK    = ()=> toneSolid(inkLevel(2));
const T_GATE    = ()=> toneSolid(inkLevel(5));   // hurdle / sorting gate

/* a scalloped WOOL blob: a closed bumpy outline around an ellipse. This is the
   read that makes a sheep woolly. bumps = number of fleece lobes; depth pushes
   each lobe outward. */
function woolBlob(g, cx, cy, rx, ry, bumps, depth=0.26, seed=0){
  const pts=[];
  for(let i=0;i<bumps;i++){
    const a=(i/bumps)*TAU;
    const j = 1 + (((i*7+seed*13)%5)-2)*0.035;    // slight per-lobe jitter (deterministic)
    pts.push({x:cx+Math.cos(a)*rx*j, y:cy+Math.sin(a)*ry*j, a});
  }
  g.moveTo(pts[0].x, pts[0].y);
  for(let i=0;i<bumps;i++){
    const q=pts[(i+1)%bumps];
    let a2 = (i+0.5)/bumps*TAU;
    const b = Math.min(rx,ry)*depth;
    const bx=cx+Math.cos(a2)*(rx+b), by=cy+Math.sin(a2)*(ry+b);
    g.quadraticCurveTo(bx,by,q.x,q.y);
  }
  g.closePath();
}

/* a ram's curled horn: a spiral tapering as it coils forward from the poll. */
function drawRamHorn(pen, HC, hr, dir){
  const g=pen.ctx;
  const cxh=HC.x - dir*hr*0.18, cyh=HC.y - hr*0.22;
  pen.limb(()=>{
    let first=true;
    for(let i=0;i<=26;i++){
      const f=i/26;
      const a = -Math.PI*0.15 + f*TAU*1.15;        // ~1.1 coils
      const r = hr*1.05*(1-f*0.62);
      const x = cxh + dir*Math.cos(a)*r;
      const y = cyh + Math.sin(a)*r;
      if(first){g.moveTo(x,y);first=false;} else g.lineTo(x,y);
    }
  }, T_RAMHORN(), hr*0.30);
  // a couple of growth ridges
  pen.ink(()=>{
    for(let i=1;i<=3;i++){
      const f=i/4, a=-Math.PI*0.15+f*TAU*1.15, r=hr*1.05*(1-f*0.62);
      const x=cxh+dir*Math.cos(a)*r, y=cyh+Math.sin(a)*r;
      g.moveTo(x-hr*0.14,y); g.lineTo(x+hr*0.14,y);
    }
  }, 2);
}

/* short back-swept goat horn (domestic, shorter than the wild kind). */
function drawGoatHorn(pen, HC, hr, dir, off, tone, lw){
  const g=pen.ctx;
  const base=P(HC.x - dir*hr*0.20 + off, HC.y - hr*0.60);
  const tip =P(HC.x - dir*hr*1.15 + off, HC.y - hr*1.05);
  pen.paint(()=>{
    g.moveTo(base.x + dir*hr*0.24, base.y);
    g.quadraticCurveTo(HC.x - dir*hr*0.70 + off, HC.y - hr*1.35, tip.x, tip.y);
    g.quadraticCurveTo(HC.x - dir*hr*0.85 + off, HC.y - hr*0.95, base.x - dir*hr*0.14, base.y - hr*0.06);
    g.quadraticCurveTo(HC.x - dir*hr*0.10 + off, HC.y - hr*0.40, base.x + dir*hr*0.24, base.y);
    g.closePath();
  }, tone, lw);
}

/* ------------- SHEEP TEMPLATE -------------
   opts: gsc (member scale), lamb (bool -> small young), ram (bool -> curl horns),
   headDrop 0..1 (0 head up, 1 nose to ground), stride -1..1 (walk phase),
   lying (bool -> folded down asleep), nurse (bool -> reaching under a dam),
   closed (bool -> eye shut), t (idle phase). */
function drawSheep(pen, cx, groundY, S, dir, opts={}){
  const g=pen.ctx;
  const gsc=(opts.gsc??1)*(opts.lamb?0.56:1);
  const U=S*0.20*gsc;
  const lying=!!opts.lying;
  const stride=opts.stride||0;
  const headDrop=opts.headDrop??0;
  const ram=!!opts.ram;
  const t=opts.t||0;
  const bob=Math.sin(t*2+cx*0.01)*U*0.01;

  const bodyRx=U*0.92, bodyRyS=U*0.64;
  const legLen=lying?0:U*0.52;
  const bodyRy=lying?bodyRyS*0.82:bodyRyS;
  const cy=(lying?groundY-bodyRy*0.72:groundY-legLen-bodyRy*0.5)+bob;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+4, bodyRx*(lying?1.15:0.9), U*0.12, 0,0,7); g.fill(); g.restore();

  // ---- legs (skipped when lying: folded marks instead) ----
  const legTopY=cy+bodyRy*0.30;
  const foreX=cx+dir*bodyRx*0.50, hindX=cx-dir*bodyRx*0.55;
  const sw = stride*U*0.26;
  function leg(x, footShift, w, toneN){
    pen.limb(()=>{ g.moveTo(x, legTopY); g.lineTo(x+footShift, groundY); }, toneN, w);
    pen.paint(()=>{ g.rect(x+footShift-w*0.55, groundY-w*0.15, w*1.1, w*0.55); }, T_HOOF(), 2.5);
  }
  if(!lying){
    // far pair (inset, dimmer)
    leg(foreX-dir*U*0.13, -sw*0.8, U*0.085, T_LEGF());
    leg(hindX-dir*U*0.13,  sw*0.8, U*0.085, T_LEGF());
  }

  // ---- woolly BODY ----
  const bumps=opts.lamb?9:12;
  pen.paint(()=>{ woolBlob(g, cx, cy, bodyRx, bodyRy, bumps, lying?0.22:0.28, Math.round(cx)); }, T_FLEECE(), 4.5);
  // a shaded underside lobe so the fleece has form
  pen.paint(()=>{ g.ellipse(cx, cy+bodyRy*0.42, bodyRx*0.72, bodyRy*0.34, 0,0,7); }, T_FLEECE2(), 0);

  // ---- head + neck (front, toward dir) ----
  const headR=U*0.34;
  const HCxRaise=cx+dir*(bodyRx*0.86), HCyRaise=cy-bodyRy*0.30+bob;
  const HCxGraze=cx+dir*(bodyRx*1.02), HCyGraze=groundY-headR*0.55;
  let HCx=lerp(HCxRaise,HCxGraze,headDrop), HCy=lerp(HCyRaise,HCyGraze,headDrop);
  if(lying){ HCx=cx+dir*(bodyRx*0.78); HCy=cy-bodyRy*0.05; }   // head resting forward, low

  // neck: a short woolly wedge from body to head
  pen.paint(()=>{
    g.moveTo(cx+dir*bodyRx*0.42, cy-bodyRy*0.35);
    g.quadraticCurveTo(HCx-dir*headR*0.2, HCy-headR*0.5, HCx-dir*headR*0.1, HCy);
    g.lineTo(HCx-dir*headR*0.2, HCy+headR*0.7);
    g.quadraticCurveTo(cx+dir*bodyRx*0.5, cy+bodyRy*0.25, cx+dir*bodyRx*0.30, cy+bodyRy*0.10);
    g.closePath();
  }, T_FLEECE(), 3.5);

  drawSheepHead(pen, P(HCx,HCy), headR, dir, { ram, closed:!!opts.closed||lying });

  // ---- folded legs when lying (small tucked marks under the fleece) ----
  if(lying){
    pen.limb(()=>{ g.moveTo(cx+dir*bodyRx*0.30, cy+bodyRy*0.55); g.lineTo(cx+dir*bodyRx*0.52, groundY); }, T_LEGN(), U*0.09);
    pen.paint(()=>{ g.rect(cx+dir*bodyRx*0.52-U*0.05, groundY-U*0.03, U*0.14, U*0.06); }, T_HOOF(), 2.2);
    pen.limb(()=>{ g.moveTo(cx-dir*bodyRx*0.34, cy+bodyRy*0.55); g.lineTo(cx-dir*bodyRx*0.20, groundY); }, T_LEGN(), U*0.09);
  } else {
    // near pair (over body, bold)
    leg(foreX,  sw, U*0.10, T_LEGN());
    leg(hindX, -sw, U*0.10, T_LEGN());
  }

  return { head:P(HCx,HCy), body:P(cx,cy) };
}

function drawSheepHead(pen, HC, hr, dir, { ram=false, closed=false }={}){
  const g=pen.ctx;
  // far ear (behind face)
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.35, HC.y-hr*0.25);
    g.quadraticCurveTo(HC.x-dir*hr*1.15, HC.y+hr*0.05, HC.x-dir*hr*1.05, HC.y+hr*0.55);
    g.quadraticCurveTo(HC.x-dir*hr*0.55, HC.y+hr*0.25, HC.x-dir*hr*0.30, HC.y+hr*0.10);
    g.closePath();
  }, T_EAR(), 3);
  // ram curl-horn (behind the face, over the poll)
  if(ram) drawRamHorn(pen, HC, hr, dir);

  // dark elongated FACE, tipped toward the muzzle
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.32, HC.y-hr*0.70);                 // poll
    g.quadraticCurveTo(HC.x+dir*hr*0.55, HC.y-hr*0.55, HC.x+dir*hr*0.92, HC.y-hr*0.02); // brow->nose bridge
    g.quadraticCurveTo(HC.x+dir*hr*1.14, HC.y+hr*0.42, HC.x+dir*hr*0.80, HC.y+hr*0.72); // muzzle tip
    g.quadraticCurveTo(HC.x+dir*hr*0.30, HC.y+hr*0.92, HC.x-dir*hr*0.20, HC.y+hr*0.55); // chin->throat
    g.quadraticCurveTo(HC.x-dir*hr*0.42, HC.y-hr*0.10, HC.x-dir*hr*0.32, HC.y-hr*0.70);
    g.closePath();
  }, T_FACE(), 3.5);

  // woolly poll (a small fleece cap over the top of the head)
  pen.paint(()=>{ woolBlob(g, HC.x-dir*hr*0.05, HC.y-hr*0.62, hr*0.62, hr*0.46, 7, 0.30, 3); }, T_FLEECE(), 3);

  // near ear (floppy, hangs down in front)
  pen.paint(()=>{
    g.moveTo(HC.x+dir*hr*0.05, HC.y-hr*0.30);
    g.quadraticCurveTo(HC.x+dir*hr*0.75, HC.y-hr*0.02, HC.x+dir*hr*0.70, HC.y+hr*0.55);
    g.quadraticCurveTo(HC.x+dir*hr*0.35, HC.y+hr*0.28, HC.x+dir*hr*0.10, HC.y+hr*0.05);
    g.closePath();
  }, T_EAR(), 3);

  // eye + nostril
  if(closed){
    pen.ink(()=>{ g.moveTo(HC.x+dir*hr*0.28, HC.y-hr*0.02); g.lineTo(HC.x+dir*hr*0.55, HC.y+hr*0.04); }, 2.4);
  } else {
    g.fillStyle="#f4f4f0"; g.beginPath();
    g.ellipse(HC.x+dir*hr*0.44, HC.y-hr*0.04, hr*0.12, hr*0.14, 0,0,7); g.fill();
    g.fillStyle=INK; g.beginPath();
    g.ellipse(HC.x+dir*hr*0.46, HC.y-hr*0.04, hr*0.06, hr*0.08, 0,0,7); g.fill();
  }
  g.fillStyle=INK; g.beginPath();
  g.ellipse(HC.x+dir*hr*0.92, HC.y+hr*0.30, hr*0.08, hr*0.06, 0.3*dir, 0,7); g.fill();
}

/* ------------- GOAT TEMPLATE ------------- (leaner, smooth, beard + horns) */
function drawGoat(pen, cx, groundY, S, dir, opts={}){
  const g=pen.ctx;
  const gsc=(opts.gsc??1)*(opts.kid?0.55:1);
  const U=S*0.20*gsc;
  const lying=!!opts.lying;
  const stride=opts.stride||0;
  const headDrop=opts.headDrop??0;
  const t=opts.t||0;
  const bob=Math.sin(t*2+cx*0.013)*U*0.01;

  const bodyRx=U*0.86, bodyRyS=U*0.50;
  const legLen=lying?0:U*0.58;
  const bodyRy=lying?bodyRyS*0.82:bodyRyS;
  const cy=(lying?groundY-bodyRy*0.75:groundY-legLen-bodyRy*0.55)+bob;

  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+4, bodyRx*(lying?1.1:0.85), U*0.11, 0,0,7); g.fill(); g.restore();

  const legTopY=cy+bodyRy*0.28;
  const foreX=cx+dir*bodyRx*0.52, hindX=cx-dir*bodyRx*0.56;
  const sw=stride*U*0.24;
  function leg(x, footShift, w, tone){
    pen.limb(()=>{ g.moveTo(x, legTopY); g.lineTo(x+footShift, groundY); }, tone, w);
    pen.paint(()=>{ g.rect(x+footShift-w*0.55, groundY-w*0.12, w*1.1, w*0.5); }, T_HOOF(), 2.2);
  }
  if(!lying){
    leg(foreX-dir*U*0.12, -sw*0.8, U*0.07, T_LEGF());
    leg(hindX-dir*U*0.12,  sw*0.8, U*0.07, T_LEGF());
  }

  // smooth lean body
  pen.paint(()=>{
    g.moveTo(cx+dir*bodyRx, cy);
    g.quadraticCurveTo(cx+dir*bodyRx*0.6, cy-bodyRy*1.05, cx, cy-bodyRy*1.0);          // withers
    g.quadraticCurveTo(cx-dir*bodyRx*0.7, cy-bodyRy*0.95, cx-dir*bodyRx, cy-bodyRy*0.15); // back->rump
    g.quadraticCurveTo(cx-dir*bodyRx*1.02, cy+bodyRy*0.5, cx-dir*bodyRx*0.7, cy+bodyRy*0.7); // rump down
    g.quadraticCurveTo(cx, cy+bodyRy*1.05, cx+dir*bodyRx*0.7, cy+bodyRy*0.7);           // belly
    g.quadraticCurveTo(cx+dir*bodyRx*1.05, cy+bodyRy*0.35, cx+dir*bodyRx, cy);          // brisket
    g.closePath();
  }, T_GBODY(), 4.5);
  pen.paint(()=>{ g.ellipse(cx, cy+bodyRy*0.5, bodyRx*0.6, bodyRy*0.28, 0,0,7); }, T_GBELLY(), 0);

  // short upturned tail
  pen.limb(()=>{ g.moveTo(cx-dir*bodyRx*0.9, cy-bodyRy*0.55);
    g.quadraticCurveTo(cx-dir*bodyRx*1.05, cy-bodyRy*1.05, cx-dir*bodyRx*0.86, cy-bodyRy*1.1); }, T_GBODY(), U*0.05);

  // neck + head
  const headR=U*0.30;
  const HCxRaise=cx+dir*(bodyRx*1.05), HCyRaise=cy-bodyRy*1.05+bob;
  const HCxGraze=cx+dir*(bodyRx*1.15), HCyGraze=groundY-headR*0.6;
  let HCx=lerp(HCxRaise,HCxGraze,headDrop), HCy=lerp(HCyRaise,HCyGraze,headDrop);
  if(lying){ HCx=cx+dir*(bodyRx*0.95); HCy=cy-bodyRy*0.2; }
  pen.paint(()=>{
    g.moveTo(cx+dir*bodyRx*0.55, cy-bodyRy*0.85);
    g.quadraticCurveTo(lerp(cx,HCx,0.6)+dir*U*0.05, lerp(cy-bodyRy,HCy,0.5), HCx-dir*headR*0.3, HCy-headR*0.5);
    g.lineTo(HCx+dir*headR*0.1, HCy+headR*0.55);
    g.quadraticCurveTo(cx+dir*bodyRx*0.75, cy-bodyRy*0.2, cx+dir*bodyRx*0.6, cy-bodyRy*0.35);
    g.closePath();
  }, T_GBODY(), 4);

  drawGoatHead(pen, P(HCx,HCy), headR, dir, { closed:lying });
  if(!lying){
    leg(foreX,  sw, U*0.088, T_LEGN());
    leg(hindX, -sw, U*0.088, T_LEGN());
  } else {
    pen.limb(()=>{ g.moveTo(cx+dir*bodyRx*0.3, cy+bodyRy*0.5); g.lineTo(cx+dir*bodyRx*0.5, groundY); }, T_LEGN(), U*0.075);
  }
  return { head:P(HCx,HCy), body:P(cx,cy) };
}

function drawGoatHead(pen, HC, hr, dir, { closed=false }={}){
  const g=pen.ctx;
  // far horn
  drawGoatHorn(pen, HC, hr, dir, -dir*hr*0.14, T_GHORNF(), 3);
  // ear
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.28, HC.y-hr*0.05);
    g.quadraticCurveTo(HC.x-dir*hr*0.95, HC.y+hr*0.05, HC.x-dir*hr*0.90, HC.y+hr*0.45);
    g.quadraticCurveTo(HC.x-dir*hr*0.45, HC.y+hr*0.2, HC.x-dir*hr*0.25, HC.y+hr*0.12);
    g.closePath();
  }, T_EAR(), 3);
  // wedge head
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.40, HC.y-hr*0.62);
    g.quadraticCurveTo(HC.x+dir*hr*0.55, HC.y-hr*0.55, HC.x+dir*hr*1.02, HC.y-hr*0.12);
    g.quadraticCurveTo(HC.x+dir*hr*1.55, HC.y+hr*0.18, HC.x+dir*hr*1.45, HC.y+hr*0.55);
    g.quadraticCurveTo(HC.x+dir*hr*1.25, HC.y+hr*0.80, HC.x+dir*hr*0.85, HC.y+hr*0.78);
    g.quadraticCurveTo(HC.x+dir*hr*0.05, HC.y+hr*0.90, HC.x-dir*hr*0.28, HC.y+hr*0.42);
    g.closePath();
  }, T_GFACE(), 3.5);
  // near horn
  drawGoatHorn(pen, HC, hr, dir, dir*hr*0.02, T_GHORN(), 3.5);
  // chin beard
  pen.paint(()=>{
    const bx=HC.x+dir*hr*0.55, by=HC.y+hr*0.72;
    g.moveTo(bx-dir*hr*0.18, by);
    g.lineTo(bx+dir*hr*0.16, by);
    g.quadraticCurveTo(bx+dir*hr*0.08, by+hr*0.85, bx-dir*hr*0.05, by+hr*0.95);
    g.quadraticCurveTo(bx-dir*hr*0.16, by+hr*0.55, bx-dir*hr*0.18, by);
    g.closePath();
  }, T_BEARD(), 2.5);
  // eye + nostril
  if(closed){
    pen.ink(()=>{ g.moveTo(HC.x+dir*hr*0.35, HC.y-hr*0.05); g.lineTo(HC.x+dir*hr*0.62, HC.y); }, 2.2);
  } else {
    g.fillStyle=INK; g.beginPath();
    g.ellipse(HC.x+dir*hr*0.50, HC.y-hr*0.10, hr*0.11, hr*0.13, 0,0,7); g.fill();
  }
  g.fillStyle=INK; g.beginPath();
  g.ellipse(HC.x+dir*hr*1.40, HC.y+hr*0.42, hr*0.08, hr*0.06, 0.3*dir, 0,7); g.fill();
}

/* a milking pail beneath a standing ewe. */
function drawPail(pen, cx, groundY, U){
  const g=pen.ctx;
  const w=U*0.42, h=U*0.36, top=groundY-h;
  pen.paint(()=>{
    g.moveTo(cx-w*0.5, top); g.lineTo(cx+w*0.5, top);
    g.lineTo(cx+w*0.38, groundY); g.lineTo(cx-w*0.38, groundY); g.closePath();
  }, T_PAIL(), 3.5);
  pen.paint(()=>{ g.ellipse(cx, top, w*0.5, h*0.14, 0,0,7); }, T_MILK(), 3);
  pen.ink(()=>{ g.moveTo(cx-w*0.5, top-h*0.02);
    g.quadraticCurveTo(cx, top-h*0.5, cx+w*0.5, top-h*0.02); }, 2.5); // bail handle
}

/* a hurdle GATE / sorting fence (a woven pen divider). */
function drawGate(pen, cx, groundY, U, h){
  const g=pen.ctx;
  const top=groundY-h;
  // two posts
  pen.paint(()=>{ g.rect(cx-U*0.10, top, U*0.10, h); }, T_GATE(), 3.5);
  pen.paint(()=>{ g.rect(cx+U*0.00, top, U*0.10, h); }, T_GATE(), 3.5);
  // horizontal rails
  for(let i=0;i<3;i++){ const y=top+h*(0.18+i*0.30);
    pen.paint(()=>{ g.rect(cx-U*0.34, y, U*0.68, h*0.08); }, T_GATE(), 3); }
  // a couple of wattle uprights
  pen.ink(()=>{ for(let k=-1;k<=1;k++){ g.moveTo(cx+k*U*0.20, top+h*0.1); g.lineTo(cx+k*U*0.20, groundY); } }, 2.4);
}

/* ================= SCENE LAYOUT ================= */
function layoutFor(state){
  const pose=state.pose||"enter";
  switch(pose){
    case "enter": // a file streaming in from the left, mid-stride
      return { members:[
        {kind:"goat",  x:0.11, dir:+1, stride:+1, gsc:0.84},
        {kind:"sheep", x:0.28, dir:+1, stride:-1, gsc:0.98},
        {kind:"lamb",  x:0.41, dir:+1, stride:+1, gsc:0.95},
        {kind:"ram",   x:0.57, dir:+1, stride:+1, gsc:1.02},
        {kind:"sheep", x:0.74, dir:+1, stride:-1, gsc:0.92},
        {kind:"goat",  x:0.90, dir:+1, stride:+1, gsc:0.8},
      ]};
    case "sort": // ewes to the left, goats to the right, split at the gate
      return { gate:{x:0.5, h:0.30}, members:[
        {kind:"ram",   x:0.16, dir:+1, headDrop:0.1, gsc:1.0},
        {kind:"sheep", x:0.32, dir:+1, gsc:0.92},
        {kind:"sheep", x:0.24, dir:+1, headDrop:0.3, gsc:0.82},
        {kind:"goat",  x:0.68, dir:-1, gsc:0.95},
        {kind:"goat",  x:0.82, dir:-1, headDrop:0.2, gsc:0.88},
        {kind:"kid",   x:0.76, dir:-1, gsc:0.95},
      ]};
    case "milking": // a row of ewes stood over pails
      return { pails:[0.22,0.5,0.78], members:[
        {kind:"sheep", x:0.22, dir:+1, gsc:0.98},
        {kind:"sheep", x:0.50, dir:+1, gsc:1.0},
        {kind:"sheep", x:0.78, dir:+1, gsc:0.96},
      ]};
    case "pair": // dams paired with their young; young reach up to nurse
      return { members:[
        {kind:"sheep", x:0.24, dir:+1, gsc:1.0},
        {kind:"lamb",  x:0.35, dir:-1, headDrop:0.6, nurse:true, gsc:0.95},
        {kind:"goat",  x:0.62, dir:+1, gsc:0.98},
        {kind:"kid",   x:0.73, dir:-1, headDrop:0.6, nurse:true, gsc:0.95},
        {kind:"sheep", x:0.86, dir:+1, headDrop:0.9, gsc:0.8},
      ]};
    case "sleep": // the flock folded down for the night
      return { members:[
        {kind:"sheep", x:0.18, dir:+1, lying:true, gsc:0.95},
        {kind:"goat",  x:0.36, dir:-1, lying:true, gsc:0.9},
        {kind:"ram",   x:0.54, dir:+1, lying:true, gsc:1.0},
        {kind:"lamb",  x:0.66, dir:+1, lying:true, gsc:0.95},
        {kind:"sheep", x:0.82, dir:-1, lying:true, gsc:0.92},
      ]};
    case "exit": // streaming out to the right, receding
      return { members:[
        {kind:"sheep", x:0.20, dir:+1, stride:+1, headDrop:0.2, gsc:0.78},
        {kind:"goat",  x:0.36, dir:+1, stride:-1, gsc:0.85},
        {kind:"lamb",  x:0.48, dir:+1, stride:+1, gsc:0.95},
        {kind:"ram",   x:0.64, dir:+1, stride:+1, gsc:1.0},
        {kind:"sheep", x:0.82, dir:+1, stride:-1, gsc:1.05},
      ]};
    default:
      return { members:[
        {kind:"sheep", x:0.30, dir:+1, gsc:1.0}, {kind:"goat", x:0.66, dir:-1, gsc:1.0},
      ]};
  }
}

function drawOne(pen, m, W, groundY, S, t){
  const cx=W*m.x, dir=m.dir;
  const opts={ headDrop:m.headDrop, stride:m.stride, lying:m.lying, gsc:m.gsc, t };
  if(m.kind==="sheep") drawSheep(pen, cx, groundY, S, dir, opts);
  else if(m.kind==="ram") drawSheep(pen, cx, groundY, S, dir, {...opts, ram:true});
  else if(m.kind==="lamb") drawSheep(pen, cx, groundY, S, dir, {...opts, lamb:true});
  else if(m.kind==="goat") drawGoat(pen, cx, groundY, S, dir, opts);
  else if(m.kind==="kid") drawGoat(pen, cx, groundY, S, dir, {...opts, kid:true});
}

function drawScene(ctx, W, H, state){
  const pen=makePen(ctx, { outline:true });
  const S=Math.min(W,H)*0.56;
  const groundY=H*0.60;
  const t=state.t||0;
  const L=layoutFor(state);

  // shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.02, groundY+2); ctx.lineTo(W*0.98, groundY+2); ctx.stroke(); ctx.restore();

  // pails go under the ewes (behind their near legs) for the milking read
  if(L.pails) for(const px of L.pails) drawPail(pen, W*px, groundY, S*0.20);

  // members: far (smaller) first so nearer ones overlap for depth
  const members=[...(L.members||[])].sort((a,b)=>(a.gsc||1)-(b.gsc||1));
  for(const m of members) drawOne(pen, m, W, groundY, S, t);

  // sorting gate drawn over the split so it reads as a divider between the kinds
  if(L.gate) drawGate(pen, W*L.gate.x, groundY, S*0.30, S*L.gate.h);
}

export const asset = {
  id:"creature.cyclops-flock",
  type:"CREATURE",
  name:"Cyclops flock",
  statusWord:"PENNED",
  scene:"OD-B09-S06",

  params:{
    sheep:true,           // woolly ewes + rams
    goats:true,           // bearded, short-horned goats
    young:true,           // lambs + kids at reduced scale
    fleeceBumps:12,       // scallop lobes on a full-grown fleece
    ramHorns:true,        // curl-horns on rams
    goatHorns:true,       // short back-swept horns on goats
    flockSize:6,          // members drawn per state layout
  },
  // back -> front draw order (honored per member internally)
  layers:["ground","pail","shadow","far-legs","body","belly","neck","far-horn",
          "ear","head","face","near-horn","beard","eye","near-legs","gate"],
  // normalized 0..1 attention / handling / placement anchors
  anchors:{
    "flock:center":{x:.50,y:.54}, "gate:sort":{x:.50,y:.48}, "milk:pail-a":{x:.22,y:.60},
    "milk:pail-b":{x:.50,y:.60}, "milk:pail-c":{x:.78,y:.60}, "dam:ewe":{x:.24,y:.42},
    "young:lamb":{x:.35,y:.52}, "fold:center":{x:.50,y:.58}, "entrance:cave-mouth":{x:.04,y:.60},
    "exit:pasture":{x:.96,y:.60}, "camera:flock":{x:.50,y:.50},
  },
  // pen / pasture footprints for placement + collision
  zones:{
    "pen:floor":{ x0:.06,y0:.58,x1:.94,y1:.90 },
    walkable:{ x0:.02,y0:.60,x1:.98,y1:.92 },
    "gate:line":{ x0:.46,y0:.40,x1:.54,y1:.66 },
  },
  states:{
    initial:"enter",
    nodes:{
      enter:{   preview:{ pose:"enter",   t:0.4 } },   // the flock files into the cave/fold
      sort:{    preview:{ pose:"sort",     t:0.2 } },   // ewes and goats split at the hurdle-gate
      milking:{ preview:{ pose:"milking",  t:0.2 } },   // a row of ewes stood over the pails
      pair:{    preview:{ pose:"pair",     t:0.3 } },   // dams paired with nursing young
      sleep:{   preview:{ pose:"sleep",    t:0.1 } },   // the flock folded down for the night
      exit:{    preview:{ pose:"exit",     t:0.6 } },   // streaming out to pasture at dawn
    },
    edges:[
      ["enter","sort"],["sort","milking"],["milking","pair"],
      ["pair","sleep"],["sleep","exit"],["exit","enter"],["sort","milking"],
    ],
  },
  channels:["pose","headDrop","stride","lying","nurse"],

  preview:()=>({ pose:"enter", t:0.4, status:"PENNED", progress:.22 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
