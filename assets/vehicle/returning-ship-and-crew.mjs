/* vehicle.returning-ship-and-crew — the black ship splitting from its passenger.
   VEHICLE asset. The same dark crescent war-galley look as the black Ithacan
   ship (long black hull, curling sternpost/aphlaston, single amidships mast +
   yard + square sail, bank of oars), now carrying GIFTS + NEWS on toward the
   main harbor while ONE figure is left behind on the shore. A few crew
   silhouettes may man the deck/oars (the "and crew" of the title); the ship
   itself is the reusable boarded object and is drawn so those silhouettes are a
   toggled overlay, never baked into the hull.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B15-S05): the vessel splitting from its passenger and
   continuing to the main harbor with gifts and news aboard.
     dropping-passenger  — near the shore, oars biting, one figure left on the
                           beach behind the stern, gift-chest on deck.
     continuing-to-town  — full sail, drawn away toward the harbour town on the
                           far horizon, the shore now empty.
   Board/ride/dock/pilot anchors, gift + passenger + harbour anchors, collision
   box, motion states. Reuses the black-ship silhouette. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  oarPairs:9,           // oars along the shown side
  hullInk:6,            // dark hull tone (the "black ship")
  wormWales:3,          // plank seams following the sheer
  mastInk:5,
  sailInk:2,            // pale cloth
  waterInk:1,           // near-paper sea
  crewInk:7,            // crew silhouettes read as flat black shapes
};

/* ---- fixed rig geometry in the 660x880 source (fractions of W/H).
   The ship is drawn centred on mid; the two modes translate/scale the whole
   ship group so it reads as receding from the shore. ---- */
function rig(W,H){
  const waterY   = H*0.640;
  const sternTop = { x:W*0.140, y:waterY - H*0.150 };
  const bowStem  = { x:W*0.882, y:waterY - H*0.140 };
  const ram      = { x:W*0.958, y:waterY + H*0.012 };
  const sternBot = { x:W*0.118, y:waterY + H*0.006 };
  const midSheer = waterY - H*0.086;   // gunwale dip amidships
  const keelMid  = waterY + H*0.086;
  const deckY    = waterY - H*0.070;    // interior deck / thwart level
  const mastX    = W*0.500;
  const mastTop  = waterY - H*0.520;
  const yardY    = waterY - H*0.470;
  const yardX0   = W*0.300, yardX1 = W*0.700;
  return { waterY, sternTop, bowStem, ram, sternBot, midSheer, keelMid,
           deckY, mastX, mastTop, yardY, yardX0, yardX1 };
}
/* gunwale (sheer) height at x — gentle rise toward bow & stern */
function gunY(R,W,H,x){
  const u = (x - W*0.5)/(W*0.40);
  return R.midSheer - u*u*H*0.052;
}

/* ---------- the reusable BLACK SHIP (empty hull + rig), local source coords ---------- */
function drawShip(pen, g, R, W, H, { sail="furled", oar="up", T=0 }){
  /* sternpost curl (aphlaston) behind the hull */
  pen.limb(()=>{
    g.moveTo(R.sternTop.x, R.sternTop.y);
    g.quadraticCurveTo(W*0.055, R.waterY - H*0.235, W*0.115, R.waterY - H*0.300);
    g.quadraticCurveTo(W*0.165, R.waterY - H*0.330, W*0.150, R.waterY - H*0.280);
  }, toneSolid(inkLevel(params.hullInk)), 11);

  /* oars, behind the hull so blades read outboard */
  const nOar = params.oarPairs;
  const ox0 = W*0.250, ox1 = W*0.760, oarLen = H*0.150;
  const down = oar==="down";
  for (let i=0;i<nOar;i++){
    const px = lerp(ox0, ox1, i/(nOar-1));
    const py = gunY(R,W,H,px);
    let dx, dy;
    if (down){ const s=Math.sin(T*2 + i*0.5)*0.06; dx=0.22+s; dy=1.0; }
    else     { dx=0.30; dy=-0.92; }
    const dn = Math.hypot(dx,dy); dx/=dn; dy/=dn;
    const bx = px+dx*oarLen, by = py+dy*oarLen;
    pen.limb(()=>{ g.moveTo(px,py); g.lineTo(bx,by); }, toneSolid(inkLevel(4)), 5);
    pen.paint(()=>{ g.ellipse(bx,by,W*0.014,H*0.022,Math.atan2(dy,dx),0,7); }, toneSolid(inkLevel(5)), 3);
    if (down && by > R.waterY){
      g.strokeStyle = inkLevel(3); g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(bx-6,R.waterY-2); g.lineTo(bx-2,R.waterY-9);
      g.moveTo(bx+5,R.waterY-2); g.lineTo(bx+9,R.waterY-8); g.stroke();
    }
  }

  /* hull (dark crescent) */
  pen.paint(()=>{
    g.moveTo(R.sternTop.x, R.sternTop.y);
    g.quadraticCurveTo(W*0.5, R.midSheer, R.bowStem.x, R.bowStem.y);
    g.quadraticCurveTo(W*0.940, R.waterY - H*0.055, R.ram.x, R.ram.y);
    g.quadraticCurveTo(W*0.5, R.keelMid, R.sternBot.x, R.sternBot.y);
    g.quadraticCurveTo(W*0.085, R.waterY - H*0.085, R.sternTop.x, R.sternTop.y);
    g.closePath();
  }, toneSolid(inkLevel(params.hullInk)), 5);

  /* topstrake highlight under the sheer so the gunwale reads */
  g.save();
  g.strokeStyle = inkLevel(2); g.lineWidth = H*0.016; g.lineCap="round";
  g.beginPath();
  g.moveTo(R.sternTop.x+8, R.sternTop.y+10);
  g.quadraticCurveTo(W*0.5, R.midSheer+9, R.bowStem.x-6, R.bowStem.y+10);
  g.stroke(); g.restore();

  /* plank seams (wales) following the sheer */
  g.strokeStyle = inkLevel(4); g.lineWidth = 1.6;
  for (let s=1;s<=params.wormWales;s++){
    const off = H*0.028*s;
    g.beginPath();
    g.moveTo(R.sternTop.x+10, R.sternTop.y+18+off*0.6);
    g.quadraticCurveTo(W*0.5, R.midSheer+18+off, R.bowStem.x-8, R.bowStem.y+18+off*0.6);
    g.stroke();
  }

  /* bow ram + painted eye at the prow */
  pen.ink(()=>{ g.moveTo(R.bowStem.x-4, R.waterY-2); g.lineTo(R.ram.x, R.ram.y); }, 3);
  g.fillStyle = inkLevel(1);
  g.beginPath(); g.ellipse(W*0.845, R.waterY-H*0.058, W*0.020, H*0.018, 0,0,7); g.fill();
  g.strokeStyle = INK; g.lineWidth = 2.4;
  g.beginPath(); g.ellipse(W*0.845, R.waterY-H*0.058, W*0.020, H*0.018, 0,0,7); g.stroke();
  g.fillStyle = INK; g.beginPath(); g.arc(W*0.845, R.waterY-H*0.058, 3.4, 0, 7); g.fill();

  /* deck line + tholes (oarlocks) */
  pen.ink(()=>{
    g.moveTo(R.sternTop.x+14, R.deckY-2);
    g.quadraticCurveTo(W*0.5, R.deckY+(R.midSheer-R.deckY), R.bowStem.x-14, R.deckY-2);
  }, 2);
  for (let i=0;i<nOar;i++){
    const px = lerp(ox0, ox1, i/(nOar-1)), py = gunY(R,W,H,px);
    pen.paint(()=>{ g.rect(px-3, py-H*0.020, 6, H*0.022); }, toneSolid(inkLevel(7)), 2);
  }

  /* steering (quarter) oar + empty pilot bench at the stern */
  pen.limb(()=>{ g.moveTo(W*0.150, R.deckY+H*0.006); g.lineTo(W*0.095, R.waterY+H*0.070); },
           toneSolid(inkLevel(4)), 6);
  pen.paint(()=>{ g.ellipse(W*0.092, R.waterY+H*0.078, W*0.016, H*0.024, -0.5, 0, 7); },
            toneSolid(inkLevel(5)), 3);
  pen.ink(()=>{ g.moveTo(W*0.150, R.deckY+H*0.006); g.lineTo(W*0.176, R.deckY-H*0.020); }, 4);
  const seatX = W*0.196, seatY = R.deckY - H*0.006;
  pen.paint(()=>{ g.rect(seatX-W*0.030, seatY, W*0.062, H*0.014); }, toneSolid(inkLevel(5)), 3);
  pen.paint(()=>{ g.rect(seatX-W*0.030, seatY-H*0.028, W*0.010, H*0.030); }, toneSolid(inkLevel(6)), 3);

  /* mast + stays */
  pen.limb(()=>{ g.moveTo(R.mastX, R.mastTop); g.lineTo(R.mastX, R.deckY+H*0.010); },
           toneSolid(inkLevel(params.mastInk)), 12);
  pen.paint(()=>{ g.arc(R.mastX, R.mastTop, 6, 0, 7); }, toneSolid(inkLevel(6)), 3);
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+4); g.lineTo(R.bowStem.x-6, R.bowStem.y+6); }, 2);
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+4); g.lineTo(R.sternTop.x+8, R.sternTop.y+6); }, 2);

  /* yard + sail */
  pen.limb(()=>{ g.moveTo(R.yardX0, R.yardY); g.lineTo(R.yardX1, R.yardY); },
           toneSolid(inkLevel(params.mastInk)), 8);
  if (sail === "full"){
    const belly = W*0.030 + Math.sin(T)*W*0.006;
    const footY = R.waterY - H*0.190;
    pen.paint(()=>{
      g.moveTo(R.yardX0+6, R.yardY+4);
      g.lineTo(R.yardX1-6, R.yardY+4);
      g.quadraticCurveTo(R.yardX1+belly, (R.yardY+footY)/2, W*0.640, footY);
      g.quadraticCurveTo(R.mastX, footY+H*0.026, W*0.360, footY);
      g.quadraticCurveTo(R.yardX0-belly, (R.yardY+footY)/2, R.yardX0+6, R.yardY+4);
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk)), 4);
    g.strokeStyle = inkLevel(3); g.lineWidth = 1.5;
    for (let x=R.yardX0+22; x<R.yardX1-14; x+=W*0.052){
      g.beginPath(); g.moveTo(x, R.yardY+6);
      g.quadraticCurveTo(x+belly*0.4, (R.yardY+footY)/2, x, footY-6); g.stroke();
    }
    g.strokeStyle = inkLevel(3); g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(W*0.372, lerp(R.yardY,footY,0.55));
    g.quadraticCurveTo(R.mastX, lerp(R.yardY,footY,0.62), W*0.628, lerp(R.yardY,footY,0.55)); g.stroke();
    pen.ink(()=>{ g.moveTo(W*0.640,footY); g.lineTo(W*0.760, gunY(R,W,H,W*0.760)); }, 1.6);
    pen.ink(()=>{ g.moveTo(W*0.360,footY); g.lineTo(W*0.250, gunY(R,W,H,W*0.250)); }, 1.6);
  } else {
    /* FURLED: sail rolled into a bundle lashed along the yard */
    pen.paint(()=>{ g.ellipse(R.mastX, R.yardY+H*0.014, (R.yardX1-R.yardX0)/2-6, H*0.026, 0,0,7); },
              toneSolid(inkLevel(params.sailInk+1)), 4);
    g.strokeStyle = INK; g.lineWidth = 1.8;
    for (let x=R.yardX0+18; x<R.yardX1-10; x+=W*0.050){
      g.beginPath(); g.moveTo(x, R.yardY-H*0.008); g.lineTo(x, R.yardY+H*0.036); g.stroke();
    }
  }
}

/* ---------- GIFTS + NEWS aboard: a lashed gift-chest amidships on deck ---------- */
function drawGifts(pen, g, R, W, H){
  const cx = W*0.430, cy = R.deckY - H*0.006, cw = W*0.088, ch = H*0.052;
  // chest body
  pen.paint(()=>{ g.rect(cx-cw/2, cy-ch, cw, ch); }, toneSolid(inkLevel(4)), 4);
  // lid
  pen.paint(()=>{ g.rect(cx-cw/2-2, cy-ch-H*0.012, cw+4, H*0.016); }, toneSolid(inkLevel(5)), 3);
  // lashing straps + a bright latch
  g.strokeStyle = INK; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx-cw*0.22, cy-ch-H*0.012); g.lineTo(cx-cw*0.22, cy);
                 g.moveTo(cx+cw*0.22, cy-ch-H*0.012); g.lineTo(cx+cw*0.22, cy); g.stroke();
  g.fillStyle = inkLevel(1); g.fillRect(cx-3, cy-ch*0.55, 6, H*0.012);
  // a couple of tripods / cauldrons stowed alongside (the Phaeacian treasure)
  pen.paint(()=>{ g.ellipse(cx+cw*0.72, cy-H*0.006, W*0.022, H*0.016, 0,0,7); }, toneSolid(inkLevel(5)), 3);
  pen.ink(()=>{ g.moveTo(cx+cw*0.60, cy+H*0.006); g.lineTo(cx+cw*0.66, cy+H*0.028);
                g.moveTo(cx+cw*0.84, cy+H*0.006); g.lineTo(cx+cw*0.78, cy+H*0.028); }, 2);
}

/* ---------- a crew silhouette (dark blob figure), local coords ---------- */
function crewFigure(pen, g, x, footY, scale){
  const t = toneSolid(inkLevel(params.crewInk));
  const bh = 46*scale, bw = 15*scale, hr = 8*scale;
  // body trapezoid
  pen.paint(()=>{
    g.moveTo(x-bw*0.5, footY);
    g.lineTo(x-bw*0.34, footY-bh);
    g.lineTo(x+bw*0.34, footY-bh);
    g.lineTo(x+bw*0.5, footY);
    g.closePath();
  }, t, 3);
  // head
  pen.paint(()=>{ g.arc(x, footY-bh-hr*0.7, hr, 0, 7); }, t, 3);
}

/* ---------- the crew manning the ship (toggled overlay).
   Seated so heads + torsos rise ABOVE the gunwale into the light sky, where
   the flat-black silhouettes read against the paper rather than vanishing into
   the dark hull. ---------- */
function drawCrew(pen, g, R, W, H, rowing){
  const xs = [0.335,0.415,0.585,0.665,0.735];   // rowers, cleared of the mast
  for (const fx of xs){
    const x = W*fx, footY = gunY(R,W,H,x) + H*0.010;
    crewFigure(pen, g, x, footY, 0.72);
  }
  // helmsman at the stern steering-oar, a touch taller
  crewFigure(pen, g, W*0.235, gunY(R,W,H,W*0.235) + H*0.006, 0.88);
}

/* ---------- the shore the passenger is left on (dropping-passenger) ---------- */
function drawShore(pen, g, R, W, H){
  // a low beach wedge in the near-left foreground, clear of the ship's stern
  pen.paint(()=>{
    g.moveTo(0, R.waterY+H*0.120);
    g.lineTo(0, H);
    g.lineTo(W*0.360, H);
    g.quadraticCurveTo(W*0.210, R.waterY+H*0.150, 0, R.waterY+H*0.120);
    g.closePath();
  }, toneSolid(inkLevel(3)), 4);
  // wet-sand seam at the water's edge
  g.strokeStyle = inkLevel(4); g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, R.waterY+H*0.120);
  g.quadraticCurveTo(W*0.180, R.waterY+H*0.150, W*0.330, R.waterY+H*0.290); g.stroke();
}

/* ---------- the lone figure left behind on the shore ---------- */
function drawPassenger(pen, g, R, W, H){
  const x = W*0.150, footY = R.waterY+H*0.196;
  // cast shadow on the sand
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(x, footY+3, 26, 7, 0,0,7); g.fill();
  // a standing figure watching the ship go — full black so it reads clearly on the pale sand
  const t = toneSolid(inkLevel(7));
  const bh = H*0.135, bw = W*0.058, hr = W*0.032;
  pen.paint(()=>{
    g.moveTo(x-bw*0.5, footY);
    g.lineTo(x-bw*0.30, footY-bh);
    g.lineTo(x+bw*0.30, footY-bh);
    g.lineTo(x+bw*0.5, footY);
    g.closePath();
  }, t, 4);
  pen.paint(()=>{ g.arc(x, footY-bh-hr*0.7, hr, 0, 7); }, t, 4);
  // one arm raised toward the departing ship
  pen.limb(()=>{ g.moveTo(x+bw*0.26, footY-bh*0.88); g.lineTo(x+bw*1.15, footY-bh*1.14); },
           t, 7*(W/660));
}

/* ---------- the harbour town on the far horizon (continuing-to-town) ---------- */
function drawHarbourTown(pen, g, R, W, H){
  const baseY = R.waterY - H*0.004, x0 = W*0.760, x1 = W*0.980;
  // a little cluster of block houses + a temple gable on the headland
  const blocks = [
    [0.00, 0.030, 0.055], [0.055, 0.024, 0.038], [0.100, 0.036, 0.070],
    [0.150, 0.022, 0.034], [0.185, 0.030, 0.052],
  ];
  for (const [ox, bw, bh] of blocks){
    const bx = lerp(x0, x1, ox+bw*0.5), w = W*bw, h = H*bh;
    pen.paint(()=>{ g.rect(bx-w/2, baseY-h, w, h); }, toneSolid(inkLevel(4)), 3);
  }
  // temple gable roof on the tallest block
  const tx = lerp(x0,x1,0.100+0.036*0.5), tw=W*0.052, th=H*0.024;
  pen.paint(()=>{ g.moveTo(tx-tw/2, baseY-H*0.070); g.lineTo(tx, baseY-H*0.070-th);
                  g.lineTo(tx+tw/2, baseY-H*0.070); g.closePath(); }, toneSolid(inkLevel(5)), 3);
  // headland the town sits on
  pen.paint(()=>{ g.moveTo(W*0.740, baseY); g.quadraticCurveTo(W*0.870, baseY-H*0.020, W*1.001, baseY-H*0.006);
                  g.lineTo(W*1.001, baseY+H*0.020); g.lineTo(W*0.740, baseY+H*0.020); g.closePath(); },
            toneSolid(inkLevel(3)), 3);
}

/* ---------- sea ---------- */
function drawSea(g, R, W, H, T){
  g.fillStyle = inkLevel(params.waterInk); g.fillRect(0, R.waterY, W, H - R.waterY);
  g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.lineCap="round";
  for (let k=0;k<4;k++){
    const wy = R.waterY + H*0.030 + k*H*0.028;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.045){
      const y = wy + Math.sin(x*0.03 + k*1.7 + T)*3;
      x===0 ? g.moveTo(x,y) : g.lineTo(x,y);
    }
    g.stroke();
  }
}

/* per-mode composition */
const POSE = {
  "dropping-passenger":{ status:"DROPPING OFF", progress:0.35 },
  "continuing-to-town":{ status:"BOUND HOME",   progress:0.85 },
};

function draw(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const R = rig(W,H);
  const T = st.t || 0;
  const mode = st.mode || "dropping-passenger";
  const crewOn = st.crew !== false;

  drawSea(g, R, W, H, T);

  if (mode === "continuing-to-town"){
    // horizon town first (far, behind the water haze), then the ship stands off it
    drawHarbourTown(pen, g, R, W, H);
  }
  // hard waterline over the sea, under the ship
  pen.ink(()=>{ g.moveTo(0,R.waterY); g.lineTo(W,R.waterY); }, 2);

  if (mode === "dropping-passenger"){
    // ship close in, oars biting, gift-chest aboard, pulling away to the right
    g.save();
    g.translate(W*0.135, 0);                      // stand off the beach, clearing the stern
    drawShip(pen, g, R, W, H, { sail:"furled", oar:"down", T });
    drawGifts(pen, g, R, W, H);
    if (crewOn) drawCrew(pen, g, R, W, H, true);
    g.restore();
    // the shore + the figure left on it, in the near foreground
    drawShore(pen, g, R, W, H);
    drawPassenger(pen, g, R, W, H);
  } else {
    // ship smaller and further off, full sail, headed for the harbour town
    g.save();
    g.translate(W*0.055, H*0.052);                // set down / away toward the horizon
    g.scale(0.80, 0.80);
    drawShip(pen, g, R, W, H, { sail:"full", oar:"up", T });
    drawGifts(pen, g, R, W, H);
    if (crewOn) drawCrew(pen, g, R, W, H, false);
    g.restore();
    // wake trailing back toward the empty shore it left
    g.strokeStyle = inkLevel(2); g.lineWidth = 2; g.lineCap="round";
    for (let k=0;k<3;k++){
      g.beginPath();
      g.moveTo(W*0.150, R.waterY+H*0.070+k*H*0.016);
      g.quadraticCurveTo(W*0.400, R.waterY+H*0.055+k*H*0.016, W*0.560, R.waterY+H*0.086+k*H*0.010);
      g.stroke();
    }
  }
}

export const asset = {
  id:"vehicle.returning-ship-and-crew",
  type:"VEHICLE",
  name:"Returning Ship and Crew",
  statusWord:"BOUND HOME",
  scene:"OD-B15-S05",

  params,
  // back -> front draw order the module honors
  layers:["sea","town","waterline","sternpost","oars","hull","wales","ram-eye",
          "deck","tholes","steering-oar","pilot-seat","mast","stays","yard","sail",
          "gifts","crew","shore","passenger","wake"],

  // normalized 0..1 board / ride / dock / pilot + cargo/passenger/harbour anchors (EMPTY hull)
  anchors:{
    "board:amidships":{x:.385,y:.545},   // step over the gunwale
    "ride:deck":{x:.570,y:.560},         // standing room on the open deck
    "ride:rowbench":{x:.520,y:.575},     // the rowers' benches
    "dock:portside":{x:.120,y:.790},     // the beach / quay the passenger is set on
    "pilot:stern-seat":{x:.266,y:.520},  // helmsman's seat at the steering-oar
    "grip:steering-oar":{x:.220,y:.560},
    mast:{x:.570,y:.300},
    "yard:center":{x:.570,y:.330},
    "cargo:gift-chest":{x:.500,y:.560},  // the gifts + news stowed amidships
    "passenger:shore":{x:.120,y:.790},   // the one figure left behind on shore
    "harbour:town":{x:.880,y:.632},      // the main harbour town on the horizon
    bow:{x:.952,y:.605},
    stern:{x:.210,y:.545},
    "waterline":{x:.500,y:.640},
  },
  // collision shape: the hull's floating footprint in dropping-passenger placement
  collision:{ kind:"box", x0:.155, y0:.480, x1:.965, y1:.780 },
  capacity:{ rowers:18, benches:9, total:22 },   // Phaeacian galley crewing Odysseus home
  ownership:"phaeacians",                         // the black ship that carries + lands him

  states:{
    initial:"dropping-passenger",
    nodes:{
      "dropping-passenger":{ preview:{ mode:"dropping-passenger", status:"DROPPING OFF", progress:0.35 } },
      "continuing-to-town":{ preview:{ mode:"continuing-to-town", status:"BOUND HOME",   progress:0.85 } },
    },
    edges:[["dropping-passenger","continuing-to-town"]],
  },
  channels:["mode","crew","t"],

  preview:()=>({ mode:"dropping-passenger", status:"DROPPING OFF", progress:0.35, t:0.6 }),
  draw(ctx,W,H,state){ draw(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
