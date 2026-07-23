/* location.olympian-council-hall — lofty divine assembly chamber.
   EXEMPLAR LOCATION asset. Reference module for writer agents building any
   non-figure type (LOCATION / SET_PIECE / ENVIRONMENT / PROP / ENSEMBLE /
   DIVINE_FX). Shows the pattern: draw an EMPTY navigable set in SOLID grays
   + hard contour into the offscreen ctx (the engine dotify pass supplies the
   halftone), declare depth layers, walkable zones, entrances/exits, camera
   anchors, and alternate states. Do NOT bake characters in.
   Atlas: OD-B01-S01 — central throne, radial god-places, sky threshold, portal. */
import { makePen, toneSolid, inkLevel, INK } from "/engine/halfworld-engine.mjs";

const params = {
  columns:6,            // radial places, one column per god-seat pair
  throne:true,
  skyThreshold:true,    // open sky at the back
  portal:true,          // distant-world portal (Calypso's island)
  floorLevel:0.72,      // horizon as fraction of H
};

/* draw a subset of layers so scene state can reveal/occlude depth */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const layers = st.layers || ["sky","backwall","portal","throne","columns","floor","anchors"];
  const has = l => layers.includes(l);

  // ---- BACKGROUND: sky threshold (lightest tone -> few dots) ----
  if (has("sky") && params.skyThreshold){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    // a band of cloud steps
    g.fillStyle = inkLevel(2);
    for(let i=0;i<5;i++){ g.beginPath(); g.ellipse(W*(0.15+i*0.18), horizon*(0.3+0.08*(i%2)), W*0.11, H*0.03, 0,0,7); g.fill(); }
  }

  // ---- BACK WALL of the chamber (mid tone) ----
  if (has("backwall")){
    pen.paint(()=>{ g.rect(W*0.06, horizon-H*0.34, W*0.88, H*0.34); }, toneSolid(inkLevel(3)), 5);
    // a cornice line
    pen.ink(()=>{ g.moveTo(W*0.06,horizon-H*0.34); g.lineTo(W*0.94,horizon-H*0.34); }, 4);
  }

  // ---- distant-world PORTAL (Calypso's island) framed in the back wall ----
  if (has("portal") && params.portal){
    const px=W*0.5, py=horizon-H*0.19, pr=W*0.10;
    pen.paint(()=>{ g.ellipse(px,py,pr,pr*1.25,0,0,7); }, toneSolid(inkLevel(2)), 5);
    // a tiny island silhouette inside
    g.fillStyle=inkLevel(6); g.beginPath(); g.ellipse(px,py+pr*0.5,pr*0.6,pr*0.22,0,0,7); g.fill();
    g.beginPath(); g.moveTo(px-pr*0.1,py+pr*0.4); g.lineTo(px,py-pr*0.3); g.lineTo(px+pr*0.15,py+pr*0.4); g.fill();
  }

  // ---- central THRONE (foreground-mid, darker) ----
  if (has("throne") && params.throne){
    const tx=W*0.5, ty=horizon, tw=W*0.16, th=H*0.26;
    pen.paint(()=>{ g.rect(tx-tw/2, ty-th, tw, th); }, toneSolid(inkLevel(5)), 5);          // seat back
    pen.paint(()=>{ g.rect(tx-tw*0.62, ty-th*0.42, tw*1.24, th*0.42); }, toneSolid(inkLevel(6)), 5); // seat
    // arms
    pen.paint(()=>{ g.rect(tx-tw*0.62, ty-th*0.42, tw*0.16, th*0.5); }, toneSolid(inkLevel(6)),5);
    pen.paint(()=>{ g.rect(tx+tw*0.46, ty-th*0.42, tw*0.16, th*0.5); }, toneSolid(inkLevel(6)),5);
  }

  // ---- radial COLUMNS + god-places (framing, receding) ----
  if (has("columns")){
    const n=params.columns;
    for(let i=0;i<n;i++){
      const side = i<n/2 ? -1 : 1;
      const idx  = i<n/2 ? i : i-Math.ceil(n/2);
      const depth = idx/(n/2);                       // 0 near .. 1 far
      const cx = W*0.5 + side*(W*0.20 + depth*W*0.24);
      const ch = H*0.30*(1-depth*0.4), cw = W*0.035*(1-depth*0.35);
      const cy = horizon - depth*H*0.10;
      pen.paint(()=>{ g.rect(cx-cw/2, cy-ch, cw, ch); }, toneSolid(inkLevel(4)), 5);         // shaft
      pen.paint(()=>{ g.rect(cx-cw*0.8, cy-ch, cw*1.6, ch*0.08); }, toneSolid(inkLevel(5)),4);// capital
      // a low god-place block beside each column
      pen.paint(()=>{ g.rect(cx+side*cw*1.4-cw, cy-ch*0.16, cw*2, ch*0.16); }, toneSolid(inkLevel(3)),4);
    }
  }

  // ---- FLOOR with radial perspective (foreground, lightest so it reads as ground) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(W*0.5, horizon); g.lineTo(W*0.5+i*W*0.13, H); g.stroke(); }
    for(let j=1;j<=4;j++){ const y=horizon+(H-horizon)*(j/4)*(j/4); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.olympian-council-hall",
  type:"LOCATION",
  name:"Olympian Council Hall",
  statusWord:"DIVINE",
  scene:"OD-B01-S01",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","backwall","portal","throne","columns","floor","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "throne:zeus":{x:.50,y:.70}, "place:athena":{x:.34,y:.66}, "place:god-a":{x:.66,y:.66},
    "place:god-b":{x:.24,y:.62}, "place:god-c":{x:.76,y:.62},
    "portal:calypso":{x:.50,y:.53}, "threshold:sky":{x:.50,y:.20},
    "entrance:left":{x:.06,y:.80}, "exit:right":{x:.94,y:.80},
    "camera:wide":{x:.50,y:.50}, "camera:throne":{x:.50,y:.66},
  },
  // walkable ground region (for scene placement / pathing)
  zones:{ walkable:{ x0:.10,y0:.66,x1:.90,y1:.96 }, dais:{ x0:.40,y0:.64,x1:.60,y1:.74 } },
  states:{
    initial:"assembled",
    nodes:{
      assembled:{ preview:{ layers:["sky","backwall","portal","throne","columns","floor"] } },
      "poseidon-absent":{ preview:{ layers:["sky","backwall","portal","throne","columns","floor"] } },
      empty:{ preview:{ layers:["sky","backwall","throne","columns","floor"] } },
    },
    edges:[["assembled","poseidon-absent"],["assembled","empty"]],
  },
  channels:["reveal","camera","light"],

  preview:()=>({ layers:["sky","backwall","portal","throne","columns","floor"], status:"DIVINE", progress:.18 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
