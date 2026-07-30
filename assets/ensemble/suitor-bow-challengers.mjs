/* ensemble.suitor-bow-challengers — the QUEUE of young nobles taking their
   turn at Odysseus's bow (Book XXI). Penelope has set the contest, the bow
   has come up out of the storeroom, and the suitors go at it ONE AT A TIME,
   in order, down the benches: grip it, set it against the instep, haul, fail,
   hand it on, and sit back down spent while the next man stands up.

   ENSEMBLE asset. Same body family as `ensemble.the-suitors`,
   `ensemble.suitor-council` and `ensemble.suitor-fight-ring` — short tunic
   trapezoid, hair cap, hard contour — but built as a LINE rather than a bench
   or a ring, because in Book XXI the crowd's shape is a *sequence*: a man at
   the stand, a man braced behind him, a queue receding into the hall, and a
   growing bench of failures on the near left.

   Exposes the ENSEMBLE controls: FORMATION (queue | attempt | fail | handover
   | mock | warming | spent | scatter), DENSITY, ATTENTION (how hard the line
   turns onto the man straining), a reaction-WAVE travelling down the queue,
   and FOREGROUND/BACKGROUND depth (a receding queue, a bench band, and two
   cropped near backs at the frame edges).

   `spent` is the asset's clock: 0 = nobody has tried yet and the whole line
   stands, 1 = the benches are full of failed men and the queue is a stub.
   Raise it across a scene and the sequence plays itself.

   The bow the head contestant handles is a SCHEMATIC stave with a string that
   visibly falls short of the upper nock — that shortfall is the whole scene.
   Pass `showBow:false` and `showHead:false` when a scene places
   `prop.odysseuss-bow` and a named challenger (`character.leiodes`,
   Eurymachus, Antinous) at `stand:mark` instead. No named noble is baked in.

   The wall behind is deliberately BARE — Book XIX stripped the hall of arms,
   so only the empty pegs are left. Solid grays + hard contour only; the
   engine dotify POST pass supplies the halftone. Atlas OD-B21-S03. */
import { makePen, toneSolid, inkLevel, INK, clamp, clamp01, lerp, rnd } from "../../engine/halfworld-engine.mjs";

/* the separable stance set of the member template. The first six are the
   contest states the atlas asks for; the rest are what the line does while
   it waits its turn. Every one of them is legible from arms alone. */
export const STANCES = ["grip","brace","strain","fail","surrender","fatigue",
                        "warm","wait","watch","fold","mock","jeer","slump"];

const params = {
  formation:"queue",   // queue | attempt | fail | handover | mock | warming | spent | scatter
  headStance:"grip",   // stance of the man at the stand (see STANCES)
  effort:0.35,         // 0 = holding it .. 1 = hauling with everything he has
  fatigue:0.15,        // 0 = fresh line .. 1 = arms dead, shoulders down the whole queue
  mock:0.30,           // share of the queue jeering rather than watching
  attention:0.85,      // 0 = heads wandering .. 1 = every head on the stand
  density:1.0,         // 0 = a stub of a line .. 1 = the whole house queued
  spent:0.25,          // share already tried — moves men from the queue to the bench
  queueN:6,            // members in the standing line at density 1
  benchN:4,            // seats on the near bench at spent 1
  contestant:3,        // which man is up (varies his features; also a label channel)
  wave:1.4,            // 0..1 position of the reaction running down the line (>1 = off)
  waveSpread:0.16,     // width of that band
  foreground:1.0,      // 0 = no near backs .. 1 = two cropped backs at the edges
  showHead:true,       // false when a scene puts a named character on the stand
  showNext:true,       // the man braced and waiting his turn
  showBow:true,        // false when the scene places prop.odysseuss-bow
  showStand:true,      // the scuffed bare floor at the stand + the scored line
  showHall:true,       // the megaron shell: bare wall, columns, storeroom door
  seed:2103,
};

/* geometry of the line, in fractions of W,H. The queue recedes UP and to the
   right; the bench of failures sits nearer, on the left. */
const STAND = { x:0.330, y:0.880 };
const NEXT  = { x:0.596, y:0.836 };
const QUEUE_PATH = [                       // head of the line -> back of the hall
  { x:0.800, y:0.757 }, { x:0.848, y:0.676 }, { x:0.790, y:0.601 },
  { x:0.700, y:0.545 }, { x:0.612, y:0.499 }, { x:0.528, y:0.463 },
];
const BENCH = [                            // the spent, sat back down on the near left
  { x:0.108, y:0.768 }, { x:0.286, y:0.706 },
  { x:0.062, y:0.640 }, { x:0.196, y:0.596 },
];

/* ---------------- ONE member ----------------------------------------------
   m = { cx, baseY, s, shade, feat, headTurn, face, stance, effort, fatigue,
         seated, back, bow, layer }. All geometry keys off s, so the same
   template serves the 84px man at the back of the hall and the 245px
   contestant folded over the bow. */
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

/* the bow as a schematic recurve stave: two horn limbs meeting at the grip,
   blocky nocks, and a string that HANGS SHORT of the upper nock. `strung`
   closes that gap — the one thing none of these men manage. */
function drawBow(pen, gx, gy, ang, L, C, s, strung){
  const g = pen.ctx;
  const horn = toneSolid(inkLevel(6));
  const lw   = Math.max(2, s*0.014);
  g.save(); g.translate(gx, gy); g.rotate(ang);
  // two limbs meeting at the grip. Kept SHALLOW: a deep arc reads as a hook,
  // and an unstrung bow is nearly straight anyway.
  pen.limb(()=>{ g.moveTo(0, -L*0.50); g.quadraticCurveTo(C*0.92, -L*0.28, C*0.58, -L*0.05); }, horn, s*0.028);
  pen.limb(()=>{ g.moveTo(C*0.58, -L*0.05); g.quadraticCurveTo(C*0.74, L*0.16, 0, L*0.42); }, horn, s*0.026);
  pen.paint(()=>{ g.rect(-s*0.020, -L*0.50-s*0.020, s*0.040, s*0.042); }, toneSolid(inkLevel(7)), lw);
  pen.paint(()=>{ g.rect(-s*0.020,  L*0.42-s*0.020, s*0.040, s*0.042); }, toneSolid(inkLevel(7)), lw);
  // the grip binding — where every hand in the book goes
  pen.paint(()=>{ g.rect(C*0.40, -L*0.10, s*0.044, L*0.14); }, toneSolid(inkLevel(4)), lw*0.8);
  // the string, drawn HEAVY: it is the half of the bow the story is about
  const span = L*0.92, reach = strung ? 1 : 0.68;
  pen.ink(()=>{ g.moveTo(0, L*0.42); g.lineTo(-s*0.008, L*0.42 - span*reach); }, lw*1.5);
  if (!strung){
    pen.ink(()=>{ g.arc(-s*0.008, L*0.42 - span*reach, s*0.024, 0, 7); }, lw*1.1);
    // the shortfall, marked as two ticks across the gap the loop cannot close
    for (let k=0;k<2;k++)
      pen.ink(()=>{ g.moveTo(-s*0.042, L*0.42 - span*(reach + 0.10 + k*0.085));
                    g.lineTo( s*0.026, L*0.42 - span*(reach + 0.10 + k*0.085)); }, lw*0.8);
  }
  g.restore();
}

function drawMember(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, feat = m.feat;
  const cw = Math.max(2, s*0.020);
  const tunic  = toneSolid(inkLevel(m.shade.tunic));
  const skin   = toneSolid(inkLevel(m.shade.skin));
  const dark   = toneSolid(inkLevel(m.shade.hair));
  const cloakT = toneSolid(inkLevel(m.shade.cloak));
  const metal  = toneSolid(inkLevel(6));
  const F      = m.face;                       // +1 faces right, -1 faces left
  const eff    = clamp01(m.effort);
  const fat    = clamp01(m.fatigue);
  const back   = !!m.back;
  const st     = m.stance;
  const hauling = (st==="brace" || st==="strain");
  const folded  = hauling ? lerp(0.10, 0.42, eff) : 0;   // how far he bends over the bow

  // the near, large members carry a broader frame and a smaller head: the
  // crowd proportion that reads at 90px turns into a bobblehead at 210px.
  const big  = clamp01((s - 130)/90);
  const hipY = m.seated ? baseY - s*0.035 : baseY - s*0.28;
  const shoY = hipY - s*0.40 + fat*s*0.030 + folded*s*0.10;
  const tilt = (m.lean + folded*0.9) * s*0.10 * F;
  const sx   = cx + tilt;
  const shw  = s*lerp(0.185, 0.226, big), hemw = s*lerp(0.225, 0.238, big);
  const headR  = s*lerp(0.128, 0.108, big)*feat.headS;
  const headDrop = (st==="fatigue"||st==="slump"||st==="surrender") ? s*0.030 : 0;
  const headCy = shoY - headR*1.02 + headDrop + fat*s*0.016 + folded*s*0.07;
  const hx     = sx + (back ? 0 : m.headTurn*headR*0.26) + tilt*0.50 + folded*F*s*0.05;

  if (!m.seated){
    g.fillStyle = "rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*1.00, s*0.026, 0,0,7); g.fill();
  }

  /* ---- legs ---- */
  if (m.seated){
    const kx = cx + F*s*0.250, ky = hipY + s*0.055;
    const fx = cx + F*s*0.300, fy = hipY + s*0.345;
    pen.limb(()=>{ g.moveTo(cx - F*s*0.020, hipY); g.lineTo(kx, ky); }, skin, s*0.070);
    pen.limb(()=>{ g.moveTo(kx, ky); g.lineTo(fx, fy); }, skin, s*0.060);
    pen.paint(()=>{ g.ellipse(fx + F*s*0.020, fy, s*0.058, s*0.024, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
    pen.limb(()=>{ g.moveTo(cx + F*s*0.030, hipY+s*0.012); g.lineTo(kx - F*s*0.055, ky+s*0.026); }, skin, s*0.058);
  } else {
    // a man hauling on a bow stands wide; a spent man stands narrow
    const spread = 1 + (hauling ? eff*1.25 : 0) + (st==="fail" ? 0.85 : 0) - fat*0.25;
    const fL = cx - s*0.082*spread, fR = cx + s*0.082*spread;
    const kneeUp = (st==="brace"||st==="strain") ? eff*s*0.10 : 0;   // instep under the belly of the bow
    pen.limb(()=>{ g.moveTo(cx-s*0.072, hipY); g.lineTo(fL, baseY-s*0.020); }, skin, s*0.066);
    pen.limb(()=>{ g.moveTo(cx+s*0.072, hipY); g.lineTo(fR + F*kneeUp, baseY-s*0.020-kneeUp); }, skin, s*0.066);
    pen.paint(()=>{ g.ellipse(fL, baseY, s*0.056, s*0.023, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
    pen.paint(()=>{ g.ellipse(fR + F*kneeUp, baseY-kneeUp, s*0.056, s*0.023, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  }

  /* ---- the slung sword at the far hip ---- */
  if (feat.sword && !back && !m.seated){
    pen.limb(()=>{ g.moveTo(cx - F*hemw*0.55, hipY - s*0.03);
                   g.lineTo(cx - F*hemw*1.30, hipY + s*0.19); }, metal, s*0.030);
    pen.ink(()=>{ g.moveTo(cx - F*hemw*0.38, hipY - s*0.09);
                  g.lineTo(cx - F*hemw*0.78, hipY + s*0.01); }, cw*0.8);
  }

  /* ---- where the hands go: the stance IS the asset.
     For the six contest stances the STAVE is placed first and the hands are
     read off it, so a hand can never miss the wood; and the far hand is kept
     at or below shoulder height so the crossing arm never cuts the face. ---- */
  const shN = { x: sx + F*shw*0.82, y: shoY + s*0.045 };
  const shF = { x: sx - F*shw*0.80, y: shoY + s*0.045 };
  let nearH, farH, bendN = 0.22, bendF = 0.12;
  let bow = null;                       // { gx, gy, ang, L, C }
  const onBow = (lx, ly) => ({ x: bow.gx + lx*Math.cos(bow.ang) - ly*Math.sin(bow.ang),
                               y: bow.gy + lx*Math.sin(bow.ang) + ly*Math.cos(bow.ang) });
  const GRIP = b => ({ lx: b.C*0.55, ly: -b.L*0.03 });

  switch (st){
    case "grip":            // the bow held out at arm's length, sized up
      bow = { gx: sx + F*s*0.285, gy: shoY + s*0.195, ang:F*0.50, L:s*0.88, C:F*s*0.090 };
      nearH = onBow(GRIP(bow).lx, GRIP(bow).ly);
      farH  = onBow(bow.C*0.72, -bow.L*0.29);
      bendN = 0.14; bendF = 0.24; break;
    case "brace":           // bow set against the instep, body coming over it
      bow = { gx: sx + F*s*0.290, gy: hipY - s*0.045, ang:F*0.13, L:s*0.88, C:F*s*0.095 };
      nearH = onBow(GRIP(bow).lx, GRIP(bow).ly);
      farH  = onBow(bow.C*0.74, -bow.L*0.27);
      bendN = 0.18; bendF = 0.28; break;
    case "strain":          // both arms hauling, back locked over the stave
      bow = { gx: sx + F*s*0.280, gy: hipY - s*0.030,
              ang:F*(0.06 - eff*0.10), L:s*0.90, C:F*s*0.105 };
      nearH = onBow(GRIP(bow).lx, GRIP(bow).ly);
      farH  = onBow(bow.C*0.78, -bow.L*(0.29 + eff*0.05));
      bendN = 0.22; bendF = 0.32; break;
    case "fail":            // the stave slipping, the far arm flung back
      bow = { gx: sx + F*s*0.380, gy: shoY + s*0.300, ang:F*1.05, L:s*0.86, C:F*s*0.085 };
      nearH = onBow(GRIP(bow).lx, GRIP(bow).ly);
      farH  = { x: sx - F*shw*1.05, y: shoY + s*0.055 };
      bendN = 0.26; bendF = 0.20; break;
    case "surrender":       // holding it out sideways for the next man, head down
      bow = { gx: sx + F*s*0.350, gy: shoY + s*0.240, ang:F*1.44, L:s*0.86, C:F*s*0.080 };
      nearH = onBow(GRIP(bow).lx, GRIP(bow).ly);
      farH  = { x: cx - F*hemw*0.55, y: hipY - s*0.010 };
      bendN = 0.14; bendF = 0.14; break;
    case "warm":            // turning the stave low over the fire, tallow on it
      bow = { gx: sx + F*s*0.290, gy: hipY + s*0.120, ang:F*1.54, L:s*0.84, C:F*s*0.080 };
      nearH = onBow(GRIP(bow).lx, GRIP(bow).ly);
      farH  = onBow(bow.C*0.62, -bow.L*0.25);
      bendN = 0.26; bendF = 0.24; break;
    case "fatigue":         // arms hanging, nothing left in the shoulders
      nearH = { x: sx + F*shw*0.86, y: hipY + s*0.10 };
      farH  = { x: sx - F*shw*0.90, y: hipY + s*0.08 };
      bendN = 0.08; bendF = 0.08; break;
    case "slump":           // sat on the bench, elbows on knees
      nearH = { x: cx + F*s*0.215, y: hipY + s*0.055 };
      farH  = { x: cx + F*s*0.165, y: hipY + s*0.075 };
      bendN = 0.30; bendF = 0.26; break;
    case "fold":            // arms crossed, waiting his turn
      nearH = { x: sx - F*shw*0.30, y: shoY + s*0.20 };
      farH  = { x: sx + F*shw*0.34, y: shoY + s*0.26 };
      bendN = 0.34; bendF = 0.30; break;
    case "watch":           // a hand up at the beard
      nearH = { x: sx + F*headR*0.30, y: headCy + headR*0.86 };
      farH  = { x: sx - F*shw*0.62, y: shoY + s*0.24 };
      bendN = 0.30; bendF = 0.22; break;
    case "mock":            // thrown out at the man on the stand
      nearH = { x: sx + F*(shw + s*0.26), y: shoY + s*0.12 };
      farH  = { x: cx - F*hemw*0.20, y: hipY - s*0.08 };
      bendN = 0.18; bendF = 0.14; break;
    case "jeer":            // fist up over the shoulder
      nearH = { x: sx + F*shw*0.72, y: shoY - s*0.34 };
      farH  = { x: cx - F*hemw*0.40, y: hipY - s*0.02 };
      bendN = 0.24; bendF = 0.12; break;
    default:                // wait — one hand on the hip
      nearH = { x: sx + F*shw*0.94, y: hipY + s*0.02 };
      farH  = { x: cx - F*hemw*0.62, y: hipY - s*0.04 };
      bendN = 0.16; bendF = 0.24;
  }

  /* ---- FAR arm, behind the torso ---- */
  arm(pen, shF, farH, -F, tunic, skin, s, bendF);
  pen.paint(()=>{ g.arc(farH.x, farH.y, s*0.032, 0, 7); }, skin, cw*0.7);

  /* ---- torso: the short tunic trapezoid ---- */
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

  if (feat.cloak){
    pen.paint(()=>{
      g.moveTo(sx - F*shw*0.15, shoY - headR*0.12);
      g.lineTo(sx + F*shw*1.02, shoY + s*0.05);
      g.lineTo(cx + F*hemw*0.90, hipY + s*0.02);
      g.lineTo(cx + F*hemw*0.12, hipY - s*0.01);
      g.closePath();
    }, cloakT, cw*0.9);
  }

  /* ---- neck + head ---- */
  pen.paint(()=>{ g.rect(sx-headR*0.30, shoY-headR*0.58, headR*0.60, headR*0.90); }, skin, cw*0.8);
  if (feat.head !== "bald")
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.14, headR*lerp(1.10,0.99,big),
                              headR*lerp(1.22,1.07,big), 0,0,7); }, dark, cw*0.9);

  if (back){
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.92, headR*1.02, 0,0,7); },
              feat.head==="bald" ? skin : dark, cw);
    if (feat.head === "fillet")
      pen.paint(()=>{ g.rect(hx-headR*0.95, headCy-headR*0.30, headR*1.90, headR*0.26); }, cloakT, cw*0.7);
    pen.seam(()=>{ g.moveTo(hx-headR*0.30, headCy+headR*0.90); g.lineTo(hx+headR*0.30, headCy+headR*0.90); }, cw*0.7);
  } else {
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);
    const eyeY = headCy - headR*0.04;
    const gx   = m.headTurn*headR*0.30;
    const eyeR = headR*0.11;
    const shut = (st==="strain" && eff>0.62) || st==="fatigue" || st==="slump";
    g.fillStyle = INK;
    if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(hx+headR*0.32+gx, eyeY, eyeR, eyeR*(shut?0.34:1.1), 0,0,7); g.fill(); }
    if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(hx-headR*0.32+gx, eyeY, eyeR, eyeR*(shut?0.34:1.1), 0,0,7); g.fill(); }
    g.strokeStyle = INK; g.lineCap = "round";
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    // brows: driven DOWN and inward by effort, UP and out by a laugh
    const laugh = (st==="mock"||st==="jeer") ? 1 : 0;
    const bLift = laugh*headR*0.18 - (eff*(hauling?1:0) + fat*0.5)*headR*0.22;
    g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.44 - bLift*0.6);
    g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.52 - bLift);
    g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.52 - bLift);
    g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.44 - bLift*0.6);
    g.stroke();
    g.beginPath();
    g.moveTo(hx+gx*0.6, eyeY+headR*0.06);
    g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.40);
    g.stroke();
    // the mouth: teeth set on a haul, wide open on a jeer, flat when spent
    if (laugh || (hauling && eff>0.55)){
      pen.paint(()=>{ g.ellipse(hx+gx*0.7, headCy+headR*0.56,
                                headR*(laugh?0.23:0.26), headR*(laugh?0.30:0.20), 0,0,7); },
                toneSolid(inkLevel(7)), cw*0.6);
    } else {
      g.lineWidth = Math.max(2, headR*0.11);
      g.beginPath();
      g.moveTo(hx-headR*0.22+gx, headCy+headR*0.54);
      g.quadraticCurveTo(hx+gx, headCy+headR*0.54 - (fat*0.5 + eff*0.3)*headR*0.30,
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

  /* ---- the stave, laid in BEFORE the near arm so the gripping hand closes
     over the wood instead of vanishing behind it ---- */
  if (bow && m.bow) drawBow(pen, bow.gx, bow.gy, bow.ang, bow.L, bow.C, s, false);

  /* ---- NEAR arm + what it is doing ---- */
  arm(pen, shN, nearH, F, tunic, skin, s, bendN);
  if (st === "mock"){
    pen.paint(()=>{ g.arc(nearH.x, nearH.y, s*0.030, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ g.moveTo(nearH.x, nearH.y); g.lineTo(nearH.x + F*s*0.080, nearH.y - s*0.012); }, cw*0.9);
  } else if (st === "watch"){
    pen.paint(()=>{ g.ellipse(nearH.x, nearH.y, s*0.040, s*0.028, 0, 0, 7); }, skin, cw*0.7);
  } else {
    pen.paint(()=>{ g.arc(nearH.x, nearH.y, s*0.036, 0, 7); }, skin, cw*0.7);
  }

  /* ---- effort: three short strain ticks off the locked shoulder. Sparse by
     design — the diagram says "force here", it does not shade. ---- */
  if (hauling && eff > 0.45 && !back){
    for (let k=-1;k<=1;k++){
      const ax = sx - F*shw*(1.15 + Math.abs(k)*0.12);
      const ay = shoY + s*0.02 + k*s*0.070;
      pen.ink(()=>{ g.moveTo(ax, ay); g.lineTo(ax - F*s*0.070, ay + k*s*0.024); }, Math.max(2, s*0.014));
    }
  }
}

/* ---------------- the bench stubs the failures sit back down on -----------
   Three SEPARATE blocks. Never one span: a bench drawn edge to edge stripes
   the frame and flattens the depth the queue is built out of. */
function drawBenchStubs(pen, W, H, seats){
  const g = pen.ctx;
  for (const q of seats){
    const bw = q.s*0.72, bh = q.s*0.075;              // sized off the man, not the frame
    const bx = q.x - bw*0.34, by = q.y;
    pen.paint(()=>{ g.rect(bx, by, bw, bh); }, toneSolid(inkLevel(2)), 3);
    pen.paint(()=>{ g.rect(bx+bw*0.08, by+bh, bw*0.11, bh*1.9); }, toneSolid(inkLevel(4)), 3);
    pen.paint(()=>{ g.rect(bx+bw*0.80, by+bh, bw*0.11, bh*1.9); }, toneSolid(inkLevel(4)), 3);
  }
}

/* ---------------- the stand: bare floor + the scored line -----------------
   Deliberately small and EMPTY of furniture — `set-piece.axe-alignment-lane`
   and `prop.odysseuss-bow` are separate assets a scene lays over it. */
function drawStand(pen, W, H, cx, cy, wear){
  const g = pen.ctx;
  const rx = W*0.180, ry = H*0.044;
  g.save();
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2);
  g.fillStyle = inkLevel(0); g.fill();
  g.restore();
  // the scored throwing line: a stub of separated ticks, never a rule
  for (let i=0;i<6;i++){
    const px = cx - rx*0.62 + (i/5)*rx*1.24;
    const py = cy + ry*0.70 + Math.sin(i*1.1)*ry*0.05;
    pen.ink(()=>{ g.moveTo(px, py - ry*0.13); g.lineTo(px, py + ry*0.13); },
            Math.max(2, ry*0.11*(0.8+wear*0.5)));
  }
  // scuffs where every man so far has set his foot
  for (let i=0;i<4;i++){
    const a = 0.7 + i*1.42, r = 0.34 + (i%3)*0.20;
    const px = cx + rx*r*Math.cos(a), py = cy + ry*r*Math.sin(a);
    pen.ink(()=>{ g.moveTo(px - rx*0.055, py); g.lineTo(px + rx*0.055, py - ry*0.10); }, 2);
  }
}

/* ---------------- the megaron shell -----------------------------------
   Broken runs only, and the wall is BARE: Book XIX carried the arms out, so
   the pegs above the bench are empty. That emptiness is the plot. */
function drawHall(pen, W, H, horizon){
  const g = pen.ctx;
  const runs = [[0.00,0.140],[0.225,0.470],[0.535,0.745],[0.820,1.00]];
  for (const [a,b] of runs){
    pen.ink(()=>{ g.moveTo(W*a, horizon); g.lineTo(W*b, horizon); }, 4);
    pen.seam(()=>{ g.moveTo(W*a, horizon-H*0.024); g.lineTo(W*b, horizon-H*0.024); }, 2);
  }
  // the empty pegs — Book XIX carried the arms out, so nothing hangs on them
  const pegs = [0.298, 0.372, 0.462, 0.556, 0.628, 0.712];
  for (let i=0;i<pegs.length;i++){
    const px = W*pegs[i], py = horizon - H*(0.052 + (i%2)*0.030);
    pen.paint(()=>{ g.rect(px - W*0.005, py - H*0.030, W*0.010, H*0.030); },
              toneSolid(inkLevel(4)), 3);
    pen.ink(()=>{ g.moveTo(px, py - H*0.030); g.lineTo(px + W*0.020, py - H*0.036); }, 3);
  }
  // two columns, stopping at the horizon and starting below the card label
  for (const px of [0.185, 0.845]){
    const bx = W*px, bw = W*0.036;
    pen.paint(()=>{ g.rect(bx-bw/2, H*0.150, bw, horizon-H*0.150); }, toneSolid(inkLevel(2)), 4);
    pen.paint(()=>{ g.rect(bx-bw*0.85, H*0.150, bw*1.70, H*0.022); }, toneSolid(inkLevel(4)), 4);
    pen.seam(()=>{ g.moveTo(bx-bw*0.18, H*0.186); g.lineTo(bx-bw*0.18, horizon-H*0.008); }, 2);
  }
  // the storeroom door at the right — the bow came out through it
  const dw = W*0.082, dx = W*0.905, dtop = horizon - H*0.150;
  pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.150); }, toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.rect(dx+dw*0.26, dtop+H*0.014, dw*0.48, H*0.136); }, toneSolid(inkLevel(5)), 3);
  pen.paint(()=>{ g.rect(dx-W*0.016, dtop-H*0.010, W*0.016, H*0.160); }, toneSolid(inkLevel(3)), 3);
  pen.paint(()=>{ g.rect(dx-W*0.020, dtop-H*0.020, dw+W*0.040, H*0.012); }, toneSolid(inkLevel(4)), 3);
  // the great door at the left, small and far
  const gx0 = W*0.030, gw = W*0.062, gtop = horizon - H*0.118;
  pen.paint(()=>{ g.rect(gx0, gtop, gw, H*0.118); }, toneSolid(inkLevel(3)), 4);
  pen.paint(()=>{ g.rect(gx0+gw*0.28, gtop+H*0.012, gw*0.46, H*0.106); }, toneSolid(inkLevel(4)), 3);
}

/* ---------------- deterministic member build from params + state ---------- */
function buildMembers(W, H, stIn){
  const p = { ...params, ...stIn };
  const formation = p.formation || "queue";
  const attention = clamp01(p.attention);
  const mockShare = clamp01(p.mock);
  const density   = clamp01(p.density);
  const spent     = clamp01(p.spent);
  const fatigue   = clamp01(p.fatigue);
  const wave      = p.wave ?? params.wave;
  const sigma     = Math.max(0.05, p.waveSpread ?? params.waveSpread);
  const fg        = clamp01(p.foreground ?? params.foreground);
  const seed      = ((p.seed ?? params.seed) + (p.contestant|0)*17) >>> 0;
  let effort      = clamp01(p.effort);
  let headStance  = p.headStance || "grip";

  // formation presets: the line's shape, and what the man on the stand is doing
  let mockM = mockShare, attM = attention, scatter = 0;
  switch (formation){
    case "attempt":  headStance = p.headStance && stIn.headStance ? headStance : "strain";
                     effort = Math.max(effort, 0.80); attM = Math.max(attM, 0.92); break;
    case "fail":     headStance = stIn.headStance ? headStance : "fail";
                     effort = Math.max(effort, 0.55); mockM = Math.max(mockM, 0.62); break;
    case "handover": headStance = stIn.headStance ? headStance : "surrender";
                     effort = Math.min(effort, 0.25); break;
    case "mock":     mockM = Math.max(mockM, 0.80); attM = Math.max(attM, 0.85); break;
    case "warming":  headStance = stIn.headStance ? headStance : "warm";
                     effort = Math.min(effort, 0.30); attM = attention*0.75; break;
    case "spent":    headStance = stIn.headStance ? headStance : "fatigue";
                     attM = attention*0.55; break;
    case "scatter":  scatter = 1; attM = attention*0.45; break;
    default: break;
  }

  const members = [];
  const yLo = H*0.44, ySpan = H*0.50;
  const standX = STAND.x*W, standY = STAND.y*H;

  const featOf = rng => ({
    beard: rng() < 0.30,
    head:  (()=>{ const q = rng(); return q < 0.14 ? "fillet" : q < 0.94 ? "hair" : "bald"; })(),
    headS: 0.90 + rng()*0.22,
    cloak: rng() < 0.30,
    sword: rng() < 0.26,
  });
  // atmospheric depth: the far end of the queue prints LIGHT, the near men one
  // step darker. Nothing above level 5 — the line is contour, not mass.
  const shadeOf = (depth, cloak) => ({
    tunic: clamp(Math.round(lerp(2, 4, depth)) + (cloak ? 1 : 0), 1, 5),
    skin:  2,
    hair:  clamp(Math.round(lerp(4, 6, depth)), 4, 6),
    cloak: clamp(Math.round(lerp(3, 5, depth)), 3, 5),
  });

  /* ---- the man at the stand ---- */
  if (p.showHead !== false){
    const rng = rnd((seed + 101) >>> 0);
    const feat = featOf(rng); feat.cloak = false;      // he has thrown it off to try
    members.push({
      cx: standX, baseY: standY, s: 208,
      shade: { tunic:3, skin:2, hair:5, cloak:4 }, feat,
      headTurn: -0.10, face: 1, stance: headStance,
      effort, fatigue: fatigue*0.5, lean: headStance==="fail" ? -0.30 : 0.05,
      seated:false, back:false, bow: p.showBow !== false, depth:1, layer:"stand",
    });
  }

  /* ---- the next man up: braced, already holding his place ---- */
  if (p.showNext !== false && formation !== "scatter"){
    const rng = rng2(seed + 211);
    const feat = featOf(rng);
    members.push({
      cx: NEXT.x*W, baseY: NEXT.y*H, s: 168,
      shade: shadeOf(0.80, feat.cloak), feat,
      headTurn: clamp((standX - NEXT.x*W)/(W*0.22)*attM, -1, 1),
      face: -1,
      stance: formation === "handover" ? "grip" : (formation === "mock" ? "mock" : "watch"),
      effort: formation === "handover" ? 0.20 : 0, fatigue: fatigue*0.4,
      lean: 0.08, seated:false, back:false, bow:false, depth:0.80, layer:"queue-near",
    });
  }

  /* ---- the FAR band: the rest of the house watching from the back wall.
     Small, light, unevenly spaced so it never reads as a row of railings.
     This is the ensemble's BACKGROUND control. ---- */
  const BG = [0.098,0.196,0.292,0.388,0.478,0.884];
  const bgN = Math.round(BG.length * (0.35 + 0.65*density));
  for (let i=0;i<bgN && i<BG.length;i++){
    const rng = rng2(seed + 1301 + i*71);
    const px = BG[i]*W + (rng()-0.5)*W*0.018;
    const by = H*(0.472 + (i%3)*0.016) + (rng()-0.5)*H*0.007;
    const sB = 78 + rng()*14;
    const feat = featOf(rng); feat.sword = false; feat.cloak = rng() < 0.22;
    const rr = rng();
    members.push({
      cx:px, baseY:by, s:sB,
      shade:{ tunic:2, skin:1, hair:4, cloak:3 }, feat,
      headTurn: clamp((standX - px)/(W*0.34)*attM, -1, 1),
      face: px <= standX ? 1 : -1,
      stance: scatter ? "wait" : (rr < 0.28 ? "fold" : rr < 0.58 ? "wait"
                                : rr < 0.82 ? "watch" : "mock"),
      effort:0, fatigue: fatigue*0.45, lean:0.04,
      seated:false, back:false, bow:false, depth:0.02, layer:"far",
    });
  }

  /* ---- the QUEUE: the untried, standing in order down the hall ---- */
  const nQ = Math.max(1, Math.round((p.queueN ?? params.queueN) * (0.45 + 0.55*density) * (1 - spent*0.62)));
  for (let i=0;i<nQ && i<QUEUE_PATH.length;i++){
    const rng = rng2(seed + 401 + i*53);
    const u   = QUEUE_PATH.length>1 ? i/(QUEUE_PATH.length-1) : 0;
    let px = QUEUE_PATH[i].x*W + (rng()-0.5)*W*0.020;
    let by = QUEUE_PATH[i].y*H + (rng()-0.5)*H*0.008;
    if (scatter){ px += (px - standX)*0.14 + (rng()-0.5)*W*0.06; by += (rng()-0.5)*H*0.024; }
    px = clamp(px, W*0.055, W*0.945);
    by = clamp(by, H*0.44, H*0.94);
    const depth = clamp01((by - yLo)/ySpan);
    const s = lerp(80, 152, depth);

    // reaction-WAVE: the groan/laugh running down the line
    const d   = u - wave;
    const hit = clamp01(Math.exp(-(d*d)/(2*sigma*sigma)));

    const att = clamp01(attM + hit*0.30);
    let headTurn = clamp((standX - px)/(W*0.26) * att, -1, 1);
    if (att < 0.22) headTurn = (rng()-0.5)*1.4;

    const rr = rng();
    let stance;
    if (scatter)                     stance = rr < 0.42 ? "wait" : rr < 0.74 ? "mock" : "watch";
    else if (rr < mockM*0.62)        stance = rr < mockM*0.30 ? "jeer" : "mock";
    else if (rr < mockM*0.62 + 0.26) stance = "fold";
    else if (rr < mockM*0.62 + 0.52) stance = "watch";
    else                             stance = "wait";
    if (fatigue > 0.62 && rr > 0.55) stance = "fatigue";
    if (hit > 0.55) stance = rng() < 0.6 ? "jeer" : "mock";

    const feat = featOf(rng);
    members.push({
      cx:px, baseY:by, s, shade: shadeOf(depth, feat.cloak), feat,
      headTurn, face: px <= standX ? 1 : -1,
      stance, effort:0, fatigue: clamp01(fatigue*0.8 + hit*0.05),
      lean: clamp(0.06 + hit*0.30, -0.3, 0.6),
      seated:false, back:false, bow:false, depth, layer:"queue",
    });
  }

  /* ---- the BENCH: the ones who have already failed, sat back down ---- */
  const nB = Math.ceil(clamp01(spent) * (p.benchN ?? params.benchN));
  const seats = [];
  for (let i=0;i<nB && i<BENCH.length;i++){
    const rng = rng2(seed + 601 + i*89);
    const b = BENCH[i];
    const by = b.y*H;
    const depth = clamp01((by - yLo)/ySpan);
    const s = lerp(104, 138, depth);
    seats.push({ x:b.x*W, y:by + s*0.020, s });
    const feat = featOf(rng);
    members.push({
      cx: b.x*W, baseY: by, s, shade: shadeOf(depth*0.7, feat.cloak), feat,
      headTurn: clamp((standX - b.x*W)/(W*0.30)*attM*0.7, -1, 1),
      face: 1, stance: rng() < 0.34 ? "slump" : "fatigue",
      effort:0, fatigue: clamp01(0.62 + fatigue*0.38),
      lean: 0.16, seated: true, back:false, bow:false, depth, layer:"bench",
    });
  }

  /* ---- the near backs: two cropped members at the frame edges, so the line
     is seen from inside the crowd rather than across an empty floor ---- */
  if (fg > 0.02 && formation !== "scatter"){
    let k = 0;
    for (const [px, bY, sc] of [[0.886, 1.048, 162],[0.152, 1.140, 150]]){
      const rng = rng2(seed + 9001 + k*137);
      const s = sc * lerp(0.92, 1.0, fg);
      members.push({
        cx: px*W, baseY: H*bY, s,
        shade:{ tunic:2, skin:2, hair:4, cloak:2 },
        feat:{ beard:false, head: rng()<0.22 ? "fillet" : "hair", headS:1.0,
               cloak: rng()<0.5, sword:false },
        headTurn: (px < 0.5 ? 0.22 : -0.22), face: px < 0.5 ? 1 : -1,
        stance: k === 0 ? "wait" : "fold", effort:0, fatigue:fatigue*0.4,
        lean: 0.06, seated:false, back:true, bow:false, depth:1, layer:"foreground",
      });
      k++;
    }
  }

  members.sort((a,b)=> a.baseY - b.baseY);   // painter's order: back -> front
  return { members, seats, standX, standY, formation, effort,
           showStand: p.showStand, showHall: p.showHall };
}

/* small helper so every member gets an independent deterministic stream */
function rng2(s){ return rnd(s >>> 0); }

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st || {});
  const layers = (st && st.layers) ||
    ["hall","floor","far","stand","bench","queue","queue-near","foreground"];
  const has = l => layers.includes(l);
  const horizon = H*0.352;

  // lightest possible field — the line must read as contour on paper
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  if (has("hall") && B.showHall !== false) drawHall(pen, W, H, horizon);

  // floor: lines converging on the stand + three BROKEN depth courses
  if (has("floor")){
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.17;
    for (let i=-6;i<=6;i++){
      g.beginPath();
      g.moveTo(B.standX + i*W*0.165, H*0.995);
      g.lineTo(B.standX*0.5 + W*0.25 + i*W*0.030, horizon);
      g.stroke();
    }
    for (let j=1;j<=3;j++){
      const y = horizon + (H-horizon)*Math.pow(j/3.4, 1.6);
      const runs = j%2 ? [[0.00,0.28],[0.36,0.70],[0.79,1.00]] : [[0.05,0.42],[0.52,0.93]];
      for (const [a,b] of runs){ g.beginPath(); g.moveTo(W*a, y); g.lineTo(W*b, y); g.stroke(); }
    }
    g.globalAlpha = 1;
  }

  if (has("bench") && B.seats.length) drawBenchStubs(pen, W, H, B.seats);
  if (has("stand") && B.showStand !== false)
    drawStand(pen, W, H, B.standX, B.standY + H*0.012, clamp01(B.effort));

  for (const m of B.members){
    if (!has(m.layer)) continue;
    drawMember(pen, m);
  }
}

export const asset = {
  id:"ensemble.suitor-bow-challengers",
  type:"ENSEMBLE",
  name:"Suitor bow challengers",
  statusWord:"IN TURN",
  scene:"OD-B21-S03",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["hall","floor","far","stand","bench","queue","queue-near","foreground"],
  // normalized 0..1 anchors. The stand is the contested point; the bow, the
  // axe lane and every named challenger are placed there by the scene.
  anchors:{
    "stand:mark":{x:.335,y:.885},     "stand:next":{x:.630,y:.812},
    // paired contact stations — the bow changing hands must not resolve to one point
    "hand:off:a":{x:.395,y:.845},     "hand:off:b":{x:.520,y:.828},
    "bow:grip":{x:.430,y:.760},       "bow:tip":{x:.455,y:.612},
    "queue:head":{x:.780,y:.742},     "queue:mid":{x:.800,y:.607},
    "queue:tail":{x:.541,y:.487},     "queue:lane":{x:.720,y:.610},
    "bench:seat:a":{x:.120,y:.735},   "bench:seat:b":{x:.238,y:.688},
    "bench:seat:c":{x:.088,y:.638},
    "fire:tallow":{x:.185,y:.815},    "lane:aim":{x:.640,y:.905},
    "door:store":{x:.945,y:.255},     "door:great":{x:.060,y:.262},
    "wall:pegs":{x:.500,y:.212},      "threshold":{x:.060,y:.330},
    "row:queue":{x:.700,y:.600},      "row:bench":{x:.150,y:.690},
    "row:far":{x:.500,y:.410},
    "row:near":{x:.500,y:.960},
    "camera:wide":{x:.500,y:.600},    "camera:stand":{x:.360,y:.800},
  },
  // walkable / occupied regions for scene placement + pathing
  zones:{
    stand:{ x0:.170,y0:.820,x1:.510,y1:.950 },        // the bare floor he tries on
    "queue:lane":{ x0:.520,y0:.460,x1:.900,y1:.790 }, // where the untried stand
    "bench:left":{ x0:.040,y0:.590,x1:.340,y1:.790 }, // where the failures sit
    approach:{ x0:.780,y0:.300,x1:.980,y1:.520 },     // in from the storeroom door
    gap:{ x0:.300,y0:.900,x1:.720,y1:.999 },          // the open front, camera side
  },

  states:{
    initial:"queue",
    nodes:{
      // the line formed, the first man sizing the stave up
      queue:{    preview:{ formation:"queue", headStance:"grip", effort:0.30, spent:0.10,
                           fatigue:0.10, mock:0.25, attention:0.85, density:1.0, wave:1.4,
                           status:"IN TURN", progress:0.12 } },
      // the stave warmed and greased at the fire before the try
      warming:{  preview:{ formation:"warming", headStance:"warm", effort:0.20, spent:0.35,
                           fatigue:0.30, mock:0.20, attention:0.70, wave:1.4,
                           status:"WARMING", progress:0.26 } },
      // set against the instep, the body starting to come over it
      brace:{    preview:{ formation:"attempt", headStance:"brace", effort:0.55, spent:0.30,
                           fatigue:0.20, mock:0.25, attention:0.92, wave:1.4,
                           status:"BRACING", progress:0.38 } },
      // the haul: everything he has, and the string still short
      strain:{   preview:{ formation:"attempt", headStance:"strain", effort:0.95, spent:0.40,
                           fatigue:0.25, mock:0.20, attention:0.98, wave:1.4,
                           status:"STRAINING", progress:0.52 } },
      // it slips, and the groan runs down the line
      fail:{     preview:{ formation:"fail", headStance:"fail", effort:0.60, spent:0.45,
                           fatigue:0.35, mock:0.70, attention:0.95, wave:0.34, waveSpread:0.15,
                           status:"FAILED", progress:0.62 } },
      // the stave held out sideways: the next man's turn
      handover:{ preview:{ formation:"handover", headStance:"surrender", effort:0.15, spent:0.55,
                           fatigue:0.45, mock:0.35, attention:0.80, wave:1.4,
                           status:"PASSED ON", progress:0.70 } },
      // the line jeering the man on the stand
      mock:{     preview:{ formation:"mock", headStance:"brace", effort:0.50, spent:0.50,
                           fatigue:0.35, mock:0.85, attention:0.90, wave:1.4,
                           status:"JEERED", progress:0.66 } },
      // arms dead down the whole queue, the benches filling
      fatigue:{  preview:{ formation:"spent", headStance:"fatigue", effort:0.10, spent:0.85,
                           fatigue:0.85, mock:0.10, attention:0.55, density:0.8, wave:1.4,
                           status:"SPENT", progress:0.84 } },
      // every man tried and beaten: a stub of a line, three on the bench
      exhausted:{preview:{ formation:"spent", headStance:"fatigue", effort:0.05, spent:1.0,
                           fatigue:1.0, mock:0.05, attention:0.40, density:0.6, wave:1.4,
                           foreground:0.8, status:"ALL BEATEN", progress:0.93 } },
      // the order breaks up — men off the line, heads on the doors
      scatter:{  preview:{ formation:"scatter", headStance:"surrender", effort:0.10, spent:0.70,
                           fatigue:0.60, mock:0.30, attention:0.35, density:0.9, wave:1.4,
                           foreground:0, status:"BREAKING", progress:0.96 } },
      // a thin house — wide framings, or the contest early
      sparse:{   preview:{ formation:"queue", headStance:"grip", effort:0.25, spent:0.0,
                           fatigue:0.05, mock:0.15, attention:0.80, density:0.35, wave:1.4,
                           status:"THIN", progress:0.08 } },
    },
    edges:[
      ["queue","warming"],["warming","brace"],["queue","brace"],["brace","strain"],
      ["strain","fail"],["fail","mock"],["mock","handover"],["fail","handover"],
      ["handover","queue"],["handover","warming"],["queue","fatigue"],
      ["fatigue","exhausted"],["exhausted","scatter"],["mock","fatigue"],
      ["sparse","queue"],["queue","sparse"],["strain","mock"],
    ],
  },
  channels:["formation","headStance","effort","fatigue","mock","attention",
            "density","spent","contestant","wave","waveSpread","foreground","depth"],

  // neutral preview = the contest running: one man braced over the stave at
  // the stand, the next folded and waiting, the queue receding into the hall,
  // two already back on the bench, and the string a hand short of the nock
  preview:()=>({ formation:"queue", headStance:"brace", effort:0.58, fatigue:0.18,
                 mock:0.30, attention:0.88, density:1.0, spent:0.45, contestant:3,
                 wave:1.4, waveSpread:0.16, foreground:0.9,
                 status:"BRACING", progress:0.38 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
