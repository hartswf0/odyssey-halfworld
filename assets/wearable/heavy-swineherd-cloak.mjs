/* wearable.heavy-swineherd-cloak — the thick wool/hide mantle Eumaeus the
   swineherd throws over the disguised Odysseus by the fire (Book 14). A single
   HEAVY garment, drawn flat as a wardrobe / EQUIP diagram: a broad felted wool
   cloak with a rolled collar, a thick rolled hem (its depth shown as a doubled
   edge), soft weighty drape folds, a bronze throat clasp, and corner tie/attach
   points. The "heavy" reading comes from the doubled thick edges + fuzzy nap
   ticks, never from flat black.

   WEARABLE asset (body-worn, shown flat/standalone). Drawn in SOLID grays +
   hard contour into the offscreen ctx; the engine dotify pass supplies the
   halftone — do NOT pre-dither. States: folded (neat bundle) / offered (spread
   flat, presented) / wrapped (mantled on an implied body) / sleeping-cover
   (draped over a sleeping form) / wet (rain-soaked, dripping) / returned (folded
   back, given up). Ownership + normalized 0..1 attach anchors.
   Scene OD-B14-S04: thick garment, folded/offered/wrapped/sleeping-cover/wet/returned. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  drapeFolds:4,     // soft vertical drape folds across the body
  napTicks:38,      // fuzzy wool-nap ticks around the edge
  hemRoll:0.055,    // thick rolled-hem depth as a fraction of H
  foldBands:5,      // stacked layers when folded
};

/* ink levels (1 near-paper .. 7 full ink) — DRY palette */
const WOOL   = 4;   // main felted-wool body (mid grey — the thick cloth)
const WOOL_HI= 3;   // fold highlight (nap catching light)
const WOOL_SH= 5;   // fold shadow / underside
const COLLAR = 5;   // rolled collar / hood roll
const HEM    = 6;   // thick rolled hem (the heavy weighted edge)
const CLASP  = 6;   // bronze throat clasp
const DRIP   = 6;   // water drip / wet streak

/* wet darkens the wool by ~1.5 levels (saturated, heavy) */
const wetShift = (base, wet) => clamp(base + (wet?2:0), 1, 7);

/* rounded-rect sub-path */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r); g.closePath();
}

/* fuzzy wool nap: short outward ticks stepping along a segment list of points */
function napAlong(g, pts, len, seed=0){
  g.strokeStyle=INK; g.lineWidth=1.6; g.lineCap="round";
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i], b=pts[i+1];
    const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1;
    const nx=dy/L, ny=-dx/L;             // outward normal
    const steps=Math.max(1,Math.round(L/12));
    for(let s=0;s<steps;s++){
      const u=(s+0.5)/steps, x=lerp(a.x,b.x,u), y=lerp(a.y,b.y,u);
      const tl=len*(0.6+0.5*(((i*7+s*13+seed)%5)/5));
      const jt=(((i*11+s*17+seed)%5)-2)*0.12;
      g.beginPath(); g.moveTo(x,y);
      g.lineTo(x+nx*tl+ny*jt*tl, y+ny*tl-nx*jt*tl); g.stroke();
    }
  }
}

/* crosshair ATTACH mark + optional dashed leader (equip-diagram tick) */
function attachMark(pen,g,x,y,leadTo){
  if(leadTo){ g.save(); g.setLineDash([5,4]); g.strokeStyle=INK; g.lineWidth=1.6;
    g.beginPath(); g.moveTo(x,y); g.lineTo(leadTo.x,leadTo.y); g.stroke();
    g.setLineDash([]); g.restore(); }
  const r=7;
  pen.fillPath(()=>{ g.ellipse(x,y,r,r,0,0,7); }, inkLevel(1));
  g.strokeStyle=INK; g.lineWidth=2.2;
  g.beginPath(); g.ellipse(x,y,r,r,0,0,7); g.stroke();
  g.beginPath(); g.moveTo(x-r-3,y); g.lineTo(x+r+3,y);
  g.moveTo(x,y-r-3); g.lineTo(x,y+r+3); g.stroke();
  g.fillStyle=ACCENT; g.beginPath(); g.arc(x,y,2.2,0,7); g.fill();
}

/* bronze throat CLASP — a round disc brooch with a pin bar */
function drawClasp(pen,g,x,y,r){
  pen.paint(()=>{ g.ellipse(x,y,r,r,0,0,7); }, toneSolid(inkLevel(CLASP)), 3);
  pen.fillPath(()=>{ g.ellipse(x,y,r*0.42,r*0.42,0,0,7); }, inkLevel(2));
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  g.beginPath(); g.moveTo(x-r*1.35,y); g.lineTo(x+r*1.35,y); g.stroke();  // pin bar
}

/* a soft vertical drape fold: a tapering lens band from shoulder to hem */
function foldBand(pen,g, xTop, xHem, halfTop, halfHem, yTop, yHem, tone){
  pen.fillPath(()=>{
    g.moveTo(xTop-halfTop, yTop);
    g.quadraticCurveTo((xTop+xHem)/2-halfHem*0.6,(yTop+yHem)/2, xHem-halfHem, yHem);
    g.lineTo(xHem+halfHem, yHem);
    g.quadraticCurveTo((xTop+xHem)/2+halfHem*0.6,(yTop+yHem)/2, xTop+halfTop, yTop);
    g.closePath();
  }, inkLevel(tone));
}

/* ==================================================================
   FLAT CLOAK — the spread garment diagram (used by OFFERED + WET).
   A broad felted mantle: rolled collar hump on top, flaring body, thick
   rolled hem at the base, weighty drape folds, throat clasp.
   ================================================================== */
function drawFlatCloak(pen,g,W,H,wet){
  const cx=W*0.5;
  const shY=H*0.24, hemY=H*0.78;
  const shW=W*0.30, hemW=W*0.37;
  const cW=W*0.15;                       // collar half-width
  const collarTopY=H*0.15;
  const bodyTone = wetShift(WOOL, wet);

  // ---- CLOAK BODY (main felted panel) ----
  const outline = ()=>{
    g.moveTo(cx-shW, shY);
    g.quadraticCurveTo(cx-cW*1.15, shY-H*0.03, cx-cW, collarTopY);
    g.quadraticCurveTo(cx, collarTopY-H*0.055, cx+cW, collarTopY);
    g.quadraticCurveTo(cx+cW*1.15, shY-H*0.03, cx+shW, shY);
    g.quadraticCurveTo(cx+shW*1.08,(shY+hemY)/2, cx+hemW, hemY);
    g.quadraticCurveTo(cx, hemY+H*0.035, cx-hemW, hemY);
    g.quadraticCurveTo(cx-shW*1.08,(shY+hemY)/2, cx-shW, shY);
    g.closePath();
  };
  pen.paint(outline, toneSolid(inkLevel(bodyTone)), 5);

  // ---- WEIGHTY DRAPE FOLDS (alternating shade / highlight lenses) ----
  const n=params.drapeFolds;
  for(let i=0;i<n;i++){
    const u=(i+0.5)/n;                       // 0..1 across body
    const xTop=lerp(cx-shW*0.72, cx+shW*0.72, u);
    const xHem=lerp(cx-hemW*0.78, cx+hemW*0.78, u);
    const shadeTone = (i%2===0) ? wetShift(WOOL_SH,wet) : wetShift(WOOL_HI,wet);
    foldBand(pen,g, xTop, xHem, W*0.028, W*0.036, shY+H*0.02, hemY-H*0.01, shadeTone);
    // centre seam of the fold
    pen.seam(()=>{ g.moveTo(xTop, shY+H*0.03);
      g.quadraticCurveTo((xTop+xHem)/2, (shY+hemY)/2, xHem, hemY-H*0.02); }, i%2?1.6:2.4);
  }

  // ---- ROLLED COLLAR band hugging the top shoulders (darker tube) ----
  pen.paint(()=>{
    g.moveTo(cx-shW*0.96, shY+H*0.006);
    g.quadraticCurveTo(cx-cW*1.12, shY-H*0.028, cx-cW, collarTopY+H*0.008);
    g.quadraticCurveTo(cx, collarTopY-H*0.05, cx+cW, collarTopY+H*0.008);
    g.quadraticCurveTo(cx+cW*1.12, shY-H*0.028, cx+shW*0.96, shY+H*0.006);
    // inner (lower) edge back across
    g.quadraticCurveTo(cx+cW*0.85, shY+H*0.05, cx, shY+H*0.052);
    g.quadraticCurveTo(cx-cW*0.85, shY+H*0.05, cx-shW*0.96, shY+H*0.006);
    g.closePath();
  }, toneSolid(inkLevel(wetShift(COLLAR,wet))), 4);
  // roll ridge along the collar
  pen.seam(()=>{ g.moveTo(cx-shW*0.86, shY+H*0.012);
    g.quadraticCurveTo(cx, collarTopY+H*0.02, cx+shW*0.86, shY+H*0.012); }, 2);

  // ---- THICK ROLLED HEM (the heavy weighted edge — doubled band) ----
  const hemH=H*params.hemRoll;
  pen.paint(()=>{
    g.moveTo(cx-hemW, hemY);
    g.quadraticCurveTo(cx, hemY+H*0.035, cx+hemW, hemY);
    g.quadraticCurveTo(cx+hemW*0.99, hemY+hemH*1.1, cx+hemW*0.9, hemY+hemH);
    g.quadraticCurveTo(cx, hemY+hemH+H*0.03, cx-hemW*0.9, hemY+hemH);
    g.quadraticCurveTo(cx-hemW*0.99, hemY+hemH*1.1, cx-hemW, hemY);
    g.closePath();
  }, toneSolid(inkLevel(wetShift(HEM,wet))), 5);
  // roll ridge line
  pen.seam(()=>{ g.moveTo(cx-hemW*0.94, hemY+hemH*0.4);
    g.quadraticCurveTo(cx, hemY+hemH*0.62, cx+hemW*0.94, hemY+hemH*0.4); }, 2);

  // ---- fuzzy wool NAP along the collar + hem edges ----
  const hemPts=[]; for(let i=0;i<=10;i++){ const u=i/10;
    hemPts.push({x:lerp(cx-hemW*0.9,cx+hemW*0.9,u), y:hemY+hemH+Math.sin(u*Math.PI)*H*0.03}); }
  napAlong(g, hemPts, 8, 1);
  const collarPts=[]; for(let i=0;i<=8;i++){ const u=i/8;
    collarPts.push({x:lerp(cx-cW*1.02,cx+cW*1.02,u), y:collarTopY-H*0.005-Math.sin(u*Math.PI)*H*0.02}); }
  napAlong(g, collarPts, 7, 3);

  // ---- bronze throat CLASP at the collar ----
  drawClasp(pen,g, cx, shY+H*0.035, W*0.036);

  // ---- WET extras: soaked streaks + hanging drips + puddle ----
  if(wet){
    // dark saturated wet streaks running down the body
    g.strokeStyle=inkLevel(DRIP); g.lineWidth=3; g.lineCap="round";
    for(let i=0;i<5;i++){ const x=lerp(cx-shW*0.6,cx+shW*0.6,(i+0.5)/5);
      g.beginPath(); g.moveTo(x, shY+H*0.08);
      g.quadraticCurveTo(x+6, (shY+hemY)/2, x-4, hemY-H*0.02); g.stroke(); }
    // hanging teardrop drips off the hem
    for(let i=0;i<7;i++){ const x=lerp(cx-hemW*0.85,cx+hemW*0.85,(i+0.5)/7);
      const y=hemY+hemH+H*0.02+((i%3)*H*0.012);
      pen.paint(()=>{ g.moveTo(x, y-H*0.02);
        g.quadraticCurveTo(x-6, y, x, y+H*0.016);
        g.quadraticCurveTo(x+6, y, x, y-H*0.02); g.closePath();
      }, toneSolid(inkLevel(DRIP)), 2); }
    // puddle beneath
    pen.fillPath(()=>{ g.ellipse(cx, hemY+hemH+H*0.075, hemW*0.95, H*0.02, 0,0,7); }, inkLevel(3));
  }

  return {
    clasp:{x:cx, y:shY+H*0.03},
    shL:{x:cx-shW, y:shY}, shR:{x:cx+shW, y:shY},
    hemL:{x:cx-hemW, y:hemY+hemH}, hemR:{x:cx+hemW, y:hemY+hemH},
  };
}

/* ==================================================================
   FOLDED — a neat thick bundle: stacked felted layers with rounded fold
   returns on the left, showing the cloth's depth. (used by FOLDED + RETURNED)
   ================================================================== */
function drawFolded(pen,g,W,H,label){
  const cx=W*0.5, cy=H*0.5;
  const bw=W*0.52, bh=H*0.075, gap=bh*0.86;
  const n=params.foldBands;
  const topY=cy-(n*gap)/2;

  // soft ground shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, topY+n*gap+H*0.02, bw*0.62, H*0.02, 0,0,7); g.fill();

  for(let i=n-1;i>=0;i--){                 // back band first
    const y=topY+i*gap;
    const tone = (i%2===0) ? WOOL : WOOL_SH;
    // slab body (open edges on the right)
    pen.paint(()=>{
      g.moveTo(cx-bw/2+bh*0.5, y);
      g.lineTo(cx+bw/2, y);
      g.lineTo(cx+bw/2, y+bh);
      g.lineTo(cx-bw/2+bh*0.5, y+bh);
      // rounded fold return on the left
      g.arc(cx-bw/2+bh*0.5, y+bh*0.5, bh*0.5, Math.PI*0.5, Math.PI*1.5, false);
      g.closePath();
    }, toneSolid(inkLevel(tone)), 4);
    // open-edge stack lines on the right end (loose leaves)
    pen.seam(()=>{ g.moveTo(cx+bw*0.34, y+bh*0.28); g.lineTo(cx+bw/2, y+bh*0.28);
      g.moveTo(cx+bw*0.34, y+bh*0.66); g.lineTo(cx+bw/2, y+bh*0.66); }, 1.6);
  }
  // fuzzy nap on the front open edge
  const edgePts=[{x:cx+bw/2, y:topY}, {x:cx+bw/2, y:topY+n*gap+bh}];
  napAlong(g, edgePts, 7, 2);
  // clasp resting on top + attach mark
  drawClasp(pen,g, cx+bw*0.18, topY+bh*0.5, W*0.024);
  attachMark(pen,g, cx-bw/2+bh*0.5, cy, null);
  return { top:{x:cx, y:topY}, clasp:{x:cx+bw*0.18, y:topY+bh*0.5} };
}

/* ==================================================================
   WRAPPED — the mantle closed around an implied standing body: a rounded
   column, the cloak's overlapping front edge running down the diagonal,
   a collar roll at the throat, the clasp fastened.
   ================================================================== */
function drawWrapped(pen,g,W,H){
  const cx=W*0.5, topY=H*0.20, botY=H*0.82;
  const wTop=W*0.20, wBot=W*0.26;

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, botY+H*0.015, wBot*1.15, H*0.018, 0,0,7); g.fill();

  // wrapped column body
  const col=()=>{
    g.moveTo(cx-wTop, topY+H*0.02);
    g.quadraticCurveTo(cx-wTop*1.05, (topY+botY)/2, cx-wBot, botY);
    g.quadraticCurveTo(cx, botY+H*0.03, cx+wBot, botY);
    g.quadraticCurveTo(cx+wTop*1.05, (topY+botY)/2, cx+wTop, topY+H*0.02);
    g.quadraticCurveTo(cx, topY-H*0.02, cx-wTop, topY+H*0.02);
    g.closePath();
  };
  pen.paint(col, toneSolid(inkLevel(WOOL)), 5);

  // shaded far side of the cylinder (right third darker)
  pen.fillPath(()=>{
    g.moveTo(cx+wTop*0.35, topY+H*0.03);
    g.quadraticCurveTo(cx+wTop*0.9, (topY+botY)/2, cx+wBot*0.9, botY-H*0.01);
    g.lineTo(cx+wBot, botY);
    g.quadraticCurveTo(cx+wTop*1.05,(topY+botY)/2, cx+wTop, topY+H*0.02);
    g.closePath();
  }, inkLevel(WOOL_SH));

  // overlapping front edge running down the diagonal (the wrap seam)
  pen.paint(()=>{
    g.moveTo(cx-wTop*0.15, topY+H*0.05);
    g.quadraticCurveTo(cx+wTop*0.1, (topY+botY)/2, cx-wBot*0.2, botY-H*0.005);
    g.lineTo(cx-wBot*0.55, botY-H*0.005);
    g.quadraticCurveTo(cx-wTop*0.35, (topY+botY)/2, cx-wTop*0.5, topY+H*0.06);
    g.closePath();
  }, toneSolid(inkLevel(WOOL_HI)), 3);
  pen.seam(()=>{ g.moveTo(cx-wTop*0.15, topY+H*0.05);
    g.quadraticCurveTo(cx+wTop*0.1, (topY+botY)/2, cx-wBot*0.2, botY-H*0.005); }, 2.6);

  // a couple of drape shadow folds
  for(const f of [-0.55, 0.5]){
    pen.seam(()=>{ g.moveTo(cx+f*wTop, topY+H*0.10);
      g.quadraticCurveTo(cx+f*wBot*1.1, (topY+botY)/2, cx+f*wBot, botY-H*0.04); }, 2); }

  // rolled collar around the throat
  pen.paint(()=>{ rr(g, cx-wTop*0.95, topY-H*0.01, wTop*1.9, H*0.055, H*0.026); },
    toneSolid(inkLevel(COLLAR)), 4);
  // nap on the hem
  const hemPts=[{x:cx-wBot, y:botY},{x:cx, y:botY+H*0.02},{x:cx+wBot, y:botY}];
  napAlong(g, hemPts, 8, 4);

  // fastened clasp at the throat
  drawClasp(pen,g, cx-wTop*0.1, topY+H*0.03, W*0.026);
  return { clasp:{x:cx-wTop*0.1, y:topY+H*0.03} };
}

/* ==================================================================
   SLEEPING-COVER — the cloak spread over an implied sleeping form: a long
   low mound (head / shoulder / hip humps) with the felted cloth draped and
   the thick hem hanging near the ground.
   ================================================================== */
function drawSleepingCover(pen,g,W,H){
  const groundY=H*0.72;
  const x0=W*0.10, x1=W*0.90;

  // ground line
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
  g.beginPath(); g.moveTo(0,groundY+H*0.02); g.lineTo(W,groundY+H*0.02); g.stroke();
  g.globalAlpha=1;

  // draped cover top contour: head bump (left), long body swell, feet
  const top=(x)=>{
    const u=(x-x0)/(x1-x0);
    const head = Math.exp(-Math.pow((u-0.12)/0.09,2))*H*0.16;
    const body = Math.exp(-Math.pow((u-0.5)/0.30,2))*H*0.13;
    const feet = Math.exp(-Math.pow((u-0.86)/0.07,2))*H*0.06;
    return groundY - (head+body+feet) - H*0.02;
  };

  // cloak body (filled under the contour down to the hem)
  pen.paint(()=>{
    g.moveTo(x0, groundY);
    for(let x=x0;x<=x1;x+=6) g.lineTo(x, top(x));
    g.lineTo(x1, groundY);
    g.closePath();
  }, toneSolid(inkLevel(WOOL)), 5);

  // drape fold shadows following the mound
  for(const cxk of [0.30,0.5,0.68]){
    const x=lerp(x0,x1,cxk);
    pen.fillPath(()=>{
      g.moveTo(x-W*0.02, top(x)+H*0.02);
      g.quadraticCurveTo(x, (top(x)+groundY)/2, x-W*0.01, groundY);
      g.lineTo(x+W*0.02, groundY);
      g.quadraticCurveTo(x+W*0.02, (top(x)+groundY)/2, x+W*0.03, top(x)+H*0.02);
      g.closePath();
    }, inkLevel(WOOL_SH));
  }
  // highlight along the crest of the humps
  g.strokeStyle=inkLevel(WOOL_HI); g.lineWidth=4; g.lineCap="round"; g.beginPath();
  for(let x=x0;x<=x1;x+=6){ const y=top(x); x===x0?g.moveTo(x,y+4):g.lineTo(x,y+4); } g.stroke();

  // thick rolled hem hanging near the ground
  pen.paint(()=>{ rr(g, x0, groundY-H*0.006, x1-x0, H*0.045, H*0.02); },
    toneSolid(inkLevel(HEM)), 4);
  const hemPts=[{x:x0, y:groundY+H*0.04},{x:x1, y:groundY+H*0.04}];
  napAlong(g, hemPts, 8, 5);

  // clasp fallen at the shoulder line
  drawClasp(pen,g, lerp(x0,x1,0.28), top(lerp(x0,x1,0.28))+H*0.03, W*0.024);
  return { head:{x:lerp(x0,x1,0.12), y:top(lerp(x0,x1,0.12))} };
}

/* ------------------------------------------------------------------ */
function drawWear(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const mode=st.mode||"offered";
  let ref;
  if(mode==="folded" || mode==="returned") ref=drawFolded(pen,g,W,H);
  else if(mode==="wrapped")                 ref=drawWrapped(pen,g,W,H);
  else if(mode==="sleeping-cover")          ref=drawSleepingCover(pen,g,W,H);
  else if(mode==="wet")                     ref=drawFlatCloak(pen,g,W,H,true);
  else                                      ref=drawFlatCloak(pen,g,W,H,false); // offered

  // OFFERED / WET: annotate attach points as an equip diagram
  if(mode==="offered" || mode==="wet"){
    attachMark(pen,g, ref.clasp.x, ref.clasp.y, null);
    attachMark(pen,g, ref.shL.x, ref.shL.y, null);
    attachMark(pen,g, ref.shR.x, ref.shR.y, null);
    attachMark(pen,g, ref.hemL.x, ref.hemL.y, null);
    attachMark(pen,g, ref.hemR.x, ref.hemR.y, null);
  }
}

export const asset = {
  id:"wearable.heavy-swineherd-cloak",
  type:"WEARABLE",
  name:"Heavy Swineherd Cloak",
  statusWord:"HEAVY",
  scene:"OD-B14-S04",

  params,
  // back -> front draw order the wearable honors
  layers:["shadow","body","fold","collar","hem","nap","clasp","drip","attach"],
  // normalized 0..1 attach anchors to a wearer + tie/contact points
  anchors:{
    "attach:neck":{x:.50,y:.28},        // throat clasp — fastens to the wearer's neck
    "attach:shoulderL":{x:.20,y:.24},   // left shoulder drape point
    "attach:shoulderR":{x:.80,y:.24},   // right shoulder drape point
    "tie:hemL":{x:.13,y:.83},           // lower-left corner (wrap/tie)
    "tie:hemR":{x:.87,y:.83},           // lower-right corner (wrap/tie)
    "grip:clasp":{x:.50,y:.27},         // hand grip when offered/handed over
    "contact:ground":{x:.50,y:.90},     // grounded contact when laid / draped
  },
  // ownership + collision box (AABB in 0..1) — Eumaeus's cloak, lent then returned
  ownership:"eumaeus:lent",
  collision:{ kind:"box", x0:.08,y0:.10,x1:.92,y1:.94 },
  zones:{ bounds:{ x0:.08,y0:.10,x1:.92,y1:.94 } },

  states:{
    initial:"folded",
    nodes:{
      folded:          { preview:{ mode:"folded",         status:"FOLDED",  progress:.15 } },
      offered:         { preview:{ mode:"offered",        status:"OFFERED", progress:.35 } },
      wrapped:         { preview:{ mode:"wrapped",        status:"WRAPPED", progress:.60 } },
      "sleeping-cover":{ preview:{ mode:"sleeping-cover", status:"COVER",   progress:.80 } },
      wet:             { preview:{ mode:"wet",            status:"SOAKED",  progress:.90 } },
      returned:        { preview:{ mode:"returned",       status:"RETURNED",progress:1.0 } },
    },
    edges:[
      ["folded","offered"],["offered","wrapped"],["wrapped","sleeping-cover"],
      ["sleeping-cover","wet"],["wet","wrapped"],["wrapped","returned"],
      ["returned","folded"],["offered","returned"],
    ],
  },
  channels:["mode","attach","wet","t"],

  preview:()=>({ mode:"offered", status:"HEAVY", progress:.35 }),
  draw(ctx,W,H,state){ drawWear(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision, ownership:asset.ownership }; },
};
export default asset;
