/* location.narrow-monster-strait — the narrow sea-passage between the monsters.
   LOCATION asset (empty navigable set). Scene (OD-B12-S04): a tight strait a
   ship must thread — a high SCYLLA cliff with a dark den-mouth on the LEFT (a
   fig-tree marker clinging above the den), the CHARYBDIS whirlpool side opposite
   on the RIGHT, a walkable SHIP LANE of open water running from the near shore up
   to an EXIT THRESHOLD gap at the back, and foreground SPRAY that occludes the
   lane. NO characters, no ship baked in — placement/camera anchors + hazard
   zones only, so the runtime drops the cast + vessel onto the set.

   Built as depth layers (bg exit / mid cliffs+whirlpool / fg water-lane+spray)
   in SOLID grays + hard black contour with engine primitives; the engine POST
   pass supplies the dot-matrix halftone. Do NOT pre-dither. The whirlpool swirl
   and the spray breathe over state.t. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  waterLevel: 0.34,   // top of the open water / base of the far cliffs (frac H)
  laneX:      0.50,   // ship-lane centre (frac W)
  laneHalf:   0.15,   // half-width of the navigable lane at mid depth (frac W)
  cliffX:     0.15,   // Scylla cliff mass centre (frac W)
  denY:       0.20,   // den-mouth height on the cliff (frac H)
  charX:      0.82,   // Charybdis whirlpool centre (frac W)
  charY:      0.58,   // Charybdis whirlpool centre (frac H)
  charR:      0.17,   // whirlpool outer radius (frac W)
  swirlSpin:  1.0,
};

/* ---- SKY + far water + the EXIT THRESHOLD gap the lane leads out through ---- */
function drawExit(pen,g,W,H,st){
  const wl = H*params.waterLevel;
  // light air band up top
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,wl);
  // far-water seam at the horizon
  pen.ink(()=>{ g.moveTo(0,wl); g.lineTo(W,wl); }, 3);
  // the exit threshold: a bright vertical gap of open sea between the headlands,
  // centred on the lane, framed by two dark far-shore shoulders.
  const gx = W*params.laneX, gw = W*0.14;
  g.fillStyle = inkLevel(2);                                   // the bright way-out
  g.fillRect(gx-gw/2, wl-H*0.13, gw, H*0.13);
  // framing shoulders (dark far land either side of the gap)
  pen.paint(()=>{ g.moveTo(gx-gw/2, wl); g.lineTo(gx-gw*0.62, wl-H*0.11);
                  g.lineTo(gx-gw*1.9, wl-H*0.05); g.lineTo(gx-gw*2.2, wl); g.closePath(); },
            toneSolid(inkLevel(4)), 3);
  pen.paint(()=>{ g.moveTo(gx+gw/2, wl); g.lineTo(gx+gw*0.62, wl-H*0.11);
                  g.lineTo(gx+gw*1.9, wl-H*0.05); g.lineTo(gx+gw*2.2, wl); g.closePath(); },
            toneSolid(inkLevel(4)), 3);
  // threshold marker arrow (diagrammatic way-through)
  g.strokeStyle = inkLevel(5); g.lineWidth = 2.4; g.lineCap="round";
  g.beginPath(); g.moveTo(gx, wl-H*0.02); g.lineTo(gx, wl-H*0.10);
  g.moveTo(gx-gw*0.16, wl-H*0.075); g.lineTo(gx, wl-H*0.105);
  g.moveTo(gx+gw*0.16, wl-H*0.075); g.lineTo(gx, wl-H*0.105); g.stroke();
}

/* ---- OPEN WATER body of the strait (mid tone) filling below the waterline ---- */
function drawWater(pen,g,W,H){
  const wl = H*params.waterLevel;
  g.fillStyle = inkLevel(3); g.fillRect(0,wl,W,H-wl);
}

/* ---- SCYLLA CLIFF (LEFT): a high blocky rock headland rising the full height,
   with a dark DEN-mouth cavity bored into it and a stratified rock face. ---- */
function drawCliff(pen,g,W,H){
  const cx = W*params.cliffX, wl = H*params.waterLevel;
  const topX = cx+W*0.11, baseX = cx+W*0.19;   // right face of the cliff (top→base)
  const brow = H*0.07;                           // cliff top starts below the label band
  // the cliff mass — a tall rock headland; mid tone so the dark den reads against it
  pen.paint(()=>{
    g.moveTo(0, brow);
    g.lineTo(topX, brow);
    g.lineTo(topX+W*0.02, H*0.18);
    g.lineTo(baseX, H*0.44);
    g.lineTo(baseX-W*0.01, H*0.70);
    g.lineTo(0, H*0.80);
    g.closePath();
  }, toneSolid(inkLevel(4)), 5);
  // stratified rock-face seams (darker) for blocky rock texture
  g.strokeStyle = inkLevel(6); g.lineWidth = 2.4; g.globalAlpha = 0.85;
  for(let i=1;i<=5;i++){
    const y = H*(0.14+i*0.12);
    g.beginPath(); g.moveTo(0, y);
    g.quadraticCurveTo(cx*0.7, y-H*0.008, baseX*(1-i*0.05), y+H*0.02); g.stroke();
  }
  // a few vertical fissures
  for(let j=0;j<3;j++){
    const x = W*(0.05+j*0.07);
    g.beginPath(); g.moveTo(x, brow+H*0.02); g.lineTo(x+W*0.008, H*0.72); g.stroke();
  }
  g.globalAlpha = 1;
  // dark contact where the cliff foot meets the water
  pen.paint(()=>{ g.ellipse(cx+W*0.06, H*0.78, baseX*0.9, H*0.028, 0, 0, TAU); },
            toneSolid(inkLevel(6)), 3);

  // ---- the DEN: a dark cave-mouth bored high in the cliff face (Scylla's lair) ----
  const dx = cx+W*0.02, dy = H*params.denY, dr = W*0.07;
  pen.paint(()=>{
    g.moveTo(dx-dr, dy+dr*1.15);
    g.quadraticCurveTo(dx-dr*1.05, dy-dr*1.2, dx, dy-dr*1.35);
    g.quadraticCurveTo(dx+dr*1.05, dy-dr*1.2, dx+dr, dy+dr*1.15);
    g.quadraticCurveTo(dx, dy+dr*0.55, dx-dr, dy+dr*1.15);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // jagged teeth/stalactites at the den mouth
  g.strokeStyle = inkLevel(6); g.lineWidth = 2.6; g.lineCap="round";
  for(let k=-2;k<=2;k++){
    g.beginPath(); g.moveTo(dx+k*dr*0.4, dy-dr*0.95); g.lineTo(dx+k*dr*0.4+dr*0.06, dy-dr*0.35); g.stroke();
  }

  // ---- FIG-TREE MARKER: the wild fig on the cliff brow, silhouetted vs. sky ----
  const fx = topX-W*0.015, fy = brow;
  // trunk + spreading branches (hard black against the light sky)
  g.strokeStyle = INK; g.lineWidth = 4.5; g.lineCap="round";
  g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx-W*0.004, fy-H*0.055);   // trunk
  g.moveTo(fx-W*0.004, fy-H*0.03); g.lineTo(fx-W*0.035, fy-H*0.05);    // branch L
  g.moveTo(fx-W*0.004, fy-H*0.04); g.lineTo(fx+W*0.03, fy-H*0.06); g.stroke(); // branch R
  // broad low fig canopy (dark, reads as a clear marker crown)
  pen.paint(()=>{ g.ellipse(fx, fy-H*0.068, W*0.06, H*0.03, 0, 0, TAU); }, toneSolid(inkLevel(6)), 3);
  pen.paint(()=>{ g.ellipse(fx-W*0.04, fy-H*0.055, W*0.032, H*0.022, 0, 0, TAU); }, toneSolid(inkLevel(6)), 3);
  pen.paint(()=>{ g.ellipse(fx+W*0.038, fy-H*0.058, W*0.034, H*0.022, 0, 0, TAU); }, toneSolid(inkLevel(6)), 3);
}

/* ---- CHARYBDIS SIDE (RIGHT): the opposite hazard — a whirlpool swirl marked
   as concentric sinking rings with a dark eye and two spiral arms turning over
   t. Rendered as the SET marker (the hazard zone), lighter than the full FX. ---- */
function drawWhirl(pen,g,W,H,t){
  const cx = W*params.charX, cy = H*params.charY;
  const rx = W*params.charR, ry = rx*0.60;
  // nested terraced rings sinking to a dark eye — alternate tone so the terraces
  // read as concentric bands rather than one dark mass
  const R = 6;
  for(let i=0;i<=R;i++){
    const f = i/R;
    const rrx = lerp(rx, rx*0.14, f), rry = lerp(ry, ry*0.14, f);
    const ey  = cy + Math.pow(f,1.2)*ry*0.5;
    const lvl = i===R ? 7 : (i%2 ? 4 : 2);          // light/mid banding, dark eye
    pen.paint(()=>{ g.ellipse(cx, ey, rrx, rry, 0, 0, TAU); }, toneSolid(inkLevel(lvl)), i===0?4:2.4);
  }
  // two spiral arms winding into the eye (turning over t)
  const spin = t*params.swirlSpin, aspect = ry/rx;
  g.lineCap="round"; g.lineJoin="round";
  for(let a=0;a<2;a++){
    const a0 = a*Math.PI + spin;
    g.strokeStyle = inkLevel(5);
    g.beginPath(); let first=true;
    for(let th=0; th<=TAU*2.2; th+=0.16){
      const nr = Math.exp(-0.22*th); if (nr<0.12) break;
      const ang = a0+th;
      const px = cx + Math.cos(ang)*rx*nr;
      const py = cy + (1-nr)*ry*0.6 + Math.sin(ang)*rx*nr*aspect;
      g.lineWidth = lerp(5, 1.4, th/(TAU*2.2));
      if (first){ g.moveTo(px,py); first=false; } else g.lineTo(px,py);
    }
    g.stroke();
  }
}

/* ---- SHIP LANE: the walkable channel of safe water down the middle, drawn as a
   lighter tapering corridor from the near shore up to the exit, with perspective
   guide lines + a dashed centreline (the course to thread). ---- */
function drawLane(pen,g,W,H){
  const lx = W*params.laneX, wl = H*params.waterLevel;
  const farHalf = W*0.055, nearHalf = W*params.laneHalf*1.35;
  // the corridor (lighter than open water so it reads as the clear path)
  pen.paint(()=>{
    g.moveTo(lx-farHalf, wl);
    g.lineTo(lx+farHalf, wl);
    g.lineTo(lx+nearHalf, H);
    g.lineTo(lx-nearHalf, H);
    g.closePath();
  }, toneSolid(inkLevel(2)), 4);
  // perspective edge guides + dashed centreline course
  g.strokeStyle = inkLevel(4); g.lineWidth = 2; g.globalAlpha = 0.7;
  g.setLineDash([H*0.02, H*0.018]);
  g.beginPath(); g.moveTo(lx, wl); g.lineTo(lx, H); g.stroke();
  g.setLineDash([]);
  g.globalAlpha = 1;
}

/* ---- SPRAY OCCLUSION: light foam plumes bursting at the hazard flanks + across
   the near foreground, partly occluding the lane. Bright (near-paper) lobes with
   soft contour; they breathe/pulse over t. ---- */
function drawSpray(pen,g,W,H,t){
  const wl = H*params.waterLevel;
  const puff = (x,y,r,ph)=>{
    const p = 0.82 + 0.18*Math.sin(t*2.2 + ph);
    pen.paint(()=>{ g.ellipse(x, y, r*p, r*0.7*p, 0, 0, TAU); }, toneSolid(inkLevel(1)), 2.4);
  };
  // spray at the foot of the Scylla cliff
  const cfx = W*params.cliffX + W*0.22;
  puff(cfx, wl+H*0.30, W*0.07, 0.0);
  puff(cfx+W*0.05, wl+H*0.26, W*0.05, 1.1);
  puff(cfx-W*0.04, wl+H*0.34, W*0.055, 2.0);
  // spray thrown off the Charybdis whirlpool rim
  const wx = W*params.charX - W*0.14, wy = H*params.charY - H*0.02;
  puff(wx, wy, W*0.06, 0.6);
  puff(wx-W*0.03, wy+H*0.05, W*0.05, 1.7);
  puff(wx+W*0.02, wy-H*0.04, W*0.045, 2.6);
  // big foreground spray sheet occluding the near lane
  for(let i=0;i<5;i++){
    const x = W*(0.12+i*0.19);
    puff(x, H*(0.90+0.04*Math.sin(i*1.3)), W*0.085, i*0.9);
  }
}

function drawSet(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const layers = st.layers || ["exit","water","charybdis","cliff","den","figtree","lane","spray"];
  const has = l => layers.includes(l);

  if (has("exit"))                     drawExit(pen,g,W,H,st);
  if (has("water"))                    drawWater(pen,g,W,H);
  if (has("charybdis"))                drawWhirl(pen,g,W,H,t);
  if (has("cliff")||has("den")||has("figtree")) drawCliff(pen,g,W,H); // cliff carries den+figtree
  if (has("lane"))                     drawLane(pen,g,W,H);
  if (has("spray"))                    drawSpray(pen,g,W,H,t);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"location.narrow-monster-strait",
  type:"LOCATION",
  name:"Narrow Monster Strait",
  statusWord:"THREADING",
  scene:"OD-B12-S04",

  params,
  // back -> front draw order the set honors; scene state may pass a subset
  layers:["exit","water","charybdis","cliff","den","figtree","lane","spray"],
  // normalized 0..1 placement / camera anchors — NO baked cast or ship
  anchors:{
    "scylla:cliff":     { x:0.16, y:0.34 },   // the high headland mass
    "scylla:den":       { x:0.23, y:0.20 },   // dark lair mouth (attack point)
    "figtree:marker":   { x:0.30, y:0.11 },   // the wild fig above the den
    "charybdis:eye":    { x:0.86, y:0.66 },   // the swallowing whirlpool centre
    "lane:near":        { x:0.50, y:0.96 },   // ship enters here (near shore)
    "lane:mid":         { x:0.50, y:0.62 },   // course midpoint
    "lane:far":         { x:0.50, y:0.36 },   // course toward the exit
    "threshold:exit":   { x:0.50, y:0.24 },   // the way out of the strait
    "spray:foreground": { x:0.50, y:0.90 },   // occluding foam plane
    "camera:wide":      { x:0.50, y:0.50 },
    "camera:cliff":     { x:0.24, y:0.30 },
    "camera:whirl":     { x:0.80, y:0.62 },
  },
  // navigable + hazard regions for pathing/placement
  zones:{
    lane:    { x0:0.36, y0:0.34, x1:0.64, y1:0.98 },   // walkable water corridor
    scylla:  { x0:0.00, y0:0.00, x1:0.34, y1:0.72 },   // cliff hazard side
    charybdis:{x0:0.66, y0:0.42, x1:1.00, y1:0.90 },   // whirlpool hazard side
    exit:    { x0:0.42, y0:0.20, x1:0.58, y1:0.34 },
  },
  // LOCATION state machine: how the set is dressed for the beat
  states:{
    initial:"passage",
    nodes:{
      // full strait — both hazards live, spray up, lane clear
      passage:{ preview:{ t:1.2, status:"THREADING", progress:0.30,
                          layers:["exit","water","charybdis","cliff","den","figtree","lane","spray"] } },
      // hug the cliff — Scylla side foregrounded, whirlpool quiet
      "hug-scylla":{ preview:{ t:0.6, status:"HUGGING", progress:0.45,
                          layers:["exit","water","cliff","den","figtree","lane","spray"] } },
      // clean empty set — no spray occlusion (for staging the ship)
      "clear-set":{ preview:{ t:0.0, status:"CLEAR", progress:0.15,
                          layers:["exit","water","charybdis","cliff","den","figtree","lane"] } },
    },
    edges:[["passage","hug-scylla"],["passage","clear-set"],["hug-scylla","passage"],["clear-set","passage"]],
  },
  channels:["t","reveal","camera"],

  // neutral preview: the whole strait dressed — cliff+den+fig-tree left, whirlpool
  // right, clear lane threading up to the exit, foreground spray occluding it.
  preview:()=>({ t:1.2, status:"THREADING", progress:0.30,
                 layers:["exit","water","charybdis","cliff","den","figtree","lane","spray"] }),
  draw(ctx,W,H,state){ return drawSet(ctx,W,H,state||{}); },
};
export default asset;
