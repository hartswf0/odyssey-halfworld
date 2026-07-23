/* set_piece.danger-route-map — the Book-12 HAZARD CORRIDOR chart.
   SET_PIECE. Circe's sailing-directions rendered as a diagrammatic sea-corridor:
   five sequential hazard nodes wired by a dashed ship-route —
     1 SIREN MEADOW · 2 SCYLLA CLIFF · 3 CHARYBDIS FIG-TREE · 4 SUN ISLAND
   with the WANDERING ROCKS as a labelled ALTERNATE branch that forks off the
   trunk and rejoins before the Sun island. Each node carries its own hazard
   glyph (a singing siren, a six-headed cliff, a whirlpool, a rock cluster, a
   radiant sun). Drawn as an EMPTY separable chart component in SOLID grays +
   hard contour; the engine dotify pass supplies the halftone. Declares
   placement anchors, collision boundaries (node footprints), a depth layer, and
   alternate states (the strait run vs. the Wandering-Rocks run).
   Atlas: OD-B12-S02 — sequential sea corridor; Scylla/Charybdis strait threaded,
   Wandering-Rocks alternative branch. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- normalized chart coordinates (0..1); anchors + draw share these ----
   The corridor reads BOTTOM -> TOP: the ship enters low, threads the strait,
   and stands on toward the Sun island at the head of the chart. */
const PT = {
  start:    { x:0.155, y:0.905 },  // corridor mouth (ship enters)
  siren:    { x:0.290, y:0.775 },  // 1 · the Sirens' flowery meadow
  fork:     { x:0.400, y:0.640 },  // decision point — strait vs Wandering Rocks
  wandering:{ x:0.225, y:0.560 },  // ALT · the Wandering Rocks (Planctae)
  charybdis:{ x:0.415, y:0.450 },  // 3 · the whirlpool under the fig-tree
  scylla:   { x:0.640, y:0.485 },  // 2 · the six-headed cliff
  strait:   { x:0.530, y:0.468 },  // the gap threaded between the two
  rejoin:   { x:0.450, y:0.310 },  // the branches meet again
  sun:      { x:0.560, y:0.150 },  // 4 · Thrinacia, isle of Helios' cattle
};

/* main trunk legs (order = reveal sequence) and the alt branch legs */
const TRUNK = [
  { from:"start",    to:"siren"  },
  { from:"siren",    to:"fork"   },
  { from:"fork",     to:"strait" },   // into the Scylla/Charybdis strait
  { from:"strait",   to:"rejoin" },
  { from:"rejoin",   to:"sun"    },
];
const ALT = [
  { from:"fork",      to:"wandering" },
  { from:"wandering", to:"rejoin"    },
];

const params = {
  frame:true,
  graticule:true,
  seaLevel:1,          // open-water fill (lightest)
  nodeR:0.055,         // hazard-marker radius (fraction of W)
  march:[15,13],       // marching-dash pattern on the live route
  dashSpeed:30,        // px/sec the beads travel
  arrowEvery:1,        // direction chevrons per leg
};

/* ---------------- offscreen text helpers (dotified later) ---------------- */
function tracked(g, text, x, y, size, track, color){
  g.save(); g.fillStyle=color; g.textBaseline="middle";
  g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx=x; for(const ch of text){ g.fillText(ch,cx,y); cx += g.measureText(ch).width + track; }
  g.restore();
}
function trackedWidth(g, text, size, track){
  g.save(); g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let w=0; for(const ch of text){ w += g.measureText(ch).width + track; }
  g.restore(); return w - track;
}

/* caption-plate side/offset per node (dx,dy fraction of W/H) */
const LABELOFF = {
  siren:    { dx:-0.02, dy: 0.105 },
  wandering:{ dx: 0.00, dy:-0.108 },
  scylla:   { dx: 0.02, dy:-0.108 },
  charybdis:{ dx:-0.04, dy: 0.108 },
  sun:      { dx: 0.02, dy:-0.108 },
};
const LABELTEXT = {
  siren:"SIREN MEADOW", wandering:"WANDERING ROCKS",
  scylla:"SCYLLA CLIFF", charybdis:"CHARYBDIS", sun:"SUN ISLAND",
};

function nodePlate(pen, g, W, H, key, cx, cy){
  const label = LABELTEXT[key] || key.toUpperCase();
  const size = W*0.034, track = W*0.004;
  const tw = trackedWidth(g, label, size, track);
  const off = LABELOFF[key] || { dx:0.07, dy:0 };
  const pw = tw + W*0.032, ph = size*1.55;
  // keep the whole plate inside the chart frame (0.055..0.945)
  const px = clamp(cx + off.dx*W - tw/2 - W*0.016, W*0.06, W*0.94 - pw);
  const py = clamp(cy + off.dy*H - size*0.75, H*0.06, H*0.94 - ph);
  pen.paint(()=>{ g.rect(px, py, pw, ph); }, toneSolid(inkLevel(1)), 3);
  tracked(g, label, px + W*0.016, py + ph/2, size, track, INK);
}

/* ---------------- per-hazard glyphs (solid grays + ink) ---------------- */
function iconSiren(pen, g, cx, cy, r){
  // a singing siren on a flowery ledge: head + coiled body + song ripples
  g.strokeStyle=INK; g.lineWidth=Math.max(2, r*0.10); g.lineCap="round";
  // body S-curve
  g.beginPath();
  g.moveTo(cx-r*0.05, cy-r*0.55);
  g.quadraticCurveTo(cx+r*0.5, cy-r*0.1, cx-r*0.1, cy+r*0.3);
  g.quadraticCurveTo(cx-r*0.55, cy+r*0.55, cx+r*0.25, cy+r*0.62);
  g.stroke();
  // head
  g.fillStyle=inkLevel(7); g.beginPath(); g.arc(cx-r*0.05, cy-r*0.62, r*0.16, 0, 7); g.fill();
  // song ripples
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5, r*0.06);
  for(let i=1;i<=3;i++){ g.beginPath(); g.arc(cx+r*0.35, cy-r*0.35, r*0.18*i, -1.1, 0.5); g.stroke(); }
  // meadow tufts
  for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(cx+i*r*0.3, cy+r*0.7); g.lineTo(cx+i*r*0.3, cy+r*0.5); g.stroke(); }
}
function iconScylla(pen, g, cx, cy, r){
  // a six-headed cliff overhang: a dark rock mass with a row of necks
  pen.paint(()=>{
    g.moveTo(cx-r*0.7, cy+r*0.7);
    g.lineTo(cx-r*0.5, cy-r*0.15);
    g.lineTo(cx+r*0.6, cy-r*0.35);
    g.lineTo(cx+r*0.75, cy+r*0.7);
    g.closePath();
  }, toneSolid(inkLevel(5)), Math.max(3, r*0.14));
  // six little necks/heads craning down
  g.fillStyle=inkLevel(7);
  for(let i=0;i<6;i++){
    const hx = cx - r*0.42 + i*(r*0.9/5);
    const hy = cy - r*0.18 + (i%2)*r*0.10;
    g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx-r*0.05, hy+r*0.32); g.lineTo(hx+r*0.05, hy+r*0.32); g.closePath(); g.fill();
    g.beginPath(); g.arc(hx, hy, r*0.075, 0, 7); g.fill();
  }
}
function iconCharybdis(pen, g, cx, cy, r){
  // a whirlpool spiral with a small fig-tree leaning over the gulf
  g.strokeStyle=INK; g.lineWidth=Math.max(2, r*0.10); g.lineCap="round";
  g.beginPath();
  let a=0, rad=r*0.72;
  g.moveTo(cx+rad, cy+r*0.12);
  for(let s=0;s<=44;s++){ a+=0.42; rad*=0.945; g.lineTo(cx+Math.cos(a)*rad, cy+r*0.12+Math.sin(a)*rad*0.72); }
  g.stroke();
  // fig-tree above the gulf: trunk + canopy
  g.strokeStyle=INK; g.lineWidth=Math.max(2, r*0.11);
  g.beginPath(); g.moveTo(cx-r*0.05, cy-r*0.35); g.lineTo(cx-r*0.05, cy-r*0.78); g.stroke();
  pen.paint(()=>{ g.ellipse(cx-r*0.05, cy-r*0.86, r*0.34, r*0.24, 0, 0, 7); }, toneSolid(inkLevel(4)), Math.max(2, r*0.10));
}
function iconRocks(pen, g, cx, cy, r){
  // a drifting cluster of clashing rocks (the Planctae)
  const spikes = [
    { x:-0.55, h:0.55, w:0.30 }, { x:-0.10, h:0.95, w:0.34 },
    { x: 0.35, h:0.70, w:0.30 }, { x: 0.68, h:0.45, w:0.26 },
  ];
  for(const s of spikes){
    pen.paint(()=>{
      g.moveTo(cx+(s.x-s.w)*r, cy+r*0.7);
      g.lineTo(cx+s.x*r, cy+r*(0.7-s.h*1.4));
      g.lineTo(cx+(s.x+s.w)*r, cy+r*0.7);
      g.closePath();
    }, toneSolid(inkLevel(5)), Math.max(2, r*0.12));
  }
}
function iconSun(pen, g, cx, cy, r){
  // Helios' island: a radiant disc over a low pasture with grazing cattle
  g.strokeStyle=INK; g.lineWidth=Math.max(2, r*0.08); g.lineCap="round";
  for(let i=0;i<12;i++){ const a=i*Math.PI/6; g.beginPath();
    g.moveTo(cx+Math.cos(a)*r*0.52, cy-r*0.2+Math.sin(a)*r*0.52);
    g.lineTo(cx+Math.cos(a)*r*0.78, cy-r*0.2+Math.sin(a)*r*0.78); g.stroke(); }
  pen.paint(()=>{ g.arc(cx, cy-r*0.2, r*0.4, 0, 7); }, toneSolid(inkLevel(3)), Math.max(2, r*0.12));
  // two cattle marks along the low pasture
  g.fillStyle=inkLevel(6);
  for(const dx of [-0.4, 0.35]){
    g.beginPath(); g.ellipse(cx+dx*r, cy+r*0.6, r*0.16, r*0.09, 0, 0, 7); g.fill();
  }
}
const ICON = { siren:iconSiren, scylla:iconScylla, charybdis:iconCharybdis, wandering:iconRocks, sun:iconSun };

/* a hazard node: light disc + ink ring (dashed for the alternate), glyph,
   a sequence tab, drawn on top of the routing. */
function hazardNode(pen, g, W, key, cx, cy, R, { seq=null, alt=false }={}){
  // disc
  pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(1)), 5);
  // ring — solid for trunk hazards, dashed for the alternate route marker
  g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(3, R*0.14); g.lineCap="round";
  if (alt) g.setLineDash([R*0.34, R*0.26]);
  g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke(); g.restore();
  // glyph
  const fn = ICON[key]; if (fn) fn(pen, g, cx, cy, R*0.72);
  // sequence / ALT tab, upper-left of the marker
  const tx = cx - R*0.86, ty = cy - R*0.86, tr = R*0.42;
  if (alt){
    pen.paint(()=>{ g.rect(tx-tr, ty-tr*0.7, tr*2.4, tr*1.4); }, toneSolid(inkLevel(6)), 3);
    tracked(g, "ALT", tx-tr*0.72, ty, tr*0.9, tr*0.10, inkLevel(0));
  } else if (seq!=null){
    pen.paint(()=>{ g.arc(tx, ty, tr, 0, 7); }, toneSolid(inkLevel(6)), 3);
    g.save(); g.fillStyle=inkLevel(0); g.textAlign="center"; g.textBaseline="middle";
    g.font=`800 ${Math.round(tr*1.25)}px Helvetica,Arial,sans-serif`;
    g.fillText(String(seq), tx, ty+tr*0.05); g.restore();
  }
}

/* stroke one route leg; live legs get a dark trunk + marching beads, dormant
   legs a faint dotted survey line. Returns the two endpoints for pips/chevrons. */
function legPath(g, a, c){ g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(c.x,c.y); }
function drawLeg(g, a, c, { live=true, t=0, march=params.march }={}){
  g.save(); g.lineCap="round"; g.lineJoin="round";
  if (live){
    g.strokeStyle=INK; g.globalAlpha=1; g.lineWidth=8; g.setLineDash([]); legPath(g,a,c); g.stroke();
    g.strokeStyle=inkLevel(1); g.lineWidth=4; g.setLineDash(march); g.lineDashOffset=-t*params.dashSpeed;
    legPath(g,a,c); g.stroke(); g.setLineDash([]);
  } else {
    g.strokeStyle=INK; g.globalAlpha=0.32; g.lineWidth=3; g.setLineDash([4,10]);
    legPath(g,a,c); g.stroke(); g.setLineDash([]);
  }
  g.restore();
  // direction chevron at leg midpoint
  if (live){
    const mx=(a.x+c.x)/2, my=(a.y+c.y)/2;
    const dx=c.x-a.x, dy=c.y-a.y, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L, s=9;
    g.save(); g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round";
    g.beginPath();
    g.moveTo(mx-ux*s-uy*s, my-uy*s+ux*s); g.lineTo(mx, my); g.lineTo(mx-ux*s+uy*s, my-uy*s-ux*s);
    g.stroke(); g.restore();
  }
}

function drawMap(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["sea","graticule","frame","land","altroute","route","hazards","labels"];
  const has = l => layers.includes(l);
  const t = st.t || 0;
  const branch = st.branch || "both";     // "both" | "main" | "alt"
  const mainLive = branch !== "alt";
  const altLive  = branch === "alt" || branch === "both";
  const altBold  = branch === "alt";

  const P = {}; for (const k in PT) P[k] = { x:PT[k].x*W, y:PT[k].y*H };
  const R = W*params.nodeR;

  // ---- SEA field + coastal land blobs ----
  if (has("sea")){
    g.fillStyle=inkLevel(params.seaLevel); g.fillRect(0,0,W,H);
  }
  if (has("land")){
    g.fillStyle=inkLevel(2);
    // Sirens' meadow isle (lower-left), Scylla's headland (right of strait),
    // Thrinacia (the Sun island, head of chart)
    g.beginPath(); g.ellipse(P.siren.x-W*0.02, P.siren.y+H*0.01, W*0.15, H*0.08, -0.25, 0, 7); g.fill();
    g.beginPath(); g.ellipse(P.scylla.x+W*0.10, P.scylla.y, W*0.13, H*0.11, 0.20, 0, 7); g.fill();
    g.beginPath(); g.ellipse(P.sun.x, P.sun.y+H*0.01, W*0.20, H*0.10, 0.05, 0, 7); g.fill();
    // scattered rocks around the Wandering-Rocks field
    g.fillStyle=inkLevel(3);
    for(const d of [[-0.05,-0.04],[0.05,0.02],[-0.02,0.05],[0.06,-0.03]]){
      g.beginPath(); g.ellipse(P.wandering.x+d[0]*W, P.wandering.y+d[1]*H, W*0.018, H*0.014, 0, 0, 7); g.fill();
    }
  }

  // ---- GRATICULE: faint chart ruling ----
  if (has("graticule") && params.graticule){
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.24; g.lineWidth=2;
    for(let i=1;i<7;i++){ const x=W*i/7; g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }
    for(let j=1;j<9;j++){ const y=H*j/9; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.restore();
  }

  // ---- CHART FRAME ----
  if (has("frame") && params.frame){ pen.ink(()=>{ g.rect(W*0.05, H*0.05, W*0.90, H*0.90); }, 5); }

  // ---- ALTERNATE branch (Wandering Rocks) ----
  if (has("altroute")){
    for (const b of ALT) drawLeg(g, P[b.from], P[b.to], { live:altBold ? true : false, t, march:[10,10] });
    // when not the chosen path, still trace it as a dotted alternative
    if (!altBold && altLive){
      for (const b of ALT){ g.save(); g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=3;
        g.setLineDash([5,9]); g.lineDashOffset=-t*10; legPath(g,P[b.from],P[b.to]); g.stroke();
        g.setLineDash([]); g.restore(); }
    }
  }

  // ---- MAIN trunk route ----
  if (has("route")){
    for (const b of TRUNK) drawLeg(g, P[b.from], P[b.to], { live:mainLive, t });
    // travelling pip on the strait leg (the tense passage)
    if (mainLive){
      const a=P.fork, c=P.strait, u=(t*0.4)%1;
      const px=lerp(a.x,c.x,u), py=lerp(a.y,c.y,u), s=W*0.018;
      pen.paint(()=>{ g.arc(px,py,s*1.4,0,7); }, toneSolid(inkLevel(1)), 3);
      g.fillStyle=inkLevel(7); g.beginPath(); g.arc(px,py,s*0.7,0,7); g.fill();
    }
    // fork node — a small blue decision diamond
    g.save(); g.translate(P.fork.x, P.fork.y);
    g.fillStyle=ACCENT; g.beginPath();
    g.moveTo(0,-W*0.016); g.lineTo(W*0.016,0); g.lineTo(0,W*0.016); g.lineTo(-W*0.016,0); g.closePath(); g.fill();
    g.restore();
  }

  // ---- HAZARD nodes (glyph markers) ----
  if (has("hazards")){
    hazardNode(pen, g, W, "siren",     P.siren.x,     P.siren.y,     R, { seq:1 });
    hazardNode(pen, g, W, "scylla",    P.scylla.x,    P.scylla.y,    R, { seq:2 });
    hazardNode(pen, g, W, "charybdis", P.charybdis.x, P.charybdis.y, R, { seq:3 });
    hazardNode(pen, g, W, "sun",       P.sun.x,       P.sun.y,       R, { seq:4 });
    hazardNode(pen, g, W, "wandering", P.wandering.x, P.wandering.y, R, { alt:true });
  }

  // ---- LABELS: caption plates ----
  if (has("labels")){
    for (const k of ["siren","scylla","charybdis","sun","wandering"]) nodePlate(pen, g, W, H, k, P[k].x, P[k].y);
  }
}

export const asset = {
  id:"set_piece.danger-route-map",
  type:"SET_PIECE",
  name:"Danger-route map",
  statusWord:"CHARTED",
  scene:"OD-B12-S02",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude
  layers:["sea","graticule","frame","land","altroute","route","hazards","labels"],
  // normalized 0..1 placement / camera anchors (node positions + route control)
  anchors:{
    "node:siren-meadow":    PT.siren,
    "node:wandering-rocks":  PT.wandering,   // the alternate branch
    "node:scylla-cliff":     PT.scylla,
    "node:charybdis-figtree":PT.charybdis,
    "node:sun-island":       PT.sun,
    "route:mouth":           PT.start,
    "route:fork":            PT.fork,
    "route:strait":          PT.strait,      // the Scylla/Charybdis gap
    "route:rejoin":          PT.rejoin,
    "camera:wide":           { x:0.50, y:0.50 },
    "camera:strait":         { x:0.53, y:0.47 },
  },
  // collision boundaries — node footprints on the chart (normalized boxes)
  zones:{
    siren:    { x0:PT.siren.x-0.06,    y0:PT.siren.y-0.06,    x1:PT.siren.x+0.06,    y1:PT.siren.y+0.10 },
    wandering:{ x0:PT.wandering.x-0.06,y0:PT.wandering.y-0.06,x1:PT.wandering.x+0.06,y1:PT.wandering.y+0.10 },
    scylla:   { x0:PT.scylla.x-0.06,   y0:PT.scylla.y-0.10,   x1:PT.scylla.x+0.06,   y1:PT.scylla.y+0.06 },
    charybdis:{ x0:PT.charybdis.x-0.06,y0:PT.charybdis.y-0.06,x1:PT.charybdis.x+0.06,y1:PT.charybdis.y+0.10 },
    sun:      { x0:PT.sun.x-0.06,      y0:PT.sun.y-0.10,      x1:PT.sun.x+0.06,      y1:PT.sun.y+0.06 },
    strait:   { x0:0.40, y0:0.42, x1:0.66, y1:0.52 },   // the passage collision gap
    chart:    { x0:0.05, y0:0.05, x1:0.95, y1:0.95 },
  },
  // depth layer for scene compositing (chart sits as a flat mid-ground prop)
  depth:"midground",
  states:{
    initial:"charted",
    nodes:{
      // both options drawn — the alternative not yet chosen
      charted:{ preview:{ layers:["sea","graticule","frame","land","altroute","route","hazards","labels"], branch:"both", status:"CHARTED", progress:.5 } },
      // Odysseus chooses the strait: hug Scylla, lose six men, avoid Charybdis
      "strait-run":{ preview:{ layers:["sea","graticule","frame","land","altroute","route","hazards","labels"], branch:"main", status:"STRAIT RUN", progress:.7 } },
      // the untaken road: the Wandering Rocks, where no ship but Argo passed
      "rocks-run":{ preview:{ layers:["sea","graticule","frame","land","altroute","route","hazards","labels"], branch:"alt", status:"ROCKS RUN", progress:.35 } },
    },
    edges:[["charted","strait-run"],["charted","rocks-run"],["strait-run","charted"],["rocks-run","charted"]],
  },
  channels:["reveal","branch","dashFlow","pipTravel"],

  preview:()=>({
    layers:["sea","graticule","frame","land","altroute","route","hazards","labels"],
    branch:"both", t:0.9, status:"CHARTED", progress:.5,
  }),
  draw(ctx,W,H,state){ drawMap(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
