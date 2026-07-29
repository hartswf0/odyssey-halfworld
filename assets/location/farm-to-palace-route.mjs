/* location.farm-to-palace-route — the road down from Eumaeus's steading to the
   town of Ithaca and the palace gate. LOCATION asset (empty navigable set —
   NO baked figures). Solid grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone.

   THE SHAPE OF BOOK XVI. Telemachus walks this road down at dawn; the disguised
   Odysseus walks it after him. So the set holds BOTH ends of the journey in one
   frame: the STEADING is behind and above on the left ridge — small, with its
   smoke thread — while the TOWN and the PALACE stand across the middle distance,
   small enough to be far and detailed enough to be read. The road itself runs
   from the near bottom edge, wide enough there for a figure at full height, back
   through six depth stations to the town gate.

   DEPTH IS THE POINT. Every roadside anchor is taken from the SAME cubic the
   road surface is drawn from (roadPtN), so a figure placed at `road:mid` stands
   on the road that is drawn, at the size the road is drawn at. The exposed feet
   lines run y = .98 / .91 / .82 / .68 / .53 / .44 — the full near-to-far ladder
   the walking scenes need, with the far end still short of the town wall.

   NOTHING SPANS THE FRAME. Every field boundary is broken and every wall is cut
   at the road, because a set of full-width horizontal bars stops being a country
   and becomes a barcode. The fields are perspective quads laid on the same
   vanishing point as the hedges, so the ground recedes instead of striping.

   THE SIDE DOOR is plot. A spur leaves the main road short of the town gate,
   runs outside the wall to a postern, and climbs to a marked doorway in the left
   flank of the palace: the household's door. The great gate in the middle of the
   colonnade is the suitors' door. They are different anchors and always will be.

   SUITOR OBSERVATION POINTS are two low watch cairns on knolls that command the
   road, each with a surveyed sightline struck down onto a mark on the road —
   cold by day, lit in the "watched" state. The ambush laid in Book XVI is a fact
   about this road, so the road carries it.

   States: "day", "watched" (the posts manned and the sightlines struck in),
   "dusk" (light gone down, gate lamp burning), "bare" (the walking set only).

   Serves OD-B16-S02 and returns in Books XVII, XX and XXIV.
   Atlas: OD-B16-S02 — long rural path with town entry, palace side door, and
   possible suitor observation points. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const MODES = ["day", "watched", "dusk", "bare"];

const params = {
  horizon:0.360,     // sky / ground split as a fraction of H
  wallY:0.392,       // foot of the town wall
  gateX:0.545,       // the town gate straddles the road here
  posternX:0.742,    // small door through the town wall onto the palace spur
  farmX:0.132,       // the steading on the left ridge crest
  farmY:0.300,
  hedges:8,          // field divisions converging on the town
  watchLit:false,    // sightlines from the observation knolls
};

/* ---------- THE ROAD ----------
   One cubic, drawn once and read everywhere. t = 0 at the near bottom edge,
   t = 1 at the town gate. All roadside furniture and every anchor is seated on
   it, so the drawing and the blocking cannot disagree. */
const R0 = { x:0.240, y:1.030 };
const R1 = { x:0.880, y:0.845 };
const R2 = { x:0.230, y:0.585 };
const R3 = { x:0.545, y:0.398 };

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
/* half-width of the carriageway, and the depth scale of anything standing on it */
const roadHW = t => lerp(0.090, 0.004, Math.pow(t, 0.76));
const depthAt = t => lerp(1.00, 0.09, Math.pow(t, 0.80));

/* ---------- THE PALACE SPUR ----------
   leaves the main road short of the gate, runs outside the wall to the postern,
   and climbs to the side door in the palace's left flank. */
const SPUR = [ [0.470,0.516], [0.580,0.488], [0.676,0.446], [0.742,0.412] ];
const SIDE_DOOR = { x:0.610, y:0.358 };

/* ---------- observation knolls ---------- */
const WATCH = [
  { x:0.108, y:0.520, look:0.34, w:0.068 },   // over the road's left shoulder
  { x:0.886, y:0.596, look:0.14, w:0.080 },   // the olive knoll on the right
];

/* ---------- anchors: taken from the road, never hand-tuned ---------- */
const rd = t => { const p = roadPtN(t); return { x:+p.x.toFixed(3), y:+p.y.toFixed(3) }; };
export const anchors = {
  "entrance:farm":     { x:0.150, y:0.336 },   // walk-on from the steading path
  "farm:steading":     { x:params.farmX, y:params.farmY },
  "path:hill":         { x:0.062, y:0.520 },   // the farm path joining the road
  "road:near":         rd(0.08),               // y ~ .98 — a figure at full height
  "road:lower":        rd(0.20),               // y ~ .91
  "road:mid":          rd(0.35),               // y ~ .82
  "road:halt":         rd(0.55),               // y ~ .68 — the spring and poplars
  "road:upper":        rd(0.72),               // y ~ .57
  "road:far":          rd(0.86),               // y ~ .48
  "road:gate-approach":rd(0.94),               // y ~ .43
  "grove:poplars":     { x:0.296, y:0.662 },
  "spring:basin":      { x:0.338, y:0.690 },
  "waymark:lower":     { x:0.552, y:0.892 },
  "waymark:upper":     { x:0.430, y:0.630 },
  "watch:left":        { x:WATCH[0].x, y:WATCH[0].y },
  "watch:right":       { x:WATCH[1].x, y:WATCH[1].y },
  "threshold:town-gate": { x:params.gateX, y:0.402 },
  "gate:town":         { x:params.gateX, y:0.398 },
  "spur:branch":       { x:SPUR[0][0], y:SPUR[0][1] },
  "threshold:postern": { x:params.posternX, y:0.396 },
  "palace:side-door":  SIDE_DOOR,
  "palace:great-gate": { x:0.690, y:0.356 },
  "exit:palace":       SIDE_DOOR,
  "exit:town":         { x:params.gateX, y:0.398 },
  "camera:wide":       { x:0.500, y:0.520 },
  "camera:road":       { x:0.500, y:0.740 },
  "camera:gate":       { x:0.545, y:0.430 },
  "camera:palace":     { x:0.680, y:0.368 },
};

/* ---------- small stamps ---------- */
function poplar(pen, g, x, base, h, w, tone){
  pen.paint(() => {
    g.moveTo(x, base);
    g.lineTo(x - w*0.50, base - h*0.34);
    g.lineTo(x - w*0.30, base - h*0.72);
    g.lineTo(x, base - h);
    g.lineTo(x + w*0.30, base - h*0.72);
    g.lineTo(x + w*0.50, base - h*0.34);
    g.closePath();
  }, tone, 3);
  pen.ink(() => { g.moveTo(x, base); g.lineTo(x, base - h*0.22); }, 2.5);
}
function oliveTree(pen, g, x, base, h, w, tone){
  pen.paint(() => {
    g.moveTo(x - w*0.10, base);
    g.lineTo(x - w*0.14, base - h*0.44);
    g.lineTo(x + w*0.12, base - h*0.46);
    g.lineTo(x + w*0.09, base);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  for (const [ox, oy, r] of [[-0.30,-0.58,0.40],[0.28,-0.64,0.36],[0,-0.84,0.34]])
    pen.paint(() => { g.ellipse(x + w*ox, base + h*oy, w*r, h*r*0.66, 0, 0, 7); }, tone, 3.5);
}
/* a small olive/scrub bush stamped at a depth scale — the mid-ground's texture */
function bush(pen, g, x, base, s, tone){
  pen.paint(() => { g.ellipse(x, base - s*0.60, s*0.68, s*0.48, 0, 0, 7); }, tone, 2.5);
  pen.ink(() => { g.moveTo(x, base); g.lineTo(x, base - s*0.52); }, 2);
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
  const watched = (st.watchLit ?? params.watchLit) || mode === "watched";
  const layers = st.layers || (mode === "bare"
    ? ["sky","hills","farm","ground","fields","town","palace","road","verge"]
    : ["sky","hills","farm","ground","fields","groves","town","palace","road",
       "spur","halt","watch","waymarks","verge","fg"]);
  const has = l => layers.includes(l);

  const T = {                    // tone table — the whole set lights from here
    sky:   dusk ? 3 : 1,
    far:   dusk ? 3 : 2,
    ridge: dusk ? 4 : 3,
    ground:dusk ? 3 : 2,
    field: dusk ? 4 : 3,
    stone: dusk ? 5 : 4,
    build: dusk ? 4 : 3,
    dark:  dusk ? 7 : 6,
    road:  dusk ? 2 : 1,
  };

  const hz = params.horizon * H;
  const P  = t => { const p = roadPtN(t); return { x:p.x*W, y:p.y*H }; };
  const TN = t => roadTanN(t);
  const HW = t => roadHW(t) * W;
  const VP = { x: params.gateX*W, y: hz };     // the fields converge on the town
  const NEAR = H*1.04;
  /* a point in field space: x at the near edge, u = how far it has receded */
  const FP = (x, u) => ({ x: lerp(x*W, VP.x, u), y: lerp(NEAR, VP.y, u) });

  /* ---- SKY ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, hz);
    g.fillStyle = inkLevel(T.sky + 1);
    for (let i = 0; i < 3; i++){
      g.beginPath();
      g.ellipse(W*(0.22 + i*0.29), hz*(0.28 + 0.20*(i%2)), W*0.125, H*0.013, 0, 0, 7);
      g.fill();
    }
    if (dusk){ g.fillStyle = inkLevel(1); g.fillRect(0, hz - H*0.024, W, H*0.024); }
  }

  /* ---- HILLS: far range behind the town, then the steading's own ridge ---- */
  if (has("hills")){
    pen.paint(() => {
      g.moveTo(W*0.16, hz);
      g.quadraticCurveTo(W*0.40, hz - H*0.078, W*0.60, hz - H*0.034);
      g.quadraticCurveTo(W*0.80, hz - H*0.090, W*1.00, hz - H*0.038);
      g.lineTo(W, hz); g.closePath();
    }, toneSolid(inkLevel(T.far)), 4);
    pen.paint(() => {
      g.moveTo(0, hz - H*0.046);
      g.quadraticCurveTo(W*0.12, hz - H*0.082, W*0.23, hz - H*0.036);
      g.quadraticCurveTo(W*0.33, hz - H*0.006, W*0.41, hz);
      g.lineTo(0, hz); g.closePath();
    }, toneSolid(inkLevel(T.ridge)), 4);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.30;
    for (const u of [0.26, 0.46, 0.64]){
      g.beginPath();
      g.moveTo(W*u*0.38, hz - H*0.056 + H*0.020*u);
      g.lineTo(W*u*0.38 + W*0.024, hz);
      g.stroke();
    }
    g.restore();
  }

  /* ---- THE STEADING on the crest: where the walk began ---- */
  if (has("farm")){
    const fx = params.farmX * W, fy = params.farmY * H;
    const s = W * 0.044;
    for (let i = 0; i < 9; i++){
      const px = fx - s*1.05 + i * s*0.26;
      pen.paint(() => { g.rect(px, fy - s*0.22 - (i%2)*s*0.04, s*0.080, s*0.24); },
                toneSolid(inkLevel(T.stone)), 2);
    }
    pen.paint(() => { g.rect(fx - s*0.42, fy - s*0.54, s*0.84, s*0.54); },
              toneSolid(inkLevel(T.build + 1)), 3);
    pen.paint(() => {
      g.moveTo(fx - s*0.58, fy - s*0.54);
      g.lineTo(fx, fy - s*0.98);
      g.lineTo(fx + s*0.58, fy - s*0.54);
      g.closePath();
    }, toneSolid(inkLevel(T.dark - 1)), 3);
    pen.paint(() => { g.rect(fx - s*0.12, fy - s*0.27, s*0.24, s*0.27); },
              toneSolid(inkLevel(7)), 2);
    // its smoke — the one soft thing in the set, and why it reads as lived in
    g.save(); g.strokeStyle = inkLevel(T.field); g.lineWidth = W*0.013;
    g.lineCap = "round"; g.globalAlpha = 0.62;
    g.beginPath();
    g.moveTo(fx, fy - s*1.02);
    g.quadraticCurveTo(fx + s*0.70, fy - s*2.1, fx + s*0.12, fy - s*3.1);
    g.stroke(); g.restore();
    // the path off the steading, dropping down the ridge to meet the road
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.42;
    g.setLineDash([W*0.014, W*0.012]);
    g.beginPath();
    g.moveTo(fx - s*0.30, fy + s*0.10);
    g.quadraticCurveTo(W*0.040, H*0.430, W*0.062, H*0.520);
    g.quadraticCurveTo(W*0.112, H*0.740, W*0.238, H*0.960);
    g.stroke(); g.setLineDash([]); g.restore();
  }

  /* ---- GROUND ---- */
  if (has("ground")){
    g.fillStyle = inkLevel(T.ground); g.fillRect(0, hz, W, H - hz);
  }

  /* ---- FIELDS: perspective plots, broken boundary walls, converging hedges ---
     Nothing here runs the full width. The ground recedes; it does not stripe. */
  if (has("fields")){
    /* plots are TONE, not boxes: filled with no contour, so the ground reads as
       a patchwork of fields rather than a stack of outlined rectangles */
    const quad = (xa, xb, u0, u1, level) => {
      const a = FP(xa, u0), b = FP(xb, u0), c = FP(xb, u1), d = FP(xa, u1);
      g.beginPath();
      g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
    };
    const PLOTS = [
      [-0.42, 0.02, 0.06, 0.30], [-0.16, 0.14, 0.38, 0.56], [0.00, 0.22, 0.62, 0.76],
      [ 0.92, 1.52, 0.04, 0.26], [ 0.84, 1.30, 0.34, 0.54], [0.78, 1.14, 0.60, 0.75],
      [ 0.10, 0.34, 0.82, 0.90], [ 0.74, 1.02, 0.81, 0.90],
    ];
    PLOTS.forEach(p => quad(p[0], p[1], p[2], p[3], T.field));
    // stubble ticks inside the plots — texture, not tone
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.16;
    for (const p of PLOTS){
      for (let r = 0; r < 4; r++){
        const u = lerp(p[2], p[3], (r + 0.5)/4);
        const sc = lerp(0.024, 0.004, u);
        for (let k = 0; k < 8; k++){
          const q = FP(lerp(p[0], p[1], (k + 0.5)/8), u);
          if (q.x < -W*0.05 || q.x > W*1.05) continue;
          g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - H*sc); g.stroke();
        }
      }
    }
    g.restore();
    // hedge lines running away to the town, cut short of the horizon
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = 0.24;
    for (let i = 0; i < params.hedges; i++){
      const x = -0.30 + i * (1.60 / (params.hedges - 1));
      const a = FP(x, 0.02), b = FP(x, 0.88);
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    }
    g.restore();
    // broken dry-stone boundaries at two depths — thin courses, cut at the road
    for (const u of [0.34, 0.62]){
      const th = H * lerp(0.015, 0.004, u);
      for (const [xa, xb] of [[-0.36,0.04],[0.66,0.90],[1.00,1.40]]){
        const a = FP(xa, u), b = FP(xb, u);
        if (b.x < -W*0.06 || a.x > W*1.06) continue;
        pen.paint(() => {
          g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
          g.lineTo(b.x, b.y + th); g.lineTo(a.x, a.y + th); g.closePath();
        }, toneSolid(inkLevel(T.field)), 2.5);
        g.save(); g.strokeStyle = INK; g.lineWidth = 1.6; g.globalAlpha = 0.34;
        for (let i = 1; i < 7; i++){
          const k = i/7, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
          g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + th); g.stroke();
        }
        g.restore();
      }
    }
  }

  /* ---- GROVES: olive rows on both flanks, stamped at a depth scale ---- */
  if (has("groves")){
    for (let r = 0; r < 4; r++){
      const u = 0.16 + r*0.19;
      const s = W * lerp(0.044, 0.011, u);
      for (let k = 0; k < 3; k++){
        const q = FP(-0.16 + k*0.11, u);
        if (q.x < -W*0.02) continue;
        bush(pen, g, q.x, q.y, s, toneSolid(inkLevel(T.field)));
      }
      for (let k = 0; k < 3; k++){
        const q = FP(0.96 + k*0.12, u);
        if (q.x > W*1.02) continue;
        bush(pen, g, q.x, q.y, s, toneSolid(inkLevel(T.field)));
      }
    }
  }

  /* ---- THE TOWN: wall, gate, postern, stepped houses behind ---- */
  if (has("town")){
    const wy = params.wallY * H, wh = H * 0.020;
    const seeds = [0.404,0.436,0.468,0.500,0.582,0.614,0.812,0.844,0.876];
    for (let i = 0; i < seeds.length; i++){
      const hx = seeds[i] * W;
      const hw = W * (0.024 + 0.009*((i*5)%3));
      const hh = H * (0.022 + 0.010*((i*7)%3));
      houseBlock(pen, g, hx, wy - H*0.002, hw, hh,
                 toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.stone + (i%2))));
    }
    const gL = (params.gateX - 0.017)*W, gR = (params.gateX + 0.017)*W;
    const pL = (params.posternX - 0.007)*W, pR = (params.posternX + 0.007)*W;
    const seg = (x0, x1) => pen.paint(() => { g.rect(x0, wy - wh, x1 - x0, wh); },
                                      toneSolid(inkLevel(T.build)), 3);
    seg(W*0.382, gL); seg(gR, pL); seg(pR, W*0.916);
    for (let i = 0; i < 24; i++){
      const cx = W*0.386 + i * W*0.0224;
      if (cx > gL - W*0.005 && cx < gR + W*0.005) continue;
      if (cx > pL - W*0.005 && cx < pR + W*0.005) continue;
      if (cx > W*0.908) continue;
      pen.paint(() => { g.rect(cx, wy - wh - H*0.006, W*0.009, H*0.006); },
                toneSolid(inkLevel(T.stone)), 1.5);
    }
    // THE TOWN GATE: two piers, a lintel, a dark arch
    const jw = W*0.011;
    for (const bx of [gL - jw, gR])
      pen.paint(() => { g.rect(bx, wy - wh*1.38, jw, wh*1.38); }, toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.rect(gL - jw*1.4, wy - wh*1.58, (gR-gL) + jw*2.8, wh*0.36); },
              toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.rect(gL, wy - wh*1.14, gR - gL, wh*1.14); },
              toneSolid(inkLevel(dusk ? 5 : 7)), 2.5);
    if (dusk){
      g.save(); g.fillStyle = "#ffffff";
      g.beginPath(); g.ellipse((gL+gR)/2, wy - wh*0.74, (gR-gL)*0.26, wh*0.30, 0, 0, 7);
      g.fill(); g.restore();
    }
    // THE POSTERN — the small door the spur runs to
    pen.paint(() => { g.rect(pL, wy - wh*0.96, pR - pL, wh*0.96); },
              toneSolid(inkLevel(7)), 2.5);
    pen.paint(() => { g.rect(pL - W*0.004, wy - wh*1.12, (pR-pL) + W*0.008, wh*0.18); },
              toneSolid(inkLevel(T.dark)), 2);
  }

  /* ---- THE PALACE, standing above the town: far, but readable ---- */
  if (has("palace")){
    const px0 = 0.600*W, px1 = 0.784*W, base = 0.362*H;
    const bw = px1 - px0, bh = H*0.032;
    pen.paint(() => { g.rect(px0 - W*0.013, base, bw + W*0.026, H*0.009); },
              toneSolid(inkLevel(T.stone)), 2.5);                    // terrace
    pen.paint(() => { g.rect(px0, base - bh, bw, bh); }, toneSolid(inkLevel(T.build)), 3);
    const nCol = 6;
    for (let i = 0; i < nCol; i++){
      const cx = px0 + bw*(0.10 + 0.80*i/(nCol-1));
      pen.paint(() => { g.rect(cx - W*0.005, base - bh*0.76, W*0.010, bh*0.76); },
                toneSolid(inkLevel(T.dark)), 2);
    }
    pen.paint(() => { g.rect(px0 - W*0.009, base - bh - H*0.008, bw + W*0.018, H*0.009); },
              toneSolid(inkLevel(T.stone + 1)), 2.5);                // architrave
    pen.paint(() => {
      g.moveTo(px0 - W*0.016, base - bh - H*0.008);
      g.lineTo((px0 + px1)/2, base - bh - H*0.040);
      g.lineTo(px1 + W*0.016, base - bh - H*0.008);
      g.closePath();
    }, toneSolid(inkLevel(T.build + 2)), 3);                          // roof
    // THE GREAT GATE — the suitors' door, centre of the colonnade
    pen.paint(() => { g.rect((px0+px1)/2 - W*0.012, base - bh*0.70, W*0.024, bh*0.70); },
              toneSolid(inkLevel(7)), 2.5);
    for (let i = 0; i < 2; i++)
      pen.paint(() => { g.rect((px0+px1)/2 - W*0.022 - i*W*0.006, base + i*H*0.0035,
                               W*0.044 + i*W*0.012, H*0.0035); },
                toneSolid(inkLevel(T.stone)), 1.5);
    // THE SIDE DOOR in the left flank — the household's door, and the plot's
    const sdx = SIDE_DOOR.x*W, sdy = SIDE_DOOR.y*H;
    pen.paint(() => { g.rect(sdx - W*0.009, sdy - H*0.022, W*0.018, H*0.022); },
              toneSolid(inkLevel(7)), 2.5);
    pen.paint(() => { g.rect(sdx - W*0.015, sdy - H*0.027, W*0.030, H*0.006); },
              toneSolid(inkLevel(T.dark)), 2);                        // lintel
    pen.paint(() => { g.ellipse(sdx, sdy + H*0.003, W*0.019, H*0.004, 0, 0, 7); },
              toneSolid(inkLevel(T.stone)), 2);                       // threshold slab
  }

  /* ---- THE ROAD ---- */
  if (has("road")){
    const N = 48;
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
    // ruts down the middle, thinning with distance
    g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.32;
    for (const off of [-0.36, 0.36]){
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
      const t = 0.03 + i*0.058, p = P(t), v = TN(t), hw = HW(t)*(i%2 ? 1.24 : -1.30);
      const r = W*0.009*depthAt(t);
      g.beginPath(); g.ellipse(p.x - v.y*hw, p.y + v.x*hw, r, r*0.60, 0, 0, 7); g.fill();
    }
  }

  /* ---- THE SPUR to the postern and the palace side door ---- */
  if (has("spur")){
    g.save();
    g.strokeStyle = INK; g.lineWidth = W*0.016; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(SPUR[0][0]*W, SPUR[0][1]*H);
    for (let i = 1; i < SPUR.length; i++) g.lineTo(SPUR[i][0]*W, SPUR[i][1]*H);
    g.stroke();
    g.strokeStyle = inkLevel(T.road); g.lineWidth = W*0.008;
    g.beginPath(); g.moveTo(SPUR[0][0]*W, SPUR[0][1]*H);
    for (let i = 1; i < SPUR.length; i++) g.lineTo(SPUR[i][0]*W, SPUR[i][1]*H);
    g.stroke();
    g.restore();
    // inside the wall the way to the side door is surveyed, not surfaced
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.62;
    g.setLineDash([W*0.011, W*0.009]);
    g.beginPath();
    g.moveTo(params.posternX*W, 0.386*H);
    g.quadraticCurveTo(W*0.686, H*0.372, SIDE_DOOR.x*W + W*0.012, SIDE_DOOR.y*H);
    g.stroke(); g.setLineDash([]); g.restore();
  }

  /* ---- THE HALT: spring basin and poplars at the road's shoulder ---- */
  if (has("halt")){
    const bx = 0.338*W, by = 0.690*H;
    pen.paint(() => { g.ellipse(bx, by, W*0.040, H*0.013, 0, 0, 7); },
              toneSolid(inkLevel(T.stone)), 3.5);
    pen.paint(() => { g.ellipse(bx, by - H*0.003, W*0.026, H*0.007, 0, 0, 7); },
              toneSolid(inkLevel(T.road)), 2.5);
    for (let i = 0; i < 7; i++){
      const a = Math.PI*(0.08 + i*0.14);
      pen.paint(() => { g.ellipse(bx + Math.cos(a)*W*0.042, by + Math.sin(a)*H*0.014,
                                  W*0.010, H*0.004, 0, 0, 7); },
                toneSolid(inkLevel(T.stone + 1)), 1.8);
    }
    poplar(pen, g, W*0.258, H*0.676, H*0.130, W*0.031, toneSolid(inkLevel(T.dark - 1)));
    poplar(pen, g, W*0.296, H*0.668, H*0.110, W*0.026, toneSolid(inkLevel(T.dark - 2)));
    poplar(pen, g, W*0.330, H*0.672, H*0.090, W*0.022, toneSolid(inkLevel(T.dark - 1)));
  }

  /* ---- OBSERVATION POINTS: the knolls that command the road ---- */
  if (has("watch")){
    for (const w of WATCH){
      const kx = w.x*W, ky = w.y*H, kw = w.w*W;
      pen.paint(() => {
        g.moveTo(kx - kw, ky);
        g.quadraticCurveTo(kx - kw*0.40, ky - kw*0.52, kx, ky - kw*0.46);
        g.quadraticCurveTo(kx + kw*0.50, ky - kw*0.40, kx + kw, ky);
        g.closePath();
      }, toneSolid(inkLevel(T.field)), 3.5);
      // a low breastwork on top, with the gap they look through
      const cw = kw*0.64, cy = ky - kw*0.44;
      pen.paint(() => { g.rect(kx - cw*0.56, cy - kw*0.20, cw*0.42, kw*0.22); },
                toneSolid(inkLevel(T.stone + 1)), 2.5);
      pen.paint(() => { g.rect(kx + cw*0.14, cy - kw*0.20, cw*0.42, kw*0.22); },
                toneSolid(inkLevel(T.stone + 1)), 2.5);
      // the sightline down onto the road
      const tgt = P(w.look);
      g.save(); g.strokeStyle = INK; g.lineWidth = watched ? 3.5 : 2.5;
      g.globalAlpha = watched ? 0.75 : 0.24;
      g.setLineDash([W*0.015, W*0.012]);
      g.beginPath(); g.moveTo(kx, cy - kw*0.08); g.lineTo(tgt.x, tgt.y); g.stroke();
      g.setLineDash([]);
      if (watched){
        g.lineWidth = 4; g.globalAlpha = 0.90;
        g.beginPath(); g.arc(tgt.x, tgt.y, Math.max(W*0.016, W*0.028*depthAt(w.look)), 0, 7);
        g.stroke();
      }
      g.restore();
    }
  }

  /* ---- WAYMARKS: two roadside herms measuring the walk ---- */
  if (has("waymarks")){
    for (const t of [0.14, 0.62]){
      const p = P(t), v = TN(t), hw = HW(t)*1.28, s = depthAt(t);
      const mx = p.x + v.y*hw, my = p.y - v.x*hw;
      pen.paint(() => { g.rect(mx - W*0.015*s, my - H*0.062*s, W*0.030*s, H*0.062*s); },
                toneSolid(inkLevel(T.stone + 1)), 3);
      pen.paint(() => { g.ellipse(mx, my - H*0.062*s, W*0.018*s, H*0.014*s, 0, 0, 7); },
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
      g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.38;
      for (let i = 1; i < 11; i++){
        const k = i/11, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
        const th = lerp(th0, th0*0.22, k);
        g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + th); g.stroke();
      }
      g.restore();
    };
    runWall(-0.08, 0.58, H*0.026);
    runWall( 1.08, 0.54, H*0.024);
  }

  /* ---- FOREGROUND OCCLUSION: the olives a figure passes behind ---- */
  if (has("fg")){
    oliveTree(pen, g, W*0.982, H*1.020, H*0.215, W*0.115, toneSolid(inkLevel(T.dark - 1)));
    oliveTree(pen, g, W*0.020, H*1.040, H*0.160, W*0.088, toneSolid(inkLevel(T.dark - 2)));
    g.fillStyle = inkLevel(T.field);
    for (let i = 0; i < 4; i++){
      const x = W*(0.255 + i*0.150), y = H*(1.012 - 0.004*(i%3));
      g.beginPath(); g.ellipse(x, y, W*0.024, H*0.011, 0, 0, 7); g.fill();
    }
  }
}

export const asset = {
  id:"location.farm-to-palace-route",
  type:"LOCATION",
  name:"Farm-to-Palace Route",
  statusWord:"THE ROAD",
  scene:"OD-B16-S02",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","hills","farm","ground","fields","groves","town","palace","road",
          "spur","halt","watch","waymarks","verge","fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky","hills","farm","fields","groves","town","palace"],
              ground:["ground","road","spur","halt","waymarks"],
              front:["verge","fg"] },
  // normalized 0..1 placement / camera anchors — seated on the road cubic
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.02,y0:.40,x1:.98,y1:.99 },
    road:{ x0:.14,y0:.40,x1:.72,y1:.99 },
    "road-near":{ x0:.14,y0:.86,x1:.72,y1:.99 },
    "road-mid":{ x0:.38,y0:.66,x1:.66,y1:.88 },
    "road-far":{ x0:.40,y0:.42,x1:.60,y1:.66 },
    spur:{ x0:.45,y0:.39,x1:.78,y1:.54 },
    "town-approach":{ x0:.44,y0:.39,x1:.66,y1:.48 },
    "watch-left":{ x0:.03,y0:.45,x1:.18,y1:.56 },
    "watch-right":{ x0:.79,y0:.53,x1:.97,y1:.64 },
    threshold_gate:{ x0:.52,y0:.38,x1:.57,y1:.43 },
    threshold_postern:{ x0:.73,y0:.37,x1:.76,y1:.41 },
    threshold_side_door:{ x0:.59,y0:.33,x1:.63,y1:.37 },
  },
  states:{
    initial:"day",
    nodes:{
      day:{ preview:{ state:"day" } },
      watched:{ preview:{ state:"watched", watchLit:true } },
      dusk:{ preview:{ state:"dusk" } },
      // the bare walking set: the road, the two ends, nothing to stop for
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["day","watched"],["watched","day"],["day","dusk"],["dusk","day"],
           ["day","bare"],["bare","day"]],
  },
  channels:["state","reveal","camera","light","watch","traffic"],

  preview:()=>({ state:"day", t:0, status:"THE ROAD", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
