/* prop.bag-of-winds — Aeolus' gift to Odysseus: a fat oxhide bag with all the
   storm-winds bound inside, its gathered neck cinched shut with a bright
   silver cord. PROP asset. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone. Do NOT
   pre-dither.
   Scene function (OD-B10-S01): one reusable oxhide container, bound neck, with
   five states — SEALED (plump, calm, cord bound tight), BULGING (over-full,
   straining, radial pressure lines across the taut hide), TAMPERED (silver
   cord half-undone, loose tail, first wisps of wind leaking), OPENED (neck
   flung wide, the winds erupting out in scrolled swirls) and EMPTY (deflated,
   slack, creased, flattened base, gaping mouth).
   fill drives the belly bulge; pressure / tamper / windOut / sag flags carry
   the rest, animated over t. Grip / mouth / contact anchors + a collision box
   are declared in 0..1 space. Ownership: Aeolus' gift, held by Odysseus. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  cordWraps:3,        // number of silver-cord turns cinching the gathered neck
  seams:2,            // stitched hide seams running down the flanks
  windCurls:5,        // scrolled gusts drawn when the mouth erupts
};

const HIDE   = 4;    // oxhide body (thick tanned leather, mid tone)
const HIDE_D = 6;    // shaded near-flank / underside of the hide
const HIDE_L = 2;    // lit crown of the belly
const NECK   = 5;    // gathered / bunched neck fabric (darker, in shadow of folds)
const CORD   = 2;    // silver cord highlight — bright, reads light with a hard contour
const CORD_D = 5;    // shaded underside of a cord turn (strong, so the wraps read)
const MOUTH  = 7;    // open dark mouth of the bag
const WIND   = 3;    // erupting wind swirl body (light-mid, airy)
const WIND_D = 5;    // core of a gust curl

/* ------------------------------------------------------------------
   THE OXHIDE BAG — one fat rounded hide sack drawn in a LOCAL frame with the
   resting base centre at (cx, cy) and up = -y.
     fill 0 = slack/empty .. 1 = taut/over-full  (drives belly bulge + base spread)
     mouthOpen  false = gathered shut .. true = gaping dark mouth
     sag  true = deflated: extra fold creases + drooping flattened base
   Returns the world-space mouth centre (for wind eruption / anchors).
   ------------------------------------------------------------------ */
function drawBag(pen, g, cx, cy, w, h, { fill=1, mouthOpen=false, sag=false }={}){
  const bHalf  = w*(0.30 + 0.30*fill);          // belly half-width (very fat when full)
  const shHalf = w*(0.16 + 0.11*fill);          // shoulder half-width
  const nHalf  = w*0.10;                          // gathered neck half-width
  const base   = w*(0.20 + 0.16*(1-fill));       // rounded base contact half-width (spreads when empty)
  const yBulge = -h*0.40, yShoulder=-h*0.60, yNeck=-h*0.70;
  const yGather= -h*0.74, yMouth=-h*0.84;
  const drop   = sag ? h*0.10 : h*0.05;          // how far the rounded base sags below origin

  const mouth = { x: cx, y: cy + yMouth };        // no rotation — bag stands upright

  g.save(); g.translate(cx,cy);

  const body = (gg)=>{
    gg.moveTo(-base, drop*0.2);
    gg.quadraticCurveTo(-bHalf*1.02, yBulge, -shHalf, yShoulder);   // left flank up (very round)
    gg.lineTo(-nHalf, yNeck);
    gg.lineTo( nHalf, yNeck);
    gg.lineTo( shHalf, yShoulder);
    gg.quadraticCurveTo( bHalf*1.02, yBulge,  base, drop*0.2);       // right flank down
    gg.quadraticCurveTo( 0, drop, -base, drop*0.2);                 // rounded / sagging base
    gg.closePath();
  };

  // ---- BODY (the fat oxhide silhouette) ----
  pen.paint(()=>body(g), toneSolid(inkLevel(HIDE)), 6);

  // lit crown of the belly (a compact soft light patch so it reads as round)
  pen.paint(()=>{
    g.moveTo(-shHalf*0.42, yShoulder*0.98);
    g.quadraticCurveTo(-bHalf*0.5, yBulge*1.02, -bHalf*0.16, yBulge*0.7);
    g.quadraticCurveTo(-bHalf*0.24, yShoulder*0.92, -shHalf*0.42, yShoulder*0.98);
    g.closePath();
  }, toneSolid(inkLevel(HIDE_L)), 0);

  // shaded near-flank: a crescent hugging the lower-right hide edge
  pen.paint(()=>{
    g.moveTo(bHalf*0.6, yBulge*0.55);
    g.quadraticCurveTo(bHalf*1.0, yBulge*0.9, base*0.9, drop*0.15);
    g.quadraticCurveTo(bHalf*0.62, yBulge*0.35, bHalf*0.6, yBulge*0.55);
    g.closePath();
  }, toneSolid(inkLevel(HIDE_D)), 0);

  // ---- flank seams (stitched hide): short curved seams hugging each flank,
  //      following the round belly edge so they never read as a straight ledge ----
  for(let s=0;s<params.seams;s++){
    const sx = (s===0? -1: 1);
    const seamPts = [];
    for(let k=0;k<=6;k++){ const tt=k/6;
      const yy = lerp(-h*0.22, yShoulder*0.9, tt);
      const xx = sx*lerp(bHalf*0.6, shHalf*0.8, tt);   // stay inside the silhouette
      seamPts.push({x:xx,y:yy});
    }
    pen.seam(()=>{ g.moveTo(seamPts[0].x, seamPts[0].y);
      for(const p of seamPts) g.lineTo(p.x,p.y); }, 2.4);
    // short stitch ticks perpendicular to the seam
    g.strokeStyle=INK; g.lineWidth=1.6;
    for(let k=1;k<6;k++){ const p=seamPts[k];
      g.beginPath(); g.moveTo(p.x-sx*5, p.y-2); g.lineTo(p.x+sx*5, p.y+2); g.stroke(); }
  }

  // ---- fold creases: clearly drooping short arcs on the belly (never spanning
  //      the full width, so the hide reads soft, not boxy). Deeper when slack. ----
  const nc = 2 + (sag?3:0);
  for(let i=0;i<nc;i++){
    const t = (i+1)/(nc+1);
    const yy = lerp(yShoulder*0.55, yBulge*0.55, t);
    const hw = bHalf*(0.42 - 0.05*i) * (sag? 1.0 : 0.9);
    const dz = sag ? h*0.06 : h*0.035;
    pen.seam(()=>{ g.moveTo(-hw, yy); g.quadraticCurveTo(0, yy+dz, hw, yy); }, 2.2);
  }

  // ---- GATHERED NECK bunched above the shoulder ----
  pen.paint(()=>{
    g.moveTo(-nHalf, yNeck);
    g.quadraticCurveTo(-nHalf*1.15, yGather, -nHalf*0.6, yMouth);
    g.lineTo( nHalf*0.6, yMouth);
    g.quadraticCurveTo( nHalf*1.15, yGather,  nHalf, yNeck);
    g.closePath();
  }, toneSolid(inkLevel(NECK)), 5);
  // vertical gather folds in the neck
  g.strokeStyle=INK; g.lineWidth=1.8;
  for(let k=-1;k<=1;k++){ g.beginPath();
    g.moveTo(k*nHalf*0.5, yNeck); g.lineTo(k*nHalf*0.4, yMouth); g.stroke(); }

  g.restore();
  return { mouth, nHalf, yGather, yMouth };
}

/* SILVER CORD cinch — a bright band of turns wrapped around the gathered neck.
   loose>0 undoes the topmost turns and lets a tail dangle (tampered). */
function drawCord(pen, g, cx, cy, w, h, nHalf, yGather, loose=0){
  const wraps = params.cordWraps;
  const bx = cx, byBase = cy + yGather;             // cinch centre (world)
  const cw = nHalf*1.4;                              // cord band half-width
  const th = h*0.026;                                // one turn thickness
  const bound = Math.max(0, wraps - Math.round(loose*wraps));
  for(let i=0;i<bound;i++){
    const yy = byBase - i*th*1.7 + th*0.5;
    // turn body (bright silver) with a hard contour, then a dark lower lip so
    // each individual wrap reads under the halftone
    pen.paint(()=>{ g.ellipse(bx, yy, cw, th, 0,0,7); }, toneSolid(inkLevel(CORD)), 3.4);
    pen.paint(()=>{
      g.ellipse(bx, yy+th*0.5, cw*0.96, th*0.55, 0, 0.2, 2.94);
    }, toneSolid(inkLevel(CORD_D)), 0);
    // groove line between this turn and the one below
    pen.ink(()=>{ g.moveTo(bx-cw*0.9, yy+th); g.quadraticCurveTo(bx, yy+th*1.5, bx+cw*0.9, yy+th); }, 1.8);
  }
  // a knot where the cord ties off
  if (bound>0){
    pen.paint(()=>{ g.arc(bx+cw*0.62, byBase, w*0.032, 0,7); }, toneSolid(inkLevel(CORD)), 3.4);
  }
  // loose dangling tail when tampered
  if (loose>0){
    g.lineCap="round";
    g.strokeStyle=INK; g.lineWidth=6;
    g.beginPath();
    g.moveTo(bx+cw*0.5, byBase);
    g.quadraticCurveTo(bx+cw*1.4, byBase+h*0.10, bx+cw*1.1, byBase+h*0.22);
    g.stroke();
    g.strokeStyle=inkLevel(CORD); g.lineWidth=3.4; g.stroke();
  }
}

/* Erupting winds — scrolled gust curls streaming up out of the open mouth. */
function drawWinds(pen, g, mouth, w, h, t, strength=1){
  const n = params.windCurls;
  for(let i=0;i<n;i++){
    const ph  = t*1.6 + i*1.7;
    const side = (i%2===0)? 1 : -1;
    const rise = (0.35 + 0.65*((i/(n-1))))*strength;   // fan spread
    const ox = mouth.x + side*w*0.10*i*0.5;
    const oy = mouth.y - h*0.04;
    // a scrolled ribbon: sweep outward and curl back on itself
    const len = h*(0.30 + 0.16*rise);
    const cx1 = ox + side*w*(0.10+0.06*Math.sin(ph));
    const cy1 = oy - len*0.5;
    const ex  = ox + side*w*(0.24+0.05*Math.cos(ph))*rise;
    const ey  = oy - len;
    // ribbon body
    pen.paint(()=>{
      g.moveTo(ox-4, oy);
      g.quadraticCurveTo(cx1-6, cy1, ex, ey);
      g.quadraticCurveTo(ex+side*w*0.09, ey-h*0.05, ex+side*w*0.02, ey-h*0.09); // curl tip
      g.quadraticCurveTo(ex+side*w*0.02, ey+h*0.01, ex+8, ey);
      g.quadraticCurveTo(cx1+6, cy1, ox+4, oy);
      g.closePath();
    }, toneSolid(inkLevel(WIND)), 3.2);
    // a darker inner spiral line for motion
    pen.ink(()=>{
      g.moveTo(ox, oy);
      g.quadraticCurveTo(cx1, cy1, ex+side*w*0.02, ey-h*0.02);
    }, 2.2);
  }
  // little scudding puffs above the main gusts
  g.fillStyle=inkLevel(WIND_D);
  for(let i=0;i<4;i++){
    const yy = mouth.y - h*(0.34 + ((t*0.25+i*0.22)%0.5));
    const xx = mouth.x + Math.sin(t*1.3+i*1.9)*w*0.22;
    g.beginPath(); g.ellipse(xx, yy, w*0.03, w*0.018, 0,0,7); g.fill();
  }
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t        = st.t ?? 0;
  const fill     = st.fill ?? 0.85;
  const open     = !!st.open;
  const sag      = !!st.sag;
  const pressure = !!st.pressure;
  const tamper   = st.tamper ?? 0;        // 0..1 how undone the cord is
  const windOut  = !!st.windOut;

  const cx = W*0.50, cy = H*0.74;
  const w  = W*0.56, h = H*0.52;

  // ground contact shadow under the resting base
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, cy+h*0.06, w*(0.32+0.16*(1-fill)), h*0.05, 0,0,7); g.fill();

  // the oxhide bag
  const { mouth, nHalf, yGather } = drawBag(pen, g, cx, cy, w, h, { fill, mouthOpen:open||sag, sag });

  // radial PRESSURE lines across the taut hide (bulging / straining)
  if (pressure){
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
    const py = cy - h*0.40;
    for(let a=0;a<7;a++){
      const ang = -0.9 + a*(1.8/6);
      const r0 = w*0.16, r1 = w*(0.34+0.06*Math.sin(a*1.3));
      g.beginPath();
      g.moveTo(cx+Math.cos(ang-1.57)*r0, py+Math.sin(ang-1.57)*r0*1.2);
      g.lineTo(cx+Math.cos(ang-1.57)*r1, py+Math.sin(ang-1.57)*r1*1.2);
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // open dark mouth of the bag (when opened / emptied)
  if (open || sag){
    pen.paint(()=>{ g.ellipse(mouth.x, mouth.y, nHalf*0.9, h*0.03, 0,0,7); }, toneSolid(inkLevel(MOUTH)), 3);
  }

  // SILVER CORD cinch around the gathered neck
  drawCord(pen, g, cx, cy, w, h, nHalf, yGather, open? 1 : tamper);

  // faint wisp leaking at the neck when tampered (before full eruption)
  if (tamper>0 && !windOut){
    g.strokeStyle=inkLevel(WIND_D); g.lineWidth=2.4; g.lineCap="round"; g.globalAlpha=0.7;
    for(let i=0;i<2;i++){
      const xx=mouth.x + (i? 8:-8);
      g.beginPath();
      g.moveTo(xx, mouth.y-h*0.01);
      g.quadraticCurveTo(xx+(i?18:-18), mouth.y-h*0.10, xx+(i?6:-6), mouth.y-h*0.18);
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // full eruption of the storm-winds out of the open mouth
  if (windOut){
    drawWinds(pen, g, mouth, w, h, t, sag? 0.6 : 1.0);
  }
}

export const asset = {
  id:"prop.bag-of-winds",
  type:"PROP",
  name:"Bag of Winds",
  statusWord:"SEALED",
  scene:"OD-B10-S01",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","hide-body","hide-flank","seams","creases","pressure","neck","mouth","silver-cord","wisp","winds"],
  // normalized 0..1 anchors: mouth / grip / contact points
  anchors:{
    "mouth:neck":{x:.50,y:.20},         // the gathered mouth / where winds erupt
    "cord:cinch":{x:.50,y:.28},         // the silver-cord binding point
    "grip:neck":{x:.50,y:.30},          // where a hand takes the bound neck
    "grip:belly":{x:.50,y:.55},         // two-handed hold on the fat belly
    "contact:base":{x:.50,y:.78},       // resting base footprint centre
  },
  // ownership + collision box (AABB in 0..1) for placement / pathing
  owner:"odysseus:aeolus-gift",
  zones:{ bounds:{ x0:.16,y0:.14,x1:.84,y1:.82 }, footprint:{ x0:.28,y0:.72,x1:.72,y1:.82 } },
  states:{
    initial:"sealed",
    nodes:{
      sealed:  { preview:{ fill:0.85, open:false, status:"SEALED",  progress:.85 } },
      bulging: { preview:{ fill:1.00, open:false, pressure:true, status:"BULGING", progress:1.0 } },
      tampered:{ preview:{ fill:0.92, open:false, tamper:0.55, status:"TAMPERED", progress:.60 } },
      opened:  { preview:{ fill:0.45, open:true,  windOut:true, status:"OPENED",  progress:.35 } },
      empty:   { preview:{ fill:0.05, open:true,  sag:true, status:"EMPTY",   progress:.03 } },
    },
    edges:[
      ["sealed","bulging"],["sealed","tampered"],["bulging","tampered"],
      ["tampered","opened"],["opened","empty"],["bulging","opened"],
    ],
  },
  channels:["fill","open","pressure","tamper","windOut","sag","t"],

  preview:()=>({ fill:0.85, open:false, status:"SEALED", progress:.85 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones, owner:asset.owner }; },
};
export default asset;
