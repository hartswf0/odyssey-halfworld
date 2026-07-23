/* vehicle.final-black-ship — the last surviving black galley, through its end.
   VEHICLE asset. The same dark crescent war-galley look as the black Ithacan
   ship (long black hull, curling sternpost, single amidships mast + yard +
   square sail, bank of oars), but carried through its DESTRUCTION: Zeus's bolt
   strikes the single remaining vessel and it comes apart — launch / sailing /
   lightning-impact / mast-break / hull-separation (the keel + mast splitting
   off) / debris / lost. Drawn EMPTY — no crew baked in.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B12-S07): the single surviving vessel launching, sailing,
   the lightning impact, the mast breaking, the hull separating, then debris and
   the empty lost sea. Board/ride/dock/pilot anchors, breaking-part anchors,
   collision box, motion + destruction states.
   Atlas: reusable boarded object breaking apart. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  oarPairs:9,           // oars along one side
  hullInk:6,            // dark hull tone (the "black ship")
  wormWales:3,          // plank seams following the sheer
  mastInk:5,
  sailInk:2,            // pale cloth
  waterInk:1,           // near-paper sea
};

/* ---- fixed rig geometry in the 660x880 source (fractions of W/H) ---- */
function rig(W,H){
  const waterY   = H*0.660;
  const xS       = W*0.130;               // stern tip
  const xB       = W*0.870;               // bow tip
  const mid      = W*0.500;
  const half     = (xB - xS)/2;
  const midSheer = waterY - H*0.082;      // gunwale height amidships
  const sheerRise= H*0.050;               // ends rise above the amidships dip
  const keelDrop = H*0.086;               // keel depth below the sheer amidships
  const mastX    = W*0.500;
  const mastTop  = waterY - H*0.520;
  const mastFoot = midSheer + keelDrop*0.5;
  const yardY    = waterY - H*0.470;
  const yardX0   = W*0.312, yardX1 = W*0.688;
  return { waterY, xS, xB, mid, half, midSheer, sheerRise, keelDrop,
           mastX, mastTop, mastFoot, yardY, yardX0, yardX1 };
}
/* gunwale (sheer) height at x — rises toward the ends */
function gunY(R,x){
  const u = clamp((x - R.mid)/R.half, -1, 1);
  return R.midSheer - (1 - u*u)*0 - u*u*R.sheerRise;
}
/* keel (underside) height at x — a crescent that meets the sheer at the tips */
function keelY(R,x){
  const u = clamp((x - R.mid)/R.half, -1, 1);
  return gunY(R,x) + (1 - u*u)*R.keelDrop;
}

/* sample the hull outline for x in [x0,x1] as a closed polygon (top then keel) */
function hullPoly(g, R, x0, x1){
  const N = 22;
  g.moveTo(x0, gunY(R,x0));
  for (let i=1;i<=N;i++){ const x=lerp(x0,x1,i/N); g.lineTo(x, gunY(R,x)); }
  for (let i=N;i>=0;i--){ const x=lerp(x0,x1,i/N); g.lineTo(x, keelY(R,x)); }
  g.closePath();
}

/* wales (plank seams) following the sheer between x0..x1 */
function wales(g, R, x0, x1){
  g.strokeStyle = inkLevel(4); g.lineWidth = 1.6;
  for (let s=1;s<=params.wormWales;s++){
    const off = R.keelDrop*0.26*s;
    g.beginPath();
    const N=18;
    for (let i=0;i<=N;i++){ const x=lerp(x0,x1,i/N); const y=gunY(R,x)+8+off;
      i===0?g.moveTo(x,y):g.lineTo(x,y); }
    g.stroke();
  }
}

/* a floating plank / fragment for debris + lost states */
function plank(pen,g, x, y, len, th, ang, ink){
  g.save(); g.translate(x,y); g.rotate(ang);
  pen.paint(()=>{ g.rect(-len/2,-th/2,len,th); }, toneSolid(inkLevel(ink)), 3);
  // a couple of seam ticks
  g.strokeStyle = inkLevel(2); g.lineWidth = 1.4;
  for (let s=-len/2+len*0.28; s<len/2; s+=len*0.30){ g.beginPath(); g.moveTo(s,-th/2+2); g.lineTo(s,th/2-2); g.stroke(); }
  g.restore();
}

/* the sternpost curl (aphlaston) */
function sternCurl(pen,g,R,W,H, dx=0, dy=0){
  pen.limb(()=>{
    g.moveTo(R.xS+dx, gunY(R,R.xS)+dy);
    g.quadraticCurveTo(W*0.050+dx, R.waterY - H*0.245+dy, W*0.110+dx, R.waterY - H*0.312+dy);
    g.quadraticCurveTo(W*0.160+dx, R.waterY - H*0.342+dy, W*0.148+dx, R.waterY - H*0.290+dy);
  }, toneSolid(inkLevel(params.hullInk)), 11);
}

/* the mast + yard + sail, optionally broken/toppling.
   break=0 intact upright; break>0 the upper mast has snapped and swings by `ang`. */
function drawRig(pen,g,R,W,H, { sail="furled", brk=0, ang=0, T=0 }){
  const snapY = lerp(R.mastTop, R.mastFoot, 0.42);   // where the mast snaps
  // lower stump (always)
  const topOfStump = brk>0 ? snapY : R.mastTop;
  pen.limb(()=>{ g.moveTo(R.mastX, topOfStump); g.lineTo(R.mastX, R.mastFoot); },
           toneSolid(inkLevel(params.mastInk)), 12);
  if (brk>0){
    // splintered break
    g.strokeStyle = INK; g.lineWidth = 2;
    g.beginPath(); g.moveTo(R.mastX-6, snapY); g.lineTo(R.mastX+2, snapY-10);
    g.lineTo(R.mastX+7, snapY-2); g.stroke();
  }

  // the upper spar group (mast head + yard + sail) — rotates about the snap point when broken
  g.save();
  if (brk>0){ g.translate(R.mastX, snapY); g.rotate(ang); g.translate(-R.mastX, -snapY); }
  const upTop = brk>0 ? snapY : R.mastTop;
  const upBot = brk>0 ? snapY - 4 : R.mastTop;
  // upper mast section
  pen.limb(()=>{ g.moveTo(R.mastX, R.mastTop); g.lineTo(R.mastX, upTop); },
           toneSolid(inkLevel(params.mastInk)), 11);
  // mast-head cap
  pen.paint(()=>{ g.arc(R.mastX, R.mastTop, 6, 0, 7); }, toneSolid(inkLevel(6)), 3);
  // yard (spar)
  pen.limb(()=>{ g.moveTo(R.yardX0, R.yardY); g.lineTo(R.yardX1, R.yardY); },
           toneSolid(inkLevel(params.mastInk)), 8);

  if (sail === "full"){
    const belly = W*0.030 + Math.sin(T)*W*0.006;
    const footY = R.waterY - H*0.190;
    pen.paint(()=>{
      g.moveTo(R.yardX0+6, R.yardY+4);
      g.lineTo(R.yardX1-6, R.yardY+4);
      g.quadraticCurveTo(R.yardX1+belly, (R.yardY+footY)/2, W*0.632, footY);
      g.quadraticCurveTo(R.mastX, footY+H*0.026, W*0.368, footY);
      g.quadraticCurveTo(R.yardX0-belly, (R.yardY+footY)/2, R.yardX0+6, R.yardY+4);
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk)), 4);
    // brail lines + a reef band
    g.strokeStyle = inkLevel(3); g.lineWidth = 1.5;
    for (let x=R.yardX0+22; x<R.yardX1-14; x+=W*0.052){
      g.beginPath(); g.moveTo(x, R.yardY+6);
      g.quadraticCurveTo(x+belly*0.4, (R.yardY+footY)/2, x, footY-6); g.stroke();
    }
  } else if (sail === "torn"){
    // ragged, shredded sail hanging from the yard
    const footY = R.waterY - H*0.230;
    pen.paint(()=>{
      g.moveTo(R.yardX0+8, R.yardY+4);
      g.lineTo(R.yardX1-8, R.yardY+4);
      g.lineTo(R.yardX1-8, footY-H*0.03);
      g.lineTo(W*0.600, footY);
      g.lineTo(W*0.560, footY-H*0.05);
      g.lineTo(R.mastX,  footY-H*0.01);
      g.lineTo(W*0.430, footY-H*0.06);
      g.lineTo(W*0.400, footY-H*0.02);
      g.lineTo(R.yardX0+8, footY-H*0.04);
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk)), 4);
  } else {
    // FURLED: sail rolled into a bundle lashed along the yard
    pen.paint(()=>{ g.ellipse(R.mastX, R.yardY+H*0.014, (R.yardX1-R.yardX0)/2-6, H*0.024, 0, 0, 7); },
              toneSolid(inkLevel(params.sailInk+1)), 4);
    g.strokeStyle = INK; g.lineWidth = 1.8;
    for (let x=R.yardX0+18; x<R.yardX1-10; x+=W*0.050){
      g.beginPath(); g.moveTo(x, R.yardY-H*0.008); g.lineTo(x, R.yardY+H*0.036); g.stroke();
    }
  }
  g.restore();
}

/* draw a whole (or listing) hull with oars, wales, ram-eye, deck, hold */
function drawWholeHull(pen,g,R,W,H, { oars=true, T=0 }){
  // oars behind the hull
  if (oars){
    const nOar = params.oarPairs;
    const ox0 = W*0.250, ox1 = W*0.760, oarLen = H*0.140;
    for (let i=0;i<nOar;i++){
      const px = lerp(ox0, ox1, i/(nOar-1));
      const py = gunY(R,px);
      let dx=0.30, dy=-0.92; const dn=Math.hypot(dx,dy); dx/=dn; dy/=dn;
      const bx=px+dx*oarLen, by=py+dy*oarLen;
      pen.limb(()=>{ g.moveTo(px,py); g.lineTo(bx,by); }, toneSolid(inkLevel(4)), 5);
      pen.paint(()=>{ g.ellipse(bx,by,W*0.013,H*0.020,Math.atan2(dy,dx),0,7); }, toneSolid(inkLevel(5)), 3);
    }
  }
  sternCurl(pen,g,R,W,H);
  // hull body (dark crescent)
  pen.paint(()=>{ hullPoly(g,R,R.xS,R.xB); }, toneSolid(inkLevel(params.hullInk)), 5);
  // bow ram beyond the stem
  pen.paint(()=>{
    g.moveTo(R.xB, gunY(R,R.xB));
    g.lineTo(W*0.952, R.waterY+H*0.006);
    g.lineTo(R.xB-4, keelY(R,R.xB-4));
    g.closePath();
  }, toneSolid(inkLevel(params.hullInk)), 4);
  // topstrake highlight under the sheer
  g.save(); g.strokeStyle=inkLevel(2); g.lineWidth=H*0.015; g.lineCap="round";
  g.beginPath();
  const N=18; for(let i=0;i<=N;i++){ const x=lerp(R.xS+8,R.xB-8,i/N); const y=gunY(R,x)+9;
    i===0?g.moveTo(x,y):g.lineTo(x,y); } g.stroke(); g.restore();
  wales(g,R,R.xS+10,R.xB-10);
  // painted eye at the prow
  g.fillStyle=inkLevel(1); g.beginPath(); g.ellipse(W*0.822,R.waterY-H*0.052,W*0.019,H*0.017,0,0,7); g.fill();
  g.strokeStyle=INK; g.lineWidth=2.4; g.beginPath(); g.ellipse(W*0.822,R.waterY-H*0.052,W*0.019,H*0.017,0,0,7); g.stroke();
  g.fillStyle=INK; g.beginPath(); g.arc(W*0.822,R.waterY-H*0.052,3.2,0,7); g.fill();
  // deck line + open hold
  pen.ink(()=>{ const N=16; for(let i=0;i<=N;i++){ const x=lerp(R.xS+14,R.xB-14,i/N); const y=gunY(R,x)+H*0.012;
    i===0?g.moveTo(x,y):g.lineTo(x,y);} }, 2);
  const holdX0=W*0.372, holdX1=W*0.462, holdTop=R.midSheer+H*0.018, holdBot=R.waterY-H*0.006;
  pen.paint(()=>{ g.rect(holdX0,holdTop,holdX1-holdX0,holdBot-holdTop); }, toneSolid(inkLevel(7)), 4);
  g.strokeStyle=inkLevel(3); g.lineWidth=2;
  for(let r=holdX0+8;r<holdX1-4;r+=12){ g.beginPath(); g.moveTo(r,holdTop+3); g.lineTo(r,holdBot-3); g.stroke(); }
}

/* the two separating hull pieces (keel + mast fragment breaking from the bow) */
function drawSeparation(pen,g,R,W,H, { spread=1, T=0 }){
  const xM = W*0.512;                         // jagged break just aft of the mast
  // BOW piece — pitches up and drifts to the right
  g.save();
  g.translate(W*0.055*spread, -H*0.010*spread);
  g.rotate(0.10*spread);
  pen.paint(()=>{
    hullPoly(g,R,xM,R.xB);
  }, toneSolid(inkLevel(params.hullInk)), 5);
  pen.paint(()=>{
    g.moveTo(R.xB, gunY(R,R.xB));
    g.lineTo(W*0.952, R.waterY+H*0.006);
    g.lineTo(R.xB-4, keelY(R,R.xB-4));
    g.closePath();
  }, toneSolid(inkLevel(params.hullInk)), 4);
  wales(g,R,xM+6,R.xB-10);
  // jagged break edge
  g.strokeStyle=INK; g.lineWidth=3; g.beginPath();
  g.moveTo(xM, gunY(R,xM));
  g.lineTo(xM+10, lerp(gunY(R,xM),keelY(R,xM),0.30));
  g.lineTo(xM-6,  lerp(gunY(R,xM),keelY(R,xM),0.55));
  g.lineTo(xM+8,  lerp(gunY(R,xM),keelY(R,xM),0.80));
  g.lineTo(xM, keelY(R,xM)); g.stroke();
  g.restore();

  // STERN + KEEL/MAST piece — heels over to the left and settles lower
  g.save();
  g.translate(-W*0.030*spread, H*0.024*spread);
  g.rotate(-0.13*spread);
  sternCurl(pen,g,R,W,H);
  pen.paint(()=>{ hullPoly(g,R,R.xS,xM); }, toneSolid(inkLevel(params.hullInk)), 5);
  wales(g,R,R.xS+10,xM-4);
  // jagged break edge (mirrors the bow piece)
  g.strokeStyle=INK; g.lineWidth=3; g.beginPath();
  g.moveTo(xM, gunY(R,xM));
  g.lineTo(xM-10, lerp(gunY(R,xM),keelY(R,xM),0.30));
  g.lineTo(xM+6,  lerp(gunY(R,xM),keelY(R,xM),0.55));
  g.lineTo(xM-8,  lerp(gunY(R,xM),keelY(R,xM),0.80));
  g.lineTo(xM, keelY(R,xM)); g.stroke();
  // the keel + broken mast rising from this piece, toppling
  drawRig(pen,g,R,W,H,{ sail:"torn", brk:1, ang:0.55*spread, T });
  g.restore();
}

/* scatter of debris across the sea */
function drawDebris(pen,g,R,W,H,T){
  // the broken mast + yard floating flat on the water
  g.save(); g.translate(W*0.34, R.waterY+H*0.010); g.rotate(0.06);
  pen.limb(()=>{ g.moveTo(-W*0.16,0); g.lineTo(W*0.18,0); }, toneSolid(inkLevel(params.mastInk)), 11);
  pen.limb(()=>{ g.moveTo(-W*0.02,-H*0.02); g.lineTo(W*0.10,H*0.03); }, toneSolid(inkLevel(params.mastInk)), 7); // yard askew
  // shred of sail draped on the water
  pen.paint(()=>{ g.moveTo(W*0.02,H*0.004); g.quadraticCurveTo(W*0.09,-H*0.03,W*0.16,H*0.006);
                  g.quadraticCurveTo(W*0.09,H*0.03,W*0.02,H*0.004); g.closePath(); },
            toneSolid(inkLevel(params.sailInk+1)), 3);
  g.restore();
  // scattered planks
  plank(pen,g, W*0.640, R.waterY+H*0.030, W*0.150, H*0.020, -0.12, params.hullInk);
  plank(pen,g, W*0.760, R.waterY+H*0.070, W*0.110, H*0.017,  0.16, params.hullInk-1);
  plank(pen,g, W*0.235, R.waterY+H*0.060, W*0.120, H*0.018,  0.10, params.hullInk);
  plank(pen,g, W*0.480, R.waterY+H*0.086, W*0.090, H*0.015, -0.18, params.hullInk-1);
  // the curled sternpost fragment still afloat
  g.save(); g.translate(W*0.120, R.waterY+H*0.02); g.rotate(0.5);
  sternCurl(pen,g,{ ...R, xS:0, mid:0, half:R.half }, W,H, 0, 0);
  g.restore();
}

function drawSea(g,R,W,H,T, rough=0){
  g.fillStyle = inkLevel(params.waterInk); g.fillRect(0, R.waterY, W, H - R.waterY);
  g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.lineCap="round";
  const amp = 3 + rough*7;
  for (let k=0;k<4;k++){
    const wy = R.waterY + H*0.028 + k*H*0.030;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.045){
      const y = wy + Math.sin(x*0.03 + k*1.7 + T)*amp + (rough?Math.sin(x*0.11+k)*rough*3:0);
      x===0?g.moveTo(x,y):g.lineTo(x,y);
    }
    g.stroke();
  }
}

/* the thunderbolt striking down onto the mast/ship */
function drawBolt(pen,g,R,W,H,T){
  const tx = R.mastX, ty = R.mastTop - H*0.006;
  // radiant flash behind the strike (light halo -> subtractive: draw pale ring)
  g.save();
  g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.globalAlpha=0.8;
  for (let a=0;a<12;a++){ const th=a/12*Math.PI*2; g.beginPath();
    g.moveTo(tx+Math.cos(th)*W*0.05, ty+Math.sin(th)*W*0.05);
    g.lineTo(tx+Math.cos(th)*W*0.10, ty+Math.sin(th)*W*0.10); g.stroke(); }
  g.globalAlpha=1; g.restore();
  // the jagged bolt from the top of the frame down to the mast head
  const pts = [
    {x:W*0.44, y:0},
    {x:W*0.52, y:H*0.10},
    {x:W*0.46, y:H*0.16},
    {x:W*0.54, y:H*0.24},
    {x:W*0.47, y:H*0.30},
    {x:tx,     y:ty},
  ];
  // dark casing
  g.strokeStyle=INK; g.lineWidth=9; g.lineJoin="round"; g.lineCap="round";
  g.beginPath(); pts.forEach((p,i)=> i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)); g.stroke();
  // bright core
  g.strokeStyle=inkLevel(1); g.lineWidth=3.5;
  g.beginPath(); pts.forEach((p,i)=> i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)); g.stroke();
  // a forked branch
  g.strokeStyle=INK; g.lineWidth=5;
  g.beginPath(); g.moveTo(W*0.46,H*0.16); g.lineTo(W*0.38,H*0.22); g.lineTo(W*0.41,H*0.27); g.stroke();
  // impact burst at the mast head
  g.strokeStyle=INK; g.lineWidth=3;
  for (let a=0;a<8;a++){ const th=a/8*Math.PI*2; g.beginPath();
    g.moveTo(tx,ty); g.lineTo(tx+Math.cos(th)*W*0.045, ty+Math.sin(th)*W*0.045); g.stroke(); }
}

/* per-mode pose */
const POSE = {
  launch:      { status:"LAUNCH",        progress:0.12 },
  sailing:     { status:"SAILING",       progress:0.30 },
  lightning:   { status:"LIGHTNING",     progress:0.48 },
  "mast-break":{ status:"DISMASTED",     progress:0.62 },
  separation:  { status:"BREAKING",      progress:0.80 },
  debris:      { status:"DEBRIS",        progress:0.92 },
  lost:        { status:"LOST",          progress:1.00 },
};

function draw(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const R = rig(W,H);
  const T = st.t || 0;
  const mode = st.mode || "sailing";

  const rough = (mode==="lightning"||mode==="mast-break") ? 0.9
              : (mode==="separation") ? 1.4
              : (mode==="debris") ? 1.2
              : (mode==="lost") ? 0.3 : (mode==="launch"?0.2:0.5);
  drawSea(g,R,W,H,T,rough);
  pen.ink(()=>{ g.moveTo(0,R.waterY); g.lineTo(W,R.waterY); }, 2);

  if (mode==="launch" || mode==="sailing" || mode==="lightning" || mode==="mast-break"){
    const list = mode==="mast-break" ? 0.06 : (mode==="lightning"?0.02:0);
    g.save();
    // heel the vessel about the amidships waterline
    g.translate(R.mid, R.waterY); g.rotate(list); g.translate(-R.mid, -R.waterY);
    drawWholeHull(pen,g,R,W,H,{ oars: mode!=="mast-break", T });
    const sail = mode==="launch" ? "furled" : (mode==="mast-break"?"torn":"full");
    const brk  = mode==="mast-break" ? 1 : 0;
    const ang  = mode==="mast-break" ? 0.7 : 0;
    drawRig(pen,g,R,W,H,{ sail, brk, ang, T });
    g.restore();
  } else if (mode==="separation"){
    drawSeparation(pen,g,R,W,H,{ spread:1, T });
    // spray at the fault
    g.strokeStyle=inkLevel(3); g.lineWidth=2;
    for(let i=0;i<7;i++){ const x=W*0.50+ (i-3)*W*0.02; g.beginPath();
      g.moveTo(x,R.waterY-4); g.lineTo(x+(i-3)*3, R.waterY-H*0.05); g.stroke(); }
  } else if (mode==="debris"){
    drawDebris(pen,g,R,W,H,T);
  } else if (mode==="lost"){
    // near-empty sea, only a couple of small fragments remain
    plank(pen,g, W*0.560, R.waterY+H*0.070, W*0.120, H*0.017, -0.10, params.hullInk);
    plank(pen,g, W*0.360, R.waterY+H*0.120, W*0.080, H*0.013, 0.14, params.hullInk-1);
    // a lone spar tip
    pen.limb(()=>{ g.moveTo(W*0.66,R.waterY+H*0.030); g.lineTo(W*0.80,R.waterY+H*0.006); },
             toneSolid(inkLevel(params.mastInk)), 6);
  }

  if (mode==="lightning") drawBolt(pen,g,R,W,H,T);
}

export const asset = {
  id:"vehicle.final-black-ship",
  type:"VEHICLE",
  name:"Final Black Ship",
  statusWord:"SAILING",
  scene:"OD-B12-S07",

  params,
  // back -> front draw order the module honors
  layers:["sea","waterline","oars","sternpost","hull","ram","wales","eye","deck",
          "hold","mast","yard","sail","break-edges","debris","bolt"],

  // normalized 0..1 board / ride / dock / pilot + breaking-part anchors (EMPTY ship)
  anchors:{
    "board:amidships":{x:.360,y:.560},   // step over the gunwale
    "ride:deck":{x:.500,y:.578},         // open deck standing room
    "ride:rowbench":{x:.520,y:.592},     // rowers' benches
    "dock:portside":{x:.130,y:.780},     // the quay / beach at launch
    "pilot:stern-seat":{x:.180,y:.560},  // helmsman at the steering-oar
    mast:{x:.500,y:.318},                // mast head (bolt strike point)
    "mast:snap":{x:.500,y:.470},         // where the mast breaks
    "yard:center":{x:.500,y:.345},
    "hold:hatch":{x:.418,y:.610},
    "break:keel":{x:.512,y:.640},        // the hull-separation fault line
    "part:bow":{x:.740,y:.610},          // the bow piece that drifts off
    "part:stern":{x:.230,y:.585},        // the stern + keel + mast fragment
    bow:{x:.900,y:.630},
    stern:{x:.130,y:.585},
    "impact:strike":{x:.500,y:.150},     // bolt entry at the top of frame
    "waterline":{x:.500,y:.660},
  },
  // collision shape: the intact hull's floating footprint (asset space)
  collision:{ kind:"box", x0:.100, y0:.560, x1:.960, y1:.780 },
  capacity:{ rowers:18, benches:9, total:22 },
  ownership:"odysseus",                  // the last of Odysseus's ships

  states:{
    initial:"sailing",
    nodes:{
      launch:      { preview:{ mode:"launch",      status:"LAUNCH",    progress:0.12 } },
      sailing:     { preview:{ mode:"sailing",     status:"SAILING",   progress:0.30 } },
      lightning:   { preview:{ mode:"lightning",   status:"LIGHTNING", progress:0.48 } },
      "mast-break":{ preview:{ mode:"mast-break",  status:"DISMASTED", progress:0.62 } },
      separation:  { preview:{ mode:"separation",  status:"BREAKING",  progress:0.80 } },
      debris:      { preview:{ mode:"debris",      status:"DEBRIS",    progress:0.92 } },
      lost:        { preview:{ mode:"lost",        status:"LOST",      progress:1.00 } },
    },
    edges:[
      ["launch","sailing"],["sailing","lightning"],["lightning","mast-break"],
      ["mast-break","separation"],["separation","debris"],["debris","lost"],
    ],
  },
  channels:["mode","t"],

  preview:()=>({ mode:"sailing", status:"SAILING", progress:0.30, t:0.6 }),
  draw(ctx,W,H,state){ draw(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
