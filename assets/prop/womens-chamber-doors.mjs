/* prop.womens-chamber-doors — the close-fitted doors of the women's quarters.
   PROP asset (OD-B21-S06). Book XXI: with the bow strung and the axe-lane laid,
   Telemachus and Eurycleia take the house apart into two sealed halves. The old
   nurse gathers the fifty women, drives them into their room, and shoots the bolt:
   "shut fast the close-fitted doors of the hall, and if any hear groaning or the
   thud of men, let none come out — sit still and work in silence." The doors are
   the reason the massacre in XXII is a closed room, and the reason the twelve
   disloyal maids can be produced afterwards and counted.

   So this is a DOOR AS INSTRUMENT, drawn as a frontal elevation from inside the
   women's chamber — the side the maids are shut on:

     lintel (three stones) · two jambs · pivot sockets · two leaves · meeting stile
     the drawn bolt in its two staples · the strap and its knot on the jamb hook
     a height caliper at the left · a tally rail of twelve notches at the foot
     a seven-segment count of the women behind the wood

   States (all four the scene asks for, plus the neutral rest state):
     open      — unbarred, both leaves shut, nobody counted, staples empty
     gathered  — one leaf swung inward, the maids driven through, tally filling
     sealed    — both leaves shut, bolt shot, strap knotted on the hook, twelve inside
     listening — sealed, and the hall on the other side has begun: sound arcs
                 come through the meeting-stile gap and die against the wood
     release   — bolt withdrawn and leaning at the jamb, strap cut, both leaves
                 swung, the tally crossed out: the women let back into the house

   Drawn in SOLID grays + hard black contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither. Light planes, dark
   accents, plenty of paper — every horizontal span is broken or stopped short.
   Atlas: isolated reusable object; declared scale, grip/support/contact anchors,
   ownership, collision shape, and all scene-required states. */
import { makePen, toneSolid, inkLevel, INK } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  women:12,                    // notches on the tally rail — the twelve of XXII.424
  leafInk:0,                   // the door leaves: bare paper inside a hard contour
  frameInk:1,                  // lintel, jambs, sill — one step off the paper
  ledgeInk:2,                  // the single cross-ledge on each leaf
  backInk:2,                   // a leaf seen edge-on, swung
  pegInk:4,                    // pivot pegs in their sockets
  boltInk:6,                   // the bolt — the dark accent, the whole point
  gapInk:5,                    // the meeting-stile gap
  knotInk:4,                   // the strap knot
  // elevation geometry, fractions of W / H
  lintel:{ y0:0.168, y1:0.222, x0:0.116, x1:0.884 },
  sill:  { y0:0.792, y1:0.832, x0:0.132, x1:0.868 },
  open:  { x0:0.224, x1:0.776, y0:0.222, y1:0.792 },
  jambW:0.070,
  boltY:0.470,                 // bolt height, above the rings so nothing collides
  headY:0.078, headH:0.058,    // seven-segment digit band
  railY:0.858, railH:0.032,    // the tally rail
  caliperX:0.074,
};

/* ---------------- seven-segment numerals (numbers as GEOMETRY, never type) --- */

const SEG_MAP = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
                  6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };

function segDigit(g, x, y, h, d){
  const w = h*0.62, t = h*0.245, half = h/2;
  const S = {
    a:[x+t*.55, y,            w-t*1.10, t],
    g:[x+t*.55, y+half-t/2,   w-t*1.10, t],
    d:[x+t*.55, y+h-t,        w-t*1.10, t],
    f:[x,       y+t*.55,      t, half-t*.85],
    b:[x+w-t,   y+t*.55,      t, half-t*.85],
    e:[x,       y+half+t*.30, t, half-t*.85],
    c:[x+w-t,   y+half+t*.30, t, half-t*.85],
  };
  g.fillStyle = INK;
  // a strict seven-segment 1 is two stubby squares that dissolve into the dot
  // lattice — draw it as one unbroken stroke instead, so 12 never reads as :2
  if (d===1){ g.fillRect(x+w-t, y, t, h); return w; }
  for (const s of (SEG_MAP[d]||"")) { const r=S[s]; g.fillRect(r[0],r[1],r[2],r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits,"0");
  const w = h*0.62, gap = h*0.26;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w+gap; }
  return cx-gap-x;
}

/* ---------------- small diagram furniture ---------------- */

/* a broken (never solid) direction arrow */
function arrow(g, x0, y0, x1, y1, head=1){
  const dx=x1-x0, dy=y1-y0, len=Math.hypot(dx,dy), ux=dx/len, uy=dy/len;
  g.save(); g.strokeStyle=INK; g.lineWidth=7; g.lineCap="butt";
  const dash=len*0.150, gap=len*0.090;
  for (let s=0; s+dash < len-head*len*0.20; s+=dash+gap){
    g.beginPath(); g.moveTo(x0+ux*s, y0+uy*s); g.lineTo(x0+ux*(s+dash), y0+uy*(s+dash)); g.stroke();
  }
  if (head){
    const hl=len*0.19, hw=len*0.105;
    g.fillStyle=INK; g.beginPath();
    g.moveTo(x1,y1);
    g.lineTo(x1-ux*hl - uy*hw, y1-uy*hl + ux*hw);
    g.lineTo(x1-ux*hl + uy*hw, y1-uy*hl - ux*hw);
    g.closePath(); g.fill();
  }
  g.restore();
}

/* the height caliper at the left — declares the doors' scale without type */
function caliper(g, W, H){
  const x=W*params.caliperX, y0=H*params.open.y0, y1=H*params.open.y1;
  g.save(); g.strokeStyle=INK; g.lineWidth=4.6; g.lineCap="butt";
  g.beginPath(); g.moveTo(x, y0+H*0.020); g.lineTo(x, y1-H*0.020); g.stroke();
  g.lineWidth=6;
  for (const yy of [y0, y1]){ g.beginPath(); g.moveTo(x-W*0.030, yy); g.lineTo(x+W*0.030, yy); g.stroke(); }
  // arrowheads inward
  g.fillStyle=INK;
  for (const [yy,s] of [[y0,1],[y1,-1]]){
    g.beginPath(); g.moveTo(x, yy+s*H*0.020);
    g.lineTo(x-W*0.014, yy+s*H*0.044); g.lineTo(x+W*0.014, yy+s*H*0.044);
    g.closePath(); g.fill();
  }
  // cubit ticks — four intervals, stopping well short of a rule
  g.lineWidth=4;
  for (let i=1;i<4;i++){ const yy=y0+(y1-y0)*i/4;
    g.beginPath(); g.moveTo(x-W*0.018, yy); g.lineTo(x+W*0.018, yy); g.stroke(); }
  g.restore();
}

/* ---------------- the doorway itself ---------------- */

function frame(pen, g, W, H){
  const L=params.lintel, S=params.sill, O=params.open, jw=W*params.jambW;
  const y0=H*O.y0, y1=H*O.y1, x0=W*O.x0, x1=W*O.x1;

  // lintel — three stones, jointed, overhanging the jambs and stopping short of the card
  pen.paint(()=>{ g.rect(W*L.x0, H*L.y0, W*(L.x1-L.x0), H*(L.y1-L.y0)); },
    toneSolid(inkLevel(params.frameInk)), 4.4);
  for (const u of [0.32,0.68]) pen.seam(()=>{
    const jx=W*(L.x0+(L.x1-L.x0)*u);
    g.moveTo(jx, H*L.y0+H*0.006); g.lineTo(jx, H*L.y1-H*0.006); }, 3);

  // jambs
  for (const jx of [x0-jw, x1]) pen.paint(()=>{ g.rect(jx, y0, jw, y1-y0); },
    toneSolid(inkLevel(params.frameInk)), 4);
  // jamb rebate seam (the leaves shut against it)
  pen.seam(()=>{ g.moveTo(x0-jw*0.30, y0+H*0.010); g.lineTo(x0-jw*0.30, y1-H*0.010); }, 2.6);
  pen.seam(()=>{ g.moveTo(x1+jw*0.30, y0+H*0.010); g.lineTo(x1+jw*0.30, y1-H*0.010); }, 2.6);

  // threshold stone, jointed at the centre so it never reads as one bar
  pen.paint(()=>{ g.rect(W*S.x0, H*S.y0, W*(S.x1-S.x0), H*(S.y1-S.y0)); },
    toneSolid(inkLevel(params.frameInk)), 4.4);
  pen.seam(()=>{ g.moveTo(W*0.500, H*S.y0+H*0.005); g.lineTo(W*0.500, H*S.y1-H*0.005); }, 3);

  // the floor to either side — two short stubs, not a span
  pen.ink(()=>{ g.moveTo(W*0.055, H*S.y1); g.lineTo(W*S.x0, H*S.y1); }, 4);
  pen.ink(()=>{ g.moveTo(W*S.x1, H*S.y1); g.lineTo(W*0.945, H*S.y1); }, 4);

  // pivot sockets, cut into lintel and threshold at each outer edge
  for (const px of [x0+jw*0.22, x1-jw*0.22]){
    pen.paint(()=>{ g.arc(px, H*L.y1-H*0.012, W*0.020, 0, 7); }, toneSolid(inkLevel(params.pegInk)), 2.8);
    pen.paint(()=>{ g.arc(px, H*S.y0+H*0.012, W*0.020, 0, 7); }, toneSolid(inkLevel(params.pegInk)), 2.8);
  }
  return { x0, x1, y0, y1, jw, mid:W*0.500, h:y1-y0, leafW:(x1-x0)/2 };
}

/* one shut leaf. `side` -1 = left (pivots at x0), +1 = right (pivots at x1). */
function leafShut(pen, g, D, side){
  const lx0 = side<0 ? D.x0 : D.mid, lx1 = side<0 ? D.mid : D.x1;
  const w = lx1-lx0, h = D.h, ix = w*0.11, iy = h*0.048;
  pen.paint(()=>{ g.rect(lx0, D.y0, w, h); }, toneSolid(inkLevel(params.leafInk)), 4);
  pen.seam(()=>{ g.rect(lx0+ix, D.y0+iy, w-ix*2, h-iy*2); }, 2.8);
  // vertical plank joints
  for (const u of [0.37,0.63]) pen.seam(()=>{
    g.moveTo(lx0+w*u, D.y0+iy); g.lineTo(lx0+w*u, D.y1-iy); }, 2.4);
  // ONE cross-ledge per leaf, at deliberately different heights left and right,
  // so the pair can never line up into a single bar across the frame
  const v = side<0 ? 0.245 : 0.760;
  pen.paint(()=>{ g.rect(lx0+ix, D.y0+h*v-h*0.013, w-ix*2, h*0.026); },
    toneSolid(inkLevel(params.ledgeInk)), 2.6);
  // pivot pegs on the outer stile
  const px = side<0 ? lx0+w*0.10 : lx1-w*0.10;
  for (const py of [D.y0+h*0.035, D.y1-h*0.035])
    pen.paint(()=>{ g.arc(px, py, w*0.070, 0, 7); }, toneSolid(inkLevel(params.pegInk)), 2.4);
  // the ring handle by the meeting stile
  const rx = side<0 ? lx1-w*0.19 : lx0+w*0.19, ry = D.y0+h*0.610;
  pen.ink(()=>{ g.arc(rx, ry+w*0.13, w*0.135, 0, 7); }, 4.2);
  pen.paint(()=>{ g.arc(rx, ry, w*0.055, 0, 7); }, toneSolid(inkLevel(params.pegInk)), 2.6);
}

/* one leaf swung off its jamb, seen foreshortened. `side` as above. */
function leafSwung(pen, g, D, side){
  const pivotX = side<0 ? D.x0 : D.x1;
  const innerX = side<0 ? D.x0 + D.leafW*0.44 : D.x1 - D.leafW*0.44;
  const h = D.h, lip = h*0.075;
  pen.paint(()=>{
    g.moveTo(pivotX, D.y0);
    g.lineTo(innerX, D.y0+lip);
    g.lineTo(innerX, D.y1-lip);
    g.lineTo(pivotX, D.y1);
    g.closePath();
  }, toneSolid(inkLevel(params.backInk)), 4);
  const mx=(pivotX+innerX)/2;
  pen.seam(()=>{ g.moveTo(mx, D.y0+lip*0.55); g.lineTo(mx, D.y1-lip*0.55); }, 2.6);
  for (const v of [0.31,0.74]) pen.seam(()=>{
    g.moveTo(pivotX, D.y0+h*v); g.lineTo(innerX, D.y0+h*v+lip*0.28); }, 2.4);
  // the ring, now on the swung edge
  pen.ink(()=>{ g.arc(innerX, D.y0+h*0.575, D.leafW*0.055, 0, 7); }, 3.2);
  return innerX;
}

/* the clear opening left when a leaf is swung: paper, a floor line, a far jamb */
function opening(pen, g, W, H, D, gx0, gx1){
  if (gx1-gx0 < W*0.02) return;
  pen.ink(()=>{ g.moveTo(gx0+W*0.006, D.y1-H*0.012); g.lineTo(gx1-W*0.006, D.y1-H*0.012); }, 3.2);
  pen.seam(()=>{ g.moveTo(gx0+W*0.030, D.y0+H*0.030); g.lineTo(gx0+W*0.030, D.y1-H*0.030); }, 2.2);
}

/* the meeting-stile gap between two shut leaves */
function stileGap(pen, g, W, D, dark){
  pen.paint(()=>{ g.rect(D.mid-W*0.0045, D.y0, W*0.009, D.h); },
    toneSolid(inkLevel(dark ? params.gapInk : 2)), 2.2);
}

/* the bolt in its staples, shot across both leaves. Kept SHORT (a third of the
   frame) and thin — it must read as a bar dropped into two staples, never as a
   rule ruled across the picture. */
function boltShot(pen, g, W, H, D){
  const by = H*params.boltY, t = H*0.017;
  const bx0 = D.x0 + D.leafW*0.42, bx1 = D.x1 - D.leafW*0.42;
  // staples first (they sit under the bar)
  for (const sx of [bx0+W*0.026, bx1-W*0.026])
    pen.paint(()=>{ g.rect(sx-W*0.021, by-t*1.7, W*0.042, t*3.4); },
      toneSolid(inkLevel(params.frameInk)), 2.6);
  // the bar — a stubby object with chamfered ends, a third of the frame wide
  pen.paint(()=>{
    g.moveTo(bx0, by-t*0.24);
    g.lineTo(bx0+W*0.014, by-t/2); g.lineTo(bx1-W*0.014, by-t/2);
    g.lineTo(bx1, by-t*0.24); g.lineTo(bx1, by+t*0.24);
    g.lineTo(bx1-W*0.014, by+t/2); g.lineTo(bx0+W*0.014, by+t/2);
    g.lineTo(bx0, by+t*0.24);
    g.closePath();
  }, toneSolid(inkLevel(params.boltInk)), 3);
  return { by, bx0, bx1 };
}

/* the bolt withdrawn and leaning against the left jamb */
function boltParked(pen, g, W, H, D){
  const t=H*0.017;
  // stood on its end inside the doorway, leaning back against the left jamb
  g.save(); g.translate(D.x0+W*0.088, D.y1-H*0.004); g.rotate(-0.18);
  pen.paint(()=>{ g.rect(-t/2, 0, t, -(D.h*0.66)); }, toneSolid(inkLevel(params.boltInk)), 3.2);
  g.restore();
  // the empty staples remain, in the same place the bar left
  for (const sx of [D.x0+D.leafW*0.42+W*0.026, D.x1-D.leafW*0.42-W*0.026])
    pen.paint(()=>{ g.rect(sx-W*0.021, H*params.boltY-H*0.029, W*0.042, H*0.058); },
      toneSolid(inkLevel(0)), 2.6);
}

/* the strap on the jamb hook: loose / knotted over the bar end / cut */
function strap(pen, g, W, H, D, mode){
  const hx = D.x1 + D.jw*0.62, hy = H*(params.boltY-0.082);
  pen.paint(()=>{ g.arc(hx, hy, W*0.016, 0, 7); }, toneSolid(inkLevel(params.pegInk)), 2.6);
  if (mode==="loose"){
    pen.ink(()=>{ g.moveTo(hx, hy+W*0.016);
      g.bezierCurveTo(hx+W*0.030, hy+H*0.050, hx-W*0.026, hy+H*0.078, hx+W*0.008, hy+H*0.118); }, 3.6);
  } else if (mode==="knot"){
    // the cord leaves the jamb hook, SAGS across the gap (a slack catenary — it
    // must never read as a ruled line) and knots over the bar's right end
    const by = H*params.boltY, bx1 = D.x1 - D.leafW*0.42;
    const kx = bx1 + W*0.014, ky = by;
    pen.ink(()=>{ g.moveTo(hx, hy+W*0.016);
      g.quadraticCurveTo((hx+kx)/2, by+H*0.086, kx+W*0.018, ky+H*0.004); }, 3.6);
    pen.paint(()=>{ g.arc(kx, ky, W*0.022, 0, 7); }, toneSolid(inkLevel(params.knotInk)), 3);
    pen.ink(()=>{ g.moveTo(kx-W*0.008, ky+W*0.022); g.lineTo(kx-W*0.024, ky+H*0.048);
                  g.moveTo(kx+W*0.012, ky+W*0.020); g.lineTo(kx+W*0.018, ky+H*0.042); }, 3.2);
  } else { // cut — two short ends, nothing joining them
    pen.ink(()=>{ g.moveTo(hx, hy+W*0.016); g.lineTo(hx-W*0.006, hy+H*0.046); }, 3.6);
    pen.ink(()=>{ g.moveTo(hx-W*0.052, hy+H*0.086); g.lineTo(hx-W*0.030, hy+H*0.120); }, 3.6);
  }
}

/* sound from the other side, arriving at the gap and spreading into the chamber */
function soundArcs(g, W, H, D){
  const cx=D.mid, cy=H*0.372;
  // solid arc SEGMENTS with clean gaps — a dashed stroke this heavy breaks up
  // into blobs in the dot lattice and stops reading as an arc at all
  const SEGS=[[-0.92,-0.40],[-0.22,0.22],[0.40,0.92]];
  g.save(); g.strokeStyle=INK; g.lineCap="butt";
  for (let i=0;i<3;i++){
    const r=W*(0.105+i*0.070); g.lineWidth=7.5-i*1.7;
    for (const [a0,a1] of SEGS){
      g.beginPath(); g.arc(cx, cy, r, a0, a1); g.stroke();
      g.beginPath(); g.arc(cx, cy, r, Math.PI-a1, Math.PI-a0); g.stroke();
    }
  }
  g.restore();
}

/* ---------------- header: door mark · count inside · lock mark ---------------- */

function header(pen, g, W, H, inside, locked){
  const dh=H*params.headH, dy=H*params.headY, cy=dy+dh/2;

  // left mark: the doorway itself, in miniature
  const mx=W*0.098, ms=dh*0.92;
  pen.paint(()=>{ g.rect(mx-ms*0.62, cy-ms*0.60, ms*1.24, ms*0.20); },
    toneSolid(inkLevel(params.frameInk)), 2.6);
  pen.paint(()=>{ g.rect(mx-ms*0.48, cy-ms*0.40, ms*0.96, ms*0.96); },
    toneSolid(inkLevel(params.leafInk)), 2.8);
  pen.paint(()=>{ g.rect(mx-ms*0.05, cy-ms*0.40, ms*0.10, ms*0.96); },
    toneSolid(inkLevel(params.gapInk)), 2);

  // the count of women behind the wood
  segNumber(g, W*0.180, dy, dh, inside, 2);

  // right mark: the lock — shackle down in the body, or lifted clear
  const kx=W*0.905, ks=dh*0.92;
  if (locked) pen.ink(()=>{ g.arc(kx, cy-ks*0.22, ks*0.30, Math.PI*1.02, Math.PI*1.98); }, 4.6);
  else { g.save(); g.translate(kx-ks*0.30, cy-ks*0.22); g.rotate(-0.85);
         pen.ink(()=>{ g.arc(ks*0.30, 0, ks*0.30, Math.PI*1.02, Math.PI*1.98); }, 4.6); g.restore(); }
  pen.paint(()=>{ g.rect(kx-ks*0.46, cy-ks*0.20, ks*0.92, ks*0.66); },
    toneSolid(inkLevel(params.leafInk)), 3);
  pen.paint(()=>{ g.arc(kx, cy+ks*0.10, ks*0.12, 0, 7); },
    toneSolid(inkLevel(locked ? params.boltInk : 0)), 2.4);
}

/* ---------------- the tally rail: one notch per woman shut in ---------------- */

function tally(pen, g, W, H, fill){
  const y=H*params.railY, hh=H*params.railH;
  const groups=[4,4,4], gapW=W*0.030;
  const span=W*0.760 - gapW*(groups.length-1), per=span/params.women;
  let x=W*0.120, idx=0;
  for (const n of groups){
    pen.ink(()=>{ g.moveTo(x+per*0.12, y+hh+H*0.016); g.lineTo(x+per*n-per*0.12, y+hh+H*0.016); }, 2.8);
    for (let i=0;i<n;i++, idx++){
      const st=fill[idx], bw=per*0.68, bx=x+(per-bw)/2;
      if (st==="crossed"){
        g.save(); g.setLineDash([5,5]); g.strokeStyle=INK; g.lineWidth=2.8;
        g.beginPath(); g.rect(bx,y,bw,hh); g.stroke(); g.setLineDash([]);
        g.lineWidth=3.6; g.lineCap="round"; g.beginPath();
        g.moveTo(bx+bw*0.16, y+hh*0.18); g.lineTo(bx+bw*0.84, y+hh*0.82);
        g.moveTo(bx+bw*0.84, y+hh*0.18); g.lineTo(bx+bw*0.16, y+hh*0.82); g.stroke();
        g.restore();
      } else {
        pen.paint(()=>{ g.rect(bx,y,bw,hh); }, toneSolid(inkLevel(st==="in" ? 7 : 0)), 3);
      }
      x+=per;
    }
    x+=gapW;
  }
}

/* ---------------- state table ---------------- */

const MODES = {
  open:      { leafL:"shut",  leafR:"shut",  bolt:"none",   strap:"loose", flow:"none",
               sound:false, gapDark:false, inside:0,  fill:"empty",   locked:false,
               status:"UNBARRED",  progress:0.10 },
  gathered:  { leafL:"shut",  leafR:"swung", bolt:"none",   strap:"loose", flow:"in",
               sound:false, gapDark:false, inside:7,  fill:"partial", locked:false,
               status:"GATHERING", progress:0.36 },
  sealed:    { leafL:"shut",  leafR:"shut",  bolt:"shot",   strap:"knot",  flow:"none",
               sound:false, gapDark:true,  inside:12, fill:"full",    locked:true,
               status:"SEALED",    progress:0.72 },
  listening: { leafL:"shut",  leafR:"shut",  bolt:"shot",   strap:"knot",  flow:"none",
               sound:true,  gapDark:true,  inside:12, fill:"full",    locked:true,
               status:"LISTENING", progress:0.90 },
  release:   { leafL:"swung", leafR:"swung", bolt:"parked", strap:"cut",   flow:"out",
               sound:false, gapDark:false, inside:0,  fill:"crossed", locked:false,
               status:"RELEASED",  progress:1.00 },
};

function fillPattern(kind, n, inside){
  const out=[];
  for (let i=0;i<n;i++){
    if (kind==="crossed") out.push("crossed");
    else if (kind==="full") out.push("in");
    else if (kind==="partial") out.push(i<inside ? "in" : "out");
    else out.push("out");
  }
  return out;
}

/* ---------------- the render ---------------- */

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const M = MODES[st.mode] || MODES.sealed;

  caliper(g, W, H);
  const D = frame(pen, g, W, H);

  // clear opening behind whichever leaves are swung
  let gx0 = M.leafL==="swung" ? D.x0 : D.mid;
  let gx1 = M.leafR==="swung" ? D.x1 : D.mid;
  if (M.leafL==="swung") gx0 = D.x0 + D.leafW*0.44;
  if (M.leafR==="swung") gx1 = D.x1 - D.leafW*0.44;
  opening(pen, g, W, H, D, gx0, gx1);

  // the leaves, outer edges first
  if (M.leafL==="swung") leafSwung(pen, g, D, -1); else leafShut(pen, g, D, -1);
  if (M.leafR==="swung") leafSwung(pen, g, D, +1); else leafShut(pen, g, D, +1);
  if (M.leafL==="shut" && M.leafR==="shut") stileGap(pen, g, W, D, M.gapDark);

  // sound from the hall, arriving at the shut wood
  if (M.sound) soundArcs(g, W, H, D);

  // the bolt and its strap
  if (M.bolt==="shot") boltShot(pen, g, W, H, D);
  else if (M.bolt==="parked") boltParked(pen, g, W, H, D);
  strap(pen, g, W, H, D, M.strap);

  // the traffic through the doorway
  if (M.flow==="in")  arrow(g, gx0-W*0.010, H*0.660, gx1-W*0.014, H*0.660);
  if (M.flow==="out") arrow(g, D.mid, H*0.600, D.mid, H*0.775);

  header(pen, g, W, H, M.inside, M.locked);
  tally(pen, g, W, H, fillPattern(M.fill, params.women, M.inside));
}

/* ---------------- the asset ---------------- */

export const asset = {
  id:"prop.womens-chamber-doors",
  type:"PROP",
  name:"Women's Chamber Doors",
  statusWord:"SEALED",
  scene:"OD-B21-S06",

  params,
  layers:["caliper","lintel","jambs","threshold","pivot-sockets","opening",
          "leaves","meeting-gap","sound","staples","bolt","strap","flow",
          "header","tally-rail"],

  // normalized 0..1 grip / support / contact anchors, measured in SEALED
  anchors:{
    "grip:ring_l":     {x:.448, y:.570},   // a hand on the left leaf's ring
    "grip:ring_r":     {x:.552, y:.570},
    "grip:bolt":       {x:.500, y:.470},   // where Eurycleia takes the bar
    "bolt:staple_l":   {x:.366, y:.470},
    "bolt:staple_r":   {x:.634, y:.470},
    "strap:hook":      {x:.819, y:.388},   // the jamb hook the thong knots to
    "strap:knot":      {x:.648, y:.470},
    "pivot:top_l":     {x:.252, y:.242},   // the pivots the leaves turn on
    "pivot:foot_l":    {x:.252, y:.772},
    "pivot:top_r":     {x:.748, y:.242},
    "pivot:foot_r":    {x:.748, y:.772},
    "threshold:pass":  {x:.500, y:.792},   // where a body crosses
    "contact:floor":   {x:.500, y:.832},   // the doors stand on this
    "listen:gap":      {x:.500, y:.507},   // the meeting stile — sound comes through here
    "support:lintel":  {x:.500, y:.222},
    "count:inside":    {x:.240, y:.107},   // the tally of women behind the wood
    "census:rail":     {x:.500, y:.874},
  },
  // collision: the doorway footprint, jamb to jamb, floor to lintel
  collision:{ kind:"box", a:{x:.154, y:.168}, b:{x:.846, y:.832} },
  scale:{ kind:"architectural", note:"double-leaf interior door, ~2.1 m to the lintel; " +
          "leaves turn on pivots, not hinges — one man can move a leaf, one bar holds both" },
  ownership:"house-of-odysseus · the women's quarters; the bar and strap are Eurycleia's, " +
            "shot on Telemachus' order in Book XXI and drawn again in Book XXII",

  states:{
    initial:"open",
    nodes:{
      open:      { preview:{ mode:"open",      status:"UNBARRED",  progress:0.10 } },
      gathered:  { preview:{ mode:"gathered",  status:"GATHERING", progress:0.36 } },
      sealed:    { preview:{ mode:"sealed",    status:"SEALED",    progress:0.72 } },
      listening: { preview:{ mode:"listening", status:"LISTENING", progress:0.90 } },
      release:   { preview:{ mode:"release",   status:"RELEASED",  progress:1.00 } },
    },
    edges:[
      ["open","gathered"],["gathered","sealed"],["sealed","listening"],
      ["listening","release"],["release","open"],
      ["gathered","open"],["sealed","release"],["listening","sealed"],
    ],
  },
  channels:["mode","inside","t","progress"],

  // CARD SIGNATURE — SEALED: both leaves shut on the pivots, the bar shot through
  // its two staples, the strap knotted to the jamb hook, twelve notches solid.
  // Everything that happens in the hall for the next book happens behind this.
  preview:()=>({ mode:"sealed", status:"SEALED", progress:0.72, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
