/* ensemble.four-stake-bearers — the four men who twirl the glowing stake.
   ENSEMBLE asset. Scene function (OD-B09-S09): a SYNCHRONIZED full-body force
   team rotating one embedded shaft — the fire-hardened olive stake driven into
   the Cyclops' eye and spun "as a shipwright bores ship-timber with a drill,
   his mates below whirling it with a strap." Four braced bearers ring the
   shaft, grip it at staggered heights, and lean their whole weight into a
   common tangential heave so the shaft turns like an auger.

   Built from ONE separable member template (drawBearer) instanced FOUR times
   deterministically around the embedded shaft. Exposes a ROTATION-TEAM
   formation (positions around the axis), plus STRAIN (how hard the whole team
   pulls — hunch, lean, braced legs, effort ticks, clenched faces), SYNCHRONY
   (0 ragged / out-of-phase grips .. 1 evenly staggered, one motion), and PHASE
   (where the team is in the turn — drives the spin arrows and a subtle body
   bob). Drawn in SOLID grays + hard contour; the engine dotify POST pass
   supplies the halftone. Do NOT bake named characters in — each bearer is an
   addressable, identical-template member. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the ROTATION-TEAM roster: the SAME member template ringed around the
   embedded shaft. Each entry:
     nx     = footline x (0..1 of W)
     footY  = footline y (0..1 of H)   (front pair low/near, back pair high/far)
     s      = member height in px      (near = large, far = small)
     lvl    = tunic ink level
     grip   = parametric grip height along the shaft (0 top .. 1 embedded end)
     face   = +1 faces right toward the axis / -1 faces left toward the axis
     band   = 0 back (behind shaft) .. 1 front (in front of shaft)
   Four bearers, two behind the shaft, two in front, staggered grips = a drill. */
const ROSTER = [
  { key:"back-left",  nx:0.330, footY:0.628, s:184, lvl:3, grip:0.30, face: 1, band:0 },
  { key:"back-right", nx:0.672, footY:0.636, s:184, lvl:3, grip:0.40, face:-1, band:0 },
  { key:"front-left", nx:0.235, footY:0.905, s:262, lvl:4, grip:0.66, face: 1, band:1 },
  { key:"front-right",nx:0.765, footY:0.900, s:262, lvl:4, grip:0.58, face:-1, band:1 },
];

const params = {
  count:4,               // ENSEMBLE of exactly four
  strain:0.85,           // 0 upright/idle .. 1 whole-body heave (hunch, lean, ticks)
  synchrony:0.9,         // 0 ragged grips / broken motion .. 1 evenly staggered, one turn
  phase:0.3,             // 0..1 position in the turn (drives spin arrows + body bob)
  spread:1.0,            // ring width multiplier about the axis
  floorLevel:0.70,       // the embedded end / working ground as fraction of H
  shaftTop:{ x:0.560, y:0.135 },   // the far, held end of the stake
  embed:{ x:0.500, y:0.700 },      // where the tip is driven in (the eye/socket)
};

/* ============================================================
   SHAFT — the embedded stake. Returns the geometry so bearers can grip it.
   ============================================================ */
function shaftGeom(W,H,st){
  const top = { x:(st.shaftTop?.x ?? params.shaftTop.x)*W, y:(st.shaftTop?.y ?? params.shaftTop.y)*H };
  const emb = { x:(st.embed?.x ?? params.embed.x)*W,       y:(st.embed?.y ?? params.embed.y)*H };
  return { top, emb };
}
const along = (G,t)=>({ x:lerp(G.top.x,G.emb.x,t), y:lerp(G.top.y,G.emb.y,t) });

function drawShaft(pen,g,W,H,G,part){
  const dx=G.emb.x-G.top.x, dy=G.emb.y-G.top.y, len=Math.hypot(dx,dy)||1;
  const nx=-dy/len, ny=dx/len;                 // unit normal (shaft thickness axis)
  const wTop=W*0.018, wEmb=W*0.030;            // tapers slightly wider toward the driven end
  const edge=(t,w,s)=>({ x:along(G,t).x+nx*w*s, y:along(G,t).y+ny*w*s });
  if (part==="pole"){
    pen.paint(()=>{
      g.moveTo(edge(0,wTop,-1).x, edge(0,wTop,-1).y);
      g.lineTo(edge(1,wEmb,-1).x, edge(1,wEmb,-1).y);
      g.lineTo(edge(1,wEmb, 1).x, edge(1,wEmb, 1).y);
      g.lineTo(edge(0,wTop, 1).x, edge(0,wTop, 1).y);
      g.closePath();
    }, toneSolid(inkLevel(5)), 5);
    // wood-grain seams running the length
    pen.seam(()=>{ g.moveTo(along(G,0.02).x, along(G,0.02).y); g.lineTo(along(G,0.96).x, along(G,0.96).y); }, 3);
    pen.seam(()=>{ g.moveTo(edge(0.05,wTop*0.4,-1).x, edge(0.05,wTop*0.4,-1).y); g.lineTo(edge(0.9,wEmb*0.4,-1).x, edge(0.9,wEmb*0.4,-1).y); }, 2.4);
    // a couple of binding rings
    for (const t of [0.5,0.72]){
      pen.paint(()=>{ g.ellipse(along(G,t).x, along(G,t).y, W*0.032, W*0.011, Math.atan2(dy,dx), 0, 7); }, toneSolid(inkLevel(6)), 3);
    }
  }
}

/* ============================================================
   MEMBER TEMPLATE — one braced bearer heaving on the shaft.
   o = { cx, footY, s, grip:{x,y}, lvl, strain, seed, bob }
   The bearer faces the axis (F = sign(grip.x - cx)), plants a wide braced
   stance, leans his whole trunk toward the shaft, and reaches BOTH arms to a
   common grip knot on the pole. Head sinks between the shoulders; strain adds
   the hunch, the deeper lean, bent knees, effort ticks and a clenched grunt.
   ============================================================ */
function drawBearer(pen, g, o){
  const s=o.s, cx=o.cx, footY=o.footY;
  const F = o.grip.x>=cx ? 1 : -1;             // face toward the shaft
  const strain = clamp01(o.strain);
  const R = rnd(o.seed);
  const cloth = toneSolid(inkLevel(o.lvl));
  const limbT = toneSolid(inkLevel(3));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const cw = Math.max(3, s*0.020);

  // ---- braced body metrics -------------------------------------------------
  const hipY   = footY - s*0.42;
  const lean   = F * s*(0.06 + 0.10*strain);           // trunk drives toward the axis
  const bob    = (o.bob||0) * s*0.02;
  const shoulderY = hipY - s*0.40*(1 - 0.10*strain) + bob;
  const shoulderCx= cx + lean;
  const shoulderW = s*0.32;
  const hipW   = s*0.26;
  const headR  = s*0.130;

  // ---- ground shadow (wide, planted) ----
  g.fillStyle="rgba(0,0,0,0.13)";
  g.beginPath(); g.ellipse(cx, footY+s*0.012, s*0.34, s*0.045, 0,0,7); g.fill();

  // ---- LEGS: braced lunge. Rear leg (away from axis) driven straight back;
  //           front leg (toward axis) planted & bent to take the load. --------
  const rearFootX = cx - F*s*(0.24 + 0.10*strain);
  const rearKneeX = cx - F*s*0.10;
  const frontFootX= cx + F*s*(0.20 + 0.04*strain);
  const frontKneeX= cx + F*s*(0.16);
  const kneeY = hipY + s*0.20;
  const rearHip  = { x:cx - F*hipW*0.34, y:hipY };
  const frontHip = { x:cx + F*hipW*0.34, y:hipY };
  // rear leg (nearly straight, the push)
  pen.limb(()=>{ g.moveTo(rearHip.x,rearHip.y); g.lineTo(rearKneeX,kneeY); }, limbT, s*0.058);
  pen.limb(()=>{ g.moveTo(rearKneeX,kneeY); g.lineTo(rearFootX,footY); }, limbT, s*0.050);
  pen.paint(()=>{ g.ellipse(rearFootX - F*s*0.03, footY, s*0.060, s*0.026, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  // front leg (bent, weight-bearing)
  pen.limb(()=>{ g.moveTo(frontHip.x,frontHip.y); g.lineTo(frontKneeX,kneeY); }, limbT, s*0.062);
  pen.limb(()=>{ g.moveTo(frontKneeX,kneeY); g.lineTo(frontFootX,footY); }, limbT, s*0.054);
  pen.paint(()=>{ g.ellipse(frontFootX + F*s*0.03, footY, s*0.062, s*0.028, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);

  // ---- TORSO: trapezoid sheared by the lean ----
  pen.paint(()=>{
    g.moveTo(shoulderCx - shoulderW/2, shoulderY);
    g.lineTo(shoulderCx + shoulderW/2, shoulderY);
    g.lineTo(cx + hipW/2, hipY);
    g.lineTo(cx - hipW/2, hipY);
    g.closePath();
  }, cloth, cw);
  // belt + a strained back seam
  pen.seam(()=>{ g.moveTo(cx-hipW*0.5, hipY-s*0.01); g.lineTo(cx+hipW*0.5, hipY-s*0.01); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(shoulderCx - F*shoulderW*0.30, shoulderY+s*0.02); g.lineTo(cx - F*hipW*0.10, hipY-s*0.05); }, cw*0.55);

  // ---- NECK + HEAD, sunk forward between the shoulders (the strain) ----
  const headCx = shoulderCx + F*s*(0.05 + 0.03*strain);
  const headCy = shoulderY - headR*(0.95 - 0.28*strain);
  pen.limb(()=>{ g.moveTo(shoulderCx, shoulderY+s*0.01); g.lineTo(headCx, headCy+headR*0.7); }, skin, s*0.055);
  pen.paint(()=>{ g.arc(headCx, headCy, headR, 0,7); }, skin, cw);
  // hair cap over the back/crown (the half turned from the axis)
  pen.paint(()=>{ g.arc(headCx, headCy - headR*0.05, headR*1.02, Math.PI*(0.85 - 0.5*(F>0?0:1)), Math.PI*(1.85 - 0.5*(F>0?0:1))); }, hair, cw*0.8);
  drawClenchFace(pen,g, headCx, headCy, headR, F, strain);

  // ---- BOTH ARMS reach a common grip knot on the shaft ----
  const shInner = { x:shoulderCx + F*shoulderW*0.42, y:shoulderY + s*0.03 };
  const shOuter = { x:shoulderCx - F*shoulderW*0.30, y:shoulderY + s*0.05 };
  drawGripArm(pen,g, shInner, o.grip, s, cloth, limbT, +1, F);
  drawGripArm(pen,g, shOuter, o.grip, s, cloth, limbT, -1, F);
  // the fists knotted on the pole
  pen.paint(()=>{ g.ellipse(o.grip.x, o.grip.y, s*0.045, s*0.036, 0,0,7); }, toneSolid(inkLevel(3)), cw*0.8);
  pen.seam(()=>{ for(let k=-1;k<=1;k++){ g.moveTo(o.grip.x-F*s*0.03, o.grip.y+k*s*0.012); g.lineTo(o.grip.x+F*s*0.02, o.grip.y+k*s*0.012); } }, cw*0.5);

  // ---- EFFORT TICKS: short radiating strain marks off the back + shoulders ----
  if (strain>0.35){
    g.strokeStyle=INK; g.lineWidth=Math.max(1.5, s*0.010); g.lineCap="round";
    g.globalAlpha=0.55*strain;
    const bx = shoulderCx - F*shoulderW*0.55, by = shoulderY - s*0.02;
    for(let k=0;k<3;k++){
      const a = -Math.PI*0.5 - F*0.5 + (k-1)*0.35 + (R()-0.5)*0.15;
      const L = s*(0.05 + 0.03*strain);
      g.beginPath(); g.moveTo(bx, by - k*s*0.02);
      g.lineTo(bx + Math.cos(a)*L*(F<0?-1:1), by - k*s*0.02 + Math.sin(a)*L); g.stroke();
    }
    g.globalAlpha=1;
  }
}

/* two-segment arm from a shoulder to the shared grip point, elbow flared to
   `side` so the two arms read as separate limbs converging on the pole. */
function drawGripArm(pen,g, sh, grip, s, cloth, skinT, side, F){
  const mx = lerp(sh.x, grip.x, 0.5) + F*side*s*0.05;
  const my = lerp(sh.y, grip.y, 0.5) + s*0.05;
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(mx,my); }, cloth, s*0.050);
  pen.limb(()=>{ g.moveTo(mx,my); g.lineTo(grip.x,grip.y); }, skinT, s*0.042);
}

/* clenched, straining face turned toward the axis (F) — furrowed brow, shut/
   grimacing eyes, gritted-teeth grunt that opens with strain. */
function drawClenchFace(pen,g, hx,hy,headR,F,strain){
  const eyeY = hy - headR*0.05;
  const edx  = headR*0.30;
  g.strokeStyle=INK; g.lineCap="round";
  // eyes screwed shut (down-curves) — the near one larger in the 3/4 turn
  g.lineWidth=Math.max(2, headR*0.13);
  const eye=(ex,r)=>{ g.beginPath(); g.moveTo(ex-r, eyeY); g.quadraticCurveTo(ex, eyeY+headR*0.10, ex+r, eyeY); g.stroke(); };
  eye(hx + F*edx, headR*0.24);
  eye(hx - F*edx*0.55, headR*0.16);
  // furrowed brows driven together
  g.lineWidth=Math.max(2, headR*0.12);
  g.beginPath(); g.moveTo(hx + F*edx - headR*0.16, eyeY-headR*0.34); g.lineTo(hx + F*edx + headR*0.12, eyeY-headR*0.18); g.stroke();
  g.beginPath(); g.moveTo(hx - F*edx*0.55 - headR*0.10, eyeY-headR*0.20); g.lineTo(hx - F*edx*0.55 + headR*0.12, eyeY-headR*0.30); g.stroke();
  // nose (toward the axis)
  g.lineWidth=Math.max(2, headR*0.08);
  g.beginPath(); g.moveTo(hx + F*edx*0.4, eyeY+headR*0.10); g.lineTo(hx + F*edx*0.7, eyeY+headR*0.34); g.stroke();
  // grunting mouth — bar of gritted teeth that opens with strain
  const my = hy + headR*0.48;
  if (strain>0.55){
    g.fillStyle=INK; g.beginPath(); g.ellipse(hx + F*headR*0.10, my, headR*0.20, headR*(0.10+0.10*strain), 0,0,7); g.fill();
    g.strokeStyle=inkLevel(1); g.lineWidth=Math.max(1.5, headR*0.05);
    g.beginPath(); g.moveTo(hx + F*headR*0.10 - headR*0.16, my); g.lineTo(hx + F*headR*0.10 + headR*0.16, my); g.stroke();
  } else {
    g.strokeStyle=INK; g.lineWidth=Math.max(2, headR*0.10);
    g.beginPath(); g.moveTo(hx-headR*0.16, my); g.lineTo(hx+headR*0.18, my); g.stroke();
  }
}

/* ============================================================
   ROTATION INDICATOR — the perspective spin ring + arrowheads that read the
   embedded shaft as TURNING. Drawn around the pole at grip level; strength +
   angle keyed to SYNCHRONY and PHASE.
   ============================================================ */
function drawSpinRing(pen,g,W,H,G,st){
  const sync = clamp01(st.synchrony ?? params.synchrony);
  const phase= (st.phase ?? params.phase);
  if (sync<0.12) return;
  const c = along(G,0.52);                          // ring height along the shaft
  const rx = W*0.155, ry = H*0.030;
  const dx=G.emb.x-G.top.x, dy=G.emb.y-G.top.y;
  const tilt = Math.atan2(dy,dx) - Math.PI/2;       // ring lies across the shaft axis
  g.save();
  g.strokeStyle=INK; g.lineWidth=Math.max(2, W*0.006); g.lineCap="round";
  g.globalAlpha=0.30 + 0.45*sync;
  // the ellipse (front arc solid, back arc faint)
  g.beginPath(); g.ellipse(c.x, c.y, rx, ry, tilt, 0, Math.PI); g.stroke();
  g.globalAlpha=(0.30+0.45*sync)*0.4;
  g.beginPath(); g.ellipse(c.x, c.y, rx, ry, tilt, Math.PI, Math.PI*2); g.stroke();
  // two arrowheads riding the ring in the turn direction (advance with phase)
  g.globalAlpha=0.35 + 0.5*sync;
  for(const base of [0.0, Math.PI]){
    const a = base + phase*Math.PI*2*0.15 + 0.15;
    const px = c.x + Math.cos(tilt)*rx*Math.cos(a) - Math.sin(tilt)*ry*Math.sin(a);
    const py = c.y + Math.sin(tilt)*rx*Math.cos(a) + Math.cos(tilt)*ry*Math.sin(a);
    // tangent direction of travel
    const tx = -Math.cos(tilt)*rx*Math.sin(a) - Math.sin(tilt)*ry*Math.cos(a);
    const ty = -Math.sin(tilt)*rx*Math.sin(a) + Math.cos(tilt)*ry*Math.cos(a);
    const tl = Math.hypot(tx,ty)||1; const ux=tx/tl, uy=ty/tl;
    const hl=W*0.026, hw=W*0.014;
    g.beginPath();
    g.moveTo(px+ux*hl, py+uy*hl);
    g.lineTo(px - ux*hl*0.2 - uy*hw, py - uy*hl*0.2 + ux*hw);
    g.lineTo(px - ux*hl*0.2 + uy*hw, py - uy*hl*0.2 - ux*hw);
    g.closePath(); g.fillStyle=INK; g.fill();
  }
  g.restore();
}

/* ============================================================
   STAGE — the driven end (dark socket + hot buried tip), the shaft, the spin
   ring, and the four bearers in painter's order (back pair, shaft, ring,
   front pair, heat sparks).
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const strain  = st.strain    ?? params.strain;
  const sync    = st.synchrony ?? params.synchrony;
  const phase   = st.phase     ?? params.phase;
  const spread  = st.spread    ?? params.spread;
  const floor   = (st.floorLevel ?? params.floorLevel)*H;
  const G = shaftGeom(W,H,st);

  // ---- ambient working ground so the dark bearers + card read ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  g.fillStyle = inkLevel(2); g.fillRect(0,floor,W,H-floor);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.25;
  g.beginPath(); g.moveTo(0,floor); g.lineTo(W,floor); g.stroke(); g.globalAlpha=1;

  // ---- the driven-in SOCKET mass the tip is buried in (the eye) ----
  pen.paint(()=>{ g.ellipse(G.emb.x, G.emb.y+H*0.020, W*0.085, H*0.038, 0,0,7); }, toneSolid(inkLevel(5)), 5);
  pen.paint(()=>{ g.ellipse(G.emb.x, G.emb.y+H*0.014, W*0.045, H*0.020, 0,0,7); }, toneSolid(inkLevel(6)), 4);

  // resolve grip points on the shaft for every bearer
  const bearers = ROSTER.map((m,i)=>{
    const nx = 0.5 + (m.nx-0.5)*spread;
    const cx = clamp(nx,0.08,0.92)*W;
    // synchrony evens the grip stagger; low sync jitters it
    const R = rnd(1300 + i*131);
    const gJit = (1-clamp01(sync)) * (R()-0.5)*0.10;
    const grip = along(G, clamp(m.grip + gJit, 0.16, 0.86));
    const bob  = Math.sin(phase*Math.PI*2 + i*Math.PI*0.5) * clamp01(sync);
    return { m, cx, grip, bob, seed: 907 + i*173 };
  });

  // ---- BACK bearers (behind the shaft) ----
  bearers.filter(b=>b.m.band===0).forEach(b=>{
    drawBearer(pen,g,{ cx:b.cx, footY:b.m.footY*H, s:b.m.s, grip:b.grip, lvl:b.m.lvl, strain, seed:b.seed, bob:b.bob });
  });

  // ---- the SHAFT (over the back pair, under the front pair) ----
  drawShaft(pen,g,W,H,G,"pole");

  // ---- the spin ring / rotation arrows ----
  drawSpinRing(pen,g,W,H,G,{ synchrony:sync, phase });

  // ---- FRONT bearers (in front of the shaft) ----
  bearers.filter(b=>b.m.band===1).forEach(b=>{
    drawBearer(pen,g,{ cx:b.cx, footY:b.m.footY*H, s:b.m.s, grip:b.grip, lvl:b.m.lvl, strain, seed:b.seed, bob:b.bob });
  });

  // ---- HOT buried TIP: bright core + radiating spark ticks at the socket ----
  pen.paint(()=>{ g.arc(G.emb.x, G.emb.y, W*0.017, 0,7); }, toneSolid(inkLevel(1)), 4);
  g.strokeStyle=INK; g.lineWidth=Math.max(2, W*0.006); g.lineCap="round";
  g.globalAlpha=0.6;
  for(let k=0;k<8;k++){
    const a = k/8*Math.PI*2 + phase*0.6;
    const r0=W*0.030, r1=W*(0.045 + 0.02*((k%2)));
    g.beginPath(); g.moveTo(G.emb.x+Math.cos(a)*r0, G.emb.y+Math.sin(a)*r0*0.6);
    g.lineTo(G.emb.x+Math.cos(a)*r1, G.emb.y+Math.sin(a)*r1*0.6); g.stroke();
  }
  g.globalAlpha=1;
}

export const asset = {
  id:"ensemble.four-stake-bearers",
  type:"ENSEMBLE",
  name:"Four stake bearers",
  statusWord:"STRAINING",
  scene:"OD-B09-S09",

  params,
  // ONE member template, instanced four times around the embedded shaft
  member:{ template:"bearer", roster:ROSTER.map(r=>r.key), formation:"rotation-team" },
  // back -> front draw order the stage honors
  layers:["ground","socket","band-back","shaft","spin-ring","band-front","heat"],
  // normalized placement / camera / attachment anchors (NOT baked characters)
  anchors:{
    "axis:shaft-top":{ x:0.560, y:0.135 }, "axis:embed":{ x:0.500, y:0.700 },
    "grip:back-left":{ x:0.474, y:0.304 }, "grip:back-right":{ x:0.474, y:0.360 },
    "grip:front-left":{ x:0.460, y:0.500 }, "grip:front-right":{ x:0.465, y:0.464 },
    "stand:back-left":{ x:0.380, y:0.632 }, "stand:back-right":{ x:0.622, y:0.640 },
    "stand:front-left":{ x:0.300, y:0.905 }, "stand:front-right":{ x:0.702, y:0.900 },
    "camera:wide":{ x:0.50, y:0.50 }, "camera:embed":{ x:0.50, y:0.66 },
  },
  // the working ground the team braces on
  zones:{ ground:{ x0:0.06, y0:0.62, x1:0.94, y1:0.96 }, axis:{ x0:0.44, y0:0.60, x1:0.56, y1:0.74 } },
  states:{
    initial:"brace",
    nodes:{
      // set the grip, take the weight — not yet turning
      brace:{  preview:{ strain:0.42, synchrony:0.55, phase:0.0, spread:1.0 } },
      // one whole-body synchronized heave, the shaft turning like a drill
      heave:{  preview:{ strain:0.95, synchrony:0.95, phase:0.30, spread:1.0 } },
      // mid-turn, the auger biting deep
      rotate:{ preview:{ strain:0.88, synchrony:0.98, phase:0.70, spread:1.0 } },
    },
    edges:[["brace","heave"],["heave","rotate"],["rotate","heave"]],
  },
  channels:["strain","synchrony","phase","spread"],

  preview:()=>({ strain:0.90, synchrony:0.92, phase:0.30, spread:1.0, status:"STRAINING", progress:0.62 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
