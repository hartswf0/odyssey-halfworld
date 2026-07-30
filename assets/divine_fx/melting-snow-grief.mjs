/* divine_fx.melting-snow-grief — Penelope's face read as a thawing mountain.
   DIVINE_FX. Book XIX (OD-B19-S03): the beggar's false Cretan tale is told and
   Penelope weeps — "as the snow melts on the high peaks, which the East Wind
   thaws when the West Wind has strewn it, and the running rivers fill" — so her
   cheeks melt. This module is that simile made procedural and CONTROLLED: it is
   NOT a separate dream landscape and never leaves her body. Every mark is
   attached to her posture — the bowed head, the veiled crown, the one weeping
   eye, the robe falling away below — and the mountain exists only as a SNOWLINE
   quantized across that silhouette.

   Procedural DIVINE_FX:
     SOURCE      the thawing wind, a chevron field entering from the upper right
     TARGET      the bowed head + cheek (the snow-mantled slope)
     FIELD       the stepped SNOWLINE crossing the whole figure; snow above it is
                 blank paper, ground below it is exposed and wet
     TRANSFORM   melt m(t): strewn -> thawing (the snowline climbs) -> running ->
                 checked (she masters it and the snow re-lies)
     CONSEQUENCE runnels off the exposed slope, two tear-rivers off the eye, and
                 the meltwater at the foot of the frame RISING as m rises

   Solid grays + hard contour into the offscreen ctx; the engine POST pass
   supplies the halftone — do NOT pre-dither. The snow is level 0 (pure paper,
   no dots at all), the exposed ground is level 2, and only the water — runnels,
   tears, pool, gauge — carries level 5-6 ink. Light planes, dark accents.
*/
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU  = Math.PI * 2;
const frac = x => x - Math.floor(x);
const sm   = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

const params = {
  period:    11.0,        // seconds: strewn -> thawing -> running -> checked
  bow:       0.34,        // radians the head is tipped forward (the posture)
  neck:      { x: 0.50, y: 0.505 },
  headR:     0.128,       // head unit as a fraction of H
  snowBase:  0.900,       // snowline at m=0 — the snow lies whole, to the hem
  snowTop:   0.165,       // snowline at m=1 — only the veiled crown keeps snow
  runnels:   7,           // meltwater channels off the exposed slope
  gaugeCells:7,           // stepped snow-depth column at the left margin
  // the face must never be striped by slope runnels: they start below it
  faceGuard: { x0: 0.120, x1: 0.450, y: 0.600 },
};

/* melt 0..1 over t. Everything in the module reads this one number. */
function meltAt(t){
  const p = frac(t / params.period);
  if (p < 0.10) return 0;                          // strewn: the snow lies whole
  if (p < 0.62) return sm((p - 0.10) / 0.52);      // thawing: the snowline climbs
  if (p < 0.88) return 1;                          // running: the rivers fill
  return 1 - sm((p - 0.88) / 0.12);                // checked: she masters it
}

/* ---------------- the bowed head: one rotated local frame ----------------
   Local units are head-radii, +x behind her, +y up; she faces -x. Bowing is a
   single rotation of that frame, so posture is a parameter, not a redrawing. */
function headXform(W, H){
  const hr = params.headR * H;
  const Nx = params.neck.x * W, Ny = params.neck.y * H;
  const c = Math.cos(params.bow), s = Math.sin(params.bow);
  return (lx, ly) => ({ x: Nx + (lx * c - ly * s) * hr, y: Ny - (lx * s + ly * c) * hr });
}

/* skull in profile, faceted (diagrammatic, not organic) */
const SKULL = [
  [ 0.00, 2.52], [-0.62, 2.38], [-0.98, 1.98], [-1.08, 1.52], [-1.04, 1.30],
  [-1.30, 0.98], [-0.94, 0.80], [-1.04, 0.62], [-0.88, 0.50], [-1.00, 0.34],
  [-0.78, 0.08], [-0.34,-0.18], [ 0.30,-0.34], [ 0.92, 0.10], [ 1.12, 1.00],
  [ 1.14, 1.72], [ 0.80, 2.28],
];
/* the veil: a hood band over the crown that falls behind into the robe.
   Its crest is the summit — the last place the snow survives. */
const VEIL = [
  [-0.90, 2.02], [-1.15, 2.45], [-0.62, 2.82], [ 0.05, 2.88], [ 0.85, 2.62],
  [ 1.35, 2.00], [ 1.42, 1.20], [ 1.36, 0.30], [ 1.36,-0.60], [ 1.42,-1.62],
  [ 0.70,-1.74], [ 0.72,-0.60], [ 0.78, 0.30], [ 0.72, 1.15], [ 0.55, 1.85],
  [ 0.28, 2.24], [-0.22, 2.42], [-0.55, 2.20], [-0.72, 1.95],
];
/* the seated robe. The hem is SCALLOPED on purpose: a straight hem would
   stripe the frame edge-to-edge. */
const BODY = [
  [0.335,0.575],[0.250,0.660],[0.185,0.760],[0.150,0.848],
  [0.235,0.884],[0.320,0.840],[0.410,0.882],[0.505,0.845],
  [0.600,0.888],[0.700,0.842],[0.800,0.878],[0.888,0.840],
  [0.880,0.752],[0.845,0.662],[0.780,0.582],[0.690,0.534],[0.600,0.492],
];

function polyPath(g, pts, W, H){
  g.moveTo(pts[0][0]*W, pts[0][1]*H);
  for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0]*W, pts[i][1]*H);
  g.closePath();
}
function localPath(g, pts, P){
  const a = P(pts[0][0], pts[0][1]); g.moveTo(a.x, a.y);
  for(let i=1;i<pts.length;i++){ const q = P(pts[i][0], pts[i][1]); g.lineTo(q.x, q.y); }
  g.closePath();
}

/* ---------------- the FIELD: a stepped snowline ----------------
   Quantized into a staircase so it reads as a measured line across the body
   rather than a horizontal bar. */
function crestPts(W, H, ys){
  const N = 16, pts = [];
  for(let k=0;k<=N;k++){
    const x = k / N * W;
    const j = (Math.sin(k*1.93)*0.0105 + Math.sin(k*0.61 + 1.2)*0.0075) * H;
    pts.push([x, ys + j]);
  }
  return pts;
}
function stair(g, pts, dy=0){
  g.moveTo(pts[0][0], pts[0][1]+dy);
  for(let i=1;i<pts.length;i++){ g.lineTo(pts[i][0], pts[i-1][1]+dy); g.lineTo(pts[i][0], pts[i][1]+dy); }
}
function crestYAt(pts, x){
  for(let i=1;i<pts.length;i++) if (x <= pts[i][0]) return pts[i-1][1];
  return pts[pts.length-1][1];
}

/* one meltwater runnel, sampled as a tapering ribbon */
function runnelGeom(i, n, W, H, pts, m){
  let fx = lerp(0.115, 0.905, (i + 0.5) / n) + (i % 2 ? 0.020 : -0.016);
  const G = params.faceGuard;
  let y0 = crestYAt(pts, fx * W);
  if (fx > G.x0 && fx < G.x1) y0 = Math.max(y0, G.y * H);
  const y1 = 0.905 * H;
  if (y0 > y1 - H*0.05) return null;
  const drift = (0.50 - fx) * 0.16 + Math.sin(i*2.1)*0.012;
  const pt = [];
  for(let k=0;k<=10;k++){
    const u = k/10;
    pt.push({ u, x: (fx + drift*Math.pow(u,1.5)) * W, y: y0 + u*(y1-y0),
              w: lerp(3.2, 10.5, u) * (0.55 + 0.45*m) });
  }
  return pt;
}

/* everything that happens ON the mantle — drawn inside each shape's clip so
   the snow diagram can never spill off the body into open paper. */
function drawMelt(g, W, H, pts, ys, m, t, snowLvl, bareLvl){
  // --- exposed ground below the snowline: two ink levels darker than the
  //     snow that covered it, never a dark mass ---
  g.beginPath(); stair(g, pts); g.lineTo(W, H); g.lineTo(0, H); g.closePath();
  g.fillStyle = inkLevel(bareLvl); g.fill();

  // --- wet ground under the crest, where the thaw is working NOW. Drawn as
  //     separate blocks on alternate steps so it can never become a bar. ---
  if (m > 0.03){
    g.fillStyle = inkLevel(clamp(bareLvl + 1, 0, 5));
    for(let i=1;i<pts.length;i+=2){
      const x0 = pts[i-1][0], x1 = pts[i][0], y = pts[i-1][1];
      g.fillRect(x0 + (x1-x0)*0.10, y, (x1-x0)*0.62, H*0.024);
    }
  }

  // --- furrows: paper-white channels cut into the exposed plane ---
  g.strokeStyle = inkLevel(0); g.lineWidth = Math.max(3, W*0.008); g.lineCap = "round";
  const G = params.faceGuard;
  for(let i=0;i<11;i++){
    const fx = lerp(0.09, 0.95, i/10) + Math.sin(i*3.1)*0.010;
    let y0 = crestYAt(pts, fx*W) + H*0.045;
    if (fx > G.x0 && fx < G.x1) y0 = Math.max(y0, G.y*H + H*0.02);
    if (y0 > H*0.88) continue;
    g.beginPath(); g.moveTo(fx*W, y0);
    g.quadraticCurveTo(fx*W + (0.5-fx)*W*0.06, (y0+H*0.90)/2, (fx + (0.50-fx)*0.10)*W, H*0.90);
    g.stroke();
  }

  // --- the snowline itself: hard black, stepped ---
  g.strokeStyle = INK; g.lineWidth = Math.max(4, H*0.006); g.lineJoin = "miter";
  g.beginPath(); stair(g, pts); g.stroke();

  // --- snow above the line: elevation contours, the simile stated as a map.
  //     Only the horizontal runs of the staircase are drawn, and any run that
  //     would cross her face is dropped — the metaphor never covers her. ---
  g.strokeStyle = inkLevel(clamp(snowLvl + 2, 2, 5)); g.lineWidth = Math.max(2.5, W*0.005);
  g.lineCap = "butt"; g.setLineDash([26, 15]);
  const F = { x0: 0.115*W, x1: 0.470*W, y0: 0.245*H, y1: 0.575*H };
  for(let k=1;k<=6;k++){
    const dy = -k * 0.052 * H;
    g.lineDashOffset = k * 13;
    for(let i=1;i<pts.length;i++){
      const x0 = pts[i-1][0], x1 = pts[i][0], y = pts[i-1][1] + dy;
      if (y < H*0.045) continue;
      if (y > F.y0 && y < F.y1 && x1 > F.x0 && x0 < F.x1) continue;
      g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
    }
  }
  g.setLineDash([]);

  // --- RUNNELS: the meltwater. The only dark thing on the slope. ---
  g.lineCap = "round"; g.strokeStyle = inkLevel(6);
  for(let i=0;i<params.runnels;i++){
    const pt = runnelGeom(i, params.runnels, W, H, pts, m);
    if (!pt) continue;
    for(let k=1;k<pt.length;k++){
      g.lineWidth = pt[k].w;
      g.beginPath(); g.moveTo(pt[k-1].x, pt[k-1].y); g.lineTo(pt[k].x, pt[k].y); g.stroke();
    }
    // travelling swell — the melt is moving, not painted on
    for(let d=0;d<2;d++){
      const ph = frac(t*0.34 + i*0.31 + d*0.5);
      const k = clamp(Math.floor(ph*10), 0, 9), a = pt[k], b = pt[k+1] || pt[9];
      const x = lerp(a.x, b.x, ph*10 - k), y = lerp(a.y, b.y, ph*10 - k);
      g.fillStyle = inkLevel(7);
      g.beginPath(); g.ellipse(x, y, a.w*0.78, a.w*1.45, 0, 0, TAU); g.fill();
    }
  }
}

/* ---------------- her face: hard ink, above everything ---------------- */
function drawFace(g, W, H, P, m, t){
  const hr = params.headR * H;
  const L = (lx, ly) => P(lx, ly);
  g.strokeStyle = INK; g.lineCap = "round"; g.lineJoin = "round";

  // brow ridge — short, set well above the lid
  g.lineWidth = Math.max(4, hr*0.085);
  let a = L(-1.00, 1.52), b = L(-0.56, 1.60);
  g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();

  // the weeping eye: a SHUT LENS, filled solid so it survives the dot lattice
  // as one unambiguous mark instead of a pair of parallel slashes
  const p1 = L(-1.02, 1.13), p2 = L(-0.46, 1.24);
  const dx = p2.x - p1.x, dy = p2.y - p1.y, ln = Math.hypot(dx, dy) || 1;
  const nx = -dy/ln, ny = dx/ln;
  const mx = (p1.x + p2.x)/2, my = (p1.y + p2.y)/2;
  const up = hr*0.30, dn = hr*0.11;
  g.fillStyle = INK; g.beginPath();
  g.moveTo(p1.x, p1.y);
  g.quadraticCurveTo(mx + nx*up, my + ny*up, p2.x, p2.y);
  g.quadraticCurveTo(mx - nx*dn, my - ny*dn, p1.x, p1.y);
  g.fill();
  // the crease of the lid, a hair above the lens
  g.lineWidth = Math.max(2.5, hr*0.045);
  a = L(-1.00, 1.32); b = L(-0.55, 1.41);
  g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();

  // nostril + the set mouth (pressed thin — the grief is held)
  g.lineWidth = Math.max(3, hr*0.06);
  a = L(-1.04, 0.90); b = L(-0.86, 0.86);
  g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
  g.lineWidth = Math.max(4, hr*0.09);
  a = L(-1.03, 0.585); b = L(-0.80, 0.545);
  g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();

  // jaw seam — enough to hold the head as a head
  g.strokeStyle = INK; g.lineWidth = Math.max(3, hr*0.06);
  a = L(-0.72, 0.16); b = L(0.20, -0.08);
  g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
  // veil fold lines — kept BEHIND the face, on the back of the hood only
  g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(2.5, hr*0.05);
  for(let k=0;k<3;k++){
    const p0 = L(0.42 + k*0.30, 2.42 - k*0.34), p1 = L(1.02 + k*0.14, 0.55 - k*0.62);
    g.beginPath(); g.moveTo(p0.x, p0.y);
    g.quadraticCurveTo(p0.x + hr*0.28, (p0.y+p1.y)/2, p1.x, p1.y); g.stroke();
  }
}

/* ---------------- the two tear-rivers off the eye ----------------
   Present at every melt level — she is weeping throughout — but they THICKEN
   and detach into falling drops as m rises. These are the simile's rivers. */
function drawTears(g, W, H, P, m, t){
  const e = P(-0.78, 1.10);
  const tracks = [
    { x0: e.x + W*0.014, w: 0.0105 },
    { x0: e.x + W*0.046, w: 0.0072 },
  ];
  g.lineCap = "round"; g.strokeStyle = inkLevel(6);
  for(const tr of tracks){
    const yTop = e.y + H*0.020, yEnd = H*0.505;
    for(let k=1;k<=8;k++){
      const u0 = (k-1)/8, u1 = k/8;
      const p0y = lerp(yTop, yEnd, u0), p1y = lerp(yTop, yEnd, u1);
      const p0x = tr.x0 + W*0.016*u0*u0, p1x = tr.x0 + W*0.016*u1*u1;
      g.lineWidth = W*tr.w*(0.55 + 0.55*m)*lerp(0.55, 1.15, u1);
      g.beginPath(); g.moveTo(p0x, p0y); g.lineTo(p1x, p1y); g.stroke();
    }
    // detached drops falling clear of the jaw into the meltwater
    const nDrops = 2 + Math.round(m*2);
    for(let d=0; d<nDrops; d++){
      const ph = frac(t*0.46 + d*(1/nDrops) + tr.w*37);
      const y = lerp(H*0.520, H*0.905, ph);
      const x = tr.x0 + W*0.016 + W*0.010*ph;
      const r = lerp(W*0.020, W*0.011, ph) * (0.7 + 0.4*m);
      g.fillStyle = inkLevel(7);
      g.beginPath();
      g.moveTo(x, y - r*1.9);
      g.quadraticCurveTo(x + r, y + r*0.25, x, y + r);
      g.quadraticCurveTo(x - r, y + r*0.25, x, y - r*1.9);
      g.fill();
    }
  }
}

/* ---------------- the CONSEQUENCE: the rivers run full ----------------
   Broken reaches, never one bar across the foot of the frame. */
const REACHES = [[0.040,0.245,0.000],[0.325,0.500,-0.016],[0.590,0.715,0.012],[0.795,0.958,-0.007]];
function drawWater(g, W, H, m, t){
  const base = lerp(0.936, 0.874, m), bed = 0.952*H;
  for(let i=0;i<REACHES.length;i++){
    const [x0, x1, dy] = REACHES[i];
    const yt = (base + dy) * H;
    g.fillStyle = inkLevel(4);
    g.fillRect(x0*W, yt, (x1-x0)*W, bed - yt);
    g.strokeStyle = INK; g.lineWidth = Math.max(4, H*0.005); g.lineCap = "butt";
    g.beginPath(); g.moveTo(x0*W, yt); g.lineTo(x1*W, yt); g.stroke();
    // current: short dark dashes drifting downstream
    g.strokeStyle = inkLevel(7); g.lineWidth = Math.max(3, H*0.005);
    for(let k=0;k<2;k++){
      const span = (x1-x0)*W;
      const px = x0*W + frac(t*0.16 + k*0.44 + i*0.21) * span;
      const py = yt + (bed-yt) * (0.34 + k*0.34);
      g.beginPath(); g.moveTo(px, py); g.lineTo(Math.min(px + span*0.18, x1*W), py); g.stroke();
    }
  }
}

/* ---------------- the SOURCE: the thawing wind ---------------- */
function drawWind(g, W, H, m, t){
  const drift = Math.sin(t*0.8) * W*0.012;
  g.strokeStyle = inkLevel(3); g.lineCap = "round"; g.lineJoin = "round";
  g.lineWidth = Math.max(3, W*0.007);
  for(let k=0;k<4;k++){
    const u = k/3;
    const cx = lerp(0.905, 0.640, u)*W + drift*(0.4 + u);
    const cy = lerp(0.070, 0.170, u)*H;
    const s  = lerp(0.055, 0.040, u)*W * (0.7 + 0.5*m);
    g.beginPath();
    g.moveTo(cx + s, cy - s*0.62); g.lineTo(cx - s*0.35, cy); g.lineTo(cx + s, cy + s*0.62);
    g.stroke();
  }
  // the strike: an arrow into the veiled crown
  const ax = 0.562*W + drift, ay = 0.126*H;
  g.strokeStyle = INK; g.lineWidth = Math.max(4, W*0.008);
  g.beginPath(); g.moveTo(ax + W*0.075, ay - H*0.030); g.lineTo(ax, ay); g.stroke();
  g.beginPath();
  g.moveTo(ax + W*0.040, ay - H*0.033); g.lineTo(ax, ay); g.lineTo(ax + W*0.030, ay + H*0.008);
  g.stroke();
}

/* ---------------- the GAUGE: snow depth as stepped geometry, no type ----- */
function drawGauge(g, W, H, m){
  const n = params.gaugeCells, bw = 0.056*W, bh = 0.036*H, gap = 0.012*H;
  const x = 0.042*W, yBot = 0.624*H;
  const gone = Math.round(m*n);
  for(let i=0;i<n;i++){
    const y = yBot - bh - i*(bh+gap);
    g.beginPath(); g.rect(x, y, bw, bh);
    g.fillStyle = i < gone ? inkLevel(5) : inkLevel(0); g.fill();
    g.strokeStyle = INK; g.lineWidth = Math.max(3, W*0.006); g.lineJoin = "miter"; g.stroke();
  }
  // leader from the gauge to the live snowline — short, dashed, never a bar
  const ys = lerp(params.snowBase, params.snowTop, m) * H;
  g.strokeStyle = inkLevel(4); g.lineWidth = Math.max(2.5, W*0.005);
  g.setLineDash([9, 8]);
  g.beginPath(); g.moveTo(x, ys); g.lineTo(x + bw*1.55, ys); g.stroke();
  g.setLineDash([]);
  g.fillStyle = INK;
  g.beginPath(); g.arc(x + bw*1.55, ys, Math.max(4, W*0.010), 0, TAU); g.fill();
}

/* ---------------- assembly ---------------- */
function drawFX(ctx, W, H, st){
  const pen = makePen(ctx, { outline: true });
  const g = ctx;
  const t = st.t || 0;
  const m = (typeof st.melt === "number") ? clamp(st.melt, 0, 1) : meltAt(t);
  const layers = st.layers || ["wind","body","snow","runnels","face","tears","water","gauge"];
  const has = l => layers.includes(l);

  const P   = headXform(W, H);
  const ys  = lerp(params.snowBase, params.snowTop, m) * H;
  const pts = crestPts(W, H, ys);

  if (has("wind")) drawWind(g, W, H, m, t);

  /* --- the mantled body: three planes, each with its OWN snow level and its
     own exposed level. Skin is blank paper, the robe one step up, the veil
     two — so the head never collapses into one white balloon. --- */
  const shapes = [
    { path:(gg)=>polyPath(gg, BODY, W, H), snow:1, bare:3 },
    { path:(gg)=>localPath(gg, SKULL, P),  snow:0, bare:2 },
    { path:(gg)=>localPath(gg, VEIL, P),   snow:2, bare:4 },
  ];
  const LWc = Math.max(5, H*0.006);
  if (has("body")) for(const S of shapes)
    pen.paint(() => S.path(g), toneSolid(inkLevel(S.snow)), LWc);

  // --- the snow field + meltwater, clipped to each plane in turn ---
  if (has("snow") || has("runnels")){
    for(const S of shapes){
      g.save(); g.beginPath(); S.path(g); g.clip();
      drawMelt(g, W, H, pts, ys, m, t, S.snow, S.bare);
      g.restore();
    }
    // restate the contour so the clip edges stay crisp and black
    for(const S of shapes){
      g.beginPath(); S.path(g);
      g.strokeStyle = INK; g.lineWidth = LWc; g.lineJoin = "round"; g.stroke();
    }
  }

  if (has("face"))  drawFace(g, W, H, P, m, t);
  if (has("tears")) drawTears(g, W, H, P, m, t);
  if (has("water")) drawWater(g, W, H, m, t);
  if (has("gauge")) drawGauge(g, W, H, m);

  return { anchors: asset.anchors, melt: m, snowline: ys / H };
}

export const asset = {
  id:"divine-fx.melting-snow-grief",
  type:"DIVINE_FX",
  name:"Melting-snow grief",
  statusWord:"THAWING",
  scene:"OD-B19-S03",

  params,
  // back -> front. A scene may pass a subset: e.g. ["body","face","tears"] for
  // the plain weeping without the simile, or drop "gauge" for an unlabelled take.
  layers:["wind","body","snow","runnels","face","tears","water","gauge"],

  // normalized 0..1 anchors: source, target, field and consequence
  anchors:{
    "source:thaw-wind":   { x:.905, y:.070 },
    "source:strike":      { x:.562, y:.126 },
    "target:cheek":       { x:.345, y:.455 },
    "target:eye-weeping": { x:.312, y:.401 },
    "summit:veiled-crown":{ x:.344, y:.150 },
    "field:snowline":     { x:.500, y:.470 },
    "consequence:river":  { x:.500, y:.930 },
    "gauge:snow-depth":   { x:.083, y:.410 },
    "camera:portrait":    { x:.450, y:.450 },
  },
  // affected regions
  zones:{
    mantle:    { x0:.11, y0:.10, x1:.93, y1:.90 },
    face:      { x0:.17, y0:.24, x1:.46, y1:.56 },
    snowfield: { x0:.11, y0:.10, x1:.93, y1:.50 },
    meltwater: { x0:.02, y0:.86, x1:.98, y1:1.00 },
  },

  // DIVINE_FX state machine: the wind strews -> thaws -> the rivers run ->
  // she checks herself and the snow lies again.
  states:{
    initial:"thawing",
    nodes:{
      strewn:{  preview:{ melt:0.00, t:0.4, status:"STREWN",  progress:.08 } },
      thawing:{ preview:{ melt:0.60, t:3.8, status:"THAWING", progress:.45 } },
      running:{ preview:{ melt:1.00, t:7.4, status:"RUNNING", progress:.80 } },
      checked:{ preview:{ melt:0.28, t:10.4,status:"CHECKED", progress:.95 } },
    },
    edges:[["strewn","thawing"],["thawing","running"],
           ["running","checked"],["checked","strewn"],["thawing","checked"]],
  },
  duration: params.period,
  channels:["t","melt","snowline","runnels","tears","water","wind","bow"],

  preview:()=>({ melt:0.45, t:3.2, status:"THAWING", progress:.42 }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
