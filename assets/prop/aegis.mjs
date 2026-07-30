/* prop.aegis — Athena's shield-sign, held up over the megaron.
   PROP asset. Book XXII: with the suitors still fighting from the floor of
   the hall, Athena "held up her man-destroying aegis high from the roof" and
   the wits went out of them — they stampeded down the hall like a herd of
   cattle a gadfly has scattered. This asset is that sign and only that sign:
   an isolated, reusable divine object with a declared world scale, grip /
   support / contact anchors, ownership, a collision shape, and every state
   the scene asks it to play.

   It is NOT `divine_fx` — the field it throws is drawn as the object's own
   diagram (shock rings, broken rays, a tally of who is still standing), the
   way a weapon card shows its own reach. And it is NOT a shield in the
   panoply sense: nobody in the house may carry it. Ownership is Athena's.

   States (the five the scene calls for):
     concealed      — furled: the goatskin rolled and corded, fringe hanging,
                      the deployed circle only a dormant dashed outline
     raised         — lifted from the roof and shown face-on: fringe, rim band
                      of ticks, the inner ring, the sign quiet.  CARD SIGNATURE
     fear-emission  — the sign opens: shock rings and broken radial rays go
                      out, tassels fly, eyes and jaw widen, the herd wavers
     enemy-break    — the visible consequence: the driving fan puts the whole
                      lane of tokens over, the ten-notch tally emptied
     withdrawn      — going back up out of the roof, edge-on, leaving a dotted
                      afterimage where the circle hung

   Ink discipline: the disc is a LIGHT plane (level 1–2). The only dark ink is
   on tassel caps, the sign's eyes / brow / teeth, the ledger beads and the
   arrowheads — so most of the paper stays paper. No span crosses the frame:
   the header rule, the roof bracket, the herd's ground rule and the ledger are
   all broken into short runs. Every numeral is seven-segment GEOMETRY at
   ~51px, never type.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B22-S05. */
import { makePen, toneSolid, inkLevel, INK, clamp01 } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  tassels:24,          // the fringe of tassels around the rim
  herd:10,             // tokens in the lane = the minds the sign can take
  // declared world scale (the sign is a thing with a size, not a glow)
  scale:{ discDia_m:1.06, tasselLen_m:0.23, standoff_m:6.0, heldHeight_m:4.8 },
  disc:{ cx:.500, cy:.425, r:.255 },   // centre normalized to W,H · r to W
  headY:0.062, digitH:0.058,           // header register · digit ≈ 51px
  roofY:0.158, laneY:0.762, ledgerY:0.872,
  // ink levels — light planes, dark accents
  field:1, hide:2, rim:2, plate:3, bronze:4, accent:6, brow:5,
};

/* ---------------- numerals as GEOMETRY (seven segment) ---------------- */

const SEG = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
              6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };

function segDigit(g, x, y, h, d){
  const w = h*0.56, t = h*0.170, half = h/2;
  const S = {
    a:[x+t*.55, y,            w-t*1.10, t],
    g:[x+t*.55, y+half-t/2,   w-t*1.10, t],
    d:[x+t*.55, y+h-t,        w-t*1.10, t],
    f:[x,       y+t*.55,      t, half-t*.85],
    b:[x+w-t,   y+t*.55,      t, half-t*.85],
    e:[x,       y+half+t*.30, t, half-t*.85],
    c:[x+w-t,   y+half+t*.30, t, half-t*.85],
  };
  g.fillStyle = INK;
  for (const s of (SEG[d]||"")) { const r=S[s]; g.fillRect(r[0], r[1], r[2], r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits,"0");
  const w = h*0.56, gap = h*0.22;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w+gap; }
  return cx - gap - x;
}

/* ---------------- pieces of the sign ---------------- */

/* One tassel of the fringe: a tapered goatskin lick with a single dark cap.
   Origin sits on the rim, +x runs outward. */
function tassel(pen, g, x, y, a, len, w){
  g.save(); g.translate(x, y); g.rotate(a);
  pen.paint(()=>{
    g.moveTo(0, -w/2);
    g.lineTo(len*.70, -w*.32);
    g.lineTo(len*.70,  w*.32);
    g.lineTo(0,  w/2);
    g.closePath();
  }, toneSolid(inkLevel(params.hide)), 2.6);
  pen.paint(()=>{ g.rect(len*.70, -w*.44, len*.30, w*.88); },
            toneSolid(inkLevel(params.accent)), 2.2);
  g.restore();
}

/* One serpent of the sign's hair: two segments with a kink and a wedge head,
   growing OUT of the plate edge (never floating free in the field). */
function serpent(pen, g, th, L, w, wig){
  g.save(); g.rotate(th);
  pen.paint(()=>{ g.rect(0, -w/2, L*0.56, w); }, toneSolid(inkLevel(params.hide)), 2.6);
  g.translate(L*0.56, 0); g.rotate(wig);
  pen.paint(()=>{ g.rect(0, -w*0.42, L*0.30, w*0.84); }, toneSolid(inkLevel(params.hide)), 2.4);
  g.translate(L*0.30, 0);
  pen.paint(()=>{ g.moveTo(0, -w*0.66); g.lineTo(L*0.30, 0); g.lineTo(0, w*0.66); g.closePath(); },
            toneSolid(inkLevel(params.bronze)), 2.2);
  g.restore();
}

/* The sign at the centre: blocky and diagrammatic, not a portrait.
   alarm 0..1 widens the eyes, drops the jaw and throws the serpents out. */
function gorgon(pen, g, cx, cy, s, alarm=0){
  const a = clamp01(alarm);
  g.save(); g.translate(cx, cy);
  // ── serpents: SEVEN, wide apart around the top arc, rooted on the plate ──
  const N = 7;
  for (let i=0;i<N;i++){
    const th = -Math.PI + i*(Math.PI/(N-1));
    g.save(); g.translate(Math.cos(th)*s*0.98, Math.sin(th)*s*0.98);
    serpent(pen, g, th, s*(0.62 + a*0.18), s*0.28,
            (i%2 ? 0.52 : -0.48) + a*0.26*Math.sin(i*1.7));
    g.restore();
  }
  // ── the plate: domed skull, tapered jaw ──
  pen.paint(()=>{
    g.moveTo(-s*0.98, -s*0.34);
    g.quadraticCurveTo(-s*0.92, -s*1.02, 0, -s*1.02);
    g.quadraticCurveTo( s*0.92, -s*1.02,  s*0.98, -s*0.34);
    g.lineTo( s*0.86, s*0.46);
    g.quadraticCurveTo(0, s*1.24, -s*0.86, s*0.46);
    g.closePath();
  }, toneSolid(inkLevel(params.plate)), 3.6);
  // ── brow: two heavy bars with a gap over the nose ──
  for (const sd of [-1,1])
    pen.paint(()=>{ g.rect(sd<0 ? -s*0.82 : s*0.16, -s*0.60, s*0.66, s*0.17); },
              toneSolid(inkLevel(params.brow)), 2.2);
  // ── eyes ──
  const ew = s*(0.42 + a*0.12), eh = s*(0.28 + a*0.20);
  for (const sd of [-1,1]){
    pen.paint(()=>{ g.rect(sd*s*0.49 - ew/2, -s*0.26 - eh/2, ew, eh); },
              toneSolid(inkLevel(params.accent)), 2.4);
    if (a > 0.5)
      pen.paint(()=>{ g.rect(sd*s*0.49 - ew*0.15, -s*0.26 - eh*0.17, ew*0.30, eh*0.34); },
                toneSolid(inkLevel(0)), 2);
  }
  // ── nose bar ──
  pen.paint(()=>{ g.rect(-s*0.07, -s*0.14, s*0.14, s*0.30); },
            toneSolid(inkLevel(params.brow)), 2);
  // ── jaw: a light plate with blocky teeth, and a fang at each corner ──
  const mw = s*1.10, mh = s*(0.24 + a*0.34), my = s*0.34;
  pen.paint(()=>{ g.rect(-mw/2, my, mw, mh); }, toneSolid(inkLevel(params.field)), 3);
  g.fillStyle = INK;
  const tw = mw/5*0.54, th = mh*0.32;
  for (let i=0;i<5;i++){
    const tx = -mw/2 + mw/5*(i+0.23);
    g.fillRect(tx, my, tw, th);
    if (i<4) g.fillRect(tx + mw/10, my + mh - th, tw, th);
  }
  for (const sd of [-1,1])
    pen.paint(()=>{
      g.moveTo(sd*mw*0.50, my);
      g.lineTo(sd*mw*0.34, my);
      g.lineTo(sd*mw*0.44, my + mh*0.92);
      g.closePath();
    }, toneSolid(inkLevel(params.accent)), 2);
  g.restore();
}

/* The sign shown face-on. squash < 1 tilts it away from the reader. */
function aegisFace(pen, g, cx, cy, R, o={}){
  const flare = clamp01(o.flare||0);
  const sq = o.squash === undefined ? 1 : o.squash;
  const roll = o.roll || 0;

  g.save(); g.translate(cx, cy); g.rotate(roll); g.scale(1, sq);

  // fringe, behind the disc
  const n = params.tassels;
  for (let i=0;i<n;i++){
    const a = i/n*Math.PI*2 - Math.PI/2;
    const swing = flare*0.30*Math.sin(i*1.9 + 0.7);
    tassel(pen, g, Math.cos(a)*R*0.985, Math.sin(a)*R*0.985,
           a + swing, R*(0.19 + flare*0.09), R*0.074);
  }
  // rim band + field: two light planes, the band read by its ticks
  pen.paint(()=>{ g.arc(0, 0, R, 0, 7); }, toneSolid(inkLevel(params.rim)), 4.2);
  pen.paint(()=>{ g.arc(0, 0, R*0.845, 0, 7); }, toneSolid(inkLevel(params.field)), 3.2);
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "butt";
  for (let i=0;i<n;i++){
    const a = i/n*Math.PI*2 - Math.PI/2 + Math.PI/n;
    g.beginPath();
    g.moveTo(Math.cos(a)*R*0.862, Math.sin(a)*R*0.862);
    g.lineTo(Math.cos(a)*R*0.985, Math.sin(a)*R*0.985);
    g.stroke();
  }
  // the inner ring the sign is seated in
  pen.ink(()=>{ g.arc(0, 0, R*0.72, 0, 7); }, 3.4);
  // the sign itself
  gorgon(pen, g, 0, 0, R*0.40, flare);
  g.restore();
}

/* The sign seen EDGE-ON — the attitude it goes back up through the roof in.
   Not a squashed face: a rim ellipse, a lit inner shell, the sign read only as
   its spine bar, and the fringe hanging straight down off the lower rim. */
function aegisEdge(pen, g, cx, cy, R, sq=0.20, roll=0.10){
  g.save(); g.translate(cx, cy); g.rotate(roll);
  const n = 13;
  for (let i=0;i<n;i++){
    const u = (i+0.5)/n, x = -R*0.96 + 2*R*0.96*u;
    const y = Math.sqrt(Math.max(0, 1-(x/R)*(x/R)))*R*sq;
    tassel(pen, g, x, y, Math.PI/2 + (u-0.5)*0.44, R*0.17, R*0.070);
  }
  pen.paint(()=>{ g.ellipse(0, 0, R, R*sq, 0, 0, 7); },
            toneSolid(inkLevel(params.rim)), 4.2);
  pen.paint(()=>{ g.ellipse(0, -R*sq*0.20, R*0.80, R*sq*0.54, 0, 0, 7); },
            toneSolid(inkLevel(params.field)), 3);
  // the sign itself, edge-on: one short spine bar
  pen.paint(()=>{ g.rect(-R*0.09, -R*sq*0.62, R*0.18, R*sq*1.16); },
            toneSolid(inkLevel(params.brow)), 2.6);
  g.restore();
}

/* Furled: the skin rolled on its pole, corded in three places, fringe down. */
function aegisFurled(pen, g, cx, cy, R, ang=-0.40){
  const L = R*2.05, w = R*0.46;
  g.save(); g.translate(cx, cy); g.rotate(ang);
  // hanging fringe along the underside — only where the roll is
  for (let i=0;i<9;i++){
    const x = -L/2 + L*(i+0.5)/9;
    tassel(pen, g, x, w*0.44, Math.PI/2 + (i-4)*0.035, R*0.18, R*0.068);
  }
  // the roll
  pen.paint(()=>{
    g.moveTo(-L/2, -w/2);
    g.lineTo( L/2, -w/2);
    g.quadraticCurveTo(L/2 + w*.42, 0, L/2, w/2);
    g.lineTo(-L/2, w/2);
    g.quadraticCurveTo(-L/2 - w*.42, 0, -L/2, -w/2);
    g.closePath();
  }, toneSolid(inkLevel(params.hide)), 4);
  // the spiral seam of the roll, broken into three runs
  pen.ink(()=>{
    for (const [x0,x1] of [[-L*.42,-L*.22],[-L*.08,L*.12],[L*.26,L*.44]]){
      g.moveTo(x0, -w*.18); g.lineTo(x1, w*.12);
    }
  }, 3.2);
  // three cords, each a light band read by its whipping
  for (const u of [-0.30, 0.02, 0.34]){
    const x = L*u;
    pen.paint(()=>{ g.rect(x - w*.13, -w*.62, w*.26, w*1.24); },
              toneSolid(inkLevel(params.rim)), 3.2);
    g.strokeStyle = INK; g.lineWidth = 3;
    for (let k=-2;k<=2;k++){
      g.beginPath(); g.moveTo(x - w*.13, k*w*.24 - w*.06);
      g.lineTo(x + w*.13, k*w*.24 + w*.08); g.stroke();
    }
  }
  g.restore();
}

/* Dormant / residual circle: the sign's deployed extent, marked not drawn. */
function ghostRing(pen, g, cx, cy, R, dot=true){
  if (dot){
    g.fillStyle = "rgba(0,0,0,0.46)";
    for (let i=0;i<40;i++){
      const a = i/40*Math.PI*2;
      g.beginPath(); g.arc(cx+Math.cos(a)*R, cy+Math.sin(a)*R, 5.4, 0, 7); g.fill();
    }
  } else {
    g.strokeStyle = "rgba(0,0,0,0.34)"; g.lineWidth = 4.4; g.setLineDash([17,14]);
    g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke(); g.setLineDash([]);
  }
}

/* The field: broken shock rings + broken radial rays. k = 0..1 intensity.
   Bounded to 1.28R so it never reaches the header register. */
function emission(pen, g, cx, cy, R, k){
  if (k <= 0) return;
  g.save();
  const rings = [1.09, 1.28];
  for (let i=0;i<rings.length;i++){
    if (i > k*2.2) break;
    const rr = R*rings[i];
    g.strokeStyle = `rgba(0,0,0,${(0.36 - i*0.09).toFixed(2)})`;
    g.lineWidth = Math.max(3.4, 7.5 - i*1.8);
    g.setLineDash([rr*0.20, rr*0.14]);
    g.beginPath(); g.arc(cx, cy, rr, 0, 7); g.stroke();
  }
  g.setLineDash([]);
  // rays: one short segment per spoke, a fifth of the spokes deliberately absent
  g.strokeStyle = INK; g.lineCap = "butt"; g.lineWidth = 4.6;
  const n = 20;
  for (let i=0;i<n;i++){
    if (i%5 === 3) continue;
    const a = i/n*Math.PI*2 + 0.08;
    const ca = Math.cos(a), sa = Math.sin(a);
    const r0 = R*1.14, r1 = r0 + R*(0.07 + 0.07*k)*(i%2?1:0.62);
    g.beginPath(); g.moveTo(cx+ca*r0, cy+sa*r0); g.lineTo(cx+ca*r1, cy+sa*r1); g.stroke();
  }
  g.restore();
}

/* The driving fan: what the sign does to the room, as vectors not figures. */
function driveFan(pen, g, cx, cy, R){
  const arrows = [-0.72, -0.36, 0, 0.36, 0.72];
  for (let i=0;i<arrows.length;i++){
    const a = Math.PI/2 + arrows[i];
    const ca = Math.cos(a), sa = Math.sin(a);
    const r0 = R*1.06, r1 = R*(1.30 + (i%2?0.06:0));
    g.strokeStyle = "rgba(0,0,0,0.52)"; g.lineWidth = 9; g.lineCap = "butt";
    g.setLineDash([20, 13]);
    g.beginPath(); g.moveTo(cx+ca*r0, cy+sa*r0); g.lineTo(cx+ca*r1, cy+sa*r1); g.stroke();
    g.setLineDash([]);
    g.save(); g.translate(cx+ca*r1, cy+sa*r1); g.rotate(a);
    g.fillStyle = INK;
    g.beginPath(); g.moveTo(R*0.11, 0); g.lineTo(-R*0.05, -R*0.062);
    g.lineTo(-R*0.05, R*0.062); g.closePath(); g.fill();
    g.restore();
  }
}

/* ---------------- the herd lane: the sign's measurable effect ---------------- */
/* Tokens, never figures: a light standing bar with one dark head bead.
   mark: hold | waver | flee | down */
function lane(pen, g, W, H, marks){
  const y = H*params.laneY, u = H*0.050;
  const cols = params.herd/2, step = W*0.086;
  const groups = [ W*0.500 - W*0.062 - step*(cols-1), W*0.500 + W*0.062 ];
  for (let gi=0; gi<2; gi++){
    const out = gi ? 1 : -1;                 // driven outward, away from the sign
    for (let i=0;i<cols;i++){
      const x = groups[gi] + i*step;
      const m = marks[gi*cols+i] || "hold";
      if (m === "down"){
        // fallen: bars lie in a HEAP, not a line — every other one set back,
        // and each shorter than its slot so the row can never read as a bar
        const dy = (i%2 ? -u*0.34 : 0), dx = (i%2 ? -u*0.10 : u*0.08);
        pen.paint(()=>{ g.rect(x + dx - u*0.32, y + dy - u*0.28, u*0.64, u*0.26); },
                  toneSolid(inkLevel(params.hide)), 2.8);
        pen.paint(()=>{ g.arc(x + dx + out*u*0.52, y + dy - u*0.15, u*0.16, 0, 7); },
                  toneSolid(inkLevel(params.accent)), 2.4);
        continue;
      }
      const tilt = m==="waver" ? (i%2?0.24:-0.20) : m==="flee" ? out*0.58 : 0;
      g.save(); g.translate(x, y); g.rotate(tilt);
      pen.paint(()=>{ g.rect(-u*0.18, -u*0.84, u*0.36, u*0.84); },
                toneSolid(inkLevel(params.hide)), 2.8);
      pen.paint(()=>{ g.arc(0, -u*1.24, u*0.19, 0, 7); },
                toneSolid(inkLevel(params.accent)), 2.4);
      g.restore();
      if (m === "flee"){
        g.strokeStyle = "rgba(0,0,0,0.36)"; g.lineCap="round";
        for (let s=0;s<3;s++){
          g.lineWidth = 5 - s*1.2;
          g.beginPath();
          g.moveTo(x - out*u*0.30, y - u*(0.34 + s*0.30));
          g.lineTo(x - out*u*(0.30 + 0.62 - s*0.12), y - u*(0.34 + s*0.30));
          g.stroke();
        }
      }
      if (m === "waver"){
        g.strokeStyle = "rgba(0,0,0,0.34)"; g.lineWidth = 4.2;
        g.beginPath(); g.arc(x, y - u*1.24, u*0.48, Math.PI*1.06, Math.PI*1.64); g.stroke();
      }
    }
    // the floor under this group, in TWO short runs — never one bar
    const s0 = groups[gi];
    pen.ink(()=>{
      g.moveTo(s0 - step*0.42, y + u*0.14); g.lineTo(s0 + step*1.42, y + u*0.14);
      g.moveTo(s0 + step*2.58, y + u*0.14); g.lineTo(s0 + step*4.42, y + u*0.14);
    }, 4);
  }
}

/* ---------------- the ten-notch mind ledger ---------------- */
/* hold = solid bead · panic = a hollow notch with a tick · gone = crossed. */
function ledger(pen, g, W, H, marks){
  const y = H*params.ledgerY, h = H*0.036, w = W*0.056, gap = W*0.016;
  const groupW = w*5 + gap*4;
  const starts = [W*0.5 - groupW - W*0.036, W*0.5 + W*0.036];
  for (let gi=0; gi<2; gi++){
    let x = starts[gi];
    for (let i=0;i<5;i++){
      const m = marks[gi*5+i] || "hold";
      pen.paint(()=>{ g.rect(x, y, w, h); }, toneSolid(inkLevel(params.hide)), 3.2);
      if (m === "hold")
        pen.paint(()=>{ g.rect(x+w*.26, y+h*.20, w*.48, h*.60); },
                  toneSolid(inkLevel(params.accent)), 2.2);
      if (m === "panic")
        pen.ink(()=>{ g.moveTo(x+w*.30, y+h*.22); g.lineTo(x+w*.50, y+h*.78);
                      g.lineTo(x+w*.70, y+h*.22); }, 4);
      if (m === "gone")
        pen.ink(()=>{ g.moveTo(x+w*.14, y+h*.18); g.lineTo(x+w*.86, y+h*.82);
                      g.moveTo(x+w*.86, y+h*.18); g.lineTo(x+w*.14, y+h*.82); }, 4);
      x += w + gap;
    }
    pen.ink(()=>{ g.moveTo(starts[gi], y+h*1.44); g.lineTo(starts[gi]+groupW, y+h*1.44); }, 3);
  }
}

/* ---------------- header register: the live reading, as geometry ---------------- */
/* Left  = the sign's emission level 00..07 (one per ink level, its own scale).
   Right = minds taken, 00..10. The rule under them is broken in three places. */
function header(pen, g, W, H, { level, taken }){
  const y = H*params.headY, dh = H*params.digitH;
  // sign pictogram, left
  const sx = W*0.072;
  pen.paint(()=>{ g.arc(sx, y+dh*.5, dh*.38, 0, 7); }, toneSolid(inkLevel(params.hide)), 3);
  pen.paint(()=>{ g.rect(sx-dh*.15, y+dh*.34, dh*.30, dh*.30); },
            toneSolid(inkLevel(params.accent)), 2.2);
  g.strokeStyle = INK; g.lineWidth = 2.8;
  for (let i=0;i<8;i++){ const a=i/8*Math.PI*2+0.2;
    g.beginPath();
    g.moveTo(sx+Math.cos(a)*dh*.40, y+dh*.5+Math.sin(a)*dh*.40);
    g.lineTo(sx+Math.cos(a)*dh*.56, y+dh*.5+Math.sin(a)*dh*.56); g.stroke(); }
  segNumber(g, sx + dh*.82, y, dh, level, 2);
  // token pictogram, right
  const px = W*0.898;
  pen.paint(()=>{ g.rect(px-dh*.10, y+dh*.16, dh*.20, dh*.58); },
            toneSolid(inkLevel(params.hide)), 3);
  pen.paint(()=>{ g.arc(px, y+dh*.02, dh*.15, 0, 7); },
            toneSolid(inkLevel(params.accent)), 2.4);
  const wNum = dh*.56*2 + dh*.22;
  segNumber(g, px - dh*.62 - wNum, y, dh, taken, 2);
  // broken rule
  const ry = y + dh*1.36;
  pen.ink(()=>{
    g.moveTo(W*.045, ry); g.lineTo(W*.285, ry);
    g.moveTo(W*.360, ry); g.lineTo(W*.455, ry);
    g.moveTo(W*.545, ry); g.lineTo(W*.640, ry);
    g.moveTo(W*.715, ry); g.lineTo(W*.955, ry);
  }, 3.4);
}

/* The roof it is held down from: two SHORT joist stubs either side of the
   strap, never a beam across the frame. */
function roofHold(pen, g, W, H, cx, discTop){
  const by = H*params.roofY, sh = H*0.021;
  pen.ink(()=>{ g.moveTo(cx - W*.180, by); g.lineTo(cx - W*.070, by);
                g.moveTo(cx + W*.070, by); g.lineTo(cx + W*.180, by); }, 5);
  for (const sd of [-1,1])
    pen.paint(()=>{ g.rect(cx + sd*W*.070 - (sd<0?W*.048:0), by, W*.048, sh); },
              toneSolid(inkLevel(params.hide)), 3);
  // strap down to the rim
  const s0 = by + sh*0.2, drop = discTop - s0;
  pen.paint(()=>{ g.rect(cx - W*.017, s0, W*.034, drop); },
            toneSolid(inkLevel(params.rim)), 3);
  g.strokeStyle = INK; g.lineWidth = 2.6;
  for (let s = s0 + 12; s < s0 + drop - 8; s += 15){
    g.beginPath(); g.moveTo(cx - W*.017, s); g.lineTo(cx + W*.017, s + 9); g.stroke();
  }
  // the divine hand-hold: a corded grip block on the strap
  pen.paint(()=>{ g.rect(cx - W*.040, s0 + drop*0.16, W*.080, H*.030); },
            toneSolid(inkLevel(params.bronze)), 3);
}

/* ---------------- state renderers ---------------- */

function D(W,H){ return { cx:W*params.disc.cx, cy:H*params.disc.cy, R:W*params.disc.r }; }

function drawConcealed(pen, g, W, H){
  const { cx, cy, R } = D(W,H);
  header(pen, g, W, H, { level:0, taken:0 });
  ghostRing(pen, g, cx, cy, R, false);
  aegisFurled(pen, g, cx, cy, R, -0.40);
  lane(pen, g, W, H, Array(10).fill("hold"));
  ledger(pen, g, W, H, Array(10).fill("hold"));
}

function drawRaised(pen, g, W, H){
  const { cx, cy, R } = D(W,H);
  header(pen, g, W, H, { level:2, taken:0 });
  roofHold(pen, g, W, H, cx, cy - R*1.16);
  aegisFace(pen, g, cx, cy, R, { flare:0 });
  lane(pen, g, W, H, Array(10).fill("hold"));
  ledger(pen, g, W, H, Array(10).fill("hold"));
}

function drawEmission(pen, g, W, H){
  const { cx, cy, R } = D(W,H);
  header(pen, g, W, H, { level:7, taken:4 });
  emission(pen, g, cx, cy, R, 1);
  aegisFace(pen, g, cx, cy, R, { flare:1 });
  lane(pen, g, W, H, ["waver","waver","hold","waver","hold",
                      "hold","waver","waver","hold","waver"]);
  ledger(pen, g, W, H, ["panic","panic","hold","panic","hold",
                        "hold","panic","hold","hold","hold"]);
}

function drawBreak(pen, g, W, H){
  const { cx, cy, R } = D(W,H);
  header(pen, g, W, H, { level:7, taken:10 });
  emission(pen, g, cx, cy, R, 0.40);
  driveFan(pen, g, cx, cy, R);
  aegisFace(pen, g, cx, cy, R, { flare:1, squash:0.94, roll:0.05 });
  lane(pen, g, W, H, ["down","flee","flee","down","flee",
                      "flee","down","flee","flee","down"]);
  ledger(pen, g, W, H, Array(10).fill("gone"));
}

function drawWithdrawn(pen, g, W, H){
  const { cx, cy, R } = D(W,H);
  header(pen, g, W, H, { level:0, taken:10 });
  ghostRing(pen, g, cx, cy, R, true);
  // the lift lane back up out of the roof
  g.strokeStyle = "rgba(0,0,0,0.50)"; g.lineWidth = 5.6; g.setLineDash([16,13]);
  for (const sd of [-1,1]){
    g.beginPath();
    g.moveTo(cx + sd*R*0.66, cy - R*0.16);
    g.quadraticCurveTo(cx + sd*R*0.50, cy - R*0.72, cx + sd*R*0.32, cy - R*0.98);
    g.stroke();
  }
  g.setLineDash([]);
  // going up, edge-on and small with distance
  aegisEdge(pen, g, cx, cy - R*1.02, R*0.82, 0.21, 0.09);
  lane(pen, g, W, H, Array(10).fill("down"));
  ledger(pen, g, W, H, Array(10).fill("gone"));
}

const MODES = {
  concealed: drawConcealed,
  raised: drawRaised,
  "fear-emission": drawEmission,
  "enemy-break": drawBreak,
  withdrawn: drawWithdrawn,
};

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  (MODES[st.mode] || drawRaised)(pen, ctx, W, H);
}

export const asset = {
  id:"prop.aegis",
  type:"PROP",
  name:"Aegis",
  statusWord:"RAISED",
  scene:"OD-B22-S05",

  params,
  // back -> front draw order the module honors
  layers:["ghost-ring","roof-hold","field-rings","field-rays","drive-fan",
          "fringe","rim","inner-ring","serpents","sign","edge-view","herd-lane",
          "header-count","ledger"],

  // normalized 0..1 attachment / contact anchors, measured in the RAISED state
  anchors:{
    "grip:divine":   {x:.500, y:.196},   // where Athena's hand closes on the strap
    "grip:rim":      {x:.245, y:.425},   // the rim hold, if it is ever taken by hand
    "support:roof":  {x:.500, y:.158},   // the joist run it is held down from
    "support:strap": {x:.500, y:.180},   // the strap head
    centre:          {x:.500, y:.425},   // the sign — the field origin
    "contact:rim":   {x:.500, y:.234},   // top of the disc, where it clears the roof
    "field:edge":    {x:.500, y:.752},   // outer shock ring, the standoff radius
    "target:lane":   {x:.500, y:.762},   // the floor line the field is aimed down
    "target:left":   {x:.238, y:.762},   // left half of the herd
    "target:right":  {x:.762, y:.762},   // right half of the herd
    "ledger:count":  {x:.500, y:.923},   // the ten-notch mind tally, addressable
  },
  // collision: the disc only — the fringe and the field pass through everything
  collision:{ kind:"disc", c:{x:.500, y:.425}, r:.255 },
  ownership:"athena · never carried, lent or set down by any mortal in the house; held from the roof of the megaron and taken back up with her",

  states:{
    initial:"concealed",
    nodes:{
      concealed:      { preview:{ mode:"concealed",     status:"FURLED",    progress:0.06 } },
      raised:         { preview:{ mode:"raised",        status:"RAISED",    progress:0.30 } },
      "fear-emission":{ preview:{ mode:"fear-emission", status:"EMITTING",  progress:0.62 } },
      "enemy-break":  { preview:{ mode:"enemy-break",   status:"BROKEN",    progress:0.92 } },
      withdrawn:      { preview:{ mode:"withdrawn",     status:"WITHDRAWN", progress:1.00 } },
    },
    edges:[
      ["concealed","raised"],["raised","fear-emission"],
      ["fear-emission","enemy-break"],["enemy-break","fear-emission"],
      ["enemy-break","withdrawn"],["fear-emission","withdrawn"],
      ["raised","withdrawn"],["raised","concealed"],["withdrawn","concealed"],
    ],
  },
  channels:["mode","flare","taken","height","t","progress"],

  // CARD SIGNATURE — RAISED: the sign shown whole and quiet, held down from
  // two joist stubs, fringe at rest, ten tokens still standing and ten notches
  // still filled. Everything after this state is subtraction.
  preview:()=>({ mode:"raised", status:"RAISED", progress:0.30, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
