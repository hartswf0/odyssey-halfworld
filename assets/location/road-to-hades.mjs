/* location.road-to-hades — the way the new dead are driven, from the streams of
   Ocean to the meadow of asphodel. LOCATION asset (OD-B24-S01). An EMPTY
   navigable set — NO baked figures. Solid grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone.

   THE SHAPE OF THE PASSAGE. Book XXIV names the road as a LIST OF THRESHOLDS
   passed in order: the streams of Ocean, the White Rock, the Gates of the Sun,
   the country of dreams, and at the end the meadow of asphodel. So the set is
   one continuous way that RECEDES through all five in a single frame — the
   crossing at the near bottom edge, the meadow pale at the far end — and each
   threshold is a real, addressable place on that way rather than a separate
   picture.

   THE WAY RECEDES AND NEVER DOUBLES BACK. y is monotonic along the whole chain,
   and DEPTH IS A FUNCTION OF GROUND HEIGHT: depthAtY() is the single ladder, so
   the far meadow and the near shingle agree about the size of the world. Every
   stamp is tested against the way samples first, so nothing grows in the road.

   TONE. The underworld here is not a black mass — it is a bleached, sunless
   plain, and the frame stays mostly paper. The WHITE ROCK is level 0: pure paper
   inside a hard black contour, the brightest solid in the set and the only thing
   that is genuinely white. Ink is spent where it means something: the mouth of
   the Sun Gates, the water of Ocean, the near boulders, the tally cuts.

   NOTHING SPANS THE FRAME. Ocean is broken by a shingle bar and by the
   foreground boulders; the far ridge is two separate humps that stop short of
   both edges; the meadow kerb is three staggered runs at three heights; the
   verge is scattered patches, never a band. Wide flat shapes are FILLED and not
   outlined — an outlined flat ellipse lays a long horizontal rule and two of
   them stripe the plain.

   COUNTS ARE GEOMETRY, NOT TYPE. Each threshold carries a light stele whose
   ordinal is cut as stacked dark tally bars (I..V). Small type dissolves in the
   dot lattice; bars do not.

   MEETING GROUND. The muster in the asphodel is a swept disc with a surveyed
   ring and a PAIR of contact stations (`meet:muster_l` / `meet:muster_r`), so two
   bodies that meet there never resolve to one coordinate.

   States: "passage" (the full road, default), "muster" (the landing ring lit,
   the flock held on the shore), "arrival" (the meadow ring and its contact pair
   lit), "survey" (all zones struck in for previs), "bare" (the walking set only).

   Atlas: OD-B24-S01 — Ocean crossings, White Rock, sun gates, dream country, and
   asphodel meadow as sequential thresholds. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const MODES = ["passage", "muster", "arrival", "survey", "bare"];

const params = {
  horizon:0.300,      // sky / plain split as a fraction of H
  oceanFar:0.880,     // the far bank of the stream of Ocean
  barX:0.700,         // the shingle bar that breaks the channel
  rockX:0.148,        // the White Rock stands off the way, west side
  rockBase:0.820,     // its foot on the plain
  gateT:0.560,        // where the Gates of the Sun straddle the way
  dreamT:0.750,       // the centre of the country of dreams
  meadowY:0.418,      // the head of the walkable plain / foot of the asphodel
  stalks:27,          // asphodel stems stamped across the far meadow
  zonesLit:false,     // holding rings + muster stations struck in as survey
};

/* ---------- THE WAY ----------
   One Catmull-Rom chain, drawn once and read everywhere. t = 0 at the near
   bottom edge (the landing on Ocean's shore), t = 1 at the head of the meadow.
   y is monotonic: the way only ever goes away from camera. */
const CR = [
  [0.545, 1.070],   // phantom (= off-frame, so the way bleeds past the near edge)
  [0.545, 1.070],   // t = 0     the landing
  [0.372, 0.912],   // t = 1/6   the crossing
  [0.268, 0.766],   // t = 2/6   abreast of the White Rock
  [0.398, 0.646],   // t = 3/6
  [0.596, 0.552],   // t = 4/6   through the Gates of the Sun
  [0.548, 0.462],   // t = 5/6   the country of dreams
  [0.486, 0.394],   // t = 1     the head of the meadow
  [0.486, 0.394],   // phantom
];
function wayPtN(t){
  const segs = CR.length - 3;
  const u = clamp(t, 0, 1) * segs;
  const i = Math.min(Math.floor(u), segs - 1), s = u - i;
  const c = (a,b,cc,d) => 0.5*((2*b) + (-a+cc)*s + (2*a-5*b+4*cc-d)*s*s + (-a+3*b-3*cc+d)*s*s*s);
  const p0=CR[i], p1=CR[i+1], p2=CR[i+2], p3=CR[i+3];
  return { x:c(p0[0],p1[0],p2[0],p3[0]), y:c(p0[1],p1[1],p2[1],p3[1]) };
}
function wayTanN(t){
  const h = 0.004;
  const a = wayPtN(clamp(t-h,0,1)), b = wayPtN(clamp(t+h,0,1));
  const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx,dy) || 1;
  return { x:dx/n, y:dy/n };
}
/* THE ONE DEPTH LADDER: ground height -> scale. */
const NEAR_Y = 1.060;
const groundU = y => clamp((y - params.horizon) / (NEAR_Y - params.horizon), 0, 1);
const depthAtY = y => lerp(0.075, 1.000, Math.pow(groundU(y), 1.22));
const depthAt  = t => depthAtY(wayPtN(t).y);
const wayHW    = t => lerp(0.006, 0.058, Math.pow(groundU(wayPtN(t).y), 1.15));

/* way samples — anchors AND the keep-off test for every stamp */
const WS = (() => {
  const a = [];
  for (let i = 0; i <= 72; i++){ const t = i/72, p = wayPtN(t); a.push({ x:p.x, y:p.y, hw:wayHW(t) }); }
  return a;
})();
function onWay(x, y, W, H, pad = 1.5){
  for (const s of WS){
    const dx = (x - s.x)*W, dy = (y - s.y)*H;
    if (Math.hypot(dx, dy) < s.hw*W*pad) return true;
  }
  return false;
}

/* ---------- the five thresholds, in the order they are passed ----------
   Each stele is placed EXPLICITLY beside its threshold rather than pushed off
   the way's normal: the normal is computed in normalized space and applied in
   pixels, so on a portrait frame it swings a stele a long way off the mark —
   far enough, at the White Rock, to stand it inside the rock. */
const THRESHOLDS = [
  { key:"ocean",      t:0.090, n:1, sx:0.212, sy:0.948, name:"the streams of Ocean" },
  { key:"white-rock", t:0.330, n:2, sx:0.402, sy:0.804, name:"the White Rock" },
  { key:"sun-gates",  t:0.560, n:3, sx:0.296, sy:0.634, name:"the Gates of the Sun" },
  { key:"dreams",     t:0.750, n:4, sx:0.436, sy:0.528, name:"the country of dreams" },
  { key:"asphodel",   t:0.950, n:5, sx:0.672, sy:0.466, name:"the meadow of asphodel" },
];

/* ---------- holding rings + the muster ground ---------- */
const RINGS = {
  landing:{ x:0.648, y:0.814, r:0.070 },   // the flock held on the far shore
  waiting:{ x:0.462, y:0.700, r:0.050 },   // the halt below the Gates
  muster: { x:0.298, y:0.406, r:0.056 },   // the meeting in the asphodel
};

/* ---------- anchors: taken from the way and the ladder, never hand-tuned ---- */
const wy = t => { const p = wayPtN(t);
  return { x:+clamp(p.x,0,1).toFixed(3), y:+clamp(p.y,0,1).toFixed(3) }; };
const off = (t, k) => { const p = wayPtN(t), v = wayTanN(t), hw = wayHW(t)*k;
  return { x:+clamp(p.x + v.y*hw, 0, 1).toFixed(3), y:+clamp(p.y - v.x*hw, 0, 1).toFixed(3) }; };
export const anchors = {
  "way:landing":          wy(0.00),        // clamped to y = 1 — a figure at full height
  "way:crossing":         wy(0.090),
  "way:shore":            wy(0.190),
  "way:rock":             wy(0.330),
  "way:lower-plain":      wy(0.430),
  "way:gate-approach":    wy(0.500),
  "way:gate":             wy(0.560),
  "way:beyond-gate":      wy(0.650),
  "way:dreams":           wy(0.750),
  "way:dream-exit":       wy(0.860),
  "way:meadow-head":      wy(0.950),
  "way:far":              wy(1.000),
  "threshold:ocean":      wy(0.090),
  "threshold:white-rock": wy(0.330),
  "threshold:sun-gates":  wy(0.560),
  "threshold:dream-country": wy(0.750),
  "threshold:asphodel":   wy(0.950),
  "stele:1-ocean":        { x:THRESHOLDS[0].sx, y:THRESHOLDS[0].sy },
  "stele:2-white-rock":   { x:THRESHOLDS[1].sx, y:THRESHOLDS[1].sy },
  "stele:3-sun-gates":    { x:THRESHOLDS[2].sx, y:THRESHOLDS[2].sy },
  "stele:4-dreams":       { x:THRESHOLDS[3].sx, y:THRESHOLDS[3].sy },
  "stele:5-asphodel":     { x:THRESHOLDS[4].sx, y:THRESHOLDS[4].sy },
  "rock:white":           { x:params.rockX, y:params.rockBase },
  "rock:foot":            { x:0.236, y:0.834 },
  "gate:west-pier":       { x:+(wayPtN(params.gateT).x - 0.070).toFixed(3),
                            y:+wayPtN(params.gateT).y.toFixed(3) },
  "gate:east-pier":       { x:+(wayPtN(params.gateT).x + 0.070).toFixed(3),
                            y:+wayPtN(params.gateT).y.toFixed(3) },
  "gate:mouth":           wy(params.gateT),
  "gate:sun":             { x:+wayPtN(params.gateT).x.toFixed(3),
                            y:+(wayPtN(params.gateT).y - 0.178).toFixed(3) },
  "dreams:field":         off(params.dreamT, 5.6),
  "dreams:sunken-frame":  { x:0.752, y:0.512 },
  "meadow:centre":        { x:0.360, y:0.402 },
  "meadow:east":          { x:0.720, y:0.408 },
  "ocean:channel":        { x:0.820, y:0.944 },
  "ocean:bar":            { x:params.barX, y:0.928 },
  "shore:west":           { x:0.096, y:0.966 },
  "ring:landing":         { x:RINGS.landing.x, y:RINGS.landing.y },
  "ring:waiting":         { x:RINGS.waiting.x, y:RINGS.waiting.y },
  "ring:muster":          { x:RINGS.muster.x,  y:RINGS.muster.y },
  "meet:muster_l":        { x:RINGS.muster.x - 0.046, y:RINGS.muster.y + 0.005 },
  "meet:muster_r":        { x:RINGS.muster.x + 0.046, y:RINGS.muster.y - 0.003 },
  "meet:waiting_l":       { x:RINGS.waiting.x - 0.038, y:RINGS.waiting.y + 0.006 },
  "meet:waiting_r":       { x:RINGS.waiting.x + 0.038, y:RINGS.waiting.y - 0.004 },
  "entrance:ocean":       { x:0.545, y:0.998 },   // the living world is behind camera
  "exit:meadow":          { x:0.486, y:0.396 },
  "exit:west-shore":      { x:0.026, y:0.952 },
  "exit:erebus":          { x:0.904, y:0.436 },   // off east, deeper into the dead
  "camera:wide":          { x:0.500, y:0.660 },
  "camera:crossing":      { x:0.500, y:0.930 },
  "camera:rock":          { x:0.170, y:0.780 },
  "camera:gate":          { x:0.560, y:0.560 },
  "camera:dreams":        { x:0.660, y:0.490 },
  "camera:meadow":        { x:0.420, y:0.410 },
};

/* ---------- small stamps ---------- */
/* a broken run of dry kerb between two points, with courses */
function kerbRun(pen, g, a, b, th, tone, courses = 6){
  pen.paint(() => {
    g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
    g.lineTo(b.x, b.y + th*0.42); g.lineTo(a.x, a.y + th); g.closePath();
  }, tone, 2.4);
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.6; g.globalAlpha = 0.30;
  for (let i = 1; i < courses; i++){
    const k = i/courses, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
    g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + lerp(th, th*0.42, k)); g.stroke();
  }
  g.restore();
}
/* an asphodel stem: a thin stalk with a knuckle of bloom — the meadow's texture */
function stalk(pen, g, x, base, h, tone){
  g.save(); g.strokeStyle = INK; g.lineWidth = Math.max(1.5, h*0.055); g.lineCap = "round";
  g.globalAlpha = 0.60;
  g.beginPath(); g.moveTo(x, base); g.lineTo(x, base - h); g.stroke(); g.restore();
  pen.paint(() => { g.ellipse(x, base - h - h*0.10, h*0.21, h*0.18, 0, 0, 7); }, tone, 1.5);
}
/* a boulder: a blocky faceted lump with one darker side, seated on the plain */
function boulder(pen, g, x, base, w, h, tone, darkTone){
  pen.paint(() => {
    g.moveTo(x - w*0.50, base);
    g.lineTo(x - w*0.42, base - h*0.62);
    g.lineTo(x - w*0.10, base - h*1.00);
    g.lineTo(x + w*0.34, base - h*0.82);
    g.lineTo(x + w*0.50, base - h*0.30);
    g.closePath();
  }, tone, 3);
  pen.paint(() => {
    g.moveTo(x + w*0.34, base - h*0.82);
    g.lineTo(x + w*0.50, base - h*0.30);
    g.lineTo(x + w*0.50, base);
    g.lineTo(x + w*0.14, base);
    g.closePath();
  }, darkTone, 2);
}
/* a threshold stele: a LIGHT cut post whose ordinal is stacked DARK tally bars.
   Never type — bars survive the lattice, 20px letterforms do not. */
function stele(pen, g, x, base, s, n, W, H, T){
  /* the post is sized FROM the bars, never the other way round: a bar under
     ~6px dissolves in the lattice, so the stele grows to hold legible ones and
     the count itself sets the height. */
  const bh = Math.max(6, H*0.0135*s), gap = Math.max(4, H*0.0080*s);
  const pad = Math.max(7, H*0.016*s);
  const pw = Math.max(13, W*0.030*s), ph = pad*2 + n*bh + (n-1)*gap;
  pen.paint(() => { g.rect(x - pw/2, base - ph, pw, ph); }, toneSolid(inkLevel(T.pale)), 3.2);
  pen.paint(() => { g.rect(x - pw*0.76, base - ph - H*0.012*s - 4, pw*1.52, H*0.012*s + 4); },
            toneSolid(inkLevel(T.stone)), 2.6);
  const top = base - ph + pad;
  for (let i = 0; i < n; i++)
    pen.paint(() => { g.rect(x - pw*0.30, top + i*(bh + gap), pw*0.60, bh); },
              toneSolid(inkLevel(T.dark)), 1.2);
  g.save(); g.fillStyle = inkLevel(T.flat);
  g.beginPath(); g.ellipse(x, base + H*0.004*s, pw*1.10, H*0.007*s, 0, 0, 7); g.fill(); g.restore();
}
/* a standing door frame that leads nowhere — the architecture of dream country.
   Painted posts + lintel, the opening left as paper: it reads as a building and
   as an absence at once. */
function dreamFrame(pen, g, x, base, w, h, tone, dashEcho){
  const pw = Math.max(7, w*0.24);
  pen.paint(() => { g.rect(x - w/2, base - h, pw, h); }, tone, 2.0);
  pen.paint(() => { g.rect(x + w/2 - pw, base - h, pw, h); }, tone, 2.0);
  pen.paint(() => { g.rect(x - w/2 - pw*0.3, base - h - pw*0.9, w + pw*0.6, pw*0.9); }, tone, 2.0);
  if (dashEcho){
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.34;
    g.setLineDash([w*0.20, w*0.16]);
    g.beginPath();
    g.moveTo(x - w*0.62, base); g.lineTo(x - w*0.62, base - h*1.06);
    g.lineTo(x + w*0.10, base - h*1.06);
    g.stroke(); g.setLineDash([]); g.restore();
  }
}

/* ---------- the set ---------- */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = MODES.includes(st.state) ? st.state : "passage";
  const zones = (st.zonesLit ?? params.zonesLit) || mode === "survey";
  const litRing = mode === "muster" ? "landing" : mode === "arrival" ? "muster" : null;
  const layers = st.layers || (mode === "bare"
    ? ["sky","plain","ridge","meadow","way","gates","rock","ocean","marks"]
    : ["sky","plain","ridge","meadow","dreams","way","gates","rock","ocean",
       "marks","rings","verge","fg"]);
  const has = l => layers.includes(l);

  /* tone table — a bleached sunless plain. Level 0 is reserved for the White
     Rock and the swept discs; the plain and the sky sit at 1–2 so the frame
     stays paper; 5–6 is spent only on the gate mouth and the tally cuts. */
  const T = { sky:1, cloud:2, far:2, ridge:3, plain:2, meadow:1, flat:3, pale:1,
              stone:3, build:4, dark:6, way:1, water:3, deep:4, rock:0, bloom:1 };

  const hz = params.horizon * H;
  const P  = t => { const p = wayPtN(t); return { x:p.x*W, y:p.y*H }; };
  const HW = t => wayHW(t) * W;

  /* ---- SKY: sunless, no disc. A pale field with three slack fume banks. ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, hz);
    g.fillStyle = inkLevel(T.cloud);
    for (let i = 0; i < 3; i++){
      g.beginPath();
      g.ellipse(W*(0.24 + i*0.28), hz*(0.32 + 0.26*(i%2)), W*0.118, H*0.014, 0, 0, 7);
      g.fill();
    }
    g.fillStyle = inkLevel(T.cloud + 1);
    g.beginPath(); g.ellipse(W*0.44, hz*0.15, W*0.30, H*0.013, 0, 0, 7); g.fill();
  }

  /* ---- THE PLAIN: the horizon is a tone change, not a rule ---- */
  if (has("plain")){ g.fillStyle = inkLevel(T.plain); g.fillRect(0, hz, W, H - hz); }

  /* ---- THE FAR RIDGE: two separate humps of the wall of Erebus. Neither
     touches a frame edge, so nothing stripes the horizon. ---- */
  if (has("ridge")){
    const hump = (pts, level, lw) => {
      const path = () => {
        g.moveTo(pts[0][0]*W, hz + pts[0][1]*H);
        g.quadraticCurveTo(pts[1][0]*W, hz + pts[1][1]*H, pts[2][0]*W, hz + pts[2][1]*H);
        g.quadraticCurveTo(pts[3][0]*W, hz + pts[3][1]*H, pts[4][0]*W, hz + pts[4][1]*H);
      };
      g.beginPath(); path();
      g.lineTo(pts[4][0]*W, hz + H*0.055); g.lineTo(pts[0][0]*W, hz + H*0.055);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
      g.save(); g.strokeStyle = INK; g.lineWidth = lw; g.lineJoin = "round";
      g.beginPath(); path(); g.stroke(); g.restore();
    };
    hump([[0.045,0.006],[0.16,-0.074],[0.28,-0.024],[0.37,0.004],[0.432,0.008]], T.far, 3.4);
    hump([[0.560,0.008],[0.71,-0.086],[0.85,-0.020],[0.92,0.002],[0.968,0.008]], T.far, 3.4);
    hump([[0.352,0.026],[0.52,-0.012],[0.66,0.014],[0.79,0.028],[0.884,0.024]], T.ridge, 3);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.24;
    for (const u of [0.18, 0.44, 0.70]){
      g.beginPath();
      g.moveTo(W*(0.14 + u*0.62), hz - H*0.046 + H*0.018*u);
      g.lineTo(W*(0.14 + u*0.62) + W*0.019, hz - H*0.004);
      g.stroke();
    }
    g.restore();
  }

  /* ---- THE MEADOW OF ASPHODEL: the last threshold and the pale destination.
     A light plain behind a broken kerb, stamped with stems in perspective. ---- */
  if (has("meadow")){
    const my = params.meadowY * H;
    g.fillStyle = inkLevel(T.meadow);
    g.beginPath();
    g.moveTo(0, hz + H*0.052); g.lineTo(W, hz + H*0.048);
    g.lineTo(W, my + H*0.010); g.lineTo(0, my - H*0.004);
    g.closePath(); g.fill();
    /* the kerb where the plain steps up into the meadow — THREE runs at three
       heights, so no continuous line ever crosses the frame */
    const RUNS = [[0.052,0.158,-0.012],[0.330,0.424,0.005],[0.672,0.774,-0.007]];
    for (const [x0, x1, dy] of RUNS){
      const a = { x:W*x0, y:my + H*dy };
      const b = { x:W*x1, y:my + H*(dy + 0.006) };
      kerbRun(pen, g, a, b, H*0.017, toneSolid(inkLevel(T.plain)), 4);
    }
    // the stems: a jittered perspective scatter, kept out of the way
    const n = params.stalks;
    for (let i = 0; i < n; i++){
      const c = i % 9, r = Math.floor(i / 9);
      const jx = ((i*37) % 17)/17 - 0.5, jy = ((i*53) % 13)/13 - 0.5;
      const x = 0.048 + (c + 0.5 + jx*0.7)/9 * 0.90;
      const yy = params.meadowY - 0.072 + r*0.024 + jy*0.011;
      if (yy < params.horizon + 0.034) continue;
      if (onWay(x, yy, W, H, 1.2)) continue;
      stalk(pen, g, x*W, yy*H, Math.max(8, H*0.066*depthAtY(yy)), toneSolid(inkLevel(T.bloom)));
    }
    // a nearer rank right at the meadow head, staggered so it is not a row
    for (let i = 0; i < 11; i++){
      const x = 0.058 + i*0.086 + ((i*29)%7)/7*0.018;
      const yy = params.meadowY + 0.004 + ((i*17)%5)/5*0.016;
      if (onWay(x, yy, W, H, 1.35)) continue;
      stalk(pen, g, x*W, yy*H, Math.max(10, H*0.076*depthAtY(yy)), toneSolid(inkLevel(T.bloom)));
    }
  }

  /* ---- THE COUNTRY OF DREAMS: standing frames that lead nowhere, half sunk in
     a low bank of fume. They flank the way rather than block it. ---- */
  if (has("dreams")){
    const c = P(params.dreamT);
    // the fume bank: flat light lobes, FILLED and never outlined
    g.fillStyle = inkLevel(T.plain + 1);
    for (const [ox, oy, rx] of [[0.060,0.022,0.105],[0.200,0.006,0.092],[0.132,-0.020,0.074]]){
      g.beginPath(); g.ellipse(c.x + ox*W, c.y + oy*H, rx*W, H*0.014, 0, 0, 7); g.fill();
    }
    const FRAMES = [   // ox, oy, w, h, echo
      [ 0.086, 0.058, 0.072, 0.100, true ],
      [ 0.218, 0.014, 0.052, 0.072, false],
      [ 0.330, 0.048, 0.062, 0.086, true ],
      [ 0.160,-0.026, 0.038, 0.052, false],
    ];
    for (const [ox, oy, fw, fh, echo] of FRAMES){
      const x = c.x + ox*W, base = c.y + oy*H;
      if (x < -W*0.05 || x > W*1.05) continue;
      dreamFrame(pen, g, x, base, fw*W, fh*H, toneSolid(inkLevel(T.pale)), echo);
    }
    // drifting outlines — shapes that never close
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.32;
    g.setLineDash([W*0.013, W*0.015]);
    for (const [ox, oy, rx] of [[0.036,-0.048,0.046],[0.226,-0.056,0.038]]){
      g.beginPath(); g.ellipse(c.x + ox*W, c.y + oy*H, rx*W, H*0.022, 0, 0, 7); g.stroke();
    }
    g.setLineDash([]); g.restore();
  }

  /* ---- THE WAY: the trodden road, the one pale continuous surface ---- */
  if (has("way")){
    const N = 72;
    g.beginPath();
    for (let i = 0; i <= N; i++){
      const t = i/N, p = P(t), v = wayTanN(t), hw = HW(t);
      const x = p.x - v.y*hw, y = p.y + v.x*hw;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    for (let i = N; i >= 0; i--){
      const t = i/N, p = P(t), v = wayTanN(t), hw = HW(t);
      g.lineTo(p.x + v.y*hw, p.y - v.x*hw);
    }
    g.closePath(); g.fillStyle = inkLevel(T.way); g.fill();
    g.save(); g.strokeStyle = INK; g.lineJoin = "round";
    for (const s of [1, -1]){
      g.beginPath();
      for (let i = 0; i <= N; i++){
        const t = i/N, p = P(t), v = wayTanN(t), hw = HW(t);
        const x = p.x + s*v.y*hw, y = p.y - s*v.x*hw;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.lineWidth = 3.5; g.stroke();
    }
    g.restore();
    // the trodden centre — thinning with distance off the one ladder
    g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.24;
    for (const o of [-0.34, 0.34]){
      for (let i = 0; i < N; i += 3){
        const t = i/N, t2 = Math.min(1, (i + 1.8)/N);
        const a = P(t), va = wayTanN(t), ha = HW(t)*o;
        const b = P(t2), vb = wayTanN(t2), hb = HW(t2)*o;
        g.lineWidth = lerp(1.1, 4.0, depthAt(t));
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
      const t = 0.05 + i*0.084, p = P(t), v = wayTanN(t);
      const hw = HW(t)*(i%2 ? 1.26 : -1.30), r = W*0.009*depthAt(t);
      g.beginPath(); g.ellipse(p.x - v.y*hw, p.y + v.x*hw, r, r*0.58, 0, 0, 7); g.fill();
    }
  }

  /* ---- THE GATES OF THE SUN: a trilithon straddling the way with the rayed
     disc set over the lintel. The mouth is the darkest thing in the set — it is
     the only place the road goes. ---- */
  if (has("gates")){
    const p = P(params.gateT);
    const half = W*0.070, pw = W*0.026, ph = H*0.086;
    const piers = [p.x - half, p.x + half];
    for (const qx of piers){
      pen.paint(() => { g.rect(qx - pw/2, p.y - ph, pw, ph); },
                toneSolid(inkLevel(T.stone)), 3.4);
      g.save(); g.strokeStyle = INK; g.lineWidth = 1.9; g.globalAlpha = 0.36;
      for (let i = 1; i < 5; i++){
        const yy = p.y - ph*i/5;
        g.beginPath(); g.moveTo(qx - pw/2, yy); g.lineTo(qx + pw/2, yy); g.stroke();
      }
      g.restore();
      g.save(); g.fillStyle = inkLevel(T.flat);
      g.beginPath(); g.ellipse(qx, p.y + H*0.005, pw*1.15, H*0.008, 0, 0, 7); g.fill(); g.restore();
    }
    // THE MOUTH: the dark opening the way runs into
    pen.paint(() => { g.rect(piers[0] + pw*0.60, p.y - ph*0.80, (half*2) - pw*1.20, ph*0.80); },
              toneSolid(inkLevel(T.dark)), 2.8);
    // the lintel over both piers — a short span, stopped by its own piers
    pen.paint(() => { g.rect(piers[0] - pw*0.85, p.y - ph - H*0.022, half*2 + pw*1.70, H*0.022); },
              toneSolid(inkLevel(T.build)), 3.2);
    pen.paint(() => { g.rect(piers[0] - pw*1.15, p.y - ph - H*0.034, half*2 + pw*2.30, H*0.012); },
              toneSolid(inkLevel(T.stone)), 2.6);
    // THE SUN: a pale disc over the lintel with blocky rays — geometry, not glow
    const sx = p.x, sy = p.y - ph - H*0.092, sr = W*0.034;
    g.save(); g.fillStyle = inkLevel(T.build); g.strokeStyle = INK; g.lineWidth = 2.2;
    for (let i = 0; i < 12; i++){
      const a0 = i*Math.PI/6 + 0.13, wd = 0.115;
      g.beginPath();
      g.moveTo(sx + Math.cos(a0 - wd)*sr*1.08, sy + Math.sin(a0 - wd)*sr*1.08);
      g.lineTo(sx + Math.cos(a0)*sr*1.82,      sy + Math.sin(a0)*sr*1.82);
      g.lineTo(sx + Math.cos(a0 + wd)*sr*1.08, sy + Math.sin(a0 + wd)*sr*1.08);
      g.closePath(); g.fill(); g.stroke();
    }
    g.restore();
    pen.paint(() => { g.arc(sx, sy, sr, 0, 7); }, toneSolid(inkLevel(T.rock)), 4);
    pen.paint(() => { g.arc(sx, sy, sr*0.40, 0, 7); }, toneSolid(inkLevel(T.stone)), 2.4);
  }

  /* ---- THE WHITE ROCK: pure paper inside a hard contour. The brightest solid
     in the set and the landmark the whole west side is read against. ---- */
  if (has("rock")){
    const bx = params.rockX*W, base = params.rockBase*H;
    const rw = W*0.156, rh = H*0.246;
    // the cast shadow thrown east onto the plain — filled, never outlined
    g.save(); g.fillStyle = inkLevel(T.flat);
    g.beginPath(); g.ellipse(bx + rw*0.52, base + H*0.010, rw*0.92, H*0.022, 0, 0, 7);
    g.fill(); g.restore();
    /* the monolith: a blocky faceted stack at level 0 — paper with a black edge.
       The silhouette is cut in steps, not tapered, or it reads as a tent; and
       the foot is stepped too, so the base is never one long black rule. */
    pen.paint(() => {
      g.moveTo(bx - rw*0.62, base);
      g.lineTo(bx - rw*0.58, base - rh*0.30);
      g.lineTo(bx - rw*0.40, base - rh*0.36);
      g.lineTo(bx - rw*0.44, base - rh*0.74);
      g.lineTo(bx - rw*0.22, base - rh*0.80);
      g.lineTo(bx - rw*0.16, base - rh*1.00);
      g.lineTo(bx + rw*0.26, base - rh*0.94);
      g.lineTo(bx + rw*0.34, base - rh*0.60);
      g.lineTo(bx + rw*0.58, base - rh*0.50);
      g.lineTo(bx + rw*0.52, base - rh*0.14);
      g.lineTo(bx + rw*0.30, base - rh*0.06);
      g.closePath();
    }, toneSolid(inkLevel(T.rock)), 5);
    // facet seams — the rock's structure, drawn and not shaded
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.76;
    g.beginPath();
    g.moveTo(bx - rw*0.16, base - rh*1.00); g.lineTo(bx - rw*0.10, base - rh*0.44);
    g.lineTo(bx - rw*0.40, base - rh*0.36);
    g.moveTo(bx + rw*0.26, base - rh*0.94); g.lineTo(bx + rw*0.14, base - rh*0.52);
    g.lineTo(bx + rw*0.34, base - rh*0.60);
    g.stroke(); g.restore();
    // the one shaded side, kept light so the rock stays white
    pen.paint(() => {
      g.moveTo(bx + rw*0.14, base - rh*0.52);
      g.lineTo(bx + rw*0.34, base - rh*0.60);
      g.lineTo(bx + rw*0.58, base - rh*0.50);
      g.lineTo(bx + rw*0.52, base - rh*0.14);
      g.lineTo(bx + rw*0.30, base - rh*0.06);
      g.lineTo(bx + rw*0.18, base - rh*0.20);
      g.closePath();
    }, toneSolid(inkLevel(T.plain)), 2.4);
    // fallen blocks at the foot, on the way's west shoulder
    boulder(pen, g, bx + rw*0.98, base + H*0.014, W*0.070, H*0.056,
            toneSolid(inkLevel(T.pale)), toneSolid(inkLevel(T.flat)));
    boulder(pen, g, bx - rw*0.74, base + H*0.006, W*0.052, H*0.040,
            toneSolid(inkLevel(T.pale)), toneSolid(inkLevel(T.flat)));
  }

  /* ---- THE STREAMS OF OCEAN: the first crossing, at the near edge. A channel
     cut by a shingle bar, with a stepping causeway where the way goes over. ---- */
  if (has("ocean")){
    const far = params.oceanFar * H;
    const bank = x => far + H*0.030*Math.sin(x*6.4 + 0.7) + H*0.014*Math.sin(x*15.3 + 2.1)
                          + H*0.030*x;
    g.beginPath(); g.moveTo(-W*0.02, bank(-0.02));
    for (let i = 0; i <= 40; i++){ const x = -0.02 + i*(1.06/40); g.lineTo(x*W, bank(x)); }
    g.lineTo(W*1.04, H*1.10); g.lineTo(-W*0.02, H*1.10); g.closePath();
    g.fillStyle = inkLevel(T.water); g.fill();
    // the far bank, inked in SEGMENTS so the channel never rules the frame
    g.save(); g.strokeStyle = INK; g.lineWidth = 3.2; g.lineJoin = "round";
    for (const [x0, x1] of [[-0.02,0.19],[0.31,0.55],[0.78,1.04]]){
      g.beginPath();
      for (let i = 0; i <= 22; i++){ const x = lerp(x0, x1, i/22);
        i ? g.lineTo(x*W, bank(x)) : g.moveTo(x*W, bank(x)); }
      g.stroke();
    }
    g.restore();
    // swell — short slack strokes, never a line across the frame
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.4; g.globalAlpha = 0.30; g.lineCap = "round";
    for (const [x0, x1, o] of [[0.04,0.30,0.030],[0.42,0.62,0.048],[0.16,0.38,0.070],
                               [0.74,0.96,0.034],[0.56,0.78,0.074]]){
      g.beginPath();
      for (let i = 0; i <= 16; i++){ const x = lerp(x0, x1, i/16);
        const yy = bank(x) + H*o + Math.sin(x*13 + o*40)*H*0.005;
        i ? g.lineTo(x*W, yy) : g.moveTo(x*W, yy); }
      g.stroke();
    }
    g.restore();
    // THE SHINGLE BAR — breaks the channel in two and gives the eye a stop
    const bxx = params.barX*W, byy = bank(params.barX) + H*0.048;
    g.save(); g.fillStyle = inkLevel(T.plain);
    g.beginPath(); g.ellipse(bxx, byy, W*0.118, H*0.024, 0, 0, 7); g.fill(); g.restore();
    g.fillStyle = inkLevel(T.stone);
    for (let i = 0; i < 8; i++){
      const a = i*0.82;
      g.beginPath();
      g.ellipse(bxx + Math.cos(a)*W*0.074, byy + Math.sin(a)*H*0.011, W*0.009, H*0.0045, 0, 0, 7);
      g.fill();
    }
    // THE CAUSEWAY: pale slabs carrying the way over the water
    for (let i = 0; i < 6; i++){
      const t = 0.004 + i*0.0225, p = P(t), v = wayTanN(t), hw = HW(t)*1.06;
      pen.paint(() => {
        g.moveTo(p.x - v.y*hw, p.y + v.x*hw);
        g.lineTo(p.x + v.y*hw, p.y - v.x*hw);
        g.lineTo(p.x + v.y*hw + v.x*W*0.020, p.y - v.x*hw + v.y*W*0.020);
        g.lineTo(p.x - v.y*hw + v.x*W*0.020, p.y + v.x*hw + v.y*W*0.020);
        g.closePath();
      }, toneSolid(inkLevel(i % 2 ? T.pale : T.rock)), 3);
    }
    // the west shingle: a light spit so the near-left is not all water
    g.save(); g.fillStyle = inkLevel(T.plain);
    g.beginPath(); g.ellipse(W*0.070, H*0.980, W*0.150, H*0.030, 0, 0, 7); g.fill(); g.restore();
  }

  /* ---- THE THRESHOLD MARKS: a stele per threshold, its ordinal cut as tally
     bars, and the way scored across where the passage is made. ---- */
  if (has("marks")){
    for (const th of THRESHOLDS){
      const p = P(th.t), v = wayTanN(th.t), hw = HW(th.t);
      const s = clamp(depthAtY(th.sy), 0.42, 1.0);
      stele(pen, g, th.sx*W, th.sy*H, s, th.n, W, H, T);
      // the score across the way — a passage line, dashed so it stays a mark
      g.save(); g.strokeStyle = INK; g.lineWidth = Math.max(2, 3.4*depthAt(th.t));
      g.globalAlpha = 0.58; g.setLineDash([W*0.012, W*0.010]);
      g.beginPath();
      g.moveTo(p.x - v.y*hw*1.18, p.y + v.x*hw*1.18);
      g.lineTo(p.x + v.y*hw*1.18, p.y - v.x*hw*1.18);
      g.stroke(); g.setLineDash([]); g.restore();
    }
  }

  /* ---- HOLDING RINGS + THE MUSTER: swept discs with a surveyed ring and a
     PAIR of contact stations, so a meeting has two coordinates and not one. ---- */
  if (has("rings")){
    for (const [key, z] of Object.entries(RINGS)){
      const cx = z.x*W, cy = z.y*H, rx = z.r*W, ry = z.r*H*0.30;
      const lit = zones || key === litRing;
      pen.paint(() => { g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(T.rock)), 2.5);
      g.save();
      g.strokeStyle = INK; g.lineWidth = lit ? 3.2 : 2;
      g.globalAlpha = lit ? 0.80 : 0.22;
      g.setLineDash([W*0.012, W*0.010]);
      g.beginPath(); g.ellipse(cx, cy, rx*1.16, ry*1.24, 0, 0, 7); g.stroke();
      g.setLineDash([]);
      if (lit && key !== "landing"){
        const pair = (key === "muster" ? 0.046 : 0.038)*W;
        g.lineWidth = 3.4; g.globalAlpha = 0.92;
        for (const sd of [-1, 1]){
          g.beginPath();
          g.moveTo(cx + sd*pair - W*0.011, cy); g.lineTo(cx + sd*pair + W*0.011, cy);
          g.moveTo(cx + sd*pair, cy - H*0.009); g.lineTo(cx + sd*pair, cy + H*0.009);
          g.stroke();
        }
      }
      g.restore();
    }
  }

  /* ---- VERGE: scattered dry patches flanking the way. FILLED, not outlined —
     an outlined flat ellipse is a horizontal rule, and rules stripe. ---- */
  if (has("verge")){
    g.save(); g.fillStyle = inkLevel(T.flat);
    const PATCH = [
      [0.048,0.712,0.062], [0.812,0.676,0.070], [0.150,0.606,0.052],
      [0.868,0.556,0.056], [0.246,0.512,0.044], [0.070,0.486,0.048],
      [0.912,0.782,0.050],
    ];
    for (const [x, y, r] of PATCH){
      if (onWay(x, y, W, H, 1.15)) continue;
      const s = depthAtY(y);
      g.beginPath(); g.ellipse(x*W, y*H, r*W, r*W*0.30*(0.6 + s*0.6), 0, 0, 7); g.fill();
    }
    g.restore();
    // stones scattered on the plain, sized by the ladder
    g.fillStyle = inkLevel(T.stone);
    for (let i = 0; i < 13; i++){
      const x = 0.055 + ((i*47) % 19)/19*0.90, y = 0.470 + ((i*31) % 11)/11*0.400;
      if (onWay(x, y, W, H, 1.25)) continue;
      const s = depthAtY(y), r = W*0.011*s;
      g.beginPath(); g.ellipse(x*W, y*H, r, r*0.56, 0, 0, 7); g.fill();
    }
  }

  /* ---- FOREGROUND OCCLUSION: what a figure passes behind, and what breaks the
     near end of the channel. ---- */
  if (has("fg")){
    boulder(pen, g, W*0.048, H*1.040, W*0.210, H*0.168,
            toneSolid(inkLevel(T.flat)), toneSolid(inkLevel(T.deep)));
    boulder(pen, g, W*0.968, H*1.056, W*0.230, H*0.146,
            toneSolid(inkLevel(T.flat)), toneSolid(inkLevel(T.deep)));
    // a near clump of asphodel gone to seed, tall against the water
    for (let i = 0; i < 5; i++)
      stalk(pen, g, W*(0.842 + i*0.028), H*(1.014 - 0.007*(i%3)), H*0.092,
            toneSolid(inkLevel(T.pale)));
    g.fillStyle = inkLevel(T.stone);
    for (let i = 0; i < 3; i++){
      const x = W*(0.256 + i*0.086), y = H*(1.034 - 0.007*(i%3));
      g.beginPath(); g.ellipse(x, y, W*0.026, H*0.011, 0, 0, 7); g.fill();
    }
  }
}

export const asset = {
  id:"location.road-to-hades",
  type:"LOCATION",
  name:"Road to Hades",
  statusWord:"THRESHOLDS",
  scene:"OD-B24-S01",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","plain","ridge","meadow","dreams","way","gates","rock","ocean",
          "marks","rings","verge","fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky","plain","ridge","meadow","dreams","gates","rock"],
              ground:["way","ocean","marks","rings"],
              front:["verge","fg"] },
  // the five thresholds, in the order the dead pass them
  thresholds:THRESHOLDS.map(t => ({ key:t.key, order:t.n, at:t.t, name:t.name })),
  // normalized 0..1 placement / camera anchors — seated on the way + the ladder
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.02,y0:.39,x1:.98,y1:.99 },
    way:{ x0:.16,y0:.39,x1:.72,y1:.99 },
    "way-near":{ x0:.30,y0:.86,x1:.72,y1:.99 },
    "way-mid":{ x0:.18,y0:.60,x1:.58,y1:.86 },
    "way-far":{ x0:.44,y0:.39,x1:.70,y1:.60 },
    ocean:{ x0:.00,y0:.86,x1:1.0,y1:.99 },
    causeway:{ x0:.44,y0:.92,x1:.62,y1:.99 },
    "shingle-bar":{ x0:.58,y0:.90,x1:.82,y1:.96 },
    "white-rock":{ x0:.01,y0:.54,x1:.22,y1:.85 },
    "landing-shore":{ x0:.56,y0:.78,x1:.76,y1:.85 },
    "sun-gates":{ x0:.42,y0:.48,x1:.70,y1:.63 },
    "dream-country":{ x0:.58,y0:.44,x1:.96,y1:.56 },
    meadow:{ x0:.02,y0:.32,x1:.98,y1:.43 },
    "muster-ground":{ x0:.22,y0:.38,x1:.38,y1:.43 },
    threshold_ocean:{ x0:.42,y0:.94,x1:.62,y1:.99 },
    threshold_white_rock:{ x0:.20,y0:.72,x1:.36,y1:.80 },
    threshold_sun_gates:{ x0:.46,y0:.56,x1:.64,y1:.64 },
    threshold_dream_country:{ x0:.48,y0:.46,x1:.64,y1:.53 },
    threshold_asphodel:{ x0:.42,y0:.37,x1:.56,y1:.43 },
  },
  states:{
    initial:"passage",
    nodes:{
      // the whole road, all five thresholds standing
      passage:{ preview:{ state:"passage" } },
      // the flock is gathered off the water: the landing ring is struck in
      muster:{ preview:{ state:"muster" } },
      // the meeting in the asphodel: the far ring and its contact pair are lit
      arrival:{ preview:{ state:"arrival" } },
      // every zone struck in — previs / blocking
      survey:{ preview:{ state:"survey", zonesLit:true } },
      // the bare walking set: way, thresholds, ground, nothing marked
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["passage","muster"],["muster","passage"],["passage","arrival"],
           ["arrival","passage"],["muster","arrival"],["passage","survey"],
           ["survey","passage"],["passage","bare"],["bare","passage"]],
  },
  channels:["state","reveal","camera","light","zones","threshold","drift"],

  preview:()=>({ state:"passage", t:0, status:"THRESHOLDS", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
