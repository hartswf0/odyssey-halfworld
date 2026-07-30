/* divine_fx.doom-pull — the assigned death drawn as a PATH CONSTRAINT.
   DIVINE_FX asset. Scene function (OD-B18-S03, "The Warning to Amphinomus"):
   Odysseus warns him and offers an exit; Amphinomus walks away shaken, senses the
   danger, and still cannot leave. Athena has already assigned him his death, so
   the departure he *wants* is quietly overwritten by the route he is *held* to.

   The effect is a routing diagram of that overwrite, never a picture of a god:

     SOURCE  — a fixed DESIGN PIN at the top: Athena's anchor, cross-haired,
               with sworn radiating ticks. It never moves; everything hangs off it.
     FIELD   — a broad pull field of small chevrons leaning downstream, steepening
               toward the end of the route, plus the ASSIGNED CORRIDOR itself: a
               curved two-railed channel running from where he stands to the
               station where he will die. Its floor chevrons only point one way.
     TARGET  — a blocky plan-view TOKEN (Amphinomus) riding the corridor, collared
               by a taut TETHER back to the pin. Two opposed arrows leave him: a
               long solid DOOM vector downstream, a short dashed WILL vector back.
     TRANSFORM — the ESCAPE ATTEMPT: a dashed arc that breaks left toward the
               offered door, loses its nerve, hooks, and is returned to the
               corridor by a hard arrowhead. The door is struck through with a
               prohibition bar: the exit stays open and stays unusable.
     CONSEQUENCE — the ASSIGNED STATION at the corridor's mouth: a dark keyed
               square, crossed, with a spear stroke through a fallen glyph.
               (Book XXII: Telemachus's spear, from behind.)

   Animation over state.t: the token advances along the corridor by arc length,
   the field chevrons flow, the escape arc is drawn and then withdrawn, the tether
   tightens, and a seven-step PULL GAUGE on the right fills as slack is taken up.
   `pull` sets field strength, `hesitation` sets how far the will vector pushes
   back, `escape` how much of the aborted arc is shown.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. The upper band
   is kept light so the card LABEL stays legible; the frame is mostly paper with
   dark reserved for the pin, the token and the assigned station. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* the assigned route, in 0..1 asset space, from where he stands (top) to the
   station where he is killed (bottom right). Deliberately not straight — the
   constraint is a curve he keeps being folded back onto. */
const ROUTE = [
  { x:0.345, y:0.250 },
  { x:0.368, y:0.398 },
  { x:0.432, y:0.545 },
  { x:0.535, y:0.665 },
  { x:0.635, y:0.760 },
  { x:0.706, y:0.862 },
];

const params = {
  route: ROUTE,
  halfWidth: 0.058,   // corridor half width, frac of W
  pinX: 0.560, pinY: 0.138,
  doorX: 0.190, doorY: 0.292,
  gaugeSteps: 7,
  flow: 26,           // marching-ants speed on the dashed vectors
  pull: 1.0,
  hesitation: 0.55,
};

/* ---------- centripetal-ish Catmull-Rom sampling of the route ---------- */
function sampleRoute(pts, W, H, per=16){
  const P = pts.map(p=>({ x:p.x*W, y:p.y*H }));
  const out = [];
  const at = i => P[clamp(i,0,P.length-1)];
  for(let i=0;i<P.length-1;i++){
    const p0=at(i-1), p1=at(i), p2=at(i+1), p3=at(i+2);
    for(let k=0;k<per;k++){
      const s=k/per, s2=s*s, s3=s2*s;
      out.push({
        x:0.5*((2*p1.x)+(-p0.x+p2.x)*s+(2*p0.x-5*p1.x+4*p2.x-p3.x)*s2+(-p0.x+3*p1.x-3*p2.x+p3.x)*s3),
        y:0.5*((2*p1.y)+(-p0.y+p2.y)*s+(2*p0.y-5*p1.y+4*p2.y-p3.y)*s2+(-p0.y+3*p1.y-3*p2.y+p3.y)*s3),
      });
    }
  }
  out.push({ x:P[P.length-1].x, y:P[P.length-1].y });
  // tangents + cumulative arc length
  let acc=0;
  for(let i=0;i<out.length;i++){
    const a=out[Math.max(0,i-1)], b=out[Math.min(out.length-1,i+1)];
    const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1;
    out[i].tx=dx/L; out[i].ty=dy/L;
    if(i>0) acc += Math.hypot(out[i].x-out[i-1].x, out[i].y-out[i-1].y);
    out[i].s = acc;
  }
  const total = acc||1;
  for(const q of out) q.u = q.s/total;
  out.total = total;
  return out;
}
/* point + heading at arc-length fraction u */
function atU(S, u){
  u = clamp01(u);
  let lo=0, hi=S.length-1;
  while(lo<hi-1){ const m=(lo+hi)>>1; if(S[m].u<u) lo=m; else hi=m; }
  const a=S[lo], b=S[hi], k = (b.u-a.u)>1e-9 ? (u-a.u)/(b.u-a.u) : 0;
  return { x:lerp(a.x,b.x,k), y:lerp(a.y,b.y,k), tx:lerp(a.tx,b.tx,k), ty:lerp(a.ty,b.ty,k) };
}

/* ---------- small shared marks ---------- */
function arrowhead(g,p,dir,s){
  const nx=-dir.y, ny=dir.x;
  g.fillStyle=INK; g.beginPath();
  g.moveTo(p.x,p.y);
  g.lineTo(p.x-dir.x*s+nx*s*0.62, p.y-dir.y*s+ny*s*0.62);
  g.lineTo(p.x-dir.x*s-nx*s*0.62, p.y-dir.y*s-ny*s*0.62);
  g.closePath(); g.fill();
}
function chevron(g,x,y,dir,s,lw){
  const nx=-dir.y, ny=dir.x;
  g.lineWidth=lw; g.lineCap="round"; g.lineJoin="round"; g.strokeStyle=INK;
  g.beginPath();
  g.moveTo(x-dir.x*s+nx*s*0.72, y-dir.y*s+ny*s*0.72);
  g.lineTo(x+dir.x*s*0.55, y+dir.y*s*0.55);
  g.lineTo(x-dir.x*s-nx*s*0.72, y-dir.y*s-ny*s*0.72);
  g.stroke();
}
function dashed(g,pts,lw,off,dash){
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round"; g.lineJoin="round";
  g.setLineDash(dash); g.lineDashOffset=off;
  g.beginPath(); g.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x,pts[i].y);
  g.stroke(); g.setLineDash([]);
}

/* ---------- FIELD: the pull, drawn as concentric ARCS of chevrons centred on the
   assigned station, every one of them pointing inward. Chevrons grow and darken
   as the rings tighten, so the plate reads as a well he is already inside of.
   Arcs are sparse and staggered — a field, not a texture. ---------- */
function drawPullField(g,W,H,S,strength,phase){
  const end = atU(S,1);
  const rings = [1.06, 0.86, 0.68, 0.52, 0.38, 0.26];
  rings.forEach((rr,ri)=>{
    const R = W*rr;
    const near = clamp01(1 - rr/1.15);
    const count = 7 + ri*2;
    const s  = W*(0.017 + 0.016*near);
    const lw = Math.max(2.0, W*(0.0038 + 0.0044*near));
    for(let k=0;k<count;k++){
      const a = Math.PI + (k+0.5+ (ri%2?0.5:0))/count * Math.PI*1.22 - 0.10 + phase*0.010;
      const x = end.x + Math.cos(a)*R, y = end.y + Math.sin(a)*R;
      if(x<W*0.045 || x>W*0.855 || y<H*0.175 || y>H*0.955) continue;
      if(y<H*0.235 && x<W*0.46) continue;                 // keep the label corner clear
      // skip anything sitting on the corridor itself
      let dmin=1e9;
      for(let i=0;i<S.length;i+=4){ const d=Math.hypot(S[i].x-x,S[i].y-y); if(d<dmin) dmin=d; }
      if(dmin < W*params.halfWidth*1.75) continue;
      const dx=end.x-x, dy=end.y-y, L=Math.hypot(dx,dy)||1;
      g.globalAlpha = (0.34 + 0.52*near) * (0.45+0.55*strength);
      chevron(g,x,y,{x:dx/L,y:dy/L}, s, lw);
    }
  });
  g.globalAlpha=1;
}

/* ---------- the ASSIGNED CORRIDOR: two rails with a pale floor between them,
   and one-way floor chevrons. This is the constraint made visible. ---------- */
function drawCorridor(pen,g,W,H,S,phase){
  const hw = W*params.halfWidth;
  const L=[], R=[];
  for(const q of S){
    const nx=-q.ty, ny=q.tx;
    const w = hw*(0.82+0.34*q.u);                     // opens slightly toward the end
    L.push({ x:q.x+nx*w, y:q.y+ny*w });
    R.push({ x:q.x-nx*w, y:q.y-ny*w });
  }
  // pale floor
  g.beginPath(); g.moveTo(L[0].x,L[0].y);
  for(let i=1;i<L.length;i++) g.lineTo(L[i].x,L[i].y);
  for(let i=R.length-1;i>=0;i--) g.lineTo(R[i].x,R[i].y);
  g.closePath(); g.fillStyle=inkLevel(2); g.fill();
  // rails: hard contour, drawn as two separate strokes (no closed slab outline)
  for(const rail of [L,R]){
    g.strokeStyle=INK; g.lineWidth=Math.max(2.6,W*0.0072); g.lineCap="round"; g.lineJoin="round";
    g.beginPath(); g.moveTo(rail[0].x,rail[0].y);
    for(let i=1;i<rail.length;i++) g.lineTo(rail[i].x,rail[i].y);
    g.stroke();
  }
  // one-way floor chevrons, marching downstream — the corridor admits one heading
  for(let k=0;k<8;k++){
    const u = ((k+0.5)/8 + (phase*0.03)%(1/8));
    const q = atU(S, u%1);
    chevron(g,q.x,q.y,{x:q.tx,y:q.ty}, W*0.026, Math.max(2.6,W*0.0062));
  }
}

/* ---------- SOURCE: the design pin. Fixed anchor, cross-haired, sworn ticks. */
function drawPin(pen,g,W,H,phase){
  const cx=W*params.pinX, cy=H*params.pinY, r=W*0.046;
  for(let k=0;k<10;k++){
    const a=k/10*TAU + phase*0.06;
    const r0=r*1.35, r1=r*(1.75+0.16*Math.sin(phase*1.4+k));
    g.strokeStyle=INK; g.lineWidth=Math.max(1.4,W*0.0032); g.lineCap="round";
    g.beginPath(); g.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
    g.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1); g.stroke();
  }
  // anchor plate: a squat bracket above the pin, clear of it
  pen.paint(()=>{
    g.moveTo(cx-r*1.02, cy-r*1.96); g.lineTo(cx+r*1.02, cy-r*1.96);
    g.lineTo(cx+r*0.74, cy-r*1.50); g.lineTo(cx-r*0.74, cy-r*1.50); g.closePath();
  }, toneSolid(inkLevel(4)), Math.max(3,W*0.006));
  g.strokeStyle=INK; g.lineWidth=Math.max(2.4,W*0.0058); g.lineCap="round";
  g.beginPath(); g.moveTo(cx,cy-r*1.48); g.lineTo(cx,cy-r*1.02); g.stroke();
  // the pin body: a heavy annulus with a cross-hair, not a solid blob
  pen.paint(()=>{ g.arc(cx,cy,r,0,TAU); }, toneSolid(inkLevel(6)), Math.max(3,W*0.008));
  pen.paint(()=>{ g.arc(cx,cy,r*0.58,0,TAU); }, toneSolid(inkLevel(0)), Math.max(2.4,W*0.0055));
  g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.0048); g.lineCap="round";
  g.beginPath();
  g.moveTo(cx-r*0.40,cy); g.lineTo(cx+r*0.40,cy);
  g.moveTo(cx,cy-r*0.40); g.lineTo(cx,cy+r*0.40);
  g.stroke();
}

/* ---------- the offered EXIT: a doorway in plan (two jambs + a swung leaf +
   an outbound arrow) struck through by a heavy prohibition bar. ---------- */
function drawDoor(pen,g,W,H,shut){
  // an elevation doorway: two posts, a lintel, an open paper aperture
  const cx=W*params.doorX, cy=H*params.doorY;
  const u=W*0.047;                       // post half-thickness unit
  const hw=u*1.55, hh=u*2.30;            // aperture half-width / half-height
  g.fillStyle=inkLevel(0);
  g.fillRect(cx-hw-u*0.6, cy-hh-u*0.7, (hw+u*0.6)*2, (hh+u*0.7)*2);
  const post=(x)=> pen.paint(()=>{
    g.moveTo(x-u*0.30, cy-hh); g.lineTo(x+u*0.30, cy-hh);
    g.lineTo(x+u*0.30, cy+hh); g.lineTo(x-u*0.30, cy+hh); g.closePath();
  }, toneSolid(inkLevel(4)), Math.max(2.8,W*0.0068));
  post(cx-hw); post(cx+hw);
  // lintel (short — spans the posts only, never the plate)
  pen.paint(()=>{
    g.moveTo(cx-hw-u*0.44, cy-hh-u*0.62); g.lineTo(cx+hw+u*0.44, cy-hh-u*0.62);
    g.lineTo(cx+hw+u*0.44, cy-hh);        g.lineTo(cx-hw-u*0.44, cy-hh); g.closePath();
  }, toneSolid(inkLevel(5)), Math.max(2.8,W*0.0068));
  // threshold ticks instead of a sill bar
  g.strokeStyle=INK; g.lineWidth=Math.max(2.6,W*0.0062); g.lineCap="round";
  g.beginPath();
  g.moveTo(cx-hw-u*0.5, cy+hh); g.lineTo(cx-hw+u*0.5, cy+hh);
  g.moveTo(cx+hw-u*0.5, cy+hh); g.lineTo(cx+hw+u*0.5, cy+hh);
  g.stroke();
  // the leaf, swung open outward past the left post (light: genuinely open)
  pen.paint(()=>{
    g.moveTo(cx-hw-u*0.30, cy-hh*0.86);
    g.lineTo(cx-hw-u*1.55, cy-hh*0.56);
    g.lineTo(cx-hw-u*1.55, cy+hh*0.62);
    g.lineTo(cx-hw-u*0.30, cy+hh*0.86); g.closePath();
  }, toneSolid(inkLevel(2)), Math.max(2.4,W*0.0055));
  // outbound arrow through the opening, pointing off the plate
  g.strokeStyle=INK; g.lineWidth=Math.max(2.6,W*0.0062); g.lineCap="round";
  g.beginPath(); g.moveTo(cx+hw-u*0.2, cy); g.lineTo(cx-hw+u*0.5, cy); g.stroke();
  arrowhead(g,{x:cx-hw+u*0.24,y:cy},{x:-1,y:0}, W*0.022);
  // prohibition bar — the exit stays open and stays unusable. A paper underlay
  // keeps the slash separate from the frame it crosses.
  g.save(); g.globalAlpha = 0.35+0.65*clamp01(shut);
  g.lineCap="round";
  g.strokeStyle=inkLevel(0); g.lineWidth=Math.max(10,W*0.030);
  g.beginPath(); g.moveTo(cx-hw-u*0.9, cy+hh+u*0.5); g.lineTo(cx+hw+u*0.9, cy-hh-u*0.5); g.stroke();
  g.strokeStyle=INK; g.lineWidth=Math.max(5,W*0.016);
  g.beginPath(); g.moveTo(cx-hw-u*0.8, cy+hh+u*0.4); g.lineTo(cx+hw+u*0.8, cy-hh-u*0.4); g.stroke();
  g.restore();
}

/* ---------- CONSEQUENCE: the assigned station. Keyed dark square, crossed,
   with a fallen glyph and the spear stroke that will take him from behind. */
function drawStation(pen,g,W,H,S,lit){
  const e = atU(S,1.0);
  const u = W*0.086;
  const cx=e.x, cy=e.y;
  // key frame: a hollow border, not a filled slab, so the station stays open
  pen.paint(()=>{
    g.moveTo(cx-u, cy-u*0.86); g.lineTo(cx+u, cy-u*0.86);
    g.lineTo(cx+u, cy+u*0.86); g.lineTo(cx-u, cy+u*0.86); g.closePath();
  }, toneSolid(inkLevel(lit>0.5?4:3)), Math.max(3.4,W*0.0085));
  pen.paint(()=>{
    g.moveTo(cx-u*0.80, cy-u*0.64); g.lineTo(cx+u*0.80, cy-u*0.64);
    g.lineTo(cx+u*0.80, cy+u*0.64); g.lineTo(cx-u*0.80, cy+u*0.64); g.closePath();
  }, toneSolid(inkLevel(0)), Math.max(2.6,W*0.006));
  // the fallen body: a blocky prone glyph in the aperture
  pen.paint(()=>{
    g.moveTo(cx-u*0.60, cy+u*0.06); g.lineTo(cx+u*0.20, cy+u*0.06);
    g.lineTo(cx+u*0.20, cy+u*0.36); g.lineTo(cx-u*0.60, cy+u*0.36); g.closePath();
  }, toneSolid(inkLevel(6)), Math.max(2.6,W*0.0062));
  pen.paint(()=>{ g.arc(cx+u*0.38, cy+u*0.21, u*0.15, 0, TAU); }, toneSolid(inkLevel(6)), Math.max(2.2,W*0.005));
  // the spear stroke, entering from behind
  g.strokeStyle=INK; g.lineWidth=Math.max(2.8,W*0.0072); g.lineCap="round";
  g.beginPath(); g.moveTo(cx-u*0.62, cy-u*0.48); g.lineTo(cx-u*0.10, cy-u*0.02); g.stroke();
  arrowhead(g,{x:cx+u*0.00,y:cy+u*0.06},{x:0.75,y:0.66}, W*0.018);
  // corner keys, so the station reads as a fixed appointment
  g.lineWidth=Math.max(2.2,W*0.005);
  for(const sx of [-1,1]) for(const sy of [-1,1]){
    g.beginPath();
    g.moveTo(cx+sx*u*1.24, cy+sy*u*0.72); g.lineTo(cx+sx*u*1.24, cy+sy*u*1.02);
    g.lineTo(cx+sx*u*0.86, cy+sy*u*1.02); g.stroke();
  }
}

/* ---------- TARGET: Amphinomus as a plan-view token, collared and tethered. */
function drawToken(pen,g,W,H,q,hesit){
  const u=W*0.036;
  const dir={x:q.tx,y:q.ty};
  // will vector (short, dashed, pushing back up the corridor)
  if(hesit>0.02){
    const L=u*(1.6+2.4*hesit);
    const bx=q.x-dir.x*u*1.6, by=q.y-dir.y*u*1.6;
    g.strokeStyle=inkLevel(0); g.lineWidth=Math.max(8,W*0.020); g.lineCap="round";
    g.beginPath(); g.moveTo(bx,by); g.lineTo(bx-dir.x*(L+u*0.5), by-dir.y*(L+u*0.5)); g.stroke();
    dashed(g,[{x:bx,y:by},{x:bx-dir.x*L,y:by-dir.y*L}], Math.max(2.4,W*0.0055), 0, [W*0.016,W*0.013]);
    arrowhead(g,{x:bx-dir.x*(L+u*0.1),y:by-dir.y*(L+u*0.1)},{x:-dir.x,y:-dir.y}, W*0.017);
  }
  // doom vector (long, solid, downstream — always the longer of the two).
  // A paper underlay lifts it off the corridor floor it runs down.
  const D=u*4.6;
  g.lineCap="round";
  g.strokeStyle=inkLevel(0); g.lineWidth=Math.max(11,W*0.026);
  g.beginPath(); g.moveTo(q.x+dir.x*u*1.2, q.y+dir.y*u*1.2);
  g.lineTo(q.x+dir.x*(D+u*0.7), q.y+dir.y*(D+u*0.7)); g.stroke();
  g.strokeStyle=INK; g.lineWidth=Math.max(3.4,W*0.0088);
  g.beginPath(); g.moveTo(q.x+dir.x*u*1.2, q.y+dir.y*u*1.2);
  g.lineTo(q.x+dir.x*D, q.y+dir.y*D); g.stroke();
  arrowhead(g,{x:q.x+dir.x*(D+u*0.55),y:q.y+dir.y*(D+u*0.55)}, dir, W*0.026);
  // collar: a punched paper aperture, then the tether's grip ring
  pen.paint(()=>{ g.arc(q.x,q.y,u*1.60,0,TAU); }, toneSolid(inkLevel(0)), Math.max(2.4,W*0.0055));
  // body: blocky, squared to its heading
  g.save(); g.translate(q.x,q.y); g.rotate(Math.atan2(dir.y,dir.x));
  pen.paint(()=>{
    g.moveTo(-u*0.72,-u*0.86); g.lineTo(u*0.46,-u*0.86);
    g.lineTo(u*0.86,0); g.lineTo(u*0.46,u*0.86); g.lineTo(-u*0.72,u*0.86); g.closePath();
  }, toneSolid(inkLevel(6)), Math.max(3,W*0.0075));
  g.restore();
}

/* ---------- the tether: taut from the pin to the token, with a bight ---- */
function drawTether(g,W,H,pin,q,tight){
  const sag = (1-clamp01(tight))*H*0.075;
  const mx=(pin.x+q.x)/2 + W*0.030, my=(pin.y+q.y)/2 + sag;
  g.strokeStyle=INK; g.lineWidth=Math.max(2.4,W*0.0058); g.lineCap="round";
  g.beginPath(); g.moveTo(pin.x,pin.y); g.quadraticCurveTo(mx,my,q.x,q.y); g.stroke();
  // tension ticks along the line, crowding as it tightens
  const n=6;
  for(let i=1;i<=n;i++){
    const s=i/(n+1), inv=1-s;
    const x=inv*inv*pin.x+2*inv*s*mx+s*s*q.x;
    const y=inv*inv*pin.y+2*inv*s*my+s*s*q.y;
    const dx=2*inv*(mx-pin.x)+2*s*(q.x-mx), dy=2*inv*(my-pin.y)+2*s*(q.y-my);
    const L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L, t=W*(0.008+0.006*tight);
    g.lineWidth=Math.max(1.6,W*0.0036);
    g.beginPath(); g.moveTo(x-nx*t,y-ny*t); g.lineTo(x+nx*t,y+ny*t); g.stroke();
  }
}

/* ---------- the aborted ESCAPE arc: out toward the door, hook, returned ---- */
function drawEscape(g,W,H,S,q,amt,off){
  if(amt<=0.02) return;
  const back = atU(S, clamp01(0.62));
  const pts=[];
  const A={x:q.x,y:q.y};
  const B={x:W*0.250, y:H*0.335};      // he really does break for the door
  const C={x:W*0.088, y:H*0.628};      // and loses his nerve short of it
  const D={x:back.x-W*0.075, y:back.y+H*0.012};
  const N=30, shown=Math.round(N*clamp01(amt));
  for(let i=0;i<=shown;i++){
    const s=i/N, inv=1-s;
    pts.push({
      x: inv*inv*inv*A.x + 3*inv*inv*s*B.x + 3*inv*s*s*C.x + s*s*s*D.x,
      y: inv*inv*inv*A.y + 3*inv*inv*s*B.y + 3*inv*s*s*C.y + s*s*s*D.y,
    });
  }
  if(pts.length<2) return;
  g.save();
  dashed(g,pts,Math.max(3.2,W*0.0080),off,[W*0.024,W*0.018]);
  g.restore();
  // the point where the break for the door fails: a small stalled tick
  if(amt>0.45){
    const m=pts[Math.min(pts.length-1,Math.round(N*0.42))];
    g.strokeStyle=INK; g.lineWidth=Math.max(2.4,W*0.0055); g.lineCap="round";
    g.beginPath();
    g.moveTo(m.x-W*0.017,m.y-W*0.017); g.lineTo(m.x+W*0.017,m.y+W*0.017);
    g.moveTo(m.x+W*0.017,m.y-W*0.017); g.lineTo(m.x-W*0.017,m.y+W*0.017);
    g.stroke();
  }
  if(amt>0.9){
    const a=pts[pts.length-2], b=pts[pts.length-1];
    const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1;
    arrowhead(g,b,{x:dx/L,y:dy/L}, W*0.021);   // returned to the corridor
  }
}

/* ---------- PULL GAUGE: seven stacked blocks on the right margin. Geometry,
   not type — it survives the dot lattice at any size. ---------- */
function drawGauge(pen,g,W,H,level){
  const x0=W*0.888, x1=W*0.952, y0=H*0.300, y1=H*0.790;
  const n=params.gaugeSteps, gap=(y1-y0)*0.055, hgt=((y1-y0)-gap*(n-1))/n;
  for(let i=0;i<n;i++){
    const yy = y1 - (i+1)*hgt - i*gap;
    const on = (i/n) < level;
    pen.paint(()=>{ g.moveTo(x0,yy); g.lineTo(x1,yy); g.lineTo(x1,yy+hgt); g.lineTo(x0,yy+hgt); g.closePath(); },
      toneSolid(inkLevel(on ? 3+Math.round(i*0.5) : 0)), Math.max(2.2,W*0.005));
  }
  // the fixed head bracket the gauge reads against
  g.strokeStyle=INK; g.lineWidth=Math.max(2.4,W*0.0058); g.lineCap="round";
  g.beginPath();
  g.moveTo(x0-W*0.014, y0-H*0.018); g.lineTo(x1, y0-H*0.018);
  g.moveTo(x1, y0-H*0.018); g.lineTo(x1, y0-H*0.004);
  g.stroke();
}

/* ============================================================ */
function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.42);
  const pull=clamp01(st.pull ?? smooth(0.25+t*0.85));
  const hesitation=clamp01(st.hesitation ?? (t<0.62 ? 0.30+0.70*Math.sin(clamp01(t/0.62)*Math.PI) : 0.10));
  const escape=clamp01(st.escape ?? (t<0.20 ? t/0.20 : t<0.66 ? 1 : clamp01((1-t)/0.34)));
  const layers=st.layers || ["field","corridor","door","escape","tether","source","token","consequence","gauge"];
  const has=l=>layers.includes(l);
  const phase=t*params.flow*0.5;
  const off=-t*params.flow*11;

  const S=sampleRoute(params.route,W,H);
  const pin={ x:W*params.pinX, y:H*params.pinY };
  // he is held: even at t=0 he is already on the route, and t only advances him.
  const uTok = 0.06 + 0.80*smooth(t);
  const q = atU(S, uTok);

  // paper field
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,H);

  if(has("field"))       drawPullField(g,W,H,S,pull,phase);
  if(has("corridor"))    drawCorridor(pen,g,W,H,S,phase);
  if(has("door"))        drawDoor(pen,g,W,H, 0.25+0.75*t);
  if(has("escape"))      drawEscape(g,W,H,S,q,escape,off);
  if(has("tether"))      drawTether(g,W,H,pin,q,pull);
  if(has("source"))      drawPin(pen,g,W,H,phase);
  if(has("token"))       drawToken(pen,g,W,H,q,hesitation);
  if(has("consequence")) drawStation(pen,g,W,H,S,t);
  if(has("gauge"))       drawGauge(pen,g,W,H,pull);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine-fx.doom-pull",
  type:"DIVINE_FX",
  name:"Doom pull",
  statusWord:"HELD",
  scene:"OD-B18-S03",

  params,
  // back -> front; a scene may pass a subset to stage the effect in pieces
  layers:["field","corridor","door","escape","tether","source","token","consequence","gauge"],
  // normalized 0..1 source / target / field / outcome / camera anchors
  anchors:{
    "source:design-pin":   { x:0.560, y:0.138 },  // Athena's fixed anchor
    "target:amphinomus":   { x:0.395, y:0.470 },  // token's neutral station on the route
    "field:corridor-head": { x:0.345, y:0.250 },  // where the constraint takes hold
    "field:corridor-mid":  { x:0.480, y:0.610 },
    "exit:refused-door":   { x:0.190, y:0.292 },  // the offered, unusable exit
    "outcome:assigned-death":{ x:0.706, y:0.862 },// the station in Book XXII
    "gauge:pull":          { x:0.920, y:0.545 },
    "camera:wide":         { x:0.500, y:0.500 },
  },
  // diagram bands
  zones:{
    field:    { x0:0.05, y0:0.18, x1:0.86, y1:0.96 },
    corridor: { x0:0.25, y0:0.20, x1:0.79, y1:0.94 },
    exit:     { x0:0.04, y0:0.20, x1:0.26, y1:0.42 },
    gauge:    { x0:0.87, y0:0.28, x1:0.97, y1:0.80 },
  },
  // DIVINE_FX state machine: the exit is offered, refused for him, and closed
  states:{
    initial:"constrained",
    nodes:{
      offered:{     preview:{ t:0.16, pull:0.30, hesitation:0.55, escape:0.55,
                              status:"OFFERED",  progress:0.16,
                              layers:["field","corridor","door","escape","tether","source","token","gauge"] } },
      constrained:{ preview:{ t:0.42, pull:0.62, hesitation:0.95, escape:1.00,
                              status:"HELD",     progress:0.42 } },
      returned:{    preview:{ t:0.70, pull:0.86, hesitation:0.30, escape:0.42,
                              status:"RETURNED", progress:0.70 } },
      assigned:{    preview:{ t:1.00, pull:1.00, hesitation:0.04, escape:0.00,
                              status:"ASSIGNED", progress:1.00 } },
    },
    edges:[["offered","constrained"],["constrained","returned"],["returned","assigned"],
           ["constrained","assigned"]],
  },
  duration:6.0,
  // channels the runtime can drive over the scene clock
  channels:["t","pull","hesitation","escape","flow"],

  // neutral preview: he is on the corridor, the escape arc is fully drawn and
  // already hooking back, the tether has taken up most of its slack.
  preview:()=>({ t:0.42, pull:0.62, hesitation:0.95, escape:1.00,
                 status:"HELD", progress:0.42 }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
