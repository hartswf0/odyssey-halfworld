/* set_piece.sea-route-map — a diagrammatic dispersal MAP of the Achaean fleet.
   SET_PIECE. Nestor's account of the voyage home from Troy: six labeled nodes
   — TROY, TENEDOS, CHIOS, EUBOEA, ARGOS, PYLOS — wired by branching sea-route
   legs that LIGHT UP in sequence (marching-dash flow + a travelling pip).
   Drawn as an EMPTY separable chart component in SOLID grays + hard contour;
   the engine dotify pass supplies the halftone. Declares placement anchors,
   collision boundaries (node footprints), a depth layer, and alternate states
   (branches lighting: gathering / dispersing / homeward).
   Atlas: OD-B03-S03 — nodes connected by animated route branches. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

/* normalized chart coordinates (0..1) — anchors + draw share these.
   Laid out as a fan opening from Troy (NE) toward mainland Greece (SW). */
const PT = {
  troy:   { x:0.82, y:0.15 },   // origin — the sacked city, all routes begin here
  tenedos:{ x:0.70, y:0.31 },   // muster island — the fleet quarrels and splits
  chios:  { x:0.73, y:0.55 },   // the coastal branch, hugging Asia Minor
  euboea: { x:0.42, y:0.47 },   // the open-sea crossing rejoins here (Geraestus)
  argos:  { x:0.26, y:0.67 },   // Diomedes' landfall
  pylos:  { x:0.15, y:0.84 },   // Nestor's home port — the last leg
};

/* route legs (branch tree). order = lighting sequence; each is lit when its
   order index < state.lit. curve = quadratic control offset (fraction of W/H). */
const BRANCH = [
  { from:"troy",    to:"tenedos", order:0, curve:{ x: 0.03, y:-0.02 } }, // trunk
  { from:"tenedos", to:"chios",   order:1, curve:{ x: 0.05, y: 0.00 } }, // coastal
  { from:"tenedos", to:"euboea",  order:2, curve:{ x:-0.02, y:-0.08 } }, // open-sea fork
  { from:"chios",   to:"euboea",  order:3, curve:{ x: 0.00, y: 0.10 } }, // rejoin
  { from:"euboea",  to:"argos",   order:4, curve:{ x:-0.05, y:-0.01 } }, // to the Argolid
  { from:"euboea",  to:"pylos",   order:5, curve:{ x: 0.06, y:-0.02 } }, // Nestor peels off
];

/* which node is the "origin" (filled diamond) vs a ring port */
const params = {
  frame:true,           // chart border
  graticule:true,       // faint projection ruling
  seaLevel:1,           // sea fill ink level (lightest)
  nodeR:0.046,          // node ring radius (fraction of W)
  march:[16,14],        // marching-dash pattern on lit legs
  dashSpeed:34,         // px/sec the beads travel
  pipSpeed:0.42,        // laps/sec the travelling pip runs the active leg
};

/* ---- offscreen text helpers (drawn into the source; dotified later) ---- */
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

/* per-node caption-plate offset (dx,dy in fraction of W/H) + text anchor side */
const LABELOFF = {
  troy:   { dx: 0.00, dy:-0.090 },
  tenedos:{ dx: 0.01, dy:-0.105 },
  chios:  { dx: 0.02, dy:-0.105 },
  euboea: { dx: 0.00, dy:-0.110 },
  argos:  { dx:-0.02, dy:-0.105 },
  pylos:  { dx: 0.03, dy:-0.105 },
};

function nodePlate(pen, g, W, H, key, cx, cy, R){
  const label = key.toUpperCase();
  const size = W*0.036, track = W*0.005;
  const tw = trackedWidth(g, label, size, track);
  const off = LABELOFF[key] || { dx:0.06, dy:0 };
  let px = cx + off.dx*W - tw/2 - W*0.018;
  let py = cy + off.dy*H - size*0.75;
  const pw = tw + W*0.036, ph = size*1.5;
  pen.paint(()=>{ g.rect(px, py, pw, ph); }, toneSolid(inkLevel(1)), 3);
  tracked(g, label, px + W*0.018, py + ph/2, size, track, INK);
}

/* a bullseye port marker; origin (troy) is a filled diamond instead */
function nodeMark(pen, g, cx, cy, R, isOrigin){
  if (isOrigin){
    // filled diamond — the point of departure
    pen.paint(()=>{
      g.moveTo(cx, cy-R); g.lineTo(cx+R, cy); g.lineTo(cx, cy+R); g.lineTo(cx-R, cy); g.closePath();
    }, toneSolid(inkLevel(6)), 6);
    g.fillStyle=inkLevel(0); g.beginPath(); g.arc(cx, cy, R*0.30, 0, 7); g.fill();
    return;
  }
  pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(2)), 6);
  pen.paint(()=>{ g.arc(cx, cy, R*0.60, 0, 7); }, toneSolid(inkLevel(4)), 4);
  g.fillStyle=inkLevel(7); g.beginPath(); g.arc(cx, cy, R*0.26, 0, 7); g.fill();
}

function drawMap(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["sea","graticule","frame","branches","pip","nodes","labels"];
  const has = l => layers.includes(l);
  const t = st.t || 0;
  const lit = (st.lit ?? BRANCH.length);   // how many legs are lit, in order

  // pixel-space node table
  const P = {};
  for (const k in PT) P[k] = { x:PT[k].x*W, y:PT[k].y*H };
  const R = W*params.nodeR;

  // ---- SEA field (lightest tone -> reads as open water) ----
  if (has("sea")){
    g.fillStyle=inkLevel(params.seaLevel); g.fillRect(0,0,W,H);
    // diagrammatic land blobs so the chart isn't empty
    g.fillStyle=inkLevel(2);
    g.beginPath(); g.ellipse(W*0.86, H*0.14, W*0.14, H*0.09, -0.3, 0, 7); g.fill();  // Troad
    g.beginPath(); g.ellipse(W*0.80, H*0.56, W*0.09, H*0.14,  0.1, 0, 7); g.fill();  // Asia coast
    g.beginPath(); g.ellipse(W*0.22, H*0.74, W*0.20, H*0.13, -0.2, 0, 7); g.fill();  // Peloponnese
    g.beginPath(); g.ellipse(W*0.44, H*0.49, W*0.07, H*0.05,  0.4, 0, 7); g.fill();  // Euboea isle
  }

  // ---- GRATICULE: faint ruled projection grid ----
  if (has("graticule") && params.graticule){
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.26; g.lineWidth=2;
    for(let i=1;i<7;i++){ const x=W*i/7; g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }
    for(let j=1;j<9;j++){ const y=H*j/9; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.restore();
  }

  // ---- CHART FRAME ----
  if (has("frame") && params.frame){
    pen.ink(()=>{ g.rect(W*0.05, H*0.05, W*0.90, H*0.90); }, 5);
  }

  // ---- BRANCHES: the route legs, lighting in sequence ----
  let activeLeg = null;
  if (has("branches")){
    for (const b of BRANCH){
      const a=P[b.from], c=P[b.to];
      const mx=(a.x+c.x)/2 + b.curve.x*W, my=(a.y+c.y)/2 + b.curve.y*H;
      const isLit = b.order < lit;
      g.save(); g.lineCap="round"; g.lineJoin="round";
      if (isLit){
        // dark trunk
        g.strokeStyle=INK; g.globalAlpha=1; g.lineWidth=9; g.setLineDash([]);
        g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,c.x,c.y); g.stroke();
        // marching beads flowing along the leg (paper-light gaps => motion read)
        g.strokeStyle=inkLevel(1); g.lineWidth=5;
        g.setLineDash(params.march); g.lineDashOffset = -t*params.dashSpeed;
        g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,c.x,c.y); g.stroke();
        g.setLineDash([]);
        activeLeg = b;  // the last-lit leg is the one the pip rides
      } else {
        // dormant leg — faint dotted survey line
        g.strokeStyle=INK; g.globalAlpha=0.30; g.lineWidth=3;
        g.setLineDash([4,10]);
        g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,c.x,c.y); g.stroke();
        g.setLineDash([]);
      }
      g.restore();
    }
  }

  // ---- TRAVELLING PIP on the active (last-lit) leg ----
  if (has("pip") && activeLeg){
    const u = (t*params.pipSpeed) % 1;
    const a=P[activeLeg.from], c=P[activeLeg.to];
    const mx=(a.x+c.x)/2 + activeLeg.curve.x*W, my=(a.y+c.y)/2 + activeLeg.curve.y*H;
    const px=lerp(lerp(a.x,mx,u), lerp(mx,c.x,u), u);
    const py=lerp(lerp(a.y,my,u), lerp(my,c.y,u), u);
    const s=W*0.020;
    // little wake ring + solid pip
    pen.paint(()=>{ g.arc(px,py,s*1.4,0,7); }, toneSolid(inkLevel(1)), 3);
    g.fillStyle=inkLevel(7); g.beginPath(); g.arc(px,py,s*0.7,0,7); g.fill();
  }

  // ---- NODES: the six labelled ports ----
  if (has("nodes")){
    for (const k in PT) nodeMark(pen, g, P[k].x, P[k].y, R, k==="troy");
  }

  // ---- LABELS: caption plates ----
  if (has("labels")){
    for (const k in PT) nodePlate(pen, g, W, H, k, P[k].x, P[k].y, R);
  }
}

export const asset = {
  id:"set_piece.sea-route-map",
  type:"SET_PIECE",
  name:"Sea-route map",
  statusWord:"CHARTED",
  scene:"OD-B03-S03",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude
  layers:["sea","graticule","frame","branches","pip","nodes","labels"],
  // normalized 0..1 placement / camera anchors (node positions + camera)
  anchors:{
    "node:troy":    PT.troy,
    "node:tenedos": PT.tenedos,
    "node:chios":   PT.chios,
    "node:euboea":  PT.euboea,
    "node:argos":   PT.argos,
    "node:pylos":   PT.pylos,
    "fork:tenedos": { x:0.56, y:0.39 },  // where the open-sea branch diverges
    "camera:wide":  { x:0.50, y:0.50 },
  },
  // collision boundaries — node footprints on the chart (normalized boxes)
  zones:{
    troy:    { x0:PT.troy.x-0.06,    y0:PT.troy.y-0.10,    x1:PT.troy.x+0.06,    y1:PT.troy.y+0.06 },
    tenedos: { x0:PT.tenedos.x-0.06, y0:PT.tenedos.y-0.06, x1:PT.tenedos.x+0.10, y1:PT.tenedos.y+0.06 },
    chios:   { x0:PT.chios.x-0.06,   y0:PT.chios.y-0.06,   x1:PT.chios.x+0.10,   y1:PT.chios.y+0.06 },
    euboea:  { x0:PT.euboea.x-0.10,  y0:PT.euboea.y-0.10,  x1:PT.euboea.x+0.06,  y1:PT.euboea.y+0.06 },
    argos:   { x0:PT.argos.x-0.10,   y0:PT.argos.y-0.06,   x1:PT.argos.x+0.06,   y1:PT.argos.y+0.06 },
    pylos:   { x0:PT.pylos.x-0.06,   y0:PT.pylos.y-0.06,   x1:PT.pylos.x+0.06,   y1:PT.pylos.y+0.10 },
    chart:   { x0:0.05, y0:0.05, x1:0.95, y1:0.95 },
  },
  states:{
    initial:"charted",
    nodes:{
      // fleet still mustered — only the trunk to Tenedos lit
      gathering:{ preview:{ layers:["sea","graticule","frame","branches","nodes","labels"], lit:1, status:"GATHERING", progress:.18 } },
      // the quarrel: branches fan out, legs light one by one
      dispersing:{ preview:{ layers:["sea","graticule","frame","branches","pip","nodes","labels"], lit:4, status:"DISPERSING", progress:.55 } },
      // full route drawn — every leg to Argos and Pylos alight
      charted:{ preview:{ layers:["sea","graticule","frame","branches","pip","nodes","labels"], lit:6, status:"CHARTED", progress:.9 } },
    },
    edges:[["gathering","dispersing"],["dispersing","charted"]],
  },
  channels:["reveal","branchLight","dashFlow","pipTravel"],

  preview:()=>({
    layers:["sea","graticule","frame","branches","pip","nodes","labels"],
    lit:6, t:1.1, status:"CHARTED", progress:.9,
  }),
  draw(ctx,W,H,state){ drawMap(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
