/* divine-fx.deflected-spear-field — the suitors' massed cast, taken out of the air.
   DIVINE_FX asset. Scene function (OD-B22-S05): six suitors hurl together at the
   four men on the threshold and every shaft goes into the building instead.

   The whole problem of this effect is that a deflection must NOT read as six bad
   throws. So the plate is built as a ballistics proof, not a picture of chaos:

     SOURCE  — a rank of six CAST MARKS on the left, each indexed by a pip column.
     INTENT  — every cast's ghost line is drawn all the way through, dead straight,
               and all six CONVERGE on one reticle in the defended volume. The aim
               was true; the convergence is the evidence.
     FIELD   — a standing lens-arc between the casters and the men, with radial
               normals. Each ghost is intercepted where it crosses the arc.
     TRANSFORM — at every interception the shaft is turned by a MEASURED angle:
               a protractor wedge with quantized detents is struck at each crossing,
               and the six turns are MONOTONIC — highest cast to highest member,
               lowest cast to lowest. An ordered mapping, not scatter.
     CONSEQUENCE — six lodged spears in four named members of the house: wall
               course, lintel, doorpost (x2), door leaf (x2). Plus the clearance
               caliper on the flattest shaft, and a two-digit LEDGER in
               seven-segment geometry: hits on flesh 0, hits on stone 6.

   Animation over state.t: casts release in sequence, each shaft flies its bent
   route by arc length, the protractor wedge is struck as it turns, the impact
   blooms when it lands, the ledger climbs. `charge` sets field strength, `intent`
   fades the ghost lines, `bloom` scales the impact bursts.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. The plate is kept
   mostly paper — the house is light planes, and dark is reserved for the shafts,
   the impacts, the defended tokens and the ledger. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* the six casts, a staggered rank on the left (a crowd, not a column) */
const LAUNCH = [
  { x:0.105, y:0.400 }, { x:0.131, y:0.472 }, { x:0.108, y:0.544 },
  { x:0.135, y:0.616 }, { x:0.110, y:0.688 }, { x:0.137, y:0.760 },
];
/* the one aim point every cast is laid on — the head of the front defender */
const TARGET = { x:0.502, y:0.752 };

/* the house, arranged as a staircase so every member's left face is exposed:
   further right is struck higher, so no member shadows another. */
const MEMBERS = {
  wall:   { x0:0.500, y0:0.080, x1:0.958, y1:0.215 },
  lintel: { x0:0.672, y0:0.240, x1:0.955, y1:0.298 },
  post:   { x0:0.755, y0:0.298, x1:0.821, y1:0.775 },
  leaf:   { x0:0.630, y0:0.560, x1:0.735, y1:0.740 },
};
/* six terminations, monotone with the cast index: the field's mapping is ordered */
const ANCHOR = [
  { x:0.500, y:0.158, m:"wall"   },
  { x:0.672, y:0.266, m:"lintel" },
  { x:0.755, y:0.372, m:"post"   },
  { x:0.755, y:0.452, m:"post"   },
  { x:0.630, y:0.596, m:"leaf"   },
  { x:0.630, y:0.680, m:"leaf"   },
];
/* the defended volume: a low keyed box on the floor holding the four men */
const SAFE = { x0:0.430, y0:0.800, x1:0.620, y1:0.905 };

const params = {
  launches: LAUNCH,
  target:   TARGET,
  anchors:  ANCHOR,
  members:  MEMBERS,
  field:    { cx:1.470, cy:0.62, r:1.225 }, // lens arc: centre right of frame, cx/r in W, cy in H
  floorY:   0.905,
  detents:  5,        // quantized steps on each deflection protractor
  charge:   1.0,
  stagger:  0.055,    // release offset between successive casts
};

/* ---------- where a cast meets the field. Distance to the arc centre falls
   monotonically along the flight, so a bisection lands exactly on the arc. */
function crossField(L,T,W,H){
  const lx=L.x*W, ly=L.y*H, tx=T.x*W, ty=T.y*H;
  const dx=tx-lx, dy=ty-ly, len=Math.hypot(dx,dy)||1;
  const ux=dx/len, uy=dy/len;
  const fx=params.field.cx*W, fy=params.field.cy*H, R=params.field.r*W;
  let lo=0, hi=len*1.5;
  for(let i=0;i<38;i++){
    const m=(lo+hi)/2, px=lx+ux*m, py=ly+uy*m;
    if(Math.hypot(px-fx,py-fy) > R) lo=m; else hi=m;
  }
  const s=(lo+hi)/2;
  return { x:lx+ux*s, y:ly+uy*s, ux, uy, len };
}

/* ---------- the bent route: straight to the crossing, a short fillet through it,
   straight out to the member. Sampled so a shaft can fly it by arc length. */
function buildRoute(L,C,A,W,H){
  const P0={x:L.x*W,y:L.y*H}, P2={x:A.x*W,y:A.y*H}, K={x:C.x,y:C.y};
  const a={ x:lerp(P0.x,K.x,0.86), y:lerp(P0.y,K.y,0.86) };
  const b={ x:lerp(K.x,P2.x,0.16), y:lerp(K.y,P2.y,0.16) };
  const pts=[P0,a];
  for(let i=1;i<=10;i++){
    const s=i/10, inv=1-s;
    pts.push({ x:inv*inv*a.x+2*inv*s*K.x+s*s*b.x, y:inv*inv*a.y+2*inv*s*K.y+s*s*b.y });
  }
  pts.push(P2);
  let acc=0; pts[0].s=0;
  for(let i=1;i<pts.length;i++){ acc+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y); pts[i].s=acc; }
  pts.total=acc||1;
  return pts;
}
/* point + heading at arc-length fraction u along a route */
function atU(P,u){
  const want=clamp01(u)*P.total;
  let i=1; while(i<P.length-1 && P[i].s<want) i++;
  const a=P[i-1], b=P[i], k=(b.s-a.s)>1e-6 ? (want-a.s)/(b.s-a.s) : 0;
  const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1;
  return { x:lerp(a.x,b.x,k), y:lerp(a.y,b.y,k), tx:dx/L, ty:dy/L };
}
function polyTo(g,P,u){
  const want=clamp01(u)*P.total;
  g.moveTo(P[0].x,P[0].y);
  for(let i=1;i<P.length;i++){
    if(P[i].s<=want){ g.lineTo(P[i].x,P[i].y); continue; }
    const a=P[i-1], b=P[i], k=(b.s-a.s)>1e-6 ? (want-a.s)/(b.s-a.s) : 0;
    g.lineTo(lerp(a.x,b.x,k), lerp(a.y,b.y,k)); break;
  }
}

/* ---------- small shared marks ---------- */
function arrowhead(g,p,dir,s,lvl=7){
  const nx=-dir.y, ny=dir.x;
  g.fillStyle = lvl>=7 ? INK : inkLevel(lvl);
  g.beginPath();
  g.moveTo(p.x,p.y);
  g.lineTo(p.x-dir.x*s+nx*s*0.58, p.y-dir.y*s+ny*s*0.58);
  g.lineTo(p.x-dir.x*s-nx*s*0.58, p.y-dir.y*s-ny*s*0.58);
  g.closePath(); g.fill();
}
function block(pen,g,x0,y0,x1,y1,lvl,lw){
  pen.paint(()=>{ g.moveTo(x0,y0); g.lineTo(x1,y0); g.lineTo(x1,y1); g.lineTo(x0,y1); g.closePath(); },
    toneSolid(inkLevel(lvl)), lw);
}

/* ---------- seven-segment numerals: numbers as GEOMETRY, so they survive the
   dot lattice at any cell size. ---------- */
const SEG7 = {
  0:[1,1,1,1,1,1,0], 1:[0,1,1,0,0,0,0], 2:[1,1,0,1,1,0,1], 3:[1,1,1,1,0,0,1],
  4:[0,1,1,0,0,1,1], 5:[1,0,1,1,0,1,1], 6:[1,0,1,1,1,1,1], 7:[1,1,1,0,0,0,0],
  8:[1,1,1,1,1,1,1], 9:[1,1,1,1,0,1,1],
};
function sevenSeg(pen,g,x,y,w,h,d,lvl){
  const s=SEG7[d]||SEG7[0], th=Math.min(w,h)*0.24, inx=th*0.60, half=h/2;
  const bar=(bx,by,bw,bh)=>block(pen,g,bx,by,bx+bw,by+bh,lvl,2.2);
  if(s[0]) bar(x+inx, y, w-2*inx, th);
  if(s[1]) bar(x+w-th, y+inx, th, half-inx-th*0.5);
  if(s[2]) bar(x+w-th, y+half+th*0.5, th, half-inx-th*0.5);
  if(s[3]) bar(x+inx, y+h-th, w-2*inx, th);
  if(s[4]) bar(x, y+half+th*0.5, th, half-inx-th*0.5);
  if(s[5]) bar(x, y+inx, th, half-inx-th*0.5);
  if(s[6]) bar(x+inx, y+half-th*0.5, w-2*inx, th);
}

/* ---------- THE HOUSE · light planes with hard contour. Every long span is
   broken: the wall is staggered courses with open joints and a missing block,
   the lintel is three separate stones, the floor rule is dashed. ---------- */
function drawHouse(pen,g,W,H){
  const M=params.members;
  // wall courses (backdrop) — three staggered rows, deliberately gapped
  const w=M.wall, rows=3;
  const rh=(w.y1-w.y0)*H/rows;
  for(let r=0;r<rows;r++){
    const y0=w.y0*H+r*rh, y1=y0+rh*0.90;
    const off=(r%2)? 0.055 : 0;
    let x=w.x0*W - off*W;
    let k=0;
    while(x < w.x1*W-4){
      const bw=W*(k%3===1 ? 0.085 : 0.115);
      const xa=Math.max(w.x0*W, x), xb=Math.min(w.x1*W, x+bw);
      const skip=(r===1&&k===2)||(r===2&&k===0);      // open joints: the span breaks
      if(xb-xa>W*0.02 && !skip) block(pen,g,xa,y0,xb,y1,(r+k)%2?1:2,3);
      x += bw + W*0.012; k++;
    }
  }
  // lintel — three stones over the door, each drawn separately
  const l=M.lintel, seg=(l.x1-l.x0)/3;
  for(let i=0;i<3;i++){
    const xa=(l.x0+i*seg)*W + (i?W*0.006:0), xb=(l.x0+(i+1)*seg)*W - W*0.006;
    block(pen,g,xa,l.y0*H,xb,l.y1*H, i===1?2:1, 4);
  }
  // doorpost — a pier with a capital band and two shallow flutes
  const p=M.post;
  block(pen,g,p.x0*W,p.y0*H,p.x1*W,p.y1*H,1,4.5);
  block(pen,g,p.x0*W-W*0.008,p.y0*H,p.x1*W+W*0.008,p.y0*H+H*0.028,3,3.5);
  block(pen,g,lerp(p.x0,p.x1,0.62)*W,p.y0*H+H*0.030,p.x1*W,p.y1*H-H*0.030,2,2.6);
  block(pen,g,p.x0*W-W*0.012,p.y1*H-H*0.034,p.x1*W+W*0.012,p.y1*H,3,3.5);
  g.strokeStyle=inkLevel(4); g.lineWidth=2; g.lineCap="butt";
  for(const f of [0.30]){
    const fx=lerp(p.x0,p.x1,f)*W;
    g.beginPath(); g.moveTo(fx,p.y0*H+H*0.040); g.lineTo(fx,p.y1*H-H*0.046); g.stroke();
  }
  // door leaf — swung open, standing free inboard of the post, with its swing arc
  const d=M.leaf;
  g.save(); g.strokeStyle=inkLevel(3); g.lineWidth=1.8; g.setLineDash([5,6]);
  g.beginPath(); g.arc(p.x0*W, d.y1*H, (p.x0-d.x0)*W, -Math.PI*0.62, -Math.PI*0.08); g.stroke();
  g.restore();
  block(pen,g,d.x0*W,d.y0*H,d.x1*W,d.y1*H,1,4.5);
  block(pen,g,d.x0*W,d.y0*H,d.x0*W+W*0.020,d.y1*H,3,3);   // hinge stile
  g.strokeStyle=inkLevel(4); g.lineWidth=2;
  for(const f of [0.42,0.62,0.82]){
    const px=lerp(d.x0,d.x1,f)*W;
    g.beginPath(); g.moveTo(px,d.y0*H+H*0.008); g.lineTo(px,d.y1*H-H*0.008); g.stroke();
  }
  pen.paint(()=>{ g.arc(lerp(d.x0,d.x1,0.72)*W, lerp(d.y0,d.y1,0.30)*H, W*0.013, 0, TAU); },
    toneSolid(inkLevel(4)), 3);
  // floor — a broken rule, never one bar across the plate
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  const fy=params.floorY*H;
  for(const [a,b] of [[0.05,0.24],[0.30,0.41],[0.63,0.80],[0.86,0.96]]){
    g.beginPath(); g.moveTo(a*W,fy); g.lineTo(b*W,fy); g.stroke();
  }
}

/* ---------- THE FIELD · a standing lens-arc with radial normals. Light: it is a
   boundary condition, not a wall. Charge lengthens the normals and doubles the
   arc with a companion rule. ---------- */
function drawFieldArc(pen,g,W,H,charge,t){
  const fx=params.field.cx*W, fy=params.field.cy*H, R=params.field.r*W;
  const xAt=y=>{ const dy=y-fy; return fx - Math.sqrt(Math.max(0,R*R-dy*dy)); };
  const y0=H*0.150, y1=H*0.935;
  const ch=clamp01(charge);
  const trace=(off,lvl,lw,dash)=>{
    g.save(); g.strokeStyle=inkLevel(lvl); g.lineWidth=lw; g.lineCap="round";
    if(dash) g.setLineDash(dash);
    g.beginPath();
    for(let y=y0;y<=y1;y+=6){ const x=xAt(y)+off; if(y===y0)g.moveTo(x,y); else g.lineTo(x,y); }
    g.stroke(); g.restore();
  };
  // the lens body — a light standing band, the only tone the field carries
  const bw=W*(0.020+0.020*ch);
  g.save(); g.beginPath();
  for(let y=y0;y<=y1;y+=6){ const x=xAt(y); if(y===y0)g.moveTo(x,y); else g.lineTo(x,y); }
  for(let y=y1;y>=y0;y-=6){ const x=xAt(y)+bw; g.lineTo(x,y); }
  g.closePath(); g.fillStyle=inkLevel(2); g.fill(); g.restore();
  trace(0, clamp(4+Math.round(ch*3),4,7), lerp(2.8,4.6,ch));
  trace(bw, 4, 2.6);
  trace(bw+W*0.026, 2, 2.0, [8,8]);
  // radial normals — the law the deflection is measured against
  g.strokeStyle=inkLevel(clamp(3+Math.round(ch*2),3,6)); g.lineWidth=2.6; g.lineCap="round";
  for(let y=y0+H*0.028; y<y1; y+=H*0.048){
    const x=xAt(y), nx=(fx-x), ny=(fy-y), L=Math.hypot(nx,ny)||1;
    const len=W*(0.018+0.022*ch)*(0.85+0.15*Math.sin(t*2.2+y*0.02));
    g.beginPath(); g.moveTo(x,y); g.lineTo(x+nx/L*len, y+ny/L*len); g.stroke();
  }
  // the two arc ends are capped so the boundary reads as an object, not a crop
  g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
  for(const y of [y0,y1]){
    const x=xAt(y), nx=(fx-x), ny=(fy-y), L=Math.hypot(nx,ny)||1;
    g.beginPath(); g.moveTo(x-nx/L*W*0.014, y-ny/L*W*0.014);
    g.lineTo(x+nx/L*W*0.014, y+ny/L*W*0.014); g.stroke();
  }
}

/* ---------- SOURCE · the cast rank. Each caster is a blocky throw-mark: a cocked
   arm wedge with a nock notch, plus an index pip column so the six are ordered. */
function drawCasts(pen,g,W,H,fired){
  params.launches.forEach((L,i)=>{
    const x=L.x*W, y=L.y*H, u=W*0.030;
    const hot = fired[i] > 0.02;
    // shoulder/arm wedge, cocked back
    pen.paint(()=>{
      g.moveTo(x-u*1.35, y-u*0.62); g.lineTo(x+u*0.55, y-u*0.88);
      g.lineTo(x+u*0.95, y);        g.lineTo(x+u*0.55, y+u*0.88);
      g.lineTo(x-u*1.35, y+u*0.62); g.closePath();
    }, toneSolid(inkLevel(hot?4:2)), 3.6);
    // the nock notch the shaft leaves from
    g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
    g.beginPath(); g.moveTo(x+u*0.35,y-u*0.34); g.lineTo(x+u*1.05,y); 
    g.moveTo(x+u*0.35,y+u*0.34); g.lineTo(x+u*1.05,y); g.stroke();
    // index pips: i+1 squares stacked behind the cast
    for(let k=0;k<=i;k++){
      const px=x-u*1.62-W*0.014, py=y-u*0.60+k*W*0.017;
      block(pen,g,px,py,px+W*0.011,py+W*0.011, hot?6:3, 1.8);
    }
  });
}

/* ---------- INTENT · the ghost lines. Straight, faint, and all six terminate on
   ONE reticle: the casts were true. Fading `intent` retires them. ---------- */
function drawIntent(g,W,H,intent){
  if(intent<=0.02) return;
  const T={x:params.target.x*W, y:params.target.y*H};
  g.save();
  g.strokeStyle=inkLevel(clamp(2+Math.round(intent*3),2,5));
  g.lineWidth=2.6; g.lineCap="round"; g.setLineDash([7,7]);
  for(const L of params.launches){
    g.beginPath(); g.moveTo(L.x*W,L.y*H); g.lineTo(T.x,T.y); g.stroke();
  }
  g.restore();
  // the aim reticle, struck through: the convergence that never arrives
  const r=W*0.046;
  g.fillStyle=inkLevel(0); g.beginPath(); g.arc(T.x,T.y,r*1.85,0,TAU); g.fill();
  g.strokeStyle=inkLevel(clamp(4+Math.round(intent*3),4,7)); g.lineWidth=3.6; g.lineCap="round";
  g.beginPath(); g.arc(T.x,T.y,r,0,TAU); g.stroke();
  g.beginPath();
  g.moveTo(T.x-r*1.7,T.y); g.lineTo(T.x-r*0.5,T.y);
  g.moveTo(T.x+r*0.5,T.y); g.lineTo(T.x+r*1.7,T.y);
  g.moveTo(T.x,T.y-r*1.7); g.lineTo(T.x,T.y-r*0.5);
  g.moveTo(T.x,T.y+r*0.5); g.lineTo(T.x,T.y+r*1.7);
  g.stroke();
  g.strokeStyle=INK; g.lineWidth=5.4;
  g.beginPath(); g.moveTo(T.x-r*0.80,T.y+r*0.80); g.lineTo(T.x+r*0.80,T.y-r*0.80); g.stroke();
}

/* ---------- TRANSFORM · the measured turn. At each crossing: a protractor wedge
   between the incoming heading and the outgoing one, with quantized detent ticks.
   A turn that is read off a scale is not a miss. ---------- */
function drawProtractor(g,W,H,C,din,dout,amt,idx=0){
  if(amt<=0.03) return;
  const r=W*(0.036+0.0055*(idx%3));
  const a0=Math.atan2(din.y,din.x), a1=Math.atan2(dout.y,dout.x);
  let da=a1-a0; while(da>Math.PI)da-=TAU; while(da<-Math.PI)da+=TAU;
  const aE=a0+da*clamp01(amt);
  // paper underlay so the wedge lifts off whatever it crosses
  g.save();
  g.fillStyle=inkLevel(0);
  g.beginPath(); g.moveTo(C.x,C.y); g.arc(C.x,C.y,r*1.04,a0,aE,da<0); g.closePath(); g.fill();
  g.fillStyle=inkLevel(2);
  g.beginPath(); g.moveTo(C.x,C.y); g.arc(C.x,C.y,r*0.62,a0,aE,da<0); g.closePath(); g.fill();
  g.restore();
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  g.beginPath(); g.arc(C.x,C.y,r,a0,aE,da<0); g.stroke();
  // quantized detents along the swept arc
  const n=params.detents;
  for(let k=0;k<=n;k++){
    const a=a0+da*(k/n);
    const inA=(da<0) ? (a>=aE) : (a<=aE);
    if(!inA) continue;
    const t0=(k===0||k===n)? r*1.20 : r*1.10;
    g.lineWidth=(k===0||k===n)?2.8:1.8;
    g.beginPath();
    g.moveTo(C.x+Math.cos(a)*r*0.86, C.y+Math.sin(a)*r*0.86);
    g.lineTo(C.x+Math.cos(a)*t0,     C.y+Math.sin(a)*t0);
    g.stroke();
  }
  // the pivot
  g.fillStyle=INK; g.beginPath(); g.arc(C.x,C.y,W*0.007,0,TAU); g.fill();
}

/* ---------- the flying / lodged SHAFT ---------- */
function drawShaft(pen,g,W,H,P,u,landed){
  if(u<=0.005) return;
  // paper underlay: the shaft stays separate from the house it crosses
  g.save(); g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle=inkLevel(0); g.lineWidth=9;
  g.beginPath(); polyTo(g,P,u); g.stroke();
  g.strokeStyle=INK; g.lineWidth=4.2;
  g.beginPath(); polyTo(g,P,u); g.stroke();
  g.restore();
  const q=atU(P,u);
  arrowhead(g,q,{x:q.tx,y:q.ty}, W*0.024);
  if(!landed){
    // fletching bar at the tail end of the visible run
    const b=atU(P,Math.max(0,u-0.055));
    g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
    const nx=-b.ty, ny=b.tx, s=W*0.014;
    g.beginPath(); g.moveTo(b.x-nx*s,b.y-ny*s); g.lineTo(b.x+nx*s,b.y+ny*s); g.stroke();
  }
}

/* ---------- CONSEQUENCE · the lodged spear + impact burst on a named member. */
function drawImpact(pen,g,W,H,A,dir,bloom,idx){
  if(bloom<=0.02) return;
  const x=A.x*W, y=A.y*H, s=W*(0.030+0.020*clamp01(bloom));
  // chip wedge knocked out of the face
  pen.paint(()=>{
    g.moveTo(x,y);
    g.lineTo(x+s*0.72, y-s*0.46);
    g.lineTo(x+s*0.58, y+s*0.42); g.closePath();
  }, toneSolid(inkLevel(5)), 2.6);
  // radiating split ticks
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let k=0;k<5;k++){
    const a=(-0.75+k*0.375)*Math.PI*0.5;
    const L0=s*0.85, L1=s*(1.25+0.45*((k%2)?0.4:1))*clamp01(bloom);
    g.beginPath();
    g.moveTo(x+Math.cos(a)*L0, y+Math.sin(a)*L0);
    g.lineTo(x+Math.cos(a)*L1, y+Math.sin(a)*L1);
    g.stroke();
  }
  // the shaft standing out of the member, butt uppermost along the flight line
  const bx=x-dir.x*W*0.088, by=y-dir.y*W*0.088;
  g.strokeStyle=inkLevel(0); g.lineWidth=9;
  g.beginPath(); g.moveTo(x,y); g.lineTo(bx,by); g.stroke();
  g.strokeStyle=INK; g.lineWidth=5.6;
  g.beginPath(); g.moveTo(x,y); g.lineTo(bx,by); g.stroke();
  const nx=-dir.y, ny=dir.x, f=W*0.015;
  g.lineWidth=3;
  g.beginPath(); g.moveTo(bx-nx*f,by-ny*f); g.lineTo(bx+nx*f,by+ny*f); g.stroke();
  // member index pips beside the butt, so each hit is booked to a member
  for(let k=0;k<=idx;k++){
    const px=bx-nx*W*0.030-dir.x*W*0.012+k*0, py=by-ny*W*0.030-dir.y*W*0.012+k*W*0.016;
    block(pen,g,px,py,px+W*0.010,py+W*0.010,6,1.6);
  }
}

/* ---------- the DEFENDED VOLUME · a low keyed box on the floor with the four men
   inside as blocky standing tokens. Hollow, so it reads as protected space and
   not as a slab. Corner keys mark it as a held station. ---------- */
function drawSafe(pen,g,W,H,hold){
  const S=SAFE, x0=S.x0*W, y0=S.y0*H, x1=S.x1*W, y1=S.y1*H;
  // hollow field
  block(pen,g,x0,y0,x1,y1,0,4.5);
  // four defenders, blocky, shoulder to shoulder
  const n=4, gap=(x1-x0)/(n+0.6), bw=gap*0.60;
  for(let i=0;i<n;i++){
    const cx=x0+gap*(0.8+i), hh=(y1-y0)*(0.62+(i%2?0.10:0));
    const ty=y1-hh-(y1-y0)*0.06;
    block(pen,g,cx-bw/2,ty,cx+bw/2,y1-(y1-y0)*0.06, i%2?5:4, 3);
    pen.paint(()=>{ g.arc(cx, ty-bw*0.42, bw*0.36, 0, TAU); }, toneSolid(inkLevel(6)), 2.6);
  }
  // corner keys — a held station, not a drawn rectangle
  g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
  const k=W*0.026;
  for(const sx of [0,1]) for(const sy of [0,1]){
    const cx=sx?x1:x0, cy=sy?y1:y0, dx=sx?-1:1, dy=sy?-1:1;
    g.beginPath();
    g.moveTo(cx+dx*k, cy-dy*W*0.010); g.lineTo(cx-dx*W*0.010, cy-dy*W*0.010);
    g.lineTo(cx-dx*W*0.010, cy+dy*k); g.stroke();
  }
  // the seal: two bracket ticks closing on the volume as the hold takes
  const hx=W*0.030*(1-clamp01(hold))+W*0.012;
  g.strokeStyle=inkLevel(clamp(3+Math.round(hold*3),3,7)); g.lineWidth=3.4; g.lineCap="round";
  for(const sx of [-1,1]){
    const bx=(sx<0? x0-hx : x1+hx), cy=(y0+y1)/2, q=(y1-y0)*0.26;
    g.beginPath();
    g.moveTo(bx-sx*W*0.012, cy-q); g.lineTo(bx, cy-q);
    g.lineTo(bx, cy+q); g.lineTo(bx-sx*W*0.012, cy+q); g.stroke();
  }
}

/* ---------- the CLEARANCE caliper on the flattest shaft: the margin by which the
   lowest cast passes over their heads is MEASURED, which is the whole argument. */
function drawClearance(g,W,H,P){
  const x=SAFE.x0*W+W*0.020;
  // walk the route to the sample abscissa
  let hit=null;
  for(let i=1;i<P.length;i++){
    const a=P[i-1], b=P[i];
    if((a.x-x)*(b.x-x)<=0 && Math.abs(b.x-a.x)>1e-6){
      const k=(x-a.x)/(b.x-a.x); hit={ x, y:lerp(a.y,b.y,k) }; break;
    }
  }
  if(!hit) return;
  const top=SAFE.y0*H;
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  g.beginPath(); g.moveTo(x, hit.y); g.lineTo(x, top); g.stroke();
  for(const yy of [hit.y, top]){
    g.beginPath(); g.moveTo(x-W*0.020, yy); g.lineTo(x+W*0.020, yy); g.stroke();
  }
  g.beginPath(); g.moveTo(x-W*0.008, hit.y+W*0.014); g.lineTo(x, hit.y); g.lineTo(x+W*0.008, hit.y+W*0.014); g.stroke();
  g.beginPath(); g.moveTo(x-W*0.008, top-W*0.014); g.lineTo(x, top); g.lineTo(x+W*0.008, top-W*0.014); g.stroke();
}

/* ---------- the LEDGER · the effect's visible consequence, counted. Two rows of
   seven-segment geometry: hits on flesh, hits on stone. ---------- */
function drawLedger(pen,g,W,H,stone){
  const x0=W*0.660, y0=H*0.800, x1=W*0.952, y1=H*0.926;
  block(pen,g,x0,y0,x1,y1,0,4);
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  const my=(y0+y1)/2;
  g.beginPath(); g.moveTo(x0+W*0.018,my); g.lineTo(x1-W*0.018,my); g.stroke();
  const dw=W*0.052, dh=H*0.052;
  // row 1 — a standing body glyph, then the count on flesh: zero
  const r1=(y0+my)/2;
  const bx=x0+W*0.040;
  block(pen,g,bx-W*0.014,r1-H*0.014,bx+W*0.014,r1+H*0.026,4,2.6);
  pen.paint(()=>{ g.arc(bx, r1-H*0.026, W*0.013, 0, TAU); }, toneSolid(inkLevel(6)), 2.4);
  sevenSeg(pen,g, x1-W*0.030-dw, r1-dh/2, dw, dh, 0, 7);
  // row 2 — a masonry block glyph, then the count on stone
  const r2=(my+y1)/2;
  const sx=x0+W*0.026;
  block(pen,g,sx,r2-H*0.020,sx+W*0.046,r2-H*0.002,3,2.6);
  block(pen,g,sx+W*0.010,r2+H*0.002,sx+W*0.056,r2+H*0.020,2,2.6);
  sevenSeg(pen,g, x1-W*0.030-dw, r2-dh/2, dw, dh, clamp(Math.round(stone),0,9), 7);
}

/* ---------- THE MAPPING · the argument of the whole plate, stated as a table.
   Six rows: cast index (pips) -> the member that took it. The mapping is ordered
   and total — every cast is accounted for, in sequence. Nothing here is a miss. */
function drawMapping(pen,g,W,H,done){
  const x0=W*0.042, y0=H*0.098, x1=W*0.268, y1=H*0.352;
  block(pen,g,x0,y0,x1,y1,0,4);
  const rows=params.anchors.length, rh=(y1-y0)/rows;
  for(let i=0;i<rows;i++){
    const cy=y0+rh*(i+0.5), on=i<done;
    // index pips (the cast) — a short column of squares, geometry not type
    for(let k=0;k<=i;k++){
      const px=x0+W*0.016+k*W*0.0165, py=cy-W*0.0055;
      block(pen,g,px,py,px+W*0.011,py+W*0.011, on?6:2, 1.6);
    }
    // the transfer stroke
    const ax=x0+W*0.135, bx=x1-W*0.062;
    g.strokeStyle= on?INK:inkLevel(3); g.lineWidth=on?2.6:1.8; g.lineCap="round";
    g.beginPath(); g.moveTo(ax,cy); g.lineTo(bx,cy); g.stroke();
    if(on) arrowhead(g,{x:bx+W*0.006,y:cy},{x:1,y:0}, W*0.014);
    // the member glyph it maps onto
    const gx=x1-W*0.042, lv=on?4:1;
    const m=params.anchors[i].m;
    if(m==="wall"){
      block(pen,g,gx-W*0.020,cy-W*0.014,gx+W*0.004,cy-W*0.001,lv,1.8);
      block(pen,g,gx-W*0.008,cy+W*0.001,gx+W*0.020,cy+W*0.014,lv,1.8);
    } else if(m==="lintel"){
      block(pen,g,gx-W*0.022,cy-W*0.008,gx+W*0.022,cy+W*0.006,lv,1.8);
    } else if(m==="post"){
      block(pen,g,gx-W*0.008,cy-W*0.017,gx+W*0.008,cy+W*0.017,lv,1.8);
    } else {
      block(pen,g,gx-W*0.016,cy-W*0.016,gx+W*0.016,cy+W*0.016,lv,1.8);
      g.strokeStyle=INK; g.lineWidth=1.8;
      g.beginPath(); g.moveTo(gx,cy-W*0.014); g.lineTo(gx,cy+W*0.014); g.stroke();
    }
    if(i<rows-1){
      g.strokeStyle=inkLevel(2); g.lineWidth=1.4;
      g.beginPath(); g.moveTo(x0+W*0.012,y0+rh*(i+1)); g.lineTo(x1-W*0.012,y0+rh*(i+1)); g.stroke();
    }
  }
}

/* ============================================================ */
function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.72);
  const charge=clamp01(st.charge ?? smooth(clamp01(t*1.6)));
  const intent=clamp01(st.intent ?? (t<0.30 ? clamp01(t/0.18) : clamp01(1-(t-0.30)/0.85)));
  const bloomK=clamp01(st.bloom ?? 1);
  const layers=st.layers || ["house","field","mapping","intent","casts","shafts","safe","clearance","ledger"];
  const has=l=>layers.includes(l);

  // paper field (the faint lattice the whole plate sits on)
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,H);

  // ---- solve every cast once ----
  const rays=params.launches.map((L,i)=>{
    const A=params.anchors[i];
    const C=crossField(L, params.target, W, H);
    const P=buildRoute(L,C,A,W,H);
    const din={ x:C.ux, y:C.uy };
    const eA={x:A.x*W,y:A.y*H};
    const ddx=eA.x-C.x, ddy=eA.y-C.y, dl=Math.hypot(ddx,ddy)||1;
    const dout={ x:ddx/dl, y:ddy/dl };
    const uc=(function(){ // arc-length fraction of the crossing
      let best=0,bd=1e9;
      for(let k=0;k<P.length;k++){ const d=Math.hypot(P[k].x-C.x,P[k].y-C.y); if(d<bd){bd=d;best=k;} }
      return P[best].s/P.total;
    })();
    const p=clamp01((t - i*params.stagger) / 0.58);
    return { L, A, C, P, din, dout, uc, p, i };
  });

  if(has("house"))  drawHouse(pen,g,W,H);
  if(has("field"))  drawFieldArc(pen,g,W,H,charge,t*6);
  if(has("intent")) drawIntent(g,W,H,intent);
  if(has("casts"))  drawCasts(pen,g,W,H, rays.map(r=>r.p));

  if(has("shafts")){
    // the measured turns first, so the shafts run over their own protractors
    for(const r of rays){
      const amt=clamp01((r.p - r.uc*0.9) / 0.22);
      drawProtractor(g,W,H,r.C,r.din,r.dout, amt*clamp01(charge*1.2), r.i);
    }
    for(const r of rays) drawShaft(pen,g,W,H,r.P, r.p, r.p>=1);
  }
  if(has("safe")) drawSafe(pen,g,W,H, clamp01(t*1.25));
  if(has("shafts")){
    for(const r of rays){
      const bl=clamp01((r.p-0.90)/0.10)*bloomK;
      drawImpact(pen,g,W,H,r.A,r.dout, bl, r.i);
    }
  }
  if(has("clearance") && rays[5].p>0.55) drawClearance(g,W,H,rays[5].P);
  if(has("ledger"))  drawLedger(pen,g,W,H, rays.filter(r=>r.p>=1).length);
  if(has("mapping")) drawMapping(pen,g,W,H, rays.filter(r=>r.p>=1).length);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine-fx.deflected-spear-field",
  type:"DIVINE_FX",
  name:"Deflected spear field",
  statusWord:"DEFLECTED",
  scene:"OD-B22-S05",

  params,
  // back -> front; a scene may pass a subset to stage the effect in pieces
  layers:["house","field","mapping","intent","casts","shafts","safe","clearance","ledger"],
  // normalized 0..1 source / field / target / consequence / camera anchors
  anchors:{
    "source:cast-rank":   { x:0.086, y:0.582 },   // the six throwers
    "field:lens-apex":    { x:0.300, y:0.620 },   // where the arc stands closest
    "target:aim-reticle": { x:0.502, y:0.752 },   // the point all six were laid on
    "target:defended":    { x:0.525, y:0.852 },   // the volume that takes no hit
    "hit:wall":           { x:0.500, y:0.158 },
    "hit:lintel":         { x:0.672, y:0.266 },
    "hit:doorpost":       { x:0.755, y:0.412 },
    "hit:door-leaf":      { x:0.630, y:0.638 },
    "readout:ledger":     { x:0.806, y:0.863 },
    "readout:mapping":    { x:0.155, y:0.225 },
    "camera:wide":        { x:0.500, y:0.500 },
  },
  // affected regions
  zones:{
    cast:     { x0:0.02, y0:0.42, x1:0.17, y1:0.75 },   // the throwing rank
    field:    { x0:0.28, y0:0.14, x1:0.36, y1:0.94 },   // the standing lens
    house:    { x0:0.50, y0:0.07, x1:0.96, y1:0.79 },   // members that take the hits
    defended: { x0:0.43, y0:0.80, x1:0.62, y1:0.91 },   // the volume held clear
  },
  // DIVINE_FX field states: cast -> intercepted -> turned -> lodged
  states:{
    initial:"deflected",
    nodes:{
      // cast: six true lines laid on one point, field barely lit, nothing turned
      cast:{        preview:{ t:0.14, charge:0.22, intent:1.00, bloom:0,
                              status:"CAST",      progress:0.14,
                              layers:["house","field","mapping","intent","casts","shafts","safe","ledger"] } },
      // intercepted: shafts reach the arc, the protractors are being struck
      intercepted:{ preview:{ t:0.42, charge:0.70, intent:0.80, bloom:0.1,
                              status:"MEASURED",  progress:0.42 } },
      // deflected: turned and running out to the house, first hits landing
      deflected:{   preview:{ t:0.76, charge:1.00, intent:0.35, bloom:0.85,
                              status:"DEFLECTED", progress:0.76 } },
      // spent: all six lodged in stone and timber, ledger reads 0 / 6
      spent:{       preview:{ t:1.00, charge:1.00, intent:0.10, bloom:1.00,
                              status:"SPENT",     progress:1.00 } },
    },
    edges:[["cast","intercepted"],["intercepted","deflected"],["deflected","spent"],
           ["cast","deflected"]],
  },
  duration:5.5,
  // channels the runtime can drive over the scene clock
  channels:["t","charge","intent","bloom"],

  // neutral preview: the turns are measured and most shafts have found the house,
  // the ghost lines still visible converging on the reticle nobody reaches.
  preview:()=>({ t:0.86, charge:1.0, intent:0.42, bloom:1.0,
                 status:"DEFLECTED", progress:0.86 }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
