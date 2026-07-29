/* divine_fx.recognition-embrace — the embrace that LANDS.
   DIVINE_FX asset. OD-B16-S03, the last beat: "they embrace and weep, longer
   and louder than birds robbed of their young."

   THE CONTRAST IS THE POINT. divine_fx.intangible-embrace-effect (OD-B11-S04,
   Anticleia) is an embrace that FAILS: the shade's contour breaks into dashes,
   she disperses into wisps, and the arms close on nothing. This module is its
   exact opposite and must never borrow its vocabulary — no ghosting, no dashed
   contour, no dispersal. Here the arms CLOSE ON SOMETHING: the two bodies get
   ONE unbroken enclosing contour, a hard seam where they meet, and hands that
   stop on a back instead of passing through it. Everything that was broken in
   the underworld is solid here.

   IN-SCENE, LIKE athenas-restoration. It draws NO figures — character
   .odysseus-b16 and character.telemachus stand underneath on the same clock.
   All ink is laid on an untouched white field so the per-type `multiply` blend
   drops the paper and lands only the marks on the set. The two body boxes come
   in through state.a / state.b, so a scene hands it wherever blockingAt() has
   actually put the pair.

   ABSENCE CONTRACT. This asset is cast for the whole scene but exists only
   inside its window: at t<=0 and t>=1 draw() returns before a single canvas
   operation, and every layer is multiplied by a gate that is 0 at both ends.

   SOURCE (the two bodies) -> FIELD (the shared corridor) -> TRANSFORM
   (resistance -> acceptance -> contact -> collapse) -> CONSEQUENCE (the weld
   holds; they weep; the birds go over). One ACCENT mark, spent on the single
   frame of contact.
   Solid tone + hard contour only; the engine POST pass supplies the halftone.

   Verify: node harness/render.mjs assets/divine_fx/recognition-embrace.mjs --pipeline MESH
           (and --state resistance / contact / weeping) */
import { makePen, inkLevel, INK, ACCENT, clamp, lerp, smooth, rnd }
  from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const TAU = Math.PI * 2;

const params = {
  /* the two bodies, normalized to the stage: x = centre, y = feet line,
     w/h = box. Scenes override both from blockingAt(). */
  a:{ x:0.408, y:0.905, w:0.190, h:0.545 },   // the son
  b:{ x:0.600, y:0.905, w:0.205, h:0.600 },   // the father
  pad:0.075,        // corridor padding around the pair, fraction of pair width
  contactAt:0.42,   // u at which the two bodies actually meet
  wrapAt:0.62,      // u by which both arms have closed
  collapseAt:0.76,  // u by which the weight has gone down
  tears:7,          // falling marks per head at full grief
  birds:7,          // the simile: birds robbed of their young, going over
};

/* ---- the clock. One u drives resistance -> acceptance -> contact ->
   collapse -> prolonged grief, and the gate that makes the whole thing
   absent at both ends of the window. ---- */
function phases(u){
  const C = params.contactAt;
  return {
    resist:   clamp01((C - u) / C),                          // 1 at u=0, 0 at contact
    close:    smooth(clamp01(u / C)),                         // the gap shutting
    hold:     smooth(clamp01((u - C) / 0.09)),                // the seam taking
    wrap:     smooth(clamp01((u - C) / (params.wrapAt - C))), // arms closing
    collapse: smooth(clamp01((u - params.wrapAt) / (params.collapseAt - params.wrapAt))),
    grief:    clamp01((u - C - 0.06) / 0.42),                 // weeping, and going on
    gate:     Math.min(smooth(clamp01(u / 0.05)), smooth(clamp01((1 - u) / 0.07))),
  };
}

/* geometry: pixel boxes for the two bodies + the corridor that holds them */
function frame(W, H, A, B){
  const box = F => ({
    x0:(F.x - F.w/2)*W, x1:(F.x + F.w/2)*W,
    y0:(F.y - F.h)*H,   y1:F.y*H,
    cx:F.x*W, h:F.h*H, w:F.w*W,
  });
  let L = box(A), R = box(B);
  if (L.cx > R.cx){ const s = L; L = R; R = s; }
  const pad = (R.x1 - L.x0) * params.pad;
  return {
    L, R, pad,
    x0:L.x0 - pad, x1:R.x1 + pad,
    yTop:Math.min(L.y0, R.y0) - pad*0.6,
    yBot:Math.max(L.y1, R.y1),
    seam:(L.x1 + R.x0)/2,
    gap:Math.max(R.x0 - L.x1, 0),
    chest:(L.y0 + 0.30*L.h + R.y0 + 0.30*R.h)/2,
    shoulder:(L.y0 + 0.19*L.h + R.y0 + 0.19*R.h)/2,
    hip:(L.y0 + 0.60*L.h + R.y0 + 0.60*R.h)/2,
  };
}

/* ---- FIELD: the corridor the contact happens inside. Two pale shafts while
   they are still two people; one shaft once they are not. Kept pale so under
   multiply it barely tints the set — the seam and the arms carry the ink. ---- */
function drawCorridor(pen, g, F, e, ph){
  const merge = ph.close;
  g.save();
  g.globalAlpha = 0.38 * e;
  g.fillStyle = inkLevel(2);
  if (merge < 0.98){
    const inset = (1 - merge) * (F.x1 - F.x0) * 0.055;
    g.fillRect(F.x0, F.yTop, (F.seam - inset) - F.x0, F.yBot - F.yTop);
    g.fillRect(F.seam + inset, F.yTop, F.x1 - (F.seam + inset), F.yBot - F.yTop);
  } else {
    g.fillRect(F.x0, F.yTop, F.x1 - F.x0, F.yBot - F.yTop);
  }
  g.restore();
  g.save();
  g.globalAlpha = 0.40 * e;
  g.strokeStyle = INK; g.lineWidth = 2;
  g.beginPath();
  g.moveTo(F.x0, F.yTop); g.lineTo(F.x0, F.yBot);
  g.moveTo(F.x1, F.yTop); g.lineTo(F.x1, F.yBot);
  g.stroke();
  g.restore();
}

/* ---- RESISTANCE: while he still refuses it, the distance between them is
   MEASURED — a dimension line across the gap with the arrowheads facing
   OUTWARD, and hatch bars standing in the space. Both shut down as the gap
   closes, so resistance is something that visibly stops. ---- */
function drawResistance(pen, g, F, e, r){
  if (r <= 0.02) return;
  const rise = F.hip - F.shoulder;
  const rk = smooth(clamp01(r / 0.34));      // full while he refuses, gone at contact
  const half = Math.max(F.gap*0.5, (F.x1 - F.x0)*0.160) * (0.62 + 0.38*r);
  const hh = rise * 0.56 * (0.55 + 0.45*r);
  const y = F.chest;
  g.save();
  g.globalAlpha = 0.94 * e * rk;
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "butt";
  // the dimension line
  g.beginPath(); g.moveTo(F.seam - half, y); g.lineTo(F.seam + half, y); g.stroke();
  // arrowheads pushing apart
  for (const s of [-1, 1]){
    const tx = F.seam + s*half;
    g.beginPath();
    g.moveTo(tx, y);
    g.lineTo(tx - s*half*0.30, y - half*0.26);
    g.lineTo(tx - s*half*0.30, y + half*0.26);
    g.closePath(); g.fillStyle = inkLevel(7); g.fill();
  }
  // hatch standing in the space between them
  g.lineWidth = 3; g.globalAlpha = 0.62 * e * rk;
  const n = 6;
  for (let i = 0; i <= n; i++){
    const x = F.seam - half + (2*half)*(i/n);
    const k = 1 - Math.abs(i/n - 0.5)*0.9;
    g.beginPath(); g.moveTo(x, y - hh*k); g.lineTo(x, y + hh*k); g.stroke();
  }
  g.restore();
}

/* ---- THE WELD: what makes this the opposite of the underworld embrace.
   ONE unbroken contour around both bodies (never dashed, never gapped) and a
   solid seam bar where they meet. Both take hold at contact and stay. ---- */
function drawWeld(pen, g, F, e, ph){
  const h = ph.hold;
  if (h <= 0.02) return;
  const rise = F.hip - F.shoulder;
  const sag = ph.collapse * rise * 0.18;

  /* The union outline of two lobes, not a rectangle. A box around a pair says
     "container"; two lobes sharing one unbroken edge says "these two are now
     one shape", which is the whole content of the beat. The notch between the
     lobes is DEEP at first contact and shallows as the hold takes — so the
     fusing is something you can watch happen. */
  const wl = F.L.w*0.60, wr = F.R.w*0.60;
  const xL = F.L.cx - wl, xR = F.R.cx + wr;
  const yTL = F.shoulder - rise*0.30, yTR = F.shoulder - rise*0.44;
  const yB  = F.hip + rise*0.42 + sag;
  const r   = Math.min(wl, wr) * 0.55;
  const nW  = Math.max((F.R.x0 - F.L.x1)*0.5, (xR - xL)*0.105);
  const nD  = rise * (0.44 - 0.24*h);

  g.save();
  g.globalAlpha = 0.94 * e * h;
  g.strokeStyle = INK; g.lineWidth = 5; g.lineJoin = "round"; g.setLineDash([]);
  g.beginPath();
  g.moveTo(xL, yB - r*0.7);
  g.lineTo(xL, yTL + r);                       // left flank
  g.quadraticCurveTo(xL, yTL, xL + r, yTL);    // left shoulder round
  g.lineTo(F.seam - nW, yTL);
  g.quadraticCurveTo(F.seam, yTL + nD, F.seam + nW, yTR);   // the notch between them
  g.lineTo(xR - r, yTR);
  g.quadraticCurveTo(xR, yTR, xR, yTR + r);    // right shoulder round
  g.lineTo(xR, yB - r*0.7);
  g.quadraticCurveTo(xR, yB, xR - r*0.7, yB);
  g.quadraticCurveTo(F.seam, yB + sag*1.5, xL + r*0.7, yB);  // one base, bowing
  g.quadraticCurveTo(xL, yB, xL, yB - r*0.7);
  g.closePath(); g.stroke();
  // a little tone across the held block so it survives the multiply blend as a
  // region and not only as an outline
  g.globalAlpha = 0.26 * e * h;
  g.lineWidth = 2;
  for (let i = 1; i <= 3; i++){
    const y = lerp(F.shoulder + rise*0.10, yB - rise*0.10, (i-1)/2);
    g.beginPath(); g.moveTo(xL + r*0.35, y); g.lineTo(xR - r*0.35, y); g.stroke();
  }
  g.restore();

  // the seam: the line where two bodies became one shape. Solid, weight 7.
  g.save();
  g.globalAlpha = 0.95 * e * h;
  g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = "round";
  g.beginPath();
  g.moveTo(F.seam, F.shoulder - rise*0.30 + nD*0.55);
  g.lineTo(F.seam, F.hip + rise*0.34 + sag);
  g.stroke();
  g.restore();
}

/* ---- THE ARMS: shoulder -> elbow -> hand, two jointed limbs, not two arcs.
   Anticleia's version had arms that closed and crossed through empty air; these
   STOP on a back. Each ends in a solid hand paddle resting on the far shoulder
   blade, and that landing is the whole event. ---- */
function drawArms(pen, g, F, e, w){
  if (w <= 0.02) return;
  const span = F.x1 - F.x0;
  const rise = F.hip - F.shoulder;
  const arm = (sh, el0, hd0, front)=>{
    // the limb reaches out of its OWN shoulder — starting both hands at the
    // seam stacked them into one blob on the frame of contact
    const el = { x:lerp(sh.x, el0.x, w), y:lerp(sh.y, el0.y, w) };
    const hd = { x:lerp(sh.x, hd0.x, w), y:lerp(sh.y, hd0.y, w) };
    g.save();
    g.globalAlpha = 0.92 * e;
    g.strokeStyle = INK; g.lineCap = "round"; g.lineJoin = "round";
    g.lineWidth = span*0.036;
    g.beginPath(); g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); g.stroke();
    g.lineWidth = span*0.028;
    g.beginPath(); g.moveTo(el.x, el.y); g.lineTo(hd.x, hd.y); g.stroke();
    g.restore();
    // the hand: a solid paddle sitting ON the far back, not inside it
    const hw = span*0.036, hh = span*0.066;
    pen.paint(()=>{
      g.moveTo(hd.x - hw, hd.y - hh*0.5);
      g.lineTo(hd.x + hw, hd.y - hh*0.5 + front*hh*0.16);
      g.lineTo(hd.x + hw, hd.y + hh*0.5);
      g.lineTo(hd.x - hw, hd.y + hh*0.5 - front*hh*0.16);
      g.closePath();
    }, { base: inkLevel(6), pat:null }, 3.5);
  };
  // the son's arm goes OVER the father's shoulder and down his back
  arm({ x:F.L.cx + F.L.w*0.26, y:F.shoulder + rise*0.05 },
      { x:F.seam + (F.R.x1 - F.seam)*0.62, y:F.shoulder - rise*0.30 },
      { x:F.R.x1 - F.R.w*0.16,             y:F.shoulder + rise*0.34 }, +1);
  // the father's arm comes round UNDER, across the son's back
  arm({ x:F.R.cx - F.R.w*0.26, y:F.chest + rise*0.10 },
      { x:F.seam - (F.seam - F.L.x0)*0.58, y:F.chest + rise*0.52 },
      { x:F.L.x0 + F.L.w*0.16,             y:F.chest + rise*0.30 }, -1);
}

/* ---- COLLAPSE: the weight going down. Two short load marks outside the pair
   at hip height — the knees giving, held. ---- */
function drawCollapse(pen, g, F, e, c){
  if (c <= 0.03) return;
  const span = F.x1 - F.x0, d = span*0.055*c;
  g.save();
  g.globalAlpha = 0.66 * e * c;
  g.strokeStyle = INK; g.lineWidth = 3.5; g.lineCap = "round"; g.lineJoin = "round";
  for (const s of [-1, 1]){
    const x = s < 0 ? F.x0 - span*0.030 : F.x1 + span*0.030;
    for (let i = 0; i < 2; i++){
      const y = F.hip + i*d*0.9;
      g.beginPath();
      g.moveTo(x - span*0.026, y); g.lineTo(x, y + d*0.55); g.lineTo(x + span*0.026, y);
      g.stroke();
    }
  }
  g.restore();
}

/* ---- CONSEQUENCE: they weep, and go on weeping. Falling marks off both
   heads, and above them the simile made visible — birds going over, robbed of
   their young. Both keep arriving while the hold lasts, which is how a still
   frame says "longer than". ---- */
function drawGrief(pen, g, F, e, gr, u){
  if (gr <= 0.02) return;
  const span = F.x1 - F.x0;
  // --- tears ---
  g.save();
  g.strokeStyle = INK; g.lineCap = "round";
  for (const B of [F.L, F.R]){
    const hx = B.cx, hy = B.y0 + B.h*0.055;
    for (let i = 0; i < params.tears; i++){
      const s = rnd(i*53 + (B===F.L ? 7 : 31))();
      const s2 = rnd(i*97 + (B===F.L ? 13 : 41))();
      const born = s*0.62;
      if (gr < born) continue;
      const age = clamp01((gr - born)/0.38);
      const px = hx + (s2 - 0.5)*B.w*0.62;
      const py = hy + B.h*(0.04 + 0.24*smooth(age));
      g.globalAlpha = 0.88 * e * (1 - age*0.45);
      g.lineWidth = 3.6 + 2.2*(1 - age);
      g.beginPath(); g.moveTo(px, py); g.lineTo(px + B.w*0.05*(s2-0.5), py + B.h*0.060);
      g.stroke();
    }
  }
  g.restore();
  // --- the birds ---
  const n = Math.max(1, Math.round(params.birds * gr));
  g.save();
  g.strokeStyle = INK; g.lineCap = "round"; g.lineJoin = "round";
  for (let i = 0; i < n; i++){
    const s = rnd(i*29 + 5)(), s2 = rnd(i*71 + 17)();
    const drift = smooth(clamp01((gr - i/params.birds)*2.2));
    const bx = F.x0 + span*(0.06 + 0.88*s) + (s2 - 0.5)*span*0.10*drift;
    const by = F.yTop - span*(0.10 + 0.22*s2) - span*0.20*drift;
    const wspan = span*(0.030 + 0.018*s2);
    const flap = 0.35 + 0.45*Math.abs(Math.sin(u*7 + i*1.7));
    g.globalAlpha = 0.82 * e * (0.35 + 0.65*drift);
    g.lineWidth = 3.2;
    g.beginPath();
    g.moveTo(bx - wspan, by + wspan*flap);
    g.lineTo(bx, by);
    g.lineTo(bx + wspan, by + wspan*flap);
    g.stroke();
  }
  g.restore();
}

/* ---- THE ONE ACCENT: spent on the single frame the two bodies actually
   touch. One blue mark, once — the same discipline as the restoration snap. ---- */
function drawMark(pen, g, F, e, u){
  const d = Math.abs(u - params.contactAt);
  if (d > 0.045) return;
  const k = (1 - d/0.045) * e;
  g.save();
  g.globalAlpha = 0.90 * k;
  g.strokeStyle = ACCENT; g.lineWidth = 5; g.lineCap = "round";
  g.beginPath();
  g.moveTo(F.seam, F.shoulder - (F.hip - F.shoulder)*0.30);
  g.lineTo(F.seam, F.hip + (F.hip - F.shoulder)*0.30);
  g.stroke();
  g.restore();
}

function drawFX(ctx, W, H, state){
  const u = clamp01(state.t ?? 0);
  if (u <= 0.001 || u >= 0.999) return;        // ABSENCE CONTRACT: nothing at all
  const ph = phases(u);
  if (ph.gate <= 0.001) return;
  const g = ctx;
  const pen = makePen(g, { outline:true });
  const F = frame(W, H, { ...params.a, ...(state.a || {}) },
                        { ...params.b, ...(state.b || {}) });
  const e = ph.gate * clamp01(state.intensity ?? 1);

  const layers = state.layers ||
    ["corridor","resistance","weld","arms","collapse","grief","mark"];
  if (layers.includes("corridor"))   drawCorridor(pen, g, F, e, ph);
  if (layers.includes("resistance")) drawResistance(pen, g, F, e, ph.resist);
  if (layers.includes("weld"))       drawWeld(pen, g, F, e, ph);
  if (layers.includes("arms"))       drawArms(pen, g, F, e, ph.wrap);
  if (layers.includes("collapse"))   drawCollapse(pen, g, F, e, ph.collapse);
  if (layers.includes("grief"))      drawGrief(pen, g, F, e, ph.grief, u);
  if (layers.includes("mark"))       drawMark(pen, g, F, e, u);
}

export const asset = {
  id:"divine-fx.recognition-embrace",
  type:"DIVINE_FX",
  name:"Recognition embrace",
  statusWord:"HELD",
  scene:"OD-B16-S03",
  blend:"multiply",                       // README §5 per-type default, made explicit
  pairsWith:["character.odysseus-b16","character.telemachus"],
  opposes:"divine_fx.intangible-embrace-effect",   // the embrace that fails

  params,
  layers:["corridor","resistance","weld","arms","collapse","grief","mark"],
  // normalized 0..1 source / target / field / transform / consequence anchors
  anchors:{
    "source:father":{ x:0.600, y:0.620 },
    "target:son":{    x:0.408, y:0.640 },
    "field:corridor":{x:0.504, y:0.640 },
    "contact:seam":{  x:0.504, y:0.560 },   // where the two bodies meet
    "hand:over":{     x:0.680, y:0.545 },   // the son's hand, landed on a back
    "hand:under":{    x:0.330, y:0.640 },   // the father's hand, landed on a back
    "grief:heads":{   x:0.504, y:0.395 },
    "simile:birds":{  x:0.504, y:0.230 },
    "camera:pair":{   x:0.504, y:0.560 },
  },
  // the regions the effect touches
  zones:{
    corridor:{ x0:0.290, y0:0.290, x1:0.720, y1:0.910 },
    contact:{  x0:0.470, y0:0.400, x1:0.540, y1:0.720 },
    birds:{    x0:0.280, y0:0.130, x1:0.730, y1:0.300 },
  },
  duration:6.0,
  channels:["t","a","b","intensity","layers"],

  /* the transformation states named by the atlas: resistance, acceptance,
     collapse, prolonged grief — plus `absent`, which draws nothing at all. */
  states:{
    initial:"contact",
    nodes:{
      absent:{     preview:{ t:0.0,  status:"—",          progress:0.00 } },
      resistance:{ preview:{ t:0.18, status:"REFUSING",   progress:0.18 } },
      acceptance:{ preview:{ t:0.36, status:"ACCEPTING",  progress:0.36 } },
      // just past the touch: the accent is still burning and the weld is taking
      contact:{    preview:{ t:0.455, status:"CONTACT",   progress:0.46 } },
      collapse:{   preview:{ t:0.70, status:"COLLAPSING", progress:0.70 } },
      weeping:{    preview:{ t:0.88, status:"WEEPING",    progress:0.88 } },
    },
    edges:[["absent","resistance"],["resistance","acceptance"],["acceptance","contact"],
           ["contact","collapse"],["collapse","weeping"],["weeping","absent"]],
  },

  // neutral preview: the hold has taken, the arms are closed, they are weeping
  preview:()=>({ t:0.78, status:"HELD", progress:0.78 }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
