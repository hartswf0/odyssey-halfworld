/* prop.gift-inventory — the Phaeacian parting-gifts as a COUNTABLE TREASURE
   ARRAY: a spread row of bronze tripods, two-handled cauldrons, stacked gold
   ingots and folded cloth, drawn from a small set of item templates placed
   into a formation. PROP asset for the Book-13 treasure-counting beat.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B13-S02): a reusable countable-group object with five
   states —
     UNLOAD  the goods heaped off the ship in a rough overlapping pile,
     SPREAD  the same goods laid out along the ground in a countable row,
     COUNT   the spread row under a tally ledger, a bracket marking the item
             currently being told over, counted items ticked off,
     RECLOSE the goods gathered back beside a strong-box, its lid swung half
             up as they are packed away,
     HIDE    the box shut and covered over with cave rocks, dimmed.
   The inventory list is the single source of truth for the count; each state
   places the SAME items so the array stays consistent. Item / count / stow
   contact anchors, ownership, and a collision box declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

/* the countable array — the ONE source of truth for what is being tallied.
   Each entry is one gift with a type + a size (fraction of W/H). */
const INVENTORY = [
  { type:"tripod",   w:.150, h:.320 },
  { type:"cauldron", w:.165, h:.235 },
  { type:"gold",     w:.150, h:.200 },
  { type:"cloth",    w:.155, h:.215 },
  { type:"tripod",   w:.130, h:.285 },
  { type:"cauldron", w:.140, h:.205 },
];

const params = {
  count:   INVENTORY.length,   // number of gifts in the array (what COUNT tells)
  ground:  0.72,               // ground line as fraction of H (row rests here)
  bronzeLight: 3,              // lit bronze body
  bronzeShade: 4,              // shaded bronze flank
  goldTone:  3,                // gold ingots (a light, prized metal)
  clothTone: 4,                // folded cloth stacks
};

const HOLLOW = 6;   // dark vessel interior
const CHEST  = 4;   // strong-box body
const CHEST_D= 5;   // strap / shadowed chest face
const ROCK   = 5;   // cave rocks piled over the hidden box

/* rounded-rect sub-path (caller wraps in pen.paint/seam) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* ==================================================================
   ITEM TEMPLATES — each drawn in a LOCAL frame with base centre at
   (cx, baseY) and up = -y, spanning width w / height h. tone = body
   ink level (light body .. +2 shaded flank). Every group member is one
   of these bodies under a scale + a small tilt.
   ================================================================== */

/* bronze tripod cauldron — a deep bowl (lebes) on three splayed legs,
   ring handles at the rim. The signature Homeric prize. */
function drawTripod(pen,g,cx,baseY,w,h,tone,tilt=0){
  g.save(); g.translate(cx,baseY); g.rotate(tilt);
  const rimY = -h*0.60, rx = w*0.44, ry = h*0.17;
  const bowlBot = -h*0.30;
  const legTone = toneSolid(inkLevel(tone+2));
  // three splayed legs (back-centre drawn first, then the two front legs)
  pen.limb(()=>{ g.moveTo(0, bowlBot*1.02); g.lineTo(0, -h*0.01); }, legTone, w*0.052);
  pen.limb(()=>{ g.moveTo(-w*0.20, bowlBot); g.lineTo(-w*0.44, 0); }, legTone, w*0.052);
  pen.limb(()=>{ g.moveTo( w*0.20, bowlBot); g.lineTo( w*0.44, 0); }, legTone, w*0.052);
  // little foot pads
  pen.paint(()=>{ g.ellipse(-w*0.44, 0, w*0.06, h*0.018, 0,0,7); }, legTone, 2);
  pen.paint(()=>{ g.ellipse( w*0.44, 0, w*0.06, h*0.018, 0,0,7); }, legTone, 2);
  // the deep bowl
  pen.paint(()=>{
    g.moveTo(-rx, rimY);
    g.quadraticCurveTo(-rx*0.96, rimY+h*0.30, 0, bowlBot);
    g.quadraticCurveTo( rx*0.96, rimY+h*0.30,  rx, rimY);
    g.closePath();
  }, toneSolid(inkLevel(tone)), 5);
  // shaded near flank
  pen.paint(()=>{
    g.moveTo(rx*0.20, rimY+h*0.03);
    g.quadraticCurveTo(rx*0.96, rimY+h*0.30, 0, bowlBot);
    g.quadraticCurveTo(rx*0.5, rimY+h*0.22, rx*0.20, rimY+h*0.03);
    g.closePath();
  }, toneSolid(inkLevel(tone+1)), 0);
  // rim band + dark interior
  pen.paint(()=>{ g.ellipse(0, rimY, rx, ry, 0,0,7); }, toneSolid(inkLevel(tone+1)), 4);
  pen.paint(()=>{ g.ellipse(0, rimY, rx*0.80, ry*0.80, 0,0,7); }, toneSolid(inkLevel(HOLLOW)), 3);
  // ring handles at the rim
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  g.beginPath(); g.ellipse(-rx*0.98, rimY, w*0.06, h*0.055, 0.4, 0,7); g.stroke();
  g.beginPath(); g.ellipse( rx*0.98, rimY, w*0.06, h*0.055,-0.4, 0,7); g.stroke();
  g.restore();
}

/* two-handled bronze cauldron — a squat bulging pot on a small foot ring. */
function drawCauldron(pen,g,cx,baseY,w,h,tone,tilt=0){
  g.save(); g.translate(cx,baseY); g.rotate(tilt);
  const rx = w*0.46, cy = -h*0.44, ry = h*0.40;
  const rimY = cy - ry*0.84;
  // foot ring
  pen.paint(()=>{ g.ellipse(0, -h*0.015, rx*0.44, h*0.03, 0,0,7); }, toneSolid(inkLevel(tone+2)), 3);
  // handles (behind the belly)
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  g.beginPath(); g.ellipse(-rx*0.99, cy-ry*0.18, w*0.075, h*0.10, 0.25,0,7); g.stroke();
  g.beginPath(); g.ellipse( rx*0.99, cy-ry*0.18, w*0.075, h*0.10,-0.25,0,7); g.stroke();
  // bulging body
  pen.paint(()=>{ g.ellipse(0, cy, rx, ry, 0,0,7); }, toneSolid(inkLevel(tone)), 5);
  // shaded lower belly
  pen.paint(()=>{ g.ellipse(0, cy+ry*0.22, rx*0.82, ry*0.52, 0, 0.12, Math.PI-0.12); },
    toneSolid(inkLevel(tone+2)), 0);
  // in-turned rim + dark mouth
  pen.paint(()=>{ g.ellipse(0, rimY, rx*0.62, h*0.055, 0,0,7); }, toneSolid(inkLevel(tone+1)), 4);
  pen.paint(()=>{ g.ellipse(0, rimY, rx*0.50, h*0.042, 0,0,7); }, toneSolid(inkLevel(HOLLOW)), 3);
  g.restore();
}

/* stacked gold ingots — a small pyramid (3 / 2 / 1) of trapezoid bars,
   each with a lighter top face so the pile reads as blocks. */
function drawGold(pen,g,cx,baseY,w,h,tone){
  g.save(); g.translate(cx,baseY);
  const iw = w*0.34, ih = h*0.24, gap = iw*0.99;
  const rows = [ {n:3,y:0}, {n:2,y:-ih*1.02}, {n:1,y:-ih*2.04} ];
  const ingot=(x,y)=>{
    pen.paint(()=>{                                   // front face (trapezoid)
      g.moveTo(x-iw*0.5,y); g.lineTo(x+iw*0.5,y);
      g.lineTo(x+iw*0.40,y-ih); g.lineTo(x-iw*0.40,y-ih); g.closePath();
    }, toneSolid(inkLevel(tone+1)), 3.5);
    pen.paint(()=>{                                   // lit top face
      g.moveTo(x-iw*0.40,y-ih); g.lineTo(x+iw*0.40,y-ih);
      g.lineTo(x+iw*0.30,y-ih*1.28); g.lineTo(x-iw*0.30,y-ih*1.28); g.closePath();
    }, toneSolid(inkLevel(tone)), 3);
  };
  rows.forEach(r=>{
    const span=(r.n-1)*gap;
    for(let i=0;i<r.n;i++) ingot(-span/2 + i*gap, r.y);
  });
  g.restore();
}

/* folded cloth stack — offset rounded slabs with fold seams, a bound bundle. */
function drawCloth(pen,g,cx,baseY,w,h,tone){
  g.save(); g.translate(cx,baseY);
  const layers=4, lw=w*0.86, lh=h*0.205;
  for(let i=0;i<layers;i++){
    const y = -i*lh*0.98 - lh*0.5;
    const off = (i%2 ? w*0.035 : -w*0.035);
    const tt = tone + (i%2?1:0);
    pen.paint(()=>{ rr(g, off-lw/2, y-lh/2, lw, lh, lh*0.34); }, toneSolid(inkLevel(tt)), 4);
    // rolled-fold along the near edge
    pen.paint(()=>{ g.ellipse(off-lw/2+lh*0.42, y, lh*0.34, lh*0.44, 0, Math.PI*0.5, Math.PI*1.5); },
      toneSolid(inkLevel(tt+1)), 2.5);
    // a horizontal fold seam
    pen.seam(()=>{ g.moveTo(off-lw/2+lh*0.7, y+lh*0.14); g.lineTo(off+lw/2-lh*0.2, y+lh*0.14); }, 2);
  }
  g.restore();
}

function drawItem(pen,g,it){
  if(it.type==="tripod")   drawTripod(pen,g,it.cx,it.baseY,it.w,it.h,it.tone,it.tilt||0);
  else if(it.type==="cauldron") drawCauldron(pen,g,it.cx,it.baseY,it.w,it.h,it.tone,it.tilt||0);
  else if(it.type==="gold") drawGold(pen,g,it.cx,it.baseY,it.w,it.h,it.tone);
  else drawCloth(pen,g,it.cx,it.baseY,it.w,it.h,it.tone);
}

/* ==================================================================
   FORMATIONS — the same INVENTORY placed three ways.
   ================================================================== */
function placeRow(W,H){
  const groundY = H*params.ground;
  const n = INVENTORY.length;
  const x0 = 0.115, x1 = 0.885;
  return INVENTORY.map((it,i)=>{
    const fx = n>1 ? x0 + (x1-x0)*(i/(n-1)) : 0.5;
    return { ...it, cx:W*fx, baseY:groundY, w:W*it.w, h:H*it.h,
             tone:(i%2? params._t(it):params._tS(it)) };
  });
}
function placePile(W,H){
  const groundY = H*params.ground;
  // rough overlapping heap, front items lower/bigger, slight tilts
  const layout = [
    { i:0, fx:0.36, dy:0.010, tilt:-0.10, sc:1.00 },
    { i:1, fx:0.58, dy:0.020, tilt: 0.08, sc:0.98 },
    { i:2, fx:0.68, dy:-0.150, tilt:0.00, sc:0.90 },
    { i:3, fx:0.30, dy:-0.140, tilt:0.05, sc:0.92 },
    { i:4, fx:0.50, dy:-0.020, tilt:-0.14,sc:0.96 },
    { i:5, fx:0.46, dy:-0.185, tilt:0.10, sc:0.86 },
  ];
  return layout.map(L=>{
    const it = INVENTORY[L.i];
    return { ...it, cx:W*L.fx, baseY:groundY + H*L.dy, w:W*it.w*L.sc, h:H*it.h*L.sc,
             tilt:L.tilt, tone:(L.i%2? params._t(it):params._tS(it)) };
  }).sort((a,b)=> a.baseY - b.baseY);   // back-to-front
}

/* tone helpers (bronze light vs shaded; gold/cloth keep their own tone) */
params._t  = it => it.type==="gold"?params.goldTone : it.type==="cloth"?params.clothTone : params.bronzeLight;
params._tS = it => it.type==="gold"?params.goldTone : it.type==="cloth"?params.clothTone+1 : params.bronzeShade;

/* ==================================================================
   OVERLAYS
   ================================================================== */
function drawGroundLine(pen,g,W,H){
  const gy=H*params.ground;
  g.fillStyle=inkLevel(2); g.fillRect(0, gy, W, H-gy);
  pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 3);
}

/* the COUNT ledger — a tally band across the top, one tick per gift,
   fives struck through; counted ticks go full ink, the rest stay faint. */
function drawLedger(g,W,H,counted){
  const n=INVENTORY.length, y=H*0.095;
  g.save();
  // ledger rule
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  g.beginPath(); g.moveTo(W*0.12, y+H*0.032); g.lineTo(W*0.12+ (n-0.4)*W*0.028, y+H*0.032); g.stroke();
  for(let i=0;i<n;i++){
    const on = i < counted;
    const x = W*0.135 + i*W*0.028;
    g.strokeStyle = on ? INK : inkLevel(3); g.lineWidth = on?4:3;
    g.beginPath(); g.moveTo(x, y-H*0.020); g.lineTo(x, y+H*0.020); g.stroke();
    if((i+1)%5===0){                                   // strike the group of five
      g.strokeStyle = on ? INK : inkLevel(3);
      g.beginPath(); g.moveTo(x-W*0.11, y+H*0.024); g.lineTo(x+W*0.006, y-H*0.024); g.stroke();
    }
  }
  g.restore();
}

/* a bracket under the gift currently being told over */
function drawCountBracket(pen,g,W,H,item){
  const y=H*params.ground+H*0.028, hw=item.w*0.60, d=H*0.020;
  g.strokeStyle=ACCENT; g.lineWidth=4; g.lineCap="round"; g.lineJoin="round";
  g.beginPath();
  g.moveTo(item.cx-hw, y); g.lineTo(item.cx-hw, y+d);
  g.lineTo(item.cx+hw, y+d); g.lineTo(item.cx+hw, y); g.stroke();
}

/* the strong-box the goods are packed back into (reclose / hide) */
function drawChest(pen,g,W,H,lid){
  const cx=W*0.5, baseY=H*params.ground, cw=W*0.46, ch=H*0.20;
  const topY=baseY-ch;
  // body
  pen.paint(()=>{ rr(g, cx-cw/2, topY, cw, ch, W*0.012); }, toneSolid(inkLevel(CHEST)), 5);
  // vertical corner straps + a central strap
  for(const sx of [-0.42,0,0.42]){
    pen.paint(()=>{ g.rect(cx+cw*sx-W*0.012, topY, W*0.024, ch); }, toneSolid(inkLevel(CHEST_D)), 3);
  }
  // lower shadow band
  pen.paint(()=>{ g.rect(cx-cw/2, baseY-ch*0.22, cw, ch*0.22); }, toneSolid(inkLevel(CHEST_D)), 0);
  // lock plate
  pen.paint(()=>{ rr(g, cx-W*0.026, topY+ch*0.30, W*0.052, ch*0.34, W*0.008); }, toneSolid(inkLevel(6)), 3);
  // the lid — hinged at the back edge, swung up by `lid` (0 shut .. 1 open)
  const ang = -lid*1.15;                       // radians, opening backward
  g.save(); g.translate(cx-cw/2, topY); g.rotate(ang);
  pen.paint(()=>{ rr(g, 0, -ch*0.34, cw, ch*0.34, W*0.012); }, toneSolid(inkLevel(CHEST-1<1?1:CHEST-1)), 5);
  // lid strap ends
  for(const sx of [0.08,0.5,0.92]){
    pen.paint(()=>{ g.rect(cw*sx-W*0.012, -ch*0.34, W*0.024, ch*0.34); }, toneSolid(inkLevel(CHEST_D)), 2);
  }
  g.restore();
  return { cx, topY, cw, ch, baseY };
}

/* cave rocks heaped over the shut box (hide) */
function drawRocks(pen,g,W,H,K){
  const rocks=[
    {x:0.30,y:0.02,rx:0.14,ry:0.10}, {x:0.52,y:-0.02,rx:0.17,ry:0.13},
    {x:0.70,y:0.03,rx:0.13,ry:0.09}, {x:0.42,y:-0.10,rx:0.12,ry:0.09},
    {x:0.60,y:-0.11,rx:0.11,ry:0.08},
  ];
  for(const r of rocks){
    pen.paint(()=>{ g.ellipse(W*r.x, K.baseY-K.ch*0.5 + H*r.y, W*r.rx, H*r.ry, 0,0,7); },
      toneSolid(inkLevel(ROCK)), 4);
    pen.seam(()=>{ g.moveTo(W*r.x-W*r.rx*0.4, K.baseY-K.ch*0.5+H*r.y);
                   g.lineTo(W*r.x+W*r.rx*0.3, K.baseY-K.ch*0.5+H*r.y-H*r.ry*0.4); }, 2);
  }
}

/* ==================================================================
   DRAW
   ================================================================== */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const layout = st.layout || "row";     // row | pile | chest
  const t = st.t ?? 0;

  if (layout==="chest"){
    // RECLOSE / HIDE: the box, some goods still beside it, or rocks over it
    drawGroundLine(pen,g,W,H);
    const dim = st.dim ?? 0;             // fade for the hidden state
    if (dim>0.5){ g.save(); g.globalAlpha=0.9; }
    const K = drawChest(pen,g,W,H, st.lid ?? 0);

    if (st.beside){
      // a couple of gifts gathered at the box, waiting to go in (reclose)
      const gy=H*params.ground;
      const a = { ...INVENTORY[0], cx:W*0.165, baseY:gy, w:W*INVENTORY[0].w*0.9, h:H*INVENTORY[0].h*0.9,
                  tone:params._tS(INVENTORY[0]) };
      const b = { ...INVENTORY[2], cx:W*0.835, baseY:gy, w:W*INVENTORY[2].w*0.95, h:H*INVENTORY[2].h*0.95,
                  tone:params.goldTone };
      g.beginPath(); g.ellipse(a.cx,a.baseY+5,a.w*0.5,H*0.010,0,0,7);
      g.beginPath(); g.ellipse(b.cx,b.baseY+5,b.w*0.5,H*0.010,0,0,7);
      drawItem(pen,g,a); drawItem(pen,g,b);
    }
    if (st.rocks) drawRocks(pen,g,W,H,K);
    if (dim>0.5) g.restore();
    return;
  }

  // UNLOAD (pile) / SPREAD / COUNT — the item array on the ground
  drawGroundLine(pen,g,W,H);
  const list = layout==="pile" ? placePile(W,H) : placeRow(W,H);

  // ground shadows
  g.fillStyle="rgba(0,0,0,0.10)";
  for(const it of list){
    g.beginPath(); g.ellipse(it.cx, it.baseY+5, it.w*0.52, H*0.010, 0,0,7); g.fill();
  }
  // the gifts, back-to-front
  for(const it of list) drawItem(pen,g,it);

  // COUNT overlay: tally ledger + a bracket sweeping the row
  if (layout==="row" && st.count){
    const n = INVENTORY.length;
    const frac = clamp(st.count, 0, 1);
    const counted = Math.round(frac*n);
    drawLedger(g,W,H, counted);
    const idx = clamp(counted-1, 0, n-1);
    drawCountBracket(pen,g,W,H, list[idx]);
  }
}

export const asset = {
  id:"prop.gift-inventory",
  type:"PROP",
  name:"Gift Inventory",
  statusWord:"COUNTED",
  scene:"OD-B13-S02",

  params,
  // back -> front draw order the prop honors
  layers:["ground","shadow","chest","legs","body","flank","rim","hollow","ingots",
          "cloth","rocks","ledger","bracket"],
  // normalized 0..1 anchors: item / count / stow contacts
  anchors:{
    "contact:ground":{x:.50,y:.72},       // the row / pile rests on this line
    "spread:start":{x:.115,y:.72},         // left end of the laid-out row
    "spread:end":{x:.885,y:.72},           // right end of the laid-out row
    "item:tripod":{x:.115,y:.55},          // grip point on the first tripod's rim
    "item:gold":{x:.50,y:.62},             // the gold-ingot pile centre
    "count:ledger":{x:.50,y:.12},          // where the tally is kept
    "stow:chest":{x:.50,y:.62},            // the strong-box mouth (pack point)
  },
  // ownership + collision box (AABB in 0..1) for placement / pathing
  ownership:{ giver:"Phaeacians", receiver:"Odysseus", kind:"guest-gifts" },
  owner:"odysseus:phaeacian-gifts",
  zones:{ bounds:{ x0:.08,y0:.30,x1:.92,y1:.86 }, footprint:{ x0:.10,y0:.70,x1:.90,y1:.80 } },

  states:{
    initial:"spread",
    nodes:{
      unload: { preview:{ layout:"pile", status:"UNLOADED", progress:.20 } },
      spread: { preview:{ layout:"row",  status:"SPREAD",   progress:.40 } },
      count:  { preview:{ layout:"row", count:0.67, status:"COUNTED", progress:.60 } },
      reclose:{ preview:{ layout:"chest", lid:0.7, beside:true, status:"RECLOSING", progress:.80 } },
      hide:   { preview:{ layout:"chest", lid:0, rocks:true, dim:1, status:"HIDDEN", progress:1.0 } },
    },
    edges:[["unload","spread"],["spread","count"],["count","reclose"],
           ["reclose","hide"],["hide","reclose"],["count","spread"],["spread","unload"]],
  },
  channels:["layout","count","lid","dim","t"],

  preview:()=>({ layout:"row", t:0, status:"SPREAD", progress:.40 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones, owner:asset.owner }; },
};
export default asset;
