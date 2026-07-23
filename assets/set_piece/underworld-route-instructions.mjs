/* set_piece.underworld-route-instructions — Circe's diagrammatic route to the dead.
   SET_PIECE. The sailing-directions Circe gives Odysseus in Book 11, drawn as a
   dark navigation chart: the encircling river OCEAN's edge (the landing shore),
   PERSEPHONE's grove of poplars and willows, the MEETING of the three rivers
   (Acheron / Cocytus / Phlegethon converging on a rock), a ritual TRENCH location
   marker, and a dashed RETURN path back to the ship. Labeled nodes + a dashed
   descent route that lights in sequence (marching-dash flow + a travelling pip).
   Drawn as an EMPTY separable chart component in SOLID grays + hard contour; the
   engine dotify pass supplies the halftone. Declares placement anchors, collision
   boundaries (node footprints), a depth layer, and alternate states.
   Atlas: OD-B10-S08 — Ocean, grove, meeting rivers, trench, return as an animated map. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* normalized chart coordinates (0..1) — anchors + draw share these.
   Laid out as a DESCENT: land on Ocean (top-left) and work down and inward to
   the rivers' meeting and the trench dug beside it. */
const PT = {
  ocean:  { x:0.19, y:0.20 },   // origin — the ship beached on Ocean's stream
  grove:  { x:0.45, y:0.37 },   // Persephone's grove of tall poplars + shedding willows
  rivers: { x:0.70, y:0.56 },   // the ROCK where Acheron / Cocytus / Phlegethon meet
  trench: { x:0.61, y:0.79 },   // the ritual trench, dug a cubit each way beside the meeting
};

/* the three infernal rivers — source points that FLOW INTO the meeting rock.
   drawn as wavy tributaries (decor geometry, not walking legs). */
const RIVER = {
  acheron:    { x:0.34, y:0.62, amp:0.028, waves:3 },   // river of woe, from the west
  cocytus:    { x:0.72, y:0.95, amp:0.024, waves:4 },   // river of wailing, up from below
  phlegethon: { x:0.93, y:0.44, amp:0.030, waves:3 },   // river of fire, from the east
};

/* walking route legs (the descent). order = lighting sequence; a leg is lit when
   its order index < state.lit. curve = quadratic control offset (fraction of W/H). */
const BRANCH = [
  { from:"ocean",  to:"grove",  order:0, curve:{ x: 0.02, y:-0.06 } }, // landfall -> grove
  { from:"grove",  to:"rivers", order:1, curve:{ x: 0.06, y:-0.02 } }, // grove -> the meeting
  { from:"rivers", to:"trench", order:2, curve:{ x: 0.05, y: 0.00 } }, // meeting -> dig here
];
/* the RETURN path — a separate sweeping leg back to the ship (lit in the last state). */
const RETURN = { from:"trench", to:"ocean", curve:{ x:-0.24, y:-0.02 } };

const params = {
  frame:true,           // chart border
  graticule:true,       // faint projection ruling
  groundLevel:2,        // underworld ground fill ink level (dark but legible)
  oceanLevel:1,         // Ocean water fill (lightest)
  nodeR:0.045,          // node ring radius (fraction of W)
  march:[16,14],        // marching-dash pattern on lit legs
  dashSpeed:34,         // px/sec the beads travel
  pipSpeed:0.40,        // laps/sec the travelling pip runs the active leg
  depthLayer:"midground",
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

/* per-node caption-plate offset (dx,dy in fraction of W/H) */
const LABELOFF = {
  ocean:  { dx: 0.00, dy:-0.100 },
  grove:  { dx:-0.20, dy:-0.005 },   // to the left, clear of the tree crowns
  rivers: { dx: 0.02, dy:-0.130 },
  trench: { dx: 0.00, dy: 0.105 },
};
const NODELABEL = { ocean:"OCEAN", grove:"GROVE", rivers:"RIVERS MEET", trench:"TRENCH" };

function nodePlate(pen, g, W, H, key, cx, cy){
  const label = NODELABEL[key] || key.toUpperCase();
  const size = W*0.034, track = W*0.004;
  const tw = trackedWidth(g, label, size, track);
  const off = LABELOFF[key] || { dx:0.06, dy:0 };
  const px = cx + off.dx*W - tw/2 - W*0.016;
  const py = cy + off.dy*H - size*0.75;
  const pw = tw + W*0.032, ph = size*1.5;
  pen.paint(()=>{ g.rect(px, py, pw, ph); }, toneSolid(inkLevel(1)), 3);
  tracked(g, label, px + W*0.016, py + ph/2, size, track, INK);
}

/* build a wavy river path from a source point to the meeting rock */
function riverPath(g, ax, ay, bx, by, amp, waves){
  const dx=bx-ax, dy=by-ay, len=Math.hypot(dx,dy)||1;
  const nx=-dy/len, ny=dx/len;             // unit normal for the meander
  const N=44;
  g.beginPath();
  for(let i=0;i<=N;i++){
    const u=i/N;
    const env=Math.sin(u*Math.PI);         // taper to zero at both ends
    const s=Math.sin(u*Math.PI*waves)*amp*env;
    const x=lerp(ax,bx,u)+nx*s*g.__W, y=lerp(ay,by,u)+ny*s*g.__H;
    if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
  }
}

/* a bullseye node marker; origin (ocean) is a filled diamond */
function nodeMark(pen, g, cx, cy, R, isOrigin){
  if (isOrigin){
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

/* Persephone's grove — a cluster of tall poplars + a drooping willow */
function drawGrove(pen, g, cx, cy, W, H){
  const poplar=(x,base,h,w)=>{
    pen.paint(()=>{                              // trunk
      g.rect(x-w*0.16, base-h*0.28, w*0.32, h*0.28);
    }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{                              // tall spindle crown
      g.moveTo(x, base-h);
      g.quadraticCurveTo(x+w*0.55, base-h*0.5, x+w*0.18, base-h*0.28);
      g.lineTo(x-w*0.18, base-h*0.28);
      g.quadraticCurveTo(x-w*0.55, base-h*0.5, x, base-h);
    }, toneSolid(inkLevel(4)), 4);
  };
  const base=cy+H*0.02;
  poplar(cx-W*0.055, base,        H*0.20, W*0.06);
  poplar(cx+W*0.005, base-H*0.01, H*0.24, W*0.065);
  poplar(cx+W*0.060, base+H*0.005,H*0.18, W*0.055);
  // a shedding willow — a low rounded crown with drooping fronds, seated among the poplars
  const wx=cx+W*0.085, wb=base-H*0.005;
  pen.paint(()=>{ g.rect(wx-W*0.008, wb-H*0.10, W*0.016, H*0.10); }, toneSolid(inkLevel(5)), 3);
  pen.paint(()=>{ g.ellipse(wx, wb-H*0.10, W*0.042, H*0.036, 0,0,7); }, toneSolid(inkLevel(4)), 4);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
  for(let i=-2;i<=2;i++){ g.beginPath(); g.moveTo(wx+i*W*0.011, wb-H*0.095); g.lineTo(wx+i*W*0.013, wb-H*0.02); g.stroke(); }
  g.globalAlpha=1;
}

/* the ritual trench marker — a dark slot dug beside the rock; fills with blood */
function drawTrench(pen, g, cx, cy, W, H, blood){
  const tw=W*0.11, th=H*0.055;
  // outer trench lip
  pen.paint(()=>{ g.rect(cx-tw/2, cy-th/2, tw, th); }, toneSolid(inkLevel(3)), 5);
  // inner pit — darkens with the blood offering
  const lvl = Math.round(lerp(4,7,clamp(blood,0,1)));
  pen.paint(()=>{ g.rect(cx-tw*0.40, cy-th*0.32, tw*0.80, th*0.64); }, toneSolid(inkLevel(lvl)), 3);
  // cross-hatch survey ticks around the lip
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.7;
  for(let i=0;i<5;i++){ const x=cx-tw*0.4+i*(tw*0.8/4);
    g.beginPath(); g.moveTo(x, cy-th*0.5); g.lineTo(x, cy-th*0.36); g.stroke();
    g.beginPath(); g.moveTo(x, cy+th*0.36); g.lineTo(x, cy+th*0.5); g.stroke(); }
  g.globalAlpha=1;
  // a small blue ritual pin above the trench (the one accent inside the field)
  g.fillStyle=ACCENT; g.beginPath();
  g.moveTo(cx, cy-th*0.5-H*0.03); g.lineTo(cx+W*0.012, cy-th*0.5-H*0.008);
  g.lineTo(cx-W*0.012, cy-th*0.5-H*0.008); g.closePath(); g.fill();
}

function drawMap(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx; g.__W=W; g.__H=H;
  const layers = st.layers || ["ground","ocean","graticule","frame","rivers","route","return","pip","grove","trench","nodes","labels"];
  const has = l => layers.includes(l);
  const t = st.t || 0;
  const lit = (st.lit ?? BRANCH.length);
  const showReturn = st.showReturn ?? (lit >= BRANCH.length);
  const blood = st.blood ?? 0;

  // pixel-space node table
  const P = {};
  for (const k in PT) P[k] = { x:PT[k].x*W, y:PT[k].y*H };
  const R = W*params.nodeR;

  // ---- GROUND: the underworld field (dark but legible, not a black blob) ----
  if (has("ground")){
    g.fillStyle=inkLevel(params.groundLevel); g.fillRect(0,0,W,H);
  }

  // ---- OCEAN's edge: the encircling stream along the top + left margin ----
  if (has("ocean")){
    pen.paint(()=>{ g.rect(0,0,W,H*0.13); }, toneSolid(inkLevel(params.oceanLevel)), 0);
    pen.paint(()=>{ g.rect(0,0,W*0.10,H); }, toneSolid(inkLevel(params.oceanLevel)), 0);
    // wave hatch on the water
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let r=0;r<3;r++){ const y=H*0.03+r*H*0.035;
      g.beginPath();
      for(let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x/W*10+r)*H*0.006; if(x===0)g.moveTo(x,yy); else g.lineTo(x,yy); }
      g.stroke(); }
    for(let c=0;c<3;c++){ const x=W*0.02+c*W*0.028;
      g.beginPath();
      for(let y=H*0.14;y<=H;y+=H*0.03){ const xx=x+Math.sin(y/H*10+c)*W*0.005; if(y<=H*0.14)g.moveTo(xx,y); else g.lineTo(xx,y); }
      g.stroke(); }
    g.globalAlpha=1;
    // inner shore contour
    pen.ink(()=>{ g.moveTo(W*0.10,H*0.13); g.lineTo(W,H*0.13); }, 3);
    pen.ink(()=>{ g.moveTo(W*0.10,H*0.13); g.lineTo(W*0.10,H); }, 3);
  }

  // ---- GRATICULE ----
  if (has("graticule") && params.graticule){
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.20; g.lineWidth=2;
    for(let i=1;i<7;i++){ const x=W*i/7; g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }
    for(let j=1;j<9;j++){ const y=H*j/9; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.restore();
  }

  // ---- CHART FRAME ----
  if (has("frame") && params.frame){
    pen.ink(()=>{ g.rect(W*0.05, H*0.05, W*0.90, H*0.90); }, 5);
  }

  // ---- RIVERS: the three tributaries converging on the meeting rock ----
  if (has("rivers")){
    const rock=P.rivers;
    for (const k in RIVER){
      const s=RIVER[k];
      // dark river channel (thick so the three-way meeting reads at a glance)
      g.save(); g.lineCap="round"; g.lineJoin="round";
      g.strokeStyle=INK; g.lineWidth=13;
      riverPath(g, s.x, s.y, rock.x/W, rock.y/H, s.amp, s.waves); g.stroke();
      // mid-grey body inside the channel banks
      g.strokeStyle=inkLevel(3); g.lineWidth=7;
      riverPath(g, s.x, s.y, rock.x/W, rock.y/H, s.amp, s.waves); g.stroke();
      // light flow beads travelling toward the rock (Phlegethon runs faster/fiery)
      const spd = k==="phlegethon" ? 46 : 26;
      g.strokeStyle=inkLevel(1); g.lineWidth=4; g.setLineDash([9,13]); g.lineDashOffset=-t*spd;
      riverPath(g, s.x, s.y, rock.x/W, rock.y/H, s.amp, s.waves); g.stroke();
      g.setLineDash([]); g.restore();
    }
    // the meeting ROCK — a solid dark mass where the three rivers converge
    pen.paint(()=>{ g.ellipse(rock.x, rock.y, R*1.9, R*1.35, 0.15, 0, 7); }, toneSolid(inkLevel(5)), 6);
    pen.paint(()=>{ g.ellipse(rock.x, rock.y, R*1.0, R*0.75, 0.15, 0, 7); }, toneSolid(inkLevel(6)), 3);
  }

  // ---- WALKING ROUTE: descent legs lighting in sequence ----
  let activeLeg = null;
  if (has("route")){
    for (const b of BRANCH){
      const a=P[b.from], c=P[b.to];
      const mx=(a.x+c.x)/2 + b.curve.x*W, my=(a.y+c.y)/2 + b.curve.y*H;
      const isLit = b.order < lit;
      g.save(); g.lineCap="round"; g.lineJoin="round";
      if (isLit){
        g.strokeStyle=INK; g.lineWidth=9; g.setLineDash([]);
        g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,c.x,c.y); g.stroke();
        g.strokeStyle=inkLevel(1); g.lineWidth=5;
        g.setLineDash(params.march); g.lineDashOffset=-t*params.dashSpeed;
        g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,c.x,c.y); g.stroke();
        g.setLineDash([]);
        activeLeg=b;
      } else {
        g.strokeStyle=INK; g.globalAlpha=0.30; g.lineWidth=3; g.setLineDash([4,10]);
        g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,c.x,c.y); g.stroke();
        g.setLineDash([]);
      }
      g.restore();
    }
  }

  // ---- RETURN path: sweeping dashed arrow back to the ship ----
  if (has("return")){
    const a=P[RETURN.from], c=P[RETURN.to];
    const mx=(a.x+c.x)/2 + RETURN.curve.x*W, my=(a.y+c.y)/2 + RETURN.curve.y*H;
    g.save(); g.lineCap="round"; g.lineJoin="round";
    g.strokeStyle=INK; g.globalAlpha = showReturn?0.9:0.28; g.lineWidth=showReturn?6:3;
    g.setLineDash(showReturn?[18,12]:[3,11]); g.lineDashOffset = showReturn? t*params.dashSpeed : 0;
    g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,c.x,c.y); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
    if (showReturn){ // arrowhead into the ocean node
      const u=0.90, ex=lerp(lerp(a.x,mx,u),lerp(mx,c.x,u),u), ey=lerp(lerp(a.y,my,u),lerp(my,c.y,u),u);
      const ang=Math.atan2(c.y-ey, c.x-ex), s=W*0.026;
      g.fillStyle=INK; g.beginPath();
      g.moveTo(c.x,c.y);
      g.lineTo(c.x-s*Math.cos(ang-0.4), c.y-s*Math.sin(ang-0.4));
      g.lineTo(c.x-s*Math.cos(ang+0.4), c.y-s*Math.sin(ang+0.4));
      g.closePath(); g.fill();
    }
    g.restore();
  }

  // ---- TRAVELLING PIP on the active descent leg ----
  if (has("pip") && activeLeg){
    const u=(t*params.pipSpeed)%1;
    const a=P[activeLeg.from], c=P[activeLeg.to];
    const mx=(a.x+c.x)/2 + activeLeg.curve.x*W, my=(a.y+c.y)/2 + activeLeg.curve.y*H;
    const px=lerp(lerp(a.x,mx,u),lerp(mx,c.x,u),u), py=lerp(lerp(a.y,my,u),lerp(my,c.y,u),u);
    const s=W*0.020;
    pen.paint(()=>{ g.arc(px,py,s*1.4,0,7); }, toneSolid(inkLevel(1)), 3);
    g.fillStyle=inkLevel(7); g.beginPath(); g.arc(px,py,s*0.7,0,7); g.fill();
  }

  // ---- GROVE geometry (trees at the grove node) ----
  if (has("grove")){
    drawGrove(pen, g, P.grove.x, P.grove.y, W, H);
  }

  // ---- TRENCH marker ----
  if (has("trench")){
    drawTrench(pen, g, P.trench.x, P.trench.y, W, H, blood);
  }

  // ---- NODES ----
  if (has("nodes")){
    for (const k in PT) nodeMark(pen, g, P[k].x, P[k].y, R, k==="ocean");
  }

  // ---- LABELS: node caption plates + river names ----
  if (has("labels")){
    for (const k in PT) nodePlate(pen, g, W, H, k, P[k].x, P[k].y);
    // river name tags near each source (hand-placed so none collide with node plates)
    const rlab={ acheron:"ACHERON", cocytus:"COCYTUS", phlegethon:"PHLEGETHON" };
    const rloc={
      acheron:    { x:0.15, y:0.66 },   // to the left of its western source
      cocytus:    { x:0.66, y:0.965 },  // just under its source, up from below
      phlegethon: { x:0.80, y:0.31 },   // up toward its eastern source, clear of the grove
    };
    for (const k in RIVER){
      const size=W*0.026, track=W*0.003;
      const tw=trackedWidth(g, rlab[k], size, track);
      const lx=rloc[k].x*W, ly=rloc[k].y*H;
      pen.paint(()=>{ g.rect(lx-W*0.008, ly-size*0.8, tw+W*0.016, size*1.5); }, toneSolid(inkLevel(1)), 2);
      tracked(g, rlab[k], lx, ly+size*0.05, size, track, INK);
    }
  }
}

export const asset = {
  id:"set_piece.underworld-route-instructions",
  type:"SET_PIECE",
  name:"Underworld route instructions",
  statusWord:"CHARTED",
  scene:"OD-B10-S08",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude
  layers:["ground","ocean","graticule","frame","rivers","route","return","pip","grove","trench","nodes","labels"],
  // normalized 0..1 placement / camera anchors (node positions + river mouths + camera)
  anchors:{
    "node:ocean":       PT.ocean,
    "node:grove":       PT.grove,
    "node:rivers":      PT.rivers,
    "node:trench":      PT.trench,
    "river:acheron":    { x:RIVER.acheron.x,    y:RIVER.acheron.y },
    "river:cocytus":    { x:RIVER.cocytus.x,    y:RIVER.cocytus.y },
    "river:phlegethon": { x:RIVER.phlegethon.x, y:RIVER.phlegethon.y },
    "return:midpoint":  { x:0.36, y:0.58 },
    "camera:wide":      { x:0.50, y:0.50 },
  },
  // collision boundaries — node footprints on the chart (normalized boxes)
  zones:{
    ocean:  { x0:PT.ocean.x-0.08,  y0:PT.ocean.y-0.10, x1:PT.ocean.x+0.08,  y1:PT.ocean.y+0.06 },
    grove:  { x0:PT.grove.x-0.10,  y0:PT.grove.y-0.14, x1:PT.grove.x+0.12,  y1:PT.grove.y+0.06 },
    rivers: { x0:PT.rivers.x-0.10, y0:PT.rivers.y-0.08, x1:PT.rivers.x+0.10, y1:PT.rivers.y+0.08 },
    trench: { x0:PT.trench.x-0.08, y0:PT.trench.y-0.06, x1:PT.trench.x+0.08, y1:PT.trench.y+0.10 },
    chart:  { x0:0.05, y0:0.05, x1:0.95, y1:0.95 },
  },
  // this set piece reads at midground depth in the scene stack
  depth:"midground",
  states:{
    initial:"charted",
    nodes:{
      // Circe first points across Ocean to the grove — only the first leg lit
      approach:{ preview:{ layers:["ground","ocean","graticule","frame","rivers","route","grove","nodes","labels"], lit:1, blood:0, showReturn:false, status:"APPROACH", progress:.2 } },
      // at the meeting of rivers, digging + the blood rites — trench fills
      rites:{ preview:{ layers:["ground","ocean","graticule","frame","rivers","route","pip","grove","trench","nodes","labels"], lit:3, blood:1, showReturn:false, status:"RITES", progress:.66 } },
      // the whole route drawn, return path alight back to the ship
      charted:{ preview:{ layers:["ground","ocean","graticule","frame","rivers","route","return","pip","grove","trench","nodes","labels"], lit:3, blood:0.6, showReturn:true, status:"CHARTED", progress:.92 } },
    },
    edges:[["approach","rites"],["rites","charted"],["charted","approach"]],
  },
  channels:["reveal","routeLight","dashFlow","pipTravel","riverFlow","blood","returnPath"],

  preview:()=>({
    layers:["ground","ocean","graticule","frame","rivers","route","return","pip","grove","trench","nodes","labels"],
    lit:3, t:1.2, blood:0.6, showReturn:true, status:"CHARTED", progress:.92,
  }),
  draw(ctx,W,H,state){ drawMap(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
