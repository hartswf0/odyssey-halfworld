/* location.aeaea-funeral-shore — the strand of Circe's island where Odysseus'
   crew return to bury Elpenor. LOCATION asset (OD-B12-S01). An EMPTY navigable
   set: sky over a dark forest tree-line (Circe's forest palace lies inland,
   reached by a path through a gap in the trees), a strip of sea on the left
   with the black ship drawn up at the landing, then the broad beach carrying
   the burial mound with Elpenor's oar planted upright in it, the pyre crib
   where the body was burned, and a low feast setup in the foreground. Drawn in
   SOLID grays + hard contour into the offscreen ctx — the engine dotify pass
   supplies the halftone. No characters are baked in; only placement / camera
   anchors + walkable zones.
   Atlas: OD-B12-S01 — pyre area, burial mound + planted oar, ship landing, feast, forest-palace route. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  skyLevel:0.16,       // sky/forest line as fraction of H
  forestBase:0.38,     // base of the forest tree-line
  surfLevel:0.50,      // the waterline / where the dry beach begins
  seaRight:0.58,       // sea occupies the left, up to this x-fraction at the top
  gapCenter:0.73,      // x-fraction of the gap in the trees (route to the palace)
  gapHalf:0.075,       // half-width of that gap
  pyre:true,           // the pyre crib where Elpenor was burned
  mound:true,          // the fresh burial mound
  plantedOar:true,     // his oar set upright on the mound for a marker
  ship:true,           // the black ship drawn up at the landing
  feast:true,          // low feast setup in the foreground
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const skyY   = H*params.skyLevel;
  const forY   = H*params.forestBase;   // forest base line
  const surfY  = H*params.surfLevel;    // waterline
  const gx     = W*params.gapCenter;
  const gh     = W*params.gapHalf;
  const layers = st.layers || ["sky","forest","route","sea","surf","beach","ship","pyre","mound","feast","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest tone -> sparse dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,forY);
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.18+i*0.30), skyY*(0.5+0.16*(i%2)), W*0.13, H*0.020, 0,0,7); g.fill(); }
  }

  // ---- FOREST tree-line (bg): a continuous dark mass with a serrated crown + GAP ----
  if (has("forest")){
    const inGap = x => Math.abs(x-gx) < gh;
    const bandTop = skyY + (forY-skyY)*0.42;   // solid forest body starts here
    // solid dark forest body (skip the route gap)
    pen.fillPath(()=>{
      g.moveTo(0, forY); g.lineTo(0, bandTop);
      g.lineTo(gx-gh, bandTop); g.lineTo(gx-gh, forY);
      g.lineTo(gx+gh, forY); g.lineTo(gx+gh, bandTop);
      g.lineTo(W, bandTop); g.lineTo(W, forY); g.closePath();
    }, inkLevel(5));
    // overlapping conifer crowns forming a serrated top edge (wide so they merge)
    const n = 30, step = W/n;
    for(let i=0;i<=n;i++){
      const x = i*step;
      if (inGap(x)) continue;
      const th = (bandTop-skyY)*(0.55 + 0.45*((i*7)%5)/4);  // deterministic height jitter
      const tw = step*1.9;                                   // wide -> crowns overlap into a mass
      const level = 5 + (i%2);                               // 5 or 6
      pen.fillPath(()=>{
        g.moveTo(x-tw/2, bandTop+2);
        g.lineTo(x, bandTop-th);
        g.lineTo(x+tw/2, bandTop+2);
        g.closePath();
      }, inkLevel(level));
    }
    // a couple of taller emergent trees for texture (skip gap)
    for(let i=2;i<n;i+=5){
      const x=i*step; if(inGap(x)) continue;
      const th=(bandTop-skyY)*1.15, tw=step*1.1;
      g.fillStyle=inkLevel(6);
      g.beginPath(); g.moveTo(x-tw/2,bandTop); g.lineTo(x,bandTop-th); g.lineTo(x+tw/2,bandTop); g.closePath(); g.fill();
    }
    // a firm ground line under the trees
    pen.ink(()=>{ g.moveTo(0,forY); g.lineTo(gx-gh,forY); g.moveTo(gx+gh,forY); g.lineTo(W,forY); }, 4);
  }

  // ---- ROUTE to the forest palace: a pale path rising through the gap ----
  if (has("route")){
    // wide at the beach, narrowing up into the tree gap
    pen.paint(()=>{
      g.moveTo(gx-gh*0.85, forY);
      g.lineTo(gx+gh*0.85, forY);
      g.lineTo(gx+gh*1.9, surfY+H*0.16);
      g.lineTo(gx-gh*1.9, surfY+H*0.16);
      g.closePath();
    }, toneSolid(inkLevel(1)), 3);
    // path border ruts
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    g.beginPath();
    g.moveTo(gx-gh*0.85, forY); g.lineTo(gx-gh*1.9, surfY+H*0.16);
    g.moveTo(gx+gh*0.85, forY); g.lineTo(gx+gh*1.9, surfY+H*0.16);
    g.stroke(); g.globalAlpha=1;
  }

  // ---- SEA (mid tone) filling the left, back-to-front, with a slanted shore ----
  if (has("sea")){
    const rTop = W*params.seaRight, rBot = W*(params.seaRight-0.10);
    pen.paint(()=>{
      g.moveTo(0, forY);
      g.lineTo(rTop, forY);
      g.lineTo(rBot, surfY);
      g.lineTo(0, surfY);
      g.closePath();
    }, toneSolid(inkLevel(3)), 0);
    // darker near-shore band for depth
    g.save();
    g.beginPath(); g.moveTo(0,forY); g.lineTo(rTop,forY); g.lineTo(rBot,surfY); g.lineTo(0,surfY); g.closePath(); g.clip();
    g.fillStyle=inkLevel(4); g.fillRect(0, surfY-H*0.05, W, H*0.05);
    // swell lines
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let j=1;j<=4;j++){
      const y = lerp(forY+H*0.015, surfY-H*0.015, j/5);
      g.beginPath();
      for(let s=0;s<=20;s++){ const x=W*0.6*s/20; const yy=y+Math.sin(s*0.9+j)*H*0.005; s?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1; g.restore();
  }

  // ---- BEACH (broad dry shore, foreground, light so it reads as ground) ----
  if (has("beach")){
    g.fillStyle=inkLevel(2); g.fillRect(0, surfY, W, H-surfY);
    // right-hand land wedge joining the forest to the beach (below the route)
    pen.fillPath(()=>{
      g.moveTo(W*(params.seaRight-0.10), surfY);
      g.lineTo(W, surfY);
      g.lineTo(W, forY);
      g.lineTo(W*params.seaRight, forY);
      g.closePath();
    }, inkLevel(2));
  }

  // ---- SURF: a light scalloped waterline along the shore ----
  if (has("surf")){
    const x1 = W*(params.seaRight-0.06);   // shoreline runs from left to the land wedge
    const amp=H*0.010, lobes=7;
    const topY = f => surfY + Math.sin(f*Math.PI*lobes)*amp + Math.sin(f*Math.PI*2.1)*amp*0.5;
    g.beginPath(); g.moveTo(0, topY(0)+H*0.03);
    for(let s=0;s<=48;s++){ const f=s/48; g.lineTo(f*x1, topY(f)); }
    g.lineTo(x1, topY(1)+H*0.03); g.closePath();
    g.fillStyle=inkLevel(1); g.fill();
    pen.ink(()=>{ g.moveTo(0,topY(0)); for(let s=0;s<=48;s++){ const f=s/48; g.lineTo(f*x1, topY(f)); } }, 3);
    g.fillStyle=inkLevel(1); g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<lobes;i++){ const f=(i+0.5)/lobes; g.beginPath(); g.arc(f*x1, topY(f)+H*0.008, W*0.011, 0, 7); g.fill(); g.stroke(); }
  }

  // ---- SHIP drawn up at the landing (dark hull crescent + mast) ----
  if (has("ship") && params.ship){
    const bx=W*0.22, by=surfY+H*0.02, bw=W*0.11, bh=H*0.040;
    pen.paint(()=>{
      g.moveTo(bx-bw, by-bh*0.2);
      g.quadraticCurveTo(bx-bw*0.35, by+bh, bx+bw, by-bh*0.2);        // underside
      g.quadraticCurveTo(bx+bw*1.08, by-bh*1.1, bx+bw*0.68, by-bh*1.0); // rising prow
      g.quadraticCurveTo(bx, by-bh*0.4, bx-bw*0.68, by-bh*1.0);         // gunwale
      g.quadraticCurveTo(bx-bw*1.08, by-bh*1.1, bx-bw, by-bh*0.2);      // rising stern
      g.closePath();
    }, toneSolid(inkLevel(7)), 4);
    // mast + furled yard
    pen.ink(()=>{ g.moveTo(bx, by-bh*0.7); g.lineTo(bx, by-H*0.10); }, 3);
    pen.ink(()=>{ g.moveTo(bx-bw*0.5, by-H*0.075); g.lineTo(bx+bw*0.5, by-H*0.075); }, 3);
  }

  // ---- PYRE crib: stacked logs where Elpenor was burned (mid-beach, left) ----
  if (has("pyre") && params.pyre){
    const px=W*0.40, py=surfY+H*0.20, pw=W*0.075, ph=H*0.030;
    // ash bed
    pen.paint(()=>{ g.ellipse(px, py+ph*0.5, pw*1.35, ph*0.7, 0,0,7); }, toneSolid(inkLevel(3)), 2);
    // crib of crossed logs (two courses), log ends as circles
    pen.paint(()=>{ g.rect(px-pw, py-ph, pw*2, ph*0.55); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.rect(px-pw*0.9, py-ph*1.7, pw*1.8, ph*0.55); }, toneSolid(inkLevel(6)), 3);
    g.fillStyle=inkLevel(7); g.strokeStyle=INK; g.lineWidth=2;
    for(let k=-1;k<=1;k++){ g.beginPath(); g.arc(px+k*pw*0.7, py-ph*1.45, ph*0.24, 0,7); g.fill(); g.stroke(); }
    // thin dying smoke curl
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    g.beginPath(); g.moveTo(px, py-ph*1.9);
    g.quadraticCurveTo(px+pw*0.5, py-ph*3.0, px-pw*0.2, py-ph*4.0);
    g.stroke(); g.globalAlpha=1;
  }

  // ---- BURIAL MOUND with Elpenor's OAR planted upright (centre focus) ----
  if (has("mound") && params.mound){
    const mx=W*0.56, my=surfY+H*0.30, mw=W*0.10, mh=H*0.085;
    // the fresh mound (rounded dome on a base line)
    pen.paint(()=>{
      g.moveTo(mx-mw, my);
      g.bezierCurveTo(mx-mw, my-mh*1.7, mx+mw, my-mh*1.7, mx+mw, my);
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    // raked contour lines over the mound
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let r=1;r<=2;r++){ const f=r/3;
      g.beginPath(); g.moveTo(mx-mw*(1-f*0.4), my); g.quadraticCurveTo(mx, my-mh*(1.0-f*0.5), mx+mw*(1-f*0.4), my); g.stroke(); }
    g.globalAlpha=1;

    if (params.plantedOar){
      // shaft rising from the crown, leaning slightly toward the sea
      const bx=mx-mw*0.06, byb=my-mh*0.9;         // base, sunk into the mound
      const tx=mx-mw*0.34, tyt=surfY+H*0.03;      // top of the shaft
      const bl=Math.atan2(tyt-byb, tx-bx);         // shaft angle
      const dx=Math.cos(bl), dy=Math.sin(bl);
      const nx=-dy, ny=dx;                          // shaft normal
      const sw=W*0.008;                            // half shaft width
      // shaft as a filled bar with contour
      pen.paint(()=>{
        g.moveTo(bx-nx*sw, byb-ny*sw); g.lineTo(tx-nx*sw, tyt-ny*sw);
        g.lineTo(tx+nx*sw, tyt+ny*sw); g.lineTo(bx+nx*sw, byb+ny*sw); g.closePath();
      }, toneSolid(inkLevel(6)), 3);
      // oar blade: an elongated paddle centred just above the shaft top
      const bcx = tx + dx*H*0.03, bcy = tyt + dy*H*0.03;  // blade centre, past the tip
      pen.paint(()=>{ g.ellipse(bcx, bcy, W*0.030, H*0.055, bl+Math.PI/2, 0, 7); }, toneSolid(inkLevel(5)), 3);
      // blade midrib
      pen.ink(()=>{ g.moveTo(bcx-dx*H*0.045, bcy-dy*H*0.045); g.lineTo(bcx+dx*H*0.045, bcy+dy*H*0.045); }, 2);
    }
  }

  // ---- FEAST setup: two low benches and a table in the foreground ----
  if (has("feast") && params.feast){
    const fy=H*0.90, fcx=W*0.52;
    // low table (darkest slab)
    const tw=W*0.14, th=H*0.020;
    pen.paint(()=>{ g.rect(fcx-tw, fy-th, tw*2, th); }, toneSolid(inkLevel(5)), 3);
    g.strokeStyle=INK; g.lineWidth=3;
    g.beginPath(); g.moveTo(fcx-tw*0.85, fy); g.lineTo(fcx-tw*0.85, fy+H*0.028);
    g.moveTo(fcx+tw*0.85, fy); g.lineTo(fcx+tw*0.85, fy+H*0.028); g.stroke();
    // cups on the table
    g.fillStyle=inkLevel(6); g.strokeStyle=INK; g.lineWidth=2;
    for(let k=-2;k<=2;k++){ g.beginPath(); g.arc(fcx+k*tw*0.34, fy-th-H*0.006, W*0.010, 0,7); g.fill(); g.stroke(); }
    // flanking benches
    for(const side of [-1,1]){
      const bxc=fcx+side*W*0.26, bw=W*0.07, bh=H*0.014, by=fy-H*0.012;
      pen.paint(()=>{ g.rect(bxc-bw, by-bh, bw*2, bh); }, toneSolid(inkLevel(4)), 2);
      g.strokeStyle=INK; g.lineWidth=2;
      g.beginPath(); g.moveTo(bxc-bw*0.8, by); g.lineTo(bxc-bw*0.8, by+H*0.018);
      g.moveTo(bxc+bw*0.8, by); g.lineTo(bxc+bw*0.8, by+H*0.018); g.stroke();
    }
  }
}

export const asset = {
  id:"location.aeaea-funeral-shore",
  type:"LOCATION",
  name:"Aeaea Funeral Shore",
  statusWord:"MOURNING",
  scene:"OD-B12-S01",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","forest","route","sea","surf","beach","ship","pyre","mound","feast","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "mound:elpenor":{x:.56,y:.80},          // the fresh burial mound
    "marker:oar":{x:.52,y:.52},             // top of the planted oar
    "pyre:site":{x:.40,y:.70},              // the burned-out pyre crib
    "landing:ship":{x:.22,y:.53},           // the black ship drawn up on the sand
    "feast:setup":{x:.52,y:.90},            // foreground feast table + benches
    "route:forest-palace":{x:.73,y:.44},    // path rising into the trees toward Circe's hall
    "threshold:surf":{x:.28,y:.50},         // the waterline
    "entrance:sea":{x:.06,y:.52}, "exit:forest":{x:.73,y:.34},
    "camera:wide":{x:.50,y:.50}, "camera:mound":{x:.56,y:.72}, "camera:landing":{x:.24,y:.55},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    beach:{ x0:.04,y0:.52,x1:.96,y1:.98 },      // the broad walkable strand
    sea:{ x0:.00,y0:.38,x1:.58,y1:.50 },        // water at the landing
    pyreArea:{ x0:.28,y0:.62,x1:.52,y1:.76 },   // around the pyre crib
    moundArea:{ x0:.44,y0:.66,x1:.68,y1:.86 },  // around the burial mound
    feast:{ x0:.24,y0:.82,x1:.80,y1:.97 },      // foreground feast setup
    route:{ x0:.60,y0:.40,x1:.90,y1:.68 },      // path up to the forest palace
  },
  states:{
    initial:"buried",
    nodes:{
      buried:{ preview:{ layers:["sky","forest","route","sea","surf","beach","ship","pyre","mound","feast"] } },
      "rites":{ preview:{ layers:["sky","forest","route","sea","surf","beach","ship","pyre","mound"] } }, // no feast yet
      "departed":{ preview:{ layers:["sky","forest","route","sea","surf","beach","pyre","mound"] } },     // ship gone
      empty:{ preview:{ layers:["sky","forest","route","sea","surf","beach"] } },                          // bare set
    },
    edges:[["buried","rites"],["rites","departed"],["buried","empty"],["departed","empty"]],
  },
  channels:["reveal","camera","tide","smoke","light"],

  preview:()=>({ layers:["sky","forest","route","sea","surf","beach","ship","pyre","mound","feast"], status:"MOURNING", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
