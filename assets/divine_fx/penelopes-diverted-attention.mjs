/* divine_fx.penelopes-diverted-attention — Athena turns the queen's mind aside so
   she cannot see the recognition. DIVINE_FX asset. Scene function (OD-B19-S04):
   across the hearth, the old nurse's hands find the boar-scar and the basin goes
   over — the loudest thing in the room — and Penelope, sitting a few feet away,
   does not see it. Nothing touches her. An unseen goddess interposes a SCREEN in
   her line of sight; the sightline strikes it and kinks away to a focus that holds
   nothing, and the event goes by veiled.

   Procedural, in the DIVINE_FX contract, animated over state.t:
     SOURCE     — an unseen origin (dashed, no body) with thin conveyances: one to
                  the queen's temple, one hanging the screen into her sight
     TARGET     — the seated queen: her head yaws off the event, her pupil drifts
     FIELD      — the interposed attention screen; the sightline refracts at a
                  deflection node on its face, second leg swinging up to nowhere
     TRANSFORM  — divert = 0 (looking straight at it) -> 1 (bent clean away)
     CONSEQUENCE— the recognition event (scar found, basin over) veiled and struck
                  with the unseen mark; the direct sightline cut where it meets
                  the screen. Brief: the screen withdraws and she never knew.
   t ~ 0.10 : attending — sightline straight at the nurse's hands, screen not down
   t ~ 0.50 : AVERTED   — screen full, ray hard-kinked, event veiled and unseen
   t ~ 0.95 : released  — screen lifting, ray easing back, but the event is over

   Drawn in SOLID grays + hard black contour (engine primitives ONLY); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  queenX:      0.300,  // the queen's spine, frac of W
  seatY:       0.715,  // the seat of her chair, frac of H
  floorY:      0.868,  // the hall floor under her, frac of H
  source:      { x:0.145, y:0.185 },   // the unseen origin (no goddess drawn)
  focus:       { x:0.400, y:0.215 },   // where the diverted sight ends: nothing
  event:       { x:0.780, y:0.720 },   // the recognition — scar found, basin over
  screenA:     { x:0.520, y:0.845 },   // screen: bottom of the incident face
  screenB:     { x:0.565, y:0.455 },   // screen: top of the incident face
  screenD:     0.058,                  // screen thickness, frac of W
  hatch:       6,                      // hatch bars inside the screen
  burst:       9,                      // event spikes at the scar
  intensity:   1.0,                    // field charge (channel-driven)
};

/* crossing of the infinite lines AB and CD; null when parallel. */
function isect(a,b,c,d){
  const den=(b.x-a.x)*(d.y-c.y)-(b.y-a.y)*(d.x-c.x);
  if(Math.abs(den)<1e-6) return null;
  const u=((c.x-a.x)*(d.y-c.y)-(c.y-a.y)*(d.x-c.x))/den;
  return { x:a.x+u*(b.x-a.x), y:a.y+u*(b.y-a.y) };
}
const P = (W,H,p)=>({ x:W*p.x, y:H*p.y });

/* ---------- SOURCE · the unseen goddess. No body: a dashed origin ring and two
   thin conveyances — one down to the queen's temple (the mind she turns), one
   arcing over her to the head of the screen (the thing she hangs in the sight). */
function drawSource(pen,g,W,H,geo,inten,divert){
  const s=P(W,H,params.source), ch=clamp(inten,0,1.4);
  g.save();
  g.strokeStyle=inkLevel(clamp(3+Math.round(ch*1.4),3,5));
  g.lineWidth=2.6; g.lineCap="round"; g.setLineDash([5,5]);
  g.beginPath(); g.arc(s.x, s.y, W*0.030, 0, TAU); g.stroke();
  g.beginPath(); g.arc(s.x, s.y, W*0.050, 0, TAU); g.stroke();
  g.setLineDash([]); g.lineWidth=2.2;
  for(let k=0;k<4;k++){ const a=k/4*TAU+0.4;
    g.beginPath();
    g.moveTo(s.x+Math.cos(a)*W*0.056, s.y+Math.sin(a)*W*0.056);
    g.lineTo(s.x+Math.cos(a)*W*0.074, s.y+Math.sin(a)*W*0.074); g.stroke(); }
  g.setLineDash([5,5]); g.lineWidth=2;
  // conveyance A -> the queen's temple (short, tight)
  for(let k=0;k<2;k++){
    const off=(k-0.5)*W*0.020;
    g.beginPath();
    g.moveTo(s.x+W*0.020+off, s.y+W*0.038);
    g.quadraticCurveTo(s.x+W*0.060+off, s.y+H*0.075,
                       geo.headCx-geo.headR*0.92+off*0.3, geo.headCy-geo.headR*0.45);
    g.stroke();
  }
  // conveyance B -> the head of the screen (arcs high, clear of the head)
  const top=P(W,H,params.screenB);
  g.strokeStyle=inkLevel(clamp(2+Math.round(divert*2),2,5));
  g.beginPath();
  g.moveTo(s.x+W*0.040, s.y-W*0.020);
  g.quadraticCurveTo(W*0.430, H*0.145, top.x+W*0.030, top.y-H*0.014);
  g.stroke();
  g.restore();
}

/* ---------- TARGET · the seated queen. A plain robed profile on a chair — light
   planes, so the divine marks read over her. Her head YAWS off the event and her
   pupil drifts as the diversion takes: the consequence written in the body. ----- */
function drawQueen(pen,g,W,H,geo,divert){
  const { qx, seatY, floorY, shY, headCx, headCy, headR } = geo;
  const face = geo.face;                       // +1 = fully turned toward the event
  const pale = toneSolid(inkLevel(1));
  const cloth= toneSolid(inkLevel(2));
  const wood = toneSolid(inkLevel(3));

  // floor contact
  g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(qx+W*0.03, floorY+3, W*0.13, H*0.012, 0,0,TAU); g.fill();

  // ---- chair: back post + finial, seat plate, two legs (short spans only)
  pen.paint(()=>{ g.rect(qx-W*0.100, shY+H*0.012, W*0.019, seatY-shY-H*0.012); }, cloth, 3);
  pen.paint(()=>{ g.rect(qx-W*0.105, shY-H*0.004, W*0.029, H*0.017); }, wood, 3);
  pen.paint(()=>{ g.rect(qx-W*0.100, seatY, W*0.158, H*0.017); }, pale, 4);
  pen.paint(()=>{ g.rect(qx-W*0.086, seatY+H*0.017, W*0.016, floorY-seatY-H*0.017); }, cloth, 3);
  pen.paint(()=>{ g.rect(qx+W*0.036, seatY+H*0.017, W*0.016, floorY-seatY-H*0.017); }, cloth, 3);

  // ---- gown: shoulders down to the seat, two fall seams
  pen.paint(()=>{
    g.moveTo(qx-W*0.058, shY);
    g.lineTo(qx+W*0.052, shY);
    g.lineTo(qx+W*0.078, seatY-H*0.004);
    g.lineTo(qx-W*0.076, seatY-H*0.004);
    g.closePath();
  }, cloth, 5);
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  for(let s=-1;s<=1;s+=2){
    g.beginPath();
    g.moveTo(qx+s*W*0.026, shY+H*0.026);
    g.quadraticCurveTo(qx+s*W*0.038, (shY+seatY)/2, qx+s*W*0.044, seatY-H*0.016);
    g.stroke();
  }
  pen.ink(()=>{ g.moveTo(qx-W*0.060, shY+H*0.100); g.lineTo(qx+W*0.062, shY+H*0.100); }, 3);

  // ---- lap (pale, so the knee breaks off the gown) + shin + foot
  pen.paint(()=>{
    g.moveTo(qx-W*0.010, seatY-H*0.056);
    g.lineTo(qx+W*0.148, seatY-H*0.034);
    g.lineTo(qx+W*0.148, seatY-H*0.002);
    g.lineTo(qx-W*0.010, seatY-H*0.002);
    g.closePath();
  }, pale, 4);
  pen.limb(()=>{ g.moveTo(qx+W*0.140, seatY-H*0.014); g.lineTo(qx+W*0.130, floorY-H*0.016); },
    cloth, W*0.028);
  pen.paint(()=>{ g.ellipse(qx+W*0.148, floorY-H*0.007, W*0.036, H*0.012, 0,0,TAU); }, wood, 3);

  // ---- arm resting on the lap
  pen.limb(()=>{
    g.moveTo(qx+W*0.028, shY+H*0.028);
    g.quadraticCurveTo(qx+W*0.076, shY+H*0.088, qx+W*0.082, seatY-H*0.050);
  }, cloth, W*0.024);

  // ---- neck + head (kept pale; the veil is the only dark mass up here)
  pen.limb(()=>{ g.moveTo(qx+W*0.004, shY+H*0.004); g.lineTo(headCx, headCy+headR*0.82); },
    cloth, W*0.026);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.90, headR*1.04, 0,0,TAU); }, pale, 4.5);
  // brow-and-nose step on the facing side (small, so it never blots the face)
  pen.ink(()=>{
    g.moveTo(headCx+face*headR*0.56, headCy-headR*0.30);
    g.lineTo(headCx+face*headR*0.86, headCy+headR*0.06);
    g.lineTo(headCx+face*headR*0.56, headCy+headR*0.20);
  }, 3);
  // veil: a crescent cap over the crown, hanging down the LEFT side to the shoulder
  const veil=toneSolid(inkLevel(5));
  pen.paint(()=>{
    g.moveTo(headCx-headR*0.98, headCy+headR*0.10);
    g.quadraticCurveTo(headCx-headR*0.20, headCy-headR*1.60, headCx+headR*0.92, headCy-headR*0.34);
    g.quadraticCurveTo(headCx-headR*0.10, headCy-headR*0.86, headCx-headR*0.74, headCy-headR*0.18);
    g.closePath();
  }, veil, 3.5);
  pen.paint(()=>{
    g.moveTo(headCx-headR*0.96, headCy-headR*0.14);
    g.quadraticCurveTo(headCx-headR*1.42, headCy+headR*1.10, headCx-headR*0.96, headCy+headR*1.90);
    g.lineTo(headCx-headR*0.44, headCy+headR*1.44);
    g.quadraticCurveTo(headCx-headR*0.62, headCy+headR*0.50, headCx-headR*0.62, headCy+headR*0.10);
    g.closePath();
  }, veil, 3.5);
  // eye: lid arc + a pupil that DRIFTS off the event as the diversion takes
  const ex=headCx+face*headR*0.30, ey=headCy-headR*0.10;
  pen.ink(()=>{ g.moveTo(ex-headR*0.34, ey+headR*0.04);
                g.quadraticCurveTo(ex, ey-headR*0.34, ex+headR*0.36, ey+headR*0.02); }, 3);
  const px=ex+lerp(headR*0.16, -headR*0.22, divert);
  pen.paint(()=>{ g.arc(px, ey+headR*0.02, headR*0.155, 0, TAU); }, toneSolid(inkLevel(7)), 2);
  // mouth
  pen.ink(()=>{ g.moveTo(headCx+face*headR*0.30, headCy+headR*0.52);
                g.lineTo(headCx+face*headR*0.62, headCy+headR*0.48); }, 2.6);

  // ---- yaw arc: the head turning off the event (dashed arc + arrowhead)
  if (divert>0.05){
    g.save();
    g.strokeStyle=inkLevel(5); g.lineWidth=2.4; g.setLineDash([5,4]); g.lineCap="round";
    const r=headR*1.85, a0=-0.34, a1=-0.34-1.10*divert;
    g.beginPath(); g.arc(headCx, headCy, r, a0, a1, true); g.stroke();
    g.setLineDash([]);
    const hx=headCx+Math.cos(a1)*r, hy=headCy+Math.sin(a1)*r;
    const tx=-Math.sin(a1), ty=Math.cos(a1);
    g.beginPath();
    g.moveTo(hx, hy);
    g.lineTo(hx+tx*W*0.022-Math.cos(a1)*W*0.011, hy+ty*W*0.022-Math.sin(a1)*W*0.011);
    g.lineTo(hx+tx*W*0.022+Math.cos(a1)*W*0.011, hy+ty*W*0.022+Math.sin(a1)*W*0.011);
    g.closePath(); g.fillStyle=inkLevel(6); g.fill();
    g.restore();
  }
}

/* ---------- FIELD · the interposed attention screen. A slim canted plate that
   drops into the queen's sight; light plane, hard incident edge, sparse hatch. It
   never spans the frame — it stands upright between her and the event. `down`
   slides it in from above: at t≈0 barely present, at t≈1 lifting back out. ----- */
function drawScreen(pen,g,W,H,geo,down){
  if (down<=0.02) return;
  const A=geo.sA, B=geo.sB, d=W*params.screenD;
  const topY=lerp(A.y-H*0.03, B.y, smooth(down));      // the plate slides down
  const f=(A.y-topY)/(A.y-B.y||1);
  const bx=A.x, tx=lerp(A.x, B.x, f);
  g.save();
  pen.paint(()=>{
    g.moveTo(bx, A.y); g.lineTo(tx, topY);
    g.lineTo(tx+d, topY-H*0.008); g.lineTo(bx+d, A.y-H*0.008);
    g.closePath();
  }, toneSolid(inkLevel(1)), 5);
  // sparse hatch bars + short rungs inside (broken, never edge to edge)
  const n=params.hatch;
  for(let k=0;k<n;k++){
    const u=(k+0.6)/(n+0.2);
    const lx=lerp(bx,tx,u), ly=lerp(A.y,topY,u);
    const inset=(k%2? 0.26 : 0.10);
    g.strokeStyle=inkLevel(5); g.lineWidth=3.4; g.lineCap="round";
    g.beginPath();
    g.moveTo(lx+d*inset, ly-H*0.004);
    g.lineTo(lx+d*(1-inset*0.55), ly-H*0.024);
    g.stroke();
    if (k%2===0){
      g.strokeStyle=inkLevel(3); g.lineWidth=2.2;
      g.beginPath();
      g.moveTo(lx+d*0.16, ly-H*0.036); g.lineTo(lx+d*0.84, ly-H*0.040);
      g.stroke();
    }
  }
  // incident face rail + the head bead the goddess holds it by
  pen.ink(()=>{ g.moveTo(bx, A.y); g.lineTo(tx, topY); }, 5);
  pen.paint(()=>{ g.arc(tx+d*0.5, topY-H*0.018, W*0.013, 0, TAU); }, toneSolid(inkLevel(6)), 3);
  g.restore();
}

/* ---------- CONSEQUENCE · the recognition event, corner-bracketed: the old shin
   with the boar-scar found on it, and the basin going over. `veil` lightens the
   box and stamps the unseen mark — present, loud, and not seen by the queen. --- */
function drawEvent(pen,g,W,H,geo,veil,evt){
  const e=geo.ev;
  const bx0=e.x-W*0.130, bx1=e.x+W*0.135, by0=e.y-H*0.145, by1=e.y+H*0.130;

  // ---- the shin held over the basin: one light plane, so the black scar pops
  const sx=e.x-W*0.038, sy=e.y-H*0.060;
  pen.limb(()=>{ g.moveTo(e.x-W*0.046, by0+H*0.020); g.lineTo(e.x-W*0.028, e.y+H*0.004); },
    toneSolid(inkLevel(2)), W*0.060);
  pen.paint(()=>{ g.ellipse(e.x+W*0.012, e.y+H*0.026, W*0.052, H*0.018, -0.17,0,TAU); },
    toneSolid(inkLevel(4)), 4);
  // the event's loudness: a clean radiating halo, kept off the shin
  const n=params.burst, amp=clamp01(evt);
  for(let k=0;k<n;k++){
    const a=k/n*TAU+0.4, r0=W*0.086, L=r0+W*(0.020+0.034*((k*29)%7)/7)*amp;
    const nx=-Math.sin(a), ny=Math.cos(a), w=W*0.008;
    pen.paint(()=>{
      g.moveTo(sx+Math.cos(a)*r0+nx*w, sy+Math.sin(a)*r0+ny*w);
      g.lineTo(sx+Math.cos(a)*L,       sy+Math.sin(a)*L);
      g.lineTo(sx+Math.cos(a)*r0-nx*w, sy+Math.sin(a)*r0-ny*w);
      g.closePath();
    }, toneSolid(inkLevel(7)), 2);
  }

  // ---- the basin going over
  const tip=lerp(0.08, 0.60, clamp01(evt));
  g.save();
  g.translate(e.x+W*0.052, e.y+H*0.092); g.rotate(-tip);
  pen.paint(()=>{
    g.moveTo(-W*0.070, -H*0.028); g.lineTo(W*0.070, -H*0.028);
    g.quadraticCurveTo(W*0.050, H*0.030, 0, H*0.030);
    g.quadraticCurveTo(-W*0.050, H*0.030, -W*0.070, -H*0.028);
    g.closePath();
  }, toneSolid(inkLevel(2)), 5);
  pen.paint(()=>{ g.ellipse(0, -H*0.028, W*0.070, H*0.013, 0,0,TAU); }, toneSolid(inkLevel(5)), 4);
  g.restore();
  // spilled water: short dashes flung down-left off the tipping rim
  g.strokeStyle=inkLevel(6); g.lineWidth=3.4; g.lineCap="round";
  for(let k=0;k<4;k++){
    const a=2.30+k*0.22, r0=W*0.076+k*W*0.013;
    const ox=e.x+W*0.052, oy=e.y+H*0.066;
    g.beginPath();
    g.moveTo(ox+Math.cos(a)*r0, oy+Math.sin(a)*r0*1.15);
    g.lineTo(ox+Math.cos(a)*(r0+W*0.032), oy+Math.sin(a)*(r0+W*0.032)*1.15);
    g.stroke();
  }

  // ---- the VEIL: the whole event lightened out of her sight
  if (veil>0.02){
    g.save();
    g.fillStyle=`rgba(255,255,255,${0.30*clamp01(veil)})`;
    g.fillRect(bx0-W*0.02, by0-H*0.02, (bx1-bx0)+W*0.04, (by1-by0)+H*0.04);
    g.restore();
  }

  // ---- the SCAR, struck OVER the veil: what she failed to see must still read.
  // A hard zigzag across the shin — the whole plot in six strokes.
  g.strokeStyle=INK; g.lineWidth=6.5; g.lineCap="round"; g.lineJoin="round";
  g.beginPath(); g.moveTo(sx-W*0.036, sy-H*0.030);
  for(let k=1;k<=6;k++) g.lineTo(sx-W*0.036+k*W*0.012, sy-H*0.030+k*H*0.010+(k%2?H*0.011:-H*0.011));
  g.stroke();
  // caliper call-out: the nurse's hands have it — bracket + leader + found-dot
  g.strokeStyle=INK; g.lineWidth=3.4; g.lineCap="round";
  const kx=e.x-W*0.098;
  g.beginPath();
  g.moveTo(kx+W*0.016, sy-H*0.036); g.lineTo(kx, sy-H*0.036);
  g.lineTo(kx, sy+H*0.036); g.lineTo(kx+W*0.016, sy+H*0.036);
  g.stroke();
  g.beginPath(); g.moveTo(kx, sy); g.lineTo(kx-W*0.028, sy); g.stroke();
  pen.paint(()=>{ g.arc(kx-W*0.034, sy, W*0.012, 0, TAU); }, toneSolid(inkLevel(7)), 2);

  // corner brackets marking the event box (over the veil, hard)
  g.strokeStyle=INK; g.lineWidth=4.5; g.lineCap="butt";
  const cw=W*0.040, chh=H*0.030;
  for(const [x,y,ix,iy] of [[bx0,by0,1,1],[bx1,by0,-1,1],[bx0,by1,1,-1],[bx1,by1,-1,-1]]){
    g.beginPath(); g.moveTo(x+ix*cw, y); g.lineTo(x, y); g.lineTo(x, y+iy*chh); g.stroke();
  }
  // the UNSEEN mark: circle-and-bar struck over the corner of the event
  if (veil>0.15){
    const ux=e.x+W*0.058, uy=e.y-H*0.082, ur=W*0.042;
    g.strokeStyle=INK; g.lineWidth=5.5; g.lineCap="round";
    g.beginPath(); g.arc(ux, uy, ur, 0, TAU); g.stroke();
    g.beginPath(); g.moveTo(ux-ur*0.70, uy+ur*0.70); g.lineTo(ux+ur*0.70, uy-ur*0.70); g.stroke();
  }
}

/* ---------- FIELD · the sightline. Leg one leaves her eye for the nurse's hands;
   at the deflection node on the screen's face it KINKS, and leg two swings up to a
   focus that holds nothing. `divert` drives the swing continuously: at 0 the two
   legs are one straight look, at 1 the look is bent clean off. ------------------ */
function drawRays(pen,g,W,H,geo,divert,down){
  const eye=geo.eye, node=geo.node, foc=geo.foc, aim=geo.aim;
  const d=clamp01(divert);

  // the sight she would have had: dashed on through to the event
  g.save();
  g.strokeStyle=inkLevel(clamp(3+Math.round(d),3,5));
  g.lineWidth=2.6; g.setLineDash([7,7]); g.lineCap="round";
  g.beginPath(); g.moveTo(node.x, node.y); g.lineTo(aim.x, aim.y); g.stroke();
  g.restore();

  // leg one — eye to the node
  g.strokeStyle=inkLevel(6); g.lineWidth=4.5; g.lineCap="round";
  g.beginPath(); g.moveTo(eye.x, eye.y); g.lineTo(node.x, node.y); g.stroke();

  // leg two — node to wherever she is actually looking
  const endX=lerp(aim.x, foc.x, d), endY=lerp(aim.y, foc.y, d);
  g.beginPath(); g.moveTo(node.x, node.y); g.lineTo(endX, endY); g.stroke();
  const ax=endX-node.x, ay=endY-node.y, al=Math.hypot(ax,ay)||1;
  const ux=ax/al, uy=ay/al, nx=-uy, ny=ux, hh=W*0.028;
  g.beginPath();
  g.moveTo(endX, endY);
  g.lineTo(endX-ux*hh+nx*hh*0.42, endY-uy*hh+ny*hh*0.42);
  g.lineTo(endX-ux*hh-nx*hh*0.42, endY-uy*hh-ny*hh*0.42);
  g.closePath(); g.fillStyle=inkLevel(7); g.fill();

  // deflection angle: an arc swept between the two legs, clear of the plate
  if (d>0.06){
    const a1=Math.atan2(aim.y-node.y, aim.x-node.x);
    const a2=Math.atan2(endY-node.y, endX-node.x);
    g.strokeStyle=inkLevel(6); g.lineWidth=2.8;
    g.beginPath(); g.arc(node.x, node.y, W*0.098, a1, a2, true); g.stroke();
  }

  // the deflection node: surface-normal tick + a hard diamond on the incident face
  const sd={ x:geo.sB.x-geo.sA.x, y:geo.sB.y-geo.sA.y };
  const sl=Math.hypot(sd.x,sd.y)||1, snx=-sd.y/sl, sny=sd.x/sl;
  g.strokeStyle=inkLevel(5); g.lineWidth=2.2; g.setLineDash([4,4]);
  g.beginPath();
  g.moveTo(node.x-snx*W*0.052, node.y-sny*W*0.052);
  g.lineTo(node.x+snx*W*0.052, node.y+sny*W*0.052);
  g.stroke(); g.setLineDash([]);
  const ds=W*0.019;
  pen.paint(()=>{ g.moveTo(node.x, node.y-ds); g.lineTo(node.x+ds, node.y);
                  g.lineTo(node.x, node.y+ds); g.lineTo(node.x-ds, node.y); g.closePath(); },
    toneSolid(inkLevel(7)), 3);

  // the CUT: two hard slashes across the blocked sight, just past the plate
  if (down>0.35 && d>0.35){
    const bx=node.x-aim.x, by=node.y-aim.y, bl=Math.hypot(bx,by)||1;
    const vx=-bx/bl, vy=-by/bl;
    for(let k=0;k<2;k++){
      const ox=node.x+vx*W*(0.115+k*0.036), oy=node.y+vy*W*(0.115+k*0.036);
      g.strokeStyle=INK; g.lineWidth=5; g.lineCap="round";
      g.beginPath(); g.moveTo(ox-W*0.016, oy+H*0.016); g.lineTo(ox+W*0.016, oy-H*0.016); g.stroke();
    }
  }

  // the focus that holds nothing: a dashed reticle with an empty middle
  g.save();
  g.globalAlpha=clamp01(d*1.3);
  g.strokeStyle=inkLevel(6); g.lineWidth=3; g.setLineDash([6,5]);
  const rr=W*0.038;
  g.beginPath(); g.arc(foc.x, foc.y, rr, 0, TAU); g.stroke();
  g.setLineDash([]);
  g.beginPath();
  g.moveTo(foc.x-rr*1.8, foc.y); g.lineTo(foc.x-rr*0.8, foc.y);
  g.moveTo(foc.x+rr*0.8, foc.y); g.lineTo(foc.x+rr*1.8, foc.y);
  g.moveTo(foc.x, foc.y-rr*1.8); g.lineTo(foc.x, foc.y-rr*0.8);
  g.moveTo(foc.x, foc.y+rr*0.8); g.lineTo(foc.x, foc.y+rr*1.8);
  g.stroke();
  g.restore();
}

/* ---------- READOUT · the averted-eye glyph: an eye in a shield with its pupil
   shoved into the far corner and a bar struck across it. Charge pips read how
   hard the diversion is held. ------------------------------------------------- */
function drawGlyph(pen,g,W,H,divert){
  const gx=W*0.820, gy=H*0.190, s=W*0.074, d=clamp01(divert);
  pen.paint(()=>{
    g.moveTo(gx-s, gy-s*0.92);
    g.lineTo(gx+s, gy-s*0.92);
    g.lineTo(gx+s, gy+s*0.34);
    g.quadraticCurveTo(gx, gy+s*1.16, gx-s, gy+s*0.34);
    g.closePath();
  }, toneSolid(inkLevel(1)), 4);
  // eye almond
  pen.paint(()=>{
    g.moveTo(gx-s*0.72, gy-s*0.06);
    g.quadraticCurveTo(gx, gy-s*0.80, gx+s*0.72, gy-s*0.06);
    g.quadraticCurveTo(gx, gy+s*0.58, gx-s*0.72, gy-s*0.06);
    g.closePath();
  }, toneSolid(inkLevel(1)), 3.5);
  // pupil shoved off-axis by the diversion
  pen.paint(()=>{ g.arc(gx+lerp(0, -s*0.42, d), gy-s*0.10-s*0.06*d, s*0.17, 0, TAU); },
    toneSolid(inkLevel(7)), 2.5);
  // the struck bar
  if (d>0.08){
    g.strokeStyle=INK; g.lineWidth=lerp(2,4.5,d); g.lineCap="round";
    g.beginPath(); g.moveTo(gx-s*0.86, gy+s*0.34); g.lineTo(gx+s*0.86, gy-s*0.50); g.stroke();
  }
  // charge pips
  const pips=Math.round(d*3);
  for(let p=0;p<3;p++){
    g.beginPath(); g.arc(gx-s-W*0.026, gy-s*0.34+p*W*0.028, W*0.0085, 0, TAU);
    g.fillStyle = p<pips ? inkLevel(6) : inkLevel(2); g.fill();
  }
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.5);
  const inten=st.intensity ?? params.intensity;
  // divert: 0 -> 1 -> eased back. Brief: the screen comes down, holds, lifts away.
  const divert=(st.divert!=null) ? clamp01(st.divert)
    : clamp01(smooth(clamp01((t-0.14)/0.24)) - 0.55*smooth(clamp01((t-0.80)/0.20)));
  const down=(st.down!=null) ? clamp01(st.down)
    : clamp01(smooth(clamp01((t-0.10)/0.26)) - smooth(clamp01((t-0.84)/0.16))*0.75);
  const evt=clamp01((t-0.30)/0.34);            // the event itself running its course
  const layers=st.layers || ["source","queen","screen","event","rays","glyph"];
  const has=l=>layers.includes(l);

  // ---- geometry
  const qx=W*params.queenX, seatY=H*params.seatY, floorY=H*params.floorY;
  const shY=seatY-H*0.190, headR=W*0.058, headCy=shY-H*0.076;
  const face=lerp(1.0, 0.34, divert);          // her head yaws off the event
  const headCx=qx+W*0.006-W*0.012*divert;
  const eye={ x:headCx+face*headR*0.60, y:headCy-headR*0.08 };
  const ev=P(W,H,params.event), foc=P(W,H,params.focus);
  const sA=P(W,H,params.screenA), sB=P(W,H,params.screenB);
  const aim={ x:ev.x-W*0.086, y:ev.y-H*0.060 };            // the nurse's hands
  const node=isect(eye, aim, sA, sB) || { x:W*0.551, y:H*0.577 };
  const geo={ qx, seatY, floorY, shY, headR, headCy, headCx, face, eye, ev, foc, sA, sB, node, aim };

  if (has("source")) drawSource(pen,g,W,H,geo,inten,divert);
  if (has("queen"))  drawQueen(pen,g,W,H,geo,divert);
  if (has("event"))  drawEvent(pen,g,W,H,geo,divert*inten,evt);
  if (has("screen")) drawScreen(pen,g,W,H,geo,down);
  if (has("rays"))   drawRays(pen,g,W,H,geo,divert,down);
  if (has("glyph"))  drawGlyph(pen,g,W,H,divert);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.penelopes-diverted-attention",
  type:"DIVINE_FX",
  name:"Penelope's diverted attention",
  statusWord:"AVERTED",
  scene:"OD-B19-S04",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["source","queen","screen","event","rays","glyph"],
  // normalized 0..1 source / target / field / consequence anchors
  anchors:{
    "source:unseen":     { x:0.145, y:0.185 },  // the goddess, never drawn
    "target:queen":      { x:0.300, y:0.560 },  // Penelope, the mind turned aside
    "target:eye":        { x:0.336, y:0.444 },  // where the sightline starts
    "field:screen":      { x:0.570, y:0.640 },  // the interposed attention screen
    "field:node":        { x:0.551, y:0.577 },  // the deflection node on its face
    "focus:nothing":     { x:0.400, y:0.215 },  // the empty focus she ends up on
    "consequence:event": { x:0.780, y:0.720 },  // the recognition, veiled from her
    "consequence:scar":  { x:0.732, y:0.658 },  // the boar-scar the nurse finds
    "readout:glyph":     { x:0.820, y:0.190 },
    "camera:wide":       { x:0.500, y:0.500 },
  },
  // the regions the effect governs
  zones:{
    queen:  { x0:0.180, y0:0.395, x1:0.470, y1:0.890 },
    screen: { x0:0.515, y0:0.445, x1:0.630, y1:0.860 },
    event:  { x0:0.630, y0:0.555, x1:0.935, y1:0.870 },
    sight:  { x0:0.330, y0:0.170, x1:0.700, y1:0.640 },
  },
  // DIVINE_FX transform states: attending -> averted -> released (and back)
  states:{
    initial:"averted",
    nodes:{
      // attending: she is looking straight at the nurse's hands, no screen yet
      attending:{ preview:{ t:0.10, divert:0.04, down:0.06, intensity:0.4,
                            status:"ATTENDING", progress:0.10 } },
      // averted: screen full, sightline hard-kinked, event veiled and struck
      averted:{   preview:{ t:0.50, divert:1.00, down:1.00, intensity:1.1,
                            status:"AVERTED",   progress:0.55 } },
      // released: the screen lifts, the look eases back — the event already over
      released:{  preview:{ t:0.95, divert:0.42, down:0.30, intensity:0.7,
                            status:"RELEASED",  progress:0.95 } },
    },
    edges:[["attending","averted"],["averted","released"],["released","attending"]],
  },
  duration:3.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","divert","down"],

  // neutral preview: the diversion at full hold — the screen down in her sight,
  // her head yawed off, the sightline kinked at the node and running out to a
  // focus that holds nothing, the recognition veiled and struck UNSEEN.
  preview:()=>({ t:0.5, divert:1.0, down:1.0, intensity:1.1,
                 status:"AVERTED", progress:0.55,
                 layers:["source","queen","screen","event","rays","glyph"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
