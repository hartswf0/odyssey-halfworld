/* location.road-to-laertess-farm — the way out of the town of Ithaca to the old
   man's steading: city gate, rural tracks, the orchard approach, the farm
   buildings, and the swept ground where the family meets. LOCATION asset
   (empty navigable set — NO baked figures). Solid grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone.

   THE SHAPE OF BOOK XXIII. The last thing that happens in the book is four men
   walking out of the town toward Laertes. So the set holds the whole walk in one
   frame: the road enters at the near bottom edge wide enough for a figure at
   full height, the CITY GATE stands middle-distance left with its own spur back
   into town, and the road climbs away right past the ORCHARD WALL to the FARM
   GATE at the far end. Departure and arrival are both on screen and the walk
   between them is one continuous surface.

   THE ROAD RECEDES AND NEVER DOUBLES BACK. A road that curves toward camera and
   away again closes on itself and stops reading as a road — it reads as a lake.
   So y is monotonic along the whole chain, and DEPTH IS A FUNCTION OF GROUND
   HEIGHT: depthAtY() is the single ladder, and everything standing on the ground
   — trees, markers, buildings, a placed figure — is scaled from its own y. The
   far farm and the near well therefore agree about the size of the world.

   NOTHING SPANS THE FRAME. The far range is two separate humps that stop short
   of both edges; the horizon is a tone change, not a rule. The town wall is a
   27% run terminated by its bastion. Every field boundary, orchard wall and
   verge is cut into segments and cut at the road.

   THE ORCHARD IS PLOT. Laertes's orchard is where he is found and where he is
   known again, so it is surveyed, not sketched: a quincunx of fruit trees in
   perspective inside a broken boundary wall, a staked vine terrace at its head,
   and a marked ORCHARD GATE where the wall converges with the road. No tree is
   allowed to grow in the carriageway — every stamp is tested against the road
   samples first.

   MEETING ZONES are swept discs of light ground with a surveyed ring and a PAIR
   of contact stations (`meet:clearing_l` / `meet:clearing_r`, and the same in the
   yard). Two bodies that embrace must never resolve to one station, so this set
   hands the scene the pairs it needs. The "survey" state lights them.

   States: "day", "dusk", "night-cover" (Athena's screen over the town end — the
   world dims and the road stays the one bright thing), "survey" (zones struck in
   for previs), "bare" (the walking set only).

   Serves OD-B23-S06 and returns in Book XXIV.
   Atlas: OD-B23-S06 — city exit, rural tracks, orchard approach, farm buildings,
   and family meeting zones. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const MODES = ["day", "dusk", "night-cover", "survey", "bare"];

const params = {
  horizon:0.300,     // sky / ground split as a fraction of H
  wallY:0.560,       // foot of the town wall — the city is middle-distance
  gateX:0.135,       // the city gate: where the walk begins
  bastionX:0.272,    // where the wall stops; east of this there is only country
  farmBase:0.400,    // ground line of the steading
  farmGateX:0.660,   // the far end of the road: the gate into the farmyard
  hedges:7,          // field divisions converging on the farm
  zonesLit:false,    // the meeting grounds struck in as survey
};

/* ---------- THE ROAD ----------
   One Catmull-Rom chain, drawn once and read everywhere. t = 0 at the near
   bottom edge, t = 1 at the farm gate. y is monotonic: the road only ever goes
   away from camera. */
const CR = [
  [0.372, 1.045],   // phantom (= near edge, off-frame so the road bleeds)
  [0.372, 1.045],   // t = 0
  [0.150, 0.872],
  [0.318, 0.706],
  [0.556, 0.612],
  [0.700, 0.518],
  [0.660, 0.404],   // t = 1  farm gate
  [0.660, 0.404],   // phantom
];
function roadPtN(t){
  const segs = CR.length - 3;
  const u = clamp(t, 0, 1) * segs;
  const i = Math.min(Math.floor(u), segs - 1), s = u - i;
  const c = (a,b,cc,d) => 0.5*((2*b) + (-a+cc)*s + (2*a-5*b+4*cc-d)*s*s + (-a+3*b-3*cc+d)*s*s*s);
  const p0=CR[i], p1=CR[i+1], p2=CR[i+2], p3=CR[i+3];
  return { x:c(p0[0],p1[0],p2[0],p3[0]), y:c(p0[1],p1[1],p2[1],p3[1]) };
}
function roadTanN(t){
  const h = 0.004;
  const a = roadPtN(clamp(t-h,0,1)), b = roadPtN(clamp(t+h,0,1));
  const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx,dy) || 1;
  return { x:dx/n, y:dy/n };
}
/* THE ONE DEPTH LADDER: ground height -> scale. */
const NEAR_Y = 1.040;
const groundU = y => clamp((y - params.horizon) / (NEAR_Y - params.horizon), 0, 1);
const depthAtY = y => lerp(0.070, 1.000, Math.pow(groundU(y), 1.22));
const depthAt  = t => depthAtY(roadPtN(t).y);
const roadHW   = t => lerp(0.005, 0.052, Math.pow(groundU(roadPtN(t).y), 1.15));

/* road samples — used for anchors AND as the keep-off test for every stamp, so
   nothing ever grows out of the road surface */
const RS = (() => {
  const a = [];
  for (let i = 0; i <= 72; i++){ const t = i/72, p = roadPtN(t); a.push({ x:p.x, y:p.y, hw:roadHW(t) }); }
  return a;
})();
function onRoad(x, y, W, H, pad = 1.5){
  for (const s of RS){
    const dx = (x - s.x)*W, dy = (y - s.y)*H;
    if (Math.hypot(dx, dy) < s.hw*W*pad) return true;
  }
  return false;
}

/* ---------- THE ORCHARD PLOT ----------
   a screen-space quad: `a` runs 0 (the road flank) -> 1 (deep right), `b` runs
   0 (near) -> 1 (the head of the orchard). Everything in the orchard is placed
   through op(), so the wall, the gate, the rows and the clearing agree. */
const ORCH = { NL:[0.792,0.766], NR:[1.110,0.706], FR:[0.952,0.468], FL:[0.752,0.498] };
function op(a, b){
  const nx = lerp(ORCH.NL[0], ORCH.NR[0], a), ny = lerp(ORCH.NL[1], ORCH.NR[1], a);
  const fx = lerp(ORCH.FL[0], ORCH.FR[0], a), fy = lerp(ORCH.FL[1], ORCH.FR[1], a);
  return { x: lerp(nx, fx, b), y: lerp(ny, fy, b) };
}
const ORCH_GATE = op(0.0, 0.88);        // where the wall converges with the road

/* ---------- rural tracks: surveyed, not surfaced ----------
   each starts ON the road (t0) so the network is actually connected */
const TRACKS = [
  { t0:0.54, pts:[[0.455,0.582],[0.383,0.550],[0.330,0.532]] },   // to the threshing floor
  { t0:0.27, pts:[[0.212,0.762],[0.116,0.744],[0.010,0.754]] },   // the cart track out west
  { t0:0.90, pts:[[0.630,0.446],[0.598,0.424]] },                 // the back way into the yard
];

/* ---------- meeting grounds ---------- */
const MEET = {
  clearing:{ x:0.884, y:0.612, r:0.054 },   // in the orchard: where he is known again
  yard:    { x:0.562, y:0.414, r:0.030 },   // in front of the house door
  gate:    { x:0.660, y:0.410, r:0.021 },   // on the farm threshold
};

/* ---------- anchors: taken from the road and the ladder, never hand-tuned ---- */
/* anchors are clamped into 0..1 asset space: the road itself bleeds past the
   bottom edge, but a placement anchor may not. */
const rd = t => { const p = roadPtN(t);
  return { x:+clamp(p.x,0,1).toFixed(3), y:+clamp(p.y,0,1).toFixed(3) }; };
const nz = p => ({ x:+p.x.toFixed(3), y:+p.y.toFixed(3) });
export const anchors = {
  "road:near":            rd(0.00),          // clamped to y = 1 — full height
  "road:lower":           rd(0.10),          // y ~ .96
  "road:boundary":        rd(0.18),          // y ~ .90  the boundary stone
  "road:cart-fork":       rd(0.27),          // y ~ .82
  "road:bend":            rd(0.38),          // y ~ .74
  "road:mid":             rd(0.54),          // y ~ .64  the threshing track leaves
  "road:city-spur":       rd(0.44),          // y ~ .70  the way back to town joins
  "road:orchard":         rd(0.78),          // y ~ .52  abreast of the orchard gate
  "road:upper":           rd(0.90),          // y ~ .45
  "road:farm-approach":   rd(0.97),          // y ~ .41
  "threshold:city-gate":  { x:params.gateX, y:0.568 },
  "exit:city":            { x:params.gateX, y:0.568 },
  "city:bastion":         { x:params.bastionX, y:0.556 },
  "well:kerb":            { x:0.566, y:0.906 },
  "waymark:boundary":     { x:0.470, y:0.905 },
  "track:cart":           { x:0.212, y:0.762 },
  "track:threshing":      { x:0.455, y:0.582 },
  "threshing:floor":      { x:0.330, y:0.532 },
  "exit:fields":          { x:0.010, y:0.754 },
  "threshold:orchard-gate": nz(ORCH_GATE),
  "orchard:rows":         nz(op(0.42, 0.36)),
  "orchard:vines":        nz(op(0.34, 0.88)),
  "orchard:clearing":     { x:MEET.clearing.x, y:MEET.clearing.y },
  "meet:clearing_l":      { x:MEET.clearing.x - 0.042, y:MEET.clearing.y + 0.006 },
  "meet:clearing_r":      { x:MEET.clearing.x + 0.042, y:MEET.clearing.y - 0.004 },
  "threshold:farm-gate":  { x:params.farmGateX, y:0.408 },
  "farm:yard":            { x:MEET.yard.x, y:MEET.yard.y },
  "meet:yard_l":          { x:MEET.yard.x - 0.032, y:MEET.yard.y + 0.004 },
  "meet:yard_r":          { x:MEET.yard.x + 0.032, y:MEET.yard.y - 0.002 },
  "farm:house-door":      { x:0.545, y:0.396 },
  "farm:outbuilding":     { x:0.620, y:0.398 },
  "farm:tool-shed":       { x:0.482, y:0.398 },
  "farm:pen":             { x:0.436, y:0.412 },
  "exit:farm":            { x:0.545, y:0.396 },
  "camera:wide":          { x:0.500, y:0.660 },
  "camera:gate":          { x:0.160, y:0.590 },
  "camera:road":          { x:0.420, y:0.900 },
  "camera:orchard":       { x:0.860, y:0.640 },
  "camera:yard":          { x:0.560, y:0.418 },
};

/* ---------- small stamps ---------- */
/* a fruit tree of the orchard: trunk + two or three canopy lobes, at depth scale */
function fruitTree(pen, g, x, base, s, tone, k = 0){
  pen.paint(() => {
    g.moveTo(x - s*0.075, base);
    g.lineTo(x - s*0.090, base - s*0.38);
    g.lineTo(x + s*0.080, base - s*0.40);
    g.lineTo(x + s*0.065, base);
    g.closePath();
  }, toneSolid(inkLevel(5)), 2);
  const lobes = k % 2 ? [[-0.25,-0.56,0.33],[0.25,-0.60,0.30],[0.00,-0.80,0.27]]
                      : [[-0.21,-0.60,0.31],[0.23,-0.54,0.33]];
  for (const [ox, oy, r] of lobes)
    pen.paint(() => { g.ellipse(x + s*ox, base + s*oy, s*r, s*r*0.74, 0, 0, 7); }, tone, 2.4);
}
/* the vine terrace: staked cordons — verticals with a broken cross-cordon */
function vineRow(pen, g, a, b, s, tone){
  const n = 5;
  for (let i = 0; i < n; i++){
    const k = i/(n-1), x = lerp(a.x, b.x, k), y = lerp(a.y, b.y, k);
    pen.paint(() => { g.rect(x - s*0.045, y - s*0.44, s*0.090, s*0.44); }, toneSolid(inkLevel(5)), 1.6);
    if (i < n-1){
      const k2 = (i + 0.62)/(n-1);
      const x2 = lerp(a.x, b.x, k2), y2 = lerp(a.y, b.y, k2);
      pen.paint(() => { g.ellipse((x+x2)/2, (y+y2)/2 - s*0.40, s*0.19, s*0.12, 0, 0, 7); }, tone, 1.6);
    }
  }
}
function bush(pen, g, x, base, s, tone){
  pen.paint(() => { g.ellipse(x, base - s*0.56, s*0.64, s*0.44, 0, 0, 7); }, tone, 2.2);
  pen.ink(() => { g.moveTo(x, base); g.lineTo(x, base - s*0.48); }, 1.8);
}
function figTree(pen, g, x, base, h, w, tone){
  pen.paint(() => {
    g.moveTo(x - w*0.11, base);
    g.lineTo(x - w*0.16, base - h*0.46);
    g.lineTo(x + w*0.13, base - h*0.48);
    g.lineTo(x + w*0.10, base);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  for (const [ox, oy, r] of [[-0.32,-0.60,0.40],[0.30,-0.66,0.36],[0.00,-0.86,0.33]])
    pen.paint(() => { g.ellipse(x + w*ox, base + h*oy, w*r, h*r*0.62, 0, 0, 7); }, tone, 3.5);
}
/* a building: walls + a low pitched roof, door optional */
function block(pen, g, x, base, w, h, tone, roofTone, door){
  pen.paint(() => { g.rect(x - w/2, base - h, w, h); }, tone, 2.5);
  pen.paint(() => {
    g.moveTo(x - w*0.60, base - h);
    g.lineTo(x, base - h - h*0.46);
    g.lineTo(x + w*0.60, base - h);
    g.closePath();
  }, roofTone, 2.5);
  if (door) pen.paint(() => { g.rect(x - w*0.15, base - h*0.60, w*0.30, h*0.60); },
                      toneSolid(inkLevel(7)), 2);
}
/* a broken run of dry-stone wall between two points, with courses */
function stoneRun(pen, g, a, b, th, tone, courses = 6){
  pen.paint(() => {
    g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
    g.lineTo(b.x, b.y + th*0.42); g.lineTo(a.x, a.y + th); g.closePath();
  }, tone, 2.5);
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.6; g.globalAlpha = 0.32;
  for (let i = 1; i < courses; i++){
    const k = i/courses, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
    g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + lerp(th, th*0.42, k)); g.stroke();
  }
  g.restore();
}
function dashPath(g, pts, lw, alpha, dash){
  g.save(); g.strokeStyle = INK; g.lineWidth = lw; g.globalAlpha = alpha;
  g.lineCap = "round"; g.setLineDash(dash);
  g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
  g.stroke(); g.setLineDash([]); g.restore();
}

/* ---------- the set ---------- */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = MODES.includes(st.state) ? st.state : "day";
  const dusk = mode === "dusk";
  const cover = mode === "night-cover";
  const zones = (st.zonesLit ?? params.zonesLit) || mode === "survey";
  const layers = st.layers || (mode === "bare"
    ? ["sky","hills","ground","fields","city","orchard","farm","road","verge"]
    : ["sky","hills","ground","fields","tracks","city","orchard","farm","road",
       "spur","halt","zones","verge","fg"]);
  const has = l => layers.includes(l);

  /* tone table — the whole set lights from here. Under Athena's cover the world
     dims but the ROAD stays level 1: the frame must never go to one black mass. */
  const T = cover ? { sky:4, far:4, ridge:5, ground:3, field:4, stone:4, build:3, dark:6, road:1, leaf:4 }
          : dusk  ? { sky:3, far:3, ridge:4, ground:3, field:4, stone:5, build:3, dark:6, road:1, leaf:4 }
                  : { sky:1, far:2, ridge:3, ground:2, field:3, stone:4, build:2, dark:5, road:1, leaf:3 };

  const hz = params.horizon * H;
  const P  = t => { const p = roadPtN(t); return { x:p.x*W, y:p.y*H }; };
  const HW = t => roadHW(t) * W;
  const VP = { x: params.farmGateX*W, y: hz };   // the country converges on the farm
  const NEAR = H*NEAR_Y;
  /* a point in field space: x at the near edge, u = how far it has receded */
  const FP = (x, u) => ({ x: lerp(x*W, VP.x, u), y: lerp(NEAR, VP.y, u) });
  const S  = p => ({ x:p.x*W, y:p.y*H });

  /* ---- SKY ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, hz);
    g.fillStyle = inkLevel(T.sky + 1);
    for (let i = 0; i < 3; i++){
      g.beginPath();
      g.ellipse(W*(0.26 + i*0.27), hz*(0.26 + 0.24*(i%2)), W*0.116, H*0.011, 0, 0, 7);
      g.fill();
    }
    if (dusk || cover){ g.fillStyle = inkLevel(cover ? 2 : 1); g.fillRect(0, hz - H*0.018, W, H*0.018); }
  }

  /* ---- GROUND: the horizon is a tone change, not a rule ---- */
  if (has("ground")){ g.fillStyle = inkLevel(T.ground); g.fillRect(0, hz, W, H - hz); }

  /* ---- HILLS: two separate humps of the far range, then a short near ridge
     behind the farm. Neither touches a frame edge, so nothing stripes. ---- */
  if (has("hills")){
    /* a hump is FILLED and then only its CREST is inked. An outlined hill lays a
       long horizontal contour along the horizon, and two of them read as a rule. */
    const hump = (pts, level, lw) => {
      g.beginPath();
      g.moveTo(pts[0][0]*W, hz + pts[0][1]*H);
      g.quadraticCurveTo(pts[1][0]*W, hz + pts[1][1]*H, pts[2][0]*W, hz + pts[2][1]*H);
      g.quadraticCurveTo(pts[3][0]*W, hz + pts[3][1]*H, pts[4][0]*W, hz + pts[4][1]*H);
      g.lineTo(pts[4][0]*W, hz + H*0.05); g.lineTo(pts[0][0]*W, hz + H*0.05);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
      g.save(); g.strokeStyle = INK; g.lineWidth = lw; g.lineJoin = "round";
      g.beginPath();
      g.moveTo(pts[0][0]*W, hz + pts[0][1]*H);
      g.quadraticCurveTo(pts[1][0]*W, hz + pts[1][1]*H, pts[2][0]*W, hz + pts[2][1]*H);
      g.quadraticCurveTo(pts[3][0]*W, hz + pts[3][1]*H, pts[4][0]*W, hz + pts[4][1]*H);
      g.stroke(); g.restore();
    };
    hump([[0.055,0.004],[0.18,-0.082],[0.30,-0.030],[0.39,0.002],[0.455,0.006]], T.far, 3.5);
    hump([[0.505,0.006],[0.66,-0.092],[0.80,-0.026],[0.88,0.000],[0.945,0.006]], T.far, 3.5);
    hump([[0.415,0.020],[0.58,-0.026],[0.74,0.004],[0.86,0.022],[0.965,0.018]], T.ridge, 3);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.26;
    for (const u of [0.20, 0.42, 0.66]){
      g.beginPath();
      g.moveTo(W*(0.16 + u*0.58), hz - H*0.050 + H*0.020*u);
      g.lineTo(W*(0.16 + u*0.58) + W*0.020, hz - H*0.006);
      g.stroke();
    }
    g.restore();
  }

  /* ---- FIELDS: perspective plots, converging hedges, broken boundaries ------
     Nothing here runs the full width. The ground recedes; it does not stripe. */
  if (has("fields")){
    const quad = (xa, xb, u0, u1, level) => {
      const a = FP(xa,u0), b = FP(xb,u0), c = FP(xb,u1), d = FP(xa,u1);
      g.beginPath();
      g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
    };
    const PLOTS = [
      [-0.62, -0.18, 0.04, 0.24], [-0.44, -0.02, 0.28, 0.44], [-0.22, 0.14, 0.48, 0.60],
      [-0.02,  0.26, 0.63, 0.72], [ 0.06, 0.30, 0.76, 0.84], [-0.14, 0.22, 0.36, 0.46],
      [ 1.16,  1.74, 0.02, 0.20], [ 1.04, 1.52, 0.24, 0.36],
    ];
    PLOTS.forEach(p => quad(p[0], p[1], p[2], p[3], T.field));
    // stubble ticks inside the plots — texture, not tone
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.15;
    for (const p of PLOTS){
      for (let r = 0; r < 4; r++){
        const u = lerp(p[2], p[3], (r + 0.5)/4);
        const sc = lerp(0.020, 0.004, u);
        for (let k = 0; k < 8; k++){
          const q = FP(lerp(p[0], p[1], (k + 0.5)/8), u);
          if (q.x < -W*0.04 || q.x > W*1.04) continue;
          if (onRoad(q.x/W, q.y/H, W, H, 1.0)) continue;
          g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - H*sc); g.stroke();
        }
      }
    }
    g.restore();
    // hedge lines running away to the farm, cut short of the horizon
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = 0.20;
    for (let i = 0; i < params.hedges; i++){
      const x = -0.60 + i * (2.40 / (params.hedges - 1));
      const a = FP(x, 0.04), b = FP(x, 0.82);
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
    }
    g.restore();
    // broken dry-stone boundaries at two depths
    for (const [u, du] of [[0.30, 0.055], [0.56, 0.040]]){
      const th = H * lerp(0.013, 0.004, u);
      for (const [xa, xb] of [[-0.60,-0.20],[-0.06,0.20]]){
        const a = FP(xa,u), b = FP(xb, u + du);
        if (b.x < -W*0.05 || a.x > W*1.05) continue;
        stoneRun(pen, g, a, b, th, toneSolid(inkLevel(T.field)), 6);
      }
    }
    // a little scrub in the left fields so the middle ground is not bald
    for (const [x, u] of [[-0.10,0.34],[0.02,0.52],[-0.30,0.20],[0.16,0.68]]){
      const q = FP(x, u);
      if (q.x < 0 || q.x > W) continue;
      bush(pen, g, q.x, q.y, W*0.048*depthAtY(q.y/H), toneSolid(inkLevel(T.field)));
    }
  }

  /* ---- RURAL TRACKS + the threshing floor ---- */
  if (has("tracks")){
    for (const tr of TRACKS){
      const pts = [S(roadPtN(tr.t0)), ...tr.pts.map(p => ({ x:p[0]*W, y:p[1]*H }))];
      dashPath(g, pts, 3.2, 0.42, [W*0.014, W*0.012]);
    }
    /* the threshing floor: a swept pale disc with a broken kerb and a post —
       one of the light things that keeps the middle ground open */
    const fx = 0.330*W, fy = 0.532*H, fr = W*0.056;
    pen.paint(() => { g.ellipse(fx, fy, fr, fr*0.30, 0, 0, 7); }, toneSolid(inkLevel(1)), 3);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3.2; g.globalAlpha = 0.82;
    for (let i = 0; i < 9; i++){
      const a0 = Math.PI*2*(i/9) + 0.14;
      g.beginPath(); g.ellipse(fx, fy, fr*1.10, fr*0.36, 0, a0, a0 + Math.PI*2*0.078); g.stroke();
    }
    g.restore();
    pen.paint(() => { g.rect(fx - W*0.004, fy - H*0.022, W*0.008, H*0.022); },
              toneSolid(inkLevel(T.stone + 1)), 2);
  }

  /* ---- THE CITY: the wall, the gate they leave by, the bastion where it stops,
     the stepped roofs of the town and the palace roofline behind. ---- */
  if (has("city")){
    const wy = params.wallY * H, wh = H * 0.046;
    const gL = (params.gateX - 0.018)*W, gR = (params.gateX + 0.018)*W;
    const bx = params.bastionX * W;
    // the palace roofline, furthest back and only just visible
    pen.paint(() => { g.rect(W*0.084, wy - wh*1.86, W*0.092, H*0.014); },
              toneSolid(inkLevel(T.build)), 2.5);
    pen.paint(() => {
      g.moveTo(W*0.076, wy - wh*1.86);
      g.lineTo(W*0.130, wy - wh*1.86 - H*0.020);
      g.lineTo(W*0.184, wy - wh*1.86);
      g.closePath();
    }, toneSolid(inkLevel(T.build + 1)), 2.5);
    // town roofs behind the wall, stepped and irregular, spaced to keep paper
    const seeds = [0.028, 0.078, 0.152, 0.206, 0.248];
    for (let i = 0; i < seeds.length; i++){
      block(pen, g, seeds[i]*W, wy - wh*0.80, W*(0.030 + 0.008*((i*5)%3)),
            H*(0.022 + 0.010*((i*7)%3)),
            toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), false);
    }
    // the wall: two segments cut at the gate, stopping dead at the bastion
    const seg = (x0, x1) => stoneRun(pen, g, { x:x0, y:wy - wh }, { x:x1, y:wy - wh },
                                     wh, toneSolid(inkLevel(T.build + 1)), 5);
    seg(-W*0.02, gL); seg(gR, bx);
    for (let i = 0; i < 11; i++){          // merlons, skipping the gate
      const cx = -W*0.012 + i*W*0.028;
      if (cx > gL - W*0.008 && cx < gR + W*0.008) continue;
      if (cx > bx - W*0.012) continue;
      pen.paint(() => { g.rect(cx, wy - wh - H*0.010, W*0.013, H*0.010); },
                toneSolid(inkLevel(T.stone)), 1.6);
    }
    // the bastion: the wall ends in a tower, so the run has a reason to stop
    pen.paint(() => { g.rect(bx - W*0.019, wy - wh*1.28, W*0.038, wh*1.28); },
              toneSolid(inkLevel(T.build + 1)), 3);
    pen.paint(() => { g.rect(bx - W*0.025, wy - wh*1.28 - H*0.011, W*0.050, H*0.011); },
              toneSolid(inkLevel(T.stone)), 2.5);
    // THE GATE — two piers, a lintel, a dark arch: the city exit
    const jw = W*0.010;
    for (const px of [gL - jw, gR])
      pen.paint(() => { g.rect(px, wy - wh*1.20, jw, wh*1.20); }, toneSolid(inkLevel(T.stone)), 2.5);
    pen.paint(() => { g.rect(gL - jw*1.6, wy - wh*1.34, (gR-gL) + jw*3.2, wh*0.18); },
              toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.rect(gL, wy - wh*1.00, gR - gL, wh*1.00); },
              toneSolid(inkLevel(cover || dusk ? 5 : 6)), 2.5);
    if (dusk || cover){   // the gate lamp: the last light of the town
      g.save(); g.fillStyle = "#ffffff";
      g.beginPath(); g.ellipse((gL+gR)/2, wy - wh*0.62, (gR-gL)*0.19, wh*0.15, 0, 0, 7);
      g.fill(); g.restore();
    }
    pen.paint(() => { g.ellipse((gL+gR)/2, wy + H*0.004, W*0.030, H*0.007, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2);
    /* ATHENA'S COVER: the screen laid over the town end of the walk. A hatch,
       not a wash — the dot pass would eat a wash. */
    if (cover){
      g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.22;
      for (let i = 0; i < 14; i++){
        const y0 = hz + H*0.012 + i*H*0.020;
        g.beginPath(); g.moveTo(0, y0); g.lineTo(W*(0.18 + 0.14*((i*3)%3)), y0 + H*0.010); g.stroke();
      }
      g.restore();
    }
  }

  /* ---- THE ORCHARD: the approach. Rows in perspective inside a broken wall. */
  if (has("orchard")){
    // the ground of the orchard, one tone lighter than the fields around it
    (() => {
      const c = [op(0,0), op(1,0), op(1,1), op(0,1)].map(S);
      g.beginPath(); g.moveTo(c[0].x,c[0].y);
      for (let i = 1; i < 4; i++) g.lineTo(c[i].x, c[i].y);
      g.closePath(); g.fillStyle = inkLevel(Math.max(1, T.field - 2)); g.fill();
    })();
    // the road-side flank wall, broken, cut where the gate is
    for (const [b0, b1] of [[0.00,0.28],[0.36,0.62],[0.70,0.83]])
      stoneRun(pen, g, S(op(0,b0)), S(op(0,b1)),
               H*lerp(0.020,0.008,(b0+b1)/2), toneSolid(inkLevel(T.stone)), 7);
    // the head wall at the top of the orchard, broken
    for (const [a0, a1] of [[0.00,0.32],[0.44,0.84]]){
      const a = S(op(a0,1)), b = S(op(a1,1));
      if (a.x > W*1.03) continue;
      stoneRun(pen, g, a, b, H*0.006, toneSolid(inkLevel(T.stone)), 5);
    }
    // THE ORCHARD GATE off the road — two posts, a barred leaf, a light slab
    const og = S(ORCH_GATE), os = depthAtY(ORCH_GATE.y);
    for (const s of [-1, 1])
      pen.paint(() => { g.rect(og.x + s*W*0.026 - W*0.005, og.y - H*0.150*os, W*0.010, H*0.150*os); },
                toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.ellipse(og.x, og.y + H*0.004, W*0.032, H*0.007, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2.5);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.2; g.globalAlpha = 0.55;
    for (let i = 0; i < 3; i++){
      const y0 = og.y - H*0.126*os + i*H*0.042*os;
      g.beginPath(); g.moveTo(og.x - W*0.022, y0); g.lineTo(og.x + W*0.022, y0 - H*0.003); g.stroke();
    }
    g.restore();
    // the path from the gate to the clearing
    dashPath(g, [og, S({x:0.822,y:0.582}), S({x:MEET.clearing.x - 0.030, y:MEET.clearing.y - 0.004})],
             2.6, 0.44, [W*0.010, W*0.009]);
    // the quincunx: rows of pear / apple / fig, offset row to row
    let k = 0;
    for (let r = 0; r < 5; r++){
      const b = lerp(0.07, 0.72, r/4);
      const off = (r % 2) ? 0.5 : 0.0;
      for (let c = 0; c < 4; c++){
        const q = op((c + off + 0.40)/4.1, b);
        const sx = q.x*W, sy = q.y*H;
        if (sx > W*1.03 || sx < 0) continue;
        if (onRoad(q.x, q.y, W, H, 1.25)) continue;
        if (Math.hypot(q.x - MEET.clearing.x, (q.y - MEET.clearing.y)*1.2) < MEET.clearing.r*1.35) continue;
        fruitTree(pen, g, sx, sy, W*0.082*depthAtY(q.y), toneSolid(inkLevel(T.leaf + (r < 2 ? 1 : 0))), k++);
      }
    }
    // the staked vine terrace at the head of the orchard
    for (const [a0, a1, b] of [[0.10,0.46,0.86]]){
      const a = S(op(a0,b)), bb = S(op(a1,b));
      if (a.x > W*1.02) continue;
      vineRow(pen, g, a, bb, W*0.078*depthAtY(op(a0,b).y), toneSolid(inkLevel(T.leaf)));
    }
  }

  /* ---- THE FARM: the steading on its terrace at the end of the road ---- */
  if (has("farm")){
    const base = params.farmBase * H, gx = params.farmGateX * W;
    // the terrace the yard is cut into — two broken steps, not a beam
    for (const [x0, x1] of [[0.404,0.500],[0.548,0.618]])
      pen.paint(() => { g.rect(W*x0, base + H*0.005, W*(x1-x0), H*0.007); },
                toneSolid(inkLevel(T.stone)), 2);
    // the yard wall, cut at the gate and again where the pen begins
    stoneRun(pen, g, { x:W*0.404, y:base - H*0.012 }, { x:W*0.500, y:base - H*0.013 },
             H*0.013, toneSolid(inkLevel(T.build)), 5);
    stoneRun(pen, g, { x:W*0.590, y:base - H*0.013 }, { x:gx - W*0.016, y:base - H*0.012 },
             H*0.013, toneSolid(inkLevel(T.build)), 4);
    // THE FARM GATE — the far threshold: two posts, a dark opening, a light slab
    for (const s of [-1, 1])
      pen.paint(() => { g.rect(gx + s*W*0.016 - W*0.005, base - H*0.028, W*0.010, H*0.028); },
                toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.rect(gx - W*0.011, base - H*0.022, W*0.022, H*0.022); },
              toneSolid(inkLevel(cover ? 5 : 7)), 2);
    pen.paint(() => { g.ellipse(gx, base + H*0.003, W*0.024, H*0.006, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2);
    // the buildings: the house with its door, the men's outbuilding, the tool shed
    block(pen, g, W*0.545, base - H*0.004, W*0.082, H*0.044,
          toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), true);
    block(pen, g, W*0.620, base - H*0.002, W*0.058, H*0.028,
          toneSolid(inkLevel(T.build + 1)), toneSolid(inkLevel(T.build)), true);
    block(pen, g, W*0.482, base - H*0.002, W*0.042, H*0.020,
          toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), false);
    // the pen: a ring of stakes on the yard's west side
    for (let i = 0; i < 9; i++){
      const a = Math.PI*(0.06 + i*0.11);
      const px = W*0.436 + Math.cos(a)*W*0.028, py = H*0.412 + Math.sin(a)*H*0.009;
      pen.paint(() => { g.rect(px - W*0.0025, py - H*0.011, W*0.005, H*0.011); },
                toneSolid(inkLevel(T.stone)), 1.4);
    }
    // the smoke of the house — the one soft thing, and why the farm reads lived in
    g.save();
    g.strokeStyle = inkLevel(T.field); g.lineWidth = W*0.009; g.lineCap = "round";
    g.globalAlpha = 0.55;
    g.beginPath();
    g.moveTo(W*0.545, base - H*0.066);
    g.quadraticCurveTo(W*0.582, base - H*0.122, W*0.552, base - H*0.178);
    g.stroke(); g.restore();
  }

  /* ---- THE ROAD ---- */
  if (has("road")){
    const N = 72;
    g.beginPath();
    for (let i = 0; i <= N; i++){
      const t = i/N, p = P(t), v = roadTanN(t), hw = HW(t);
      const x = p.x - v.y*hw, y = p.y + v.x*hw;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    for (let i = N; i >= 0; i--){
      const t = i/N, p = P(t), v = roadTanN(t), hw = HW(t);
      g.lineTo(p.x + v.y*hw, p.y - v.x*hw);
    }
    g.closePath(); g.fillStyle = inkLevel(T.road); g.fill();
    g.save(); g.strokeStyle = INK; g.lineJoin = "round";
    for (const s of [1, -1]){
      g.beginPath();
      for (let i = 0; i <= N; i++){
        const t = i/N, p = P(t), v = roadTanN(t), hw = HW(t);
        const x = p.x + s*v.y*hw, y = p.y - s*v.x*hw;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.lineWidth = 3.5; g.stroke();
    }
    g.restore();
    // ruts, weighted off the depth ladder so they thin with distance
    g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.30;
    for (const off of [-0.38, 0.38]){
      for (let i = 0; i < N; i += 3){
        const t = i/N, t2 = Math.min(1, (i + 1.8)/N);
        const a = P(t), va = roadTanN(t), ha = HW(t)*off;
        const b = P(t2), vb = roadTanN(t2), hb = HW(t2)*off;
        g.lineWidth = lerp(1.1, 4.2, depthAt(t));
        g.beginPath();
        g.moveTo(a.x - va.y*ha, a.y + va.x*ha);
        g.lineTo(b.x - vb.y*hb, b.y + vb.x*hb);
        g.stroke();
      }
    }
    g.restore();
    // loose stones on the shoulders, sized by the ladder
    g.fillStyle = inkLevel(T.stone);
    for (let i = 0; i < 11; i++){
      const t = 0.04 + i*0.086, p = P(t), v = roadTanN(t);
      const hw = HW(t)*(i%2 ? 1.24 : -1.28), r = W*0.009*depthAt(t);
      g.beginPath(); g.ellipse(p.x - v.y*hw, p.y + v.x*hw, r, r*0.60, 0, 0, 7); g.fill();
    }
  }

  /* ---- THE CITY SPUR: the way they came, and the way back ---- */
  if (has("spur")){
    const j = S(roadPtN(0.44));
    const a = { x:params.gateX*W, y:0.572*H };
    const path = () => {
      g.moveTo(a.x, a.y);
      g.bezierCurveTo(W*0.176, H*0.630, W*0.212, H*0.664, j.x, j.y);
    };
    g.save(); g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = INK; g.lineWidth = W*0.019; g.beginPath(); path(); g.stroke();
    g.strokeStyle = inkLevel(T.road); g.lineWidth = W*0.011; g.beginPath(); path(); g.stroke();
    g.restore();
  }

  /* ---- THE HALT: the well off the near road, and the boundary stone ---- */
  if (has("halt")){
    const wx = 0.566*W, wy = 0.906*H, ws = depthAtY(0.906);
    // the kerb: two courses of light stone with a dark mouth, and ONE forked post
    pen.paint(() => { g.ellipse(wx, wy, W*0.052*ws, H*0.016*ws, 0, 0, 7); },
              toneSolid(inkLevel(T.stone - 2)), 3.5);
    pen.paint(() => { g.ellipse(wx, wy - H*0.012*ws, W*0.038*ws, H*0.012*ws, 0, 0, 7); },
              toneSolid(inkLevel(T.stone - 1)), 3);
    pen.paint(() => { g.ellipse(wx, wy - H*0.013*ws, W*0.022*ws, H*0.007*ws, 0, 0, 7); },
              toneSolid(inkLevel(6)), 2.5);
    pen.paint(() => { g.rect(wx + W*0.046*ws, wy - H*0.082*ws, W*0.009*ws, H*0.076*ws); },
              toneSolid(inkLevel(T.stone)), 2.5);
    pen.ink(() => { g.moveTo(wx + W*0.050*ws, wy - H*0.080*ws);
                    g.lineTo(wx + W*0.004*ws, wy - H*0.066*ws);
                    g.lineTo(wx + W*0.004*ws, wy - H*0.026*ws); }, 2.6);
    bush(pen, g, wx + W*0.106*ws, wy + H*0.016*ws, W*0.034*ws, toneSolid(inkLevel(T.field)));
    bush(pen, g, wx - W*0.112*ws, wy + H*0.024*ws, W*0.028*ws, toneSolid(inkLevel(T.field)));
    /* THE BOUNDARY STONE: where the town's land ends and the old man's begins.
       Its count is cut as three bars — geometry, never type, because type
       dissolves in the lattice. */
    const t = 0.18, p = P(t), v = roadTanN(t), hw = HW(t)*1.30, bs = depthAt(t);
    const bxs = p.x + v.y*hw, bys = p.y - v.x*hw;
    pen.paint(() => { g.rect(bxs - W*0.012*bs, bys - H*0.096*bs, W*0.024*bs, H*0.096*bs); },
              toneSolid(inkLevel(T.stone - 1)), 3);
    pen.paint(() => { g.ellipse(bxs, bys - H*0.096*bs, W*0.016*bs, H*0.012*bs, 0, 0, 7); },
              toneSolid(inkLevel(T.dark)), 2.5);
    for (let i = 0; i < 2; i++)
      pen.paint(() => { g.rect(bxs - W*0.008*bs, bys - H*0.070*bs + i*H*0.020*bs, W*0.016*bs, H*0.007*bs); },
                toneSolid(inkLevel(T.dark + 1)), 1.6);
    pen.paint(() => { g.ellipse(bxs, bys, W*0.031*bs, H*0.010*bs, 0, 0, 7); },
              toneSolid(inkLevel(T.field)), 2);
  }

  /* ---- MEETING GROUNDS: swept discs with a surveyed ring and a PAIR of
     contact stations, so an embrace has two coordinates and not one. ---- */
  if (has("zones")){
    for (const [key, z] of Object.entries(MEET)){
      const cx = z.x*W, cy = z.y*H, rx = z.r*W, ry = z.r*H*0.30;
      pen.paint(() => { g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(1)), 2.5);
      g.save();
      g.strokeStyle = INK; g.lineWidth = zones ? 3.2 : 2;
      g.globalAlpha = zones ? 0.80 : 0.24;
      g.setLineDash([W*0.012, W*0.010]);
      g.beginPath(); g.ellipse(cx, cy, rx*1.16, ry*1.22, 0, 0, 7); g.stroke();
      g.setLineDash([]);
      if (zones){
        const pair = (key === "clearing" ? 0.042 : key === "yard" ? 0.032 : 0.018)*W;
        g.lineWidth = 3.4; g.globalAlpha = 0.92;
        for (const s of [-1, 1]){
          g.beginPath();
          g.moveTo(cx + s*pair - W*0.011, cy); g.lineTo(cx + s*pair + W*0.011, cy);
          g.moveTo(cx + s*pair, cy - H*0.009); g.lineTo(cx + s*pair, cy + H*0.009);
          g.stroke();
        }
      }
      g.restore();
    }
  }

  /* ---- VERGE: broken field walls flanking the near road, in perspective ---- */
  if (has("verge")){
    const runWall = (xNear, u0, u1, th0) => {
      const a = FP(xNear, u0), b = FP(xNear, u1);
      stoneRun(pen, g, a, b, lerp(th0, th0*0.30, u0), toneSolid(inkLevel(T.field)), 9);
    };
    runWall(-0.26, 0.02, 0.26, H*0.020);
    runWall(-0.26, 0.36, 0.56, H*0.020);
    runWall( 1.86, 0.14, 0.34, H*0.018);
  }

  /* ---- FOREGROUND OCCLUSION: what a figure passes behind ---- */
  if (has("fg")){
    figTree(pen, g, W*0.958, H*1.052, H*0.182, W*0.098, toneSolid(inkLevel(T.field + 1)));
    stoneRun(pen, g, { x:-W*0.02, y:H*0.986 }, { x:W*0.092, y:H*1.004 },
             H*0.026, toneSolid(inkLevel(T.field + 1)), 6);
    g.fillStyle = inkLevel(T.field);
    for (let i = 0; i < 3; i++){
      const x = W*(0.640 + i*0.104), y = H*(1.022 - 0.005*(i%3));
      g.beginPath(); g.ellipse(x, y, W*0.026, H*0.012, 0, 0, 7); g.fill();
    }
  }
}

export const asset = {
  id:"location.road-to-laertess-farm",
  type:"LOCATION",
  name:"Road to Laertes's Farm",
  statusWord:"THE WALK OUT",
  scene:"OD-B23-S06",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","hills","ground","fields","tracks","city","orchard","farm","road",
          "spur","halt","zones","verge","fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky","hills","fields","city","orchard","farm"],
              ground:["ground","tracks","road","spur","halt","zones"],
              front:["verge","fg"] },
  // normalized 0..1 placement / camera anchors — seated on the road + the ladder
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.02,y0:.40,x1:.98,y1:.99 },
    road:{ x0:.10,y0:.40,x1:.76,y1:.99 },
    "road-near":{ x0:.10,y0:.84,x1:.50,y1:.99 },
    "road-mid":{ x0:.20,y0:.60,x1:.62,y1:.86 },
    "road-far":{ x0:.60,y0:.40,x1:.74,y1:.60 },
    "city-exit":{ x0:.09,y0:.53,x1:.20,y1:.62 },
    spur:{ x0:.12,y0:.55,x1:.42,y1:.72 },
    fields:{ x0:.02,y0:.52,x1:.30,y1:.88 },
    orchard:{ x0:.74,y0:.46,x1:.99,y1:.78 },
    "orchard-clearing":{ x0:.82,y0:.58,x1:.95,y1:.65 },
    farmyard:{ x0:.39,y0:.39,x1:.65,y1:.44 },
    "threshing-floor":{ x0:.27,y0:.51,x1:.39,y1:.55 },
    threshold_city_gate:{ x0:.11,y0:.54,x1:.16,y1:.58 },
    threshold_orchard_gate:{ x0:.73,y0:.50,x1:.79,y1:.55 },
    threshold_farm_gate:{ x0:.64,y0:.39,x1:.68,y1:.42 },
  },
  states:{
    initial:"day",
    nodes:{
      day:{ preview:{ state:"day" } },
      dusk:{ preview:{ state:"dusk" } },
      // Athena's screen over the town end: the world dims, the road stays bright
      "night-cover":{ preview:{ state:"night-cover" } },
      // the meeting grounds struck in — previs / blocking
      survey:{ preview:{ state:"survey", zonesLit:true } },
      // the bare walking set: the road, the two ends, nothing to stop for
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["day","dusk"],["dusk","day"],["dusk","night-cover"],["night-cover","dusk"],
           ["day","night-cover"],["night-cover","day"],["day","survey"],["survey","day"],
           ["day","bare"],["bare","day"]],
  },
  channels:["state","reveal","camera","light","cover","zones","traffic"],

  preview:()=>({ state:"day", t:0, status:"THE WALK OUT", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
