/* location.palace-storeroom — a vaulted secure chamber deep in the palace.
   LOCATION asset (empty navigable set): ranked storage jars, stacked chests,
   oil vats, metal stores line the side walls; a carrying aisle runs down the
   middle to a set of double doors at the back under a barrel vault. Drawn in
   SOLID grays + hard contour into the offscreen ctx (the engine dotify pass
   supplies the halftone). Declares depth layers, a walkable aisle, door
   thresholds, occlusion order, and placement/camera anchors. No baked figures.
   Atlas: OD-B02-S06. */
import { makePen, toneSolid, inkLevel, INK } from "/engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.62,     // horizon / back-wall foot as fraction of H
  wallTop:0.16,        // top of the back shelving wall (fraction of H)
  aisleHalf:0.10,      // half-width of the near aisle mouth (fraction of W)
  doorHalf:0.09,       // half-width of the double doors (fraction of W)
  doubleDoors:true,
  vault:true,
};

/* ---- object stamps: each draws at (x, baseY) with a size s in px ----
   All draw SOLID grays + black contour; the engine supplies the halftone. */
function amphora(pen,g,x,by,s,tone){
  // ranked storage jar: bulbous body, narrow neck, twin handles, footed base
  pen.paint(()=>{
    g.moveTo(x-s*0.30, by);                        // foot left
    g.lineTo(x-s*0.16, by-s*0.06);
    g.bezierCurveTo(x-s*0.46,by-s*0.36, x-s*0.42,by-s*0.86, x-s*0.16,by-s*1.02); // left belly up to shoulder
    g.lineTo(x-s*0.12, by-s*1.28);                 // neck left
    g.lineTo(x-s*0.20, by-s*1.40);                 // rim left
    g.lineTo(x+s*0.20, by-s*1.40);                 // rim right
    g.lineTo(x+s*0.12, by-s*1.28);                 // neck right
    g.bezierCurveTo(x+s*0.42,by-s*0.86, x+s*0.46,by-s*0.36, x+s*0.16,by-s*0.06);
    g.lineTo(x+s*0.30, by);
    g.closePath();
  }, tone, 4);
  // handles
  pen.ink(()=>{ g.moveTo(x-s*0.13,by-s*1.24); g.quadraticCurveTo(x-s*0.34,by-s*1.16,x-s*0.20,by-s*0.94); }, 3);
  pen.ink(()=>{ g.moveTo(x+s*0.13,by-s*1.24); g.quadraticCurveTo(x+s*0.34,by-s*1.16,x+s*0.20,by-s*0.94); }, 3);
  // shoulder seam
  pen.seam(()=>{ g.moveTo(x-s*0.30,by-s*0.86); g.quadraticCurveTo(x,by-s*0.96,x+s*0.30,by-s*0.86); }, 2);
}
function pithos(pen,g,x,by,s,tone){
  // fat oil vat — squat rounded storage jar, banded
  pen.paint(()=>{
    g.moveTo(x-s*0.26, by);
    g.bezierCurveTo(x-s*0.62,by-s*0.30, x-s*0.60,by-s*0.86, x-s*0.24,by-s*1.02);
    g.lineTo(x+s*0.24, by-s*1.02);
    g.bezierCurveTo(x+s*0.60,by-s*0.86, x+s*0.62,by-s*0.30, x+s*0.26,by);
    g.closePath();
  }, tone, 4);
  // rim
  pen.paint(()=>{ g.ellipse(x, by-s*1.02, s*0.26, s*0.08, 0,0,7); }, toneSolid(inkLevel(5)), 3);
  // hoop bands
  pen.seam(()=>{ g.moveTo(x-s*0.52,by-s*0.62); g.quadraticCurveTo(x,by-s*0.52,x+s*0.52,by-s*0.62); }, 2);
  pen.seam(()=>{ g.moveTo(x-s*0.46,by-s*0.30); g.quadraticCurveTo(x,by-s*0.20,x+s*0.46,by-s*0.30); }, 2);
}
function chest(pen,g,x,by,s,tone){
  // stacked strongbox chest with a banded lid + lock
  const w=s*0.92, h=s*0.62;
  pen.paint(()=>{ g.rect(x-w/2, by-h, w, h); }, tone, 4);
  // lid
  pen.paint(()=>{ g.rect(x-w/2, by-h, w, h*0.30); }, toneSolid(inkLevel(5)), 4);
  // iron straps
  pen.seam(()=>{ g.moveTo(x-w*0.28,by-h); g.lineTo(x-w*0.28,by); }, 3);
  pen.seam(()=>{ g.moveTo(x+w*0.28,by-h); g.lineTo(x+w*0.28,by); }, 3);
  // lock plate
  pen.paint(()=>{ g.rect(x-s*0.07, by-h*0.62, s*0.14, s*0.16); }, toneSolid(inkLevel(7)), 2);
}
function ingots(pen,g,x,by,s,tone){
  // metal stores — a low pyramid stack of ingot bars
  const bw=s*0.30, bh=s*0.14;
  const row=(cx,cy,n)=>{ for(let i=0;i<n;i++){ const bx=cx-(n*bw)/2+i*bw;
    pen.paint(()=>{ g.rect(bx, cy-bh, bw*0.92, bh); }, tone, 3); } };
  row(x, by, 4);
  row(x, by-bh, 3);
  row(x, by-bh*2, 2);
  row(x, by-bh*3, 1);
}

/* one shelf tier: a dark board with a ranked row of small jars sitting on it.
   xa..xb is the board span; skip = optional [x0,x1] gap the doors occupy. */
function shelfRow(pen,g,xa,xb,by,skip){
  const board=Math.max(4,(xb-xa)*0.018);
  pen.paint(()=>{ g.rect(xa, by, xb-xa, board); }, toneSolid(inkLevel(6)), 3);
  const s=(xb-xa)*0.030;                 // small jar size for the rank
  const step=s*2.05;
  for(let x=xa+step*0.6; x<xb-step*0.3; x+=step){
    if(skip && x>skip[0]-s && x<skip[1]+s) continue;
    amphora(pen,g,x,by,s,toneSolid(inkLevel(4)));
  }
}

/* draw a subset of layers so scene state can reveal/occlude depth */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const wallTop = H*params.wallTop;
  const cx = W*0.5;
  const wx0=W*0.08, wx1=W*0.92;
  const dh=W*params.doorHalf, dTop=H*0.36;                 // door half-width, door lintel y
  const skip=[cx-dh, cx+dh];
  const layers = st.layers || ["vault","backwall","doors","shelves","floor","foreground"];
  const has = l => layers.includes(l);

  // ---- background field (chamber depth, lightest tone) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);

  // ---- VAULT: barrel-vaulted ceiling — solid arch bands over the chamber ----
  if (has("vault") && params.vault){
    // filled vault field so it dotifies (not thin lines)
    pen.paint(()=>{
      g.moveTo(wx0, wallTop);
      g.quadraticCurveTo(cx, wallTop-H*0.15, wx1, wallTop);
      g.lineTo(wx1, wallTop+H*0.02); g.lineTo(wx0, wallTop+H*0.02); g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    // nested vault ribs receding to the doors
    for(let i=1;i<=3;i++){
      const t=i/4, aw=(wx1-wx0)*(1-t*0.55), ah=H*(0.13-t*0.05), ay=wallTop+t*H*0.015;
      pen.ink(()=>{ g.moveTo(cx-aw/2, ay); g.quadraticCurveTo(cx, ay-ah, cx+aw/2, ay); }, 3);
    }
  }

  // ---- BACK WALL: tall shelving unit filling the chamber end (light field) ----
  if (has("backwall")){
    pen.paint(()=>{ g.rect(wx0, wallTop, wx1-wx0, horizon-wallTop); }, toneSolid(inkLevel(2)), 5);
    // side pilasters framing the shelf bay
    pen.paint(()=>{ g.rect(wx0, wallTop, W*0.03, horizon-wallTop); }, toneSolid(inkLevel(4)), 3);
    pen.paint(()=>{ g.rect(wx1-W*0.03, wallTop, W*0.03, horizon-wallTop); }, toneSolid(inkLevel(4)), 3);
  }

  // ---- SHELVES: ranked jars in tiers across the back wall ----
  if (has("shelves")){
    // upper tiers span the full bay (above the door lintel)
    shelfRow(pen,g, wx0+W*0.04, wx1-W*0.04, wallTop+H*0.10, null);
    shelfRow(pen,g, wx0+W*0.04, wx1-W*0.04, wallTop+H*0.20, skip);
    // lower tiers split left / right of the doors
    shelfRow(pen,g, wx0+W*0.04, cx-dh-W*0.01, horizon-H*0.12, null);
    shelfRow(pen,g, cx+dh+W*0.01, wx1-W*0.04, horizon-H*0.12, null);
    shelfRow(pen,g, wx0+W*0.04, cx-dh-W*0.01, horizon-H*0.02, null);
    shelfRow(pen,g, cx+dh+W*0.01, wx1-W*0.04, horizon-H*0.02, null);
  }

  // ---- DOUBLE DOORS: secure arched threshold set into the shelving ----
  if (has("doors") && params.doubleDoors){
    const dx=cx, dy=horizon;
    pen.paint(()=>{
      g.moveTo(dx-dh, dy); g.lineTo(dx-dh, dTop);
      g.quadraticCurveTo(dx, dTop-H*0.05, dx+dh, dTop);
      g.lineTo(dx+dh, dy); g.closePath();
    }, toneSolid(inkLevel(6)), 5);
    // centre seam between the two leaves
    pen.ink(()=>{ g.moveTo(dx, dy); g.lineTo(dx, dTop-H*0.02); }, 4);
    // plank lines
    for(let sgn=-1;sgn<=1;sgn+=2){ for(let k=1;k<=2;k++){
      const px=dx+sgn*dh*0.42*k; pen.seam(()=>{ g.moveTo(px,dy); g.lineTo(px,dTop+H*0.01); }, 2); } }
    // cross braces + iron ring handles
    pen.seam(()=>{ g.moveTo(dx-dh*0.9,dy-(dy-dTop)*0.5); g.lineTo(dx+dh*0.9,dy-(dy-dTop)*0.5); }, 2);
    g.strokeStyle=INK; g.lineWidth=3;
    g.beginPath(); g.arc(dx-dh*0.30, dy-(dy-dTop)*0.42, dh*0.10,0,7); g.stroke();
    g.beginPath(); g.arc(dx+dh*0.30, dy-(dy-dTop)*0.42, dh*0.10,0,7); g.stroke();
  }

  // ---- FLOOR: carrying aisle running to the doors (lightest, reads as ground) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    // aisle borders converging on the doors
    const aw=W*params.aisleHalf;
    pen.ink(()=>{ g.moveTo(cx-dh, horizon); g.lineTo(cx-aw, H); }, 3);
    pen.ink(()=>{ g.moveTo(cx+dh, horizon); g.lineTo(cx+aw, H); }, 3);
    // flagstone cross rules
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let j=1;j<=4;j++){ const y=horizon+(H-horizon)*(j/4)*(j/4);
      g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- FOREGROUND: moderate storage set on the floor, framing the aisle ----
  if (has("foreground")){
    // draw far (higher / smaller) first for occlusion, both sides
    const mid=toneSolid(inkLevel(3)), acc=toneSolid(inkLevel(5));
    // LEFT bank (kept off the central aisle)
    pithos (pen,g, W*0.26, H*0.72, H*0.12, mid);
    ingots (pen,g, W*0.37, H*0.70, H*0.09, acc);
    chest  (pen,g, W*0.15, H*0.80, H*0.13, acc);
    amphora(pen,g, W*0.27, H*0.88, H*0.15, mid);
    amphora(pen,g, W*0.09, H*0.97, H*0.16, mid);
    // RIGHT bank
    chest  (pen,g, W*0.74, H*0.71, H*0.11, acc);
    amphora(pen,g, W*0.63, H*0.72, H*0.12, mid);
    pithos (pen,g, W*0.85, H*0.83, H*0.14, mid);
    ingots (pen,g, W*0.74, H*0.90, H*0.11, acc);
    amphora(pen,g, W*0.92, H*0.98, H*0.16, mid);
  }
}

export const asset = {
  id:"location.palace-storeroom",
  type:"LOCATION",
  name:"Palace Storeroom",
  statusWord:"SECURE",
  scene:"OD-B02-S06",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["vault","backwall","doors","shelves","floor","foreground"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "threshold:doors":{x:.50,y:.58},        // the double-door secure threshold
    "aisle:mouth":{x:.50,y:.96},            // near end of the carrying aisle
    "aisle:mid":{x:.50,y:.76},
    "store:jars-left":{x:.26,y:.80},
    "store:jars-right":{x:.74,y:.80},
    "store:vats-left":{x:.34,y:.70},
    "store:vats-right":{x:.66,y:.70},
    "store:chests":{x:.30,y:.66},
    "store:metal":{x:.70,y:.66},
    "entrance:doors":{x:.50,y:.60},
    "camera:wide":{x:.50,y:.50}, "camera:doors":{x:.50,y:.62},
  },
  // walkable ground region (the carrying aisle) for scene placement / pathing
  zones:{
    walkable:{ x0:.36,y0:.62,x1:.64,y1:.98 },
    aisle:{ x0:.40,y0:.60,x1:.60,y1:.98 },
    "shelf-left":{ x0:.04,y0:.62,x1:.36,y1:.98 },
    "shelf-right":{ x0:.64,y0:.62,x1:.96,y1:.98 },
  },
  states:{
    initial:"stocked",
    nodes:{
      stocked:{ preview:{ layers:["vault","backwall","doors","shelves","floor","foreground"] } },
      "doors-open":{ preview:{ layers:["vault","backwall","shelves","floor","foreground"] } },
      bare:{ preview:{ layers:["vault","backwall","doors","floor"] } },
    },
    edges:[["stocked","doors-open"],["stocked","bare"],["doors-open","stocked"]],
  },
  channels:["reveal","doors","camera","light"],

  preview:()=>({ layers:["vault","backwall","doors","shelves","floor","foreground"], status:"SECURE", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
