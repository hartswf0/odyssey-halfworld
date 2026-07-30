/* divine_fx.ithacan-peace-oath — the closing state of the poem drawn not as a
   grant handed DOWN but as a covenant struck ACROSS: a binding RECIPROCAL state
   sworn between the house of Odysseus and the kin of the dead suitors.
   DIVINE_FX asset. Scene function (OD-B24-S09).

   Where `divine_fx.peace-decree` is vertical — one seal at the top, authority
   descending a spine into five clauses — this effect is MIRRORED about a centre
   spine, because the thing it renders is mutual. Nothing binds one side that does
   not bind the other.

     PARTIES (source, top)   Two sworn discs face each other: LEFT the RULER
                             (a crown block in the aperture), RIGHT the FAMILIES
                             (three household marks). Broken yoke beams fall
                             inward from both discs to a single OATH KNOT at
                             centre — two square hooks that slide together and
                             INTERLOCK as `bind` closes. That knot is the oath.

     RECIPROCITY LADDER      Three rungs, each a matched PAIR of plates, one per
     (field, middle)         side, carrying an outer glyph, a counted index in
                             square pips (geometry, never small type), a broken
                             extent measure and an arrowhead aimed at the spine:
                               I   crown  <-> raised hand   (rule <-> allegiance)
                               II  house  <-> house         (both houses kept)
                               III jar    <-> broken spear  (goods <-> arms down)
                             When a rung takes, a solid LINK stamps across the
                             centre gap and the two arrowheads become one bar.

     MEMORY SUPPRESSION      A pale plate, offset LEFT so it cannot stripe the
     (transformation)        frame: a tally field of grievance strokes — the
                             count of the killed — swept blank left-to-right by a
                             FORGETTING FRONT, its residue dissolving into a few
                             shrinking dots. A suppression seal at the plate's
                             right end stamps solid when the tally is gone.

     FUTURE ABUNDANCE        The visible CONSEQUENCE, offset RIGHT: a rank of
     (consequence, bottom)   stepped stores rising off a BROKEN ground rule, their
                             tops traced by a climbing step outline, with a
                             generation count in square pips at the left of the
                             band and a forward chevron: the state binds onward.

   Procedural over state.t + intensity, bind, link, forget, abundance:
     SOURCE   (low)  — discs apart, hooks open, ladder blank, tally full, stores flat.
     TARGET   (mid)  — the hooks close on the knot, the first rung links.
     FIELD    (high) — rungs link one by one, the forgetting front runs.
     TRANSFORM(full) — knot interlocked, all rungs linked, tally blank, stores full. SWORN.
   `bind`     : how far the two hooks have slid together and gripped.
   `link`     : how many of the three rungs have stamped their centre link (link*3).
   `forget`   : how far the forgetting front has swept the grievance tally.
   `abundance`: how far the future stores have risen.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. Kept deliberately
   LIGHT — paper-dominant, pale plates, dark only in the discs, the knot, the pips,
   the seals and the stamped links — and NO span crosses the frame: every plate is
   staggered per row and every long rule is drawn as a broken run. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* the three reciprocal rungs, top to bottom. Each row carries its own outer
   extents per side so the ladder is staggered and never stripes the frame. */
const RUNGS = [
  { key:"rule",        lGlyph:"crown", rGlyph:"hand",  y:0.345, lx0:0.176, rx1:0.806 },
  { key:"households",  lGlyph:"house", rGlyph:"house", y:0.442, lx0:0.112, rx1:0.868 },
  { key:"restitution", lGlyph:"jar",   rGlyph:"spear", y:0.539, lx0:0.208, rx1:0.822 },
];

const params = {
  rungs:    RUNGS,
  spineX:   0.500,   // the reciprocity spine — the axis the oath mirrors about
  discCy:   0.112,   // sworn party discs
  discR:    0.058,   // disc radius, frac of W
  discL:    0.242,   // RULER disc centre x
  discR2:   0.758,   // FAMILIES disc centre x
  knotCy:   0.226,   // the oath knot, on the spine
  knotS:    0.058,   // hook size, frac of W
  rowH:     0.068,   // rung plate height, frac of H
  glyphS:   0.076,   // outer glyph box side, frac of W
  gapIn:    0.038,   // half-width of the centre gap the link stamps across
  memory:   { x0:0.104, x1:0.566, y0:0.616, y1:0.734 },  // suppression plate
  yieldBand:{ x0:0.400, x1:0.908, y:0.888 },             // abundance ground
  genPips:  3,
  intensity:1.0,
};

/* ---------- small geometry helpers ---------- */
function rectPath(g,x,y,w,h){ g.rect(x,y,w,h); }
/* a broken horizontal run — never one continuous bar */
function dashRun(g,x0,x1,y,seg,gap){
  let x=x0; while(x<x1){ const e=Math.min(x+seg,x1); g.moveTo(x,y); g.lineTo(e,y); x=e+gap; }
}
/* a broken vertical run */
function dashCol(g,x,y0,y1,seg,gap){
  let y=y0; while(y<y1){ const e=Math.min(y+seg,y1); g.moveTo(x,y); g.lineTo(x,e); y=e+gap; }
}
/* a straight span cut in its middle third, so no beam reads as a solid stripe */
function brokenSpan(g,x0,y0,x1,y1){
  const a=0.42, b=0.58;
  g.moveTo(x0,y0); g.lineTo(lerp(x0,x1,a), lerp(y0,y1,a));
  g.moveTo(lerp(x0,x1,b), lerp(y0,y1,b)); g.lineTo(x1,y1);
}
/* a pale plate whose long edges are BROKEN runs — a bounded field, never a slab
   with a continuous rule across the frame */
function brokenPlate(g,x,y,w,h,level,seg,gap){
  g.fillStyle=inkLevel(level); g.fillRect(x,y,w,h);
  g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="butt"; g.lineJoin="miter";
  g.beginPath();
  dashRun(g,x,x+w,y,seg,gap);
  dashRun(g,x,x+w,y+h,seg,gap);
  g.moveTo(x,y);     g.lineTo(x,y+h);
  g.moveTo(x+w,y);   g.lineTo(x+w,y+h);
  g.stroke();
}
/* a punched white slot carrying n solid square pips — counted GEOMETRY, so the
   index never depends on type small enough to dissolve in the dot lattice */
function pipSlot(pen,g,x,y,w,h,n){
  pen.paint(()=>{ rectPath(g,x,y,w,h); }, toneSolid(inkLevel(0)), 2.8);
  const p=Math.min(h*0.44, (w*0.80)/(n*1.6));
  const run=n*p+(n-1)*p*0.6, x0=x+(w-run)/2, cy=y+h/2;
  g.fillStyle=inkLevel(7);
  for(let i=0;i<n;i++) g.fillRect(x0+i*p*1.6, cy-p/2, p, p);
}

/* ---------- SOURCE: the two sworn party discs ---------- */
function discRuler(pen,g,cx,cy,r){          // a crown block: the house that rules
  const s=r*0.98, x=cx-s/2, y=cy-s*0.36;
  pen.paint(()=>{
    g.moveTo(x, y+s*0.62); g.lineTo(x, y+s*0.16);
    g.lineTo(x+s*0.25, y+s*0.40); g.lineTo(x+s*0.50, y);
    g.lineTo(x+s*0.75, y+s*0.40); g.lineTo(x+s, y+s*0.16);
    g.lineTo(x+s, y+s*0.62); g.closePath();
  }, toneSolid(inkLevel(5)), 2.6);
}
function discFamilies(pen,g,cx,cy,r){       // three household marks: the kin
  const w=r*0.26, h=r*0.44, y=cy+r*0.30;
  for(let i=-1;i<=1;i++){
    const x=cx+i*r*0.46-w/2;
    pen.paint(()=>{ rectPath(g,x,y-h,w,h); }, toneSolid(inkLevel(5)), 2.4);
    pen.paint(()=>{
      g.moveTo(x-w*0.20, y-h); g.lineTo(x+w*1.20, y-h);
      g.lineTo(x+w*0.50, y-h*1.55); g.closePath();
    }, toneSolid(inkLevel(3)), 2.2);
  }
}
function drawDisc(pen,g,W,H,cx,cy,r,kind,t,inten){
  pen.ink(()=>{ g.arc(cx,cy,r*1.36,0,TAU); }, 2.2);              // sworn boundary
  pen.paint(()=>{ g.arc(cx,cy,r,0,TAU); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.arc(cx,cy,r*0.66,0,TAU); }, toneSolid(inkLevel(1)), 3);
  (kind==="ruler"?discRuler:discFamilies)(pen,g,cx,cy,r*0.62);
  g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";         // sworn notches
  const n=10, wob=Math.sin(t*0.6)*0.02;
  for(let i=0;i<n;i++){
    const th=i/n*TAU+wob;
    g.beginPath();
    g.moveTo(cx+Math.cos(th)*r*0.74, cy+Math.sin(th)*r*0.74);
    g.lineTo(cx+Math.cos(th)*r*0.96, cy+Math.sin(th)*r*0.96);
    g.stroke();
  }
}
function drawParties(pen,g,W,H,t,inten){
  const cy=H*params.discCy, r=W*params.discR;
  drawDisc(pen,g,W,H,W*params.discL, cy,r,"ruler",   t,inten);
  drawDisc(pen,g,W,H,W*params.discR2,cy,r,"families",t,inten);
}

/* ---- the YOKE: broken beams falling inward from both discs to the knot. Each
   is a double rule cut in its middle third — no unbroken span. ---- */
function drawYoke(pen,g,W,H){
  const cy=H*params.discCy, r=W*params.discR;
  const kx=W*params.spineX, ky=H*params.knotCy, s=W*params.knotS;
  const d=W*0.008;
  for(const side of [-1,1]){
    // inner side of the disc: for the LEFT party (side=-1) that is +x
    const dx=(side<0?W*params.discL:W*params.discR2)-side*r*0.74;
    const dy=cy+r*0.86;
    const ex=kx+side*s*1.30, ey=ky-s*0.70;
    pen.ink(()=>{ brokenSpan(g, dx, dy-d*1.6, ex, ey-d*1.6); }, 5);
    pen.ink(()=>{ brokenSpan(g, dx, dy+d*1.6, ex, ey+d*1.6); }, 5);
  }
}

/* ---- the OATH KNOT: two square hooks that slide together and interlock as the
   oath binds. Different tones so the two pieces stay legible as two. ---- */
function hookPath(g,cx,cy,s,th,side){
  // side=-1: opens right (the ruler's hook). side=+1: opens left (the kin's hook).
  const x0=cx-side*s, x1=cx;                 // spine end is the open mouth
  const yT=cy-s*0.78, yB=cy+s*0.78;
  g.moveTo(x0,yT); g.lineTo(x1,yT); g.lineTo(x1,yT+th);
  g.lineTo(x0+side*th, yT+th); g.lineTo(x0+side*th, yB-th);
  g.lineTo(x1,yB-th); g.lineTo(x1,yB); g.lineTo(x0,yB); g.closePath();
}
function drawKnot(pen,g,W,H,t,bind){
  const cx=W*params.spineX, cy=H*params.knotCy, s=W*params.knotS, th=s*0.34;
  const B=smooth(clamp01(bind));
  const off=lerp(s*0.86, -s*0.30, B);         // apart -> overlapped
  pen.ink(()=>{ g.arc(cx,cy,s*1.62,0,TAU); }, 2.2);      // sworn boundary
  pen.paint(()=>{ hookPath(g, cx-off, cy, s, th, -1); }, toneSolid(inkLevel(6)), 3.6);
  pen.paint(()=>{ hookPath(g, cx+off, cy, s, th,  1); }, toneSolid(inkLevel(3)), 3.6);
  if (B>0.55){                                            // gripped: sworn notches
    g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
    for(let i=0;i<12;i++){
      const a=i/12*TAU+t*0.08;
      g.beginPath();
      g.moveTo(cx+Math.cos(a)*s*1.30, cy+Math.sin(a)*s*1.30);
      g.lineTo(cx+Math.cos(a)*s*1.56, cy+Math.sin(a)*s*1.56);
      g.stroke();
    }
  }
}

/* ---- the RECIPROCITY SPINE: the mirror axis, a broken double rule from the
   knot down past the last rung, with a node at every rung that has linked. ---- */
function drawSpine(pen,g,W,H,link){
  const x=W*params.spineX, d=W*0.007;
  const y0=H*(params.knotCy)+W*params.knotS*1.70;
  const y1=H*(RUNGS[RUNGS.length-1].y+params.rowH*0.90);
  g.strokeStyle=inkLevel(5); g.lineWidth=2.6; g.lineCap="butt";
  g.beginPath(); dashCol(g,x-d,y0,y1,H*0.026,H*0.012);
                 dashCol(g,x+d,y0,y1,H*0.026,H*0.012); g.stroke();
}

/* ---------- outer rung GLYPHS: blocky diagrams inside a square box ---------- */
function glyphCrown(pen,g,x,y,s){
  pen.paint(()=>{
    g.moveTo(x, y+s*0.86); g.lineTo(x, y+s*0.32);
    g.lineTo(x+s*0.25, y+s*0.56); g.lineTo(x+s*0.50, y+s*0.16);
    g.lineTo(x+s*0.75, y+s*0.56); g.lineTo(x+s, y+s*0.32);
    g.lineTo(x+s, y+s*0.86); g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  pen.ink(()=>{ g.moveTo(x+s*0.08,y+s*0.72); g.lineTo(x+s*0.92,y+s*0.72); }, 2.4);
}
function glyphHand(pen,g,x,y,s){
  pen.paint(()=>{ rectPath(g, x+s*0.22, y+s*0.46, s*0.60, s*0.34); }, toneSolid(inkLevel(3)), 3);
  for(let i=0;i<4;i++)
    pen.paint(()=>{ rectPath(g, x+s*0.26+i*s*0.145, y+s*0.10, s*0.104, s*0.38); },
              toneSolid(inkLevel(3)), 2.6);
  pen.paint(()=>{ rectPath(g, x+s*0.02, y+s*0.50, s*0.20, s*0.16); }, toneSolid(inkLevel(3)), 2.6);
  pen.ink(()=>{ g.moveTo(x+s*0.10,y+s*0.92); g.lineTo(x+s*0.92,y+s*0.92); }, 3.4);
}
function glyphHouse(pen,g,x,y,s){
  pen.paint(()=>{ rectPath(g, x+s*0.12, y+s*0.44, s*0.76, s*0.46); }, toneSolid(inkLevel(2)), 3);
  pen.paint(()=>{
    g.moveTo(x+s*0.02, y+s*0.44); g.lineTo(x+s*0.98, y+s*0.44);
    g.lineTo(x+s*0.50, y+s*0.08); g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  pen.paint(()=>{ rectPath(g, x+s*0.40, y+s*0.62, s*0.20, s*0.28); }, toneSolid(inkLevel(6)), 2.4);
}
function glyphJar(pen,g,x,y,s){
  pen.paint(()=>{
    g.moveTo(x+s*0.30, y+s*0.28); g.lineTo(x+s*0.70, y+s*0.28);
    g.lineTo(x+s*0.86, y+s*0.68); g.lineTo(x+s*0.70, y+s*0.90);
    g.lineTo(x+s*0.30, y+s*0.90); g.lineTo(x+s*0.14, y+s*0.68); g.closePath();
  }, toneSolid(inkLevel(3)), 3);
  pen.paint(()=>{ rectPath(g, x+s*0.36, y+s*0.10, s*0.28, s*0.18); }, toneSolid(inkLevel(5)), 2.6);
  pen.ink(()=>{ g.moveTo(x+s*0.18,y+s*0.62); g.lineTo(x+s*0.82,y+s*0.62); }, 2.4);
}
function glyphSpear(pen,g,x,y,s){          // arms laid down: a shaft snapped in two
  pen.paint(()=>{ rectPath(g, x+s*0.00, y+s*0.34, s*0.44, s*0.20); },  // butt half
            toneSolid(inkLevel(5)), 3);
  pen.paint(()=>{ rectPath(g, x+s*0.50, y+s*0.58, s*0.30, s*0.20); },  // head half
            toneSolid(inkLevel(5)), 3);
  pen.paint(()=>{                                     // the head, lying flat
    g.moveTo(x+s*0.78, y+s*0.50); g.lineTo(x+s*1.00, y+s*0.68);
    g.lineTo(x+s*0.78, y+s*0.86); g.closePath();
  }, toneSolid(inkLevel(7)), 2.8);
  g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";   // the break mark
  g.beginPath();
  g.moveTo(x+s*0.44, y+s*0.34); g.lineTo(x+s*0.56, y+s*0.20);
  g.moveTo(x+s*0.46, y+s*0.86); g.lineTo(x+s*0.58, y+s*1.00);
  g.stroke();
  g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="butt";    // the ground it lies on
  g.beginPath(); dashRun(g, x+s*0.02, x+s*0.98, y+s*0.94, s*0.24, s*0.10); g.stroke();
}
const GLYPHS = { crown:glyphCrown, hand:glyphHand, house:glyphHouse, jar:glyphJar, spear:glyphSpear };

/* ---- one side of a rung: a pale plate carrying an outer glyph, a counted index
   in pips, a broken extent measure, and an arrowhead aimed at the spine.
   side=-1 left, side=+1 right. `u` is how far this rung has linked. ---- */
function drawHalfRung(pen,g,W,H,r,n,side,u,t){
  const cy=H*r.y, h=H*params.rowH;
  const inner = W*(params.spineX - side*params.gapIn);   // spine-side edge
  const outer = W*(side<0 ? r.lx0 : r.rx1);
  const s=W*params.glyphS, pw=W*0.072, ph=h*0.42, pad=W*0.014;
  const wA = pad*3 + s + pw;                             // the TERM block
  const notch = W*0.024;

  // --- TERM block: the outer glyph + the counted index ---
  const ax = side<0 ? outer : outer-wA;
  brokenPlate(g, ax, cy-h/2, wA, h, u>0.5?2:1, W*0.062, W*0.024);
  const gx = side<0 ? ax+pad : ax+wA-pad-s;
  (GLYPHS[side<0?r.lGlyph:r.rGlyph]||glyphHouse)(pen,g,gx,cy-s/2,s);
  const px = side<0 ? gx+s+pad : gx-pad-pw;
  pipSlot(pen,g,px,cy-ph/2,pw,ph,n);

  // --- REACH block: a shorter, stepped plate carrying the measure + arrowhead ---
  const bx0 = side<0 ? ax+wA+notch : inner;
  const bx1 = side<0 ? inner        : ax-notch;
  const hb = h*0.58;
  if (bx1-bx0 > W*0.018)
    brokenPlate(g, bx0, cy-hb/2, bx1-bx0, hb, u>0.5?2:1, W*0.044, W*0.020);

  const tipX = side<0 ? inner-W*0.006 : inner+W*0.006;
  const m0 = side<0 ? bx0+W*0.012 : tipX+W*0.020;
  const m1 = side<0 ? tipX-W*0.020 : bx1-W*0.012;
  if (m1>m0){
    g.strokeStyle=inkLevel(u>0.5?6:4); g.lineWidth=u>0.5?3.4:2.4; g.lineCap="butt";
    g.beginPath(); dashRun(g,m0,m1,cy,W*0.024,W*0.014); g.stroke();
  }
  pen.paint(()=>{                                       // arrowhead aimed at spine
    g.moveTo(tipX, cy);
    g.lineTo(tipX-side*W*0.022, cy-hb*0.30);
    g.lineTo(tipX-side*W*0.022, cy+hb*0.30); g.closePath();
  }, toneSolid(inkLevel(u>0.5?7:4)), 2.6);
}

/* ---- the centre LINK of a rung: the stamped bar that joins the two halves once
   the clause is reciprocal. Before it takes, the gap stands open. ---- */
function drawLink(pen,g,W,H,r,u,t){
  const cy=H*r.y, h=H*params.rowH;
  const x0=W*(params.spineX-params.gapIn), x1=W*(params.spineX+params.gapIn);
  const U=smooth(clamp01(u));
  if (U<0.04){                                    // open: a pending socket
    pen.paint(()=>{ rectPath(g, x0+W*0.006, cy-h*0.16, (x1-x0)-W*0.012, h*0.32); },
              toneSolid(inkLevel(0)), 2.6);
    return;
  }
  const w=(x1-x0)*lerp(0.30,1.0,U), cx=W*params.spineX;
  pen.paint(()=>{ rectPath(g, cx-w/2, cy-h*0.17, w, h*0.34); }, toneSolid(inkLevel(7)), 3);
  if (U>0.6){                                     // sworn ticks above and below
    g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
    g.beginPath();
    for(let i=-1;i<=1;i++){
      const px=cx+i*W*0.020;
      g.moveTo(px, cy-h*0.30); g.lineTo(px, cy-h*0.20);
      g.moveTo(px, cy+h*0.20); g.lineTo(px, cy+h*0.30);
    }
    g.stroke();
  }
}

/* ---- TRANSFORMATION: memory suppression. A pale offset plate holding the
   grievance tally, swept blank left-to-right by the forgetting front. ---- */
function drawMemory(pen,g,W,H,t,forget){
  const M=params.memory;
  const x0=W*M.x0, x1=W*M.x1, y0=H*M.y0, y1=H*M.y1;
  brokenPlate(g, x0, y0, x1-x0, y1-y0, 1, W*0.066, W*0.026);

  const F=smooth(clamp01(forget));
  // the grievance TALLY: punched sockets, staggered over two rows so the field
  // never reads as a grid stripe. A socket keeps its slot after it is wiped —
  // the record survives, the memory in it does not.
  const sw=W*0.072, sh=(y1-y0)*0.30, pitch=W*0.088;
  const bx=x0+W*0.024, r0y=y0+(y1-y0)*0.28, r1y=y0+(y1-y0)*0.72;
  const socks=[];
  for(let i=0;i<4;i++) socks.push({ x:bx+i*pitch,            y:r0y });
  for(let i=0;i<3;i++) socks.push({ x:bx+i*pitch+pitch*0.5,  y:r1y });
  const fx=lerp(bx-W*0.010, bx+3*pitch+sw+W*0.014, F);
  for(const s of socks){
    pen.paint(()=>{ rectPath(g, s.x, s.y-sh/2, sw, sh); }, toneSolid(inkLevel(0)), 2.8);
    if (s.x+sw*0.5 < fx) continue;                 // swept: the slot stands empty
    g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="butt"; g.beginPath();
    for(let k=0;k<3;k++){
      const px=s.x+sw*(0.26+k*0.24);
      g.moveTo(px, s.y-sh*0.28); g.lineTo(px, s.y+sh*0.28);
    }
    g.stroke();
  }
  // the forgetting front + the residue dissolving just ahead of it
  if (F>0.01 && F<0.995){
    pen.ink(()=>{ g.moveTo(fx, y0+H*0.008); g.lineTo(fx, y1-H*0.008); }, 3.4);
    g.fillStyle=inkLevel(4);
    for(let i=0;i<4;i++){
      const px=fx+W*(0.016+i*0.026), py=(i%2? r0y : r1y);
      if (px>x1-W*0.110) break;
      g.beginPath(); g.arc(px,py,W*0.011*(1-i*0.22),0,TAU); g.fill();
    }
  }
  // SUPPRESSION SEAL at the plate's right end: a slot that fills solid and is
  // struck through as the tally goes blank.
  const kx=x1-W*0.078, ky=(y0+y1)/2, kw=W*0.054, kh=(y1-y0)*0.46;
  pen.paint(()=>{ rectPath(g, kx, ky-kh/2, kw, kh); }, toneSolid(inkLevel(0)), 3);
  if (F>0.05){
    const k=smooth(clamp01((F-0.05)/0.95));
    pen.paint(()=>{ rectPath(g, kx+kw*0.16, ky+kh*0.36-kh*0.72*k, kw*0.68, kh*0.72*k); },
              toneSolid(inkLevel(6)), 2.4);
    g.strokeStyle=INK; g.lineWidth=3.6; g.lineCap="round";
    g.beginPath(); g.moveTo(kx-W*0.012, ky+kh*0.26); g.lineTo(kx+kw+W*0.012, ky-kh*0.26); g.stroke();
  }
}

/* ---- CONSEQUENCE: future abundance. Stepped stores rising off a BROKEN ground
   rule, tops traced by a climbing step outline, with a generation count in pips
   and a forward chevron at the band's left. ---- */
function drawAbundance(pen,g,W,H,t,abund){
  const B=params.yieldBand, gy=H*B.y, x0=W*B.x0, x1=W*B.x1;
  const A=smooth(clamp01(abund));
  g.strokeStyle=INK; g.lineWidth=4; g.lineCap="butt";
  g.beginPath(); dashRun(g,x0,x1,gy,W*0.062,W*0.022); g.stroke();

  const n=6, sw=W*0.056, gap=((x1-x0)-n*sw)/(n-1);
  const tops=[];
  for(let i=0;i<n;i++){
    const sx=x0+i*(sw+gap);
    const full=H*(0.020+0.086*(0.42+0.58*i/(n-1)));
    const hgt=full*A;
    if (hgt<H*0.006){ tops.push(null); continue; }
    const tiers=Math.max(1, Math.round(hgt/(H*0.030)));
    const th=hgt/tiers;
    for(let k=0;k<tiers;k++){
      const inset=sw*0.06*k;
      pen.paint(()=>{ rectPath(g, sx+inset, gy-th*(k+1), sw-inset*2, th); },
                toneSolid(inkLevel(k%2?4:2)), 2.8);
    }
    tops.push({ x:sx+sw/2, y:gy-hgt });
    if (A>0.65){                                   // a sheaf mark on the full store
      pen.paint(()=>{
        g.moveTo(sx+sw*0.30, gy-hgt); g.lineTo(sx+sw*0.70, gy-hgt);
        g.lineTo(sx+sw*0.50, gy-hgt-H*0.020); g.closePath();
      }, toneSolid(inkLevel(6)), 2.2);
    }
  }
  // the climbing step outline traced over the tops, drawn as a broken run
  const pts=tops.filter(Boolean);
  if (pts.length>1 && A>0.25){
    g.strokeStyle=inkLevel(6); g.lineWidth=2.6; g.lineCap="butt"; g.lineJoin="miter";
    for(let i=0;i<pts.length-1;i++){
      if (i%2) continue;                            // break every other span
      g.beginPath();
      g.moveTo(pts[i].x, pts[i].y-H*0.014);
      g.lineTo(pts[i+1].x, pts[i].y-H*0.014);
      g.lineTo(pts[i+1].x, pts[i+1].y-H*0.014);
      g.stroke();
    }
  }
  // CONSEQUENCE LINK: a broken drop from the emptied grievance ledger down to the
  // ground the stores stand on — what was forgotten is what lets this be built.
  const lx=W*0.352, ly0=H*params.memory.y1+H*0.014;
  g.strokeStyle=inkLevel(5); g.lineWidth=2.8; g.lineCap="butt";
  g.beginPath(); dashCol(g,lx,ly0,gy-H*0.052,H*0.024,H*0.014); g.stroke();
  pen.paint(()=>{
    g.moveTo(lx-W*0.014, gy-H*0.052); g.lineTo(lx+W*0.014, gy-H*0.052);
    g.lineTo(lx, gy-H*0.026); g.closePath();
  }, toneSolid(inkLevel(6)), 2.4);

  // generation count + forward chevron: the span of time the state binds
  const gx=W*0.104, gyy=gy-H*0.022;
  pipSlot(pen,g,gx,gyy-H*0.021,W*0.098,H*0.042,params.genPips);
  if (A>0.35) pen.paint(()=>{
    const cx=gx+W*0.116, cy=gyy;
    g.moveTo(cx, cy-H*0.018); g.lineTo(cx+W*0.030, cy); g.lineTo(cx, cy+H*0.018);
    g.lineTo(cx+W*0.010, cy); g.closePath();
  }, toneSolid(inkLevel(6)), 2.4);
  g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="butt"; g.beginPath();
  dashRun(g, W*0.100, W*0.318, gy, W*0.042, W*0.020); g.stroke();
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=st.t ?? 0;
  const inten=st.intensity ?? params.intensity;
  const bind  = st.bind      ?? clamp(inten*1.15,0,1);
  const link  = st.link      ?? clamp((inten-0.22)*1.55,0,1);
  const forget= st.forget    ?? clamp((inten-0.45)*2.00,0,1);
  const abund = st.abundance ?? clamp((inten-0.55)*2.20,0,1);
  const layers = st.layers || ["yoke","spine","rungs","knot","parties","memory","abundance"];
  const has = l => layers.includes(l);

  if (has("yoke"))    drawYoke(pen,g,W,H);
  if (has("spine"))   drawSpine(pen,g,W,H,link);
  if (has("rungs"))   RUNGS.forEach((r,i)=>{
    const u = clamp01(link*RUNGS.length - i);
    drawHalfRung(pen,g,W,H,r,i+1,-1,u,t);
    drawHalfRung(pen,g,W,H,r,i+1, 1,u,t);
    drawLink(pen,g,W,H,r,u,t);
  });
  if (has("knot"))    drawKnot(pen,g,W,H,t,bind);
  if (has("parties")) drawParties(pen,g,W,H,t,inten);
  if (has("memory"))  drawMemory(pen,g,W,H,t,forget);
  if (has("abundance")) drawAbundance(pen,g,W,H,t,abund);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine-fx.ithacan-peace-oath",
  type:"DIVINE_FX",
  name:"Ithacan peace oath",
  statusWord:"SWORN",
  scene:"OD-B24-S09",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["yoke","spine","rungs","knot","parties","memory","abundance"],
  // normalized 0..1 source / target / field / transformation / consequence anchors
  anchors:{
    "source:ruler":{        x:0.242, y:0.112 },  // the house of Odysseus
    "source:families":{     x:0.758, y:0.112 },  // the kin of the dead suitors
    "field:knot":{          x:0.500, y:0.226 },  // the oath itself, interlocked
    "spine:mirror":{        x:0.500, y:0.442 },  // the reciprocity axis
    "rung:rule":{           x:0.500, y:0.345 },
    "rung:households":{     x:0.500, y:0.442 },
    "rung:restitution":{    x:0.500, y:0.539 },
    "target:ruler-side":{   x:0.290, y:0.442 },  // what binds the king's half
    "target:kin-side":{     x:0.700, y:0.442 },  // what binds the families' half
    "transform:forgetting":{x:0.344, y:0.677 },  // the memory-suppression plate
    "seal:suppression":{    x:0.851, y:0.677 },
    "consequence:abundance":{ x:0.654, y:0.845 }, // the future stores
    "consequence:ground":{  x:0.654, y:0.888 },
    "camera:wide":{         x:0.500, y:0.500 },
  },
  // affected regions
  zones:{
    parties:{   x0:0.160, y0:0.036, x1:0.840, y1:0.192 },
    covenant:{  x0:0.086, y0:0.300, x1:0.914, y1:0.586 },  // the ladder footprint
    memory:{    x0:0.098, y0:0.612, x1:0.590, y1:0.742 },
    abundance:{ x0:0.386, y0:0.756, x1:0.914, y1:0.906 },
  },
  // DIVINE_FX transformation states: offered -> clasped -> binding -> sworn
  states:{
    initial:"transform",
    nodes:{
      // source: the two parties face each other, hooks open, nothing yet linked
      source:{    preview:{ t:0.4, intensity:0.20, bind:0.14, link:0.0,  forget:0.0,
                            abundance:0.0, status:"OFFERED", progress:0.12 } },
      // target: the hooks close on the knot, the first rung takes
      target:{    preview:{ t:1.1, intensity:0.50, bind:0.62, link:0.40, forget:0.10,
                            abundance:0.06, status:"CLASPED", progress:0.36 } },
      // field: the rungs link one by one, the forgetting front runs
      field:{     preview:{ t:1.9, intensity:0.80, bind:0.92, link:0.78, forget:0.58,
                            abundance:0.42, status:"BINDING", progress:0.66 } },
      // transform: knot interlocked, all rungs linked, tally blank, stores full
      transform:{ preview:{ t:2.7, intensity:1.25, bind:1.0,  link:1.0,  forget:1.0,
                            abundance:1.0, status:"SWORN",   progress:0.95 } },
    },
    edges:[["source","target"],["target","field"],["field","transform"],
           ["transform","field"],["field","target"]],
  },
  duration:7.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","bind","link","forget","abundance"],

  // neutral preview: the oath fully struck — knot interlocked, all three rungs
  // linked both ways, the grievance tally blank, the stores standing full.
  preview:()=>({ t:2.6, intensity:1.25, bind:1.0, link:1.0, forget:1.0, abundance:1.0,
                 status:"SWORN", progress:0.95,
                 layers:["yoke","spine","rungs","knot","parties","memory","abundance"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
