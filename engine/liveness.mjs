/* ============================================================
   LIVENESS — the motion layer that makes a correctly-staged frame ALIVE.

   THE PROBLEM. The restage puts every body on one ground plane at the right
   station in the right pose, and then leaves it there. A figure holds one
   pose for four seconds and SNAPS to the next. Blocking is right; the frame
   is dead. A photograph of a living person is never perfectly still: the
   chest rises, the weight shifts from one hip to the other, the head is
   never quite level. That residue is what the eye reads as "alive", and it
   is what this module supplies.

   THE ONE HARD RULE: DETERMINISM. This film is rendered, seeked, compared
   pane-against-pane and diffed frame-against-frame. NOTHING here may be
   random per frame. Every value is a pure function of (id, t): the id picks
   a fixed phase offset out of a stable hash, and t walks the sines. Call it
   twice with the same arguments and you get bit-identical numbers, in this
   process, in the next process, and a year from now. There is no Math.random,
   no Date, and no hidden state anywhere in this file.

   WHY SINES AND NOT NOISE. Noise needs a table or a PRNG; sines need
   nothing, are exactly reproducible in double precision, and — this is the
   real reason — three sines at mutually irrational-ish periods (4.1 / 9.3 /
   7.0 s) never repeat inside the length of a shot. The figure never appears
   to loop.

   SUBTLE IS THE POINT. This is BREATH, not bounce. Every amplitude below is
   a fraction of the frame, in the third decimal place: 0.4% of frame height
   for a breath. At the panel sizes this film renders at (476px tall) that is
   under two pixels. You should not be able to point at the motion; you
   should only notice that the figure is not a cut-out.

   UNITS. dx, dy and lean are FRACTIONS OF FRAME SIZE — callers multiply dx
   and lean by W and dy by H. scale is a plain MULTIPLIER on the figure's
   drawn height (1.0 = the size the layout asked for). tilt is RADIANS,
   applied about the figure's foot line. phase is 0..1, the figure's position
   in its own breath cycle, exposed so callers can drive something else
   (a torch, a shadow, an fx) off the same body.

   Used by odyssey-syncwatch.html for the RESTAGE, PLAN CAMERA and SPEAKERS
   panes. Additive: it reads nothing and writes nothing.
   ============================================================ */

const TAU = Math.PI * 2;

/* ── the tuning table. Each number is here for a reason; the reason is the
   comment. Exported so a caller can report exactly what it rendered with. ── */

/* BREATH. 4.1 s ≈ 14.6 breaths/minute — a resting adult at ease, which is
   what most of these figures are doing. Deliberately NOT a round number: 4.0
   would beat against the 1.9 Hz gesture and the ~8 s beat grid of the scene
   programs and produce a visible pulse. */
export const BREATH_PERIOD = 4.1;
/* 0.004 = 0.4% of frame height. At 476 px that is 1.9 px peak — the chest
   rising. Push this to 0.01 and the figure visibly bobs, which reads as bad
   animation rather than as life. */
export const BREATH_AMP = 0.004;

/* WEIGHT. Standing people shift from hip to hip roughly every 8–10 s. 9.3 s
   is inside that band and shares no small-integer ratio with 4.1 or 7.0, so
   breath, weight and tilt never line up into a single obvious wobble. */
export const WEIGHT_PERIOD = 9.3;
/* 0.003 of frame WIDTH — under the width of one halftone cell at these
   sizes, so it reads as the body settling, never as the body sliding. It is
   smaller than the breath because lateral motion is far more legible than
   vertical: the eye catches sideways drift immediately. */
export const WEIGHT_AMP = 0.003;

/* MICRO-TILT. The head/torso axis is never plumb. 7.0 s is slower than the
   breath (a tilt that breathed would read as a nod) and faster than the
   weight shift, so the three motions stay separable. */
export const TILT_PERIOD = 7.0;
/* 0.006 rad ≈ 0.34°. Across a figure 300 px tall that is under 2 px of sway
   at the crown. One degree already reads as "leaning". */
export const TILT_AMP = 0.006;

/* SPEAKING. ~1.9 Hz is the rate of speech-accompanying beat gesture — the
   hand marking stress groups. It is the single strongest "this body is
   producing sound" cue there is, stronger than any mouth shape at this
   resolution. */
export const GESTURE_HZ = 1.9;
/* 0.006 of frame height, i.e. 1.5× the breath, and it ADDS to the breath, so
   a speaking figure moves ~2.5× as much as a listening one. That ratio is
   what makes "who is talking" legible at a glance. */
export const GESTURE_AMP = 0.006;
/* the speaker comes very slightly FORWARD — 1.5% of height. Presence, not a
   zoom. Larger and it reads as the camera pushing in, which is pane C's job,
   not the body's. */
export const GESTURE_SCALE = 0.015;
/* gesture decays across the line: the amplitude at the end of a line is
   (1 − 0.5·u) = half of the amplitude at its start, and the forward presence
   falls to (1 − 0.6·u) = 40%. People gesture hardest on the first stressed
   syllables and settle as the thought completes. This decay is also what
   stops a long speech from turning into a metronome. */
export const GESTURE_DECAY_DY = 0.5;
export const GESTURE_DECAY_SCALE = 0.6;

/* LEAN. The speaker leans 2% of frame width toward whoever they are talking
   to; the listener answers with 0.8%, about a third — listening is a settle,
   not a commitment. SIGN IS THE CALLER'S: liveness does not know which side
   of the frame the addressee is on, so it returns a magnitude and the caller
   multiplies by ±1. */
export const LEAN_SPEAK = 0.02;
export const LEAN_LISTEN = 0.008;
/* held breath. A listening body genuinely breathes shallower — 70% is the
   difference between "waiting" and "idling", and it is the second half of
   the speaker/listener contrast (the first half is the gesture). */
export const LISTEN_BREATH = 0.7;

/* IMPACT. A blow, a fall, a thunderclap. 9 Hz is fast enough to read as a
   shock rather than a movement, and 0.02 of frame height is 5× a breath —
   the only amplitude in this file that is meant to be SEEN. Callers pass
   `impact` as the elapsed fraction through the shock window: the
   impact·(1−impact) envelope is zero at both ends and peaks at 0.5, so the
   shock arrives, rings and is spent, with no discontinuity at either edge.
   Sparingly: at most one body, for well under a second. */
export const IMPACT_AMP = 0.02;
export const IMPACT_HZ = 9;

const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;

/* ── seedOf — a stable hash of an id to 0..1 ──────────────────────────────
   FNV-1a over the UTF-16 code units, then an avalanche so that ids differing
   in one character ("suitor_01" / "suitor_02") land far apart in 0..1 rather
   than adjacent — adjacent seeds would put a whole ensemble in step, which
   is precisely the marching-chorus look this module exists to avoid.
   Integer-only (Math.imul, >>> 0), so it is identical in every JS engine. */
export function seedOf(id){
  const s = String(id == null ? "" : id);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++){
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  /* avalanche (murmur3 finalizer) — spreads neighbouring inputs apart */
  h ^= h >>> 16; h = Math.imul(h, 2246822507) >>> 0;
  h ^= h >>> 13; h = Math.imul(h, 3266489909) >>> 0;
  /* the final xor-shift drops back to a SIGNED 32-bit int, so without this
     >>> 0 the seed can come out negative (character.athena was -0.214).
     Harmless inside liveness() — it only feeds sines — but it breaks any
     caller that uses the seed to index an array. Keep the cast. */
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

/* ── liveness(id, t, opts) ────────────────────────────────────────────────
   id    — instance or asset id. Only used through seedOf, for phase offset.
   t     — seconds. Use a WALL clock (real elapsed time), not a compressed
           scene clock: breath that speeds up when the edit compresses is
           worse than no breath.
   opts  — { speaking, listening, u, impact, gain, seed }
     speaking  true while this body is producing the current line
     listening true while this body is the addressee of the current line
     u         0..1 progress THROUGH THE CURRENT LINE (not through the scene)
     impact    0..1 elapsed fraction through a shock window; 0 = no shock
     gain      optional global multiplier, for damping background bodies
     seed      optional explicit seed, overrides seedOf(id)

   returns { dx, dy, scale, lean, tilt, phase }
     dx, dy   fractions of frame W / H          (callers: x + dx*W, y + dy*H)
     lean     fraction of frame W, UNSIGNED     (callers: × ±1 toward target)
     scale    multiplier on drawn height, 1.0 = as laid out
     tilt     radians about the foot line
     phase    0..1 position in this body's breath cycle
   ─────────────────────────────────────────────────────────────────────── */
export function liveness(id, t, opts = {}){
  const seed = (typeof opts.seed === "number") ? opts.seed : seedOf(id);
  const tt = Number.isFinite(+t) ? +t : 0;
  const speaking  = opts.speaking  === true;
  const listening = opts.listening === true && !speaking;   // speaking wins
  const u = clamp01(Number.isFinite(+opts.u) ? +opts.u : 0);
  const gain = Number.isFinite(+opts.gain) ? +opts.gain : 1;

  /* the three always-on channels. The seed multipliers (6.3 / 2.1 / 4.7) are
     just three different irrational-ish strides through the seed so that one
     body's breath, weight and tilt phases are unrelated to each other AND to
     the next body's — a crowd built from one seed per body still looks like
     a crowd rather than a chorus line. */
  const breathAmp = BREATH_AMP * (listening ? LISTEN_BREATH : 1);
  let dy   = Math.sin(TAU * tt / BREATH_PERIOD + 6.3 * seed) * breathAmp;
  let dx   = Math.sin(TAU * tt / WEIGHT_PERIOD + 2.1 * seed) * WEIGHT_AMP;
  let tilt = Math.sin(TAU * tt / TILT_PERIOD   + 4.7 * seed) * TILT_AMP;
  let scale = 1;
  let lean  = 0;

  if (speaking){
    dy    += Math.sin(TAU * tt * GESTURE_HZ + seed) * GESTURE_AMP * (1 - GESTURE_DECAY_DY * u);
    scale += GESTURE_SCALE * (1 - GESTURE_DECAY_SCALE * u);
    lean   = LEAN_SPEAK;
  } else if (listening){
    lean   = LEAN_LISTEN;
  }

  const impact = clamp01(Number.isFinite(+opts.impact) ? +opts.impact : 0);
  if (impact > 0)
    dy += IMPACT_AMP * impact * Math.sin(TAU * tt * IMPACT_HZ) * (1 - impact);

  if (gain !== 1){
    dx *= gain; dy *= gain; lean *= gain; tilt *= gain;
    scale = 1 + (scale - 1) * gain;
  }

  /* phase: where this body is in its own breath, 0 at the bottom of the
     inhale. Positive-modulo so it is 0..1 for negative t too. */
  const phase = ((tt / BREATH_PERIOD + seed) % 1 + 1) % 1;

  return { dx, dy, scale, lean, tilt, phase };
}

/* ── SELF-TEST (determinism is checkable by eye) ──────────────────────────
   node --input-type=module -e "import('./engine/liveness.mjs').then(L=>{
     for(const t of [0,1,2]) console.log(t, L.liveness('character.odysseus', t));
   })"

   seedOf("character.odysseus") = 0.3855902950745076

   t=0  { dx:  0.00217232285394225,    dy:  0.0026145285126557343,
          scale: 1, lean: 0, tilt:  0.005825913451203827,
          phase: 0.3855902950745076 }
   t=1  { dx:  0.002989055290880691,   dy: -0.002924884642666318,
          scale: 1, lean: 0, tilt:  0.002510603629628133,
          phase: 0.6294927340988978 }
   t=2  { dx:  0.0024925450360591887,  dy: -0.002838590667739978,
          scale: 1, lean: 0, tilt: -0.002695241932038503,
          phase: 0.8733951731232881 }

   scale is 1 and lean is 0 above because this body is neither speaking nor
   listening — that is the plain-breath case, and it is most of the cast.

   Every one of those is reproducible to the last bit. If you change a
   constant above, these change — that is the point of printing them.
   ─────────────────────────────────────────────────────────────────────── */
