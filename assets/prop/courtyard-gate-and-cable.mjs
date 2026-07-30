/* prop.courtyard-gate-and-cable — the outer court is closed from the inside.
   PROP asset. Book XXI: while Eurycleia locks the women in, Philoetius slips
   out to the well-fenced yard, swings the double gate to, drops the bar, and
   lashes the two leaves together with a ship's cable of papyrus he finds
   lying under the colonnade. Then he goes back in and sits down again.

   The object is not scenery. It is the closing of the only way out, and the
   whole drama of Book XXII depends on whether it holds. So the prop is built
   as a fastening instrument:

     · TWO LEAVES, each independently addressable, hung on pier pintles
     · a BAR of two scarfed timbers dropping into a socket cut in each pier
     · a CABLE — laid papyrus hawser — run as a lashing of parallel passes
       between the two leaf rings, wrapped at each ring, frapped at the middle
       and finished with a hitch round the bar
     · the SEAL reads off two counts: cable turns made, and the gap standing
       open at the meeting stile. Sealed is turns 06 / gap 00.

   States:
     open      — both leaves swung back, bar out and leaning by, cable coiled
     closed    — leaves shut, meeting stile met, bar dropped in its sockets
     cabled    — six turns run ring to ring, frapped and hitched to the bar
     tested    — pulled against from both sides: the lashing goes taut, the
                 stile shows two fingers of strain, and it holds
     cut       — the cable severed at mid-span, both ends sprung and frayed
     reopened  — leaves swung back again, bar drawn, the cut cable in two
                 lengths on the ground

   Upper band is the piece at scale: the cable in section (three laid strands
   round a paper heart), the ring hitch, and the bar entering its pier socket.
   Lower two-thirds is the gate in elevation. Bottom is the six-state ledger.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine's
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: OD-B21-S06. */
import { makePen, toneSolid, inkLevel, INK, lerp, clamp } from "../../engine/halfworld-engine.mjs";

/* ---------------- declared parameters ---------------- */

const params = {
  leaves: 2, turns: 4,
  // declared scale (metres)
  gateHeight_m: 2.35, leafWidth_m: 1.05, pierWidth_m: 0.42,
  barLength_m: 2.40, barThickness_m: 0.11,
  cableDiameter_m: 0.055, cableLength_m: 7.2, socketDepth_m: 0.16,

  gate:   { x0:0.135, x1:0.865, pw:0.072, yLintel:0.428, lintelH:0.034, yGround:0.800 },
  study:  { cy:0.235, cable:0.190, hitch:0.500, socket:0.815, r:0.082 },
  caliper:{ x0:0.318, x1:0.690, y:0.352 },
  headY:0.042, headH:0.050,
  divider:0.392,
  ledgerY:0.848, ledgerH:0.034,

  // ink levels — light planes, dark accents, plenty of paper
  plank:1, rail:2, stone:1, cable:2, brace:2, stile:3, earth:4, iron:6,
};

const ORDER = ["open","closed","cabled","tested","cut","reopened"];

/* ---------------- seven-segment numerals (numbers as GEOMETRY) ---------------- */

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
function segNumber(g, x, y, h, value, digits=2){
  const str = String(Math.max(0, value|0)).padStart(digits, "0");
  const w = h*0.56, gap = h*0.20;
  let cx = x;
  for (const ch of str){ segDigit(g, cx, y, h, +ch); cx += w + gap; }
  return cx - gap - x;
}

/* ---------------- rope ----------------
   A laid cable: hard contour, light core, and short lay ticks across it so
   the twist reads. Never a flat black worm. */
function rope(pen, g, pts, { w=10, level=params.cable, lay=true }={}){
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

/* frayed end: three splayed strands out of a cut */
function frayed(pen, g, x, y, dir, s){
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "round";
  for (const a of [-0.42, 0, 0.42]){
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x+dir*s*0.55, y+a*s*0.55, x+dir*s, y+a*s*1.25);
    g.stroke();
  }
}

/* the lashing: figure-of-eight passes ring to ring — each turn crosses the
   last, which is what makes it bite. Returned as separate passes so the
   cut state can sever them individually. */
function eightPasses(RL, RR, n, off, r){
  const out = [];
  for (let k=0;k<n/2;k++){
    const o = (k - (n/2-1)/2)*off;
    out.push({ a:{ x:RL.x+r*0.57, y:RL.y-r*0.82+o }, b:{ x:RR.x-r*0.57, y:RR.y+r*0.82+o } });
    out.push({ a:{ x:RL.x+r*0.57, y:RL.y+r*0.82+o }, b:{ x:RR.x-r*0.57, y:RR.y-r*0.82+o } });
  }
  return out;
}
function passPts(p, sag, t0=0, t1=1){
  const pts = [];
  for (let i=0;i<=12;i++){
    const t = lerp(t0, t1, i/12);
    pts.push({ x: lerp(p.a.x,p.b.x,t),
               y: lerp(p.a.y,p.b.y,t) + Math.sin(Math.PI*t)*sag });
  }
  return pts;
}
/* the turn taken round a ring before the cable crosses back */
function ringWrap(pen, g, C, r, dir, w){
  const pts = [];
  for (let i=0;i<=16;i++){
    const th = dir*(Math.PI*0.62) + i/16*dir*Math.PI*0.76;
    pts.push({ x: C.x + Math.cos(th)*r*1.24, y: C.y + Math.sin(th)*r*1.24 });
  }
  rope(pen, g, pts, { w:w*0.8, lay:false });
}

/* the hitch onto the bar, and the tail left hanging */
function hitch(pen, g, x, ybar, th, w){
  for (const dx of [-9, 9]){
    const pts = [];
    for (let i=0;i<=24;i++){
      const a = i/24*Math.PI*2 - Math.PI/2;
      pts.push({ x: x+dx + Math.cos(a)*7.5, y: ybar + Math.sin(a)*(th*0.62+5) });
    }
    rope(pen, g, pts, { w:w*0.70, lay:false });
  }
  const tail = [];
  for (let i=0;i<=14;i++){
    const t = i/14;
    tail.push({ x: x+9 + Math.sin(t*2.4)*13 + t*10, y: ybar + th*0.6 + t*54 });
  }
  rope(pen, g, tail, { w:w*0.82 });
  frayed(pen, g, tail[tail.length-1].x, tail[tail.length-1].y, 0.4, 12);
}

/* a coil of cable lying by the pier foot */
function coil(pen, g, cx, cy, R, w){
  for (let k=0;k<3;k++){
    const rr = R*(1 - k*0.24), pts = [];
    for (let i=0;i<=30;i++){
      const a = i/30*Math.PI*2 - Math.PI*0.5;
      pts.push({ x: cx + Math.cos(a)*rr, y: cy + Math.sin(a)*rr*0.40 });
    }
    rope(pen, g, pts, { w, lay:k===0 });
  }
}

/* ---------------- the gate ---------------- */

function gateGeo(W, H){
  const G = params.gate;
  const x0 = W*G.x0, x1 = W*G.x1, pw = W*G.pw;
  const yL = H*G.yLintel, lh = H*G.lintelH, yT = yL+lh, yG = H*G.yGround;
  const ox0 = x0+pw, ox1 = x1-pw;
  return { x0, x1, pw, yL, lh, yT, yG, ox0, ox1, cx:(ox0+ox1)/2,
           leafW:(ox1-ox0)/2, leafH:yG-yT };
}

/* lintel: two short beams over the ends and a gap of paper between them, so
   the head of the gate never prints as one span */
function lintel(pen, g, geo){
  const span = geo.x1-geo.x0;
  for (const [a,b] of [[0.00,0.36],[0.44,0.62],[0.70,1.00]]){
    pen.paint(()=>{ g.rect(geo.x0+span*a, geo.yL, span*(b-a), geo.lh); },
      toneSolid(inkLevel(params.plank)), 3.0);
  }
  // corbels: short brackets standing on the piers
  for (const s of [0,1]){
    const x = s ? geo.x1-geo.pw*0.80 : geo.x0+geo.pw*0.14;
    pen.paint(()=>{ g.rect(x, geo.yL+geo.lh, geo.pw*0.66, geo.lh*0.46); },
      toneSolid(inkLevel(params.rail)), 2.8);
  }
}

/* a pier: five courses of masonry with paper mortar between them */
function pier(pen, g, geo, side, barIn){
  const x = side<0 ? geo.x0 : geo.x1-geo.pw;
  const yT = geo.yL+geo.lh, h = geo.yG-yT, n = 5, ch = (h - (n-1)*4)/n;
  for (let i=0;i<n;i++){
    const y = yT + i*(ch+4);
    pen.paint(()=>{ g.rect(x, y, geo.pw, ch); },
      toneSolid(inkLevel(i%2 ? params.stone : 0)), 3.0);
    // one short vertical joint per course, staggered
    const jx = x + geo.pw*((i%2) ? 0.62 : 0.38);
    pen.seam(()=>{ g.moveTo(jx, y+ch*0.16); g.lineTo(jx, y+ch*0.84); }, 2.2);
  }
  // the socket cut for the bar
  const sy = yT + h*0.60, sw = geo.pw*0.62, sh = h*0.062;
  const sx = side<0 ? x+geo.pw-sw : x;
  if (barIn){
    pen.paint(()=>{ g.rect(sx, sy-sh/2, sw, sh); }, toneSolid(inkLevel(0)), 3);
  } else {
    g.save(); g.setLineDash([5,5]); g.strokeStyle = INK; g.lineWidth = 2.6;
    g.beginPath(); g.rect(sx, sy-sh/2, sw, sh); g.stroke();
    g.setLineDash([]); g.restore();
  }
  return { sx, sy, sw, sh };
}

/* one leaf, built of separate boards with paper between them.
   open: 0 = shut, 1 = swung back against the pier.
   Returns a local (t,v) mapper so rings and hardware ride with the leaf. */
function leaf(pen, g, geo, side, open){
  const dir = side<0 ? 1 : -1;
  const hx  = side<0 ? geo.ox0 + 4*dir : geo.ox1 + 4*dir;   // a reveal off the pier
  const w   = geo.leafW*(1 - 0.72*open) - 6;
  const ins = open*16;
  const pt = (t,v)=>({ x: hx + dir*w*t,
                       y: lerp(geo.yT + 6 + ins*t, geo.yG - 3 - ins*0.45*t, v) });

  // one panel, then boards read as alternating planes — rhythm without ink
  pen.paint(()=>{
    const a=pt(0,0), b=pt(1,0), c=pt(1,1), d=pt(0,1);
    g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y); g.closePath();
  }, toneSolid(inkLevel(0)), 3.2);
  const nB = Math.max(3, Math.round(w/30));
  for (let i=0;i<nB;i++){
    if (i % 2) continue;
    const t0 = i/nB, t1 = (i+1)/nB;
    pen.fillPath(()=>{
      const a=pt(t0,0), b=pt(t1,0), c=pt(t1,1), d=pt(t0,1);
      g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y); g.closePath();
    }, inkLevel(params.plank));
  }
  for (let i=1;i<nB;i++){
    const a = pt(i/nB,0), b = pt(i/nB,1);
    pen.seam(()=>{ g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); }, 1.8);
  }
  // two ledges, SHORT and at different heights on each leaf, so the two
  // never line up into one bar across the gate
  const ledges = side<0 ? [[0.06,0.62,0.150,0.222],[0.30,0.94,0.792,0.864]]
                        : [[0.06,0.62,0.232,0.304],[0.30,0.94,0.700,0.772]];
  for (const [t0,t1,v0,v1] of ledges){
    pen.paint(()=>{
      const a=pt(t0,v0), b=pt(t1,v0), c=pt(t1,v1), d=pt(t0,v1);
      g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y); g.closePath();
    }, toneSolid(inkLevel(params.rail)), 2.8);
  }
  // one brace per leaf, both leaning the SAME way — no symmetric tepee
  const b0 = side<0 ? pt(0.10,0.845) : pt(0.90,0.845);
  const b1 = side<0 ? pt(0.88,0.235) : pt(0.14,0.235);
  pen.limb(()=>{ g.moveTo(b0.x,b0.y); g.lineTo(b1.x,b1.y); },
           toneSolid(inkLevel(params.brace)), 6);

  // pintles on the hinge edge
  for (const v of [0.10, 0.87]){
    const p = pt(0.0, v);
    pen.paint(()=>{ g.rect(p.x - (dir<0?0:11), p.y-5.5, 11, 11); },
      toneSolid(inkLevel(params.iron)), 2.4);
  }
  return pt;
}

/* the ring on a leaf: iron annulus, paper eye */
function ring(pen, g, c, r, { hole=0.54, level=params.iron }={}){
  pen.paint(()=>{ g.arc(c.x, c.y, r, 0, 7); }, toneSolid(inkLevel(level)), 3);
  pen.paint(()=>{ g.arc(c.x, c.y, r*hole, 0, 7); }, toneSolid(inkLevel(0)), 2.4);
}

/* the bar: two scarfed timbers with a lashed joint at mid-span, so the
   span is broken and never a stripe */
function bar(pen, g, geo, y, th){
  const x0 = geo.x0 + geo.pw*0.42, x1 = geo.x1 - geo.pw*0.42, cx = geo.cx;
  // two timbers, scarfed with a real gap of paper between them
  pen.paint(()=>{ g.moveTo(x0, y-th/2); g.lineTo(cx-4, y-th/2);
                  g.lineTo(cx-20, y+th/2); g.lineTo(x0, y+th/2); g.closePath(); },
    toneSolid(inkLevel(params.stile)), 3.0);
  pen.paint(()=>{ g.moveTo(cx+20, y-th/2); g.lineTo(x1, y-th/2);
                  g.lineTo(x1, y+th/2); g.lineTo(cx+4, y+th/2); g.closePath(); },
    toneSolid(inkLevel(params.stile)), 3.0);
  // two lashing turns holding the scarf closed
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "butt";
  for (const dx of [-13, 13]){
    g.beginPath(); g.moveTo(cx+dx, y-th/2-4); g.lineTo(cx+dx, y+th/2+4); g.stroke();
  }
}

/* the bar drawn out and leaning against the near pier */
function barLeaning(pen, g, geo, th){
  const x = geo.x0 + geo.pw*0.20, yB = geo.yG - 4, len = geo.leafH*0.94;
  g.save(); g.translate(x, yB); g.rotate(-0.17);
  pen.paint(()=>{ g.rect(0, -len, th, len); }, toneSolid(inkLevel(params.rail)), 3.2);
  pen.seam(()=>{ g.moveTo(0, -len*0.52); g.lineTo(th, -len*0.52); }, 2.6);
  g.restore();
}

/* opposing pull, shown only while the seal is under test */
function pullArrows(pen, g, geo, y){
  g.strokeStyle = INK; g.lineWidth = 4.4; g.lineCap = "butt";
  const draw = (xTip, dir)=>{
    for (const [a,b] of [[0.02,0.30],[0.40,0.68]]){
      g.beginPath();
      g.moveTo(xTip + dir*(18 + a*44), y);
      g.lineTo(xTip + dir*(18 + b*44), y);
      g.stroke();
    }
    g.fillStyle = INK; g.beginPath();
    g.moveTo(xTip, y); g.lineTo(xTip + dir*17, y-8); g.lineTo(xTip + dir*17, y+8);
    g.closePath(); g.fill();
  };
  draw(geo.x0 - 6, -1);
  draw(geo.x1 + 6,  1);
}

/* strain: two short arcs springing off a ring */
function strain(pen, g, c, r){
  g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap = "round";
  for (let i=1;i<=2;i++){
    g.beginPath(); g.arc(c.x, c.y, r + 7*i, -2.5, -0.7); g.stroke();
    g.beginPath(); g.arc(c.x, c.y, r + 7*i,  0.7,  2.5); g.stroke();
  }
}

/* the ground the gate stands on — three short hatch runs, never a span */
function ground(pen, g, geo, W){
  const y = geo.yG;
  for (const [a,b] of [[geo.x0-14, geo.x0+geo.pw+10],
                       [geo.cx-64, geo.cx+64],
                       [geo.x1-geo.pw-10, geo.x1+14]]){
    pen.ink(()=>{ g.moveTo(a, y); g.lineTo(b, y); }, 4.6);
    g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "butt";
    for (let x=a+7; x<b-5; x+=15){
      g.beginPath(); g.moveTo(x, y+3); g.lineTo(x-8, y+15); g.stroke();
    }
  }
}

/* what shows through an open gate: the road out, broken */
function beyond(pen, g, geo){
  const y = geo.yG - geo.leafH*0.22;
  g.save(); g.setLineDash([9,8]); g.strokeStyle = INK; g.lineWidth = 2.4;
  g.beginPath(); g.moveTo(geo.cx-96, y); g.lineTo(geo.cx-24, y);
  g.moveTo(geo.cx+24, y); g.lineTo(geo.cx+96, y); g.stroke();
  g.setLineDash([]); g.restore();
  g.strokeStyle = INK; g.lineWidth = 3.0; g.lineCap = "round";
  for (const dx of [-52, 0, 52]){
    g.beginPath(); g.moveTo(geo.cx+dx, y+16); g.lineTo(geo.cx+dx*0.72, y+34); g.stroke();
  }
}

/* ---------------- the upper studies ---------------- */

/* the hawser in section: three laid strands round a paper heart */
function cableSection(pen, g, W, H){
  const S = params.study, cx = W*S.cable, cy = H*S.cy, R = W*S.r;
  pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(1)), 4);
  for (let i=0;i<3;i++){
    const a = i/3*Math.PI*2 - Math.PI/2;
    pen.paint(()=>{ g.arc(cx+Math.cos(a)*R*0.44, cy+Math.sin(a)*R*0.44, R*0.40, 0, 7); },
      toneSolid(inkLevel(params.cable)), 3);
  }
  pen.paint(()=>{ g.arc(cx, cy, R*0.16, 0, 7); }, toneSolid(inkLevel(0)), 2.6);
  // diameter, broken either side
  g.save(); g.setLineDash([8,7]); g.strokeStyle = INK; g.lineWidth = 2.4;
  g.beginPath(); g.moveTo(cx-R*1.42, cy); g.lineTo(cx-R*1.06, cy);
  g.moveTo(cx+R*1.06, cy); g.lineTo(cx+R*1.42, cy); g.stroke();
  g.setLineDash([]); g.restore();
  g.strokeStyle = INK; g.lineWidth = 3.2;
  for (const s of [-1,1]){ g.beginPath();
    g.moveTo(cx+s*R*1.06, cy-10); g.lineTo(cx+s*R*1.06, cy+10); g.stroke(); }
}

/* the hitch: a round turn on the ring, the end nipped under its own part */
function hitchStudy(pen, g, W, H){
  const S = params.study, cx = W*S.hitch, cy = H*S.cy, R = W*S.r*0.62, w = 9;
  const curve = (P)=>{ const pts=[];
    for (let i=0;i<=24;i++){ const t=i/24, n=P.length-1;
      const s=Math.min(n-1, Math.floor(t*n)), u=t*n-s;
      const a=P[s], b=P[s+1], a0=P[Math.max(0,s-1)], b1=P[Math.min(n,s+2)];
      pts.push({ x: a.x+(b.x-a.x)*u + (b1.x-a0.x)*0.06*Math.sin(Math.PI*u),
                 y: a.y+(b.y-a.y)*u + (b1.y-a0.y)*0.06*Math.sin(Math.PI*u) }); }
    return pts; };
  // the standing part comes in low and rises through the eye — drawn BEHIND
  rope(pen, g, curve([{x:cx-R*2.9,y:cy+R*1.05},{x:cx-R*1.4,y:cy+R*0.95},
                      {x:cx-R*0.35,y:cy+R*0.15},{x:cx-R*0.06,y:cy-R*1.55}]), { w });
  ring(pen, g, { x:cx, y:cy }, R, { hole:0.70, level:4 });
  // ... and comes over the front of the ring, crossing its own part
  rope(pen, g, curve([{x:cx-R*0.06,y:cy-R*1.55},{x:cx+R*1.15,y:cy-R*1.10},
                      {x:cx+R*1.45,y:cy+R*0.20},{x:cx+R*0.45,y:cy+R*1.25},
                      {x:cx-R*0.75,y:cy+R*1.55}]), { w });
}

/* the bar end entering the pier socket, in section */
function socketStudy(pen, g, W, H){
  const S = params.study, cx = W*S.socket, cy = H*S.cy, R = W*S.r;
  pen.paint(()=>{ g.rect(cx-R*0.42, cy-R*1.35, R*1.34, R*2.70); },
    toneSolid(inkLevel(params.stone)), 3.6);
  // the cut socket — paper
  pen.paint(()=>{ g.rect(cx-R*0.42, cy-R*0.40, R*0.96, R*0.80); },
    toneSolid(inkLevel(0)), 3);
  // the bar entering from the left, stopping short of the socket floor
  pen.paint(()=>{ g.rect(cx-R*1.60, cy-R*0.30, R*1.36, R*0.60); },
    toneSolid(inkLevel(params.rail)), 3.2);
  // clearance ticks at the socket mouth
  g.strokeStyle = INK; g.lineWidth = 2.4; g.lineCap = "butt";
  for (const s of [-1,1]){
    g.beginPath(); g.moveTo(cx-R*0.40, cy+s*R*0.38); g.lineTo(cx-R*0.40, cy+s*R*0.30); g.stroke();
  }
  // seating depth arrow
  g.save(); g.setLineDash([5,5]); g.strokeStyle = INK; g.lineWidth = 2.2;
  g.beginPath(); g.moveTo(cx-R*0.26, cy+R*0.68); g.lineTo(cx+R*0.42, cy+R*0.68); g.stroke();
  g.setLineDash([]); g.restore();
  g.fillStyle = INK; g.beginPath();
  g.moveTo(cx+R*0.54, cy+R*0.68); g.lineTo(cx+R*0.36, cy+R*0.60);
  g.lineTo(cx+R*0.36, cy+R*0.76); g.closePath(); g.fill();
}

/* broken scale caliper — the declared height of the gate */
function caliper(pen, g, W, H){
  const C = params.caliper, x0 = W*C.x0, x1 = W*C.x1, y = H*C.y, t = H*0.016;
  g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "butt";
  for (const x of [x0, x1]){ g.beginPath(); g.moveTo(x, y-t); g.lineTo(x, y+t); g.stroke(); }
  for (const [a,b] of [[0.02,0.30],[0.38,0.62],[0.70,0.98]]){
    g.beginPath(); g.moveTo(x0+(x1-x0)*a, y); g.lineTo(x0+(x1-x0)*b, y); g.stroke();
  }
  g.lineWidth = 2.6;
  for (const f of [0.34, 0.66]){ const x = x0+(x1-x0)*f;
    g.beginPath(); g.moveTo(x, y-t*0.55); g.lineTo(x, y+t*0.55); g.stroke(); }
}

/* ---------------- header + ledger ---------------- */

function gateGlyph(pen, g, x, cy, s, shut){
  const w = s*0.46;
  for (const d of [-1, 1]){
    const lw = shut ? w : w*0.40;
    const lx = shut ? (d<0 ? x-w : x) : (d<0 ? x-w*1.10 : x+w*0.70);
    pen.paint(()=>{ g.rect(lx, cy-s*0.46, lw, s*0.92); },
      toneSolid(inkLevel(params.plank)), 2.4);
  }
  // the lintel over it, and the two rings
  g.fillStyle = INK;
  g.fillRect(x-w*1.16, cy-s*0.68, w*2.32, s*0.14);
  if (shut){
    g.fillRect(x-1.6, cy-s*0.46, 3.2, s*0.92);
    for (const d of [-1,1]){ g.beginPath(); g.arc(x+d*w*0.34, cy, s*0.09, 0, 7); g.fill(); }
  }
}

function header(pen, g, W, H, M){
  const dh = H*params.headH, dy = H*params.headY, cy = dy+dh/2;
  gateGlyph(pen, g, W*0.078, cy, dh*0.86, M.shut);
  segNumber(g, W*0.152, dy, dh, M.turns, 2);

  // the bar mark between the counts: solid when barred, broken when drawn
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  const runs = M.bar ? [[0.330,0.404],[0.416,0.490],[0.502,0.576]]
                     : [[0.330,0.362],[0.470,0.502],[0.544,0.576]];
  for (const [a,b] of runs){ g.beginPath(); g.moveTo(W*a, cy); g.lineTo(W*b, cy); g.stroke(); }

  segNumber(g, W*0.640, dy, dh, M.gap, 2);

  // the seal mark: a cable eye — filled when lashed, X'd when cut
  const kx = W*0.905, ks = dh*0.50;
  pen.paint(()=>{ g.arc(kx, cy, ks, 0, 7); },
    toneSolid(inkLevel(M.lash ? params.iron : params.rail)), 3.4);
  pen.paint(()=>{ g.arc(kx, cy, ks*0.48, 0, 7); }, toneSolid(inkLevel(0)), 2.6);
  if (M.cut){
    g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = "round";
    g.beginPath();
    g.moveTo(kx-ks*1.05, cy-ks*1.05); g.lineTo(kx+ks*1.05, cy+ks*1.05);
    g.moveTo(kx+ks*1.05, cy-ks*1.05); g.lineTo(kx-ks*1.05, cy+ks*1.05); g.stroke();
  }
}

function divider(pen, g, W, H){
  const y = H*params.divider;
  for (const [a,b] of [[0.052,0.24],[0.30,0.47],[0.53,0.70],[0.76,0.948]])
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 3.2);
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
  open:     { open:1, bar:false, lash:"none", cut:false, coil:true,  shut:false,
              turns:0, gap:12, strain:false },
  closed:   { open:0, bar:true,  lash:"none", cut:false, coil:true,  shut:true,
              turns:0, gap:0,  strain:false },
  cabled:   { open:0, bar:true,  lash:"full", cut:false, coil:false, shut:true,
              turns:params.turns, gap:0, strain:false },
  tested:   { open:0, bar:true,  lash:"taut", cut:false, coil:false, shut:true,
              turns:params.turns, gap:2, strain:true },
  cut:      { open:0, bar:true,  lash:"cut",  cut:true,  coil:false, shut:true,
              turns:0, gap:0,  strain:false },
  reopened: { open:1, bar:false, lash:"none", cut:true,  coil:true,  shut:false,
              turns:0, gap:12, strain:false },
};

/* ---------------- the render ---------------- */

function draw(ctx, W, H, st={}){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key = MODES[st.mode] ? st.mode : "cabled";
  const M = MODES[key];
  const geo = gateGeo(W, H);

  header(pen, g, W, H, M);

  // ── the piece at scale ──
  cableSection(pen, g, W, H);
  hitchStudy(pen, g, W, H);
  socketStudy(pen, g, W, H);
  caliper(pen, g, W, H);
  divider(pen, g, W, H);

  // ── the gate ──
  ground(pen, g, geo, W);
  if (M.open > 0.5) beyond(pen, g, geo);
  lintel(pen, g, geo);
  pier(pen, g, geo, -1, M.bar);
  pier(pen, g, geo,  1, M.bar);

  const ptL = leaf(pen, g, geo, -1, M.open);
  const ptR = leaf(pen, g, geo,  1, M.open);

  // meeting stile — a vertical, so it cuts every ledge line
  if (M.open < 0.5){
    pen.paint(()=>{ g.rect(geo.cx-7, geo.yT+6, 14, geo.leafH-12); },
      toneSolid(inkLevel(params.stile)), 3);
    if (M.gap > 0){       // strain shows as an opened seam at the head
      g.save(); g.setLineDash([4,5]); g.strokeStyle = INK; g.lineWidth = 2.4;
      g.beginPath(); g.moveTo(geo.cx-13, geo.yT+8); g.lineTo(geo.cx-13, geo.yT+geo.leafH*0.30);
      g.moveTo(geo.cx+13, geo.yT+8); g.lineTo(geo.cx+13, geo.yT+geo.leafH*0.30); g.stroke();
      g.setLineDash([]); g.restore();
    }
  }

  const rr = 26;
  const RL = M.open < 0.5 ? { x:geo.cx-72, y:geo.yT+geo.leafH*0.40 } : ptL(0.78, 0.40);
  const RR = M.open < 0.5 ? { x:geo.cx+72, y:geo.yT+geo.leafH*0.40 } : ptR(0.78, 0.40);
  ring(pen, g, RL, rr, { hole:0.62 }); ring(pen, g, RR, rr, { hole:0.62 });

  const th = geo.leafH*0.055;
  const ybar = geo.yT + geo.leafH*0.66;
  if (M.bar) bar(pen, g, geo, ybar, th);
  else       barLeaning(pen, g, geo, th);

  // ── the cable ──
  const w = 5;
  const passes = eightPasses(RL, RR, params.turns, 12, rr);
  if (M.lash === "full" || M.lash === "taut"){
    const sag = M.lash === "taut" ? 0.5 : 3.5;
    for (const p of passes) rope(pen, g, passPts(p, sag), { w });
    ringWrap(pen, g, RL, rr, 1, w); ringWrap(pen, g, RR, rr, -1, w);
    hitch(pen, g, geo.cx + 118, ybar, th, w);
  } else if (M.lash === "cut"){
    for (let k=0;k<passes.length;k++){
      const p = passes[k], droop = 22 + (k%2)*10;
      for (const [t0,t1,s] of [[0, 0.33 - (k%2)*0.05, -1], [0.67 + (k%2)*0.05, 1, 1]]){
        const pts = passPts(p, 0, t0, t1);
        // the severed end falls away
        for (let i=0;i<pts.length;i++){
          const f = s<0 ? i/(pts.length-1) : 1-i/(pts.length-1);
          pts[i].y += f*f*droop;
        }
        rope(pen, g, pts, { w, lay:k%2===0 });
        const e = s<0 ? pts[pts.length-1] : pts[0];
        frayed(pen, g, e.x, e.y, -s, 12);
      }
    }
    // the nick where the blade went through
    g.strokeStyle = INK; g.lineWidth = 3.4; g.lineCap = "round";
    const ny = RL.y - 56;
    g.beginPath(); g.moveTo(geo.cx-13, ny-11); g.lineTo(geo.cx, ny);
    g.lineTo(geo.cx+13, ny-11); g.stroke();
    ringWrap(pen, g, RL, rr, 1, w); ringWrap(pen, g, RR, rr, -1, w);
  }
  if (M.coil) coil(pen, g, geo.x0 + geo.pw*1.9, geo.yG - 12, 34, w*0.85);
  if (M.cut && M.open > 0.5)
    coil(pen, g, geo.x1 - geo.pw*1.9, geo.yG - 10, 26, w*0.85);

  if (M.strain){ strain(pen, g, RL, rr); strain(pen, g, RR, rr); pullArrows(pen, g, geo, ybar); }

  ledger(pen, g, W, H, ORDER.indexOf(key), key === "cut");
}

/* ---------------- the asset ---------------- */

export const asset = {
  id:"prop.courtyard-gate-and-cable",
  type:"PROP",
  name:"Courtyard Gate and Cable",
  statusWord:"CABLED",
  scene:"OD-B21-S06",

  params,
  layers:["counts","cable-section","hitch-study","socket-study","caliper","divider",
          "ground","beyond","lintel","piers","leaves","stile","rings","bar",
          "lashing","frapping","hitch","coil","strain","ledger"],

  // normalized 0..1 anchors, measured in the CABLED state
  anchors:{
    "grip:ring-left":   {x:.448, y:.613},   // where the cable takes its bite
    "grip:ring-right":  {x:.552, y:.613},
    "grip:bar":         {x:.500, y:.667},   // both hands to lift the bar out
    "grip:bar-end-l":   {x:.150, y:.667},
    "grip:bar-end-r":   {x:.850, y:.667},
    "grip:cable-tail":  {x:.590, y:.727},   // the end Philoetius hauls on
    "hitch:knot":       {x:.570, y:.667},
    "cut:point":        {x:.500, y:.613},   // where a blade would take it
    "socket:pier-l":    {x:.166, y:.667},
    "socket:pier-r":    {x:.834, y:.667},
    "hinge:left":       {x:.188, y:.512},
    "hinge:right":      {x:.812, y:.512},
    "carry:coil":       {x:.316, y:.786},
    "contact:ground":   {x:.500, y:.800},
    "threshold:centre": {x:.500, y:.788},   // the gap a body would pass through
    "camera:outside":   {x:.500, y:.470},
    "count:turns":      {x:.186, y:.067},
    "count:gap":        {x:.674, y:.067},
  },
  // collision: the gate footprint, pier face to pier face
  collision:{ kind:"box", a:{x:.120, y:.428}, b:{x:.880, y:.806} },
  ownership:"house-of-odysseus · the outer court gate of the well-fenced yard; "
          + "shut and barred from within by Philoetius, who lashes it with a "
          + "papyrus ship's hawser found lying under the colonnade",

  states:{
    initial:"open",
    nodes:{
      open:     { preview:{ mode:"open",     status:"OPEN",     progress:0.06 } },
      closed:   { preview:{ mode:"closed",   status:"CLOSED",   progress:0.28 } },
      cabled:   { preview:{ mode:"cabled",   status:"CABLED",   progress:0.55 } },
      tested:   { preview:{ mode:"tested",   status:"TESTED",   progress:0.72 } },
      cut:      { preview:{ mode:"cut",      status:"CUT",      progress:0.90 } },
      reopened: { preview:{ mode:"reopened", status:"REOPENED", progress:1.00 } },
    },
    edges:[
      ["open","closed"],["closed","cabled"],["cabled","tested"],["tested","cabled"],
      ["cabled","cut"],["tested","cut"],["cut","reopened"],["reopened","closed"],
      ["closed","open"],["reopened","open"],
    ],
  },
  channels:["mode","turns","gap","bar","strain","t","progress"],

  // CARD SIGNATURE — CABLED: leaves met, bar dropped, six turns run ring to
  // ring, frapped at the middle and hitched to the bar. The yard is shut.
  preview:()=>({ mode:"cabled", status:"CABLED", progress:0.55, t:0 }),

  draw(ctx, W, H, state){
    draw(ctx, W, H, state||{});
    return { anchors: asset.anchors, collision: asset.collision };
  },
};
export default asset;
