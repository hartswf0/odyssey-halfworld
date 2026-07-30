/* prop.goat-sausages — the goat paunches stuffed with fat and blood that lie
   on the suitors' fire, and that Antinous offers as the prize of the beggars'
   bout: "whichever of the two wins may step up and take his pick of these."
   PROP asset. One isolated reusable object — a set of four tied guts with a
   declared scale, grip/support/contact anchors, ownership, collision box and
   every state the scene needs. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B18-S01):
     fire        — four paunches lying on the ember bed of the hall hearth,
                   charring, heat rising off them. The visible prize.
     select      — the same four, one bracketed by a choice reticle with a
                   leader: the winner's pick, called before the fight.
     award       — the chosen paunch alone, presented on a shallow platter with
                   its award brackets and the grip ticks a hand takes it by.
     eat         — the same paunch bitten through, jagged face, grease running,
                   its cast-off tie string coiled on the boards.
     continuity  — the ledger: four silhouettes in a row, a glyph under each
                   (block = still on the fire, ring = awarded, cross = eaten)
                   and the remaining count as a seven-segment numeral beside a
                   unit icon. Numerals are GEOMETRY, never type.

   THE LOOK: the gut casing is a LIGHT plane, the sag of the belly one level
   darker, the binding cords the single dark accent, char spots small and few.
   Nothing spans the frame: the hearth ring is broken, the boards are broken,
   the paunches are staggered so no run of them makes a bar. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* the source frame the module is authored against */
const SRC_W = 660, SRC_H = 880;

const params = {
  count:4,             // paunches made up and laid by for supper
  lobes:3,             // binding cords pinch the gut into this many lobes
  pinch:0.18,          // how deep the cords pinch between lobes (0 = a tube)
  cap:0.13,            // length of the rounded end cap, in u units
  droop:0.20,          // how much the loaded gut sags in the middle
  sag:1.04,            // how much further the belly hangs than the back rises
  charMax:3,           // most char spots on any one paunch
  // declared physical scale of ONE paunch (a goat stomach, stuffed and tied)
  scale:{ unit:"cm", length:34, girth:13, mass_g:900 },
  collision:"box",
};

/* ink levels — light planes, dark accents, plenty of paper */
const CASING   = 2;   // the gut casing: the lightest plane, the object's body
const BELLY    = 4;   // the sag underneath (one step down, never black)
const CORD     = 5;   // binding cords — the dark accent that reads the lobes
const KNOT     = 3;   // the tied ends
const CHAR     = 6;   // char spots: small, few, on the underside only
const COAL     = 5;   // embers
const COAL_HOT = 2;   // the cracked light core of an ember
const PLATTER  = 3;   // presentation dish
const HOLLOW   = 5;   // its inner shadow
const NUMERAL  = 6;   // seven-segment count bars

/* ------------------------------------------------------------------ */
/* local frame of one paunch: u runs -1..1 along the axis, v across.   */
function makeT(cx, cy, half, r, rot){
  const c = Math.cos(rot), s = Math.sin(rot);
  return (u,v)=>({ x: cx + u*half*c - v*r*s, y: cy + u*half*s + v*r*c });
}
/* girth profile: a plump loaded gut — a run of `lobes` bulges cinched at the
   junctions by the cords, closed at each end by a round cap. */
function prof(u, lobes){
  const a = Math.abs(u);
  const cap = a <= 1-params.cap ? 1
    : Math.sqrt(Math.max(0, 1 - Math.pow((a-(1-params.cap))/params.cap, 2)));
  const lobe = (1-params.pinch) + params.pinch*Math.cos(lobes*Math.PI*u);
  return cap * lobe;
}
/* the middle of a stuffed paunch hangs: both edges drop together */
const droop = u => params.droop*(1-u*u);
const topV = (u,l)=> -prof(u,l)*0.92 + droop(u);
const botV = (u,l)=>  prof(u,l)*params.sag + droop(u);
/* a point across the girth: f=0 the back, f=1 the belly */
const midV = (u,l,f)=> lerp(topV(u,l), botV(u,l), f);

/* the casing outline from u0 to u1. If the run stops short of the tied end a
   jagged BITE face closes it. */
function paunchPath(g, T, lobes, u0, u1, bite){
  const N = 46;
  const p0 = T(u0, topV(u0,lobes));
  g.moveTo(p0.x, p0.y);
  for(let i=1;i<=N;i++){ const u = lerp(u0,u1,i/N); const p = T(u, topV(u,lobes)); g.lineTo(p.x,p.y); }
  if(bite){
    const K = 5;
    for(let i=1;i<=K;i++){
      const f = i/K;
      const uu = u1 + (i%2 ? -0.055 : 0.045);
      const vv = lerp(topV(u1,lobes), botV(u1,lobes), f);
      const p = T(uu, vv); g.lineTo(p.x,p.y);
    }
  }
  for(let i=0;i<=N;i++){ const u = lerp(u1,u0,i/N); const p = T(u, botV(u,lobes)); g.lineTo(p.x,p.y); }
  g.closePath();
}

/* ------------------------------------------------------------------
   ONE PAUNCH. S = { cx,cy,len,r,rot,lobes,bite,char,ghost } in px. */
function drawPaunch(g, pen, S){
  const lobes = S.lobes ?? params.lobes;
  const half = S.len/2, r = S.r;
  const T = makeT(S.cx, S.cy, half, r, S.rot||0);
  const u0 = -1, u1 = S.bite ?? 1, bitten = u1 < 0.94;

  if(S.ghost){                                   // outline-only, for the ledger
    pen.ink(()=>paunchPath(g,T,lobes,u0,u1,bitten), 3.5);
    return T;
  }

  // the casing — the light plane
  pen.paint(()=>paunchPath(g,T,lobes,u0,u1,bitten), toneSolid(inkLevel(CASING)), 5);

  // the sag of the belly: a crescent along the underside, no contour of its own
  pen.fillPath(()=>{
    const N = 40;
    const a = T(u0, botV(u0,lobes)); g.moveTo(a.x,a.y);
    for(let i=1;i<=N;i++){ const u=lerp(u0,u1,i/N); const p=T(u, botV(u,lobes)); g.lineTo(p.x,p.y); }
    for(let i=0;i<=N;i++){ const u=lerp(u1,u0,i/N); const p=T(u, midV(u,lobes,0.70)); g.lineTo(p.x,p.y); }
    g.closePath();
  }, inkLevel(BELLY));

  // binding cords — the dark accent, at the pinched junctions only, short bands
  g.lineCap = "butt";
  const junction = 2/lobes;                      // where the profile cinches in
  for(let k=-Math.floor(lobes/2); k<=Math.floor(lobes/2); k++){
    const u = (k + 0.5)*junction - (lobes%2 ? 0 : 0);
    if(Math.abs(u) > 0.86 || u > u1-0.12) continue;
    const a = T(u, midV(u,lobes,0.03)), b = T(u, midV(u,lobes,0.97));
    g.strokeStyle = inkLevel(CORD); g.lineWidth = Math.max(3, r*0.16);
    g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
    g.strokeStyle = INK; g.lineWidth = 2;
    g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
  }
  g.lineCap = "round";

  // char spots: small, few, low on the flank where the coals touch
  const nCh = Math.round(clamp(S.char||0,0,1)*params.charMax);
  for(let i=0;i<nCh;i++){
    const u = -0.62 + i*0.42;
    if(u > u1-0.16) continue;
    const p = T(u + (i%2?0.06:-0.03), midV(u,lobes, i%2?0.74:0.64));
    pen.fillPath(()=>{ g.ellipse(p.x, p.y, r*0.13, r*0.085, S.rot||0, 0, 7); }, inkLevel(CHAR));
  }

  // the tied ends: a knot plus two stub tails of gut string
  const tie = (u)=>{
    const k = T(u, droop(u));
    pen.paint(()=>{ g.ellipse(k.x, k.y, r*0.23, r*0.20, S.rot||0, 0, 7); }, toneSolid(inkLevel(KNOT)), 4);
    const s = Math.sign(u);
    pen.ink(()=>{ g.moveTo(k.x, k.y); g.lineTo(k.x + s*r*0.66, k.y - r*0.36); }, 3);
    pen.ink(()=>{ g.moveTo(k.x, k.y); g.lineTo(k.x + s*r*0.58, k.y + r*0.42); }, 3);
  };
  tie(-0.985);
  if(!bitten) tie(0.985);
  return T;
}

/* ------------------------------------------------------------------
   THE HEARTH — a BROKEN oval of stones with an ember bed inside.        */
function coal(g, pen, ex, ey, w, hot){
  const h = w*0.62;
  pen.paint(()=>{
    g.moveTo(ex-w, ey); g.lineTo(ex-w*0.4, ey-h); g.lineTo(ex+w, ey-h*0.3);
    g.lineTo(ex+w*0.5, ey+h); g.closePath();
  }, toneSolid(inkLevel(COAL)), 3);
  if(hot) pen.fillPath(()=>{ g.ellipse(ex, ey-h*0.1, w*0.34, h*0.26, 0.3, 0, 7); }, inkLevel(COAL_HOT));
}
/* the ember bed, in two bands: 0 = behind the meat, 1 = the front rank laid
   over its foot line. The coals hug the rim and the open corridor down the
   middle, so they are never buried under the paunches. */
function emberSites(cx, cy, rx, ry){
  const out = [];
  for(let i=0;i<15;i++){
    const a = 0.22 + i*(Math.PI*2/15), rr = 0.80 + 0.17*((i*0.37)%1);
    out.push({ x:cx + Math.cos(a)*rx*rr, y:cy + Math.sin(a)*ry*rr,
               w:rx*0.050*(0.72+0.56*((i*0.29)%1)), hot:i%3===0 });
  }
  // the open corridor between the two columns of meat
  for(const [dx,dy,s] of [[-0.012,-0.44,1.0],[0.026,0.02,0.86],[-0.030,0.50,1.06],[0.010,0.76,0.8]])
    out.push({ x:cx + rx*dx*3, y:cy + ry*dy, w:rx*0.050*s, hot:s>0.9 });
  return out;
}
function drawHearth(g, pen, W, H, cx, cy, rx, ry, band){
  if(band === 0){
    // broken stone rim: the near half in three runs, plus two short far ticks.
    // The far arc is deliberately NOT drawn — it would read as a floating bar.
    const arcs = [[0.10,0.82],[1.05,2.02],[2.30,3.04],[3.08,3.32],[5.92,6.16]];
    for(const [a0,a1] of arcs) pen.ink(()=>{ g.ellipse(cx, cy, rx, ry, 0, a0, a1); }, 4);
  }
  for(const e of emberSites(cx, cy, rx, ry)){
    const front = e.y > cy + ry*0.44;
    if((band===1) !== front) continue;
    coal(g, pen, e.x, e.y, e.w, e.hot);
  }
}

/* rising heat — thin broken chevrons above the fire, never a solid mass */
function drawHeat(g, W, H, cx, topY, spread, n){
  g.strokeStyle = "rgba(0,0,0,0.44)"; g.lineWidth = 4.5; g.lineCap = "round";
  for(let i=0;i<n;i++){
    const f = (i/(n-1||1)) - 0.5;
    const x = cx + f*spread, y = topY - (i%2)*H*0.016;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + W*0.018, y - H*0.026, x - W*0.010, y - H*0.050);
    g.quadraticCurveTo(x - W*0.026, y - H*0.072, x + W*0.005, y - H*0.096);
    g.stroke();
  }
}

/* a BROKEN board line — never a full-width bar */
function drawBoards(g, pen, W, y){
  for(const [a,b] of [[0.09,0.30],[0.40,0.61],[0.71,0.92]]){
    pen.ink(()=>{ g.moveTo(W*a, y); g.lineTo(W*b, y); }, 3.5);
  }
}

/* corner-bracket reticle around a box — the CHOICE mark */
function drawReticle(g, x0, y0, x1, y1, k){
  g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "butt";
  const C = [[x0,y0,1,1],[x1,y0,-1,1],[x1,y1,-1,-1],[x0,y1,1,-1]];
  for(const [x,y,sx,sy] of C){
    g.beginPath();
    g.moveTo(x + sx*k, y); g.lineTo(x, y); g.lineTo(x, y + sy*k);
    g.stroke();
  }
  g.lineCap = "round";
}

/* seven-segment numeral drawn as GEOMETRY — never as text */
const SEG = {0:"abcdef",1:"bc",2:"abged",3:"abgcd",4:"fgbc",5:"afgcd",
             6:"afgedc",7:"abc",8:"abcdefg",9:"abcdfg"};
function drawDigit(g, pen, x, y, w, h, d){
  const t = Math.min(w, h)*0.24, mid = y + h/2;
  const S = {
    a:[x+t*0.7, y,            w-t*1.4, t],
    b:[x+w-t,   y+t*0.7,      t,       h/2-t*1.2],
    c:[x+w-t,   mid+t*0.5,    t,       h/2-t*1.2],
    d:[x+t*0.7, y+h-t,        w-t*1.4, t],
    e:[x,       mid+t*0.5,    t,       h/2-t*1.2],
    f:[x,       y+t*0.7,      t,       h/2-t*1.2],
    g:[x+t*0.7, mid-t/2,      w-t*1.4, t],
  };
  for(const k of (SEG[d]||"")){
    const [rx,ry,rw,rh] = S[k];
    pen.paint(()=>{ g.rect(rx, ry, rw, rh); }, toneSolid(inkLevel(NUMERAL)), 3);
  }
}

/* ------------------------------------------------------------------
   LAYOUTS — every state is a placement of the same paunch geometry.     */
const FIRE_ROW = [
  { x:0.310, y:0.495, len:0.250, r:0.042, rot:-0.055, lobes:3, char:0.75 },
  { x:0.688, y:0.487, len:0.236, r:0.039, rot: 0.050, lobes:3, char:0.50 },
  { x:0.282, y:0.608, len:0.284, r:0.050, rot: 0.038, lobes:3, char:1.00 },
  { x:0.716, y:0.616, len:0.268, r:0.047, rot:-0.048, lobes:3, char:0.85 },
];
const HERO = { x:0.500, y:0.452, len:0.560, r:0.088, rot:-0.075, lobes:3 };
const HEARTH = { x:0.500, y:0.565, rx:0.430, ry:0.145 };

function firePaunch(W, H, i){
  const S = FIRE_ROW[i];
  return { cx:W*S.x, cy:H*S.y, len:W*S.len, r:H*S.r, rot:S.rot, lobes:S.lobes, char:S.char };
}
function heroPaunch(W, H, over={}){
  return { cx:W*HERO.x, cy:H*HERO.y, len:W*HERO.len, r:H*HERO.r,
           rot:HERO.rot, lobes:HERO.lobes, ...over };
}

/* ------------------------------------------------------------------ */
function drawSausages(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "fire";

  /* ---------------- ON THE FIRE / CHOICE ---------------- */
  if(mode === "fire" || mode === "select"){
    drawHearth(g, pen, W, H, W*HEARTH.x, H*HEARTH.y, W*HEARTH.rx, H*HEARTH.ry, 0);
    drawHeat(g, W, H, W*0.500, H*0.438, W*0.50, 5);
    // back pair first, then front pair — the row is staggered, never a bar
    for(const i of [0,1,2,3]) drawPaunch(g, pen, firePaunch(W,H,i));
    // the front rank of coals lies over the meat's foot line
    drawHearth(g, pen, W, H, W*HEARTH.x, H*HEARTH.y, W*HEARTH.rx, H*HEARTH.ry, 1);

    if(mode === "select"){
      // the winner's pick: the near-left paunch, bracketed and called out from
      // the open paper below so the mark never crosses the other three.
      const S = firePaunch(W,H,2);
      const hx = S.len*0.62;
      const y0 = S.cy - S.r*1.15, y1 = S.cy + S.r*1.95;
      drawReticle(g, S.cx-hx, y0, S.cx+hx, y1, Math.min(hx, (y1-y0)/2)*0.40);
      const tipX = S.cx - hx*0.35, tipY = y1 + H*0.014;
      g.strokeStyle = "rgba(0,0,0,0.62)"; g.lineWidth = 5; g.setLineDash([16,13]);
      g.beginPath(); g.moveTo(W*0.178, H*0.806); g.lineTo(tipX, tipY + H*0.026); g.stroke();
      g.setLineDash([]);
      g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "round";
      g.beginPath();
      g.moveTo(tipX - W*0.030, tipY + H*0.036);
      g.lineTo(tipX,           tipY);
      g.lineTo(tipX + W*0.030, tipY + H*0.036);
      g.stroke();
      g.fillStyle = ACCENT;
      g.beginPath(); g.arc(W*0.178, H*0.806, Math.max(5, W*0.014), 0, 7); g.fill();
    }
    return;
  }

  /* ---------------- AWARDED ---------------- */
  if(mode === "award"){
    drawBoards(g, pen, W, H*0.678);
    // shallow presentation platter — a light dish, rim read by one back arc
    const px = W*0.500, py = H*0.606, prx = W*0.212, pry = H*0.034;
    g.fillStyle = "rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(px, py+H*0.038, prx*0.92, pry*0.44, 0, 0, 7); g.fill();
    pen.paint(()=>{
      g.moveTo(px-prx, py);
      g.quadraticCurveTo(px-prx*0.62, py+pry*1.7, px, py+pry*1.20);
      g.quadraticCurveTo(px+prx*0.62, py+pry*1.7, px+prx, py);
      g.ellipse(px, py, prx, pry, 0, 0, Math.PI, true);
      g.closePath();
    }, toneSolid(inkLevel(PLATTER)), 5);
    pen.seam(()=>{ g.ellipse(px, py, prx*0.90, pry*0.86, 0, Math.PI*1.10, Math.PI*1.90); }, 3);

    const S = heroPaunch(W,H,{ char:0.55 });
    const T = drawPaunch(g, pen, S);

    // award brackets — two square brackets flanking the prize, drawn tight
    const bx = S.len*0.60, byy = S.r*1.58, arm = S.r*0.58;
    g.strokeStyle = INK; g.lineWidth = 6.5; g.lineCap = "butt";
    for(const s of [-1,1]){
      const x = S.cx + s*bx;
      g.beginPath();
      g.moveTo(x - s*arm, S.cy-byy); g.lineTo(x, S.cy-byy);
      g.lineTo(x, S.cy+byy); g.lineTo(x - s*arm, S.cy+byy);
      g.stroke();
    }
    g.lineCap = "round";
    // grip ticks: the fingers that close over the near end, clear of the dish
    g.strokeStyle = INK; g.lineWidth = 5.5;
    for(let i=0;i<3;i++){
      const u = -0.74 + i*0.17;
      const a = T(u, midV(u,3,0.34)), b = T(u, midV(u,3,0.02));
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
    }
    // the mark of the awarded piece
    const m = T(0.10, topV(0.10,3));
    g.fillStyle = ACCENT;
    g.beginPath();
    g.moveTo(m.x, m.y - H*0.012);
    g.lineTo(m.x - W*0.024, m.y - H*0.058);
    g.lineTo(m.x + W*0.024, m.y - H*0.058);
    g.closePath(); g.fill();
    return;
  }

  /* ---------------- EATEN ---------------- */
  if(mode === "eat"){
    drawBoards(g, pen, W, H*0.660);
    const S = heroPaunch(W,H,{ cx:W*0.602, cy:H*0.478, rot:0.055, bite:0.16, char:0.55 });
    g.fillStyle = "rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(S.cx-W*0.06, H*0.640, S.len*0.40, H*0.015, 0, 0, 7); g.fill();
    const T = drawPaunch(g, pen, S);

    // grease beading off the bitten face — short, thin, hugging the tear
    const face = T(0.16, midV(0.16,3,0.80));
    g.lineCap = "round";
    for(let i=0;i<3;i++){
      const dx = (i-1)*S.r*0.24, dy = S.r*(0.26 + i*0.15);
      g.strokeStyle = inkLevel(CORD); g.lineWidth = Math.max(2.5, S.r*0.075);
      g.beginPath(); g.moveTo(face.x+dx, face.y-S.r*0.10); g.lineTo(face.x+dx*1.1, face.y+dy); g.stroke();
      pen.fillPath(()=>{ g.ellipse(face.x+dx*1.12, face.y+dy+S.r*0.08, S.r*0.075, S.r*0.10, 0, 0, 7); }, inkLevel(CORD));
    }
    // the cast-off tie string, coiled on the boards
    const sx = W*0.268, sy = H*0.618;
    g.strokeStyle = INK; g.lineWidth = 4;
    g.beginPath();
    for(let i=0;i<=52;i++){
      const a = i/52*Math.PI*3.4, rr = W*0.016 + i/52*W*0.052;
      const x = sx + Math.cos(a)*rr, y = sy + Math.sin(a)*rr*0.42;
      i ? g.lineTo(x,y) : g.moveTo(x,y);
    }
    g.stroke();
    // crumbs left on the boards
    g.fillStyle = inkLevel(CORD);
    for(let i=0;i<6;i++){
      const cx2 = W*(0.436 + i*0.026), cy2 = H*(0.634 + ((i*7)%3)*0.010);
      g.beginPath(); g.arc(cx2, cy2, Math.max(3, W*0.007*((i%3)+1)/2), 0, 7); g.fill();
    }
    return;
  }

  /* ---------------- CONTINUITY LEDGER ---------------- */
  // four silhouettes in a row, a state glyph under each, remaining count as
  // seven-segment geometry beside a unit icon.
  const rowY = H*0.360;
  // three paunches still lie on the fire; the third was the prize — taken and
  // eaten, so it carries BOTH marks and is drawn bitten.
  const marks = ["fire","fire","gone","fire"];
  for(let i=0;i<4;i++){
    const cx2 = W*(0.185 + i*0.210);
    const gone = marks[i]==="gone";
    drawPaunch(g, pen, { cx:cx2, cy:rowY, len:W*0.168, r:H*0.030,
                         rot:(i%2?0.04:-0.04), lobes:3, bite:gone?0.16:1, ghost:true });
    const gy = H*0.470, k = W*0.028;
    if(!gone){
      pen.paint(()=>{ g.rect(cx2-k, gy-k, k*2, k*2); }, toneSolid(inkLevel(3)), 4);
    }else{
      pen.ink(()=>{ g.ellipse(cx2, gy, k*1.18, k*1.18, 0, 0, 7); }, 5);
      g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round";
      g.beginPath();
      g.moveTo(cx2-k*0.44, gy-k*0.44); g.lineTo(cx2+k*0.44, gy+k*0.44);
      g.moveTo(cx2+k*0.44, gy-k*0.44); g.lineTo(cx2-k*0.44, gy+k*0.44); g.stroke();
    }
    // the tick that ties glyph to silhouette
    pen.ink(()=>{ g.moveTo(cx2, rowY+H*0.048); g.lineTo(cx2, gy-k-H*0.014); }, 3.5);
  }
  drawBoards(g, pen, W, H*0.552);
  // REMAINING ON THE FIRE: "3" (seven-segment) × one paunch icon
  const dw = W*0.090, dh = H*0.150, dx = W*0.286, dy = H*0.616;
  drawDigit(g, pen, dx, dy, dw, dh, 3);
  const mx = dx + dw + W*0.048, my = dy + dh*0.5, mk = W*0.020;
  g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = "round";
  g.beginPath(); g.moveTo(mx-mk, my-mk); g.lineTo(mx+mk, my+mk);
  g.moveTo(mx+mk, my-mk); g.lineTo(mx-mk, my+mk); g.stroke();
  drawPaunch(g, pen, { cx:mx + W*0.140, cy:my, len:W*0.190, r:H*0.034,
                       lobes:3, rot:0, char:0.4 });
}

/* ---- anchors + collision, COMPUTED from the authored geometry ------- */
const nrm = p => ({ x:+clamp(p.x/SRC_W,0,1).toFixed(3), y:+clamp(p.y/SRC_H,0,1).toFixed(3) });
const HT = makeT(SRC_W*HERO.x, SRC_H*HERO.y, SRC_W*HERO.len/2, SRC_H*HERO.r, HERO.rot);
const FT2 = makeT(SRC_W*FIRE_ROW[2].x, SRC_H*FIRE_ROW[2].y,
                  SRC_W*FIRE_ROW[2].len/2, SRC_H*FIRE_ROW[2].r, FIRE_ROW[2].rot);

const ANCHORS = {
  center:            nrm(HT(0, 0)),                      // centre of mass of the prize
  "grip:tie-near":   nrm(HT(-0.90, 0)),                  // the tied end a hand closes on
  "grip:tie-far":    nrm(HT( 0.90, 0)),                  // the other tie, for two hands
  "grip:overhand":   nrm(HT(0, topV(0,3))),              // taken from above, off the platter
  "mouth:bite":      nrm(HT(0.42, 0)),                   // where the bite is torn
  "support:platter": { x:0.500, y:0.572 },               // the dish it is presented on
  "contact:fire-bed":{ x:0.500, y:0.565 },               // the ember bed it lies on
  "contact:boards":  { x:0.500, y:0.640 },               // the table boards after the award
  "mark:selected":   nrm(FT2(0, 0)),                     // the paunch the winner picks
  "mark:cast-off":   { x:0.215, y:0.626 },               // the discarded tie string
};

const BOUNDS = (()=>{
  const pts = [];
  for(let i=0;i<=24;i++){ const u=-1+2*i/24; pts.push(HT(u, topV(u,3)), HT(u, botV(u,3))); }
  const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y);
  return { x0:+(Math.min(...xs)/SRC_W).toFixed(3), y0:+(Math.min(...ys)/SRC_H).toFixed(3),
           x1:+(Math.max(...xs)/SRC_W).toFixed(3), y1:+(Math.max(...ys)/SRC_H).toFixed(3) };
})();

export const asset = {
  id:"prop.goat-sausages",
  type:"PROP",
  name:"Goat Sausages",
  statusWord:"ON THE FIRE",
  scene:"OD-B18-S01",

  params,
  // back -> front draw order the module honors
  layers:["hearth-ring","embers","heat","back-paunches","front-paunches",
          "belly-shade","cords","char","knots","platter","award-brackets",
          "grip-ticks","reticle","leader","grease","tie-string","crumbs",
          "ledger-silhouettes","state-glyphs","count-numeral"],

  // normalized 0..1 grip / support / contact / mark anchors, computed from the
  // authored hero + fire geometry so they cannot drift when proportions change
  anchors: ANCHORS,
  collision:{ kind:"box", bounds:BOUNDS },
  zones:{
    bounds: BOUNDS,
    // the ember bed footprint the four paunches occupy while roasting
    fire:{ x0:0.070, y0:0.420, x1:0.930, y1:0.710 },
  },
  ownership:{ owner:"the suitors' larder", steward:"Antinous",
              context:"prize of the beggars' bout", kind:"food", transferable:true,
              awardedTo:"winner of the fight" },

  states:{
    initial:"fire",
    nodes:{
      fire:      { preview:{ mode:"fire",       status:"ON THE FIRE", progress:0.12 } },
      select:    { preview:{ mode:"select",     status:"CHOICE",      progress:0.36 } },
      award:     { preview:{ mode:"award",      status:"PRIZE",       progress:0.62 } },
      eat:       { preview:{ mode:"eat",        status:"EATEN",       progress:0.86 } },
      continuity:{ preview:{ mode:"continuity", status:"TALLY",       progress:1.00 } },
    },
    edges:[
      ["fire","select"],["select","award"],["award","eat"],["eat","continuity"],
      ["continuity","fire"],["select","fire"],["award","continuity"],["fire","continuity"],
    ],
  },
  channels:["mode","char","bite","t"],

  preview:()=>({ mode:"fire", status:"ON THE FIRE", progress:0.12, t:0 }),
  draw(ctx,W,H,state){
    drawSausages(ctx,W,H,state||{});
    return { anchors:asset.anchors, collision:asset.collision, zones:asset.zones };
  },
};
export default asset;
