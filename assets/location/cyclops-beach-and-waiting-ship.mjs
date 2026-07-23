/* location.cyclops-beach-and-waiting-ship — the shore below the Cyclops' cliff
   where Odysseus' ship lies waiting to run for open water.
   LOCATION asset for OD-B09-S10. An EMPTY navigable set drawn in SOLID grays +
   hard contour into the offscreen ctx (the engine dotify pass supplies the
   halftone). Depth reads fg beach / mid launch-water / bg cliff: a headland on
   the left with a dark cave-mouth and a switchback path scuffed down to the
   sand; a flat loading area with keel grooves running into the launch lane; the
   waiting ship moored just off the berth, prow to sea; scattered hidden-crew
   spots (boulders + low scrub) to either side; and a safe-distance marker buoy
   standing off in the deep water. NO baked characters — anchors + zones only.
   Atlas: cave-to-shore path · hidden crew · loading area · launch water ·
   safe-distance marker · waiting ship · empty navigable set. */
import { makePen, toneSolid, inkLevel, INK, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.28,       // sea / sky meeting line as fraction of H
  waterLine:0.60,     // launch-water / beach meeting line
  shipSide:1,         // waiting ship stands off to the right (open water)
  cliffSide:-1,       // cliff headland + cave on the left
  hideSpots:3,        // hidden-crew boulder/scrub clusters
  marker:true,        // safe-distance offshore marker buoy
  keelGrooves:true,   // launch-route grooves from loading area into the surf
};

/* a moored galley silhouette: low crescent hull, curled stern + prow posts, a
   mast with a furled sail, a row of oar ticks, and a reflection under it. */
function waitingShip(pen, g, sx, waterY, hw, hh, dir){
  // reflection dashes on the water first (behind the hull)
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.3;
  for(let i=-3;i<=3;i++){ const rx=sx+i*hw*0.22; g.beginPath();
    g.moveTo(rx, waterY+hh*0.9); g.lineTo(rx, waterY+hh*1.9); g.stroke(); }
  g.globalAlpha=1;
  // hull body
  pen.paint(()=>{
    g.moveTo(sx-hw, waterY-hh*0.15);
    g.quadraticCurveTo(sx, waterY+hh, sx+hw, waterY-hh*0.15);   // rounded underside
    g.quadraticCurveTo(sx, waterY-hh*0.7, sx-hw, waterY-hh*0.15); // gunwale line back
    g.closePath();
  }, toneSolid(inkLevel(6)), 5);
  // stern post (landward) curling up
  pen.paint(()=>{
    g.moveTo(sx-hw, waterY-hh*0.15);
    g.quadraticCurveTo(sx-hw-dir*hw*0.10, waterY-hh*1.6, sx-hw+dir*hw*0.06, waterY-hh*1.7);
    g.quadraticCurveTo(sx-hw+dir*hw*0.02, waterY-hh*1.0, sx-hw+hw*0.10, waterY-hh*0.4);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // prow post (seaward), a tall curved beak
  pen.paint(()=>{
    g.moveTo(sx+hw, waterY-hh*0.15);
    g.quadraticCurveTo(sx+hw+dir*hw*0.14, waterY-hh*1.9, sx+hw+dir*hw*0.30, waterY-hh*1.5);
    g.quadraticCurveTo(sx+hw+dir*hw*0.08, waterY-hh*1.1, sx+hw-hw*0.08, waterY-hh*0.4);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // oar-port ticks along the hull
  g.strokeStyle=INK; g.lineWidth=2;
  for(let i=-3;i<=3;i++){ const ox=sx+i*hw*0.24; g.beginPath();
    g.moveTo(ox, waterY-hh*0.28); g.lineTo(ox, waterY+hh*0.05); g.stroke(); }
  // mast
  pen.ink(()=>{ g.moveTo(sx, waterY-hh*0.5); g.lineTo(sx, waterY-hh*4.6); }, 4);
  // yard + furled sail bundle across the mast
  pen.ink(()=>{ g.moveTo(sx-hw*0.5, waterY-hh*3.9); g.lineTo(sx+hw*0.5, waterY-hh*3.9); }, 3);
  pen.paint(()=>{ g.rect(sx-hw*0.34, waterY-hh*3.9, hw*0.68, hh*0.9); }, toneSolid(inkLevel(4)), 3);
  // two stay lines from masthead to the posts
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.65;
  g.beginPath(); g.moveTo(sx, waterY-hh*4.6); g.lineTo(sx-hw*0.85, waterY-hh*0.6); g.stroke();
  g.beginPath(); g.moveTo(sx, waterY-hh*4.6); g.lineTo(sx+hw*0.9, waterY-hh*0.6); g.stroke();
  g.globalAlpha=1;
}

/* a hidden-crew spot: a boulder with a tuft of low scrub, marked with a faint
   scuffed ring so it reads as a place a crewman can crouch out of sight. */
function hideSpot(pen, g, W, H, cx, cy, r){
  // scuffed ground ring
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
  g.beginPath(); g.ellipse(cx, cy+r*0.5, r*1.5, r*0.6, 0,0,7); g.stroke(); g.globalAlpha=1;
  // boulder
  pen.paint(()=>{ g.ellipse(cx, cy, r, r*0.8, 0,0,7); }, toneSolid(inkLevel(5)), 4);
  pen.seam(()=>{ g.moveTo(cx-r*0.5, cy-r*0.1); g.lineTo(cx+r*0.3, cy-r*0.35); }, 2);
  // low scrub tufts leaning over it (cover)
  g.strokeStyle=INK; g.lineWidth=2;
  for(let i=-2;i<=2;i++){ const gx=cx+i*r*0.32, gy=cy-r*0.6;
    g.beginPath(); g.moveTo(gx, gy); g.quadraticCurveTo(gx+r*0.1, gy-r*0.7, gx+r*0.2, gy-r*1.05); g.stroke(); }
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const water   = H*params.waterLine;
  const layers = st.layers || ["sky","sea","marker","ship","beach","cliff","cave","path","loading","hide","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest -> sparse dots) with low cloud banks ----
  if (has("sky")){
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,horizon+H*0.01);
    g.fillStyle=inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.30+i*0.28), horizon*(0.44+0.14*(i%2)), W*0.12, H*0.02, 0,0,7); g.fill(); }
  }

  // ---- SEA / LAUNCH WATER (mid tone) from horizon down to the beach ----
  if (has("sea")){
    pen.paint(()=>{ g.rect(0,horizon,W,water-horizon); }, toneSolid(inkLevel(3)), 0);
    // a darker near band gives the launch lane depth without a flat blob
    g.fillStyle=inkLevel(4); g.fillRect(0, water-H*0.055, W, H*0.055);
    // horizon contour
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 4);
    // receding swell lines
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let j=1;j<=4;j++){ const y=lerp(horizon+H*0.03, water-H*0.02, j/5);
      g.beginPath(); for(let s=0;s<=20;s++){ const x=W*s/20, yy=y+Math.sin(s*0.9+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy);} g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- SAFE-DISTANCE MARKER: a buoy standing off in the deep water ----
  if (has("marker") && params.marker){
    const mx=W*(0.5+params.shipSide*0.32), my=horizon+H*0.06;
    // concentric standoff rings on the water (the safe-distance zone)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    for(let k=1;k<=3;k++){ g.beginPath(); g.ellipse(mx, my+H*0.01, W*0.03*k, H*0.012*k, 0,0,7); g.stroke(); }
    g.globalAlpha=1;
    // buoy float + pole + flag
    pen.paint(()=>{ g.ellipse(mx, my, W*0.018, H*0.016, 0,0,7); }, toneSolid(inkLevel(6)), 3);
    pen.ink(()=>{ g.moveTo(mx, my-H*0.012); g.lineTo(mx, my-H*0.06); }, 3);
    pen.paint(()=>{ g.moveTo(mx, my-H*0.06); g.lineTo(mx+W*0.03, my-H*0.05); g.lineTo(mx, my-H*0.042); g.closePath(); }, toneSolid(inkLevel(5)), 2);
  }

  // ---- THE WAITING SHIP moored just off the berth, prow to open sea ----
  if (has("ship")){
    waitingShip(pen, g, W*(0.5+params.shipSide*0.10), water-H*0.10, W*0.19, H*0.045, params.shipSide);
    // a mooring line from the stern back toward the berth on shore
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    g.beginPath(); g.moveTo(W*0.41, water-H*0.11);
    g.quadraticCurveTo(W*0.44, water-H*0.02, W*0.47, water+H*0.02); g.stroke();
    g.globalAlpha=1;
  }

  // ---- BEACH (dry sand, foreground, light so it reads as ground) ----
  if (has("beach")){
    const topY = x=> water + Math.sin(x*Math.PI*4)*H*0.008 + Math.sin(x*Math.PI*1.7)*H*0.006;
    g.beginPath();
    g.moveTo(0, topY(0)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); }
    g.lineTo(W,H); g.lineTo(0,H); g.closePath();
    g.fillStyle=inkLevel(2); g.fill();
    // waterline contour + foam scallops where sand meets the launch water
    pen.ink(()=>{ g.moveTo(0,topY(0)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } }, 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let x=0;x<W;x+=W*0.05){ g.beginPath(); g.arc(x+W*0.025, topY((x+W*0.025)/W)+H*0.004, W*0.022, Math.PI, 0); g.stroke(); }
    g.globalAlpha=1;
    // faint drift lines in the dry sand
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.24;
    for(let j=1;j<=3;j++){ const y=lerp(water+H*0.10, H*0.96, j/3);
      g.beginPath(); for(let s=0;s<=20;s++){ const x=W*s/20, yy=y+Math.sin(s*0.7+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy);} g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- CLIFF HEADLAND (left, a compact mid-light mass so the cave reads dark) ----
  if (has("cliff")){
    const s=params.cliffSide;
    const bx = s<0 ? 0 : W;
    pen.paint(()=>{
      g.moveTo(bx, 0);
      g.lineTo(bx - s*W*0.30, 0);
      g.lineTo(bx - s*W*0.31, H*0.10);
      g.quadraticCurveTo(bx - s*W*0.35, H*0.22, bx - s*W*0.29, H*0.32);
      g.quadraticCurveTo(bx - s*W*0.33, H*0.46, bx - s*W*0.23, H*0.56);
      g.quadraticCurveTo(bx - s*W*0.17, H*0.62, bx - s*W*0.20, H*0.66);
      g.lineTo(bx, H*0.68);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // ridge contour of the headland face
    pen.ink(()=>{
      g.moveTo(bx - s*W*0.31, H*0.10);
      g.quadraticCurveTo(bx - s*W*0.35, H*0.22, bx - s*W*0.29, H*0.32);
      g.quadraticCurveTo(bx - s*W*0.33, H*0.46, bx - s*W*0.23, H*0.56);
      g.quadraticCurveTo(bx - s*W*0.17, H*0.62, bx - s*W*0.20, H*0.66);
    }, 4);
    // strata seams raking down the face
    pen.seam(()=>{ g.moveTo(bx, H*0.18); g.quadraticCurveTo(bx-s*W*0.16, H*0.22, bx-s*W*0.28, H*0.30); }, 3);
    pen.seam(()=>{ g.moveTo(bx, H*0.40); g.quadraticCurveTo(bx-s*W*0.14, H*0.46, bx-s*W*0.22, H*0.54); }, 3);
    // a couple of vertical crack marks
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    for(const t of [0.08,0.18]){ g.beginPath();
      g.moveTo(bx-s*W*t, H*0.06); g.lineTo(bx-s*W*(t+0.02), H*0.48); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- CAVE MOUTH: dark arched opening punched into the headland ----
  if (has("cave")){
    const s=params.cliffSide, mx=W*(0.5+s*0.36), mw=W*0.13, baseY=H*0.34, topY=H*0.17;
    pen.paint(()=>{
      g.moveTo(mx-mw/2, baseY);
      g.lineTo(mx-mw/2, topY+H*0.05);
      g.quadraticCurveTo(mx, topY-H*0.05, mx+mw/2, topY+H*0.05);
      g.lineTo(mx+mw/2, baseY);
      g.closePath();
    }, toneSolid(inkLevel(7)), 5);
    // inner-shadow lip to seat it into the rock
    pen.seam(()=>{ g.moveTo(mx-mw/2, topY+H*0.05); g.quadraticCurveTo(mx, topY-H*0.05, mx+mw/2, topY+H*0.05); }, 3);
    // flanking threshold boulders
    pen.paint(()=>{ g.ellipse(mx-mw*0.72, baseY-H*0.01, W*0.028, H*0.024, 0,0,7); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.ellipse(mx+mw*0.68, baseY-H*0.008, W*0.03, H*0.026, 0,0,7); }, toneSolid(inkLevel(5)), 3);
  }

  // ---- CAVE-TO-SHORE PATH: a worn switchback ribbon down to the sand ----
  if (has("path")){
    const s=params.cliffSide, mx=W*(0.5+s*0.36);
    const pts=[ [mx, H*0.35], [mx-s*W*0.09, H*0.41], [mx+s*W*0.03, H*0.47],
                [mx-s*W*0.05, H*0.54], [W*0.28, H*0.61], [W*0.33, water+H*0.03] ];
    // pale worn band
    g.lineCap="round"; g.lineJoin="round";
    g.strokeStyle=inkLevel(2); g.lineWidth=8;
    g.beginPath(); g.moveTo(pts[0][0],pts[0][1]);
    for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]); g.stroke();
    // dark seating edge just below
    g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(pts[0][0],pts[0][1]+4);
    for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0],pts[i][1]+4); g.stroke();
    g.globalAlpha=1; g.lineCap="butt";
  }

  // ---- LOADING AREA: a marked flat patch on the sand + keel grooves to water ----
  if (has("loading")){
    const lx=W*0.42, ly=water+H*0.12;
    // marked flat staging patch (a scored rectangle on the sand)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    g.beginPath();
    g.moveTo(lx-W*0.11, ly-H*0.02); g.lineTo(lx+W*0.12, ly-H*0.03);
    g.lineTo(lx+W*0.16, ly+H*0.05); g.lineTo(lx-W*0.13, ly+H*0.055); g.closePath(); g.stroke();
    g.globalAlpha=1;
    // a couple of stacked cargo/supply blocks staged at the edge
    pen.paint(()=>{ g.rect(lx-W*0.06, ly-H*0.005, W*0.05, H*0.03); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.rect(lx+W*0.01, ly+H*0.005, W*0.045, H*0.026); }, toneSolid(inkLevel(6)), 3);
    // keel grooves running from the loading patch into the launch water
    if (params.keelGrooves){
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.6;
      for(const off of [-W*0.03, W*0.03]){
        g.beginPath();
        g.moveTo(lx+off, ly+H*0.02);
        g.quadraticCurveTo(lx+off*1.3+W*0.05, water+H*0.01, W*0.50+off, water-H*0.02);
        g.stroke();
      }
      g.globalAlpha=1;
    }
  }

  // ---- HIDDEN-CREW SPOTS: boulders + scrub the crew crouch behind ----
  if (has("hide")){
    const spots=[ [0.16,0.70,W*0.05], [0.30,0.88,W*0.06], [0.74,0.83,W*0.055] ];
    for(let i=0;i<Math.min(params.hideSpots,spots.length);i++){
      const [fx,fy,r]=spots[i]; hideSpot(pen, g, W, H, W*fx, H*fy, r);
    }
  }
}

export const asset = {
  id:"location.cyclops-beach-and-waiting-ship",
  type:"LOCATION",
  name:"Cyclops Beach and Waiting Ship",
  statusWord:"POISED",
  scene:"OD-B09-S10",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","sea","marker","ship","beach","cliff","cave","path","loading","hide","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "threshold:cave-mouth":{x:.16,y:.32},          // top of the cave-to-shore path
    "path:foot":{x:.33,y:.62},                     // where the path reaches the sand
    "berth:ship":{x:.60,y:.50},                    // the waiting ship's mooring
    "prow:sea":{x:.79,y:.44},                      // ship's prow, pointing to open water
    "loading:area":{x:.42,y:.72},                  // the marked staging patch on the sand
    "route:launch":{x:.50,y:.58},                  // foot of the keel-groove launch route
    "marker:safe-distance":{x:.82,y:.34},          // offshore standoff buoy
    "hide:cliff-foot":{x:.16,y:.70}, "hide:mid-beach":{x:.30,y:.88}, "hide:right":{x:.74,y:.83},
    "entrance:cave":{x:.16,y:.32}, "exit:beach-right":{x:.96,y:.92},
    "camera:wide":{x:.50,y:.50}, "camera:ship":{x:.62,y:.48}, "camera:loading":{x:.44,y:.68},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    beach:{ x0:.06,y0:.62,x1:.98,y1:.98 },
    loading:{ x0:.28,y0:.66,x1:.60,y1:.82 },
    launchWater:{ x0:.30,y0:.52,x1:.92,y1:.62 },
    sea:{ x0:.00,y0:.28,x1:1.0,y1:.52 },
    cave:{ x0:.08,y0:.16,x1:.24,y1:.34 },
  },
  states:{
    initial:"waiting",
    nodes:{
      waiting:{ preview:{ layers:["sky","sea","marker","ship","beach","cliff","cave","path","loading","hide"] } },
      "crew-hidden":{ preview:{ layers:["sky","sea","marker","ship","beach","cliff","cave","path","hide"] } },
      "loading-up":{ preview:{ layers:["sky","sea","marker","ship","beach","cliff","cave","path","loading"] } },
      "launch-ready":{ preview:{ layers:["sky","sea","marker","ship","beach","cliff","path","loading"] } },
      "empty-set":{ preview:{ layers:["sky","sea","beach","cliff","cave","path"] } },
    },
    edges:[["waiting","crew-hidden"],["waiting","loading-up"],["loading-up","launch-ready"],
           ["crew-hidden","launch-ready"],["waiting","empty-set"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({ layers:["sky","sea","marker","ship","beach","cliff","cave","path","loading","hide"], status:"POISED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
