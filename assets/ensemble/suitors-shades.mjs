/* ensemble.suitors-shades — the hundred-odd men Odysseus killed, one day dead.
   ENSEMBLE asset (OD-B24-S01). Book XXIV opens with Hermes driving the suitors'
   ghosts down past Ocean, the White Rock and the gates of the Sun into the
   asphodel meadow; they go gibbering like bats in a cave. They are NEW dead —
   they still carry the wounds that killed them, they still fall into the same
   social knots they kept in the megaron, they are frightened, and every one of
   them needs to EXPLAIN how he died.

   Built from ONE separable member template (drawMember) instanced across a
   deterministic ROSTER of 14 men, distributed over five social CLUSTERS on three
   depth bands. Nothing is baked in but the meadow rule, the asphodel and the
   dark gate-notch they were driven through; Hermes, Agamemnon and Achilles are
   cast separately.

   Channels the atlas asks an ENSEMBLE for:
     formation   clusters | column | arc | huddle
     density     0 thins the roster to the cluster leaders .. 1 the whole crowd
     attention   0 each knot argues inward .. 1 every head turns to the listener
     wave        reaction-wave POSITION 0..1 sweeping left->right through the crowd
     waveWidth   how many men the wavefront catches at once
     fear        baseline dread under the wave (lean-back, raised hands)
     foreground  emphasis on the near band (scale + contour weight)
     background  how far back the far band reads (fade + scale)

   TONE: everything structural is drawn LIGHT — near-paper robes, pale wisp lower
   bodies — with a hard black contour. The only deep ink in the frame is the
   WOUNDS, the hollow eye-sockets, the gaping mouths and the gate-notch, so the
   plate reads as a bright crowd of ghosts pinned by a scatter of black death-marks.
   The engine dotify POST pass supplies the halftone; nothing here is pre-dithered. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const smooth  = t => { t = clamp01(t); return t*t*(3-2*t); };
const norm    = v => { const n = Math.hypot(v.x, v.y) || 1; return { x:v.x/n, y:v.y/n }; };

/* ------------------------------------------------------------------
   the member ROSTER — one template, fourteen men. `c` is the social
   cluster (the knot he stood in when he was alive), `u` his place inside
   it, `pri` the keep-order used by `density` (cluster leaders first, so
   thinning never empties a knot).
   ------------------------------------------------------------------ */
const ROSTER = [
  // cluster 0 — the back-left knot
  { c:0, u:0.00, pri:0,  age:"adult", build:1.00, wound:"chest",  hair:"curly", gest:"explain" },
  { c:0, u:0.55, pri:5,  age:"young", build:0.92, wound:"throat", hair:"short", gest:"appeal"  },
  { c:0, u:1.00, pri:10, age:"adult", build:1.06, wound:"back",   hair:"long",  gest:"listen"  },
  // cluster 1 — the back-right knot
  { c:1, u:0.00, pri:1,  age:"adult", build:0.98, wound:"gut",    hair:"short", gest:"explain" },
  { c:1, u:0.55, pri:6,  age:"elder", build:1.04, wound:"head",   hair:"long",  gest:"listen"  },
  { c:1, u:1.00, pri:11, age:"young", build:0.90, wound:"chest",  hair:"curly", gest:"listen"  },
  // cluster 2 — the middle knot
  { c:2, u:0.00, pri:2,  age:"adult", build:1.02, wound:"throat", hair:"long",  gest:"appeal"  },
  { c:2, u:0.52, pri:7,  age:"young", build:0.94, wound:"back",   hair:"short", gest:"explain" },
  { c:2, u:1.00, pri:12, age:"adult", build:1.00, wound:"chest",  hair:"curly", gest:"listen"  },
  // cluster 3 — the near-left knot (foreground)
  { c:3, u:0.00, pri:3,  age:"adult", build:1.05, wound:"chest",  hair:"curly", gest:"explain" },
  { c:3, u:0.55, pri:8,  age:"elder", build:0.98, wound:"head",   hair:"long",  gest:"appeal"  },
  { c:3, u:1.00, pri:13, age:"young", build:0.92, wound:"throat", hair:"short", gest:"fear"    },
  // cluster 4 — the near-right pair (foreground)
  { c:4, u:0.00, pri:4,  age:"adult", build:1.03, wound:"gut",    hair:"short", gest:"explain" },
  { c:4, u:1.00, pri:9,  age:"young", build:0.95, wound:"back",   hair:"curly", gest:"listen"  },
];

/* cluster geometry per FORMATION: centre (0..1 of W/H), member height in px of
   an 880-tall plate, lateral half-spread, and which way the knot faces. */
const FORMATIONS = {
  // the knots they kept in the hall, re-formed in the meadow
  clusters:[
    { x:0.180, y:0.452, s:134, w:0.092, face: 1, band:0 },
    { x:0.800, y:0.438, s:126, w:0.084, face:-1, band:0 },
    { x:0.530, y:0.602, s:164, w:0.118, face:-1, band:1 },
    { x:0.278, y:0.848, s:228, w:0.144, face: 1, band:2 },
    { x:0.765, y:0.818, s:212, w:0.078, face:-1, band:2 },
  ],
  // driven down the road in a file — `h` spreads each knot along the file, not across it
  column:[
    { x:0.735, y:0.388, s:94,  w:0.046, h:0.024, face:-1, band:0 },
    { x:0.625, y:0.458, s:114, w:0.048, h:0.028, face:-1, band:0 },
    { x:0.508, y:0.560, s:148, w:0.052, h:0.032, face:-1, band:1 },
    { x:0.382, y:0.696, s:186, w:0.056, h:0.034, face:-1, band:2 },
    { x:0.258, y:0.852, s:220, w:0.046, h:0.026, face:-1, band:2 },
  ],
  // opened out to face a listener at the front — the testimony chorus
  arc:[
    { x:0.175, y:0.800, s:170, w:0.048, face: 1, band:2 },
    { x:0.348, y:0.672, s:152, w:0.066, face: 1, band:1 },
    { x:0.512, y:0.572, s:130, w:0.076, face: 1, band:0 },
    { x:0.678, y:0.672, s:154, w:0.066, face:-1, band:1 },
    { x:0.845, y:0.800, s:172, w:0.046, face:-1, band:2 },
  ],
  // one frightened mass, shoulder to shoulder
  huddle:[
    { x:0.372, y:0.470, s:132, w:0.070, face: 1, band:0 },
    { x:0.612, y:0.452, s:126, w:0.066, face:-1, band:0 },
    { x:0.492, y:0.632, s:176, w:0.086, face: 1, band:1 },
    { x:0.352, y:0.828, s:224, w:0.098, face: 1, band:2 },
    { x:0.648, y:0.812, s:216, w:0.072, face:-1, band:2 },
  ],
};

/* the three depth bands — a broken meadow rule (never a full-width bar) with
   asphodel stubble standing on it. The gaps are wide and unequal so no rule
   ever stripes the plate. */
const BANDS = [
  { y:0.452, segs:[[0.058,0.300],[0.672,0.918]] },
  { y:0.618, segs:[[0.028,0.232],[0.604,0.848]] },
  { y:0.856, segs:[[0.052,0.336],[0.658,0.962]] },
];

const params = {
  formation:"clusters",
  density:1.0,
  attention:0.82,
  wave:0.42,          // reaction-wave position, 0 = left edge .. 1 = right edge
  waveWidth:0.26,     // how wide the front is, in fractions of W
  fear:0.34,          // baseline dread under the wave
  foreground:0.72,    // near-band emphasis
  background:0.58,    // far-band recession
  focus:{ x:0.50, y:0.965 },   // the listener they are explaining themselves to
  showMeadow:true,
  showGate:true,
  showBats:true,      // Homer's simile — the shades stream out squeaking like bats
  showTestimony:true, // the dotted speech arcs from the explainers to the listener
};

/* ==================================================================
   ONE MEMBER — a new-dead man. Pale robe torso on a dissolving wisp,
   gaunt pale head with hollow sockets and a gaping mouth, and the DARK
   wound that killed him. Everything light except the death-marks.
   ================================================================== */
function drawMember(pen, g, m){
  const s = m.s, F = m.face;
  const cx = m.x, footY = m.y;
  const robe  = toneSolid(inkLevel(m.robeLvl));
  const robe2 = toneSolid(inkLevel(Math.min(4, m.robeLvl + 1)));
  const skin  = toneSolid(inkLevel(1));
  const wisp  = toneSolid(inkLevel(Math.max(0, m.robeLvl - 1)));
  const hairT = toneSolid(inkLevel(m.age === "elder" ? 2 : 3));
  const DARK  = inkLevel(7);
  const cw    = Math.max(1.5, s * 0.0165) * m.contour;

  const shoY    = footY - s * 0.660;
  const hipY    = footY - s * 0.300;
  const shoHalf = s * 0.152 * m.build;
  const hipHalf = s * 0.122 * m.build;
  const headR   = s * 0.112 * (m.age === "young" ? 0.94 : 1.0);
  const lean    = m.lean;
  const shoCx   = cx + lean;
  const headCx  = shoCx + F * headR * 0.16 + m.headTurn * headR;
  const headCy  = shoY - headR * 1.30;
  const torsoH  = hipY - shoY;

  g.save();
  g.globalAlpha = m.alpha;

  /* ---- dissolving WISP lower body: a shroud fringed into trailing tongues ---- */
  pen.paint(() => {
    g.moveTo(cx - hipHalf, hipY);
    g.quadraticCurveTo(cx - hipHalf * 1.55, footY - s * 0.13, cx - hipHalf * 1.62, footY);
    const T = 4;
    for (let k = 0; k < T; k++) {
      const x0 = lerp(cx - hipHalf * 1.62, cx + hipHalf * 1.62, k / T);
      const x1 = lerp(cx - hipHalf * 1.62, cx + hipHalf * 1.62, (k + 1) / T);
      const dip = [0.20, 0.30, 0.24, 0.17][k];
      g.quadraticCurveTo((x0 + x1) / 2, footY - s * dip, x1, footY - s * (k === 3 ? 0.05 : 0));
    }
    g.quadraticCurveTo(cx + hipHalf * 1.55, footY - s * 0.13, cx + hipHalf, hipY);
    g.closePath();
  }, wisp, cw * 0.85);
  // faint vapour streaks so the lower body reads as smoke, not a skirt
  if (m.detail) {
    g.strokeStyle = inkLevel(3); g.lineWidth = Math.max(1, cw * 0.55); g.globalAlpha = m.alpha * 0.55;
    for (let k = -1; k <= 1; k += 2) {
      g.beginPath();
      g.moveTo(cx + k * hipHalf * 0.55, hipY + s * 0.02);
      g.quadraticCurveTo(cx + k * hipHalf * 0.85, footY - s * 0.16, cx + k * hipHalf * 0.62, footY - s * 0.06);
      g.stroke();
    }
    g.globalAlpha = m.alpha;
  }

  /* ---- BACK arm (behind the torso) ---- */
  const shBack  = { x: shoCx - F * shoHalf * 0.86, y: shoY + s * 0.014 };
  const shFront = { x: shoCx + F * shoHalf * 0.86, y: shoY + s * 0.014 };
  drawArm(g, shBack, m.armBack, F, s, inkLevel(Math.min(4, m.robeLvl + 1)), inkLevel(1), cw);

  /* ---- TORSO: light robe trapezoid, leaning ---- */
  pen.paint(() => {
    g.moveTo(cx - hipHalf, hipY);
    g.lineTo(cx + hipHalf, hipY);
    g.lineTo(shoCx + shoHalf, shoY);
    g.lineTo(shoCx - shoHalf, shoY);
    g.closePath();
  }, robe, cw);
  // belt + one drape fold
  pen.seam(() => { g.moveTo(cx - hipHalf * 0.92, hipY - torsoH * 0.10); g.lineTo(cx + hipHalf * 0.92, hipY - torsoH * 0.10); }, cw * 0.6);
  if (m.detail) pen.seam(() => { g.moveTo(shoCx - F * shoHalf * 0.25, shoY + torsoH * 0.16); g.lineTo(cx - F * hipHalf * 0.35, hipY - torsoH * 0.12); }, cw * 0.5);

  /* ---- neck + head ---- */
  g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = s * 0.052 + cw * 1.6;
  g.beginPath(); g.moveTo(shoCx, shoY + s * 0.006); g.lineTo(headCx, headCy + headR * 0.80); g.stroke();
  g.strokeStyle = inkLevel(1); g.lineWidth = s * 0.052;
  g.beginPath(); g.moveTo(shoCx, shoY + s * 0.006); g.lineTo(headCx, headCy + headR * 0.80); g.stroke();

  // hair mass behind (kept mid-grey, never black)
  if (m.hair !== "none") {
    pen.paint(() => {
      if (m.hair === "curly") {
        for (let k = -2; k <= 2; k++) {
          g.moveTo(headCx + k * headR * 0.42 + headR * 0.34, headCy - headR * 0.34);
          g.arc(headCx + k * headR * 0.42, headCy - headR * 0.34, headR * 0.40, 0, 7);
        }
        g.moveTo(headCx + headR * 1.05, headCy);
        g.ellipse(headCx, headCy, headR * 1.05, headR * 1.08, 0, 0, 7);
      } else if (m.hair === "long") {
        g.moveTo(headCx - headR * 1.06, headCy + headR * 0.10);
        g.quadraticCurveTo(headCx, headCy - headR * 1.65, headCx + headR * 1.06, headCy + headR * 0.10);
        g.lineTo(headCx + headR * 1.02, headCy + headR * 1.05);
        g.lineTo(headCx - headR * 1.02, headCy + headR * 1.05);
        g.closePath();
      } else {
        g.moveTo(headCx - headR * 1.00, headCy - headR * 0.02);
        g.quadraticCurveTo(headCx, headCy - headR * 1.55, headCx + headR * 1.00, headCy - headR * 0.02);
        g.closePath();
      }
    }, hairT, cw * 0.8);
  }

  // the gaunt pale face
  pen.paint(() => { g.ellipse(headCx, headCy, headR * 0.86, headR * 1.02, 0, 0, 7); }, skin, cw);
  // hollow cheek arc — the new dead are already sunken
  if (m.detail) {
    g.strokeStyle = inkLevel(4); g.lineWidth = Math.max(1, cw * 0.6); g.globalAlpha = m.alpha * 0.7;
    g.beginPath(); g.arc(headCx, headCy + headR * 0.30, headR * 0.58, Math.PI * 0.18, Math.PI * 0.82); g.stroke();
    g.globalAlpha = m.alpha;
  }

  // HOLLOW SOCKETS + gaping mouth — the deep ink of the head
  const eyeY = headCy - headR * 0.10, eDX = headR * 0.34;
  g.fillStyle = DARK;
  g.beginPath(); g.ellipse(headCx - eDX, eyeY, headR * 0.155, headR * 0.215, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(headCx + eDX, eyeY, headR * 0.155, headR * 0.215, 0, 0, 7); g.fill();
  // brow bar
  g.strokeStyle = DARK; g.lineCap = "round"; g.lineWidth = Math.max(1.3, headR * 0.11); g.globalAlpha = m.alpha * 0.75;
  g.beginPath(); g.moveTo(headCx - headR * 0.52, eyeY - headR * 0.38); g.lineTo(headCx + headR * 0.52, eyeY - headR * 0.34); g.stroke();
  g.globalAlpha = m.alpha;
  // nose
  if (m.detail) {
    g.strokeStyle = inkLevel(4); g.lineWidth = Math.max(1, headR * 0.10);
    g.beginPath(); g.moveTo(headCx + F * headR * 0.04, eyeY + headR * 0.14); g.lineTo(headCx + F * headR * 0.15, eyeY + headR * 0.42); g.stroke();
  }
  // mouth — open wider the more he is gibbering
  const gape = lerp(0.09, 0.24, m.voice);
  g.fillStyle = DARK;
  g.beginPath(); g.ellipse(headCx + F * headR * 0.03, headCy + headR * 0.56, headR * (0.13 + gape * 0.35), headR * gape, 0, 0, 7); g.fill();

  // elder beard, mid-grey
  if (m.age === "elder") {
    pen.paint(() => {
      g.moveTo(headCx - headR * 0.52, headCy + headR * 0.32);
      g.quadraticCurveTo(headCx, headCy + headR * 1.55, headCx + headR * 0.52, headCy + headR * 0.32);
      g.quadraticCurveTo(headCx, headCy + headR * 0.74, headCx - headR * 0.52, headCy + headR * 0.32);
      g.closePath();
    }, toneSolid(inkLevel(2)), cw * 0.6);
  }

  /* ---- the WOUND he still carries (the plate's deep ink) ---- */
  const woundPt = drawWound(g, m, { cx, shoCx, shoY, hipY, torsoH, shoHalf, hipHalf, headCx, headCy, headR, F, s, cw });

  /* ---- FRONT arm, over the torso ---- */
  const fw = m.armFront.wound
    ? aimAt(shFront, woundPt, s)                 // pointing at his own death-wound
    : m.armFront;
  drawArm(g, shFront, fw, F, s, inkLevel(Math.min(4, m.robeLvl + 1)), inkLevel(1), cw);

  g.restore();
  return { head:{ x:headCx, y:headCy - headR * 0.2 }, mouth:{ x:headCx + F * headR * 0.03, y:headCy + headR * 0.56 }, r:headR, wound:woundPt };
}

/* two-segment arm from explicit upper/fore directions (F mirrors them) */
function drawArm(g, sh, spec, F, s, sleeveHex, skinHex, cw) {
  const u = norm({ x:spec.u.x * F, y:spec.u.y });
  const f = norm({ x:spec.f.x * F, y:spec.f.y });
  const L1 = s * 0.150 * (spec.len || 1), L2 = s * 0.140 * (spec.len || 1);
  const el = { x: sh.x + u.x * L1, y: sh.y + u.y * L1 };
  const wr = { x: el.x + f.x * L2, y: el.y + f.y * L2 };
  const thick = s * 0.050;
  g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = INK; g.lineWidth = thick + cw * 1.9;
  g.beginPath(); g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); g.lineTo(wr.x, wr.y); g.stroke();
  g.strokeStyle = sleeveHex; g.lineWidth = thick;
  g.beginPath(); g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); g.stroke();
  g.strokeStyle = skinHex; g.lineWidth = thick * 0.80;
  g.beginPath(); g.moveTo(el.x, el.y); g.lineTo(wr.x, wr.y); g.stroke();
  // hand
  g.beginPath(); g.ellipse(wr.x, wr.y, s * 0.030, s * 0.024, 0, 0, 7);
  g.fillStyle = skinHex; g.fill();
  g.strokeStyle = INK; g.lineWidth = Math.max(1.2, cw * 0.75); g.stroke();
  return wr;
}

/* build an arm spec whose hand lands just short of a target point */
function aimAt(sh, target, s) {
  const d = { x: target.x - sh.x, y: target.y - sh.y };
  const n = norm(d);
  const dist = Math.hypot(d.x, d.y);
  const len = clamp(dist / (s * 0.275), 0.55, 1.05);
  // elbow drops below the line so the forearm swings up into the wound
  return { u:{ x:n.x * 0.35, y:0.92 }, f:{ x:n.x * 1.0, y:(n.y - 0.55) }, len, mirror:false, raw:true };
}

/* ------------------------------------------------------------------
   the death-mark. Short, hard, DARK — a spear-thrust, a cut throat, an
   arrow in the back, a split skull, a gut wound. Returns the point on
   the body the man keeps pointing at.
   ------------------------------------------------------------------ */
function drawWound(g, m, P) {
  const DARK = inkLevel(7);
  const { cx, shoCx, shoY, hipY, torsoH, shoHalf, hipHalf, headCx, headCy, headR, F, s, cw } = P;
  g.lineCap = "round";
  g.strokeStyle = DARK; g.fillStyle = DARK;

  if (m.wound === "chest") {
    const wx = shoCx + F * shoHalf * 0.20, wy = shoY + torsoH * 0.34;
    g.lineWidth = Math.max(3.0, s * 0.042);
    g.beginPath(); g.moveTo(wx - F * shoHalf * 0.36, wy - torsoH * 0.12); g.lineTo(wx + F * shoHalf * 0.40, wy + torsoH * 0.18); g.stroke();
    g.lineWidth = Math.max(1.8, s * 0.018);
    g.beginPath(); g.moveTo(wx + F * shoHalf * 0.12, wy + torsoH * 0.12); g.lineTo(wx + F * shoHalf * 0.05, wy + torsoH * 0.48); g.stroke();
    return { x:wx, y:wy };
  }
  if (m.wound === "throat") {
    const wy = shoY - headR * 0.44;
    g.lineWidth = Math.max(3.0, s * 0.036);
    g.beginPath(); g.moveTo(headCx - headR * 0.50, wy + headR * 0.08); g.lineTo(headCx + headR * 0.50, wy - headR * 0.05); g.stroke();
    g.lineWidth = Math.max(1.6, s * 0.016);
    g.beginPath(); g.moveTo(headCx + headR * 0.12, wy + headR * 0.04); g.lineTo(headCx + headR * 0.20, shoY + torsoH * 0.26); g.stroke();
    return { x:headCx, y:wy };
  }
  if (m.wound === "back") {
    // arrow stub driven through from behind the shoulder
    const ax = shoCx - F * shoHalf * 0.60, ay = shoY + torsoH * 0.24;
    const tx = ax - F * s * 0.150, ty = ay - s * 0.072;
    g.lineWidth = Math.max(2.6, s * 0.026);
    g.beginPath(); g.moveTo(ax, ay); g.lineTo(tx, ty); g.stroke();
    g.lineWidth = Math.max(1.8, s * 0.018);
    g.beginPath();
    g.moveTo(tx, ty); g.lineTo(tx + F * s * 0.038, ty - s * 0.036);
    g.moveTo(tx, ty); g.lineTo(tx + F * s * 0.044, ty + s * 0.022);
    g.stroke();
    g.beginPath(); g.ellipse(ax, ay, s * 0.030, s * 0.024, 0, 0, 7); g.fill();
    return { x:ax, y:ay };
  }
  if (m.wound === "head") {
    g.lineWidth = Math.max(2.6, headR * 0.40);
    g.beginPath(); g.moveTo(headCx - F * headR * 0.66, headCy - headR * 0.88); g.lineTo(headCx + F * headR * 0.12, headCy - headR * 0.04); g.stroke();
    g.lineWidth = Math.max(1.6, headR * 0.17);
    g.beginPath(); g.moveTo(headCx + F * headR * 0.08, headCy + headR * 0.04); g.lineTo(headCx + F * headR * 0.03, headCy + headR * 0.48); g.stroke();
    return { x:headCx + F * headR * 0.05, y:headCy - headR * 0.35 };
  }
  // gut
  const gx = cx + F * hipHalf * 0.10, gy = hipY - torsoH * 0.24;
  g.beginPath(); g.ellipse(gx, gy, hipHalf * 0.46, torsoH * 0.15, 0, 0, 7); g.fill();
  g.lineWidth = Math.max(1.8, s * 0.018);
  g.beginPath(); g.moveTo(gx - hipHalf * 0.14, gy + torsoH * 0.10); g.lineTo(gx - hipHalf * 0.24, hipY + s * 0.03); g.stroke();
  return { x:gx, y:gy };
}

/* ------------------------------------------------------------------ gestures */
const GESTURES = {
  // one hand across to his own wound, the other hanging dead
  explain:{ front:{ wound:true }, back:{ u:{ x:-0.12, y:0.98 }, f:{ x:-0.04, y:1.0 } } },
  // both hands out to the listener — the plea
  appeal: { front:{ u:{ x:0.62, y:0.44 }, f:{ x:0.92, y:-0.18 } }, back:{ u:{ x:0.46, y:0.62 }, f:{ x:0.86, y:0.10 } } },
  // hands down and clasped, waiting his turn
  listen: { front:{ u:{ x:0.06, y:0.99 }, f:{ x:-0.52, y:0.82 } }, back:{ u:{ x:-0.10, y:0.99 }, f:{ x:0.46, y:0.86 } } },
  // hands thrown up beside the head
  fear:   { front:{ u:{ x:0.52, y:-0.50 }, f:{ x:0.16, y:-0.98 } }, back:{ u:{ x:-0.48, y:-0.46 }, f:{ x:-0.14, y:-0.98 } } },
};

/* ==================================================================
   FORMATION — resolve the roster into placed members for this state.
   ================================================================== */
function buildMembers(W, H, st) {
  const p = { ...params, ...st, focus:{ ...params.focus, ...((st && st.focus) || {}) } };
  const layout = FORMATIONS[p.formation] || FORMATIONS.clusters;
  const density = clamp01(p.density);
  const att     = clamp01(p.attention);
  const fear0   = clamp01(p.fear);
  const fg      = clamp01(p.foreground);
  const bg      = clamp01(p.background);
  const wavePos = clamp01(p.wave);
  const waveW   = clamp(p.waveWidth, 0.06, 0.6);
  const focus   = { x:p.focus.x * W, y:p.focus.y * H };

  const keepN = Math.max(5, Math.round(ROSTER.length * lerp(0.42, 1, density)));
  const roster = ROSTER.filter(r => r.pri < keepN);

  // how many members survive in each cluster (so `u` re-spreads evenly)
  const perCluster = [0, 0, 0, 0, 0];
  for (const r of roster) perCluster[r.c]++;
  const seen = [0, 0, 0, 0, 0];

  const out = [];
  for (const r of roster) {
    const C = layout[r.c];
    const n = perCluster[r.c];
    const k = seen[r.c]++;
    const u = n > 1 ? k / (n - 1) : 0.5;                  // re-spread inside the knot
    const stagger = (k % 2) * 0.5;                         // back/front within the knot

    const x = (C.x + (u - 0.5) * 2 * C.w) * W;
    const y = (C.y + (u - 0.5) * 2 * (C.h || 0) + stagger * 0.052 + (r.pri % 3) * 0.006) * H;
    const bandDepth = C.band / 2;                          // 0 far .. 1 near

    // depth controls: emphasise the near band, let the far band recede
    const emph  = C.band === 2 ? lerp(0.90, 1.10, fg) : 1;
    const recede= C.band === 0 ? lerp(0.90, 1.04, bg) : 1;
    const alpha = C.band === 0 ? lerp(0.70, 1.00, bg) : (C.band === 1 ? 0.96 : 1);
    const s = C.s * emph * recede * (1 - stagger * 0.06);

    // reaction wave: a moving front in x — each man catches it in turn
    const wf = clamp01(1 - Math.abs(x / W - wavePos) / waveW);
    const w  = smooth(wf);
    const dread = clamp01(fear0 + w * 0.72);

    // orientation: below the attention threshold each knot argues inward;
    // above it every head comes round to the listener
    const inward = C.face;
    const toward = focus.x >= x ? 1 : -1;
    const face   = att >= 0.55 ? toward : inward;
    const headTurn = ((focus.x - x) / W) * 1.25 * att - w * 0.35 * face;

    // gesture: the wave overrides everything it touches
    let gname = r.gest;
    if (w > 0.52) gname = "fear";
    else if (att > 0.7 && r.gest === "listen" && (r.pri % 2 === 0)) gname = "appeal";
    const G = GESTURES[gname] || GESTURES.listen;

    out.push({
      x, y, s, face, band:C.band, bandDepth, alpha, detail: C.band > 0,
      build:r.build, age:r.age, hair:r.hair, wound:r.wound, gest:gname,
      robeLvl: C.band === 0 ? 2 : (C.band === 1 ? 1 : 2),
      contour: C.band === 2 ? lerp(0.95, 1.18, fg) : (C.band === 0 ? 1.0 : 1),
      lean: -face * s * 0.055 * dread,
      headTurn,
      voice: clamp01((gname === "explain" || gname === "appeal" ? 0.55 : 0.15) + w * 0.55),
      armFront: G.front, armBack: G.back,
      w, dread,
    });
  }

  out.sort((a, b) => a.y - b.y);      // back -> front
  return { members:out, focus, wavePos, waveW, p };
}

/* ==================================================================
   THE PLATE
   ================================================================== */
function drawEnsemble(ctx, W, H, st) {
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const p = B.p;

  /* ---- the way down: a short far-horizon shelf and the dark GATE-NOTCH they
         were driven through, small and high, with the road dotted down from it ---- */
  if (p.showGate) {
    const gx = W * 0.505, hy = H * 0.318;
    // the far shelf — deliberately short, well inside the frame
    g.save();
    g.strokeStyle = INK; g.globalAlpha = 0.30; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(W * 0.352, hy); g.lineTo(W * 0.462, hy);
    g.moveTo(W * 0.548, hy); g.lineTo(W * 0.688, hy); g.stroke();
    g.restore();
    // the black cleft they were driven out of, with two pale rocks at its mouth
    const gw = W * 0.019, gy0 = hy - H * 0.062;
    pen.paint(() => {
      g.moveTo(gx - gw, hy);
      g.lineTo(gx - gw * 0.60, gy0 + H * 0.012);
      g.quadraticCurveTo(gx, gy0 - H * 0.008, gx + gw * 0.60, gy0 + H * 0.012);
      g.lineTo(gx + gw, hy);
      g.closePath();
    }, toneSolid(inkLevel(7)), 2.5);
    pen.paint(() => {
      g.moveTo(gx - gw * 2.5, hy); g.lineTo(gx - gw * 2.1, hy - H * 0.020);
      g.lineTo(gx - gw * 1.35, hy - H * 0.026); g.lineTo(gx - gw * 1.05, hy); g.closePath();
    }, toneSolid(inkLevel(2)), 2.2);
    pen.paint(() => {
      g.moveTo(gx + gw * 1.05, hy); g.lineTo(gx + gw * 1.40, hy - H * 0.023);
      g.lineTo(gx + gw * 2.2, hy - H * 0.014); g.lineTo(gx + gw * 2.5, hy); g.closePath();
    }, toneSolid(inkLevel(2)), 2.2);
    // the road down out of the gate — a light dotted descent, broken
    g.save();
    g.strokeStyle = inkLevel(4); g.globalAlpha = 0.42; g.lineWidth = 2; g.setLineDash([5, 10]);
    g.beginPath();
    g.moveTo(gx, hy); g.quadraticCurveTo(W * 0.455, H * 0.372, W * 0.398, H * 0.428);
    g.moveTo(W * 0.362, H * 0.470); g.quadraticCurveTo(W * 0.300, H * 0.530, W * 0.286, H * 0.594);
    g.stroke();
    g.setLineDash([]); g.restore();
  }

  /* ---- the bat-stream: Homer's simile, the shades trailing out of the cleft
         squeaking like bats. A deterministic scatter of small chevrons that
         thins as it descends toward the meadow. ---- */
  if (p.showBats) {
    const rng = rnd(20240524);
    g.save();
    g.strokeStyle = inkLevel(6); g.lineCap = "round"; g.lineJoin = "round";
    for (let i = 0; i < 26; i++) {
      const t = i / 25;
      // a loose plume rising left-and-up out of the cleft
      const bx = (0.455 - t * 0.300 + (rng() - 0.5) * 0.155) * W;
      const by = (0.198 - t * 0.108 + (rng() - 0.5) * 0.075) * H;
      const r  = W * (0.018 + rng() * 0.013) * (1 - t * 0.30);
      const tilt = (rng() - 0.5) * 0.9;
      g.globalAlpha = lerp(0.95, 0.40, t);
      g.lineWidth = Math.max(3.4, r * 0.40);
      g.beginPath();
      g.moveTo(bx - r, by - r * 0.35 + tilt * r * 0.3);
      g.quadraticCurveTo(bx - r * 0.42, by + r * 0.42, bx, by - r * 0.22);
      g.quadraticCurveTo(bx + r * 0.42, by + r * 0.42, bx + r, by - r * 0.35 - tilt * r * 0.3);
      g.stroke();
    }
    g.restore();
  }

  /* ---- the asphodel meadow: BROKEN ground rules + stubble, never a bar ---- */
  if (p.showMeadow) {
    BANDS.forEach((band, bi) => {
      const y = band.y * H;
      g.save();
      g.strokeStyle = INK; g.globalAlpha = lerp(0.16, 0.38, bi / 2); g.lineWidth = bi === 2 ? 2.4 : 1.5;
      for (const [a, b] of band.segs) { g.beginPath(); g.moveTo(a * W, y); g.lineTo(b * W, y); g.stroke(); }
      g.restore();
      // asphodel stubble standing on the rule — sparse at the back, taller in front
      const rng = rnd((bi * 977 + 41) >>> 0);
      g.save();
      g.strokeStyle = inkLevel(bi === 0 ? 2 : 3); g.lineCap = "round"; g.lineWidth = bi === 2 ? 2.0 : 1.3;
      g.globalAlpha = bi === 0 ? 0.5 : 0.8;
      for (const [a, b] of band.segs) {
        const n = Math.round((b - a) * (bi === 0 ? 12 : 20));
        for (let i = 0; i < n; i++) {
          const t = (i + 0.5) / n;
          const x = lerp(a, b, t) * W + (rng() - 0.5) * W * 0.012;
          const hgt = H * (0.006 + rng() * 0.013) * (1 + bi * 0.7);
          g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rng() - 0.5) * hgt * 0.6, y - hgt); g.stroke();
        }
      }
      g.restore();
    });
  }

  /* ---- the reaction WAVE, drawn as a faint diagrammatic front ---- */
  const wx = B.wavePos * W;
  g.save();
  g.strokeStyle = inkLevel(4); g.globalAlpha = 0.30; g.lineWidth = 2; g.setLineDash([4, 10]);
  g.beginPath(); g.moveTo(wx, H * 0.30); g.lineTo(wx, H * 0.46); g.moveTo(wx, H * 0.52); g.lineTo(wx, H * 0.93); g.stroke();
  g.setLineDash([]);
  g.globalAlpha = 0.35; g.lineWidth = 2.4;
  for (let k = 1; k <= 3; k++) {
    const off = B.waveW * W * (k / 3.4);
    g.beginPath();
    g.moveTo(wx + off - W * 0.012, H * (0.355 + k * 0.018));
    g.lineTo(wx + off, H * (0.375 + k * 0.018));
    g.lineTo(wx + off - W * 0.012, H * (0.395 + k * 0.018));
    g.stroke();
  }
  g.restore();

  /* ---- the mist-pools the wisps stand in, UNDER the crowd (never over it) ---- */
  g.save();
  for (const m of B.members) {
    if (m.band === 0) continue;
    g.globalAlpha = m.band === 2 ? 0.42 : 0.28;
    g.fillStyle = inkLevel(4);
    g.beginPath(); g.ellipse(m.x, m.y + m.s * 0.008, m.s * 0.26, m.s * 0.022, 0, 0, 7); g.fill();
  }
  g.restore();

  /* ---- the crowd, back -> front ---- */
  const marks = B.members.map(m => ({ m, r: drawMember(pen, g, m) }));

  /* ---- TESTIMONY: dotted speech-arcs from the explainers toward the listener ---- */
  if (p.showTestimony) {
    g.save();
    g.strokeStyle = inkLevel(5); g.lineWidth = 3.2; g.setLineDash([4, 9]);
    for (const { m, r } of marks) {
      if (m.gest !== "explain" && m.gest !== "appeal") continue;
      g.globalAlpha = 0.55 * m.alpha;
      const mx = r.mouth.x, my = r.mouth.y;
      const dx = B.focus.x - mx, dy = B.focus.y - my;
      g.beginPath();
      g.moveTo(mx + Math.sign(dx || 1) * r.r * 0.7, my);
      g.quadraticCurveTo(mx + dx * 0.45, my + dy * 0.28 - m.s * 0.16, mx + dx * 0.62, my + dy * 0.55);
      g.stroke();
    }
    g.setLineDash([]);
    g.restore();
  }
}

export const asset = {
  id:"ensemble.suitors-shades",
  type:"ENSEMBLE",
  name:"Suitors' shades",
  statusWord:"EXPLAINING",
  scene:"OD-B24-S01",

  params,
  // one separable member template instanced across a deterministic roster
  member:{ template:"drawMember", roster:ROSTER, wounds:["chest","throat","back","head","gut"],
           gestures:Object.keys(GESTURES) },
  formations:Object.keys(FORMATIONS),
  // back -> front draw order the plate honors
  layers:["gate","meadow-far","meadow-mid","wavefront","band-far","band-mid","band-near","shadow-pools","testimony"],
  // normalized 0..1 placement / focus anchors — no character is baked in
  anchors:{
    "cluster:back-left":{x:.205,y:.505}, "cluster:back-right":{x:.760,y:.492},
    "cluster:mid":{x:.485,y:.648},
    "cluster:near-left":{x:.255,y:.845}, "cluster:near-right":{x:.800,y:.818},
    "gate:descent":{x:.50,y:.505}, "spot:listener":{x:.50,y:.965},
    "wave:front":{x:.42,y:.62}, "guide:drover":{x:.50,y:.40},
    "camera:wide":{x:.50,y:.62}, "camera:testimony":{x:.42,y:.80},
  },
  zones:{
    crowd:{ x0:.06, y0:.44, x1:.96, y1:.90 },
    approach:{ x0:.40, y0:.30, x1:.60, y1:.52 },   // the road down out of the gate
    listener:{ x0:.34, y0:.90, x1:.66, y1:1.00 },  // kept clear for the dead hero who hears them
  },
  channels:["formation","density","attention","wave","waveWidth","fear","foreground","background","focus"],

  states:{
    initial:"driven",
    nodes:{
      // Hermes has them in a file coming down the road, none of them turned yet
      driven:    { preview:{ formation:"column", attention:0.10, wave:0.30, waveWidth:0.30, fear:0.55,
                             density:1.0, status:"DRIVEN" } },
      // the file breaks and they fall back into the knots they kept in the hall
      clustering:{ preview:{ formation:"clusters", attention:0.30, wave:0.62, waveWidth:0.26, fear:0.34,
                             status:"CLUSTERING" } },
      // every head comes round and each man starts on how he died
      explaining:{ preview:{ formation:"clusters", attention:0.90, wave:0.44, waveWidth:0.24, fear:0.24,
                             status:"EXPLAINING" } },
      // the wave of recognition/terror crosses the crowd
      recoiling: { preview:{ formation:"clusters", attention:0.62, wave:0.58, waveWidth:0.42, fear:0.62,
                             status:"RECOILING" } },
      // opened out into a chorus facing the dead hero who is listening
      assembled: { preview:{ formation:"arc", attention:1.0, wave:0.08, waveWidth:0.16, fear:0.18,
                             status:"ASSEMBLED" } },
      // pressed into one frightened mass, thinned to the leaders
      huddled:   { preview:{ formation:"huddle", attention:0.35, wave:0.50, waveWidth:0.50, fear:0.85,
                             density:0.4, status:"HUDDLED" } },
    },
    edges:[
      ["driven","clustering"],["clustering","explaining"],["explaining","recoiling"],
      ["recoiling","clustering"],["clustering","assembled"],["assembled","explaining"],
      ["recoiling","huddled"],["huddled","clustering"],
    ],
  },

  // neutral preview = the signature beat: the knots re-formed, heads turned to the
  // listener, one wave of dread mid-crowd, every man pointing at what killed him
  preview:()=>({ formation:"clusters", density:1.0, attention:0.88, wave:0.42, waveWidth:0.24,
                 fear:0.30, foreground:0.72, background:0.58,
                 status:"EXPLAINING", progress:0.34 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
