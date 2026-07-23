/* prop.beggar-staff-and-bag — the disguised Odysseus' kit: a gnarled wooden
   walking staff + a patched leather beggar's pouch slung on a cord. PROP asset.
   One reusable object drawn in SOLID grays + hard contour into the offscreen
   ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B13-S05): the beggar's walking support + carried pouch,
   with five states — GRIP (upright, hand on the staff, pouch hanging from the
   cord), LEAN (staff canted, foot on the ground, pouch swinging), SET DOWN
   (staff laid across the ground, pouch resting beside it), CONCEAL (staff and
   pouch tucked under a cloak flap, only the knobbed head showing), DISCARD
   (staff cast flat on the ground, pouch tossed aside).

   The staff is built along a local axis and rotated about the GRIP pivot per
   state so grip / foot-contact anchors stay meaningful under rotation; the
   pouch hangs by gravity in screen space from a hang point on the shaft.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  length:660,        // staff length in source px (fits 660x880 at any angle)
  knots:4,           // gnarled wood knots down the shaft
  patches:3,         // leather patches sewn onto the pouch
  drawstring:true,   // puckered cinch at the pouch mouth
};

const WOOD   = 4;   // walking-staff wood, mid tone
const WOOD_L = 2;   // lit face of the shaft (few dots)
const WOOD_D = 6;   // shaded face / knots (dark)
const WRAP   = 6;   // cord-wrapped grip band (dark leather)
const HIDE   = 4;   // pouch leather body
const HIDE_L = 2;   // lit crown of the pouch
const HIDE_D = 5;   // shaded near-flank
const PATCH_A= 3;   // a lighter sewn patch
const PATCH_B= 6;   // a darker sewn patch
const THONG  = 6;   // drawstring / cord (dark)
const MOUTH  = 6;   // open pouch mouth (dark)
const CLOAK  = 5;   // concealing cloak drape
const CLOAK_D= 6;   // cloak fold shadow

/* ------------------------------------------------------------------
   THE STAFF — a gnarled pole sampled along the local axis (up = -y).
   center-line crook + per-knot bulges give the natural-wood silhouette.
   All geometry is LOCAL; the caller applies translate(pivot)+rotate(angle).
   ------------------------------------------------------------------ */
function staffGeom(L){
  const yTop=-L*0.42, yBot=L*0.42, R=yBot-yTop;
  const cr = y => Math.sin(y*0.009)*7 + Math.sin(y*0.028)*3;   // crooked center line
  const knots=[];
  for(let i=0;i<params.knots;i++){
    const t=0.24+i*0.17;
    knots.push({ y:yTop+R*t, side:(i%2?1:-1), b:5+((i*7)%4) });
  }
  const bulge = y=>{ let bb=0; for(const k of knots){ const d=Math.abs(y-k.y);
    if(d<28) bb += Math.cos(d/28*Math.PI/2)*k.b*k.side; } return bb; };
  const half = y=>{
    const tt=(y-yTop)/R;
    let base=9.5;
    if(tt<0.055) base=lerp(18,10,tt/0.055);        // gnarled knobbed head
    if(tt>0.88)  base=lerp(9.5,3,(tt-0.88)/0.12);   // worn tapered foot
    return base;
  };
  const N=44, pts=[];
  for(let i=0;i<=N;i++){ const y=yTop+R*i/N; pts.push({ y, cx:cr(y), h:half(y), bl:bulge(y) }); }
  return { yTop, yBot, pts, knots };
}
const leftX  = p => p.cx - p.h - Math.max(0,-p.bl);
const rightX = p => p.cx + p.h + Math.max(0, p.bl);

function staffPath(g, pts){
  g.moveTo(leftX(pts[0]), pts[0].y);
  for(let i=1;i<pts.length;i++) g.lineTo(leftX(pts[i]), pts[i].y);
  for(let i=pts.length-1;i>=0;i--) g.lineTo(rightX(pts[i]), pts[i].y);
  g.closePath();
}
function band(g, pts, f0, f1){
  g.moveTo(f0(pts[0]), pts[0].y);
  for(let i=1;i<pts.length;i++) g.lineTo(f0(pts[i]), pts[i].y);
  for(let i=pts.length-1;i>=0;i--) g.lineTo(f1(pts[i]), pts[i].y);
  g.closePath();
}

function drawStaffLocal(pen, g, G){
  const pts=G.pts;
  // solid wood body + hard contour
  pen.paint(()=>staffPath(g,pts), toneSolid(inkLevel(WOOD)), 5);
  // round the pole: lit band left, shaded band right (follows the crook)
  g.save(); g.beginPath(); staffPath(g,pts); g.clip();
  g.fillStyle=inkLevel(WOOD_L); g.beginPath(); band(g,pts, p=>p.cx-p.h*0.92, p=>p.cx-p.h*0.34); g.fill();
  g.fillStyle=inkLevel(WOOD_D); g.beginPath(); band(g,pts, p=>p.cx+p.h*0.34, p=>p.cx+p.h*0.94); g.fill();
  g.restore();
  // wood knots (dark eyes) sitting on the shaft
  for(const k of G.knots){
    const cxk=Math.sin(k.y*0.009)*7 + Math.sin(k.y*0.028)*3 + k.side*4;
    pen.paint(()=>{ g.ellipse(cxk, k.y, 5.5, 8, 0,0,7); }, toneSolid(inkLevel(WOOD_D)), 2.6);
    pen.seam(()=>{ g.ellipse(cxk, k.y, 2.4, 3.4, 0,0,7); }, 2);
  }
  // a couple of grain seams down the length
  g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.35;
  for(const off of [-3,3]){
    g.beginPath();
    for(let i=2;i<pts.length-2;i++){ const p=pts[i]; const x=p.cx+off; i===2?g.moveTo(x,p.y):g.lineTo(x,p.y); }
    g.stroke();
  }
  g.globalAlpha=1;
  // cord-wrapped GRIP band at the pivot (s≈0)
  const gTop=-56, gBot=64, gW=16;
  pen.paint(()=>{ g.rect(-gW, gTop, gW*2, gBot-gTop); }, toneSolid(inkLevel(WRAP)), 4);
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let s=gTop+8;s<gBot-4;s+=9){ g.beginPath(); g.moveTo(-gW, s); g.lineTo(gW, s+6); g.stroke(); }
}

/* ------------------------------------------------------------------
   THE POUCH — a patched leather beggar's bag, drawn upright in a local
   frame centred at (cx,cy), optional tilt. Returns the world mouth point.
   ------------------------------------------------------------------ */
function drawPouch(pen, g, cx, cy, bw, { open=false, tilt=0 }={}){
  const nH=bw*0.17, bH=bw*0.45;
  const yMouth=-bw*0.54, yTie=-bw*0.40, yBelly=bw*0.04, yBot=bw*0.54;
  const ca=Math.cos(tilt), sa=Math.sin(tilt);
  const mouth={ x:cx + 0*ca - yMouth*sa, y:cy + 0*sa + yMouth*ca };

  g.save(); g.translate(cx,cy); g.rotate(tilt);

  // body silhouette
  const body=()=>{
    g.moveTo(-nH, yMouth);
    g.lineTo(-nH*0.9, yTie);
    g.quadraticCurveTo(-bH, yBelly, -bH*0.86, yBelly+bw*0.16);
    g.quadraticCurveTo(-bH*0.6, yBot, 0, yBot);
    g.quadraticCurveTo( bH*0.6, yBot,  bH*0.86, yBelly+bw*0.16);
    g.quadraticCurveTo( bH, yBelly,  nH*0.9, yTie);
    g.lineTo( nH, yMouth);
    g.closePath();
  };
  pen.paint(body, toneSolid(inkLevel(HIDE)), 5);

  // lit crown (upper-left wedge so it reads round)
  pen.paint(()=>{
    g.moveTo(-bH*0.7, yBelly-bw*0.02);
    g.quadraticCurveTo(-bH*0.5, yTie, -nH*0.6, yTie+bw*0.05);
    g.quadraticCurveTo(-bH*0.2, yBelly*0.2, -bH*0.4, yBelly+bw*0.14);
    g.quadraticCurveTo(-bH*0.72, yBelly+bw*0.06, -bH*0.7, yBelly-bw*0.02);
    g.closePath();
  }, toneSolid(inkLevel(HIDE_L)), 0);
  // shaded near-flank (lower-right crescent)
  pen.paint(()=>{
    g.moveTo(bH*0.5, yBelly-bw*0.02);
    g.quadraticCurveTo(bH*0.95, yBelly+bw*0.12, bH*0.5, yBelly+bw*0.24);
    g.quadraticCurveTo(bH*0.62, yBelly+bw*0.06, bH*0.5, yBelly-bw*0.02);
    g.closePath();
  }, toneSolid(inkLevel(HIDE_D)), 0);

  // sewn PATCHES with running-stitch borders
  const patchSpec=[
    { x:-bH*0.30, y:yBelly+bw*0.06, w:bw*0.26, h:bw*0.24, t:PATCH_A },
    { x: bH*0.24, y:yBelly-bw*0.02, w:bw*0.22, h:bw*0.20, t:PATCH_B },
    { x:-bH*0.02, y:yBelly+bw*0.24, w:bw*0.24, h:bw*0.16, t:PATCH_B },
  ].slice(0, params.patches);
  for(const p of patchSpec){
    pen.paint(()=>{ g.rect(p.x-p.w/2, p.y-p.h/2, p.w, p.h); }, toneSolid(inkLevel(p.t)), 2.4);
    g.strokeStyle=INK; g.lineWidth=1.8; g.setLineDash([3,3]);
    g.strokeRect(p.x-p.w/2+2, p.y-p.h/2+2, p.w-4, p.h-4);
    g.setLineDash([]);
  }

  // drawstring cinch band + mouth
  pen.paint(()=>{ g.rect(-nH*1.05, yTie-bw*0.02, nH*2.1, bw*0.05); }, toneSolid(inkLevel(THONG)), 3);
  if (open){
    pen.paint(()=>{ g.ellipse(0, yMouth+bw*0.01, nH*0.95, bw*0.05, 0,0,7); }, toneSolid(inkLevel(MOUTH)), 3);
  } else if (params.drawstring){
    // puckered gathered mouth: short verticals above the tie
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
    for(let i=-2;i<=2;i++){ const x=i*nH*0.34;
      g.beginPath(); g.moveTo(x, yTie-bw*0.01); g.lineTo(x*0.7, yMouth); g.stroke(); }
    pen.paint(()=>{ g.ellipse(0, yMouth, nH*0.72, bw*0.03, 0,0,7); }, toneSolid(inkLevel(HIDE_D)), 2.4);
  }
  // a knotted drawstring tail
  g.strokeStyle=inkLevel(THONG); g.lineWidth=3; g.lineCap="round";
  g.beginPath(); g.moveTo(nH*0.6, yTie); g.quadraticCurveTo(nH*1.7, yTie+bw*0.06, nH*1.4, yTie+bw*0.2); g.stroke();

  g.restore();
  return mouth;
}

/* ground plane drawn in SCREEN space (not rotated) ------------------ */
function drawGround(pen, g, W, H, gy){
  g.fillStyle=inkLevel(2); g.fillRect(0, gy, W, H-gy);
  pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
  for(let x=W*0.1;x<W;x+=W*0.16){ g.beginPath(); g.moveTo(x,gy); g.lineTo(x-W*0.05,H); g.stroke(); }
  g.globalAlpha=1;
}

const POSE = {
  grip:    { angle:-0.07, pivot:{x:.38,y:.50}, sHang:-0.12, status:"GRIPPED",  progress:.55 },
  lean:    { angle: 0.44, pivot:{x:.46,y:.42}, sHang:-0.06, ground:.88, status:"LEANING",  progress:.4 },
  setdown: { angle: 1.44, pivot:{x:.30,y:.60}, groundBag:{x:.68,y:.78}, ground:.80, status:"SET DOWN", progress:.22 },
  conceal: { angle:-0.05, pivot:{x:.44,y:.48}, sHang:0.02, cloak:true, status:"CONCEALED", progress:.14 },
  discard: { angle: 1.63, pivot:{x:.30,y:.66}, groundBag:{x:.64,y:.82}, ground:.83, discard:true, status:"DISCARDED", progress:.06 },
};

function drawProp(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "grip";
  const P = POSE[mode] || POSE.grip;
  const L = Math.min(W,H)*1.02;
  const G = staffGeom(L);
  const pivot = { x:W*P.pivot.x, y:H*P.pivot.y };
  const ca=Math.cos(P.angle), sa=Math.sin(P.angle);
  // helper: local (x, s) -> world
  const world = (x,s)=>({ x:pivot.x + x*ca - s*sa, y:pivot.y + x*sa + s*ca });

  // ground under the foot / laid staff
  if (P.ground) drawGround(pen, g, W, H, H*P.ground);

  // faint contact shadow beneath the resting kit
  if (!P.cloak){
    const foot = world(0, G.yBot);
    g.fillStyle="rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(foot.x, (P.ground?H*P.ground:foot.y)+6, L*0.05, L*0.014, 0,0,7); g.fill();
  }

  // ---- STAFF (rotated about the grip pivot) ----
  g.save(); g.translate(pivot.x, pivot.y); g.rotate(P.angle);
  drawStaffLocal(pen, g, G);
  g.restore();

  // ---- POUCH ----
  if (P.groundBag){
    // resting / tossed on the ground
    const bx=W*P.groundBag.x, bw=W*0.24, by=H*P.groundBag.y - bw*0.5;
    drawPouch(pen, g, bx, by, bw, { open:false, tilt:P.discard?0.5:0.06 });
  } else {
    // slung on a cord looped over the shaft, hanging by gravity
    const hang = world(0, L*P.sHang);
    const bw = W*0.21;
    const bx = hang.x + bw*0.66, by = hang.y + bw*0.92;   // hangs clear of the shaft/grip
    // cord loop over the shaft, two strands down to the mouth
    g.strokeStyle=inkLevel(THONG); g.lineWidth=4; g.lineCap="round";
    g.beginPath();
    g.moveTo(hang.x-9, hang.y);  g.quadraticCurveTo(bx-bw*0.30, (hang.y+by)/2, bx-bw*0.15, by-bw*0.5);
    g.moveTo(hang.x+11, hang.y); g.quadraticCurveTo(bx+bw*0.10, (hang.y+by)/2, bx+bw*0.15, by-bw*0.5);
    g.stroke();
    g.strokeStyle=INK; g.lineWidth=1.6; g.stroke();
    // loop crossing over the shaft
    pen.paint(()=>{ g.ellipse(hang.x, hang.y, 12, 6, P.angle, 0, 7); }, toneSolid(inkLevel(THONG)), 2.4);
    drawPouch(pen, g, bx, by, bw, { open:false, tilt:0 });
  }

  // ---- CONCEALING CLOAK drape over the lower kit ----
  if (P.cloak){
    const cy=H*0.52;
    pen.paint(()=>{
      g.moveTo(W*0.18, cy);
      g.quadraticCurveTo(W*0.30, cy-H*0.06, W*0.46, cy-H*0.02);
      g.quadraticCurveTo(W*0.64, cy+H*0.02, W*0.80, cy-H*0.02);
      g.lineTo(W*0.86, H*0.98);
      g.quadraticCurveTo(W*0.5, H*0.9, W*0.12, H*0.98);
      g.closePath();
    }, toneSolid(inkLevel(CLOAK)), 5);
    // fold shadows
    g.strokeStyle=inkLevel(CLOAK_D); g.lineWidth=5; g.lineCap="round"; g.globalAlpha=0.85;
    for(const fx of [0.30,0.44,0.58,0.72]){
      g.beginPath(); g.moveTo(W*fx, cy-H*0.01);
      g.quadraticCurveTo(W*(fx-0.02), H*0.72, W*(fx+0.03), H*0.95); g.stroke();
    }
    g.globalAlpha=1;
    // hint of the pouch bulge showing through the cloak base
    pen.seam(()=>{ g.ellipse(W*0.58, H*0.82, W*0.12, H*0.06, 0.1, 0, 7); }, 3);
  }
}

export const asset = {
  id:"prop.beggar-staff-and-bag",
  type:"PROP",
  name:"Beggar Staff and Bag",
  statusWord:"GRIPPED",
  scene:"OD-B13-S05",

  params,
  // back -> front draw order the prop honors
  layers:["ground","shadow","staff-body","staff-shade","knots","grip","cord","pouch","cloak"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'grip' pose; the runtime re-derives them under rotation from the pivot).
  anchors:{
    grip:{x:.42,y:.50},            // the hand's hold on the shaft (the pivot)
    "grip:upper":{x:.41,y:.40},    // higher two-handed hold
    head:{x:.40,y:.16},            // gnarled knob at the top of the staff
    "contact:ground":{x:.44,y:.83},// worn foot where the staff meets the ground
    "cord:hang":{x:.40,y:.34},     // where the pouch cord loops over the shaft
    "pouch:body":{x:.55,y:.60},    // centre of the hanging pouch
    "pouch:mouth":{x:.55,y:.49},   // the drawstring mouth of the pouch
  },
  // collision: a thin oriented capsule for the staff + a box for the pouch
  collision:{ kind:"capsule", a:{x:.40,y:.16}, b:{x:.44,y:.83}, r:.03 },
  zones:{ bounds:{ x0:.18,y0:.14,x1:.82,y1:.86 }, "pouch:box":{ x0:.46,y0:.50,x1:.66,y1:.72 } },
  owner:"odysseus:beggar-disguise",

  states:{
    initial:"grip",
    nodes:{
      grip:    { preview:{ mode:"grip",    status:"GRIPPED",   progress:.55 } },
      lean:    { preview:{ mode:"lean",    status:"LEANING",   progress:.40 } },
      setdown: { preview:{ mode:"setdown", status:"SET DOWN",  progress:.22 } },
      conceal: { preview:{ mode:"conceal", status:"CONCEALED", progress:.14 } },
      discard: { preview:{ mode:"discard", status:"DISCARDED", progress:.06 } },
    },
    edges:[
      ["grip","lean"],["lean","grip"],
      ["grip","setdown"],["setdown","grip"],
      ["grip","conceal"],["conceal","grip"],
      ["lean","setdown"],["setdown","discard"],
      ["grip","discard"],
    ],
  },
  channels:["mode","angle","state","t"],

  preview:()=>({ mode:"grip", status:"GRIPPED", progress:.55, t:0 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision, zones:asset.zones, owner:asset.owner }; },
};
export default asset;
