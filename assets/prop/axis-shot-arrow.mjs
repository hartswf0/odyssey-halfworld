/* prop.axis-shot-arrow — the one arrow of the contest.
   PROP asset. Book XXI: Odysseus takes a single shaft that lay bare on the
   table beside him, sets it on the bridge of the bow, draws string and notch
   together, and lets fly. "He missed no axe from the first handle-hole clean
   through, and out at the last the bronze-weighted arrow passed."

   The object is ONE arrow, and its whole meaning is an AXIS. So the prop is
   built as a ballistics plate rather than a still life:

     · the shaft itself at declared scale — cane, three vanes, socket collar,
       bronze barbed head, horn nock with its string notch
     · the AXIS RUN — twelve socket apertures in recession on a single
       straight line, the shaft threaded through them, earlier positions of
       the same shaft ghosted behind it (one arrow, three moments)
     · the PROOF registers — bore-versus-shaft clearance in section, the
       twelve-cell pass ledger, the deviation ladder that reads zero

   States (the OD-B21-S07 performance, in order):
     rest      — laid bare on the table: the measured piece study
     nocked    — seated on the served string, fingers bracketed
     drawn     — string and notch back together, draw length dimensioned
     released  — off the string: the archer's paradox, the shaft flexing
     flight    — the axis run: clean through twelve sockets, head emerging
     caught    — buried in the far wall, hidden line beyond the face
     proof     — the plate that says it happened: centres, ledger, zero

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B21-S07. */
import { makePen, toneSolid, inkLevel, INK, lerp } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared scale + build parameters ---------------- */
const params = {
  lengthMM: 860,          // nock face to point
  shaftDia_mm: 11,        // the cane
  headLen_mm: 62,         // bronze barbed head
  massG: 34,
  sockets: 12,            // handle-holes it must pass
  boreDia_mm: 58,         // the axe socket
  pitch_mm: 420,          // spacing of the planted heads
  drawLen_mm: 720,        // string to grip at full draw
  penetration_mm: 140,    // depth into the far wall
  ownership: "odysseus",

  // ink levels — light planes, dark accents, plenty of paper
  cane: 2, grain: 4, feather: 3, bronze: 6, collar: 5,
  socketPlane: 1, blade: 2, wall: 2,
};

/* ---------------- seven-segment numerals: numbers as GEOMETRY ---------------- */
const SEG_MAP = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
                  6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcdfg" };
function segDigit(g, x, y, h, d){
  const w = h*0.56, t = h*0.170, half = h/2;
  const S = {
    a:[x+t*.55, y,          w-t*1.10, t],
    g:[x+t*.55, y+half-t/2, w-t*1.10, t],
    d:[x+t*.55, y+h-t,      w-t*1.10, t],
    f:[x,       y+t*.55,    t, half-t*.85],
    b:[x+w-t,   y+t*.55,    t, half-t*.85],
    e:[x,       y+half+t*.30, t, half-t*.85],
    c:[x+w-t,   y+half+t*.30, t, half-t*.85],
  };
  g.fillStyle = INK;
  for (const s of (SEG_MAP[d] || "")){ const r = S[s]; g.fillRect(r[0], r[1], r[2], r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=0){
  let str = String(Math.max(0, value|0));
  if (digits) str = str.padStart(digits, "0");
  const w = h*0.56, gap = h*0.22;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w + gap; }
  return cx - gap - x;
}

/* ---------------- broken spans + drafting furniture ----------------
   Nothing that crosses the plate may cross it whole; every long run is cut. */
const CUTS = [[0,.31],[.375,.655],[.72,1]];
function brokenSpan(pen, g, x0, y0, x1, y1, lw=3, cuts=CUTS){
  for (const [a,b] of cuts)
    pen.ink(()=>{ g.moveTo(lerp(x0,x1,a), lerp(y0,y1,a));
                  g.lineTo(lerp(x0,x1,b), lerp(y0,y1,b)); }, lw);
}
function centreline(g, x0, y0, x1, y1, u){
  g.save(); g.setLineDash([u*3.0, u*1.05, u*0.42, u*1.05]);
  g.strokeStyle = INK; g.lineWidth = 2.4; g.lineCap = "butt";
  g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.stroke();
  g.setLineDash([]); g.restore();
}
/* a dimension line broken in the middle so a numeral can sit in the gap */
function dimLine(g, x0, x1, y, tick=11){
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "butt";
  g.beginPath();
  g.moveTo(x0, y-tick); g.lineTo(x0, y+tick);
  g.moveTo(x1, y-tick); g.lineTo(x1, y+tick);
  const a = lerp(x0,x1,.40), b = lerp(x0,x1,.60);
  g.moveTo(x0, y); g.lineTo(a, y);
  g.moveTo(b, y); g.lineTo(x1, y);
  g.stroke();
  const head = (x, s)=>{ g.beginPath();
    g.moveTo(x, y); g.lineTo(x + s*tick*1.6, y - tick*0.42);
    g.lineTo(x + s*tick*1.6, y + tick*0.42); g.closePath();
    g.fillStyle = INK; g.fill(); };
  head(x0, 1); head(x1, -1);
  return (a+b)/2;
}
function streaks(g, x, y, len, n, gap, dir=-1){
  g.strokeStyle = "rgba(0,0,0,0.30)"; g.lineCap = "round";
  for (let i=0;i<n;i++){
    g.lineWidth = 5 - i*1.05;
    const yy = y + (i - (n-1)/2)*gap;
    g.beginPath(); g.moveTo(x, yy); g.lineTo(x + dir*len*(1 - i*0.17), yy); g.stroke();
  }
}
/* an open contact bracket: where a hand or a string takes the object */
function bracket(g, x, y, w, h, s=1){
  g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(x - w/2, y + s*h); g.lineTo(x - w/2, y);
  g.lineTo(x + w/2, y);       g.lineTo(x + w/2, y + s*h);
  g.stroke();
}

/* ---------------- THE ARROW, drawn along its own local +x axis ----------------
   Origin at the shaft's mid-length; nock at -L/2, point at +L/2. */
function drawArrow(pen, g, L){
  const H2 = L/2, th = Math.max(17, L*0.033), lw = Math.max(3.0, L*0.0060);

  // shaft: ONE light cane plane with a hard contour — never a black bar.
  // it must stay wide enough that paper prints down its middle.
  pen.paint(()=>{ g.rect(-H2*0.985, -th/2, H2*1.775, th); },
            toneSolid(inkLevel(params.cane)), lw);
  // grain: a single dark rule inside the lower edge rounds the cane
  g.fillStyle = inkLevel(params.grain);
  g.fillRect(-H2*0.930, th*0.19, H2*1.640, th*0.17);
  // binding collar behind the head
  pen.paint(()=>{ g.rect(H2*0.735, -th*0.72, H2*0.070, th*1.44); },
            toneSolid(inkLevel(params.collar)), lw*0.85);
  // barbed bronze head: long enough to read as a point, dark against the cane
  pen.paint(()=>{
    g.moveTo(H2*0.800, -th*0.40); g.lineTo(H2*0.838, -th*1.95);
    g.lineTo(H2*0.912, -th*0.66); g.lineTo(H2*1.000, 0);
    g.lineTo(H2*0.912,  th*0.66); g.lineTo(H2*0.838,  th*1.95);
    g.lineTo(H2*0.800,  th*0.40); g.closePath();
  }, toneSolid(inkLevel(params.bronze)), lw);
  // fletching: two vanes broadside, held clear of the shaft so both read
  const vane = s => pen.paint(()=>{
    g.moveTo(-H2*0.950, s*th*0.48); g.lineTo(-H2*0.885, s*th*2.30);
    g.lineTo(-H2*0.665, s*th*1.90); g.lineTo(-H2*0.610, s*th*0.48);
    g.closePath();
  }, toneSolid(inkLevel(params.feather)), lw*0.9);
  vane(-1); vane(1);
  // the third vane, seen edge-on: one ink line, not a filled bar
  g.strokeStyle = INK; g.lineWidth = Math.max(2, L*0.0045);
  g.beginPath(); g.moveTo(-H2*0.945, 0); g.lineTo(-H2*0.620, 0); g.stroke();
  // quill ticks — the binding of each vane to the cane
  for (const s of [-1,1]) for (const u of [0.905, 0.700]){
    g.beginPath(); g.moveTo(-H2*u, s*th*1.90);
    g.lineTo(-H2*(u-0.045), s*th*0.60); g.stroke();
  }
  // horn nock with a paper notch cut for the string
  pen.paint(()=>{ g.rect(-H2*1.018, -th*0.86, H2*0.080, th*1.72); },
            toneSolid(inkLevel(params.collar)), lw*0.85);
  pen.paint(()=>{
    g.moveTo(-H2*1.022, -th*0.42); g.lineTo(-H2*0.958, 0);
    g.lineTo(-H2*1.022,  th*0.42); g.closePath();
  }, toneSolid("#ffffff"), lw*0.7);
}

/* the same arrow at run scale: a silhouette that survives the dot lattice */
function drawArrowMini(pen, g, L){
  const H2 = L/2, th = Math.max(6, L*0.038), lw = Math.max(2.2, L*0.011);
  pen.paint(()=>{ g.rect(-H2*0.980, -th/2, H2*1.720, th); },
            toneSolid(inkLevel(params.cane)), lw);
  pen.paint(()=>{
    g.moveTo(H2*0.740, -th*0.45); g.lineTo(H2*0.800, -th*1.55);
    g.lineTo(H2*1.000, 0); g.lineTo(H2*0.800, th*1.55);
    g.lineTo(H2*0.740,  th*0.45); g.closePath();
  }, toneSolid(inkLevel(params.bronze)), lw*0.9);
  for (const s of [-1,1]) pen.paint(()=>{
    g.moveTo(-H2*0.965, s*th*0.45); g.lineTo(-H2*0.885, s*th*2.20);
    g.lineTo(-H2*0.660, s*th*1.75); g.lineTo(-H2*0.610, s*th*0.45);
    g.closePath();
  }, toneSolid(inkLevel(params.feather)), lw*0.8);
}
/* an earlier moment of the SAME arrow: hidden-line dashes, never a second object */
function ghostArrow(g, L){
  const H2 = L/2, th = Math.max(6, L*0.038);
  g.save();
  g.strokeStyle = INK; g.lineWidth = Math.max(2.4, L*0.013);
  g.setLineDash([L*0.055, L*0.045]); g.lineCap = "butt"; g.lineJoin = "miter";
  g.beginPath(); g.rect(-H2*0.980, -th/2, H2*1.720, th); g.stroke();
  g.beginPath();
  g.moveTo(H2*0.740, -th*0.45); g.lineTo(H2*0.800, -th*1.55);
  g.lineTo(H2*1.000, 0); g.lineTo(H2*0.800, th*1.55);
  g.lineTo(H2*0.740,  th*0.45); g.closePath(); g.stroke();
  g.setLineDash([]); g.restore();
}

/* ---------------- THE AXIS RUN: twelve socket apertures on one line ----------
   Recession is carried by radius alone so the twelve centres stay collinear —
   the whole claim of Book XXI is that one straight line exists through them. */
function runPoints(A){
  const P = [];
  for (let i=0;i<A.n;i++){
    const u = i/(A.n-1);
    P.push({ i, u,
      x: lerp(A.x0, A.x1, u), y: lerp(A.y0, A.y1, u),
      r: lerp(A.r0, A.r1, u), hr: lerp(A.r0, A.r1, u)*0.66 });
  }
  return P;
}
const runAt = (A, u) => ({ x: lerp(A.x0,A.x1,u), y: lerp(A.y0,A.y1,u) });
const runAngle = A => Math.atan2(A.y1-A.y0, A.x1-A.x0);

/* The apertures ONLY. The axe heads under them belong to prop.twelve-axe-heads;
   what this prop owns is the twelve holes and the line through them, so the
   row is drawn as bores and a trench and nothing else — anything more and the
   dot lattice turns the register into gravel. */
function socketRun(pen, g, A, trench=false){
  const P = runPoints(A);
  if (trench) brokenSpan(pen, g, A.x0 - A.r0*0.9, A.y0 + A.r0*1.85,
                                 A.x1 + A.r1*0.9, A.y1 + A.r1*1.85, 4);
  for (const p of P){
    pen.paint(()=>{ g.arc(p.x, p.y, p.r, 0, 7); },
              toneSolid(inkLevel(params.socketPlane)), 3.4);
    pen.paint(()=>{ g.arc(p.x, p.y, p.hr, 0, 7); }, toneSolid("#ffffff"), 2.8);
  }
  return P;
}
/* re-cut the ring contours over the shaft so the shaft reads as threaded
   THROUGH the bore rather than laid across the row. Only the rings the shaft
   is actually inside — restroking all twelve just doubles the ink. */
function restrokeRun(g, P, from=0){
  g.strokeStyle = INK; g.lineCap = "butt";
  for (const p of P){
    if (p.i < from) continue;
    g.lineWidth = 3.4; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.stroke();
    g.lineWidth = 2.8; g.beginPath(); g.arc(p.x, p.y, p.hr, 0, 7); g.stroke();
  }
}

/* ---------------- proof furniture ---------------- */
/* bore versus shaft, in section: the clearance the arrow had to keep */
function clearanceInset(pen, g, cx, cy, R){
  pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(1)), 4);
  const r = R*0.19;
  g.strokeStyle = INK; g.lineWidth = 2.2; g.lineCap = "butt";
  for (let i=0;i<8;i++){
    const a = i*Math.PI/4 + 0.19;
    g.beginPath();
    g.moveTo(cx + Math.cos(a)*r*1.75, cy + Math.sin(a)*r*1.75);
    g.lineTo(cx + Math.cos(a)*R*0.86, cy + Math.sin(a)*R*0.86);
    g.stroke();
  }
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(params.grain)), 3);
  // centre cross
  g.strokeStyle = INK; g.lineWidth = 2.2;
  g.beginPath();
  g.moveTo(cx - R*1.16, cy); g.lineTo(cx - R*0.86, cy);
  g.moveTo(cx + R*0.86, cy); g.lineTo(cx + R*1.16, cy);
  g.moveTo(cx, cy - R*1.16); g.lineTo(cx, cy - R*0.86);
  g.moveTo(cx, cy + R*0.86); g.lineTo(cx, cy + R*1.16);
  g.stroke();
}
/* the pass ledger: one cell per socket, struck when the shaft went clean */
function ledger(pen, g, x, y, cw, ch, cols, n, passed){
  for (let i=0;i<n;i++){
    const cx = x + (i%cols)*cw, cy = y + Math.floor(i/cols)*ch;
    pen.paint(()=>{ g.rect(cx, cy, cw, ch); }, toneSolid(inkLevel(1)), 3);
    if (i < passed){
      g.fillStyle = INK;
      g.fillRect(cx + cw*0.34, cy + ch*0.17, cw*0.20, ch*0.66);
    }
  }
}
/* the deviation ladder: twelve readings, every one of them on the baseline */
function deviationLadder(pen, g, x0, x1, y, n){
  brokenSpan(pen, g, x0, y, x1, y, 3.4);
  g.strokeStyle = INK; g.lineWidth = 3;
  for (let i=0;i<n;i++){
    const x = lerp(x0, x1, i/(n-1));
    g.beginPath(); g.moveTo(x, y - 9); g.lineTo(x, y + 9); g.stroke();
    g.beginPath(); g.arc(x, y, 4.2, 0, 7); g.fillStyle = INK; g.fill();
  }
}

/* ================= STATE RENDERERS ================= */

/* rest — the piece study. Canonical anchor frame: the shaft lies level,
   centred at (0.50, 0.42), nock at x=0.053, point at x=0.937. */
function drawRest(pen, g, W, H){
  const L = W*0.88, cx = W*0.50, cy = H*0.42;
  // declared scale, dimensioned above the piece
  const gx = dimLine(g, cx - L*0.508, cx + L*0.500, H*0.255, 12);
  segNumber(g, gx - W*0.062, H*0.185, 40, params.lengthMM);

  g.save(); g.translate(cx, cy); drawArrow(pen, g, L); g.restore();

  // four numbered callouts, each dropped straight from its own feature
  const H2 = L/2;
  const FEAT = [[-0.985, 1], [-0.790, 2], [0.100, 3], [0.930, 4]];
  FEAT.forEach(([u, d])=>{
    const fx = cx + H2*u;
    g.strokeStyle = INK; g.lineWidth = 2.6;
    g.beginPath(); g.arc(fx, cy + H*0.020, 5, 0, 7); g.fillStyle = INK; g.fill();
    g.beginPath(); g.moveTo(fx, cy + H*0.024); g.lineTo(fx, H*0.545); g.stroke();
    segDigit(g, fx - 10, H*0.556, 38, d);
  });

  // detail frame: the tail end at 2.6x, so nock and vanes survive the lattice
  const bx = W*0.075, by = H*0.665, bw = W*0.520, bh = H*0.245;
  g.save(); g.beginPath(); g.rect(bx, by, bw, bh); g.clip();
  g.save(); g.translate(bx + bw*0.050 + L*0.90, by + bh*0.50);
  drawArrow(pen, g, L*1.80); g.restore();
  g.restore();
  pen.ink(()=>{ g.rect(bx, by, bw, bh); }, 3.4);
  segDigit(g, bx + bw - 34, by + bh - 46, 36, 1);

  // shaft in section + the ownership tally (one owner, and he is holding it)
  clearanceInset(pen, g, W*0.775, H*0.760, W*0.082);
  segNumber(g, W*0.735, H*0.855, 34, params.shaftDia_mm);
  pen.paint(()=>{ g.rect(W*0.845, H*0.855, W*0.090, H*0.048); },
            toneSolid(inkLevel(1)), 3.4);
  g.fillStyle = INK; g.fillRect(W*0.885, H*0.866, W*0.011, H*0.026);
  pen.ink(()=>{ g.moveTo(W*0.855, H*0.896); g.lineTo(W*0.925, H*0.862); }, 4);
}

/* nocked — seated on the served string */
function drawNocked(pen, g, W, H){
  const sx = W*0.285, L = W*0.620, H2 = L/2;
  // the string: only as much of it as touches this prop
  pen.ink(()=>{ g.moveTo(sx, H*0.085); g.lineTo(sx, H*0.915); }, 5);
  pen.paint(()=>{ g.rect(sx - 7, H*0.395, 14, H*0.210); },
            toneSolid(inkLevel(params.collar)), 3);
  g.strokeStyle = INK; g.lineWidth = 2;
  for (let y = H*0.402; y < H*0.600; y += 11){
    g.beginPath(); g.moveTo(sx - 7, y); g.lineTo(sx + 7, y + 7); g.stroke();
  }
  g.save(); g.translate(sx + H2*1.015, H*0.500); drawArrow(pen, g, L); g.restore();
  // two fingers above the nock, one below: the Mediterranean loose
  bracket(g, sx, H*0.455, W*0.085, H*0.045, -1);
  bracket(g, sx, H*0.545, W*0.085, H*0.045,  1);

  // detail bubble: the notch on the served string, enlarged
  const bx = W*0.085, by = H*0.660, bw = W*0.500, bh = H*0.245;
  g.save(); g.beginPath(); g.rect(bx, by, bw, bh); g.clip();
  const dsx = bx + bw*0.30;
  pen.ink(()=>{ g.moveTo(dsx, by); g.lineTo(dsx, by + bh); }, 13);
  g.save(); g.translate(dsx + L*2.1*0.5090, by + bh*0.50);
  drawArrow(pen, g, L*2.1); g.restore();
  g.restore();
  pen.ink(()=>{ g.rect(bx, by, bw, bh); }, 3.4);
  g.strokeStyle = INK; g.lineWidth = 2.6;
  g.beginPath(); g.moveTo(sx, H*0.560); g.lineTo(bx + bw*0.30, by); g.stroke();
  segDigit(g, bx + bw - 34, by + bh - 46, 36, 1);
  segNumber(g, W*0.760, H*0.760, 40, params.sockets);
  ledger(pen, g, W*0.660, H*0.840, W*0.052, H*0.036, 6, 12, 0);
}

/* drawn — string and notch back together */
function drawDrawn(pen, g, W, H){
  const ax = W*0.170, ay = H*0.500, bx = W*0.660;
  pen.ink(()=>{ g.moveTo(bx, H*0.085); g.lineTo(ax, ay); g.lineTo(bx, H*0.915); }, 5);
  const L = W*0.760, H2 = L/2;
  g.save(); g.translate(ax + H2*1.015, ay); drawArrow(pen, g, L); g.restore();
  bracket(g, ax + 6, ay - H*0.028, W*0.070, H*0.042, -1);
  bracket(g, ax + 6, ay + H*0.028, W*0.070, H*0.042,  1);
  // draw length, dimensioned clear of the shaft
  const gx = dimLine(g, ax, bx, H*0.700, 12);
  segNumber(g, gx - W*0.058, H*0.628, 38, params.drawLen_mm);
  // the limbs are elsewhere; here only the load the shaft carries
  g.strokeStyle = "rgba(0,0,0,0.30)"; g.lineWidth = 5; g.lineCap = "round";
  for (const s of [-1,1]){
    g.beginPath();
    g.moveTo(W*0.300, ay + s*H*0.075); g.lineTo(W*0.430, ay + s*H*0.075); g.stroke();
    g.beginPath();
    g.moveTo(W*0.430, ay + s*H*0.075); g.lineTo(W*0.398, ay + s*H*0.056);
    g.lineTo(W*0.398, ay + s*H*0.094); g.closePath();
    g.fillStyle = "rgba(0,0,0,0.30)"; g.fill();
  }
  centreline(g, W*0.055, ay, W*0.960, ay, 18);
}

/* released — the archer's paradox: the shaft bends round the grip */
function drawReleased(pen, g, W, H){
  const bx = W*0.660, ay = H*0.500;
  // the string coming forward, three positions, the last of them the hard one
  const bulges = [[W*0.235, 3], [W*0.430, 4], [W*0.585, 0]];
  for (const [bxx, lvl] of bulges){
    if (lvl === 0){ pen.ink(()=>{ g.moveTo(bx, H*0.085);
      g.quadraticCurveTo(bxx, ay, bx, H*0.915); }, 5); }
    else {
      g.strokeStyle = inkLevel(lvl); g.lineWidth = 3.4; g.setLineDash([16,13]);
      g.beginPath(); g.moveTo(bx, H*0.085);
      g.quadraticCurveTo(bxx, ay, bx, H*0.915); g.stroke(); g.setLineDash([]);
    }
  }
  const L = W*0.560, H2 = L/2, nock = W*0.360;
  // the flexed ghosts of the same shaft, one either side of the true axis
  for (const s of [-1, 1]){
    g.save(); g.strokeStyle = inkLevel(6); g.lineWidth = 3.2;
    g.setLineDash([15, 12]); g.beginPath();
    for (let i=0;i<=24;i++){
      const u = i/24, x = nock + L*u;
      const y = ay + s*Math.sin(u*Math.PI)*H*0.028;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke(); g.setLineDash([]); g.restore();
  }
  g.save(); g.translate(nock + H2*1.015, ay); drawArrow(pen, g, L); g.restore();
  streaks(g, nock - W*0.030, ay, W*0.230, 5, H*0.024);
  centreline(g, W*0.050, ay, W*0.965, ay, 18);
}

/* place a copy of the arrow on the run so its POINT sits at parameter u */
function onRun(g, A, u, L, fn){
  const p = runAt(A, u), a = runAngle(A);
  g.save(); g.translate(p.x - Math.cos(a)*L/2, p.y - Math.sin(a)*L/2); g.rotate(a);
  fn(); g.restore();
}

/* the proof strip shared by flight and proof */
function proofStrip(pen, g, W, H, passed){
  clearanceInset(pen, g, W*0.170, H*0.848, W*0.096);
  g.strokeStyle = INK; g.lineWidth = 2.4;
  g.beginPath();
  g.moveTo(W*0.268, H*0.848); g.lineTo(W*0.310, H*0.848);
  g.moveTo(W*0.190, H*0.848); g.lineTo(W*0.310, H*0.795); g.stroke();
  segNumber(g, W*0.318, H*0.762, 34, params.boreDia_mm);
  segNumber(g, W*0.318, H*0.862, 34, params.shaftDia_mm);
  segNumber(g, W*0.560, H*0.775, 46, passed);
  ledger(pen, g, W*0.560, H*0.868, W*0.056, H*0.038, 6, params.sockets, passed);
}

/* flight — the axis run. THE CARD SIGNATURE. */
function drawFlight(pen, g, W, H, passed){
  // register 1 — the shaft itself, away and travelling
  const L1 = W*0.790;
  g.save(); g.translate(W*0.545, H*0.180); drawArrow(pen, g, L1); g.restore();
  streaks(g, W*0.140, H*0.180, W*0.092, 5, H*0.021);
  brokenSpan(pen, g, W*0.055, H*0.310, W*0.945, H*0.310, 2.6);

  // register 2 — twelve apertures, one line, and the shaft leaving the last
  const A = { x0:W*0.065, y0:H*0.580, x1:W*0.700, y1:H*0.450, r0:20, r1:11, n:params.sockets };
  const dist = Math.hypot(A.x1-A.x0, A.y1-A.y0), pitch = dist/(A.n-1);
  // the axis shows where nothing occludes it: before the first bore, past the last
  const cl = (u0, u1)=> centreline(g, lerp(A.x0,A.x1,u0), lerp(A.y0,A.y1,u0),
                                      lerp(A.x0,A.x1,u1), lerp(A.y0,A.y1,u1), 17);
  cl(-0.125, -0.020); cl(1.020, 1.420);
  const P = socketRun(pen, g, A);
  const Lm = pitch*4.4, ang = runAngle(A);
  const tail = runAt(A, 1.340 - Lm/dist);
  g.save(); g.translate(tail.x, tail.y); g.rotate(ang);
  streaks(g, -6, 0, Lm*0.34, 5, 11); g.restore();
  onRun(g, A, 1.340, Lm, ()=> drawArrowMini(pen, g, Lm));
  restrokeRun(g, P, 10);
  // the line was straight: twelve readings, all of them on it
  segDigit(g, W*0.072, H*0.628, 40, 0);
  deviationLadder(pen, g, W*0.150, W*0.560, H*0.648, params.sockets);
  brokenSpan(pen, g, W*0.055, H*0.706, W*0.945, H*0.706, 2.6);

  // register 3 — the proof
  proofStrip(pen, g, W, H, passed);
}

/* caught — buried in the far wall past the twelfth axe */
function drawCaught(pen, g, W, H){
  const face = W*0.600, ay = H*0.400, right = W*0.980;
  /* ashlar: five courses, joints deliberately staggered course to course and
     the block tones alternated, so no joint runs the height of the plate */
  const COURSES = [
    { y:0.088, h:0.112, cuts:[0, 0.34, 0.71, 1] },
    { y:0.200, h:0.116, cuts:[0, 0.19, 0.55, 1] },
    { y:0.316, h:0.110, cuts:[0, 0.41, 0.78, 1] },
    { y:0.426, h:0.118, cuts:[0, 0.26, 0.62, 1] },
    { y:0.544, h:0.134, cuts:[0, 0.37, 0.69, 1] },
  ];
  COURSES.forEach((c, ci)=>{
    for (let k=0;k<3;k++){
      const x0 = lerp(face, right, c.cuts[k]), x1 = lerp(face, right, c.cuts[k+1]);
      pen.paint(()=>{ g.rect(x0, H*c.y, x1-x0, H*c.h); },
                toneSolid(inkLevel((ci+k)%2 ? 1 : 2)), 3.4);
    }
  });

  const L = W*0.660, H2 = L/2, point = W*0.735, cx = point - H2;
  const th = Math.max(17, L*0.033);
  // the shaft still ringing: two positions of the same tail, before the arrow
  for (const s of [-1, 1]){
    g.save(); g.translate(face, ay); g.rotate(s*0.055);
    g.strokeStyle = INK; g.lineWidth = 3.6; g.setLineDash([17,13]);
    const tx = -(L - (point - face));
    g.beginPath(); g.moveTo(-th*0.5, 0); g.lineTo(tx, 0); g.stroke();
    for (const v of [-1,1]){
      g.beginPath(); g.moveTo(tx, v*th*0.45); g.lineTo(tx + L*0.048, v*th*2.30);
      g.lineTo(tx + L*0.185, v*th*0.55); g.stroke();
    }
    g.setLineDash([]); g.restore();
  }
  // what the room can see
  g.save(); g.beginPath(); g.rect(0, 0, face, H); g.clip();
  g.save(); g.translate(cx, ay); drawArrow(pen, g, L); g.restore();
  g.restore();
  // what the wall has: hidden line
  g.save(); g.strokeStyle = INK; g.lineWidth = 3.2; g.setLineDash([14,11]);
  g.beginPath(); g.rect(face, ay - th/2, point - face - th*1.6, th); g.stroke();
  g.beginPath();
  g.moveTo(point - th*2.0, ay - th*1.65); g.lineTo(point, ay);
  g.lineTo(point - th*2.0, ay + th*1.65); g.closePath(); g.stroke();
  g.setLineDash([]); g.restore();
  // impact
  g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "round";
  for (let i=0;i<7;i++){
    const a = -Math.PI/2 + i*Math.PI/6 + 0.13;
    if (Math.abs(Math.cos(a)) > 0.96) continue;
    g.beginPath();
    g.moveTo(face + Math.cos(a)*28, ay + Math.sin(a)*28);
    g.lineTo(face + Math.cos(a)*82, ay + Math.sin(a)*82); g.stroke();
  }
  // penetration, dimensioned clear of the masonry
  g.strokeStyle = INK; g.lineWidth = 2.4; g.setLineDash([9,8]);
  g.beginPath();
  g.moveTo(face,  H*0.690); g.lineTo(face,  H*0.752);
  g.moveTo(point, H*0.690); g.lineTo(point, H*0.752); g.stroke();
  g.setLineDash([]);
  const gx = dimLine(g, face, point, H*0.768, 11);
  segNumber(g, gx - W*0.056, H*0.800, 36, params.penetration_mm);
  // twelve behind it, and the shaft that made them
  segNumber(g, W*0.072, H*0.782, 44, params.sockets);
  ledger(pen, g, W*0.060, H*0.872, W*0.054, H*0.038, 6, params.sockets, params.sockets);
}

/* proof — the plate that says it happened */
function drawProof(pen, g, W, H, passed){
  // the axis, verified: twelve bores dead on one line, the shaft past the last
  const A = { x0:W*0.105, y0:H*0.215, x1:W*0.760, y1:H*0.215, r0:19, r1:19, n:params.sockets };
  const dist = A.x1 - A.x0, pitch = dist/(A.n-1);
  const cl = (u0,u1)=> centreline(g, lerp(A.x0,A.x1,u0), A.y0, lerp(A.x0,A.x1,u1), A.y0, 17);
  cl(-0.190, -0.030); cl(1.030, 1.360);
  const P = socketRun(pen, g, A);
  const Lm = pitch*4.2;
  onRun(g, A, 1.280, Lm, ()=> drawArrowMini(pen, g, Lm));
  restrokeRun(g, P, 10);

  // twelve readings, every one of them on the line
  segDigit(g, W*0.082, H*0.372, 48, 0);
  g.strokeStyle = INK; g.lineWidth = 2.4;
  g.beginPath(); g.moveTo(W*0.118, H*0.428); g.lineTo(W*0.172, H*0.402); g.stroke();
  deviationLadder(pen, g, W*0.190, W*0.840, H*0.402, params.sockets);

  // the object the plate is about
  g.save(); g.translate(W*0.505, H*0.560); drawArrow(pen, g, W*0.720); g.restore();
  brokenSpan(pen, g, W*0.055, H*0.690, W*0.945, H*0.690, 2.6);

  proofStrip(pen, g, W, H, passed);
}

const MODES = {
  rest: drawRest, nocked: drawNocked, drawn: drawDrawn, released: drawReleased,
  flight: drawFlight, caught: drawCaught, proof: drawProof,
};

export const asset = {
  id:"prop.axis-shot-arrow",
  type:"PROP",
  name:"Axis-shot Arrow",
  statusWord:"TRUE",
  scene:"OD-B21-S07",

  params,
  layers:["axis","trench","blades","sockets","ghosts","shaft","grain","vanes",
          "collar","head","nock","contours","dimensions","proof"],

  /* normalized 0..1 anchors, measured in the canonical REST frame:
     the shaft level, centred at (0.50, 0.42), nock 0.053 -> point 0.937 */
  anchors:{
    nock:{x:.053,y:.420},              // the notch the string seats in
    "grip:nock":{x:.104,y:.420},       // fingers that set it on the string
    grip:{x:.283,y:.420},              // carried between two fingers
    fletching:{x:.152,y:.420},
    balance:{x:.544,y:.420},           // centre of pressure, forward of centre
    shelf:{x:.560,y:.420},             // where it rides the bow's bridge
    collar:{x:.852,y:.420},
    point:{x:.937,y:.420},
    "contact:string":{x:.053,y:.420},
    "contact:socket":{x:.500,y:.420},  // the bore it must keep clear of
    "contact:wall":{x:.937,y:.420},    // the point that buries
  },
  collision:{ kind:"capsule", a:{x:.053,y:.420}, b:{x:.937,y:.420}, r:.013 },

  ownership:"odysseus",
  ownershipChain:["odysseus"],

  states:{
    initial:"rest",
    nodes:{
      rest:    { preview:{ mode:"rest",     status:"BARE",      progress:0.06, passed:0  } },
      nocked:  { preview:{ mode:"nocked",   status:"NOCKED",    progress:0.22, passed:0  } },
      drawn:   { preview:{ mode:"drawn",    status:"DRAWN",     progress:0.40, passed:0  } },
      released:{ preview:{ mode:"released", status:"LOOSED",    progress:0.56, passed:0  } },
      flight:  { preview:{ mode:"flight",   status:"IN FLIGHT", progress:0.78, passed:12 } },
      caught:  { preview:{ mode:"caught",   status:"STRUCK",    progress:0.92, passed:12 } },
      proof:   { preview:{ mode:"proof",    status:"TRUE",      progress:1.00, passed:12 } },
    },
    edges:[
      ["rest","nocked"],["nocked","drawn"],["drawn","released"],
      ["released","flight"],["flight","caught"],["caught","proof"],
      ["proof","rest"],["nocked","rest"],["drawn","nocked"],["caught","rest"],
    ],
  },
  channels:["mode","passed","u","flex","progress","t"],

  /* CARD SIGNATURE — FLIGHT: the shaft away at scale over the axis run,
     twelve apertures on one line with the same arrow ghosted at three
     moments of its passage, and the clearance and the tally beneath. */
  preview:()=>({ mode:"flight", status:"IN FLIGHT", progress:0.78, passed:12, t:0 }),

  draw(ctx, W, H, state){
    const pen = makePen(ctx, { outline:true });
    const st = state || {};
    const passed = Number.isFinite(st.passed) ? st.passed : params.sockets;
    (MODES[st.mode] || drawFlight)(pen, ctx, W, H, passed);
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
