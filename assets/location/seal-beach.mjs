/* location.seal-beach — the Egyptian island shore of Pharos where Menelaus lies
   in wait for the shape-shifting sea-god Proteus among his seal herd.
   LOCATION asset (OD-B04-S05). An EMPTY navigable set: sky with a high noon sun,
   an open sea, a surf boundary, and a wide foreground strand. A basking seal herd
   is laid out as rounded scenery LUMPS (not characters); shallow hiding hollows are
   scooped into the sand; a marked noon-arrival landing sits at the waterline and a
   grapple zone rings the spot where the sea-god is seized. Drawn in SOLID grays +
   hard contour into the offscreen ctx — the engine dotify pass supplies the halftone.
   No human characters are baked in; only placement / camera anchors.
   Atlas: OD-B04-S05 — Egyptian shore, seal herd, hiding hollows, surf boundary,
   noon arrival, grapple zone. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.30,       // sea/sky meeting line as fraction of H
  surfLevel:0.44,     // centre of the surf boundary band
  scallops:8,         // surf-edge lobes
  herd:6,             // basking seals laid out as scenery lumps
  hollows:3,          // hiding hollows scooped in the sand
  noonSun:true,       // high midday sun (the noon-arrival marker in the sky)
  grapple:true,       // marked grapple zone on the strand
  headlandSide:1,     // low Egyptian headland on the right of the horizon
};

/* deterministic scalloped surf-edge y at fractional x (0..1) for a band centre */
function surfY(x, H, centre, amp){
  return H*centre + Math.sin(x*Math.PI*params.scallops)*amp + Math.sin(x*Math.PI*2.1+0.7)*amp*0.55;
}

/* one basking seal drawn as a scenery LUMP: a long low mound + a raised head bump */
function drawSeal(pen, g, cx, cy, len, tone){
  const h = len*0.34;
  // body mound
  pen.paint(()=>{
    g.moveTo(cx-len, cy);
    g.quadraticCurveTo(cx-len*0.55, cy-h, cx-len*0.05, cy-h*0.92);   // back rise
    g.quadraticCurveTo(cx+len*0.55, cy-h*0.8, cx+len*0.86, cy-h*0.2); // shoulders
    g.quadraticCurveTo(cx+len*1.02, cy-h*0.05, cx+len*0.9, cy);       // raised neck root
    g.closePath();
  }, tone, 5);
  // raised head bump on the seaward end
  const hx=cx+len*0.9, hy=cy-h*0.35;
  pen.paint(()=>{ g.ellipse(hx, hy, len*0.2, len*0.24, -0.25, 0, 7); }, tone, 4);
  // a tail flipper flick at the landward end
  pen.paint(()=>{
    g.moveTo(cx-len, cy);
    g.quadraticCurveTo(cx-len*1.18, cy-h*0.5, cx-len*1.28, cy-h*0.05);
    g.quadraticCurveTo(cx-len*1.14, cy+h*0.06, cx-len, cy);
    g.closePath();
  }, tone, 4);
  // back seam so the lump reads round, not flat
  pen.ink(()=>{ g.moveTo(cx-len*0.7,cy-h*0.55); g.quadraticCurveTo(cx, cy-h*0.72, cx+len*0.6,cy-h*0.5); }, 2);
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["sky","sun","sea","headland","surf","beach","hollows","herd","grapple","arrival","anchors"];
  const has = l => layers.includes(l);
  const surfAmp = H*0.016;

  // ---- SKY (lightest tone -> sparse dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    // a couple of thin high clouds
    g.fillStyle = inkLevel(2);
    for(let i=0;i<2;i++){ g.beginPath(); g.ellipse(W*(0.20+i*0.42), horizon*(0.34+0.14*i), W*0.12, H*0.016, 0,0,7); g.fill(); }
  }

  // ---- NOON SUN high overhead (the noon-arrival marker in the sky) ----
  if (has("sun") && params.noonSun){
    const sx=W*0.5, sy=H*0.11, sr=W*0.052;
    // faint corona ring
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    g.beginPath(); g.arc(sx,sy,sr*1.7,0,7); g.stroke(); g.globalAlpha=1;
    pen.paint(()=>{ g.arc(sx,sy,sr,0,7); }, toneSolid(inkLevel(2)), 4);
    // radiating noon rays
    g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; g.beginPath();
      g.moveTo(sx+Math.cos(a)*sr*1.25, sy+Math.sin(a)*sr*1.25);
      g.lineTo(sx+Math.cos(a)*sr*1.9, sy+Math.sin(a)*sr*1.9); g.stroke(); }
  }

  // ---- SEA (mid tone) from horizon down to the surf band ----
  if (has("sea")){
    const seaBot = H*params.surfLevel + surfAmp*2;
    pen.paint(()=>{ g.rect(0,horizon,W,seaBot-horizon); }, toneSolid(inkLevel(3)), 0);
    // darker near band just above the surf gives depth without a flat blob
    g.fillStyle=inkLevel(4); g.fillRect(0, seaBot-H*0.055, W, H*0.055);
    // horizon contour
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 4);
    // a few swell lines receding toward the horizon
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.33;
    for(let j=1;j<=4;j++){
      const y = lerp(horizon+H*0.03, seaBot-H*0.02, j/5);
      g.beginPath();
      for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.9+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- low Egyptian HEADLAND on the far horizon (a delta spit with a palm tuft) ----
  if (has("headland")){
    const hx = W*(0.5 + params.headlandSide*0.32);
    const hy = horizon;
    pen.paint(()=>{
      g.moveTo(hx-W*0.16, hy);
      g.quadraticCurveTo(hx-W*0.02, hy-H*0.05, hx+W*0.14, hy-H*0.018);
      g.lineTo(hx+W*0.20, hy); g.closePath();
    }, toneSolid(inkLevel(5)), 3);
    // a single palm on the spit
    const px=hx+W*0.02, py=hy-H*0.03;
    g.strokeStyle=INK; g.lineWidth=3;
    g.beginPath(); g.moveTo(px,py); g.quadraticCurveTo(px-W*0.006,py-H*0.05,px-W*0.004,py-H*0.085); g.stroke();
    g.lineWidth=2;
    for(let i=-2;i<=2;i++){ g.beginPath(); g.moveTo(px-W*0.004,py-H*0.085);
      g.quadraticCurveTo(px-W*0.004+i*W*0.02, py-H*0.10, px-W*0.004+i*W*0.036, py-H*0.078); g.stroke(); }
  }

  // ---- SURF BOUNDARY: the scalloped waterline dividing sea from strand ----
  if (has("surf")){
    const topY = x=>surfY(x,H,params.surfLevel,surfAmp);
    // wet-sand band under the foam (a touch darker than dry strand)
    g.beginPath();
    g.moveTo(0,H); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } g.lineTo(W,H); g.closePath();
    g.fillStyle=inkLevel(3); g.fill();
    // the foam itself: lightest tone, scalloped upper edge
    g.beginPath();
    g.moveTo(0, topY(0)+H*0.032);
    for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); }
    g.lineTo(W, topY(1)+H*0.032); g.closePath();
    g.fillStyle=inkLevel(1); g.fill();
    // hard contour of the seaward foam edge (the surf BOUNDARY line)
    pen.ink(()=>{ g.moveTo(0,topY(0)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } }, 4);
    // scattered foam lobes along the boundary
    g.fillStyle=inkLevel(1); g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<params.scallops;i++){
      const x=(i+0.5)/params.scallops; const y=topY(x)+H*0.011;
      g.beginPath(); g.arc(x*W, y, W*0.016, 0, 7); g.fill(); g.stroke();
    }
  }

  // ---- BEACH (dry Egyptian sand, foreground, light so it reads as ground) ----
  if (has("beach")){
    const topY = x=>surfY(x,H,params.surfLevel,surfAmp)+H*0.038;
    g.beginPath();
    g.moveTo(0,H); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } g.lineTo(W,H); g.closePath();
    g.fillStyle=inkLevel(2); g.fill();
    // faint wind-drift ripple lines in the sand
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.26;
    for(let j=1;j<=3;j++){ const y=lerp(H*(params.surfLevel+0.11), H*0.95, j/3);
      g.beginPath(); for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.6+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy);} g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- HIDING HOLLOWS scooped into the sand (shallow pits to lie in wait) ----
  if (has("hollows")){
    const spots = [ {x:0.20,y:0.80}, {x:0.50,y:0.90}, {x:0.78,y:0.83} ].slice(0, params.hollows);
    for(const s of spots){
      const hx=W*s.x, hy=H*s.y, hw=W*0.075, hh=H*0.030;
      // the scooped hollow: darker floor, rounded, with a sand rim
      pen.paint(()=>{ g.ellipse(hx, hy, hw, hh, 0, 0, 7); }, toneSolid(inkLevel(4)), 4);
      // inner shadow at the bottom of the pit
      g.fillStyle=inkLevel(5); g.beginPath(); g.ellipse(hx, hy+hh*0.28, hw*0.7, hh*0.5, 0, 0, 7); g.fill();
      // heaped sand rim on the seaward lip (lighter)
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
      g.beginPath(); g.ellipse(hx, hy-hh*0.7, hw*1.05, hh*0.5, 0, Math.PI, Math.PI*2); g.stroke();
      g.globalAlpha=1;
    }
  }

  // ---- SEAL HERD basking as scenery LUMPS along the strand ----
  if (has("herd")){
    const n=params.herd;
    // two loose ranks: a near rank (bigger) and a far rank (smaller, higher up the sand)
    for(let i=0;i<n;i++){
      const far = i%2===0;
      const t = (i+0.5)/n;
      const cx = W*(0.12 + t*0.76) + (far? W*0.02 : -W*0.03);
      const cy = far ? H*(params.surfLevel+0.16) : H*(params.surfLevel+0.30);
      const len = far ? W*0.075 : W*0.10;
      const tone = toneSolid(inkLevel(far?5:6));
      drawSeal(pen, g, cx, cy, len, tone);
    }
  }

  // ---- GRAPPLE ZONE: a marked ring on the strand where the sea-god is seized ----
  if (has("grapple") && params.grapple){
    const gx=W*0.5, gy=H*0.66;
    // scuffed struggle ring in the sand
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.6;
    g.beginPath(); g.ellipse(gx, gy, W*0.14, H*0.05, 0, 0, 7); g.stroke();
    g.lineWidth=2; g.globalAlpha=0.4;
    g.beginPath(); g.ellipse(gx, gy, W*0.10, H*0.036, 0, 0, 7); g.stroke();
    g.globalAlpha=1;
    // four corner grip stakes marking the hold
    g.strokeStyle=INK; g.lineWidth=3;
    const mk=[[-1,-1],[1,-1],[-1,1],[1,1]];
    for(const [sx,sy] of mk){
      const mx=gx+sx*W*0.14, my=gy+sy*H*0.05;
      g.beginPath(); g.moveTo(mx,my-H*0.012); g.lineTo(mx,my+H*0.012); g.stroke();
      g.beginPath(); g.moveTo(mx-W*0.012,my); g.lineTo(mx+W*0.012,my); g.stroke();
    }
    // scuff drag-marks radiating out of the ring
    g.lineWidth=2; g.globalAlpha=0.5;
    for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; g.beginPath();
      g.moveTo(gx+Math.cos(a)*W*0.06, gy+Math.sin(a)*H*0.022);
      g.lineTo(gx+Math.cos(a)*W*0.13, gy+Math.sin(a)*H*0.046); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- NOON ARRIVAL: marked landing on the wet sand at the surf boundary ----
  if (has("arrival")){
    const ax=W*0.34, ay=H*(params.surfLevel+0.075);
    // landing footprint pair pressed into the wet sand
    g.fillStyle=inkLevel(5);
    for(const off of [-W*0.018, W*0.018]){
      g.beginPath(); g.ellipse(ax+off, ay, W*0.012, H*0.016, 0, 0, 7); g.fill();
    }
    // an X marker of the arrival anchor
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    g.beginPath(); g.moveTo(ax-W*0.03, ay-H*0.02); g.lineTo(ax+W*0.03, ay+H*0.02);
    g.moveTo(ax+W*0.03, ay-H*0.02); g.lineTo(ax-W*0.03, ay+H*0.02); g.stroke();
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.seal-beach",
  type:"LOCATION",
  name:"Seal Beach",
  statusWord:"BASKING",
  scene:"OD-B04-S05",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","sun","sea","headland","surf","beach","hollows","herd","grapple","arrival","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "arrival:noon":{x:.34,y:.51},        // noon-arrival landing at the waterline
    "zone:grapple":{x:.50,y:.66},        // centre of the marked grapple zone
    "hollow:a":{x:.20,y:.80},            // hiding hollows scooped in the sand
    "hollow:b":{x:.50,y:.90},
    "hollow:c":{x:.78,y:.83},
    "herd:centre":{x:.50,y:.62},         // middle of the basking seal herd
    "boundary:surf":{x:.50,y:.44},       // the surf boundary (sea/strand divide)
    "view:headland":{x:.82,y:.30},       // sightline to the Egyptian headland
    "entrance:strand":{x:.94,y:.94},     // walk-on from the far end of the beach
    "camera:wide":{x:.50,y:.50}, "camera:grapple":{x:.50,y:.62}, "camera:herd":{x:.50,y:.60},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    dryStrand:{ x0:.04,y0:.56,x1:.96,y1:.98 },
    wetSand:{ x0:.04,y0:.48,x1:.96,y1:.58 },
    surf:{ x0:.00,y0:.40,x1:1.0,y1:.50 },
    sea:{ x0:.00,y0:.30,x1:1.0,y1:.42 },
    grapple:{ x0:.36,y0:.60,x1:.64,y1:.72 },
    hollows:{ x0:.10,y0:.74,x1:.90,y1:.96 },
  },
  states:{
    initial:"basking",
    nodes:{
      basking:{ preview:{ layers:["sky","sun","sea","headland","surf","beach","hollows","herd","grapple","arrival"] } },
      "in-wait":{ preview:{ layers:["sky","sun","sea","headland","surf","beach","hollows","herd"] } },
      "seized":{ preview:{ layers:["sky","sun","sea","headland","surf","beach","herd","grapple"] } },
      bare:{ preview:{ layers:["sky","sun","sea","headland","surf","beach"] } },
    },
    edges:[["basking","in-wait"],["in-wait","seized"],["basking","bare"],["seized","basking"]],
  },
  channels:["reveal","camera","tide","sun","light"],

  preview:()=>({ layers:["sky","sun","sea","headland","surf","beach","hollows","herd","grapple","arrival"], status:"BASKING", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
