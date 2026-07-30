/* ensemble.disloyal-maids — the twelve women of the house who go out at night.
   Book XX opens with Odysseus lying awake on an undressed ox-hide in the
   forecourt, counting the maids as they slip from the women's quarters and
   go laughing down the portico to the suitors' beds. He counts twelve. The
   count is the asset: this is a group whose *number* is plot, and whose whole
   performance is a walk past a man they believe asleep.

   ENSEMBLE. ONE separable member template (a serving-woman: long gown, girdle,
   shawl, bound hair, bare feet) instanced N times deterministically along a
   single named ROUTE that runs from the door of the women's quarters, back
   left, down and across the portico to the hall threshold, front right. The
   route is drawn as a dotted track with one tick per member slot, so the
   twelve are countable even when DENSITY has thinned them — the empty
   stations are the ones he has not counted yet.

   Exposed ENSEMBLE controls:
     FORMATION  file | spill | pairs | cluster | freeze | (dir:-1 = returning)
     DENSITY    thins from the FAR end of the route (background first)
     COUNT      how many members the route carries (12 by default)
     ATTENTION  how hard every head turns onto the hide in the forecourt
     WAVE +     the reaction wave: the suspicion that the beggar is awake,
     WAVESPREAD travelling along the route — heads snap back, laughter dies,
                lifted hems drop, the file goes still
     MIRTH      0 silent .. 1 open laughing
     STEALTH    0 upright .. 1 crouched, hems up, on the balls of the feet
     SPREAD     lateral width of the file about the route
     depth      FOREGROUND (right, large) / BACKGROUND (left, small) via the
                route's own scale ramp + per-band tone grading

   No named woman is baked in: Melantho is placed by the scene at
   `head:file` or `station:*`. The forecourt hide is drawn EMPTY — the man on
   it is cast separately as character.odysseus-b16 at `focus:hide`.
   Solid grays + hard contour only; the engine dotify POST pass supplies the
   halftone. Atlas OD-B20-S01 — women quietly leaving the sleeping quarters
   toward illicit meetings. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);

/* the separable gesture set of the member template — each is one arm+prop
   configuration. The crowd's guilt is legible from gestures alone. */
export const GESTURES = ["slip","hush","glance","lamp","laugh","beckon","still"];

const params = {
  formation:"file",      // file | spill | pairs | cluster | freeze
  count:12,              // the number that matters
  density:1.0,           // 0 = only the near end of the route .. 1 = all twelve
  attention:0.40,        // 0 = heads front .. 1 = every head on the hide
  wave:1.6,              // >1 parks the reaction wave off the route (no wave)
  waveSpread:0.16,       // width of the band of freshly-alarmed women
  mirth:0.55,            // 0 = silent .. 1 = open laughing
  stealth:0.60,          // 0 = upright .. 1 = crouched, hem up, tiptoe
  spread:1.0,            // lateral width of the file about the route
  dir:1,                 // +1 outbound to the suitors .. -1 returning at dawn
  lamps:3,               // how many carry a shielded lamp
  focus:{ x:0.265, y:0.855 },   // the hide in the forecourt
  showPortico:true,
  showHide:true,
  showRoute:true,
  seed:2001,
};

/* ---------------- THE ROUTE ----------------
   u = 0 at the door of the women's quarters (back left, small) .. u = 1 at the
   hall threshold (front right, large). Everything — position, scale, band,
   the reaction wave and the count register — is parameterized on u, so the
   ensemble has exactly one spine and cannot drift. */
const ROUTE = { x0:0.100, x1:0.905, y0:0.500, y1:0.852, bow:0.048, sBack:80, sFront:132 };
/* Twelve bodies on one diagonal will occlude each other into a smear unless
   the members are small enough that the along-route step exceeds a hem, and
   unless consecutive women stand on DIFFERENT floor lines. LANE is that
   alternating depth step (with scale following it, so a lane forward really
   is a lane nearer) — a walking file staggers; it does not queue. */
const LANE = { x:0.000, y:0.021 };
function routeEase(u){ return 0.58*u + 0.42*u*u; }
function routeAt(u){
  u = clamp01(u);
  const e = routeEase(u);
  return {
    x: lerp(ROUTE.x0, ROUTE.x1, u) - Math.sin(u*Math.PI)*ROUTE.bow,
    y: lerp(ROUTE.y0, ROUTE.y1, e),
    s: lerp(ROUTE.sBack, ROUTE.sFront, e),
    e,
  };
}
const HORIZON = 0.430;

/* ============================================================
   ONE MEMBER — a serving-woman of the house.
   m = { cx, baseY, s, F, headTurn, shade, feat, gesture, mirth, stealth,
         lean, hemLift, stride, band, u }
   All geometry keys off s (member height), so the same template serves the
   96px far end and the 172px near end of the route.
   ============================================================ */
function arm(pen, sh, hand, F, sleeve, skin, s, bend){
  const g = pen.ctx;
  const dx = hand.x - sh.x, dy = hand.y - sh.y;
  const L = Math.hypot(dx, dy) || 1;
  const el = { x:(sh.x+hand.x)/2 + (-dy/L)*L*bend*F,
               y:(sh.y+hand.y)/2 + ( dx/L)*L*bend*F };
  pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); }, sleeve, s*0.046);
  pen.limb(()=>{ g.moveTo(el.x, el.y); g.lineTo(hand.x, hand.y); }, skin, s*0.036);
  return el;
}

function drawMaid(pen, m){
  const g   = pen.ctx;
  const s   = m.s, cx = m.cx, baseY = m.baseY, F = m.F, feat = m.feat;
  const cw  = Math.max(2, s*0.017);
  const gown  = toneSolid(inkLevel(m.shade.gown));
  const gown2 = toneSolid(inkLevel(m.shade.gown + 1));
  const shawl = toneSolid(inkLevel(m.shade.shawl));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const hair  = toneSolid(inkLevel(m.shade.hair));

  const lean   = m.lean * s * 0.055 * F;
  const hipY   = baseY - s*0.395;
  const shoY   = baseY - s*0.680;
  const sx     = cx + lean;
  const shw    = s*0.108, hemw = s*0.170;
  const hemY   = baseY - s*0.006;
  const widthAt = y => lerp(shw, hemw, clamp01((y - shoY)/((hemY - shoY) || 1)));
  const headR  = s*0.086*feat.headS;
  const headCy = shoY - headR*1.28 + m.stealth*s*0.010;
  const hx     = sx + m.headTurn*headR*0.30 + lean*0.35;

  /* ground shadow — keeps her planted on the portico floor */
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, baseY + s*0.012, hemw*1.02, s*0.023, 0, 0, 7); g.fill();

  /* ---- bare legs + feet, seen under the hem she has pinched up ---- */
  const st  = m.stride;
  const fFr = { x: cx + F*s*0.052*(0.45 + Math.abs(st)), y: baseY };
  const fBk = { x: cx - F*s*0.058*(0.45 + Math.abs(st)), y: baseY - s*0.008 };
  pen.limb(()=>{ g.moveTo(cx - F*s*0.022, hipY); g.lineTo(fBk.x, fBk.y - s*0.014); }, skin, s*0.050);
  pen.limb(()=>{ g.moveTo(cx + F*s*0.022, hipY); g.lineTo(fFr.x, fFr.y - s*0.014); }, skin, s*0.054);
  pen.paint(()=>{ g.ellipse(fBk.x, fBk.y, s*0.046, s*0.019, 0, 0, 7); }, skin, cw*0.7);
  pen.paint(()=>{ g.ellipse(fFr.x, fFr.y, s*0.048, s*0.020, 0, 0, 7); }, skin, cw*0.7);

  /* ---- FAR arm, behind the gown ---- */
  {
    const sh = { x: sx - F*shw*0.84, y: shoY + s*0.036 };
    const hand = (m.gesture === "glance" || m.gesture === "hush")
      ? { x: sx - F*shw*0.42, y: shoY + s*0.11 }          // gathering the shawl at the throat
      : { x: sx - F*shw*1.00, y: hipY + s*0.02 };
    arm(pen, sh, hand, -F, gown2, skin, s, 0.10);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.026, 0, 7); }, skin, cw*0.6);
  }

  /* ---- the gown: shoulders to a flared ankle hem, the NEAR corner pinched
     up for silent walking. The lift is the tell — a woman crossing her own
     master's forecourt with her skirt in her fist. ---- */
  const hemNear = hemY - m.hemLift * s*0.26;
  const yR = F > 0 ? hemNear : hemY;
  const yL = F > 0 ? hemY : hemNear;
  pen.paint(()=>{
    g.moveTo(sx - shw, shoY);
    g.lineTo(sx + shw, shoY);
    g.lineTo(cx + hemw, yR);
    g.lineTo(cx - hemw, yL);
    g.closePath();
  }, gown, cw);
  pen.seam(()=>{ g.moveTo(sx - shw*0.36, shoY + s*0.07); g.lineTo(cx - hemw*0.44, lerp(yL, yR, 0.28)); }, cw*0.55);
  pen.seam(()=>{ g.moveTo(sx + shw*0.36, shoY + s*0.07); g.lineTo(cx + hemw*0.44, lerp(yL, yR, 0.72)); }, cw*0.55);

  /* girdle — one dark accent across a light plane */
  const waistY = shoY + (hipY - shoY)*0.66;
  const ww = widthAt(waistY)*0.99;
  pen.paint(()=>{ g.rect(sx - ww, waistY, ww*2, s*0.028); }, shawl, cw*0.7);

  /* shawl thrown from the far shoulder across to the near hip */
  if (feat.shawl){
    const hw = widthAt(hipY);
    pen.paint(()=>{
      g.moveTo(sx - F*shw*0.96, shoY - s*0.005);
      g.lineTo(sx - F*shw*0.16, shoY - s*0.005);
      g.lineTo(cx + F*hw*0.88, hipY + s*0.012);
      g.lineTo(cx + F*hw*0.16, hipY + s*0.026);
      g.closePath();
    }, shawl, cw*0.8);
  }

  /* ---- neck, hair, face ---- */
  pen.paint(()=>{ g.rect(sx - headR*0.26, shoY - headR*0.66, headR*0.52, headR*0.92); }, skin, cw*0.75);
  pen.paint(()=>{ g.ellipse(hx - F*headR*0.10, headCy + headR*0.15, headR*1.10, headR*1.22, 0, 0, 7); }, hair, cw*0.9);
  pen.paint(()=>{ g.arc(hx - F*headR*0.94, headCy + headR*0.22, headR*0.33, 0, 7); }, hair, cw*0.7);  // bound bun
  pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.86, headR, 0, 0, 7); }, skin, cw);
  if (feat.veil){          // a head-cloth pulled over the crown
    pen.paint(()=>{
      g.moveTo(hx - headR*1.04, headCy + headR*0.24);
      g.quadraticCurveTo(hx, headCy - headR*1.52, hx + headR*1.04, headCy + headR*0.24);
      g.lineTo(hx + headR*0.70, headCy + headR*0.30);
      g.quadraticCurveTo(hx, headCy - headR*0.92, hx - headR*0.70, headCy + headR*0.30);
      g.closePath();
    }, gown2, cw*0.7);
  }

  const eyeY = headCy - headR*0.03;
  const gx   = m.headTurn*headR*0.30;
  const eyeR = headR*0.13;
  g.fillStyle = INK;
  if (m.headTurn > -0.62){ g.beginPath(); g.ellipse(hx + headR*0.31 + gx, eyeY, eyeR, eyeR*1.05, 0, 0, 7); g.fill(); }
  if (m.headTurn <  0.62){ g.beginPath(); g.ellipse(hx - headR*0.31 + gx, eyeY, eyeR, eyeR*1.05, 0, 0, 7); g.fill(); }
  g.strokeStyle = INK; g.lineCap = "round";
  g.lineWidth = Math.max(2, headR*0.12);
  g.beginPath();                                       // nose, pointing the way she faces
  g.moveTo(hx + gx*0.6, eyeY + headR*0.12);
  g.lineTo(hx + m.headTurn*headR*0.40 + F*headR*0.12, eyeY + headR*0.42);
  g.stroke();
  if (m.mirth > 0.58 && m.gesture !== "still"){        // an open laugh
    pen.paint(()=>{ g.ellipse(hx + gx*0.7, headCy + headR*0.58, headR*0.21, headR*0.27, 0, 0, 7); },
              toneSolid(inkLevel(7)), cw*0.55);
  } else {
    g.lineWidth = Math.max(2, headR*0.11);
    g.beginPath();
    g.moveTo(hx - headR*0.20 + gx, headCy + headR*0.56);
    g.quadraticCurveTo(hx + gx, headCy + headR*0.56 - m.mirth*headR*0.20,
                       hx + headR*0.20 + gx, headCy + headR*0.56);
    g.stroke();
  }

  /* ---- NEAR arm + its prop: the gesture is what she is doing wrong ---- */
  const shN = { x: sx + F*shw*0.86, y: shoY + s*0.036 };
  let hand, bend = 0.22, prop = "fist";
  switch (m.gesture){
    case "hush":                                        // finger to the lips
      hand = { x: hx + F*headR*0.42, y: headCy + headR*0.86 }; bend = 0.34; prop = "finger"; break;
    case "lamp":                                        // a shielded lamp carried low
      hand = { x: sx + F*(shw + s*0.105), y: shoY + s*0.185 }; bend = 0.18; prop = "lamp"; break;
    case "laugh":                                       // hand to the mouth, stifling it
      hand = { x: hx + F*headR*0.62, y: headCy + headR*1.00 }; bend = 0.30; prop = "fist"; break;
    case "beckon":                                      // calling the next one on
      hand = { x: sx + F*(shw + s*0.175), y: shoY + s*0.015 }; bend = 0.24; prop = "palm"; break;
    case "glance":                                      // hem in the fist, head thrown back
      hand = { x: cx + F*hemw*0.62, y: hemNear + s*0.015 }; bend = 0.26; prop = "hem"; break;
    case "still":                                       // caught: arms dead at the sides
      hand = { x: sx + F*shw*0.90, y: hipY + s*0.055 }; bend = 0.08; prop = "fist"; break;
    default:                                            // slip: the hem pinched up
      hand = { x: cx + F*hemw*0.68, y: hemNear + s*0.025 }; bend = 0.24; prop = "hem";
  }
  arm(pen, shN, hand, F, gown2, skin, s, bend);

  if (prop === "hem" && m.hemLift > 0.12){
    pen.paint(()=>{
      g.moveTo(hand.x, hand.y);
      g.lineTo(cx + F*hemw, hemNear + s*0.02);
      g.lineTo(cx + F*hemw*0.34, hemNear + s*0.10);
      g.closePath();
    }, gown2, cw*0.7);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.030, 0, 7); }, skin, cw*0.6);
  } else if (prop === "finger"){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.030, 0, 7); }, skin, cw*0.6);
    pen.ink(()=>{ g.moveTo(hand.x, hand.y - s*0.012); g.lineTo(hand.x + F*headR*0.10, headCy + headR*0.50); }, cw*1.0);
  } else if (prop === "palm"){
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.048, s*0.028, F > 0 ? 0.45 : -0.45, 0, 7); }, skin, cw*0.65);
  } else if (prop === "lamp"){
    const lx = hand.x + F*s*0.028, ly = hand.y + s*0.010;
    pen.paint(()=>{                                     // the little clay lamp
      g.moveTo(lx - s*0.042, ly - s*0.014);
      g.lineTo(lx + s*0.042, ly - s*0.014);
      g.lineTo(lx + s*0.026, ly + s*0.026);
      g.lineTo(lx - s*0.026, ly + s*0.026);
      g.closePath();
    }, toneSolid(inkLevel(5)), cw*0.7);
    pen.ink(()=>{                                       // three flame ticks
      for (let k = -1; k <= 1; k++){
        g.moveTo(lx + k*s*0.020, ly - s*0.018);
        g.lineTo(lx + k*s*0.030, ly - s*0.018 - s*0.052);
      }
    }, cw*0.8);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.030, 0, 7); }, skin, cw*0.6);
  } else {
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.032, 0, 7); }, skin, cw*0.65);
  }
}

/* ============================================================
   THE PORTICO — the night shell the route runs through. Kept LIGHT: paper
   floor, a segmented wall band (never one bar across the frame), four
   columns that stop at the horizon so they can never stripe the file, and
   the dark held to narrow verticals — the doorways and the gaps between
   columns, which is where night actually is.
   ============================================================ */
function drawPortico(pen, W, H){
  const g = pen.ctx;
  const hz = H*HORIZON;

  // the court beyond the colonnade — one light plane, and nothing above it
  g.fillStyle = inkLevel(1); g.fillRect(0, H*0.185, W, hz - H*0.185);

  // back wall as blocks of DIFFERENT heights — a broken skyline, never one
  // terrace across the plate. The tall blocks are the ones with openings in.
  for (const [x0, w, hh] of [[0.018,0.220,0.168],[0.300,0.112,0.058],[0.442,0.130,0.082],
                             [0.635,0.172,0.132],[0.836,0.164,0.064]])
    pen.paint(()=>{ g.rect(W*x0, hz - H*hh, W*w, H*hh); }, toneSolid(inkLevel(3)), 3);
  pen.ink(()=>{ g.moveTo(0, hz); g.lineTo(W, hz); }, 4);

  // four columns of the portico, standing on the wall line. They stop at the
  // horizon so they can never stripe the file walking in front of them.
  const colTop = H*0.238;
  for (const px of [0.290, 0.468, 0.646, 0.840]){
    const bx = W*px, bw = W*0.032;
    // the columns stand in FRONT of the wall, so they take the moonlight and
    // run one level lighter than it — depth by tone, not by outline alone
    pen.paint(()=>{ g.rect(bx - bw/2, colTop, bw, hz - colTop); }, toneSolid(inkLevel(1)), 4);
    pen.paint(()=>{ g.rect(bx - bw*0.88, colTop, bw*1.76, H*0.022); }, toneSolid(inkLevel(4)), 4); // capital
    pen.paint(()=>{ g.rect(bx - bw*0.80, hz - H*0.014, bw*1.60, H*0.014); }, toneSolid(inkLevel(4)), 3); // base
    pen.seam(()=>{ g.moveTo(bx - bw*0.20, colTop + H*0.032); g.lineTo(bx - bw*0.20, hz - H*0.022); }, 2);
  }
  // the darkness between the columns — night held to three narrow verticals
  // that stop well short of the wall line, never a wash across the plate
  for (const [a, b] of [[0.290,0.468],[0.468,0.646],[0.646,0.840]]){
    const mx = W*(a + b)/2, mw = W*(b - a)*0.30;
    pen.paint(()=>{ g.rect(mx - mw/2, colTop + H*0.036, mw, H*0.096); }, toneSolid(inkLevel(5)), 3);
  }

  // the door of the WOMEN'S QUARTERS, back left — where the route begins.
  // Lamplight is behind it, so the opening is LIGHT inside a hard jamb.
  {
    const dx = W*0.088, dw = W*0.084, dtop = hz - H*0.140;
    pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.140); }, toneSolid(inkLevel(1)), 4);
    pen.paint(()=>{ g.rect(dx + dw*0.62, dtop + H*0.014, dw*0.30, H*0.126); }, toneSolid(inkLevel(4)), 3); // the leaf, ajar
    pen.paint(()=>{ g.rect(dx - W*0.015, dtop - H*0.010, W*0.015, H*0.150); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(dx + dw, dtop - H*0.010, W*0.015, H*0.150); }, toneSolid(inkLevel(3)), 3);
    pen.paint(()=>{ g.rect(dx - W*0.021, dtop - H*0.020, dw + W*0.042, H*0.014); }, toneSolid(inkLevel(4)), 3);
  }

  // the stair to the UPPER CHAMBER, back right — a slot with three step bars,
  // set clear of the columns on either side
  {
    const sx = W*0.700, sw = W*0.090, stop = hz - H*0.124;
    pen.paint(()=>{ g.rect(sx, stop, sw, H*0.124); }, toneSolid(inkLevel(1)), 4);
    // four treads climbing out of frame — a staircase profile, not a cabinet
    pen.paint(()=>{
      g.moveTo(sx, hz);
      g.lineTo(sx, hz - H*0.026);
      for (let k = 0; k < 4; k++){
        g.lineTo(sx + sw*(k + 1)/4, hz - H*0.026 - k*H*0.024);
        g.lineTo(sx + sw*(k + 1)/4, hz - H*0.026 - (k + 1)*H*0.024);
      }
      g.lineTo(sx + sw, hz);
      g.closePath();
    }, toneSolid(inkLevel(4)), 3);
  }

  // portico floor: a faint toned paving, with the WEDGE OF LAMPLIGHT from the
  // open door cut back out of it to bare paper. Night is the tone; the spill
  // is the absence of it — no dark wash anywhere.
  g.fillStyle = inkLevel(1); g.fillRect(0, hz, W, H - hz);
  g.save();
  g.fillStyle = inkLevel(0);
  g.beginPath();
  g.moveTo(W*0.094, hz); g.lineTo(W*0.170, hz);
  g.lineTo(W*0.470, H*0.995); g.lineTo(W*(-0.06), H*0.995);
  g.closePath(); g.fill();
  g.globalAlpha = 0.30; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.moveTo(W*0.094, hz); g.lineTo(W*(-0.06), H*0.995); g.stroke();
  g.beginPath(); g.moveTo(W*0.170, hz); g.lineTo(W*0.470, H*0.995); g.stroke();
  g.restore();

  // a faint receding grid over the paving
  g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.11;
  for (let i = -4; i <= 4; i++){ g.beginPath(); g.moveTo(W*0.46, hz); g.lineTo(W*0.5 + i*W*0.27, H); g.stroke(); }
  for (let j = 1; j <= 3; j++){ const y = hz + (H - hz)*(j/3)*(j/3); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.restore();
}

/* the threshold pier at the right edge — a FOREGROUND occluder drawn after
   the file, so the leading woman passes behind it out of the frame */
function drawPier(pen, W, H){
  const g = pen.ctx;
  // the jamb + head of the hall doorway, running off the right edge: a
  // FOREGROUND occluder, so the leading woman passes behind it out of frame
  pen.paint(()=>{ g.rect(W*0.845, H*0.452, W*0.155, H*0.042); }, toneSolid(inkLevel(4)), 4); // lintel
  pen.paint(()=>{ g.rect(W*0.902, H*0.494, W*0.056, H*0.470); }, toneSolid(inkLevel(3)), 4); // jamb
  pen.paint(()=>{ g.rect(W*0.888, H*0.940, W*0.086, H*0.032); }, toneSolid(inkLevel(4)), 3); // threshold block
  pen.seam(()=>{ g.moveTo(W*0.918, H*0.512); g.lineTo(W*0.918, H*0.932); }, 2);
}

/* the EMPTY hide in the forecourt: an undressed ox-hide, a heap of fleeces,
   a folded cloak. The man on it is cast separately — nothing is baked in. */
function drawHide(pen, W, H){
  const g = pen.ctx;
  const cx = W*0.245, top = H*0.848, w = W*0.250, h = H*0.066;
  // the four splayed leg-tabs of an undressed hide — squared off, so the shape
  // reads as a skin laid on paving and not as a boat
  for (const [ox, oy, sgn] of [[-0.41,-0.02,-1],[0.41,-0.04,1],[-0.38,0.84,-1],[0.39,0.82,1]])
    pen.paint(()=>{
      const bx = cx + w*ox, by = top + h*oy;
      g.moveTo(bx, by); g.lineTo(bx + sgn*w*0.13, by - h*0.16);
      g.lineTo(bx + sgn*w*0.15, by + h*0.16); g.lineTo(bx, by + h*0.26); g.closePath();
    }, toneSolid(inkLevel(2)), 3);
  pen.paint(()=>{                                   // the hide itself, flat on the paving
    g.moveTo(cx - w*0.46, top + h*0.30);
    g.quadraticCurveTo(cx - w*0.30, top + h*0.02, cx + w*0.04, top + h*0.06);
    g.quadraticCurveTo(cx + w*0.34, top + h*0.02, cx + w*0.46, top + h*0.32);
    g.quadraticCurveTo(cx + w*0.32, top + h*0.86, cx + w*0.02, top + h*0.82);
    g.quadraticCurveTo(cx - w*0.30, top + h*0.88, cx - w*0.46, top + h*0.30);
    g.closePath();
  }, toneSolid(inkLevel(2)), 4);
  // fleeces heaped at the head end — light, contoured, plainly nobody on them
  for (const [ox, oy, r] of [[-0.30, 0.30, 0.115],[-0.16, 0.22, 0.092]])
    pen.paint(()=>{ g.ellipse(cx + w*ox, top + h*oy + h*0.14, w*r, h*0.26, 0, 0, 7); },
              toneSolid(inkLevel(0)), 3);
  // the folded cloak — the one dark accent on the bed he is not asleep in
  pen.paint(()=>{ g.rect(cx + w*0.10, top + h*0.34, w*0.27, h*0.32); }, toneSolid(inkLevel(4)), 3);
  pen.seam(()=>{ g.moveTo(cx + w*0.12, top + h*0.50); g.lineTo(cx + w*0.35, top + h*0.50); }, 2);
}

/* ---------------- deterministic member build ---------------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st, focus:{ ...params.focus, ...((st && st.focus) || {}) } };
  const formation = p.formation || "file";
  const N       = clamp(Math.round(p.count ?? 12), 2, 18);
  const density = clamp01(p.density);
  const attention = clamp01(p.attention);
  const wave    = p.wave ?? 1.6;
  const sigma   = Math.max(0.05, p.waveSpread ?? 0.16);
  const mirth   = clamp01(p.mirth);
  const stealth = clamp01(p.stealth);
  const spread  = clamp(p.spread ?? 1, 0.4, 1.8);
  const dir     = (p.dir ?? 1) >= 0 ? 1 : -1;
  const lamps   = clamp(Math.round(p.lamps ?? 3), 0, 6);
  const seed    = (p.seed ?? params.seed) >>> 0;
  const aimX    = p.focus.x*W;
  const lampEvery = lamps > 0 ? Math.max(2, Math.round(N/lamps)) : 1e9;

  // DENSITY thins from the FAR end first: the background of the file empties
  const nShown = Math.max(2, Math.round(N*(0.40 + 0.60*density)));
  const iFrom  = N - nShown;

  const members = [];
  for (let i = 0; i < N; i++){
    if (i < iFrom) continue;
    const rng = rnd((seed + i*167 + 41) >>> 0);
    const t = N > 1 ? i/(N-1) : 0.5;
    const lane = (i % 2) ? 1 : -1;               // which side of the spine
    let u, lat = 0, latY = 0, pairLean = 0;

    if (formation === "spill"){                  // still crowding out of the door
      u = 0.015 + 0.44*Math.pow(t, 0.72);
      lat = lane*LANE.x + (rng() - 0.5)*0.070;
      latY = lane*LANE.y*1.6 + (rng() - 0.5)*0.020;
    } else if (formation === "pairs"){           // paired off, whispering
      const P = Math.ceil(N/2), pr = Math.floor(i/2);
      u = lerp(0.08, 0.92, P > 1 ? pr/(P-1) : 0.5) + lane*0.020;
      lat = lane*LANE.x*1.4; latY = lane*LANE.y*1.5; pairLean = -lane;
    } else if (formation === "cluster"){         // a knot halfway, waiting
      u = 0.34 + 0.28*t;
      lat = (t - 0.5)*0.30; latY = lane*LANE.y*1.7 + (rng() - 0.5)*0.018;
    } else {                                     // file | freeze — a staggered walk
      u = lerp(0.04, 0.96, t);
      lat = lane*LANE.x + (rng() - 0.5)*0.010;
      latY = lane*LANE.y + (rng() - 0.5)*0.006;
    }

    const q  = routeAt(u);
    const cx = clamp(q.x + lat*spread, 0.055, 0.945)*W;
    const baseY = clamp(q.y + latY, 0.462, 0.955)*H;
    const s  = q.s*(1 + latY*2.2);               // a lane forward is a lane nearer

    // the REACTION WAVE: the suspicion that the man on the hide is awake,
    // travelling along the route. Where it has passed, the file goes still.
    const d    = u - wave;
    const hit  = clamp01(Math.exp(-(d*d)/(2*sigma*sigma)));
    const caught = formation === "freeze" || hit > 0.42;

    const mirthM   = clamp01(mirth*(1 - hit*1.15)*(0.65 + rng()*0.45));
    const stealthM = clamp01(stealth + hit*0.55);

    // ATTENTION: how hard this head is turned onto the hide
    const att = clamp01(attention + hit*0.85);
    let headTurn = clamp((aimX - cx)/(W*0.32), -1, 1)*att;
    if (att < 0.18) headTurn = (rng() - 0.5)*0.9;
    headTurn = clamp(headTurn + pairLean*0.45, -1, 1);

    let gesture;
    if (caught)                      gesture = "still";
    else if (i % lampEvery === 0)    gesture = "lamp";
    else if (formation === "cluster")gesture = rng() < 0.45 ? "hush" : (rng() < 0.5 ? "laugh" : "beckon");
    else if (formation === "spill")  gesture = rng() < 0.42 ? "beckon" : (rng() < 0.5 ? "laugh" : "slip");
    else if (formation === "pairs")  gesture = (i % 2) ? "hush" : "laugh";
    else                             gesture = rng() < 0.26 ? "glance" : (rng() < 0.34 ? "hush" : "slip");
    if (mirthM > 0.62 && gesture === "slip" && rng() < 0.5) gesture = "laugh";

    const hemLift = gesture === "still" ? 0.03 : clamp01(0.45 + stealthM*0.40)*(0.75 + rng()*0.35);
    const stride  = gesture === "still" ? 0.06 : 0.35 + rng()*0.55;

    members.push({
      cx, baseY, s, u, F: dir,
      headTurn, gesture, stride, hemLift,
      mirth: mirthM, stealth: stealthM,
      lean: caught ? 0.05 : clamp01(stealthM*0.75),
      band: u < 0.34 ? 0 : (u < 0.67 ? 1 : 2),
      feat: {
        veil:   rng() < 0.42,
        shawl:  rng() < 0.72,
        headS:  0.92 + rng()*0.18,
      },
      shade: {
        // LIGHT gowns, dark hair and a dark girdle/shawl: the file reads as a
        // row of pale shapes with hard accents, never as a black mass
        gown:  Math.round(lerp(1.7, 2.8, q.e)),
        shawl: Math.round(lerp(4, 5, q.e)),
        skin:  2,
        hair:  6,
      },
    });
  }
  members.sort((a, b) => a.baseY - b.baseY);        // painter's order: back -> front
  return { members, N, iFrom, showPortico:p.showPortico, showHide:p.showHide, showRoute:p.showRoute };
}

/* ---------------- stage ---------------- */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const built = buildMembers(W, H, st);
  const layers = (st && st.layers) || asset.layers;
  const has = l => layers.includes(l);

  g.fillStyle = inkLevel(0); g.fillRect(0, 0, W, H);
  if (has("portico") && built.showPortico !== false) drawPortico(pen, W, H);

  // the ROUTE as a diagram: a dotted track with one tick per member slot.
  // The ticks are the COUNT REGISTER — twelve stations, countable, and the
  // empty ones are exactly the women density has not sent out yet.
  if (has("route") && built.showRoute !== false){
    g.save();
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.40;
    g.setLineDash([6, 8]);
    g.beginPath();
    for (let k = 0; k <= 56; k++){ const q = routeAt(k/56); const X = q.x*W, Y = q.y*H; k ? g.lineTo(X, Y) : g.moveTo(X, Y); }
    g.stroke();
    g.setLineDash([]);
    // THE COUNT REGISTER: one tick per slot, dropped BELOW the footline so the
    // women never cover it. A filled tick is a woman he has counted; a hollow
    // one is a slot density has not sent out. Twelve marks, countable as
    // geometry — never as type, which the dot lattice would eat.
    g.lineCap = "butt";
    for (let i = 0; i < built.N; i++){
      const u = lerp(0.04, 0.96, built.N > 1 ? i/(built.N-1) : 0.5);
      const q = routeAt(u), X = q.x*W, Y = q.y*H + q.s*0.075;
      const len = q.s*0.20, filled = i >= built.iFrom;
      g.globalAlpha = filled ? 0.72 : 0.30;
      g.lineWidth = filled ? 4 : 2;
      g.beginPath(); g.moveTo(X, Y); g.lineTo(X, Y + len); g.stroke();
      if (filled){ g.lineWidth = 3; g.beginPath(); g.moveTo(X - len*0.24, Y + len); g.lineTo(X + len*0.24, Y + len); g.stroke(); }
    }
    g.restore();
  }

  if (has("hide") && built.showHide !== false) drawHide(pen, W, H);

  const bandLayer = ["file-back", "file-mid", "file-front"];
  for (const m of built.members){
    if (!has(bandLayer[Math.min(m.band, 2)])) continue;
    drawMaid(pen, m);
  }

  if (has("pier")) drawPier(pen, W, H);
}

export const asset = {
  id:"ensemble.disloyal-maids",
  type:"ENSEMBLE",
  name:"Disloyal maids",
  statusWord:"SLIPPING OUT",
  scene:"OD-B20-S01",

  params,
  member:{ template:"serving-woman", gestures:GESTURES, count:12, route:"quarters->threshold" },
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["portico","route","hide","file-back","file-mid","file-front","pier"],
  // normalized 0..1 anchors. station:* are the twelve route slots the scene
  // can place a NAMED woman (Melantho) on; nothing is baked in.
  // every route anchor is PROJECTED from routeAt(), never hand-written, so the
  // stations cannot drift away from the file that stands on them
  anchors:(()=>{
    const r3 = v => Math.round(v*1000)/1000;
    const at = u => { const q = routeAt(u); return { x:r3(q.x), y:r3(q.y) }; };
    const a = {
      "door:womens-quarters":{ x:0.130, y:HORIZON },
      "stair:upper-chamber":{ x:0.745, y:HORIZON },
      "threshold:hall":{ x:0.930, y:0.760 },
      "focus:hide":{ x:0.245, y:0.878 },
      "tail:file":at(0.04),
      "route:mid":at(0.50),
      "head:file":at(0.96),
      "camera:wide":{ x:0.500, y:0.570 },
      "camera:hide":{ x:0.290, y:0.800 },
      "camera:door":{ x:0.170, y:0.480 },
    };
    for (let i = 0; i < 12; i++) a[`station:${i+1}`] = at(lerp(0.04, 0.96, i/11));
    return a;
  })(),
  zones:{
    portico:{ x0:0.06, y0:0.44, x1:0.94, y1:0.97 },
    route:{ x0:0.10, y0:0.46, x1:0.93, y1:0.90 },
    forecourt:{ x0:0.06, y0:0.80, x1:0.46, y1:0.98 },
    "occlusion:pier":{ x0:0.90, y0:0.36, x1:1.00, y1:1.00 },
  },
  channels:["formation","count","density","attention","wave","waveSpread","mirth","stealth","spread","dir","lamps"],

  states:{
    initial:"slipping-out",
    nodes:{
      // OD-B20-S01: the file goes down the portico past the hide. He counts.
      "slipping-out":{ preview:{ formation:"file", count:12, density:1.0, attention:0.40, mirth:0.55, stealth:0.62, wave:1.6, status:"SLIPPING OUT" } },
      // still coming out of the door, bunched, nobody committed yet
      "leaving":     { preview:{ formation:"spill", count:12, density:1.0, attention:0.25, mirth:0.35, stealth:0.80, wave:1.6, status:"LEAVING" } },
      // paired off, whispering across the gap between them
      "whispering":  { preview:{ formation:"pairs", count:12, density:1.0, attention:0.30, mirth:0.45, stealth:0.55, wave:1.6, status:"WHISPERING" } },
      // open laughter — they think the forecourt is empty
      "laughing":    { preview:{ formation:"file", count:12, density:1.0, attention:0.15, mirth:1.0, stealth:0.25, wave:1.6, status:"LAUGHING" } },
      // a knot halfway down, waiting for the last of them
      "waiting":     { preview:{ formation:"cluster", count:12, density:1.0, attention:0.35, mirth:0.40, stealth:0.60, wave:1.6, status:"WAITING" } },
      // the wave: the suspicion that the beggar is awake, mid-file
      "alarmed":     { preview:{ formation:"file", count:12, density:1.0, attention:0.55, mirth:0.55, stealth:0.70, wave:0.52, waveSpread:0.15, status:"ALARMED" } },
      // it has reached all of them: every head on the hide, nobody moving
      "caught":      { preview:{ formation:"freeze", count:12, density:1.0, attention:1.0, mirth:0.0, stealth:0.9, wave:1.6, status:"CAUGHT" } },
      // the far end of the route empty — only the near ones have gone yet
      "counted-few": { preview:{ formation:"file", count:12, density:0.35, attention:0.45, mirth:0.5, stealth:0.65, wave:1.6, status:"THREE SO FAR" } },
      // coming back before dawn, facing the other way
      "returning":   { preview:{ formation:"file", count:12, density:1.0, dir:-1, attention:0.30, mirth:0.20, stealth:0.85, lamps:2, wave:1.6, status:"RETURNING" } },
    },
    edges:[
      ["slipping-out","leaving"],["leaving","slipping-out"],
      ["slipping-out","whispering"],["whispering","laughing"],["laughing","slipping-out"],
      ["slipping-out","waiting"],["waiting","slipping-out"],
      ["slipping-out","alarmed"],["laughing","alarmed"],["alarmed","caught"],
      ["caught","slipping-out"],["alarmed","slipping-out"],
      ["slipping-out","counted-few"],["counted-few","slipping-out"],
      ["slipping-out","returning"],["returning","slipping-out"],
    ],
  },

  // neutral preview = the reason the asset exists: twelve women on the route,
  // hems up, one laughing, going past an empty hide that is not empty
  preview:()=>({ formation:"file", count:12, density:1.0, attention:0.40,
                 mirth:0.55, stealth:0.62, wave:1.6, waveSpread:0.16,
                 spread:1.0, dir:1, lamps:3, status:"SLIPPING OUT", progress:0.30 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
