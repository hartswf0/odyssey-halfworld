/* prop.farm-meal — a humble swineherd's spread: a rough plank TABLE set with
   ROAST PORK portions on a wide platter, two BREAD LOAVES, a WINE CUP, and a
   pair of small DIVIDING PLATTERS for parceling out fair shares.
   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B14-S02): a reusable meal object with three states —
   SET (pork heaped whole on the big platter, loaves stacked, cup full, the two
   share-platters empty), FAIR-SHARE-DIVIDED (the roast parceled into equal
   portions across the two share-platters + the big platter, a dividing knife
   line down the middle, loaves split), EATEN (platters near-bare with a few
   bones + crumbs, cup drained). Wood table is a mid tone; the pork is a darker
   roast with a bright fat-cap highlight; bread + cup surface sit lighter so the
   spread separates in monochrome. Scale, grip/support/contact anchors,
   ownership and collision box declared in 0..1. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  tableTopY:0.400,     // back edge of the table surface (fraction of H)
  tableDepth:0.120,    // perspective depth of the top plank surface
  tableThick:0.050,    // front-edge board thickness
  tableHalfBack:0.380, // half-width at the back edge (fraction of W)
  tableHalfFront:0.450,// half-width at the near edge
  legH:0.290,          // table leg height (fraction of H)
  planks:4,            // plank seams across the top
  ownedBy:"eumaeus:swineherd",
};

const WOOD    = 4;   // table top planks (mid wood)
const WOOD_D  = 5;   // table front board + legs (darker)
const WOOD_E  = 6;   // deep leg shadow / under-board
const GRAIN   = 6;   // plank seam ink
const PLAT    = 3;   // platters (light wood/earthenware)
const PLAT_D  = 5;   // platter hollow / inner shadow
const PORK    = 5;   // roast pork (dark meat)
const PORK_H  = 2;   // pork fat-cap highlight (bright)
const BONE    = 2;   // bones / gnawed remains (light)
const BREAD   = 3;   // bread loaf body
const BREAD_H = 2;   // bread crust highlight
const CUP     = 6;   // wine cup body (dark)
const WINE    = 5;   // wine surface

/* rounded-rect sub-path (no fill/stroke; caller wraps in pen.paint) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* ------------------------------------------------------------------
   THE TABLE — a rough plank top drawn as a perspective trapezoid, a thick
   front board, and two front legs. Dishes rest on the surface baseline. */
function drawTable(pen,g,W,H,cx,topY){
  const hb=W*params.tableHalfBack, hf=W*params.tableHalfFront;
  const depth=H*params.tableDepth, thick=H*params.tableThick;
  const legH=H*params.legH;
  const frontY=topY+depth;

  // legs (behind the front board)
  const legW=W*0.05;
  for(const s of [-1,1]){
    const lx=cx+s*hf*0.86;
    pen.paint(()=>{ g.rect(lx-legW/2, frontY+thick*0.5, legW, legH); }, toneSolid(inkLevel(WOOD_D)), 5);
    pen.seam(()=>{ g.moveTo(lx, frontY+thick*0.6); g.lineTo(lx, frontY+thick*0.6+legH); }, 2.5);
  }
  // top plank surface (trapezoid; back edge narrower for depth)
  pen.paint(()=>{
    g.moveTo(cx-hb, topY);
    g.lineTo(cx+hb, topY);
    g.lineTo(cx+hf, frontY);
    g.lineTo(cx-hf, frontY);
    g.closePath();
  }, toneSolid(inkLevel(WOOD)), 5);
  // plank seams running back->front (perspective fan)
  g.strokeStyle=inkLevel(GRAIN); g.lineCap="round";
  for(let i=1;i<params.planks;i++){
    const f=i/params.planks;
    const xb=lerp(cx-hb,cx+hb,f), xf=lerp(cx-hf,cx+hf,f);
    g.lineWidth=2.5; g.beginPath(); g.moveTo(xb,topY); g.lineTo(xf,frontY); g.stroke();
  }
  // front board (thick, darker)
  pen.paint(()=>{
    g.moveTo(cx-hf, frontY);
    g.lineTo(cx+hf, frontY);
    g.lineTo(cx+hf, frontY+thick);
    g.lineTo(cx-hf, frontY+thick);
    g.closePath();
  }, toneSolid(inkLevel(WOOD_D)), 5);
  // near-edge seam so top plane reads distinct from the board
  pen.seam(()=>{ g.moveTo(cx-hf,frontY); g.lineTo(cx+hf,frontY); }, 3);
  // a couple grain streaks on the front board
  g.strokeStyle=inkLevel(WOOD_E); g.lineWidth=2;
  for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(cx+i*hf*0.5-W*0.04, frontY+thick*0.45); g.lineTo(cx+i*hf*0.5+W*0.04, frontY+thick*0.55); g.stroke(); }
  return { frontY, baseY: topY+depth*0.62 };
}

/* ------------------------------------------------------------------
   A PLATTER — a shallow oval dish resting on baseY. amount>0 heaps meat;
   parcel picks which food (pork portions / bones) sits in it. */
function drawPlatter(pen,g,W,H,cx,baseY,rw,{pork=0,bones=0,divideLine=false}={}){
  const rh=rw*0.34;
  const cy=baseY-rh*0.35;
  // dish outer (shallow saucer)
  pen.paint(()=>{
    g.moveTo(cx-rw, cy);
    g.quadraticCurveTo(cx-rw*0.6, cy+rh*1.7, cx, baseY);
    g.quadraticCurveTo(cx+rw*0.6, cy+rh*1.7, cx+rw, cy);
    g.ellipse(cx, cy, rw, rh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(PLAT)), 5);
  // hollow interior (open mouth)
  pen.paint(()=>{ g.ellipse(cx, cy, rw, rh, 0,0,7); }, toneSolid(inkLevel(PLAT_D)), 3);
  // dividing knife line down the middle of the platter
  if(divideLine){
    g.strokeStyle=INK; g.lineWidth=3; g.setLineDash([9,7]);
    g.beginPath(); g.moveTo(cx, cy-rh*0.9); g.lineTo(cx, cy+rh*0.9); g.stroke();
    g.setLineDash([]);
  }
  // ROAST PORK portions heaped as a mound in the dish (back->front so it stacks)
  if(pork>0.02){
    const lumps=Math.max(2,Math.round(lerp(3,6,clamp(pork,0,1))));
    const heapW=rw*0.78, heapH=rh*lerp(1.1,2.0,pork);
    const arr=[];
    for(let i=0;i<lumps;i++){
      const a=(i*2.399); // spread lumps over the mound deterministically
      const rr2=(0.15+0.6*((i*0.37)%1));
      const lx=cx+Math.cos(a)*heapW*rr2*0.9;
      const ly=cy-rh*0.2 - (0.35+0.6*((i*0.53)%1))*heapH*0.8;
      const lr=rw*lerp(0.24,0.32,pork)*(0.8+0.4*((i*0.29)%1));
      arr.push({lx,ly,lr});
    }
    arr.sort((p,q)=>p.ly-q.ly); // draw back lumps first
    for(const {lx,ly,lr} of arr){
      pen.paint(()=>{ g.ellipse(lx, ly, lr, lr*0.78, 0,0,7); }, toneSolid(inkLevel(PORK)), 4);
      // bright fat-cap highlight
      pen.fillPath(()=>{ g.ellipse(lx-lr*0.18, ly-lr*0.30, lr*0.52, lr*0.28, 0,0,7); }, inkLevel(PORK_H));
      // a scored crackling seam
      pen.seam(()=>{ g.moveTo(lx-lr*0.55, ly+lr*0.05); g.lineTo(lx+lr*0.55, ly-lr*0.05); }, 2);
    }
  }
  // GNAWED BONES / remains (eaten state)
  if(bones>0.02){
    g.strokeStyle=inkLevel(BONE); g.lineWidth=Math.max(3,rw*0.05); g.lineCap="round";
    const n=2+Math.round(bones*2);
    for(let i=0;i<n;i++){
      const t=i/(n-1||1)-0.5;
      const bx=cx+t*rw*0.7, by=cy+rh*0.1+t*rh*0.4, ang=0.4+i*0.9;
      g.beginPath();
      g.moveTo(bx-Math.cos(ang)*rw*0.22, by-Math.sin(ang)*rw*0.10);
      g.lineTo(bx+Math.cos(ang)*rw*0.22, by+Math.sin(ang)*rw*0.10);
      g.stroke();
      // knuckle blobs at the ends
      g.fillStyle=inkLevel(BONE);
      g.beginPath(); g.arc(bx-Math.cos(ang)*rw*0.22, by-Math.sin(ang)*rw*0.10, rw*0.045,0,7); g.fill();
      g.beginPath(); g.arc(bx+Math.cos(ang)*rw*0.22, by+Math.sin(ang)*rw*0.10, rw*0.045,0,7); g.fill();
    }
  }
  // near-rim lip highlight
  pen.paint(()=>{ g.ellipse(cx, cy, rw, rh, 0, 0.06, Math.PI-0.06); }, toneSolid(inkLevel(PLAT-1)), 2.5);
  return { cx, cy };
}

/* ------------------------------------------------------------------
   A BREAD LOAF — a rounded rustic loaf with a scored cross on top.
   whole=1 full loaf; whole<1 a torn/half loaf. */
function drawLoaf(pen,g,W,H,cx,baseY,lw,whole){
  const lh=lw*0.62*lerp(0.7,1,whole);
  const cy=baseY-lh*0.5;
  const wSpan=lw*lerp(0.6,1,whole);
  // loaf body (domed)
  pen.paint(()=>{
    g.moveTo(cx-wSpan, baseY);
    g.bezierCurveTo(cx-wSpan, cy-lh*0.9, cx+wSpan, cy-lh*0.9, cx+wSpan, baseY);
    g.closePath();
  }, toneSolid(inkLevel(BREAD)), 4);
  // crust highlight
  pen.fillPath(()=>{ g.ellipse(cx-wSpan*0.2, cy-lh*0.2, wSpan*0.55, lh*0.4, 0,0,7); }, inkLevel(BREAD_H));
  // scored cross on top
  g.strokeStyle=inkLevel(GRAIN); g.lineWidth=2.5; g.lineCap="round";
  g.beginPath(); g.moveTo(cx-wSpan*0.5, cy-lh*0.35); g.lineTo(cx+wSpan*0.5, cy-lh*0.1); g.stroke();
  g.beginPath(); g.moveTo(cx-wSpan*0.35, cy+lh*0.05); g.lineTo(cx+wSpan*0.35, cy-lh*0.45); g.stroke();
  // torn face when split
  if(whole<0.9){
    pen.seam(()=>{ g.moveTo(cx+wSpan, baseY); g.lineTo(cx+wSpan*0.9, cy-lh*0.6); }, 2.5);
  }
}

/* ------------------------------------------------------------------
   THE WINE CUP — a simple footed wooden cup; fill raises a wine surface. */
function drawCup(pen,g,W,H,cx,baseY,cw,fill){
  const rw=cw*0.5, rh=rw*0.4;
  const bodyH=cw*0.8;
  const rimY=baseY-bodyH;
  // foot
  pen.paint(()=>{ g.ellipse(cx, baseY, cw*0.34, cw*0.13, 0,0,7); }, toneSolid(inkLevel(CUP-1)), 4);
  // body (slightly tapered beaker)
  pen.paint(()=>{
    g.moveTo(cx-rw, rimY);
    g.lineTo(cx-rw*0.72, baseY-cw*0.08);
    g.quadraticCurveTo(cx, baseY, cx+rw*0.72, baseY-cw*0.08);
    g.lineTo(cx+rw, rimY);
    g.ellipse(cx, rimY, rw, rh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(CUP)), 5);
  // dark hollow interior
  pen.paint(()=>{ g.ellipse(cx, rimY, rw, rh, 0,0,7); }, toneSolid(inkLevel(7)), 3);
  // wine surface
  if(fill>0.02){
    const sr=rw*lerp(0.55,0.9,fill);
    const sy=rimY+rh*(1-fill)*0.4;
    pen.paint(()=>{ g.ellipse(cx, sy, sr, sr*0.4, 0,0,7); }, toneSolid(inkLevel(WINE)), 3);
  }
  // near-rim highlight
  pen.paint(()=>{ g.ellipse(cx, rimY, rw, rh, 0, 0.06, Math.PI-0.06); }, toneSolid(inkLevel(CUP-2)), 2.5);
  return { rimY };
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const divided = st.divided ?? 0;   // 0 = one heap, 1 = parceled into fair shares
  const eaten   = st.eaten   ?? 0;   // 0 = full spread, 1 = bones + crumbs
  const cx=W*0.5;
  const topY=H*params.tableTopY;

  // ground shadow under the table
  g.fillStyle=`rgba(0,0,0,0.10)`;
  g.beginPath(); g.ellipse(cx, H*0.955, W*params.tableHalfFront*1.05, H*0.02, 0,0,7); g.fill();

  // TABLE
  const T=drawTable(pen,g,W,H,cx,topY);
  const baseY=T.baseY;

  const porkFull = clamp(1-eaten,0,1);

  if(divided<0.5){
    // ---- SET: one big central pork platter, loaves left, cup right ----
    // bread loaves (left, offset pair)
    drawLoaf(pen,g,W,H, cx-W*0.340, baseY-H*0.004, W*0.095, 1-eaten*0.6);
    drawLoaf(pen,g,W,H, cx-W*0.285, baseY+H*0.034, W*0.082, 1-eaten*0.6);
    // main roast platter (centre)
    drawPlatter(pen,g,W,H, cx+W*0.020, baseY+H*0.018, W*0.190,
      { pork:porkFull, bones:eaten>0.5?eaten:0 });
    // wine cup (right)
    drawCup(pen,g,W,H, cx+W*0.330, baseY+H*0.018, W*0.115, clamp(1-eaten,0,1));
  } else {
    // ---- FAIR-SHARE-DIVIDED: three portions parceled across platters ----
    const share=porkFull*0.7;
    // two small share platters front-left + front-right, main platter centre-back
    drawPlatter(pen,g,W,H, cx-W*0.02, baseY-H*0.030, W*0.150,
      { pork:share, bones:eaten>0.5?eaten:0, divideLine:eaten<0.5 });
    drawPlatter(pen,g,W,H, cx-W*0.290, baseY+H*0.030, W*0.130,
      { pork:share, bones:eaten>0.5?eaten:0 });
    drawPlatter(pen,g,W,H, cx+W*0.290, baseY+H*0.030, W*0.130,
      { pork:share, bones:eaten>0.5?eaten:0 });
    // split loaves flanking
    drawLoaf(pen,g,W,H, cx-W*0.120, baseY+H*0.040, W*0.070, 0.6-eaten*0.3);
    drawLoaf(pen,g,W,H, cx+W*0.120, baseY+H*0.040, W*0.070, 0.6-eaten*0.3);
    // wine cup far right
    drawCup(pen,g,W,H, cx+W*0.360, baseY+H*0.028, W*0.100, clamp(1-eaten,0,1));
  }

  // faint crumb scatter on the boards when eaten
  if(eaten>0.4){
    g.fillStyle=inkLevel(BONE);
    for(let i=0;i<10;i++){
      const rx=cx+(i/9-0.5)*W*0.6, ry=baseY+H*0.02+((i*37)%13)/13*H*0.03;
      g.beginPath(); g.arc(rx,ry,Math.max(1.5,W*0.006*((i%3)+1)/3),0,7); g.fill();
    }
  }
}

export const asset = {
  id:"prop.farm-meal",
  type:"PROP",
  name:"Farm Meal",
  statusWord:"SET",
  scene:"OD-B14-S02",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","table-legs","table-top","planks","table-board",
          "platters","pork","bones","loaves","cup","wine","crumbs"],
  // normalized 0..1 anchors: support / contact / grip / serving points
  anchors:{
    "support:table-surface":{x:.50,y:.600},  // the plane dishes rest on
    "contact:table-foot-l":{x:.11,y:.955},   // left leg on the ground
    "contact:table-foot-r":{x:.89,y:.955},   // right leg on the ground
    "place:platter-main":{x:.48,y:.610},     // the big roast platter
    "place:share-l":{x:.21,y:.640},          // left fair-share platter
    "place:share-r":{x:.79,y:.640},          // right fair-share platter
    "place:loaves":{x:.16,y:.600},           // the bread
    "grip:cup":{x:.82,y:.610},               // where a hand takes the wine cup
    "grip:table-edge":{x:.50,y:.630},        // near edge to lean on / clear
  },
  // collision box (AABB in 0..1) for placement / pathing
  zones:{ bounds:{ x0:.05,y0:.40,x1:.95,y1:.96 }, footprint:{ x0:.08,y0:.62,x1:.92,y1:.68 } },
  ownership:{ owner:"Eumaeus the swineherd", context:"guest-hospitality", kind:"meal" },
  states:{
    initial:"set",
    nodes:{
      set:            { preview:{ divided:0, eaten:0, status:"SET",     progress:.15 } },
      "fair-share-divided":{ preview:{ divided:1, eaten:0, status:"DIVIDED", progress:.5 } },
      eaten:          { preview:{ divided:1, eaten:1, status:"EATEN",   progress:.95 } },
    },
    edges:[["set","fair-share-divided"],["fair-share-divided","eaten"],
           ["eaten","set"],["fair-share-divided","set"]],
  },
  channels:["divided","eaten"],

  preview:()=>({ divided:0, eaten:0, status:"SET", progress:.15 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
