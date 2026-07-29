/* ensemble.suitor-reaction — the suitors' laughter SNAPPING into discomfort.
   ENSEMBLE asset. Book XVII, OD-B17-S05: Antinous has thrown the footstool at
   the beggar on the threshold. The hall roars — and then the roar dies in the
   middle of itself, because one of them says the thing nobody wanted said:
   the gods do walk the earth looking like ragged strangers, and they watch
   what a house does to a man at its door.

   The asset IS that turn. One separable member template (drawSuitor) instanced
   deterministically across depth bands; a single scalar per member — its local
   activation `a` — carries it continuously through three attitudes:

       a = 0.0   LAUGHING   head thrown back, mouth wide, cup up, thigh slapped
       a = 0.5   ARRESTED   head level, mouth a set line, hands down, drawn in
       a = 1.0   WARNING    turned to the threshold, palm up, warding, speaking

   A REACTION-WAVE front sweeps that activation across the ranks, so at any
   `wave` position part of the crowd is still braying and part has already gone
   quiet — the snap is visible as a gradient across the room, not a cut.

   ENSEMBLE controls, all exposed as channels:
     formation  bank | benches | scatter | recoil
     density    thin the deep bands first
     attention  how hard the heads turn onto the threshold
     wave       0 = nobody has turned .. 1 = the whole room has
     waveSpread width of the transition band (the sharpness of the snap)
     arrest     ceiling on `a` — hold the whole crowd at discomfort (0.5)
     rows/perRow/seatY/foreground grading — foreground/background control

   No named character is baked in. Antinous, Eurymachus, Amphinomus and the
   beggar himself are placed by the scene at `head:*`, `focus:*`. The thing
   they warn about is drawn as a SIGN — a diagrammatic cloaked traveller inside
   a hard diamond — never as a figure. Solid grays + hard contour only; the
   engine dotify POST pass supplies the halftone. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const smooth  = t => { t = clamp01(t); return t*t*(3-2*t); };

/* the separable gesture set of the member template — the whole turn is
   legible from arms alone, before a single face is read */
export const GESTURES = ["cup","slap","still","clutch","ward","point"];

const params = {
  formation:"bank",     // bank | benches | scatter | recoil
  rows:3,               // depth bands, back -> front
  perRow:[7,6,5],       // members per band (density control)
  density:1.0,          // 0 = front band only .. 1 = the whole hall
  attention:0.85,       // 0 = heads wandering .. 1 = every head on the threshold
  wave:0.45,            // reaction FRONT: everything left of it has already turned
  waveSpread:0.18,      // width of the transition band (sharpness of the snap)
  arrest:1.0,           // ceiling on local activation: 0.5 holds the room uneasy
  mirth:0.9,            // loudness of the half that is still laughing
  focusX:0.10,          // where the beggar sits — the wave starts here
  focusY:0.88,
  seatY:0.88,           // front-band footline as a fraction of H
  showSign:true,        // the disguised-god diagram overhead
  showThreshold:true,   // threshold block + the thrown stool at the door
  showHall:true,        // broken dado, columns, hung trophies
  showFront:true,       // the dashed reaction-front marker
  seed:1705,
};

/* ---------------- 2-segment arm, shoulder -> elbow -> hand ---------------- */
function arm(pen, sh, hand, F, sleeve, skin, s, bend){
  const g = pen.ctx;
  const dx = hand.x - sh.x, dy = hand.y - sh.y;
  const L = Math.hypot(dx, dy) || 1;
  const el = { x:(sh.x+hand.x)/2 + (-dy/L)*L*bend*F,
               y:(sh.y+hand.y)/2 + ( dx/L)*L*bend*F };
  pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); }, sleeve, s*0.052);
  pen.limb(()=>{ g.moveTo(el.x, el.y); g.lineTo(hand.x, hand.y); }, skin, s*0.042);
  return el;
}

/* ---------------- ONE member: a young noble mid-turn ----------------
   Everything keyed off s (member height), so the same template serves the
   80px back band and the 150px front band. laugh/unease/warn are the three
   blend weights derived from the member's local activation. */
function drawSuitor(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, feat = m.feat, F = m.face;
  const cw = Math.max(2, s*0.020);
  const laugh = m.laugh, unease = m.unease, warn = m.warn;

  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const dark  = toneSolid(inkLevel(m.shade.hair));
  const sashT = toneSolid(inkLevel(m.shade.sash));
  const metal = toneSolid(inkLevel(5));

  const seated  = !!m.seated;
  const seatTop = baseY - s*0.26;
  const hipY    = seated ? seatTop - s*0.055 : baseY - s*0.30;
  const shoY    = hipY - (seated ? s*0.34 : s*0.40);
  const tilt    = m.lean * s*0.095 * F;            // + leans toward the door, - rocks back
  const sx      = cx + tilt;
  const shw     = s*0.178, hemw = s*0.218;
  const headR   = s*0.126*feat.headS;
  const headCy  = shoY - headR*1.02 - laugh*headR*0.46;
  const hx      = sx + m.headTurn*headR*0.24 + tilt*0.40 - F*laugh*headR*0.30;

  // ---- the stool under a seated man: a separate block, never a bench bar ----
  if (seated){
    pen.paint(()=>{ g.rect(cx-s*0.155, seatTop, s*0.31, s*0.055); }, toneSolid(inkLevel(3)), cw);
    pen.ink(()=>{ g.moveTo(cx-s*0.115, seatTop+s*0.055); g.lineTo(cx-s*0.135, baseY); }, cw*1.1);
    pen.ink(()=>{ g.moveTo(cx+s*0.115, seatTop+s*0.055); g.lineTo(cx+s*0.135, baseY); }, cw*1.1);
  }

  // ---- ground shadow: keeps the body planted, adds no mass ----
  g.fillStyle = "rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*0.95, s*0.024, 0,0,7); g.fill();

  // ---- legs ----
  if (seated){
    const kx = cx + F*s*0.19;
    pen.limb(()=>{ g.moveTo(cx+F*s*0.02, seatTop-s*0.01); g.lineTo(kx, seatTop+s*0.02); }, tunic, s*0.062);
    pen.limb(()=>{ g.moveTo(kx, seatTop+s*0.02); g.lineTo(kx-F*s*0.04, baseY-s*0.018); }, skin, s*0.050);
    pen.limb(()=>{ g.moveTo(kx-F*s*0.07, seatTop+s*0.02); g.lineTo(kx-F*s*0.11, baseY-s*0.018); }, skin, s*0.046);
    pen.paint(()=>{ g.ellipse(kx-F*s*0.06, baseY, s*0.055, s*0.022, 0,0,7); }, metal, cw*0.7);
  } else {
    const stride = s*0.070 + warn*s*0.020;
    const fL = cx - stride, fR = cx + stride;
    pen.limb(()=>{ g.moveTo(cx-s*0.066, hipY); g.lineTo(fL, baseY-s*0.018); }, skin, s*0.062);
    pen.limb(()=>{ g.moveTo(cx+s*0.066, hipY); g.lineTo(fR, baseY-s*0.018); }, skin, s*0.062);
    pen.paint(()=>{ g.ellipse(fL, baseY, s*0.053, s*0.022, 0,0,7); }, metal, cw*0.7);
    pen.paint(()=>{ g.ellipse(fR, baseY, s*0.053, s*0.022, 0,0,7); }, metal, cw*0.7);
  }

  // ---- FAR arm, behind the torso ----
  {
    const sh = { x: sx - F*shw*0.80, y: shoY + s*0.045 };
    const hand = (m.gesture === "clutch")
      ? { x: cx + F*hemw*0.10, y: hipY - s*0.12 }                 // forearm across the body
      : (m.gesture === "slap")
        ? { x: cx - F*hemw*0.85, y: hipY + s*0.02 }
        : { x: sx - F*shw*0.86, y: hipY + s*0.02 - laugh*s*0.03 };
    arm(pen, sh, hand, -F, tunic, skin, s, 0.10);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.029, 0, 7); }, skin, cw*0.7);
  }

  // ---- torso: the short tunic trapezoid of the house's uninvited guests ----
  pen.paint(()=>{
    g.moveTo(sx-shw, shoY);
    g.lineTo(sx+shw, shoY);
    g.lineTo(cx+hemw, hipY);
    g.lineTo(cx-hemw, hipY);
    g.closePath();
  }, tunic, cw);
  // the one dark accent on the body: a cross-body sash
  if (feat.sash){
    pen.paint(()=>{
      g.moveTo(sx - F*shw*0.94, shoY + s*0.010);
      g.lineTo(sx - F*shw*0.52, shoY + s*0.004);
      g.lineTo(cx + F*hemw*0.96, hipY - s*0.004);
      g.lineTo(cx + F*hemw*0.54, hipY + s*0.002);
      g.closePath();
    }, sashT, cw*0.7);
  }
  pen.seam(()=>{ g.moveTo(cx-hemw*0.90, hipY-cw*0.8); g.lineTo(cx+hemw*0.90, hipY-cw*0.8); }, cw*0.7);

  // ---- neck + head ----
  pen.paint(()=>{ g.rect(sx-headR*0.29, shoY-headR*0.58, headR*0.58, headR*0.88); }, skin, cw*0.8);
  if (feat.head !== "bald")
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.16, headR*1.10, headR*1.22, 0,0,7); }, dark, cw*0.9);
  pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);

  // ---- face ----
  const eyeY = headCy - headR*0.04 + laugh*headR*0.04;
  const gx   = m.headTurn*headR*0.30;
  const eyeR = headR*0.115;
  const exL = hx - headR*0.32 + gx, exR = hx + headR*0.32 + gx;
  if (laugh > 0.55){
    // squeezed shut with mirth — two short crescents
    g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(2, headR*0.14);
    if (m.headTurn > -0.55){ g.beginPath(); g.arc(exR, eyeY, eyeR*1.25, Math.PI*1.15, Math.PI*1.85); g.stroke(); }
    if (m.headTurn <  0.55){ g.beginPath(); g.arc(exL, eyeY, eyeR*1.25, Math.PI*1.15, Math.PI*1.85); g.stroke(); }
  } else {
    g.fillStyle = INK;
    if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(exR, eyeY, eyeR, eyeR*1.12, 0,0,7); g.fill(); }
    if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(exL, eyeY, eyeR, eyeR*1.12, 0,0,7); g.fill(); }
  }
  // brows: flat under laughter, driven UP and together as the warning lands
  g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(2, headR*0.13);
  {
    const lift = warn*headR*0.16 + unease*headR*0.05;
    g.beginPath();
    g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.40 - lift*0.4);
    g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.46 - lift);
    g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.46 - lift);
    g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.40 - lift*0.4);
    g.stroke();
  }
  // nose points the way the head faces
  g.lineWidth = Math.max(2, headR*0.12);
  g.beginPath();
  g.moveTo(hx+gx*0.6, eyeY+headR*0.06);
  g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.38);
  g.stroke();
  // mouth: a bray, a set line, or a speaking oval
  const open = m.mouth;
  if (open > 0.28){
    pen.paint(()=>{ g.ellipse(hx+gx*0.7, headCy+headR*0.56, headR*(0.16+0.10*open),
                              headR*(0.12+0.24*open), 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);
  } else {
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    g.moveTo(hx-headR*0.24+gx, headCy+headR*0.56);
    g.lineTo(hx+headR*0.24+gx, headCy+headR*0.56);
    g.stroke();
  }
  if (feat.head === "hair")
    pen.paint(()=>{
      g.moveTo(hx-headR*0.92, headCy-headR*0.02);
      g.quadraticCurveTo(hx, headCy-headR*1.32, hx+headR*0.92, headCy-headR*0.02);
      g.quadraticCurveTo(hx+headR*0.50, headCy-headR*0.52, hx, headCy-headR*0.46);
      g.quadraticCurveTo(hx-headR*0.50, headCy-headR*0.52, hx-headR*0.92, headCy-headR*0.02);
    }, dark, cw*0.8);
  else if (feat.head === "fillet")
    pen.paint(()=>{ g.rect(hx-headR*0.95, headCy-headR*0.52, headR*1.90, headR*0.28); }, sashT, cw*0.7);
  if (feat.beard)
    pen.paint(()=>{
      g.moveTo(hx-headR*0.52, headCy+headR*0.36);
      g.quadraticCurveTo(hx, headCy+headR*1.30, hx+headR*0.52, headCy+headR*0.36);
      g.quadraticCurveTo(hx, headCy+headR*0.72, hx-headR*0.52, headCy+headR*0.36);
    }, dark, cw*0.7);

  // ---- NEAR arm: the gesture is the member's position in the turn ----
  const sh = { x: sx + F*shw*0.82, y: shoY + s*0.045 };
  let hand, bend = 0.22, kind = "fist";
  switch (m.gesture){
    case "cup":                                   // wine still up, mid-bray
      hand = { x: sx + F*(shw + s*0.07), y: shoY - s*0.20 }; bend = 0.20; kind = "cup"; break;
    case "slap":                                  // hand down on the thigh
      hand = { x: cx + F*hemw*0.98, y: hipY + s*0.06 }; bend = 0.30; break;
    case "still":                                 // knuckles up at the beard
      hand = { x: hx + F*headR*0.62, y: headCy + headR*0.72 }; bend = 0.26; break;
    case "clutch":                                // hand flat on the chest
      hand = { x: sx - F*shw*0.10, y: shoY + s*0.16 }; bend = 0.26; kind = "palm"; break;
    case "ward":                                  // palm out, warding the door
      hand = { x: sx + F*(shw + s*0.14), y: shoY - s*0.06 }; bend = 0.24; kind = "palm"; break;
    case "point":                                 // the rebuking arm, thrown low
      hand = { x: sx + F*(shw + s*0.19), y: shoY + s*0.20 }; bend = 0.20; kind = "point"; break;
    default:
      hand = { x: sx + F*shw*0.92, y: hipY + s*0.02 }; bend = 0.16;
  }
  arm(pen, sh, hand, F, tunic, skin, s, bend);
  if (kind === "cup"){
    const wx = hand.x, wy = hand.y;
    pen.paint(()=>{ g.moveTo(wx-s*0.043, wy-s*0.052); g.lineTo(wx+s*0.043, wy-s*0.052);
                    g.lineTo(wx+s*0.027, wy+s*0.012); g.lineTo(wx-s*0.027, wy+s*0.012);
                    g.closePath(); }, toneSolid(inkLevel(5)), cw*0.7);
    pen.paint(()=>{ g.rect(wx-s*0.011, wy+s*0.012, s*0.022, s*0.030); }, toneSolid(inkLevel(5)), cw*0.6);
  } else if (kind === "palm"){
    // open hand: pad + three finger ticks — the warding sign of the warning half
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.040, s*0.030, F>0?0.35:-0.35, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ for (let k=-1;k<=1;k++){
      g.moveTo(hand.x + F*s*0.018, hand.y + k*s*0.020);
      g.lineTo(hand.x + F*s*0.058, hand.y + k*s*0.026 - s*0.012);
    } }, cw*0.8);
  } else if (kind === "point"){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.029, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ g.moveTo(hand.x, hand.y); g.lineTo(hand.x + F*s*0.072, hand.y + s*0.014); }, cw*0.9);
  } else {
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.034, 0, 7); }, skin, cw*0.7);
  }

  // ---- overhead marks: the laugh jags, and the warding diamond ----
  if (laugh > 0.60){
    g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.70*laugh;
    g.lineWidth = Math.max(2, s*0.021);
    for (let k=0;k<3;k++){
      const a0 = -Math.PI*0.80 + k*Math.PI*0.17;
      const r0 = headR*1.38, r1 = headR*(1.92 + 0.20*(k%2));
      g.beginPath();
      g.moveTo(hx + Math.cos(a0)*r0*F, headCy + Math.sin(a0)*r0);
      g.lineTo(hx + Math.cos(a0)*r1*F, headCy + Math.sin(a0)*r1);
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  if (m.mark){
    // the small "a god may be standing there" mark: a hard diamond + centre dot
    const my = headCy - headR*2.05, r = headR*0.72;
    g.strokeStyle = INK; g.lineJoin = "round"; g.lineWidth = Math.max(2, s*0.017);
    g.beginPath();
    g.moveTo(hx, my-r); g.lineTo(hx+r*0.72, my); g.lineTo(hx, my+r); g.lineTo(hx-r*0.72, my);
    g.closePath(); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(hx, my, r*0.24, 0, 7); g.fill();
  }
  return { hx, headCy, headR };
}

/* ---------------- the SIGN: what the warning is about ----------------
   A diagram, not a person: a cloaked traveller pictogram inside a hard
   diamond, with a nimbus of short ticks — the god who may be wearing rags.
   Deliberately flat and schematic so it can never be mistaken for cast. */
function drawSign(pen, cx, cy, s){
  const g = pen.ctx;
  // radiant ticks around the frame
  g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.42;
  g.lineWidth = Math.max(2, s*0.055);
  for (let k=0;k<12;k++){
    const a0 = k/12*Math.PI*2;
    g.beginPath();
    g.moveTo(cx+Math.cos(a0)*s*1.28, cy+Math.sin(a0)*s*1.52);
    g.lineTo(cx+Math.cos(a0)*s*1.55, cy+Math.sin(a0)*s*1.84);
    g.stroke();
  }
  g.globalAlpha = 1;
  // the diamond frame
  g.strokeStyle = INK; g.lineJoin = "round"; g.lineWidth = Math.max(3, s*0.075);
  g.beginPath();
  g.moveTo(cx, cy-s*1.36); g.lineTo(cx+s*1.05, cy); g.lineTo(cx, cy+s*1.36); g.lineTo(cx-s*1.05, cy);
  g.closePath(); g.stroke();
  // cloak: a plain triangle, light
  pen.paint(()=>{
    g.moveTo(cx, cy-s*0.62);
    g.lineTo(cx+s*0.46, cy+s*0.76);
    g.lineTo(cx-s*0.46, cy+s*0.76);
    g.closePath();
  }, toneSolid(inkLevel(3)), Math.max(3, s*0.06));
  // hood — the one dark note: the face that is not shown
  pen.paint(()=>{ g.ellipse(cx, cy-s*0.72, s*0.24, s*0.27, 0,0,7); }, toneSolid(inkLevel(6)), Math.max(3, s*0.06));
  // staff, broken clear of the cloak
  pen.ink(()=>{ g.moveTo(cx+s*0.60, cy+s*0.80); g.lineTo(cx+s*0.44, cy-s*0.66); }, Math.max(3, s*0.06));
  // hem tick marks — rags
  pen.ink(()=>{ for (let k=-1;k<=1;k++){
    g.moveTo(cx+k*s*0.24, cy+s*0.76); g.lineTo(cx+k*s*0.24, cy+s*0.94);
  } }, Math.max(2, s*0.045));
}

/* ---------------- the threshold the whole room is aimed at ----------------
   The beggar is NOT drawn. What is drawn is the place: the door block, the
   ash-line of the step, and the footstool that was thrown, lying on its side. */
function drawThreshold(pen, x, y, s){
  const g = pen.ctx;
  // the step block (short, light — never a slab across the corner)
  pen.paint(()=>{ g.rect(x-s*0.72, y-s*0.14, s*1.44, s*0.17); }, toneSolid(inkLevel(2)), 3);
  pen.paint(()=>{ g.rect(x-s*0.46, y-s*0.27, s*0.92, s*0.13); }, toneSolid(inkLevel(1)), 3);
  // the thrown stool, on its side, legs out — clear of both step and crowd
  const stx = x + s*1.02, sty = y + s*0.14;
  pen.paint(()=>{ g.rect(stx-s*0.09, sty-s*0.40, s*0.18, s*0.40); }, toneSolid(inkLevel(3)), 3);
  pen.ink(()=>{
    g.moveTo(stx+s*0.09, sty-s*0.34); g.lineTo(stx+s*0.40, sty-s*0.46);
    g.moveTo(stx+s*0.09, sty-s*0.08); g.lineTo(stx+s*0.40, sty-s*0.02);
  }, 3.5);
  // impact ticks where it struck and bounced
  g.strokeStyle = INK; g.lineCap="round"; g.globalAlpha = 0.45; g.lineWidth = 3;
  for (let k=0;k<4;k++){
    const a0 = -Math.PI*0.92 + k*Math.PI*0.13;
    g.beginPath();
    g.moveTo(stx + Math.cos(a0)*s*0.42, sty - s*0.28 + Math.sin(a0)*s*0.42);
    g.lineTo(stx + Math.cos(a0)*s*0.64, sty - s*0.28 + Math.sin(a0)*s*0.64);
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---------------- the hall behind them: broken spans only ---------------- */
function drawHall(pen, W, H, horizon){
  const g = pen.ctx;
  // dado in SEPARATE panels of UNEQUAL height, no contour — tone only, so the
  // wall never reads as a bar or a row of boxes across the frame
  const panels = [[0.045,0.185,0.052],[0.235,0.430,0.070],[0.470,0.640,0.044],[0.690,0.860,0.062]];
  for (const [a0,b0,ht] of panels){
    pen.paint(()=>{ g.rect(W*a0, horizon-H*ht, W*(b0-a0), H*ht); }, toneSolid(inkLevel(2)), 0);
  }
  // the wall/floor join, drawn in SEGMENTS with real gaps so it never stripes
  for (const [a0,b0] of [[0.00,0.115],[0.185,0.435],[0.480,0.645],[0.700,0.870],[0.915,1.00]])
    pen.ink(()=>{ g.moveTo(W*a0, horizon); g.lineTo(W*b0, horizon); }, 2.5);
  // hung trophies — shields on the wall, kept clear of the sign
  for (let i=0;i<3;i++){
    const hx = W*(0.275 + i*0.105), hy = horizon - H*0.128;
    pen.paint(()=>{ g.ellipse(hx, hy, W*0.026, H*0.024, 0,0,7); }, toneSolid(inkLevel(3)), 4);
    pen.ink(()=>{ g.moveTo(hx-W*0.026, hy); g.lineTo(hx+W*0.026, hy); }, 2);
  }
  // two columns standing on the back wall, stopping at the horizon
  for (const px of [0.200, 0.905]){
    const bx = W*px, bw = W*0.036;
    pen.paint(()=>{ g.rect(bx-bw/2, H*0.135, bw, horizon-H*0.135); }, toneSolid(inkLevel(2)), 4);
    pen.paint(()=>{ g.rect(bx-bw*0.80, H*0.135, bw*1.60, H*0.024); }, toneSolid(inkLevel(3)), 4);
    pen.seam(()=>{ g.moveTo(bx-bw*0.18, H*0.170); g.lineTo(bx-bw*0.18, horizon-H*0.012); }, 2);
  }
  // the great door at the far left — the beggar's threshold, seen edge-on
  const dx = W*0.015, dw = W*0.070, dtop = horizon - H*0.140;
  pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.140); }, toneSolid(inkLevel(3)), 3);
  pen.seam(()=>{ g.moveTo(dx+dw*0.52, dtop+H*0.014); g.lineTo(dx+dw*0.52, horizon-H*0.008); }, 2);
  pen.paint(()=>{ g.rect(dx+dw, dtop-H*0.010, W*0.014, H*0.150); }, toneSolid(inkLevel(2)), 3);
  pen.paint(()=>{ g.rect(dx-W*0.008, dtop-H*0.018, dw+W*0.028, H*0.012); }, toneSolid(inkLevel(2)), 3);
}

/* ---------------- deterministic member build ---------------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = p.formation || "bank";
  const attention = clamp01(p.attention);
  const mirth     = clamp01(p.mirth);
  const wave      = p.wave ?? params.wave;
  const sigma     = Math.max(0.05, p.waveSpread ?? params.waveSpread);
  const arrest    = clamp01(p.arrest ?? 1);
  const density   = clamp01(p.density);
  const rows      = Math.max(1, p.rows|0);
  const perRow    = p.perRow || params.perRow;
  const seatY     = p.seatY ?? params.seatY;
  const focusX    = (p.focusX ?? params.focusX) * W;
  const focusY    = (p.focusY ?? params.focusY) * H;
  const seed      = (p.seed ?? params.seed) >>> 0;

  const members = [];
  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 1;                    // 0 = back .. 1 = front
    if (density < 1 && depth < (1-density)*0.9) continue;     // thin the deep bands first
    let n = perRow[Math.min(r, perRow.length-1)] || Math.max(2, 7-2*r);
    n = Math.max(2, Math.round(n * (0.55 + 0.45*density)));

    const scale   = lerp(80, 148, depth);
    const rowY    = H*(0.47 + depth*(seatY-0.47));
    // the deeper the band the further it clears the threshold, so the door
    // corner stays open and the beggar's place is never crowded over
    const marginX = lerp(0.215, 0.275, depth);
    const stagger = (r % 2) * 0.42;

    for (let i=0;i<n;i++){
      const rng = rnd((seed + r*197 + i*31 + 11) >>> 0);
      const t   = n>1 ? (i + stagger) / (n - 1 + stagger) : 0.5;
      let px    = lerp(marginX, 0.945, t);
      let by    = rowY;
      let seated = false;

      if (formation === "bank"){
        // a shallow bowl opening toward the door: the wings curl forward
        by = rowY + (1 - Math.sin(clamp01(t)*Math.PI))*scale*0.10;
        seated = depth < 0.45 && (i % 3 === 0);
      } else if (formation === "benches"){
        by = rowY;
        seated = depth < 0.75 && (i % 2 === 0);
      } else if (formation === "scatter"){
        px = clamp01(px + (rng()-0.5)*0.075);
        by = rowY + (rng()-0.5)*scale*0.20;
        seated = rng() < 0.22;
      } else if (formation === "recoil"){
        // the room pulls away from the threshold: a cleared crescent at the door
        px = clamp01(px + (1-clamp01(px))*0.02 + Math.pow(1-clamp01(t), 1.6)*0.11);
        by = rowY + (1 - Math.sin(clamp01(t)*Math.PI))*scale*0.06;
        seated = false;
      }
      px = clamp(px, 0.19, 0.955);
      const cx = W*px;

      // ---- the REACTION WAVE: local activation, 0 laughing .. 1 warning ----
      const raw = smooth(clamp01((wave - px)/sigma * 0.5 + 0.5));
      const a   = clamp01(raw * arrest + (arrest<1 ? 0 : 0));
      const aC  = Math.min(a, arrest);
      const laugh  = (1 - smooth(clamp01(aC/0.5))) * lerp(0.55, 1.0, mirth);
      const warn   = smooth(clamp01((aC - 0.5)/0.5));
      const unease = clamp01(1 - laugh - warn);

      // ATTENTION: heads swing onto the threshold as the laugh dies
      const att = clamp01(attention * (0.22 + 0.78*(unease*0.7 + warn)));
      let headTurn = clamp((focusX - cx)/(W*0.30) * att, -1, 1);
      if (att < 0.28) headTurn = (rng()-0.5)*1.5;             // still braying at a neighbour
      const face = Math.abs(headTurn) < 0.06 ? (rng()<0.5?-1:1) : (headTurn>0 ? 1 : -1);

      // GESTURE — the member's place in the turn, read from arms alone
      let gesture;
      if (laugh > 0.55)      gesture = rng() < 0.52 ? "cup" : "slap";
      else if (warn > 0.55)  gesture = rng() < 0.55 ? "ward" : "point";
      else                   gesture = rng() < 0.55 ? "still" : "clutch";
      if (seated && gesture === "point") gesture = "ward";

      const feat = {
        beard: rng() < 0.26,
        head:  (()=>{ const u = rng(); return u < 0.13 ? "fillet" : u < 0.95 ? "hair" : "bald"; })(),
        headS: 0.90 + rng()*0.20,
        sash:  rng() < 0.45,
      };
      const shade = {
        // light planes, dark accents: tunics stay in the paper half of the scale
        tunic: clamp(Math.round(lerp(2, 3, depth)) + (rng()<0.35 ? 1 : 0), 1, 4),
        skin:  2,
        hair:  Math.round(lerp(5, 6, depth)),
        sash:  clamp(Math.round(lerp(4, 5, depth)), 3, 5),
      };

      members.push({
        cx, baseY:by, s:scale, depth, px, band:r, seated, feat, shade,
        headTurn, face, gesture, a:aC, laugh, unease, warn,
        // rock back under laughter, tip toward the door under the warning
        lean: (warn*0.70 - laugh*0.55),
        mouth: clamp01(laugh*0.95 + warn*0.42),
        mark: warn > 0.72 && gesture === "ward",
      });
    }
  }
  members.sort((a,b)=> a.baseY - b.baseY);   // painter's order: back -> front
  return { members, wave, sigma, attention, formation, focusX, focusY,
           showSign:p.showSign, showThreshold:p.showThreshold,
           showHall:p.showHall, showFront:p.showFront };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const layers = (st && st.layers) || ["hall","floor","threshold","sign","band-back","band-mid","band-front","front-marker"];
  const has = l => layers.includes(l);
  const horizon = H*0.305;

  // lightest possible field — the paper does most of the work
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);

  if (has("hall") && B.showHall !== false) drawHall(pen, W, H, horizon);

  // floor: lines converging on the threshold, plus BROKEN depth rules
  if (has("floor")){
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.18;
    for (let i=0;i<=8;i++){
      g.beginPath();
      g.moveTo(B.focusX, B.focusY);
      g.lineTo(lerp(W*0.02, W*1.04, i/8), horizon);
      g.stroke();
    }
    for (let j=1;j<=3;j++){
      const y = horizon + (H-horizon)*(j/4)*(j/4);
      g.beginPath(); g.moveTo(W*0.03, y); g.lineTo(W*0.42, y); g.stroke();
      g.beginPath(); g.moveTo(W*0.52, y); g.lineTo(W*0.97, y); g.stroke();
    }
    g.globalAlpha = 1;
  }

  if (has("threshold") && B.showThreshold !== false)
    drawThreshold(pen, W*0.120, H*0.885, W*0.082);

  // the disguised-god diagram: what the warning half is talking about
  if (has("sign") && B.showSign !== false)
    drawSign(pen, W*0.735, H*0.150, W*0.064);

  // the crowd, back band -> front band
  const bandLayer = ["band-back","band-mid","band-front"];
  for (const m of B.members){
    if (!has(bandLayer[Math.min(m.band, 2)])) continue;
    drawSuitor(pen, m);
  }

  // the reaction FRONT itself, marked as an instrument reading: a dashed pole
  // with a small bracket on the side that has already turned
  if (has("front-marker") && B.showFront !== false && B.wave > 0.02 && B.wave < 0.98){
    const wx = lerp(W*0.04, W*0.96, clamp01(B.wave));
    g.save();
    g.strokeStyle = ACCENT; g.lineWidth = Math.max(2, W*0.006); g.globalAlpha = 0.55;
    g.setLineDash([W*0.014, W*0.022]);
    g.beginPath(); g.moveTo(wx, horizon+H*0.02); g.lineTo(wx, H*0.965); g.stroke();
    g.setLineDash([]);
    g.lineWidth = Math.max(2, W*0.005);
    g.beginPath();
    g.moveTo(wx - W*0.055, H*0.955); g.lineTo(wx, H*0.955);
    g.moveTo(wx - W*0.055, H*0.955); g.lineTo(wx - W*0.040, H*0.940);
    g.moveTo(wx - W*0.055, H*0.955); g.lineTo(wx - W*0.040, H*0.970);
    g.stroke();
    g.restore();
  }
}

export const asset = {
  id:"ensemble.suitor-reaction",
  type:"ENSEMBLE",
  name:"Suitor reaction",
  statusWord:"SNAPPING",
  scene:"OD-B17-S05",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["hall","floor","threshold","sign","band-back","band-mid","band-front","front-marker"],
  // normalized 0..1 anchors — the scene places its named speakers on these
  anchors:{
    "focus:threshold":{x:.115,y:.905},  "focus:stool":{x:.20,y:.885},
    "sign:god":{x:.735,y:.148},
    "wave:start":{x:.04,y:.70},         "wave:end":{x:.96,y:.70},
    "head:laughing":{x:.80,y:.84},      "head:warning":{x:.32,y:.86},
    "head:arrested":{x:.56,y:.85},
    "row:back":{x:.50,y:.50},           "row:mid":{x:.50,y:.69},   "row:front":{x:.50,y:.88},
    "door:court":{x:.055,y:.62},        "exit:hall":{x:.955,y:.64},
    "column:left":{x:.175,y:.30},       "column:right":{x:.865,y:.30},
    "camera:wide":{x:.50,y:.56},        "camera:snap":{x:.45,y:.74},
  },
  zones:{
    crowd:{ x0:.07,y0:.44,x1:.95,y1:.94 },
    "half:turned":{ x0:.07,y0:.44,x1:.45,y1:.94 },
    "half:laughing":{ x0:.55,y0:.44,x1:.95,y1:.94 },
    threshold:{ x0:.02,y0:.80,x1:.26,y1:.98 },
  },

  states:{
    initial:"laughing",
    nodes:{
      // the full bray — the stool has landed and the hall thinks it is funny
      laughing:{  preview:{ formation:"bank", wave:-0.10, waveSpread:0.18, arrest:1.0,
                            attention:0.30, mirth:1.0, density:1.0, status:"LAUGHING" } },
      // THE SNAP: the front mid-sweep, half the room still roaring
      snapping:{  preview:{ formation:"bank", wave:0.46, waveSpread:0.16, arrest:1.0,
                            attention:0.88, mirth:0.95, density:1.0, status:"SNAPPING" } },
      // the wave has passed but is held at discomfort — nobody has spoken yet
      uneasy:{    preview:{ formation:"bank", wave:1.30, waveSpread:0.20, arrest:0.52,
                            attention:0.80, mirth:0.4, density:1.0, status:"UNEASY" } },
      // the warning itself: palms out, the disguised-god sign overhead
      warning:{   preview:{ formation:"bank", wave:1.30, waveSpread:0.18, arrest:1.0,
                            attention:0.95, mirth:0.3, density:1.0, status:"WARNING" } },
      // the room pulls back off the threshold, a crescent of floor opening
      recoiling:{ preview:{ formation:"recoil", wave:1.30, waveSpread:0.16, arrest:0.90,
                            attention:0.98, mirth:0.2, density:1.0, status:"RECOILING" } },
      // back at table, attention scattered — the same crowd before the throw
      feasting:{  preview:{ formation:"benches", wave:-0.30, waveSpread:0.22, arrest:1.0,
                            attention:0.18, mirth:0.55, density:1.0, status:"FEASTING" } },
      // broken into knots, muttering across the hall
      muttering:{ preview:{ formation:"scatter", wave:1.30, waveSpread:0.24, arrest:0.60,
                            attention:0.55, mirth:0.25, density:1.0, status:"MUTTERING" } },
      // a thin room — wide or early framings
      sparse:{    preview:{ formation:"bank", wave:0.50, waveSpread:0.18, arrest:1.0,
                            attention:0.85, mirth:0.9, density:0.5, status:"THIN" } },
    },
    edges:[
      ["laughing","snapping"],["snapping","uneasy"],["uneasy","warning"],
      ["warning","recoiling"],["recoiling","muttering"],["muttering","feasting"],
      ["feasting","laughing"],["warning","muttering"],["snapping","warning"],
      ["laughing","sparse"],["sparse","snapping"],
    ],
  },
  channels:["formation","wave","waveSpread","arrest","attention","mirth","density","rows","depth"],

  // neutral preview = the asset's reason to exist: the front mid-room, the
  // right half still braying, the left half already warding the door
  preview:()=>({ formation:"bank", wave:0.46, waveSpread:0.16, arrest:1.0,
                 attention:0.88, mirth:0.95, density:1.0,
                 status:"SNAPPING", progress:0.46 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
