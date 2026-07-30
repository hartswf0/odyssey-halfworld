/* prop.victory-meat-and-wine — the champion's portion and the pledge cup:
   a footed bronze charger carrying the hero's cut of roast with its rib bones
   still standing in it, two barley loaves laid beside it, and a two-handled
   gold cup filled and raised in salute. PROP asset. Drawn in SOLID grays +
   hard contour into the offscreen ctx; the engine dotify pass supplies the
   halftone. Do NOT pre-dither.

   Scene function (OD-B18-S02): Amphinomus — the one decent man in the hall —
   carries the winner's reward across to the beggar who has just floored Irus,
   sets the loaves in his hands and pledges him in the gold cup. The prop is
   therefore a TRANSFER: a thing that changes owner on camera, and the module
   carries the ownership channel and both grip pips so the giving hand and the
   taking hand never resolve to the same point.

   Seven states —
     CARVED    the portion just off the spit, cup dry, nothing given yet
     POURED    wine falling into the cup from the mixing jar's lip
     OFFERED   full set — meat, two loaves, cup brimmed — held out, donor grip
     PLEDGED   the cup lifted clear and tilted, the toast, wine riding the tilt
     HANDED    mid-transfer: both pips live, the arrow half filled
     RECEIVED  ownership flipped, one loaf already stowed, a draught taken
     SPENT     bones bare, crumbs, a dark ring of dregs in the cup

   Silhouette law: a LOW pale oval carrying a tall dark joint with three bones
   fanning up out of it, and one standing vertical (the cup) behind and to the
   right. The bones are what make the reward legible at thumbnail size.
   Tone plan: the charger and the bread are near paper (1–2); the joint is the
   only large mid tone (3); deep ink is spent only on the wine's far edge, the
   seared underside, and the ownership seals — all small. Every quantity is
   GEOMETRY: blocky seals and bold bars, never type. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ------------------------------------------------------------------
   DECLARED SCALE + CONTENTS. Real-world sizes so the prop can be placed
   against a figure without guessing.
   ------------------------------------------------------------------ */
const params = {
  scale:{ unit:"m", platterWidth:0.46, platterHeight:0.09, cupHeight:0.19, cupWidth:0.17 },
  mass:{ platterKg:2.4, cupKg:0.8 },
  material:{ platter:"bronze", cup:"gold", meat:"roast goat chine", bread:"barley loaf" },
  contents:{ meat:1, loaves:2, wineMeasures:4 },   // what a full reward holds
  ribs:3,                                          // bones standing in the cut
  donor:"amphinomus",
  receiver:"odysseus:beggar-disguise",
};

/* eight quantized ink levels — 0 is paper, 7 is full ink. The picture lives
   in 1..3; 5..7 are spent only on areas small enough to stay marks. */
const PLATE   = 1;   // bronze charger, top face — near paper
const PLATE_U = 2;   // the band of its rim thickness / the two feet
const WELL    = 1;   // the dished well
const WELL_D  = 3;   // one narrow far crescent inside the well
const MEAT    = 3;   // the roast itself — the only large mid tone
const FAT     = 1;   // the fat cap along its back
const SEAR    = 5;   // scorched crescent following the underside curve
const BONE    = 1;   // the shank bones — near paper, read by contour alone
const LOAF    = 2;   // barley loaf
const CUP     = 2;   // gold cup body
const CUP_D   = 4;   // one narrow flank crescent
const CUP_IN  = 2;   // the inside of the bowl above the wine
const HANDLE  = 3;   // the two loop handles, stem knop, foot
const WINE    = 3;   // the wine surface
const WINE_D  = 5;   // the far edge of the wine only — a crescent, never a cap
const DREG    = 6;   // the ring left at the bottom
const STREAM  = 4;   // the falling pour
const MARK    = 7;   // seals + tally bars (tiny)

/* rounded-rect sub-path (no fill/stroke; caller wraps in pen.paint) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* ------------------------------------------------------------------
   LAYOUT — fractions of the frame, shared by draw() AND anchors{} so the
   two can never drift apart. Two masses: the low charger left of centre,
   the tall cup standing behind it to the right.
   ------------------------------------------------------------------ */
const L = {
  plateX:0.315, plateY:0.535, plateR:0.225,   // plateR is a fraction of WIDTH
  cupX:0.742,   cupFootY:0.510, cupR:0.150,
  stripY1:0.762, stripY2:0.856,
};

/* ------------------------------------------------------------------
   THE JOINT — the hero's cut. A blocky chine: mid-tone flesh, a paper-light
   fat cap along the back, a carved end showing its grain, one narrow seared
   band underneath, and the rib bones fanning up and to the LEFT, away from
   the cup, so the two masses never tangle.
   ------------------------------------------------------------------ */
/* the bulb — the wide muscle of the joint, wider than it is tall */
function bulbPath(g,s,ht){
  g.moveTo(-s*0.30, -ht*0.72);
  g.bezierCurveTo( s*0.10,-ht*0.98,  s*0.72,-ht*0.86,  s*0.92,-ht*0.46);
  g.bezierCurveTo( s*1.06,-ht*0.20,  s*0.72, ht*0.02,  s*0.22, 0);
  g.bezierCurveTo(-s*0.34,-ht*0.02, -s*0.96,-ht*0.14, -s*0.98,-ht*0.42);
  g.bezierCurveTo(-s*1.00,-ht*0.62, -s*0.68,-ht*0.72, -s*0.30,-ht*0.72);
  g.closePath();
}

/* ------------------------------------------------------------------
   THE JOINT — bulb, shank, bone: the three-part silhouette that reads as
   MEAT at thumbnail size. Drawn back-to-front so each part's ink halo
   closes the one below it, and angled up-LEFT, away from the cup.
   ------------------------------------------------------------------ */
function drawMeat(pen,g,M,x,y,s,ht){
  g.save(); g.translate(x,y);
  const bare = M.meat==="bones";

  // ---- the bone, behind everything, with its knobbed head ----
  const bx0=-s*0.62, by0=-ht*(bare?0.10:1.10), bx1=-s*0.94, by1=-ht*1.70;
  pen.limb(()=>{ g.moveTo(bx0,by0); g.quadraticCurveTo(bx0-s*0.26, lerp(by0,by1,.55), bx1,by1); },
           toneSolid(inkLevel(BONE)), Math.max(12, s*0.26));
  pen.paint(()=>{ g.ellipse(bx1, by1, s*0.34, s*0.27, -0.5, 0,7); }, toneSolid(inkLevel(BONE)), 5);
  pen.seam(()=>{ g.moveTo(bx1-s*0.15, by1-s*0.16); g.lineTo(bx1+s*0.16, by1+s*0.10); }, 3.4);

  // ---- the shank, a thick limb of flesh sleeving the bone ----
  if (!bare){
    pen.limb(()=>{ g.moveTo(-s*0.32,-ht*0.58); g.quadraticCurveTo(-s*0.50,-ht*0.92,-s*0.66,-ht*1.20); },
             toneSolid(inkLevel(MEAT)), Math.max(20, s*0.48));
  }

  if (!bare){
    // ---- the bulb ----
    pen.paint(()=>bulbPath(g,s,ht), toneSolid(inkLevel(MEAT)), 6.5);

    g.save(); g.beginPath(); bulbPath(g,s,ht); g.clip();
    // fat cap — a light crescent along the upper contour
    g.fillStyle=inkLevel(FAT);
    g.beginPath();
    g.moveTo(-s*0.32,-ht*0.70);
    g.bezierCurveTo( s*0.10,-ht*0.96, s*0.70,-ht*0.84, s*0.90,-ht*0.46);
    g.lineTo( s*0.66,-ht*0.40);
    g.bezierCurveTo( s*0.50,-ht*0.68, s*0.06,-ht*0.76,-s*0.30,-ht*0.56);
    g.closePath(); g.fill();
    // the scorched underside — a CRESCENT on the belly curve, tapering to
    // nothing at both ends, so it can never read as a rule across the frame
    g.fillStyle=inkLevel(SEAR);
    g.beginPath();
    g.moveTo(-s*0.86,-ht*0.20);
    g.bezierCurveTo(-s*0.40, ht*0.04, s*0.36, ht*0.02, s*0.88,-ht*0.34);
    g.bezierCurveTo( s*0.42,-ht*0.14,-s*0.30,-ht*0.10,-s*0.74,-ht*0.30);
    g.closePath(); g.fill();
    g.restore();

    // the fat line, BROKEN into two runs
    pen.seam(()=>{ g.moveTo(-s*0.24,-ht*0.62); g.quadraticCurveTo( s*0.08,-ht*0.76, s*0.28,-ht*0.72); }, 3.4);
    pen.seam(()=>{ g.moveTo( s*0.50,-ht*0.64); g.quadraticCurveTo( s*0.68,-ht*0.56, s*0.76,-ht*0.40); }, 3.4);

    // carving scores — short, staggered, never a lattice
    if (M.cutmark){
      for (const k of [0.06, 0.44]){
        pen.seam(()=>{ g.moveTo(s*k,-ht*0.46); g.lineTo(s*(k+0.10),-ht*0.18); }, 3.4);
      }
    }
  } else {
    // SPENT — only a stripped stump is left clinging to the bone
    pen.paint(()=>{
      g.moveTo(-s*0.62,-ht*0.30);
      g.bezierCurveTo(-s*0.72,-ht*0.56,-s*0.34,-ht*0.70,-s*0.10,-ht*0.56);
      g.bezierCurveTo( s*0.10,-ht*0.44,-s*0.06,-ht*0.20,-s*0.30,-ht*0.18);
      g.closePath();
    }, toneSolid(inkLevel(MEAT)), 5.5);
  }
  g.restore();
}

/* ------------------------------------------------------------------
   BARLEY LOAF — a round scored cake. Light, contour-led.
   ------------------------------------------------------------------ */
function drawLoaf(pen,g,x,y,r,rot){
  g.save(); g.translate(x,y); g.rotate(rot||0);
  pen.paint(()=>{ g.ellipse(0,0, r, r*0.82, 0,0,7); }, toneSolid(inkLevel(LOAF)), 5.5);
  pen.seam(()=>{ g.moveTo(-r*0.56,-r*0.32); g.lineTo( r*0.56, r*0.32); }, 3.6);
  pen.seam(()=>{ g.moveTo( r*0.56,-r*0.32); g.lineTo(-r*0.56, r*0.32); }, 3.6);
  pen.seam(()=>{ g.ellipse(0,0, r*0.74, r*0.58, 0, 3.5, 5.9); }, 2.8);
  g.restore();
}

/* crumbs left behind (SPENT) — a scatter of tiny solid marks, deterministic */
function drawCrumbs(pen,g,x,y,r){
  const spec=[[-0.62,0.10],[-0.30,0.26],[0.06,0.02],[0.34,0.22],[0.62,-0.06],[-0.10,-0.14]];
  g.fillStyle=inkLevel(5);
  spec.forEach(([a,b],i)=>{ g.beginPath(); g.ellipse(x+a*r, y+b*r*0.5, r*0.045+(i%2)*r*0.015, r*0.036, 0,0,7); g.fill(); });
}

/* ------------------------------------------------------------------
   THE CHARGER — a footed bronze oval. Built underside-first so a sliver of
   rim thickness shows below the top face; two SHORT feet, never a ring, so
   nothing rules across the frame. No protruding lugs: the carry points are
   marked with pips (see gripPip) instead of drawn as tabs.
   ------------------------------------------------------------------ */
function drawPlatter(pen,g,cx,cy,R,groundY){
  const ry = R*0.36, th = R*0.14;

  // contact shadow under the two feet only
  g.fillStyle="rgba(0,0,0,0.10)";
  for (const s of [-1,1]){
    g.beginPath(); g.ellipse(cx+s*R*0.42, groundY+R*0.02, R*0.18, R*0.042, 0,0,7); g.fill();
  }
  // the two short feet, behind the dish
  for (const s of [-1,1]){
    pen.paint(()=>{
      g.moveTo(cx+s*R*0.30, cy+ry*0.80);
      g.lineTo(cx+s*R*0.52, cy+ry*0.80);
      g.lineTo(cx+s*R*0.47, groundY);
      g.lineTo(cx+s*R*0.35, groundY);
      g.closePath();
    }, toneSolid(inkLevel(PLATE_U)), 5);
  }

  /* the dish is ONE closed silhouette: the back arc of the top face, a short
     drop at each end, and the front arc carried down by the rim thickness.
     Filling and stroking that single path means the front of the dish gets
     exactly ONE contour — no parallel pair of long horizontals. */
  const sil = ()=>{
    g.ellipse(cx, cy,    R, ry, 0, Math.PI, 0);   // back arc, left -> right
    g.lineTo(cx+R, cy+th);
    g.ellipse(cx, cy+th, R, ry, 0, 0, Math.PI);   // front arc, dropped by th
    g.closePath();
  };
  pen.fillPath(sil, inkLevel(PLATE_U));           // the rim band tone
  pen.fillPath(()=>{ g.ellipse(cx, cy, R, ry, 0,0,7); }, inkLevel(PLATE)); // pale face
  pen.ink(sil, 6.5);                              // the one hard contour

  /* the dished well: ONE light ellipse with a single narrow crescent along
     its far wall. No concentric rings — those turn a dish into a target. */
  pen.paint(()=>{ g.ellipse(cx, cy+ry*0.08, R*0.82, ry*0.70, 0,0,7); }, toneSolid(inkLevel(WELL)), 3.5);
  g.save(); g.beginPath(); g.ellipse(cx, cy+ry*0.08, R*0.82, ry*0.70, 0,0,7); g.clip();
  g.fillStyle=inkLevel(WELL_D);
  g.beginPath(); g.ellipse(cx, cy-ry*0.40, R*0.78, ry*0.62, 0,0,7); g.fill();
  g.fillStyle=inkLevel(WELL);
  g.beginPath(); g.ellipse(cx, cy-ry*0.32, R*0.76, ry*0.60, 0,0,7); g.fill();
  g.restore();
}

/* ------------------------------------------------------------------
   THE CUP — a two-handled gold cup (depas amphikypellon). Local frame: the
   origin is the CENTRE OF THE RIM, +y down. Bowl depth D. Wine is only ever
   visible through the mouth, so its surface is an ellipse INSIDE the mouth
   that sinks and shrinks as the cup empties — never a black cap over the rim.
   ------------------------------------------------------------------ */
function bowlPath(g,R,D){
  g.moveTo(-R, 0);
  g.bezierCurveTo(-R*1.00, D*0.54, -R*0.58, D*0.96, 0, D*0.98);
  g.bezierCurveTo( R*0.58, D*0.96,  R*1.00, D*0.54,  R, 0);
  g.closePath();
}

function drawCup(pen,g,M,cx,footY,R,t){
  const D = R*1.18;
  const lift = M.cupLift ? R*0.66 : 0;
  const tilt = M.cupTilt || 0;
  const rimY = footY - D*1.52 - lift;

  if (!lift){
    g.fillStyle="rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(cx, footY+R*0.05, R*0.56, R*0.10, 0,0,7); g.fill();
  }

  g.save(); g.translate(cx, rimY);
  if (tilt){ g.translate(0, D*0.55); g.rotate(tilt); g.translate(0, -D*0.55); }

  // ---- foot + stem, first (behind) ----
  pen.paint(()=>{ g.ellipse(0, D*1.50, R*0.50, R*0.155, 0,0,7); }, toneSolid(inkLevel(HANDLE)), 5);
  pen.paint(()=>{
    g.moveTo(-R*0.14, D*0.94); g.lineTo(R*0.14, D*0.94);
    g.lineTo(R*0.32, D*1.46);  g.lineTo(-R*0.32, D*1.46); g.closePath();
  }, toneSolid(inkLevel(CUP)), 5);
  pen.paint(()=>{ g.ellipse(0, D*1.20, R*0.21, R*0.115, 0,0,7); }, toneSolid(inkLevel(HANDLE)), 4);

  // ---- the two loop handles, behind the bowl so its contour cuts them ----
  for (const s of [-1,1]){
    pen.limb(()=>{
      g.moveTo(s*R*0.86, D*0.10);
      g.bezierCurveTo(s*R*1.40, D*0.04, s*R*1.42, D*0.62, s*R*0.72, D*0.78);
    }, toneSolid(inkLevel(HANDLE)), Math.max(9, R*0.13));
  }

  // ---- the bowl: pale, with ONE narrow flank crescent ----
  pen.paint(()=>bowlPath(g,R,D), toneSolid(inkLevel(CUP)), 6.5);
  g.save(); g.beginPath(); bowlPath(g,R,D); g.clip();
  g.fillStyle=inkLevel(CUP_D);
  g.beginPath();
  g.moveTo(R*0.58, D*0.14);
  g.quadraticCurveTo(R*0.99, D*0.50, R*0.44, D*0.92);
  g.quadraticCurveTo(R*0.80, D*0.50, R*0.58, D*0.14);
  g.closePath(); g.fill();
  g.restore();
  // three short vertical flutes on the near flank — broken, never a band
  for (const k of [-0.34, -0.02, 0.30])
    pen.seam(()=>{ g.moveTo(R*k, D*0.32); g.lineTo(R*k*1.14, D*0.62); }, 3);

  // ---- the mouth: light interior, then the wine surface inside it ----
  pen.paint(()=>{ g.ellipse(0, 0, R*0.90, R*0.28, 0,0,7); }, toneSolid(inkLevel(CUP_IN)), 5);
  const fill = clamp(M.wine||0, 0, 1);
  if (fill > 0.02){
    const dv = 1-fill;
    g.save(); g.beginPath(); g.ellipse(0,0, R*0.88, R*0.265, 0,0,7); g.clip();
    const wy = R*0.17*dv, wrx = R*0.84*(1-0.36*dv);
    g.save(); g.translate(tilt*R*0.70, wy); g.rotate(-tilt);
    pen.paint(()=>{ g.ellipse(0,0, wrx, wrx*0.30, 0,0,7); }, toneSolid(inkLevel(WINE)), 4);
    // the far edge of the liquid only — a crescent of deep ink, not a cap
    g.fillStyle=inkLevel(WINE_D);
    g.beginPath(); g.ellipse(0,-wrx*0.055, wrx*0.97, wrx*0.24, 0, Math.PI, 0); g.fill();
    g.fillStyle=inkLevel(WINE);
    g.beginPath(); g.ellipse(0,-wrx*0.015, wrx*0.90, wrx*0.20, 0, Math.PI, 0); g.fill();
    g.restore(); g.restore();
  }
  if (M.dregs){
    g.save(); g.beginPath(); g.ellipse(0,0, R*0.88, R*0.265, 0,0,7); g.clip();
    pen.paint(()=>{ g.ellipse(0, R*0.15, R*0.32, R*0.095, 0,0,7); }, toneSolid(inkLevel(DREG)), 3);
    pen.ink(()=>{ g.ellipse(0, R*0.04, R*0.58, R*0.16, 0, 0.3, Math.PI-0.3); }, 2.6);
    g.restore();
  }
  // the rolled lip, front half only
  pen.ink(()=>{ g.ellipse(0, R*0.015, R*0.955, R*0.30, 0, 0.16, Math.PI-0.16); }, 4.5);

  g.restore();

  // ---- PLEDGED: two hail chevrons over the raised cup ----
  if (M.hail){
    g.strokeStyle=INK; g.lineWidth=6; g.lineCap="round"; g.lineJoin="round";
    for (let i=0;i<2;i++){
      const yy = rimY - R*(0.62 + i*0.34), ww = R*(0.30 + i*0.12);
      g.beginPath(); g.moveTo(cx-ww, yy+ww*0.42); g.lineTo(cx, yy-ww*0.28); g.lineTo(cx+ww, yy+ww*0.42); g.stroke();
    }
  }
  return rimY;
}

/* where the cup's two handle grips actually END UP once the cup has been
   lifted and tilted — so the pips track the object instead of hovering over
   the spot it used to stand in. Mirrors drawCup's transform exactly. */
function cupGrip(M,cx,footY,R,side){
  const D = R*1.18;
  const lift = M.cupLift ? R*0.66 : 0;
  const tilt = M.cupTilt || 0;
  const rimY = footY - D*1.52 - lift;
  const px = side*R*1.24, py = D*0.42 - D*0.55;          // relative to the pivot
  const c = Math.cos(tilt), s = Math.sin(tilt);
  return { x: cx + px*c - py*s, y: rimY + D*0.55 + px*s + py*c };
}

/* the pour: a tapered stream out of the mixing jar's lip into the mouth --- */
function drawStream(pen,g,cx,rimY,R,topY,t){
  const wob = Math.sin(t*1.9)*R*0.05;
  // the jar's lip — a wedge, enough to say "poured from", not a second asset
  pen.paint(()=>{
    g.moveTo(cx+R*0.30+wob, topY);
    g.lineTo(cx+R*1.15+wob, topY-R*0.34);
    g.lineTo(cx+R*1.30+wob, topY+R*0.10);
    g.lineTo(cx+R*0.52+wob, topY+R*0.22);
    g.closePath();
  }, toneSolid(inkLevel(CUP)), 5.5);

  pen.paint(()=>{
    g.moveTo(cx+R*0.40+wob, topY+R*0.14);
    g.bezierCurveTo(cx+R*0.26+wob, rimY-(rimY-topY)*0.45, cx+R*0.06, rimY-(rimY-topY)*0.18, cx+R*0.02, rimY-R*0.06);
    g.lineTo(cx-R*0.20, rimY-R*0.06);
    g.bezierCurveTo(cx-R*0.16, rimY-(rimY-topY)*0.20, cx+R*0.02+wob, rimY-(rimY-topY)*0.48, cx+R*0.14+wob, topY+R*0.16);
    g.closePath();
  }, toneSolid(inkLevel(STREAM)), 4);

  g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
  for (let i=0;i<3;i++){
    const xx = cx-R*0.40+i*R*0.42;
    g.beginPath(); g.moveTo(xx, rimY-R*0.12); g.lineTo(xx+R*0.06, rimY-R*0.30-i*R*0.05); g.stroke();
  }
}

/* ------------------------------------------------------------------
   GRIP PIP — a target mark sitting ON the rim it names. Solid = a hand is
   there now, hollow = the carry point exists but is free. This is how the
   module states WHO holds it without baking a figure into the plate.
   ------------------------------------------------------------------ */
function gripPip(pen,g,x,y,s,live){
  pen.paint(()=>{ g.arc(x,y,s,0,7); }, toneSolid(inkLevel(0)), 5);
  if (live){ g.fillStyle=INK; g.beginPath(); g.arc(x,y,s*0.52,0,7); g.fill(); }
  g.strokeStyle=INK; g.lineWidth=4.5; g.lineCap="round";
  for (const a of [-2.36, 2.36]){                 // two ticks only — a mark, not a bolt
    g.beginPath();
    g.moveTo(x+Math.cos(a)*s*1.18, y+Math.sin(a)*s*1.18);
    g.lineTo(x+Math.cos(a)*s*1.75, y+Math.sin(a)*s*1.75);
    g.stroke();
  }
}

/* ------------------------------------------------------------------
   OWNERSHIP SEALS — blocky marks, never letters. Solid = holds it now,
   hollow = held it before.
   ------------------------------------------------------------------ */
function seal(pen,g,kind,x,y,s,solid){
  const face = toneSolid(inkLevel(solid ? MARK : 0));
  if (kind==="donor"){
    pen.paint(()=>{ rr(g, x-s*0.50, y-s*0.50, s, s, s*0.10); }, face, 5);
    g.fillStyle = inkLevel(solid ? 0 : MARK);
    g.beginPath();
    g.moveTo(x-s*0.28, y+s*0.26); g.lineTo(x, y-s*0.30); g.lineTo(x+s*0.28, y+s*0.26);
    g.lineTo(x+s*0.28, y-s*0.02); g.lineTo(x, y-s*0.28); g.lineTo(x-s*0.28, y-s*0.02);
    g.closePath(); g.fill();
  } else {
    pen.paint(()=>{ g.arc(x, y, s*0.52, 0, 7); }, face, 5);
    g.fillStyle = inkLevel(solid ? 0 : MARK);
    g.fillRect(x-s*0.30, y-s*0.11, s*0.60, s*0.22);
  }
}

/* the manifest strip: WHO -> WHO, and WHAT, both as geometry ------------- */
function drawStrip(pen,g,M,W,H){
  const y1 = H*L.stripY1, y2 = H*L.stripY2;
  const s  = W*0.062;                               // seal size — well over the lattice
  const xa = W*0.190, xb = W*0.640;
  const p  = clamp(M.transfer||0, 0, 1);

  seal(pen,g,"donor",    xa, y1, s, p < 0.5);
  seal(pen,g,"receiver", xb, y1, s, p >= 0.5);

  const lx0 = xa + s*0.74, lx1 = xb - s*0.88;
  g.strokeStyle=INK; g.lineCap="butt";
  g.lineWidth=5; g.setLineDash([17,13]);
  g.beginPath(); g.moveTo(lx0, y1); g.lineTo(lx1, y1); g.stroke();
  g.setLineDash([]);
  if (p > 0.02){
    g.lineWidth=8; g.lineCap="round";
    g.beginPath(); g.moveTo(lx0, y1); g.lineTo(lerp(lx0, lx1, p), y1); g.stroke();
  }
  g.fillStyle=INK;
  g.beginPath(); g.moveTo(lx1+s*0.34, y1); g.lineTo(lx1-s*0.06, y1-s*0.22);
  g.lineTo(lx1-s*0.06, y1+s*0.22); g.closePath(); g.fill();

  // ---- quantities: glyph + bold bars, three groups, never a continuous row ----
  const groups = [
    { k:"meat", n: M.meat==="bones" ? 0 : 1,  x: W*0.170 },
    { k:"loaf", n: M.loaves,                  x: W*0.420 },
    { k:"cup",  n: Math.round(clamp(M.wine||0,0,1)*4), x: W*0.668 },
  ];
  const gs = W*0.036;
  for (const grp of groups){
    const gx = grp.x;
    if (grp.k==="meat"){
      pen.paint(()=>{
        g.moveTo(gx-gs, y2+gs*0.34);
        g.bezierCurveTo(gx-gs*1.1, y2-gs*0.5, gx+gs*0.2, y2-gs*0.9, gx+gs*0.86, y2-gs*0.30);
        g.bezierCurveTo(gx+gs*1.1, y2+gs*0.05, gx+gs*0.6, y2+gs*0.42, gx-gs, y2+gs*0.34);
        g.closePath();
      }, toneSolid(inkLevel(MEAT)), 4);
      pen.limb(()=>{ g.moveTo(gx-gs*0.16, y2-gs*0.55); g.lineTo(gx-gs*0.52, y2-gs*1.20); },
               toneSolid(inkLevel(BONE)), 7);
    } else if (grp.k==="loaf"){
      pen.paint(()=>{ g.ellipse(gx, y2-gs*0.10, gs*0.86, gs*0.68, 0,0,7); }, toneSolid(inkLevel(LOAF)), 4);
      pen.seam(()=>{ g.moveTo(gx-gs*0.44,y2-gs*0.40); g.lineTo(gx+gs*0.44,y2+gs*0.20); }, 3);
    } else {
      pen.paint(()=>{
        g.moveTo(gx-gs*0.62, y2-gs*0.82);
        g.bezierCurveTo(gx-gs*0.62, y2-gs*0.10, gx-gs*0.30, y2+gs*0.16, gx, y2+gs*0.16);
        g.bezierCurveTo(gx+gs*0.30, y2+gs*0.16, gx+gs*0.62, y2-gs*0.10, gx+gs*0.62, y2-gs*0.82);
        g.closePath();
      }, toneSolid(inkLevel(CUP)), 4);
      pen.paint(()=>{ g.ellipse(gx, y2+gs*0.62, gs*0.44, gs*0.14, 0,0,7); }, toneSolid(inkLevel(HANDLE)), 3);
    }
    g.strokeStyle=INK; g.lineCap="butt"; g.lineWidth=Math.max(9, gs*0.30);
    for (let i=0;i<grp.n;i++){
      const bx = gx + gs*1.55 + i*gs*0.58;
      g.beginPath(); g.moveTo(bx, y2+gs*0.52); g.lineTo(bx, y2-gs*0.52); g.stroke();
    }
    if (grp.n===0){                                  // an emptied slot is a struck box
      g.lineWidth=4; g.strokeRect(gx+gs*1.30, y2-gs*0.52, gs*0.86, gs*1.04);
      g.lineCap="round";
      g.beginPath(); g.moveTo(gx+gs*1.36, y2-gs*0.46); g.lineTo(gx+gs*2.10, y2+gs*0.46);
      g.moveTo(gx+gs*2.10, y2-gs*0.46); g.lineTo(gx+gs*1.36, y2+gs*0.46); g.stroke();
    }
  }
}

/* ------------------------------------------------------------------ */
const MODE = {
  carved:  { meat:"whole", cutmark:true, loaves:0, wine:0.00, transfer:0.00,
             owner:"amphinomus", status:"CARVED",   progress:.18 },
  poured:  { meat:"whole", cutmark:true, loaves:0, wine:0.55, stream:true, transfer:0.00,
             owner:"amphinomus", status:"POURED",   progress:.34 },
  offered: { meat:"cut",   loaves:2, wine:0.88, transfer:0.10, gripDonor:true,
             owner:"amphinomus", status:"OFFERED",  progress:.52 },
  pledged: { meat:"cut",   loaves:2, wine:0.88, cupLift:true, cupTilt:0.22, hail:true,
             transfer:0.28, gripDonor:true, owner:"amphinomus", status:"PLEDGED", progress:.66 },
  handed:  { meat:"cut",   loaves:2, wine:0.80, transfer:0.55, gripDonor:true, gripRecv:true,
             motion:true, owner:"in-transit", status:"HANDED",  progress:.80 },
  received:{ meat:"cut",   loaves:1, wine:0.58, transfer:1.00, gripRecv:true,
             owner:"odysseus:beggar-disguise", status:"RECEIVED", progress:.92 },
  spent:   { meat:"bones", loaves:0, wine:0.00, dregs:true, crumbs:true, transfer:1.00,
             owner:"odysseus:beggar-disguise", status:"SPENT",  progress:1.0 },
};

function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g   = ctx;
  const M   = MODE[st.mode] || MODE.offered;
  const t   = st.t || 0;

  const pcx = W*L.plateX, pcy = H*L.plateY, R = W*L.plateR;
  const groundY = pcy + R*0.62;
  const ccx = W*L.cupX, cfy = H*L.cupFootY, CR = W*L.cupR;

  // ---- the cup stands BEHIND and to the right; drawn first ----
  const rimY = drawCup(pen,g,M,ccx,cfy,CR,t);
  if (M.stream) drawStream(pen,g,ccx,rimY,CR,H*0.150,t);

  // ---- the charger ----
  drawPlatter(pen,g,pcx,pcy,R,groundY);

  // ---- what it carries: the joint, then the bread beside it ----
  drawMeat(pen,g,M, pcx - R*0.16, pcy + R*0.06, R*0.52, R*0.86);
  if (M.crumbs) drawCrumbs(pen,g, pcx-R*0.16, pcy+R*0.02, R*0.52);
  if (M.loaves >= 1) drawLoaf(pen,g, pcx + R*0.47, pcy - R*0.18, R*0.245, -0.22);
  if (M.loaves >= 2) drawLoaf(pen,g, pcx + R*0.74, pcy + R*0.13, R*0.205,  0.20);

  // ---- who is holding it: pips on the two carry points, never a figure ----
  gripPip(pen,g, pcx - R*0.99, pcy + R*0.070, R*0.105, !!M.gripDonor);
  gripPip(pen,g, pcx + R*0.99, pcy + R*0.070, R*0.105, !!M.gripRecv);
  const gL = cupGrip(M,ccx,cfy,CR,-1), gR = cupGrip(M,ccx,cfy,CR,1);
  gripPip(pen,g, gL.x, gL.y, CR*0.150, !!M.gripDonor);
  gripPip(pen,g, gR.x, gR.y, CR*0.150, !!M.gripRecv || !!M.cupLift);

  if (M.motion){                                     // transfer ticks, trailing left
    g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round"; g.globalAlpha=0.55;
    for (let i=0;i<3;i++){
      const xx = pcx - R*1.22 - i*R*0.13, yy = pcy - R*0.16 + i*R*0.16;
      g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx - R*0.16, yy); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- the manifest: ownership + contents, all geometry ----
  drawStrip(pen,g,M,W,H);
}

export const asset = {
  id:"prop.victory-meat-and-wine",
  type:"PROP",
  name:"Victory Meat and Wine",
  statusWord:"OFFERED",
  scene:"OD-B18-S02",

  params,
  // back -> front draw order the prop honors
  layers:["cup-shadow","cup-foot","cup-handles","cup-bowl","wine","pour-stream",
          "plate-feet","plate-rim","plate-face","well","far-rib","meat","near-ribs",
          "loaves","grip-pips","motion","manifest"],

  // normalized 0..1 anchors, measured against LAYOUT above
  anchors:{
    // paired carry points — a giving hand and a taking hand must never collide
    "grip:platter-l":{x:.092, y:.567},
    "grip:platter-r":{x:.538, y:.567},
    "grip:cup:donor":{x:.556, y:.444},
    "grip:cup:receiver":{x:.928, y:.444},
    "rim:cup":{x:.742, y:.328},
    "pour:in":{x:.742, y:.322},
    meat:{x:.279, y:.505},
    bones:{x:.196, y:.291},
    "loaf:a":{x:.428, y:.530},
    "loaf:b":{x:.468, y:.587},
    "support:table":{x:.400, y:.660},
    "contact:ground":{x:.315, y:.660},
    "seal:donor":{x:.190, y:.762},
    "seal:receiver":{x:.640, y:.762},
    body:{x:.470, y:.545},
  },
  // collision + placement volumes
  collision:{ kind:"box", x0:.09, y0:.32, x1:.94, y1:.67 },
  zones:{ bounds:{ x0:.07, y0:.27, x1:.95, y1:.90 },
          footprint:{ x0:.15, y0:.64, x1:.91, y1:.67 },
          "plate:well":{ x0:.13, y0:.53, x1:.50, y1:.60 },
          "cup:mouth":{ x0:.61, y0:.31, x1:.88, y1:.35 } },

  // ownership is the point of this prop — it changes hands on camera
  owner:"amphinomus",
  ownerAfter:"odysseus:beggar-disguise",
  provenance:"amphinomus:winners-portion",
  contents:params.contents,

  states:{
    initial:"carved",
    nodes:{
      carved:  { preview:{ mode:"carved",   status:"CARVED",   progress:.18 } },
      poured:  { preview:{ mode:"poured",   status:"POURED",   progress:.34 } },
      offered: { preview:{ mode:"offered",  status:"OFFERED",  progress:.52 } },
      pledged: { preview:{ mode:"pledged",  status:"PLEDGED",  progress:.66 } },
      handed:  { preview:{ mode:"handed",   status:"HANDED",   progress:.80 } },
      received:{ preview:{ mode:"received", status:"RECEIVED", progress:.92 } },
      spent:   { preview:{ mode:"spent",    status:"SPENT",    progress:1.0 } },
    },
    edges:[
      ["carved","poured"],["poured","carved"],
      ["poured","offered"],["offered","poured"],
      ["offered","pledged"],["pledged","offered"],
      ["pledged","handed"],["offered","handed"],
      ["handed","received"],["received","handed"],
      ["received","spent"],["received","pledged"],
      ["spent","carved"],
    ],
  },
  channels:["mode","wine","loaves","transfer","owner","cupTilt","t"],

  preview:()=>({ mode:"offered", status:"OFFERED", progress:.52, t:0 }),
  draw(ctx,W,H,state){
    const st = state||{};
    drawProp(ctx,W,H,st);
    const M = MODE[st.mode] || MODE.offered;
    return { anchors:asset.anchors, collision:asset.collision, zones:asset.zones,
             owner:M.owner, contents:{ meat:M.meat==="bones"?0:1, loaves:M.loaves, wine:M.wine } };
  },
};
export default asset;
