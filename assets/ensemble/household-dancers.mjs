/* ensemble.household-dancers — the loyal servants ordered to fake a wedding.
   ENSEMBLE asset (Book XXIII, OD-B23-S03). Odysseus tells the house to strike up
   a dance so the town outside hears a bridal, not a slaughter. This is that group:
   ONE separable member template (drawMember) instanced N times deterministically
   across three depth bands, stamping and clapping an audible rhythm that leaves
   the house through the courtyard door — while a few of them keep breaking their
   heads round toward the guarded floor and the doors.

   The two halves of the performance are the two halves of the rig:
     · RHYTHM  — `beat` phase drives the stamped foot + the clapped hands, and
                 the strike rings + the arcs escaping through the doorway.
     · SECRET  — `secret` sets how far each member's head is turned off the dance
                 (toward the guarded floor / the doors), and the REACTION-WAVE
                 (`wave` + `waveLag`) sweeps left→right putting faces back on the
                 mask, member by member. wave=0 → the house is visibly hiding
                 something; wave=1 → nine dancers and nothing else to see.
   Also exposes formation (line | ring | rows), density, attention (pull toward
   the courtyard door), depth (foreground / background / all) and spread.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine dotify
   POST pass supplies the halftone. No named character is baked in — these are an
   interchangeable household. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const POSES = ["stamp","clap","link","turn","sway"];

const params = {
  formation:"line",      // line | ring | rows
  beat:0.85,             // rhythm phase: 0/1 = foot strikes + hands meet, .5 = airborne/open
  secret:1.0,            // 0 = nobody breaks the dance .. 1 = the marked members look away
  wave:0.34,             // composure front, 0 = left edge .. 1 = swept every member
  waveLag:0.75,          // per-member lag spread of that front across the floor
  attention:0.8,         // pull of the courtyard door on the turned heads
  density:1.0,           // 1 = all three bands .. 0 = front band only
  depth:"all",           // all | foreground | background
  spread:1.0,            // lateral width of the floor pattern
  showDoors:true,        // the two door slabs at the back of the hall
  showSound:true,        // strike rings + the rhythm leaving by the courtyard door
  showGuardedFloor:true, // the hatched patch of floor nobody dances over
  door:{ x:0.795, y:0.345 }, // the courtyard door — where the sound (and the gaze) goes
};

/* ---- member roster: one template, three depth bands, deterministic ----
   band 0 = back (small, light) .. 2 = front (large, dark)
   glance = this member's share of the SECRET (0 = on the dance, 1 = fully off it) */
const MEMBERS = [
  // back band — a linked chain across the far floor. flips ALTERNATE so the
  // joined hands zigzag instead of ruling one bar across the frame.
  { key:"b1", band:0, x:0.17, dy: 0.000, flip: 1, pose:"link",  robe:true,  dark:false, glance:0.00 },
  { key:"b2", band:0, x:0.43, dy:-0.020, flip:-1, pose:"link",  robe:false, dark:true,  glance:0.00 },
  { key:"b3", band:0, x:0.69, dy: 0.014, flip: 1, pose:"link",  robe:true,  dark:false, glance:0.85 },
  // mid band
  { key:"m1", band:1, x:0.28, dy: 0.000, flip: 1, pose:"stamp", robe:false, dark:true,  glance:0.00 },
  { key:"m2", band:1, x:0.55, dy:-0.016, flip:-1, pose:"turn",  robe:true,  dark:false, glance:1.00 },
  { key:"m3", band:1, x:0.83, dy: 0.012, flip:-1, pose:"clap",  robe:false, dark:false, glance:0.30 },
  // front band — the near half of the line, big and loud
  { key:"f1", band:2, x:0.21, dy: 0.000, flip: 1, pose:"stamp", robe:true,  dark:false, glance:0.00 },
  { key:"f2", band:2, x:0.51, dy:-0.022, flip: 1, pose:"clap",  robe:false, dark:true,  glance:0.55 },
  { key:"f3", band:2, x:0.80, dy: 0.008, flip:-1, pose:"stamp", robe:true,  dark:false, glance:0.00 },
];

/* band geometry: footline as a fraction of H, member unit as a fraction of H */
const BANDS = [
  { y:0.548, s:0.185, garmLvl:3, hairLvl:5 },
  { y:0.712, s:0.245, garmLvl:4, hairLvl:5 },
  { y:0.930, s:0.315, garmLvl:4, hairLvl:6 },
];

/* ============================================================
   POSE PRESETS — all fields in UNIT space (multiplied by s inside drawMember).
     lean      torso-top x lean            lift    whole-figure rise
     footF/footB {x,y} foot targets        armF/armB hand direction from shoulder
     billow    hem trailing x              headDX / headUp
     clap      draw the hands-meeting burst
   F = facing (+1 right / -1 left). k = beat energy for this pose.
   ============================================================ */
function poseFor(pose, F, beat){
  const air    = Math.sin(clamp01(beat)*Math.PI);       // 1 = mid-air / hands open
  const strike = 1-air;                                 // 1 = foot down / hands met
  const P = {
    lean:0, lift:0, billow:0, headDX:0, headUp:0, clap:0, strike,
    footF:{x:F*0.09,y:0}, footB:{x:-F*0.09,y:0},
    armB:{x:-F*0.18,y:0.62}, armF:{x:F*0.18,y:0.62},
  };
  if (pose==="stamp"){
    P.lift  = 0.012*air;
    P.lean  = F*0.025;
    P.billow=-F*0.045*air;
    P.footF = { x:F*0.14, y:-0.24*air };                // driven knee, foot cocked high
    P.footB = { x:-F*0.11, y:0 };
    P.armF  = { x:F*0.34, y:-0.24 };
    P.armB  = { x:-F*0.30, y:0.20 };
    P.headUp= 0.012*air;
  } else if (pose==="clap"){
    P.footF = { x:F*0.11, y:0 };
    P.footB = { x:-F*0.12, y:0 };
    const gap = 0.07+0.30*air;                           // hands apart at the top of the beat
    P.armF  = { x:F*0.30, y: 0.03-gap };                 // both arms forward to ONE point,
    P.armB  = { x:F*0.30, y: 0.03+gap };                 // closing as the beat lands
    P.clap  = strike;
    P.lean  = F*0.012;
  } else if (pose==="link"){
    P.armF  = { x:F*0.58, y:-0.22 };                     // one arm up to a neighbour
    P.armB  = { x:-F*0.56, y: 0.12 };                    // the other down to the next

    P.footF = { x:F*0.17, y:-0.07*air };                 // crossing step
    P.footB = { x:-F*0.06, y:0 };
    P.billow= F*0.05*air;
    P.lean  = F*0.02;
  } else if (pose==="turn"){
    P.lean  =-F*0.075;
    P.billow= F*0.13;
    P.footF = { x:F*0.19, y:0 };
    P.footB = { x:-F*0.05, y:0 };
    P.armF  = { x:F*0.30, y:0.30 };
    P.armB  = { x:-F*0.42, y:-0.14 };
    P.headDX=-F*0.035;
  } else { // sway
    P.footF = { x:F*0.10, y:0 };
    P.footB = { x:-F*0.10, y:0 };
    P.armF  = { x:F*0.20, y:0.34 };
    P.armB  = { x:-F*0.18, y:0.38 };
  }
  return P;
}

/* ============================================================
   MEMBER TEMPLATE — one household dancer, solid grays + hard contour.
   robe=true → long chiton to the ankle; robe=false → short working tunic.
   ============================================================ */
function drawMember(pen, g, rec){
  const { cx, groundY, s, P, look } = rec;
  const F     = look.F;
  const garm  = toneSolid(inkLevel(look.garmLvl));
  const garm2 = toneSolid(inkLevel(Math.min(6, look.garmLvl+1)));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(look.hairLvl));
  const cw    = Math.max(2, s*0.020);

  const lift  = P.lift*s;
  const footY = groundY - lift;
  const hipY  = footY - s*0.34;
  const shoY  = hipY - s*0.30;
  const shoW  = s*0.24;
  const headR = s*0.108;
  const neckX = cx + P.lean*s;
  const long  = !!look.robe;
  const hemW  = long ? s*0.46 : s*0.40;
  const hemY  = long ? (footY - s*0.05) : (hipY + (footY-hipY)*0.44);
  const bill  = P.billow*s;

  const footFX = cx + P.footF.x*s, footFY = footY + P.footF.y*s;
  const footBX = cx + P.footB.x*s, footBY = footY + P.footB.y*s;

  // ---- ground shadow ----
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, groundY+s*0.012, hemW*0.46, s*0.032, 0,0,7); g.fill();

  // ---- BACK LEG (behind the garment) ----
  drawLeg(pen,g, cx-shoW*0.15, hipY, footBX, footBY, -F*s*0.045, skin, Math.max(3,s*0.048), cw);
  // ---- BACK ARM ----
  drawArm(pen,g, {x:neckX-F*shoW*0.44, y:shoY+s*0.028}, P.armB, s, skin, garm2, Math.max(3,s*0.046), cw);

  // ---- GARMENT: shoulders -> hem, billowing with the turn ----
  pen.paint(()=>{
    g.moveTo(neckX-shoW/2, shoY);
    g.lineTo(neckX+shoW/2, shoY);
    g.lineTo(cx+hemW/2+bill, hemY);
    g.lineTo(cx-hemW/2+bill*0.55, hemY);
    g.closePath();
  }, garm, cw);
  // sash + folds (one fold on a tunic, two on a long chiton)
  pen.seam(()=>{ g.moveTo(neckX-shoW*0.50, shoY+s*0.185); g.lineTo(neckX+shoW*0.50, shoY+s*0.185); }, cw*0.8);
  pen.seam(()=>{ g.moveTo(neckX+bill*0.16, shoY+s*0.22); g.lineTo(cx+bill*0.80, hemY); }, cw*0.5);
  if (long) pen.seam(()=>{ g.moveTo(neckX-shoW*0.24, shoY+s*0.24); g.lineTo(cx-hemW*0.26+bill*0.4, hemY); }, cw*0.45);

  // ---- FRONT LEG (over the hem for a tunic; only the shin below a chiton) ----
  if (!long){
    drawLeg(pen,g, cx+shoW*0.15, hipY, footFX, footFY, F*s*0.05, skin, Math.max(3,s*0.052), cw);
  } else {
    const ankleTopY = Math.min(hemY, footFY - s*0.02);
    drawLeg(pen,g, cx+shoW*0.10, ankleTopY, footFX, footFY, F*s*0.02, skin, Math.max(3,s*0.048), cw);
  }

  // ---- NECK + HEAD ----
  const hx = neckX + P.headDX*s + look.turnDX*s;
  const hy = shoY - headR*1.06 - P.headUp*s;
  pen.limb(()=>{ g.moveTo(neckX, shoY+s*0.005); g.lineTo(hx, hy+headR*0.62); }, skin, s*0.048);
  pen.paint(()=>{ g.ellipse(hx - look.turnDX*s*0.4, hy+headR*0.14, headR*1.06, headR*1.18, 0,0,7); }, hair, cw*0.8);
  pen.paint(()=>{ g.ellipse(hx, hy, headR*0.88, headR, 0,0,7); }, skin, cw);
  drawFace(g, hx, hy, headR, look.faceF);
  if (long) drawHeadwrap(pen, g, hx, hy, headR, garm2, cw);

  // ---- FRONT ARM ----
  const handF = drawArm(pen,g, {x:neckX+F*shoW*0.44, y:shoY+s*0.028}, P.armF, s, skin, garm2, Math.max(3,s*0.046), cw);

  // ---- CLAP: the hands meet and the burst reads as sound ----
  if (P.clap>0.15){
    g.strokeStyle=INK; g.globalAlpha=0.42*P.clap; g.lineWidth=Math.max(1.4,s*0.012); g.lineCap="round";
    for(let i=0;i<3;i++){
      const a = -0.9 + i*0.9;
      g.beginPath();
      g.moveTo(handF.x + Math.cos(a)*s*0.05, handF.y + Math.sin(a)*s*0.05);
      g.lineTo(handF.x + Math.cos(a)*s*0.10, handF.y + Math.sin(a)*s*0.10);
      g.stroke();
    }
    g.globalAlpha=1;
  }
  // ---- STRIKE: the stamped foot lands and rings the floor ----
  if (look.rings>0.12){
    g.strokeStyle=INK; g.globalAlpha=0.30*look.rings; g.lineWidth=Math.max(1.2,s*0.010);
    for(let i=0;i<2;i++){
      const r = s*(0.10+i*0.085);
      g.beginPath(); g.ellipse(footFX, groundY+s*0.008, r, r*0.30, 0, Math.PI*1.05, Math.PI*1.95); g.stroke();
    }
    g.globalAlpha=1;
  }
  return { head:{x:hx,y:hy}, handF, handB:{x:neckX-F*shoW*0.44, y:shoY+s*0.028} };
}

function drawFace(g, hx, hy, headR, faceF){
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(hx+faceF*headR*0.30, hy-headR*0.05, headR*0.12, headR*0.15, 0,0,7); g.fill();
  g.strokeStyle=INK; g.lineWidth=Math.max(1.4,headR*0.10); g.lineCap="round";
  g.beginPath(); g.moveTo(hx+faceF*headR*0.52, hy+headR*0.08); g.lineTo(hx+faceF*headR*0.80, hy+headR*0.34); g.stroke();
}

/* a servant's head-wrap: a light band over the crown, contoured */
function drawHeadwrap(pen, g, hx, hy, headR, tone, cw){
  pen.paint(()=>{
    g.moveTo(hx-headR*1.02, hy-headR*0.12);
    g.quadraticCurveTo(hx, hy-headR*1.62, hx+headR*1.02, hy-headR*0.12);
    g.quadraticCurveTo(hx, hy-headR*0.62, hx-headR*1.02, hy-headR*0.12);
    g.closePath();
  }, tone, cw*0.8);
}

/* two-segment arm reaching to a hand target = shoulder + dir*reach*s */
function drawArm(pen,g, sh, target, s, skin, sleeve, thick, cw){
  const n = Math.hypot(target.x, target.y)||1;
  const dx = target.x/n, dy = target.y/n;
  const reach = s*0.29;
  const hand = { x: sh.x + dx*reach, y: sh.y + dy*reach };
  const el   = { x: sh.x + dx*reach*0.55 - dy*reach*0.10, y: sh.y + dy*reach*0.55 + dx*reach*0.10 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, sleeve, thick);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hand.x,hand.y); }, skin, thick*0.8);
  pen.paint(()=>{ g.arc(hand.x,hand.y, s*0.025, 0,7); }, skin, cw*0.7);
  return hand;
}

/* two-segment leg hip->foot with a knee bend offset + a sandal */
function drawLeg(pen,g, hipX, hipY, footX, footY, bend, skin, thick, cw){
  const kneeX = (hipX+footX)/2 + bend;
  const kneeY = (hipY+footY)/2;
  pen.limb(()=>{ g.moveTo(hipX,hipY); g.lineTo(kneeX,kneeY); }, skin, thick);
  pen.limb(()=>{ g.moveTo(kneeX,kneeY); g.lineTo(footX,footY); }, skin, thick*0.9);
  pen.paint(()=>{ g.ellipse(footX + (footX-kneeX>0?1:-1)*thick*0.4, footY, thick*0.9, thick*0.42, 0,0,7); },
            toneSolid(inkLevel(4)), cw*0.7);
}

/* world position of a member's hand / head — the same arithmetic drawMember
   uses, exposed so the chain connectors and the sightlines land on the art. */
function bodyPoints(rec){
  const { cx, groundY, s, P } = rec;
  const footY = groundY - P.lift*s;
  const hipY  = footY - s*0.34;
  const shoY  = hipY - s*0.30;
  const neckX = cx + P.lean*s;
  const headR = s*0.108;
  return { footY, hipY, shoY, neckX, shoW:s*0.24, headR,
           headY: shoY - headR*1.06 - P.headUp*s };
}
function handWorld(rec, side){
  const { neckX, shoY, shoW } = bodyPoints(rec);
  const F = rec.look ? rec.look.F : rec.m.flip, s = rec.s;
  const t = side==="F" ? rec.P.armF : rec.P.armB;
  const sh = { x: neckX + (side==="F" ? F : -F)*shoW*0.44, y: shoY + s*0.028 };
  const n = Math.hypot(t.x, t.y)||1;
  return { x: sh.x + t.x/n*s*0.29, y: sh.y + t.y/n*s*0.29 };
}

/* ============================================================
   FORMATION + the two waves — build the deterministic draw records.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const beat   = clamp01(p.beat);
  const secret = clamp01(p.secret);
  const wave   = clamp01(p.wave);
  const lag    = clamp01(p.waveLag);
  const att    = clamp01(p.attention);
  const density= clamp01(p.density);
  const spread = clamp(p.spread, 0.6, 1.3);
  const door   = { x:(p.door?.x ?? 0.86)*W, y:(p.door?.y ?? 0.30)*H };
  const strike = 1 - Math.sin(beat*Math.PI);

  // depth window + density: thinning the house culls the BACK bands first
  const minBand = Math.max(p.depth==="foreground" ? 2 : 0, Math.floor((1-density)*2.999));
  const maxBand = p.depth==="background" ? 1 : 2;
  const bandsOn = b => b>=minBand && b<=maxBand;

  const recs = [];
  for (const m of MEMBERS){
    if (!bandsOn(m.band)) continue;
    const B = BANDS[m.band];
    let s = H*B.s, garmLvl = B.garmLvl, hairLvl = B.hairLvl;

    // ---- placement ----
    let cx, groundY;
    const xs = 0.5 + (m.x-0.5)*spread;
    if (p.formation==="ring"){
      const idx = MEMBERS.indexOf(m), ang = -Math.PI/2 + (idx/MEMBERS.length)*Math.PI*2;
      const depthT = clamp01((Math.sin(ang)+1)/2);        // 0 far side .. 1 near side
      cx = W*0.50 + Math.cos(ang)*W*0.34*spread;
      groundY = H*0.690 + Math.sin(ang)*H*0.190;
      // on a ring the DEPTH sets the size, not the roster band
      s = lerp(H*0.170, H*0.310, depthT);
      garmLvl = depthT<0.34 ? 3 : 4;
      hairLvl = depthT<0.34 ? 5 : 6;
    } else if (p.formation==="rows"){
      const inRow = MEMBERS.filter(q=>q.band===m.band), i = inRow.indexOf(m);
      cx = lerp(W*0.16, W*0.84, inRow.length>1 ? i/(inRow.length-1) : 0.5);
      cx = W*0.5 + (cx-W*0.5)*spread;
      groundY = H*BANDS[m.band].y;
    } else { // line — the authored chain, each member off its neighbour's footline
      cx = xs*W;
      groundY = H*(B.y + (m.dy||0));
    }

    // ---- reaction-wave: composure sweeps left -> right and puts faces back on ----
    const a  = clamp01((wave*(1+lag) - xs*lag));
    const gl = clamp01(m.glance*secret*(1-smooth(a)));
    // a turned head drifts toward the door and shows the far side of the face
    const toDoor = Math.sign(door.x - cx) || 1;
    const turnDX = gl*att*0.055*toDoor;
    const faceF  = gl>0.45 ? toDoor : m.flip;

    const P = poseFor(m.pose, m.flip, beat);
    const rings = (m.pose==="stamp") ? strike : 0;

    const rec = { m, cx, groundY, s, P, glance:gl, door,
      look:{ F:m.flip, robe:m.robe, garmLvl:Math.min(6, garmLvl + (m.dark?1:0)),
             hairLvl, faceF, turnDX, rings, pose:m.pose } };
    rec.hands = { F:handWorld(rec,"F"), B:handWorld(rec,"B") };
    recs.push(rec);
  }
  recs.sort((x,y)=> x.groundY - y.groundY);   // back -> front
  return { recs, beat, strike, secret, wave, att, door,
           formation:p.formation,
           showDoors:p.showDoors!==false, showSound:p.showSound!==false,
           showGuardedFloor:p.showGuardedFloor!==false };
}

/* ============================================================
   THE HALL SHELL — kept deliberately light: a pale upper field, a pale floor,
   and the back wall BROKEN by two door slabs so nothing reads as a full bar.
   ============================================================ */
function drawShell(pen, g, W, H, B){
  const horizon = H*0.415;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  g.fillStyle = inkLevel(2); g.fillRect(0,horizon,W,H-horizon);

  // wall base: a DADO of separate plinth blocks. No rule is ruled across the
  // frame — the wall meets the floor in a broken run of stones.
  const DADO=[[0.00,0.085,0.020],[0.115,0.175,0.026],[0.335,0.185,0.022],
              [0.565,0.115,0.028],[0.715,0.090,0.019],[0.845,0.155,0.025]];
  for(const [x0,w,h] of DADO){
    pen.paint(()=>{ g.rect(x0*W, horizon-H*h*0.30, w*W, H*h); }, toneSolid(inkLevel(3)), 3.2);
  }

  if (B.showDoors){
    // the two doors of the hall — the courtyard door (right, standing open, the
    // one the sound goes out of) and the shut side door. Framed and panelled so
    // they break the wall instead of parking two black slabs on it.
    drawDoor(pen,g, W*0.795, horizon, W*0.135, H*0.150, true);
    drawDoor(pen,g, W*0.115, horizon, W*0.105, H*0.120, false);
    // an ACCENT threshold mark on the courtyard sill: where the rhythm exits
    g.fillStyle=ACCENT; g.fillRect(W*0.735, horizon-5, W*0.120, 5);
  }

  // wedding dressing: garland swags hung peg to peg — curved, broken spans
  drawGarlands(pen,g,W,H);

  // a broken dance-track on the floor: dashes, never a bar
  g.strokeStyle=INK; g.globalAlpha=0.20; g.lineWidth=2.6;
  for(let i=0;i<7;i++){
    const t=i/6, x=lerp(W*0.10,W*0.90,t), y=H*0.625+Math.sin(t*Math.PI*1.4)*H*0.016;
    g.beginPath(); g.moveTo(x-W*0.022,y); g.lineTo(x+W*0.022,y); g.stroke();
  }
  g.globalAlpha=1;
}

/* a door: light leaf inside a dark jamb, so it reads as an opening, not a slab */
function drawDoor(pen,g, cx, baseY, w, h, open){
  const jamb = Math.max(4, w*0.16);
  pen.paint(()=>{ g.rect(cx-w/2, baseY-h, w, h); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.rect(cx-w/2+jamb, baseY-h+jamb*0.8, w-jamb*2, h-jamb*0.8); },
            toneSolid(inkLevel(open?1:3)), 3);
  if (!open){
    pen.seam(()=>{ g.moveTo(cx, baseY-h+jamb); g.lineTo(cx, baseY-4); }, 2.4);      // leaf join
    pen.seam(()=>{ g.moveTo(cx-w/2+jamb, baseY-h*0.55); g.lineTo(cx+w/2-jamb, baseY-h*0.55); }, 2);
  } else {
    // the open leaf swung back against the jamb
    pen.paint(()=>{ g.rect(cx+w/2-jamb*1.9, baseY-h+jamb*0.8, jamb*1.5, h-jamb*0.8); },
              toneSolid(inkLevel(4)), 2.6);
  }
}

/* three hung swags across the upper wall — the house dressed for a wedding
   that is not happening. Catenary curves broken by pegs: no spanning bar. */
function drawGarlands(pen,g,W,H){
  const pegs=[0.055,0.30,0.545,0.70], y0=H*0.130;
  for(let i=0;i<pegs.length;i++){
    const px=pegs[i]*W;
    pen.paint(()=>{ g.rect(px-W*0.008, y0-H*0.016, W*0.016, H*0.026); }, toneSolid(inkLevel(5)), 2.4);
  }
  for(let i=0;i<pegs.length-1;i++){
    const ax=pegs[i]*W, bx=pegs[i+1]*W, sag=H*0.070+(i%2)*H*0.022;
    g.strokeStyle=INK; g.lineWidth=3.4; g.lineCap="round";
    g.beginPath(); g.moveTo(ax,y0); g.quadraticCurveTo((ax+bx)/2, y0+sag*2, bx, y0); g.stroke();
    // leaves: short ticks stepping along the swag
    g.lineWidth=2.4;
    for(let k=1;k<8;k++){
      const t=k/8, mt=1-t;
      const x=mt*mt*ax + 2*mt*t*((ax+bx)/2) + t*t*bx;
      const yy=mt*mt*y0 + 2*mt*t*(y0+sag*2) + t*t*y0;
      const s=(k%2?1:-1);
      g.beginPath(); g.moveTo(x,yy); g.lineTo(x+s*W*0.016, yy+H*0.014); g.stroke();
    }
  }
}

/* the patch of floor the dance is arranged to keep everyone off */
function drawGuardedFloor(pen,g,W,H){
  const cx=W*0.355, cy=H*0.868, rx=W*0.105, ry=H*0.026;
  pen.paint(()=>{ g.ellipse(cx,cy,rx,ry,0,0,7); }, toneSolid(inkLevel(4)), 4);
  g.save();
  g.beginPath(); g.ellipse(cx,cy,rx,ry,0,0,7); g.clip();
  g.strokeStyle=INK; g.globalAlpha=0.72; g.lineWidth=2.6;
  for(let i=-4;i<=4;i++){ g.beginPath(); g.moveTo(cx+i*rx*0.3-ry*1.2, cy-ry*1.2); g.lineTo(cx+i*rx*0.3+ry*1.2, cy+ry*1.2); g.stroke(); }
  g.restore(); g.globalAlpha=1;
}

/* the rhythm leaving the house: nested arcs stepping out through the doorway */
function drawSoundEscape(pen,g,W,H,B){
  const ox=B.door.x, oy=B.door.y;
  g.strokeStyle=INK; g.lineCap="round";
  for(let i=0;i<6;i++){
    const r = W*(0.075+i*0.085);
    g.globalAlpha = (0.62 - i*0.075) * (0.62+0.38*B.strike);
    g.lineWidth = Math.max(1.6, 4.0-i*0.45);
    g.beginPath(); g.arc(ox, oy, r, -Math.PI*0.78, -Math.PI*0.06); g.stroke();
    g.beginPath(); g.arc(ox, oy, r, Math.PI*0.06, Math.PI*0.30); g.stroke();
  }
  g.globalAlpha=1;
}

/* the linked chain: a hand-to-hand connector between adjacent linked members */
function drawChain(pen,g,B){
  for (const band of [0,1,2]){
    const row = B.recs.filter(r=>r.m.pose==="link" && r.m.band===band).sort((a,b)=>a.cx-b.cx);
    for (let i=0;i<row.length-1;i++){
      const A=row[i], C=row[i+1];
      if (C.cx-A.cx > A.s*2.4) continue;                    // too far apart to be joined
      // whichever of each pair's hands face each other
      const a = (A.hands.F.x > A.hands.B.x) ? A.hands.F : A.hands.B;
      const c = (C.hands.F.x < C.hands.B.x) ? C.hands.F : C.hands.B;
      const skin = toneSolid(inkLevel(2));
      pen.limb(()=>{
        g.moveTo(a.x,a.y);
        g.quadraticCurveTo((a.x+c.x)/2, (a.y+c.y)/2 + A.s*0.075, c.x, c.y);
      }, skin, Math.max(3, A.s*0.040));
    }
  }
}

/* ============================================================
   STAGE
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  drawShell(pen, g, W, H, B);
  if (B.showGuardedFloor) drawGuardedFloor(pen,g,W,H);
  if (B.showSound) drawSoundEscape(pen,g,W,H,B);

  // the household, back -> front; the chain riding over the back band
  const back = B.recs.filter(r=>r.m.band===0);
  const rest = B.recs.filter(r=>r.m.band!==0);
  for (const r of back) drawMember(pen, g, r);
  drawChain(pen, g, { ...B, recs:back });
  for (const r of rest) drawMember(pen, g, r);
  drawChain(pen, g, { ...B, recs:rest });

  // attention ticks: a short broken sightline off each turned head toward the door
  for (const r of B.recs){
    if (r.glance < 0.35) continue;
    const bp = bodyPoints(r);
    const hx = bp.neckX + (r.P.headDX + r.look.turnDX)*r.s;
    const hy = bp.headY;
    const dx = B.door.x - hx, dy = B.door.y - hy, n = Math.hypot(dx,dy)||1;
    g.strokeStyle=INK; g.globalAlpha=0.30*r.glance; g.lineWidth=Math.max(1.6, r.s*0.011); g.lineCap="round";
    for(let i=0;i<2;i++){
      const a = r.s*(0.20+i*0.28), b = a + r.s*0.16;
      g.beginPath(); g.moveTo(hx+dx/n*a, hy+dy/n*a); g.lineTo(hx+dx/n*b, hy+dy/n*b); g.stroke();
    }
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"ensemble.household-dancers",
  type:"ENSEMBLE",
  name:"Household dancers",
  statusWord:"DANCING",
  scene:"OD-B23-S03",

  params,
  // ONE separable member template, instanced deterministically across depth bands
  member:{ template:"drawMember", poses:POSES, roster:MEMBERS, bands:BANDS },
  layers:["wall","doors","floor","guarded-floor","sound","band-back","chain-back",
          "band-mid","band-front","sightlines"],
  // normalized placement / focus anchors — no baked characters
  anchors:{
    "door:courtyard":{x:.76,y:.345}, "door:side":{x:.10,y:.345},
    "sound:escape":{x:.86,y:.30},   "floor:guarded":{x:.62,y:.455},
    "band:back":{x:.44,y:.50},      "band:mid":{x:.56,y:.672},
    "band:front":{x:.51,y:.905},
    "entrance:left":{x:.04,y:.86},  "exit:right":{x:.96,y:.86},
    "camera:wide":{x:.50,y:.60},    "camera:near":{x:.50,y:.82},
  },
  zones:{ floor:{ x0:.05,y0:.40,x1:.95,y1:.97 }, chain:{ x0:.10,y0:.44,x1:.90,y1:.56 } },
  channels:["formation","beat","secret","wave","waveLag","attention","density","depth","spread"],
  states:{
    initial:"dancing",
    nodes:{
      // S03: the rhythm is up, and the secret is still visible in three faces
      "dancing":  { preview:{ beat:0.85, secret:1.0, wave:0.34, attention:0.8, formation:"line", status:"DANCING" } },
      // the beat lands: every stamped foot down, every pair of hands met
      "stamping": { preview:{ beat:0.02, secret:0.7, wave:0.5,  attention:0.6, formation:"line", status:"STAMPING" } },
      // top of the bar: feet up, hands open, the house at its loudest
      "clapping": { preview:{ beat:0.5,  secret:0.6, wave:0.6,  attention:0.5, formation:"line", status:"CLAPPING" } },
      // the chain closes and the whole floor turns as one
      "chaining": { preview:{ beat:0.7,  secret:0.4, wave:0.75, attention:0.4, formation:"ring", status:"CHAINING" } },
      // the secret shows: heads off the dance, sightlines to the doors
      "guarding": { preview:{ beat:0.85, secret:1.0, wave:0.0,  attention:1.0, formation:"line", status:"GUARDING" } },
      // the wave has swept every face back onto the mask — a wedding, nothing else
      "composed": { preview:{ beat:0.65, secret:1.0, wave:1.0,  attention:0.2, formation:"rows", status:"COMPOSED" } },
      // the house thins out: front band only
      "thinning": { preview:{ beat:0.6,  secret:0.8, wave:0.55, density:0.2, depth:"foreground", status:"THINNING" } },
    },
    edges:[
      ["dancing","stamping"],["stamping","clapping"],["clapping","dancing"],
      ["dancing","guarding"],["guarding","dancing"],
      ["dancing","chaining"],["chaining","dancing"],
      ["guarding","composed"],["composed","dancing"],
      ["dancing","thinning"],["thinning","dancing"],
    ],
  },

  // neutral preview = the rhythm up, the wave a third of the way across
  preview:()=>({ formation:"line", beat:0.85, secret:1.0, wave:0.34, waveLag:0.75,
                 attention:0.8, density:1, depth:"all", spread:1,
                 status:"DANCING", progress:0.34 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
