/* location.ithacan-assembly-ground — the open civic ring of Ithaca.
   LOCATION asset. An EMPTY navigable set drawn in SOLID grays + hard contour
   (the engine dotify pass supplies the halftone). A shallow open-air bowl:
   crowd tiers rising at the back, a front arc of distinct elder seats, the
   central speaker's stone, town exits cut through left & right, and a visible
   route climbing to the palace on the hill behind. Do NOT bake characters in.
   Atlas: OD-B02-S01 — Telemachus calls the first assembly in twenty years. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  tiers:4,              // rings of crowd seating at the back
  elders:7,             // distinct elder seats along the front arc
  speakerStone:true,    // raised central stone (the bema)
  palaceRoute:true,     // visible road up to the palace on the hill
  townExits:true,       // gaps to the town at left & right
  ringCy:0.60,          // center of the civic ring as fraction of H
  ringRx:0.42, ringRy:0.255,
  horizon:0.40,
};

const TAU = Math.PI*2;
const ptE = (cx,cy,rx,ry,a)=>({ x:cx+rx*Math.cos(a), y:cy+ry*Math.sin(a) });

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["sky","hills","palace","route","floor","tiers","town","elders","stone"];
  const has = l => layers.includes(l);

  const horizon = H*params.horizon;
  const cx = W*0.5, cy = H*params.ringCy;
  const RX = W*params.ringRx, RY = H*params.ringRy;   // outer ring
  const rx = RX*0.46,        ry = RY*0.46;            // inner open floor

  // ---- SKY (lightest — reads as near-paper) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  }

  // ---- HILLS ringing the town (low mid tone) ----
  if (has("hills")){
    pen.paint(()=>{
      g.moveTo(0,horizon);
      g.quadraticCurveTo(W*0.16, horizon-H*0.10, W*0.34, horizon-H*0.02);
      g.quadraticCurveTo(W*0.5,  horizon-H*0.14, W*0.66, horizon-H*0.02);
      g.quadraticCurveTo(W*0.84, horizon-H*0.10, W, horizon);
      g.lineTo(W,horizon); g.lineTo(0,horizon); g.closePath();
    }, toneSolid(inkLevel(2)), 4);
  }

  // ---- PALACE on the hill (small silhouette, back-center) ----
  if (has("palace")){
    const px=cx, py=horizon-H*0.015, pw=W*0.13, ph=H*0.085;
    // body block
    pen.paint(()=>{ g.rect(px-pw/2, py-ph, pw, ph); }, toneSolid(inkLevel(4)), 4);
    // roof
    pen.paint(()=>{ g.moveTo(px-pw*0.6,py-ph); g.lineTo(px,py-ph-H*0.03); g.lineTo(px+pw*0.6,py-ph); g.closePath(); }, toneSolid(inkLevel(5)), 4);
    // column gaps (light slots)
    g.fillStyle=inkLevel(1);
    for(let i=-2;i<=2;i++){ g.fillRect(px+i*pw*0.15-pw*0.03, py-ph*0.85, pw*0.06, ph*0.8); }
  }

  // ---- PALACE ROUTE — the road up from the ring to the palace ----
  if (has("route") && params.palaceRoute){
    const top = ptE(cx,cy,RX,RY, -Math.PI/2);          // back edge of ring
    const pw0 = W*0.11, pw1 = W*0.045;
    pen.paint(()=>{
      g.moveTo(cx-pw0/2, top.y);
      g.lineTo(cx+pw0/2, top.y);
      g.lineTo(cx+pw1/2, horizon+H*0.005);
      g.lineTo(cx-pw1/2, horizon+H*0.005);
      g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // step rungs on the route
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let j=1;j<=5;j++){ const t=j/6; const y=lerp(top.y, horizon+H*0.005, t); const wr=lerp(pw0,pw1,t); g.beginPath(); g.moveTo(cx-wr/2,y); g.lineTo(cx+wr/2,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- OPEN FLOOR of the civic ring (light ground, radial paving) ----
  if (has("floor")){
    pen.paint(()=>{ g.ellipse(cx,cy,RX,RY,0,0,TAU); }, toneSolid(inkLevel(1)), 5);
    // faint radial paving lines from the speaker's stone outward
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let i=0;i<16;i++){ const a=i/16*TAU; const o=ptE(cx,cy,RX*0.98,RY*0.98,a); g.beginPath(); g.moveTo(cx,cy); g.lineTo(o.x,o.y); g.stroke(); }
    // one inner ring line
    g.globalAlpha=0.45; g.beginPath(); g.ellipse(cx,cy,RX*0.7,RY*0.7,0,0,TAU); g.stroke();
    g.globalAlpha=1;
  }

  // ---- CROWD TIERS — rising seating on the back half of the bowl ----
  if (has("tiers")){
    const gapExit = 0.34;   // radians of gap left open at each town exit
    // seating occupies the back arc (top): from PI (left) to TAU (right),
    // minus a gap at the left & right exits.
    const bands = params.tiers;
    for(let b=bands-1;b>=0;b--){
      const f0 = b/bands, f1 = (b+1)/bands;              // 0 inner .. 1 outer
      const rO_x = lerp(rx, RX, f1), rO_y = lerp(ry, RY, f1);
      const rI_x = lerp(rx, RX, f0), rI_y = lerp(ry, RY, f0);
      const tone = toneSolid(inkLevel(3 + Math.round(f0*1)));   // outer tiers a touch darker
      // back arc annulus band (left exit .. right exit across the top)
      const a0 = Math.PI + gapExit, a1 = TAU - gapExit;
      pen.paint(()=>{
        g.ellipse(cx,cy,rO_x,rO_y,0,a0,a1);
        const ie = ptE(cx,cy,rI_x,rI_y,a1);
        g.lineTo(ie.x,ie.y);
        g.ellipse(cx,cy,rI_x,rI_y,0,a1,a0,true);
        g.closePath();
      }, tone, 3);
    }
    // radial seat dividers across the back tiers
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    const a0 = Math.PI + gapExit, a1 = TAU - gapExit, N=13;
    for(let i=0;i<=N;i++){
      const a=lerp(a0,a1,i/N);
      const pin=ptE(cx,cy,rx,ry,a), pout=ptE(cx,cy,RX,RY,a);
      g.beginPath(); g.moveTo(pin.x,pin.y); g.lineTo(pout.x,pout.y); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- TOWN EXITS + a few town roofs beyond (left & right gaps) ----
  if (has("town") && params.townExits){
    for(const side of [-1, 1]){
      // exit road wedge cutting out through the ring
      const a = side<0 ? Math.PI : 0;
      const inr = ptE(cx,cy,rx*1.05,ry*1.05,a);
      const ex  = side<0 ? W*0.015 : W*0.985;
      const ey  = cy + H*0.02;
      pen.paint(()=>{
        g.moveTo(inr.x, inr.y-H*0.028);
        g.lineTo(inr.x, inr.y+H*0.028);
        g.lineTo(ex, ey+H*0.05);
        g.lineTo(ex, ey-H*0.05);
        g.closePath();
      }, toneSolid(inkLevel(2)), 3);
      // small town roofs flanking the exit
      const bx = side<0 ? W*0.05 : W*0.87;
      for(let k=0;k<2;k++){
        const rxo = bx + k*W*0.05, ryo = cy - H*0.10 + k*H*0.03;
        pen.paint(()=>{ g.rect(rxo, ryo, W*0.045, H*0.06); }, toneSolid(inkLevel(4)),3);
        pen.paint(()=>{ g.moveTo(rxo-W*0.006,ryo); g.lineTo(rxo+W*0.045*0.5,ryo-H*0.022); g.lineTo(rxo+W*0.045+W*0.006,ryo); g.closePath(); }, toneSolid(inkLevel(5)),3);
      }
    }
  }

  // ---- ELDER SEATS — distinct benches along the front arc (nearest viewer) ----
  if (has("elders")){
    const n = params.elders;
    const a0 = Math.PI*0.16, a1 = Math.PI*0.84;   // front arc (bottom), facing center
    const seatR_x = RX*0.86, seatR_y = RY*0.86;
    for(let i=0;i<n;i++){
      const a = lerp(a0, a1, n===1?0.5:i/(n-1));
      const p = ptE(cx,cy,seatR_x,seatR_y,a);
      const sw = W*0.052, sh = H*0.05;
      // seat block
      pen.paint(()=>{ g.rect(p.x-sw/2, p.y-sh*0.5, sw, sh*0.7); }, toneSolid(inkLevel(5)), 3);
      // seat back (leaning outward, away from center)
      const back = sh*0.7;
      pen.paint(()=>{ g.rect(p.x-sw/2, p.y-sh*0.5-back, sw, back); }, toneSolid(inkLevel(6)), 3);
    }
  }

  // ---- SPEAKER'S STONE — the raised bema at dead center (foreground clearest) ----
  if (has("stone") && params.speakerStone){
    const sw=W*0.10, sh=H*0.05;
    // plinth (two stacked slabs, darkest tone)
    pen.paint(()=>{ g.ellipse(cx,cy+sh*0.55,sw*0.62,sh*0.30,0,0,TAU); }, toneSolid(inkLevel(4)), 4); // base shadow slab
    pen.paint(()=>{ g.rect(cx-sw*0.42, cy-sh*0.2, sw*0.84, sh*0.7); }, toneSolid(inkLevel(6)), 4);    // riser
    pen.paint(()=>{ g.ellipse(cx,cy-sh*0.2,sw*0.5,sh*0.24,0,0,TAU); }, toneSolid(inkLevel(7)), 4);     // speaking top
    // step at its foot
    pen.seam(()=>{ g.moveTo(cx-sw*0.42, cy+sh*0.3); g.lineTo(cx+sw*0.42, cy+sh*0.3); }, 3);
  }
}

export const asset = {
  id:"location.ithacan-assembly-ground",
  type:"LOCATION",
  name:"Ithacan Assembly Ground",
  statusWord:"CONVENED",
  scene:"OD-B02-S01",

  params,
  // back -> front draw order the set honors; scene state may pass a subset
  layers:["sky","hills","palace","route","floor","tiers","town","elders","stone"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "stone:speaker":{x:.50,y:.60},
    "seat:elder-center":{x:.50,y:.78},
    "seat:elder-left":{x:.30,y:.74}, "seat:elder-right":{x:.70,y:.74},
    "crowd:back-center":{x:.50,y:.40}, "crowd:back-left":{x:.28,y:.46}, "crowd:back-right":{x:.72,y:.46},
    "route:palace":{x:.50,y:.34}, "threshold:palace":{x:.50,y:.40},
    "exit:town-left":{x:.03,y:.62}, "exit:town-right":{x:.97,y:.62},
    "camera:wide":{x:.50,y:.50}, "camera:speaker":{x:.50,y:.60}, "camera:elders":{x:.50,y:.72},
  },
  // walkable / staging regions for scene placement + pathing
  zones:{
    floor:{ x0:.20,y0:.50,x1:.80,y1:.72 },      // open civic ring
    bema:{ x0:.42,y0:.55,x1:.58,y1:.66 },       // the speaker's stone
    elderRow:{ x0:.24,y0:.68,x1:.76,y1:.86 },   // front elder seating
    crowdTiers:{ x0:.10,y0:.36,x1:.90,y1:.56 }, // back rising seating
  },
  states:{
    initial:"convened",
    nodes:{
      convened:{ preview:{ layers:["sky","hills","palace","route","floor","tiers","town","elders","stone"] } },
      empty:{    preview:{ layers:["sky","hills","palace","route","floor","town","elders","stone"] } },  // no crowd
      "dawn-call":{ preview:{ layers:["sky","hills","palace","route","floor","tiers","town","elders","stone"] } },
    },
    edges:[["convened","empty"],["convened","dawn-call"],["dawn-call","convened"]],
  },
  channels:["reveal","camera","light","crowdDensity"],

  preview:()=>({ layers:["sky","hills","palace","route","floor","tiers","town","elders","stone"], status:"CONVENED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
