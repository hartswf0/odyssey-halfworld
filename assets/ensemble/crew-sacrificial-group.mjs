/* ensemble.crew-sacrificial-group — starving sailors at the forbidden slaughter.
   ENSEMBLE asset. Scene function (OD-B12-S06, the cattle of Helios on Thrinacia):
   the gaunt, famished crew performing a DISTORTED sacrifice — one man SLAUGHTERING
   a fallen ox with a knife, a second FLAYING it, others TENDING a roasting FIRE and
   turning meat on a SPIT, and two crouched in a FORCED, GRIM FEAST — eating the
   forbidden beef while heads bow and turn in shame.

   Built from ONE separable member template (drawMember) instanced N times
   deterministically around two stations: the OX CARCASS (left) and the roasting
   HEARTH + spit (right), with feasters low front-center. Each member carries an
   intrinsic TASK (slaughter / flay / fire / turn / feast), but the ensemble is
   driven by shared channels: HUNGER (how gaunt the bodies are + how eagerly they
   lean toward the meat), GUILT (0 absorbed in the work .. 1 the whole group bowing
   / turning the face away from the crime, as a phase-staggered shame wave),
   FORMATION (slaughter / fire / feast presets bias the group's stance), PHASE
   (flame flicker + wave timing) and DENSITY (how many of the roster are present).
   Drawn in SOLID grays + hard contour; the engine dotify POST pass supplies the
   halftone. Do NOT bake named characters in — every member is an addressable,
   identical-template gaunt sailor. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the SACRIFICE roster: the SAME gaunt member template stationed around the
   two stations, each with an intrinsic task. Each entry:
     nx    = footline x (0..1 of W)
     footY = footline y (0..1 of H)   (front pair low/near-large, back trio high/far-small)
     s     = member height in px
     lvl   = tunic ink level
     face  = +1 faces right toward its station / -1 faces left toward its station
     band  = 0 back (behind the stations) .. 1 front (nearer camera)
     task  = which distorted rite this sailor performs
     station = "carcass" | "hearth"  (which prop this member works over)
   Six sailors: two at the carcass, two at the hearth, two crouched feasting. */
const ROSTER = [
  { key:"slayer",  nx:0.150, footY:0.720, s:262, lvl:4, face: 1, band:1, task:"slaughter", station:"carcass" },
  { key:"flayer",  nx:0.395, footY:0.585, s:182, lvl:3, face:-1, band:0, task:"flay",      station:"carcass" },
  { key:"tender",  nx:0.860, footY:0.720, s:258, lvl:4, face:-1, band:1, task:"fire",      station:"hearth"  },
  { key:"turner",  nx:0.640, footY:0.585, s:182, lvl:3, face: 1, band:0, task:"turn",      station:"hearth"  },
  { key:"feaster", nx:0.470, footY:0.880, s:250, lvl:4, face: 1, band:1, task:"feast",     station:"hearth"  },
  { key:"gnawer",  nx:0.560, footY:0.600, s:172, lvl:3, face:-1, band:0, task:"feast",     station:"carcass" },
];

const params = {
  count:6,               // ENSEMBLE of up to six gaunt sailors
  hunger:0.85,           // 0 fed/upright .. 1 emaciated + straining toward the meat
  guilt:0.30,            // 0 absorbed in the work .. 1 heads bowed / turned in shame
  phase:0.0,             // 0..1 drives flame flicker + the guilt/shame wave timing
  density:1.0,           // 0..1 fraction of the roster present
  floorLevel:0.55,       // ground horizon as fraction of H
  carcass:{ x:0.300, y:0.740, rx:0.135, ry:0.070 },   // the felled ox
  hearth:{  x:0.720, y:0.745, rx:0.120, ry:0.050 },   // the roasting fire pit
};

function stationGeom(W,H,st){
  const c = st.carcass || params.carcass, h = st.hearth || params.hearth;
  return {
    carcass:{ x:c.x*W, y:c.y*H, rx:c.rx*W, ry:c.ry*H },
    hearth: { x:h.x*W, y:h.y*H, rx:h.rx*W, ry:h.ry*H },
  };
}

/* ============================================================
   THE OX CARCASS — the felled cattle of the Sun, slaughtered on its side:
   heavy body, legs jutting up, drooping horned head, a dark blood pool.
   ============================================================ */
function drawCarcass(pen,g,W,H,C){
  // faint ground shadow (kept light so it doesn't blob)
  g.fillStyle="rgba(0,0,0,0.07)";
  g.beginPath(); g.ellipse(C.x, C.y+C.ry*0.85, C.rx*1.15, C.ry*0.4, 0,0,7); g.fill();
  // blood pooled under the throat (darkest)
  pen.paint(()=>{ g.ellipse(C.x - C.rx*0.75, C.y + C.ry*0.75, C.rx*0.5, C.ry*0.42, 0,0,7); }, toneSolid(inkLevel(7)), 3);
  // FOUR legs jutting stiffly up off the fallen body (drawn first, behind body)
  g.strokeStyle=INK; g.lineCap="round"; g.lineJoin="round";
  for(let k=0;k<4;k++){
    const lx = C.x - C.rx*0.42 + k*C.rx*0.36;
    const up = C.ry*(2.0 + (k%2?0.5:0.0));      // stiff, upright legs
    const knee = { x:lx + (k<2?-1:1)*C.rx*0.10, y:C.y - up*0.55 };
    const hoof = { x:knee.x + (k%2?1:-1)*C.rx*0.14, y:C.y - up };
    g.lineWidth=Math.max(5,C.rx*0.11);
    g.beginPath(); g.moveTo(lx, C.y - C.ry*0.3); g.lineTo(knee.x, knee.y); g.lineTo(hoof.x, hoof.y); g.stroke();
    g.lineWidth=Math.max(5,C.rx*0.15);          // hoof cap
    g.beginPath(); g.moveTo(hoof.x - C.rx*0.05, hoof.y); g.lineTo(hoof.x + C.rx*0.05, hoof.y); g.stroke();
  }
  // the heavy ox BODY on its side (mid tone, not black)
  pen.paint(()=>{ g.ellipse(C.x, C.y, C.rx, C.ry, 0,0,7); }, toneSolid(inkLevel(4)), 5);
  // flayed/opened flank (lighter patch) with scored ribs
  pen.paint(()=>{ g.ellipse(C.x + C.rx*0.30, C.y - C.ry*0.05, C.rx*0.44, C.ry*0.62, -0.12, 0,7); }, toneSolid(inkLevel(2)), 4);
  g.strokeStyle=INK; g.lineWidth=Math.max(2,C.rx*0.022);
  for(let r=-2;r<=2;r++){
    g.beginPath();
    g.moveTo(C.x + C.rx*0.16 + r*C.rx*0.13, C.y - C.ry*0.5);
    g.quadraticCurveTo(C.x + C.rx*0.22 + r*C.rx*0.13, C.y, C.x + C.rx*0.16 + r*C.rx*0.13, C.y + C.ry*0.45);
    g.stroke();
  }
  // drooping horned HEAD hanging off the throat end (clearly separated, left)
  pen.paint(()=>{ g.ellipse(C.x - C.rx*1.02, C.y + C.ry*0.5, C.rx*0.30, C.ry*0.5, 0.55, 0,7); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.ellipse(C.x - C.rx*1.28, C.y + C.ry*0.9, C.rx*0.17, C.ry*0.28, 0.4, 0,7); }, toneSolid(inkLevel(6)), 3); // muzzle
  g.fillStyle=INK; g.beginPath(); g.ellipse(C.x - C.rx*1.05, C.y + C.ry*0.42, C.rx*0.05, C.ry*0.06, 0,0,7); g.fill(); // dead eye
  // pair of curved HORNS sweeping up off the head
  g.strokeStyle=INK; g.lineWidth=Math.max(3,C.rx*0.055); g.lineCap="round";
  g.beginPath(); g.moveTo(C.x - C.rx*0.86, C.y + C.ry*0.1); g.quadraticCurveTo(C.x - C.rx*1.05, C.y - C.ry*0.8, C.x - C.rx*1.34, C.y - C.ry*0.65); g.stroke();
  g.beginPath(); g.moveTo(C.x - C.rx*0.80, C.y + C.ry*0.14); g.quadraticCurveTo(C.x - C.rx*0.66, C.y - C.ry*0.75, C.x - C.rx*0.86, C.y - C.ry*0.98); g.stroke();
}

/* ============================================================
   THE ROASTING HEARTH — a low fire with a horizontal SPIT of meat over it.
   Flames keyed to `phase`. Meat chunks skewered on the spit.
   ============================================================ */
function drawHearth(pen,g,W,H,Hp,phase){
  // faint ground shadow (light so it doesn't blob)
  g.fillStyle="rgba(0,0,0,0.07)";
  g.beginPath(); g.ellipse(Hp.x, Hp.y+Hp.ry*0.7, Hp.rx*1.1, Hp.ry*0.45, 0,0,7); g.fill();
  // stone ring (mid) + charred ember bed (dark)
  pen.paint(()=>{ g.ellipse(Hp.x, Hp.y, Hp.rx, Hp.ry, 0,0,7); }, toneSolid(inkLevel(4)), 5);
  pen.paint(()=>{ g.ellipse(Hp.x, Hp.y, Hp.rx*0.68, Hp.ry*0.60, 0,0,7); }, toneSolid(inkLevel(6)), 4);
  // FLAMES rising tall off the bed
  const flick = 0.6 + 0.4*Math.sin(phase*7.0);
  for(let k=-2;k<=2;k++){
    const fx = Hp.x + k*Hp.rx*0.32;
    const fl = (1 - Math.abs(k)*0.18) * (0.75 + 0.25*Math.sin(phase*9 + k*1.7));
    pen.paint(()=>{
      g.moveTo(fx - Hp.rx*0.18, Hp.y);
      g.quadraticCurveTo(fx - Hp.rx*0.06, Hp.y - Hp.ry*2.2*fl, fx, Hp.y - Hp.ry*3.6*fl*flick);
      g.quadraticCurveTo(fx + Hp.rx*0.10, Hp.y - Hp.ry*2.0*fl, fx + Hp.rx*0.18, Hp.y);
      g.closePath();
    }, toneSolid(inkLevel(k===0?4:3)), 3);
  }
  // inner pale flame cores
  g.fillStyle=inkLevel(2);
  for(let k=-1;k<=1;k++){
    const fx=Hp.x+k*Hp.rx*0.28;
    g.beginPath();
    g.moveTo(fx, Hp.y);
    g.quadraticCurveTo(fx-Hp.rx*0.05, Hp.y-Hp.ry*1.4, fx, Hp.y-Hp.ry*2.4*flick);
    g.quadraticCurveTo(fx+Hp.rx*0.05, Hp.y-Hp.ry*1.4, fx, Hp.y);
    g.fill();
  }
  // the SPIT — two forked uprights + a horizontal skewer with meat chunks
  const spY = Hp.y - Hp.ry*3.4;
  g.strokeStyle=INK; g.lineWidth=Math.max(3,Hp.rx*0.05); g.lineCap="round";
  // forked uprights
  [-1,1].forEach(sd=>{
    const ux=Hp.x + sd*Hp.rx*1.05;
    g.beginPath(); g.moveTo(ux, Hp.y+Hp.ry*0.4); g.lineTo(ux, spY); g.stroke();
    g.beginPath(); g.moveTo(ux, spY); g.lineTo(ux - sd*Hp.rx*0.12, spY - Hp.ry*0.5); g.stroke();
    g.beginPath(); g.moveTo(ux, spY); g.lineTo(ux + sd*Hp.rx*0.10, spY - Hp.ry*0.5); g.stroke();
  });
  // skewer rod
  g.lineWidth=Math.max(3,Hp.rx*0.045);
  g.beginPath(); g.moveTo(Hp.x - Hp.rx*1.3, spY); g.lineTo(Hp.x + Hp.rx*1.3, spY); g.stroke();
  // meat chunks on the spit
  for(let m=-1;m<=1;m++){
    pen.paint(()=>{ g.ellipse(Hp.x + m*Hp.rx*0.55, spY, Hp.rx*0.22, Hp.ry*0.9, 0,0,7); }, toneSolid(inkLevel(6)), 3);
  }
}

/* two-segment gaunt arm from a shoulder to a hand target, elbow flared by `side`. */
function drawArm(pen,g, sh, hand, s, sleeve, skin, side){
  const mx = lerp(sh.x, hand.x, 0.5) + side*s*0.04;
  const my = lerp(sh.y, hand.y, 0.5) + s*0.035;
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(mx,my); }, sleeve, s*0.040);
  pen.limb(()=>{ g.moveTo(mx,my); g.lineTo(hand.x,hand.y); }, skin, s*0.032);
}

/* ============================================================
   MEMBER TEMPLATE — one gaunt, starving sailor.
   o = { cx, footY, s, lvl, face, task, hunger, guilt, phase, C, Hp, seed }
   Faces its station (F=face). HUNGER thins the trunk/limbs and drives an eager
   lean IN toward the meat; GUILT bows the head and turns the face AWAY from the
   crime (over the shoulder). Each task poses the working arms + draws its prop
   (knife / flaying hand / raked fire / turned spit-hand / gnawed meat).
   ============================================================ */
function drawMember(pen,g,o){
  const s=o.s, cx=o.cx, footY=o.footY, F=o.face;
  const hun = clamp01(o.hunger);
  const gl  = clamp01(o.guilt);
  const R   = rnd(o.seed);
  const cloth = toneSolid(inkLevel(o.lvl));
  const limbT = toneSolid(inkLevel(3));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const cw = Math.max(3, s*0.018);

  // feasters crouch low; others stand bent to work
  const crouch = o.task==="feast" ? 0.30 : 0.0;
  // net lean: IN toward the station under hunger, a touch of recoil under guilt
  const lean = F * s*(0.12*hun - 0.05*gl);
  const hipY = footY - s*(0.40 - 0.14*crouch);
  const shoulderDrop = s*(0.40 - 0.10*crouch)*(1 - 0.05*hun) + gl*s*0.03;
  const shoulderY = hipY - shoulderDrop;
  const shoulderCx= cx + lean;
  // GAUNT proportions — narrow frame, hunger thins it further
  const shoulderW = s*(0.28 - 0.04*hun);
  const hipW = s*(0.20 - 0.03*hun);
  const headR= s*0.120;

  // ---- ground shadow ----
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, footY+s*0.010, s*0.28, s*0.038, 0,0,7); g.fill();

  // ---- LEGS: braced / crouched stance ----
  const stance = s*(0.15 + 0.05*hun + 0.06*crouch);
  const rearFootX = cx - F*stance;
  const frontFootX= cx + F*stance*0.85;
  const kneeY = hipY + s*(0.20 - 0.03*crouch);
  const rearHip = { x:cx - F*hipW*0.34, y:hipY };
  const frontHip= { x:cx + F*hipW*0.34, y:hipY };
  const pants = toneSolid(inkLevel(4));
  pen.limb(()=>{ g.moveTo(rearHip.x,rearHip.y); g.lineTo(cx-F*s*(0.10+0.05*crouch),kneeY); }, pants, s*0.048);
  pen.limb(()=>{ g.moveTo(cx-F*s*(0.10+0.05*crouch),kneeY); g.lineTo(rearFootX,footY); }, pants, s*0.040);
  pen.paint(()=>{ g.ellipse(rearFootX-F*s*0.03, footY, s*0.054, s*0.022, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  pen.limb(()=>{ g.moveTo(frontHip.x,frontHip.y); g.lineTo(cx+F*s*(0.12+0.06*crouch),kneeY); }, pants, s*0.052);
  pen.limb(()=>{ g.moveTo(cx+F*s*(0.12+0.06*crouch),kneeY); g.lineTo(frontFootX,footY); }, pants, s*0.044);
  pen.paint(()=>{ g.ellipse(frontFootX+F*s*0.03, footY, s*0.056, s*0.024, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);

  // ---- TORSO: gaunt trapezoid sheared by the lean ----
  pen.paint(()=>{
    g.moveTo(shoulderCx - shoulderW/2, shoulderY);
    g.lineTo(shoulderCx + shoulderW/2, shoulderY);
    g.lineTo(cx + hipW/2, hipY);
    g.lineTo(cx - hipW/2, hipY);
    g.closePath();
  }, cloth, cw);
  // starved RIBS scored into the chest (keyed to hunger)
  if (hun>0.25){
    g.strokeStyle=INK; g.lineWidth=Math.max(1.5,s*0.010); g.globalAlpha=0.5+0.4*hun;
    for(let r=0;r<3;r++){
      const ry = shoulderY + shoulderDrop*(0.30+0.16*r);
      const rw = lerp(shoulderW, hipW, (0.30+0.16*r))*0.42;
      g.beginPath();
      g.moveTo(shoulderCx - rw, ry);
      g.quadraticCurveTo(shoulderCx, ry + s*0.02, shoulderCx + rw, ry);
      g.stroke();
    }
    g.globalAlpha=1;
  }
  pen.seam(()=>{ g.moveTo(cx-hipW*0.5, hipY-s*0.01); g.lineTo(cx+hipW*0.5, hipY-s*0.01); }, cw*0.6);

  // ---- NECK + HEAD; guilt bows the head + turns the face AWAY over the shoulder ----
  const turn = gl>0.45 ? -F : F;                     // gaze toward meat, or wrenched away
  const bow = gl*headR*0.5 + crouch*headR*0.6;       // head sinks forward/down
  const headCx = shoulderCx + F*s*0.03 - gl*F*s*0.04;
  const headCy = shoulderY - headR*(0.98 - 0.20*hun) + bow;
  pen.limb(()=>{ g.moveTo(shoulderCx, shoulderY+s*0.01); g.lineTo(headCx, headCy+headR*0.7); }, skin, s*0.044);
  pen.paint(()=>{ g.arc(headCx, headCy, headR, 0,7); }, skin, cw);
  // matted hair cap over the crown / far side
  pen.paint(()=>{ g.arc(headCx, headCy-headR*0.06, headR*1.02, Math.PI*(0.82 - (turn>0?0:0.5)), Math.PI*(1.82 - (turn>0?0:0.5))); }, hair, cw*0.8);
  drawFace(pen,g, headCx, headCy, headR, turn, hun, gl);

  // ---- SHOULDER anchor points ----
  const shNear = { x:shoulderCx + F*shoulderW*0.42, y:shoulderY + s*0.03 };
  const shFar  = { x:shoulderCx - F*shoulderW*0.36, y:shoulderY + s*0.05 };

  // ---- station work-point ----
  const ST = o.station==="hearth" ? o.Hp : o.C;
  const work = { x: ST.x - F*ST.rx*0.6, y: ST.y - ST.ry*0.2 };

  // ---- TASK: pose the arms + draw the prop ----
  if (o.task==="slaughter"){
    // both hands drive a KNIFE down into the ox's throat
    const grip = { x: cx + F*s*0.26, y: hipY - s*0.02 };
    drawArm(pen,g, shFar, { x:grip.x - F*s*0.04, y:grip.y - s*0.04 }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, grip, s, cloth, skin, +1);
    const tip = { x: lerp(grip.x, work.x, 0.85), y: lerp(grip.y, ST.y - ST.ry*0.2, 0.95) };
    pen.limb(()=>{ g.moveTo(grip.x, grip.y); g.lineTo(tip.x, tip.y); }, toneSolid(inkLevel(6)), s*0.026); // blade
    g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.012);
    g.beginPath(); g.moveTo(grip.x - F*s*0.04, grip.y); g.lineTo(grip.x + F*s*0.04, grip.y); g.stroke(); // guard
    pen.paint(()=>{ g.ellipse(grip.x, grip.y, s*0.042, s*0.032, 0,0,7); }, skin, cw*0.7);
  } else if (o.task==="flay"){
    // one hand pins the hide, near hand pulls it back — flaying stroke
    const pin  = { x: cx + F*s*0.18, y: hipY - s*0.04 };
    const pull = { x: cx + F*s*0.30, y: shoulderY + s*0.02 };
    drawArm(pen,g, shFar, pin, s, cloth, skin, -1);
    drawArm(pen,g, shNear, pull, s, cloth, skin, +1);
    pen.paint(()=>{ g.ellipse(pin.x, pin.y, s*0.038, s*0.030, 0,0,7); }, skin, cw*0.6);
    pen.paint(()=>{ g.ellipse(pull.x, pull.y, s*0.038, s*0.030, 0,0,7); }, skin, cw*0.6);
  } else if (o.task==="fire"){
    // rakes / feeds the fire, both hands low toward the flames
    const hand = { x: cx + F*s*0.28, y: hipY + s*0.04 };
    drawArm(pen,g, shFar, { x:hand.x - F*s*0.06, y:hand.y - s*0.03 }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, hand, s, cloth, skin, +1);
    // a fire-poker angled into the hearth
    pen.limb(()=>{ g.moveTo(hand.x, hand.y); g.lineTo(work.x, ST.y - ST.ry*0.3); }, toneSolid(inkLevel(5)), s*0.020);
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.040, s*0.030, 0,0,7); }, skin, cw*0.6);
  } else if (o.task==="turn"){
    // reaches up to turn the SPIT — near hand high at the skewer height
    const hand = { x: cx + F*s*0.28, y: shoulderY - s*0.20 };
    drawArm(pen,g, shFar, { x:hand.x - F*s*0.08, y:hand.y + s*0.06 }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, hand, s, cloth, skin, +1);
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.038, s*0.030, 0,0,7); }, skin, cw*0.6);
  } else if (o.task==="feast"){
    // FORCED grim feasting — crouched, both hands lift a chunk of meat to the mouth
    const mouth = { x: headCx + F*headR*0.5, y: headCy + headR*0.4 };
    const hand  = { x: mouth.x + F*s*0.02, y: mouth.y + s*0.02 };
    drawArm(pen,g, shFar, { x:hand.x - F*s*0.05, y:hand.y + s*0.03 }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, hand, s, cloth, skin, +1);
    // the gnawed meat chunk at the mouth
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.055, s*0.040, F*0.3, 0,7); }, toneSolid(inkLevel(6)), cw*0.7);
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.030, s*0.022, 0,0,7); }, skin, cw*0.5); // gripping hand
  } else {
    const hand = { x: cx + F*s*0.24, y: hipY - s*0.02 };
    drawArm(pen,g, shFar, { x:hand.x - F*s*0.06, y:hand.y }, s, cloth, skin, -1);
    drawArm(pen,g, shNear, hand, s, cloth, skin, +1);
  }
}

/* face: hunger hollows the cheek + deep-sets the eyes; guilt drops the brow +
   sets the mouth grim/agape. `turn` = +1 toward the meat / -1 wrenched away. */
function drawFace(pen,g, hx,hy,headR,turn,hun,gl){
  const eyeY=hy - headR*0.02, edx=headR*0.30;
  // sunken hollow of the cheek (light shade under the eye)
  g.fillStyle=inkLevel(4); g.globalAlpha=0.35+0.4*hun;
  g.beginPath(); g.ellipse(hx + turn*headR*0.28, hy+headR*0.26, headR*0.34, headR*0.24, 0,0,7); g.fill();
  g.globalAlpha=1;
  // deep-set eyes
  g.fillStyle=INK;
  const eye=(ex,r)=>{ g.beginPath(); g.ellipse(ex, eyeY, r, headR*(0.11+0.05*gl), 0,0,7); g.fill(); };
  eye(hx + turn*edx, headR*(0.11+0.04*hun));
  eye(hx - turn*edx*0.5, headR*(0.08+0.03*hun));
  // heavy brows, dropped under guilt
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.12); g.lineCap="round";
  const brow=(ex)=>{ g.beginPath(); g.moveTo(ex-headR*0.14, eyeY-headR*(0.34-0.14*gl)); g.lineTo(ex+headR*0.14, eyeY-headR*(0.22+0.02*gl)); g.stroke(); };
  brow(hx + turn*edx); brow(hx - turn*edx*0.5);
  // gaunt nose
  g.lineWidth=Math.max(2,headR*0.07);
  g.beginPath(); g.moveTo(hx+turn*headR*0.10, eyeY+headR*0.08); g.lineTo(hx+turn*headR*0.24, eyeY+headR*0.34); g.stroke();
  // mouth — grim set line, agape when the guilt/eating peaks
  const my=hy+headR*0.52;
  if (gl>0.55){
    g.fillStyle=INK; g.beginPath(); g.ellipse(hx+turn*headR*0.06, my, headR*0.15, headR*0.14, 0,0,7); g.fill();
  } else {
    g.lineWidth=Math.max(2,headR*0.09);
    g.beginPath(); g.moveTo(hx-headR*0.14, my+headR*0.04); g.lineTo(hx+headR*0.16, my); g.stroke();
  }
}

/* ============================================================
   STAGE — ground, back pair, the carcass + hearth stations, front pair, in
   painter's order so front members crop the near props.
   ============================================================ */
function drawEnsemble(ctx,W,H,st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const hun   = st.hunger ?? params.hunger;
  const gl0   = st.guilt  ?? params.guilt;
  const phase = st.phase  ?? params.phase;
  const dens  = st.density ?? params.density;
  const floor = (st.floorLevel ?? params.floorLevel)*H;
  const G = stationGeom(W,H,st);

  // ---- island meadow: pale sky above, mid pasture below ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,floor);
  g.fillStyle = inkLevel(2); g.fillRect(0,floor,W,H-floor);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.20;
  g.beginPath(); g.moveTo(0,floor); g.lineTo(W,floor); g.stroke(); g.globalAlpha=1;

  const roster = ROSTER.filter((m,i)=> i < Math.round(ROSTER.length*clamp01(dens)) );
  // per-member guilt as a phase-staggered SHAME wave
  const memberGuilt = (i)=> clamp01( clamp01(gl0) * (0.6 + 0.4*Math.sin(phase*Math.PI*2 - i*0.8)) );

  const drawOne = (m)=>{
    const i=ROSTER.indexOf(m);
    drawMember(pen,g,{ cx:m.nx*W, footY:m.footY*H, s:m.s, lvl:m.lvl, face:m.face, task:m.task,
      station:m.station, hunger:hun, guilt:memberGuilt(i), phase,
      C:G.carcass, Hp:G.hearth, seed:733+i*167 });
  };

  // ---- BACK pair (behind the stations) ----
  roster.filter(m=>m.band===0).forEach(drawOne);
  // ---- the two STATIONS between the rows ----
  drawCarcass(pen,g,W,H,G.carcass);
  drawHearth(pen,g,W,H,G.hearth,phase);
  // ---- FRONT pair (nearer camera, cropping the props) ----
  roster.filter(m=>m.band===1).forEach(drawOne);
}

export const asset = {
  id:"ensemble.crew-sacrificial-group",
  type:"ENSEMBLE",
  name:"Crew sacrificial group",
  statusWord:"FAMISHED",
  scene:"OD-B12-S06",

  params,
  // ONE gaunt member template, instanced across two stations with per-member tasks
  member:{ template:"member", roster:ROSTER.map(r=>r.key), formation:"slaughter-fire-feast",
           tasks:["slaughter","flay","fire","turn","feast"] },
  // back -> front draw order the stage honors
  layers:["ground","band-back","carcass","hearth","band-front"],
  // normalized placement / camera / attachment anchors (NOT baked characters)
  anchors:{
    "carcass:center":{ x:0.300, y:0.740 }, "carcass:throat":{ x:0.210, y:0.790 },
    "hearth:center":{ x:0.720, y:0.745 }, "hearth:spit":{ x:0.720, y:0.620 },
    "stand:slayer":{ x:0.150, y:0.720 }, "stand:flayer":{ x:0.395, y:0.585 },
    "stand:tender":{ x:0.860, y:0.720 }, "stand:turner":{ x:0.640, y:0.585 },
    "stand:feaster":{ x:0.470, y:0.880 }, "stand:gnawer":{ x:0.560, y:0.600 },
    "camera:wide":{ x:0.50, y:0.50 }, "camera:carcass":{ x:0.30, y:0.70 }, "camera:hearth":{ x:0.72, y:0.70 },
  },
  // the pasture ground the group works on, and the two station hazard zones
  zones:{ ground:{ x0:0.04, y0:0.55, x1:0.96, y1:0.98 },
          carcass:{ x0:0.14, y0:0.66, x1:0.46, y1:0.82 },
          hearth:{ x0:0.58, y0:0.66, x1:0.86, y1:0.80 } },
  states:{
    initial:"slaughter",
    nodes:{
      // the ox felled and cut — the group bent to the knife, little shame yet
      slaughter:{ preview:{ hunger:0.90, guilt:0.20, phase:0.0, density:1.0 } },
      // the meat on the spit, the fire raked high
      fire:{      preview:{ hunger:0.80, guilt:0.35, phase:0.25, density:1.0 } },
      // the forced grim feast — the group hunched, heads turning in guilt
      feast:{     preview:{ hunger:0.70, guilt:0.80, phase:0.5, density:1.0 } },
    },
    edges:[["slaughter","fire"],["fire","feast"],["feast","slaughter"]],
  },
  channels:["hunger","guilt","phase","density"],

  preview:()=>({ hunger:0.88, guilt:0.32, phase:0.12, density:1.0, status:"FAMISHED", progress:0.5 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
