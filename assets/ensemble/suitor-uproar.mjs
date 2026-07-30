/* ensemble.suitor-uproar — the hall rising against Telemachus, and sitting back down.
   ENSEMBLE asset. Book XXI, OD-B21-S05: the beggar has asked for the bow. The
   room comes off its benches in one noise — a shout that is also a threat, also
   a suspicion muttered sideways, also a jeer — and then Telemachus stands at the
   master's place and says the bow is his to give, and the uproar *folds*. Not
   from conviction: they laugh it off and let him have it, for a moment.

   The asset IS that noise and that fold. ONE separable member template
   (drawMember) instanced deterministically across three depth bands. Two
   orthogonal controls carry the whole performance:

     register   WHAT the noise is, at full heat — the flavour of the uproar
                shout | threat | suspect | ridicule
                (it selects the gesture pool and the head behaviour; suspicion
                turns heads onto NEIGHBOURS instead of onto the focus)

     wave       HOW MUCH of the room has folded. Unlike a left-to-right sweep,
                this front is a RING that opens outward from the focus: the men
                nearest Telemachus drop their arms first and the corners of the
                hall are still braying. `waveSpread` is the softness of the ring,
                `grumble` the residual heat left behind it (never quite zero).

   Per member the two collapse into a local scalar `heat`:
       heat = 1.0  ROARING    head back, arm up, mouth wide, volume chevrons
       heat = 0.5  HOLDING    drawn in, hand at the beard or the hilt, muttering
       heat = 0.0  LOWERED    arms down or palms turned out, head level, quiet

   ENSEMBLE controls, all channels: formation (horseshoe | surge | ranks |
   scatter | settled), density (deep bands thin first), attention, uproar,
   register, wave, waveSpread, grumble, rows/perRow/seatY (foreground and
   background grading).

   Nobody named is baked in. Telemachus is NOT drawn: what is drawn is his
   PLACE — the master's step at centre, an empty stance plate, the spear
   standing at it. Antinous, Eurymachus, Leiodes and the beggar are placed by
   the scene on `head:*` / `focus:*`. The aggregate noise is reported as an
   instrument, a stacked-block CLAMOUR GAUGE on the wall, so the state is
   legible without reading a face. Solid grays + hard contour only; the engine
   dotify POST pass supplies the halftone. */
import { makePen, toneSolid, inkLevel, INK, ACCENT,
         clamp, clamp01, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

/* the separable gesture set of the member template — the uproar and the fold
   are both legible from arms alone, before a single face is read */
export const GESTURES = ["fist","hurl","grip","mutter","jeer","cup","lower","open"];
export const REGISTERS = ["shout","threat","suspect","ridicule"];

const params = {
  formation:"horseshoe",  // horseshoe | surge | ranks | scatter | settled
  register:"shout",       // shout | threat | suspect | ridicule
  uproar:1.0,             // ceiling on local heat — the loudness of the room
  rows:3,                 // depth bands, back -> front
  perRow:[7,6,7],         // members per band (density control)
  density:1.0,            // 0 = front band only .. 1 = the whole hall
  attention:0.85,         // 0 = heads wandering .. 1 = every head on the focus
  wave:0.0,               // QUELL RING radius out of the focus, 0 .. ~1.4
  waveSpread:0.30,        // softness of the ring (sharpness of the fold)
  grumble:0.16,           // heat left behind the ring — nobody is truly calm
  focusX:0.500,           // the master's place: where Telemachus stands
  focusY:0.398,
  seatY:0.905,            // front-band footline as a fraction of H
  showPlace:true,         // the master's step + stance plate + standing spear
  showHall:true,          // broken wall panels, two doors, columns
  showGauge:true,         // the stacked-block clamour gauge
  showRing:true,          // the dashed quell-ring instrument
  seed:2141,
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

/* ---------------- ONE member: a young noble on his feet ----------------
   Everything keyed off s (member height) so the same template serves the 74px
   back band and the 150px front band. roar/hold/calm are the three blend
   weights derived from the member's local heat. A member standing between the
   camera and the focus is drawn `back` — nape and hair, no face. */
function drawMember(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, feat = m.feat, F = m.face;
  const cw = Math.max(2, s*0.020);
  const roar = m.roar, hold = m.hold, calm = m.calm;

  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const dark  = toneSolid(inkLevel(m.shade.hair));
  const cloak = toneSolid(inkLevel(m.shade.cloak));
  const metal = toneSolid(inkLevel(5));

  const seated  = !!m.seated;
  const seatTop = baseY - s*0.26;
  const hipY    = seated ? seatTop - s*0.050 : baseY - s*0.320;
  const shoY    = hipY - (seated ? s*0.34 : s*0.40);
  const tilt    = m.lean * s*0.100 * F;          // + tips toward the focus
  const sx      = cx + tilt;
  const shw     = s*0.180, hemw = s*0.214;
  const headR   = s*0.124*feat.headS;
  const headCy  = shoY - headR*1.04 - roar*headR*0.44;   // head thrown back
  const hx      = sx + m.headTurn*headR*0.26 + tilt*0.42;

  // ---- a stool, only where the band is still sitting: a block, never a bench ----
  if (seated){
    pen.paint(()=>{ g.rect(cx-s*0.150, seatTop, s*0.30, s*0.052); }, toneSolid(inkLevel(3)), cw);
    pen.ink(()=>{ g.moveTo(cx-s*0.112, seatTop+s*0.052); g.lineTo(cx-s*0.132, baseY); }, cw*1.1);
    pen.ink(()=>{ g.moveTo(cx+s*0.112, seatTop+s*0.052); g.lineTo(cx+s*0.132, baseY); }, cw*1.1);
  }

  // ---- ground shadow: plants the body, adds no mass ----
  g.fillStyle = "rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*0.95, s*0.023, 0,0,7); g.fill();

  // ---- legs: a wide brace under a man shouting, closed under a man quiet ----
  if (seated){
    const kx = cx + F*s*0.19;
    pen.limb(()=>{ g.moveTo(cx+F*s*0.02, seatTop-s*0.01); g.lineTo(kx, seatTop+s*0.02); }, tunic, s*0.062);
    pen.limb(()=>{ g.moveTo(kx, seatTop+s*0.02); g.lineTo(kx-F*s*0.04, baseY-s*0.018); }, skin, s*0.050);
    pen.limb(()=>{ g.moveTo(kx-F*s*0.07, seatTop+s*0.02); g.lineTo(kx-F*s*0.11, baseY-s*0.018); }, skin, s*0.046);
    pen.paint(()=>{ g.ellipse(kx-F*s*0.06, baseY, s*0.055, s*0.022, 0,0,7); }, metal, cw*0.7);
  } else {
    const brace = s*(0.055 + roar*0.055 - calm*0.016);
    const fL = cx - brace, fR = cx + brace + F*roar*s*0.030;
    pen.limb(()=>{ g.moveTo(cx-s*0.064, hipY); g.lineTo(fL, baseY-s*0.018); }, skin, s*0.062);
    pen.limb(()=>{ g.moveTo(cx+s*0.064, hipY); g.lineTo(fR, baseY-s*0.018); }, skin, s*0.062);
    pen.paint(()=>{ g.ellipse(fL, baseY, s*0.053, s*0.022, 0,0,7); }, metal, cw*0.7);
    pen.paint(()=>{ g.ellipse(fR, baseY, s*0.053, s*0.022, 0,0,7); }, metal, cw*0.7);
  }

  // ---- FAR arm, behind the torso ----
  {
    const sh = { x: sx - F*shw*0.80, y: shoY + s*0.045 };
    const hand = (m.gesture === "mutter")
      ? { x: cx - F*hemw*0.15, y: hipY - s*0.10 }                    // forearm across the ribs
      : (m.gesture === "hurl")
        ? { x: sx - F*(shw + s*0.14), y: shoY + s*0.02 }             // the balancing arm, thrown out
        : (m.gesture === "jeer" || m.gesture === "cup")
          ? { x: cx - F*hemw*0.90, y: hipY + s*0.01 }
          : { x: sx - F*shw*0.88, y: hipY + s*0.02 - roar*s*0.02 };
    arm(pen, sh, hand, -F, tunic, skin, s, 0.10);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.029, 0, 7); }, skin, cw*0.7);
  }

  // ---- torso: short tunic trapezoid ----
  pen.paint(()=>{
    g.moveTo(sx-shw, shoY);
    g.lineTo(sx+shw, shoY);
    g.lineTo(cx+hemw, hipY);
    g.lineTo(cx-hemw, hipY);
    g.closePath();
  }, tunic, cw);

  // ---- the cloak wedge off the far shoulder: the silhouette of this crowd ----
  if (feat.cloak){
    const swing = (roar*0.55 - calm*0.10) * s*0.10 * F;
    pen.paint(()=>{
      g.moveTo(sx - F*shw*1.02, shoY - s*0.020);
      g.lineTo(sx - F*shw*0.30, shoY - s*0.006);
      g.lineTo(cx - F*hemw*0.42 - swing, hipY + s*0.135);
      g.lineTo(cx - F*hemw*1.28 - swing, hipY + s*0.105);
      g.closePath();
    }, cloak, cw*0.8);
    pen.seam(()=>{ g.moveTo(sx - F*shw*0.86, shoY + s*0.010);
                   g.lineTo(cx - F*hemw*0.80 - swing*0.7, hipY + s*0.078); }, cw*0.6);
  }
  pen.seam(()=>{ g.moveTo(cx-hemw*0.88, hipY-cw*0.8); g.lineTo(cx+hemw*0.88, hipY-cw*0.8); }, cw*0.7);

  // ---- neck + head ----
  // a head turned away is a lighter mass, not a black blob: it holds less ink
  const hairT = m.back ? toneSolid(inkLevel(m.shade.hair - 2.2)) : dark;
  pen.paint(()=>{ g.rect(sx-headR*0.29, shoY-headR*0.58, headR*0.58, headR*0.88); }, skin, cw*0.8);
  if (feat.head !== "bald" && !m.back)
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.16, headR*1.10, headR*1.22, 0,0,7); }, hairT, cw*0.9);

  if (m.back){
    // ---- seen from behind: the hall's own backs, turned up at the master's place ----
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.94, headR*1.02, 0,0,7); }, hairT, cw);
    pen.paint(()=>{ g.rect(hx-headR*0.30, headCy+headR*0.52, headR*0.60, headR*0.34); }, skin, cw*0.8);
    pen.ink(()=>{ g.moveTo(hx-headR*0.44, headCy+headR*0.34);
                  g.lineTo(hx+headR*0.44, headCy+headR*0.34); }, Math.max(2, headR*0.15));
  } else {
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);
    // ---- face ----
    const eyeY = headCy - headR*0.04;
    const gx   = m.headTurn*headR*0.30;
    const eyeR = headR*0.115;
    const exL = hx - headR*0.32 + gx, exR = hx + headR*0.32 + gx;
    g.fillStyle = INK;
    if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(exR, eyeY, eyeR, eyeR*1.12, 0,0,7); g.fill(); }
    if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(exL, eyeY, eyeR, eyeR*1.12, 0,0,7); g.fill(); }
    // brows: driven DOWN and together by the shout, level again by the fold
    g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(2, headR*0.13);
    {
      const drop = roar*headR*0.16 + hold*headR*0.07;
      g.beginPath();
      g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.44);
      g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.38 + drop);
      g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.38 + drop);
      g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.44);
      g.stroke();
    }
    // nose points the way the head faces
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    g.moveTo(hx+gx*0.6, eyeY+headR*0.06);
    g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.38);
    g.stroke();
    // mouth: a squared-off shout, or a set line
    const open = m.mouth;
    if (open > 0.26){
      pen.paint(()=>{ g.rect(hx+gx*0.7 - headR*(0.14+0.06*open), headCy+headR*0.44,
                             headR*(0.28+0.12*open), headR*(0.14+0.30*open)); },
                toneSolid(inkLevel(7)), cw*0.6);
    } else {
      g.strokeStyle = INK; g.lineWidth = Math.max(2, headR*0.12);
      g.beginPath();
      g.moveTo(hx-headR*0.24+gx, headCy+headR*0.56);
      g.lineTo(hx+headR*0.24+gx, headCy+headR*0.56);
      g.stroke();
    }
  }
  if (feat.head === "hair" && !m.back)
    pen.paint(()=>{
      g.moveTo(hx-headR*0.92, headCy-headR*0.02);
      g.quadraticCurveTo(hx, headCy-headR*1.34, hx+headR*0.92, headCy-headR*0.02);
      g.quadraticCurveTo(hx+headR*0.50, headCy-headR*0.54, hx, headCy-headR*0.48);
      g.quadraticCurveTo(hx-headR*0.50, headCy-headR*0.54, hx-headR*0.92, headCy-headR*0.02);
    }, dark, cw*0.8);
  else if (feat.head === "fillet" && !m.back)
    pen.paint(()=>{ g.rect(hx-headR*0.95, headCy-headR*0.54, headR*1.90, headR*0.26); },
              toneSolid(inkLevel(5)), cw*0.7);
  if (feat.beard && !m.back)
    pen.paint(()=>{
      g.moveTo(hx-headR*0.52, headCy+headR*0.36);
      g.quadraticCurveTo(hx, headCy+headR*1.30, hx+headR*0.52, headCy+headR*0.36);
      g.quadraticCurveTo(hx, headCy+headR*0.72, hx-headR*0.52, headCy+headR*0.36);
    }, dark, cw*0.7);

  // ---- NEAR arm: the gesture IS the member's place in the uproar ----
  const sh = { x: sx + F*shw*0.82, y: shoY + s*0.045 };
  let hand, bend = 0.22, kind = "fist";
  switch (m.gesture){
    case "fist":    // the arm straight up out of the shout
      hand = { x: sx + F*shw*0.52, y: headCy - headR*1.62 }; bend = 0.14; break;
    case "hurl":    // cocked back over the shoulder — the threat before the throw
      hand = { x: sx - F*shw*0.22, y: shoY - s*0.24 }; bend = -0.26; break;
    case "grip":    // knuckles closed on the hilt at the hip
      hand = { x: sx + F*hemw*0.92, y: hipY - s*0.010 }; bend = 0.26; kind = "hilt"; break;
    case "mutter":  // hand up beside the mouth, aimed at a neighbour
      hand = { x: hx + F*headR*0.88, y: headCy + headR*0.56 }; bend = 0.30; kind = "palm"; break;
    case "jeer":    // the arm thrown out low, finger extended
      hand = { x: sx + F*(shw + s*0.20), y: shoY + s*0.17 }; bend = 0.18; kind = "point"; break;
    case "cup":     // wine held up in the middle of the noise
      hand = { x: sx + F*(shw + s*0.06), y: shoY - s*0.20 }; bend = 0.20; kind = "cup"; break;
    case "open":    // palms turned out — conceding the bow to him
      hand = { x: sx + F*(shw + s*0.12), y: hipY - s*0.020 }; bend = 0.24; kind = "palm"; break;
    default:        // "lower": arms down at the sides
      hand = { x: sx + F*shw*0.90, y: hipY + s*0.085 }; bend = 0.12;
  }
  arm(pen, sh, hand, F, tunic, skin, s, bend);
  if (kind === "cup"){
    const wx = hand.x, wy = hand.y;
    pen.paint(()=>{ g.moveTo(wx-s*0.043, wy-s*0.052); g.lineTo(wx+s*0.043, wy-s*0.052);
                    g.lineTo(wx+s*0.027, wy+s*0.012); g.lineTo(wx-s*0.027, wy+s*0.012);
                    g.closePath(); }, toneSolid(inkLevel(4)), cw*0.7);
    pen.paint(()=>{ g.rect(wx-s*0.011, wy+s*0.012, s*0.022, s*0.030); }, toneSolid(inkLevel(4)), cw*0.6);
  } else if (kind === "palm"){
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.040, s*0.030, F>0?0.35:-0.35, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ for (let k=-1;k<=1;k++){
      g.moveTo(hand.x + F*s*0.018, hand.y + k*s*0.020);
      g.lineTo(hand.x + F*s*0.056, hand.y + k*s*0.026 - s*0.012);
    } }, cw*0.8);
  } else if (kind === "point"){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.029, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ g.moveTo(hand.x, hand.y); g.lineTo(hand.x + F*s*0.074, hand.y + s*0.012); }, cw*0.9);
  } else if (kind === "hilt"){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.033, 0, 7); }, skin, cw*0.7);
    // a short blade hanging behind the fist — threat, never brandished
    pen.ink(()=>{ g.moveTo(hand.x - F*s*0.012, hand.y + s*0.020);
                  g.lineTo(hand.x - F*s*0.048, hand.y + s*0.120); }, cw*1.2);
    pen.ink(()=>{ g.moveTo(hand.x - F*s*0.046, hand.y - s*0.010);
                  g.lineTo(hand.x + F*s*0.030, hand.y - s*0.024); }, cw*0.9);
  } else {
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.034, 0, 7); }, skin, cw*0.7);
  }

  // ---- VOLUME: nested chevrons off the mouth, opening toward what he shouts at ----
  if (m.vol > 0){
    const dir = m.shoutDir;
    g.strokeStyle = INK; g.lineCap = "round"; g.lineJoin = "round";
    g.globalAlpha = 0.92; g.lineWidth = Math.max(3, s*0.030);
    for (let k=0;k<m.vol;k++){
      const r = headR*(1.42 + k*0.62), ax = hx + dir*r, ay = headCy + headR*0.40;
      g.beginPath();
      g.moveTo(ax - dir*headR*0.34, ay - headR*0.54);
      g.lineTo(ax,                  ay);
      g.lineTo(ax - dir*headR*0.34, ay + headR*0.54);
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  return { hx, headCy, headR };
}

/* ---------------- the MASTER'S PLACE — drawn, not occupied ----------------
   Telemachus is cast separately; this is the geometry he stands on. Two short
   steps of unequal width (never a slab across the frame), a hard stance plate
   with the empty footprint on it, and the spear standing in its socket. */
function drawPlace(pen, x, y, s){
  const g = pen.ctx;
  // lower step, then upper step, inset and of unequal width so no span runs flat
  pen.paint(()=>{ g.rect(x-s*0.92, y-s*0.16, s*1.84, s*0.18); }, toneSolid(inkLevel(2)), 3.5);
  pen.paint(()=>{ g.rect(x-s*0.62, y-s*0.33, s*1.24, s*0.17); }, toneSolid(inkLevel(1)), 3.5);
  pen.seam(()=>{ g.moveTo(x-s*0.86, y-s*0.16); g.lineTo(x-s*0.58, y-s*0.33); }, 2.5);
  pen.seam(()=>{ g.moveTo(x+s*0.86, y-s*0.16); g.lineTo(x+s*0.58, y-s*0.33); }, 2.5);
  // stance plate — the empty place itself, hard-edged, with the footprint on it
  pen.paint(()=>{ g.rect(x-s*0.44, y-s*0.47, s*0.88, s*0.14); }, toneSolid(inkLevel(3)), 4);
  g.strokeStyle = INK; g.lineWidth = 3;
  for (const k of [-1, 1]){
    g.beginPath(); g.ellipse(x + k*s*0.17, y-s*0.405, s*0.090, s*0.036, 0,0,7); g.stroke();
  }
  // the master's seat behind it: a hard back slab, the one dark note at centre
  pen.paint(()=>{ g.rect(x-s*0.42, y-s*1.30, s*0.84, s*0.30); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.rect(x-s*0.36, y-s*1.00, s*0.72, s*0.13); }, toneSolid(inkLevel(2)), 3.5);
  pen.ink(()=>{ g.moveTo(x-s*0.30, y-s*0.87); g.lineTo(x-s*0.33, y-s*0.49); }, 3.5);
  pen.ink(()=>{ g.moveTo(x+s*0.30, y-s*0.87); g.lineTo(x+s*0.33, y-s*0.49); }, 3.5);
  pen.seam(()=>{ g.moveTo(x-s*0.30, y-s*1.16); g.lineTo(x+s*0.30, y-s*1.16); }, 2.5);
  // the spear standing at the place — the one vertical the room argues under
  pen.limb(()=>{ g.moveTo(x+s*0.80, y-s*0.30); g.lineTo(x+s*0.70, y-s*2.05); },
           toneSolid(inkLevel(3)), Math.max(3, s*0.070));
  pen.paint(()=>{ g.moveTo(x+s*0.70, y-s*2.52); g.lineTo(x+s*0.86, y-s*2.06);
                  g.lineTo(x+s*0.70, y-s*1.92); g.lineTo(x+s*0.54, y-s*2.06);
                  g.closePath(); }, toneSolid(inkLevel(5)), 3.5);
  // two short brackets marking the place off from the floor — a diagram, not a wall
  pen.ink(()=>{
    g.moveTo(x-s*1.16, y-s*0.02); g.lineTo(x-s*0.96, y-s*0.02); g.lineTo(x-s*0.96, y-s*0.30);
    g.moveTo(x+s*1.16, y-s*0.02); g.lineTo(x+s*0.96, y-s*0.02); g.lineTo(x+s*0.96, y-s*0.30);
  }, 3);
}

/* ---------------- the CLAMOUR GAUGE: the noise as an instrument ----------------
   Eight stacked blocks, filled from the bottom by the room's aggregate heat.
   Geometry, never type — it survives the dot lattice at any size. */
function drawGauge(pen, x, y, w, h, value, bandVals){
  const g = pen.ctx;
  const n = 8, cell = h/n, filled = Math.round(clamp01(value)*n);
  for (let k=0;k<n;k++){
    const by = y + h - (k+1)*cell;
    const on = k < filled;
    pen.paint(()=>{ g.rect(x, by+cell*0.14, w, cell*0.72); },
              toneSolid(inkLevel(on ? (k>5 ? 6 : 5) : 1)), 2.5);
  }
  // the frame bracket, open on the right so it never reads as a closed box
  pen.ink(()=>{
    g.moveTo(x-w*0.34, y-cell*0.30); g.lineTo(x-w*0.34, y+h+cell*0.30);
    g.moveTo(x-w*0.34, y-cell*0.30); g.lineTo(x+w*0.22, y-cell*0.30);
    g.moveTo(x-w*0.34, y+h+cell*0.30); g.lineTo(x+w*0.22, y+h+cell*0.30);
  }, 3);
  // three per-band pips to the right: back / mid / front loudness
  for (let b=0;b<bandVals.length;b++){
    const py = y + h*0.14 + b*h*0.31;
    const on = bandVals[b] > 0.45;
    pen.paint(()=>{ g.rect(x+w*1.45, py, w*0.72, w*0.72); },
              toneSolid(inkLevel(on ? 6 : 1)), 3);
  }
}

/* ---------------- the hall behind them: broken spans only ---------------- */
function drawHall(pen, W, H, horizon){
  const g = pen.ctx;
  // wall panels: separate, unequal height, tone only — never a bar across the top
  const panels = [[0.140,0.245,0.048],[0.300,0.470,0.066],[0.540,0.660,0.040],[0.700,0.845,0.058]];
  for (const [a0,b0,ht] of panels)
    pen.fillPath(()=>{ g.rect(W*a0, horizon-H*ht, W*(b0-a0), H*ht); }, inkLevel(2));
  // the wall/floor join in SEGMENTS with real gaps
  for (const [a0,b0] of [[0.00,0.125],[0.190,0.395],[0.440,0.610],[0.665,0.855],[0.905,1.00]])
    pen.ink(()=>{ g.moveTo(W*a0, horizon); g.lineTo(W*b0, horizon); }, 2.5);
  // hung trophies, left of the master's place
  for (let i=0;i<2;i++){
    const hx = W*(0.318 + i*0.098), hy = horizon - H*0.124;
    pen.paint(()=>{ g.ellipse(hx, hy, W*0.026, H*0.023, 0,0,7); }, toneSolid(inkLevel(3)), 4);
    pen.ink(()=>{ g.moveTo(hx-W*0.026, hy); g.lineTo(hx+W*0.026, hy); }, 2);
  }
  // two columns, standing on the back wall, stopping at the horizon
  for (const px of [0.262, 0.688]){
    const bx = W*px, bw = W*0.034;
    pen.paint(()=>{ g.rect(bx-bw/2, H*0.128, bw, horizon-H*0.128); }, toneSolid(inkLevel(2)), 4);
    pen.paint(()=>{ g.rect(bx-bw*0.80, H*0.128, bw*1.60, H*0.022); }, toneSolid(inkLevel(3)), 4);
    pen.seam(()=>{ g.moveTo(bx-bw*0.18, H*0.160); g.lineTo(bx-bw*0.18, horizon-H*0.012); }, 2);
  }
  // TWO doors — the great door left, the postern right. Book XXI turns on both.
  for (const [dx0, dw0, tall] of [[0.018, 0.078, 0.148], [0.888, 0.070, 0.132]]){
    const dx = W*dx0, dw = W*dw0, dtop = horizon - H*tall;
    pen.paint(()=>{ g.rect(dx, dtop, dw, H*tall); }, toneSolid(inkLevel(3)), 3);
    pen.seam(()=>{ g.moveTo(dx+dw*0.52, dtop+H*0.014); g.lineTo(dx+dw*0.52, horizon-H*0.008); }, 2);
    pen.paint(()=>{ g.rect(dx-W*0.008, dtop-H*0.016, dw+W*0.016, H*0.012); }, toneSolid(inkLevel(2)), 3);
  }
}

/* ---------------- deterministic member build ---------------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = p.formation || "horseshoe";
  const register  = REGISTERS.includes(p.register) ? p.register : "shout";
  const uproar    = clamp01(p.uproar ?? 1);
  const attention = clamp01(p.attention);
  const wave      = p.wave ?? params.wave;
  const sigma     = Math.max(0.06, p.waveSpread ?? params.waveSpread);
  const grumble   = clamp01(p.grumble ?? params.grumble);
  const density   = clamp01(p.density);
  const rows      = Math.max(1, p.rows|0);
  const perRow    = p.perRow || params.perRow;
  const seatY     = p.seatY ?? params.seatY;
  const fxN       = p.focusX ?? params.focusX;
  const fyN       = p.focusY ?? params.focusY;
  const focusX    = fxN*W;
  const seed      = (p.seed ?? params.seed) >>> 0;

  const members = [];
  const bandHeat = [0,0,0], bandN = [0,0,0];

  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 1;                   // 0 = back .. 1 = front
    if (density < 1 && depth < (1-density)*0.9) continue;    // thin the deep bands first
    let n = perRow[Math.min(r, perRow.length-1)] || Math.max(2, 8-2*r);
    n = Math.max(2, Math.round(n * (0.55 + 0.45*density)));

    const scale = lerp(74, 150, depth);
    const rowY  = H*(0.545 + depth*(seatY-0.545));
    // the bands widen as they come forward: the horseshoe opens to the camera
    const xa = lerp(0.185, 0.100, depth), xb = lerp(0.815, 0.900, depth);
    const stagger = (r % 2) * 0.40;

    for (let i=0;i<n;i++){
      const rng = rnd((seed + r*211 + i*37 + 7) >>> 0);
      const t   = n>1 ? (i + stagger) / (n - 1 + stagger) : 0.5;
      const u   = 2*t - 1;                                   // -1 .. 1 across the band
      let px = lerp(xa, xb, t), by = rowY, seated = false;

      if (formation === "horseshoe"){
        // each band bows upstage in the middle; the front band opens a gap
        by = rowY - (1 - Math.pow(Math.abs(u), 1.4)) * scale * lerp(0.10, 0.52, depth);
        if (depth > 0.66 && Math.abs(u) < 0.22) continue;
      } else if (formation === "surge"){
        // the room presses in — but only enough to close the ranks, never
        // enough to pile the bands into one mass at the centre
        px = lerp(px, fxN, 0.05 + 0.13*depth);
        by = rowY - (1 - Math.abs(u)) * scale * 0.24;
      } else if (formation === "ranks"){
        by = rowY;
        seated = depth < 0.75 && (i % 2 === 0);
      } else if (formation === "scatter"){
        px = clamp01(px + (rng()-0.5)*0.085);
        by = rowY + (rng()-0.5)*scale*0.22;
        seated = rng() < 0.18;
      } else if (formation === "settled"){
        // pulled back off the place, a wide slack arc
        px = clamp01(px + Math.sign(u)*Math.pow(Math.abs(u), 0.6)*0.045);
        by = rowY - (1 - Math.pow(Math.abs(u), 1.7)) * scale * 0.34;
        if (depth > 0.66 && Math.abs(u) < 0.28) continue;
      }
      px = clamp(px, 0.045, 0.955);
      const cx = W*px;

      // ---- the QUELL RING: heat as a radial function of the distance to the place ----
      const d = Math.hypot(px - fxN, ((by/H) - fyN)*0.78) / 0.72;
      const quell = smooth(clamp01((wave - d)/sigma * 0.5 + 0.5));
      const heat  = clamp01(uproar * (1 - quell*(1 - grumble)));

      const roar = smooth(clamp01((heat - 0.52)/0.44));
      const calm = 1 - smooth(clamp01(heat/0.44));
      const hold = clamp01(1 - roar - calm);

      // ---- ATTENTION: heads onto the place, except where suspicion turns them aside ----
      const att = clamp01(attention * (0.34 + 0.66*(1 - roar*0.30)));
      let headTurn = clamp((focusX - cx)/(W*0.32) * att, -1, 1);
      const aside = (register === "suspect" && heat > 0.34);
      if (aside)          headTurn = (rng() < 0.5 ? -1 : 1) * (0.55 + rng()*0.42);
      else if (att < 0.30) headTurn = (rng()-0.5)*1.6;
      const face = Math.abs(headTurn) < 0.06 ? (rng()<0.5?-1:1) : (headTurn>0 ? 1 : -1);

      // ---- GESTURE: register chooses the pool, heat chooses the register's floor ----
      let gesture;
      if (heat > 0.62){
        if (register === "threat")        gesture = rng()<0.46 ? "hurl" : (rng()<0.58 ? "grip" : "fist");
        else if (register === "suspect")  gesture = rng()<0.58 ? "mutter" : "grip";
        else if (register === "ridicule") gesture = rng()<0.52 ? "jeer" : "cup";
        else                              gesture = rng()<0.62 ? "fist" : "jeer";
      } else if (heat > 0.30){
        gesture = rng()<0.52 ? "mutter" : "grip";
      } else {
        gesture = rng()<0.55 ? "lower" : "open";
      }
      if (seated && (gesture === "hurl" || gesture === "jeer")) gesture = "grip";

      const feat = {
        beard: rng() < 0.24,
        head:  (()=>{ const v = rng(); return v < 0.12 ? "fillet" : v < 0.95 ? "hair" : "bald"; })(),
        headS: 0.90 + rng()*0.20,
        cloak: rng() < 0.52,
      };
      const shade = {
        // light planes, dark accents: tunics stay in the paper half of the scale
        tunic: clamp(Math.round(lerp(1.5, 2.3, depth)) + (rng()<0.28 ? 1 : 0), 1, 4),
        skin:  2,
        hair:  Math.round(lerp(5, 6, depth)),
        cloak: clamp(Math.round(lerp(2, 3.4, depth)), 2, 4),
      };

      const back = depth > 0.45 && Math.abs(px - fxN) < 0.150;
      members.push({
        cx, baseY:by, s:scale, depth, px, band:r, seated, feat, shade, back,
        headTurn, face, gesture, heat, roar, hold, calm,
        lean: roar*0.72 - calm*0.30,
        mouth: clamp01(roar*1.0 + hold*0.30),
        vol: roar > 0.80 ? 3 : roar > 0.45 ? 2 : hold > 0.42 ? 1 : 0,
        shoutDir: aside ? (headTurn > 0 ? 1 : -1) : (focusX > cx ? 1 : -1),
      });
      const bi = Math.min(r, 2); bandHeat[bi] += heat; bandN[bi] += 1;
    }
  }
  members.sort((a,b)=> a.baseY - b.baseY);   // painter's order: back -> front
  const total = members.length || 1;
  const level = members.reduce((s,m)=>s+m.heat, 0)/total;
  const bands = bandHeat.map((h,i)=> bandN[i] ? h/bandN[i] : 0);
  return { members, level, bands, wave, sigma, formation, register, fxN, fyN, focusX,
           showPlace:p.showPlace, showHall:p.showHall,
           showGauge:p.showGauge, showRing:p.showRing };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const layers = (st && st.layers) ||
    ["hall","gauge","floor","place","band-back","band-mid","band-front","quell-ring"];
  const has = l => layers.includes(l);
  const horizon = H*0.300;

  // lightest possible field — the paper does most of the work
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);

  if (has("hall") && B.showHall !== false) drawHall(pen, W, H, horizon);

  if (has("gauge") && B.showGauge !== false)
    drawGauge(pen, W*0.775, H*0.086, W*0.042, H*0.190, B.level, B.bands);

  // floor: lines converging on the master's place, plus BROKEN depth rules
  if (has("floor")){
    const fX = W*B.fxN, fY = H*B.fyN;
    g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.30;
    for (let i=0;i<=9;i++){
      g.beginPath(); g.moveTo(fX, fY);
      g.lineTo(lerp(-W*0.10, W*1.10, i/9), H*1.02);
      g.stroke();
    }
    // depth rules: SHORT, offset left/right so no span ever crosses the frame
    g.globalAlpha = 0.22;
    for (let j=2;j<=3;j++){
      const y = fY + (H-fY)*(j/4)*(j/4);
      g.beginPath(); g.moveTo(W*0.055, y); g.lineTo(W*0.315, y); g.stroke();
      g.beginPath(); g.moveTo(W*0.640, y - H*0.022); g.lineTo(W*0.905, y - H*0.022); g.stroke();
    }
    g.globalAlpha = 1;
  }

  if (has("place") && B.showPlace !== false)
    drawPlace(pen, W*B.fxN, H*B.fyN, W*0.082);

  // the crowd, back band -> front band
  const bandLayer = ["band-back","band-mid","band-front"];
  for (const m of B.members){
    if (!has(bandLayer[Math.min(m.band, 2)])) continue;
    drawMember(pen, m);
  }

  // the quell ring itself, read as an instrument: a dashed arc through the
  // floor on the camera side of the place, with a small outward arrow
  if (has("quell-ring") && B.showRing !== false && B.wave > 0.04 && B.wave < 1.10){
    const fX = W*B.fxN, fY = H*B.fyN;
    const rx = B.wave*W*0.72, ry = B.wave*H*0.54;
    g.save();
    g.strokeStyle = ACCENT; g.globalAlpha = 0.78;
    g.lineWidth = Math.max(3, W*0.009);
    g.setLineDash([W*0.020, W*0.026]);
    g.beginPath(); g.ellipse(fX, fY, rx, ry, 0, Math.PI*0.06, Math.PI*0.94); g.stroke();
    g.setLineDash([]);
    g.lineWidth = Math.max(3, W*0.007);
    const ay = fY + ry;
    g.beginPath();
    g.moveTo(fX, ay - H*0.030); g.lineTo(fX, ay + H*0.026);
    g.moveTo(fX, ay + H*0.026); g.lineTo(fX - W*0.018, ay + H*0.006);
    g.moveTo(fX, ay + H*0.026); g.lineTo(fX + W*0.018, ay + H*0.006);
    g.stroke();
    g.restore();
  }
}

export const asset = {
  id:"ensemble.suitor-uproar",
  type:"ENSEMBLE",
  name:"Suitor uproar",
  statusWord:"UPROAR",
  scene:"OD-B21-S05",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["hall","gauge","floor","place","band-back","band-mid","band-front","quell-ring"],
  // normalized 0..1 anchors — the scene places its named speakers on these
  anchors:{
    "focus:place":{x:.500,y:.398},     "focus:seat":{x:.500,y:.318},
    "focus:spear":{x:.567,y:.246},
    "head:loudest":{x:.110,y:.900},    "head:threat":{x:.890,y:.885},
    "head:muttering":{x:.290,y:.735},  "head:yielding":{x:.650,y:.720},
    "gap:sightline":{x:.500,y:.940},   "gauge:clamour":{x:.790,y:.180},
    "row:back":{x:.500,y:.545},        "row:mid":{x:.500,y:.725},
    "row:front":{x:.500,y:.905},
    "door:great":{x:.055,y:.235},      "door:postern":{x:.922,y:.245},
    "column:left":{x:.262,y:.200},     "column:right":{x:.688,y:.200},
    "camera:wide":{x:.500,y:.560},     "camera:fold":{x:.500,y:.700},
  },
  zones:{
    crowd:{ x0:.04,y0:.46,x1:.96,y1:.96 },
    "ring:inner":{ x0:.30,y0:.44,x1:.70,y1:.78 },
    "ring:outer":{ x0:.04,y0:.60,x1:.96,y1:.96 },
    place:{ x0:.40,y0:.24,x1:.62,y1:.50 },
    sightline:{ x0:.42,y0:.78,x1:.58,y1:.98 },
  },

  states:{
    initial:"shouting",
    nodes:{
      // the whole room off its benches at once — the ask has landed
      shouting:{   preview:{ formation:"horseshoe", register:"shout", uproar:1.0,
                             wave:0.0, waveSpread:0.30, grumble:0.16,
                             attention:0.86, density:1.0, status:"SHOUTING" } },
      // arms cocked, hands on hilts, the room pressing in on the place
      // a surge closes the ranks, so the bands are thinned to stay readable
      threatening:{preview:{ formation:"surge", register:"threat", uproar:1.0,
                             wave:0.0, waveSpread:0.28, grumble:0.16,
                             perRow:[6,5,5], attention:0.92, density:1.0,
                             status:"THREATENING" } },
      // heads turned onto NEIGHBOURS, not onto him: who put him up to this
      suspicious:{ preview:{ formation:"scatter", register:"suspect", uproar:0.78,
                             wave:0.10, waveSpread:0.34, grumble:0.30,
                             attention:0.45, density:1.0, status:"SUSPICIOUS" } },
      // the jeer: cups up, fingers out, the beggar laughed at instead of feared
      ridiculing:{ preview:{ formation:"horseshoe", register:"ridicule", uproar:0.95,
                             wave:0.0, waveSpread:0.30, grumble:0.16,
                             attention:0.80, density:1.0, status:"RIDICULING" } },
      // THE FOLD, mid-sweep: the inner ring has already dropped its arms,
      // the corners of the hall are still braying
      submitting:{ preview:{ formation:"horseshoe", register:"shout", uproar:1.0,
                             wave:0.62, waveSpread:0.26, grumble:0.14,
                             attention:0.94, density:1.0, status:"SUBMITTING" } },
      // the whole room yielded — palms out, but the grumble never reaches zero
      yielded:{    preview:{ formation:"settled", register:"shout", uproar:1.0,
                             wave:1.05, waveSpread:0.30, grumble:0.13,
                             attention:0.90, density:1.0, status:"YIELDED" } },
      // back at the tables before the ask — attention scattered, low noise
      seated:{     preview:{ formation:"ranks", register:"ridicule", uproar:0.44,
                             wave:0.0, waveSpread:0.30, grumble:0.16,
                             attention:0.22, density:1.0, status:"SEATED" } },
      // a thin room for wide or early framings
      sparse:{     preview:{ formation:"horseshoe", register:"shout", uproar:1.0,
                             wave:0.62, waveSpread:0.26, grumble:0.14,
                             attention:0.90, density:0.5, status:"THIN" } },
    },
    edges:[
      ["seated","shouting"],["shouting","threatening"],["threatening","suspicious"],
      ["suspicious","ridiculing"],["ridiculing","submitting"],["shouting","submitting"],
      ["threatening","submitting"],["submitting","yielded"],["yielded","seated"],
      ["yielded","shouting"],["shouting","sparse"],["sparse","submitting"],
    ],
  },
  channels:["formation","register","uproar","wave","waveSpread","grumble",
            "attention","density","rows","depth"],

  // neutral preview = the asset's reason to exist: the fold caught mid-sweep,
  // the ring nearest the master's place already lowered, the corners still loud
  preview:()=>({ formation:"horseshoe", register:"shout", uproar:1.0,
                 wave:0.62, waveSpread:0.26, grumble:0.14,
                 attention:0.94, density:1.0,
                 status:"SUBMITTING", progress:0.62 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
