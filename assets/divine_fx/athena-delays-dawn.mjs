/* divine-fx.athena-delays-dawn — Book XXIII, OD-B23-S04.
   Odysseus and Penelope have found the bed again and there is not enough night
   left for what they have to tell each other. So Athena goes to the east and
   HOLDS THE CLOCK: she keeps golden-throned Dawn beside the Ocean stream and
   will not let her yoke the swift horses that carry light to men. The night is
   not made darker — it is made LONGER. The effect is a DURATION, so this module
   draws duration as geometry.

     SOURCE      no goddess-body: a dashed clamp closed over the gate latch and
                 one hard press-bar driving down on it. The hand is a hole.
     FIELD       the NIGHT SCALE across the top — a broken time axis, the run of
                 night already spent in solid blocks, the ordinary sunrise mark
                 as a thin post, and the EXTENSION as a hatched run stopped dead
                 by a bar. Two seven-segment numerals read the hours added.
                 (Numerals are drawn as bar geometry: small type dissolves in
                 the dot lattice, seven segments do not.)
     TARGET      Dawn's apparatus, held under the horizon: the sun disc pressed
                 up against the gate with every ray cut off flat at the rule,
                 her chariot wheel chocked and braked, and the yoke-beam lying
                 with two empty collars crossed out. Unyoked is the whole point.
     CONSEQUENCE the rays terminating on a hard bar; the arrested star, with its
                 ghost track behind it and a stop across its path — even the sky
                 is not allowed to turn; and the chamber aperture at the foot of
                 the frame, still interior, still lamplit, still night.

   Procedural over state.t and hold / night / rise / watch:
     RUNNING   hold=0 night=0 rise=0    ordinary night, gate up, nothing held
     CLOSING   hold rises, gate drops, the clamp takes the latch
     HELD      hold=1 night high        the extension runs on (preview)
     STRAINING sun pressed to the rule, rays cut, brake hard on the wheel
     RELEASED  hold=0 rise=1            gate lifts, collars close, day is let go

   Solid tones + hard contour only; the POST pass supplies the halftone. Blends
   `multiply` into a scene so the paper drops out and only the ink lands. */
import { makePen, inkLevel, INK, ACCENT, clamp, clamp01, lerp, smooth, rnd }
  from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;

const params = {
  horizonY: 0.588,               // the rule the light may not cross
  barTop:   0.498,               // gate beam top — clear of the rule, not welded to it
  barH:     0.042,
  barSpans: [[0.050,0.285],[0.372,0.628],[0.715,0.950]],   // broken — never one bar
  postX:    [0.088,0.328,0.672,0.912],
  postW:    0.028,
  postY0:   0.448,
  postY1:   0.646,
  sunX:     0.375,
  sunR:     0.086,
  sunLow:   0.815,               // rise=0 — deep under the Ocean stream
  sunHigh:  0.575,               // rise=1 — clear of the gate
  spikes:   16,
  scaleY:   0.128,               // the night-duration axis baseline
  scaleX0:  0.075,
  scaleX1:  0.930,
  normFrac: 0.575,               // where dawn would ordinarily have come
  wheelX:   0.812,
  wheelY:   0.716,
  wheelR:   0.068,
  yokeY:    0.885,
  starN:    24,
  hold:     1.0,
  night:    0.66,
  rise:     0.30,
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
/* seven-segment numeral: bars, not type. Type this small dissolves in the dots. */
const SEGS = {
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1],
};
function segDigit(g, x, y, w, h, d){
  const s = SEGS[clamp(Math.round(d),0,9)] || SEGS[0];
  const th = Math.max(5, w*0.26), m = th*0.60, half = h/2;
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

/* ---------- FIELD: night above the rule, the Ocean stream below ----------
   One light plane, not a dark mass. The ink in this asset is structural. */
function drawSky(g, W, H, hold){
  const hy = params.horizonY * H;
  g.fillStyle = inkLevel(hold > 0.5 ? 2 : 1); g.fillRect(0, 0, W, hy);
  g.fillStyle = "#ffffff"; g.fillRect(0, hy, W, H - hy);
}

/* ---------- FIELD: the stars, and the one that is not allowed to move ------ */
function drawStars(g, W, H, hold, t){
  const r = rnd(2317);
  g.save();
  for (let i = 0; i < params.starN; i++){
    const x = (0.055 + r()*0.890) * W;
    const y = (0.255 + r()*0.145) * H;
    diamond(g, x, y, r() > 0.74 ? 8 : 5, true);
  }
  g.restore();
  // THE ARRESTED STAR — ghost track behind, hard stop ahead. The sky is stalled.
  const sx = 0.720*W, sy = 0.330*H;
  g.save();
  for (const [dx,dy] of [[-0.170,0.040],[-0.113,0.026],[-0.056,0.012]])
    diamond(g, sx+dx*W, sy+dy*H, 7, false);
  dashed(g, [[sx-0.196*W, sy+0.046*H],[sx-0.014*W, sy+0.003*H]], [8,8], 3);
  g.restore();
  diamond(g, sx, sy, 14, true);
  const bx = sx + 0.062*W, by = sy - 0.014*H;
  g.save();  // the stop: a bar square across its path, and the refusal mark
  g.strokeStyle = ACCENT; g.lineWidth = 9; g.lineCap = "butt";
  g.beginPath(); g.moveTo(bx-11, by-30); g.lineTo(bx+11, by+30); g.stroke();
  g.restore();
  crossOut(g, bx + 0.046*W, by - 0.006*H, 14, 5);
  void hold; void t;
}

/* ---------- FIELD: the NIGHT SCALE — duration drawn as a measured run ------ */
function drawScale(g, W, H, night, hold, t){
  const y  = params.scaleY * H;
  const x0 = params.scaleX0 * W, x1 = params.scaleX1 * W;
  const xn = lerp(x0, x1, params.normFrac);
  // broken axis — no span crosses the frame
  g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  for (const [a,b] of [[0.075,0.360],[0.395,0.660],[0.695,0.930]]){
    g.beginPath(); g.moveTo(a*W, y); g.lineTo(b*W, y); g.stroke();
  }
  // ticks below the axis, every sixth long
  g.lineWidth = 3;
  for (let i = 0; i <= 24; i++){
    const x = lerp(x0, x1, i/24);
    const long = i % 6 === 0;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + (long ? 22 : 10)); g.stroke();
  }
  g.restore();
  // night already spent: solid blocks above the axis, broken into courses
  const spent = [[0.00,0.140],[0.205,0.345],[0.415,0.555],[0.625,0.770],[0.850,1.00]];
  const bh = H * 0.034;
  for (const [a,b] of spent){
    const xa = lerp(x0, xn, a), xb = lerp(x0, xn, b);
    box(g, xa, y - bh, xb - xa, bh * 0.38, 4, 3.4);
    box(g, xa, y - bh*0.62, xb - xa, bh * 0.62, null, 3.4);
  }
  // the ordinary sunrise mark — a thin post with an open head
  g.save(); g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath(); g.moveTo(xn, y - bh - H*0.008); g.lineTo(xn, y - bh - H*0.052); g.stroke();
  g.beginPath();
  g.moveTo(xn, y - bh - H*0.070); g.lineTo(xn + 15, y - bh - H*0.046);
  g.lineTo(xn - 15, y - bh - H*0.046); g.closePath(); g.stroke();
  g.restore();
  // THE EXTENSION: hatched run from the ordinary mark to where it is stopped
  const xe = lerp(xn, x1, clamp01(night) * 0.96);
  if (xe - xn > 4){
    const ty = y - bh*1.10, th = bh * 1.10;
    g.save();
    g.beginPath(); g.rect(xn, ty, xe - xn, th); g.clip();
    g.strokeStyle = INK; g.lineWidth = 3.4;
    for (let hx = xn - th; hx < xe + th; hx += 13){
      g.beginPath(); g.moveTo(hx, ty + th); g.lineTo(hx + th, ty); g.stroke();
    }
    g.restore();
    g.save(); g.strokeStyle = INK; g.lineWidth = 4.4; g.lineJoin = "round";
    g.beginPath(); g.rect(xn, ty, xe - xn, th); g.stroke(); g.restore();
    // the stop bar at the end of the extension — this is where dawn is pinned
    g.save(); g.fillStyle = ACCENT;
    g.fillRect(xe - 5, ty - H*0.020, 10, th + H*0.040); g.restore();
    g.save(); g.strokeStyle = INK; g.lineWidth = 4;
    g.beginPath();
    g.moveTo(xe - 16, ty - H*0.020); g.lineTo(xe + 16, ty - H*0.020);
    g.moveTo(xe - 16, ty + th + H*0.020); g.lineTo(xe + 16, ty + th + H*0.020);
    g.stroke(); g.restore();
    // hours added, as bar geometry, in the clear paper at the left of the frame
    const v = Math.round(clamp01(night) * 12);
    const dw = W*0.046, dh = H*0.074, gap = W*0.030;
    const dx = x0 + W*0.012, dy = y + H*0.056;
    segDigit(g, dx, dy, dw, dh, Math.floor(v/10));
    segDigit(g, dx + dw + gap, dy, dw, dh, v % 10);
    // a unit bracket beside the readout — a scale, not a caption
    g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "square";
    const ux = dx + dw*2 + gap*2;
    g.beginPath();
    g.moveTo(ux + 16, dy - 6); g.lineTo(ux, dy - 6); g.lineTo(ux, dy + dh + 6);
    g.lineTo(ux + 16, dy + dh + 6); g.stroke();
    g.restore();
  }
  void hold; void t;
}

/* ---------- TARGET: the Ocean stream Dawn is kept beside ---------- */
function drawStream(g, W, H){
  g.save(); g.strokeStyle = INK; g.lineCap = "butt";
  const rows = [
    [0.648, [[0.030,0.175],[0.222,0.380],[0.545,0.700]]],
    [0.700, [[0.062,0.215],[0.560,0.690],[0.930,0.975]]],
    [0.760, [[0.030,0.150],[0.196,0.318],[0.925,0.972]]],
  ];
  for (const [ry, spans] of rows){
    g.lineWidth = 4;
    for (const [a,b] of spans){
      g.beginPath(); g.moveTo(a*W, ry*H); g.lineTo(b*W, ry*H); g.stroke();
    }
  }
  // stream chevrons — direction of the encircling water
  g.lineWidth = 3.4; g.lineCap = "round";
  for (const [cx, cy] of [[0.128,0.672],[0.640,0.652],[0.952,0.720]]){
    g.beginPath();
    g.moveTo(cx*W - 12, cy*H - 10); g.lineTo(cx*W + 6, cy*H); g.lineTo(cx*W - 12, cy*H + 10);
    g.stroke();
  }
  g.restore();
}

/* ---------- TARGET: the sun disc, and the rays cut flat at the rule -------- */
function drawSun(g, W, H, rise, hold, t){
  const cx = params.sunX * W;
  const cy = lerp(params.sunLow, params.sunHigh, smooth(clamp01(rise))) * H;
  const R  = params.sunR * H;
  const hy = params.horizonY * H;
  const held = hold > 0.15;
  // rays first, clipped hard at the horizon rule when the gate is down
  g.save();
  if (held){ g.beginPath(); g.rect(0, hy, W, H - hy); g.clip(); }
  g.strokeStyle = INK; g.lineCap = "butt";
  for (let i = 0; i < params.spikes; i++){
    const a = (i/params.spikes)*TAU + 0.10 + Math.sin(t*0.5)*0.02;
    const long = i % 2 === 0;
    const r1 = R * (long ? 1.62 : 1.28);
    g.lineWidth = long ? 5 : 3;
    g.beginPath();
    g.moveTo(cx + Math.cos(a)*R*1.06, cy + Math.sin(a)*R*1.06);
    g.lineTo(cx + Math.cos(a)*r1,     cy + Math.sin(a)*r1);
    g.stroke();
  }
  g.restore();
  // where the rays die: one heavy termination course under the rule
  if (held){
    g.save(); g.strokeStyle = INK; g.lineWidth = 9; g.lineCap = "butt";
    for (const [a,b] of [[0.222,0.318],[0.352,0.452],[0.492,0.540]]){
      g.beginPath(); g.moveTo(a*W, hy + 8); g.lineTo(b*W, hy + 8); g.stroke();
    }
    g.restore();
  }
  // the disc: paper core, hard contour, a blocky quantized hub
  g.beginPath();
  for (let i = 0; i < 12; i++){
    const a = Math.PI/12 + i*TAU/12;
    const x = cx + Math.cos(a)*R, y = cy + Math.sin(a)*R;
    i ? g.lineTo(x,y) : g.moveTo(x,y);
  }
  g.closePath();
  g.fillStyle = "#ffffff"; g.fill();
  g.strokeStyle = INK; g.lineWidth = 6; g.lineJoin = "round"; g.stroke();
  g.beginPath(); g.arc(cx, cy, R*0.44, 0, TAU);
  g.fillStyle = inkLevel(2); g.fill();
  g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  // the throne-tick: Dawn is seated, not travelling
  g.save(); g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath(); g.moveTo(cx - R*0.18, cy); g.lineTo(cx + R*0.18, cy); g.stroke();
  g.restore();
  // the pressure gauge: how hard she is pushing at the rule
  if (held && rise > 0.12){
    const gy = cy - R*1.72;
    g.save(); g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "round";
    g.beginPath();
    g.moveTo(cx - 18, gy + 22); g.lineTo(cx, gy); g.lineTo(cx + 18, gy + 22);
    g.stroke(); g.restore();
  }
  return { cx, cy, R };
}

/* ---------- SOURCE + GATE: the beam that holds the horizon down ------------ */
function drawGate(g, W, H, hold, rise){
  const lift = smooth(clamp01((rise - 0.60)/0.40)) * H * 0.086;
  const hy = params.horizonY * H;
  // horizon rule — broken, heavy, the line light may not cross
  g.save(); g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "butt";
  for (const [a,b] of [[0.020,0.245],[0.300,0.470],[0.545,0.760],[0.815,0.975]]){
    g.beginPath(); g.moveTo(a*W, hy); g.lineTo(b*W, hy); g.stroke();
  }
  g.restore();
  // posts, sunk through the rule into the stream
  const pw = params.postW * W;
  for (const px of params.postX){
    const x = px*W - pw/2;
    box(g, x, params.postY0*H, pw, (params.postY1-params.postY0)*H, 2, 4);
    box(g, x - pw*0.30, params.postY0*H - H*0.020, pw*1.60, H*0.020, 5, 4);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3;
    for (let i = 1; i <= 3; i++){
      const jy = lerp(params.postY0*H, params.postY1*H, i/4);
      g.beginPath(); g.moveTo(x + pw*0.12, jy); g.lineTo(x + pw*0.88, jy); g.stroke();
    }
    g.restore();
  }
  // the gate beam itself: dark upper face, paper underside, broken into courses
  const by = params.barTop*H - lift, bh = params.barH*H;
  for (const [a,b] of params.barSpans){
    const x = a*W, w = (b-a)*W;
    box(g, x, by, w, bh*0.38, hold > 0.15 ? 5 : 3, 4);
    box(g, x, by + bh*0.38, w, bh*0.62, null, 4);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x + w*0.5, by); g.lineTo(x + w*0.5, by + bh); g.stroke();
    g.restore();
  }
  return { by, bh, lift };
}

/* ---------- SOURCE: the goddess as a hole — a dashed clamp on the latch ---- */
function drawClamp(g, W, H, gate, hold, watch){
  if (hold < 0.06) return;
  const cx = 0.490 * W, top = gate.by - H*0.128, bot = gate.by + gate.bh*0.55;
  const w = W * 0.104;
  g.save();
  g.setLineDash([11,9]); g.strokeStyle = INK; g.lineWidth = 4.4; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(cx - w/2, bot);
  g.lineTo(cx - w/2, top + H*0.026);
  g.quadraticCurveTo(cx - w/2, top, cx, top);
  g.quadraticCurveTo(cx + w/2, top, cx + w/2, top + H*0.026);
  g.lineTo(cx + w/2, bot);
  g.stroke();
  for (let i = 1; i <= 2; i++){
    const y = lerp(top + H*0.036, bot - H*0.020, i/3);
    g.beginPath(); g.moveTo(cx - w*0.40, y); g.lineTo(cx + w*0.40, y); g.stroke();
  }
  g.restore();
  // the press: one hard bar driving the beam down, and the jaws that took it
  g.save(); g.fillStyle = ACCENT;
  g.fillRect(cx - 6, top - H*0.052, 12, H*0.046); g.restore();
  g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round";
  g.beginPath();
  g.moveTo(cx - 17, top - H*0.016); g.lineTo(cx, top - H*0.001);
  g.lineTo(cx + 17, top - H*0.016); g.stroke();
  g.restore();
  box(g, cx - w*0.52, gate.by - H*0.014, w*0.30, H*0.030, 7, 3);
  box(g, cx + w*0.22, gate.by - H*0.014, w*0.30, H*0.030, 7, 3);
  // the withheld sight: a bracket at the chamber's own hour and a stop across it
  if (watch < 0.05) return;
  const ox = 0.955*W, oy = 0.400*H;
  g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "square";
  g.beginPath();
  g.moveTo(ox, oy - 34); g.lineTo(ox - 28, oy - 34);
  g.moveTo(ox, oy + 34); g.lineTo(ox - 28, oy + 34);
  g.moveTo(ox - 28, oy - 34); g.lineTo(ox - 28, oy - 8);
  g.moveTo(ox - 28, oy + 8);  g.lineTo(ox - 28, oy + 34);
  g.stroke(); g.restore();
  dashed(g, [[ox - 34, oy],[cx + w*0.62, gate.by - H*0.030]], [10,8], 3.4);
}

/* ---------- TARGET: the chariot, chocked and braked ---------- */
function drawChariot(g, W, H, rise){
  const cx = params.wheelX*W, cy = params.wheelY*H, R = params.wheelR*H;
  const free = rise > 0.75;
  // rim
  g.beginPath(); g.arc(cx, cy, R, 0, TAU);
  g.fillStyle = "#ffffff"; g.fill();
  g.strokeStyle = INK; g.lineWidth = 7; g.stroke();
  g.beginPath(); g.arc(cx, cy, R*0.76, 0, TAU);
  g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  // spokes
  g.save(); g.strokeStyle = INK; g.lineWidth = 5;
  for (let i = 0; i < 8; i++){
    const a = i*TAU/8 + 0.20;
    g.beginPath();
    g.moveTo(cx + Math.cos(a)*R*0.20, cy + Math.sin(a)*R*0.20);
    g.lineTo(cx + Math.cos(a)*R*0.74, cy + Math.sin(a)*R*0.74);
    g.stroke();
  }
  g.restore();
  g.beginPath(); g.arc(cx, cy, R*0.19, 0, TAU);
  g.fillStyle = inkLevel(6); g.fill();
  g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  // the car: a blocky rail box behind the wheel, broken so it is not a bar
  box(g, cx - R*2.05, cy - R*0.96, R*1.30, R*0.30, 5, 4);
  box(g, cx - R*2.05, cy - R*0.50, R*0.30, R*0.86, 4, 4);
  // brake shoe + chock — or, released, a motion arc off the rim
  if (!free){
    box(g, cx - R*0.30, cy - R*1.62, R*0.60, R*0.52, 7, 4);
    box(g, cx - R*0.16, cy - R*1.10, R*0.32, R*0.20, 6, 3);
    g.save(); g.fillStyle = ACCENT;
    g.fillRect(cx - R*0.10, cy - R*2.16, R*0.20, R*0.54); g.restore();
    g.beginPath();                                  // the chock under the rim
    g.moveTo(cx + R*0.34, cy + R*1.00);
    g.lineTo(cx + R*1.14, cy + R*1.00);
    g.lineTo(cx + R*1.14, cy + R*0.44);
    g.closePath();
    g.fillStyle = inkLevel(6); g.fill();
    g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
    crossOut(g, cx + R*1.52, cy - R*0.30, 13, 5);
  } else {
    g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round";
    for (let i = 0; i < 3; i++){
      g.beginPath(); g.arc(cx, cy, R*(1.20 + i*0.16), -1.05, -0.35); g.stroke();
    }
    g.restore();
  }
  return { cx, cy, R };
}

/* ---------- TARGET: the yoke Dawn is not allowed to put on her horses ------ */
function drawYoke(g, W, H, car, rise){
  const y = params.yokeY * H, bh = H*0.026;
  const free = rise > 0.75;
  for (const [a,b] of [[0.300,0.470],[0.505,0.668]]){
    const x = a*W, w = (b-a)*W;
    box(g, x, y - bh, w, bh*0.40, 5, 4);
    box(g, x, y - bh*0.60, w, bh*0.60, null, 4);
  }
  // the two collars: dashed and crossed while unyoked, closed when let go
  for (const cx of [0.372, 0.596]){
    const x = cx*W, r = H*0.036;
    g.save();
    if (!free) g.setLineDash([10,8]);
    g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.ellipse(x, y - bh*0.5, r*0.78, r, 0, 0, TAU); g.stroke();
    g.restore();
    if (!free) crossOut(g, x, y - bh*0.5, r*0.56, 5);
  }
  // traces to the car: slack (sagging, dashed) while held, taut when released
  const tx = car.cx - car.R*2.05, ty = car.cy - car.R*0.30;
  for (const [cx, sag] of [[0.372, 0.062],[0.596, 0.040]]){
    const x = cx*W + H*0.030, y0 = y - bh*0.5;
    if (free){
      g.save(); g.strokeStyle = INK; g.lineWidth = 5;
      g.beginPath(); g.moveTo(x, y0); g.lineTo(tx, ty); g.stroke(); g.restore();
    } else {
      g.save(); g.setLineDash([9,8]); g.strokeStyle = INK; g.lineWidth = 4;
      g.beginPath(); g.moveTo(x, y0);
      g.quadraticCurveTo((x+tx)/2, y0 + sag*H, tx, ty);
      g.stroke(); g.restore();
    }
  }
  // registration diamonds where the horses would stand — two empty stations
  for (const cx of [0.372, 0.596]){
    const x = cx*W;
    diamond(g, x, y + H*0.052, 10, false);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x - 26, y + H*0.052); g.lineTo(x - 16, y + H*0.052);
    g.moveTo(x + 16, y + H*0.052); g.lineTo(x + 26, y + H*0.052); g.stroke();
    g.restore();
  }
}

/* ---------- CONSEQUENCE: the chamber, still interior, still lamplit -------- */
function drawChamber(g, W, H, watch, t){
  if (watch < 0.05) return;
  const x0 = 0.048*W, x1 = 0.238*W, y0 = 0.812*H, y1 = 0.952*H;
  g.save(); g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "square";
  const b = 30;
  g.beginPath();
  g.moveTo(x0, y0 + b); g.lineTo(x0, y0); g.lineTo(x0 + b, y0);
  g.moveTo(x1 - b, y0); g.lineTo(x1, y0); g.lineTo(x1, y0 + b);
  g.moveTo(x1, y1 - b); g.lineTo(x1, y1); g.lineTo(x1 - b, y1);
  g.moveTo(x0 + b, y1); g.lineTo(x0, y1); g.lineTo(x0, y1 - b);
  g.stroke(); g.restore();
  // the lamp still burning inside: a blocky stand and a paper flame
  const cx = (x0+x1)/2, base = y1 - H*0.022;
  box(g, cx - W*0.026, base, W*0.052, H*0.014, 6, 4);
  box(g, cx - W*0.010, base - H*0.026, W*0.020, H*0.026, 5, 4);
  const fh = H*0.042 * (0.88 + 0.12*Math.sin(t*3.0));
  g.beginPath();
  g.moveTo(cx - W*0.017, base - H*0.026);
  g.quadraticCurveTo(cx - W*0.020, base - H*0.026 - fh*0.6, cx, base - H*0.026 - fh);
  g.quadraticCurveTo(cx + W*0.020, base - H*0.026 - fh*0.6, cx + W*0.017, base - H*0.026);
  g.closePath();
  g.fillStyle = "#ffffff"; g.fill();
  g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
  // night still holds over the chamber: three short hatch courses above it
  g.save(); g.strokeStyle = INK; g.lineWidth = 4;
  for (let i = 0; i < 3; i++){
    const hy = y0 - H*0.020 - i*H*0.018;
    g.beginPath(); g.moveTo(x0 + 12 + i*16, hy); g.lineTo(x1 - 12 - i*16, hy); g.stroke();
  }
  g.restore();
}

/* ---------- composite ---------- */
function drawFX(ctx, W, H, state){
  const g = ctx;
  const t     = state.t ?? 0;
  const hold  = clamp01(state.hold  ?? params.hold);
  const night = clamp01(state.night ?? params.night);
  const rise  = clamp01(state.rise  ?? params.rise);
  const watch = clamp01(state.watch ?? params.watch);
  const pen   = makePen(g, { outline: true });

  const layers = state.layers ||
    ["sky","stars","scale","stream","sun","gate","clamp","chariot","yoke","chamber"];
  if (layers.includes("sky"))     drawSky(g, W, H, hold);
  if (layers.includes("stars"))   drawStars(g, W, H, hold, t);
  if (layers.includes("scale"))   drawScale(g, W, H, night, hold, t);
  if (layers.includes("stream"))  drawStream(g, W, H);
  if (layers.includes("sun"))     drawSun(g, W, H, rise, hold, t);
  const gate = layers.includes("gate")
    ? drawGate(g, W, H, hold, rise)
    : { by: params.barTop*H, bh: params.barH*H, lift: 0 };
  if (layers.includes("clamp"))   drawClamp(g, W, H, gate, hold, watch);
  const car = layers.includes("chariot")
    ? drawChariot(g, W, H, rise)
    : { cx: params.wheelX*W, cy: params.wheelY*H, R: params.wheelR*H };
  if (layers.includes("yoke"))    drawYoke(g, W, H, car, rise);
  if (layers.includes("chamber")) drawChamber(g, W, H, watch, t);
  void pen;
}

export const asset = {
  id:"divine-fx.athena-delays-dawn",
  type:"DIVINE_FX",
  name:"Athena Delays Dawn",
  statusWord:"HELD",
  scene:"OD-B23-S04",
  blend:"multiply",
  pairsWith:"location.megaron-hall",   // the house whose night is being extended

  params,
  layers:["sky","stars","scale","stream","sun","gate","clamp","chariot","yoke","chamber"],
  anchors:{
    "source:clamp":     { x:0.490, y:0.470 },  // the goddess-shaped hole on the latch
    "source:press":     { x:0.490, y:0.330 },
    "field:scale":      { x:0.500, y:0.128 },  // the night-duration axis
    "field:normal":     { x:0.567, y:0.100 },  // where dawn would ordinarily have come
    "field:extension":  { x:0.780, y:0.100 },  // the run of night added
    "target:horizon":   { x:0.500, y:0.552 },  // the rule the light may not cross
    "target:sun":       { x:0.375, y:0.721 },  // Dawn, held beside the Ocean stream
    "target:chariot":   { x:0.815, y:0.702 },
    "target:yoke":      { x:0.484, y:0.885 },  // the yoke she is not allowed to set
    "target:stationL":  { x:0.372, y:0.937 },  // where Lampus would stand
    "target:stationR":  { x:0.596, y:0.937 },  // where Phaethon would stand
    "effect:chamber":   { x:0.143, y:0.882 },  // the reunion, still in night
    "camera:wide":      { x:0.500, y:0.500 },
  },
  zones:{
    night:     { x0:0.00, y0:0.00, x1:1.00, y1:0.552 },  // the extended dark
    stream:    { x0:0.00, y0:0.552, x1:1.00, y1:0.800 }, // Ocean, where Dawn waits
    held:      { x0:0.24, y0:0.58, x1:0.53, y1:0.83 },   // the disc's pen
    unyoked:   { x0:0.28, y0:0.84, x1:0.70, y1:0.96 },   // the empty horse stations
  },
  states:{
    initial:"held",
    nodes:{
      running:  { preview:{ t:0.0, hold:0.00, night:0.00, rise:0.00, watch:0.5,
                            status:"RUNNING",  progress:0.06 } },
      closing:  { preview:{ t:0.8, hold:0.55, night:0.14, rise:0.08, watch:0.9,
                            status:"CLOSING",  progress:0.24 } },
      held:     { preview:{ t:2.2, hold:1.00, night:0.66, rise:0.30, watch:1,
                            status:"HELD",     progress:0.62 } },
      straining:{ preview:{ t:3.6, hold:1.00, night:0.94, rise:0.52, watch:1,
                            status:"STRAINING",progress:0.88 } },
      released: { preview:{ t:5.2, hold:0.00, night:1.00, rise:1.00, watch:0.3,
                            status:"RELEASED", progress:1.00 } },
    },
    edges:[["running","closing"],["closing","held"],["held","straining"],
           ["straining","held"],["straining","released"],["released","running"]],
  },
  duration:6.0,
  channels:["t","hold","night","rise","watch"],

  preview:()=>({ t:2.2, hold:1.0, night:0.66, rise:0.30, watch:1,
                 status:"HELD", progress:0.62,
                 layers:["sky","stars","scale","stream","sun","gate","clamp",
                         "chariot","yoke","chamber"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
