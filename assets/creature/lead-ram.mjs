/* creature.lead-ram — the largest prize ram of Polyphemus' flock, the one
   Odysseus rides out clinging to its belly.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. A SINGLE big-bodied ram in profile facing right (+dir):
     · a thick woolly FLEECE (a large scalloped wool blob + shaded underside)
     · four short dark legs (upper/lower segments + a split hoof block)
     · a dark wedge HEAD with eye, floppy ear, and a pair of BIG curled ram
       HORNS (a bold forward-coiling spiral, the read that names this creature)
     · ODYSSEUS clinging to the UNDERSIDE — belly-up in the leg-cage, hands and
       feet hooked up into the fleece (the "belly anchor"), drawn between body
       and the near legs so he reads as tucked underneath, never a baked figure.
   States (channels drive them): walk (filing to the cave mouth) / pause-under-
   hand (halted, Polyphemus' giant HAND pressing down on the fleece, Odysseus
   cinched flat and still) / run (a frozen bound, legs splayed, man clinging
   tight) / release (out in the open — ram head down, Odysseus dropping free of
   the belly). Legs carry stride + gallop foot targets so gait reads frozen.
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B09-S10 — the largest animal with the underside anchor and the
   extended pause beneath the Cyclops' searching hand. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- tone levels (flat grays; POST turns them into dots).
   The fleece reads LIGHT and cloudy so the dark face / legs / big horns pop,
   and the mid-tone man tucked underneath separates from the pale wool. ---- */
const T_FLEECE  = ()=> toneSolid(inkLevel(2));   // woolly fleece (light)
const T_FLEECE2 = ()=> toneSolid(inkLevel(3));   // shaded underside of fleece
const T_FACE    = ()=> toneSolid(inkLevel(6));   // dark ram face
const T_EAR     = ()=> toneSolid(inkLevel(5));   // floppy ear
const T_LEGN    = ()=> toneSolid(inkLevel(6));   // near legs (bold)
const T_LEGF    = ()=> toneSolid(inkLevel(5));   // far legs (dimmer)
const T_HOOF    = ()=> toneSolid(inkLevel(7));   // hard split hoof
const T_HORN    = ()=> toneSolid(inkLevel(5));   // near curl-horn
const T_HORNF   = ()=> toneSolid(inkLevel(4));   // far curl-horn (behind)
const T_TAIL    = ()=> toneSolid(inkLevel(3));
const T_SKIN    = ()=> toneSolid(inkLevel(4));   // Odysseus' skin/arms
const T_TUNIC   = ()=> toneSolid(inkLevel(6));   // his tunic (darker, so he reads)
const T_HAIR    = ()=> toneSolid(inkLevel(7));   // hair/beard
const T_HAND    = ()=> toneSolid(inkLevel(5));   // Polyphemus' searching hand
const T_HANDDK  = ()=> toneSolid(inkLevel(6));

/* a scalloped WOOL blob: a closed bumpy outline around an ellipse — the read
   that makes the body woolly. bumps = fleece lobes; depth pushes each out. */
function woolBlob(g, cx, cy, rx, ry, bumps, depth=0.26, seed=0){
  const pts=[];
  for(let i=0;i<bumps;i++){
    const a=(i/bumps)*TAU;
    const j = 1 + (((i*7+seed*13)%5)-2)*0.035;    // slight deterministic per-lobe jitter
    pts.push({x:cx+Math.cos(a)*rx*j, y:cy+Math.sin(a)*ry*j});
  }
  g.moveTo(pts[0].x, pts[0].y);
  for(let i=0;i<bumps;i++){
    const q=pts[(i+1)%bumps];
    const a2 = (i+0.5)/bumps*TAU;
    const b = Math.min(rx,ry)*depth;
    g.quadraticCurveTo(cx+Math.cos(a2)*(rx+b), cy+Math.sin(a2)*(ry+b), q.x, q.y);
  }
  g.closePath();
}

/* a BIG ram curl-horn: a bold forward-coiling spiral tapering from the poll.
   `off` nudges the pair apart; tone/wScale distinguish near vs far horn. */
function drawRamHorn(pen, HC, hr, dir, off, tone, wScale){
  const g = pen.ctx;
  const cxh = HC.x - dir*hr*0.24 + off, cyh = HC.y - hr*0.10;
  // stroke the spiral in two passes so the outer coil is visibly thicker
  const spiral = (wfrac, seg0, seg1)=>{
    pen.limb(()=>{
      let first=true;
      for(let i=seg0;i<=seg1;i++){
        const f=i/30;
        const a = -Math.PI*0.10 + f*TAU*1.30;           // ~1.3 coils, curling forward
        const r = hr*1.30*(1-f*0.60);
        const x = cxh + dir*Math.cos(a)*r;
        const y = cyh + Math.sin(a)*r;
        if(first){ g.moveTo(x,y); first=false; } else g.lineTo(x,y);
      }
    }, tone, hr*wfrac*wScale);
  };
  spiral(0.62, 0, 15);     // thick base coil
  spiral(0.40, 15, 30);    // tapered tip coil
  // growth ridges across the coil
  pen.ink(()=>{
    for(let i=1;i<=5;i++){
      const f=i/6, a=-Math.PI*0.10+f*TAU*1.30, r=hr*1.30*(1-f*0.60);
      const x=cxh+dir*Math.cos(a)*r, y=cyh+Math.sin(a)*r;
      const nx=Math.cos(a+Math.PI/2), ny=Math.sin(a+Math.PI/2), tk=hr*0.30*(1-f*0.5);
      g.moveTo(x-nx*tk, y-ny*tk); g.lineTo(x+nx*tk, y+ny*tk);
    }
  }, 2);
}

/* the ram HEAD: dark wedge skull, floppy ear, eye + nostril, both curl-horns.
   headDrop tips the whole head geometry (handled by caller placing HC). */
function drawRamHead(pen, HC, hr, dir, { gaze=0 }={}){
  const g = pen.ctx;

  // ---- FAR horn first (behind the skull) ----
  drawRamHorn(pen, HC, hr, dir, -dir*hr*0.20, T_HORNF(), 1.0);

  // ---- far ear stub behind the face ----
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.30, HC.y-hr*0.18);
    g.quadraticCurveTo(HC.x-dir*hr*1.05, HC.y-hr*0.02, HC.x-dir*hr*1.00, HC.y+hr*0.42);
    g.quadraticCurveTo(HC.x-dir*hr*0.50, HC.y+hr*0.18, HC.x-dir*hr*0.28, HC.y+hr*0.08);
    g.closePath();
  }, T_EAR(), 3);

  // ---- dark wedge FACE (poll -> Roman nose -> jaw) ----
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.42, HC.y-hr*0.72);                   // poll (top back)
    g.quadraticCurveTo(HC.x+dir*hr*0.55, HC.y-hr*0.66,          // brow
                       HC.x+dir*hr*1.02, HC.y-hr*0.14);         // nose bridge
    g.quadraticCurveTo(HC.x+dir*hr*1.55, HC.y+hr*0.16,          // Roman-nose muzzle
                       HC.x+dir*hr*1.44, HC.y+hr*0.56);         // nose tip
    g.quadraticCurveTo(HC.x+dir*hr*1.24, HC.y+hr*0.82,          // lower lip
                       HC.x+dir*hr*0.82, HC.y+hr*0.80);         // chin
    g.quadraticCurveTo(HC.x+dir*hr*0.05, HC.y+hr*0.92,          // jaw
                       HC.x-dir*hr*0.30, HC.y+hr*0.44);         // throat
    g.closePath();
  }, T_FACE(), 4);

  // ---- NEAR horn (over the skull, bolder) ----
  drawRamHorn(pen, HC, hr, dir, dir*hr*0.02, T_HORN(), 1.15);

  // ---- near floppy ear hanging forward in front of the horn base ----
  pen.paint(()=>{
    g.moveTo(HC.x-dir*hr*0.02, HC.y-hr*0.20);
    g.quadraticCurveTo(HC.x+dir*hr*0.70, HC.y+hr*0.04, HC.x+dir*hr*0.62, HC.y+hr*0.52);
    g.quadraticCurveTo(HC.x+dir*hr*0.30, HC.y+hr*0.22, HC.x+dir*hr*0.05, HC.y+hr*0.04);
    g.closePath();
  }, T_EAR(), 3);

  // ---- eye (bright ring + dark pupil on the dark face) + nostril + mouth ----
  const ex = HC.x+dir*hr*0.46, ey = HC.y-hr*0.06 + gaze*hr*0.2;
  g.fillStyle="#f0f0ea"; g.beginPath(); g.ellipse(ex, ey, hr*0.14, hr*0.16, 0,0,TAU); g.fill();
  g.fillStyle=INK; g.beginPath(); g.ellipse(ex+dir*hr*0.02, ey, hr*0.07, hr*0.09, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(HC.x+dir*hr*1.36, HC.y+hr*0.40, hr*0.09, hr*0.07, 0.3*dir, 0,TAU); g.fill();
  pen.ink(()=>{ g.moveTo(HC.x+dir*hr*1.40, HC.y+hr*0.56);
                g.lineTo(HC.x+dir*hr*1.02, HC.y+hr*0.66); }, 2.2);
}

/* ONE short cloven leg: two segments (hip->knee->foot) + a split hoof block. */
function drawLeg(pen, hip, foot, w, tone, dir, bend){
  const g = pen.ctx;
  const knee = P(lerp(hip.x,foot.x,0.5)+dir*bend, lerp(hip.y,foot.y,0.52));
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.82);
  pen.paint(()=>{ g.rect(foot.x - w*0.60, foot.y - w*0.10, w*0.52, w*0.52); }, T_HOOF(), 2.5);
  pen.paint(()=>{ g.rect(foot.x + w*0.08, foot.y - w*0.10, w*0.52, w*0.52); }, T_HOOF(), 2.5);
}

/* ODYSSEUS clinging under the barrel, hung in the leg-gap so he reads plainly:
   an elongated body slung beneath the belly, arms reaching UP to grip the
   fleece (the "belly anchor"), a hooked leg, and his bearded HEAD projecting
   below the belly line between the legs. cling 1 = cinched up tight against the
   wool; cling 0 = dropping free & straightening downward (release). His head is
   toward the ram's front (+dir). Drawn AFTER the fleece; near legs come over. */
function drawOdysseus(pen, cx, bellyY, U, dir, { cling=1 }={}){
  const g = pen.ctx;
  const drop = (1-cling);
  // torso hangs just below the fleece underside; drops further on release
  const bodyY = bellyY + lerp(U*0.16, U*0.62, drop);
  const OL = U*0.58;                                 // half body length
  const reachUp = lerp(U*0.70, U*0.14, drop);        // arm/leg hook into the wool
  const backX = cx - dir*OL*0.62;                    // his hips / rear (toward ram rear)
  const frontX= cx + dir*OL*0.52;                    // his shoulders (toward ram front)
  const headX = frontX + dir*OL*0.42;                // head stays inside the leg-gap
  const headY = bodyY + lerp(U*0.14, U*0.48, drop);  // head dips lower as he lets go
  const hr = U*0.27;

  // FAR arm + FAR leg (behind torso, dimmer) hooking up into the fleece
  pen.limb(()=>{ g.moveTo(frontX-dir*OL*0.10, bodyY-U*0.05);
    g.quadraticCurveTo(frontX-dir*OL*0.22, bodyY-reachUp*0.7, frontX-dir*OL*0.34, bodyY-reachUp); },
    T_TUNIC(), U*0.11);
  pen.limb(()=>{ g.moveTo(backX+dir*OL*0.06, bodyY-U*0.05);
    g.quadraticCurveTo(backX-dir*OL*0.02, bodyY-reachUp*0.72, backX-dir*OL*0.10, bodyY-reachUp); },
    T_TUNIC(), U*0.12);

  // TORSO (tunic) slung horizontally under the belly
  pen.paint(()=>{
    g.moveTo(frontX+dir*OL*0.10, bodyY-U*0.24);
    g.quadraticCurveTo(cx, bodyY-U*0.30, backX, bodyY-U*0.14);         // back up against belly
    g.quadraticCurveTo(backX-dir*U*0.16, bodyY+U*0.06, backX+dir*U*0.06, bodyY+U*0.26);
    g.quadraticCurveTo(cx, bodyY+U*0.30, frontX+dir*OL*0.06, bodyY+U*0.16); // front hangs
    g.closePath();
  }, T_TUNIC(), 4);
  // a lit belt/skin band so the torso has form and separates from the legs
  pen.paint(()=>{ g.ellipse(cx-dir*U*0.02, bodyY+U*0.02, OL*0.62, U*0.16, 0, 0, TAU); }, T_SKIN(), 0);

  // NEAR arm reaching up, fist gripping a knot of fleece
  const haX = frontX+dir*OL*0.02, haY = bodyY-reachUp;
  pen.limb(()=>{ g.moveTo(frontX+dir*OL*0.06, bodyY-U*0.08);
    g.quadraticCurveTo(frontX+dir*OL*0.10, bodyY-reachUp*0.55, haX, haY); }, T_SKIN(), U*0.14);
  pen.paint(()=>{ g.arc(haX, haY, U*0.12, 0, TAU); }, T_SKIN(), 3);
  // NEAR leg hooked up over the flank, foot in the wool
  const laX = backX-dir*U*0.02, laY = bodyY-reachUp*0.9;
  pen.limb(()=>{ g.moveTo(backX+dir*OL*0.04, bodyY+U*0.02);
    g.quadraticCurveTo(backX-dir*U*0.06, bodyY-reachUp*0.5, laX, laY); }, T_SKIN(), U*0.15);
  pen.paint(()=>{ g.ellipse(laX, laY, U*0.14, U*0.10, 0.3*dir, 0, TAU); }, T_SKIN(), 3);

  // short NECK from the front shoulder out to the head
  pen.limb(()=>{ g.moveTo(frontX+dir*OL*0.20, bodyY+U*0.02);
    g.lineTo(headX-dir*hr*0.6, headY-hr*0.2); }, T_SKIN(), U*0.14);
  // HEAD (bearded, face out) hanging below the belly line
  pen.paint(()=>{ g.arc(headX, headY, hr, 0, TAU); }, T_SKIN(), 4);
  // hair (crown toward the belly, i.e. upper-rear of his head)
  pen.paint(()=>{
    g.moveTo(headX-dir*hr*0.95, headY-hr*0.2);
    g.quadraticCurveTo(headX-dir*hr*0.2, headY-hr*1.35, headX+dir*hr*0.7, headY-hr*0.55);
    g.quadraticCurveTo(headX-dir*hr*0.1, headY-hr*0.55, headX-dir*hr*0.95, headY-hr*0.2);
    g.closePath();
  }, T_HAIR(), 3);
  // beard jutting DOWN/forward off his chin (clear "bearded man" read)
  pen.paint(()=>{
    g.moveTo(headX+dir*hr*0.55, headY+hr*0.15);
    g.quadraticCurveTo(headX+dir*hr*0.75, headY+hr*1.15, headX+dir*hr*0.20, headY+hr*1.30);
    g.quadraticCurveTo(headX-dir*hr*0.35, headY+hr*1.05, headX-dir*hr*0.30, headY+hr*0.35);
    g.quadraticCurveTo(headX+dir*hr*0.10, headY+hr*0.55, headX+dir*hr*0.55, headY+hr*0.15);
    g.closePath();
  }, T_HAIR(), 3);
  // eye + nose
  g.fillStyle=INK; g.beginPath(); g.ellipse(headX+dir*hr*0.40, headY-hr*0.10, hr*0.11, hr*0.13, 0,0,TAU); g.fill();
  pen.ink(()=>{ g.moveTo(headX+dir*hr*0.85, headY+hr*0.02); g.lineTo(headX+dir*hr*0.70, headY+hr*0.22); }, 2.2);
}

/* Polyphemus' great searching HAND descending onto the fleece to feel for
   stowaways. A compact palm sitting just above the ram's back, five splayed
   fingers with clear gaps pressing DOWN into the wool, and a narrow forearm
   running up off the top edge. `press` 0..1 sinks the fingers into the fleece. */
function drawPolyphemusHand(pen, cx, backTopY, U, press){
  const g = pen.ctx;
  const palmH = U*0.52, palmW = U*1.05;
  const palmTop = backTopY - U*0.80 + press*U*0.14;    // palm rests just above the back
  const palmBot = palmTop + palmH;
  // narrow tapering forearm running up off the top edge (a giant's arm) — a
  // lighter tone than palm/fingers so the column doesn't dominate the frame
  pen.paint(()=>{
    g.moveTo(cx-U*0.22, 0); g.lineTo(cx+U*0.22, 0);
    g.lineTo(cx+U*0.36, palmTop+U*0.06);
    g.quadraticCurveTo(cx, palmTop-U*0.05, cx-U*0.36, palmTop+U*0.06);
    g.closePath();
  }, T_HAND(), 4);
  // a couple of tendon seams up the forearm so it reads as an arm, not a slab
  pen.seam(()=>{ g.moveTo(cx-U*0.10, palmTop-U*0.1); g.lineTo(cx-U*0.06, 0); }, 2);
  pen.seam(()=>{ g.moveTo(cx+U*0.12, palmTop-U*0.1); g.lineTo(cx+U*0.06, 0); }, 2);
  // palm (rounded slab) with a wrist crease
  pen.paint(()=>{
    g.moveTo(cx-palmW*0.5, palmTop+palmH*0.15);
    g.quadraticCurveTo(cx-palmW*0.52, palmBot-palmH*0.05, cx-palmW*0.30, palmBot);
    g.lineTo(cx+palmW*0.30, palmBot);
    g.quadraticCurveTo(cx+palmW*0.52, palmBot-palmH*0.05, cx+palmW*0.5, palmTop+palmH*0.15);
    g.quadraticCurveTo(cx, palmTop-palmH*0.10, cx-palmW*0.5, palmTop+palmH*0.15);
    g.closePath();
  }, T_HAND(), 4.5);
  pen.seam(()=>{ g.moveTo(cx-palmW*0.34, palmTop+palmH*0.32);
                 g.quadraticCurveTo(cx, palmTop+palmH*0.20, cx+palmW*0.34, palmTop+palmH*0.32); }, 2.4);
  // five splayed fingers pressing down (thumb shortest on the -dir side)
  const tipBase = backTopY + press*U*0.20;
  const fw = U*0.155;
  for(let i=0;i<5;i++){
    const fx = cx + (i-2)*U*0.215;
    const len = (i===0? 0.62 : i===4? 0.80 : 1.0);       // uneven finger lengths
    const tipY = lerp(palmBot+U*0.10, tipBase, len);
    pen.paint(()=>{
      g.moveTo(fx-fw*0.5, palmBot-palmH*0.10);
      g.lineTo(fx-fw*0.5, tipY-fw*0.5);
      g.quadraticCurveTo(fx, tipY+fw*0.45, fx+fw*0.5, tipY-fw*0.5);
      g.lineTo(fx+fw*0.5, palmBot-palmH*0.10);
      g.closePath();
    }, T_HAND(), 4);
    pen.seam(()=>{ g.moveTo(fx-fw*0.42, lerp(palmBot, tipY, 0.5));
                   g.lineTo(fx+fw*0.42, lerp(palmBot, tipY, 0.5)); }, 2);
  }
}

/* the whole LEAD RAM, in profile facing +dir, at ground line groundY, unit U.
   opts: stride -1..1 (walk swing), gallop 0/1 (frozen bound), headDrop 0..1,
   cling 0..1 (Odysseus grip), hand 0..1 (Cyclops hand press, 0 = no hand),
   showMan (bool), t (idle phase). */
function drawRam(pen, cx, groundY, U, dir, opts={}){
  const g = pen.ctx;
  const stride  = opts.stride||0;
  const gallop  = opts.gallop||0;
  const headDrop= opts.headDrop??0;
  const cling   = opts.cling??1;
  const hand    = opts.hand??0;
  const showMan = opts.showMan!==false;
  const t       = opts.t||0;

  const bodyRx=U*1.18, bodyRy=U*0.82;
  const legLen=U*0.62;
  const lift = gallop*U*0.14;                        // running ram clears the ground
  const bob  = Math.sin(t*2+cx*0.01)*U*0.012;
  const cy = groundY - lift - legLen - bodyRy*0.52 + bob;

  // ---- ground shadow ----
  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+5, bodyRx*0.98, U*0.15, 0,0,TAU); g.fill(); g.restore();

  const legTopY = cy+bodyRy*0.30;
  const foreX = cx+dir*bodyRx*0.56, hindX = cx-dir*bodyRx*0.58;
  const sw = stride*U*0.30;

  // gallop foot targets: fore reach forward, hind reach back, knees more bent
  const fFoot = gallop?  dir*U*0.62 : sw;
  const rFoot = gallop? -dir*U*0.58 : -sw;
  const bend  = gallop? U*0.16 : U*0.06;

  // ---- FAR legs (behind, dimmer, inset) ----
  drawLeg(pen, P(foreX-dir*U*0.14, legTopY), P(foreX-dir*U*0.14+fFoot*0.8, groundY-lift*0), U*0.155, T_LEGF(), dir, bend*0.8);
  drawLeg(pen, P(hindX-dir*U*0.14, legTopY), P(hindX-dir*U*0.14+rFoot*0.8, groundY), U*0.155, T_LEGF(), dir, -bend*0.8);

  // ---- woolly BODY (big scalloped fleece) ----
  pen.paint(()=>{ woolBlob(g, cx, cy, bodyRx, bodyRy, 16, 0.22, Math.round(cx)); }, T_FLEECE(), 5);
  // shaded underside lobe (form)
  pen.paint(()=>{ g.ellipse(cx, cy+bodyRy*0.46, bodyRx*0.78, bodyRy*0.34, 0,0,TAU); }, T_FLEECE2(), 0);

  // ---- short woolly TAIL at the rear (-dir) ----
  pen.paint(()=>{
    const tb=P(cx-dir*bodyRx*0.94, cy+bodyRy*0.10);
    g.moveTo(tb.x, tb.y-U*0.14);
    g.quadraticCurveTo(tb.x-dir*U*0.26, cy+bodyRy*0.55, tb.x-dir*U*0.05, cy+bodyRy*0.70);
    g.quadraticCurveTo(tb.x+dir*U*0.10, cy+bodyRy*0.30, tb.x, tb.y-U*0.14);
    g.closePath();
  }, T_TAIL(), 3.5);

  // ---- neck + head (front, +dir) ----
  const headR = U*0.42;
  const HCxRaise = cx+dir*(bodyRx*0.96), HCyRaise = cy-bodyRy*0.36+bob;
  const HCxGraze = cx+dir*(bodyRx*1.06), HCyGraze = groundY-headR*0.55;
  const HCx = lerp(HCxRaise, HCxGraze, headDrop);
  const HCy = lerp(HCyRaise, HCyGraze, headDrop);
  // thick woolly neck wedge from shoulder to head
  pen.paint(()=>{
    g.moveTo(cx+dir*bodyRx*0.50, cy-bodyRy*0.42);
    g.quadraticCurveTo(lerp(cx,HCx,0.55)+dir*U*0.06, lerp(cy-bodyRy,HCy,0.5),
                       HCx-dir*headR*0.30, HCy-headR*0.55);
    g.lineTo(HCx-dir*headR*0.05, HCy+headR*0.65);
    g.quadraticCurveTo(cx+dir*bodyRx*0.66, cy+bodyRy*0.15, cx+dir*bodyRx*0.44, cy+bodyRy*0.02);
    g.closePath();
  }, T_FLEECE(), 4.5);

  drawRamHead(pen, P(HCx,HCy), headR, dir, { gaze: headDrop*0.3 });

  // ---- ODYSSEUS clinging under the belly (between body and near legs) ----
  if (showMan){
    const bellyY = cy + bodyRy*0.86;
    drawOdysseus(pen, cx - dir*U*0.12, bellyY, U, dir, { cling });
  }

  // ---- NEAR legs (over body + man, so he reads tucked inside the leg-cage) ----
  drawLeg(pen, P(foreX, legTopY), P(foreX+fFoot, groundY), U*0.18, T_LEGN(), dir, bend);
  drawLeg(pen, P(hindX, legTopY), P(hindX+rFoot, groundY), U*0.18, T_LEGN(), dir, -bend);

  // ---- Polyphemus' searching HAND pressing on the fleece from above ----
  if (hand>0){
    drawPolyphemusHand(pen, cx+dir*U*0.10, cy-bodyRy*1.02, U, clamp01(hand));
  }

  return { HC:P(HCx,HCy), body:P(cx,cy) };
}

/* ---- per-state pose + placement (fractions of W/H) ---- */
function poseFor(pose){
  switch(pose){
    case "walk":             return { stride:+1, headDrop:0.15, cling:1, hand:0,   y:0.70 };
    case "pause-under-hand": return { stride:0,  headDrop:0.05, cling:1, hand:1,   y:0.70 };
    case "run":              return { gallop:1,  headDrop:0.25, cling:1, hand:0,   y:0.66 };
    case "release":          return { stride:0,  headDrop:0.85, cling:0, hand:0,   y:0.72 };
    default:                 return { stride:0,  headDrop:0.1,  cling:1, hand:0,   y:0.70 };
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const t = state.t || 0;
  const pose = state.pose || "pause-under-hand";
  const Pp = poseFor(pose);
  const groundY = H*Pp.y;
  const U = Math.min(W, H) * 0.215;
  const cx = W*0.5;

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  drawRam(pen, cx, groundY, U, +1, {
    stride:Pp.stride, gallop:Pp.gallop, headDrop:Pp.headDrop,
    cling:Pp.cling, hand:Pp.hand, t,
  });
}

export const asset = {
  id:"creature.lead-ram",
  type:"CREATURE",
  name:"Lead ram",
  statusWord:"BEARING",
  scene:"OD-B09-S10",

  // procedural knobs
  params:{
    scale:1.25,           // the LARGEST ram of the flock (prize animal)
    fleeceBumps:16,       // scallop lobes on the thick fleece
    hornCoils:1.3,        // forward-coiling curl-horn turns
    riderUnderside:true,  // Odysseus clings to the belly (the "belly anchor")
    hide:"#e6e2d8",       // pale woolly fleece
  },
  // back -> front draw order (honored internally)
  layers:["ground","shadow","far-legs","fleece","belly","tail","neck",
          "far-horn","far-ear","face","near-horn","near-ear","eye",
          "rider","near-legs","hand"],
  // normalized 0..1 attention / contact / anchor points (neutral pause pose)
  anchors:{
    "ram:back":{x:.52,y:.30},          // where the Cyclops' hand presses
    "ram:head":{x:.74,y:.42},
    "ram:withers":{x:.60,y:.35},
    "ram:belly":{x:.48,y:.60},         // the underside anchor line
    "rider:anchor":{x:.47,y:.58},      // Odysseus' grip on the fleece
    "rider:head":{x:.60,y:.62},
    "rider:hands":{x:.55,y:.50},
    "hand:polyphemus":{x:.55,y:.12},   // the searching hand descends here
    "entrance:cave-mouth":{x:.04,y:.70},
    "exit:open":{x:.96,y:.70},
    "camera:ram":{x:.50,y:.48},
  },
  // body / pathing footprints for placement + collision
  zones:{
    "body:barrel":{ x0:.30,y0:.28,x1:.78,y1:.58 },
    "rider:cage":{ x0:.34,y0:.50,x1:.66,y1:.68 },
    walkable:{ x0:.04,y0:.66,x1:.96,y1:.92 },
  },
  states:{
    initial:"pause-under-hand",
    nodes:{
      walk:{               preview:{ pose:"walk",             t:0.4 } },  // filing toward the cave mouth
      "pause-under-hand":{ preview:{ pose:"pause-under-hand", t:0.2 } },  // halted under the Cyclops' hand
      run:{                preview:{ pose:"run",              t:0.6 } },  // bounding out in a frozen gallop
      release:{            preview:{ pose:"release",          t:0.5 } },  // clear of the cave — man drops free
    },
    edges:[
      ["walk","pause-under-hand"],["pause-under-hand","walk"],
      ["walk","run"],["run","release"],["pause-under-hand","run"],
    ],
  },
  channels:["pose","stride","gallop","headDrop","cling","hand","t"],

  preview:()=>({ pose:"pause-under-hand", t:0.2, status:"BEARING", progress:.22 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
