/* ============================================================================
   glyphs.mjs — THE PICTURE MADE OF SOMETHING ELSE.

   Ken Knowlton spent the sixties at Bell Labs building images out of the wrong
   material: a reclining nude assembled from electronic circuit symbols, faces
   made of seashells, portraits tiled out of dominoes and dice. The trick is
   never the resolution. It is that the SUBSTANCE carries a second meaning, and
   the picture and the material argue with each other.

   This film's printer is already halfway there. dotBlit samples the stage,
   quantizes each cell into one of twelve density buckets, and stamps a circle
   whose radius is the bucket. Every part of Knowlton's method is present
   except the last step — the mark itself. Replace the circle and the same
   pipeline, the same law, the same eight levels produce a mosaic.

   FOUR ALPHABETS, and they are not decoration:

     WEIGHT   the neutral one: marks ordered purely by how much ink they hold,
              which is what a halftone cell is asking for.
     GREEK    the poem's own letters, ordered by density. The Odyssey printed
              in the alphabet it was composed in.
     SEA      the film's own vocabulary — wave, oar, hull, eye, knot, tree —
              so the image is built out of the things the story is about.
     SPOKEN   the line currently being said, written out across the frame in
              reading order. The face is made of its own sentence. This is the
              one that is properly Knowlton: the material is the meaning.

   THE RULE THAT MAKES IT WORK. A glyph set must be MONOTONIC in ink — index 0
   nearly blank, the last nearly solid — or the mosaic stops reading as an
   image and becomes texture. Each set below is ordered by measured coverage,
   not by taste, and `verifyMonotonic()` checks it at load.
========================================================================== */

export const SETS = {
  /* ordered by ink coverage; the classic ramp, which is monotonic by
     construction and is the control the others are judged against */
  weight: [" ", "·", ":", "-", "=", "+", "*", "o", "O", "#", "%", "@"],

  /* the poem's alphabet, sorted by how much of a cell each letter fills.
     Iota is a stroke; theta and phi are closed bowls; xi is three bars. */
  greek: [" ", "ι", "·", "τ", "λ", "γ", "π", "σ", "θ", "φ", "Ξ", "Ω"],

  /* the story's own furniture, lightest to heaviest */
  /* "█" measured 636 against a top of 180 — one mark three times heavier than
     the next, which collapses the top of the ramp onto a single glyph. Dropped;
     "◆" carries the dark end. */
  sea: [" ", "˙", "~", "∼", "≈", "⌐", "⊥", "†", "⋈", "▲", "◆"],
};

/* A glyph set that IS the line being spoken. Characters are laid across the
   frame in reading order and repeat; density picks the WEIGHT of the stamp,
   never which letter — the sentence must stay readable left to right or the
   whole idea collapses into noise. */
export function spokenSet(text) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  return t.length ? t : "ODYSSEUS";
}

/* ---------------------------------------------------------------------------
   glyphBlit — the same signature as dotBlit, with a mark instead of a dot.

   g       destination 2d context
   src     RGBA of the source stage
   SW,SH   source dimensions
   R       {x,y,w,h} crop of the source to show
   CW,CH   destination size
   cell    the halftone pitch
   opt     { set:"weight"|"greek"|"sea", text:"…", grade:fn, paper, ink }
--------------------------------------------------------------------------- */
export function glyphBlit(g, src, SW, SH, R, CW, CH, cell, opt = {}) {
  calibrate();
  const paper = opt.paper || "#fdfdfa", ink = opt.ink || "#0a0a0a";
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = paper; g.fillRect(0, 0, CW, CH);

  const useText = !!opt.text;
  const table = SETS[opt.set] || SETS.weight;
  const line = useText ? spokenSet(opt.text) : null;
  const grade = opt.grade || ((d) => d);

  const s = Math.min(CW / R.w, CH / R.h);
  const ox = (CW - R.w * s) / 2, oy = (CH - R.h * s) / 2;

  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = ink;

  /* ONE PASS, and the font size is set per cell rather than per bucket.
     Bucketing by size the way dotBlit buckets by radius would let the browser
     batch, but a glyph's ink is not linear in its point size and the ramp came
     out wrong when I tried it — the mid tones read heavier than the darks. So
     the size is computed from the graded density directly. */
  let i = 0;
  for (let y = cell / 2; y < CH; y += cell) {
    const fy = (y - oy) / s + R.y;
    if (fy < 0 || fy >= SH) continue;
    const row = (fy | 0) * SW;
    for (let x = cell / 2; x < CW; x += cell) {
      const fx = (x - ox) / s + R.x;
      if (fx < 0 || fx >= SW) continue;
      const k = (row + (fx | 0)) * 4;
      const lum = (src[k] * .299 + src[k + 1] * .587 + src[k + 2] * .114) / 255;
      let d = grade(1 - lum);
      if (d < 0.10) { if (useText) i++; continue; }      // keep the sentence moving
      const ch = useText ? line[i++ % line.length] : table[Math.min(table.length - 1,
        Math.floor(d * table.length * 0.999))];
      if (ch === " ") continue;
      const px = cell * (0.75 + d * 0.85);
      g.font = `${d > 0.72 ? 700 : 400} ${px.toFixed(1)}px ui-monospace, Menlo, monospace`;
      g.fillText(ch, x, y);
    }
  }
}

/* ── SORTED BY MEASUREMENT, NOT BY TASTE ────────────────────────────────────
   All three sets were hand-ordered and all three came back with breaks in the
   ramp — ":" is lighter than I thought and heavier than "-", "Ξ" is nearly
   blank at small sizes, "▲" and "◆" are identical. A glyph's ink is a fact
   about a font, not an opinion, so the order is measured once at load and the
   sets are re-sorted from that. The verifier below then has nothing to find,
   which is the point: the check does not police the author, it replaces them.
────────────────────────────────────────────────────────────────────────── */
/* ONE measurement, shared. The first version sorted at 32px and verified at
   30px, so the two disagreed about a pair of near-identical marks and the
   check reported a break that the sorter could not see. A verifier that
   measures differently from the thing it verifies is not a verifier. */
export function inkOf(ch, doc = globalThis.document) {
  const cv = doc.createElement("canvas"); cv.width = 44; cv.height = 44;
  const g = cv.getContext("2d", { willReadFrequently: true });
  g.fillStyle = "#fff"; g.fillRect(0, 0, 44, 44);
  g.fillStyle = "#000"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "32px ui-monospace, Menlo, monospace";
  g.fillText(ch, 22, 22);
  const d = g.getImageData(0, 0, 44, 44).data;
  let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 160) n++;
  return n;
}
let _sorted = false;
export function calibrate(doc = globalThis.document) {
  if (_sorted || !doc) return;
  for (const k of Object.keys(SETS)) {
    SETS[k] = SETS[k].map((ch) => [ch, inkOf(ch, doc)])
                     .sort((a, b) => a[1] - b[1])
                     .map(([ch]) => ch);
  }
  _sorted = true;
}

/** Every set must run light to heavy or the mosaic stops being an image.
 *  Measured, not asserted — this runs the glyphs through a canvas and counts. */
export function verifyMonotonic(name, doc = globalThis.document) {
  const set = SETS[name]; if (!set || !doc) return null;
  const cov = set.map((ch) => inkOf(ch, doc));
  let breaks = 0;
  for (let i = 1; i < cov.length; i++) if (cov[i] < cov[i - 1]) breaks++;
  return { set: name, coverage: cov, breaks, monotonic: breaks === 0 };
}

/* ---------------------------------------------------------------------------
   mixBlit — DOTS CARRY THE PICTURE, LETTERS CARRY THE EMPHASIS.

   Printing a whole frame in words fails twice at once: the text is not
   readable, because it is broken across a form, and the form is not legible,
   because letters are a terrible halftone. Both problems come from the same
   decision — using one mark for everything.

   So the frame prints in DOTS, which is what the dot law is for, and only the
   thing being used right now prints in WORDS. The letters stop being a texture
   and become a spotlight: the scar is written when he is being recognised by
   it, the bow when it is being strung, the speaker's face when the line is
   theirs. Everything else stays a picture.

   The mask is a second render of the SAME stage containing only the active
   element, so the boundary is exactly the thing's own silhouette rather than a
   box drawn around it. Where the mask has ink, the text prints; everywhere
   else, a dot.

   `invert` swaps them — the world in words and the subject in dots.

   ── SPOKEN INTO BEING ──────────────────────────────────────────────────────
   `spokenTo` is the fraction of the line that has actually been said, and it
   turns the mask into a WAVEFRONT. The letters are already laid down in
   READING ORDER — that was required to keep the sentence legible left to right
   — so a cut in that index is a cut in the sentence. Everything before the
   playhead has been spoken and has become picture; everything after it is
   still only text.

   So a line does not illustrate itself, it BECOMES itself: the frame is a page
   at the top of the line and a drawing by the end of it, and the boundary
   travels at the speed of the voice. `flow: "toText"` runs it the other way —
   a picture that is read back into words as it is described.

   This is the only place in the project where a rule is driven by the audio
   rather than by the clock, and it has to be: the wavefront is the voice.
--------------------------------------------------------------------------- */
export function mixBlit(g, src, mask, SW, SH, R, CW, CH, cell, opt = {}) {
  calibrate();
  const paper = opt.paper || "#fdfdfa", ink = opt.ink || "#0a0a0a";
  const grade = opt.grade || ((d) => d);
  const line = spokenSet(opt.text);
  const invert = !!opt.invert;
  const spokenTo = opt.spokenTo == null ? null : Math.max(0, Math.min(1, opt.spokenTo));
  const toText = opt.flow === "toText";
  const rMax = cell * 0.62;

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = paper; g.fillRect(0, 0, CW, CH);

  const s = Math.min(CW / R.w, CH / R.h);
  const ox = (CW - R.w * s) / 2, oy = (CH - R.h * s) / 2;

  /* dots first, in one batched path per density bucket — the same shape the
     film's own dotBlit uses, so the picture half of a mixed frame is printed
     by exactly the rule every other frame is printed by */
  const NB = 12, buckets = Array.from({ length: NB }, () => []);
  const glyphs = [];
  let i = 0;
  /* HOW MANY CELLS THE SENTENCE ACTUALLY OCCUPIES. The wavefront needs a
     denominator, and it is not the length of the string — it is the number of
     cells the mask gives the string to live in. Counting it up front is one
     extra pass over a grid of a few thousand cells, which is cheaper than
     being wrong about where "half way through the line" is. */
  let cellsHot = 0;
  if (spokenTo != null) {
    for (let y = cell / 2; y < CH; y += cell) {
      const fy = (y - oy) / s + R.y;
      if (fy < 0 || fy >= SH) continue;
      const row = (fy | 0) * SW;
      for (let x = cell / 2; x < CW; x += cell) {
        const fx = (x - ox) / s + R.x;
        if (fx < 0 || fx >= SW) continue;
        const k = (row + (fx | 0)) * 4;
        const d2 = grade(1 - (src[k] * .299 + src[k + 1] * .587 + src[k + 2] * .114) / 255);
        const m2 = mask ? 1 - (mask[k] * .299 + mask[k + 1] * .587 + mask[k + 2] * .114) / 255 : 0;
        if (d2 >= 0.10 && (invert ? m2 <= 0.08 : m2 > 0.08)) cellsHot++;
      }
    }
    if (!cellsHot) cellsHot = 1;
  }
  for (let y = cell / 2; y < CH; y += cell) {
    const fy = (y - oy) / s + R.y;
    if (fy < 0 || fy >= SH) continue;
    const row = (fy | 0) * SW;
    for (let x = cell / 2; x < CW; x += cell) {
      const fx = (x - ox) / s + R.x;
      if (fx < 0 || fx >= SW) continue;
      const k = (row + (fx | 0)) * 4;
      const d = grade(1 - (src[k] * .299 + src[k + 1] * .587 + src[k + 2] * .114) / 255);
      /* the mask decides WHICH mark, never whether there is one */
      const m = mask ? 1 - (mask[k] * .299 + mask[k + 1] * .587 + mask[k + 2] * .114) / 255 : 0;
      let hot = invert ? m <= 0.08 : m > 0.08;
      if (d < 0.10) { if (hot) i++; continue; }
      const n = i;
      if (hot) i++;
      /* the wavefront: reading order IS the timeline */
      if (hot && spokenTo != null) {
        const said = n < spokenTo * cellsHot;
        hot = toText ? !said : said ? false : true;
      }
      if (hot) glyphs.push(x, y, d, n);
      else buckets[Math.min(NB - 1, Math.floor(Math.pow(d, .9) * NB * .999))].push(x, y);
    }
  }
  g.fillStyle = ink;
  for (let b = 0; b < NB; b++) {
    const pts = buckets[b]; if (!pts.length) continue;
    const rad = Math.max(.5, (b + .6) / NB * rMax);
    g.beginPath();
    for (let k = 0; k < pts.length; k += 2) { g.moveTo(pts[k] + rad, pts[k + 1]); g.arc(pts[k], pts[k + 1], rad, 0, 7); }
    g.fill();
  }
  g.textAlign = "center"; g.textBaseline = "middle";
  for (let k = 0; k < glyphs.length; k += 4) {
    const x = glyphs[k], y = glyphs[k + 1], d = glyphs[k + 2], n = glyphs[k + 3];
    const px = cell * (0.85 + d * 0.95);
    g.font = `${d > 0.6 ? 700 : 500} ${px.toFixed(1)}px ui-monospace, Menlo, monospace`;
    g.fillText(line[n % line.length], x, y);
  }
  return { glyphCells: glyphs.length / 4, dotCells: buckets.reduce((a, b2) => a + b2.length / 2, 0) };
}

/* ---------------------------------------------------------------------------
   pageBlit — A PAGE THAT BECOMES A PLACE.

   Every mode above samples the image first and asks what mark to put in each
   cell. This one starts from the other end: it sets the passage as a PAGE —
   real lines, real word-wrapping, real reading order, uniform weight — and
   then lets the picture arrive by changing nothing but how hard each character
   is pressed.

   At emerge = 0 it is prose. You read it. Every glyph is the same weight, the
   lines break on spaces, and there is no image at all.
   At emerge = 1 the same characters, in the same places, are weighted by the
   density of the frame underneath them, and the page is a drawing.

   Nothing moves. Nothing fades in. The letters do not rearrange themselves
   into a shape — they are already exactly where the sentence put them. The
   only thing that changes is pressure, which means the reader and the viewer
   are looking at the same object and the question of which one they are doing
   is genuinely open.

   Monospace is not a style choice here: a fixed advance is what makes a line
   of prose and a column of halftone the same grid.
--------------------------------------------------------------------------- */
export function pageBlit(g, src, SW, SH, R, CW, CH, cell, opt = {}) {
  const paper = opt.paper || "#fdfdfa", ink = opt.ink || "#0a0a0a";
  const grade = opt.grade || ((d) => d);
  const emerge = Math.max(0, Math.min(1, opt.emerge == null ? 1 : opt.emerge));
  const text = spokenSet(opt.text);
  const lh = cell * 1.62;                       // leading, so it reads as a page

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = paper; g.fillRect(0, 0, CW, CH);
  g.textAlign = "left"; g.textBaseline = "middle";
  g.fillStyle = ink;

  const pad = Math.max(10, cell * 1.2);
  const cols = Math.max(8, Math.floor((CW - pad * 2) / cell));
  const rows = Math.max(2, Math.floor((CH - pad * 2) / lh));

  /* wrap on spaces, the way a page does — a line that breaks mid-word stops
     being prose and the whole premise goes with it */
  const words = text.split(" ");
  const lines = []; let cur = "";
  for (let w = 0; w < words.length && lines.length < rows; w++) {
    const nxt = cur ? cur + " " + words[w] : words[w];
    if (nxt.length <= cols) cur = nxt;
    else { lines.push(cur); cur = words[w]; }
    if (w === words.length - 1) { lines.push(cur); cur = ""; }
    /* the passage repeats until the page is full: a text film has to fill the
       frame, and a short line would otherwise leave the bottom half blank */
    if (w === words.length - 1 && lines.length < rows) w = -1;
  }

  const s = Math.min(CW / R.w, CH / R.h);
  const ox = (CW - R.w * s) / 2, oy = (CH - R.h * s) / 2;

  for (let r = 0; r < Math.min(rows, lines.length); r++) {
    const y = pad + lh * (r + 0.5);
    const ln = lines[r];
    for (let c = 0; c < ln.length; c++) {
      const ch = ln[c]; if (ch === " ") continue;
      const x = pad + c * cell;
      /* the frame under this character */
      const fx = (x + cell / 2 - ox) / s + R.x, fy = (y - oy) / s + R.y;
      let d = 0.5;
      if (fx >= 0 && fx < SW && fy >= 0 && fy < SH) {
        const k = ((fy | 0) * SW + (fx | 0)) * 4;
        d = grade(1 - (src[k] * .299 + src[k + 1] * .587 + src[k + 2] * .114) / 255);
      }
      /* prose weight -> picture weight. At emerge 0 every glyph is identical,
         which is the only state in which this is readable. */
      const w2 = 0.52 * (1 - emerge) + d * emerge;
      const px = cell * (0.86 + w2 * 0.55);
      const wt = w2 > 0.62 ? 700 : w2 > 0.3 ? 500 : 300;
      g.globalAlpha = 0.30 + 0.70 * (0.6 * (1 - emerge) + w2 * emerge);
      g.font = `${wt} ${px.toFixed(1)}px ui-monospace, Menlo, monospace`;
      g.fillText(ch, x, y);
    }
  }
  g.globalAlpha = 1;
  return { lines: lines.length, cols };
}

/* ---------------------------------------------------------------------------
   breathBlit — THE TEXT BREATHED ALIVE.

   Every mode so far decides letter OR dot, per cell, and switches. A switch is
   the crudest possible transition: at any instant a cell is one thing or the
   other, so the change happens at the boundary and nowhere else, and the frame
   never looks like it is in the middle of anything.

   Here each cell holds BOTH and trades between them. The letter shrinks while
   a dot grows in the same place — no fade, no alpha, no crossfade, because
   this world does not have those. Size is the only channel the dot law leaves
   open and it is enough: a glyph at 15% of its size reads as a mark, a dot at
   15% of its radius reads as nothing yet, and the frames in between are the
   ones worth watching.

   And it BREATHES rather than sliding: the morph is a travelling wave, so at
   any instant part of the frame is prose, part is picture, and a soft front
   moves through the middle of it. A global slider changes the whole page at
   once, which reads as a dissolve. A wave reads as something alive doing it.

     wave.dir    the axis the breath travels along, in radians
     wave.len    how long the front is, as a fraction of the frame — a short
                 front is a wipe, a long one is the whole page inhaling
     wave.phase  where the front is now: drive it from a clock, a voice, or a
                 hand on a slider
--------------------------------------------------------------------------- */
export function breathBlit(g, src, SW, SH, R, CW, CH, cell, opt = {}) {
  calibrate();
  const paper = opt.paper || "#fdfdfa", ink = opt.ink || "#0a0a0a";
  const grade = opt.grade || ((d) => d);
  const line = spokenSet(opt.text);
  const W = opt.wave || {};
  const dir = W.dir == null ? 0.6 : W.dir;
  const len = Math.max(0.05, W.len == null ? 0.55 : W.len);
  const phase = W.phase == null ? 0.5 : W.phase;
  const back = !!opt.back;                     // picture -> text instead
  const ca = Math.cos(dir), sa = Math.sin(dir);

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = paper; g.fillRect(0, 0, CW, CH);
  g.textAlign = "center"; g.textBaseline = "middle";

  const s = Math.min(CW / R.w, CH / R.h);
  const ox = (CW - R.w * s) / 2, oy = (CH - R.h * s) / 2;
  const rMax = cell * 0.62;
  let i = 0, mid = 0;

  for (let y = cell / 2; y < CH; y += cell) {
    const fy = (y - oy) / s + R.y;
    if (fy < 0 || fy >= SH) continue;
    const row = (fy | 0) * SW;
    for (let x = cell / 2; x < CW; x += cell) {
      const fx = (x - ox) / s + R.x;
      if (fx < 0 || fx >= SW) continue;
      const k = (row + (fx | 0)) * 4;
      const d = grade(1 - (src[k] * .299 + src[k + 1] * .587 + src[k + 2] * .114) / 255);
      if (d < 0.10) { i++; continue; }

      /* where this cell sits along the breath's axis, 0..1 */
      const u = ((x / CW) * ca + (y / CH) * sa + 1) / (1 + Math.abs(ca) + Math.abs(sa));
      /* the front: a smooth ramp `len` wide, centred on phase */
      let m = (phase - u) / len + 0.5;
      m = m < 0 ? 0 : m > 1 ? 1 : m * m * (3 - 2 * m);
      if (back) m = 1 - m;
      if (m > 0.02 && m < 0.98) mid++;

      /* the letter, shrinking */
      if (m < 0.985) {
        const px = cell * (0.86 + d * 0.55) * (1 - m);
        if (px > 1.2) {
          g.fillStyle = ink;
          g.font = `${d > 0.6 ? 700 : 500} ${px.toFixed(1)}px ui-monospace, Menlo, monospace`;
          g.fillText(line[i % line.length], x, y);
        }
      }
      /* the dot, growing in the same cell */
      if (m > 0.015) {
        const rad = Math.pow(d, 0.9) * rMax * m;
        if (rad > 0.35) {
          g.fillStyle = ink;
          g.beginPath(); g.arc(x, y, rad, 0, 6.2832); g.fill();
        }
      }
      i++;
    }
  }
  return { inTransition: mid };
}

export const GLYPH_VERSION = "glyphs/1.3.0";
