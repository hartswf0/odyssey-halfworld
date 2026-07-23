/* location.troy-interior-memory-set — the inside of the enemy city, half-remembered.
   LOCATION asset for OD-B04-S03 (Helen's recollection of Odysseus inside Troy).
   An EMPTY navigable set drawn in SOLID grays + hard contour into the offscreen
   ctx (the engine dotify pass supplies the halftone). Ghostly memory tone: kept
   deliberately faint (low ink levels, lots of paper), so it reads as recollected
   rather than present. Declares depth layers, walkable alleys, thresholds, camera
   anchors and alternate states. NO baked characters.

   Contents the scene needs: the great GATE, receding ALLEYS, a BATHING CHAMBER,
   a HIDDEN-CONVERSATION nook, and an ESCAPE ROUTE (a low postern out of the wall). */
import { makePen, toneSolid, inkLevel, INK } from "../../engine/halfworld-engine.mjs";

const params = {
  wallLevel:0.30,      // top of the back city wall (fraction of H)
  horizon:0.60,        // where alley floor meets the mid buildings
  faint:true,          // memory tone: bias every fill one level lighter
  gate:true,           // the great gate of Troy, center-back
  postern:true,        // the low escape route out of the wall, right
  bath:true,           // bathing chamber, foreground left
  nook:true,           // hidden-conversation alcove, foreground right
};

/* memory bias: pull structural fills toward paper so the set feels recollected.
   Contour stays hard black; only the tonal fills soften. */
const mem = l => inkLevel(params.faint ? Math.max(1, l-1) : l);

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const wallY = H*params.wallLevel;
  const horizon = H*params.horizon;
  const cx = W*0.5;
  const layers = st.layers || ["sky","citywall","gate","postern","farbuildings","alley","bath","nook","floor","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY over the city: lightest, mostly paper (the memory's empty air) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,wallY);
  }

  // ---- BACK CITY WALL: a long faint rampart spanning the set ----
  if (has("citywall")){
    pen.paint(()=>{ g.rect(0, wallY, W, horizon-wallY); }, toneSolid(mem(3)), 5);
    // crenellations along the top of the wall
    const merlonW = W*0.045;
    g.fillStyle = mem(4);
    for(let x=0; x<W; x+=merlonW*1.8){
      g.fillRect(x, wallY-H*0.028, merlonW, H*0.028);
    }
    pen.ink(()=>{ g.moveTo(0,wallY); g.lineTo(W,wallY); }, 4);
    // a horizontal course line across the masonry
    pen.seam(()=>{ g.moveTo(0, wallY+(horizon-wallY)*0.5); g.lineTo(W, wallY+(horizon-wallY)*0.5); }, 2);
  }

  // ---- THE GREAT GATE: tall arched opening, center-left of the wall ----
  if (has("gate") && params.gate){
    const gw = W*0.20, gx = cx - W*0.06, gTop = wallY+H*0.02, gBot = horizon;
    // dark threshold beyond the gate (deeper tone: the way out of memory)
    pen.paint(()=>{
      g.moveTo(gx-gw/2, gBot);
      g.lineTo(gx-gw/2, gTop+gw*0.5);
      g.quadraticCurveTo(gx, gTop-gw*0.15, gx+gw/2, gTop+gw*0.5);
      g.lineTo(gx+gw/2, gBot);
      g.closePath();
    }, toneSolid(mem(5)), 5);
    // gate jambs (piers) framing it, a touch heavier than the wall
    pen.paint(()=>{ g.rect(gx-gw/2-W*0.03, gTop, W*0.03, gBot-gTop); }, toneSolid(mem(4)), 4);
    pen.paint(()=>{ g.rect(gx+gw/2, gTop, W*0.03, gBot-gTop); }, toneSolid(mem(4)), 4);
    // keystone tick
    pen.seam(()=>{ g.moveTo(gx, gTop-gw*0.12); g.lineTo(gx, gTop+gw*0.14); }, 3);
  }

  // ---- FAR BUILDINGS lining the alley, kept close to the central gate so the
  //      right of the wall stays open for the escape postern ----
  if (has("farbuildings")){
    for(let side=-1; side<=1; side+=2){
      for(let i=0;i<2;i++){
        const depth = i/2;                                  // 0 far .. near
        const bw = W*(0.15+depth*0.07), bh = H*(0.11+depth*0.09);
        const bx = cx + side*(W*0.15 + depth*W*0.13);
        const by = horizon - depth*H*0.015;
        pen.paint(()=>{ g.rect(bx-bw/2, by-bh, bw, bh); }, toneSolid(mem(3+i)), 4);
        // a doorway threshold in each — the alleys have many openings
        const dw=bw*0.22, dh=bh*0.42;
        pen.paint(()=>{ g.rect(bx-dw/2, by-dh, dw, dh); }, toneSolid(mem(6)), 3);
        // a shallow roof pitch
        pen.seam(()=>{ g.moveTo(bx-bw/2,by-bh); g.lineTo(bx,by-bh-H*0.02); g.lineTo(bx+bw/2,by-bh); }, 3);
      }
    }
  }

  // ---- THE POSTERN / ESCAPE ROUTE: low arched gap in the wall, far right,
  //      drawn AFTER the buildings so it always reads as an open way out ----
  if (has("postern") && params.postern){
    const pw = W*0.10, px = W*0.90, pTop = horizon-H*0.15, pBot = horizon;
    pen.paint(()=>{
      g.moveTo(px-pw/2, pBot);
      g.lineTo(px-pw/2, pTop+pw*0.5);
      g.quadraticCurveTo(px, pTop, px+pw/2, pTop+pw*0.5);
      g.lineTo(px+pw/2, pBot);
      g.closePath();
    }, toneSolid(mem(6)), 4);
    // faint escape-path chevrons leading out through it
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    for(let i=0;i<3;i++){ const y=pBot-H*0.02-i*H*0.03;
      g.beginPath(); g.moveTo(px-pw*0.3,y+H*0.012); g.lineTo(px,y); g.lineTo(px+pw*0.3,y+H*0.012); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- THE ALLEY itself: a walkable corridor of shadow down the middle ----
  if (has("alley")){
    // a soft central lane a shade darker than the floor so it reads as the path
    pen.paint(()=>{
      g.moveTo(cx-W*0.05, horizon);
      g.lineTo(cx+W*0.05, horizon);
      g.lineTo(cx+W*0.15, H*0.98);
      g.lineTo(cx-W*0.15, H*0.98);
      g.closePath();
    }, toneSolid(mem(2)), 3);
  }

  // ---- ALLEY FLOOR: foreground pavement, drawn BEFORE the foreground objects
  //      so it reads as the ground they stand on (not painted over them) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    // perspective flagstones converging on the gate threshold
    for(let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(cx, horizon); g.lineTo(cx+i*W*0.14, H); g.stroke(); }
    for(let j=1;j<=4;j++){ const y=horizon+(H-horizon)*(j/4)*(j/4); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- BATHING CHAMBER: foreground-left, a sunken basin sitting on the floor ----
  if (has("bath") && params.bath){
    const bx=W*0.20, by=H*0.80, bw=W*0.28, bh=H*0.12;
    // low screen wall behind the basin (a private chamber)
    pen.paint(()=>{ g.rect(bx-bw*0.58, by-bh-H*0.11, bw*1.16, H*0.11); }, toneSolid(mem(3)), 4);
    pen.seam(()=>{ g.moveTo(bx-bw*0.58,by-bh-H*0.055); g.lineTo(bx+bw*0.58,by-bh-H*0.055); }, 2);
    // outer basin rim (light stone)
    pen.paint(()=>{ g.ellipse(bx, by, bw*0.6, bh*0.9, 0, 0, 7); }, toneSolid(mem(3)), 5);
    // the water: the memory's one cool, held tone, with ripple ticks
    pen.paint(()=>{ g.ellipse(bx, by, bw*0.44, bh*0.62, 0, 0, 7); }, toneSolid(mem(5)), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let i=0;i<3;i++){ const y=by-bh*0.28+i*bh*0.28;
      g.beginPath(); g.moveTo(bx-bw*0.3,y); g.lineTo(bx+bw*0.3,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- HIDDEN-CONVERSATION NOOK: a modest recessed alcove, foreground-right,
  //      kept low + not fully black so it stays within the faint memory tone ----
  if (has("nook") && params.nook){
    const nx=W*0.84, ny=H*0.90, nw=W*0.18, nh=H*0.155;
    // two flanking wall returns that hide the alcove
    pen.paint(()=>{ g.rect(nx-nw/2-W*0.045, ny-nh, W*0.055, nh); }, toneSolid(mem(4)), 4);
    pen.paint(()=>{ g.rect(nx+nw/2-W*0.01, ny-nh, W*0.055, nh); }, toneSolid(mem(4)), 4);
    // the recess between them (where a whispered exchange goes unseen)
    pen.paint(()=>{ g.rect(nx-nw/2, ny-nh, nw, nh); }, toneSolid(mem(5)), 5);
    // a lintel across the top
    pen.paint(()=>{ g.rect(nx-nw/2-W*0.045, ny-nh-H*0.018, nw+W*0.09, H*0.022); }, toneSolid(mem(4)), 4);
    // a low bench inside
    pen.paint(()=>{ g.rect(nx-nw*0.34, ny-nh*0.24, nw*0.68, nh*0.16); }, toneSolid(mem(3)), 3);
  }
}

export const asset = {
  id:"location.troy-interior-memory-set",
  type:"LOCATION",
  name:"Troy Interior Memory Set",
  statusWord:"RECOLLECTED",
  scene:"OD-B04-S03",

  params,
  // back -> front draw order the set honors; scene state may pass a subset
  layers:["sky","citywall","gate","postern","farbuildings","alley","bath","nook","floor","anchors"],
  // normalized 0..1 placement / threshold / camera anchors (NO baked characters)
  anchors:{
    "gate:main":{x:.44,y:.42}, "threshold:gate":{x:.44,y:.60},
    "escape:postern":{x:.86,y:.56}, "threshold:escape":{x:.86,y:.60},
    "alley:mouth":{x:.50,y:.94}, "alley:mid":{x:.50,y:.72},
    "bath:basin":{x:.22,y:.82}, "bath:step":{x:.22,y:.90},
    "nook:hidden":{x:.83,y:.84}, "nook:bench":{x:.83,y:.78},
    "camera:wide":{x:.50,y:.50}, "camera:alley":{x:.50,y:.66}, "camera:nook":{x:.78,y:.80},
  },
  // walkable regions for scene placement / pathing
  zones:{
    walkable:{ x0:.08,y0:.62,x1:.92,y1:.98 },
    alley:{ x0:.34,y0:.62,x1:.66,y1:.98 },
    bath:{ x0:.08,y0:.78,x1:.37,y1:.96 },
    nook:{ x0:.72,y0:.76,x1:.96,y1:.96 },
  },
  states:{
    initial:"remembered",
    nodes:{
      // full recollection: every zone present, faint
      remembered:{ preview:{ layers:["sky","citywall","gate","postern","farbuildings","alley","bath","nook","floor"] } },
      // the memory narrows to the private exchange: gate + nook fade of the bath
      "nook-focus":{ preview:{ layers:["sky","citywall","gate","alley","nook","floor"] } },
      // the memory narrows to the washing: bath foregrounded
      "bath-focus":{ preview:{ layers:["sky","citywall","gate","alley","bath","floor"] } },
      // the escape: wall + postern only, the way out held
      escape:{ preview:{ layers:["sky","citywall","gate","postern","alley","floor"] } },
    },
    edges:[["remembered","nook-focus"],["remembered","bath-focus"],["nook-focus","escape"],["bath-focus","escape"]],
  },
  channels:["reveal","camera","fade","light"],

  preview:()=>({ layers:["sky","citywall","gate","postern","farbuildings","alley","bath","nook","floor"], status:"RECOLLECTED", progress:.16 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
