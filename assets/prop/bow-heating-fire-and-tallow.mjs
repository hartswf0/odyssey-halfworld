/* prop.bow-heating-fire-and-tallow — Melanthius's remedy.
   PROP asset. Book XXI, OD-B21-S03: one suitor after another fails to string
   the bow, so the goatherd calls for fire and a wheel of fat — "warm the great
   bow and grease it" — and the men try again. The object is therefore not a
   brazier and not a lump of tallow: it is a SERVICE APPLIED TO A LIMB, and the
   only honest way to draw it is as the instrument plus the measurement it
   produces. So this module carries:

     · a portable three-legged brazier — charcoal bed, pierced rim, ring
       handles, blocky flame tongues (fire is LIGHT here: paper tongues with a
       hard contour, never a dark mass)
     · a heat column of broken chevrons rising off the bed
     · the LIMB the fire serves, drawn as a registration stave — this prop
       never redraws prop.odysseuss-bow, it draws the deflection the bow is
       being asked for: a dashed REQUIRED curve and a solid ACHIEVED stave
     · a cake of tallow on its platter with a horn scoop, and a two-cell melt
       section (SOLID -> RUN) that says what the heat is doing to the fat
     · a heat ladder, a bend protractor, a greased-limb section, and a
       five-cell state ledger

   The point of the whole diagram is that it FAILS. Warmed and greased, the
   limb still comes nowhere near the required deflection: the achieved needle
   sits low, the deficit sector stays open, and an X strikes the gap. Only
   Odysseus closes it, and this prop is not present when he does.

   States (all four the scene calls for, plus the dormant initial):
     dormant     — cold pan, grey coals, the cake whole, no limb over the fire
     warm        — lit; the limb held in the heat column, fat softening
     apply       — a wedge cut from the cake, the scoop loaded, grease laid on
                   the limb as a film collar
     flex-assist — warmed and greased, the limb bending under a suitor: the
                   achieved needle climbs, still short of required
     ineffective — the fire burning down, the limb almost straight, the deficit
                   sector wide open and struck through

   Numerals are drawn as seven-segment GEOMETRY, never as small type.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B21-S03. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  // declared scale (metres)
  panDiameter_m: 0.46, panHeight_m: 0.44, tallowCake_m: 0.19,
  requiredBend_deg: 48,          // the deflection that lets the string go on

  groundY: 0.672,                // the one floor both stations stand on

  pan:    { cx:0.330, rimY:0.508, rw:0.168, flat:0.300, deep:0.082 },
  // the limb crosses the sheet on a DIAGONAL — held over the fire by hands
  // off-frame — so it can never be mistaken for a structural span
  limb:   { ax:0.106, ay:0.178, bx:0.614, by:0.308, sagBase:0.020, sagMax:0.064,
            thNock:0.009, thGrip:0.021, recurve:0.030 },
  heatCol:{ xs:[0.238,0.330,0.422], y0:0.300, dy:0.042, rows:4 },
  ladder: { cx:0.700, hw:0.032, y1:0.502, rh:0.021, gap:0.014, rungs:6 },
  tallow: { cx:0.815, rDish:0.115, cakeH:0.086, cakeW:0.062 },
  melt:   { y:0.140, h:0.100, ax:0.722, bx:0.888, w:0.070 },
  head:   { y:0.058, h:0.048, heatX:0.135, bendX:0.638 },
  prot:   { px:0.130, py:0.860, R:0.200 },
  film:   { cx:0.545, cy:0.800, R:0.075 },
  ledger: { x0:0.775, x1:0.940, y0:0.712, h:0.028, gap:0.0075 },
};

/* ---- ink levels. Light planes, dark accents, plenty of paper. ---- */
const PAN     = 2;   // bronze pan wall — a LIGHT metal
const PAN_D   = 3;   // legs, underside, shaded rim
const RIM     = 3;   // the rim band
const CAV     = 1;   // the hollow above the bed — a whisper
const ASH     = 2;   // dead charcoal
const COAL    = 6;   // live charcoal — the darkest accent in the piece
const FLAME_I = 2;   // the inner tongue; the outer tongue is paper
const TALLOW  = 1;   // fat is nearly paper
const TALLOW_D= 2;   // the cut face / slump shadow
const DISH    = 2;   // the platter
const SCOOP   = 3;   // horn scoop
const FILM    = 3;   // grease laid on the limb
const STAVE   = 2;   // the limb stave
const FILL    = 5;   // filled gauge rungs / spent ledger cells

/* ---------------- seven-segment numerals (numbers as GEOMETRY) ---------- */

const SEG = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
              6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };

function segDigit(g, x, y, h, d){
  const w = h*0.56, t = h*0.170, half = h/2;
  const S = {
    a:[x+t*.55, y,           w-t*1.10, t],
    g:[x+t*.55, y+half-t/2,  w-t*1.10, t],
    d:[x+t*.55, y+h-t,       w-t*1.10, t],
    f:[x,       y+t*.55,     t, half-t*.85],
    b:[x+w-t,   y+t*.55,     t, half-t*.85],
    e:[x,       y+half+t*.30, t, half-t*.85],
    c:[x+w-t,   y+half+t*.30, t, half-t*.85],
  };
  g.fillStyle = INK;
  for (const s of (SEG[d] || "")){ const r = S[s]; g.fillRect(r[0], r[1], r[2], r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits, "0");
  const w = h*0.56, gap = h*0.22;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w + gap; }
  return cx - gap - x;
}

/* ---------------- small shared shapes ---------------- */

function dashed(g, fn, dash=[6,6], lw=2.6){
  g.save(); g.setLineDash(dash);
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt"; g.lineJoin = "round";
  g.beginPath(); fn(); g.stroke();
  g.setLineDash([]); g.restore();
}

/* a blocky flame tongue: stepped zigzag flanks, PAPER body, hard contour.
   Fire in this idiom is the lightest thing on the sheet. */
function tonguePath(g, x, base, w, h, k){
  const s = w/2;
  g.moveTo(x-s,        base);
  g.lineTo(x-s*0.88,   base-h*0.30);
  g.lineTo(x-s*0.44,   base-h*0.23);
  g.lineTo(x-s*0.56,   base-h*0.62);
  g.lineTo(x-s*0.18,   base-h*0.54);
  g.lineTo(x+s*0.10*k, base-h);
  g.lineTo(x+s*0.32,   base-h*0.51);
  g.lineTo(x+s*0.64,   base-h*0.60);
  g.lineTo(x+s*0.50,   base-h*0.21);
  g.lineTo(x+s*0.90,   base-h*0.27);
  g.lineTo(x+s,        base);
  g.closePath();
}
function flame(pen, g, x, base, w, h, k, core=true){
  pen.paint(()=>{ tonguePath(g, x, base, w, h, k); }, toneSolid(inkLevel(0)), 4.2);
  if (core) pen.paint(()=>{ tonguePath(g, x, base, w*0.44, h*0.52, 1-k*0.4); },
                      toneSolid(inkLevel(FLAME_I)), 3.0);
}

/* one charcoal lump — an irregular hexagon */
function lump(pen, g, x, y, r, level, seed){
  pen.paint(()=>{
    for (let i=0;i<6;i++){
      const a = i/6*Math.PI*2 + 0.42 + seed*0.31;
      const rr = r*(0.76 + ((i+seed)%3)*0.13);
      const px = x + Math.cos(a)*rr, py = y + Math.sin(a)*rr*0.70;
      if (i===0) g.moveTo(px,py); else g.lineTo(px,py);
    }
    g.closePath();
  }, toneSolid(inkLevel(level)), 3);
}

/* ---------------- the brazier ---------------- */

function leg(pen, g, x0, y0, x1, y1, w0, w1, level){
  pen.paint(()=>{
    g.moveTo(x0-w0, y0); g.lineTo(x0+w0, y0);
    g.lineTo(x1+w1, y1); g.lineTo(x1-w1, y1); g.closePath();
  }, toneSolid(inkLevel(level)), 4.2);
  pen.paint(()=>{ g.ellipse(x1, y1, w1*2.1, w1*0.95, 0, 0, 7); },
            toneSolid(inkLevel(level+1)), 3.2);
}

const COALS = [[-0.66,0.22,0.17],[-0.24,-0.10,0.15],[0.14,0.28,0.16],
               [0.52,-0.04,0.14],[0.72,0.34,0.12]];

function brazier(pen, g, W, H, M, t){
  const P = params.pan;
  const cx = W*P.cx, ry = H*P.rimY, rw = W*P.rw, rh = rw*P.flat;
  const bd = H*P.deep, gy = H*params.groundY, bot = ry+bd;

  // ── far leg, behind the bowl ──
  leg(pen, g, cx, ry+rh*0.35, cx + rw*0.06, gy-H*0.010, rw*0.085, rw*0.050, PAN_D);

  // ── bowl exterior ──
  pen.paint(()=>{
    g.moveTo(cx-rw, ry);
    g.bezierCurveTo(cx-rw*1.00, ry+bd*0.55, cx-rw*0.74, ry+bd, cx-rw*0.44, ry+bd);
    g.lineTo(cx+rw*0.44, ry+bd);
    g.bezierCurveTo(cx+rw*0.74, ry+bd, cx+rw*1.00, ry+bd*0.55, cx+rw, ry);
    g.ellipse(cx, ry, rw, rh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(PAN)), 6);

  // hammer courses — short, broken, never a span
  for (let i=1;i<=2;i++){
    const yy = ry + bd*(0.26+0.30*i), hw = rw*(0.94-0.26*i);
    pen.seam(()=>{ g.moveTo(cx-hw*0.94, yy); g.lineTo(cx-hw*0.22, yy+2); }, 2.6);
    pen.seam(()=>{ g.moveTo(cx+hw*0.18, yy+2); g.lineTo(cx+hw*0.92, yy); }, 2.6);
  }

  // ── rim band + cavity ──
  pen.paint(()=>{ g.ellipse(cx, ry, rw, rh, 0, 0, 7); }, toneSolid(inkLevel(RIM)), 5);
  pen.paint(()=>{ g.ellipse(cx, ry+rh*0.10, rw*0.845, rh*0.760, 0, 0, 7); },
            toneSolid(inkLevel(CAV)), 4);
  // pierced rim: short radial ticks on the near half of the band only
  g.strokeStyle = INK; g.lineWidth = 2.8; g.lineCap = "butt";
  for (let i=1;i<9;i++){
    const a = i/10*Math.PI;
    const c = Math.cos(a), s = Math.sin(a);
    g.beginPath();
    g.moveTo(cx+c*rw*0.985, ry+s*rh*0.985);
    g.lineTo(cx+c*rw*0.880, ry+s*rh*0.880);
    g.stroke();
  }

  // ── the bed ──
  const bx = cx, by = ry+rh*0.26;
  for (let i=0;i<COALS.length;i++){
    const [u,v,r] = COALS[i];
    lump(pen, g, bx+u*rw*0.70, by+v*rh*0.70, rw*r,
         M.lit ? (i%2===0 ? COAL : 3) : ASH, i);
  }

  // ── flames: few, tall, well separated; paper bodies over the dark bed ──
  if (M.flames > 0){
    const hMax = H*0.125*M.fireScale;
    const spots = [[-0.54,0.76],[0.00,1.00],[0.52,0.64]];
    for (let i=0;i<Math.min(M.flames, spots.length); i++){
      const [u, hf] = spots[i];
      const k = 0.5 + 0.5*Math.sin(t*2.1 + i*1.7);
      flame(pen, g, cx+u*rw*0.62, ry+rh*0.34, rw*0.44, hMax*hf*(0.86+0.14*k), k);
    }
  }

  // ── near legs + ring handles ──
  leg(pen, g, cx-rw*0.50, bot-H*0.006, cx-rw*1.02, gy, rw*0.080, rw*0.048, PAN_D);
  leg(pen, g, cx+rw*0.50, bot-H*0.006, cx+rw*1.02, gy, rw*0.080, rw*0.048, PAN_D);
  g.strokeStyle = INK; g.lineCap = "round";
  for (const s of [-1, 1]){
    g.lineWidth = 5;
    g.beginPath();
    g.arc(cx + s*rw*1.16, ry + rh*0.10, rw*0.145, 0, Math.PI*2);
    g.stroke();
    g.lineWidth = 4.2;
    g.beginPath();
    g.moveTo(cx + s*rw*0.99, ry + rh*0.02);
    g.lineTo(cx + s*rw*1.03, ry + rh*0.10);
    g.stroke();
  }
  return { cx, ry, rw, rh, gy };
}

/* ---------------- the heat column ---------------- */

function heatColumn(g, W, H, M){
  if (M.heat <= 0) return;
  const C = params.heatCol;
  const rows = Math.max(1, Math.round(clamp(M.heat/100, 0, 1)*C.rows));
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "round"; g.lineJoin = "round";
  for (let r=0; r<rows; r++){
    const y = H*(C.y0 + (C.rows-1-r)*C.dy);
    for (let c=0; c<C.xs.length; c++){
      if ((r+c) % 3 === 2 && r > 0) continue;         // stagger — never a bar
      const x = W*C.xs[c] + (r%2 ? W*0.014 : -W*0.014);
      const w = W*0.030, h = H*0.014;
      g.beginPath();
      g.moveTo(x-w, y+h); g.lineTo(x, y); g.lineTo(x+w, y+h);
      g.stroke();
    }
  }
}

/* ---------------- the limb this fire serves ---------------- */

/* A bow limb is NEVER a straight bar: it carries its own reflex even at rest,
   and the last stretch at the nock flicks back the other way. `extra` is the
   deflection the fire is buying on top of that. */
function limbPts(W, H, extra){
  const L = params.limb, N = 36, pts = [];
  const ax = W*L.ax, ay = H*L.ay, dx = W*L.bx-ax, dy = H*L.by-ay;
  const len = Math.hypot(dx,dy) || 1, nx = -dy/len, ny = dx/len;
  const sag = H*L.sagBase + extra;
  for (let i=0;i<=N;i++){
    const u = i/N;
    const bow = sag*4*u*(1-u);
    const r = clamp((0.20-u)/0.20, 0, 1);          // recurve at the nock end
    const d = bow - H*L.recurve*r*r;
    pts.push([ax + dx*u + nx*d, ay + dy*u + ny*d]);
  }
  return pts;
}
function normalAt(pts, i){
  const n = pts.length-1;
  const a = pts[Math.max(0,i-1)], b = pts[Math.min(n,i+1)];
  const dx = b[0]-a[0], dy = b[1]-a[1], L = Math.hypot(dx,dy) || 1;
  return [-dy/L, dx/L];
}
function ribbon(g, pts, th0, th1){
  const n = pts.length-1;
  const off = (i, s)=>{
    const t = lerp(th0, th1, i/n)/2, v = normalAt(pts, i);
    return [pts[i][0]+v[0]*t*s, pts[i][1]+v[1]*t*s];
  };
  let p = off(0, 1); g.moveTo(p[0], p[1]);
  for (let i=1;i<=n;i++){ p = off(i, 1); g.lineTo(p[0], p[1]); }
  for (let i=n;i>=0;i--){ p = off(i,-1); g.lineTo(p[0], p[1]); }
  g.closePath();
}
function slicePts(pts, a, b){
  const i0 = Math.round(a*(pts.length-1)), i1 = Math.round(b*(pts.length-1));
  return pts.slice(i0, i1+1);
}

function limb(pen, g, W, H, M){
  if (!M.limb) return;
  const L = params.limb, t0 = H*L.thNock, t1 = H*L.thGrip, th = (t0+t1)/2;
  const req = limbPts(W, H, H*L.sagMax);
  const ach = limbPts(W, H, H*L.sagMax*M.bendFrac);

  // the deflection asked for — dashed, always shown
  dashed(g, ()=>{ req.forEach((p,i)=> i ? g.lineTo(p[0],p[1]) : g.moveTo(p[0],p[1])); },
         [10,8], 2.8);

  // grease film laid on the working stretch
  if (M.grease){
    const band = slicePts(ach, 0.28, 0.66);
    pen.paint(()=>{ ribbon(g, band, th*2.1, th*2.5); }, toneSolid(inkLevel(FILM)), 3.2);
    // two drips off the film
    g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round";
    for (const u of [0.36, 0.56]){
      const p = ach[Math.round(u*(ach.length-1))];
      g.beginPath(); g.moveTo(p[0], p[1]+th*1.4); g.lineTo(p[0], p[1]+th*2.9); g.stroke();
      g.fillStyle = INK;
      g.beginPath(); g.arc(p[0], p[1]+th*3.2, 3.4, 0, 7); g.fill();
    }
  }

  // the achieved stave — tapered nock to grip
  pen.paint(()=>{ ribbon(g, ach, t0, t1); }, toneSolid(inkLevel(STAVE)), 3.8);

  // horn nock at the recurved tip
  const v0 = normalAt(ach, 0), d0 = [-v0[1], v0[0]];
  const n = ach[0];
  pen.paint(()=>{
    g.moveTo(n[0]-d0[0]*W*0.016+v0[0]*t0*1.5, n[1]-d0[1]*W*0.016+v0[1]*t0*1.5);
    g.lineTo(n[0]+d0[0]*W*0.026+v0[0]*t0*1.5, n[1]+d0[1]*W*0.026+v0[1]*t0*1.5);
    g.lineTo(n[0]+d0[0]*W*0.026-v0[0]*t0*1.5, n[1]+d0[1]*W*0.026-v0[1]*t0*1.5);
    g.lineTo(n[0]-d0[0]*W*0.016-v0[0]*t0*1.5, n[1]-d0[1]*W*0.016-v0[1]*t0*1.5);
    g.closePath();
  }, toneSolid(inkLevel(PAN_D)), 3.4);
  // grip wrap at the far end: three short cross-seams, never a span
  for (let i=0;i<3;i++){
    const k = ach.length-2-i*3, p = ach[k], v = normalAt(ach, k);
    pen.ink(()=>{ g.moveTo(p[0]-v[0]*t1*0.62, p[1]-v[1]*t1*0.62);
                  g.lineTo(p[0]+v[0]*t1*0.62, p[1]+v[1]*t1*0.62); }, 3.4);
  }

  // the deficit: how far short the warmed, greased limb still is
  if (M.deficitMark){
    const i = Math.round((ach.length-1)*0.5);
    const a = ach[i], b = req[i];
    dashed(g, ()=>{ g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }, [5,5], 2.6);
    const mx = (a[0]+b[0])/2, my = (a[1]+b[1])/2, s = H*0.019;
    g.strokeStyle = INK; g.lineWidth = 4.2; g.lineCap = "round";
    g.beginPath();
    g.moveTo(mx-s, my-s); g.lineTo(mx+s, my+s);
    g.moveTo(mx+s, my-s); g.lineTo(mx-s, my+s);
    g.stroke();
  }
}

/* ---------------- the heat ladder ---------------- */

function ladder(pen, g, W, H, M){
  const L = params.ladder;
  const cx = W*L.cx, hw = W*L.hw, rh = H*L.rh, y1 = H*L.y1;
  const on = Math.round(clamp(M.heat/100, 0, 1)*L.rungs);
  for (let i=0;i<L.rungs;i++){
    const y = y1 - i*(rh + H*L.gap) - rh;
    if (i < on) pen.paint(()=>{ g.rect(cx-hw, y, hw*2, rh); }, toneSolid(inkLevel(FILL)), 3);
    else dashed(g, ()=>{ g.rect(cx-hw, y, hw*2, rh); }, [5,5], 2.4);
  }
  // caret at the reached level
  const yc = y1 - Math.max(0,on-1)*(rh + H*L.gap) - rh*0.5;
  g.fillStyle = INK; g.beginPath();
  g.moveTo(cx-hw-W*0.008, yc);
  g.lineTo(cx-hw-W*0.040, yc-H*0.013);
  g.lineTo(cx-hw-W*0.040, yc+H*0.013);
  g.closePath(); g.fill();
  // the working band the fat wants — two short leads on the right
  const yb = y1 - 3*(rh + H*L.gap) - rh*0.5;
  dashed(g, ()=>{ g.moveTo(cx+hw+W*0.010, yb); g.lineTo(cx+hw+W*0.052, yb); }, [4,5], 2.4);
}

/* ---------------- the tallow station ---------------- */

function tallowStation(pen, g, W, H, M){
  const T = params.tallow;
  const cx = W*T.cx, gy = H*params.groundY;
  const rd = W*T.rDish, rdy = rd*0.34;
  const baseY = gy - H*0.020;

  // platter
  pen.paint(()=>{
    g.moveTo(cx-rd, baseY);
    g.bezierCurveTo(cx-rd*0.96, baseY+H*0.020, cx-rd*0.52, baseY+H*0.028, cx, baseY+H*0.028);
    g.bezierCurveTo(cx+rd*0.52, baseY+H*0.028, cx+rd*0.96, baseY+H*0.020, cx+rd, baseY);
    g.ellipse(cx, baseY, rd, rdy, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(DISH)), 5);
  pen.paint(()=>{ g.ellipse(cx, baseY, rd*0.82, rdy*0.78, 0, 0, 7); },
            toneSolid(inkLevel(CAV)), 3.6);

  // the cake — melt slumps it wider and lower
  const m = clamp(M.melt, 0, 1);
  const hC = H*(T.cakeH*(1 - 0.46*m));
  const wC = W*(T.cakeW*(1 + 0.44*m));
  const topY = baseY - hC, wT = wC*(0.88 - 0.26*m);
  // blocky: a cut cake batters outward as it softens, it does not go pillowy
  pen.paint(()=>{
    g.moveTo(cx-wC, baseY);
    g.lineTo(cx-wT, topY);
    g.lineTo(cx+wT, topY);
    g.lineTo(cx+wC, baseY);
    g.closePath();
  }, toneSolid(inkLevel(TALLOW)), 5.2);
  pen.paint(()=>{ g.ellipse(cx, topY, wT, wT*0.30, 0, 0, 7); }, toneSolid(inkLevel(0)), 4);

  // the wedge cut out of the near face
  if (M.cut){
    pen.paint(()=>{
      g.moveTo(cx+wT*0.10, topY);
      g.lineTo(cx+wT*0.86, topY + wT*0.26);
      g.lineTo(cx+wC*0.80, baseY - hC*0.24);
      g.lineTo(cx+wC*0.16, baseY - hC*0.40);
      g.closePath();
    }, toneSolid(inkLevel(TALLOW_D)), 3.6);
  } else {
    pen.seam(()=>{ g.moveTo(cx-wT*0.44, topY+wT*0.16); g.lineTo(cx+wT*0.10, topY+wT*0.22); }, 2.6);
  }

  // run-off when the fat has gone soft
  if (m > 0.45){
    g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "round";
    for (const u of [-0.62, 0.02, 0.58]){
      const x = cx + u*wC;
      g.beginPath();
      g.moveTo(x, baseY - hC*0.16);
      g.lineTo(x, baseY + H*0.014*(0.6+Math.abs(u)));
      g.stroke();
    }
  }

  // the horn scoop, laid down on the floor beside the platter, blade toward
  // the fire — clear of the cake so neither silhouette eats the other
  const sx0 = cx - rd*0.60, sy0 = baseY + H*0.017;
  const sx1 = cx - rd*1.62, sy1 = baseY + H*0.006;
  pen.paint(()=>{
    const dx = sx1-sx0, dy = sy1-sy0, L = Math.hypot(dx,dy);
    const nx = -dy/L*W*0.0072, ny = dx/L*W*0.0072;
    g.moveTo(sx0+nx, sy0+ny); g.lineTo(sx1+nx, sy1+ny);
    g.lineTo(sx1-nx, sy1-ny); g.lineTo(sx0-nx, sy0-ny); g.closePath();
  }, toneSolid(inkLevel(SCOOP)), 3.4);
  pen.paint(()=>{ g.ellipse(sx1, sy1, W*0.030, W*0.019, -0.36, 0, 7); },
            toneSolid(inkLevel(M.cut ? TALLOW : DISH)), 3.8);
  if (M.cut){
    pen.paint(()=>{ g.ellipse(sx1, sy1-W*0.005, W*0.016, W*0.011, -0.36, 0, 7); },
              toneSolid(inkLevel(0)), 2.8);
  }
}

/* the two-cell melt section: what the heat does to the fat */
function meltSection(pen, g, W, H, M){
  const S = params.melt;
  const y = H*S.y, h = H*S.h, w = W*S.w;
  const cell = (cx, run)=>{
    const x = W*cx;
    if (!run){
      pen.paint(()=>{ g.rect(x-w/2, y+h*0.30, w, h*0.62); }, toneSolid(inkLevel(TALLOW)), 4.4);
      pen.seam(()=>{ g.moveTo(x-w*0.34, y+h*0.46); g.lineTo(x+w*0.34, y+h*0.46); }, 2.6);
    } else {
      pen.paint(()=>{
        g.moveTo(x-w*0.68, y+h*0.92);
        g.bezierCurveTo(x-w*0.62, y+h*0.56, x-w*0.24, y+h*0.50, x, y+h*0.50);
        g.bezierCurveTo(x+w*0.24, y+h*0.50, x+w*0.62, y+h*0.56, x+w*0.68, y+h*0.92);
        g.closePath();
      }, toneSolid(inkLevel(TALLOW)), 4.4);
      g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round";
      g.beginPath(); g.moveTo(x+w*0.52, y+h*0.92); g.lineTo(x+w*0.60, y+h*1.16); g.stroke();
      g.fillStyle = INK; g.beginPath(); g.arc(x+w*0.62, y+h*1.24, 3.6, 0, 7); g.fill();
    }
    // the pan floor each sits on — short rules only
    pen.ink(()=>{ g.moveTo(x-w*0.80, y+h*0.92); g.lineTo(x+w*0.80, y+h*0.92); }, 3.4);
  };
  cell(S.ax, false);
  cell(S.bx, true);
  // broken arrow between the two
  g.strokeStyle = INK; g.lineWidth = 4.4; g.lineCap = "butt";
  const my = y + h*0.60;
  for (const [a,b] of [[0.772,0.792],[0.804,0.824]]){
    g.beginPath(); g.moveTo(W*a, my); g.lineTo(W*b, my); g.stroke();
  }
  g.fillStyle = INK; g.beginPath();
  g.moveTo(W*0.848, my); g.lineTo(W*0.828, my-H*0.011); g.lineTo(W*0.828, my+H*0.011);
  g.closePath(); g.fill();
  // caret under whichever cell the fat is in now
  const cur = M.melt > 0.45 ? S.bx : S.ax;
  g.fillStyle = INK; g.beginPath();
  g.moveTo(W*cur, y+h*1.02+H*0.006);
  g.lineTo(W*cur-W*0.020, y+h*1.02+H*0.030);
  g.lineTo(W*cur+W*0.020, y+h*1.02+H*0.030);
  g.closePath(); g.fill();
}

/* ---------------- the bend protractor ---------------- */

function protractor(pen, g, W, H, M){
  const P = params.prot;
  const px = W*P.px, py = H*P.py, R = W*P.R;
  const req = params.requiredBend_deg * Math.PI/180;
  const ach = M.bend * Math.PI/180;

  // the deficit sector — a light plane with NO contour, so the open gap reads
  // as absence rather than as one more drawn object
  if (M.bend < params.requiredBend_deg){
    pen.fillPath(()=>{
      g.moveTo(px, py);
      g.arc(px, py, R*0.70, -req, -ach, false);
      g.closePath();
    }, inkLevel(1));
  }

  // the dial edge — a thin arc, so the whole thing reads as an instrument
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "butt";
  g.beginPath(); g.arc(px, py, R*1.02, -Math.PI/2, 0, false); g.stroke();
  // the graduated ticks
  g.lineCap = "butt";
  for (let d=0; d<=90; d+=10){
    const a = -d*Math.PI/180;
    const long = (d % 30 === 0);
    g.lineWidth = long ? 4.6 : 3.0;
    const r0 = R*(long ? 0.80 : 0.89), r1 = R*1.02;
    g.beginPath();
    g.moveTo(px+Math.cos(a)*r0, py+Math.sin(a)*r0);
    g.lineTo(px+Math.cos(a)*r1, py+Math.sin(a)*r1);
    g.stroke();
  }
  // required needle — dashed
  dashed(g, ()=>{ g.moveTo(px, py);
                  g.lineTo(px+Math.cos(-req)*R*1.06, py+Math.sin(-req)*R*1.06); }, [9,7], 3.0);
  // achieved needle — solid, with a head
  const hx = px+Math.cos(-ach)*R*0.86, hy = py+Math.sin(-ach)*R*0.86;
  pen.ink(()=>{ g.moveTo(px, py); g.lineTo(hx, hy); }, 5.2);
  g.save(); g.translate(hx, hy); g.rotate(-ach);
  g.fillStyle = INK; g.beginPath();
  g.moveTo(R*0.14, 0); g.lineTo(-R*0.02, -R*0.055); g.lineTo(-R*0.02, R*0.055);
  g.closePath(); g.fill(); g.restore();
  // pivot
  pen.paint(()=>{ g.arc(px, py, R*0.075, 0, 7); }, toneSolid(inkLevel(RIM)), 3.6);
  g.fillStyle = INK; g.beginPath(); g.arc(px, py, R*0.026, 0, 7); g.fill();
  // the reading, as geometry
  segNumber(g, W*0.352, H*0.788, H*0.042, M.bend, 2);
}

/* ---------------- greased-limb section ---------------- */

function filmSection(pen, g, W, H, M){
  const F = params.film, cx = W*F.cx, cy = H*F.cy, R = W*F.R;
  if (M.grease) pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(FILM)), 4);
  else dashed(g, ()=>{ g.arc(cx, cy, R, 0, 7); }, [6,6], 2.6);
  pen.paint(()=>{ g.arc(cx, cy, R*0.62, 0, 7); }, toneSolid(inkLevel(TALLOW)), 3.6);
  g.fillStyle = INK; g.beginPath(); g.arc(cx, cy, R*0.11, 0, 7); g.fill();
  // film-thickness ticks, wall inward
  g.strokeStyle = INK; g.lineWidth = 2.8; g.lineCap = "butt";
  for (let i=0;i<4;i++){
    const a = i/4*Math.PI*2 + Math.PI/4;
    g.beginPath();
    g.moveTo(cx+Math.cos(a)*R*0.99, cy+Math.sin(a)*R*0.99);
    g.lineTo(cx+Math.cos(a)*R*0.66, cy+Math.sin(a)*R*0.66);
    g.stroke();
  }
  // the axis, broken either side
  dashed(g, ()=>{ g.moveTo(cx-R*1.46, cy); g.lineTo(cx-R*1.10, cy);
                  g.moveTo(cx+R*1.10, cy); g.lineTo(cx+R*1.46, cy); }, [8,7], 2.6);
}

/* ---------------- the state ledger ---------------- */

function ledger(pen, g, W, H, idx){
  const L = params.ledger;
  const x0 = W*L.x0, w = W*(L.x1-L.x0), h = H*L.h;
  for (let i=0;i<5;i++){
    const y = H*L.y0 + i*(h + H*L.gap);
    if (i < idx){
      pen.paint(()=>{ g.rect(x0, y, w, h); }, toneSolid(inkLevel(FILL)), 3);
    } else if (i === idx){
      pen.paint(()=>{ g.rect(x0, y, w, h); }, toneSolid(inkLevel(0)), 4.6);
      pen.ink(()=>{ g.rect(x0+w*0.055, y+h*0.20, w*0.89, h*0.60); }, 2.8);
      g.fillStyle = INK; g.beginPath();
      g.moveTo(x0-W*0.010, y+h*0.5);
      g.lineTo(x0-W*0.042, y+h*0.5-H*0.013);
      g.lineTo(x0-W*0.042, y+h*0.5+H*0.013);
      g.closePath(); g.fill();
    } else {
      dashed(g, ()=>{ g.rect(x0, y, w, h); }, [5,5], 2.4);
    }
  }
}

/* ---------------- header + floor ---------------- */

function header(pen, g, W, H, M){
  const Hd = params.head, dy = H*Hd.y, dh = H*Hd.h, cy = dy + dh/2;
  // a small flame mark on the left
  flame(pen, g, W*0.072, dy+dh*0.98, W*0.056, dh*1.00, 0.6, false);
  segNumber(g, W*Hd.heatX, dy, dh, M.heat, 2);
  // broken transfer arrow: heat -> deflection
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  for (const [a,b] of [[0.330,0.372],[0.396,0.438],[0.462,0.504]]){
    g.beginPath(); g.moveTo(W*a, cy); g.lineTo(W*b, cy); g.stroke();
  }
  g.fillStyle = INK; g.beginPath();
  g.moveTo(W*0.572, cy); g.lineTo(W*0.532, cy-dh*0.26); g.lineTo(W*0.532, cy+dh*0.26);
  g.closePath(); g.fill();
  segNumber(g, W*Hd.bendX, dy, dh, M.bend, 2);
  // the bow mark on the right: an arc and its chord — the thing being asked for
  const bx = W*0.905, R = dh*0.62;
  g.strokeStyle = INK; g.lineWidth = 4.6; g.lineCap = "round";
  g.beginPath(); g.arc(bx+R*0.55, cy, R, Math.PI*0.62, Math.PI*1.38); g.stroke();
  g.lineWidth = 3.0;
  g.beginPath();
  g.moveTo(bx+R*0.55+Math.cos(Math.PI*0.62)*R, cy+Math.sin(Math.PI*0.62)*R);
  g.lineTo(bx+R*0.55+Math.cos(Math.PI*1.38)*R, cy+Math.sin(Math.PI*1.38)*R);
  g.stroke();
}

function floorRule(pen, g, W, H){
  const y = H*params.groundY + H*0.012;
  for (const [a,b] of [[0.055,0.200],[0.256,0.462],[0.518,0.640],[0.696,0.946]])
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 3.2);
}

/* ---------------- state table ---------------- */

const MODES = {
  dormant: { lit:false, flames:0, fireScale:0.0, heat:0,  melt:0.00, grease:false,
             cut:false, limb:false, bend:0,  bendFrac:0.00, deficitMark:false, idx:0 },
  warm:    { lit:true,  flames:4, fireScale:1.00, heat:72, melt:0.58, grease:false,
             cut:false, limb:true,  bend:0,  bendFrac:0.00, deficitMark:false, idx:1 },
  apply:   { lit:true,  flames:3, fireScale:0.86, heat:64, melt:0.86, grease:true,
             cut:true,  limb:true,  bend:0,  bendFrac:0.00, deficitMark:false, idx:2 },
  "flex-assist":
           { lit:true,  flames:3, fireScale:0.78, heat:58, melt:0.92, grease:true,
             cut:true,  limb:true,  bend:31, bendFrac:0.62, deficitMark:true,  idx:3 },
  ineffective:
           { lit:true,  flames:1, fireScale:0.44, heat:24, melt:0.70, grease:true,
             cut:true,  limb:true,  bend:9,  bendFrac:0.17, deficitMark:true,  idx:4 },
};

/* ---------------- the render ---------------- */

function render(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const M = MODES[st.mode] || MODES.warm;
  const t = +st.t || 0;

  header(pen, g, W, H, M);
  meltSection(pen, g, W, H, M);
  limb(pen, g, W, H, M);
  heatColumn(g, W, H, M);
  brazier(pen, g, W, H, M, t);
  ladder(pen, g, W, H, M);
  tallowStation(pen, g, W, H, M);
  floorRule(pen, g, W, H);
  protractor(pen, g, W, H, M);
  filmSection(pen, g, W, H, M);
  ledger(pen, g, W, H, M.idx);
}

/* ---------------- the asset ---------------- */

export const asset = {
  id:"prop.bow-heating-fire-and-tallow",
  type:"PROP",
  name:"Bow-heating Fire and Tallow",
  statusWord:"WARM",
  scene:"OD-B21-S03",

  params,
  layers:["counts","melt-section","required-curve","grease-film","limb-stave",
          "heat-column","brazier-far-leg","brazier-bowl","rim","coal-bed","flames",
          "brazier-near-legs","handles","heat-ladder","platter","tallow-cake","scoop",
          "floor","bend-protractor","limb-section","state-ledger"],

  // normalized 0..1 anchors, measured in the WARM state
  anchors:{
    "grip:handle-l":   {x:.126, y:.507},   // a hand on the near ring
    "grip:handle-r":   {x:.534, y:.507},
    "carry:balance":   {x:.330, y:.545},   // where Melanthius takes its weight
    "support:floor":   {x:.330, y:.672},   // the tripod's footprint centre
    "contact:coals":   {x:.330, y:.516},   // the bed — do not touch
    "heat:column":     {x:.330, y:.390},   // where the limb must be held
    "contact:limb":    {x:.360, y:.268},   // the stave riding the heat
    "contact:grease":  {x:.318, y:.258},   // where the film is laid on
    "mount:tallow":    {x:.815, y:.632},   // the cake on its platter
    "grip:scoop":      {x:.746, y:.669},   // the horn scoop's handle end
    "scoop:blade":     {x:.629, y:.658},
    "gauge:bend":      {x:.130, y:.860},   // the protractor pivot
    "count:heat":      {x:.182, y:.058},
    "count:bend":      {x:.685, y:.058},
  },
  // collision: the two stations' shared footprint, brazier legs to platter rim
  collision:{ kind:"box", a:{x:.108, y:.468}, b:{x:.946, y:.686} },
  ownership:"house-of-odysseus · kitchen brazier and store tallow, fetched and "
          + "worked by Melanthius the goatherd for the suitors; never Odysseus's, "
          + "and gone from the hall before the true stringing",

  states:{
    initial:"dormant",
    nodes:{
      dormant:       { preview:{ mode:"dormant",       status:"COLD",      progress:0.06 } },
      warm:          { preview:{ mode:"warm",          status:"WARM",      progress:0.32 } },
      apply:         { preview:{ mode:"apply",         status:"GREASED",   progress:0.55 } },
      "flex-assist": { preview:{ mode:"flex-assist",   status:"ASSISTING", progress:0.78 } },
      ineffective:   { preview:{ mode:"ineffective",   status:"UNBENT",    progress:1.00 } },
    },
    edges:[
      ["dormant","warm"],["warm","apply"],["apply","flex-assist"],
      ["flex-assist","ineffective"],["ineffective","warm"],["ineffective","apply"],
      ["flex-assist","apply"],["warm","dormant"],["ineffective","dormant"],
    ],
  },
  channels:["mode","heat","melt","grease","bend","t","progress"],

  // CARD SIGNATURE — WARM: the brazier lit, the limb held in the heat column,
  // the fat softening on its platter, the bend needle still flat on the floor.
  preview:()=>({ mode:"warm", status:"WARM", progress:0.32, t:0 }),

  draw(ctx, W, H, state){
    render(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
