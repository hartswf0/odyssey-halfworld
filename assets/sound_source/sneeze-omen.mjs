/* sound_source.sneeze-omen — Telemachus' sudden sneeze cracking across the
   hall while Penelope is speaking, and the omen she reads out of it.
   SOUND_SOURCE asset. An ADDRESSABLE DIEGETIC EMITTER rendered as a legible
   emitter DIAGRAM, not an illustration: a broken HALL PLAN with the emitter
   seat at the left and the listener seat at the right, an IMPULSE STAR at the
   emitter, a directional CROSSING LOBE of wavefront arcs travelling the hall,
   a LISTENING rosette + OMEN READOUT panel at the receiver, an ENVELOPE trace
   (speech bed -> hard attack -> short tail -> cut silence), and two RHYTHM
   lanes: SPEECH, which stops dead in a gap, and STRIKE, the single hall-
   crossing report. Drawn in SOLID grays + hard contour into the offscreen ctx;
   the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B17-S06): a sudden hall-crossing sound that interrupts
   speech and triggers Penelope's interpretation. Driven by
   { intensity, phase, cut, read, stopped } so the runtime can arm the emitter,
   fire it on a word, walk the report across the room, and light the reading.
   States: armed / sneeze / crossing / heard / interpreted / silent.
   Atlas: addressable emitter — position, intensity, rhythm, start/stop,
   relation to visible action. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;

const params = {
  hall:     { x0:0.075, y0:0.100, x1:0.925, y1:0.440 }, // plan bounds (drawn as brackets, never a full box)
  emitter:  { x:0.200, y:0.330 },   // Telemachus' seat — the sneeze origin
  receiver: { x:0.800, y:0.200 },   // Penelope's seat — the interpreter
  fronts:   [0.18, 0.33, 0.47, 0.61, 0.76], // wavefront arc distances along the axis
  lobeHalf: 0.38,                   // half-angle of the directional crossing lobe (rad)
  spikes:   16,                     // rays of the impulse star
  travelY:  0.475,                  // the crossing-distance measure, under the plan
  panel:    { x0:0.520, y0:0.505, x1:0.930, y1:0.615 }, // omen readout
  env:      { x0:0.130, x1:0.870, base:0.745, h:0.100, impulse:0.30 },
  speech:   { base:0.835, n:26, cutFrom:8, cutTo:13 },  // the interrupted line
  strike:   { base:0.925, n:26, at:8 },                 // the single report
  intensity:1.00,
  phase:    0.55,
};

/* ---------- small helpers ---------- */
// a span drawn as separate segments so nothing stripes the frame edge to edge
function brokenLine(g, x0, x1, y, lw, cuts = [[0, .30], [.37, .66], [.73, 1]]) {
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt";
  for (const [a, b] of cuts) {
    g.beginPath(); g.moveTo(lerp(x0, x1, a), y); g.lineTo(lerp(x0, x1, b), y); g.stroke();
  }
}
function bracket(g, cx, cy, dx, dy, lw) { // corner L of the plan
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt"; g.lineJoin = "miter";
  g.beginPath(); g.moveTo(cx + dx, cy); g.lineTo(cx, cy); g.lineTo(cx, cy + dy); g.stroke();
}
function crosshair(g, x, y, r, lw) {
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt";
  g.beginPath(); g.moveTo(x - r, y); g.lineTo(x + r, y); g.stroke();
  g.beginPath(); g.moveTo(x, y - r); g.lineTo(x, y + r); g.stroke();
}
/* a seat: light plane, hard contour, one back slat — reads as furniture in plan */
function seat(pen, g, x, y, w, h, back) {
  pen.paint(() => { g.rect(x - w / 2, y, w, h); }, toneSolid(inkLevel(1)), 4);
  pen.ink(() => { g.moveTo(x - w * .32, y + h * .30); g.lineTo(x + w * .32, y + h * .30); }, 2);
  if (back) pen.paint(() => { g.rect(x - w / 2, y - h * .62, w * .22, h * .62); }, toneSolid(inkLevel(2)), 4);
  else pen.paint(() => { g.rect(x + w / 2 - w * .22, y - h * .62, w * .22, h * .62); }, toneSolid(inkLevel(2)), 4);
}

/* ---------- lane head glyphs (geometry, never small type) ---------- */
function glyphSpeech(pen, g, cx, cy, s) { // a mouth with three arcs = running speech
  pen.paint(() => { g.arc(cx - s * .30, cy, s * .22, 0, TAU); }, toneSolid(inkLevel(5)), 3);
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "round";
  for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(cx - s * .30, cy, s * (.16 + i * .22), -0.72, 0.72); g.stroke(); }
}
function glyphBurst(pen, g, cx, cy, s) { // an impulse star = the report
  g.strokeStyle = INK; g.lineWidth = 3.5; g.lineCap = "round";
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * TAU, r0 = s * .18, r1 = s * (i % 2 ? .44 : .68);
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke();
  }
  pen.paint(() => { g.arc(cx, cy, s * .16, 0, TAU); }, toneSolid(inkLevel(7)), 3);
}

/* ---------- the diagram ---------- */
function drawDiagram(ctx, W, H, st) {
  const pen = makePen(ctx, { outline: true });
  const g = ctx;
  const P = params;

  const intensity = clamp(st.intensity ?? P.intensity, 0, 1);
  const phase = clamp(st.phase ?? P.phase, 0, 1);
  const stopped = !!st.stopped;
  const cut = st.cut !== undefined ? !!st.cut : (!stopped && phase > 0.25);
  const read = !!st.read;

  const ex = W * P.emitter.x, ey = H * P.emitter.y;
  const rx = W * P.receiver.x, ry = H * P.receiver.y;
  const ax = rx - ex, ay = ry - ey;
  const span = Math.hypot(ax, ay);
  const axis = Math.atan2(ay, ax);
  // how far the report has crossed the room: 0 before the sneeze, 1 at the ear
  const cross = stopped ? 0 : clamp((phase - 0.25) / 0.62, 0, 1);
  const heat = stopped ? 0 : intensity * (1 - cross * 0.55); // the burst decays as it travels

  const hx0 = W * P.hall.x0, hy0 = H * P.hall.y0, hx1 = W * P.hall.x1, hy1 = H * P.hall.y1;

  /* ---- SOUND FIELD: faint disc over the stretch of room the report covers ---- */
  if (!stopped) {
    const mx = (ex + rx) / 2, my = (ey + ry) / 2;
    g.save(); g.translate(mx, my); g.rotate(axis);
    pen.paint(() => { g.ellipse(0, 0, span * 0.62, span * 0.30, 0, 0, TAU); }, toneSolid(inkLevel(1)), 0);
    g.restore();
  }

  /* ---- HALL PLAN: corner brackets + broken floor seams, never a closed box ---- */
  const bw = (hx1 - hx0) * 0.17, bh = (hy1 - hy0) * 0.26;
  bracket(g, hx0, hy0, bw, bh, 5); bracket(g, hx1, hy0, -bw, bh, 5);
  bracket(g, hx0, hy1, bw, -bh, 5); bracket(g, hx1, hy1, -bw, -bh, 5);
  brokenLine(g, hx0 + bw * 0.55, hx1 - bw * 0.55, hy1, 3, [[0, .22], [.34, .60], [.72, 1]]);
  // threshold jamb on the left wall (where the hall opens) — two stubs, a gap between
  g.strokeStyle = INK; g.lineWidth = 5;
  g.beginPath(); g.moveTo(hx0, hy0 + bh * 1.5); g.lineTo(hx0, hy0 + bh * 2.1); g.stroke();
  g.beginPath(); g.moveTo(hx0, hy1 - bh * 1.5); g.lineTo(hx0, hy1 - bh * 2.1); g.stroke();

  /* ---- SEATS (relation to visible action) ---- */
  seat(pen, g, ex, ey + 52, 58, 22, false);
  seat(pen, g, rx, ry + 58, 58, 22, true);

  /* ---- CROSSING AXIS: dashed, emitter -> listener ---- */
  g.save();
  g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = stopped ? 0.30 : 0.70;
  g.setLineDash([13, 11]);
  g.beginPath(); g.moveTo(ex + Math.cos(axis) * 30, ey + Math.sin(axis) * 30);
  g.lineTo(rx - Math.cos(axis) * 30, ry - Math.sin(axis) * 30); g.stroke();
  g.restore();

  /* ---- WAVEFRONT ARCS: the report travelling the room ---- */
  for (let i = 0; i < P.fronts.length; i++) {
    const f = P.fronts[i];
    const r = span * f;
    const lit = !stopped && cross >= f * 0.92;
    g.save();
    if (lit) { g.strokeStyle = INK; g.lineWidth = clamp(6.5 - i * 0.8, 3, 6.5); g.globalAlpha = clamp(1 - (cross - f) * 0.6, 0.5, 1); }
    else { g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = stopped ? 0.22 : 0.38; g.setLineDash([11, 11]); }
    g.beginPath(); g.arc(ex, ey, r, axis - P.lobeHalf, axis + P.lobeHalf); g.stroke();
    g.restore();
  }
  /* leading edge: a bold short arc + arrowhead riding the axis */
  if (!stopped && cross > 0.02) {
    const r = span * clamp(cross, 0.06, 0.68);   // never rides on top of the listener
    g.save(); g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = "round";
    g.beginPath(); g.arc(ex, ey, r, axis - P.lobeHalf * 0.62, axis + P.lobeHalf * 0.62); g.stroke();
    g.restore();
    const hx = ex + Math.cos(axis) * (r + 15), hy = ey + Math.sin(axis) * (r + 15);
    g.save(); g.translate(hx, hy); g.rotate(axis);
    pen.paint(() => { g.moveTo(14, 0); g.lineTo(-11, -10); g.lineTo(-11, 10); g.closePath(); }, toneSolid(inkLevel(7)), 3);
    g.restore();
  }

  /* ---- IMPULSE STAR at the emitter (a transient, not a steady bed) ---- */
  if (!stopped && heat > 0.02) {
    g.strokeStyle = INK; g.lineCap = "round";
    for (let i = 0; i < P.spikes; i++) {
      const a = i / P.spikes * TAU + 0.09;
      const long = i % 2 === 0;
      const r0 = 24, r1 = 24 + (long ? 52 : 30) * (0.45 + 0.55 * heat);
      g.lineWidth = long ? 4.5 : 2.5;
      g.beginPath(); g.moveTo(ex + Math.cos(a) * r0, ey + Math.sin(a) * r0);
      g.lineTo(ex + Math.cos(a) * r1, ey + Math.sin(a) * r1); g.stroke();
    }
  }
  pen.paint(() => { g.arc(ex, ey, 23, 0, TAU); }, toneSolid(inkLevel(1)), 4);
  crosshair(g, ex, ey, 36, 3);
  pen.paint(() => { g.arc(ex, ey, 10, 0, TAU); }, toneSolid(inkLevel(stopped ? 3 : 7)), 3);

  /* ---- LISTENER: rosette of arcs opening back toward the emitter ---- */
  const back = axis + Math.PI;
  const arrived = cross > 0.86;
  for (let k = 0; k < 3; k++) {
    g.save();
    g.strokeStyle = INK; g.lineWidth = arrived ? clamp(6 - k * 1.2, 3, 6) : 2.5;
    g.globalAlpha = arrived ? clamp(0.95 - k * 0.14, 0.45, 1) : 0.34;
    if (!arrived) g.setLineDash([10, 10]);
    g.beginPath(); g.arc(rx, ry, 34 + k * 21, back - 0.70, back + 0.70); g.stroke();
    g.restore();
  }
  pen.paint(() => { g.arc(rx, ry, 22, 0, TAU); }, toneSolid(inkLevel(1)), 4);
  crosshair(g, rx, ry, 34, 3.5);
  pen.paint(() => { g.arc(rx, ry, 10, 0, TAU); }, toneSolid(inkLevel(arrived ? 7 : 3)), 3);

  /* ---- TRAVEL MEASURE under the plan: two segments with the cursor in the gap ---- */
  const ty = H * P.travelY;
  const gapC = lerp(ex, rx, clamp(cross, 0.06, 0.94)), gapW = 26;
  g.save();
  g.strokeStyle = INK; g.lineWidth = 3.5; g.lineCap = "butt"; g.setLineDash([17, 13]);
  g.beginPath(); g.moveTo(ex, ty); g.lineTo(Math.max(ex + 8, gapC - gapW), ty); g.stroke();
  g.beginPath(); g.moveTo(Math.min(rx - 8, gapC + gapW), ty); g.lineTo(rx, ty); g.stroke();
  g.restore();
  g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt";
  for (const sx of [ex, rx]) { g.beginPath(); g.moveTo(sx, ty - 13); g.lineTo(sx, ty + 13); g.stroke(); }
  if (!stopped) { // the instant marker sitting in the break
    pen.paint(() => { g.moveTo(gapC, ty - 13); g.lineTo(gapC + 11, ty); g.lineTo(gapC, ty + 13); g.lineTo(gapC - 11, ty); g.closePath(); },
      toneSolid(inkLevel(6)), 3);
  }

  /* ---- OMEN READOUT: source sign -> verdict, tied to the listener by a leader ---- */
  const px0 = W * P.panel.x0, py0 = H * P.panel.y0, px1 = W * P.panel.x1, py1 = H * P.panel.y1;
  g.save(); g.strokeStyle = INK; g.lineWidth = 3.5; g.globalAlpha = 0.75; g.setLineDash([12, 9]);
  g.beginPath(); g.moveTo(rx, ry + 96); g.lineTo(px0 + 46, py0 - 8); g.stroke();
  g.restore();
  pen.paint(() => { g.rect(px0, py0, px1 - px0, py1 - py0); }, toneSolid(inkLevel(1)), 5);
  const cw = (px1 - px0) * 0.30, cy = (py0 + py1) / 2, ph = py1 - py0;
  // cell A — the omen's source: a single hard impulse tick
  const aX = px0 + (px1 - px0) * 0.19;
  pen.paint(() => { g.rect(aX - cw / 2, py0 + ph * .16, cw, ph * .68); }, toneSolid(inkLevel(0)), 3);
  g.fillStyle = inkLevel(7); g.fillRect(aX - 6, cy - ph * .30, 12, ph * .60);
  g.fillStyle = inkLevel(4); g.fillRect(aX - 21, cy + ph * .10, 8, ph * .20);
  g.fillStyle = inkLevel(4); g.fillRect(aX + 13, cy + ph * .10, 8, ph * .20);
  // arrow: source -> verdict
  g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt";
  const arw0 = aX + cw * 0.72, arw1 = px0 + (px1 - px0) * 0.56;
  g.beginPath(); g.moveTo(arw0, cy); g.lineTo(arw1, cy); g.stroke();
  pen.paint(() => { g.moveTo(arw1 + 15, cy); g.lineTo(arw1 - 3, cy - 9); g.lineTo(arw1 - 3, cy + 9); g.closePath(); }, toneSolid(inkLevel(7)), 2);
  // cell B — the verdict: an empty frame until read, then a struck chevron (assent)
  const bX = px0 + (px1 - px0) * 0.80;
  pen.paint(() => { g.rect(bX - cw / 2, py0 + ph * .16, cw, ph * .68); }, toneSolid(read ? inkLevel(2) : inkLevel(0)), 3);
  if (read) {
    g.strokeStyle = INK; g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath();
    g.moveTo(bX - cw * .30, cy + ph * .02);
    g.lineTo(bX - cw * .06, cy + ph * .24);
    g.lineTo(bX + cw * .34, cy - ph * .26);
    g.stroke();
  } else {
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.45; g.setLineDash([7, 8]);
    g.beginPath(); g.moveTo(bX - cw * .28, cy); g.lineTo(bX + cw * .28, cy); g.stroke();
    g.restore();
  }

  /* ---- ENVELOPE: speech bed, hard attack, short tail, cut silence ---- */
  const ex0 = W * P.env.x0, ex1 = W * P.env.x1, eBase = H * P.env.base, eH = H * P.env.h;
  brokenLine(g, ex0 - 14, ex1 + 14, eBase, 3, [[0, .28], [.35, .64], [.71, 1]]);
  const f = P.env.impulse;
  const yAt = (u) => {
    const bed = eBase - eH * (0.155 + 0.045 * Math.sin(u * 74));
    if (stopped) return bed;
    if (u < f) return bed;
    if (u < f + 0.018) return lerp(bed, eBase - eH * intensity, (u - f) / 0.018);
    const tail = eBase - eH * intensity * Math.exp(-(u - f - 0.018) * 11);
    if (!cut && u > f + 0.24) return Math.min(tail, bed);
    return tail;
  };
  g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.lineJoin = "round"; g.lineCap = "round";
  g.beginPath();
  for (let i = 0; i <= 150; i++) {
    const u = i / 150, x = lerp(ex0, ex1, u), y = yAt(u);
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke(); g.restore();
  // time cursor through the envelope
  const uc = stopped ? 0.10 : clamp(lerp(0.10, 0.94, phase), 0.10, 0.94);
  const cx0 = lerp(ex0, ex1, uc);
  const curTop = H * 0.652;
  g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt"; g.setLineDash([9, 9]);
  g.beginPath(); g.moveTo(cx0, curTop); g.lineTo(cx0, H * P.strike.base + 10); g.stroke();
  g.restore();
  g.fillStyle = ACCENT; g.fillRect(cx0 - 8, curTop - 17, 16, 16);
  g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(cx0 - 8, curTop - 17, 16, 16);

  /* ---- LANE 1 · SPEECH: an even line of ticks that stops dead in a gap ---- */
  const lx0 = W * 0.155, lx1 = W * 0.875;
  const sBase = H * P.speech.base, n = P.speech.n, step = (lx1 - lx0) / (n - 1);
  glyphSpeech(pen, g, W * 0.078, sBase - 16, 34);
  brokenLine(g, lx0 - 12, lx1 + 12, sBase, 3, [[0, .30], [.38, .63], [.72, 1]]);
  const curIdx = uc * n;
  for (let i = 0; i < n; i++) {
    const bx = lx0 + i * step;
    if (cut && i >= P.speech.cutFrom && i <= P.speech.cutTo) continue; // the interruption
    const acc = [2, 1, 2, 1, 3, 1, 2, 1, 2, 1, 3, 1][i % 12];
    const on = i <= curIdx;
    const h = 11 + acc * 7;
    const w = acc >= 3 ? 8 : 6;
    g.fillStyle = inkLevel(on ? (acc >= 3 ? 6 : 4) : 2);
    g.fillRect(bx - w / 2, sBase - h, w, h);
    if (on) { g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(bx - w / 2, sBase - h, w, h); }
  }
  if (cut) { // the two cut jambs bracketing the silence
    for (const i of [P.speech.cutFrom - 0.55, P.speech.cutTo + 0.55]) {
      const bx = lx0 + i * step;
      g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.setLineDash([5, 5]);
      g.beginPath(); g.moveTo(bx, sBase - 40); g.lineTo(bx, sBase + 8); g.stroke(); g.restore();
    }
  }

  /* ---- LANE 2 · STRIKE: one report, then a three-tick tail ---- */
  const kBase = H * P.strike.base;
  glyphBurst(pen, g, W * 0.078, kBase - 24, 40);
  brokenLine(g, lx0 - 12, lx1 + 12, kBase, 3, [[0, .30], [.38, .63], [.72, 1]]);
  if (!stopped) {
    const hits = [[0, 62, 14, 7], [1, 26, 9, 5], [2, 16, 8, 4], [3, 10, 7, 3]];
    for (const [d, hh, ww, lv] of hits) {
      const i = P.strike.at + d;
      if (i > curIdx + 0.5) continue;
      const bx = lx0 + i * step;
      const h = hh * (0.35 + 0.65 * intensity);
      g.fillStyle = inkLevel(lv);
      g.fillRect(bx - ww / 2, kBase - h, ww, h);
      g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(bx - ww / 2, kBase - h, ww, h);
    }
  }
}

export const asset = {
  id: "sound_source.sneeze-omen",
  type: "SOUND_SOURCE",
  name: "Sneeze omen",
  statusWord: "OMEN",
  scene: "OD-B17-S06",

  params,
  // back -> front draw order the diagram honors
  layers: ["field", "hall-plan", "seats", "axis", "wavefronts", "impulse", "listener",
           "travel", "readout", "envelope", "cursor", "speech-lane", "strike-lane"],
  // normalized 0..1 emitter / receiver / readout stations
  anchors: {
    "emitter:position": { x: 0.200, y: 0.330 },
    "emitter:seat":     { x: 0.200, y: 0.400 },
    "receiver:position":{ x: 0.800, y: 0.200 },
    "receiver:seat":    { x: 0.800, y: 0.270 },
    "axis:mid":         { x: 0.500, y: 0.265 },
    "omen:readout":     { x: 0.725, y: 0.560 },
    "omen:verdict":     { x: 0.848, y: 0.560 },
    "cut:instant":      { x: 0.377, y: 0.835 },
    "camera:diagram":   { x: 0.500, y: 0.500 },
  },
  // relation to visible action: the report crosses the plan; the lanes carry the clock
  zones: {
    hall:   { x0: .075, y0: .100, x1: .925, y1: .440 },
    readout:{ x0: .520, y0: .505, x1: .930, y1: .615 },
    rhythm: { x0: .130, y0: .650, x1: .875, y1: .940 },
  },
  states: {
    initial: "armed",
    nodes: {
      armed:      { preview: { intensity: 0.00, phase: 0.14, cut: false, read: false, stopped: true,  status: "ARMED",    progress: 0.10 } },
      sneeze:     { preview: { intensity: 1.00, phase: 0.32, cut: true,  read: false, stopped: false, status: "SNEEZE",   progress: 1.00 } },
      crossing:   { preview: { intensity: 0.82, phase: 0.55, cut: true,  read: false, stopped: false, status: "CROSSING", progress: 0.72 } },
      heard:      { preview: { intensity: 0.46, phase: 0.80, cut: true,  read: false, stopped: false, status: "HEARD",    progress: 0.46 } },
      interpreted:{ preview: { intensity: 0.24, phase: 0.95, cut: true,  read: true,  stopped: false, status: "OMEN",     progress: 0.88 } },
      silent:     { preview: { intensity: 0.00, phase: 0.05, cut: false, read: false, stopped: true,  status: "SILENT",   progress: 0.02 } },
    },
    edges: [
      ["armed", "sneeze"], ["sneeze", "crossing"], ["crossing", "heard"],
      ["heard", "interpreted"], ["interpreted", "armed"],
      ["armed", "silent"], ["silent", "armed"], ["interpreted", "silent"],
    ],
  },
  channels: ["intensity", "phase", "rhythm", "pan", "reading"],

  preview: () => ({ intensity: 0.74, phase: 0.86, cut: true, read: true, stopped: false, status: "OMEN", progress: 0.88 }),
  draw(ctx, W, H, state) { drawDiagram(ctx, W, H, state); return { anchors: asset.anchors, zones: asset.zones }; },
};
export default asset;
