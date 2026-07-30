/* divine-fx.zeuss-clear-sky-thunder — Zeus answers out of an EMPTY sky. DIVINE_FX
   asset. Scene function (OD-B20-S02): Odysseus asks for a double sign before dawn;
   there is no storm, no cloud, no bolt to ground — only a single hard REPORT that
   opens in clear air over the house and rolls once across the household.

   Deliberately NOT `divine_fx.zeuss-thunderbolt`: that asset is a storm — black
   cloud SOURCE, forked bolt, fire, fracture. This one has no cloud and nothing is
   struck. Thunder here is SOUND and TIMING: a petition goes up, a seam opens, one
   directional wavefront comes down, one listener answers it.

   The diagram reads as a circuit, not a weather picture:
     SOURCE       — a small hard black sky-vent at the zenith (no cloud mass) and
                    the jagged SEAM that tears open through it, ending in mid-air.
     PETITION     — a dashed line rising from the courtyard to the vent: the ask
                    the event is a response to. It threads the gap in the roofline.
     FIELD        — nested DASHED arcs inside a wedge aimed down-left at the mill
                    shed: one directional report, tonally ramped dark->pale as it
                    travels. Two thin rays mark the wedge; the sky outside is empty.
     TARGET       — the household as three separated blocky masses with paper
                    between them: mill shed (left), hall (a light plane), porch.
     CONSEQUENCE  — the shed registers the blow: jolt ticks off the roof, flour
                    motes shaken loose, broken rings on the ground at its door.
     GAUGE        — a response-timing instrument down the left margin, with a
                    seven-segment count (ONE report) so the numeral survives the
                    dot lattice.

   Procedural over state.t + petition/report/roll/answer/dawnU:
     CLEAR    — empty sky, stars still out, gauge at rest.
     PETITION — the ask rises; nothing has happened yet.
     REPORT   — the seam tears open at the vent; the first arc leaves it.
     ROLLING  — the wavefront crosses the sky toward the shed, thinning and paling.
     ANSWERED — the front lands, the shed jolts, the sign is recognized.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;
const clamp01 = x => clamp(x, 0, 1);

const params = {
  srcX:     0.660,   // sky-vent (SOURCE) — no cloud, just an aperture
  srcY:     0.185,
  aimX:     0.210,   // the report is aimed at the mill shed (TARGET)
  aimY:     0.795,
  wedge:    0.400,   // half-angle of the directional cone, radians
  ground:   0.915,   // courtyard floor line
  seamLen:  0.420,   // sky-seam length as frac of W
  seamTilt:-0.075,   // seam tilt, radians (roughly horizontal, slightly raked)
  petX:     0.500,   // petitioner stands in the gap in the roofline
  seed:     11,
  intensity:1.0,
};

/* deterministic 0..1 jitter from an integer (stable seam/dust per frame group) */
function jig(i){ const s = Math.sin((i + params.seed) * 91.7) * 43758.5453; return s - Math.floor(s); }

/* ---------- CLEAR SKY: the whole point is that it is EMPTY. Nothing fills the
   field — a few fading dawn stars, three short broken cirrus dashes, and a low
   pale dawn sliver at the right horizon. Paper carries the sky. ---------- */
function drawSky(pen, g, W, H, t, dawnU){
  const d = clamp01(dawnU);
  // fading stars — small plus-glyphs, placed clear of the vent and the gauge
  const STARS = [[.20,.14],[.31,.245],[.44,.105],[.145,.365],[.525,.195],[.84,.265],[.905,.115],[.755,.345]];
  g.lineCap = "butt";
  for (let i = 0; i < STARS.length; i++){
    const [sx, sy] = STARS[i];
    const tw = 0.65 + 0.35 * Math.abs(Math.sin(t * 1.7 + i * 1.9));
    const lvl = clamp(Math.round(2 + d * 4 * tw), 0, 7);
    if (lvl <= 1) continue;
    const x = W * sx, y = H * sy, r = W * (0.009 + 0.004 * jig(i * 3));
    g.strokeStyle = inkLevel(lvl); g.lineWidth = Math.max(1.8, W * 0.0042);
    g.beginPath(); g.moveTo(x - r, y); g.lineTo(x + r, y);
    g.moveTo(x, y - r); g.lineTo(x, y + r); g.stroke();
  }
  // high cirrus — SHORT broken dashes, never a span across the frame
  const CIR = [[.155,.300,.455],[.375,.520,.335],[.720,.865,.440]];
  g.setLineDash([W * 0.026, W * 0.019]);
  for (let i = 0; i < CIR.length; i++){
    const [x0, x1, y] = CIR[i];
    g.strokeStyle = inkLevel(i === 1 ? 2 : 1); g.lineWidth = 3;
    g.beginPath(); g.moveTo(W * x0, H * y); g.lineTo(W * x1, H * (y - 0.006)); g.stroke();
  }
  g.setLineDash([]);
  // "before dawn": a low pale sliver at the right horizon, with short rays
  const dx = W * 0.905, dy = H * params.ground, dr = W * 0.055;
  const lit = 1 - d;
  pen.fillPath(() => { g.arc(dx, dy, dr, Math.PI, TAU); }, inkLevel(lit > 0.4 ? 2 : 1));
  pen.ink(() => { g.arc(dx, dy, dr, Math.PI, TAU); }, 3);
  g.strokeStyle = inkLevel(3); g.lineWidth = 2.4; g.lineCap = "round";
  for (let k = 0; k < 5; k++){
    const a = Math.PI + (k + 0.5) / 5 * Math.PI;
    g.beginPath();
    g.moveTo(dx + Math.cos(a) * dr * 1.22, dy + Math.sin(a) * dr * 1.22);
    g.lineTo(dx + Math.cos(a) * dr * (1.34 + 0.10 * jig(k * 5)), dy + Math.sin(a) * dr * (1.34 + 0.10 * jig(k * 5)));
    g.stroke();
  }
}

/* ---------- TARGET: the household, three SEPARATED blocky masses with paper
   between them so nothing stripes the frame. The hall is a LIGHT plane; the dark
   is spent only on accents (roof slabs, door, window squares). ---------- */
const BLOCKS = [
  { x0:.130, x1:.290, top:.775, lvl:4, name:"shed"  },
  { x0:.325, x1:.505, top:.700, lvl:2, name:"hall"  },
  { x0:.575, x1:.665, top:.645, lvl:3, name:"porch" },
];
function drawHousehold(pen, g, W, H){
  const gy = H * params.ground;
  for (const b of BLOCKS){
    const x0 = W * b.x0, x1 = W * b.x1, ty = H * b.top;
    pen.paint(() => { g.rect(x0, ty, x1 - x0, gy - ty); }, toneSolid(inkLevel(b.lvl)), 4.5);
    // roof slab — a dark accent, and it stops at each block's own edge
    pen.paint(() => { g.rect(x0 - W * 0.014, ty - H * 0.019, (x1 - x0) + W * 0.028, H * 0.019); },
              toneSolid(inkLevel(6)), 3.5);
    if (b.name === "hall"){
      // door: the one true black on the ground, and two window squares
      pen.paint(() => { g.rect(W * .383, H * .812, W * .054, gy - H * .812); }, toneSolid(inkLevel(7)), 3.5);
      for (let k = 0; k < 2; k++)
        pen.paint(() => { g.rect(W * (.352 + k * .098), H * .742, W * .036, H * .036); }, toneSolid(inkLevel(6)), 3);
      // post seams break the wide face vertically
      g.strokeStyle = inkLevel(5); g.lineWidth = 2.4;
      for (const px of [.352, .478]){ g.beginPath(); g.moveTo(W * px, ty); g.lineTo(W * px, gy); g.stroke(); }
    }
    if (b.name === "shed"){
      // the mill shed's low door — the listener's mouth
      pen.paint(() => { g.rect(W * .186, H * .845, W * .048, gy - H * .845); }, toneSolid(inkLevel(7)), 3.2);
      // a stub chimney, offset so the block is not symmetrical
      pen.paint(() => { g.rect(W * .246, H * .722, W * .028, H * .053); }, toneSolid(inkLevel(6)), 3.2);
    }
    if (b.name === "porch"){
      // stepped top + two open bays, so the porch reads as columns not a slab
      pen.paint(() => { g.rect(W * .597, H * .604, W * .046, H * .041); }, toneSolid(inkLevel(5)), 3.2);
      g.fillStyle = inkLevel(0);
      for (let k = 0; k < 2; k++) g.fillRect(W * (.592 + k * .042), H * .748, W * .024, H * .118);
      g.strokeStyle = INK; g.lineWidth = 2.6;
      for (let k = 0; k < 2; k++) g.strokeRect(W * (.592 + k * .042), H * .748, W * .024, H * .118);
    }
  }
  // right-hand courtyard wall, broken into two short runs (never one long bar)
  for (const [x0, x1] of [[.700,.775],[.795,.845]])
    pen.paint(() => { g.rect(W * x0, H * .868, W * (x1 - x0), gy - H * .868); }, toneSolid(inkLevel(3)), 3.5);
  // floor line: dashed, so it is a datum and not a stripe
  g.setLineDash([W * 0.033, W * 0.021]);
  pen.ink(() => { g.moveTo(W * .055, gy); g.lineTo(W * .965, gy); }, 3.5);
  g.setLineDash([]);
  return { shedDoor:{ x:W * .210, y:gy }, hallRoof:{ x:W * .415, y:H * .700 }, shedRoof:{ x:W * .210, y:H * .775 } };
}

/* ---------- PETITION: the ask this event answers. A dashed line from the
   courtyard up to the vent, threading the gap between hall and porch, with three
   chevrons climbing it on t. Fades once the report has come. ---------- */
function drawPetition(pen, g, W, H, t, petition){
  const p = clamp01(petition); if (p <= 0.03) return;
  const x0 = W * params.petX, y0 = H * (params.ground - 0.020);
  const x1 = W * params.srcX, y1 = H * (params.srcY + 0.045);
  g.globalAlpha = clamp01(0.45 + p * 0.55);
  g.setLineDash([H * 0.020, H * 0.013]);
  g.strokeStyle = inkLevel(clamp(4 + Math.round(p * 2), 4, 6)); g.lineWidth = 4.2;
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.setLineDash([]);
  // chevrons climbing the line
  g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "round"; g.lineJoin = "round";
  for (let k = 0; k < 4; k++){
    const f = ((t * 0.20 + k / 4) % 1) * 0.82 + 0.07;
    const cx = lerp(x0, x1, f), cy = lerp(y0, y1, f), s = W * 0.024;
    g.beginPath(); g.moveTo(cx - s, cy + s * 1.15); g.lineTo(cx, cy); g.lineTo(cx + s, cy + s * 1.15); g.stroke();
  }
  // foot mark: where the petitioner stands
  pen.fillPath(() => { g.rect(x0 - W * .020, y0 + H * .014, W * .040, H * .006); }, INK);
  g.globalAlpha = 1;
}

/* ---------- FIELD: the single DIRECTIONAL report. Nested dashed arcs centred on
   the vent, confined to a wedge aimed at the shed, tonally ramped dark near the
   source to pale at the front. Two thin rays declare the wedge edges. This — not
   a bolt — is the whole visible event. ---------- */
function drawWave(pen, g, W, H, t, roll, dirAng){
  const r0 = clamp01(roll); if (r0 <= 0.005) return;
  const D = Math.hypot(W, H), half = params.wedge;
  const N = 7;
  g.lineCap = "butt";
  for (let k = 0; k < N; k++){
    const prog = r0 * 1.28 - k * 0.132;
    if (prog <= 0.02) continue;
    const pr = clamp01(prog);
    const r = D * 0.105 + pr * D * 0.700;
    g.strokeStyle = inkLevel(clamp(Math.round(7 - pr * 5.4), 1, 7));
    g.lineWidth = lerp(9, 2.2, pr);
    const dash = Math.max(7, r * 0.052);
    g.setLineDash([dash, dash * 0.78]);
    g.lineDashOffset = -(t * 16 + k * 13);
    const spread = half * (0.70 + 0.38 * pr);
    g.beginPath();
    g.arc(W * params.srcX, H * params.srcY, r, dirAng - spread, dirAng + spread);
    g.stroke();
  }
  g.setLineDash([]); g.lineDashOffset = 0;
  // wedge edge rays — thin, dashed, declaring the direction of the one report
  const front = D * (0.105 + clamp01(r0 * 1.28) * 0.700);
  g.setLineDash([H * 0.020, H * 0.024]);
  g.strokeStyle = inkLevel(3); g.lineWidth = 2;
  for (const s of [-1, 1]){
    const a = dirAng + s * half * 1.06;
    g.beginPath();
    g.moveTo(W * params.srcX + Math.cos(a) * D * 0.09, H * params.srcY + Math.sin(a) * D * 0.09);
    g.lineTo(W * params.srcX + Math.cos(a) * front, H * params.srcY + Math.sin(a) * front);
    g.stroke();
  }
  g.setLineDash([]);
}

/* ---------- SOURCE: the SEAM. A jagged rip that opens in empty air through the
   vent and tapers to nothing at both ends — it touches no ground, kindles no
   fire. Built as a hard ZIGZAG (never a smooth lens: a smooth one reads as a
   winged object rather than a crack) whose stroke weight swells at the vent and
   dies at both tips, with a white core so it reads as a tear in the paper. The
   vent sits at f=0.38 along it, so the tear is asymmetric, not a pair of wings. */
function seamPts(W, H, len){
  const sx = W * params.srcX, sy = H * params.srcY, ang = params.seamTilt;
  const N = 13, out = [];
  for (let i = 0; i <= N; i++){
    const f = i / N, d = lerp(-len * 0.38, len * 0.62, f);
    // hard alternating zigzag, biggest in the middle, plus a little jitter
    const z = (i % 2 ? 1 : -1) * H * 0.023 * (0.45 + 0.55 * Math.sin(Math.PI * f))
            + (jig(i * 7) - 0.5) * H * 0.015;
    out.push({ x: sx + Math.cos(ang) * d - Math.sin(ang) * z,
               y: sy + Math.sin(ang) * d + Math.cos(ang) * z });
  }
  return out;
}
function seamStroke(g, pts, wMax, color){
  const N = pts.length - 1;
  g.strokeStyle = color; g.lineCap = "round"; g.lineJoin = "round";
  for (let i = 0; i < N; i++){
    const f = (i + 0.5) / N;
    g.lineWidth = Math.max(0.8, wMax * Math.pow(Math.sin(Math.PI * clamp01(f)), 0.55));
    g.beginPath(); g.moveTo(pts[i].x, pts[i].y); g.lineTo(pts[i + 1].x, pts[i + 1].y); g.stroke();
  }
}
function drawSeam(pen, g, W, H, t, report){
  const s = clamp01(report); if (s <= 0.02) return;
  const flick = 0.82 + 0.18 * Math.abs(Math.sin(t * 17));
  const len = W * params.seamLen * lerp(0.42, 1.0, s);
  const pts = seamPts(W, H, len);
  seamStroke(g, pts, H * 0.0235 * s * flick, INK);          // hard black tear
  seamStroke(g, pts, H * 0.0075 * s * flick, inkLevel(0));  // white core
  // stress ticks springing off the zigzag apexes — short, hard, alternating
  g.strokeStyle = INK; g.lineWidth = lerp(1.6, 3.0, s); g.lineCap = "round";
  const nx = -Math.sin(params.seamTilt), ny = Math.cos(params.seamTilt);
  for (let i = 2; i < pts.length - 2; i += 3){
    const p = pts[i], sg = i % 2 ? 1 : -1;
    const L = H * (0.013 + 0.017 * jig(i * 9)) * s;
    g.beginPath(); g.moveTo(p.x + nx * L * 0.4 * sg, p.y + ny * L * 0.4 * sg);
    g.lineTo(p.x + nx * L * 2.0 * sg + (jig(i) - .5) * W * .016, p.y + ny * L * 2.0 * sg);
    g.stroke();
  }
}
/* the vent itself: a small hard aperture at the zenith. NOT a cloud and not a
   face — a solid black octagon with a single white notch bitten out of its
   lower-left edge (the mouth the report leaves by) and eight short spurs. */
function drawVent(pen, g, W, H, t, report){
  const x = W * params.srcX, y = H * params.srcY;
  const r = W * 0.049 * (1 + 0.16 * clamp01(report));
  pen.paint(() => {
    for (let k = 0; k < 8; k++){ const a = k / 8 * TAU + Math.PI / 8;
      const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
      k === 0 ? g.moveTo(px, py) : g.lineTo(px, py); }
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // the notch: a wedge cut toward the aim direction, so the vent has a mouth
  const aim = Math.atan2((params.aimY - params.srcY) * H, (params.aimX - params.srcX) * W);
  pen.fillPath(() => {
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(aim - 0.30) * r * 1.05, y + Math.sin(aim - 0.30) * r * 1.05);
    g.lineTo(x + Math.cos(aim + 0.30) * r * 1.05, y + Math.sin(aim + 0.30) * r * 1.05);
    g.closePath();
  }, inkLevel(0));
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "round";
  const spur = r * (0.50 + 0.60 * clamp01(report) * (0.7 + 0.3 * Math.abs(Math.sin(t * 13))));
  for (let k = 0; k < 8; k++){ const a = k / 8 * TAU;
    g.beginPath(); g.moveTo(x + Math.cos(a) * r * 1.14, y + Math.sin(a) * r * 1.14);
    g.lineTo(x + Math.cos(a) * (r * 1.14 + spur), y + Math.sin(a) * (r * 1.14 + spur)); g.stroke(); }
}

/* ---------- CONSEQUENCE: the household answers. Jolt ticks leap off the shed and
   hall roofs, flour motes shake loose, and two broken rings open on the ground at
   the shed door — the mill woman has heard it and spoken. ---------- */
function drawAnswer(pen, g, W, H, t, answer, marks){
  const a = clamp01(answer); if (a <= 0.03) return;
  // jolt ticks off the roofs
  g.strokeStyle = INK; g.lineCap = "round";
  for (const [m, n] of [[marks.shedRoof, 6], [marks.hallRoof, 4]]){
    g.lineWidth = lerp(2, 4, a);
    for (let k = 0; k < n; k++){
      const f = n > 1 ? k / (n - 1) : .5;
      const x = m.x + lerp(-W * .058, W * .058, f) + (jig(k * 11) - .5) * W * .012;
      const h = H * (0.016 + 0.030 * jig(k * 4)) * a;
      const lift = Math.abs(Math.sin(t * 6 + k * 1.4)) * H * 0.008 * a;
      g.beginPath(); g.moveTo(x, m.y - H * .026 - lift); g.lineTo(x, m.y - H * .026 - lift - h); g.stroke();
    }
  }
  // flour motes shaken loose above the shed
  g.fillStyle = inkLevel(5);
  for (let k = 0; k < 9; k++){
    const x = marks.shedRoof.x + (jig(k * 13) - .5) * W * .140;
    const y = marks.shedRoof.y - H * .045 - ((t * 26 + k * 21) % (H * .105)) * a;
    g.beginPath(); g.arc(x, y, W * .0035 + W * .0026 * jig(k * 6), 0, TAU); g.fill();
  }
  // broken rings on the ground at the shed door — the answer received
  g.lineCap = "butt";
  for (let k = 0; k < 3; k++){
    const prog = clamp01(a * 1.25 - k * 0.26); if (prog <= 0) continue;
    const rx = lerp(W * .026, W * .150, prog), ry = rx * 0.30;
    g.strokeStyle = inkLevel(clamp(6 - Math.round(prog * 4), 1, 6));
    g.lineWidth = lerp(5.5, 1.8, prog);
    g.setLineDash([rx * 0.34, rx * 0.24]);
    g.beginPath(); g.ellipse(marks.shedDoor.x, marks.shedDoor.y + H * .012, rx, ry, 0, Math.PI * 0.06, Math.PI * 0.94);
    g.stroke();
  }
  g.setLineDash([]);
}

/* ---------- GAUGE: response timing, down the left margin. A seven-segment ONE
   (the single report — drawn as geometry so it survives the dot lattice), a
   ruled axis with cross ticks, and a black slider that walks the axis as the
   event advances. Instrument, not decoration: it is what makes "timed as a
   response" visible in a still frame. ---------- */
/* The numeral ONE drawn as GEOMETRY, big (h ~ 0.10·H, i.e. ~88px at render
   size): stem + upper flag + foot bar. Segment-style bars alone give a "1" that
   is two detached dashes and dissolves in the dot lattice — this does not. */
function glyphOne(g, cx, y, h){
  const tk = h * 0.185;
  g.fillStyle = INK;
  g.fillRect(cx - tk / 2, y, tk, h - tk * 0.9);                 // stem
  g.beginPath();                                                // upper-left flag
  g.moveTo(cx - tk / 2, y);
  g.lineTo(cx - tk / 2 - h * 0.26, y + h * 0.24);
  g.lineTo(cx - tk / 2 - h * 0.26, y + h * 0.24 + tk * 0.85);
  g.lineTo(cx - tk / 2, y + tk * 0.95);
  g.closePath(); g.fill();
  g.fillRect(cx - h * 0.30, y + h - tk * 0.9, h * 0.60, tk * 0.9); // foot
}
function drawGauge(pen, g, W, H, phase){
  const ax = W * 0.068, y0 = H * 0.340, y1 = H * 0.690;
  // ONE report — the count, as geometry
  glyphOne(g, ax + W * .012, H * .196, H * .100);
  // axis
  pen.ink(() => { g.moveTo(ax, y0); g.lineTo(ax, y1); }, 3.4);
  for (let k = 0; k <= 4; k++){
    const y = lerp(y0, y1, k / 4), L = (k === 2 ? W * .038 : W * .022);
    pen.ink(() => { g.moveTo(ax, y); g.lineTo(ax + L, y); }, k === 2 ? 3.6 : 2.6);
  }
  // slider: the moment the event has reached
  const sy = lerp(y0, y1, clamp01(phase)), s = W * 0.032;
  pen.paint(() => { g.rect(ax - s / 2, sy - s / 2, s, s); }, toneSolid(inkLevel(7)), 3);
  // terminals: hollow at the start, filled at the end
  pen.paint(() => { g.rect(ax - W * .015, y0 - H * .030, W * .030, W * .030); }, toneSolid(inkLevel(0)), 3);
  pen.paint(() => { g.rect(ax - W * .015, y1 + H * .008, W * .030, W * .030); }, toneSolid(inkLevel(6)), 3);
}

function drawFX(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const t = st.t ?? 0;
  const inten   = st.intensity ?? params.intensity;
  const petition= st.petition ?? clamp(1.15 - inten * 1.25, 0, 1);
  const report  = st.report   ?? clamp((inten - 0.18) * 2.4, 0, 1);
  const roll    = st.roll     ?? clamp((inten - 0.34) * 1.6, 0, 1);
  const answer  = st.answer   ?? clamp((inten - 0.62) * 2.4, 0, 1);
  const dawnU   = st.dawnU    ?? clamp(1 - inten * 0.55, 0, 1);
  const phase   = st.phase    ?? clamp01(0.06 + petition * 0.14 + report * 0.16 + roll * 0.64);
  const dirAng  = st.direction ?? Math.atan2((params.aimY - params.srcY) * H, (params.aimX - params.srcX) * W);

  const layers = st.layers || ["sky","household","petition","gauge","wave","seam","vent","answer"];
  const has = l => layers.includes(l);

  let marks = { shedDoor:{ x:W * .210, y:H * params.ground },
                hallRoof:{ x:W * .415, y:H * .700 },
                shedRoof:{ x:W * .210, y:H * .775 } };

  if (has("sky"))       drawSky(pen, g, W, H, t, dawnU);
  if (has("household")) marks = drawHousehold(pen, g, W, H);
  if (has("petition"))  drawPetition(pen, g, W, H, t, petition);
  if (has("gauge"))     drawGauge(pen, g, W, H, phase);
  if (has("wave"))      drawWave(pen, g, W, H, t, roll, dirAng);
  if (has("answer"))    drawAnswer(pen, g, W, H, t, answer, marks);
  if (has("seam"))      drawSeam(pen, g, W, H, t, report);
  if (has("vent"))      drawVent(pen, g, W, H, t, report);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine-fx.zeuss-clear-sky-thunder",
  type:"DIVINE_FX",
  name:"Zeus's clear-sky thunder",
  statusWord:"ANSWERED",
  scene:"OD-B20-S02",

  params,
  // back -> front; a scene may pass any subset (e.g. drop "household" when the
  // location asset is already painting the room, and keep only sky/wave/seam/vent)
  layers:["sky","household","petition","gauge","wave","seam","vent","answer"],

  // normalized 0..1 source / target / field / consequence anchors
  anchors:{
    "source:vent":        { x:0.660, y:0.185 },  // the aperture in the clear sky
    "source:seam-left":   { x:0.501, y:0.197 },  // the seam tapers out here
    "source:seam-right":  { x:0.920, y:0.161 },
    "field:wavefront":    { x:0.430, y:0.470 },  // mid-cone, where the report is
    "target:household":   { x:0.415, y:0.700 },  // the hall roof, the second sign
    "target:listener":    { x:0.210, y:0.915 },  // shed door — the mill woman
    "target:petitioner":  { x:0.500, y:0.895 },  // Odysseus in the courtyard
    "consequence:answer": { x:0.210, y:0.775 },  // where the shed registers it
    "gauge:timing":       { x:0.068, y:0.515 },
    "camera:wide":        { x:0.500, y:0.500 },
    "camera:sky":         { x:0.640, y:0.265 },
  },

  // affected regions
  zones:{
    sky:      { x0:0.02, y0:0.05, x1:1.00, y1:0.60 },   // the empty field, no cloud
    cone:     { x0:0.02, y0:0.16, x1:0.88, y1:0.86 },   // the directional report
    household:{ x0:0.10, y0:0.60, x1:0.70, y1:0.94 },   // what receives it
    courtyard:{ x0:0.06, y0:0.86, x1:0.97, y1:1.00 },
  },

  // DIVINE_FX states: the response chain, clear sky -> ask -> report -> roll -> answered
  states:{
    initial:"report",
    nodes:{
      clear:{    preview:{ t:0.4, intensity:0.05, petition:0.0, report:0.0, roll:0.0,
                   answer:0.0, dawnU:1.0, phase:0.05, status:"CLEAR", progress:0.06,
                   layers:["sky","household","gauge","vent"] } },
      petition:{ preview:{ t:1.2, intensity:0.16, petition:1.0, report:0.0, roll:0.0,
                   answer:0.0, dawnU:0.92, phase:0.22, status:"ASKED", progress:0.22,
                   layers:["sky","household","petition","gauge","vent"] } },
      report:{   preview:{ t:2.0, intensity:0.46, petition:0.55, report:1.0, roll:0.20,
                   answer:0.0, dawnU:0.70, phase:0.44, status:"THUNDER", progress:0.50 } },
      rolling:{  preview:{ t:3.1, intensity:0.74, petition:0.14, report:0.42, roll:0.66,
                   answer:0.26, dawnU:0.46, phase:0.74, status:"ROLLING", progress:0.76 } },
      answered:{ preview:{ t:4.2, intensity:1.00, petition:0.0, report:0.14, roll:1.0,
                   answer:1.0, dawnU:0.22, phase:0.98, status:"ANSWERED", progress:0.97 } },
    },
    edges:[["clear","petition"],["petition","report"],["report","rolling"],["rolling","answered"]],
  },
  duration:5.0,

  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","petition","report","roll","answer","dawnU","phase","direction"],

  // neutral preview: the report itself — the seam torn open in an empty sky, the
  // first arc leaving the vent, the ask still faintly rising underneath it.
  preview:()=>({ t:2.0, intensity:0.46, petition:0.55, report:1.0, roll:0.30,
                 answer:0.10, dawnU:0.70, phase:0.46, status:"THUNDER", progress:0.50,
                 layers:["sky","household","petition","gauge","wave","seam","vent","answer"] }),

  draw(ctx, W, H, state){ return drawFX(ctx, W, H, state || {}); },
};
export default asset;
