/* ensemble.telemachus-eumaeus-and-philoetius — the three men who fight beside
   the king, working the hall after the killing: coordinated finishers moving
   the flanks, putting the spear to what is still moving, and finding the ones
   who are only pretending to be dead (Book XXII).

   ENSEMBLE asset, not three portraits. ONE separable member template —
   `finisher()` — instanced deterministically over a roster. What makes it an
   ensemble rather than a group photo is that the member's whole body is a
   single continuous channel, SWEEP, walked through four keyed postures:

       0.00  GUARD  upright, spear on the vertical, shield square, eyes level
       0.33  SCAN   the head snaps onto the flank, shield presented outward,
                    spear tipping off the vertical
       0.66  PROBE  weight forward over a long stride, spear levelled low,
                    shield dropped to clear the sight-line
       1.00  CHECK  hips down in a crouch, head over the floor, the point of
                    the spear laid on what is lying there

   Every posture number — hip drop, lean, stride, spear angle, shield height,
   shield splay, head turn, head pitch — is interpolated between those four
   keys, so there is no branch in the body: one `u` per member draws any point
   on the ladder. A single global `sweep` drives all members through a
   per-member STAGGER, and THAT is the coordination the prompt asks for: at the
   default numbers the left man is already crouched over a body, the centre man
   is mid-scan covering him, and the right man has not moved off guard with his
   spear still on the vertical. One number renders the drill.

   The second mechanic, and the one this asset owns that the other Book XXII
   groups do not: PER-MEMBER FACING. `outward` in the formation table turns the
   wing men to face out of the frame — checking their own flanks, backs to the
   centre — while `converge` faces them all in on one point. A formation here
   changes who is looking where, not just where they stand.

   Exposed ENSEMBLE controls: FORMATION (cordon | sweep-line | flank-split |
   wedge | converge | check-bodies | stand-down), DENSITY (how many of the
   roster are in frame), ATTENTION (how hard the heads pull off their own
   flank and onto a shared focus), a reaction WAVE travelling left->right
   (posture advance, spear lift, lean), FOREGROUND (cropped near debris at the
   frame edge) and BACKGROUND (the pair posted deep at the two side doors).
   `background:0` leaves exactly the three named men.

   No megaron is built here: only a thin shell — a broken dado, two cropped
   column stubs, a broken architrave and the two dark flank doorways — so the
   group composites over `location.megaron-hall` in its `aftermath` state. No
   bodies are drawn; the floor debris is furniture, and the scene supplies the
   dead. Solid grays + hard contour, nothing pre-dithered: pale corslets,
   pale shields, pale greaves and a pale floor carry the frame and only
   beards, bosses, crest teeth, spearheads, belts and the doorways take heavy
   ink. Atlas OD-B22-S06. */

import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const D2R = Math.PI / 180;

/* the four keyed postures the sweep channel walks, in order */
export const POSTURES = ["guard", "scan", "probe", "check"];
export const ROLES = ["telemachus", "eumaeus", "philoetius", "flank"];

/* ---------------- the posture ladder ----------------
   Four rows of numbers. Everything about a member's body is read out of
   here; nothing is drawn conditionally on which posture it is "in". */
const KEYS = [
  /* guard */ { at:0.00, drop:0.000, lean:0.000, stride:0.030, spear:  4, spearLen:1.18, butt:0.30, shield:1.00, splay:0.10, turn:0.10, pitch:0.00, low:0.00 },
  /* scan  */ { at:0.33, drop:0.025, lean:0.045, stride:0.105, spear: 28, spearLen:1.16, butt:0.32, shield:0.96, splay:0.60, turn:0.95, pitch:-0.06, low:0.00 },
  /* probe */ { at:0.66, drop:0.072, lean:0.130, stride:0.200, spear: 92, spearLen:1.10, butt:0.46, shield:0.72, splay:0.28, turn:0.55, pitch:0.22, low:0.45 },
  /* check */ { at:1.00, drop:0.155, lean:0.200, stride:0.240, spear:172, spearLen:1.05, butt:0.55, shield:0.54, splay:0.14, turn:0.22, pitch:0.54, low:1.00 },
];
function postureAt(u){
  u = clamp01(u);
  let i = 0; while (i < KEYS.length - 2 && u > KEYS[i+1].at) i++;
  const a = KEYS[i], b = KEYS[i+1];
  const t = smooth((u - a.at) / Math.max(1e-4, b.at - a.at));
  const P = {};
  for (const k of Object.keys(a)) if (k !== "at") P[k] = lerp(a[k], b[k], t);
  return P;
}

/* ---------------- roster ----------------
   The whole cast in one deterministic table. `order` drives the sweep
   stagger (0 is furthest along the ladder). `x` is normalized across W.
   `faceIn` is which way the man looks when the formation is not splayed. */
const ROSTER = [
  { role:"philoetius", rank:"line", x:0.778, order:0, build:1.00, faceIn:-1, push:0.00 },
  { role:"eumaeus",    rank:"line", x:0.222, order:1, build:1.04, faceIn: 1, push:0.00 },
  { role:"telemachus", rank:"line", x:0.500, order:2, build:1.08, faceIn: 1, push:1.00 },
  { role:"flank",      rank:"rear", x:0.098, order:3, build:0.96, faceIn:-1, push:0.00 },
  { role:"flank",      rank:"rear", x:0.905, order:4, build:0.96, faceIn: 1, push:0.00 },
];

/* two depth bands: footline and member height as fractions of H, plus the
   ink levels for cloth and skin — the rear band stays a level lighter so it
   recedes without a second code path */
const BAND = {
  line: { footY:0.915, s:0.420, lvl:1, skin:2 },
  rear: { footY:0.658, s:0.178, lvl:1, skin:1 },
};

/* ---------------- formation table ----------------
   A formation is a row of numbers the same template reads. `outward` turns
   the wing men to face out of frame; `spread` scales x about the centre;
   `push` brings the pushed member (Telemachus) downstage. */
const FORMATIONS = {
  "cordon":       { sweep:0.08, spread:1.06, outward:0, stagger:0.10, push:0.000, lean:0.00 },
  "sweep-line":   { sweep:0.50, spread:1.00, outward:0, stagger:0.30, push:0.010, lean:0.02 },
  "flank-split":  { sweep:0.42, spread:1.12, outward:1, stagger:0.34, push:0.000, lean:0.02 },
  "wedge":        { sweep:0.60, spread:0.92, outward:0, stagger:0.26, push:0.045, lean:0.05 },
  "converge":     { sweep:0.72, spread:0.82, outward:0, stagger:0.22, push:0.030, lean:0.06 },
  "check-bodies": { sweep:0.94, spread:1.02, outward:0, stagger:0.20, push:0.015, lean:0.04 },
  "stand-down":   { sweep:0.00, spread:0.96, outward:0, stagger:0.00, push:0.000, lean:0.00 },
};

const params = {
  formation:"sweep-line",
  sweep:0.50,          // 0 the whole team on guard .. 1 the whole team crouched over the floor
  stagger:0.30,        // per-member delay down the roster — this is the coordination
  span:0.55,           // how long one member takes to cross 0 -> 1
  density:0.85,        // how many of the roster are in frame
  attention:0.34,      // 0 each man on his own flank .. 1 every head onto one point
  wave:1.40,           // 0..1 position of a reaction travelling left->right (>1 = off)
  waveSpread:0.20,     // width of that band
  resolve:0.80,        // 0 wary .. 1 committed: stance widens, spears drop faster
  foreground:0.55,     // the cropped near table at the frame edge
  background:1.00,     // the pair posted deep at the flank doors
  debris:0.75,         // wrecked furniture on the hall floor
  focus:{ x:0.50, y:0.74 },
  showShell:true,
  members:ROSTER.length,
};

/* ============================================================
   MEMBER TEMPLATE — one armed man of the king's four, mid-drill.
   m = { cx, footY, s, F, role, build, u, lvl, skinLvl, headDX, headPitch,
         leanBias, resolve, wave }
   Every length keys off s, so the same function serves the ~440px front
   band and the ~167px rear band with no second code path.
   ============================================================ */
export function finisher(pen, m){
  const g  = pen.ctx;
  const s  = m.s, cx = m.cx, footY = m.footY, F = m.F;
  const B  = m.build || 1;
  const P  = postureAt(m.u);
  const cw = Math.max(2.2, s*0.015);
  const res = clamp01(m.resolve ?? 0.8);

  const skin  = toneSolid(inkLevel(m.skinLvl ?? 1));
  const cloth = toneSolid(inkLevel(m.lvl));
  const pale  = toneSolid(inkLevel(1));
  const helmT = toneSolid(inkLevel(2));
  const strap = toneSolid(inkLevel(4));
  const shaftT= toneSolid(inkLevel(4));
  const dark  = toneSolid(inkLevel(6));
  const beardT= toneSolid(inkLevel(m.role === "eumaeus" ? 4 : 3));

  const drop  = P.drop * (0.75 + 0.5*res);
  const lean  = (P.lean + (m.leanBias||0)) * (0.7 + 0.6*res) + (m.wave||0)*0.03;
  const stride= P.stride * (0.7 + 0.6*res);

  const shY   = footY - s*(0.720 - drop);
  const hemY  = footY - s*(0.325 - drop*0.55);
  const shW   = s*0.268*B, hemW = s*0.300*B;
  const headR = s*0.088;
  /* the lean is a shear, not a translation: shoulders go forward, hips go
     back, so a deep crouch folds instead of sliding off its own feet */
  const leanPx= F*lean*s*0.60;
  const hipPx = -leanPx*0.35;
  const headCx= cx + leanPx*0.78 + (m.headDX||0);
  const headCy= shY - headR*1.26 + P.pitch*headR*1.1;

  /* ---- ground shadow ---- */
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY + s*0.010, hemW*0.72, s*0.026, 0, 0, 7); g.fill();

  /* ---- legs: the trailing leg straight, the leading leg taking the crouch ---- */
  const leg = (dx, dz, bend) => {
    const kneeY = footY - s*(0.155 + bend*0.055);
    const kneeX = cx + dx + dz*0.45 + F*bend*s*0.13;
    pen.limb(()=>{ g.moveTo(cx+dx+hipPx, hemY - s*0.012); g.lineTo(kneeX, kneeY); }, skin, s*0.064*B);
    pen.limb(()=>{ g.moveTo(kneeX, kneeY); g.lineTo(cx+dx+dz, footY - s*0.016); }, skin, s*0.054*B);
    /* greave: a pale shin plate with one dark top edge — breaks the bare leg */
    pen.paint(()=>{
      g.rect(cx+dx+dz - s*0.034, footY - s*0.132, s*0.068, s*0.104);
    }, pale, cw*0.7);
    pen.paint(()=>{ g.rect(cx+dx+dz - s*0.038, footY - s*0.146, s*0.076, s*0.020); }, strap, cw*0.55);
    pen.paint(()=>{ g.ellipse(cx+dx+dz+F*s*0.012, footY, s*0.050, s*0.018, 0, 0, 7); }, shaftT, cw*0.8);
  };
  leg(-F*hemW*0.24, -F*stride*0.55, 0);
  leg( F*hemW*0.22,  F*stride,      drop*3.4);

  /* ---- far arm behind the torso, carrying the shield ---- */
  const farSh = { x: cx - F*shW*0.46 + leanPx*0.5, y: shY + s*0.032 };

  /* ---- SHIELD: a big pale disc, dark only at the boss ---- */
  {
    const R  = s*(m.role === "eumaeus" ? 0.140 : m.role === "telemachus" ? 0.126 : 0.120)*B;
    const sx = cx - F*s*(0.138 + P.splay*0.055);
    const sy = lerp(hemY + s*0.030, shY + s*0.170, clamp01(P.shield));
    pen.limb(()=>{ g.moveTo(farSh.x, farSh.y); g.lineTo(sx + F*R*0.30, sy - R*0.08); }, skin, s*0.046*B);
    pen.paint(()=>{ g.arc(sx, sy, R, 0, 7); }, pale, cw*1.15);
    pen.ink(()=>{ g.arc(sx, sy, R*0.83, 0, 7); }, cw*0.85);
    pen.paint(()=>{ g.arc(sx, sy, R*0.185, 0, 7); }, dark, cw*0.7);
    for (let i = 0; i < 3; i++){                 // three short spokes, never a grid
      const th = (i*120 + 40)*D2R;
      pen.ink(()=>{ g.moveTo(sx + Math.cos(th)*R*0.28, sy + Math.sin(th)*R*0.28);
                    g.lineTo(sx + Math.cos(th)*R*0.62, sy + Math.sin(th)*R*0.62); }, cw*0.8);
    }
  }

  /* ---- torso: the pale corslet, a blunt trapezoid ---- */
  pen.paint(()=>{
    g.moveTo(cx - shW/2 + leanPx, shY);
    g.lineTo(cx + shW/2 + leanPx, shY);
    g.lineTo(cx + hemW/2 + hipPx, hemY);
    g.lineTo(cx - hemW/2 + hipPx, hemY);
    g.closePath();
  }, cloth, cw);
  /* the corslet seam and ONE short belt: the plate stays pale, the belt is
     the only dark band and it is local to the body, never a span of frame */
  pen.seam(()=>{ g.moveTo(cx - shW*0.30 + leanPx*0.7, shY + s*0.092);
                 g.lineTo(cx + shW*0.30 + leanPx*0.7, shY + s*0.086); }, cw*0.7);
  pen.paint(()=>{ g.rect(cx - hemW*0.42 + hipPx, hemY - s*0.040, hemW*0.84, s*0.022); }, strap, cw*0.6);
  /* pteruges: four separate tabs under the belt, wide gaps — no bar */
  for (const i of [-1.5, -0.5, 0.5, 1.5]){
    const tx = cx + i*hemW*0.235 + hipPx;
    const th = s*(0.052 - Math.abs(i)*0.008);
    pen.paint(()=>{ g.rect(tx - hemW*0.072, hemY - s*0.016, hemW*0.144, th); }, pale, cw*0.5);
  }

  /* ---- neck + head ---- */
  pen.limb(()=>{ g.moveTo(cx + leanPx, shY + s*0.008); g.lineTo(headCx, headCy + headR*0.80); }, skin, s*0.048*B);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0, 0, 7); }, skin, cw);

  /* eye + set brow: two marks, no small type anywhere in this asset */
  g.fillStyle = INK;
  g.beginPath(); g.arc(headCx + F*headR*0.32, headCy - headR*0.04, Math.max(1.8, headR*0.15), 0, 7); g.fill();
  pen.ink(()=>{ g.moveTo(headCx + F*headR*0.04, headCy - headR*0.44);
                g.lineTo(headCx + F*headR*0.64, headCy - headR*0.32 - res*headR*0.12); }, Math.max(2.2, headR*0.17));

  /* beard — the dark accent that carries the face at any size. Telemachus
     has none: that beardless jaw is his silhouette key. */
  if (m.role !== "telemachus"){
    const fork = m.role === "philoetius";
    pen.paint(()=>{
      g.moveTo(headCx - headR*0.82, headCy + headR*0.18);
      if (fork){
        g.lineTo(headCx - headR*0.26, headCy + headR*1.02);
        g.lineTo(headCx + F*headR*0.06, headCy + headR*0.70);
        g.lineTo(headCx + headR*0.36, headCy + headR*0.98);
      } else {
        g.lineTo(headCx - headR*0.62, headCy + headR*0.94);
        g.lineTo(headCx + headR*0.60, headCy + headR*0.94);
      }
      g.lineTo(headCx + headR*0.82, headCy + headR*0.18);
      g.quadraticCurveTo(headCx, headCy + headR*0.62, headCx - headR*0.82, headCy + headR*0.18);
      g.closePath();
    }, beardT, cw*0.8);
  } else {
    pen.seam(()=>{ g.moveTo(headCx - headR*0.62, headCy + headR*0.52);
                   g.quadraticCurveTo(headCx, headCy + headR*1.02, headCx + headR*0.62, headCy + headR*0.52); }, cw*0.7);
  }

  /* ---- HELMET: pale dome, dark crest. Role picks the crest, and the crest
     is what tells the three apart at rear-rank size. ---- */
  {
    const R  = headR*1.14;
    const hy = headCy;
    pen.paint(()=>{
      g.moveTo(headCx - R, hy + headR*0.06);
      g.quadraticCurveTo(headCx - R*0.98, hy - R*0.88, headCx, hy - R*0.90);
      g.quadraticCurveTo(headCx + R*0.98, hy - R*0.88, headCx + R, hy + headR*0.06);
      g.closePath();
    }, helmT, cw);
    pen.paint(()=>{ g.rect(headCx - R, hy - headR*0.26, R*2, headR*0.16); }, toneSolid(inkLevel(3)), cw*0.7);
    /* nasal */
    pen.paint(()=>{ g.rect(headCx + F*headR*0.06 - R*0.056, hy - headR*0.04, R*0.112, headR*0.44); }, toneSolid(inkLevel(3)), cw*0.5);

    if (m.role === "eumaeus"){
      /* a hide cap: no crest at all, one heavy brim — the herdsman's helmet */
      pen.paint(()=>{ g.rect(headCx - R*1.06, hy - R*0.92, R*2.12, R*0.16); }, toneSolid(inkLevel(3)), cw*0.6);
    } else if (m.role === "telemachus"){
      /* three TALL teeth — the prince stands a head above the line */
      for (let i = -1; i <= 1; i++){
        const bx = headCx + i*R*0.40;
        const bh = R*(0.60 - Math.abs(i)*0.16);
        pen.paint(()=>{ g.rect(bx - R*0.085, hy - R*0.90 - bh, R*0.17, bh + R*0.10); }, dark, cw*0.55);
      }
    } else {
      /* a single low ridge, five short teeth */
      for (let i = -2; i <= 2; i++){
        const bx = headCx + i*R*0.30;
        const bh = R*(0.20 - Math.abs(i)*0.030);
        pen.paint(()=>{ g.rect(bx - R*0.062, hy - R*0.90 - bh, R*0.124, bh + R*0.09); }, dark, cw*0.5);
      }
    }
  }

  /* ---- role kit at the belt: the axe and the scabbard, dark short accents ---- */
  if (m.role === "philoetius"){
    const ax = cx - F*hemW*0.42 + hipPx, ay = hemY - s*0.012;
    pen.paint(()=>{
      g.moveTo(ax, ay); g.lineTo(ax - F*s*0.058, ay + s*0.028);
      g.lineTo(ax - F*s*0.046, ay + s*0.086); g.lineTo(ax + F*s*0.010, ay + s*0.066);
      g.closePath();
    }, dark, cw*0.6);
  } else if (m.role === "telemachus"){
    pen.paint(()=>{
      g.moveTo(cx - F*hemW*0.40 + hipPx, hemY - s*0.030);
      g.lineTo(cx - F*hemW*0.28 + hipPx, hemY - s*0.046);
      g.lineTo(cx - F*hemW*0.62 + hipPx, hemY + s*0.150);
      g.lineTo(cx - F*hemW*0.76 + hipPx, hemY + s*0.132);
      g.closePath();
    }, strap, cw*0.6);
  }

  /* ---- near arm + SPEAR. Angle measured from the vertical toward the
     facing side; at the bottom of the ladder the point is on the floor. ---- */
  {
    const lift = (m.wave||0) * -16;                       // a reaction snaps the spear back up
    const th   = P.spear + lift;
    const dir  = { x: F*Math.sin(th*D2R), y: -Math.cos(th*D2R) };
    const nearSh = { x: cx + F*shW*0.44 + leanPx, y: shY + s*0.044 };
    const grip = { x: cx + F*s*(0.150 + P.low*0.160) + leanPx, y: shY + s*(0.100 - P.low*0.040) };
    const L    = s*P.spearLen;
    const bk   = clamp01(P.butt);
    const butt = { x: grip.x - dir.x*L*bk,       y: grip.y - dir.y*L*bk };
    const tip  = { x: grip.x + dir.x*L*(1 - bk), y: grip.y + dir.y*L*(1 - bk) };
    pen.limb(()=>{ g.moveTo(nearSh.x, nearSh.y); g.lineTo(grip.x - F*s*0.020, grip.y - s*0.022); }, cloth, s*0.052*B);
    pen.limb(()=>{ g.moveTo(butt.x, butt.y); g.lineTo(tip.x, tip.y); }, shaftT, s*0.022);
    pen.paint(()=>{                                        // leaf head
      g.moveTo(tip.x, tip.y);
      g.lineTo(tip.x - dir.y*s*0.032 - dir.x*s*0.100, tip.y + dir.x*s*0.032 - dir.y*s*0.100);
      g.lineTo(tip.x + dir.y*s*0.032 - dir.x*s*0.100, tip.y - dir.x*s*0.032 - dir.y*s*0.100);
      g.closePath();
    }, dark, cw*0.7);
    pen.paint(()=>{ g.arc(grip.x, grip.y, s*0.033, 0, 7); }, skin, cw*0.75);
  }
}

/* ============================================================
   the thin hall shell — a broken dado, two cropped column stubs, a broken
   architrave and the two dark flank doorways the wing men are watching.
   Deliberately NOT a room: `location.megaron-hall` is the room.
   ============================================================ */
function shell(pen, g, W, H){
  const floorY = H*0.618;
  const pale = toneSolid(inkLevel(1));
  const mid  = toneSolid(inkLevel(2));
  const deep = toneSolid(inkLevel(3));

  g.fillStyle = inkLevel(1); g.fillRect(0, floorY, W, H - floorY);

  /* the two flank doorways the wing men are watching — the only mid-dark
     shapes back here, and small */
  for (const dx of [0.098, 0.905]){
    pen.paint(()=>{ g.rect(W*dx - W*0.036, H*0.462, W*0.072, floorY - H*0.462); }, deep, 2.6);
    pen.paint(()=>{ g.rect(W*dx - W*0.050, H*0.446, W*0.100, H*0.022); }, mid, 2.4);
  }

  /* the dado, in three short runs clear of the doorways */
  for (const [a, b] of [[0.200, 0.352], [0.470, 0.612], [0.700, 0.830]]){
    pen.paint(()=>{ g.rect(W*a, floorY - H*0.044, W*(b-a), H*0.044); }, pale, 2.4);
    pen.seam(()=>{ g.moveTo(W*a + W*0.008, floorY - H*0.028); g.lineTo(W*b - W*0.008, floorY - H*0.028); }, 1.8);
  }

  /* column stubs, cropped by the top of the frame — thin, pale, no capital
     slab wider than the shaft */
  for (const cxn of [0.026, 0.974]){
    const cxp = W*cxn, cwid = W*0.044;
    pen.paint(()=>{ g.rect(cxp - cwid/2, H*0.088, cwid, floorY - H*0.088); }, pale, 2.4);
    pen.paint(()=>{ g.rect(cxp - cwid*0.70, H*0.088, cwid*1.40, H*0.022); }, mid, 2.4);
    pen.seam(()=>{ g.moveTo(cxp - cwid*0.20, H*0.140); g.lineTo(cxp - cwid*0.20, floorY - H*0.05); }, 1.8);
  }

  /* the roof beams: three short runs with two open gaps, the ends cropped —
     never one span across the frame */
  for (const [a, b] of [[0.010, 0.286], [0.352, 0.632], [0.706, 0.990]]){
    pen.seam(()=>{ g.moveTo(W*a, H*0.112); g.lineTo(W*b, H*0.112); }, 2.6);
    pen.seam(()=>{ g.moveTo(W*a, H*0.140); g.lineTo(W*b, H*0.140); }, 1.8);
    for (let i = 1; i <= 3; i++){          // short joist ticks between the beams
      const x = lerp(W*a, W*b, i/4);
      pen.seam(()=>{ g.moveTo(x, H*0.112); g.lineTo(x, H*0.140); }, 2.0);
    }
  }
  /* three truss posts of different lengths hanging off the beams — the only
     thing in the upper third besides the spears, and deliberately unequal */
  for (const [x, y1] of [[0.300, 0.302], [0.702, 0.242], [0.892, 0.336]]){
    pen.paint(()=>{ g.rect(W*x - W*0.014, H*0.140, W*0.028, H*(y1 - 0.140)); }, pale, 2.4);
    pen.seam(()=>{ g.moveTo(W*x - W*0.024, H*y1); g.lineTo(W*x + W*0.024, H*y1); }, 2.2);
  }

  /* the floor line, in three runs so it never stripes the frame */
  g.strokeStyle = INK; g.lineWidth = 3;
  for (const [a, b] of [[0.02, 0.26], [0.36, 0.63], [0.73, 0.98]]){
    g.beginPath(); g.moveTo(W*a, floorY); g.lineTo(W*b, floorY); g.stroke();
  }
  g.globalAlpha = 0.30;
  for (const [y, a, b] of [[0.742, 0.05, 0.34], [0.742, 0.64, 0.95],
                           [0.868, 0.12, 0.42], [0.868, 0.66, 0.93]]){
    g.beginPath(); g.moveTo(W*a, H*y); g.lineTo(W*b, H*y); g.stroke();
  }
  g.globalAlpha = 1;
}

/* wrecked furniture on the hall floor — what the sweep is stepping over.
   Objects only: no bodies are baked into an ENSEMBLE. */
function debrisField(pen, g, W, H, amt){
  if (amt <= 0.02) return;
  const R = rnd(2206);
  const pale = toneSolid(inkLevel(1));
  const mid  = toneSolid(inkLevel(3));
  const dark = toneSolid(inkLevel(6));
  const N = Math.round(amt*4);
  for (let i = 0; i < N; i++){
    const x = W*(0.30 + R()*0.42);
    const y = H*(0.648 + R()*0.150);
    const k = H*0.021*(0.7 + (y/H - 0.62)*1.9);
    const kind = i % 3;
    if (kind === 0){                       // an overturned stool: seat + two legs up
      pen.paint(()=>{ g.rect(x - k*1.20, y - k*0.34, k*2.40, k*0.68); }, pale, 3);
      pen.paint(()=>{ g.rect(x - k*0.86, y - k*1.10, k*0.26, k*0.80); }, mid, 2.6);
      pen.paint(()=>{ g.rect(x + k*0.58, y - k*0.98, k*0.26, k*0.70); }, mid, 2.6);
    } else if (kind === 1){                // a fallen cup, on its side
      pen.paint(()=>{ g.ellipse(x, y, k*0.62, k*0.42, 0.4, 0, 7); }, pale, 3);
      pen.paint(()=>{ g.arc(x - k*0.52, y - k*0.10, k*0.20, 0, 7); }, dark, 2.4);
    } else {                               // a snapped spear shaft
      pen.paint(()=>{ g.rect(x - k*1.40, y - k*0.13, k*2.10, k*0.26); }, mid, 2.6);
      pen.paint(()=>{ g.rect(x + k*0.78, y - k*0.30, k*0.56, k*0.60); }, dark, 2.4);
    }
  }
}

/* the cropped near piece — one of the long feasting tables, gone over on its
   side and entering from the bottom-right corner, cut by two frame edges.
   This is the ENSEMBLE's foreground control; there is no near figure, so a
   scene can stand the king here without a collision. */
function foregroundCrop(pen, g, W, H, amt){
  if (amt <= 0.02) return;
  const pale = toneSolid(inkLevel(2));
  const mid  = toneSolid(inkLevel(3));
  const dark = toneSolid(inkLevel(6));
  const topY = H*(0.955 - 0.030*amt);
  const x0 = W*(0.215 - 0.030*amt), x1 = W*(0.560 + 0.040*amt);
  /* the table top: a slanted quad cut by the bottom edge, well short of the
     frame width so it cannot stripe */
  pen.paint(()=>{
    g.moveTo(x0, H*1.04);
    g.lineTo(x0 + W*0.048, topY);
    g.lineTo(x1, topY - H*0.026);
    g.lineTo(x1 - W*0.040, H*1.04);
    g.closePath();
  }, pale, 4.5);
  pen.seam(()=>{ g.moveTo(x0 + W*0.062, topY + H*0.026); g.lineTo(x1 - W*0.016, topY + H*0.002); }, 2.6);
  /* one leg standing up out of the wreck */
  pen.paint(()=>{ g.rect(x0 + W*0.098, topY - H*0.086, W*0.032, H*0.094); }, mid, 3.4);
  pen.paint(()=>{ g.rect(x0 + W*0.086, topY - H*0.100, W*0.056, H*0.020); }, dark, 3);
}

/* ============================================================
   STAGE
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;

  const formName  = FORMATIONS[st.formation] ? st.formation : params.formation;
  const F0        = FORMATIONS[formName];
  const sweep     = clamp01(st.sweep ?? (st.formation ? F0.sweep : params.sweep));
  const stagger   = st.stagger    ?? (st.formation ? F0.stagger : params.stagger);
  const span      = st.span       ?? params.span;
  const density   = clamp01(st.density   ?? params.density);
  const attention = clamp01(st.attention ?? params.attention);
  const wave      = st.wave       ?? params.wave;
  const waveSpread= st.waveSpread ?? params.waveSpread;
  const resolve   = clamp01(st.resolve   ?? params.resolve);
  const fg        = clamp01(st.foreground?? params.foreground);
  const bg        = clamp01(st.background?? params.background);
  const debris    = clamp01(st.debris    ?? params.debris);
  const focus     = st.focus      || params.focus;
  const showShell = st.showShell  ?? params.showShell;

  if (showShell) shell(pen, g, W, H);
  debrisField(pen, g, W, H, debris);

  /* who is in frame: the rear pair is gated by BACKGROUND, the front three
     by DENSITY (the centre man is the last to be dropped) */
  const frontKeep = Math.max(1, Math.round(lerp(1, 3, density)));
  const frontOrder = ["telemachus", "eumaeus", "philoetius"];
  const rearKeep = Math.round(bg * 2);
  let rearSeen = 0;
  const roster = ROSTER.filter(r => r.rank === "rear"
    ? (rearSeen++) < rearKeep
    : frontOrder.indexOf(r.role) < frontKeep);

  const focusX = focus.x * W;

  /* back -> front: the posted pair first, then the line */
  const DEPTH = { rear:0, line:1 };
  const ordered = roster.slice().sort((a, b) =>
    (DEPTH[a.rank] - DEPTH[b.rank]) || (a.x - b.x));

  for (const r of ordered){
    const bd = BAND[r.rank];
    const s  = bd.s * H * (r.role === "telemachus" ? 1.05 : 1);
    const footY = (bd.footY + (r.rank === "rear" ? 0 : F0.push*r.push)) * H;
    const cx = (0.5 + (r.x - 0.5)*F0.spread) * W;

    /* per-member facing: splayed formations turn the wing men outward */
    const outSign = cx < W*0.5 ? -1 : 1;
    const face = F0.outward >= 0.5 ? (Math.abs(cx - W*0.5) < W*0.04 ? r.faceIn : outSign) : r.faceIn;

    /* the sweep stagger — one number, delayed down the roster */
    const u = clamp01((sweep - r.order*stagger) / Math.max(0.05, span));

    /* the reaction wave: a band travelling left -> right across x */
    const dw = (r.x - wave) / Math.max(0.03, waveSpread);
    const wv = (wave > 1.05 || wave < -0.05) ? 0 : Math.exp(-dw*dw);

    /* the head: his own flank, pulled toward a shared focus by ATTENTION */
    const P = postureAt(u);
    const own = face * P.turn;
    const toFocus = clamp((focusX - cx)/(W*0.42), -1, 1);
    const headDX = lerp(own, toFocus, attention*0.8 + wv*0.2) * s*0.075;

    finisher(pen, {
      cx, footY, s, F: face, role: r.role, build: r.build,
      u, lvl: bd.lvl, skinLvl: bd.skin,
      headDX, leanBias: F0.lean, resolve, wave: wv,
    });
  }

  foregroundCrop(pen, g, W, H, fg);
}

export const asset = {
  id:"ensemble.telemachus-eumaeus-and-philoetius",
  type:"ENSEMBLE",
  name:"Telemachus, Eumaeus, and Philoetius",
  statusWord:"SWEEPING",
  scene:"OD-B22-S06",

  params,

  /* the separable member system, declared: ONE template, one roster, one
     posture ladder that the `sweep` channel walks */
  member:{
    template:"finisher",
    roles:ROLES,
    postures:POSTURES,
    keys:KEYS,
    roster:ROSTER,
    bands:BAND,
    formations:Object.keys(FORMATIONS),
    stagger:"u_i = clamp01((sweep - order_i*stagger)/span)",
    facing:"outward ? sign(x_i - 0.5) : faceIn_i",
  },

  layers:["floor","doorways","dado","columns","architrave","debris","rear-rank",
          "far-arm","shield","legs","greaves","corslet","belt","pteruges",
          "neck","head","beard","helmet","crest","belt-kit","near-arm","spear",
          "foreground-crop"],

  /* placement / contact / camera anchors in 0..1 asset space. `line:*` are
     where a scene stands the group; `contact:*` are the two hands a scene can
     hand something to; `point:*` are the spear points on the floor. */
  anchors:{
    "line:left":{ x:.222, y:.915 },
    "line:centre":{ x:.500, y:.925 },
    "line:right":{ x:.778, y:.915 },
    "rear:left":{ x:.098, y:.658 },
    "rear:right":{ x:.905, y:.658 },
    "shield:left":{ x:.140, y:.730 },
    "shield:centre":{ x:.412, y:.700 },
    "shield:right":{ x:.860, y:.760 },
    "contact:telemachus-hand":{ x:.588, y:.660 },
    "contact:eumaeus-hand":{ x:.318, y:.700 },
    "contact:philoetius-hand":{ x:.648, y:.712 },
    "point:left-spear":{ x:.612, y:.910 },
    "point:right-spear":{ x:.640, y:.470 },
    "door:left-flank":{ x:.098, y:.560 },
    "door:right-flank":{ x:.905, y:.560 },
    "king:behind-line":{ x:.500, y:.980 },
    "focus:floor":{ x:.500, y:.740 },
    "camera:wide":{ x:.500, y:.560 },
    "camera:trio":{ x:.505, y:.760 },
  },

  zones:{
    line:{ x0:.12, y0:.72, x1:.88, y1:.99 },
    behind:{ x0:.04, y0:.48, x1:.96, y1:.70 },
    floor:{ x0:.10, y0:.66, x1:.90, y1:.98 },
  },

  states:{
    initial:"cordon",
    nodes:{
      "cordon":{ preview:{ formation:"cordon", sweep:0.08, stagger:0.10, attention:0.75,
                           resolve:0.55, density:1.0, background:1.0, wave:1.4,
                           foreground:0.25, debris:0.5, status:"HOLDING", progress:.10 } },
      "sweep-line":{ preview:{ formation:"sweep-line", sweep:0.50, stagger:0.30, attention:0.34,
                           resolve:0.80, density:1.0, background:1.00, wave:1.4,
                           foreground:0.40, debris:0.75, status:"SWEEPING", progress:.38 } },
      "flank-split":{ preview:{ formation:"flank-split", sweep:0.42, stagger:0.34, attention:0.10,
                           resolve:0.85, density:1.0, background:1.0, wave:0.28,
                           foreground:0.40, debris:0.75, status:"FLANKING", progress:.52 } },
      "wedge":{ preview:{ formation:"wedge", sweep:0.60, stagger:0.26, attention:0.55,
                           resolve:0.90, density:1.0, background:0.5, wave:1.4,
                           foreground:0.55, debris:0.8, status:"ADVANCING", progress:.64 } },
      "converge":{ preview:{ formation:"converge", sweep:0.72, stagger:0.22, attention:0.92,
                           resolve:1.0, density:1.0, background:0.0, wave:1.4,
                           foreground:0.45, debris:0.9, status:"CLOSING", progress:.78 } },
      "check-bodies":{ preview:{ formation:"check-bodies", sweep:0.94, stagger:0.20, attention:0.80,
                           resolve:1.0, density:1.0, background:0.0, wave:1.4,
                           foreground:0.60, debris:1.0, status:"CHECKING", progress:.90 } },
      "stand-down":{ preview:{ formation:"stand-down", sweep:0.00, stagger:0.00, attention:0.60,
                           resolve:0.35, density:1.0, background:0.5, wave:1.4,
                           foreground:0.30, debris:0.9, status:"CLEAR", progress:1.0 } },
    },
    edges:[["cordon","sweep-line"],["sweep-line","flank-split"],["flank-split","wedge"],
           ["wedge","converge"],["converge","check-bodies"],["check-bodies","stand-down"],
           ["check-bodies","sweep-line"],["sweep-line","cordon"]],
  },

  channels:["formation","sweep","stagger","density","attention","wave","resolve",
            "foreground","background","debris"],

  preview:()=>({ formation:"sweep-line", sweep:0.50, stagger:0.30, span:0.55,
                 density:1.0, attention:0.34, wave:1.4, resolve:0.80,
                 foreground:0.40, background:1.00, debris:0.75,
                 status:"SWEEPING", progress:.38 }),

  draw(ctx, W, H, state){
    drawEnsemble(ctx, W, H, state || {});
    return { anchors: asset.anchors, zones: asset.zones };
  },
};
export default asset;
