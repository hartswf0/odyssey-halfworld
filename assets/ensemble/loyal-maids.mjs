/* ensemble.loyal-maids — the women of the house who did NOT shame it.
   Book XXII, after the killing. Eurycleia goes up and calls down the women
   who kept faith. They come out of the women's quarters with torches, into a
   hall still wet, and they stop: they will not believe it is him. Then they
   see the scar above the knee and they hear the voice, and the standing-off
   arc collapses inward — they come round him and take his head and his hands
   and his shoulders, and a sweet longing to weep comes over him.

   The whole asset is that ONE movement: a wary arc that becomes an embrace.

   ENSEMBLE. One separable member template (a house-woman: long peplos with an
   overfold, girdle, head-cloth, bound hair, some carrying a torch) instanced N
   times deterministically. There is exactly one spine:

     ENTRY (the door of the women's quarters, back left, small)
       --approach-->  RING (a contact ellipse on the floor around the FOCUS)

   Every member owns one ring station `theta_i` and one bowed radial path to
   it. Position, scale, tone band, gaze, gesture and contact are all derived
   from (a_i = how far along her path she is) and (r_i = how far the
   RECOGNITION WAVE has reached her). Nothing is hand-placed, so the crowd
   cannot drift.

   Exposed ENSEMBLE controls:
     FORMATION   entering | file | wary-arc | converging | embracing |
                 kneeling | withdrawing
     COUNT       how many women the ring carries (12)
     DENSITY     thins from the DOOR end first — the ones still upstairs
     APPROACH    0 = all at the door .. 1 = all on the contact ring
     ATTENTION   how hard every head turns onto the focus
     WAVE +      the recognition wave — scar, then voice — travelling through
     WAVESPREAD  the group: torches drop, arms come up, the arc closes
     WEEPING     0 dry .. 1 hands to the face, heads bowed
     TORCHES     how many carry fire
     SPREAD      lateral fan of the radial paths
     RADIUS      contact-ring multiplier (wary standing-off vs. body contact)
     depth       FOREGROUND (front arc, large, darker accents) / BACKGROUND
                 (back arc, small, one level lighter, drawn from behind) —
                 read off the single depth ramp, plus the band layers
                 band-back / band-mid / band-front for occlusion control.

   NOTHING IS BAKED IN. The man they are recognizing is cast separately as
   character.odysseus-b16 at `focus:stand`; the asset draws only the empty
   floor mark, the scar sight-point and the hand-height contact point. The
   shell is a THRESHOLD FRAGMENT (their door, one pillar, a broken wall line)
   — not a room. The hall is location.megaron-hall and the scene places it.
   Solid grays + hard contour only; the engine dotify POST pass supplies the
   halftone. Atlas OD-B22-S08. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const TAU = Math.PI*2;

/* the separable gesture set of the member template — the recognition ladder,
   in order. A crowd frozen at any one of these is a legible beat. */
export const GESTURES = ["wary","torch","peer","reach","hands-up","embrace","kiss-hands","kneel","weep"];

const params = {
  formation:"converging",
  count:12,
  density:1.0,
  approach:0.66,     // 0 = all still in the doorway .. 1 = all on the ring
  attention:0.85,    // how hard the heads turn onto him
  wave:0.62,         // recognition front, 0..1 through the arrival order
  waveSpread:0.30,
  weeping:0.35,
  torches:5,
  spread:1.0,
  radius:1.0,        // 1 = body contact; ~1.5 = standing off, not believing
  lag:0.82,          // how staggered the arrivals are
  seed:2208,
  showShell:true,
  showField:true,
  showFocus:true,
};

/* ---------------- THE SPINE ----------------
   FOCUS is the floor point he stands on. RING is the contact ellipse round it
   (in floor perspective: ry << rx). ENTRY is their door. Everything projects
   from these three, and every anchor below is computed from them. */
const FOCUS = { x:0.545, y:0.762 };
const CHEST = { x:0.545, y:0.606 };   // where reaching hands land
const SCAR  = { x:0.557, y:0.694 };   // the mark above the knee they look at
const HEADP = { x:0.545, y:0.500 };   // where the voice comes from
const RING  = { rx:0.318, ry:0.116 };
const ENTRY = { x:0.112, y:0.498 };
const HORIZON = 0.400;
/* one depth ramp for the whole ensemble: height is a pure function of the
   floor line a woman stands on, so nobody can be the wrong size for her row */
const DEPTH = { yBack:0.455, yFront:0.960, sBack:76, sFront:152 };
function depthScale(yn){ return lerp(DEPTH.sBack, DEPTH.sFront, clamp01((yn - DEPTH.yBack)/(DEPTH.yFront - DEPTH.yBack))); }

/* station i of N, swept from the door side across the FRONT of him and round
   the back — so the first women in take the near stations and the late ones
   fill in behind. The gap at theta = PI is the aisle they walk up. */
function stationTheta(i, N){ return lerp(0.92*Math.PI, -0.92*Math.PI, N > 1 ? i/(N-1) : 0.5); }
/* RADIUS opens the ring mostly TOWARD THE CAMERA, not sideways: a wary
   stand-off backs people off in depth, and widening x at the same rate would
   simply push the ends of the arc off the plate. */
function ringAt(theta, mul=1){
  const rxm = 1 + (mul - 1)*0.40;
  return { x: FOCUS.x + RING.rx*rxm*Math.cos(theta),
           y: FOCUS.y + RING.ry*mul*Math.sin(theta) };
}

/* ============================================================
   ONE MEMBER — a house-woman.
   Everything keys off s (her height) so the same template serves the 92px
   back of the ring and the 188px front of it.
   ============================================================ */
function arm(pen, sh, hand, F, sleeve, skin, s, bend){
  const g = pen.ctx;
  const dx = hand.x - sh.x, dy = hand.y - sh.y;
  const L = Math.hypot(dx, dy) || 1;
  const b = bend*0.66;                     // shallow elbows: arms, not wings
  const el = { x:(sh.x+hand.x)/2 + (-dy/L)*L*b*F,
               y:(sh.y+hand.y)/2 + ( dx/L)*L*b*F };
  pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); }, sleeve, s*0.045);
  pen.limb(()=>{ g.moveTo(el.x, el.y); g.lineTo(hand.x, hand.y); }, skin, s*0.035);
  return el;
}

function drawTorch(pen, hand, dir, s, lit){
  const g = pen.ctx;
  const L = s*0.245;
  const tip = { x: hand.x + dir.x*L, y: hand.y + dir.y*L };
  const btm = { x: hand.x - dir.x*L*0.26, y: hand.y - dir.y*L*0.26 };
  pen.limb(()=>{ g.moveTo(btm.x, btm.y); g.lineTo(tip.x, tip.y); }, toneSolid(inkLevel(3)), s*0.020);
  // the bound, pitched head — one small dark accent per torch, nothing wider
  pen.paint(()=>{ g.ellipse(tip.x, tip.y, s*0.036, s*0.028, Math.atan2(dir.y, dir.x), 0, TAU); },
            toneSolid(inkLevel(6)), Math.max(2, s*0.012));
  if (!lit) return;
  const px = -dir.y, py = dir.x;
  pen.ink(()=>{
    for (let k = -1; k <= 1; k++){
      g.moveTo(tip.x + px*k*s*0.022, tip.y + py*k*s*0.022);
      g.lineTo(tip.x + dir.x*s*(0.058 + 0.026*(1-Math.abs(k))) + px*k*s*0.036,
               tip.y + dir.y*s*(0.058 + 0.026*(1-Math.abs(k))) + py*k*s*0.036);
    }
  }, Math.max(2, s*0.014));
}

function drawWoman(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, F = m.F, feat = m.feat;
  const cw = Math.max(2, s*0.016);
  const gownT = toneSolid(inkLevel(m.shade.gown));
  const foldT = toneSolid(inkLevel(m.shade.fold));
  const bandT = toneSolid(inkLevel(m.shade.band));
  const skinT = toneSolid(inkLevel(m.shade.skin));
  const hairT = toneSolid(inkLevel(m.shade.hair));

  const k     = m.kneel;
  const shoY  = baseY - s*(0.690 - 0.230*k);
  const hipY  = baseY - s*(0.400 - 0.160*k);
  const lean  = m.lean*s*0.050*F;
  const sx    = cx + lean;
  const shw   = s*0.104;
  const hemw  = s*(0.166 + 0.086*k);
  const hemY  = baseY - s*0.004;
  const widthAt = y => lerp(shw, hemw, clamp01((y - shoY)/((hemY - shoY) || 1)));
  const headR = s*0.083*feat.headS;
  const headCy= shoY - headR*1.30 + m.bow*s*0.050;
  const hx    = sx + m.headTurn*headR*0.26 + lean*0.40 + m.bow*F*s*0.022;

  /* ground shadow — plants her on the floor of the hall */
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, baseY + s*0.010, hemw*1.04, s*0.022, 0, 0, TAU); g.fill();

  /* bare feet under the hem, only when she is standing */
  if (k < 0.45){
    const st = m.stride;
    for (const [ox, oy, r] of [[-F*0.052*(0.5+st), -0.008, 0.044], [F*0.050*(0.5+st), 0.000, 0.047]])
      pen.paint(()=>{ g.ellipse(cx + s*ox, baseY + s*oy, s*r, s*0.019, 0, 0, TAU); }, skinT, cw*0.7);
  }

  /* ---- FAR arm, behind the gown ---- */
  {
    const sh = { x: sx - F*shw*0.84, y: shoY + s*0.038 };
    arm(pen, sh, m.farHand, -F, foldT, skinT, s, m.farBend);
    pen.paint(()=>{ g.arc(m.farHand.x, m.farHand.y, s*0.027, 0, TAU); }, skinT, cw*0.6);
    if (m.farProp === "torch") drawTorch(pen, m.farHand, m.farDir, s, m.lit);
  }

  /* ---- the peplos: a light column from shoulder to floor, cut across by ONE
     mid-tone overfold band. Two light planes with a darker seam between them
     — never a single dark slab. ---- */
  const waistY0 = shoY + (hipY - shoY)*0.70;
  const wpin = shw*0.80;                    // the pinch that makes her a body
  pen.paint(()=>{
    g.moveTo(sx - shw, shoY);
    g.lineTo(sx + shw, shoY);
    g.lineTo(sx + wpin, waistY0);
    g.lineTo(cx + hemw, hemY);
    g.lineTo(cx - hemw, hemY - s*0.010);
    g.lineTo(sx - wpin, waistY0);
    g.closePath();
  }, gownT, cw);
  // two pleat seams falling from the girdle, so the skirt is a skirt
  pen.seam(()=>{ g.moveTo(sx - wpin*0.42, waistY0 + s*0.030); g.lineTo(cx - hemw*0.50, hemY - s*0.008); }, cw*0.5);
  pen.seam(()=>{ g.moveTo(sx + wpin*0.42, waistY0 + s*0.030); g.lineTo(cx + hemw*0.50, hemY - s*0.006); }, cw*0.5);

  const foldY = shoY + s*(0.175 - 0.050*k);
  if (feat.overfold){
    // the apoptygma, hemmed on the SLANT — a diagonal, never a plank laid
    // across the shoulders, which would stripe the whole ring at once
    const fw = widthAt(foldY)*1.00;
    pen.paint(()=>{
      g.moveTo(sx - shw*1.02, shoY + s*0.012);
      g.lineTo(sx + shw*1.02, shoY + s*0.012);
      g.lineTo(cx + F*fw*0.98, foldY + s*0.030);
      g.lineTo(cx - F*fw*0.92, foldY - s*0.052);
      g.closePath();
    }, foldT, cw*0.85);
  }
  /* girdle — a single dark accent across the light plane, at the pinch */
  pen.paint(()=>{ g.rect(sx - wpin*1.04, waistY0 - s*0.012, wpin*2.08, s*0.026); }, bandT, cw*0.65);

  /* ---- neck, hair, head-cloth, face ---- */
  pen.paint(()=>{ g.rect(sx - headR*0.26, shoY - headR*0.62, headR*0.52, headR*0.90); }, skinT, cw*0.75);
  pen.paint(()=>{ g.ellipse(hx - F*headR*0.10, headCy + headR*0.14, headR*1.10, headR*1.22, 0, 0, TAU); }, hairT, cw*0.9);
  pen.paint(()=>{ g.arc(hx - F*headR*0.92, headCy + headR*0.26, headR*0.32, 0, TAU); }, hairT, cw*0.7); // bound coil

  if (m.back){
    /* seen from behind — the back arc of the ring is hair and head-cloth only,
       which keeps the far side light and stops a wall of faces */
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR*1.02, 0, 0, TAU); }, hairT, cw);
    if (feat.veil) pen.paint(()=>{
      g.moveTo(hx - headR*1.06, headCy + headR*0.30);
      g.quadraticCurveTo(hx, headCy - headR*1.50, hx + headR*1.06, headCy + headR*0.30);
      g.lineTo(hx + headR*0.86, headCy + headR*0.66);
      g.quadraticCurveTo(hx, headCy + headR*0.24, hx - headR*0.86, headCy + headR*0.66);
      g.closePath();
    }, foldT, cw*0.7);
  } else {
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.85, headR, 0, 0, TAU); }, skinT, cw);
    if (feat.veil) pen.paint(()=>{
      g.moveTo(hx - headR*1.04, headCy + headR*0.24);
      g.quadraticCurveTo(hx, headCy - headR*1.52, hx + headR*1.04, headCy + headR*0.24);
      g.lineTo(hx + headR*0.70, headCy + headR*0.30);
      g.quadraticCurveTo(hx, headCy - headR*0.92, hx - headR*0.70, headCy + headR*0.30);
      g.closePath();
    }, foldT, cw*0.7);

    const eyeY = headCy - headR*0.02;
    const gx = m.headTurn*headR*0.28;
    const eyeR = headR*0.13;
    g.fillStyle = INK;
    if (m.headTurn > -0.62){ g.beginPath(); g.ellipse(hx + headR*0.31 + gx, eyeY, eyeR, eyeR*1.05, 0, 0, TAU); g.fill(); }
    if (m.headTurn <  0.62){ g.beginPath(); g.ellipse(hx - headR*0.31 + gx, eyeY, eyeR, eyeR*1.05, 0, 0, TAU); g.fill(); }
    g.strokeStyle = INK; g.lineCap = "round";
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    g.moveTo(hx + gx*0.6, eyeY + headR*0.14);
    g.lineTo(hx + m.headTurn*headR*0.40 + F*headR*0.12, eyeY + headR*0.44);
    g.stroke();
    if (m.weep > 0.5){                       // the open mouth of a woman crying
      pen.paint(()=>{ g.ellipse(hx + gx*0.7, headCy + headR*0.60, headR*0.19, headR*0.26, 0, 0, TAU); },
                toneSolid(inkLevel(7)), cw*0.5);
      pen.ink(()=>{                          // two tear ticks, not a wash
        g.moveTo(hx - headR*0.31 + gx, eyeY + headR*0.20); g.lineTo(hx - headR*0.33 + gx, eyeY + headR*0.52);
        g.moveTo(hx + headR*0.31 + gx, eyeY + headR*0.20); g.lineTo(hx + headR*0.33 + gx, eyeY + headR*0.52);
      }, Math.max(2, headR*0.10));
    } else {
      g.lineWidth = Math.max(2, headR*0.11);
      g.beginPath();
      g.moveTo(hx - headR*0.19 + gx, headCy + headR*0.58);
      g.quadraticCurveTo(hx + gx, headCy + headR*0.58 + m.mouth*headR*0.22,
                         hx + headR*0.19 + gx, headCy + headR*0.58);
      g.stroke();
    }
  }

  /* ---- NEAR arm + its prop: the gesture is the beat she is on ---- */
  {
    const sh = { x: sx + F*shw*0.86, y: shoY + s*0.038 };
    arm(pen, sh, m.nearHand, F, foldT, skinT, s, m.nearBend);
    if (m.nearProp === "palm"){
      pen.paint(()=>{ g.ellipse(m.nearHand.x, m.nearHand.y, s*0.046, s*0.028, F > 0 ? 0.5 : -0.5, 0, TAU); }, skinT, cw*0.65);
    } else {
      pen.paint(()=>{ g.arc(m.nearHand.x, m.nearHand.y, s*0.031, 0, TAU); }, skinT, cw*0.6);
    }
    if (m.nearProp === "torch") drawTorch(pen, m.nearHand, m.nearDir, s, m.lit);
  }
}

/* ============================================================
   THE THRESHOLD FRAGMENT — not a room. Their door back left, one pillar at
   the right as a foreground occluder, a BROKEN wall line, a light floor.
   Every span is cut; nothing runs the full width.
   ============================================================ */
function drawShell(pen, W, H){
  const g = pen.ctx;
  const hz = H*HORIZON;

  // the back wall: LOW masonry courses of near-equal height, broken into
  // separate lengths so nothing spans the plate. Light — the dark up here is
  // spent only on the openings.
  for (const [x0, w, hh, lv] of [[0.000,0.212,0.058,2],[0.238,0.146,0.050,1],[0.404,0.128,0.062,2],
                                 [0.556,0.150,0.048,1],[0.728,0.126,0.058,2],[0.876,0.124,0.046,1]])
    pen.paint(()=>{ g.rect(W*x0, hz - H*hh, W*w, H*hh); }, toneSolid(inkLevel(lv)), 3);
  // wall line in three segments with real gaps at the door and the pillar
  for (const [a, b] of [[0.000,0.208],[0.296,0.612],[0.716,1.000]])
    pen.ink(()=>{ g.moveTo(W*a, hz); g.lineTo(W*b, hz); }, 4);

  // three hall columns standing IN FRONT of the wall, running up out of the
  // plate. They are what makes this read as a hall and not a skyline: light
  // shafts, one dark capital each, and a narrow night slot between them.
  const colTop = H*0.226;
  for (const px of [0.276, 0.470, 0.664]){
    const bx = W*px, bw = W*0.036;
    pen.paint(()=>{ g.rect(bx - bw/2, colTop, bw, hz - colTop); }, toneSolid(inkLevel(1)), 4);
    pen.paint(()=>{ g.rect(bx - bw*0.92, colTop, bw*1.84, H*0.024); }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{ g.rect(bx - bw*0.84, hz - H*0.016, bw*1.68, H*0.016); }, toneSolid(inkLevel(4)), 3);
    pen.seam(()=>{ g.moveTo(bx - bw*0.22, colTop + H*0.036); g.lineTo(bx - bw*0.22, hz - H*0.024); }, 2);
  }
  // one shadowed bay behind the colonnade, sitting DOWN on the wall courses so
  // it reads as a room beyond and not as a block hanging in the air
  {
    const mx = W*0.373, mw = W*0.052, top = colTop + H*0.034;
    pen.paint(()=>{ g.rect(mx - mw/2, top, mw, (hz - H*0.050) - top); }, toneSolid(inkLevel(3)), 3);
  }

  // the door of the women's quarters — light inside a hard jamb, lamplight up
  {
    const dx = W*0.058, dw = W*0.104, dtop = hz - H*0.148;
    pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.148); }, toneSolid(inkLevel(0)), 4);
    pen.paint(()=>{ g.rect(dx + dw*0.66, dtop + H*0.012, dw*0.30, H*0.136); }, toneSolid(inkLevel(4)), 3); // the leaf, ajar
    pen.paint(()=>{ g.rect(dx - W*0.017, dtop - H*0.010, W*0.017, H*0.158); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(dx + dw, dtop - H*0.010, W*0.017, H*0.158); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(dx - W*0.024, dtop - H*0.021, dw + W*0.048, H*0.015); }, toneSolid(inkLevel(4)), 3);
    // three step bars coming down out of the doorway — they arrive by a stair
    for (let i = 0; i < 3; i++)
      pen.paint(()=>{ g.rect(dx - W*0.010*(i+1), hz + H*0.014*i, dw + W*0.020*(i+1), H*0.014); },
                toneSolid(inkLevel(i === 1 ? 2 : 3)), 3);
  }

  // floor: one light plane, with a faint receding grid. No dark wash anywhere.
  g.fillStyle = inkLevel(1); g.fillRect(0, hz, W, H - hz);
  g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.10;
  for (let i = -4; i <= 4; i++){ g.beginPath(); g.moveTo(W*0.50, hz); g.lineTo(W*0.5 + i*W*0.30, H); g.stroke(); }
  for (let j = 1; j <= 3; j++){
    const y = hz + (H - hz)*(j/3)*(j/3);
    g.beginPath(); g.moveTo(W*0.02, y); g.lineTo(W*0.46, y); g.stroke();       // broken at the centre,
    g.beginPath(); g.moveTo(W*0.56, y); g.lineTo(W*0.98, y); g.stroke();       // so it never stripes him
  }
  g.restore();
}

/* the pillar at the right edge — a FOREGROUND occluder drawn after the ring,
   so the woman on the near-right station passes behind it */
function drawPillar(pen, W, H){
  const g = pen.ctx;
  pen.paint(()=>{ g.rect(W*0.878, H*0.196, W*0.104, H*0.038); }, toneSolid(inkLevel(4)), 4); // capital
  pen.paint(()=>{ g.rect(W*0.898, H*0.234, W*0.064, H*0.700); }, toneSolid(inkLevel(2)), 4); // shaft
  pen.paint(()=>{ g.rect(W*0.884, H*0.934, W*0.092, H*0.034); }, toneSolid(inkLevel(4)), 3); // base
  pen.seam(()=>{ g.moveTo(W*0.945, H*0.256); g.lineTo(W*0.945, H*0.926); }, 2);
}

/* the FOCUS is drawn EMPTY: the floor he stands on, the height his hands are
   at, and the point above the knee they are all looking for. The man is cast
   separately at `focus:stand`. */
function drawFocusMark(pen, W, H){
  const g = pen.ctx;
  const fx = FOCUS.x*W, fy = FOCUS.y*H;
  g.save();
  g.fillStyle = "rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(fx, fy + H*0.006, W*0.052, H*0.014, 0, 0, TAU); g.fill();
  g.strokeStyle = INK; g.lineCap = "butt";
  g.globalAlpha = 0.70; g.lineWidth = 4;                    // stand cross
  g.beginPath(); g.moveTo(fx - W*0.026, fy); g.lineTo(fx + W*0.026, fy); g.stroke();
  g.beginPath(); g.moveTo(fx, fy - H*0.012); g.lineTo(fx, fy + H*0.012); g.stroke();
  // the SCAR point, bracketed — the thing they read him by
  const sx = SCAR.x*W, sy = SCAR.y*H;
  g.lineWidth = 4; g.globalAlpha = 0.85;
  g.beginPath();
  g.moveTo(sx - W*0.022, sy - H*0.014); g.lineTo(sx - W*0.030, sy - H*0.014);
  g.lineTo(sx - W*0.030, sy + H*0.014); g.lineTo(sx - W*0.022, sy + H*0.014);
  g.moveTo(sx + W*0.022, sy - H*0.014); g.lineTo(sx + W*0.030, sy - H*0.014);
  g.lineTo(sx + W*0.030, sy + H*0.014); g.lineTo(sx + W*0.022, sy + H*0.014);
  g.stroke();
  g.lineWidth = 5;
  g.beginPath(); g.moveTo(sx - W*0.012, sy - H*0.006); g.lineTo(sx + W*0.012, sy + H*0.006); g.stroke();
  g.restore();
}

/* ---------------- deterministic member build ---------------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const form   = p.formation || "converging";
  const N      = clamp(Math.round(p.count ?? 12), 3, 20);
  const density= clamp01(p.density);
  const attn   = clamp01(p.attention);
  const sigma  = Math.max(0.06, p.waveSpread ?? 0.30);
  const weepP  = clamp01(p.weeping);
  const torches= clamp(Math.round(p.torches ?? 5), 0, 12);
  const spread = clamp(p.spread ?? 1, 0.3, 2.0);
  const lag    = clamp(p.lag ?? 0.55, 0, 1.2);
  const seed   = (p.seed ?? params.seed) >>> 0;

  /* FORMATION only ever retunes the three spine scalars + the ring radius.
     There is no second layout path, so the group cannot come apart. */
  let approach = clamp01(p.approach ?? 0.72);
  let wave     = p.wave ?? 0.62;
  let radMul   = clamp(p.radius ?? 1, 0.7, 1.8);
  let kneelAll = 0, aisle = 0, dir = 1;
  if (form === "entering")        { approach = Math.min(approach, 0.18); wave = Math.min(wave, 0.10); }
  else if (form === "file")       { approach = Math.min(approach, 0.52); wave = Math.min(wave, 0.22); aisle = 1; }
  else if (form === "wary-arc")   { approach = 1; wave = Math.min(wave, 0.16); radMul *= 1.42; }
  else if (form === "embracing")  { approach = 1; wave = Math.max(wave, 1.05); }
  else if (form === "kneeling")   { approach = 1; wave = Math.max(wave, 1.05); kneelAll = 1; }
  else if (form === "withdrawing"){ dir = -1; approach = clamp01(1 - approach); wave = Math.max(wave, 1.05); }

  const torchEvery = torches > 0 ? Math.max(1, Math.round(N/torches)) : 1e9;
  // DENSITY thins from the DOOR end: the last women down are simply not here
  const nShown = Math.max(3, Math.round(N*(0.45 + 0.55*density)));

  const members = [], sightlines = [];
  for (let i = 0; i < N; i++){
    if (i >= nShown) continue;
    const rng = rnd((seed + i*211 + 17) >>> 0);
    const t   = N > 1 ? i/(N-1) : 0.5;
    const th  = stationTheta(i, N);

    // her own progress along her own path, staggered by arrival order
    const a = clamp01(approach*(1 + lag) - lag*t);
    const ea = smooth(a);
    // and how far the recognition wave has come through her
    const r = clamp01(smooth((wave - t)/sigma + 0.5));

    // nobody stands on the exact ellipse: each woman keeps her own small
    // stand-off, so two of them can never resolve to identical coordinates
    const ring = ringAt(th, radMul*(0.90 + 0.24*rng()));
    const jx = (rng() - 0.5)*0.052, jy = (rng() - 0.5)*0.018;
    const start = aisle
      ? { x: lerp(ENTRY.x, FOCUS.x - RING.rx*1.10, t*0.86), y: lerp(ENTRY.y, FOCUS.y - RING.ry*0.4, t*0.86) + jy }
      : { x: ENTRY.x + jx*spread, y: ENTRY.y + jy + (i % 3)*0.012 };

    // a bowed radial, fanned by SPREAD: front-arc women swing out through the
    // near floor, back-arc women pass behind. A straight line reads as a queue.
    const bow = Math.sin(Math.PI*ea)*0.098*spread*(Math.sin(th) >= 0 ? 1 : -0.42);
    const xn = lerp(start.x, ring.x, ea);
    const yn = clamp(lerp(start.y, ring.y, ea) + bow, 0.462, 0.952);
    const cx = clamp(xn, 0.050, 0.950)*W;
    const baseY = yn*H;
    const s = depthScale(yn);

    const arrived = a > 0.93;
    const back = Math.sin(th) < -0.10 && a > 0.55;
    const F = (FOCUS.x*W - cx) >= 0 ? 1 : -1;      // everybody turns inward

    /* the recognition ladder */
    let gesture;
    if (r < 0.28)                    gesture = (i % torchEvery === 0) ? "torch" : "wary";
    else if (r < 0.58)               gesture = "peer";
    else if (!arrived)               gesture = "reach";
    else if (kneelAll)               gesture = "kneel";
    else if (rng() < weepP*0.85)     gesture = "weep";
    else if (rng() < 0.34)           gesture = "kiss-hands";
    else if (rng() < 0.30)           gesture = "hands-up";
    else                             gesture = "embrace";
    if (dir < 0 && !arrived) gesture = "reach";

    const carries = (i % torchEvery === 0);
    const kneel = kneelAll ? 1 : (gesture === "kneel" ? 1 : 0);
    const weep  = (gesture === "weep") ? 1 : (r > 0.6 ? weepP*0.6 : 0);

    // ATTENTION: how far the head is turned onto him
    const att = clamp01(attn*(0.45 + 0.55*r));
    let headTurn = clamp((FOCUS.x*W - cx)/(W*0.30), -1, 1)*att;
    if (att < 0.15) headTurn = (rng() - 0.5)*0.8;

    /* ---- hand targets, computed in WORLD space so the ring really converges.
       Two bodies never resolve to the same point: each hand lands short of the
       focus by her own radius, so contact is contact, not co-location. ---- */
    const shoY = baseY - s*(0.690 - 0.230*kneel);
    const sh   = { x: cx + F*s*0.090, y: shoY + s*0.038 };
    const aim  = (P)=>{
      const tx = P.x*W, ty = P.y*H;
      const dx = tx - sh.x, dy = ty - sh.y, L = Math.hypot(dx, dy) || 1;
      const reach = Math.min(L*0.78, s*0.44);
      return { p:{ x: sh.x + dx/L*reach, y: sh.y + dy/L*reach }, d:{ x:dx/L, y:dy/L } };
    };
    const faceP = { x: cx + F*s*0.058, y: shoY - s*0.150 };

    let nearHand, nearBend = 0.24, nearProp = "fist", nearDir = { x:F, y:-0.4 };
    let farHand,  farBend  = 0.14, farProp  = "none", farDir  = { x:-F, y:-0.6 };

    switch (gesture){
      case "wary": {                                   // shawl gathered at the throat, weight back
        nearHand = { x: cx + F*s*0.030, y: shoY + s*0.090 }; nearBend = 0.30;
        farHand  = { x: cx - F*s*0.110, y: baseY - s*0.360 };
        break;
      }
      case "torch": {                                  // fire held high, body not committed
        const A = aim(HEADP);
        nearHand = { x: cx + F*s*0.150, y: shoY - s*0.090 }; nearBend = 0.20;
        nearProp = "torch"; nearDir = { x: F*0.42, y:-0.91 };
        farHand  = { x: cx - F*s*0.090, y: shoY + s*0.150 };
        void A;
        break;
      }
      case "peer": {                                   // torch thrust down at the scar; this is the beat
        const A = aim(SCAR);
        nearHand = A.p; nearBend = 0.16; nearDir = A.d;
        nearProp = carries ? "torch" : "palm";
        farHand  = { x: cx - F*s*0.060, y: shoY + s*0.110 }; farBend = 0.26;
        break;
      }
      case "reach": {                                  // walking in with the arms already out
        const A = aim(CHEST);
        nearHand = A.p; nearBend = 0.20; nearDir = A.d; nearProp = "palm";
        const B = aim({ x:CHEST.x, y:CHEST.y + 0.055 });
        farHand = { x: lerp(cx - F*s*0.040, B.p.x, 0.55), y: lerp(shoY + s*0.120, B.p.y, 0.55) };
        farBend = 0.20; farProp = carries ? "torch" : "none"; farDir = { x:-F*0.5, y:-0.87 };
        if (carries) { farHand = { x: cx - F*s*0.120, y: shoY + s*0.040 }; }
        break;
      }
      case "hands-up": {                               // both hands to her own face
        nearHand = { x: faceP.x, y: faceP.y + s*0.050 }; nearBend = 0.36;
        farHand  = { x: cx - F*s*0.020, y: shoY - s*0.110 }; farBend = 0.34;
        break;
      }
      case "weep": {                                   // one hand to the face, one on him
        const A = aim(CHEST);
        nearHand = A.p; nearBend = 0.24; nearDir = A.d; nearProp = "palm";
        farHand  = { x: cx - F*s*0.010, y: shoY - s*0.120 }; farBend = 0.34;
        break;
      }
      case "kiss-hands": {                             // taking his hands, head bowed over them
        const A = aim({ x:FOCUS.x, y:FOCUS.y - 0.070 });
        nearHand = A.p; nearBend = 0.12; nearDir = A.d;
        const B = aim({ x:FOCUS.x, y:FOCUS.y - 0.050 });
        farHand = { x: lerp(cx, B.p.x, 0.72), y: lerp(shoY + s*0.190, B.p.y, 0.72) }; farBend = 0.14;
        break;
      }
      case "kneel": {                                  // down at his knees, hands on them
        const A = aim({ x:FOCUS.x, y:FOCUS.y - 0.052 });
        nearHand = A.p; nearBend = 0.16; nearDir = A.d; nearProp = "palm";
        farHand  = { x: lerp(cx, FOCUS.x*W, 0.34), y: shoY + s*0.150 }; farBend = 0.18;
        break;
      }
      default: {                                       // embrace: head and shoulders
        const A = aim({ x:CHEST.x, y:CHEST.y - 0.020 });
        nearHand = A.p; nearBend = 0.18; nearDir = A.d;
        const B = aim({ x:CHEST.x, y:CHEST.y + 0.070 });
        farHand = { x: lerp(cx - F*s*0.030, B.p.x, 0.62), y: lerp(shoY + s*0.100, B.p.y, 0.62) }; farBend = 0.18;
        break;
      }
    }
    if (carries && nearProp !== "torch" && farProp !== "torch" && gesture !== "kneel"){
      farProp = "torch"; farHand = { x: cx - F*s*0.135, y: shoY + s*0.020 }; farDir = { x:-F*0.34, y:-0.94 };
    }

    /* the sight bundle: what she is reading him by. Wary heads are on the
       VOICE (his head); peering heads are on the SCAR. Two faint dashed
       bundles converging on two points — the whole recognition, diagrammed. */
    if (!back && a > 0.10){
      const eye = { x: cx + F*s*0.030, y: shoY - s*0.190 };
      if (gesture === "peer") sightlines.push({ from:eye, to:{ x:SCAR.x*W, y:SCAR.y*H }, w:0.30 });
      else if (r < 0.30)      sightlines.push({ from:eye, to:{ x:HEADP.x*W, y:HEADP.y*H }, w:0.16 });
    }

    members.push({
      cx, baseY, s, F, back, u:t,
      headTurn, gesture, kneel, weep,
      mouth: r > 0.58 ? 0.9 : (r > 0.28 ? 0.15 : -0.25),
      bow: (gesture === "kiss-hands" || gesture === "weep") ? 0.85 : (gesture === "kneel" ? 0.55 : 0.10),
      lean: r < 0.30 ? -0.55 : clamp(0.20 + r*0.55, 0, 1),   // wary leans AWAY, recognized leans in
      stride: arrived ? 0.10 : 0.30 + rng()*0.45,
      lit: true,
      nearHand, nearBend, nearProp, nearDir,
      farHand,  farBend,  farProp,  farDir,
      band: baseY/H < FOCUS.y - 0.030 ? 0 : (baseY/H < FOCUS.y + 0.030 ? 1 : 2),
      feat: {
        veil:     rng() < 0.55,
        overfold: rng() < 0.82,
        headS:    0.92 + rng()*0.17,
      },
      shade: {
        // LIGHT peploi, one mid overfold, dark girdle + dark hair. The ring
        // must read as a row of pale shapes with hard accents, never a mass.
        gown:  back ? 1 : Math.round(lerp(1.9, 2.9, clamp01((baseY/H - 0.50)/0.45))),
        fold:  back ? 3 : Math.round(lerp(3.4, 4.3, clamp01((baseY/H - 0.50)/0.45))),
        band:  back ? 4 : 5,
        skin:  2,
        hair:  back ? 5 : 6,
      },
    });
  }
  members.sort((a, b) => a.baseY - b.baseY);          // painter's order: back -> front
  return { members, sightlines, N, nShown, radMul, approach, dir,
           showShell:p.showShell, showField:p.showField, showFocus:p.showFocus };
}

/* ---------------- stage ---------------- */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const built = buildMembers(W, H, st);
  const layers = (st && st.layers) || asset.layers;
  const has = l => layers.includes(l);

  g.fillStyle = inkLevel(0); g.fillRect(0, 0, W, H);
  if (has("shell") && built.showShell !== false) drawShell(pen, W, H);

  /* THE CONVERGENCE FIELD, drawn as a diagram: the contact ellipse on the
     floor with one tick per station (a filled tick is a woman who is here, a
     hollow one is a woman still upstairs), and the faint radial tracks from
     the door. This is the ensemble's own spine made visible. */
  if (has("field") && built.showField !== false){
    g.save();
    g.strokeStyle = INK; g.lineCap = "butt";
    g.globalAlpha = 0.44; g.lineWidth = 3; g.setLineDash([7, 9]);
    g.beginPath();
    for (let k = 0; k <= 72; k++){
      const q = ringAt(k/72*TAU, built.radMul);
      k ? g.lineTo(q.x*W, q.y*H) : g.moveTo(q.x*W, q.y*H);
    }
    g.stroke();
    // four sampled radials from the door, so the approach reads as a field
    g.globalAlpha = 0.26;
    for (const i of [0, Math.floor(built.N*0.3), Math.floor(built.N*0.6), built.N-1]){
      const q = ringAt(stationTheta(i, built.N), built.radMul);
      g.beginPath(); g.moveTo(ENTRY.x*W, ENTRY.y*H);
      g.quadraticCurveTo(lerp(ENTRY.x, q.x, 0.55)*W, (lerp(ENTRY.y, q.y, 0.55) + 0.045)*H, q.x*W, q.y*H);
      g.stroke();
    }
    g.setLineDash([]);
    // the station register — geometry, never type: one bar per woman
    for (let i = 0; i < built.N; i++){
      const q = ringAt(stationTheta(i, built.N), built.radMul);
      const sS = depthScale(q.y), X = q.x*W, Y = q.y*H + sS*0.055;
      const len = sS*0.17, filled = i < built.nShown;
      g.globalAlpha = filled ? 0.62 : 0.26;
      g.lineWidth = filled ? 4 : 2;
      g.beginPath(); g.moveTo(X, Y); g.lineTo(X, Y + len); g.stroke();
      if (filled){ g.lineWidth = 3; g.beginPath(); g.moveTo(X - len*0.26, Y + len); g.lineTo(X + len*0.26, Y + len); g.stroke(); }
    }
    g.restore();
  }

  if (has("focus-mark") && built.showFocus !== false) drawFocusMark(pen, W, H);

  /* the sight bundles — what each face is reading. Faint, dashed, and
     converging on exactly two points: the voice and the scar. */
  if (has("sight")){
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.setLineDash([3, 7]);
    for (const L of built.sightlines){
      g.globalAlpha = L.w;
      g.beginPath(); g.moveTo(L.from.x, L.from.y); g.lineTo(L.to.x, L.to.y); g.stroke();
    }
    g.setLineDash([]); g.restore();
  }

  const bandLayer = ["band-back", "band-mid", "band-front"];
  for (const m of built.members){
    if (!has(bandLayer[Math.min(m.band, 2)])) continue;
    drawWoman(pen, m);
  }

  if (has("pillar")) drawPillar(pen, W, H);
}

export const asset = {
  id:"ensemble.loyal-maids",
  type:"ENSEMBLE",
  name:"Loyal maids",
  statusWord:"RECOGNIZING",
  scene:"OD-B22-S08",

  params,
  member:{ template:"house-woman", gestures:GESTURES, count:12,
           spine:"door -> radial -> contact ring", props:["torch"] },
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["shell","field","focus-mark","sight","band-back","band-mid","band-front","pillar"],

  // normalized 0..1. Every ring anchor is PROJECTED from ringAt(), never
  // hand-written, so a station cannot drift away from the woman standing on it.
  anchors:(()=>{
    const r3 = v => Math.round(v*1000)/1000;
    const a = {
      "door:womens-quarters":{ x:ENTRY.x, y:ENTRY.y },
      "focus:stand":{ x:FOCUS.x, y:FOCUS.y },
      "focus:chest":{ x:CHEST.x, y:CHEST.y },
      "focus:scar":{ x:SCAR.x,  y:SCAR.y },
      "focus:head":{ x:HEADP.x, y:HEADP.y },
      "aisle:mid":{ x:r3(lerp(ENTRY.x, FOCUS.x - RING.rx, 0.55)), y:r3(lerp(ENTRY.y, FOCUS.y, 0.55)) },
      "pillar:right":{ x:0.930, y:0.560 },
      "camera:wide":{ x:0.500, y:0.600 },
      "camera:ring":{ x:0.505, y:0.720 },
      "camera:door":{ x:0.185, y:0.500 },
    };
    for (let i = 0; i < 12; i++){
      const q = ringAt(stationTheta(i, 12), 1);
      a[`ring:${i+1}`] = { x:r3(q.x), y:r3(q.y) };
    }
    return a;
  })(),
  zones:{
    floor:{ x0:0.02, y0:0.42, x1:0.98, y1:0.98 },
    ring:{ x0:FOCUS.x - RING.rx, y0:FOCUS.y - RING.ry - 0.14, x1:FOCUS.x + RING.rx, y1:FOCUS.y + RING.ry + 0.06 },
    aisle:{ x0:0.09, y0:0.46, x1:0.30, y1:0.72 },
    "occlusion:pillar":{ x0:0.87, y0:0.18, x1:1.00, y1:1.00 },
  },
  channels:["formation","count","density","approach","attention","wave","waveSpread",
            "weeping","torches","spread","radius","lag"],

  states:{
    initial:"recognizing",
    nodes:{
      // OD-B22-S08 head: they come out of the door and will not come further
      "entering":   { preview:{ formation:"entering", approach:0.16, wave:0.04, attention:0.55, torches:5, weeping:0, status:"ENTERING" } },
      // coming down the aisle in a queue, torches up, nobody near him yet
      "coming-down":{ preview:{ formation:"file", approach:0.50, wave:0.10, attention:0.70, torches:6, weeping:0, status:"COMING DOWN" } },
      // stopped at a wide ring: they do not believe it
      "standing-off":{ preview:{ formation:"wary-arc", radius:1.0, wave:0.06, attention:0.95, torches:6, weeping:0, status:"NOT BELIEVING" } },
      // torches lowered onto the leg — the scar
      "the-scar":   { preview:{ formation:"wary-arc", radius:1.15, wave:0.55, waveSpread:0.22, attention:1.0, torches:8, weeping:0, status:"THE SCAR" } },
      // the wave through the middle of the group: arms starting up
      "recognizing":{ preview:{ formation:"converging", approach:0.72, wave:0.62, waveSpread:0.30, attention:0.85, torches:5, weeping:0.35, status:"RECOGNIZING" } },
      // the arc collapses: everybody moving in at once
      "converging": { preview:{ formation:"converging", approach:0.90, wave:0.95, waveSpread:0.34, attention:0.90, torches:3, weeping:0.45, status:"CONVERGING" } },
      // contact: head, hands, shoulders
      "embracing":  { preview:{ formation:"embracing", radius:0.86, attention:0.95, torches:2, weeping:0.55, status:"EMBRACING" } },
      // down at his knees
      "kneeling":   { preview:{ formation:"kneeling", radius:0.92, attention:1.0, torches:2, weeping:0.7, status:"AT HIS KNEES" } },
      // only the first few are down the stair yet
      "half-come":  { preview:{ formation:"converging", approach:0.68, density:0.30, wave:0.55, attention:0.85, torches:3, weeping:0.3, status:"SIX SO FAR" } },
      // sent back to their work
      "withdrawing":{ preview:{ formation:"withdrawing", approach:0.55, attention:0.35, torches:4, weeping:0.2, status:"WITHDRAWING" } },
    },
    edges:[
      ["entering","coming-down"],["coming-down","standing-off"],
      ["standing-off","the-scar"],["the-scar","recognizing"],
      ["recognizing","converging"],["converging","embracing"],
      ["embracing","kneeling"],["kneeling","embracing"],
      ["embracing","withdrawing"],["withdrawing","entering"],
      ["coming-down","half-come"],["half-come","recognizing"],
      ["standing-off","recognizing"],["recognizing","embracing"],
    ],
  },

  // neutral preview = the reason the asset exists: the wave mid-group. Two
  // still wary at the door, torches down on the scar in the middle, the front
  // of the ring already on him.
  preview:()=>({ formation:"converging", count:12, density:1.0, approach:0.72,
                 attention:0.85, wave:0.62, waveSpread:0.30, weeping:0.35,
                 torches:5, spread:1.0, radius:1.0, lag:0.55,
                 status:"RECOGNIZING", progress:0.62 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
