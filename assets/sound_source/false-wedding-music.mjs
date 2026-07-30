/* sound_source.false-wedding-music — with twelve maids hanged in the yard and the
   suitors' blood still on the floor, Odysseus orders the bard to strike up a
   dance: lyre, stamping feet, women's voices, festive calls — a wedding staged
   for the ears of anyone in the street, so the town will say "the queen has
   married at last" instead of counting its dead sons.
   SOUND_SOURCE asset. An ADDRESSABLE DIEGETIC EMITTER drawn as a legible emitter
   DIAGRAM, not an illustration: an emitter marker inside the hall with three
   tethered source glyphs (LYRE / FEET / CALLS), a narrow interior wedge aimed
   deliberately at the courtyard APERTURE, the PALACE WALL in section with the
   gap jambed and a gain chevron driving the bed OUT, a wide street-side fan
   reaching two passers-by, the AFTERMATH the noise is covering shown as stubs
   under a dashed hood, a REACH PROFILE that stays above the "town hears it"
   threshold past the wall jamb, a DECEPTION READOUT that latches slaughter ->
   wedding, a sustained ENVELOPE (this bed does not decay — it is held), and
   three RHYTHM lanes: LYRE strums, FEET on the beat, CALLS thrown irregularly.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B23-S03): lyre, feet, voices and festive calls designed to
   travel beyond palace walls. Driven by { intensity, phase, tempo, reach,
   believed, stopped } so the runtime can cue the bard, hold the bed at volume,
   push it through the gate and latch the street's false reading.
   States: silent / cue / playing / carrying / believed / stopped.
   Atlas: addressable emitter — position, intensity, rhythm, start/stop,
   relation to visible action. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;

const params = {
  // --- the emitter, inside the hall ---
  emitter:  { x:0.290, y:0.250 },
  sources:  {                                   // tethered contributors
    lyre:  { x:0.165, y:0.152 },
    feet:  { x:0.098, y:0.262 },
    calls: { x:0.400, y:0.352 },
  },
  // --- the hall, the wall, the street ---
  hall:     { x0:0.062, y0:0.082, x1:0.560, y1:0.420 },
  wall:     { x0:0.562, x1:0.606, y0:0.082, y1:0.420, gap0:0.168, gap1:0.262 },
  street:   { x0:0.618, y0:0.082, x1:0.952, y1:0.420 },
  receivers:[ { x:0.888, y:0.142 }, { x:0.852, y:0.312 } ],
  // --- how the bed travels ---
  inFronts: [0.34, 0.60, 0.86],                 // wavefronts hall-side
  outFronts:[0.24, 0.42, 0.60, 0.78, 0.95],     // wavefronts street-side
  lobeIn:   0.36,                               // half-angle aimed at the gap
  lobeOut:  0.62,                               // half-angle blooming outside
  // --- what the noise is covering ---
  cover:    { x:0.190, y:0.396, n:3 },
  // --- readouts ---
  profile:  { x0:0.092, x1:0.532, base:0.628, bins:12, h:0.132, wallBin:5.5, thr:0.33 },
  panel:    { x0:0.588, y0:0.466, x1:0.936, y1:0.614 },
  // --- the clock ---
  env:      { x0:0.108, x1:0.888, base:0.706, h:0.082, cue:0.22 },
  lanes:    { lyre:0.790, feet:0.860, calls:0.930, x0:0.150, x1:0.888, n:26 },
  intensity:1.00,
  phase:    0.66,
  tempo:    0.74,
};

/* ---------- small helpers ---------- */
// a span drawn as separate segments so nothing stripes the frame edge to edge
function brokenLine(g, x0, x1, y, lw, cuts = [[0, .29], [.36, .64], [.72, 1]]) {
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt";
  for (const [a, b] of cuts) {
    g.beginPath(); g.moveTo(lerp(x0, x1, a), y); g.lineTo(lerp(x0, x1, b), y); g.stroke();
  }
}
function bracket(g, cx, cy, dx, dy, lw) {  // corner L — a room implied, never boxed
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt"; g.lineJoin = "miter";
  g.beginPath(); g.moveTo(cx + dx, cy); g.lineTo(cx, cy); g.lineTo(cx, cy + dy); g.stroke();
}
function crosshair(g, x, y, r, lw) {
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt";
  g.beginPath(); g.moveTo(x - r, y); g.lineTo(x + r, y); g.stroke();
  g.beginPath(); g.moveTo(x, y - r); g.lineTo(x, y + r); g.stroke();
}
function jambH(g, x, y, w, lw) {           // a short horizontal stop (lintel / sill)
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt";
  g.beginPath(); g.moveTo(x - w, y); g.lineTo(x + w, y); g.stroke();
}
function jambV(g, x, y, h, lw) {
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt";
  g.beginPath(); g.moveTo(x, y - h); g.lineTo(x, y + h); g.stroke();
}
// a listening rosette: arcs opening back down the arrival axis
function rosette(pen, g, x, y, back, lit) {
  for (let k = 0; k < 3; k++) {
    g.save();
    g.strokeStyle = INK; g.lineWidth = lit ? clamp(6 - k * 1.2, 3, 6) : 2.5;
    g.globalAlpha = lit ? clamp(0.95 - k * 0.16, 0.40, 1) : 0.30;
    if (!lit) g.setLineDash([9, 11]);
    g.beginPath(); g.arc(x, y, 30 + k * 19, back - 0.66, back + 0.66); g.stroke();
    g.restore();
  }
  pen.paint(() => { g.arc(x, y, 19, 0, TAU); }, toneSolid(inkLevel(1)), 4);
  crosshair(g, x, y, 29, 3);
  pen.paint(() => { g.arc(x, y, 8, 0, TAU); }, toneSolid(inkLevel(lit ? 7 : 3)), 3);
}
// a house in the street: light plane, hard contour, one roof chevron
function house(pen, g, x, base, w, h) {
  pen.paint(() => { g.rect(x - w / 2, base - h, w, h); }, toneSolid(inkLevel(1)), 4);
  pen.paint(() => {
    g.moveTo(x - w * .62, base - h); g.lineTo(x, base - h - w * .34);
    g.lineTo(x + w * .62, base - h); g.closePath();
  }, toneSolid(inkLevel(2)), 3.5);
  pen.paint(() => { g.rect(x - w * .16, base - h * .58, w * .32, h * .58); }, toneSolid(inkLevel(4)), 3);
}

/* ---------- source / lane glyphs (geometry at ~44px+, never small type) ---------- */
function glyphLyre(pen, g, cx, cy, s) {                 // the bard's phorminx: box, arms, yoke
  pen.paint(() => { g.rect(cx - s * .26, cy + s * .06, s * .52, s * .40); }, toneSolid(inkLevel(2)), 4);
  for (const d of [-1, 1]) {                            // blocky arms: out, then up
    pen.ink(() => {
      g.moveTo(cx + d * s * .24, cy + s * .06);
      g.lineTo(cx + d * s * .46, cy - s * .18);
      g.lineTo(cx + d * s * .40, cy - s * .48);
    }, 6);
  }
  pen.ink(() => { g.moveTo(cx - s * .46, cy - s * .46); g.lineTo(cx + s * .46, cy - s * .46); }, 6);
  for (const d of [-1, 1]) {                            // two strings only — more would merge
    pen.ink(() => { g.moveTo(cx + d * s * .18, cy - s * .40); g.lineTo(cx + d * s * .18, cy + s * .06); }, 3);
  }
}
function glyphFeet(pen, g, cx, cy, s) {                 // a dance step: two legs, two feet, a stamp
  const hx = cx, hy = cy - s * .44;
  pen.paint(() => { g.rect(hx - s * .16, hy - s * .10, s * .32, s * .20); }, toneSolid(inkLevel(4)), 3.5);
  for (const d of [-1, 1]) {
    const fx = cx + d * s * .38, fy = cy + s * .30;
    pen.limb(() => { g.moveTo(hx + d * s * .09, hy + s * .08); g.lineTo(fx, fy); },
      toneSolid(inkLevel(d < 0 ? 4 : 2)), 9);
    pen.paint(() => { g.rect(fx - s * .06, fy - s * .04, d * s * .26, s * .12); },
      toneSolid(inkLevel(5)), 3.5);
  }
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";   // the stamp shock, floor-ward
  for (const d of [-1, 1]) {
    g.beginPath();
    g.moveTo(cx + d * s * .22, cy + s * .58); g.lineTo(cx + d * s * .50, cy + s * .50);
    g.stroke();
  }
}
function glyphCall(pen, g, cx, cy, s) {                 // a shout thrown outward
  pen.paint(() => {
    g.moveTo(cx - s * .44, cy - s * .22); g.lineTo(cx - s * .08, cy - s * .46);
    g.lineTo(cx - s * .08, cy + s * .46); g.lineTo(cx - s * .44, cy + s * .22);
    g.closePath();
  }, toneSolid(inkLevel(4)), 4.5);
  g.strokeStyle = INK; g.lineCap = "round";
  g.lineWidth = 6; g.beginPath(); g.arc(cx - s * .08, cy, s * .38, -0.80, 0.80); g.stroke();
  g.lineWidth = 4; g.beginPath(); g.arc(cx - s * .08, cy, s * .72, -0.80, 0.80); g.stroke();
}
function glyphRings(pen, g, cx, cy, lit) {              // two rings locked — a marriage
  for (const d of [-1, 1]) {
    g.strokeStyle = INK; g.lineWidth = lit ? 7 : 3.5;
    g.globalAlpha = lit ? 1 : 0.5;
    g.beginPath(); g.arc(cx + d * 15, cy, 19, 0, TAU); g.stroke();
    g.globalAlpha = 1;
  }
}

/* ---------- the diagram ---------- */
function drawDiagram(ctx, W, H, st) {
  const pen = makePen(ctx, { outline: true });
  const g = ctx;
  const P = params;

  const stopped = !!st.stopped;
  const intensity = stopped ? 0 : clamp(st.intensity ?? P.intensity, 0, 1);
  const phase = clamp(st.phase ?? P.phase, 0, 1);
  const tempo = clamp(st.tempo ?? P.tempo, 0, 1);
  const playing = intensity > 0.04;
  // how far past the wall the bed has got, 0 at the downbeat, 1 in the street
  const reach = st.reach !== undefined ? clamp(st.reach, 0, 1)
    : (playing ? clamp((phase - 0.28) / 0.46, 0, 1) : 0);
  const believed = st.believed !== undefined ? !!st.believed : reach > 0.92;

  /* ---- geometry ---- */
  const ex = W * P.emitter.x, ey = H * P.emitter.y;
  const wx = W * (P.wall.x0 + P.wall.x1) / 2;
  const gy0 = H * P.wall.gap0, gy1 = H * P.wall.gap1;
  const apX = W * P.wall.x1, apY = (gy0 + gy1) / 2;              // the aperture mouth
  const axisIn = Math.atan2(apY - ey, apX - ex);
  const spanIn = Math.hypot(apX - ex, apY - ey);
  const tgtX = W * 0.900, tgtY = H * 0.230;
  const axisOut = Math.atan2(tgtY - apY, tgtX - apX);
  const spanOut = Math.hypot(tgtX - apX, tgtY - apY) * 1.06;

  /* ---- HALL-SIDE WEDGE: the bed aimed at the gate, not at the room ---- */
  if (playing) {
    pen.paint(() => {
      g.moveTo(ex, ey);
      g.arc(ex, ey, spanIn * 0.98, axisIn - P.lobeIn, axisIn + P.lobeIn);
      g.closePath();
    }, toneSolid(inkLevel(1)), 0);
  }
  /* ---- STREET-SIDE FAN: what gets out, blooming wide ---- */
  if (playing && reach > 0.02) {
    pen.paint(() => {
      g.moveTo(apX, apY);
      g.arc(apX, apY, spanOut * clamp(reach, 0.12, 1), axisOut - P.lobeOut, axisOut + P.lobeOut);
      g.closePath();
    }, toneSolid(inkLevel(1)), 0);
  }

  /* ---- THE HALL: corner brackets + a broken floor seam ---- */
  const hx0 = W * P.hall.x0, hy0 = H * P.hall.y0, hx1 = W * P.hall.x1, hy1 = H * P.hall.y1;
  const bw = (hx1 - hx0) * 0.17, bh = (hy1 - hy0) * 0.22;
  bracket(g, hx0, hy0, bw, bh, 5);
  bracket(g, hx0, hy1, bw, -bh, 5);
  brokenLine(g, hx0 + bw * 0.5, hx1, hy1, 3, [[0, .22], [.32, .60], [.70, 1]]);

  /* ---- THE STREET: one bracket, a broken kerb, two houses ---- */
  const sx0 = W * P.street.x0, sy0 = H * P.street.y0, sx1 = W * P.street.x1, sy1 = H * P.street.y1;
  bracket(g, sx1, sy0, -(sx1 - sx0) * 0.20, (sy1 - sy0) * 0.20, 5);
  house(pen, g, W * 0.706, sy1, 52, 40);
  house(pen, g, W * 0.922, sy1, 44, 34);
  brokenLine(g, sx0, sx1, sy1, 3, [[0, .26], [.36, .62], [.72, 1]]);

  /* ---- THE PALACE WALL in section: courses, broken at the gate ---- */
  const wx0 = W * P.wall.x0, wx1 = W * P.wall.x1;
  const courses = (y0, y1) => {
    const n = Math.max(1, Math.round((y1 - y0) / 26));
    const step = (y1 - y0) / n;
    for (let i = 0; i < n; i++) {
      const inset = (i % 2) * 4;
      pen.paint(() => { g.rect(wx0 + inset, y0 + i * step, (wx1 - wx0) - inset * 2, step); },
        toneSolid(inkLevel(i % 2 ? 2 : 1)), 3.5);
    }
  };
  courses(H * P.wall.y0 + 14, gy0);
  courses(gy1, H * P.wall.y1 - 10);
  // the gate itself: lintel + sill, and the jambs the sound is squeezed through
  jambH(g, wx, gy0, (wx1 - wx0) * 0.86, 6);
  jambH(g, wx, gy1, (wx1 - wx0) * 0.86, 6);
  jambV(g, wx0 - 2, (gy0 + gy1) / 2, (gy1 - gy0) * 0.5, 4);

  /* ---- GAIN: two chevrons in the gate — the bed is pushed, not leaking ---- */
  if (playing) {
    g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "butt"; g.lineJoin = "miter";
    for (let i = 0; i < 2; i++) {
      const cx0 = wx - 12 + i * 15;
      g.beginPath();
      g.moveTo(cx0, apY - 20); g.lineTo(cx0 + 13, apY); g.lineTo(cx0, apY + 20);
      g.stroke();
    }
  }

  /* ---- WHAT THE NOISE COVERS: aftermath stubs under a dashed hood ---- */
  {
    const cy = H * P.cover.y, cx = W * P.cover.x;
    for (let i = 0; i < P.cover.n; i++) {
      const bx = cx + (i - 1) * 40;
      pen.paint(() => { g.rect(bx - 15, cy - 9, 30, 9); }, toneSolid(inkLevel(5)), 2.5);
    }
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = playing ? 0.85 : 0.32;
    g.setLineDash([9, 8]);
    g.beginPath(); g.arc(cx, cy - 6, 58, Math.PI * 1.06, Math.PI * 1.94); g.stroke();
    g.restore();
    if (playing) {   // the bed reaches down over it
      g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.55; g.setLineDash([7, 9]);
      g.beginPath(); g.moveTo(ex - 24, ey + 26); g.lineTo(cx + 22, cy - 68); g.stroke(); g.restore();
    }
  }

  /* ---- SOURCE GLYPHS tethered to the emitter ---- */
  const SRC = [
    ["lyre", glyphLyre], ["feet", glyphFeet], ["calls", glyphCall],
  ];
  for (const [key, draw] of SRC) {
    const gx = W * P.sources[key].x, gy = H * P.sources[key].y;
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.45;
    g.beginPath(); g.moveTo(ex, ey); g.lineTo(gx, gy); g.stroke(); g.restore();
    pen.paint(() => { g.arc(gx, gy, 50, 0, TAU); }, toneSolid(inkLevel(1)), 3.5);
    draw(pen, g, gx, gy, 54);
  }

  /* ---- HALL-SIDE WAVEFRONTS ---- */
  for (let i = 0; i < P.inFronts.length; i++) {
    const f = P.inFronts[i];
    g.save();
    if (playing) {
      g.strokeStyle = INK; g.lineWidth = clamp(6 - i * 1.1, 2.5, 6) * (0.5 + 0.5 * intensity);
    } else { g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = 0.22; g.setLineDash([9, 11]); }
    g.beginPath(); g.arc(ex, ey, spanIn * f, axisIn - P.lobeIn, axisIn + P.lobeIn); g.stroke();
    g.restore();
  }

  /* ---- EMITTER MARKER ---- */
  if (playing) {                                   // impulse star, sized by loudness
    g.strokeStyle = INK; g.lineCap = "round";
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU + 0.13, long = i % 2 === 0;
      const r0 = 20, r1 = 20 + (long ? 34 : 20) * (0.4 + 0.6 * intensity);
      g.lineWidth = long ? 4 : 2.5;
      g.beginPath(); g.moveTo(ex + Math.cos(a) * r0, ey + Math.sin(a) * r0);
      g.lineTo(ex + Math.cos(a) * r1, ey + Math.sin(a) * r1); g.stroke();
    }
  }
  pen.paint(() => { g.arc(ex, ey, 19, 0, TAU); }, toneSolid(inkLevel(1)), 4);
  crosshair(g, ex, ey, 31, 3);
  pen.paint(() => { g.arc(ex, ey, 8, 0, TAU); }, toneSolid(inkLevel(playing ? 7 : 3)), 3);

  /* ---- STREET-SIDE WAVEFRONTS + leading edge ---- */
  for (let i = 0; i < P.outFronts.length; i++) {
    const f = P.outFronts[i];
    const lit = playing && reach >= f * 0.94;
    g.save();
    if (lit) {
      g.strokeStyle = INK; g.lineWidth = clamp(5.5 - i * 0.6, 2.5, 5.5);
      g.globalAlpha = clamp(1 - (reach - f) * 0.75, 0.32, 1);
    } else {
      g.strokeStyle = INK; g.lineWidth = 2.5;
      g.globalAlpha = playing ? 0.30 : 0.18; g.setLineDash([9, 12]);
    }
    g.beginPath(); g.arc(apX, apY, spanOut * f, axisOut - P.lobeOut, axisOut + P.lobeOut); g.stroke();
    g.restore();
  }
  if (playing && reach > 0.04) {
    const r = spanOut * clamp(reach, 0.10, 0.70);
    g.save(); g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = "round";
    g.beginPath(); g.arc(apX, apY, r, axisOut - P.lobeOut * 0.5, axisOut + P.lobeOut * 0.5); g.stroke();
    g.restore();
  }

  /* ---- THE PASSERS-BY: rosettes turning back toward the wall ---- */
  for (const rc of P.receivers) {
    const rx = W * rc.x, ry = H * rc.y;
    rosette(pen, g, rx, ry, Math.atan2(apY - ry, apX - rx), believed);
  }

  /* ---- REACH PROFILE: level against distance, still over the threshold ---- */
  {
    const px0 = W * P.profile.x0, px1 = W * P.profile.x1;
    const pB = H * P.profile.base, pH = H * P.profile.h;
    const n = P.profile.bins, step = (px1 - px0) / (n - 1);
    brokenLine(g, px0 - 16, px1 + 16, pB, 3);
    // the threshold the town has to clear to hear a wedding at all
    const thrY = pB - pH * P.profile.thr;
    g.save(); g.strokeStyle = INK; g.lineWidth = 3.5; g.setLineDash([13, 9]);
    g.beginPath(); g.moveTo(px0 - 14, thrY); g.lineTo(px1 + 14, thrY); g.stroke(); g.restore();
    jambV(g, px0 - 14, thrY, 9, 4); jambV(g, px1 + 14, thrY, 9, 4);
    // bars: light planes with a heavy cap, so the meter reads without going black
    const shape = [1.00, 0.94, 0.88, 0.83, 0.79, 0.62, 0.58, 0.53, 0.48, 0.44, 0.40, 0.36];
    for (let i = 0; i < n; i++) {
      const bx = px0 + i * step;
      const h = pH * shape[i] * (0.20 + 0.80 * intensity) * (0.72 + 0.28 * reach);
      if (h < 6) continue;
      const over = pB - h < thrY;
      pen.paint(() => { g.rect(bx - 8, pB - h, 16, h); }, toneSolid(inkLevel(1)), 3);
      g.fillStyle = inkLevel(over ? (i > P.profile.wallBin ? 7 : 5) : 2);
      g.fillRect(bx - 8, pB - h, 16, 11);
      g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(bx - 8, pB - h, 16, 11);
    }
    // the wall, standing in the middle of the profile
    const jx = px0 + P.profile.wallBin * step;
    g.save(); g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = "butt";
    g.beginPath(); g.moveTo(jx, pB + 9); g.lineTo(jx, pB - pH * 1.02); g.stroke(); g.restore();
    // the threshold again, over the bars: the line the town has to be able to hear
    g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.setLineDash([13, 9]);
    g.beginPath(); g.moveTo(px0 - 14, thrY); g.lineTo(px1 + 14, thrY); g.stroke(); g.restore();
    // marker: the far bar that still clears the line
    const lastX = px0 + (n - 1) * step;
    const lastH = pH * shape[n - 1] * (0.20 + 0.80 * intensity) * (0.72 + 0.28 * reach);
    pen.paint(() => {
      g.moveTo(lastX, pB - lastH - 34); g.lineTo(lastX - 13, pB - lastH - 12);
      g.lineTo(lastX + 13, pB - lastH - 12); g.closePath();
    }, toneSolid(believed ? inkLevel(7) : inkLevel(2)), 2.5);
  }

  /* ---- DECEPTION READOUT: slaughter -> wedding, latched by the street ---- */
  {
    const px0 = W * P.panel.x0, py0 = H * P.panel.y0, px1 = W * P.panel.x1, py1 = H * P.panel.y1;
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.66; g.setLineDash([11, 10]);
    g.beginPath(); g.moveTo(W * P.receivers[1].x, H * P.receivers[1].y + 62);
    g.lineTo(px0 + 60, py0 - 10); g.stroke(); g.restore();

    pen.paint(() => { g.rect(px0, py0, px1 - px0, py1 - py0); }, toneSolid(inkLevel(1)), 5);
    const cw = (px1 - px0) * 0.34, ccy = (py0 + py1) / 2, ph = py1 - py0;
    // cell A — what is: three stubs lying flat, dimming as the story is replaced
    const aX = px0 + (px1 - px0) * 0.22;
    pen.paint(() => { g.rect(aX - cw / 2, py0 + ph * .18, cw, ph * .64); }, toneSolid(inkLevel(0)), 3);
    for (let i = 0; i < 3; i++) {
      const sy = ccy - 18 + i * 18;
      g.fillStyle = inkLevel(believed ? 2 : 5);
      g.fillRect(aX - cw * .30, sy - 4, cw * .60, 8);
    }
    // the swap
    g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt";
    const a0 = aX + cw * 0.68, a1 = px0 + (px1 - px0) * 0.56;
    g.beginPath(); g.moveTo(a0, ccy); g.lineTo(a1, ccy); g.stroke();
    pen.paint(() => { g.moveTo(a1 + 14, ccy); g.lineTo(a1 - 3, ccy - 9); g.lineTo(a1 - 3, ccy + 9); g.closePath(); },
      toneSolid(inkLevel(7)), 2);
    // cell B — what the street says: two rings locked
    const bX = px0 + (px1 - px0) * 0.78;
    pen.paint(() => { g.rect(bX - cw / 2, py0 + ph * .18, cw, ph * .64); },
      toneSolid(believed ? inkLevel(2) : inkLevel(0)), 3);
    glyphRings(pen, g, bX, ccy, believed);
  }

  /* ---- ENVELOPE: cue, then a held plateau — this bed does not decay ---- */
  const ex0 = W * P.env.x0, ex1 = W * P.env.x1, eB = H * P.env.base, eH = H * P.env.h;
  brokenLine(g, ex0 - 14, ex1 + 14, eB, 3);
  const cue = P.env.cue;
  const ripple = 8 + tempo * 26;
  const yAt = (u) => {
    const bed = eB - eH * 0.05;                                  // a hall holding its breath
    if (!playing) return bed;
    if (u < cue - 0.015) return bed;
    if (u < cue) return lerp(bed, eB - eH * intensity, (u - (cue - 0.015)) / 0.015);
    const hold = eB - eH * intensity * (0.90 + 0.10 * Math.sin((u - cue) * ripple));
    return hold;                                                  // held, and held, and held
  };
  g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.lineJoin = "round"; g.lineCap = "round";
  g.beginPath();
  for (let i = 0; i <= 180; i++) {
    const u = i / 180, x = lerp(ex0, ex1, u), y = yAt(u);
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke(); g.restore();

  /* ---- TIME CURSOR through envelope + all three lanes ---- */
  const uc = clamp(lerp(0.08, 0.95, phase), 0.08, 0.95);
  const curX = lerp(ex0, ex1, uc), curTop = H * 0.650;
  g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt"; g.setLineDash([9, 9]);
  g.beginPath(); g.moveTo(curX, curTop); g.lineTo(curX, H * P.lanes.calls + 10); g.stroke();
  g.restore();
  g.fillStyle = ACCENT; g.fillRect(curX - 8, curTop - 17, 16, 16);
  g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(curX - 8, curTop - 17, 16, 16);

  /* ---- RHYTHM LANES ---- */
  const lx0 = W * P.lanes.x0, lx1 = W * P.lanes.x1, n = P.lanes.n;
  const step = (lx1 - lx0) / (n - 1);
  const curIdx = uc * n;
  const cueIdx = cue * n;
  const block = (bx, base, h, lvl, w) => {
    g.fillStyle = inkLevel(lvl); g.fillRect(bx - w / 2, base - h, w, h);
    g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(bx - w / 2, base - h, w, h);
  };
  // LANE 1 · LYRE — strummed figures, uneven
  {
    const B = H * P.lanes.lyre;
    glyphLyre(pen, g, W * 0.082, B - 32, 50);
    brokenLine(g, lx0 - 12, lx1 + 12, B, 3);
    const pat = [3, 1, 2, 0, 3, 2, 1, 0, 3, 1, 2, 1, 0, 3, 2, 1, 0, 3, 1, 2, 0, 3, 2, 1, 0, 3];
    for (let i = 0; i < n; i++) {
      if (!playing || i < cueIdx || i > curIdx + 0.5) continue;
      const a = pat[i]; if (!a) continue;
      block(lx0 + i * step, B, 12 + a * 11, a >= 3 ? 5 : a >= 2 ? 4 : 3, a >= 3 ? 11 : 8);
    }
  }
  // LANE 2 · FEET — the beat itself: regular, heavy, the part that carries
  {
    const B = H * P.lanes.feet;
    glyphFeet(pen, g, W * 0.082, B - 32, 48);
    brokenLine(g, lx0 - 12, lx1 + 12, B, 3);
    const every = tempo > 0.6 ? 2 : 3;
    for (let i = 0; i < n; i++) {
      if (!playing || i < cueIdx || i > curIdx + 0.5) continue;
      if ((i - Math.ceil(cueIdx)) % every) continue;
      const down = ((i - Math.ceil(cueIdx)) / every) % 2 === 0;
      block(lx0 + i * step, B, down ? 46 : 27, down ? 7 : 4, down ? 13 : 9);
    }
  }
  // LANE 3 · CALLS — festive shouts, thrown, irregular
  {
    const B = H * P.lanes.calls;
    glyphCall(pen, g, W * 0.086, B - 30, 48);
    brokenLine(g, lx0 - 12, lx1 + 12, B, 3);
    const at = [7, 11, 12, 17, 21, 22, 25];
    for (const i of at) {
      if (!playing || i < cueIdx || i > curIdx + 0.5) continue;
      block(lx0 + i * step, B, 30 + (i % 3) * 14, 6, 10);
    }
  }
}

export const asset = {
  id: "sound_source.false-wedding-music",
  type: "SOUND_SOURCE",
  name: "False wedding music",
  statusWord: "CARRYING",
  scene: "OD-B23-S03",

  params,
  // back -> front draw order the diagram honors
  layers: ["wedges", "hall", "street", "wall", "gate-gain", "cover", "tethers", "source-glyphs",
           "wavefronts-in", "emitter", "wavefronts-out", "receivers",
           "reach-profile", "readout", "envelope", "cursor", "lyre-lane", "feet-lane", "calls-lane"],
  // normalized 0..1 emitter / gate / receiver / readout stations
  anchors: {
    "emitter:position":  { x: 0.290, y: 0.250 },
    "source:lyre":       { x: 0.165, y: 0.152 },
    "source:feet":       { x: 0.098, y: 0.262 },
    "source:calls":      { x: 0.400, y: 0.352 },
    "cover:aftermath":   { x: 0.190, y: 0.396 },
    "wall:section":      { x: 0.584, y: 0.251 },
    "aperture:gate":     { x: 0.606, y: 0.215 },
    "receiver:street-n": { x: 0.888, y: 0.142 },
    "receiver:street-s": { x: 0.852, y: 0.312 },
    "threshold:town":    { x: 0.312, y: 0.584 },
    "state:before":      { x: 0.658, y: 0.540 },
    "state:after":       { x: 0.863, y: 0.540 },
    "cut:downbeat":      { x: 0.280, y: 0.860 },
    "camera:diagram":    { x: 0.500, y: 0.500 },
  },
  // relation to visible action: the bed is aimed at the gate and read in the street
  zones: {
    hall:    { x0: .062, y0: .082, x1: .560, y1: .420 },
    wall:    { x0: .562, y0: .082, x1: .606, y1: .420 },
    street:  { x0: .618, y0: .082, x1: .952, y1: .420 },
    profile: { x0: .080, y0: .456, x1: .545, y1: .636 },
    readout: { x0: .588, y0: .466, x1: .936, y1: .614 },
    rhythm:  { x0: .060, y0: .650, x1: .890, y1: .944 },
  },
  states: {
    initial: "silent",
    nodes: {
      silent:   { preview: { intensity: 0.00, phase: 0.05, tempo: 0.00, reach: 0.00, believed: false, stopped: true,  status: "SILENT",   progress: 0.02 } },
      cue:      { preview: { intensity: 0.45, phase: 0.24, tempo: 0.50, reach: 0.04, believed: false, stopped: false, status: "CUE",      progress: 0.30 } },
      playing:  { preview: { intensity: 1.00, phase: 0.40, tempo: 0.74, reach: 0.28, believed: false, stopped: false, status: "PLAYING",  progress: 0.70 } },
      carrying: { preview: { intensity: 1.00, phase: 0.66, tempo: 0.78, reach: 0.82, believed: false, stopped: false, status: "CARRYING", progress: 0.86 } },
      believed: { preview: { intensity: 0.96, phase: 0.86, tempo: 0.74, reach: 1.00, believed: true,  stopped: false, status: "BELIEVED", progress: 1.00 } },
      stopped:  { preview: { intensity: 0.00, phase: 0.97, tempo: 0.00, reach: 0.00, believed: true,  stopped: true,  status: "STOPPED",  progress: 0.04 } },
    },
    edges: [
      ["silent", "cue"], ["cue", "playing"], ["playing", "carrying"],
      ["carrying", "believed"], ["believed", "stopped"], ["stopped", "silent"],
      ["playing", "stopped"], ["carrying", "playing"],
    ],
  },
  channels: ["intensity", "tempo", "phase", "reach", "belief"],

  preview: () => ({ intensity: 1.00, phase: 0.72, tempo: 0.78, reach: 0.96, believed: true, stopped: false, status: "CARRYING", progress: 0.92 }),
  draw(ctx, W, H, state) { drawDiagram(ctx, W, H, state); return { anchors: asset.anchors, zones: asset.zones }; },
};
export default asset;
