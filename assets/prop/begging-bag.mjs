/* prop.begging-bag — the beggar's scrip (pēra): a soft leather pouch on a
   shoulder thong, gathered at a narrow neck that OPENS to receive portions of
   bread and meat, and carrying on its face a sewn tally panel so the gifts are
   never anonymous — the bag preserves a donor history. PROP asset. Drawn in
   SOLID grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B17-S04): the bag Odysseus carries down the hall, held
   open at every suitor's table. Five states —
     CLOSED    drawstring cinched, thong slung, tally showing three donors
     OPEN      neck flared, a dark slot of a throat, nothing in it yet
     RECEIVING a portion in the neck, another still falling
     LADEN     heaped, portions cresting the neck, the pouch bulging
     TALLIED   the same bag cut in section: every gift is a stratum, and each
               stratum is leadered out to its donor's seal in a column at the
               right. The last seal is STRUCK — a portion offered and refused.

   Silhouette law: narrow gathered neck, plump sagging belly, and an
   ASYMMETRIC thong looping up and away to the left with a free knotted end —
   a carried bag, never a handled pot. Tone plan: light hide (3), paper-light
   tally panel (1), dark ink reserved for the cord, the throat and the marks.
   All record-keeping is GEOMETRY (bold bars, blocky seals), never type. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  capacity: 7,          // portions the scrip holds before it bulges
  patches: 2,           // sewn repair patches on the hide
  drawstring: true,     // puckered cinch at the neck
  // the donor history the bag preserves — order given, seal, what was given
  donors: [
    { seal:"disc",     portion:"loaf",   n:1 },
    { seal:"square",   portion:"meat",   n:2 },
    { seal:"triangle", portion:"cake",   n:3 },
    { seal:"chevron",  portion:"cheese", n:4 },
    { seal:"struck",   portion:"none",   n:5 },   // offered, then refused
  ],
};

const HIDE   = 3;   // leather body — LIGHT, most of the ink is contour
const HIDE_D = 5;   // shaded near-flank crescent (narrow)
const PANEL  = 1;   // sewn tally panel (lighter than the hide)
const PATCH  = 4;   // repair patch
const CORD   = 6;   // shoulder thong / drawstring
const THROAT = 4;   // the open neck slot
const THROAT_L=2;   // far inner wall, catching light
const FOOD   = 2;   // bread / meat portions — light
const FOOD_D = 4;   // bone ends, cheese eyes
const MARK   = 7;   // tally bars + donor seals (full ink, small area)
const STRAT  = 2;   // alternating stratum fill in the section view

/* rounded-rect sub-path (no fill/stroke; caller wraps in pen.paint) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* ------------------------------------------------------------------
   THE HIDE — a soft pouch in a LOCAL frame whose origin is the centre of
   the neck opening, up = -y. `nh` neck half-width (grows as it opens),
   `bh` belly half-width (grows as it fills). Height is always 0.86U.
   ------------------------------------------------------------------ */
function bodyPath(g,U,nh,bh){
  g.moveTo(-nh, 0);
  g.bezierCurveTo(-nh*1.02, U*0.09, -bh*0.80, U*0.14, -bh*0.96, U*0.36);
  g.bezierCurveTo(-bh, U*0.52, -bh, U*0.70, -bh*0.58, U*0.81);
  g.bezierCurveTo(-bh*0.32, U*0.90,  bh*0.32, U*0.90,  bh*0.58, U*0.81);
  g.bezierCurveTo( bh, U*0.70,  bh, U*0.52,  bh*0.96, U*0.36);
  g.bezierCurveTo( bh*0.80, U*0.14,  nh*1.02, U*0.09,  nh, 0);
  g.closePath();
}

/* ------------------------------------------------------------------
   PORTIONS — the four things that go into a beggar's bag. Blocky glyphs,
   light fill + hard contour, drawn at (x,y) with radius r.
   ------------------------------------------------------------------ */
function drawPortion(pen,g,kind,x,y,r,rot){
  if (!kind || kind==="none") return;
  g.save(); g.translate(x,y); g.rotate(rot||0);
  if (kind==="loaf"){
    pen.paint(()=>{
      g.moveTo(-r*0.98, r*0.40);
      g.quadraticCurveTo(-r*1.04,-r*0.58, 0,-r*0.64);
      g.quadraticCurveTo( r*1.04,-r*0.58, r*0.98, r*0.40);
      g.quadraticCurveTo(0, r*0.70, -r*0.98, r*0.40);
      g.closePath();
    }, toneSolid(inkLevel(FOOD)), 5);
    for(const o of [-0.45,0,0.45])
      pen.seam(()=>{ g.moveTo(o*r-r*0.20,-r*0.30); g.lineTo(o*r+r*0.14, r*0.06); }, 3.2);
  } else if (kind==="meat"){
    pen.paint(()=>{ g.ellipse(r*0.12,0, r*0.84, r*0.54, 0.12, 0,7); }, toneSolid(inkLevel(FOOD)), 5);
    // the two knuckle-ends of the bone sticking out of the joint
    pen.paint(()=>{ g.ellipse(-r*0.80,-r*0.17, r*0.20, r*0.16, 0,0,7); }, toneSolid(inkLevel(FOOD_D)), 3.2);
    pen.paint(()=>{ g.ellipse(-r*0.80, r*0.17, r*0.20, r*0.16, 0,0,7); }, toneSolid(inkLevel(FOOD_D)), 3.2);
    pen.seam(()=>{ g.moveTo(-r*0.62, 0); g.lineTo(r*0.52,-r*0.08); }, 3.2);
  } else if (kind==="cake"){
    pen.paint(()=>{ rr(g,-r*0.82,-r*0.52, r*1.64, r*1.04, r*0.24); }, toneSolid(inkLevel(FOOD)), 5);
    pen.seam(()=>{ g.moveTo(-r*0.46,-r*0.30); g.lineTo( r*0.46, r*0.30); }, 3.2);
    pen.seam(()=>{ g.moveTo( r*0.46,-r*0.30); g.lineTo(-r*0.46, r*0.30); }, 3.2);
  } else { // cheese wedge
    pen.paint(()=>{
      g.moveTo(-r*0.88, r*0.48); g.lineTo(r*0.92, r*0.48);
      g.lineTo(r*0.16,-r*0.60); g.closePath();
    }, toneSolid(inkLevel(FOOD)), 5);
    pen.paint(()=>{ g.ellipse(-r*0.10, r*0.20, r*0.15, r*0.13, 0,0,7); }, toneSolid(inkLevel(FOOD_D)), 2.4);
    pen.paint(()=>{ g.ellipse( r*0.36, r*0.06, r*0.12, r*0.11, 0,0,7); }, toneSolid(inkLevel(FOOD_D)), 2.4);
  }
  g.restore();
}

/* ------------------------------------------------------------------
   DONOR SEALS — blocky marks, never letters. Each donor is one seal;
   `struck` is the gift that was offered and refused.
   ------------------------------------------------------------------ */
function donorSeal(pen,g,seal,x,y,s){
  const t = toneSolid(inkLevel(MARK));
  if (seal==="disc")     pen.paint(()=>{ g.arc(x,y,s*0.46,0,7); }, t, 3.4);
  else if (seal==="square") pen.paint(()=>{ g.rect(x-s*0.42,y-s*0.42,s*0.84,s*0.84); }, t, 3.4);
  else if (seal==="triangle") pen.paint(()=>{
      g.moveTo(x, y-s*0.50); g.lineTo(x+s*0.46, y+s*0.36); g.lineTo(x-s*0.46, y+s*0.36); g.closePath(); }, t, 3.4);
  else if (seal==="chevron") pen.paint(()=>{
      g.moveTo(x-s*0.46, y+s*0.42); g.lineTo(x, y-s*0.44); g.lineTo(x+s*0.46, y+s*0.42);
      g.lineTo(x+s*0.46, y+s*0.08); g.lineTo(x, y-s*0.12); g.lineTo(x-s*0.46, y+s*0.08); g.closePath(); }, t, 3.0);
  else { // struck — an empty seal with a hard X through it
    pen.paint(()=>{ g.rect(x-s*0.42,y-s*0.42,s*0.84,s*0.84); }, toneSolid(inkLevel(0)), 4.2);
    g.strokeStyle=INK; g.lineWidth=Math.max(5,s*0.16); g.lineCap="round";
    g.beginPath(); g.moveTo(x-s*0.40,y-s*0.40); g.lineTo(x+s*0.40,y+s*0.40);
    g.moveTo(x+s*0.40,y-s*0.40); g.lineTo(x-s*0.40,y+s*0.40); g.stroke();
  }
}

/* TALLY BARS — the donor count as geometry. Bar width and height are sized
   off the panel so they never fall below the dot lattice. Every fifth donor
   is the diagonal strike across the preceding four. */
function tallyBars(pen,g,x0,yTop,h,gap,n){
  g.strokeStyle=INK; g.lineCap="butt";
  const bw = Math.max(6, gap*0.38);
  for(let i=0;i<n;i++){
    if ((i+1)%5===0){                                   // the strike
      const xa = x0 + (i-4)*gap - gap*0.28, xb = x0 + (i-1)*gap + gap*0.28;
      g.lineWidth = bw*0.9; g.lineCap="round";
      g.beginPath(); g.moveTo(xa, yTop+h*0.92); g.lineTo(xb, yTop+h*0.08); g.stroke();
      g.lineCap="butt"; continue;
    }
    const x = x0 + i*gap;
    g.lineWidth = bw;
    // three bar heights, cycling, so the row reads as distinct donors
    const hh = h * (i%3===1 ? 0.66 : i%3===2 ? 0.86 : 1.0);
    g.beginPath(); g.moveTo(x, yTop+h-hh); g.lineTo(x, yTop+h); g.stroke();
    if (i%3===2){ g.beginPath();                        // footed bar
      g.moveTo(x-gap*0.22, yTop+h); g.lineTo(x+gap*0.22, yTop+h); g.stroke(); }
  }
}

/* the sewn tally panel on the face of the hide ----------------------- */
function drawPanel(pen,g,U,n){
  const halfW = U*0.17, y0 = U*0.48, hgt = U*0.20;
  pen.paint(()=>{ rr(g,-halfW,y0,halfW*2,hgt,U*0.02); }, toneSolid(inkLevel(PANEL)), 4);
  g.strokeStyle=INK; g.lineWidth=2.4; g.setLineDash([6,6]);
  g.strokeRect(-halfW+U*0.016, y0+U*0.016, halfW*2-U*0.032, hgt-U*0.032);
  g.setLineDash([]);
  const gap = (halfW*1.66)/Math.max(4,n);
  tallyBars(pen,g, -halfW*0.80, y0+U*0.040, U*0.115, gap, n);
}

/* ------------------------------------------------------------------
   THE NECK — cinched shut, or flared open over a dark slot of a throat.
   Kept deliberately narrow and shallow: an open mouth must read as an
   aperture, never as a bar laid across the frame.
   ------------------------------------------------------------------ */
function drawNeck(pen,g,U,nh,open){
  if (open<0.25){
    // gathered + cinched: bunched hide above a cord band, knot to one side
    pen.paint(()=>{
      g.moveTo(-nh, U*0.02);
      g.lineTo(-nh*0.74,-U*0.11);
      g.quadraticCurveTo(0,-U*0.15, nh*0.74,-U*0.11);
      g.lineTo( nh, U*0.02);
      g.closePath();
    }, toneSolid(inkLevel(HIDE)), 5);
    for(let i=-1;i<=1;i++)
      pen.seam(()=>{ g.moveTo(nh*0.44*i, U*0.01); g.lineTo(nh*0.64*i,-U*0.11); }, 3);
    pen.paint(()=>{ rr(g,-nh*1.08,-U*0.010, nh*2.16, U*0.040, U*0.014); }, toneSolid(inkLevel(CORD)), 3.2);
    if (params.drawstring){
      pen.paint(()=>{ g.ellipse(nh*1.00, U*0.012, U*0.028, U*0.023, 0,0,7); }, toneSolid(inkLevel(CORD)), 3);
      pen.ink(()=>{ g.moveTo(nh*1.06, U*0.020); g.quadraticCurveTo(nh*1.62, U*0.07, nh*1.42, U*0.12); }, 3.2);
    }
    return;
  }
  // OPEN: a shallow elliptical aperture; the far inner wall catches light so
  // the throat reads as a hollow rather than a printed slab.
  const ry = nh*0.25;
  pen.paint(()=>{ g.ellipse(0, 0, nh*1.02, ry, 0,0,7); }, toneSolid(inkLevel(THROAT)), 4.5);
  pen.paint(()=>{ g.ellipse(0,-ry*0.22, nh*0.84, ry*0.60, 0,0,7); }, toneSolid(inkLevel(THROAT_L)), 0);
  // rolled rim, front half only — a lip, not a band
  pen.ink(()=>{ g.ellipse(0, ry*0.14, nh*1.02, ry*0.94, 0, 0.15, Math.PI-0.15); }, 4);
  // two small folds where the gathered hide turns out
  for(const s of [-1,1])
    pen.paint(()=>{
      g.moveTo(s*nh*1.00, ry*0.22);
      g.quadraticCurveTo(s*nh*1.14, -ry*0.30, s*nh*0.98, -ry*0.94);
      g.lineTo(s*nh*0.82, -ry*0.30);
      g.closePath();
    }, toneSolid(inkLevel(HIDE)), 4);
}

/* the shoulder thong — asymmetric: a long loop up and away to the left with
   a free knotted end down the flank. This is what says BAG, not pot. ------ */
function drawThong(pen,g,U,nh,rise){
  // both cords leave the neck rings and converge on a carrying knot up-left:
  // a narrow triangle, compact, unmistakably a strap rather than a handle.
  const kx=-U*0.30, ky=-rise;
  const strandL=()=>{ g.moveTo(-nh*0.92, U*0.040);
    g.quadraticCurveTo(-U*0.30, -rise*0.42, kx-U*0.018, ky+U*0.010); };
  const strandR=()=>{ g.moveTo( nh*0.92, U*0.040);
    g.quadraticCurveTo(-U*0.02, -rise*0.34, kx+U*0.026, ky+U*0.022); };
  const tail=()=>{ g.moveTo(kx, ky+U*0.020);
    g.quadraticCurveTo(kx-U*0.13, ky+U*0.10, kx-U*0.07, ky+U*0.19); };
  g.lineCap="round";
  for (const p of [strandL, strandR]){
    g.strokeStyle=INK;              g.lineWidth=9;  g.beginPath(); p(); g.stroke();
    g.strokeStyle=inkLevel(CORD-2); g.lineWidth=4;  g.beginPath(); p(); g.stroke();
  }
  g.strokeStyle=INK;              g.lineWidth=7;  g.beginPath(); tail(); g.stroke();
  g.strokeStyle=inkLevel(CORD-2); g.lineWidth=3;  g.beginPath(); tail(); g.stroke();
  // the carrying knot, then the two attachment rings at the neck
  pen.paint(()=>{ g.ellipse(kx, ky, U*0.038, U*0.030, -0.35, 0,7); }, toneSolid(inkLevel(CORD)), 3.4);
  pen.seam(()=>{ g.moveTo(kx-U*0.026, ky-U*0.014); g.lineTo(kx+U*0.026, ky+U*0.014); }, 2.6);
  for(const s of [-1,1])
    pen.paint(()=>{ g.ellipse(s*nh*0.92, U*0.042, U*0.026, U*0.020, 0,0,7); }, toneSolid(inkLevel(CORD)), 3);
}

/* repair patches on the hide ----------------------------------------- */
function drawPatches(pen,g,U,bh){
  const spec=[
    { x:-bh*0.50, y:U*0.34, w:U*0.12, h:U*0.10 },
    { x: bh*0.52, y:U*0.66, w:U*0.10, h:U*0.09 },
  ].slice(0,params.patches);
  for(const p of spec){
    pen.paint(()=>{ rr(g,p.x-p.w/2,p.y-p.h/2,p.w,p.h,U*0.012); }, toneSolid(inkLevel(PATCH)), 3);
    g.strokeStyle=INK; g.lineWidth=2.2; g.setLineDash([4,4]);
    g.strokeRect(p.x-p.w/2+4, p.y-p.h/2+4, p.w-8, p.h-8); g.setLineDash([]);
  }
}

/* ------------------------------------------------------------------
   SECTION VIEW — the donor history made visible. The near hide is cut
   away; every gift is a stratum, oldest at the bottom, leadered out to
   its donor's seal in a column at the right.
   ------------------------------------------------------------------ */
function drawSection(pen,g,U,nh,bh){
  const D = params.donors;
  const yTop = U*0.22, yBot = U*0.84, band = (yBot-yTop)/D.length;

  g.save(); g.beginPath(); bodyPath(g,U,nh,bh); g.clip();
  g.fillStyle=inkLevel(0); g.fillRect(-bh*1.1, -U*0.02, bh*2.2, U*0.95);

  D.forEach((d,i)=>{
    const y1 = yBot - i*band, y0 = y1 - band;
    const inset = U*(0.03 + 0.035*(i%3));            // never a full-width bar
    if (i%2===0){
      g.fillStyle=inkLevel(STRAT);
      g.beginPath(); rr(g,-bh+inset, y0+U*0.010, (bh-inset)*2, band-U*0.020, U*0.018); g.fill();
    }
    g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
    g.beginPath();
    g.moveTo(-bh+inset*1.5, y0+U*0.006);
    g.quadraticCurveTo(0, y0-U*0.014, bh-inset*1.5, y0+U*0.006);
    g.stroke();
  });
  g.restore();

  // the gift itself, sitting in its stratum
  D.forEach((d,i)=>{
    const yc = yBot - i*band - band*0.52;
    drawPortion(pen,g,d.portion, (i%2?bh*0.20:-bh*0.22), yc, band*0.33, (i%2?0.12:-0.10));
  });

  // cut-edge hatching down both contours (broken, short section marks)
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round"; g.globalAlpha=0.7;
  for(let k=0;k<15;k++){
    if (k%4===3) continue;                            // break the run
    const yy = lerp(U*0.22, U*0.76, k/15);
    const xr = bh*(0.985 - 0.13*Math.pow((yy-U*0.50)/(U*0.34),2));
    g.beginPath(); g.moveTo(-xr, yy); g.lineTo(-xr+U*0.028, yy+U*0.024); g.stroke();
    g.beginPath(); g.moveTo( xr, yy); g.lineTo( xr-U*0.028, yy+U*0.024); g.stroke();
  }
  g.globalAlpha=1;

  // donor column: leader -> seal -> ordinal tally
  const colX = bh + U*0.42, s = U*0.088;
  D.forEach((d,i)=>{
    const yc = yBot - i*band - band*0.52;
    g.strokeStyle=INK; g.lineWidth=2.2; g.setLineDash([7,7]);
    g.beginPath(); g.moveTo(bh*0.94, yc); g.lineTo(colX - s*0.74, yc); g.stroke();
    g.setLineDash([]);
    donorSeal(pen,g,d.seal, colX, yc, s);
    g.strokeStyle=INK; g.lineWidth=Math.max(5,s*0.15); g.lineCap="butt";
    for(let b=0;b<d.n;b++){
      const bx = colX - s*0.40 + b*s*0.21;
      g.beginPath(); g.moveTo(bx, yc+s*0.62); g.lineTo(bx, yc+s*0.94); g.stroke();
    }
  });
  // the column's spine, broken at each seal
  g.strokeStyle=INK; g.lineWidth=2.8;
  D.forEach((d,i)=>{
    if (i===D.length-1) return;
    const ya = yBot - i*band - band*0.52 - s*0.62;
    const yb = yBot - (i+1)*band - band*0.52 + s*1.06;
    g.beginPath(); g.moveTo(colX, ya); g.lineTo(colX, yb); g.stroke();
  });
}

/* ------------------------------------------------------------------ */
const MODE = {
  closed:    { open:0.00, bulge:0.35, tally:3, neckload:0, crest:0, falling:0, status:"CLOSED",    progress:.30 },
  open:      { open:1.00, bulge:0.00, tally:3, neckload:0, crest:0, falling:0, status:"OPEN",      progress:.12 },
  receiving: { open:1.00, bulge:0.45, tally:4, neckload:1, crest:0, falling:1, status:"RECEIVING", progress:.58 },
  laden:     { open:0.85, bulge:1.00, tally:7, neckload:0, crest:3, falling:0, status:"LADEN",     progress:.94 },
  history:   { open:0.55, bulge:0.60, tally:5, neckload:0, crest:0, falling:0, section:true, status:"TALLIED", progress:.75 },
};

function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const M = MODE[st.mode] || MODE.receiving;
  const t = st.t || 0;
  const section = !!M.section;

  // the section view gives up width to the donor column at the right
  const U = section ? Math.min(W*0.50, H*0.40) : Math.min(W*0.62, H*0.44);
  const rise = U*0.40;
  const bagH = U*0.86;
  const yM = (H - (bagH + rise))/2 + rise;          // neck line, art centred
  const cx = section ? W*0.40 : W*0.52;             // room left for the thong
  const nh = U*(0.190 + 0.060*M.open);
  const bh = U*(0.300 + 0.035*M.bulge);

  // contact shadow under the resting bag
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, yM+bagH+U*0.020, bh*0.94, U*0.030, 0,0,7); g.fill();

  g.save(); g.translate(cx, yM);

  // ---- thong, behind the hide ----
  drawThong(pen,g,U,nh,rise);

  // ---- the hide ----
  pen.paint(()=>bodyPath(g,U,nh,bh), toneSolid(inkLevel(HIDE)), 6);

  if (section){
    drawSection(pen,g,U,nh,bh);
  } else {
    // one narrow shaded crescent on the near flank — everything else stays light
    g.save(); g.beginPath(); bodyPath(g,U,nh,bh); g.clip();
    g.fillStyle=inkLevel(HIDE_D);
    g.beginPath();
    g.moveTo(bh*0.70, U*0.20);
    g.quadraticCurveTo(bh*1.02, U*0.50, bh*0.62, U*0.80);
    g.quadraticCurveTo(bh*0.88, U*0.50, bh*0.70, U*0.20);
    g.closePath(); g.fill();
    g.restore();

    // welt seam across the belly, BROKEN into two runs
    pen.seam(()=>{ g.moveTo(-bh*0.76, U*0.40); g.quadraticCurveTo(-bh*0.34, U*0.44, -bh*0.18, U*0.43); }, 3.2);
    pen.seam(()=>{ g.moveTo( bh*0.18, U*0.43); g.quadraticCurveTo( bh*0.42, U*0.44,  bh*0.70, U*0.40); }, 3.2);

    drawPatches(pen,g,U,bh);
    drawPanel(pen,g,U,M.tally);
  }

  // ---- the neck ----
  drawNeck(pen,g,U,nh,M.open);

  // ---- RECEIVING: the portion already settling into the neck ----
  if (M.neckload){
    drawPortion(pen,g,"loaf", -nh*0.16, -U*0.045, U*0.086, -0.14);
    // the front lip drawn back over its base so it sits IN the bag
    pen.ink(()=>{ g.ellipse(0, nh*0.042, nh*1.02, nh*0.28, 0, 0.10, Math.PI-0.10); }, 4);
  }

  // ---- LADEN: portions cresting the neck, drawn over it ----
  if (M.crest){
    const spec=[ {k:"loaf",  x:-nh*0.62, y:-U*0.052, r:U*0.084, a:-0.18},
                 {k:"meat",  x: nh*0.12, y:-U*0.100, r:U*0.078, a: 0.12},
                 {k:"cheese",x: nh*0.74, y:-U*0.044, r:U*0.070, a: 0.24} ];
    spec.slice(0,M.crest).forEach(s=>drawPortion(pen,g,s.k,s.x,s.y,s.r,s.a));
  }

  // ---- RECEIVING: a portion still in mid-fall above the open neck ----
  if (M.falling){
    const wob = Math.sin(t*2.2)*U*0.014;
    const s = { k:"meat", x: nh*0.62 + wob, y:-U*0.26, r:U*0.086, a: 0.28 };
    drawPortion(pen,g,s.k,s.x,s.y,s.r,s.a);
    g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round"; g.globalAlpha=0.5;
    for(let i=0;i<3;i++){                             // fall ticks
      const xx = s.x - s.r*0.55 + i*s.r*0.55;
      g.beginPath(); g.moveTo(xx, s.y - s.r*(1.20+i*0.16));
      g.lineTo(xx, s.y - s.r*(1.66+i*0.16)); g.stroke();
    }
    g.globalAlpha=1;
  }

  g.restore();
}

export const asset = {
  id:"prop.begging-bag",
  type:"PROP",
  name:"Begging Bag",
  statusWord:"RECEIVING",
  scene:"OD-B17-S04",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","thong","hide","hide-shade","seams","patches","tally-panel",
          "section","donor-column","neck","neckload","crest","falling"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 660x880 layout; the section view shifts the body left by design)
  anchors:{
    mouth:{x:.54,y:.411},              // the aperture a portion is dropped through
    "mouth:rim-l":{x:.47,y:.415},
    "mouth:rim-r":{x:.61,y:.415},
    "grip:strap":{x:.30,y:.230},       // high point of the thong — the carry hold
    "grip:neck":{x:.47,y:.425},        // the hand that holds the bag open
    "drop:portion":{x:.58,y:.300},     // where a donor's hand releases the gift
    "panel:tally":{x:.54,y:.665},      // the sewn donor record on the face
    body:{x:.54,y:.610},
    "contact:ground":{x:.54,y:.795},
  },
  // collision + placement volumes
  collision:{ kind:"box", x0:.35,y0:.40,x1:.73,y1:.80 },
  zones:{ bounds:{ x0:.17,y0:.14,x1:.76,y1:.81 },
          footprint:{ x0:.40,y0:.76,x1:.68,y1:.80 },
          "mouth:aperture":{ x0:.47,y0:.40,x1:.61,y1:.43 } },
  owner:"odysseus:beggar-disguise",
  provenance:"eumaeus",                 // the swineherd hands over scrip and thong
  donors:params.donors,

  states:{
    initial:"closed",
    nodes:{
      closed:    { preview:{ mode:"closed",    status:"CLOSED",    progress:.30 } },
      open:      { preview:{ mode:"open",      status:"OPEN",      progress:.12 } },
      receiving: { preview:{ mode:"receiving", status:"RECEIVING", progress:.58 } },
      laden:     { preview:{ mode:"laden",     status:"LADEN",     progress:.94 } },
      history:   { preview:{ mode:"history",   status:"TALLIED",   progress:.75 } },
    },
    edges:[
      ["closed","open"],["open","closed"],
      ["open","receiving"],["receiving","open"],
      ["receiving","laden"],["laden","receiving"],
      ["laden","closed"],["receiving","history"],
      ["laden","history"],["history","laden"],
    ],
  },
  channels:["mode","open","tally","donors","t"],

  preview:()=>({ mode:"receiving", status:"RECEIVING", progress:.58, t:0 }),
  draw(ctx,W,H,state){
    drawProp(ctx,W,H,state||{});
    return { anchors:asset.anchors, collision:asset.collision, zones:asset.zones,
             owner:asset.owner, donors:asset.donors };
  },
};
export default asset;
