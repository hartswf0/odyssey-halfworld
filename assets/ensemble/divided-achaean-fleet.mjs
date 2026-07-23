/* ensemble.divided-achaean-fleet — the Achaean armada coming apart at sea.
   ENSEMBLE asset. Scene function (OD-B03-S03): the great fleet that sailed
   from Troy no longer moves as one body — ship GROUPS separate down alternate
   sea lanes, one squadron has TURNED BACK, and the furthest ships VANISH to
   pale specks on the horizon. Built from ONE separable member template
   (drawShip — a single-sailed Achaean galley) instanced N times per lane,
   deterministically, across depth (scale + ink both fall off toward the
   horizon so distant ships literally fade). Exposes a FORMATION channel
   (united | diverging | turning-back | vanishing), a divergence control (how
   wide the lanes fan), progress (how far the fleet has run seaward), spread,
   and a turnBack amount. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify POST pass supplies the halftone. Do NOT
   bake named characters/heroes in — these are anonymous hulls. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"diverging",  // united | diverging | turning-back | vanishing
  divergence:1.0,         // 0 = one column (still united) .. 1 = full fan of lanes
  progress:0.82,          // 0 = fleet still massed at muster .. 1 = heads at horizon
  spread:1.0,             // lateral width WITHIN each lane
  turnBack:1.0,           // 0 = every squadron holds course .. 1 = the return lane reverses
  originX:0.50,           // the shared muster point (harbour mouth) as fraction of W
  originY:0.99,
  horizon:0.40,           // sea/sky line as fraction of H
  showLanes:true,         // faint fanning lane guides + divergent arrows
};

/* The squadrons. Each lane = a separable group that has pulled off to its own
   patch of sea. cx/cy = cluster centre (fraction of W/H); exitX = the horizon
   vanishing pole the lane guide points to; `dir` = prow facing (+1 R / -1 L);
   `turn` flags the squadron that has come about. Clusters sit at different
   DEPTHS so scale alone separates the groups: vanguard already tiny on the
   skyline, the returned squadron large in the foreground. */
const LANES = [
  { key:"vanguard",  cx:0.21, cy:0.500, exitX:0.12, dir:-1, turn:false, count:3, baseS:34, seed: 11 },
  { key:"main-body", cx:0.44, cy:0.605, exitX:0.40, dir:-1, turn:false, count:3, baseS:52, seed: 47 },
  { key:"starboard", cx:0.77, cy:0.590, exitX:0.84, dir: 1, turn:false, count:3, baseS:54, seed: 83 },
  { key:"returning", cx:0.55, cy:0.795, exitX:0.60, dir: 1, turn:true,  count:2, baseS:74, seed:151 },
];

/* scale (half hull length, px) from vertical position: high on canvas = near
   the horizon = far = SMALL; low = foreground = large. */
function scaleForY(H, y, horY){
  const bot = H*0.99;
  const u = clamp01((y - horY) / (bot - horY));   // 0 at horizon .. 1 at foreground
  return lerp(22, 108, u*u*0.55 + u*0.45);        // gentle perspective bunching near horizon
}

/* ============================================================
   MEMBER TEMPLATE — one Achaean galley, drawn deterministically.
   cx/cy in px at the waterline; s = half hull length; F = prow facing.
   shade{hull,sail}; opt{furled, oars, wake}.
   ============================================================ */
function drawShip(pen, g, cx, cy, s, F, shade, opt){
  const hull  = toneSolid(inkLevel(shade.hull));
  const sail  = toneSolid(inkLevel(shade.sail));
  const cw    = Math.max(1.4, s*0.05);
  const hh    = s*0.34;                 // hull depth below the deck line
  const deckY = cy;
  const sheer = deckY - hh*0.12;        // flat gunwale (deck) line

  // --- HULL: flat deck on top, round bilge below — a clean galley silhouette ---
  pen.paint(()=>{
    g.moveTo(cx - s, sheer);
    g.lineTo(cx + s, sheer);                                   // straight deck line
    g.quadraticCurveTo(cx + s*0.55, deckY + hh, cx, deckY + hh*1.05);  // rounded bottom
    g.quadraticCurveTo(cx - s*0.55, deckY + hh, cx - s, sheer);
    g.closePath();
  }, hull, cw);

  // --- STEM (prow post, tall recurve toward travel) + STERN (aft curl) ---
  pen.ink(()=>{
    g.moveTo(cx + s*F, sheer);
    g.quadraticCurveTo(cx + s*1.14*F, sheer - hh*1.3, cx + s*0.88*F, sheer - hh*1.9);
  }, cw*1.1);
  pen.ink(()=>{
    g.moveTo(cx - s*F, sheer);
    g.quadraticCurveTo(cx - s*1.05*F, sheer - hh*1.0, cx - s*0.8*F, sheer - hh*1.35);
  }, cw*1.1);

  // --- OARS: a rank of short strokes raked astern (near ships only) ---
  if (opt.oars){
    g.strokeStyle=INK; g.lineWidth=cw*0.6; g.lineCap="round";
    for (let k=-2;k<=2;k++){
      const ox = cx + k*s*0.32;
      g.beginPath();
      g.moveTo(ox, deckY + hh*0.5);
      g.lineTo(ox - F*s*0.22, deckY + hh*1.2);
      g.stroke();
    }
  }

  // --- MAST + single square SAIL (furled to a bare pole when vanishing) ---
  const mastX   = cx;
  const mastTop = sheer - s*1.35;
  pen.ink(()=>{ g.moveTo(mastX, sheer - hh*0.05); g.lineTo(mastX, mastTop); }, cw*1.05);

  if (opt.furled){
    // brailed-up sail: a short bundle along the yard (reads as "vanishing")
    const yardW = s*0.62, yy = mastTop + s*0.18;
    pen.ink(()=>{ g.moveTo(mastX - yardW, yy); g.lineTo(mastX + yardW, yy); }, cw);
  } else {
    const yardW  = s*0.92;
    const yardY  = mastTop + s*0.16;
    const sailBot= sheer - s*0.20;
    const bel    = s*0.20*F;                        // gentle billow toward travel
    // yard (spar)
    pen.ink(()=>{ g.moveTo(mastX - yardW, yardY); g.lineTo(mastX + yardW, yardY); }, cw);
    // the sail — a bold near-square, leading edge bellied out
    pen.paint(()=>{
      g.moveTo(mastX - yardW, yardY);
      g.lineTo(mastX + yardW, yardY);
      g.quadraticCurveTo(mastX + yardW + bel, (yardY+sailBot)*0.5, mastX + yardW*0.82, sailBot); // lee leech
      g.lineTo(mastX - yardW*0.82, sailBot);                                                      // foot
      g.quadraticCurveTo(mastX - yardW - bel*0.4, (yardY+sailBot)*0.5, mastX - yardW, yardY);     // luff
      g.closePath();
    }, sail, cw);
    // one vertical brail seam so the sail doesn't read as a plain slab
    pen.seam(()=>{ g.moveTo(mastX, yardY + s*0.03); g.lineTo(mastX, sailBot); }, cw*0.55);
  }
}

/* --- a small curved "come-about" arrow over the squadron that turned back --- */
function drawReturnArrow(g, ox, oy, s){
  g.save();
  g.strokeStyle=ACCENT; g.globalAlpha=0.7; g.lineWidth=Math.max(2,s*0.03); g.lineCap="round";
  g.beginPath();
  g.arc(ox, oy, s*0.9, Math.PI*1.15, Math.PI*0.05, false);  // U-turn loop
  g.stroke();
  // arrowhead at the loop's end (pointing back toward muster / downstage)
  const ax = ox + s*0.9*Math.cos(Math.PI*0.05), ay = oy + s*0.9*Math.sin(Math.PI*0.05);
  const a = 0.7, hl = s*0.42;
  g.beginPath();
  g.moveTo(ax, ay); g.lineTo(ax - Math.cos(-0.9-a)*hl, ay - Math.sin(-0.9-a)*hl);
  g.moveTo(ax, ay); g.lineTo(ax - Math.cos(-0.9+a)*hl, ay - Math.sin(-0.9+a)*hl);
  g.stroke();
  g.globalAlpha=1; g.restore();
}

/* ---- build the divided fleet deterministically ----
   Each squadron is a small CLUSTER strung along its own lane axis (muster ->
   exit). divergence slides each cluster between the shared column (x=0.5) and
   its own lane; progress runs the clusters further seaward (up + smaller). */
function buildFleet(W, H, st){
  const p = { ...params, ...st };
  const horY = p.horizon*H;
  const exitY = horY + H*0.045;                 // horizon vanishing poles
  const origin = { x:p.originX*W, y:p.originY*H };
  const divergence = clamp01(p.divergence);
  const progress   = clamp01(p.progress);
  const spread     = clamp(p.spread, 0, 1.6);
  const turnBack   = clamp01(p.turnBack);

  const ships = [];
  let returnMark = null;

  for (const lane of LANES){
    const rng = rnd((lane.seed*7 + 3)>>>0);
    // cluster centre: divergence pulls it off the shared column toward its lane;
    // progress lifts it toward the horizon (and shrinks it via scaleForY).
    const cxLane = lerp(0.5, lane.cx, divergence);
    const ccx = lerp(0.5, cxLane, 1) * W;
    let   ccy = lerp(lane.cy, horY/H + 0.02, (progress-0.6)*0.9) * H;
    ccy = clamp(ccy, horY + H*0.03, H*0.92);

    // lane axis (muster -> horizon exit) that the cluster strings along
    const ex = lerp(0.5, lane.exitX, divergence)*W, ey = exitY;
    const ax = ex - origin.x, ay = ey - origin.y, aL = Math.hypot(ax,ay)||1;
    const ux = ax/aL, uy = ay/aL;               // along-lane
    const nx = -uy, ny = ux;                     // perpendicular

    const reversed = lane.turn && turnBack > 0.45;
    const F = reversed ? -lane.dir : lane.dir;

    for (let i=0;i<lane.count;i++){
      const frac = lane.count>1 ? (i/(lane.count-1) - 0.5) : 0;   // -0.5 .. 0.5 along lane
      const jit  = (rng()-0.5);
      // string ships along the lane axis into a receding echelon, lightly offset
      const along = frac * lane.baseS * 3.2 * spread;
      const side  = (jit*0.5 + (i%2?0.5:-0.5)*0.6) * lane.baseS * 0.9 * spread;
      let px = ccx + ux*along + nx*side;
      let py = ccy + uy*along + ny*side*0.55;
      py = clamp(py, horY + H*0.012, H*0.94);
      px = clamp(px, W*0.03, W*0.97);

      const s = scaleForY(H, py, horY) * (lane.baseS/scaleForY(H, ccy, horY)) * (0.92 + rng()*0.14);
      const depth = clamp01((py - horY)/(H*0.99 - horY));       // 0 far .. 1 near
      // ink + scale BOTH fall off toward the horizon -> distant ships fade
      const hull = Math.round(lerp(2.2, 6, depth));
      const sailL= Math.round(lerp(1, 3, depth));
      const furled = s < 34;                     // the smallest specks brail up & dwindle
      ships.push({
        cx:px, cy:py, s, F,
        shade:{ hull, sail:sailL },
        opt:{ furled, oars: s>70 && !furled, wake: s>58 && !furled },
        py, lane:lane.key, reversed,
      });
    }

    if (reversed) returnMark = { x:ccx, y:ccy - lane.baseS*1.0, s: lane.baseS };
  }
  ships.sort((a,b)=> a.py - b.py);   // paint far (high) -> near (low)
  const laneExits = LANES.map(l => ({ x:lerp(0.5,l.exitX,divergence)*W, y:exitY, turn:l.turn }));
  return { ships, origin, horY, laneExits, showLanes:p.showLanes, returnMark };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const { ships, origin, horY, laneExits, showLanes, returnMark } = buildFleet(W, H, st);

  // ---- SKY (lightest) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horY);
  // a low bank of cloud steps near the skyline
  g.fillStyle = inkLevel(2);
  for (let i=0;i<5;i++){ g.beginPath(); g.ellipse(W*(0.12+i*0.19), horY*(0.62+0.06*(i%2)), W*0.10, H*0.022, 0,0,7); g.fill(); }

  // ---- horizon line ----
  pen.ink(()=>{ g.moveTo(0,horY); g.lineTo(W,horY); }, 3);

  // ---- SEA band (mid-light) with wave rules that widen toward foreground ----
  g.fillStyle = inkLevel(2); g.fillRect(0,horY,W,H-horY);
  g.strokeStyle=INK; g.globalAlpha=0.28;
  for (let j=1;j<=6;j++){
    const y = horY + (H-horY)*Math.pow(j/6, 1.5);
    g.lineWidth = 1 + j*0.35;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.035){ const yy=y+Math.sin(x*0.045+j)*(2+j*0.6); x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;

  // ---- faint fanning LANE guides + divergent arrowheads at each exit ----
  if (showLanes){
    g.strokeStyle=INK; g.lineCap="round";
    for (const e of laneExits){
      const dx=e.x-origin.x, dy=e.y-origin.y, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L;
      const sx = origin.x + ux*L*0.10, sy = origin.y + uy*L*0.10;
      const tx = origin.x + ux*L*0.86, ty = origin.y + uy*L*0.86;
      g.setLineDash([3,10]); g.globalAlpha=0.42; g.lineWidth=2.4;
      g.beginPath(); g.moveTo(sx,sy); g.lineTo(tx,ty); g.stroke();
      // divergent arrowhead
      g.setLineDash([]); g.globalAlpha=0.6; g.lineWidth=3;
      const a=0.5, hl=16;
      g.beginPath();
      g.moveTo(tx,ty); g.lineTo(tx-(ux*Math.cos(a)-uy*Math.sin(a))*hl, ty-(uy*Math.cos(a)+ux*Math.sin(a))*hl);
      g.moveTo(tx,ty); g.lineTo(tx-(ux*Math.cos(-a)-uy*Math.sin(-a))*hl, ty-(uy*Math.cos(-a)+ux*Math.sin(-a))*hl);
      g.stroke();
    }
    g.setLineDash([]); g.globalAlpha=1;
  }

  // ---- the muster point (harbour mouth the fleet quit) ----
  g.strokeStyle=INK; g.globalAlpha=0.4; g.lineWidth=2;
  g.beginPath(); g.ellipse(origin.x, origin.y, W*0.07, H*0.02, 0,0,7); g.stroke();
  g.globalAlpha=1;

  // ---- the come-about arrow over the squadron that turned back ----
  if (returnMark) drawReturnArrow(g, returnMark.x, returnMark.y, returnMark.s);

  // ---- the fleet, painted far -> near ----
  for (const sh of ships) drawShip(pen, g, sh.cx, sh.cy, sh.s, sh.F, sh.shade, sh.opt);
}

export const asset = {
  id:"ensemble.divided-achaean-fleet",
  type:"ENSEMBLE",
  name:"Divided Achaean fleet",
  statusWord:"SCATTERING",
  scene:"OD-B03-S03",

  params,
  // ONE separable ship template, instanced per lane across depth
  member:{ template:"drawShip", lanes:LANES.map(l=>l.key) },
  // back -> front draw order the ensemble honors
  layers:["sky","horizon","sea","lane-guides","muster","return-arrow","fleet"],
  // normalized 0..1 anchors: the muster origin + each lane's horizon vanishing pole
  anchors:{
    "muster:harbour":{x:.50,y:.98},
    "lane:vanguard":{x:.15,y:.45}, "lane:main-body":{x:.39,y:.45},
    "lane:starboard":{x:.80,y:.45}, "lane:returning":{x:.60,y:.45},
    "horizon:center":{x:.50,y:.40},
    "camera:wide":{x:.50,y:.55},
  },
  // open sea region for scene placement / pathing
  zones:{ sea:{ x0:.02,y0:.42,x1:.98,y1:.98 } },
  channels:["formation","divergence","progress","spread","turnBack"],
  states:{
    initial:"diverging",
    nodes:{
      // still one armada, massed in a single column heading out
      united:      { preview:{ formation:"united",       divergence:0.0, progress:0.62, turnBack:0.0, status:"MASSED" } },
      // the lanes fan apart — squadrons separating (the reusable hero view)
      diverging:   { preview:{ formation:"diverging",    divergence:1.0, progress:0.80, turnBack:0.0, status:"SEPARATING" } },
      // one squadron has come about while the rest run on
      "turning-back":{ preview:{ formation:"turning-back", divergence:1.0, progress:0.82, turnBack:1.0, status:"TURNING BACK" } },
      // the heads dwindle to pale specks along every lane
      vanishing:   { preview:{ formation:"vanishing",     divergence:1.0, progress:1.0,  turnBack:1.0, status:"VANISHING" } },
    },
    edges:[
      ["united","diverging"],["diverging","turning-back"],
      ["turning-back","vanishing"],["diverging","vanishing"],
    ],
  },

  // neutral preview = the fleet caught mid-division: lanes fanned, one squadron turned
  preview:()=>({ formation:"diverging", divergence:1.0, progress:0.82, spread:1.0, turnBack:1.0, status:"SCATTERING", progress:0.82 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
