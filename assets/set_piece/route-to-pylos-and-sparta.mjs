/* set_piece.route-to-pylos-and-sparta — a diagrammatic journey MAP.
   SET_PIECE. Telemachus' plotted route: two destination markers (PYLOS,
   SPARTA), a dashed ship path from Ithaca, and an unresolved-father marker
   (a '?') beyond the horizon. Drawn as an EMPTY separable chart component in
   SOLID grays + hard contour; the engine dotify pass supplies the halftone.
   Declares placement anchors, collision boundaries (marker zones), a depth
   layer, and alternate states (plotting / plotted / father-resolved).
   Atlas: OD-B01-S05 — diagrammatic journey projection. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

/* normalized map coordinates (0..1) — anchors + draw share these */
const PT = {
  ithaca:{ x:0.20, y:0.82 },   // origin (Telemachus' home)
  pylos: { x:0.36, y:0.54 },   // first destination — Nestor
  sparta:{ x:0.68, y:0.42 },   // second destination — Menelaus
  father:{ x:0.80, y:0.16 },   // the unresolved father, past the last port
};

const params = {
  frame:true,          // chart border
  graticule:true,      // faint lat/long ruling so it reads as a projection
  seaLevel:1,          // sea fill ink level (lightest)
  markerR:0.052,       // destination ring radius (fraction of W)
  dash:[18,12],        // ship-path dash
};

/* ---- offscreen text helpers (drawn into the source; dotified later) ---- */
function tracked(g, text, x, y, size, track, color){
  g.save();
  g.fillStyle = color; g.textBaseline = "middle";
  g.font = `800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx = x;
  for (const ch of text){ g.fillText(ch, cx, y); cx += g.measureText(ch).width + track; }
  g.restore();
}
function trackedWidth(g, text, size, track){
  g.save(); g.font = `800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let w = 0; for (const ch of text){ w += g.measureText(ch).width + track; }
  g.restore(); return w - track;
}

/* a bullseye destination marker with a caption plate */
function destMarker(pen, g, W, H, cx, cy, R, label, active){
  // outer ring
  pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(active?2:1)), 6);
  pen.paint(()=>{ g.arc(cx, cy, R*0.62, 0, 7); }, toneSolid(inkLevel(4)), 4);
  // solid pip
  g.fillStyle = inkLevel(7); g.beginPath(); g.arc(cx, cy, R*0.26, 0, 7); g.fill();
  // caption plate below the marker
  const size = W*0.040, track = W*0.006;
  const tw = trackedWidth(g, label, size, track);
  const px = cx - tw/2 - W*0.02, py = cy + R + H*0.006;
  const pw = tw + W*0.04, ph = size*1.5;
  pen.paint(()=>{ g.rect(px, py, pw, ph); }, toneSolid(inkLevel(1)), 4);
  tracked(g, label, px + W*0.02, py + ph/2, size, track, INK);
}

function drawMap(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["sea","graticule","routes","ship","markers","father"];
  const has = l => layers.includes(l);
  const t = st.t || 0;
  const P = {
    ithaca:{ x:PT.ithaca.x*W, y:PT.ithaca.y*H },
    pylos: { x:PT.pylos.x*W,  y:PT.pylos.y*H  },
    sparta:{ x:PT.sparta.x*W, y:PT.sparta.y*H },
    father:{ x:PT.father.x*W, y:PT.father.y*H },
  };
  const R = W*params.markerR;

  // ---- SEA field (lightest tone -> reads as open ground) ----
  if (has("sea")){
    g.fillStyle = inkLevel(params.seaLevel); g.fillRect(0, 0, W, H);
    // a couple of low land masses so the chart isn't empty (diagrammatic blobs)
    g.fillStyle = inkLevel(2);
    g.beginPath(); g.ellipse(W*0.30, H*0.60, W*0.20, H*0.10, -0.3, 0, 7); g.fill();   // Peloponnese-ish
    g.beginPath(); g.ellipse(W*0.66, H*0.47, W*0.16, H*0.09,  0.2, 0, 7); g.fill();
    g.beginPath(); g.ellipse(W*0.17, H*0.83, W*0.09, H*0.05,  0.0, 0, 7); g.fill();   // Ithaca isle
  }

  // ---- GRATICULE: faint ruled projection grid ----
  if (has("graticule") && params.graticule){
    g.save(); g.strokeStyle = INK; g.globalAlpha = 0.28; g.lineWidth = 2;
    for (let i=1;i<7;i++){ const x=W*i/7; g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }
    for (let j=1;j<9;j++){ const y=H*j/9; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.restore();
  }

  // ---- CHART FRAME ----
  if (params.frame){
    pen.ink(()=>{ g.rect(W*0.05, H*0.05, W*0.90, H*0.90); }, 5);
  }

  // ---- ROUTES: dashed ship path Ithaca -> Pylos -> Sparta -> (?) ----
  if (has("routes")){
    // solid legs of the plotted voyage
    const drawLeg = (a,b,curve,dashed,dark)=>{
      const mx=(a.x+b.x)/2 + curve.x, my=(a.y+b.y)/2 + curve.y;
      g.save();
      g.strokeStyle = INK; g.lineCap="round"; g.lineJoin="round";
      g.lineWidth = dark?9:7; g.globalAlpha = dark?1:0.65;
      if (dashed) g.setLineDash(params.dash); else g.setLineDash([]);
      g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,b.x,b.y); g.stroke();
      g.setLineDash([]); g.restore();
      return { mx, my };
    };
    drawLeg(P.ithaca, P.pylos, { x:-W*0.10, y:H*0.02 }, true, true);
    drawLeg(P.pylos,  P.sparta,{ x: W*0.02, y:-H*0.06 }, true, true);
    // the unresolved onward leg toward the father — fainter, trailing off
    drawLeg(P.sparta, P.father,{ x: W*0.06, y:-H*0.02 }, true, false);
  }

  // ---- SHIP glyph riding the first leg (animatable along the path) ----
  if (has("ship")){
    const a=P.ithaca, b=P.pylos, cx=-W*0.10, cy=H*0.02;
    const u = 0.5 + 0.35*Math.sin(t*0.8);                 // param along leg
    const mx=(a.x+b.x)/2+cx, my=(a.y+b.y)/2+cy;
    const bx = lerp(lerp(a.x,mx,u), lerp(mx,b.x,u), u);
    const by = lerp(lerp(a.y,my,u), lerp(my,b.y,u), u);
    const s = W*0.030;
    g.save(); g.translate(bx, by);
    // hull (little boat wedge)
    pen.paint(()=>{ g.moveTo(-s,0); g.lineTo(s,0); g.lineTo(s*0.5,s*0.55); g.lineTo(-s*0.5,s*0.55); g.closePath(); },
      toneSolid(inkLevel(6)), 4);
    // mast + sail
    pen.ink(()=>{ g.moveTo(0,0); g.lineTo(0,-s*1.1); }, 4);
    pen.paint(()=>{ g.moveTo(0,-s*1.05); g.lineTo(s*0.8,-s*0.2); g.lineTo(0,-s*0.2); g.closePath(); },
      toneSolid(inkLevel(3)), 3);
    g.restore();
  }

  // ---- DESTINATION MARKERS + labels ----
  if (has("markers")){
    // origin pip (Ithaca)
    g.fillStyle = inkLevel(7); g.beginPath(); g.arc(P.ithaca.x, P.ithaca.y, R*0.34, 0, 7); g.fill();
    g.strokeStyle = INK; g.lineWidth=4; g.beginPath(); g.arc(P.ithaca.x, P.ithaca.y, R*0.34, 0, 7); g.stroke();
    tracked(g, "ITHACA", P.ithaca.x - W*0.02, P.ithaca.y + R*0.9, W*0.030, W*0.004, INK);
    // the two named destinations
    destMarker(pen, g, W, H, P.pylos.x,  P.pylos.y,  R, "PYLOS",  st.active!=="none");
    destMarker(pen, g, W, H, P.sparta.x, P.sparta.y, R, "SPARTA", st.active!=="none");
  }

  // ---- UNRESOLVED FATHER MARKER: a '?' in a dashed ring beyond the ports ----
  if (has("father")){
    const f = P.father, fr = R*0.98, resolved = !!st.fatherResolved;
    const pulse = 0.5 + 0.5*Math.sin(t*1.6);
    g.save();
    g.strokeStyle = INK; g.lineWidth = 6; g.lineCap="round";
    if (resolved) g.setLineDash([]); else g.setLineDash([10, 9]);
    g.beginPath(); g.arc(f.x, f.y, fr, 0, 7); g.stroke();
    g.setLineDash([]);
    g.restore();
    // fill: light if unresolved, dark if resolved
    pen.paint(()=>{ g.arc(f.x, f.y, fr*0.82, 0, 7); },
      toneSolid(inkLevel(resolved?6:1)), 0);
    // the glyph: '?' when unknown, a solid pip when resolved
    if (resolved){
      g.fillStyle = inkLevel(0); g.beginPath(); g.arc(f.x, f.y, fr*0.30, 0, 7); g.fill();
    } else {
      g.save();
      g.fillStyle = clamp(pulse,0,1) > 0.35 ? INK : inkLevel(6);
      g.textAlign="center"; g.textBaseline="middle";
      g.font = `800 ${Math.round(fr*1.5)}px Georgia,serif`;
      g.fillText("?", f.x, f.y + fr*0.06);
      g.restore();
    }
    // caption
    tracked(g, resolved?"FATHER":"FATHER?", f.x - W*0.06, f.y - fr - H*0.02, W*0.028, W*0.004, INK);
  }
}

export const asset = {
  id:"set_piece.route-to-pylos-and-sparta",
  type:"SET_PIECE",
  name:"Route to Pylos and Sparta",
  statusWord:"PLOTTED",
  scene:"OD-B01-S05",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude
  layers:["sea","graticule","routes","ship","markers","father"],
  // normalized 0..1 placement / camera anchors
  anchors:{
    "origin:ithaca":  PT.ithaca,
    "dest:pylos":     PT.pylos,
    "dest:sparta":    PT.sparta,
    "marker:father":  PT.father,
    "path:first-leg": { x:0.28, y:0.68 },
    "path:last-leg":  { x:0.74, y:0.29 },
    "camera:wide":    { x:0.50, y:0.50 },
  },
  // collision boundaries — marker footprints on the chart (normalized boxes)
  zones:{
    pylos:  { x0:PT.pylos.x-0.06,  y0:PT.pylos.y-0.06,  x1:PT.pylos.x+0.06,  y1:PT.pylos.y+0.10 },
    sparta: { x0:PT.sparta.x-0.06, y0:PT.sparta.y-0.06, x1:PT.sparta.x+0.06, y1:PT.sparta.y+0.10 },
    father: { x0:PT.father.x-0.07, y0:PT.father.y-0.09, x1:PT.father.x+0.07, y1:PT.father.y+0.07 },
    chart:  { x0:0.05, y0:0.05, x1:0.95, y1:0.95 },
  },
  states:{
    initial:"plotted",
    nodes:{
      // route half-drawn, destinations not yet fixed
      plotting:{ preview:{ layers:["sea","graticule","routes","ship"], active:"none", status:"PLOTTING", progress:.30 } },
      // full projection: both ports + the open question of the father
      plotted:{ preview:{ layers:["sea","graticule","routes","ship","markers","father"], status:"PLOTTED", progress:.62 } },
      // father found — the '?' resolves to a solid marker
      "father-resolved":{ preview:{ layers:["sea","graticule","routes","ship","markers","father"], fatherResolved:true, status:"RESOLVED", progress:1.0 } },
    },
    edges:[["plotting","plotted"],["plotted","father-resolved"]],
  },
  channels:["reveal","pathDraw","shipTravel","pulse"],

  preview:()=>({
    layers:["sea","graticule","routes","ship","markers","father"],
    t:0.6, status:"PLOTTED", progress:.62,
  }),
  draw(ctx,W,H,state){ drawMap(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
