/* vehicle.gift-laden-chariot — a two-wheeled road chariot piled with guest-gifts.
   VEHICLE asset. Side-elevation Mycenaean road car (the Pylian chariot form)
   but LADEN: a lashed treasure-chest on the floor, a bronze tripod-cauldron
   rising above the rim, and a folded robe bundle wedged beside them — the whole
   pile roped down over the rail with crossing lashings. A short draft-pole runs
   forward to a bare hitch-yoke (HORSES OMITTED). Drawn EMPTY of riders.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B15-S02): the returning road vehicle carrying Menelaus'
   parting guest-gifts back toward the ship — cycling between LADEN (standing,
   load lashed, wheel at rest) and URGENT (wheel spinning, car rocking, road-
   dust and speed streaks) for the hurried homeward drive.
   Atlas: reusable boarded object; board/ride anchors, treasure LOAD anchors,
   moving spoked wheels, motion states, capacity, collision. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  spokes:8,            // classic light spoked road-wheel
  wheelInk:6,          // felloe/tyre tone
  carInk:2,            // wicker/leather car body (light, so the load reads over it)
  railInk:7,           // dark bentwood rail (antyx)
  poleInk:5,           // draft-pole
  yokeInk:6,           // bare hitch-yoke
  chestInk:3,          // lashed gift-chest (mid — reads as a box)
  lidInk:2,            // chest lid band (light, so the box reads)
  tripodInk:6,         // bronze tripod-cauldron (rises above the rim)
  robeInk:2,           // folded robe bundle (soft, light)
  lashInk:7,           // rope lashing over the pile
  dustInk:2,           // road dust (near-paper)
};

/* ---- fixed geometry in the 660x880 source (fractions of W/H) ---- */
function rig(W,H){
  const groundY = H*0.860;
  const wheelR  = H*0.165;
  const hubX    = W*0.360;
  const hubY    = groundY - wheelR;      // axle height (car floor rides just above)
  const floorY  = hubY - H*0.020;        // standing platform floor, just over the axle
  const carBack = W*0.175;               // rear of the basket (open, driver boards here)
  const carFront= W*0.545;               // front of the basket
  const railTop = floorY - H*0.210;      // rim of the car — kept low so the load piles over it
  // short draft-pole tip + bare yoke, forward and slightly up (HORSES OMITTED)
  const poleTipX= W*0.910, poleTipY = floorY - H*0.070;
  const yokeX   = W*0.874, yokeY = poleTipY - H*0.004;
  return { groundY, wheelR, hubX, hubY, floorY, carBack, carFront,
           railTop, poleTipX, poleTipY, yokeX, yokeY };
}

/* per-state pose */
const POSE = {
  laden:  { moving:false, status:"LADEN",  progress:0.30 },
  urgent: { moving:true,  status:"URGENT", progress:1.00 },
};

/* a light spoked road-wheel centered at (cx,cy), radius r, hub rotation a */
function drawWheel(pen, g, cx, cy, r, a, moving, T){
  if (moving){
    g.save(); g.globalAlpha = 0.28;
    pen.paint(()=>{ g.arc(cx - r*0.14, cy, r, 0, 7); }, toneSolid(inkLevel(3)), 0);
    g.restore();
  }
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(params.wheelInk)), 5);
  pen.paint(()=>{ g.arc(cx, cy, r*0.80, 0, 7); }, toneSolid(inkLevel(1)), 3);
  const n = params.spokes;
  if (moving){
    g.save(); g.globalAlpha = 0.5; g.strokeStyle = inkLevel(3); g.lineWidth = 4;
    for (let i=0;i<n*2;i++){
      const ang = a*0.6 + i*Math.PI/n;
      g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(ang)*r*0.8, cy+Math.sin(ang)*r*0.8); g.stroke();
    }
    g.restore();
  }
  for (let i=0;i<n;i++){
    const ang = a + i*2*Math.PI/n;
    pen.limb(()=>{ g.moveTo(cx,cy); g.lineTo(cx+Math.cos(ang)*r*0.80, cy+Math.sin(ang)*r*0.80); },
             toneSolid(inkLevel(6)), moving?3:4);
  }
  pen.paint(()=>{ g.arc(cx, cy, r*0.15, 0, 7); }, toneSolid(inkLevel(7)), 3);
  g.fillStyle = inkLevel(1); g.beginPath(); g.arc(cx, cy, r*0.05, 0, 7); g.fill();
}

/* the piled gift-treasure lashed into/over the car.
   Composition (so three gifts read distinctly, no dark blob):
     · a mid-tone CHEST fills the car floor, with a LIGHT lid band on top
     · a bronze TRIPOD-cauldron STANDS ON the chest lid, bowl above the rim
     · a light folded ROBE wedges at the open front corner
   Objects sit at clearly different tones with paper gaps + hard contour. */
function drawLoad(pen, g, W, H, R){
  /* ---- gift-CHEST: a strapped box filling the car floor ---- */
  const chX0 = R.carBack + W*0.014, chX1 = W*0.430;
  const chBot = R.floorY - H*0.004;
  const chTop = R.floorY - H*0.120;      // box body top (lid sits above)
  const lidTop = chTop - H*0.024;        // flat lid band top
  // box body (mid tone)
  pen.paint(()=>{ g.rect(chX0, chTop, chX1-chX0, chBot-chTop); },
            toneSolid(inkLevel(params.chestInk)), 5);
  // flat lid band (light — makes the box read as a lidded chest)
  pen.paint(()=>{ g.rect(chX0 - W*0.006, lidTop, (chX1-chX0) + W*0.012, chTop-lidTop); },
            toneSolid(inkLevel(params.lidInk)), 5);
  // metal corner-fittings + central hasp on the box face
  g.strokeStyle = INK; g.lineWidth = 2.6;
  for (const fx of [chX0+W*0.012, chX1-W*0.012]){
    g.beginPath(); g.moveTo(fx, chTop+H*0.004); g.lineTo(fx, chBot-H*0.006); g.stroke();
  }
  g.fillStyle = inkLevel(7);
  g.beginPath(); g.rect((chX0+chX1)/2 - W*0.009, chTop+H*0.006, W*0.018, H*0.030); g.fill();

  /* ---- bronze TRIPOD-cauldron STANDING on the chest lid (the prize gift) ---- */
  const tpx = W*0.268, bowlCy = R.railTop - H*0.072, bowlR = W*0.062;
  const bowlBase = bowlCy + bowlR*0.34, legFootY = lidTop - H*0.002;
  // three splayed legs from the bowl base down onto the chest lid (two read fore/aft)
  for (const s of [-1, 0, 1]){
    const footX = tpx + s*W*0.058;
    pen.limb(()=>{
      g.moveTo(tpx + s*W*0.024, bowlBase);
      g.quadraticCurveTo(tpx + s*W*0.052, (bowlBase+legFootY)/2, footX, legFootY);
    }, toneSolid(inkLevel(params.tripodInk)), s===0?4:6);
  }
  // the cauldron bowl — an OPEN vessel (U-cup + rim ellipse), not a filled blob
  pen.paint(()=>{
    g.moveTo(tpx - bowlR, bowlCy - bowlR*0.30);
    g.quadraticCurveTo(tpx - bowlR*0.96, bowlCy + bowlR*0.9, tpx, bowlCy + bowlR*0.62);
    g.quadraticCurveTo(tpx + bowlR*0.96, bowlCy + bowlR*0.9, tpx + bowlR, bowlCy - bowlR*0.30);
    g.quadraticCurveTo(tpx, bowlCy - bowlR*0.02, tpx - bowlR, bowlCy - bowlR*0.30);
    g.closePath();
  }, toneSolid(inkLevel(params.tripodInk)), 5);
  // open mouth (light rim interior)
  pen.paint(()=>{ g.ellipse(tpx, bowlCy - bowlR*0.28, bowlR*0.92, bowlR*0.24, 0, 0, 7); },
            toneSolid(inkLevel(2)), 4);
  // two ring handles at the rim
  g.strokeStyle = INK; g.lineWidth = 3.4;
  for (const s of [-1, 1]){
    g.beginPath();
    g.arc(tpx + s*bowlR*1.02, bowlCy - bowlR*0.24, W*0.016, Math.PI*0.10, Math.PI*1.90);
    g.stroke();
  }

  /* ---- folded ROBE bundle stacked on the chest lid, right of the tripod ---- */
  const rbX = W*0.388, rbY = lidTop - H*0.030;
  pen.paint(()=>{
    g.moveTo(rbX - W*0.052, rbY + H*0.034);
    g.lineTo(rbX - W*0.044, rbY - H*0.026);
    g.quadraticCurveTo(rbX, rbY - H*0.048, rbX + W*0.048, rbY - H*0.022);
    g.lineTo(rbX + W*0.054, rbY + H*0.034);
    g.closePath();
  }, toneSolid(inkLevel(params.robeInk)), 4);
  // fold lines across the robe (so it reads as folded cloth, not a block)
  g.strokeStyle = inkLevel(4); g.lineWidth = 1.8;
  for (const fy of [-0.008, 0.010, 0.026]){
    g.beginPath();
    g.moveTo(rbX - W*0.046, rbY + fy*H + H*0.004);
    g.quadraticCurveTo(rbX, rbY + fy*H - H*0.006, rbX + W*0.048, rbY + fy*H + H*0.004);
    g.stroke();
  }

  /* ---- LASHING: ropes crossing over the whole pile, tied down to the car ---- */
  g.strokeStyle = inkLevel(params.lashInk); g.lineWidth = 3; g.lineCap="round";
  // long rope arcing over the chest lid + robe crown
  g.beginPath();
  g.moveTo(R.carBack, R.floorY - H*0.010);
  g.quadraticCurveTo(W*0.320, lidTop - H*0.014, R.carFront - W*0.010, R.floorY - H*0.014);
  g.stroke();
  // vertical cinch straps down the chest face
  g.lineWidth = 2.6;
  for (const fx of [chX0 + (chX1-chX0)*0.32, chX0 + (chX1-chX0)*0.68]){
    g.beginPath(); g.moveTo(fx, lidTop - H*0.002); g.lineTo(fx, chBot + H*0.002); g.stroke();
  }
  // tie-knobs where the ropes cleat to the rail
  g.fillStyle = inkLevel(7);
  for (const kx of [R.carBack, R.carFront - W*0.010]){
    g.beginPath(); g.arc(kx, R.floorY - H*0.010, W*0.010, 0, 7); g.fill();
  }
}

function drawChariot(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "laden";
  const P = POSE[mode] || POSE.laden;
  const R = rig(W,H);
  const T = st.t || 0;

  // road-vibration bob: the whole laden car rocks when driving urgently
  const bob = P.moving ? Math.sin(T*9)*H*0.006 : 0;
  const tilt = P.moving ? Math.sin(T*9+1.0)*0.014 : 0;

  /* ============ GROUND + ROAD DUST / SPEED STREAKS ============ */
  pen.ink(()=>{ g.moveTo(0,R.groundY); g.lineTo(W,R.groundY); }, 2);
  if (P.moving){
    g.fillStyle = inkLevel(params.dustInk);
    for (let i=0;i<7;i++){
      const dx = R.hubX - W*0.06 - i*W*0.030 + Math.sin(T*3+i)*4;
      const dy = R.groundY - H*0.008 - (i%3)*H*0.014 - Math.abs(Math.sin(T*2+i))*H*0.02;
      const rr = W*0.026*(1 - i*0.08);
      g.beginPath(); g.ellipse(dx, dy, rr, rr*0.7, 0, 0, 7); g.fill();
    }
    g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.lineCap="round";
    for (let k=0;k<4;k++){
      const yy = R.groundY + H*0.006 + k*H*0.010;
      const x0 = R.hubX - W*0.02 - ((T*W*0.5 + k*40) % (W*0.5));
      g.beginPath(); g.moveTo(x0, yy); g.lineTo(x0 - W*0.10, yy); g.stroke();
    }
  }

  // everything above the road bobs together
  g.save();
  g.translate(R.hubX, R.hubY);
  g.rotate(tilt);
  g.translate(-R.hubX, -R.hubY + bob);

  /* ============ SHORT DRAFT-POLE (rhumos): forward & up ============ */
  pen.limb(()=>{
    g.moveTo(R.carFront - W*0.02, R.floorY + H*0.004);
    g.quadraticCurveTo(W*0.72, R.floorY - H*0.020, R.poleTipX, R.poleTipY);
  }, toneSolid(inkLevel(params.poleInk)), 9);
  pen.ink(()=>{ g.moveTo(W*0.66, R.floorY - H*0.012); g.lineTo(R.carFront - W*0.02, R.floorY + H*0.004); }, 2);

  /* ============ BARE HITCH-YOKE (HORSES OMITTED) ============ */
  pen.limb(()=>{ g.moveTo(R.yokeX - W*0.020, R.yokeY - H*0.028);
                 g.lineTo(R.yokeX + W*0.020, R.yokeY + H*0.028); },
           toneSolid(inkLevel(params.yokeInk)), 8);
  pen.paint(()=>{ g.arc(R.poleTipX, R.poleTipY, W*0.014, 0, 7); }, toneSolid(inkLevel(7)), 3);

  /* ============ THE CAR (D-shaped standing basket) ============ */
  // floor plank
  pen.paint(()=>{ g.rect(R.carBack, R.floorY, R.carFront - R.carBack, H*0.020); },
            toneSolid(inkLevel(6)), 4);
  // body panel: solid back, curved front (the wicker/leather sides), rim kept low
  pen.paint(()=>{
    g.moveTo(R.carBack, R.floorY + H*0.006);
    g.lineTo(R.carBack, R.railTop + H*0.010);
    g.lineTo(W*0.430, R.railTop);
    g.quadraticCurveTo(R.carFront + W*0.010, R.railTop + H*0.010,
                       R.carFront - W*0.006, R.floorY + H*0.004);
    g.lineTo(R.carBack, R.floorY + H*0.006);
    g.closePath();
  }, toneSolid(inkLevel(params.carInk)), 5);
  // wicker weave hint (light verticals)
  g.strokeStyle = inkLevel(2); g.lineWidth = 1.4;
  for (let x=R.carBack + W*0.020; x < R.carFront - W*0.020; x += W*0.030){
    const topY = R.railTop + H*0.014 + (x>W*0.40 ? (x-W*0.40)*0.5 : 0);
    g.beginPath(); g.moveTo(x, topY); g.lineTo(x, R.floorY); g.stroke();
  }

  /* ============ THE GIFT-LOAD (chest, tripod, robe) lashed on ============ */
  drawLoad(pen, g, W, H, R);

  // the bentwood RAIL (antyx) capping the low front & top — drawn over the load base
  pen.limb(()=>{
    g.moveTo(R.carBack, R.railTop + H*0.010);
    g.lineTo(W*0.430, R.railTop);
    g.quadraticCurveTo(R.carFront + W*0.014, R.railTop + H*0.012,
                       R.carFront - W*0.004, R.floorY - H*0.002);
  }, toneSolid(inkLevel(params.railInk)), 6);
  // rear grab-post
  pen.limb(()=>{ g.moveTo(R.carBack, R.railTop + H*0.010); g.lineTo(R.carBack, R.floorY); },
           toneSolid(inkLevel(params.railInk)), 6);

  /* ============ AXLE (under the floor, out to the hub) ============ */
  pen.limb(()=>{ g.moveTo(R.hubX, R.hubY); g.lineTo(W*0.300, R.floorY + H*0.014); },
           toneSolid(inkLevel(6)), 6);

  g.restore(); // end bob/tilt group

  /* ============ THE ROAD-WHEEL (spinning when urgent) ============ */
  const spin = P.moving ? -T*6.0 : Math.PI*0.13;
  drawWheel(pen, g, R.hubX, R.hubY + bob*0.3, R.wheelR, spin, P.moving, T);
}

export const asset = {
  id:"vehicle.gift-laden-chariot",
  type:"VEHICLE",
  name:"Gift-laden Chariot",
  statusWord:"LADEN",
  scene:"OD-B15-S02",

  params,
  // back -> front draw order the module honors
  layers:["ground","dust","pole","yoke","car-floor","car-body","weave",
          "load-chest","load-robe","load-tripod","lashing","rail","axle","wheel"],

  // normalized 0..1 board / ride / LOAD / hitch anchors (EMPTY of riders)
  anchors:{
    "board:rear":{x:.205,y:.640},        // driver steps in over the open back
    "ride:platform":{x:.360,y:.635},     // standing room (mostly filled by cargo)
    "grip:front-rail":{x:.500,y:.540},   // the antyx the driver braces against
    "grip:rear-post":{x:.190,y:.560},
    "load:chest":{x:.290,y:.640},        // lashed gift-chest on the floor
    "load:tripod":{x:.298,y:.500},       // bronze tripod-cauldron above the rim
    "load:robe":{x:.470,y:.660},         // folded robe bundle
    "lash:crown":{x:.300,y:.500},        // where the main rope crests the pile
    "hitch:yoke":{x:.874,y:.585},        // bare yoke (HORSES OMITTED)
    "pole:tip":{x:.900,y:.600},          // short draft-pole tip
    "wheel:hub":{x:.360,y:.610},         // axle / hub (rotation center)
    ground:{x:.360,y:.780},
  },
  // collision shape: the car + piled load + wheel footprint; pole reaches ahead
  collision:{ kind:"box", x0:.170,y0:.420,x1:.560,y1:.780 },
  reach:{ pole:{ x0:.545,y0:.560,x1:.920,y1:.620 } }, // yoke/pole extent for horse hookup
  capacity:{ standers:1, cargo:3, total:1 }, // one driver, cargo-heavy
  ownership:"menelaus",                      // Menelaus' parting guest-gifts

  states:{
    initial:"laden",
    nodes:{
      laden: { preview:{ mode:"laden",  status:"LADEN",  progress:0.30 } },
      urgent:{ preview:{ mode:"urgent", status:"URGENT", progress:1.00 } },
    },
    edges:[["laden","urgent"],["urgent","laden"]],
  },
  channels:["mode","t"],

  preview:()=>({ mode:"laden", status:"LADEN", progress:0.30, t:0 }),
  draw(ctx,W,H,state){ drawChariot(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
