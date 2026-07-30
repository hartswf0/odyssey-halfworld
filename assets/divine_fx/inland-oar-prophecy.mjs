/* divine_fx.inland-oar-prophecy — Tiresias' SECOND prophecy drawn as a
   one-way route out of the sea culture and into a land with no word for the sea.
   DIVINE_FX asset.

   Scene function (OD-B23-S05): Odysseus, restored beside Penelope, recites the
   last labour — take a well-cut oar and walk inland until he meets a people who
   know nothing of the sea, whose eyes read the blade on his shoulder as a
   WINNOWING FAN. That misreading is the sign: there he plants the oar, makes the
   threefold offering, and turns home.

   DIVINE_FX contract:
     SOURCE      the oracle node at the sea edge (the prophecy issuing)
     FIELD       the inland route — a stepped one-way path, with a quantized
                 SEA-KNOWLEDGE gauge falling to zero along it (5 blocks -> none)
     TRANSFORM   the same silhouette read twice: LEFT panel reads it as an OAR
                 (swell, rowlock, drip), RIGHT panel reads the identical shape as
                 a WINNOWING FAN (threshing floor, grain heap, tossed grain).
                 The `phase` channel resolves which reading holds; a "reads-as"
                 node sits on the boundary between them.
     CONSEQUENCE the oar planted in inland earth as a marker, offering smoke
                 rising, the route closed with a check.
   Animates over state.t: the borne-oar token walks the route, the route dashes
   flow, the tossed grain rises and falls, the offering smoke drifts.

   Solid grays + hard black contour, engine primitives only; the engine POST pass
   supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- normalized geometry (0..1 asset space, portrait) ---- */
const SEA   = { y0:0.055, y1:0.245, x0:0.045, x1:0.955 };
const SRC   = { x:0.160, y:0.132 };                 // oracle node at the sea edge
const SHIP  = { x:0.720, y:0.168 };                 // the culture being left
/* the inland route: one-way, stepped, always further from the water */
const ROUTE = [
  { x:0.300, y:0.252 },  { x:0.300, y:0.348 },
  { x:0.520, y:0.348 },  { x:0.520, y:0.438 },
  { x:0.735, y:0.438 },  { x:0.735, y:0.527 },
  { x:0.800, y:0.527 },
];
const PLANT = { x:0.862, y:0.548 };                 // oar planted / offering made
const GAUGE = { x:0.062, y0:0.318, y1:0.512, rows:6 };
const PANEL_L = { x0:0.058, y0:0.598, x1:0.428, y1:0.944, cx:0.243, cy:0.775 };
const PANEL_R = { x0:0.572, y0:0.598, x1:0.942, y1:0.944, cx:0.757, cy:0.775 };
const READS  = { x:0.500, y:0.762 };                // the "reads-as" boundary node

const params = {
  flow:20,          // marching-ants speed along the route
  tilt:0.26,        // tilt of the silhouette in the winnowing reading (radians)
  oarTilt:0.44,     // tilt of the SAME silhouette shipped in a rowlock
  grains:12,        // tossed grain flecks in the winnowing reading
  knowledge:5,      // sea-knowledge blocks at the shore (falls to 0 inland)
  route:ROUTE, plant:PLANT, reads:READS,
};

/* ---------- small shared drawing helpers ---------- */
/* a horizontal run BROKEN into segments — never a full-width bar */
function brokenRun(g, y, x0, x1, segs, lw, duty=0.66){
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round";
  const span=(x1-x0)/segs;
  for(let i=0;i<segs;i++){
    const a=x0+i*span, b=a+span*duty;
    g.beginPath(); g.moveTo(a,y); g.lineTo(b,y); g.stroke();
  }
}
/* a short row of swell, drawn as linked shallow arcs */
function swell(g, x0, x1, y, amp, step, lw, alpha=1){
  g.save(); g.globalAlpha=alpha;
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round";
  g.beginPath(); g.moveTo(x0,y);
  for(let x=x0;x<x1;x+=step) g.quadraticCurveTo(x+step*0.5, y-amp, x+step, y);
  g.stroke(); g.restore();
}
function arrowhead(g, p, dir, s){
  const nx=-dir.y, ny=dir.x;
  g.fillStyle=INK; g.beginPath();
  g.moveTo(p.x,p.y);
  g.lineTo(p.x-dir.x*s+nx*s*0.6, p.y-dir.y*s+ny*s*0.6);
  g.lineTo(p.x-dir.x*s-nx*s*0.6, p.y-dir.y*s-ny*s*0.6);
  g.closePath(); g.fill();
}
function dashedPath(g, pts, lw, off, dash){
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round"; g.lineJoin="round";
  g.setLineDash(dash); g.lineDashOffset=off;
  g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
  for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x, pts[i].y);
  g.stroke(); g.setLineDash([]);
}
/* corner brackets instead of a closed rectangle (no striping bars) */
function bracketFrame(g, x0, y0, x1, y1, len, lw){
  g.strokeStyle=INK; g.lineWidth=lw; g.lineCap="round";
  const C=[[x0,y0,1,1],[x1,y0,-1,1],[x1,y1,-1,-1],[x0,y1,1,-1]];
  for(const [x,y,sx,sy] of C){
    g.beginPath(); g.moveTo(x+sx*len,y); g.lineTo(x,y); g.lineTo(x,y+sy*len); g.stroke();
  }
}
function checkMark(g, cx, cy, r){
  g.fillStyle=inkLevel(0); g.beginPath(); g.arc(cx,cy,r*1.30,0,TAU); g.fill();
  g.strokeStyle=INK; g.lineWidth=Math.max(2,r*0.30); g.lineJoin="round"; g.lineCap="round";
  g.beginPath(); g.arc(cx,cy,r,0,TAU); g.stroke();
  g.beginPath(); g.moveTo(cx-r*0.50,cy+r*0.02); g.lineTo(cx-r*0.08,cy+r*0.46);
  g.lineTo(cx+r*0.56,cy-r*0.44); g.stroke();
}
/* domain badges — drawn as GEOMETRY, never small type */
function seaBadge(g, pen, cx, cy, r){
  pen.paint(()=>{ g.arc(cx,cy,r,0,TAU); }, toneSolid(inkLevel(1)), Math.max(2,r*0.16));
  g.strokeStyle=INK; g.lineWidth=Math.max(2,r*0.17); g.lineCap="round";
  for(let k=-1;k<=1;k++){
    const y=cy+k*r*0.45;
    g.beginPath(); g.moveTo(cx-r*0.62,y);
    g.quadraticCurveTo(cx-r*0.21,y-r*0.30,cx,y);
    g.quadraticCurveTo(cx+r*0.21,y+r*0.30,cx+r*0.62,y);
    g.stroke();
  }
}
function grainBadge(g, pen, cx, cy, r){
  pen.paint(()=>{ g.arc(cx,cy,r,0,TAU); }, toneSolid(inkLevel(1)), Math.max(2,r*0.16));
  g.strokeStyle=INK; g.lineWidth=Math.max(2,r*0.15); g.lineCap="round";
  g.beginPath(); g.moveTo(cx,cy+r*0.66); g.lineTo(cx,cy-r*0.62); g.stroke();  // stalk
  for(let k=0;k<3;k++){                                                        // ears
    const y=cy-r*0.10-k*r*0.26, w=r*0.44-k*r*0.09;
    g.beginPath(); g.moveTo(cx-w,y+r*0.16); g.lineTo(cx,y-r*0.06); g.lineTo(cx+w,y+r*0.16); g.stroke();
  }
}

/* ---------- THE ONE SILHOUETTE, read two ways ----------
   Identical shape in both panels; only the tilt mirrors and only the
   surrounding evidence changes. That is the whole prophecy. */
function bladeSilhouette(g, pen, cx, cy, u, ang, extras){
  g.save(); g.translate(cx,cy); g.rotate(ang);
  // long thin shaft — a hand tool, no foot, no bowl
  pen.limb(()=>{ g.moveTo(0,u*1.50); g.lineTo(0,-u*0.20); }, toneSolid(inkLevel(4)), Math.max(2,u*0.055));
  // the ambiguous plane: a flat PARALLEL-SIDED paddle with a squared tip —
  // short neck, straight edges. Light fill so the plane stays paper.
  pen.paint(()=>{
    g.moveTo(-u*0.09,-u*0.10);
    g.lineTo(-u*0.46,-u*0.34);      // short neck, opening fast
    g.lineTo(-u*0.52,-u*0.54);
    g.lineTo(-u*0.52,-u*1.66);      // straight side
    g.lineTo(-u*0.44,-u*1.80);      // clipped tip corner
    g.lineTo( u*0.44,-u*1.80);
    g.lineTo( u*0.52,-u*1.66);
    g.lineTo( u*0.52,-u*0.54);
    g.lineTo( u*0.46,-u*0.34);
    g.lineTo( u*0.09,-u*0.10);
    g.closePath();
  }, toneSolid(inkLevel(1)), Math.max(3,u*0.050));
  // spine + two straight ribs (keeps the plane light but structured)
  g.strokeStyle=INK; g.lineWidth=Math.max(1.6,u*0.036); g.lineCap="round";
  g.beginPath(); g.moveTo(0,-u*0.26); g.lineTo(0,-u*1.72); g.stroke();
  g.lineWidth=Math.max(1.2,u*0.022); g.globalAlpha=0.6;
  for(const s of [-1,1]){
    g.beginPath(); g.moveTo(s*u*0.28,-u*0.62); g.lineTo(s*u*0.28,-u*1.64); g.stroke();
  }
  g.globalAlpha=1;
  // two grip bands near the butt (a held tool, not a stem on a base)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,u*0.05);
  for(const d of [1.16,1.34]){
    g.beginPath(); g.moveTo(-u*0.11,u*d); g.lineTo(u*0.11,u*d); g.stroke();
  }
  if (extras) extras();                       // evidence drawn IN the tool's own frame
  g.restore();
}

/* LEFT reading — the sea's reading: this is an OAR */
function oarReading(g, pen, P, W, H, u, t){
  const cx=P.cx*W, cy=P.cy*H;
  bracketFrame(g, P.x0*W, P.y0*H, P.x1*W, P.y1*H, W*0.036, Math.max(2,W*0.006));
  const dy=-u*0.20;
  // open water beyond the boat's side (short rows, low end only)
  swell(g, cx+u*0.30, cx+u*1.45, cy+u*1.45, u*0.22, u*0.48, Math.max(2,u*0.052), 0.9);
  swell(g, cx+u*0.05, cx+u*1.20, cy+u*1.72, u*0.19, u*0.44, Math.max(2,u*0.046), 0.7);
  // the oar itself, shipped through the rowlock
  bladeSilhouette(g, pen, cx, cy+dy, u, params.oarTilt);
  // the boat's side: a light DIAGONAL plane rising to the right that occludes the
  // inboard handle — the shape is unmistakably an oar over a gunwale
  pen.fillPath(()=>{                       // no outline: no hard side edges
    g.moveTo(cx-u*1.50, cy+u*1.00);
    g.lineTo(cx+u*1.45, cy+u*0.20);
    g.lineTo(cx+u*1.45, cy+u*0.86);
    g.lineTo(cx-u*1.50, cy+u*1.62);
    g.closePath();
  }, inkLevel(1));
  // the rail itself: the one hard edge on the boat
  g.strokeStyle=INK; g.lineWidth=Math.max(3,u*0.070); g.lineCap="round";
  g.beginPath(); g.moveTo(cx-u*1.50, cy+u*1.00); g.lineTo(cx+u*1.45, cy+u*0.20); g.stroke();
  // hull bottom + two plank seams (diagonal, never horizontal bars)
  g.lineWidth=Math.max(2,u*0.034);
  g.beginPath(); g.moveTo(cx-u*1.50, cy+u*1.62); g.lineTo(cx+u*1.45, cy+u*0.86); g.stroke();
  g.lineWidth=Math.max(1.2,u*0.024); g.globalAlpha=0.55;
  for(const d of [0.28,0.48]){
    g.beginPath(); g.moveTo(cx-u*1.50, cy+u*(1.00+d)); g.lineTo(cx+u*1.45, cy+u*(0.20+d)); g.stroke();
  }
  g.globalAlpha=1;
  // rowlock: the fitting that only makes sense at sea — a loop collar riding the
  // rail with two thole pins, drawn in the oar's own frame ON TOP of the hull
  g.save(); g.translate(cx, cy+dy); g.rotate(params.oarTilt);
  pen.paint(()=>{ g.ellipse(0, u*1.00, u*0.36, u*0.15, 0, 0, TAU); },
            toneSolid(inkLevel(0)), Math.max(2,u*0.050));
  g.strokeStyle=INK; g.lineWidth=Math.max(2,u*0.048); g.lineCap="round";
  for(const s of [-1,1]){
    g.beginPath(); g.moveTo(s*u*0.30, u*0.92); g.lineTo(s*u*0.36, u*0.60); g.stroke();
  }
  // drip running off the blade tip (it has just come out of the water)
  g.fillStyle=INK;
  for(let k=0;k<3;k++){
    const fall=((t*0.9+k*0.33)%1);
    g.beginPath(); g.arc(u*(0.70+k*0.16), -u*(1.62-fall*0.62), u*0.070, 0, TAU); g.fill();
  }
  g.restore();
  seaBadge(g, pen, P.x0*W+W*0.050, P.y0*H+H*0.032, W*0.031);
}

/* RIGHT reading — the inland reading: the identical shape is a WINNOWING FAN */
function fanReading(g, pen, P, W, H, u, t){
  const cx=P.cx*W, cy=P.cy*H;
  bracketFrame(g, P.x0*W, P.y0*H, P.x1*W, P.y1*H, W*0.036, Math.max(2,W*0.006));
  // threshing floor: a broken ground run, not a full bar
  brokenRun(g, cy+u*1.66, cx-u*1.35, cx+u*1.48, 4, Math.max(1.8,u*0.055), 0.70);
  // heap of winnowed grain under the fall, offset RIGHT of the shaft butt
  pen.paint(()=>{
    g.moveTo(cx+u*0.20, cy+u*1.64);
    g.quadraticCurveTo(cx+u*0.86, cy+u*1.02, cx+u*1.40, cy+u*1.64);
    g.closePath();
  }, toneSolid(inkLevel(2)), Math.max(2,u*0.055));
  g.strokeStyle=INK; g.lineWidth=Math.max(1.1,u*0.026); g.globalAlpha=0.6; g.lineCap="round";
  for(let i=0;i<4;i++){ const x=cx+u*(0.38+i*0.26);
    g.beginPath(); g.moveTo(x,cy+u*1.58); g.lineTo(x+u*0.11,cy+u*1.42); g.stroke(); }
  g.globalAlpha=1;
  const ang=params.tilt*1.35;
  bladeSilhouette(g, pen, cx, cy-u*0.10, u, ang);
  // mid-toss: grain thrown up off the blade, then falling as a curtain into the
  // heap — the plane is clearly being USED to winnow, not stood on a base
  const tipx=cx+Math.sin(ang)*u*1.80, tipy=cy-u*0.10-Math.cos(ang)*u*1.80;
  g.fillStyle=INK;
  for(let k=0;k<params.grains;k++){
    const p=((k/params.grains)+t*0.55)%1;
    const a=lerp(-2.10,-0.35,p);                      // the throw arc off the blade
    const gx=tipx+u*0.20+Math.cos(a)*u*0.70;
    const gy=tipy+u*0.15+Math.sin(a)*u*0.45;
    const r=u*(0.044+0.020*((k%3)/2));
    g.beginPath(); g.arc(gx,gy,r,0,TAU); g.fill();
  }
  for(let k=0;k<10;k++){                              // the falling curtain
    const p=((k/10)+t*0.8)%1;
    const gx=tipx+u*(0.60+0.16*Math.sin(k*2.3));
    const gy=lerp(tipy+u*0.34, cy+u*1.34, p);
    g.beginPath(); g.arc(gx,gy,u*(0.036+0.014*(k%2)),0,TAU); g.fill();
  }
  // chaff blowing off downwind, kept inboard of the panel edge
  g.strokeStyle=INK; g.lineWidth=Math.max(1.3,u*0.034); g.lineCap="round"; g.globalAlpha=0.75;
  for(let k=0;k<3;k++){
    const y=tipy-u*(0.10+k*0.18), x=tipx-u*(0.34+k*0.16);
    g.beginPath(); g.moveTo(x,y); g.lineTo(x-u*0.26,y-u*0.12); g.stroke();
  }
  g.globalAlpha=1;
  grainBadge(g, pen, P.x0*W+W*0.050, P.y0*H+H*0.032, W*0.031);
}

/* the boundary node: "this reads as that" — geometry, no type */
function readsAsNode(g, pen, cx, cy, r){
  pen.paint(()=>{ g.arc(cx,cy,r,0,TAU); }, toneSolid(inkLevel(1)), Math.max(3,r*0.20));
  g.strokeStyle=INK; g.lineWidth=Math.max(3,r*0.24); g.lineCap="round";
  for(const s of [-1,1]){
    const y=cy+s*r*0.30;
    g.beginPath(); g.moveTo(cx-r*0.52,y);
    g.quadraticCurveTo(cx-r*0.17,y-r*0.26,cx,y);
    g.quadraticCurveTo(cx+r*0.17,y+r*0.26,cx+r*0.52,y);
    g.stroke();
  }
}

/* SOURCE — the oracle at the sea edge, prophecy issuing outward */
function oracleSource(g, pen, cx, cy, r, t){
  g.strokeStyle=INK; g.lineCap="round";
  for(let k=0;k<10;k++){
    const a=k/10*TAU + t*0.14;
    const r0=r*1.20, r1=r*(1.50+0.14*Math.sin(t*2+k));
    g.lineWidth=Math.max(1.4,r*0.09);
    g.beginPath(); g.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
    g.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1); g.stroke();
  }
  pen.paint(()=>{ g.moveTo(cx,cy-r); g.lineTo(cx+r,cy); g.lineTo(cx,cy+r); g.lineTo(cx-r,cy); g.closePath(); },
            toneSolid(inkLevel(3)), Math.max(3,r*0.16));
  pen.paint(()=>{ g.ellipse(cx,cy,r*0.58,r*0.34,0,0,TAU); }, toneSolid(inkLevel(0)), Math.max(2,r*0.11));
  g.fillStyle=INK; g.beginPath(); g.arc(cx,cy,r*0.19,0,TAU); g.fill();
}

/* the culture being left: a small whole ship on the swell */
function shipGlyph(g, pen, cx, cy, u){
  pen.paint(()=>{
    g.moveTo(cx-u*0.92, cy+u*0.16);
    g.lineTo(cx+u*0.92, cy+u*0.16);
    g.lineTo(cx+u*0.58, cy+u*0.52);
    g.lineTo(cx-u*0.58, cy+u*0.52);
    g.closePath();
  }, toneSolid(inkLevel(3)), Math.max(2,u*0.10));
  pen.limb(()=>{ g.moveTo(cx+u*0.92,cy+u*0.16); g.quadraticCurveTo(cx+u*1.20,cy-u*0.12,cx+u*1.04,cy-u*0.28); },
           toneSolid(inkLevel(3)), Math.max(2,u*0.10));
  pen.limb(()=>{ g.moveTo(cx,cy+u*0.16); g.lineTo(cx,cy-u*0.92); }, toneSolid(inkLevel(4)), Math.max(2,u*0.09));
  pen.paint(()=>{
    g.moveTo(cx, cy-u*0.88);
    g.quadraticCurveTo(cx+u*0.72, cy-u*0.52, cx+u*0.58, cy+u*0.04);
    g.lineTo(cx, cy+u*0.04); g.closePath();
  }, toneSolid(inkLevel(1)), Math.max(2,u*0.07));
  // three short oar strokes below the hull (the sea culture's own tool)
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,u*0.055); g.lineCap="round";
  for(let k=-1;k<=1;k++){
    const x=cx+k*u*0.42;
    g.beginPath(); g.moveTo(x,cy+u*0.40); g.lineTo(x-u*0.20,cy+u*0.76); g.stroke();
  }
}

/* the quantized SEA-KNOWLEDGE gauge: 5 blocks at the shore, none inland */
function knowledgeGauge(g, pen, W, H, t){
  const ax=GAUGE.x*W;
  g.strokeStyle=INK; g.lineWidth=Math.max(1.6,W*0.005); g.lineCap="round";
  // broken axis (never one long rule)
  for(let i=0;i<4;i++){
    const a=lerp(GAUGE.y0-0.012,GAUGE.y1+0.028,i/4)*H, b=lerp(GAUGE.y0-0.012,GAUGE.y1+0.028,(i+0.72)/4)*H;
    g.beginPath(); g.moveTo(ax,a); g.lineTo(ax,b); g.stroke();
  }
  arrowhead(g,{x:ax,y:(GAUGE.y1+0.030)*H},{x:0,y:1},W*0.019);
  const bw=W*0.021, gap=W*0.009;
  for(let r=0;r<GAUGE.rows;r++){
    const y=lerp(GAUGE.y0,GAUGE.y1,r/(GAUGE.rows-1))*H;
    const n=Math.max(0, params.knowledge-r);
    g.strokeStyle=INK; g.lineWidth=Math.max(1.4,W*0.004);
    g.beginPath(); g.moveTo(ax-W*0.011,y); g.lineTo(ax+W*0.011,y); g.stroke();     // tick
    for(let k=0;k<n;k++){
      const x=ax+W*0.020+k*(bw+gap);
      pen.paint(()=>{ g.rect(x,y-bw*0.44,bw,bw*0.88); }, toneSolid(inkLevel(k===0?4:2)), Math.max(1.6,W*0.0038));
    }
    if(n===0){   // the empty rank: an open box with a slash — no word for sea
      const x=ax+W*0.020;
      pen.paint(()=>{ g.rect(x,y-bw*0.44,bw,bw*0.88); }, toneSolid(inkLevel(0)), Math.max(1.6,W*0.0038));
      g.strokeStyle=INK; g.lineWidth=Math.max(1.6,W*0.004);
      g.beginPath(); g.moveTo(x,y+bw*0.40); g.lineTo(x+bw,y-bw*0.40); g.stroke();
    }
  }
  seaBadge(g, pen, ax, (GAUGE.y0-0.048)*H, W*0.026);
}

/* CONSEQUENCE — the oar planted upright in inland earth, offering smoke */
function plantedMarker(g, pen, cx, cy, u, t, on){
  g.save(); g.globalAlpha = on?1:0.34;
  // the SAME oar, now stood upright as a marker (identical silhouette call)
  bladeSilhouette(g, pen, cx, cy-u*0.35, u, 0);
  // low mound of inland earth heaped over the buried butt (light, broken hatch)
  pen.paint(()=>{ g.moveTo(cx-u*1.30,cy+u*0.66);
    g.quadraticCurveTo(cx,cy-u*0.06,cx+u*1.30,cy+u*0.66); g.closePath(); },
    toneSolid(inkLevel(1)), Math.max(2,u*0.06));
  g.strokeStyle=INK; g.lineWidth=Math.max(1.1,u*0.035); g.globalAlpha=(on?0.6:0.22); g.lineCap="round";
  for(let i=-3;i<=3;i++){ const x=cx+i*u*0.28;
    g.beginPath(); g.moveTo(x,cy+u*0.58); g.lineTo(x+u*0.10,cy+u*0.44); g.stroke(); }
  g.globalAlpha = on?1:0.34;
  // offering smoke: three drifting curls (the threefold sacrifice to Poseidon)
  g.strokeStyle=INK; g.lineWidth=Math.max(1.4,u*0.05); g.lineCap="round";
  for(let k=0;k<3;k++){
    const x0=cx-u*1.08-k*u*0.24, y0=cy+u*0.42;
    const d=Math.sin(t*2.1+k*1.5)*u*0.16;
    g.beginPath(); g.moveTo(x0,y0);
    g.quadraticCurveTo(x0-u*0.24+d, y0-u*0.44, x0-u*0.10+d, y0-u*0.90);
    g.stroke();
  }
  g.restore();
}

/* the traveller's token: a bearing mark with the oar across the shoulder */
function bornOarToken(g, cx, cy, r){
  g.fillStyle=inkLevel(0); g.beginPath(); g.arc(cx,cy,r*1.5,0,TAU); g.fill();
  g.fillStyle=INK; g.beginPath(); g.arc(cx,cy,r*0.62,0,TAU); g.fill();
  g.strokeStyle=INK; g.lineWidth=Math.max(2,r*0.42); g.lineCap="round";
  g.beginPath(); g.moveTo(cx-r*1.15,cy+r*0.85); g.lineTo(cx+r*1.15,cy-r*0.85); g.stroke();
  g.fillStyle=INK; g.beginPath();
  g.ellipse(cx+r*1.30,cy-r*0.98,r*0.42,r*0.24,-0.64,0,TAU); g.fill();   // the blade end
}

/* walk a polyline by normalized arc length */
function walk(pts, s){
  let total=0; const seg=[];
  for(let i=1;i<pts.length;i++){
    const d=Math.hypot(pts[i].x-pts[i-1].x, pts[i].y-pts[i-1].y);
    seg.push(d); total+=d;
  }
  let want=clamp01(s)*total;
  for(let i=0;i<seg.length;i++){
    if(want<=seg[i] || i===seg.length-1){
      const k=seg[i]?clamp01(want/seg[i]):0;
      return { x:lerp(pts[i].x,pts[i+1].x,k), y:lerp(pts[i].y,pts[i+1].y,k) };
    }
    want-=seg[i];
  }
  return pts[pts.length-1];
}

/* ---------------- the effect ---------------- */
function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0);
  const phase=st.phase||"field";       // shore | field | mistaken | planted
  const layers=st.layers || ["sea","route","gauge","source","readings","reads","consequence","token"];
  const has=l=>layers.includes(l);
  const mistaken = phase==="mistaken" || phase==="planted";
  const P=p=>({ x:p.x*W, y:p.y*H });

  // paper stays paper inland; only the sea band carries a wash
  if (has("sea")){
    g.fillStyle=inkLevel(1);
    g.fillRect(SEA.x0*W, SEA.y0*H, (SEA.x1-SEA.x0)*W, (SEA.y1-SEA.y0)*H);
    swell(g, SEA.x0*W+W*0.02, SEA.x1*W-W*0.16, SEA.y0*H+H*0.050, H*0.011, W*0.066, Math.max(2,W*0.0050), 0.8);
    swell(g, SEA.x0*W+W*0.14, SEA.x1*W-W*0.02, SEA.y1*H-H*0.036, H*0.012, W*0.062, Math.max(2,W*0.0052), 0.85);
    // the shore: a BROKEN waterline, the edge the route leaves
    brokenRun(g, SEA.y1*H, SEA.x0*W+W*0.01, SEA.x1*W-W*0.01, 5, Math.max(2,W*0.006), 0.70);
    shipGlyph(g, pen, SHIP.x*W, SHIP.y*H, W*0.058);
  }

  // the inland ground the route climbs: three broken low humps, kept light
  if (has("route")){
    const humps=[[0.36,0.398,0.15],[0.60,0.487,0.13],[0.845,0.575,0.12]];
    for(const [hx,hy,hw] of humps){
      pen.paint(()=>{ g.moveTo((hx-hw*0.5)*W,hy*H);
        g.quadraticCurveTo(hx*W,(hy-0.036)*H,(hx+hw*0.5)*W,hy*H); g.closePath(); },
        toneSolid(inkLevel(1)), Math.max(2,W*0.0045));
    }
  }

  if (has("gauge")) knowledgeGauge(g,pen,W,H,t);

  // the ROUTE itself — one-way, stepped, flowing dashes
  if (has("route")){
    const pts=ROUTE.map(P);
    const off=-t*params.flow*12;
    dashedPath(g, pts, Math.max(3,W*0.010), off, [W*0.024, W*0.019]);
    // prophecy issuing from the oracle into the route head
    dashedPath(g, [P(SRC), {x:SRC.x*W,y:(SEA.y1-0.004)*H}, pts[0]],
               Math.max(2,W*0.007), off, [W*0.016, W*0.016]);
    // milestone rings at the turns (the stages of getting further from water)
    for(const i of [2,4]){
      const p=pts[i];
      pen.paint(()=>{ g.arc(p.x,p.y,W*0.020,0,TAU); }, toneSolid(inkLevel(0)), Math.max(2,W*0.0055));
      g.fillStyle=INK; g.beginPath(); g.arc(p.x,p.y,W*0.007,0,TAU); g.fill();
    }
    arrowhead(g, pts[pts.length-1], {x:1,y:0}, W*0.021);
  }

  if (has("source")) oracleSource(g,pen,SRC.x*W,SRC.y*H,W*0.042, t*6);

  if (has("consequence")){
    plantedMarker(g,pen,PLANT.x*W,PLANT.y*H,W*0.050,t*3, phase==="planted");
    if (phase==="planted") checkMark(g, (PLANT.x+0.068)*W, (PLANT.y-0.142)*H, W*0.026);
  }

  // the twin readings of one silhouette
  if (has("readings")){
    const u=W*0.100;
    g.save(); g.globalAlpha = mistaken?0.34:1; oarReading(g,pen,PANEL_L,W,H,u,t); g.restore();
    g.save(); g.globalAlpha = mistaken?1:(phase==="shore"?0.30:0.62); fanReading(g,pen,PANEL_R,W,H,u,t); g.restore();
  }

  if (has("reads")){
    const R=P(READS), r=W*0.042;
    g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.005); g.lineCap="round";
    g.setLineDash([W*0.013,W*0.012]); g.lineDashOffset=-t*params.flow*10;
    g.beginPath(); g.moveTo((PANEL_L.x1+0.014)*W,R.y); g.lineTo(R.x-r-W*0.008,R.y);
    g.moveTo(R.x+r+W*0.008,R.y); g.lineTo((PANEL_R.x0-0.018)*W,R.y); g.stroke(); g.setLineDash([]);
    arrowhead(g,{x:(PANEL_R.x0-0.008)*W,y:R.y},{x:1,y:0},W*0.017);
    readsAsNode(g,pen,R.x,R.y,r);
  }

  // the borne-oar token walking the route (and resting at the marker once planted)
  if (has("token")){
    const s = phase==="planted" ? 1 : t;
    const p = walk(ROUTE, s);
    bornOarToken(g, p.x*W, p.y*H, W*0.019);
  }

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.inland-oar-prophecy",
  type:"DIVINE_FX",
  name:"Inland-oar prophecy",
  statusWord:"FORETOLD",
  scene:"OD-B23-S05",

  params,
  // back -> front draw order the effect honors; a scene may pass a subset
  layers:["sea","route","gauge","source","readings","reads","consequence","token"],
  // normalized 0..1 source / field / transform / consequence anchors
  anchors:{
    "source:oracle":{     x:SRC.x,     y:SRC.y     },   // the prophecy issuing
    "source:sea-culture":{x:SHIP.x,    y:SHIP.y    },   // the world being left
    "field:shore-exit":{  x:ROUTE[0].x,y:ROUTE[0].y},   // where the route leaves water
    "field:gauge":{       x:GAUGE.x,   y:0.440     },   // sea-knowledge falling to zero
    "transform:reads-as":{x:READS.x,   y:READS.y   },   // the misreading boundary
    "reading:oar":{       x:PANEL_L.cx,y:PANEL_L.cy},   // sea reading
    "reading:winnowing-fan":{x:PANEL_R.cx,y:PANEL_R.cy},// inland reading
    "consequence:planted":{x:PLANT.x,  y:PLANT.y   },   // oar planted, offering made
    "camera:wide":{       x:0.50,      y:0.50      },
  },
  // diagram bands
  zones:{ sea:{ x0:SEA.x0,y0:SEA.y0,x1:SEA.x1,y1:SEA.y1 },
          inland:{ x0:0.04,y0:0.26,x1:0.97,y1:0.60 },
          readings:{ x0:PANEL_L.x0,y0:PANEL_L.y0,x1:PANEL_R.x1,y1:PANEL_R.y1 } },
  // DIVINE_FX states: at the water -> walking inland -> the misreading -> planted
  states:{
    initial:"field",
    nodes:{
      shore:{    preview:{ t:0.02, phase:"shore",    status:"UTTERED",  progress:0.05,
                           layers:["sea","route","gauge","source","readings","reads","token"] } },
      field:{    preview:{ t:0.46, phase:"field",    status:"FORETOLD", progress:0.46,
                           layers:["sea","route","gauge","source","readings","reads","consequence","token"] } },
      mistaken:{ preview:{ t:0.88, phase:"mistaken", status:"MISTAKEN", progress:0.88,
                           layers:["sea","route","gauge","source","readings","reads","consequence","token"] } },
      planted:{  preview:{ t:1.00, phase:"planted",  status:"PLANTED",  progress:1.00,
                           layers:["sea","route","gauge","source","readings","reads","consequence","token"] } },
    },
    edges:[["shore","field"],["field","mistaken"],["mistaken","planted"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","phase","reveal","flow"],

  // neutral preview: mid-route, both readings present, the fan not yet dominant
  preview:()=>({ t:0.46, phase:"field", status:"FORETOLD", progress:0.46,
                 layers:["sea","route","gauge","source","readings","reads","consequence","token"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
