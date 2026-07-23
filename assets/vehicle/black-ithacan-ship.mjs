/* vehicle.black-ithacan-ship — a twenty-oared Greek galley, dark hull.
   VEHICLE asset. A profile (side-elevation) war-galley / merchant penteconter:
   long dark crescent hull with a curling sternpost (aphlaston) and a low bow
   ram, a single amidships mast with yard + square sail, fore/back stays, a bank
   of ten oars on tholes (twenty total, one side shown), an open cargo hold, and
   a raised stern pilot seat with a steering-oar. Drawn EMPTY — no crew baked in.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B02-S07): the vessel cycling through its voyage states —
   boarding at the quay / launch / rowing out / making sail. Oars raise & dip,
   the sail furls to a roll on the yard or falls full and bellying, a gangplank
   runs down to the dock while boarding.
   Atlas: reusable boarded object; board/ride/dock/pilot anchors, motion states,
   capacity, collision. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  oarPairs:10,          // 10 per side => twenty-oared vessel
  hullInk:6,            // dark hull tone
  wormWales:3,          // plank seams following the sheer
  mastInk:5,
  sailInk:2,            // pale cloth
  waterInk:1,           // near-paper sea
};

/* ---- fixed geometry in the 660x880 source (fractions of W/H) ---- */
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
/* gunwale (sheer) height at a given x — gentle rise toward bow & stern */
function gunY(R,W,H,x){
  const u = (x - W*0.5)/(W*0.40);
  return R.midSheer - u*u*H*0.052;
}

/* per-state pose. oar: "up" raised clear of water | "down" pulling in the water.
   sail: "furled" rolled on the yard | "full" set and bellying. */
const POSE = {
  moored:   { oar:"up",   sail:"furled", gangplank:false, status:"MOORED",   progress:0.10 },
  boarding: { oar:"up",   sail:"furled", gangplank:true,  status:"BOARDING", progress:0.25 },
  launch:   { oar:"up",   sail:"furled", gangplank:false, status:"LAUNCH",   progress:0.45 },
  rowing:   { oar:"down", sail:"furled", gangplank:false, status:"ROWING",   progress:0.70 },
  sailing:  { oar:"up",   sail:"full",   gangplank:false, status:"UNDER SAIL", progress:1.00 },
};

function drawShip(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "moored";
  const P = POSE[mode] || POSE.moored;
  const R = rig(W,H);
  const T = st.t || 0;

  /* ============ SEA (near-paper, few dots) + waterline ============ */
  g.fillStyle = inkLevel(params.waterInk); g.fillRect(0, R.waterY, W, H - R.waterY);
  g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.lineCap = "round";
  for (let k=0;k<3;k++){
    const wy = R.waterY + H*0.030 + k*H*0.028;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.05){
      const y = wy + Math.sin(x*0.03 + k*1.7 + T)*3;
      x===0 ? g.moveTo(x,y) : g.lineTo(x,y);
    }
    g.stroke();
  }
  // hard waterline
  pen.ink(()=>{ g.moveTo(0,R.waterY); g.lineTo(W,R.waterY); }, 2);

  /* ============ STERNPOST CURL (aphlaston) behind hull ============ */
  pen.limb(()=>{
    g.moveTo(R.sternTop.x, R.sternTop.y);
    g.quadraticCurveTo(W*0.055, R.waterY - H*0.235, W*0.115, R.waterY - H*0.300);
    g.quadraticCurveTo(W*0.165, R.waterY - H*0.330, W*0.150, R.waterY - H*0.280);
  }, toneSolid(inkLevel(params.hullInk)), 11);

  /* ============ OARS (drawn behind the hull so blades read outboard) ============ */
  const nOar = params.oarPairs;
  const ox0 = W*0.245, ox1 = W*0.790;
  const oarLen = H*0.150;
  const down = P.oar==="down";
  for (let i=0;i<nOar;i++){
    const px = lerp(ox0, ox1, i/(nOar-1));
    const py = gunY(R,W,H,px);
    // outboard shaft direction
    let dx, dy;
    if (down){ const s=Math.sin(T*2 + i*0.5)*0.06; dx = 0.22+s; dy = 1.0; }
    else     { dx = 0.30; dy = -0.92; }
    const dn = Math.hypot(dx,dy); dx/=dn; dy/=dn;
    const bx = px + dx*oarLen, by = py + dy*oarLen;
    pen.limb(()=>{ g.moveTo(px,py); g.lineTo(bx,by); }, toneSolid(inkLevel(4)), 5);
    // blade
    pen.paint(()=>{ g.ellipse(bx, by, W*0.014, H*0.022, Math.atan2(dy,dx), 0, 7); },
              toneSolid(inkLevel(5)), 3);
    // splash where a pulling oar bites the sea
    if (down && by > R.waterY){
      g.strokeStyle = inkLevel(3); g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(bx-6, R.waterY-2); g.lineTo(bx-2, R.waterY-9);
      g.moveTo(bx+5, R.waterY-2); g.lineTo(bx+9, R.waterY-8); g.stroke();
    }
  }

  /* ============ HULL (dark crescent) ============ */
  pen.paint(()=>{
    g.moveTo(R.sternTop.x, R.sternTop.y);
    g.quadraticCurveTo(W*0.5, R.midSheer, R.bowStem.x, R.bowStem.y);       // sheer stern->bow
    g.quadraticCurveTo(W*0.940, R.waterY - H*0.055, R.ram.x, R.ram.y);     // bow stem -> ram
    g.quadraticCurveTo(W*0.5, R.keelMid, R.sternBot.x, R.sternBot.y);      // keel underside
    g.quadraticCurveTo(W*0.085, R.waterY - H*0.085, R.sternTop.x, R.sternTop.y); // sternpost
    g.closePath();
  }, toneSolid(inkLevel(params.hullInk)), 5);

  // topstrake highlight band just under the sheer (lighter, so the gunwale reads)
  g.save();
  g.strokeStyle = inkLevel(2); g.lineWidth = H*0.016; g.lineCap="round";
  g.beginPath();
  g.moveTo(R.sternTop.x+8, R.sternTop.y+10);
  g.quadraticCurveTo(W*0.5, R.midSheer+9, R.bowStem.x-6, R.bowStem.y+10);
  g.stroke();
  g.restore();

  // plank seams following the sheer (mid tone)
  g.strokeStyle = inkLevel(4); g.lineWidth = 1.6;
  for (let s=1;s<=params.wormWales;s++){
    const off = H*0.028*s;
    g.beginPath();
    g.moveTo(R.sternTop.x+10, R.sternTop.y+18+off*0.6);
    g.quadraticCurveTo(W*0.5, R.midSheer+18+off, R.bowStem.x-8, R.bowStem.y+18+off*0.6);
    g.stroke();
  }

  // bow ram reinforcement + a painted eye near the prow
  pen.ink(()=>{ g.moveTo(R.bowStem.x-4, R.waterY-2); g.lineTo(R.ram.x, R.ram.y); }, 3);
  g.fillStyle = inkLevel(1);
  g.beginPath(); g.ellipse(W*0.845, R.waterY-H*0.058, W*0.020, H*0.018, 0, 0, 7); g.fill();
  g.strokeStyle = INK; g.lineWidth = 2.4;
  g.beginPath(); g.ellipse(W*0.845, R.waterY-H*0.058, W*0.020, H*0.018, 0, 0, 7); g.stroke();
  g.fillStyle = INK;
  g.beginPath(); g.arc(W*0.845, R.waterY-H*0.058, 3.4, 0, 7); g.fill();

  /* ============ DECK line + THOLES (oarlocks) along the gunwale ============ */
  pen.ink(()=>{
    g.moveTo(R.sternTop.x+14, R.deckY-2);
    g.quadraticCurveTo(W*0.5, R.deckY+ (R.midSheer-R.deckY), R.bowStem.x-14, R.deckY-2);
  }, 2);
  for (let i=0;i<nOar;i++){
    const px = lerp(ox0, ox1, i/(nOar-1));
    const py = gunY(R,W,H,px);
    pen.paint(()=>{ g.rect(px-3, py-H*0.020, 6, H*0.022); }, toneSolid(inkLevel(7)), 2); // thole pin
  }

  /* ============ CARGO HOLD (open hatch, amidships aft of the mast) ============ */
  const holdX0 = W*0.360, holdX1 = W*0.452, holdTop = R.deckY+H*0.006, holdBot = R.waterY+H*0.028;
  pen.paint(()=>{ g.rect(holdX0, holdTop, holdX1-holdX0, holdBot-holdTop); },
            toneSolid(inkLevel(7)), 4);                                    // dark opening
  g.strokeStyle = inkLevel(3); g.lineWidth = 2;                            // interior frames/ribs
  for (let r=holdX0+8; r<holdX1-4; r+=12){ g.beginPath(); g.moveTo(r,holdTop+3); g.lineTo(r,holdBot-3); g.stroke(); }
  pen.ink(()=>{ g.strokeRect(holdX0, holdTop, holdX1-holdX0, holdBot-holdTop); }, 2.4); // coaming

  /* ============ STERN PILOT SEAT + STEERING-OAR ============ */
  // steering (quarter) oar trailing off the stern into the sea
  pen.limb(()=>{ g.moveTo(W*0.150, R.deckY+H*0.006);
                 g.lineTo(W*0.095, R.waterY+H*0.070); }, toneSolid(inkLevel(4)), 6);
  pen.paint(()=>{ g.ellipse(W*0.092, R.waterY+H*0.078, W*0.016, H*0.024, -0.5, 0, 7); },
            toneSolid(inkLevel(5)), 3);
  pen.ink(()=>{ g.moveTo(W*0.150, R.deckY+H*0.006); g.lineTo(W*0.176, R.deckY-H*0.020); }, 4); // tiller
  // raised pilot bench (helmsman's seat), empty
  const seatX = W*0.196, seatY = R.deckY - H*0.006;
  pen.paint(()=>{ g.rect(seatX-W*0.034, seatY, W*0.070, H*0.014); }, toneSolid(inkLevel(5)), 3); // seat
  pen.paint(()=>{ g.rect(seatX-W*0.034, seatY-H*0.030, W*0.010, H*0.032); }, toneSolid(inkLevel(6)), 3); // seat back
  pen.paint(()=>{ g.rect(seatX-W*0.030, seatY+H*0.014, W*0.008, H*0.020); }, toneSolid(inkLevel(6)), 2); // legs
  pen.paint(()=>{ g.rect(seatX+W*0.026, seatY+H*0.014, W*0.008, H*0.020); }, toneSolid(inkLevel(6)), 2);

  /* ============ MAST + STAYS ============ */
  pen.limb(()=>{ g.moveTo(R.mastX, R.mastTop); g.lineTo(R.mastX, R.deckY+H*0.010); },
           toneSolid(inkLevel(params.mastInk)), 12);
  // mast-head cap
  pen.paint(()=>{ g.arc(R.mastX, R.mastTop, 6, 0, 7); }, toneSolid(inkLevel(6)), 3);
  // forestay -> bow, backstay -> sternpost (rigging lines)
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+4); g.lineTo(R.bowStem.x-6, R.bowStem.y+6); }, 2);
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+4); g.lineTo(R.sternTop.x+8, R.sternTop.y+6); }, 2);
  // shrouds down to the gunwales
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+18); g.lineTo(W*0.335, gunY(R,W,H,W*0.335)); }, 1.6);
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+18); g.lineTo(W*0.665, gunY(R,W,H,W*0.665)); }, 1.6);

  /* ============ YARD + SAIL ============ */
  // yard (spar) across the mast
  pen.limb(()=>{ g.moveTo(R.yardX0, R.yardY); g.lineTo(R.yardX1, R.yardY); },
           toneSolid(inkLevel(params.mastInk)), 8);

  if (P.sail === "full"){
    const belly = W*0.030 + Math.sin(T)*W*0.006;
    const footY = R.waterY - H*0.190;
    pen.paint(()=>{
      g.moveTo(R.yardX0+6, R.yardY+4);
      g.lineTo(R.yardX1-6, R.yardY+4);
      // leech down the bow side, bellying out to the right
      g.quadraticCurveTo(R.yardX1+belly, (R.yardY+footY)/2, W*0.640, footY);
      // foot curve
      g.quadraticCurveTo(R.mastX, footY+H*0.026, W*0.360, footY);
      // luff back up the stern side
      g.quadraticCurveTo(R.yardX0-belly, (R.yardY+footY)/2, R.yardX0+6, R.yardY+4);
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk)), 4);
    // vertical brail lines
    g.strokeStyle = inkLevel(3); g.lineWidth = 1.5;
    for (let x=R.yardX0+22; x<R.yardX1-14; x+=W*0.052){
      g.beginPath(); g.moveTo(x, R.yardY+6);
      g.quadraticCurveTo(x+belly*0.4, (R.yardY+footY)/2, x, footY-6); g.stroke();
    }
    // a reef band across the sail
    g.strokeStyle = inkLevel(3); g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(W*0.372, lerp(R.yardY,footY,0.55));
    g.quadraticCurveTo(R.mastX, lerp(R.yardY,footY,0.62), W*0.628, lerp(R.yardY,footY,0.55)); g.stroke();
    // sheets from the two lower clews down to the gunwales
    pen.ink(()=>{ g.moveTo(W*0.640,footY); g.lineTo(W*0.760, gunY(R,W,H,W*0.760)); }, 1.6);
    pen.ink(()=>{ g.moveTo(W*0.360,footY); g.lineTo(W*0.250, gunY(R,W,H,W*0.250)); }, 1.6);
  } else {
    // FURLED: sail rolled into a fat bundle lashed along the yard
    pen.paint(()=>{ g.ellipse(R.mastX, R.yardY+H*0.014, (R.yardX1-R.yardX0)/2-6, H*0.026, 0, 0, 7); },
              toneSolid(inkLevel(params.sailInk+1)), 4);
    // lashings (brails) tying the roll
    g.strokeStyle = INK; g.lineWidth = 1.8;
    for (let x=R.yardX0+18; x<R.yardX1-10; x+=W*0.050){
      g.beginPath(); g.moveTo(x, R.yardY-H*0.008); g.lineTo(x, R.yardY+H*0.036); g.stroke();
    }
  }

  /* ============ GANGPLANK (boarding at the quay) ============ */
  if (P.gangplank){
    pen.paint(()=>{
      g.moveTo(W*0.300, gunY(R,W,H,W*0.300)+4);
      g.lineTo(W*0.330, gunY(R,W,H,W*0.330)+4);
      g.lineTo(W*0.150, H*0.900);
      g.lineTo(W*0.115, H*0.900);
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    // cleats across the plank
    g.strokeStyle = INK; g.lineWidth = 1.8;
    for (let t=0.2;t<0.95;t+=0.2){
      const ax = lerp(W*0.315, W*0.132, t), ay = lerp(gunY(R,W,H,W*0.315)+4, H*0.900, t);
      g.beginPath(); g.moveTo(ax-9, ay); g.lineTo(ax+9, ay-5); g.stroke();
    }
  }
}

export const asset = {
  id:"vehicle.black-ithacan-ship",
  type:"VEHICLE",
  name:"Black Ithacan Ship",
  statusWord:"MOORED",
  scene:"OD-B02-S07",

  params,
  // back -> front draw order the module honors
  layers:["sea","sternpost","oars","hull","wales","ram-eye","deck","tholes",
          "hold","steering-oar","pilot-seat","mast","stays","yard","sail","gangplank"],

  // normalized 0..1 board / ride / dock / pilot + attachment anchors (EMPTY ship)
  anchors:{
    "board:amidships":{x:.315,y:.545},  // where a boarder steps over the gunwale
    "ride:deck":{x:.500,y:.560},        // standing room on the open deck
    "ride:rowbench":{x:.520,y:.575},    // the rowers' benches (twenty places)
    "dock:portside":{x:.130,y:.760},    // the quay / beach the plank runs to
    "pilot:stern-seat":{x:.196,y:.520}, // helmsman's raised seat at the steering-oar
    "grip:steering-oar":{x:.150,y:.560},
    "grip:tiller":{x:.176,y:.500},
    mast:{x:.500,y:.300},
    "yard:center":{x:.500,y:.330},
    "hold:hatch":{x:.406,y:.590},
    bow:{x:.900,y:.605},                // ram / prow
    stern:{x:.130,y:.545},
    "waterline":{x:.500,y:.640},
  },
  // collision shape: the hull's floating footprint (asset space); rig rises above
  collision:{ kind:"box", x0:.085, y0:.480, x1:.965, y1:.760 },
  capacity:{ rowers:20, benches:10, total:24 }, // twenty oars + helmsman + officers
  ownership:"telemachus",              // the black ship Athena/Telemachus crew for Pylos

  states:{
    initial:"moored",
    nodes:{
      moored:  { preview:{ mode:"moored",   status:"MOORED",     progress:0.10 } },
      boarding:{ preview:{ mode:"boarding", status:"BOARDING",   progress:0.25 } },
      launch:  { preview:{ mode:"launch",   status:"LAUNCH",     progress:0.45 } },
      rowing:  { preview:{ mode:"rowing",   status:"ROWING",     progress:0.70 } },
      sailing: { preview:{ mode:"sailing",  status:"UNDER SAIL", progress:1.00 } },
    },
    edges:[
      ["moored","boarding"],["boarding","launch"],["launch","rowing"],
      ["rowing","sailing"],["sailing","rowing"],["rowing","moored"],
      ["moored","launch"],
    ],
  },
  channels:["mode","oar","sail","t"],

  preview:()=>({ mode:"moored", status:"MOORED", progress:0.10, t:0 }),
  draw(ctx,W,H,state){ drawShip(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
