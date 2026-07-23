/* creature.sacred-cattle — the cattle of Helios on Thrinakia, and the eerie
   OMEN that follows their slaughter (Odyssey Book 12). CREATURE asset
   (quadruped, NOT humanoid): fully custom geometry on engine primitives.

   A broad sacred OX in profile facing +dir:
     · a deep barrel BODY (LIGHT hide — the Sun's white cattle — with a shaded
       shoulder mass + pale underbelly for form)
     · four sturdy hoofed LEGS (upper/lower segments + a blocky cloven hoof)
     · a thick NECK -> broad blunt cattle HEAD (muzzle, jaw, eye, nostril, ear)
       crowned by a pair of curving lyre HORNS (near bold, far dimmer)
     · a whisk TAIL with a tuft.

   States (channels drive them) — the four required OMEN states:
     alive       — a living beast of the herd: standing, head grazing / raised,
                   forbidden but calm, gaze soft. (the sacred herd before the sin)
     killed      — a slain carcass down on the ground: legs folded aside, neck
                   laid out flat, a kill-seam at the throat. (the crew's sin)
     hide-crawl  — THE OMEN I: a FLAYED HIDE creeping along the ground on its own
                   — a flat empty pelt (dangling leg-skins, a limp head-skin,
                   wrinkle contours) inching forward, motion-lines trailing it.
     meat-voice  — THE OMEN II: SPITTED MEAT that BELLOWS — gobbets threaded on
                   a spit over embers, arcs of sound radiating from the meat as
                   if the dead flesh still lowed. Both overlays ANIMATE over t.

   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B12-S06 — selected animals, kill, then supernatural hide-crawl and
   meat-voice states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- tone levels (flat grays; the POST pass turns them into dots).
   The sacred hide reads LIGHT (Helios' white kine) so the dark head, legs,
   horns and — above all — the eerie omen overlays pop against it. ---- */
const T_HIDE   = ()=> toneSolid(inkLevel(3));   // sacred pale hide (light-mid)
const T_BELLY  = ()=> toneSolid(inkLevel(2));   // paler underbelly (form)
const T_SHOULD = ()=> toneSolid(inkLevel(4));   // shaded shoulder / haunch mass
const T_NECK   = ()=> toneSolid(inkLevel(3));
const T_HEAD   = ()=> toneSolid(inkLevel(4));   // blunt head
const T_MUZZLE = ()=> toneSolid(inkLevel(3));   // lighter muzzle
const T_EAR    = ()=> toneSolid(inkLevel(5));
const T_LEGN   = ()=> toneSolid(inkLevel(5));   // near legs (bold)
const T_LEGF   = ()=> toneSolid(inkLevel(4));   // far legs (dimmer)
const T_HOOF   = ()=> toneSolid(inkLevel(7));   // hard cloven hoof
const T_HORNN  = ()=> toneSolid(inkLevel(6));   // near horn (bold)
const T_HORNF  = ()=> toneSolid(inkLevel(4));   // far horn (behind)
const T_TAIL   = ()=> toneSolid(inkLevel(4));
const T_TUFT   = ()=> toneSolid(inkLevel(6));

const T_HIDESKIN = ()=> toneSolid(inkLevel(3)); // the flayed pelt (empty hide)
const T_HIDEDARK = ()=> toneSolid(inkLevel(4)); // hide underside / fold shade
const T_SPIT   = ()=> toneSolid(inkLevel(6));   // iron spit rod / forks
const T_MEAT   = ()=> toneSolid(inkLevel(5));   // gobbet of roasting meat
const T_MEATHOT= ()=> toneSolid(inkLevel(4));   // seared face of the meat
const T_EMBER  = ()=> toneSolid(inkLevel(6));   // ember bed
const T_FIRE   = ()=> toneSolid(inkLevel(3));   // low flame
const T_FIREHOT= ()=> toneSolid(inkLevel(2));   // flame core

/* broad cattle HEAD drawn in a LOCAL frame the caller translated/rotated to HC.
   dir points the muzzle. skull, blunt muzzle/jaw, ear, eye, nostril, and a
   pair of curving lyre horns (near bold, far dim). */
function drawHead(pen, hr, dir, { gaze=0, dead=false }={}){
  const g = pen.ctx;
  const rx = hr, ry = hr*0.86;

  // ---- one lyre HORN: sweeps out low then curves up to a point.
  //   fwd/side offsets shape near vs far horn. ----
  const horn = (side, tone, lw)=>{
    const base = P(-dir*rx*0.06, -ry*0.56);                 // poll base, back of crown
    const outX = -dir*rx*0.02 + side*dir*rx*0.16;
    const c1   = P(outX + dir*rx*0.70, -ry*0.98);           // sweeps out and up
    const c2   = P(outX + dir*rx*0.30, -ry*1.62);           // curls in
    const tip  = P(outX + dir*rx*0.62, -ry*1.78);           // sharp tip
    pen.paint(()=>{
      g.moveTo(base.x, base.y);
      g.quadraticCurveTo(c1.x, c1.y, tip.x, tip.y);         // outer edge up to tip
      g.quadraticCurveTo(c2.x, c2.y, base.x + dir*rx*0.20, base.y - ry*0.06); // inner edge back down
      g.quadraticCurveTo(base.x + dir*rx*0.10, base.y + ry*0.06, base.x, base.y); // base cap
      g.closePath();
    }, tone, lw);
  };
  // FAR horn first (behind the skull, dimmer, tucked back)
  horn(-0.55, T_HORNF(), 3.5);

  // ---- blunt MUZZLE / jaw (front of head) ----
  const mTip = P(dir*rx*1.28, ry*0.30);
  pen.paint(()=>{
    g.moveTo(dir*rx*0.34, -ry*0.30);                                 // brow ridge
    g.quadraticCurveTo(dir*rx*1.02, -ry*0.14, mTip.x, mTip.y - ry*0.10); // nose bridge -> tip
    g.quadraticCurveTo(mTip.x + dir*rx*0.14, mTip.y + ry*0.24, mTip.x - dir*rx*0.06, mTip.y + ry*0.42); // muzzle front
    g.quadraticCurveTo(dir*rx*0.66, ry*0.80, dir*rx*0.06, ry*0.70);  // heavy jaw
    g.closePath();
  }, T_MUZZLE(), 4);

  // ---- broad SKULL ----
  pen.paint(()=>{ g.ellipse(0, 0, rx, ry, 0, 0, TAU); }, T_HEAD(), 4);

  // ---- forelock tuft between the horns ----
  pen.paint(()=>{ g.ellipse(0, -ry*0.60, rx*0.34, ry*0.28, 0, 0, TAU); }, T_SHOULD(), 3);

  // ---- ear (out to the side, below the near horn) ----
  pen.paint(()=>{
    g.moveTo(-dir*rx*0.06, -ry*0.16);
    g.quadraticCurveTo(-dir*rx*0.74, -ry*0.24, -dir*rx*0.70, ry*0.16);
    g.quadraticCurveTo(-dir*rx*0.42, ry*0.06, -dir*rx*0.04, ry*0.12);
    g.closePath();
  }, T_EAR(), 3.5);

  // ---- NEAR horn (over the skull, boldest) ----
  horn(0.55, T_HORNN(), 4);

  // ---- eye + nostril + mouth ----
  const ex = dir*rx*0.44, ey = -ry*0.04 + gaze*ry*0.28;
  if (dead){
    // a shut/dead eye — a short slash instead of a full pupil
    g.strokeStyle=INK; g.lineWidth=Math.max(2,rx*0.10); g.lineCap="round";
    g.beginPath(); g.moveTo(ex-rx*0.13, ey); g.lineTo(ex+rx*0.13, ey); g.stroke();
  } else {
    g.fillStyle="#f0f0ea"; g.beginPath(); g.ellipse(ex, ey, rx*0.15, rx*0.13, 0,0,TAU); g.fill();
    g.fillStyle=INK;       g.beginPath(); g.ellipse(ex+dir*rx*0.02, ey, rx*0.08, rx*0.10, 0,0,TAU); g.fill();
  }
  g.fillStyle=INK; g.beginPath(); g.ellipse(mTip.x - dir*rx*0.04, mTip.y + ry*0.12, rx*0.10, rx*0.07, 0.4*dir, 0,TAU); g.fill();
  pen.ink(()=>{ g.moveTo(mTip.x - dir*rx*0.06, mTip.y + ry*0.40); g.lineTo(dir*rx*0.26, ry*0.54); }, 2.5);
}

/* one sturdy hoofed LEG: two segments + a blocky cloven hoof. */
function drawLeg(pen, hip, foot, w, tone, dir, bend){
  const g = pen.ctx;
  const knee = P(lerp(hip.x,foot.x,0.5)+bend, lerp(hip.y,foot.y,0.55));
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.84);
  pen.paint(()=>{
    g.moveTo(foot.x - w*0.60, foot.y - w*0.10);
    g.lineTo(foot.x + w*0.60, foot.y - w*0.10);
    g.lineTo(foot.x + w*0.50, foot.y + w*0.40);
    g.lineTo(foot.x - w*0.50, foot.y + w*0.40);
    g.closePath();
  }, T_HOOF(), 2.6);
  pen.seam(()=>{ g.moveTo(foot.x, foot.y - w*0.08); g.lineTo(foot.x, foot.y + w*0.38); }, 1.8);
}

/* draw the whole OX BODY (barrel + neck + head + 4 legs + tail) about body-
   center BC, unit U, facing dir. Pose knobs via o (foot targets, bends, head
   swing/tilt, gaze, tailUp, dead). Returns HC so the scene can hang cues. */
function drawOx(pen, BC, U, dir, o={}){
  const g = pen.ctx;
  const bodyRx=U*1.18, bodyRy=U*0.64;
  const headDrop = o.headDrop ?? 0.35;

  // hip roots on the barrel
  const foreHipN = P(BC.x+dir*bodyRx*0.54, BC.y+bodyRy*0.52);
  const foreHipF = P(foreHipN.x-dir*U*0.18, foreHipN.y-U*0.02);
  const hindHipN = P(BC.x-dir*bodyRx*0.62, BC.y+bodyRy*0.46);
  const hindHipF = P(hindHipN.x-dir*U*0.18, hindHipN.y-U*0.02);
  const legW = U*0.14;

  // ---- FAR legs first (behind, dimmer) ----
  drawLeg(pen, foreHipF, o.footFF||P(foreHipF.x,BC.y+U*1.3), legW*0.86, T_LEGF(), dir,  (o.bendF||0)*0.8);
  drawLeg(pen, hindHipF, o.footHF||P(hindHipF.x,BC.y+U*1.3), legW*0.86, T_LEGF(), dir, -(o.bendH||0)*0.8);

  // ---- whisk TAIL at the rump (behind the barrel) ----
  const tb=P(BC.x-dir*bodyRx*0.96, BC.y-bodyRy*0.34);
  const tuftUp = o.tailUp ? -U*0.30 : U*0.02;
  const te=P(tb.x-dir*U*0.16, tb.y+U*0.9+tuftUp*0);
  pen.limb(()=>{ g.moveTo(tb.x,tb.y);
    g.quadraticCurveTo(tb.x-dir*U*0.30, BC.y+bodyRy*0.6, te.x, te.y+tuftUp); }, T_TAIL(), U*0.055);
  pen.paint(()=>{ g.ellipse(te.x, te.y+tuftUp+U*0.06, U*0.09, U*0.16, 0.2*dir, 0,TAU); }, T_TUFT(), 3);

  // ---- BARREL (deep sturdy body) ----
  pen.paint(()=>{
    g.moveTo(BC.x-dir*bodyRx*1.00, BC.y-bodyRy*0.06);                // rump top
    g.quadraticCurveTo(BC.x-dir*bodyRx*0.30, BC.y-bodyRy*0.98,       // level back
                       BC.x+dir*bodyRx*0.50, BC.y-bodyRy*0.94);      // withers
    g.quadraticCurveTo(BC.x+dir*bodyRx*1.06, BC.y-bodyRy*0.70,       // shoulder
                       BC.x+dir*bodyRx*1.00, BC.y+bodyRy*0.12);      // brisket
    g.quadraticCurveTo(BC.x+dir*bodyRx*0.88, BC.y+bodyRy*0.92,       // belly front
                       BC.x+dir*bodyRx*0.06, BC.y+bodyRy*1.00);      // deep belly
    g.quadraticCurveTo(BC.x-dir*bodyRx*0.68, BC.y+bodyRy*1.04,       // belly rear
                       BC.x-dir*bodyRx*1.00, BC.y+bodyRy*0.34);      // haunch
    g.quadraticCurveTo(BC.x-dir*bodyRx*1.12, BC.y+bodyRy*0.06,
                       BC.x-dir*bodyRx*1.00, BC.y-bodyRy*0.06);
    g.closePath();
  }, T_HIDE(), 5);
  // shaded shoulder + haunch masses (form), pale underbelly
  pen.paint(()=>{ g.ellipse(BC.x-dir*bodyRx*0.62, BC.y-bodyRy*0.06, bodyRx*0.44, bodyRy*0.82, 0,0,TAU); }, T_SHOULD(), 0);
  pen.paint(()=>{ g.ellipse(BC.x+dir*bodyRx*0.10, BC.y+bodyRy*0.56, bodyRx*0.70, bodyRy*0.36, 0,0,TAU); }, T_BELLY(), 0);

  // ---- NECK: thick wedge from withers up to the head base HC ----
  const NB = P(BC.x+dir*bodyRx*0.74, BC.y-bodyRy*0.60);             // neck root at withers
  const HCraise = P(NB.x+dir*U*0.66, NB.y-U*0.96);                  // head up
  const HCgraze = P(NB.x+dir*U*1.16, NB.y+U*1.28);                  // head down grazing
  const HC = P(lerp(HCraise.x,HCgraze.x,headDrop), lerp(HCraise.y,HCgraze.y,headDrop));
  const hr = U*0.50;
  pen.paint(()=>{
    g.moveTo(BC.x+dir*bodyRx*0.46, BC.y-bodyRy*0.62);               // crest at withers
    g.quadraticCurveTo(lerp(NB.x,HC.x,0.5)-dir*U*0.06, lerp(NB.y,HC.y,0.5)-U*0.10,
                       HC.x-dir*hr*0.30, HC.y-hr*0.40);             // crest to poll
    g.lineTo(HC.x+dir*hr*0.30, HC.y+hr*0.55);                       // across the throat side
    g.quadraticCurveTo(lerp(NB.x,HC.x,0.5)+dir*U*0.24, lerp(NB.y,HC.y,0.5)+U*0.14,
                       BC.x+dir*bodyRx*0.92, BC.y-bodyRy*0.02);     // down the dewlap throat
    g.closePath();
  }, T_NECK(), 4.5);
  // dewlap fold
  pen.ink(()=>{ g.moveTo(HC.x+dir*hr*0.28, HC.y+hr*0.48);
    g.quadraticCurveTo(BC.x+dir*bodyRx*1.02, BC.y+bodyRy*0.20, BC.x+dir*bodyRx*0.88, BC.y+bodyRy*0.02); }, 2.5);

  // ---- HEAD + horns in a local frame at HC ----
  const tilt = (o.headTilt!=null) ? o.headTilt : lerp(-0.16, 0.72, headDrop);
  g.save(); g.translate(HC.x, HC.y); g.rotate(tilt);
  drawHead(pen, hr, dir, { gaze:o.gaze||0, dead:o.dead });
  g.restore();

  // ---- NEAR legs (over the body) ----
  drawLeg(pen, foreHipN, o.footFN||P(foreHipN.x,BC.y+U*1.4), legW, T_LEGN(), dir,  (o.bendF||0));
  drawLeg(pen, hindHipN, o.footHN||P(hindHipN.x,BC.y+U*1.4), legW, T_LEGN(), dir, -(o.bendH||0));

  return { HC, hr, BC, bodyRx, bodyRy };
}

/* build the four foot targets + knee bends for a mode */
function feetFor(mode, BC, U, dir, groundY){
  const rx=U*1.18, ry=U*0.64;
  const foreX=BC.x+dir*rx*0.54, hindX=BC.x-dir*rx*0.62;
  if (mode==="stand"){
    return { footFN:P(foreX+dir*U*0.08,groundY), footFF:P(foreX+dir*U*0.20,groundY),
             footHN:P(hindX-dir*U*0.08,groundY), footHF:P(hindX-dir*U*0.20,groundY),
             bendF:U*0.02, bendH:-U*0.08 };
  }
  if (mode==="downed"){ // killed: legs folded aside along the ground toward +dir
    const gy=groundY;
    return { footFN:P(foreX+dir*U*0.60, gy), footFF:P(foreX+dir*U*0.78, gy-U*0.05),
             footHN:P(hindX+dir*U*0.34, gy), footHF:P(hindX+dir*U*0.52, gy-U*0.05),
             bendF:-U*0.44, bendH:-U*0.44 };
  }
  return feetFor("stand",BC,U,dir,groundY);
}

/* ===================== OMEN I: the FLAYED HIDE that CRAWLS =====================
   A flat empty pelt laid on the ground, inching forward (+dir). Drawn as a
   broad limp skin with dangling leg-skins, a slack head-skin, wrinkle contours,
   and trailing motion-lines. Creeps over t. */
function drawHideCrawl(pen, W, groundY, U, dir, t){
  const g = pen.ctx;
  const creep = Math.sin(t*1.6)*U*0.10;                 // slow forward inch
  const cx = W*0.50 + creep;
  const hw = U*1.55, hh = U*0.60;                        // pelt half-extents
  const ripple = a => Math.sin(t*2.4 + a)*U*0.05;       // crawling ripple

  // ---- trailing motion-lines behind the pelt (the tell that it MOVES) ----
  g.save(); g.strokeStyle="rgba(0,0,0,0.30)"; g.lineWidth=2.4; g.lineCap="round";
  for(let i=0;i<3;i++){
    const yy = groundY - hh*0.2 - i*U*0.16;
    g.beginPath();
    g.moveTo(cx-dir*hw*1.02, yy);
    g.lineTo(cx-dir*hw*(1.02+0.20+0.06*i) - dir*creep, yy);
    g.stroke();
  }
  g.restore();

  // ---- the four dangling LEG-SKINS (splayed flat, limp) ----
  const legSkin=(sx, len)=>{
    pen.paint(()=>{
      g.moveTo(sx-U*0.10, groundY-hh*0.10);
      g.quadraticCurveTo(sx-U*0.02, groundY+len*0.5, sx-U*0.06+ripple(sx), groundY+len);
      g.quadraticCurveTo(sx+U*0.06, groundY+len*0.6, sx+U*0.12, groundY-hh*0.10);
      g.closePath();
    }, T_HIDEDARK(), 3);
  };
  legSkin(cx-dir*hw*0.66, U*0.30);
  legSkin(cx-dir*hw*0.20, U*0.24);
  legSkin(cx+dir*hw*0.26, U*0.26);
  legSkin(cx+dir*hw*0.62, U*0.22);

  // ---- the broad PELT sheet (crawling — front edge lifts a little) ----
  const lift = -Math.abs(Math.sin(t*2.0))*U*0.16;       // front edge rears up as it creeps
  pen.paint(()=>{
    g.moveTo(cx-dir*hw, groundY-hh*0.02);
    g.quadraticCurveTo(cx-dir*hw*0.5, groundY-hh - ripple(1.0), cx, groundY-hh*0.86);
    g.quadraticCurveTo(cx+dir*hw*0.5, groundY-hh*0.72 - ripple(2.0), cx+dir*hw*0.94, groundY-hh*0.30+lift);
    g.quadraticCurveTo(cx+dir*hw*1.02, groundY+U*0.02+lift, cx+dir*hw*0.80, groundY+U*0.04);
    g.quadraticCurveTo(cx, groundY+U*0.06, cx-dir*hw, groundY-hh*0.02);
    g.closePath();
  }, T_HIDESKIN(), 4.5);

  // ---- limp HEAD-SKIN drooping off the front, with an empty eye-hole + horn stub
  const hx = cx+dir*hw*0.90, hy = groundY-hh*0.24+lift;
  pen.paint(()=>{
    g.moveTo(hx-dir*U*0.14, hy-U*0.20);
    g.quadraticCurveTo(hx+dir*U*0.42, hy-U*0.10, hx+dir*U*0.40, hy+U*0.26);
    g.quadraticCurveTo(hx+dir*U*0.30, hy+U*0.44, hx-dir*U*0.04, hy+U*0.34);
    g.quadraticCurveTo(hx-dir*U*0.20, hy+U*0.06, hx-dir*U*0.14, hy-U*0.20);
    g.closePath();
  }, T_HIDEDARK(), 3.5);
  // hollow eye socket of the empty face
  g.fillStyle=inkLevel(7); g.beginPath(); g.ellipse(hx+dir*U*0.10, hy+U*0.04, U*0.07, U*0.09, 0,0,TAU); g.fill();
  // a stub of horn still on the head-skin
  pen.paint(()=>{
    g.moveTo(hx+dir*U*0.02, hy-U*0.16);
    g.quadraticCurveTo(hx+dir*U*0.22, hy-U*0.52, hx+dir*U*0.30, hy-U*0.44);
    g.quadraticCurveTo(hx+dir*U*0.14, hy-U*0.28, hx+dir*U*0.14, hy-U*0.12);
    g.closePath();
  }, T_HORNF(), 3);

  // ---- wrinkle / crawl contours across the pelt (it ripples like a beast) ----
  g.save(); g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let i=0;i<4;i++){
    const fx = cx-dir*hw*0.7 + dir*hw*0.42*i;
    g.beginPath();
    g.moveTo(fx, groundY-hh*0.02);
    g.quadraticCurveTo(fx+dir*U*0.12, groundY-hh*0.5 - ripple(i*1.3), fx+dir*U*0.04, groundY-hh*0.82);
    g.stroke();
  }
  g.restore();

  // ground shadow under the creeping pelt
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+U*0.10, hw*0.96, U*0.14, 0,0,TAU); g.fill(); g.restore();
}

/* ===================== OMEN II: the SPITTED MEAT that BELLOWS =================
   Gobbets of meat threaded on an iron spit over an ember bed; arcs of sound
   radiate from the meat (the dead flesh lows). Sound pulses over t. */
function drawMeatVoice(pen, W, groundY, U, dir, t){
  const g = pen.ctx;
  const cx = W*0.46;
  const spitY = groundY - U*0.95;

  // ---- ember bed + low flame under the spit ----
  pen.paint(()=>{ g.ellipse(cx, groundY+U*0.06, U*1.30, U*0.20, 0,0,TAU); }, T_EMBER(), 3);
  const flame=(x,h,wd,tone)=> pen.paint(()=>{
    const sway=Math.sin(t*5+x)*wd*0.4;
    g.moveTo(x-wd, groundY);
    g.quadraticCurveTo(x-wd*0.5+sway, groundY-h*0.5, x-wd*0.15+sway, groundY-h*0.86);
    g.quadraticCurveTo(x+sway, groundY-h, x+wd*0.18+sway, groundY-h*0.82);
    g.quadraticCurveTo(x+wd*0.6, groundY-h*0.4, x+wd, groundY);
    g.closePath();
  }, tone, 2.4);
  for(let i=-2;i<=2;i++){ const x=cx+i*U*0.44; flame(x, U*(0.44+0.10*(2-Math.abs(i))), U*0.24, T_FIRE()); }
  for(let i=-1;i<=1;i++){ const x=cx+i*U*0.44; flame(x, U*(0.28+0.08*(1-Math.abs(i))), U*0.14, T_FIREHOT()); }

  // ---- forked SPIT uprights + the rod ----
  const fork=(fx)=>{
    pen.paint(()=>{ g.rect(fx-U*0.05, spitY-U*0.10, U*0.10, U*1.05); }, T_SPIT(), 3.5);
    pen.limb(()=>{ g.moveTo(fx-U*0.16, spitY-U*0.20); g.lineTo(fx, spitY-U*0.02); }, T_SPIT(), U*0.05);
    pen.limb(()=>{ g.moveTo(fx+U*0.16, spitY-U*0.20); g.lineTo(fx, spitY-U*0.02); }, T_SPIT(), U*0.05);
  };
  fork(cx-U*1.05); fork(cx+U*1.05);
  pen.limb(()=>{ g.moveTo(cx-U*1.28, spitY); g.lineTo(cx+U*1.28, spitY); }, T_SPIT(), U*0.055);

  // ---- three GOBBETS of meat threaded on the rod ----
  const gobbet=(mx)=>{
    pen.paint(()=>{ g.ellipse(mx, spitY, U*0.34, U*0.26, 0,0,TAU); }, T_MEAT(), 4);
    pen.paint(()=>{ g.ellipse(mx-dir*U*0.08, spitY-U*0.02, U*0.18, U*0.15, 0,0,TAU); }, T_MEATHOT(), 0);
    // a couple of muscle-striation seams
    pen.seam(()=>{ g.moveTo(mx-U*0.22, spitY-U*0.06); g.quadraticCurveTo(mx, spitY-U*0.14, mx+U*0.22, spitY-U*0.04); }, 2);
    pen.seam(()=>{ g.moveTo(mx-U*0.20, spitY+U*0.08); g.quadraticCurveTo(mx, spitY+U*0.14, mx+U*0.20, spitY+U*0.06); }, 2);
  };
  const meatXs=[cx-U*0.62, cx, cx+U*0.62];
  for(const mx of meatXs) gobbet(mx);

  // ---- the BELLOW: arcs of SOUND radiating up-and-out from the meat (pulse) ----
  const pulse = 0.5 + 0.5*Math.sin(t*3.0);
  const src = P(cx, spitY-U*0.18);
  g.save(); g.lineCap="round";
  for(let i=0;i<4;i++){
    const r = U*(0.5 + i*0.42) + pulse*U*0.14;
    const alpha = clamp01((1 - i*0.22) * (0.5+0.5*pulse));
    // near-arcs use the blue accent so the "voice" reads as the eerie signal
    g.strokeStyle = i<2 ? `rgba(0,51,204,${alpha})` : `rgba(0,0,0,${alpha*0.7})`;
    g.lineWidth = 3.2 - i*0.4;
    g.beginPath();
    g.ellipse(src.x, src.y - U*0.10, r, r*0.72, 0, Math.PI*1.06, Math.PI*1.94);  // upward-opening arc
    g.stroke();
  }
  // little "breath" tick marks at the mouths of the arcs
  g.strokeStyle=ACCENT; g.lineWidth=2.6;
  for(const mx of meatXs){
    g.beginPath(); g.moveTo(mx, spitY-U*0.30-pulse*U*0.06); g.lineTo(mx, spitY-U*0.46-pulse*U*0.10); g.stroke();
  }
  g.restore();

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+U*0.12, U*1.30, U*0.16, 0,0,TAU); g.fill(); g.restore();
}

/* ---- per-state resolver ---- */
function stateFor(pose){
  switch(pose){
    case "alive":      return { mode:"beast", headDrop:0.34, gaze:0.15, tailUp:false, groundY:0.82, dead:false };
    case "killed":     return { mode:"downed",headDrop:0.90, headTilt:0.60, gaze:0, tailUp:false, groundY:0.82, dead:true };
    case "hide-crawl": return { mode:"omen-hide", groundY:0.80 };
    case "meat-voice": return { mode:"omen-meat", groundY:0.82 };
    default:           return { mode:"beast", headDrop:0.55, gaze:0.1, tailUp:false, groundY:0.80, dead:false };
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const t = state.t || 0;
  const pose = state.pose || "alive";
  const S = stateFor(pose);
  const dir = +1;
  const U = Math.min(W,H) * 0.175;
  const groundY = H*S.groundY;

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  // ---- OMEN states are their own scenes ----
  if (S.mode==="omen-hide"){ drawHideCrawl(pen, W, groundY, U, dir, t); return { anchors:asset.anchors, zones:asset.zones }; }
  if (S.mode==="omen-meat"){ drawMeatVoice(pen, W, groundY, U, dir, t); return { anchors:asset.anchors, zones:asset.zones }; }

  // ---- living / killed BEAST ----
  const cx = (S.mode==="downed") ? W*0.44 : W*0.50;
  let BC;
  if (S.mode==="beast") BC = P(cx, groundY - U*1.30 - U*0.64);
  else                  BC = P(cx, groundY - U*0.48);   // downed carcass low

  // ground shadow
  ctx.save(); ctx.fillStyle="rgba(0,0,0,0.09)";
  ctx.beginPath(); ctx.ellipse(cx, groundY+5, U*1.45, U*0.16, 0,0,TAU); ctx.fill(); ctx.restore();

  const feet = feetFor(S.mode==="downed"?"downed":"stand", BC, U, dir, groundY);

  ctx.save();
  if (S.mode==="downed"){ ctx.translate(BC.x,BC.y); ctx.rotate(0.08); ctx.translate(-BC.x,-BC.y); }
  const r = drawOx(pen, BC, U, dir, {
    headDrop:S.headDrop, headTilt:S.headTilt, gaze:S.gaze, tailUp:S.tailUp, dead:S.dead, ...feet,
  });
  ctx.restore();

  // kill-seam at the throat for the slain carcass
  if (S.mode==="downed"){
    const g=ctx;
    g.save(); g.strokeStyle=INK; g.lineWidth=2.6; g.setLineDash([8,6]);
    g.beginPath(); g.moveTo(r.HC.x-dir*U*0.10, r.HC.y+U*0.30); g.lineTo(r.HC.x+dir*U*0.50, r.HC.y+U*0.44); g.stroke();
    g.setLineDash([]); g.restore();
  }
  return r;
}

export const asset = {
  id:"creature.sacred-cattle",
  type:"CREATURE",
  name:"Sacred cattle",
  statusWord:"FORBIDDEN",
  scene:"OD-B12-S06",

  // procedural knobs
  params:{
    herd:7,               // Helios' seven herds (members available)
    hide:"#e6e2d6",       // sacred pale/white hide
    hornBone:"#d8d2c2",   // pale curving horns
    hump:0.6,             // modest shoulder mass (ox, not zebu)
    collision:true,       // barrel + leg footprint used for scene collision
    omenPulse:1.0,        // strength of the meat-voice sound arcs
  },
  // back -> front draw order (honored internally per state)
  layers:["ground","shadow","far-legs","tail","barrel","shoulder","belly","neck",
          "far-horn","head","ear","near-horn","near-legs","kill-seam",
          "hide-motion","hide-legs","pelt","head-skin","hide-wrinkles",
          "embers","flame","spit","meat","bellow-arcs"],
  // normalized 0..1 attention / contact / anchor points (neutral ALIVE pose)
  anchors:{
    "ox:head":{x:.70,y:.34},
    "ox:horns":{x:.66,y:.24},
    "ox:muzzle":{x:.78,y:.40},
    "ox:withers":{x:.56,y:.46},
    "ox:heart":{x:.44,y:.58},          // the kill target on the flank
    "ox:haunch":{x:.32,y:.50},
    "ox:belly":{x:.50,y:.66},
    "hide:crawl":{x:.50,y:.80},        // the creeping flayed pelt
    "hide:head-skin":{x:.72,y:.76},
    "spit:meat":{x:.46,y:.72},         // the bellowing spitted meat
    "sound:mouth":{x:.46,y:.66},       // where the bellow radiates from
    "fire:pit":{x:.46,y:.84},
    "entrance:meadow":{x:.04,y:.80},
    "exit:shore":{x:.96,y:.80},
    "camera:omen":{x:.50,y:.52},
  },
  // body / pathing footprints for placement + collision
  zones:{
    "body:barrel":{ x0:.34,y0:.42,x1:.70,y1:.66 },
    "omen:field":{ x0:.10,y0:.66,x1:.90,y1:.92 },
    walkable:{ x0:.04,y0:.66,x1:.96,y1:.94 },
  },
  states:{
    initial:"alive",
    nodes:{
      alive:{       preview:{ pose:"alive",      t:0.0 } },  // the sacred herd, forbidden but calm
      killed:{      preview:{ pose:"killed",     t:0.3 } },  // a slain carcass, throat cut
      "hide-crawl":{preview:{ pose:"hide-crawl", t:0.6 } },  // OMEN: flayed hide creeps (animate t)
      "meat-voice":{preview:{ pose:"meat-voice", t:0.5 } },  // OMEN: spitted meat bellows (animate t)
    },
    edges:[
      ["alive","killed"],["killed","hide-crawl"],
      ["killed","meat-voice"],["hide-crawl","meat-voice"],
    ],
  },
  channels:["pose","headDrop","gaze","tailUp","omen","t"],

  preview:()=>({ pose:"alive", t:0.0, status:"FORBIDDEN", progress:.2 }),
  draw(ctx,W,H,state){ return drawScene(ctx,W,H,state); },
};
export default asset;
