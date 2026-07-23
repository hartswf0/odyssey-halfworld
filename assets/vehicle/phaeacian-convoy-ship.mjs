/* vehicle.phaeacian-convoy-ship — the swift self-steering galley of Phaeacia.
   VEHICLE asset. A profile (side-elevation) fast convoy galley: a long, LOW,
   pale crescent hull (far sleeker and lighter than the black Ithacan ship), a
   high SWAN-NECKED prow curling up to a bird head, a fine cutwater at the bow,
   a bank of light oars on tholes with empty rowing stations, a single amidships
   mast + yard + square sail, and a made-up GUEST BED (couch + bolster + coverlet)
   on the open deck amidships for the sleeping passenger it carries home. Around
   it plays a faint supernatural NAVIGATION AURA — radiating arcs + sparks that
   signal the ship needs no steersman and knows the homeward route by itself.
   Drawn EMPTY — no crew baked in. SOLID grays + hard contour into the offscreen
   ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B08-S01): a sleek vessel with supernatural navigation
   potential, crew stations, a guest bed, and a homeward-route state — the aura
   brightens and the wake lengthens as it comes under its own guidance.
   Atlas: reusable boarded object; board/ride/pilot/bed anchors, moving oars/sail,
   collision. Sleeker than the black Ithacan ship. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  oarPairs:11,          // slim light oars, one side shown
  hullInk:3,            // PALE hull (the black ship is inkLevel 6 — this is sleek/light)
  wales:2,              // fine plank seams following the sheer
  mastInk:5,
  sailInk:2,            // pale cloth
  waterInk:1,           // near-paper sea
  auraInk:2,            // faint self-navigation glow
};

/* ---- fixed geometry in the 660x880 source (fractions of W/H) ---- */
function rig(W,H){
  const waterY   = H*0.660;
  const sternTop = { x:W*0.150, y:waterY - H*0.118 };
  const bowBase  = { x:W*0.858, y:waterY - H*0.128 };
  const cutwater = { x:W*0.940, y:waterY - H*0.006 }; // fine forefoot, no heavy ram
  const sternBot = { x:W*0.128, y:waterY + H*0.004 };
  const midSheer = waterY - H*0.072;   // gunwale dip amidships
  const keelMid  = waterY + H*0.062;   // SHALLOW draft => sleeker than black ship
  const deckY    = waterY - H*0.058;    // interior deck / thwart level
  const mastX    = W*0.505;
  const mastTop  = waterY - H*0.540;
  const yardY    = waterY - H*0.494;
  const yardX0   = W*0.288, yardX1 = W*0.722;
  // swan-neck prow head, up and forward of the bow
  const swanTip  = { x:W*0.902, y:waterY - H*0.300 };
  return { waterY, sternTop, bowBase, cutwater, sternBot, midSheer, keelMid,
           deckY, mastX, mastTop, yardY, yardX0, yardX1, swanTip };
}
/* gunwale (sheer) height at a given x — gentle rise toward bow & stern */
function gunY(R,W,H,x){
  const u = (x - W*0.5)/(W*0.40);
  return R.midSheer - u*u*H*0.044;
}

/* per-state pose.
   oar : "up" raised clear of water | "down" pulling in the water | "stowed" shipped inboard
   sail: "furled" rolled on the yard | "full" set and bellying
   aura: 0..1 intensity of the self-navigation glow (drives arcs + sparks + wake) */
const POSE = {
  moored:   { oar:"up",     sail:"furled", gangplank:false, aura:0.20, wake:0.0, status:"MOORED",     progress:0.10 },
  boarding: { oar:"up",     sail:"furled", gangplank:true,  aura:0.25, wake:0.0, status:"BOARDING",   progress:0.25 },
  rowing:   { oar:"down",   sail:"furled", gangplank:false, aura:0.35, wake:0.5, status:"ROWING",     progress:0.55 },
  sailing:  { oar:"up",     sail:"full",   gangplank:false, aura:0.55, wake:0.7, status:"UNDER SAIL", progress:0.75 },
  homeward: { oar:"stowed", sail:"full",   gangplank:false, aura:1.00, wake:1.0, status:"HOMEWARD",   progress:1.00 },
};

function drawShip(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "moored";
  const P = POSE[mode] || POSE.moored;
  const R = rig(W,H);
  const T = st.t || 0;
  const aura = (st.aura!=null ? st.aura : P.aura);
  const sail = st.sail || P.sail;                    // allow showing deck under a furled sail
  const wake = (st.wake!=null ? st.wake : P.wake);

  /* ============ SEA (near-paper) + waterline ============ */
  g.fillStyle = inkLevel(params.waterInk); g.fillRect(0, R.waterY, W, H - R.waterY);
  g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.lineCap = "round";
  for (let k=0;k<3;k++){
    const wy = R.waterY + H*0.028 + k*H*0.026;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.05){
      const y = wy + Math.sin(x*0.03 + k*1.7 + T)*3;
      x===0 ? g.moveTo(x,y) : g.lineTo(x,y);
    }
    g.stroke();
  }
  pen.ink(()=>{ g.moveTo(0,R.waterY); g.lineTo(W,R.waterY); }, 2);

  /* ============ NAVIGATION AURA (behind everything, faint) ============ */
  // radiating arcs around the hull centre — the ship's self-steering field.
  if (aura > 0.02){
    const cx = W*0.520, cy = R.waterY - H*0.070;
    g.save();
    g.lineCap = "round";
    const rings = 3;
    for (let r=0;r<rings;r++){
      const rad = W*(0.30 + r*0.085);
      const lv  = clamp(params.auraInk + Math.round(aura*2) - r, 1, 4);
      g.strokeStyle = inkLevel(lv);
      g.lineWidth = 2 + aura*1.5;
      const span = 0.55 + aura*0.35;                 // arc opens wider when guided
      const wob  = Math.sin(T*1.3 + r)*0.05;
      g.beginPath();
      g.ellipse(cx, cy, rad, rad*0.62, 0, -span+wob, span+wob); g.stroke();     // fore
      g.beginPath();
      g.ellipse(cx, cy, rad, rad*0.62, 0, Math.PI-span-wob, Math.PI+span-wob); g.stroke(); // aft
    }
    // sparks: a scatter of tiny navigation marks over the prow, denser when guided
    const nSpark = Math.round(3 + aura*7);
    for (let i=0;i<nSpark;i++){
      const a = (i*2.399);                           // golden-angle scatter (deterministic)
      const rr = W*0.10 + (i/nSpark)*W*0.14;
      const sx = R.bowBase.x - W*0.02 + Math.cos(a)*rr;
      const sy = R.swanTip.y + Math.sin(a)*rr*0.8;
      const s  = 2 + (i%3);
      g.strokeStyle = inkLevel(clamp(2+Math.round(aura*3),2,5)); g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(sx-s,sy); g.lineTo(sx+s,sy);
      g.moveTo(sx,sy-s); g.lineTo(sx,sy+s); g.stroke();
    }
    g.restore();
  }

  /* ============ STERN FINIAL (elegant scroll) behind hull ============ */
  pen.limb(()=>{
    g.moveTo(R.sternTop.x, R.sternTop.y);
    g.quadraticCurveTo(W*0.070, R.waterY - H*0.205, W*0.108, R.waterY - H*0.262);
    g.quadraticCurveTo(W*0.140, R.waterY - H*0.290, W*0.132, R.waterY - H*0.250);
  }, toneSolid(inkLevel(params.hullInk+2)), 8);

  /* ============ OARS (behind hull; blades read outboard) ============ */
  const nOar = params.oarPairs;
  const ox0 = W*0.260, ox1 = W*0.780;
  const oarLen = H*0.140;
  if (P.oar !== "stowed"){
    const down = P.oar==="down";
    for (let i=0;i<nOar;i++){
      const px = lerp(ox0, ox1, i/(nOar-1));
      const py = gunY(R,W,H,px);
      let dx, dy;
      if (down){ const s=Math.sin(T*2 + i*0.5)*0.06; dx = 0.24+s; dy = 1.0; }
      else     { dx = 0.34; dy = -0.90; }
      const dn = Math.hypot(dx,dy); dx/=dn; dy/=dn;
      const bx = px + dx*oarLen, by = py + dy*oarLen;
      pen.limb(()=>{ g.moveTo(px,py); g.lineTo(bx,by); }, toneSolid(inkLevel(4)), 4);
      pen.paint(()=>{ g.ellipse(bx, by, W*0.012, H*0.019, Math.atan2(dy,dx), 0, 7); },
                toneSolid(inkLevel(4)), 3);
      if (down && by > R.waterY){
        g.strokeStyle = inkLevel(3); g.lineWidth = 1.5;
        g.beginPath(); g.moveTo(bx-6, R.waterY-2); g.lineTo(bx-2, R.waterY-8);
        g.moveTo(bx+5, R.waterY-2); g.lineTo(bx+9, R.waterY-7); g.stroke();
      }
    }
  }

  /* ============ HULL (pale sleek crescent) ============ */
  pen.paint(()=>{
    g.moveTo(R.sternTop.x, R.sternTop.y);
    g.quadraticCurveTo(W*0.5, R.midSheer, R.bowBase.x, R.bowBase.y);           // sheer stern->bow
    g.quadraticCurveTo(W*0.918, R.waterY - H*0.055, R.cutwater.x, R.cutwater.y); // bow -> cutwater
    g.quadraticCurveTo(W*0.5, R.keelMid, R.sternBot.x, R.sternBot.y);          // keel underside
    g.quadraticCurveTo(W*0.095, R.waterY - H*0.070, R.sternTop.x, R.sternTop.y); // sternpost
    g.closePath();
  }, toneSolid(inkLevel(params.hullInk)), 5);

  // dark boot-topping strake at the waterline (gives tonal range on a pale hull)
  g.save();
  g.strokeStyle = inkLevel(6); g.lineWidth = H*0.020; g.lineCap="round";
  g.beginPath();
  g.moveTo(R.sternBot.x+10, R.waterY-H*0.006);
  g.quadraticCurveTo(W*0.5, R.waterY+H*0.006, R.cutwater.x-6, R.cutwater.y-2);
  g.stroke();
  g.restore();

  // fine plank seams following the sheer (mid tone)
  g.strokeStyle = inkLevel(4); g.lineWidth = 1.5;
  for (let s=1;s<=params.wales;s++){
    const off = H*0.030*s;
    g.beginPath();
    g.moveTo(R.sternTop.x+12, R.sternTop.y+16+off*0.6);
    g.quadraticCurveTo(W*0.5, R.midSheer+16+off, R.bowBase.x-10, R.bowBase.y+16+off*0.6);
    g.stroke();
  }

  /* ============ SWAN-NECK PROW + head (Phaeacian grace) ============ */
  pen.limb(()=>{
    g.moveTo(R.bowBase.x, R.bowBase.y+H*0.008);
    g.quadraticCurveTo(W*0.965, R.waterY - H*0.150, W*0.915, R.swanTip.y+H*0.030);
    g.quadraticCurveTo(W*0.878, R.swanTip.y - H*0.010, R.swanTip.x, R.swanTip.y);
  }, toneSolid(inkLevel(params.hullInk+2)), 9);
  // swan head + beak
  pen.paint(()=>{ g.ellipse(R.swanTip.x, R.swanTip.y, W*0.024, H*0.020, -0.4, 0, 7); },
            toneSolid(inkLevel(params.hullInk+2)), 4);
  pen.ink(()=>{ g.moveTo(R.swanTip.x-W*0.020, R.swanTip.y-H*0.004);
                g.lineTo(R.swanTip.x-W*0.052, R.swanTip.y-H*0.014); }, 4); // beak
  g.fillStyle = INK;                                          // eye
  g.beginPath(); g.arc(R.swanTip.x+W*0.004, R.swanTip.y-H*0.004, 2.6, 0, 7); g.fill();

  /* ============ DECK line + THOLES + empty ROWING STATIONS ============ */
  pen.ink(()=>{
    g.moveTo(R.sternTop.x+16, R.deckY-2);
    g.quadraticCurveTo(W*0.5, R.deckY+(R.midSheer-R.deckY), R.bowBase.x-16, R.deckY-2);
  }, 2);
  for (let i=0;i<nOar;i++){
    const px = lerp(ox0, ox1, i/(nOar-1));
    const py = gunY(R,W,H,px);
    pen.paint(()=>{ g.rect(px-3, py-H*0.017, 6, H*0.019); }, toneSolid(inkLevel(6)), 2); // thole pin
    // rower's bench (thwart) — empty station, short dark stroke just below the gunwale
    if (i < nOar-1){
      const bx = lerp(px, lerp(ox0,ox1,(i+1)/(nOar-1)), 0.5);
      const by = gunY(R,W,H,bx)+H*0.020;
      pen.paint(()=>{ g.rect(bx-W*0.016, by, W*0.032, H*0.008); }, toneSolid(inkLevel(4)), 2);
    }
  }

  /* ============ GUEST BED (made-up couch) amidships on deck ============ */
  // sleeker signature feature: a low bed with legs, mattress, bolster + coverlet.
  const bedX0 = W*0.322, bedX1 = W*0.470;
  const bedTop = R.deckY - H*0.030, bedBot = R.deckY + H*0.006;
  // frame / mattress base
  pen.paint(()=>{ g.rect(bedX0, bedTop, bedX1-bedX0, bedBot-bedTop); }, toneSolid(inkLevel(2)), 4);
  // draped coverlet (mid tone, hanging fold at the foot)
  pen.paint(()=>{
    g.moveTo(bedX0, bedTop+H*0.008);
    g.lineTo(bedX1, bedTop+H*0.008);
    g.lineTo(bedX1, bedBot+H*0.014);
    g.quadraticCurveTo((bedX0+bedX1)/2, bedBot+H*0.006, bedX0, bedBot+H*0.014);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  // coverlet fold lines
  g.strokeStyle = inkLevel(2); g.lineWidth = 1.4;
  for (let fx=bedX0+W*0.018; fx<bedX1-W*0.008; fx+=W*0.020){
    g.beginPath(); g.moveTo(fx, bedTop+H*0.012); g.lineTo(fx, bedBot+H*0.010); g.stroke();
  }
  // bolster / pillow at the stern end (head), pale roll
  pen.paint(()=>{ g.ellipse(bedX0+W*0.012, bedTop+H*0.002, W*0.020, H*0.016, 0, 0, 7); },
            toneSolid(inkLevel(1)), 3);
  // four legs
  g.fillStyle = inkLevel(6);
  for (const lx of [bedX0+3, bedX1-6]){ g.fillRect(lx, bedBot, 4, H*0.018); }
  pen.seam(()=>{ g.moveTo(bedX0, bedTop); g.lineTo(bedX1, bedTop); }, 2);

  /* ============ STERN PILOT STATION (present but UNMANNED — self-steering) ============ */
  // a steering-oar trails, but a small tiller left free signals no helmsman needed
  pen.limb(()=>{ g.moveTo(W*0.160, R.deckY+H*0.006);
                 g.lineTo(W*0.108, R.waterY+H*0.060); }, toneSolid(inkLevel(4)), 5);
  pen.paint(()=>{ g.ellipse(W*0.104, R.waterY+H*0.068, W*0.014, H*0.021, -0.5, 0, 7); },
            toneSolid(inkLevel(4)), 3);
  pen.ink(()=>{ g.moveTo(W*0.160, R.deckY+H*0.006); g.lineTo(W*0.186, R.deckY-H*0.018); }, 3); // free tiller
  // low pilot bench, empty
  const seatX = W*0.206, seatY = R.deckY - H*0.004;
  pen.paint(()=>{ g.rect(seatX-W*0.030, seatY, W*0.060, H*0.012); }, toneSolid(inkLevel(4)), 3);
  pen.paint(()=>{ g.rect(seatX-W*0.030, seatY-H*0.024, W*0.008, H*0.026); }, toneSolid(inkLevel(5)), 2);

  /* ============ MAST + STAYS ============ */
  pen.limb(()=>{ g.moveTo(R.mastX, R.mastTop); g.lineTo(R.mastX, R.deckY+H*0.008); },
           toneSolid(inkLevel(params.mastInk)), 10);
  pen.paint(()=>{ g.arc(R.mastX, R.mastTop, 5, 0, 7); }, toneSolid(inkLevel(6)), 3); // mast-head cap
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+4); g.lineTo(R.bowBase.x-6, R.bowBase.y+6); }, 1.8); // forestay
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+4); g.lineTo(R.sternTop.x+8, R.sternTop.y+6); }, 1.8); // backstay
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+16); g.lineTo(W*0.345, gunY(R,W,H,W*0.345)); }, 1.4);
  pen.ink(()=>{ g.moveTo(R.mastX, R.mastTop+16); g.lineTo(W*0.665, gunY(R,W,H,W*0.665)); }, 1.4);

  /* ============ YARD + SAIL ============ */
  pen.limb(()=>{ g.moveTo(R.yardX0, R.yardY); g.lineTo(R.yardX1, R.yardY); },
           toneSolid(inkLevel(params.mastInk)), 7);

  if (sail === "full"){
    const belly = W*0.032 + Math.sin(T)*W*0.006;
    const footY = R.waterY - H*0.200;
    pen.paint(()=>{
      g.moveTo(R.yardX0+6, R.yardY+4);
      g.lineTo(R.yardX1-6, R.yardY+4);
      g.quadraticCurveTo(R.yardX1+belly, (R.yardY+footY)/2, W*0.652, footY);   // bow-side leech bellying
      g.quadraticCurveTo(R.mastX, footY+H*0.028, W*0.352, footY);              // foot
      g.quadraticCurveTo(R.yardX0-belly, (R.yardY+footY)/2, R.yardX0+6, R.yardY+4); // stern-side luff
      g.closePath();
    }, toneSolid(inkLevel(params.sailInk)), 4);
    // vertical brail lines
    g.strokeStyle = inkLevel(3); g.lineWidth = 1.4;
    for (let x=R.yardX0+22; x<R.yardX1-14; x+=W*0.050){
      g.beginPath(); g.moveTo(x, R.yardY+6);
      g.quadraticCurveTo(x+belly*0.4, (R.yardY+footY)/2, x, footY-6); g.stroke();
    }
    // reef band
    g.strokeStyle = inkLevel(3); g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(W*0.366, lerp(R.yardY,footY,0.55));
    g.quadraticCurveTo(R.mastX, lerp(R.yardY,footY,0.62), W*0.640, lerp(R.yardY,footY,0.55)); g.stroke();
    // sheets down to the gunwales
    pen.ink(()=>{ g.moveTo(W*0.652,footY); g.lineTo(W*0.760, gunY(R,W,H,W*0.760)); }, 1.5);
    pen.ink(()=>{ g.moveTo(W*0.352,footY); g.lineTo(W*0.262, gunY(R,W,H,W*0.262)); }, 1.5);
  } else {
    // FURLED: sail rolled into a slim bundle lashed along the yard
    pen.paint(()=>{ g.ellipse(R.mastX, R.yardY+H*0.012, (R.yardX1-R.yardX0)/2-8, H*0.020, 0, 0, 7); },
              toneSolid(inkLevel(params.sailInk+1)), 4);
    g.strokeStyle = INK; g.lineWidth = 1.6;
    for (let x=R.yardX0+18; x<R.yardX1-10; x+=W*0.050){
      g.beginPath(); g.moveTo(x, R.yardY-H*0.006); g.lineTo(x, R.yardY+H*0.030); g.stroke();
    }
  }

  /* ============ GANGPLANK (boarding at the quay) ============ */
  if (P.gangplank){
    pen.paint(()=>{
      g.moveTo(W*0.310, gunY(R,W,H,W*0.310)+4);
      g.lineTo(W*0.340, gunY(R,W,H,W*0.340)+4);
      g.lineTo(W*0.158, H*0.910);
      g.lineTo(W*0.122, H*0.910);
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    g.strokeStyle = INK; g.lineWidth = 1.7;
    for (let t=0.2;t<0.95;t+=0.2){
      const ax = lerp(W*0.325, W*0.140, t), ay = lerp(gunY(R,W,H,W*0.325)+4, H*0.910, t);
      g.beginPath(); g.moveTo(ax-9, ay); g.lineTo(ax+9, ay-5); g.stroke();
    }
  }

  /* ============ WAKE (motion streak astern when guided/rowing) ============ */
  if (wake > 0.02){
    g.strokeStyle = inkLevel(2); g.lineCap="round";
    for (let k=0;k<3;k++){
      g.lineWidth = 2 + wake*1.5;
      const y = R.waterY + H*0.010 + k*H*0.014;
      g.beginPath();
      g.moveTo(R.sternBot.x-6, y);
      g.lineTo(R.sternBot.x - W*(0.05 + wake*0.10) - k*W*0.02, y+H*0.004);
      g.stroke();
    }
  }
}

export const asset = {
  id:"vehicle.phaeacian-convoy-ship",
  type:"VEHICLE",
  name:"Phaeacian Convoy Ship",
  statusWord:"HOMEWARD",
  scene:"OD-B08-S01",

  params,
  // back -> front draw order the module honors
  layers:["sea","aura","stern-finial","oars","hull","boot-strake","wales","swan-prow",
          "deck","tholes","benches","guest-bed","steering-oar","pilot-seat",
          "mast","stays","yard","sail","gangplank","wake"],

  // normalized 0..1 board / ride / pilot / bed + attachment anchors (EMPTY ship)
  anchors:{
    "board:amidships":{x:.325,y:.560},   // where a boarder steps over the gunwale
    "ride:deck":{x:.505,y:.575},         // standing room on the open deck
    "ride:rowbench":{x:.520,y:.590},     // the rowers' benches (crew stations)
    "bed:guest":{x:.396,y:.548},         // the made-up guest couch amidships
    "pilot:stern-seat":{x:.206,y:.560},  // helmsman's bench (present but unmanned)
    "grip:steering-oar":{x:.160,y:.575},
    "grip:tiller":{x:.186,y:.545},
    "prow:swan-head":{x:.902,y:.320},    // the swan finial at the bow
    mast:{x:.505,y:.275},
    "yard:center":{x:.505,y:.312},
    "dock:portside":{x:.140,y:.910},     // the quay / beach the plank runs to
    bow:{x:.900,y:.634},
    stern:{x:.140,y:.560},
    waterline:{x:.500,y:.660},
  },
  // collision shape: the hull's floating footprint (asset space); rig rises above
  collision:{ kind:"box", x0:.095, y0:.500, x1:.945, y1:.760 },
  capacity:{ rowers:22, benches:11, guests:1, total:24 }, // fast crewed galley + one passenger
  ownership:"phaeacians",              // Alcinous's convoy ship that carries Odysseus home

  states:{
    initial:"moored",
    nodes:{
      moored:  { preview:{ mode:"moored",   status:"MOORED",     progress:0.10 } },
      boarding:{ preview:{ mode:"boarding", status:"BOARDING",   progress:0.25 } },
      rowing:  { preview:{ mode:"rowing",   status:"ROWING",     progress:0.55 } },
      sailing: { preview:{ mode:"sailing",  status:"UNDER SAIL", progress:0.75 } },
      homeward:{ preview:{ mode:"homeward", status:"HOMEWARD",   progress:1.00 } }, // self-navigating
    },
    edges:[
      ["moored","boarding"],["boarding","rowing"],["rowing","sailing"],
      ["sailing","homeward"],["homeward","sailing"],["rowing","moored"],
      ["moored","rowing"],
    ],
  },
  channels:["mode","oar","sail","aura","t"],

  // showcase state: gliding home under its own guidance, sail stowed so the
  // guest bed + empty rowing stations + bright navigation aura all read.
  preview:()=>({ mode:"homeward", sail:"furled", aura:1.0, wake:0.7, status:"HOMEWARD", progress:1.00, t:0 }),
  draw(ctx,W,H,state){ drawShip(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
