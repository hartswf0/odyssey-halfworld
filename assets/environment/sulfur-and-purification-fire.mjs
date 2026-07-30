/* environment.sulfur-and-purification-fire — the fumigation of the great hall.
   ENVIRONMENT asset (procedural world force). Scene function (OD-B22-S08):
   after the blood is washed off the floor, fire and sulfur are fetched and the
   hall is smoke-cleansed. This is not a room and not a hearth — it is the
   CLEANSING FRONT itself: a field with a SOURCE (a carried brazier of coals
   with sulfur lumps laid on them), a DIRECTION (away from the throne end,
   down the hall, out through the great doors), an INTENSITY (how much sulfur
   is burning), an AFFECTED REGION (the swept band behind the front is purged
   paper; the band ahead of it still carries the taint), and a SOUND behavior
   (the hiss of sulfur on coals, read as the emission ticks at the source).

   The card is a working diagram of that process, in three registers:
     · GAUGE strip  — direction chevrons + a segmented intensity ladder
     · SECTION      — the hall seen along its length, throne end left, great
                      doors right: the brazier at the source, the fume mass
                      rolled along the ceiling, the leading front, the vent
                      escaping through the smoke-hole and the doors
     · ZONE STRIP   — the megaron's zones in sweep order (corner_dead,
                      bench_l, hearth, bench_r, threshold), each carrying its
                      own state: purged / purging / tainted, with a state chip
                      and the front's position crossing them

   Tonal law: the paper is the clean hall. Ink is spent on hard contour, on the
   fume silhouette (light plane, dark leading edge), and on small hard accents
   (coals, flecks of taint, chips, segments). Every span is broken — no bar
   crosses the frame. No numerals are drawn as text: the readout is
   seven-segment GEOMETRY.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

const params = {
  /* ---- frame registers (fractions of H) ---- */
  gaugeY:    0.105,  // direction + intensity strip
  ceilY:     0.205,  // underside of the roof in the section
  floorY:    0.585,  // the washed floor line
  stripY0:   0.660,  // zone strip top
  stripY1:   0.845,  // zone strip bottom
  readoutY:  0.925,  // seven-segment sweep readout

  /* ---- the field ---- */
  front:     0.55,   // sweep position: 0 at the throne end .. 1 out the doors
  intensity: 1.0,    // master field strength (sulfur charge burning)
  fume:      1.0,    // fume mass carried by the front
  vent:      0.7,    // how much is escaping the smoke-hole + the doors
  hiss:      1.0,    // sound behavior: sulfur-on-coals emission ticks
  taint:     1.0,    // residual pollution still standing ahead of the front

  /* ---- geometry ---- */
  srcX:      0.135,  // the carried brazier (the source node)
  doorX:     0.885,  // the great doors, the field's exit
  columns:   [0.335, 0.520, 0.700],
  zoneW:     [0.20, 0.19, 0.23, 0.20, 0.18],  // uneven on purpose
};

/* the ONE place the front's x is decided — the section, the front mark, the
   purged band and the taint all read it, so they can never disagree */
const frontX = (W, front) => W*lerp(0.28, 0.82, clamp01(front));

/* ============ small diagrammatic primitives ============ */

/* a span that is NEVER a bar: uneven runs separated by real gaps. `runs` is a
   weight pattern; every gap is wide enough to read as a break, and the run
   lengths differ so the eye never resolves it into a stripe. */
function brokenSpan(g, x0, x1, y, runs, lw, gap=0.26){
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="butt";
  const sum = runs.reduce((a,b)=>a+b,0);
  const gaps = runs.length-1;
  const usable = (x1-x0)*(1-gap), gw = gaps>0 ? (x1-x0)*gap/gaps : 0;
  let x = x0;
  for(let i=0;i<runs.length;i++){
    const w = usable*runs[i]/sum;
    g.beginPath(); g.moveTo(x,y); g.lineTo(x+w,y); g.stroke();
    x += w + gw;
  }
}
/* sparse hard flecks — the taint. Small, dark, semantic accents. */
function flecks(g, x0,y0,x1,y1, n, seed, r, lvl){
  g.fillStyle = inkLevel(lvl);
  for(let i=0;i<n;i++){
    const x = lerp(x0,x1,pr(i,seed));
    const y = lerp(y0,y1,pr(i,seed+3.1));
    const rr = r*(0.6+0.8*pr(i,seed+7.7));
    g.beginPath(); g.arc(x,y,rr,0,TAU); g.fill();
  }
}
/* thin diagonal hatch inside a clipped cell — a light plane, not a fill */
function hatch(g, x0,y0,x1,y1, step, lvl, lw=1.6){
  g.save(); g.beginPath(); g.rect(x0,y0,x1-x0,y1-y0); g.clip();
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lw;
  const h = y1-y0;
  for(let x=x0-h; x<x1+h; x+=step){
    g.beginPath(); g.moveTo(x,y1); g.lineTo(x+h,y0); g.stroke();
  }
  g.restore();
}
/* a chevron: the direction of the field, drawn as geometry */
function chevron(g, x, y, s, lw=4){
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round"; g.lineJoin="round";
  g.beginPath(); g.moveTo(x-s*0.55, y-s); g.lineTo(x+s*0.55, y); g.lineTo(x-s*0.55, y+s); g.stroke();
}
/* zone state chip: 0 tainted (hollow) · 1 purging (half) · 2 purged (solid) */
function chip(pen, g, x, y, s, state){
  if (state===2){ pen.paint(()=>{ g.rect(x-s/2,y-s/2,s,s); }, toneSolid(inkLevel(7)), 3); return; }
  pen.paint(()=>{ g.rect(x-s/2,y-s/2,s,s); }, toneSolid(inkLevel(0)), 3.5);
  if (state===1){ g.fillStyle=inkLevel(7); g.fillRect(x-s/2+2, y-s/2+2, s/2-2, s-4); }
}
/* seven-segment digit — numerals as GEOMETRY so they survive the dot lattice */
const SEG = { 0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",
              6:"afgecd",7:"abc",8:"abcdefg",9:"abcdfg" };
function seg7(g, x, y, w, h, d){
  const th = Math.max(4, h*0.15), on = String(SEG[d]||"");
  const bar=(bx,by,bw,bh,lit)=>{ g.fillStyle = lit?INK:inkLevel(1);
    g.fillRect(bx,by,bw,bh); };
  const i = ch => on.includes(ch);
  bar(x+th*0.8, y,               w-th*1.6, th,        i("a"));
  bar(x+w-th,   y+th*0.8,        th,       h/2-th*1.1, i("b"));
  bar(x+w-th,   y+h/2+th*0.3,    th,       h/2-th*1.1, i("c"));
  bar(x+th*0.8, y+h-th,          w-th*1.6, th,        i("d"));
  bar(x,        y+h/2+th*0.3,    th,       h/2-th*1.1, i("e"));
  bar(x,        y+th*0.8,        th,       h/2-th*1.1, i("f"));
  bar(x+th*0.8, y+h/2-th*0.5,    w-th*1.6, th,        i("g"));
}

/* ============ GAUGE STRIP: direction + intensity ============ */
function drawGauge(pen,g,W,H,front,inten){
  const y = H*params.gaugeY;
  // direction: three chevrons marching toward the doors, spaced, never a bar
  const s = H*0.019;
  for(let i=0;i<3;i++) chevron(g, W*(0.20+i*0.055), y, s, 4.5);
  // the swept extent, as a broken rule from the source to the front
  brokenSpan(g, W*0.365, W*lerp(0.42,0.80,clamp01(front)), y, [3,2,1.4,1], 3.2, 0.34);
  // intensity ladder: 7 discrete blocks, lit up to the field strength
  const n=7, bw=W*0.0225, bh=H*0.026, gx=W*0.845-n*bw*1.42, gy=y-bh/2;
  const lit = Math.round(clamp01(inten/1.4)*n);
  for(let k=0;k<n;k++){
    const bx = gx + k*bw*1.42;
    if (k<lit) pen.paint(()=>{ g.rect(bx,gy,bw,bh); }, toneSolid(inkLevel(7)), 2.5);
    else       pen.paint(()=>{ g.rect(bx,gy+bh*0.28,bw,bh*0.44); }, toneSolid(inkLevel(0)), 2.5);
  }
}

/* ============ SECTION: the hall along its length ============ */
/* Roof + floor + columns, all as LIGHT planes with hard contour. The roof line
   is broken and carries a smoke-hole gap the vent escapes through. */
function drawSection(pen,g,W,H){
  const cy = H*params.ceilY, fy = H*params.floorY;
  // roof: two broken runs with a smoke-hole gap at the centre
  brokenSpan(g, W*0.075, W*0.435, cy, [2,1.2,2.6], 4.5, 0.24);
  brokenSpan(g, W*0.565, W*0.925, cy, [2.6,1,2], 4.5, 0.24);
  // the smoke-hole jambs
  g.strokeStyle=INK; g.lineWidth=4.5; g.lineCap="round";
  g.beginPath(); g.moveTo(W*0.435,cy); g.lineTo(W*0.435,cy-H*0.032); g.stroke();
  g.beginPath(); g.moveTo(W*0.565,cy); g.lineTo(W*0.565,cy-H*0.032); g.stroke();
  // rafter hangers — short ticks, gapped
  for(let i=0;i<9;i++){
    const x = lerp(W*0.11, W*0.90, i/8);
    if (x>W*0.42 && x<W*0.58) continue;
    g.lineWidth=2.4; g.beginPath(); g.moveTo(x,cy); g.lineTo(x,cy+H*0.020); g.stroke();
  }
  // columns: light planes, hard contour, blocky capitals
  const cw = W*0.042;
  for(const f of params.columns){
    const x = W*f;
    pen.paint(()=>{ g.rect(x-cw/2, cy+H*0.028, cw, fy-cy-H*0.028); }, toneSolid(inkLevel(1)), 4);
    pen.paint(()=>{ g.rect(x-cw*0.78, cy+H*0.012, cw*1.56, H*0.022); }, toneSolid(inkLevel(2)), 3.5);
    // a single flute seam, not a shaded shaft
    g.strokeStyle=inkLevel(3); g.lineWidth=2;
    g.beginPath(); g.moveTo(x, cy+H*0.055); g.lineTo(x, fy-H*0.02); g.stroke();
  }
  // the washed floor: never one rule — five uneven runs with real gaps
  brokenSpan(g, W*0.065, W*0.935, fy, [1.6,2.4,1,2.8,1.3], 4.5, 0.20);
  // the great doors at the right: two jambs and a lintel, standing open
  const dx = W*params.doorX;
  pen.paint(()=>{ g.rect(dx, fy-H*0.215, W*0.030, H*0.215); }, toneSolid(inkLevel(2)), 4);
  g.strokeStyle=INK; g.lineWidth=4;
  g.beginPath(); g.moveTo(dx-W*0.005, fy-H*0.215); g.lineTo(dx+W*0.062, fy-H*0.215); g.stroke();
}

/* ---- the SOURCE: a carried brazier, coals, and sulfur lumps hissing on them.
   Bowl and stand are light planes with hard contour; the coals are the dark
   accent; the sulfur lumps are near-paper crystals with faceting lines. ---- */
function drawSource(pen,g,W,H,t,inten,hiss){
  const x = W*params.srcX, fy = H*params.floorY;
  const by = fy - H*0.105;                       // bowl rim height (carried)
  const bw = W*0.115, bh = H*0.048;
  // stand: two splayed legs, gapped from the floor line
  g.strokeStyle=INK; g.lineWidth=5; g.lineCap="round";
  g.beginPath(); g.moveTo(x-bw*0.30, by+bh*0.55); g.lineTo(x-bw*0.44, fy-2); g.stroke();
  g.beginPath(); g.moveTo(x+bw*0.30, by+bh*0.55); g.lineTo(x+bw*0.44, fy-2); g.stroke();
  // bowl
  pen.paint(()=>{
    g.moveTo(x-bw/2, by);
    g.lineTo(x+bw/2, by);
    g.lineTo(x+bw*0.34, by+bh);
    g.lineTo(x-bw*0.34, by+bh);
    g.closePath();
  }, toneSolid(inkLevel(1)), 4.5);
  // rim
  pen.paint(()=>{ g.rect(x-bw*0.58, by-H*0.010, bw*1.16, H*0.012); }, toneSolid(inkLevel(2)), 3.5);
  // coals — the dark accent, a shallow separated bed inside the rim
  const strength = clamp(inten,0,1.4);
  for(let i=0;i<5;i++){
    const cx = x + lerp(-bw*0.36, bw*0.36, i/4);
    const cyy = by + H*0.007 + (i%2? -1.5: 1.5);
    const glow = 0.5+0.5*Math.sin(t*3.1+i*1.4);
    const lvl = Math.round(lerp(6, 3, clamp01(strength)*glow));
    pen.paint(()=>{ g.ellipse(cx, cyy, W*0.013, H*0.007, 0,0,TAU); }, toneSolid(inkLevel(lvl)), 2.4);
  }
  // sulfur lumps — bright faceted crystals, standing PROUD of the coal bed so
  // they read as the charge, not as part of the fire
  for(let i=0;i<3;i++){
    const sx = x + lerp(-bw*0.34, bw*0.34, i/2);
    const sy = by - H*0.021 - (i===1? H*0.006 : 0);
    const r = W*0.026*(0.88+0.24*pr(i,2.2));
    pen.paint(()=>{
      g.moveTo(sx, sy-r); g.lineTo(sx+r*0.95, sy-r*0.05); g.lineTo(sx+r*0.42, sy+r*0.68);
      g.lineTo(sx-r*0.52, sy+r*0.62); g.lineTo(sx-r*0.98, sy-r*0.12); g.closePath();
    }, toneSolid(inkLevel(0)), 3.6);
    g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
    g.beginPath(); g.moveTo(sx-r*0.50, sy+r*0.58); g.lineTo(sx, sy-r*0.62);
    g.lineTo(sx+r*0.88, sy-r*0.06); g.stroke();
  }
  // hiss: the SOUND behavior, drawn as emission ticks fanning off the bed
  if (hiss>0.05){
    g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
    for(let i=0;i<5;i++){
      const a = lerp(-1.15, -0.10, i/4) - 0.10*Math.sin(t*2.2+i);
      const r0 = W*0.055 + H*0.006*Math.sin(t*4+i*2);
      const r1 = r0 + W*0.030*clamp01(hiss);
      const ox = x + bw*0.14;
      g.beginPath();
      g.moveTo(ox+Math.cos(a)*r0, by+Math.sin(a)*r0*1.4);
      g.lineTo(ox+Math.cos(a)*r1, by+Math.sin(a)*r1*1.4);
      g.stroke();
    }
  }
}

/* ---- the FUME MASS: a rolling body of sulfur smoke carried along under the
   roof from the source to the front. Built as a UNION of lobes: every lobe is
   stroked fat in INK first, then all of them are filled light — so the interior
   strokes are covered and the union keeps exactly ONE hard black contour. The
   plane inside stays light (level 2); structure comes from curl seams, and the
   only dark notes are three small cores back at the source. ---- */
function fumeLobes(W,H,t,front,m){
  const cy = H*params.ceilY, fy = H*params.floorY;
  const x0 = W*(params.srcX+0.030);
  const x1 = frontX(W,front);
  if (x1 <= x0+W*0.04) return null;
  const top = cy + H*0.034;
  const band = (fy-top);
  const N = Math.max(4, Math.round((x1-x0)/(W*0.062)));
  const L = [];
  /* the rising STEM: the fume leaving the sulfur on the coals and climbing to
     join the mass. Lower puffs stay separate (each keeps its own contour, so it
     reads as rising smoke); the top one overlaps the tail and merges the union,
     which is what ties the field to its source instead of floating it. */
  const stemBase = fy - H*0.128;
  for(let s=0;s<4;s++){
    const f = s/3;
    const sr = band*(0.028 + 0.075*f*f)*(0.85+0.35*m);
    L.push({ x: W*params.srcX + f*W*0.045 + Math.sin(t*0.7 + f*2.2)*W*0.010,
             y: lerp(stemBase, top + band*0.15, f), r: sr });
  }
  for(let i=0;i<=N;i++){
    const f = i/N;
    // the head is fattest at the leading edge (a rolling bolster), the tail thin
    const grow = 0.52 + 0.48*Math.pow(f,0.7);
    const r = band*(0.085 + 0.085*m)*grow*(0.86+0.26*pr(i,3.3));
    const x = lerp(x0,x1,f);
    const y = top + r*0.86 + Math.sin(f*4.2 + t*0.6)*band*0.030;
    L.push({ x, y, r });
    // a second, smaller lobe slung below for the sagging underside
    if (i%2===0 && f>0.10){
      const r2 = r*(0.56+0.16*pr(i,8.8));
      L.push({ x: x + r*0.30, y: y + r*0.78, r: r2 });
    }
  }
  return { lobes:L, x0, x1, top, band };
}
function drawFume(pen,g,W,H,t,front,mass){
  const m = clamp(mass,0,1.5);
  if (m<0.04) return;
  const F = fumeLobes(W,H,t,front,m);
  if (!F) return;
  const { lobes, x0, x1, top, band } = F;
  // pass 1: fat INK strokes — the halo that survives as the union's contour
  g.strokeStyle=INK; g.lineWidth=8; g.lineJoin="round";
  for(const l of lobes){ g.beginPath(); g.arc(l.x,l.y,l.r,0,TAU); g.stroke(); }
  // pass 2: light fills — cover every interior stroke, leave the outer contour
  g.fillStyle=inkLevel(2);
  for(const l of lobes){ g.beginPath(); g.arc(l.x,l.y,l.r,0,TAU); g.fill(); }
  // curl seams — structure without darkening the plane
  g.strokeStyle=inkLevel(4); g.lineWidth=2.2; g.lineCap="round";
  for(let i=0;i<4;i++){
    const l = lobes[Math.min(lobes.length-1, 2+i*3)];
    if (!l) break;
    g.beginPath(); g.arc(l.x, l.y, l.r*0.52, 0.5+Math.sin(t*0.7+i), 4.3+Math.sin(t*0.5+i));
    g.stroke();
  }
  // three small dark cores — the densest smoke, still back at the brazier
  for(let i=0;i<3;i++){
    const l = lobes[Math.min(lobes.length-1, i*2)];
    if (!l) break;
    pen.paint(()=>{ g.ellipse(l.x, l.y, l.r*0.34, l.r*0.24, 0,0,TAU); },
              toneSolid(inkLevel(4)), 2.2);
  }
  // two short tongues nodding down toward the washed floor — rounded, uneven,
  // and nowhere near long enough to read as icicles
  for(let i=0;i<2;i++){
    const f = 0.34+0.30*i, x = lerp(x0,x1,f);
    if (x>x1-W*0.06) break;
    const b = top + band*(0.26+0.06*i);
    const h = band*(0.16+0.12*m)*(0.8+0.3*pr(i,5.5));
    const w = W*0.030*(0.85+0.25*pr(i,6.1));
    pen.paint(()=>{
      g.moveTo(x-w, b);
      g.bezierCurveTo(x-w*1.1, b+h*0.75, x-w*0.5, b+h, x, b+h);
      g.bezierCurveTo(x+w*0.5, b+h, x+w*1.1, b+h*0.75, x+w, b);
      g.closePath();
    }, toneSolid(inkLevel(2)), 3.2);
  }
}

/* ---- the FRONT: the boundary itself. A broken leading rule with chevrons —
   the one place the field is a hard graphic statement. ---- */
function drawFrontMark(pen,g,W,H,front){
  const cy=H*params.ceilY, fy=H*params.floorY;
  // clear of the leading bolster, and never past the doors it is driving toward
  const x = Math.min(frontX(W,front) + W*0.062, W*0.828);
  // broken vertical: three dashes, never a full-height bar
  g.strokeStyle=INK; g.lineWidth=4; g.lineCap="butt";
  const runs = [[0.10,0.34],[0.44,0.66],[0.76,0.98]];
  for(const [a,b] of runs){
    g.beginPath(); g.moveTo(x, lerp(cy,fy,a)); g.lineTo(x, lerp(cy,fy,b)); g.stroke();
  }
  // two chevrons pushing the boundary toward the doors
  chevron(g, x+W*0.019, lerp(cy,fy,0.39), H*0.015, 4);
  chevron(g, x+W*0.019, lerp(cy,fy,0.71), H*0.015, 4);
  // the foot mark on the floor
  pen.paint(()=>{ g.rect(x-W*0.012, fy-H*0.009, W*0.024, H*0.018); }, toneSolid(inkLevel(7)), 2.5);
}

/* ---- the TAINT: what is still standing ahead of the front. Hard sparse
   flecks only — no wash, so the paper keeps reading as the clean hall. ---- */
function drawTaint(g,W,H,front,taint){
  const fy=H*params.floorY, cy=H*params.ceilY;
  const x0 = frontX(W,front) + W*0.095;
  const x1 = W*0.925;
  if (x1-x0 < W*0.03 || taint<0.05) return;
  // clustered, not scattered: three drifts of flecks so it reads as standing
  // pollution rather than dirt on the plate
  const n = Math.round(16*clamp01(taint) * clamp((x1-x0)/(W*0.5),0.25,1.4));
  for(let c=0;c<3;c++){
    const cxf = lerp(x0, x1, 0.18+0.34*c), cyf = lerp(cy+H*0.085, fy-H*0.030, pr(c,2.7));
    const rx = Math.min(W*0.075, (x1-x0)*0.30), ry = H*0.055;
    flecks(g, Math.max(x0,cxf-rx), cyf-ry, Math.min(x1,cxf+rx), cyf+ry,
           n, 11.3+c*5.1, 2.8, 6);
  }
}

/* ---- PURGED: behind the front the floor is clean. Marked, not filled: a few
   short bright ticks sitting on the floor line. ---- */
function drawPurged(g,W,H,front){
  const fy=H*params.floorY;
  const x1 = frontX(W,front);
  if (x1 < W*0.24) return;
  g.strokeStyle=inkLevel(6); g.lineWidth=3; g.lineCap="butt";
  for(let i=0;i<5;i++){
    const x = lerp(W*0.21, x1-W*0.03, i/4);
    g.beginPath(); g.moveTo(x, fy+H*0.014); g.lineTo(x+W*0.020, fy+H*0.014); g.stroke();
  }
}

/* ---- the VENT: what escapes. A light plume through the smoke-hole and a
   second one leaning out through the open doors. ---- */
function drawVent(pen,g,W,H,t,vent,front){
  const cy=H*params.ceilY, v=clamp(vent,0,1.4);
  if (v<0.05) return;
  // through the smoke-hole
  for(let i=0;i<4;i++){
    const f=i/3;
    const x = W*0.50 + Math.sin(t*0.8+f*2.4)*W*0.030*(0.3+f);
    const y = cy - H*(0.030 + 0.062*f)*v;
    const r = W*(0.020+0.020*f)*v;
    pen.paint(()=>{ g.ellipse(x,y,r,r*0.72,0,0,TAU); }, toneSolid(inkLevel(i<2?2:1)), 2.8);
  }
  // out through the doors, once the front has arrived
  const arrival = clamp01((front-0.68)/0.32);
  if (arrival>0.05){
    const dx=W*params.doorX, fy=H*params.floorY;
    for(let i=0;i<3;i++){
      const f=i/2;
      const x = dx + W*(0.045+0.048*f);
      const y = fy - H*(0.13+0.045*f) + Math.sin(t*0.9+f*2)*H*0.008;
      const r = W*(0.019+0.016*f)*arrival;
      pen.paint(()=>{ g.ellipse(x,y,r,r*0.78,0,0,TAU); }, toneSolid(inkLevel(2)), 2.6);
    }
  }
}

/* ============ ZONE STRIP: the megaron's zones in sweep order ============ */
function drawZoneStrip(pen,g,W,H,front,taint){
  const y0=H*params.stripY0, y1=H*params.stripY1;
  const x0=W*0.075, x1=W*0.925, span=x1-x0;
  const wts = params.zoneW, sum = wts.reduce((a,b)=>a+b,0);
  const fx = x0 + span*clamp01(front);
  let x = x0;
  const gap = W*0.012;
  for(let i=0;i<wts.length;i++){
    const w = span*wts[i]/sum;
    const cx0 = x + gap*0.5, cx1 = x + w - gap*0.5;
    // cell state from the front's position
    const state = cx1 < fx ? 2 : (cx0 < fx ? 1 : 0);
    // the cell: a light plane with hard contour
    pen.paint(()=>{ g.rect(cx0, y0, cx1-cx0, y1-y0); }, toneSolid(inkLevel(0)), 4);
    if (state===1) hatch(g, cx0+3, y0+3, cx1-3, y1-3, W*0.026, 3, 2.0);
    if (state===0 && taint>0.05)
      flecks(g, cx0+W*0.012, y0+H*0.012, cx1-W*0.012, y1-H*0.030,
             Math.round(9*clamp01(taint)), 20.7+i*3, 2.4, 6);
    if (state===2){
      // purged: one bold X across the cell — unmistakably CLEARED, and nothing
      // like the diagonal hatch a zone still purging carries
      g.strokeStyle=INK; g.lineWidth=5; g.lineCap="round";
      const ix0=cx0+W*0.030, ix1=cx1-W*0.030, iy0=y0+H*0.030, iy1=y1-H*0.030;
      g.beginPath(); g.moveTo(ix0,iy0); g.lineTo(ix1,iy1); g.stroke();
      g.beginPath(); g.moveTo(ix1,iy0); g.lineTo(ix0,iy1); g.stroke();
    }
    // the state chip, hung under the cell
    chip(pen, g, (cx0+cx1)/2, y1+H*0.028, W*0.030, state);
    x += w;
  }
  // the front, crossing the strip: a short bold stub + one chevron. Nothing to
  // mark before the sweep has started, and it never rides the strip's own edge.
  if (front <= 0.02) return;
  const mx = clamp(fx, x0+W*0.010, x1-W*0.010);
  g.strokeStyle=INK; g.lineWidth=5; g.lineCap="butt";
  g.beginPath(); g.moveTo(mx, y0-H*0.022); g.lineTo(mx, y0+H*0.028); g.stroke();
  g.beginPath(); g.moveTo(mx, y1-H*0.028); g.lineTo(mx, y1+H*0.010); g.stroke();
  chevron(g, Math.min(mx+W*0.026, x1-W*0.014), (y0+y1)/2, H*0.017, 4.5);
}

/* ============ READOUT: sweep percent as seven-segment geometry ============ */
function drawReadout(g,W,H,front){
  const pct = Math.round(clamp01(front)*99);
  const dw=W*0.058, dh=H*0.052, y=H*params.readoutY - dh/2;
  const x = W*0.660;
  seg7(g, x,          y, dw, dh, Math.floor(pct/10));
  seg7(g, x+dw*1.34,  y, dw, dh, pct%10);
  // a broken baseline scale under the readout — 3 uneven ticks, gapped
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="butt";
  const runs=[0.030,0.018,0.026];
  let tx = x;
  for(let i=0;i<runs.length;i++){
    g.beginPath(); g.moveTo(tx, y+dh+H*0.016); g.lineTo(tx+W*runs[i], y+dh+H*0.016); g.stroke();
    tx += W*runs[i] + W*0.016;
  }
}

/* ============ the field ============ */
function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t     = st.t ?? 0;
  const front = st.front ?? params.front;
  const inten = st.intensity ?? params.intensity;
  const fume  = st.fume ?? params.fume;
  const vent  = st.vent ?? params.vent;
  const hiss  = st.hiss ?? params.hiss;
  const taint = st.taint ?? params.taint;
  const layers = st.layers || asset.layers;
  const has = l => layers.includes(l);

  if (has("section"))  drawSection(pen,g,W,H);
  if (has("taint"))    drawTaint(g,W,H,front,taint);
  if (has("purged"))   drawPurged(g,W,H,front);
  if (has("fume"))     drawFume(pen,g,W,H,t,front,fume);
  if (has("front"))    drawFrontMark(pen,g,W,H,front);
  if (has("vent"))     drawVent(pen,g,W,H,t,vent,front);
  if (has("source"))   drawSource(pen,g,W,H,t,inten,hiss);
  if (has("zones"))    drawZoneStrip(pen,g,W,H,front,taint);
  if (has("gauge"))    drawGauge(pen,g,W,H,front,inten);
  if (has("readout"))  drawReadout(g,W,H,front);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"environment.sulfur-and-purification-fire",
  type:"ENVIRONMENT",
  name:"Sulfur and purification fire",
  statusWord:"FUMIGATING",
  scene:"OD-B22-S08",
  plan:"megaron",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["section","taint","purged","fume","front","vent","source","zones","gauge","readout"],

  /* normalized 0..1 field anchors: the source node, the moving front, the
     exits the fume leaves by, and the megaron stations the sweep crosses. */
  anchors:{
    "source:brazier":  { x:0.135, y:0.505 },   // the carried coals + sulfur
    "source:coals":    { x:0.135, y:0.480 },
    "front:lead":      { x:0.550, y:0.400 },   // the advancing boundary
    "front:foot":      { x:0.550, y:0.585 },   // where it meets the washed floor
    "mass:fume":       { x:0.330, y:0.300 },   // the rolled fume body
    "vent:smoke-hole": { x:0.500, y:0.130 },   // up through the roof
    "vent:doors":      { x:0.945, y:0.440 },   // out through the great doors
    "zone:corner-dead":{ x:0.135, y:0.750 },
    "zone:bench-l":    { x:0.320, y:0.750 },
    "zone:hearth":     { x:0.500, y:0.750 },
    "zone:bench-r":    { x:0.690, y:0.750 },
    "zone:threshold":  { x:0.860, y:0.750 },
    "camera:wide":     { x:0.500, y:0.400 },
  },

  /* affected regions, in the section band. `swept` and `standing` are the two
     halves the front divides; `roll` is the ceiling band the fume travels in. */
  zones:{
    swept:    { x0:0.07, y0:0.36, x1:0.55, y1:0.62 },
    standing: { x0:0.60, y0:0.28, x1:0.93, y1:0.62 },
    roll:     { x0:0.13, y0:0.21, x1:0.88, y1:0.40 },
    exits:    { x0:0.42, y0:0.06, x1:0.98, y1:0.24 },
    strip:    { x0:0.07, y0:0.66, x1:0.93, y1:0.88 },
  },

  /* the megaron zones in sweep order — the field crosses them in this order,
     which is what the zone strip reads out. Stations are megaron plan names. */
  sweepOrder:["corner_dead","bench_l1","hearth","bench_r1","threshold"],

  /* ENVIRONMENT state machine: the atlas performance beats, in order */
  states:{
    initial:"sweep-hall",
    nodes:{
      // after-washing: the floor is clean of blood, no fire yet — the hall
      // stands polluted and empty of smoke
      "after-washing":{ preview:{ t:0.2, front:0.0, intensity:0.0, fume:0.0,
                        vent:0.0, hiss:0.0, taint:1.0, status:"WASHED", progress:0.08,
                        layers:["section","taint","zones","gauge","readout"] } },
      // sulfur-charge: lumps laid on the coals, the brazier carried in
      "sulfur-charge":{ preview:{ t:0.6, front:0.05, intensity:0.25, fume:0.10,
                        vent:0.05, hiss:0.5, taint:1.0, status:"CHARGED", progress:0.20 } },
      // kindle: the sulfur catches and hisses, the first fume gathers
      kindle:{ preview:{ t:1.1, front:0.18, intensity:0.60, fume:0.40,
                        vent:0.20, hiss:1.0, taint:0.95, status:"KINDLED", progress:0.34 } },
      // sweep-hall: the front is moving through the zones (neutral)
      "sweep-hall":{ preview:{ t:1.8, front:0.55, intensity:1.00, fume:1.00,
                        vent:0.65, hiss:0.9, taint:0.80, status:"FUMIGATING", progress:0.58 } },
      // saturate: peak fume, the hall full from wall to wall
      saturate:{ preview:{ t:2.4, front:0.80, intensity:1.30, fume:1.40,
                        vent:0.95, hiss:0.7, taint:0.45, status:"SATURATED", progress:0.78 } },
      // vent: the smoke leaves by the smoke-hole and the open doors
      vent:{ preview:{ t:3.0, front:0.96, intensity:0.70, fume:0.85,
                        vent:1.30, hiss:0.3, taint:0.12, status:"VENTING", progress:0.90 } },
      // purified: the field is spent; the hall is paper again
      purified:{ preview:{ t:3.6, front:1.0, intensity:0.10, fume:0.10,
                        vent:0.35, hiss:0.0, taint:0.0, status:"PURIFIED", progress:1.0,
                        layers:["section","purged","vent","source","zones","gauge","readout"] } },
    },
    edges:[["after-washing","sulfur-charge"],["sulfur-charge","kindle"],
           ["kindle","sweep-hall"],["sweep-hall","saturate"],
           ["saturate","vent"],["vent","purified"],["purified","after-washing"]],
  },
  duration:7.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","front","intensity","fume","vent","hiss","taint"],

  /* neutral preview: mid-sweep — the brazier hissing at the throne end, the
     fume mass rolled halfway down the hall, the front crossing the hearth
     zone, taint still standing by the doors. */
  preview:()=>({ t:1.8, front:0.55, intensity:1.0, fume:1.0, vent:0.65,
                 hiss:0.9, taint:0.80, status:"FUMIGATING", progress:0.58,
                 layers:["section","taint","purged","fume","front","vent","source",
                         "zones","gauge","readout"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
