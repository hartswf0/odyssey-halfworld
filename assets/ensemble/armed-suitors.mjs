/* ensemble.armed-suitors — the panic turning back into an army.
   ENSEMBLE asset. Book XXII, OD-B22-S04: Melanthius has got up the back stair
   and come down again with shields, helmets and spears out of the storeroom.
   Until this moment the hall was a hundred and eight unarmed men being shot at
   in the dark. Now the gear reaches them, and the mob REORGANIZES: a knot of
   scrambling bodies, one at a time, becomes a rank of spear throwers all facing
   the same way.

   The asset IS that conversion. ONE separable member template (drawMember)
   instanced deterministically across three depth bands, and a single scalar per
   member — `armed` — that decides everything about him: his stance, his gear,
   which way he faces, what he is looking at.

     wave         the ARMING FRONT. A radius opening out of the supply point
                  (the arms heap by the storeroom door, upper right). Men inside
                  the front have their gear; men outside it are still panicking.
                  `waveSpread` is the softness of the front — a hard front is a
                  drill, a soft one is a shambles. This is the reaction-wave.

     arming       the ceiling on `armed`. How much gear there is to go round.

     volley       what fraction of the armed men are in the release of a throw
                  rather than holding the cock. Drives the spears in flight.

   Per member `armed` collapses into three readable bands:
       armed = 0.0  PANICKED   crouched, arms over the head, or bolting, or
                               clawing at the heap — no gear, faces every way
       armed = 0.5  TAKING     shield coming onto the far arm, head down at it
       armed = 1.0  THROWER    helmet, corselet, shield forward, spear cocked,
                               front foot planted, head onto the threshold

   The unified read is the FACING: a panicked man faces any direction, an armed
   man faces the doorway. As the front sweeps, a scatter of directions resolves
   into one. Attention works the same way — an unarmed man looks at the ARMS, an
   armed man looks at the TARGET, and `attention` only says how hard.

   ENSEMBLE controls, all channels: formation (scramble | huddle | supply-line |
   ranks | volley | broken), density (deep bands thin first), attention, wave,
   waveSpread, arming, volley, rows/perRow/seatY (foreground and background
   grading).

   Nobody named is baked in. Melanthius is NOT drawn: what is drawn is the HEAP
   he fetched — the open chest, the leaning shields, the standing bundle of
   spears. Odysseus is NOT drawn: what is drawn is his line of fire — the great
   door at the far left, the floor running to it, an aiming bracket on the sill.
   Named suitors are placed by the scene on `head:*`. The conversion is reported
   as an instrument, a two-column ARMING TALLY (panicked emptying, armed
   filling), so the state is legible without reading a face. Solid grays + hard
   contour only; the engine dotify POST pass supplies the halftone. */
import { makePen, toneSolid, inkLevel, INK, ACCENT,
         clamp, clamp01, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

/* the separable stance set of the member template — the conversion is legible
   from silhouettes alone, before a single face is read */
export const STANCES = ["cower","bolt","claw","strap","cock","throw","guard"];
export const FORMATIONS = ["scramble","huddle","supply-line","ranks","volley","broken"];

const params = {
  formation:"volley",     // scramble | huddle | supply-line | ranks | volley | broken
  arming:1.0,             // ceiling on local armed-ness — how much gear there is
  rows:3,                 // depth bands, back -> front
  perRow:[7,6,6],         // members per band (density control)
  density:1.0,            // 0 = front band only .. 1 = the whole hall
  attention:0.86,         // 0 = heads wandering .. 1 = every head on its object
  wave:0.55,              // ARMING FRONT radius out of the heap, 0 .. ~1.5
  waveSpread:0.30,        // softness of the front (a drill vs a shambles)
  volley:0.34,            // fraction of the armed in the release of a throw
  supplyX:0.812,          // the arms heap: where the gear comes from
  supplyY:0.430,
  targetX:0.108,          // the great door: what they are throwing at
  targetY:0.352,
  seatY:0.905,            // front-band footline as a fraction of H
  showHall:true,          // broken wall panels, two doors, columns, empty pegs
  showSupply:true,        // the chest, the leaning shields, the spear bundle
  showGauge:true,         // the two-column arming tally
  showFront:true,         // the dashed arming-front arc
  showVolley:true,        // spears crossing the field
  showCover:true,         // overturned tables the panicked get behind
  seed:2244,
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

/* ---------------- a spear: shaft + leaf head + a bound grip ----------------
   Used held (in a member's fist) and loose (in flight). The shaft is a bare
   INK line, never a limb: pen.limb() lays a fixed ~8px black casing under its
   tone, which turns every shaft into a bar. Thin on purpose — the spears are
   the diagonal rhythm of this asset, not its mass. */
function spear(pen, bx, by, tx, ty, s, lw){
  const g = pen.ctx;
  const dx = tx-bx, dy = ty-by, L = Math.hypot(dx,dy)||1;
  const ux = dx/L, uy = dy/L, nx = -uy, ny = ux;
  const hl = Math.min(L*0.24, s*0.17), hw = Math.max(2.2, s*0.034);
  const jx = tx - ux*hl, jy = ty - uy*hl;
  pen.ink(()=>{ g.moveTo(bx, by); g.lineTo(jx, jy); }, Math.max(2.2, lw));
  pen.paint(()=>{
    g.moveTo(tx, ty);
    g.lineTo(jx + nx*hw, jy + ny*hw);
    g.lineTo(jx - ux*hl*0.30, jy - uy*hl*0.30);
    g.lineTo(jx - nx*hw, jy - ny*hw);
    g.closePath();
  }, toneSolid(inkLevel(5)), Math.max(2, lw*0.8));
  pen.ink(()=>{ g.moveTo(bx + ux*L*0.20 + nx*hw*0.9, by + uy*L*0.20 + ny*hw*0.9);
                g.lineTo(bx + ux*L*0.20 - nx*hw*0.9, by + uy*L*0.20 - ny*hw*0.9); },
          Math.max(2, lw*0.8));
}

/* ---------------- a shield: a LIGHT plane with one dark note ----------------
   The round shield is what keeps this crowd off the near-black end of the
   scale: a big disc of nearly bare paper with a hard rim and a small black
   boss. `edge` squashes it toward edge-on for a man in the throwing turn. */
function shield(pen, x, y, rx, ry, s, cw, rot){
  const g = pen.ctx;
  pen.paint(()=>{ g.ellipse(x, y, rx, ry, rot||0, 0, 7); }, toneSolid(inkLevel(1)), cw*1.7);
  pen.ink(()=>{ g.ellipse(x, y, rx*0.72, ry*0.72, rot||0, 0, 7); }, cw*0.8);
  pen.paint(()=>{ g.ellipse(x, y, rx*0.28, ry*0.28, rot||0, 0, 7); }, toneSolid(inkLevel(6)), cw*0.8);
  // two short spokes — never a full cross, so the disc keeps reading as paper
  pen.ink(()=>{ g.moveTo(x - rx*0.66, y - ry*0.30); g.lineTo(x - rx*0.32, y - ry*0.16);
                g.moveTo(x + rx*0.66, y + ry*0.30); g.lineTo(x + rx*0.32, y + ry*0.16); }, cw*0.7);
}

/* ---------------- ONE member ----------------
   Everything keyed off s (member height) so the same template serves the 74px
   back band and the 150px front band. A member with his back to the camera —
   one of the ones still shoving toward the heap — is drawn `back`: nape and
   hair, no face, and he carries less ink than a man facing us. */
function drawMember(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, feat = m.feat, F = m.face;
  const cw = Math.max(2, s*0.020);
  const st = m.stance;
  const kit = m.kit;                                  // {helm, shield, spear, corselet}
  const panic = 1 - m.armed;

  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const dark  = toneSolid(inkLevel(m.shade.hair));
  const metal = toneSolid(inkLevel(5));

  const crouch  = (st === "cower") ? 1 : 0;
  const hipY    = baseY - s*(0.320 - crouch*0.070);
  const shoY    = hipY - s*(0.400 - crouch*0.060);
  const tilt    = m.lean * s*0.095 * F;
  const sx      = cx + tilt;
  const turn    = m.turn;                             // 0 square on .. 1 in profile
  const shw     = s*0.180*(1 - turn*0.30), hemw = s*0.214*(1 - turn*0.16);
  const headR   = s*0.124*feat.headS;
  const headCy  = shoY - headR*(1.04 - crouch*0.34);
  const hx      = sx + m.headTurn*headR*0.24 + tilt*0.40;

  // ---- ground shadow: plants the body, adds no mass ----
  g.fillStyle = "rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*0.98, s*0.023, 0,0,7); g.fill();

  // ---- legs ----
  if (st === "cower"){
    // knees folded under him, both feet flat, weight low
    for (const k of [-1, 1]){
      const kx = cx + k*s*0.085, fx = cx + k*s*0.115;
      pen.limb(()=>{ g.moveTo(cx + k*s*0.050, hipY); g.lineTo(kx, hipY + s*0.130); }, skin, s*0.062);
      pen.limb(()=>{ g.moveTo(kx, hipY + s*0.130); g.lineTo(fx, baseY - s*0.018); }, skin, s*0.052);
      pen.paint(()=>{ g.ellipse(fx, baseY, s*0.052, s*0.022, 0,0,7); }, metal, cw*0.7);
    }
  } else if (st === "bolt" || st === "claw"){
    // mid-stride, the trailing leg thrown well back
    const lead = F*(st === "claw" ? 1 : 1);
    const fA = cx + lead*s*0.150, fB = cx - lead*s*0.130;
    pen.limb(()=>{ g.moveTo(cx - s*0.055, hipY); g.lineTo(fB, baseY - s*0.052); }, skin, s*0.060);
    pen.limb(()=>{ g.moveTo(cx + s*0.055, hipY); g.lineTo(fA, baseY - s*0.018); }, skin, s*0.062);
    pen.paint(()=>{ g.ellipse(fA, baseY, s*0.055, s*0.022, 0,0,7); }, metal, cw*0.7);
    pen.paint(()=>{ g.ellipse(fB, baseY - s*0.036, s*0.050, s*0.021, 0,0,7); }, metal, cw*0.7);
  } else {
    // the throwing brace: front foot planted toward the door, back foot turned out
    const fwd = (st === "cock" || st === "throw") ? s*(0.130 + (st==="throw" ? 0.048 : 0)) : s*0.062;
    const fA = cx + F*fwd, fB = cx - F*s*0.086;
    pen.limb(()=>{ g.moveTo(cx + s*0.058, hipY); g.lineTo(fA, baseY - s*0.018); }, skin, s*0.062);
    pen.limb(()=>{ g.moveTo(cx - s*0.058, hipY); g.lineTo(fB, baseY - s*0.018); }, skin, s*0.060);
    pen.paint(()=>{ g.ellipse(fA, baseY, s*0.056, s*0.022, 0,0,7); }, metal, cw*0.7);
    pen.paint(()=>{ g.ellipse(fB, baseY, s*0.052, s*0.022, 0,0,7); }, metal, cw*0.7);
    // greave: one bright band on the front shin of a fully armed man
    if (kit.helm) pen.paint(()=>{ g.rect(cx + F*fwd*0.72 - s*0.026, baseY - s*0.115, s*0.052, s*0.062); },
                            toneSolid(inkLevel(3)), cw*0.7);
  }

  // ---- FAR arm, behind the torso ----
  {
    const sh = { x: sx - F*shw*0.80, y: shoY + s*0.045 };
    let hand;
    if (st === "cower")      hand = { x: hx - F*headR*0.62, y: headCy - headR*0.92 };
    else if (st === "bolt")  hand = { x: sx - F*(shw + s*0.16), y: shoY + s*0.10 };
    else if (st === "claw")  hand = { x: sx + F*(shw + s*0.20), y: shoY - s*0.07 };
    else if (st === "throw") hand = { x: sx - F*(shw + s*0.10), y: shoY + s*0.06 };
    else                     hand = { x: sx + F*(shw + s*0.05), y: shoY + s*0.10 };
    arm(pen, sh, hand, -F, tunic, skin, s, 0.12);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.029, 0, 7); }, skin, cw*0.7);
    m.farHand = hand;
  }

  // ---- torso: short tunic trapezoid ----
  pen.paint(()=>{
    g.moveTo(sx-shw, shoY);
    g.lineTo(sx+shw, shoY);
    g.lineTo(cx+hemw, hipY);
    g.lineTo(cx-hemw, hipY);
    g.closePath();
  }, tunic, cw);
  pen.seam(()=>{ g.moveTo(cx-hemw*0.86, hipY-cw*0.8); g.lineTo(cx+hemw*0.86, hipY-cw*0.8); }, cw*0.7);

  // ---- corselet: a hard bronze yoke, only on a man who got the whole kit ----
  if (kit.corselet){
    pen.paint(()=>{
      g.moveTo(sx-shw*0.94, shoY + s*0.006);
      g.lineTo(sx+shw*0.94, shoY + s*0.006);
      g.lineTo(cx+hemw*0.80, hipY - s*0.088);
      g.lineTo(cx-hemw*0.80, hipY - s*0.088);
      g.closePath();
    }, toneSolid(inkLevel(2)), cw*1.1);
    pen.ink(()=>{ g.moveTo(sx - shw*0.34, shoY + s*0.030); g.lineTo(cx - hemw*0.28, hipY - s*0.096); }, cw*0.7);
  }

  // ---- SHIELD: where it is says what he is doing with it ----
  if (kit.shield){
    if (st === "strap"){
      // still coming onto the arm: low, tilted, both hands on the rim
      shield(pen, cx + F*s*0.13, hipY - s*0.020, s*0.148, s*0.116, s, cw, F*0.42);
    } else if (st === "cock"){
      shield(pen, sx + F*s*0.235, shoY + s*0.075, s*0.076, s*0.152, s, cw, 0);
    } else if (st === "throw"){
      shield(pen, sx - F*s*0.045, hipY - s*0.100, s*0.104, s*0.150, s, cw, 0);
    } else {
      shield(pen, sx + F*s*0.085, hipY - s*0.135, s*0.152, s*0.152, s, cw, 0);
    }
  }

  // ---- neck + head ----
  const hairT = m.back ? toneSolid(inkLevel(m.shade.hair - 2.2)) : dark;
  pen.paint(()=>{ g.rect(sx-headR*0.29, shoY-headR*0.58, headR*0.58, headR*0.88); }, skin, cw*0.8);

  if (m.back){
    // ---- the shovers, seen from behind, going up the hall toward the heap ----
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.94, headR*1.02, 0,0,7); }, hairT, cw);
    pen.paint(()=>{ g.rect(hx-headR*0.30, headCy+headR*0.52, headR*0.60, headR*0.34); }, skin, cw*0.8);
    pen.ink(()=>{ g.moveTo(hx-headR*0.44, headCy+headR*0.34);
                  g.lineTo(hx+headR*0.44, headCy+headR*0.34); }, Math.max(2, headR*0.15));
  } else {
    if (!kit.helm && feat.head !== "bald")
      pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.16, headR*1.10, headR*1.22, 0,0,7); }, hairT, cw*0.9);
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);

    // ---- face ----
    const eyeY = headCy - headR*0.04;
    const gx   = m.headTurn*headR*0.30;
    const eyeR = headR*0.115;
    const exL = hx - headR*0.32 + gx, exR = hx + headR*0.32 + gx;
    g.fillStyle = INK;
    if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(exR, eyeY, eyeR, eyeR*1.12, 0,0,7); g.fill(); }
    if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(exL, eyeY, eyeR, eyeR*1.12, 0,0,7); g.fill(); }
    // brows: hauled UP and apart by fright, driven down and level by the drill
    g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(2, headR*0.13);
    {
      const up = panic*headR*0.20;
      g.beginPath();
      g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.40 - up*0.30);
      g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.40 - up);
      g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.40 - up);
      g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.40 - up*0.30);
      g.stroke();
    }
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    g.moveTo(hx+gx*0.6, eyeY+headR*0.06);
    g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.38);
    g.stroke();
    // mouth: open on a frightened man, a set line on an armed one
    if (m.mouth > 0.26){
      pen.paint(()=>{ g.rect(hx+gx*0.7 - headR*(0.13+0.06*m.mouth), headCy+headR*0.44,
                             headR*(0.26+0.12*m.mouth), headR*(0.13+0.30*m.mouth)); },
                toneSolid(inkLevel(7)), cw*0.6);
    } else {
      g.strokeStyle = INK; g.lineWidth = Math.max(2, headR*0.12);
      g.beginPath();
      g.moveTo(hx-headR*0.22+gx, headCy+headR*0.56);
      g.lineTo(hx+headR*0.22+gx, headCy+headR*0.56);
      g.stroke();
    }
    if (feat.beard && !kit.helm)
      pen.paint(()=>{
        g.moveTo(hx-headR*0.52, headCy+headR*0.36);
        g.quadraticCurveTo(hx, headCy+headR*1.28, hx+headR*0.52, headCy+headR*0.36);
        g.quadraticCurveTo(hx, headCy+headR*0.72, hx-headR*0.52, headCy+headR*0.36);
      }, dark, cw*0.7);
  }

  // ---- HELMET: the one hard dark note per armed head ----
  if (kit.helm && !m.back){
    pen.paint(()=>{
      g.moveTo(hx-headR*1.00, headCy+headR*0.16);
      g.lineTo(hx-headR*1.00, headCy-headR*0.16);
      g.quadraticCurveTo(hx, headCy-headR*1.46, hx+headR*1.00, headCy-headR*0.16);
      g.lineTo(hx+headR*1.00, headCy+headR*0.16);
      g.lineTo(hx+headR*0.62, headCy+headR*0.10);
      g.quadraticCurveTo(hx, headCy-headR*0.30, hx-headR*0.62, headCy+headR*0.10);
      g.closePath();
    }, toneSolid(inkLevel(2)), cw*1.1);
    // nasal bar down the face — a single stroke, unmistakable at 74px
    pen.paint(()=>{ g.rect(hx + m.headTurn*headR*0.16 - headR*0.09, headCy-headR*0.26,
                           headR*0.18, headR*0.66); }, toneSolid(inkLevel(4)), cw*0.7);
    // crest: a short comb, fore-and-aft, the darkest thing on the member
    pen.paint(()=>{
      g.moveTo(hx - F*headR*0.80, headCy-headR*0.96);
      g.quadraticCurveTo(hx - F*headR*0.10, headCy-headR*2.26, hx + F*headR*0.62, headCy-headR*1.02);
      g.quadraticCurveTo(hx - F*headR*0.06, headCy-headR*1.44, hx - F*headR*0.80, headCy-headR*0.90);
    }, toneSolid(inkLevel(6)), cw*0.8);
  }

  // ---- NEAR arm: the stance IS the member's place in the conversion ----
  const sh = { x: sx + F*shw*0.82, y: shoY + s*0.045 };
  let hand, bend = 0.22, held = null;
  switch (st){
    case "cower":                                     // forearm clamped over the skull
      hand = { x: hx + F*headR*0.70, y: headCy - headR*0.96 }; bend = 0.34; break;
    case "bolt":                                      // arm thrown back running away
      hand = { x: sx + F*(shw + s*0.20), y: shoY - s*0.02 }; bend = 0.20; break;
    case "claw":                                      // both hands out at the heap
      hand = { x: sx + F*(shw + s*0.26), y: shoY - s*0.11 }; bend = 0.14; break;
    case "strap":                                     // hand on the shield rim, head down
      hand = { x: cx + F*s*0.24, y: hipY - s*0.060 }; bend = 0.30; break;
    case "cock":                                      // spear back at the ear, about to go
      hand = { x: sx - F*shw*0.34, y: shoY - s*0.150 }; bend = -0.30;
      held = "cock"; break;
    case "throw":                                     // the arm out, the spear already gone
      hand = { x: sx + F*(shw + s*0.29), y: shoY - s*0.070 }; bend = 0.12;
      held = "gone"; break;
    default:                                          // "guard": spear grounded, waiting
      hand = { x: sx + F*shw*0.98, y: shoY - s*0.020 }; bend = 0.18;
      held = "guard";
  }
  arm(pen, sh, hand, F, tunic, skin, s, bend);
  pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.032, 0, 7); }, skin, cw*0.7);

  // ---- the spear in his fist: always a steep diagonal, never a horizontal ----
  if (kit.spear && held === "cock")
    spear(pen, hand.x - F*s*0.140, hand.y + s*0.265,
               hand.x + F*s*0.500, hand.y - s*0.400, s, s*0.042);
  else if (kit.spear && held === "guard")
    spear(pen, cx + F*s*0.305, baseY - s*0.010,
               cx + F*s*0.230, shoY - s*0.700, s, s*0.042);
  else if (kit.spear && held === "gone" && m.followSpear)
    spear(pen, hand.x + F*s*0.185, hand.y - s*0.080,
               hand.x + F*s*0.700, hand.y - s*0.360, s, s*0.040);

  // ---- FRIGHT: two short diverging ticks over a man with no gear ----
  if (m.flinch){
    g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(2, s*0.024);
    for (const k of [-1, 1]){
      g.beginPath();
      g.moveTo(hx + k*headR*0.90, headCy - headR*1.30);
      g.lineTo(hx + k*headR*1.42, headCy - headR*1.86);
      g.stroke();
    }
  }
}

/* ---------------- overturned cover: a table on its side ----------------
   Book XXII's other furniture. A short tilted block per hiding man — never a
   span, never two at the same height, so the front band cannot stripe. */
function drawCover(pen, x, y, s, tip){
  const g = pen.ctx;
  const w = s*0.52, h = s*0.30;
  pen.paint(()=>{
    g.moveTo(x-w/2, y);
    g.lineTo(x-w/2 + tip*s*0.06, y-h);
    g.lineTo(x+w/2 + tip*s*0.06, y-h*0.82);
    g.lineTo(x+w/2, y+s*0.016);
    g.closePath();
  }, toneSolid(inkLevel(2)), Math.max(2, s*0.022));
  pen.ink(()=>{ g.moveTo(x-w*0.30 + tip*s*0.04, y-h*0.90); g.lineTo(x-w*0.30, y); }, Math.max(2, s*0.016));
  // one leg, sticking out of the wreck at an angle
  pen.limb(()=>{ g.moveTo(x+w*0.34, y-h*0.80); g.lineTo(x+w*0.62, y-h*1.34); },
           toneSolid(inkLevel(4)), Math.max(3, s*0.030));
}

/* ---------------- the SUPPLY: the arms heap, drawn, not manned ----------------
   Melanthius is cast separately; this is the geometry he empties. Nothing here
   spans the frame: a chest with its lid thrown back, two shields leaning on it,
   a bundle of spears splayed in a socket, one spare helmet on the lid. */
function drawSupply(pen, x, y, s){
  const g = pen.ctx;
  // THREE spears standing steeply out of the heap, well apart — the vertical
  // that says "weapons" from across the plate. Behind everything else.
  for (const [dxb, dxt, ht] of [[-0.14,-0.62,1.72],[0.10,0.24,2.02],[0.34,0.86,1.56]])
    spear(pen, x + s*(0.40+dxb), y - s*0.08, x + s*(0.40+dxt), y - s*ht, s, s*0.055);
  // the chest, thrown open: one block, one tilted lid, nothing spanning
  pen.paint(()=>{ g.rect(x-s*0.28, y-s*0.42, s*0.84, s*0.42); }, toneSolid(inkLevel(2)), 3.5);
  pen.seam(()=>{ g.moveTo(x+s*0.10, y-s*0.42); g.lineTo(x+s*0.10, y-s*0.02); }, 2.5);
  pen.paint(()=>{
    g.moveTo(x-s*0.28, y-s*0.42);
    g.lineTo(x-s*0.10, y-s*1.00);
    g.lineTo(x+s*0.46, y-s*0.94);
    g.lineTo(x+s*0.56, y-s*0.42);
    g.closePath();
  }, toneSolid(inkLevel(1)), 3.5);
  // TWO round shields tipped against the chest — the big light planes that key
  // the whole page, one face-on and one leaning off it
  shield(pen, x-s*0.74, y-s*0.34, s*0.44, s*0.50, s, 3.2, -0.16);
  shield(pen, x-s*0.16, y-s*0.20, s*0.30, s*0.40, s, 2.8, 0.20);
  // a spare helmet dumped on the lid: a dome with a comb
  pen.paint(()=>{
    g.moveTo(x+s*0.06, y-s*0.96);
    g.quadraticCurveTo(x+s*0.24, y-s*1.44, x+s*0.44, y-s*0.94);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  pen.paint(()=>{
    g.moveTo(x+s*0.10, y-s*1.20);
    g.quadraticCurveTo(x+s*0.26, y-s*1.72, x+s*0.40, y-s*1.16);
    g.quadraticCurveTo(x+s*0.26, y-s*1.40, x+s*0.10, y-s*1.20);
  }, toneSolid(inkLevel(6)), 2.5);
  // two short L brackets marking the issue point off the floor — a diagram
  pen.ink(()=>{
    g.moveTo(x-s*1.34, y+s*0.04); g.lineTo(x-s*1.10, y+s*0.04); g.lineTo(x-s*1.10, y-s*0.28);
    g.moveTo(x+s*1.10, y+s*0.04); g.lineTo(x+s*0.86, y+s*0.04); g.lineTo(x+s*0.86, y-s*0.28);
  }, 3);
}

/* ---------------- the ARMING TALLY: the conversion as an instrument ----------
   Two stacked-block columns — the left one emptying (still panicking), the
   right one filling (armed) — with an arrow between them. Geometry, never
   type: it survives the dot lattice at any size. */
function drawTally(pen, x, y, w, h, armedV, bandVals){
  const g = pen.ctx;
  const n = 8, cell = h/n, gap = w*1.90;
  const cols = [{ cx:x, v:1-armedV, hi:3 }, { cx:x+gap, v:armedV, hi:6 }];
  for (const c of cols){
    const filled = Math.round(clamp01(c.v)*n);
    for (let k=0;k<n;k++){
      const by = y + h - (k+1)*cell;
      const on = k < filled;
      pen.paint(()=>{ g.rect(c.cx, by+cell*0.16, w, cell*0.68); },
                toneSolid(inkLevel(on ? c.hi : 1)), 2.5);
    }
  }
  // the transfer arrow, panicked -> armed
  const ay = y + h*0.50;
  pen.ink(()=>{
    g.moveTo(x + w*1.16, ay); g.lineTo(x + gap - w*0.16, ay);
    g.moveTo(x + gap - w*0.16, ay); g.lineTo(x + gap - w*0.52, ay - h*0.045);
    g.moveTo(x + gap - w*0.16, ay); g.lineTo(x + gap - w*0.52, ay + h*0.045);
  }, 3);
  // the open bracket, so the instrument never reads as a closed box
  pen.ink(()=>{
    g.moveTo(x - w*0.44, y - cell*0.34); g.lineTo(x - w*0.44, y + h + cell*0.34);
    g.moveTo(x - w*0.44, y - cell*0.34); g.lineTo(x + w*0.34, y - cell*0.34);
    g.moveTo(x - w*0.44, y + h + cell*0.34); g.lineTo(x + w*0.34, y + h + cell*0.34);
  }, 3);
  // three per-band pips: how far the front has reached in back / mid / front
  for (let b=0;b<bandVals.length;b++){
    const py = y + h*0.14 + b*h*0.31;
    pen.paint(()=>{ g.rect(x + gap + w*1.46, py, w*0.70, w*0.70); },
              toneSolid(inkLevel(bandVals[b] > 0.45 ? 6 : 1)), 3);
  }
}

/* ---------------- the hall behind them: broken spans only ---------------- */
function drawHall(pen, W, H, horizon){
  const g = pen.ctx;
  // wall panels: separate, unequal, tone only — never a bar across the top
  const panels = [[0.052,0.176,0.050],[0.204,0.318,0.034],[0.348,0.452,0.062],[0.730,0.812,0.042]];
  for (const [a0,b0,ht] of panels)
    pen.fillPath(()=>{ g.rect(W*a0, horizon-H*ht, W*(b0-a0), H*ht); }, inkLevel(2));
  // the wall/floor join in SEGMENTS with real gaps
  for (const [a0,b0] of [[0.00,0.092],[0.148,0.336],[0.392,0.556],[0.612,0.788],[0.842,1.00]])
    pen.ink(()=>{ g.moveTo(W*a0, horizon); g.lineTo(W*b0, horizon); }, 2.5);
  // the EMPTY PEGS: Book XXII's premise. Two hooks with dashed ghosts of the
  // shields that used to hang on them and were carried out in the night.
  for (let i=0;i<2;i++){
    const px = W*(0.372 + i*0.086), py = horizon - H*0.136;
    pen.ink(()=>{ g.moveTo(px, py - H*0.026); g.lineTo(px, py); g.lineTo(px + W*0.020, py + H*0.008); }, 3);
    g.save(); g.strokeStyle = INK; g.globalAlpha = 0.42; g.lineWidth = 2.4;
    g.setLineDash([5,6]); g.beginPath(); g.ellipse(px, py + H*0.026, W*0.026, H*0.023, 0,0,7); g.stroke();
    g.setLineDash([]); g.restore();
  }
  // two columns, standing on the back wall, stopping at the horizon
  for (const px of [0.238, 0.776]){
    const bx = W*px, bw = W*0.034;
    pen.paint(()=>{ g.rect(bx-bw/2, H*0.126, bw, horizon-H*0.126); }, toneSolid(inkLevel(2)), 4);
    pen.paint(()=>{ g.rect(bx-bw*0.80, H*0.126, bw*1.60, H*0.022); }, toneSolid(inkLevel(3)), 4);
    pen.seam(()=>{ g.moveTo(bx-bw*0.18, H*0.158); g.lineTo(bx-bw*0.18, horizon-H*0.012); }, 2);
  }
  // THE GREAT DOOR, far left: the one they are throwing at, held and empty
  {
    const dx = W*0.012, dw = W*0.082, dtop = horizon - H*0.156;
    pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.156); }, toneSolid(inkLevel(1)), 3.5);
    pen.paint(()=>{ g.rect(dx-W*0.008, dtop-H*0.016, dw+W*0.016, H*0.013); }, toneSolid(inkLevel(3)), 3);
    pen.ink(()=>{ g.moveTo(dx+dw*0.50, dtop+H*0.010); g.lineTo(dx+dw*0.50, horizon-H*0.006); }, 2.5);
    // the aiming bracket on the sill — the line of fire, no figure in it
    pen.ink(()=>{
      g.moveTo(dx+dw*0.10, horizon+H*0.030); g.lineTo(dx+dw*0.10, horizon+H*0.006);
      g.lineTo(dx+dw*0.52, horizon+H*0.006);
      g.moveTo(dx+dw*1.34, horizon+H*0.030); g.lineTo(dx+dw*1.34, horizon+H*0.006);
      g.lineTo(dx+dw*0.92, horizon+H*0.006);
    }, 3);
  }
  // THE POSTERN, far right, standing OPEN — the way the gear came in
  {
    const dx = W*0.884, dw = W*0.070, dtop = horizon - H*0.132;
    pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.132); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.moveTo(dx-W*0.036, dtop+H*0.014); g.lineTo(dx, dtop);
                    g.lineTo(dx, horizon); g.lineTo(dx-W*0.036, horizon-H*0.012);
                    g.closePath(); }, toneSolid(inkLevel(2)), 3);
    pen.paint(()=>{ g.rect(dx-W*0.008, dtop-H*0.016, dw+W*0.016, H*0.012); }, toneSolid(inkLevel(3)), 3);
  }
}

/* ---------------- deterministic member build ---------------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = FORMATIONS.includes(p.formation) ? p.formation : "volley";
  const arming    = clamp01(p.arming ?? 1);
  const attention = clamp01(p.attention);
  const wave      = p.wave ?? params.wave;
  const sigma     = Math.max(0.06, p.waveSpread ?? params.waveSpread);
  const volley    = clamp01(p.volley ?? params.volley);
  const density   = clamp01(p.density);
  const rows      = Math.max(1, p.rows|0);
  const perRow    = p.perRow || params.perRow;
  const seatY     = p.seatY ?? params.seatY;
  const sxN       = p.supplyX ?? params.supplyX, syN = p.supplyY ?? params.supplyY;
  const txN       = p.targetX ?? params.targetX, tyN = p.targetY ?? params.targetY;
  const seed      = (p.seed ?? params.seed) >>> 0;
  const targetX   = txN*W;
  const supplyPx  = sxN*W;

  const members = [];
  const bandArm = [0,0,0], bandN = [0,0,0];

  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 1;                   // 0 = back .. 1 = front
    if (density < 1 && depth < (1-density)*0.9) continue;    // thin the deep bands first
    let n = perRow[Math.min(r, perRow.length-1)] || Math.max(2, 8-2*r);
    n = Math.max(2, Math.round(n * (0.55 + 0.45*density)));

    const scale = lerp(74, 150, depth);
    const rowY  = H*(0.545 + depth*(seatY-0.545));
    const xa = lerp(0.170, 0.090, depth), xb = lerp(0.830, 0.905, depth);
    const stagger = (r % 2) * 0.40;

    for (let i=0;i<n;i++){
      const rng = rnd((seed + r*211 + i*37 + 11) >>> 0);
      const t   = n>1 ? (i + stagger) / (n - 1 + stagger) : 0.5;
      const u   = 2*t - 1;                                   // -1 .. 1 across the band
      let px = lerp(xa, xb, t), by = rowY, cover = false;

      if (formation === "scramble"){
        px = clamp01(px + (rng()-0.5)*0.090);
        by = rowY + (rng()-0.5)*scale*0.26;
        cover = rng() < 0.20;
      } else if (formation === "huddle"){
        // pressed together away from the door, a tight knot up the right side
        px = lerp(px, 0.640, 0.34 + 0.16*depth);
        by = rowY - (1 - Math.abs(u)) * scale * 0.30;
      } else if (formation === "supply-line"){
        // a queue running back to the heap: the nearer the band, the further left
        px = lerp(px, lerp(0.815, 0.430, depth), 0.34) + (i%2 ? 0.030 : -0.030);
        by = rowY - (1 - Math.abs(u)) * scale * 0.18 - ((i%2) ? scale*0.14 : 0);
      } else if (formation === "ranks"){
        by = rowY - (1 - Math.pow(Math.abs(u), 1.6)) * scale * 0.10;
      } else if (formation === "volley"){
        // the throwing line: staggered forward, opened out toward the door
        px = clamp01(px - (1-depth)*0.030);
        by = rowY - ((i % 2) ? scale*0.19 : 0) - (1 - Math.abs(u))*scale*0.10;
        if (depth > 0.66 && u < -0.72) continue;             // keep the line of fire clear
      } else if (formation === "broken"){
        px = clamp01(px + Math.sign(u)*Math.pow(Math.abs(u), 0.55)*0.062);
        by = rowY + (rng()-0.5)*scale*0.14;
        if (Math.abs(u) < 0.30) continue;
        cover = rng() < 0.34;
      }
      px = clamp(px, 0.045, 0.955);
      const cx = W*px;

      // ---- the ARMING FRONT: gear as a radial function of distance to the heap ----
      const d = Math.hypot(px - sxN, ((by/H) - syN)*0.62) / 0.78;
      const reach = smooth(clamp01((wave - d)/sigma * 0.5 + 0.5));
      const armed = clamp01(arming * reach);
      const panic = 1 - armed;

      // ---- STANCE: one scalar, three bands, plus the volley phase on top ----
      let stance;
      if (armed < 0.26){
        // outside the front. The ones nearest it are already clawing at the heap.
        stance = (d < wave + sigma*1.30) ? "claw" : (rng() < 0.52 ? "cower" : "bolt");
      } else if (armed < 0.62){
        stance = (rng() < 0.72) ? "strap" : "claw";
      } else {
        if (formation === "ranks" || formation === "supply-line") stance = "guard";
        else if (rng() < volley) stance = "throw";
        else stance = (formation === "huddle" && rng() < 0.35) ? "guard" : "cock";
      }
      if (cover && armed > 0.62) cover = false;

      const kit = {
        shield:   armed > 0.34,
        spear:    armed > 0.55,
        helm:     armed > 0.66,
        corselet: armed > 0.78,
      };

      // ---- ATTENTION: an unarmed man looks at the ARMS, an armed man at the DOOR ----
      const lookX = lerp(supplyPx, targetX, smooth(armed));
      const att   = clamp01(attention * (0.34 + 0.66*armed));
      let headTurn = clamp((lookX - cx)/(W*0.30) * att, -1, 1);
      if (stance === "cower") headTurn = (rng()-0.5)*1.7;
      else if (att < 0.30)    headTurn = (rng()-0.5)*1.5;
      // an armed man is turned bodily onto the door; a frightened one is not
      const dirT = targetX > cx ? 1 : -1;
      const face = armed > 0.55 ? dirT
                 : (Math.abs(headTurn) < 0.06 ? (rng()<0.5?-1:1) : (headTurn>0 ? 1 : -1));

      const feat = {
        beard: rng() < 0.26,
        head:  (rng() < 0.94) ? "hair" : "bald",
        headS: 0.90 + rng()*0.20,
      };
      const shade = {
        // light planes, dark accents: tunics stay in the paper half of the scale
        tunic: clamp(Math.round(lerp(1.5, 2.3, depth)) + (rng()<0.26 ? 1 : 0), 1, 4),
        skin:  2,
        hair:  Math.round(lerp(5, 6, depth)),
      };

      // the shovers with their backs to us: unarmed, up the hall, near the heap
      const back = armed < 0.34 && depth < 0.62 && stance === "claw";

      members.push({
        cx, baseY:by, s:scale, depth, px, band:r, feat, shade, back, cover,
        headTurn, face, stance, kit, armed,
        turn:  (stance === "cock" || stance === "throw") ? 0.85
             : (stance === "guard") ? 0.30 : 0.12,
        lean:  (stance === "throw" ? 0.85 : stance === "cock" ? -0.30
             : stance === "bolt" ? -0.55 : stance === "claw" ? 0.62
             : stance === "cower" ? -0.20 : 0.0),
        mouth: clamp01(panic*1.05 - (stance==="claw" ? 0 : 0.10)),
        flinch: panic > 0.62 && (stance === "cower" || stance === "bolt"),
        followSpear: stance === "throw" && rng() < 0.34,
        coverTip: rng() < 0.5 ? -1 : 1,
      });
      const bi = Math.min(r, 2); bandArm[bi] += armed; bandN[bi] += 1;
    }
  }
  members.sort((a,b)=> a.baseY - b.baseY);   // painter's order: back -> front
  const total = members.length || 1;
  const level = members.reduce((s,m)=>s+m.armed, 0)/total;
  const bands = bandArm.map((h,i)=> bandN[i] ? h/bandN[i] : 0);
  return { members, level, bands, wave, sigma, volley, formation,
           sxN, syN, txN, tyN, targetX,
           showHall:p.showHall, showSupply:p.showSupply, showGauge:p.showGauge,
           showFront:p.showFront, showVolley:p.showVolley, showCover:p.showCover };
}

/* ---------------- spears crossing the field ----------------
   Thrown right-to-left at the door, at four different points of their flight.
   These are the diagonals that stop the composition sitting in rows. */
function drawVolley(pen, W, H, B){
  const n = Math.max(0, Math.round(B.volley*4));
  // start point + a fixed climb of about 25 degrees, up and to the left: a
  // rising diagonal, so a spear in flight can never be mistaken for a rule
  const lane = [[0.590,0.505,0.150],[0.455,0.612,0.126],
                [0.700,0.442,0.166],[0.350,0.668,0.112]];
  for (let k=0;k<n && k<lane.length;k++){
    const [lx, ly, ll] = lane[k];
    const bx = W*lx, by = H*ly;
    const tx = bx - W*ll*0.912, ty = by - W*ll*0.462;
    const ux = (tx-bx), uy = (ty-by), L = Math.hypot(ux,uy)||1;
    spear(pen, bx, by, tx, ty, W*0.15, Math.max(3.4, W*0.0092));
    // two speed ticks trailing the butt — motion, drawn as geometry
    pen.ink(()=>{
      for (const j of [1, 2]){
        const ox = bx - ux/L*W*0.016*j*2.0, oy = by - uy/L*W*0.016*j*2.0;
        pen.ctx.moveTo(ox, oy + H*0.006*j); pen.ctx.lineTo(ox + W*0.030, oy + H*0.008*j);
      }
    }, 3);
  }
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const layers = (st && st.layers) ||
    ["hall","gauge","floor","supply","band-back","band-mid","band-front","volley","arming-front"];
  const has = l => layers.includes(l);
  const horizon = H*0.300;

  // lightest possible field — the paper does most of the work
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);

  if (has("hall") && B.showHall !== false) drawHall(pen, W, H, horizon);

  if (has("gauge") && B.showGauge !== false)
    drawTally(pen, W*0.578, H*0.090, W*0.026, H*0.142, B.level, B.bands);

  // floor: lines converging on the DOOR, so the whole plate leans that way,
  // plus SHORT depth rules offset left and right — no span crosses the frame
  if (has("floor")){
    const fX = W*B.txN, fY = H*B.tyN;
    g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.28;
    for (let i=0;i<=9;i++){
      g.beginPath(); g.moveTo(fX, fY);
      g.lineTo(lerp(-W*0.06, W*1.14, i/9), H*1.02);
      g.stroke();
    }
    g.globalAlpha = 0.20;
    for (let j=2;j<=3;j++){
      const y = fY + (H-fY)*(j/4)*(j/4);
      g.beginPath(); g.moveTo(W*0.085, y); g.lineTo(W*0.340, y); g.stroke();
      g.beginPath(); g.moveTo(W*0.620, y - H*0.024); g.lineTo(W*0.918, y - H*0.024); g.stroke();
    }
    g.globalAlpha = 1;
  }

  if (has("supply") && B.showSupply !== false)
    drawSupply(pen, W*B.sxN, H*B.syN, W*0.086);

  // the crowd, back band -> front band; a hiding man gets his table after him
  const bandLayer = ["band-back","band-mid","band-front"];
  for (const m of B.members){
    if (!has(bandLayer[Math.min(m.band, 2)])) continue;
    drawMember(pen, m);
    if (m.cover && B.showCover !== false)
      drawCover(pen, m.cx + m.face*m.s*0.10, m.baseY + m.s*0.020, m.s, m.coverTip);
  }

  if (has("volley") && B.showVolley !== false && B.volley > 0.04) drawVolley(pen, W, H, B);

  // the arming front itself, read as an instrument: a dashed arc opening out of
  // the heap, with a small outward arrow on its leading edge
  if (has("arming-front") && B.showFront !== false && B.wave > 0.04 && B.wave < 1.20){
    const fX = W*B.sxN, fY = H*B.syN;
    const rx = B.wave*W*0.80, ry = B.wave*H*0.60;
    g.save();
    g.strokeStyle = ACCENT; g.globalAlpha = 0.78;
    g.lineWidth = Math.max(3, W*0.009);
    g.setLineDash([W*0.020, W*0.026]);
    g.beginPath(); g.ellipse(fX, fY, rx, ry, 0, Math.PI*0.52, Math.PI*1.44); g.stroke();
    g.setLineDash([]);
    g.lineWidth = Math.max(3, W*0.007);
    const ax = fX - rx;
    g.beginPath();
    g.moveTo(ax + W*0.030, fY); g.lineTo(ax - W*0.026, fY);
    g.moveTo(ax - W*0.026, fY); g.lineTo(ax + W*0.000, fY - H*0.014);
    g.moveTo(ax - W*0.026, fY); g.lineTo(ax + W*0.000, fY + H*0.014);
    g.stroke();
    g.restore();
  }
}

export const asset = {
  id:"ensemble.armed-suitors",
  type:"ENSEMBLE",
  name:"Armed suitors",
  statusWord:"ARMING",
  scene:"OD-B22-S04",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["hall","gauge","floor","supply","band-back","band-mid","band-front",
          "volley","arming-front"],
  // normalized 0..1 anchors — the scene places its named figures on these
  anchors:{
    "supply:heap":{x:.812,y:.430},     "supply:chest":{x:.790,y:.415},
    "supply:bundle":{x:.870,y:.300},   "door:postern":{x:.918,y:.240},
    "target:door":{x:.108,y:.352},     "target:sill":{x:.070,y:.330},
    "head:first-armed":{x:.720,y:.760}, "head:thrower":{x:.560,y:.900},
    "head:panicked":{x:.215,y:.885},   "head:strapping":{x:.660,y:.735},
    "head:bolting":{x:.140,y:.720},
    "line:fire":{x:.300,y:.560},       "gauge:arming":{x:.548,y:.170},
    "row:back":{x:.500,y:.545},        "row:mid":{x:.500,y:.725},
    "row:front":{x:.500,y:.905},
    "column:left":{x:.238,y:.200},     "column:right":{x:.776,y:.200},
    "peg:empty":{x:.415,y:.164},
    "camera:wide":{x:.500,y:.560},     "camera:line":{x:.400,y:.720},
  },
  zones:{
    crowd:{ x0:.05,y0:.46,x1:.96,y1:.96 },
    "front:inner":{ x0:.58,y0:.44,x1:.96,y1:.84 },
    "front:outer":{ x0:.05,y0:.52,x1:.62,y1:.96 },
    supply:{ x0:.68,y0:.22,x1:.97,y1:.50 },
    "line-of-fire":{ x0:.04,y0:.36,x1:.46,y1:.72 },
  },

  states:{
    initial:"panicked",
    nodes:{
      // before the gear comes down: a hundred unarmed men in the dark
      panicked:{  preview:{ formation:"scramble", arming:1.0, wave:0.0,
                            waveSpread:0.30, volley:0.0, attention:0.42,
                            density:1.0, status:"PANICKED" } },
      // the knot pressed up the right side, away from the door
      cornered:{  preview:{ formation:"huddle", arming:1.0, wave:0.10,
                            waveSpread:0.30, volley:0.0, attention:0.70,
                            density:1.0, status:"CORNERED" } },
      // Melanthius has opened the store: the queue back to the heap
      receiving:{ preview:{ formation:"supply-line", arming:1.0, wave:0.42,
                            waveSpread:0.34, volley:0.0, attention:0.76,
                            density:1.0, status:"RECEIVING" } },
      // THE CONVERSION, caught mid-sweep: armed at the heap, still panicking
      // at the door end — the asset's reason to exist
      arming:{    preview:{ formation:"volley", arming:1.0, wave:0.55,
                            waveSpread:0.30, volley:0.34, attention:0.86,
                            density:1.0, status:"ARMING" } },
      // gear all round, nobody has thrown yet: shields up, spears grounded
      ranked:{    preview:{ formation:"ranks", arming:1.0, wave:1.20,
                            waveSpread:0.26, volley:0.0, attention:0.94,
                            perRow:[7,6,6], density:1.0, status:"RANKED" } },
      // the volley itself — the whole line in the release
      volleying:{ preview:{ formation:"volley", arming:1.0, wave:1.20,
                            waveSpread:0.24, volley:0.90, attention:0.96,
                            density:1.0, status:"VOLLEYING" } },
      // the spears have all missed and the line has come apart again
      broken:{    preview:{ formation:"broken", arming:0.62, wave:1.20,
                            waveSpread:0.44, volley:0.20, attention:0.50,
                            density:1.0, status:"BROKEN" } },
      // a thin room for wide or early framings
      sparse:{    preview:{ formation:"volley", arming:1.0, wave:0.55,
                            waveSpread:0.30, volley:0.30, attention:0.86,
                            density:0.5, status:"THIN" } },
    },
    edges:[
      ["panicked","cornered"],["cornered","receiving"],["receiving","arming"],
      ["panicked","arming"],["arming","ranked"],["ranked","volleying"],
      ["arming","volleying"],["volleying","broken"],["broken","receiving"],
      ["broken","panicked"],["arming","sparse"],["sparse","volleying"],
    ],
  },
  channels:["formation","arming","wave","waveSpread","volley","attention",
            "density","rows","depth"],

  // neutral preview = the conversion caught mid-sweep: the men at the heap
  // helmeted and cocked, the men at the door end still on their knees
  preview:()=>({ formation:"volley", arming:1.0, wave:0.55, waveSpread:0.30,
                 volley:0.34, attention:0.86, density:1.0,
                 status:"ARMING", progress:0.55 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
