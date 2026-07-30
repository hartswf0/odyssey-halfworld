/* creature.parnassus-boar — the great boar of Parnassus that Odysseus and the
   sons of Autolycus rouse from its lair, and whose tusk lays open his knee:
   the wound Eurycleia's hands find on the footstool in Book XIX.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. A heavy WILD BOAR in profile facing +dir:
     · a front-heavy wedge BARREL — towering shoulder hump, narrow rump
     · a saw of BRISTLES riding the spine from rump to poll (rises when roused)
     · four short thick articulated LEGS (upper/lower + cloven hoof block)
     · a long low wedge HEAD, heavy jowl, small high eye, blunt snout disc
     · a pair of PALE CURVED TUSKS off the lower jaw + upper whetters — the
       read that names this creature, kept near paper-white so they cut out
       of the dark head at any size.
   States (channels drive them):
     bed      — couched in the thicket lair: body sunk low, brush drawn IN
                FRONT so only crest, eye and one tusk clear the cover.
     erupt    — the lair bursts: forequarters heaved up off the ground,
                bristles flared, brush shards thrown outward.
     charge   — the run: legs at full reach, head low, broken speed dashes.
     gore     — head slung up and over, the tusk arc swept through, three
                slash marks left at the top of the sweep (the scar).
     impact   — a hunting spear driven down through the shoulder hump.
     collapse — forequarters pitching down, forelegs folded under, snout
                driven into the ground.
     carcass  — the downed body: legs stiff, spear still standing in the
                shoulder, head lolled back with the tusks turned up.
   Drawn in SOLID grays + hard contour; the engine POST pass supplies the
   dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B19-S05 — the hidden animal through bed, charge, gore and kill. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
/* deterministic 0..1 from an integer seed (engine `rnd` returns a generator;
   every jitter here wants a pure value, so hash locally) */
function R(n){
  let s = ((n|0)*2654435761) >>> 0; if(!s) s = 1;
  s ^= s<<13; s>>>=0; s ^= s>>>17; s ^= s<<5; s>>>=0;
  return (s % 100000) / 100000;
}

/* ---- tone levels (flat grays; the POST pass turns them into dots).
   The hide is kept LIGHT-MID so the bristle saw, the short black legs and
   the near-white tusks all read as accents against it. Plenty of paper. ---- */
const T_HIDE  = ()=> toneSolid(inkLevel(3));   // coarse boar hide (light-mid)
const T_BELLY = ()=> toneSolid(inkLevel(1));   // pale underbelly (form)
const T_HUMP  = ()=> toneSolid(inkLevel(4));   // shoulder mass (the boar's mark)
const T_HAUNCH= ()=> toneSolid(inkLevel(4));
const T_HEAD  = ()=> toneSolid(inkLevel(4));   // long wedge head
const T_JOWL  = ()=> toneSolid(inkLevel(2));   // pale cheek — keeps the head open
const T_SNOUT = ()=> toneSolid(inkLevel(2));   // blunt rooting disc
const T_EAR   = ()=> toneSolid(inkLevel(5));
const T_CREST = ()=> toneSolid(inkLevel(6));   // bristle saw along the spine
const T_LEGN  = ()=> toneSolid(inkLevel(5));   // near legs (bold)
const T_LEGF  = ()=> toneSolid(inkLevel(3));   // far legs (dimmer, inset)
const T_HOOF  = ()=> toneSolid(inkLevel(7));   // hard cloven hoof
const T_TUSKN = ()=> toneSolid(inkLevel(0));   // near tusk — paper-white, hard contour
const T_TUSKF = ()=> toneSolid(inkLevel(2));   // far tusk (behind the muzzle)
const T_TAIL  = ()=> toneSolid(inkLevel(5));
const T_BRUSHN= ()=> toneSolid(inkLevel(4));   // foreground thicket (occludes)
const T_BRUSHF= ()=> toneSolid(inkLevel(1));   // background thicket (light)
const T_SPEAR = ()=> toneSolid(inkLevel(6));   // hunting spear shaft
const T_BRONZE= ()=> toneSolid(inkLevel(7));   // socket collar / blade

/* quadratic point */
function qz(p0,c,p1,t){
  const u=1-t;
  return P(u*u*p0.x + 2*u*t*c.x + t*t*p1.x, u*u*p0.y + 2*u*t*c.y + t*t*p1.y);
}

/* ---------------------------------------------------------------- TUSK
   One crescent tusk in HEAD-LOCAL space. Bulges forward off the jaw, then
   sweeps up (s=+1) or down (s=-1) to a point. Kept near-white on purpose:
   in the dot lattice a light shape inside a dark head is the only thing that
   survives at card size. */
function drawTusk(pen, base, TL, dir, w, tone, s=1){
  const g = pen.ctx;
  const tip = P(base.x + dir*TL*0.46, base.y - s*TL*0.95);
  pen.paint(()=>{
    g.moveTo(base.x - dir*w*0.45, base.y);
    g.quadraticCurveTo(base.x + dir*TL*0.94, base.y - s*TL*0.22, tip.x, tip.y);
    g.quadraticCurveTo(base.x + dir*TL*0.32, base.y - s*TL*0.30,
                       base.x + dir*w*0.55, base.y + s*w*0.16);
    g.closePath();
  }, tone, 3.4);
  return tip;
}

/* ---------------------------------------------------------------- HEAD
   Long low wedge + jowl + snout disc + ears + both tusk pairs, in a LOCAL
   frame the caller has translated/rotated to HC. dir points the snout.
   Returns the near-tusk tip in local space so the caller can hang the gore
   sweep off it. */
function drawHead(pen, hr, dir, { gaze=0, tuskScale=1 }={}){
  const g = pen.ctx;

  // ---- FAR ear, then FAR lower tusk (peeks past the muzzle) ----
  pen.paint(()=>{
    g.moveTo(-dir*hr*0.14, -hr*0.54);
    g.quadraticCurveTo(-dir*hr*0.22, -hr*0.94, dir*hr*0.12, -hr*1.06);
    g.quadraticCurveTo(dir*hr*0.22, -hr*0.80, dir*hr*0.20, -hr*0.60);
    g.closePath();
  }, T_EAR(), 3);
  drawTusk(pen, P(dir*hr*0.84, hr*0.58), hr*1.04*tuskScale, dir, hr*0.20, T_TUSKF(), 1);

  // ---- the wedge SKULL: poll -> forehead ridge -> long snout -> jowl ----
  pen.paint(()=>{
    g.moveTo(-dir*hr*0.62, -hr*0.50);                                   // poll
    g.quadraticCurveTo(dir*hr*0.10, -hr*0.80, dir*hr*0.74, -hr*0.62);   // forehead ridge
    g.quadraticCurveTo(dir*hr*1.34, -hr*0.48, dir*hr*1.58, -hr*0.10);   // snout bridge
    g.quadraticCurveTo(dir*hr*1.74, hr*0.16, dir*hr*1.50, hr*0.31);     // disc front
    g.quadraticCurveTo(dir*hr*1.18, hr*0.46, dir*hr*0.86, hr*0.54);     // mouth line
    g.quadraticCurveTo(dir*hr*0.18, hr*0.76, -dir*hr*0.32, hr*0.54);    // heavy jowl
    g.quadraticCurveTo(-dir*hr*0.74, hr*0.16, -dir*hr*0.62, -hr*0.50);  // throat -> poll
    g.closePath();
  }, T_HEAD(), 4);

  // pale cheek + pale snout disc keep the head from printing as one black mass
  pen.paint(()=>{ g.ellipse(dir*hr*0.30, hr*0.24, hr*0.56, hr*0.28, 0.10*dir, 0, TAU); }, T_JOWL(), 0);
  pen.paint(()=>{ g.ellipse(dir*hr*1.48, hr*0.04, hr*0.21, hr*0.27, 0.22*dir, 0, TAU); }, T_SNOUT(), 3);
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(dir*hr*1.50, -hr*0.05, hr*0.055, hr*0.045, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(dir*hr*1.46, hr*0.13, hr*0.055, hr*0.045, 0,0,TAU); g.fill();

  // ---- NEAR ear: a clean pricked triangle forward of the poll ----
  pen.paint(()=>{
    g.moveTo(dir*hr*0.12, -hr*0.62);
    g.quadraticCurveTo(dir*hr*0.06, -hr*1.06, dir*hr*0.44, -hr*1.20);
    g.quadraticCurveTo(dir*hr*0.54, -hr*0.86, dir*hr*0.48, -hr*0.66);
    g.closePath();
  }, T_EAR(), 3.4);

  // ---- small high EYE: bright ring + dark pupil + a heavy brow slash ----
  const ex = dir*hr*0.44, ey = -hr*0.30 + gaze*hr*0.12;
  g.fillStyle="#f4f4f0"; g.beginPath(); g.ellipse(ex, ey, hr*0.115, hr*0.105, 0,0,TAU); g.fill();
  g.strokeStyle=INK; g.lineWidth=2.4; g.stroke();
  g.fillStyle=INK; g.beginPath(); g.ellipse(ex+dir*hr*0.02, ey, hr*0.052, hr*0.052, 0,0,TAU); g.fill();
  pen.seam(()=>{ g.moveTo(ex-dir*hr*0.16, ey-hr*0.20); g.lineTo(ex+dir*hr*0.20, ey-hr*0.15); }, 3.2);

  // ---- upper WHETTER (short, curving down off the upper jaw) ----
  drawTusk(pen, P(dir*hr*1.26, hr*0.10), hr*0.52*tuskScale, dir, hr*0.16, T_TUSKN(), -1);
  // ---- NEAR lower TUSK: the identity mark. Big, pale, hard-edged, and it
  // must clear the muzzle line so it survives the dot lattice at card size. --
  const tip = drawTusk(pen, P(dir*hr*1.02, hr*0.50), hr*1.30*tuskScale, dir, hr*0.26, T_TUSKN(), 1);
  return tip;
}

/* --------------------------------------------------------------- CREST
   The bristle saw: sampled along the back curve, spikes leaning back, tallest
   over the hump. One filled polygon (spikes + a thin ridge band) so the dot
   pass gets a clean dark accent instead of a hedge of separate outlines. */
function drawCrest(pen, BC, rx, ry, dir, U, bristle){
  const g = pen.ctx;
  const A = P(BC.x - dir*rx*0.95, BC.y - ry*0.20);   // rump top
  const C = P(BC.x - dir*rx*0.30, BC.y - ry*0.80);
  const Bp= P(BC.x + dir*rx*0.45, BC.y - ry*1.14);   // hump peak
  const C2= P(BC.x + dir*rx*0.82, BC.y - ry*1.08);
  const E = P(BC.x + dir*rx*1.00, BC.y - ry*0.60);   // neck root
  const N = 14, pts = [];
  for (let i=0;i<=N;i++){
    const u = i/N;
    pts.push(u<0.62 ? qz(A,C,Bp, u/0.62) : qz(Bp,C2,E,(u-0.62)/0.38));
  }
  const base = U*0.125*bristle;
  pen.paint(()=>{
    g.moveTo(pts[0].x, pts[0].y);
    for (let i=0;i<N;i++){
      const p=pts[i], q=pts[i+1];
      const w = 0.40 + 0.60*Math.sin(Math.PI*Math.min(1,Math.max(0,(i+0.5)/N)));
      const h = base*(w + 0.34*R(i*11+5));
      const mx=(p.x+q.x)/2, my=(p.y+q.y)/2;
      g.lineTo(mx - dir*h*0.30, my - h);      // spike leans back over the spine
      g.lineTo(q.x, q.y);
    }
    for (let i=N;i>=0;i--) g.lineTo(pts[i].x, pts[i].y + U*0.022);
    g.closePath();
  }, T_CREST(), 2.4);
}

/* ----------------------------------------------------------------- LEG
   Short thick two-segment leg + a small cloven hoof block. */
function drawLeg(pen, hip, foot, w, tone, bend){
  const g = pen.ctx;
  const knee = P(lerp(hip.x,foot.x,0.5)+bend, lerp(hip.y,foot.y,0.56));
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.74);
  pen.paint(()=>{ g.rect(foot.x - w*0.44, foot.y - w*0.04, w*0.88, w*0.44); }, T_HOOF(), 2.4);
  pen.seam(()=>{ g.moveTo(foot.x, foot.y+w*0.02); g.lineTo(foot.x, foot.y+w*0.40); }, 1.8);
}

/* ---------------------------------------------------------------- BOAR
   The whole animal around body-center BC, unit U, facing dir. Pose knobs in o:
     footFN/footFF/footHN/footHF, bendF/bendH, headDrop 0..1, headTilt,
     gaze, bristle. Returns { HC, hr, tuskTipWorld } for props/anchors. */
function drawBoar(pen, BC, U, dir, o={}){
  const g = pen.ctx;
  const rx = U*1.25, ry = U*0.62;
  const headDrop = o.headDrop ?? 0.4;
  const bristle = o.bristle ?? 1;

  const foreHipN = P(BC.x + dir*rx*0.60, BC.y + ry*0.42);
  const foreHipF = P(foreHipN.x - dir*U*0.20, foreHipN.y - U*0.03);
  const hindHipN = P(BC.x - dir*rx*0.62, BC.y + ry*0.40);
  const hindHipF = P(hindHipN.x - dir*U*0.20, hindHipN.y - U*0.03);
  const legW = U*0.155;

  // ---- FAR legs first (behind, dimmer) ----
  drawLeg(pen, foreHipF, o.footFF||P(foreHipF.x, BC.y+U*1.2), legW*0.86, T_LEGF(),  (o.bendF||0)*0.8);
  drawLeg(pen, hindHipF, o.footHF||P(hindHipF.x, BC.y+U*1.2), legW*0.86, T_LEGF(), -(o.bendH||0)*0.8);

  // ---- BARREL: front-heavy wedge, towering at the shoulder, narrow behind ----
  pen.paint(()=>{
    g.moveTo(BC.x - dir*rx*0.95, BC.y - ry*0.20);                        // rump top
    g.quadraticCurveTo(BC.x - dir*rx*0.30, BC.y - ry*0.80,
                       BC.x + dir*rx*0.45, BC.y - ry*1.14);              // hump peak
    g.quadraticCurveTo(BC.x + dir*rx*0.92, BC.y - ry*1.04,
                       BC.x + dir*rx*1.02, BC.y - ry*0.30);              // chest front
    g.quadraticCurveTo(BC.x + dir*rx*1.00, BC.y + ry*0.62,
                       BC.x + dir*rx*0.48, BC.y + ry*0.90);              // brisket -> belly
    g.quadraticCurveTo(BC.x - dir*rx*0.28, BC.y + ry*1.00,
                       BC.x - dir*rx*0.86, BC.y + ry*0.52);              // belly -> haunch
    g.quadraticCurveTo(BC.x - dir*rx*1.10, BC.y + ry*0.14,
                       BC.x - dir*rx*0.95, BC.y - ry*0.20);
    g.closePath();
  }, T_HIDE(), 5);

  // shoulder hump mass + haunch + a pale underbelly: three planes, no gradients
  pen.paint(()=>{ g.ellipse(BC.x + dir*rx*0.42, BC.y - ry*0.70, rx*0.40, ry*0.40, 0,0,TAU); }, T_HUMP(), 0);
  pen.paint(()=>{ g.ellipse(BC.x - dir*rx*0.66, BC.y - ry*0.02, rx*0.30, ry*0.58, 0,0,TAU); }, T_HAUNCH(), 0);
  pen.paint(()=>{ g.ellipse(BC.x - dir*rx*0.04, BC.y + ry*0.58, rx*0.74, ry*0.32, 0,0,TAU); }, T_BELLY(), 0);
  // one short hide seam (the shoulder fold) — accent, not texture
  pen.seam(()=>{ g.moveTo(BC.x + dir*rx*0.14, BC.y - ry*0.62); g.lineTo(BC.x + dir*rx*0.06, BC.y + ry*0.16); }, 2.6);

  // ---- thin curled TAIL (a stroke, not a block) ----
  {
    const tb = P(BC.x - dir*rx*0.94, BC.y - ry*0.16);
    pen.limb(()=>{
      g.moveTo(tb.x, tb.y);
      g.quadraticCurveTo(tb.x - dir*U*0.22, tb.y - U*0.10, tb.x - dir*U*0.17, tb.y + U*0.08);
      g.quadraticCurveTo(tb.x - dir*U*0.13, tb.y + U*0.19, tb.x - dir*U*0.25, tb.y + U*0.17);
    }, T_TAIL(), U*0.032);
  }

  // ---- bristle CREST over the back ----
  drawCrest(pen, BC, rx, ry, dir, U, bristle);

  // ---- HEAD: the skull hangs LOW and FORWARD off the hump — the notch
  // between the shoulder crest and the head is what names a boar ----
  const HChigh = P(BC.x + dir*rx*1.00, BC.y - ry*0.62);
  const HClow  = P(BC.x + dir*rx*1.06, BC.y + ry*0.86);
  const HC = P(lerp(HChigh.x,HClow.x,headDrop), lerp(HChigh.y,HClow.y,headDrop));
  const hr = U*0.50;
  // short throat wedge bridging chest to skull so the head is not a floating part
  pen.paint(()=>{
    g.moveTo(BC.x + dir*rx*0.80, BC.y - ry*0.84);
    g.lineTo(HC.x - dir*hr*0.42, HC.y - hr*0.46);
    g.lineTo(HC.x - dir*hr*0.18, HC.y + hr*0.50);
    g.quadraticCurveTo(BC.x + dir*rx*0.92, BC.y + ry*0.42, BC.x + dir*rx*0.78, BC.y + ry*0.14);
    g.closePath();
  }, T_HIDE(), 4);

  const tilt = (o.headTilt!=null) ? o.headTilt : lerp(-0.15, 0.72, headDrop);
  g.save(); g.translate(HC.x, HC.y); g.rotate(tilt*dir);
  const tl = drawHead(pen, hr, dir, { gaze:o.gaze||0, tuskScale:o.tuskScale||1 });
  g.restore();
  const ct=Math.cos(tilt*dir), st=Math.sin(tilt*dir);
  const tuskTip = P(HC.x + tl.x*ct - tl.y*st, HC.y + tl.x*st + tl.y*ct);

  // ---- NEAR legs (over the body) ----
  drawLeg(pen, foreHipN, o.footFN||P(foreHipN.x, BC.y+U*1.25), legW, T_LEGN(),  (o.bendF||0));
  drawLeg(pen, hindHipN, o.footHN||P(hindHipN.x, BC.y+U*1.25), legW, T_LEGN(), -(o.bendH||0));

  return { HC, hr, tuskTip, rx, ry };
}

/* ------------------------------------------------------ pose resolver */
function poseFor(pose){
  switch(pose){
    case "bed":      return { mode:"couch",  headDrop:0.62, headTilt:0.30,  bristle:0.65, brush:"cover", gaze:0.4 };
    case "erupt":    return { mode:"rear",   headDrop:0.08, headTilt:-0.30, bristle:1.45, brush:"burst", gaze:-0.4 };
    case "charge":   return { mode:"run",    headDrop:0.62, headTilt:0.26,  bristle:1.30, dash:1, gaze:0.2 };
    case "gore":     return { mode:"drive",  headDrop:0.30, headTilt:-0.52, bristle:1.35, sweep:1, gaze:-0.5 };
    case "impact":
    case "spear-impact": return { mode:"struck", headDrop:0.34, headTilt:-0.28, bristle:1.15, spear:1, gaze:-0.3 };
    case "collapse": return { mode:"pitch",  headDrop:1.00, headTilt:0.58,  bristle:0.80, spear:1, gaze:0.6 };
    case "carcass":  return { mode:"downed", headDrop:0.58, headTilt:-0.52, bristle:0.50, spear:1, dead:1, gaze:0 };
    default:         return { mode:"run",    headDrop:0.60, headTilt:0.24,  bristle:1.2, gaze:0 };
  }
}

/* four foot targets + knee bends per mode */
function feetFor(mode, BC, U, dir, groundY){
  const rx=U*1.25, ry=U*0.62;
  const fx = BC.x + dir*rx*0.60, hx = BC.x - dir*rx*0.62;
  if (mode==="run"){   // full extension: forelegs reaching, hind legs trailing
    return { footFN:P(fx+dir*U*0.50, groundY-U*0.16), footFF:P(fx+dir*U*0.22, groundY-U*0.02),
             footHN:P(hx-dir*U*0.42, groundY-U*0.10), footHF:P(hx-dir*U*0.14, groundY),
             bendF:dir*U*0.14, bendH:-dir*U*0.08 };
  }
  if (mode==="drive"){ // gore: braced wide, hind driving, forelegs planted short
    return { footFN:P(fx+dir*U*0.30, groundY), footFF:P(fx+dir*U*0.10, groundY-U*0.03),
             footHN:P(hx-dir*U*0.44, groundY), footHF:P(hx-dir*U*0.62, groundY-U*0.03),
             bendF:dir*U*0.14, bendH:-dir*U*0.24 };
  }
  if (mode==="rear"){  // erupt: forelegs clawing up and out, hind under the mass
    return { footFN:P(fx+dir*U*0.66, groundY-U*1.10), footFF:P(fx+dir*U*0.34, groundY-U*0.86),
             footHN:P(hx-dir*U*0.16, groundY),        footHF:P(hx-dir*U*0.38, groundY-U*0.03),
             bendF:dir*U*0.34, bendH:-dir*U*0.18 };
  }
  if (mode==="couch"){ // bed: legs folded under the body in the hollow
    return { footFN:P(fx+dir*U*0.06, groundY), footFF:P(fx-dir*U*0.14, groundY-U*0.04),
             footHN:P(hx+dir*U*0.10, groundY), footHF:P(hx-dir*U*0.10, groundY-U*0.04),
             bendF:dir*U*0.40, bendH:-dir*U*0.40 };
  }
  if (mode==="struck"){ // spear in: forelegs stiffening, hind splayed back
    return { footFN:P(fx+dir*U*0.10, groundY), footFF:P(fx-dir*U*0.16, groundY-U*0.03),
             footHN:P(hx-dir*U*0.48, groundY), footHF:P(hx-dir*U*0.68, groundY-U*0.03),
             bendF:-dir*U*0.26, bendH:-dir*U*0.30 };
  }
  if (mode==="pitch"){ // collapse: forelegs folded under, hind still braced back
    return { footFN:P(fx-dir*U*0.34, groundY), footFF:P(fx-dir*U*0.52, groundY-U*0.04),
             footHN:P(hx-dir*U*0.50, groundY), footHF:P(hx-dir*U*0.72, groundY-U*0.03),
             bendF:dir*U*0.52, bendH:-dir*U*0.22 };
  }
  if (mode==="downed"){ // carcass: legs stiff, sticking UP off the fallen body
    return { footFN:P(fx+dir*U*0.42, groundY-U*1.30), footFF:P(fx+dir*U*0.72, groundY-U*1.06),
             footHN:P(hx+dir*U*0.02, groundY-U*1.24), footHF:P(hx+dir*U*0.32, groundY-U*1.02),
             bendF:-dir*U*0.34, bendH:dir*U*0.30 };
  }
  return feetFor("run",BC,U,dir,groundY);
}

/* --------------------------------------------------------------- props */
/* one clump of thicket brush — spiky, deliberately BROKEN into clumps so no
   span ever crosses the frame as a bar */
function drawBrush(pen, x, baseY, h, w, tone, seed, lean){
  const g = pen.ctx;
  const n = 5;
  for (let k=0;k<n;k++){
    const r1 = R(seed*13 + k*3 + 1), r2 = R(seed*29 + k*7 + 2);
    const sx = x + (k-(n-1)/2)*w*0.40 + (r1-0.5)*w*0.20;
    const hh = h*(0.52 + 0.62*r2);
    const tx = sx + lean*hh*0.26 + (r1-0.5)*hh*0.24;
    pen.paint(()=>{
      g.moveTo(sx - w*0.15, baseY);
      g.quadraticCurveTo(sx - w*0.06 + lean*hh*0.10, baseY-hh*0.55, tx, baseY-hh);
      g.quadraticCurveTo(sx + w*0.10 + lean*hh*0.10, baseY-hh*0.50, sx + w*0.15, baseY);
      g.closePath();
    }, tone, 2.4);
  }
}
function drawThicketBack(pen, W, groundY, U){
  // three broken clumps, light, well apart — never a continuous band
  drawBrush(pen, W*0.11, groundY-U*0.06, U*0.66, U*0.34, T_BRUSHF(), 3,  -0.6);
  drawBrush(pen, W*0.45, groundY-U*0.10, U*0.40, U*0.28, T_BRUSHF(), 11,  0.3);
  drawBrush(pen, W*0.86, groundY-U*0.06, U*0.74, U*0.34, T_BRUSHF(), 19,  0.7);
}
function drawThicketFront(pen, W, groundY, U){
  // the cover the boar is lying inside — three clumps only, with real paper
  // gaps between them, and NOTHING past W*0.66 so the head, eye and tusk
  // stay clear of the brush (the whole point of the bed state)
  drawBrush(pen, W*0.14, groundY+U*0.14, U*0.58, U*0.32, T_BRUSHN(), 31, -0.5);
  drawBrush(pen, W*0.40, groundY+U*0.16, U*0.50, U*0.30, T_BRUSHN(), 43,  0.4);
  drawBrush(pen, W*0.63, groundY+U*0.14, U*0.42, U*0.26, T_BRUSHN(), 57,  0.8);
}
function drawBurst(pen, cx, cy, U){
  // shards of the lair thrown outward as the boar comes up
  const g = pen.ctx;
  g.strokeStyle = INK; g.lineCap="round";
  for (let i=0;i<11;i++){
    const a = -Math.PI*0.92 + (i/10)*Math.PI*0.84 + (R(i*17+3)-0.5)*0.16;
    const r0 = U*(0.55 + 0.30*R(i*23+1)), r1 = r0 + U*(0.26 + 0.34*R(i*31+7));
    g.lineWidth = 2.2 + 3.0*R(i*37+5);
    g.beginPath();
    g.moveTo(cx + Math.cos(a)*r0, cy + Math.sin(a)*r0);
    g.lineTo(cx + Math.cos(a)*r1, cy + Math.sin(a)*r1);
    g.stroke();
  }
}
function drawDashes(pen, BC, U, dir, W){
  // broken speed marks trailing the run — short, staggered, never a full span
  const g = pen.ctx;
  g.strokeStyle = INK; g.lineCap="round"; g.lineWidth = 3.4;
  const rows = [-0.66, -0.16, 0.36];
  const xMin = W*0.05;
  for (let r=0;r<rows.length;r++){
    const y = BC.y + U*rows[r];
    for (let k=0;k<2;k++){
      const x0 = BC.x - dir*(U*(1.36 + k*0.34) + U*0.12*R(r*9+k));
      const len = U*(0.17 + 0.13*R(r*13+k+4));
      const x1 = Math.max(xMin, x0 - dir*len);
      if (x0 <= xMin) continue;                       // never let a mark clip the frame
      g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
    }
  }
}
function drawSweep(pen, tip, U, dir){
  // the gore: the arc the tusk has just torn through, ending in three slashes
  const g = pen.ctx;
  const cx = tip.x - dir*U*0.55, cy = tip.y + U*0.62;
  g.strokeStyle = INK; g.lineCap="round";
  for (let i=0;i<3;i++){
    const R = U*(0.80 + i*0.17);
    g.lineWidth = 3.6 - i*0.9;
    g.setLineDash([U*0.20, U*0.13]);
    g.beginPath();
    g.arc(cx, cy, R, -Math.PI*0.92, -Math.PI*0.30, false);
    g.stroke();
  }
  g.setLineDash([]);
  // three slash marks at the top of the sweep — the scar the nurse will find
  for (let i=0;i<3;i++){
    const x = tip.x + dir*U*(0.16 + i*0.20), y = tip.y - U*(0.34 - i*0.07);
    g.lineWidth = 4.2 - i*0.7;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + dir*U*0.20, y - U*0.30); g.stroke();
  }
}
function drawSpear(pen, hx, hy, U, dir, dead){
  const g = pen.ctx;
  // shaft driven down through the shoulder hump from up-front
  const ax = hx + dir*U*(dead?0.55:1.05), ay = hy - U*(dead?1.55:1.70);
  pen.limb(()=>{ g.moveTo(ax,ay); g.lineTo(hx,hy); }, T_SPEAR(), U*0.075);
  // bronze socket collar just above the hide
  const t = 0.20;
  const sx = lerp(hx,ax,t), sy = lerp(hy,ay,t);
  pen.paint(()=>{
    const nx=(ax-hx), ny=(ay-hy), L=Math.hypot(nx,ny)||1;
    const ux=nx/L, uy=ny/L, px=-uy, py=ux;
    g.moveTo(sx+px*U*0.075, sy+py*U*0.075);
    g.lineTo(sx+ux*U*0.20+px*U*0.055, sy+uy*U*0.20+py*U*0.055);
    g.lineTo(sx+ux*U*0.20-px*U*0.055, sy+uy*U*0.20-py*U*0.055);
    g.lineTo(sx-px*U*0.075, sy-py*U*0.075);
    g.closePath();
  }, T_BRONZE(), 2.6);
  // short entry burst at the hide
  g.strokeStyle=INK; g.lineWidth=3.0; g.lineCap="round";
  for (let i=0;i<5;i++){
    const a = -Math.PI*0.85 + i*0.38;
    g.beginPath(); g.moveTo(hx, hy);
    g.lineTo(hx + Math.cos(a)*U*0.26, hy + Math.sin(a)*U*0.26); g.stroke();
  }
}

/* ---------------------------------------------------------------- draw */
function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const pose = state.pose || "charge";
  const Pp = poseFor(pose);
  const dir = +1;
  const U = Math.min(W,H) * 0.225;
  const rx = U*1.25, ry = U*0.62, legLen = U*0.62;
  const groundY = (Pp.mode==="couch"||Pp.mode==="downed") ? H*0.64 : H*0.72;
  const cx = (Pp.mode==="drive") ? W*0.42
           : (Pp.mode==="downed") ? W*0.42
           : (Pp.mode==="rear")   ? W*0.52
           : W*0.40;

  // faint shared ground line
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, groundY+2); ctx.lineTo(W*0.97, groundY+2); ctx.stroke(); ctx.restore();

  // background thicket for the lair states
  if (Pp.brush) drawThicketBack(pen, W, groundY, U);

  // body center per mode
  let BC, rot=0, pivot=null;
  if (Pp.mode==="couch"){      BC = P(cx, groundY - ry*0.74); }
  else if (Pp.mode==="downed"){BC = P(cx, groundY - ry*0.54); rot=0.08; pivot=P(cx,groundY); }
  else if (Pp.mode==="pitch"){ BC = P(cx, groundY - legLen*0.42 - ry*0.95); rot=0.30; pivot=P(cx+rx*0.75, groundY); }
  else {                       BC = P(cx, groundY - legLen - ry*0.95); }
  if (Pp.mode==="rear"){  rot=-0.32; pivot=P(cx-rx*0.72, groundY); }
  if (Pp.mode==="run"){   rot=-0.06; pivot=P(cx, BC.y); }
  if (Pp.mode==="drive"){ rot=-0.10; pivot=P(cx-rx*0.55, groundY); }
  if (Pp.mode==="struck"){rot= 0.09; pivot=P(cx+rx*0.40, groundY); }

  // ground shadow (unrotated, on the floor)
  ctx.save(); ctx.fillStyle="rgba(0,0,0,0.09)";
  ctx.beginPath(); ctx.ellipse(cx, groundY+5, rx*0.95, U*0.11, 0,0,TAU); ctx.fill(); ctx.restore();

  const feet = feetFor(Pp.mode, BC, U, dir, groundY);

  ctx.save();
  if (rot && pivot){ ctx.translate(pivot.x,pivot.y); ctx.rotate(rot); ctx.translate(-pivot.x,-pivot.y); }
  const r = drawBoar(pen, BC, U, dir, {
    headDrop:Pp.headDrop, headTilt:Pp.headTilt, gaze:Pp.gaze, bristle:Pp.bristle, ...feet,
  });
  // props that ride WITH the body stay inside the rotated frame
  if (Pp.spear) drawSpear(pen, BC.x + dir*rx*0.36, BC.y - ry*0.98, U, dir, Pp.dead);
  ctx.restore();

  // world-space marks
  const ct=Math.cos(rot), st=Math.sin(rot);
  const toWorld = p => pivot ? P(pivot.x + (p.x-pivot.x)*ct - (p.y-pivot.y)*st,
                                pivot.y + (p.x-pivot.x)*st + (p.y-pivot.y)*ct) : p;
  if (Pp.dash)  drawDashes(pen, toWorld(BC), U, dir, W);
  if (Pp.sweep) drawSweep(pen, toWorld(r.tuskTip), U, dir);
  if (Pp.brush==="burst") drawBurst(pen, cx - rx*0.20, groundY - U*0.30, U);
  if (Pp.brush==="cover") drawThicketFront(pen, W, groundY, U);

  return r;
}

export const asset = {
  id:"creature.parnassus-boar",
  type:"CREATURE",
  name:"Parnassus boar",
  statusWord:"TUSKED",
  scene:"OD-B19-S05",

  // procedural knobs
  params:{
    scale:1.35,          // a great boar — the mass is in the shoulder, not the height
    tuskScale:1.0,       // sweep of the lower tusks (the identity read)
    bristle:1.0,         // crest height multiplier; poses raise it when roused
    hide:"#b9b3a6",      // coarse bristled hide
    mass:"heavy",        // front-loaded: hump + chest carry the weight
    collision:true,      // barrel + tusk-reach volumes below drive scene collision
  },
  // back -> front draw order (honored internally)
  layers:["ground","thicket-back","shadow","far-legs","barrel","hump","haunch",
          "belly","tail","crest","throat","far-ear","far-tusk","head","jowl",
          "snout","near-ear","eye","whetter","near-tusk","near-legs","spear",
          "speed-dashes","gore-sweep","burst","thicket-front"],
  // normalized 0..1 attention / contact / anchor points (neutral CHARGE pose)
  anchors:{
    "boar:crest":{x:.46,y:.42},        // the bristle ridge over the hump
    "boar:shoulder":{x:.52,y:.48},     // the spear target
    "boar:head":{x:.68,y:.55},
    "boar:eye":{x:.70,y:.51},
    "boar:snout":{x:.82,y:.60},
    "boar:tusk":{x:.80,y:.55},         // the goring point — contact with a knee
    "boar:flank":{x:.36,y:.52},
    "boar:haunch":{x:.26,y:.50},
    "boar:belly":{x:.42,y:.60},
    "boar:hoof-fore":{x:.58,y:.72},
    "boar:hoof-hind":{x:.20,y:.72},
    "gore:reach":{x:.92,y:.44},        // where the tusk arc lands
    "lair:bed":{x:.40,y:.68},          // the couched hollow in the thicket
    "thicket:edge":{x:.06,y:.72},
    "entrance:glen":{x:.02,y:.74},
    "exit:ravine":{x:.98,y:.74},
    "camera:boar":{x:.50,y:.54},
  },
  // body / reach footprints for placement + collision
  zones:{
    "body:barrel":{ x0:.22,y0:.38,x1:.66,y1:.66 },
    "reach:tusk":{  x0:.66,y0:.40,x1:.96,y1:.66 },   // the dangerous volume
    walkable:{ x0:.02,y0:.66,x1:.98,y1:.94 },
  },
  states:{
    initial:"bed",
    nodes:{
      bed:{      preview:{ pose:"bed",      t:0.0 } },  // hidden in the thicket lair
      erupt:{    preview:{ pose:"erupt",    t:0.2 } },  // the lair bursts open
      charge:{   preview:{ pose:"charge",   t:0.4 } },  // full run, head low
      gore:{     preview:{ pose:"gore",     t:0.5 } },  // tusk arc + the three slashes
      impact:{   preview:{ pose:"impact",   t:0.6 } },  // spear through the shoulder
      collapse:{ preview:{ pose:"collapse", t:0.8 } },  // forequarters pitch down
      carcass:{  preview:{ pose:"carcass",  t:1.0 } },  // downed, spear standing
    },
    edges:[
      ["bed","erupt"],["erupt","charge"],["charge","gore"],["gore","impact"],
      ["impact","collapse"],["collapse","carcass"],["charge","impact"],["bed","bed"],
    ],
  },
  channels:["pose","headDrop","headTilt","gaze","bristle","stride","t"],

  preview:()=>({ pose:"charge", t:0.4, status:"TUSKED", progress:.35 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
