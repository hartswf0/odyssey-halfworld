/* creature.argos — Odysseus' hound, twenty years old, lying neglected on the
   dung outside his own master's gate (Odyssey XVII).
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry built on
   engine primitives. A RECUMBENT aged hunting dog in profile facing +dir:
     · a long low starved BARREL lying on the ground — light worn coat with
       the ribs, the hip point and the hollow flank drawn as hard ink so the
       animal reads as wasted, not as a dark mass
     · four thin articulated LEGS: hind pair folded flat beside the haunch,
       fore pair either stretched out along the ground or propped under the
       chest when he tries to rise
     · a NECK that swings from muzzle-on-the-paws up to a raised head, and a
       long grey-muzzled hound HEAD with a soft DROOPING EAR flap, a sunken
       eye that opens or closes, and a jaw that can part for a weak breath
     · a thin TAIL that lies slack on the litter or lifts and sweeps
   States (the channels drive them):
     neglected   — the found state: head down on the paws, ears half dropped,
                   flank barely moving, eye open, lying in the litter.
     scent       — head lifted, nostrils working, ears coming forward, three
                   scent chevrons drifting in to the nose.
     recognize   — head up, ears dropped flat back in greeting, tail sweeping,
                   jaw parted. The one moment he is given.
     wag         — the tail alone: head half down, ears flat, tail sweeping.
     failed-rise — forelegs propped under the chest, shoulders heaved up, the
                   hindquarters still flat on the ground. He cannot follow.
     death       — settled, head laid out flat, ear flat, eye closed, tail
                   slack, breath channel at zero. Peaceful, not violent.
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B17-S03 — Argos recognizes his master and dies. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;

/* ---- tone levels (flat grays; the POST pass turns them into dots).
   The coat is deliberately LIGHT: the dog must read as a worn, half-bald
   old hound with plenty of paper showing, so that the dark ear, nose, eye
   and the ink ribs carry the whole silhouette. ---- */
const T_COAT   = ()=> toneSolid(inkLevel(2));   // worn light coat
const T_FLANK  = ()=> toneSolid(inkLevel(3));   // hollow flank / haunch shading
const T_SKULL  = ()=> toneSolid(inkLevel(3));   // skull (the ear must out-print it)
const T_MUZZLE = ()=> toneSolid(inkLevel(1));   // grey-white old muzzle
const T_EAR    = ()=> toneSolid(inkLevel(5));   // dark drooping ear flap
const T_LEGN   = ()=> toneSolid(inkLevel(3));   // near legs (light, hard contour)
const T_LEGF   = ()=> toneSolid(inkLevel(5));   // far legs (recede)
const T_PAW    = ()=> toneSolid(inkLevel(4));   // paw block
const T_TAIL   = ()=> toneSolid(inkLevel(3));
const T_SOCKET = ()=> toneSolid(inkLevel(1));   // pale eye socket
const T_GAP    = ()=> toneSolid(inkLevel(7));   // parted jaw

/* ---------- per-state channel resolver ----------
   headLift 0..1  muzzle-on-paws .. head raised
   earDrop  0..1  ear carried back/up .. hanging flat
   tail     0..1  slack on the litter .. lifted
   wag      0..1  sweep amplitude (animates over t)
   rise     0..1  forequarter propped up on the forelegs
   breath   0..1  flank amplitude (0 = no breath)
   eye      1|0   open .. closed
   jaw      0..1  mouth parted
   settle   0..1  body sinks into the litter
   scent    0..1  scent chevrons drifting to the nose
   strain   0..1  effort ticks at the propped elbow                        */
function poseFor(pose){
  switch(pose){
    case "scent":       return { headLift:.60, earDrop:.42, tail:.16, wag:.18, rise:.10, breath:.75, eye:1, jaw:.16, settle:0,  scent:1,  strain:0 };
    case "recognize":   return { headLift:.94, earDrop:1.0, tail:.62, wag:1.0, rise:.20, breath:.90, eye:1, jaw:.34, settle:0,  scent:0,  strain:0 };
    case "wag":         return { headLift:.48, earDrop:1.0, tail:.68, wag:1.0, rise:.06, breath:.70, eye:1, jaw:.12, settle:0,  scent:0,  strain:0 };
    case "failed-rise": return { headLift:.80, earDrop:.88, tail:.34, wag:.45, rise:.82, breath:1.0, eye:1, jaw:.48, settle:0,  scent:0,  strain:1 };
    case "death":       return { headLift:.00, earDrop:1.0, tail:.00, wag:0,   rise:0,   breath:0,   eye:0, jaw:.24, settle:1,  scent:0,  strain:0 };
    case "neglected":
    default:            return { headLift:.10, earDrop:.78, tail:.04, wag:0,   rise:0,   breath:.35, eye:1, jaw:.04, settle:.15,scent:0,  strain:0 };
  }
}

/* ---------- one soft DROOPING hound ear, in head-local space ----------
   drop 0 = carried back and up; drop 1 = hanging straight down the cheek. */
function drawEar(pen, hr, dir, drop, far){
  const g = pen.ctx;
  const bx = -dir*hr*0.28 - (far ? dir*hr*0.20 : 0);
  const by = -hr*0.30;
  const ang = lerp(-0.55, 1.18, clamp(drop,0,1));
  const ux = -dir*Math.cos(ang), uy = Math.sin(ang);
  const px = -uy, py = ux;                     // perpendicular
  const L = hr*(far ? 1.30 : 1.58);
  const w = hr*(far ? 0.30 : 0.36);
  const tip = P(bx+ux*L, by+uy*L);
  pen.paint(()=>{
    g.moveTo(bx - px*w*0.55, by - py*w*0.55);
    g.quadraticCurveTo(bx+ux*L*0.52 - px*w, by+uy*L*0.52 - py*w, tip.x, tip.y);
    g.quadraticCurveTo(bx+ux*L*0.52 + px*w, by+uy*L*0.52 + py*w, bx + px*w*0.55, by + py*w*0.55);
    g.closePath();
  }, T_EAR(), 3.5);
}

/* ---------- the hound HEAD, in a frame the caller has translated + rotated.
   Long grey muzzle off a darker skull; sunken eye; drooping ear. ---------- */
function drawHead(pen, hr, dir, o){
  const g = pen.ctx;

  // ---- far ear first (behind the skull) ----
  drawEar(pen, hr, dir, o.earDrop, true);

  // ---- skull ----
  pen.paint(()=>{ g.ellipse(0, 0, hr*0.86, hr*0.70, 0, 0, TAU); }, T_SKULL(), 4);

  // ---- long grey muzzle (the age mark: it prints paler than the skull) ----
  pen.paint(()=>{
    g.moveTo(dir*hr*0.28, -hr*0.34);
    g.quadraticCurveTo(dir*hr*1.06, -hr*0.32, dir*hr*1.46, -hr*0.04);   // bridge -> nose top
    g.quadraticCurveTo(dir*hr*1.58,  hr*0.16, dir*hr*1.34,  hr*0.26);   // nose end
    g.quadraticCurveTo(dir*hr*0.88,  hr*0.42, dir*hr*0.30,  hr*0.44);   // lip -> jaw
    g.closePath();
  }, T_MUZZLE(), 3.5);

  // ---- parted jaw (a dark sliver, the weak breath) ----
  if (o.jaw > 0.12){
    pen.fillPath(()=>{
      g.moveTo(dir*hr*1.26,  hr*0.18);
      g.quadraticCurveTo(dir*hr*0.82, hr*0.28 + o.jaw*hr*0.44, dir*hr*0.38, hr*0.34);
      g.lineTo(dir*hr*0.40, hr*0.22);
      g.quadraticCurveTo(dir*hr*0.84, hr*0.24, dir*hr*1.26, hr*0.12);
      g.closePath();
    }, T_GAP().base);
  }
  // ---- lip line ----
  pen.ink(()=>{ g.moveTo(dir*hr*1.24, hr*0.16); g.quadraticCurveTo(dir*hr*0.80, hr*0.24, dir*hr*0.38, hr*0.26); }, 2.6);

  // ---- stop / brow crease + sunken hollow above the eye ----
  pen.ink(()=>{ g.moveTo(dir*hr*0.16, -hr*0.40); g.lineTo(dir*hr*0.40, -hr*0.24); }, 3);
  pen.ink(()=>{ g.moveTo(dir*hr*0.20, -hr*0.06); g.quadraticCurveTo(dir*hr*0.46, -hr*0.34, dir*hr*0.74, -hr*0.16); }, 3);

  // ---- eye: open (pale socket + dark pupil) or closed (an ink crescent) ----
  const ex = dir*hr*0.48, ey = -hr*0.10;
  if (o.eye > 0.5){
    pen.fillPath(()=>{ g.ellipse(ex, ey, hr*0.20, hr*0.17, 0, 0, TAU); }, T_SOCKET().base);
    g.fillStyle = INK; g.beginPath(); g.ellipse(ex, ey, hr*0.11, hr*0.11, 0, 0, TAU); g.fill();
  } else {
    pen.ink(()=>{ g.moveTo(ex - hr*0.20, ey - hr*0.02); g.quadraticCurveTo(ex, ey + hr*0.16, ex + hr*0.20, ey - hr*0.02); }, 3.6);
  }

  // ---- nose ----
  g.fillStyle = INK; g.beginPath(); g.ellipse(dir*hr*1.40, hr*0.06, hr*0.15, hr*0.13, 0, 0, TAU); g.fill();
}

/* ---------- one thin leg: two segments + a small paw block ---------- */
function drawLeg(pen, a, b, c, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(b.x,b.y); g.lineTo(c.x,c.y); }, tone, w*0.80);
  pen.paint(()=>{ g.ellipse(c.x, c.y - w*0.10, w*0.90, w*0.52, 0, 0, TAU); }, T_PAW(), 3);
}

/* ============================================================ */
function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const t = state.t || 0;
  const pose = state.pose || "neglected";
  const o = poseFor(pose);
  for (const k of ["headLift","earDrop","tail","wag","rise","breath","eye","jaw","settle","scent","strain"])
    if (typeof state[k] === "number") o[k] = state[k];

  const dir = +1;
  const U = Math.min(W,H) * 0.235;
  const groundY = H * 0.64;
  const cx = W * 0.45;
  const sink = o.settle * U * 0.06;
  const rise = o.rise;
  const br = Math.sin(t*1.5) * o.breath * U * 0.035;   // slow shallow flank

  /* ---- broken ground line (never one full-width bar) ---- */
  g.save(); g.strokeStyle="rgba(0,0,0,0.18)"; g.lineWidth=2.6;
  for (const [a,b] of [[.05,.24],[.29,.52],[.58,.76],[.81,.96]]){
    g.beginPath(); g.moveTo(W*a, groundY+4); g.lineTo(W*b, groundY+4); g.stroke();
  }
  g.restore();

  /* ---- the litter he lies in: a broken scatter of straw, no solid band ---- */
  const R = rnd(1727);
  g.save(); g.strokeStyle="rgba(0,0,0,0.34)"; g.lineWidth=2.3; g.lineCap="round";
  for (let i=0;i<16;i++){
    const x = cx + (R()-0.5)*U*3.9;
    const y = groundY + U*0.03 - R()*U*0.14;
    const a = (R()-0.5)*1.7;
    const l = U*(0.09 + R()*0.15);
    g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.cos(a)*l, y+Math.sin(a)*l*0.55); g.stroke();
  }
  g.restore();

  /* ---- ground shadow ---- */
  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+6, U*1.75, U*0.16, 0, 0, TAU); g.fill(); g.restore();

  /* ---- key body points. A dog in sternal recumbency: the brisket is ON the
     ground, the shoulder rides above it, the loin dips, the croup rounds off
     over a folded hind leg. Nothing here is allowed to be a straight span. ---- */
  const hipC    = P(cx - dir*U*0.80, groundY - U*0.40 + sink);
  const chestC  = P(cx + dir*U*0.60, groundY - U*0.40 - rise*U*0.34 + sink);
  const croup   = P(hipC.x - dir*U*0.26, hipC.y - U*0.48);                          // top of the rump
  const rear    = P(hipC.x - dir*U*0.64, groundY - U*0.34 + sink);                  // rounded rear
  const backMid = P(cx - dir*U*0.06, groundY - U*0.68 - rise*U*0.20 + sink - br);   // loin, dipped
  const withers = P(chestC.x + dir*U*0.04, chestC.y - U*0.52);                      // highest point
  const chestFr = P(chestC.x + dir*U*0.46, chestC.y + U*0.06);
  const brisket = P(chestC.x + dir*U*0.30, groundY - U*0.05 - rise*U*0.24);
  const bellyMid= P(cx - dir*U*0.02, groundY - U*0.22 + br*0.4);                    // starved tuck — breaks the ground span
  const rumpBot = P(hipC.x - dir*U*0.40, groundY - U*0.06);

  /* ---- TAIL: slack on the litter, or a long arc up and back ---- */
  const swing = Math.sin(t*7.0) * o.wag;
  const tl = o.tail;
  const tB = P(hipC.x - dir*U*0.44, croup.y + U*0.14);
  const tT = P(tB.x - dir*U*lerp(0.58,0.30,tl) + swing*U*0.26, tB.y + U*lerp(0.62,-0.80,tl));
  const tC = P(tB.x - dir*U*lerp(0.40,0.56,tl) + swing*U*0.13, tB.y + U*lerp(0.24,-0.20,tl));
  pen.limb(()=>{ g.moveTo(tB.x,tB.y); g.quadraticCurveTo(tC.x,tC.y,tT.x,tT.y); }, T_TAIL(), U*0.070);

  /* ---- FAR legs (drawn first, darker so they recede) ---- */
  const fOff = dir*U*0.13;
  drawLeg(pen, P(hipC.x-fOff+dir*U*0.10, hipC.y+U*0.14), P(hipC.x-fOff+dir*U*0.24, groundY-U*0.22),
          P(hipC.x-fOff+dir*U*0.54, groundY-U*0.05), U*0.096, T_LEGF());
  {
    const sh = P(chestC.x + dir*U*0.10 - fOff, chestC.y + U*0.16);
    const elE = P(sh.x + dir*U*0.44, groundY - U*0.13), pwE = P(sh.x + dir*U*1.00, groundY - U*0.04);
    const elP = P(sh.x + dir*U*0.12, groundY - U*0.50), pwP = P(sh.x + dir*U*0.34, groundY - U*0.05);
    drawLeg(pen, sh, P(lerp(elE.x,elP.x,rise), lerp(elE.y,elP.y,rise)),
                     P(lerp(pwE.x,pwP.x,rise), lerp(pwE.y,pwP.y,rise)), U*0.092, T_LEGF());
  }

  /* ---- BARREL ---- */
  pen.paint(()=>{
    g.moveTo(croup.x, croup.y);
    g.quadraticCurveTo(cx - dir*U*0.50, backMid.y - U*0.02, backMid.x, backMid.y);      // croup -> dipped loin
    g.quadraticCurveTo(cx + dir*U*0.34, backMid.y - U*0.10, withers.x, withers.y);      // loin -> withers hump
    g.quadraticCurveTo(chestC.x + dir*U*0.40, chestC.y - U*0.30, chestFr.x, chestFr.y); // shoulder -> chest front
    g.quadraticCurveTo(chestC.x + dir*U*0.46, brisket.y - U*0.26, brisket.x, brisket.y);// chest -> brisket
    g.quadraticCurveTo(cx + dir*U*0.30, groundY - U*0.06, bellyMid.x, bellyMid.y);      // up into the tuck
    g.quadraticCurveTo(hipC.x + dir*U*0.24, groundY - U*0.24, rumpBot.x, rumpBot.y);    // down to the seated rump
    g.quadraticCurveTo(rear.x - dir*U*0.10, rear.y + U*0.16, rear.x, rear.y);           // round the rear
    g.quadraticCurveTo(rear.x + dir*U*0.06, croup.y - U*0.12, croup.x, croup.y);        // rear -> croup
    g.closePath();
  }, T_COAT(), 5);

  /* ---- shoulder mass (shading only, no second contour) ---- */
  pen.fillPath(()=>{ g.ellipse(chestC.x + dir*U*0.06, chestC.y - U*0.12, U*0.32, U*0.34, 0, 0, TAU); }, T_FLANK().base);

  /* ---- the wasting: ribs over the chest wall ---- */
  for (let i=0;i<4;i++){
    const f = i/3;
    const x    = lerp(chestC.x - dir*U*0.06, cx - dir*U*0.02, f);
    const yTop = lerp(chestC.y - U*0.30, groundY - U*0.62 + sink, f) - br*0.5;
    const yBot = groundY - U*0.20;
    pen.ink(()=>{ g.moveTo(x, yTop); g.quadraticCurveTo(x - dir*U*0.19, (yTop+yBot)*0.5, x - dir*U*0.02, yBot); }, 3.2);
  }
  // croup slope + the hollow flank hook — short arcs, never a horizontal span
  pen.ink(()=>{ g.moveTo(croup.x + dir*U*0.06, croup.y + U*0.10);
                g.quadraticCurveTo(croup.x + dir*U*0.34, croup.y + U*0.02, croup.x + dir*U*0.52, backMid.y + U*0.10); }, 2.8);
  pen.ink(()=>{ g.moveTo(hipC.x + dir*U*0.44, groundY - U*0.70 + sink);
                g.quadraticCurveTo(hipC.x + dir*U*0.30, hipC.y + U*0.06, hipC.x + dir*U*0.44, groundY - U*0.24); }, 3.2);

  /* ---- the folded NEAR hind leg: a small thigh disc with the shank and
     paw coming clear of it forward, so the fold reads instead of mushing ---- */
  pen.paint(()=>{ g.ellipse(hipC.x + dir*U*0.02, hipC.y - U*0.06, U*0.34, U*0.25, -dir*0.38, 0, TAU); }, T_FLANK(), 4);
  drawLeg(pen, P(hipC.x + dir*U*0.24, hipC.y + U*0.08), P(hipC.x + dir*U*0.36, groundY - U*0.26),
          P(hipC.x + dir*U*0.70, groundY - U*0.05), U*0.105, T_LEGN());

  /* ---- NECK: a tapering wedge from the withers up to the head base ---- */
  const HCdown = P(chestC.x + dir*U*0.94, groundY - U*0.24 + sink);
  const HCup   = P(chestC.x + dir*U*0.60, chestC.y - U*1.10);
  const HC = P(lerp(HCdown.x, HCup.x, o.headLift), lerp(HCdown.y, HCup.y, o.headLift));
  const hr = U*0.33;
  pen.paint(()=>{
    g.moveTo(withers.x - dir*U*0.08, withers.y + U*0.05);
    g.quadraticCurveTo(lerp(withers.x,HC.x,0.5) - dir*hr*0.40, lerp(withers.y,HC.y,0.5) - U*0.10,
                       HC.x - dir*hr*0.52, HC.y - hr*0.40);                       // up the nape
    g.lineTo(HC.x - dir*hr*0.06, HC.y + hr*0.52);                                 // throat at the head
    g.quadraticCurveTo(lerp(chestFr.x,HC.x,0.55) + dir*U*0.02, lerp(chestFr.y,HC.y,0.5) + U*0.16,
                       chestFr.x, chestFr.y);                                     // down the throat
    g.closePath();
  }, T_COAT(), 4.5);

  /* ---- HEAD in its own rotated frame ---- */
  const tilt = lerp(0.62, -0.06, o.headLift);
  g.save(); g.translate(HC.x, HC.y); g.rotate(tilt);
  drawHead(pen, hr, dir, o);
  // near ear last, over the skull
  drawEar(pen, hr, dir, o.earDrop, false);
  g.restore();

  /* ---- NEAR foreleg (over the body): stretched out, or propped to rise ---- */
  const shN = P(chestC.x + dir*U*0.14, chestC.y + U*0.18);
  const elE = P(shN.x + dir*U*0.48, groundY - U*0.12), pwE = P(shN.x + dir*U*1.10, groundY - U*0.04);
  const elP = P(shN.x + dir*U*0.14, groundY - U*0.48), pwP = P(shN.x + dir*U*0.40, groundY - U*0.05);
  const elN = P(lerp(elE.x,elP.x,rise), lerp(elE.y,elP.y,rise));
  const pwN = P(lerp(pwE.x,pwP.x,rise), lerp(pwE.y,pwP.y,rise));
  drawLeg(pen, shN, elN, pwN, U*0.105, T_LEGN());

  /* ---- scent chevrons drifting in to the nose (scent state) ---- */
  if (o.scent > 0.5){
    const c = Math.cos(tilt), s = Math.sin(tilt);
    const nx = hr*1.40, ny = hr*0.06;
    const nose = P(HC.x + nx*c - ny*s, HC.y + nx*s + ny*c);
    for (let i=0;i<3;i++){
      const d = U*(0.34 + i*0.26), a = U*(0.11 + i*0.055);
      pen.ink(()=>{ g.moveTo(nose.x + dir*d, nose.y - a);
                    g.quadraticCurveTo(nose.x + dir*(d + U*0.11), nose.y, nose.x + dir*d, nose.y + a); }, 3.2);
    }
  }

  /* ---- effort ticks at the propped elbow (failed-rise) ---- */
  if (o.strain > 0.5){
    for (let i=0;i<3;i++){
      const dy = (i-1)*U*0.13;
      pen.ink(()=>{ g.moveTo(elN.x - dir*U*0.26, elN.y + dy);
                    g.lineTo(elN.x - dir*U*0.42, elN.y + dy); }, 3.2);
    }
  }
}

export const asset = {
  id:"creature.argos",
  type:"CREATURE",
  name:"Argos",
  statusWord:"FAITHFUL",
  scene:"OD-B17-S03",

  /* procedural knobs */
  params:{
    age:20,                 // years — the whole point of the animal
    condition:0.14,         // 0..1 body condition; drives rib/hip prominence
    coat:"#dedacd",         // worn, half-bald light coat
    breedMass:0.86,         // a lean hunting hound, wasted
    earType:"drop",         // soft hanging flap, never pricked
    greyMuzzle:1.0,         // muzzle prints paler than the skull
    faceDir:+1,             // profile faces +x (toward the gate / his master)
    collision:true,
  },
  /* back -> front draw order the draw() honors */
  layers:["ground","litter","shadow","tail","far-hind","far-fore","barrel",
          "haunch","ribs","neck","far-ear","skull","muzzle","eye","near-ear",
          "near-hind","near-fore","scent","strain"],
  /* normalized 0..1 attachment / attention / contact anchors (preview pose) */
  anchors:{
    "argos:head":{x:.75,y:.47},
    "argos:muzzle":{x:.83,y:.51},
    "argos:eye":{x:.77,y:.45},
    "argos:ear":{x:.71,y:.50},
    "argos:withers":{x:.61,y:.53},
    "argos:flank":{x:.47,y:.59},
    "argos:hip":{x:.28,y:.60},
    "argos:tail":{x:.13,y:.55},
    "argos:forepaw":{x:.86,y:.66},
    "argos:bed":{x:.47,y:.67},
    "gaze:master":{x:.99,y:.44},      // where Odysseus stands, off-frame
    "handler:eumaeus":{x:.05,y:.68},
    "camera:argos":{x:.52,y:.55},
  },
  /* collision volume + the ground he occupies, for placement + pathing */
  zones:{
    "body:collision":{ x0:.16,y0:.50,x1:.90,y1:.69 },
    "bed:litter":{ x0:.10,y0:.62,x1:.92,y1:.70 },
    walkable:{ x0:.02,y0:.70,x1:.98,y1:.96 },
  },
  states:{
    initial:"neglected",
    nodes:{
      neglected:{     preview:{ pose:"neglected",   t:0.0 } },
      scent:{         preview:{ pose:"scent",       t:0.3 } },
      recognize:{     preview:{ pose:"recognize",   t:0.2 } },
      wag:{           preview:{ pose:"wag",         t:0.5 } },
      "failed-rise":{ preview:{ pose:"failed-rise", t:0.4 } },
      death:{         preview:{ pose:"death",       t:0.0 } },
    },
    edges:[
      ["neglected","scent"],["scent","recognize"],["recognize","wag"],
      ["wag","failed-rise"],["failed-rise","wag"],["wag","death"],
      ["recognize","failed-rise"],["failed-rise","death"],["scent","neglected"],
    ],
  },
  channels:["pose","headLift","earDrop","tail","wag","rise","breath","eye","jaw","settle","scent","strain","t"],

  preview:()=>({ pose:"recognize", t:0.2, status:"FAITHFUL", progress:.18 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
