/* ensemble.suitor-terror-wave — the army coming apart again.
   ENSEMBLE asset. Book XXII, OD-B22-S05. `ensemble.armed-suitors` ran the
   conversion forwards: a panicking mob receives gear and hardens into a rank of
   spear throwers. This asset runs it BACKWARDS, and faster. Athena holds up the
   aegis from the roofbeam and the rank stops being a rank — the men drop what
   Melanthius fetched them and go out of the hall in every direction at once,
   "like cattle the darting gadfly has driven wild."

   ONE separable member template (`drawMember`) instanced deterministically over
   three depth bands, and ONE scalar per member — `terror` — that decides his
   stance, his gear, his facing and what he is looking at.

     wave         the TERROR FRONT. Unlike the arming front, this one opens
                  DOWNWARD, out of a point in the air (the aegis on the beam,
                  upper middle). Men the front has passed are broken; men it has
                  not reached are still holding the line. This is the
                  reaction-wave, and it sweeps top-to-bottom, not side-to-side.

     waveSpread   softness of the front. A hard front is a single shared instant
                  of fright; a soft one is a rumour going through the hall.

     panic        ceiling on local terror — how much of the crowd can break at
                  all. Below 1.0 a stubborn residue keeps its formation.

     rout         how far the broken have actually GOT. 0 = still on the spot
                  with their arms over their heads; 1 = out of frame.

   Per member `terror` collapses into six readable stances, and the ladder is
   the whole asset:
       0.00  RANK    shield up, spear level, helmeted, square on the threshold
       0.30  FLINCH  head snapped up at the thing on the beam, shield sagging
       0.52  SHED    the spear leaving the hand — gear in the air, not held
       0.72  COVER   crouched, both forearms over the skull, no gear left
       0.88  FLEE    bolting, mostly seen from behind, gone at the shoulders
       1.00  DOWN    trampled by the man behind him

   The unified read is the FACING. A man in rank faces the threshold: one
   direction, shared by everybody. A broken man faces his own way out, and the
   ways out diverge. So a single row of identical headings opens into a fan —
   and that fan is reported as an instrument, the HEADING ROSE at upper left,
   which is a pile of ticks at one angle while the line holds and a splay of
   ticks the moment it doesn't. Under it a cohesion strip counts the collapse.

   ENSEMBLE controls, all channels: formation (line | wedge | crumbling |
   scatter | stampede | strewn), density (deep bands thin first), attention,
   wave, waveSpread, panic, rout, rows/perRow/seatY (foreground/background
   grading), and per-layer toggles for a scene to occlude with.

   Nobody named is baked in. Athena is NOT drawn: what is drawn is the SOURCE —
   a small hard diagrammatic node hung under the beam, with `aegis:source` as
   its anchor so a scene can place `prop.aegis` exactly on it. Odysseus is NOT
   drawn: what is drawn is the threshold he is standing in, an open bracket at
   the far left with nothing in it. The room is `location.megaron-hall`; this
   asset carries only the beam, the floor and the doorway bracket it needs to
   stand up alone. Solid grays + hard contour; the engine POST pass supplies the
   halftone. Light planes, dark accents — the dropped shields are the paper. */
import { makePen, toneSolid, inkLevel, INK, ACCENT,
         clamp, clamp01, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

/* the separable stance set — the collapse is legible from silhouettes alone */
export const STANCES    = ["rank","flinch","shed","cover","flee","down"];
export const FORMATIONS = ["line","wedge","crumbling","scatter","stampede","strewn"];

const params = {
  formation:"crumbling",  // line | wedge | crumbling | scatter | stampede | strewn
  panic:1.0,              // ceiling on local terror — how much can break at all
  rows:3,                 // depth bands, back -> front
  perRow:[8,7,6],         // members per band (density control)
  density:1.0,            // 0 = front band only .. 1 = the whole hall
  attention:0.84,         // 0 = heads wandering .. 1 = every head on its object
  wave:0.58,              // TERROR FRONT radius out of the aegis footprint, 0..1.4
  waveSpread:0.28,        // softness of the front
  rout:0.40,              // how far the broken have got from where they stood
  sourceX:0.420,          // the aegis on the beam: where the fright comes from
  sourceY:0.118,
  targetX:0.072,          // the threshold: what the line was formed against
  targetY:0.330,
  seatY:0.906,            // front-band footline as a fraction of H
  showBeam:true,          // the two broken roofbeam stubs + hangers
  showSource:true,        // the small diagrammatic fright node under the beam
  showThreshold:true,     // the open doorway bracket at the far left
  showFloor:true,         // driven-outward floor rays + two broken depth rules
  showDropped:true,       // shed gear, in the air and lying on the boards
  showRose:true,          // the heading rose + cohesion strip
  showFlight:true,        // diverging flight vectors along the bottom
  showFront:true,         // the dashed terror front
  seed:2255,
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

/* ---------------- a spear: shaft + leaf head ----------------
   Held level by a man in rank, tumbling loose out of a man who is shedding.
   Thin: the spears are the diagonal rhythm here, never the mass. */
function spear(pen, bx, by, tx, ty, s, lw){
  const g = pen.ctx;
  const dx = tx-bx, dy = ty-by, L = Math.hypot(dx,dy)||1;
  const ux = dx/L, uy = dy/L, nx = -uy, ny = ux;
  const hl = Math.min(L*0.26, s*0.18), hw = s*0.034;
  const jx = tx - ux*hl, jy = ty - uy*hl;
  pen.limb(()=>{ g.moveTo(bx, by); g.lineTo(jx, jy); }, toneSolid(inkLevel(3)), Math.max(2, lw));
  pen.paint(()=>{
    g.moveTo(tx, ty);
    g.lineTo(jx + nx*hw, jy + ny*hw);
    g.lineTo(jx - ux*hl*0.34, jy - uy*hl*0.34);
    g.lineTo(jx - nx*hw, jy - ny*hw);
    g.closePath();
  }, toneSolid(inkLevel(5)), Math.max(2, lw*0.7));
}

/* ---------------- a shield: a LIGHT plane with one dark note ----------------
   Held, sagging, or lying face-up on the boards where he let go of it. Nearly
   bare paper inside a hard rim: this is what keeps the plate off the black end
   of the scale even when the hall is full of bodies. */
function shield(pen, x, y, rx, ry, s, cw, rot){
  const g = pen.ctx;
  pen.paint(()=>{ g.ellipse(x, y, rx, ry, rot||0, 0, 7); }, toneSolid(inkLevel(1)), cw*1.3);
  pen.ink(()=>{ g.ellipse(x, y, rx*0.72, ry*0.72, rot||0, 0, 7); }, cw*0.8);
  pen.paint(()=>{ g.ellipse(x, y, rx*0.26, ry*0.26, rot||0, 0, 7); }, toneSolid(inkLevel(6)), cw*0.8);
  pen.ink(()=>{ g.moveTo(x - rx*0.64, y - ry*0.28); g.lineTo(x - rx*0.30, y - ry*0.15);
                g.moveTo(x + rx*0.64, y + ry*0.28); g.lineTo(x + rx*0.30, y + ry*0.15); }, cw*0.7);
}

/* ---------------- a helmet, on a head or rolling on the floor ---------------- */
function helmet(pen, hx, hy, r, F, cw, crest){
  const g = pen.ctx;
  pen.paint(()=>{
    g.moveTo(hx-r*1.00, hy+r*0.16);
    g.lineTo(hx-r*1.00, hy-r*0.16);
    g.quadraticCurveTo(hx, hy-r*1.44, hx+r*1.00, hy-r*0.16);
    g.lineTo(hx+r*1.00, hy+r*0.16);
    g.lineTo(hx+r*0.62, hy+r*0.10);
    g.quadraticCurveTo(hx, hy-r*0.30, hx-r*0.62, hy+r*0.10);
    g.closePath();
  }, toneSolid(inkLevel(4)), cw*0.9);
  if (crest)
    pen.paint(()=>{
      g.moveTo(hx - F*r*0.66, hy-r*0.88);
      g.quadraticCurveTo(hx, hy-r*1.82, hx + F*r*0.52, hy-r*0.94);
      g.quadraticCurveTo(hx, hy-r*1.30, hx - F*r*0.66, hy-r*0.88);
    }, toneSolid(inkLevel(6)), cw*0.8);
}

/* ---------------- a man on the boards ----------------
   The end of the ladder. Sprawled low and long so he reads as floor, not as a
   crouching man: one tilted torso block, a head off the near end, two limbs
   thrown out. Very little ink — he must not become a black lump. */
function drawFallen(pen, m){
  const g = pen.ctx, s = m.s, cx = m.cx, y = m.baseY, F = m.face;
  const cw = Math.max(2, s*0.020);
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const dark  = toneSolid(inkLevel(m.shade.hair));
  g.fillStyle = "rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, y+s*0.012, s*0.34, s*0.030, 0,0,7); g.fill();
  // legs, thrown apart
  pen.limb(()=>{ g.moveTo(cx + F*s*0.06, y - s*0.055); g.lineTo(cx + F*s*0.30, y - s*0.014); }, skin, s*0.056);
  pen.limb(()=>{ g.moveTo(cx + F*s*0.06, y - s*0.055); g.lineTo(cx + F*s*0.24, y - s*0.120); }, skin, s*0.050);
  // torso block, tilted
  pen.paint(()=>{
    g.moveTo(cx - F*s*0.20, y - s*0.150);
    g.lineTo(cx + F*s*0.10, y - s*0.110);
    g.lineTo(cx + F*s*0.10, y - s*0.014);
    g.lineTo(cx - F*s*0.20, y - s*0.036);
    g.closePath();
  }, tunic, cw);
  // near arm, flung out ahead of him
  pen.limb(()=>{ g.moveTo(cx - F*s*0.16, y - s*0.130); g.lineTo(cx - F*s*0.40, y - s*0.052); }, skin, s*0.044);
  // head
  const hx = cx - F*s*0.28, hy = y - s*0.145;
  pen.paint(()=>{ g.ellipse(hx, hy, s*0.098, s*0.088, 0,0,7); }, skin, cw);
  pen.paint(()=>{ g.ellipse(hx - F*s*0.030, hy - s*0.020, s*0.078, s*0.066, 0,0,7); }, dark, cw*0.8);
  pen.ink(()=>{ g.moveTo(hx + F*s*0.020, hy + s*0.006); g.lineTo(hx + F*s*0.062, hy + s*0.010); }, cw*0.9);
}

/* ---------------- ONE member ----------------
   Everything keyed off `s` so the same template serves the 72px back band and
   the 150px front band. A man in flight is drawn `back` — nape and hair, no
   face — which is both the truth about a rout and a way of keeping ink down. */
function drawMember(pen, m){
  if (m.stance === "down") return drawFallen(pen, m);

  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, feat = m.feat, F = m.face;
  const cw = Math.max(2, s*0.020);
  const st = m.stance, kit = m.kit;

  const tunic = toneSolid(inkLevel(m.shade.tunic));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const dark  = toneSolid(inkLevel(m.shade.hair));
  const metal = toneSolid(inkLevel(5));

  const crouch  = m.crouch;
  const hipY    = baseY - s*(0.322 - crouch*0.086);
  const shoY    = hipY - s*(0.398 - crouch*0.066);
  const tilt    = m.lean * s*0.098 * F;
  const sx      = cx + tilt;
  const turn    = m.turn;
  const shw     = s*0.178*(1 - turn*0.28), hemw = s*0.212*(1 - turn*0.15);
  const headR   = s*0.122*feat.headS;
  const headCy  = shoY - headR*(1.04 - crouch*0.30) - m.lookUp*headR*0.34;
  const hx      = sx + m.headTurn*headR*0.24 + tilt*0.40;

  // ---- ground shadow: plants him, adds no mass ----
  g.fillStyle = "rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*0.96, s*0.023, 0,0,7); g.fill();

  // ---- legs ----
  if (st === "cover"){
    // knees folded under him, both feet flat, the whole man low
    for (const k of [-1, 1]){
      const kx = cx + k*s*0.088, fx = cx + k*s*0.118;
      pen.limb(()=>{ g.moveTo(cx + k*s*0.050, hipY); g.lineTo(kx, hipY + s*0.126); }, skin, s*0.060);
      pen.limb(()=>{ g.moveTo(kx, hipY + s*0.126); g.lineTo(fx, baseY - s*0.018); }, skin, s*0.050);
      pen.paint(()=>{ g.ellipse(fx, baseY, s*0.050, s*0.022, 0,0,7); }, metal, cw*0.7);
    }
  } else if (st === "flee"){
    // full stride, the trailing leg well back and off the boards
    const fA = cx + F*s*0.186, fB = cx - F*s*0.158;
    pen.limb(()=>{ g.moveTo(cx - s*0.052, hipY); g.lineTo(fB, baseY - s*0.086); }, skin, s*0.058);
    pen.limb(()=>{ g.moveTo(cx + s*0.052, hipY); g.lineTo(fA, baseY - s*0.016); }, skin, s*0.062);
    pen.paint(()=>{ g.ellipse(fA, baseY, s*0.054, s*0.022, 0,0,7); }, metal, cw*0.7);
    pen.paint(()=>{ g.ellipse(fB, baseY - s*0.070, s*0.048, s*0.021, 0,0,7); }, metal, cw*0.7);
  } else if (st === "shed"){
    // caught in the half turn away: front foot pivoting off the line
    const fA = cx + F*s*0.128, fB = cx - F*s*0.096;
    pen.limb(()=>{ g.moveTo(cx + s*0.056, hipY); g.lineTo(fA, baseY - s*0.018); }, skin, s*0.062);
    pen.limb(()=>{ g.moveTo(cx - s*0.056, hipY); g.lineTo(fB, baseY - s*0.018); }, skin, s*0.058);
    pen.paint(()=>{ g.ellipse(fA, baseY, s*0.055, s*0.022, 0,0,7); }, metal, cw*0.7);
    pen.paint(()=>{ g.ellipse(fB, baseY, s*0.050, s*0.022, 0,0,7); }, metal, cw*0.7);
  } else {
    // rank / flinch: the brace, front foot planted onto the threshold
    const fwd = st === "rank" ? s*0.130 : s*0.098;
    const fA = cx + F*fwd, fB = cx - F*s*0.086;
    pen.limb(()=>{ g.moveTo(cx + s*0.058, hipY); g.lineTo(fA, baseY - s*0.018); }, skin, s*0.062);
    pen.limb(()=>{ g.moveTo(cx - s*0.058, hipY); g.lineTo(fB, baseY - s*0.018); }, skin, s*0.060);
    pen.paint(()=>{ g.ellipse(fA, baseY, s*0.056, s*0.022, 0,0,7); }, metal, cw*0.7);
    pen.paint(()=>{ g.ellipse(fB, baseY, s*0.052, s*0.022, 0,0,7); }, metal, cw*0.7);
    // one bright greave band on a man still fully kitted
    if (kit.helm)
      pen.paint(()=>{ g.rect(cx + F*fwd*0.72 - s*0.026, baseY - s*0.112, s*0.052, s*0.060); },
                toneSolid(inkLevel(3)), cw*0.7);
  }

  // ---- FAR arm, behind the torso ----
  {
    const sh = { x: sx - F*shw*0.80, y: shoY + s*0.045 };
    let hand;
    if (st === "cover")      hand = { x: hx - F*headR*0.66, y: headCy - headR*0.98 };
    else if (st === "flee")  hand = { x: sx - F*(shw + s*0.20), y: shoY + s*0.100 };
    else if (st === "shed")  hand = { x: sx - F*(shw + s*0.13), y: shoY - s*0.060 };
    else if (st === "flinch")hand = { x: sx + F*(shw + s*0.02), y: shoY + s*0.140 };
    else                     hand = { x: sx + F*(shw + s*0.05), y: shoY + s*0.100 };
    arm(pen, sh, hand, -F, tunic, skin, s, 0.12);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.028, 0, 7); }, skin, cw*0.7);
  }

  // ---- torso: the hem is cut on the slant and the far shoulder dropped, so a
  //      man at 150px never resolves into a rectangle in the dot lattice ----
  const hemDrop = s*0.052*(st === "flee" ? 1.4 : st === "rank" ? 0.4 : 1);
  pen.paint(()=>{
    g.moveTo(sx-shw, shoY + s*0.014);
    g.lineTo(sx+shw, shoY - s*0.008);
    g.lineTo(cx+hemw*0.94, hipY - F*hemDrop*0.5);
    g.lineTo(cx-hemw, hipY + F*hemDrop*0.5);
    g.closePath();
  }, tunic, cw);
  // one slanting drapery seam + a short hem tick: no horizontal rule across him
  pen.seam(()=>{ g.moveTo(sx - F*shw*0.42, shoY + s*0.030);
                 g.lineTo(cx + F*hemw*0.30, hipY + F*hemDrop*0.16); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx - hemw*0.86, hipY + F*hemDrop*0.40);
                 g.lineTo(cx - hemw*0.12, hipY + F*hemDrop*0.16); }, cw*0.6);

  // ---- corselet: only the men the front has not reached still have one ----
  if (kit.corselet){
    pen.paint(()=>{
      g.moveTo(sx-shw*0.94, shoY + s*0.006);
      g.lineTo(sx+shw*0.94, shoY + s*0.006);
      g.lineTo(cx+hemw*0.80, hipY - s*0.086);
      g.lineTo(cx-hemw*0.80, hipY - s*0.086);
      g.closePath();
    }, toneSolid(inkLevel(3)), cw*0.9);
    pen.ink(()=>{ g.moveTo(sx - shw*0.30, shoY + s*0.028); g.lineTo(cx - hemw*0.24, hipY - s*0.094);
                  g.moveTo(sx + shw*0.30, shoY + s*0.028); g.lineTo(cx + hemw*0.24, hipY - s*0.094); }, cw*0.7);
  }

  // ---- SHIELD: where it is says how far down the ladder he has gone ----
  if (kit.shield){
    if (st === "rank")        shield(pen, sx + F*s*0.150, hipY - s*0.140, s*0.138, s*0.138, s, cw, 0);
    else if (st === "flinch") shield(pen, cx + F*s*0.180, hipY - s*0.010, s*0.132, s*0.108, s, cw, F*0.46);
    else                      shield(pen, cx + F*s*0.205, hipY + s*0.040, s*0.126, s*0.072, s, cw, F*0.86);
  }

  // ---- neck + head ----
  pen.paint(()=>{ g.rect(sx-headR*0.29, shoY-headR*0.58, headR*0.58, headR*0.88); }, skin, cw*0.8);

  if (m.back){
    // the runners, seen from behind: nape, hair, no face
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.94, headR*1.02, 0,0,7); },
              toneSolid(inkLevel(m.shade.hair - 2.0)), cw);
    pen.paint(()=>{ g.rect(hx-headR*0.30, headCy+headR*0.52, headR*0.60, headR*0.34); }, skin, cw*0.8);
    pen.ink(()=>{ g.moveTo(hx-headR*0.44, headCy+headR*0.34);
                  g.lineTo(hx+headR*0.44, headCy+headR*0.34); }, Math.max(2, headR*0.15));
  } else {
    if (!kit.helm && feat.head !== "bald")
      pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.16, headR*1.10, headR*1.22, 0,0,7); }, dark, cw*0.9);
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);

    // ---- face ----
    const eyeY = headCy - headR*0.04 - m.lookUp*headR*0.22;
    const gx   = m.headTurn*headR*0.30;
    const eyeR = headR*0.118*(1 + 0.20*m.terror);
    const exL = hx - headR*0.32 + gx, exR = hx + headR*0.32 + gx;
    g.fillStyle = INK;
    if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(exR, eyeY, eyeR, eyeR*1.14, 0,0,7); g.fill(); }
    if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(exL, eyeY, eyeR, eyeR*1.14, 0,0,7); g.fill(); }
    // brows: level and low in rank, hauled up and apart the instant he breaks
    g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(2, headR*0.13);
    {
      const up = m.terror*headR*0.24;
      g.beginPath();
      g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.40 - up*0.28);
      g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.40 - up);
      g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.40 - up);
      g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.40 - up*0.28);
      g.stroke();
    }
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    g.moveTo(hx+gx*0.6, eyeY+headR*0.08);
    g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.40 - m.lookUp*headR*0.14);
    g.stroke();
    // mouth: a set line under the helmet, a shout once the front has passed
    if (m.mouth > 0.26){
      pen.paint(()=>{ g.rect(hx+gx*0.7 - headR*(0.13+0.06*m.mouth), headCy+headR*0.44,
                             headR*(0.26+0.12*m.mouth), headR*(0.13+0.32*m.mouth)); },
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
        g.quadraticCurveTo(hx, headCy+headR*1.26, hx+headR*0.52, headCy+headR*0.36);
        g.quadraticCurveTo(hx, headCy+headR*0.72, hx-headR*0.52, headCy+headR*0.36);
      }, dark, cw*0.7);
  }

  // ---- HELMET: the last thing a man in rank still has ----
  if (kit.helm && !m.back){
    helmet(pen, hx, headCy, headR, F, cw, true);
    pen.paint(()=>{ g.rect(hx + m.headTurn*headR*0.16 - headR*0.10, headCy-headR*0.30,
                           headR*0.20, headR*0.70); }, toneSolid(inkLevel(5)), cw*0.7);
  }

  // ---- NEAR arm: the stance IS his place on the ladder ----
  const sh = { x: sx + F*shw*0.82, y: shoY + s*0.045 };
  let hand, bend = 0.22, held = null;
  switch (st){
    case "cover":                                    // forearm clamped over the skull
      hand = { x: hx + F*headR*0.72, y: headCy - headR*1.00 }; bend = 0.34; break;
    case "flee":                                     // arm driving back as he runs
      hand = { x: sx + F*(shw + s*0.22), y: shoY - s*0.030 }; bend = 0.18; break;
    case "shed":                                     // hand open, the spear already gone
      hand = { x: sx + F*(shw + s*0.16), y: shoY - s*0.170 }; bend = 0.10;
      held = "gone"; break;
    case "flinch":                                   // arm thrown up at the thing above
      hand = { x: hx + F*headR*1.10, y: headCy - headR*1.55 }; bend = 0.22;
      held = "sag"; break;
    default:                                         // rank: spear level at the threshold
      hand = { x: sx - F*shw*0.30, y: shoY - s*0.086 }; bend = -0.26;
      held = "level";
  }
  arm(pen, sh, hand, F, tunic, skin, s, bend);
  pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.031, 0, 7); }, skin, cw*0.7);

  // ---- the spear, while he still has hold of it ----
  if (kit.spear && held === "level")
    spear(pen, hand.x - F*s*0.130, hand.y + s*0.086,
               hand.x + F*s*0.400, hand.y - s*0.060, s, s*0.026);
  else if (kit.spear && held === "sag")
    spear(pen, cx + F*s*0.240, baseY - s*0.010,
               cx + F*s*0.070, shoY - s*0.360, s, s*0.026);

  // ---- FRIGHT: two short diverging ticks over a broken head ----
  if (m.flinchTicks){
    g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(2, s*0.024);
    for (const k of [-1, 1]){
      g.beginPath();
      g.moveTo(hx + k*headR*0.92, headCy - headR*1.32);
      g.lineTo(hx + k*headR*1.46, headCy - headR*1.90);
      g.stroke();
    }
  }
}

/* ---------------- what he let go of ----------------
   Two states: `air` (the shield still turning over between his hand and the
   boards) and lying flat. Both are big light discs — the ballast that keeps a
   hall full of panicking bodies off the black end of the scale. */
function drawDrop(pen, d, s){
  const cw = Math.max(2, s*0.020);
  if (d.kind === "shield")
    shield(pen, d.x, d.y, s*(d.air ? 0.150 : 0.175), s*(d.air ? 0.086 : 0.062), s, cw, d.rot);
  else if (d.kind === "helm")
    helmet(pen, d.x, d.y, s*0.108, 1, cw, false);
  else
    spear(pen, d.x - Math.cos(d.rot)*s*0.34, d.y - Math.sin(d.rot)*s*0.34,
               d.x + Math.cos(d.rot)*s*0.34, d.y + Math.sin(d.rot)*s*0.34, s, s*0.024);
}

/* ---------------- the SOURCE, drawn as a diagram, not as a goddess ----------
   A hard hub with a short radial burst and a fringe of tassels under it. The
   whole aegis proper is `prop.aegis`, placed by a scene on `aegis:source`; what
   is here is the node it hangs on, so this asset reads alone. */
function drawSource(pen, x, y, r){
  const g = pen.ctx;
  g.strokeStyle = INK; g.lineCap = "round";
  for (let k=0;k<12;k++){
    const a = k/12*Math.PI*2;
    const i0 = (k%2) ? 1.18 : 1.42, i1 = (k%2) ? 1.62 : 2.06;
    g.lineWidth = (k%2) ? Math.max(2, r*0.10) : Math.max(3, r*0.15);
    g.globalAlpha = (k%2) ? 0.45 : 0.78;
    g.beginPath();
    g.moveTo(x+Math.cos(a)*r*i0, y+Math.sin(a)*r*i0*0.86);
    g.lineTo(x+Math.cos(a)*r*i1, y+Math.sin(a)*r*i1*0.86);
    g.stroke();
  }
  g.globalAlpha = 1;
  // the face of it: a light plate, a hard rim, one black eye of a boss
  pen.paint(()=>{ g.ellipse(x, y, r*1.02, r*0.92, 0,0,7); }, toneSolid(inkLevel(1)), Math.max(3, r*0.11));
  pen.ink(()=>{ g.ellipse(x, y, r*0.70, r*0.62, 0,0,7); }, Math.max(2, r*0.07));
  pen.paint(()=>{ g.ellipse(x, y, r*0.26, r*0.24, 0,0,7); }, toneSolid(inkLevel(7)), Math.max(2, r*0.07));
  // tassel fringe: five short hard strokes, uneven
  g.strokeStyle = INK; g.lineWidth = Math.max(2, r*0.12);
  for (let k=0;k<5;k++){
    const tx = x + (k-2)*r*0.40;
    g.beginPath(); g.moveTo(tx, y + r*0.86);
    g.lineTo(tx + (k-2)*r*0.06, y + r*(1.34 + 0.22*((k*7)%3))); g.stroke();
  }
}

/* ---------------- the beam it hangs from: two stubs, never a span ---------- */
function drawBeam(pen, W, H, sxN, syN){
  const g = pen.ctx;
  const by = H*0.052, bh = H*0.026;
  for (const [a0,b0] of [[0.276,0.516],[0.596,0.792]])
    pen.paint(()=>{ g.rect(W*a0, by, W*(b0-a0), bh); }, toneSolid(inkLevel(2)), 3.5);
  pen.seam(()=>{ g.moveTo(W*0.330, by+bh*0.55); g.lineTo(W*0.494, by+bh*0.55); }, 2.2);
  // two hangers down to the node
  pen.ink(()=>{ g.moveTo(W*(sxN-0.026), by+bh); g.lineTo(W*(sxN-0.012), H*(syN-0.048));
                g.moveTo(W*(sxN+0.026), by+bh); g.lineTo(W*(sxN+0.012), H*(syN-0.048)); }, 3);
}

/* ---------------- the threshold, held and empty ---------------- */
function drawThreshold(pen, W, H, txN, tyN, horizon){
  const g = pen.ctx;
  const dx = W*0.014, dw = W*0.086, dtop = horizon - H*0.160;
  pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.160); }, toneSolid(inkLevel(1)), 3.5);
  pen.paint(()=>{ g.rect(dx-W*0.008, dtop-H*0.016, dw+W*0.016, H*0.013); }, toneSolid(inkLevel(3)), 3);
  pen.ink(()=>{ g.moveTo(dx+dw*0.52, dtop+H*0.010); g.lineTo(dx+dw*0.52, horizon-H*0.006); }, 2.5);
  // the standing bracket on the sill: the archer's place, with nobody in it
  pen.ink(()=>{
    g.moveTo(dx+dw*0.10, horizon+H*0.032); g.lineTo(dx+dw*0.10, horizon+H*0.006);
    g.lineTo(dx+dw*0.54, horizon+H*0.006);
    g.moveTo(dx+dw*1.30, horizon+H*0.032); g.lineTo(dx+dw*1.30, horizon+H*0.006);
    g.lineTo(dx+dw*0.92, horizon+H*0.006);
  }, 3);
}

/* ---------------- THE HEADING ROSE: the rout as an instrument --------------
   Nine bins of heading, drawn as radial bars over a half-round. One tall bar =
   a rank facing one way. A splay of short bars = a scattered crowd. Under it a
   cohesion strip: eight blocks, filling from the left, that empty as the fan
   opens. Geometry only — it survives the dot lattice at any size. */
function drawRose(pen, x, y, r, bins, cohesion){
  const g = pen.ctx;
  const n = bins.length;
  const max = Math.max(1, ...bins);
  // the base rule, in two pieces so it never reads as a bar
  pen.ink(()=>{ g.moveTo(x-r*1.16, y); g.lineTo(x-r*0.40, y);
                g.moveTo(x+r*0.40, y); g.lineTo(x+r*1.16, y); }, 3);
  for (let k=0;k<n;k++){
    const a = Math.PI*(1 - k/(n-1));
    const L = r*(0.44 + 0.66*(bins[k]/max));
    const on = bins[k] > 0;
    g.strokeStyle = INK; g.lineCap = "butt";
    g.lineWidth = on ? Math.max(4, r*0.085) : Math.max(2, r*0.026);
    g.globalAlpha = on ? 1 : 0.22;
    g.beginPath();
    g.moveTo(x + Math.cos(a)*r*0.30, y - Math.sin(a)*r*0.30);
    g.lineTo(x + Math.cos(a)*L,      y - Math.sin(a)*L);
    g.stroke();
  }
  g.globalAlpha = 1;
  // hub
  pen.paint(()=>{ g.arc(x, y, r*0.10, 0, 7); }, toneSolid(inkLevel(6)), 2.5);
  // cohesion strip: eight blocks, well clear of the rule, filling from the left
  const cw = r*0.22, ch = r*0.20, gap = r*0.11;
  const filled = Math.round(clamp01(cohesion)*8);
  const x0 = x - (8*cw + 7*gap)/2, sy = y + r*0.46;
  for (let k=0;k<8;k++)
    pen.paint(()=>{ g.rect(x0 + k*(cw+gap), sy, cw, ch); },
              toneSolid(inkLevel(k < filled ? 5 : 1)), 2.5);
  // open bracket, so the instrument never reads as a closed box
  pen.ink(()=>{
    g.moveTo(x - r*1.34, y - r*0.16); g.lineTo(x - r*1.34, sy + ch + r*0.14);
    g.lineTo(x - r*1.02, sy + ch + r*0.14);
    g.moveTo(x + r*1.34, y - r*0.16); g.lineTo(x + r*1.34, sy + ch + r*0.14);
    g.lineTo(x + r*1.02, sy + ch + r*0.14);
  }, 3);
}

/* ---------------- deterministic member build ---------------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = FORMATIONS.includes(p.formation) ? p.formation : "crumbling";
  const panicCap  = clamp01(p.panic ?? 1);
  const attention = clamp01(p.attention);
  const wave      = p.wave ?? params.wave;
  const sigma     = Math.max(0.06, p.waveSpread ?? params.waveSpread);
  const rout      = clamp01(p.rout ?? params.rout);
  const density   = clamp01(p.density);
  const rows      = Math.max(1, p.rows|0);
  const perRow    = p.perRow || params.perRow;
  const seatY     = p.seatY ?? params.seatY;
  const sxN       = p.sourceX ?? params.sourceX, syN = p.sourceY ?? params.sourceY;
  const txN       = p.targetX ?? params.targetX, tyN = p.targetY ?? params.targetY;
  const seed      = (p.seed ?? params.seed) >>> 0;
  const targetX   = txN*W;

  const members = [], drops = [];
  const bins = new Array(9).fill(0);
  let vx = 0, vy = 0, nHead = 0;

  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 1;                   // 0 = back .. 1 = front
    if (density < 1 && depth < (1-density)*0.9) continue;    // thin the deep bands first
    let n = perRow[Math.min(r, perRow.length-1)] || Math.max(2, 8-2*r);
    n = Math.max(2, Math.round(n * (0.55 + 0.45*density)));

    const scale = lerp(72, 150, depth);
    const rowY  = H*(0.548 + depth*(seatY-0.548));
    const xa = lerp(0.168, 0.086, depth), xb = lerp(0.836, 0.912, depth);
    const stagger = (r % 2) * 0.42;

    for (let i=0;i<n;i++){
      const rng = rnd((seed + r*197 + i*41 + 13) >>> 0);
      const t   = n>1 ? (i + stagger) / (n - 1 + stagger) : 0.5;
      const u   = 2*t - 1;                                   // -1 .. 1 across the band
      let px = lerp(xa, xb, t), by = rowY;

      // ---- the TERROR FRONT ----
      // Measured on the FLOOR, not on the plate. The aegis is up on the near
      // beam, so its footprint is at the near end of the hall: the front band
      // under it goes first and the front rolls UP the hall, away from us. That
      // is why the small figures at the back are still a rank while the big
      // ones in the foreground are already heels and dropped shields.
      const pre = Math.hypot(px - sxN, (1 - depth)*0.58);
      const reach = smooth(clamp01((wave - pre)/sigma * 0.5 + 0.5));
      const terror = clamp01(panicCap * reach);

      // which way out he takes: away from the middle of the hall, and a few
      // (the ones that make it a rout and not a manoeuvre) the wrong way
      let out = (px < 0.42) ? -1 : 1;
      if (rng() < 0.18) out = -out;

      // ---- formation displaces him; `rout` says how far he has actually got ----
      const push = terror*rout;
      if (formation === "line"){
        by = rowY - (1 - Math.pow(Math.abs(u), 1.7))*scale*0.09;
      } else if (formation === "wedge"){
        px = lerp(px, 0.46 + u*0.34, 0.30);
        by = rowY - (1 - Math.abs(u))*scale*0.24;
      } else if (formation === "crumbling"){
        // the line still legible at the back, already coming apart at the front
        px = clamp01(px + out*push*0.14*(0.4 + depth));
        by = rowY - (1 - Math.pow(Math.abs(u), 1.7))*scale*0.09
                  + (rng()-0.5)*scale*(0.075 + 0.22*terror);
      } else if (formation === "scatter"){
        px = clamp01(px + out*push*0.22 + (rng()-0.5)*0.070);
        by = rowY + (rng()-0.5)*scale*0.30;
      } else if (formation === "stampede"){
        // everything driven at the two side walls, a hole opening in the middle
        px = clamp01(px + out*(0.10 + push*0.26));
        by = rowY - (1 - Math.abs(u))*scale*0.16 + (rng()-0.5)*scale*0.12;
        if (Math.abs(px - 0.46) < 0.055*(1 + rout)) continue;
      } else if (formation === "strewn"){
        px = clamp01(px + (rng()-0.5)*0.090);
        by = rowY + (rng()-0.5)*scale*0.24;
      }
      px = clamp(px, 0.076, 0.924);
      const cx = W*px;

      // ---- STANCE: one scalar, six bands ----
      let stance;
      if      (terror < 0.30) stance = "rank";
      else if (terror < 0.52) stance = "flinch";
      else if (terror < 0.72) stance = (rng() < 0.74) ? "shed" : "flinch";
      else if (terror < 0.88) stance = (rng() < 0.58) ? "cover" : "flee";
      else                    stance = (rng() < 0.86) ? "flee"  : "down";
      if (formation === "strewn" && terror > 0.60 && rng() < 0.50) stance = "down";
      if (formation === "line") stance = terror < 0.42 ? "rank" : stance;

      const kit = {
        shield:   terror < 0.58,
        spear:    terror < 0.66,
        helm:     terror < 0.44,
        corselet: terror < 0.34,
      };

      // ---- what he let go of, and where it is now ----
      if (stance === "shed" || (terror > 0.62 && rng() < 0.62)){
        const air = stance === "shed" && rng() < 0.62;
        const kind = rng() < 0.46 ? "shield" : (rng() < 0.62 ? "spear" : "helm");
        drops.push({
          kind, s:scale, air,
          x: cx - (out)*scale*(air ? 0.32 : 0.46) + (rng()-0.5)*scale*0.16,
          y: by - (air ? scale*(0.40 + 0.16*rng()) : scale*0.010),
          rot: (rng()-0.5)*2.4,
          depth,
        });
      }

      // ---- ATTENTION: rank looks at the threshold, the broken look UP, then
      //      at nothing but the way out ----
      const lookX = terror < 0.46 ? targetX : cx + out*W*0.34;
      const att   = clamp01(attention * (1 - 0.42*terror));
      let headTurn = clamp((lookX - cx)/(W*0.28) * att, -1, 1);
      if (stance === "cover") headTurn = (rng()-0.5)*1.6;
      // the head goes up at the beam right on the front — a bell on terror
      const lookUp = clamp01(1 - Math.abs(terror - 0.46)/0.30) * (stance==="rank" ? 0.35 : 1);

      // a man in rank is turned bodily onto the threshold; a broken man is not
      const dirT = targetX > cx ? 1 : -1;
      const face = terror < 0.46 ? dirT : out;

      // the runners give us their backs (and the deep band gives more of them)
      const back = stance === "flee" && rng() < (0.52 + 0.28*(1-depth));

      const feat = { beard: rng() < 0.26,
                     head: (rng() < 0.94) ? "hair" : "bald",
                     headS: 0.90 + rng()*0.20 };
      const shade = {
        // light planes, dark accents: tunics stay in the paper half of the scale
        tunic: clamp(Math.round(lerp(1.5, 2.3, depth)) + (rng()<0.24 ? 1 : 0), 1, 4),
        skin:  2,
        hair:  Math.round(lerp(5, 6, depth)),
      };

      // heading for the rose: rank all land in one bin, the broken splay out
      const heading = terror < 0.46 ? (dirT < 0 ? Math.PI : 0)
                    : Math.atan2(0.30 + 0.55*rng(), out*(0.6 + 0.4*rng())) * 0 +
                      (out < 0 ? Math.PI*(0.62 + 0.30*rng()) : Math.PI*(0.38 - 0.30*rng()));
      const hb = clamp(Math.round((1 - heading/Math.PI)*8), 0, 8);
      bins[hb] += 1;
      vx += Math.cos(heading); vy += Math.sin(heading); nHead += 1;

      members.push({
        cx, baseY:by, s:scale, depth, px, band:r, feat, shade, back,
        terror, stance, kit, face, headTurn, lookUp,
        crouch: stance === "cover" ? 1 : (stance === "flinch" ? 0.26 : 0),
        turn:  stance === "rank" ? 0.72 : stance === "flee" ? 0.80 : 0.20,
        lean:  stance === "flee"   ?  0.92 : stance === "shed"  ? -0.52
             : stance === "flinch" ? -0.44 : stance === "cover" ? -0.18 : 0.10,
        mouth: clamp01(terror*1.25 - 0.20),
        flinchTicks: terror > 0.36 && terror < 0.80 && stance !== "flee",
      });
    }
  }

  members.sort((a,b)=> a.baseY - b.baseY);   // painter's order: back -> front
  drops.sort((a,b)=> a.y - b.y);
  const total = members.length || 1;
  const level = members.reduce((s,m)=>s+m.terror, 0)/total;
  const cohesion = nHead ? Math.hypot(vx, vy)/nHead : 1;
  return { members, drops, bins, level, cohesion, wave, sigma, rout, formation,
           sxN, syN, txN, tyN, targetX,
           showBeam:p.showBeam, showSource:p.showSource, showThreshold:p.showThreshold,
           showFloor:p.showFloor, showDropped:p.showDropped, showRose:p.showRose,
           showFlight:p.showFlight, showFront:p.showFront };
}

/* ---------------- the flight vectors: the fan, along the bottom margin ------
   Four arrows diverging out of the point under the aegis. Broken into two
   pieces each, so nothing crosses the plate as a rule. */
function drawFlight(pen, W, H, B){
  const g = pen.ctx;
  const ox = W*B.sxN, oy = H*0.958;
  const legs = [[-0.36,-0.062],[-0.20,-0.026],[0.19,-0.030],[0.35,-0.068]];
  g.save();
  g.strokeStyle = ACCENT; g.lineCap = "round"; g.lineWidth = Math.max(3, W*0.008);
  for (const [dx, dy] of legs){
    const a = 0.30 + 0.42*Math.abs(dx);
    const x0 = ox + W*dx*a*0.35, y0 = oy + H*dy*a*0.35;
    const x1 = ox + W*dx,        y1 = oy + H*dy;
    g.globalAlpha = 0.55;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(lerp(x0,x1,0.44), lerp(y0,y1,0.44)); g.stroke();
    g.globalAlpha = 0.85;
    g.beginPath(); g.moveTo(lerp(x0,x1,0.60), lerp(y0,y1,0.60)); g.lineTo(x1, y1); g.stroke();
    const ux = Math.sign(dx), a2 = W*0.026;
    g.beginPath();
    g.moveTo(x1, y1); g.lineTo(x1 - ux*a2, y1 - H*0.011);
    g.moveTo(x1, y1); g.lineTo(x1 - ux*a2, y1 + H*0.009);
    g.stroke();
  }
  g.restore();
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const layers = (st && st.layers) ||
    ["floor","beam","threshold","rose","source","dropped",
     "band-back","band-mid","band-front","flight","terror-front"];
  const has = l => layers.includes(l);
  const horizon = H*0.300;

  // the lightest possible field — the paper does most of the work
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);

  // ---- floor: rays DRIVEN OUTWARD from the point under the aegis, plus two
  //      short depth rules offset left and right. No span crosses the frame.
  if (has("floor") && B.showFloor !== false){
    const fX = W*B.sxN, fY = horizon - H*0.010;
    g.strokeStyle = INK; g.lineWidth = 2.6; g.globalAlpha = 0.24;
    for (let i=0;i<=10;i++){
      if (i === 5) continue;
      g.beginPath(); g.moveTo(fX, fY);
      g.lineTo(lerp(-W*0.10, W*1.18, i/10), H*1.02);
      g.stroke();
    }
    g.globalAlpha = 0.20;
    for (let j=2;j<=3;j++){
      const y = fY + (H-fY)*(j/4)*(j/4);
      g.beginPath(); g.moveTo(W*0.070, y); g.lineTo(W*0.322, y); g.stroke();
      g.beginPath(); g.moveTo(W*0.640, y - H*0.026); g.lineTo(W*0.932, y - H*0.026); g.stroke();
    }
    g.globalAlpha = 0.26;
    for (const [a0,b0] of [[0.00,0.086],[0.150,0.330],[0.398,0.560],[0.618,0.792],[0.848,1.00]]){
      g.beginPath(); g.moveTo(W*a0, horizon); g.lineTo(W*b0, horizon); g.stroke();
    }
    g.globalAlpha = 1;
  }

  if (has("beam") && B.showBeam !== false) drawBeam(pen, W, H, B.sxN, B.syN);
  if (has("threshold") && B.showThreshold !== false)
    drawThreshold(pen, W, H, B.txN, B.tyN, horizon);
  if (has("rose") && B.showRose !== false)
    drawRose(pen, W*0.776, H*0.212, W*0.118, B.bins, B.cohesion);
  if (has("source") && B.showSource !== false)
    drawSource(pen, W*B.sxN, H*B.syN, W*0.046);

  // shed gear that has already reached the boards, under everybody's feet
  if (has("dropped") && B.showDropped !== false)
    for (const d of B.drops) if (!d.air) drawDrop(pen, d, d.s);

  // the crowd, back band -> front band
  const bandLayer = ["band-back","band-mid","band-front"];
  for (const m of B.members){
    if (!has(bandLayer[Math.min(m.band, 2)])) continue;
    drawMember(pen, m);
  }

  // gear still in the air belongs in front of the man who threw it away
  if (has("dropped") && B.showDropped !== false)
    for (const d of B.drops) if (d.air) drawDrop(pen, d, d.s);

  if (has("flight") && B.showFlight !== false && B.rout > 0.06) drawFlight(pen, W, H, B);

  // ---- the terror front itself, read as an instrument: a dashed arc lying in
  //      the FLOOR, bulging UP the hall out of the aegis footprint, with a
  //      leading arrow on its apex and a dotted plumb back up to the cause ----
  if (has("terror-front") && B.showFront !== false && B.wave > 0.04 && B.wave < 1.30){
    const fX = W*B.sxN, fY = H*0.906;
    // the front's apex sits exactly on the band the wave has just reached
    const rx = B.wave*W*0.80, ry = B.wave*H*0.618;
    g.save();
    g.strokeStyle = ACCENT; g.lineCap = "butt";
    g.globalAlpha = 0.34; g.lineWidth = Math.max(2, W*0.005);
    g.setLineDash([W*0.008, W*0.020]);
    g.beginPath(); g.moveTo(fX, H*(B.syN+0.052)); g.lineTo(fX, fY - ry - H*0.030); g.stroke();
    g.globalAlpha = 1; g.lineWidth = Math.max(5, W*0.013);
    g.setLineDash([W*0.034, W*0.030]);
    g.beginPath(); g.ellipse(fX, fY, rx, ry, 0, Math.PI*1.04, Math.PI*1.96); g.stroke();
    g.setLineDash([]);
    g.lineWidth = Math.max(3, W*0.008);
    const ay = fY - ry;
    g.beginPath();
    g.moveTo(fX, ay + H*0.030); g.lineTo(fX, ay - H*0.022);
    g.moveTo(fX, ay - H*0.022); g.lineTo(fX - W*0.024, ay + H*0.008);
    g.moveTo(fX, ay - H*0.022); g.lineTo(fX + W*0.024, ay + H*0.008);
    g.stroke();
    g.restore();
  }
}

export const asset = {
  id:"ensemble.suitor-terror-wave",
  type:"ENSEMBLE",
  name:"Suitor terror wave",
  statusWord:"BREAKING",
  scene:"OD-B22-S05",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["floor","beam","threshold","rose","source","dropped",
          "band-back","band-mid","band-front","flight","terror-front"],
  // normalized 0..1 anchors — the scene places its named figures and prop.aegis
  anchors:{
    "aegis:source":{x:.420,y:.118},    "aegis:beam":{x:.420,y:.065},
    "target:threshold":{x:.072,y:.330},"target:sill":{x:.058,y:.348},
    "head:still-in-rank":{x:.782,y:.628}, "head:flinching":{x:.560,y:.700},
    "head:shedding":{x:.398,y:.742},   "head:cowering":{x:.276,y:.860},
    "head:fleeing":{x:.878,y:.884},    "body:trampled":{x:.150,y:.918},
    "flight:left":{x:.052,y:.940},     "flight:right":{x:.940,y:.940},
    "gap:centre":{x:.452,y:.860},
    "row:back":{x:.500,y:.548},        "row:mid":{x:.500,y:.726},
    "row:front":{x:.500,y:.906},
    "gauge:rose":{x:.776,y:.212},
    "camera:wide":{x:.500,y:.560},     "camera:low":{x:.440,y:.760},
  },
  zones:{
    crowd:{ x0:.04,y0:.46,x1:.96,y1:.96 },
    "front:holding":{ x0:.58,y0:.46,x1:.96,y1:.78 },
    "front:broken":{ x0:.04,y0:.58,x1:.66,y1:.96 },
    "exit:left":{ x0:.00,y0:.62,x1:.20,y1:.98 },
    "exit:right":{ x0:.80,y0:.62,x1:1.0,y1:.98 },
    "line-of-fire":{ x0:.04,y0:.34,x1:.44,y1:.70 },
  },

  states:{
    initial:"holding",
    nodes:{
      // before the aegis goes up: the rank Melanthius's gear bought them
      holding:{   preview:{ formation:"line", panic:1.0, wave:0.0, waveSpread:0.28,
                            rout:0.0, attention:0.94, density:1.0, status:"HOLDING" } },
      // massed for one more charge at the doorway
      charging:{  preview:{ formation:"wedge", panic:1.0, wave:0.08, waveSpread:0.28,
                            rout:0.05, attention:0.96, density:1.0, status:"CHARGING" } },
      // THE COLLAPSE caught mid-sweep: rank at the back, rout at the front —
      // the asset's reason to exist
      breaking:{  preview:{ formation:"crumbling", panic:1.0, wave:0.58, waveSpread:0.28,
                            rout:0.40, attention:0.84, density:1.0, status:"BREAKING" } },
      // the front has passed everybody; the shape is gone
      scattered:{ preview:{ formation:"scatter", panic:1.0, wave:1.10, waveSpread:0.34,
                            rout:0.72, attention:0.46, density:1.0, status:"SCATTERED" } },
      // driven at the two side walls, a hole opening down the middle
      stampeding:{preview:{ formation:"stampede", panic:1.0, wave:1.20, waveSpread:0.22,
                            rout:0.92, attention:0.34, density:1.0, status:"STAMPEDING" } },
      // a stubborn residue: half the hall still in formation
      stubborn:{  preview:{ formation:"crumbling", panic:0.55, wave:1.10, waveSpread:0.40,
                            rout:0.30, attention:0.72, density:1.0, status:"STUBBORN" } },
      // what is left on the boards afterwards
      strewn:{    preview:{ formation:"strewn", panic:1.0, wave:1.30, waveSpread:0.40,
                            rout:0.20, attention:0.20, density:1.0, status:"STREWN" } },
      // a thin hall for wide or early framings
      sparse:{    preview:{ formation:"crumbling", panic:1.0, wave:0.58, waveSpread:0.28,
                            rout:0.40, attention:0.84, density:0.5, status:"THIN" } },
    },
    edges:[
      ["holding","charging"],["charging","breaking"],["holding","breaking"],
      ["breaking","scattered"],["scattered","stampeding"],["breaking","stampeding"],
      ["breaking","stubborn"],["stubborn","scattered"],["stampeding","strewn"],
      ["scattered","strewn"],["breaking","sparse"],["sparse","scattered"],
    ],
  },
  channels:["formation","panic","wave","waveSpread","rout","attention",
            "density","rows","depth"],

  // neutral preview = the collapse caught mid-sweep: helmets and levelled
  // spears at the back of the hall, dropped shields and bare heels at the front
  preview:()=>({ formation:"crumbling", panic:1.0, wave:0.58, waveSpread:0.28,
                 rout:0.40, attention:0.84, density:1.0,
                 status:"BREAKING", progress:0.62 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
