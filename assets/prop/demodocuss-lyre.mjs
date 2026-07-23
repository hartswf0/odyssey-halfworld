/* prop.demodocuss-lyre — Demodocus's ornate Greek phorminx / lyre.
   PROP asset. A single reusable instrument: a domed tortoiseshell/wood
   soundbox, two tall out-curving arms (pecheis) tipped with carved volute
   scrolls, a crossbar yoke (zygon) carrying seven tuning pegs (kollopes),
   and seven strings falling to a bridge on the soundtable. Ornate — carved
   scrolls, a rayed soundhole rosette, a segmented shell — deliberately
   richer than Phemius's plain lyre.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B08-S02): the bard's instrument cycling through
   carry / tune / play / pause / song-cue. The whole lyre is drawn about a
   base pivot and tilted per state, so grip/contact anchors stay meaningful.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  strings:7,          // seven-string phorminx
  boxRxF:0.205,       // soundbox half-width  (fraction of W)
  boxRyF:0.140,       // soundbox half-height (fraction of H)
  boxCyF:0.700,       // soundbox center y    (fraction of H)
  armTopF:0.215,      // arm-tip / yoke height (fraction of H)
  armSpanF:0.170,     // half-distance between arm tips (fraction of W)
  wood:4,             // ash-wood arms base ink level
  shell:4,            // tortoiseshell base ink level
  yoke:4,             // crossbar ink level
};

/* per-state pose: base tilt about the soundbox foot + scene extras */
const POSE = {
  carry:   { angle:-0.30, status:"CARRIED",  progress:0.20 },
  tune:    { angle:-0.06, status:"TUNING",   progress:0.45, tunePeg:5 },
  play:    { angle: 0.02, status:"PLAYING",  progress:0.80, pluck:true },
  pause:   { angle: 0.00, status:"AT REST",  progress:0.10 },
  "song-cue":{ angle:0.00, status:"SONG",    progress:1.00, song:true },
};

function drawLyre(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "pause";
  const P = POSE[mode] || POSE.pause;
  const t = st.t || 0;

  const cx   = W*0.50;
  const boxCy= H*params.boxCyF;
  const bRx  = W*params.boxRxF;
  const bRy  = H*params.boxRyF;
  const footY= boxCy + bRy;              // ground/foot of the shell
  const pivot= { x:cx, y:footY };
  const armTopY = H*params.armTopF;
  const armSpan = W*params.armSpanF;
  const yokeY   = armTopY + H*0.010;

  // arm attachment points on the shoulders of the shell
  const shoulderY = boxCy - bRy*0.34;
  const attX = bRx*0.62;                 // arms spring from here, ± of cx

  /* ---- SONG-CUE radiating field, drawn in SCREEN space behind it ---- */
  if (P.song){
    g.save();
    g.strokeStyle="rgba(0,0,0,0.16)"; g.lineWidth=3; g.lineCap="round";
    const src={ x:cx, y:boxCy-bRy*0.15 };
    for(let i=0;i<7;i++){
      const r = bRx*(1.35 + i*0.34);
      g.beginPath(); g.arc(src.x, src.y, r, Math.PI*1.16, Math.PI*1.84); g.stroke();
    }
    g.restore();
    // a couple of note glyphs drifting up-right
    g.fillStyle="rgba(0,0,0,0.30)";
    const note=(nx,ny,s)=>{ g.beginPath(); g.ellipse(nx,ny,s*0.9,s*0.6,-0.4,0,7); g.fill();
      g.strokeStyle="rgba(0,0,0,0.30)"; g.lineWidth=Math.max(2,s*0.34);
      g.beginPath(); g.moveTo(nx+s*0.8,ny-s*0.2); g.lineTo(nx+s*0.8,ny-s*2.6); g.stroke(); };
    note(cx+bRx*1.9, boxCy-bRy*1.7, 12);
    note(cx+bRx*2.5, boxCy-bRy*2.6, 9);
  }

  // ---------- everything below rotates about the shell foot ----------
  g.save();
  g.translate(pivot.x, pivot.y); g.rotate(P.angle); g.translate(-pivot.x, -pivot.y);

  /* ============ SOUNDBOX (tortoiseshell dome) ============ */
  const shellPath = ()=>{
    g.moveTo(cx-bRx, shoulderY);
    // slightly convex soundtable across the top
    g.quadraticCurveTo(cx, shoulderY-bRy*0.14, cx+bRx, shoulderY);
    // rounded bowl down the right, across the bottom, up the left
    g.quadraticCurveTo(cx+bRx*1.06, boxCy+bRy*0.55, cx, footY);
    g.quadraticCurveTo(cx-bRx*1.06, boxCy+bRy*0.55, cx-bRx, shoulderY);
  };
  pen.paint(shellPath, toneSolid(inkLevel(params.shell)), 5);
  // clip the shell to lay in ornament
  g.save(); g.beginPath(); shellPath(); g.clip();
  // soft highlight upper-left, shadow lower-right => reads as a dome
  g.fillStyle=inkLevel(2);
  g.beginPath(); g.ellipse(cx-bRx*0.36, boxCy-bRy*0.10, bRx*0.52, bRy*0.62, -0.5,0,7); g.fill();
  g.fillStyle=inkLevel(6);
  g.beginPath(); g.ellipse(cx+bRx*0.56, boxCy+bRy*0.52, bRx*0.44, bRy*0.5, -0.4,0,7); g.fill();
  // tortoiseshell scutes: a central spine of plates + flanking plates
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  // spine
  g.beginPath(); g.moveTo(cx, shoulderY+bRy*0.05); g.lineTo(cx, footY-4); g.stroke();
  // horizontal plate seams
  for(let k=1;k<=4;k++){
    const yy = lerp(shoulderY+bRy*0.15, footY-bRy*0.15, k/5);
    const wgt = bRx*(0.92 - k*0.10);
    g.beginPath(); g.moveTo(cx-wgt, yy); g.quadraticCurveTo(cx, yy+bRy*0.10, cx+wgt, yy); g.stroke();
  }
  // side vertical seams (marginal scutes)
  for(const s of [-1,1]){
    g.beginPath();
    g.moveTo(cx+s*bRx*0.52, shoulderY+bRy*0.1);
    g.quadraticCurveTo(cx+s*bRx*0.66, boxCy, cx+s*bRx*0.30, footY-bRy*0.2);
    g.stroke();
  }
  g.restore();

  /* rayed SOUNDHOLE ROSETTE on the soundtable */
  const rozY = boxCy - bRy*0.02, rozR = bRx*0.28;
  pen.paint(()=>{ g.arc(cx, rozY, rozR, 0, 7); }, toneSolid(inkLevel(2)), 4);
  g.strokeStyle=INK; g.lineWidth=2.2;
  for(let i=0;i<12;i++){ const a=i/12*Math.PI*2;
    g.beginPath(); g.moveTo(cx+Math.cos(a)*rozR*0.32, rozY+Math.sin(a)*rozR*0.32);
    g.lineTo(cx+Math.cos(a)*rozR*0.92, rozY+Math.sin(a)*rozR*0.92); g.stroke(); }
  pen.paint(()=>{ g.arc(cx, rozY, rozR*0.30, 0, 7); }, toneSolid(inkLevel(6)), 3);

  /* ============ BRIDGE (strings anchor near the foot) ============ */
  const bridgeY = boxCy + bRy*0.44, bridgeHalf = W*0.075;
  pen.paint(()=>{ g.rect(cx-bridgeHalf, bridgeY-6, bridgeHalf*2, 12); }, toneSolid(inkLevel(6)), 4);

  /* ============ TWO CURVED ARMS (pecheis) with volute scrolls ============ */
  function drawArm(side){
    const bx = cx + side*attX, by = shoulderY - bRy*0.02;   // arm base on shoulder
    const tx = cx + side*armSpan, ty = armTopY;             // arm tip (scroll center-ish)
    // outer & inner control points bow the arm outward then back in
    const oc1x=cx+side*bRx*1.18, oc1y=lerp(by,ty,0.45);
    const oc2x=cx+side*armSpan*1.16, oc2y=lerp(by,ty,0.86);
    const ic1x=cx+side*armSpan*0.72, ic1y=lerp(by,ty,0.80);
    const ic2x=cx+side*bRx*0.66, ic2y=lerp(by,ty,0.42);
    const wBase=W*0.036, wTip=W*0.020;
    const armPath=()=>{
      g.moveTo(bx-side*wBase*0.5, by);
      g.bezierCurveTo(oc1x, oc1y, oc2x, oc2y, tx, ty);
      g.lineTo(tx - side*wTip, ty + wTip*0.4);
      g.bezierCurveTo(ic1x, ic1y, ic2x, ic2y, bx+side*wBase*0.5, by);
      g.closePath();
    };
    pen.paint(armPath, toneSolid(inkLevel(params.wood)), 5);
    // rounded highlight down the outer face of the arm
    g.save(); g.beginPath(); armPath(); g.clip();
    g.strokeStyle=inkLevel(2); g.lineWidth=wBase*0.34; g.lineCap="round";
    g.beginPath(); g.moveTo(bx, by-4);
    g.bezierCurveTo(oc1x-side*wBase*0.2, oc1y, oc2x-side*wBase*0.2, oc2y, tx-side*wTip*0.3, ty+2);
    g.stroke();
    g.restore();
    // carved VOLUTE SCROLL at the tip (the ornate signature)
    const scR=W*0.036, sxc=tx, syc=ty-scR*0.2;
    pen.paint(()=>{ g.arc(sxc, syc, scR, 0, 7); }, toneSolid(inkLevel(3)), 5);
    g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round"; g.beginPath();
    for(let a=0;a<Math.PI*3.2;a+=0.2){ const rr=scR*(0.86 - a/(Math.PI*3.2)*0.72);
      const px=sxc+Math.cos(a+side*1.2)*rr, py=syc+Math.sin(a+side*1.2)*rr;
      a===0?g.moveTo(px,py):g.lineTo(px,py); }
    g.stroke();
    pen.paint(()=>{ g.arc(sxc,syc,scR*0.16,0,7); }, toneSolid(inkLevel(6)), 2);
    return { bx, by, tx, ty };
  }
  const armL = drawArm(-1);
  const armR = drawArm( 1);

  /* ============ CROSSBAR YOKE (zygon) + tuning pegs (kollopes) ============ */
  const yL = cx - armSpan, yR = cx + armSpan, ybH=W*0.017;
  pen.paint(()=>{ g.rect(yL, yokeY-ybH, yR-yL, ybH*2); }, toneSolid(inkLevel(params.yoke)), 5);
  // decorative banding on the yoke
  g.strokeStyle=INK; g.lineWidth=2;
  g.beginPath(); g.moveTo(yL, yokeY-ybH*0.35); g.lineTo(yR, yokeY-ybH*0.35); g.stroke();
  g.beginPath(); g.moveTo(yL, yokeY+ybH*0.35); g.lineTo(yR, yokeY+ybH*0.35); g.stroke();
  // knob finials just past each arm tip
  for(const s of [-1,1]){ pen.paint(()=>{ g.arc(cx+s*(armSpan+W*0.006), yokeY, ybH*1.15, 0,7); }, toneSolid(inkLevel(6)), 4); }

  // tuning pegs: little posts standing up off the yoke, one per string
  const N=params.strings, span=W*0.072, pegY=yokeY;
  const pegX=i=> cx + lerp(-span, span, N===1?0.5:i/(N-1));
  for(let i=0;i<N;i++){
    const px=pegX(i);
    const tuned = (P.tunePeg===i);
    const lv = tuned ? 7 : 5;
    pen.paint(()=>{ g.rect(px-W*0.006, pegY-ybH*2.1, W*0.012, ybH*2.1); }, toneSolid(inkLevel(lv)), 3);
    pen.paint(()=>{ g.arc(px, pegY-ybH*2.1, W*0.011, 0,7); }, toneSolid(inkLevel(lv)), 3);
    if (tuned){ // turning arrow around the highlighted peg (TUNE cue)
      g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
      g.beginPath(); g.arc(px, pegY-ybH*2.1, W*0.026, Math.PI*0.1, Math.PI*1.5); g.stroke();
      const aa=Math.PI*1.5, ar=W*0.026, hx=px+Math.cos(aa)*ar, hy=(pegY-ybH*2.1)+Math.sin(aa)*ar;
      g.beginPath(); g.moveTo(hx,hy); g.lineTo(hx-6,hy-7); g.moveTo(hx,hy); g.lineTo(hx+7,hy-4); g.stroke();
    }
  }

  /* ============ STRINGS (peg -> bridge) ============ */
  g.lineCap="round";
  for(let i=0;i<N;i++){
    const topx=pegX(i);
    const botx=lerp(cx-bridgeHalf*0.86, cx+bridgeHalf*0.86, N===1?0.5:i/(N-1));
    const vib = P.pluck ? Math.sin(t*22 + i)*Math.min(3, i*0.7)*Math.exp(-((i-2)*(i-2))*0.15) : 0;
    const midx=(topx+botx)/2 + vib;
    g.strokeStyle="#141414"; g.lineWidth = 1.6 + i*0.12;   // bass->treble subtly thicker at low i
    g.beginPath(); g.moveTo(topx, pegY);
    g.quadraticCurveTo(midx, lerp(pegY,bridgeY,0.5), botx, bridgeY-2);
    g.stroke();
  }

  /* ============ PLECTRUM + strike cue for PLAY ============ */
  if (P.pluck){
    const plx=cx+bridgeHalf*0.55, ply=lerp(pegY,bridgeY,0.62);
    g.save(); g.translate(plx,ply); g.rotate(0.5);
    pen.paint(()=>{ g.moveTo(0,-14); g.lineTo(9,10); g.lineTo(-9,10); g.closePath(); }, toneSolid(inkLevel(6)),3);
    g.restore();
    g.strokeStyle="rgba(0,0,0,0.22)"; g.lineWidth=3; g.lineCap="round";
    g.beginPath(); g.arc(plx-6, ply, 26, Math.PI*1.15, Math.PI*1.55); g.stroke();
  }

  g.restore(); // end rotated frame
}

export const asset = {
  id:"prop.demodocuss-lyre",
  type:"PROP",
  name:"Demodocus's Lyre",
  statusWord:"TUNED",
  scene:"OD-B08-S02",

  params,
  // back -> front draw order the module honors
  layers:["song-field","shadow","soundbox","rosette","bridge","arms","scrolls","yoke","pegs","strings","plectrum"],

  // normalized 0..1 attachment / contact anchors (neutral 'pause' pose;
  // the runtime re-derives them under the state tilt about 'foot').
  anchors:{
    grip:{x:.50,y:.70},           // held cradled at the soundbox
    "grip:cross":{x:.50,y:.235},  // steadied at the yoke while tuning
    foot:{x:.50,y:.84},           // base/contact pivot (rests on knee/ground)
    "arm:left":{x:.33,y:.215},
    "arm:right":{x:.67,y:.215},
    "peg:tuning":{x:.60,y:.225},  // the peg worked in the tune state
    bridge:{x:.50,y:.762},        // strings' lower anchor
    soundhole:{x:.50,y:.698},     // resonant center / emission source
    "string:top":{x:.50,y:.235},
  },
  // collision shape: an upright oval around the whole frame (asset space)
  collision:{ kind:"oval", cx:.50, cy:.52, rx:.24, ry:.34 },
  ownership:"demodocus",          // the Phaeacian bard's own instrument

  states:{
    initial:"pause",
    nodes:{
      carry:   { preview:{ mode:"carry",    status:"CARRIED", progress:0.20 } },
      tune:    { preview:{ mode:"tune",     status:"TUNING",  progress:0.45 } },
      play:    { preview:{ mode:"play",     status:"PLAYING", progress:0.80 } },
      pause:   { preview:{ mode:"pause",    status:"AT REST", progress:0.10 } },
      "song-cue":{ preview:{ mode:"song-cue",status:"SONG",   progress:1.00 } },
    },
    edges:[
      ["carry","tune"],["tune","pause"],["pause","play"],
      ["play","song-cue"],["song-cue","play"],["play","pause"],
      ["pause","carry"],["tune","play"],
    ],
  },
  channels:["angle","state","pluck","t"],

  preview:()=>({ mode:"pause", status:"AT REST", progress:0.10, t:0 }),
  draw(ctx,W,H,state){ drawLyre(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
