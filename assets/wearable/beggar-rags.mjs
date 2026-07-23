/* wearable.beggar-rags — the filthy torn disguise Odysseus wears home to Ithaca:
   a set of separable, continuity-reversible costume layers laid out as a
   wardrobe / EQUIP diagram. Three garment layers, each drawn flat + standalone
   with its own attach point:
     · RAGGED TUNIC   — a short patched chiton, jagged torn hem, holes, grime stains.
     · HIDE CLOAK     — a worn animal-skin mantle, hairy irregular edge, neck tie.
     · BAG-STRAP      — a patched beggar's satchel on a long shoulder strap + buckle.

   WEARABLE asset (body-worn, shown flat/standalone). Drawn in SOLID grays +
   hard contour into the offscreen ctx; the engine dotify pass supplies the
   halftone — do NOT pre-dither. States: laid-out (flat, separated) / equipped
   (worn on an implied body) / removed (back to flat — reversible). Ownership +
   normalized 0..1 attach anchors.
   Scene OD-B13-S05: separate filthy tunic, hide cloak, patched bag strap. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  patches:3,        // sewn-on repair patches per big garment
  holes:2,          // torn holes (paper shows through)
  hairTicks:26,     // fur ticks around the hide cloak edge
  hemTeeth:11,      // torn-hem zigzag teeth
};

/* ink levels (1 near-paper .. 7 full ink) */
const TUN  = 3;   // tunic body — grimed light wool
const TUN2 = 4;   // tunic shade
const PATCH= 4;   // repair patch (mismatched cloth — mid tone, not black)
const STAIN= 5;   // grime blotch
const CLK  = 5;   // hide cloak body
const CLK2 = 6;   // hide shade
const STR  = 5;   // leather strap / bag
const STR2 = 6;   // bag shade / buckle
const DARK = 6;

/* rounded-rect sub-path */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r); g.closePath();
}

/* torn-hem zigzag: append jagged teeth to the current path, walking from
   (xFrom,y) to (xTo,y). caller must already be at (xFrom,y). */
function raggedHemTo(g,xFrom,xTo,y,n,amp){
  for(let i=1;i<=n;i++){
    const u=i/n, x=lerp(xFrom,xTo,u);
    const bite=(i%2? amp : -amp*0.35) + (((i*53)%7)-3)/3*amp*0.4;
    g.lineTo(x, y+bite);
  }
}

/* a sewn-on repair patch: mismatched darker cloth square with a dashed
   cross-stitch border. */
function patch(pen,g,x,y,w,h,tone){
  pen.paint(()=>{ rr(g,x,y,w,h,Math.min(w,h)*0.12); }, toneSolid(inkLevel(tone)), 3);
  g.save(); g.setLineDash([4,3]); g.strokeStyle=INK; g.lineWidth=1.8;
  g.strokeRect(x+3,y+3,w-6,h-6); g.setLineDash([]); g.restore();
  // couple of stitch ticks across the seam
  g.strokeStyle=INK; g.lineWidth=1.6;
  for(let i=1;i<=3;i++){ const yy=y+h*i/4;
    g.beginPath(); g.moveTo(x-2,yy); g.lineTo(x+4,yy-2); g.stroke(); }
}

/* a torn HOLE: paper shows through (near-paper fill) inside a dark frayed ring. */
function hole(pen,g,x,y,r){
  pen.fillPath(()=>{ g.ellipse(x,y,r,r*0.82,0.3,0,7); }, inkLevel(1));
  g.strokeStyle=INK; g.lineWidth=2;
  g.beginPath();
  for(let i=0;i<=12;i++){ const a=i/12*Math.PI*2;
    const rr2=r*(1+((i%2)?0.18:-0.06));
    const px=x+Math.cos(a)*rr2, py=y+Math.sin(a)*rr2*0.82;
    i?g.lineTo(px,py):g.moveTo(px,py);
  }
  g.closePath(); g.stroke();
}

/* grime stain: soft dark blotch (fill only, dotify supplies texture). */
function stain(pen,g,x,y,r,tone){
  pen.fillPath(()=>{
    g.moveTo(x+r,y);
    for(let i=1;i<=8;i++){ const a=i/8*Math.PI*2;
      const rr2=r*(0.7+0.35*(((i*29)%7)/7));
      g.lineTo(x+Math.cos(a)*rr2, y+Math.sin(a)*rr2*0.9); }
    g.closePath();
  }, inkLevel(tone));
}

/* small crosshair ATTACH mark + short dashed leader (equip-diagram tick). */
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

/* ------------------------------------------------------------------
   RAGGED TUNIC — a T-shaped patched chiton with torn hem, holes, stains.
   Drawn at centre cx, shoulder line shY, hem hemY, half-width shH.
   ------------------------------------------------------------------ */
function drawTunic(pen,g,cx,shY,hemY,shH,scale=1){
  const neck=shH*0.32, waH=shH*1.0, hemH=shH*1.28;
  const slLen=shH*1.65, slH=(hemY-shY)*0.24;

  // sleeves (drawn first, behind body), ragged cuffs
  for(const s of [-1,1]){
    pen.paint(()=>{
      g.moveTo(cx+s*shH*0.75, shY+ (hemY-shY)*0.02);
      g.lineTo(cx+s*slLen,    shY+ (hemY-shY)*0.05);
      // ragged cuff
      g.lineTo(cx+s*slLen*0.94, shY+slH*0.55);
      g.lineTo(cx+s*slLen,      shY+slH*0.85);
      g.lineTo(cx+s*slLen*0.9,  shY+slH*1.15);
      g.lineTo(cx+s*shH*0.66,   shY+slH*1.0);
      g.closePath();
    }, toneSolid(inkLevel(TUN2)), 4);
  }

  // tunic body
  pen.paint(()=>{
    g.moveTo(cx-shH, shY);
    g.lineTo(cx-neck, shY);
    g.quadraticCurveTo(cx, shY+(hemY-shY)*0.10, cx+neck, shY); // neck dip
    g.lineTo(cx+shH, shY);
    // right side down to hem
    g.quadraticCurveTo(cx+waH, (shY+hemY)/2, cx+hemH, hemY-(hemY-shY)*0.04);
    // torn hem right -> left
    raggedHemTo(g, cx+hemH, cx-hemH, hemY, params.hemTeeth, (hemY-shY)*0.05);
    // left side up
    g.quadraticCurveTo(cx-waH, (shY+hemY)/2, cx-shH, shY);
    g.closePath();
  }, toneSolid(inkLevel(TUN)), 5);

  // grime stains
  stain(pen,g, cx-shH*0.4, hemY-(hemY-shY)*0.30, shH*0.34, STAIN);
  stain(pen,g, cx+shH*0.5, shY+(hemY-shY)*0.42, shH*0.28, STAIN);

  // repair patches
  const pw=shH*0.5;
  patch(pen,g, cx-shH*0.15, shY+(hemY-shY)*0.20, pw, pw*0.9, PATCH);
  patch(pen,g, cx+shH*0.20, hemY-(hemY-shY)*0.34, pw*0.85, pw*0.8, PATCH);
  if(params.patches>2) patch(pen,g, cx-shH*0.75, shY+(hemY-shY)*0.52, pw*0.7, pw*0.7, PATCH);

  // torn holes
  hole(pen,g, cx+shH*0.55, hemY-(hemY-shY)*0.16, shH*0.14);
  if(params.holes>1) hole(pen,g, cx-shH*0.55, shY+(hemY-shY)*0.30, shH*0.11);

  // hanging threads at the hem
  g.strokeStyle=INK; g.lineWidth=1.4;
  for(let i=0;i<7;i++){ const x=cx-hemH*0.8+i*(hemH*1.6/6);
    g.beginPath(); g.moveTo(x,hemY+(hemY-shY)*0.02);
    g.lineTo(x+((i%2)?4:-3), hemY+(hemY-shY)*0.09); g.stroke(); }

  // vertical drape / rip seams
  for(let f=1;f<=3;f++){ const u=f/4;
    pen.seam(()=>{ const xt=lerp(cx-shH*0.7,cx+shH*0.7,u);
      g.moveTo(xt, shY+(hemY-shY)*0.12);
      g.quadraticCurveTo(xt+6, (shY+hemY)/2, lerp(cx-hemH*0.7,cx+hemH*0.7,u), hemY-(hemY-shY)*0.06);
    }, f===2?2.6:1.6); }
}

/* ------------------------------------------------------------------
   HIDE CLOAK — a worn animal-skin mantle: irregular pelt body with a hairy
   ticked edge, a lighter worn underside patch, and a neck tie cord.
   centre (cx,cy), half-width w, half-height h.
   ------------------------------------------------------------------ */
function drawHide(pen,g,cx,cy,w,h){
  // pelt body — irregular blob with 2 upper shoulder tabs
  const pts=[];
  const N=16;
  for(let i=0;i<N;i++){
    const a=i/N*Math.PI*2 - Math.PI/2;
    let rw=w, rh=h;
    // pull the top into two shoulder tabs
    const wob=0.82+0.30*(((i*37)%7)/7);
    pts.push({x:cx+Math.cos(a)*rw*wob, y:cy+Math.sin(a)*rh*wob});
  }
  // two shoulder tabs at top
  pts[0]={x:cx-w*0.42,y:cy-h*1.06};
  pts[N-1]={x:cx+w*0.42,y:cy-h*1.06};
  pen.paint(()=>{
    g.moveTo(pts[0].x,pts[0].y);
    for(let i=1;i<N;i++){ const p=pts[i], q=pts[(i+1)%N];
      g.quadraticCurveTo(p.x,p.y,(p.x+q.x)/2,(p.y+q.y)/2); }
    g.closePath();
  }, toneSolid(inkLevel(CLK)), 5);

  // worn lighter underside patch
  pen.paint(()=>{ g.ellipse(cx-w*0.15,cy+h*0.18,w*0.5,h*0.45,0.2,0,7); },
    toneSolid(inkLevel(CLK-2)), 3);

  // hairy edge ticks
  g.strokeStyle=INK; g.lineWidth=1.5;
  for(let i=0;i<params.hairTicks;i++){
    const a=i/params.hairTicks*Math.PI*2 - Math.PI/2;
    const ex=cx+Math.cos(a)*w*0.98, ey=cy+Math.sin(a)*h*0.98;
    const tl=6+((i*29)%5);
    g.beginPath(); g.moveTo(ex,ey);
    g.lineTo(ex+Math.cos(a)*tl, ey+Math.sin(a)*tl); g.stroke();
  }
  // a few hide-mottle spots
  for(let i=0;i<4;i++){ const sx=cx+((i-1.5)*w*0.4), sy=cy+((i%2)?-h*0.2:h*0.25);
    stain(pen,g,sx,sy,w*0.16,CLK2); }

  // neck tie cord between the two shoulder tabs
  g.strokeStyle=INK; g.lineWidth=3;
  g.beginPath(); g.moveTo(pts[0].x,pts[0].y+4);
  g.quadraticCurveTo(cx,cy-h*1.22, pts[N-1].x,pts[N-1].y+4); g.stroke();
  return { tie:{x:cx, y:cy-h*1.12} };
}

/* ------------------------------------------------------------------
   BAG-STRAP — a beggar's satchel: a patched leather pouch on a long strap
   with a buckle. Drawn along a strap from (ax,ay) to (bx,by); pouch at b.
   ------------------------------------------------------------------ */
function drawBagStrap(pen,g,ax,ay,bx,by,wStrap,bagR){
  // strap band
  const dx=bx-ax, dy=by-ay, len=Math.hypot(dx,dy), nx=-dy/len, ny=dx/len;
  pen.paint(()=>{
    g.moveTo(ax+nx*wStrap, ay+ny*wStrap);
    g.lineTo(bx+nx*wStrap, by+ny*wStrap);
    g.lineTo(bx-nx*wStrap, by-ny*wStrap);
    g.lineTo(ax-nx*wStrap, ay-ny*wStrap);
    g.closePath();
  }, toneSolid(inkLevel(STR)), 4);
  // stitch line down the strap
  pen.seam(()=>{ g.moveTo(ax,ay); g.lineTo(bx,by); }, 1.6);

  // buckle near the top end
  const kx=lerp(ax,bx,0.18), ky=lerp(ay,by,0.18);
  pen.paint(()=>{ rr(g,kx-8,ky-6,16,12,3); }, toneSolid(inkLevel(STR2)), 3);
  pen.fillPath(()=>{ g.rect(kx-3,ky-6,6,12); }, inkLevel(1));

  // pouch at the bottom end (lighter body so it doesn't read as one black block)
  pen.paint(()=>{ rr(g, bx-bagR, by-bagR*0.6, bagR*2, bagR*1.7, bagR*0.28); },
    toneSolid(inkLevel(STR-1)), 5);
  // pouch flap (darker, over the top third)
  pen.paint(()=>{
    g.moveTo(bx-bagR, by-bagR*0.6);
    g.lineTo(bx+bagR, by-bagR*0.6);
    g.lineTo(bx+bagR*0.8, by+bagR*0.05);
    g.lineTo(bx-bagR*0.8, by+bagR*0.05);
    g.closePath();
  }, toneSolid(inkLevel(STR)), 4);
  // patch on the pouch body
  patch(pen,g, bx-bagR*0.35, by+bagR*0.4, bagR*0.7, bagR*0.62, PATCH);
  // hanging threads at pouch base
  g.strokeStyle=INK; g.lineWidth=1.3;
  for(let i=0;i<4;i++){ const x=bx-bagR*0.6+i*bagR*0.4;
    g.beginPath(); g.moveTo(x,by+bagR*1.1);
    g.lineTo(x+((i%2)?3:-3), by+bagR*1.28); g.stroke(); }
  return { buckle:{x:kx,y:ky}, pouch:{x:bx,y:by} };
}

/* ================= MODES ================= */

/* LAID-OUT / REMOVED — flat wardrobe diagram: three separated layers, each
   with an attach crosshair + dashed leader to a central equip spine. */
function drawFlat(pen,g,W,H){
  const spineX=W*0.5;
  // faint equip spine with 3 attach nodes
  g.save(); g.setLineDash([2,6]); g.strokeStyle=INK; g.globalAlpha=0.35; g.lineWidth=2;
  g.beginPath(); g.moveTo(spineX,H*0.10); g.lineTo(spineX,H*0.92); g.stroke();
  g.setLineDash([]); g.globalAlpha=1; g.restore();

  // --- HIDE CLOAK (top, spanning) ---
  const hide=drawHide(pen,g, W*0.50, H*0.20, W*0.26, H*0.10);

  // --- RAGGED TUNIC (centre, the main layer) ---
  drawTunic(pen,g, W*0.50, H*0.40, H*0.70, W*0.19);

  // --- BAG-STRAP (lower, diagonal) ---
  const bag=drawBagStrap(pen,g, W*0.28, H*0.72, W*0.66, H*0.85, H*0.015, W*0.055);

  // attach marks -> spine nodes
  const nNeck ={x:spineX,y:H*0.30};
  const nTorso={x:spineX,y:H*0.52};
  const nHip  ={x:spineX,y:H*0.80};
  attachMark(pen,g, hide.tie.x, hide.tie.y, nNeck);
  attachMark(pen,g, W*0.31, H*0.42, nTorso);         // tunic left shoulder
  attachMark(pen,g, W*0.69, H*0.42, nTorso);         // tunic right shoulder
  attachMark(pen,g, bag.buckle.x, bag.buckle.y, nHip);
  // spine node dots
  for(const n of [nNeck,nTorso,nHip]){
    pen.fillPath(()=>{ g.ellipse(n.x,n.y,4,4,0,0,7); }, INK);
  }
}

/* EQUIPPED — the layers worn on an implied body (no figure rig): hide cloak
   mantle behind, ragged tunic column belted, bag-strap crossing the chest. */
function drawEquipped(pen,g,W,H){
  const cx=W*0.5, shY=H*0.24, hemY=H*0.78, shH=W*0.19;

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx,hemY+H*0.02,shH*1.7,H*0.02,0,0,7); g.fill();

  // hide cloak mantle behind the shoulders, spreading to a low hem
  pen.paint(()=>{
    g.moveTo(cx-shH*1.15, shY);
    g.lineTo(cx+shH*1.15, shY);
    g.lineTo(cx+shH*1.55, hemY-H*0.06);
    raggedHemTo(g, cx+shH*1.55, cx-shH*1.55, hemY-H*0.02, 9, H*0.03);
    g.closePath();
  }, toneSolid(inkLevel(CLK)), 5);
  // hairy edge ticks along the cloak hem
  g.strokeStyle=INK; g.lineWidth=1.5;
  for(let i=0;i<16;i++){ const x=cx-shH*1.5+i*(shH*3/15);
    g.beginPath(); g.moveTo(x,hemY-H*0.02); g.lineTo(x+((i%2)?3:-2),hemY+H*0.02); g.stroke(); }
  for(const f of [-1,1]){
    pen.seam(()=>{ g.moveTo(cx+f*shH*0.8,shY+H*0.04);
      g.quadraticCurveTo(cx+f*shH*1.3,(shY+hemY)/2,cx+f*shH*1.45,hemY-H*0.06); },2.2); }

  // ragged tunic column over the cloak
  drawTunic(pen,g, cx, shY+H*0.02, hemY, shH*0.92);

  // bag-strap crossing from left shoulder to right hip
  const bag=drawBagStrap(pen,g, cx-shH*1.0, shY+H*0.02, cx+shH*0.95, hemY-H*0.10, H*0.014, W*0.06);

  // neck-tie crosshair (attach) at the throat
  attachMark(pen,g, cx, shY-H*0.005, null);
  return bag;
}

/* ------------------------------------------------------------------ */
function drawWear(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const mode=st.mode||"flat";
  if(mode==="equipped") drawEquipped(pen,g,W,H);
  else                  drawFlat(pen,g,W,H); // flat / removed
}

export const asset = {
  id:"wearable.beggar-rags",
  type:"WEARABLE",
  name:"Beggar Rags",
  statusWord:"FILTHY",
  scene:"OD-B13-S05",

  params,
  // back -> front draw order the wearable honors
  layers:["shadow","hide-cloak","tunic","sleeve","patch","stain","hole","bag-strap","attach"],
  // normalized 0..1 attach anchors to a wearer + grip/contact points
  anchors:{
    "attach:neck":{x:.50,y:.30},        // hide-cloak tie at the throat
    "attach:shoulderL":{x:.31,y:.42},   // tunic left shoulder
    "attach:shoulderR":{x:.69,y:.42},   // tunic right shoulder
    "attach:hip":{x:.50,y:.80},         // bag-strap seat at the hip
    "grip:strap":{x:.37,y:.75},         // strap buckle (hand/shoulder grip)
    "contact:ground":{x:.50,y:.90},     // grounded contact when laid out
    "pouch":{x:.70,y:.90},              // beggar's satchel body
  },
  // ownership + collision box (AABB in 0..1) — Odysseus's disguise, reversible
  ownership:"odysseus:disguise",
  collision:{ kind:"box", x0:.06,y0:.08,x1:.94,y1:.94 },
  zones:{ bounds:{ x0:.06,y0:.08,x1:.94,y1:.94 } },

  states:{
    initial:"laid-out",
    nodes:{
      "laid-out":{ preview:{ mode:"flat",     status:"LAID OUT", progress:.20 } },
      equipped:  { preview:{ mode:"equipped", status:"WORN",     progress:.70 } },
      removed:   { preview:{ mode:"flat",     status:"REMOVED",  progress:1.0 } },
    },
    edges:[["laid-out","equipped"],["equipped","removed"],["removed","laid-out"]],
  },
  channels:["mode","attach","t"],

  preview:()=>({ mode:"flat", status:"FILTHY", progress:.20 }),
  draw(ctx,W,H,state){ drawWear(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision, ownership:asset.ownership }; },
};
export default asset;
