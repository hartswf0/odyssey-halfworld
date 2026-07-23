/* prop.cheese-racks-and-milk-vessels — a food-production set: a WOODEN RACK of
   round cheese wheels standing on two shelves, and a ROW OF PAILS / whey buckets
   ranged along the foreground. A reusable dairy-store object.
   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B09-S05) — six states:
     STOCKED  full rack, pails brimming, everything upright and orderly.
     HANDLED  one wheel lifted off the rack and carried in front (grip shown),
              its slot left empty.
     EATEN    a front wheel cut — a wedge removed, pale interior + dark rind ring.
     MILKED   a bright stream of fresh milk pouring into the centre pail, brimming.
     CURDLED  the milk turned: lumpy curds heaped over a darker whey ring.
     SPILLED  the right pail knocked over, milk pooled across the ground.
   The wood frame + pail staves are the dark metals of tone; the cheese sides are
   a mid tone, cheese tops + milk the brightest (near paper) so the food reads.
   Scale, grip/support/contact anchors, ownership and collision box in 0..1. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  postX:[0.135, 0.865],   // rack upright posts (fraction of W)
  postW:0.030,
  rackTopY:0.150,         // top cross-beam (fraction of H)
  shelfY:[0.395, 0.615],  // cheese base-lines on the two shelves
  cols:[0.315, 0.500, 0.685],
  wheelR:0.084,           // cheese wheel radius (fraction of W)
  pailY:0.880,            // pail base-line (fraction of H)
  pailX:[0.270, 0.500, 0.730],
  pailW:0.200, pailH:0.170,
  ownedBy:"dairy:cyclops-cave-store",
};

/* ---- tones (inkLevel 0 paper .. 7 full ink) ---- */
const POST   = 6;   // rack uprights + top beam (dark wood)
const SHELF  = 5;   // shelf beams
const CH_SIDE= 3;   // cheese wheel curved side (mid)
const CH_TOP = 2;   // cheese wheel top face (light)
const RIND   = 5;   // cheese rind seams / cut ring (dark)
const CH_IN  = 1;   // cut interior (near paper, pale cheese)
const PAIL   = 4;   // pail staves (wood)
const PAIL_D = 6;   // pail hoops / shadow side
const PAIL_IN= 6;   // pail dark interior
const MILK   = 1;   // milk surface (brightest)
const CURD   = 2;   // curds (bright, faintly heaped)
const WHEY   = 4;   // separated whey ring (darker liquid)
const SPILL  = 2;   // spilled milk pool

/* rounded-rect sub-path */
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
   ONE CHEESE WHEEL — a squat cylinder standing on its flat face, seen a
   little from above: a light elliptical top, a mid curved side, a dark rind.
   cut>0 removes a front wedge, showing the pale interior + dark rind ring. */
function drawWheel(pen,g,W,cx,baseY,r,cut){
  const ry  = r*0.34;              // top/bottom ellipse squash
  const hh  = r*0.88;              // wheel height
  const topCy = baseY - hh;

  // silhouette (left side, bottom front cap, right side, back top cap)
  pen.paint(()=>{
    g.moveTo(cx-r, topCy);
    g.lineTo(cx-r, baseY);
    g.ellipse(cx, baseY, r, ry, 0, Math.PI, 0, true);   // bottom front bulge
    g.lineTo(cx+r, topCy);
    g.ellipse(cx, topCy, r, ry, 0, 0, Math.PI, true);   // back rim of top
    g.closePath();
  }, toneSolid(inkLevel(CH_SIDE)), 5);

  // rind bands wrapping the side (curved seams)
  for(const f of [0.34, 0.68]){
    const yy = topCy + hh*f;
    pen.seam(()=>{ g.ellipse(cx, yy, r, ry, 0, 0.06, Math.PI-0.06); }, 3);
  }

  // top face (light disc)
  pen.paint(()=>{ g.ellipse(cx, topCy, r, ry, 0, 0, 7); }, toneSolid(inkLevel(CH_TOP)), 4);

  if (cut > 0.02){
    // a wedge cut from the front-right of the top face + the notch into the side
    const a0 = 0.10*Math.PI, a1 = 0.62*Math.PI;   // front sector (canvas y-down)
    const p0 = { x:cx + r*Math.cos(a0), y:topCy + ry*Math.sin(a0) };
    const p1 = { x:cx + r*Math.cos(a1), y:topCy + ry*Math.sin(a1) };
    // dark sector on the top face (the exposed cut plane pit)
    pen.paint(()=>{
      g.moveTo(cx, topCy);
      g.lineTo(p0.x, p0.y);
      g.ellipse(cx, topCy, r, ry, 0, a0, a1, false);
      g.closePath();
    }, toneSolid(inkLevel(CH_IN)), 3);
    // the vertical cut faces dropping to the bottom (pale interior wedge)
    pen.paint(()=>{
      g.moveTo(cx, topCy);
      g.lineTo(cx, baseY);
      g.lineTo(p1.x, baseY);
      g.lineTo(p1.x, p1.y);
      g.closePath();
    }, toneSolid(inkLevel(CH_IN)), 3);
    pen.paint(()=>{
      g.moveTo(cx, topCy);
      g.lineTo(cx, baseY);
      g.lineTo(p0.x, baseY);
      g.lineTo(p0.x, p0.y);
      g.closePath();
    }, toneSolid(inkLevel(CH_IN+1)), 3);
    // dark rind ring visible on the cut edge
    pen.seam(()=>{ g.moveTo(p0.x,p0.y); g.lineTo(p0.x,baseY); }, 3);
    pen.seam(()=>{ g.moveTo(p1.x,p1.y); g.lineTo(p1.x,baseY); }, 3);
  }
}

/* ------------------------------------------------------------------
   ONE PAIL — a tapered wooden bucket with staves, two hoops, an arched
   handle, a dark interior and (milk>0) a bright surface. curdle heaps curds
   over a whey ring. Drawn in a LOCAL frame: base centre at origin, up = -y. */
function drawPail(pen,g,W,H,w,h,milk,curdle,t){
  const topHW=w*0.50, botHW=w*0.40, topY=-h, ry=w*0.16;

  // handle (arched over the mouth, behind the rim)
  pen.limb(()=>{
    g.moveTo(-topHW*0.86, topY+ry*0.2);
    g.quadraticCurveTo(0, topY-h*0.34, topHW*0.86, topY+ry*0.2);
  }, toneSolid(inkLevel(PAIL_D)), Math.max(3,w*0.030));

  // body (tapered staves)
  pen.paint(()=>{
    g.moveTo(-topHW, topY);
    g.lineTo(topHW, topY);
    g.lineTo(botHW, 0);
    g.ellipse(0, 0, botHW, ry*0.8, 0, 0, Math.PI, false); // rounded bottom
    g.closePath();
  }, toneSolid(inkLevel(PAIL)), 5);

  // vertical stave seams
  for(let i=-2;i<=2;i++){
    const fx=i/2.6;
    pen.seam(()=>{ g.moveTo(topHW*fx, topY+ry*0.5); g.lineTo(botHW*fx, -h*0.04); }, 2.5);
  }
  // two hoops
  for(const f of [0.16, 0.74]){
    const yy=topY+h*f, hw=lerp(topHW,botHW,f);
    pen.paint(()=>{ rr(g, -hw, yy-h*0.018, hw*2, h*0.036, h*0.018); }, toneSolid(inkLevel(PAIL_D)), 3);
  }

  // mouth interior (dark)
  pen.paint(()=>{ g.ellipse(0, topY, topHW, ry, 0, 0, 7); }, toneSolid(inkLevel(PAIL_IN)), 4);

  // contents
  if (milk>0.02){
    const sy = topY + h*(1-milk)*0.18;          // surface sits just below the rim
    const sr = lerp(botHW, topHW, milk);
    if (curdle>0.5){
      // whey ring (darker liquid) then heaped curds (bright lumps)
      pen.paint(()=>{ g.ellipse(0, sy, sr, ry*0.82, 0, 0, 7); }, toneSolid(inkLevel(WHEY)), 3);
      g.fillStyle=inkLevel(CURD);
      const seed=(t*7|0);
      for(let i=0;i<11;i++){
        const a=(i*1.7)%(Math.PI*2), rr2=sr*(0.15+0.6*((i*0.37)%1));
        const lx=Math.cos(a)*rr2*0.9, ly=Math.sin(a)*rr2*0.42 - h*0.02;
        const lr=sr*(0.16+0.12*((i*0.53)%1));
        g.beginPath(); g.ellipse(lx, sy+ly, lr, lr*0.7, 0,0,7); g.fill();
      }
      // a couple of dark curd shadows for lumpiness
      g.strokeStyle=INK; g.lineWidth=2;
      for(let i=0;i<5;i++){ const lx=(i-2)*sr*0.32; g.beginPath(); g.ellipse(lx, sy-h*0.01, sr*0.15, sr*0.1,0,0,7); g.stroke(); }
    } else {
      pen.paint(()=>{ g.ellipse(0, sy, sr, ry*0.86, 0, 0, 7); }, toneSolid(inkLevel(MILK)), 3);
      // faint highlight crescent
      pen.paint(()=>{ g.ellipse(-sr*0.18, sy-ry*0.12, sr*0.5, ry*0.32, 0, 0, 7); }, toneSolid(inkLevel(0)), 2);
    }
  }
  // near-rim highlight so the wood mouth reads
  pen.paint(()=>{ g.ellipse(0, topY, topHW, ry, 0, 0.05, Math.PI-0.05); }, toneSolid(inkLevel(PAIL-1)), 2.5);
  return { topHW, topY, ry };
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const stock   = st.stock   ?? 1;   // (reserved) fill fraction of the rack
  const handled = st.handled ?? 0;   // one wheel lifted to the front
  const cut     = st.cut     ?? 0;   // a front wheel wedged / eaten
  const milk    = st.milk    ?? 0.8; // pail fill level
  const stream  = st.stream  ?? 0;   // milking stream into the centre pail
  const curdle  = st.curdle  ?? 0;   // milk turned to curds
  const spill   = st.spill   ?? 0;   // right pail knocked over
  const t       = st.t       ?? 0;

  const postW = W*params.postW;
  const rackTopY = H*params.rackTopY;
  const shelfY = params.shelfY.map(f=>f*H);
  const cols = params.cols.map(f=>f*W);
  const r = W*params.wheelR;
  const [pL,pR] = params.postX.map(f=>f*W);

  // ---- ground shadow band under the whole set ----
  g.fillStyle="rgba(0,0,0,0.07)";
  g.beginPath(); g.ellipse(W*0.5, H*params.pailY+H*0.018, W*0.46, H*0.020, 0,0,7); g.fill();

  // ---- RACK FRAME: two uprights + top beam + two shelf beams (behind cheese) ----
  const rackBotY = shelfY[1]+H*0.012;
  // faint back panel so the rack reads as a solid store, not an empty box
  g.fillStyle=inkLevel(1);
  g.fillRect(pL-postW*0.2, rackTopY, (pR-pL)+postW*0.4, rackBotY-rackTopY);
  pen.paint(()=>{ g.rect(pL-postW/2, rackTopY, postW, rackBotY-rackTopY); }, toneSolid(inkLevel(POST)), 5);
  pen.paint(()=>{ g.rect(pR-postW/2, rackTopY, postW, rackBotY-rackTopY); }, toneSolid(inkLevel(POST)), 5);
  // top cross beam
  pen.paint(()=>{ g.rect(pL-postW*0.7, rackTopY, (pR-pL)+postW*1.4, H*0.030); }, toneSolid(inkLevel(POST)), 5);
  // shelf beams (the cheeses sit on top of these)
  for(const sy of shelfY){
    pen.paint(()=>{ g.rect(pL-postW*0.4, sy, (pR-pL)+postW*0.8, H*0.024); }, toneSolid(inkLevel(SHELF)), 5);
    pen.seam(()=>{ g.moveTo(pL-postW*0.4, sy+H*0.024); g.lineTo(pR+postW*0.4, sy+H*0.024); }, 2.5);
  }

  // ---- CHEESE WHEELS on the shelves ----
  // slot map: [shelf, col]; the front-centre bottom slot (shelf1,col1) is the
  // one that gets handled/cut. drawn back shelf first, then front shelf.
  const emptied = handled>0.5 ? "1,1" : null;   // bottom-centre slot vacated when carried
  for(let s=0;s<2;s++){
    for(let c=0;c<3;c++){
      const key = `${s},${c}`;
      if (key===emptied) continue;
      const isCut = (s===1 && c===1 && cut>0.5);
      drawWheel(pen,g,W, cols[c], shelfY[s], r, isCut?1:0);
    }
  }

  // ---- HANDLED wheel carried out in front (with grip) ----
  if (handled>0.5){
    const hx=W*0.500, hy=H*0.775;
    drawWheel(pen,g,W, hx, hy, r*1.02, 0);
    // a suggestion of the carrying grip: two short bracket ticks at the sides
    g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
    g.beginPath(); g.moveTo(hx-r*1.05, hy-r*0.5); g.lineTo(hx-r*1.28, hy-r*0.5); g.stroke();
    g.beginPath(); g.moveTo(hx+r*1.05, hy-r*0.5); g.lineTo(hx+r*1.28, hy-r*0.5); g.stroke();
  }

  // ---- PAILS in the foreground row ----
  const pw=W*params.pailW, ph=H*params.pailH, pby=H*params.pailY;
  const pxs=params.pailX.map(f=>f*W);
  // left + centre pails upright
  for(let i=0;i<2;i++){
    const cx=pxs[i];
    const isCentre = (i===1);
    g.save(); g.translate(cx, pby);
    drawPail(pen,g,W,H, pw, ph, isCentre?Math.min(1,milk+stream*0.2):milk, curdle, t);
    g.restore();
  }

  // ---- MILKING STREAM into the centre pail ----
  if (stream>0.02){
    const cx=pxs[1], topY=pby-ph;
    const sx=cx - pw*0.06, sy0=topY-H*0.20;   // stream starts above the mouth
    const wob=Math.sin(t*4)*W*0.006;
    pen.paint(()=>{
      const wpx=W*0.012*stream;
      g.moveTo(sx-wpx, sy0);
      g.quadraticCurveTo(sx+wob-wpx, (sy0+topY)/2, cx-pw*0.02-wpx, topY-H*0.006);
      g.lineTo(cx-pw*0.02+wpx, topY-H*0.006);
      g.quadraticCurveTo(sx+wob+wpx, (sy0+topY)/2, sx+wpx, sy0);
      g.closePath();
    }, toneSolid(inkLevel(MILK)), 3);
    // splash ticks at the rim
    g.strokeStyle=inkLevel(PAIL-1); g.lineWidth=2; g.lineCap="round";
    for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(cx+i*W*0.02, topY); g.lineTo(cx+i*W*0.03, topY-H*0.012); g.stroke(); }
  }

  // ---- RIGHT PAIL: upright, OR knocked over + pooled (spill) ----
  {
    const cx=pxs[2];
    if (spill>0.5){
      // milk pool spreading on the ground toward the right
      pen.paint(()=>{ g.ellipse(cx+W*0.06, pby+H*0.006, pw*0.62, H*0.028, 0,0,7); }, toneSolid(inkLevel(SPILL)), 4);
      pen.paint(()=>{ g.ellipse(cx+W*0.02, pby+H*0.004, pw*0.34, H*0.016, 0,0,7); }, toneSolid(inkLevel(0)), 2);
      // the pail lying on its side (rotated ~80deg, mouth toward the pool)
      g.save();
      g.translate(cx-pw*0.10, pby-ph*0.30);
      g.rotate(Math.PI*0.46);
      drawPail(pen,g,W,H, pw, ph, 0.12, 0, t);   // mostly empty, tipped
      g.restore();
    } else {
      g.save(); g.translate(cx, pby);
      drawPail(pen,g,W,H, pw, ph, milk, curdle, t);
      g.restore();
    }
  }
}

export const asset = {
  id:"prop.cheese-racks-and-milk-vessels",
  type:"PROP",
  name:"Cheese Racks and Milk Vessels",
  statusWord:"STOCKED",
  scene:"OD-B09-S05",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","rack-posts","rack-beams","shelves","cheese-back","cheese-front",
          "handled-wheel","pails","milk-stream","spill"],
  // normalized 0..1 anchors: grip / support / contact / pour target
  anchors:{
    "grip:wheel-front":{x:.500,y:.760},   // where a hand takes the carried wheel
    "support:shelf-top":{x:.500,y:.420},  // top shelf cheese rests here
    "support:shelf-bot":{x:.500,y:.660},  // bottom shelf cheese rests here
    "slot:cut-wheel":{x:.500,y:.640},     // the wheel that gets wedged / eaten
    "grip:pail-handle":{x:.500,y:.680},   // arched handle of the centre pail
    "rim:pail-centre":{x:.500,y:.710},    // mouth of the centre pail (milk target)
    "target:milk":{x:.500,y:.710},        // where the milking stream lands
    "contact:ground":{x:.500,y:.900},     // base of the whole set on the floor
    "spill:pool":{x:.790,y:.888},         // spilled milk pool centre
  },
  // collision box (AABB in 0..1) for placement / pathing
  zones:{ bounds:{ x0:.10,y0:.10,x1:.92,y1:.92 },
          rack:{ x0:.12,y0:.10,x1:.88,y1:.68 },
          pails:{ x0:.14,y0:.70,x1:.86,y1:.90 } },
  ownership:{ owner:"the household / herdsman", context:"dairy food-production store", kind:"stores" },
  states:{
    initial:"stocked",
    nodes:{
      stocked:{ preview:{ stock:1, handled:0, cut:0, milk:0.85, stream:0, curdle:0, spill:0, status:"STOCKED", progress:.12 } },
      handled:{ preview:{ stock:1, handled:1, cut:0, milk:0.85, stream:0, curdle:0, spill:0, status:"HANDLED", progress:.30 } },
      eaten:  { preview:{ stock:1, handled:0, cut:1, milk:0.70, stream:0, curdle:0, spill:0, status:"EATEN",   progress:.46 } },
      milked: { preview:{ stock:1, handled:0, cut:0, milk:0.95, stream:1, curdle:0, spill:0, status:"MILKED",  progress:.62 } },
      curdled:{ preview:{ stock:1, handled:0, cut:0, milk:0.90, stream:0, curdle:1, spill:0, status:"CURDLED", progress:.80 } },
      spilled:{ preview:{ stock:1, handled:0, cut:0, milk:0.35, stream:0, curdle:0, spill:1, status:"SPILLED", progress:.96 } },
    },
    edges:[["stocked","handled"],["stocked","milked"],["handled","eaten"],
           ["milked","curdled"],["curdled","spilled"],["handled","stocked"],
           ["eaten","stocked"],["spilled","stocked"]],
  },
  channels:["stock","handled","cut","milk","stream","curdle","spill","t"],

  preview:()=>({ stock:1, handled:0, cut:0, milk:0.85, stream:0, curdle:0, spill:0, t:0, status:"STOCKED", progress:.12 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
