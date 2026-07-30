/* prop.courtship-gifts — the gifts Penelope draws out of the suitors in the
   hall (Od. 18.290–303). PROP asset. ONE reusable object that is really a
   small INVENTORY: five individually itemised valuables, each with a named
   donor, a declared physical scale, its own grip/support anchor, and a
   transfer record that survives the scene.

   The list is the single source of truth — every state places the SAME five
   items, so the count and the donor attribution can never drift:
     I    Antinous      · a great embroidered robe, twelve gold brooches
     II   Eurymachus    · a gold chain strung with amber beads
     III  Eurydamas     · a pair of earrings, triple mulberry drops
     IV   Peisander     · a gold collar with graduated pendants
     V    the rest      · a tray of lesser tokens (pin, ring, armlet, cup)

   Scene function (OD-B18-S04) — the five states the beat asks for:
     donor      the five set out, each under a descending leader from its
                giver, the donor numeral called above the gift.
     display    the inventory laid out on its five short plinths, donor
                numeral stamped below each. (initial / preview)
     accept     the same five with the receiver's grip ticks on each, the
                donor numeral arrowed across into a filled owner mark, and
                the accepted count as a seven-segment numeral at the head.
     store      the strong-box open, three already struck down into it, two
                still on the plinth with a stow leader; the stow tally.
     ownership  the later record: five ledger rows, each a thumbnail of the
                same gift, its donor numeral STRUCK, an arrow, and the
                owner lozenge set — the gifts are Penelope's from here on.

   THE LOOK: gold and cloth are LIGHT planes (ink 2), shading one step down,
   and only the small things — brooch pins, bead cores, clasps, straps,
   numerals — go dark. Nothing spans the frame: five short plinths with gaps
   between them, ledger rules that stop under their thumbnail, a chest that
   is under half the width. Numerals are GEOMETRY (seven-segment bars),
   never type. Drawn in SOLID grays + hard contour into the offscreen ctx;
   the engine dotify pass supplies the halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* the frame this module is authored against */
const SRC_W = 660, SRC_H = 880;

/* ---- ink levels: light planes, dark accents, plenty of paper ---- */
const CLOTH    = 2;   // the robe's field — the lightest plane
const CLOTH_SH = 3;   // its shaded fold
const BORDER   = 4;   // the embroidered border band
const GOLD     = 2;   // gold: also a light plane, read by contour not by tone
const GOLD_SH  = 4;   // shaded flank of a gold body
const AMBER    = 3;   // amber bead
const CORE     = 5;   // bead core / clasp / pin shank — the dark accents
const PIN      = 6;   // the brooch pin itself (smallest, darkest)
const PLINTH   = 2;   // plinth top face
const PLINTH_D = 4;   // plinth front lip
const CHEST    = 2;   // strong-box body
const CHEST_D  = 5;   // straps + lock
const HOLLOW   = 5;   // box interior
const NUMERAL  = 5;   // seven-segment donor / count bars

const T = n => toneSolid(inkLevel(n));

/* ================================================================
   THE INVENTORY — the one source of truth for what is being given.
   `parts` is the countable feature of each gift (brooches, beads,
   drops, pendants, tokens); it is what the drawing actually draws.
   ================================================================ */
const GIFTS = [
  { key:"robe",     donor:1, giver:"Antinous",  what:"embroidered robe",   parts:12,
    scale:{ unit:"cm", span:180, mass_g:2400 } },
  { key:"chain",    donor:2, giver:"Eurymachus", what:"gold and amber chain", parts:7,
    scale:{ unit:"cm", span:46,  mass_g:280 } },
  { key:"earrings", donor:3, giver:"Eurydamas",  what:"triple-drop earrings", parts:6,
    scale:{ unit:"cm", span:7,   mass_g:40 } },
  { key:"collar",   donor:4, giver:"Peisander",  what:"gold collar",        parts:7,
    scale:{ unit:"cm", span:24,  mass_g:390 } },
  { key:"tray",     donor:5, giver:"the rest",   what:"lesser tokens",      parts:4,
    scale:{ unit:"cm", span:40,  mass_g:520 } },
];

/* where each gift stands in the DISPLAY layout — two broken rows, so no
   run of plinths ever makes a bar across the frame. */
const CELLS = {
  robe:     { cx:0.290, by:0.395, w:0.330, h:0.265 },
  chain:    { cx:0.735, by:0.395, w:0.285, h:0.200 },
  earrings: { cx:0.200, by:0.800, w:0.215, h:0.190 },
  collar:   { cx:0.505, by:0.800, w:0.245, h:0.155 },
  tray:     { cx:0.805, by:0.800, w:0.250, h:0.135 },
};

const params = {
  count: GIFTS.length,
  brooches: 12,          // Antinous' robe: twelve golden pins with curved clasps
  beads: 7,              // Eurymachus' chain
  drops: 6,              // Eurydamas' earrings, three to a side
  pendants: 7,           // Peisander's collar
  tokens: 4,             // what every other suitor sent
  plinthDepth: 0.020,    // shelf depth as a fraction of H
  collision: "box",
};

/* ---------------- small geometry helpers ---------------- */
function rr(g,x,y,w,h,r){
  r = Math.min(r, Math.abs(w)/2, Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}
function arrow(pen,g,x0,y0,x1,y1,head=13,lw=4){
  pen.ink(()=>{ g.moveTo(x0,y0); g.lineTo(x1,y1); }, lw);
  const a = Math.atan2(y1-y0, x1-x0);
  pen.ink(()=>{
    g.moveTo(x1,y1); g.lineTo(x1-head*Math.cos(a-0.44), y1-head*Math.sin(a-0.44));
    g.moveTo(x1,y1); g.lineTo(x1-head*Math.cos(a+0.44), y1-head*Math.sin(a+0.44));
  }, lw);
}

/* seven-segment numeral drawn as GEOMETRY — never as text */
const SEG = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
              6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };
function drawDigit(pen,g,x,y,w,h,d,level=NUMERAL){
  const t = Math.min(w,h)*0.26, mid = y + h/2;
  const S = {
    a:[x+t*0.6, y,         w-t*1.2, t],
    b:[x+w-t,   y+t*0.5,   t,       h/2-t*0.7],
    c:[x+w-t,   mid+t*0.2, t,       h/2-t*0.7],
    d:[x+t*0.6, y+h-t,     w-t*1.2, t],
    e:[x,       mid+t*0.2, t,       h/2-t*0.7],
    f:[x,       y+t*0.5,   t,       h/2-t*0.7],
    g:[x+t*0.6, mid-t/2,   w-t*1.2, t],
  };
  for (const k of (SEG[d]||"")){
    const [rx,ry,rw,rh] = S[k];
    pen.paint(()=>{ g.rect(rx,ry,rw,rh); }, T(level), 3);
  }
}

/* the owner mark — a lozenge with a bar through it, Penelope's stamp.
   `set` 0 = an empty outline (nobody owns it yet), 1 = struck and filled. */
function drawOwnerMark(pen,g,cx,cy,r,set){
  pen.paint(()=>{
    g.moveTo(cx,cy-r); g.lineTo(cx+r*0.82,cy); g.lineTo(cx,cy+r); g.lineTo(cx-r*0.82,cy); g.closePath();
  }, T(set ? 5 : 1), 4);
  if (set) pen.ink(()=>{ g.moveTo(cx-r*0.42,cy); g.lineTo(cx+r*0.42,cy); }, 4);
}

/* a pair of contact brackets closing on the gift from either side = the
   receiver's hands. Set OUTSIDE the silhouette: inside a gift's own detail
   a bare tick is swallowed and reads as nothing. */
function gripTicks(pen,g,cx,cy,s){
  for (const sx of [-1,1]){
    const x = cx + sx*s, d = s*0.26;
    pen.ink(()=>{ g.moveTo(x, cy-s*0.34); g.lineTo(x, cy+s*0.34); }, 5);
    pen.ink(()=>{ g.moveTo(x, cy-s*0.34); g.lineTo(x-sx*d, cy-s*0.34); }, 5);
    pen.ink(()=>{ g.moveTo(x, cy+s*0.34); g.lineTo(x-sx*d, cy+s*0.34); }, 5);
  }
}

/* ================================================================
   THE FIVE GIFTS — each drawn in the frame (cx, by) with the given
   width/height, standing ON by. Every one of them is a light plane
   with its countable feature as the dark accent.

   LITE is the thumbnail register: at ledger scale the smallest dark
   accents (pin cores, bead cores, clasps, terminals) fall below the
   dot lattice and clot into a black mass, so they are withheld and the
   gift reads by silhouette alone. The count itself is never withheld —
   the ledger prints it as a numeral instead.
   ================================================================ */
let LITE = false;

/* I · ANTINOUS — the great embroidered robe, twelve gold brooches with
   curved clasps down the two front edges of the opening. */
function drawRobe(pen,g,cx,by,w,h){
  const y0 = by-h;
  // the garment silhouette — shoulders, two short sleeve stubs, a neck notch,
  // sides that flare to a scalloped hem. A shape, never a rectangle.
  pen.paint(()=>{
    g.moveTo(cx-w*0.085, y0+h*0.055);
    g.lineTo(cx-w*0.395, y0);
    g.lineTo(cx-w*0.500, y0+h*0.095);
    g.lineTo(cx-w*0.500, y0+h*0.285);
    g.lineTo(cx-w*0.360, y0+h*0.265);
    g.lineTo(cx-w*0.445, by-h*0.010);
    g.quadraticCurveTo(cx-w*0.300, by+h*0.035, cx-w*0.150, by-h*0.010);
    g.quadraticCurveTo(cx,          by+h*0.035, cx+w*0.150, by-h*0.010);
    g.quadraticCurveTo(cx+w*0.300, by+h*0.035, cx+w*0.445, by-h*0.010);
    g.lineTo(cx+w*0.360, y0+h*0.265);
    g.lineTo(cx+w*0.500, y0+h*0.285);
    g.lineTo(cx+w*0.500, y0+h*0.095);
    g.lineTo(cx+w*0.395, y0);
    g.lineTo(cx+w*0.085, y0+h*0.055);
    g.quadraticCurveTo(cx, y0+h*0.135, cx-w*0.085, y0+h*0.055);
    g.closePath();
  }, T(CLOTH), 4.5);
  // one soft fold — a tapered wedge, not a stripe
  pen.paint(()=>{
    g.moveTo(cx+w*0.325, y0+h*0.300); g.lineTo(cx+w*0.375, y0+h*0.310);
    g.lineTo(cx+w*0.415, by-h*0.060); g.lineTo(cx+w*0.325, by-h*0.055); g.closePath();
  }, T(CLOTH_SH), 0);
  // the embroidered hem band, inset from the scalloped edge
  const bh = h*0.105, byd = by - h*0.185;
  pen.paint(()=>{ g.rect(cx-w*0.365, byd, w*0.730, bh); }, T(LITE?CLOTH_SH:BORDER), 3.5);
  if (!LITE){ const n = 5, sw = bh*0.50, pitch = (w*0.730 - sw*1.3)/(n-1);
    for (let i=0;i<n;i++)
      pen.paint(()=>{ g.rect(cx-w*0.365+sw*0.65+i*pitch-sw/2, byd+bh*0.25, sw, sw); }, T(1), 2.5); }
  // cuff bands on the sleeve stubs
  for (const sx of [-1,1])
    pen.paint(()=>{ g.rect(cx+sx*w*0.500-(sx<0?0:w*0.075), y0+h*0.185, w*0.075, h*0.085); },
              T(LITE?CLOTH_SH:BORDER), 3);
  // TWELVE gold brooches with curved clasps — six down each edge of the opening
  const rows = 6, r = w*0.043;
  for (let i=0;i<rows;i++){
    const yb = y0 + h*(0.190 + i*0.122);          // pitch clears the ring twice over
    for (const sx of [-1, 1]){
      const bx = cx + sx*w*0.170;
      pen.paint(()=>{ g.ellipse(bx, yb, r, r, 0,0,7); }, T(GOLD), LITE?2.5:3.5);
      if (LITE) continue;
      pen.paint(()=>{ g.ellipse(bx, yb, r*0.40, r*0.40, 0,0,7); }, T(PIN), 2.5);
      // the curved clasp, thrown OUTWARD so it never bridges to the next brooch
      pen.ink(()=>{ g.ellipse(bx + sx*r*0.95, yb, r*0.75, r*0.75, 0,
                              sx<0 ? 0.55 : Math.PI-0.55, sx<0 ? Math.PI*1.45 : Math.PI*2.55); }, 3.5);
    }
  }
}

/* II · EURYMACHUS — a chain of gold strung with amber, hung between two
   short posts so the sag is readable and the beads are countable. */
function drawChain(pen,g,cx,by,w,h){
  const px = w*0.42, topY = by - h*0.92, sag = h*0.52;
  // the two posts (short, separate — no bar across)
  for (const sx of [-1,1]){
    const x = cx + sx*px;
    pen.paint(()=>{ g.rect(x-w*0.030, topY, w*0.060, by-topY); }, T(GOLD_SH), 4);
    pen.paint(()=>{ rr(g, x-w*0.062, topY-h*0.075, w*0.124, h*0.085, w*0.02); }, T(GOLD), 3.5);
  }
  // catenary
  const P = u => ({ x: cx + lerp(-px, px, u), y: topY + sag*(1 - Math.cos((u-0.5)*Math.PI*1.34)/Math.cos(0.67*Math.PI*0.0)) });
  const curve = u => ({ x: cx + lerp(-px, px, u), y: topY + sag*4*u*(1-u) });
  pen.ink(()=>{
    g.moveTo(cx-px, topY);
    for (let i=1;i<=24;i++){ const p = curve(i/24); g.lineTo(p.x, p.y); }
  }, 4);
  // the beads, evenly told off along the curve
  const n = params.beads, r = w*0.062;
  for (let i=0;i<n;i++){
    const u = (i+0.5)/n, p = curve(u);
    pen.paint(()=>{ g.ellipse(p.x, p.y, r, r*1.06, 0,0,7); }, T(AMBER), LITE?2.5:3.5);
    if (LITE) continue;
    pen.paint(()=>{ g.ellipse(p.x - r*0.28, p.y - r*0.3, r*0.30, r*0.30, 0,0,7); }, T(CORE), 2);
    // the gold link that carries it
    if (i < n-1){
      const q = curve((i+1.5)/n);
      pen.ink(()=>{ g.moveTo((p.x+q.x)/2 - r*0.22, (p.y+q.y)/2); g.lineTo((p.x+q.x)/2 + r*0.22, (p.y+q.y)/2); }, 4.5);
    }
  }
  void P;
}

/* III · EURYDAMAS — a pair of earrings, three mulberry drops to a side,
   hung from a small stand so both of the pair are countable. */
function drawEarrings(pen,g,cx,by,w,h){
  const barY = by - h*0.86;
  // the stand: a post and a SHORT crossbar
  pen.paint(()=>{ g.rect(cx-w*0.045, barY, w*0.090, by-barY); }, T(GOLD_SH), 4);
  pen.paint(()=>{ rr(g, cx-w*0.34, barY-h*0.055, w*0.68, h*0.070, w*0.02); }, T(GOLD), 3.5);
  pen.paint(()=>{ g.ellipse(cx, by, w*0.24, h*0.045, 0,0,7); }, T(GOLD_SH), 4);
  const dr = w*0.098;
  for (const sx of [-1,1]){
    const hx = cx + sx*w*0.245;
    // the hook
    pen.ink(()=>{ g.moveTo(hx, barY+h*0.015); g.lineTo(hx, barY+h*0.150); }, 4);
    if (!LITE) pen.paint(()=>{ g.ellipse(hx, barY+h*0.195, dr*0.42, dr*0.42, 0,0,7); }, T(CORE), 3);
    // the triple mulberry cluster
    const cy = barY + h*0.40;
    const trio = [ {x:-dr*0.86, y:-dr*0.10}, {x: dr*0.86, y:-dr*0.10}, {x:0, y: dr*1.02} ];
    pen.ink(()=>{ g.moveTo(hx, barY+h*0.22); g.lineTo(hx, cy-dr*0.6); }, 4);
    for (const t of trio){
      pen.paint(()=>{ g.ellipse(hx+t.x, cy+t.y, dr, dr, 0,0,7); }, T(GOLD), LITE?3:4);
      if (!LITE) pen.paint(()=>{ g.ellipse(hx+t.x-dr*0.26, cy+t.y-dr*0.28, dr*0.28, dr*0.28, 0,0,7); }, T(CORE), 2);
    }
  }
}

/* IV · PEISANDER — a gold collar, a rigid U-band with graduated pendants. */
function drawCollar(pen,g,cx,by,w,h){
  const cy = by - h*0.98, rx = w*0.44, ry = h*0.50, bw = 0.30;
  const band = (a0,a1)=>{
    g.moveTo(cx+rx*Math.cos(a0), cy+ry*Math.sin(a0));
    for (let i=1;i<=22;i++){ const a=lerp(a0,a1,i/22); g.lineTo(cx+rx*Math.cos(a), cy+ry*Math.sin(a)); }
    for (let i=22;i>=0;i--){ const a=lerp(a0,a1,i/22);
      g.lineTo(cx+rx*(1-bw)*Math.cos(a), cy+ry*(1-bw)*Math.sin(a)); }
    g.closePath();
  };
  const A0 = 0.16*Math.PI, A1 = 0.84*Math.PI;
  // the pendants hang from the outer edge — draw them first, behind the band
  const n = params.pendants;
  for (let i=0;i<n;i++){
    const u = (i+0.5)/n, a = lerp(A0, A1, u);
    const grade = 0.40 + 0.60*Math.sin(u*Math.PI);        // longest at the low point
    const ox = cx + rx*Math.cos(a), oy = cy + ry*Math.sin(a);
    const pl = h*0.40*grade, pw = w*0.052;
    pen.paint(()=>{
      g.moveTo(ox-pw*0.5, oy); g.lineTo(ox+pw*0.5, oy);
      g.lineTo(ox+pw*0.30, oy+pl); g.lineTo(ox-pw*0.30, oy+pl); g.closePath();
    }, T(GOLD), LITE?2.5:3.5);
    if (!LITE) pen.paint(()=>{ g.ellipse(ox, oy+pl+pw*0.34, pw*0.42, pw*0.42, 0,0,7); }, T(CORE), 2.5);
  }
  // the band itself
  pen.paint(()=>{ band(A0,A1); }, T(GOLD), 4.5);
  // a single shaded lip at the low point — light, and nowhere near the ends,
  // where a fill would print as a pair of dark vertical bars
  pen.paint(()=>{ band(Math.PI/2-0.34, Math.PI/2+0.34); }, T(CLOTH_SH), 0);
  // the two clasp terminals
  if (!LITE) for (const a of [A0, A1])
    pen.paint(()=>{ g.ellipse(cx+rx*(1-bw/2)*Math.cos(a), cy+ry*(1-bw/2)*Math.sin(a),
                              w*0.045, w*0.045, 0,0,7); }, T(CORE), 3);
}

/* V · THE REST — a shallow tray of lesser tokens: a spiral armlet, a
   finger ring, a long pin, a small cup. Four, and they stay four. */
function drawTray(pen,g,cx,by,w,h){
  const ty = by - h*0.26;
  // the tray: a shallow open dish on two short feet — the feet break the span
  // so tray + plinth never stack into a run of bars
  for (const sx of [-1,1])
    pen.paint(()=>{ g.rect(cx+sx*w*0.29-w*0.04, by-h*0.09, w*0.08, h*0.09); }, T(GOLD_SH), 3);
  pen.paint(()=>{
    g.moveTo(cx-w*0.50, ty); g.lineTo(cx+w*0.50, ty);
    g.lineTo(cx+w*0.39, by-h*0.09); g.lineTo(cx-w*0.39, by-h*0.09); g.closePath();
  }, T(GOLD), 4.5);
  // a short shaded well, light, kept well inside the rim
  pen.paint(()=>{ g.rect(cx-w*0.20, ty+h*0.055, w*0.40, h*0.055); }, T(CLOTH_SH), 0);
  const iy = ty - h*0.04;
  // 1 · spiral armlet
  const ax = cx - w*0.335;
  for (let k=0;k<3;k++)
    pen.ink(()=>{ g.ellipse(ax, iy-h*0.20, w*(0.075-k*0.020), h*(0.20-k*0.055), 0, 0.25, Math.PI*1.9); }, 4);
  // 2 · finger ring
  const rxp = cx - w*0.115;
  pen.paint(()=>{ g.ellipse(rxp, iy-h*0.17, w*0.070, h*0.19, 0,0,7); }, T(GOLD), 4);
  if (!LITE) pen.paint(()=>{ g.ellipse(rxp, iy-h*0.17, w*0.036, h*0.10, 0,0,7); }, T(1), 3);
  // 3 · long pin
  const px = cx + w*0.115;
  pen.ink(()=>{ g.moveTo(px, iy-h*0.02); g.lineTo(px+w*0.030, iy-h*0.40); }, 5);
  pen.paint(()=>{ g.ellipse(px+w*0.034, iy-h*0.44, w*0.048, w*0.048, 0,0,7); }, T(GOLD), 3.5);
  // 4 · small cup
  const cxp = cx + w*0.340;
  pen.paint(()=>{
    g.moveTo(cxp-w*0.085, iy-h*0.42); g.lineTo(cxp+w*0.085, iy-h*0.42);
    g.lineTo(cxp+w*0.045, iy-h*0.09); g.lineTo(cxp-w*0.045, iy-h*0.09); g.closePath();
  }, T(GOLD), 4);
  pen.paint(()=>{ g.ellipse(cxp, iy-h*0.42, w*0.085, h*0.045, 0,0,7); }, T(LITE?GOLD_SH:CORE), 3);
  if (!LITE) pen.paint(()=>{ g.ellipse(cxp, iy-h*0.05, w*0.062, h*0.038, 0,0,7); }, T(GOLD_SH), 3);
}

const DRAW = { robe:drawRobe, chain:drawChain, earrings:drawEarrings,
               collar:drawCollar, tray:drawTray };
function drawGift(pen,g,key,cx,by,w,h,lite=false){
  LITE = !!lite; DRAW[key](pen,g,cx,by,w,h); LITE = false;
}

/* the short shelf each gift is set out on — five of them, with gaps */
function drawPlinth(pen,g,W,H,cx,by,w){
  const pw = w*0.94, ph = H*params.plinthDepth;
  pen.paint(()=>{ g.rect(cx-pw/2, by, pw, ph); }, T(PLINTH), 4);
  // two short legs rather than a lip: the shelf never reads as a solid bar
  for (const sx of [-1,1])
    pen.paint(()=>{ g.rect(cx+sx*pw*0.34-pw*0.05, by+ph, pw*0.10, ph*0.85); }, T(PLINTH_D), 3);
}

/* ================================================================
   THE STRONG-BOX (store) — well under half the frame's width.
   ================================================================ */
function drawChestLid(pen,g,W,H,cx,by,cw,ch,lid){
  const topY = by - ch;
  // the lid stood back on its hinges — a leaning slab, not a swung arm, so it
  // never sweeps across the gifts being struck down into the box
  const lean = cw*0.11*lid, lh = ch*0.92*lid + ch*0.06;
  pen.paint(()=>{
    g.moveTo(cx-cw/2, topY); g.lineTo(cx+cw/2, topY);
    g.lineTo(cx+cw/2-lean, topY-lh); g.lineTo(cx-cw/2-lean, topY-lh); g.closePath();
  }, T(CHEST), 5);
  for (const u of [0.20, 0.80])
    pen.paint(()=>{
      const xb = cx-cw/2+cw*u;
      g.moveTo(xb-9, topY); g.lineTo(xb+9, topY);
      g.lineTo(xb+9-lean, topY-lh); g.lineTo(xb-9-lean, topY-lh); g.closePath();
    }, T(CHEST_D), 2.5);
  // the dark mouth behind the front wall
  pen.paint(()=>{ g.rect(cx-cw/2+12, topY-16, cw-24, 22); }, T(HOLLOW), 3);
  return { cx, topY, cw, ch, by };
}
function drawChestFront(pen,g,W,H,K){
  pen.paint(()=>{ rr(g, K.cx-K.cw/2, K.topY, K.cw, K.ch, 10); }, T(CHEST), 5);
  for (const sx of [-0.38, 0.38])
    pen.paint(()=>{ g.rect(K.cx+K.cw*sx-9, K.topY, 18, K.ch); }, T(CHEST_D), 3);
  // the lock plate — small, and the only really dark thing on the box
  pen.paint(()=>{ rr(g, K.cx-15, K.topY+K.ch*0.30, 30, K.ch*0.34, 6); }, T(CHEST_D), 3);
  pen.paint(()=>{ g.ellipse(K.cx, K.topY+K.ch*0.47, 6, 6, 0,0,7); }, T(1), 2.5);
}

/* the stow tally: `done` of five slots struck */
function drawTally(pen,g,W,H,x,y,done,n=GIFTS.length){
  const s = 22, gap = 12;
  for (let i=0;i<n;i++){
    const bx = x + i*(s+gap);
    pen.paint(()=>{ g.rect(bx, y, s, s); }, T(i<done ? 5 : 1), 4);
  }
}

/* a count printed as seven-segment geometry: tens then units */
function drawCount(pen,g,x,y,dw,dh,v){
  const t = Math.floor(v/10), u = v%10;
  if (t) drawDigit(pen,g, x, y, dw, dh, t);
  drawDigit(pen,g, x+dw*1.35, y, dw, dh, u);
}

/* ================================================================
   STATE PAINTERS
   ================================================================ */
function paintDisplay(pen,g,W,H,st){
  const showTag   = st.tag !== false;
  const fromAbove = !!st.leaders;      // donor state: the giver's hand-off
  const owned     = !!st.owned;        // accept state
  for (const gift of GIFTS){
    const C = CELLS[gift.key];
    const cx = W*C.cx, by = H*C.by, w = W*C.w, h = H*C.h;
    drawPlinth(pen,g,W,H,cx,by,w);
    drawGift(pen,g,gift.key,cx,by,w,h);

    if (fromAbove){
      // the giver's leader coming down onto the gift. The tallest cell reaches
      // to y=.130, so the leader is a fixed short run clamped under the card
      // label band — a numeral stacked above it would print off the sheet.
      const y1 = Math.max(by - h - H*0.022, H*0.112), y0 = y1 - H*0.050;
      arrow(pen,g,cx,y0,cx,y1);
      pen.ink(()=>{ g.moveTo(cx-W*0.022, y0); g.lineTo(cx+W*0.022, y0); }, 5);
    }
    if (showTag){
      const ty = by + H*0.052;
      drawDigit(pen,g, cx-W*0.052, ty, W*0.046, H*0.052, gift.donor, NUMERAL);
      if (owned){
        arrow(pen,g, cx+W*0.006, ty+H*0.026, cx+W*0.056, ty+H*0.026, 11, 4);
        drawOwnerMark(pen,g, cx+W*0.092, ty+H*0.026, W*0.028, 1);
      }
    }
    if (owned){
      // the receiver's hands closing on the gift, just clear of its edges
      gripTicks(pen,g, cx, by - h*0.50, w*0.56);
    }
  }
  if (owned){
    // the accepted count at the head of the sheet
    drawDigit(pen,g, W*0.470, H*0.062, W*0.048, H*0.058, GIFTS.length, NUMERAL);
    drawOwnerMark(pen,g, W*0.432, H*0.091, W*0.022, 1);
  }
}

function paintStore(pen,g,W,H,st){
  const done = clamp(st.stowed ?? 3, 0, GIFTS.length);
  const cx = W*0.375, by = H*0.830, cw = W*0.470, ch = H*0.225;
  const K = drawChestLid(pen,g,W,H,cx,by,cw,ch, st.lid ?? 0.9);
  // the gifts already struck down into the box — each stands in it, half clear
  // of the rim, so which three have gone in is still readable. Thumbnail
  // register: at this size the fine dark accents would clot.
  const inside = [
    { key:"robe",   cx:cx-cw*0.310, w:W*0.150, h:H*0.275 },
    { key:"collar", cx:cx+cw*0.005, w:W*0.150, h:H*0.215 },
    { key:"chain",  cx:cx+cw*0.320, w:W*0.145, h:H*0.220 },
  ].slice(0, Math.min(done,3));
  for (const it of inside) drawGift(pen,g,it.key, it.cx, K.topY + H*0.060, it.w, it.h, true);
  drawChestFront(pen,g,W,H,K);
  // the two still waiting on their plinths, and the stow leader into the mouth
  const wx = W*0.840;
  drawPlinth(pen,g,W,H, wx, H*0.545, W*0.200);
  drawGift(pen,g,"earrings", wx, H*0.545, W*0.180, H*0.165);
  drawPlinth(pen,g,W,H, wx, H*0.845, W*0.200);
  drawGift(pen,g,"tray", wx, H*0.845, W*0.195, H*0.115);
  arrow(pen,g, W*0.745, H*0.630, W*0.640, H*0.660, 18, 6);
  // the running tally + the owner mark at the head of the sheet
  drawTally(pen,g,W,H, W*0.300, H*0.130, done);
  drawOwnerMark(pen,g, W*0.235, H*0.147, W*0.030, 1);
}

function paintOwnership(pen,g,W,H,st){
  const rows = [0.245, 0.390, 0.535, 0.680, 0.825];
  const set  = clamp(st.transferred ?? GIFTS.length, 0, GIFTS.length);
  GIFTS.forEach((gift,i)=>{
    const ry = H*rows[i];
    const C  = CELLS[gift.key];
    const th = H*0.100, tw = W*(C.w*0.72);
    drawGift(pen,g,gift.key, W*0.185, ry, tw, th, true);   // LITE: silhouette register
    // a rule that stops under its own thumbnail — never a bar across
    pen.ink(()=>{ g.moveTo(W*0.185-tw*0.58, ry+H*0.012); g.lineTo(W*0.185+tw*0.58, ry+H*0.012); }, 5);
    // donor numeral, STRUCK once the gift has changed hands
    const dx = W*0.400, dy = ry - H*0.050;
    drawDigit(pen,g, dx, dy, W*0.046, H*0.054, gift.donor, NUMERAL);
    if (i < set){
      pen.ink(()=>{ g.moveTo(dx-W*0.014, dy+H*0.052); g.lineTo(dx+W*0.060, dy-H*0.006); }, 5);
      arrow(pen,g, W*0.490, ry-H*0.023, W*0.575, ry-H*0.023, 12, 4);
    }
    drawOwnerMark(pen,g, W*0.645, ry-H*0.023, W*0.032, i<set ? 1 : 0);
    // the itemised count of this gift's parts, kept on the record as geometry
    drawCount(pen,g, W*0.760, ry-H*0.050, W*0.046, H*0.054, gift.parts);
  });
}

/* ================================================================
   DRAW
   ================================================================ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx, { outline:true });
  const mode = st.mode || "display";
  if (mode === "store")      return paintStore(pen,ctx,W,H,st);
  if (mode === "ownership")  return paintOwnership(pen,ctx,W,H,st);
  return paintDisplay(pen,ctx,W,H,st);
}

/* ---- anchors computed from the authored layout so they cannot drift ---- */
const ANCHORS = (()=>{
  const A = {};
  for (const gift of GIFTS){
    const C = CELLS[gift.key];
    A[`grip:${gift.key}`]    = { x:+C.cx.toFixed(3), y:+(C.by - C.h*0.52).toFixed(3) };
    A[`support:${gift.key}`] = { x:+C.cx.toFixed(3), y:+C.by.toFixed(3) };
    A[`mark:donor-${gift.donor}`] = { x:+(C.cx-0.030).toFixed(3), y:+(C.by+0.078).toFixed(3) };
  }
  A["contact:giver-hand"]    = { x:0.500, y:0.150 };   // where the suitors' heralds set them down
  A["contact:receiver-hand"] = { x:0.500, y:0.455 };   // where Penelope takes them
  A["stow:chest"]            = { x:0.385, y:0.610 };   // the strong-box mouth in `store`
  A["mark:ledger"]           = { x:0.690, y:0.495 };   // the owner column in `ownership`
  return A;
})();

const BOUNDS = { x0:0.065, y0:0.055, x1:0.940, y1:0.905 };

export const asset = {
  id:"prop.courtship-gifts",
  type:"PROP",
  name:"Courtship Gifts",
  statusWord:"DISPLAYED",
  scene:"OD-B18-S04",

  params,
  // the itemised list travels with the asset — this is what makes it an inventory
  inventory: GIFTS.map(gi=>({ key:gi.key, donor:gi.donor, giver:gi.giver,
                              what:gi.what, parts:gi.parts, scale:gi.scale })),

  // back -> front draw order the module honors
  layers:["plinths","chest-lid","chest-interior","stowed-gifts","chest-front",
          "cloth","gold-bodies","shading","borders","beads-and-drops",
          "pins-and-clasps","grip-ticks","leaders","donor-numerals",
          "owner-marks","tally"],

  anchors: ANCHORS,
  collision:{ kind:"box", bounds:BOUNDS },
  zones:{
    bounds: BOUNDS,
    display:{ x0:0.065, y0:0.140, x1:0.940, y1:0.905 },   // the two plinth rows
    stow:{ x0:0.170, y0:0.560, x1:0.600, y1:0.800 },      // the strong-box footprint
  },
  // ownership is the point of this prop: it changes hands inside the scene
  ownership:{
    kind:"courtship-gifts",
    givers:GIFTS.map(gi=>gi.giver),
    receiver:"Penelope",
    initialOwner:"the suitors",
    finalOwner:"Penelope",
    steward:"the handmaids (carried up to the chamber)",
    transferable:true,
    transferState:"accept",     // the state on which title moves
  },

  states:{
    initial:"display",
    nodes:{
      donor:     { preview:{ mode:"display", leaders:true,
                             status:"OFFERED",   progress:0.16 } },
      display:   { preview:{ mode:"display",
                             status:"DISPLAYED", progress:0.34 } },
      accept:    { preview:{ mode:"display", owned:true,
                             status:"ACCEPTED",  progress:0.58 } },
      store:     { preview:{ mode:"store", stowed:3, lid:0.85,
                             status:"STOWED",    progress:0.80 } },
      ownership: { preview:{ mode:"ownership", transferred:5,
                             status:"PENELOPE'S",progress:1.00 } },
    },
    edges:[
      ["donor","display"],["display","accept"],["accept","store"],
      ["store","ownership"],["ownership","store"],["display","donor"],
      ["accept","display"],["display","ownership"],["ownership","display"],
    ],
  },
  channels:["mode","leaders","owned","stowed","lid","transferred","t"],

  preview:()=>({ mode:"display", t:0, status:"DISPLAYED", progress:0.34 }),
  draw(ctx,W,H,state){
    drawProp(ctx,W,H,state||{});
    return { anchors:asset.anchors, zones:asset.zones, ownership:asset.ownership,
             inventory:asset.inventory };
  },
};
export default asset;
