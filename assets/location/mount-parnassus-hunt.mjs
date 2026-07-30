/* location.mount-parnassus-hunt — the wooded flank of Parnassus where the young
   Odysseus took the scar. LOCATION asset (empty navigable set — NO baked
   figures). Solid grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone.

   THE SHAPE OF THE MEMORY (XIX.428-466). They climb at first light, the dogs
   and the sons of Autolycus are cast ahead into a wooded glen, and the boar is
   lying in a thicket so dense that neither the wet wind blows through it nor
   the sun strikes it nor the rain gets in. He comes out. In the clearing in
   front of it a man and an animal cross once, and one of them carries the mark
   of it for forty years. Then they carry him back down.

   So the set holds the whole hunt in one frame, bottom to top:
     · the APPROACH TRAIL climbing from the valley at the near bottom edge,
     · the CLEARING — the open contact floor, the lightest ground in the set,
     · the THICKET above and right of it: the densest mass here, with a black
       mouth that is the only full-ink note in the frame, because it is the
       thing the whole set is about,
     · the wooded slope, the broken scree courses, and the twin crest.

   THE TRAIL IS ONE CUBIC (trailPtN) and every anchor on it is read from that
   cubic, so a figure placed at `trail:mid` stands on the path that is drawn, at
   the size the path is drawn at. The feet ladder runs near-to-far from the
   bottom edge to the lower lip of the clearing and no further.

   NOTHING SPANS THE FRAME. The skyline is a filled profile with NO base stroke,
   so the sky/ground join is a change of tone and not a rule across the picture;
   every scree course, leaf bank and bracken run is cut into short segments with
   gaps. The slope recedes on one vanishing point instead of striping.

   TWO WAYS DOWN, and they are different anchors. The approach trail is the
   direct climb. The RETURN ROUTE is a separate switchback leaving the clearing
   on the left and traversing down in shallow legs with two cairns on it — the
   gentle way, because coming back they are carrying a man who cannot walk.

   THE DEFLECTION MARKS over the thicket are the poem's own line drawn as a
   diagram: three sun rays and one wet wind struck down onto the canopy and
   turned aside at it. Nothing gets in there. That is why the boar is in there.

   States: "dawn" (the sun just up off the deep), "hunt" (the beat cast out of
   the glen, sightlines struck onto the lair), "strike" (the charge line from
   the mouth and the two contact rings on the clearing floor), "after" (the lair
   stood down, the mark on the ground, the return route lit with its litter
   stations), "bare" (the navigable set only).

   Serves OD-B19-S05. Atlas: OD-B19-S05 — wooded slope, boar thicket, approach
   trail, attack clearing, and return route. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const MODES = ["dawn", "hunt", "strike", "after", "bare"];

const params = {
  crest:0.262,       // the twin summit line, as a fraction of H
  treeline:0.398,    // where the firs give out on the upper slope
  glenX:0.250,       // the wooded hollow the beat is cast into
  glenY:0.548,
  thicketX:0.664,    // the lair
  thicketY:0.612,
  clearX:0.470,      // the contact floor
  clearY:0.716,
  firs:10,           // conifers along the treeline
  beatLit:false,     // the beat cast and the sightlines struck
};

/* ---------- THE TRAIL ----------
   One cubic, drawn once and read everywhere. t = 0 at the near bottom edge
   (the valley and Autolycus's house are off-frame below), t = 1 at the lower
   lip of the clearing. Every anchor on the path is seated on it. The bends are
   shallow on purpose: a hard S closes a loop and the path stops reading as a
   path. */
const T0 = { x:0.352, y:1.035 };
const T1 = { x:0.575, y:0.925 };
const T2 = { x:0.318, y:0.802 };
const T3 = { x:0.456, y:0.676 };

function trailPtN(t){
  const u = 1 - t, a = u*u*u, b = 3*u*u*t, c = 3*u*t*t, d = t*t*t;
  return { x: a*T0.x + b*T1.x + c*T2.x + d*T3.x,
           y: a*T0.y + b*T1.y + c*T2.y + d*T3.y };
}
function trailTanN(t){
  const u = 1 - t;
  const dx = 3*u*u*(T1.x-T0.x) + 6*u*t*(T2.x-T1.x) + 3*t*t*(T3.x-T2.x);
  const dy = 3*u*u*(T1.y-T0.y) + 6*u*t*(T2.y-T1.y) + 3*t*t*(T3.y-T2.y);
  const n = Math.hypot(dx, dy) || 1;
  return { x:dx/n, y:dy/n };
}
/* half-width of the path, and the depth scale of anything standing on it */
const trailHW = t => lerp(0.054, 0.012, Math.pow(t, 0.72));
const depthAt = t => lerp(1.00, 0.46, Math.pow(t, 0.82));

/* ---------- THE RETURN ROUTE ----------
   shallow switchback legs off the left lip of the clearing, down to the valley
   at the bottom-left corner. Deliberately not the way they came up. */
const RETURN = [
  [0.348,0.734], [0.206,0.766], [0.292,0.822],
  [0.146,0.866], [0.208,0.926], [0.082,0.994],
];

/* ---------- the beat: cast out of the glen, driving right onto the lair ---- */
const BEAT = [
  { x:0.222, y:0.588 },
  { x:0.352, y:0.606 },
  { x:0.478, y:0.616 },
];

const MOUTH = { x:0.628, y:0.620 };     // the lie the boar comes out of

/* ---------- anchors: the trail ones taken from the cubic, never hand-tuned ---- */
const rd = t => { const p = trailPtN(t); return { x:+p.x.toFixed(3), y:+p.y.toFixed(3) }; };
export const anchors = {
  "entrance:valley":    { x:0.240, y:0.988 },   // walk-on from below, off-frame
  "trail:foot":         rd(0.13),               // a figure at full height
  "trail:lower":        rd(0.24),
  "trail:bend":         rd(0.42),
  "trail:mid":          rd(0.60),
  "trail:upper":        rd(0.78),
  "trail:clearing-lip": rd(0.95),
  "clearing:centre":    { x:params.clearX, y:params.clearY },
  "clearing:left":      { x:0.378, y:0.730 },   // contact pair — the man
  "clearing:right":     { x:0.564, y:0.718 },   // contact pair — the animal
  "clearing:far":       { x:0.500, y:0.676 },
  "clearing:near":      { x:0.452, y:0.756 },
  "thicket:mouth":      MOUTH,
  "thicket:core":       { x:params.thicketX, y:0.586 },
  "thicket:flank-left": { x:0.560, y:0.624 },
  "thicket:flank-right":{ x:0.772, y:0.622 },
  "leafbank:foot":      { x:0.684, y:0.634 },
  "glen:hollow":        { x:params.glenX, y:params.glenY },
  "glen:mouth":         { x:0.318, y:0.578 },
  "beat:left":          BEAT[0],
  "beat:centre":        BEAT[1],
  "beat:right":         BEAT[2],
  "rock:outcrop":       { x:0.846, y:0.470 },
  "ledge:upper":        { x:0.586, y:0.372 },
  "ridge:crest":        { x:0.520, y:0.280 },
  "return:head":        { x:RETURN[0][0], y:RETURN[0][1] },
  "return:bend":        { x:RETURN[2][0], y:RETURN[2][1] },
  "return:foot":        { x:RETURN[5][0], y:RETURN[5][1] },
  "waymark:upper":      { x:0.250, y:0.792 },
  "waymark:lower":      { x:0.166, y:0.900 },
  "exit:valley":        { x:0.082, y:0.994 },
  "exit:ridge":         { x:0.556, y:0.312 },
  "camera:wide":        { x:0.500, y:0.596 },
  "camera:clearing":    { x:0.478, y:0.718 },
  "camera:thicket":     { x:0.656, y:0.622 },
  "camera:trail":       { x:0.430, y:0.868 },
};

/* ---------- small stamps ---------- */
/* blocky notched conifer — a diagrammatic silhouette, not an organic tree */
const FIR_EDGE = [[0.50,0.00],[0.30,0.20],[0.42,0.29],[0.24,0.51],[0.34,0.59],
                  [0.16,0.79],[0.00,1.00]];
function fir(pen, g, x, base, h, w, tone){
  const fb = base - h*0.10;
  pen.paint(() => { g.rect(x - w*0.055, fb, w*0.110, h*0.12); }, toneSolid(inkLevel(5)), 2);
  pen.paint(() => {
    g.moveTo(x - w*0.50, fb);
    for (let i = 1; i < FIR_EDGE.length; i++)
      g.lineTo(x - w*FIR_EDGE[i][0], fb - h*FIR_EDGE[i][1]);
    for (let i = FIR_EDGE.length - 2; i >= 0; i--)
      g.lineTo(x + w*FIR_EDGE[i][0], fb - h*FIR_EDGE[i][1]);
    g.closePath();
  }, tone, 2.6);
}
/* holm oak — a trunk and three lobes; the lower wood */
function oak(pen, g, x, base, h, w, tone){
  pen.paint(() => {
    g.moveTo(x - w*0.08, base); g.lineTo(x - w*0.11, base - h*0.40);
    g.lineTo(x + w*0.10, base - h*0.42); g.lineTo(x + w*0.07, base);
    g.closePath();
  }, toneSolid(inkLevel(5)), 2.4);
  for (const [ox, oy, r] of [[-0.29,-0.56,0.38],[0.28,-0.60,0.34],[0,-0.79,0.34]])
    pen.paint(() => { g.ellipse(x + w*ox, base + h*oy, w*r, h*r*0.66, 0, 0, 7); }, tone, 2.8);
}
/* a bracken tuft: three ink strokes, no fill — texture that costs no tone */
function tuft(pen, g, x, base, s){
  pen.ink(() => {
    g.moveTo(x, base);            g.lineTo(x - s*0.42, base - s*0.72);
    g.moveTo(x, base);            g.lineTo(x + s*0.06, base - s*0.96);
    g.moveTo(x, base);            g.lineTo(x + s*0.46, base - s*0.66);
  }, 2.4);
}
/* scrub clump at a depth scale — used sparingly, where a mass is wanted */
function scrub(pen, g, x, base, s, tone){
  pen.paint(() => { g.ellipse(x, base - s*0.50, s*0.58, s*0.36, 0, 0, 7); }, tone, 2.2);
  pen.ink(() => { g.moveTo(x, base); g.lineTo(x, base - s*0.44); }, 1.8);
}
/* a stacked-stone cairn — the return route is marked, the climb is not */
function cairn(pen, g, x, base, s, tone){
  let y = base;
  for (const [w, h] of [[0.62,0.26],[0.46,0.22],[0.30,0.20]]){
    pen.paint(() => { g.rect(x - s*w*0.5, y - s*h, s*w, s*h); }, tone, 2.2);
    y -= s*h;
  }
}
/* an angular rock outcrop with facet lines — no rounding anywhere */
function outcrop(pen, g, x, base, w, h, tone){
  pen.paint(() => {
    g.moveTo(x - w*0.50, base); g.lineTo(x - w*0.34, base - h*0.72);
    g.lineTo(x + w*0.06, base - h); g.lineTo(x + w*0.40, base - h*0.54);
    g.lineTo(x + w*0.50, base); g.closePath();
  }, tone, 3);
  pen.ink(() => {
    g.moveTo(x - w*0.20, base); g.lineTo(x - w*0.06, base - h*0.62);
    g.moveTo(x + w*0.20, base); g.lineTo(x + w*0.08, base - h*0.58);
  }, 2);
}

/* ---------- the set ---------- */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = MODES.includes(st.state) ? st.state : "hunt";
  const dawn = mode === "dawn";
  const beatLit = (st.beatLit ?? params.beatLit) || mode === "hunt" || mode === "strike";
  const struck = mode === "strike";
  const after  = mode === "after";
  const layers = st.layers || (mode === "bare"
    ? ["sky","peaks","ground","slope","woods","thicket","clearing","trail","return"]
    : ["sky","peaks","ground","slope","woods","glen","thicket","clearing",
       "trail","return","marks","fg"]);
  const has = l => layers.includes(l);

  const T = {                     // tone table — the whole set lights from here
    sky:   dawn ? 2 : 1,
    far:   2,
    ridge: 3,
    ground:2,
    brush: 3,
    rock:  4,
    wood:  4,
    lair:  4,
    dark:  6,
    path:  1,
  };

  const cy = params.crest * H;
  const P  = t => { const p = trailPtN(t); return { x:p.x*W, y:p.y*H }; };
  const TN = t => trailTanN(t);
  const HW = t => trailHW(t) * W;
  const VP = { x: 0.520*W, y: cy };            // the slope converges on the crest
  const NEAR = H*1.05;
  /* a point in slope space: x at the near edge, u = how far it has receded */
  const FP = (x, u) => ({ x: lerp(x*W, VP.x, u), y: lerp(NEAR, VP.y, u) });

  /* ---- SKY: the highest, emptiest part of the frame ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, cy);
    g.fillStyle = inkLevel(T.sky + 1);
    for (let i = 0; i < 3; i++){
      g.beginPath();
      g.ellipse(W*(0.20 + i*0.30), cy*(0.30 + 0.22*(i%2)), W*0.110, H*0.011, 0, 0, 7);
      g.fill();
    }
    // the sun just up off the deep, low on the right — an outline, never a blot
    if (dawn){
      pen.paint(() => { g.arc(W*0.842, cy*0.42, W*0.040, 0, 7); },
                toneSolid(inkLevel(0)), 3.5);
      g.save(); g.strokeStyle = INK; g.lineWidth = 2.4; g.globalAlpha = 0.42;
      for (let i = 0; i < 7; i++){
        const a = -Math.PI*0.92 + i*Math.PI*0.24;
        g.beginPath();
        g.moveTo(W*0.842 + Math.cos(a)*W*0.052, cy*0.42 + Math.sin(a)*W*0.052);
        g.lineTo(W*0.842 + Math.cos(a)*W*0.074, cy*0.42 + Math.sin(a)*W*0.074);
        g.stroke();
      }
      g.restore();
    }
  }

  /* ---- PEAKS: far range, then the twin crest. FILLED, and the contour follows
     the skyline ONLY — no base stroke, so the horizon is a change of tone and
     not a rule ruled across the whole picture. ---- */
  if (has("peaks")){
    const RANGE = [[0,0.000],[0.10,0.044],[0.26,0.014],[0.40,0.052],[0.52,0.010],
                   [0.68,0.058],[0.86,0.016],[1.00,0.040]];
    pen.fillPath(() => {
      g.moveTo(0, cy);
      for (const [x, d] of RANGE) g.lineTo(W*x, cy - H*d);
      g.lineTo(W, cy); g.closePath();
    }, inkLevel(T.far));
    pen.ink(() => {
      g.moveTo(0, cy - H*RANGE[0][1]);
      for (const [x, d] of RANGE) g.lineTo(W*x, cy - H*d);
    }, 3.2);
    // the two summits — Parnassus has two, and the set should say so
    const peak = (px, ph, pw) => {
      const prof = [[-1.00,0.00],[-0.28,0.78],[0.00,1.00],[0.42,0.60],[1.00,0.00]];
      pen.fillPath(() => {
        g.moveTo(px + pw*prof[0][0], cy);
        for (const [dx, dy] of prof) g.lineTo(px + pw*dx, cy - ph*dy);
        g.closePath();
      }, inkLevel(T.ridge));
      pen.ink(() => {
        g.moveTo(px + pw*prof[0][0], cy - ph*prof[0][1]);
        for (const [dx, dy] of prof) g.lineTo(px + pw*dx, cy - ph*dy);
      }, 3.6);
      pen.paint(() => {                       // snow cap: paper, hard contour
        g.moveTo(px - pw*0.34, cy - ph*0.70);
        g.lineTo(px - pw*0.16, cy - ph*0.80);
        g.lineTo(px - pw*0.04, cy - ph*0.70);
        g.lineTo(px, cy - ph);
        g.lineTo(px + pw*0.20, cy - ph*0.78);
        g.lineTo(px + pw*0.30, cy - ph*0.64);
        g.lineTo(px + pw*0.14, cy - ph*0.66);
        g.lineTo(px + pw*0.02, cy - ph*0.58);
        g.lineTo(px - pw*0.18, cy - ph*0.62);
        g.closePath();
      }, toneSolid(inkLevel(0)), 2.6);
      g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.30;
      for (let i = 0; i < 4; i++){                  // gullies, stopping short
        g.beginPath();
        g.moveTo(px - pw*0.42 + i*pw*0.30, cy - ph*0.44);
        g.lineTo(px - pw*0.32 + i*pw*0.30, cy - ph*0.06);
        g.stroke();
      }
      g.restore();
    };
    peak(W*0.386, H*0.104, W*0.148);
    peak(W*0.634, H*0.082, W*0.126);
  }

  /* ---- GROUND: the flank itself ---- */
  if (has("ground")){
    g.fillStyle = inkLevel(T.ground); g.fillRect(0, cy, W, H - cy);
  }

  /* ---- SLOPE: broken scree courses, outcrops, grass ticks. Every course is cut
     into short pieces with gaps — the mountain recedes, it does not stripe. ---- */
  if (has("slope")){
    /* each course is TILTED (its two ends sit at different depths) and shed with
       loose stones, so a scree step never prints as a level dash floating on the
       slope. Level dashes are how a landscape turns into a barcode. */
    for (const [u, runs] of [
      [0.88, [[-0.22,0.10,0.016],[0.52,0.84,-0.014],[1.14,1.46,0.012]]],
      [0.78, [[-0.30,-0.04,-0.018],[0.34,0.58,0.016],[0.98,1.28,-0.014]]],
      [0.66, [[-0.40,-0.12,0.022],[0.24,0.44,-0.020],[0.84,1.18,0.018]]],
    ]){
      const th = H * lerp(0.020, 0.006, u);
      for (const [xa, xb, tl] of runs){
        const a = FP(xa, u), b = FP(xb, u + tl);
        if (b.x < -W*0.06 || a.x > W*1.06) continue;
        pen.paint(() => {
          g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
          g.lineTo(b.x, b.y + th); g.lineTo(a.x, a.y + th); g.closePath();
        }, toneSolid(inkLevel(T.brush)), 2.4);
        g.save(); g.strokeStyle = INK; g.lineWidth = 1.6; g.globalAlpha = 0.30;
        for (let i = 1; i < 5; i++){
          const k = i/5, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
          g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + th); g.stroke();
        }
        g.restore();
        g.fillStyle = inkLevel(T.rock);
        for (const [k, off, r] of [[-0.10,1.9,0.9],[0.42,2.4,0.7],[1.14,1.6,0.8]]){
          const sx = lerp(a.x, b.x, k), sy = lerp(a.y, b.y, k) + th*off;
          g.beginPath(); g.ellipse(sx, sy, th*r*0.9, th*r*0.5, 0, 0, 7); g.fill();
        }
      }
    }
    outcrop(pen, g, W*0.846, H*0.470, W*0.122, H*0.064, toneSolid(inkLevel(T.rock)));
    outcrop(pen, g, W*0.586, H*0.372, W*0.078, H*0.038, toneSolid(inkLevel(T.rock)));
    outcrop(pen, g, W*0.104, H*0.442, W*0.096, H*0.048, toneSolid(inkLevel(T.rock - 1)));
    // grass ticks: texture, not tone
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.16;
    for (let r = 0; r < 7; r++){
      const u = 0.06 + r*0.122, sc = lerp(0.024, 0.004, u);
      for (let k = 0; k < 12; k++){
        const q = FP(-0.36 + k*0.16, u);
        if (q.x < -W*0.04 || q.x > W*1.04) continue;
        g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x + W*0.004, q.y - H*sc); g.stroke();
      }
    }
    g.restore();
  }

  /* ---- WOODS: the wooded slope of the title. Built out of INDIVIDUAL trees at
     scattered depths — never a canopy band, because a band of wood laid across
     a slope prints as a rule across the picture and the mountain dies. ---- */
  if (has("woods")){
    /* the high wood above the treeline and the mid wood below it: two scatters,
       each one deliberately off any single line */
    for (const [x, y, h, w] of [
      [0.068,0.348,0.050,0.036],[0.148,0.374,0.040,0.030],[0.222,0.344,0.054,0.038],
      [0.302,0.370,0.042,0.031],[0.374,0.342,0.046,0.034],[0.646,0.350,0.050,0.036],
      [0.716,0.374,0.041,0.030],[0.792,0.344,0.055,0.039],[0.870,0.370,0.043,0.032],
      [0.944,0.348,0.048,0.035],
      [0.052,0.474,0.058,0.042],[0.150,0.498,0.048,0.035],[0.240,0.468,0.062,0.045],
      [0.392,0.492,0.050,0.037],[0.472,0.464,0.056,0.041],[0.566,0.494,0.046,0.034],
      [0.706,0.470,0.060,0.043],[0.802,0.494,0.049,0.036],[0.898,0.466,0.058,0.042],
      [0.972,0.492,0.047,0.035],
    ]) fir(pen, g, x*W, y*H, H*h, W*w,
           toneSolid(inkLevel(Math.round(x*10)%3 === 1 ? T.wood : T.brush)));
    for (let i = 0; i < params.firs; i++){
      const k = i/(params.firs - 1);
      const x = 0.040 + k*0.930;
      if (Math.abs(x - 0.528) < 0.062) continue;        // keep the crest notch open
      const y = params.treeline*H + H*0.026*Math.sin(k*5.6) + H*0.014*(i%2);
      const h = H*(0.056 + 0.022*((i*3)%3));
      fir(pen, g, x*W, y, h, W*(0.038 + 0.009*((i*5)%3)),
          toneSolid(inkLevel(i%3 === 1 ? T.wood : T.brush)));
    }
    // lower wood, both flanks, stamped at a depth scale
    for (let r = 0; r < 3; r++){
      const u = 0.30 + r*0.14, s = lerp(0.122, 0.066, r/2);
      for (let k = 0; k < 3; k++){
        const q = FP(-0.32 + k*0.125, u);
        if (q.x < -W*0.05) continue;
        oak(pen, g, q.x, q.y, H*s*0.60, W*s*0.60, toneSolid(inkLevel(T.brush)));
      }
      for (let k = 0; k < 3; k++){
        const q = FP(1.08 + k*0.135, u);
        if (q.x > W*1.05) continue;
        oak(pen, g, q.x, q.y, H*s*0.60, W*s*0.60, toneSolid(inkLevel(T.brush)));
      }
    }
    // a few scrub masses over the open ground, and tufts for the rest
    for (const [x, u] of [[-0.04,0.46],[1.06,0.48],[0.94,0.38],
                          [-0.16,0.20],[0.02,0.12]]){
      const q = FP(x, u);
      scrub(pen, g, q.x, q.y, W*lerp(0.070, 0.022, u), toneSolid(inkLevel(T.brush)));
    }
    g.save(); g.globalAlpha = 0.55;
    for (const [x, u] of [[0.06,0.40],[0.24,0.50],[0.86,0.44],[1.00,0.36],
                          [-0.14,0.36],[0.72,0.52],[0.40,0.56],
                          [-0.26,0.16],[-0.06,0.24],[0.14,0.10],[1.18,0.18]]){
      const q = FP(x, u);
      tuft(pen, g, q.x, q.y, W*lerp(0.052, 0.016, u));
    }
    g.restore();
  }

  /* ---- THE GLEN: the wooded hollow the beat is cast into, left of the trail ---- */
  if (has("glen")){
    const gx = params.glenX*W, gy = params.glenY*H;
    pen.paint(() => {
      g.moveTo(gx - W*0.142, gy + H*0.010);
      g.quadraticCurveTo(gx - W*0.086, gy - H*0.042, gx, gy - H*0.036);
      g.quadraticCurveTo(gx + W*0.092, gy - H*0.030, gx + W*0.132, gy + H*0.008);
      g.closePath();
    }, toneSolid(inkLevel(T.brush)), 3);
    // the hollow reads as depth because its floor is a step darker than its lip
    pen.paint(() => { g.ellipse(gx, gy - H*0.004, W*0.062, H*0.014, 0, 0, 7); },
              toneSolid(inkLevel(T.wood)), 2.4);
    for (const [ox, oy, s] of [[-0.082,0.002,0.046],[0.010,-0.014,0.040],[0.092,0.004,0.042]])
      oak(pen, g, gx + W*ox, gy + H*oy, H*s*1.05, W*s*1.00, toneSolid(inkLevel(T.brush)));
  }

  /* ---- THE THICKET: the lair. The densest thing in the set — but its density
     is TANGLE, not tone: a mid-level mass crossed by branches, with one black
     mouth. A solid black blob would say nothing about why it cannot be entered. */
  if (has("thicket")){
    const tx = params.thicketX*W, ty = params.thicketY*H;
    const tw = W*0.108, th = H*0.056;
    // the bank of dead leaves drifted at its foot, cut into scallops
    for (const [ox, r] of [[-1.02,0.30],[-0.48,0.34],[0.14,0.32],[0.72,0.26],[1.12,0.20]]){
      pen.paint(() => { g.ellipse(tx + tw*ox, ty + H*0.007, tw*r, H*0.009, 0, 0, 7); },
                toneSolid(inkLevel(T.rock)), 2.2);
    }
    // the mass: overlapping lobes at a mid level
    for (const [ox, oy, rx, ry] of [
      [-0.86,-0.26,0.44,0.42],[-0.30,-0.54,0.52,0.62],[0.32,-0.48,0.50,0.56],
      [0.88,-0.22,0.42,0.38],[0.02,-0.88,0.40,0.40],
    ]) pen.paint(() => { g.ellipse(tx + tw*ox, ty + th*oy, tw*rx, th*ry, 0, 0, 7); },
                 toneSolid(inkLevel(T.lair)), 3);
    // the tangle: branches crossing inside the mass, so it reads impenetrable
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.34;
    for (let i = 0; i < 9; i++){
      const a = -0.92 + i*0.23;
      g.beginPath();
      g.moveTo(tx + tw*a, ty + H*0.003);
      g.lineTo(tx + tw*(a*0.40 + (i%2 ? 0.24 : -0.24)), ty - th*(0.72 + 0.16*(i%3)));
      g.stroke();
    }
    for (let i = 0; i < 3; i++){
      g.beginPath();
      g.moveTo(tx - tw*0.96, ty - th*(0.26 + i*0.28));
      g.quadraticCurveTo(tx, ty - th*(0.56 + i*0.24), tx + tw*0.96, ty - th*(0.22 + i*0.26));
      g.stroke();
    }
    g.restore();
    // THE MOUTH — the darkest note in the set, and the only one
    const mx = MOUTH.x*W, my = MOUTH.y*H;
    pen.paint(() => {
      g.moveTo(mx - W*0.021, my);
      g.lineTo(mx - W*0.017, my - H*0.024);
      g.lineTo(mx + W*0.003, my - H*0.030);
      g.lineTo(mx + W*0.019, my - H*0.019);
      g.lineTo(mx + W*0.021, my); g.closePath();
    }, toneSolid(inkLevel(7)), 3);
    pen.paint(() => { g.ellipse(mx, my + H*0.004, W*0.030, H*0.006, 0, 0, 7); },
              toneSolid(inkLevel(T.rock)), 2.2);        // the trodden sill of the lie
    if (after){                                          // stood down: the lie is open
      g.save(); g.strokeStyle = INK; g.lineWidth = 3.5; g.globalAlpha = 0.85;
      g.beginPath(); g.arc(mx, my - H*0.012, W*0.040, 0, 7); g.stroke(); g.restore();
    }
  }

  /* ---- THE CLEARING: the contact floor. The LIGHTEST ground in the set, so the
     one place where two bodies meet is the one place with room to see them. ---- */
  if (has("clearing")){
    const cxp = params.clearX*W, cyp = params.clearY*H;
    const rx = W*0.192, ry = H*0.052;
    /* the floor is TONE, and its rim is struck only where the rim CURVES. A
       floor this flat, fully contoured, prints its top and bottom edges as two
       horizontal rules across the picture; the bracken closes the gaps. */
    g.beginPath(); g.ellipse(cxp, cyp, rx, ry, 0, 0, 7);
    g.fillStyle = inkLevel(T.path); g.fill();
    g.save(); g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round";
    for (const [a0, a1] of [[0.09,0.39],[0.61,0.91],[1.09,1.39],[1.61,1.91]]){
      g.beginPath(); g.ellipse(cxp, cyp, rx, ry, 0, Math.PI*a0, Math.PI*a1); g.stroke();
    }
    g.restore();
    // bracken standing round the near rim — clumps and tufts, never a ring of bar
    for (const [a, s] of [[0.14,0.030],[0.40,0.036],[0.62,0.028],[0.86,0.034]]){
      const ang = Math.PI*a;
      scrub(pen, g, cxp + Math.cos(ang)*rx*1.06, cyp + Math.sin(ang)*ry*1.10,
            W*s, toneSolid(inkLevel(T.brush)));
    }
    g.save(); g.globalAlpha = 0.60;
    for (const a of [0.04,0.26,0.52,0.74,0.96,1.14,1.34,1.58,1.78,1.94]){
      const ang = Math.PI*a;
      tuft(pen, g, cxp + Math.cos(ang)*rx*1.03, cyp + Math.sin(ang)*ry*1.05, W*0.024);
    }
    g.restore();
    // trodden ground inside it — short ticks, not tone
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.22;
    for (let i = 0; i < 12; i++){
      const a = i*1.117, r = 0.28 + 0.58*((i*7)%5)/5;
      const px = cxp + Math.cos(a)*rx*r, py = cyp + Math.sin(a)*ry*r;
      g.beginPath(); g.moveTo(px, py); g.lineTo(px + W*0.009, py - H*0.005); g.stroke();
    }
    g.restore();
  }

  /* ---- THE APPROACH TRAIL ---- */
  if (has("trail")){
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
    g.closePath(); g.fillStyle = inkLevel(T.path); g.fill();
    g.save(); g.strokeStyle = INK; g.lineJoin = "round";
    for (const s of [1, -1]){
      g.beginPath();
      for (let i = 0; i <= N; i++){
        const t = i/N, p = P(t), v = TN(t), hw = HW(t);
        const x = p.x + s*v.y*hw, y = p.y - s*v.x*hw;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.lineWidth = 3.4; g.stroke();
    }
    g.restore();
    // the worn line down the middle, thinning with distance
    g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.26;
    for (let i = 0; i < N; i += 3){
      const t = i/N, t2 = Math.min(1, (i + 1.7)/N);
      const a = P(t), b = P(t2);
      g.lineWidth = lerp(3.2, 1.1, t);
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    }
    g.restore();
    // loose stones on the shoulders, sized by depth
    g.fillStyle = inkLevel(T.rock);
    for (let i = 0; i < 10; i++){
      const t = 0.04 + i*0.052, p = P(t), v = TN(t), hw = HW(t)*(i%2 ? 1.34 : -1.40);
      const r = W*0.008*depthAt(t);
      g.beginPath(); g.ellipse(p.x - v.y*hw, p.y + v.x*hw, r, r*0.60, 0, 0, 7); g.fill();
    }
  }

  /* ---- THE RETURN ROUTE: the gentle switchback, marked with cairns ---- */
  if (has("return")){
    const lit = after || mode === "bare";
    g.save();
    g.strokeStyle = INK; g.lineWidth = W*0.017; g.lineCap = "round"; g.lineJoin = "round";
    g.globalAlpha = lit ? 1 : 0.82;
    g.beginPath(); g.moveTo(RETURN[0][0]*W, RETURN[0][1]*H);
    for (let i = 1; i < RETURN.length; i++) g.lineTo(RETURN[i][0]*W, RETURN[i][1]*H);
    g.stroke();
    g.globalAlpha = 1;
    g.strokeStyle = inkLevel(T.path); g.lineWidth = W*0.0085;
    g.beginPath(); g.moveTo(RETURN[0][0]*W, RETURN[0][1]*H);
    for (let i = 1; i < RETURN.length; i++) g.lineTo(RETURN[i][0]*W, RETURN[i][1]*H);
    g.stroke();
    g.restore();
    cairn(pen, g, W*0.250, H*0.792, W*0.048, toneSolid(inkLevel(T.rock)));
    cairn(pen, g, W*0.166, H*0.900, W*0.058, toneSolid(inkLevel(T.rock)));
    if (after){   // the litter stations: where they set him down on the way out
      g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.8;
      for (const [rx, ry] of [RETURN[1], RETURN[3]]){
        g.beginPath(); g.arc(rx*W, ry*H, W*0.018, 0, 7); g.stroke();
        g.beginPath();
        g.moveTo(rx*W - W*0.028, ry*H); g.lineTo(rx*W + W*0.028, ry*H); g.stroke();
      }
      g.restore();
    }
  }

  /* ---- MARKS: the diagram over the picture. What gets into the thicket
     (nothing), where the beat is cast, and where the two bodies crossed. ---- */
  if (has("marks")){
    const tx = params.thicketX*W, ty = params.thicketY*H;
    // three sun rays and one wet wind struck down and TURNED ASIDE at the canopy
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.52;
    for (let i = 0; i < 3; i++){
      const hitX = tx - W*0.060 + i*W*0.060, hitY = ty - H*0.058 - H*0.005*(i%2);
      g.setLineDash([W*0.013, W*0.010]);
      g.beginPath();
      g.moveTo(hitX - W*0.062, hitY - H*0.078); g.lineTo(hitX, hitY);
      g.stroke(); g.setLineDash([]);
      g.beginPath();                                    // the deflection tick
      g.moveTo(hitX, hitY); g.lineTo(hitX + W*0.032, hitY - H*0.018); g.stroke();
    }
    g.beginPath();                                      // the wet wind, off the right
    g.moveTo(tx + W*0.176, ty - H*0.050);
    g.lineTo(tx + W*0.098, ty - H*0.042); g.stroke();
    g.beginPath();
    g.moveTo(tx + W*0.098, ty - H*0.042); g.lineTo(tx + W*0.132, ty - H*0.070); g.stroke();
    g.restore();

    // THE BEAT: three stations cast out of the glen, driving right onto the lair
    if (beatLit){
      g.save(); g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.58;
      g.setLineDash([W*0.016, W*0.013]);
      g.beginPath();
      g.moveTo(BEAT[0].x*W, BEAT[0].y*H);
      g.quadraticCurveTo(BEAT[1].x*W, BEAT[1].y*H - H*0.020, BEAT[2].x*W, BEAT[2].y*H);
      g.stroke(); g.setLineDash([]); g.restore();
      for (const b of BEAT){
        pen.paint(() => { g.arc(b.x*W, b.y*H, W*0.012, 0, 7); },
                  toneSolid(inkLevel(T.path)), 3);
        g.save(); g.strokeStyle = INK; g.lineWidth = 2.2; g.globalAlpha = 0.48;
        g.setLineDash([W*0.012, W*0.010]);
        g.beginPath();
        g.moveTo(b.x*W + W*0.014, b.y*H);
        g.lineTo(MOUTH.x*W - W*0.024, MOUTH.y*H - H*0.004);
        g.stroke(); g.setLineDash([]); g.restore();
      }
    }

    // THE CHARGE: the line out of the mouth onto the contact floor, and the rings
    if (struck){
      const ax = MOUTH.x*W, ay = MOUTH.y*H + H*0.004;
      const bx = anchors["clearing:right"].x*W, by = anchors["clearing:right"].y*H;
      g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round";
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
      const dx = bx - ax, dy = by - ay, n = Math.hypot(dx, dy) || 1;
      const ux = dx/n, uy = dy/n, hl = W*0.034;
      g.beginPath();
      g.moveTo(bx, by);
      g.lineTo(bx - ux*hl + uy*hl*0.44, by - uy*hl - ux*hl*0.44);
      g.lineTo(bx - ux*hl - uy*hl*0.44, by - uy*hl + ux*hl*0.44);
      g.closePath(); g.fillStyle = INK; g.fill();
      g.lineWidth = 4;
      g.beginPath(); g.arc(bx, by, W*0.046, 0, 7); g.stroke();
      g.beginPath();
      g.arc(anchors["clearing:left"].x*W, anchors["clearing:left"].y*H, W*0.046, 0, 7);
      g.stroke();
      g.restore();
    }
    if (after){    // the mark left on the floor where it happened
      g.save(); g.strokeStyle = INK; g.lineWidth = 3.5; g.globalAlpha = 0.85;
      const lx = anchors["clearing:left"].x*W, ly = anchors["clearing:left"].y*H;
      g.beginPath();
      g.moveTo(lx - W*0.022, ly - H*0.013); g.lineTo(lx + W*0.022, ly + H*0.013);
      g.moveTo(lx + W*0.022, ly - H*0.013); g.lineTo(lx - W*0.022, ly + H*0.013);
      g.stroke(); g.restore();
    }
  }

  /* ---- FOREGROUND OCCLUSION: what a figure on the lower trail passes behind.
     Kept in the corners and kept light — the near edge is a frame, not a wall. */
  if (has("fg")){
    fir(pen, g, W*0.052, H*1.052, H*0.210, W*0.108, toneSolid(inkLevel(T.brush)));
    oak(pen, g, W*0.972, H*1.016, H*0.126, W*0.096, toneSolid(inkLevel(T.brush)));
    // a fallen trunk on the near left ground — cut short, never a spanning bar
    pen.paint(() => {
      g.moveTo(-W*0.03, H*0.966); g.lineTo(W*0.202, H*0.944);
      g.lineTo(W*0.204, H*0.960); g.lineTo(-W*0.03, H*0.984); g.closePath();
    }, toneSolid(inkLevel(T.brush)), 2.8);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.38;
    for (let i = 1; i < 5; i++){
      const k = i/5, bx = lerp(-W*0.03, W*0.202, k), by = lerp(H*0.966, H*0.944, k);
      g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + H*0.017); g.stroke();
    }
    g.restore();
    // bracken along the near edge, spaced so the bottom never bars over
    g.save(); g.globalAlpha = 0.7;
    for (const [x, y, s] of [[0.596,1.002,0.046],[0.720,0.988,0.038],[0.856,1.006,0.042],
                             [0.300,1.008,0.040]])
      tuft(pen, g, W*x, H*y, W*s);
    g.restore();
  }
}

export const asset = {
  id:"location.mount-parnassus-hunt",
  type:"LOCATION",
  name:"Mount Parnassus Hunt",
  statusWord:"THE THICKET",
  scene:"OD-B19-S05",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","peaks","ground","slope","woods","glen","thicket","clearing",
          "trail","return","marks","fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky","peaks","slope","woods","glen"],
              ground:["ground","clearing","trail","return","thicket"],
              front:["marks","fg"] },
  // normalized 0..1 placement / camera anchors — trail anchors seated on the cubic
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.03,y0:.42,x1:.97,y1:.99 },
    trail:{ x0:.26,y0:.66,x1:.66,y1:.99 },
    "trail-near":{ x0:.28,y0:.90,x1:.62,y1:.99 },
    "trail-mid":{ x0:.28,y0:.78,x1:.60,y1:.92 },
    "trail-upper":{ x0:.30,y0:.66,x1:.52,y1:.80 },
    clearing:{ x0:.26,y0:.66,x1:.68,y1:.78 },
    "clearing-contact":{ x0:.34,y0:.70,x1:.60,y1:.75 },
    thicket:{ x0:.54,y0:.55,x1:.79,y1:.64 },
    "thicket-mouth":{ x0:.60,y0:.59,x1:.66,y1:.63 },
    glen:{ x0:.11,y0:.50,x1:.39,y1:.58 },
    "return-route":{ x0:.06,y0:.72,x1:.37,y1:.99 },
    slope:{ x0:.03,y0:.40,x1:.97,y1:.56 },
    threshold_valley:{ x0:.05,y0:.95,x1:.28,y1:.99 },
    threshold_ridge:{ x0:.50,y0:.28,x1:.60,y1:.33 },
  },
  states:{
    initial:"dawn",
    nodes:{
      // the sun just up off the deep, the beat not yet cast
      dawn:{ preview:{ state:"dawn" } },
      // the dogs and the sons cast out of the glen, sightlines struck on the lair
      hunt:{ preview:{ state:"hunt", beatLit:true } },
      // the charge line out of the mouth and the two contact rings
      strike:{ preview:{ state:"strike", beatLit:true } },
      // the lair stood down, the mark on the floor, the return route lit
      after:{ preview:{ state:"after" } },
      // the navigable set only: slope, thicket, clearing, both ways down
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["dawn","hunt"],["hunt","strike"],["strike","after"],["after","dawn"],
           ["dawn","bare"],["bare","dawn"],["hunt","dawn"]],
  },
  channels:["state","beat","charge","camera","light","weather"],

  preview:()=>({ state:"hunt", beatLit:true, t:0, status:"THE THICKET", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
