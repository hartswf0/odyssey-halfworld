/* location.ithaca-town-road-and-fountain — the last stretch of country road
   below the town of Ithaca, with the public spring beside it. LOCATION asset
   (empty navigable set — NO baked figures). Solid grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone.

   WHY THIS SET EXISTS. Book XVII walks Odysseus down off the farm and into his
   own town, and the walk is interrupted exactly once, at a place the poem is
   specific about: the fair-flowing fountain the townsmen built, ringed with
   water-loving poplars, with an altar of the nymphs above it where every passer
   makes an offering. Melanthius comes down the road driving goats; Eumaeus and
   the beggar come up. The road at that point cannot let both parties by. So the
   set is built around a PINCH, and the spring is what stands in the pinch.

   ONE ROAD, READ EVERYWHERE. A single cubic (roadPtN) supplies the carriageway
   the road is drawn from AND every roadside anchor, so a figure placed at
   `road:mid` stands on the road as drawn, at the size it is drawn. The exposed
   feet ladder runs y = 1.00 / .92 / .82 / .79 / .72 / .69 / .64 / .53 / .45 /
   .41 — near-to-far, with the far end still short of the city wall.

   THE BOTTLENECK IS GEOMETRY, NOT DECORATION. roadHW() carries a gaussian pinch
   at t = .46: the carriageway physically narrows to a third of its shoulder
   width where the spring's terrace pushes in from the left and a rock buttress
   from the right. Two parties meeting there is a fact about the road, so the
   road carries it. `meet:below` and `meet:above` are a CONTACT PAIR — the two
   sides of the pinch, one step apart in depth, so a confrontation staged here
   can never resolve two bodies onto one coordinate.

   NOTHING SPANS THE FRAME. Every terrace lip is cut at the road and cut again
   at the verge; the hedges each run only part of the depth; the city wall is
   three broken courses, not one bar. A set of full-width horizontals stops
   being a country and becomes a barcode.

   THE PALACE SIGHTLINE is plot. A surveyed dashed line runs from the palace
   portico on the ridge down to the spring: from the great house you can see who
   is standing at the water. Cold by day, struck in the "meeting" state.

   States: "day", "meeting" (the pinch marked, the sightline struck, the herd
   ground occupied), "dusk" (gate lamp lit), "bare" (walking set only).

   Serves OD-B17-S02; the road returns in Books XX and XXIV.
   Atlas: OD-B17-S02 — rural approach with sacred spring, meeting bottleneck,
   city gate, and palace sightline. */
import { makePen, toneSolid, inkLevel, INK, lerp, clamp } from "../../engine/halfworld-engine.mjs";

const MODES = ["day", "meeting", "dusk", "bare"];

const params = {
  horizon:0.335,     // sky / ground split as a fraction of H
  wallY:0.372,       // foot of the city wall
  gateX:0.585,       // the city gate straddles the road here
  stairX:0.408,      // the walled stair up from the road to the wall walk
  springT:0.46,      // where on the road the spring stands (and the pinch bites)
  poplars:5,         // the water-loving poplars ringing the spring
  hedges:6,          // terrace divisions, each cut short
  struck:false,      // the palace sightline driven in
};

/* ---------- THE ROAD ----------
   One cubic, drawn once and read everywhere. t = 0 at the near bottom edge
   (the country, the farm behind), t = 1 at the city gate. */
const R0 = { x:0.720, y:1.040 };
const R1 = { x:0.180, y:0.885 };
const R2 = { x:0.760, y:0.575 };
const R3 = { x:0.585, y:0.378 };

function roadPtN(t){
  const u = 1 - t, a = u*u*u, b = 3*u*u*t, c = 3*u*t*t, d = t*t*t;
  return { x: a*R0.x + b*R1.x + c*R2.x + d*R3.x,
           y: a*R0.y + b*R1.y + c*R2.y + d*R3.y };
}
function roadTanN(t){
  const u = 1 - t;
  const dx = 3*u*u*(R1.x-R0.x) + 6*u*t*(R2.x-R1.x) + 3*t*t*(R3.x-R2.x);
  const dy = 3*u*u*(R1.y-R0.y) + 6*u*t*(R2.y-R1.y) + 3*t*t*(R3.y-R2.y);
  const n = Math.hypot(dx, dy) || 1;
  return { x:dx/n, y:dy/n };
}
/* THE PINCH: the carriageway's half-width, with a gaussian throat at the spring.
   This is the bottleneck — it is in the geometry, not in a label. */
const pinch = t => 1 - 0.34*Math.exp(-Math.pow((t - params.springT)/0.105, 2));
const roadHW = t => lerp(0.098, 0.005, Math.pow(t, 0.76)) * pinch(t);
/* depth scale of anything standing on the road at t */
const depthAt = t => lerp(1.00, 0.09, Math.pow(t, 0.80));

/* ---------- the spring, its terrace and its altar ---------- */
const SPRING = { x:0.252, y:0.786 };            // basin centre
const SPOUT  = { x:0.192, y:0.742 };            // the carved mouth in the rock
const ALTAR  = { x:0.362, y:0.722 };            // the nymphs' altar, above the water
const SPUR   = [ [0.452,0.775], [0.386,0.780], [0.318,0.784] ];  // the drawing path

/* ---------- the palace on the ridge ---------- */
const PALACE = { x0:0.640, x1:0.845, base:0.336 };
const PORTICO = { x:0.742, y:0.320 };

/* ---------- anchors: taken from the road, never hand-tuned ----------
   (the near end of the cubic runs a little past the bottom edge so the road
   bleeds off-frame; anchors are clamped back into 0..1 asset space) */
const rd = t => { const p = roadPtN(t);
  return { x:+clamp(p.x,0,1).toFixed(3), y:+clamp(p.y,0,0.998).toFixed(3) }; };
export const anchors = {
  "entrance:country":  rd(0.03),               // the walk-on from the farm road
  "road:near":         rd(0.08),               // y ~ 1.00 — a figure at full height
  "road:lower":        rd(0.22),               // y ~ .92
  "road:mid":          rd(0.36),               // y ~ .82
  "meet:below":        rd(0.40),               // y ~ .79 — CONTACT PAIR, uphill side
  "road:throat":       rd(0.46),               // y ~ .76 — the narrowest point
  "meet:above":        rd(0.54),               // y ~ .69 — CONTACT PAIR, downhill side
  "road:upper":        rd(0.62),               // y ~ .64
  "herd:ground":       { x:0.700, y:0.612 },   // the widening where a driven herd bunches
  "road:far":          rd(0.76),               // y ~ .53
  "road:wall":         rd(0.88),               // y ~ .45
  "road:gate-approach":rd(0.95),               // y ~ .41
  "spring:basin":      SPRING,
  "spring:spout":      SPOUT,
  "spring:steps":      { x:0.318, y:0.802 },   // the worn steps down off the road
  "spring:branch":     { x:SPUR[0][0], y:SPUR[0][1] },
  "altar:nymphs":      ALTAR,
  "grove:poplars":     { x:0.208, y:0.700 },
  "rock:buttress":     { x:0.648, y:0.742 },   // the spur that pinches from the right
  "verge:rest":        { x:0.606, y:0.836 },   // the shoulder wide enough to stand aside on
  "waymark:lower":     { x:0.812, y:0.930 },
  "waymark:upper":     { x:0.428, y:0.636 },
  "stair:wall":        { x:params.stairX, y:0.386 },
  "threshold:city-gate":{ x:params.gateX, y:0.382 },
  "gate:city":         { x:params.gateX, y:0.378 },
  "palace:portico":    PORTICO,
  "palace:ridge":      { x:0.742, y:0.300 },
  "exit:city":         { x:params.gateX, y:0.378 },
  "exit:country":      rd(0.03),
  "camera:wide":       { x:0.500, y:0.520 },
  "camera:spring":     { x:0.360, y:0.760 },
  "camera:throat":     { x:0.520, y:0.720 },
  "camera:gate":       { x:0.585, y:0.410 },
};

/* ---------- small stamps ---------- */
function poplar(pen, g, x, base, h, w, tone){
  pen.paint(() => {
    g.moveTo(x, base);
    g.lineTo(x - w*0.46, base - h*0.30);
    g.lineTo(x - w*0.26, base - h*0.70);
    g.lineTo(x, base - h);
    g.lineTo(x + w*0.26, base - h*0.70);
    g.lineTo(x + w*0.46, base - h*0.30);
    g.closePath();
  }, tone, 3);
  pen.ink(() => { g.moveTo(x, base); g.lineTo(x, base - h*0.20); }, 2.5);
}
function oliveTree(pen, g, x, base, h, w, tone){
  pen.paint(() => {
    g.moveTo(x - w*0.10, base);
    g.lineTo(x - w*0.14, base - h*0.42);
    g.lineTo(x + w*0.12, base - h*0.44);
    g.lineTo(x + w*0.09, base);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  for (const [ox, oy, r] of [[-0.30,-0.56,0.38],[0.29,-0.62,0.35],[0,-0.82,0.33]])
    pen.paint(() => { g.ellipse(x + w*ox, base + h*oy, w*r, h*r*0.64, 0, 0, 7); }, tone, 3.5);
}
function bush(pen, g, x, base, s, tone){
  pen.paint(() => { g.ellipse(x, base - s*0.56, s*0.64, s*0.44, 0, 0, 7); }, tone, 2.5);
  pen.ink(() => { g.moveTo(x, base); g.lineTo(x, base - s*0.48); }, 2);
}
function houseBlock(pen, g, x, base, w, h, tone, roofTone){
  pen.paint(() => { g.rect(x - w/2, base - h, w, h); }, tone, 2.5);
  pen.paint(() => { g.rect(x - w*0.60, base - h - h*0.18, w*1.20, h*0.20); }, roofTone, 2);
}

/* ---------- the set ---------- */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = MODES.includes(st.state) ? st.state : "day";
  const dusk = mode === "dusk";
  const struck = (st.struck ?? params.struck) || mode === "meeting";
  const layers = st.layers || (mode === "bare"
    ? ["sky","hills","ground","terraces","city","palace","road","narrows","verge"]
    : ["sky","hills","ground","terraces","scrub","city","palace","sightline","road",
       "narrows","fold","spur","grove","spring","altar","waymarks","verge","fg"]);
  const has = l => layers.includes(l);

  /* the whole set lights from this table — keep it LIGHT, dark only on accents */
  const T = {
    sky:   dusk ? 3 : 1,
    far:   dusk ? 3 : 2,
    ridge: dusk ? 4 : 3,
    ground:dusk ? 3 : 2,
    field: dusk ? 4 : 3,
    stone: dusk ? 5 : 4,
    build: dusk ? 4 : 3,
    dark:  dusk ? 7 : 6,
    road:  dusk ? 2 : 1,
    water: dusk ? 3 : 2,
  };

  const hz = params.horizon * H;
  const P  = t => { const p = roadPtN(t); return { x:p.x*W, y:p.y*H }; };
  const TN = t => roadTanN(t);
  const HW = t => roadHW(t) * W;
  /* which side of the carriageway a thing sits on, in SCREEN terms: k > 0 is
     the viewer's right, k < 0 the viewer's left, |k| in carriageway half-widths.
     Everything roadside is placed through this so nothing lands ON the road. */
  const off = (t, k) => { const p = P(t), v = TN(t), hw = HW(t)*k;
    return { x: p.x - v.y*hw, y: p.y + v.x*hw }; };
  const VP = { x: params.gateX*W, y: hz };          // the terraces converge on the gate
  const NEAR = H*1.05;
  const FP = (x, u) => ({ x: lerp(x*W, VP.x, u), y: lerp(NEAR, VP.y, u) });

  /* ---- SKY ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, hz);
    g.fillStyle = inkLevel(T.sky + 1);
    for (let i = 0; i < 3; i++){
      g.beginPath();
      g.ellipse(W*(0.18 + i*0.30), hz*(0.24 + 0.22*(i%2)), W*0.115, H*0.012, 0, 0, 7);
      g.fill();
    }
    if (dusk){ g.fillStyle = inkLevel(1); g.fillRect(0, hz - H*0.022, W, H*0.022); }
  }

  /* ---- HILLS: the far range, then the town's own ridge on the right ---- */
  if (has("hills")){
    /* the skirts of both ranges close BELOW the horizon, where the ground plane
       paints over them: a contour run along y = hz would be a black rule across
       the whole frame, which is a barcode, not a country. */
    const skirt = hz + H*0.034;
    pen.paint(() => {
      g.moveTo(0, skirt);
      g.lineTo(0, hz - H*0.008);
      g.quadraticCurveTo(W*0.16, hz - H*0.062, W*0.34, hz - H*0.026);
      g.quadraticCurveTo(W*0.52, hz - H*0.070, W*0.70, hz - H*0.030);
      g.lineTo(W*0.70, skirt); g.closePath();
    }, toneSolid(inkLevel(T.far)), 4);
    pen.paint(() => {
      g.moveTo(W*0.54, skirt);
      g.lineTo(W*0.54, hz - H*0.004);
      g.quadraticCurveTo(W*0.74, hz - H*0.088, W*0.88, hz - H*0.052);
      g.quadraticCurveTo(W*0.96, hz - H*0.030, W, hz - H*0.034);
      g.lineTo(W, skirt); g.closePath();
    }, toneSolid(inkLevel(T.ridge)), 4);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.26;
    for (const u of [0.10, 0.24, 0.40]){
      g.beginPath();
      g.moveTo(W*(0.08 + u*0.52), hz - H*0.048 + H*0.024*u);
      g.lineTo(W*(0.08 + u*0.52) + W*0.020, hz);
      g.stroke();
    }
    g.restore();
  }

  /* ---- GROUND ---- */
  if (has("ground")){
    g.fillStyle = inkLevel(T.ground); g.fillRect(0, hz, W, H - hz);
  }

  /* ---- TERRACES: perspective plots, broken lips, part-depth hedges ----
     Nothing here runs the full width and no hedge runs the full depth. */
  if (has("terraces")){
    const quad = (xa, xb, u0, u1, level) => {
      const a = FP(xa, u0), b = FP(xb, u0), c = FP(xb, u1), d = FP(xa, u1);
      g.beginPath();
      g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
    };
    const PLOTS = [
      [-0.44,-0.04, 0.05, 0.26], [-0.22, 0.08, 0.34, 0.50], [-0.06, 0.18, 0.56, 0.70],
      [ 0.96, 1.52, 0.04, 0.24], [ 0.88, 1.34, 0.32, 0.50], [ 0.80, 1.14, 0.56, 0.69],
      [ 0.12, 0.36, 0.78, 0.88], [ 0.74, 1.02, 0.76, 0.87],
    ];
    PLOTS.forEach(p => quad(p[0], p[1], p[2], p[3], T.field));
    // stubble ticks — texture inside the plots, not tone
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.15;
    for (const p of PLOTS){
      for (let r = 0; r < 4; r++){
        const u = lerp(p[2], p[3], (r + 0.5)/4);
        const sc = lerp(0.022, 0.004, u);
        for (let k = 0; k < 8; k++){
          const q = FP(lerp(p[0], p[1], (k + 0.5)/8), u);
          if (q.x < -W*0.05 || q.x > W*1.05) continue;
          g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - H*sc); g.stroke();
        }
      }
    }
    g.restore();
    // hedges: each one runs only a slice of the depth, so the fan never closes
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = 0.22;
    for (let i = 0; i < params.hedges; i++){
      const x = -0.34 + i * (1.64 / (params.hedges - 1));
      const u0 = (i % 2) ? 0.06 : 0.34, u1 = (i % 2) ? 0.46 : 0.82;
      const a = FP(x, u0), b = FP(x, u1);
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    }
    g.restore();
    /* terrace lips — thin courses in broken runs, cut at the road AND set at
       DIFFERENT depths left and right. Runs sharing one u land on one screen
       y and re-assemble into the full-width rule this set exists to avoid. */
    const LIPS = [
      [-0.38, 0.00, 0.23], [ 0.70, 0.96, 0.34], [ 1.04, 1.44, 0.29],
      [-0.30, 0.06, 0.61], [ 0.74, 1.00, 0.51], [ 1.06, 1.40, 0.66],
    ];
    {
      for (const [xa, xb, u] of LIPS){
        const th = H * lerp(0.014, 0.004, u);
        const a = FP(xa, u), b = FP(xb, u);
        if (b.x < -W*0.06 || a.x > W*1.06) continue;
        pen.paint(() => {
          g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
          g.lineTo(b.x, b.y + th); g.lineTo(a.x, a.y + th); g.closePath();
        }, toneSolid(inkLevel(T.field)), 2.5);
        g.save(); g.strokeStyle = INK; g.lineWidth = 1.6; g.globalAlpha = 0.32;
        for (let i = 1; i < 7; i++){
          const k = i/7, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
          g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + th); g.stroke();
        }
        g.restore();
      }
    }
  }

  /* ---- SCRUB: olive and thorn stamped at a depth scale on both flanks ---- */
  if (has("scrub")){
    for (let r = 0; r < 4; r++){
      const u = 0.14 + r*0.18;
      const s = W * lerp(0.042, 0.010, u);
      for (let k = 0; k < 3; k++){
        const q = FP(-0.20 + k*0.10, u);
        if (q.x < -W*0.02) continue;
        bush(pen, g, q.x, q.y, s, toneSolid(inkLevel(T.field)));
      }
      for (let k = 0; k < 3; k++){
        const q = FP(0.98 + k*0.12, u);
        if (q.x > W*1.02) continue;
        bush(pen, g, q.x, q.y, s, toneSolid(inkLevel(T.field)));
      }
    }
  }

  /* ---- THE CITY: broken wall, gate, wall-stair, stepped roofs behind ---- */
  if (has("city")){
    const wy = params.wallY * H, wh = H * 0.019;
    const seeds = [0.446,0.478,0.510,0.628,0.660,0.692,0.724,0.802,0.834];
    for (let i = 0; i < seeds.length; i++){
      const hx = seeds[i] * W;
      const hw = W * (0.023 + 0.009*((i*5)%3));
      const hh = H * (0.020 + 0.010*((i*7)%3));
      houseBlock(pen, g, hx, wy - H*0.002, hw, hh,
                 toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.stone + (i%2))));
    }
    const gL = (params.gateX - 0.017)*W, gR = (params.gateX + 0.017)*W;
    const sL = (params.stairX - 0.010)*W, sR = (params.stairX + 0.010)*W;
    const seg = (x0, x1) => pen.paint(() => { g.rect(x0, wy - wh, x1 - x0, wh); },
                                      toneSolid(inkLevel(T.build)), 3);
    seg(W*0.352, sL); seg(sR, gL); seg(gR, W*0.878);   // three courses, never one bar
    for (let i = 0; i < 24; i++){
      const cx = W*0.358 + i * W*0.0222;
      if (cx > sL - W*0.005 && cx < sR + W*0.005) continue;
      if (cx > gL - W*0.005 && cx < gR + W*0.005) continue;
      if (cx > W*0.870) continue;
      pen.paint(() => { g.rect(cx, wy - wh - H*0.006, W*0.009, H*0.006); },
                toneSolid(inkLevel(T.stone)), 1.5);
    }
    // THE CITY GATE — two piers, a lintel, a dark arch the road runs into
    const jw = W*0.011;
    for (const bx of [gL - jw, gR])
      pen.paint(() => { g.rect(bx, wy - wh*1.40, jw, wh*1.40); }, toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.rect(gL - jw*1.4, wy - wh*1.60, (gR-gL) + jw*2.8, wh*0.36); },
              toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.rect(gL, wy - wh*1.16, gR - gL, wh*1.16); },
              toneSolid(inkLevel(dusk ? 5 : 7)), 2.5);
    if (dusk){
      g.save(); g.fillStyle = "#ffffff";
      g.beginPath(); g.ellipse((gL+gR)/2, wy - wh*0.76, (gR-gL)*0.26, wh*0.30, 0, 0, 7);
      g.fill(); g.restore();
    }
    // THE WALL-STAIR — the townsfolk's way up, broken into treads
    for (let i = 0; i < 5; i++)
      pen.paint(() => { g.rect(sL, wy - wh*(0.20 + i*0.22), (sR-sL)*(1 - i*0.10), wh*0.20); },
                toneSolid(inkLevel(T.stone + 1)), 1.6);
  }

  /* ---- THE PALACE on the ridge above the town: far, but readable ---- */
  if (has("palace")){
    const px0 = PALACE.x0*W, px1 = PALACE.x1*W, base = PALACE.base*H;
    const bw = px1 - px0, bh = H*0.030;
    pen.paint(() => { g.rect(px0 - W*0.013, base, bw + W*0.026, H*0.009); },
              toneSolid(inkLevel(T.stone)), 2.5);                     // terrace
    pen.paint(() => { g.rect(px0, base - bh, bw, bh); }, toneSolid(inkLevel(T.build)), 3);
    const nCol = 6;
    for (let i = 0; i < nCol; i++){
      const cx = px0 + bw*(0.10 + 0.80*i/(nCol-1));
      pen.paint(() => { g.rect(cx - W*0.005, base - bh*0.76, W*0.010, bh*0.76); },
                toneSolid(inkLevel(T.dark)), 2);
    }
    pen.paint(() => { g.rect(px0 - W*0.009, base - bh - H*0.008, bw + W*0.018, H*0.009); },
              toneSolid(inkLevel(T.stone + 1)), 2.5);                 // architrave
    pen.paint(() => {
      g.moveTo(px0 - W*0.016, base - bh - H*0.008);
      g.lineTo((px0 + px1)/2, base - bh - H*0.038);
      g.lineTo(px1 + W*0.016, base - bh - H*0.008);
      g.closePath();
    }, toneSolid(inkLevel(T.build + 2)), 3);                          // roof
    // THE PORTICO — the doorway the sightline is taken from
    pen.paint(() => { g.rect(PORTICO.x*W - W*0.012, base - bh*0.70, W*0.024, bh*0.70); },
              toneSolid(inkLevel(7)), 2.5);
    for (let i = 0; i < 2; i++)
      pen.paint(() => { g.rect(PORTICO.x*W - W*0.022 - i*W*0.006, base + i*H*0.0035,
                               W*0.044 + i*W*0.012, H*0.0035); },
                toneSolid(inkLevel(T.stone)), 1.5);
  }

  /* ---- THE PALACE SIGHTLINE: from the portico down onto the water ---- */
  if (has("sightline")){
    g.save();
    g.strokeStyle = INK; g.lineWidth = struck ? 3.2 : 2.2;
    g.globalAlpha = struck ? 0.68 : 0.26;
    g.setLineDash([W*0.016, W*0.014]);
    g.beginPath();
    g.moveTo(PORTICO.x*W, PORTICO.y*H + H*0.006);
    g.lineTo(SPRING.x*W + W*0.030, SPRING.y*H - H*0.020);
    g.stroke(); g.setLineDash([]);
    if (struck){
      g.lineWidth = 4; g.globalAlpha = 0.85;
      g.beginPath();
      g.arc(SPRING.x*W + W*0.030, SPRING.y*H - H*0.020, W*0.036, 0, 7);
      g.stroke();
    }
    g.restore();
  }

  /* ---- THE ROAD ---- */
  if (has("road")){
    const N = 52;
    g.beginPath();
    for (let i = 0; i <= N; i++){
      const t = i/N, p = P(t), v = TN(t), hw = HW(t);
      const x = p.x - v.y*hw, y = p.y + v.x*hw;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    for (let i = N; i >= 0; i--){
      const t = i/N, p = P(t), v = TN(t), hw = HW(t);
      g.lineTo(p.x + v.y*hw, p.y - v.x*hw);
    }
    g.closePath(); g.fillStyle = inkLevel(T.road); g.fill();
    g.save(); g.strokeStyle = INK; g.lineJoin = "round";
    for (const s of [1, -1]){
      g.beginPath();
      for (let i = 0; i <= N; i++){
        const t = i/N, p = P(t), v = TN(t), hw = HW(t);
        const x = p.x + s*v.y*hw, y = p.y - s*v.x*hw;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.lineWidth = 3.5; g.stroke();
    }
    g.restore();
    // ruts, thinning with distance and squeezing together through the throat
    g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.30;
    for (const off of [-0.34, 0.34]){
      for (let i = 0; i < N; i += 3){
        const t = i/N, t2 = Math.min(1, (i + 1.7)/N);
        const a = P(t), va = TN(t), ha = HW(t)*off;
        const b = P(t2), vb = TN(t2), hb = HW(t2)*off;
        g.lineWidth = lerp(4, 1.2, t);
        g.beginPath();
        g.moveTo(a.x - va.y*ha, a.y + va.x*ha);
        g.lineTo(b.x - vb.y*hb, b.y + vb.x*hb);
        g.stroke();
      }
    }
    g.restore();
    // loose stones on the shoulders, sized by depth
    g.fillStyle = inkLevel(T.stone);
    for (let i = 0; i < 9; i++){
      const t = 0.04 + i*0.056, p = P(t), v = TN(t), hw = HW(t)*(i%2 ? 1.30 : -1.34);
      const r = W*0.009*depthAt(t);
      g.beginPath(); g.ellipse(p.x - v.y*hw, p.y + v.x*hw, r, r*0.60, 0, 0, 7); g.fill();
    }
  }

  /* ---- THE NARROWS: what does the pinching ----
     A rock buttress crowds in from the right and the spring's revetment wall
     from the left. Both stop dead at the carriageway edge — the road is the
     only way through, and that is the whole plot of the scene. */
  if (has("narrows")){
    const tt = params.springT;
    const E = off(tt,  1.0);            // viewer's RIGHT shoulder of the throat
    const Wst = off(tt, -1.0);          // viewer's LEFT shoulder of the throat
    // right-hand rock spur: faceted, stepped, a real obstruction, and LIGHT —
    // it is a wall of dry rock, not a shadow
    pen.paint(() => {
      g.moveTo(E.x + W*0.004, E.y + H*0.030);
      g.lineTo(E.x + W*0.008, E.y - H*0.010);
      g.lineTo(E.x + W*0.036, E.y - H*0.020);
      g.lineTo(E.x + W*0.042, E.y - H*0.036);
      g.lineTo(E.x + W*0.086, E.y - H*0.030);
      g.lineTo(E.x + W*0.094, E.y - H*0.008);
      g.lineTo(E.x + W*0.118, E.y + H*0.012);
      g.lineTo(E.x + W*0.088, E.y + H*0.038);
      g.lineTo(E.x + W*0.034, E.y + H*0.040);
      g.closePath();
    }, toneSolid(inkLevel(T.ground)), 3.5);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.40;
    for (const [ax, ay, bx, by] of [[0.014,-0.006,0.050,0.028],[0.044,-0.032,0.070,0.008],
                                    [0.078,-0.024,0.100,0.014]]){
      g.beginPath(); g.moveTo(E.x + W*ax, E.y + H*ay); g.lineTo(E.x + W*bx, E.y + H*by); g.stroke();
    }
    g.restore();
    // a scrub cap so the spur is not one bald mass
    bush(pen, g, E.x + W*0.062, E.y - H*0.028, W*0.030, toneSolid(inkLevel(T.field)));
    // left-hand revetment holding up the spring's terrace, cut dead at the road
    pen.paint(() => {
      g.moveTo(Wst.x - W*0.004, Wst.y + H*0.024);
      g.lineTo(Wst.x - W*0.006, Wst.y - H*0.020);
      g.lineTo(Wst.x - W*0.092, Wst.y - H*0.032);
      g.lineTo(Wst.x - W*0.096, Wst.y + H*0.014);
      g.closePath();
    }, toneSolid(inkLevel(T.field)), 3);
    g.save(); g.strokeStyle = INK; g.lineWidth = 1.8; g.globalAlpha = 0.38;
    for (let i = 1; i < 5; i++){
      const k = i/5, bx = lerp(Wst.x - W*0.006, Wst.x - W*0.092, k);
      g.beginPath();
      g.moveTo(bx, lerp(Wst.y - H*0.020, Wst.y - H*0.032, k));
      g.lineTo(bx, lerp(Wst.y + H*0.024, Wst.y + H*0.014, k));
      g.stroke();
    }
    g.restore();
    // the throat itself, measured across, when the meeting is on
    if (struck){
      g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.72;
      g.setLineDash([W*0.010, W*0.009]);
      g.beginPath();
      g.moveTo(Wst.x - W*0.006, Wst.y - H*0.004); g.lineTo(E.x + W*0.008, E.y - H*0.004);
      g.stroke(); g.setLineDash([]); g.restore();
    }
  }

  /* ---- THE HOLDING FOLD above the throat ----
     A driven herd cannot be squeezed through the narrows; it is bunched on the
     right shoulder first. So the shoulder widens there and carries a broken
     dry-stone fold — three stubs and a gate gap, never a continuous run. */
  if (has("fold")){
    const A = off(0.585, 1.15), B = off(0.700, 1.55);
    const s = depthAt(0.62);
    const post = (x, y, w, h) =>
      pen.paint(() => { g.rect(x, y - h, w, h); }, toneSolid(inkLevel(T.stone)), 2.2);
    const runs = [[0.00, 0.34], [0.46, 0.72], [0.84, 1.00]];
    for (const [k0, k1] of runs){
      const x0 = lerp(A.x, B.x, k0), x1 = lerp(A.x, B.x, k1);
      const y0 = lerp(A.y, B.y, k0), y1 = lerp(A.y, B.y, k1);
      pen.paint(() => {
        g.moveTo(x0, y0); g.lineTo(x1, y1);
        g.lineTo(x1, y1 - H*0.020*s); g.lineTo(x0, y0 - H*0.020*s); g.closePath();
      }, toneSolid(inkLevel(T.field)), 2.4);
      post(x0 - W*0.004*s, y0 + H*0.002*s, W*0.009*s, H*0.030*s);
      post(x1 - W*0.005*s, y1 + H*0.002*s, W*0.009*s, H*0.030*s);
    }
    // the trodden ground inside the fold, where the animals stand
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.20;
    for (let i = 0; i < 7; i++){
      const q = lerp(0.10, 0.92, i/6);
      const x = lerp(A.x, B.x, q) - W*0.030*s, y = lerp(A.y, B.y, q) + H*0.020*s;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + W*0.020*s, y); g.stroke();
    }
    g.restore();
  }

  /* ---- THE DRAWING PATH: the spur worn off the road down to the water ---- */
  if (has("spur")){
    g.save();
    g.strokeStyle = INK; g.lineWidth = W*0.017; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(SPUR[0][0]*W, SPUR[0][1]*H);
    for (let i = 1; i < SPUR.length; i++) g.lineTo(SPUR[i][0]*W, SPUR[i][1]*H);
    g.stroke();
    g.strokeStyle = inkLevel(T.road); g.lineWidth = W*0.009;
    g.beginPath(); g.moveTo(SPUR[0][0]*W, SPUR[0][1]*H);
    for (let i = 1; i < SPUR.length; i++) g.lineTo(SPUR[i][0]*W, SPUR[i][1]*H);
    g.stroke();
    g.restore();
  }

  /* ---- THE GROVE: the water-loving poplars standing behind the spring ----
     Drawn BEFORE the water so the basin sits in front of them: the trees are
     the far wall of the little hollow the spring is sunk into. */
  if (has("grove")){
    const spread = [
      [0.104, 0.734, 0.124, 0.024], [0.148, 0.724, 0.152, 0.028],
      [0.196, 0.718, 0.136, 0.025], [0.244, 0.724, 0.110, 0.021],
      [0.288, 0.732, 0.088, 0.018],
    ];
    for (let i = 0; i < Math.min(params.poplars, spread.length); i++){
      const [x, base, h, w] = spread[i];
      poplar(pen, g, W*x, H*base, H*h, W*w, toneSolid(inkLevel(T.dark - 1 - (i%2))));
    }
  }

  /* ---- THE SPRING: rock face, carved spout, stone basin, worn steps ---- */
  if (has("spring")){
    const sx = SPRING.x*W, sy = SPRING.y*H;
    const px = SPOUT.x*W,  py = SPOUT.y*H;
    // the built rock face the water comes out of — light dressed courses, stepped
    pen.paint(() => {
      g.moveTo(px - W*0.076, py + H*0.050);
      g.lineTo(px - W*0.082, py - H*0.022);
      g.lineTo(px - W*0.024, py - H*0.038);
      g.lineTo(px + W*0.034, py - H*0.024);
      g.lineTo(px + W*0.038, py + H*0.038);
      g.closePath();
    }, toneSolid(inkLevel(T.field)), 3.5);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.42;
    for (const yy of [-0.010, 0.016]){
      g.beginPath();
      g.moveTo(px - W*0.078, py + H*yy); g.lineTo(px + W*0.036, py + H*yy); g.stroke();
    }
    for (const xx of [-0.050, -0.014, 0.014]){
      g.beginPath();
      g.moveTo(px + W*xx, py - H*0.032); g.lineTo(px + W*xx, py + H*0.040); g.stroke();
    }
    g.restore();
    // THE MOUTH — a dark carved socket, and the fall of water out of it
    pen.paint(() => { g.rect(px + W*0.014, py - H*0.008, W*0.026, H*0.020); },
              toneSolid(inkLevel(7)), 2.5);
    pen.paint(() => {
      g.moveTo(px + W*0.036, py + H*0.008);
      g.lineTo(px + W*0.050, py + H*0.010);
      g.lineTo(px + W*0.064, sy - H*0.012);
      g.lineTo(px + W*0.046, sy - H*0.012);
      g.closePath();
    }, toneSolid(inkLevel(T.water)), 2.5);
    // THE BASIN — stone lip, still light water, set blocks round the rim
    pen.paint(() => { g.ellipse(sx, sy, W*0.098, H*0.030, 0, 0, 7); },
              toneSolid(inkLevel(T.stone + 1)), 4);
    pen.paint(() => { g.ellipse(sx, sy - H*0.003, W*0.074, H*0.021, 0, 0, 7); },
              toneSolid(inkLevel(T.water)), 3);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.42; g.lineCap = "round";
    for (let i = 1; i <= 2; i++){
      g.beginPath();
      g.ellipse(sx - W*0.014, sy - H*0.003, W*0.026*i, H*0.008*i, 0, Math.PI*0.12, Math.PI*0.88);
      g.stroke();
    }
    g.restore();
    g.fillStyle = inkLevel(T.stone + 1);
    for (let i = 0; i < 7; i++){
      const a = Math.PI*(0.08 + i*0.145);
      g.fillRect(sx + Math.cos(a)*W*0.100 - W*0.007, sy + Math.sin(a)*H*0.031 - H*0.004,
                 W*0.014, H*0.008);
    }
    // the worn steps down off the road, in treads (never one ramp bar)
    for (let i = 0; i < 4; i++)
      pen.paint(() => { g.rect(sx + W*0.062 + i*W*0.024, sy + H*0.008 - i*H*0.010,
                               W*0.024, H*0.010); },
                toneSolid(inkLevel(T.stone)), 2);
    // the overflow runnel leaving the basin toward the low ground
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.46;
    g.beginPath();
    g.moveTo(sx - W*0.070, sy + H*0.022);
    g.quadraticCurveTo(sx - W*0.130, sy + H*0.062, sx - W*0.150, sy + H*0.122);
    g.stroke(); g.restore();
  }

  /* ---- THE ALTAR OF THE NYMPHS, standing above the water ---- */
  if (has("altar")){
    const ax = ALTAR.x*W, ay = ALTAR.y*H;
    pen.paint(() => { g.rect(ax - W*0.044, ay + H*0.016, W*0.088, H*0.011); },
              toneSolid(inkLevel(T.stone)), 2.5);                       // plinth
    pen.paint(() => { g.rect(ax - W*0.034, ay - H*0.024, W*0.068, H*0.040); },
              toneSolid(inkLevel(T.build + 1)), 3);                     // block
    pen.paint(() => { g.rect(ax - W*0.042, ay - H*0.034, W*0.084, H*0.011); },
              toneSolid(inkLevel(T.stone + 1)), 2.5);                   // capping slab
    // two horn stones — the shape that says altar without any lettering
    for (const s of [-1, 1])
      pen.paint(() => {
        g.moveTo(ax + s*W*0.040, ay - H*0.034);
        g.lineTo(ax + s*W*0.030, ay - H*0.056);
        g.lineTo(ax + s*W*0.016, ay - H*0.034);
        g.closePath();
      }, toneSolid(inkLevel(T.dark)), 2.5);
    // the offering left on it, and the smoke thread — why the set reads as used
    pen.paint(() => { g.ellipse(ax, ay - H*0.038, W*0.014, H*0.006, 0, 0, 7); },
              toneSolid(inkLevel(T.dark)), 2);
    g.save(); g.strokeStyle = inkLevel(T.field + 1); g.lineWidth = W*0.013;
    g.lineCap = "round"; g.globalAlpha = 0.66;
    g.beginPath();
    g.moveTo(ax, ay - H*0.046);
    g.quadraticCurveTo(ax + W*0.048, ay - H*0.116, ax - W*0.010, ay - H*0.196);
    g.stroke(); g.restore();
  }

  /* ---- WAYMARKS: two roadside herms measuring the walk into town, set on
     opposite shoulders so they never line up into a rail ---- */
  if (has("waymarks")){
    for (const [t, side] of [[0.12, 1.42], [0.64, -1.42]]){
      const m = off(t, side), s = depthAt(t);
      const mx = m.x, my = m.y;
      pen.paint(() => { g.rect(mx - W*0.015*s, my - H*0.060*s, W*0.030*s, H*0.060*s); },
                toneSolid(inkLevel(T.stone + 1)), 3);
      pen.paint(() => { g.ellipse(mx, my - H*0.060*s, W*0.018*s, H*0.014*s, 0, 0, 7); },
                toneSolid(inkLevel(T.dark)), 2.5);
      pen.paint(() => { g.ellipse(mx, my, W*0.028*s, H*0.008*s, 0, 0, 7); },
                toneSolid(inkLevel(T.field)), 2);
    }
  }

  /* ---- VERGE: the near field walls flanking the road, in perspective ---- */
  if (has("verge")){
    const runWall = (xNear, u1, th0) => {
      const a = FP(xNear, 0.0), b = FP(xNear, u1);
      pen.paint(() => {
        g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
        g.lineTo(b.x, b.y + th0*0.22); g.lineTo(a.x, a.y + th0);
        g.closePath();
      }, toneSolid(inkLevel(T.field)), 3);
      g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.36;
      for (let i = 1; i < 11; i++){
        const k = i/11, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
        const th = lerp(th0, th0*0.22, k);
        g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + th); g.stroke();
      }
      g.restore();
    };
    runWall(-0.10, 0.54, H*0.024);
    runWall( 1.10, 0.50, H*0.022);
  }

  /* ---- FOREGROUND OCCLUSION: what a figure walks out from behind.
     Only ONE dark olive, and it stands on the right — the spring already gives
     the left side all the weight that corner can carry. ---- */
  if (has("fg")){
    oliveTree(pen, g, W*0.966, H*1.048, H*0.176, W*0.096, toneSolid(inkLevel(T.dark - 2)));
    // a low broken outcrop bottom-left instead of a second tree
    pen.paint(() => {
      g.moveTo(W*0.010, H*1.020); g.lineTo(W*0.016, H*0.966);
      g.lineTo(W*0.062, H*0.952); g.lineTo(W*0.104, H*0.972);
      g.lineTo(W*0.098, H*1.020); g.closePath();
    }, toneSolid(inkLevel(T.stone)), 3);
    g.fillStyle = inkLevel(T.field);
    for (let i = 0; i < 4; i++){
      const x = W*(0.245 + i*0.155), y = H*(1.014 - 0.004*(i%3));
      g.beginPath(); g.ellipse(x, y, W*0.023, H*0.010, 0, 0, 7); g.fill();
    }
  }
}

export const asset = {
  id:"location.ithaca-town-road-and-fountain",
  type:"LOCATION",
  name:"Ithaca Town Road and Fountain",
  statusWord:"THE NARROWS",
  scene:"OD-B17-S02",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","hills","ground","terraces","scrub","city","palace","sightline","road",
          "narrows","fold","spur","grove","spring","altar","waymarks","verge","fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky","hills","terraces","scrub","city","palace","sightline","grove"],
              ground:["ground","road","fold","spur","spring","waymarks"],
              front:["narrows","altar","verge","fg"] },
  // normalized 0..1 placement / camera anchors — seated on the road cubic
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.03,y0:.39,x1:.97,y1:.99 },
    road:{ x0:.36,y0:.39,x1:.86,y1:.99 },
    "road-near":{ x0:.44,y0:.86,x1:.86,y1:.99 },
    "road-mid":{ x0:.42,y0:.66,x1:.62,y1:.88 },
    "road-far":{ x0:.50,y0:.40,x1:.68,y1:.66 },
    // the pinch — the only way through, and too narrow for two parties
    throat:{ x0:.47,y0:.71,x1:.57,y1:.80 },
    spring:{ x0:.13,y0:.72,x1:.42,y1:.86 },
    grove:{ x0:.08,y0:.58,x1:.38,y1:.78 },
    altar:{ x0:.10,y0:.65,x1:.20,y1:.74 },
    "herd-ground":{ x0:.62,y0:.57,x1:.82,y1:.68 },
    "city-approach":{ x0:.52,y0:.39,x1:.68,y1:.50 },
    threshold_gate:{ x0:.56,y0:.37,x1:.61,y1:.42 },
    threshold_stair:{ x0:.39,y0:.37,x1:.43,y1:.41 },
    ridge:{ x0:.60,y0:.28,x1:.88,y1:.37 },
  },
  states:{
    initial:"day",
    nodes:{
      day:{ preview:{ state:"day" } },
      // the encounter: throat called out, palace sightline struck, herd on the verge
      meeting:{ preview:{ state:"meeting", struck:true } },
      dusk:{ preview:{ state:"dusk" } },
      // the bare walking set: the road, the two ends, nothing to stop for
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["day","meeting"],["meeting","day"],["day","dusk"],["dusk","day"],
           ["day","bare"],["bare","day"]],
  },
  channels:["state","reveal","camera","light","water","traffic"],

  preview:()=>({ state:"day", t:0, status:"THE NARROWS", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
