/* prop.antinouss-cup-and-feast-table — the two-handled gold cup Antinous is
   lifting when the first arrow arrives, and the low feast table it stands on.
   PROP asset. Book XXII: "he was on the point of raising a fair goblet, a
   two-eared cup of gold" — the arrow takes his throat, the cup drops from his
   hand, his heel kicks the table over and the bread and roast meat are fouled
   on the floor. The overturned board then stops being furniture and becomes an
   obstacle in the hall.

   So this is ONE object with a career, not six drawings: a vessel with a
   declared capacity and two grips, a board with four feet and a declared
   footprint, and a state channel that carries them from the feast to the
   barricade. The wine level is a real channel (tenths, shown as geometry in
   the header and as a dark disc in the mouth section), and the collision shape
   CHANGES with state — laid it is a low box you walk around, on edge it is a
   tall slab you cannot shoot through.

   States:
     laid        — table set, cup standing at its station, loaf and roast on the board
     raised      — the cup lifted off the board toward the lips; grip ticks at both ears
     struck      — the arrow grazes the rim; the cup jolts, wine leaves the mouth
     spilled     — the cup down on the floor, mouth open, the pool spreading
     overturned  — the board kicked over onto the food; the collapse impulse from beneath
     obstruction — the table up on its edge, top face a vertical slab, the shot stopped

   Upper half is the piece itself: the cup in elevation at scale with its wine
   level, the board seen in plan with its item footprints, the cup mouth in
   section, a broken length caliper and a table-height gauge. Lower half is the
   object in the hall in its current state, with a state ledger beneath.

   No figure is ever drawn. The body is present only as what it does to the
   furniture: a grip, an impulse, a fouled floor.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B22-S01. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  // declared scale (metres / litres)
  cupHeight_m:0.190, cupRim_m:0.135, cupCapacity_l:0.50,
  boardLength_m:0.82, boardWidth_m:0.46, boardThick_m:0.038, tableHeight_m:0.44,

  header:{ y:0.042, h:0.050 },
  study:{
    cup:{ cx:0.190, base:0.332, u:0.186 },
    plan:{ cx:0.545, cy:0.210, s:0.145 },
    mouth:{ cx:0.800, cy:0.203, r:0.070 },
    caliper:{ y:0.296, x0:0.415, x1:0.720 },
    gauge:{ x:0.925, y0:0.145, y1:0.345 },
  },
  divider:0.372,
  floor:0.808,
  ledger:{ y:0.862, h:0.030 },

  // ink levels — light planes, dark accents, plenty of paper showing
  metal:1, metalDark:3, wine:6,
  board:1, rail:2, side:4, leg:3, legBack:2,
  bread:2, meat:5, pool:5,
};

/* ---------------- seven-segment numerals (numbers as GEOMETRY) ---------------- */

const SEG_MAP = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
                  6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };

function segDigit(g, x, y, h, d){
  const w = h*0.56, t = h*0.170, half = h/2;
  const S = {
    a:[x+t*.55, y,          w-t*1.10, t],
    g:[x+t*.55, y+half-t/2, w-t*1.10, t],
    d:[x+t*.55, y+h-t,      w-t*1.10, t],
    f:[x,       y+t*.55,      t, half-t*.85],
    b:[x+w-t,   y+t*.55,      t, half-t*.85],
    e:[x,       y+half+t*.30, t, half-t*.85],
    c:[x+w-t,   y+half+t*.30, t, half-t*.85],
  };
  g.fillStyle = INK;
  for (const s of (SEG_MAP[d] || "")){ const r = S[s]; g.fillRect(r[0], r[1], r[2], r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits, "0");
  const w = h*0.56, gap = h*0.20;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w + gap; }
  return cx - gap - x;
}

/* ---------------- the cup ----------------
   A depas amphikypellon: spreading foot, knopped stem, tulip bowl, two ears.
   All constants in units of u = full cup height, measured UP from the foot. */

const C = {
  footHalf:0.215, footTop:-0.058, stemHalf:0.050, stemTop:-0.300,
  knopY:-0.172, knopR:0.078,
  bowlBot:-0.300, bowlBotHalf:0.100, rimY:-1.000, rimHalf:0.300, rimRy:0.088,
  hTopY:-0.870, hBotY:-0.520, hOut:0.418,
};
/* half-width of the bowl at parameter f (0 at the rim, 1 at the stem join) */
const bowlHalf = f => C.bowlBotHalf + (C.rimHalf-C.bowlBotHalf)*Math.pow(1-clamp(f,0,1), 0.58);
/* f for an absolute local y */
const fAt = y => (y - C.rimY)/(C.bowlBot - C.rimY);

function bowlPath(g, u){
  const N = 12, y0 = C.rimY*u, y1 = C.bowlBot*u;
  g.moveTo(-C.rimHalf*u, y0);
  for (let i=1;i<=N;i++){ const f=i/N; g.lineTo(-bowlHalf(f)*u, lerp(y0,y1,f)); }
  for (let i=N;i>=0;i--){ const f=i/N; g.lineTo( bowlHalf(f)*u, lerp(y0,y1,f)); }
  g.closePath();
}

/* draw the cup about its FOOT CENTRE at (x,y), rotated by rot */
function drawCup(pen, g, o){
  const u = o.u, fill = clamp(o.fill ?? 1, 0, 1), rot = o.rot || 0, mini = !!o.mini;
  const lw = Math.max(2.2, u*0.030);
  g.save(); g.translate(o.x, o.y); if (rot) g.rotate(rot);

  // ears, behind the belly so the bowl overlaps their roots
  if (!mini) for (const s of [-1, 1]){
    const rTop = bowlHalf(fAt(C.hTopY))*u*0.96, rBot = bowlHalf(fAt(C.hBotY))*u;
    pen.limb(()=>{
      g.moveTo(s*rTop, C.hTopY*u);
      g.quadraticCurveTo(s*C.hOut*u, (C.hTopY-0.010)*u, s*C.hOut*u, -0.720*u);
      g.quadraticCurveTo(s*C.hOut*u, (C.hBotY-0.020)*u, s*rBot, C.hBotY*u);
    }, toneSolid(inkLevel(params.metalDark)), Math.max(2.4, u*0.030));
  }

  // spreading foot
  pen.paint(()=>{
    g.moveTo(-C.footHalf*u, 0);
    g.lineTo( C.footHalf*u, 0);
    g.lineTo( C.footHalf*0.52*u, C.footTop*u*0.55);
    g.lineTo( C.stemHalf*1.45*u, C.footTop*u);
    g.lineTo(-C.stemHalf*1.45*u, C.footTop*u);
    g.lineTo(-C.footHalf*0.52*u, C.footTop*u*0.55);
    g.closePath();
  }, toneSolid(inkLevel(params.metalDark)), lw);

  // stem + knop
  pen.paint(()=>{
    g.moveTo(-C.stemHalf*1.25*u, C.footTop*u);
    g.lineTo( C.stemHalf*1.25*u, C.footTop*u);
    g.lineTo( C.stemHalf*u, C.stemTop*u);
    g.lineTo(-C.stemHalf*u, C.stemTop*u);
    g.closePath();
  }, toneSolid(inkLevel(params.metal+1)), lw);
  if (!mini) pen.paint(()=>{ g.ellipse(0, C.knopY*u, C.knopR*u*1.05, C.knopR*u*0.82, 0, 0, 7); },
            toneSolid(inkLevel(params.metalDark)), lw);

  // the bowl — the lightest plane on the object
  pen.paint(()=>{ bowlPath(g, u); }, toneSolid(inkLevel(params.metal)), lw*1.15);

  // one broken hoop seam around the belly, never a full band
  if (!mini) pen.seam(()=>{
    const y = -0.640*u, h = bowlHalf(fAt(-0.640))*u;
    g.moveTo(-h*0.86, y); g.lineTo(-h*0.18, y+u*0.012);
    g.moveTo( h*0.18, y+u*0.012); g.lineTo( h*0.86, y);
  }, Math.max(2, u*0.022));

  // the mouth: a clear paper aperture
  pen.paint(()=>{ g.ellipse(0, C.rimY*u, C.rimHalf*u, C.rimRy*u, 0, 0, 7); },
            toneSolid(inkLevel(0)), lw);

  // the wine surface — the one dark accent on the vessel
  if (fill > 0.03){
    const y = lerp(-0.360, -0.885, fill), h = bowlHalf(fAt(y))*u*0.78;
    pen.paint(()=>{ g.ellipse(0, y*u, h, h*C.rimRy/C.rimHalf, 0, 0, 7); },
              toneSolid(inkLevel(params.wine)), Math.max(2, u*0.020));
  }
  g.restore();
}

export const __cupGeom = C;   // exported for scene-side anchor math

/* ---------------- the table ---------------- */

const T_TH = 0.115, T_LEGH = 0.860, T_LEGW = 0.060, T_LEGX = 0.845;

function tableGeom(cx, cy, s, rot, tilt){
  const dep = clamp(tilt, 0, 1), bx = 0.34*dep, by = -0.46*dep;
  const cos = Math.cos(rot), sin = Math.sin(rot);
  const T = (x,y)=>({ x: cx + (x*cos - y*sin)*s, y: cy + (x*sin + y*cos)*s });
  return { T, bx, by, s, dep, cx, cy, rot,
           onTop:(x,d)=>T(x + bx*d, by*d) };
}
function poly(pen, g, pts, lvl, lw){
  pen.paint(()=>{
    g.moveTo(pts[0].x, pts[0].y);
    for (let i=1;i<pts.length;i++) g.lineTo(pts[i].x, pts[i].y);
    g.closePath();
  }, toneSolid(inkLevel(lvl)), lw);
}

function drawTable(pen, g, G, opt={}){
  const { T, bx, by, s } = G;
  const lw = Math.max(2.6, s*0.030);
  const leg = (x, back)=>{
    const ox = back ? bx : 0, oy = back ? by : 0;
    poly(pen, g, [
      T(x-T_LEGW+ox,       T_TH+oy),
      T(x+T_LEGW+ox,       T_TH+oy),
      T(x+T_LEGW*0.70+ox,  T_TH+T_LEGH+oy),
      T(x-T_LEGW*0.70+ox,  T_TH+T_LEGH+oy),
    ], back ? params.legBack : params.leg, lw);
  };
  leg(-T_LEGX, true); leg(T_LEGX, true);

  // top face — the lightest plane in the frame
  poly(pen, g, [T(-1,0), T(1,0), T(1+bx,by), T(-1+bx,by)], params.board, lw*1.15);
  // grain: three SHORT seams, staggered, never one span
  for (const [d,a,b] of [[0.28,-0.86,-0.18],[0.54,0.06,0.82],[0.79,-0.62,0.30]]){
    const p = G.onTop(a,d), q = G.onTop(b,d);
    pen.seam(()=>{ g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, Math.max(2, s*0.021));
  }
  // turned-away right side — the dark accent of the carpentry
  poly(pen, g, [T(1,0), T(1+bx,by), T(1+bx,by+T_TH), T(1,T_TH)], params.side, lw);
  // front rail
  poly(pen, g, [T(-1,0), T(1,0), T(1,T_TH), T(-1,T_TH)], params.rail, lw);
  // carved fret on the rail: four notches, not a band
  for (const f of [-0.56, 0.00, 0.56]){
    const p = T(f-0.085, T_TH*0.26), q = T(f+0.085, T_TH*0.26),
          r = T(f+0.085, T_TH*0.78), o = T(f-0.085, T_TH*0.78);
    poly(pen, g, [p,q,r,o], 3, Math.max(2, s*0.018));
  }
  leg(-T_LEGX, false); leg(T_LEGX, false);
}

/* ---------------- what sits on the board ---------------- */

function loaf(pen, g, p, r){
  pen.paint(()=>{ g.ellipse(p.x, p.y - r*0.60, r, r*0.68, 0, 0, 7); },
            toneSolid(inkLevel(params.bread)), Math.max(2.2, r*0.16));
  g.strokeStyle = INK; g.lineWidth = Math.max(2, r*0.13); g.lineCap = "round";
  for (const f of [-0.42, 0.02, 0.46]){
    g.beginPath(); g.moveTo(p.x + f*r*0.86, p.y - r*0.96);
    g.lineTo(p.x + f*r*0.86 + r*0.20, p.y - r*0.62); g.stroke();
  }
}
function roast(pen, g, p, r){
  pen.paint(()=>{
    g.moveTo(p.x - r,        p.y - r*0.26);
    g.lineTo(p.x - r*0.56,   p.y - r*0.92);
    g.lineTo(p.x + r*0.60,   p.y - r*0.86);
    g.lineTo(p.x + r,        p.y - r*0.20);
    g.lineTo(p.x + r*0.34,   p.y);
    g.lineTo(p.x - r*0.50,   p.y);
    g.closePath();
  }, toneSolid(inkLevel(params.meat)), Math.max(2.2, r*0.17));
  g.strokeStyle = INK; g.lineWidth = Math.max(2.6, r*0.19); g.lineCap = "round";
  g.beginPath(); g.moveTo(p.x + r*0.74, p.y - r*0.70);
  g.lineTo(p.x + r*1.46, p.y - r*1.02); g.stroke();
}
function knife(pen, g, p, r, rot=0){
  g.save(); g.translate(p.x, p.y); g.rotate(rot);
  poly(pen, g, [{x:-r*1.05,y:-r*0.16},{x:r*0.32,y:-r*0.22},{x:r*0.52,y:0},{x:-r*1.05,y:0}],
       params.metal+1, Math.max(2, r*0.16));
  poly(pen, g, [{x:-r*1.68,y:-r*0.14},{x:-r*1.02,y:-r*0.16},{x:-r*1.02,y:r*0.02},{x:-r*1.68,y:0}],
       4, Math.max(2, r*0.16));
  g.restore();
}
/* the dashed ring the cup belongs in */
function stationRing(g, p, r){
  g.save(); g.setLineDash([6,6]); g.strokeStyle = INK; g.lineWidth = 2.8;
  g.beginPath(); g.ellipse(p.x, p.y, r, r*0.40, 0, 0, 7); g.stroke();
  g.setLineDash([]); g.restore();
}

/* ---------------- the study half ---------------- */

function roundRectPath(g, x, y, w, h, r){
  g.moveTo(x+r, y);
  g.lineTo(x+w-r, y); g.quadraticCurveTo(x+w, y, x+w, y+r);
  g.lineTo(x+w, y+h-r); g.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  g.lineTo(x+r, y+h); g.quadraticCurveTo(x, y+h, x, y+h-r);
  g.lineTo(x, y+r); g.quadraticCurveTo(x, y, x+r, y);
  g.closePath();
}

/* the board seen from directly above, with the footprint of everything that
   stands on it. This is the placement diagram the scene resolves against. */
function planDiagram(pen, g, W, H, M){
  const P = params.study.plan, cx = W*P.cx, cy = H*P.cy, sx = W*P.s, sy = W*P.s*0.56;
  const L = (x,y)=>({ x: cx + x*sx, y: cy + y*sy });

  pen.paint(()=>{ roundRectPath(g, cx-sx, cy-sy, sx*2, sy*2, sx*0.09); },
            toneSolid(inkLevel(params.board)), 4.2);
  // two broken edge seams, the board's own planking
  for (const [d,a,b] of [[-0.34,-0.86,-0.06],[0.36,0.04,0.86]]){
    const p = L(a,d), q = L(b,d);
    pen.seam(()=>{ g.moveTo(p.x,p.y); g.lineTo(q.x,q.y); }, 2.6);
  }
  // the cup station — a dashed ring with a centre cross
  const st = L(0.10, 0.22);
  g.save(); g.setLineDash([8,7]); g.strokeStyle = INK; g.lineWidth = 3.4;
  g.beginPath(); g.arc(st.x, st.y, sx*0.310, 0, 7); g.stroke();
  g.setLineDash([]); g.restore();
  g.strokeStyle = INK; g.lineWidth = 3.6; g.lineCap = "round";
  g.beginPath(); g.moveTo(st.x-sx*0.155, st.y); g.lineTo(st.x+sx*0.155, st.y);
  g.moveTo(st.x, st.y-sx*0.155); g.lineTo(st.x, st.y+sx*0.155); g.stroke();
  // loaf footprint
  const lo = L(-0.60, -0.26);
  pen.paint(()=>{ g.arc(lo.x, lo.y, sx*0.260, 0, 7); }, toneSolid(inkLevel(params.bread)), 3.8);
  // roast footprint — the dark one
  const ro = L(0.62, -0.22);
  pen.paint(()=>{ roundRectPath(g, ro.x-sx*0.270, ro.y-sx*0.185, sx*0.540, sx*0.370, sx*0.08); },
            toneSolid(inkLevel(params.meat)), 3.8);
  // knife footprint
  const kn = L(-0.44, 0.58);
  poly(pen, g, [{x:kn.x-sx*0.34,y:kn.y-sx*0.070},{x:kn.x+sx*0.34,y:kn.y-sx*0.085},
                {x:kn.x+sx*0.34,y:kn.y+sx*0.050},{x:kn.x-sx*0.34,y:kn.y+sx*0.065}],
       params.metal+1, 3.4);
  // datum ticks at the two ends, outside the board
  g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "butt";
  for (const s of [-1,1]){
    g.beginPath(); g.moveTo(cx + s*sx*1.10, cy - sy*0.28);
    g.lineTo(cx + s*sx*1.10, cy + sy*0.28); g.stroke();
  }
  return { st, lo, ro, kn };
}

/* the cup mouth in section: the aperture, its wine disc, the clearance the
   arrow needed and did not take. */
function mouthSection(pen, g, W, H, M){
  const S = params.study.mouth, cx = W*S.cx, cy = H*S.cy, R = W*S.r;
  pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(2)), 4.2);
  pen.paint(()=>{ g.arc(cx, cy, R*0.84, 0, 7); }, toneSolid(inkLevel(0)), 3.2);
  const fl = clamp(M.wine/10, 0, 1);
  if (fl > 0.03)
    pen.paint(()=>{ g.arc(cx, cy, R*0.60*Math.sqrt(fl), 0, 7); },
              toneSolid(inkLevel(5)), 2.6);
  // four level ticks, wall inward
  g.strokeStyle = INK; g.lineWidth = 2.8; g.lineCap = "butt";
  for (let i=0;i<4;i++){
    const a = i/4*Math.PI*2 + Math.PI/4;
    g.beginPath();
    g.moveTo(cx+Math.cos(a)*R*0.99, cy+Math.sin(a)*R*0.99);
    g.lineTo(cx+Math.cos(a)*R*0.84, cy+Math.sin(a)*R*0.84); g.stroke();
  }
  // the ears in plan, two short stubs
  for (const s of [-1,1]){
    poly(pen, g, [{x:cx+s*R*0.98,y:cy-R*0.10},{x:cx+s*R*1.42,y:cy-R*0.13},
                  {x:cx+s*R*1.42,y:cy+R*0.13},{x:cx+s*R*0.98,y:cy+R*0.10}],
         params.metalDark, 3);
  }
}

/* broken-scale caliper: the declared length of the board */
function caliper(pen, g, W, H){
  const K = params.study.caliper, x0 = W*K.x0, x1 = W*K.x1, y = H*K.y, t = H*0.016;
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "butt";
  for (const x of [x0, x1]){ g.beginPath(); g.moveTo(x, y-t); g.lineTo(x, y+t); g.stroke(); }
  for (const [a,b] of [[0.02,0.30],[0.38,0.62],[0.70,0.98]]){
    g.lineWidth = 4.6;
    g.beginPath(); g.moveTo(x0+(x1-x0)*a, y); g.lineTo(x0+(x1-x0)*b, y); g.stroke();
  }
  g.lineWidth = 2.6;
  for (const f of [0.34, 0.66]){ const x = x0+(x1-x0)*f;
    g.beginPath(); g.moveTo(x, y-t*0.55); g.lineTo(x, y+t*0.55); g.stroke(); }
}

/* table-height gauge: floor to board face */
function heightGauge(pen, g, W, H){
  const G = params.study.gauge, x = W*G.x, y0 = H*G.y0, y1 = H*G.y1;
  g.save(); g.setLineDash([6,7]); g.strokeStyle = INK; g.lineWidth = 2.6;
  g.beginPath(); g.moveTo(x, y0+H*0.026); g.lineTo(x, y1-H*0.028); g.stroke();
  g.setLineDash([]); g.restore();
  g.strokeStyle = INK; g.lineWidth = 4.2; g.lineCap = "butt";
  for (const f of [0.18, 0.50, 0.82]){ const y = y0+(y1-y0)*f;
    g.beginPath(); g.moveTo(x-W*0.030, y); g.lineTo(x+W*0.030, y); g.stroke(); }
  g.fillStyle = INK;
  g.beginPath(); g.moveTo(x, y0); g.lineTo(x-W*0.026, y0+H*0.030);
  g.lineTo(x+W*0.026, y0+H*0.030); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(x, y1); g.lineTo(x-W*0.026, y1-H*0.030);
  g.lineTo(x+W*0.026, y1-H*0.030); g.closePath(); g.fill();
  pen.ink(()=>{ g.moveTo(x-W*0.055, y1); g.lineTo(x+W*0.055, y1); }, 4.6);
}

/* a broken rule dividing the piece study from the hall */
function divider(pen, g, W, H){
  const y = H*params.divider;
  for (const [a,b] of [[0.052,0.235],[0.295,0.455],[0.520,0.700],[0.760,0.948]])
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 5.2);
}

/* ---------------- header: two counters read as geometry ---------------- */

function header(pen, g, W, H, M){
  const dh = H*params.header.h, dy = H*params.header.y, cy = dy + dh/2;
  // a small cup mark, carrying the live wine level
  drawCup(pen, g, { x:W*0.068, y:cy+dh*0.50, u:dh*0.98, fill:M.wine/10, mini:true });
  segNumber(g, W*0.128, dy, dh, M.wine, 2);       // wine in tenths
  // the shot, broken, between the two counters
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  for (const [a,b] of [[0.300,0.348],[0.376,0.424],[0.452,0.500]]){
    g.beginPath(); g.moveTo(W*a, cy); g.lineTo(W*b, cy); g.stroke(); }
  g.fillStyle = INK; g.beginPath();
  g.moveTo(W*0.560, cy); g.lineTo(W*0.518, cy-dh*0.26);
  g.lineTo(W*0.518, cy+dh*0.26); g.closePath(); g.fill();
  segNumber(g, W*0.660, dy, dh, M.onBoard, 2);    // items still on the board
  // the board mark on the right: the footprint seen from above
  const bx = W*0.885, bw = W*0.070, bh = dh*0.66;
  pen.paint(()=>{ roundRectPath(g, bx-bw/2, cy-bh/2, bw, bh, bw*0.10); },
            toneSolid(inkLevel(M.onBoard ? params.board : 5)), 3.4);
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "round";
  g.beginPath(); g.moveTo(bx-bw*0.22, cy); g.lineTo(bx+bw*0.22, cy); g.stroke();
}

/* ---------------- hall overlays ---------------- */

function floorLine(pen, g, W, H, G){
  const y = H*params.floor;
  for (const [a,b] of [[0.045,0.230],[0.285,0.520],[0.575,0.760],[0.815,0.955]])
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 5.0);
  // the far floor: short ticks only, under the back feet
  if (G){
    const yb = y + G.by*G.s;
    g.strokeStyle = INK; g.lineWidth = 2.8; g.lineCap = "butt";
    for (const x of [-T_LEGX, T_LEGX]){
      const p = G.T(x + G.bx, T_TH + T_LEGH + G.by);
      g.beginPath(); g.moveTo(p.x - G.s*0.16, p.y); g.lineTo(p.x + G.s*0.16, p.y); g.stroke();
    }
    void yb;
  }
}

/* grip ticks at the two ears — a hand is present only as this */
function gripTicks(g, o){
  const u = o.u, rot = o.rot||0;
  g.save(); g.translate(o.x, o.y); if (rot) g.rotate(rot);
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "round";
  for (const s of [-1,1]){
    for (const f of [-0.06, 0.06]){
      g.beginPath();
      g.moveTo(s*C.hOut*u*1.12, (-0.700+f)*u);
      g.lineTo(s*C.hOut*u*1.36, (-0.700+f*1.4)*u);
      g.stroke();
    }
  }
  g.restore();
}
/* dashed drop line from a lifted cup back to its station */
function dropLine(g, from, to){
  g.save(); g.setLineDash([6,7]); g.strokeStyle = INK; g.lineWidth = 2.6;
  g.beginPath(); g.moveTo(from.x, from.y); g.lineTo(to.x, to.y); g.stroke();
  g.setLineDash([]); g.restore();
}

/* the arrow: it grazes the rim and goes on. Streaks behind, head beyond. */
function shot(pen, g, W, H, a, b){
  g.strokeStyle = "rgba(0,0,0,0.40)"; g.lineCap = "round";
  for (let i=0;i<5;i++){
    g.lineWidth = 3.0 + i*0.4;
    const t0 = i*0.055, t1 = t0 + 0.038;
    g.beginPath();
    g.moveTo(lerp(a.x,b.x,t0), lerp(a.y,b.y,t0));
    g.lineTo(lerp(a.x,b.x,t1), lerp(a.y,b.y,t1)); g.stroke();
  }
  pen.ink(()=>{ g.moveTo(lerp(a.x,b.x,0.44), lerp(a.y,b.y,0.44)); g.lineTo(b.x, b.y); }, 4.6);
  const ang = Math.atan2(b.y-a.y, b.x-a.x), hl = H*0.026;
  g.save(); g.translate(b.x, b.y); g.rotate(ang);
  g.fillStyle = INK; g.beginPath();
  g.moveTo(hl*0.9, 0); g.lineTo(-hl*0.6, -hl*0.34); g.lineTo(-hl*0.6, hl*0.34);
  g.closePath(); g.fill(); g.restore();
  // fletching at the tail of the drawn stretch
  const fx = lerp(a.x,b.x,0.44), fy = lerp(a.y,b.y,0.44);
  g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round";
  for (const s of [-1,1]){
    g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + H*0.020, fy + s*H*0.014); g.stroke();
    g.beginPath(); g.moveTo(fx + H*0.014, fy); g.lineTo(fx + H*0.034, fy + s*H*0.014); g.stroke();
  }
}

/* where a cup's mouth actually points, given its rotation */
function mouthOf(o){
  const r = o.rot || 0;
  return { x: o.x + Math.sin(r)*o.u*0.94, y: o.y - Math.cos(r)*o.u*0.94 };
}
/* wine leaving the mouth on the jolt: a dashed arc plus loose drops */
function leap(pen, g, W, H, o){
  const u = o.u, m = mouthOf(o), x0 = m.x, y0 = m.y;
  g.save(); g.setLineDash([8,6]); g.strokeStyle = INK; g.lineWidth = 4.2; g.lineCap="butt";
  g.beginPath(); g.moveTo(x0, y0);
  g.quadraticCurveTo(x0 + u*0.52, y0 - u*0.92, x0 + u*1.24, y0 - u*0.62);
  g.stroke(); g.setLineDash([]); g.restore();
  g.fillStyle = INK;
  for (const [dx,dy,r] of [[0.62,-0.66,0.070],[0.96,-0.82,0.055],[1.34,-0.50,0.078],[0.30,-0.44,0.048]]){
    g.beginPath(); g.arc(x0+u*dx, y0+u*dy, u*r, 0, 7); g.fill();
  }
}

/* the pool: an irregular blob, a dashed spread limit, a few splash ticks */
function pool(pen, g, W, H, cx, cy, r){
  pen.paint(()=>{
    const N = 11;
    for (let i=0;i<N;i++){
      const a = i/N*Math.PI*2;
      const k = 1 + 0.20*Math.sin(i*2.3) + 0.10*Math.cos(i*1.7);
      const x = cx + Math.cos(a)*r*k, y = cy + Math.sin(a)*r*0.34*k;
      i ? g.lineTo(x,y) : g.moveTo(x,y);
    }
    g.closePath();
  }, toneSolid(inkLevel(params.pool)), 3.4);
  g.save(); g.setLineDash([5,6]); g.strokeStyle = INK; g.lineWidth = 2.4;
  g.beginPath(); g.ellipse(cx, cy, r*1.44, r*0.50, 0, 0, 7); g.stroke();
  g.setLineDash([]); g.restore();
  g.fillStyle = INK;
  for (const [dx,dy,s] of [[-1.32,-0.16,0.10],[1.30,0.14,0.09],[0.30,-0.40,0.07],[-0.55,0.42,0.08]]){
    g.beginPath(); g.arc(cx+r*dx, cy+r*dy*1.1, r*s, 0, 7); g.fill();
  }
}
/* the thread from a tipped mouth down to the pool */
function thread(pen, g, from, to){
  pen.ink(()=>{ g.moveTo(from.x, from.y);
    g.quadraticCurveTo(from.x + (to.x-from.x)*0.20, (from.y+to.y)/2, to.x, to.y); }, 3.4);
}

/* the collapse impulse: a heavy short arrow into the underside of the board */
function kick(pen, g, W, H, p, ang){
  const L = H*0.070;
  g.save(); g.translate(p.x, p.y); g.rotate(ang);
  g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = "butt";
  g.beginPath(); g.moveTo(-L*1.55, 0); g.lineTo(-L*0.55, 0); g.stroke();
  g.fillStyle = INK; g.beginPath();
  g.moveTo(0,0); g.lineTo(-L*0.52, -L*0.34); g.lineTo(-L*0.52, L*0.34); g.closePath(); g.fill();
  // shock ticks
  g.lineWidth = 3.2; g.lineCap = "round";
  for (const s of [-1,1]) for (const f of [0.6,1.0]){
    g.beginPath(); g.moveTo(L*0.16, s*L*0.30*f); g.lineTo(L*0.46, s*L*0.52*f); g.stroke();
  }
  g.restore();
}
/* dashed ghost of the board where it stood before the kick */
function ghostBoard(g, G){
  const p = [G.T(-1,0), G.T(1,0), G.T(1+G.bx,G.by), G.T(-1+G.bx,G.by)];
  g.save(); g.setLineDash([7,7]); g.strokeStyle = INK; g.lineWidth = 2.8; g.lineJoin="round";
  g.beginPath(); g.moveTo(p[0].x,p[0].y);
  for (let i=1;i<4;i++) g.lineTo(p[i].x,p[i].y);
  g.closePath(); g.stroke(); g.setLineDash([]); g.restore();
}
/* the collision slab the table becomes on edge, and the shots it stops */
function barrier(pen, g, W, H, G){
  const a = G.T(-1,0), b = G.T(1,0);
  g.save(); g.setLineDash([8,7]); g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath();
  g.rect(Math.min(a.x,b.x) - G.s*0.34, Math.min(a.y,b.y) - G.s*0.10,
         Math.abs(b.x-a.x) + G.s*0.68, Math.abs(b.y-a.y) + G.s*0.20);
  g.stroke(); g.setLineDash([]); g.restore();
  // three shots from the right that stop at the face
  const face = Math.max(a.x,b.x) + G.s*0.18;
  const yLo = Math.min(a.y,b.y), span = Math.abs(b.y-a.y);
  for (let i=0;i<3;i++){
    const y = lerp(yLo + span*0.30, yLo + span*0.72, i/2);
    g.save(); g.setLineDash([9,7]); g.strokeStyle = INK; g.lineWidth = 3.4;
    g.beginPath(); g.moveTo(face + G.s*1.55, y + (i-1)*H*0.016); g.lineTo(face + G.s*0.30, y);
    g.stroke(); g.setLineDash([]); g.restore();
    g.strokeStyle = INK; g.lineWidth = 3.6; g.lineCap = "round";
    const k = G.s*0.095, fx = face + G.s*0.16;
    g.beginPath();
    g.moveTo(fx-k, y-k); g.lineTo(fx+k, y+k);
    g.moveTo(fx+k, y-k); g.lineTo(fx-k, y+k);
    g.stroke();
  }
}

/* ---------------- ledger ---------------- */

const ORDER = ["laid","raised","struck","spilled","overturned","obstruction"];

function ledger(pen, g, W, H, cur){
  const y = H*params.ledger.y, hh = H*params.ledger.h;
  const gapW = W*0.034, span = W*0.876 - gapW, per = span/6;
  let x = W*0.062;
  for (let grp=0; grp<2; grp++){
    pen.ink(()=>{ g.moveTo(x + per*0.12, y+hh+H*0.017);
                  g.lineTo(x + per*3 - per*0.12, y+hh+H*0.017); }, 4.4);
    for (let i=0;i<3;i++){
      const idx = grp*3 + i, bw = per*0.62, bx = x + (per-bw)/2;
      if (idx < cur){
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(1)), 3);
        g.strokeStyle = INK; g.lineWidth = 3.6; g.lineCap="round"; g.lineJoin="round";
        g.beginPath(); g.moveTo(bx+bw*0.22, y+hh*0.52); g.lineTo(bx+bw*0.42, y+hh*0.80);
        g.lineTo(bx+bw*0.80, y+hh*0.20); g.stroke();
      } else if (idx === cur){
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(6)), 3.4);
        g.strokeStyle = INK; g.lineWidth = 3.6; g.lineCap="round"; g.lineJoin="round";
        g.beginPath(); g.moveTo(bx+bw*0.30, y-H*0.011); g.lineTo(bx+bw*0.50, y-H*0.026);
        g.lineTo(bx+bw*0.70, y-H*0.011); g.stroke();
      } else {
        g.save(); g.setLineDash([8,6]); g.strokeStyle = INK; g.lineWidth = 3.4;
        g.beginPath(); g.rect(bx, y, bw, hh); g.stroke(); g.setLineDash([]); g.restore();
      }
      x += per;
    }
    x += gapW;
  }
}

/* ---------------- state table ---------------- */

const STAND = { cx:0.395, cy:0.658, s:0.205, rot:0, tilt:0.86 };

const MODES = {
  laid:{ status:"LAID", progress:0.10, wine:10, onBoard:4,
         table:STAND, board:true, station:true, cup:{ at:"board", fill:1.00, rot:0 } },
  raised:{ status:"RAISED", progress:0.26, wine:10, onBoard:3,
           table:STAND, board:true, station:"ghost", grip:true, drop:true,
           cup:{ at:"lift", fill:0.94, rot:-0.11 } },
  struck:{ status:"STRUCK", progress:0.46, wine:8, onBoard:3,
           table:STAND, board:true, station:"ghost", shot:true, leap:true,
           cup:{ at:"jolt", fill:0.62, rot:0.34 } },
  spilled:{ status:"SPILLED", progress:0.62, wine:0, onBoard:3,
            table:STAND, board:true, station:"ghost", pool:true, thread:true,
            cup:{ at:"floor", x:0.820, fill:0, rot:-1.48 } },
  overturned:{ status:"OVERTURNED", progress:0.82, wine:0, onBoard:0,
               table:{ cx:0.400, cy:0.703, s:0.194, rot:2.842, tilt:0.80 },
               board:false, scatter:true, kick:true, ghost:true, pool:true,
               cup:{ at:"floor", x:0.845, fill:0, rot:-1.62 } },
  obstruction:{ status:"OBSTRUCTION", progress:1.00, wine:0, onBoard:0,
                table:{ cx:0.330, cy:0.660, s:0.205, rot:-1.62, tilt:0.26 },
                board:false, barrier:true, scatterLite:true,
                cup:{ at:"floor", x:0.640, fill:0, rot:1.62 } },
};

/* ---------------- the render ---------------- */

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const M = MODES[st.mode] || MODES.raised;
  const cur = Math.max(0, ORDER.indexOf(st.mode in MODES ? st.mode : "raised"));
  const floorY = H*params.floor;

  header(pen, g, W, H, M);

  // ── the piece at scale ──
  const S = params.study.cup;
  drawCup(pen, g, { x:W*S.cx, y:H*S.base, u:H*S.u, fill:M.wine/10 });
  gripTicks(g, { x:W*S.cx, y:H*S.base, u:H*S.u });
  planDiagram(pen, g, W, H, M);
  mouthSection(pen, g, W, H, M);
  caliper(pen, g, W, H);
  heightGauge(pen, g, W, H);
  divider(pen, g, W, H);

  // ── the object in the hall ──
  const P = M.table;
  const G = tableGeom(W*P.cx, H*P.cy, W*P.s, P.rot, P.tilt);
  const REST = tableGeom(W*STAND.cx, H*STAND.cy, W*STAND.s, STAND.rot, STAND.tilt);
  const station = REST.onTop(0.10, 0.38);
  const u  = H*0.125, uf = H*0.104;

  floorLine(pen, g, W, H, P.rot === 0 ? G : null);
  if (M.ghost) ghostBoard(g, REST);
  drawTable(pen, g, G);

  if (M.board){
    loaf (pen, g, G.onTop(-0.58, 0.45), G.s*0.185);
    roast(pen, g, G.onTop( 0.42, 0.48), G.s*0.175);
  }
  if (M.station) stationRing(g, station, G.s*0.215);

  if (M.scatter){
    loaf (pen, g, { x:W*0.088, y:floorY }, W*0.046);
    roast(pen, g, { x:W*0.735, y:floorY + H*0.005 }, W*0.042);
    knife(pen, g, { x:W*0.878, y:floorY - H*0.003 }, W*0.038, 0.34);
    g.fillStyle = INK;
    for (const [fx,fy,r] of [[0.318,0.822,0.006],[0.660,0.820,0.005],[0.930,0.804,0.006]]){
      g.beginPath(); g.arc(W*fx, H*fy, W*r, 0, 7); g.fill();
    }
  }
  if (M.scatterLite){
    loaf(pen, g, { x:W*0.780, y:floorY }, W*0.042);
    g.fillStyle = INK;
    for (const [fx,fy,r] of [[0.680,0.804,0.005],[0.885,0.806,0.006]]){
      g.beginPath(); g.arc(W*fx, H*fy, W*r, 0, 7); g.fill();
    }
  }
  if (M.pool) pool(pen, g, W, H, W*0.600, floorY + H*0.012, W*0.070);

  // where the cup is now
  const at = M.cup.at;
  const cupPos = at === "board" ? { x:station.x, y:station.y, u }
              : at === "lift"  ? { x:station.x + W*0.078, y:station.y - H*0.112, u }
              : at === "jolt"  ? { x:station.x + W*0.096, y:station.y - H*0.100, u }
              :                  { x:W*M.cup.x, y:floorY - uf*0.20, u:uf };
  const cupO = { ...cupPos, fill:M.cup.fill, rot:M.cup.rot };

  if (M.shot){
    const a = { x:W*0.090, y:H*0.388 }, b = { x:W*0.870, y:H*0.478 };
    shot(pen, g, W, H, a, b);
  }
  if (M.drop) dropLine(g, { x:cupO.x, y:cupO.y + u*0.10 }, station);
  drawCup(pen, g, cupO);
  if (M.grip) gripTicks(g, cupO);
  if (M.leap) leap(pen, g, W, H, cupO);
  if (M.thread){
    const m = mouthOf(cupO);
    thread(pen, g, { x:m.x, y:m.y + uf*0.12 }, { x:W*0.668, y:floorY + H*0.004 });
  }
  if (M.kick) kick(pen, g, W, H, { x:W*0.215, y:H*0.733 }, -0.30);
  if (M.barrier) barrier(pen, g, W, H, G);

  ledger(pen, g, W, H, cur);
}

/* ---------------- the asset ---------------- */

export const asset = {
  id:"prop.antinouss-cup-and-feast-table",
  type:"PROP",
  name:"Antinous's Cup and Feast Table",
  statusWord:"RAISED",
  scene:"OD-B22-S01",

  params,
  layers:["counts","cup-study","board-plan","mouth-section","caliper","gauge","divider",
          "floor","ghost-board","table","board-service","station","scatter","pool",
          "shot","cup","grip","spill","impulse","barrier","ledger"],

  // normalized 0..1 anchors, measured in the LAID state
  anchors:{
    // the vessel, on the piece study — grips and contacts
    "grip:ear-l":     {x:.086, y:.202},
    "grip:ear-r":     {x:.294, y:.202},
    "lip:cup":        {x:.190, y:.146},   // the mouth at a drinker's lip
    "balance:cup":    {x:.190, y:.220},   // where a one-hand carry takes it
    "foot:cup":       {x:.190, y:.332},   // the cup's own contact plane
    // the board, in the hall
    "stand:cup":      {x:.438, y:.635},   // the cup's station on the board
    "board:centre":   {x:.425, y:.628},
    "board:front-l":  {x:.190, y:.658},
    "board:front-r":  {x:.600, y:.658},
    "board:back-l":   {x:.250, y:.597},
    "board:back-r":   {x:.660, y:.597},
    "carry:edge":     {x:.600, y:.658},   // the rail seized to lift it as a shield
    "serve:loaf":     {x:.303, y:.631},
    "serve:roast":    {x:.510, y:.629},
    "serve:knife":    {x:.352, y:.646},
    // contacts with the floor
    "support:foot-fl":{x:.222, y:.808},
    "support:foot-fr":{x:.568, y:.808},
    "support:foot-bl":{x:.282, y:.747},
    "support:foot-br":{x:.628, y:.747},
    "contact:floor":  {x:.395, y:.808},
    // the events the object records
    "lift:cup":       {x:.516, y:.523},   // the foot of the raised cup
    "impact:arrow":   {x:.534, y:.439},   // where the shaft grazes the rim
    "spill:pool":     {x:.600, y:.820},
    "kick:underside": {x:.215, y:.733},   // where the heel takes the board
    "shield:face":    {x:.330, y:.660},   // the slab centre, on edge
  },

  // collision: the low box the standing table occupies; on edge it becomes a
  // tall slab, so the shape is declared per state
  collision:{ kind:"box", a:{x:.185, y:.590}, b:{x:.672, y:.815} },
  collisionByState:{
    laid:       { kind:"box", a:{x:.185, y:.590}, b:{x:.672, y:.815} },
    raised:     { kind:"box", a:{x:.185, y:.590}, b:{x:.672, y:.815} },
    struck:     { kind:"box", a:{x:.185, y:.590}, b:{x:.672, y:.815} },
    spilled:    { kind:"box", a:{x:.185, y:.590}, b:{x:.845, y:.826} },
    overturned: { kind:"box", a:{x:.185, y:.528}, b:{x:.610, y:.822} },
    obstruction:{ kind:"box", a:{x:.300, y:.498}, b:{x:.552, y:.818} },
  },
  ownership:"house-of-odysseus · hall furniture and plate of the megaron, set out "
          + "nightly for the suitors; this board and this two-eared gold cup are in "
          + "Antinous's use at the moment of the first shot, and revert to the house",

  states:{
    initial:"laid",
    nodes:{
      laid:       { preview:{ mode:"laid",        status:"LAID",        progress:0.10 } },
      raised:     { preview:{ mode:"raised",      status:"RAISED",      progress:0.26 } },
      struck:     { preview:{ mode:"struck",      status:"STRUCK",      progress:0.46 } },
      spilled:    { preview:{ mode:"spilled",     status:"SPILLED",     progress:0.62 } },
      overturned: { preview:{ mode:"overturned",  status:"OVERTURNED",  progress:0.82 } },
      obstruction:{ preview:{ mode:"obstruction", status:"OBSTRUCTION", progress:1.00 } },
    },
    edges:[
      ["laid","raised"],["raised","laid"],
      ["raised","struck"],["struck","spilled"],
      ["spilled","overturned"],["struck","overturned"],
      ["overturned","obstruction"],["obstruction","overturned"],
      ["spilled","laid"],["overturned","laid"],
    ],
  },
  channels:["mode","wine","grip","impulse","t","progress"],

  // CARD SIGNATURE — RAISED: the cup off the board and up on its dashed lift
  // line, both ears gripped, the board still whole beneath it. One frame before.
  preview:()=>({ mode:"raised", status:"RAISED", progress:0.26, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
