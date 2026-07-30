/* location.laertess-orchard — the old king's steading: the worked farm where
   Laertes lives out his self-imposed exile. LOCATION asset (empty navigable set
   — NO baked figures). Solid grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone.

   THE SHAPE OF BOOK XXIV. Everything the book needs from this ground happens in
   one frame and in one geometry: the APPROACH climbs in from the near bottom
   left (the way from town — the way Odysseus walks in at S03 and the way the
   militia walks in at S08); it ends at the FARM GATE; behind the gate sit the
   FARMHOUSE and its outbuildings on their cut terrace; the swept FEAST YARD lies
   in front of the door with its trestle boards and hearth ring; the BATH stands
   on its paved plinth at the yard's east lip; and the whole right two-thirds of
   the frame is the ORCHARD ITSELF — a surveyed quincunx of pear, apple and fig
   inside a broken boundary wall, with the staked vine terrace at its head.

   THE ISOLATED LABOR POSITION IS THE PLOT. Laertes is found alone, far from the
   house, hoeing round one young tree. So the set carves that out as real
   geometry: a swept disc of turned earth at `labor:plot`, deep in the near
   orchard, with a staked sapling, a spoil heap, a leaning hoe — and an
   EXCLUSION RADIUS that no orchard row is allowed to grow inside. The isolation
   is enforced by the stamp test, not by drawing skill. A dashed LANE runs from
   the yard to that plot: the walk that takes the whole of S03.

   ONE DEPTH LADDER. depthAtY() maps ground height to scale and everything
   standing on the ground — trees, stakes, buildings, a placed figure — is sized
   from its own y, so the far vine terrace and the near labour plot agree about
   the size of the world.

   NOTHING SPANS THE FRAME. The far range is two separate humps stopping short of
   both edges; the boundary wall is cut into three runs and cut again at the
   gate; the terrace under the buildings is two short steps; the feast table is
   two boards with a gap; the muster line is a broken picket. The horizon is a
   tone change, not a rule.

   CONTACT PAIRS. An embrace needs two coordinates, never one: `meet:labor_l` /
   `meet:labor_r` (where the son names himself and the father collapses) and
   `meet:yard_l` / `meet:yard_r` are authored as pairs.

   States: "worked" (the default — the farm as Odysseus finds it), "feast" (the
   yard dressed, boards laid, the ground lit), "muster" (the picket struck across
   the yard mouth and the approach marked — the last clash), "dusk", "survey"
   (zones and species markers struck in for previs), "bare" (the navigable set
   only).

   Serves OD-B24-S03 and returns through S04, S05 and S08.
   Atlas: OD-B24-S03 — worked farm with rows of trees, isolated labor position,
   farmhouse, bath, feast yard, and battle approach. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const MODES = ["worked", "feast", "muster", "dusk", "survey", "bare"];

const params = {
  horizon:0.280,      // sky / ground split as a fraction of H
  farmBase:0.470,     // ground line of the steading terrace
  gateX:0.238,        // the farm gate — the head of the approach
  gateY:0.492,
  rows:6,             // planted rows in the quincunx
  cols:5,             // stamps offered per row (culled by road / lane / plot)
  hedges:5,           // field divisions west of the approach
  zonesLit:false,     // meeting grounds struck in as survey
};

/* ---------- THE ONE DEPTH LADDER ---------- */
const NEAR_Y  = 1.040;
const groundU = y => clamp((y - params.horizon) / (NEAR_Y - params.horizon), 0, 1);
const depthAtY= y => lerp(0.075, 1.000, Math.pow(groundU(y), 1.22));

/* ---------- THE APPROACH ----------
   One Catmull-Rom chain: t = 0 at the near bottom edge (the way in from town),
   t = 1 at the farm gate. y is monotonic — the road only ever recedes. */
const CR = [
  [0.118, 1.050],   // phantom
  [0.118, 1.050],   // t = 0   near edge, off-frame so the road bleeds
  [0.048, 0.874],
  [0.108, 0.722],
  [0.194, 0.614],
  [0.228, 0.540],
  [0.238, 0.492],   // t = 1   the farm gate
  [0.238, 0.492],   // phantom
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
const roadHW = t => lerp(0.005, 0.048, Math.pow(groundU(roadPtN(t).y), 1.15));
const depthAt= t => depthAtY(roadPtN(t).y);

const RS = (() => { const a=[]; for(let i=0;i<=64;i++){ const t=i/64, p=roadPtN(t);
  a.push({ x:p.x, y:p.y, hw:roadHW(t) }); } return a; })();
function onRoad(x, y, W, H, pad = 1.4){
  for (const s of RS){
    if (Math.hypot((x-s.x)*W, (y-s.y)*H) < s.hw*W*pad) return true;
  }
  return false;
}

/* ---------- THE ORCHARD PLOT ----------
   A screen-space quad. `a` runs 0 (the yard flank) -> 1 (deep east), `b` runs
   0 (near) -> 1 (the head of the orchard, where the vines are staked).
   The wall, the gate, the rows, the lane and the labour plot are ALL placed
   through op(), so every part of the orchard agrees with every other part. */
const ORCH = { NL:[0.402,0.985], NR:[1.070,0.900], FR:[0.930,0.398], FL:[0.556,0.432] };
function op(a, b){
  const nx = lerp(ORCH.NL[0], ORCH.NR[0], a), ny = lerp(ORCH.NL[1], ORCH.NR[1], a);
  const fx = lerp(ORCH.FL[0], ORCH.FR[0], a), fy = lerp(ORCH.FL[1], ORCH.FR[1], a);
  return { x: lerp(nx, fx, b), y: lerp(ny, fy, b) };
}
/* THE ISOLATED LABOR POSITION — one young tree, deep in the near rows, a long
   way from the house. Nothing else is permitted inside LABOR.r. */
const LABOR = { ...op(0.355, 0.105), r:0.150 };
const ORCH_GATE = op(0.02, 0.62);          // where the flank wall opens to the lane

/* THE LANE — the walk from the yard out to where the old man is working. */
const LANE = [ {x:0.352,y:0.566}, {x:0.436,y:0.664}, {x:0.510,y:0.762},
               {x:0.578,y:0.842}, {x:LABOR.x - 0.038, y:LABOR.y - 0.020} ];
function onLane(x, y, W, H, pad){
  for (let i=0;i<LANE.length-1;i++){
    for (let k=0;k<=6;k++){
      const q = k/6;
      const lx = lerp(LANE[i].x, LANE[i+1].x, q), ly = lerp(LANE[i].y, LANE[i+1].y, q);
      if (Math.hypot((x-lx)*W, (y-ly)*H) < pad*W) return true;
    }
  }
  return false;
}

/* ---------- the swept grounds ---------- */
const MEET = {
  labor:{ x:LABOR.x, y:LABOR.y, r:0.082 },   // where he is known again
  yard: { x:0.300,  y:0.582,   r:0.098 },    // the feast yard before the door
  gate: { x:params.gateX, y:params.gateY + 0.008, r:0.028 },
};

/* ---------- anchors: read off the road, the quad and the ladder ---------- */
const nz = p => ({ x:+clamp(p.x,0,1).toFixed(3), y:+clamp(p.y,0,1).toFixed(3) });
const rd = t => nz(roadPtN(t));
export const anchors = {
  // the battle approach — the way in from town, at four depths
  "approach:near":        rd(0.00),
  "approach:lower":       rd(0.22),
  "approach:bend":        rd(0.46),
  "approach:upper":       rd(0.78),
  "approach:gate":        rd(0.97),
  "exit:town":            rd(0.00),
  "threshold:farm-gate":  { x:params.gateX, y:params.gateY },
  // the muster line the household holds across the yard mouth
  "defense:line_l":       { x:0.148, y:0.678 },
  "defense:line_c":       { x:0.268, y:0.658 },
  "defense:line_r":       { x:0.392, y:0.638 },
  // the steading
  "farm:house-door":      { x:0.205, y:0.470 },
  "farm:outbuilding":     { x:0.322, y:0.468 },
  "farm:tool-shed":       { x:0.104, y:0.474 },
  "farm:pen":             { x:0.062, y:0.492 },
  "exit:farmhouse":       { x:0.205, y:0.470 },
  // the feast yard
  "yard:feast":           { x:MEET.yard.x, y:MEET.yard.y },
  "yard:hearth":          { x:0.232, y:0.616 },
  "feast:board_head":     { x:0.272, y:0.586 },
  "feast:board_foot":     { x:0.354, y:0.572 },
  "feast:bench_n":        { x:0.288, y:0.608 },
  "feast:bench_f":        { x:0.312, y:0.548 },
  "meet:yard_l":          { x:MEET.yard.x - 0.058, y:MEET.yard.y + 0.010 },
  "meet:yard_r":          { x:MEET.yard.x + 0.058, y:MEET.yard.y - 0.008 },
  // the bath on its plinth at the yard's east lip
  "bath:tub":             { x:0.432, y:0.556 },
  "bath:stand":           { x:0.486, y:0.570 },
  // the orchard
  "threshold:orchard-gate": nz(ORCH_GATE),
  "orchard:lane":         { x:0.510, y:0.762 },
  "orchard:pears":        nz(op(0.30, 0.86)),
  "orchard:apples":       nz(op(0.44, 0.56)),
  "orchard:figs":         nz(op(0.62, 0.24)),
  "orchard:vines":        nz(op(0.84, 0.40)),
  "exit:fields-east":     nz(op(1.00, 0.50)),
  // THE ISOLATED LABOR POSITION and its contact pair
  "labor:plot":           nz(LABOR),
  "labor:sapling":        { x:+ (LABOR.x + 0.012).toFixed(3), y:+ (LABOR.y - 0.052).toFixed(3) },
  "labor:spoil":          { x:+ (LABOR.x + 0.076).toFixed(3), y:+ (LABOR.y + 0.014).toFixed(3) },
  "labor:tools":          { x:+ (LABOR.x - 0.082).toFixed(3), y:+ (LABOR.y + 0.006).toFixed(3) },
  "meet:labor_l":         { x:+ (LABOR.x - 0.052).toFixed(3), y:+ (LABOR.y + 0.010).toFixed(3) },
  "meet:labor_r":         { x:+ (LABOR.x + 0.052).toFixed(3), y:+ (LABOR.y - 0.006).toFixed(3) },
  // cameras
  "camera:wide":          { x:0.500, y:0.660 },
  "camera:labor":         { x:LABOR.x, y:0.880 },
  "camera:yard":          { x:0.300, y:0.560 },
  "camera:approach":      { x:0.160, y:0.780 },
  "camera:orchard":       { x:0.680, y:0.640 },
};

/* ---------- stamps ---------- */
function fruitTree(pen, g, x, base, s, tone, kind){
  const T = kind === "pear" ? 0.46 : kind === "fig" ? 0.32 : 0.38;
  pen.paint(() => {
    g.moveTo(x - s*0.070, base);
    g.lineTo(x - s*0.084, base - s*T);
    g.lineTo(x + s*0.076, base - s*T*1.04);
    g.lineTo(x + s*0.062, base);
    g.closePath();
  }, toneSolid(inkLevel(5)), 2);
  const lobes = kind === "pear" ? [[-0.17,-0.64,0.27],[0.16,-0.72,0.25],[0.00,-0.92,0.23]]
              : kind === "fig"  ? [[-0.33,-0.50,0.37],[0.31,-0.55,0.34],[0.00,-0.74,0.29]]
                                : [[-0.23,-0.56,0.32],[0.24,-0.61,0.29],[0.00,-0.80,0.26]];
  for (const [ox, oy, r] of lobes)
    pen.paint(() => { g.ellipse(x + s*ox, base + s*oy, s*r, s*r*0.76, 0, 0, 7); }, tone, 2.4);
}
/* the staked vine terrace: cordon posts with a broken cross-cordon of leaf */
function vineRow(pen, g, a, b, s, tone, n = 5){
  for (let i = 0; i < n; i++){
    const k = i/(n-1), x = lerp(a.x, b.x, k), y = lerp(a.y, b.y, k);
    pen.paint(() => { g.rect(x - s*0.042, y - s*0.42, s*0.084, s*0.42); }, toneSolid(inkLevel(5)), 1.6);
    if (i < n-1 && i % 2 === 0){
      const k2 = (i + 0.60)/(n-1);
      const x2 = lerp(a.x, b.x, k2), y2 = lerp(a.y, b.y, k2);
      pen.paint(() => { g.ellipse((x+x2)/2, (y+y2)/2 - s*0.38, s*0.18, s*0.11, 0, 0, 7); }, tone, 1.6);
    }
  }
}
function bush(pen, g, x, base, s, tone){
  pen.paint(() => { g.ellipse(x, base - s*0.54, s*0.62, s*0.42, 0, 0, 7); }, tone, 2.2);
  pen.ink(() => { g.moveTo(x, base); g.lineTo(x, base - s*0.46); }, 1.8);
}
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
/* species tally cut as BARS — geometry, never type: numerals dissolve in the
   lattice, so a count is a run of blocks on a marker post. */
function markerPost(pen, g, x, base, s, bars){
  pen.paint(() => { g.rect(x - s*0.030, base - s*0.44, s*0.060, s*0.44); },
            toneSolid(inkLevel(4)), 2);
  for (let i = 0; i < bars; i++)
    pen.paint(() => { g.rect(x - s*0.086, base - s*0.40 + i*s*0.105, s*0.172, s*0.052); },
              toneSolid(inkLevel(6)), 1.4);
}

/* ---------- the set ---------- */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode  = MODES.includes(st.state) ? st.state : "worked";
  const dusk  = mode === "dusk";
  const feast = mode === "feast";
  const muster= mode === "muster";
  const zones = (st.zonesLit ?? params.zonesLit) || mode === "survey";
  const layers = st.layers || (mode === "bare"
    ? ["sky","hills","ground","orchard","farm","yard","approach","labor"]
    : ["sky","hills","ground","fields","orchard","vines","farm","yard","bath",
       "approach","lane","labor","muster","zones","verge","fg"]);
  const has = l => layers.includes(l);

  /* the whole set lights from this one table. Light planes, dark accents:
     nothing above level 3 covers area, and the swept grounds stay at 1. */
  const T = dusk   ? { sky:3, far:3, ridge:4, ground:3, field:4, stone:5, build:3, dark:6, road:1, leaf:4 }
          : muster ? { sky:2, far:3, ridge:4, ground:2, field:3, stone:5, build:3, dark:6, road:1, leaf:3 }
                   : { sky:1, far:2, ridge:3, ground:2, field:3, stone:4, build:2, dark:5, road:1, leaf:3 };

  const hz = params.horizon * H;
  const P  = t => { const p = roadPtN(t); return { x:p.x*W, y:p.y*H }; };
  const HW = t => roadHW(t) * W;
  const S  = p => ({ x:p.x*W, y:p.y*H });
  const VP = { x: 0.40*W, y: hz };
  const NEAR = H*NEAR_Y;
  const FP = (x, u) => ({ x: lerp(x*W, VP.x, u), y: lerp(NEAR, VP.y, u) });

  /* ---- SKY ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, hz);
    g.fillStyle = inkLevel(T.sky + 1);
    for (let i = 0; i < 3; i++){
      g.beginPath();
      g.ellipse(W*(0.22 + i*0.28), hz*(0.28 + 0.26*(i%2)), W*0.112, H*0.010, 0, 0, 7); g.fill();
    }
    if (dusk){ g.fillStyle = inkLevel(1); g.fillRect(0, hz - H*0.016, W, H*0.016); }
  }

  /* ---- GROUND: the horizon is a tone change, not a rule ---- */
  if (has("ground")){ g.fillStyle = inkLevel(T.ground); g.fillRect(0, hz, W, H - hz); }

  /* ---- HILLS: two separate humps, neither touching a frame edge ---- */
  if (has("hills")){
    const hump = (pts, level, lw) => {
      const trace = () => {
        g.moveTo(pts[0][0]*W, hz + pts[0][1]*H);
        g.quadraticCurveTo(pts[1][0]*W, hz + pts[1][1]*H, pts[2][0]*W, hz + pts[2][1]*H);
        g.quadraticCurveTo(pts[3][0]*W, hz + pts[3][1]*H, pts[4][0]*W, hz + pts[4][1]*H);
      };
      g.beginPath(); trace();
      g.lineTo(pts[4][0]*W, hz + H*0.05); g.lineTo(pts[0][0]*W, hz + H*0.05);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
      g.save(); g.strokeStyle = INK; g.lineWidth = lw; g.lineJoin = "round";
      g.beginPath(); trace(); g.stroke(); g.restore();
    };
    hump([[0.045,0.004],[0.16,-0.078],[0.29,-0.028],[0.37,0.002],[0.442,0.006]], T.far, 3.5);
    hump([[0.520,0.006],[0.68,-0.090],[0.82,-0.024],[0.90,0.000],[0.968,0.006]], T.far, 3.5);
    hump([[0.395,0.022],[0.56,-0.022],[0.72,0.006],[0.84,0.024],[0.952,0.020]], T.ridge, 3);
  }

  /* ---- FIELDS west of the approach: perspective plots, broken boundaries ---- */
  if (has("fields")){
    const quad = (xa, xb, u0, u1, level) => {
      const a = FP(xa,u0), b = FP(xb,u0), c = FP(xb,u1), d = FP(xa,u1);
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
    };
    const PLOTS = [ [-0.72,-0.28,0.04,0.26], [-0.52,-0.10,0.30,0.46],
                    [-0.30, 0.02,0.50,0.62], [-0.14, 0.06,0.66,0.76] ];
    PLOTS.forEach(p => quad(p[0], p[1], p[2], p[3], T.field));
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.15;
    for (const p of PLOTS){
      for (let r = 0; r < 3; r++){
        const u = lerp(p[2], p[3], (r + 0.5)/3), sc = lerp(0.020, 0.005, u);
        for (let k = 0; k < 7; k++){
          const q = FP(lerp(p[0], p[1], (k + 0.5)/7), u);
          if (q.x < -W*0.04 || q.x > W*0.42) continue;
          if (onRoad(q.x/W, q.y/H, W, H, 1.0)) continue;
          g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - H*sc); g.stroke();
        }
      }
    }
    g.restore();
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = 0.20;
    for (let i = 0; i < params.hedges; i++){
      const x = -0.70 + i*(0.86/(params.hedges - 1));
      const a = FP(x, 0.06), b = FP(x, 0.74);
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
    }
    g.restore();
    for (const [u, du] of [[0.28, 0.050], [0.54, 0.038]]){
      const th = H * lerp(0.013, 0.004, u);
      for (const [xa, xb] of [[-0.68,-0.30],[-0.18,0.02]]){
        const a = FP(xa,u), b = FP(xb, u + du);
        if (b.x < -W*0.05 || a.x > W*0.44) continue;
        stoneRun(pen, g, a, b, th, toneSolid(inkLevel(T.field)), 6);
      }
    }
    for (const [x, u] of [[-0.16,0.32],[-0.02,0.54],[-0.38,0.18]]){
      const q = FP(x, u); if (q.x < 0 || q.x > W*0.40) continue;
      bush(pen, g, q.x, q.y, W*0.046*depthAtY(q.y/H), toneSolid(inkLevel(T.field)));
    }
  }

  /* ---- THE ORCHARD: the ground, the broken wall, the surveyed quincunx ---- */
  if (has("orchard")){
    (() => {                                  // the worked ground, a tone lighter
      const c = [op(0,0), op(1,0), op(1,1), op(0,1)].map(S);
      g.beginPath(); g.moveTo(c[0].x, c[0].y);
      for (let i = 1; i < 4; i++) g.lineTo(c[i].x, c[i].y);
      g.closePath(); g.fillStyle = inkLevel(Math.max(1, T.field - 2)); g.fill();
    })();
    /* The boundary between yard and orchard runs AWAY from camera, so it is a
       receding line of set stones, not a wall drawn end-on: a near-vertical
       stoneRun collapses into a sliver and reads as a stray black bar. */
    for (let i = 0; i <= 15; i++){
      const b = i/15;
      if (b > 0.34 && b < 0.44) continue;        // the gap onto the lane
      if (b > 0.55 && b < 0.71) continue;        // the gate
      const q = op(0.02, b), s = W*0.058*depthAtY(q.y);
      pen.paint(() => { g.rect(q.x*W - s*0.30, q.y*H - s*0.46, s*0.60, s*0.46); },
                toneSolid(inkLevel(T.stone)), 1.8);
    }
    // the head wall at the top of the orchard, broken
    for (const [a0, a1] of [[0.06,0.36],[0.50,0.90]]){
      const a = S(op(a0,1)), b = S(op(a1,1));
      if (a.x > W*1.03) continue;
      stoneRun(pen, g, a, b, H*0.006, toneSolid(inkLevel(T.stone)), 5);
    }
    // THE ORCHARD GATE off the yard — posts, a barred leaf, a light slab
    const og = S(ORCH_GATE), os = depthAtY(ORCH_GATE.y), oh = H*0.074*os;
    for (const s of [-1, 1])
      pen.paint(() => { g.rect(og.x + s*W*0.030 - W*0.006, og.y - oh, W*0.012, oh); },
                toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.ellipse(og.x, og.y + H*0.005, W*0.038, H*0.009, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2.5);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.4; g.globalAlpha = 0.60;
    for (let i = 0; i < 2; i++){
      const y0 = og.y - oh*0.78 + i*oh*0.40;
      g.beginPath(); g.moveTo(og.x - W*0.026, y0); g.lineTo(og.x + W*0.026, y0 - H*0.003); g.stroke();
    }
    g.restore();
    /* THE ROWS. First the furrow each row is planted along — broken into two
       runs so no line ever crosses the frame — then the stamps themselves.
       The furrows are what make a scatter read as PLANTING. */
    const ROWB = [];
    for (let r = 0; r < params.rows; r++) ROWB.push(lerp(0.13, 0.95, r/(params.rows - 1)));
    g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.22;
    for (const b of ROWB){
      g.lineWidth = lerp(1.2, 3.4, 1 - b);
      for (const [a0, a1] of [[0.05,0.42],[0.53,0.96]]){
        const a = S(op(a0,b)), bb = S(op(a1,b));
        if (a.x > W*1.02) continue;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(Math.min(bb.x, W*1.02), bb.y); g.stroke();
      }
    }
    g.restore();
    let k = 0;
    for (let r = 0; r < params.rows; r++){
      const b = ROWB[r];
      const off = (r % 2) ? 0.5 : 0.0;
      const kind = b > 0.70 ? "pear" : b > 0.38 ? "apple" : "fig";
      for (let c = 0; c < params.cols; c++){
        const a = (c + off + 0.30)/(params.cols + 0.20);
        if (a > 0.64 && b > 0.20 && b < 0.56) continue;   // the vine block's ground
        const q = op(a, b);
        const sx = q.x*W, sy = q.y*H;
        if (sx > W*1.04 || sx < W*0.02) continue;
        if (onRoad(q.x, q.y, W, H, 1.2)) continue;
        if (onLane(q.x, q.y, W, H, 0.052)) continue;
        if (Math.hypot(q.x - LABOR.x, (q.y - LABOR.y)*1.15) < LABOR.r) continue;
        fruitTree(pen, g, sx, sy, W*0.122*depthAtY(q.y),
                  toneSolid(inkLevel(T.leaf + ((r + k) % 2 ? 1 : 0))), kind);
        k++;
      }
    }
    if (zones){   // species markers at the head of each block — bars, not type
      markerPost(pen, g, S(op(0.10,0.90)).x, S(op(0.10,0.90)).y, W*0.060, 3);
      markerPost(pen, g, S(op(0.14,0.52)).x, S(op(0.14,0.52)).y, W*0.070, 2);
      markerPost(pen, g, S(op(0.16,0.16)).x, S(op(0.16,0.16)).y, W*0.082, 4);
    }
  }

  /* ---- THE VINE TERRACE on the orchard's east flank, where the ground is
     near enough for a staked cordon to actually read as staked ---- */
  if (has("vines")){
    for (const [a0, a1, b] of [[0.70,0.98,0.26],[0.68,0.98,0.40],[0.72,0.98,0.52]]){
      const p0 = op(a0,b), p1 = op(a1,b);
      if (p0.x > 1.02) continue;
      vineRow(pen, g, S(p0), S(p1), W*0.096*depthAtY(p0.y), toneSolid(inkLevel(T.leaf)), 4);
    }
  }

  /* ---- THE STEADING: house, outbuilding, tool shed, pen, on a cut terrace ---- */
  if (has("farm")){
    const base = params.farmBase * H;
    // the terrace: two short steps, never one beam
    for (const [x0, x1] of [[0.052,0.152],[0.188,0.276]])
      pen.paint(() => { g.rect(W*x0, base + H*0.006, W*(x1-x0), H*0.008); },
                toneSolid(inkLevel(T.stone)), 2);
    // the yard wall, cut at the gate
    stoneRun(pen, g, { x:W*0.058, y:base - H*0.014 }, { x:W*0.166, y:base - H*0.015 },
             H*0.014, toneSolid(inkLevel(T.build)), 5);
    stoneRun(pen, g, { x:W*0.272, y:base - H*0.015 }, { x:W*(params.gateX - 0.020), y:base - H*0.014 },
             H*0.014, toneSolid(inkLevel(T.build)), 4);
    // THE FARM GATE — the threshold the militia has to come through
    const gx = params.gateX*W, gy = params.gateY*H;
    for (const s of [-1, 1])
      pen.paint(() => { g.rect(gx + s*W*0.020 - W*0.005, gy - H*0.036, W*0.010, H*0.036); },
                toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.rect(gx - W*0.014, gy - H*0.028, W*0.028, H*0.028); },
              toneSolid(inkLevel(muster || dusk ? 5 : 6)), 2);
    pen.paint(() => { g.ellipse(gx, gy + H*0.004, W*0.028, H*0.007, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2);
    // the buildings
    block(pen, g, W*0.205, base - H*0.004, W*0.104, H*0.052,
          toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), true);
    block(pen, g, W*0.322, base - H*0.002, W*0.068, H*0.032,
          toneSolid(inkLevel(T.build + 1)), toneSolid(inkLevel(T.build)), true);
    block(pen, g, W*0.104, base - H*0.002, W*0.050, H*0.024,
          toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), false);
    // the stock pen: a short arc of stakes on the west side
    for (let i = 0; i < 7; i++){
      const a = Math.PI*(0.08 + i*0.13);
      const px = W*0.062 + Math.cos(a)*W*0.030, py = H*0.492 + Math.sin(a)*H*0.010;
      pen.paint(() => { g.rect(px - W*0.0025, py - H*0.012, W*0.005, H*0.012); },
                toneSolid(inkLevel(T.stone)), 1.4);
    }
    // hearth smoke — the one soft thing, and why the farm reads lived in
    g.save();
    g.strokeStyle = inkLevel(T.field); g.lineWidth = W*0.009; g.lineCap = "round";
    g.globalAlpha = 0.50;
    g.beginPath(); g.moveTo(W*0.205, base - H*0.078);
    g.quadraticCurveTo(W*0.242, base - H*0.136, W*0.212, base - H*0.196); g.stroke();
    g.restore();
  }

  /* ---- THE FEAST YARD: swept ground, two boards with a gap, benches, hearth -- */
  if (has("yard")){
    const z = MEET.yard, cx = z.x*W, cy = z.y*H;
    pen.paint(() => { g.ellipse(cx, cy, z.r*W, z.r*H*0.36, 0, 0, 7); }, toneSolid(inkLevel(1)), 3);
    // the hearth ring — a broken kerb of stones round a dark eye
    const hx = 0.232*W, hy = 0.616*H;
    for (let i = 0; i < 9; i++){
      if (i === 6) continue;
      const a = Math.PI*2*i/9;
      pen.paint(() => { g.ellipse(hx + Math.cos(a)*W*0.038, hy + Math.sin(a)*H*0.012,
                                 W*0.012, H*0.006, 0, 0, 7); }, toneSolid(inkLevel(T.stone)), 1.6);
    }
    pen.paint(() => { g.ellipse(hx, hy, W*0.022, H*0.008, 0, 0, 7); },
              toneSolid(inkLevel(feast ? 7 : 5)), 2);
    // THE BOARDS — two trestle tops with a gap between them, never one span
    const boards = [[0.240,0.594,0.306,0.582],[0.328,0.578,0.392,0.566]];
    for (const [x0,y0,x1,y1] of boards){
      pen.paint(() => {
        g.moveTo(W*x0, H*y0); g.lineTo(W*x1, H*y1);
        g.lineTo(W*x1, H*(y1 + 0.014)); g.lineTo(W*x0, H*(y0 + 0.016)); g.closePath();
      }, toneSolid(inkLevel(feast ? 2 : 3)), 2.6);
      for (const k of [0.14, 0.86]){
        const lx = lerp(W*x0, W*x1, k), ly = lerp(H*y0, H*y1, k) + H*0.014;
        pen.paint(() => { g.rect(lx - W*0.006, ly, W*0.012, H*0.026); },
                  toneSolid(inkLevel(T.stone)), 1.8);
      }
      if (feast){   // cups and loaves laid out — dark beads on a light board
        for (let i = 0; i < 3; i++){
          const k = 0.20 + i*0.30;
          const bx = lerp(W*x0, W*x1, k), by = lerp(H*y0, H*y1, k);
          pen.paint(() => { g.ellipse(bx, by + H*0.002, W*0.011, H*0.006, 0, 0, 7); },
                    toneSolid(inkLevel(6)), 1.5);
        }
      }
    }
    // benches, near and far, each cut short of the boards' ends
    for (const [x0,y0,x1,y1] of [[0.248,0.622,0.328,0.608],[0.272,0.556,0.362,0.542]])
      pen.paint(() => {
        g.moveTo(W*x0, H*y0); g.lineTo(W*x1, H*y1);
        g.lineTo(W*x1, H*(y1 + 0.009)); g.lineTo(W*x0, H*(y0 + 0.010)); g.closePath();
      }, toneSolid(inkLevel(T.stone)), 2.2);
  }

  /* ---- THE BATH on its paved plinth at the yard's east lip ---- */
  if (has("bath")){
    const by = 0.556, bx = 0.432*W, byy = by*H, s = W*0.240*depthAtY(by);
    pen.paint(() => { g.ellipse(bx, byy + s*0.10, s*0.66, s*0.20, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2.6);            // the paving
    pen.paint(() => { g.rect(bx - s*0.34, byy - s*0.34, s*0.68, s*0.40); },
              toneSolid(inkLevel(T.stone - 1)), 3);    // the tub
    pen.paint(() => { g.ellipse(bx, byy - s*0.34, s*0.34, s*0.11, 0, 0, 7); },
              toneSolid(inkLevel(2)), 2.4);            // the water, light
    pen.ink(() => { g.ellipse(bx, byy - s*0.34, s*0.19, s*0.062, 0, 0, 7); }, 1.8);
    // the cloth rail: one post, a bar, a hanging cloth
    pen.paint(() => { g.rect(bx + s*0.52, byy - s*0.92, s*0.10, s*1.00); },
              toneSolid(inkLevel(T.stone)), 2.2);
    pen.ink(() => { g.moveTo(bx + s*0.22, byy - s*0.86); g.lineTo(bx + s*0.60, byy - s*0.90); }, 2.6);
    pen.paint(() => { g.rect(bx + s*0.26, byy - s*0.87, s*0.24, s*0.42); },
              toneSolid(inkLevel(2)), 2.2);
    // the oil jar on the paving
    pen.paint(() => { g.ellipse(bx - s*0.50, byy - s*0.02, s*0.13, s*0.14, 0, 0, 7); },
              toneSolid(inkLevel(T.dark)), 2);
  }

  /* ---- THE APPROACH: the way in from town, and the way the militia comes ---- */
  if (has("approach")){
    const N = 64;
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
    g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.28;
    for (const off of [-0.38, 0.38]){
      for (let i = 0; i < N; i += 3){
        const t = i/N, t2 = Math.min(1, (i + 1.8)/N);
        const a = P(t), va = roadTanN(t), ha = HW(t)*off;
        const b = P(t2), vb = roadTanN(t2), hb = HW(t2)*off;
        g.lineWidth = lerp(1.1, 4.0, depthAt(t));
        g.beginPath();
        g.moveTo(a.x - va.y*ha, a.y + va.x*ha); g.lineTo(b.x - vb.y*hb, b.y + vb.x*hb);
        g.stroke();
      }
    }
    g.restore();
    g.fillStyle = inkLevel(T.stone);
    for (let i = 0; i < 9; i++){
      const t = 0.05 + i*0.104, p = P(t), v = roadTanN(t);
      const hw = HW(t)*(i%2 ? 1.26 : -1.30), r = W*0.009*depthAt(t);
      g.beginPath(); g.ellipse(p.x - v.y*hw, p.y + v.x*hw, r, r*0.60, 0, 0, 7); g.fill();
    }
  }

  /* ---- THE LANE from the yard out to where the old man is working ---- */
  if (has("lane"))
    dashPath(g, LANE.map(S), 2.8, 0.44, [W*0.012, W*0.010]);

  /* ---- THE ISOLATED LABOR POSITION ----
     One young tree, a disc of turned earth, a spoil heap, a leaning hoe. The
     orchard rows are forbidden inside LABOR.r, so the isolation is structural. */
  if (has("labor")){
    const lx = LABOR.x*W, ly = LABOR.y*H, s = W*0.225*depthAtY(LABOR.y);
    // the swept bed: light worked earth inside a hard surveyed rim
    pen.paint(() => { g.ellipse(lx, ly, s*0.74, s*0.25, 0, 0, 7); }, toneSolid(inkLevel(0)), 3.5);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.42;
    for (let i = 0; i < 11; i++){        // turned clods heaped round the rim
      const a = Math.PI*2*(i/11) + 0.2;
      g.beginPath();
      g.ellipse(lx + Math.cos(a)*s*0.70, ly + Math.sin(a)*s*0.24, s*0.060, s*0.028, a, 0, 7);
      g.stroke();
    }
    g.restore();
    // spade cuts radiating in the dug soil — the work actually being done
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.26;
    for (let i = 0; i < 6; i++){
      const a = Math.PI*2*(i/6) + 0.5;
      g.beginPath();
      g.moveTo(lx + Math.cos(a)*s*0.20, ly + Math.sin(a)*s*0.07);
      g.lineTo(lx + Math.cos(a)*s*0.58, ly + Math.sin(a)*s*0.20); g.stroke();
    }
    g.restore();
    /* THE SAPLING. Deliberately a third the mass of the orchard stamps around
       it: a young tree, staked, with the old man's whole attention on it. */
    pen.paint(() => { g.rect(lx - s*0.020, ly - s*0.36, s*0.040, s*0.36); },
              toneSolid(inkLevel(5)), 2.2);
    pen.ink(() => { g.moveTo(lx + s*0.076, ly + s*0.02); g.lineTo(lx + s*0.050, ly - s*0.46); }, 3);
    pen.ink(() => { g.moveTo(lx - s*0.028, ly - s*0.28); g.lineTo(lx + s*0.062, ly - s*0.30); }, 2.4);
    for (const [ox, oy, r] of [[-0.10,-0.46,0.115],[0.10,-0.50,0.100],[0.00,-0.60,0.090]])
      pen.paint(() => { g.ellipse(lx + s*ox, ly + s*oy, s*r, s*r*0.80, 0, 0, 7); },
                toneSolid(inkLevel(T.leaf)), 2.2);
    // the spoil heap: a low mound with a shadowed face
    pen.paint(() => { g.moveTo(lx + s*0.46, ly + s*0.12);
                      g.quadraticCurveTo(lx + s*0.64, ly - s*0.14, lx + s*0.86, ly + s*0.12);
                      g.closePath(); }, toneSolid(inkLevel(T.field)), 2.4);
    // the hoe: a leaning shaft with a dark blade — a king's diminished status
    pen.ink(() => { g.moveTo(lx - s*0.80, ly + s*0.08); g.lineTo(lx - s*0.44, ly - s*0.62); }, 3.6);
    pen.paint(() => { g.rect(lx - s*0.88, ly + s*0.03, s*0.16, s*0.070); },
              toneSolid(inkLevel(T.dark + 1)), 2);
    // the basket of prunings
    pen.paint(() => { g.ellipse(lx - s*0.56, ly + s*0.19, s*0.13, s*0.062, 0, 0, 7); },
              toneSolid(inkLevel(T.stone)), 2);
  }

  /* ---- MUSTER: the broken picket across the yard mouth + the marked approach - */
  if (has("muster") && muster){
    const pts = [[0.132,0.686],[0.184,0.676],[0.246,0.664],
                 [0.302,0.654],[0.356,0.644],[0.404,0.634]];
    for (let i = 0; i < pts.length; i++){
      if (i === 2) continue;                       // the gap the charge comes through
      const px = pts[i][0]*W, py = pts[i][1]*H, ps = depthAtY(pts[i][1]);
      pen.paint(() => { g.rect(px - W*0.005*ps, py - H*0.062*ps, W*0.010*ps, H*0.062*ps); },
                toneSolid(inkLevel(T.stone + 1)), 2);
      if (i % 2 === 0)
        pen.paint(() => { g.ellipse(px, py - H*0.050*ps, W*0.019*ps, H*0.016*ps, 0, 0, 7); },
                  toneSolid(inkLevel(T.build)), 2.2);
    }
    // the marked approach: the direction of the charge, cut as chevrons
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.6;
    for (let i = 0; i < 3; i++){
      const t = 0.30 + i*0.16, p = P(t), v = roadTanN(t), w = HW(t)*0.72;
      g.beginPath();
      g.moveTo(p.x - v.y*w, p.y + v.x*w);
      g.lineTo(p.x + v.x*w*1.1, p.y + v.y*w*1.1);
      g.lineTo(p.x + v.y*w, p.y - v.x*w);
      g.stroke();
    }
    g.restore();
  }

  /* ---- MEETING GROUNDS: swept discs with a PAIR of contact stations ---- */
  if (has("zones")){
    for (const [key, z] of Object.entries(MEET)){
      const cx = z.x*W, cy = z.y*H, rx = z.r*W, ry = z.r*H*0.30;
      g.save();
      g.strokeStyle = INK; g.lineWidth = zones ? 3.2 : 2;
      g.globalAlpha = zones ? 0.80 : 0.22;
      g.setLineDash([W*0.012, W*0.010]);
      g.beginPath(); g.ellipse(cx, cy, rx*1.14, ry*1.20, 0, 0, 7); g.stroke();
      g.setLineDash([]);
      if (zones){
        const pair = (key === "labor" ? 0.052 : key === "yard" ? 0.046 : 0.020)*W;
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

  /* ---- VERGE: broken field walls flanking the near approach ---- */
  if (has("verge")){
    const runWall = (xNear, u0, u1, th0) => {
      const a = FP(xNear, u0), b = FP(xNear, u1);
      stoneRun(pen, g, a, b, lerp(th0, th0*0.30, u0), toneSolid(inkLevel(T.field)), 9);
    };
    runWall(-0.30, 0.02, 0.24, H*0.020);
    runWall(-0.30, 0.36, 0.54, H*0.020);
  }

  /* ---- FOREGROUND OCCLUSION: what a figure passes behind ---- */
  if (has("fg")){
    fruitTree(pen, g, W*1.045, H*1.100, W*0.220, toneSolid(inkLevel(T.field)), "fig");
    stoneRun(pen, g, { x:-W*0.02, y:H*0.992 }, { x:W*0.086, y:H*1.010 },
             H*0.026, toneSolid(inkLevel(T.field + 1)), 6);
    g.fillStyle = inkLevel(T.field);
    for (let i = 0; i < 3; i++){          // windfalls in the near grass
      const x = W*(0.286 + i*0.076), y = H*(1.012 - 0.006*(i%3));
      g.beginPath(); g.ellipse(x, y, W*0.026, H*0.012, 0, 0, 7); g.fill();
    }
  }
}

export const asset = {
  id:"location.laertess-orchard",
  type:"LOCATION",
  name:"Laertes's Orchard",
  statusWord:"WORKED GROUND",
  scene:"OD-B24-S03",

  params,
  // back -> front draw order the set honors; a scene may pass a subset
  layers:["sky","hills","ground","fields","orchard","vines","farm","yard","bath",
          "approach","lane","labor","muster","zones","verge","fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky","hills","fields","orchard","vines","farm"],
              ground:["ground","yard","bath","approach","lane","labor","muster","zones"],
              front:["verge","fg"] },
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.02,y0:.44,x1:.99,y1:.99 },
    approach:{ x0:.02,y0:.48,x1:.32,y1:.99 },
    "approach-near":{ x0:.02,y0:.78,x1:.24,y1:.99 },
    "approach-far":{ x0:.16,y0:.48,x1:.30,y1:.66 },
    farmyard:{ x0:.05,y0:.44,x1:.38,y1:.50 },
    yard:{ x0:.22,y0:.52,x1:.39,y1:.60 },
    bath:{ x0:.35,y0:.48,x1:.45,y1:.53 },
    "muster-line":{ x0:.14,y0:.57,x1:.42,y1:.65 },
    orchard:{ x0:.40,y0:.42,x1:.99,y1:.99 },
    "orchard-rows":{ x0:.44,y0:.44,x1:.98,y1:.96 },
    "orchard-lane":{ x0:.34,y0:.55,x1:.64,y1:.92 },
    labor:{ x0:.53,y0:.84,x1:.75,y1:.96 },
    "vine-terrace":{ x0:.57,y0:.41,x1:.94,y1:.46 },
    fields:{ x0:.02,y0:.44,x1:.22,y1:.86 },
    threshold_farm_gate:{ x0:.21,y0:.47,x1:.27,y1:.51 },
    threshold_orchard_gate:{ x0:.44,y0:.62,x1:.52,y1:.70 },
  },
  states:{
    initial:"worked",
    nodes:{
      // the farm as Odysseus finds it: worked, quiet, the old man's exile
      worked:{ preview:{ state:"worked" } },
      // the yard dressed after the bath: boards laid, hearth lit
      feast:{ preview:{ state:"feast" } },
      // the picket struck across the yard mouth, the approach marked
      muster:{ preview:{ state:"muster" } },
      dusk:{ preview:{ state:"dusk" } },
      // zones + species markers struck in for previs / blocking
      survey:{ preview:{ state:"survey", zonesLit:true } },
      // the navigable set only
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["worked","feast"],["feast","worked"],["worked","muster"],["feast","muster"],
           ["muster","feast"],["worked","dusk"],["dusk","worked"],["feast","dusk"],
           ["worked","survey"],["survey","worked"],["worked","bare"],["bare","worked"]],
  },
  channels:["state","reveal","camera","light","zones","labour","traffic"],

  preview:()=>({ state:"worked", t:0, status:"WORKED GROUND", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
