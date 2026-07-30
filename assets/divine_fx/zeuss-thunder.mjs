/* divine-fx.zeuss-thunder — Zeus answers the bowstring. DIVINE_FX asset.
   Scene function (OD-B21-S07): Odysseus has strung the great bow and tried the
   string; it sings clear, like a swallow. Zeus thunders straight back — a
   CONFIRMING RESPONSE with no measurable delay between the note and the report.

   Deliberately NOT the two siblings:
     · `divine_fx.zeuss-thunderbolt` (B12) is weather and violence — black cloud,
       forked bolt, a struck mast, fire, a fractured hull. Nothing here is struck.
     · `divine-fx.zeuss-clear-sky-thunder` (B20) is a PETITION answered — a spoken
       ask rises from a courtyard and one wedge of arcs rolls down over the
       household blocks.
   This one is ANTIPHON: a *sound* is the call, and the sky answers on the beat.
   Nobody asked out loud. The whole diagram is a two-voice latency instrument.

     SOURCE      — a hard black keystone GATE in the sky with a white slot mouth,
                   and a short jagged seam that tears down out of it into open air.
     CALL        — the bow at lower-left, its string still humming, and a rising
                   LADDER of rungs climbing from the pluck toward the gate, with a
                   blocky swallow riding it (the simile, drawn as geometry).
     FIELD       — the answer: broken chevron WAVEFRONTS sweeping back down the
                   same corridor, dark at the gate and paling as they travel. The
                   call goes up that channel, the report comes down it.
     CONSEQUENCE — the bow registers it: ticks spring off both horn tips and
                   broken rings open at the grip; the man's heart is confirmed.
     LEDGER      — a light instrument panel bottom-right: one narrow spike (the
                   note), the heavy decaying bar-envelope of the thunder right
                   behind it, and the measured gap between them read as a
                   seven-segment ZERO — "immediately after", made visible.

   Procedural over state.t + sing/report/roll/answer:
     STRUNG    — bow strung, string at rest, sky shut, ledger empty.
     SINGING   — the string is tried; the ladder climbs; the note spike lands.
     REPORT    — the gate opens, the seam tears, the first front leaves.
     ROLLING   — the fronts cross the corridor, thinning and paling.
     CONFIRMED — they reach the bow; rings open at the grip; the gap reads ZERO.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;
const clamp01 = x => clamp(x, 0, 1);

const params = {
  gateX:   0.760,   // SOURCE — the sky-gate (no cloud, no bolt)
  gateY:   0.155,
  aimX:    0.225,   // the report is aimed back down the corridor at the bow
  aimY:    0.735,
  pluckX:  0.302,   // where the string was tried — origin of the CALL
  pluckY:  0.728,
  callX:   0.430,   // the call climbs STEEPLY, so it crosses the answer corridor
  callY:   0.215,   // instead of lying along it
  bowTop:  0.575,   // upper horn tip
  bowBot:  0.885,   // lower horn tip
  bowBelly:0.140,   // how far left the limbs bow out
  panelX0: 0.495,   // LEDGER panel
  panelX1: 0.950,
  panelY0: 0.712,
  panelY1: 0.944,
  axisY:   0.898,
  seed:    23,
  intensity:1.0,
};

/* deterministic 0..1 jitter from an integer (stable seam/tick shapes) */
function jig(i){ const s = Math.sin((i + params.seed) * 78.233) * 43758.5453; return s - Math.floor(s); }

const gatePt = (W,H) => ({ x:W*params.gateX, y:H*params.gateY });
const aimPt  = (W,H) => ({ x:W*params.aimX,  y:H*params.aimY  });
const pluckPt= (W,H) => ({ x:W*params.pluckX,y:H*params.pluckY });
const callPt = (W,H) => ({ x:W*params.callX,  y:H*params.callY  });

/* ---------- SKY: kept almost entirely EMPTY. The event is a sound, not weather.
   Three short broken cirrus runs at the palest inks and nothing else, so paper
   carries the whole upper field and the black gate reads as the only hard mass. */
function drawSky(pen, g, W, H){
  g.setLineDash([W * 0.028, W * 0.021]);
  const CIR = [[.085,.255,.215],[.145,.300,.360],[.400,.520,.112],[.845,.945,.320]];
  for (let i = 0; i < CIR.length; i++){
    const [x0, x1, y] = CIR[i];
    g.strokeStyle = inkLevel(i === 1 ? 2 : 1); g.lineWidth = 3;
    g.beginPath(); g.moveTo(W * x0, H * y); g.lineTo(W * x1, H * (y - 0.005)); g.stroke();
  }
  g.setLineDash([]);
}

/* ---------- SOURCE: the GATE. A hard black keystone (trapezoid) with a single
   white slot bitten out of it — the mouth the report leaves by. Not a cloud, not
   a face, not the octagonal vent of the B20 asset: a doorway in the air. Short
   spurs kick off its lower edge as it opens. ---------- */
function drawGate(pen, g, W, H, t, report){
  const r = clamp01(report);
  const { x, y } = gatePt(W, H);
  const th = H * 0.052 * (1 + 0.10 * r);
  const topH = W * 0.068, botH = W * 0.036;
  pen.paint(() => {
    g.moveTo(x - topH, y - th); g.lineTo(x + topH, y - th);
    g.lineTo(x + botH, y + th); g.lineTo(x - botH, y + th); g.closePath();
  }, toneSolid(inkLevel(7)), 4.2);
  // a solid lintel slab capping the keystone (one piece — no white bite, or the
  // gate reads as a crown instead of a door)
  pen.fillPath(() => { g.rect(x - topH * 1.22, y - th - H * 0.017, topH * 2.44, H * 0.017); }, INK);
  // the slot mouth — a single bright slit that opens with the report
  const sw = W * 0.021, sh = th * (0.50 + 0.95 * r);
  pen.fillPath(() => { g.rect(x - sw / 2, y + th - sh, sw, sh); }, inkLevel(0));
  // spurs off the lower edge
  g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round";
  const flick = 0.72 + 0.28 * Math.abs(Math.sin(t * 15));
  for (let k = 0; k < 5; k++){
    const f = (k + 0.5) / 5;
    const px = lerp(x - botH, x + botH, f);
    const L = H * (0.012 + 0.022 * jig(k * 3)) * r * flick;
    if (L <= 1) continue;
    g.beginPath(); g.moveTo(px, y + th); g.lineTo(px + (jig(k) - .5) * W * .016, y + th + L); g.stroke();
  }
}

/* ---------- SOURCE: the SEAM. A hard zigzag rip that opens below the gate and
   tapers out in mid-air — it reaches no ground and kindles nothing. White core
   so it reads as a tear in the paper rather than a drawn line. ---------- */
function seamPts(W, H, s){
  const { x, y } = gatePt(W, H);
  const x0 = x - W * 0.030, y0 = y + H * 0.056;
  const x1 = x - W * 0.150 * s, y1 = y + H * (0.056 + 0.180 * s);
  const N = 9, out = [];
  for (let i = 0; i <= N; i++){
    const f = i / N;
    const z = (i % 2 ? 1 : -1) * W * 0.020 * (0.35 + 0.65 * Math.sin(Math.PI * f))
            + (jig(i * 5) - 0.5) * W * 0.010;
    out.push({ x: lerp(x0, x1, f) + z, y: lerp(y0, y1, f) });
  }
  return out;
}
function seamStroke(g, pts, wMax, color){
  const N = pts.length - 1;
  g.strokeStyle = color; g.lineCap = "round"; g.lineJoin = "round";
  for (let i = 0; i < N; i++){
    const f = (i + 0.5) / N;
    g.lineWidth = Math.max(0.8, wMax * Math.pow(Math.sin(Math.PI * clamp01(f)), 0.5));
    g.beginPath(); g.moveTo(pts[i].x, pts[i].y); g.lineTo(pts[i + 1].x, pts[i + 1].y); g.stroke();
  }
}
function drawSeam(pen, g, W, H, t, report){
  const s = clamp01(report); if (s <= 0.02) return;
  const flick = 0.80 + 0.20 * Math.abs(Math.sin(t * 19));
  const pts = seamPts(W, H, lerp(0.45, 1.0, s));
  seamStroke(g, pts, W * 0.019 * s * flick, INK);
  seamStroke(g, pts, W * 0.0062 * s * flick, inkLevel(0));
}

/* ---------- FIELD: the ANSWER. Broken chevron wavefronts sweeping back down the
   corridor from the gate to the bow — apex on the axis, legs raked back toward
   the source. Dark and tight at the gate, wide and pale at the front. Chevrons,
   not arcs: this is one directed report travelling, quantized into fronts. */
function drawFronts(pen, g, W, H, t, roll){
  const r0 = clamp01(roll); if (r0 <= 0.005) return;
  const G = gatePt(W, H), A = aimPt(W, H);
  const ang = Math.atan2(A.y - G.y, A.x - G.x);
  const D = Math.hypot(A.x - G.x, A.y - G.y);
  const ux = Math.cos(ang), uy = Math.sin(ang), px = -uy, py = ux;
  g.lineCap = "butt"; g.lineJoin = "round";
  for (let k = 0; k < 5; k++){
    const prog = r0 * 1.22 - k * 0.185;
    if (prog <= 0.02) continue;
    const pr = clamp01(prog);
    const d = D * (0.27 + pr * 0.82);
    const hw = D * (0.11 + pr * 0.27);
    const rake = hw * 0.34;
    const cx = G.x + ux * d, cy = G.y + uy * d;
    g.strokeStyle = inkLevel(clamp(Math.round(7 - pr * 4.8), 2, 7));
    g.lineWidth = lerp(8.5, 2.6, pr);
    const dash = Math.max(16, d * 0.185);
    g.setLineDash([dash, dash * 0.46]);
    g.lineDashOffset = -(t * 15 + k * 11);
    g.beginPath();
    g.moveTo(cx + px * hw - ux * rake, cy + py * hw - uy * rake);
    g.lineTo(cx, cy);
    g.lineTo(cx - px * hw - ux * rake, cy - py * hw - uy * rake);
    g.stroke();
  }
  g.setLineDash([]); g.lineDashOffset = 0;
}

/* ---------- CALL: the BOW, drawn as an instrument. Two limbs bellying left off a
   black grip, horn tips top and bottom, and the string as the straight right
   edge — still humming, so it carries pale echo copies either side of the hard
   black line. The bow is the SOURCE OF THE SOUND the sky is answering. */
function drawBow(pen, g, W, H, t, sing){
  const tipTop = { x:W * 0.300, y:H * params.bowTop };
  const tipBot = { x:W * 0.300, y:H * params.bowBot };
  const ctrl   = { x:W * params.bowBelly, y:H * 0.730 };
  // limbs
  pen.limb(() => {
    g.moveTo(tipTop.x, tipTop.y);
    g.quadraticCurveTo(ctrl.x, ctrl.y, tipBot.x, tipBot.y);
  }, toneSolid(inkLevel(4)), W * 0.020);
  // horn tips — dark blocky nocks, angled off the limb ends
  for (const [tp, sgn] of [[tipTop, -1], [tipBot, 1]]){
    pen.paint(() => {
      g.moveTo(tp.x - W * .016, tp.y + sgn * H * .004);
      g.lineTo(tp.x + W * .022, tp.y + sgn * H * .016);
      g.lineTo(tp.x + W * .014, tp.y + sgn * H * .034);
      g.lineTo(tp.x - W * .022, tp.y + sgn * H * .012);
      g.closePath();
    }, toneSolid(inkLevel(7)), 3);
  }
  // grip: the one true black on the limb, with two pale wrap seams
  const gx = W * 0.216, gy = H * 0.730;
  pen.paint(() => { g.rect(gx - W * .020, gy - H * .040, W * .040, H * .080); },
            toneSolid(inkLevel(7)), 3.4);
  g.strokeStyle = inkLevel(1); g.lineWidth = 3;
  for (const dy of [-0.014, 0.014]){
    g.beginPath(); g.moveTo(gx - W * .020, gy + H * dy); g.lineTo(gx + W * .020, gy + H * dy); g.stroke();
  }
  // string: hard black, with the pluck bulge and two pale vibration echoes
  const amp = W * 0.020 * clamp01(sing) * (0.55 + 0.45 * Math.sin(t * 26));
  const P = pluckPt(W, H);
  const drawString = (off, color, lw) => {
    g.strokeStyle = color; g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(tipTop.x, tipTop.y);
    g.lineTo(P.x + off, P.y); g.lineTo(tipBot.x, tipBot.y); g.stroke();
  };
  if (clamp01(sing) > 0.05){
    drawString(amp * 1.9, inkLevel(2), 2.4);
    drawString(-amp * 1.1, inkLevel(3), 2.4);
  }
  drawString(amp, INK, 3.2);
  // the pluck mark: a small filled wedge where the fingers left the string
  pen.fillPath(() => {
    g.moveTo(P.x + amp + W * .008, P.y);
    g.lineTo(P.x + amp + W * .036, P.y - H * .014);
    g.lineTo(P.x + amp + W * .036, P.y + H * .014);
    g.closePath();
  }, INK);
  return { tipTop, tipBot, grip:{ x:gx, y:gy }, pluck:{ x:P.x + amp, y:P.y } };
}

/* the swallow, as GEOMETRY: swept wings, forked tail, one hard black glyph. The
   simile rides the call-ladder instead of being written out in type. */
function drawSwallow(g, cx, cy, s, ang){
  const c = Math.cos(ang), sn = Math.sin(ang);
  const P = [[1.05,0],[0.50,-0.12],[-0.10,-1.62],[-0.15,-0.46],[-1.28,-0.60],[-0.55,0],
             [-1.28,0.60],[-0.15,0.46],[-0.10,1.62],[0.50,0.12]];
  g.beginPath();
  for (let i = 0; i < P.length; i++){
    const x = cx + (P[i][0] * c - P[i][1] * sn) * s;
    const y = cy + (P[i][0] * sn + P[i][1] * c) * s;
    i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
  }
  g.closePath(); g.fillStyle = INK; g.fill();
}

/* ---------- CALL: the rising LADDER. Rungs climbing from the pluck toward the
   gate, widening and paling as they go, flanked by two dashed rails. This is the
   note going UP the corridor the fronts will come DOWN. ---------- */
function drawCall(pen, g, W, H, t, sing){
  const s = clamp01(sing); if (s <= 0.03) return;
  const P = pluckPt(W, H), G = callPt(W, H);
  const ang = Math.atan2(G.y - P.y, G.x - P.x);
  const px = -Math.sin(ang), py = Math.cos(ang);
  const L = Math.hypot(G.x - P.x, G.y - P.y);
  // rails
  g.setLineDash([H * 0.016, H * 0.020]);
  g.strokeStyle = inkLevel(2); g.lineWidth = 2;
  for (const sg of [-1, 1]){
    g.beginPath();
    g.moveTo(P.x + px * W * .014 * sg + Math.cos(ang) * L * .10,
             P.y + py * W * .014 * sg + Math.sin(ang) * L * .10);
    g.lineTo(P.x + px * W * .052 * sg + Math.cos(ang) * L * .92,
             P.y + py * W * .052 * sg + Math.sin(ang) * L * .92);
    g.stroke();
  }
  g.setLineDash([]);
  // rungs
  g.lineCap = "round";
  const N = 8;
  for (let k = 0; k < N; k++){
    const f = 0.10 + (k / (N - 1)) * 0.82;
    const rise = clamp01(s * 1.3 - f * 0.55); if (rise <= 0.02) continue;
    const cx = P.x + Math.cos(ang) * L * f, cy = P.y + Math.sin(ang) * L * f;
    const hw = W * lerp(0.020, 0.058, f);
    g.strokeStyle = inkLevel(clamp(Math.round(7 - f * 4.4), 2, 7));
    g.lineWidth = lerp(7, 2.6, f);
    const wob = Math.sin(t * 5 + k * 1.1) * W * 0.005 * s;
    g.beginPath();
    g.moveTo(cx + px * (hw + wob), cy + py * (hw + wob));
    g.lineTo(cx - px * (hw + wob), cy - py * (hw + wob));
    g.stroke();
  }
  // the swallow at the head of the ladder, out in the empty upper-left field so
  // it reads as one clean hard silhouette and nothing crowds it
  const bx = W * 0.372, by = H * 0.222;
  drawSwallow(g, bx, by, W * 0.050 * (0.55 + 0.45 * s), ang + 0.68);
}

/* ---------- CONSEQUENCE: the bow registers the answer. Ticks spring off both
   horn tips, and broken rings open at the grip — the sign received in the hand
   that is holding the weapon. ---------- */
function drawConfirm(pen, g, W, H, t, answer, bow){
  const a = clamp01(answer); if (a <= 0.03) return;
  g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = lerp(2, 4, a);
  for (const tp of [bow.tipTop, bow.tipBot]){
    for (let k = 0; k < 5; k++){
      const ang = -Math.PI * 0.62 + k / 4 * Math.PI * 1.24 + (tp === bow.tipBot ? Math.PI : 0);
      const r0 = W * 0.030, r1 = r0 + W * (0.020 + 0.030 * jig(k * 7)) * a
                 * (0.75 + 0.25 * Math.abs(Math.sin(t * 7 + k)));
      g.beginPath();
      g.moveTo(tp.x + Math.cos(ang) * r0, tp.y + Math.sin(ang) * r0);
      g.lineTo(tp.x + Math.cos(ang) * r1, tp.y + Math.sin(ang) * r1);
      g.stroke();
    }
  }
  // broken rings opening at the grip
  g.lineCap = "butt";
  for (let k = 0; k < 3; k++){
    const prog = clamp01(a * 1.3 - k * 0.28); if (prog <= 0) continue;
    const rx = lerp(W * .034, W * .130, prog);
    g.strokeStyle = inkLevel(clamp(6 - Math.round(prog * 4), 1, 6));
    g.lineWidth = lerp(5.5, 1.8, prog);
    g.setLineDash([rx * 0.36, rx * 0.26]);
    g.beginPath(); g.ellipse(bow.grip.x, bow.grip.y, rx, rx * 1.15, 0, -Math.PI * 0.42, Math.PI * 0.42);
    g.stroke();
  }
  g.setLineDash([]);
}

/* the numeral ZERO drawn as GEOMETRY (h ~ 0.062·H ≈ 55px at render size): a hard
   octagonal ring with a paper hole. Type this small dissolves in the dot lattice;
   a solid ring does not. It reads the measured gap between note and report. */
function glyphZero(g, cx, cy, h){
  const w = h * 0.62, tk = h * 0.20;
  const oct = (rw, rh, color) => {
    const k = 0.34;
    g.beginPath();
    g.moveTo(cx - rw + rw * k, cy - rh); g.lineTo(cx + rw - rw * k, cy - rh);
    g.lineTo(cx + rw, cy - rh + rh * k); g.lineTo(cx + rw, cy + rh - rh * k);
    g.lineTo(cx + rw - rw * k, cy + rh); g.lineTo(cx - rw + rw * k, cy + rh);
    g.lineTo(cx - rw, cy + rh - rh * k); g.lineTo(cx - rw, cy - rh + rh * k);
    g.closePath(); g.fillStyle = color; g.fill();
  };
  oct(w / 2, h / 2, INK);
  oct(w / 2 - tk, h / 2 - tk, inkLevel(0));
}

/* ---------- LEDGER: the latency instrument, bottom-right. A LIGHT plane with
   dark accents (the tonal ballast for the whole card). One narrow spike is the
   bowstring's note; the heavy decaying bar-envelope behind it is the thunder; the
   bracketed gap between them is measured, and reads ZERO. That reading — not the
   noise — is what makes this a CONFIRMING response. ---------- */
function drawLedger(pen, g, W, H, sing, roll, answer){
  const x0 = W * params.panelX0, x1 = W * params.panelX1;
  const y0 = H * params.panelY0, y1 = H * params.panelY1;
  const ay = H * params.axisY;
  pen.paint(() => { g.rect(x0, y0, x1 - x0, y1 - y0); }, toneSolid(inkLevel(1)), 3.6);
  // corner registration blocks so the panel reads as an instrument face
  for (const [cx, cy] of [[x0, y0], [x1, y0]])
    pen.fillPath(() => { g.rect(cx - W * .010, cy - H * .006, W * .020, H * .012); }, INK);
  // time axis — dashed, so it is a datum and not a stripe
  g.setLineDash([W * 0.026, W * 0.013]);
  g.strokeStyle = INK; g.lineWidth = 3.4;
  g.beginPath(); g.moveTo(x0 + W * .035, ay); g.lineTo(x1 - W * .028, ay); g.stroke();
  g.setLineDash([]);
  // axis ticks below the line
  g.lineWidth = 2.6;
  for (let k = 0; k <= 6; k++){
    const x = lerp(x0 + W * .035, x1 - W * .028, k / 6);
    const L = (k % 3 === 0 ? H * .014 : H * .008);
    g.beginPath(); g.moveTo(x, ay); g.lineTo(x, ay + L); g.stroke();
  }
  // NOTE — one narrow tall spike
  const s = clamp01(sing);
  const nx = W * 0.600, nh = H * 0.088 * s;
  if (nh > 2){
    pen.paint(() => { g.rect(nx - W * .009, ay - nh, W * .018, nh); }, toneSolid(inkLevel(7)), 2.6);
    pen.fillPath(() => {
      g.moveTo(nx - W * .015, ay - nh); g.lineTo(nx + W * .015, ay - nh);
      g.lineTo(nx, ay - nh - H * .018); g.closePath();
    }, INK);
  }
  // THUNDER — the decaying bar envelope, immediately behind the note
  const r = clamp01(Math.max(roll, answer * 0.9));
  const NB = 12, bx0 = W * 0.690, bx1 = W * 0.922;
  for (let k = 0; k < NB; k++){
    const shown = clamp01(r * 1.5 - k / NB); if (shown <= 0.02) continue;
    const x = lerp(bx0, bx1, k / (NB - 1));
    const env = Math.pow(0.845, k) * (k === 0 ? 0.60 : 1);
    const h = H * 0.104 * env * shown;
    if (h < 2) continue;
    g.fillStyle = inkLevel(clamp(7 - Math.round(k * 0.42), 2, 7));
    g.fillRect(x - W * .0075, ay - h, W * .015, h);
    g.strokeStyle = INK; g.lineWidth = 1.8;
    g.strokeRect(x - W * .0075, ay - h, W * .015, h);
  }
  // the measured GAP: a bracket between the note spike and the thunder envelope
  const gy = H * 0.766;
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "butt";
  g.beginPath();
  g.moveTo(nx, gy + H * .022); g.lineTo(nx, gy);
  g.lineTo(bx0, gy); g.lineTo(bx0, gy + H * .022);
  g.stroke();
  // the reading: ZERO delay, as geometry, parked clear to the left of the traces
  glyphZero(g, W * 0.548, H * 0.790, H * 0.064);
  // and a small solid "locked" square that fills once the answer has landed
  pen.paint(() => { g.rect(W * .880, y0 + H * .018, W * .034, H * .034); },
            toneSolid(inkLevel(clamp01(answer) > 0.5 ? 7 : 0)), 3);
}

function drawFX(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const t = st.t ?? 0;
  const inten  = st.intensity ?? params.intensity;
  const sing   = st.sing   ?? clamp(inten * 1.6, 0, 1);
  const report = st.report ?? clamp((inten - 0.26) * 2.6, 0, 1);
  const roll   = st.roll   ?? clamp((inten - 0.38) * 1.7, 0, 1);
  const answer = st.answer ?? clamp((inten - 0.66) * 2.6, 0, 1);

  const layers = st.layers || ["sky","ledger","bow","call","fronts","seam","gate","confirm"];
  const has = l => layers.includes(l);

  let bow = { tipTop:{ x:W * .300, y:H * params.bowTop },
              tipBot:{ x:W * .300, y:H * params.bowBot },
              grip:{ x:W * .216, y:H * .730 },
              pluck:pluckPt(W, H) };

  if (has("sky"))     drawSky(pen, g, W, H);
  if (has("ledger"))  drawLedger(pen, g, W, H, sing, roll, answer);
  if (has("bow"))     bow = drawBow(pen, g, W, H, t, sing);
  if (has("call"))    drawCall(pen, g, W, H, t, sing);
  if (has("fronts"))  drawFronts(pen, g, W, H, t, roll);
  if (has("seam"))    drawSeam(pen, g, W, H, t, report);
  if (has("gate"))    drawGate(pen, g, W, H, t, report);
  if (has("confirm")) drawConfirm(pen, g, W, H, t, answer, bow);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine-fx.zeuss-thunder",
  type:"DIVINE_FX",
  name:"Zeus's thunder",
  statusWord:"CONFIRMED",
  scene:"OD-B21-S07",

  params,
  // back -> front; a scene may pass any subset (e.g. drop "bow"/"ledger" when the
  // hall and the prop bow are already on stage, keeping only the sky channel)
  layers:["sky","ledger","bow","call","fronts","seam","gate","confirm"],

  // normalized 0..1 source / call / field / consequence anchors
  anchors:{
    "source:gate":        { x:0.760, y:0.155 },  // the keystone door in the air
    "source:seam-tail":   { x:0.610, y:0.391 },  // where the rip tapers out
    "call:pluck":         { x:0.302, y:0.728 },  // the string that sang
    "call:swallow":       { x:0.372, y:0.222 },  // the simile, mid-ladder
    "field:corridor":     { x:0.492, y:0.445 },  // the shared two-way channel
    "field:wavefront":    { x:0.352, y:0.582 },  // where the report has reached
    "target:bow":         { x:0.216, y:0.730 },  // the grip — the hand that hears
    "consequence:horn-hi":{ x:0.300, y:0.575 },
    "consequence:horn-lo":{ x:0.300, y:0.885 },
    "ledger:delay":       { x:0.548, y:0.768 },  // the ZERO reading
    "camera:wide":        { x:0.500, y:0.500 },
    "camera:sky":         { x:0.700, y:0.230 },
  },

  // affected regions
  zones:{
    sky:      { x0:0.02, y0:0.05, x1:1.00, y1:0.42 },   // empty field, no cloud
    corridor: { x0:0.16, y0:0.12, x1:0.90, y1:0.82 },   // call up / report down
    bow:      { x0:0.11, y0:0.54, x1:0.38, y1:0.92 },   // the sounding instrument
    ledger:   { x0:0.49, y0:0.70, x1:0.96, y1:0.95 },   // the latency reading
  },

  // DIVINE_FX states: note -> report -> roll -> confirmation, no gap between 1 and 2
  states:{
    initial:"report",
    nodes:{
      strung:{    preview:{ t:0.3, intensity:0.04, sing:0.0, report:0.0, roll:0.0,
                    answer:0.0, status:"STRUNG", progress:0.06,
                    layers:["sky","ledger","bow"] } },
      singing:{   preview:{ t:1.0, intensity:0.20, sing:1.0, report:0.0, roll:0.0,
                    answer:0.0, status:"SINGING", progress:0.26,
                    layers:["sky","ledger","bow","call"] } },
      report:{    preview:{ t:1.9, intensity:0.46, sing:0.85, report:1.0, roll:0.22,
                    answer:0.0, status:"THUNDER", progress:0.52 } },
      rolling:{   preview:{ t:3.0, intensity:0.76, sing:0.42, report:0.46, roll:0.70,
                    answer:0.30, status:"ROLLING", progress:0.78 } },
      confirmed:{ preview:{ t:4.1, intensity:1.00, sing:0.16, report:0.16, roll:1.0,
                    answer:1.0, status:"CONFIRMED", progress:0.97 } },
    },
    edges:[["strung","singing"],["singing","report"],["report","rolling"],["rolling","confirmed"]],
  },
  duration:5.0,

  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","sing","report","roll","answer"],

  // neutral preview: the hinge — the string still humming up the ladder while the
  // gate tears open and the first front leaves it. Call and answer both on frame.
  preview:()=>({ t:1.9, intensity:0.46, sing:0.85, report:1.0, roll:0.44,
                 answer:0.22, status:"THUNDER", progress:0.52,
                 layers:["sky","ledger","bow","call","fronts","seam","gate","confirm"] }),

  draw(ctx, W, H, state){ return drawFX(ctx, W, H, state || {}); },
};
export default asset;
