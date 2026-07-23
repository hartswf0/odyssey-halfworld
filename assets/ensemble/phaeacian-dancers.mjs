/* ensemble.phaeacian-dancers — a circle of young Phaeacian performers.
   ENSEMBLE asset. A repeatable group of high-skill dancers built from ONE
   separable member template (drawDancer + a pose rig) instanced N times
   deterministically around a RING. Mid-performance: one LEAPS airborne at the
   front, neighbours SPIN with streaming skirts, and a PURPLE ball flies on an
   arc from a PASSER to a CATCHER across the ring centre. Exposes formation
   (ring | line), leap / spin / pass phase channels, a ballPhase that flies the
   ball across, density (front band .. whole ring) and spread. Drawn in SOLID
   grays + hard contour; the engine dotify POST pass supplies the halftone. No
   named character is baked in — the members are an interchangeable troupe.
   Atlas OD-B08-S04 (high-skill circle performers with leap, spin, ball-pass,
   catch, formation controls). Matches the reference card look: crisp monochrome
   figures, clean contour, good tonal range. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const POSES = ["leap","spin","pass","catch","step"];

const params = {
  formation:"ring",     // ring | line
  count:8,              // members around the ring
  leap:1.0,             // leap phase amplitude (0 grounded .. 1 full airborne)
  spin:1.0,             // spin phase amplitude (0 still .. 1 full whirl)
  pass:1.0,             // pass phase amplitude (0 held .. 1 full throw extension)
  ballPhase:0.5,        // 0 = in passer's hand .. 1 = in catcher's hands
  density:1.0,          // 0 = front band only .. 1 = whole ring
  spread:1.0,           // lateral width of the ring / line
  showFloor:true,       // the round dance-floor
  showBall:true,
  center:{ x:0.50, y:0.50 },   // ring centre in normalized stage space
};

/* member roster: separable template on a deterministic list.
   slot = position index around the ring (0 = back-centre, clockwise).
   pose = the performance action this dancer holds this beat.
   The front-centre dancer LEAPS; a mid dancer PASSES to the opposite CATCHER. */
const MEMBERS = [
  { slot:0, pose:"step",  flip: 1 },   // back centre
  { slot:1, pose:"spin",  flip:-1 },   // back right
  { slot:2, pose:"pass",  flip:-1 },   // right (throws the ball across)
  { slot:3, pose:"spin",  flip:-1 },   // front right
  { slot:4, pose:"leap",  flip: 1 },   // front centre — the star, airborne
  { slot:5, pose:"catch", flip: 1 },   // front left (receives the ball)
  { slot:6, pose:"spin",  flip: 1 },   // left
  { slot:7, pose:"step",  flip:-1 },   // back left
];
const PASSER_SLOT = 2, CATCHER_SLOT = 5;

/* ============================================================
   POSE PRESETS — fields in UNIT space (× s inside drawDancer):
     lean        torso-top x lean
     lift        whole-figure airborne rise (leap)
     footF/footB {x,y} foot targets as offset from (cx, footY)
     frontArm/backArm  hand targets {x,y} = direction from shoulder
     hemY        tunic hem as fraction of hip->foot span
     billow      hem trailing x (spin/leap)
     hairX/hairY hair stream direction
     headDX/headUp
     motion      draw whirl/motion arcs (spin)
   F = facing (+1 right / -1 left). amp = {leap,spin,pass} phase amplitudes.
   ============================================================ */
function poseFor(pose, F, amp){
  const P = {
    lean:0, lift:0, hemY:0.42, billow:0, hairX:-F*0.03, hairY:0.85,
    headDX:0, headUp:0, motion:0,
    footF:{x:F*0.09,y:0}, footB:{x:-F*0.09,y:0},
    backArm:{x:-F*0.16,y:0.7}, frontArm:{x:F*0.16,y:0.7},
  };
  if (pose==="leap"){
    const k = amp.leap;
    P.lift   = 0.16*k;
    P.lean   = F*0.04;
    P.hemY   = 0.36; P.billow=-F*0.10*k;
    P.footF  = {x:F*0.16, y:-0.20*k};   // front leg kicked forward-up
    P.footB  = {x:-F*0.20, y:-0.14*k};  // back leg trailing up (split)
    P.frontArm={x:F*0.26, y:-0.72};     // both arms flung high
    P.backArm ={x:-F*0.24, y:-0.70};
    P.hairX  =-F*0.16*k; P.hairY=0.35;
    P.headUp = 0.05;
  } else if (pose==="spin"){
    const k = amp.spin;
    P.lean   = F*0.11*k;
    P.hemY   = 0.40; P.billow=F*0.16*k;        // skirt flares out with rotation
    P.footF  = {x:F*0.22, y:-0.12*k};          // one leg lifted, crossing
    P.footB  = {x:-F*0.04, y:0.01};
    P.frontArm={x:F*0.52, y:-0.02};            // arms flung wide, horizontal
    P.backArm ={x:-F*0.50, y:-0.10};
    P.hairX  =-F*0.20*k; P.hairY=0.30;
    P.headDX = F*0.04; P.motion = k;
  } else if (pose==="pass"){
    const k = amp.pass;
    P.lean   = F*0.09*k;
    P.hemY   = 0.44;
    P.footF  = {x:F*0.18, y:0};
    P.footB  = {x:-F*0.12, y:0};
    P.frontArm={x:F*0.40, y:-0.34*k - 0.10};   // lead arm thrown up-across toward centre
    P.backArm ={x:-F*0.22, y:0.30};            // counter arm low behind
    P.headDX = F*0.05; P.headUp=0.03;
  } else if (pose==="catch"){
    P.lean   =-F*0.05;
    P.hemY   = 0.44;
    P.footF  = {x:F*0.10, y:0};
    P.footB  = {x:-F*0.16, y:0};
    P.frontArm={x:F*0.20, y:-0.66};            // both arms up, reaching for the ball
    P.backArm ={x:-F*0.16, y:-0.60};
    P.headUp = 0.06;
  } else { // step / ready — gentle sway
    P.footF  = {x:F*0.10, y:0};
    P.footB  = {x:-F*0.10, y:0};
    P.frontArm={x:F*0.22, y:0.30};
    P.backArm ={x:-F*0.20, y:0.34};
    P.hemY   = 0.44;
  }
  return P;
}

/* ============================================================
   MEMBER TEMPLATE — one dancer, drawn deterministically in solid grays.
   Short athletic tunic + bare legs; the pose rig drives limbs.
   ============================================================ */
function drawDancer(pen, g, cx, groundY, s, P, look){
  const F      = look.F;
  const tunic  = toneSolid(inkLevel(look.tunicLvl));
  const tunic2 = toneSolid(inkLevel(Math.min(6, look.tunicLvl+1)));
  const skin   = toneSolid(inkLevel(2));
  const hair   = toneSolid(inkLevel(look.hairLvl));
  const cw     = Math.max(2, s*0.02);

  const lift   = P.lift*s;
  const footY  = groundY - lift;                 // body foot-line (raised when airborne)
  const hipY   = footY - s*0.34;
  const shoY   = hipY - s*0.30;
  const shoW   = s*0.25;
  const hemW   = s*0.42;
  const headR  = s*0.115;
  const neckX  = cx + P.lean*s;
  const headCy = shoY - headR*1.02;
  const hx     = neckX + P.headDX*s;
  const hy     = headCy - P.headUp*s;

  const footFX = cx + P.footF.x*s, footFY = footY + P.footF.y*s;
  const footBX = cx + P.footB.x*s, footBY = footY + P.footB.y*s;
  const hemY   = hipY + (footY-hipY)*P.hemY;

  // ground shadow (smaller + fainter when airborne)
  const air = clamp01(lift/(s*0.16));
  g.fillStyle = `rgba(0,0,0,${0.12*(1-air*0.6)})`;
  g.beginPath(); g.ellipse(cx, groundY+s*0.01, hemW*0.5*(1-air*0.3), s*0.036*(1-air*0.35), 0,0,7); g.fill();

  // ---- BACK LEG (behind tunic) ----
  drawLeg(pen,g, cx-shoW*0.16, hipY, footBX, footBY, -F*s*0.05, skin, Math.max(3,s*0.05), cw);
  // ---- BACK ARM (behind torso) ----
  drawArm(pen,g, {x:neckX-F*shoW*0.44, y:shoY+s*0.03}, P.backArm, s, skin, tunic2, Math.max(3,s*0.05), cw);

  // ---- TUNIC (shoulders -> flared short hem, may billow) ----
  const bill = P.billow*s;
  pen.paint(()=>{
    g.moveTo(neckX-shoW/2, shoY);
    g.lineTo(neckX+shoW/2, shoY);
    g.lineTo(cx+hemW/2+bill, hemY);
    g.lineTo(cx-hemW/2+bill*0.6, hemY);
    g.closePath();
  }, tunic, cw);
  // waist sash + a drape fold that leans with motion
  pen.seam(()=>{ g.moveTo(neckX-shoW*0.5, shoY+s*0.19); g.lineTo(neckX+shoW*0.5, shoY+s*0.19); }, cw*0.8);
  pen.seam(()=>{ g.moveTo(neckX+bill*0.2, shoY+s*0.22); g.lineTo(cx+bill*0.85, hemY); }, cw*0.55);

  // ---- FRONT LEG (over the tunic hem) ----
  drawLeg(pen,g, cx+shoW*0.16, hipY, footFX, footFY, F*s*0.05, skin, Math.max(3,s*0.055), cw);

  // ---- NECK + HEAD ----
  pen.limb(()=>{ g.moveTo(neckX, shoY+s*0.005); g.lineTo(hx, hy+headR*0.65); }, skin, s*0.05);
  // hair back mass
  pen.paint(()=>{ g.ellipse(hx - P.hairX*s*0.35, hy+headR*0.16, headR*1.1, headR*1.24, 0,0,7); }, hair, cw*0.85);
  // face oval
  pen.paint(()=>{ g.ellipse(hx, hy, headR*0.9, headR, 0,0,7); }, skin, cw);
  drawFace(g, hx, hy, headR, F);
  // headband (a bright ACCENT fillet — Phaeacian finery)
  drawFillet(g, hx, hy, headR, F);
  // long hair stream (trails opposite motion; drapes for still poses)
  drawHair(pen,g, hx, hy, headR, hair, P.hairX*s, P.hairY, cw);

  // ---- FRONT ARM (over torso) ----
  const frontHand = drawArm(pen,g, {x:neckX+F*shoW*0.44, y:shoY+s*0.03}, P.frontArm, s, skin, tunic2, Math.max(3,s*0.05), cw);

  // ---- MOTION ARCS for spin (light whirl streaks around the hem) ----
  if (P.motion>0.05){
    g.strokeStyle = INK; g.globalAlpha = 0.28*P.motion; g.lineWidth = Math.max(1.5,s*0.012);
    for(let i=0;i<2;i++){
      const r = hemW*(0.6+i*0.28);
      g.beginPath(); g.ellipse(cx, hemY, r, r*0.34, 0, Math.PI*(0.05+i*0.1), Math.PI*(0.8-i*0.1)); g.stroke();
    }
    g.globalAlpha = 1;
  }
  return { frontHand, headTop:{x:hx,y:hy-headR} };
}

function drawFace(g, hx, hy, headR, F){
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(hx+F*headR*0.30, hy-headR*0.04, headR*0.12, headR*0.15, 0,0,7); g.fill(); // eye
  g.strokeStyle=INK; g.lineWidth=Math.max(1.4,headR*0.10); g.lineCap="round";
  g.beginPath(); g.moveTo(hx+F*headR*0.52, hy+headR*0.10); g.lineTo(hx+F*headR*0.80, hy+headR*0.36); g.stroke(); // nose
}

function drawFillet(g, hx, hy, headR, F){
  g.strokeStyle = ACCENT; g.lineWidth = Math.max(1.8, headR*0.20); g.lineCap="round";
  g.beginPath(); g.ellipse(hx, hy-headR*0.55, headR*0.92, headR*0.5, 0, Math.PI*1.02, Math.PI*1.98); g.stroke();
}

function drawHair(pen,g, hx, hy, headR, hair, flowX, flowY, cw){
  if (Math.abs(flowX) > headR*0.6){
    // streaming: a trailing wedge of hair (spin / leap)
    pen.paint(()=>{
      g.moveTo(hx, hy-headR*0.85);
      g.lineTo(hx+flowX*1.05, hy-headR*0.5+flowY*headR*0.3);
      g.lineTo(hx+flowX*1.0, hy+headR*0.75+flowY*headR*0.5);
      g.lineTo(hx-headR*0.2, hy+headR*0.7);
      g.closePath();
    }, hair, cw*0.8);
  } else {
    // drape down the back/sides
    pen.paint(()=>{
      g.moveTo(hx-headR*0.98, hy-headR*0.1);
      g.quadraticCurveTo(hx-headR*1.0, hy+headR*0.95, hx-headR*0.35, hy+headR*1.25);
      g.lineTo(hx+headR*0.35, hy+headR*1.25);
      g.quadraticCurveTo(hx+headR*1.0, hy+headR*0.95, hx+headR*0.98, hy-headR*0.1);
      g.quadraticCurveTo(hx, hy+headR*0.35, hx-headR*0.98, hy-headR*0.1);
      g.closePath();
    }, hair, cw*0.78);
  }
}

/* two-segment arm reaching to a hand target = shoulder + dir*reach*s */
function drawArm(pen,g, sh, target, s, skin, sleeve, thick, cw){
  const n = Math.hypot(target.x, target.y)||1;
  const dx = target.x/n, dy = target.y/n;
  const reach = s*0.30;
  const hand = { x: sh.x + dx*reach, y: sh.y + dy*reach };
  const el   = { x: sh.x + dx*reach*0.55 - dy*reach*0.10, y: sh.y + dy*reach*0.55 + dx*reach*0.10 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, sleeve, thick);        // upper (sleeve)
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hand.x,hand.y); }, skin, thick*0.8);  // forearm
  pen.paint(()=>{ g.arc(hand.x,hand.y, s*0.026, 0,7); }, skin, cw*0.7);              // hand
  return hand;
}

/* two-segment leg hip->foot with a knee bend offset */
function drawLeg(pen,g, hipX, hipY, footX, footY, bend, skin, thick, cw){
  const kneeX = (hipX+footX)/2 + bend;
  const kneeY = (hipY+footY)/2;
  pen.limb(()=>{ g.moveTo(hipX,hipY); g.lineTo(kneeX,kneeY); }, skin, thick);
  pen.limb(()=>{ g.moveTo(kneeX,kneeY); g.lineTo(footX,footY); }, skin, thick*0.9);
  // simple sandal / foot
  pen.paint(()=>{ g.ellipse(footX+ (footX-kneeX>0?1:-1)*thick*0.4, footY, thick*0.9, thick*0.42, 0,0,7); }, toneSolid(inkLevel(4)), cw*0.7);
}

/* ============================================================
   FORMATION — place each member around the ring (or a line);
   returns draw records back->front + passer/catcher hand anchors.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const N = clamp(Math.round(p.count)||8, 4, 8);
  const spread = clamp(p.spread, 0.5, 1.4);
  const density = clamp01(p.density);
  const amp = { leap:clamp01(p.leap), spin:clamp01(p.spin), pass:clamp01(p.pass) };
  const cx0 = p.center.x*W, cy0 = p.center.y*H;
  const rx = W*0.35*spread, ry = H*0.175;

  // active roster (front band first when density < 1)
  const roster = MEMBERS.slice(0, N).map((m,i)=>({ ...m, i }));

  const recs = [];
  let passer=null, catcher=null;
  for (const m of roster){
    // ring slot angle: slot 0 at back-centre (top), clockwise
    const ang = -Math.PI/2 + (m.slot/N)*Math.PI*2;
    const depthT = clamp01((Math.sin(ang)+1)/2);   // 0 back .. 1 front

    if (density<1 && depthT < (1-density)*0.9) continue; // cull back band

    let cx, groundY;
    if (p.formation==="line"){
      const t = m.slot/(N-1);                        // left .. right
      cx = lerp(W*0.10, W*0.90, t);
      groundY = H*0.80 - Math.abs(t-0.5)*H*0.02;     // gentle arc line
    } else { // ring
      cx = cx0 + Math.cos(ang)*rx;
      groundY = cy0 + Math.sin(ang)*ry + H*0.155;    // feet below the ring centre-line
    }

    const s = lerp(158, 262, p.formation==="line" ? 0.55 : depthT);
    const F = m.flip;
    const P = poseFor(m.pose, F, amp);
    const tunicLvl = depthT<0.34 ? 2 : (depthT<0.7 ? 3 : 4);

    const rec = { m, cx, groundY, s, P,
      look:{ F, tunicLvl, hairLvl:5, pose:m.pose },
      depth:groundY };
    recs.push(rec);
    if (m.slot===PASSER_SLOT) passer = rec;
    if (m.slot===CATCHER_SLOT) catcher = rec;
  }
  recs.sort((a,b)=> a.groundY - b.groundY);   // back -> front
  return { recs, passer, catcher, amp,
           center:{x:cx0,y:cy0}, rx, ry, formation:p.formation,
           showFloor:p.showFloor, showBall:p.showBall, ballPhase:clamp01(p.ballPhase) };
}

/* approximate a member's lead (front) hand in world space, for the ball */
function leadHand(rec){
  const P = rec.P, s = rec.s;
  const footY = rec.groundY - P.lift*s;
  const shoY  = footY - s*0.34 - s*0.30;
  const neckX = rec.cx + P.lean*s;
  const sh = { x:neckX + rec.look.F*s*0.25*0.44, y:shoY + s*0.03 };
  const n = Math.hypot(P.frontArm.x, P.frontArm.y)||1;
  return { x: sh.x + (P.frontArm.x/n)*s*0.30, y: sh.y + (P.frontArm.y/n)*s*0.30 };
}

/* ============================================================
   STAGE — a round dance-floor + the member ring + the flying ball.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const horizon = H*0.40;

  // ---- backdrop: light upper field, faint hall floor band ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  g.fillStyle = inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
  // a faint back wall base line
  pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 3);

  // ---- the round dance-floor the ring stands on ----
  if (B.showFloor && B.formation==="ring"){
    const fx = B.center.x, fy = B.center.y + H*0.155, fr = B.rx*1.26;
    pen.paint(()=>{ g.ellipse(fx, fy, fr, B.ry*1.5, 0,0,7); }, toneSolid(inkLevel(3)), 4);
    // an inner ring line + a central medallion
    g.strokeStyle=INK; g.globalAlpha=0.4; g.lineWidth=2;
    g.beginPath(); g.ellipse(fx, fy, fr*0.7, B.ry*1.05, 0,0,7); g.stroke();
    g.globalAlpha=1;
    pen.paint(()=>{ g.ellipse(fx, fy, fr*0.12, B.ry*0.2, 0,0,7); }, toneSolid(inkLevel(4)), 2);
  }

  // ---- the flying ball, mid-pass on an arc from passer to catcher ----
  // drawn BEFORE the front dancers if it is high in the air (behind the leaper),
  // handled by z: compute now, draw over back rows, under nothing critical.
  let ball=null;
  if (B.showBall && B.passer && B.catcher){
    const a = leadHand(B.passer), b = leadHand(B.catcher);
    const t = B.ballPhase;
    const bx = lerp(a.x, b.x, t);
    const arc = -Math.sin(t*Math.PI) * H*0.30;   // high parabolic loft into the open air
    const by = lerp(a.y, b.y, t) + arc;
    ball = { x:bx, y:by, r:W*0.028, air:Math.sin(t*Math.PI) };
  }

  // ---- the dancers, back -> front ----
  for (const r of B.recs) drawDancer(pen, g, r.cx, r.groundY, r.s, r.P, r.look);
  // ---- the ball: airborne over the ring, drawn on top so it always reads ----
  if (ball) drawBall(pen,g,ball);
}

function drawBall(pen,g,ball){
  // a bright ACCENT-marked play ball with a seam cross
  pen.paint(()=>{ g.arc(ball.x, ball.y, ball.r, 0,7); }, toneSolid(inkLevel(2)), 3);
  g.fillStyle = ACCENT;
  g.beginPath(); g.arc(ball.x, ball.y, ball.r*0.32, 0,7); g.fill();
  pen.ink(()=>{ g.moveTo(ball.x-ball.r,ball.y); g.lineTo(ball.x+ball.r,ball.y);
                g.moveTo(ball.x,ball.y-ball.r); g.lineTo(ball.x,ball.y+ball.r); }, 2);
  // a faint motion trail
  g.strokeStyle=INK; g.globalAlpha=0.25; g.lineWidth=2;
  g.beginPath(); g.moveTo(ball.x-ball.r*1.6, ball.y+ball.r*0.4); g.lineTo(ball.x-ball.r*0.6, ball.y+ball.r*0.1); g.stroke();
  g.globalAlpha=1;
}

export const asset = {
  id:"ensemble.phaeacian-dancers",
  type:"ENSEMBLE",
  name:"Phaeacian dancers",
  statusWord:"PERFORMING",
  scene:"OD-B08-S04",

  params,
  // one member template + pose rig, instanced around the ring across depth
  member:{ template:"drawDancer", poses:POSES, roster:MEMBERS,
           passerSlot:PASSER_SLOT, catcherSlot:CATCHER_SLOT },
  // back -> front draw order the stage honors
  layers:["backwall","floor","dancers-back","ball","dancers-front"],
  // normalized placement / focus anchors (NOT baked characters)
  anchors:{
    "ring:centre":{x:.50,y:.585}, "floor:centre":{x:.50,y:.695},
    "slot:leaper":{x:.50,y:.86},  "slot:passer":{x:.86,y:.66},
    "slot:catcher":{x:.16,y:.86}, "ball:apex":{x:.50,y:.50},
    "entrance:left":{x:.05,y:.82}, "exit:right":{x:.95,y:.82},
    "camera:wide":{x:.50,y:.55},
  },
  // walkable ring floor
  zones:{ floor:{ x0:.10,y0:.62,x1:.90,y1:.92 }, ring:{ x0:.18,y0:.50,x1:.82,y1:.86 } },
  channels:["formation","leap","spin","pass","ballPhase","density","spread"],
  states:{
    initial:"performing",
    nodes:{
      // S04: the full circle mid-performance — leap + spins + a pass in flight
      "performing":{ preview:{ formation:"ring", leap:1, spin:1, pass:1, ballPhase:0.5, status:"PERFORMING" } },
      // the airborne beat — the leaper at apex
      "leaping":   { preview:{ formation:"ring", leap:1, spin:0.6, pass:0.4, ballPhase:0.08, status:"LEAPING" } },
      // the ball crossing the ring — passer released, catcher reaching
      "passing":   { preview:{ formation:"ring", leap:0.4, spin:0.7, pass:1, ballPhase:0.55, status:"PASSING" } },
      // the catch completes — ball in the catcher's hands
      "catching":  { preview:{ formation:"ring", leap:0.3, spin:0.6, pass:0.6, ballPhase:0.96, status:"CATCHING" } },
      // whole troupe whirling
      "spinning":  { preview:{ formation:"ring", leap:0.3, spin:1, pass:0.3, ballPhase:0.05, status:"SPINNING" } },
      // presentation line / bow (formation change)
      "line-up":   { preview:{ formation:"line", leap:0.2, spin:0.2, pass:0.2, ballPhase:0.05, showFloor:false, status:"PRESENTING" } },
    },
    edges:[
      ["performing","leaping"],["performing","passing"],["performing","spinning"],
      ["passing","catching"],["catching","performing"],
      ["leaping","performing"],["spinning","performing"],
      ["performing","line-up"],["line-up","performing"],
    ],
  },

  // neutral preview = the full circle mid-performance (leap + spins + ball in flight)
  preview:()=>({ formation:"ring", leap:1, spin:1, pass:1, ballPhase:0.5,
                 density:1, spread:1, status:"PERFORMING", progress:0.3 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
