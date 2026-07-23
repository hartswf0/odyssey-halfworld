/* set_piece.ambush-avoidance-map — Telemachus' homecoming HAZARD chart (Book 15).
   SET_PIECE. A diagrammatic route map for the run from Sparta back to Ithaca:
   the SPARTA -> PYLOS chariot road, the PYLOS harbour, the island sea-route, a
   marked SAME STRAIT danger zone (the suitors' ambush ship lying off Asteris),
   and a secret EUMAEUS LANDING point on the far shore. A bold dashed SAFE ROUTE
   bows west and diverts around the danger zone to reach the landing, while the
   expected island route runs straight into the ambush X.
   Drawn as an EMPTY separable chart component in SOLID grays + hard contour;
   the engine dotify pass supplies the halftone. Declares placement anchors,
   collision boundaries (node + strait footprints), a depth layer, and alternate
   states (charted / ambush-marked / safe-plotted).
   Atlas: OD-B15-S01 — Sparta-to-Pylos road, harbour, island route, Same strait
   danger zone, Eumaeus landing point. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

/* ---- normalized chart coordinates (0..1); anchors + draw share these ----
   Reads TOP-RIGHT -> BOTTOM-LEFT: inland Sparta down the road to the Pylos
   harbour, out to sea past the islands, and home to the hidden landing. */
const PT = {
  sparta:  { x:0.795, y:0.135 },  // inland palace of Menelaus — the chariot start
  pylos:   { x:0.300, y:0.400 },  // Nestor's harbour — the ship boards here
  seagate: { x:0.335, y:0.560 },  // offshore waypoint where the island route begins
  same:    { x:0.540, y:0.705 },  // the island of Same (Samos), east side of the strait
  asteris: { x:0.400, y:0.660 },  // the islet the ambush ship hides behind
  strait:  { x:0.375, y:0.720 },  // SAME STRAIT — the marked danger zone
  ithaca:  { x:0.190, y:0.735 },  // home island, west of the strait
  safe1:   { x:0.150, y:0.560 },  // safe-route bow, standing well off the islands
  safe2:   { x:0.115, y:0.735 },  // safe-route bow, west of Ithaca
  landing: { x:0.195, y:0.875 },  // the secret Eumaeus landing on the south shore
};

/* the expected ISLAND route — straight through the strait, into the ambush */
const DANGER = [ ["pylos","seagate"], ["seagate","strait"] ];
/* the SAFE route — bows west, standing off the islands, around the danger zone */
const SAFE   = [ ["pylos","safe1"], ["safe1","safe2"], ["safe2","landing"] ];

const params = {
  frame:true,
  graticule:true,
  seaLevel:1,          // open-water fill (lightest)
  nodeR:0.050,         // marker radius (fraction of W)
  march:[16,13],       // marching-dash pattern on the live safe route
  dashSpeed:30,        // px/sec the beads travel
  strait:{ w:0.150, h:0.150 },  // danger-zone box size (fraction of W/H)
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

/* caption-plate side/offset per label (dx,dy fraction of W/H) */
const LABELOFF = {
  sparta:  { dx: 0.00, dy: 0.095 },
  pylos:   { dx: 0.00, dy:-0.100 },
  same:    { dx: 0.02, dy: 0.098 },
  ithaca:  { dx:-0.02, dy:-0.100 },
  strait:  { dx: 0.10, dy:-0.005 },
  landing: { dx: 0.00, dy: 0.092 },
};
const LABELTEXT = {
  sparta:"SPARTA", pylos:"PYLOS HARBOUR", same:"SAME I.",
  ithaca:"ITHACA", strait:"SAME STRAIT", landing:"EUMAEUS LANDING",
};

function labelPlate(pen, g, W, H, key, cx, cy, accent=false){
  const label = LABELTEXT[key] || key.toUpperCase();
  const size = W*0.032, track = W*0.004;
  const tw = trackedWidth(g, label, size, track);
  const off = LABELOFF[key] || { dx:0.07, dy:0 };
  const pw = tw + W*0.030, ph = size*1.55;
  const px = clamp(cx + off.dx*W - tw/2 - W*0.015, W*0.06, W*0.94 - pw);
  const py = clamp(cy + off.dy*H - size*0.75, H*0.06, H*0.94 - ph);
  pen.paint(()=>{ g.rect(px, py, pw, ph); }, toneSolid(inkLevel(accent?6:1)), 3);
  tracked(g, label, px + W*0.015, py + ph/2, size, track, accent?inkLevel(0):INK);
}

/* ---------------- node glyphs (solid grays + ink) ---------------- */
function iconCity(pen, g, cx, cy, r){
  // Sparta: a walled palace — a low block wall with three battlemented towers
  pen.paint(()=>{ g.rect(cx-r*0.85, cy-r*0.05, r*1.70, r*0.75); }, toneSolid(inkLevel(4)), Math.max(3,r*0.10));
  for(const dx of [-0.62, 0.0, 0.62]){
    pen.paint(()=>{ g.rect(cx+dx*r-r*0.22, cy-r*0.65, r*0.44, r*0.72); }, toneSolid(inkLevel(6)), Math.max(2,r*0.10));
    // crenellation notch
    g.fillStyle=inkLevel(0); g.fillRect(cx+dx*r-r*0.05, cy-r*0.65, r*0.10, r*0.16);
  }
}
function iconHarbour(pen, g, cx, cy, r){
  // Pylos: a curved quay hugging a small basin + a moored ship (hull + mast)
  g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(3,r*0.14); g.lineCap="round";
  g.beginPath(); g.arc(cx, cy+r*0.10, r*0.78, Math.PI*0.15, Math.PI*0.95); g.stroke();  // quay arm
  g.restore();
  // moored hull
  pen.paint(()=>{
    g.moveTo(cx-r*0.45, cy-r*0.28); g.lineTo(cx+r*0.45, cy-r*0.28);
    g.quadraticCurveTo(cx+r*0.20, cy+r*0.05, cx-r*0.10, cy+r*0.05);
    g.quadraticCurveTo(cx-r*0.38, cy+r*0.05, cx-r*0.45, cy-r*0.28); g.closePath();
  }, toneSolid(inkLevel(6)), Math.max(2,r*0.10));
  // mast
  g.strokeStyle=INK; g.lineWidth=Math.max(2,r*0.09); g.beginPath();
  g.moveTo(cx, cy-r*0.28); g.lineTo(cx, cy-r*0.80); g.stroke();
}
function iconIsland(pen, g, cx, cy, r){
  // a plain domed islet marker (Same / Ithaca land-labels)
  pen.paint(()=>{ g.arc(cx, cy, r*0.5, Math.PI, 0); g.closePath(); }, toneSolid(inkLevel(5)), Math.max(2,r*0.10));
}
function iconLanding(pen, g, cx, cy, r){
  // Eumaeus landing: a beached skiff on a cove + the swineherd's hut behind it,
  // stamped with the blue objective diamond (the secret goal)
  // hut
  pen.paint(()=>{ g.rect(cx-r*0.10, cy-r*0.42, r*0.52, r*0.42); }, toneSolid(inkLevel(4)), Math.max(2,r*0.09));
  pen.paint(()=>{ g.moveTo(cx-r*0.18, cy-r*0.42); g.lineTo(cx+r*0.16, cy-r*0.78); g.lineTo(cx+r*0.50, cy-r*0.42); g.closePath(); }, toneSolid(inkLevel(6)), Math.max(2,r*0.09));
  // beached skiff (crescent hull)
  pen.paint(()=>{
    g.moveTo(cx-r*0.70, cy+r*0.20);
    g.quadraticCurveTo(cx-r*0.05, cy+r*0.62, cx+r*0.30, cy+r*0.18);
    g.quadraticCurveTo(cx-r*0.10, cy+r*0.34, cx-r*0.70, cy+r*0.20); g.closePath();
  }, toneSolid(inkLevel(5)), Math.max(2,r*0.09));
  // blue objective diamond
  g.save(); g.translate(cx-r*0.55, cy-r*0.55); g.fillStyle=ACCENT;
  g.beginPath(); g.moveTo(0,-r*0.26); g.lineTo(r*0.26,0); g.lineTo(0,r*0.26); g.lineTo(-r*0.26,0); g.closePath(); g.fill();
  g.restore();
}

/* the marked SAME STRAIT danger zone: a dashed hazard box, a lurking ambush
   ship behind Asteris, and a heavy warning X. `pulse` (0..1) thickens the X. */
function dangerZone(pen, g, W, H, cx, cy, pulse=0){
  const bw = params.strait.w*W, bh = params.strait.h*H;
  const x0 = cx-bw/2, y0 = cy-bh/2;
  // dashed hazard box
  g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(3, W*0.006); g.lineCap="round";
  g.setLineDash([W*0.022, W*0.014]);
  g.strokeRect(x0, y0, bw, bh);
  g.restore();
  // a small lurking ambush ship (hull + oars) hiding by Asteris, upper-right of box
  const sx = cx+bw*0.10, sy = cy-bh*0.14, sr = W*0.036;
  pen.paint(()=>{
    g.moveTo(sx-sr, sy); g.lineTo(sx+sr, sy);
    g.quadraticCurveTo(sx+sr*0.4, sy+sr*0.7, sx, sy+sr*0.7);
    g.quadraticCurveTo(sx-sr*0.7, sy+sr*0.7, sx-sr, sy); g.closePath();
  }, toneSolid(inkLevel(7)), Math.max(2, sr*0.16));
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5, sr*0.12); g.lineCap="round";
  for(let i=-2;i<=2;i++){ g.beginPath(); g.moveTo(sx+i*sr*0.4, sy); g.lineTo(sx+i*sr*0.4, sy-sr*0.55); g.stroke(); } // oars up
  // heavy warning X across the box
  g.save(); g.strokeStyle=INK; g.lineCap="round";
  g.lineWidth = Math.max(6, W*0.012*(1+0.35*pulse));
  const m = Math.min(bw, bh)*0.34;
  g.beginPath(); g.moveTo(cx-m, cy-m); g.lineTo(cx+m, cy+m);
                 g.moveTo(cx+m, cy-m); g.lineTo(cx-m, cy+m); g.stroke();
  g.restore();
}

/* stroke a route; live => dark trunk + marching beads + chevron; dormant => faint dotted */
function drawLeg(g, a, c, { live=true, t=0, chevron=true }={}){
  g.save(); g.lineCap="round"; g.lineJoin="round";
  if (live){
    g.strokeStyle=INK; g.globalAlpha=1; g.lineWidth=8; g.setLineDash([]);
    g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(c.x,c.y); g.stroke();
    g.strokeStyle=inkLevel(1); g.lineWidth=4; g.setLineDash(params.march); g.lineDashOffset=-t*params.dashSpeed;
    g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(c.x,c.y); g.stroke(); g.setLineDash([]);
  } else {
    g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=4; g.setLineDash([5,9]);
    g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(c.x,c.y); g.stroke(); g.setLineDash([]);
  }
  g.restore();
  if (chevron && live){
    const mx=(a.x+c.x)/2, my=(a.y+c.y)/2;
    const dx=c.x-a.x, dy=c.y-a.y, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L, s=9;
    g.save(); g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round"; g.beginPath();
    g.moveTo(mx-ux*s-uy*s, my-uy*s+ux*s); g.lineTo(mx, my); g.lineTo(mx-ux*s+uy*s, my-uy*s-ux*s);
    g.stroke(); g.restore();
  }
}

function drawMap(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["sea","land","graticule","frame","road","dangerroute","saferoute","danger","nodes","labels"];
  const has = l => layers.includes(l);
  const t = st.t || 0;
  const branch = st.branch || "both";              // "both" | "danger" | "safe"
  const safeLive   = branch !== "danger";
  const dangerBold = branch === "danger";
  const pulse = branch === "danger" ? (0.5+0.5*Math.sin(t*3)) : (branch==="both" ? 0.4 : 0.15);

  const P = {}; for (const k in PT) P[k] = { x:PT[k].x*W, y:PT[k].y*H };
  const R = W*params.nodeR;

  // ---- SEA field ----
  if (has("sea")){ g.fillStyle=inkLevel(params.seaLevel); g.fillRect(0,0,W,H); }

  // ---- LAND masses (mid tone blobs; the schematic coastline) ----
  if (has("land")){
    g.fillStyle=inkLevel(3);
    // Peloponnese mainland — core mass upper-right + a SW coastal arm to Pylos
    g.beginPath(); g.ellipse(W*0.74, H*0.24, W*0.32, H*0.24, -0.10, 0, 7); g.fill();
    g.beginPath(); g.ellipse(W*0.46, H*0.40, W*0.22, H*0.13, -0.35, 0, 7); g.fill();
    // Same island (east of strait) + Ithaca (west of strait) — lighter so the
    // black hazard box + X read crisply against them
    g.fillStyle=inkLevel(2);
    g.beginPath(); g.ellipse(P.same.x+W*0.03, P.same.y+H*0.02, W*0.15, H*0.11, 0.15, 0, 7); g.fill();
    g.beginPath(); g.ellipse(P.ithaca.x-W*0.02, P.ithaca.y+H*0.03, W*0.13, H*0.12, -0.10, 0, 7); g.fill();
    // Asteris — the little ambush islet in the strait
    g.fillStyle=inkLevel(4);
    g.beginPath(); g.ellipse(P.asteris.x, P.asteris.y, W*0.030, H*0.020, 0, 0, 7); g.fill();
    // coast outlines (hard contour reads the shoreline)
    g.save(); g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.9;
    g.beginPath(); g.ellipse(P.same.x+W*0.03, P.same.y+H*0.02, W*0.15, H*0.11, 0.15, 0, 7); g.stroke();
    g.beginPath(); g.ellipse(P.ithaca.x-W*0.02, P.ithaca.y+H*0.03, W*0.13, H*0.12, -0.10, 0, 7); g.stroke();
    g.restore();
  }

  // ---- GRATICULE: faint chart ruling ----
  if (has("graticule") && params.graticule){
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.22; g.lineWidth=2;
    for(let i=1;i<7;i++){ const x=W*i/7; g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }
    for(let j=1;j<9;j++){ const y=H*j/9; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.restore();
  }

  // ---- CHART FRAME + compass ----
  if (has("frame") && params.frame){
    pen.ink(()=>{ g.rect(W*0.05, H*0.05, W*0.90, H*0.90); }, 5);
    // compass rose (upper-left, inside frame)
    const ox=W*0.135, oy=H*0.135, cr=W*0.045;
    g.save(); g.strokeStyle=INK; g.lineWidth=2.5; g.beginPath(); g.arc(ox,oy,cr,0,7); g.stroke();
    g.fillStyle=INK;
    g.beginPath(); g.moveTo(ox,oy-cr*1.15); g.lineTo(ox-cr*0.22,oy); g.lineTo(ox+cr*0.22,oy); g.closePath(); g.fill();
    g.globalAlpha=0.5; g.beginPath(); g.moveTo(ox,oy+cr*1.15); g.lineTo(ox-cr*0.22,oy); g.lineTo(ox+cr*0.22,oy); g.closePath(); g.fill();
    g.restore();
  }

  // ---- SPARTA -> PYLOS chariot ROAD (land route: solid double line + ties) ----
  if (has("road")){
    const a=P.sparta, c=P.pylos;
    const dx=c.x-a.x, dy=c.y-a.y, L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L, off=W*0.010;
    g.save(); g.strokeStyle=INK; g.lineCap="round";
    // two parallel rails
    g.lineWidth=3.5;
    g.beginPath(); g.moveTo(a.x+nx*off,a.y+ny*off); g.lineTo(c.x+nx*off,c.y+ny*off); g.stroke();
    g.beginPath(); g.moveTo(a.x-nx*off,a.y-ny*off); g.lineTo(c.x-nx*off,c.y-ny*off); g.stroke();
    // sleeper ties
    g.lineWidth=3;
    for(let s=0.08;s<=0.92;s+=0.12){
      const mx=lerp(a.x,c.x,s), my=lerp(a.y,c.y,s);
      g.beginPath(); g.moveTo(mx+nx*off*1.7,my+ny*off*1.7); g.lineTo(mx-nx*off*1.7,my-ny*off*1.7); g.stroke();
    }
    g.restore();
  }

  // ---- expected ISLAND route (into the strait) ----
  if (has("dangerroute")){
    for (const [f,tk] of DANGER) drawLeg(g, P[f], P[tk], { live:dangerBold, t, chevron:dangerBold });
  }

  // ---- SAFE route (bows west, diverting around the danger zone) ----
  if (has("saferoute")){
    for (const [f,tk] of SAFE) drawLeg(g, P[f], P[tk], { live:safeLive, t });
    // travelling pip on the last live safe leg (nearing the secret landing)
    if (safeLive){
      const a=P.safe2, c=P.landing, u=(t*0.35)%1;
      const px=lerp(a.x,c.x,u), py=lerp(a.y,c.y,u), s=W*0.017;
      pen.paint(()=>{ g.arc(px,py,s*1.4,0,7); }, toneSolid(inkLevel(1)), 3);
      g.fillStyle=inkLevel(7); g.beginPath(); g.arc(px,py,s*0.7,0,7); g.fill();
    }
  }

  // ---- SAME STRAIT danger zone (box + ambush ship + warning X) ----
  if (has("danger")){
    dangerZone(pen, g, W, H, P.strait.x, P.strait.y, pulse);
    // "AMBUSH" tab pinned to the box
    const bw=params.strait.w*W, bh=params.strait.h*H;
    const tx=P.strait.x-bw*0.5, ty=P.strait.y+bh*0.5+H*0.006;
    const tw=trackedWidth(g,"AMBUSH",W*0.030,W*0.004), pw=tw+W*0.028, ph=W*0.030*1.5;
    pen.paint(()=>{ g.rect(tx, ty, pw, ph); }, toneSolid(inkLevel(7)), 3);
    tracked(g, "AMBUSH", tx+W*0.014, ty+ph/2, W*0.030, W*0.004, inkLevel(0));
  }

  // ---- NODE markers ----
  if (has("nodes")){
    // Sparta city
    iconCity(pen, g, P.sparta.x, P.sparta.y, R*0.95);
    // Pylos harbour on a light disc
    pen.paint(()=>{ g.arc(P.pylos.x, P.pylos.y, R*0.95, 0, 7); }, toneSolid(inkLevel(1)), 5);
    iconHarbour(pen, g, P.pylos.x, P.pylos.y, R*0.85);
    // island label markers
    iconIsland(pen, g, P.same.x, P.same.y, R);
    iconIsland(pen, g, P.ithaca.x, P.ithaca.y, R);
    // secret Eumaeus landing on a light disc
    pen.paint(()=>{ g.arc(P.landing.x, P.landing.y, R*1.02, 0, 7); }, toneSolid(inkLevel(1)), 5);
    iconLanding(pen, g, P.landing.x, P.landing.y, R*0.9);
  }

  // ---- LABELS: caption plates ----
  if (has("labels")){
    labelPlate(pen, g, W, H, "sparta",  P.sparta.x,  P.sparta.y);
    labelPlate(pen, g, W, H, "pylos",   P.pylos.x,   P.pylos.y);
    labelPlate(pen, g, W, H, "same",    P.same.x,    P.same.y);
    labelPlate(pen, g, W, H, "ithaca",  P.ithaca.x,  P.ithaca.y);
    labelPlate(pen, g, W, H, "strait",  P.strait.x,  P.strait.y);
    labelPlate(pen, g, W, H, "landing", P.landing.x, P.landing.y, true);
  }
}

export const asset = {
  id:"set_piece.ambush-avoidance-map",
  type:"SET_PIECE",
  name:"Ambush-avoidance map",
  statusWord:"CHARTED",
  scene:"OD-B15-S01",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude
  layers:["sea","land","graticule","frame","road","dangerroute","saferoute","danger","nodes","labels"],
  // normalized 0..1 placement / camera anchors (node positions + route control)
  anchors:{
    "node:sparta":          PT.sparta,
    "node:pylos-harbour":   PT.pylos,
    "node:same-island":     PT.same,
    "node:ithaca":          PT.ithaca,
    "node:eumaeus-landing": PT.landing,
    "hazard:same-strait":   PT.strait,
    "hazard:asteris":       PT.asteris,
    "route:seagate":        PT.seagate,
    "route:safe-bow-1":     PT.safe1,
    "route:safe-bow-2":     PT.safe2,
    "camera:wide":          { x:0.50, y:0.50 },
    "camera:strait":        PT.strait,
  },
  // collision boundaries — footprints on the chart (normalized boxes)
  zones:{
    sparta:  { x0:PT.sparta.x-0.07,  y0:PT.sparta.y-0.06, x1:PT.sparta.x+0.07,  y1:PT.sparta.y+0.10 },
    pylos:   { x0:PT.pylos.x-0.06,   y0:PT.pylos.y-0.10,  x1:PT.pylos.x+0.06,   y1:PT.pylos.y+0.06 },
    same:    { x0:PT.same.x-0.09,    y0:PT.same.y-0.08,   x1:PT.same.x+0.09,    y1:PT.same.y+0.10 },
    ithaca:  { x0:PT.ithaca.x-0.09,  y0:PT.ithaca.y-0.09, x1:PT.ithaca.x+0.09,  y1:PT.ithaca.y+0.06 },
    landing: { x0:PT.landing.x-0.07, y0:PT.landing.y-0.09,x1:PT.landing.x+0.07, y1:PT.landing.y+0.06 },
    // the danger-zone box — the ambush corridor to keep clear of
    "same-strait":{ x0:PT.strait.x-params.strait.w/2, y0:PT.strait.y-params.strait.h/2,
                    x1:PT.strait.x+params.strait.w/2, y1:PT.strait.y+params.strait.h/2 },
    chart:   { x0:0.05, y0:0.05, x1:0.95, y1:0.95 },
  },
  // depth layer for scene compositing (chart sits as a flat mid-ground prop)
  depth:"midground",
  states:{
    initial:"charted",
    nodes:{
      // both routes drawn — the danger noted, the choice not yet made
      charted:{ preview:{ layers:["sea","land","graticule","frame","road","dangerroute","saferoute","danger","nodes","labels"], branch:"both", status:"CHARTED", progress:.45 } },
      // Athena's warning: the strait run leads onto the ambush X
      "ambush-marked":{ preview:{ layers:["sea","land","graticule","frame","road","dangerroute","danger","nodes","labels"], branch:"danger", status:"AMBUSH AHEAD", progress:.7 } },
      // the plotted answer: the safe route bows west to the secret landing
      "safe-plotted":{ preview:{ layers:["sea","land","graticule","frame","road","saferoute","danger","nodes","labels"], branch:"safe", status:"SAFE ROUTE", progress:.9 } },
    },
    edges:[["charted","ambush-marked"],["charted","safe-plotted"],["ambush-marked","safe-plotted"],["safe-plotted","charted"]],
  },
  channels:["reveal","branch","dashFlow","threatPulse"],

  preview:()=>({
    layers:["sea","land","graticule","frame","road","dangerroute","saferoute","danger","nodes","labels"],
    branch:"both", t:0.9, status:"CHARTED", progress:.45,
  }),
  draw(ctx,W,H,state){ drawMap(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
