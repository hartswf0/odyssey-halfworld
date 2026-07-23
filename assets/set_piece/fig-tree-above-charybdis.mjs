/* set_piece.fig-tree-above-charybdis — the wild fig on the rock over the maw.
   SET_PIECE. A large wild fig tree rooted in the sea-cliff, its high graspable
   branches arching out OVER the Charybdis whirlpool — the one hang-point where a
   tiny figure can cling like a bat and wait out the vortex. Drawn as a separable
   environmental component in SOLID grays + hard contour; the engine dotify pass
   supplies the halftone. Declares the hang-point / branch anchors, the debris
   target in the maw, placement + collision boundaries, a depth layer, and states
   branches / hang-point / debris-below (vortex suck<->spew over t).
   Atlas: OD-B12-S07 — high graspable branches, hang duration, vortex cycle,
   released debris target, drop timing. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

/* ---- normalized layout (anchors + draw share these fractions of W,H) ---- */
const L = {
  waterY:   0.60,          // sea surface line
  rootX:    0.11, rootY: 0.40,   // where the trunk leaves the rock
  forkX:    0.32, forkY: 0.165,  // main fork of the tree
  hangX:    0.545, hangY: 0.305, // the high graspable hang-point over the maw
  canopyX:  0.30, canopyY: 0.165,// crown centre
  vortX:    0.56, vortY: 0.795,  // whirlpool centre
  vortR:    0.36,          // whirlpool radius (fraction of W)
  targX:    0.70, targY: 0.72,   // released-debris target seat (rest position)
};

const params = {
  canopyClumps: 26,
  figs: 14,                // dark fig fruit sprinkled in the crown
  vortexArms: 5,           // spiral arms of the maw
  debris: 4,               // floating raft-timbers in the swirl
  swayAmp: 0.006,          // wind channel: branch sway fraction of W
};

/* ---- small offscreen text (drawn into the source, dotified later) ---- */
function tracked(g, text, x, y, size, track, color){
  g.save(); g.fillStyle=color; g.textBaseline="middle";
  g.font=`800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx=x; for(const ch of text){ g.fillText(ch,cx,y); cx+=g.measureText(ch).width+track; }
  g.restore();
}

/* a tapered, gently-curved trunk/branch as a filled contoured polygon */
function taperBranch(pen, g, pts, w0, w1, tone){
  const n=pts.length, left=[], right=[];
  for(let i=0;i<n;i++){
    const p=pts[i], a=pts[Math.max(0,i-1)], b=pts[Math.min(n-1,i+1)];
    let nx=-(b.y-a.y), ny=(b.x-a.x); const d=Math.hypot(nx,ny)||1; nx/=d; ny/=d;
    const w=lerp(w0,w1,i/(n-1))/2;
    left.push({x:p.x+nx*w,y:p.y+ny*w}); right.push({x:p.x-nx*w,y:p.y-ny*w});
  }
  pen.paint(()=>{
    g.moveTo(left[0].x,left[0].y);
    for(let i=1;i<n;i++) g.lineTo(left[i].x,left[i].y);
    for(let i=n-1;i>=0;i--) g.lineTo(right[i].x,right[i].y);
    g.closePath();
  }, toneSolid(inkLevel(tone)), 4);
}
function quadPts(x0,y0,cx,cy,x1,y1,steps){
  const a=[]; for(let i=0;i<=steps;i++){ const t=i/steps;
    a.push({ x:lerp(lerp(x0,cx,t),lerp(cx,x1,t),t), y:lerp(lerp(y0,cy,t),lerp(cy,y1,t),t) }); }
  return a;
}

/* a broad fig-leaf glyph (fat, palmate-ish lobed disc) */
function figLeaf(g, x, y, r, ang, tone){
  g.save(); g.translate(x,y); g.rotate(ang);
  g.beginPath();
  for(let i=0;i<=7;i++){
    const a=(i/7)*Math.PI*2, lobe = (i%2===0)?1:0.62;
    const px=Math.cos(a)*r*lobe, py=Math.sin(a)*r*0.9*lobe;
    if(i===0) g.moveTo(px,py); else g.lineTo(px,py);
  }
  g.closePath();
  g.fillStyle=inkLevel(tone); g.fill();
  g.strokeStyle=INK; g.lineWidth=1.6; g.stroke();
  g.restore();
}

/* a bushy foliage mass: overlapping contoured clumps read as leaf-scallops */
function bushMass(pen, g, o){
  const rand=rnd(o.seed), items=[];
  for(let i=0;i<o.n;i++){
    const ang=rand()*Math.PI*2, rr=Math.pow(rand(),0.55);
    let px=o.cx+Math.cos(ang)*o.rx*rr, py=o.cy+Math.sin(ang)*o.ry*rr;
    if(o.stragglers && rand()<0.18){ px+=Math.cos(ang)*o.rx*0.34; py+=Math.sin(ang)*o.ry*0.34; }
    const r=lerp(o.minR,o.maxR,rand());
    const tone = rand()<o.darkP ? o.dark : (rand()<0.22 ? o.base-1 : o.base);
    items.push({ px, py, r, tone, sway:rand()*6.28 });
  }
  items.sort((a,b)=> b.r - a.r);
  for(const c of items){
    const dx=Math.sin((o.t||0)+c.sway)*o.swayPx;
    pen.paint(()=>{ g.arc(c.px+dx, c.py, c.r, 0, 7); }, toneSolid(inkLevel(clamp(c.tone,1,7))), 4);
  }
}

/* ---------------- the whirlpool maw ---------------- */
function drawMaw(pen, g, cx, cy, R, t, intensity){
  const asp=0.42, rings=7;
  // nested funnel rings, darkest toward the throat, lopsided so it reads swirling
  for(let i=rings;i>=1;i--){
    const f=i/rings;                                   // 1 outer .. inner
    const rrx=R*f, rry=rrx*asp;
    const rot=t*0.6*(2-f);
    const offx=Math.cos(t*0.8+f*6)*R*0.035*(1-f);
    const level=clamp(Math.round(2 + (1-f)*5*intensity + 1),2,7);
    pen.paint(()=>{ g.ellipse(cx+offx, cy+(1-f)*R*0.06, rrx, rry, rot*0.10, 0, 7); },
      toneSolid(inkLevel(level)), 3);
  }
  // the dark throat
  pen.paint(()=>{ g.ellipse(cx, cy+R*0.07, R*0.085, R*0.045, 0, 0, 7); }, toneSolid(inkLevel(7)), 3);
  // spiral swirl arms converging on the throat
  g.save(); g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round"; g.globalAlpha=0.5;
  for(let a=0;a<params.vortexArms;a++){
    g.beginPath();
    for(let s=0;s<=1.001;s+=0.05){
      const ang=a*(Math.PI*2/params.vortexArms) + s*5.0 + t;
      const r=R*(1.02-s);
      const x=cx+Math.cos(ang)*r, y=cy+Math.sin(ang)*r*asp;
      if(s===0) g.moveTo(x,y); else g.lineTo(x,y);
    }
    g.stroke();
  }
  g.restore();
}

function drawSet(ctx, W, H, st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx, t=st.t||0;
  const layers = st.layers || ["sky","water","whirlpool","debris","cliff","trunk","branches","canopy","hangpoint"];
  const has=l=>layers.includes(l);
  const swayPx = params.swayAmp*W;
  const spew = (st.spew!=null)? st.spew : 0.85;   // 1 = timbers flung to the outer rim, 0 = sucked to the throat
  const intensity = (st.intensity!=null)? st.intensity : 1;
  const hang = !!st.hang;

  const wy=L.waterY*H;
  const vx=L.vortX*W, vy=L.vortY*H, R=L.vortR*W;
  const hx=L.hangX*W, hy=L.hangY*H;

  // ---- SKY / open air above the surface (lightest) ----
  if(has("sky")){
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,wy);
  }

  // ---- SEA surface + churned water field below (mid-light) ----
  if(has("water")){
    g.fillStyle=inkLevel(3); g.fillRect(0,wy,W,H-wy);
    // choppy surface strokes flanking the maw
    g.save(); g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let i=0;i<6;i++){ const y=wy+(H-wy)*(0.10+0.14*i);
      g.beginPath(); g.moveTo(0,y);
      for(let x=0;x<=W;x+=W*0.08) g.lineTo(x, y+Math.sin(x*0.03+i+t)*3);
      g.stroke(); }
    g.restore();
  }

  // ---- CHARYBDIS: the swirling maw ----
  if(has("whirlpool")){
    drawMaw(pen, g, vx, vy, R, t, intensity);
  }

  // ---- DEBRIS: raft-timbers riding the swirl; one is the released TARGET ----
  let targetXY=null;
  if(has("debris")){
    const rand=rnd(4242);
    for(let i=0;i<params.debris;i++){
      const isTarget = (i===2);
      const baseAng = rand()*Math.PI*2;
      const baseR  = lerp(0.62,0.95,rand());
      const rr = R * lerp(0.34, baseR, spew);        // spew pushes timbers to the rim
      const ang = baseAng + t*0.7;
      // the released TARGET timber rests at a fixed legible seat on the rim so the
      // drop line + target ring stay readable; the rest orbit the swirl
      const x = isTarget ? L.targX*W : vx + Math.cos(ang)*rr;
      const y = isTarget ? L.targY*H : vy + Math.sin(ang)*rr*0.42;
      const pw = (isTarget?0.075:lerp(0.035,0.06,rand()))*W;
      const ph = (isTarget?0.026:0.018)*H;
      g.save(); g.translate(x,y); g.rotate(ang+Math.PI/2);
      pen.paint(()=>{ g.rect(-pw/2,-ph/2,pw,ph); }, toneSolid(inkLevel(6)), 3);
      // plank grain
      g.strokeStyle=inkLevel(2); g.lineWidth=1.4; g.globalAlpha=0.7;
      g.beginPath(); g.moveTo(-pw*0.42,0); g.lineTo(pw*0.42,0); g.stroke(); g.globalAlpha=1;
      g.restore();
      if(isTarget) targetXY={x,y};
    }
  }

  // ---- SEA-CLIFF: the low crag the fig is rooted in (lower-left) ----
  if(has("cliff")){
    pen.paint(()=>{
      g.moveTo(0, 0.30*H);
      g.lineTo(0.095*W, 0.275*H);
      g.lineTo(0.175*W, 0.39*H);
      g.lineTo(0.115*W, 0.49*H);
      g.lineTo(0.185*W, wy);
      g.lineTo(0, wy);
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    // strata seams
    g.save(); g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    for(let i=1;i<=3;i++){ const y=(0.34+0.075*i)*H;
      g.beginPath(); g.moveTo(0,y); g.lineTo((0.16-i*0.02)*W, y+8); g.stroke(); }
    g.restore();
  }

  // ---- TRUNK: leaves the rock, climbs to the fork ----
  if(has("trunk")){
    taperBranch(pen, g,
      quadPts(L.rootX*W, L.rootY*H, 0.18*W, 0.24*H, L.forkX*W, L.forkY*H, 14),
      W*0.050, W*0.026, 6);
    // bark seam
    g.save(); g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(L.rootX*W, L.rootY*H);
    g.quadraticCurveTo(0.18*W,0.24*H, L.forkX*W, L.forkY*H); g.stroke();
    g.restore();
  }

  // ---- BRANCHES: crown limbs + the long low GRASPABLE overhang ----
  if(has("branches")){
    const sway = Math.sin(t*1.1)*swayPx*1.4;
    // crown branch up-left
    taperBranch(pen, g,
      quadPts(L.forkX*W, L.forkY*H, 0.25*W, 0.08*H, 0.17*W+sway, 0.075*H, 10),
      W*0.028, W*0.011, 6);
    // crown branch up-right
    taperBranch(pen, g,
      quadPts(L.forkX*W, L.forkY*H, 0.40*W, 0.07*H, 0.46*W+sway, 0.085*H, 10),
      W*0.028, W*0.011, 6);
    // the LONG low graspable branch arching out over the maw to the hang-point
    taperBranch(pen, g,
      quadPts(0.30*W, 0.20*H, 0.46*W, 0.215*H, hx+sway*0.6, hy, 14),
      W*0.034, W*0.013, 6);
    // a short secondary graspable branch just below it
    taperBranch(pen, g,
      quadPts(0.34*W, 0.245*H, 0.46*W, 0.30*H, 0.52*W+sway*0.6, 0.355*H, 10),
      W*0.022, W*0.009, 6);
  }

  // ---- CANOPY: the dense wild fig crown ----
  if(has("canopy")){
    bushMass(pen, g, { cx:L.canopyX*W, cy:(L.canopyY+0.02)*H, rx:0.165*W, ry:0.085*H,
      n:11, minR:W*0.055, maxR:W*0.092, base:4, dark:5, darkP:0.40, seed:71, t, swayPx:swayPx*0.6 });
    bushMass(pen, g, { cx:L.canopyX*W, cy:L.canopyY*H, rx:0.205*W, ry:0.105*H,
      n:params.canopyClumps, minR:W*0.042, maxR:W*0.082, base:3, dark:4, darkP:0.20,
      stragglers:true, seed:913, t, swayPx });
    // a few broad fig leaves on the fringe
    const lr=rnd(555);
    for(let i=0;i<8;i++){
      const x=(0.14+lr()*0.30)*W, y=(0.10+lr()*0.13)*H;
      figLeaf(g, x, y, W*0.024, (lr()-0.5)*2.4, lr()<0.4?5:3);
    }
    // dark fig fruit
    g.fillStyle=inkLevel(6);
    const fr=rnd(202);
    for(let i=0;i<params.figs;i++){
      const x=(0.14+fr()*0.30)*W, y=(0.10+fr()*0.12)*H;
      g.beginPath(); g.ellipse(x, y, W*0.009, W*0.012, 0, 0, 7); g.fill();
    }
  }

  // ---- HANG-POINT: the graspable cling target + drop timing to the maw ----
  if(has("hangpoint")){
    const seat = targetXY || { x:L.targX*W, y:L.targY*H };
    // drop line: hang-point straight down through the timing gate to the timber
    g.save(); g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.65;
    g.setLineDash([7,7]);
    g.beginPath(); g.moveTo(hx, hy+W*0.02); g.lineTo(seat.x, seat.y); g.stroke();
    g.setLineDash([]); g.restore();
    // the hang ring (bright, sits under the branch)
    const rr = hang ? W*0.030 : W*0.024;
    pen.paint(()=>{ g.arc(hx, hy+W*0.028, rr, 0, 7); }, toneSolid(inkLevel(hang?1:2)), 3);
    g.strokeStyle=INK; g.lineWidth=2.4; g.beginPath(); g.arc(hx, hy+W*0.028, rr, 0, 7); g.stroke();
    // grip crosshair on the branch
    g.beginPath(); g.moveTo(hx-rr,hy+W*0.028); g.lineTo(hx+rr,hy+W*0.028);
    g.moveTo(hx,hy+W*0.028-rr); g.lineTo(hx,hy+W*0.028+rr); g.stroke();
    // target ring on the released timber (the drop destination)
    g.strokeStyle=INK; g.lineWidth=2.2;
    g.beginPath(); g.arc(seat.x, seat.y, W*0.028, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(seat.x-W*0.036,seat.y); g.lineTo(seat.x+W*0.036,seat.y);
    g.moveTo(seat.x,seat.y-W*0.036); g.lineTo(seat.x,seat.y+W*0.036); g.stroke();
    // blue diegetic ticks: hang-point + drop target
    g.fillStyle=ACCENT;
    g.fillRect(hx-W*0.008, hy-W*0.02, W*0.016, W*0.016);
    tracked(g, "HANG", hx-W*0.055, hy-W*0.055, W*0.026, W*0.006, INK);
    tracked(g, "DROP", seat.x-W*0.052, seat.y+W*0.06, W*0.024, W*0.006, INK);
  }
}

export const asset = {
  id:"set_piece.fig-tree-above-charybdis",
  type:"SET_PIECE",
  name:"Fig Tree Above Charybdis",
  statusWord:"OVERHANG",
  scene:"OD-B12-S07",

  params,
  // back -> front depth layers; scene state can pass a subset
  layers:["sky","water","whirlpool","debris","cliff","trunk","branches","canopy","hangpoint"],
  // normalized 0..1 placement / contact / camera anchors
  anchors:{
    "branch:hang-point": { x:L.hangX, y:L.hangY+0.028 }, // where a figure clings
    "branch:high":       { x:0.42,   y:L.forkY-0.02 },
    "trunk:root":        { x:L.rootX, y:L.rootY },
    "cliff:foot":        { x:0.08,   y:0.55 },
    "vortex:center":     { x:L.vortX, y:L.vortY },
    "debris:target":     { x:L.targX, y:L.targY },      // released raft-timber seat
    "drop:gate":         { x:0.62,   y:0.55 },          // timing gate on the drop line
    "camera:wide":       { x:0.50,   y:0.50 },
  },
  // collision boundaries + hazard footprint (normalized boxes)
  zones:{
    cliff:     { x0:0.00, y0:0.00, x1:0.24, y1:0.60 },   // solid rock
    canopy:    { x0:0.08, y0:0.02, x1:0.55, y1:0.24 },   // foliage occluder
    graspable: { x0:0.44, y0:0.24, x1:0.60, y1:0.37 },   // reachable branch span
    maw:       { x0:0.24, y0:0.60, x1:0.92, y1:0.98 },   // whirlpool hazard
  },
  states:{
    initial:"overhang",
    nodes:{
      // the tree arched over the maw, branches still — before the cling
      overhang:{ preview:{ layers:["sky","water","whirlpool","debris","cliff","trunk","branches","canopy","hangpoint"],
        spew:0.85, intensity:0.9, t:0.3, status:"OVERHANG", progress:.30 } },
      // a figure clinging to the hang-point, waiting out the vortex
      clinging:{ preview:{ layers:["sky","water","whirlpool","debris","cliff","trunk","branches","canopy","hangpoint"],
        hang:true, spew:0.55, intensity:1, t:1.1, status:"CLINGING", progress:.55 } },
      // suck phase — the throat swallows everything, timbers gone to the pit
      "vortex-suck":{ preview:{ layers:["sky","water","whirlpool","cliff","trunk","branches","canopy","hangpoint"],
        hang:true, spew:0.05, intensity:1, t:2.0, status:"SUCK", progress:.70 } },
      // spew phase — the maw flings the raft-timbers back to the rim: drop window
      "vortex-spew":{ preview:{ layers:["sky","water","whirlpool","debris","cliff","trunk","branches","canopy","hangpoint"],
        hang:true, spew:1.0, intensity:0.7, t:3.0, status:"SPEW", progress:.92 } },
    },
    edges:[["overhang","clinging"],["clinging","vortex-suck"],["vortex-suck","vortex-spew"],["vortex-spew","clinging"]],
  },
  channels:["vortex","hang","spew","drop","wind"],

  preview:()=>({
    layers:["sky","water","whirlpool","debris","cliff","trunk","branches","canopy","hangpoint"],
    spew:0.85, intensity:0.9, t:0.3, hang:false, status:"OVERHANG", progress:.30,
  }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
