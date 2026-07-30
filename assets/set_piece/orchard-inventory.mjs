/* set_piece.orchard-inventory — the COUNTED DEED of Laertes' orchard.
   SET_PIECE. The private map of inheritance Odysseus recites to his father as
   proof: the parcels of the worked farm drawn as a surveyed planting chart —
   THIRTEEN pear trees, TEN apple trees, FORTY fig trees and FIFTY vine rows,
   each one an addressable, countable glyph standing in its own plot, each plot
   tallied in a ledger cell whose count is drawn as seven-segment BAR GEOMETRY
   (never small type). A dashed DEED SPINE runs down the gutter from the gift
   seal at the head of the plate and hooks into one marked tree in every parcel
   — the childhood-gift memory, the boy walking the rows behind his father.
   Drawn as an EMPTY separable chart component in SOLID grays + hard contour;
   the engine dotify pass supplies the halftone. Declares placement anchors,
   collision boundaries, a depth layer, and alternate states
   (surveyed / naming / given / proved).
   Atlas: OD-B24-S04 — addressable pears, apples, figs and vine rows linked to
   childhood-gift memory. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

/* ---------------- normalized plate geometry (0..1 of W,H) ----------------
   Two columns: a LEDGER strip on the left (one cell per species) and the
   PLANTING PLAN on the right (one parcel per species). The gutter between
   them carries the deed spine. */
const PAGE = {
  frame:   0.048,          // outer survey border inset
  ledX0:   0.075, ledX1:0.335,
  gutter:  0.354,          // deed-spine x
  parX0:   0.375, parX1:0.925,
  headY0:  0.058, headY1:0.152,
  sealX:   0.354, sealY:0.105, sealR:0.055,   // gift seal, straddling the gutter
  totX0:   0.075, totX1:0.300,                // GIVEN / 113 total plate
};

/* the four parcels. `n` is the real count; `rows` are the per-sub-row counts,
   each split by an AISLE so no planting stripes the full width of the plate. */
const PARCELS = [
  { key:"pear",  label:"PEAR",  n:13, y0:0.170, y1:0.336, rows:[7,6],            split:[4,3],          r:0.0255, tone:3, kind:"tall",  mark:6,  seed:311 },
  { key:"apple", label:"APPLE", n:10, y0:0.354, y1:0.508, rows:[5,5],            split:[3,3],          r:0.0240, tone:3, kind:"round", mark:4,  seed:727 },
  { key:"fig",   label:"FIG",   n:40, y0:0.526, y1:0.722, rows:[8,8,8,8,8],      split:[4,4,4,4,4],    r:0.0190, tone:3, kind:"broad", mark:18, seed:145 },
  { key:"vine",  label:"VINE",  n:50, y0:0.740, y1:0.924, rows:[10,10,10,10,10], split:[5,5,5,5,5],    r:0.0165, tone:3, kind:"vine",  mark:27, seed:908 },
];
const TOTAL = PARCELS.reduce((s,p)=>s+p.n, 0);   // 113

const params = {
  frame:true,
  aisle:0.62,          // aisle width as a fraction of the planting pitch
  padX:0.030,          // parcel padding (fraction of W)
  padY:0.014,          // parcel padding (fraction of H)
  fieldLevel:1,        // worked-plot ground fill (lightest ink level)
  canopyLevel:3,       // tree crown fill — light plane, dark contour
  trunkLevel:6,        // small dark accents only
  digitH:0.050,        // seven-segment digit height (fraction of H)
  digitW:0.042,        // seven-segment digit width  (fraction of W)
  digitBar:0.125,      // segment thickness as a fraction of digit height
  wordSize:0.058,      // species word size (fraction of W) — never small type
  jitter:0.0030,       // hand-surveyed wobble (fraction of W)
};

/* ---------------- text (drawn into the source, dotified later) ----------- */
function tracked(g, text, x, y, size, track, color){
  g.save(); g.fillStyle=color; g.textBaseline="middle";
  g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx=x; for(const ch of text){ g.fillText(ch,cx,y); cx += g.measureText(ch).width + track; }
  g.restore();
}
function trackedWidth(g, text, size, track){
  g.save(); g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let w=0; for(const ch of text){ w += g.measureText(ch).width + track; }
  g.restore(); return w - track;
}

/* ---------------- SEVEN-SEGMENT NUMERALS (counts as geometry) -------------
   Numbers on this plate are never typeset — they are drawn as bars so they
   survive the dot lattice at any size. */
const SEG = { "0":[1,1,1,1,1,1,0],"1":[0,1,1,0,0,0,0],"2":[1,1,0,1,1,0,1],"3":[1,1,1,1,0,0,1],
              "4":[0,1,1,0,0,1,1],"5":[1,0,1,1,0,1,1],"6":[1,0,1,1,1,1,1],"7":[1,1,1,0,0,0,0],
              "8":[1,1,1,1,1,1,1],"9":[1,1,1,1,0,1,1] };
function seg7(g, x, y, w, h, ch, lw){
  const s=SEG[ch]; if(!s) return;
  const m=lw*0.62, hh=h/2;
  g.fillStyle=INK;
  const hbar=(yy)=>g.fillRect(x+m, yy-lw/2, w-2*m, lw);
  const vbar=(xx,ya,yb)=>g.fillRect(xx-lw/2, ya+m, lw, yb-ya-2*m);
  if(s[0]) hbar(y+lw/2);
  if(s[1]) vbar(x+w-lw/2, y,    y+hh);
  if(s[2]) vbar(x+w-lw/2, y+hh, y+h);
  if(s[3]) hbar(y+h-lw/2);
  if(s[4]) vbar(x+lw/2,   y+hh, y+h);
  if(s[5]) vbar(x+lw/2,   y,    y+hh);
  if(s[6]) hbar(y+hh);
}
function numW(str, dw, gap){ const n=String(str).length; return n*dw + (n-1)*gap; }
function seg7Num(g, str, x, y, dw, dh, gap, lw){
  let cx=x; for(const ch of String(str)){ seg7(g,cx,y,dw,dh,ch,lw); cx += dw+gap; }
}

/* ---------------- plates + broken survey boundaries ---------------------- */
function plate(pen, g, x, y, w, h, lw=3){
  pen.paint(()=>{ g.rect(x,y,w,h); }, toneSolid(inkLevel(params.fieldLevel)), lw);
}
/* a parcel boundary: light worked ground, DASHED edge, solid corner brackets.
   The dashes + brackets keep the long edges from reading as full-width bars. */
function parcelBound(pen, g, x, y, w, h, { named=false }={}){
  g.fillStyle=inkLevel(params.fieldLevel); g.fillRect(x,y,w,h);
  g.save(); g.strokeStyle=INK; g.lineWidth=2.6; g.setLineDash([15,11]);
  g.strokeRect(x,y,w,h); g.setLineDash([]); g.restore();
  // corner brackets — heavier when the parcel has been NAMED aloud
  const c=Math.min(w,h)*0.20, lw=named?8:4.5;
  g.save(); g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="butt";
  const corner=(cx,cy,sx,sy)=>{ g.beginPath();
    g.moveTo(cx+sx*c, cy); g.lineTo(cx, cy); g.lineTo(cx, cy+sy*c); g.stroke(); };
  corner(x,y,1,1); corner(x+w,y,-1,1); corner(x,y+h,1,-1); corner(x+w,y+h,-1,-1);
  g.restore();
}

/* ---------------- fruit glyphs for the ledger cells ---------------------- */
function fruitGlyph(pen, g, kind, cx, cy, r){
  if (kind==="vine"){
    // a hanging bunch: stem + three-two-one berry triangle
    g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(2.4,r*0.16); g.lineCap="round";
    g.beginPath(); g.moveTo(cx, cy-r*1.05); g.lineTo(cx, cy-r*0.55); g.stroke(); g.restore();
    const b=r*0.30;
    const put=(bx,by)=>pen.paint(()=>{ g.arc(bx,by,b,0,7); }, toneSolid(inkLevel(4)), 2.2);
    put(cx-b*1.7, cy-r*0.18); put(cx, cy-r*0.18); put(cx+b*1.7, cy-r*0.18);
    put(cx-b*0.9, cy+r*0.36);  put(cx+b*0.9, cy+r*0.36);
    put(cx,        cy+r*0.90);
    return;
  }
  // stem
  g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(2.4,r*0.16); g.lineCap="round";
  g.beginPath(); g.moveTo(cx, cy-r*0.92); g.lineTo(cx+r*0.16, cy-r*1.32); g.stroke(); g.restore();
  if (kind==="pear"){
    pen.paint(()=>{ g.arc(cx, cy+r*0.30, r*0.72, 0, 7); g.moveTo(cx+r*0.44, cy-r*0.42);
                    g.arc(cx, cy-r*0.42, r*0.44, 0, 7); }, toneSolid(inkLevel(3)), 3);
  } else if (kind==="fig"){
    pen.paint(()=>{ g.ellipse(cx, cy+r*0.22, r*0.80, r*0.66, 0, 0, 7);
                    g.moveTo(cx+r*0.30, cy-r*0.52);
                    g.arc(cx, cy-r*0.52, r*0.30, 0, 7); }, toneSolid(inkLevel(3)), 3);
  } else {
    pen.paint(()=>{ g.arc(cx, cy, r*0.80, 0, 7); }, toneSolid(inkLevel(3)), 3);
    // a leaf off the stem
    pen.paint(()=>{ g.ellipse(cx+r*0.52, cy-r*1.02, r*0.34, r*0.17, -0.5, 0, 7); },
      toneSolid(inkLevel(2)), 2.2);
  }
}

/* ---------------- the planted glyphs ------------------------------------
   Crown extents above / below the planting point, per species, so rows can be
   inset far enough that nothing crosses a parcel boundary. */
const CROWN = { tall:{ up:1.36, dn:1.00 }, round:{ up:1.20, dn:0.95 },
                broad:{ up:0.86, dn:0.95 }, vine:{ up:1.15, dn:1.05 } };

function treeGlyph(pen, g, kind, cx, cy, r, level){
  if (kind==="vine"){
    // one trained VINE ROW: a short strung wire with a single bunch hung from it.
    // Deliberately only two marks — stakes at this density read as a lattice.
    const w=r*1.00, h=r*0.72;
    g.save(); g.strokeStyle=INK; g.lineCap="round";
    g.lineWidth=Math.max(2.6, r*0.24);
    g.beginPath(); g.moveTo(cx-w, cy-h); g.lineTo(cx+w, cy-h); g.stroke();
    g.restore();
    pen.paint(()=>{ g.moveTo(cx-w*0.68, cy-h*0.58); g.lineTo(cx+w*0.68, cy-h*0.58);
                    g.lineTo(cx, cy+h*1.45); g.closePath(); },
      toneSolid(inkLevel(3)), 2.4);
    return;
  }
  // trunk first (small, dark), then the light crown plane over it
  const th=r*0.60, tw=Math.max(2.5, r*0.24);
  pen.paint(()=>{ g.rect(cx-tw/2, cy+r*0.26, tw, th); }, toneSolid(inkLevel(params.trunkLevel)), 1.8);
  const t=toneSolid(inkLevel(level));
  if (kind==="tall"){          // pear — upright spindle crown
    pen.paint(()=>{ g.ellipse(cx, cy-r*0.20, r*0.74, r*1.10, 0, 0, 7); }, t, 3);
    g.save(); g.strokeStyle=INK; g.lineWidth=1.8; g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(cx, cy-r*1.00); g.lineTo(cx, cy+r*0.26); g.stroke(); g.restore();
  } else if (kind==="broad"){  // fig — low, wide crown
    pen.paint(()=>{ g.ellipse(cx, cy-r*0.16, r*1.05, r*0.72, 0, 0, 7); }, t, 2.6);
    g.save(); g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.45;
    g.beginPath(); g.moveTo(cx-r*0.66, cy-r*0.16); g.lineTo(cx+r*0.66, cy-r*0.16); g.stroke(); g.restore();
  } else {                      // apple — round crown with a marked shoulder
    pen.paint(()=>{ g.arc(cx, cy-r*0.18, r*0.98, 0, 7); }, t, 3);
    g.save(); g.strokeStyle=INK; g.lineWidth=1.8; g.globalAlpha=0.45;
    g.beginPath(); g.arc(cx, cy-r*0.18, r*0.50, 0, 7); g.stroke(); g.restore();
  }
}

/* deterministic planting positions for a parcel, aisle-split so every sub-row
   is broken into two blocks and nothing spans the plate edge to edge. */
function plantXY(p, W, H){
  const px=params.padX*W, py=params.padY*H, r=p.r*W, c=CROWN[p.kind];
  const x0=PAGE.parX0*W+px+r*1.15, x1=PAGE.parX1*W-px-r*1.15;
  const y0=p.y0*H+py+r*c.up,       y1=p.y1*H-py-r*c.dn;
  const rr=rnd(p.seed), out=[];
  const nRows=p.rows.length;
  for(let ri=0; ri<nRows; ri++){
    const n=p.rows[ri], sp=p.split[ri];
    const units=(n-1)+params.aisle, pitch=(x1-x0)/units;
    const y = nRows===1 ? (y0+y1)/2 : lerp(y0, y1, ri/(nRows-1));
    for(let i=0;i<n;i++){
      const x = x0 + (i + (i>=sp ? params.aisle : 0))*pitch;
      out.push({ x: x + (rr()-0.5)*params.jitter*W*1.6,
                 y: y + (rr()-0.5)*params.jitter*W*1.0,
                 r: r*lerp(0.94,1.06,rr()) });
    }
  }
  return out;
}

/* ---------------- the gift seal at the head of the deed spine ------------ */
function giftSeal(pen, g, cx, cy, r){
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(1)), 5);
  // a sapling handed down: stem + two broad leaves, big enough to survive the dots
  g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(3.2,r*0.13); g.lineCap="round";
  g.beginPath(); g.moveTo(cx, cy+r*0.60); g.lineTo(cx, cy-r*0.52); g.stroke(); g.restore();
  pen.paint(()=>{ g.ellipse(cx-r*0.40, cy-r*0.16, r*0.40, r*0.20, -0.55, 0, 7); }, toneSolid(inkLevel(3)), 2.6);
  pen.paint(()=>{ g.ellipse(cx+r*0.40, cy+r*0.06, r*0.40, r*0.20,  0.55, 0, 7); }, toneSolid(inkLevel(3)), 2.6);
}

/* ---------------- draw -------------------------------------------------- */
function drawPlate(ctx, W, H, st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const layers = st.layers || ["ground","parcels","plantings","ledger","spine","marks","frame"];
  const has=l=>layers.includes(l);
  const named = clamp(st.named ?? 0, 0, 4);     // parcels recited so far
  const gift  = st.gift !== false;              // deed hooks drawn
  const t     = st.t || 0;

  const dW=params.digitW*W, dH=params.digitH*H, dG=dW*0.26, dL=Math.max(4.5, dH*params.digitBar);

  // ---- GROUND: worked-farm field under the plan column only -------------
  if (has("ground")){
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.13; g.lineWidth=1.6;
    for(let i=1;i<7;i++){ const x=lerp(PAGE.parX0,PAGE.parX1,i/7)*W;
      g.beginPath(); g.moveTo(x, 0.168*H); g.lineTo(x, 0.926*H); g.stroke(); }
    g.restore();
  }

  // ---- HEADER: the total GIVEN plate + the gift seal ---------------------
  if (has("ledger")){
    const hx=PAGE.totX0*W, hy=PAGE.headY0*H;
    const hw=(PAGE.totX1-PAGE.totX0)*W, hh=(PAGE.headY1-PAGE.headY0)*H;
    plate(pen, g, hx, hy, hw, hh, st.proved?6:3);
    const word="GIVEN", ws=params.wordSize*W*0.80, tk=W*0.005;
    tracked(g, word, hx+(hw-trackedWidth(g,word,ws,tk))/2, hy+hh*0.27, ws, tk, INK);
    const ddW=dW*0.80, ddH=dH*0.74, ddG=dG*0.85;
    const tw=numW(TOTAL, ddW, ddG);
    seg7Num(g, TOTAL, hx+(hw-tw)/2, hy+hh*0.72-ddH/2, ddW, ddH, ddG, dL*0.82);
  }

  // ---- PARCELS + LEDGER CELLS -------------------------------------------
  const markXY={};
  for(let pi=0; pi<PARCELS.length; pi++){
    const p=PARCELS[pi];
    const px0=PAGE.parX0*W, px1=PAGE.parX1*W, py0=p.y0*H, py1=p.y1*H;

    if (has("parcels")) parcelBound(pen, g, px0, py0, px1-px0, py1-py0, { named: pi<named });

    if (has("plantings")){
      const pts=plantXY(p, W, H);
      for(let i=0;i<pts.length;i++){
        treeGlyph(pen, g, p.kind, pts[i].x, pts[i].y, pts[i].r, p.tone);
        if(i===p.mark) markXY[p.key]={ x:pts[i].x, y:pts[i].y, r:pts[i].r };
      }
    }

    // ledger cell: species word over a seven-segment count + fruit glyph
    if (has("ledger")){
      const cx0=PAGE.ledX0*W, cw=(PAGE.ledX1-PAGE.ledX0)*W;
      const inset=Math.min((py1-py0)*0.09, H*0.013);
      const cy0=py0+inset, ch=(py1-py0)-inset*2;
      plate(pen, g, cx0, cy0, cw, ch, pi<named?6:3);
      const ws=params.wordSize*W, tk=W*0.006;
      const tw=trackedWidth(g, p.label, ws, tk);
      const wordY=cy0+ch*0.27;
      tracked(g, p.label, cx0+(cw-tw)/2, wordY, ws, tk, INK);
      const numY=cy0+ch*0.70;
      const gr=W*0.024, nw=numW(p.n, dW, dG);
      const blockW=gr*2+W*0.020+nw, bx=cx0+(cw-blockW)/2;
      fruitGlyph(pen, g, p.key, bx+gr, numY, gr);
      seg7Num(g, p.n, bx+gr*2+W*0.020, numY-dH/2, dW, dH, dG, dL);
      // a short rule between word and count — deliberately narrower than the cell
      g.save(); g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
      const ruleY=(wordY+ws*0.5+numY-dH/2)/2;
      g.beginPath(); g.moveTo(cx0+cw*0.26, ruleY); g.lineTo(cx0+cw*0.74, ruleY);
      g.stroke(); g.restore();
    }
  }

  // ---- DEED SPINE: the gift seal + dashed leaders to the marked trees ----
  if (has("spine")){
    const gx=PAGE.gutter*W;
    const yTop=(PAGE.sealY+PAGE.sealR*W/H*0.0+0.052)*H;
    g.save(); g.strokeStyle=INK; g.lineWidth=2.4; g.globalAlpha=0.85;
    g.setLineDash([9,8]); g.lineDashOffset=-(t*10)%17;
    g.beginPath(); g.moveTo(gx, yTop); g.lineTo(gx, 0.900*H); g.stroke();
    g.setLineDash([]); g.restore();
    giftSeal(pen, g, PAGE.sealX*W, PAGE.sealY*H, PAGE.sealR*W);
    // the seal caption, set large enough to survive the dot lattice
    const ws=params.wordSize*W, tk=W*0.006;
    tracked(g, "GIFT", (PAGE.sealX+PAGE.sealR+0.030)*W, PAGE.sealY*H, ws, tk, INK);
  }

  if (has("marks") && gift){
    for(const p of PARCELS){
      const m=markXY[p.key]; if(!m) continue;
      const gx=PAGE.gutter*W;
      // dashed hook from the spine into the given tree
      g.save(); g.strokeStyle=INK; g.lineWidth=2.2; g.setLineDash([7,7]);
      g.beginPath(); g.moveTo(gx, m.y); g.lineTo(m.x-m.r*1.9, m.y); g.stroke();
      g.setLineDash([]); g.restore();
      // the ring on the tree the boy was given
      g.save(); g.strokeStyle=INK; g.lineWidth=3;
      g.beginPath(); g.arc(m.x, m.y, m.r*1.75, 0, 7); g.stroke(); g.restore();
      // semantic tick (prints black — it is a mark, not a colour)
      g.fillStyle=ACCENT; g.fillRect(m.x-W*0.008, m.y+m.r*1.75+W*0.006, W*0.016, W*0.010);
    }
  }

  // ---- outer survey border ----------------------------------------------
  if (has("frame") && params.frame){
    pen.ink(()=>{ g.rect(PAGE.frame*W, PAGE.frame*H, (1-PAGE.frame*2)*W, (1-PAGE.frame*2)*H); }, 4);
  }
}

const LAYERS=["ground","parcels","plantings","ledger","spine","marks","frame"];

export const asset = {
  id:"set_piece.orchard-inventory",
  type:"SET_PIECE",
  name:"Orchard Inventory",
  statusWord:"COUNTED",
  scene:"OD-B24-S04",

  params,
  // back -> front draw order; a scene may pass a subset to reveal / occlude
  layers:LAYERS,
  // normalized 0..1 placement / callout / camera anchors
  anchors:{
    "plot:pear":     { x:(PAGE.parX0+PAGE.parX1)/2, y:(PARCELS[0].y0+PARCELS[0].y1)/2 },
    "plot:apple":    { x:(PAGE.parX0+PAGE.parX1)/2, y:(PARCELS[1].y0+PARCELS[1].y1)/2 },
    "plot:fig":      { x:(PAGE.parX0+PAGE.parX1)/2, y:(PARCELS[2].y0+PARCELS[2].y1)/2 },
    "plot:vine":     { x:(PAGE.parX0+PAGE.parX1)/2, y:(PARCELS[3].y0+PARCELS[3].y1)/2 },
    "ledger:pear":   { x:(PAGE.ledX0+PAGE.ledX1)/2, y:(PARCELS[0].y0+PARCELS[0].y1)/2 },
    "ledger:apple":  { x:(PAGE.ledX0+PAGE.ledX1)/2, y:(PARCELS[1].y0+PARCELS[1].y1)/2 },
    "ledger:fig":    { x:(PAGE.ledX0+PAGE.ledX1)/2, y:(PARCELS[2].y0+PARCELS[2].y1)/2 },
    "ledger:vine":   { x:(PAGE.ledX0+PAGE.ledX1)/2, y:(PARCELS[3].y0+PARCELS[3].y1)/2 },
    "deed:seal":     { x:PAGE.sealX, y:PAGE.sealY },
    "deed:total":    { x:(PAGE.totX0+PAGE.totX1)/2, y:(PAGE.headY0+PAGE.headY1)/2 },
    "deed:spine":    { x:PAGE.gutter, y:0.540 },
    "aisle:walk":    { x:(PAGE.parX0+PAGE.parX1)/2, y:0.540 },
    "camera:plate":  { x:0.500, y:0.500 },
    "camera:fig-block":{ x:(PAGE.parX0+PAGE.parX1)/2, y:(PARCELS[2].y0+PARCELS[2].y1)/2 },
  },
  // collision boundaries / footprints on the plate (normalized boxes)
  zones:{
    pear:   { x0:PAGE.parX0, y0:PARCELS[0].y0, x1:PAGE.parX1, y1:PARCELS[0].y1 },
    apple:  { x0:PAGE.parX0, y0:PARCELS[1].y0, x1:PAGE.parX1, y1:PARCELS[1].y1 },
    fig:    { x0:PAGE.parX0, y0:PARCELS[2].y0, x1:PAGE.parX1, y1:PARCELS[2].y1 },
    vine:   { x0:PAGE.parX0, y0:PARCELS[3].y0, x1:PAGE.parX1, y1:PARCELS[3].y1 },
    ledger: { x0:PAGE.ledX0, y0:PARCELS[0].y0, x1:PAGE.ledX1, y1:PARCELS[3].y1 },
    header: { x0:PAGE.totX0, y0:PAGE.headY0,   x1:PAGE.parX1, y1:PAGE.headY1 },
    plate:  { x0:PAGE.frame, y0:PAGE.frame,    x1:1-PAGE.frame, y1:1-PAGE.frame },
  },
  // counts declared for continuity checks against the recitation
  counts:{ pear:13, apple:10, fig:40, vine:50, total:TOTAL },
  // flat diagrammatic evidence held up between father and son
  depth:"midground",
  states:{
    initial:"surveyed",
    nodes:{
      // the whole holding charted and tallied, gift links visible
      surveyed:{ preview:{ layers:LAYERS, named:0, gift:true, t:0.4, status:"COUNTED", progress:.32 } },
      // the recitation walking down the plate, parcel by parcel
      naming:{ preview:{ layers:LAYERS, named:2, gift:true, t:1.2, status:"NAMING", progress:.58 } },
      // every parcel named; the childhood gift acknowledged
      given:{ preview:{ layers:LAYERS, named:4, gift:true, t:2.0, status:"GIVEN", progress:.82 } },
      // the private map accepted as proof — the total plate struck heavy
      proved:{ preview:{ layers:LAYERS, named:4, gift:true, proved:true, t:2.6, status:"PROVED", progress:1 } },
      // the bare planting plan, no deed marks (reusable as plain orchard dressing)
      bare:{ preview:{ layers:["ground","parcels","plantings","frame"], named:0, gift:false, t:0, status:"ORCHARD", progress:.18 } },
    },
    edges:[["surveyed","naming"],["naming","given"],["given","proved"],
           ["surveyed","bare"],["bare","surveyed"],["proved","surveyed"]],
  },
  channels:["named","gift","reveal","count","focus"],

  preview:()=>({ layers:LAYERS, named:0, gift:true, t:0.4, status:"COUNTED", progress:.32 }),
  draw(ctx,W,H,state){ drawPlate(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
