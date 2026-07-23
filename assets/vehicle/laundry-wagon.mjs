/* vehicle.laundry-wagon — a mule-drawn two-wheeled laundry cart (profile).
   VEHICLE asset. A side-elevation open-bed cart on a single large spoked
   road-wheel: a low plank bed with side rails, a raised driver's seat-board at
   the front, and a load piled in the bed — a mound of folded washing (the
   clothing load), a woven food basket, and a round-bodied oil flask tucked by
   the seat. A draft-pole runs forward to a simple neck-yoke, and a plain
   harnessed MULE form stands in the traces (drawn light + diagrammatic, and
   hideable via state). Drawn EMPTY of riders — the seat is unoccupied.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B06-S01): Nausicaa's wagon carrying the royal wash, a
   food basket and a gold flask of oil down the river-road to the washing-pools
   — cycling between PARKED (standing at the pools, wheel at rest) and ROLLING
   (wheel spinning, bed rocking, road-dust and the mule stepping out).
   Atlas: reusable boarded object; board/seat/load anchors, spoked wheel,
   motion states, capacity, collision. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  spokes:8,            // light spoked road-wheel
  wheelInk:6,          // felloe / tyre tone
  bedInk:4,            // plank bed body
  railInk:6,           // side-rail (dark, reads as a frame over the bed)
  seatInk:5,           // driver's seat-board
  poleInk:5,           // draft-pole
  yokeInk:6,           // neck-yoke crossbar
  clothInk:2,          // folded washing pile (light — a soft mound)
  basketInk:5,         // woven food basket
  flaskInk:6,          // oil flask
  muleInk:3,           // simple harnessed mule form (light, diagrammatic)
  dustInk:2,           // road dust (near-paper)
};

/* ---- fixed geometry in the 660x880 source (fractions of W/H) ---- */
function rig(W,H){
  const groundY = H*0.880;
  const wheelR  = H*0.190;
  const hubX    = W*0.300;
  const hubY    = groundY - wheelR;        // axle height
  const floorY  = hubY - H*0.016;          // plank bed rides just over the axle
  const bedBack = W*0.100;                 // rear of the bed (open, load lifts in here)
  const bedFront= W*0.480;                 // front of the bed (under the seat)
  const railTop = floorY - H*0.205;        // top of the side-rail
  const seatY   = floorY - H*0.300;        // raised driver's seat-board
  // draft-pole tip + yoke, forward (right) and slightly up toward the mule
  const poleTipX= W*0.660, poleTipY = floorY - H*0.052;
  const yokeX   = W*0.620, yokeY = poleTipY - H*0.006;
  // simple harnessed mule stands ahead of the yoke in the traces
  const muleX   = W*0.805, muleBodyY = groundY - H*0.205;
  return { groundY, wheelR, hubX, hubY, floorY, bedBack, bedFront,
           railTop, seatY, poleTipX, poleTipY, yokeX, yokeY, muleX, muleBodyY };
}

/* per-state pose */
const POSE = {
  parked:  { moving:false, status:"PARKED",  progress:0.15 },
  rolling: { moving:true,  status:"ROLLING", progress:1.00 },
};

/* a light spoked road-wheel centered at (cx,cy), radius r, hub rotation a */
function drawWheel(pen, g, cx, cy, r, a, moving, T){
  if (moving){
    g.save(); g.globalAlpha = 0.28;
    pen.paint(()=>{ g.arc(cx - r*0.14, cy, r, 0, 7); }, toneSolid(inkLevel(3)), 0);
    g.restore();
  }
  // tyre / felloe ring (dark outer, pale interior so spokes read)
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

function drawWagon(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "parked";
  const P = POSE[mode] || POSE.parked;
  const R = rig(W,H);
  const T = st.t || 0;
  const showMule = st.showMule !== false;

  const bob  = P.moving ? Math.sin(T*8)*H*0.005 : 0;
  const tilt = P.moving ? Math.sin(T*8+1.0)*0.012 : 0;

  /* ============ GROUND + RIVER-ROAD DUST ============ */
  pen.ink(()=>{ g.moveTo(0,R.groundY); g.lineTo(W,R.groundY); }, 2);
  if (P.moving){
    g.fillStyle = inkLevel(params.dustInk);
    for (let i=0;i<7;i++){
      const dx = R.hubX - W*0.05 - i*W*0.028 + Math.sin(T*3+i)*4;
      const dy = R.groundY - H*0.006 - (i%3)*H*0.013 - Math.abs(Math.sin(T*2+i))*H*0.018;
      const rr = W*0.024*(1 - i*0.08);
      g.beginPath(); g.ellipse(dx, dy, rr, rr*0.7, 0, 0, 7); g.fill();
    }
    g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.lineCap="round";
    for (let k=0;k<4;k++){
      const yy = R.groundY + H*0.006 + k*H*0.009;
      const x0 = R.hubX - W*0.02 - ((T*W*0.5 + k*40) % (W*0.5));
      g.beginPath(); g.moveTo(x0, yy); g.lineTo(x0 - W*0.09, yy); g.stroke();
    }
  }

  /* ============ THE MULE (simple harnessed form, ahead in the traces) ============ */
  if (showMule){
    const bx = R.muleX, by = R.muleBodyY;
    const brx = W*0.092, bry = H*0.058;
    const step = P.moving ? Math.sin(T*7) : 0;
    // legs (two visible pairs, front/back; stride when rolling)
    const legTone = toneSolid(inkLevel(params.muleInk+1));
    const legs = [
      { x:bx-brx*0.62, ph: step },        // hind
      { x:bx-brx*0.30, ph:-step },
      { x:bx+brx*0.42, ph:-step },        // fore
      { x:bx+brx*0.70, ph: step },
    ];
    for (const L of legs){
      const kx = L.x + L.ph*W*0.012;
      pen.limb(()=>{ g.moveTo(L.x, by+bry*0.5); g.lineTo(kx, R.groundY); }, legTone, 6);
      // hoof
      pen.paint(()=>{ g.ellipse(kx, R.groundY, W*0.014, H*0.007, 0, 0, 7); }, toneSolid(inkLevel(6)), 3);
    }
    // short tail-swish behind the haunch (drawn before the body so it tucks in)
    pen.limb(()=>{ g.moveTo(bx-brx*0.98, by-bry*0.25);
                   g.quadraticCurveTo(bx-brx*1.28, by+bry*0.35, bx-brx*1.10, by+bry*0.95); },
             toneSolid(inkLevel(params.muleInk+1)), 5);
    // body
    pen.paint(()=>{ g.ellipse(bx, by, brx, bry, 0, 0, 7); }, toneSolid(inkLevel(params.muleInk)), 5);
    // haunch swell
    pen.paint(()=>{ g.ellipse(bx-brx*0.65, by-bry*0.05, brx*0.42, bry*0.9, 0, 0, 7); }, toneSolid(inkLevel(params.muleInk)), 4);
    // chest + neck up toward the yoke
    const neckBaseX = bx+brx*0.72, neckBaseY = by-bry*0.15;
    const headX = bx+brx*1.20, headY = by-bry*1.15;
    pen.limb(()=>{ g.moveTo(neckBaseX, neckBaseY); g.lineTo(headX, headY); },
             toneSolid(inkLevel(params.muleInk)), W*0.05);
    // head
    pen.paint(()=>{ g.ellipse(headX+W*0.010, headY-H*0.006, W*0.030, H*0.030, 0.5, 0, 7); },
              toneSolid(inkLevel(params.muleInk)), 4);
    // muzzle
    pen.paint(()=>{ g.ellipse(headX+W*0.030, headY+H*0.014, W*0.016, H*0.012, 0.5, 0, 7); },
              toneSolid(inkLevel(params.muleInk+1)), 3);
    // long mule ears
    for (const s of [0,1]){
      pen.paint(()=>{ g.ellipse(headX-W*0.006+s*W*0.014, headY-H*0.034, W*0.010, H*0.026, 0.15-s*0.3, 0, 7); },
                toneSolid(inkLevel(params.muleInk)), 3);
    }
    // eye
    g.fillStyle=INK; g.beginPath(); g.arc(headX+W*0.008, headY-H*0.004, W*0.006, 0, 7); g.fill();
    // harness collar at the chest + trace to the pole tip
    pen.ink(()=>{ g.moveTo(neckBaseX-W*0.006, neckBaseY-H*0.03);
                  g.lineTo(neckBaseX+W*0.010, neckBaseY+H*0.05); }, 4);
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
    g.beginPath(); g.moveTo(R.poleTipX, R.poleTipY);
    g.lineTo(bx-brx*0.2, by+bry*0.2); g.stroke();      // belly-band trace
    g.beginPath(); g.moveTo(R.yokeX, R.yokeY-H*0.010);
    g.quadraticCurveTo(bx*0.9, by-bry*1.2, neckBaseX, neckBaseY-H*0.01); g.stroke();
  }

  // everything on the cart above the road bobs/tilts together
  g.save();
  g.translate(R.hubX, R.hubY);
  g.rotate(tilt);
  g.translate(-R.hubX, -R.hubY + bob);

  /* ============ DRAFT-POLE: forward & up to the yoke ============ */
  pen.limb(()=>{
    g.moveTo(R.bedFront - W*0.02, R.floorY + H*0.006);
    g.quadraticCurveTo(W*0.56, R.floorY - H*0.006, R.poleTipX, R.poleTipY);
  }, toneSolid(inkLevel(params.poleInk)), 8);
  // yoke crossbar at the pole tip (EMPTY neck-yoke)
  pen.limb(()=>{ g.moveTo(R.yokeX - W*0.006, R.yokeY - H*0.034);
                 g.lineTo(R.yokeX + W*0.006, R.yokeY + H*0.034); },
           toneSolid(inkLevel(params.yokeInk)), 8);
  pen.paint(()=>{ g.arc(R.poleTipX, R.poleTipY, W*0.013, 0, 7); }, toneSolid(inkLevel(7)), 3);

  /* ============ THE BED (open plank cart body) ============ */
  // floor plank
  pen.paint(()=>{ g.rect(R.bedBack, R.floorY, R.bedFront - R.bedBack, H*0.020); },
            toneSolid(inkLevel(6)), 4);
  // near side panel of the bed (light, so the load & rail read over it)
  pen.paint(()=>{
    g.rect(R.bedBack, R.railTop, R.bedFront - R.bedBack, R.floorY - R.railTop);
  }, toneSolid(inkLevel(params.bedInk)), 5);
  // plank seams down the side panel
  g.strokeStyle = inkLevel(2); g.lineWidth = 1.4;
  for (let x=R.bedBack + W*0.030; x < R.bedFront - W*0.010; x += W*0.032){
    g.beginPath(); g.moveTo(x, R.railTop + H*0.006); g.lineTo(x, R.floorY - H*0.004); g.stroke();
  }
  // top side-rail (dark cap along the bed edge)
  pen.limb(()=>{ g.moveTo(R.bedBack - W*0.004, R.railTop); g.lineTo(R.bedFront + W*0.004, R.railTop); },
           toneSolid(inkLevel(params.railInk)), 5);
  // corner stakes (front + back uprights of the rail)
  pen.limb(()=>{ g.moveTo(R.bedBack, R.railTop - H*0.012); g.lineTo(R.bedBack, R.floorY); },
           toneSolid(inkLevel(params.railInk)), 5);
  pen.limb(()=>{ g.moveTo(R.bedFront, R.railTop - H*0.012); g.lineTo(R.bedFront, R.floorY); },
           toneSolid(inkLevel(params.railInk)), 5);

  /* ============ THE CLOTHING LOAD (mound of folded washing) ============ */
  // a soft light mound rising above the rail, stacked folded layers
  const lx0 = R.bedBack + W*0.020, lx1 = R.bedFront - W*0.055;
  const pileTop = R.railTop - H*0.135;
  pen.paint(()=>{
    g.moveTo(lx0, R.railTop);
    g.quadraticCurveTo((lx0+lx1)/2 - W*0.05, pileTop - H*0.02, (lx0+lx1)/2, pileTop);
    g.quadraticCurveTo((lx0+lx1)/2 + W*0.08, pileTop - H*0.01, lx1, R.railTop - H*0.02);
    g.lineTo(lx1, R.railTop);
    g.lineTo(lx0, R.railTop);
    g.closePath();
  }, toneSolid(inkLevel(params.clothInk)), 4);
  // stacked fold layers — horizontal folded-cloth seams that read as a laundry pile
  g.strokeStyle = inkLevel(4); g.lineWidth = 1.8; g.lineCap="round";
  const bands = [0.20, 0.42, 0.64, 0.84];
  for (let bi=0; bi<bands.length; bi++){
    const yy = lerp(pileTop, R.railTop, bands[bi]);
    const inset = W*0.010*bi;
    g.beginPath();
    g.moveTo(lx0 + inset, yy);
    g.quadraticCurveTo((lx0+lx1)/2, yy - H*0.012, lx1 - inset, yy - H*0.004);
    g.stroke();
  }
  // a couple of draped fold-edges spilling toward the rail
  g.strokeStyle = inkLevel(3); g.lineWidth = 1.5;
  for (const fx of [0.34, 0.62]){
    const xx = lerp(lx0, lx1, fx);
    g.beginPath(); g.moveTo(xx, R.railTop - H*0.02);
    g.quadraticCurveTo(xx + W*0.010, R.railTop - H*0.055, xx - W*0.006, pileTop + H*0.03); g.stroke();
  }

  /* ============ FOOD BASKET (woven, perched at the rear of the load) ============ */
  const bkx = R.bedBack + W*0.030, bky = R.railTop - H*0.030;
  const bkw = W*0.055, bkh = H*0.062;
  pen.paint(()=>{
    g.moveTo(bkx - bkw*0.5, bky - bkh);       // mouth left
    g.lineTo(bkx + bkw*0.5, bky - bkh);       // mouth right
    g.lineTo(bkx + bkw*0.36, bky);            // base right (tapered)
    g.lineTo(bkx - bkw*0.36, bky);            // base left
    g.closePath();
  }, toneSolid(inkLevel(params.basketInk)), 4);
  // weave: verticals + horizontals (cross-hatch reads as wickerwork)
  g.strokeStyle = inkLevel(2); g.lineWidth = 1.3;
  for (let i=-2;i<=2;i++){ const xx=bkx+i*bkw*0.16;
    g.beginPath(); g.moveTo(xx, bky-bkh+H*0.004); g.lineTo(xx*0.998, bky-H*0.004); g.stroke(); }
  for (let j=1;j<=3;j++){ const yy=bky-bkh*j/4;
    g.beginPath(); g.moveTo(bkx-bkw*0.46, yy); g.lineTo(bkx+bkw*0.46, yy); g.stroke(); }
  // arched carry-handle
  pen.limb(()=>{ g.moveTo(bkx-bkw*0.40, bky-bkh+H*0.004);
                 g.quadraticCurveTo(bkx, bky-bkh-H*0.040, bkx+bkw*0.40, bky-bkh+H*0.004); },
           toneSolid(inkLevel(params.basketInk)), 4);

  /* ============ OIL FLASK (gold flask of oil, standing at the load front) ============ */
  // stood upright on the rail in front of the seat, silhouetted clear of the load
  const flx = R.bedFront - W*0.070, flBaseY = R.railTop - H*0.004;
  const fbr = W*0.032;
  // round body
  pen.paint(()=>{ g.ellipse(flx, flBaseY - fbr*0.95, fbr, fbr*1.25, 0, 0, 7); },
            toneSolid(inkLevel(params.flaskInk)), 4);
  // narrow neck + flaring lip
  pen.paint(()=>{ g.rect(flx - W*0.009, flBaseY - fbr*2.85, W*0.018, fbr*1.15); },
            toneSolid(inkLevel(params.flaskInk)), 3);
  pen.paint(()=>{ g.ellipse(flx, flBaseY - fbr*2.9, W*0.019, H*0.009, 0, 0, 7); },
            toneSolid(inkLevel(7)), 3);
  // a small handle loop on the shoulder
  pen.ink(()=>{ g.moveTo(flx + fbr*0.8, flBaseY - fbr*1.7);
                g.quadraticCurveTo(flx + fbr*1.5, flBaseY - fbr*1.3, flx + fbr*0.75, flBaseY - fbr*0.9); }, 3);
  // blue accent band — the single ACCENT mark, marking the precious oil
  g.fillStyle = ACCENT; g.beginPath();
  g.ellipse(flx, flBaseY - fbr*0.95, fbr*0.42, fbr*0.5, 0, 0, 7); g.fill();

  /* ============ DRIVER'S SEAT-BOARD (raised at the front, EMPTY) ============ */
  // seat plank
  pen.paint(()=>{ g.rect(R.bedFront - W*0.010, R.seatY, W*0.120, H*0.024); },
            toneSolid(inkLevel(params.seatInk)), 4);
  // seat back-rest
  pen.limb(()=>{ g.moveTo(R.bedFront - W*0.006, R.seatY + H*0.004);
                 g.lineTo(R.bedFront - W*0.006, R.seatY - H*0.060); },
           toneSolid(inkLevel(params.railInk)), 5);
  // seat support post down to the bed front
  pen.limb(()=>{ g.moveTo(R.bedFront + W*0.050, R.seatY + H*0.024);
                 g.lineTo(R.bedFront + W*0.030, R.floorY); },
           toneSolid(inkLevel(params.seatInk)), 5);
  // footboard lip at the seat front
  pen.paint(()=>{ g.rect(R.bedFront + W*0.100, R.seatY + H*0.010, W*0.016, H*0.030); },
            toneSolid(inkLevel(6)), 3);

  /* ============ AXLE (under the floor, out to the hub) ============ */
  pen.limb(()=>{ g.moveTo(R.hubX, R.hubY); g.lineTo(W*0.240, R.floorY + H*0.014); },
           toneSolid(inkLevel(6)), 6);

  g.restore(); // end bob/tilt group

  /* ============ THE ROAD-WHEEL (spinning when rolling) ============ */
  const spin = P.moving ? -T*6.0 : Math.PI*0.13;
  drawWheel(pen, g, R.hubX, R.hubY + bob*0.3, R.wheelR, spin, P.moving, T);
}

export const asset = {
  id:"vehicle.laundry-wagon",
  type:"VEHICLE",
  name:"Laundry Wagon",
  statusWord:"PARKED",
  scene:"OD-B06-S01",

  params,
  // back -> front draw order the module honors
  layers:["ground","dust","mule","pole","yoke","bed-floor","bed-body","rail",
          "clothing-load","food-basket","oil-flask","seat","axle","wheel"],

  // normalized 0..1 board / seat / load / hitch anchors (EMPTY of riders)
  anchors:{
    "board:seat":{x:.520,y:.500},        // step up to the driver's seat-board
    "seat:driver":{x:.560,y:.470},       // Nausicaa's unoccupied seat position
    "board:rear":{x:.110,y:.640},        // handmaids load the wash in over the back
    "load:clothing":{x:.290,y:.470},     // mound of folded washing
    "load:basket":{x:.155,y:.500},       // woven food basket
    "load:flask":{x:.435,y:.560},        // gold flask of oil
    "hitch:yoke":{x:.620,y:.640},        // neck-yoke where the mule couples (EMPTY)
    "pole:tip":{x:.660,y:.615},          // draft-pole tip
    "harness:mule":{x:.800,y:.610},      // simple harnessed mule form (hideable)
    "wheel:hub":{x:.300,y:.640},         // axle / hub (rotation center)
    ground:{x:.300,y:.760},
  },
  // collision shape: the cart + wheel footprint (asset space); pole+mule reach ahead
  collision:{ kind:"box", x0:.100,y0:.360,x1:.490,y1:.760 },
  reach:{ draught:{ x0:.490,y0:.560,x1:.900,y1:.760 } }, // pole/yoke/mule extent
  capacity:{ seated:1, load:"laundry+provisions", total:1 },
  ownership:"nausicaa",                   // the princess's household wagon

  states:{
    initial:"parked",
    nodes:{
      parked:  { preview:{ mode:"parked",  showMule:true, status:"PARKED",  progress:0.15 } },
      rolling: { preview:{ mode:"rolling", showMule:true, status:"ROLLING", progress:1.00 } },
      "cart-only":{ preview:{ mode:"parked", showMule:false, status:"UNHITCHED", progress:0.10 } },
    },
    edges:[["parked","rolling"],["rolling","parked"],["parked","cart-only"],["cart-only","parked"]],
  },
  channels:["mode","showMule","t"],

  preview:()=>({ mode:"parked", showMule:true, status:"PARKED", progress:0.15, t:0 }),
  draw(ctx,W,H,state){ drawWagon(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
