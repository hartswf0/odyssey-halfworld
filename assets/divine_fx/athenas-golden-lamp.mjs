/* divine_fx.athenas-golden-lamp — Book XIX, the first thing that happens.
   Odysseus and Telemachus carry the arms out of the megaron and Athena goes
   before them holding a golden lamp: the walls, the fair panels, the pine
   cross-beams and the tall pillars "shine as with a blazing fire." Telemachus
   sees the light and asks; Odysseus tells him to be silent — the god is in the
   room and must not be named. Eurycleia and the maids are shut in behind the
   door, so the extraordinary light is public and the goddess is not.

   That contradiction is the whole asset: MAXIMUM VISIBLE CONSEQUENCE, ZERO
   VISIBLE SOURCE-BODY. So this module draws
     SOURCE      the lamp itself — floating, self-moving, nothing holding it,
                 an empty dashed cradle where a hand would be
     FIELD       an ISO-LUX diagram: quantized octagonal light-bands stepping
                 out from the flame, paper at the core, ink at the far corners.
                 The eight ink levels used as a photometric scale, not shading.
     TARGET      the architecture the light strikes — broken beam courses and
                 two pillars whose lamp-facing faces are bare paper and whose
                 far faces are heavy ink. That IS Telemachus's line.
     CONSEQUENCE cast shadows thrown away from the lamp, and the BEARER-VOID:
                 a dashed empty column walking under the lamp, plus a sightline
                 from the shut door that terminates on a hard stop-bar before
                 it reaches her. The light arrives; the goddess does not.

   Self-moving is shown, not asserted: a dotted rail with registration diamonds
   and two ghost lamps behind the live one, and a chevron ahead of it.

   Procedural over state.t + lit/travel/veil/watch:
     DORMANT  lit=0        no light at all, the hall unlit
     KINDLED  lit low      core band only, architecture barely picked out
     LEADING  lit mid-high the lamp underway on its rail (preview)
     BLAZING  lit=1        bands at full reach, every face burning
     WITHDRAWN lit falls, veil closes, the void and the rail wink out

   Solid tones + hard contour only (engine primitives); the POST pass supplies
   the halftone. Do NOT pre-dither. Blends `multiply` into a scene, so the
   paper core drops out and only the ink — bands, contours, shadows — lands on
   location.megaron-hall. */
import { makePen, inkLevel, INK, ACCENT, clamp, clamp01, lerp, smooth }
  from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;

const params = {
  floorY:   0.868,   // hall floor line
  beamY:    0.118,   // upper beam course top
  crossY:   0.186,   // pine cross-beam course top
  capY:     0.232,   // pillar capital top
  pillarL:  0.140,   // left pillar inner edge x
  pillarR:  0.808,   // right pillar left edge x
  pillarW:  0.062,   // pillar shaft width (frac of W)
  lampX:    0.500,   // lamp body centre at travel=0.5
  lampY:    0.352,   // lamp spout / flame-root y
  bands:    [0.252, 0.436],   // iso-lux radii (frac of H) at lit=1
  bandInk:  [0, 1, 2],        // ink level inside each band, outward; 2 = far hall
  rays:     14,      // radial spokes crossing the bands
  lit:      1.0,
  travel:   0.5,
  veil:     1.0,     // how firmly the goddess stays unexposed (1 = fully)
  watch:    1.0,     // the shut-door sightline
};

/* ---------- geometry helpers ---------- */
function octPath(g, cx, cy, r){
  g.beginPath();
  for (let i = 0; i < 8; i++){
    const a = Math.PI / 8 + i * TAU / 8;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
}
function dashed(g, pts, dash, lw, style){
  g.save(); g.setLineDash(dash); g.strokeStyle = style || INK; g.lineWidth = lw;
  g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]));
  g.stroke(); g.restore();
}
function box(g, x, y, w, h, level, lw){
  g.beginPath(); g.rect(x, y, w, h);
  g.fillStyle = level === null ? "#ffffff" : inkLevel(level); g.fill();
  g.strokeStyle = INK; g.lineWidth = lw || 4; g.lineJoin = "round"; g.stroke();
}

/* ---------- FIELD: the iso-lux bands ----------
   Darkest first, then each brighter band painted on top. Hard-stepped: no
   gradient anywhere, the boundary between two levels is a drawn contour. */
function drawField(g, W, H, C, lit){
  const far = params.bandInk[params.bandInk.length - 1];
  g.fillStyle = inkLevel(lit < 0.02 ? 3 : far); g.fillRect(0, 0, W, H);
  if (lit < 0.02) return;
  const k = 0.55 + 0.55 * lit;
  for (let i = params.bands.length - 1; i >= 0; i--){
    const r = params.bands[i] * H * k;
    octPath(g, C.x, C.y, r);
    g.fillStyle = inkLevel(params.bandInk[i]); g.fill();
    // only the core boundary is contoured; the outer step is tone alone, so the
    // paper does not fill up with stray dotted diagonals
    if (i === 0){ g.strokeStyle = INK; g.lineWidth = 2.6; g.stroke(); }
  }
}

/* ---------- FIELD: spokes. Sparse, so the core stays paper. ---------- */
function drawRays(g, W, H, C, lit, t){
  if (lit < 0.08) return;
  const k = 0.55 + 0.55 * lit;
  g.save(); g.strokeStyle = INK; g.lineCap = "round";
  for (let i = 0; i < params.rays; i++){
    const a = (i / params.rays) * TAU + 0.22 + Math.sin(t * 0.6) * 0.03;
    const long = (i % 2 === 0);
    const r0 = params.bands[0] * H * k * 0.58;
    const r1 = params.bands[long ? 1 : 0] * H * k * (long ? 1.05 : 1.20);
    g.lineWidth = long ? 3.4 : 1.8;
    g.beginPath();
    g.moveTo(C.x + Math.cos(a) * r0, C.y + Math.sin(a) * r0);
    g.lineTo(C.x + Math.cos(a) * r1, C.y + Math.sin(a) * r1);
    g.stroke();
  }
  g.restore();
}

/* ---------- TARGET: beam courses. Every span BROKEN — no bar crosses the
   frame. Underside (lamp-facing) is bare paper, top face heavy ink. ---------- */
function drawBeams(g, W, H, lit){
  const b = params.beamY * H, bh = H * 0.044;
  const c = params.crossY * H, ch = H * 0.034;
  const lightFace = lit > 0.15 ? null : 2;             // null = paper
  const darkFace  = lit > 0.15 ? 5 : 4;
  const upper = [[0.055, 0.245], [0.292, 0.430], [0.470, 0.688], [0.735, 0.945]];
  for (const [x0, x1] of upper){
    const x = x0 * W, w = (x1 - x0) * W;
    box(g, x, b, w, bh * 0.40, darkFace, 4);
    box(g, x, b + bh * 0.40, w, bh * 0.60, lightFace, 4);
  }
  const cross = [[0.098, 0.238], [0.278, 0.424], [0.576, 0.722], [0.762, 0.902]];
  for (const [x0, x1] of cross){
    const x = x0 * W, w = (x1 - x0) * W;
    box(g, x, c, w, ch * 0.46, darkFace, 4);
    box(g, x, c + ch * 0.46, w, ch * 0.54, lightFace, 4);
    // end-grain tick
    g.strokeStyle = INK; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x + w * 0.5, c); g.lineTo(x + w * 0.5, c + ch); g.stroke();
  }
}

/* ---------- TARGET: the two pillars. Inner (lit) half paper, outer half ink,
   so the light direction is legible without a single gradient. ---------- */
function drawPillars(g, W, H, L, lit){
  const fy = params.floorY * H, cy = params.capY * H, w = params.pillarW * W;
  const lightFace = lit > 0.15 ? null : 2;
  const darkFace  = lit > 0.15 ? 5 : 4;
  for (const side of [-1, 1]){
    const x = side < 0 ? params.pillarL * W : params.pillarR * W;
    const lampIsRight = (L.x > x + w / 2);
    // capital
    box(g, x - w * 0.20, cy, w * 1.40, H * 0.030, darkFace, 4);
    // shaft: two faces, split at the light-facing half
    const top = cy + H * 0.030, hgt = fy - top - H * 0.026;
    const litW = w * 0.52;
    const litX = lampIsRight ? x + w - litW : x;
    const darkX = lampIsRight ? x : x + litW;
    box(g, x, top, w, hgt, darkFace, 4);
    box(g, litX, top, litW, hgt, lightFace, 3);
    // broken drum joints across the lit face — the shaft is coursed, not a bar
    g.strokeStyle = INK; g.lineWidth = 3;
    for (let i = 1; i <= 4; i++){
      const jy = top + hgt * (i / 5);
      g.beginPath();
      g.moveTo(litX + litW * 0.10, jy); g.lineTo(litX + litW * 0.92, jy); g.stroke();
    }
    void darkX;
    // base
    box(g, x - w * 0.24, fy - H * 0.026, w * 1.48, H * 0.026, darkFace, 4);
  }
}

/* ---------- CONSEQUENCE: floor + shadows thrown away from the lamp ---------- */
function drawFloor(g, W, H, L, lit){
  const fy = params.floorY * H;
  g.fillStyle = inkLevel(lit > 0.15 ? 2 : 4); g.fillRect(0, fy, W, H - fy);
  g.strokeStyle = INK; g.lineWidth = 5;
  for (const [x0, x1] of [[0.02, 0.300], [0.340, 0.520], [0.560, 0.780], [0.820, 0.985]]){
    g.beginPath(); g.moveTo(x0 * W, fy); g.lineTo(x1 * W, fy); g.stroke();
  }
  g.lineWidth = 2;
  for (const fx of [0.14, 0.31, 0.47, 0.63, 0.79, 0.93]){
    g.beginPath(); g.moveTo(fx * W, fy + H * 0.012); g.lineTo(fx * W, H * 0.985); g.stroke();
  }
  if (lit < 0.12) return;
  // pillar shadows: short wedges running away from the flame across the boards
  const w = params.pillarW * W;
  for (const side of [-1, 1]){
    const px = (side < 0 ? params.pillarL * W : params.pillarR * W) + w / 2;
    const dir = px < L.x ? -1 : 1;
    const len = W * (0.055 + 0.055 * lit);
    const yb = fy + (H - fy) * 0.62;
    g.save();
    g.fillStyle = inkLevel(3);
    g.beginPath();
    g.moveTo(px - w * 0.5, fy + H * 0.004);
    g.lineTo(px + w * 0.5, fy + H * 0.004);
    g.lineTo(px + dir * len + w * 0.75, yb);
    g.lineTo(px + dir * len - w * 0.75, yb);
    g.closePath(); g.fill();
    g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
    g.restore();
  }
}

/* ---------- SELF-MOVING: the rail, the registration diamonds, the ghosts ---- */
function ghostLamp(g, x, y, s, lw){
  g.save(); g.strokeStyle = INK; g.lineWidth = lw; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(x - 34 * s, y - 6 * s); g.lineTo(x + 30 * s, y - 6 * s);
  g.lineTo(x + 22 * s, y + 12 * s); g.lineTo(x - 22 * s, y + 12 * s);
  g.closePath(); g.stroke();
  g.beginPath(); g.moveTo(x - 34 * s, y - 6 * s); g.lineTo(x - 48 * s, y - 12 * s); g.stroke();
  g.restore();
}
function drawRail(g, W, H, L, lit, travel){
  if (lit < 0.10) return;
  const pts = [[0.150, 0.640], [0.262, 0.531], [0.376, 0.428]].map(p => [p[0] * W, p[1] * H]);
  dashed(g, [...pts, [L.x, L.y + H * 0.022]], [5, 11], 3.6);
  g.save();
  g.strokeStyle = INK; g.lineWidth = 3;
  for (const [x, y] of pts){                       // registration diamonds
    g.beginPath();
    g.moveTo(x, y - 9); g.lineTo(x + 9, y); g.lineTo(x, y + 9); g.lineTo(x - 9, y);
    g.closePath(); g.stroke();
  }
  g.restore();
  ghostLamp(g, pts[0][0] + W * 0.030, pts[0][1] - H * 0.026, 0.72, 3.2);
  ghostLamp(g, pts[2][0] + W * 0.030, pts[2][1] - H * 0.028, 0.92, 3.6);
  // one chevron ahead of the live lamp — where it is going next
  const ax = L.x + W * 0.205, ay = L.y - H * 0.086;
  g.save(); g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "round";
  g.beginPath();
  g.moveTo(ax - 20, ay + 24); g.lineTo(ax + 4, ay); g.lineTo(ax - 20, ay - 24);
  g.stroke();
  g.restore();
  void travel;
}

/* ---------- THE BEARER-VOID: the goddess as a hole in the diagram ----------
   A dashed empty column standing on the floor under the lamp, and a dashed
   open cradle at the lamp's foot with a gap in it — nothing is holding this. */
function voidX(W, L){ return L.x + W * 0.098; }
function voidTop(H, L){ return L.y + H * 0.150; }
function drawVoid(g, W, H, L, veil, lit){
  if (veil < 0.05 || lit < 0.06) return;
  const cx = voidX(W, L);
  const top = voidTop(H, L), bot = params.floorY * H;
  const w = W * 0.118;
  g.save();
  g.setLineDash([11, 9]); g.strokeStyle = INK; g.lineWidth = 4.4;
  g.beginPath();
  g.moveTo(cx - w / 2, bot);
  g.lineTo(cx - w / 2, top + H * 0.030);
  g.quadraticCurveTo(cx - w / 2, top, cx, top);
  g.quadraticCurveTo(cx + w / 2, top, cx + w / 2, top + H * 0.030);
  g.lineTo(cx + w / 2, bot);
  g.stroke();
  // the arm that is not there: dashed line from the void's shoulder to the foot
  g.beginPath();
  g.moveTo(cx - w * 0.30, top + H * 0.030);
  g.lineTo(cx + W * 0.006, L.y + H * 0.086);
  g.stroke();
  g.restore();
  // rungs across the slot — the column is an enclosed empty, not two stray lines
  g.save(); g.setLineDash([11, 9]); g.strokeStyle = INK; g.lineWidth = 3;
  for (let i = 1; i <= 3; i++){
    const y = lerp(top + H * 0.055, bot - H * 0.030, i / 4);
    g.beginPath(); g.moveTo(cx - w * 0.40, y); g.lineTo(cx + w * 0.40, y); g.stroke();
  }
  g.restore();
  // footprints: solid ink on the boards. Someone stands here. You cannot see her.
  box(g, cx - w * 0.44, bot - H * 0.013, w * 0.34, H * 0.017, 7, 3);
  box(g, cx + w * 0.10, bot - H * 0.013, w * 0.34, H * 0.017, 7, 3);
  // open cradle beneath the lamp's base plate — two dashed hooks, a gap between
  const cy = L.y + H * 0.082, hx = W * 0.048;
  dashed(g, [[cx - hx, cy - 12], [cx - hx, cy + 10], [cx - hx * 0.34, cy + 10]], [7, 6], 3.4);
  dashed(g, [[cx + hx, cy - 12], [cx + hx, cy + 10], [cx + hx * 0.34, cy + 10]], [7, 6], 3.4);
}

/* ---------- THE WITHHELD SIGHT: Eurycleia's shut door, and the stop ---------
   A bracket at the barred door (no figure), a dashed sightline reaching for
   the void, and one hard bar across it. The light gets out; she does not see. */
function drawWatch(g, W, H, L, watch, veil){
  if (watch < 0.05) return;
  const ox = W * 0.930, oy = H * 0.772;
  const tx = voidX(W, L), ty = voidTop(H, L) + H * 0.036;
  g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "square";
  g.beginPath();                                   // the shut-door aperture
  g.moveTo(ox - 26, oy - 34); g.lineTo(ox - 26, oy - 6);
  g.moveTo(ox - 26, oy + 6);  g.lineTo(ox - 26, oy + 34);
  g.moveTo(ox - 26, oy - 34); g.lineTo(ox + 4, oy - 34);
  g.moveTo(ox - 26, oy + 34); g.lineTo(ox + 4, oy + 34);
  g.stroke();
  g.restore();
  const ux = lerp(ox, tx, 0.46), uy = lerp(oy, ty, 0.46);
  dashed(g, [[ox - 30, oy], [ux, uy]], [10, 8], 3.4);
  if (veil < 0.05) { dashed(g, [[ux, uy], [tx, ty]], [10, 8], 3.4); return; }
  // the stop: one hard bar square across the sightline + a small cross
  const a = Math.atan2(ty - oy, tx - ox) + Math.PI / 2;
  g.save();
  g.strokeStyle = ACCENT; g.lineWidth = 7; g.lineCap = "butt";
  g.beginPath();
  g.moveTo(ux + Math.cos(a) * 26, uy + Math.sin(a) * 26);
  g.lineTo(ux - Math.cos(a) * 26, uy - Math.sin(a) * 26);
  g.stroke();
  g.restore();
  g.save(); g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath();
  g.moveTo(ux - 13, uy - 13); g.lineTo(ux + 13, uy + 13);
  g.moveTo(ux + 13, uy - 13); g.lineTo(ux - 13, uy + 13);
  g.stroke(); g.restore();
}

/* ---------- SOURCE: the lamp. Blocky, hard-contoured, nothing holding it. -- */
function drawLamp(g, W, H, L, lit, t){
  if (lit < 0.02) return;
  const uw = W * 0.0145, uh = H * 0.0130;             // blocky unit grid
  const rim = L.y, bot = L.y + uh * 3.4;              // bowl rim -> keel
  const xl = L.x - uw * 1.0, xr = L.x + uw * 17.0;    // spout tip -> stern
  g.save();
  // bowl: shallow boat, spout at the left, ink body, flat rim on top
  g.beginPath();
  g.moveTo(xl, rim);
  g.lineTo(xr, rim);
  g.lineTo(xr - uw * 1.8, bot);
  g.lineTo(xl + uw * 3.2, bot);
  g.closePath();
  g.fillStyle = inkLevel(3); g.fill();
  g.strokeStyle = INK; g.lineWidth = 6; g.lineJoin = "round"; g.stroke();
  // oil line: paper bands along the lit rim, broken so the bowl is never a bar
  box(g, xl + uw * 2.0, rim + uh * 0.50, uw * 5.6, uh * 1.5, null, 4);
  box(g, xl + uw * 9.4, rim + uh * 0.50, uw * 4.6, uh * 1.5, null, 4);
  // stem + base plate, clear of the keel — the lamp has furniture and no bearer
  box(g, L.x + uw * 5.6, bot, uw * 3.0, uh * 1.5, 5, 4);
  box(g, L.x + uw * 3.4, bot + uh * 1.5, uw * 7.4, uh * 1.1, 6, 4);
  // handle ring at the stern
  g.beginPath(); g.arc(xr + uw * 1.0, rim + uh * 1.6, uw * 2.8, -1.25, 1.25);
  g.strokeStyle = INK; g.lineWidth = 7; g.stroke();
  // raised nozzle collar the wick rides in
  box(g, xl - uw * 0.4, rim - uh * 1.7, uw * 4.4, uh * 1.8, 5, 4);
  g.restore();
  // wick + flame, wholly clear of the bowl — paper-filled, in a corona of spikes
  const fx = xl + uw * 1.8, fb = rim - uh * 1.9;
  const fl = 0.86 + 0.14 * Math.sin(t * 3.1) * lit;
  const fh = uh * 7.6 * fl * (0.55 + 0.45 * lit);
  const fw = uw * 3.2;
  g.save();
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round";
  g.beginPath();
  g.moveTo(fx - fw, fb);
  g.quadraticCurveTo(fx - fw * 1.05, fb - fh * 0.55, fx, fb - fh);
  g.quadraticCurveTo(fx + fw * 1.05, fb - fh * 0.55, fx + fw, fb);
  g.closePath();
  g.fillStyle = "#ffffff"; g.fill();
  g.lineWidth = 6; g.stroke();
  // corona: spikes around the flame head, the light's own reach
  const cx = fx, cy = fb - fh * 0.55;
  g.lineWidth = 5;
  for (let i = 0; i < 14; i++){
    const a = (i / 14) * TAU + 0.22 + t * 0.10;
    const r0 = uw * 5.6, r1 = r0 + uw * (i % 2 ? 2.6 : 5.0) * (0.6 + 0.6 * lit) * fl;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r0 * 1.0, cy + Math.sin(a) * r0 * 1.25);
    g.lineTo(cx + Math.cos(a) * r1 * 1.0, cy + Math.sin(a) * r1 * 1.25);
    g.stroke();
  }
  g.restore();
}

/* ---------- composite ---------- */
function drawFX(ctx, W, H, state){
  const g = ctx;
  const t      = state.t ?? 0;
  const lit    = clamp01(state.lit ?? params.lit);
  const travel = clamp01(state.travel ?? params.travel);
  const veil   = clamp01(state.veil ?? params.veil);
  const watch  = clamp01(state.watch ?? params.watch);
  const pen    = makePen(g, { outline: true });

  const L = {
    x: lerp(0.300, 0.436, smooth(travel)) * W,
    y: (params.lampY + Math.sin(t * 1.3) * 0.006) * H,
  };
  const C = { x: L.x + W * 0.004, y: L.y - H * 0.048 };   // flame head = light origin

  const layers = state.layers ||
    ["field", "rays", "beams", "pillars", "floor", "rail", "void", "watch", "lamp"];
  if (layers.includes("field"))   drawField(g, W, H, C, lit);
  if (layers.includes("rays"))    drawRays(g, W, H, C, lit, t);
  if (layers.includes("beams"))   drawBeams(g, W, H, lit);
  if (layers.includes("pillars")) drawPillars(g, W, H, L, lit);
  if (layers.includes("floor"))   drawFloor(g, W, H, L, lit);
  if (layers.includes("rail"))    drawRail(g, W, H, L, lit, travel);
  if (layers.includes("void"))    drawVoid(g, W, H, L, veil, lit);
  if (layers.includes("watch"))   drawWatch(g, W, H, L, watch, veil);
  if (layers.includes("lamp"))    drawLamp(g, W, H, L, lit, t);
  void pen;
}

export const asset = {
  id:"divine-fx.athenas-golden-lamp",
  type:"DIVINE_FX",
  name:"Athena's Golden Lamp",
  statusWord:"LEADING",
  scene:"OD-B19-S01",
  blend:"multiply",
  pairsWith:"location.megaron-hall",     // the room whose beams and pillars burn

  params,
  layers:["field","rays","beams","pillars","floor","rail","void","watch","lamp"],
  anchors:{
    "source:flame":   { x:0.466, y:0.316 },  // the light origin — bands centre here
    "source:bowl":    { x:0.536, y:0.336 },
    "field:core":     { x:0.466, y:0.316 },  // paper band, everything inside is lit
    "target:beam":    { x:0.500, y:0.140 },  // the fair beams
    "target:pillarL": { x:0.171, y:0.550 },
    "target:pillarR": { x:0.839, y:0.550 },
    "target:floor":   { x:0.500, y:0.868 },
    "void:bearer":    { x:0.414, y:0.700 },  // the goddess-shaped hole
    "watch:door":     { x:0.935, y:0.760 },  // Eurycleia, shut in, unseeing
    "camera:wide":    { x:0.500, y:0.500 },
  },
  zones:{
    lit:     { x0:0.10, y0:0.06, x1:0.90, y1:0.92 },   // where the light reaches
    withheld:{ x0:0.78, y0:0.62, x1:1.00, y1:0.92 },   // the sightline that fails
    rail:    { x0:0.12, y0:0.24, x1:0.72, y1:0.68 },   // the lamp's self-moving path
  },
  states:{
    initial:"leading",
    nodes:{
      dormant:  { preview:{ t:0.0, lit:0.00, travel:0.00, veil:1, watch:0.6,
                            status:"DARK",     progress:0.04 } },
      kindled:  { preview:{ t:0.6, lit:0.34, travel:0.10, veil:1, watch:0.8,
                            status:"KINDLED",  progress:0.20 } },
      leading:  { preview:{ t:2.2, lit:0.82, travel:0.50, veil:1, watch:1,
                            status:"LEADING",  progress:0.58 } },
      blazing:  { preview:{ t:3.4, lit:1.00, travel:0.78, veil:1, watch:1,
                            status:"BLAZING",  progress:0.86 } },
      withdrawn:{ preview:{ t:5.0, lit:0.16, travel:1.00, veil:0.4, watch:0.4,
                            status:"WITHDRAWN",progress:0.98 } },
    },
    edges:[["dormant","kindled"],["kindled","leading"],["leading","blazing"],
           ["blazing","leading"],["leading","withdrawn"],["withdrawn","dormant"]],
  },
  duration:6.0,
  channels:["t","lit","travel","veil","watch"],

  preview:()=>({ t:2.2, lit:0.86, travel:0.50, veil:1, watch:1,
                 status:"LEADING", progress:0.58,
                 layers:["field","rays","beams","pillars","floor","rail","void","watch","lamp"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
