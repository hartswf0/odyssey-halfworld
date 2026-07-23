/* location.odysseuss-palace-threshold-and-hall — the great hall of Odysseus.
   LOCATION asset. An EMPTY navigable royal interior seen from just inside the
   entrance: the outer gate + stone porch at front-left (the beggar's
   threshold), a spear rack against the near wall, private guest seats set
   apart by the door, the long feast tables of the central hall, columns
   carrying the roof, and the upper stair rising at the back-right toward the
   women's quarters. Drawn in SOLID grays + hard contour; the engine dotify
   pass supplies the halftone. NO characters baked in.
   Atlas: OD-B01-S03 — occupied royal hall, gate/porch/spear-rack/guest-seats/
   feast zone/upper stair. */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "/engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.72,      // hall floor horizon as fraction of H
  columns:2,            // roof columns flanking the feast bay
  spears:5,             // spears standing in the wall rack
  feastTables:2,        // long benched tables in the feast zone
  stairSteps:6,         // upper stair rising at the back-right
  porchGate:true,       // outer gate + porch threshold at front-left
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const wallTop = horizon - H*0.46;
  const layers = st.layers || ["backwall","upperstair","columns","spearrack","feast","guestseat","porchgate","floor"];
  const has = l => layers.includes(l);

  // ---- BACK WALL of the hall (lightest structural tone) ----
  if (has("backwall")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    // masonry wall block behind the hall
    pen.paint(()=>{ g.rect(W*0.04, wallTop, W*0.92, horizon-wallTop); }, toneSolid(inkLevel(2)), 5);
    // roof beam / cornice line
    pen.ink(()=>{ g.moveTo(W*0.04,wallTop); g.lineTo(W*0.96,wallTop); }, 5);
    // a second roof beam just below the cornice
    pen.paint(()=>{ g.rect(W*0.04, wallTop+H*0.03, W*0.92, H*0.025); }, toneSolid(inkLevel(4)), 4);
    // faint course lines of stone
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.24;
    for(let j=1;j<=4;j++){ const y=wallTop+(horizon-wallTop)*(j/5); g.beginPath(); g.moveTo(W*0.04,y); g.lineTo(W*0.96,y); g.stroke(); }
    g.globalAlpha=1;
    // high smoke-hole / clerestory opening (dark) centered above the feast
    pen.paint(()=>{ g.rect(W*0.44, wallTop+H*0.075, W*0.12, H*0.06); }, toneSolid(inkLevel(6)), 4);
  }

  // ---- UPPER STAIR (back-right, rising toward the women's quarters) ----
  if (has("upperstair")){
    const sx=W*0.80, sy=horizon-H*0.01, sw=W*0.16, sh=H*0.36, n=params.stairSteps;
    for(let i=0;i<n;i++){
      const t=i/n, tp=(i+1)/n;
      const y0=sy - sh*t, y1=sy - sh*tp;
      const x0=sx + sw*t*0.50;
      const tread=sw*(1-t*0.45)*0.55;
      pen.paint(()=>{ g.rect(x0, y1, tread, (y0-y1)); }, toneSolid(inkLevel(3+ (i%2))), 4);  // step tread
    }
    // stair side stringer (darker, gives the rising diagonal)
    pen.paint(()=>{
      g.moveTo(sx, sy);
      g.lineTo(sx + sw*0.50, sy - sh);
      g.lineTo(sx + sw*0.72, sy - sh);
      g.lineTo(sx + sw*0.28, sy);
      g.closePath();
    }, toneSolid(inkLevel(5)), 5);
    // dark doorway at the top of the stair
    pen.paint(()=>{ g.rect(sx+sw*0.50, wallTop+H*0.02, W*0.085, H*0.11); }, toneSolid(inkLevel(6)), 4);
  }

  // ---- ROOF COLUMNS flanking the feast bay (two tall shafts to the roof) ----
  if (has("columns")){
    const cols=[W*0.40, W*0.66];
    for(const cx of cols){
      const cw=W*0.040, top=wallTop+H*0.055, bot=horizon;
      pen.paint(()=>{ g.rect(cx-cw/2, top, cw, bot-top); }, toneSolid(inkLevel(4)), 5);        // shaft
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;                                     // fluting
      g.beginPath(); g.moveTo(cx-cw*0.2,top); g.lineTo(cx-cw*0.2,bot); g.moveTo(cx+cw*0.2,top); g.lineTo(cx+cw*0.2,bot); g.stroke(); g.globalAlpha=1;
      pen.paint(()=>{ g.rect(cx-cw*0.9, top, cw*1.8, H*0.022); }, toneSolid(inkLevel(6)),4);    // capital
      pen.paint(()=>{ g.rect(cx-cw*0.75, bot-H*0.02, cw*1.5, H*0.02); }, toneSolid(inkLevel(5)),4); // base
    }
  }

  // ---- SPEAR RACK on the wall, just inside the door (left of the feast) ----
  if (has("spearrack")){
    const rx0=W*0.245, rx1=W*0.355, ry=horizon-H*0.005, top=horizon-H*0.34, n=params.spears;
    // rack backing board (light so the dark spears read against it)
    pen.paint(()=>{ g.rect(rx0-W*0.01, top-H*0.02, (rx1-rx0)+W*0.02, ry-top+H*0.02); }, toneSolid(inkLevel(2)), 5);
    // upright spears, slightly fanned, bold dark shafts with heads
    for(let i=0;i<n;i++){
      const t=n>1?i/(n-1):0.5;
      const bx=rx0 + (rx1-rx0)*t;                 // foot along the rack
      const tx=rx0 + (rx1-rx0)*(0.5 + (t-0.5)*0.55);
      const ty=top;
      pen.ink(()=>{ g.moveTo(bx, ry-H*0.01); g.lineTo(tx, ty); }, 4);   // shaft
      g.fillStyle=inkLevel(7); g.beginPath();                          // spearhead (leaf blade)
      g.moveTo(tx, ty-H*0.045); g.lineTo(tx-W*0.011, ty-H*0.006); g.lineTo(tx+W*0.011, ty-H*0.006); g.closePath(); g.fill();
    }
    // two horizontal rack rails holding the spears
    pen.paint(()=>{ g.rect(rx0-W*0.012, top+H*0.10, (rx1-rx0)+W*0.024, H*0.018); }, toneSolid(inkLevel(5)),4);
    pen.paint(()=>{ g.rect(rx0-W*0.012, ry-H*0.05, (rx1-rx0)+W*0.024, H*0.03); }, toneSolid(inkLevel(6)),4);
  }

  // ---- FEAST ZONE: long benched tables down the center of the hall ----
  if (has("feast")){
    const n=params.feastTables;
    for(let i=0;i<n;i++){
      const depth=i/n;                             // 0 near .. far
      const tw=W*0.20*(1-depth*0.26), th=H*0.038*(1-depth*0.2);
      const tx=W*0.53 - depth*W*0.02;
      const ty=horizon - depth*H*0.15 - H*0.03;
      pen.paint(()=>{ g.rect(tx-tw/2, ty-th, tw, th); }, toneSolid(inkLevel(4)), 5);                 // table top
      pen.paint(()=>{ g.rect(tx-tw*0.44, ty, tw*0.06, H*0.06*(1-depth*0.2)); }, toneSolid(inkLevel(5)),4); // leg
      pen.paint(()=>{ g.rect(tx+tw*0.38, ty, tw*0.06, H*0.06*(1-depth*0.2)); }, toneSolid(inkLevel(5)),4); // leg
      pen.paint(()=>{ g.rect(tx-tw*0.42, ty+H*0.066*(1-depth*0.2), tw*0.84, th*0.7); }, toneSolid(inkLevel(3)),4); // bench
    }
    // central hearth of the feast zone with flames
    const hx=W*0.53, hy=horizon-H*0.008;
    pen.paint(()=>{ g.ellipse(hx,hy,W*0.045,H*0.016,0,0,7); }, toneSolid(inkLevel(5)), 4);
    g.fillStyle=inkLevel(7);
    for(let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(hx+k*W*0.018-W*0.006, hy); g.lineTo(hx+k*W*0.018, hy-H*0.03); g.lineTo(hx+k*W*0.018+W*0.006, hy); g.closePath(); g.fill(); }
  }

  // ---- PRIVATE GUEST SEAT set apart by the door (mid-right) ----
  if (has("guestseat")){
    const cx=W*0.75, cy=horizon+H*0.01;
    pen.paint(()=>{ g.rect(cx-W*0.042, cy-H*0.05, W*0.084, H*0.042); }, toneSolid(inkLevel(5)), 5);   // seat
    pen.paint(()=>{ g.rect(cx-W*0.042, cy-H*0.135, W*0.02, H*0.085); }, toneSolid(inkLevel(6)), 4);    // back post
    pen.paint(()=>{ g.rect(cx+W*0.022, cy-H*0.135, W*0.02, H*0.085); }, toneSolid(inkLevel(6)), 4);    // back post
    pen.paint(()=>{ g.rect(cx-W*0.042, cy-H*0.135, W*0.084, H*0.018); }, toneSolid(inkLevel(6)), 4);   // back rail
    pen.paint(()=>{ g.rect(cx-W*0.036, cy-H*0.008, W*0.012, H*0.028); }, toneSolid(inkLevel(6)),3);    // leg
    pen.paint(()=>{ g.rect(cx+W*0.024, cy-H*0.008, W*0.012, H*0.028); }, toneSolid(inkLevel(6)),3);    // leg
    // low footstool set before the chair of honor
    pen.paint(()=>{ g.rect(cx-W*0.05, cy+H*0.028, W*0.05, H*0.018); }, toneSolid(inkLevel(4)), 4);
  }

  // ---- OUTER GATE + PORCH (front-left threshold, the beggar's seat) ----
  if (has("porchgate") && params.porchGate){
    const gtop=wallTop+H*0.02, gbot=horizon+H*0.03;
    // outer gate posts + lintel framing the doorway on the left edge
    pen.paint(()=>{ g.rect(W*0.02, gtop, W*0.045, gbot-gtop); }, toneSolid(inkLevel(5)), 5);   // near jamb post
    pen.paint(()=>{ g.rect(W*0.155, gtop, W*0.04, gbot-gtop); }, toneSolid(inkLevel(5)), 5);   // far jamb post
    pen.paint(()=>{ g.rect(W*0.02, gtop, W*0.175, H*0.05); }, toneSolid(inkLevel(6)), 5);      // lintel beam
    // the doorway opening between the posts (dark passage to the courtyard)
    pen.paint(()=>{ g.rect(W*0.065, gtop+H*0.05, W*0.09, gbot-gtop-H*0.05); }, toneSolid(inkLevel(3)), 4);
    // porch step block jutting into the foreground
    pen.paint(()=>{ g.rect(0, horizon+H*0.06, W*0.22, H-(horizon+H*0.06)); }, toneSolid(inkLevel(3)), 5);
    // the raised stone threshold slab (Odysseus the beggar sits here)
    pen.paint(()=>{ g.rect(W*0.02, horizon+H*0.02, W*0.175, H*0.06); }, toneSolid(inkLevel(5)), 5);
    pen.ink(()=>{ g.moveTo(W*0.02,horizon+H*0.05); g.lineTo(W*0.195,horizon+H*0.05); }, 3);
  }

  // ---- FLOOR of the hall with receding perspective ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.40;
    const vx=W*0.52, vy=horizon;                    // vanishing point down the hall
    for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(vx, vy); g.lineTo(W*(0.5+i*0.17), H); g.stroke(); }
    for(let j=1;j<=4;j++){ const y=horizon+(H-horizon)*(j/4)*(j/4); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.odysseuss-palace-threshold-and-hall",
  type:"LOCATION",
  name:"Odysseus's Palace Threshold and Hall",
  statusWord:"OCCUPIED",
  scene:"OD-B01-S03",

  params,
  // back -> front draw order; scene state may pass a subset of these
  layers:["backwall","upperstair","columns","spearrack","feast","guestseat","porchgate","floor"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "threshold:stone":{x:.11,y:.79},        // the beggar's seat on the sill
    "gate:outer":{x:.11,y:.62},             // outer gate to the courtyard
    "porch:step":{x:.11,y:.90},
    "rack:spears":{x:.30,y:.58},            // spear rack on the wall by the door
    "seat:guest-honor":{x:.75,y:.74},       // private guest chair set apart
    "footstool:guest":{x:.72,y:.80},
    "feast:hearth":{x:.53,y:.72},           // central hearth of the feast zone
    "feast:table-near":{x:.53,y:.68},
    "feast:table-far":{x:.51,y:.56},
    "stair:foot":{x:.82,y:.70},             // foot of the upper stair
    "stair:top-door":{x:.90,y:.30},         // door to the women's quarters
    "entrance:gate":{x:.11,y:.70}, "exit:stair":{x:.90,y:.30},
    "camera:wide":{x:.50,y:.50}, "camera:threshold":{x:.18,y:.70}, "camera:feast":{x:.53,y:.62},
  },
  // walkable ground regions for scene placement / pathing
  zones:{
    walkable:{ x0:.03,y0:.74,x1:.97,y1:.98 },
    feastzone:{ x0:.40,y0:.60,x1:.68,y1:.84 },
    thresholdzone:{ x0:.02,y0:.74,x1:.24,y1:.94 },
    guestzone:{ x0:.68,y0:.72,x1:.80,y1:.88 },
  },
  states:{
    initial:"occupied",
    nodes:{
      occupied:{ preview:{ layers:["backwall","upperstair","columns","spearrack","feast","guestseat","porchgate","floor"] } },
      "feast-cleared":{ preview:{ layers:["backwall","upperstair","columns","spearrack","guestseat","porchgate","floor"] } },
      "arms-removed":{ preview:{ layers:["backwall","upperstair","columns","feast","guestseat","porchgate","floor"] } },
      empty:{ preview:{ layers:["backwall","upperstair","columns","porchgate","floor"] } },
    },
    edges:[["occupied","feast-cleared"],["occupied","arms-removed"],["feast-cleared","empty"],["arms-removed","empty"]],
  },
  channels:["reveal","camera","light","hearth"],

  preview:()=>({ layers:["backwall","upperstair","columns","spearrack","feast","guestseat","porchgate","floor"], status:"OCCUPIED", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
