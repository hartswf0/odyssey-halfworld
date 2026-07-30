/* ensemble.autolycuss-sons — the sons of Autolycus on the wooded shoulder of
   Parnassus (Book XIX, the scar flashback): the hunting party that goes up
   before dawn, casts along the trail for the boar's slot, closes a horseshoe
   on the thicket where he is bedded, breaks when the tusk opens the boy's
   leg above the knee, kneels and binds the wound, staunches the black blood
   with a chant, and then carries him down to Autolycus's house.

   ENSEMBLE asset. One separable member template — a bearded uncle in a hide
   jerkin with a cross-barred boar spear — instanced N times deterministically
   along a formation curve, so the SHAPE of the group is the story beat:
   a raking line for the cast, a horseshoe for the surround, a knot for the
   binding and the chant, a file for the carry.

   Exposes the ENSEMBLE controls: FORMATION (track | surround | alarm | bind |
   chant | carry | scatter), DENSITY, ATTENTION (how hard the heads come round
   onto the quarry), a reaction-WAVE running along the line (the cry going up),
   and FOREGROUND / BACKGROUND depth (a back band of far hunters up-slope, the
   working rank, and a cropped near pair the camera stands between).

   NOTHING is baked into the middle. The bedded boar is `creature.parnassus-boar`,
   the boy is `character.young-odysseus`, the slope itself is
   `location.mount-parnassus-hunt`; this asset only ever draws the men. The
   lair, the wound mark and the litter are ANCHORS — the scene places bodies on
   them. `showSlope:false` drops the backdrop entirely when the location asset
   is under it.

   Solid grays + hard contour only, nothing above level 6, the group read as
   contour on paper; the engine dotify POST pass supplies the halftone.
   Atlas OD-B19-S05. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const TAU = Math.PI * 2;

/* the separable pose set of the member template — the hunt is legible from
   stance and spear angle alone, at any density and any scale */
export const POSES = ["stalk","read","point","level","brace","recoil",
                      "rush","kneel","bind","chant","bear","watch"];

const params = {
  formation:"surround",  // track | surround | alarm | bind | chant | carry | scatter
  count:8,               // members in the working rank (density control)
  bands:2,               // 1 = the rank only, 2 = + a far band up-slope
  density:1.0,           // 0 = three men on a hillside .. 1 = the whole household
  attention:0.88,        // 0 = casting about .. 1 = every head on the quarry
  effort:0.5,            // 0 = walking .. 1 = shouting, spears couched, weight forward
  wave:1.4,              // 0..1 position of the cry running along the line (>1 = off)
  waveSpread:0.15,       // width of the band of freshly-turned heads
  openFront:0.30,        // 0..0.48 — wedge of the horseshoe left open to camera
  spread:1.0,            // the formation breathing wider / tighter
  foreground:1.0,        // 0 = no near pair .. 1 = two cropped backs framing the gap
  load:0.55,             // 0 = bare litter poles .. 1 = a lashed bundle slung on them
  chantMarks:true,       // the voice ticks at the mouths in `chant`
  showLair:true,         // the bracken bed at the centre of the horseshoe (bare paper)
  showSlope:true,        // treeline + hill contours behind the party
  centreX:0.500,
  centreY:0.762,
  radiusX:0.355,
  radiusY:0.165,
  seed:1905,
};

/* ================= ONE member: a son of Autolycus =========================
   m = { cx, baseY, s, shade, feat, headTurn, face, lean, effort, pose,
         back, depth, layer }.  Every measure keys off s, so the same template
   serves the 70px far band and the 160px cropped near pair. */

function arm(pen, sh, hand, F, sleeve, skin, s, bend){
  const g = pen.ctx;
  const dx = hand.x - sh.x, dy = hand.y - sh.y;
  const L = Math.hypot(dx, dy) || 1;
  const el = { x:(sh.x+hand.x)/2 + (-dy/L)*L*bend*F,
               y:(sh.y+hand.y)/2 + ( dx/L)*L*bend*F };
  pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); }, sleeve, s*0.055);
  pen.limb(()=>{ g.moveTo(el.x, el.y); g.lineTo(hand.x, hand.y); }, skin, s*0.045);
  return el;
}

/* stance table: how the pose sits the body on the ground.
   drop  = how far the hips sink (crouch/kneel), legs = leg construction,
   pitch = torso lean along the facing direction. */
function stance(pose){
  switch (pose){
    case "stalk":  return { drop:0.10, legs:"crouch", pitch: 0.30 };
    case "read":   return { drop:0.13, legs:"kneel1", pitch: 0.36 };
    case "point":  return { drop:0.01, legs:"stride", pitch: 0.16 };
    case "level":  return { drop:0.05, legs:"stride", pitch: 0.22 };
    case "brace":  return { drop:0.08, legs:"stride", pitch:-0.16 };
    case "recoil": return { drop:0.02, legs:"stride", pitch:-0.34 };
    case "rush":   return { drop:0.03, legs:"run",    pitch: 0.34 };
    case "kneel":  return { drop:0.15, legs:"kneel1", pitch: 0.22 };
    case "bind":   return { drop:0.17, legs:"kneel2", pitch: 0.30 };
    case "chant":  return { drop:0.00, legs:"stand",  pitch:-0.14 };
    case "bear":   return { drop:0.04, legs:"stride", pitch: 0.10 };
    default:       return { drop:0.00, legs:"stand",  pitch: 0.04 };
  }
}

function drawLegs(pen, m, cx, hipY, baseY, s, skin, boot, cw, mode, F){
  const g = pen.ctx;
  const foot = (fx, fy, w) => pen.paint(()=>{ g.ellipse(fx, fy, w||s*0.055, s*0.022, 0,0,7); }, boot, cw*0.7);
  const thighW = s*0.066, shinW = s*0.056;
  const hL = cx - s*0.070, hR = cx + s*0.070;
  if (mode === "stand"){
    const fL = cx - s*0.085, fR = cx + s*0.085;
    pen.limb(()=>{ g.moveTo(hL, hipY); g.lineTo(fL, baseY-s*0.020); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(hR, hipY); g.lineTo(fR, baseY-s*0.020); }, skin, thighW);
    foot(fL, baseY); foot(fR, baseY);
  } else if (mode === "stride"){
    const fF = cx + F*s*0.175, fB = cx - F*s*0.120;
    const kF = { x: cx + F*s*0.130, y: hipY + (baseY-hipY)*0.50 };
    const kB = { x: cx - F*s*0.055, y: hipY + (baseY-hipY)*0.52 };
    pen.limb(()=>{ g.moveTo(hL, hipY); g.lineTo(kB.x, kB.y); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(kB.x, kB.y); g.lineTo(fB, baseY-s*0.018); }, skin, shinW);
    foot(fB, baseY, s*0.050);
    pen.limb(()=>{ g.moveTo(hR, hipY); g.lineTo(kF.x, kF.y); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(kF.x, kF.y); g.lineTo(fF, baseY-s*0.018); }, skin, shinW);
    foot(fF, baseY, s*0.058);
  } else if (mode === "crouch"){
    const kF = { x: cx + F*s*0.185, y: hipY + (baseY-hipY)*0.34 };
    const kB = { x: cx - F*s*0.095, y: hipY + (baseY-hipY)*0.44 };
    const fF = cx + F*s*0.150, fB = cx - F*s*0.135;
    pen.limb(()=>{ g.moveTo(hL, hipY); g.lineTo(kB.x, kB.y); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(kB.x, kB.y); g.lineTo(fB, baseY-s*0.018); }, skin, shinW);
    foot(fB, baseY, s*0.050);
    pen.limb(()=>{ g.moveTo(hR, hipY); g.lineTo(kF.x, kF.y); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(kF.x, kF.y); g.lineTo(fF, baseY-s*0.014); }, skin, shinW);
    foot(fF, baseY, s*0.058);
  } else if (mode === "run"){
    const kF = { x: cx + F*s*0.150, y: hipY + (baseY-hipY)*0.40 };
    const fF = cx + F*s*0.115, fB = cx - F*s*0.215;
    pen.limb(()=>{ g.moveTo(hL, hipY); g.lineTo(fB, baseY-s*0.090); }, skin, thighW*0.94);
    foot(fB, baseY-s*0.070, s*0.050);
    pen.limb(()=>{ g.moveTo(hR, hipY); g.lineTo(kF.x, kF.y); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(kF.x, kF.y); g.lineTo(fF, baseY-s*0.020); }, skin, shinW);
    foot(fF, baseY, s*0.056);
  } else if (mode === "kneel1"){
    // one knee down on the leaf mould, the other foot planted forward
    const kD = { x: cx - F*s*0.085, y: baseY - s*0.030 };
    const kF = { x: cx + F*s*0.165, y: hipY + (baseY-hipY)*0.20 };
    const fF = cx + F*s*0.150;
    pen.limb(()=>{ g.moveTo(hL, hipY); g.lineTo(kD.x, kD.y); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(kD.x, kD.y); g.lineTo(kD.x - F*s*0.115, baseY); }, skin, shinW*0.9);
    foot(kD.x - F*s*0.140, baseY, s*0.048);
    pen.limb(()=>{ g.moveTo(hR, hipY); g.lineTo(kF.x, kF.y); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(kF.x, kF.y); g.lineTo(fF, baseY-s*0.018); }, skin, shinW);
    foot(fF, baseY, s*0.058);
  } else { // kneel2 — both shins along the ground, working over the wound
    pen.limb(()=>{ g.moveTo(hL, hipY); g.lineTo(cx - F*s*0.055, baseY-s*0.028); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(hR, hipY); g.lineTo(cx + F*s*0.020, baseY-s*0.028); }, skin, thighW);
    pen.limb(()=>{ g.moveTo(cx - F*s*0.070, baseY-s*0.022);
                   g.lineTo(cx - F*s*0.185, baseY-s*0.010); }, skin, shinW*0.9);
    foot(cx - F*s*0.205, baseY-s*0.006, s*0.048);
  }
}

/* the boar spear: a shaft, a leaf head, and the cross-bar that stops a
   charging pig running up the shaft onto the man. Always a SHORT segment —
   never a span that crosses the frame. */
function drawSpear(pen, ax, ay, bx, by, s, metal, wood, cw){
  const g = pen.ctx;
  const dx = bx-ax, dy = by-ay, L = Math.hypot(dx,dy)||1;
  const ux = dx/L, uy = dy/L, nx = -uy, ny = ux;
  pen.limb(()=>{ g.moveTo(ax, ay); g.lineTo(bx - ux*s*0.10, by - uy*s*0.10); }, wood, s*0.026);
  // cross-bar, set back from the head
  const cxp = bx - ux*s*0.155, cyp = by - uy*s*0.155;
  pen.ink(()=>{ g.moveTo(cxp + nx*s*0.052, cyp + ny*s*0.052);
                g.lineTo(cxp - nx*s*0.052, cyp - ny*s*0.052); }, Math.max(2, cw*0.9));
  // leaf head
  pen.paint(()=>{
    g.moveTo(bx, by);
    g.lineTo(bx - ux*s*0.115 + nx*s*0.032, by - uy*s*0.115 + ny*s*0.032);
    g.lineTo(bx - ux*s*0.145, by - uy*s*0.145);
    g.lineTo(bx - ux*s*0.115 - nx*s*0.032, by - uy*s*0.115 - ny*s*0.032);
    g.closePath();
  }, metal, cw*0.7);
}

function drawHunter(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, feat = m.feat;
  const cw = Math.max(2, s*0.020);
  const jerkin = toneSolid(inkLevel(m.shade.jerkin));
  const skin   = toneSolid(inkLevel(m.shade.skin));
  const dark   = toneSolid(inkLevel(m.shade.hair));
  const hide   = toneSolid(inkLevel(m.shade.hide));
  const boot   = toneSolid(inkLevel(clamp(m.shade.hair-1, 3, 5)));
  const metal  = toneSolid(inkLevel(5));
  const wood   = toneSolid(inkLevel(4));
  const F      = m.face;                       // +1 faces right, -1 faces left
  const eff    = clamp01(m.effort);
  const back   = !!m.back;
  const st     = stance(m.pose);

  const baseY = m.baseY;
  const hipY  = baseY - s*(0.28 - st.drop);
  const shoY  = hipY - s*0.40;
  const tilt  = (m.lean + st.pitch) * s*0.11 * F;
  const sx    = cx + tilt;
  const shw   = s*0.195, hemw = s*0.215;
  const headR = s*0.128*feat.headS;
  const headCy= shoY - headR*1.04 + (m.pose==="chant" ? -s*0.020 : 0);
  const hx    = sx + (back ? 0 : m.headTurn*headR*0.26) + tilt*0.45;

  // ground shadow — keeps the member on the hillside
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*1.05, s*0.026, 0,0,7); g.fill();

  drawLegs(pen, m, cx, hipY, baseY, s, skin, boot, cw, st.legs, F);

  // ---- the hunting knife at the hip: every one of these men is armed ----
  if (feat.knife && !back){
    pen.limb(()=>{ g.moveTo(cx - F*hemw*0.62, hipY - s*0.02);
                   g.lineTo(cx - F*hemw*1.05, hipY + s*0.10); }, metal, s*0.026);
  }

  /* ---- FAR arm, behind the torso ---- */
  const shF = { x: sx - F*shw*0.78, y: shoY + s*0.048 };
  let handF;
  switch (m.pose){
    case "level":  handF = { x: sx + F*(shw + s*0.06), y: shoY + s*0.15 }; break;
    case "brace":  handF = { x: sx - F*shw*0.30,       y: shoY + s*0.24 }; break;
    case "stalk":  handF = { x: sx - F*shw*0.55,       y: hipY - s*0.03 }; break;
    case "read":   handF = { x: sx + F*(shw + s*0.10), y: baseY - s*0.06 }; break;
    case "recoil": handF = { x: sx - F*(shw + s*0.20), y: shoY - s*0.16 }; break;
    case "rush":   handF = { x: sx - F*(shw + s*0.14), y: shoY + s*0.16 }; break;
    case "kneel":
    case "bind":   handF = { x: sx + F*(shw + s*0.12), y: hipY + s*0.11 }; break;
    case "chant":  handF = { x: sx - F*shw*0.92,       y: shoY - s*0.36 }; break;
    case "bear":   handF = { x: sx - F*shw*0.70,       y: hipY + s*0.01 }; break;
    default:       handF = { x: sx - F*shw*0.84,       y: hipY + s*0.02 };
  }
  arm(pen, shF, handF, -F, jerkin, skin, s, 0.11);
  pen.paint(()=>{ g.arc(handF.x, handF.y, s*0.031, 0, 7); }, skin, cw*0.7);

  /* ---- torso: the short hide jerkin ---- */
  pen.paint(()=>{
    g.moveTo(sx-shw, shoY);
    g.lineTo(sx+shw, shoY);
    g.lineTo(cx+hemw, hipY);
    g.lineTo(cx-hemw, hipY);
    g.closePath();
  }, jerkin, cw);
  pen.seam(()=>{ g.moveTo(cx-hemw*0.90, hipY-cw); g.lineTo(cx+hemw*0.90, hipY-cw); }, cw*0.7);
  // the ragged hide hem, three short teeth — only where it can be seen
  if (s > 104)
    pen.seam(()=>{ for (let k=-1;k<=1;k++){
      g.moveTo(cx + k*hemw*0.55, hipY);
      g.lineTo(cx + k*hemw*0.55 + hemw*0.14, hipY + s*0.030); } }, cw*0.6);
  pen.seam(()=>{ g.moveTo(sx + (back?0:-F*shw*0.55), shoY+s*0.05);
                 g.lineTo(cx + (back?0: F*hemw*0.30), hipY-s*0.02); }, cw*0.6);

  // a pelt over one shoulder — the mark of the house of Autolycus
  if (feat.pelt){
    pen.paint(()=>{
      g.moveTo(sx - F*shw*0.20, shoY - headR*0.14);
      g.lineTo(sx + F*shw*1.00, shoY + s*0.06);
      g.lineTo(cx + F*hemw*0.86, hipY + s*0.05);
      g.lineTo(cx + F*hemw*0.06, hipY - s*0.01);
      g.closePath();
    }, hide, cw*0.9);
  }

  /* ---- neck + head ---- */
  pen.paint(()=>{ g.rect(sx-headR*0.30, shoY-headR*0.58, headR*0.60, headR*0.88); }, skin, cw*0.8);
  if (feat.head !== "bald")
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.16, headR*1.10, headR*1.20, 0,0,7); }, dark, cw*0.9);

  if (back){
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.92, headR*1.02, 0,0,7); },
              feat.head==="bald" ? skin : dark, cw);
    pen.seam(()=>{ g.moveTo(hx-headR*0.30, headCy+headR*0.90);
                   g.lineTo(hx+headR*0.30, headCy+headR*0.90); }, cw*0.7);
  } else {
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);
    const eyeY = headCy - headR*0.06;
    const gx   = m.headTurn*headR*0.30;
    const eyeR = headR*0.11;
    const shut = (m.pose === "chant");
    g.fillStyle = INK;
    if (!shut){
      if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(hx+headR*0.32+gx, eyeY, eyeR, eyeR*1.05, 0,0,7); g.fill(); }
      if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(hx-headR*0.32+gx, eyeY, eyeR, eyeR*1.05, 0,0,7); g.fill(); }
    }
    g.strokeStyle = INK; g.lineCap = "round";
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    if (shut){                       // eyes closed on the incantation: two rules
      g.moveTo(hx-headR*0.46+gx, eyeY); g.lineTo(hx-headR*0.16+gx, eyeY);
      g.moveTo(hx+headR*0.16+gx, eyeY); g.lineTo(hx+headR*0.46+gx, eyeY);
    }
    // brows: driven down and in by effort — these are men working
    const bLift = -eff*headR*0.20;
    g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.44 - bLift*0.6);
    g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.54 - bLift);
    g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.54 - bLift);
    g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.44 - bLift*0.6);
    g.stroke();
    g.beginPath();
    g.moveTo(hx+gx*0.6, eyeY+headR*0.08);
    g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.40);
    g.stroke();
    // the mouth: open on the shout and on the chant, set otherwise
    const open = m.pose==="chant" || m.pose==="rush" || m.pose==="recoil" || eff > 0.86;
    if (open){
      pen.paint(()=>{ g.ellipse(hx+gx*0.7, headCy+headR*0.56, headR*0.21, headR*0.29, 0,0,7); },
                toneSolid(inkLevel(6)), cw*0.6);
    } else {
      g.lineWidth = Math.max(2, headR*0.11);
      g.beginPath();
      g.moveTo(hx-headR*0.20+gx, headCy+headR*0.54);
      g.lineTo(hx+headR*0.20+gx, headCy+headR*0.54);
      g.stroke();
    }
    if (feat.head === "hair")
      pen.paint(()=>{
        g.moveTo(hx-headR*0.92, headCy-headR*0.02);
        g.quadraticCurveTo(hx, headCy-headR*1.34, hx+headR*0.92, headCy-headR*0.02);
        g.quadraticCurveTo(hx+headR*0.50, headCy-headR*0.52, hx, headCy-headR*0.46);
        g.quadraticCurveTo(hx-headR*0.50, headCy-headR*0.52, hx-headR*0.92, headCy-headR*0.02);
      }, dark, cw*0.8);
    else if (feat.head === "cap")
      pen.paint(()=>{ g.ellipse(hx, headCy-headR*0.30, headR*0.98, headR*0.62, 0,0,Math.PI,true); }, hide, cw*0.8);
    // the beard: these are grown men, not the boy in the middle
    if (feat.beard)
      pen.paint(()=>{
        g.moveTo(hx-headR*0.56, headCy+headR*0.34);
        g.quadraticCurveTo(hx, headCy+headR*1.46, hx+headR*0.56, headCy+headR*0.34);
        g.quadraticCurveTo(hx, headCy+headR*0.72, hx-headR*0.56, headCy+headR*0.34);
      }, dark, cw*0.7);
  }

  /* ---- NEAR arm: the pose lives here ---- */
  const shN = { x: sx + F*shw*0.80, y: shoY + s*0.048 };
  let handN, bend = 0.20, grip = "fist";
  switch (m.pose){
    case "stalk":  handN = { x: sx + F*(shw + s*0.16), y: hipY - s*0.10 }; bend = 0.18; break;
    case "read":   handN = { x: cx + F*s*0.290,        y: baseY - s*0.020 }; bend = 0.22; grip = "palm"; break;
    case "point":  handN = { x: sx + F*(shw + s*0.30), y: shoY - s*0.06 }; bend = 0.14; grip = "point"; break;
    case "level":  handN = { x: sx + F*(shw + s*0.22), y: shoY + s*0.11 }; bend = 0.12; break;
    case "brace":  handN = { x: sx + F*(shw + s*0.10), y: shoY + s*0.02 }; bend = 0.16; break;
    case "recoil": handN = { x: sx + F*shw*0.50,       y: shoY - s*0.40 }; bend = 0.22; grip = "palm"; break;
    case "rush":   handN = { x: sx + F*(shw + s*0.10), y: shoY - s*0.30 }; bend = 0.24; break;
    case "kneel":  handN = { x: cx + F*s*0.310,        y: hipY + s*0.06 }; bend = 0.20; grip = "palm"; break;
    case "bind":   handN = { x: cx + F*s*0.330,        y: hipY + s*0.10 }; bend = 0.22; grip = "palm"; break;
    case "chant":  handN = { x: sx + F*shw*0.86,       y: shoY - s*0.40 }; bend = 0.14; grip = "palm"; break;
    case "bear":   handN = { x: sx + F*shw*0.44,       y: shoY - s*0.16 }; bend = 0.20; break;
    default:       handN = { x: sx + F*shw*0.90,       y: hipY + s*0.02 }; bend = 0.16;
  }
  arm(pen, shN, handN, F, jerkin, skin, s, bend);
  if (grip === "palm"){
    pen.paint(()=>{ g.ellipse(handN.x, handN.y, s*0.050, s*0.031,
                    m.pose==="chant" ? 0 : (F>0?0.5:-0.5), 0, 7); }, skin, cw*0.7);
  } else if (grip === "point"){
    pen.paint(()=>{ g.arc(handN.x, handN.y, s*0.030, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ g.moveTo(handN.x, handN.y); g.lineTo(handN.x + F*s*0.082, handN.y - s*0.014); }, cw*0.9);
  } else {
    pen.paint(()=>{ g.arc(handN.x, handN.y, s*0.035, 0, 7); }, skin, cw*0.7);
  }

  /* ---- the spear, positioned off the near hand ---- */
  if (feat.spear && m.pose!=="kneel" && m.pose!=="bind" && m.pose!=="chant" && m.pose!=="bear"){
    const h = handN;
    /* the shafts CONVERGE on the bed. Aiming every couched spear at the same
       point is what a closing ring of boar-spears actually does, and it also
       stops the levelled shafts from chaining into one horizontal streak
       across the arc. */
    const aim = m.aim;
    let ux = F, uy = 0.18;
    if (aim){ const dx = aim.x - h.x, dy = aim.y - h.y, L = Math.hypot(dx,dy)||1; ux = dx/L; uy = dy/L; }
    else { const L = Math.hypot(ux,uy); ux/=L; uy/=L; }
    let a, b;
    switch (m.pose){
      case "level":                                   // couched, driving in low
        a = { x: h.x - ux*s*0.34, y: h.y - uy*s*0.34 };
        b = { x: h.x + ux*s*0.58, y: h.y + uy*s*0.58 }; break;
      case "brace":                                   // butt in the dirt, point up
        a = { x: cx - ux*s*0.30, y: baseY - s*0.005 };
        b = { x: h.x + ux*s*0.44, y: h.y + uy*s*0.44 - s*0.16 }; break;
      case "rush":                                    // back over the shoulder
        a = { x: h.x - F*s*0.26, y: h.y + s*0.20 };
        b = { x: h.x + F*s*0.50, y: h.y - s*0.16 }; break;
      case "recoil":                                  // thrown up and away
        a = { x: cx - F*s*0.20, y: baseY - s*0.10 };
        b = { x: cx - F*s*0.62, y: hipY - s*0.44 }; break;
      case "point":                                   // trailing, butt low
        a = { x: cx - F*s*0.26, y: baseY - s*0.02 };
        b = { x: cx + F*s*0.10, y: shoY - s*0.30 }; break;
      default:                                        // carried upright at the walk
        a = { x: cx + F*s*0.13, y: baseY - s*0.01 };
        b = { x: cx + F*s*0.05, y: shoY - s*0.40 };
    }
    drawSpear(pen, a.x, a.y, b.x, b.y, s, metal, wood, cw);
  }

  // the strip of binding cloth in the hands of the men at the wound
  if (m.pose === "bind"){
    pen.limb(()=>{ g.moveTo(handN.x + F*s*0.05, handN.y + s*0.02);
                   g.lineTo(handF.x - F*s*0.02, handF.y + s*0.05); },
             toneSolid(inkLevel(2)), s*0.038);
  }

  // the voice: three short ticks off the open mouth of a chanting man
  if (m.pose === "chant" && m.chantMarks && !back){
    const mxp = hx + F*headR*0.66, myp = headCy + headR*0.52;
    pen.ink(()=>{ for (let k=0;k<3;k++){
      const r0 = headR*(0.42 + k*0.34), ang = -0.35 + k*0.30;
      g.moveTo(mxp + F*Math.cos(ang)*r0, myp + Math.sin(ang)*r0);
      g.lineTo(mxp + F*Math.cos(ang)*(r0+headR*0.22), myp + Math.sin(ang)*(r0+headR*0.22)); } },
      Math.max(2, cw*0.8));
  }
}

/* ============================ the ground ================================= */

/* the bracken bed at the centre of the horseshoe: a patch of BARE paper with
   a broken rim of thicket ticks. Deliberately empty — the boar and the boy
   are scene instances placed on `quarry:*` and `wound:mark`. */
function drawLair(pen, cx, cy, rx, ry){
  const g = pen.ctx;
  g.save(); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, TAU);
  g.fillStyle = inkLevel(0); g.fill(); g.restore();
  const N = 17;
  for (let i=0;i<N;i++){
    if (i % 6 === 4) continue;                       // break the rim
    const a  = (i/N)*TAU;
    const px = cx + rx*Math.cos(a), py = cy + ry*Math.sin(a);
    const len = ry*(0.30 + 0.22*Math.abs(Math.sin(a*3.0)));
    // bracken: a three-finger fan springing radially OUTWARD off the rim, so
    // the bed reads as a hollow the growth has closed over
    const ox = rx*Math.cos(a), oy = ry*Math.sin(a);
    const OL = Math.hypot(ox, oy) || 1;
    const ux = ox/OL, uy = oy/OL;
    pen.ink(()=>{ for (let k=-1;k<=1;k++){
      const th = k*0.55;
      const dx = ux*Math.cos(th) - uy*Math.sin(th);
      const dy = ux*Math.sin(th) + uy*Math.cos(th);
      g.moveTo(px, py);
      g.lineTo(px + dx*len*(1 - Math.abs(k)*0.22), py + dy*len*(1 - Math.abs(k)*0.22)); } }, 3);
  }
}

/* treeline + hill contours. Everything is BROKEN: the canopy is ONE scalloped
   silhouette cut open to the sky in three places, trunks are short and
   separated, contours are gapped runs. No filled band, no rule that crosses
   the frame, and no two edges that line up into one. */
function drawSlope(pen, W, H, seed){
  const g = pen.ctx;
  const rng = rnd((seed + 4441) >>> 0);
  const base = H*0.268;

  /* the pines: separate blocky triangles, each with its OWN foot height, its
     own size and its own tone. No two feet on a line, gaps of bare paper
     between them, and three deliberate holes in the stand. */
  const TREES = 15;
  for (let i=0;i<TREES;i++){
    if (i===3 || i===8 || i===12) continue;                 // holes in the stand
    const tx   = W*(0.030 + i*0.0655 + (rng()-0.5)*0.030);
    const foot = base - H*(0.052*rng());                    // never a shared baseline
    const h    = H*(0.080 + rng()*0.098);
    const wdt  = W*(0.036 + rng()*0.030);
    const lvl  = i%4===1 ? 3 : (i%4===2 ? 1 : 2);
    // a two-tier conifer: blocky, diagrammatic, no curves
    pen.paint(()=>{
      g.moveTo(tx, foot - h);
      g.lineTo(tx + wdt*0.52, foot - h*0.48);
      g.lineTo(tx + wdt*0.30, foot - h*0.46);
      g.lineTo(tx + wdt*0.80, foot);
      g.lineTo(tx - wdt*0.80, foot);
      g.lineTo(tx - wdt*0.30, foot - h*0.46);
      g.lineTo(tx - wdt*0.52, foot - h*0.48);
      g.closePath();
    }, toneSolid(inkLevel(lvl)), 4);
    // a short bare trunk below a few of them
    if (i%3===0)
      pen.paint(()=>{ g.rect(tx-W*0.006, foot, W*0.012, H*(0.020+rng()*0.030)); },
                toneSolid(inkLevel(3)), 3);
  }
  // the slope itself: gapped, curving contour runs, very light
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.15;
  const runs = [
    [[0.00,0.21],[0.33,0.61],[0.74,1.00]],
    [[0.09,0.42],[0.55,0.88]],
    [[0.00,0.15],[0.27,0.54],[0.68,0.93]],
  ];
  for (let j=0;j<3;j++){
    const y = base + (H-base)*Math.pow((j+1)/4.6, 1.5);
    for (const [a,b] of runs[j]){
      g.beginPath();
      g.moveTo(W*a, y + Math.sin(a*7)*H*0.016);
      g.quadraticCurveTo(W*(a+b)/2, y - H*0.026, W*b, y + Math.sin(b*7)*H*0.016);
      g.stroke();
    }
  }
  g.globalAlpha = 1;
  // a few boulders on the shoulder — small, mid-tone, deliberately uneven
  for (let i=0;i<5;i++){
    const rx0 = W*(0.09 + rng()*0.82), ry0 = base + H*(0.05 + rng()*0.13);
    const r = W*(0.016 + rng()*0.018);
    pen.paint(()=>{ g.ellipse(rx0, ry0, r, r*0.55, 0,0,7); }, toneSolid(inkLevel(3)), 3);
    pen.ink(()=>{ g.moveTo(rx0-r*0.5, ry0-r*0.10); g.lineTo(rx0+r*0.4, ry0-r*0.22); }, 2);
  }
}

/* Equal-ARC-LENGTH angles across a stretch of the horseshoe — stepping the
   angle uniformly piles bodies at the turns of a flat perspective ellipse. */
function arcAngles(a0, a1, RX, RY, n){
  const S = 240, da = (a1-a0)/S, cum = [0];
  for (let i=1;i<=S;i++){
    const am = a0 + da*(i-0.5);
    cum[i] = cum[i-1] + Math.hypot(RX*Math.sin(am), RY*Math.cos(am))*Math.abs(da);
  }
  const total = cum[S] || 1, out = [];
  for (let k=0;k<n;k++){
    const target = (n>1 ? k/(n-1) : 0.5) * total;
    let i = 1; while (i < S && cum[i] < target) i++;
    const f = (target - cum[i-1]) / ((cum[i]-cum[i-1]) || 1);
    out.push(a0 + da*(i-1+f));
  }
  return out;
}

/* ---------------- formation -> normalized slots ---------------------------
   Each slot is { x, y, u, role }. `u` is the position along the formation,
   which is what the reaction-WAVE runs along. */
function slots(formation, n, band, p, rng){
  const out = [];
  const spread = p.spread ?? 1;
  const cx0 = p.centreX, cyR = p.centreY;
  const rx  = p.radiusX*spread, ry = p.radiusY*spread;
  const far = band === 1;                       // the far band, up-slope

  if (formation === "track" || formation === "scatter"){
    // a raking line cast across the slope, working up and to the right
    for (let i=0;i<n;i++){
      const u = n>1 ? i/(n-1) : 0.5;
      const wob = (i%2 ? -1 : 1)*0.028;
      let x = lerp(0.115, 0.885, u) + (rng()-0.5)*0.055;
      let y = (far ? 0.470 : 0.560) + (far ? 0.090 : 0.320)*Math.pow(1-u, 1.25) + wob;
      if (formation === "scatter"){ x += (rng()-0.5)*0.10; y += (rng()-0.5)*0.09; }
      out.push({ x, y, u, role: i===0 ? "lead" : "line" });
    }
    return out;
  }

  if (formation === "carry"){
    // a file coming down off the mountain toward the lower left
    for (let i=0;i<n;i++){
      const u = n>1 ? i/(n-1) : 0.5;
      const x = lerp(0.855, 0.135, u) + (rng()-0.5)*0.045;
      const y = (far ? 0.500 : 0.585) + (far ? 0.070 : 0.315)*Math.pow(u, 1.15)
                + (i%2 ? 0.022 : -0.020);
      out.push({ x, y, u, role: far ? "line" : (i%3===0 ? "bearer" : "line") });
    }
    return out;
  }

  if (formation === "bind" || formation === "chant"){
    // a knot: an inner crescent down at the wound, a standing outer arc behind
    const inner = Math.max(2, Math.round(n*0.42));
    for (let i=0;i<n;i++){
      const u = n>1 ? i/(n-1) : 0.5;
      const isIn = !far && i < inner;
      const RX = (isIn ? rx*0.58 : rx*0.90);
      const RY = (isIn ? ry*0.42 : ry*0.82);
      const cy = (isIn ? cyR + 0.048 : cyR - 0.030) + (far ? -0.085 : 0);
      const k  = isIn ? i : (i - inner);
      const m  = isIn ? inner : Math.max(1, n - inner);
      const a  = Math.PI*0.62 + (m>1 ? (k/(m-1)) : 0.5)*Math.PI*1.76;
      out.push({ x: cx0 + RX*Math.cos(a) + (rng()-0.5)*0.016,
                 y: cy + RY*Math.sin(a)*(isIn ? 0.55 : 1) + (rng()-0.5)*0.012,
                 u, role: isIn ? "inner" : "outer" });
    }
    return out;
  }

  // surround | alarm — the horseshoe, open toward the camera.
  // The far band is NOT a second ring: it is a wide, loosely spaced rank of
  // men still coming up the slope, well above and behind the working arc.
  if (far){
    for (let i=0;i<n;i++){
      const u = n>1 ? i/(n-1) : 0.5;
      out.push({ x: lerp(0.095, 0.905, u) + (rng()-0.5)*0.050,
                 y: 0.556 + (i%2 ? 0.038 : -0.024) + (rng()-0.5)*0.024,
                 u, role:"far" });
    }
    return out;
  }
  const gapHalf = clamp(p.openFront, 0.08, 0.48)*Math.PI;
  const RX = rx, RY = ry;
  const a0 = Math.PI/2 + gapHalf;
  const a1 = Math.PI/2 + TAU - gapHalf;
  const ang = arcAngles(a0, a1, RX, RY, n);
  for (let i=0;i<n;i++){
    const u = n>1 ? i/(n-1) : 0.5;
    const jr = 1 + (rng()-0.5)*0.075;
    let x = cx0 + RX*jr*Math.cos(ang[i]);
    let y = cyR + RY*jr*Math.sin(ang[i]);
    if (formation === "alarm"){                  // the ring bulges and breaks
      x += (x - cx0)*0.15 + (rng()-0.5)*0.035;
      y += (rng()-0.5)*0.030;
    }
    out.push({ x, y, u, role:"line" });
  }
  return out;
}

/* ---------------- deterministic member build from params + state ---------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = p.formation || "surround";
  const density   = clamp01(p.density);
  const attention = clamp01(p.attention);
  const effort    = clamp01(p.effort);
  const wave      = p.wave ?? params.wave;
  const sigma     = Math.max(0.05, p.waveSpread ?? params.waveSpread);
  const bands     = clamp((p.bands|0) || 1, 1, 2);
  const fg        = clamp01(p.foreground ?? params.foreground);
  const seed      = (p.seed ?? params.seed) >>> 0;
  const chantMarks= p.chantMarks !== false;

  const cx0 = p.centreX*W, cyR = p.centreY*H;
  const members = [], poles = [];
  const yLo = H*0.44, ySpan = H*0.50;
  const aimPt = (formation === "track")  ? { x:W*0.96, y:H*0.50 }
              : (formation === "carry")  ? { x:W*0.02, y:H*0.86 }
              : { x:cx0, y:cyR };

  for (let band=0; band<bands; band++){
    const far = band === 1;
    if (far && density < 0.40) continue;                    // thin the deep band first
    let n = Math.round((p.count ?? params.count) * (far ? 0.68 : 1) * (0.48 + 0.52*density));
    n = clamp(n, 3, 14);
    const rng = rnd((seed + band*977 + 17) >>> 0);
    const sl  = slots(formation, n, band, p, rng);

    for (let i=0;i<n;i++){
      const s0 = sl[i];
      const px = clamp(s0.x, 0.055, 0.945)*W;
      const by = clamp(s0.y, 0.440, 0.935)*H;
      const depth = clamp01((by - yLo)/ySpan);
      const s = lerp(far ? 66 : 78, far ? 104 : 152, depth);

      // reaction-WAVE: the cry going along the line
      const d   = s0.u - wave;
      const hit = clamp01(Math.exp(-(d*d)/(2*sigma*sigma))) * (far ? 0.6 : 1);
      const eff = clamp01(effort + hit*0.45);

      // ATTENTION: heads come round onto the quarry (or along the trail)
      const att = clamp01(attention + hit*0.30);
      let headTurn = clamp((aimPt.x - px)/(W*0.24) * att, -1, 1);
      if (att < 0.22) headTurn = (rng()-0.5)*1.4;
      let face = aimPt.x >= px ? 1 : -1;
      if (formation === "carry") face = -1;

      // POSE: the member's part in the beat
      const rr = rng();
      let pose;
      if (formation === "track" || formation === "scatter"){
        pose = s0.role === "lead" ? "read"
             : rr < 0.52 ? "stalk" : rr < 0.74 ? "watch" : rr < 0.90 ? "point" : "stalk";
      } else if (formation === "surround"){
        pose = rr < 0.58 ? "level" : rr < 0.90 ? "brace" : "point";
      } else if (formation === "alarm"){
        pose = rr < 0.40 ? "recoil" : rr < 0.76 ? "rush" : rr < 0.92 ? "point" : "brace";
      } else if (formation === "bind"){
        pose = s0.role === "inner" ? (rr < 0.62 ? "bind" : "kneel")
                                   : (rr < 0.55 ? "watch" : rr < 0.82 ? "point" : "brace");
      } else if (formation === "chant"){
        pose = s0.role === "inner" ? (rr < 0.55 ? "kneel" : "bind") : "chant";
      } else {                                              // carry
        pose = s0.role === "bearer" ? "bear"
             : rr < 0.55 ? "watch" : rr < 0.82 ? "stalk" : "point";
      }
      if (hit > 0.55 && (formation === "surround" || formation === "track"))
        pose = rng() < 0.55 ? "rush" : "point";
      // the far band never crosses spears with the working arc — up there the
      // men are still walking in, so the silhouettes stay simple and separate
      if (far) pose = rr < 0.50 ? "watch" : rr < 0.80 ? "stalk" : "point";

      const feat = {
        beard: rng() < 0.74,                                 // grown men, all of them
        head:  (()=>{ const q = rng(); return q < 0.20 ? "cap" : q < 0.94 ? "hair" : "bald"; })(),
        headS: 0.92 + rng()*0.18,
        pelt:  !far && rng() < 0.42,
        knife: s > 96 && rng() < 0.55,                        // detail only where it reads
        spear: far ? rng() < 0.55 : rng() < 0.88,
      };
      // atmospheric depth: the far band prints LIGHT, the near rank a step
      // darker. Nothing above level 6 — the party is contour, not mass.
      const shade = {
        jerkin: clamp(Math.round(lerp(1, 3, depth)) + (feat.pelt ? 1 : 0), 1, 4),
        skin:   2,
        hair:   clamp(Math.round(lerp(4, 5, depth)), 4, 5),
        hide:   clamp(Math.round(lerp(2, 4, depth)), 2, 4),
      };

      members.push({
        cx:px, baseY:by, s, shade, feat, headTurn, face, pose,
        effort:eff, chantMarks,
        // the point every couched shaft converges on
        aim: (formation === "surround" || formation === "alarm")
             ? { x:cx0, y:cyR - H*0.010 } : null,
        lean: clamp((pose==="recoil" ? -0.22 : eff*0.55), -0.35, 0.7),
        depth, back:false, u:s0.u, role:s0.role,
        layer: far ? "band-far" : "rank",
      });
    }
  }

  /* the carry: pair up the bearers front-to-back and hang a pole between
     them. The pole runs ALONG the file, so it is a short diagonal — never a
     bar across the frame. */
  if (formation === "carry"){
    const bs = members.filter(m => m.role === "bearer" && m.layer === "rank")
                      .sort((a,b)=> a.baseY - b.baseY);
    for (let i=0; i+1<bs.length; i+=2) poles.push({ a:bs[i], b:bs[i+1] });
  }

  /* the near pair: two cropped backs at the mouth of the horseshoe, so the
     open front reads as the gap the camera is standing in. */
  if (fg > 0.02 && (formation === "surround" || formation === "alarm" ||
                    formation === "bind" || formation === "chant")){
    let k = 0;
    for (const sgn of [-1, 1]){
      const rng = rnd((seed + 8101 + k*211) >>> 0);
      members.push({
        cx: cx0 + sgn*W*0.300, baseY: H*1.038, s: lerp(124, 148, fg),
        shade:{ jerkin:1, skin:2, hair:5, hide:2 },
        feat:{ beard:false, head: rng()<0.30 ? "cap" : "hair", headS:1.0,
               pelt:false, knife:false, spear:true },
        headTurn: sgn*0.16, face: sgn < 0 ? 1 : -1, pose:"watch",
        effort: clamp01(effort*0.8), chantMarks:false, aim:null,
        lean: 0.06, depth:1, back:true, u: k===0 ? 0.0 : 1.0, role:"near",
        layer:"foreground",
      });
      k++;
    }
  }

  members.sort((a,b)=> a.baseY - b.baseY);      // painter's order: back -> front
  return { members, poles, cx0, cyR, formation,
           rx:p.radiusX*W*(p.spread ?? 1), ry:p.radiusY*H*(p.spread ?? 1),
           load: clamp01(p.load ?? params.load),
           showLair: p.showLair, showSlope: p.showSlope, seed };
}

/* the litter pole between two bearers, with an optional lashed bundle. */
function drawPole(pen, A, B, load){
  const g = pen.ctx;
  const ax = A.cx + A.s*0.10, ay = A.baseY - A.s*(0.66);
  const bx = B.cx - B.s*0.10, by = B.baseY - B.s*(0.66);
  const s = (A.s + B.s)/2;
  pen.limb(()=>{ g.moveTo(ax, ay); g.lineTo(bx, by); }, toneSolid(inkLevel(4)), s*0.030);
  if (load > 0.03){
    const mx = (ax+bx)/2, my = (ay+by)/2;
    const dx = bx-ax, dy = by-ay, L = Math.hypot(dx,dy)||1;
    const ux = dx/L, uy = dy/L, nx = -uy, ny = ux;
    const hl = L*0.30*load + s*0.10, hw = s*0.115;
    pen.paint(()=>{
      g.moveTo(mx - ux*hl + nx*hw*0.45, my - uy*hl + ny*hw*0.45);
      g.lineTo(mx + ux*hl + nx*hw*0.45, my + uy*hl + ny*hw*0.45);
      g.lineTo(mx + ux*hl*0.82 + nx*hw, my + uy*hl*0.82 + ny*hw);
      g.lineTo(mx - ux*hl*0.82 + nx*hw, my - uy*hl*0.82 + ny*hw);
      g.closePath();
    }, toneSolid(inkLevel(2)), Math.max(2, s*0.020));
    for (let k=-1;k<=1;k++)                       // the lashings
      pen.ink(()=>{ g.moveTo(mx + ux*hl*0.55*k + nx*hw*0.42, my + uy*hl*0.55*k + ny*hw*0.42);
                    g.lineTo(mx + ux*hl*0.55*k + nx*hw*1.02, my + uy*hl*0.55*k + ny*hw*1.02); }, 3);
  }
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const layers = (st && st.layers) ||
    ["slope","lair","band-far","rank","poles","foreground"];
  const has = l => layers.includes(l);

  // lightest possible field: the party must read as contour on paper
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  if (has("slope") && B.showSlope !== false) drawSlope(pen, W, H, B.seed);

  if (has("lair") && B.showLair !== false &&
      (B.formation === "surround" || B.formation === "alarm"))
    drawLair(pen, B.cx0, B.cyR, B.rx*0.72, B.ry*0.74);

  for (const m of B.members){
    if (!has(m.layer)) continue;
    drawHunter(pen, m);
    if (has("poles"))
      for (const pl of B.poles) if (pl.b === m) drawPole(pen, pl.a, pl.b, B.load);
  }
}

export const asset = {
  id:"ensemble.autolycuss-sons",
  type:"ENSEMBLE",
  name:"Autolycus's sons",
  statusWord:"CLOSING",
  scene:"OD-B19-S05",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["slope","lair","band-far","rank","poles","foreground"],
  // normalized 0..1 anchors. The middle is EMPTY: the boar, the boy and the
  // spear are scene instances placed on these points.
  anchors:{
    "quarry:lair":{x:.500,y:.762},   "quarry:break":{x:.560,y:.800},
    "quarry:back":{x:.500,y:.640},   "quarry:front":{x:.500,y:.884},
    "quarry:left":{x:.235,y:.762},   "quarry:right":{x:.765,y:.762},
    // paired contact stations — the boy and the boar must never share a point
    "boy:strike":{x:.395,y:.800},    "boar:charge":{x:.610,y:.796},
    "wound:mark":{x:.500,y:.828},    "wound:kneel":{x:.410,y:.856},
    "bind:hands":{x:.560,y:.850},    "chant:centre":{x:.500,y:.806},
    // the cast and the way home
    "trail:head":{x:.885,y:.520},    "trail:foot":{x:.120,y:.900},
    "print:first":{x:.230,y:.865},   "thicket:edge":{x:.720,y:.700},
    "litter:head":{x:.310,y:.860},   "litter:tail":{x:.560,y:.740},
    "litter:load":{x:.435,y:.795},
    // ranks and the open mouth of the horseshoe
    "rank:far":{x:.500,y:.510},      "rank:work":{x:.500,y:.768},
    "rank:near":{x:.500,y:.940},     "gap:mouth":{x:.500,y:.900},
    "gap:foot":{x:.500,y:.990},
    "camera:wide":{x:.500,y:.580},   "camera:lair":{x:.500,y:.790},
    "camera:wound":{x:.470,y:.845},
  },
  // walkable / occupied regions for scene placement + pathing
  zones:{
    lair:{ x0:.300,y0:.690,x1:.700,y1:.845 },        // the bracken bed — kept empty
    clearing:{ x0:.150,y0:.620,x1:.860,y1:.930 },    // where the party works
    "band:far":{ x0:.060,y0:.440,x1:.940,y1:.600 },  // the far men up-slope
    trail:{ x0:.080,y0:.500,x1:.930,y1:.930 },       // the cast / the way down
    treeline:{ x0:.000,y0:.080,x1:1.00,y1:.340 },    // background, not walkable
    gap:{ x0:.340,y0:.880,x1:.660,y1:.995 },         // the open front
  },

  states:{
    initial:"track",
    nodes:{
      // before dawn: the line cast across the slope, reading the ground
      track:{    preview:{ formation:"track", density:0.85, attention:0.45, effort:0.22,
                           wave:1.4, foreground:0, spread:1.0,
                           status:"CASTING", progress:0.10 } },
      // the slot found — the cry travels along the line
      found:{    preview:{ formation:"track", density:0.95, attention:0.85, effort:0.45,
                           wave:0.34, waveSpread:0.13, foreground:0,
                           status:"ON THE SLOT", progress:0.20 } },
      // the horseshoe closed on the bracken bed: the asset's reason to exist
      surround:{ preview:{ formation:"surround", density:1.0, attention:0.88, effort:0.50,
                           openFront:0.30, wave:1.4, spread:1.0,
                           status:"CLOSING", progress:0.38 } },
      // spears couched, the ring tight, the boar not yet up
      set:{      preview:{ formation:"surround", density:1.0, attention:0.98, effort:0.78,
                           openFront:0.26, spread:0.90, wave:1.4,
                           status:"SET", progress:0.46 } },
      // he comes out and the tusk goes in above the boy's knee
      alarm:{    preview:{ formation:"alarm", density:1.0, attention:1.0, effort:1.0,
                           openFront:0.30, spread:1.10, wave:0.50, waveSpread:0.20,
                           status:"BROKEN", progress:0.62 } },
      // the knot down over the leg, the cloth going round
      bind:{     preview:{ formation:"bind", density:1.0, attention:0.95, effort:0.62,
                           spread:0.96, wave:1.4, status:"BINDING", progress:0.74 } },
      // the black blood stopped with a charm
      chant:{    preview:{ formation:"chant", density:1.0, attention:0.90, effort:0.40,
                           spread:1.0, wave:1.4, status:"CHANTING", progress:0.84 } },
      // down off the mountain to Autolycus's house
      carry:{    preview:{ formation:"carry", density:0.95, attention:0.55, effort:0.45,
                           load:0.60, foreground:0, wave:1.4,
                           status:"CARRYING", progress:0.94 } },
      // the party breaking apart — or a thin house for a wide framing
      scatter:{  preview:{ formation:"scatter", density:0.70, attention:0.30, effort:0.35,
                           foreground:0, wave:1.4, status:"SCATTERED", progress:0.66 } },
      sparse:{   preview:{ formation:"surround", density:0.38, attention:0.80, effort:0.30,
                           bands:1, wave:1.4, status:"THIN", progress:0.16 } },
    },
    edges:[
      ["track","found"],["found","surround"],["surround","set"],["set","alarm"],
      ["alarm","bind"],["bind","chant"],["chant","carry"],
      ["surround","alarm"],["alarm","scatter"],["scatter","carry"],
      ["track","sparse"],["sparse","surround"],["surround","track"],
      ["bind","carry"],["carry","track"],
    ],
  },
  channels:["formation","attention","effort","wave","waveSpread","density",
            "count","bands","openFront","spread","foreground","load","depth"],

  // neutral preview = the horseshoe closed on an empty bracken bed: spears
  // levelled, heads round on the thicket, the middle of the frame bare
  preview:()=>({ formation:"surround", density:1.0, attention:0.88, effort:0.50,
                 openFront:0.30, spread:1.0, wave:1.4, waveSpread:0.15,
                 foreground:1.0, load:0.55,
                 status:"CLOSING", progress:0.38 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
