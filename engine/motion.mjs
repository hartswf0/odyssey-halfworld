/* ============================================================================
   motion.mjs — MOTION UNDER THE DOT LAW.

   This world animates. That is not a preference; the text's central images do
   not exist in any single frame:

     "The mark existed only when the wings were closed together."
     "The line gathered over itself, loop after loop, until a figure appeared."
     "a synchronized line passing across the wall from left to right"

   A still frame cannot hold a difference-between-states, an accumulation, or a
   wavefront. So the unit of authorship here is a CYCLE, not a picture.

   ---------------------------------------------------------------------------
   THE CONSTRAINT THAT SHAPES EVERYTHING

   The dot law forbids gradients and blur. That means the two cheapest tools in
   animation are unavailable: you cannot cross-fade and you cannot motion-blur.
   Every transition must be expressed in DOTS THAT SWITCH ALLEGIANCE, one at a
   time, on an ordered schedule.

   This turns out to be exactly what the text describes. Scales do not fade from
   one surface to another — they move, individually, and they brighten rather
   than dim. A dissolve here is a per-dot swap with a deterministic threshold
   map, which reads as a substance transferring rather than an image fading.
   The constraint and the content agree.

   ---------------------------------------------------------------------------
   THE EIGHT MOTIONS, taken from the text rather than imposed on it.

   Each is a pure function of normalised time u ∈ [0,1). Every scene is a
   function of u and nothing else — no wall clock, no accumulated state — so
   frame n is reproducible on any machine and the render is deterministic.
   ========================================================================= */

export const TAU = Math.PI * 2;
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };

/* ---------------------------------------------------------------- CYCLE ---
   "Impact. Drop. A tilt of black-veined wings. Recovery. Impact."

   A loop that must be SEAMLESS: the last frame's successor is frame 0. Any
   discontinuity there reads as a stutter and destroys the sense of a body
   doing something it cannot stop doing.

   `closed` is the argument the text is about. A closed cycle returns exactly
   to its first state — a trap, a loop of questions where every answer is yes.
   An open cycle drifts by `drift` per revolution: the same act, but the body
   is being worn down by it. Never animate a life as a closed cycle.
-------------------------------------------------------------------------- */
export function cycle(u, { beats = 4, closed = true, drift = 0 } = {}) {
  const phase = (u % 1) * beats;
  const beat = Math.floor(phase);
  const within = phase - beat;
  return {
    beat, within,
    // eased position within the beat, for a body that accelerates into contact
    strike: smooth(within),
    // seamless sine for anything that must not stutter at the wrap
    breath: Math.sin(u * TAU),
    // accumulated wear; 0 when closed. This is the difference between a trap
    // and a life, and it is one number.
    wear: closed ? 0 : drift * u,
  };
}

/* ---------------------------------------------------------------- TRACE ---
   "The line gathered over itself, loop after loop, until a figure appeared."

   The figure is invisible in every instant and present only in the sum. Call
   with the full path; it returns the portion drawn so far, plus an `age` per
   point so older strokes can sit lighter in the lattice — the only legitimate
   use of tone variation in this world, because it encodes time, not depth.
-------------------------------------------------------------------------- */
export function trace(u, points, { fade = 0.55 } = {}) {
  const n = Math.max(1, Math.floor(points.length * clamp01(u)));
  const out = [];
  for (let i = 0; i < n; i++) {
    const age = n <= 1 ? 0 : (n - 1 - i) / (n - 1);   // 0 = newest
    out.push({ ...points[i], age, ink: 1 - age * fade });
  }
  return out;
}

/** The broken circle itself: an almost-closed loop crossed near its lower edge.
 *  Authored once here so the flight path, the pen mark, the scar, the wing and
 *  the new paint on the plywood are provably the same shape. */
export function brokenCircle({ gap = 0.62, strokeAt = 0.78, samples = 220 } = {}) {
  const pts = [];
  const open = 0.42;                                   // radians left unclosed
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const a = -Math.PI / 2 + open / 2 + t * (TAU - open);
    pts.push({ x: 0.5 + Math.cos(a) * 0.34, y: 0.5 + Math.sin(a) * 0.34, seg: "ring" });
  }
  // the crooked stroke through the lower edge
  const s = Math.floor(samples * strokeAt);
  for (let i = 0; i < 46; i++) {
    const t = i / 45;
    pts.splice(s + i, 0, {
      x: 0.34 + t * 0.30 + Math.sin(t * 3.1) * 0.012,
      y: 0.74 + t * 0.055, seg: "stroke",
    });
  }
  return pts;
}

/* ---------------------------------------------------------------- SWEEP ---
   "a synchronized line passing across the wall from left to right"

   A wavefront. Every element has a position; the front crosses them in order.
   `width` is how many elements are mid-transition at once — narrow reads as a
   zip, wide reads as weather. The chrysalis wall is narrow: the seams split
   "at once", in sequence, not in a haze.
-------------------------------------------------------------------------- */
export function sweep(u, positions, { width = 0.06, dir = 1 } = {}) {
  const front = dir > 0 ? u * (1 + width) - width : 1 - u * (1 + width);
  return positions.map((p) => {
    const d = dir > 0 ? (front - p) / width : (p - front) / width;
    return { p, open: clamp01(d), passed: d >= 1 };
  });
}

/* ------------------------------------------------------------- TRANSFER ---
   scales: butterfly → glove → skin → tape → film → the beam

   A quantity of discrete carriers moving between two surfaces. They are never
   blended and never faded: each carrier is at A or in flight or at B. And they
   BRIGHTEN in transit, because the text is explicit that rubbing them makes
   them brighter rather than fainter.
-------------------------------------------------------------------------- */
export function transfer(u, n, { stagger = 0.55, seed = 1 } = {}) {
  const out = [];
  let s = (seed >>> 0) || 1;
  const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  for (let i = 0; i < n; i++) {
    const start = rnd() * stagger;
    const k = clamp01((u - start) / (1 - stagger));
    out.push({
      i, k,
      at: k <= 0 ? "source" : k >= 1 ? "target" : "flight",
      // brightest at the midpoint of the crossing
      ink: 1 + Math.sin(clamp01(k) * Math.PI) * 0.9,
      wobble: Math.sin((u + i * 0.37) * TAU * 1.7) * 0.5,
    });
  }
  return out;
}

/* -------------------------------------------------------------- ADVANCE ---
   "She advanced the strip between her fingers."

   Discrete frames past a gate. NOT continuous: u is quantised, and there is a
   deliberate dwell so the eye registers each frame as a separate thing. This
   is a film strip, a run of landings, a corridor of light columns.
-------------------------------------------------------------------------- */
export function advance(u, count, { dwell = 0.72 } = {}) {
  const raw = clamp01(u) * count;
  const idx = Math.min(count - 1, Math.floor(raw));
  const within = raw - idx;
  const moving = within > dwell;
  return {
    index: idx,
    // 0 while the frame is held, then a fast slide to the next
    shift: moving ? smooth((within - dwell) / (1 - dwell)) : 0,
    settled: !moving,
  };
}

/* ------------------------------------------------------------- DISSOLVE ---
   "Therefore the film changed."

   THERE IS NO CROSS-FADE IN THIS WORLD. The dot law forbids partial opacity,
   so a dissolve is per-dot allegiance switching on an ordered threshold map —
   a Bayer-style matrix so the swap is structured rather than noisy, and
   deterministic so it renders identically every time.

   Call per dot with its grid coordinates; it returns which image owns that dot
   at time u. Reads as substance replacing substance, which is what the text is
   describing anyway.
-------------------------------------------------------------------------- */
const BAYER8 = (() => {
  const m = [[0]];
  let s = 1;
  while (s < 8) {
    const n = [];
    for (let y = 0; y < s * 2; y++) n.push(new Array(s * 2).fill(0));
    for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
      const v = m[y][x] * 4;
      n[y][x] = v; n[y][x + s] = v + 2; n[y + s][x] = v + 3; n[y + s][x + s] = v + 1;
    }
    m.length = 0; m.push(...n); s *= 2;
  }
  return m;
})();

export function dissolve(u, gx, gy) {
  const t = BAYER8[gy & 7][gx & 7] / 64;
  return clamp01(u) > t ? "b" : "a";
}

/* ------------------------------------------------------------------ HOLD ---
   "she stood with both hands inside the sleeves, although there was nothing
   left for her hands to do"

   Stillness that is doing work. Never freeze a frame — a frozen frame reads as
   a crash. A held frame breathes, and the breath is slow enough to be deniable.
-------------------------------------------------------------------------- */
export function hold(u, { breathSec = 4.1, dur = 6 } = {}) {
  const t = u * dur;
  return {
    breath: Math.sin((t / breathSec) * TAU) * 0.5 + 0.5,
    tilt: Math.sin((t / 7.0) * TAU) * 0.35,
    weight: Math.sin((t / 9.3) * TAU) * 0.4,
  };
}

/* ----------------------------------------------------------------- BREAK ---
   "The lid opened." · "Summer entered."

   The ONLY discontinuity this world permits, and it must be declared: one
   instant, stated in the scene file, before and after. Everything else is
   continuous. A break that is not declared is a bug.
-------------------------------------------------------------------------- */
export function brk(u, at = 0.5) {
  return { before: u < at, after: u >= at, sinceBreak: u < at ? 0 : (u - at) / (1 - at) };
}

/* --------------------------------------------------------------- the map --
   Scene files declare `motion` and get the right function. Keeping the
   dispatch here means a scene never re-implements a motion, and the eight
   motions cannot quietly become nine. */
export const MOTIONS = { cycle, trace, sweep, transfer, advance, dissolve, hold, brk };

/** Frame count for a motion at a given duration. CYCLEs get a frame count that
 *  divides evenly into their beats so the loop closes on a beat boundary. */
export function framesFor(motion, seconds, fps = 12, beats = 4) {
  const n = Math.round(seconds * fps);
  if (motion === "CYCLE") return Math.max(beats, Math.round(n / beats) * beats);
  if (motion === "ADVANCE") return Math.max(8, n);
  return Math.max(6, n);
}

export const MOTION_VERSION = "motion/1.0.0";
