/* location.circes-forest-palace — Circe's stone house in a forest clearing.
   LOCATION asset (empty navigable set). Built to the exemplar look:
   SOLID grays + hard black contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. NO baked characters.
   Atlas OD-B10-S04 — stone house in a clearing with a loom hall, a dining zone,
   a transformation floor, an animal yard, walled pig pens, forest approaches.
   Composition: bg forest / mid stone house / fg clearing; walkable ground,
   walled pens, thresholds, placement + camera anchors. */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.52,        // where the clearing floor meets the mid ground
  treeCount:9,         // background forest trunks
  house:true,          // central stone house (loom hall + dining zone inside)
  penCols:3,           // walled pig pens in the animal yard
  transformFloor:true, // the paved transformation floor before the porch
};

/* deterministic jitter so the forest is stable across renders */
function jig(i, a=1){ const s=Math.sin(i*12.9898)*43758.5453; return (s-Math.floor(s)-0.5)*2*a; }

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["forest","clearing","yard","pens","house","transform","anchors"];
  const has = l => layers.includes(l);

  // ================= BACKGROUND: forest wall behind the clearing =========
  if (has("forest")){
    // dim sky band above the treeline (lightest -> few dots)
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    // a solid dark treeline mass so the clearing reads as an opening
    g.fillStyle = inkLevel(4);
    g.beginPath();
    g.moveTo(0, horizon);
    for(let x=0;x<=W;x+=W*0.04){
      const k = x/W;
      const top = horizon - H*(0.16 + 0.07*Math.abs(Math.sin(k*7.1)) - 0.05*Math.max(0,0.5-Math.abs(k-0.5)));
      g.lineTo(x, top);
    }
    g.lineTo(W, horizon); g.closePath(); g.fill();
    // individual trunks + canopy blobs (forest approaches at the flanks)
    const n = params.treeCount;
    for(let i=0;i<n;i++){
      const edge = i/(n-1);                     // 0..1 across the back
      // bias trunks to the flanks, leaving a central clearing mouth
      const bias = (edge-0.5);
      const tx = W*(0.5 + bias*0.98 + jig(i*3.3,0.02));
      const th = H*(0.20 + 0.05*Math.abs(jig(i,1)));
      const ty = horizon - H*0.02;
      const tw = W*0.018;
      // canopy
      pen.paint(()=>{ g.ellipse(tx, ty-th, W*0.05, H*0.075, 0,0,7); }, toneSolid(inkLevel(5)), 4);
      // trunk
      pen.paint(()=>{ g.rect(tx-tw/2, ty-th*0.55, tw, th*0.55); }, toneSolid(inkLevel(6)), 3);
    }
    // two flanking forest-approach paths cut into the treeline (thresholds)
    g.fillStyle = inkLevel(2);
    g.beginPath(); g.moveTo(W*0.02,horizon); g.lineTo(W*0.13,horizon-H*0.11); g.lineTo(W*0.19,horizon-H*0.11); g.lineTo(W*0.12,horizon); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(W*0.98,horizon); g.lineTo(W*0.87,horizon-H*0.11); g.lineTo(W*0.81,horizon-H*0.11); g.lineTo(W*0.88,horizon); g.closePath(); g.fill();
  }

  // ================= FOREGROUND GROUND: the clearing (drawn first) ======
  if (has("clearing")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    // faint ground furrows converging toward the house threshold
    const vx=W*0.58, vy=horizon;
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(vx, vy); g.lineTo(vx+i*W*0.11, H); g.stroke(); }
    g.globalAlpha=1;
  }

  // ================= MID-LEFT: animal yard ground patch =================
  if (has("yard")){
    // a fenced yard mass on the left of the clearing
    pen.paint(()=>{ g.rect(W*0.05, horizon+H*0.02, W*0.30, H*0.16); }, toneSolid(inkLevel(2)), 3);
    // rail fence posts around the yard
    g.strokeStyle=INK; g.lineWidth=3;
    for(let i=0;i<=6;i++){ const x=W*(0.05+i*0.05); g.beginPath(); g.moveTo(x,horizon+H*0.02); g.lineTo(x,horizon-H*0.02); g.stroke(); }
    // top rail
    g.beginPath(); g.moveTo(W*0.05,horizon); g.lineTo(W*0.35,horizon); g.stroke();
  }

  // ================= MID-LEFT: walled pig pens ==========================
  if (has("pens")){
    const n = params.penCols;
    const px0 = W*0.06, penW = W*0.085, gap = W*0.008;
    const py = horizon+H*0.05, penH = H*0.11;
    for(let i=0;i<n;i++){
      const x = px0 + i*(penW+gap);
      // pen floor (mud tone)
      pen.paint(()=>{ g.rect(x, py, penW, penH); }, toneSolid(inkLevel(3)), 4);
      // stone walls (darker rim)
      pen.paint(()=>{ g.rect(x, py, penW, penH*0.14); }, toneSolid(inkLevel(6)), 4);       // back wall
      pen.paint(()=>{ g.rect(x, py, penW*0.12, penH); }, toneSolid(inkLevel(5)), 3);        // left wall
      pen.paint(()=>{ g.rect(x+penW*0.88, py, penW*0.12, penH); }, toneSolid(inkLevel(5)), 3); // right wall
      // a low gate gap in the front rail
      g.strokeStyle=INK; g.lineWidth=3;
      g.beginPath(); g.moveTo(x, py+penH); g.lineTo(x+penW*0.35, py+penH); g.stroke();
      g.beginPath(); g.moveTo(x+penW*0.65, py+penH); g.lineTo(x+penW, py+penH); g.stroke();
    }
  }

  // ================= CENTER: the stone house ============================
  if (has("house") && params.house){
    const hx=W*0.55, hw=W*0.32, hy=horizon+H*0.03, hh=H*0.30;
    // house body (stone, mid tone)
    pen.paint(()=>{ g.rect(hx, hy-hh, hw, hh); }, toneSolid(inkLevel(4)), 5);
    // gable roof
    pen.paint(()=>{ g.moveTo(hx-W*0.02, hy-hh); g.lineTo(hx+hw*0.5, hy-hh-H*0.10); g.lineTo(hx+hw+W*0.02, hy-hh); g.closePath(); }, toneSolid(inkLevel(6)), 5);
    // coursed-stone seams across the wall
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let j=1;j<4;j++){ const y=hy-hh+hh*(j/4); g.beginPath(); g.moveTo(hx,y); g.lineTo(hx+hw,y); g.stroke(); }
    g.globalAlpha=1;
    // LOOM HALL: tall left window with a loom-frame grid inside (lit interior)
    const lwx=hx+hw*0.10, lwy=hy-hh*0.78, lww=hw*0.24, lwh=hh*0.58;
    pen.paint(()=>{ g.rect(lwx, lwy, lww, lwh); }, toneSolid(inkLevel(1)), 4);
    g.strokeStyle=INK; g.lineWidth=2;
    for(let c=1;c<4;c++){ const x=lwx+lww*(c/4); g.beginPath(); g.moveTo(x,lwy); g.lineTo(x,lwy+lwh); g.stroke(); } // warp threads
    for(let r=1;r<3;r++){ const y=lwy+lwh*(r/3); g.beginPath(); g.moveTo(lwx,y); g.lineTo(lwx+lww,y); g.stroke(); } // weft
    // DINING ZONE: right window (interior table hint = a low dark bar)
    const dwx=hx+hw*0.60, dwy=hy-hh*0.72, dww=hw*0.28, dwh=hh*0.44;
    pen.paint(()=>{ g.rect(dwx, dwy, dww, dwh); }, toneSolid(inkLevel(1)), 4);
    pen.paint(()=>{ g.rect(dwx+dww*0.15, dwy+dwh*0.62, dww*0.7, dwh*0.16); }, toneSolid(inkLevel(5)), 3); // table
    // central doorway / threshold
    const dx=hx+hw*0.40, dw=hw*0.20, dh=hh*0.5;
    pen.paint(()=>{ g.rect(dx, hy-dh, dw, dh); }, toneSolid(inkLevel(7)), 5);
    // stepped porch stone at the door base
    pen.paint(()=>{ g.rect(dx-dw*0.4, hy, dw*1.8, H*0.02); }, toneSolid(inkLevel(5)), 4);
  }

  // ================= FOREGROUND: transformation floor ===================
  if (has("transform") && params.transformFloor){
    // a paved circular floor before the porch — the transformation spot
    const cx=W*0.55+W*0.32*0.5, cy=horizon+H*0.27, rx=W*0.17, ry=H*0.06;
    pen.paint(()=>{ g.ellipse(cx, cy, rx, ry, 0,0,7); }, toneSolid(inkLevel(3)), 5);
    // radiating paving seams
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(a)*rx, cy+Math.sin(a)*ry); g.stroke(); }
    // concentric ring
    g.beginPath(); g.ellipse(cx,cy,rx*0.55,ry*0.55,0,0,7); g.stroke();
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.circes-forest-palace",
  type:"LOCATION",
  name:"Circe's Forest Palace",
  statusWord:"ENCHANTED",
  scene:"OD-B10-S04",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude
  layers:["forest","yard","pens","house","transform","clearing","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "zone:loom-hall":{x:.68,y:.42},
    "zone:dining":{x:.82,y:.44},
    "spot:transform-floor":{x:.79,y:.82},
    "zone:animal-yard":{x:.20,y:.62},
    "pen:a":{x:.11,y:.66}, "pen:b":{x:.20,y:.66}, "pen:c":{x:.29,y:.66},
    "threshold:door":{x:.75,y:.55},
    "approach:forest-left":{x:.13,y:.44}, "approach:forest-right":{x:.87,y:.44},
    "entrance:left":{x:.04,y:.90}, "exit:right":{x:.96,y:.90},
    "camera:wide":{x:.50,y:.50}, "camera:porch":{x:.75,y:.62}, "camera:pens":{x:.20,y:.66},
  },
  // walkable ground + special sub-regions (for scene placement / pathing)
  zones:{
    walkable:{ x0:.04,y0:.56,x1:.96,y1:.98 },
    clearing:{ x0:.35,y0:.60,x1:.98,y1:.98 },
    "animal-yard":{ x0:.05,y0:.54,x1:.35,y1:.74 },
    "pig-pens":{ x0:.06,y0:.57,x1:.32,y1:.70 },
    "transform-floor":{ x0:.63,y0:.76,x1:.95,y1:.90 },
    interior:{ x0:.62,y0:.36,x1:.96,y1:.58 },
  },
  states:{
    initial:"day",
    nodes:{
      day:{ preview:{ layers:["forest","yard","pens","house","transform","clearing"] } },
      "pens-full":{ preview:{ layers:["forest","yard","pens","house","transform","clearing"] } },
      "empty-yard":{ preview:{ layers:["forest","house","transform","clearing"] } },
      interior:{ preview:{ layers:["house","transform","clearing"] } },
    },
    edges:[["day","pens-full"],["day","empty-yard"],["day","interior"]],
  },
  channels:["reveal","camera","light"],

  preview:()=>({ layers:["forest","yard","pens","house","transform","clearing"], status:"ENCHANTED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
