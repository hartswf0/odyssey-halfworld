/* divine_fx.athenas-homeward-wind — the goddess-sent steady wind that runs
   Telemachus' ship home overnight on a route that SWERVES around the suitors'
   ambush. DIVINE_FX asset. Scene function (OD-B15-S03): a SOURCE (Athena, a
   star-emblem high at the left where she breathes the wind) sends a STEADY,
   ALIGNED directional FIELD of gust lines that flat-fill the ship's square sail
   (TARGET) and drive it eastward through the night — but the safe heading is not
   a straight line: a marked AMBUSH ZONE (a danger ring + bold X, lurking rocks
   at the waterline) sits on the direct route, so the wind's CONSEQUENCE is a
   CURVING SAFE-PATH: a bold arced route-arrow that lifts up and over the danger
   X and comes back down to the home landfall at the right, avoiding it entirely.

   Procedural: SOURCE (Athena star-emblem) -> FIELD (aligned gust lines filling
   the sail) -> TARGET (belled sail on the hull) -> the curving SAFE-PATH arrow
   swerving around the AMBUSH X to the home landfall. Animates over state.t: the
   aligned gusts march east, the sail breathes taut, flow chevrons run along the
   safe curve, the ambush ring pulses its warning, the sea drifts. The `intensity`
   channel scales gust reach/darkness, sail belly, and how boldly the safe curve
   is drawn; the `avoid` channel is how hard the route bends clear of the X.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:  0.64,    // sea/sky waterline as frac of H — the ship rides here
  dir:      1,       // drive direction (+1 = eastward = toward home, right)
  source:  "athena", // the wind's origin — Athena's star-emblem, upper-left
  gusts:    5,       // aligned gust lines filling the sail (left air)
  mastX:    0.27,    // ship's mast x as frac of W (left, so the route has room)
  yardHW:   0.145,   // half-width of the sail yard as frac of W
  seaHatch: 8,       // chop rows below the waterline
  ambushX:  0.66,    // ambush-zone centre x (frac of W) — on the direct heading
  ambushY:  0.52,    // ambush-zone centre y (frac of H) — near the waterline
  belly:    1.0,     // master sail-fill (channel-driven)
  avoid:    1.0,     // how hard the safe route bends clear of the ambush
  intensity:1.0,     // overall field strength
};

/* cubic bezier point + unit tangent, for the safe-path route geometry */
function cubicPt(P,u){
  const mt=1-u, a=mt*mt*mt, b=3*mt*mt*u, c=3*mt*u*u, d=u*u*u;
  return { x:a*P[0].x+b*P[1].x+c*P[2].x+d*P[3].x, y:a*P[0].y+b*P[1].y+c*P[2].y+d*P[3].y };
}
function cubicTan(P,u){
  const mt=1-u;
  const dx=3*mt*mt*(P[1].x-P[0].x)+6*mt*u*(P[2].x-P[1].x)+3*u*u*(P[3].x-P[2].x);
  const dy=3*mt*mt*(P[1].y-P[0].y)+6*mt*u*(P[2].y-P[1].y)+3*u*u*(P[3].y-P[2].y);
  const n=Math.hypot(dx,dy)||1; return { x:dx/n, y:dy/n };
}

/* ---- NIGHT SKY: the airspace the wind streams through (kept light so dark
   marks read), a moon disc top-right + a scatter of star ticks. ---- */
function drawSky(pen,g,W,H){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);              // night airspace (near-paper)
  g.fillStyle = inkLevel(2); g.fillRect(0,0,W,hy*0.34);         // a touch darker high band
  // moon, upper-right — bright disc, hard contour, crescent shadow
  const mx=W*0.86, my=H*0.12, mr=W*0.062;
  pen.paint(()=>{ g.arc(mx,my,mr,0,TAU); }, toneSolid(inkLevel(1)), 4);
  pen.paint(()=>{ g.arc(mx+mr*0.42,my-mr*0.12,mr*0.92,0,TAU); }, toneSolid(inkLevel(2)), 0);
  pen.ink(()=>{ g.arc(mx,my,mr,0,TAU); }, 4);
  // star ticks — small dark crosses
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  const stars=[[0.10,0.09],[0.20,0.17],[0.33,0.07],[0.47,0.12],[0.60,0.08],[0.74,0.19]];
  for(const [sx,sy] of stars){
    const x=W*sx,y=H*sy,s=W*0.009;
    g.beginPath(); g.moveTo(x-s,y); g.lineTo(x+s,y); g.moveTo(x,y-s); g.lineTo(x,y+s); g.stroke();
  }
}

/* ---- SOURCE: Athena's star-emblem, high at the left, where the goddess breathes
   the wind — an eight-point starburst with a bloom of short curved gust strokes
   fanning east off it (the wind she sends after the ship). ---- */
function drawSource(pen,g,W,H,t,inten){
  const dir=params.dir, strength=clamp(inten,0,1.6);
  const sx=W*0.11, sy=H*0.20, R=W*0.045*(0.8+0.3*strength);
  // eight-point star (owl-eyed grey goddess mark)
  g.fillStyle=inkLevel(7);
  g.beginPath();
  for(let k=0;k<16;k++){
    const a=k/16*TAU, rr=(k%2? R*0.42:R);
    const px=sx+Math.cos(a)*rr, py=sy+Math.sin(a)*rr;
    k? g.lineTo(px,py):g.moveTo(px,py);
  }
  g.closePath(); g.fill();
  g.strokeStyle=INK; g.lineWidth=3; g.stroke();
  pen.paint(()=>{ g.arc(sx,sy,R*0.30,0,TAU); }, toneSolid(inkLevel(1)), 3);   // bright core
  // conjured bloom — short curved gust strokes fanning east off the emblem
  g.strokeStyle=inkLevel(3+Math.round(strength)); g.lineWidth=3; g.lineCap="round";
  for(let k=0;k<4;k++){
    const yk=sy+(k-1.5)*H*0.028;
    const l=W*0.10*(0.6+strength)*(0.82+0.18*Math.sin(t*1.8+k));
    g.beginPath(); g.moveTo(sx+dir*R*0.9,yk);
    g.quadraticCurveTo(sx+dir*(R*0.9+l*0.5),yk-6, sx+dir*(R*0.9+l),yk); g.stroke();
  }
}

/* ---- FIELD: aligned gust lines filling the sail — steady, evenly-spaced,
   near-straight streamlines sweeping east through the LEFT air (behind + into
   the sail), each with a chevron tip. They march east over t. Kept to the left
   band so the safe-path route reads clearly on the right. ---- */
function drawGusts(pen,g,W,H,t,inten){
  const hy=H*params.horizon, dir=params.dir, n=params.gusts;
  const strength=clamp(inten,0,1.6);
  g.lineCap="round"; g.lineJoin="round";
  for(let i=0;i<n;i++){
    const fy=(i+0.5)/n;
    const y=lerp(hy*0.10, hy*0.80, fy);                        // steady — no wobble
    const edge=1-Math.abs(fy-0.5)*0.5;
    const len=lerp(W*0.16, W*0.24, clamp(strength,0,1.3));     // uniform reach (aligned)
    const period=W*0.34;
    const march=((t*40*(0.4+strength)+i*(period/n))%period);
    const x0=W*0.04+march;
    const x1=Math.min(x0+dir*len, W*params.mastX+params.yardHW*W*0.4); // pour into the sail
    if (x0>=W*0.50) continue;                                  // left band only
    g.strokeStyle=inkLevel(2+Math.round(edge*2+strength));     // ~3..5
    g.lineWidth=lerp(3,5.5,clamp(strength/1.3,0,1))*(0.7+0.3*edge);
    g.beginPath(); g.moveTo(x0,y); g.quadraticCurveTo((x0+x1)/2,y-3,x1,y); g.stroke();
    const ah=lerp(9,18,clamp(strength/1.2,0,1))*(0.75+0.25*edge);
    g.beginPath();
    g.moveTo(x1-dir*ah,y-ah*0.60); g.lineTo(x1,y); g.lineTo(x1-dir*ah,y+ah*0.60); g.stroke();
  }
}

/* ---- AMBUSH ZONE: the suitors' waiting trap on the direct heading — jagged
   dark rocks rising at the waterline with a small lurking hull hidden behind,
   under a pulsing warning RING slashed by a bold X. This is what the safe route
   swerves clear of. ---- */
function drawAmbush(pen,g,W,H,t){
  const hy=H*params.horizon;
  const ax=W*params.ambushX, ay=H*params.ambushY, R=W*0.085;
  // jagged rocks at the waterline
  const rockBase=hy+H*0.006;
  pen.paint(()=>{
    g.moveTo(ax-R*0.9, rockBase);
    g.lineTo(ax-R*0.55, rockBase-H*0.05);
    g.lineTo(ax-R*0.2,  rockBase-H*0.02);
    g.lineTo(ax+R*0.1,  rockBase-H*0.07);
    g.lineTo(ax+R*0.5,  rockBase-H*0.03);
    g.lineTo(ax+R*0.95, rockBase-H*0.055);
    g.lineTo(ax+R*1.05, rockBase);
    g.closePath();
  }, toneSolid(inkLevel(6)), 5);
  // a small lurking hull tucked behind the rocks (the waiting ambush ship)
  pen.paint(()=>{
    g.moveTo(ax+R*0.15, rockBase-H*0.006);
    g.quadraticCurveTo(ax+R*0.55, rockBase+H*0.02, ax+R*0.95, rockBase-H*0.006);
    g.quadraticCurveTo(ax+R*0.55, rockBase+H*0.008, ax+R*0.15, rockBase-H*0.006);
    g.closePath();
  }, toneSolid(inkLevel(7)), 3);
  pen.limb(()=>{ g.moveTo(ax+R*0.55,rockBase-H*0.006); g.lineTo(ax+R*0.55,rockBase-H*0.055); },
    toneSolid(inkLevel(7)), W*0.006);                          // its little mast

  // pulsing warning RING above the rocks
  const pulse=0.90+0.10*Math.sin(t*3);
  const rr=R*1.02*pulse;
  // hatched interior (diagonal lines) so the ring reads as a hazard field
  g.save();
  g.beginPath(); g.arc(ax,ay,rr,0,TAU); g.clip();
  g.strokeStyle=inkLevel(3); g.lineWidth=2.5;
  for(let d=-rr;d<rr;d+=W*0.018){
    g.beginPath(); g.moveTo(ax-rr+d,ay-rr); g.lineTo(ax+rr+d,ay+rr); g.stroke();
  }
  g.restore();
  pen.ink(()=>{ g.arc(ax,ay,rr,0,TAU); }, 5);                  // hard ring contour
  // the bold X — DANGER
  g.strokeStyle=INK; g.lineWidth=7; g.lineCap="round";
  const xr=rr*0.62;
  g.beginPath(); g.moveTo(ax-xr,ay-xr); g.lineTo(ax+xr,ay+xr);
  g.moveTo(ax+xr,ay-xr); g.lineTo(ax-xr,ay+xr); g.stroke();
}

/* ---- the DIRECT (unsafe) heading: a faint dashed straight line running from
   the ship's prow through the ambush X — the route the wind does NOT take. Drawn
   light + dashed so the bold safe curve dominates. ---- */
function drawDirect(pen,g,W,H){
  const hy=H*params.horizon;
  const p0={x:W*params.mastX+W*0.14, y:hy-H*0.02};
  const p1={x:W*0.95, y:H*(params.ambushY-0.03)};
  g.save();
  g.strokeStyle=inkLevel(3); g.lineWidth=3; g.lineCap="round"; g.setLineDash([10,12]);
  g.beginPath(); g.moveTo(p0.x,p0.y); g.lineTo(p1.x,p1.y); g.stroke();
  g.restore();
}

/* ---- the SAFE-PATH: the bold curving route-arrow — the wind's consequence. A
   cubic sweeps up from the ship's prow, arcs OVER the ambush ring, and comes
   back down to the home landfall on the right. Drawn as a dark corridor (black
   casing + solid core) with flow chevrons running along it and a big arrowhead
   at the landfall. `avoid` lifts the apex higher clear of the X. ---- */
function drawSafePath(pen,g,W,H,t,inten,avoid){
  const hy=H*params.horizon, dir=params.dir;
  const strength=clamp(inten,0,1.6);
  const lift=H*(0.30-0.10*clamp(avoid,0,1.4));                 // apex height (smaller y = higher)
  const P=[
    { x:W*(params.mastX+0.14), y:hy-H*0.03 },                 // off the prow
    { x:W*0.50, y:lift },                                     // rise
    { x:W*0.70, y:lift+H*0.01 },                              // crest over the ambush
    { x:W*0.86, y:H*(params.ambushY-0.11) },                  // heading down toward home landfall
  ];
  // the corridor: black casing + solid mid core (bold, dark route)
  const lw=W*0.017*(0.8+0.25*strength);
  pen.limb(()=>{
    g.moveTo(P[0].x,P[0].y);
    g.bezierCurveTo(P[1].x,P[1].y,P[2].x,P[2].y,P[3].x,P[3].y);
  }, toneSolid(inkLevel(6)), lw);

  // flow chevrons marching along the curve (direction of travel)
  const marks=5;
  const off=(t*0.13)%(1/marks);
  g.strokeStyle=inkLevel(1); g.lineWidth=3; g.lineCap="round"; g.lineJoin="round";
  for(let m=0;m<marks;m++){
    const u=clamp01(0.10+m/marks+off);
    if (u>0.92) continue;
    const p=cubicPt(P,u), tg=cubicTan(P,u), nx=-tg.y, ny=tg.x;
    const s=lw*0.42;
    g.beginPath();
    g.moveTo(p.x-tg.x*s+nx*s, p.y-tg.y*s+ny*s);
    g.lineTo(p.x+tg.x*s, p.y+tg.y*s);
    g.lineTo(p.x-tg.x*s-nx*s, p.y-tg.y*s-ny*s);
    g.stroke();
  }
  // big arrowhead at the landfall end
  const pe=cubicPt(P,1), tge=cubicTan(P,1), nex=-tge.y, ney=tge.x;
  const ah=W*0.05*(0.85+0.2*strength);
  g.fillStyle=inkLevel(7);
  g.beginPath();
  g.moveTo(pe.x+tge.x*ah*0.5, pe.y+tge.y*ah*0.5);
  g.lineTo(pe.x-tge.x*ah*0.5+nex*ah*0.55, pe.y-tge.y*ah*0.5+ney*ah*0.55);
  g.lineTo(pe.x-tge.x*ah*0.5-nex*ah*0.55, pe.y-tge.y*ah*0.5-ney*ah*0.55);
  g.closePath(); g.fill();
  g.strokeStyle=INK; g.lineWidth=3; g.lineJoin="round"; g.stroke();
}

/* ---- home LANDFALL: a small dark headland at the right edge where the safe
   route lands — the destination the overnight run reaches. ---- */
function drawLandfall(pen,g,W,H){
  const hy=H*params.horizon;
  const lx=W*0.965, top=H*(params.ambushY-0.02);
  pen.paint(()=>{
    g.moveTo(W, hy);
    g.lineTo(W, top-H*0.02);
    g.quadraticCurveTo(lx-W*0.02, top-H*0.03, lx-W*0.05, top+H*0.03);
    g.lineTo(lx-W*0.08, hy);
    g.closePath();
  }, toneSolid(inkLevel(6)), 5);
}

/* ---- SEA: base water + chop rows driven eastward, steepening toward the
   foreground — the night sea the ship crosses. ---- */
function drawSea(pen,g,W,H,t,inten){
  const hy=H*params.horizon;
  g.fillStyle=inkLevel(3); g.fillRect(0,hy,W,H-hy);            // water body (mid)
  g.fillStyle=inkLevel(4); g.fillRect(0,hy,W,H*0.028);         // darker seam at horizon
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);
  const dir=params.dir, strength=clamp(inten,0,1.6), n=params.seaHatch;
  g.lineCap="round"; g.lineJoin="round";
  for(let r=0;r<n;r++){
    const f=r/(n-1);
    const y=lerp(hy+H*0.028, H*0.985, f);
    const rowLvl=Math.round(lerp(4,6,f));
    const amp=lerp(4,14,f)*(0.7+0.5*strength);
    const step=lerp(48,32,f);
    const drift=t*30*dir*(0.4+strength)+r*11;
    g.strokeStyle=inkLevel(rowLvl); g.lineWidth=lerp(2,4.5,f);
    for(let x=-step;x<W+step;x+=step){
      const cx=x+(drift%step);
      g.beginPath();
      g.moveTo(cx,y);
      g.lineTo(cx+step*0.30+dir*amp*0.35, y-amp);
      g.lineTo(cx+step*0.60, y);
      g.stroke();
    }
  }
}

/* ---- the SHIP: hull crescent + mast, drawn dark (the sail added separately). ---- */
function drawHull(pen,g,W,H){
  const hy=H*params.horizon, mx=W*params.mastX;
  const bx0=mx-W*0.15, bx1=mx+W*0.17, keel=hy+H*0.052;
  pen.paint(()=>{
    g.moveTo(bx0, hy-2);
    g.quadraticCurveTo(mx, keel, bx1, hy-2);
    g.quadraticCurveTo(mx+W*0.02, hy+H*0.010, bx0, hy-2);
    g.closePath();
  }, toneSolid(inkLevel(7)), 5);
  // upturned prow stem (east)
  pen.paint(()=>{
    g.moveTo(bx1-4, hy-2);
    g.lineTo(bx1+W*0.03, hy-H*0.050);
    g.lineTo(bx1-W*0.02, hy-2);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  const mastTopY=H*0.22;
  pen.limb(()=>{ g.moveTo(mx, hy-2); g.lineTo(mx, mastTopY); }, toneSolid(inkLevel(7)), W*0.012);
  return { mx, mastTopY };
}

/* ---- the SAIL filled by the homeward wind: a square sail on a yard, bellied
   taut to leeward (east), with billow seams + short east-pointing fill arrows.
   `belly` grows with intensity; a small t-pulse makes it breathe. ---- */
function drawSail(pen,g,W,H,mx,t,inten,bellyMul){
  const dir=params.dir, yardHW=W*params.yardHW;
  const yardY=H*0.26, sailTopY=yardY+H*0.006, sailBotY=H*0.50;
  const midY=(sailTopY+sailBotY)/2;
  const belly=(W*0.052*bellyMul)*(0.55+0.55*clamp(inten,0,1.4))*(0.93+0.07*Math.sin(t*1.5));
  const luffX=mx-yardHW*0.86, leechTop=mx+yardHW*0.94;
  const tone=toneSolid(inkLevel(3));                           // light cloth so seams/arrows read
  pen.limb(()=>{ g.moveTo(mx-yardHW,yardY); g.lineTo(mx+yardHW,yardY); }, toneSolid(inkLevel(7)), W*0.012);
  pen.paint(()=>{
    g.moveTo(luffX, sailTopY);
    g.lineTo(leechTop, sailTopY);
    g.quadraticCurveTo(leechTop+dir*belly, midY, mx+yardHW*0.66, sailBotY);
    g.quadraticCurveTo(mx, sailBotY+belly*0.60, luffX, sailBotY);
    g.lineTo(luffX, sailTopY);
    g.closePath();
  }, tone, 5);
  g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round";
  for(let s=1;s<=3;s++){
    const f=s/4, y=lerp(sailTopY,sailBotY,f), rxs=lerp(leechTop, mx+yardHW*0.66, f);
    const bow=belly*(0.7+0.5*Math.sin(f*Math.PI));
    g.beginPath(); g.moveTo(luffX,y); g.quadraticCurveTo((luffX+rxs)/2+dir*bow, y, rxs, y); g.stroke();
  }
  g.strokeStyle=INK; g.lineWidth=3;
  for(let a=0;a<3;a++){
    const y=lerp(sailTopY+(sailBotY-sailTopY)*0.22, sailBotY-(sailBotY-sailTopY)*0.20, a/2);
    const ax0=luffX+dir*yardHW*0.20, ax1=ax0+dir*(yardHW*0.9+belly*0.4);
    g.beginPath(); g.moveTo(ax0,y); g.lineTo(ax1,y); g.stroke();
    const ah=W*0.017;
    g.beginPath(); g.moveTo(ax1-dir*ah,y-ah*0.7); g.lineTo(ax1,y); g.lineTo(ax1-dir*ah,y+ah*0.7); g.stroke();
  }
  // pennant streaming from the mast top, pointing the wind's heading
  const ptx=mx, pty=H*0.22, flag=W*0.10*(0.6+0.6*clamp(inten,0,1.3));
  pen.paint(()=>{
    g.moveTo(ptx,pty);
    g.quadraticCurveTo(ptx+dir*flag*0.6, pty-H*0.012+Math.sin(t*3)*6, ptx+dir*flag, pty+H*0.006+Math.sin(t*3+1)*5);
    g.lineTo(ptx+dir*flag*0.66, pty+H*0.014);
    g.quadraticCurveTo(ptx+dir*flag*0.32, pty+H*0.006, ptx, pty+H*0.012);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=st.t ?? 0;
  const inten=st.intensity ?? params.intensity;
  const bellyMul=st.belly ?? params.belly;
  const avoid=st.avoid ?? params.avoid;
  const layers=st.layers || ["sky","source","gusts","sea","ambush","landfall","direct","safepath","hull","sail"];
  const has=l=>layers.includes(l);

  if (has("sky"))      drawSky(pen,g,W,H);
  if (has("source"))   drawSource(pen,g,W,H,t,inten);
  if (has("gusts"))    drawGusts(pen,g,W,H,t,inten);
  if (has("sea"))      drawSea(pen,g,W,H,t,inten);
  if (has("ambush"))   drawAmbush(pen,g,W,H,t);
  if (has("landfall")) drawLandfall(pen,g,W,H);
  if (has("direct"))   drawDirect(pen,g,W,H);
  if (has("safepath")) drawSafePath(pen,g,W,H,t,inten,avoid);
  let mx=W*params.mastX;
  if (has("hull"))     { const r=drawHull(pen,g,W,H); mx=r.mx; }
  if (has("sail"))     drawSail(pen,g,W,H,mx,t,inten,bellyMul);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.athenas-homeward-wind",
  type:"DIVINE_FX",
  name:"Athena's homeward wind",
  statusWord:"HOMEWARD",
  scene:"OD-B15-S03",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sky","source","gusts","sea","ambush","landfall","direct","safepath","hull","sail"],
  // normalized 0..1 source/target/field/direction/consequence anchors
  anchors:{
    "source:athena":{  x:0.11, y:0.20 },   // Athena's star-emblem, breathing the wind
    "field:air":{      x:0.32, y:0.30 },   // the aligned gust airspace filling the sail
    "target:sail":{    x:0.31, y:0.36 },   // the belled sail the wind fills
    "ship:mast-top":{  x:0.27, y:0.22 },
    "ambush:zone":{    x:0.66, y:0.52 },   // the marked danger X the route avoids
    "route:apex":{     x:0.60, y:0.24 },   // where the safe curve crests over the danger
    "direction:home":{ x:0.95, y:0.46 },   // the home landfall the route reaches
    "sea:driven":{     x:0.42, y:0.84 },
    "camera:wide":{    x:0.50, y:0.50 },
  },
  // affected regions (air the gusts fill, sea driven, ambush danger zone, route)
  zones:{
    air:{    x0:0.00, y0:0.02, x1:0.55, y1:0.60 },
    sea:{    x0:0.00, y0:0.64, x1:1.00, y1:1.00 },
    sail:{   x0:0.13, y0:0.26, x1:0.44, y1:0.53 },
    ambush:{ x0:0.55, y0:0.42, x1:0.78, y1:0.66 },
    route:{  x0:0.38, y0:0.18, x1:0.98, y1:0.60 },
  },
  // DIVINE_FX transform states: still potential -> rising -> steady homeward drive
  states:{
    initial:"homeward",
    nodes:{
      // still: emblem faint, slack sail, route only lightly sketched, X at rest
      still:{    preview:{ t:0.4, intensity:0.30, belly:0.4, avoid:0.7, status:"STILL",    progress:0.12 } },
      // rising: the aligned field gathers, sail fills, the safe curve firms up
      rising:{   preview:{ t:1.4, intensity:0.80, belly:0.8, avoid:1.0, status:"RISING",   progress:0.48 } },
      // homeward: full steady wind, sail taut, bold safe route swerving the X (neutral)
      homeward:{ preview:{ t:2.6, intensity:1.35, belly:1.1, avoid:1.2, status:"HOMEWARD", progress:0.86 } },
    },
    edges:[["still","rising"],["rising","homeward"],["homeward","rising"],["rising","still"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","belly","avoid","direction"],

  // neutral preview: full steady homeward wind — aligned gusts filling the taut
  // sail, the bold safe-path arrow lifting over the ambush X to the home landfall
  // (reads unmistakably as Athena's homeward wind avoiding the ambush).
  preview:()=>({ t:2.4, intensity:1.3, belly:1.05, avoid:1.2, status:"HOMEWARD", progress:0.80,
                 layers:["sky","source","gusts","sea","ambush","landfall","direct","safepath","hull","sail"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
