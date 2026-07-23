/* prop.laertess-shroud-and-loom — Penelope's great upright loom + Laertes's shroud.
   PROP asset. A large warp-weighted loom: two heavy uprights, a top cloth-beam,
   a partly-woven shroud growing down from the beam, a curtain of warp threads
   held taut by a row of clay loom-weights, a shed rod, and a boat shuttle.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B02-S02): the textile apparatus cycling through its telling
   states — bare warp / woven-length / weaving-with-shuttle / the night unravel /
   the completed cloth. wovenFrac drives the fell-line; the fell (weaving edge)
   moves DOWN the warp as more cloth is made, exposing fewer loose threads.
   Atlas: isolated reusable object; scale, support/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  postW:34,             // width of each upright post
  beamH:28,             // height of the top cloth-beam
  warpCount:30,         // number of warp threads across the web
  weightCount:9,        // clay loom-weights in the bottom row
  wood:5,               // ink level for the oak frame
  cloth:3,              // ink level for the woven shroud
};

/* fixed frame geometry in the 660x880 source (fractions of W/H) */
function frame(W,H){
  const postCX_L = W*0.165, postCX_R = W*0.835;
  const pw = params.postW;
  const topBeamY = H*0.105, beamH = params.beamH;
  const postTop = H*0.060, postBot = H*0.905;
  const warpTop = topBeamY + beamH;             // fell starts just under the beam
  const warpBottom = H*0.735;                   // where threads meet the weights
  const weightBottom = H*0.855;
  const wx0 = postCX_L + pw/2 + 10;
  const wx1 = postCX_R - pw/2 - 10;
  return { postCX_L, postCX_R, pw, topBeamY, beamH, postTop, postBot,
           warpTop, warpBottom, weightBottom, wx0, wx1 };
}

/* per-state pose */
const POSE = {
  "woven-length": { wovenFrac:0.42, shed:true,  shuttle:false, unravel:false, status:"WOVEN",      progress:0.42 },
  "unravel-track":{ wovenFrac:0.30, shed:true,  shuttle:false, unravel:true,  status:"UNRAVELING", progress:0.22 },
  shuttle:        { wovenFrac:0.48, shed:true,  shuttle:true,  unravel:false, status:"WEAVING",    progress:0.50 },
  threads:        { wovenFrac:0.04, shed:true,  shuttle:false, unravel:false, status:"WARPED",     progress:0.04 },
  completed:      { wovenFrac:0.95, shed:false, shuttle:false, unravel:false, status:"FINISHED",   progress:1.00 },
};

function drawLoom(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "woven-length";
  const P = POSE[mode] || POSE["woven-length"];
  const F = frame(W,H);
  const wovenFrac = (typeof st.wovenFrac==="number") ? clamp(st.wovenFrac,0,1) : P.wovenFrac;
  const fellY = F.warpTop + (F.warpBottom - F.warpTop)*wovenFrac;
  const webW  = F.wx1 - F.wx0;

  // ============ FRAME: two uprights + feet ============
  const post = (cx)=>{
    pen.paint(()=>{ g.rect(cx-F.pw/2, F.postTop, F.pw, F.postBot-F.postTop); }, toneSolid(inkLevel(params.wood)), 5);
    // rounded-log highlight/shadow down the post
    g.fillStyle=inkLevel(2); g.fillRect(cx-F.pw/2+4, F.postTop+6, F.pw*0.16, F.postBot-F.postTop-12);
    g.fillStyle=inkLevel(7); g.fillRect(cx+F.pw*0.22, F.postTop+6, F.pw*0.22, F.postBot-F.postTop-12);
    // splayed foot
    pen.paint(()=>{ g.moveTo(cx-F.pw*1.1, F.postBot); g.lineTo(cx+F.pw*1.1, F.postBot);
                    g.lineTo(cx+F.pw*0.55, F.postBot-F.pw*0.9); g.lineTo(cx-F.pw*0.55, F.postBot-F.pw*0.9);
                    g.closePath(); }, toneSolid(inkLevel(6)), 5);
  };
  post(F.postCX_L); post(F.postCX_R);

  // ============ TOP CLOTH-BEAM (roller the finished cloth winds onto) ============
  const beamX0 = F.postCX_L - F.pw*0.2, beamX1 = F.postCX_R + F.pw*0.2;
  pen.paint(()=>{ g.rect(beamX0, F.topBeamY, beamX1-beamX0, F.beamH); }, toneSolid(inkLevel(6)), 5);
  // beam-end caps
  pen.paint(()=>{ g.ellipse(beamX0, F.topBeamY+F.beamH/2, F.pw*0.42, F.beamH*0.62, 0,0,7); }, toneSolid(inkLevel(5)), 5);
  pen.paint(()=>{ g.ellipse(beamX1, F.topBeamY+F.beamH/2, F.pw*0.42, F.beamH*0.62, 0,0,7); }, toneSolid(inkLevel(5)), 5);
  // winding grooves along the beam
  g.strokeStyle=inkLevel(2); g.lineWidth=2;
  for(let x=beamX0+16; x<beamX1-8; x+=22){ g.beginPath(); g.moveTo(x, F.topBeamY+4); g.lineTo(x, F.topBeamY+F.beamH-4); g.stroke(); }

  // ============ WOVEN SHROUD (grows down from the beam) ============
  if (fellY > F.warpTop+1){
    pen.paint(()=>{ g.rect(F.wx0, F.warpTop, webW, fellY-F.warpTop); }, toneSolid(inkLevel(params.cloth)), 5);
    // weft rows (horizontal weave lines) — spaced, mid tone, so the cloth reads gray
    g.strokeStyle=inkLevel(5); g.lineWidth=1.6;
    for(let y=F.warpTop+9; y<fellY-4; y+=12){ g.beginPath(); g.moveTo(F.wx0+2,y); g.lineTo(F.wx1-2,y); g.stroke(); }
    // faint warp columns crossing the cloth (the woven grid)
    g.strokeStyle=inkLevel(4); g.lineWidth=1.2;
    for(let i=0;i<=params.warpCount;i+=3){ const x=F.wx0+webW*(i/params.warpCount);
      g.beginPath(); g.moveTo(x,F.warpTop+2); g.lineTo(x,fellY-2); g.stroke(); }
    // the FELL LINE / beater edge — dark bar where weaving is happening
    pen.paint(()=>{ g.rect(F.wx0-4, fellY-5, webW+8, 12); }, toneSolid(inkLevel(7)), 4);
  }

  // ============ WARP THREADS (loose, below the fell) ============
  const warpX = (i)=> F.wx0 + webW*(i/(params.warpCount));
  g.lineCap="round";
  for(let i=0;i<=params.warpCount;i++){
    const x = warpX(i);
    // in the unravel state a few threads are pulled loose and wander
    const loose = P.unravel && (i%6===2);
    g.strokeStyle = INK; g.lineWidth = 2.1;
    g.beginPath();
    if (loose){
      // a slack, curling thread being drawn back out of the web
      const sway = 26*Math.sin(i);
      g.moveTo(x, fellY);
      g.bezierCurveTo(x+sway, fellY+(F.warpBottom-fellY)*0.4,
                      x-sway*1.4, fellY+(F.warpBottom-fellY)*0.7,
                      x+sway*0.5, F.warpBottom+6);
    } else {
      g.moveTo(x, fellY);
      g.lineTo(x, F.warpBottom);
    }
    g.stroke();
  }

  // ============ SHED ROD (holds the natural shed open across the warp) ============
  if (P.shed){
    const ry = fellY + (F.warpBottom-fellY)*0.55;
    if (ry < F.warpBottom-10){
      pen.paint(()=>{ g.rect(F.wx0-F.pw*0.7, ry-6, webW+F.pw*1.4, 13); }, toneSolid(inkLevel(6)), 4);
      g.fillStyle=inkLevel(2); g.fillRect(F.wx0-F.pw*0.6, ry-4, webW+F.pw*1.2, 3);
    }
  }

  // ============ LOOM-WEIGHTS (clay weights tensioning the warp) ============
  const wCount = params.weightCount;
  for(let k=0;k<wCount;k++){
    const cx = F.wx0 + webW*((k+0.5)/wCount);
    const top = F.warpBottom, bot = F.weightBottom;
    const halfTop = 9, halfBot = 15;
    // thread bundle gathering into the weight
    g.strokeStyle=INK; g.lineWidth=2; g.beginPath(); g.moveTo(cx, top-4); g.lineTo(cx, top+4); g.stroke();
    pen.paint(()=>{ g.moveTo(cx-halfTop, top); g.lineTo(cx+halfTop, top);
                    g.lineTo(cx+halfBot, bot-8);
                    g.quadraticCurveTo(cx, bot+6, cx-halfBot, bot-8);
                    g.closePath(); }, toneSolid(inkLevel(5)), 4);
    // suspension hole
    g.fillStyle=inkLevel(1); g.beginPath(); g.arc(cx, top+9, 3.2, 0, 7); g.fill();
    g.strokeStyle=INK; g.lineWidth=1.4; g.beginPath(); g.arc(cx, top+9, 3.2, 0, 7); g.stroke();
  }

  // ============ BOAT SHUTTLE (carrying the weft, in the weaving state) ============
  if (P.shuttle){
    const sy = fellY + 16, cx = F.wx0 + webW*0.5, hl = webW*0.20, hh = 15;
    // trailing weft thread back to the last-woven edge
    g.strokeStyle=INK; g.lineWidth=1.8; g.beginPath();
    g.moveTo(cx-hl, sy); g.quadraticCurveTo(cx-hl-30, sy-14, F.wx0+6, fellY-2); g.stroke();
    pen.paint(()=>{ g.moveTo(cx-hl, sy);
                    g.quadraticCurveTo(cx-hl*0.2, sy-hh, cx+hl, sy);
                    g.quadraticCurveTo(cx-hl*0.2, sy+hh, cx-hl, sy);
                    g.closePath(); }, toneSolid(inkLevel(6)), 4);
    // the bobbin core, and a bright rib
    g.fillStyle=inkLevel(2); g.fillRect(cx-hl*0.5, sy-2.5, hl, 3);
    g.fillStyle=inkLevel(1); g.beginPath(); g.arc(cx+hl*0.35, sy, 4, 0, 7); g.fill();
    g.strokeStyle=INK; g.lineWidth=1.4; g.beginPath(); g.arc(cx+hl*0.35, sy, 4, 0, 7); g.stroke();
  }

  // ============ UNRAVEL: the pulled-out yarn pooling at the base ============
  if (P.unravel){
    const px = F.wx1 - webW*0.14, py = F.weightBottom - 4;
    pen.paint(()=>{ g.ellipse(px, py, 34, 22, -0.15, 0, 7); }, toneSolid(inkLevel(3)), 4);
    g.strokeStyle=INK; g.lineWidth=1.6;
    for(let a=0;a<5;a++){ g.beginPath();
      g.ellipse(px, py, 28-a*4, 17-a*3, -0.15 + a*0.4, 0, 7); g.stroke(); }
    // a strand running up from the tangle toward the frayed fell
    g.beginPath(); g.moveTo(px-28, py-12);
    g.bezierCurveTo(px-70, py-70, F.wx1-40, fellY+40, F.wx1-30, fellY); g.stroke();
  }
}

export const asset = {
  id:"prop.laertess-shroud-and-loom",
  type:"PROP",
  name:"Laertes's Shroud and Loom",
  statusWord:"WOVEN",
  scene:"OD-B02-S02",

  params,
  // back -> front draw order the module honors
  layers:["posts","feet","beam","shroud","fell","warp","shed","weights","shuttle","unravel"],

  // normalized 0..1 attachment / support / contact anchors
  anchors:{
    "beam:cloth":{x:.50,y:.12},     // top cloth-beam the finished web winds onto
    "web:center":{x:.50,y:.30},     // middle of the woven shroud
    fell:{x:.50,y:.42},             // the weaving edge (moves down as cloth grows)
    "grip:shuttle":{x:.50,y:.46},   // where a hand passes the shuttle through the shed
    "shed:rod":{x:.50,y:.60},       // the shed rod across the warp
    "weights:row":{x:.50,y:.80},    // hanging clay loom-weights
    "post:left":{x:.165,y:.50},     // left upright (support/lean)
    "post:right":{x:.835,y:.50},    // right upright
    "contact:floor":{x:.50,y:.90},  // the loom's feet on the ground
  },
  // collision shape: the standing frame's footprint (asset space)
  collision:{ kind:"box", x0:.10, y0:.06, x1:.90, y1:.91 },
  ownership:"penelope",             // Penelope weaves it; the shroud is for Laertes

  states:{
    initial:"woven-length",
    nodes:{
      threads:        { preview:{ mode:"threads",        status:"WARPED",     progress:0.04 } },
      "woven-length": { preview:{ mode:"woven-length",   status:"WOVEN",      progress:0.42 } },
      shuttle:        { preview:{ mode:"shuttle",        status:"WEAVING",    progress:0.50 } },
      "unravel-track":{ preview:{ mode:"unravel-track",  status:"UNRAVELING", progress:0.22 } },
      completed:      { preview:{ mode:"completed",      status:"FINISHED",   progress:1.00 } },
    },
    edges:[
      ["threads","shuttle"],["shuttle","woven-length"],
      ["woven-length","shuttle"],["woven-length","unravel-track"],
      ["unravel-track","threads"],["woven-length","completed"],
      ["shuttle","completed"],
    ],
  },
  channels:["mode","wovenFrac","state","t"],

  preview:()=>({ mode:"woven-length", wovenFrac:0.42, status:"WOVEN", progress:0.42, t:0 }),
  draw(ctx,W,H,state){ drawLoom(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
