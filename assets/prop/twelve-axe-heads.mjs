/* prop.twelve-axe-heads — the contest's measuring instrument.
   PROP asset. Book XXI: two maids carry in the chest of axes; Telemachus digs
   one long trench, plants the twelve heads in a line, "stamped the earth
   down round them" and trues them by eye. The point of this object is not
   twelve axes — it is ONE straight hole made of twelve holes. The prop is
   therefore built as an alignment instrument:

     · twelve iron heads, each individually addressable (index 0..11)
     · each carries a SOCKET — the helve bore — a clear paper aperture
     · the AIM CHANNEL is the line through the twelve socket centres.
       Trued, it is a single dashed axis. Untrued, it kinks head to head and
       the header count of true sockets falls short of twelve.
     · the arrow's proof is a STATE of this prop, not a separate drawing:
       the shaft runs in the channel and leaves past the twelfth socket.

   States:
     stored   — in the chest, twelve heads laid flat, no trench, no channel
     planted  — the row set in the earth, sockets not yet trued: channel kinks
     aligned  — every socket on one axis; the channel is a straight line
     struck   — the arrow away, through all twelve, exiting past the last
     removed  — heads drawn out; twelve empty slots and one head laid by

   Upper half is the piece itself at scale: one head in section with its bore,
   a bore-clearance diagram (socket vs. arrow diameter), a broken scale
   caliper and the planting-depth gauge. Lower half is the planted row plus a
   twelve-notch alignment ledger.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B21-S01. */
import { makePen, toneSolid, inkLevel, INK } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  count: 12,
  // declared scale (metres) — a planted head stands about a forearm high
  headHeight_m: 0.24, boreDiameter_m: 0.058, arrowDiameter_m: 0.011,
  pitch_m: 0.42, trenchDepth_m: 0.11, channelLength_m: 5.0,

  row:     { x0:0.050, x1:0.912, y:0.612, u:0.088 },   // u = head unit, fraction of H
  detail:  { cx:0.215, cy:0.242, u:0.184 },
  bore:    { cx:0.588, cy:0.238, r:0.098 },            // r as fraction of W
  caliper: { x0:0.404, x1:0.716, y:0.470 },
  gauge:   { x:0.868, y0:0.172, y1:0.452 },
  headY:0.056, headH:0.050,                            // seven-segment digit band
  ledgerY:0.848, ledgerH:0.032,
  divider:0.528,

  // ink levels — light planes, dark accents, plenty of paper
  plane:1, neck:2, bevel:3, socket:4, earth:5,
};

/* head-profile constants, in units of u, measured from the SOCKET CENTRE.
   FACE is the blade seen broad — the piece study. EDGE is the blade seen
   end-on, which is how a planted head stands to the shooter: a narrow slab
   carrying a wide socket. Twelve edge views leave the row full of paper. */
const P = {
  ringR:0.255, holeR:0.150,
  groundY:1.060,             // where the earth closes over the blade
  face:{ neckY:0.205, neckW:0.100, waistY:0.560, waistW:0.108,
         ctrlX:0.160, ctrlY:1.045, hornY:1.215, hornW:0.500, toeY:1.345 },
  edge:{ neckY:0.215, neckW:0.088, waistY:0.520, waistW:0.112,
         cheekY:0.930, cheekW:0.215, toeY:1.300, toeW:0.115 },
};

/* which sockets sit off the axis when the row is merely planted.
   Offsets in units of u; a zero means that head is already true. */
const JITTER = [0.10, 0, -0.07, 0.12, 0, 0.05, -0.10, 0, 0.08, 0, -0.04, 0.11];
const TRUE_COUNT = JITTER.filter(v => v === 0).length;

/* ---------------- seven-segment numerals (numbers as GEOMETRY) ---------------- */

const SEG_MAP = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc", 5:"afgcd",
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
  for (const s of (SEG_MAP[d] || "")){ const r = S[s]; g.fillRect(r[0], r[1], r[2], r[3]); }
  return w;
}
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits, "0");
  const w = h*0.56, gap = h*0.20;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w + gap; }
  return cx - gap - x;
}

/* ---------------- the head ---------------- */

/* the blade seen broad: neck -> shoulder -> cheek -> two horns and a
   crescent cutting edge between them */
function facePath(g, u){
  const F = P.face;
  g.moveTo(-F.neckW*u, F.neckY*u);
  g.lineTo( F.neckW*u, F.neckY*u);
  g.lineTo( F.waistW*u, F.waistY*u);
  g.quadraticCurveTo( F.ctrlX*u, F.ctrlY*u,  F.hornW*u, F.hornY*u);
  g.quadraticCurveTo(0, F.toeY*u, -F.hornW*u, F.hornY*u);
  g.quadraticCurveTo(-F.ctrlX*u, F.ctrlY*u, -F.waistW*u, F.waistY*u);
  g.closePath();
}
/* the blade seen end-on: a narrow tapering slab under a wide socket */
function edgePath(g, u){
  const E = P.edge;
  g.moveTo(-E.neckW*u, E.neckY*u);
  g.lineTo( E.neckW*u, E.neckY*u);
  g.lineTo( E.waistW*u, E.waistY*u);
  g.lineTo( E.cheekW*u, E.cheekY*u);
  g.lineTo( E.toeW*u,   E.toeY*u);
  g.lineTo(-E.toeW*u,   E.toeY*u);
  g.lineTo(-E.cheekW*u, E.cheekY*u);
  g.lineTo(-E.waistW*u, E.waistY*u);
  g.closePath();
}
function bladePath(g, u, view){ return view==="face" ? facePath(g,u) : edgePath(g,u); }

/* the socket: a light iron annulus with a CLEAR bore. The bore is paper —
   it is the hole the arrow is promised, and it must stay open. */
function socket(pen, g, u, level=params.socket){
  pen.paint(()=>{ g.arc(0, 0, P.ringR*u, 0, 7); }, toneSolid(inkLevel(level)), Math.max(2.2, u*0.030));
  pen.paint(()=>{ g.arc(0, 0, P.holeR*u, 0, 7); }, toneSolid(inkLevel(0)),     Math.max(2.0, u*0.026));
}

/* one axe head, drawn about its socket centre. */
function axeHead(pen, g, cx, cy, u, { tilt=0, view="edge", detail=false }={}){
  g.save(); g.translate(cx, cy); if (tilt) g.rotate(tilt);

  const lw = Math.max(2.4, u*0.034);
  pen.paint(()=>{ bladePath(g, u, view); }, toneSolid(inkLevel(params.plane)), lw);

  if (view === "face"){
    const F = P.face;
    // the bevel: a band following the cutting edge, not a bar
    pen.paint(()=>{
      g.moveTo( F.hornW*u, F.hornY*u);
      g.quadraticCurveTo(0, F.toeY*u, -F.hornW*u, F.hornY*u);
      g.quadraticCurveTo(0, (F.toeY-0.105)*u, F.hornW*u, (F.hornY-0.030)*u);
      g.closePath();
    }, toneSolid(inkLevel(params.bevel)), lw*0.70);
    if (detail){
      // the forging ridge, straight down the centre of the face
      pen.seam(()=>{ g.moveTo(0, (F.waistY+0.06)*u); g.lineTo(0, (F.hornY-0.14)*u); },
               Math.max(2, u*0.022));
    }
  }

  // the neck collar — a short seam, never a span
  const wY = view==="face" ? P.face.waistY : P.edge.waistY;
  const wW = view==="face" ? P.face.waistW : P.edge.waistW;
  pen.seam(()=>{ g.moveTo(-wW*u*1.02, wY*u*0.90); g.lineTo(wW*u*1.02, wY*u*0.90); },
           Math.max(2, u*0.026));

  socket(pen, g, u);
  g.restore();
}

/* the earth closing over one head — SHORT, per head, so the trench never
   becomes a bar across the frame */
function mound(pen, g, cx, yG, u, i, { open=false }={}){
  const w = u*0.42, h = u*0.115 + (i%3)*u*0.024;
  if (open){
    // the slot a lifted head leaves behind
    pen.paint(()=>{ g.rect(cx-w/2, yG, w, h); }, toneSolid(inkLevel(params.neck)), 2.6);
    pen.paint(()=>{ g.rect(cx-u*0.075, yG-h*0.30, u*0.150, h*1.10); }, toneSolid(inkLevel(7)), 2.2);
  } else {
    pen.paint(()=>{
      g.moveTo(cx-w/2, yG+h); g.lineTo(cx-w*0.36, yG);
      g.lineTo(cx+w*0.36, yG); g.lineTo(cx+w/2, yG+h); g.closePath();
    }, toneSolid(inkLevel(params.earth)), 2.6);
  }
}

/* a head that should be standing here and is not */
function ghost(g, cx, cy, u){
  g.save(); g.setLineDash([7,7]);
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineJoin = "round";
  g.beginPath(); g.rect(cx-u*0.220, cy-P.ringR*u*1.16,
                        u*0.440, (P.groundY+P.ringR*1.16)*u); g.stroke();
  g.setLineDash([]); g.restore();
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "round";
  g.beginPath(); g.arc(cx, cy, P.holeR*u, 0, 7); g.stroke();
}

/* ---------------- the row ---------------- */

function rowGeo(W, H){
  const R = params.row, u = H*R.u, x0 = W*R.x0, x1 = W*R.x1;
  const pitch = (x1-x0)/params.count;
  return { u, x0, x1, pitch, y:H*R.y, yG:H*R.y + P.groundY*u,
           xi: i => x0 + pitch*(i+0.5) };
}

/* the aim channel: dashes in the gaps BETWEEN sockets, plus a lead-in and a
   lead-out. Straight when trued; a visible kink when not. */
function channel(g, geo, ys){
  g.save(); g.setLineDash([8,7]);
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "butt";
  const r = P.ringR*geo.u;
  for (let i=0;i<params.count-1;i++){
    const ax = geo.xi(i)+r, bx = geo.xi(i+1)-r;
    g.beginPath(); g.moveTo(ax, ys[i]); g.lineTo(bx, ys[i+1]); g.stroke();
  }
  g.beginPath(); g.moveTo(geo.x0-geo.pitch*0.42, ys[0]); g.lineTo(geo.xi(0)-r, ys[0]); g.stroke();
  g.beginPath(); g.moveTo(geo.xi(11)+r, ys[11]); g.lineTo(geo.x1+geo.pitch*0.34, ys[11]); g.stroke();
  g.setLineDash([]); g.restore();
}

/* trueness marks: one tick per socket, riding at the socket's own height.
   Level when trued, ragged when not — the alignment reads at a glance. */
function trueMarks(pen, g, geo, ys){
  g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round";
  const top = geo.y - P.ringR*geo.u - geo.u*0.30;
  for (let i=0;i<params.count;i++){
    const x = geo.xi(i), y = ys[i] - P.ringR*geo.u - geo.u*0.14;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x, y-geo.u*0.16); g.stroke();
    if (ys[i] !== geo.y){        // an out-of-true socket gets a datum caret
      g.beginPath(); g.moveTo(x-geo.u*0.075, top); g.lineTo(x, top+geo.u*0.075);
      g.lineTo(x+geo.u*0.075, top); g.stroke();
    }
  }
  // the datum itself, shown only as short leads in the margins
  g.save(); g.setLineDash([5,6]); g.lineWidth = 2.4;
  g.beginPath(); g.moveTo(geo.x0-geo.pitch*0.44, top); g.lineTo(geo.x0-geo.pitch*0.06, top);
  g.moveTo(geo.x1+geo.pitch*0.06, top); g.lineTo(geo.x1+geo.pitch*0.44, top); g.stroke();
  g.setLineDash([]); g.restore();
}

/* motion streaks in the earlier gaps — the shot already gone through */
function streaks(g, geo, y){
  g.strokeStyle = "rgba(0,0,0,0.42)"; g.lineCap = "round";
  for (let i=0;i<6;i++){
    g.lineWidth = 3.0 + i*0.35;
    const x = geo.xi(i)+P.ringR*geo.u+2, len = geo.pitch*0.42;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x+len, y); g.stroke();
  }
}

/* the arrow: shaft in the channel over the last stretch, head clear of the
   twelfth socket, fletching back at the eighth */
function arrow(pen, g, geo, y){
  const r = P.ringR*geo.u;
  const x0 = geo.xi(6), x1 = geo.xi(11) + r + geo.pitch*0.52;
  pen.ink(()=>{ g.moveTo(x0, y); g.lineTo(x1-geo.u*0.24, y); }, 4.4);
  // head
  g.fillStyle = INK; g.beginPath();
  g.moveTo(x1, y); g.lineTo(x1-geo.u*0.26, y-geo.u*0.085);
  g.lineTo(x1-geo.u*0.26, y+geo.u*0.085); g.closePath(); g.fill();
  // fletching
  g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round";
  for (const s of [-1, 1]){
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x0+geo.u*0.18, y+s*geo.u*0.13); g.stroke();
    g.beginPath(); g.moveTo(x0+geo.u*0.13, y); g.lineTo(x0+geo.u*0.31, y+s*geo.u*0.13); g.stroke();
  }
}

/* where the shaft ends up: a small burst beyond the last head */
function exitMark(g, x, y, s){
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "round";
  for (let i=0;i<6;i++){
    const a = i/6*Math.PI*2 + 0.32;
    g.beginPath(); g.moveTo(x+Math.cos(a)*s*0.38, y+Math.sin(a)*s*0.38);
    g.lineTo(x+Math.cos(a)*s, y+Math.sin(a)*s); g.stroke();
  }
}

/* the chest: corner brackets and a broken lid, twelve heads laid flat */
function chest(pen, g, W, H, geo){
  const x0 = geo.x0 + geo.pitch*0.30, x1 = geo.x1 - geo.pitch*0.30;
  const yT = geo.y - geo.u*0.46, yB = geo.yG + geo.u*0.22;
  const lx = (x1-x0)*0.13, ly = (yB-yT)*0.26;
  g.strokeStyle = INK; g.lineWidth = 4.6; g.lineCap = "butt"; g.lineJoin = "miter";
  const corner = (cx, cy, sx, sy)=>{ g.beginPath();
    g.moveTo(cx+sx*lx, cy); g.lineTo(cx, cy); g.lineTo(cx, cy+sy*ly); g.stroke(); };
  corner(x0,yT, 1, 1); corner(x1,yT,-1, 1);
  corner(x0,yB, 1,-1); corner(x1,yB,-1,-1);
  // lid, thrown back: two short planes, never one span
  for (const [a,b] of [[0.06,0.34],[0.66,0.94]])
    pen.paint(()=>{ g.rect(x0+(x1-x0)*a, yT-geo.u*0.26, (x1-x0)*(b-a), geo.u*0.13); },
      toneSolid(inkLevel(params.neck)), 3);
  // twelve heads laid flat, two courses of six, alternating hand
  const u = geo.u*0.50, colW = (x1-x0)/6;
  for (let i=0;i<params.count;i++){
    const r = i<6 ? 0 : 1, c = i%6;
    const cx = x0 + colW*(c+0.5) + (r===0 ? -u*0.32 : u*0.32);
    const cy = yT + (yB-yT)*(r===0 ? 0.30 : 0.74);
    axeHead(pen, g, cx, cy, u, { tilt: r===0 ? -Math.PI/2 : Math.PI/2, view:"face" });
  }
}

/* ---------------- the upper diagrams ---------------- */

/* socket bore vs. arrow: the clearance that makes the shot possible */
function boreDiagram(pen, g, W, H, { shaft=false }={}){
  const B = params.bore, cx = W*B.cx, cy = H*B.cy, R = W*B.r;
  pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(params.bevel)), 4);
  pen.paint(()=>{ g.arc(cx, cy, R*0.560, 0, 7); }, toneSolid(inkLevel(0)), 3.4);
  // the arrow's own section, dead centre, with its clearance ring
  g.save(); g.setLineDash([4,5]);
  g.strokeStyle = INK; g.lineWidth = 2.4;
  g.beginPath(); g.arc(cx, cy, R*0.30, 0, 7); g.stroke();
  g.setLineDash([]); g.restore();
  pen.paint(()=>{ g.arc(cx, cy, R*0.115, 0, 7); }, toneSolid(inkLevel(7)), 2.4);
  // four clearance ticks, bore wall inward
  g.strokeStyle = INK; g.lineWidth = 2.8; g.lineCap = "butt";
  for (let i=0;i<4;i++){
    const a = i/4*Math.PI*2 + Math.PI/4;
    g.beginPath();
    g.moveTo(cx+Math.cos(a)*R*0.545, cy+Math.sin(a)*R*0.545);
    g.lineTo(cx+Math.cos(a)*R*0.335, cy+Math.sin(a)*R*0.335); g.stroke();
  }
  // the aim axis through the bore — broken either side
  g.save(); g.setLineDash([9,8]); g.strokeStyle = INK; g.lineWidth = 2.6;
  g.beginPath(); g.moveTo(cx-R*1.42, cy); g.lineTo(cx-R*0.60, cy);
  g.moveTo(cx+R*0.60, cy); g.lineTo(cx+R*1.42, cy); g.stroke();
  g.setLineDash([]); g.restore();
  if (shaft){
    pen.ink(()=>{ g.moveTo(cx-R*1.30, cy); g.lineTo(cx+R*1.30, cy); }, 4);
    g.fillStyle = INK; g.beginPath();
    g.moveTo(cx+R*1.52, cy); g.lineTo(cx+R*1.24, cy-R*0.13);
    g.lineTo(cx+R*1.24, cy+R*0.13); g.closePath(); g.fill();
  }
  return { cx, cy, R };
}

/* broken scale caliper — the declared size of one head */
function caliper(pen, g, W, H){
  const C = params.caliper, x0 = W*C.x0, x1 = W*C.x1, y = H*C.y, t = H*0.017;
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "butt";
  for (const x of [x0, x1]){ g.beginPath(); g.moveTo(x, y-t); g.lineTo(x, y+t); g.stroke(); }
  for (const [a,b] of [[0.02,0.28],[0.36,0.64],[0.72,0.98]]){
    g.beginPath(); g.moveTo(x0+(x1-x0)*a, y); g.lineTo(x0+(x1-x0)*b, y); g.stroke();
  }
  g.lineWidth = 2.6;
  for (const f of [0.32, 0.68]){ const x = x0+(x1-x0)*f;
    g.beginPath(); g.moveTo(x, y-t*0.55); g.lineTo(x, y+t*0.55); g.stroke(); }
}

/* planting-depth gauge: how far the blade goes under */
function depthGauge(pen, g, W, H){
  const G = params.gauge, x = W*G.x, y0 = H*G.y0, y1 = H*G.y1;
  g.save(); g.setLineDash([6,7]); g.strokeStyle = INK; g.lineWidth = 2.6;
  g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1-H*0.030); g.stroke();
  g.setLineDash([]); g.restore();
  g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "butt";
  for (const f of [0.0, 0.34, 0.68]){ const y = y0+(y1-y0)*f;
    g.beginPath(); g.moveTo(x-W*0.026, y); g.lineTo(x+W*0.026, y); g.stroke(); }
  g.fillStyle = INK; g.beginPath();
  g.moveTo(x, y1); g.lineTo(x-W*0.020, y1-H*0.026); g.lineTo(x+W*0.020, y1-H*0.026);
  g.closePath(); g.fill();
  // the ground the gauge measures to — a short rule, not a span
  pen.ink(()=>{ g.moveTo(x-W*0.052, y1); g.lineTo(x+W*0.052, y1); }, 4);
}

/* ---------------- header + ledger ---------------- */

function header(pen, g, W, H, plantedN, trueN){
  const dh = H*params.headH, dy = H*params.headY, cy = dy+dh/2;
  // a small axe mark on the left
  axeHead(pen, g, W*0.076, cy-dh*0.36, dh*0.80, { view:"face" });
  segNumber(g, W*0.140, dy, dh, plantedN, 2);
  // broken sight arrow between the two counts
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  for (const [a,b] of [[0.330,0.376],[0.404,0.450],[0.478,0.524]]){
    g.beginPath(); g.moveTo(W*a, cy); g.lineTo(W*b, cy); g.stroke(); }
  g.fillStyle = INK; g.beginPath();
  g.moveTo(W*0.584, cy); g.lineTo(W*0.542, cy-dh*0.26); g.lineTo(W*0.542, cy+dh*0.26);
  g.closePath(); g.fill();
  segNumber(g, W*0.706, dy, dh, trueN, 2);
  // the target mark on the right: a bore seen down the axis
  const kx = W*0.918, ks = dh*0.52;
  pen.paint(()=>{ g.arc(kx, cy, ks, 0, 7); }, toneSolid(inkLevel(params.socket)), 3.4);
  pen.paint(()=>{ g.arc(kx, cy, ks*0.50, 0, 7); }, toneSolid(inkLevel(0)), 2.6);
  g.fillStyle = INK; g.beginPath(); g.arc(kx, cy, ks*0.15, 0, 7); g.fill();
}

/* a broken rule dividing the piece study from the planted row */
function divider(pen, g, W, H){
  const y = H*params.divider;
  for (const [a,b] of [[0.052,0.24],[0.30,0.47],[0.53,0.70],[0.76,0.948]])
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 3.2);
}

/* the alignment ledger: one notch per head, in four groups of three */
function ledger(pen, g, W, H, marks){
  const y = H*params.ledgerY, hh = H*params.ledgerH;
  const gapW = W*0.030, span = W*0.882 - gapW*3, per = span/params.count;
  let x = W*0.059, idx = 0;
  for (let grp=0; grp<4; grp++){
    pen.ink(()=>{ g.moveTo(x+per*0.12, y+hh+H*0.014);
                  g.lineTo(x+per*3-per*0.12, y+hh+H*0.014); }, 2.6);
    for (let i=0;i<3;i++, idx++){
      const st = marks[idx], bw = per*0.66, bx = x+(per-bw)/2;
      if (st === "out"){
        g.save(); g.setLineDash([5,5]); g.strokeStyle = INK; g.lineWidth = 2.6;
        g.beginPath(); g.rect(bx, y, bw, hh); g.stroke(); g.setLineDash([]);
        g.lineWidth = 3.4; g.lineCap = "round"; g.beginPath();
        g.moveTo(bx+bw*0.18, y+hh*0.20); g.lineTo(bx+bw*0.82, y+hh*0.80);
        g.moveTo(bx+bw*0.82, y+hh*0.20); g.lineTo(bx+bw*0.18, y+hh*0.80); g.stroke();
        g.restore();
      } else if (st === "set"){
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(0)), 3);
        pen.paint(()=>{ g.rect(bx, y+hh*0.52, bw, hh*0.48); }, toneSolid(inkLevel(params.socket)), 2.4);
      } else if (st === "chest"){
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(0)), 3);
      } else {
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(5)), 3);
        if (st === "struck"){
          g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round"; g.lineJoin = "round";
          const s = hh*0.46, tx = bx+bw*0.26, ty = y+hh+H*0.030;
          g.beginPath(); g.moveTo(tx, ty-s*0.20); g.lineTo(tx+s*0.42, ty+s*0.30);
          g.lineTo(tx+s*1.05, ty-s*0.78); g.stroke();
        }
      }
      x += per;
    }
    x += gapW;
  }
}

/* ---------------- state table ---------------- */

const MODES = {
  stored:  { row:"chest", channel:false, kinked:false, arrow:false, trench:false,
             mark:"chest",  planted:0,  trueN:0 },
  planted: { row:"row",   channel:true,  kinked:true,  arrow:false, trench:true,
             mark:"set",    planted:12, trueN:TRUE_COUNT },
  aligned: { row:"row",   channel:true,  kinked:false, arrow:false, trench:true,
             mark:"true",   planted:12, trueN:12 },
  struck:  { row:"row",   channel:true,  kinked:false, arrow:true,  trench:true,
             mark:"struck", planted:12, trueN:12 },
  removed: { row:"ghost", channel:false, kinked:false, arrow:false, trench:true,
             mark:"out",    planted:0,  trueN:0 },
};

/* ---------------- the render ---------------- */

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const M = MODES[st.mode] || MODES.aligned;
  const geo = rowGeo(W, H);
  const ys = Array.from({length:params.count},
    (_, i) => geo.y + (M.kinked ? JITTER[i]*geo.u : 0));

  header(pen, g, W, H, M.planted, M.trueN);

  // ── the piece at scale ──
  const D = params.detail;
  axeHead(pen, g, W*D.cx, H*D.cy, H*D.u, { view:"face", detail:true });
  boreDiagram(pen, g, W, H, { shaft: M.arrow });
  caliper(pen, g, W, H);
  depthGauge(pen, g, W, H);
  divider(pen, g, W, H);

  // ── the row ──
  if (M.row === "chest"){
    chest(pen, g, W, H, geo);
  } else {
    for (let i=0;i<params.count;i++){
      const cx = geo.xi(i), cy = ys[i];
      if (M.row === "ghost"){
        ghost(g, cx, geo.y, geo.u);
      } else {
        axeHead(pen, g, cx, cy, geo.u, { tilt: M.kinked ? JITTER[i]*0.55 : 0 });
      }
      if (M.trench) mound(pen, g, cx, geo.yG, geo.u, i, { open: M.row === "ghost" });
    }
    if (M.channel){ channel(g, geo, ys); trueMarks(pen, g, geo, ys); }
    if (M.arrow){
      streaks(g, geo, geo.y);
      arrow(pen, g, geo, geo.y);
      exitMark(g, geo.x1 + geo.pitch*0.86, geo.y, geo.u*0.20);
    }
    if (M.row === "ghost"){
      // one head drawn out and laid by, at the head of the trench
      axeHead(pen, g, W*0.128, geo.yG + geo.u*0.64, geo.u*0.80,
              { tilt: -Math.PI/2, view:"face" });
    }
  }

  // ── the ledger ──
  ledger(pen, g, W, H, Array.from({length:params.count},
    (_, i) => (M.mark === "set" && JITTER[i] === 0) ? "true" : M.mark));
}

/* ---------------- the asset ---------------- */

export const asset = {
  id:"prop.twelve-axe-heads",
  type:"PROP",
  name:"Twelve Axe Heads",
  statusWord:"ALIGNED",
  scene:"OD-B21-S01",

  params,
  layers:["counts","piece-study","bore-clearance","caliper","depth-gauge","divider",
          "trench","heads","sockets","aim-channel","true-marks","arrow","ledger"],

  // normalized 0..1 anchors, measured in the ALIGNED state
  anchors:{
    "socket:01":     {x:.075, y:.618},   // the first bore — where the arrow enters
    "socket:06":     {x:.395, y:.618},
    "socket:12":     {x:.876, y:.618},   // the last bore — the proof
    "aim:entry":     {x:.018, y:.618},   // Odysseus's arrow point on the axis
    "aim:exit":      {x:.960, y:.618},   // where the shaft strikes beyond
    "channel:axis":  {x:.500, y:.618},   // the line the whole contest is about
    "plant:first":   {x:.075, y:.702},   // where a heel stamps the earth down
    "plant:last":    {x:.876, y:.702},
    "contact:floor": {x:.500, y:.712},
    "grip:head":     {x:.235, y:.198},   // a hand closing on one head at the socket
    "carry:chest":   {x:.500, y:.640},   // the balance point of the chest of axes
    "gauge:depth":   {x:.862, y:.432},
    "count:planted": {x:.180, y:.081},
    "count:true":    {x:.746, y:.081},
  },
  // collision: the trench footprint, first head to last
  collision:{ kind:"box", a:{x:.040, y:.585}, b:{x:.925, y:.730} },
  ownership:"house-of-odysseus · dug and set by Telemachus; carried in by two maids "
          + "from the storeroom chest; the twelve are counted, never divided",

  states:{
    initial:"stored",
    nodes:{
      stored:  { preview:{ mode:"stored",  status:"STORED",  progress:0.08 } },
      planted: { preview:{ mode:"planted", status:"PLANTED", progress:0.34 } },
      aligned: { preview:{ mode:"aligned", status:"ALIGNED", progress:0.62 } },
      struck:  { preview:{ mode:"struck",  status:"STRUCK",  progress:0.90 } },
      removed: { preview:{ mode:"removed", status:"REMOVED", progress:1.00 } },
    },
    edges:[
      ["stored","planted"],["planted","aligned"],["aligned","planted"],
      ["aligned","struck"],["struck","aligned"],["struck","removed"],
      ["aligned","removed"],["removed","stored"],["planted","stored"],
    ],
  },
  channels:["mode","alignment","socket","arrow","t","progress"],

  // CARD SIGNATURE — ALIGNED: twelve sockets on one axis, the channel a single
  // dashed line from the first bore to the last. The contest is now decidable.
  preview:()=>({ mode:"aligned", status:"ALIGNED", progress:0.62, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
