/* set_piece.suitor-count-plan — the Book-13 OPERATIONAL PALACE CHART.
   SET_PIECE. Athena and Odysseus' tactical projection of the palace rendered as
   a top-down floor-plan: thick-walled rooms (GREAT HALL, FORECOURT, and a
   sealed STOREROOM), a counted grid of SUITOR markers massed in the hall, a
   small muster of hollow LOYALIST markers holding the hall threshold, a marked
   WEAPONS CACHE glyph locked in the storeroom, and bold APPROACH-ROUTE arrows —
   the assault up from the gate, the flank down the colonnade, and the run to
   secure the arms. Drawn as an EMPTY separable chart component in SOLID grays +
   hard contour; the engine dotify pass supplies the halftone. Declares labeled
   plan nodes + routes, placement anchors, a depth layer, and alternate states
   (survey / routes lit / strike).
   Atlas: OD-B13-S04 — operational projection of palace population, loyalists,
   weapons, and approach routes. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- normalized plan geometry (0..1); anchors + draw share these ----
   The chart reads BOTTOM -> TOP: the gate is low, the great hall is the tall
   upper chamber, the storeroom is walled off at the upper right. */
const PLAN = {
  x0:0.130, x1:0.870,     // outer wall span
  y0:0.150, y1:0.895,
  partitionY:0.560,       // wall between GREAT HALL (upper) and FORECOURT (lower)
  hallDoorX:0.500, hallDoorW:0.100,   // threshold gap Odysseus holds
  gateX:0.500, gateW:0.110,           // outer gate in the bottom wall
  storeX:0.630,           // vertical wall closing the storeroom off the hall
  storeY:0.375,           // horizontal wall of the storeroom
  storeDoorY:0.300, storeDoorH:0.070, // barred door into the storeroom
};

/* counted suitor block: a deterministic grid massed in the great hall */
const SUITORS = { cols:6, rows:4, x:0.190, y:0.220, w:0.400, h:0.270, r:0.017 };

/* the loyalist muster — Odysseus, Telemachus, Eumaeus, Philoetius — at the door */
const LOYALISTS = [
  { x:0.455, y:0.500 }, { x:0.545, y:0.500 },
  { x:0.500, y:0.463 }, { x:0.500, y:0.535 },
];

/* labeled plan NODES (placement / callouts) */
const NODE = {
  hall:    { x:0.360, y:0.320 },
  forecourt:{ x:0.500, y:0.720 },
  store:   { x:0.750, y:0.262 },
  threshold:{ x:0.500, y:0.560 },
  gate:    { x:0.500, y:0.895 },
  muster:  { x:0.500, y:0.500 },
};

/* APPROACH ROUTES — ordered polylines, each an arrow-terminated leg set.
   assault: gate -> forecourt -> threshold (the main push to the hall door)
   flank:   gate -> down the left colonnade -> up to the hall's far corner
   secure:  threshold -> storeroom door (lock the arms away) */
const ROUTES = {
  assault: { pts:[[0.500,0.860],[0.500,0.700],[0.500,0.585]], kind:"main" },
  flank:   { pts:[[0.360,0.845],[0.235,0.700],[0.230,0.420],[0.300,0.300]], kind:"flank" },
  secure:  { pts:[[0.520,0.470],[0.590,0.360],[0.612,0.305]], kind:"secure" },
};

const params = {
  frame:true,
  graticule:true,
  wallLW:8,            // structural wall weight
  floorLevel:1,        // room floor fill (lightest tone)
  storeLevel:3,        // storeroom fill (sealed, darker)
  suitorLevel:6,       // massed enemy markers (dark, countable)
  jambTick:0.014,      // door-jamb tick length (fraction of H)
};

/* ---------------- text helper (dotified later) ---------------- */
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
function plate(pen, g, W, label, px, py, size){
  const track=W*0.004, tw=trackedWidth(g,label,size,track);
  const pw=tw+W*0.030, ph=size*1.5;
  pen.paint(()=>{ g.rect(px, py, pw, ph); }, toneSolid(inkLevel(1)), 3);
  tracked(g, label, px+W*0.015, py+ph/2, size, track, INK);
  return { pw, ph };
}

/* ---------------- wall segment helpers (thick ink, controllable gaps) ------- */
function wallH(g, x1, x2, y, lw){ g.beginPath(); g.moveTo(x1,y); g.lineTo(x2,y); g.lineWidth=lw; g.stroke(); }
function wallV(g, x, y1, y2, lw){ g.beginPath(); g.moveTo(x,y1); g.lineTo(x,y2); g.lineWidth=lw; g.stroke(); }

/* an arrow polyline: fat ink trunk + solid head at the last vertex.
   `dashed` draws it as a surveyed (not yet committed) route. */
function drawArrow(g, W, H, ptsN, { lw=7, dashed=false, alpha=1 }={}){
  const P = ptsN.map(p=>({ x:p[0]*W, y:p[1]*H }));
  g.save(); g.strokeStyle=INK; g.globalAlpha=alpha; g.lineWidth=lw; g.lineCap="round"; g.lineJoin="round";
  if (dashed) g.setLineDash([W*0.020, W*0.016]);
  g.beginPath(); g.moveTo(P[0].x,P[0].y); for(let i=1;i<P.length;i++) g.lineTo(P[i].x,P[i].y); g.stroke();
  g.setLineDash([]);
  // arrowhead at the final segment
  const a=P[P.length-2], c=P[P.length-1];
  const dx=c.x-a.x, dy=c.y-a.y, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L;
  const hs=lw*2.4;
  g.fillStyle=INK; g.globalAlpha=alpha; g.beginPath();
  g.moveTo(c.x, c.y);
  g.lineTo(c.x-ux*hs-uy*hs*0.62, c.y-uy*hs+ux*hs*0.62);
  g.lineTo(c.x-ux*hs+uy*hs*0.62, c.y-uy*hs-ux*hs*0.62);
  g.closePath(); g.fill();
  g.restore();
}

/* the weapons-cache glyph: a round shield over two crossed spears */
function cacheGlyph(pen, g, cx, cy, r){
  // crossed spears behind
  g.save(); g.strokeStyle=INK; g.lineCap="round"; g.lineWidth=Math.max(3, r*0.16);
  g.beginPath(); g.moveTo(cx-r*0.95, cy+r*0.95); g.lineTo(cx+r*0.95, cy-r*0.95); g.stroke();
  g.beginPath(); g.moveTo(cx-r*0.95, cy-r*0.95); g.lineTo(cx+r*0.95, cy+r*0.95); g.stroke();
  // spearheads
  g.fillStyle=inkLevel(7);
  const tip=(tx,ty,ux,uy)=>{ g.beginPath(); g.moveTo(tx,ty);
    g.lineTo(tx-ux*r*0.34-uy*r*0.16, ty-uy*r*0.34+ux*r*0.16);
    g.lineTo(tx-ux*r*0.34+uy*r*0.16, ty-uy*r*0.34-ux*r*0.16); g.closePath(); g.fill(); };
  tip(cx+r*0.95, cy-r*0.95,  0.707,-0.707);
  tip(cx+r*0.95, cy+r*0.95,  0.707, 0.707);
  g.restore();
  // shield disc on top
  pen.paint(()=>{ g.arc(cx, cy, r*0.62, 0, 7); }, toneSolid(inkLevel(4)), Math.max(3, r*0.14));
  // boss + rivets
  g.fillStyle=inkLevel(7); g.beginPath(); g.arc(cx, cy, r*0.16, 0, 7); g.fill();
  g.strokeStyle=INK; g.lineWidth=Math.max(2, r*0.08);
  g.beginPath(); g.arc(cx, cy, r*0.40, 0, 7); g.stroke();
}

function drawPlan(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["floor","rooms","walls","suitors","cache","loyalists","routes","labels"];
  const has = l => layers.includes(l);
  const focus = st.focus || "all";      // all | routes | strike
  const t = st.t || 0;
  const P = PLAN;
  const X0=P.x0*W, X1=P.x1*W, Y0=P.y0*H, Y1=P.y1*H;
  const PY=P.partitionY*H, SX=P.storeX*W, SY=P.storeY*H;
  const wLW=params.wallLW;

  // ---- graticule: faint survey ruling under everything ----
  if (has("floor") && params.graticule){
    g.save(); g.strokeStyle=INK; g.globalAlpha=0.10; g.lineWidth=2;
    for(let i=1;i<10;i++){ const x=W*i/10; g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }
    for(let j=1;j<12;j++){ const y=H*j/12; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.restore();
  }

  // ---- ROOM FLOOR FILLS (no contour; walls drawn separately) ----
  if (has("floor")){
    // whole plan interior = light hall/forecourt floor
    g.fillStyle=inkLevel(params.floorLevel); g.fillRect(X0, Y0, X1-X0, Y1-Y0);
    // forecourt reads a touch heavier than the hall
    g.fillStyle=inkLevel(2); g.fillRect(X0, PY, X1-X0, Y1-PY);
  }
  if (has("rooms")){
    // sealed STOREROOM (upper right) — darker locked cell
    g.fillStyle=inkLevel(params.storeLevel); g.fillRect(SX, Y0, X1-SX, SY-Y0);
  }

  // ---- WALLS (thick ink, with door gaps) ----
  if (has("walls")){
    g.save(); g.strokeStyle=INK; g.lineCap="butt";
    // outer walls with gate gap in the bottom
    wallH(g, X0, X1, Y0, wLW);                                  // top
    wallV(g, X0, Y0, Y1, wLW);                                  // left
    wallV(g, X1, Y0, Y1, wLW);                                  // right
    const gL=(P.gateX-P.gateW/2)*W, gR=(P.gateX+P.gateW/2)*W;
    wallH(g, X0, gL, Y1, wLW); wallH(g, gR, X1, Y1, wLW);       // bottom (gate gap)
    // partition wall (hall / forecourt) with the threshold door gap
    const dL=(P.hallDoorX-P.hallDoorW/2)*W, dR=(P.hallDoorX+P.hallDoorW/2)*W;
    wallH(g, X0, dL, PY, wLW); wallH(g, dR, X1, PY, wLW);
    // storeroom walls with a barred door gap on the vertical wall
    const sdT=P.storeDoorY*H, sdB=(P.storeDoorY+P.storeDoorH)*H;
    wallV(g, SX, Y0, sdT, wLW); wallV(g, SX, sdB, SY, wLW);
    wallH(g, SX, X1, SY, wLW);
    g.restore();

    // door-jamb ticks (short perpendicular marks framing each opening)
    g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(3, wLW*0.55); g.lineCap="round";
    const jt=params.jambTick*H;
    const jambV=(x,y)=>{ g.beginPath(); g.moveTo(x,y-jt); g.lineTo(x,y+jt); g.stroke(); };
    const jambH=(x,y)=>{ g.beginPath(); g.moveTo(x-jt,y); g.lineTo(x+jt,y); g.stroke(); };
    jambV(gL, Y1); jambV(gR, Y1);                                 // gate
    jambV(dL, PY); jambV(dR, PY);                                 // threshold
    jambH(SX, sdT); jambH(SX, sdB);                               // storeroom door
    // barred storeroom door (locked): short cross-hatch across the gap
    g.strokeStyle=INK; g.lineWidth=3;
    for(let k=0;k<3;k++){ const yy=lerp(sdT,sdB,(k+0.5)/3); g.beginPath(); g.moveTo(SX-jt*0.6,yy); g.lineTo(SX+jt*0.6,yy); g.stroke(); }
    g.restore();
  }

  // ---- SUITOR COUNT BLOCK (massed dark markers, countable grid) ----
  if (has("suitors")){
    const S=SUITORS, r=S.r*W;
    for(let ry=0; ry<S.rows; ry++){
      for(let cx0=0; cx0<S.cols; cx0++){
        const x=(S.x + (S.cols>1? cx0/(S.cols-1):0)*S.w)*W;
        const y=(S.y + (S.rows>1? ry/(S.rows-1):0)*S.h)*H;
        pen.paint(()=>{ g.arc(x, y, r, 0, 7); }, toneSolid(inkLevel(params.suitorLevel)), 3);
      }
    }
    // count bracket + tally to the left of the block
    const bx=(S.x-0.028)*W, by0=S.y*H, by1=(S.y+S.h)*H;
    g.save(); g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round";
    g.beginPath(); g.moveTo(bx+W*0.012,by0); g.lineTo(bx,by0); g.lineTo(bx,by1); g.lineTo(bx+W*0.012,by1); g.stroke();
    g.restore();
    // tally tab reading the count, placed in clear hall space right of the block
    plate(pen, g, W, `SUITORS ${S.cols*S.rows}`, W*0.628, H*0.452, W*0.031);
  }

  // ---- WEAPONS CACHE glyph, locked in the storeroom ----
  if (has("cache")){
    cacheGlyph(pen, g, NODE.store.x*W, NODE.store.y*H, W*0.052);
  }

  // ---- LOYALIST muster at the threshold (hollow ringed markers) ----
  if (has("loyalists")){
    const r=W*0.020;
    for(const m of LOYALISTS){
      const x=m.x*W, y=m.y*H;
      pen.paint(()=>{ g.arc(x, y, r, 0, 7); }, toneSolid(inkLevel(1)), 5);  // light disc
      g.strokeStyle=INK; g.lineWidth=Math.max(4, r*0.34); g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
      g.fillStyle=ACCENT; g.beginPath(); g.arc(x, y, r*0.34, 0, 7); g.fill(); // blue core = our side
    }
  }

  // ---- APPROACH ROUTES (bold arrows) ----
  if (has("routes")){
    const lit = focus!=="strike";
    // surveyed flank first (thinner), then committed assault + secure on top
    drawArrow(g, W, H, ROUTES.flank.pts,   { lw:6, dashed:true, alpha:0.85 });
    drawArrow(g, W, H, ROUTES.assault.pts, { lw:9, alpha:1 });
    drawArrow(g, W, H, ROUTES.secure.pts,  { lw:7, alpha:1 });
    // a travelling pip climbing the assault route (the push in motion)
    if (lit){
      const a=ROUTES.assault.pts, u=(t*0.35)%1;
      // interpolate along the 2-leg assault polyline
      const seg = u<0.5 ? [a[0],a[1],u/0.5] : [a[1],a[2],(u-0.5)/0.5];
      const px=lerp(seg[0][0],seg[1][0],seg[2])*W, py=lerp(seg[0][1],seg[1][1],seg[2])*H;
      const s=W*0.016;
      pen.paint(()=>{ g.arc(px,py,s*1.4,0,7); }, toneSolid(inkLevel(1)), 3);
      g.fillStyle=ACCENT; g.beginPath(); g.arc(px,py,s*0.72,0,7); g.fill();
    }
  }

  // ---- ROOM LABELS ----
  if (has("labels")){
    const sz=W*0.030;
    plate(pen, g, W, "GREAT HALL", W*0.150, H*0.172, sz);
    plate(pen, g, W, "FORECOURT", W*0.150, H*0.845, sz);
    plate(pen, g, W, "ARMS",      W*0.660, H*0.170, sz);
    // a small blue callout diamond on the threshold node (the crux)
    g.save(); g.translate(NODE.threshold.x*W, (P.partitionY+0.006)*H);
    g.fillStyle=ACCENT; g.beginPath();
    g.moveTo(0,-W*0.014); g.lineTo(W*0.014,0); g.lineTo(0,W*0.014); g.lineTo(-W*0.014,0); g.closePath(); g.fill();
    g.restore();
  }

  // ---- CHART FRAME (outermost survey border) ----
  if (params.frame){ pen.ink(()=>{ g.rect(W*0.045, H*0.045, W*0.910, H*0.910); }, 4); }
}

export const asset = {
  id:"set_piece.suitor-count-plan",
  type:"SET_PIECE",
  name:"Suitor-count plan",
  statusWord:"COUNTED",
  scene:"OD-B13-S04",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude
  layers:["floor","rooms","walls","suitors","cache","loyalists","routes","labels"],
  // normalized 0..1 placement / callout anchors (plan nodes, not baked figures)
  anchors:{
    "room:great-hall":  NODE.hall,
    "room:forecourt":   NODE.forecourt,
    "room:storeroom":   NODE.store,
    "door:threshold":   NODE.threshold,
    "door:gate":        NODE.gate,
    "door:storeroom":   { x:PLAN.storeX, y:PLAN.storeDoorY+PLAN.storeDoorH/2 },
    "cache:weapons":    NODE.store,
    "muster:loyalists": NODE.muster,
    "cluster:suitors":  { x:SUITORS.x+SUITORS.w/2, y:SUITORS.y+SUITORS.h/2 },
    "route:assault":    { x:0.500, y:0.700 },
    "route:flank":      { x:0.232, y:0.560 },
    "route:secure":     { x:0.575, y:0.360 },
    "camera:plan":      { x:0.500, y:0.500 },
  },
  // collision boundaries / room footprints on the plan (normalized boxes)
  zones:{
    "great-hall":{ x0:PLAN.x0, y0:PLAN.y0, x1:PLAN.storeX, y1:PLAN.partitionY },
    forecourt:   { x0:PLAN.x0, y0:PLAN.partitionY, x1:PLAN.x1, y1:PLAN.y1 },
    storeroom:   { x0:PLAN.storeX, y0:PLAN.y0, x1:PLAN.x1, y1:PLAN.storeY },
    "suitor-block":{ x0:SUITORS.x-0.02, y0:SUITORS.y-0.02, x1:SUITORS.x+SUITORS.w+0.02, y1:SUITORS.y+SUITORS.h+0.02 },
    threshold:   { x0:0.44, y0:0.53, x1:0.56, y1:0.59 },
    plan:        { x0:0.045, y0:0.045, x1:0.955, y1:0.955 },
  },
  // depth layer for scene compositing (a flat mid-ground tactical prop)
  depth:"midground",
  states:{
    initial:"survey",
    nodes:{
      // the neutral projection: rooms, counts, cache, and both routes charted
      survey:{ preview:{ layers:["floor","rooms","walls","suitors","cache","loyalists","routes","labels"], focus:"all", status:"COUNTED", progress:.4 } },
      // the routes emphasized — planning the approach
      "routes-lit":{ preview:{ layers:["floor","rooms","walls","suitors","cache","loyalists","routes","labels"], focus:"routes", status:"ROUTED", progress:.65 } },
      // the strike: loyalists muster, arms secured, pip frozen at the door
      strike:{ preview:{ layers:["floor","rooms","walls","suitors","cache","loyalists","routes","labels"], focus:"strike", status:"STRIKE", progress:.9 } },
    },
    edges:[["survey","routes-lit"],["routes-lit","strike"],["strike","survey"],["survey","strike"]],
  },
  channels:["reveal","route-flow","count","focus"],

  preview:()=>({
    layers:["floor","rooms","walls","suitors","cache","loyalists","routes","labels"],
    focus:"all", t:0.6, status:"COUNTED", progress:.4,
  }),
  draw(ctx,W,H,state){ drawPlan(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
