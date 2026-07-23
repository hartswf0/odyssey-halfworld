/* ensemble.crew-ritual-assistants — the sailors who serve the rite at the pit.
   ENSEMBLE asset. Scene function (OD-B11-S01, the Nekyia): the crew ringed
   around the blood-trench at the edge of the world — one man DIGGING the pit,
   others HANDLING the sheep, POURING the threefold offering, tending the BURN,
   PRAYING over the black blood, and — as the thronging ghosts rise — WITHDRAWING,
   recoiling back from the ghost-ring in a reaction wave.

   Built from ONE separable member template (drawMember) instanced N times
   deterministically around the trench. Each member carries an intrinsic ritual
   TASK (dig / sheep / pour / burn / pray / withdraw), but the ensemble is driven
   by shared channels: ATTENTION (how far the whole ring leans IN toward the pit),
   WITHDRAW (0 working .. 1 the whole ring recoiling OUT from the ghost-ring, as a
   phase-staggered reaction wave), GHOST (visibility of the risen shades the crew
   shrink from), FORMATION (dig / pour / withdraw presets) and DENSITY (how many of
   the roster are present). Drawn in SOLID grays + hard contour; the engine dotify
   POST pass supplies the halftone. Do NOT bake named characters in — every member
   is an addressable, identical-template assistant. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the RITUAL RING roster: the SAME member template stationed around the
   trench, each with an intrinsic task. Each entry:
     nx    = footline x (0..1 of W)
     footY = footline y (0..1 of H)   (front pair low/near-large, back trio high/far-small)
     s     = member height in px
     lvl   = tunic ink level
     face  = +1 faces right toward the pit / -1 faces left toward the pit
     band  = 0 back (behind the trench) .. 1 front (nearer camera, over the rim)
     task  = which rite this assistant performs
   Six assistants ringing the pit: two in front working the near rim, four behind. */
const ROSTER = [
  { key:"digger",   nx:0.320, footY:0.740, s:262, lvl:4, face: 1, band:1, task:"dig"      },
  { key:"pourer",   nx:0.700, footY:0.735, s:256, lvl:4, face:-1, band:1, task:"pour"     },
  { key:"shepherd", nx:0.185, footY:0.598, s:188, lvl:3, face: 1, band:0, task:"sheep"    },
  { key:"burner",   nx:0.410, footY:0.572, s:172, lvl:3, face: 1, band:0, task:"burn"     },
  { key:"prayer",   nx:0.600, footY:0.570, s:172, lvl:3, face:-1, band:0, task:"pray"     },
  { key:"witness",  nx:0.830, footY:0.596, s:188, lvl:3, face:-1, band:0, task:"withdraw" },
];

const params = {
  count:6,               // ENSEMBLE of up to six assistants
  attention:0.85,        // 0 upright .. 1 whole ring leaned IN over the pit
  withdraw:0.0,          // 0 working .. 1 the ring recoiling OUT (reaction wave)
  ghost:0.25,            // visibility of the risen shades the crew shrink from
  phase:0.0,             // 0..1 drives the reaction-wave timing + flame flicker
  density:1.0,           // 0..1 fraction of the roster present
  floorLevel:0.56,       // ground horizon as fraction of H
  pit:{ x:0.500, y:0.720, rx:0.150, ry:0.058 },  // the blood-trench
};

/* pit geometry in px */
function pitGeom(W,H,st){
  const p = st.pit || params.pit;
  return { x:p.x*W, y:p.y*H, rx:p.rx*W, ry:p.ry*H };
}

/* ============================================================
   THE TRENCH — dug pit, piled earth-rim, the black blood pooled in it.
   ============================================================ */
function drawPit(pen,g,W,H,P){
  // piled earth ring thrown up by the digging (light-mid, so it reads as a lip)
  pen.paint(()=>{ g.ellipse(P.x, P.y, P.rx*1.34, P.ry*1.5, 0,0,7); }, toneSolid(inkLevel(3)), 5);
  // the dug hole (dark walls)
  pen.paint(()=>{ g.ellipse(P.x, P.y, P.rx, P.ry, 0,0,7); }, toneSolid(inkLevel(5)), 5);
  // pooled BLACK BLOOD in the bottom
  pen.paint(()=>{ g.ellipse(P.x, P.y+P.ry*0.16, P.rx*0.70, P.ry*0.62, 0,0,7); }, toneSolid(inkLevel(7)), 4);
  // clods of dug earth heaped on the near lip
  g.fillStyle=inkLevel(4);
  for(let k=-2;k<=2;k++){
    const cx=P.x+k*P.rx*0.34, cy=P.y+P.ry*1.28+((k+2)%2)*P.ry*0.12;
    g.beginPath(); g.ellipse(cx,cy,P.rx*0.14,P.ry*0.30,0,0,7); g.fill();
  }
}

/* ============================================================
   THE GHOST-RING — the thronging shades risen from the trench, faint pale
   wisps + a hovering ring the crew withdraw from. Keyed to `ghost`.
   ============================================================ */
function drawGhostRing(pen,g,W,H,P,ghost,phase){
  ghost = clamp01(ghost);
  if (ghost<0.06) return;
  g.save();
  // hovering ring above the pit (thin, faint)
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,W*0.004); g.lineCap="round";
  g.globalAlpha=0.18+0.30*ghost;
  g.beginPath(); g.ellipse(P.x, P.y-P.ry*1.4, P.rx*1.5, P.ry*1.15, 0, 0, Math.PI*2); g.stroke();
  // pale rising wisps (light tone shades) around the ring
  const n=7;
  for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2 + phase*0.6;
    const wx=P.x+Math.cos(a)*P.rx*1.25;
    const wy=P.y-P.ry*1.2 - Math.abs(Math.sin(a*1.3))*H*0.02;
    const hgt=H*(0.05+0.055*ghost*(0.6+0.4*Math.sin(a*2+phase*6)));
    g.globalAlpha=(0.10+0.22*ghost);
    g.fillStyle=inkLevel(2);
    g.beginPath();
    g.moveTo(wx-W*0.014, wy);
    g.quadraticCurveTo(wx-W*0.006, wy-hgt*0.6, wx, wy-hgt);
    g.quadraticCurveTo(wx+W*0.006, wy-hgt*0.6, wx+W*0.014, wy);
    g.quadraticCurveTo(wx, wy+H*0.006, wx-W*0.014, wy);
    g.fill();
    // a fainter head-knot at the wisp crown
    g.globalAlpha=(0.14+0.26*ghost);
    g.beginPath(); g.ellipse(wx, wy-hgt, W*0.013, H*0.012, 0,0,7); g.fill();
  }
  g.restore();
}

/* two-segment arm from a shoulder to a hand target, elbow flared by `side`. */
function drawArm(pen,g, sh, hand, s, sleeve, skin, side){
  const mx = lerp(sh.x, hand.x, 0.5) + side*s*0.05;
  const my = lerp(sh.y, hand.y, 0.5) + s*0.04;
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(mx,my); }, sleeve, s*0.050);
  pen.limb(()=>{ g.moveTo(mx,my); g.lineTo(hand.x,hand.y); }, skin, s*0.042);
}

/* ============================================================
   MEMBER TEMPLATE — one ritual assistant.
   o = { cx, footY, s, lvl, face, task, attention, withdraw, ghost, phase,
         pit, seed }
   Faces the pit (F=face). ATTENTION bends the trunk IN over the pit; WITHDRAW
   overrides it — the trunk recoils OUT, the head twists back over the shoulder,
   the near arm flies up to shield. Each task poses the working arms and draws
   its own prop (spade / sheep / offering-jug / flame / prayer-lift).
   ============================================================ */
function drawMember(pen,g,o){
  const s=o.s, cx=o.cx, footY=o.footY, F=o.face;
  const att = clamp01(o.attention);
  const wd  = clamp01(o.withdraw);
  const R   = rnd(o.seed);
  const cloth = toneSolid(inkLevel(o.lvl));
  const limbT = toneSolid(inkLevel(3));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const cw = Math.max(3, s*0.020);

  // net lean: IN toward the pit under attention, OUT (recoil) under withdraw
  const lean = F * s*(0.11*att - 0.15*wd);
  const hipY = footY - s*0.40;
  const shoulderY = hipY - s*0.40*(1 - 0.06*att) + wd*s*0.02;
  const shoulderCx= cx + lean;
  const shoulderW = s*0.30;
  const hipW = s*0.25;
  const headR= s*0.128;

  // ---- ground shadow ----
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, footY+s*0.012, s*0.30, s*0.042, 0,0,7); g.fill();

  // ---- LEGS: braced stance; front foot toward pit, rear planted back ----
  const stance = s*(0.16 + 0.06*att + 0.05*wd);
  const rearFootX = cx - F*stance;
  const frontFootX= cx + F*stance*0.78;
  const kneeY = hipY + s*0.20;
  const rearHip = { x:cx - F*hipW*0.34, y:hipY };
  const frontHip= { x:cx + F*hipW*0.34, y:hipY };
  const pants = toneSolid(inkLevel(4));
  pen.limb(()=>{ g.moveTo(rearHip.x,rearHip.y); g.lineTo(cx-F*s*0.10,kneeY); }, pants, s*0.056);
  pen.limb(()=>{ g.moveTo(cx-F*s*0.10,kneeY); g.lineTo(rearFootX,footY); }, pants, s*0.048);
  pen.paint(()=>{ g.ellipse(rearFootX-F*s*0.03, footY, s*0.058, s*0.024, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  pen.limb(()=>{ g.moveTo(frontHip.x,frontHip.y); g.lineTo(cx+F*s*0.12,kneeY); }, pants, s*0.060);
  pen.limb(()=>{ g.moveTo(cx+F*s*0.12,kneeY); g.lineTo(frontFootX,footY); }, pants, s*0.052);
  pen.paint(()=>{ g.ellipse(frontFootX+F*s*0.03, footY, s*0.060, s*0.026, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);

  // ---- TORSO: trapezoid sheared by the lean ----
  pen.paint(()=>{
    g.moveTo(shoulderCx - shoulderW/2, shoulderY);
    g.lineTo(shoulderCx + shoulderW/2, shoulderY);
    g.lineTo(cx + hipW/2, hipY);
    g.lineTo(cx - hipW/2, hipY);
    g.closePath();
  }, cloth, cw);
  pen.seam(()=>{ g.moveTo(cx-hipW*0.5, hipY-s*0.01); g.lineTo(cx+hipW*0.5, hipY-s*0.01); }, cw*0.6);

  // ---- NECK + HEAD; under withdraw the head twists BACK over the shoulder ----
  const turn = wd>0.4 ? -F : F;                 // gaze toward pit, or wrenched away
  const headCx = shoulderCx + F*s*(0.04*att) - wd*F*s*0.05;
  const headCy = shoulderY - headR*(1.02 - 0.24*att);
  pen.limb(()=>{ g.moveTo(shoulderCx, shoulderY+s*0.01); g.lineTo(headCx, headCy+headR*0.7); }, skin, s*0.052);
  pen.paint(()=>{ g.arc(headCx, headCy, headR, 0,7); }, skin, cw);
  // hair cap over the crown / far side
  pen.paint(()=>{ g.arc(headCx, headCy-headR*0.06, headR*1.02, Math.PI*(0.82 - (turn>0?0:0.5)), Math.PI*(1.82 - (turn>0?0:0.5))); }, hair, cw*0.8);
  drawFace(pen,g, headCx, headCy, headR, turn, att, wd);

  // ---- SHOULDER anchor points ----
  const shNear = { x:shoulderCx + F*shoulderW*0.42, y:shoulderY + s*0.03 };
  const shFar  = { x:shoulderCx - F*shoulderW*0.36, y:shoulderY + s*0.05 };

  // ---- pit rim work-point in this member's direction ----
  const P=o.pit;
  const rim = { x: P.x - F*P.rx*0.55, y: P.y - P.ry*0.2 };

  // ---- TASK: pose the arms + draw the prop ----
  if (wd>0.55){
    // OVERRIDE: withdrawing — near arm flung up to shield, far arm braced back
    const shield = { x:headCx + F*headR*0.6, y:headCy - headR*0.2 };
    const brace  = { x:shFar.x - F*s*0.14, y:shFar.y + s*0.12 };
    drawArm(pen,g, shFar, brace, s, cloth, skin, -1);
    drawArm(pen,g, shNear, shield, s, cloth, skin, +1);
    pen.paint(()=>{ g.ellipse(shield.x, shield.y, s*0.045, s*0.036, 0,0,7); }, skin, cw*0.7);
  } else if (o.task==="dig"){
    const grip = { x: cx + F*s*0.24, y: hipY + s*0.06 };
    drawArm(pen,g, shFar, { x:grip.x - F*s*0.02, y:grip.y - s*0.05 }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, grip, s, cloth, skin, +1);
    // SPADE: shaft from the two-handed grip down into the trench, earth-blade
    const blade = { x: lerp(grip.x, rim.x, 0.9), y: lerp(grip.y, P.y-P.ry*0.4, 0.95) };
    pen.limb(()=>{ g.moveTo(grip.x, grip.y - s*0.06); g.lineTo(blade.x, blade.y); }, toneSolid(inkLevel(5)), s*0.028);
    pen.paint(()=>{
      const dx=blade.x-grip.x, dy=blade.y-grip.y, L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L;
      g.moveTo(blade.x+nx*s*0.06, blade.y+ny*s*0.06);
      g.lineTo(blade.x-nx*s*0.06, blade.y-ny*s*0.06);
      g.lineTo(blade.x+ (dx/L)*s*0.10 - nx*s*0.02, blade.y+(dy/L)*s*0.10 - ny*s*0.02);
      g.closePath();
    }, toneSolid(inkLevel(6)), cw*0.7);
    pen.paint(()=>{ g.ellipse(grip.x, grip.y, s*0.045, s*0.034, 0,0,7); }, skin, cw*0.7);
  } else if (o.task==="pour"){
    const hand = { x: cx + F*s*0.30, y: shoulderY + s*0.14 };
    drawArm(pen,g, shFar, { x:hand.x - F*s*0.10, y:hand.y + s*0.02 }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, hand, s, cloth, skin, +1);
    // JUG tilted toward the pit + the falling offering stream
    pen.paint(()=>{
      g.moveTo(hand.x - F*s*0.05, hand.y - s*0.05);
      g.lineTo(hand.x + F*s*0.11, hand.y - s*0.02);
      g.lineTo(hand.x + F*s*0.13, hand.y + s*0.07);
      g.lineTo(hand.x - F*s*0.03, hand.y + s*0.07);
      g.closePath();
    }, toneSolid(inkLevel(5)), cw*0.7);
    // the pouring thread down to the pit
    const spout={ x:hand.x+F*s*0.13, y:hand.y+s*0.02 };
    g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.010); g.globalAlpha=0.7;
    g.beginPath(); g.moveTo(spout.x, spout.y);
    g.quadraticCurveTo(spout.x+F*s*0.04, (spout.y+P.y)/2, rim.x+F*P.rx*0.2, P.y-P.ry*0.3); g.stroke();
    g.globalAlpha=1;
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.040, s*0.032, 0,0,7); }, skin, cw*0.7);
  } else if (o.task==="sheep"){
    // cradle a SHEEP against the near side, head hanging toward the pit
    const bodyC = { x: cx + F*s*0.20, y: hipY - s*0.06 };
    drawArm(pen,g, shNear, { x:bodyC.x, y:bodyC.y+s*0.02 }, s, cloth, skin, +1);
    pen.paint(()=>{ g.ellipse(bodyC.x, bodyC.y, s*0.15, s*0.095, F*0.15, 0,7); }, toneSolid(inkLevel(4)), cw*0.8);
    // fleece dabs
    g.fillStyle=inkLevel(5);
    for(let k=0;k<5;k++){ g.beginPath(); g.arc(bodyC.x+(R()-0.5)*s*0.22, bodyC.y+(R()-0.5)*s*0.12, s*0.030,0,7); g.fill(); }
    // head + dangling legs
    pen.paint(()=>{ g.ellipse(bodyC.x+F*s*0.15, bodyC.y+s*0.05, s*0.055, s*0.040, F*0.4, 0,7); }, toneSolid(inkLevel(5)), cw*0.6);
    g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.012); g.lineCap="round";
    for(let k=-1;k<=1;k+=2){ g.beginPath(); g.moveTo(bodyC.x+k*s*0.06, bodyC.y+s*0.08); g.lineTo(bodyC.x+k*s*0.05, bodyC.y+s*0.17); g.stroke(); }
    drawArm(pen,g, shFar, { x:bodyC.x - F*s*0.06, y:bodyC.y - s*0.02 }, s, cloth, skin, -1);
  } else if (o.task==="burn"){
    // tend a small FIRE on the near lip: both hands reach to feed it
    const fire = { x: cx + F*s*0.26, y: hipY + s*0.10 };
    drawArm(pen,g, shFar, { x:fire.x - F*s*0.06, y:fire.y - s*0.04 }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, { x:fire.x, y:fire.y - s*0.02 }, s, cloth, skin, +1);
    // flame tongues
    const flick = 0.6 + 0.4*Math.sin((o.phase||0)*7 + o.seed);
    pen.paint(()=>{
      g.moveTo(fire.x - s*0.06, fire.y);
      g.quadraticCurveTo(fire.x - s*0.02, fire.y - s*0.14*flick, fire.x, fire.y - s*0.20*flick);
      g.quadraticCurveTo(fire.x + s*0.03, fire.y - s*0.12*flick, fire.x + s*0.06, fire.y);
      g.closePath();
    }, toneSolid(inkLevel(5)), cw*0.6);
    pen.paint(()=>{
      g.moveTo(fire.x - s*0.03, fire.y);
      g.quadraticCurveTo(fire.x, fire.y - s*0.09*flick, fire.x + s*0.01, fire.y - s*0.13*flick);
      g.quadraticCurveTo(fire.x + s*0.02, fire.y - s*0.07*flick, fire.x + s*0.03, fire.y);
      g.closePath();
    }, toneSolid(inkLevel(2)), cw*0.5);
  } else if (o.task==="pray"){
    // arms LIFTED in supplication over the pit
    const hiN = { x: cx + F*s*0.22, y: shoulderY - s*0.30 };
    const hiF = { x: cx + F*s*0.06, y: shoulderY - s*0.34 };
    drawArm(pen,g, shFar, hiF, s, cloth, skin, -1);
    drawArm(pen,g, shNear, hiN, s, cloth, skin, +1);
    pen.paint(()=>{ g.ellipse(hiN.x,hiN.y,s*0.036,s*0.030,0,0,7); }, skin, cw*0.6);
    pen.paint(()=>{ g.ellipse(hiF.x,hiF.y,s*0.034,s*0.028,0,0,7); }, skin, cw*0.6);
  } else {
    // default working reach toward the pit
    const hand = { x: cx + F*s*0.24, y: hipY - s*0.02 };
    drawArm(pen,g, shFar, { x:hand.x - F*s*0.06, y:hand.y }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, hand, s, cloth, skin, +1);
  }
}

/* face turned toward `turn` (+1 pit / -1 recoiled). Attention narrows the eyes
   toward the blood; withdraw blows them wide and drops the jaw. */
function drawFace(pen,g, hx,hy,headR,turn,att,wd){
  const eyeY=hy - headR*0.04, edx=headR*0.32;
  g.fillStyle=INK;
  const eye=(ex,r)=>{ g.beginPath(); g.ellipse(ex, eyeY, r, headR*(0.10+0.10*wd), 0,0,7); g.fill(); };
  eye(hx + turn*edx, headR*(0.11+0.05*wd));
  eye(hx - turn*edx*0.5, headR*(0.08+0.04*wd));
  // brows
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.11); g.lineCap="round";
  const brow=(ex)=>{ g.beginPath(); g.moveTo(ex-headR*0.14, eyeY-headR*(0.30-0.10*wd)); g.lineTo(ex+headR*0.14, eyeY-headR*(0.24+0.06*wd)); g.stroke(); };
  brow(hx + turn*edx); brow(hx - turn*edx*0.5);
  // nose toward the turn
  g.lineWidth=Math.max(2,headR*0.07);
  g.beginPath(); g.moveTo(hx+turn*headR*0.10, eyeY+headR*0.10); g.lineTo(hx+turn*headR*0.24, eyeY+headR*0.34); g.stroke();
  // mouth — set line when praying/working, agape when withdrawing
  const my=hy+headR*0.50;
  if (wd>0.5){
    g.fillStyle=INK; g.beginPath(); g.ellipse(hx+turn*headR*0.06, my, headR*0.16, headR*0.16, 0,0,7); g.fill();
  } else {
    g.lineWidth=Math.max(2,headR*0.09);
    g.beginPath(); g.moveTo(hx-headR*0.14, my); g.lineTo(hx+headR*0.16, my); g.stroke();
  }
}

/* ============================================================
   STAGE — ground, back trio, the trench + ghost-ring, front pair, in
   painter's order so front members crop the near rim.
   ============================================================ */
function drawEnsemble(ctx,W,H,st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const att   = st.attention ?? params.attention;
  const wd0   = st.withdraw  ?? params.withdraw;
  const ghost = st.ghost     ?? params.ghost;
  const phase = st.phase     ?? params.phase;
  const dens  = st.density   ?? params.density;
  const floor = (st.floorLevel ?? params.floorLevel)*H;
  const P = pitGeom(W,H,st);

  // ---- world's-edge ground: pale sky/void above, mid ground below ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,floor);
  g.fillStyle = inkLevel(2); g.fillRect(0,floor,W,H-floor);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
  g.beginPath(); g.moveTo(0,floor); g.lineTo(W,floor); g.stroke(); g.globalAlpha=1;

  // per-member withdraw as a phase-staggered REACTION WAVE
  const roster = ROSTER.filter((m,i)=> i < Math.round(ROSTER.length*clamp01(dens)) );
  const memberWithdraw = (i)=>{
    const w = clamp01(wd0) * (0.55 + 0.45*Math.sin(phase*Math.PI*2 - i*0.9));
    return clamp01(w);
  };

  // ---- BACK trio (behind the trench) ----
  roster.filter(m=>m.band===0).forEach((m)=>{
    const i=ROSTER.indexOf(m);
    drawMember(pen,g,{ cx:m.nx*W, footY:m.footY*H, s:m.s, lvl:m.lvl, face:m.face, task:m.task,
      attention:att, withdraw:memberWithdraw(i), ghost, phase, pit:P, seed:611+i*173 });
  });

  // ---- the TRENCH + the risen GHOST-RING between the rows ----
  drawPit(pen,g,W,H,P);
  drawGhostRing(pen,g,W,H,P,ghost,phase);

  // ---- FRONT pair (nearer camera, cropping the rim) ----
  roster.filter(m=>m.band===1).forEach((m)=>{
    const i=ROSTER.indexOf(m);
    drawMember(pen,g,{ cx:m.nx*W, footY:m.footY*H, s:m.s, lvl:m.lvl, face:m.face, task:m.task,
      attention:att, withdraw:memberWithdraw(i), ghost, phase, pit:P, seed:611+i*173 });
  });
}

export const asset = {
  id:"ensemble.crew-ritual-assistants",
  type:"ENSEMBLE",
  name:"Crew ritual assistants",
  statusWord:"OFFERING",
  scene:"OD-B11-S01",

  params,
  // ONE member template, instanced around the trench with per-member ritual tasks
  member:{ template:"member", roster:ROSTER.map(r=>r.key), formation:"ritual-ring",
           tasks:["dig","sheep","pour","burn","pray","withdraw"] },
  // back -> front draw order the stage honors
  layers:["ground","band-back","trench","ghost-ring","band-front"],
  // normalized placement / camera / attachment anchors (NOT baked characters)
  anchors:{
    "pit:center":{ x:0.500, y:0.720 }, "pit:near-rim":{ x:0.500, y:0.778 },
    "stand:digger":{ x:0.320, y:0.740 }, "stand:pourer":{ x:0.700, y:0.735 },
    "stand:shepherd":{ x:0.185, y:0.598 }, "stand:burner":{ x:0.410, y:0.572 },
    "stand:prayer":{ x:0.600, y:0.570 }, "stand:witness":{ x:0.830, y:0.596 },
    "ghost:ring":{ x:0.500, y:0.640 },
    "camera:wide":{ x:0.50, y:0.50 }, "camera:pit":{ x:0.50, y:0.68 },
  },
  // the working ground the ring stands on, and the pit hazard zone
  zones:{ ground:{ x0:0.06, y0:0.56, x1:0.94, y1:0.96 }, pit:{ x0:0.35, y0:0.66, x1:0.65, y1:0.79 } },
  states:{
    initial:"digging",
    nodes:{
      // the trench being cut, sheep held, the ring bent to work
      digging:{  preview:{ attention:0.90, withdraw:0.0, ghost:0.10, phase:0.0, density:1.0 } },
      // the threefold offering poured, the burn tended, the prayer lifted
      offering:{ preview:{ attention:0.85, withdraw:0.0, ghost:0.30, phase:0.2, density:1.0 } },
      // the shades throng up — the whole ring recoils from the ghost-ring
      withdraw:{ preview:{ attention:0.30, withdraw:0.92, ghost:0.85, phase:0.35, density:1.0 } },
    },
    edges:[["digging","offering"],["offering","withdraw"],["withdraw","offering"]],
  },
  channels:["attention","withdraw","ghost","phase","density"],

  preview:()=>({ attention:0.86, withdraw:0.0, ghost:0.28, phase:0.1, density:1.0, status:"OFFERING", progress:0.5 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
