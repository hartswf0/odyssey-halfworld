/* location.phaeacian-assembly-ground — the seaside civic ground of Scheria.
   LOCATION asset. An EMPTY navigable set drawn in SOLID grays + hard contour
   (the engine dotify pass supplies the halftone). A gathering place set just
   above the harbor: the sea and a drawn-up Phaeacian ship across the back, a
   ramped SHIP ROUTE (slipway) down to the water on the right, rising public
   seating tiers on a shallow bowl, a KING'S RAISED PLACE (Alcinous's seat) at
   the head of the ground, and a colonnaded PALACE CONNECTION with its road on
   the left. Do NOT bake characters in.
   Atlas: OD-B08-S01 — the Phaeacians assemble; a ship is readied for Odysseus. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  tiers:4,               // rings of rising public seating at the back of the bowl
  kingsPlace:true,       // raised royal seat at the head of the ground
  harbor:true,           // sea band across the back
  ship:true,             // a drawn-up Phaeacian ship at the water's edge
  shipRoute:true,        // ramped slipway from the ground down to the water
  palace:true,           // colonnaded palace + connecting road (left)
  ringCy:0.62,           // center of the civic bowl as fraction of H
  ringRx:0.40, ringRy:0.215,
  horizon:0.30,
};

const TAU = Math.PI*2;
const ptE = (cx,cy,rx,ry,a)=>({ x:cx+rx*Math.cos(a), y:cy+ry*Math.sin(a) });

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["sky","harbor","ship","palace","route","floor","tiers","kingsplace"];
  const has = l => layers.includes(l);

  const horizon = H*params.horizon;
  const cx = W*0.5, cy = H*params.ringCy;
  const RX = W*params.ringRx, RY = H*params.ringRy;    // outer bowl ring
  const rx = RX*0.44,        ry = RY*0.44;             // inner open floor

  // ---- SKY (lightest — reads as near-paper) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  }

  // ---- HARBOR — the sea across the back, just above the ground line ----
  const waterY0 = horizon, waterY1 = horizon+H*0.075;
  if (has("harbor") && params.harbor){
    pen.paint(()=>{ g.rect(0, waterY0, W, waterY1-waterY0); }, toneSolid(inkLevel(3)), 4);
    // low coastline hint at the far shore (behind the water)
    pen.paint(()=>{
      g.moveTo(0,waterY0);
      g.quadraticCurveTo(W*0.25, waterY0-H*0.05, W*0.5, waterY0-H*0.01);
      g.quadraticCurveTo(W*0.78, waterY0-H*0.06, W, waterY0-H*0.005);
      g.lineTo(W,waterY0); g.lineTo(0,waterY0); g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // wave dashes over the water
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let r=0;r<3;r++){ const y=lerp(waterY0+H*0.014, waterY1-H*0.006, r/2);
      for(let x=W*0.03; x<W*0.97; x+=W*0.085){ const o=(r%2)*W*0.04;
        g.beginPath(); g.moveTo(x+o,y); g.lineTo(x+o+W*0.035,y); g.stroke(); } }
    g.globalAlpha=1;
  }

  // ---- SHIP — a Phaeacian ship moored on the open water (back-center) ----
  if (has("ship") && params.ship){
    const sx=W*0.52, sy=waterY1-H*0.030, hw=W*0.135, hh=H*0.028, deck=sy-hh*0.2;
    // hull — a clean crescent with an upturned prow & stern
    pen.paint(()=>{
      g.moveTo(sx-hw, deck);
      g.lineTo(sx+hw, deck);
      g.quadraticCurveTo(sx+hw*0.55, sy+hh*1.35, sx, sy+hh*1.15);
      g.quadraticCurveTo(sx-hw*0.55, sy+hh*1.35, sx-hw, deck);
      g.closePath();
    }, toneSolid(inkLevel(6)), 3);
    // upturned prow & stern posts
    pen.ink(()=>{ g.moveTo(sx-hw,deck); g.quadraticCurveTo(sx-hw*1.18,deck-hh*1.1,sx-hw*1.05,deck-hh*1.9); }, 3);
    pen.ink(()=>{ g.moveTo(sx+hw,deck); g.quadraticCurveTo(sx+hw*1.18,deck-hh*1.0,sx+hw*1.02,deck-hh*1.6); }, 3);
    // mast + triangular sail against the sky
    const mtop = deck - H*0.115;
    pen.ink(()=>{ g.moveTo(sx, deck); g.lineTo(sx, mtop); }, 3);
    pen.paint(()=>{ g.moveTo(sx+W*0.006, mtop+H*0.006); g.lineTo(sx+hw*0.9, deck-hh*0.6); g.lineTo(sx+W*0.006, deck-hh*0.4); g.closePath(); }, toneSolid(inkLevel(2)), 3);
    // deck oar-ports
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.75;
    for(let i=0;i<6;i++){ const ox=sx-hw*0.7+i*hw*0.28; g.beginPath(); g.moveTo(ox,deck+hh*0.15); g.lineTo(ox-W*0.018,deck+hh*0.7); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- PALACE CONNECTION — colonnaded hall + road, upper left ----
  if (has("palace") && params.palace){
    const px=W*0.17, py=horizon+H*0.005, pw=W*0.26, ph=H*0.10;
    // terrace the palace stands on
    pen.paint(()=>{ g.rect(px-pw*0.62, py-H*0.005, pw*1.24, H*0.028); }, toneSolid(inkLevel(3)), 3);
    // hall body
    pen.paint(()=>{ g.rect(px-pw/2, py-ph, pw, ph); }, toneSolid(inkLevel(4)), 4);
    // roof
    pen.paint(()=>{ g.moveTo(px-pw*0.58,py-ph); g.lineTo(px,py-ph-H*0.035); g.lineTo(px+pw*0.58,py-ph); g.closePath(); }, toneSolid(inkLevel(5)), 4);
    // column slots (light gaps)
    g.fillStyle=inkLevel(1);
    for(let i=-3;i<=3;i++){ g.fillRect(px+i*pw*0.13-pw*0.025, py-ph*0.86, pw*0.05, ph*0.8); }
    // connecting ROAD from the palace terrace down to the civic ground
    const top = ptE(cx,cy,RX,RY, Math.PI*1.22);       // left-back edge of the bowl
    pen.paint(()=>{
      g.moveTo(px-pw*0.16, py+H*0.02);
      g.lineTo(px+pw*0.16, py+H*0.02);
      g.lineTo(top.x+W*0.03, top.y);
      g.lineTo(top.x-W*0.03, top.y);
      g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // step rungs on the road
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let j=1;j<=5;j++){ const t=j/6;
      const ax=lerp(px, top.x, t), ay=lerp(py+H*0.02, top.y, t), wr=lerp(pw*0.16, W*0.03, t);
      g.beginPath(); g.moveTo(ax-wr,ay); g.lineTo(ax+wr,ay); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- SHIP ROUTE — ramped slipway from the ground down to the water (right) ----
  if (has("route") && params.shipRoute){
    const water = { x:W*0.83, y:waterY1-H*0.004 };     // reaches the water, right of the ship
    const foot  = { x:W*0.86, y:H*0.90 };              // wide at the front
    pen.paint(()=>{
      g.moveTo(foot.x-W*0.13, foot.y);
      g.lineTo(foot.x+W*0.13, foot.y);
      g.lineTo(water.x+W*0.055, water.y);
      g.lineTo(water.x-W*0.055, water.y);
      g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // slipway cross-rungs (haul-out timbers)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
    for(let j=1;j<=7;j++){ const t=j/8;
      const mx=lerp(foot.x, water.x, t), my=lerp(foot.y, water.y, t), wr=lerp(W*0.13, W*0.055, t);
      g.beginPath(); g.moveTo(mx-wr,my); g.lineTo(mx+wr,my); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- OPEN FLOOR of the civic bowl (light ground, radial paving) ----
  if (has("floor")){
    pen.paint(()=>{ g.ellipse(cx,cy,RX,RY,0,0,TAU); }, toneSolid(inkLevel(1)), 5);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
    for(let i=0;i<14;i++){ const a=i/14*TAU; const o=ptE(cx,cy,RX*0.97,RY*0.97,a); g.beginPath(); g.moveTo(cx,cy); g.lineTo(o.x,o.y); g.stroke(); }
    g.globalAlpha=0.42; g.beginPath(); g.ellipse(cx,cy,RX*0.72,RY*0.72,0,0,TAU); g.stroke();
    g.globalAlpha=1;
  }

  // ---- PUBLIC SEATING TIERS — rising rings on the back of the bowl ----
  if (has("tiers")){
    const gapL = 0.30, gapR = 0.40;   // gaps kept for the palace road (L) & ship route (R)
    const a0 = Math.PI + gapL, a1 = TAU - gapR;   // back arc, palace-side to harbor-side
    const bands = params.tiers;
    for(let b=bands-1;b>=0;b--){
      const f0 = b/bands, f1 = (b+1)/bands;                 // 0 inner .. 1 outer
      const rO_x = lerp(rx, RX, f1), rO_y = lerp(ry, RY, f1);
      const rI_x = lerp(rx, RX, f0), rI_y = lerp(ry, RY, f0);
      const tone = toneSolid(inkLevel(3 + Math.round(f0*2)));  // outer tiers darker
      pen.paint(()=>{
        g.ellipse(cx,cy,rO_x,rO_y,0,a0,a1);
        const ie = ptE(cx,cy,rI_x,rI_y,a1);
        g.lineTo(ie.x,ie.y);
        g.ellipse(cx,cy,rI_x,rI_y,0,a1,a0,true);
        g.closePath();
      }, tone, 3);
    }
    // radial seat dividers across the tiers
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    const N=15;
    for(let i=0;i<=N;i++){
      const a=lerp(a0,a1,i/N);
      const pin=ptE(cx,cy,rx,ry,a), pout=ptE(cx,cy,RX,RY,a);
      g.beginPath(); g.moveTo(pin.x,pin.y); g.lineTo(pout.x,pout.y); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- KING'S RAISED PLACE — Alcinous's seat at the head of the ground ----
  if (has("kingsplace") && params.kingsPlace){
    const kx=cx, ky=cy+RY*0.36;                 // toward the front of the bowl, facing tiers
    const bw=W*0.15, bh=H*0.05;
    // stepped plinth (two slabs)
    pen.paint(()=>{ g.ellipse(kx,ky+bh*0.62,bw*0.72,bh*0.34,0,0,TAU); }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{ g.rect(kx-bw*0.5, ky-bh*0.15, bw, bh*0.72); }, toneSolid(inkLevel(5)), 4);   // riser
    // the raised seat (throne block) on top
    const sw=bw*0.62, sh=bh*0.7, seatY=ky-bh*0.15;
    pen.paint(()=>{ g.rect(kx-sw/2, seatY-sh, sw, sh); }, toneSolid(inkLevel(6)), 4);            // seat base
    pen.paint(()=>{ g.rect(kx-sw/2, seatY-sh-bh*0.95, sw, bh*0.95); }, toneSolid(inkLevel(7)), 4); // high back
    // arms of the seat
    pen.paint(()=>{ g.rect(kx-sw*0.5, seatY-sh-bh*0.2, sw*0.16, sh+bh*0.2); }, toneSolid(inkLevel(7)),3);
    pen.paint(()=>{ g.rect(kx+sw*0.34, seatY-sh-bh*0.2, sw*0.16, sh+bh*0.2); }, toneSolid(inkLevel(7)),3);
    // step at its foot
    pen.seam(()=>{ g.moveTo(kx-bw*0.5, ky+bh*0.4); g.lineTo(kx+bw*0.5, ky+bh*0.4); }, 3);
  }
}

export const asset = {
  id:"location.phaeacian-assembly-ground",
  type:"LOCATION",
  name:"Phaeacian Assembly Ground",
  statusWord:"CONVENED",
  scene:"OD-B08-S01",

  params,
  // back -> front draw order the set honors; scene state may pass a subset
  layers:["sky","harbor","ship","palace","route","floor","tiers","kingsplace"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "kingsplace:alcinous":{x:.50,y:.70},
    "floor:center":{x:.50,y:.62},
    "tiers:back-center":{x:.50,y:.48}, "tiers:left":{x:.30,y:.54}, "tiers:right":{x:.70,y:.54},
    "ship:moored":{x:.52,y:.33}, "route:water":{x:.83,y:.37}, "route:foot":{x:.86,y:.90},
    "palace:hall":{x:.17,y:.32}, "road:palace":{x:.30,y:.44},
    "harbor:sea":{x:.50,y:.33},
    "entrance:palace-road":{x:.24,y:.40}, "exit:ship-route":{x:.94,y:.90},
    "camera:wide":{x:.50,y:.50}, "camera:kings-place":{x:.50,y:.68}, "camera:harbor":{x:.62,y:.40},
  },
  // walkable / staging regions for scene placement + pathing
  zones:{
    floor:{ x0:.22,y0:.54,x1:.78,y1:.72 },       // open civic ground
    kingsDais:{ x0:.42,y0:.64,x1:.58,y1:.74 },   // the raised royal place
    tiers:{ x0:.14,y0:.42,x1:.86,y1:.58 },       // rising public seating
    quay:{ x0:.66,y0:.36,x1:.99,y1:.94 },        // the ship-route slipway
    palaceRoad:{ x0:.06,y0:.30,x1:.42,y1:.50 },  // route to the palace
  },
  states:{
    initial:"convened",
    nodes:{
      convened:{ preview:{ layers:["sky","harbor","ship","palace","route","floor","tiers","kingsplace"] } },
      empty:{    preview:{ layers:["sky","harbor","palace","route","floor","kingsplace"] } },  // no crowd, ship gone
      "ship-readied":{ preview:{ layers:["sky","harbor","ship","palace","route","floor","tiers","kingsplace"] } },
    },
    edges:[["convened","ship-readied"],["convened","empty"],["ship-readied","empty"]],
  },
  channels:["reveal","camera","light","crowdDensity","tide"],

  preview:()=>({ layers:["sky","harbor","ship","palace","route","floor","tiers","kingsplace"], status:"CONVENED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
