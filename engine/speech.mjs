/* ============================================================================
   speech.mjs — A MOUTH THAT IS MAKING THE SOUND YOU ARE HEARING.

   THE COMPLAINT THIS ANSWERS: "we don't see a mouth talking." Twelve people
   speak in this film for three minutes and eleven seconds and not one visible
   mouth ever opens. The voice arrives from somewhere beside the picture.

   ---------------------------------------------------------------------------
   THE DIVISION OF LABOUR, which is the only real idea in this file.

       THE WAVEFORM DECIDES *IF* THE MOUTH IS OPEN.
       THE TEXT DECIDES *WHAT SHAPE* IT IS IN.

   Every lip-sync failure is one of these two doing the other's job.

   Drive a mouth from text alone (the usual approach: spell the line, allocate
   the syllables evenly, animate) and it flaps through pauses, breaths and the
   half-second before a sentence starts. The tell is unmistakable — a mouth
   moving in silence — and it is why cheap lip-sync reads as a puppet rather
   than a speaker.

   Drive it from the envelope alone and you get a hinge. Loud/quiet is a single
   channel; it cannot tell an /ee/ from an /oo/, and it never closes on an /m/,
   because the voice does not stop during a bilabial — the lips do. A hinged jaw
   opening in time with the volume is legible as "sound is happening near this
   head", not as "this head is saying these words."

   So: the recorded RMS envelope gates, and the spelled line shapes. And the
   gate is a FLOOR, not a mask — if the envelope is loud where the text expects
   a rest (which happens whenever the timing drifts), the mouth opens anyway, on
   a neutral shape. Drift then costs articulation, which is a blur. The other
   arrangement costs closure, which is a lie.

   ---------------------------------------------------------------------------
   TEN VISEMES, not forty phonemes.

   At 12fps a frame is 83ms — about one phoneme. There is no budget for
   distinctions the frame rate cannot carry, and a finer set would only produce
   shapes the dot lattice quantises away. These are the reduced set that
   animation has used since Preston Blair, chosen because each is a distinct
   SILHOUETTE and this world has nothing but silhouette:

     REST  closed, neutral            MM  pressed shut       (m b p)
     AH    wide and tall              EE  wide and narrow    (i e y)
     OH    rounded, medium            OO  tight, protruded   (u w oo)
     FF    lower lip to teeth (f v)   TH  tongue at the teeth
     DD    small, tongue up (t d n l) SS  narrow, teeth close (s z sh ch)

   Grapheme rules, not a pronunciation dictionary. English spelling is a bad
   guide to English sound and this WILL mis-shape words like "though". It is
   the right trade at this scale: a wrong-but-plausible shape inside a correctly
   gated aperture is invisible, and a dictionary would buy accuracy the lattice
   discards. Where it matters — the closures — spelling is reliable: m, b and p
   are bilabial in every English word without exception.

   PURE. No clock, no state. Every export is a function of its arguments, so a
   frame renders identically whether or not the frame before it ever existed.
   ========================================================================= */

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (x) => clamp(x, 0, 1);
const smooth = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };

/* ---- the ten shapes ------------------------------------------------------
   jaw    aperture, 0 shut .. 1 wide
   wide   corner spread: +1 drawn back (ee), -1 pursed forward (oo)
   press  lip compression — the channel that makes a closure READ as a closure
          rather than as an absence of opening. At press 1 the lips flatten and
          gain a hard seam, which is what an /m/ looks like.
   teeth  0 hidden .. 1 upper teeth on the lower lip / showing
   tongue 0 none .. 1 tip visible against the teeth
   Nothing here is a jaw ANGLE — the face module owns the anatomy. These are
   demands on a mouth, and a different face may satisfy them differently. */
export const VISEMES = {
  REST: { jaw: 0.00, wide: 0.00, press: 0.15, teeth: 0.0, tongue: 0.0, w: 1.00 },
  MM:   { jaw: 0.00, wide: 0.05, press: 1.00, teeth: 0.0, tongue: 0.0, w: 0.55 },
  FF:   { jaw: 0.12, wide: 0.22, press: 0.55, teeth: 1.0, tongue: 0.0, w: 0.70 },
  TH:   { jaw: 0.22, wide: 0.15, press: 0.10, teeth: 0.5, tongue: 1.0, w: 0.70 },
  DD:   { jaw: 0.26, wide: 0.10, press: 0.05, teeth: 0.3, tongue: 0.6, w: 0.50 },
  SS:   { jaw: 0.16, wide: 0.55, press: 0.20, teeth: 0.9, tongue: 0.2, w: 0.65 },
  EE:   { jaw: 0.34, wide: 0.90, press: 0.00, teeth: 0.5, tongue: 0.0, w: 1.00 },
  AH:   { jaw: 0.92, wide: 0.30, press: 0.00, teeth: 0.2, tongue: 0.1, w: 1.15 },
  OH:   { jaw: 0.62, wide: -0.45, press: 0.00, teeth: 0.0, tongue: 0.0, w: 1.10 },
  OO:   { jaw: 0.34, wide: -0.95, press: 0.10, teeth: 0.0, tongue: 0.0, w: 1.00 },
  RR:   { jaw: 0.30, wide: -0.25, press: 0.00, teeth: 0.1, tongue: 0.3, w: 0.85 },
};

/* ---- grapheme -> viseme --------------------------------------------------
   Ordered: digraphs must be tested before their component letters, or "sh"
   becomes /s/ + /h/ and "the" becomes /t/ + /h/. */
const DIGRAPH = [
  ["sch", "SS"], ["tch", "SS"], ["igh", "AH"], ["ough", "OH"],
  ["ch", "SS"], ["sh", "SS"], ["th", "TH"], ["ph", "FF"], ["wh", "OO"],
  ["ck", "DD"], ["ng", "DD"], ["qu", "OO"], ["gh", "DD"],
  ["oo", "OO"], ["ou", "OH"], ["ow", "OH"], ["oi", "OH"], ["oy", "OH"],
  ["ee", "EE"], ["ea", "EE"], ["ie", "EE"], ["ai", "EE"], ["ay", "EE"],
  ["au", "AH"], ["aw", "AH"], ["ei", "EE"], ["ey", "EE"], ["ue", "OO"], ["ui", "OO"],
];
const SINGLE = {
  a: "AH", e: "EE", i: "EE", o: "OH", u: "OO", y: "EE",
  m: "MM", b: "MM", p: "MM",
  f: "FF", v: "FF",
  s: "SS", z: "SS", x: "SS", c: "SS", j: "SS", g: "DD",
  t: "DD", d: "DD", n: "DD", l: "DD", k: "DD",
  r: "RR", w: "OO", h: "REST",
};

/* ---- visemeTrack ---------------------------------------------------------
   text     the spoken line
   seconds  its MEASURED duration (see harness/measure-lines.mjs)
   Returns  [{ t0, t1, v }] covering [0, seconds] with no holes.

   Word gaps get an explicit REST rather than being absorbed into the
   neighbouring sound: without them, a fast line becomes one continuous
   articulation and the mouth never returns to rest inside a sentence, which
   is exactly how a puppet chatters. Punctuation buys a longer rest, because
   that is where the reader breathed and the envelope will agree. */
export function visemeTrack(text, seconds) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const units = [];
  for (const raw of words) {
    const core = raw.toLowerCase().replace(/[^a-z']/g, "");
    let i = 0, last = null;
    while (i < core.length) {
      let v = null, len = 1;
      for (const [g, vis] of DIGRAPH)
        if (core.startsWith(g, i)) { v = vis; len = g.length; break; }
      if (!v) { v = SINGLE[core[i]] || "REST"; len = 1; }
      i += len;
      // a doubled letter ("letter", "off") is one sound, not two
      if (v === last && v !== "AH" && v !== "EE") continue;
      units.push({ v, w: VISEMES[v].w });
      last = v;
    }
    // the space after the word, and a real breath at punctuation
    const punct = /[.,;:!?—…]/.test(raw);
    units.push({ v: "REST", w: punct ? 1.6 : 0.35 });
  }
  if (!units.length) units.push({ v: "REST", w: 1 });
  const total = units.reduce((n, u) => n + u.w, 0);
  const out = []; let t = 0;
  for (const u of units) {
    const d = seconds * u.w / total;
    out.push({ t0: +t.toFixed(4), t1: +(t + d).toFixed(4), v: u.v });
    t += d;
  }
  out[out.length - 1].t1 = seconds;
  return out;
}

/* ---- envelopeGate --------------------------------------------------------
   env     Float array of per-hop RMS for THIS LINE, already normalised so 1.0
           is the line's own loud level (see harness/build-closeups.mjs)
   hz      samples per second of env
   Linear interpolation between hops: at 12fps and a 100Hz envelope there are
   eight samples per frame, and taking the nearest one throws away the attack. */
export function envelopeAt(env, hz, t) {
  if (!env || !env.length) return 0;
  const x = clamp(t * hz, 0, env.length - 1);
  const i = Math.floor(x), f = x - i;
  return env[i] * (1 - f) + (env[Math.min(env.length - 1, i + 1)] || env[i]) * f;
}

/* ---- sampleMouth ---------------------------------------------------------
   The whole engine, in one call.

   COARTICULATION. A viseme is not reached instantly and is not held to its
   boundary: a real articulator is already moving toward the next shape while
   it finishes the last. So the returned channels are a weighted blend of every
   viseme within BLEND seconds of t, under a triangular kernel. Without this,
   at 12fps, the mouth teleports between shapes once per frame and strobes.
   BLEND is 110ms — a little over one frame, which is roughly how long a jaw
   takes to travel.

   THE GATE, and the one asymmetry that matters:

     jaw = max( visemeJaw * gate ,  FLOOR * gate )

   The first term is the articulated shape. The second is the floor: whenever
   the recording is loud, SOMETHING opens, even if the text thinks we are
   between words. Drift then shows up as a vaguer shape rather than as a closed
   mouth over a loud syllable. And `press` — the bilabial closure — multiplies
   the whole thing down afterwards, because an /m/ is silent at the lips while
   the voice continues: that closure must survive a loud envelope or the film
   never closes a mouth at all. */
const BLEND = 0.110;
const FLOOR = 0.34;

export function sampleMouth(track, env, hz, t, { blend = BLEND, floor = FLOOR } = {}) {
  let jaw = 0, wide = 0, press = 0, teeth = 0, tongue = 0, wsum = 0;
  for (const seg of track) {
    if (seg.t1 < t - blend || seg.t0 > t + blend) continue;
    // overlap of the segment with a triangular kernel centred on t
    const a = Math.max(seg.t0, t - blend), b = Math.min(seg.t1, t + blend);
    if (b <= a) continue;
    const mid = (a + b) / 2;
    const w = (1 - Math.abs(mid - t) / blend) * (b - a);
    if (w <= 0) continue;
    const V = VISEMES[seg.v] || VISEMES.REST;
    jaw += V.jaw * w; wide += V.wide * w; press += V.press * w;
    teeth += V.teeth * w; tongue += V.tongue * w; wsum += w;
  }
  if (wsum > 0) { jaw /= wsum; wide /= wsum; press /= wsum; teeth /= wsum; tongue /= wsum; }
  else { const V = VISEMES.REST; jaw = V.jaw; wide = V.wide; press = V.press; }

  const energy = clamp01(envelopeAt(env, hz, t));
  const gate = smooth(clamp01(energy * 1.25));
  const seal = 1 - clamp01(press) * 0.94;             // an /m/ closes through a loud vowel

  return {
    jaw: clamp01(Math.max(jaw * gate, floor * gate) * seal),
    wide: clamp(wide * (0.45 + 0.55 * gate), -1, 1),
    press: clamp01(press * (1 - gate * 0.25)),
    teeth: clamp01(teeth * gate),
    tongue: clamp01(tongue * gate),
    energy,
    gate,
  };
}

/* ---- speechCarriage ------------------------------------------------------
   A head does not hold still while its owner talks, and a speaking face that
   holds still is the second-worst tell after a mouth flapping in silence.

   These are small, derived from the SAME envelope, and deliberately lagged: the
   head follows the voice, it does not lead it. Amounts are in the units the
   face module wants (fractions of head radius, radians), and all of them are
   under two per cent of the frame — liveness.mjs' own finding, "you should not
   be able to point at the motion."

   The lag is one 12fps frame. It is the difference between a head nodding
   because a person is emphasising something and a head nodding because it is
   wired to a volume meter. */
export function speechCarriage(env, hz, t, seed = 0) {
  const e = clamp01(envelopeAt(env, hz, t - 0.085));
  const e2 = clamp01(envelopeAt(env, hz, t - 0.24));
  const drive = smooth(e);
  return {
    // emphasis pitches the head down a little as the voice lands on a stress
    pitch: (drive - e2 * 0.6) * 0.055,
    // a slow lateral drift, phase-offset per character so two faces in one
    // exchange never sway together
    yaw: Math.sin(t * 1.15 + seed * 2.4) * 0.030 * (0.4 + 0.6 * drive),
    roll: Math.sin(t * 0.83 + seed * 1.7) * 0.018,
    // the chest under it
    chest: 0.20 + 0.35 * drive,
    // brow lifts on emphasis — the single most legible speech gesture there is
    brow: clamp01((drive - 0.45) * 1.5) * 0.55,
  };
}

export const SPEECH_VERSION = "speech/1.0.0";

/* ---- listenCarriage ------------------------------------------------------
   A REACTION SHOT is not a close-up with the mouth switched off.

   The face on screen is not making the sound, so nothing about it can be
   derived from its own voice — there isn't one. What it CAN be derived from is
   the envelope of the person who IS talking, because that is what the listener
   is responding to, and responding is the only thing the shot contains.

   Three things follow, and the third is the one that makes it read:

   1. THE LAG IS LONG. Speech carriage lags the voice by one frame; a listener
      lags it by a third of a second, because they have to hear the thing before
      it can move them. Set this too short and the listener appears to be
      anticipating the line, which reads as an actor who has read the script.

   2. THE MOUTH STAYS SHUT, but not rigid — a held closure with a slow
      compression cycle. A frozen mouth is a mannequin; a mouth doing nothing
      is a person waiting for their turn.

   3. THE BLINK IS SUPPRESSED WHILE THE VOICE IS LOUD. People do not blink
      through the part they are concentrating on; they blink in the gaps, and
      they blink at the END of a difficult sentence. That single correlation
      does more to make a face look like it is listening than any amount of
      brow movement, and it costs one term.  */
export function listenCarriage(env, hz, t, seed = 0) {
  const now = clamp01(envelopeAt(env, hz, t));
  const heard = clamp01(envelopeAt(env, hz, t - 0.33));      // what has landed
  const before = clamp01(envelopeAt(env, hz, t - 0.90));     // what it followed
  const rising = clamp01((heard - before) * 1.6);
  return {
    // a small nod on the beats that land, arriving a third of a second late
    pitch: smooth(heard) * 0.030 + rising * 0.022,
    yaw: Math.sin(t * 0.62 + seed * 1.9) * 0.022,
    roll: Math.sin(t * 0.47 + seed * 1.1) * 0.014,
    brow: clamp01((heard - 0.55) * 1.8) * 0.42,
    chest: 0.22 + 0.20 * heard,
    // the mouth: shut, with a slow press that is not a held pose
    press: 0.22 + 0.12 * Math.sin(t * 0.8 + seed),
    // 1 while they are concentrating, 0 in the gaps — multiply your blink by it
    blinkGate: 1 - smooth(clamp01(now * 1.4)),
  };
}
