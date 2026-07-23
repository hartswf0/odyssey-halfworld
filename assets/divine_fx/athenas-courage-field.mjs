/* divine_fx.athenas-courage-field — Athena's courage steadies a mortal without
   ever showing herself. DIVINE_FX asset. Scene function (OD-B06-S03): Nausicaa
   stands before the strange castaway and her nerve wavers; an INVISIBLE goddess
   pours steadiness into her — no visible divinity, only the CONSEQUENCE. The
   field grips her stance at the feet (faint concentric grounding rings), drops a
   plumb steadying-axis down her spine so her sway is pulled back to true, and
   firms her gaze into a fixed forward line locked on a focus reticle. A compact
   steadiness GLYPH (a plumb-on-a-stable-base emblem) reads the field's charge.

   Procedural over state.t + intensity/lock:
     SOURCE   (t≈.3, low)  — the unseen origin gathers; rings faint, gaze loose,
                             the mortal still swaying (lock≈0).
     FIELD    (t≈1.4, mid) — grounding rings resolve, aura brackets close in, the
                             plumb axis firms, gaze begins to fix.
     TRANSFORM(t≈2.6, full)— stance locked to plumb (sway damped ~0), gaze-line
                             firm on its reticle, glyph fully charged: STEADIED.
   The figure's sway = sin(t)·amp·(1−lock): as the field takes, she stops swaying
   and aligns with the dead-vertical divine plumb — the visible consequence.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  groundLevel: 0.82,   // the floor the mortal stands on, frac of H
  figX:        0.42,   // figure stance-center x, frac of W (gaze streams right)
  rings:       4,      // concentric grounding rings at the feet
  swayAmp:     0.030,  // untended sway amplitude, frac of W (damped by lock)
  gazeDir:     1,      // +1 = gaze streams to the right
  intensity:   1.0,    // field charge (channel-driven)
};

/* ---------- host: the standing mortal (Nausicaa) the field steadies. Drawn as a
   simple draped standing silhouette — NOT a detailed character — so the divine
   marks over her read. Feet stay planted; the upper body LEANS by `sway` while
   the divine plumb stays true, so the correction is legible. Returns geometry. */
function drawFigure(pen,g,W,H,geo,sway){
  const { cx, groundY, headR } = geo;
  const uo   = sway;                                   // upper-body lean offset
  const shY  = geo.shoulderY, hipY = geo.hipY;
  const shHalf = W*0.075, hemHalf = W*0.115, footHalf = W*0.055;
  const headCx = cx + uo*1.35, headCy = geo.headCy;
  const shCx   = cx + uo;

  // ground contact shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, groundY+4, W*0.14, H*0.016, 0,0,TAU); g.fill();

  // feet planted apart (fixed — the anchored stance)
  const foot = toneSolid(inkLevel(6));
  pen.paint(()=>{ g.ellipse(cx-footHalf, groundY, W*0.045, H*0.014, 0,0,TAU); }, foot, 4);
  pen.paint(()=>{ g.ellipse(cx+footHalf, groundY, W*0.045, H*0.014, 0,0,TAU); }, foot, 4);

  // draped chiton: shoulders -> wide hem at the ankles (a standing robed figure).
  // Kept mid-light so the divine plumb axis + drape seams read over her.
  const gown = toneSolid(inkLevel(3));
  pen.paint(()=>{
    g.moveTo(shCx-shHalf, shY);
    g.lineTo(shCx+shHalf, shY);
    g.lineTo(cx+hemHalf, groundY-H*0.010);
    g.quadraticCurveTo(cx, groundY+H*0.006, cx-hemHalf, groundY-H*0.010);
    g.closePath();
  }, gown, 5);
  // drape seams (fall lines) — bow slightly with the lean
  g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round";
  for(let s=-1;s<=1;s++){
    const topX = shCx + s*shHalf*0.55, botX = cx + s*hemHalf*0.62;
    g.beginPath(); g.moveTo(topX, shY+H*0.02);
    g.quadraticCurveTo((topX+botX)/2 + uo*0.4, (shY+groundY)/2, botX, groundY-H*0.02);
    g.stroke();
  }
  // waist sash
  pen.ink(()=>{ g.moveTo(shCx-shHalf*0.9, hipY); g.lineTo(shCx+shHalf*0.9, hipY); }, 3);

  // neck + head (light skin so the gaze/hair read)
  pen.limb(()=>{ g.moveTo(shCx, shY); g.lineTo(headCx, headCy+headR*0.7); }, toneSolid(inkLevel(3)), W*0.020);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,TAU); }, toneSolid(inkLevel(3)), 4);
  // hair (bound back) — a dark cap + a small gathered knot behind
  const hair = toneSolid(inkLevel(6));
  pen.paint(()=>{
    g.moveTo(headCx-headR*0.95, headCy);
    g.quadraticCurveTo(headCx, headCy-headR*1.5, headCx+headR*0.95, headCy);
    g.quadraticCurveTo(headCx+headR*0.5, headCy-headR*0.55, headCx, headCy-headR*0.5);
    g.quadraticCurveTo(headCx-headR*0.5, headCy-headR*0.55, headCx-headR*0.95, headCy);
  }, hair, 3);
  pen.paint(()=>{ g.ellipse(headCx-geo.gaze*headR*0.9, headCy+headR*0.05, headR*0.34, headR*0.42, 0,0,TAU); }, hair, 3);

  return { headCx, headCy, headR, shCx, shY };
}

/* ---------- FIELD · grounding rings: faint concentric ellipses gripping the
   stance at the feet. They resolve outward as the field charges and breathe on t. */
function drawRings(pen,g,W,H,geo,t,inten){
  const { cx, groundY } = geo;
  const n = params.rings, ch = clamp(inten,0,1.5);
  g.lineCap="round";
  for(let k=0;k<n;k++){
    const f = k/(n-1);
    // outer rings only appear once the field is charged enough
    if (ch < 0.25 + f*0.55) continue;
    const puls = 1 + 0.03*Math.sin(t*1.4 - k*0.9);
    const rx = lerp(W*0.085, W*0.30, f) * puls;
    const ry = rx*0.26;
    const lvl = Math.round(lerp(5, 2, f) * clamp(0.5+ch*0.6,0,1) + 0.5);
    g.strokeStyle = inkLevel(clamp(lvl,1,6));
    g.lineWidth = lerp(3.2, 1.4, f);
    g.beginPath(); g.ellipse(cx, groundY, rx, ry, 0, 0, TAU); g.stroke();
  }
  // radial grip ticks off the innermost ring (short spokes anchoring the stance)
  const rIn = W*0.11;
  g.strokeStyle = inkLevel(clamp(3+Math.round(ch*2),1,6)); g.lineWidth = 2.4;
  for(let a=0;a<8;a++){
    const th = a/8*TAU;
    const ex=cx+Math.cos(th)*rIn, ey=groundY+Math.sin(th)*rIn*0.26;
    g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex+Math.cos(th)*W*0.02, ey+Math.sin(th)*W*0.02*0.26); g.stroke();
  }
}

/* ---------- FIELD · aura brackets: two faint steadying parentheses closing in on
   the stance from either side (the unseen goddess's embrace), tightening with the
   field, + short upward steadying ticks rising along them. ---------- */
function drawAura(pen,g,W,H,geo,t,inten){
  const { cx, groundY, shoulderY } = geo;
  const ch = clamp(inten,0,1.4);
  const spread = lerp(W*0.24, W*0.155, clamp01(ch));         // brackets close in as it takes
  const lvl = clamp(2+Math.round(ch*2),1,5);
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lerp(2, 3.4, clamp01(ch)); g.lineCap="round";
  for(const side of [-1,1]){
    const bx = cx + side*spread;
    g.beginPath();
    g.moveTo(bx + side*W*0.03, shoulderY - H*0.02);
    g.quadraticCurveTo(bx - side*W*0.02, (shoulderY+groundY)/2, bx + side*W*0.02, groundY+H*0.01);
    g.stroke();
    // upward steadying ticks along the bracket
    for(let k=0;k<4;k++){
      const yy = lerp(shoulderY, groundY, k/3) + Math.sin(t*2 + k + side)*3*(1-clamp01(ch));
      const xx = bx - side*W*0.005;
      g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx - side*W*0.018, yy - H*0.02); g.stroke();
    }
  }
}

/* ---------- CONSEQUENCE · plumb steadying-axis: a dead-vertical divine line down
   the stance-center with graduated level ticks + a plumb bob between the feet. The
   figure leans (sway) but the plumb stays true — she is pulled back to it. -------- */
function drawPlumb(pen,g,W,H,geo,inten){
  const { cx, groundY, headCy, headR } = geo;
  const ch = clamp(inten,0,1.4);
  const topY = headCy - headR*0.2, botY = groundY - H*0.006;
  const lvl = clamp(3+Math.round(ch*3),3,7);
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lerp(2, 4, clamp01(ch)); g.lineCap="round";
  g.beginPath(); g.moveTo(cx, topY); g.lineTo(cx, botY); g.stroke();
  // graduated level ticks crossing the axis (a plumb/level readout)
  g.lineWidth = 2.2;
  for(let k=1;k<=5;k++){
    const yy = lerp(topY, botY, k/6);
    const tw = (k%2===0? W*0.030 : W*0.018);
    g.beginPath(); g.moveTo(cx-tw, yy); g.lineTo(cx+tw, yy); g.stroke();
  }
  // plumb bob: a small dark diamond at the base center (between the planted feet)
  const by = groundY + H*0.006, bs = W*0.020;
  pen.paint(()=>{ g.moveTo(cx, by-bs); g.lineTo(cx+bs, by); g.lineTo(cx, by+bs); g.lineTo(cx-bs, by); g.closePath(); },
    toneSolid(inkLevel(lvl)), 3);
}

/* ---------- CONSEQUENCE · firm gaze-line: a fixed forward line from the eyes,
   locking onto a focus reticle. Untended it jitters; the field damps the jitter
   and lengthens/sharpens the line. ---------- */
function drawGaze(pen,g,W,H,geo,t,inten,lock){
  const dir = params.gazeDir, ch = clamp(inten,0,1.4);
  const ex = geo.headCx + dir*geo.headR*0.72, ey = geo.headCy - geo.headR*0.06;
  const len = lerp(W*0.10, W*0.32, clamp01(ch));
  const gx = ex + dir*len;
  const jit = Math.sin(t*7.5)*4*(1-clamp01(lock));           // wavering gaze, damped by lock
  const gy = ey + jit;
  const lvl = clamp(3+Math.round(ch*3.2),3,7);
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lerp(2, 4, clamp01(ch)); g.lineCap="round";
  // the sightline
  g.beginPath(); g.moveTo(ex, ey); g.lineTo(gx, gy); g.stroke();
  // focus reticle at the fixed point (sharpens with charge)
  const rr = lerp(W*0.014, W*0.026, clamp01(ch));
  g.lineWidth = 2.4;
  g.beginPath(); g.arc(gx, gy, rr, 0, TAU); g.stroke();
  g.beginPath();
  g.moveTo(gx-rr*1.7, gy); g.lineTo(gx-rr*0.6, gy);
  g.moveTo(gx+rr*0.6, gy); g.lineTo(gx+rr*1.7, gy);
  g.moveTo(gx, gy-rr*1.7); g.lineTo(gx, gy-rr*0.6);
  g.moveTo(gx, gy+rr*0.6); g.lineTo(gx, gy+rr*1.7);
  g.stroke();
}

/* ---------- READOUT · steadiness glyph: a compact emblem floating above — a plumb
   line dropping onto a wide stable base (apex-up triangle) inside a rounded shield.
   Its fill/weight read the field's charge. ---------- */
function drawGlyph(pen,g,W,H,inten){
  const ch = clamp(inten,0,1.4);
  const gx = W*0.79, gy = H*0.235, s = W*0.075;
  // shield frame (light plate)
  pen.paint(()=>{
    g.moveTo(gx-s, gy-s*0.9);
    g.lineTo(gx+s, gy-s*0.9);
    g.lineTo(gx+s, gy+s*0.35);
    g.quadraticCurveTo(gx, gy+s*1.15, gx-s, gy+s*0.35);
    g.closePath();
  }, toneSolid(inkLevel(2)), 4);
  // stable base triangle (apex up = firm footing), charged darkness
  const baseLvl = clamp(3+Math.round(ch*3),3,7);
  pen.paint(()=>{
    g.moveTo(gx, gy-s*0.45);
    g.lineTo(gx+s*0.62, gy+s*0.45);
    g.lineTo(gx-s*0.62, gy+s*0.45);
    g.closePath();
  }, toneSolid(inkLevel(baseLvl)), 3);
  // plumb line dropping through the apex to the base, + bob dot
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap="round";
  g.beginPath(); g.moveTo(gx, gy-s*0.72); g.lineTo(gx, gy+s*0.45); g.stroke();
  g.fillStyle = INK; g.beginPath(); g.arc(gx, gy+s*0.45, W*0.008, 0, TAU); g.fill();
  // charge pips beside the glyph (how firm the field is)
  const pips = Math.round(clamp01(ch/1.3)*3);
  for(let p=0;p<3;p++){
    g.beginPath(); g.arc(gx-s-W*0.02, gy-s*0.4+p*W*0.028, W*0.008, 0, TAU);
    g.fillStyle = p<pips ? inkLevel(6) : inkLevel(2); g.fill();
  }
}

/* ---------- SOURCE · the invisible origin: NO goddess. A faint dashed origin
   marker off the figure with a few thin dotted lines drifting toward her crown —
   the unseen font of steadiness. Kept very light so it reads as "not there." */
function drawSource(pen,g,W,H,geo,t,inten){
  const ch = clamp(inten,0,1.4);
  const sx = W*0.17, sy = H*0.135;
  g.save();
  g.strokeStyle = inkLevel(clamp(1+Math.round(ch*1.5),1,3));
  g.lineWidth = 1.8; g.setLineDash([4,5]); g.lineCap="round";
  g.beginPath(); g.arc(sx, sy, W*0.03, 0, TAU); g.stroke();
  // faint dotted conveyance toward the mortal's crown
  const tx = geo.headCx, ty = geo.headCy - geo.headR;
  for(let k=0;k<3;k++){
    const off=(k-1)*W*0.02;
    g.beginPath();
    g.moveTo(sx+off*0.3, sy+W*0.03);
    g.quadraticCurveTo((sx+tx)/2+off, (sy+ty)/2 - H*0.03, tx+off*0.4, ty);
    g.stroke();
  }
  g.restore();
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const lock  = st.lock ?? clamp(inten*0.85, 0, 1);
  const layers = st.layers || ["source","rings","aura","figure","plumb","gaze","glyph"];
  const has = l => layers.includes(l);

  const groundY = H*params.groundLevel, cx = W*params.figX;
  const shoulderY = groundY - H*0.40, hipY = groundY - H*0.205;
  const headR = W*0.052, headCy = shoulderY - H*0.078;
  const sway = Math.sin(t*1.1) * (W*params.swayAmp) * (1 - clamp01(lock));
  const geo = { cx, groundY, shoulderY, hipY, headR, headCy,
                headCx:cx, gaze:params.gazeDir };

  if (has("source")) drawSource(pen,g,W,H,geo,t,inten);
  if (has("rings"))  drawRings(pen,g,W,H,geo,t,inten);
  if (has("aura"))   drawAura(pen,g,W,H,geo,t,inten);
  if (has("figure")){ const fg = drawFigure(pen,g,W,H,geo,sway); geo.headCx=fg.headCx; geo.headCy=fg.headCy; }
  if (has("plumb"))  drawPlumb(pen,g,W,H,geo,inten);
  if (has("gaze"))   drawGaze(pen,g,W,H,geo,t,inten,lock);
  if (has("glyph"))  drawGlyph(pen,g,W,H,inten);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.athenas-courage-field",
  type:"DIVINE_FX",
  name:"Athena's courage field",
  statusWord:"STEADIED",
  scene:"OD-B06-S03",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["source","rings","aura","figure","plumb","gaze","glyph"],
  // normalized 0..1 source / field / target / consequence anchors
  anchors:{
    "source:invisible":{ x:0.17, y:0.135 },  // the unseen goddess-origin (no body)
    "target:mortal":{    x:0.42, y:0.50 },    // Nausicaa, the steadied figure
    "field:stance":{     x:0.42, y:0.82 },    // grounding-ring center at her feet
    "axis:plumb":{       x:0.42, y:0.60 },    // the dead-vertical steadying spine
    "gaze:focus":{       x:0.72, y:0.34 },    // the fixed forward focus reticle
    "readout:glyph":{    x:0.79, y:0.235 },   // the steadiness glyph
    "camera:wide":{      x:0.50, y:0.50 },
  },
  // affected regions
  zones:{
    stance:{ x0:0.14, y0:0.76, x1:0.70, y1:0.90 },   // grounding-ring footprint
    body:{   x0:0.28, y0:0.34, x1:0.56, y1:0.84 },   // the mortal the field holds
    sight:{  x0:0.46, y0:0.30, x1:0.82, y1:0.40 },   // the forward gaze corridor
  },
  // DIVINE_FX field states: unseen source -> field takes -> stance transformed
  states:{
    initial:"transform",
    nodes:{
      // source: the origin gathers; rings faint, she still sways, gaze loose
      source:{    preview:{ t:0.3, intensity:0.30, lock:0.05, status:"SOURCE",    progress:0.12,
                            layers:["source","rings","figure","plumb","gaze"] } },
      // field: rings resolve, brackets close, plumb firms, gaze fixing
      field:{     preview:{ t:1.4, intensity:0.78, lock:0.5,  status:"STEADYING", progress:0.50 } },
      // transform: locked to plumb, gaze firm on reticle, glyph charged (neutral)
      transform:{ preview:{ t:2.6, intensity:1.3,  lock:1.0,  status:"STEADIED",  progress:0.86 } },
    },
    edges:[["source","field"],["field","transform"],["transform","field"],["field","source"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","lock"],

  // neutral preview: the field fully taken — grounding rings gripping the stance,
  // plumb axis dead-true down her spine, gaze firm on its reticle, steadiness
  // glyph charged. Reads unmistakably as an invisible-source stabilization.
  preview:()=>({ t:2.4, intensity:1.25, lock:0.96, status:"STEADIED", progress:0.82,
                 layers:["source","rings","aura","figure","plumb","gaze","glyph"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
