/* location.olympian-decision-space — the Olympian council hall REDUCED to a
   two-speaker judgment configuration. LOCATION asset (OD-B24-S07). An EMPTY
   navigable set — NO baked figures. Solid grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone.

   NOT A SECOND COUNCIL HALL. This is the same architecture as
   location.olympian-council-hall — the same cloud sill, the same fluted order,
   the same council ring — struck down to the configuration Book XXIV needs: two
   speakers, one question, one verdict. The whole design idea is SUBTRACTION made
   visible. The twelve places of the full assembly are still surveyed on the
   floor, but ten of them are dashed and empty, their benches struck and stacked;
   only the two at the ends of the ring's long axis are inked solid and given a
   fixture. The hall is legibly the hall, minus its assembly.

   THE ONE AXIS. Everything resolves onto the line between `station:petitioner`
   (west, a low rostrum — the god who asks) and `station:judge` (east, the dais
   and seat — the god who answers). They sit at the two ends of the ring's long
   axis and are therefore the maximum distance apart the room allows: a contact
   pair by construction, never one coordinate. The balance stands at the ring's
   centre, on the axis, exactly between them — the verdict is a piece of set
   dressing that MOVES, so a scene can render the decision without a caption.

   NOTHING SPANS THE FRAME. The back wall is three separate panels at three
   heights with open sky in the gaps (that is also what "reduced" looks like from
   the outside). The floor courses are three staggered runs. The dais is stepped
   in broken returns. The balance beam is 17% of the width. No terrace, cornice
   or bench crosses the picture.

   TONE. A bright chamber: sky and floor at ink level 1–2, the order at 2–3, and
   levels 5–6 spent only on the throne recess, the balance pivot, the tally cuts
   and the pans. The paper does most of the work.

   COUNTS ARE GEOMETRY. The two speaking stations are numbered on steles as
   stacked tally bars (I, II). Small type dissolves in the dot lattice; bars
   do not.

   States: "judgment" (default — two stations struck in, the beam level),
   "convened" (every place still benched, before the reduction), "war" and
   "peace" (the same set with the beam fallen one way or the other),
   "survey" (all zones and the full ring struck in for previs), "bare" (the
   walking set only).

   Atlas: OD-B24-S07 — reused council hall reduced to two-speaker judgment
   configuration. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const MODES = ["judgment", "convened", "war", "peace", "survey", "bare"];

const params = {
  horizon:0.560,     // the cloud sill: chamber floor meets open sky
  places:12,         // the full council ring the hall was built for
  seated:2,          // how many are struck in for this configuration
  columns:4,         // the order, reduced to two piers a side
  tilt:0,            // balance beam: +1 the west pan falls, -1 the east pan falls
  zonesLit:false,    // survey rings + station crosses struck in
};

/* ---------- THE COUNCIL RING ----------
   One shallow floor ellipse, drawn once and read everywhere. Place 0 sits due
   west, place 6 due east: those two are the ends of the judgment axis and the
   only ones this configuration seats. The three frontmost places fall under
   camera and are not drawn. */
const RING = { cx:0.500, cy:0.752, rx:0.330, ry:0.112 };
const SKIP = new Set([8, 9, 10]);                 // under camera, not drawn
const SEATS = { 0:"petitioner", 6:"judge" };      // the reduced configuration

function placeN(i){
  const a = Math.PI + i * (Math.PI*2 / params.places);
  return { x:RING.cx + Math.cos(a)*RING.rx, y:RING.cy + Math.sin(a)*RING.ry };
}

/* THE ONE DEPTH LADDER: floor height -> scale, so a bench at the back of the
   ring and a stele at the near edge agree about the size of the world. */
const NEAR_Y = 1.020;
const groundU = y => clamp((y - params.horizon) / (NEAR_Y - params.horizon), 0, 1);
const depthAtY = y => lerp(0.560, 1.000, Math.pow(groundU(y), 0.90));

/* ---------- the back wall: THREE panels, three heights, sky in the gaps ------
   { x0, x1, h: height as a fraction of H, n: empty niches in the face }.
   The niches are where the struck gods stood; leaving them cut and empty is how
   the wall says "reduced". The gap between panels 2 and 3 is the descent
   threshold — the way out of the frame toward Ithaca. */
const PANELS = [
  { x0:0.030, x1:0.268, h:0.250, n:2 },
  { x0:0.344, x1:0.560, h:0.196, n:1 },
  { x0:0.660, x1:0.940, h:0.238, n:2 },
];
/* ---------- the order: two piers a side, at two depths, carrying the beams --- */
const COLUMNS = [
  { x:0.086, base:0.700, h:0.470, w:0.050 },
  { x:0.252, base:0.638, h:0.386, w:0.038 },
  { x:0.752, base:0.638, h:0.386, w:0.038 },
  { x:0.918, base:0.700, h:0.470, w:0.050 },
];
/* ---------- the architrave: two short beams carried by the piers, with open
   sky between them. [x0, x1, y] — neither is wider than a quarter frame, and
   nothing spans the middle: the middle is where the sky comes in. ---------- */
const BEAMS = [
  [0.046, 0.292, 0.222],
  [0.712, 0.958, 0.222],
];

/* ---------- THE BANK: the assembly's benches, ranged on a wider arc BEHIND the
   order. Keeping them off the ring is what stops the struck furniture from
   landing on top of the two fixtures — the ring stays a clean survey and the
   piers stand in front of the bank. Five benches, all struck. ---------- */
const BANK = { cx:0.500, cy:0.742, rx:0.400, ry:0.148, n:5, a0:238, a1:302 };
function bankN(i){
  const d = (BANK.a0 + i*(BANK.a1 - BANK.a0)/(BANK.n - 1)) * Math.PI/180;
  return { x:BANK.cx + Math.cos(d)*BANK.rx, y:BANK.cy + Math.sin(d)*BANK.ry };
}

/* ---------- anchors: taken from the ring and the ladder, never hand-tuned --- */
const P3 = v => +clamp(v, 0, 1).toFixed(3);
const pn = i => { const p = placeN(i); return { x:P3(p.x), y:P3(p.y) }; };
export const anchors = (() => {
  const a = {
    "station:petitioner": pn(0),
    "station:judge":      pn(6),
    "rostrum:west":       pn(0),
    "throne:east":        pn(6),
    "axis:centre":        { x:P3(RING.cx),         y:P3(RING.cy) },
    "axis:west-quarter":  { x:P3(RING.cx - RING.rx*0.50), y:P3(RING.cy + 0.008) },
    "axis:east-quarter":  { x:P3(RING.cx + RING.rx*0.50), y:P3(RING.cy + 0.008) },
    "meet:axis_l":        { x:P3(RING.cx - 0.062), y:P3(RING.cy + 0.030) },
    "meet:axis_r":        { x:P3(RING.cx + 0.062), y:P3(RING.cy + 0.022) },
    "balance:pivot":      { x:P3(RING.cx),         y:0.646 },
    "balance:pan-west":   { x:P3(RING.cx - 0.086), y:0.712 },
    "balance:pan-east":   { x:P3(RING.cx + 0.086), y:0.712 },
    "stele:1-petitioner": { x:0.158, y:0.886 },
    "stele:2-judge":      { x:0.846, y:0.906 },
    "threshold:descent":  { x:0.610, y:0.430 },   // the sky gap: the way to Ithaca
    "threshold:sill":     { x:0.500, y:0.560 },
    "entrance:west":      { x:0.030, y:0.928 },
    "exit:east":          { x:0.970, y:0.940 },
    "entrance:stair":     { x:0.500, y:0.988 },   // up out of the near edge
    "camera:wide":        { x:0.500, y:0.548 },
    "camera:axis":        { x:0.500, y:0.742 },
    "camera:judge":       { x:0.782, y:0.722 },
    "camera:petitioner":  { x:0.218, y:0.722 },
    "camera:balance":     { x:0.500, y:0.672 },
  };
  let v = 0;
  for (let i = 0; i < params.places; i++){
    if (SKIP.has(i) || SEATS[i]) continue;
    a[`place:vacant-${++v}`] = pn(i);
  }
  for (let i = 0; i < BANK.n; i++){
    const p = bankN(i);
    a[`bench:struck-${i+1}`] = { x:P3(p.x), y:P3(p.y) };
  }
  return a;
})();

/* ================= small stamps ================= */

/* a wall panel: a mid face, a short cornice that stops with the panel, broken
   courses, and n EMPTY NICHES cut into it — the places the struck gods stood.
   Wide flat shapes are FILLED; only the panel edge is inked. */
function panel(pen, g, W, H, p, T){
  const { x0, x1, h:hh, n } = p;
  const y = params.horizon*H, top = y - hh*H, w = (x1-x0)*W;
  pen.paint(() => { g.rect(x0*W, top, w, hh*H); }, toneSolid(inkLevel(T.wall)), 3.8);
  pen.paint(() => { g.rect(x0*W - W*0.012, top - H*0.016, w + W*0.024, H*0.016); },
            toneSolid(inkLevel(T.capital)), 3.2);
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.8; g.globalAlpha = 0.24;
  for (let i = 1; i < 4; i++){
    const yy = top + hh*H*i/4;
    const inset = (i % 2) ? 0.10 : 0.30;                    // courses never run the full face
    g.beginPath();
    g.moveTo(lerp(x0, x1, inset*0.5)*W, yy); g.lineTo(lerp(x0, x1, 1 - inset)*W, yy);
    g.stroke();
  }
  g.restore();
  /* the empty niches: RECESSES, so darker than the face they are cut into, each
     with a bare pale plinth at its foot. A niche lighter than its wall reads as
     a window; this has to read as a place with nobody in it. */
  const nw = w/(n + 1.1), nh = hh*H*0.44;
  for (let i = 0; i < n; i++){
    const nx = x0*W + w*(i + 0.5)/n - nw*0.36;
    const ny = top + hh*H*0.26;
    pen.paint(() => { g.rect(nx, ny, nw*0.72, nh); }, toneSolid(inkLevel(T.niche)), 2.8);
    pen.paint(() => { g.rect(nx + nw*0.60, ny, nw*0.12, nh); },
              toneSolid(inkLevel(T.wall)), 1.6);
    pen.paint(() => { g.rect(nx - nw*0.07, ny + nh, nw*0.86, H*0.015); },
              toneSolid(inkLevel(T.pale)), 2.4);
  }
}

/* a beam of the architrave, with dentils above it. Short by construction. */
function beam(pen, g, W, H, x0, x1, y, T){
  const w = (x1-x0)*W;
  pen.paint(() => { g.rect(x0*W, y*H, w, H*0.026); }, toneSolid(inkLevel(T.stone)), 3.4);
  pen.paint(() => { g.rect(x0*W - W*0.008, y*H - H*0.014, w + W*0.016, H*0.014); },
            toneSolid(inkLevel(T.pale)), 2.8);
  const n = Math.max(3, Math.round(w/(W*0.052)));
  for (let i = 0; i < n; i++)
    pen.paint(() => { g.rect(x0*W + w*(i + 0.22)/n, y*H + H*0.026, w*0.36/n, H*0.013); },
              toneSolid(inkLevel(T.capital)), 1.6);
}

/* a fluted pier: light shaft, darker capital and plinth, flutes as faint rules */
function column(pen, g, W, H, c, T){
  const cx = c.x*W, base = c.base*H, h = c.h*H, w = c.w*W;
  pen.paint(() => { g.rect(cx - w/2, base - h, w, h); }, toneSolid(inkLevel(T.column)), 3.6);
  pen.paint(() => { g.rect(cx - w*0.82, base - h - h*0.045, w*1.64, h*0.045); },
            toneSolid(inkLevel(T.capital)), 3);
  pen.paint(() => { g.rect(cx - w*0.74, base - h*0.052, w*1.48, h*0.052); },
            toneSolid(inkLevel(T.stone)), 3);
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.6; g.globalAlpha = 0.30;
  for (const u of [0.30, 0.50, 0.70]){
    g.beginPath();
    g.moveTo(cx - w/2 + w*u, base - h + h*0.08);
    g.lineTo(cx - w/2 + w*u, base - h*0.10);
    g.stroke();
  }
  g.restore();
  g.save(); g.fillStyle = inkLevel(T.flat);
  g.beginPath(); g.ellipse(cx, base + H*0.006, w*0.95, H*0.008, 0, 0, 7); g.fill(); g.restore();
}

/* a vacated place on the ring: the survey disc and nothing else. An empty place
   is a mark on the floor, not an object. */
function vacantPlace(pen, g, W, H, p, s, T, lit){
  const cx = p.x*W, cy = p.y*H;
  const rx = W*0.048*s, ry = H*0.014*s;
  g.save();
  g.strokeStyle = INK; g.lineWidth = lit ? 3.4 : 2.9; g.globalAlpha = lit ? 0.80 : 0.56;
  g.setLineDash([W*0.012*s, W*0.010*s]);
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.stroke();
  g.setLineDash([]);
  // a short lead in from the bank behind, so the place is attached to a bench
  g.lineWidth = 2; g.globalAlpha = 0.34; g.setLineDash([W*0.008, W*0.009]);
  g.beginPath(); g.moveTo(cx, cy - ry); g.lineTo(cx, cy - ry - H*0.022*s); g.stroke();
  g.setLineDash([]); g.restore();
}

/* a struck bench on the bank: a real block, and one thick bar cut across the
   seat. Absence has to be legible, so the bench keeps its mass against the pale
   floor and the cancellation is a mark you cannot lose in the lattice. */
function struckBench(pen, g, W, H, p, s, T, lit){
  const cx = p.x*W, cy = p.y*H;
  const bw = W*0.086*s, bh = H*0.046*s;
  g.save(); g.fillStyle = inkLevel(T.flat);
  g.beginPath(); g.ellipse(cx, cy + H*0.004*s, bw*0.62, H*0.010*s, 0, 0, 7); g.fill(); g.restore();
  pen.paint(() => { g.rect(cx - bw/2, cy - bh, bw, bh); }, toneSolid(inkLevel(T.bench)), 3);
  pen.paint(() => { g.rect(cx - bw*0.58, cy - bh - H*0.014*s, bw*1.16, H*0.014*s); },
            toneSolid(inkLevel(T.pale)), 2.6);
  // the back-rest, stopped short of the bench ends so the bank is never a rail
  pen.paint(() => { g.rect(cx - bw*0.40, cy - bh - H*0.044*s, bw*0.80, H*0.030*s); },
            toneSolid(inkLevel(T.stone)), 2.4);
  g.save(); g.strokeStyle = INK; g.lineWidth = Math.max(3.4, 6*s); g.lineCap = "butt";
  g.globalAlpha = lit ? 1 : 0.86;
  g.beginPath();
  g.moveTo(cx - bw*0.56, cy - bh*0.06); g.lineTo(cx + bw*0.56, cy - bh - H*0.040*s);
  g.stroke(); g.restore();
}

/* a struck-in station: paper disc, hard contour, and a surveyed cross so a scene
   can see where the body goes. Level 0 — the brightest solid in the set. */
function station(pen, g, W, H, p, s, T, lit){
  const cx = p.x*W, cy = p.y*H, rx = W*0.062*s, ry = H*0.018*s;
  pen.paint(() => { g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(T.paper)), 3.4);
  g.save(); g.strokeStyle = INK; g.lineWidth = lit ? 3.2 : 2;
  g.globalAlpha = lit ? 0.86 : 0.28;
  g.setLineDash([W*0.012, W*0.010]);
  g.beginPath(); g.ellipse(cx, cy, rx*1.22, ry*1.34, 0, 0, 7); g.stroke();
  g.setLineDash([]);
  if (lit){
    g.lineWidth = 3.2; g.globalAlpha = 0.92;
    g.beginPath();
    g.moveTo(cx - W*0.013, cy); g.lineTo(cx + W*0.013, cy);
    g.moveTo(cx, cy - H*0.010); g.lineTo(cx, cy + H*0.010);
    g.stroke();
  }
  g.restore();
}

/* THE JUDGE'S SEAT: a stepped dais in broken returns with a blocky throne. The
   only dark in the east half is the recess under the seat. */
function throneFixture(pen, g, W, H, p, T){
  const cx = p.x*W, base = p.y*H;
  const dw = W*0.150, dh = H*0.020;
  // two steps, each a shorter return than the one below — never one long slab
  pen.paint(() => { g.rect(cx - dw*0.50, base - dh, dw, dh); }, toneSolid(inkLevel(T.stone)), 3);
  pen.paint(() => { g.rect(cx - dw*0.36, base - dh*2.0, dw*0.72, dh); },
            toneSolid(inkLevel(T.pale)), 2.8);
  const ty = base - dh*2.0;
  const tw = W*0.104, th = H*0.128;
  pen.paint(() => { g.rect(cx - tw*0.50, ty - th, tw, th); }, toneSolid(inkLevel(T.pale)), 3.6);
  // the seat plate and the recess beneath it — the one dark accent of the east
  pen.paint(() => { g.rect(cx - tw*0.62, ty - th*0.44, tw*1.24, th*0.14); },
            toneSolid(inkLevel(T.stone)), 3);
  pen.paint(() => { g.rect(cx - tw*0.34, ty - th*0.28, tw*0.68, th*0.18); },
            toneSolid(inkLevel(T.dark)), 2.2);
  // arms, stopped short of the floor
  for (const sd of [-1, 1])
    pen.paint(() => { g.rect(cx + sd*tw*0.50 - tw*0.09, ty - th*0.48, tw*0.18, th*0.34); },
              toneSolid(inkLevel(T.capital)), 2.6);
  // the back's crown — a stepped finial, so the silhouette is cut and not tapered
  pen.paint(() => { g.rect(cx - tw*0.34, ty - th - H*0.020, tw*0.68, H*0.020); },
            toneSolid(inkLevel(T.capital)), 2.8);
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.8; g.globalAlpha = 0.30;
  for (const u of [0.34, 0.52, 0.70]){
    g.beginPath(); g.moveTo(cx - tw*0.34, ty - th*u); g.lineTo(cx + tw*0.34, ty - th*u); g.stroke();
  }
  g.restore();
}

/* THE PETITIONER'S ROSTRUM: a low round block with a single step and a rail —
   somewhere to stand and ask, deliberately smaller than the seat opposite. */
function rostrumFixture(pen, g, W, H, p, T){
  const cx = p.x*W, base = p.y*H;
  const rw = W*0.104, rh = H*0.062;
  // one step, then the drum: a single pale mass, so it is not a stack of boxes
  pen.paint(() => { g.rect(cx - rw*0.62, base - H*0.016, rw*1.24, H*0.016); },
            toneSolid(inkLevel(T.stone)), 3);
  pen.paint(() => { g.rect(cx - rw*0.50, base - H*0.016 - rh, rw, rh); },
            toneSolid(inkLevel(T.pale)), 3.6);
  // the speaking plate: a dark rim on top so the drum turns and reads as a place
  const ry = base - H*0.016 - rh;
  pen.paint(() => { g.rect(cx - rw*0.58, ry - H*0.016, rw*1.16, H*0.016); },
            toneSolid(inkLevel(T.capital)), 3);
  // the standard that carries the speaker's staff-rest — one upright, off centre
  pen.paint(() => { g.rect(cx + rw*0.30, ry - H*0.076, W*0.013, H*0.060); },
            toneSolid(inkLevel(T.stone)), 2.6);
  pen.paint(() => { g.rect(cx + rw*0.14, ry - H*0.086, rw*0.52, H*0.014); },
            toneSolid(inkLevel(T.capital)), 2.4);
}

/* THE BALANCE: the verdict as a fixture. A standard on the axis, a short beam,
   two pans on cords. `tilt` swings it: +1 the west pan falls (the petition
   carries), -1 the east pan falls. The pivot is the darkest mark in the set. */
function balance(pen, g, W, H, tilt, T){
  const cx = RING.cx*W, foot = (RING.cy + 0.048)*H;
  const pivotY = 0.646*H;
  // the standard: a stepped plinth and a shaft, both narrow
  pen.paint(() => { g.rect(cx - W*0.038, foot - H*0.014, W*0.076, H*0.014); },
            toneSolid(inkLevel(T.stone)), 3);
  pen.paint(() => { g.rect(cx - W*0.026, foot - H*0.026, W*0.052, H*0.012); },
            toneSolid(inkLevel(T.pale)), 2.6);
  pen.paint(() => { g.rect(cx - W*0.012, pivotY, W*0.024, foot - H*0.026 - pivotY); },
            toneSolid(inkLevel(T.column)), 3.2);
  // the beam — 17% of the frame, and it stops at its own pans
  // NOTE the sign: +tilt must drop the WEST pan, and +y is down the frame, so
  // the beam angle is the negation of the tilt.
  const half = W*0.086, a = -tilt*0.20;
  const ex = { x:cx + Math.cos(a)*half,  y:pivotY + Math.sin(a)*half };
  const wx = { x:cx - Math.cos(a)*half,  y:pivotY - Math.sin(a)*half };
  g.save(); g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = "round";
  g.beginPath(); g.moveTo(wx.x, wx.y); g.lineTo(ex.x, ex.y); g.stroke();
  g.lineWidth = 3.4; g.strokeStyle = inkLevel(T.pale);
  g.beginPath(); g.moveTo(wx.x, wx.y); g.lineTo(ex.x, ex.y); g.stroke(); g.restore();
  // the pivot
  pen.paint(() => { g.arc(cx, pivotY, W*0.017, 0, 7); }, toneSolid(inkLevel(T.dark)), 3);
  // the pans, hung level whatever the beam does
  for (const e of [wx, ex]){
    const cord = H*0.050;
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.2; g.globalAlpha = 0.72;
    g.beginPath();
    g.moveTo(e.x, e.y); g.lineTo(e.x - W*0.022, e.y + cord);
    g.moveTo(e.x, e.y); g.lineTo(e.x + W*0.022, e.y + cord);
    g.stroke(); g.restore();
    pen.paint(() => { g.ellipse(e.x, e.y + cord, W*0.030, H*0.010, 0, 0, 7); },
              toneSolid(inkLevel(T.paper)), 3);
    pen.paint(() => { g.rect(e.x - W*0.030, e.y + cord, W*0.060, H*0.007); },
              toneSolid(inkLevel(T.stone)), 2.2);
  }
}

/* a numbering stele: a light post whose ordinal is cut as stacked DARK tally
   bars. The post is sized FROM the bars — a bar under ~6px dissolves in the
   lattice, so the count sets the height and never the other way round. */
function stele(pen, g, W, H, x, base, s, n, T){
  const bh = Math.max(7, H*0.0150*s), gap = Math.max(5, H*0.0090*s);
  const pad = Math.max(8, H*0.017*s);
  const pw = Math.max(15, W*0.034*s), ph = pad*2 + n*bh + (n-1)*gap;
  pen.paint(() => { g.rect(x - pw/2, base - ph, pw, ph); }, toneSolid(inkLevel(T.paper)), 3.4);
  pen.paint(() => { g.rect(x - pw*0.78, base - ph - H*0.013*s - 4, pw*1.56, H*0.013*s + 4); },
            toneSolid(inkLevel(T.stone)), 2.8);
  const top = base - ph + pad;
  for (let i = 0; i < n; i++)
    pen.paint(() => { g.rect(x - pw*0.30, top + i*(bh + gap), pw*0.60, bh); },
              toneSolid(inkLevel(T.dark)), 1.2);
  g.save(); g.fillStyle = inkLevel(T.flat);
  g.beginPath(); g.ellipse(x, base + H*0.005*s, pw*1.10, H*0.008*s, 0, 0, 7); g.fill(); g.restore();
}

/* ================= the set ================= */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = MODES.includes(st.state) ? st.state : "judgment";
  const zones = (st.zonesLit ?? params.zonesLit) || mode === "survey";
  const convened = mode === "convened";
  const tilt = typeof st.tilt === "number" ? clamp(st.tilt, -1, 1)
             : mode === "peace" ? 0.62 : mode === "war" ? -0.62 : params.tilt;
  const layers = st.layers || (mode === "bare"
    ? ["sky", "panels", "floor", "columns", "ring", "fixtures"]
    : ["sky", "panels", "beams", "floor", "courses", "tiers", "columns", "ring",
       "fixtures", "balance", "marks", "fg"]);
  const has = l => layers.includes(l);

  /* tone table — a bright chamber. The floor and the sky are level 1 so the
     frame stays paper; the wall sits at 3 and the struck benches at 4 so
     absence is legible against it; 5–6 is spent only on the throne's recess,
     the balance pivot and the tally cuts. Level 0 is reserved for the two
     struck-in stations, the pans and the stele faces — the brightest solids. */
  const T = { paper:0, sky:1, cloud:2, pale:1, floor:1, wall:3, niche:5, column:2,
              stone:3, flat:3, capital:4, bench:3, dark:6 };

  const hz = params.horizon * H;

  /* ---- SKY beyond the sill: a pale field with slack cloud banks at four
     heights. Filled, never outlined — an outlined flat ellipse is a horizontal
     rule, and rules stripe. ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, hz);
    g.fillStyle = inkLevel(T.cloud);
    for (const [x, y, rx] of [[0.24, 0.30, 0.130], [0.64, 0.46, 0.112], [0.40, 0.64, 0.100]]){
      g.beginPath(); g.ellipse(x*W, y*hz, rx*W, H*0.014, 0, 0, 7); g.fill();
    }
    g.fillStyle = inkLevel(T.cloud + 1);
    g.beginPath(); g.ellipse(W*0.80, hz*0.22, W*0.150, H*0.011, 0, 0, 7); g.fill();
    g.beginPath(); g.ellipse(W*0.10, hz*0.74, W*0.090, H*0.010, 0, 0, 7); g.fill();
  }

  /* ---- THE BACK WALL, reduced to three panels with sky in the gaps. The gap
     between the second and third is the descent threshold. ---- */
  if (has("panels")){
    for (const p of PANELS) panel(pen, g, W, H, p, T);
    // the descent threshold: two jambs and a lintel across the widest gap, with
    // a dashed head above — an opening onto the sky, not a door
    const h2 = PANELS[1].h, gx0 = PANELS[1].x1, gx1 = PANELS[2].x0;
    const jt = hz - h2*H*1.08;
    for (const jx of [gx0, gx1])
      pen.paint(() => { g.rect(jx*W - W*0.011, jt, W*0.022, hz - jt); },
                toneSolid(inkLevel(T.stone)), 2.8);
    pen.paint(() => { g.rect(gx0*W - W*0.024, jt - H*0.020, (gx1-gx0)*W + W*0.048, H*0.020); },
              toneSolid(inkLevel(T.capital)), 3);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.42;
    g.setLineDash([W*0.014, W*0.012]);
    g.beginPath();
    g.moveTo(gx0*W, jt - H*0.044);
    g.lineTo(lerp(gx0, gx1, 0.5)*W, jt - H*0.072);
    g.lineTo(gx1*W, jt - H*0.044);
    g.stroke(); g.setLineDash([]); g.restore();
    // the cloud sill: filled lobes where the floor runs out into open sky, so
    // the horizon in the gaps is weather and not a ruled line
    g.save(); g.fillStyle = inkLevel(T.cloud);
    for (const [x, rx] of [[0.306, 0.062], [0.610, 0.070], [0.988, 0.048], [0.012, 0.044]]){
      g.beginPath(); g.ellipse(x*W, hz + H*0.004, rx*W, H*0.013, 0, 0, 7); g.fill();
    }
    g.restore();
  }

  /* ---- THE ARCHITRAVE: three short beams over the order, open sky between ---- */
  if (has("beams")) for (const [x0, x1, y] of BEAMS) beam(pen, g, W, H, x0, x1, y, T);

  /* ---- THE FLOOR: pale, so the room is read off its furniture ---- */
  if (has("floor")){ g.fillStyle = inkLevel(T.floor); g.fillRect(0, hz, W, H - hz); }

  /* ---- FLOOR COURSES: staggered runs at four depths, plus a broken radial
     score off the ring's centre. Never a line across the frame. ---- */
  if (has("courses")){
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.30;
    for (const [x0, x1, y] of [[0.052, 0.406, 0.646], [0.286, 0.742, 0.812],
                               [0.598, 0.946, 0.704], [0.118, 0.492, 0.918]]){
      g.beginPath(); g.moveTo(x0*W, y*H); g.lineTo(x1*W, y*H); g.stroke();
    }
    g.lineWidth = 2.1; g.globalAlpha = 0.20;
    for (let i = -5; i <= 5; i++){
      if (!i) continue;
      const a = Math.PI/2 + i*0.148;
      const r0 = W*0.10, r1 = W*0.70;
      g.beginPath();
      g.moveTo(RING.cx*W + Math.cos(a)*r0, RING.cy*H + Math.sin(a)*r0*0.34);
      g.lineTo(RING.cx*W + Math.cos(a)*r1, RING.cy*H + Math.sin(a)*r1*0.34);
      g.stroke();
    }
    g.restore();
  }

  /* ---- THE BANK: the assembly's benches, every one of them struck. Drawn
     BEFORE the order so the piers stand in front of them and the middle ground
     stays clear for the two speakers. ---- */
  if (has("tiers")){
    // the sweep of the bank, dashed: the arc the benches are ranged on
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.2; g.globalAlpha = zones ? 0.42 : 0.18;
    g.setLineDash([W*0.018, W*0.016]);
    g.beginPath();
    g.ellipse(BANK.cx*W, BANK.cy*H, BANK.rx*W, BANK.ry*H, 0,
              BANK.a0*Math.PI/180, BANK.a1*Math.PI/180);
    g.stroke(); g.setLineDash([]); g.restore();
    const idx = [...Array(BANK.n).keys()];
    idx.sort((a, b) => bankN(a).y - bankN(b).y);
    for (const i of idx){
      const p = bankN(i);
      struckBench(pen, g, W, H, p, depthAtY(p.y), T, !convened);
    }
  }

  /* ---- THE ORDER: two piers a side, drawn back-to-front ---- */
  if (has("columns")){
    for (const c of [COLUMNS[1], COLUMNS[2], COLUMNS[0], COLUMNS[3]]) column(pen, g, W, H, c, T);
  }

  /* ---- THE COUNCIL RING: the surveyed axis, ten struck places, two stations.
     This is the whole argument of the set — the hall minus its assembly. ---- */
  if (has("ring")){
    // the ring itself, dashed: the geometry the hall was built around
    g.save(); g.strokeStyle = INK; g.lineWidth = zones ? 3.2 : 2.6;
    g.globalAlpha = zones ? 0.60 : 0.36;
    g.setLineDash([W*0.016, W*0.014]);
    g.beginPath(); g.ellipse(RING.cx*W, RING.cy*H, RING.rx*W, RING.ry*H, 0, 0, 7); g.stroke();
    g.setLineDash([]);
    // THE AXIS: the line of the question, dashed between the two stations
    g.strokeStyle = INK; g.lineWidth = 3.6; g.globalAlpha = 0.60;
    g.setLineDash([W*0.022, W*0.016]);
    g.beginPath();
    g.moveTo((RING.cx - RING.rx*0.80)*W, RING.cy*H);
    g.lineTo((RING.cx - RING.rx*0.22)*W, RING.cy*H);
    g.moveTo((RING.cx + RING.rx*0.22)*W, RING.cy*H);
    g.lineTo((RING.cx + RING.rx*0.80)*W, RING.cy*H);
    g.stroke(); g.setLineDash([]); g.restore();

    // back places first, near places last
    const order = [];
    for (let i = 0; i < params.places; i++) if (!SKIP.has(i)) order.push(i);
    order.sort((a, b) => placeN(a).y - placeN(b).y);
    for (const i of order){
      const p = placeN(i), s = depthAtY(p.y);
      if (SEATS[i]) station(pen, g, W, H, p, s, T, zones || !convened);
      else vacantPlace(pen, g, W, H, p, s, T, convened || zones);
    }
  }

  /* ---- THE TWO FIXTURES: the seat that answers and the rostrum that asks ---- */
  if (has("fixtures")){
    rostrumFixture(pen, g, W, H, placeN(0), T);
    throneFixture(pen, g, W, H, placeN(6), T);
  }

  /* ---- THE BALANCE on the axis: the verdict, rendered as a machine ---- */
  if (has("balance")) balance(pen, g, W, H, tilt, T);

  /* ---- THE NUMBERING: the two speaking stations cut as tally bars ---- */
  if (has("marks")){
    stele(pen, g, W, H, 0.158*W, 0.886*H, clamp(depthAtY(0.886), 0.6, 1), 1, T);
    stele(pen, g, W, H, 0.846*W, 0.906*H, clamp(depthAtY(0.906), 0.6, 1), 2, T);
    // a short lead from each stele to its station, so the number is attached
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.2; g.globalAlpha = 0.34;
    g.setLineDash([W*0.012, W*0.011]);
    g.beginPath();
    g.moveTo(0.158*W, 0.892*H); g.lineTo(placeN(0).x*W, placeN(0).y*H + H*0.012);
    g.moveTo(0.846*W, 0.912*H); g.lineTo(placeN(6).x*W, placeN(6).y*H + H*0.012);
    g.stroke(); g.setLineDash([]); g.restore();
  }

  /* ---- FOREGROUND: two corner plinths a figure passes behind and one near step
     off-centre. Nothing runs along the bottom edge — a near sill is exactly the
     full-width bar that stripes a frame. ---- */
  if (has("fg")){
    for (const [x, w] of [[0.006, 0.150], [0.994, 0.166]]){
      pen.paint(() => { g.rect(x*W - w*W/2, 0.884*H, w*W, H*0.150); },
                toneSolid(inkLevel(T.flat)), 3.8);
      pen.paint(() => { g.rect(x*W - w*W*0.60, 0.868*H, w*W*1.20, H*0.020); },
                toneSolid(inkLevel(T.stone)), 3.2);
      g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.30;
      for (const u of [0.36, 0.64]){
        g.beginPath();
        g.moveTo(x*W - w*W/2 + w*W*u, 0.894*H); g.lineTo(x*W - w*W/2 + w*W*u, 1.00*H);
        g.stroke();
      }
      g.restore();
    }
    // the near step: a short broken run, well clear of both edges
    pen.paint(() => { g.rect(0.300*W, 0.952*H, 0.250*W, H*0.026); },
              toneSolid(inkLevel(T.stone)), 3.2);
    pen.paint(() => { g.rect(0.336*W, 0.930*H, 0.178*W, H*0.022); },
              toneSolid(inkLevel(T.pale)), 2.8);
  }
}

export const asset = {
  id:"location.olympian-decision-space",
  type:"LOCATION",
  name:"Olympian Decision Space",
  statusWord:"JUDGMENT",
  scene:"OD-B24-S07",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky", "panels", "beams", "floor", "courses", "tiers", "columns",
          "ring", "fixtures", "balance", "marks", "fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky", "panels", "beams", "tiers", "columns"],
              ground:["floor", "courses", "ring", "fixtures", "marks"],
              front:["balance", "fg"] },
  // the configuration this set is reduced to: two speakers, one axis
  configuration:{
    speakers:[
      { n:1, station:"station:petitioner", fixture:"rostrum", role:"asks" },
      { n:2, station:"station:judge",      fixture:"throne",  role:"answers" },
    ],
    axis:["station:petitioner", "station:judge"],
    struck:params.places - params.seated,
    reducedFrom:"location.olympian-council-hall",
  },
  // normalized 0..1 placement / camera anchors — seated on the ring + the ladder
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.05, y0:.60, x1:.95, y1:.97 },
    "axis-lane":{ x0:.14, y0:.71, x1:.86, y1:.80 },
    "ring-floor":{ x0:.14, y0:.62, x1:.86, y1:.89 },
    "west-station":{ x0:.10, y0:.72, x1:.25, y1:.80 },
    "east-station":{ x0:.75, y0:.72, x1:.90, y1:.80 },
    dais:{ x0:.75, y0:.69, x1:.91, y1:.78 },
    rostrum:{ x0:.11, y0:.68, x1:.24, y1:.77 },
    "balance-stand":{ x0:.44, y0:.62, x1:.56, y1:.82 },
    "struck-places":{ x0:.16, y0:.62, x1:.84, y1:.70 },
    "sky-gap":{ x0:.55, y0:.40, x1:.67, y1:.59 },
    "west-approach":{ x0:.00, y0:.86, x1:.30, y1:.97 },
    "east-approach":{ x0:.70, y0:.86, x1:1.0, y1:.97 },
  },
  states:{
    initial:"judgment",
    nodes:{
      // the reduced set: ten places struck, two stations lit, the beam level
      judgment:{ preview:{ state:"judgment" } },
      // before the reduction — every place still benched and registered
      convened:{ preview:{ state:"convened" } },
      // the same room with the verdict fallen east
      war:{ preview:{ state:"war" } },
      // and fallen west
      peace:{ preview:{ state:"peace" } },
      // every zone and the full ring struck in — previs / blocking
      survey:{ preview:{ state:"survey", zonesLit:true } },
      // the bare walking set: order, floor, ring, fixtures, nothing marked
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["convened","judgment"],["judgment","convened"],
           ["judgment","war"],["judgment","peace"],["war","peace"],["peace","war"],
           ["war","judgment"],["peace","judgment"],
           ["judgment","survey"],["survey","judgment"],
           ["judgment","bare"],["bare","judgment"]],
  },
  channels:["state","tilt","reveal","camera","light","zones","speaker"],

  preview:()=>({ state:"judgment", t:0, status:"JUDGMENT", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
