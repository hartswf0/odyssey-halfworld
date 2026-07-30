/* divine-fx.athenas-bodily-emphasis — Book XVIII, the moment before the fight
   with Irus (OD-B18-S02). Athena "fills out his limbs": she does not change the
   man, she makes the man LEGIBLE. He hitches his rags up to the thigh and the
   suitors suddenly read a body they had not been reading.

   So this effect is a READABILITY diagram, not a growth ray. It is built as an
   anatomical emphasis plate:

     SOURCE   a compact divine touch-burst upper-left, chevrons streaming down
              into the shoulders (the goddess's hand, off-body, unnamed)
     FIELD    the corridor of limbs she is acting on — the two thighs bared by
              the lifted hem, and the near upper arm
     TRANSFORM over t the ghosted SLACK contour (dashed) is left behind as the
              worked contour swells past it, and the muscle-reading lines — the
              legibility itself — kindle inside the light limb planes
     CONSEQUENCE the two comparison bars in the left margin (slack vs worked)
              and the seven-block emphasis gauge at the right, with a dashed
              return arrow: the gain is TEMPORARY and will fall back.

   Tonal rule: the body is LIGHT (ink 2), the rag is mid (ink 3), and every dark
   value in the plate is an ACCENT — contour, reading lines, arrowheads, filled
   gauge blocks. Plenty of paper shows. No full-width horizontal band anywhere:
   the ground is a broken dashed line in three runs.

   Solid tones + hard contour only; the engine POST pass supplies the halftone.
   Do NOT pre-dither. Deterministic — no Date, no Math.random. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth }
  from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI * 2;
const clamp01 = x => clamp(x, 0, 1);

const params = {
  figure:{ x:0.415, y:0.885, h:0.615 },  // centre-x, feet-y, crown-to-feet height
  swell:      1.0,      // master multiplier on the worked gain
  readLines:  3,        // muscle-reading lines per emphasised limb
  chevrons:   5,        // divine touch chevrons streaming source -> shoulders
  gaugeBlocks:7,        // emphasis gauge = the eight ink levels, minus paper
  source:{ x:0.165, y:0.205 },
  gauge:{ x:0.780, w:0.086, bottom:0.790, block:0.050, gap:0.013 },
  bars:{ x:0.082, slackY:0.672, workedY:0.730 },
};

/* ---------- a tapered, bulging limb plane -------------------------------
   (x0,y0)->(x1,y1) with end widths w0,w1 and a mid-bulge pushed `bo` on the
   outward side and `bi` on the inward side. `sgn` is +1 when the limb's OUTBOARD
   side is screen-left of its own axis (left limbs) and -1 for right limbs; use
   outSign() rather than guessing — the perpendicular flips with the limb's lean.
   The bulge is what "filled out his limbs" means, geometrically. */
function outSign(cx,x0,x1,y0,y1){            // +1/-1 so the perp points away from cx
  const dx=x1-x0, dy=y1-y0, L=Math.hypot(dx,dy)||1;
  const px=-(dy/L), mx=(x0+x1)/2;
  return (px*(mx-cx) >= 0) ? 1 : -1;
}
function limbPath(g,x0,y0,x1,y1,w0,w1,bo,bi,sgn){
  const dx=x1-x0, dy=y1-y0, L=Math.hypot(dx,dy)||1;
  const px=-(dy/L)*sgn, py=(dx/L)*sgn;
  const mx=(x0+x1)/2, my=(y0+y1)/2, wm=(w0+w1)/2;
  const A=[x0+px*w0/2, y0+py*w0/2];
  const B=[mx+px*(wm/2+bo), my+py*(wm/2+bo)];
  const C=[x1+px*w1/2, y1+py*w1/2];
  const D=[x1-px*w1/2, y1-py*w1/2];
  const E=[mx-px*(wm/2+bi), my-py*(wm/2+bi)];
  const F=[x0-px*w0/2, y0-py*w0/2];
  const ctrl=(P,Q,R)=>[2*Q[0]-(P[0]+R[0])/2, 2*Q[1]-(P[1]+R[1])/2];
  const c1=ctrl(A,B,C), c2=ctrl(D,E,F);
  g.moveTo(A[0],A[1]);
  g.quadraticCurveTo(c1[0],c1[1],C[0],C[1]);
  g.lineTo(D[0],D[1]);
  g.quadraticCurveTo(c2[0],c2[1],F[0],F[1]);
  g.closePath();
  return { A,C,D,F, mid:[mx,my], out:[mx+px*(wm/2+bo), my+py*(wm/2+bo)], px, py, wm };
}

/* the muscle-READING lines: short bowed strokes across a limb that make the
   mass legible. They are the literal subject of the effect, so they kindle
   with `k` and are the darkest thing inside the light limb plane. */
function readLines(pen,g,x0,y0,x1,y1,wm,sgn,k,n){
  if (k<=0.03) return;
  const dx=x1-x0, dy=y1-y0, L=Math.hypot(dx,dy)||1;
  const ux=dx/L, uy=dy/L, px=-uy*sgn, py=ux*sgn;
  g.save(); g.globalAlpha=clamp01(k)*0.95;
  for(let i=0;i<n;i++){
    const f=0.30+i*(0.34/Math.max(1,n-1));
    const cx=x0+dx*f, cy=y0+dy*f;
    const half=wm*(0.24+0.05*i)*(0.55+0.45*k);
    const bow=wm*0.10*k;
    const ax=cx-px*half, ay=cy-py*half;
    const bx=cx+px*half, by=cy+py*half;
    pen.ink(()=>{ g.moveTo(ax,ay);
      g.quadraticCurveTo(cx+ux*bow, cy+uy*bow, bx,by); }, Math.max(2, wm*0.085));
  }
  g.restore();
}

/* a short outward growth arrow from the slack edge to the worked edge */
function growthArrow(g,W,x,y,px,py,len){
  const L=Math.max(W*0.020, len);
  const ex=x+px*L, ey=y+py*L;
  g.save();
  g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.005); g.lineCap="round";
  g.beginPath(); g.moveTo(x,y); g.lineTo(ex,ey); g.stroke();
  const h=W*0.016, qx=-py, qy=px;
  g.fillStyle=INK; g.beginPath();
  g.moveTo(ex+px*h*0.9, ey+py*h*0.9);
  g.lineTo(ex+qx*h*0.45, ey+qy*h*0.45);
  g.lineTo(ex-qx*h*0.45, ey-qy*h*0.45);
  g.closePath(); g.fill();
  g.restore();
}

/* ---------- SOURCE: the divine touch, off-body, upper-left --------------- */
function drawSource(pen,g,W,H,tx,ty,shx,shy,t,inten){
  const k=clamp01(t*1.6)*inten;
  const R=W*0.030;
  // compact 8-spoke burst + solid diamond core
  g.save(); g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.005); g.lineCap="round";
  g.globalAlpha=0.55+0.45*k;
  for(let i=0;i<8;i++){
    const a=i*TAU/8;
    const r0=R*0.55, r1=R*(1.0+0.55*((i*37%4)/4))*(0.6+0.4*k);
    g.beginPath();
    g.moveTo(tx+Math.cos(a)*r0, ty+Math.sin(a)*r0);
    g.lineTo(tx+Math.cos(a)*r1, ty+Math.sin(a)*r1);
    g.stroke();
  }
  g.globalAlpha=1; g.restore();
  pen.paint(()=>{ g.moveTo(tx,ty-R*0.44); g.lineTo(tx+R*0.44,ty);
                  g.lineTo(tx,ty+R*0.44); g.lineTo(tx-R*0.44,ty); g.closePath(); },
            toneSolid(inkLevel(5)), Math.max(2,W*0.005));
  // chevrons streaming down the arc into the shoulder
  const n=params.chevrons;
  for(let i=0;i<n;i++){
    const f=(i+0.5)/n;
    const along=clamp01(f*0.86 + 0.12);
    const x=lerp(tx,shx,along);
    const y=lerp(ty,shy,along) - Math.sin(along*Math.PI)*H*0.045;
    const dx=shx-tx, dy=shy-ty, L=Math.hypot(dx,dy)||1;
    const ux=dx/L, uy=dy/L, qx=-uy, qy=ux;
    const s=W*0.020*(0.7+0.6*along);
    g.save(); g.globalAlpha=clamp01(k*(0.30+0.65*along));
    g.strokeStyle=inkLevel(6); g.lineWidth=Math.max(2,W*0.0055); g.lineCap="round";
    g.beginPath();
    g.moveTo(x-ux*s+qx*s, y-uy*s+qy*s);
    g.lineTo(x+ux*s*0.5, y+uy*s*0.5);
    g.lineTo(x-ux*s-qx*s, y-uy*s-qy*s);
    g.stroke(); g.globalAlpha=1; g.restore();
  }
}

/* ---------- CONSEQUENCE: the two comparison bars in the left margin ------ */
function drawBars(pen,g,W,H,slackW,workedW,leader,k){
  const bx=params.bars.x*W;
  const y1=params.bars.slackY*H, y2=params.bars.workedY*H;
  const th=Math.max(4,H*0.012);
  g.save();
  // slack bar: outline only (what he was)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.005);
  g.strokeRect(bx, y1-th/2, slackW, th);
  // worked bar: solid (what she made readable) — grows with k
  g.fillStyle=inkLevel(7);
  g.fillRect(bx, y2-th/2, lerp(slackW, workedW, clamp01(k)), th);
  g.strokeRect(bx, y2-th/2, workedW, th);
  // end ticks
  g.lineWidth=Math.max(2,W*0.004);
  for(const [x,y] of [[bx,y1],[bx+slackW,y1],[bx,y2],[bx+workedW,y2]]){
    g.beginPath(); g.moveTo(x,y-th*1.35); g.lineTo(x,y+th*1.35); g.stroke();
  }
  // dashed leader from the measured thigh out to the bars
  g.setLineDash([W*0.012,W*0.011]); g.globalAlpha=0.65;
  g.strokeStyle=inkLevel(5); g.lineWidth=Math.max(1,W*0.0035);
  g.beginPath(); g.moveTo(leader[0],leader[1]);
  g.lineTo(bx+workedW*0.55, leader[1]);
  g.lineTo(bx+workedW*0.55, y1-th*1.6); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
  // ACCENT datum on the worked bar (semantic, prints as ink)
  g.fillStyle=ACCENT;
  g.fillRect(bx+lerp(slackW,workedW,clamp01(k))-th*0.5, y2-th*1.9, th, th*1.1);
  g.restore();
}

/* ---------- CONSEQUENCE: the emphasis gauge + temporary-return arrow ----- */
function drawGauge(pen,g,W,H,k,inten){
  const G=params.gauge;
  const x=G.x*W, w=G.w*W, bh=G.block*H, gap=G.gap*H;
  const n=params.gaugeBlocks;
  const lit=clamp(Math.round(k*n*inten),0,n);
  let topY=0;
  for(let i=0;i<n;i++){
    const y=G.bottom*H - (i+1)*bh - i*gap;
    if (i===n-1) topY=y;
    const on=i<lit;
    pen.paint(()=>{ g.rect(x,y,w,bh); },
      toneSolid(inkLevel(on ? 2+Math.round(i*0.72) : 0)), Math.max(2,W*0.005));
    if (!on){ // empty blocks carry one faint mid rule so they are not blank holes
      g.save(); g.globalAlpha=0.45; pen.ink(()=>{ g.moveTo(x+w*0.22,y+bh/2); g.lineTo(x+w*0.78,y+bh/2); },2); g.restore();
    }
  }
  // ACCENT pointer at the current level, aimed back at the body
  const py=G.bottom*H - lit*(bh+gap) + (lit? bh*0.5 - bh :  -bh*0.1);
  const ay=G.bottom*H - Math.max(1,lit)*bh - Math.max(0,lit-1)*gap + bh*0.5;
  g.save(); g.fillStyle=ACCENT; g.beginPath();
  g.moveTo(x-W*0.006, ay); g.lineTo(x-W*0.030, ay-W*0.014); g.lineTo(x-W*0.030, ay+W*0.014);
  g.closePath(); g.fill(); g.restore();
  // dashed return arrow: the emphasis is TEMPORARY, it falls back to block 0
  g.save(); g.setLineDash([W*0.013,W*0.012]); g.globalAlpha=0.7;
  g.strokeStyle=inkLevel(5); g.lineWidth=Math.max(2,W*0.005);
  const rx=x+w+W*0.030;
  g.beginPath();
  g.moveTo(x+w+W*0.006, topY+bh*0.5);
  g.quadraticCurveTo(rx+W*0.020, (topY+G.bottom*H)/2, x+w+W*0.006, G.bottom*H-bh*0.5);
  g.stroke(); g.setLineDash([]);
  g.fillStyle=inkLevel(6);
  g.beginPath();
  g.moveTo(x+w+W*0.002, G.bottom*H-bh*0.5);
  g.lineTo(x+w+W*0.024, G.bottom*H-bh*0.5-W*0.013);
  g.lineTo(x+w+W*0.026, G.bottom*H-bh*0.5+W*0.010);
  g.closePath(); g.fill();
  g.globalAlpha=1; g.restore();
}

/* ---------- the broken ground: three runs, never a full-width bar -------- */
function drawGround(pen,g,W,H,baseY,cx,footSpan){
  g.save();
  g.strokeStyle=INK; g.lineWidth=Math.max(4,W*0.008); g.lineCap="butt";
  for(const [a,b] of [[0.090,0.250],[0.300,0.600],[0.690,0.840]]){
    g.beginPath(); g.moveTo(a*W,baseY); g.lineTo(b*W,baseY); g.stroke();
  }
  // footing ticks only under the feet
  g.lineWidth=Math.max(2,W*0.004); g.globalAlpha=0.55;
  for(let i=-4;i<=4;i++){
    const x=cx+i*(footSpan/8);
    g.beginPath(); g.moveTo(x,baseY+H*0.004); g.lineTo(x-W*0.012,baseY+H*0.020); g.stroke();
  }
  g.globalAlpha=1; g.restore();
}

/* ======================================================================== */
function render(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.82);
  const inten=st.intensity ?? 1.0;
  const layers=st.layers || ["source","ghost","legs","torso","rag","arms","head","reading","measure","gauge","ground"];
  const has=l=>layers.includes(l);

  const ga=smooth(clamp01(t*1.18))*(st.swell ?? params.swell);  // worked gain 0..1
  const lift=smooth(clamp01((t-0.05)/0.55));                     // hem hitched up

  const cx=params.figure.x*W, baseY=params.figure.y*H, hgt=params.figure.h*H;
  const crownY=baseY-hgt;
  const headR=hgt*0.070;
  const shoulderY=crownY+hgt*0.200;
  const hipY=crownY+hgt*0.495;
  const kneeY=crownY+hgt*0.730;
  const ankleY=baseY-hgt*0.028;
  const shW=hgt*0.215*(1+0.13*ga);
  const hipW=hgt*0.160;

  const skin=toneSolid(inkLevel(1));      // the body is the LIGHTEST plane
  const skinLo=toneSolid(inkLevel(2));
  const rag=toneSolid(inkLevel(4));       // the rag is the one mid-dark mass
  const lw=Math.max(2,W*0.006);

  // limb metrics, slack (s) and worked (w)
  const thigh=(k)=>({ w0:hgt*0.094*(1+0.30*k), w1:hgt*0.070*(1+0.26*k),
                      bo:hgt*0.052*k, bi:hgt*0.020*k });
  const uarm =(k)=>({ w0:hgt*0.042*(1+0.46*k), w1:hgt*0.034*(1+0.38*k),
                      bo:hgt*0.022*k, bi:hgt*0.008*k });
  const Ts=thigh(0), Tw=thigh(ga), As=uarm(0), Aw=uarm(ga);

  // joint stations
  const hipL=[cx-hipW*0.42, hipY], hipR=[cx+hipW*0.42, hipY];
  const kneeL=[cx-hipW*0.60, kneeY], kneeR=[cx+hipW*0.62, kneeY];
  const ankL=[cx-hipW*0.63, ankleY], ankR=[cx+hipW*0.66, ankleY];
  const shL=[cx-shW*0.50, shoulderY+hgt*0.012], shR=[cx+shW*0.50, shoulderY+hgt*0.012];
  const elbR=[cx+shW*0.94, hipY-hgt*0.040], handR=[cx+shW*1.10, hipY+hgt*0.130];
  // the near arm is the one hitching the rag up: elbow out, fist OUTBOARD of the
  // body so the lifted corner of the hem is a clean triangle against paper
  const hemGripY=lerp(hipY+hgt*0.115, hipY-hgt*0.045, lift);
  const gripX=lerp(cx-hipW*0.72, cx-hipW*1.10, lift);
  const elbL=[cx-shW*0.86, shoulderY+hgt*0.215], handL=[gripX, hemGripY];

  // outboard side of every limb, computed — never guessed (the perpendicular
  // flips with the limb's lean, and a wrong sign bulges the muscle inward)
  const sThL=outSign(cx,hipL[0],kneeL[0],hipL[1],kneeL[1]);
  const sThR=outSign(cx,hipR[0],kneeR[0],hipR[1],kneeR[1]);
  const sClL=outSign(cx,kneeL[0],ankL[0],kneeL[1],ankL[1]);
  const sClR=outSign(cx,kneeR[0],ankR[0],kneeR[1],ankR[1]);
  const sUaL=outSign(cx,shL[0],elbL[0],shL[1],elbL[1]);
  const sUaR=outSign(cx,shR[0],elbR[0],shR[1],elbR[1]);
  const sFaL=outSign(cx,elbL[0],handL[0],elbL[1],handL[1]);
  const sFaR=outSign(cx,elbR[0],handR[0],elbR[1],handR[1]);

  /* 1 ---- SOURCE burst + chevrons (behind everything) */
  if (has("source")) drawSource(pen,g,W,H,params.source.x*W,params.source.y*H,
                                cx-shW*0.30, shoulderY, t, inten);

  /* 2 ---- GHOST is drawn LATER (step 7b) so the dashed slack contour lands ON
     TOP of the light limb plane it is nested inside — under it, it vanishes. */
  const paintGhost=()=>{
    if (ga<=0.02) return;
    g.save(); g.setLineDash([W*0.017,W*0.013]);
    g.strokeStyle=INK; g.lineWidth=Math.max(3,W*0.0075); g.globalAlpha=1;
    for(const [a,b,m,s] of [[hipL,kneeL,Ts,sThL],[hipR,kneeR,Ts,sThR],[shR,elbR,As,sUaR]]){
      g.beginPath(); limbPath(g,a[0],a[1],b[0],b[1],m.w0,m.w1,m.bo,m.bi,s); g.stroke();
    }
    g.setLineDash([]); g.globalAlpha=1; g.restore();
  };

  /* 3 ---- LEGS: bare, worked, light planes */
  let thighGeoL=null;
  if (has("legs")){
    // calves first (behind the thigh joint)
    pen.paint(()=>{ limbPath(g,kneeL[0],kneeL[1],ankL[0],ankL[1],
      hgt*0.066*(1+0.22*ga), hgt*0.042, hgt*0.030*ga, hgt*0.010*ga, sClL); }, skin, lw);
    pen.paint(()=>{ limbPath(g,kneeR[0],kneeR[1],ankR[0],ankR[1],
      hgt*0.066*(1+0.22*ga), hgt*0.042, hgt*0.030*ga, hgt*0.010*ga, sClR); }, skin, lw);
    // feet
    pen.paint(()=>{ g.moveTo(ankL[0]-hgt*0.030, ankL[1]); g.lineTo(ankL[0]+hgt*0.030, ankL[1]);
      g.lineTo(ankL[0]+hgt*0.024, baseY); g.lineTo(ankL[0]-hgt*0.062, baseY); g.closePath(); }, skinLo, lw);
    pen.paint(()=>{ g.moveTo(ankR[0]-hgt*0.030, ankR[1]); g.lineTo(ankR[0]+hgt*0.030, ankR[1]);
      g.lineTo(ankR[0]+hgt*0.062, baseY); g.lineTo(ankR[0]-hgt*0.024, baseY); g.closePath(); }, skinLo, lw);
    // thighs
    pen.paint(()=>{ thighGeoL=limbPath(g,hipL[0],hipL[1],kneeL[0],kneeL[1],Tw.w0,Tw.w1,Tw.bo,Tw.bi,sThL); }, skin, lw);
    pen.paint(()=>{ limbPath(g,hipR[0],hipR[1],kneeR[0],kneeR[1],Tw.w0,Tw.w1,Tw.bo,Tw.bi,sThR); }, skin, lw);
    // knee caps: small light discs so the joint reads
    for(const k of [kneeL,kneeR]) pen.paint(()=>{ g.ellipse(k[0],k[1],hgt*0.030,hgt*0.022,0,0,TAU); }, skinLo, lw*0.8);
  }
  if (!thighGeoL){ // geometry needed by the measure layer even if legs are off
    g.save(); g.beginPath(); thighGeoL=limbPath(g,hipL[0],hipL[1],kneeL[0],kneeL[1],Tw.w0,Tw.w1,Tw.bo,Tw.bi,sThL); g.restore();
  }

  /* 4 ---- TORSO plane (mostly covered, but the flank shows under the lift) */
  if (has("torso")){
    pen.paint(()=>{
      g.moveTo(cx-shW*0.50, shoulderY);
      g.lineTo(cx+shW*0.50, shoulderY);
      g.lineTo(cx+hipW*0.56, hipY+hgt*0.010);
      g.lineTo(cx-hipW*0.56, hipY+hgt*0.010);
      g.closePath();
    }, skin, lw);
    // neck
    pen.paint(()=>{ g.rect(cx-hgt*0.030, shoulderY-hgt*0.060, hgt*0.060, hgt*0.070); }, skin, lw*0.8);
  }

  /* 5 ---- the RAG: one mid-dark mass, hem hitched into a lifted corner at the
     fist. Its lower edge is the frame's most important line — everything below
     it is bare, worked, light. */
  if (has("rag")){
    const hemR=hipY+hgt*0.085;                 // far side: high on the thigh
    const N=8;
    pen.paint(()=>{
      g.moveTo(cx-shW*0.34, shoulderY-hgt*0.026);
      g.lineTo(cx+shW*0.34, shoulderY-hgt*0.026);
      g.lineTo(cx+shW*0.48, shoulderY+hgt*0.030);
      g.lineTo(cx+hipW*0.92, hemR);
      for(let i=N;i>=0;i--){                    // ragged hem, right -> left
        const s=i/N;
        const x=lerp(cx-hipW*0.72, cx+hipW*0.92, s);
        const y=lerp(hipY-hgt*0.010, hemR, smooth(s)) + (i%2? hgt*0.015 : -hgt*0.006);
        g.lineTo(x,y);
      }
      g.lineTo(handL[0]+hgt*0.020, handL[1]+hgt*0.045);   // up into the fist
      g.lineTo(handL[0]-hgt*0.012, handL[1]-hgt*0.020);
      g.lineTo(cx-shW*0.48, hipY-hgt*0.070);              // back up the flank
      g.lineTo(cx-shW*0.48, shoulderY+hgt*0.030);
      g.closePath();
    }, rag, lw);
    // fold seams: short, broken, radiating from the lifted corner
    g.save();
    for(let i=0;i<3;i++){
      const s=(i+0.5)/3;
      const x=lerp(cx-hipW*0.55, cx+hipW*0.70, s);
      const y1=lerp(hipY+hgt*0.005, hemR-hgt*0.012, smooth(s));
      pen.ink(()=>{ g.moveTo(handL[0]+hgt*0.055, handL[1]+hgt*0.020);
                    g.quadraticCurveTo(lerp(handL[0],x,0.6), lerp(handL[1],y1,0.75), x, y1); },
              Math.max(2,W*0.0045));
    }
    for(let i=0;i<3;i++){
      const x=lerp(cx-shW*0.24, cx+shW*0.30, i/2);
      pen.ink(()=>{ g.moveTo(x, shoulderY+hgt*0.055); g.lineTo(x+hgt*0.014, shoulderY+hgt*0.165); },
              Math.max(2,W*0.0045));
    }
    g.restore();
    // waist cord, broken at the grip side
    pen.ink(()=>{ g.moveTo(cx-hipW*0.20, hipY-hgt*0.070); g.lineTo(cx+hipW*0.86, hipY-hgt*0.040); }, Math.max(3,W*0.006));
  }

  /* 6 ---- ARMS (in front of the rag) */
  if (has("arms")){
    // far arm: worked upper arm + forearm hanging
    pen.paint(()=>{ limbPath(g,shR[0],shR[1],elbR[0],elbR[1],Aw.w0,Aw.w1,Aw.bo,Aw.bi,sUaR); }, skin, lw);
    pen.paint(()=>{ limbPath(g,elbR[0],elbR[1],handR[0],handR[1],
      hgt*0.034*(1+0.28*ga), hgt*0.026, hgt*0.012*ga, hgt*0.005*ga, sFaR); }, skin, lw);
    pen.paint(()=>{ g.ellipse(handR[0],handR[1]+hgt*0.012,hgt*0.022,hgt*0.028,0,0,TAU); }, skinLo, lw*0.85);
    // near arm: bent, gripping the hem
    pen.paint(()=>{ limbPath(g,shL[0],shL[1],elbL[0],elbL[1],Aw.w0,Aw.w1,Aw.bo,Aw.bi,sUaL); }, skin, lw);
    pen.paint(()=>{ limbPath(g,elbL[0],elbL[1],handL[0],handL[1],
      hgt*0.034*(1+0.28*ga), hgt*0.028, hgt*0.012*ga, hgt*0.005*ga, sFaL); }, skin, lw);
    pen.paint(()=>{ g.ellipse(handL[0],handL[1],hgt*0.026,hgt*0.023,0,0,TAU); }, skinLo, lw*0.85);
    // deltoid caps: small, so the new breadth reads at the shoulder without
    // ballooning the arm into the torso
    for(const s of [shL,shR]) pen.paint(()=>{ g.ellipse(s[0],s[1]-hgt*0.004,hgt*0.026*(1+0.25*ga),hgt*0.020,0,0,TAU); }, skin, lw*0.8);
  }

  /* 7 ---- HEAD (small, light; the plate is about the body) */
  if (has("head")){
    const hy=crownY+headR*1.05;
    pen.paint(()=>{ g.ellipse(cx, hy, headR*0.86, headR*1.06, 0,0,TAU); }, skin, lw);
    // one clean cap of hair + a wedge beard, no scribble
    pen.paint(()=>{ g.moveTo(cx-headR*0.88, hy-headR*0.18);
      g.quadraticCurveTo(cx, hy-headR*1.62, cx+headR*0.88, hy-headR*0.18);
      g.quadraticCurveTo(cx, hy-headR*0.62, cx-headR*0.88, hy-headR*0.18); g.closePath(); },
      toneSolid(inkLevel(5)), lw*0.8);
    pen.paint(()=>{ g.moveTo(cx-headR*0.62, hy+headR*0.16);
      g.lineTo(cx+headR*0.62, hy+headR*0.16);
      g.lineTo(cx+headR*0.30, hy+headR*1.28);
      g.lineTo(cx-headR*0.30, hy+headR*1.28); g.closePath(); },
      toneSolid(inkLevel(4)), lw*0.8);
  }

  /* 7b --- GHOST over the worked planes: the slack contour left behind */
  if (has("ghost")) paintGhost();

  /* 8 ---- READING lines: the legibility itself */
  if (has("reading")){
    readLines(pen,g,hipL[0],hipL[1],kneeL[0],kneeL[1],(Tw.w0+Tw.w1)/2,sThL,ga,params.readLines);
    readLines(pen,g,hipR[0],hipR[1],kneeR[0],kneeR[1],(Tw.w0+Tw.w1)/2,sThR,ga,params.readLines);
    readLines(pen,g,shR[0],shR[1],elbR[0],elbR[1],(Aw.w0+Aw.w1)/2,sUaR,ga,2);
    readLines(pen,g,shL[0],shL[1],elbL[0],elbL[1],(Aw.w0+Aw.w1)/2,sUaL,ga,2);
  }

  /* 9 ---- MEASURE: growth arrows + the two comparison bars */
  if (has("measure")){
    if (ga>0.04){
      const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
      const specs=[
        { a:hipL, b:kneeL, s:sThL, ms:Ts, mw:Tw },
        { a:hipR, b:kneeR, s:sThR, ms:Ts, mw:Tw },
        { a:shR,  b:elbR,  s:sUaR, ms:As, mw:Aw },
      ];
      for(const sp of specs){
        const dx=sp.b[0]-sp.a[0], dy=sp.b[1]-sp.a[1], L=Math.hypot(dx,dy)||1;
        const px=-(dy/L)*sp.s, py=(dx/L)*sp.s;
        const m=mid(sp.a,sp.b);
        const r0=(sp.ms.w0+sp.ms.w1)/4 + sp.ms.bo;
        const r1=(sp.mw.w0+sp.mw.w1)/4 + sp.mw.bo;
        growthArrow(g,W, m[0]+px*(r1+W*0.010), m[1]+py*(r1+W*0.010), px,py, W*0.034);
      }
    }
    const slackW=(Ts.w0+Ts.w1)/2 + Ts.bo*2;
    const workedW=(thigh(1).w0+thigh(1).w1)/2 + thigh(1).bo*2;
    drawBars(pen,g,W,H, slackW*0.78, workedW*0.78,
             [thighGeoL.out[0], thighGeoL.out[1]], ga);
  }

  /* 10 --- GAUGE */
  if (has("gauge")) drawGauge(pen,g,W,H,ga,inten);

  /* 11 --- broken GROUND */
  if (has("ground")) drawGround(pen,g,W,H,baseY,cx,hipW*2.2);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine-fx.athenas-bodily-emphasis",
  type:"DIVINE_FX",
  name:"Athena's bodily emphasis",
  statusWord:"LEGIBLE",
  scene:"OD-B18-S02",

  params,
  layers:["source","ghost","legs","torso","rag","arms","head","reading","measure","gauge","ground"],

  anchors:{
    "source:touch":     { x:0.165, y:0.205 },  // the goddess's hand, off-body
    "target:body":      { x:0.415, y:0.520 },  // the man she is making readable
    "field:thighs":     { x:0.415, y:0.700 },  // the bared, worked limbs
    "field:near-arm":   { x:0.560, y:0.510 },
    "grip:hem":         { x:0.316, y:0.612 },  // the fist that hitched the rag
    "measure:bars":     { x:0.145, y:0.625 },  // slack vs worked comparison
    "gauge:emphasis":   { x:0.804, y:0.570 },  // seven-block readout
    "camera:plate":     { x:0.470, y:0.560 },
  },
  zones:{
    body:   { x0:0.250, y0:0.250, x1:0.610, y1:0.900 },
    margin: { x0:0.070, y0:0.560, x1:0.260, y1:0.690 },
    readout:{ x0:0.740, y0:0.330, x1:0.900, y1:0.820 },
  },

  states:{
    initial:"emphatic",
    nodes:{
      // source only: rags still down, nothing worked, gauge dark
      slack:    { preview:{ t:0.04, intensity:0.9, status:"SLACK",    progress:0.04 } },
      // the hem comes up, the contour begins to pass the ghost
      filling:  { preview:{ t:0.46, intensity:1.0, status:"FILLING",  progress:0.46 } },
      // full emphasis: reading lines lit, gauge near top, bars separated
      emphatic: { preview:{ t:0.88, intensity:1.1, status:"LEGIBLE",  progress:0.88 } },
      // it is temporary — the gain falls back, the ghost catches up again
      fading:   { preview:{ t:0.30, intensity:0.8, status:"FADING",   progress:0.30 } },
    },
    edges:[["slack","filling"],["filling","emphatic"],["emphatic","fading"],["fading","slack"]],
  },
  duration:3.0,
  channels:["t","intensity","swell","figure"],

  preview:()=>({ t:0.86, intensity:1.05, swell:1.0, status:"LEGIBLE", progress:0.86,
                 layers:["source","ghost","legs","torso","rag","arms","head","reading","measure","gauge","ground"] }),
  draw(ctx,W,H,state){ return render(ctx,W,H,state||{}); },
};
export default asset;
