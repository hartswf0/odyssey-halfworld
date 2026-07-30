/* divine-fx.dream-eagle-with-odysseus-voice — the omen in Penelope's dream:
   a great hook-beaked eagle stoops on twenty geese, perches on the projecting
   roof-beam, and then its RAPTOR CRY turns into a man's intelligible speech —
   her husband's voice — declaring that the geese are the suitors.
   DIVINE_FX. Book XIX (OD-B19-S06).

   The module is that TRANSFORMATION drawn as a measuring instrument, not as an
   illustration of the birds: the geese themselves are `creature.twenty-dream-
   geese` and are never drawn here. What is drawn is the sound and what it does.

   Procedural DIVINE_FX:
     SOURCE      the open gape of the eagle on the broken roof-beam (upper left)
     FIELD       the VOICE CORRIDOR — a lens-shaped band sweeping down-right from
                 the gape; sound travels along its axis
     TARGET      the dreamer's ear at the far end of the corridor (lower right)
     TRANSFORM   voice v(t): the ARTICULATION GATE slides back up the corridor
                 toward the beak. Right of the gate the sound is quantized into
                 speech blocks (words, with gaps); left of it it is still a raw
                 jagged cry. Travelling pulses enter as scattered bursts and
                 leave the gate as solid quantized syllables.
     CONSEQUENCE the voiceprint MATCH under the ear (heard pattern locking onto
                 the remembered husband-voice), and the ledger along the foot:
                 twenty tally strokes struck through, the seven-segment count,
                 and the struck suitor-cluster the count is equated to.

   Solid grays + hard contour into the offscreen ctx; the engine POST pass
   supplies the halftone — do NOT pre-dither. Light planes with dark accents:
   the corridor and the wings are level 1-2 paper-weight, and only the beak,
   the gate, the speech blocks and the ledger carry level 5-7 ink.
*/
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU  = Math.PI * 2;
const frac = x => x - Math.floor(x);
const sm   = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
/* deterministic 0..1 hash — no Math.random anywhere in this module */
const hash = i => frac(Math.sin(i * 127.1 + 311.7) * 43758.5453);

const params = {
  period: 9.0,                                  // stoop -> kill -> cry -> voice -> declaration
  axis:  { a:{ x:0.158, y:0.312 }, b:{ x:0.786, y:0.582 } },
  band:  { w0:0.050, wm:0.078, w1:0.038 },      // half-widths, fractions of H
  ear:   { x:0.872, y:0.612, w:0.108, h:0.132 },
  perch: [ [0.278,0.180], [0.502,0.118] ],      // broken beam: [x0,width] pairs, never one span
  pulses: 5,                                    // travelling sound pulses in the corridor
  feathers: 7,                                  // struck-goose feathers falling to the tally
  gape: 1.0,                                    // master beak opening (channel-driven)
};

/* the utterance: eleven quantized syllables in three words. The heights are
   the signature the ear matches against — the same series is re-stated in the
   voiceprint block, which is how the sound is identified as HIS. */
const PATTERN  = [3,2,4,2, 3,4,3, 2,4,3,1];
const WORD_END = new Set([3, 6]);               // a wide gap follows these slots
const SLOT_U   = (() => {
  const adv = [];
  let x = 0;
  for (let i = 0; i < PATTERN.length; i++){ adv.push(x); x += 1 + (WORD_END.has(i) ? 1.5 : 0.55); }
  const span = x - (1 + 0.55);
  return adv.map(a => 0.055 + (a / span) * 0.905);
})();
const SIG = PATTERN.slice(0, 7);                // the remembered-voice template

/* ---------------- the corridor frame ----------------
   u runs 0..1 from the gape to the ear; v is perpendicular, in pixels. */
function axisFrame(W, H){
  const A = { x: params.axis.a.x*W, y: params.axis.a.y*H };
  const B = { x: params.axis.b.x*W, y: params.axis.b.y*H };
  const dx = B.x-A.x, dy = B.y-A.y, L = Math.hypot(dx, dy);
  const ux = dx/L, uy = dy/L, nx = -uy, ny = ux;
  return { A, B, L, ux, uy, nx, ny, ang: Math.atan2(dy, dx),
           P:(u,v)=>({ x: A.x + ux*L*u + nx*v, y: A.y + uy*L*u + ny*v }) };
}
function halfW(u, H){
  const { w0, wm, w1 } = params.band;
  const f = u < 0.45 ? lerp(w0, wm, sm(u/0.45)) : lerp(wm, w1, sm((u-0.45)/0.55));
  return f * H;
}

/* ---------------- the clock ----------------
   one number for the kill, one for the voice; everything else reads them. */
function phaseAt(t){
  const p = frac(t / params.period);
  let kill, voice;
  if (p < 0.15){ kill = 0;                     voice = 0; }
  else if (p < 0.30){ kill = sm((p-0.15)/0.15); voice = 0; }
  else if (p < 0.55){ kill = 1;                 voice = 0; }
  else if (p < 0.85){ kill = 1;                 voice = sm((p-0.55)/0.30); }
  else { kill = 1; voice = 1; }
  return { kill, voice, p };
}

/* ---------------- polygon helper (fractions of W,H) ---------------- */
function poly(g, pts, W, H, dy=0){
  g.moveTo(pts[0][0]*W, pts[0][1]*H + dy);
  for (let i=1;i<pts.length;i++) g.lineTo(pts[i][0]*W, pts[i][1]*H + dy);
  g.closePath();
}

/* ============================================================
   THE EAGLE — blocky raptor in profile, head lowered to the left, wings
   half-mantled, talons on a BROKEN roof-beam. Light wing planes, one very
   dark head and one black hooked beak: the whole bird's ink lives in the
   twelve square inches around the gape, which is where the effect starts.
   ============================================================ */
/* Deep-breasted at the front (left), tapering to the rear: a bird body, not an
   oval. The head hangs BELOW the breast — the screaming, mantling posture — so
   the corridor can leave the beak without ever crossing the bird. */
const BODY = [
  [0.312,0.196],[0.300,0.166],[0.316,0.140],[0.352,0.122],[0.406,0.118],
  [0.470,0.130],[0.528,0.156],[0.560,0.184],[0.540,0.206],[0.470,0.222],[0.398,0.226],[0.342,0.218],
];
/* one tail, fanning DOWN-back with cut corners — never a second lobe above */
const TAIL = [ [0.534,0.180],[0.640,0.196],[0.664,0.212],[0.652,0.234],[0.598,0.234],[0.544,0.224] ];
/* the far wing shows only as a sliver above the near one */
const WING_FAR  = [ [0.402,0.126],[0.470,0.118],[0.548,0.070],[0.590,0.056],[0.600,0.078],[0.520,0.108],[0.440,0.140] ];
/* ONE big wing, broad at the root, sweeping up and back to a fingered tip */
const WING_NEAR = [ [0.368,0.130],[0.452,0.128],[0.560,0.076],[0.646,0.052],[0.672,0.086],[0.596,0.116],[0.500,0.150],[0.418,0.156] ];
const NECK = [ [0.298,0.154],[0.332,0.172],[0.318,0.238],[0.284,0.222] ];
const HEAD = [ [0.240,0.184],[0.272,0.176],[0.306,0.192],[0.312,0.226],[0.288,0.254],[0.250,0.256],[0.232,0.222] ];

/* splayed primaries: separate finger-shaped quads off a wing tip. The gaps
   between them are what makes the bird read as a raptor rather than a lobe. */
function primaries(pen, g, W, H, bob, a, b, n, len, wid, a0, da, lvl){
  const lw = Math.max(3, W*0.0052);
  for (let k=0;k<n;k++){
    const f = n>1 ? k/(n-1) : 0;
    const bx = lerp(a[0], b[0], f)*W, by = lerp(a[1], b[1], f)*H + bob;
    const ang = a0 + da*k;
    const dx = Math.cos(ang), dy = Math.sin(ang);
    const px = -dy*wid*W*0.5, py = dx*wid*W*0.5;
    const L = (len + k*0.0045)*W;
    pen.paint(()=>{
      g.moveTo(bx+px, by+py);
      g.lineTo(bx + dx*L + px*0.34, by + dy*L + py*0.34);
      g.lineTo(bx + dx*L - px*0.34, by + dy*L - py*0.34);
      g.lineTo(bx-px, by-py);
      g.closePath();
    }, toneSolid(inkLevel(lvl)), lw);
  }
}

function drawEagle(pen, g, W, H, gape, t){
  const bob = Math.sin(t*1.15) * H * 0.0035;
  const lw  = Math.max(4, W*0.0072);
  const P = (pts, lvl) => pen.paint(()=>poly(g, pts, W, H, bob), toneSolid(inkLevel(lvl)), lw);

  /* --- the broken perch: two segments with a gap, never one bar --- */
  for (const [x0, wd] of params.perch){
    pen.paint(()=>{ g.rect(x0*W, 0.270*H + bob, wd*W, 0.019*H); }, toneSolid(inkLevel(4)), lw);
    // grain: two short dark ticks per segment
    g.strokeStyle = inkLevel(6); g.lineWidth = Math.max(2.5, W*0.004);
    for (let k=0;k<2;k++){
      const x = (x0 + wd*(0.28 + k*0.42))*W;
      g.beginPath(); g.moveTo(x, 0.2735*H + bob); g.lineTo(x + wd*W*0.16, 0.2735*H + bob); g.stroke();
    }
  }

  /* --- far wing sliver, tail, body, then the one big near wing over it --- */
  primaries(pen, g, W, H, bob, [0.582,0.060], [0.598,0.082], 3, 0.036, 0.013, -0.88, 0.17, 5);
  P(WING_FAR, 4);
  P(TAIL, 3);
  // rectrix separators — the tail is a fan of feathers, not a paddle
  g.strokeStyle = INK; g.lineWidth = Math.max(3, W*0.005); g.lineCap = "round";
  for (let k=0;k<3;k++){
    const f = (k+1)/4;
    const a = [lerp(0.536,0.546,f), lerp(0.182,0.226,f)];
    const b = [lerp(0.654,0.666,f), lerp(0.200,0.234,f)];
    g.beginPath(); g.moveTo(a[0]*W, a[1]*H + bob); g.lineTo(b[0]*W, b[1]*H + bob); g.stroke();
  }
  P(BODY, 2);
  // breast chevrons — broken, three only, the body's only dark marks
  g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(3.5, W*0.006); g.lineJoin = "round";
  for (let k=0;k<3;k++){
    const y = (0.160 + k*0.026)*H + bob, x = (0.322 + k*0.014)*W;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + W*0.026, y + H*0.010); g.lineTo(x + W*0.052, y); g.stroke();
  }
  primaries(pen, g, W, H, bob, [0.640,0.058], [0.668,0.090], 6, 0.048, 0.014, -0.72, 0.16, 3);
  P(WING_NEAR, 1);
  // covert seams inside the near wing (light, following the wing's rake)
  g.strokeStyle = inkLevel(4); g.lineWidth = Math.max(2.5, W*0.0042);
  for (let k=0;k<3;k++){
    const f = k/2;
    const a = [lerp(0.400,0.452,f), lerp(0.136,0.148,f)];
    const b = [lerp(0.542,0.582,f), lerp(0.086,0.112,f)];
    g.beginPath(); g.moveTo(a[0]*W, a[1]*H + bob); g.lineTo(b[0]*W, b[1]*H + bob); g.stroke();
  }
  // shoulder seam: keeps the wing from fusing with the breast
  g.strokeStyle = INK; g.lineWidth = Math.max(3.5, W*0.006);
  g.beginPath();
  g.moveTo(0.372*W, 0.130*H + bob);
  g.quadraticCurveTo(0.392*W, 0.156*H + bob, 0.420*W, 0.158*H + bob); g.stroke();

  /* --- legs + talons gripping the near beam segment --- */
  g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(5, W*0.009);
  for (const lx of [0.360, 0.424]){
    g.beginPath(); g.moveTo(lx*W, 0.228*H + bob); g.lineTo((lx+0.008)*W, 0.263*H + bob); g.stroke();
    g.lineWidth = Math.max(3, W*0.0055);
    for (let k=-1;k<=1;k++){
      g.beginPath(); g.moveTo((lx+0.008)*W, 0.263*H + bob);
      g.lineTo((lx+0.008+k*0.016)*W, 0.272*H + bob); g.stroke();
    }
    g.lineWidth = Math.max(5, W*0.009);
  }

  /* --- neck + head: light planes, so the black beak has something to bite --- */
  P(NECK, 4);
  P(HEAD, 2);
  // dark nape wedge — the sea-eagle's marked head, kept off the face
  pen.paint(()=>{
    g.moveTo(0.292*W, 0.186*H + bob); g.lineTo(0.312*W, 0.222*H + bob);
    g.lineTo(0.292*W, 0.250*H + bob); g.lineTo(0.282*W, 0.204*H + bob); g.closePath();
  }, toneSolid(inkLevel(5)), Math.max(3, W*0.005));
  // brow ridge — the overhanging shelf that makes a raptor a raptor
  g.strokeStyle = INK; g.lineWidth = Math.max(4, W*0.0072); g.lineCap = "round";
  g.beginPath(); g.moveTo(0.238*W, 0.196*H + bob); g.lineTo(0.294*W, 0.186*H + bob); g.stroke();
  // the eye: paper disc, black ring, black pupil
  pen.paint(()=>{ g.arc(0.264*W, 0.210*H + bob, W*0.0195, 0, TAU); }, toneSolid(inkLevel(0)), Math.max(4, W*0.0072));
  g.fillStyle = INK;
  g.beginPath(); g.arc(0.2605*W, 0.2115*H + bob, W*0.0092, 0, TAU); g.fill();

  /* --- the open GAPE: two black mandibles hinged apart by `gape` --- */
  const hx = 0.243*W, hy = 0.222*H + bob;
  const rot = (px, py, a) => ({ x: hx + px*Math.cos(a) - py*Math.sin(a),
                                y: hy + px*Math.sin(a) + py*Math.cos(a) });
  const s = W/660;
  //             hinge     top edge         tip    hook     underside back to hinge
  const UPPER = [[9,-9],[-10,-17],[-28,-18],[-46,-7],[-40,5],[-33,-3],[-18,-7],[-3,-5],[9,-2]];
  const LOWER = [[9,4],[-6,7],[-24,12],[-38,19],[-31,21],[-7,13],[9,9]];
  // the mandibles point -x, so a POSITIVE angle lifts the upper one clear
  const aU = 0.34*gape, aL = -0.30*gape;
  const mand = (pts, a) => pen.paint(()=>{
    const q0 = rot(pts[0][0]*s, pts[0][1]*s, a); g.moveTo(q0.x, q0.y);
    for (let i=1;i<pts.length;i++){ const q = rot(pts[i][0]*s, pts[i][1]*s, a); g.lineTo(q.x, q.y); }
    g.closePath();
  }, toneSolid(inkLevel(7)), Math.max(3, W*0.005));
  // the throat first: a paper wedge between the mandibles — the sound's mouth
  const tU = rot(-36*s, -11*s, aU), tL = rot(-30*s, 14*s, aL);
  pen.paint(()=>{
    g.moveTo(hx + 10*s, hy + 1*s); g.lineTo(tU.x, tU.y); g.lineTo(tL.x, tL.y); g.closePath();
  }, toneSolid(inkLevel(0)), Math.max(4, W*0.0062));
  mand(UPPER, aU); mand(LOWER, aL);
  g.fillStyle = INK;
  g.beginPath(); g.arc(hx + 1*s, hy + 2*s, Math.max(3, W*0.0058), 0, TAU); g.fill();
}

/* ============================================================
   THE VOICE CORRIDOR — cry on the beak side of the gate, speech on the ear
   side. The gate slides back toward the beak as `voice` rises.
   ============================================================ */
function drawCorridor(pen, g, W, H, F, voice, t){
  const gate = lerp(0.965, 0.075, sm(voice));
  const NE = 40;

  /* --- the field itself: a very light lens of paper-weight tone --- */
  g.beginPath();
  for (let i=0;i<=NE;i++){ const u=i/NE, q=F.P(u, -halfW(u,H)); i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y); }
  for (let i=NE;i>=0;i--){ const u=i/NE, q=F.P(u,  halfW(u,H)); g.lineTo(q.x,q.y); }
  g.closePath(); g.fillStyle = inkLevel(1); g.fill();

  /* --- edges: dashed and slack where the sound is still a cry, hard and
         solid where it has become speech --- */
  const edge = (sgn, u0, u1, solid) => {
    g.beginPath();
    const n = 26;
    for (let i=0;i<=n;i++){
      const u = lerp(u0, u1, i/n), q = F.P(u, sgn*halfW(u,H));
      i ? g.lineTo(q.x,q.y) : g.moveTo(q.x,q.y);
    }
    if (solid){ g.setLineDash([]); g.strokeStyle = INK; g.lineWidth = Math.max(4, W*0.0062); }
    else      { g.setLineDash([H*0.016, H*0.013]); g.strokeStyle = inkLevel(4); g.lineWidth = Math.max(2.5, W*0.0042); }
    g.lineCap = "butt"; g.stroke(); g.setLineDash([]);
  };
  if (gate > 0.03){ edge(-1, 0.015, gate, false); edge(1, 0.015, gate, false); }
  if (gate < 0.97){ edge(-1, gate, 0.995, true); edge(1, gate, 0.995, true); }

  /* --- the RAW CRY: a jagged unquantized zigzag filling the band, plus
         scattered grit. Nothing about it is level or repeatable. --- */
  if (gate > 0.05){
    const n = Math.max(5, Math.round(24*gate));
    const jump = Math.floor(t*7);                       // the noise re-scatters as it sounds
    for (let pass=0; pass<2; pass++){
      g.beginPath();
      for (let i=0;i<=n;i++){
        const u = (i/n)*gate;
        const a = (hash(i + jump*13 + pass*97)*2 - 1) * halfW(u,H) * (pass ? 0.55 : 0.94);
        const q = F.P(u, a);
        i ? g.lineTo(q.x,q.y) : g.moveTo(q.x,q.y);
      }
      g.strokeStyle = pass ? inkLevel(4) : INK;
      g.lineWidth = pass ? Math.max(2.5, W*0.0042) : Math.max(3.5, W*0.0058);
      g.lineJoin = "miter"; g.lineCap = "round"; g.stroke();
    }
    // grit: short ticks knocked loose either side of the axis
    g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(2.5, W*0.0042);
    for (let i=0;i<16;i++){
      const u = hash(i*3+1)*gate, a = (hash(i*3+2)*2-1)*halfW(u,H)*1.12;
      const q = F.P(u, a), r = 5 + hash(i*3+3)*8;
      g.beginPath(); g.moveTo(q.x - r*F.ux, q.y - r*F.uy); g.lineTo(q.x + r*F.ux, q.y + r*F.uy); g.stroke();
    }
  }

  /* --- the SPEECH: quantized syllable columns STANDING on the corridor's
         baseline, grouped into words. Only slots past the gate have been
         articulated. They rise from the line, so the lower half of the band
         stays open paper and the utterance reads as measured, not as a mass. */
  const base = 0.62;                                    // baseline as a fraction of the half-width
  const du = 0.021;
  for (let j=0;j<SLOT_U.length;j++){
    const u = SLOT_U[j];
    if (u < gate + 0.028) continue;
    const w = halfW(u,H), y0 = w*base;
    const hh = (PATTERN[j]/4) * w * 1.42;
    pen.paint(()=>{
      const p1=F.P(u-du,y0-hh), p2=F.P(u+du,y0-hh), p3=F.P(u+du,y0), p4=F.P(u-du,y0);
      g.moveTo(p1.x,p1.y); g.lineTo(p2.x,p2.y); g.lineTo(p3.x,p3.y); g.lineTo(p4.x,p4.y); g.closePath();
    }, toneSolid(inkLevel(PATTERN[j] >= 3 ? 5 : 2)), Math.max(3, W*0.0052));
  }
  // the spoken baseline: a hard rule ONLY inside the articulated part
  if (gate < 0.95){
    g.strokeStyle = INK; g.lineWidth = Math.max(3, W*0.005); g.lineCap = "butt";
    const u0 = Math.max(gate, 0.02);
    const p0 = F.P(u0, halfW(u0,H)*base), p1 = F.P(0.985, halfW(0.985,H)*base);
    g.beginPath(); g.moveTo(p0.x,p0.y); g.lineTo(p1.x,p1.y); g.stroke();
  }

  /* --- the ARTICULATION GATE: where cry becomes word --- */
  if (gate > 0.02 && gate < 0.99){
    const w = halfW(gate,H);
    const a = F.P(gate, -w*1.30), b = F.P(gate, w*1.30);
    g.strokeStyle = INK; g.lineWidth = Math.max(6, W*0.0105); g.lineCap = "butt";
    g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
    // notch ticks: the quantizer's steps
    g.lineWidth = Math.max(3, W*0.005);
    for (let k=-2;k<=2;k++){
      if (!k) continue;
      const c = F.P(gate, w*0.42*k);
      g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + F.ux*W*0.020, c.y + F.uy*W*0.020); g.stroke();
    }
    // travel arrow just past the gate
    const h1 = F.P(gate+0.052, 0), h0 = F.P(gate+0.020, 0);
    const nx = F.nx*W*0.012, ny = F.ny*W*0.012;
    g.fillStyle = INK; g.beginPath();
    g.moveTo(h1.x,h1.y); g.lineTo(h0.x+nx,h0.y+ny); g.lineTo(h0.x-nx,h0.y-ny); g.closePath(); g.fill();
  }

  /* --- travelling PULSES: scattered bursts before the gate, single solid
         syllables after it. The conversion happens in front of you. --- */
  for (let k=0;k<params.pulses;k++){
    const u = frac(t*0.20 + k/params.pulses);
    if (u < 0.02 || u > 0.985) continue;
    const w = halfW(u,H);
    if (u < gate){
      g.fillStyle = inkLevel(6);
      for (let m=0;m<5;m++){
        const q = F.P(u + (hash(k*11+m)-0.5)*0.022, (hash(k*11+m+50)*2-1)*w*0.85);
        g.beginPath(); g.arc(q.x, q.y, Math.max(2.5, W*0.0055), 0, TAU); g.fill();
      }
    } else {
      const y0 = w*0.62, hh = w*0.46;
      pen.paint(()=>{
        const p1=F.P(u-0.012,y0-hh), p2=F.P(u+0.012,y0-hh), p3=F.P(u+0.012,y0), p4=F.P(u-0.012,y0);
        g.moveTo(p1.x,p1.y); g.lineTo(p2.x,p2.y); g.lineTo(p3.x,p3.y); g.lineTo(p4.x,p4.y); g.closePath();
      }, toneSolid(inkLevel(7)), Math.max(2.5, W*0.0042));
    }
  }
  return gate;
}

/* ============================================================
   THE TARGET — the dreamer's ear, drawn as a diagram, taking the corridor.
   ============================================================ */
function drawEar(pen, g, W, H, voice){
  const { x, y, w, h } = params.ear;
  const cx = x*W, cy = y*H, rx = w*W*0.5, ry = h*H*0.5;
  const lw = Math.max(5, W*0.0085);
  // the pinna: a comma — wide over the top, narrowing to a lobe at the bottom
  pen.paint(()=>{
    g.moveTo(cx - rx*0.92, cy + ry*0.06);
    g.quadraticCurveTo(cx - rx*0.86, cy - ry*0.86, cx + rx*0.10, cy - ry*0.94);
    g.quadraticCurveTo(cx + rx*0.96, cy - ry*0.86, cx + rx*0.86, cy + ry*0.14);
    g.quadraticCurveTo(cx + rx*0.74, cy + ry*0.86, cx + rx*0.06, cy + ry*0.99);
    g.quadraticCurveTo(cx - rx*0.44, cy + ry*1.02, cx - rx*0.50, cy + ry*0.56);
    g.quadraticCurveTo(cx - rx*0.56, cy + ry*0.28, cx - rx*0.92, cy + ry*0.06);
    g.closePath();
  }, toneSolid(inkLevel(1)), lw);
  // the helix rim, folded inside the outline
  g.strokeStyle = INK; g.lineWidth = Math.max(4, W*0.0068); g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(cx - rx*0.46, cy + ry*0.62);
  g.quadraticCurveTo(cx - rx*0.44, cy - ry*0.52, cx + rx*0.18, cy - ry*0.60);
  g.quadraticCurveTo(cx + rx*0.62, cy - ry*0.56, cx + rx*0.56, cy + ry*0.10);
  g.stroke();
  // the concha: a thick dark C wrapped round the canal
  g.strokeStyle = inkLevel(6); g.lineWidth = rx*0.40; g.lineCap = "butt";
  g.beginPath(); g.arc(cx + rx*0.14, cy + ry*0.06, rx*0.40, -2.05, 1.35); g.stroke();
  // the canal itself: the black point the corridor is aimed at
  g.fillStyle = INK;
  g.beginPath(); g.arc(cx + rx*0.10, cy + ry*0.08, rx*0.19, 0, TAU); g.fill();
  // tragus
  g.beginPath();
  g.moveTo(cx - rx*0.34, cy - ry*0.06); g.lineTo(cx - rx*0.04, cy + ry*0.04);
  g.lineTo(cx - rx*0.32, cy + ry*0.24); g.closePath(); g.fill();
  // reception ticks: short arcs stacking against the ear as the voice resolves
  const n = Math.round(clamp(voice,0,1)*3);
  g.strokeStyle = INK; g.lineWidth = Math.max(3.5, W*0.006);
  for (let k=0;k<n;k++){
    const r = rx*(1.24 + k*0.24);
    g.beginPath(); g.arc(cx, cy, r, Math.PI*0.82, Math.PI*1.18); g.stroke();
  }
}

/* ============================================================
   THE IDENTIFICATION — heard pattern against the remembered husband-voice.
   Two rows of blocks; when every heard block has landed on its template the
   MATCH lozenge closes. This is the "with Odysseus's voice" of the title.
   ============================================================ */
function drawVoiceprint(pen, g, W, H, voice){
  const x0 = 0.436, bw = 0.038, gap = 0.0202;
  const yA = 0.700*H, yB = 0.748*H;                      // baselines of the two rows
  const lw = Math.max(3, W*0.0052);
  for (let j=0;j<SIG.length;j++){
    const x = (x0 + j*(bw+gap))*W, hgt = lerp(H*0.0155, H*0.0360, (SIG[j]-1)/3);
    // remembered voice — outline template
    pen.paint(()=>{ g.rect(x, yA - hgt, bw*W, hgt); }, toneSolid(inkLevel(1)), lw);
    // heard voice — solid, filling in left to right
    if (j < Math.round(clamp(voice,0,1)*SIG.length))
      pen.paint(()=>{ g.rect(x, yB - hgt, bw*W, hgt); }, toneSolid(inkLevel(6)), lw);
  }
  // bracket on the left, tying the remembered row to the heard row
  const bx = (x0 - 0.020)*W;
  g.strokeStyle = INK; g.lineWidth = Math.max(3.5, W*0.006); g.lineCap = "butt";
  g.beginPath();
  g.moveTo(bx + W*0.013, yA - H*0.006); g.lineTo(bx, yA - H*0.006);
  g.lineTo(bx, yB); g.lineTo(bx + W*0.013, yB); g.stroke();
  // the match mark: a filled lozenge, only when the whole utterance has landed
  if (voice > 0.92){
    const my = (yA + yB)/2, r = W*0.022;
    g.fillStyle = INK; g.beginPath();
    g.moveTo(bx - r*0.5, my - r); g.lineTo(bx - r*2.1, my); g.lineTo(bx - r*0.5, my + r);
    g.lineTo(bx + r*0.7, my); g.closePath(); g.fill();
  }
}

/* ============================================================
   THE FALLING FEATHERS — the kill, kept as evidence rather than as birds:
   struck feathers drifting from under the beak down to the tally.
   ============================================================ */
function drawFeathers(g, W, H, kill, t){
  if (kill <= 0.02) return;
  g.strokeStyle = inkLevel(6); g.lineCap = "round"; g.lineJoin = "round";
  for (let i=0;i<params.feathers;i++){
    const ph = frac(t*0.11 + i/params.feathers);
    const drop = clamp(kill*1.3 - i*0.06, 0, 1);
    if (drop <= 0) continue;
    const x = lerp(0.250, 0.080, ph) * W + Math.sin(ph*6.2 + i)*W*0.022;
    const y = lerp(0.345, 0.735, ph) * H;
    const a = Math.sin(ph*4.1 + i*1.7)*0.9 - 0.5;
    const L = W*0.040*(0.8 + 0.4*hash(i));
    g.lineWidth = Math.max(4.5, W*0.0080);
    g.beginPath();
    g.moveTo(x - Math.cos(a)*L, y - Math.sin(a)*L);
    g.lineTo(x + Math.cos(a)*L, y + Math.sin(a)*L);
    g.stroke();
    g.lineWidth = Math.max(3, W*0.0052);
    for (let k=-1;k<=1;k+=2){
      g.beginPath();
      g.moveTo(x - Math.cos(a)*L*0.20, y - Math.sin(a)*L*0.20);
      g.lineTo(x + Math.cos(a+k*1.05)*L*0.60, y + Math.sin(a+k*1.05)*L*0.60);
      g.stroke();
    }
  }
}

/* ============================================================
   THE LEDGER — the declared meaning, along the foot of the frame.
   Twenty strokes in four struck clusters, the count as seven-segment
   geometry (never small type), and the suitor-cluster it equals.
   ============================================================ */
function sevenSeg(pen, g, x, y, dw, dh, th, digit, lit){
  const on = { "0":["a","b","c","d","e","f"], "2":["a","b","g","e","d"] }[digit] || [];
  const put = (k, rx, ry, rw, rh) => {
    const level = on.includes(k) ? (lit ? 7 : 1) : 0;
    if (!on.includes(k)) return;
    pen.paint(()=>{ g.rect(rx, ry, rw, rh); }, toneSolid(inkLevel(level)), Math.max(3, th*0.28));
  };
  const hw = dw - th*1.5, hy = dh/2 - th*0.9;
  put("a", x + th*0.75, y,               hw, th);
  put("g", x + th*0.75, y + dh/2 - th/2, hw, th);
  put("d", x + th*0.75, y + dh - th,     hw, th);
  put("f", x,           y + th*0.75,     th, hy);
  put("b", x + dw - th, y + th*0.75,     th, hy);
  put("e", x,           y + dh/2 + th*0.15, th, hy);
  put("c", x + dw - th, y + dh/2 + th*0.15, th, hy);
}

function drawLedger(pen, g, W, H, kill, voice){
  const yTop = 0.778*H, yBot = 0.830*H;
  const lw = Math.max(3, W*0.0052);

  /* the legend: one goose glyph, so the tally counts something */
  g.strokeStyle = INK; g.lineCap = "round"; g.lineJoin = "round";
  g.lineWidth = Math.max(6, W*0.0105);
  g.beginPath();
  g.moveTo(0.064*W, yBot + H*0.004);
  g.quadraticCurveTo(0.040*W, 0.808*H, 0.052*W, 0.788*H);
  g.stroke();
  g.fillStyle = INK;
  g.beginPath(); g.arc(0.0555*W, 0.7825*H, W*0.0155, 0, TAU); g.fill();
  g.beginPath();
  g.moveTo(0.043*W, 0.7785*H); g.lineTo(0.018*W, 0.7855*H); g.lineTo(0.043*W, 0.7900*H);
  g.closePath(); g.fill();

  /* twenty strokes, four clusters of five, struck as the kill completes */
  const struck = Math.round(clamp(kill,0,1)*4);
  for (let c=0;c<4;c++){
    const x0 = 0.098 + c*0.098;
    const hit = c < struck;
    g.strokeStyle = hit ? INK : inkLevel(3);
    g.lineWidth = hit ? Math.max(5, W*0.0085) : Math.max(3.5, W*0.006);
    for (let s=0;s<5;s++){
      const x = (x0 + s*0.0148)*W;
      g.beginPath(); g.moveTo(x, yTop); g.lineTo(x, yBot); g.stroke();
    }
    if (hit){
      g.lineWidth = Math.max(6, W*0.0105);
      g.beginPath();
      g.moveTo((x0-0.008)*W, yBot + H*0.006);
      g.lineTo((x0+0.068)*W, yTop - H*0.006);
      g.stroke();
    }
  }

  /* the count, as geometry: 2 0 */
  const dw = W*0.068, dh = H*0.094, th = Math.max(11, W*0.0180);
  sevenSeg(pen, g, 0.520*W, 0.766*H, dw, dh, th, "2", voice > 0.55);
  sevenSeg(pen, g, 0.604*W, 0.766*H, dw, dh, th, "0", voice > 0.55);

  /* equals */
  if (voice > 0.55){
    g.fillStyle = INK;
    g.fillRect(0.694*W, 0.792*H, W*0.048, th*0.66);
    g.fillRect(0.694*W, 0.828*H, W*0.048, th*0.66);
  }

  /* the suitors: three head-and-shoulder blocks, struck when the meaning lands */
  const bx = 0.766*W, by = 0.768*H, bs = W*0.062;
  for (let k=0;k<3;k++){
    const x = bx + k*bs*0.60, y = by + (k%2)*H*0.012;
    pen.paint(()=>{
      g.moveTo(x, y + bs*0.98);
      g.lineTo(x, y + bs*0.38);
      g.quadraticCurveTo(x + bs*0.36, y - bs*0.12, x + bs*0.72, y + bs*0.38);
      g.lineTo(x + bs*0.72, y + bs*0.98);
      g.closePath();
    }, toneSolid(inkLevel(k===1 ? 2 : 4)), lw);
  }
  if (voice > 0.88){
    g.strokeStyle = INK; g.lineWidth = Math.max(8, W*0.0135); g.lineCap = "round";
    g.beginPath();
    g.moveTo(0.756*W, 0.826*H); g.lineTo(0.898*W, 0.750*H); g.stroke();
  }
}

/* ---------------- assembly ---------------- */
function drawFX(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const t = st.t || 0;
  const ph = phaseAt(t);
  const voice = (typeof st.voice === "number") ? clamp(st.voice, 0, 1) : ph.voice;
  const kill  = (typeof st.kill  === "number") ? clamp(st.kill,  0, 1) : ph.kill;
  const gape  = (typeof st.gape  === "number") ? clamp(st.gape,  0, 1)
               : params.gape * clamp(0.30 + 0.70*Math.sin(clamp(voice,0,1)*Math.PI*0.9 + 0.55), 0, 1);
  const layers = st.layers || ["feathers","corridor","eagle","ear","voiceprint","ledger"];
  const has = l => layers.includes(l);

  const F = axisFrame(W, H);
  let gate = 1;

  if (has("feathers"))   drawFeathers(g, W, H, kill, t);
  if (has("corridor"))   gate = drawCorridor(pen, g, W, H, F, voice, t);
  if (has("eagle"))      drawEagle(pen, g, W, H, gape, t);
  if (has("ear"))        drawEar(pen, g, W, H, voice);
  if (has("voiceprint")) drawVoiceprint(pen, g, W, H, voice);
  if (has("ledger"))     drawLedger(pen, g, W, H, kill, voice);

  return { anchors: asset.anchors, voice, kill, gate };
}

export const asset = {
  id:"divine-fx.dream-eagle-with-odysseus-voice",
  type:"DIVINE_FX",
  name:"Dream eagle with Odysseus voice",
  statusWord:"ARTICULATING",
  scene:"OD-B19-S06",

  params,
  /* back -> front. A scene may pass a subset: ["eagle","corridor"] for the bare
     omen without the reading, or drop "ledger" for the un-interpreted dream. */
  layers:["feathers","corridor","eagle","ear","voiceprint","ledger"],

  /* normalized 0..1 anchors: source, field, target, consequence, camera */
  anchors:{
    "source:gape":         { x:0.196, y:0.256 },
    "source:eagle-body":   { x:0.440, y:0.170 },
    "perch:roof-beam":     { x:0.372, y:0.270 },
    "field:corridor-mid":  { x:0.509, y:0.453 },
    "field:gate":          { x:0.430, y:0.417 },
    "target:ear":          { x:0.868, y:0.598 },
    "consequence:match":   { x:0.905, y:0.728 },
    "consequence:tally":   { x:0.240, y:0.804 },
    "consequence:count":   { x:0.615, y:0.815 },
    "consequence:suitors": { x:0.862, y:0.818 },
    "camera:wide":         { x:0.500, y:0.470 },
  },

  /* affected regions */
  zones:{
    raptor:   { x0:0.14, y0:0.03, x1:0.71, y1:0.30 },
    corridor: { x0:0.11, y0:0.23, x1:0.90, y1:0.67 },
    hearing:  { x0:0.79, y0:0.53, x1:0.95, y1:0.67 },
    ledger:   { x0:0.02, y0:0.70, x1:0.95, y1:0.88 },
  },

  /* DIVINE_FX transformation states: the stoop, the kill, the raw cry, the
     articulation, the finished declaration. */
  states:{
    initial:"articulating",
    nodes:{
      stooping:{     preview:{ t:0.6,  kill:0.00, voice:0.00, gape:0.15, status:"STOOPING",     progress:0.07 } },
      killing:{      preview:{ t:2.0,  kill:0.70, voice:0.00, gape:0.85, status:"KILLING",      progress:0.22 } },
      crying:{       preview:{ t:3.8,  kill:1.00, voice:0.00, gape:1.00, status:"CRYING",       progress:0.42 } },
      articulating:{ preview:{ t:6.5,  kill:1.00, voice:0.62, gape:0.90, status:"ARTICULATING", progress:0.72 } },
      declared:{     preview:{ t:8.4,  kill:1.00, voice:1.00, gape:0.55, status:"DECLARED",     progress:0.96 } },
    },
    edges:[["stooping","killing"],["killing","crying"],["crying","articulating"],
           ["articulating","declared"],["declared","stooping"]],
  },
  duration: params.period,
  channels:["t","voice","kill","gape","gate","pulses"],

  /* neutral preview: mid-articulation — the gate part-way back up the corridor,
     raw cry still at the beak, three words already standing as speech, the
     voiceprint half matched, the twenty struck. */
  preview:()=>({ t:6.5, kill:1.0, voice:0.62, gape:0.90, status:"ARTICULATING", progress:0.72 }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
