/* vehicle.twelve-ship-fleet — a fleet of twelve black galleys, scale-receding.
   VEHICLE asset. One detailed foreground penteconter (the same black-ship look
   as vehicle.black-ithacan-ship — dark crescent hull, curling sternpost, single
   amidships mast + yard + square sail, a bank of oars, a painted prow eye) leads
   a diagonal line of eleven more galley silhouettes receding toward the horizon,
   each smaller and paler with distance. Drawn EMPTY — no crew baked in.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B09-S02): the whole squadron cycling through its raid /
   voyage states — hauled up on the beach, loading at the strand, shoving off,
   rowing out, making sail, taking a casualty, and the flight to sea.
   Atlas: reusable boarded object; board/ride/dock/pilot anchors, motion states,
   capacity, collision, oars + sail. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  ships:12,             // one detailed foreground + eleven receding
  oarPairs:8,           // oars drawn on the foreground galley (one side)
  hullInk:6,            // dark hull tone (the "black ship")
  mastInk:5,
  sailInk:2,            // pale cloth
  waterInk:1,           // near-paper sea
  sandInk:2,            // beach
  vanish:{ x:0.90, y:0.40 },    // horizon vanishing point the fleet recedes toward
};

/* per-state pose for the whole squadron.
   ground: "sea" | "beach".  oar: "up" | "down" | "stow".
   sail: "furled" | "full".  gangplank, spray, casualty flags. */
const POSE = {
  beach:    { ground:"beach", oar:"stow", sail:"furled", gangplank:false, spray:false, casualty:false, status:"BEACHED",   progress:0.08 },
  load:     { ground:"beach", oar:"stow", sail:"furled", gangplank:true,  spray:false, casualty:false, status:"LOADING",   progress:0.22 },
  launch:   { ground:"sea",   oar:"up",   sail:"furled", gangplank:false, spray:false, casualty:false, status:"LAUNCH",    progress:0.40 },
  row:      { ground:"sea",   oar:"down", sail:"furled", gangplank:false, spray:false, casualty:false, status:"ROWING",    progress:0.58 },
  sail:     { ground:"sea",   oar:"up",   sail:"full",   gangplank:false, spray:false, casualty:false, status:"UNDER SAIL",progress:0.78 },
  casualty: { ground:"sea",   oar:"down", sail:"furled", gangplank:false, spray:true,  casualty:true,  status:"CASUALTY",  progress:0.66 },
  escape:   { ground:"sea",   oar:"down", sail:"full",   gangplank:false, spray:true,  casualty:false, status:"ESCAPE",    progress:1.00 },
};

/* deterministic tiny jitter so the fleet line isn't a ruler */
function jit(i){ const s=Math.sin(i*12.9898)*43758.5453; return s-Math.floor(s); }

/* ---- ONE galley, bow to the right, base at (cx,baseY), overall width shipW ----
   opt: { ink, sail, oar, detail(bool), heel(rad), broken(bool), t } */
function drawGalley(pen, g, cx, baseY, shipW, opt){
  const ink   = opt.ink ?? params.hullInk;
  const shipH = shipW*0.30;
  const detail= !!opt.detail;
  const heel  = opt.heel||0;
  const broken= !!opt.broken;
  const T     = opt.t||0;

  g.save();
  g.translate(cx, baseY);
  if (heel) g.rotate(heel);
  if (broken){ g.rotate(0.28); g.translate(0, shipH*0.30); }

  // key hull points in local space (origin at waterline midship)
  const sTopX=-shipW*0.46, sTopY=-shipH*0.92;      // sternpost top (left)
  const bStemX= shipW*0.44, bStemY=-shipH*0.86;    // bow stem (right)
  const ramX  = shipW*0.52, ramY=  shipH*0.10;     // ram (right, low)
  const sBotX =-shipW*0.48, sBotY= shipH*0.02;     // stern underside (left)
  const midSheer=-shipH*0.55, keelMid= shipH*0.55;
  const gun = x => midSheer - Math.pow((x)/(shipW*0.5),2)*shipH*0.30; // gunwale height at x

  /* sternpost curl (aphlaston) behind the hull */
  pen.limb(()=>{
    g.moveTo(sTopX, sTopY);
    g.quadraticCurveTo(-shipW*0.56, -shipH*1.4, -shipW*0.44, -shipH*1.75);
    g.quadraticCurveTo(-shipW*0.34, -shipH*1.95, -shipW*0.40, -shipH*1.55);
  }, toneSolid(inkLevel(ink)), Math.max(3, shipW*0.020));

  /* oars (behind the hull so blades read outboard) — only when not stowed */
  if (opt.oar!=="stow"){
    const n = detail ? params.oarPairs : Math.max(3, Math.round(shipW/28));
    const ox0=-shipW*0.34, ox1=shipW*0.40, oarLen=shipH*1.35;
    const down = opt.oar==="down";
    for (let i=0;i<n;i++){
      const px = lerp(ox0, ox1, i/(n-1)), py = gun(px)+shipH*0.10;
      let dx,dy;
      if (down){ const s=Math.sin(T*2+i*0.6)*0.06; dx=0.26+s; dy=1.0; }
      else     { dx=0.34; dy=-0.90; }
      const dn=Math.hypot(dx,dy); dx/=dn; dy/=dn;
      const bx=px+dx*oarLen, by=py+dy*oarLen;
      pen.limb(()=>{ g.moveTo(px,py); g.lineTo(bx,by); }, toneSolid(inkLevel(Math.max(3,ink-2))), Math.max(1.6, shipW*0.010));
      if (detail) pen.paint(()=>{ g.ellipse(bx,by, shipW*0.016, shipH*0.14, Math.atan2(dy,dx),0,7); }, toneSolid(inkLevel(ink-1)), 2);
    }
  }

  /* HULL — dark crescent */
  pen.paint(()=>{
    g.moveTo(sTopX, sTopY);
    g.quadraticCurveTo(0, midSheer, bStemX, bStemY);          // sheer stern -> bow
    g.quadraticCurveTo(shipW*0.50, -shipH*0.28, ramX, ramY);  // bow stem -> ram
    g.quadraticCurveTo(0, keelMid, sBotX, sBotY);             // keel underside
    g.quadraticCurveTo(-shipW*0.55, -shipH*0.30, sTopX, sTopY); // sternpost
    g.closePath();
  }, toneSolid(inkLevel(ink)), Math.max(3, shipW*0.010));

  /* topstrake highlight just under the sheer so the gunwale reads (dark hulls only) */
  if (ink>=4){
    g.save();
    g.strokeStyle=inkLevel(ink-4); g.lineWidth=Math.max(2, shipH*0.14); g.lineCap="round";
    g.beginPath();
    g.moveTo(sTopX+shipW*0.02, sTopY+shipH*0.14);
    g.quadraticCurveTo(0, midSheer+shipH*0.14, bStemX-shipW*0.02, bStemY+shipH*0.14);
    g.stroke();
    g.restore();
  }

  if (detail){
    // plank seams following the sheer
    g.strokeStyle=inkLevel(ink-2); g.lineWidth=1.6;
    for (let s=1;s<=3;s++){ const off=shipH*0.20*s;
      g.beginPath();
      g.moveTo(sTopX+shipW*0.03, sTopY+shipH*0.30+off*0.6);
      g.quadraticCurveTo(0, midSheer+shipH*0.28+off, bStemX-shipW*0.03, bStemY+shipH*0.30+off*0.6);
      g.stroke();
    }
    // painted prow eye
    g.fillStyle=inkLevel(1);
    g.beginPath(); g.ellipse(shipW*0.34,-shipH*0.28, shipW*0.026, shipH*0.20,0,0,7); g.fill();
    g.strokeStyle=INK; g.lineWidth=2.2;
    g.beginPath(); g.ellipse(shipW*0.34,-shipH*0.28, shipW*0.026, shipH*0.20,0,0,7); g.stroke();
    g.fillStyle=INK; g.beginPath(); g.arc(shipW*0.34,-shipH*0.28, Math.max(2,shipW*0.008),0,7); g.fill();
    // deck line + a few tholes
    pen.ink(()=>{ g.moveTo(sTopX+shipW*0.04, midSheer+shipH*0.06);
      g.quadraticCurveTo(0, midSheer+shipH*0.34, bStemX-shipW*0.04, midSheer+shipH*0.06); }, 2);
  }

  /* MAST + YARD + SAIL */
  const mastTopY = -shipH*0.55 - shipW*(detail?0.92:0.78);
  const deckY = midSheer+shipH*0.20;
  pen.limb(()=>{ g.moveTo(0, mastTopY); g.lineTo(0, deckY); }, toneSolid(inkLevel(params.mastInk)), Math.max(3, shipW*0.022));
  if (detail) pen.paint(()=>{ g.arc(0, mastTopY, Math.max(3,shipW*0.012),0,7); }, toneSolid(inkLevel(6)), 2);

  const yardY = mastTopY + shipW*0.10;
  const yardX = shipW*0.36;
  pen.limb(()=>{ g.moveTo(-yardX, yardY); g.lineTo(yardX, yardY); }, toneSolid(inkLevel(params.mastInk)), Math.max(2, shipW*0.016));

  if (opt.sail==="full"){
    const belly = shipW*0.06 + Math.sin(T)*shipW*0.012;
    const footY = deckY - shipH*1.2;
    pen.paint(()=>{
      g.moveTo(-yardX+shipW*0.01, yardY+2);
      g.lineTo( yardX-shipW*0.01, yardY+2);
      g.quadraticCurveTo(yardX+belly, (yardY+footY)/2, shipW*0.24, footY);
      g.quadraticCurveTo(0, footY+shipH*0.34, -shipW*0.24, footY);
      g.quadraticCurveTo(-yardX-belly, (yardY+footY)/2, -yardX+shipW*0.01, yardY+2);
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk)), Math.max(3, shipW*0.008));
    if (detail){
      g.strokeStyle=inkLevel(3); g.lineWidth=1.5;
      for (let x=-yardX+shipW*0.06; x<yardX-shipW*0.04; x+=shipW*0.09){
        g.beginPath(); g.moveTo(x, yardY+6);
        g.quadraticCurveTo(x+belly*0.4, (yardY+footY)/2, x, footY-4); g.stroke();
      }
      // sheets from lower clews to the gunwales
      pen.ink(()=>{ g.moveTo(shipW*0.24,footY); g.lineTo(shipW*0.40, gun(shipW*0.40)); }, 1.6);
      pen.ink(()=>{ g.moveTo(-shipW*0.24,footY); g.lineTo(-shipW*0.36, gun(-shipW*0.36)); }, 1.6);
    }
  } else {
    // FURLED — a fat roll lashed along the yard
    pen.paint(()=>{ g.ellipse(0, yardY+shipH*0.10, yardX-shipW*0.02, shipH*0.16,0,0,7); },
              toneSolid(inkLevel(params.sailInk+1)), Math.max(2, shipW*0.008));
    if (detail){ g.strokeStyle=INK; g.lineWidth=1.6;
      for (let x=-yardX+shipW*0.05; x<yardX-shipW*0.03; x+=shipW*0.09){
        g.beginPath(); g.moveTo(x, yardY-shipH*0.04); g.lineTo(x, yardY+shipH*0.24); g.stroke(); } }
  }

  /* forestay + backstay (detail ship only) */
  if (detail){
    pen.ink(()=>{ g.moveTo(0, mastTopY+shipH*0.1); g.lineTo(bStemX-shipW*0.02, bStemY+shipH*0.1); }, 1.8);
    pen.ink(()=>{ g.moveTo(0, mastTopY+shipH*0.1); g.lineTo(sTopX+shipW*0.02, sTopY+shipH*0.1); }, 1.8);
  }

  g.restore();
}

function drawFleet(ctx, W, H, st){
  const pen  = makePen(ctx, { outline:true });   // hard-contour pen (flagship + near companion)
  const soft = makePen(ctx, { outline:false });  // outline-less pen for hazy distant ships
  const g = ctx;
  const mode = st.mode || "sail";
  const P = POSE[mode] || POSE.sail;
  const T = st.t || 0;
  const horizonY = H*0.400;      // sea/sky meeting line the fleet recedes toward
  const waterY   = H*0.640;      // the flagship's waterline (near field)
  const beach    = P.ground==="beach";

  /* ============ GROUND: sea or beach, receding to the horizon ============ */
  if (beach){
    // wet-sand strand up to a distant shoreline at the horizon
    g.fillStyle=inkLevel(params.sandInk); g.fillRect(0, horizonY, W, H-horizonY);
    g.fillStyle=inkLevel(1); g.fillRect(0, horizonY, W, H*0.03);              // far pale water strip
    // surf line where the near sand meets wet
    g.strokeStyle=inkLevel(3); g.lineWidth=2; g.lineCap="round";
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.05){ const y=waterY+Math.sin(x*0.02+1.3)*4; x===0?g.moveTo(x,y):g.lineTo(x,y); }
    g.stroke();
    g.fillStyle=inkLevel(3);
    for (let i=0;i<44;i++){ const x=jit(i*3+1)*W, y=waterY+H*0.02+jit(i*3+2)*(H*0.32);
      g.beginPath(); g.arc(x,y, 1.4+jit(i)*1.6,0,7); g.fill(); }
    pen.ink(()=>{ g.moveTo(0,horizonY); g.lineTo(W,horizonY); }, 2);
  } else {
    g.fillStyle=inkLevel(params.waterInk); g.fillRect(0, horizonY, W, H-horizonY);
    pen.ink(()=>{ g.moveTo(0,horizonY); g.lineTo(W,horizonY); }, 2);          // horizon
    // wave rules, denser toward the near field
    g.strokeStyle=inkLevel(3); g.lineWidth=2; g.lineCap="round";
    for (let k=0;k<5;k++){ const wy=waterY - H*0.010 + k*H*0.032;
      g.beginPath();
      for (let x=0;x<=W;x+=W*0.05){ const y=wy+Math.sin(x*0.028+k*1.7+T)*3; x===0?g.moveTo(x,y):g.lineTo(x,y); }
      g.stroke();
    }
  }

  /* ============ THE RECEDING FLEET (11 galleys) drawn far -> near ============ */
  const fgCx = W*0.360, fgBaseY = waterY + (beach? -H*0.006 : 0), fgW = W*0.520;
  const VP = { x:W*params.vanish.x, y:horizonY + H*0.006 };
  const heel = (mode==="escape") ? -0.05 : (mode==="sail" ? -0.015 : 0);

  const line = [];
  for (let i=1;i<params.ships;i++){                 // i=1..11 behind the flagship
    const tt = Math.pow(i/(params.ships-1), 0.82);  // eased spread toward the horizon
    // distant ships sit HIGHER (their waterline climbs toward the horizon) and to the right,
    // clearing the flagship's sail; a gentle down-curve keeps the sterns visible
    const cx = lerp(fgCx + fgW*0.66, VP.x, tt) + (jit(i)-0.5)*W*0.010;
    const baseY = lerp(fgBaseY - H*0.090, VP.y, tt);
    const shipW = fgW*(1 - tt*0.82);
    const ink = clamp(params.hullInk - tt*5.0, 2, params.hullInk); // strong haze with distance
    const broken = P.casualty && i===3;
    line.push({ i, tt, cx, baseY, shipW, ink, broken });
  }
  line.sort((a,b)=> b.tt - a.tt);                    // farthest first
  for (const s of line){
    // the nearest companion is a hard-contour ship with oars; the rest are
    // outline-less gray silhouettes that recede as atmospheric haze
    const near = s.i===1;
    drawGalley(near?pen:soft, g, s.cx, s.baseY, s.shipW, {
      ink:s.ink, detail:false,
      sail:P.sail, oar: near ? P.oar : "stow",
      heel: s.broken?0:heel, broken:s.broken, t:T + s.i,
    });
  }

  /* ============ FOREGROUND FLAGSHIP (full detail, the black ship) ============ */
  // rollers / logs under the keel when hauled up on the beach
  if (beach){
    g.fillStyle=inkLevel(5);
    for (let k=-2;k<=2;k++){
      const rx=fgCx+k*fgW*0.16;
      pen.paint(()=>{ g.ellipse(rx, fgBaseY+H*0.020, fgW*0.055, H*0.014, 0,0,7); }, toneSolid(inkLevel(5)), 3);
    }
  }
  drawGalley(pen, g, fgCx, fgBaseY, fgW, {
    ink:params.hullInk, detail:true, sail:P.sail, oar:P.oar, heel, t:T,
  });

  /* boarding gangplank down to the strand (LOADING) */
  if (P.gangplank){
    const gpTopX=fgCx-fgW*0.10, gpTopY=fgBaseY-fgW*0.30*0.30 - fgW*0.02;
    pen.paint(()=>{
      g.moveTo(gpTopX, gpTopY);
      g.lineTo(gpTopX+fgW*0.05, gpTopY);
      g.lineTo(fgCx-fgW*0.34, H*0.900);
      g.lineTo(fgCx-fgW*0.40, H*0.900);
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    g.strokeStyle=INK; g.lineWidth=1.8;
    for (let t=0.2;t<0.95;t+=0.2){
      const ax=lerp(gpTopX+fgW*0.02, fgCx-fgW*0.37, t), ay=lerp(gpTopY, H*0.900, t);
      g.beginPath(); g.moveTo(ax-8,ay); g.lineTo(ax+8,ay-5); g.stroke();
    }
  }

  /* bow spray on the running ships (ESCAPE / CASUALTY) */
  if (P.spray){
    g.strokeStyle=inkLevel(3); g.lineWidth=2; g.lineCap="round";
    const bx=fgCx+fgW*0.50, by=waterY-H*0.006;
    for (let k=0;k<5;k++){ const a=-0.5-k*0.28;
      g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+Math.cos(a)*H*0.05, by+Math.sin(a)*H*0.05); g.stroke(); }
    g.fillStyle=inkLevel(2);
    for (let i=0;i<14;i++){ const x=bx+jit(i)*W*0.06, y=by-jit(i*2)*H*0.05;
      g.beginPath(); g.arc(x,y,1.6+jit(i)*1.4,0,7); g.fill(); }
  }
}

export const asset = {
  id:"vehicle.twelve-ship-fleet",
  type:"VEHICLE",
  name:"Twelve-ship Fleet",
  statusWord:"UNDER SAIL",
  scene:"OD-B09-S02",

  params,
  // back -> front draw order the module honors
  layers:["ground","fleet-line","rollers","flagship","gangplank","spray"],

  // normalized 0..1 board / ride / dock / pilot anchors (EMPTY ships).
  // Anchors resolve on the foreground flagship; the fleet-line is scenery scale.
  anchors:{
    "board:amidships":{x:.300,y:.560},   // step over the flagship's gunwale
    "ride:deck":{x:.375,y:.575},         // open deck of the flagship
    "ride:rowbench":{x:.390,y:.590},     // rowers' benches
    "dock:strand":{x:.180,y:.900},       // the beach the plank runs to
    "pilot:stern":{x:.170,y:.545},       // helmsman's station at the stern
    "grip:steering-oar":{x:.150,y:.585},
    mast:{x:.375,y:.300},
    "yard:center":{x:.375,y:.330},
    bow:{x:.650,y:.590},                 // flagship ram / prow
    stern:{x:.150,y:.545},
    "fleet:lead":{x:.375,y:.620},        // the squadron's leading (nearest) ship
    "fleet:rear":{x:.870,y:.548},        // the farthest ship near the horizon
    "waterline":{x:.500,y:.620},
  },
  // collision shape: the flagship's floating footprint (asset space)
  collision:{ kind:"box", x0:.10, y0:.500, x1:.66, y1:.720 },
  capacity:{ ships:12, perShip:{ rowers:20, benches:10, total:24 }, fleetTotal:288 },
  ownership:"odysseus",                  // the twelve ships that sail from Troy

  states:{
    initial:"sail",
    nodes:{
      beach:   { preview:{ mode:"beach",    status:"BEACHED",    progress:0.08 } },
      load:    { preview:{ mode:"load",     status:"LOADING",    progress:0.22 } },
      launch:  { preview:{ mode:"launch",   status:"LAUNCH",     progress:0.40 } },
      row:     { preview:{ mode:"row",      status:"ROWING",     progress:0.58 } },
      sail:    { preview:{ mode:"sail",     status:"UNDER SAIL", progress:0.78 } },
      casualty:{ preview:{ mode:"casualty", status:"CASUALTY",   progress:0.66 } },
      escape:  { preview:{ mode:"escape",   status:"ESCAPE",     progress:1.00 } },
    },
    edges:[
      ["beach","load"],["load","launch"],["launch","row"],["row","sail"],
      ["sail","row"],["row","casualty"],["casualty","escape"],["sail","escape"],
      ["escape","sail"],["sail","beach"],
    ],
  },
  channels:["mode","oar","sail","t"],

  preview:()=>({ mode:"sail", status:"UNDER SAIL", progress:0.78, t:0 }),
  draw(ctx,W,H,state){ drawFleet(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
