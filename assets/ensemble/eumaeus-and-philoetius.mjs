/* ensemble.eumaeus-and-philoetius — the two loyal herdsmen of Ithaca at the
   moment the farm turns into a battle line (Book XXII).

   ENSEMBLE asset, not a pair of portraits. ONE separable member template —
   a working herdsman whose kit is a continuous ARMING channel — instanced
   deterministically over a roster: two FRONT principals (the swineherd and
   the cowherd) plus a rear rank of the loyal household men, gated by
   DENSITY. Nothing about a member is hand-placed; every member is the same
   function reading a different row of the roster.

   The point of the asset is the verb in the prompt: *becoming*. A member's
   `arm` value runs 0 -> 1 and the kit crosses it in order:
       0.00   farm kit — staff, ox-hide, jug; bare head, hair cap
       0.28   the tool is set down and the helmet comes up in the hand
       0.50   THE SNAP — helmet on, shield and spear take the two hands
       1.00   shield up at the shoulder, spear at the ordered angle
   A single global `arming` drives every member through a per-member
   STAGGER, so one number renders the wave of arming crossing the room: the
   swineherd already a soldier while the cowherd still has the helmet in his
   fist and the household men still hold their jugs. That is the ENSEMBLE
   reaction-wave applied to costume instead of to heads.

   Exposed ENSEMBLE controls: FORMATION (serving | barring | arming |
   shield-wall | advance | guard-door), DENSITY (how much of the household
   is in frame), ATTENTION (how hard the heads come round onto the door),
   a reaction WAVE travelling left->right across the roster (heads, spear
   lift, forward lean), and FOREGROUND / BACKGROUND depth — a cropped near
   shield rim at the frame edge (the king's own shield, off-camera by
   design) and a rear rank of smaller, lighter men.

   No megaron is built here. The backdrop is a deliberately thin shell —
   broken floor runs, two cropped column stubs, two low wall courses — so the
   group composites over `location.megaron-hall`. Scenes stand the group at
   the `line:*` anchors.

   Solid grays + hard contour only; nothing pre-dithered. Light planes with
   dark accents: tunics, shields, helmets and the floor are the pale ground,
   and only beards, bosses, spearheads, crest teeth and belts carry heavy
   ink. The engine dotify POST pass supplies the halftone. Atlas OD-B22-S03. */

import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const D2R = Math.PI / 180;

/* the separable kit stages the arming channel walks, in order. Each one is
   legible from the silhouette alone, down at rear-rank size. */
export const KITS = ["farm", "taking-arms", "shielded", "ranked"];
export const ROLES = ["swineherd", "cowherd", "household"];
export const SNAP = 0.50;      // where the tool leaves the hand

/* ---------------- roster ----------------
   The entire cast in one deterministic table. `order` drives the arming
   stagger (0 arms first); `x` is normalized across W; `rank` selects the
   depth band. `role` picks the beard, the build and the farm tool — that
   is the only difference between any two members. */
const ROSTER = [
  { role:"swineherd", rank:"front", x:0.285, order:0, build:1.06 },
  { role:"cowherd",   rank:"front", x:0.655, order:1, build:1.00 },
  { role:"household", rank:"rear",  x:0.128, order:2, build:0.96 },
  { role:"household", rank:"rear",  x:0.862, order:3, build:1.00 },
  { role:"household", rank:"rear",  x:0.505, order:4, build:0.94 },
];

/* depth bands: footline fraction of H, member height as a fraction of H,
   garment ink level (rear stays a level lighter so it recedes) */
const BAND = {
  front: { footY:0.955, s:0.585, lvl:2, skin:1 },
  rear:  { footY:0.615, s:0.180, lvl:1, skin:1 },
};

/* ---------------- formation table ----------------
   A formation is not a new drawing — it is a row of numbers the same member
   template reads. `spear` is the shaft angle in degrees from straight up,
   toward the facing side; `spearLen` keeps a levelled spear inside the frame. */
const FORMATIONS = {
  "serving":    { arm:0.00, spear:  0, spearLen:0.88, stride:0.02, lean:0.00, shieldRise:0.0 },
  "barring":    { arm:0.24, spear: 18, spearLen:0.88, stride:0.06, lean:0.06, shieldRise:0.1 },
  "arming":     { arm:0.58, spear: 10, spearLen:0.88, stride:0.03, lean:0.02, shieldRise:0.7 },
  "shield-wall":{ arm:1.00, spear:  7, spearLen:0.88, stride:0.04, lean:0.03, shieldRise:1.0 },
  "advance":    { arm:1.00, spear: 52, spearLen:0.66, stride:0.15, lean:0.11, shieldRise:0.9 },
  "guard-door": { arm:1.00, spear: 30, spearLen:0.78, stride:0.05, lean:0.01, shieldRise:1.0 },
};

const params = {
  formation:"arming",
  arming:0.58,        // 0 farm hands .. 1 the whole line under arms
  stagger:0.36,       // per-member delay down the roster — this is "becoming"
  span:0.50,          // how long one member takes to cross 0 -> 1
  density:0.72,       // 0 the pair alone .. 1 the whole loyal household
  attention:0.80,     // 0 heads at their work .. 1 every head onto the door
  wave:1.40,          // 0..1 position of a reaction travelling left->right (>1 = off)
  waveSpread:0.20,    // width of that band
  resolve:0.70,       // 0 servants .. 1 combatants: stance widens, jaw sets
  foreground:0.60,    // the cropped near shield rim at the frame edge
  background:1.0,     // the rear rank's presence
  focus:{ x:0.52, y:0.36 },   // the hall door they are turning onto
  showShell:true,
  members:ROSTER.length,
};

/* ============================================================
   MEMBER TEMPLATE — one loyal man of the household.
   m = { cx, footY, s, F, role, build, arm, lvl, skinLvl, headDX,
         lean, stride, spearDeg, spearLen, shieldRise, resolve, wave }
   Every length keys off s, so the same function serves the ~515px
   principals and the ~170px rear rank without a second code path.
   ============================================================ */
export function loyalMan(pen, m){
  const g   = pen.ctx;
  const s   = m.s, cx = m.cx, footY = m.footY, F = m.F;
  const a   = clamp01(m.arm);
  const armed = a >= SNAP;
  const cw  = Math.max(2.2, s*0.015);
  const res = clamp01(m.resolve ?? 0.6);
  const B   = m.build || 1;

  const skin   = toneSolid(inkLevel(m.skinLvl ?? 1));
  const cloth  = toneSolid(inkLevel(m.lvl));
  const hide   = toneSolid(inkLevel(3));
  const strap  = toneSolid(inkLevel(4));
  const dark   = toneSolid(inkLevel(6));
  const shaftT = toneSolid(inkLevel(4));
  const paleT  = toneSolid(inkLevel(1));
  const helmT  = toneSolid(inkLevel(2));

  const hemY  = footY - s*0.288;
  const shY   = footY - s*0.720;
  const shW   = s*0.228*B, hemW = s*0.345*B;
  const headR = s*0.082;
  const leanPx= F*(m.lean||0)*s;
  const headCx= cx + leanPx*0.7 + (m.headDX||0);
  const headCy= shY - headR*1.28;

  /* ---- ground shadow ---- */
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY + s*0.010, hemW*0.66, s*0.026, 0, 0, 7); g.fill();

  /* ---- legs: bare herdsman shins ---- */
  const stride = (m.stride||0.03)*s*(0.6 + 0.8*res);
  const knee = footY - s*0.132;
  const leg = (dx, dz) => {
    pen.limb(()=>{ g.moveTo(cx+dx, hemY - s*0.015); g.lineTo(cx+dx+dz*0.45, knee); }, skin, s*0.072*B);
    pen.limb(()=>{ g.moveTo(cx+dx+dz*0.45, knee); g.lineTo(cx+dx+dz, footY - s*0.014); }, skin, s*0.060*B);
    pen.paint(()=>{ g.ellipse(cx+dx+dz+F*s*0.012, footY, s*0.048, s*0.017, 0, 0, 7); }, shaftT, cw*0.8);
  };
  leg(-F*hemW*0.22, -F*stride*0.55);      // trailing
  leg( F*hemW*0.20,  F*stride);           // leading

  /* ---- far arm, behind the torso ---- */
  const farSh = { x: cx - F*shW*0.46 + leanPx*0.5, y: shY + s*0.030 };
  if (!armed){
    const wr = { x: farSh.x - F*s*0.028, y: farSh.y + s*0.245 };
    pen.limb(()=>{ g.moveTo(farSh.x, farSh.y); g.lineTo(wr.x, wr.y); }, cloth, s*0.050*B);
    pen.paint(()=>{ g.arc(wr.x, wr.y, s*0.028, 0, 7); }, skin, cw*0.75);
  }

  /* ---- torso: the short working tunic, a pale blunt trapezoid ---- */
  pen.paint(()=>{
    g.moveTo(cx - shW/2 + leanPx, shY);
    g.lineTo(cx + shW/2 + leanPx, shY);
    g.lineTo(cx + hemW/2, hemY);
    g.lineTo(cx - hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  /* belt — a short dark band, local to the body, never a span of the frame */
  const beltY = lerp(shY, hemY, 0.60);
  pen.paint(()=>{ g.rect(cx - hemW*0.30, beltY, hemW*0.60, s*0.020); }, toneSolid(inkLevel(3)), cw*0.7);
  /* the baldric appears with the sword-belt at the snap: one dark diagonal
     that breaks the pale plane of the chest */
  if (armed){
    const d = smooth(clamp01((a - SNAP)/0.28));
    pen.paint(()=>{
      g.moveTo(cx - F*shW*0.34 + leanPx, shY + s*0.010);
      g.lineTo(cx - F*shW*0.10 + leanPx, shY + s*0.010);
      g.lineTo(cx + F*hemW*0.42, hemY - s*0.060*d - s*0.010);
      g.lineTo(cx + F*hemW*0.42 - F*hemW*0.22, hemY - s*0.050*d - s*0.010);
      g.closePath();
    }, strap, cw*0.6);
  }
  /* three short drape folds under the belt — broken, never a span */
  for (let i = -1; i <= 1; i++){
    const bx = cx + i*hemW*0.26;
    pen.seam(()=>{ g.moveTo(bx, beltY + s*0.040);
                   g.lineTo(bx + i*hemW*0.10, hemY - s*0.020); }, cw*0.55);
  }

  /* ---- the swineherd's hide cloak, shrugged off as he arms ---- */
  if (m.role === "swineherd" && a < 0.62){
    pen.paint(()=>{
      g.moveTo(cx - F*shW*0.62 + leanPx, shY - s*0.010);
      g.quadraticCurveTo(cx - F*shW*0.96, lerp(shY, hemY, 0.55), cx - F*hemW*0.68, hemY + s*0.006);
      g.lineTo(cx - F*hemW*0.12, hemY + s*0.002);
      g.quadraticCurveTo(cx - F*shW*0.24, lerp(shY, hemY, 0.40), cx - F*shW*0.12 + leanPx, shY - s*0.010);
      g.closePath();
    }, hide, cw);
  }

  /* ---- neck + head ---- */
  pen.limb(()=>{ g.moveTo(cx + leanPx, shY + s*0.008); g.lineTo(headCx, headCy + headR*0.80); }, skin, s*0.052*B);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.92, headR, 0, 0, 7); }, skin, cw);

  /* eye + set brow: two marks. No small type anywhere in this asset. */
  g.fillStyle = INK;
  g.beginPath(); g.arc(headCx + F*headR*0.30, headCy - headR*0.06, Math.max(1.8, headR*0.15), 0, 7); g.fill();
  pen.ink(()=>{ g.moveTo(headCx + F*headR*0.02, headCy - headR*0.44);
                g.lineTo(headCx + F*headR*0.62, headCy - headR*0.34 - res*headR*0.12); }, Math.max(2.2, headR*0.17));
  pen.ink(()=>{ g.moveTo(headCx + F*headR*0.40, headCy - headR*0.02);
                g.lineTo(headCx + F*headR*0.52, headCy + headR*0.24); }, Math.max(2, headR*0.13));

  /* beard — the dark accent that carries the face at any size */
  const bl = m.role === "swineherd" ? 5 : 5;
  pen.paint(()=>{
    g.moveTo(headCx - headR*0.80, headCy + headR*0.20);
    g.quadraticCurveTo(headCx + F*headR*0.18, headCy + headR*1.30, headCx + headR*0.80, headCy + headR*0.20);
    g.quadraticCurveTo(headCx, headCy + headR*0.66, headCx - headR*0.80, headCy + headR*0.20);
  }, toneSolid(inkLevel(bl)), cw*0.8);

  if (!armed){
    /* bare head: hair as a crescent band, so the brow stays paper */
    pen.paint(()=>{
      g.arc(headCx, headCy - headR*0.02, headR*1.02, Math.PI*1.14, Math.PI*1.86);
      g.arc(headCx, headCy - headR*0.02, headR*0.66, Math.PI*1.86, Math.PI*1.14, true);
      g.closePath();
    }, toneSolid(inkLevel(bl)), cw*0.7);
  } else {
    /* ---- HELMET, seated at the snap. Pale dome, dark crest teeth. ---- */
    const R = headR*1.12;
    const hy = headCy;
    pen.paint(()=>{
      g.moveTo(headCx - R, hy + headR*0.06);
      g.quadraticCurveTo(headCx - R*0.98, hy - R*0.86, headCx, hy - R*0.88);
      g.quadraticCurveTo(headCx + R*0.98, hy - R*0.86, headCx + R, hy + headR*0.06);
      g.closePath();
    }, helmT, cw);
    pen.paint(()=>{ g.rect(headCx - R, hy - headR*0.20, R*2, headR*0.20); }, strap, cw*0.7);
    for (let i = -2; i <= 2; i++){            // five separate crest teeth
      const bx = headCx + i*R*0.31;
      const bh = R*(0.22 - Math.abs(i)*0.040);
      pen.paint(()=>{ g.rect(bx - R*0.065, hy - R*0.88 - bh, R*0.13, bh + R*0.09); }, dark, cw*0.5);
    }
    pen.paint(()=>{ g.rect(headCx + F*headR*0.06 - R*0.065, hy + headR*0.00, R*0.13, headR*0.52); }, strap, cw*0.5);
  }

  /* ---- SHIELD (post-snap): a big pale ox-hide disc, dark only at the boss ---- */
  if (armed){
    const rise = clamp01(m.shieldRise ?? 1) * smooth(clamp01((a - SNAP)/0.50));
    const R  = s*0.158*B;
    const sx = cx - F*s*0.150;
    const sy = lerp(hemY + s*0.010, shY + s*0.175, rise);
    pen.paint(()=>{ g.arc(sx, sy, R, 0, 7); }, paleT, cw*1.15);
    pen.ink(()=>{ g.arc(sx, sy, R*0.84, 0, 7); }, cw*0.85);
    pen.paint(()=>{ g.arc(sx, sy, R*0.19, 0, 7); }, dark, cw*0.7);
    for (let i = 0; i < 4; i++){               // four short spokes, never a grid
      const th = (i*90 + 45)*D2R;
      pen.ink(()=>{ g.moveTo(sx + Math.cos(th)*R*0.28, sy + Math.sin(th)*R*0.28);
                    g.lineTo(sx + Math.cos(th)*R*0.64, sy + Math.sin(th)*R*0.64); }, cw*0.8);
    }
    pen.limb(()=>{ g.moveTo(farSh.x, farSh.y); g.lineTo(sx + F*R*0.26, sy - R*0.10); }, skin, s*0.044*B);
  }

  /* ---- near arm + what is in the hand ---- */
  const nearSh = { x: cx + F*shW*0.44 + leanPx, y: shY + s*0.040 };
  if (a < 0.28){
    /* FARM KIT — role picks the tool; the hand is doing work, not war */
    if (m.role === "swineherd"){
      const grip = { x: cx + F*s*0.150, y: shY + s*0.115 };
      pen.limb(()=>{ g.moveTo(nearSh.x, nearSh.y); g.lineTo(grip.x, grip.y); }, cloth, s*0.050*B);
      pen.limb(()=>{ g.moveTo(grip.x - F*s*0.012, grip.y - s*0.520); g.lineTo(grip.x + F*s*0.030, footY - s*0.004); },
               shaftT, s*0.024);                            // the tall staff
      pen.paint(()=>{ g.arc(grip.x, grip.y, s*0.030, 0, 7); }, skin, cw*0.75);
    } else if (m.role === "cowherd"){
      const rx = cx + F*s*0.195, ry = hemY - s*0.060;
      pen.limb(()=>{ g.moveTo(nearSh.x, nearSh.y); g.lineTo(rx - F*s*0.02, ry - s*0.050); }, cloth, s*0.050*B);
      pen.paint(()=>{                                        // the rolled ox-hide
        g.moveTo(rx - s*0.070, ry - s*0.085);
        g.lineTo(rx + s*0.070, ry - s*0.085);
        g.quadraticCurveTo(rx + s*0.100, ry + s*0.010, rx + s*0.058, ry + s*0.100);
        g.lineTo(rx - s*0.058, ry + s*0.100);
        g.quadraticCurveTo(rx - s*0.100, ry + s*0.010, rx - s*0.070, ry - s*0.085);
        g.closePath();
      }, hide, cw);
      pen.seam(()=>{ g.moveTo(rx - s*0.050, ry - s*0.020); g.lineTo(rx + s*0.050, ry - s*0.020); }, cw*0.55);
      pen.seam(()=>{ g.moveTo(rx - s*0.044, ry + s*0.042); g.lineTo(rx + s*0.044, ry + s*0.042); }, cw*0.55);
      pen.paint(()=>{ g.arc(rx - F*s*0.020, ry - s*0.080, s*0.028, 0, 7); }, skin, cw*0.75);
    } else {
      const jx = cx + F*s*0.165, jy = hemY - s*0.020;
      pen.limb(()=>{ g.moveTo(nearSh.x, nearSh.y); g.lineTo(jx, jy - s*0.055); }, cloth, s*0.050*B);
      pen.paint(()=>{ g.ellipse(jx, jy, s*0.054, s*0.070, 0, 0, 7); }, hide, cw*0.8);
      pen.paint(()=>{ g.rect(jx - s*0.018, jy - s*0.118, s*0.036, s*0.052); }, hide, cw*0.7);
      pen.paint(()=>{ g.arc(jx, jy - s*0.066, s*0.026, 0, 7); }, skin, cw*0.7);
    }
  } else if (!armed){
    /* TAKING ARMS — the tool is down, the helmet is up in the fist. This is
       the visible half-second the whole asset exists for. */
    const u = smooth(clamp01((a - 0.28)/(SNAP - 0.28)));
    const gx = cx + F*s*(0.200 + 0.030*u);
    const gy = lerp(hemY - s*0.140, headCy + headR*0.95, u);
    const R  = headR*1.10;
    pen.limb(()=>{ g.moveTo(nearSh.x, nearSh.y); g.lineTo(gx - F*s*0.02, gy + s*0.030); }, cloth, s*0.050*B);
    pen.paint(()=>{
      g.moveTo(gx - R, gy + R*0.14);
      g.quadraticCurveTo(gx - R*0.98, gy - R*0.86, gx, gy - R*0.88);
      g.quadraticCurveTo(gx + R*0.98, gy - R*0.86, gx + R, gy + R*0.14);
      g.closePath();
    }, helmT, cw);
    pen.paint(()=>{ g.rect(gx - R, gy - R*0.14, R*2, R*0.18); }, strap, cw*0.6);
    for (let i = -2; i <= 2; i++){
      const bx = gx + i*R*0.31, bh = R*(0.22 - Math.abs(i)*0.040);
      pen.paint(()=>{ g.rect(bx - R*0.065, gy - R*0.88 - bh, R*0.13, bh + R*0.09); }, dark, cw*0.5);
    }
    pen.paint(()=>{ g.arc(gx - F*R*0.86, gy + R*0.06, s*0.030, 0, 7); }, skin, cw*0.75);
    /* the staff or hide, set down against the leg */
    pen.limb(()=>{ g.moveTo(cx + F*hemW*0.62, hemY + s*0.010);
                   g.lineTo(cx + F*hemW*0.42, footY - s*0.004); }, shaftT, s*0.020);
  } else {
    /* SPEAR — the snap has happened. Angle measured from vertical. */
    const lift = (m.wave||0) * 14;
    const th   = (m.spearDeg ?? 10) + lift;
    const dir  = { x: F*Math.sin(th*D2R), y: -Math.cos(th*D2R) };
    const grip = { x: cx + F*s*0.145 + leanPx, y: shY + s*0.105 };
    const L    = s*(m.spearLen ?? 0.88);
    const butt = { x: grip.x - dir.x*L*0.30, y: grip.y - dir.y*L*0.30 };
    const tip  = { x: grip.x + dir.x*L*0.70, y: grip.y + dir.y*L*0.70 };
    pen.limb(()=>{ g.moveTo(nearSh.x, nearSh.y); g.lineTo(grip.x - F*s*0.02, grip.y - s*0.020); }, cloth, s*0.050*B);
    pen.limb(()=>{ g.moveTo(butt.x, butt.y); g.lineTo(tip.x, tip.y); }, shaftT, s*0.022);
    pen.paint(()=>{                                          // leaf head
      g.moveTo(tip.x, tip.y);
      g.lineTo(tip.x - dir.y*s*0.032 - dir.x*s*0.098, tip.y + dir.x*s*0.032 - dir.y*s*0.098);
      g.lineTo(tip.x + dir.y*s*0.032 - dir.x*s*0.098, tip.y - dir.x*s*0.032 - dir.y*s*0.098);
      g.closePath();
    }, dark, cw*0.7);
    pen.paint(()=>{ g.arc(grip.x, grip.y, s*0.032, 0, 7); }, skin, cw*0.75);
  }
}

/* ============================================================
   the thin hall shell — broken floor runs, two cropped column stubs and
   ONE narrow doorway. Deliberately NOT a room: `location.megaron-hall`
   is the room; this is only enough depth for the group to stand in.
   ============================================================ */
function shell(pen, g, W, H){
  const floorY = H*0.545;
  const pale = toneSolid(inkLevel(1));
  const mid  = toneSolid(inkLevel(2));

  g.fillStyle = inkLevel(1); g.fillRect(0, floorY, W, H - floorY);

  /* two column stubs, cropped by the top of the frame — the only vertical
     structure the group needs; the megaron itself is a different asset */
  for (const cxn of [0.052, 0.948]){
    const cxp = W*cxn, cwid = W*0.052;
    pen.paint(()=>{ g.rect(cxp - cwid/2, H*0.185, cwid, floorY - H*0.185); }, pale, 3.5);
    pen.paint(()=>{ g.rect(cxp - cwid*0.80, H*0.185, cwid*1.60, H*0.030); }, mid, 3.5);
    pen.seam(()=>{ g.moveTo(cxp - cwid*0.18, H*0.250); g.lineTo(cxp - cwid*0.18, floorY - H*0.04); }, 2.2);
  }

  /* the floor line, in three runs so it never stripes the frame */
  g.strokeStyle = INK; g.lineWidth = 3;
  for (const [a, b] of [[0.02, 0.23], [0.34, 0.61], [0.72, 0.98]]){
    g.beginPath(); g.moveTo(W*a, floorY); g.lineTo(W*b, floorY); g.stroke();
  }
  /* receding floor joints, staggered and broken */
  g.globalAlpha = 0.30;
  for (const [y, a, b] of [[0.700, 0.04, 0.34], [0.700, 0.63, 0.96],
                           [0.855, 0.13, 0.42], [0.855, 0.67, 0.93]]){
    g.beginPath(); g.moveTo(W*a, H*y); g.lineTo(W*b, H*y); g.stroke();
  }
  g.globalAlpha = 1;
}

/* the cropped near pieces — the king's shield rim entering bottom-right and
   his son's spear planted bottom-left, both off-frame by design. This is
   the ENSEMBLE's foreground control. */
function foregroundCrop(pen, g, W, H, amt){
  if (amt <= 0.02) return;
  const R = W*(0.24 + 0.09*amt);
  const cxp = W*(1.00 + 0.04*amt), cyp = H*(1.05 - 0.03*amt);
  /* the king's own shield, cut by two frame edges — the ENSEMBLE's
     foreground plane, and the reason the group reads as a line, not a pair */
  pen.paint(()=>{ g.arc(cxp, cyp, R, 0, 7); }, toneSolid(inkLevel(2)), 5);
  pen.ink(()=>{ g.arc(cxp, cyp, R*0.82, Math.PI*0.92, Math.PI*1.62); }, 3.5);
  for (let i = 0; i < 2; i++){
    const th = Math.PI*(1.16 + i*0.26);
    pen.ink(()=>{ g.moveTo(cxp + Math.cos(th)*R*0.40, cyp + Math.sin(th)*R*0.40);
                  g.lineTo(cxp + Math.cos(th)*R*0.70, cyp + Math.sin(th)*R*0.70); }, 3);
  }
}

/* ============================================================
   STAGE
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;

  const formName  = FORMATIONS[st.formation] ? st.formation : params.formation;
  const F0        = FORMATIONS[formName];
  const arming    = clamp01(st.arming ?? (st.formation ? F0.arm : params.arming));
  const stagger   = st.stagger    ?? params.stagger;
  const span      = st.span       ?? params.span;
  const density   = clamp01(st.density   ?? params.density);
  const attention = clamp01(st.attention ?? params.attention);
  const wave      = st.wave       ?? params.wave;
  const waveSpread= st.waveSpread ?? params.waveSpread;
  const resolve   = clamp01(st.resolve   ?? params.resolve);
  const fg        = clamp01(st.foreground?? params.foreground);
  const bg        = clamp01(st.background?? params.background);
  const focus     = st.focus      || params.focus;
  const showShell = st.showShell  ?? params.showShell;

  if (showShell) shell(pen, g, W, H);

  /* how much of the household is present */
  const rearCount = Math.round(clamp01(density) * 3 * bg);
  let rearSeen = 0;
  const roster = ROSTER.filter(r => r.rank === "front" ? true : (rearSeen++) < rearCount);

  const focusX = focus.x * W;

  /* back -> front: the rear rank first, then the two principals */
  const ordered = roster.slice().sort((a, b) =>
    (a.rank === b.rank ? a.x - b.x : (a.rank === "rear" ? -1 : 1)));

  for (const r of ordered){
    const bd = BAND[r.rank];
    const s  = bd.s * H;
    const footY = bd.footY * H;
    const cx = r.x * W;
    const face = 1;                       // the whole line squares up the same way

    /* the arming wave: one number, staggered down the roster */
    const arm = clamp01((arming - r.order*stagger) / Math.max(0.05, span));

    /* the reaction wave: a band travelling left -> right across x */
    const dw = (r.x - wave) / Math.max(0.03, waveSpread);
    const wv = (wave > 1.05 || wave < -0.05) ? 0 : Math.exp(-dw*dw);

    /* heads come round onto the door */
    const toFocus = clamp((focusX - cx)/(W*0.42), -1, 1);
    const headDX  = toFocus * (attention*0.55 + wv*0.35) * s*0.070;

    loyalMan(pen, {
      cx, footY, s, F: face, role: r.role, build: r.build,
      arm, lvl: bd.lvl, skinLvl: bd.skin, headDX,
      lean:   F0.lean * (0.6 + 0.8*resolve) + wv*0.02,
      stride: F0.stride,
      spearDeg: F0.spear,
      spearLen: F0.spearLen,
      shieldRise: F0.shieldRise,
      resolve, wave: wv,
    });
  }

  foregroundCrop(pen, g, W, H, fg);
}

export const asset = {
  id:"ensemble.eumaeus-and-philoetius",
  type:"ENSEMBLE",
  name:"Eumaeus and Philoetius",
  statusWord:"ARMING",
  scene:"OD-B22-S03",

  params,

  /* the separable member system, declared: ONE template, one roster, one
     kit ladder that the `arming` channel walks */
  member:{
    template:"loyalMan",
    roles:ROLES,
    kits:KITS,
    roster:ROSTER,
    bands:BAND,
    formations:Object.keys(FORMATIONS),
    stagger:"arm_i = clamp01((arming - order_i*stagger)/span)",
    snap:SNAP,      // tool -> helmet, shield and spear
  },

  layers:["floor","wall-courses","columns","rear-rank","far-arm","legs","tunic",
          "belt","baldric","hide-cloak","shield","neck","head","beard",
          "helmet","near-arm","tool","spear","foreground-crop"],

  /* placement / contact / camera anchors in 0..1 asset space.
     `line:*` are where a scene stands the group; `contact:*` are the two
     hands a scene can hand something to. */
  anchors:{
    "line:left":{ x:.285, y:.955 },
    "line:right":{ x:.655, y:.955 },
    "line:centre":{ x:.470, y:.955 },
    "rear:left":{ x:.128, y:.615 },
    "rear:right":{ x:.862, y:.615 },
    "rear:centre":{ x:.505, y:.615 },
    "contact:swineherd-hand":{ x:.400, y:.640 },
    "contact:cowherd-hand":{ x:.770, y:.640 },
    "shield:left":{ x:.195, y:.640 },
    "shield:right":{ x:.565, y:.640 },
    "spear:left-tip":{ x:.360, y:.270 },
    "spear:right-tip":{ x:.730, y:.270 },
    "focus:hall-door":{ x:.520, y:.360 },
    "king:right-of-line":{ x:.500, y:.968 },
    "camera:wide":{ x:.500, y:.560 },
    "camera:pair":{ x:.470, y:.700 },
  },

  zones:{
    line:{ x0:.16, y0:.72, x1:.80, y1:.99 },
    behind:{ x0:.02, y0:.56, x1:.98, y1:.70 },
    gap:{ x0:.40, y0:.40, x1:.60, y1:.60 },
  },

  states:{
    initial:"serving",
    nodes:{
      /* the whole Book XXII arc of these two, as ONE channel */
      "serving":{ preview:{ formation:"serving", arming:0.00, attention:0.25,
                            resolve:0.15, density:1.0, wave:1.4, foreground:0.0,
                            status:"SERVING", progress:.08 } },
      "barring":{ preview:{ formation:"barring", arming:0.24, attention:0.55,
                            resolve:0.40, density:0.4, wave:0.30, foreground:0.2,
                            status:"BARRING", progress:.22 } },
      "arming":{  preview:{ formation:"arming", arming:0.58, attention:0.80,
                            resolve:0.70, density:0.72, wave:1.4, foreground:0.60,
                            status:"ARMING", progress:.46 } },
      "shield-wall":{ preview:{ formation:"shield-wall", arming:1.0, attention:0.92,
                            resolve:1.0, density:0.72, wave:1.4, foreground:0.7,
                            status:"WALLED", progress:.68 } },
      "advance":{ preview:{ formation:"advance", arming:1.0, attention:1.0,
                            resolve:1.0, density:0.36, wave:0.55, foreground:0.5,
                            status:"ADVANCING", progress:.86 } },
      "guard-door":{ preview:{ formation:"guard-door", arming:1.0, attention:0.85,
                            resolve:0.9, density:0.34, wave:1.4, foreground:0.3,
                            status:"HOLDING", progress:.96 } },
    },
    edges:[["serving","barring"],["barring","arming"],["arming","shield-wall"],
           ["shield-wall","advance"],["advance","guard-door"],
           ["guard-door","shield-wall"],["shield-wall","arming"]],
  },

  channels:["formation","arming","stagger","density","attention","wave","resolve",
            "foreground","background"],

  preview:()=>({ formation:"arming", arming:0.58, stagger:0.36, density:0.72,
                 attention:0.80, wave:1.4, resolve:0.70, foreground:0.60,
                 background:1.0, status:"ARMING", progress:.46 }),

  draw(ctx, W, H, state){
    drawEnsemble(ctx, W, H, state || {});
    return { anchors: asset.anchors, zones: asset.zones };
  },
};
export default asset;
