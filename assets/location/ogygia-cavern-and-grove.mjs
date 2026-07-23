/* location.ogygia-cavern-and-grove — Calypso's lush island set.
   LOCATION asset for OD-B05-S01. An EMPTY navigable set drawn in SOLID grays
   + hard contour into the offscreen ctx (the engine dotify pass supplies the
   halftone). A rock massif with an arched cave-mouth threshold; inside, a
   hearth and a standing loom; hanging vines drape the mouth (foreground
   occlusion); four springs on the grove floor; bird-filled woods on the
   right; a shore route to the sea on the left; a raft-building clearing with
   cut logs in the foreground. NO baked characters — anchors only.
   Atlas: cavern + grove + hearth + loom + vines + four springs + woods +
   shore route + raft clearing. */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.36,       // sky/sea meeting line as fraction of H
  groundLevel:0.62,   // grove floor line
  springs:4,          // the four springs
  woods:true,
  raft:true,
  vines:true,
};

/* small deterministic wavy vine, top -> bottom, with leaf blobs */
function vine(pen, g, x, y0, y1, amp, seed){
  const n=8, dy=(y1-y0)/n;
  pen.ink(()=>{
    g.moveTo(x,y0);
    for(let i=1;i<=n;i++){ const t=i/n; const xx=x+Math.sin(t*6.3+seed)*amp*(0.4+t); g.lineTo(xx, y0+dy*i); }
  }, 3);
  // leaves
  g.fillStyle=inkLevel(5);
  for(let i=1;i<=n;i++){ if(i%2) continue; const t=i/n; const xx=x+Math.sin(t*6.3+seed)*amp*(0.4+t);
    g.beginPath(); g.ellipse(xx+ (i%4?4:-4), y0+dy*i, 6,3, i%4?0.6:-0.6, 0,7); g.fill(); }
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const ground  = H*params.groundLevel;
  const layers = st.layers || ["sky","sea","floor","woods","massif","cavemouth","hearth","loom","shore","springs","raft","vines","birds"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest -> few dots) with a couple of clouds ----
  if (has("sky")){
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,horizon);
    g.fillStyle=inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.14+i*0.20), horizon*(0.30+0.10*(i%2)), W*0.10, H*0.022, 0,0,7); g.fill(); }
  }

  // ---- distant SEA band behind everything (left + center) ----
  if (has("sea")){
    pen.paint(()=>{ g.rect(0, horizon, W*0.62, ground-horizon); }, toneSolid(inkLevel(3)), 3);
    // horizon line + a few wave dashes
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W*0.62,horizon); }, 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let j=0;j<4;j++){ const y=horizon+(ground-horizon)*(0.25+j*0.2);
      for(let x=W*0.04;x<W*0.56;x+=W*0.09){ g.beginPath(); g.moveTo(x,y); g.lineTo(x+W*0.03,y); g.stroke(); } }
    g.globalAlpha=1;
  }

  // ---- GROVE FLOOR (foreground ground plane) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,ground,W,H-ground);
    // grove edge where floor meets sea/back
    pen.ink(()=>{ g.moveTo(W*0.62,ground); g.lineTo(W,ground); }, 3);
    // scattered grass tufts
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    for(let x=W*0.06;x<W*0.96;x+=W*0.075){ const y=ground+H*0.02+((x*7)%20); g.beginPath();
      g.moveTo(x,y); g.lineTo(x-3,y-8); g.moveTo(x,y); g.lineTo(x+3,y-9); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- WOODS (bird-filled) on the right, receding behind the massif ----
  if (has("woods") && params.woods){
    const base=ground;
    for(let i=0;i<5;i++){
      const tx=W*(0.72+i*0.055), th=H*(0.20-0.012*i), cw=W*0.05*(1-0.06*i);
      // trunk
      pen.paint(()=>{ g.rect(tx-W*0.008, base-th, W*0.016, th); }, toneSolid(inkLevel(5)), 3);
      // canopy
      pen.paint(()=>{ g.ellipse(tx, base-th, cw, cw*0.9, 0,0,7); }, toneSolid(inkLevel(4)), 4);
    }
  }

  // ---- ROCK MASSIF (the cavern body) center, mid tone so the dark mouth reads ----
  if (has("massif")){
    const bx0=W*0.26, bx1=W*0.80, topY=H*0.16;
    pen.paint(()=>{
      g.moveTo(bx0, ground);
      g.quadraticCurveTo(W*0.23, H*0.44, W*0.36, topY+H*0.05);
      g.quadraticCurveTo(W*0.50, H*0.11, W*0.64, topY+H*0.04);
      g.quadraticCurveTo(W*0.82, H*0.34, bx1, ground);
      g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // a couple of strata seams
    pen.seam(()=>{ g.moveTo(W*0.30,H*0.34); g.quadraticCurveTo(W*0.42,H*0.28,W*0.55,H*0.34); }, 3);
    pen.seam(()=>{ g.moveTo(W*0.58,H*0.26); g.quadraticCurveTo(W*0.68,H*0.24,W*0.76,H*0.34); }, 3);
  }

  // ---- CAVE-MOUTH threshold: arched dark opening punched into the massif ----
  if (has("cavemouth")){
    const mx=W*0.50, mw=W*0.24, baseY=ground, topY=H*0.30;
    pen.paint(()=>{
      g.moveTo(mx-mw/2, baseY);
      g.lineTo(mx-mw/2, topY+H*0.06);
      g.quadraticCurveTo(mx, topY-H*0.04, mx+mw/2, topY+H*0.06);
      g.lineTo(mx+mw/2, baseY);
      g.closePath();
    }, toneSolid(inkLevel(7)), 5);
  }

  // ---- HEARTH inside the cave mouth (stones + flame tongues, reads light on dark) ----
  if (has("hearth")){
    const hx=W*0.44, hy=ground-H*0.015;
    // ring of stones
    for(let i=0;i<5;i++){ const a=-0.4+i*0.45; const sx=hx+Math.cos(a)*W*0.035, sy=hy-Math.sin(a)*H*0.012;
      pen.paint(()=>{ g.ellipse(sx,sy,W*0.014,H*0.011,0,0,7); }, toneSolid(inkLevel(4)), 3); }
    // flame tongues
    g.fillStyle=inkLevel(2);
    for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(hx+i*W*0.018, hy-H*0.005);
      g.quadraticCurveTo(hx+i*W*0.018-6, hy-H*0.05, hx+i*W*0.006, hy-H*0.075);
      g.quadraticCurveTo(hx+i*W*0.018+6, hy-H*0.05, hx+i*W*0.018, hy-H*0.005); g.fill(); }
    pen.seam(()=>{ g.moveTo(hx-W*0.02,hy-H*0.02); g.quadraticCurveTo(hx,hy-H*0.08,hx+W*0.02,hy-H*0.02); }, 2);
  }

  // ---- STANDING LOOM inside the cave, to the right of the hearth ----
  if (has("loom")){
    const lx=W*0.565, ly0=ground-H*0.24, ly1=ground-H*0.01, lw=W*0.05;
    // uprights + top/bottom beams
    pen.paint(()=>{ g.rect(lx-lw/2, ly0, W*0.010, ly1-ly0); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(lx+lw/2-W*0.010, ly0, W*0.010, ly1-ly0); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(lx-lw/2-W*0.006, ly0, lw+W*0.012, H*0.014); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(lx-lw/2-W*0.006, ly1-H*0.014, lw+W*0.012, H*0.014); }, toneSolid(inkLevel(3)), 3);
    // warp threads
    g.strokeStyle=inkLevel(2); g.lineWidth=1.4;
    for(let i=0;i<7;i++){ const wx=lx-lw/2+W*0.006+i*(lw-W*0.012)/6; g.beginPath(); g.moveTo(wx,ly0+H*0.014); g.lineTo(wx,ly1-H*0.014); g.stroke(); }
    // a shuttle line partway down
    g.strokeStyle=inkLevel(4); g.lineWidth=3; g.beginPath(); g.moveTo(lx-lw/2,ly0+H*0.10); g.lineTo(lx+lw/2,ly0+H*0.10); g.stroke();
  }

  // ---- SHORE ROUTE: sandy path from foreground down-left to the sea ----
  if (has("shore")){
    pen.paint(()=>{
      g.moveTo(0, ground+H*0.02);
      g.lineTo(W*0.30, ground+H*0.01);
      g.lineTo(W*0.20, H);
      g.lineTo(0, H);
      g.closePath();
    }, toneSolid(inkLevel(1)), 4);
    // waterline scallops where shore meets sea
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    for(let x=0;x<W*0.28;x+=W*0.04){ g.beginPath(); g.arc(x+W*0.02, ground+H*0.015, W*0.02, Math.PI, 0); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- FOUR SPRINGS on the grove floor ----
  if (has("springs")){
    const pts=[ [0.36,0.74],[0.58,0.80],[0.74,0.72],[0.88,0.82] ];
    for(let i=0;i<Math.min(params.springs,pts.length);i++){
      const px=W*pts[i][0], py=H*pts[i][1], pr=W*0.045;
      pen.paint(()=>{ g.ellipse(px,py,pr,pr*0.5,0,0,7); }, toneSolid(inkLevel(2)), 4);
      // ripple + a little source spout mark
      g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.55;
      g.beginPath(); g.ellipse(px,py,pr*0.55,pr*0.28,0,0,7); g.stroke(); g.globalAlpha=1;
      g.strokeStyle=INK; g.lineWidth=2; g.beginPath(); g.moveTo(px,py-pr*0.5); g.lineTo(px,py-pr*0.9); g.stroke();
    }
  }

  // ---- RAFT-BUILDING CLEARING: cut logs stacked in the lower foreground ----
  if (has("raft") && params.raft){
    const rx=W*0.30, ry=H*0.90;
    for(let i=0;i<4;i++){
      const ly=ry - i*H*0.03, lx=rx + (i%2)*W*0.02, len=W*0.20-i*W*0.01;
      pen.paint(()=>{ g.rect(lx, ly, len, H*0.026); }, toneSolid(inkLevel(4)), 3);
      // log end grain
      pen.paint(()=>{ g.ellipse(lx, ly+H*0.013, W*0.012, H*0.013, 0,0,7); }, toneSolid(inkLevel(3)), 3);
      pen.seam(()=>{ g.ellipse(lx, ly+H*0.013, W*0.005, H*0.006, 0,0,7); }, 2);
    }
    // an axe / adze mark stump beside the logs
    pen.paint(()=>{ g.rect(rx+W*0.24, ry-H*0.01, W*0.05, H*0.05); }, toneSolid(inkLevel(4)), 3);
  }

  // ---- HANGING VINES over the cave mouth (foreground occlusion) ----
  if (has("vines") && params.vines){
    // a fringe draping from the top of the cave-mouth arch, spanning the mouth
    for(let i=0;i<6;i++){ vine(pen, g, W*(0.40+i*0.044), H*0.30, H*(0.44+0.05*(i%3)), W*0.012, i*1.3); }
    // three longer leaders in front of the mouth
    vine(pen, g, W*0.44, H*0.31, H*0.56, W*0.02, 0.4);
    vine(pen, g, W*0.51, H*0.30, H*0.60, W*0.018, 1.7);
    vine(pen, g, W*0.58, H*0.32, H*0.58, W*0.022, 2.9);
  }

  // ---- BIRDS in the open sky (thin ink strokes, in clear areas) ----
  if (has("birds")){
    g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
    const bs=[ [0.12,0.10],[0.19,0.07],[0.16,0.14],[0.86,0.12],[0.92,0.08],[0.89,0.17] ];
    for(const [bx,by] of bs){ const x=W*bx,y=H*by,s=W*0.016;
      g.beginPath(); g.moveTo(x-s,y+s*0.4); g.quadraticCurveTo(x-s*0.3,y-s*0.5,x,y);
      g.quadraticCurveTo(x+s*0.3,y-s*0.5,x+s,y+s*0.4); g.stroke(); }
  }
}

export const asset = {
  id:"location.ogygia-cavern-and-grove",
  type:"LOCATION",
  name:"Ogygia Cavern and Grove",
  statusWord:"LUSH",
  scene:"OD-B05-S01",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude
  layers:["sky","sea","floor","woods","massif","cavemouth","hearth","loom","shore","springs","raft","vines","birds","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "threshold:cave-mouth":{x:.50,y:.55},
    "hearth":{x:.44,y:.60}, "loom":{x:.565,y:.50},
    "spring:1":{x:.36,y:.74}, "spring:2":{x:.58,y:.80}, "spring:3":{x:.74,y:.72}, "spring:4":{x:.88,y:.82},
    "woods":{x:.82,y:.55}, "shore":{x:.12,y:.82}, "raft-clearing":{x:.36,y:.88},
    "entrance:cave":{x:.50,y:.60}, "exit:shore":{x:.05,y:.90}, "exit:woods":{x:.96,y:.62},
    "camera:wide":{x:.50,y:.50}, "camera:cave":{x:.50,y:.55}, "camera:shore":{x:.20,y:.66},
  },
  // walkable ground regions (for scene placement / pathing)
  zones:{
    walkable:{ x0:.06,y0:.66,x1:.96,y1:.96 },
    cave:{ x0:.40,y0:.52,x1:.60,y1:.66 },
    raftClearing:{ x0:.24,y0:.82,x1:.54,y1:.98 },
    shorePath:{ x0:.00,y0:.66,x1:.30,y1:1.0 },
  },
  states:{
    initial:"day",
    nodes:{
      day:{ preview:{ layers:["sky","sea","floor","woods","massif","cavemouth","hearth","loom","shore","springs","raft","vines","birds"] } },
      "hearth-lit":{ preview:{ layers:["sky","sea","floor","woods","massif","cavemouth","hearth","loom","shore","springs","raft","vines","birds"] } },
      "raft-ready":{ preview:{ layers:["sky","sea","floor","woods","massif","cavemouth","hearth","loom","shore","springs","raft","vines"] } },
      empty:{ preview:{ layers:["sky","sea","floor","woods","massif","cavemouth","shore","springs","vines"] } },
    },
    edges:[["day","hearth-lit"],["day","raft-ready"],["day","empty"],["raft-ready","day"]],
  },
  channels:["reveal","camera","light","tide"],

  preview:()=>({ layers:["sky","sea","floor","woods","massif","cavemouth","hearth","loom","shore","springs","raft","vines","birds"], status:"LUSH", progress:.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
