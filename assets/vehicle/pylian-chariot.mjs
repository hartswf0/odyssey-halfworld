/* vehicle.pylian-chariot — a two-wheeled royal war/travel chariot (profile).
   VEHICLE asset. A side-elevation Mycenaean/Pylian chariot: a single large
   spoked road-wheel under a light D-shaped standing car (the driver's basket
   with its curved front rail / antyx), a long draft-pole (rhumos) running
   forward and up to a neck-yoke with two saddle-bows for the horse pair, reins
   led back from the yoke to the rail, and luggage lashed at the rear. Drawn
   EMPTY — no driver and no horses baked in.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B03-S06): Nestor's royal chariot that carries Telemachus
   from sandy Pylos toward Sparta — cycling between STOP (standing at the gate,
   wheel at rest) and GALLOP (wheel spinning, the car rocking, road-dust and
   vibration streaks under the tyre).
   Atlas: reusable boarded object; board/ride anchors, yoke/luggage anchors,
   moving spoked wheels, motion states, capacity, collision. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  spokes:8,            // classic light spoked road-wheel
  wheelInk:6,          // felloe/tyre tone
  carInk:3,            // wicker/leather car body (light, so the rail reads over it)
  railInk:7,           // dark bentwood rail (antyx)
  poleInk:5,           // draft-pole
  yokeInk:6,           // yoke crossbar
  luggageInk:6,        // lashed baggage bundle
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
  const railTop = floorY - H*0.280;      // top of the front/side rail (antyx) — tall car
  // draft-pole tip + yoke, forward and slightly up toward the horse pair
  const poleTipX= W*0.910, poleTipY = floorY - H*0.078;
  const yokeX   = W*0.866, yokeY = poleTipY - H*0.006;
  return { groundY, wheelR, hubX, hubY, floorY, carBack, carFront,
           railTop, poleTipX, poleTipY, yokeX, yokeY };
}

/* per-state pose */
const POSE = {
  stop:   { moving:false, status:"AT REST", progress:0.15 },
  gallop: { moving:true,  status:"GALLOP",  progress:1.00 },
};

/* a light spoked road-wheel centered at (cx,cy), radius r, hub rotation a */
function drawWheel(pen, g, cx, cy, r, a, moving, T){
  // motion smear ghost behind the tyre when galloping
  if (moving){
    g.save(); g.globalAlpha = 0.28;
    pen.paint(()=>{ g.arc(cx - r*0.14, cy, r, 0, 7); }, toneSolid(inkLevel(3)), 0);
    g.restore();
  }
  // tyre / felloe ring (dark outer, pale interior so spokes read)
  pen.paint(()=>{ g.arc(cx, cy, r, 0, 7); }, toneSolid(inkLevel(params.wheelInk)), 5);
  pen.paint(()=>{ g.arc(cx, cy, r*0.80, 0, 7); }, toneSolid(inkLevel(1)), 3);
  // spokes
  const n = params.spokes;
  if (moving){
    // spinning: draw a faint blur fan + a few sharp spokes riding the blur
    g.save(); g.globalAlpha = 0.5; g.strokeStyle = inkLevel(3); g.lineWidth = 4;
    for (let i=0;i<n*2;i++){
      const ang = a*0.6 + i*Math.PI/n;
      g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(ang)*r*0.8, cy+Math.sin(ang)*r*0.8); g.stroke();
    }
    g.restore();
  }
  const showN = n;
  for (let i=0;i<showN;i++){
    const ang = a + i*2*Math.PI/showN;
    pen.limb(()=>{ g.moveTo(cx,cy); g.lineTo(cx+Math.cos(ang)*r*0.80, cy+Math.sin(ang)*r*0.80); },
             toneSolid(inkLevel(6)), moving?3:4);
  }
  // hub
  pen.paint(()=>{ g.arc(cx, cy, r*0.15, 0, 7); }, toneSolid(inkLevel(7)), 3);
  g.fillStyle = inkLevel(1); g.beginPath(); g.arc(cx, cy, r*0.05, 0, 7); g.fill();
}

function drawChariot(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "stop";
  const P = POSE[mode] || POSE.stop;
  const R = rig(W,H);
  const T = st.t || 0;

  // road-vibration bob: the whole car rocks a touch when galloping
  const bob = P.moving ? Math.sin(T*9)*H*0.006 : 0;
  const tilt = P.moving ? Math.sin(T*9+1.0)*0.015 : 0;

  /* ============ GROUND + ROAD DUST / VIBRATION STREAKS ============ */
  pen.ink(()=>{ g.moveTo(0,R.groundY); g.lineTo(W,R.groundY); }, 2);
  if (P.moving){
    // dust cloud kicked up behind (left of) the wheel
    g.fillStyle = inkLevel(params.dustInk);
    for (let i=0;i<7;i++){
      const dx = R.hubX - W*0.06 - i*W*0.030 + Math.sin(T*3+i)*4;
      const dy = R.groundY - H*0.008 - (i%3)*H*0.014 - Math.abs(Math.sin(T*2+i))*H*0.02;
      const rr = W*0.026*(1 - i*0.08);
      g.beginPath(); g.ellipse(dx, dy, rr, rr*0.7, 0, 0, 7); g.fill();
    }
    // horizontal speed streaks along the road
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

  /* ============ DRAFT-POLE (rhumos): forward & up to the yoke ============ */
  pen.limb(()=>{
    g.moveTo(R.carFront - W*0.02, R.floorY + H*0.004);
    g.quadraticCurveTo(W*0.70, R.floorY - H*0.024, R.poleTipX, R.poleTipY);
  }, toneSolid(inkLevel(params.poleInk)), 9);
  // pole brace / stay back down to the axle line
  pen.ink(()=>{ g.moveTo(W*0.66, R.floorY - H*0.014); g.lineTo(R.carFront - W*0.02, R.floorY + H*0.004); }, 2);

  /* ============ YOKE (neck-yoke with two saddle-bows for the pair) ============ */
  // crossbar at the pole tip
  pen.limb(()=>{ g.moveTo(R.yokeX - W*0.020, R.yokeY - H*0.030);
                 g.lineTo(R.yokeX + W*0.020, R.yokeY + H*0.030); },
           toneSolid(inkLevel(params.yokeInk)), 8);
  // two saddle-bows arching down where each horse's neck would sit (EMPTY)
  for (const s of [-1, 1]){
    const yx = R.yokeX + s*W*0.016;
    const yy = R.yokeY + s*H*0.024;
    pen.limb(()=>{ g.moveTo(yx, yy);
                   g.quadraticCurveTo(yx + W*0.030, yy + H*0.026, yx + W*0.010, yy + H*0.048); },
             toneSolid(inkLevel(params.yokeInk)), 5);
  }
  // yoke-lashing knob at the pole tip
  pen.paint(()=>{ g.arc(R.poleTipX, R.poleTipY, W*0.014, 0, 7); }, toneSolid(inkLevel(7)), 3);

  /* ============ REINS (led back from the yoke to the rail) ============ */
  g.strokeStyle = INK; g.lineWidth = 2; g.lineCap="round";
  const reinSag = P.moving ? H*0.006 : H*0.028;
  for (const s of [-1, 1]){
    g.beginPath();
    g.moveTo(R.yokeX + s*W*0.006, R.yokeY + s*H*0.010);
    g.quadraticCurveTo(W*0.66, R.railTop + H*0.030 + reinSag, R.carFront - W*0.02, R.railTop + H*0.020);
    g.stroke();
  }

  /* ============ THE CAR (D-shaped standing basket) ============ */
  // floor plank
  pen.paint(()=>{ g.rect(R.carBack, R.floorY, R.carFront - R.carBack, H*0.020); },
            toneSolid(inkLevel(6)), 4);
  // body panel: solid back, curved front (the wicker/leather sides)
  pen.paint(()=>{
    g.moveTo(R.carBack, R.floorY + H*0.006);
    g.lineTo(R.carBack, R.railTop + H*0.010);                          // straight rear post
    g.lineTo(W*0.430, R.railTop);                                       // top edge back->front
    g.quadraticCurveTo(R.carFront + W*0.010, R.railTop + H*0.010,       // curved front rail
                       R.carFront - W*0.006, R.floorY + H*0.004);
    g.lineTo(R.carBack, R.floorY + H*0.006);
    g.closePath();
  }, toneSolid(inkLevel(params.carInk)), 5);
  // wicker weave hint (light verticals) inside the panel
  g.strokeStyle = inkLevel(2); g.lineWidth = 1.4;
  for (let x=R.carBack + W*0.020; x < R.carFront - W*0.020; x += W*0.028){
    const topY = R.railTop + H*0.014 + (x>W*0.40 ? (x-W*0.40)*0.5 : 0);
    g.beginPath(); g.moveTo(x, topY); g.lineTo(x, R.floorY); g.stroke();
  }
  // two horizontal weave bands
  g.strokeStyle = inkLevel(3); g.lineWidth = 1.6;
  for (const fy of [0.34, 0.68]){
    const yy = lerp(R.railTop, R.floorY, fy);
    g.beginPath(); g.moveTo(R.carBack + W*0.006, yy);
    g.quadraticCurveTo(W*0.40, yy, R.carFront - W*0.020, yy + H*0.010); g.stroke();
  }

  // the bentwood RAIL (antyx) capping the front & top — dark, so it reads as a hoop
  pen.limb(()=>{
    g.moveTo(R.carBack, R.railTop + H*0.010);
    g.lineTo(W*0.430, R.railTop);
    g.quadraticCurveTo(R.carFront + W*0.014, R.railTop + H*0.012,
                       R.carFront - W*0.004, R.floorY - H*0.002);
  }, toneSolid(inkLevel(params.railInk)), 6);
  // rear grab-post (rail turns down at the open back)
  pen.limb(()=>{ g.moveTo(R.carBack, R.railTop + H*0.010); g.lineTo(R.carBack, R.floorY); },
           toneSolid(inkLevel(params.railInk)), 6);

  /* ============ LUGGAGE (bundle lashed high at the rear post, clear of the wheel) ============ */
  const lugX = R.carBack - W*0.006, lugY = R.railTop + H*0.070;
  pen.paint(()=>{ g.ellipse(lugX, lugY, W*0.040, H*0.058, 0.10, 0, 7); },
            toneSolid(inkLevel(params.luggageInk)), 4);
  // lashing straps around the bundle
  g.strokeStyle = INK; g.lineWidth = 2;
  for (const fy of [-0.45, 0.05, 0.55]){
    const yy = lugY + fy*H*0.058;
    g.beginPath(); g.moveTo(lugX - W*0.048, yy); g.lineTo(lugX + W*0.030, yy); g.stroke();
  }
  // tie-line lashing it down to the rear post
  pen.ink(()=>{ g.moveTo(lugX + W*0.020, lugY + H*0.050); g.lineTo(R.carBack, R.floorY - H*0.010); }, 2);

  /* ============ AXLE (under the floor, out to the hub) ============ */
  pen.limb(()=>{ g.moveTo(R.hubX, R.hubY); g.lineTo(W*0.300, R.floorY + H*0.014); },
           toneSolid(inkLevel(6)), 6);

  g.restore(); // end bob/tilt group

  /* ============ THE ROAD-WHEEL (spinning in gallop) ============ */
  const spin = P.moving ? -T*6.0 : Math.PI*0.13;   // static wheel sits on a spoke
  drawWheel(pen, g, R.hubX, R.hubY + bob*0.3, R.wheelR, spin, P.moving, T);
}

export const asset = {
  id:"vehicle.pylian-chariot",
  type:"VEHICLE",
  name:"Pylian Chariot",
  statusWord:"AT REST",
  scene:"OD-B03-S06",

  params,
  // back -> front draw order the module honors
  layers:["ground","dust","pole","yoke","reins","car-floor","car-body","weave",
          "rail","luggage","axle","wheel"],

  // normalized 0..1 board / ride / hitch / luggage anchors (EMPTY chariot)
  anchors:{
    "board:rear":{x:.205,y:.610},        // driver steps in over the open back
    "ride:platform":{x:.340,y:.605},     // standing room on the car floor
    "ride:passenger":{x:.270,y:.605},    // second stander (Telemachus beside Peisistratos)
    "grip:front-rail":{x:.500,y:.480},   // the antyx the driver braces against
    "grip:rear-post":{x:.190,y:.520},
    "hitch:yoke":{x:.856,y:.560},        // where the horse-pair's necks yoke on (EMPTY)
    "hitch:yoke-left":{x:.870,y:.590},
    "hitch:yoke-right":{x:.842,y:.530},
    "pole:tip":{x:.900,y:.570},          // draft-pole / rhumos tip
    "grip:reins":{x:.500,y:.500},        // reins arrive at the rail
    "luggage:rear":{x:.190,y:.520},      // lashed baggage bundle
    "wheel:hub":{x:.340,y:.590},         // axle / hub (rotation center)
    ground:{x:.340,y:.760},
  },
  // collision shape: the car + wheel footprint (asset space); pole reaches ahead
  collision:{ kind:"box", x0:.170,y0:.430,x1:.520,y1:.760 },
  reach:{ pole:{ x0:.520,y0:.520,x1:.920,y1:.600 } }, // yoke/pole extent for horse hookup
  capacity:{ standers:2, total:2 },      // a royal two-man travelling car
  ownership:"nestor",                    // Nestor lends it to convey Telemachus

  states:{
    initial:"stop",
    nodes:{
      stop:  { preview:{ mode:"stop",   status:"AT REST", progress:0.15 } },
      gallop:{ preview:{ mode:"gallop", status:"GALLOP",  progress:1.00 } },
    },
    edges:[["stop","gallop"],["gallop","stop"]],
  },
  channels:["mode","t"],

  preview:()=>({ mode:"stop", status:"AT REST", progress:0.15, t:0 }),
  draw(ctx,W,H,state){ drawChariot(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
