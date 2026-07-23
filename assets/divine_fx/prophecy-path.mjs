/* divine_fx.prophecy-path — Tiresias' branching prophecy rendered as a routing
   diagram. DIVINE_FX asset.
   Scene function (OD-B11-S03): a fork keyed to the cattle of Helios. From a
   SOURCE oracle node a dashed trunk descends to a FORK; the route splits into two
   outcome branches — CATTLE SPARED -> a whole ship sailing safe home (check glyph),
   CATTLE KILLED -> a broken wreck sinking in the swell (cross glyph). The spared
   branch continues INLAND to an OAR planted upright as a marker (the second
   prophecy: carry the oar until it is mistaken for a winnowing fan).

   DIVINE_FX contract: SOURCE (the oracle node) -> FIELD (both possible futures
   drawn as the branching route) -> TRANSFORM (one outcome resolved + emphasised)
   -> visible CONSEQUENCE (safe home + the inland oar, or the wreck). Animates over
   state.t: a token travels the trunk, the dashed routes flow (marching ants), and
   the reveal walks source -> field -> transform.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* normalized node positions (0..1 asset space, portrait) */
const NODE = {
  source:{ x:0.50, y:0.135 },   // oracle / prophecy origin
  fork:{   x:0.50, y:0.400 },   // the decision node
  ship:{   x:0.255,y:0.665 },   // CATTLE SPARED -> safe home ship
  wreck:{  x:0.755,y:0.665 },   // CATTLE KILLED -> wreck
  oar:{    x:0.310,y:0.905 },   // inland oar marker (continues from ship)
};

const params = {
  branchY:0.400,     // elbow height where the trunk splits
  flow:22,           // marching-ants speed along the routes
  node:NODE,
};

/* ---- a dashed elbow polyline between waypoints, flowing over t ---- */
function route(g, pts, lw, off, dash){
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round"; g.lineJoin="round";
  g.setLineDash(dash); g.lineDashOffset=off;
  g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
  for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x, pts[i].y);
  g.stroke(); g.setLineDash([]);
}
/* small solid arrowhead pointing along dir (unit) at p */
function arrowhead(g, p, dir, s){
  const nx=-dir.y, ny=dir.x;
  g.fillStyle=INK; g.beginPath();
  g.moveTo(p.x, p.y);
  g.lineTo(p.x-dir.x*s+nx*s*0.6, p.y-dir.y*s+ny*s*0.6);
  g.lineTo(p.x-dir.x*s-nx*s*0.6, p.y-dir.y*s-ny*s*0.6);
  g.closePath(); g.fill();
}

/* ---- outcome glyph: a whole ship sailing (SPARED / safe home) ---- */
function drawShip(g,pen,cx,cy,u){
  // water line
  g.strokeStyle=INK; g.lineWidth=Math.max(1.6,u*0.05); g.lineCap="round";
  for(let k=0;k<2;k++){ const yy=cy+u*(0.62+k*0.24);
    g.beginPath(); g.moveTo(cx-u*1.15, yy);
    for(let x=-1.15;x<=1.15;x+=0.28){ g.quadraticCurveTo(cx+u*(x+0.07)*1, yy-u*0.10, cx+u*(x+0.14), yy); }
    g.stroke(); }
  // hull (trapezoid)
  pen.paint(()=>{
    g.moveTo(cx-u*0.95, cy+u*0.30);
    g.lineTo(cx+u*0.95, cy+u*0.30);
    g.lineTo(cx+u*0.62, cy+u*0.66);
    g.lineTo(cx-u*0.62, cy+u*0.66);
    g.closePath();
  }, toneSolid(inkLevel(5)), Math.max(3,u*0.09));
  // curved prow post
  pen.limb(()=>{ g.moveTo(cx+u*0.95,cy+u*0.30); g.quadraticCurveTo(cx+u*1.25,cy+u*0.02,cx+u*1.08,cy-u*0.14); },
           toneSolid(inkLevel(5)), Math.max(2,u*0.10));
  // mast
  pen.limb(()=>{ g.moveTo(cx, cy+u*0.30); g.lineTo(cx, cy-u*0.95); }, toneSolid(inkLevel(6)), Math.max(2,u*0.09));
  // billowing sail (light, so it reads open/whole)
  pen.paint(()=>{
    g.moveTo(cx, cy-u*0.90);
    g.quadraticCurveTo(cx+u*0.85, cy-u*0.55, cx+u*0.70, cy+u*0.14);
    g.lineTo(cx, cy+u*0.14);
    g.closePath();
  }, toneSolid(inkLevel(2)), Math.max(2,u*0.07));
}

/* ---- outcome glyph: a broken wreck, capsizing prow-up (KILLED) ---- */
function drawWreck(g,pen,cx,cy,u){
  // the sea line the wreck founders on (light, drawn first)
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,u*0.05); g.lineCap="round"; g.globalAlpha=0.85;
  const seaY=cy+u*0.30;
  g.beginPath(); g.moveTo(cx-u*1.25, seaY);
  for(let x=-1.25;x<=1.25;x+=0.25){ g.quadraticCurveTo(cx+u*(x+0.06), seaY-u*0.16, cx+u*(x+0.12), seaY); }
  g.stroke(); g.globalAlpha=1;
  // main hull, tilted prow-up and sinking stern-first (single clear boat shape)
  g.save(); g.translate(cx,cy); g.rotate(-0.30);
  pen.paint(()=>{
    g.moveTo(-u*1.02, -u*0.16);   // raised prow tip
    g.lineTo( u*0.66,  u*0.30);    // sinking stern top
    g.lineTo( u*0.44,  u*0.66);    // stern underside
    g.lineTo(-u*0.66,  u*0.28);    // keel curve back to prow
    g.closePath();
  }, toneSolid(inkLevel(6)), Math.max(3,u*0.09));
  // the snapped-off stern plank drifting away below-right
  pen.paint(()=>{
    g.moveTo(u*0.72, u*0.44);
    g.lineTo(u*1.16, u*0.70);
    g.lineTo(u*0.98, u*0.92);
    g.lineTo(u*0.60, u*0.72);
    g.closePath();
  }, toneSolid(inkLevel(4)), Math.max(2,u*0.08));
  // jagged break where the stern tore off
  g.strokeStyle=INK; g.lineWidth=Math.max(2,u*0.055); g.lineCap="round";
  g.beginPath(); g.moveTo(u*0.66,u*0.30); g.lineTo(u*0.56,u*0.46); g.lineTo(u*0.68,u*0.56); g.lineTo(u*0.60,u*0.70); g.stroke();
  // snapped mast toppling off the raised prow
  pen.limb(()=>{ g.moveTo(-u*0.34,u*0.02); g.lineTo(-u*0.86,-u*0.86); }, toneSolid(inkLevel(6)), Math.max(2,u*0.085));
  g.strokeStyle=INK; g.lineWidth=Math.max(2,u*0.07);
  g.beginPath(); g.moveTo(-u*0.60,-u*0.42); g.lineTo(-u*0.44,-u*0.56); g.stroke(); // snap kink on mast
  g.restore();
}

/* ---- inland oar planted upright as a marker ---- */
function drawOar(g,pen,cx,cy,u){
  // low inland mound with hatch (land, not sea)
  pen.paint(()=>{ g.moveTo(cx-u*1.05,cy+u*0.55);
    g.quadraticCurveTo(cx,cy-u*0.02,cx+u*1.05,cy+u*0.55); g.closePath(); },
    toneSolid(inkLevel(3)), Math.max(2,u*0.07));
  g.strokeStyle=INK; g.lineWidth=Math.max(1.2,u*0.035); g.lineCap="round"; g.globalAlpha=0.7;
  for(let i=-3;i<=3;i++){ const x=cx+i*u*0.24; g.beginPath(); g.moveTo(x,cy+u*0.50); g.lineTo(x+u*0.10,cy+u*0.36); g.stroke(); }
  g.globalAlpha=1;
  // shaft, planted into the mound and rising
  pen.limb(()=>{ g.moveTo(cx, cy+u*0.30); g.lineTo(cx, cy-u*0.95); }, toneSolid(inkLevel(5)), Math.max(2,u*0.10));
  // flat paddle blade at the top (leaf-shaped, clearly a broad oar blade)
  pen.paint(()=>{
    g.moveTo(cx, cy-u*0.80);
    g.quadraticCurveTo(cx+u*0.30, cy-u*1.10, cx+u*0.22, cy-u*1.62);
    g.quadraticCurveTo(cx+u*0.12, cy-u*1.92, cx, cy-u*1.98);
    g.quadraticCurveTo(cx-u*0.12, cy-u*1.92, cx-u*0.22, cy-u*1.62);
    g.quadraticCurveTo(cx-u*0.30, cy-u*1.10, cx, cy-u*0.80);
    g.closePath();
  }, toneSolid(inkLevel(4)), Math.max(2,u*0.07));
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,u*0.05); g.lineCap="round";
  g.beginPath(); g.moveTo(cx,cy-u*0.86); g.lineTo(cx,cy-u*1.88); g.stroke(); // blade spine
}

/* ---- oracle SOURCE node: a diamond eye with radiating divine rays ---- */
function drawSource(g,pen,cx,cy,u,t){
  // radiating rays (the prophecy issuing outward)
  g.strokeStyle=INK; g.lineCap="round";
  for(let k=0;k<12;k++){ const a=k/12*TAU + t*0.15;
    const r0=u*1.15, r1=u*(1.45+0.14*Math.sin(t*2+k));
    g.lineWidth=Math.max(1.4,u*0.05);
    g.beginPath(); g.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
    g.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1); g.stroke(); }
  // diamond body
  pen.paint(()=>{ g.moveTo(cx,cy-u); g.lineTo(cx+u,cy); g.lineTo(cx,cy+u); g.lineTo(cx-u,cy); g.closePath(); },
            toneSolid(inkLevel(5)), Math.max(3,u*0.12));
  // eye
  pen.paint(()=>{ g.ellipse(cx,cy,u*0.62,u*0.36,0,0,TAU); }, toneSolid(inkLevel(1)), Math.max(2,u*0.08));
  g.fillStyle=INK; g.beginPath(); g.arc(cx,cy,u*0.22,0,TAU); g.fill();
  g.fillStyle=inkLevel(0); g.beginPath(); g.arc(cx-u*0.06,cy-u*0.06,u*0.07,0,TAU); g.fill();
}

/* ---- fork decision node ---- */
function drawForkNode(g,pen,cx,cy,u){
  pen.paint(()=>{ g.arc(cx,cy,u,0,TAU); }, toneSolid(inkLevel(4)), Math.max(3,u*0.16));
  // split hint: a small Y inside
  g.strokeStyle=INK; g.lineWidth=Math.max(2,u*0.16); g.lineCap="round";
  g.beginPath();
  g.moveTo(cx,cy+u*0.5); g.lineTo(cx,cy);
  g.moveTo(cx,cy); g.lineTo(cx-u*0.55,cy-u*0.5);
  g.moveTo(cx,cy); g.lineTo(cx+u*0.55,cy-u*0.5);
  g.stroke();
}

/* ---- an outcome marker: small circle with a check (spared) or cross (killed) ---- */
function outcomeMark(g, cx, cy, r, kind){
  g.fillStyle=inkLevel(0); g.beginPath(); g.arc(cx,cy,r*1.28,0,TAU); g.fill();   // halo
  g.strokeStyle=INK; g.lineWidth=Math.max(2,r*0.34); g.beginPath(); g.arc(cx,cy,r,0,TAU); g.stroke();
  g.lineCap="round"; g.lineWidth=Math.max(2,r*0.34); g.beginPath();
  if(kind==="check"){ g.moveTo(cx-r*0.5,cy+r*0.02); g.lineTo(cx-r*0.08,cy+r*0.46); g.lineTo(cx+r*0.56,cy-r*0.42); }
  else { g.moveTo(cx-r*0.42,cy-r*0.42); g.lineTo(cx+r*0.42,cy+r*0.42);
         g.moveTo(cx+r*0.42,cy-r*0.42); g.lineTo(cx-r*0.42,cy+r*0.42); }
  g.stroke();
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.0);
  const branch=st.branch||"none";               // "spared" | "killed" | "none"
  const layers=st.layers || ["taxis","routes","source","fork","outcomes","token"];
  const has=l=>layers.includes(l);

  const P=k=>({ x:NODE[k].x*W, y:NODE[k].y*H });
  const S=P("source"), F=P("fork"), SH=P("ship"), WR=P("wreck"), OA=P("oar");
  const nodeR=W*0.052, u=W*0.088;
  const off = -t*params.flow*12;
  const dash=[W*0.026, W*0.020];

  // ---- open field wash (light) so the diagram sits on paper ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,H);

  // ---- t-axis on the far left: source -> field -> transform over time ----
  if (has("taxis")){
    const ax=W*0.075, y0=H*0.09, y1=H*0.93;
    g.strokeStyle=INK; g.lineWidth=Math.max(1.6,W*0.005); g.lineCap="round";
    g.beginPath(); g.moveTo(ax,y0); g.lineTo(ax,y1); g.stroke();
    arrowhead(g,{x:ax,y:y1},{x:0,y:1},W*0.022);
    // three phase ticks
    const ticks=[0.135,0.40,0.82];
    for(const ty of ticks){ const y=lerp(y0,y1,(ty-0.09)/(0.93-0.09));
      g.beginPath(); g.moveTo(ax-W*0.018,H*ty); g.lineTo(ax+W*0.018,H*ty); g.stroke(); }
    // a moving time cursor
    const cy=lerp(y0,y1,clamp01(t));
    g.fillStyle=INK; g.beginPath(); g.moveTo(ax+W*0.02,cy); g.lineTo(ax+W*0.048,cy-W*0.018); g.lineTo(ax+W*0.048,cy+W*0.018); g.closePath(); g.fill();
  }

  // ---- the dashed branching ROUTE (the whole field of possible futures) ----
  if (has("routes")){
    const spared = branch==="spared", killed=branch==="killed";
    const trunkW=Math.max(3,W*0.011);
    const aW=Math.max(3,W*0.011)*(spared?1.5:killed?0.7:1);
    const bW=Math.max(3,W*0.011)*(killed?1.5:spared?0.7:1);
    // trunk: source -> fork
    route(g,[{x:S.x,y:S.y+nodeR}, {x:F.x,y:F.y-nodeR}], trunkW, off, dash);
    // branch A (spared): fork -> elbow left -> ship
    route(g,[{x:F.x,y:F.y}, {x:SH.x,y:F.y+H*0.02}, {x:SH.x,y:SH.y-u*1.4}], aW, off, dash);
    // branch B (killed): fork -> elbow right -> wreck
    route(g,[{x:F.x,y:F.y}, {x:WR.x,y:F.y+H*0.02}, {x:WR.x,y:WR.y-u*1.3}], bW, off, dash);
    // inland continuation: ship -> oar
    route(g,[{x:SH.x,y:SH.y+u*0.9}, {x:SH.x,y:OA.y-u*1.9}, {x:OA.x,y:OA.y-u*1.9}, {x:OA.x,y:OA.y-u*1.3}],
          aW*0.9, off, dash);
    // direction arrowheads at the branch entries
    arrowhead(g,{x:SH.x,y:SH.y-u*1.4},{x:0,y:1},W*0.02);
    arrowhead(g,{x:WR.x,y:WR.y-u*1.3},{x:0,y:1},W*0.02);
    arrowhead(g,{x:OA.x,y:OA.y-u*1.3},{x:0,y:1},W*0.018);
  }

  // ---- SOURCE oracle node ----
  if (has("source")) drawSource(g,pen,S.x,S.y,nodeR,st.t?t*6:0);

  // ---- FORK decision node ----
  if (has("fork")) drawForkNode(g,pen,F.x,F.y,nodeR*0.72);

  // ---- OUTCOME glyphs + their spared/killed marks ----
  if (has("outcomes")){
    const spared = branch==="spared", killed=branch==="killed";
    // spared branch: ship home + inland oar (dim if the killed branch is resolved)
    g.save(); g.globalAlpha = killed?0.32:1;
    drawShip(g,pen,SH.x,SH.y,u);
    drawOar(g,pen,OA.x,OA.y,u*0.9);
    g.restore();
    // killed branch: wreck (dim if the spared branch is resolved)
    g.save(); g.globalAlpha = spared?0.32:1;
    drawWreck(g,pen,WR.x,WR.y,u);
    g.restore();
    // outcome marks
    g.save(); g.globalAlpha = killed?0.4:1; outcomeMark(g, SH.x+u*1.15, SH.y-u*1.05, W*0.030, "check"); g.restore();
    g.save(); g.globalAlpha = spared?0.4:1; outcomeMark(g, WR.x+u*1.15, WR.y-u*1.05, W*0.030, "cross"); g.restore();
  }

  // ---- traveling TOKEN: walks the trunk, then down the chosen (or nearer) branch ----
  if (has("token")){
    let px,py;
    if (t<0.45){ const k=t/0.45; px=lerp(S.x,F.x,k); py=lerp(S.y+nodeR,F.y-nodeR,k); }
    else {
      const k=clamp01((t-0.45)/0.55);
      const tgt = branch==="killed"?WR:SH;
      // elbow: horizontal to the branch column, then down
      if (k<0.4){ const kk=k/0.4; px=lerp(F.x,tgt.x,kk); py=F.y+H*0.02; }
      else { const kk=(k-0.4)/0.6; px=tgt.x; py=lerp(F.y+H*0.02, tgt.y-u*1.35, kk); }
    }
    g.fillStyle=inkLevel(0); g.beginPath(); g.arc(px,py,W*0.020,0,TAU); g.fill();
    g.fillStyle=INK; g.beginPath(); g.arc(px,py,W*0.013,0,TAU); g.fill();
  }

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.prophecy-path",
  type:"DIVINE_FX",
  name:"Prophecy path",
  statusWord:"FORESEEN",
  scene:"OD-B11-S03",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["taxis","routes","source","fork","outcomes","token"],
  // normalized 0..1 source/field/outcome/camera anchors
  anchors:{
    "source:oracle":{  x:0.50, y:0.135 },   // prophecy origin (source)
    "field:fork":{     x:0.50, y:0.400 },    // the decision node (field split)
    "outcome:spared":{ x:0.255,y:0.665 },    // safe-home ship (cattle spared)
    "outcome:killed":{ x:0.755,y:0.665 },    // wreck (cattle killed)
    "marker:oar":{     x:0.310,y:0.905 },    // inland oar marker
    "camera:wide":{    x:0.50, y:0.50 },
  },
  // diagram bands: the routing field, and the two outcome columns
  zones:{ field:{ x0:0.10,y0:0.06,x1:0.90,y1:0.46 },
          spared:{ x0:0.06,y0:0.50,x1:0.46,y1:0.98 },
          killed:{ x0:0.54,y0:0.50,x1:0.96,y1:0.80 } },
  // DIVINE_FX states: source issues -> field of two futures -> one outcome resolves
  states:{
    initial:"field",
    nodes:{
      source:{ preview:{ t:0.05, branch:"none",   status:"UTTERED",  progress:0.06,
                          layers:["taxis","routes","source","fork"] } },
      field:{  preview:{ t:0.42, branch:"none",   status:"FORESEEN", progress:0.42,
                          layers:["taxis","routes","source","fork","outcomes","token"] } },
      spared:{ preview:{ t:1.00, branch:"spared", status:"SPARED",   progress:1.00,
                          layers:["taxis","routes","source","fork","outcomes","token"] } },
      killed:{ preview:{ t:1.00, branch:"killed", status:"KILLED",   progress:1.00,
                          layers:["taxis","routes","source","fork","outcomes","token"] } },
    },
    edges:[["source","field"],["field","spared"],["field","killed"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","branch","reveal","flow"],

  // neutral preview: the full field of both futures, token descending the trunk.
  preview:()=>({ t:0.42, branch:"none", status:"FORESEEN", progress:0.42,
                 layers:["taxis","routes","source","fork","outcomes","token"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
