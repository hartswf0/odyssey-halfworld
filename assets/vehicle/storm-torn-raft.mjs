/* vehicle.storm-torn-raft — Odysseus's makeshift raft, breaking up in Poseidon's storm.
   VEHICLE asset. A profile view of a lashed log raft riding steep storm seas:
   a bundle of stripped tree-trunk logs bound with three rope withies into a low
   platform, a stepped mast with a small square sail, a fenced weather-screen of
   withies at the rail, and a steering-oar trailing aft. Drawn EMPTY — no rower
   baked in. Solid grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B05-S05): the raft cycling through its ruin —
     intact    · whole, mast up, sail set, sitting the swell
     rolling   · heeled hard over on a steep wave, one lashing gone
     dismasted · mast snapped, sail lost, timbers working loose
     scattered · lashings burst, logs flung apart across the crests
     regripped · reduced to one surviving timber with a rope grip clung to
     abandoned · bare waterlogged wreckage, low and empty
   Atlas: reusable boarded object; board/grip/dock anchors, moving/broken parts,
   collision. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  logCount:6,           // logs in the intact bundle
  hullInk:5,            // log body tone
  logEndInk:6,          // darker cut-end grain
  ropeInk:7,            // near-black lashings
  mastInk:5,
  sailInk:2,            // pale, weather-worn cloth
  seaInk:2,             // near-paper churning sea
  foamInk:1,            // white-ish foam
};

/* ---------- fixed geometry in the 660x880 source ---------- */
function rig(W,H){
  const waterY = H*0.600;              // mean sea level (trough the raft rides)
  const cx     = W*0.500;
  const raftW  = W*0.480;              // platform width (log length across)
  const logH   = H*0.026;              // one log's visible thickness
  const mastTop= -H*0.360;             // mast head, local to platform top
  return { waterY, cx, raftW, logH, mastTop };
}

/* per-state ruin descriptor. roll = heel angle (rad). sink = how low it floats.
   loose = trailing logs that have worked out of the bundle. */
const POSE = {
  intact:   { roll:-0.05, logs:6, mast:"up",   sail:"set",  oar:true,  loose:0, scatter:false, grip:false, sink:0.00, status:"INTACT",    progress:0.12 },
  rolling:  { roll: 0.46, logs:6, mast:"up",   sail:"set",  oar:true,  loose:1, scatter:false, grip:false, sink:0.05, status:"ROLLING",   progress:0.34 },
  dismasted:{ roll: 0.20, logs:6, mast:"snap", sail:"gone", oar:true,  loose:2, scatter:false, grip:false, sink:0.09, status:"DISMASTED", progress:0.52 },
  scattered:{ roll: 0.00, logs:6, mast:"gone", sail:"gone", oar:false, loose:6, scatter:true,  grip:false, sink:0.13, status:"SCATTERED", progress:0.72 },
  regripped:{ roll: 0.12, logs:1, mast:"gone", sail:"gone", oar:false, loose:0, scatter:false, grip:true,  sink:0.16, status:"REGRIPPED", progress:0.88 },
  abandoned:{ roll: 0.06, logs:2, mast:"gone", sail:"gone", oar:false, loose:0, scatter:false, grip:false, sink:0.22, status:"ABANDONED",progress:1.00 },
};

/* draw one horizontal log beam centered at (0,0) in the current transform:
   a rounded bar with a lighter top-strake highlight, a length seam, and
   concentric end-grain rings at the right cut face. */
function logBeam(pen, g, len, th, bodyInk, endInk){
  const r = th*0.5;
  // body
  pen.paint(()=>{ roundRect(g, -len/2, -r, len, th, r); }, toneSolid(inkLevel(bodyInk)), 4);
  // top highlight strake (reads the round of the log)
  g.strokeStyle = inkLevel(clamp(bodyInk-3,1,7)); g.lineWidth = th*0.22; g.lineCap="round";
  g.beginPath(); g.moveTo(-len/2+r, -r*0.42); g.lineTo(len/2-r, -r*0.42); g.stroke();
  // a long grain seam
  g.strokeStyle = inkLevel(clamp(bodyInk+1,1,7)); g.lineWidth = 1.4;
  g.beginPath(); g.moveTo(-len/2+r, r*0.30); g.lineTo(len/2-r, r*0.30); g.stroke();
  // end-grain rings at right cut face
  g.save();
  g.strokeStyle = INK; g.lineWidth = 2;
  g.beginPath(); g.ellipse(len/2-r*0.35, 0, r*0.5, r*0.86, 0, 0, 7); g.stroke();
  g.strokeStyle = inkLevel(endInk); g.lineWidth = 1.4;
  g.beginPath(); g.ellipse(len/2-r*0.35, 0, r*0.28, r*0.5, 0, 0, 7); g.stroke();
  g.restore();
}

function roundRect(g, x, y, w, h, r){
  r = Math.min(r, Math.abs(h)/2, Math.abs(w)/2);
  g.moveTo(x+r, y); g.lineTo(x+w-r, y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w, y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r, y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x, y+r); g.arcTo(x,y,x+r,y,r); g.closePath();
}

/* the whole raft assembly, drawn in a local frame rotated by `roll`
   about the platform's flotation point. */
function drawRaft(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "intact";
  const P = POSE[mode] || POSE.intact;
  const R = rig(W,H);
  const T = st.t || 0;

  /* ============ STORM SEA — steep swell, raft sits a trough ============ */
  drawStormSea(g, pen, W, H, R, T, P);

  /* the raft floats at cx, lowered by sink; heels by roll. */
  const floatY = R.waterY + H*(P.sink) - H*0.010;
  const nLog   = P.logs;
  const ph     = R.logH*nLog;                       // platform thickness

  if (P.scatter){
    // ---- SCATTERED: lashings burst, logs flung across the crests ----
    drawScatteredLogs(g, pen, W, H, R, T);
  } else {
    g.save();
    g.translate(R.cx, floatY);
    g.rotate(P.roll);

    // half-submerged wash line across the bundle bottom (drawn under logs)
    // ---- the bundled platform: stacked log bars, lashed ----
    for (let i=0;i<nLog;i++){
      const y = (i - (nLog-1)/2) * R.logH + ph*0.10;
      // heavily damaged states: jitter a couple of the courses
      const jig = (mode==="dismasted" && i>=nLog-2) ? Math.sin(T*2+i)*4 : 0;
      const bodyInk = (i%2===0) ? params.hullInk : params.hullInk-1;
      g.save(); g.translate(jig, y);
      logBeam(pen, g, R.raftW, R.logH*1.02, bodyInk, params.logEndInk);
      g.restore();
    }

    // ---- three rope lashings binding the bundle (vertical withies) ----
    const lashGone = mode==="rolling" ? 1 : mode==="dismasted" ? 2 : 0;
    const lashX = [-R.raftW*0.30, 0, R.raftW*0.30];
    for (let k=0;k<3;k++){
      if (k < lashGone) continue;                    // this binding has parted
      const lx = lashX[k];
      g.strokeStyle = inkLevel(params.ropeInk); g.lineWidth = 6; g.lineCap="round";
      g.beginPath(); g.moveTo(lx, -ph/2-4); g.lineTo(lx, ph/2+4); g.stroke();
      // rope twist ticks
      g.strokeStyle = inkLevel(2); g.lineWidth = 1.4;
      for (let ty=-ph/2; ty<ph/2; ty+=8){ g.beginPath(); g.moveTo(lx-3,ty); g.lineTo(lx+3,ty+3); g.stroke(); }
    }
    // a parted lashing dangling loose (frayed rope) for rolling/dismasted
    if (lashGone>0){
      const lx = lashX[lashGone-1];
      g.strokeStyle = inkLevel(params.ropeInk); g.lineWidth = 4; g.lineCap="round";
      g.beginPath(); g.moveTo(lx, -ph/2-2);
      g.quadraticCurveTo(lx+18, -ph/2-18, lx+30, -ph/2-6); g.stroke();
    }

    // ---- withy weather-screen (low fence rail along the up-swell edge) ----
    if (mode==="intact" || mode==="rolling"){
      g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
      const railY = -ph/2, railX0 = -R.raftW*0.42, railX1 = R.raftW*0.42;
      g.beginPath(); g.moveTo(railX0, railY-H*0.030); g.lineTo(railX1, railY-H*0.030); g.stroke(); // top rail
      for (let x=railX0; x<=railX1; x+=R.raftW*0.12){
        g.beginPath(); g.moveTo(x, railY); g.lineTo(x, railY-H*0.030); g.stroke();                // stanchions
      }
    }

    // ---- loose trailing logs working out of the bundle ----
    for (let j=0;j<P.loose;j++){
      const side = (j%2===0)?1:-1;
      const lx = side*R.raftW*(0.42+0.06*j);
      const ly = ph*0.30 + j*H*0.006;
      const ang = side*(0.25+0.08*j) + Math.sin(T+j)*0.05;
      g.save(); g.translate(lx, ly); g.rotate(ang);
      logBeam(pen, g, R.raftW*0.5, R.logH*1.0, params.hullInk-1, params.logEndInk);
      g.restore();
    }

    // ---- MAST + SAIL + steering-oar (local so they heel with the raft) ----
    drawMastSail(g, pen, W, H, R, ph, P, T);
    if (P.grip) drawGrip(g, pen, W, H, R, ph);

    g.restore();
  }

  // front spray/foam curling over the raft's near shoulder (screen space)
  drawForeSpray(g, W, H, R, T, P);
}

/* ---- storm sea: a dark rolling swell with steep crests + foam ---- */
function drawStormSea(g, pen, W, H, R, T, P){
  // base sea
  g.fillStyle = inkLevel(params.seaInk); g.fillRect(0, R.waterY - H*0.10, W, H - (R.waterY - H*0.10));
  // big background swell — two steep crests flanking a trough
  const crest = (cxf, amp, ink)=>{
    g.fillStyle = inkLevel(ink);
    g.beginPath();
    g.moveTo(0, R.waterY+H*0.02);
    for (let x=0;x<=W;x+=W*0.02){
      const u = (x - cxf)/(W*0.34);
      const y = R.waterY - amp*Math.exp(-u*u*1.6) + Math.sin(x*0.05+T)*3;
      g.lineTo(x, y);
    }
    g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
  };
  crest(W*0.16, H*0.235, 3);            // left storm crest (behind)
  crest(W*0.86, H*0.265, 3);            // right storm crest (behind)
  // crest contours + wind-torn foam streaks on the shoulders
  g.strokeStyle = inkLevel(4); g.lineWidth = 2; g.lineCap="round";
  for (const [cxf,amp] of [[W*0.16,H*0.235],[W*0.86,H*0.265]]){
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.02){
      const u=(x-cxf)/(W*0.34); const y=R.waterY-amp*Math.exp(-u*u*1.6)+Math.sin(x*0.05+T)*3;
      x===0?g.moveTo(x,y):g.lineTo(x,y);
    }
    g.stroke();
  }
  // foam caps at the two crest tops
  for (const [cxf,amp] of [[W*0.16,H*0.235],[W*0.86,H*0.265]]){
    const ty = R.waterY - amp;
    g.fillStyle = inkLevel(params.foamInk);
    for (let k=0;k<7;k++){ g.beginPath(); g.arc(cxf + (k-3)*W*0.022, ty + Math.abs(k-3)*4, 6-Math.abs(k-3)*0.6, 0, 7); g.fill(); }
    g.strokeStyle = INK; g.lineWidth=1.6;
    g.beginPath(); g.arc(cxf, ty, 10, Math.PI*0.05, Math.PI*0.95, true); g.stroke();
  }
  // scud wave lines across the trough
  g.strokeStyle = inkLevel(3); g.lineWidth = 1.8; g.lineCap="round";
  for (let r=0;r<4;r++){
    const wy = R.waterY + H*0.03 + r*H*0.05;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.04){ const y=wy+Math.sin(x*0.04+r*1.3+T)*4; x===0?g.moveTo(x,y):g.lineTo(x,y); }
    g.stroke();
  }
}

/* ---- mast, yard, sail, steering-oar in the platform-local frame ---- */
function drawMastSail(g, pen, W, H, R, ph, P, T){
  const stepY = -ph/2;                       // mast heel at deck top
  if (P.mast === "up" || P.mast === "snap"){
    const mHead = P.mast==="up" ? R.mastTop : stepY - H*0.070;   // snapped short
    // mast
    pen.limb(()=>{ g.moveTo(0, stepY); g.lineTo(0, mHead); }, toneSolid(inkLevel(params.mastInk)), 11);
    if (P.mast==="up"){
      // masthead cap
      pen.paint(()=>{ g.arc(0, mHead, 5, 0, 7); }, toneSolid(inkLevel(6)), 3);
      // fore/back stays to the raft corners
      pen.ink(()=>{ g.moveTo(0, mHead+6); g.lineTo(-R.raftW*0.42, stepY); }, 1.8);
      pen.ink(()=>{ g.moveTo(0, mHead+6); g.lineTo( R.raftW*0.42, stepY); }, 1.8);
    } else {
      // SNAPPED: jagged splintered break + the broken upper mast fallen across the deck
      g.strokeStyle = INK; g.lineWidth = 2;
      g.beginPath(); g.moveTo(-6, mHead); g.lineTo(-2, mHead-10); g.lineTo(2, mHead-2); g.lineTo(6, mHead-12); g.stroke();
      g.save(); g.translate(R.raftW*0.18, -ph/2 - H*0.02); g.rotate(-0.9);
      logBeam(pen, g, H*0.20, R.logH*0.7, params.mastInk, params.logEndInk);
      g.restore();
    }
  }

  if (P.sail === "set" && P.mast==="up"){
    const yardY = R.mastTop + H*0.030;
    const yardX0 = -R.raftW*0.30, yardX1 = R.raftW*0.30;
    // yard
    pen.limb(()=>{ g.moveTo(yardX0, yardY); g.lineTo(yardX1, yardY); }, toneSolid(inkLevel(params.mastInk)), 6);
    // small square sail, bellied by the gale
    const belly = W*0.030 + Math.sin(T)*W*0.006;
    const footY = yardY + H*0.180;
    pen.paint(()=>{
      g.moveTo(yardX0+4, yardY+3);
      g.lineTo(yardX1-4, yardY+3);
      g.quadraticCurveTo(yardX1+belly, (yardY+footY)/2, R.raftW*0.20, footY);
      g.quadraticCurveTo(0, footY+H*0.024, -R.raftW*0.20, footY);
      g.quadraticCurveTo(yardX0-belly, (yardY+footY)/2, yardX0+4, yardY+3);
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk)), 4);
    // reef seams + torn edge
    g.strokeStyle = inkLevel(3); g.lineWidth = 1.4;
    for (let x=yardX0+14; x<yardX1-8; x+=R.raftW*0.10){
      g.beginPath(); g.moveTo(x, yardY+6); g.quadraticCurveTo(x+belly*0.4,(yardY+footY)/2, x, footY-6); g.stroke();
    }
    // sheets from the clews to the deck corners
    pen.ink(()=>{ g.moveTo(R.raftW*0.20, footY); g.lineTo(R.raftW*0.40, stepY); }, 1.6);
    pen.ink(()=>{ g.moveTo(-R.raftW*0.20, footY); g.lineTo(-R.raftW*0.40, stepY); }, 1.6);
  }

  // steering-oar trailing aft (right/stern edge), into the sea
  if (P.oar){
    g.save(); g.translate(R.raftW*0.44, -ph*0.1); g.rotate(0.55);
    pen.limb(()=>{ g.moveTo(0,0); g.lineTo(0, H*0.150); }, toneSolid(inkLevel(4)), 5);
    pen.paint(()=>{ g.ellipse(0, H*0.150, W*0.016, H*0.026, 0, 0, 7); }, toneSolid(inkLevel(5)), 3);
    // thole/oar-loop at the rail
    pen.paint(()=>{ g.arc(0, -2, 5, 0, 7); }, toneSolid(inkLevel(params.ropeInk)), 2);
    g.restore();
  }
}

/* ---- REGRIPPED: a single surviving timber with a rope handhold ---- */
function drawGrip(g, pen, W, H, R, ph){
  // rope grip loops lashed over the timber (what a castaway clings to)
  g.strokeStyle = inkLevel(params.ropeInk); g.lineWidth = 5; g.lineCap="round";
  for (const lx of [-R.raftW*0.12, R.raftW*0.12]){
    g.beginPath();
    g.moveTo(lx-10, -ph/2-2);
    g.quadraticCurveTo(lx, -ph/2-H*0.030, lx+10, -ph/2-2);
    g.stroke();
  }
  // frayed rope tail trailing into the water
  g.lineWidth = 3;
  g.beginPath(); g.moveTo(R.raftW*0.24, 0);
  g.quadraticCurveTo(R.raftW*0.34, H*0.03, R.raftW*0.30, H*0.06); g.stroke();
}

/* ---- SCATTERED: individual logs strewn across the storm crests ---- */
function drawScatteredLogs(g, pen, W, H, R, T){
  const spots = [
    { x:0.22, y:0.52, len:0.34, ang:-0.35, ink:5 },
    { x:0.44, y:0.62, len:0.30, ang: 0.18, ink:5 },
    { x:0.66, y:0.50, len:0.36, ang:-0.55, ink:4 },
    { x:0.80, y:0.66, len:0.24, ang: 0.62, ink:5 },
    { x:0.34, y:0.72, len:0.22, ang: 0.10, ink:6 },
    { x:0.58, y:0.74, len:0.28, ang:-0.15, ink:4 },
  ];
  for (const s of spots){
    const bob = Math.sin(T*1.5 + s.x*9)*4;
    g.save();
    g.translate(W*s.x, H*s.y + bob);
    g.rotate(s.ang + Math.sin(T + s.x*7)*0.04);
    logBeam(pen, g, W*s.len, R.logH*1.05, s.ink, params.logEndInk);
    g.restore();
    // little splash where each log meets the sea
    g.strokeStyle = inkLevel(1); g.lineWidth = 1.6; g.lineCap="round";
    g.beginPath();
    g.moveTo(W*s.x-8, H*s.y+R.logH+bob); g.lineTo(W*s.x-12, H*s.y+R.logH-8+bob);
    g.moveTo(W*s.x+8, H*s.y+R.logH+bob); g.lineTo(W*s.x+13, H*s.y+R.logH-7+bob);
    g.stroke();
  }
  // a snapped-off broken plank splinter, flying
  g.save(); g.translate(W*0.50, H*0.40); g.rotate(-0.8);
  logBeam(pen, g, W*0.14, R.logH*0.6, 6, params.logEndInk);
  g.restore();
}

/* ---- fore spray: white water breaking over the near shoulder ---- */
function drawForeSpray(g, W, H, R, T, P){
  const heavy = P.sink > 0.08;
  g.save();
  g.fillStyle = inkLevel(params.foamInk);
  const base = R.waterY + H*0.02;
  for (let k=0;k<(heavy?10:6);k++){
    const x = W*(0.30+0.05*k) + Math.sin(T*2+k)*6;
    const y = base + Math.sin(k*1.7)*10;
    g.beginPath(); g.arc(x, y, 7-((k%3)), 0, 7); g.fill();
  }
  // torn spray streaks lifting off the wave
  g.strokeStyle = INK; g.lineWidth = 1.4; g.lineCap="round";
  for (let k=0;k<5;k++){
    const x = W*(0.34+0.08*k);
    g.beginPath(); g.moveTo(x, base-2); g.quadraticCurveTo(x+8, base-18, x+16, base-14); g.stroke();
  }
  g.restore();
}

export const asset = {
  id:"vehicle.storm-torn-raft",
  type:"VEHICLE",
  name:"Storm-torn Raft",
  statusWord:"INTACT",
  scene:"OD-B05-S05",

  params,
  // back -> front draw order the module honors
  layers:["sea","swell","foam-crests","logs","lashings","rail","loose-logs",
          "mast","stays","yard","sail","steering-oar","grip","scatter","fore-spray"],

  // normalized 0..1 board / grip / dock anchors on the INTACT raft (EMPTY)
  anchors:{
    "board:deck":{x:.500,y:.560},        // step onto the platform amidships
    "ride:deck":{x:.500,y:.575},         // standing/lying room on the logs
    "grip:mast":{x:.500,y:.470},         // hold the mast when it heels
    "grip:steering-oar":{x:.700,y:.560}, // helm the raft with the quarter-oar
    "grip:rail":{x:.320,y:.540},         // clutch the withy weather-screen
    "grip:beam":{x:.560,y:.575},         // the surviving timber (regripped)
    "dock:beach":{x:.500,y:.860},        // the shore/surf the raft can be run onto
    mast:{x:.500,y:.360},
    "yard:center":{x:.500,y:.395},
    stern:{x:.720,y:.560},
    bow:{x:.280,y:.560},
    waterline:{x:.500,y:.600},
  },
  // collision: the floating platform footprint (asset space); rig rises above
  collision:{ kind:"box", x0:.250, y0:.530, x1:.750, y1:.640 },
  capacity:{ riders:1, total:1 },        // one castaway
  ownership:"odysseus",                   // built on Calypso's isle, wrecked by Poseidon

  states:{
    initial:"intact",
    nodes:{
      intact:   { preview:{ mode:"intact",    status:"INTACT",    progress:0.12 } },
      rolling:  { preview:{ mode:"rolling",   status:"ROLLING",   progress:0.34 } },
      dismasted:{ preview:{ mode:"dismasted", status:"DISMASTED", progress:0.52 } },
      scattered:{ preview:{ mode:"scattered", status:"SCATTERED", progress:0.72 } },
      regripped:{ preview:{ mode:"regripped", status:"REGRIPPED", progress:0.88 } },
      abandoned:{ preview:{ mode:"abandoned", status:"ABANDONED", progress:1.00 } },
    },
    edges:[
      ["intact","rolling"],["rolling","dismasted"],["dismasted","scattered"],
      ["scattered","regripped"],["regripped","abandoned"],
      ["rolling","intact"],["dismasted","rolling"],["regripped","scattered"],
    ],
  },
  channels:["mode","roll","sink","t"],

  preview:()=>({ mode:"intact", status:"INTACT", progress:0.12, t:0 }),
  draw(ctx,W,H,state){ drawRaft(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
