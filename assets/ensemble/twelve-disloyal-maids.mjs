/* ensemble.twelve-disloyal-maids — Book XXII. The twelve women of the house who
   went with the suitors, and what is done with them after the killing.

   This is NOT the night file of Book XX (ensemble.disloyal-maids, a diagonal
   route past a sleeping man). This is the other end of the same twelve: the
   yard between the round-house and the courtyard wall, a ship's cable strung
   across it, and four duties performed in order —

     BODY REMOVAL   they carry the dead men out through the hall gate
     FORCED CLEANING they scrub the paving on their knees with sponges
     LINE CONFINEMENT they are set in a row along the wall, wrists corded
     EXECUTION      they are lifted off the ground in a line

   The asset is IDENTIFIED, not anonymous: twelve numbered stations run the
   width of the plate and each member owns one for the whole sequence. The
   numbers are drawn as SEVEN-SEGMENT GEOMETRY, never as type — the dot lattice
   eats small letterforms, but it prints a bar. A scene can name a woman by
   station ("station:6" is Melantho, cast separately) and the register keeps
   the count honest as density thins the line.

   Exposed ENSEMBLE controls:
     FORMATION  carry | scrub | herd | line | hanged
     COUNT      how many stations the register carries (12)
     DENSITY    thins from the HIGH-numbered end; the register dims the gone
     ATTENTION  how hard every head turns onto the man giving the order
     WAVE +     the reaction wave travelling down the line — dread, heads up,
     WAVESPREAD shoulders in; where it has passed the file is cowering
     DREAD      baseline head-drop / shoulder-in for the whole group
     LIFT       0 = feet on the paving .. 1 = clear of it (drives the execution)
     BODIES     how many dead men are laid along the wall
     SPREAD     lateral width about the spine, DIR facing
     depth      rank-back / rank-front layers + per-depth tone grading

   One separable member template (a serving-woman: gown, girdle, bound hair,
   bare feet) instanced N times deterministically. No named woman is baked in.
   Solid grays + hard contour only; the engine's dotify POST pass supplies the
   halftone. Atlas OD-B22-S07. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);

/* the separable duty set of the member template — one posture + one prop each */
export const DUTIES = ["carry", "kneel", "bound", "driven", "cower", "hang"];

const params = {
  formation:"line",      // carry | scrub | herd | line | hanged
  count:12,
  density:1.0,
  attention:0.55,
  wave:1.6,              // >1 parks the reaction wave off the spine
  waveSpread:0.17,
  dread:0.50,
  lift:0,                // 0 = standing .. 1 = off the ground
  spread:1.0,
  dir:1,
  bodies:0,              // dead men laid along the wall base
  focus:{ x:0.700, y:0.560 },   // the gate — where the order comes from
  showYard:true,
  showCable:true,
  showRegister:true,
  seed:2207,
};

/* ---------------- THE GROUND PLAN ----------------
   GROUND is the wall base / floor line. Two spines only, both authored here so
   the ensemble cannot drift: STATION LINE (the row of twelve, used by line /
   hanged / herd) and HAUL (the carrying route out of the gate, used by carry).
   scrub uses a floor lattice keyed to the same depth ramp. */
const GROUND  = 0.560;
const LINE    = { x0:0.092, x1:0.928, y0:0.806, y1:0.822, s0:176, s1:190 };
const HAUL    = { x0:0.700, y0:0.628, x1:0.176, y1:0.858, s0:126, s1:268 };
const CABLE   = { xL:0.238, yL:0.335, xR:0.958, yR:0.352, sag:0.024 };
const GATE    = { x0:0.652, x1:0.752, top:0.404 };
const NOOSE_IDLE = 0.482;
const REG_Y   = 0.905;

function stationAt(u){
  u = clamp01(u);
  return { x: lerp(LINE.x0, LINE.x1, u), y: lerp(LINE.y0, LINE.y1, u), s: lerp(LINE.s0, LINE.s1, u) };
}
function haulAt(v){
  v = clamp01(v);
  const e = 0.42*v + 0.58*v*v;
  return { x: lerp(HAUL.x0, HAUL.x1, v), y: lerp(HAUL.y0, HAUL.y1, e), s: lerp(HAUL.s0, HAUL.s1, e) };
}
function cableY(x){
  const f = clamp01((x - CABLE.xL)/((CABLE.xR - CABLE.xL) || 1));
  return lerp(CABLE.yL, CABLE.yR, f) + Math.sin(f*Math.PI)*CABLE.sag;
}

/* ---------------- KINEMATICS ----------------
   one table, six duties. hip/sho are heights above the foot line in units of
   member height s; pitch is the forward lean of the shoulders; hemw the hem
   half-width; hemDrop where the hem sits above the foot line (negative = the
   gown pools on the paving, which is what kneeling does). */
const KIN = {
  bound: { hip:0.400, sho:0.680, pitch: 0.010, hemw:0.163, hemDrop: 0.010 },
  driven:{ hip:0.400, sho:0.664, pitch:-0.052, hemw:0.170, hemDrop: 0.010 },
  cower: { hip:0.386, sho:0.632, pitch: 0.074, hemw:0.168, hemDrop: 0.010 },
  carry: { hip:0.392, sho:0.628, pitch: 0.112, hemw:0.150, hemDrop: 0.014 },
  kneel: { hip:0.152, sho:0.432, pitch: 0.140, hemw:0.288, hemDrop:-0.032 },
  hang:  { hip:0.400, sho:0.690, pitch: 0.000, hemw:0.112, hemDrop: 0.058 },
};

/* ---------------- SEVEN-SEGMENT NUMERALS ----------------
   The register is the identity channel and it has to survive the dot lattice,
   so every numeral is drawn as bars, not as text. */
const SEG = {
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1],
};
/* Segments are FILLED RECTANGLES, not strokes: a stroked hairline lands
   between dot centres and vanishes, a fat block always prints. */
function segDigit(g, x, y, h, d, lw){
  const w = h*0.58, m = lw*0.60, S = SEG[d] || SEG[8];
  const H_ = (x0, y0, len)=>{ g.fillRect(x0, y0 - lw/2, len, lw); };
  const V_ = (x0, y0, len)=>{ g.fillRect(x0 - lw/2, y0, lw, len); };
  const half = h/2;
  if (S[0]) H_(x + m,       y,          w - 2*m);
  if (S[1]) V_(x + w,       y + m,      half - 2*m);
  if (S[2]) V_(x + w,       y + half + m, half - 2*m);
  if (S[3]) H_(x + m,       y + h,      w - 2*m);
  if (S[4]) V_(x,           y + half + m, half - 2*m);
  if (S[5]) V_(x,           y + m,      half - 2*m);
  if (S[6]) H_(x + m,       y + half,   w - 2*m);
}

/* ============================================================
   THE YARD — the shell the four duties are performed in. Kept LIGHT: paper
   paving, a masonry wall whose top is a BROKEN skyline (never one terrace
   across the plate), joints as verticals rather than courses so nothing
   stripes the row of figures, and the dark held to the round-house doorway
   and the coping — the only two places it belongs.
   ============================================================ */
function drawYard(pen, W, H){
  const g = pen.ctx, gy = H*GROUND;

  // paper everywhere; the yard is a light place with dark things in it
  g.fillStyle = inkLevel(0); g.fillRect(0, 0, W, H);

  // a faint receding lattice on the paving — flagstones, not a tone wash
  g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.10;
  for (let i = -5; i <= 5; i++){ g.beginPath(); g.moveTo(W*0.50, gy); g.lineTo(W*(0.5 + i*0.235), H); g.stroke(); }
  for (let j = 1; j <= 4; j++){ const y = gy + (H - gy)*Math.pow(j/4, 1.55); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.restore();
  pen.ink(()=>{ g.moveTo(0, gy); g.lineTo(W, gy); }, 4);
}

function drawWall(pen, W, H){
  const g = pen.ctx, gy = H*GROUND;

  /* --- the courtyard wall. ONE stepped silhouette, not a row of blocks: block
     outlines would drop a full-height vertical at every joint and picket-fence
     the plate. The face is PAPER — the wall is a contour and a broken coping,
     nothing more, because twelve women have to read against it. --- */
  const RUNS = [[0.256,0.400,0.278],[0.400,0.528,0.252],[0.528,0.640,0.298],
                [0.640,0.766,0.284],[0.766,0.882,0.262],[0.882,1.004,0.240]];
  pen.paint(()=>{
    g.moveTo(W*RUNS[0][0], gy);
    for (const [x0, x1, top] of RUNS){ g.lineTo(W*x0, H*top); g.lineTo(W*x1, H*top); }
    g.lineTo(W*1.004, gy);
    g.closePath();
  }, toneSolid(inkLevel(0)), 4);
  for (const [x0, x1, top] of RUNS)          // the coping, one bar per run
    pen.paint(()=>{ g.rect(W*x0, H*top, W*(x1 - x0), H*0.015); }, toneSolid(inkLevel(3)), 3);
  // a few short joints hung under the coping — masonry, never a course line
  g.save(); g.strokeStyle = INK; g.lineWidth = 2.4; g.globalAlpha = 0.22;
  for (const [x0, x1, top] of RUNS){
    for (let k = 1; k < 3; k++){
      const jx = W*lerp(x0, x1, k/3), y0 = H*top + H*0.024;
      g.beginPath(); g.moveTo(jx, y0); g.lineTo(jx, y0 + H*(0.026 + (k % 2)*0.020)); g.stroke();
    }
  }
  g.restore();

  /* --- THE GATE: the way out of the hall. Torchlight is behind it, so the
     opening is LIGHT inside hard jambs — and the leaf stands open. --- */
  {
    const dx = W*GATE.x0, dw = W*(GATE.x1 - GATE.x0), dtop = H*GATE.top;
    pen.paint(()=>{ g.rect(dx, dtop, dw, gy - dtop); }, toneSolid(inkLevel(1)), 4);
    pen.paint(()=>{ g.rect(dx + dw*0.68, dtop + H*0.010, dw*0.28, gy - dtop - H*0.010); }, toneSolid(inkLevel(4)), 3);
    pen.paint(()=>{ g.rect(dx - W*0.016, dtop - H*0.012, W*0.016, gy - dtop + H*0.012); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(dx + dw,      dtop - H*0.012, W*0.016, gy - dtop + H*0.012); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(dx - W*0.024, dtop - H*0.026, dw + W*0.064, H*0.016); }, toneSolid(inkLevel(5)), 3);
  }

  /* --- THE ROUND-HOUSE (tholos), back left: a drum with a conical roof. The
     cable's near anchor. Light drum, wedge-seamed roof, one narrow dark
     doorway — the only near-black shape above the ground line. --- */
  {
    const cx = W*0.140, base = H*0.322, apex = H*0.176, rw = W*0.126, dw = W*0.100;
    pen.paint(()=>{                                   // conical roof
      g.moveTo(cx, apex); g.lineTo(cx + rw, base); g.lineTo(cx - rw, base); g.closePath();
    }, toneSolid(inkLevel(1)), 4);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.4; g.globalAlpha = 0.34;
    for (const f of [-0.62,-0.24,0.16,0.56]){         // thatch wedges
      g.beginPath(); g.moveTo(cx, apex + H*0.008); g.lineTo(cx + rw*f, base); g.stroke();
    }
    g.restore();
    pen.paint(()=>{ g.rect(cx - rw*1.02, base, rw*2.04, H*0.018); }, toneSolid(inkLevel(4)), 3); // eaves
    pen.paint(()=>{ g.rect(cx - dw, base + H*0.018, dw*2, gy - base - H*0.018); }, toneSolid(inkLevel(0)), 4);
    pen.seam(()=>{ g.moveTo(cx - dw*0.44, base + H*0.032); g.lineTo(cx - dw*0.44, base + H*0.106); }, 2);
    pen.seam(()=>{ g.moveTo(cx + dw*0.46, base + H*0.028); g.lineTo(cx + dw*0.46, base + H*0.094); }, 2);
    pen.paint(()=>{ g.rect(cx - dw*0.24, gy - H*0.116, dw*0.48, H*0.116); }, toneSolid(inkLevel(5)), 3); // doorway
    // the cable peg driven into the drum
    pen.paint(()=>{ g.rect(W*(CABLE.xL-0.026), H*(CABLE.yL-0.010), W*0.030, H*0.021); }, toneSolid(inkLevel(5)), 3);
  }

  // the far post the cable is made fast to — a vertical, clear of the wall face
  pen.paint(()=>{ g.rect(W*0.946, H*(CABLE.yR-0.022), W*0.026, gy - H*(CABLE.yR-0.022)); },
            toneSolid(inkLevel(4)), 4);
}

/* ============================================================
   ONE MEMBER — a serving-woman of the house, six duties.
   Every dimension keys off s (member height), so the same template serves the
   126px far end of the haul and the 268px near end.
   ============================================================ */
function arm(pen, sh, hand, F, sleeve, skin, s, bend){
  const g = pen.ctx;
  const dx = hand.x - sh.x, dy = hand.y - sh.y;
  const L = Math.hypot(dx, dy) || 1;
  const el = { x:(sh.x+hand.x)/2 + (-dy/L)*L*bend*F,
               y:(sh.y+hand.y)/2 + ( dx/L)*L*bend*F };
  pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); }, sleeve, s*0.038);
  pen.limb(()=>{ g.moveTo(el.x, el.y); g.lineTo(hand.x, hand.y); }, skin, s*0.030);
  return el;
}

function drawMaid(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, F = m.F, feat = m.feat, P = m.posture;
  const K = KIN[P] || KIN.bound;
  const cw = Math.max(2.4, s*0.017);
  const gown  = toneSolid(inkLevel(m.shade.gown));
  const gown2 = toneSolid(inkLevel(m.shade.gown + 1));
  const bandT = toneSolid(inkLevel(m.shade.band));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const hair  = toneSolid(inkLevel(m.shade.hair));

  const footY = m.baseY;
  const hipY  = footY - s*K.hip;
  const shoY  = footY - s*K.sho;
  const sx    = cx + K.pitch*s*F;
  const shw   = s*0.104, hemw = s*K.hemw;
  const hemY  = footY - s*K.hemDrop;
  const headR = m.headR;
  const headCy = shoY - headR*(P === "hang" ? 1.14 : 1.30) + m.dread*headR*0.30;
  const hx    = sx + m.headTurn*headR*0.30 + m.tilt*headR*0.80;

  /* ground shadow — only when the feet are on the paving */
  if (m.air < 0.06){
    g.fillStyle = "rgba(0,0,0,0.09)";
    g.beginPath();
    g.ellipse(cx, footY + s*0.012, hemw*(P === "kneel" ? 0.95 : 1.02), s*0.024, 0, 0, 7);
    g.fill();
  }

  /* ---------- LEGS ---------- */
  if (P === "kneel"){
    // thigh forward-down to the knee, shin folded back along the paving
    const knee = { x: cx + F*s*0.085, y: footY };
    const heel = { x: cx - F*s*0.190, y: footY - s*0.012 };
    pen.limb(()=>{ g.moveTo(cx - F*s*0.010, hipY); g.lineTo(knee.x, knee.y); }, skin, s*0.052);
    pen.limb(()=>{ g.moveTo(knee.x, knee.y); g.lineTo(heel.x, heel.y); }, skin, s*0.046);
    pen.paint(()=>{ g.ellipse(heel.x - F*s*0.016, heel.y, s*0.046, s*0.020, 0, 0, 7); }, skin, cw*0.7);
  } else if (P === "hang"){
    // legs together, straight down, toes pointed at the paving
    const tw = s*0.026;
    for (const side of [-1, 1]){
      const ax = cx + side*tw*1.05 + m.tilt*s*0.020;
      pen.limb(()=>{ g.moveTo(cx + side*tw*0.9, hipY); g.lineTo(ax, footY - s*0.020); }, skin, s*0.048);
      pen.paint(()=>{ g.ellipse(ax, footY - s*0.006, s*0.021, s*0.038, 0, 0, 7); }, skin, cw*0.7);
    }
  } else {
    const st = m.stride;
    const fFr = { x: cx + F*s*0.055*(0.40 + Math.abs(st)), y: footY };
    const fBk = { x: cx - F*s*0.060*(0.40 + Math.abs(st)), y: footY - s*0.010 };
    pen.limb(()=>{ g.moveTo(cx - F*s*0.022, hipY); g.lineTo(fBk.x, fBk.y - s*0.014); }, skin, s*0.050);
    pen.limb(()=>{ g.moveTo(cx + F*s*0.022, hipY); g.lineTo(fFr.x, fFr.y - s*0.014); }, skin, s*0.054);
    pen.paint(()=>{ g.ellipse(fBk.x, fBk.y, s*0.045, s*0.019, 0, 0, 7); }, skin, cw*0.7);
    pen.paint(()=>{ g.ellipse(fFr.x, fFr.y, s*0.047, s*0.020, 0, 0, 7); }, skin, cw*0.7);
  }

  /* ---------- FAR ARM, behind the gown. Skipped when both hands are made
     fast at the same point: two limbs onto one wrist is just a black knot. */
  if (P !== "bound"){
    const sh = { x: sx - F*shw*0.84, y: shoY + s*0.036 };
    let hand;
    switch (P){
      case "kneel":  hand = { x: cx - F*s*0.060, y: footY - s*0.010 }; break;
      case "carry":  hand = { x: cx + F*m.grip*s*0.300, y: hipY - s*0.010 }; break;
      case "bound":  hand = { x: sx + F*s*0.020, y: hipY - s*(0.006 + (m.idx % 4)*0.024) }; break;
      case "hang":   hand = { x: sx - F*shw*1.10, y: hipY + s*0.070 }; break;
      case "cower":  hand = { x: sx - F*shw*0.30, y: shoY + s*0.090 }; break;
      default:       hand = { x: sx - F*shw*1.02, y: hipY + s*0.020 };
    }
    arm(pen, sh, hand, -F, gown2, skin, s, P === "hang" ? 0.04 : 0.12);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.026, 0, 7); }, skin, cw*0.6);
  }

  /* ---------- THE GOWN ---------- */
  pen.paint(()=>{
    g.moveTo(sx - shw, shoY);
    g.lineTo(sx + shw, shoY);
    g.lineTo(cx + hemw + (P === "carry" ? -F*s*0.030 : 0), hemY);
    g.lineTo(cx - hemw + (P === "carry" ? -F*s*0.030 : 0), hemY);
    g.closePath();
  }, gown, cw);
  pen.seam(()=>{ g.moveTo(sx - shw*0.36, shoY + s*0.07); g.lineTo(cx - hemw*0.44, hemY - s*0.02); }, cw*0.55);
  pen.seam(()=>{ g.moveTo(sx + shw*0.36, shoY + s*0.07); g.lineTo(cx + hemw*0.44, hemY - s*0.02); }, cw*0.55);

  /* girdle — one dark accent across a light plane */
  const waistY = shoY + (hipY - shoY)*(0.52 + (m.idx % 3)*0.070);
  const ww = lerp(shw, hemw, clamp01((waistY - shoY)/((hemY - shoY) || 1)))*0.98;
  pen.paint(()=>{ g.rect(sx - ww, waistY, ww*2, s*0.020); }, bandT, cw*0.7);

  /* ---------- NECK, HAIR, HEAD ---------- */
  pen.paint(()=>{ g.rect(sx - headR*0.26, shoY - headR*0.70, headR*0.52, headR*0.96); }, skin, cw*0.75);
  pen.paint(()=>{ g.ellipse(hx - F*headR*0.08, headCy + headR*0.10, headR*1.02, headR*1.12, 0, 0, 7); }, hair, cw*0.9);
  pen.paint(()=>{ g.arc(hx - F*headR*0.88, headCy + headR*0.22, headR*0.26, 0, 7); }, hair, cw*0.7);
  pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.86, headR, 0, 0, 7); }, skin, cw);

  const eyeY = headCy - headR*0.02;
  const gx   = m.headTurn*headR*0.30;
  g.strokeStyle = INK; g.lineCap = "round";
  if (m.eyesShut){                                     // closed: two short bars
    g.lineWidth = Math.max(2.4, headR*0.15);
    for (const side of [-1, 1]){
      if (side === -1 && m.headTurn >= 0.62) continue;
      if (side ===  1 && m.headTurn <= -0.62) continue;
      g.beginPath();
      g.moveTo(hx + side*headR*0.44 + gx, eyeY); g.lineTo(hx + side*headR*0.18 + gx, eyeY);
      g.stroke();
    }
  } else {
    const eyeR = headR*0.13;
    g.fillStyle = INK;
    if (m.headTurn > -0.62){ g.beginPath(); g.ellipse(hx + headR*0.31 + gx, eyeY, eyeR, eyeR*1.05, 0, 0, 7); g.fill(); }
    if (m.headTurn <  0.62){ g.beginPath(); g.ellipse(hx - headR*0.31 + gx, eyeY, eyeR, eyeR*1.05, 0, 0, 7); g.fill(); }
  }
  g.strokeStyle = INK;
  g.lineWidth = Math.max(2, headR*0.12);
  g.beginPath();
  g.moveTo(hx + gx*0.6, eyeY + headR*0.14);
  g.lineTo(hx + m.headTurn*headR*0.40 + F*headR*0.12, eyeY + headR*0.44);
  g.stroke();
  if (m.mouthOpen > 0.5){
    pen.paint(()=>{ g.ellipse(hx + gx*0.7, headCy + headR*0.58, headR*0.19, headR*0.25, 0, 0, 7); },
              toneSolid(inkLevel(7)), cw*0.55);
  } else {
    g.lineWidth = Math.max(2, headR*0.11);
    g.beginPath();
    g.moveTo(hx - headR*0.20 + gx, headCy + headR*0.56);
    g.quadraticCurveTo(hx + gx, headCy + headR*0.56 + headR*0.16, hx + headR*0.20 + gx, headCy + headR*0.56);
    g.stroke();
  }

  /* ---------- NEAR ARM + the duty in her hands ---------- */
  const shN = { x: sx + F*shw*0.86, y: shoY + s*0.036 };
  let hand, bend = 0.22;
  switch (P){
    case "kneel":  hand = { x: cx + F*s*0.330, y: footY + s*0.020 }; bend = 0.26; break;
    case "carry":  hand = { x: cx + F*m.grip*s*0.335, y: hipY - s*0.005 }; bend = 0.16; break;
    case "bound":  hand = { x: sx + F*s*0.020, y: hipY - s*(0.006 + (m.idx % 4)*0.024) }; bend = 0.09; break;
    case "hang":   hand = { x: sx + F*shw*1.14, y: hipY + s*0.072 }; bend = 0.04; break;
    case "driven": hand = { x: hx + F*headR*0.90, y: headCy - headR*0.55 }; bend = 0.30; break;
    case "cower":  hand = { x: hx + F*headR*0.30, y: headCy + headR*0.95 }; bend = 0.34; break;
    default:       hand = { x: sx + F*shw*0.94, y: hipY + s*0.040 }; bend = 0.12;
  }
  arm(pen, shN, hand, F, gown2, skin, s, bend);
  pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.030, 0, 7); }, skin, cw*0.65);

  /* the CORD: the wrists made fast in front of her — the one dark accent that
     says confinement, and it is geometry, not a caption */
  if (P === "bound" || P === "hang" || P === "cower"){
    // the wrist height varies member to member so twelve cords never align
    const wy = hipY - s*(0.006 + (m.idx % 4)*0.024);
    const wx = sx + F*s*0.020;
    if (P !== "hang"){
      pen.paint(()=>{ g.rect(wx - s*0.034, wy - s*0.012, s*0.068, s*0.024); }, toneSolid(inkLevel(5)), cw*0.6);
      pen.ink(()=>{ g.moveTo(wx - s*0.034, wy + s*0.020); g.lineTo(wx + s*0.010, wy + s*0.062); }, cw*0.7);
    }
  }

  /* the SPONGE + the water bowl beside the kneeling woman */
  if (P === "kneel"){
    pen.paint(()=>{ g.ellipse(hand.x + F*s*0.030, hand.y + s*0.012, s*0.048, s*0.028, 0, 0, 7); },
              toneSolid(inkLevel(5)), cw*0.6);
    // a wet arc scoured across the paving in front of her
    g.save(); g.strokeStyle = INK; g.lineWidth = Math.max(2, s*0.012); g.globalAlpha = 0.34;
    for (let k = 0; k < 3; k++){
      g.beginPath();
      g.ellipse(cx + F*s*0.28, footY + s*0.052 + k*s*0.030, s*(0.20 + k*0.045), s*0.020, 0, 0.15, Math.PI - 0.15);
      g.stroke();
    }
    g.restore();
    pen.paint(()=>{ g.ellipse(cx - F*s*0.300, footY + s*0.028, s*0.072, s*0.034, 0, 0, 7); },
              toneSolid(inkLevel(2)), cw*0.7);
    pen.seam(()=>{ g.moveTo(cx - F*s*0.360, footY + s*0.022); g.lineTo(cx - F*s*0.240, footY + s*0.022); }, cw*0.6);
  }
}

/* ---------------- THE DEAD MEN ----------------
   Carried between a pair, or laid along the wall base. A limp horizontal form:
   light plane, hard contour, one dark belt. Nothing gory — the weight is the
   point, and the weight is in the sag and in the arm that trails. */
function drawBody(pen, x, y, len, F, carried){
  const g = pen.ctx;
  const h = len*0.235, cw = Math.max(2.4, len*0.020);
  const sag = carried ? h*0.30 : 0;
  const tone  = toneSolid(inkLevel(2));
  const tone2 = toneSolid(inkLevel(3));
  // trunk: shoulders at the -F end, feet at the +F end, bowed under its own weight
  pen.paint(()=>{
    g.moveTo(x - F*len*0.46, y - h*0.34);
    g.quadraticCurveTo(x, y - h*0.34 + sag, x + F*len*0.46, y - h*0.14);
    g.lineTo(x + F*len*0.46, y + h*0.24);
    g.quadraticCurveTo(x, y + h*0.30 + sag, x - F*len*0.46, y + h*0.30);
    g.closePath();
  }, tone, cw);
  pen.paint(()=>{ g.rect(x - F*len*0.10 - len*0.045, y - h*0.10 + sag*0.9, len*0.090, h*0.44); }, toneSolid(inkLevel(5)), cw*0.7); // belt
  // head, thrown back off the near end
  pen.paint(()=>{ g.arc(x - F*len*0.545, y - h*0.10 + sag*0.2, h*0.42, 0, 7); }, tone2, cw*0.8);
  pen.paint(()=>{ g.arc(x - F*len*0.585, y - h*0.22 + sag*0.2, h*0.30, 0, 7); }, toneSolid(inkLevel(6)), cw*0.6); // hair
  // legs off the far end
  pen.limb(()=>{ g.moveTo(x + F*len*0.42, y + h*0.02); g.lineTo(x + F*len*0.72, y + h*0.16 + sag*0.5); }, tone, len*0.052);
  pen.limb(()=>{ g.moveTo(x + F*len*0.42, y + h*0.16); g.lineTo(x + F*len*0.70, y + h*0.34 + sag*0.5); }, tone, len*0.048);
  // the trailing arm — the tell that nobody is holding it up
  pen.limb(()=>{
    g.moveTo(x - F*len*0.34, y + h*0.06);
    g.lineTo(x - F*len*0.30, y + h*0.52 + sag*1.3);
  }, tone2, len*0.044);
  pen.paint(()=>{ g.arc(x - F*len*0.295, y + h*0.60 + sag*1.3, len*0.030, 0, 7); }, tone2, cw*0.6);
}

/* ---------------- THE REGISTER ----------------
   Twelve numbered stations under the line. Filled = still here; dimmed = gone.
   Seven-segment bars, sized to print through the lattice. */
function drawRegister(pen, W, H, built){
  const g = pen.ctx;
  const dh = Math.max(32, H*0.046), lw = Math.max(6, dh*0.20);
  const y = H*REG_Y - dh*0.5;
  g.save(); g.fillStyle = INK; g.strokeStyle = INK;
  for (let i = 0; i < built.N; i++){
    const u = built.N > 1 ? i/(built.N - 1) : 0.5;
    const X = stationAt(u).x*W;
    const here = i < built.nShown;
    g.globalAlpha = here ? 1 : 0.20;
    // two-digit numerals shrink so they still clear the neighbouring station
    const n = String(i + 1);
    const dhi = n.length > 1 ? dh*0.80 : dh, lwi = n.length > 1 ? lw*0.82 : lw;
    const dw = dhi*0.58, gap = dhi*0.14;
    const totw = n.length*dw + (n.length - 1)*gap + lwi;
    let x = X - totw/2 + lwi/2, yy = y + (dh - dhi)*0.5;
    for (const ch of n){ segDigit(g, x, yy, dhi, +ch, lwi); x += dw + gap; }
    // the leader joining the numeral to its station
    g.fillRect(X - (here ? 3 : 1.5), y - dh*0.52, here ? 6 : 3, dh*0.34);
  }
  g.restore();
}

/* ---------------- deterministic member build ---------------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st, focus:{ ...params.focus, ...((st && st.focus) || {}) } };
  const formation = p.formation || "line";
  const N       = clamp(Math.round(p.count ?? 12), 2, 18);
  const density = clamp01(p.density);
  const attention = clamp01(p.attention);
  const wave    = p.wave ?? 1.6;
  const sigma   = Math.max(0.05, p.waveSpread ?? 0.17);
  const dread0  = clamp01(p.dread ?? 0.5);
  const lift    = clamp01(p.lift ?? 0);
  const spread  = clamp(p.spread ?? 1, 0.4, 1.8);
  const dir     = (p.dir ?? 1) >= 0 ? 1 : -1;
  const seed    = (p.seed ?? params.seed) >>> 0;
  const aimX    = p.focus.x*W;
  const nShown  = clamp(Math.round(N*(0.34 + 0.66*density)), 2, N);

  const members = [], bodies = [];
  for (let i = 0; i < N; i++){
    if (i >= nShown) continue;
    const rng = rnd((seed + i*211 + 17) >>> 0);
    const t   = N > 1 ? i/(N - 1) : 0.5;
    const lane = (i % 2) ? 1 : -1;
    let u = t, cx, baseY, s, posture, F = dir, grip = 1, air = 0;

    if (formation === "carry"){
      const P = Math.ceil(N/2), pr = Math.floor(i/2), aft = (i % 2) === 1;
      const v = P > 1 ? pr/(P - 1) : 0.5;
      const vv = clamp01(v + (aft ? -0.055 : 0.055));
      const q  = haulAt(vv);
      cx = q.x*W; baseY = q.y*H; s = q.s; u = vv; posture = "carry";
      F = -1; grip = aft ? 1 : -1;
      if (aft){                                     // one body per pair, between them
        const a = haulAt(clamp01(v - 0.055)), b = haulAt(clamp01(v + 0.055));
        bodies.push({ x:(a.x + b.x)/2*W, y:(a.y + b.y)/2*H - (a.s + b.s)/2*0.392,
                      len:(a.s + b.s)/2*0.60, F:-1, carried:true, d:(a.y + b.y)/2 });
      }
    } else if (formation === "scrub"){
      const col = i % 4, row = Math.floor(i/4) % 3, rt = row/2;
      cx = (0.140 + col*0.232 + (row % 2)*0.070 + (rng() - 0.5)*0.024)*W;
      baseY = lerp(0.648, 0.856, rt)*H;
      s = lerp(150, 252, rt);
      posture = "kneel"; u = t; F = (col % 2) ? -1 : 1;
    } else if (formation === "herd"){
      u = clamp01(0.44 + 0.52*t + (rng() - 0.5)*0.05);
      const q = stationAt(u);
      cx = (q.x + lane*0.013*spread)*W; baseY = (q.y + lane*0.021)*H;
      s  = q.s*(1 + lane*0.048);
      posture = rng() < 0.42 ? "cower" : "driven";
      F = -1;
    } else if (formation === "hanged"){
      const q = stationAt(u);
      cx = q.x*W;
      baseY = (q.y - lift*0.148)*H;
      s = q.s*0.92; posture = "hang"; air = lift;
      F = (i % 3 === 0) ? -1 : 1;
    } else {                                        // line — the row along the wall
      const q = stationAt(u);
      cx = (q.x + lane*0.008*spread)*W;
      baseY = (q.y + lane*0.016)*H;
      s = q.s*(1 + lane*0.050);
      posture = "bound";
      F = (i % 3 === 0) ? -dir : dir;
    }

    // the REACTION WAVE — dread travelling down the line
    const d   = u - wave;
    const hit = clamp01(Math.exp(-(d*d)/(2*sigma*sigma)));
    if (formation === "line" && hit > 0.55) posture = "cower";
    const dread = clamp01(dread0 + hit*0.70);

    const att = clamp01(attention + hit*0.60);
    let headTurn = clamp((aimX - cx)/(W*0.34), -1, 1)*att;
    if (att < 0.15) headTurn = (rng() - 0.5)*0.8;
    headTurn = clamp(headTurn, -1, 1);

    const depth = clamp01((baseY/H - 0.60)/0.30);
    const K = KIN[posture] || KIN.bound;
    const headR = s*0.086*(0.92 + rng()*0.18);

    members.push({
      cx, baseY, s, u, F, grip, posture, air, headR,
      headTurn: posture === "hang" ? (rng() - 0.5)*0.5 : headTurn,
      tilt:  posture === "hang" ? (rng() < 0.5 ? -0.40 : 0.40) : 0,
      dread, stride: posture === "carry" ? 0.55 + rng()*0.40 : 0.10 + rng()*0.25,
      eyesShut: posture === "hang" || (dread > 0.72 && rng() < 0.6),
      mouthOpen: posture === "driven" && hit > 0.4 ? 1 : 0,
      neckY: baseY - s*K.sho - headR*(posture === "hang" ? 1.14 : 1.30) + s*0.086*1.02,
      band: depth < 0.34 ? 0 : (depth < 0.70 ? 1 : 2),
      feat:{ headS: 1 },
      /* LIGHT gowns, one dark girdle, dark hair: the row must read as pale
         shapes with hard accents, never as a black frieze */
      shade:{
        gown:  Math.round(lerp(0.6, 1.8, depth)),
        band:  Math.round(lerp(4, 5, depth)),
        skin:  1,
        hair:  5,
      },
      idx: i,
    });
  }
  members.sort((a, b) => a.baseY - b.baseY);
  bodies.sort((a, b) => a.d - b.d);

  // dead men LAID along the wall base, back to front, never in one straight rank
  const nLaid = clamp(Math.round(p.bodies ?? 0), 0, 8);
  for (let k = 0; k < nLaid; k++){
    const r = rnd((seed + 900 + k*53) >>> 0);
    const c = k % 4, row = Math.floor(k/4);
    const yy = lerp(0.606, 0.676, row + (r() - 0.5)*0.30);
    bodies.push({ x:(0.180 + c*0.212 + (row % 2)*0.058)*W, y:yy*H,
                  len: lerp(0.108, 0.140, row)*W, F: (k % 2) ? -1 : 1, carried:false, d:yy });
  }

  return { members, bodies, N, nShown,
           showYard:p.showYard, showCable:p.showCable, showRegister:p.showRegister,
           formation, lift };
}

/* ---------------- stage ---------------- */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const built = buildMembers(W, H, st);
  const layers = (st && st.layers) || asset.layers;
  const has = l => layers.includes(l);

  g.fillStyle = inkLevel(0); g.fillRect(0, 0, W, H);
  if (has("yard") && built.showYard !== false) drawYard(pen, W, H);
  if (has("wall") && built.showYard !== false) drawWall(pen, W, H);

  /* THE CABLE + the drops. The cable is a line, never a bar; the drops hang
     BEHIND the women so the loop can be closed in front of them after. */
  const drops = [];
  if (has("cable") && built.showCable !== false){
    g.save();
    g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round";
    g.beginPath();
    for (let k = 0; k <= 48; k++){
      const x = lerp(CABLE.xL, CABLE.xR, k/48)*W, y = cableY(x/W)*H;
      k ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
    g.lineWidth = 3.5;
    for (let i = 0; i < built.N; i++){
      const u = built.N > 1 ? i/(built.N - 1) : 0.5;
      const X = stationAt(u).x*W, top = cableY(X/W)*H;
      const m = built.members.find(q => q.idx === i);
      const hanging = m && m.posture === "hang";
      const bottom = hanging ? m.neckY : H*NOOSE_IDLE;
      const r = (hanging ? m.s : LINE.s0)*0.072;
      g.globalAlpha = (i < built.nShown) ? 0.92 : 0.34;
      g.beginPath(); g.moveTo(X, top); g.lineTo(X + (hanging ? (m.cx - X) : 0), bottom - r); g.stroke();
      drops.push({ x: hanging ? m.cx : X, y: bottom, r, on: i < built.nShown });
    }
    g.restore();
  }

  // dead men behind the line
  if (has("bodies")) for (const b of built.bodies) if (!b.carried) drawBody(pen, b.x, b.y, b.len, b.F, false);

  const bandLayer = ["rank-back", "rank-mid", "rank-front"];
  for (const m of built.members){
    if (!has(bandLayer[Math.min(m.band, 2)])) continue;
    drawMaid(pen, m);
    if (has("bodies")){
      const b = built.bodies.find(q => q.carried && Math.abs(q.d*H - m.baseY) < m.s*0.30);
      if (b && !b.done){ drawBody(pen, b.x, b.y, b.len, b.F, true); b.done = true; }
    }
  }

  // the loops, closed in front — a noose is a ring, and it reads as one
  if (has("nooses") && built.showCable !== false){
    g.save(); g.strokeStyle = INK; g.lineCap = "round";
    for (const d of drops){
      g.globalAlpha = d.on ? 0.95 : 0.32;
      g.lineWidth = Math.max(3, d.r*0.42);
      g.beginPath(); g.ellipse(d.x, d.y, d.r*0.86, d.r, 0, 0, 7); g.stroke();
      g.lineWidth = Math.max(3, d.r*0.52);
      g.beginPath(); g.moveTo(d.x - d.r*0.44, d.y - d.r*0.92); g.lineTo(d.x + d.r*0.44, d.y - d.r*0.92); g.stroke();
    }
    g.restore();
  }

  if (has("register") && built.showRegister !== false) drawRegister(pen, W, H, built);

  /* the near pier of the round-house, at the left edge — a FOREGROUND occluder
     drawn last, so station 1 stands partly behind it */
  if (has("pier")){
    pen.paint(()=>{ g.rect(0, H*0.512, W*0.046, H*0.470); }, toneSolid(inkLevel(2)), 4);
    pen.seam(()=>{ g.moveTo(W*0.036, H*0.540); g.lineTo(W*0.036, H*0.960); }, 2);
  }
}

export const asset = {
  id:"ensemble.twelve-disloyal-maids",
  type:"ENSEMBLE",
  name:"Twelve disloyal maids",
  statusWord:"IN LINE",
  scene:"OD-B22-S07",

  params,
  member:{ template:"serving-woman", duties:DUTIES, count:12, spine:"station-line + haul" },
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["yard","wall","cable","bodies","rank-back","rank-mid","rank-front","nooses","register","pier"],

  /* normalized 0..1 anchors. station:1..12 are the twelve identities — a scene
     places a NAMED woman (Melantho) on one of them; nothing is baked in.
     Every station anchor is PROJECTED from stationAt(), never hand-written, so
     the register, the nooses and the bodies cannot drift apart. */
  anchors:(()=>{
    const r3 = v => Math.round(v*1000)/1000;
    const a = {
      "gate:hall":{ x:r3((GATE.x0 + GATE.x1)/2), y:GROUND },
      "door:round-house":{ x:0.140, y:GROUND },
      "cable:left":{ x:CABLE.xL, y:CABLE.yL },
      "cable:mid":{ x:0.598, y:r3(cableY(0.598)) },
      "cable:right":{ x:CABLE.xR, y:CABLE.yR },
      "haul:gate":{ x:HAUL.x0, y:HAUL.y0 },
      "haul:front":{ x:HAUL.x1, y:HAUL.y1 },
      "line:head":{ x:LINE.x0, y:LINE.y0 },
      "line:tail":{ x:LINE.x1, y:LINE.y1 },
      "register:base":{ x:0.500, y:REG_Y },
      "camera:wide":{ x:0.500, y:0.600 },
      "camera:line":{ x:0.500, y:0.780 },
      "camera:gate":{ x:0.700, y:0.520 },
    };
    for (let i = 0; i < 12; i++){
      const q = stationAt(i/11);
      a[`station:${i+1}`] = { x:r3(q.x), y:r3(q.y) };
      a[`noose:${i+1}`]   = { x:r3(q.x), y:NOOSE_IDLE };
    }
    return a;
  })(),

  zones:{
    yard:{ x0:0.03, y0:GROUND, x1:0.97, y1:0.97 },
    line:{ x0:0.06, y0:0.76, x1:0.96, y1:0.87 },
    haul:{ x0:0.12, y0:0.60, x1:0.78, y1:0.90 },
    "wall:base":{ x0:0.25, y0:0.58, x1:1.00, y1:0.70 },
    "occlusion:pier":{ x0:0.00, y0:0.50, x1:0.06, y1:1.00 },
  },

  channels:["formation","count","density","attention","wave","waveSpread",
            "dread","lift","spread","dir","bodies"],

  states:{
    initial:"line",
    nodes:{
      // OD-B22-S07 a — they carry the dead men out through the gate
      "body-removal": { preview:{ formation:"carry", count:12, density:1.0, attention:0.35,
                                  dread:0.55, bodies:2, showCable:false, wave:1.6,
                                  status:"CARRYING OUT", progress:0.16 } },
      // the yard filling with what they have carried
      "yard-stacked": { preview:{ formation:"carry", count:12, density:0.7, attention:0.30,
                                  dread:0.60, bodies:6, showCable:false, wave:1.6,
                                  status:"STACKED", progress:0.28 } },
      // OD-B22-S07 b — on their knees with sponges, scouring the paving
      "cleaning":     { preview:{ formation:"scrub", count:12, density:1.0, attention:0.20,
                                  dread:0.50, bodies:3, showCable:false, wave:1.6,
                                  status:"SCOURING", progress:0.40 } },
      // driven out of the hall into the yard, bunched
      "herded":       { preview:{ formation:"herd", count:12, density:1.0, attention:0.85,
                                  dread:0.72, bodies:2, wave:1.6,
                                  status:"DRIVEN OUT", progress:0.52 } },
      // OD-B22-S07 c — the row along the wall, wrists corded, nooses waiting
      "line":         { preview:{ formation:"line", count:12, density:1.0, attention:0.55,
                                  dread:0.55, lift:0, wave:1.6,
                                  status:"IN LINE", progress:0.64 } },
      // the wave: it reaches them one after another down the row
      "dread-wave":   { preview:{ formation:"line", count:12, density:1.0, attention:0.80,
                                  dread:0.55, wave:0.46, waveSpread:0.16,
                                  status:"THE WAVE", progress:0.70 } },
      // the far end of the register already gone — nine of twelve left
      "thinned":      { preview:{ formation:"line", count:12, density:0.62, attention:0.70,
                                  dread:0.80, wave:1.6,
                                  status:"NINE OF TWELVE", progress:0.78 } },
      // the cable taking up: feet still just touching
      "lifting":      { preview:{ formation:"hanged", count:12, density:1.0, lift:0.35,
                                  attention:0.0, dread:1.0, wave:1.6,
                                  status:"TAKING UP", progress:0.88 } },
      // OD-B22-S07 d — clear of the paving, in a row, like thrushes in a net
      "hanged":       { preview:{ formation:"hanged", count:12, density:1.0, lift:1.0,
                                  attention:0.0, dread:1.0, wave:1.6,
                                  status:"IN A ROW", progress:1.0 } },
    },
    edges:[
      ["body-removal","yard-stacked"],["yard-stacked","cleaning"],
      ["body-removal","cleaning"],["cleaning","herded"],
      ["herded","line"],["line","dread-wave"],["dread-wave","line"],
      ["line","thinned"],["thinned","line"],
      ["line","lifting"],["lifting","hanged"],["hanged","lifting"],
      ["line","herded"],["cleaning","body-removal"],
    ],
  },

  /* neutral preview = the reason the asset exists: twelve identified women set
     in a row under a cable that already has twelve loops in it */
  preview:()=>({ formation:"line", count:12, density:1.0, attention:0.55,
                 wave:1.6, waveSpread:0.17, dread:0.55, lift:0, spread:1.0,
                 dir:1, bodies:0, status:"IN LINE", progress:0.64 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
