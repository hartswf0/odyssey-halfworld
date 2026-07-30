/* divine-fx.athenas-departure-darkness — Book XXIII, OD-B23-S06.
   Dawn has been released. Odysseus, Telemachus, Eumaeus and Philoetius arm and
   walk out of the town toward Laertes's farm — in first light, past the houses of
   the men they killed. Athena does not delay the day this time; she pours night
   over the four of them and LEADS THEM OUT. The point of the effect is that it
   MOVES: a pocket of dark with an address that keeps changing, fixed to four
   bodies and not to a place.

     SOURCE      no goddess-body: a dashed leader at the head of the pocket with
                 a tow-bar, tethered back to a dashed origin off the frame's edge.
                 The hand is a hole.
     FIELD       the TOWN IN PLAN — blocks in light plane, the streets left as
                 paper, and the run from the palace door to the north gate dashed
                 through them. The pocket is a hard-contoured octagon of open
                 cross-hatch travelling that run, carrying a clear core with four
                 marks in it, with dashed GHOSTS of where it just was. Above the
                 plan the ROUTE AXIS reads how far out of town they are.
     TARGET      the four travellers, in section along the bottom: four blocky
                 armed marks standing inside the dark envelope, each tethered UP
                 into the lid by a dashed line — the field is attached to the men.
     CONSEQUENCE dawn's rays arriving on the lid and dying there on heavy
                 termination courses; three witness eyes in the streets with their
                 sightlines stopped short of the pocket and crossed out; and the
                 count of men covered (04) against the count who saw them (00).

   Procedural over state.t and dark / travel / watch:
     ARMED      dark=0    travel=0     first light, no cover, the door open
     GATHERING  dark rises at the palace door, pocket small, no ghosts yet
     LEADING    dark=1    travel=.55   the pocket mid-town (preview)
     SCREENED   watch=1                the witness sightlines take the stop
     RELEASED   dark→0    travel=1     clear of the gate, the cover let go

   Solid tones + hard contour only; the POST pass supplies the halftone. Blends
   `multiply` into a scene so the paper drops out and only the ink lands. */
import { inkLevel, INK, ACCENT, clamp, clamp01, lerp, smooth }
  from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;

/* the run out of town: palace door -> east along the lower street -> north up the
   middle avenue -> east along the mid street -> north out the gate. Every leg
   runs in a paper channel between blocks; no leg crosses a block. */
const ROUTE = [[0.112,0.640],[0.5125,0.640],[0.5125,0.480],[0.7525,0.480],[0.7525,0.200]];

/* town blocks, [x0,y0,x1,y1] frac. Four uneven columns, three uneven rows: the
   edges are jittered per block so the rows never read as three grey stripes. */
const BLOCKS = [
  [0.075,0.238,0.235,0.302],[0.300,0.232,0.480,0.306],[0.545,0.240,0.720,0.300],[0.785,0.234,0.925,0.296],
  [0.075,0.368,0.235,0.446],[0.300,0.362,0.480,0.452],[0.545,0.372,0.720,0.442],[0.785,0.366,0.925,0.436],
  [0.075,0.512,0.235,0.588],[0.300,0.506,0.480,0.594],[0.545,0.516,0.720,0.584],[0.785,0.510,0.925,0.578],
];

const params = {
  axisY:    0.196,   // the route-progress axis
  sunX:     0.848,
  sunY:     0.096,
  sunR:     0.030,
  dayY:     0.150,   // the light plane: dawn is up, and free
  avenues:  [0.2675,0.5125,0.7525],
  streets:  [0.336,0.480,0.640],
  palace:   [0.112,0.640],
  gate:     [0.7525,0.200],
  pocketR:  0.070,   // pocket radius, frac of W
  dividerY: 0.686,   // between the plan register and the section register
  lidY:     0.700,   // top of the travelling lid
  lidH:     0.026,
  envX:     [0.140,0.664],
  envY1:    0.912,   // the dark reaches nearly to the floor
  groundY:  0.930,
  figH:     0.132,   // traveller height, frac of H
  figX:     [0.192,0.326,0.460,0.594],
  witness:  [[0.640,0.336],[0.2675,0.545],[0.880,0.480]],
  covered:  4,
  seen:     0,
  dark:     1.0,
  travel:   0.55,
  watch:    1.0,
};

/* ---------- primitives ---------- */
function box(g, x, y, w, h, level, lw){
  g.beginPath(); g.rect(x, y, w, h);
  g.fillStyle = level === null ? "#ffffff" : inkLevel(level); g.fill();
  g.strokeStyle = INK; g.lineWidth = lw || 4; g.lineJoin = "round"; g.stroke();
}
function dashed(g, pts, dash, lw, style){
  g.save(); g.setLineDash(dash); g.strokeStyle = style || INK; g.lineWidth = lw;
  g.lineCap = "butt"; g.beginPath();
  pts.forEach((p,i)=> i ? g.lineTo(p[0],p[1]) : g.moveTo(p[0],p[1]));
  g.stroke(); g.restore();
}
function diamond(g, x, y, r, fill){
  g.beginPath();
  g.moveTo(x, y-r); g.lineTo(x+r, y); g.lineTo(x, y+r); g.lineTo(x-r, y); g.closePath();
  if (fill){ g.fillStyle = INK; g.fill(); } else { g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); }
}
function crossOut(g, x, y, r, lw){
  g.save(); g.strokeStyle = INK; g.lineWidth = lw || 5; g.lineCap = "round";
  g.beginPath();
  g.moveTo(x-r, y-r); g.lineTo(x+r, y+r);
  g.moveTo(x+r, y-r); g.lineTo(x-r, y+r);
  g.stroke(); g.restore();
}
function octPath(g, cx, cy, r){
  g.beginPath();
  for (let i = 0; i < 8; i++){
    const a = Math.PI/8 + i*TAU/8;
    const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
    i ? g.lineTo(x,y) : g.moveTo(x,y);
  }
  g.closePath();
}
/* the dark in ELEVATION: an open vertical curtain inside a clipped envelope.
   Vertical on purpose — the spears and the arriving rays are the diagonals in this
   register, so the field must not compete with them. Alternating weights keep it
   from reading as a barcode, and the paper never closes up into a black mass. */
function curtain(g, pathFn, step, lw, b){
  g.save(); pathFn(); g.clip();
  g.strokeStyle = INK; g.lineCap = "butt";
  let i = 0;
  for (let x = b.x; x < b.x + b.w; x += step){
    g.lineWidth = (i % 3 === 2) ? lw*0.70 : lw;
    const y0 = b.y + (i % 2 ? b.h*0.06 : 0);
    g.beginPath(); g.moveTo(x, y0); g.lineTo(x, b.y + b.h); g.stroke();
    i++;
  }
  g.restore();
}
/* the dark in PLAN: open cross-hatch inside a clipped envelope. Dense enough to
   read as night, open enough that the paper never closes up into a black mass. */
function hatch(g, pathFn, step, lw, b){
  g.save(); pathFn(); g.clip();
  g.strokeStyle = INK; g.lineCap = "butt";
  g.lineWidth = lw;
  for (let x = b.x - b.h; x < b.x + b.w + b.h; x += step){
    g.beginPath(); g.moveTo(x, b.y + b.h); g.lineTo(x + b.h, b.y); g.stroke();
  }
  g.lineWidth = lw*0.55;
  for (let x = b.x - b.h; x < b.x + b.w + b.h; x += step*1.9){
    g.beginPath(); g.moveTo(x, b.y); g.lineTo(x + b.h, b.y + b.h); g.stroke();
  }
  g.restore();
}
/* seven-segment numeral: bars, not type. Type this small dissolves in the dots. */
const SEGS = {
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1],
};
function segDigit(g, x, y, w, h, d){
  const s = SEGS[clamp(Math.round(d),0,9)] || SEGS[0];
  const th = Math.max(6, w*0.26), m = th*0.60, half = h/2;
  g.fillStyle = INK;
  const hbar = (py)=>{ g.beginPath(); g.rect(x+m, py-th/2, w-2*m, th); g.fill(); };
  const vbar = (px,py)=>{ g.beginPath(); g.rect(px-th/2, py+m, th, half-2*m); g.fill(); };
  if (s[0]) hbar(y);
  if (s[1]) vbar(x+w, y);
  if (s[2]) vbar(x+w, y+half);
  if (s[3]) hbar(y+h);
  if (s[4]) vbar(x, y+half);
  if (s[5]) vbar(x, y);
  if (s[6]) hbar(y+half);
}
function bracket(g, x, y, w, h, lw){   // a unit bracket: a scale, not a caption
  g.save(); g.strokeStyle = INK; g.lineWidth = lw || 4; g.lineCap = "square";
  g.beginPath();
  g.moveTo(x + w, y); g.lineTo(x, y); g.lineTo(x, y + h); g.lineTo(x + w, y + h);
  g.stroke(); g.restore();
}
function eyeGlyph(g, x, y, r, open){
  g.beginPath();
  g.moveTo(x-r, y);
  g.quadraticCurveTo(x, y-r*0.92, x+r, y);
  g.quadraticCurveTo(x, y+r*0.92, x-r, y);
  g.closePath();
  g.fillStyle = "#ffffff"; g.fill();
  g.strokeStyle = INK; g.lineWidth = 5; g.lineJoin = "round"; g.stroke();
  if (open){
    g.beginPath(); g.arc(x, y, r*0.34, 0, TAU);
    g.fillStyle = inkLevel(6); g.fill();
  } else {
    g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
    g.beginPath(); g.moveTo(x-r*0.74, y); g.lineTo(x+r*0.74, y); g.stroke(); g.restore();
  }
}

/* ---------- route arithmetic ---------- */
function routeGeom(W,H){
  const p = ROUTE.map(([x,y])=>[x*W, y*H]);
  const seg = []; let L = 0;
  for (let i = 1; i < p.length; i++){
    const d = Math.hypot(p[i][0]-p[i-1][0], p[i][1]-p[i-1][1]);
    seg.push(d); L += d;
  }
  return { p, seg, L };
}
function routeAt(gm, u){
  let d = clamp01(u) * gm.L;
  for (let i = 0; i < gm.seg.length; i++){
    if (d <= gm.seg[i] || i === gm.seg.length - 1){
      const s = gm.seg[i] || 1, f = clamp01(d / s);
      const a = gm.p[i], b = gm.p[i+1];
      return { x: lerp(a[0],b[0],f), y: lerp(a[1],b[1],f),
               dx: (b[0]-a[0])/s, dy: (b[1]-a[1])/s };
    }
    d -= gm.seg[i];
  }
  const a = gm.p[0]; return { x:a[0], y:a[1], dx:1, dy:0 };
}

/* ---------- CONSEQUENCE: dawn, released and free, above everything ---------- */
function drawDawn(g, W, H, t){
  const cx = params.sunX*W, cy = params.sunY*H, R = params.sunR*H;
  g.save(); g.strokeStyle = INK; g.lineCap = "butt";
  for (let i = 0; i < 14; i++){
    const a = (i/14)*TAU + 0.12 + Math.sin(t*0.4)*0.02;
    const long = i % 2 === 0;
    g.lineWidth = long ? 5 : 3;
    const r1 = R * (long ? 1.76 : 1.34);
    g.beginPath();
    g.moveTo(cx + Math.cos(a)*R*1.08, cy + Math.sin(a)*R*1.08);
    g.lineTo(cx + Math.cos(a)*r1,     cy + Math.sin(a)*r1);
    g.stroke();
  }
  g.restore();
  octPath(g, cx, cy, R);
  g.fillStyle = "#ffffff"; g.fill();
  g.strokeStyle = INK; g.lineWidth = 6; g.lineJoin = "round"; g.stroke();
  g.beginPath(); g.arc(cx, cy, R*0.42, 0, TAU);
  g.fillStyle = inkLevel(2); g.fill();
  g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  // the light plane: broken, heavy — first light standing over the whole town
  g.save(); g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "butt";
  for (const [a,b] of [[0.520,0.648],[0.694,0.788]]){
    g.beginPath(); g.moveTo(a*W, params.dayY*H); g.lineTo(b*W, params.dayY*H); g.stroke();
  }
  g.restore();
}

/* ---------- READOUT: men covered, as bar geometry ---------- */
function drawCovered(g, W, H, dark){
  const dw = W*0.056, dh = H*0.074, gap = W*0.026;
  const x = W*0.078, y = H*0.074;
  const v = Math.round(params.covered * (dark > 0.06 ? 1 : 0));
  segDigit(g, x, y, dw, dh, Math.floor(v/10));
  segDigit(g, x + dw + gap, y, dw, dh, v % 10);
  bracket(g, x + dw*2 + gap*2 + 8, y - 6, 18, dh + 12, 4);
  // four covered stations beside the readout — a tally, not a caption. Kept in a
  // 2x2 block clear of the route axis below it.
  for (let i = 0; i < 4; i++){
    const sx = x + W*0.196 + (i%2)*W*0.040, sy = y + H*0.014 + Math.floor(i/2)*H*0.044;
    diamond(g, sx, sy, 10, i < v);
  }
}

/* ---------- FIELD: the route axis — how far out of town they are ---------- */
function drawAxis(g, W, H, travel){
  const y = params.axisY * H, x0 = W*0.078, x1 = W*0.462;
  g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  for (const [a,b] of [[0.078,0.212],[0.238,0.352],[0.376,0.462]]){
    g.beginPath(); g.moveTo(a*W, y); g.lineTo(b*W, y); g.stroke();
  }
  g.lineWidth = 3;
  for (let i = 0; i <= 12; i++){
    const x = lerp(x0, x1, i/12), long = i % 4 === 0;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + (long ? 18 : 9)); g.stroke();
  }
  g.restore();
  // the run already walked: blocks above the axis, broken into courses
  const bh = H*0.026, xe = lerp(x0, x1, clamp01(travel));
  for (const [a,b] of [[0.00,0.28],[0.34,0.62],[0.68,1.00]]){
    const xa = lerp(x0, xe, a), xb = lerp(x0, xe, b);
    if (xb - xa < 3) continue;
    box(g, xa, y - bh, xb - xa, bh*0.36, 4, 3.2);
    box(g, xa, y - bh*0.64, xb - xa, bh*0.64, null, 3.2);
  }
  // the marker at the head of the run, and the gate mark at the far end
  g.save(); g.fillStyle = ACCENT; g.fillRect(xe - 4, y - bh - H*0.014, 8, bh + H*0.028); g.restore();
  diamond(g, xe, y - bh - H*0.030, 10, true);
  g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "square";
  g.beginPath();
  g.moveTo(x1 + 12, y - 26); g.lineTo(x1 + 12, y + 26);
  g.moveTo(x1 + 26, y - 17); g.lineTo(x1 + 26, y + 17);
  g.stroke(); g.restore();
}

/* ---------- FIELD: the town, in plan. Light planes, paper streets. ---------- */
function drawPlan(g, W, H){
  for (const [x0,y0,x1,y1] of BLOCKS){
    const x = x0*W, y = y0*H, w = (x1-x0)*W, h = (y1-y0)*H;
    box(g, x, y, w, h, 2, 5);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x + w*0.38, y + 6); g.lineTo(x + w*0.38, y + h - 6); g.stroke();
    g.beginPath(); g.moveTo(x + w*0.38, y + h*0.56); g.lineTo(x + w - 6, y + h*0.56); g.stroke();
    g.restore();
    // one dark doorway per block, on the street side — a house that could look out
    box(g, x + w*0.60, y + h - 5, w*0.18, H*0.013, 6, 3);
  }
  // street centre dashes in the paper channels — kept light so the RUN reads over
  // them as the one emphatic line in the plan
  for (const sy of params.streets)
    dashed(g, [[0.075*W, sy*H],[0.925*W, sy*H]], [6,16], 2.2, inkLevel(3));
  for (const ax of params.avenues)
    dashed(g, [[ax*W, 0.212*H],[ax*W, 0.660*H]], [6,16], 2.2, inkLevel(3));
  // the palace door they came out of — heavy jambs, an open threshold
  const px = params.palace[0]*W, py = params.palace[1]*H;
  box(g, px - W*0.056, py - H*0.048, W*0.032, H*0.048, 6, 4);
  box(g, px + W*0.024, py - H*0.048, W*0.032, H*0.048, 6, 4);
  g.save(); g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "butt";
  g.beginPath(); g.moveTo(px - W*0.056, py - H*0.055); g.lineTo(px + W*0.056, py - H*0.055); g.stroke();
  g.restore();
  diamond(g, px, py, 11, false);
  // the north gate they are walking out of — two posts, a broken lintel
  const gx = params.gate[0]*W, gy = params.gate[1]*H;
  box(g, gx - W*0.056, gy, W*0.030, H*0.036, 6, 4);
  box(g, gx + W*0.026, gy, W*0.030, H*0.036, 6, 4);
  g.save(); g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "butt";
  for (const [a,b] of [[-0.060,-0.016],[0.016,0.060]]){
    g.beginPath(); g.moveTo(gx + a*W, gy - H*0.008); g.lineTo(gx + b*W, gy - H*0.008); g.stroke();
  }
  g.restore();
  diamond(g, gx, gy + H*0.030, 10, false);
}

/* ---------- FIELD: the run itself, dashed from door to gate ---------- */
function drawRoute(g, W, H, gm, travel){
  dashed(g, gm.p, [20,11], 5.6, INK);
  g.save(); g.strokeStyle = INK; g.lineWidth = 4.4; g.lineCap = "round";
  for (const u of [0.22, 0.48, 0.74, 0.95]){
    if (u < travel - 0.02) continue;
    const q = routeAt(gm, u), c = q.dx, s = q.dy;
    g.beginPath();
    g.moveTo(q.x - c*12 - s*11, q.y - s*12 + c*11);
    g.lineTo(q.x + c*9, q.y + s*9);
    g.lineTo(q.x - c*12 + s*11, q.y - s*12 - c*11);
    g.stroke();
  }
  g.restore();
}

/* ---------- FIELD: the ghosts — where the pocket was a moment ago ---------- */
function drawGhosts(g, W, H, gm, travel, dark){
  if (dark < 0.10) return;
  const R = params.pocketR * W;
  for (const [back, sc] of [[0.105,0.84],[0.205,0.66]]){
    const u = travel - back;
    if (u < 0.005) continue;
    const q = routeAt(gm, u);
    g.save(); g.setLineDash([10,9]);
    g.strokeStyle = inkLevel(5); g.lineWidth = 3.6; g.lineJoin = "round";
    octPath(g, q.x, q.y, R*sc); g.stroke();
    g.restore();
  }
}

/* ---------- FIELD: the pocket. Hard octagon, open hatch, a clear core. ------ */
function drawPocket(g, W, H, gm, travel, dark, t){
  const d = clamp01(dark);
  if (d < 0.04) return null;
  const q = routeAt(gm, travel);
  const R = params.pocketR * W * lerp(0.50, 1.0, smooth(d));
  const path = ()=> octPath(g, q.x, q.y, R);
  hatch(g, path, lerp(28,18,d), 2.8, { x:q.x-R, y:q.y-R, w:R*2, h:R*2 });
  g.save(); path(); g.strokeStyle = INK; g.lineWidth = 7; g.lineJoin = "round"; g.stroke(); g.restore();
  // the clear core the dark is carrying, with the four of them inside it
  octPath(g, q.x, q.y, R*0.60);
  g.fillStyle = "#ffffff"; g.fill();
  g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  [[-0.28,-0.22],[0.26,-0.26],[-0.26,0.26],[0.28,0.22]].forEach(([ox,oy])=>{
    diamond(g, q.x + ox*R, q.y + oy*R, R*0.13, true);
  });
  // SOURCE: the goddess as a hole — a dashed leader at the head with a tow-bar
  const c = q.dx, s = q.dy;
  const lx = q.x + c*R*1.66, ly = q.y + s*R*1.66;
  g.save(); g.setLineDash([10,8]); g.strokeStyle = INK; g.lineWidth = 4.6;
  g.beginPath(); g.arc(lx, ly, R*0.32, 0, TAU); g.stroke(); g.restore();
  g.save(); g.fillStyle = ACCENT;
  g.translate(lx, ly); g.rotate(Math.atan2(s, c));
  g.fillRect(-R*1.34, -5, R*1.02, 10); g.restore();
  // the tether back to an origin ring off the edge of the frame
  dashed(g, [[0.952*W, 0.166*H],[lx + R*0.26, ly - R*0.22]], [12,10], 3.2, inkLevel(5));
  void t;
  return { x:q.x, y:q.y, R };
}

/* ---------- CONSEQUENCE: eyes that do not catch them ---------- */
function drawWitness(g, W, H, pocket, watch){
  if (!pocket || watch < 0.05) return;
  for (const [wx0, wy0] of params.witness){
    const wx = wx0*W, wy = wy0*H;
    const dx = pocket.x - wx, dy = pocket.y - wy, L = Math.hypot(dx,dy) || 1;
    const ux = dx/L, uy = dy/L;
    const stop = L - pocket.R - 24;
    if (stop > 30){
      dashed(g, [[wx + ux*22, wy + uy*22],[wx + ux*stop, wy + uy*stop]], [9,9], 3.2, inkLevel(5));
      const sx = wx + ux*stop, sy = wy + uy*stop;
      g.save(); g.fillStyle = ACCENT; g.translate(sx, sy); g.rotate(Math.atan2(uy,ux));
      g.fillRect(-5, -17, 10, 34); g.restore();
      crossOut(g, wx + ux*(stop*0.60), wy + uy*(stop*0.60), 12, 4.6);
    }
    eyeGlyph(g, wx, wy, W*0.040, false);
  }
}

/* ---------- TARGET: the four travellers, in section, inside the dark -------- */
function envPath(g, W, H, drift, y1){
  const x0 = params.envX[0]*W + drift, x1 = params.envX[1]*W + drift;
  const y0 = (params.lidY + params.lidH)*H, ch = H*0.024;
  g.beginPath();
  g.moveTo(x0, y0); g.lineTo(x1, y0);
  g.lineTo(x1, y1 - ch); g.lineTo(x1 - ch, y1);
  g.lineTo(x0 + ch, y1); g.lineTo(x0, y1 - ch);
  g.closePath();
}
function drawSection(g, W, H, dark, travel, t){
  const d = clamp01(dark);
  const gy = params.groundY * H, h = params.figH * H;
  const drift = (travel - 0.55) * W * 0.050;
  // register divider: broken thin courses, not a bar
  g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "butt";
  for (const [a,b] of [[0.078,0.240],[0.300,0.452],[0.540,0.700]]){
    g.beginPath(); g.moveTo(a*W, params.dividerY*H); g.lineTo(b*W, params.dividerY*H); g.stroke();
  }
  g.restore();

  // trailing brackets — the dark has just left this ground
  if (d > 0.12){
    g.save(); g.setLineDash([10,10]); g.strokeStyle = inkLevel(4); g.lineWidth = 3.4;
    for (const bx of [0.062, 0.100]){
      const x = bx*W + drift;
      g.beginPath();
      g.moveTo(x + 22, params.lidY*H); g.lineTo(x, params.lidY*H);
      g.lineTo(x, params.envY1*H); g.lineTo(x + 22, params.envY1*H);
      g.stroke();
    }
    g.restore();
  }

  // THE DARK in section: one chamfered envelope of open hatch, hung from a lid
  // broken into two courses. It grows down as `dark` takes.
  if (d > 0.06){
    const y1 = lerp(params.lidY + params.lidH + 0.030, params.envY1, smooth(d))*H;
    const path = ()=> envPath(g, W, H, drift, y1);
    const bx = params.envX[0]*W + drift, bw = (params.envX[1]-params.envX[0])*W;
    const by = (params.lidY + params.lidH)*H;
    curtain(g, path, lerp(28,17,d), 3.0, { x:bx, y:by, w:bw, h:y1-by });
    g.save(); path(); g.strokeStyle = INK; g.lineWidth = 6; g.lineJoin = "round"; g.stroke(); g.restore();
    for (const [a,b] of [[0.140,0.392],[0.412,0.664]]){
      const x = a*W + drift, w = (b-a)*W, ly = params.lidY*H, lh = params.lidH*H;
      box(g, x, ly, w, lh*0.34, 4, 4);
      box(g, x, ly + lh*0.34, w, lh*0.66, null, 4);
    }
  }

  // the ground they walk: broken courses, not a rule
  g.save(); g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "butt";
  for (const [a,b] of [[0.096,0.282],[0.316,0.488],[0.524,0.706]]){
    g.beginPath(); g.moveTo(a*W, gy); g.lineTo(b*W, gy); g.stroke();
  }
  g.restore();

  // the four armed marks — paper bodies inside the dark, drawn over the hatch.
  // Blocky and diagrammatic: dark feet on the ground, light legs, a light torso
  // under a dark shoulder bar, a neck, a paper head. The dark bars do the reading.
  params.figX.forEach((fx, i)=>{
    const x = fx*W + drift, w = h*0.40;
    const bob = Math.abs(Math.sin(t*2.0 + i*1.4)) * h*0.05;
    // feet — the two dark marks that plant the figure on the ground course
    box(g, x - w*0.54, gy - h*0.052, w*0.38, h*0.052, 5, 3.4);
    box(g, x + w*0.16, gy - h*0.052 - bob, w*0.38, h*0.052, 5, 3.4);
    // legs: one planted, one mid-stride
    box(g, x - w*0.46, gy - h*0.46, w*0.28, h*0.41, null, 4.4);
    box(g, x + w*0.18, gy - h*0.46, w*0.28, h*0.41 - bob, null, 4.4);
    // torso in light plane, with a belt course and a baldric seam
    box(g, x - w*0.50, gy - h*0.84, w*1.00, h*0.38, 1, 5.4);
    box(g, x - w*0.50, gy - h*0.50, w*1.00, h*0.05, 5, 3.4);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3.4;
    g.beginPath(); g.moveTo(x - w*0.46, gy - h*0.58); g.lineTo(x + w*0.44, gy - h*0.80); g.stroke();
    g.restore();
    // shoulder bar — the widest dark mark, so the silhouette reads at a glance.
    // Kept narrower than the figure pitch so the four never fuse into one band.
    box(g, x - w*0.60, gy - h*0.92, w*1.20, h*0.075, 4, 4.4);
    // neck, then the paper head clear of the shoulders
    box(g, x - w*0.13, gy - h*0.99, w*0.26, h*0.07, 4, 3.4);
    box(g, x - w*0.31, gy - h*1.20, w*0.62, h*0.21, null, 5.4);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3.4;   // the brow course
    g.beginPath(); g.moveTo(x - w*0.31, gy - h*1.10); g.lineTo(x + w*0.06, gy - h*1.10); g.stroke();
    g.restore();
    // the spear each of them carries out of the house, and the arm on its grip
    g.save(); g.strokeStyle = INK; g.lineWidth = 5.4; g.lineCap = "butt";
    g.beginPath(); g.moveTo(x + w*0.74, gy); g.lineTo(x + w*0.52, gy - h*1.30); g.stroke();
    g.lineWidth = 6.4;
    g.beginPath(); g.moveTo(x + w*0.50, gy - h*0.86); g.lineTo(x + w*0.62, gy - h*0.56); g.stroke();
    g.restore();
    g.beginPath();
    g.moveTo(x + w*0.52, gy - h*1.42);
    g.lineTo(x + w*0.66, gy - h*1.25);
    g.lineTo(x + w*0.37, gy - h*1.25);
    g.closePath();
    g.fillStyle = inkLevel(6); g.fill();
    g.strokeStyle = INK; g.lineWidth = 3.4; g.stroke();
    // ATTACHMENT: a dashed tether from the head up into the lid, with a tick.
    // This is the whole claim of the asset — the field is fixed to the bodies.
    if (d > 0.10){
      dashed(g, [[x, gy - h*1.20],[x, (params.lidY + params.lidH)*H]], [13,8], 4.4, INK);
      g.save(); g.strokeStyle = INK; g.lineWidth = 4.4; g.lineCap = "round";
      const ty = (params.lidY + params.lidH)*H + 11;
      g.beginPath(); g.moveTo(x - 10, ty + 10); g.lineTo(x, ty); g.lineTo(x + 10, ty + 10); g.stroke();
      g.restore();
    }
    diamond(g, x, gy + H*0.020, 9, i === 0);
  });

  // forward motion: arcs and a chevron off the leading edge of the envelope
  g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round";
  for (let i = 0; i < 3; i++){
    const ax = 0.686*W + drift + i*14, ay = 0.766*H;
    g.beginPath(); g.arc(ax, ay, H*0.026, -0.85, 0.85); g.stroke();
  }
  g.beginPath();
  g.moveTo(0.734*W + drift, 0.742*H);
  g.lineTo(0.758*W + drift, 0.766*H);
  g.lineTo(0.734*W + drift, 0.790*H);
  g.stroke(); g.restore();

  // CONSEQUENCE: dawn arriving on the lid and dying there
  if (d > 0.10){
    const ly = params.lidY*H;
    g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "butt";
    for (const bx of [0.190, 0.312, 0.448, 0.576]){
      const x = bx*W + drift;
      g.beginPath(); g.moveTo(x + H*0.052, ly - H*0.072); g.lineTo(x, ly - H*0.026); g.stroke();
    }
    g.lineWidth = 7;
    for (const [a,b] of [[0.158,0.244],[0.284,0.358],[0.424,0.496],[0.548,0.636]]){
      g.beginPath(); g.moveTo(a*W + drift, ly - H*0.022); g.lineTo(b*W + drift, ly - H*0.022); g.stroke();
    }
    g.restore();
  }
}

/* ---------- CONSEQUENCE: how many of them were seen. None. ---------- */
function drawSeen(g, W, H, watch){
  const dw = W*0.054, dh = H*0.062, gap = W*0.026;
  const x = W*0.782, y = H*0.842;
  const v = Math.round(params.seen);
  segDigit(g, x, y, dw, dh, Math.floor(v/10));
  segDigit(g, x + dw + gap, y, dw, dh, v % 10);
  if (watch > 0.05){
    eyeGlyph(g, x + dw*0.62, y - H*0.058, W*0.040, false);
    crossOut(g, x + dw*1.9 + gap, y - H*0.058, 14, 4.6);
  }
  bracket(g, x - 20, y - 6, -18, dh + 12, 4);
}

/* ---------- composite ---------- */
function drawFX(ctx, W, H, state){
  const g = ctx;
  const t      = state.t ?? 0;
  const dark   = clamp01(state.dark   ?? params.dark);
  const travel = clamp01(state.travel ?? params.travel);
  const watch  = clamp01(state.watch  ?? params.watch);
  const gm = routeGeom(W,H);

  const layers = state.layers ||
    ["dawn","covered","axis","plan","route","ghosts","pocket","witness","section","seen"];
  const has = l => layers.includes(l);

  if (has("dawn"))    drawDawn(g, W, H, t);
  if (has("covered")) drawCovered(g, W, H, dark);
  if (has("axis"))    drawAxis(g, W, H, travel);
  if (has("plan"))    drawPlan(g, W, H);
  if (has("route"))   drawRoute(g, W, H, gm, travel);
  if (has("ghosts"))  drawGhosts(g, W, H, gm, travel, dark);
  const pocket = has("pocket") ? drawPocket(g, W, H, gm, travel, dark, t) : null;
  if (has("witness")) drawWitness(g, W, H, pocket, watch);
  if (has("section")) drawSection(g, W, H, dark, travel, t);
  if (has("seen"))    drawSeen(g, W, H, watch);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine-fx.athenas-departure-darkness",
  type:"DIVINE_FX",
  name:"Athena's departure darkness",
  statusWord:"LEADING",
  scene:"OD-B23-S06",
  blend:"multiply",
  pairsWith:"location.road-to-laertess-farm",   // where the covered run comes out

  params,
  layers:["dawn","covered","axis","plan","route","ghosts","pocket","witness","section","seen"],
  anchors:{
    "source:leader":     { x:0.628, y:0.480 },  // the goddess-shaped hole at the head
    "source:origin":     { x:0.952, y:0.166 },  // the tether's off-frame ring
    "field:pocket":      { x:0.586, y:0.480 },  // the travelling dark, plan position
    "field:axis":        { x:0.270, y:0.196 },  // how far out of town they are
    "mark:palace":       { x:0.112, y:0.640 },  // the door they came out of
    "mark:gate":         { x:0.7525,y:0.200 },  // the north gate they leave by
    "target:odysseus":   { x:0.192, y:0.862 },  // section rank, left to right
    "target:telemachus": { x:0.326, y:0.862 },
    "target:eumaeus":    { x:0.460, y:0.862 },
    "target:philoetius": { x:0.594, y:0.862 },
    "target:lid":        { x:0.402, y:0.700 },  // the lid the light dies on
    "effect:witnessA":   { x:0.640, y:0.336 },
    "effect:witnessB":   { x:0.2675,y:0.545 },
    "effect:witnessC":   { x:0.880, y:0.480 },
    "effect:dawn":       { x:0.848, y:0.096 },  // the day, released and free
    "readout:covered":   { x:0.116, y:0.113 },
    "readout:seen":      { x:0.852, y:0.851 },
    "camera:wide":       { x:0.500, y:0.500 },
  },
  zones:{
    covered:  { x0:0.140, y0:0.700, x1:0.664, y1:0.916 },  // the dark's footprint
    plan:     { x0:0.060, y0:0.212, x1:0.940, y1:0.672 },  // the town in plan
    street:   { x0:0.075, y0:0.302, x1:0.925, y1:0.660 },  // the paper channels walked
    daylight: { x0:0.000, y0:0.000, x1:1.000, y1:0.212 },  // first light, not withheld
  },
  states:{
    initial:"leading",
    nodes:{
      armed:     { preview:{ t:0.0, dark:0.00, travel:0.00, watch:0.25,
                             status:"ARMED",     progress:0.05,
                             layers:["dawn","covered","axis","plan","route","section","seen"] } },
      gathering: { preview:{ t:0.7, dark:0.42, travel:0.08, watch:0.55,
                             status:"GATHERING", progress:0.22 } },
      leading:   { preview:{ t:2.1, dark:1.00, travel:0.55, watch:1.00,
                             status:"LEADING",   progress:0.60 } },
      screened:  { preview:{ t:3.2, dark:1.00, travel:0.74, watch:1.00,
                             status:"SCREENED",  progress:0.80 } },
      released:  { preview:{ t:4.6, dark:0.10, travel:1.00, watch:0.20,
                             status:"RELEASED",  progress:1.00 } },
    },
    edges:[["armed","gathering"],["gathering","leading"],["leading","screened"],
           ["screened","leading"],["screened","released"],["released","armed"]],
  },
  duration:5.5,
  channels:["t","dark","travel","watch"],

  preview:()=>({ t:2.1, dark:1.0, travel:0.55, watch:1.0,
                 status:"LEADING", progress:0.60,
                 layers:["dawn","covered","axis","plan","route","ghosts","pocket",
                         "witness","section","seen"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
