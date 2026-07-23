/* divine_fx.troy-memory-field — the war remembered, rising behind a voice.
   DIVINE_FX asset. Scene function (OD-B03-S02): as old Nestor narrates, the
   ten years at Troy surface as a FIELD of faint, layered, ghostly silhouettes
   — councils of the kings, the beached fleet, fallen heroes, and the divided
   homeward routes that split the returning host. Nothing is solid: each stratum
   of memory is a low-tone silhouette that SURFACES and RECEDES on its own phase,
   so the recollection reads as superimposed, half-present, drifting.

   Procedural DIVINE_FX: SOURCE (Nestor's narration, a voice emitter at the base)
   -> FIELD (four receding strata of recollection) -> TRANSFORM (which memory
   dominates, by state / t) -> visible CONSEQUENCE (silhouettes fade up & down,
   the fleet bobs, motes of memory rise from the voice into the field). Animate
   everything over state.t. Solid grays + contour into the offscreen ctx; the
   engine POST pass supplies the halftone (do NOT pre-dither). Ghost strata are
   drawn at LOW ink levels with thin, tonal contour so they stay faint; only the
   voice source carries a hard, crisp mark to anchor the diagram. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

const params = {
  horizon:   0.48,   // sea line for the beached fleet (frac of H)
  councilY:  0.17,   // register of the kings' councils (far / faintest memory)
  routesY:   0.35,   // register where the homeward routes diverge
  fleetTop:  0.52,   // first row of ships
  fallenY:   0.80,   // the ground band of fallen heroes (near memory)
  councils:  2,       // clustered assemblies across the top
  fleetRows: 3,       // receding rows of ships
  routes:    5,       // diverging homeward branches
  fallen:    5,       // reclining hero silhouettes
  motes:     16,      // memory motes rising from the voice
};

/* a ghost fill: flat gray body + a thin same-family contour so the silhouette
   holds an edge but stays faint under the halftone (never full-black INK). */
function ghost(g, pathFn, fillL, edgeL=fillL+2, lw=2){
  g.beginPath(); pathFn();
  g.fillStyle = inkLevel(fillL); g.fill();
  g.strokeStyle = inkLevel(clamp(edgeL,1,7)); g.lineWidth = lw;
  g.lineJoin="round"; g.stroke();
}
/* surfacing tone: a memory stratum brightens & dims on its own slow phase so
   the whole field reads as recollection welling up and receding (layered). */
function surface(base, t, speed, phase, amp=1.4){
  return clamp(base + amp*Math.sin(t*speed + phase), 1, 6);
}

/* ---- FIELD: two faint receding grounds (sky-memory over sea-memory) ---- */
function drawField(g,W,H){
  const hz = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hz);           // sky of memory
  g.fillStyle = inkLevel(2); g.fillRect(0,hz,W,H-hz);        // sea/shore of memory
  // the far shore line — a soft ruled horizon the fleet sits against
  g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.beginPath();
  g.moveTo(0,hz); g.lineTo(W,hz); g.stroke();
}

/* ---- a single COUNCIL: a ring of standing king-silhouettes (head + robe),
   seen from a low far angle — the assemblies of the war remembered. ---- */
function council(g,cx,cy,s,fillL){
  const n = 5;
  // central standard the assembly rings (a pole + pennant)
  g.strokeStyle = inkLevel(clamp(fillL+2,1,6)); g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx, cy+s*0.3); g.lineTo(cx, cy-s*1.8); g.stroke();
  ghost(g, ()=>{ g.moveTo(cx, cy-s*1.8); g.lineTo(cx+s*0.9, cy-s*1.55);
    g.lineTo(cx, cy-s*1.25); g.closePath(); }, fillL, fillL+2, 1.4);
  for(let i=0;i<n;i++){
    const a = Math.PI*(0.05 + 0.90*(i/(n-1)));   // a shallow arc, facing in
    const rx = s*3.0, ry = s*1.2;
    const x = cx + Math.cos(a)*rx;
    const y = cy - Math.sin(a)*ry*0.4 + ry*0.5;
    const near = 0.78 + 0.30*Math.sin(a);        // front figures a touch bigger
    const hs = s*near;
    // robe body (tapered, standing king)
    ghost(g, ()=>{
      g.moveTo(x-hs*0.62, y+hs*2.0);
      g.quadraticCurveTo(x-hs*0.5, y+hs*0.2, x-hs*0.34, y);
      g.lineTo(x+hs*0.34, y);
      g.quadraticCurveTo(x+hs*0.5, y+hs*0.2, x+hs*0.62, y+hs*2.0);
      g.closePath();
    }, fillL, fillL+2, 1.6);
    // head
    ghost(g, ()=> g.arc(x, y-hs*0.5, hs*0.42, 0, TAU), fillL, fillL+2, 1.6);
  }
}

/* ---- COUNCIL register: a couple of assemblies across the top, faint & far -- */
function drawCouncils(g,W,H,t){
  const y = H*params.councilY, n = params.councils;
  for(let i=0;i<n;i++){
    const x = lerp(W*0.26, W*0.74, n===1?0.5:i/(n-1));
    const depth = pr(i,2);                       // pseudo-random depth
    const s = lerp(22, 30, depth);
    const base = 3;                              // faint deep memory
    const fillL = Math.round(surface(base, t, 0.7, i*1.9, 1.1));
    council(g, x, y + (depth-0.5)*H*0.04, s, fillL);
  }
}

/* ---- DIVIDED ROUTES: from one landfall the homeward host splits into diverging
   dashed tracks, each ending in an arrowhead — the routes that scattered the
   fleet. A slow travelling dash makes the memory of departure drift. ---- */
function drawRoutes(g,W,H,t){
  const ox = W*0.5, oy = H*params.routesY;       // the parting point (Troy's shore)
  const n = params.routes;
  g.lineCap="round";
  // the landfall node
  ghost(g, ()=> g.arc(ox, oy, 6, 0, TAU), 4, 5, 2);
  for(let i=0;i<n;i++){
    const spread = lerp(-1.15, 1.15, i/(n-1));    // fan of headings
    const len = lerp(W*0.34, W*0.52, pr(i,7));
    const ex = ox + Math.sin(spread)*len;
    const ey = oy - Math.cos(spread)*len*0.55;    // arc up-and-out into memory
    const fillL = Math.round(surface(2, t, 0.9, i*1.3, 1.3));
    g.strokeStyle = inkLevel(clamp(fillL+1,1,5)); g.lineWidth = 2.4;
    g.setLineDash([10,8]); g.lineDashOffset = -t*22 - i*5;
    // a gently bowed route
    g.beginPath();
    const mx = lerp(ox,ex,0.5) + Math.sin(spread)*W*0.03;
    const my = lerp(oy,ey,0.5) - H*0.03;
    g.moveTo(ox,oy); g.quadraticCurveTo(mx,my,ex,ey); g.stroke();
    g.setLineDash([]);
    // arrowhead at the vanishing end
    const ang = Math.atan2(ey-my, ex-mx);
    g.beginPath();
    g.moveTo(ex,ey);
    g.lineTo(ex-Math.cos(ang-0.4)*11, ey-Math.sin(ang-0.4)*11);
    g.moveTo(ex,ey);
    g.lineTo(ex-Math.cos(ang+0.4)*11, ey-Math.sin(ang+0.4)*11);
    g.stroke();
  }
}

/* ---- a single SHIP silhouette: long galley hull with raised prow & stern,
   a clear mast, and a curved-foot square sail — a legible Homeric ship. ---- */
function ship(g,x,y,s,fillL){
  // hull — long boat, tips raised at stern (left) and prow (right)
  ghost(g, ()=>{
    g.moveTo(x-s*1.30, y-s*0.34);                // stern tip
    g.quadraticCurveTo(x-s*1.00, y+s*0.02, x-s*0.70, y+s*0.30);
    g.quadraticCurveTo(x, y+s*0.56, x+s*0.70, y+s*0.30);
    g.quadraticCurveTo(x+s*1.00, y+s*0.02, x+s*1.30, y-s*0.34); // prow tip
    g.quadraticCurveTo(x+s*0.55, y+s*0.06, x-s*0.55, y+s*0.06);
    g.closePath();
  }, fillL, fillL+2, 1.6);
  // mast
  g.strokeStyle = inkLevel(clamp(fillL+2,1,6)); g.lineWidth = 2.2; g.lineCap="round";
  g.beginPath(); g.moveTo(x, y+s*0.08); g.lineTo(x, y-s*1.55); g.stroke();
  // yard + square sail (curved foot billowing)
  ghost(g, ()=>{
    g.moveTo(x-s*0.78, y-s*1.38);
    g.lineTo(x+s*0.78, y-s*1.38);
    g.lineTo(x+s*0.62, y-s*0.52);
    g.quadraticCurveTo(x, y-s*0.26, x-s*0.62, y-s*0.52);
    g.closePath();
  }, fillL+1, fillL+2, 1.5);
}

/* ---- FLEET register: rows of ships receding to the horizon, fainter and
   smaller with depth; the near row bobs on the swell of memory. Fewer, larger
   ships so each still reads as a ship under the halftone. ---- */
function drawFleet(g,W,H,t){
  const hz = H*params.horizon;
  const rows = params.fleetRows;
  for(let r=0;r<rows;r++){
    const depth = r/(rows-1);                    // 0 near .. 1 far (at horizon)
    const y = lerp(H*0.66, hz+H*0.02, depth);
    const s = lerp(34, 15, depth);
    const base = lerp(4, 2, depth);              // near rows darker, far faint
    const count = Math.round(lerp(3, 5, depth));
    for(let i=0;i<count;i++){
      const x = lerp(W*0.16, W*0.84, count===1?0.5:i/(count-1)) + (r%2)*W*0.06;
      const bob = (1-depth)*Math.sin(t*1.3 + i*0.9 + r)*s*0.10;
      const fillL = Math.round(surface(base, t, 0.8, i*0.7 + r*2, 0.9));
      ship(g, x, y+bob, s, fillL);
    }
  }
}

/* ---- a single FALLEN HERO: a reclining silhouette, round shield, laid spear. */
function fallen(g,x,y,s,fillL){
  // body — a low mound with a head bump at one end
  ghost(g, ()=>{
    g.moveTo(x-s*1.3, y);
    g.quadraticCurveTo(x-s*1.3, y-s*0.6, x-s*0.7, y-s*0.6);
    g.quadraticCurveTo(x+s*0.9, y-s*0.55, x+s*1.3, y-s*0.15);
    g.quadraticCurveTo(x+s*1.35, y, x+s*1.3, y);
    g.closePath();
  }, fillL, fillL+2, 1.5);
  // head
  ghost(g, ()=> g.arc(x-s*1.15, y-s*0.62, s*0.34, 0, TAU), fillL, fillL+2, 1.5);
  // shield resting beside
  ghost(g, ()=> g.arc(x+s*0.2, y-s*0.05, s*0.5, Math.PI, TAU), fillL+1, fillL+2, 1.5);
  // spear laid across
  g.strokeStyle = inkLevel(clamp(fillL+2,1,6)); g.lineWidth = 2;
  g.beginPath(); g.moveTo(x-s*1.6, y+s*0.12); g.lineTo(x+s*1.6, y-s*0.22); g.stroke();
}

/* ---- FALLEN register: the ground band of the dead, laid in a receding row. -- */
function drawFallen(g,W,H,t){
  const y = H*params.fallenY, n = params.fallen;
  for(let i=0;i<n;i++){
    const x = lerp(W*0.14, W*0.86, i/(n-1));
    const s = lerp(24, 30, pr(i,4));
    const base = 3 + (i%2);                       // near memory, a bit stronger
    const fillL = Math.round(surface(base, t, 0.6, i*2.1, 1.0));
    fallen(g, x, y + Math.sin(i*1.7)*H*0.015, s, fillL);
  }
}

/* ---- memory MOTES: faint specks rising from the voice up through the strata,
   the war being recalled into the field. ---- */
function drawMotes(g,W,H,t,srcX,srcY){
  const n = params.motes;
  for(let i=0;i<n;i++){
    const ph = frac(t*0.12 + pr(i,5));            // 0 at source .. 1 high in field
    const x = lerp(srcX + (pr(i,6)-0.5)*W*0.5, W*0.5 + (pr(i,8)-0.5)*W*0.9, ph);
    const y = lerp(srcY, H*params.councilY, ph);
    const r = lerp(3.2, 1.2, ph);                 // dwindle as it joins the far memory
    g.fillStyle = inkLevel(clamp(Math.round(4-ph*2),1,4));
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
}

/* ---- SOURCE: Nestor's narration — a voice emitter at the base from which the
   whole field rises. A small crisp mouth glyph + radiating sound arcs, the one
   hard-contour mark that anchors the ghost field. ---- */
function drawSource(g,W,H,t){
  const sx = W*0.5, sy = H*0.925;
  const pulse = 0.5 + 0.5*Math.sin(t*2.2);
  // radiating narration arcs sweeping UP into the field
  for(let k=0;k<4;k++){
    const r = W*0.05 + k*W*0.05 + pulse*W*0.01*(k+1);
    g.strokeStyle = inkLevel(clamp(4-k,1,4)); g.lineWidth = lerp(3.5,1.5,k/4);
    g.lineCap="round";
    g.beginPath(); g.ellipse(sx, sy, r, r*0.9, 0, Math.PI*1.15, Math.PI*1.85); g.stroke();
  }
  // the mouth/voice glyph — crisp, the anchor mark
  const pen = makePen(g,{outline:true});
  pen.paint(()=> g.ellipse(sx, sy, W*0.03, H*0.014, 0, 0, TAU), toneSolid(inkLevel(6)), 3);
  g.fillStyle = inkLevel(0);
  g.beginPath(); g.ellipse(sx, sy, W*0.012, H*0.005, 0, 0, TAU); g.fill();
}

function drawFX(ctx,W,H,st){
  const g = ctx;
  const t = st.t || 0;
  const layers = st.layers || ["field","councils","routes","fleet","fallen","motes","source"];
  const has = l => layers.includes(l);

  if (has("field"))    drawField(g,W,H);
  if (has("councils")) drawCouncils(g,W,H,t);
  if (has("routes"))   drawRoutes(g,W,H,t);
  if (has("fleet"))    drawFleet(g,W,H,t);
  if (has("fallen"))   drawFallen(g,W,H,t);
  if (has("motes"))    drawMotes(g,W,H,t, W*0.5, H*0.90);
  if (has("source"))   drawSource(g,W,H,t);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.troy-memory-field",
  type:"DIVINE_FX",
  name:"Troy-memory field",
  statusWord:"RECOLLECTING",
  scene:"OD-B03-S02",

  params,
  // back -> front; scene state may pass a subset to isolate a stratum
  layers:["field","councils","routes","fleet","fallen","motes","source"],
  // normalized 0..1 anchors: the source voice, each recollection stratum, the
  // parting point of the divided routes
  anchors:{
    "source:nestor-voice":{x:.50,y:.925},
    "field:councils":{x:.50,y:.17},
    "field:routes":{x:.50,y:.35},
    "field:fleet":{x:.50,y:.58},
    "field:fallen":{x:.50,y:.80},
    "node:parting":{x:.50,y:.35},      // where the homeward routes divide
    "horizon:sea":{x:.50,y:.48},
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions of the field (for scene placement / occlusion)
  zones:{
    sky:{ x0:.0,y0:.0,x1:1,y1:.48 },
    sea:{ x0:.0,y0:.48,x1:1,y1:1 },
  },

  // DIVINE_FX state machine: source -> field strata surfacing -> transform,
  // with a duration over which the recollection plays.
  states:{
    initial:"layered",
    nodes:{
      // gathering: the voice begins, only the far councils faintly present (low t)
      gathering:{ preview:{ t:0.4, status:"GATHERING", progress:.22,
        layers:["field","councils","source"] } },
      // layered: the full field of recollection surfaces at once (neutral)
      layered:{ preview:{ t:2.4, status:"RECOLLECTING", progress:.55,
        layers:["field","councils","routes","fleet","fallen","motes","source"] } },
      // dispersing: the divided routes dominate, the host scatters home (high t)
      dispersing:{ preview:{ t:4.6, status:"DISPERSING", progress:.85,
        layers:["field","routes","fleet","motes","source"] } },
    },
    edges:[["gathering","layered"],["layered","dispersing"],
           ["dispersing","layered"],["layered","gathering"]],
  },
  duration:7.0,
  channels:["surface","drift","routes","intensity","t"],

  preview:()=>({ t:2.4, status:"RECOLLECTING", progress:.55,
    layers:["field","councils","routes","fleet","fallen","motes","source"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
