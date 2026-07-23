/* divine_fx.concealing-mist — a mobile opacity cloud Athena pours around
   Odysseus so no citizen can fix attention on him, while his own sight passes
   clean through. DIVINE_FX asset. Scene function (OD-B07-S01): Odysseus walks
   into the Phaiakian town wrapped in a divine mist that TRAVELS with him — a
   soft swirling ring of cloud around a dimmed silhouette. Townsfolk cast their
   sight-lines at him and the lines BOUNCE off the mist boundary (deflected
   attention); a single line from HIS eye runs straight out through a clear
   channel to a focus reticle (his vision preserved). A compact readout glyph
   (an eye inside a cloud: outward-open, inward-barred) reads the field charge.

   Procedural over state.t + intensity/wrap/lock:
     SOURCE   (t≈.3, low)  — the unseen goddess-origin gathers off the figure;
                             mist is thin wisps, silhouette plain, citizen lines
                             still reach him (wrap≈0).
     ATTACHED (t≈1.2, mid) — mist condenses and CLINGS to him (attach tether
                             marks), the ring closing; first lines start bending.
     FIELD    (t≈2.0, high)— full opacity annulus swirling on t; every citizen
                             line strikes the boundary and reflects away.
     TRANSFORM(t≈2.8, full)— concealment total: citizen attention fully deflected,
                             his own sightline runs clean out through the channel,
                             glyph fully charged: UNSEEN.
   The mist is drawn as overlapping SOLID light puffs forming a ring (the engine
   POST pass dithers them into a soft cloud); do NOT pre-dither. Engine
   primitives only, solid grays + hard contour. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  groundLevel: 0.86,   // floor the concealed figure stands on, frac of H
  figX:        0.50,   // figure + mist-ring center x, frac of W (mobile: travels)
  ringRx:      0.205,  // mist ring horizontal radius, frac of W (a tall oval)
  ringRy:      0.255,  // mist ring vertical radius, frac of H (wraps the standing body)
  puffs:       10,     // soft cloud puffs distributed around the ring
  citizens:    4,      // townsfolk casting deflected sight-lines
  gazeDir:     1,      // +1 = his own preserved sightline streams to the right
  intensity:   1.0,    // field charge (channel-driven)
};

/* citizen posts around the figure (angle on the surrounding ring, frac radius) */
const CITIZENS = [
  { a: Math.PI*0.86, r: 1.55 },   // left
  { a: Math.PI*1.18, r: 1.75 },   // lower-left
  { a: Math.PI*1.72, r: 1.60 },   // lower-right
  { a: Math.PI*0.30, r: 1.85 },   // upper-right (far)
];

/* ---------- helper: arrowhead at (x,y) pointing along unit dir (ux,uy) ---- */
function arrowHead(g,x,y,ux,uy,s){
  const px=-uy, py=ux;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x - ux*s + px*s*0.55, y - uy*s + py*s*0.55);
  g.moveTo(x, y);
  g.lineTo(x - ux*s - px*s*0.55, y - uy*s - py*s*0.55);
  g.stroke();
}

/* ---------- TARGET · the dimmed silhouette (Odysseus) the mist wraps. A plain
   featureless standing body in a muted mid tone — legible as a person but
   deliberately DIM (the concealment is the point). Feet planted; the whole
   silhouette drifts by `drift` with the mobile field. Returns eye geometry. */
function drawFigure(pen,g,W,H,geo,dim){
  const { cx, groundY } = geo;
  const shY = geo.shoulderY, hipY = geo.hipY, headCy = geo.headCy, headR = geo.headR;
  const shHalf = W*0.048, hemHalf = W*0.098, footHalf = W*0.040;

  // ground contact shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, groundY+4, W*0.11, H*0.014, 0,0,TAU); g.fill();

  // the silhouette tone DIMS as the mist takes (visible -> dim); stays a solid
  // body so it still reads through the surrounding cloud, but grows fainter as
  // it is concealed (higher wrap -> lighter gray).
  const bodyLvl = clamp(Math.round(lerp(5, 3, clamp01(dim))),3,5);
  const body = toneSolid(inkLevel(bodyLvl));

  // planted feet
  pen.paint(()=>{ g.ellipse(cx-footHalf, groundY, W*0.036, H*0.012, 0,0,TAU); }, toneSolid(inkLevel(bodyLvl+1)), 4);
  pen.paint(()=>{ g.ellipse(cx+footHalf, groundY, W*0.036, H*0.012, 0,0,TAU); }, toneSolid(inkLevel(bodyLvl+1)), 4);

  // cloaked body: narrow sloped shoulders flaring to a wide hem (an A-line robe).
  // Curved sides so it reads as a hooded traveller, not a box.
  pen.paint(()=>{
    g.moveTo(cx-shHalf, shY);
    g.quadraticCurveTo(cx-hemHalf*0.7, (shY+groundY)/2, cx-hemHalf, groundY-H*0.010);
    g.quadraticCurveTo(cx, groundY+H*0.004, cx+hemHalf, groundY-H*0.010);
    g.quadraticCurveTo(cx+hemHalf*0.7, (shY+groundY)/2, cx+shHalf, shY);
    g.quadraticCurveTo(cx, shY-H*0.018, cx-shHalf, shY);
    g.closePath();
  }, body, 5);
  // two faint drape fall-lines so the robe reads (not a flat slab)
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(const s of [-1,1]){
    g.beginPath(); g.moveTo(cx+s*shHalf*0.5, shY+H*0.03);
    g.quadraticCurveTo(cx+s*hemHalf*0.5, (shY+groundY)/2, cx+s*hemHalf*0.62, groundY-H*0.03);
    g.stroke();
  }

  // neck + hooded head
  pen.limb(()=>{ g.moveTo(cx, shY); g.lineTo(geo.headCx, headCy+headR*0.7); }, body, W*0.018);
  pen.paint(()=>{ g.ellipse(geo.headCx, headCy, headR*0.90, headR, 0,0,TAU); }, body, 4);
  // hood shadow arc over the crown (keeps the face dim/featureless)
  pen.paint(()=>{
    g.moveTo(geo.headCx-headR*0.98, headCy-headR*0.05);
    g.quadraticCurveTo(geo.headCx, headCy-headR*1.5, geo.headCx+headR*0.98, headCy-headR*0.05);
    g.quadraticCurveTo(geo.headCx, headCy-headR*0.55, geo.headCx-headR*0.98, headCy-headR*0.05);
  }, toneSolid(inkLevel(7)), 3);

  // his eye (the one sense the mist preserves): a small light aperture
  const ex = geo.headCx + params.gazeDir*headR*0.30, ey = headCy + headR*0.05;
  g.fillStyle = inkLevel(1); g.beginPath(); g.ellipse(ex, ey, headR*0.20, headR*0.13, 0,0,TAU); g.fill();
  g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.ellipse(ex, ey, headR*0.20, headR*0.13, 0,0,TAU); g.stroke();
  g.fillStyle = INK; g.beginPath(); g.arc(ex+params.gazeDir*headR*0.05, ey, headR*0.06, 0,TAU); g.fill();

  return { eyeX: ex, eyeY: ey };
}

/* ---------- FIELD · the concealing mist: overlapping soft light puffs arranged
   in a ring AROUND the figure, swirling on t. Two layers (outer volume + inner
   haze). Drawn in flat light grays so the dotify pass renders a soft cloud; the
   ring CLINGS (radius eases in with wrap) and rotates — the mobile opacity field. */
function drawMist(pen,g,W,H,geo,t,inten,wrap){
  const { cx, my } = geo;
  const ch = clamp(inten,0,1.4);
  const N = params.puffs;
  // a TALL oval ring hugging the standing figure; condenses inward as it clings
  const R  = W*params.ringRx * lerp(1.22, 1.0, clamp01(wrap));
  const Rv = H*params.ringRy * lerp(1.14, 1.0, clamp01(wrap));
  const rot = t*0.5;

  // soft cloud puffs sitting ON the ring band — smaller, so the center stays
  // clear and the dim silhouette reads inside the swirling halo.
  for(let k=0;k<N;k++){
    const a = k/N*TAU + rot;
    const wob = 1 + 0.09*Math.sin(t*1.6 + k*1.7);
    const px = cx + Math.cos(a)*R*wob;
    const py = my + Math.sin(a)*Rv*wob;
    const pr = W*(0.058 + 0.020*Math.sin(k*2.3)) * lerp(0.55,1,clamp01(ch));
    const lvl = 2 + (k%2);                         // inkLevel 2..3 = light cloud
    pen.paint(()=>{ g.ellipse(px, py, pr, pr*0.9, a*0.3, 0, TAU); }, toneSolid(inkLevel(lvl)), 3);
    // a small trailing wisp inside each puff (the swirl)
    const wa = a + 0.5;
    pen.paint(()=>{ g.ellipse(px - Math.cos(wa)*pr*0.7, py - Math.sin(wa)*pr*0.7, pr*0.45, pr*0.4, 0,0,TAU); },
      toneSolid(inkLevel(1)), 2);
  }
  // a thin dashed boundary oval — the reflective attention-shell the lines hit
  g.save();
  g.strokeStyle = inkLevel(clamp(2+Math.round(ch*2),2,5));
  g.lineWidth = 2.2; g.setLineDash([7,6]); g.lineCap="round";
  g.beginPath(); g.ellipse(cx, my, R, Rv, 0, 0, TAU); g.stroke();
  g.restore();

  return { R, Rv };
}

/* ---------- CONSEQUENCE · citizens' bounced sight-lines. Each townsperson (a
   small eye mark) casts a line at the figure; it strikes the mist boundary and
   REFLECTS away (deflected attention). Incidence dashed, reflection solid with
   an arrowhead flung outward. `bend` fades the deflection in as the field takes. */
function drawBounces(pen,g,W,H,geo,mist,t,inten,bend){
  const { cx, my } = geo;
  const R = mist.R, Rv = mist.Rv, ch = clamp(inten,0,1.4);
  for(let i=0;i<params.citizens;i++){
    const c = CITIZENS[i];
    const cxp = cx + Math.cos(c.a)*R*c.r;
    const cyp = my + Math.sin(c.a)*Rv*c.r;
    // unit dir from citizen toward center
    let dx = cx-cxp, dy = my-cyp; const dl = Math.hypot(dx,dy)||1; dx/=dl; dy/=dl;
    // hit point on the ellipse boundary along that direction (from center out]
    const ux = -dx, uy = -dy;                     // center -> citizen dir
    const s = 1/Math.sqrt((ux/R)*(ux/R) + (uy/Rv)*(uy/Rv));
    const hx = cx + ux*s, hy = my + uy*s;
    // ellipse outward normal at hit
    let nx = (hx-cx)/(R*R), ny = (hy-my)/(Rv*Rv);
    const nl = Math.hypot(nx,ny)||1; nx/=nl; ny/=nl;
    // reflect incoming dir (dx,dy) about normal
    const dot = dx*nx + dy*ny;
    let rx = dx - 2*dot*nx, ry = dy - 2*dot*ny;
    // as the field takes, the ray bends toward pure reflection (before: passes in)
    const b = clamp01(bend);
    const outLen = lerp(W*0.02, W*0.16, b) * (0.9+0.2*Math.sin(t*2+i));

    // citizen eye mark
    g.strokeStyle = INK; g.lineWidth = 2.4; g.lineCap="round";
    g.beginPath(); g.ellipse(cxp, cyp, W*0.026, W*0.014, Math.atan2(dy,dx), 0, TAU); g.stroke();
    g.fillStyle = inkLevel(6); g.beginPath(); g.arc(cxp, cyp, W*0.008, 0, TAU); g.fill();

    // incidence line (citizen -> hit) dashed
    g.save();
    g.strokeStyle = inkLevel(clamp(3+Math.round(ch),3,6)); g.lineWidth = 2.4;
    g.setLineDash([6,5]); g.lineCap="round";
    g.beginPath(); g.moveTo(cxp, cyp); g.lineTo(hx, hy); g.stroke();
    g.restore();

    // a small impact tick at the boundary
    g.strokeStyle = INK; g.lineWidth = 2.6;
    g.beginPath(); g.moveTo(hx-nx*W*0.014, hy-ny*W*0.014); g.lineTo(hx+nx*W*0.014, hy+ny*W*0.014); g.stroke();

    // reflected line (solid) flung back out + arrowhead — the deflection
    const gxr = hx + rx*outLen, gyr = hy + ry*outLen;
    g.strokeStyle = inkLevel(clamp(4+Math.round(ch),4,7)); g.lineWidth = lerp(2.2,3.6,b);
    g.beginPath(); g.moveTo(hx, hy); g.lineTo(gxr, gyr); g.stroke();
    const rn = Math.hypot(rx,ry)||1;
    arrowHead(g, gxr, gyr, rx/rn, ry/rn, W*0.022);
  }
}

/* ---------- CONSEQUENCE · his preserved vision: one clean line from his eye,
   straight out through a CLEAR CHANNEL in the mist to a focus reticle. A short
   gap notch is punched in the boundary where it exits (the mist parts for him). */
function drawOwnVision(pen,g,W,H,geo,mist,inten){
  const { cx, my } = geo;
  const dir = params.gazeDir, ch = clamp(inten,0,1.4);
  const ex = geo.eyeX, ey = geo.eyeY;
  // exit point on the boundary in the gaze direction (roughly horizontal-forward)
  const ang = -0.10*dir;                       // a touch above horizontal
  const ux = Math.cos(ang)*dir, uy = Math.sin(ang);
  const s = 1/Math.sqrt((ux/mist.R)*(ux/mist.R) + (uy/mist.Rv)*(uy/mist.Rv));
  const bx = cx + ux*s, by = my + uy*s;        // where the line pierces the veil
  const len = lerp(W*0.10, W*0.28, clamp01(ch));
  const gx = bx + ux*len, gy = by + uy*len;

  // clear-channel notch: two short light strokes parting the veil at the exit
  g.strokeStyle = inkLevel(1); g.lineWidth = 7;
  g.beginPath(); g.moveTo(bx - uy*W*0.03, by + ux*W*0.03); g.lineTo(bx + uy*W*0.03, by - ux*W*0.03); g.stroke();

  // the sightline: eye -> exit -> focus (solid, dark = his sense works)
  g.strokeStyle = INK; g.lineWidth = lerp(2.4, 4, clamp01(ch)); g.lineCap="round";
  g.beginPath(); g.moveTo(ex, ey); g.lineTo(gx, gy); g.stroke();
  arrowHead(g, gx, gy, ux, uy, W*0.024);

  // focus reticle at the fixed point (what he can still see)
  const rr = lerp(W*0.014, W*0.024, clamp01(ch));
  g.lineWidth = 2.4;
  g.beginPath(); g.arc(gx, gy, rr, 0, TAU); g.stroke();
  g.beginPath();
  g.moveTo(gx-rr*1.7, gy); g.lineTo(gx-rr*0.6, gy);
  g.moveTo(gx+rr*0.6, gy); g.lineTo(gx+rr*1.7, gy);
  g.moveTo(gx, gy-rr*1.7); g.lineTo(gx, gy-rr*0.6);
  g.moveTo(gx, gy+rr*0.6); g.lineTo(gx, gy+rr*1.7);
  g.stroke();
}

/* ---------- ATTACH · the field is bound to HIM (mobile). Short tether ticks
   linking the boundary to the figure + a small "follows" drift arrow at the base
   showing the whole cloud travels with the traveller. ---------- */
function drawAttach(pen,g,W,H,geo,mist,wrap){
  const { cx, my, groundY } = geo;
  const w = clamp01(wrap);
  g.strokeStyle = inkLevel(clamp(2+Math.round(w*3),2,5)); g.lineWidth = 2;
  g.setLineDash([3,4]); g.lineCap="round";
  for(let k=0;k<6;k++){
    const a = k/6*TAU + 0.4;
    const bx = cx + Math.cos(a)*mist.R, by = my + Math.sin(a)*mist.Rv;
    const ix = cx + Math.cos(a)*mist.R*0.32, iy = my + Math.sin(a)*mist.Rv*0.32;
    g.beginPath(); g.moveTo(bx, by); g.lineTo(ix, iy); g.stroke();
  }
  g.setLineDash([]);
  // mobility arrow along the ground (the field travels with him)
  const ay = groundY + H*0.03, ax0 = cx - W*0.10, ax1 = cx + W*0.10;
  g.strokeStyle = inkLevel(4); g.lineWidth = 3;
  g.beginPath(); g.moveTo(ax0, ay); g.lineTo(ax1, ay); g.stroke();
  arrowHead(g, ax1, ay, 1, 0, W*0.020);
}

/* ---------- READOUT · concealment glyph: an eye inside a cloud. Outward-open
   (his vision) with a forward tick; inward-barred (a slash) = no attention gets
   in. Fill/weight + charge pips read the field. ---------- */
function drawGlyph(pen,g,W,H,inten){
  const ch = clamp(inten,0,1.4);
  const gx = W*0.80, gy = H*0.145, s = W*0.072;
  // cloud plate (light) — three bumped lobes
  pen.paint(()=>{
    g.moveTo(gx-s, gy+s*0.25);
    g.arc(gx-s*0.55, gy, s*0.5, Math.PI*0.6, Math.PI*1.9);
    g.arc(gx+s*0.05, gy-s*0.15, s*0.55, Math.PI*1.1, Math.PI*2.0);
    g.arc(gx+s*0.6, gy+s*0.05, s*0.45, Math.PI*1.5, Math.PI*0.4);
    g.lineTo(gx+s, gy+s*0.5);
    g.quadraticCurveTo(gx, gy+s*0.9, gx-s, gy+s*0.25);
    g.closePath();
  }, toneSolid(inkLevel(2)), 4);
  // the eye inside (charged darkness)
  const eyeLvl = clamp(4+Math.round(ch*3),4,7);
  pen.paint(()=>{ g.ellipse(gx, gy, s*0.55, s*0.34, 0, 0, TAU); }, toneSolid(inkLevel(2)), 3);
  pen.paint(()=>{ g.arc(gx, gy, s*0.19, 0, TAU); }, toneSolid(inkLevel(eyeLvl)), 2);
  // outward-open tick (his sight leaves)
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap="round";
  g.beginPath(); g.moveTo(gx+s*0.55, gy); g.lineTo(gx+s*0.95, gy); g.stroke();
  arrowHead(g, gx+s*0.95, gy, 1, 0, W*0.016);
  // inward bar (attention barred) — a slash across the incoming side
  g.strokeStyle = INK; g.lineWidth = 3.2;
  g.beginPath(); g.moveTo(gx-s*0.95, gy-s*0.3); g.lineTo(gx-s*0.55, gy+s*0.3); g.stroke();
  // charge pips
  const pips = Math.round(clamp01(ch/1.3)*3);
  for(let p=0;p<3;p++){
    g.beginPath(); g.arc(gx-s*0.6+p*W*0.026, gy+s*0.9, W*0.008, 0, TAU);
    g.fillStyle = p<pips ? inkLevel(6) : inkLevel(2); g.fill();
  }
}

/* ---------- SOURCE · the unseen goddess-origin (Athena). A faint dashed marker
   up-left with thin dotted wisps drifting down onto the figure's crown — where
   the mist is poured from. Kept very light so it reads as "not embodied." */
function drawSource(pen,g,W,H,geo,t,inten){
  const ch = clamp(inten,0,1.4);
  const sx = W*0.17, sy = H*0.135;
  g.save();
  g.strokeStyle = inkLevel(clamp(1+Math.round(ch*1.5),1,3));
  g.lineWidth = 1.8; g.setLineDash([4,5]); g.lineCap="round";
  g.beginPath(); g.arc(sx, sy, W*0.03, 0, TAU); g.stroke();
  const tx = geo.headCx, ty = geo.headCy - geo.headR;
  for(let k=0;k<3;k++){
    const off=(k-1)*W*0.022;
    g.beginPath();
    g.moveTo(sx+off*0.3, sy+W*0.03);
    g.quadraticCurveTo((sx+tx)/2+off, (sy+ty)/2 - H*0.03 + Math.sin(t*1.4+k)*4, tx+off*0.5, ty);
    g.stroke();
  }
  g.restore();
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const wrap  = st.wrap  ?? clamp(inten*0.9, 0, 1);   // how tightly the mist clings
  const bend  = st.bend  ?? clamp(inten*0.9, 0, 1);   // how fully lines deflect
  const layers = st.layers || ["source","figure","mist","attach","bounces","vision","glyph"];
  const has = l => layers.includes(l);

  const groundY = H*params.groundLevel, cx = W*params.figX;
  const shoulderY = groundY - H*0.34, hipY = groundY - H*0.175;
  const headR = W*0.050, headCy = shoulderY - H*0.072;
  const my = groundY - H*0.235;                        // mist-ring center (mid-body)
  const geo = { cx, groundY, shoulderY, hipY, headR, headCy, my,
                headCx:cx, eyeX:cx, eyeY:headCy };

  if (has("source")) drawSource(pen,g,W,H,geo,t,inten);
  if (has("figure")){ const fg = drawFigure(pen,g,W,H,geo,wrap); geo.eyeX=fg.eyeX; geo.eyeY=fg.eyeY; }
  let mist = { R: W*params.ringRx, Rv: H*params.ringRy };
  if (has("mist"))    mist = drawMist(pen,g,W,H,geo,t,inten,wrap);
  if (has("attach"))  drawAttach(pen,g,W,H,geo,mist,wrap);
  if (has("bounces")) drawBounces(pen,g,W,H,geo,mist,t,inten,bend);
  if (has("vision"))  drawOwnVision(pen,g,W,H,geo,mist,inten);
  if (has("glyph"))   drawGlyph(pen,g,W,H,inten);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.concealing-mist",
  type:"DIVINE_FX",
  name:"Concealing mist",
  statusWord:"UNSEEN",
  scene:"OD-B07-S01",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["source","figure","mist","attach","bounces","vision","glyph"],
  // normalized 0..1 source / target(attached) / field / consequence anchors
  anchors:{
    "source:athena":{   x:0.17, y:0.135 },   // the unseen goddess-origin (no body)
    "target:odysseus":{ x:0.50, y:0.50 },    // the concealed figure the field attaches to
    "attach:crown":{    x:0.50, y:0.32 },    // where the mist binds to him (travels with)
    "field:ring":{      x:0.50, y:0.53 },    // mist-annulus center
    "vision:focus":{    x:0.86, y:0.50 },    // his preserved-sight focus reticle
    "readout:glyph":{   x:0.80, y:0.145 },   // the concealment glyph
    "camera:wide":{     x:0.50, y:0.50 },
  },
  // affected regions
  zones:{
    cloud:{  x0:0.16, y0:0.28, x1:0.84, y1:0.80 },   // the opacity-field footprint
    body:{   x0:0.40, y0:0.34, x1:0.60, y1:0.82 },   // the concealed figure
    channel:{x0:0.60, y0:0.46, x1:0.90, y1:0.56 },   // his clear forward sight-channel
  },
  // DIVINE_FX field states: source -> attached(target) -> field -> transform
  states:{
    initial:"transform",
    nodes:{
      // source: origin gathers off him; mist thin, citizen lines still reach him
      source:{    preview:{ t:0.3, intensity:0.30, wrap:0.05, bend:0.05, status:"SOURCE",   progress:0.12,
                            layers:["source","figure","mist"] } },
      // attached: mist condenses and clings to him; first lines start bending
      attached:{  preview:{ t:1.2, intensity:0.70, wrap:0.6,  bend:0.4,  status:"WRAPPING", progress:0.42,
                            layers:["source","figure","mist","attach","bounces"] } },
      // field: full swirling annulus; every citizen line reflects away
      field:{     preview:{ t:2.0, intensity:1.05, wrap:0.9,  bend:0.9,  status:"SHROUDED", progress:0.66 } },
      // transform: concealment total, his sight clean through, glyph charged (neutral)
      transform:{ preview:{ t:2.8, intensity:1.3,  wrap:1.0,  bend:1.0,  status:"UNSEEN",   progress:0.9 } },
    },
    edges:[["source","attached"],["attached","field"],["field","transform"],
           ["transform","field"],["field","attached"],["attached","source"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","wrap","bend"],

  // neutral preview: the mist fully taken — a swirling opacity ring cloaking the
  // dim silhouette, citizen sight-lines bouncing off the boundary, his own line
  // running clean out to its reticle, glyph charged. Reads unmistakably as an
  // attention-deflecting concealment that preserves his vision.
  preview:()=>({ t:2.6, intensity:1.22, wrap:0.96, bend:0.96, status:"UNSEEN", progress:0.86,
                 layers:["source","figure","mist","attach","bounces","vision","glyph"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
