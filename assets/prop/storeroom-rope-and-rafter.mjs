/* prop.storeroom-rope-and-rafter — the store-chamber rope, and the beam it
   is thrown over. PROP asset. Book XXII: Melanthius is caught a second time
   in the arms-store with a helmet and a shield in his hands. Odysseus sends
   the swineherd and the cowherd after him — "bind his hands and feet behind
   him, cast a rope about him, and haul him up the pillar until he is close
   to the roof beams, so that he may hang there alive a long while."

   The object is therefore not decoration but a MACHINE with a duty cycle:
   a made-up cord, a bearing surface, a load, and a place to make fast.
   It is built as one:

     · the RAFTER — a tie beam of three timbers set at three different
       depths with real gaps of paper at the scarfs, packed with vertical
       blocks, so the head of the room never prints as a single stripe;
       the cord bears on the top arris of the middle run
     · the LASHING — a hogtie: wrist bight and ankle bight cinched together
       with three parallel turns and two frapping turns
     · the FALL — one part rove over the beam, the standing part plumb over
       the load, the hauling part running down to the pillar
     · the CLEAT — a two-horned belaying cleat on the pillar face; the cord
       is made fast with a round turn and two half hitches
     · the piece reads off two counts: TURNS made fast at the cleat, and
       RISE — the load's height off the floor in tenths of a metre.

   States:
     coiled     — the cord made up on the floor, nothing rove, beam bare
     tied       — the load bound and on the floor, cord rove over the beam
                  and hanging slack, nothing made fast
     hoist      — the fall taken in, the load off the floor and rising,
                  one turn holding at the cleat
     suspended  — the load close under the beam, plumb, clearance called out
                  and swinging; three turns at the cleat, tail hitched
     lowered    — the fall surged, the load brought back down under control
     punished   — the cord cast off and cut, the bindings struck off on the
                  floor, the beam bare again but chafed where the cord bore

   Upper band is the piece at scale: the hogtie, the bearing on the arris,
   and the belay. Below the broken rule is the store chamber in elevation.
   Bottom is the six-state ledger.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B22-S04. */
import { makePen, toneSolid, inkLevel, INK, lerp, clamp } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  parts: 1, turns: 3,
  // declared scale (metres / kilograms)
  rafterRise_m: 3.15, rafterSpan_m: 4.60, rafterDepth_m: 0.22,
  pillarWidth_m: 0.38, cleatLength_m: 0.34,
  ropeDiameter_m: 0.028, ropeLength_m: 9.40,
  loadMass_kg: 78, liftHeight_m: 2.40, clearance_m: 0.55,

  room:   { x0:0.070, x1:0.934, pillarX:0.104, pillarW:0.082,
            yBeam:0.404, beamH:0.028, yFloor:0.818, bearFrac:0.560 },
  study:  { cy:0.220, hog:0.168, bear:0.502, cleat:0.836, r:0.082 },
  caliper:{ x0:0.306, x1:0.702, y:0.332 },
  headY:0.040, headH:0.050,
  divider:0.376,
  ledgerY:0.848, ledgerH:0.034,

  // ink levels — light planes, dark accents, plenty of paper
  plank:1, joist:2, stone:1, rope:2, brace:2, load:1, band:4, iron:6,
};

const ORDER = ["coiled","tied","hoist","suspended","lowered","punished"];

/* ---------------- seven-segment numerals (numbers as GEOMETRY) ----------------
   Small type dissolves in the dot lattice, so every count on this card is
   drawn as bars, never as text. */

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

/* ---------------- cordage ----------------
   A made-up cord: hard contour, light core, short lay ticks across it so the
   twist reads. Never a flat black worm. */

function rope(pen, g, pts, { w=9, level=params.rope, lay=true }={}){
  if (pts.length < 2) return;
  const path = ()=>{ g.moveTo(pts[0].x, pts[0].y);
                     for (let i=1;i<pts.length;i++) g.lineTo(pts[i].x, pts[i].y); };
  pen.limb(path, toneSolid(inkLevel(level)), w);
  if (!lay) return;
  g.strokeStyle = INK; g.lineWidth = 2.0; g.lineCap = "butt";
  for (let i=2;i<pts.length-1;i+=4){
    const a = pts[i-1], b = pts[i+1];
    const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx,dy) || 1;
    const px = -dy/n*w*0.42, py = dx/n*w*0.42;
    g.beginPath();
    g.moveTo(pts[i].x-px*0.9 + dx/n*w*0.22, pts[i].y-py*0.9 + dy/n*w*0.22);
    g.lineTo(pts[i].x+px*0.9 - dx/n*w*0.22, pts[i].y+py*0.9 - dy/n*w*0.22);
    g.stroke();
  }
}

/* a run of cord from a to b, bowed perpendicular by `bow` (slack sags) */
function runPts(a, b, bow, n=14){
  const dx = b.x-a.x, dy = b.y-a.y, len = Math.hypot(dx,dy) || 1;
  const px = -dy/len, py = dx/len;
  const out = [];
  for (let i=0;i<=n;i++){
    const t = i/n, s = Math.sin(Math.PI*t);
    out.push({ x: lerp(a.x,b.x,t) + px*bow*s,
               y: lerp(a.y,b.y,t) + py*bow*s + s*Math.abs(bow)*0.40 });
  }
  return out;
}

/* a closed turn of cord — an ellipse, drawn as rope */
function turnLoop(pen, g, cx, cy, rx, ry, w, lay=false){
  const pts = [];
  for (let i=0;i<=30;i++){
    const a = i/30*Math.PI*2 - Math.PI/2;
    pts.push({ x: cx + Math.cos(a)*rx, y: cy + Math.sin(a)*ry });
  }
  rope(pen, g, pts, { w, lay });
}

/* frayed end: three splayed strands out of a cut */
function frayed(pen, g, x, y, dx, dy, s){
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "round";
  const n = Math.hypot(dx,dy)||1; dx/=n; dy/=n;
  const px = -dy, py = dx;
  for (const a of [-0.45, 0, 0.45]){
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x+dx*s*0.55 + px*a*s*0.35, y+dy*s*0.55 + py*a*s*0.35,
                       x+dx*s + px*a*s*1.15, y+dy*s + py*a*s*1.15);
    g.stroke();
  }
}

/* a coil of cord made up on the floor */
function coil(pen, g, cx, cy, R, w){
  for (let k=0;k<3;k++){
    const rr = R*(1 - k*0.26);
    turnLoop(pen, g, cx, cy, rr, rr*0.40, w, k===0);
  }
}

/* a heap: cord cast off, lying anyhow, in two cut lengths */
function heap(pen, g, cx, cy, R, w){
  for (const [o, ph] of [[-R*0.52, 0.0], [R*0.60, 1.7]]){
    const pts = [];
    for (let i=0;i<=22;i++){
      const t = i/22;
      pts.push({ x: cx + o + Math.sin(t*7.4+ph)*R*0.50,
                 y: cy - Math.sin(t*3.1+ph)*R*0.18 - t*3 });
    }
    rope(pen, g, pts, { w, lay:false });
    frayed(pen, g, pts[0].x, pts[0].y, -1, -0.35, 13);
    const e = pts[pts.length-1];
    frayed(pen, g, e.x, e.y, 1, -0.30, 13);
  }
}

/* ---------------- the store chamber ---------------- */

function roomGeo(W, H){
  const R = params.room;
  const xL = W*R.x0, xR = W*R.x1;
  const pilX = W*R.pillarX, pilW = W*R.pillarW;
  const yBeam = H*R.yBeam, beamH = H*R.beamH, yUnder = yBeam+beamH;
  const yFloor = H*R.yFloor;
  return { xL, xR, pilX, pilW, yBeam, beamH, yUnder, yFloor,
           bearX: xL + (xR-xL)*R.bearFrac, span:xR-xL, rise:yFloor-yUnder };
}

/* the tie beam: THREE timbers at THREE depths with paper gaps at the scarfs,
   packed with short vertical blocks. Neither the upper nor the lower edge
   runs the width of the frame. */
function rafter(pen, g, geo, chafe){
  const runs = [
    [0.000, 0.288,  0.46, 0.86],   // [x0f, x1f, dy (× beamH), depth (× beamH)]
    [0.336, 0.640, -0.34, 1.16],
    [0.690, 1.000,  0.16, 0.94],
  ];
  const seg = runs.map(([a,b,dy,dp])=>({
    x0: geo.xL+geo.span*a, x1: geo.xL+geo.span*b,
    y0: geo.yBeam + geo.beamH*dy, h: geo.beamH*dp }));
  for (const s of seg)
    pen.paint(()=>{ g.rect(s.x0, s.y0, s.x1-s.x0, s.h); },
      toneSolid(inkLevel(params.plank)), 3.2);
  // vertical packing blocks standing in each scarf gap — verticals, not spans
  for (let i=0;i<2;i++){
    const a = seg[i], b = seg[i+1];
    const cx = (a.x1 + b.x0)/2, bw = 15;
    const y0 = Math.min(a.y0, b.y0) - geo.beamH*0.30;
    const y1 = Math.max(a.y0+a.h, b.y0+b.h) + geo.beamH*0.30;
    pen.paint(()=>{ g.rect(cx-bw/2, y0, bw, y1-y0); },
      toneSolid(inkLevel(params.joist)), 2.6);
  }
  // corbels: the beam lands on short brackets, not on thin air
  for (const [x, d, s] of [[geo.xL, 1, seg[0]], [geo.xR, -1, seg[2]]]){
    const yb = s.y0 + s.h;
    pen.paint(()=>{
      g.moveTo(x, yb);
      g.lineTo(x + d*geo.span*0.058, yb);
      g.lineTo(x, yb + geo.beamH*1.35); g.closePath();
    }, toneSolid(inkLevel(params.joist)), 2.8);
  }
  // king post: a short vertical hung under the middle run
  const kp = seg[1], kx = kp.x0 + (kp.x1-kp.x0)*0.30;
  pen.paint(()=>{ g.rect(kx-9, kp.y0+kp.h, 18, geo.beamH*1.70); },
    toneSolid(inkLevel(params.joist)), 2.6);
  // chafe: where the cord has borne on the top arris
  if (chafe){
    g.strokeStyle = INK; g.lineWidth = 2.4; g.lineCap = "butt";
    for (let i=-3;i<=3;i++){
      g.beginPath();
      g.moveTo(geo.bearX + i*5.5, kp.y0-10);
      g.lineTo(geo.bearX + i*5.5, kp.y0-3);
      g.stroke();
    }
  }
  return seg;
}

/* one raking brace, on the far side of the bearing point so it never fights
   the fall */
function brace(pen, g, geo, seg){
  const a = { x: geo.xR - geo.span*0.055, y: geo.yUnder + geo.rise*0.235 };
  const b = { x: geo.xL + geo.span*0.760, y: seg[2].y0 + seg[2].h + 2 };
  pen.limb(()=>{ g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); },
           toneSolid(inkLevel(params.brace)), 8);
}

/* the pillar: four courses of masonry with paper mortar between them */
function pillar(pen, g, geo){
  const n = 4, h = geo.rise, ch = (h - (n-1)*5)/n;
  for (let i=0;i<n;i++){
    const y = geo.yUnder + i*(ch+5);
    pen.paint(()=>{ g.rect(geo.pilX, y, geo.pilW, ch); },
      toneSolid(inkLevel(i%2 ? params.stone : 0)), 3.0);
    const jx = geo.pilX + geo.pilW*((i%2) ? 0.62 : 0.36);
    pen.seam(()=>{ g.moveTo(jx, y+ch*0.20); g.lineTo(jx, y+ch*0.80); }, 2.2);
  }
  // capital: a short block wider than the shaft
  pen.paint(()=>{ g.rect(geo.pilX - geo.pilW*0.18, geo.yUnder - geo.beamH*0.28,
                         geo.pilW*1.36, geo.beamH*0.62); },
    toneSolid(inkLevel(params.joist)), 2.8);
}

/* the back wall: a few very short course marks, right of the working area
   only, so the middle of the frame stays paper */
function wall(pen, g, geo){
  const rows = [[0.66,0.74,0.20],[0.78,0.88,0.34],[0.62,0.70,0.50],[0.80,0.90,0.64]];
  for (const [a,b,v] of rows){
    const y = geo.yUnder + geo.rise*v;
    pen.seam(()=>{ g.moveTo(geo.xL+geo.span*a, y); g.lineTo(geo.xL+geo.span*b, y); }, 2.2);
  }
}

/* the store door, shut: a tall opening — vertical, so it cuts nothing */
function door(pen, g, geo){
  const x0 = geo.xL + geo.span*0.855, w = geo.span*0.118;
  const yT = geo.yUnder + geo.rise*0.352, h = geo.yFloor - yT;
  pen.paint(()=>{ g.rect(x0, yT, w, h); }, toneSolid(inkLevel(0)), 3.2);
  pen.paint(()=>{ g.rect(x0 - w*0.16, yT - geo.beamH*0.56, w*1.32, geo.beamH*0.56); },
    toneSolid(inkLevel(params.joist)), 2.8);
  for (const f of [0.36, 0.68])
    pen.seam(()=>{ g.moveTo(x0+w*f, yT+7); g.lineTo(x0+w*f, geo.yFloor-5); }, 2.0);
  // one short ledge, over two boards only
  pen.paint(()=>{ g.rect(x0 + w*0.05, yT + h*0.44, w*0.60, h*0.062); },
    toneSolid(inkLevel(params.joist)), 2.4);
  // the ring pull
  pen.paint(()=>{ g.arc(x0 + w*0.82, yT + h*0.52, 9, 0, 7); },
    toneSolid(inkLevel(params.iron)), 2.6);
  pen.paint(()=>{ g.arc(x0 + w*0.82, yT + h*0.52, 4.6, 0, 7); },
    toneSolid(inkLevel(0)), 2.0);
}

/* the arms Melanthius came for, standing on the floor of the store — a
   boss'd shield leaning on the wall and a helm beside it. No rack, no
   shelf: nothing here runs across the frame. */
function storedArms(pen, g, geo){
  const y = geo.yFloor, r = geo.span*0.062;
  // the shield, leaning back a little
  const sx = geo.xL + geo.span*0.705;
  g.save(); g.translate(sx, y - r*0.94); g.rotate(-0.13);
  pen.paint(()=>{ g.ellipse(0, 0, r*0.82, r, 0, 0, 7); }, toneSolid(inkLevel(0)), 3.4);
  pen.paint(()=>{ g.ellipse(0, 0, r*0.50, r*0.62, 0, 0, 7); },
    toneSolid(inkLevel(params.stone)), 2.6);
  pen.paint(()=>{ g.arc(0, 0, r*0.20, 0, 7); }, toneSolid(inkLevel(params.iron)), 2.4);
  g.restore();
  // the helm: a dome with a nasal and a short crest stem
  const hx = geo.xL + geo.span*0.815;
  pen.paint(()=>{ g.arc(hx, y - 2, r*0.60, Math.PI, 0); },
    toneSolid(inkLevel(params.stone)), 3.2);
  pen.paint(()=>{ g.rect(hx - r*0.62, y - 12, r*1.24, 10); },
    toneSolid(inkLevel(params.joist)), 2.6);
  pen.seam(()=>{ g.moveTo(hx, y - r*0.60 - 2); g.lineTo(hx, y - r*1.12); }, 3.2);
}

/* the floor — three short hatch runs, never a span */
function floor(pen, g, geo){
  const y = geo.yFloor;
  for (const [a,b] of [[geo.xL-12, geo.pilX+geo.pilW+18],
                       [geo.bearX-92, geo.bearX+66],
                       [geo.xR-geo.span*0.185, geo.xR+12]]){
    pen.ink(()=>{ g.moveTo(a, y); g.lineTo(b, y); }, 4.6);
    g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "butt";
    for (let x=a+8; x<b-5; x+=15){
      g.beginPath(); g.moveTo(x, y+3); g.lineTo(x-8, y+15); g.stroke();
    }
  }
}

/* ---------------- the load ----------------
   The bound load, drawn as the tackle handles it: a trussed bundle, taller
   than it is wide, in a two-legged bridle. Light plane, dark straps. */

function loadGeo(geo, lift, H){
  const h = H*0.112, w = h*0.58;
  const topTravel = geo.yUnder + 112 + h;         // highest the base can come
  const base = lerp(geo.yFloor - 3, topTravel, clamp(lift, 0, 1));
  return { x: geo.bearX + 12, y0: base - h, y1: base, w, h,
           ring: base - h - h*0.36 };
}

function load(pen, g, L){
  const x0 = L.x - L.w/2, x1 = L.x + L.w/2, c = L.w*0.22;
  pen.paint(()=>{
    g.moveTo(x0+c, L.y0); g.lineTo(x1-c, L.y0); g.lineTo(x1, L.y0+c);
    g.lineTo(x1, L.y1-c); g.lineTo(x1-c, L.y1); g.lineTo(x0+c, L.y1);
    g.lineTo(x0, L.y1-c); g.lineTo(x0, L.y0+c); g.closePath();
  }, toneSolid(inkLevel(params.load)), 3.4);
  // three lashing straps — the bindings — with their cinch knots staggered
  const vs = [0.22, 0.52, 0.82];
  for (let i=0;i<vs.length;i++){
    const y = lerp(L.y0, L.y1, vs[i]);
    pen.paint(()=>{ g.rect(x0-4, y-L.h*0.036, L.w+8, L.h*0.072); },
      toneSolid(inkLevel(params.band)), 2.4);
    const kx = L.x + (i===1 ? -L.w*0.26 : L.w*0.28);
    pen.paint(()=>{ g.rect(kx-7, y-L.h*0.062, 14, L.h*0.124); },
      toneSolid(inkLevel(params.rope)), 2.2);
  }
  // the two-legged bridle up to the ring
  const ring = { x: L.x, y: L.ring };
  for (const s of [-1, 1])
    pen.limb(()=>{ g.moveTo(L.x + s*L.w*0.40, L.y0+3); g.lineTo(ring.x, ring.y); },
             toneSolid(inkLevel(params.rope)), 8);
  pen.paint(()=>{ g.arc(ring.x, ring.y, 12, 0, 7); }, toneSolid(inkLevel(params.iron)), 2.8);
  pen.paint(()=>{ g.arc(ring.x, ring.y, 6.2, 0, 7); }, toneSolid(inkLevel(0)), 2.2);
  return ring;
}

/* ---------------- the cord at work ---------------- */

/* one part rove over the top arris of the middle timber */
function beamTurn(pen, g, geo, yTop, yBot, w){
  const r = 14;
  const pts = [
    { x: geo.bearX + r, y: yBot + 34 },
    { x: geo.bearX + r, y: yTop + 5 },
    { x: geo.bearX + r - 5, y: yTop - 3 },
    { x: geo.bearX - r + 5, y: yTop - 3 },
    { x: geo.bearX - r, y: yTop + 5 },
    { x: geo.bearX - r, y: yBot + 34 },
  ];
  rope(pen, g, pts, { w, lay:false });
  return { standing:{ x: geo.bearX + r, y: yBot + 34 },
           fall:{ x: geo.bearX - r, y: yBot + 34 } };
}

/* the belaying cleat: a two-horned block on the pillar face */
function cleatGeo(geo){
  return { x: geo.pilX + geo.pilW + 5, y: geo.yUnder + geo.rise*0.505, l: 46, t: 11 };
}
function cleat(pen, g, C){
  pen.paint(()=>{ g.rect(C.x, C.y - C.t/2, C.l, C.t); },
    toneSolid(inkLevel(params.iron)), 2.6);
  pen.paint(()=>{ g.rect(C.x+3, C.y - C.t*1.65, 11, C.t*1.15); },
    toneSolid(inkLevel(params.iron)), 2.2);
  pen.paint(()=>{ g.rect(C.x+C.l-14, C.y + C.t*0.50, 11, C.t*1.15); },
    toneSolid(inkLevel(params.iron)), 2.2);
  pen.seam(()=>{ g.moveTo(C.x, C.y); g.lineTo(C.x-10, C.y); }, 3.4);
}
/* turns taken over the cleat, then the tail hanging */
function belay(pen, g, C, n, w){
  if (n <= 0) return;
  for (let k=0;k<n;k++){
    const f = 0.18 + k*0.30;
    turnLoop(pen, g, C.x + C.l*f, C.y, C.l*0.14, C.t*1.70, w*0.70);
  }
  const tail = [];
  for (let i=0;i<=12;i++){
    const t = i/12;
    tail.push({ x: C.x + C.l*1.02 + Math.sin(t*2.2)*11, y: C.y + C.t*1.6 + t*46 });
  }
  rope(pen, g, tail, { w:w*0.82 });
  const e = tail[tail.length-1];
  frayed(pen, g, e.x, e.y, 0.3, 1, 12);
}

/* which way the fall is being worked: short broken arrows beside the cord */
function haulArrows(pen, g, a, b, dir){
  const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx,dy)||1;
  const ux = dx/n, uy = dy/n, px = -uy*24, py = ux*24;
  for (const f of [0.34, 0.62]){
    const cx = a.x + dx*f + px, cy = a.y + dy*f + py;
    g.strokeStyle = INK; g.lineWidth = 4.2; g.lineCap = "butt";
    for (const [s,e] of [[-18,4],[14,32]]){
      g.beginPath();
      g.moveTo(cx + ux*dir*s, cy + uy*dir*s);
      g.lineTo(cx + ux*dir*e, cy + uy*dir*e);
      g.stroke();
    }
    const tx = cx + ux*dir*40, ty = cy + uy*dir*40;
    g.fillStyle = INK; g.beginPath();
    g.moveTo(tx + ux*dir*12, ty + uy*dir*12);
    g.lineTo(tx - py*0.36, ty + px*0.36);
    g.lineTo(tx + py*0.36, ty - px*0.36);
    g.closePath(); g.fill();
  }
}

/* the clearance under a suspended load, called out as a broken dimension */
function clearanceDim(pen, g, x, y0, y1){
  g.strokeStyle = INK; g.lineWidth = 4.0; g.lineCap = "butt";
  g.save(); g.setLineDash([12,9]);
  g.beginPath(); g.moveTo(x, y0+12); g.lineTo(x, y1-12); g.stroke();
  g.setLineDash([]); g.restore();
  g.fillStyle = INK;
  for (const [y, d] of [[y0, 1], [y1, -1]]){
    g.beginPath(); g.moveTo(x, y + d*5); g.lineTo(x-10, y + d*24); g.lineTo(x+10, y + d*24);
    g.closePath(); g.fill();
  }
  g.strokeStyle = INK; g.lineWidth = 3.6;
  for (const y of [y0, y1]){ g.beginPath(); g.moveTo(x-17, y); g.lineTo(x+17, y); g.stroke(); }
}

/* the load is swinging: two short arcs either side of the plumb */
function swing(pen, g, cx, cy, r){
  g.strokeStyle = INK; g.lineWidth = 2.8; g.lineCap = "round";
  for (const k of [0, 1]){
    const rr = r + 15*k;
    g.beginPath(); g.arc(cx, cy, rr, 1.16, 1.40); g.stroke();
    g.beginPath(); g.arc(cx, cy, rr, 1.74, 1.98); g.stroke();
  }
}

/* the rise, dimensioned up the left margin — vertical, so it never stripes */
function riseDim(pen, g, geo, W){
  const x = geo.xL - W*0.022;
  g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "butt";
  for (const y of [geo.yUnder, geo.yFloor]){
    g.beginPath(); g.moveTo(x-11, y); g.lineTo(x+11, y); g.stroke();
  }
  g.lineWidth = 2.8;
  for (const [a,b] of [[0.03,0.28],[0.38,0.62],[0.72,0.97]]){
    g.beginPath();
    g.moveTo(x, geo.yUnder + geo.rise*a); g.lineTo(x, geo.yUnder + geo.rise*b);
    g.stroke();
  }
  g.lineWidth = 2.4;
  for (const f of [0.33, 0.67]){
    const y = geo.yUnder + geo.rise*f;
    g.beginPath(); g.moveTo(x-6, y); g.lineTo(x+6, y); g.stroke();
  }
}

/* ---------------- the upper studies ---------------- */

/* the hogtie: wrist bight and ankle bight, three cinching turns between
   them, two frapping turns squeezing the cinch */
function hogtieStudy(pen, g, W, H){
  const S = params.study, cx = W*S.hog, cy = H*S.cy, R = W*S.r, w = 8;
  const dxr = R*1.00;
  for (const s of [-1, 1])
    turnLoop(pen, g, cx + s*dxr, cy + s*R*0.30, R*0.38, R*0.28, w);
  // three cinching turns, ring to ring
  for (const o of [-10, 0, 10])
    rope(pen, g, runPts({ x:cx-dxr+R*0.34, y:cy-R*0.30+o },
                        { x:cx+dxr-R*0.34, y:cy+R*0.30+o }, 0, 10),
         { w:w*0.80, lay:false });
  // two frapping turns across the cinch
  for (const dx of [-16, 16])
    turnLoop(pen, g, cx+dx, cy, 9, R*0.40, w*0.66);
  // the tail that becomes the fall
  rope(pen, g, runPts({ x:cx+12, y:cy-R*0.36 }, { x:cx+R*0.42, y:cy-R*1.42 }, 7, 10),
       { w:w*0.85 });
}

/* the bearing: the timber in section, the cord over its top arris, standing
   part plumb and hauling part raking off, and the friction that holds it */
function bearStudy(pen, g, W, H){
  const S = params.study, cx = W*S.bear, cy = H*S.cy, R = W*S.r, w = 8;
  const bx0 = cx - R*0.62, bx1 = cx + R*0.86, by0 = cy - R*0.26, by1 = cy + R*0.86;
  pen.paint(()=>{ g.rect(bx0, by0, bx1-bx0, by1-by0); },
    toneSolid(inkLevel(params.plank)), 3.4);
  pen.seam(()=>{ g.moveTo(bx0, by1-R*0.24); g.lineTo(bx1, by1-R*0.24); }, 2.0);
  // the cord: plumb on the right, over the top, raking away to the left
  rope(pen, g, [{ x:cx+R*0.52, y:cy+R*1.62 }, { x:cx+R*0.52, y:by0+6 },
                { x:cx+R*0.42, y:by0-4 }, { x:cx-R*0.42, y:by0-4 },
                { x:cx-R*0.54, y:by0+7 }, { x:cx-R*1.36, y:cy+R*1.30 }],
       { w, lay:false });
  // friction ticks radiating from the loaded arris
  g.strokeStyle = INK; g.lineWidth = 2.4; g.lineCap = "butt";
  for (let i=0;i<5;i++){
    const a = -Math.PI*0.96 + i*Math.PI*0.14;
    const ax = cx - R*0.50, ay = by0 - 2;
    g.beginPath();
    g.moveTo(ax + Math.cos(a)*R*0.26, ay + Math.sin(a)*R*0.26);
    g.lineTo(ax + Math.cos(a)*R*0.50, ay + Math.sin(a)*R*0.50);
    g.stroke();
  }
  // the included angle of the two parts, dashed
  g.save(); g.setLineDash([7,7]); g.strokeStyle = INK; g.lineWidth = 2.2;
  g.beginPath(); g.arc(cx, by0-4, R*1.00, Math.PI*0.30, Math.PI*0.74); g.stroke();
  g.setLineDash([]); g.restore();
}

/* the belay: round turn and two half hitches on the cleat */
function cleatStudy(pen, g, W, H){
  const S = params.study, cx = W*S.cleat, cy = H*S.cy, R = W*S.r, w = 7;
  // the cleat: a long shank and two staggered horns
  pen.paint(()=>{ g.rect(cx-R*1.00, cy-R*0.15, R*2.00, R*0.30); },
    toneSolid(inkLevel(params.iron)), 2.8);
  pen.paint(()=>{ g.rect(cx-R*0.94, cy-R*0.58, R*0.36, R*0.44); },
    toneSolid(inkLevel(params.iron)), 2.4);
  pen.paint(()=>{ g.rect(cx+R*0.58, cy+R*0.14, R*0.36, R*0.44); },
    toneSolid(inkLevel(params.iron)), 2.4);
  // the standing part in from the upper left
  rope(pen, g, runPts({ x:cx-R*1.86, y:cy-R*1.34 }, { x:cx-R*0.66, y:cy-R*0.38 }, 6, 10), { w });
  // the round turn
  turnLoop(pen, g, cx-R*0.52, cy, R*0.22, R*0.48, w);
  // two half hitches, clearly two
  turnLoop(pen, g, cx+R*0.04, cy, R*0.15, R*0.40, w*0.76);
  turnLoop(pen, g, cx+R*0.50, cy, R*0.15, R*0.40, w*0.76);
  // the tail out
  const tail = runPts({ x:cx+R*0.86, y:cy+R*0.30 }, { x:cx+R*1.34, y:cy+R*1.36 }, -8, 10);
  rope(pen, g, tail, { w:w*0.85 });
  const e = tail[tail.length-1];
  frayed(pen, g, e.x, e.y, 0.35, 1, 11);
}

/* broken scale caliper — the made length of the cord */
function caliper(pen, g, W, H){
  const C = params.caliper, x0 = W*C.x0, x1 = W*C.x1, y = H*C.y, t = H*0.016;
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "butt";
  for (const x of [x0, x1]){ g.beginPath(); g.moveTo(x, y-t); g.lineTo(x, y+t); g.stroke(); }
  for (const [a,b] of [[0.02,0.28],[0.36,0.60],[0.68,0.98]]){
    g.beginPath(); g.moveTo(x0+(x1-x0)*a, y); g.lineTo(x0+(x1-x0)*b, y); g.stroke();
  }
  g.lineWidth = 2.6;
  for (const f of [0.32, 0.64]){ const x = x0+(x1-x0)*f;
    g.beginPath(); g.moveTo(x, y-t*0.55); g.lineTo(x, y+t*0.55); g.stroke(); }
}

function divider(pen, g, W, H){
  const y = H*params.divider;
  for (const [a,b] of [[0.052,0.24],[0.30,0.47],[0.53,0.70],[0.76,0.948]])
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 3.2);
}

/* ---------------- header ---------------- */

/* the mark: a short beam, the cord over it, the load hanging one side */
function rafterGlyph(pen, g, x, cy, s, rove){
  pen.paint(()=>{ g.rect(x-s*0.66, cy-s*0.58, s*1.32, s*0.32); },
    toneSolid(inkLevel(params.plank)), 2.4);
  g.strokeStyle = INK; g.lineWidth = 5.5; g.lineCap = "butt";
  if (rove){
    g.beginPath(); g.moveTo(x-s*0.30, cy-s*0.24); g.lineTo(x-s*0.30, cy+s*0.20); g.stroke();
    g.beginPath(); g.moveTo(x+s*0.30, cy-s*0.24); g.lineTo(x+s*0.30, cy+s*0.34); g.stroke();
    g.fillStyle = INK;
    g.fillRect(x+s*0.12, cy+s*0.34, s*0.36, s*0.30);
  } else {
    g.beginPath(); g.moveTo(x-s*0.50, cy+s*0.46); g.lineTo(x-s*0.06, cy+s*0.46); g.stroke();
    g.beginPath(); g.moveTo(x+s*0.14, cy+s*0.46); g.lineTo(x+s*0.50, cy+s*0.46); g.stroke();
  }
}

function header(pen, g, W, H, M){
  const dh = H*params.headH, dy = H*params.headY, cy = dy+dh/2;
  rafterGlyph(pen, g, W*0.082, cy, dh*0.90, M.rove);
  segNumber(g, W*0.152, dy, dh, M.turns, 2);

  // the cord mark: three solid runs when the fall is taut, gapped when slack
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  const runs = M.taut ? [[0.330,0.404],[0.416,0.490],[0.502,0.576]]
                      : [[0.330,0.358],[0.446,0.474],[0.548,0.576]];
  for (const [a,b] of runs){ g.beginPath(); g.moveTo(W*a, cy); g.lineTo(W*b, cy); g.stroke(); }

  segNumber(g, W*0.640, dy, dh, M.rise, 2);

  // the load mark: a becket — filled when the cord carries, X'd when cast off
  const kx = W*0.905, ks = dh*0.50;
  pen.paint(()=>{ g.arc(kx, cy, ks, 0, 7); },
    toneSolid(inkLevel(M.load ? params.iron : params.joist)), 3.4);
  pen.paint(()=>{ g.arc(kx, cy, ks*0.48, 0, 7); }, toneSolid(inkLevel(0)), 2.6);
  if (M.cut){
    g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "round";
    g.beginPath();
    g.moveTo(kx-ks*1.05, cy-ks*1.05); g.lineTo(kx+ks*1.05, cy+ks*1.05);
    g.moveTo(kx+ks*1.05, cy-ks*1.05); g.lineTo(kx-ks*1.05, cy+ks*1.05); g.stroke();
  }
}

/* six-state ledger, in three groups of two */
function ledger(pen, g, W, H, idx, isCut){
  const y = H*params.ledgerY, hh = H*params.ledgerH;
  const gapW = W*0.032, span = W*0.876 - gapW*2, per = span/6;
  let x = W*0.062, i = 0;
  for (let grp=0; grp<3; grp++){
    pen.ink(()=>{ g.moveTo(x+per*0.14, y+hh+H*0.014);
                  g.lineTo(x+per*2-per*0.14, y+hh+H*0.014); }, 2.6);
    for (let c=0;c<2;c++, i++){
      const bw = per*0.62, bx = x+(per-bw)/2;
      if (i < idx){
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(0)), 3);
        pen.paint(()=>{ g.rect(bx, y+hh*0.56, bw, hh*0.44); }, toneSolid(inkLevel(params.brace)), 2.4);
      } else if (i === idx){
        pen.paint(()=>{ g.rect(bx, y, bw, hh); }, toneSolid(inkLevel(5)), 3);
        g.strokeStyle = INK; g.lineWidth = 3.2; g.lineCap = "round"; g.lineJoin = "round";
        if (isCut){
          g.beginPath();
          g.moveTo(bx+bw*0.22, y-H*0.026); g.lineTo(bx+bw*0.78, y-H*0.008);
          g.moveTo(bx+bw*0.78, y-H*0.026); g.lineTo(bx+bw*0.22, y-H*0.008); g.stroke();
        } else {
          const s = hh*0.50, tx = bx+bw*0.22, ty = y-H*0.012;
          g.beginPath(); g.moveTo(tx, ty-s*0.24); g.lineTo(tx+s*0.44, ty+s*0.30);
          g.lineTo(tx+s*1.08, ty-s*0.80); g.stroke();
        }
      } else {
        g.save(); g.setLineDash([5,5]); g.strokeStyle = INK; g.lineWidth = 2.6;
        g.beginPath(); g.rect(bx, y, bw, hh); g.stroke();
        g.setLineDash([]); g.restore();
      }
      x += per;
    }
    x += gapW;
  }
}

/* ---------------- state table ---------------- */

const MODES = {
  coiled:    { lift:null, taut:false, rove:false, belay:0, coil:true,  pile:false,
               load:false, cut:false, haul:0,  rise:0,  turns:0, clear:false,
               sway:false, chafe:false },
  tied:      { lift:0.00, taut:false, rove:true,  belay:0, coil:true,  pile:false,
               load:true,  cut:false, haul:0,  rise:0,  turns:0, clear:false,
               sway:false, chafe:false },
  hoist:     { lift:0.46, taut:true,  rove:true,  belay:1, coil:false, pile:false,
               load:true,  cut:false, haul:1,  rise:12, turns:1, clear:false,
               sway:false, chafe:true },
  suspended: { lift:0.95, taut:true,  rove:true,  belay:3, coil:false, pile:false,
               load:true,  cut:false, haul:0,  rise:24, turns:3, clear:true,
               sway:true,  chafe:true },
  lowered:   { lift:0.18, taut:true,  rove:true,  belay:1, coil:false, pile:false,
               load:true,  cut:false, haul:-1, rise:5,  turns:1, clear:false,
               sway:false, chafe:true },
  punished:  { lift:null, taut:false, rove:false, belay:0, coil:false, pile:true,
               load:false, cut:true,  haul:0,  rise:0,  turns:0, clear:false,
               sway:false, chafe:true },
};

/* ---------------- the render ---------------- */

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key = MODES[st.mode] ? st.mode : "suspended";
  const M = MODES[key];
  const geo = roomGeo(W, H);
  const w = 9;

  header(pen, g, W, H, M);

  // ── the piece at scale ──
  hogtieStudy(pen, g, W, H);
  bearStudy(pen, g, W, H);
  cleatStudy(pen, g, W, H);
  caliper(pen, g, W, H);
  divider(pen, g, W, H);

  // ── the chamber ──
  wall(pen, g, geo);
  floor(pen, g, geo);
  door(pen, g, geo);
  storedArms(pen, g, geo);
  const seg = rafter(pen, g, geo, M.chafe);
  brace(pen, g, geo, seg);
  pillar(pen, g, geo);
  riseDim(pen, g, geo, W);

  const C = cleatGeo(geo);
  cleat(pen, g, C);

  // ── the load ──
  let ring = null, L = null;
  if (M.load){
    L = loadGeo(geo, M.lift, H);
    ring = load(pen, g, L);
  }

  // ── the cord ──
  if (M.rove){
    const T = beamTurn(pen, g, geo, seg[1].y0, seg[1].y0 + seg[1].h, w);
    if (ring) rope(pen, g, runPts(T.standing, ring, M.taut ? 0 : 19), { w });
    const end = M.belay > 0 ? { x: C.x + C.l*0.42, y: C.y }
                            : { x: geo.pilX + geo.pilW + 40, y: geo.yFloor - 28 };
    rope(pen, g, runPts(T.fall, end, M.taut ? 2 : 28), { w });
    if (M.haul !== 0) haulArrows(pen, g, T.fall, end, M.haul);
    belay(pen, g, C, M.belay, w);
  }

  // ── what the state calls out ──
  if (L && M.clear){
    clearanceDim(pen, g, L.x - L.w*1.30, L.y1, geo.yFloor);
    swing(pen, g, geo.bearX, seg[1].y0, (L.y1 - seg[1].y0) + 22);
  }
  if (M.coil) coil(pen, g, geo.pilX + geo.pilW*2.2, geo.yFloor - 14, 34, w*0.85);
  if (M.pile) heap(pen, g, geo.pilX + geo.pilW*2.7, geo.yFloor - 12, 46, w*0.85);
  if (M.cut){
    // the struck-off bindings lying where they were cut away
    const bx = geo.bearX + 8, by = geo.yFloor - 17;
    for (const [dx, r] of [[-32, 21], [24, 15]])
      turnLoop(pen, g, bx+dx, by, r, r*0.34, w*0.78);
    frayed(pen, g, bx+44, by-5, 1, -0.5, 15);
  }

  ledger(pen, g, W, H, ORDER.indexOf(key), key === "punished");
}

/* ---------------- the asset ---------------- */

export const asset = {
  id:"prop.storeroom-rope-and-rafter",
  type:"PROP",
  name:"Storeroom Rope and Rafter",
  statusWord:"SUSPENDED",
  scene:"OD-B22-S04",

  params,
  layers:["counts","hogtie-study","bearing-study","cleat-study","caliper","divider",
          "wall","floor","door","stored-arms","rafter","brace","pillar","rise-dim",
          "cleat","load","bridle","beam-turn","standing-part","fall","belay",
          "haul-arrows","clearance","swing","coil","ledger"],

  // normalized 0..1 anchors, measured in the SUSPENDED state
  anchors:{
    "support:rafter":     {x:.554, y:.394},   // the arris the cord bears on
    "support:pillar-cap": {x:.145, y:.432},
    "grip:fall":          {x:.377, y:.545},   // both hands on the hauling part
    "grip:fall-low":      {x:.300, y:.585},
    "grip:tail":          {x:.245, y:.680},   // the end made fast, then hitched
    "grip:standing":      {x:.571, y:.495},
    "grip:bridle-ring":   {x:.571, y:.526},   // the ring the bindings gather to
    "belay:cleat":        {x:.223, y:.625},
    "hitch:knot":         {x:.245, y:.625},
    "bind:wrists":        {x:.530, y:.591},   // where the hogtie takes the arms
    "bind:ankles":        {x:.600, y:.658},
    "cut:point":          {x:.470, y:.505},   // where a blade would take the fall
    "carry:coil":         {x:.230, y:.799},
    "contact:floor":      {x:.571, y:.818},
    "contact:load-base":  {x:.571, y:.678},
    "clearance:plumb":    {x:.459, y:.747},
    "threshold:door":     {x:.823, y:.806},
    "camera:below":       {x:.571, y:.755},
    "camera:beam":        {x:.554, y:.450},
    "count:turns":        {x:.186, y:.065},
    "count:rise":         {x:.674, y:.065},
  },
  // collision: the working envelope — pillar face to bearing point, beam to floor
  collision:{ kind:"box", a:{x:.104, y:.404}, b:{x:.680, y:.822} },
  ownership:"house-of-odysseus · the arms-store off the megaron: a made-up "
          + "cord and the tie beam above it. Rove and worked by Eumaeus and "
          + "Philoetius on Odysseus's order to hoist the bound Melanthius up "
          + "the pillar until he hangs close under the roof beams",

  states:{
    initial:"coiled",
    nodes:{
      coiled:    { preview:{ mode:"coiled",    status:"COILED",    progress:0.05 } },
      tied:      { preview:{ mode:"tied",      status:"TIED",      progress:0.24 } },
      hoist:     { preview:{ mode:"hoist",     status:"HOISTING",  progress:0.46 } },
      suspended: { preview:{ mode:"suspended", status:"SUSPENDED", progress:0.72 } },
      lowered:   { preview:{ mode:"lowered",   status:"LOWERED",   progress:0.88 } },
      punished:  { preview:{ mode:"punished",  status:"CAST OFF",  progress:1.00 } },
    },
    edges:[
      ["coiled","tied"],["tied","hoist"],["hoist","suspended"],["suspended","hoist"],
      ["suspended","lowered"],["lowered","hoist"],["lowered","punished"],
      ["punished","coiled"],["tied","coiled"],
    ],
  },
  channels:["mode","lift","turns","rise","taut","haul","t","progress"],

  // CARD SIGNATURE — SUSPENDED: one part rove over the tie beam, the load
  // plumb and clear of the floor, three turns made fast at the pillar cleat.
  preview:()=>({ mode:"suspended", status:"SUSPENDED", progress:0.72, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
