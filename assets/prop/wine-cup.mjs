/* prop.wine-cup — a LARGE CRUDE IMPROVISED SERVING BOWL-CUP of wine: the
   oversized rough hewn vessel Odysseus uses to ply the Cyclops with Maron's
   dark wine in the cave. PROP asset. NOT an ornate krater — this is a big,
   thick-walled, hand-carved ivy-wood bowl with an uneven rim, adze marks
   across the belly, two rough grip lugs, and a stubby crude base. Drawn in
   SOLID grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B09-S08): a reusable serving vessel with five states —
   FILL (a dark stream pours in from above, wine level rising), OFFER (tipped
   toward the guest, a hand gripping the near lug, the mouth turned out), DRINK
   (tipped hard, a wine thread spilling from the lowered lip toward the drinker,
   level draining), REFILL (poured again to the brim, a fresh stream in), and
   DROP (knocked over on its side, wine puddling out across the ground).
   Ivy-wood = a MID tone body; the dark hollow interior + the darker wine read
   the fill in monochrome. Scale, grip/support/contact anchors, ownership, and
   collision box declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  scale:1.35,        // OVERSIZED — this vessel dominates the frame
  rimHalf:0.330,     // wide mouth half-width (fraction of W)
  rimFlat:0.255,     // mouth ellipse flatten (rh = rimHalf*rimFlat)
  rimY:0.300,        // mouth height (fraction of H)
  wallT:0.055,       // rim wall thickness (thick crude wall, fraction of W)
  bowlBotY:0.735,    // bottom of the rounded bell
  baseHalf:0.150,    // stubby base half-width (fraction of W)
  baseTopY:0.760,    // top of the crude base
  baseBotY:0.815,    // base rests on the ground here
  lugY:0.360,        // grip-lug height (just below the rim)
  adzeRows:5,        // rows of hewn adze marks on the belly
  ownedBy:"maron->odysseus->polyphemus", // Maron's wine, offered to the Cyclops
};

const BODY   = 4;    // ivy-wood body (mid tone)
const BODY_D = 5;    // shaded belly side
const RIM    = 5;    // thick crude rim wall
const RIM_H  = 3;    // rim top highlight
const INTER  = 6;    // dark hollow interior
const WINE   = 7;    // dark wine (near-black)
const WINE_G = 5;    // wine glint band
const BASE   = 5;    // crude base
const LUG    = 5;    // grip lugs
const HAND   = 4;    // gripping hand

/* deterministic wobble so the crude rim reads hand-cut (not machined) */
function wob(i){ return Math.sin(i*12.9898)*0.5; }

/* belly cross-section: half-width at fraction f from rim(0) to base join(1).
   Wide mouth, a slight belly swell, rounding to a narrower base. */
function bowlHalf(f){
  f = clamp(f,0,1);
  const rim = params.rimHalf, base = params.baseHalf;
  // swell out just under the rim, then round in to the base
  const swell = 1 + 0.10*Math.sin(Math.min(f,0.55)/0.55*Math.PI);
  return lerp(rim*swell, base, Math.pow(f,1.55));
}

/* -----------------------------------------------------------------
   THE CRUDE BOWL, drawn in absolute canvas coords. Returns key points. */
function drawBowl(pen,g,W,H,fill,t,opts={}){
  const cx = W*0.5;
  const rimHalf = W*params.rimHalf;
  const rimY    = H*params.rimY;
  const rimRh   = rimHalf*params.rimFlat;
  const wall    = W*params.wallT;
  const bowlBot = H*params.bowlBotY;
  const baseTop = H*params.baseTopY;
  const baseBot = H*params.baseBotY;
  const baseHW  = W*params.baseHalf;
  const span    = bowlBot - rimY;
  const halfAt  = f => W*bowlHalf(f);

  // ---- ground shadow under the base (skipped while tipped/toppled) ----
  if (!opts.airborne){
    g.fillStyle="rgba(0,0,0,0.11)";
    g.beginPath(); g.ellipse(cx, baseBot+H*0.005, baseHW*1.5, H*0.017, 0,0,7); g.fill();
  }

  // ---- crude BASE (a stubby hewn foot) ----
  pen.paint(()=>{
    g.moveTo(cx-baseHW*0.78, baseTop);
    g.lineTo(cx+baseHW*0.78, baseTop);
    g.lineTo(cx+baseHW, baseBot);
    g.lineTo(cx-baseHW, baseBot);
    g.closePath();
  }, toneSolid(inkLevel(BASE)), 6);
  pen.paint(()=>{ g.ellipse(cx, baseBot, baseHW, H*0.014, 0,0,7); }, toneSolid(inkLevel(BASE+1)), 5);

  // ---- BODY silhouette (rough bell), with a slightly wobbly wall ----
  pen.paint(()=>{
    g.moveTo(cx-rimHalf, rimY);
    for(let i=1;i<=26;i++){ const f=i/26; const wobx=wob(i)*W*0.006; g.lineTo(cx-halfAt(f)+wobx, rimY+span*f); }
    // rounded bottom across
    g.quadraticCurveTo(cx, bowlBot+span*0.06, cx+halfAt(1), bowlBot);
    for(let i=25;i>=0;i--){ const f=i/26; const wobx=wob(i+40)*W*0.006; g.lineTo(cx+halfAt(f)+wobx, rimY+span*f); }
    // back rim arc closes the mouth
    g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(BODY)), 7);

  // ---- shaded belly crescent (a thin volume shade hugging the right contour) ----
  pen.paint(()=>{
    const f0=0.16, f1=0.66;
    g.moveTo(cx+halfAt(f0)*0.80, rimY+span*f0);
    for(let i=0;i<=8;i++){ const f=lerp(f0,f1,i/8); g.lineTo(cx+halfAt(f)*0.985, rimY+span*f); }
    for(let i=8;i>=0;i--){ const f=lerp(f0,f1,i/8); g.lineTo(cx+halfAt(f)*0.82, rimY+span*f); }
    g.closePath();
  }, toneSolid(inkLevel(BODY_D)), 0);

  // ---- GRIP LUGS (rough carved knobs on each side, just below the rim) ----
  const lugY = H*params.lugY, lugHW = halfAt((lugY-rimY)/span);
  for(const s of [-1,1]){
    pen.paint(()=>{ g.ellipse(cx+s*lugHW, lugY, W*0.045, H*0.032, s*0.25, 0,7); }, toneSolid(inkLevel(LUG)), 5);
  }

  // ---- thick crude RIM (outer wall band) ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0,0,7); }, toneSolid(inkLevel(RIM)), 6);
  // ---- dark hollow INTERIOR (inside the thick wall) ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf-wall, rimRh-wall*params.rimFlat*1.4, 0,0,7); },
            toneSolid(inkLevel(INTER)), 4);

  // ---- WINE surface inside the hollow ----
  let surface = { x:cx, y:rimY, half:rimHalf-wall };
  if (fill>0.02){
    const innerHalf = rimHalf-wall, innerRh = rimRh-wall*params.rimFlat*1.4;
    const fSurf = clamp(1 - fill, 0, 0.92);           // fraction down from rim
    const surfY = rimY + span*0.62*fSurf;             // wine sits in the upper bell
    const shrink= lerp(1.0, 0.72, fSurf);
    const surfH = innerHalf*shrink;
    const surfRh= innerRh*shrink;
    pen.paint(()=>{ g.ellipse(cx, surfY, surfH, surfRh, 0,0,7); }, toneSolid(inkLevel(WINE)), 3);
    // glint bands on the dark wine
    g.strokeStyle=inkLevel(WINE_G); g.lineWidth=2; g.lineCap="round";
    for(let i=1;i<=2;i++){
      const rr = surfH*(0.34+0.28*i) + Math.sin(t*1.6+i)*surfH*0.03;
      if (rr<surfH){ g.beginPath(); g.ellipse(cx, surfY, rr, rr*params.rimFlat, 0,0,7); g.stroke(); }
    }
    surface = { x:cx, y:surfY, half:surfH };
  }

  // ---- near-rim top HIGHLIGHT + crude uneven lip ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0.05, Math.PI-0.05); }, toneSolid(inkLevel(RIM_H)), 4);
  // chipped / uneven rim notches
  g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round";
  for(let k=0;k<9;k++){
    const a = Math.PI*(0.06+0.88*k/8);
    const ex = cx - Math.cos(a)*rimHalf, ey = rimY - Math.sin(a)*rimRh;
    const n = 1 + wob(k*3)*0.5;
    g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex, ey - H*0.008*n); g.stroke();
  }
  pen.seam(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0, Math.PI); }, 3);

  // ---- HEWN ADZE MARKS across the belly (the hand-carved look) ----
  g.strokeStyle=inkLevel(BODY_D+1); g.lineWidth=2.2; g.lineCap="round";
  for(let r=0;r<params.adzeRows;r++){
    const f = 0.16 + r*0.135;
    const yy = rimY + span*f, hw = halfAt(f)*0.86;
    const cols = 5 - (r%2);
    for(let c=0;c<cols;c++){
      const x = cx + lerp(-hw, hw, (c+0.5)/cols) + wob(r*7+c)*W*0.01;
      g.beginPath();
      g.moveTo(x-W*0.018, yy-H*0.004);
      g.quadraticCurveTo(x, yy+H*0.012, x+W*0.018, yy-H*0.004);
      g.stroke();
    }
  }
  // a couple of long wood-grain seams following the belly
  pen.seam(()=>{ g.moveTo(cx-rimHalf*0.5, rimY+span*0.12);
                 g.quadraticCurveTo(cx-halfAt(0.5)*0.7, rimY+span*0.5, cx-halfAt(0.9)*0.6, bowlBot-span*0.06); }, 2.4);
  pen.seam(()=>{ g.moveTo(cx+rimHalf*0.42, rimY+span*0.16);
                 g.quadraticCurveTo(cx+halfAt(0.5)*0.65, rimY+span*0.52, cx+halfAt(0.9)*0.5, bowlBot-span*0.05); }, 2.4);

  return { cx, rimY, rimHalf, rimRh, wall, bowlBot, baseBot, span,
           lipL:{x:cx-rimHalf, y:rimY}, lipR:{x:cx+rimHalf, y:rimY},
           lugL:{x:cx-lugHW, y:lugY}, lugR:{x:cx+lugHW, y:lugY}, surface };
}

/* rotate a point p about pivot piv by angle a (canvas y-down) */
function rot(p,piv,a){ const s=Math.sin(a),c=Math.cos(a); const dx=p.x-piv.x, dy=p.y-piv.y;
  return { x:piv.x+dx*c-dy*s, y:piv.y+dx*s+dy*c }; }

function drawHand(pen,g,W,H,x,y,side){
  pen.paint(()=>{ g.ellipse(x, y, W*0.040, W*0.030, side*0.2, 0,7); }, toneSolid(inkLevel(HAND)), 4);
  // forearm trailing off toward the frame edge
  pen.limb(()=>{ g.moveTo(x,y); g.lineTo(x+side*W*0.12, y+H*0.03); }, toneSolid(inkLevel(HAND-1)), W*0.032);
  // knuckle ticks gripping the lug
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(x+i*W*0.010, y-W*0.024); g.lineTo(x+i*W*0.010, y-W*0.008); g.stroke(); }
}

/* wavy dark wine ribbon between two points */
function wineStream(pen,g,W,H,ax,ay,bx,by,wpx,t){
  const midx=(ax+bx)/2 + Math.sin(t*3)*W*0.012, midy=(ay+by)/2;
  pen.paint(()=>{
    g.moveTo(ax-wpx, ay);
    g.quadraticCurveTo(midx-wpx, midy, bx-wpx, by);
    g.lineTo(bx+wpx, by);
    g.quadraticCurveTo(midx+wpx, midy, ax+wpx, ay);
    g.closePath();
  }, toneSolid(inkLevel(WINE)), 3);
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const fill  = st.fill  ?? 0.6;   // wine level 0..1
  const pour  = st.pour  ?? 0;     // stream pouring in from above
  const tilt  = st.tilt  ?? 0;     // tipped toward guest (offer/drink)
  const grip  = st.grip  ?? 0;     // a hand gripping the near lug
  const spill = st.spill ?? 0;     // knocked over + puddle (drop)
  const t     = st.t     ?? 0;

  const cx = W*0.5, baseBot = H*params.baseBotY;
  const piv = { x:cx, y:baseBot };

  // ---- DROP: knocked over on its side + a spreading wine puddle ----
  if (spill>0.5){
    // ground puddle first (behind the toppled vessel)
    g.fillStyle=inkLevel(WINE);
    g.beginPath(); g.ellipse(cx+W*0.14, baseBot+H*0.02, W*0.30, H*0.030, 0,0,7); g.fill();
    g.fillStyle=inkLevel(WINE_G);
    g.beginPath(); g.ellipse(cx+W*0.30, baseBot+H*0.022, W*0.08, H*0.012, 0,0,7); g.fill();
    const ang = -1.5;                                  // lay over toward the left
    g.save();
    g.translate(0, H*0.06);
    g.translate(piv.x,piv.y); g.rotate(ang); g.translate(-piv.x,-piv.y);
    drawBowl(pen,g,W,H, 0.12, t, { airborne:true });
    g.restore();
    return;
  }

  // ---- TILT transform for OFFER / DRINK (tip toward the guest, to the right) ----
  const ang = tilt*0.62;
  const airborne = tilt>0.2;
  g.save();
  if (ang>0.001){ g.translate(piv.x,piv.y); g.rotate(ang); g.translate(-piv.x,-piv.y); }
  const K = drawBowl(pen,g,W,H, fill, t, { airborne });
  g.restore();

  // world-space key points after the tilt
  const lipR = rot(K.lipR, piv, ang);
  const lipL = rot(K.lipL, piv, ang);
  const lugL = rot(K.lugL, piv, ang);
  const surf = rot(K.surface, piv, ang);

  // ---- FILL / REFILL: a dark stream pouring into the mouth from above ----
  if (pour>0.02){
    const topY = H*0.075, wpx = W*0.018*pour;
    const landY = K.rimY - K.rimRh*0.1;
    wineStream(pen,g,W,H, cx, topY, cx, landY, wpx, t);
    // splash ticks off the surface
    g.strokeStyle=inkLevel(WINE_G); g.lineWidth=2.5; g.lineCap="round";
    for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(cx+i*W*0.03, surf.y); g.lineTo(cx+i*W*0.045, surf.y-H*0.02); g.stroke(); }
  }

  // ---- DRINK: a wine thread spilling from the lowered right lip ----
  if (tilt>0.7){
    const mx = lipR.x + W*0.10, my = lipR.y + H*0.14;   // toward an off-frame mouth
    wineStream(pen,g,W,H, lipR.x, lipR.y, mx, my, W*0.011, t);
  }

  // ---- GRIP: a hand clasping the near (left) lug ----
  if (grip>0.5){ drawHand(pen,g,W,H, lugL.x-W*0.02, lugL.y, -1); }
}

export const asset = {
  id:"prop.wine-cup",
  type:"PROP",
  name:"Wine Cup",
  statusWord:"BRIMMING",
  scene:"OD-B09-S08",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","puddle","base","body","belly","lugs","rim","interior","wine",
          "lip","adze","grain","pour","drink-stream","hand"],
  // normalized 0..1 anchors: grip / support / contact / pour+serve targets
  anchors:{
    "rim:mouth":{x:.50,y:.300},          // centre of the wide mouth
    "surface:wine":{x:.50,y:.42},        // wine surface centre (mid fill)
    "grip:lug-l":{x:.13,y:.360},         // left grip lug
    "grip:lug-r":{x:.87,y:.360},         // right grip lug
    "contact:base":{x:.50,y:.815},       // crude base on the ground
    "target:pour":{x:.50,y:.27},         // where a pour enters the mouth
    "spout:lip":{x:.83,y:.300},          // the lip wine pours from when drunk
  },
  // collision box (AABB in 0..1) for placement / pathing
  zones:{ bounds:{ x0:.05,y0:.28,x1:.95,y1:.83 }, footprint:{ x0:.33,y0:.79,x1:.67,y1:.83 } },
  // ownership: Maron's dark wine, offered by Odysseus to Polyphemus
  ownership:{ source:"Maron", holder:"Odysseus", offeredTo:"Polyphemus", kind:"guest-cup" },
  states:{
    initial:"fill",
    nodes:{
      fill:   { preview:{ fill:0.55, pour:1, tilt:0,   grip:0, spill:0, status:"FILLING",  progress:.20 } },
      offer:  { preview:{ fill:0.75, pour:0, tilt:0.45,grip:1, spill:0, status:"OFFERED",  progress:.40 } },
      drink:  { preview:{ fill:0.35, pour:0, tilt:1,   grip:1, spill:0, status:"DRINKING", progress:.60 } },
      refill: { preview:{ fill:0.90, pour:1, tilt:0,   grip:0, spill:0, status:"REFILLED", progress:.80 } },
      drop:   { preview:{ fill:0.10, pour:0, tilt:0,   grip:0, spill:1, status:"DROPPED",  progress:.95 } },
    },
    edges:[["fill","offer"],["offer","drink"],["drink","refill"],["refill","offer"],
           ["drink","drop"],["refill","drop"],["offer","fill"]],
  },
  channels:["fill","pour","tilt","grip","spill","t"],

  preview:()=>({ fill:0.7, pour:0, tilt:0, grip:0, spill:0, t:0, status:"BRIMMING", progress:.5 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
