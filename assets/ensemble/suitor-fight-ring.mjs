/* ensemble.suitor-fight-ring — the young nobles clearing a RING for the
   beggars' fight at the threshold of the great hall (Book XVIII): Irus has
   tried to drive the stranger off the doorstone, Antinous has heard it, and
   the whole eating-crowd comes up off the benches delighted, shoves the
   floor clear, lays bets on two starving men, and then stands the boundary
   so neither can walk out of it.

   ENSEMBLE asset. Same body family as `ensemble.the-suitors` and
   `ensemble.suitor-council` — short tunic trapezoid, hair cap, braying
   mouth — but built as a RING rather than a bench or a split: one separable
   member template instanced N times deterministically around an ellipse in
   perspective, so the crowd's shape IS the contest boundary.

   Exposes the ENSEMBLE controls: FORMATION (ring | clearing | betting |
   roar | oath | scatter), DENSITY, ATTENTION (how hard the heads turn onto
   the cleared floor), a reaction-WAVE travelling around the arc, and
   FOREGROUND/BACKGROUND depth (an inner ring, an outer band of craning
   heads behind it, and a cropped near pair seen from the back).

   The ring is the point of the asset. The cleared floor in the middle is
   EMPTY — Irus, the stranger and the prize are placed by the scene at
   `ring:*`, `fighter:a` / `fighter:b` and `prize:*`. The front of the ring
   is open by design (`openFront`) so the camera looks in over the gap; the
   crowd never closes across the lens.

   Two states carry Book XVIII specifically: `clearing` (arms barred out,
   staffs across, the floor being shoved open) and `oath` (every hand up —
   the suitors swearing no one will strike the stranger from behind).

   No named noble is baked in. Solid grays + hard contour only; the engine
   dotify POST pass supplies the halftone. Atlas OD-B18-S01. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const TAU = Math.PI * 2;

/* the separable gesture set of the member template — the crowd's whole
   behaviour is legible from arms alone, at any density */
export const GESTURES = ["laugh","bet","shout","bar","shove","point","cup","swear","listen"];

const params = {
  formation:"ring",     // ring | clearing | betting | roar | oath | scatter
  rings:2,              // 1 = the ring only, 2 = + an outer band of craning heads
  perRing:[8,10],       // [outer band, inner ring] member counts (density control)
  density:1.0,          // 0 = a thin ring .. 1 = the whole hall on its feet
  attention:0.88,       // 0 = heads wandering .. 1 = every head on the cleared floor
  heat:0.55,            // 0 = amused .. 1 = shouting, leaning over the line
  betting:0.45,         // share of hands holding up a stake
  wave:1.4,             // position 0..1 of the laugh travelling round the arc (>1 = off)
  waveSpread:0.14,      // how wide that band of freshly-turned heads is
  openFront:0.30,       // 0..0.48 — the wedge of the ring left open toward the camera
  ringScale:1.0,        // the ring breathing in and out
  foreground:1.0,       // 0 = no near pair .. 1 = two cropped backs framing the gap
  centreX:0.50,         // ring centre, fractions of W,H
  centreY:0.720,
  radiusX:0.355,
  radiusY:0.155,
  showFloorRing:true,   // the scuffed boundary line on the floor
  showHall:true,        // the megaron shell + the great door behind the crowd
  seed:1801,
};

/* ---------------- ONE member: a young noble on the boundary ----------------
   m = { cx, baseY, s, shade, feat, headTurn, face, lean, heat, laugh,
         gesture, back, layer }.  All geometry keys off s, so the same
   template serves the 72px outer band and the 190px cropped near pair. */
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

function drawNoble(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, feat = m.feat;
  const cw = Math.max(2, s*0.020);
  const tunic  = toneSolid(inkLevel(m.shade.tunic));
  const skin   = toneSolid(inkLevel(m.shade.skin));
  const dark   = toneSolid(inkLevel(m.shade.hair));
  const cloakT = toneSolid(inkLevel(m.shade.cloak));
  const metal  = toneSolid(inkLevel(6));
  const F      = m.face;                  // +1 faces right, -1 faces left
  const heat   = clamp01(m.heat);
  const laugh  = clamp01(m.laugh);
  const back   = !!m.back;                // seen from behind — no face

  const hipY = baseY - s*0.28;
  const shoY = hipY - s*0.40 - laugh*s*0.012;      // shoulders ride up on a laugh
  const tilt = m.lean * s*0.10 * F;
  const sx   = cx + tilt;
  const shw  = s*0.185, hemw = s*0.225;
  const headR  = s*0.128*feat.headS;
  const headCy = shoY - headR*1.04 - laugh*s*0.014 + m.lean*s*0.01;
  const hx     = sx + (back ? 0 : m.headTurn*headR*0.24 - laugh*F*headR*0.16) + tilt*0.45;

  // ground shadow — keeps the member planted on the floor
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*1.00, s*0.026, 0,0,7); g.fill();

  // ---- legs: everyone in a fight ring is standing ----
  {
    const spread = 1 + Math.abs(m.lean)*0.5 + (m.gesture==="bar"||m.gesture==="shove" ? 0.55 : 0);
    const fL = cx - s*0.082*spread, fR = cx + s*0.082*spread;
    pen.limb(()=>{ g.moveTo(cx-s*0.072, hipY); g.lineTo(fL, baseY-s*0.020); }, skin, s*0.066);
    pen.limb(()=>{ g.moveTo(cx+s*0.072, hipY); g.lineTo(fR, baseY-s*0.020); }, skin, s*0.066);
    pen.paint(()=>{ g.ellipse(fL, baseY, s*0.056, s*0.023, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
    pen.paint(()=>{ g.ellipse(fR, baseY, s*0.056, s*0.023, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  }

  // ---- the slung sword at the far hip: these are armed men watching two
  // starving ones fight for a sausage ----
  if (feat.sword && !back){
    pen.limb(()=>{ g.moveTo(cx - F*hemw*0.55, hipY - s*0.03);
                   g.lineTo(cx - F*hemw*1.30, hipY + s*0.19); }, metal, s*0.030);
    pen.ink(()=>{ g.moveTo(cx - F*hemw*0.38, hipY - s*0.09);
                  g.lineTo(cx - F*hemw*0.78, hipY + s*0.01); }, cw*0.8);
  }

  // ---- FAR arm, behind the torso ----
  {
    const sh = { x: sx - F*shw*0.80, y: shoY + s*0.045 };
    let hand;
    switch (m.gesture){
      case "bar":                                        // both arms out: the line
        hand = { x: sx - F*(shw + s*0.20), y: shoY + s*0.10 }; break;
      case "shove":                                      // both hands forward, low
        hand = { x: sx + F*(shw + s*0.10), y: hipY - s*0.02 }; break;
      case "swear":                                      // the far hand steadies at the hip
        hand = { x: cx - F*hemw*0.55, y: hipY - s*0.02 }; break;
      case "laugh":                                      // a hand to the belly
        hand = { x: cx - F*hemw*0.10, y: hipY - s*0.09 }; break;
      default:
        hand = { x: sx - F*shw*0.86, y: hipY + s*0.03 - heat*s*0.05 };
    }
    arm(pen, sh, hand, -F, tunic, skin, s, 0.10);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.032, 0, 7); }, skin, cw*0.7);
  }

  // ---- torso: the short tunic trapezoid ----
  pen.paint(()=>{
    g.moveTo(sx-shw, shoY);
    g.lineTo(sx+shw, shoY);
    g.lineTo(cx+hemw, hipY);
    g.lineTo(cx-hemw, hipY);
    g.closePath();
  }, tunic, cw);
  pen.seam(()=>{ g.moveTo(cx-hemw*0.92, hipY-cw); g.lineTo(cx+hemw*0.92, hipY-cw); }, cw*0.7);
  if (!back)
    pen.seam(()=>{ g.moveTo(sx-shw*0.82, shoY+s*0.035); g.lineTo(cx+hemw*0.62, hipY-s*0.02); }, cw*0.6);
  else
    pen.seam(()=>{ g.moveTo(sx, shoY+s*0.05); g.lineTo(cx, hipY-s*0.02); }, cw*0.6);

  // cloak thrown over one shoulder (some of them)
  if (feat.cloak){
    pen.paint(()=>{
      g.moveTo(sx - F*shw*0.15, shoY - headR*0.12);
      g.lineTo(sx + F*shw*1.02, shoY + s*0.05);
      g.lineTo(cx + F*hemw*0.90, hipY + s*0.02);
      g.lineTo(cx + F*hemw*0.12, hipY - s*0.01);
      g.closePath();
    }, cloakT, cw*0.9);
  }

  // ---- neck + head ----
  pen.paint(()=>{ g.rect(sx-headR*0.30, shoY-headR*0.60, headR*0.60, headR*0.90); }, skin, cw*0.8);
  if (feat.head !== "bald")
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.16, headR*1.10, headR*1.22, 0,0,7); }, dark, cw*0.9);

  if (back){
    // the back of the head: a hair cap, no features, one nape tick
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.92, headR*1.02, 0,0,7); },
              feat.head==="bald" ? skin : dark, cw);
    if (feat.head === "fillet")
      pen.paint(()=>{ g.rect(hx-headR*0.95, headCy-headR*0.30, headR*1.90, headR*0.26); }, cloakT, cw*0.7);
    pen.seam(()=>{ g.moveTo(hx-headR*0.30, headCy+headR*0.90); g.lineTo(hx+headR*0.30, headCy+headR*0.90); }, cw*0.7);
  } else {
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);

    // face — eyes/brow/nose carry headTurn (ATTENTION); mouth carries the laugh
    const eyeY = headCy - headR*0.04;
    const gx   = m.headTurn*headR*0.30;
    const eyeR = headR*0.11;
    g.fillStyle = INK;
    if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(hx+headR*0.32+gx, eyeY, eyeR, eyeR*(laugh>0.6?0.55:1.1), 0,0,7); g.fill(); }
    if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(hx-headR*0.32+gx, eyeY, eyeR, eyeR*(laugh>0.6?0.55:1.1), 0,0,7); g.fill(); }
    g.strokeStyle = INK; g.lineCap = "round";
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    // brows: up and outward on a laugh, down and inward on heat
    const bLift = laugh*headR*0.16 - heat*headR*0.16;
    g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.44 - bLift*0.6);
    g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.52 - bLift);
    g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.52 - bLift);
    g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.44 - bLift*0.6);
    g.stroke();
    g.beginPath();
    g.moveTo(hx+gx*0.6, eyeY+headR*0.06);
    g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.40);
    g.stroke();
    // the mouth: the crowd's whole tone in one shape
    if (laugh > 0.5 || m.gesture === "shout"){
      pen.paint(()=>{ g.ellipse(hx+gx*0.7, headCy+headR*0.56, headR*0.23, headR*0.30, 0,0,7); },
                toneSolid(inkLevel(7)), cw*0.6);
    } else {
      g.lineWidth = Math.max(2, headR*0.11);
      g.beginPath();
      g.moveTo(hx-headR*0.22+gx, headCy+headR*0.54);
      g.quadraticCurveTo(hx+gx, headCy+headR*0.54 + (laugh-heat*0.4)*headR*0.34,
                         hx+headR*0.22+gx, headCy+headR*0.54);
      g.stroke();
    }
    if (feat.head === "hair")
      pen.paint(()=>{
        g.moveTo(hx-headR*0.92, headCy-headR*0.02);
        g.quadraticCurveTo(hx, headCy-headR*1.34, hx+headR*0.92, headCy-headR*0.02);
        g.quadraticCurveTo(hx+headR*0.50, headCy-headR*0.52, hx, headCy-headR*0.46);
        g.quadraticCurveTo(hx-headR*0.50, headCy-headR*0.52, hx-headR*0.92, headCy-headR*0.02);
      }, dark, cw*0.8);
    else if (feat.head === "fillet")
      pen.paint(()=>{ g.rect(hx-headR*0.95, headCy-headR*0.52, headR*1.90, headR*0.30); }, cloakT, cw*0.7);
    if (feat.beard)
      pen.paint(()=>{
        g.moveTo(hx-headR*0.54, headCy+headR*0.36);
        g.quadraticCurveTo(hx, headCy+headR*1.34, hx+headR*0.54, headCy+headR*0.36);
        g.quadraticCurveTo(hx, headCy+headR*0.74, hx-headR*0.54, headCy+headR*0.36);
      }, dark, cw*0.7);
  }

  // ---- NEAR arm + its stake: the gesture is the wager ----
  const sh = { x: sx + F*shw*0.82, y: shoY + s*0.045 };
  let hand, bend = 0.22, palm = false, fist = true;
  switch (m.gesture){
    case "laugh":                        // thrown back, wrist loose
      hand = { x: sx + F*(shw + s*0.10), y: shoY - s*0.14 }; bend = 0.26; break;
    case "bet":                          // the stake held straight up
      hand = { x: sx + F*shw*0.42, y: shoY - s*0.42 }; bend = 0.16; break;
    case "shout":                        // fist up over the shoulder
      hand = { x: sx + F*shw*0.72, y: shoY - s*0.32 }; bend = 0.24; break;
    case "bar":                          // arm out flat: nobody crosses here
      hand = { x: sx + F*(shw + s*0.24), y: shoY + s*0.08 }; bend = 0.10; palm = true; break;
    case "shove":                        // both hands forward, low: clearing the floor
      hand = { x: sx + F*(shw + s*0.17), y: hipY - s*0.05 }; bend = 0.20; palm = true; break;
    case "point":                        // thrown across the ring
      hand = { x: sx + F*(shw + s*0.16), y: shoY + s*0.20 }; bend = 0.22; break;
    case "swear":                        // the flat oath-hand, raised
      hand = { x: sx + F*shw*0.58, y: shoY - s*0.36 }; bend = 0.14; palm = true; break;
    case "cup":                          // a goblet carried out to watch
      hand = { x: sx + F*(shw + s*0.09), y: shoY - s*0.12 }; bend = 0.22; break;
    default:                             // listen — arm at the side
      hand = { x: sx + F*shw*0.92, y: hipY + s*0.02 }; bend = 0.16;
  }
  arm(pen, sh, hand, F, tunic, skin, s, bend);

  if (palm){
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.052, s*0.032,
                    m.gesture==="swear" ? 0 : (F>0?0.55:-0.55), 0, 7); }, skin, cw*0.7);
    if (m.gesture === "swear")           // three raised fingers, drawn as ticks
      pen.ink(()=>{ for (let k=-1;k<=1;k++){
        g.moveTo(hand.x + k*s*0.024, hand.y - s*0.020);
        g.lineTo(hand.x + k*s*0.028, hand.y - s*0.062); } }, cw*0.8);
  } else if (m.gesture === "bet"){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.034, 0, 7); }, skin, cw*0.7);
    pen.paint(()=>{ g.arc(hand.x, hand.y - s*0.052, s*0.042, 0, 7); }, toneSolid(inkLevel(6)), cw*0.8);
    pen.ink(()=>{ g.moveTo(hand.x - s*0.020, hand.y - s*0.052);
                  g.lineTo(hand.x + s*0.020, hand.y - s*0.052); }, cw*0.7);
  } else if (m.gesture === "point"){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.030, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ g.moveTo(hand.x, hand.y); g.lineTo(hand.x + F*s*0.078, hand.y - s*0.010); }, cw*0.9);
  } else if (m.gesture === "cup"){
    const wx = hand.x, wy = hand.y;
    pen.paint(()=>{ g.moveTo(wx-s*0.045, wy-s*0.055); g.lineTo(wx+s*0.045, wy-s*0.055);
                    g.lineTo(wx+s*0.028, wy+s*0.012); g.lineTo(wx-s*0.028, wy+s*0.012);
                    g.closePath(); }, toneSolid(inkLevel(6)), cw*0.7);
    pen.paint(()=>{ g.rect(wx-s*0.012, wy+s*0.012, s*0.024, s*0.034); }, toneSolid(inkLevel(6)), cw*0.6);
  } else if (fist){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.036, 0, 7); }, skin, cw*0.7);
  }

  // ---- the held staff: SHORT segments, never a span. Several of these
  // around the arc are what actually reads as an enforced boundary. ----
  if (feat.staff && (m.gesture==="bar" || m.gesture==="listen" || m.gesture==="shove")){
    const y0 = hipY - s*0.06;
    pen.limb(()=>{ g.moveTo(cx - F*hemw*0.35, y0 + s*0.04);
                   g.lineTo(cx + F*(hemw + s*0.16), y0 - s*0.02); }, toneSolid(inkLevel(5)), s*0.026);
  }
}

/* ---------------- the cleared floor: the ring itself ----------------------
   An ellipse of bare paper, scuffed round the rim with short boundary ticks.
   Deliberately EMPTY — the two fighters and the prize are scene instances. */
function drawFloorRing(pen, cx, cy, rx, ry, wear){
  const g = pen.ctx;
  g.save();
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, TAU);
  g.fillStyle = inkLevel(0); g.fill();
  g.restore();
  // the boundary, as short separated ticks: an ellipse, never a horizontal bar
  const N = 34;
  for (let i=0;i<N;i++){
    const a  = (i/N)*TAU;
    const px = cx + rx*Math.cos(a), py = cy + ry*Math.sin(a);
    const tx = -rx*Math.sin(a), ty = ry*Math.cos(a);
    const L  = Math.hypot(tx,ty) || 1;
    const len = ry*(0.075 + 0.055*Math.abs(Math.sin(a*3.0)));
    const lw  = Math.max(2, ry*0.038*(0.7 + 0.5*wear));
    pen.ink(()=>{ g.moveTo(px - tx/L*len*0.5, py - ty/L*len*0.5);
                  g.lineTo(px + tx/L*len*0.5, py + ty/L*len*0.5); }, lw);
  }
  // scuff marks inside the ring — the floor already fought over
  for (let i=0;i<5;i++){
    const a = 0.4 + i*1.28, r = 0.36 + (i%3)*0.18;
    const px = cx + rx*r*Math.cos(a), py = cy + ry*r*Math.sin(a);
    pen.ink(()=>{ g.moveTo(px - rx*0.048, py); g.lineTo(px + rx*0.048, py - ry*0.03); }, 2);
  }
}

/* ---------------- the megaron shell behind the crowd ----------------------
   Kept minimal and BROKEN: no span crosses the frame uninterrupted, so the
   backdrop never stripes the picture. `location.megaron-hall` and
   `location.fight-threshold` are the real rooms; this is only the wall the
   ring is pressed against. */
function drawHall(pen, W, H, horizon){
  const g = pen.ctx;
  // the wall foot, drawn as separated runs of line — no filled band, and no
  // single rule that crosses the frame
  const runs = [[0.00,0.155],[0.235,0.485],[0.545,0.760],[0.835,1.00]];
  for (const [a,b] of runs){
    pen.ink(()=>{ g.moveTo(W*a, horizon); g.lineTo(W*b, horizon); }, 4);
    pen.seam(()=>{ g.moveTo(W*a, horizon-H*0.026); g.lineTo(W*b, horizon-H*0.026); }, 2);
  }
  // hung shields — the wall furniture of the hall
  for (let i=0;i<4;i++){
    const hx = W*(0.335 + i*0.115), hy = horizon - H*0.115;
    pen.paint(()=>{ g.ellipse(hx, hy, W*0.029, H*0.024, 0,0,7); }, toneSolid(inkLevel(3)), 4);
    pen.ink(()=>{ g.moveTo(hx-W*0.029, hy); g.lineTo(hx+W*0.029, hy); }, 2);
  }
  // two columns standing ON the back wall; they stop at the horizon so they
  // never cross the ranks, and start below the card label
  for (const px of [0.205, 0.795]){
    const bx = W*px, bw = W*0.034;
    pen.paint(()=>{ g.rect(bx-bw/2, H*0.135, bw, horizon-H*0.135); }, toneSolid(inkLevel(2)), 4);
    pen.paint(()=>{ g.rect(bx-bw*0.85, H*0.135, bw*1.70, H*0.022); }, toneSolid(inkLevel(4)), 4);
    pen.seam(()=>{ g.moveTo(bx-bw*0.18, H*0.172); g.lineTo(bx-bw*0.18, horizon-H*0.008); }, 2);
  }
  // the great door at the left — the threshold Irus is claiming, and the
  // gate he is dragged out through. The one deep note in the backdrop.
  const dx = W*0.032, dw = W*0.078, dtop = horizon - H*0.155;
  pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.155); }, toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.rect(dx+dw*0.30, dtop+H*0.014, dw*0.46, H*0.141); }, toneSolid(inkLevel(6)), 3);
  pen.paint(()=>{ g.rect(dx-W*0.015, dtop-H*0.010, W*0.015, H*0.165); }, toneSolid(inkLevel(3)), 3);
  pen.paint(()=>{ g.rect(dx+dw, dtop-H*0.010, W*0.015, H*0.165); }, toneSolid(inkLevel(3)), 3);
  pen.paint(()=>{ g.rect(dx-W*0.019, dtop-H*0.020, dw+W*0.038, H*0.012); }, toneSolid(inkLevel(4)), 3);
  // the doorstone itself, low and pale
  pen.paint(()=>{ g.rect(dx-W*0.008, horizon-H*0.003, dw+W*0.016, H*0.018); }, toneSolid(inkLevel(3)), 3);
}

/* Equal-ARC-LENGTH angles across a stretch of the ring. Stepping the angle
   uniformly piles bodies up at the left and right turns of a flat perspective
   ellipse; stepping the arc spaces them evenly along the boundary, which is
   what a ring of standing men actually does. */
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

/* ---------------- deterministic member build from params + state ---------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = p.formation || "ring";
  const attention = clamp01(p.attention);
  const heat      = clamp01(p.heat);
  const betting   = clamp01(p.betting);
  const wave      = p.wave ?? params.wave;
  const sigma     = Math.max(0.05, p.waveSpread ?? params.waveSpread);
  const density   = clamp01(p.density);
  const rings     = clamp(p.rings|0 || 1, 1, 2);
  const perRing   = p.perRing || params.perRing;
  const fg        = clamp01(p.foreground ?? params.foreground);
  const seed      = (p.seed ?? params.seed) >>> 0;

  const cx0 = (p.centreX ?? params.centreX)*W;
  const cyR = (p.centreY ?? params.centreY)*H;
  let RS = p.ringScale ?? 1;
  if (formation === "roar")          RS *= 0.90;
  else if (formation === "clearing") RS *= 1.10;
  else if (formation === "scatter")  RS *= 1.20;
  else if (formation === "oath")     RS *= 1.04;
  const rx = (p.radiusX ?? params.radiusX)*W*RS;
  const ry = (p.radiusY ?? params.radiusY)*H*RS;
  const gapHalf = clamp(p.openFront ?? params.openFront, 0.08, 0.48)*Math.PI;

  const yLo = H*0.44, ySpan = H*0.48;
  const members = [];

  for (let r=0; r<rings; r++){
    const outer = (rings > 1 && r === 0);
    if (outer && density < 0.42) continue;              // thin the deep band first
    let n = perRing[Math.min(r, perRing.length-1)] || 9;
    n = Math.max(3, Math.round(n * (0.50 + 0.50*density)));

    // the outer band is the BACK half only, and set well back and above the
    // ring — a second row of craning heads, never a second ring in front
    const RXb = outer ? rx*0.92 : rx;
    const RYb = outer ? ry*1.62 : ry;
    const a0  = outer ? Math.PI + 0.35 : Math.PI/2 + gapHalf;
    const a1  = outer ? TAU - 0.35     : Math.PI/2 + TAU - gapHalf;
    const angles = arcAngles(a0, a1, RXb, RYb, n);

    for (let i=0;i<n;i++){
      const rng = rnd((seed + r*733 + i*47 + 11) >>> 0);
      const u   = n>1 ? i/(n-1) : 0.5;
      const a   = angles[i];
      const jr = 1 + (rng()-0.5)*0.07;                  // radial jitter: not a machine
      const RX = RXb*jr, RY = RYb*jr;
      let px = cx0 + RX*Math.cos(a);
      let by = cyR + RY*Math.sin(a) + (outer ? -H*0.032 : 0) + (rng()-0.5)*H*0.008;

      if (formation === "scatter"){                     // the ring breaks outward
        px += (px - cx0)*0.16 + (rng()-0.5)*W*0.05;
        by += (rng()-0.5)*H*0.030;
      }
      px = clamp(px, W*0.055, W*0.945);
      by = clamp(by, H*0.44, H*0.93);

      const depth = clamp01((by - yLo)/ySpan);
      const s = lerp(78, 156, depth);

      // reaction-WAVE: the laugh going round the arc — heads snap in, heat spikes
      const d    = u - wave;
      const hit  = clamp01(Math.exp(-(d*d)/(2*sigma*sigma))) * (outer ? 0.7 : 1);
      let heatM  = clamp01(heat + hit*0.42);

      // ATTENTION: everything looks at the cleared floor, except when betting
      // (heads turn to the neighbour) or scattering (heads on the exits)
      let aimX = cx0, aimAtt = attention;
      if (formation === "betting"){ aimX = px + (i%2 ? 1 : -1)*W*0.10; aimAtt = attention*0.55; }
      else if (formation === "scatter"){ aimX = W*(rng()<0.5 ? 0.05 : 0.95); aimAtt = attention*0.5; }
      const att = clamp01(aimAtt + hit*0.35);
      let headTurn = clamp((aimX - px)/(W*0.22) * att, -1, 1);
      if (att < 0.22) headTurn = (rng()-0.5)*1.4;
      const face = px <= cx0 ? 1 : -1;                  // bodies angle onto the ring

      // GESTURE: the member's stake in the fight
      const rr = rng();
      let gesture;
      if (formation === "oath")          gesture = rr < 0.84 ? "swear" : "listen";
      else if (formation === "betting")  gesture = rr < 0.46 ? "bet" : rr < 0.72 ? "cup" : rr < 0.89 ? "laugh" : "point";
      else if (formation === "clearing") gesture = rr < 0.40 ? "bar" : rr < 0.66 ? "shove" : rr < 0.86 ? "point" : "laugh";
      else if (formation === "roar")     gesture = rr < 0.48 ? "shout" : rr < 0.76 ? "point" : "laugh";
      else if (formation === "scatter")  gesture = rr < 0.38 ? "point" : rr < 0.68 ? "shout" : "listen";
      else                               gesture = rr < 0.28 ? "laugh"
                                                 : rr < 0.28 + betting*0.36 ? "bet"
                                                 : rr < 0.80 ? "bar"
                                                 : rr < 0.91 ? "cup" : "shout";
      if (hit > 0.52 && gesture !== "swear") gesture = rng() < 0.6 ? "shout" : "laugh";

      const laugh = gesture === "laugh" ? 1
                  : gesture === "shout" ? 0.85
                  : clamp01(heatM - 0.55);

      const feat = {
        beard: rng() < 0.26,
        head:  (()=>{ const q = rng(); return q < 0.13 ? "fillet" : q < 0.94 ? "hair" : "bald"; })(),
        headS: 0.90 + rng()*0.22,
        cloak: rng() < 0.32,
        sword: rng() < 0.30,
        staff: rng() < 0.26,
      };
      // atmospheric depth: the far band prints LIGHT, the near band a step
      // darker. Nothing above level 5 — the crowd is contour, not mass.
      const shade = {
        tunic: clamp(Math.round(lerp(2, 4, depth)) + (feat.cloak ? 1 : 0), 1, 5),
        skin:  2,
        hair:  clamp(Math.round(lerp(4, 6, depth)), 4, 6),
        cloak: clamp(Math.round(lerp(3, 5, depth)), 3, 5),
      };

      members.push({
        cx:px, baseY:by, s, shade, feat, headTurn, face, heat:heatM, laugh, gesture,
        lean: clamp((gesture==="bar"||gesture==="shove") ? -0.22 : heatM*0.85, -0.35, 0.9),
        depth, back:false, layer: outer ? "ring-outer" : "ring-inner",
      });
    }
  }

  /* the near pair: two cropped backs at the mouth of the ring. They give the
     frame a foreground plane and make the open front read as a gap the
     camera is standing in, not as an absence of crowd. */
  if (fg > 0.02 && formation !== "scatter"){
    let k = 0;
    for (const sgn of [-1, 1]){
      const rng = rnd((seed + 9001 + k*137) >>> 0);
      const s   = lerp(140, 168, fg);
      members.push({
        cx: cx0 + sgn*W*0.272, baseY: H*1.000, s,
        shade:{ tunic:2, skin:2, hair:5, cloak:3 },
        feat:{ beard:false, head: rng()<0.2 ? "fillet" : "hair", headS:1.0,
               cloak: rng()<0.5, sword:false, staff:false },
        headTurn: sgn*0.18, face: sgn < 0 ? 1 : -1,
        heat: clamp01(heat*0.8), laugh: sgn < 0 ? 0.9 : 0.2,
        gesture: sgn < 0 ? (formation==="oath" ? "swear" : "bet")
                         : (formation==="oath" ? "swear" : "point"),
        lean: 0.10, depth: 1, back: true, layer:"foreground",
      });
      k++;
    }
  }

  members.sort((a,b)=> a.baseY - b.baseY);   // painter's order: back -> front
  return { members, cx0, cyR, rx, ry, formation, attention, heat,
           showFloorRing:p.showFloorRing, showHall:p.showHall };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const layers = (st && st.layers) ||
    ["hall","floor","ring-floor","ring-outer","ring-inner","foreground"];
  const has = l => layers.includes(l);
  const horizon = H*0.335;

  // ---- lightest possible field: the crowd must read as contour on paper ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  if (has("hall") && B.showHall !== false) drawHall(pen, W, H, horizon);

  // ---- the floor: converging lines onto the ring, plus three broken
  // depth courses (gapped so no line crosses the frame whole) ----
  if (has("floor")){
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.18;
    for (let i=-6;i<=6;i++){
      g.beginPath(); g.moveTo(B.cx0 + i*W*0.155, H*0.995); g.lineTo(B.cx0 + i*W*0.035, horizon); g.stroke();
    }
    for (let j=1;j<=3;j++){
      const y = horizon + (H-horizon)*Math.pow(j/3.4, 1.6);
      const runs = j%2 ? [[0.00,0.30],[0.38,0.72],[0.80,1.00]] : [[0.06,0.44],[0.54,0.94]];
      for (const [a,b] of runs){ g.beginPath(); g.moveTo(W*a, y); g.lineTo(W*b, y); g.stroke(); }
    }
    g.globalAlpha = 1;
  }

  // ---- the cleared floor ----
  if (has("ring-floor") && B.showFloorRing !== false)
    drawFloorRing(pen, B.cx0, B.cyR, B.rx*0.80, B.ry*0.80,
                  clamp01(B.heat*0.6 + (B.formation==="roar" ? 0.4 : 0)));

  // ---- the ring itself, back band -> near pair ----
  for (const m of B.members){
    if (!has(m.layer)) continue;
    drawNoble(pen, m);
  }
}

export const asset = {
  id:"ensemble.suitor-fight-ring",
  type:"ENSEMBLE",
  name:"Suitor fight ring",
  statusWord:"RINGED",
  scene:"OD-B18-S01",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["hall","floor","ring-floor","ring-outer","ring-inner","foreground"],
  // normalized 0..1 anchors. The cleared floor is EMPTY: the two fighters,
  // the prize and the named nobles are placed by the scene at these points.
  anchors:{
    "ring:centre":{x:.50,y:.720},   "ring:back":{x:.50,y:.596},
    "ring:front":{x:.50,y:.844},    "ring:left":{x:.215,y:.720},
    "ring:right":{x:.785,y:.720},
    // paired contact stations — two bodies that grapple must never share one
    "fighter:a":{x:.385,y:.760},    "fighter:b":{x:.615,y:.760},
    "corner:a":{x:.245,y:.685},     "corner:b":{x:.755,y:.685},
    "fall:mark":{x:.545,y:.815},    "drag:path":{x:.24,y:.725},
    // where the scene puts the noble who set the prize and called the terms
    "head:bench":{x:.815,y:.665},   "head:threshold":{x:.145,y:.665},
    "prize:fire":{x:.885,y:.745},   "prize:hand":{x:.795,y:.630},
    // the open mouth of the ring — the camera stands in it
    "gap:mouth":{x:.50,y:.880},     "gap:foot":{x:.50,y:.985},
    "row:outer":{x:.50,y:.492},     "row:inner":{x:.50,y:.725},
    "row:near":{x:.50,y:.930},
    "door:great":{x:.075,y:.270},   "exit:court":{x:.055,y:.520},
    "column:left":{x:.205,y:.235},  "column:right":{x:.795,y:.235},
    "camera:wide":{x:.50,y:.560},   "camera:ring":{x:.50,y:.740},
  },
  // walkable / occupied regions for scene placement + pathing
  zones:{
    ring:{ x0:.215,y0:.596,x1:.785,y1:.844 },        // the cleared floor
    "boundary:crowd":{ x0:.05,y0:.44,x1:.95,y1:.94 },// where the crowd stands
    gap:{ x0:.33,y0:.844,x1:.67,y1:.99 },            // the open front
    "drag:lane":{ x0:.06,y0:.64,x1:.42,y1:.82 },     // Irus's exit to the gate
    approach:{ x0:.05,y0:.44,x1:.30,y1:.64 },        // in from the great door
  },

  states:{
    initial:"gathering",
    nodes:{
      // the crowd coming up off the benches, the ring not yet a ring
      gathering:{ preview:{ formation:"clearing", density:0.55, attention:0.45, heat:0.18,
                            openFront:0.40, ringScale:1.14, betting:0.10, wave:1.4,
                            status:"GATHERING", progress:0.10 } },
      // the floor being shoved open — arms barred, staffs across
      clearing:{  preview:{ formation:"clearing", density:0.9, attention:0.70, heat:0.35,
                            openFront:0.34, wave:1.4, status:"CLEARING", progress:0.22 } },
      // the boundary set: the asset's reason to exist
      ring:{      preview:{ formation:"ring", density:1.0, attention:0.90, heat:0.50,
                            betting:0.45, openFront:0.30, wave:1.4,
                            status:"RINGED", progress:0.42 } },
      // wagers going up on two starving men
      betting:{   preview:{ formation:"betting", density:1.0, attention:0.35, heat:0.45,
                            betting:0.85, openFront:0.30, wave:1.4,
                            status:"BETTING", progress:0.50 } },
      // the laugh travelling round the arc as Irus is pushed in
      wave:{      preview:{ formation:"ring", density:1.0, attention:0.75, heat:0.45,
                            betting:0.30, wave:0.38, waveSpread:0.13,
                            status:"LAUGHING", progress:0.56 } },
      // every hand up: no one strikes the stranger from behind
      oath:{      preview:{ formation:"oath", density:1.0, attention:1.0, heat:0.10,
                            betting:0.0, openFront:0.30, wave:1.4,
                            status:"SWORN", progress:0.68 } },
      // the blow lands and the boundary leans in over the line
      roar:{      preview:{ formation:"roar", density:1.0, attention:0.98, heat:1.0,
                            betting:0.15, openFront:0.26, wave:1.4,
                            status:"IN UPROAR", progress:0.86 } },
      // the ring opens to let the loser be dragged out
      scatter:{   preview:{ formation:"scatter", density:0.85, attention:0.35, heat:0.55,
                            openFront:0.40, wave:1.4, foreground:0,
                            status:"BREAKING", progress:0.95 } },
      // a thin house — wide framings, or the same crowd early
      sparse:{    preview:{ formation:"ring", density:0.40, attention:0.80, heat:0.25,
                            betting:0.25, wave:1.4, status:"THIN", progress:0.15 } },
    },
    edges:[
      ["gathering","clearing"],["clearing","ring"],["ring","betting"],
      ["betting","wave"],["wave","oath"],["ring","oath"],["oath","roar"],
      ["betting","roar"],["roar","scatter"],["scatter","ring"],
      ["gathering","sparse"],["sparse","ring"],["ring","wave"],
    ],
  },
  channels:["formation","attention","heat","betting","wave","waveSpread",
            "density","openFront","ringScale","foreground","depth"],

  // neutral preview = the boundary set and the floor bare: a ring of
  // laughing, betting, arm-barring nobles around an empty circle
  preview:()=>({ formation:"ring", density:1.0, attention:0.90, heat:0.50,
                 betting:0.45, openFront:0.30, ringScale:1.0, wave:1.4,
                 waveSpread:0.14, foreground:1.0,
                 status:"RINGED", progress:0.42 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
