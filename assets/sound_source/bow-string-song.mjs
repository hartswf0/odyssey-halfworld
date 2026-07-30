/* sound_source.bow-string-song — Odysseus tries the great bow's string with his
   thumb and it sings out one clear high note, "like the voice of a swallow";
   the hall hears it and understands, in that instant, that the contest is over
   and something else has begun.
   SOUND_SOURCE asset. An ADDRESSABLE DIEGETIC EMITTER drawn as a legible
   emitter DIAGRAM, not an illustration: a BOW-AND-STRING elevation at the left
   with the string in its fundamental mode (bold lobe + mirrored dashed lobe +
   a faint vibration lens between them), an EMISSION WEDGE and wavefront arcs
   carrying the note across the room to a LISTENING rosette, a PITCH LADDER +
   HARMONIC COMB that says "one partial, high, and nothing else", a STATE-CHANGE
   readout that latches when the note is recognized, an ENVELOPE trace (hall bed
   -> hard pluck -> long clear ring) and two RHYTHM lanes: TEST, the sparse taps
   of a man checking a weapon, and NOTE, one attack plus a decaying sustain.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B21-S07): a single clear high note synchronized to the
   string test and read by everyone present as a state change. Driven by
   { intensity, phase, strung, recognized, hush } so the runtime can arm the
   string, fire the note on the exact frame of the thumb-pull, walk it across
   the hall, and latch the recognition.
   States: slack / strung / pluck / singing / recognized / silent.
   Atlas: addressable emitter — position, intensity, rhythm, start/stop,
   relation to visible action. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;

const params = {
  // --- the emitter body: bow held vertical, string as a chord ---
  string:   { x:0.278, y0:0.105, y1:0.395 },  // the taut chord (rest position)
  belly:    -0.200,                            // stave control offset, in W, away from the string
  antinode: 0.55,                              // where the fundamental peaks along the chord
  amp:      0.040,                             // antinode displacement in W at intensity 1
  // --- where the note goes ---
  receiver: { x:0.845, y:0.198 },              // the hall / the listening suitors
  fronts:   [0.22, 0.36, 0.50, 0.78, 0.92],    // wavefront arcs (gap left for the leading edge)
  lobeHalf: 0.34,                              // half-angle of the emission wedge (rad)
  // --- readouts ---
  ladder:   { x:0.078, y0:0.462, y1:0.606, rungs:6, note:5 },   // pitch: marker high
  comb:     { x0:0.150, x1:0.545, base:0.606, bins:16, note:12, h:0.128 },
  panel:    { x0:0.585, y0:0.470, x1:0.930, y1:0.602 },
  // --- the clock ---
  env:      { x0:0.115, x1:0.885, base:0.735, h:0.096, attack:0.30 },
  test:     { base:0.845, n:26, taps:[1, 4, 7, 10] },
  note:     { base:0.930, n:26, at:12, ring:10 },
  intensity:1.00,
  phase:    0.62,
};

/* ---------- small helpers ---------- */
// a span drawn as separate segments so nothing stripes the frame edge to edge
function brokenLine(g, x0, x1, y, lw, cuts = [[0, .30], [.37, .66], [.73, 1]]) {
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
function jamb(g, x, y, h, lw) {
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap = "butt";
  g.beginPath(); g.moveTo(x, y - h); g.lineTo(x, y + h); g.stroke();
}
/* a bench in plan: light plane, hard contour, one slat — relation to visible action */
function bench(pen, g, x, y, w, h) {
  pen.paint(() => { g.rect(x - w / 2, y, w, h); }, toneSolid(inkLevel(1)), 4);
  pen.ink(() => { g.moveTo(x - w * .30, y + h * .34); g.lineTo(x + w * .30, y + h * .34); }, 2);
}

/* ---------- lane head glyphs (geometry at ~40px, never small type) ---------- */
// the swallow: Homer's simile for the timbre, and the NOTE lane's head
function glyphSwallow(pen, g, cx, cy, s) {
  pen.paint(() => {
    g.moveTo(cx + s * .58, cy);
    g.lineTo(cx + s * .06, cy - s * .19);
    g.lineTo(cx - s * .10, cy - s * .64);
    g.lineTo(cx - s * .36, cy - s * .58);
    g.lineTo(cx - s * .26, cy - s * .17);
    g.lineTo(cx - s * .64, cy - s * .36);
    g.lineTo(cx - s * .44, cy);
    g.lineTo(cx - s * .64, cy + s * .36);
    g.lineTo(cx - s * .26, cy + s * .17);
    g.lineTo(cx - s * .36, cy + s * .58);
    g.lineTo(cx - s * .10, cy + s * .64);
    g.lineTo(cx + s * .06, cy + s * .19);
    g.closePath();
  }, toneSolid(inkLevel(5)), 3.5);
  g.fillStyle = inkLevel(7); g.beginPath(); g.arc(cx + s * .34, cy - s * .04, s * .07, 0, TAU); g.fill();
}
// a hand turning the stave over: the TEST lane's head
function glyphTurn(pen, g, cx, cy, s) {
  g.strokeStyle = INK; g.lineWidth = 4.5; g.lineCap = "butt";
  g.beginPath(); g.arc(cx, cy, s * .42, -2.2, 1.5); g.stroke();
  pen.paint(() => {                                    // arrowhead closing the turn
    g.moveTo(cx + s * .42 * Math.cos(-2.2) - 2, cy + s * .42 * Math.sin(-2.2) - 4);
    g.lineTo(cx + s * .18, cy - s * .58);
    g.lineTo(cx + s * .04, cy - s * .18);
    g.closePath();
  }, toneSolid(inkLevel(7)), 2.5);
  pen.paint(() => { g.rect(cx - s * .12, cy - s * .10, s * .24, s * .20); }, toneSolid(inkLevel(3)), 3);
}

/* ---------- the diagram ---------- */
function drawDiagram(ctx, W, H, st) {
  const pen = makePen(ctx, { outline: true });
  const g = ctx;
  const P = params;

  const intensity = clamp(st.intensity ?? P.intensity, 0, 1);
  const phase = clamp(st.phase ?? P.phase, 0, 1);
  const strung = st.strung === undefined ? true : !!st.strung;
  const recognized = !!st.recognized;
  const hush = st.hush === undefined ? intensity > 0.05 : !!st.hush;
  const sounding = strung && intensity > 0.02;

  // geometry of the string
  const sx = W * P.string.x, sy0 = H * P.string.y0, sy1 = H * P.string.y1;
  const chord = sy1 - sy0;
  const anti = P.antinode;
  const A = W * P.amp * intensity * (strung ? 1 : 0);
  const ax = sx + A * 0.62, ay = lerp(sy0, sy1, anti);   // the sounding point
  const rx = W * P.receiver.x, ry = H * P.receiver.y;
  const dx = rx - ax, dy = ry - ay;
  const span = Math.hypot(dx, dy), axis = Math.atan2(dy, dx);
  // how far the note has crossed the room: 0 at the pluck, 1 at the ear
  const cross = sounding ? clamp((phase - 0.28) / 0.55, 0, 1) : 0;
  const arrived = cross > 0.84;

  /* ---- EMISSION WEDGE: faint sector of room the note fills ---- */
  if (sounding) {
    g.save();
    pen.paint(() => {
      g.moveTo(ax, ay);
      g.arc(ax, ay, span * 0.90, axis - P.lobeHalf, axis + P.lobeHalf);
      g.closePath();
    }, toneSolid(inkLevel(1)), 0);
    g.restore();
  }

  /* ---- ROOM: two corner brackets on the far side + a broken floor seam ---- */
  const hx0 = W * 0.062, hy0 = H * 0.072, hx1 = W * 0.948, hy1 = H * 0.418;
  const bw = (hx1 - hx0) * 0.13, bh = (hy1 - hy0) * 0.24;
  bracket(g, hx1, hy0, -bw, bh, 5);
  bracket(g, hx1, hy1, -bw, -bh, 5);
  bracket(g, hx0, hy0, bw, bh, 5);
  brokenLine(g, hx0 + bw * 0.4, hx1 - bw * 0.4, hy1, 3, [[0, .19], [.30, .58], [.70, 1]]);

  /* ---- benches: the man with the bow, the hall that listens ---- */
  bench(pen, g, W * 0.098, H * 0.418 - 20, 84, 20);   // the stool he tries it from
  bench(pen, g, rx - 6, ry + H * 0.090, 80, 22);       // the bench that hears it

  /* ---- THE BOW: recurved stave in two limbs with a grip gap, hard nocks ---- */
  const cbx = sx + W * P.belly;
  const qpt = (t) => {                       // cubic: straight-ish tips, deep belly
    const m = 1 - t, a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
    return [a * sx + b * cbx + c * cbx + d * sx,
            a * sy0 + b * (sy0 + chord * 0.16) + c * (sy1 - chord * 0.16) + d * sy1];
  };
  const limbPath = (t0, t1) => () => {
    for (let i = 0; i <= 18; i++) {
      const [px, py] = qpt(lerp(t0, t1, i / 18));
      if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
  };
  pen.limb(limbPath(0.02, 0.40), toneSolid(inkLevel(2)), 12);
  pen.limb(limbPath(0.60, 0.98), toneSolid(inkLevel(2)), 12);
  const [gx, gy] = qpt(0.5);
  pen.paint(() => { g.rect(gx - 14, gy - 32, 28, 64); }, toneSolid(inkLevel(3)), 4.5);
  pen.ink(() => { g.moveTo(gx - 9, gy - 16); g.lineTo(gx + 9, gy - 16); }, 2.5);
  pen.ink(() => { g.moveTo(gx - 9, gy + 16); g.lineTo(gx + 9, gy + 16); }, 2.5);
  for (const ty of [sy0, sy1]) {   // nocks: the string's fixed nodes
    pen.paint(() => { g.arc(sx, ty, 9, 0, TAU); }, toneSolid(inkLevel(7)), 3);
    g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt";
    g.beginPath(); g.moveTo(sx - 20, ty); g.lineTo(sx + 20, ty); g.stroke();
  }

  /* ---- THE STRING in its fundamental mode ---- */
  const lobe = (sign, k) => () => {                 // half-sine displaced off the chord
    for (let i = 0; i <= 40; i++) {
      const u = i / 40, py = lerp(sy0, sy1, u);
      const shape = Math.sin(Math.PI * Math.pow(u, Math.log(0.5) / Math.log(anti)));
      const px = sx + sign * A * k * shape;
      if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
  };
  if (A > 1) {
    // the vibration lens: everything the string sweeps through, in the lightest ink
    pen.paint(() => {
      for (let i = 0; i <= 40; i++) {
        const u = i / 40, py = lerp(sy0, sy1, u);
        const shape = Math.sin(Math.PI * Math.pow(u, Math.log(0.5) / Math.log(anti)));
        const px = sx + A * shape;
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      for (let i = 40; i >= 0; i--) {
        const u = i / 40, py = lerp(sy0, sy1, u);
        const shape = Math.sin(Math.PI * Math.pow(u, Math.log(0.5) / Math.log(anti)));
        g.lineTo(sx - A * shape, py);
      }
      g.closePath();
    }, toneSolid(inkLevel(1)), 0);
    // the mirrored half of the swing, dashed
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = 0.55; g.setLineDash([9, 9]);
    g.beginPath(); lobe(-1, 1)(); g.stroke(); g.restore();
    // the chord it left, dotted
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.40; g.setLineDash([4, 9]);
    g.beginPath(); g.moveTo(sx, sy0); g.lineTo(sx, sy1); g.stroke(); g.restore();
  }
  g.save();
  g.strokeStyle = strung ? INK : inkLevel(3);
  g.lineWidth = strung ? 5 : 2.5; g.lineCap = "round";
  if (!strung) g.setLineDash([12, 12]);
  g.beginPath(); lobe(1, 1)(); g.stroke();
  g.restore();

  /* ---- the thumb that pulled it, and the sounding point ---- */
  if (strung) {
    const tx = sx + A * 0.98 + 20;
    g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
    g.beginPath(); g.moveTo(tx, ay - 15); g.lineTo(tx, ay + 15); g.stroke();
    g.beginPath(); g.moveTo(tx + 13, ay - 9); g.lineTo(tx + 13, ay + 9); g.stroke();
  }
  if (sounding) {                                    // impulse star at the sounding point
    g.strokeStyle = INK; g.lineCap = "round";
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU + 0.11, long = i % 2 === 0;
      const r0 = 21, r1 = 21 + (long ? 44 : 25) * (0.4 + 0.6 * intensity);
      g.lineWidth = long ? 4 : 2.5;
      g.beginPath(); g.moveTo(ax + Math.cos(a) * r0, ay + Math.sin(a) * r0);
      g.lineTo(ax + Math.cos(a) * r1, ay + Math.sin(a) * r1); g.stroke();
    }
  }
  pen.paint(() => { g.arc(ax, ay, 20, 0, TAU); }, toneSolid(inkLevel(1)), 4);
  crosshair(g, ax, ay, 32, 3);
  pen.paint(() => { g.arc(ax, ay, 9, 0, TAU); }, toneSolid(inkLevel(sounding ? 7 : 3)), 3);

  /* ---- WAVEFRONTS crossing the hall ---- */
  for (let i = 0; i < P.fronts.length; i++) {
    const f = P.fronts[i], r = span * f;
    const lit = sounding && cross >= f * 0.94;
    g.save();
    if (lit) {
      const fade = clamp(1 - (cross - f) * 1.15, 0.26, 1);   // passed fronts thin out
      g.strokeStyle = INK; g.lineWidth = clamp(6 - i * 0.7, 2.5, 6) * (0.42 + 0.58 * fade);
      g.globalAlpha = fade;
    } else {
      g.strokeStyle = INK; g.lineWidth = 2.5;
      g.globalAlpha = sounding ? 0.34 : 0.20; g.setLineDash([10, 12]);
    }
    g.beginPath(); g.arc(ax, ay, r, axis - P.lobeHalf, axis + P.lobeHalf); g.stroke();
    g.restore();
  }
  if (sounding && cross > 0.03) {                    // the leading edge + its arrowhead
    const r = span * clamp(cross, 0.08, 0.64);
    g.save(); g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = "round";
    g.beginPath(); g.arc(ax, ay, r, axis - P.lobeHalf * 0.55, axis + P.lobeHalf * 0.55); g.stroke();
    g.restore();
    const hx = ax + Math.cos(axis) * (r + 16), hy = ay + Math.sin(axis) * (r + 16);
    g.save(); g.translate(hx, hy); g.rotate(axis);
    pen.paint(() => { g.moveTo(14, 0); g.lineTo(-11, -10); g.lineTo(-11, 10); g.closePath(); },
      toneSolid(inkLevel(7)), 3);
    g.restore();
  }

  /* ---- LISTENER: a rosette opening back down the axis; heavy once it lands ---- */
  const back = axis + Math.PI;
  for (let k = 0; k < 3; k++) {
    g.save();
    g.strokeStyle = INK; g.lineWidth = arrived ? clamp(6 - k * 1.2, 3, 6) : 2.5;
    g.globalAlpha = arrived ? clamp(0.95 - k * 0.15, 0.42, 1) : 0.32;
    if (!arrived) g.setLineDash([10, 11]);
    g.beginPath(); g.arc(rx, ry, 32 + k * 20, back - 0.66, back + 0.66); g.stroke();
    g.restore();
  }
  pen.paint(() => { g.arc(rx, ry, 21, 0, TAU); }, toneSolid(inkLevel(1)), 4);
  crosshair(g, rx, ry, 32, 3.5);
  pen.paint(() => { g.arc(rx, ry, 9, 0, TAU); }, toneSolid(inkLevel(arrived ? 7 : 3)), 3);
  if (recognized) {   // attention locks: two heavy ticks across the listening axis
    g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "butt";
    for (const s of [-1, 1]) {
      const a = back + s * 1.48;
      g.beginPath();
      g.moveTo(rx + Math.cos(a) * 36, ry + Math.sin(a) * 36);
      g.lineTo(rx + Math.cos(a) * 62, ry + Math.sin(a) * 62);
      g.stroke();
    }
  }

  /* ---- PITCH LADDER: rungs low..high, the marker riding near the top ---- */
  const Lx = W * P.ladder.x, Ly0 = H * P.ladder.y0, Ly1 = H * P.ladder.y1;
  g.save(); g.strokeStyle = INK; g.lineWidth = 3.5; g.lineCap = "butt"; g.setLineDash([15, 11]);
  g.beginPath(); g.moveTo(Lx, Ly0); g.lineTo(Lx, Ly1); g.stroke(); g.restore();
  for (let i = 0; i < P.ladder.rungs; i++) {
    const ry_ = lerp(Ly1, Ly0, i / (P.ladder.rungs - 1));
    const wdt = 14 + i * 4;
    g.strokeStyle = INK; g.lineWidth = i === P.ladder.note ? 5 : 3; g.lineCap = "butt";
    g.beginPath(); g.moveTo(Lx - wdt, ry_); g.lineTo(Lx + wdt, ry_); g.stroke();
  }
  const noteY = lerp(Ly1, Ly0, P.ladder.note / (P.ladder.rungs - 1));
  pen.paint(() => {
    g.moveTo(Lx + 36, noteY); g.lineTo(Lx + 58, noteY - 14);
    g.lineTo(Lx + 58, noteY + 14); g.closePath();
  }, toneSolid(inkLevel(sounding ? 7 : 2)), 3);

  /* ---- HARMONIC COMB: one partial standing alone = a single clear note ---- */
  const cx0 = W * P.comb.x0, cx1 = W * P.comb.x1, cB = H * P.comb.base;
  const bins = P.comb.bins, bstep = (cx1 - cx0) / (bins - 1);
  brokenLine(g, cx0 - 14, cx1 + 14, cB, 3, [[0, .27], [.35, .63], [.71, 1]]);
  for (const u of [0, 0.5, 1]) jamb(g, lerp(cx0, cx1, u), cB, 10, 3.5);
  const floor = [3, 5, 3, 4, 6, 3, 5, 4, 3, 6, 4, 3, 0, 7, 4, 3];
  for (let i = 0; i < bins; i++) {
    const bx = cx0 + i * bstep;
    if (i === P.comb.note) continue;
    const h = floor[i % floor.length] * 3.4 * (0.5 + 0.5 * intensity);
    if (h < 1.5) continue;
    g.fillStyle = inkLevel(4);
    g.fillRect(bx - 4.5, cB - h, 9, h);
  }
  const nh = H * P.comb.h * (0.24 + 0.76 * intensity) * (strung ? 1 : 0.18);
  const nx = cx0 + P.comb.note * bstep;
  pen.paint(() => { g.rect(nx - 8, cB - nh, 16, nh); }, toneSolid(sounding ? inkLevel(6) : inkLevel(2)), 3.5);
  if (sounding) {                                    // caret: this is the one
    pen.paint(() => {
      g.moveTo(nx, cB - nh - 38); g.lineTo(nx - 13, cB - nh - 15);
      g.lineTo(nx + 13, cB - nh - 15); g.closePath();
    }, toneSolid(inkLevel(7)), 2.5);
    // two whisper partials either side, so "clear" reads against something
    for (const d of [-1, 1]) {
      g.fillStyle = inkLevel(2);
      g.fillRect(nx + d * bstep - 3, cB - nh * 0.16, 6, nh * 0.16);
    }
  }

  /* ---- STATE-CHANGE READOUT: contest -> sign, latched on recognition ---- */
  const px0 = W * P.panel.x0, py0 = H * P.panel.y0, px1 = W * P.panel.x1, py1 = H * P.panel.y1;
  g.save(); g.strokeStyle = INK; g.lineWidth = 3.5; g.globalAlpha = 0.72; g.setLineDash([12, 10]);
  g.beginPath(); g.moveTo(rx, ry + H * 0.108); g.lineTo(px0 + 52, py0 - 8); g.stroke();
  g.restore();
  pen.paint(() => { g.rect(px0, py0, px1 - px0, py1 - py0); }, toneSolid(inkLevel(1)), 5);
  const cw = (px1 - px0) * 0.28, ccy = (py0 + py1) / 2, ph = py1 - py0;
  // cell A — the state that ends: a slack, broken bar (a game, a trial of strength)
  const aX = px0 + (px1 - px0) * 0.19;
  pen.paint(() => { g.rect(aX - cw / 2, py0 + ph * .17, cw, ph * .66); }, toneSolid(inkLevel(0)), 3);
  g.fillStyle = inkLevel(recognized ? 3 : 5);
  g.fillRect(aX - cw * .32, ccy - 5, cw * .26, 10);
  g.fillRect(aX + cw * .06, ccy - 5, cw * .26, 10);
  // the transition arrow
  g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt";
  const a0 = aX + cw * 0.70, a1 = px0 + (px1 - px0) * 0.56;
  g.beginPath(); g.moveTo(a0, ccy); g.lineTo(a1, ccy); g.stroke();
  pen.paint(() => { g.moveTo(a1 + 15, ccy); g.lineTo(a1 - 3, ccy - 9); g.lineTo(a1 - 3, ccy + 9); g.closePath(); },
    toneSolid(inkLevel(7)), 2);
  // cell B — the state that begins: an up-chevron struck through the frame
  const bX = px0 + (px1 - px0) * 0.80;
  pen.paint(() => { g.rect(bX - cw / 2, py0 + ph * .17, cw, ph * .66); },
    toneSolid(recognized ? inkLevel(2) : inkLevel(0)), 3);
  if (recognized) {
    g.strokeStyle = INK; g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath();
    g.moveTo(bX - cw * .30, ccy + ph * .16); g.lineTo(bX, ccy - ph * .20); g.lineTo(bX + cw * .30, ccy + ph * .16);
    g.stroke();
    g.beginPath();
    g.moveTo(bX - cw * .30, ccy + ph * .30); g.lineTo(bX, ccy - ph * .06); g.lineTo(bX + cw * .30, ccy + ph * .30);
    g.stroke();
  } else {
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.45; g.setLineDash([7, 8]);
    g.beginPath(); g.moveTo(bX - cw * .28, ccy); g.lineTo(bX + cw * .28, ccy); g.stroke(); g.restore();
  }

  /* ---- ENVELOPE: hall bed -> hard pluck -> long clear ring ---- */
  const ex0 = W * P.env.x0, ex1 = W * P.env.x1, eB = H * P.env.base, eH = H * P.env.h;
  brokenLine(g, ex0 - 14, ex1 + 14, eB, 3, [[0, .27], [.34, .63], [.70, 1]]);
  const f0 = P.env.attack;
  const yAt = (u) => {
    const bed = eB - eH * (0.115 + 0.038 * Math.sin(u * 63));
    if (!sounding) return bed;
    if (u < f0 - 0.012) return bed;
    if (u < f0) return lerp(bed, eB - eH * intensity, (u - (f0 - 0.012)) / 0.012);
    const ring = eB - eH * intensity * Math.exp(-(u - f0) * 1.85);   // it goes on ringing
    const after = hush ? eB - eH * 0.018 : bed;                      // the hall stops to listen
    return Math.min(ring, after);
  };
  g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.lineJoin = "round"; g.lineCap = "round";
  g.beginPath();
  for (let i = 0; i <= 160; i++) {
    const u = i / 160, x = lerp(ex0, ex1, u), y = yAt(u);
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke(); g.restore();

  /* ---- TIME CURSOR through envelope + both lanes ---- */
  const uc = clamp(lerp(0.09, 0.95, phase), 0.09, 0.95);
  const curX = lerp(ex0, ex1, uc), curTop = H * 0.655;
  g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt"; g.setLineDash([9, 9]);
  g.beginPath(); g.moveTo(curX, curTop); g.lineTo(curX, H * P.note.base + 10); g.stroke();
  g.restore();
  g.fillStyle = ACCENT; g.fillRect(curX - 8, curTop - 17, 16, 16);
  g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(curX - 8, curTop - 17, 16, 16);

  /* ---- LANE 1 · TEST: sparse taps of a man turning the bow over ---- */
  const lx0 = W * 0.145, lx1 = W * 0.885;
  const n = P.test.n, step = (lx1 - lx0) / (n - 1);
  const curIdx = uc * n;
  const tB = H * P.test.base;
  glyphTurn(pen, g, W * 0.078, tB - 24, 42);
  brokenLine(g, lx0 - 12, lx1 + 12, tB, 3, [[0, .29], [.37, .63], [.71, 1]]);
  for (const i of P.test.taps) {
    if (i > curIdx + 0.5) continue;
    const bx = lx0 + i * step, h = 15 + (i % 3) * 7;
    g.fillStyle = inkLevel(4); g.fillRect(bx - 6, tB - h, 12, h);
    g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(bx - 6, tB - h, 12, h);
  }
  {  // the test ends where the note begins: a pair of jambs and a dead stretch
    const bx = lx0 + (P.note.at - 0.6) * step;
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.setLineDash([5, 6]);
    g.beginPath(); g.moveTo(bx, tB - 42); g.lineTo(bx, tB + 8); g.stroke(); g.restore();
  }

  /* ---- LANE 2 · NOTE: one attack, then a decaying sustain ---- */
  const nB = H * P.note.base;
  glyphSwallow(pen, g, W * 0.084, nB - 28, 50);
  brokenLine(g, lx0 - 12, lx1 + 12, nB, 3, [[0, .29], [.37, .63], [.71, 1]]);
  if (sounding) {
    const at = P.note.at;
    const bx = lx0 + at * step, h = 66 * (0.35 + 0.65 * intensity);
    if (at <= curIdx + 0.5) {
      g.fillStyle = inkLevel(7); g.fillRect(bx - 8, nB - h, 16, h);
      g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(bx - 8, nB - h, 16, h);
    }
    for (let k = 1; k <= P.note.ring; k++) {          // the ring: separate blocks, never a bar
      const i = at + k;
      if (i > curIdx + 0.5 || i > n - 1) break;
      const rxx = lx0 + i * step;
      const rh = h * 0.52 * Math.exp(-k * 0.20);
      const lv = clamp(Math.round(6 - k * 0.55), 1, 6);
      g.fillStyle = inkLevel(lv); g.fillRect(rxx - 5, nB - rh, 10, rh);
      g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(rxx - 5, nB - rh, 10, rh);
    }
  }
}

export const asset = {
  id: "sound_source.bow-string-song",
  type: "SOUND_SOURCE",
  name: "Bow-string song",
  statusWord: "SONG",
  scene: "OD-B21-S07",

  params,
  // back -> front draw order the diagram honors
  layers: ["wedge", "room", "benches", "bow", "string", "sounding-point", "wavefronts",
           "listener", "pitch-ladder", "harmonic-comb", "readout", "envelope", "cursor",
           "test-lane", "note-lane"],
  // normalized 0..1 emitter / receiver / readout stations
  anchors: {
    "emitter:position":  { x: 0.297, y: 0.265 },  // the sounding point on the string
    "emitter:grip":      { x: 0.128, y: 0.250 },  // where the bow is held
    "emitter:nock-top":  { x: 0.278, y: 0.105 },
    "emitter:nock-low":  { x: 0.278, y: 0.395 },
    "receiver:position": { x: 0.845, y: 0.198 },  // the hall that hears it
    "receiver:bench":    { x: 0.845, y: 0.266 },
    "axis:mid":          { x: 0.571, y: 0.232 },
    "note:partial":      { x: 0.446, y: 0.520 },  // the one clear harmonic
    "state:before":      { x: 0.651, y: 0.536 },
    "state:after":       { x: 0.861, y: 0.536 },
    "cut:instant":       { x: 0.486, y: 0.930 },  // the attack in the NOTE lane
    "camera:diagram":    { x: 0.500, y: 0.500 },
  },
  // relation to visible action: the note crosses the room; the lanes carry the clock
  zones: {
    room:     { x0: .062, y0: .072, x1: .948, y1: .418 },
    spectrum: { x0: .062, y0: .450, x1: .560, y1: .620 },
    readout:  { x0: .585, y0: .470, x1: .930, y1: .602 },
    rhythm:   { x0: .100, y0: .655, x1: .890, y1: .950 },
  },
  states: {
    initial: "strung",
    nodes: {
      slack:     { preview: { intensity: 0.00, phase: 0.06, strung: false, recognized: false, hush: false, status: "SLACK",  progress: 0.06 } },
      strung:    { preview: { intensity: 0.00, phase: 0.16, strung: true,  recognized: false, hush: false, status: "STRUNG", progress: 0.18 } },
      pluck:     { preview: { intensity: 1.00, phase: 0.34, strung: true,  recognized: false, hush: true,  status: "PLUCK",  progress: 1.00 } },
      singing:   { preview: { intensity: 0.92, phase: 0.56, strung: true,  recognized: false, hush: true,  status: "SINGING", progress: 0.80 } },
      recognized:{ preview: { intensity: 0.68, phase: 0.82, strung: true,  recognized: true,  hush: true,  status: "SIGN",   progress: 0.92 } },
      silent:    { preview: { intensity: 0.00, phase: 0.04, strung: true,  recognized: false, hush: false, status: "SILENT", progress: 0.02 } },
    },
    edges: [
      ["slack", "strung"], ["strung", "pluck"], ["pluck", "singing"],
      ["singing", "recognized"], ["recognized", "silent"], ["silent", "strung"],
      ["strung", "slack"], ["singing", "silent"],
    ],
  },
  channels: ["intensity", "phase", "pitch", "sustain", "recognition"],

  preview: () => ({ intensity: 0.86, phase: 0.80, strung: true, recognized: true, hush: true, status: "SONG", progress: 0.90 }),
  draw(ctx, W, H, state) { drawDiagram(ctx, W, H, state); return { anchors: asset.anchors, zones: asset.zones }; },
};
export default asset;
