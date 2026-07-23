/* creature.great-stag — the great antlered stag Odysseus fells on Circe's
   island (Aeaea) and carries down to the ship for the crew's feast.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. A large NOBLE DEER in profile facing +dir:
     · a sleek deep-chested BARREL (light hide + shaded underbelly for form)
     · four slender articulated LEGS (upper/lower + small cloven hoof block)
     · a long arched NECK -> narrow wedge HEAD (muzzle, eye, nostril, ears)
     · a pair of BIG BRANCHING ANTLERS sweeping up-and-back with brow/bez/trez
       tines + a crown fork — the read that names this creature (near bold,
       far dimmer, offset behind the skull).
   States (channels drive them):
     drink     — head/neck swung low to a water line, muzzle at the ripples.
     alert     — the hero silhouette: head thrown high, ears erect, tail up.
     struck    — a spear driven through the flank; forelegs buckling, head
                 flung up-and-back in the death lurch.
     carried   — trussed game: all four hooves lashed UP to a shoulder-pole,
                 body slung below, head + heavy antlers hanging down.
     butchered — a downed carcass on the ground: legs folded aside, neck laid
                 out flat, a butcher's cut-seam + blade at the belly.
     feast     — the whole stag on a SPIT over flames, legs trussed back along
                 the rod, fire licking up beneath it.
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B10-S03 — the large deer through kill, carry, and feast. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- tone levels (flat grays; the POST pass turns them into dots).
   The hide reads LIGHT so the dark head, legs and big branching antlers pop
   as a clean noble silhouette. ---- */
const T_HIDE   = ()=> toneSolid(inkLevel(3));   // sleek deer hide (light-mid)
const T_BELLY  = ()=> toneSolid(inkLevel(2));   // paler underbelly (form)
const T_RUMP   = ()=> toneSolid(inkLevel(4));   // shaded haunch / shoulder mass
const T_NECK   = ()=> toneSolid(inkLevel(3));
const T_HEAD   = ()=> toneSolid(inkLevel(5));   // dark narrow head
const T_EAR    = ()=> toneSolid(inkLevel(4));
const T_LEGN   = ()=> toneSolid(inkLevel(5));   // near legs (bold)
const T_LEGF   = ()=> toneSolid(inkLevel(4));   // far legs (dimmer, inset)
const T_HOOF   = ()=> toneSolid(inkLevel(7));   // hard cloven hoof
const T_ANTN   = ()=> toneSolid(inkLevel(6));   // near antler (bold branching read)
const T_ANTF   = ()=> toneSolid(inkLevel(4));   // far antler (behind)
const T_TAIL   = ()=> toneSolid(inkLevel(2));   // pale scut tail
const T_SPEAR  = ()=> toneSolid(inkLevel(6));   // spear shaft
const T_POLE   = ()=> toneSolid(inkLevel(5));   // carry-pole
const T_ROPE   = ()=> toneSolid(inkLevel(6));   // lashing
const T_FIRE   = ()=> toneSolid(inkLevel(4));   // flame body
const T_FIREHOT= ()=> toneSolid(inkLevel(2));   // flame core (light)
const T_EMBER  = ()=> toneSolid(inkLevel(6));   // log / ember bed

/* cubic bezier point */
function bez(p0,c1,c2,p3,t){
  const u=1-t, a=u*u*u, b=3*u*u*t, c=3*u*t*t, d=t*t*t;
  return P(a*p0.x+b*c1.x+c*c2.x+d*p3.x, a*p0.y+b*c1.y+c*c2.y+d*p3.y);
}

/* ONE big BRANCHING antler drawn in HEAD-LOCAL space (poll near origin, up=-y).
   A curved main BEAM sweeping up-and-back off the poll, a forward BROW tine,
   two mid tines, and a small CROWN fork at the tip. Near antler is bolder;
   far antler is dimmer and offset behind. */
function drawAntler(pen, poll, hr, dir, tone, scale, back){
  const g = pen.ctx;
  const L = hr*2.35*scale;
  const bx = back*dir*hr*0.30;                       // push far antler behind
  const p0 = P(poll.x+bx,           poll.y);
  const c1 = P(p0.x+dir*0.22*L,     p0.y-0.44*L);    // rises up, a touch forward
  const c2 = P(p0.x-dir*0.34*L,     p0.y-0.74*L);    // curves back over the crown
  const tip= P(p0.x-dir*0.06*L,     p0.y-1.04*L);    // top, slightly back
  const bw = hr*0.20*scale;                          // beam weight

  // ---- main BEAM: thick base pass then a tapered tip pass ----
  const beamStroke=(t0,t1,w)=> pen.limb(()=>{
    let first=true;
    for(let i=0;i<=12;i++){
      const t=lerp(t0,t1,i/12), b=bez(p0,c1,c2,tip,t);
      if(first){ g.moveTo(b.x,b.y); first=false; } else g.lineTo(b.x,b.y);
    }
  }, tone, w);
  beamStroke(0.00,0.55, bw);
  beamStroke(0.55,1.00, bw*0.66);

  // ---- a TINE off the beam at parameter t toward (fx,fy) unit-ish dir ----
  const tine=(t, fx, fy, tl, w)=>{
    const b=bez(p0,c1,c2,tip,t);
    const end=P(b.x+dir*fx*tl, b.y+fy*tl);
    pen.limb(()=>{ g.moveTo(b.x,b.y); g.lineTo(end.x,end.y); }, tone, w);
    return end;
  };
  // BROW tine — springs forward and slightly up low on the beam
  tine(0.14,  0.95, -0.30, L*0.42, bw*0.66);
  // BEZ tine — up-forward mid beam
  tine(0.40,  0.55, -0.80, L*0.44, bw*0.60);
  // TREZ tine — up, upper beam
  tine(0.66,  0.28, -0.92, L*0.40, bw*0.54);
  // ---- CROWN: a small two/three-point fork at the tip ----
  tine(1.00,  0.42, -0.55, L*0.30, bw*0.48);
  tine(1.00, -0.30, -0.60, L*0.30, bw*0.48);
}

/* the narrow deer HEAD + ears + both antlers, drawn in a LOCAL frame the
   caller has already translated/rotated to HC. dir points the muzzle. */
function drawHead(pen, hr, dir, { gaze=0 }={}){
  const g = pen.ctx;
  const poll = P(-dir*hr*0.05, -hr*0.42);            // top-back of skull

  // ---- FAR antler + far ear first (behind the skull) ----
  drawAntler(pen, poll, hr, dir, T_ANTF(), 0.92, +1);
  pen.paint(()=>{
    g.moveTo(poll.x-dir*hr*0.10, poll.y+hr*0.06);
    g.quadraticCurveTo(poll.x-dir*hr*0.95, poll.y-hr*0.30,
                       poll.x-dir*hr*0.80, poll.y+hr*0.20);
    g.quadraticCurveTo(poll.x-dir*hr*0.45, poll.y+hr*0.14, poll.x-dir*hr*0.05, poll.y+hr*0.10);
    g.closePath();
  }, T_EAR(), 3);

  // ---- narrow wedge FACE: poll -> forehead -> long muzzle -> jaw -> throat ----
  pen.paint(()=>{
    g.moveTo(poll.x, poll.y);                                        // poll
    g.quadraticCurveTo(dir*hr*0.55, -hr*0.52, dir*hr*1.05, -hr*0.20); // forehead -> bridge
    g.quadraticCurveTo(dir*hr*1.62, -hr*0.02, dir*hr*1.66, hr*0.28);  // long muzzle
    g.quadraticCurveTo(dir*hr*1.58, hr*0.52, dir*hr*1.22, hr*0.50);   // nose / lower lip
    g.quadraticCurveTo(dir*hr*0.55, hr*0.60, dir*hr*0.05, hr*0.42);   // jaw
    g.quadraticCurveTo(-dir*hr*0.18, hr*0.10, poll.x, poll.y);        // throat -> back to poll
    g.closePath();
  }, T_HEAD(), 4);

  // ---- NEAR ear (upright, in front of the antler base) ----
  pen.paint(()=>{
    g.moveTo(dir*hr*0.10, -hr*0.30);
    g.quadraticCurveTo(dir*hr*0.70, -hr*0.62, dir*hr*0.52, -hr*0.06);
    g.quadraticCurveTo(dir*hr*0.30, -hr*0.14, dir*hr*0.08, -hr*0.10);
    g.closePath();
  }, T_EAR(), 3);

  // ---- NEAR antler (over the skull, boldest) ----
  drawAntler(pen, poll, hr, dir, T_ANTN(), 1.06, 0);

  // ---- eye (bright ring + dark pupil on the dark face) + nostril ----
  const ex=dir*hr*0.62, ey=-hr*0.02 + gaze*hr*0.18;
  g.fillStyle="#f0f0ea"; g.beginPath(); g.ellipse(ex, ey, hr*0.13, hr*0.15, 0,0,TAU); g.fill();
  g.fillStyle=INK;       g.beginPath(); g.ellipse(ex+dir*hr*0.02, ey, hr*0.06, hr*0.08, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(dir*hr*1.48, hr*0.24, hr*0.08, hr*0.06, 0.3*dir, 0,TAU); g.fill();
}

/* one slender deer LEG: two segments (hip->knee->foot) + a small cloven hoof.
   bend swings the knee out; hocks bend the opposite way from knees (sign of
   bend set by the caller per fore/hind leg). */
function drawLeg(pen, hip, foot, w, tone, dir, bend){
  const g = pen.ctx;
  const knee = P(lerp(hip.x,foot.x,0.5)+bend, lerp(hip.y,foot.y,0.55));
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.78);
  // small cloven hoof block with a split seam
  pen.paint(()=>{ g.rect(foot.x - w*0.42, foot.y - w*0.06, w*0.84, w*0.46); }, T_HOOF(), 2.4);
  pen.seam(()=>{ g.moveTo(foot.x, foot.y); g.lineTo(foot.x, foot.y+w*0.40); }, 1.8);
}

/* draw the whole stag BODY (barrel + neck + head + 4 legs) around body-center
   BC, unit U, facing dir. All pose knobs come in via o:
     footFN/footFF/footHN/footHF : {x,y} foot targets (near/far fore/hind)
     bendF/bendH : knee bend for fore/hind legs
     headDrop 0..1 : neck swing (0 alert-high .. 1 drink-low)
     headTilt : extra head rotation (struck lurch, drink nose-down)
     gaze, tailUp : trim
   Returns HC (head-center world pos) so the scene can hang props off it. */
function drawStag(pen, BC, U, dir, o={}){
  const g = pen.ctx;
  const bodyRx=U*1.12, bodyRy=U*0.56;
  const headDrop = o.headDrop ?? 0.25;

  // hip roots on the barrel
  const foreHipN = P(BC.x+dir*bodyRx*0.52, BC.y+bodyRy*0.50);
  const foreHipF = P(foreHipN.x-dir*U*0.17, foreHipN.y-U*0.02);
  const hindHipN = P(BC.x-dir*bodyRx*0.60, BC.y+bodyRy*0.44);
  const hindHipF = P(hindHipN.x-dir*U*0.17, hindHipN.y-U*0.02);
  const legW = U*0.10;

  // ---- FAR legs first (behind, dimmer) ----
  drawLeg(pen, foreHipF, o.footFF||P(foreHipF.x,BC.y+U*1.4), legW*0.88, T_LEGF(), dir,  (o.bendF||0)*0.8);
  drawLeg(pen, hindHipF, o.footHF||P(hindHipF.x,BC.y+U*1.4), legW*0.88, T_LEGF(), dir, -(o.bendH||0)*0.8);

  // ---- BARREL (deep-chested sleek body) ----
  pen.paint(()=>{
    g.moveTo(BC.x-dir*bodyRx*0.98, BC.y-bodyRy*0.10);                 // rump top
    g.quadraticCurveTo(BC.x-dir*bodyRx*0.40, BC.y-bodyRy*1.02,        // back
                       BC.x+dir*bodyRx*0.55, BC.y-bodyRy*0.86);       // withers
    g.quadraticCurveTo(BC.x+dir*bodyRx*1.04, BC.y-bodyRy*0.66,        // chest shoulder
                       BC.x+dir*bodyRx*0.98, BC.y+bodyRy*0.10);       // brisket
    g.quadraticCurveTo(BC.x+dir*bodyRx*0.86, BC.y+bodyRy*0.86,        // belly front
                       BC.x+dir*bodyRx*0.10, BC.y+bodyRy*0.94);       // belly low
    g.quadraticCurveTo(BC.x-dir*bodyRx*0.66, BC.y+bodyRy*1.00,        // belly rear
                       BC.x-dir*bodyRx*0.98, BC.y+bodyRy*0.30);       // haunch
    g.quadraticCurveTo(BC.x-dir*bodyRx*1.10, BC.y+bodyRy*0.05,
                       BC.x-dir*bodyRx*0.98, BC.y-bodyRy*0.10);
    g.closePath();
  }, T_HIDE(), 5);
  // haunch mass (shaded) + pale underbelly (form)
  pen.paint(()=>{ g.ellipse(BC.x-dir*bodyRx*0.60, BC.y-bodyRy*0.10, bodyRx*0.42, bodyRy*0.80, 0,0,TAU); }, T_RUMP(), 0);
  pen.paint(()=>{ g.ellipse(BC.x+dir*bodyRx*0.12, BC.y+bodyRy*0.52, bodyRx*0.70, bodyRy*0.36, 0,0,TAU); }, T_BELLY(), 0);

  // ---- short scut TAIL at the rump ----
  pen.paint(()=>{
    const tb=P(BC.x-dir*bodyRx*0.98, BC.y-bodyRy*0.02);
    const up=(o.tailUp?-U*0.30:U*0.05);
    g.moveTo(tb.x, tb.y-U*0.06);
    g.quadraticCurveTo(tb.x-dir*U*0.22, tb.y+up, tb.x-dir*U*0.06, tb.y+up+U*0.20);
    g.quadraticCurveTo(tb.x+dir*U*0.06, tb.y+up*0.5, tb.x, tb.y-U*0.06);
    g.closePath();
  }, T_TAIL(), 3);

  // ---- NECK: tapering wedge from withers up to the head base HC ----
  const NB = P(BC.x+dir*bodyRx*0.72, BC.y-bodyRy*0.62);              // withers/neck root
  const HCalert = P(NB.x+dir*U*0.62, NB.y-U*1.18);                   // head thrown high
  const HCdrink = P(NB.x+dir*U*1.22, NB.y+U*1.30);                   // head down to water
  const HC = P(lerp(HCalert.x,HCdrink.x,headDrop), lerp(HCalert.y,HCdrink.y,headDrop));
  const hr = U*0.52;
  pen.paint(()=>{
    g.moveTo(BC.x+dir*bodyRx*0.44, BC.y-bodyRy*0.60);                // back of neck root
    g.quadraticCurveTo(lerp(NB.x,HC.x,0.5)-dir*U*0.10, lerp(NB.y,HC.y,0.5)-U*0.06,
                       HC.x-dir*hr*0.30, HC.y-hr*0.30);              // up the nape to poll
    g.lineTo(HC.x+dir*hr*0.10, HC.y+hr*0.40);                        // across the throat side
    g.quadraticCurveTo(lerp(NB.x,HC.x,0.5)+dir*U*0.22, lerp(NB.y,HC.y,0.5)+U*0.10,
                       BC.x+dir*bodyRx*0.86, BC.y-bodyRy*0.08);      // down the front throat
    g.closePath();
  }, T_NECK(), 4.5);

  // ---- HEAD + antlers in a local frame at HC ----
  const tilt = (o.headTilt!=null) ? o.headTilt : lerp(-0.18, 0.95, headDrop);
  g.save(); g.translate(HC.x, HC.y); g.rotate(tilt);
  drawHead(pen, hr, dir, { gaze:o.gaze||0 });
  g.restore();

  // ---- NEAR legs (over the body) ----
  drawLeg(pen, foreHipN, o.footFN||P(foreHipN.x,BC.y+U*1.5), legW, T_LEGN(), dir,  (o.bendF||0));
  drawLeg(pen, hindHipN, o.footHN||P(hindHipN.x,BC.y+U*1.5), legW, T_LEGN(), dir, -(o.bendH||0));

  return { HC, hr, BC, bodyRx, bodyRy };
}

/* ---- per-state pose resolver: returns everything the scene needs ---- */
function poseFor(pose){
  switch(pose){
    case "drink":     return { mode:"stand", headDrop:1.0,  tailUp:false, groundY:0.80, gaze:0.3 };
    case "alert":     return { mode:"stand", headDrop:0.0,  tailUp:true,  groundY:0.82, gaze:0 };
    case "struck":    return { mode:"buckle",headDrop:0.05, tailUp:false, groundY:0.80, headTilt:-0.7, gaze:0.4, spear:1 };
    case "carried":   return { mode:"hung",  headDrop:1.25, tailUp:false, groundY:0.70, pole:1 };
    case "butchered": return { mode:"downed",headDrop:0.82, tailUp:false, groundY:0.82, headTilt:0.55, blade:1 };
    case "feast":     return { mode:"spit",  headDrop:0.18, tailUp:false, groundY:0.80, headTilt:-0.35, fire:1 };
    default:          return { mode:"stand", headDrop:0.2,  tailUp:false, groundY:0.82, gaze:0 };
  }
}

/* build the four foot targets + knee bends for a given mode */
function feetFor(mode, BC, U, dir, groundY){
  const rx=U*1.12, ry=U*0.56;
  const foreX=BC.x+dir*rx*0.52, hindX=BC.x-dir*rx*0.60;
  const topFN=BC.y+ry*0.50, topHN=BC.y+ry*0.44;
  if (mode==="stand"){
    return { footFN:P(foreX+dir*U*0.10,groundY), footFF:P(foreX+dir*U*0.22,groundY),
             footHN:P(hindX-dir*U*0.10,groundY), footHF:P(hindX-dir*U*0.22,groundY),
             bendF:U*0.02, bendH:-U*0.08 };
  }
  if (mode==="buckle"){ // struck: forelegs collapsing under, hind splayed back bracing
    return { footFN:P(foreX-dir*U*0.20, groundY-U*0.05), footFF:P(foreX-dir*U*0.34, groundY-U*0.02),
             footHN:P(hindX-dir*U*0.55, groundY),        footHF:P(hindX-dir*U*0.72, groundY),
             bendF:dir*U*0.42, bendH:-U*0.24 };
  }
  if (mode==="hung"){ // carried: all four hooves lashed UP to the pole above the body
    const upY=BC.y-U*1.15, lashF=BC.x+dir*U*0.30, lashR=BC.x-dir*U*0.30;
    return { footFN:P(lashF, upY), footFF:P(lashF+dir*U*0.14, upY-U*0.05),
             footHN:P(lashR, upY), footHF:P(lashR-dir*U*0.14, upY-U*0.05),
             bendF:dir*U*0.28, bendH:-dir*U*0.28 };
  }
  if (mode==="downed"){ // butchered: legs folded aside toward -dir along the ground
    const gy=groundY;
    return { footFN:P(foreX+dir*U*0.55, gy), footFF:P(foreX+dir*U*0.70, gy-U*0.04),
             footHN:P(hindX+dir*U*0.30, gy), footHF:P(hindX+dir*U*0.48, gy-U*0.04),
             bendF:-U*0.40, bendH:-U*0.40 };
  }
  if (mode==="spit"){ // feast: legs trussed back along the rod
    return { footFN:P(foreX+dir*U*0.70, BC.y-U*0.10), footFF:P(foreX+dir*U*0.82, BC.y-U*0.02),
             footHN:P(hindX-dir*U*0.70, BC.y-U*0.10), footHF:P(hindX-dir*U*0.82, BC.y-U*0.02),
             bendF:-U*0.30, bendH:U*0.30 };
  }
  return feetFor("stand",BC,U,dir,groundY);
}

/* ---- props ---- */
function drawWater(pen, W, H, y){
  const g=pen.ctx;
  pen.paint(()=>{ g.rect(0, y, W, H-y); }, T_BELLY(), 0);
  g.strokeStyle="rgba(0,0,0,0.28)"; g.lineWidth=2.4; g.lineCap="round";
  for(let i=0;i<5;i++){ const yy=y+8+i*10;
    g.beginPath(); g.moveTo(W*0.10, yy); g.lineTo(W*0.90, yy); g.stroke(); }
}
function drawSpear(pen, hitX, hitY, U, dir){
  const g=pen.ctx;
  // shaft driven down-through the flank, entering high-rear, exiting low-front
  const ax=hitX-dir*U*1.15, ay=hitY-U*1.35, bx=hitX+dir*U*0.55, by=hitY+U*0.55;
  pen.limb(()=>{ g.moveTo(ax,ay); g.lineTo(bx,by); }, T_SPEAR(), U*0.09);
  // bronze leaf head at the exit
  pen.paint(()=>{
    const hx=bx+dir*(-0)+ (bx-ax)*0.10, hy=by+(by-ay)*0.10;
    const nx=(bx-ax), ny=(by-ay); const L=Math.hypot(nx,ny)||1;
    const ux=nx/L, uy=ny/L, px=-uy, py=ux;
    g.moveTo(hx, hy);
    g.lineTo(hx-ux*U*0.34+px*U*0.14, hy-uy*U*0.34+py*U*0.14);
    g.lineTo(hx-ux*U*0.20, hy-uy*U*0.20);
    g.lineTo(hx-ux*U*0.34-px*U*0.14, hy-uy*U*0.34-py*U*0.14);
    g.closePath();
  }, T_HOOF(), 3);
}
function drawPole(pen, W, cx, poleY, U, dir){
  const g=pen.ctx;
  // a long carry-pole across the top, sagging under the weight
  pen.limb(()=>{ g.moveTo(cx-W*0.42, poleY-U*0.10);
    g.quadraticCurveTo(cx, poleY+U*0.16, cx+W*0.42, poleY-U*0.10); }, T_POLE(), U*0.10);
  // two lashings binding the fore/hind hoof pairs to the pole
  for(const lx of [cx+dir*U*0.30, cx-dir*U*0.30]){
    pen.limb(()=>{ g.moveTo(lx-U*0.12, poleY+U*0.02); g.lineTo(lx+U*0.12, poleY+U*0.28); }, T_ROPE(), U*0.05);
    pen.limb(()=>{ g.moveTo(lx+U*0.12, poleY+U*0.02); g.lineTo(lx-U*0.12, poleY+U*0.28); }, T_ROPE(), U*0.05);
  }
}
function drawBlade(pen, bx, by, U, dir){
  const g=pen.ctx;
  // a butcher's cut-seam laid along the belly + a small knife
  g.strokeStyle=INK; g.lineWidth=2.6; g.setLineDash([9,7]);
  g.beginPath(); g.moveTo(bx-dir*U*0.85, by); g.lineTo(bx+dir*U*0.75, by-U*0.10); g.stroke();
  g.setLineDash([]);
  pen.limb(()=>{ g.moveTo(bx+dir*U*0.70, by-U*0.06); g.lineTo(bx+dir*U*1.05, by+U*0.18); }, T_HOOF(), U*0.05); // blade
  pen.limb(()=>{ g.moveTo(bx+dir*U*1.02, by+U*0.14); g.lineTo(bx+dir*U*1.22, by+U*0.30); }, T_SPEAR(), U*0.07); // haft
}
function drawFire(pen, cx, groundY, U){
  const g=pen.ctx;
  // ember/log bed
  pen.paint(()=>{ g.ellipse(cx, groundY+U*0.10, U*1.20, U*0.20, 0,0,TAU); }, T_EMBER(), 3);
  // flames — layered light-core over darker body, licking up
  const flame=(x, h, wdt, tone)=> pen.paint(()=>{
    g.moveTo(x-wdt, groundY+U*0.02);
    g.quadraticCurveTo(x-wdt*0.5, groundY-h*0.5, x-wdt*0.15, groundY-h*0.86);
    g.quadraticCurveTo(x, groundY-h, x+wdt*0.18, groundY-h*0.82);
    g.quadraticCurveTo(x+wdt*0.6, groundY-h*0.4, x+wdt, groundY+U*0.02);
    g.closePath();
  }, tone, 2.6);
  for(let i=-2;i<=2;i++){ const x=cx+i*U*0.42;
    flame(x, U*(0.72+0.16*(2-Math.abs(i))), U*0.30, T_FIRE()); }
  for(let i=-1;i<=1;i++){ const x=cx+i*U*0.42;
    flame(x, U*(0.50+0.12*(1-Math.abs(i))), U*0.18, T_FIREHOT()); }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const t = state.t || 0;
  const pose = state.pose || "alert";
  const Pp = poseFor(pose);
  const dir = +1;
  const U = Math.min(W,H) * 0.185;
  const cx = (Pp.mode==="downed") ? W*0.42 : W*0.52;   // slide the downed carcass left so head/antlers stay in frame
  const groundY = H*Pp.groundY;

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  // water goes behind the drinking stag
  if (pose==="drink") drawWater(pen, W, H, groundY);

  // body-center per mode
  let BC;
  if (Pp.mode==="stand"||Pp.mode==="buckle") BC = P(cx, groundY - U*1.15 - U*0.56);
  else if (Pp.mode==="hung")   BC = P(cx, H*0.58);
  else if (Pp.mode==="downed") BC = P(cx, groundY - U*0.42);
  else if (Pp.mode==="spit")   BC = P(cx, groundY - U*0.66);
  else BC = P(cx, groundY - U*1.7);

  // ground shadow (skip for hung — it's aloft)
  if (Pp.mode!=="hung"){
    ctx.save(); ctx.fillStyle="rgba(0,0,0,0.09)";
    ctx.beginPath(); ctx.ellipse(cx, groundY+5, U*1.35, U*0.15, 0,0,TAU); ctx.fill(); ctx.restore();
  }

  // pole first (carried) so hooves lash up onto it
  const poleY = H*0.30;
  if (Pp.pole) drawPole(pen, W, cx, poleY, U, dir);
  // spit rod first (feast) so the body sits on it
  if (Pp.fire){
    pen.limb(()=>{ pen.ctx.moveTo(cx-W*0.44, BC.y+U*0.05); pen.ctx.lineTo(cx+W*0.44, BC.y+U*0.05); }, T_POLE(), U*0.07);
  }

  const feet = feetFor(Pp.mode, BC, U, dir, Pp.mode==="hung"?poleY:groundY);

  // downed / spit lie the body over on its side via a small rotation
  ctx.save();
  if (Pp.mode==="downed"){ ctx.translate(BC.x,BC.y); ctx.rotate(0.10); ctx.translate(-BC.x,-BC.y); }
  const r = drawStag(pen, BC, U, dir, {
    headDrop:Pp.headDrop, headTilt:Pp.headTilt, tailUp:Pp.tailUp, gaze:Pp.gaze,
    ...feet,
  });
  ctx.restore();

  // props over the body
  if (Pp.spear) drawSpear(pen, BC.x-dir*U*0.10, BC.y-U*0.05, U, dir);
  if (Pp.blade) drawBlade(pen, BC.x, BC.y+U*0.30, U, dir);
  if (Pp.fire)  drawFire(pen, cx, groundY, U);

  return r;
}

export const asset = {
  id:"creature.great-stag",
  type:"CREATURE",
  name:"Great stag",
  statusWord:"NOBLE",
  scene:"OD-B10-S03",

  // procedural knobs
  params:{
    scale:1.3,            // a LARGE stag (the prize of Aeaea)
    antlerScale:1.06,     // spread of the branching antlers
    tines:4,              // brow + bez + trez + crown points per beam
    hide:"#d8d2c4",       // pale deer hide
    collision:true,       // barrel + leg footprint used for scene collision
  },
  // back -> front draw order (honored internally)
  layers:["ground","water","shadow","pole","spit","far-legs","barrel","haunch",
          "belly","tail","neck","far-antler","head","near-antler","near-legs",
          "spear","blade","fire"],
  // normalized 0..1 attention / contact / anchor points (neutral ALERT pose)
  anchors:{
    "stag:head":{x:.72,y:.20},
    "stag:antlers":{x:.66,y:.10},
    "stag:muzzle":{x:.78,y:.26},
    "stag:withers":{x:.60,y:.38},
    "stag:heart":{x:.46,y:.52},        // the spear/kill target on the flank
    "stag:haunch":{x:.34,y:.44},
    "stag:belly":{x:.50,y:.60},
    "water:line":{x:.80,y:.80},        // drinking pool surface
    "carry:pole":{x:.52,y:.30},        // shoulder-pole for the carried state
    "fire:pit":{x:.52,y:.86},          // feast fire
    "entrance:glade":{x:.04,y:.80},
    "exit:ship":{x:.96,y:.80},
    "camera:stag":{x:.52,y:.46},
  },
  // body / pathing footprints for placement + collision
  zones:{
    "body:barrel":{ x0:.34,y0:.36,x1:.72,y1:.62 },
    walkable:{ x0:.04,y0:.66,x1:.96,y1:.94 },
  },
  states:{
    initial:"alert",
    nodes:{
      drink:{     preview:{ pose:"drink",     t:0.2 } },  // head down at the pool
      alert:{     preview:{ pose:"alert",     t:0.0 } },  // the noble silhouette, head high
      struck:{    preview:{ pose:"struck",    t:0.3 } },  // spear through the flank, buckling
      carried:{   preview:{ pose:"carried",   t:0.5 } },  // trussed to the shoulder-pole
      butchered:{ preview:{ pose:"butchered", t:0.6 } },  // downed carcass, cut-seam + blade
      feast:{     preview:{ pose:"feast",     t:0.7 } },  // whole stag on the spit over flames
    },
    edges:[
      ["drink","alert"],["alert","struck"],["struck","carried"],
      ["carried","butchered"],["butchered","feast"],["alert","drink"],
    ],
  },
  channels:["pose","headDrop","headTilt","gaze","tailUp","t"],

  preview:()=>({ pose:"alert", t:0, status:"NOBLE", progress:.2 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
