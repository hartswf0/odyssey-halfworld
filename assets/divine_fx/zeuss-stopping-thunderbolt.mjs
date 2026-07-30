/* divine_fx.zeuss-stopping-thunderbolt — the bolt that STOPS a fight instead of
   ending a life. DIVINE_FX asset. Scene function (OD-B24-S09): the Ithacan blood-
   feud is running down the field, the pursuit still pressing, and Zeus drops a
   smoking bolt into the GROUND directly in front of Athena. Nobody is struck. The
   strike is a full stop written into the dirt: a scorched scar, a smoke column,
   and a standing ARREST VEIL that holds the pursuit exactly where it stood.

   Narrative reads top->down and left->right:
     SOURCE      — a compact clear-sky aperture (Zeus's hand, no storm mass, so
                   the paper stays open: this bolt falls out of a blue day).
     CHANNEL     — the forked bolt lancing down past the goddess.
     TARGET      — the GROUND, never a body: a scorched scar + radiating cracks.
     FIELD       — the arrest veil (dome outline + vertical hold-bars) standing
                   between the goddess and the pursuit, on a dashed ground circle.
     CONSEQUENCE — the pursuit frozen MID-STRIDE: rear foot still off the dirt,
                   spears still levelled, motion-trail chevrons that simply stop
                   at the line, arrest brackets closed around each held body. No
                   fallen figure anywhere — the point is that it kills no one.

   Procedural over state.t + charge/strike/burn/freeze/smoke/advance:
     GATHERING (t low)  — aperture charges, no bolt; the pursuit still running
                          (advance low, freeze 0, legs oscillating on t).
     STRIKE    (t mid)  — bolt lands in the dirt, flash opens, veil not yet up.
     ARREST    (t high) — veil stands, bodies lock mid-stride, brackets close.
     HOLD      (t full) — bolt gone, smoke climbing, veil dim, freeze total.
   `advance` = how far the pursuit got before the line.  `freeze` = how locked it
   is (kills the t-oscillation but NOT the mid-stride pose).  `strike` = bolt+flash.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  groundY:   0.780,  // the dirt line the bolt strikes, frac of H
  skyX:      0.600,  // sky aperture (SOURCE) x
  skyY:      0.100,  // sky aperture y
  strikeX:   0.380,  // where the bolt enters the ground (TARGET) x
  athenaX:   0.165,  // the goddess the bolt is placed BEFORE
  athenaH:   0.315,  // her height, frac of H
  haltX:     0.600,  // the stance the pursuit cannot advance past
  runnerH:   0.205,  // lead pursuer height, frac of H
  veilR:     0.135,  // arrest-veil half-width, frac of W
  seed:      19,     // deterministic jag seed
  intensity: 1.0,    // divine charge (channel-driven)
};

/* deterministic 0..1 jitter from an integer (stable jag/tuft shapes per frame) */
function jig(i){ const s=Math.sin((i+params.seed)*127.1)*43758.5453; return s-Math.floor(s); }

/* ---------- FIELD backdrop: open Ithacan field under a CLEAR sky. The ground is
   a light plane broken by a gapped ridge and short furrow dashes, so no unbroken
   dark bar stripes the frame and most of the paper stays showing. ---------- */
function drawGround(pen,g,W,H){
  const gy = H*params.groundY;
  // distant ridge: separate humps with deliberate gaps between them
  for (const [x0,wf] of [[0.03,0.15],[0.22,0.12],[0.45,0.09],[0.68,0.17],[0.90,0.09]]){
    const a=W*x0, b=W*(x0+wf), r=H*(0.018+0.014*jig((a|0)));
    pen.paint(()=>{ g.moveTo(a,gy); g.quadraticCurveTo((a+b)/2, gy-r*2.0, b, gy); g.closePath(); },
      toneSolid(inkLevel(2)), 3);
  }
  // the dirt plane (light — the strike, not the soil, is the dark event)
  g.fillStyle = inkLevel(1); g.fillRect(0, gy, W, H-gy);
  // horizon contour, broken into segments so no line spans the whole frame
  g.strokeStyle = INK; g.lineCap="butt";
  for (const [a,b,lw] of [[0.00,0.30,4],[0.335,0.62,3],[0.655,0.88,4],[0.905,1.0,3]]){
    g.lineWidth = lw; g.beginPath(); g.moveTo(W*a,gy); g.lineTo(W*b,gy); g.stroke();
  }
  // furrow dashes, each row broken into staggered segments
  g.lineCap="round";
  for (let r=0;r<3;r++){
    const f=(r+0.8)/3.6, y=lerp(gy+H*0.030, H*0.968, f);
    g.strokeStyle = inkLevel(r<2?3:4); g.lineWidth = lerp(2.4,4.4,f);
    const segs = 3 + r;
    for (let s=0;s<segs;s++){
      const x0 = W*(s/segs) + W*0.03*jig(r*7+s);
      const x1 = x0 + W*(1/segs)*lerp(0.38,0.66,jig(r*3+s));
      g.beginPath(); g.moveTo(x0,y); g.lineTo(x1,y); g.stroke();
    }
  }
  // foreground stones (small solid accents that give the near dirt some weight)
  for (let k=0;k<7;k++){
    const x = W*(0.06+0.88*jig(k*31)), y = lerp(gy+H*0.055, H*0.96, jig(k*37));
    const r = W*lerp(0.008,0.017,jig(k*41));
    pen.paint(()=>{ g.ellipse(x, y, r, r*0.62, 0, 0, TAU); }, toneSolid(inkLevel(k%2?4:2)), 3);
  }
  // a few grass tufts hugging the horizon (small dark accents on pale dirt)
  g.strokeStyle = inkLevel(5); g.lineWidth = 2.4;
  for (let k=0;k<9;k++){
    const x = W*(0.04+0.92*jig(k*5)), y = gy + H*0.004 + H*0.028*jig(k*11);
    const s = lerp(H*0.008, H*0.015, jig(k*13));
    g.beginPath();
    g.moveTo(x,y); g.lineTo(x-s*0.55, y-s);
    g.moveTo(x,y); g.lineTo(x, y-s*1.3);
    g.moveTo(x,y); g.lineTo(x+s*0.55, y-s);
    g.stroke();
  }
  return gy;
}

/* ---------- SOURCE: a compact clear-sky APERTURE. Not a storm — a small hard
   iris in blank sky with short radiating spikes, the single point the sky opens
   at. Opens/darkens with `charge`; three pips read the charge. ---------- */
function drawAperture(pen,g,W,H,charge){
  const c = clamp01(charge);
  const cx = W*params.skyX, cy = H*params.skyY, r = W*lerp(0.028,0.046,c);
  g.strokeStyle = inkLevel(clamp(3+Math.round(c*3),3,7)); g.lineWidth = lerp(2.4,4.0,c);
  g.beginPath(); g.arc(cx,cy,r,0,TAU); g.stroke();
  pen.paint(()=>{ g.arc(cx,cy,r*lerp(0.18,0.42,c),0,TAU); },
    toneSolid(inkLevel(clamp(4+Math.round(c*2),4,6))), 3);
  g.strokeStyle = INK; g.lineWidth = lerp(1.8,2.8,c); g.lineCap="round";
  for (let k=0;k<12;k++){
    const a = k/12*TAU + 0.13;
    const r0 = r*1.30, r1 = r*(k%2 ? 1.62 : 2.10)*lerp(0.72,1.0,c);
    g.beginPath();
    g.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
    g.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
    g.stroke();
  }
  const pips = Math.round(c*3);
  for (let p=0;p<3;p++){
    g.beginPath(); g.arc(cx + r*2.9, cy - r*0.7 + p*r*0.70, W*0.0085, 0, TAU);
    g.fillStyle = p<pips ? inkLevel(6) : inkLevel(1); g.fill();
    g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke();
  }
  return { x:cx, y:cy, r };
}

/* the bolt polyline: sky aperture -> the dirt in front of the goddess. */
function boltPath(W,H,src,tgt){
  const N=10, pts=[];
  for (let i=0;i<=N;i++){
    const f=i/N;
    const jx=(jig(i*11)-0.5)*W*0.080*(1-Math.abs(f-0.5)*0.5);
    pts.push({ x:lerp(src.x,tgt.x,f)+jx, y:lerp(src.y,tgt.y,f) });
  }
  pts[0] = { x:src.x, y:src.y + src.r*1.0 };
  pts[N] = { x:tgt.x, y:tgt.y };
  return pts;
}

/* ---------- CHANNEL: the forked bolt + the ground FLASH. A black-haloed white-hot
   channel lancing down the open paper, with two side-forks that break AWAY from
   the bodies — nothing reaches a figure. ---------- */
function drawBolt(pen,g,W,H,t,strike,src,tgt){
  const s = clamp01(strike); if (s<=0.02) return;
  const pts = boltPath(W,H,src,tgt);
  const flick = 0.74 + 0.26*Math.abs(Math.sin(t*20));
  g.lineCap="round"; g.lineJoin="round";
  g.globalAlpha = clamp01(0.40 + s*flick*0.60);
  const run = ()=>{ g.beginPath(); g.moveTo(pts[0].x,pts[0].y);
    for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x,pts[i].y); g.stroke(); };
  g.strokeStyle = INK;         g.lineWidth = lerp(7,11,s); run();
  g.strokeStyle = inkLevel(0); g.lineWidth = lerp(2,3.2,s); run();
  for (const [i,dir] of [[4,1],[7,-1]]){
    const p = pts[i], ex = p.x + dir*W*0.075, ey = p.y + H*0.040;
    const mx = (p.x+ex)/2 + dir*W*0.016;
    const fork = ()=>{ g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(mx,(p.y+ey)/2); g.lineTo(ex,ey); g.stroke(); };
    g.strokeStyle = INK;         g.lineWidth = lerp(3.5,6,s);   fork();
    g.strokeStyle = inkLevel(0); g.lineWidth = lerp(1.4,2.4,s); fork();
  }
  g.globalAlpha = 1;
  // ground FLASH: a pale blown disc on the dirt with an upward spike-burst
  const fr = W*0.062*s*(0.86+0.14*Math.sin(t*18));
  g.fillStyle = inkLevel(0); g.globalAlpha = clamp01(s*0.9);
  g.beginPath(); g.ellipse(tgt.x, tgt.y, fr*0.60, fr*0.30, 0, 0, TAU); g.fill();
  g.globalAlpha = 1;
  g.strokeStyle = INK; g.lineWidth = lerp(1.8,3.0,s); g.lineCap="round";
  for (let k=0;k<9;k++){
    const a = Math.PI + (k+0.5)/9*Math.PI;
    const rr = fr*(k%2?1.0:1.6);
    g.beginPath();
    g.moveTo(tgt.x+Math.cos(a)*fr*0.5, tgt.y+Math.sin(a)*fr*0.26);
    g.lineTo(tgt.x+Math.cos(a)*rr,     tgt.y+Math.sin(a)*rr*0.66);
    g.stroke();
  }
}

/* ---------- TARGET: the scorched GROUND scar — the bolt's whole victim. A mid-
   dark ellipse burn inside a pale lip of turned earth, with dirt-cracks. ------ */
function drawScar(pen,g,W,H,tgt,burn){
  const b = clamp01(burn); if (b<=0.02) return;
  const rx = W*lerp(0.024,0.052,b), ry = rx*0.42;
  pen.paint(()=>{ g.ellipse(tgt.x, tgt.y, rx*1.55, ry*1.6, 0, 0, TAU); }, toneSolid(inkLevel(1)), 3);
  pen.paint(()=>{ g.ellipse(tgt.x, tgt.y, rx, ry, 0, 0, TAU); },
    toneSolid(inkLevel(clamp(3+Math.round(b*3),3,6))), 4);
  g.strokeStyle = INK; g.lineWidth = 2.0; g.lineCap="round";
  for (let k=0;k<8;k++){
    const a = k/8*TAU + 0.25, L = rx*lerp(1.9,3.2,jig(k*17));
    g.beginPath();
    g.moveTo(tgt.x+Math.cos(a)*rx*1.2, tgt.y+Math.sin(a)*ry*1.2);
    g.lineTo(tgt.x+Math.cos(a)*L*0.7 + (jig(k*3)-0.5)*W*0.012, tgt.y+Math.sin(a)*L*0.30);
    g.lineTo(tgt.x+Math.cos(a)*L,      tgt.y+Math.sin(a)*L*0.42);
    g.stroke();
  }
  g.fillStyle = inkLevel(6);
  for (let k=0;k<5;k++){
    const a = Math.PI + jig(k*23)*Math.PI, d = rx*lerp(2.2,3.6,jig(k*29));
    g.beginPath(); g.arc(tgt.x+Math.cos(a)*d, tgt.y+Math.sin(a)*d*0.46, W*0.005+W*0.003*jig(k), 0, TAU); g.fill();
  }
}

/* ---------- CONSEQUENCE (slow): the SMOKE column off the scar. Narrow and pale
   so the paper reads straight through it. ---------- */
function drawSmoke(pen,g,W,H,t,smoke,tgt){
  const s = clamp01(smoke); if (s<=0.03) return;
  const top = lerp(H*0.04, H*0.190, s);
  const N = 7;
  const px = f => tgt.x - W*0.070*f*f + Math.sin(t*0.8 + f*2.6)*W*0.014*f;
  const py = f => tgt.y - H*0.016 - top*f;
  const wd = f => W*lerp(0.016, 0.040, f)*lerp(0.7,1.0,s);
  // one continuous leaning column, drawn as a single silhouette (no stacked rings)
  pen.paint(()=>{
    g.moveTo(px(0)-wd(0), py(0));
    for (let i=1;i<=N;i++){ const f=i/N; g.lineTo(px(f)-wd(f), py(f)); }
    g.quadraticCurveTo(px(1), py(1)-wd(1)*1.2, px(1)+wd(1), py(1));
    for (let i=N-1;i>=0;i--){ const f=i/N; g.lineTo(px(f)+wd(f), py(f)); }
    g.closePath();
  }, toneSolid(inkLevel(1)), 3);
  // two curl seams inside so it reads as smoke, not a post
  g.strokeStyle = inkLevel(4); g.lineWidth = 2.2; g.lineCap="round";
  for (const sgn of [-1,1]){
    g.beginPath();
    for (let i=1;i<=N;i++){
      const f=i/N, xx = px(f)+sgn*wd(f)*0.42, yy = py(f);
      if (i===1) g.moveTo(xx,yy); else g.lineTo(xx,yy);
    }
    g.stroke();
  }
}

/* ---------- FIELD: the ARREST VEIL standing off the crater — a hard dome arc
   with light vertical hold-bars under it, over a dashed ground circle with radial
   halt-ticks. Rises with `freeze`. Its right edge IS the line the pursuit stops
   at, so the lead body's forward foot lands just outside it. ---------- */
function drawVeil(pen,g,W,H,t,freeze,tgt,gy){
  const f = clamp01(freeze); if (f<=0.02) return;
  const rx = W*params.veilR, ry = rx*lerp(0.8,1.95,f);
  const breath = 1 + 0.02*Math.sin(t*1.6);
  // ground circle (the field's footprint on the dirt) — dashed, with halt-ticks
  g.save();
  g.setLineDash([10,8]); g.strokeStyle = inkLevel(5); g.lineWidth = 3.0;
  g.beginPath(); g.ellipse(tgt.x, gy, rx*1.34*breath, H*0.070, 0, 0, TAU); g.stroke();
  g.restore();
  g.strokeStyle = inkLevel(5); g.lineWidth = 2.4; g.lineCap="round";
  for (let k=0;k<10;k++){
    const a = k/10*TAU + 0.3;
    const ex = tgt.x + Math.cos(a)*rx*1.34, ey = gy + Math.sin(a)*H*0.070;
    g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex + Math.cos(a)*W*0.022, ey + Math.sin(a)*H*0.020); g.stroke();
  }
  // vertical hold-bars under the arc (a lattice, not a wall)
  const bars = 6;
  for (let k=0;k<bars;k++){
    const u = (k+0.35)/bars;                              // right half only
    const bx = tgt.x + u*rx*breath;
    const top = gy - Math.sqrt(Math.max(0,1-u*u))*ry*breath;
    const on = clamp01(f*1.4 - u*0.35);
    if (on<=0.05) continue;
    g.strokeStyle = inkLevel(clamp(1+Math.round(on*2),1,3));
    g.lineWidth = k%2 ? 1.6 : 2.4;
    g.beginPath(); g.moveTo(bx, gy-H*0.004); g.lineTo(bx, top); g.stroke();
    g.lineWidth = 2.2;
    g.beginPath(); g.moveTo(bx-W*0.011, top); g.lineTo(bx+W*0.011, top); g.stroke();
  }
  // the arc itself (the hard edge of the field)
  g.strokeStyle = inkLevel(clamp(4+Math.round(f*2),4,6));
  g.lineWidth = lerp(2.4,4.2,f); g.lineCap="round";
  g.beginPath(); g.ellipse(tgt.x, gy, rx*breath, ry*breath, 0, -Math.PI/2, 0); g.stroke();
  // the spine the veil hinges on, standing straight out of the strike
  g.lineWidth = lerp(2.0,3.4,f);
  g.beginPath(); g.moveTo(tgt.x, gy-H*0.006); g.lineTo(tgt.x, gy-ry*breath); g.stroke();
  for (let k=1;k<=3;k++){
    const yy = gy - ry*breath*(k/3.6);
    g.beginPath(); g.moveTo(tgt.x-W*0.012, yy); g.lineTo(tgt.x+W*0.012, yy); g.stroke();
  }
}

/* ---------- the goddess the bolt is placed BEFORE: an upright robed figure,
   spear grounded, not fleeing and not struck. Drawn as a light draped column
   with hard seams + one dark mantle panel so it never reads as a blank slab. */
function drawGoddess(pen,g,W,H,x,gy,h){
  const shY = gy - h*0.76, hipY = gy - h*0.47;
  const headR = h*0.076, headCy = gy - h*0.885;
  const shHalf = h*0.112, hemHalf = h*0.150;

  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(x, gy+3, h*0.19, h*0.030, 0,0,TAU); g.fill();
  // feet peeking under the hem
  const footT = toneSolid(inkLevel(6));
  pen.paint(()=>{ g.ellipse(x-h*0.062, gy, h*0.052, h*0.021, 0,0,TAU); }, footT, 3);
  pen.paint(()=>{ g.ellipse(x+h*0.070, gy, h*0.052, h*0.021, 0,0,TAU); }, footT, 3);
  // draped chiton: sloped shoulders tapering out to a hem at the ankles
  pen.paint(()=>{
    g.moveTo(x-shHalf, shY+h*0.020);
    g.quadraticCurveTo(x, shY-h*0.022, x+shHalf, shY+h*0.020);
    g.lineTo(x+shHalf*0.80, hipY);
    g.lineTo(x+hemHalf, gy-h*0.028);
    g.quadraticCurveTo(x, gy+h*0.014, x-hemHalf, gy-h*0.028);
    g.lineTo(x-shHalf*0.80, hipY);
    g.closePath();
  }, toneSolid(inkLevel(1)), 4);
  // fall seams
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  for (let s=-1;s<=1;s++){
    const tx=x+s*shHalf*0.50, bx=x+s*hemHalf*0.66;
    g.beginPath(); g.moveTo(tx, shY+h*0.09);
    g.quadraticCurveTo((tx+bx)/2, (shY+gy)/2, bx, gy-h*0.07); g.stroke();
  }
  // narrow mantle SASH across the chest (a diagonal band, not a slab)
  pen.paint(()=>{
    g.moveTo(x-shHalf*0.92, shY+h*0.045);
    g.lineTo(x-shHalf*0.40, shY+h*0.028);
    g.lineTo(x+shHalf*0.86, hipY-h*0.012);
    g.lineTo(x+shHalf*0.80, hipY+h*0.038);
    g.closePath();
  }, toneSolid(inkLevel(5)), 3);
  pen.ink(()=>{ g.moveTo(x-shHalf*0.84, hipY+h*0.010); g.lineTo(x+shHalf*0.84, hipY+h*0.010); }, 2.8);
  // neck + head
  pen.limb(()=>{ g.moveTo(x, shY+h*0.01); g.lineTo(x, headCy+headR*0.85); }, toneSolid(inkLevel(2)), h*0.028);
  pen.paint(()=>{ g.ellipse(x, headCy, headR*0.90, headR, 0,0,TAU); }, toneSolid(inkLevel(1)), 3.5);
  // helm: a light cap with a hard brow line, and a thin swept crest
  pen.paint(()=>{
    g.moveTo(x-headR*1.02, headCy-headR*0.10);
    g.quadraticCurveTo(x, headCy-headR*1.55, x+headR*1.02, headCy-headR*0.10);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  pen.ink(()=>{ g.moveTo(x-headR*1.02, headCy-headR*0.10); g.lineTo(x+headR*1.02, headCy-headR*0.10); }, 3);
  g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
  g.beginPath();
  g.moveTo(x-headR*0.45, headCy-headR*1.20);
  g.quadraticCurveTo(x+headR*0.35, headCy-headR*2.30, x+headR*0.95, headCy-headR*1.05);
  g.stroke();
  // grounded spear held close at her right — the halt, not the thrust
  const sxp = x + hemHalf*1.02, spTop = headCy - h*0.075;
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap="round";
  g.beginPath(); g.moveTo(sxp, gy); g.lineTo(sxp, spTop); g.stroke();
  pen.paint(()=>{
    g.moveTo(sxp, spTop-h*0.075);
    g.lineTo(sxp+h*0.020, spTop-h*0.020);
    g.lineTo(sxp, spTop+h*0.004);
    g.lineTo(sxp-h*0.020, spTop-h*0.020);
    g.closePath();
  }, toneSolid(inkLevel(6)), 2.6);
  // near arm down to the spear grip
  pen.limb(()=>{ g.moveTo(x+shHalf*0.72, shY+h*0.07); g.lineTo(sxp, shY+h*0.20); },
    toneSolid(inkLevel(2)), h*0.032);
  return { headCy, headR };
}

/* ---------- a pursuer caught MID-STRIDE. `stride` holds the step spread; `bob`
   is the running oscillation, driven to zero by the freeze while the spread
   STAYS — a body stopped in the middle of a step, upright and unhurt. ------- */
function drawRunner(pen,g,W,H,o){
  const { x, gy, h, dir, stride, bob, tunic } = o;
  const by = gy + bob;
  const hipY = by - h*0.48, shY = by - h*0.78;
  const headR = h*0.085, headCy = by - h*0.90;
  const lean = dir*h*0.09;
  const shX = x + lean, headCx = x + lean*1.30;
  const skinT = toneSolid(inkLevel(2)), limbT = toneSolid(inkLevel(3));

  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(x, gy+3, h*0.20, h*0.030, 0,0,TAU); g.fill();

  // BACK leg — still off the dirt, caught between steps
  const bfx = x - dir*h*stride*1.00, bfy = gy - h*stride*0.34;
  pen.limb(()=>{ g.moveTo(x - dir*h*0.04, hipY); g.lineTo(x - dir*h*stride*0.58, hipY+h*0.24); g.lineTo(bfx, bfy); },
    limbT, h*0.050);
  // BACK arm swung behind
  pen.limb(()=>{ g.moveTo(shX - dir*h*0.05, shY+h*0.05); g.lineTo(shX - dir*h*0.32, shY+h*0.15); },
    limbT, h*0.042);
  // TORSO / tunic
  pen.paint(()=>{
    g.moveTo(shX-h*0.145, shY); g.lineTo(shX+h*0.145, shY);
    g.lineTo(x+h*0.155, hipY+h*0.07); g.lineTo(x-h*0.155, hipY+h*0.07);
    g.closePath();
  }, toneSolid(inkLevel(tunic)), 4);
  pen.ink(()=>{ g.moveTo(x-h*0.13, hipY+h*0.02); g.lineTo(x+h*0.13, hipY+h*0.02); }, 2.8);
  // FRONT leg planted at the line
  const ffx = x + dir*h*stride*1.06;
  pen.limb(()=>{ g.moveTo(x + dir*h*0.05, hipY); g.lineTo(x + dir*h*stride*0.60, hipY+h*0.24); g.lineTo(ffx, gy); },
    limbT, h*0.054);
  const footT = toneSolid(inkLevel(6));
  pen.paint(()=>{ g.ellipse(ffx + dir*h*0.02, gy, h*0.062, h*0.023, 0,0,TAU); }, footT, 3);
  pen.paint(()=>{ g.ellipse(bfx, bfy, h*0.058, h*0.021, 0,0,TAU); }, footT, 3);
  // neck + head + bound hair
  pen.limb(()=>{ g.moveTo(shX, shY); g.lineTo(headCx, headCy+headR*0.85); }, skinT, h*0.034);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0,0,TAU); }, skinT, 3.5);
  pen.paint(()=>{
    g.moveTo(headCx-headR*1.0, headCy-headR*0.14);
    g.quadraticCurveTo(headCx, headCy-headR*1.50, headCx+headR*1.0, headCy-headR*0.14);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  // FRONT arm + levelled spear, still pointed forward at nothing
  const hx = shX + dir*h*0.26, hy = shY + h*0.08;
  pen.limb(()=>{ g.moveTo(shX + dir*h*0.06, shY+h*0.05); g.lineTo(hx, hy); }, skinT, h*0.044);
  // short, steeply angled shaft — a levelled thrust cut off, never a frame-wide bar
  const sx0 = hx - dir*h*0.20, sy0 = hy - h*0.22, sx1 = hx + dir*h*0.24, sy1 = hy + h*0.20;
  pen.limb(()=>{ g.moveTo(sx0,sy0); g.lineTo(sx1,sy1); }, toneSolid(inkLevel(6)), h*0.014);
  const ang = Math.atan2(sy1-sy0, sx1-sx0), hl = h*0.075;
  pen.paint(()=>{
    g.moveTo(sx1+Math.cos(ang)*hl, sy1+Math.sin(ang)*hl);
    g.lineTo(sx1+Math.cos(ang+2.4)*hl*0.52, sy1+Math.sin(ang+2.4)*hl*0.52);
    g.lineTo(sx1-Math.cos(ang)*hl*0.25, sy1-Math.sin(ang)*hl*0.25);
    g.lineTo(sx1+Math.cos(ang-2.4)*hl*0.52, sy1+Math.sin(ang-2.4)*hl*0.52);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  return { headCy, headR };
}

/* ---------- CONSEQUENCE: motion-trail chevrons behind a held body that STOP —
   they thin and terminate; nothing carries through the line. ---------- */
function drawTrail(pen,g,W,H,x,gy,h,dir,freeze){
  const f = clamp01(freeze); if (f<=0.05) return;
  const y = gy - h*0.50;
  for (let k=0;k<3;k++){
    const cx = x - dir*h*(0.30 + k*0.24), s = h*0.095*(1-k*0.16);
    g.strokeStyle = inkLevel(clamp(5-k*2,1,5)); g.lineWidth = lerp(3.2,1.4,k/2);
    g.globalAlpha = clamp01(f*(1-k*0.26));
    g.beginPath();
    g.moveTo(cx - dir*s, y-s); g.lineTo(cx + dir*s*0.5, y); g.lineTo(cx - dir*s, y+s);
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---------- CONSEQUENCE: arrest BRACKETS — four corner ticks closed around a
   held body. The diagram's way of saying "stopped, not struck". ---------- */
function drawBracket(pen,g,W,H,x,gy,h,freeze){
  const f = clamp01(freeze); if (f<=0.05) return;
  const pad = lerp(h*0.46, h*0.30, f);
  const x0 = x-pad, x1 = x+pad, y0 = gy - h*1.06, y1 = gy + h*0.07, L = h*0.14;
  g.strokeStyle = inkLevel(clamp(3+Math.round(f*3),3,6));
  g.lineWidth = lerp(1.8,3.2,f); g.lineCap="round";
  g.globalAlpha = clamp01(0.35+f*0.65);
  for (const [cx,cy,sx,sy] of [[x0,y0,1,1],[x1,y0,-1,1],[x0,y1,1,-1],[x1,y1,-1,-1]]){
    g.beginPath(); g.moveTo(cx+sx*L, cy); g.lineTo(cx, cy); g.lineTo(cx, cy+sy*L); g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---------- READOUT: the stopping glyph — a run of driving chevrons crushed flat
   against a hard bar, inside a plate. Pips read how total the hold is. ------- */
function drawGlyph(pen,g,W,H,freeze){
  const f = clamp01(freeze);
  const gx = W*0.170, gy = H*0.165, s = W*0.080;
  pen.paint(()=>{
    g.moveTo(gx-s, gy-s*0.82); g.lineTo(gx+s, gy-s*0.82);
    g.lineTo(gx+s, gy+s*0.34);
    g.quadraticCurveTo(gx, gy+s*1.06, gx-s, gy+s*0.34);
    g.closePath();
  }, toneSolid(inkLevel(1)), 4);
  // the hard bar (the stop)
  pen.paint(()=>{ g.rect(gx+s*0.42, gy-s*0.50, s*0.22, s*1.08); },
    toneSolid(inkLevel(clamp(3+Math.round(f*3),3,6))), 3);
  // chevrons driving into it; the nearest is crushed flat against the bar
  g.strokeStyle = INK; g.lineCap="round"; g.lineJoin="round";
  for (let k=0;k<2;k++){
    const cx = gx + s*(0.22 - k*0.62), sc = s*0.46*(1-k*0.08);
    g.lineWidth = k ? 4.4 : 5.6;
    g.beginPath();
    g.moveTo(cx - sc*(k?0.80:0.22), gy-sc);
    g.lineTo(cx + sc*(k?0.50:0.04), gy);
    g.lineTo(cx - sc*(k?0.80:0.22), gy+sc);
    g.stroke();
  }
  g.globalAlpha = 1;
  const pips = Math.round(f*3);
  for (let p=0;p<3;p++){
    g.beginPath(); g.arc(gx - s*0.62 + p*s*0.32, gy + s*0.66, W*0.0085, 0, TAU);
    g.fillStyle = p<pips ? inkLevel(6) : inkLevel(1); g.fill();
    g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke();
  }
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten  = st.intensity ?? params.intensity;
  const charge = st.charge ?? clamp(0.25+inten*0.75, 0, 1);
  const strike = st.strike ?? clamp((inten-0.22)*1.8, 0, 1);
  const burn   = st.burn   ?? clamp((inten-0.30)*2.0, 0, 1);
  const freeze = st.freeze ?? clamp((inten-0.42)*1.9, 0, 1);
  const smoke  = st.smoke  ?? clamp((inten-0.52)*2.1, 0, 1);
  const advance= st.advance?? clamp(0.30+inten*0.75, 0, 1);
  const layers = st.layers || ["ground","aperture","athena","scar","smoke","pursuit","veil","bolt","glyph"];
  const has = l => layers.includes(l);

  const gy  = H*params.groundY;
  const tgt = { x: W*params.strikeX, y: gy };
  const src = { x: W*params.skyX, y: H*params.skyY, r: W*0.040 };

  // how far the pursuit got: it advances toward the halt stance and no further
  const adv = smooth(clamp01(advance));
  const leadX = lerp(W*0.780, W*params.haltX, adv);
  const rearX = Math.min(leadX + W*0.155, W*0.870);   // keep the rear body in frame
  const leadH = H*params.runnerH, rearH = H*params.runnerH*0.80;
  const rearGy = gy - H*0.048;
  const bob = (ph,h) => Math.sin(t*6.4+ph)*h*0.030*(1-clamp01(freeze));
  const stride = lerp(0.30, 0.25, clamp01(freeze));   // spread held, motion killed

  if (has("ground"))   drawGround(pen,g,W,H);
  if (has("aperture")) Object.assign(src, drawAperture(pen,g,W,H,charge));
  if (has("athena"))   drawGoddess(pen,g,W,H, W*params.athenaX, gy, H*params.athenaH);
  if (has("scar"))     drawScar(pen,g,W,H,tgt,burn);
  if (has("smoke"))    drawSmoke(pen,g,W,H,t,smoke,tgt);

  if (has("pursuit")){
    // rear body first (further up the plane), then the lead at the line
    drawTrail(pen,g,W,H,rearX,rearGy,rearH,-1,freeze);
    drawRunner(pen,g,W,H,{ x:rearX, gy:rearGy, h:rearH, dir:-1, stride, bob:bob(1.9,rearH), tunic:4 });
    drawBracket(pen,g,W,H,rearX,rearGy,rearH,freeze);
    drawTrail(pen,g,W,H,leadX,gy,leadH,-1,freeze);
    drawRunner(pen,g,W,H,{ x:leadX, gy, h:leadH, dir:-1, stride, bob:bob(0,leadH), tunic:3 });
    drawBracket(pen,g,W,H,leadX,gy,leadH,freeze);
  }

  if (has("veil"))  drawVeil(pen,g,W,H,t,freeze,tgt,gy);
  if (has("bolt"))  drawBolt(pen,g,W,H,t,strike,src,tgt);
  if (has("glyph")) drawGlyph(pen,g,W,H,freeze);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.zeuss-stopping-thunderbolt",
  type:"DIVINE_FX",
  name:"Zeus's stopping thunderbolt",
  statusWord:"HALTED",
  scene:"OD-B24-S09",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["ground","aperture","athena","scar","smoke","pursuit","veil","bolt","glyph"],
  // normalized 0..1 source / channel / target / field / consequence anchors
  anchors:{
    "source:sky-aperture":{ x:0.600, y:0.100 },  // Zeus's opened point of sky
    "channel:bolt":{        x:0.520, y:0.430 },  // mid-channel of the descending bolt
    "target:ground":{       x:0.380, y:0.780 },  // it strikes DIRT, never a body
    "field:veil":{          x:0.380, y:0.650 },  // the standing arrest veil
    "field:halt-line":{     x:0.515, y:0.780 },  // the edge the pursuit cannot cross
    "witness:athena":{      x:0.165, y:0.630 },  // the goddess it is placed before
    "frozen:lead":{         x:0.600, y:0.675 },  // held mid-stride at the line
    "frozen:rear":{         x:0.755, y:0.655 },  // held mid-stride behind him
    "consequence:smoke":{   x:0.360, y:0.660 },  // the smoking bolt's column
    "readout:glyph":{       x:0.170, y:0.165 },
    "camera:wide":{         x:0.500, y:0.500 },
  },
  // affected regions
  zones:{
    sky:{    x0:0.48, y0:0.02, x1:0.74, y1:0.19 },  // the aperture, no storm mass
    impact:{ x0:0.29, y0:0.71, x1:0.48, y1:0.86 },  // scorched ground
    veil:{   x0:0.22, y0:0.56, x1:0.54, y1:0.87 },  // arrest field footprint
    held:{   x0:0.50, y0:0.48, x1:0.96, y1:0.84 },  // the frozen pursuit band
  },
  // DIVINE_FX states: sky charges -> ground strike -> arrest -> the hold
  states:{
    initial:"arrest",
    nodes:{
      gathering:{ preview:{ t:0.5, intensity:0.22, charge:0.45, strike:0.0, burn:0.0,
                    freeze:0.0, smoke:0.0, advance:0.28, status:"GATHERING", progress:0.12,
                    layers:["ground","aperture","athena","pursuit","glyph"] } },
      strike:{    preview:{ t:1.3, intensity:0.55, charge:1.0, strike:1.0, burn:0.55,
                    freeze:0.12, smoke:0.05, advance:0.70, status:"STRUCK", progress:0.44 } },
      arrest:{    preview:{ t:2.2, intensity:0.85, charge:0.85, strike:0.45, burn:0.9,
                    freeze:0.92, smoke:0.45, advance:1.0, status:"HALTED", progress:0.74 } },
      hold:{      preview:{ t:3.4, intensity:1.0, charge:0.5, strike:0.0, burn:1.0,
                    freeze:1.0, smoke:1.0, advance:1.0, status:"HOLDING", progress:0.95 } },
    },
    edges:[["gathering","strike"],["strike","arrest"],["arrest","hold"],["hold","arrest"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","charge","strike","burn","freeze","smoke","advance"],

  // neutral preview: the arrest itself — bolt still standing in the dirt, scar
  // blown open, veil up, the pursuit stopped mid-stride, its trails cut short.
  preview:()=>({ t:2.2, intensity:0.85, charge:0.9, strike:0.75, burn:0.9,
                 freeze:0.92, smoke:0.5, advance:1.0, status:"HALTED", progress:0.74,
                 layers:["ground","aperture","athena","scar","smoke","pursuit","veil","bolt","glyph"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
