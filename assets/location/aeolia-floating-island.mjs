/* location.aeolia-floating-island — the bronze-walled floating home of Aeolus.
   LOCATION asset. An EMPTY navigable set drawn in SOLID grays + hard contour
   (the engine dotify pass supplies the halftone). Declares depth layers,
   walkable deck zones, entrances/thresholds, camera + placement anchors, and
   alternate states. No baked characters.
   Atlas: OD-B10-S01 — bronze-walled island: palace, family feast hall, harbor,
   wind-storage chamber, floating over a sea boundary edge. */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "/engine/halfworld-engine.mjs";

const params = {
  deckBack:0.50,     // far edge of the top surface (fraction of H)
  deckFront:0.66,    // front rim where the bronze wall stands
  keelY:0.86,        // bottom point of the island's rocky underside
  seaY:0.93,         // the floating sea boundary edge below the island
  wallMerlons:16,    // crenellations along the bronze rim
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const deckBack = H*params.deckBack;
  const deckFront = H*params.deckFront;
  const keelY = H*params.keelY;
  const seaY = H*params.seaY;
  const layers = st.layers || ["sky","sea","underside","deck","feast-hall","palace","wind-chamber","bronze-wall","harbor"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest -> few dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,deckBack);
    // a couple of high cloud steps
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.20+i*0.30), H*(0.14+0.05*(i%2)), W*0.10, H*0.028, 0,0,7); g.fill(); }
  }

  // ---- SEA boundary edge below the floating island (light band + wave dashes) ----
  if (has("sea")){
    g.fillStyle = inkLevel(2); g.fillRect(0,seaY,W,H-seaY);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
    for(let r=0;r<3;r++){ const y=seaY+(H-seaY)*(0.25+r*0.32);
      for(let x=-((r*18)%36); x<W; x+=36){ g.beginPath(); g.moveTo(x,y); g.lineTo(x+16,y); g.stroke(); } }
    g.globalAlpha=1;
    // the sea edge line (the boundary the island floats over)
    pen.ink(()=>{ g.moveTo(0,seaY); g.lineTo(W,seaY); }, 3);
  }

  // ---- ISLAND UNDERSIDE: rocky mass tapering to a keel (dark) ----
  if (has("underside")){
    pen.paint(()=>{
      g.moveTo(W*0.06, deckFront);
      g.lineTo(W*0.94, deckFront);
      g.lineTo(W*0.72, keelY);
      g.quadraticCurveTo(W*0.5, keelY+H*0.05, W*0.28, keelY);
      g.closePath();
    }, toneSolid(inkLevel(6)), 5);
    // strata seams on the rock
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    for(let i=1;i<=3;i++){ const y=deckFront+(keelY-deckFront)*(i/4);
      g.beginPath(); g.moveTo(W*(0.10+i*0.04), y); g.lineTo(W*(0.90-i*0.05), y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- DECK: the top platform surface (mid-light, slight perspective) ----
  if (has("deck")){
    pen.paint(()=>{
      g.moveTo(W*0.14, deckBack);
      g.lineTo(W*0.86, deckBack);
      g.lineTo(W*0.94, deckFront);
      g.lineTo(W*0.06, deckFront);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // paving lines receding toward the back
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let i=1;i<=5;i++){ const t=i/6; const y=deckBack+(deckFront-deckBack)*t;
      const xl = W*(0.14 - 0.08*t), xr = W*(0.86 + 0.08*t);
      g.beginPath(); g.moveTo(W*0.14+(W*0.06-W*0.14)*0 + xl-xl,y); // noop guard
      g.moveTo(xl,y); g.lineTo(xr,y); g.stroke(); }
    for(let j=-3;j<=3;j++){ g.beginPath(); g.moveTo(W*0.5+j*W*0.06, deckBack); g.lineTo(W*0.5+j*W*0.13, deckFront); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- FEAST HALL: long gabled family hall, left wing (mid) ----
  if (has("feast-hall")){
    const hx=W*0.24, hb=deckBack+H*0.02, hw=W*0.26, hh=H*0.16;
    // body
    pen.paint(()=>{ g.rect(hx-hw/2, hb-hh, hw, hh); }, toneSolid(inkLevel(3)), 5);
    // gable roof
    pen.paint(()=>{ g.moveTo(hx-hw/2-6, hb-hh); g.lineTo(hx, hb-hh-H*0.055); g.lineTo(hx+hw/2+6, hb-hh); g.closePath(); }, toneSolid(inkLevel(5)), 5);
    // a row of feast-hall openings (doorways to the family feast)
    g.fillStyle=inkLevel(6);
    for(let k=0;k<4;k++){ const dx=hx-hw/2+hw*(0.14+k*0.24); g.beginPath(); g.rect(dx, hb-hh*0.62, hw*0.11, hh*0.62); g.fill(); }
  }

  // ---- WIND-STORAGE CHAMBER: sealed domed silo, right wing (mid-dark) ----
  if (has("wind-chamber")){
    const wx=W*0.75, wb=deckBack+H*0.03, ww=W*0.15, wh=H*0.15;
    // cylinder body
    pen.paint(()=>{ g.rect(wx-ww/2, wb-wh, ww, wh); }, toneSolid(inkLevel(4)), 5);
    // dome cap
    pen.paint(()=>{ g.ellipse(wx, wb-wh, ww/2, H*0.045, 0, Math.PI, 0); g.closePath(); }, toneSolid(inkLevel(5)), 5);
    // sealed round door
    pen.paint(()=>{ g.arc(wx, wb-wh*0.42, ww*0.24, 0, 7); }, toneSolid(inkLevel(6)), 4);
    // radiating vent slits (the pent winds)
    g.strokeStyle=INK; g.lineWidth=2;
    for(let a=0;a<6;a++){ const ang=Math.PI*(0.15+a*0.12); const r0=ww*0.30, r1=ww*0.42;
      g.beginPath(); g.moveTo(wx+Math.cos(ang)*r0, wb-wh*0.68+Math.sin(-ang)*r0*0.6);
      g.lineTo(wx+Math.cos(ang)*r1, wb-wh*0.68+Math.sin(-ang)*r1*0.6); g.stroke(); }
  }

  // ---- PALACE: central hall with columns + pediment (mid, tallest) ----
  if (has("palace")){
    const px=W*0.5, pb=deckBack+H*0.01, pw=W*0.24, ph=H*0.22;
    // podium
    pen.paint(()=>{ g.rect(px-pw*0.6, pb-H*0.03, pw*1.2, H*0.03); }, toneSolid(inkLevel(4)),5);
    // body
    pen.paint(()=>{ g.rect(px-pw/2, pb-ph, pw, ph-H*0.03); }, toneSolid(inkLevel(3)), 5);
    // columns
    const n=5, colY=pb-H*0.03;
    for(let i=0;i<n;i++){ const cx=px-pw*0.42+ (pw*0.84)*(i/(n-1)); const cw=pw*0.07, chh=ph-H*0.09;
      pen.paint(()=>{ g.rect(cx-cw/2, colY-chh, cw, chh); }, toneSolid(inkLevel(2)),4); }
    // architrave + pediment
    pen.paint(()=>{ g.rect(px-pw*0.56, pb-ph+H*0.02, pw*1.12, H*0.03); }, toneSolid(inkLevel(5)),5);
    pen.paint(()=>{ g.moveTo(px-pw*0.56, pb-ph+H*0.02); g.lineTo(px, pb-ph-H*0.05); g.lineTo(px+pw*0.56, pb-ph+H*0.02); g.closePath(); }, toneSolid(inkLevel(5)), 5);
  }

  // ---- BRONZE WALL: the crenellated rim running along the front edge ----
  if (has("bronze-wall")){
    const wy0=deckFront-H*0.075, wh=H*0.075;
    // wall band
    pen.paint(()=>{ g.rect(W*0.06, wy0, W*0.88, wh); }, toneSolid(inkLevel(5)), 5);
    // merlons (crenellations) along the top
    const n=params.wallMerlons, span=W*0.88, x0=W*0.06;
    for(let i=0;i<n;i++){ if(i%2) continue; const mw=span/n; const mx=x0+i*mw;
      pen.paint(()=>{ g.rect(mx, wy0-H*0.022, mw, H*0.022); }, toneSolid(inkLevel(5)),4); }
    // bronze masonry seams (vertical)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let i=1;i<n;i++){ const x=x0+i*(span/n); g.beginPath(); g.moveTo(x,wy0); g.lineTo(x,wy0+wh); g.stroke(); }
    // a horizontal course line
    g.beginPath(); g.moveTo(W*0.06,wy0+wh*0.5); g.lineTo(W*0.94,wy0+wh*0.5); g.stroke();
    g.globalAlpha=1;
  }

  // ---- HARBOR: a notch cut in the rim, right side, with water + a jetty ----
  if (has("harbor")){
    const hx0=W*0.66, hx1=W*0.90, hy0=deckFront-H*0.02, hy1=deckFront+H*0.05;
    // clear the wall notch to sky/void, then fill with harbor water
    g.fillStyle=inkLevel(1); g.fillRect(hx0,hy0-H*0.075,hx1-hx0,H*0.075);
    pen.paint(()=>{ g.rect(hx0, hy0, hx1-hx0, hy1-hy0); }, toneSolid(inkLevel(2)), 4);
    // ripple dashes in the basin
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let r=0;r<2;r++){ const y=hy0+(hy1-hy0)*(0.4+r*0.35);
      for(let x=hx0+6;x<hx1-6;x+=20){ g.beginPath(); g.moveTo(x,y); g.lineTo(x+10,y); g.stroke(); } }
    g.globalAlpha=1;
    // a stone jetty reaching into the basin
    pen.paint(()=>{ g.rect(hx0-4, hy0+ (hy1-hy0)*0.22, (hx1-hx0)*0.5, H*0.02); }, toneSolid(inkLevel(6)),4);
    // a mooring post
    pen.paint(()=>{ g.rect(hx0+(hx1-hx0)*0.5-3, hy0+(hy1-hy0)*0.12, 6, H*0.03); }, toneSolid(inkLevel(6)),3);
  }
}

export const asset = {
  id:"location.aeolia-floating-island",
  type:"LOCATION",
  name:"Aeolia Floating Island",
  statusWord:"BECALMED",
  scene:"OD-B10-S01",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","sea","underside","deck","feast-hall","palace","wind-chamber","bronze-wall","harbor","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "palace:throne":{x:.50,y:.55}, "hall:feast":{x:.24,y:.56},
    "chamber:winds":{x:.75,y:.56}, "harbor:quay":{x:.80,y:.66},
    "harbor:mooring":{x:.78,y:.68}, "rim:gate":{x:.50,y:.64},
    "threshold:sea":{x:.50,y:.93}, "edge:float":{x:.50,y:.86},
    "entrance:left":{x:.08,y:.64}, "exit:right":{x:.92,y:.64},
    "camera:wide":{x:.50,y:.50}, "camera:hall":{x:.30,y:.56},
  },
  // walkable ground region (for scene placement / pathing)
  zones:{
    walkable:{ x0:.12,y0:.52,x1:.88,y1:.65 },
    harbor:{ x0:.66,y0:.64,x1:.90,y1:.71 },
    court:{ x0:.36,y0:.52,x1:.64,y1:.63 },
  },
  states:{
    initial:"becalmed",
    nodes:{
      becalmed:{ preview:{ layers:["sky","sea","underside","deck","feast-hall","palace","wind-chamber","bronze-wall","harbor"] } },
      "feast":{ preview:{ layers:["sky","sea","underside","deck","feast-hall","palace","wind-chamber","bronze-wall","harbor"] } },
      "winds-loosed":{ preview:{ layers:["sky","sea","underside","deck","feast-hall","palace","wind-chamber","bronze-wall","harbor"] } },
      "departure":{ preview:{ layers:["sky","sea","underside","deck","palace","bronze-wall","harbor"] } },
    },
    edges:[["becalmed","feast"],["feast","winds-loosed"],["winds-loosed","departure"],["departure","becalmed"]],
  },
  channels:["reveal","camera","light","wind"],

  preview:()=>({ layers:["sky","sea","underside","deck","feast-hall","palace","wind-chamber","bronze-wall","harbor"], status:"BECALMED", progress:.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
