/* prop.drugged-cup — Circe's GOLDEN GOBLET: a stemmed, knopped, two-handled
   chalice brimming with a mixed food-and-wine potion, over which a faint
   sinister shimmer plays. PROP asset. Drawn in SOLID grays + hard contour
   into the offscreen ctx; the engine dotify pass supplies the halftone.
   Do NOT pre-dither.
   The gold body reads as a LIGHT metal (few dots); the drugged mixture is a
   DARK surface flecked with pale food-lumps; the tonal steps separate
   lip / body / stem / foot / mix. Scale, grip/support/contact anchors,
   ownership and collision box declared in 0..1 space.
   Scene function (OD-B10-S06): a reusable drugged vessel with four states —
   SERVE (offered out, brimming, a faint shimmer of stars over the mouth),
   CONSUME (tipped to a drinker, a thread from the lowered lip, level draining),
   SPELL-TRIGGER (the drug bites: dark jagged rays + an expanding dark ring
   burst from the mouth as Circe's charm takes), and NULLIFIED (Hermes' moly
   guard: the sinister field is broken by a bright steady ring + a moly sprig,
   the shimmer struck through, the cup harmless). */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  scale:1.0,
  rimHalf:0.230,     // mouth half-width (fraction of W)
  waistHalf:0.052,   // bowl->stem join half-width
  rimFlat:0.30,      // mouth ellipse flatten (rh = rimHalf*rimFlat)
  rimY:0.285,        // mouth height (fraction of H)
  bowlBotY:0.520,    // bottom of the cup bowl where it joins the stem
  knopY:0.588,       // spherical knop mid-stem
  footTopY:0.648,    // top of the spreading foot
  footBaseY:0.720,   // foot rests here on the ground
  footHalf:0.140,    // foot disc half-width (fraction of W)
  ownedBy:"circe->offered-guests", // Circe's cup, pressed on every guest
};

const BODY   = 3;    // golden cup body (light metal)
const BODY_D = 5;    // shaded right flank of the bowl
const RIM_H  = 1;    // bright lip highlight
const INTER  = 6;    // dark hollow interior ring
const MIX    = 6;    // drugged food-and-wine surface (dark)
const MIX_G  = 3;    // pale food-lump / glint flecks
const STEM   = 4;    // stem + knop
const KNOP_H = 2;    // knop highlight
const FOOT   = 4;    // spreading foot
const HANDLE = 4;    // slim curved handles
const HAND   = 4;    // gripping / offering hand

/* bowl cross-section: half-width at fraction f down the cup (0 rim .. 1 join).
   A tulip curve — wide mouth easing in to a narrow stem join. */
function bowlHalf(f){
  f = clamp(f,0,1);
  return params.waistHalf + (params.rimHalf-params.waistHalf)*Math.pow(1-f,1.28);
}

/* a small four-point sparkle (sinister shimmer) drawn as thin ink ticks */
function sparkle(g,x,y,r,tone,lw){
  g.strokeStyle=tone; g.lineWidth=lw; g.lineCap="round";
  g.beginPath(); g.moveTo(x-r,y); g.lineTo(x+r,y);
  g.moveTo(x,y-r); g.lineTo(x,y+r); g.stroke();
  const d=r*0.55;
  g.lineWidth=lw*0.7;
  g.beginPath(); g.moveTo(x-d,y-d); g.lineTo(x+d,y+d);
  g.moveTo(x-d,y+d); g.lineTo(x+d,y-d); g.stroke();
}

/* ------------------------------------------------------------------
   THE GOBLET — drawn in absolute canvas coords. Returns key world points. */
function drawGoblet(pen,g,W,H,fill,t,opts={}){
  const cx = W*0.5;
  const rimHalf = W*params.rimHalf;
  const rimY    = H*params.rimY;
  const rimRh   = rimHalf*params.rimFlat;
  const bowlBot = H*params.bowlBotY;
  const knopY   = H*params.knopY;
  const footTop = H*params.footTopY;
  const footBase= H*params.footBaseY;
  const footHW  = W*params.footHalf;
  const bowlSpan= bowlBot - rimY;
  const halfAt  = f => W*bowlHalf(f);
  const stemHW  = W*params.waistHalf*0.5;

  // ---- ground shadow under the foot ----
  if (!opts.airborne){
    g.fillStyle="rgba(0,0,0,0.11)";
    g.beginPath(); g.ellipse(cx, footBase+H*0.006, footHW*1.15, H*0.017, 0,0,7); g.fill();
  }

  // ---- SLIM CURVED HANDLES (behind the bowl so the belly overlaps the roots) ----
  for(const s of [-1,1]){
    const topA = { x:cx + s*halfAt(0.10)*0.98, y:rimY + rimRh*1.2 };
    const botA = { x:cx + s*halfAt(0.62)*1.00, y:rimY + bowlSpan*0.62 };
    const far  = { x:cx + s*rimHalf*1.30,       y:(topA.y+botA.y)/2 };
    pen.limb(()=>{
      g.moveTo(topA.x, topA.y);
      g.quadraticCurveTo(far.x, topA.y - bowlSpan*0.05, far.x, far.y);
      g.quadraticCurveTo(far.x, botA.y+bowlSpan*0.04, botA.x, botA.y);
    }, toneSolid(inkLevel(HANDLE)), W*0.018);
  }

  // ---- spreading FOOT disc ----
  pen.paint(()=>{
    g.moveTo(cx-footHW, footBase);
    g.lineTo(cx+footHW, footBase);
    g.lineTo(cx+footHW*0.55, footBase-(footBase-footTop)*0.55);
    g.lineTo(cx+stemHW*1.4, footTop);
    g.lineTo(cx-stemHW*1.4, footTop);
    g.lineTo(cx-footHW*0.55, footBase-(footBase-footTop)*0.55);
    g.closePath();
  }, toneSolid(inkLevel(FOOT)), 5);
  pen.paint(()=>{ g.ellipse(cx, footBase, footHW, H*0.015, 0,0,7); }, toneSolid(inkLevel(BODY_D)), 4);

  // ---- STEM (slender column) with a spherical KNOP mid-way ----
  pen.paint(()=>{
    g.moveTo(cx-stemHW, bowlBot);
    g.lineTo(cx+stemHW, bowlBot);
    g.lineTo(cx+stemHW*1.25, footTop);
    g.lineTo(cx-stemHW*1.25, footTop);
    g.closePath();
  }, toneSolid(inkLevel(STEM)), 4);
  pen.paint(()=>{ g.ellipse(cx, knopY, stemHW*2.6, stemHW*2.2, 0,0,7); }, toneSolid(inkLevel(STEM)), 4); // knop
  pen.paint(()=>{ g.ellipse(cx-stemHW*0.7, knopY-stemHW*0.5, stemHW*0.9, stemHW*0.7, -0.4, 0,7); },
            toneSolid(inkLevel(KNOP_H)), 0); // knop highlight

  // ---- CUP BOWL (tulip silhouette, as a solid) ----
  pen.paint(()=>{
    g.moveTo(cx-rimHalf, rimY);
    g.quadraticCurveTo(cx-halfAt(0.5)*1.02, rimY+bowlSpan*0.52, cx-halfAt(1)*1.0, bowlBot);
    g.lineTo(cx+halfAt(1)*1.0, bowlBot);
    g.quadraticCurveTo(cx+halfAt(0.5)*1.02, rimY+bowlSpan*0.52, cx+rimHalf, rimY);
    g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0, Math.PI, true);   // back rim arc
    g.closePath();
  }, toneSolid(inkLevel(BODY)), 6);

  // ---- shaded flank crescent (volume shade hugging the right contour) ----
  pen.paint(()=>{
    const f0=0.10, f1=0.86;
    g.moveTo(cx+halfAt(f0)*0.86, rimY+bowlSpan*f0);
    for(let i=0;i<=8;i++){ const f=lerp(f0,f1,i/8); g.lineTo(cx+halfAt(f)*0.99, rimY+bowlSpan*f); }
    for(let i=8;i>=0;i--){ const f=lerp(f0,f1,i/8); g.lineTo(cx+halfAt(f)*0.86, rimY+bowlSpan*f); }
    g.closePath();
  }, toneSolid(inkLevel(BODY_D)), 0);

  // ---- MOUTH interior (dark hollow) inside a golden rim ring ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf*0.90, rimRh*0.90, 0,0,7); }, toneSolid(inkLevel(INTER)), 4);

  // ---- the DRUGGED MIXTURE surface (dark) with pale food-lumps ----
  let surface = { x:cx, y:rimY, half:rimHalf*0.9 };
  if (fill>0.02){
    const fSurf = clamp(1 - fill*0.92, 0, 1);
    const surfY = rimY + bowlSpan*fSurf*0.9;
    const surfH = halfAt(fSurf*0.9)*0.90;
    const surfRh= surfH*params.rimFlat;
    pen.paint(()=>{ g.ellipse(cx, surfY, surfH, surfRh, 0,0,7); }, toneSolid(inkLevel(MIX)), 3);
    // pale food-lumps floating in the potion (the food-and-wine "mix")
    g.fillStyle=inkLevel(MIX_G);
    const lumps=[[-0.35,0.10],[0.28,-0.18],[0.05,0.22],[-0.12,-0.05],[0.44,0.12]];
    for(const [lx,ly] of lumps){
      const px=cx+lx*surfH, py=surfY+ly*surfRh;
      if (Math.abs(lx)<0.92){ g.beginPath(); g.ellipse(px,py,surfH*0.075,surfRh*0.16,0.3,0,7); g.fill(); }
    }
    // a couple of glint bands
    g.strokeStyle=inkLevel(MIX_G); g.lineWidth=2; g.lineCap="round";
    for(let i=1;i<=2;i++){
      const rr = surfH*(0.36+0.30*i) + Math.sin(t*1.4+i)*surfH*0.03;
      if (rr<surfH){ g.beginPath(); g.ellipse(cx, surfY, rr, rr*params.rimFlat, 0,0,7); g.stroke(); }
    }
    surface = { x:cx, y:surfY, half:surfH };
  }

  // ---- near-rim LIP highlight (bright gold band on the front edge) ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0.06, Math.PI-0.06); }, toneSolid(inkLevel(RIM_H)), 4);
  pen.seam(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0, Math.PI); }, 3);

  // ---- decorative girdle seams around the bowl (a chased gold band) ----
  for(let i=1;i<=2;i++){
    const f = 0.34 + i*0.24;
    const yy = rimY + bowlSpan*f, hw = halfAt(f)*0.99;
    pen.seam(()=>{ g.moveTo(cx-hw, yy); g.lineTo(cx+hw, yy); }, 2.4);
  }
  // a rope of chased ticks on the upper band
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  const fy = rimY+bowlSpan*0.34, fhw = halfAt(0.34)*0.94;
  for(let k=-4;k<=4;k++){ const x=cx+k*fhw/4.4; g.beginPath(); g.moveTo(x, fy-bowlSpan*0.035); g.lineTo(x, fy+bowlSpan*0.035); g.stroke(); }

  return { cx, rimY, rimHalf, rimRh, bowlBot, knopY, footTop, footBase, surface,
           lipL:{x:cx-rimHalf,y:rimY}, lipR:{x:cx+rimHalf,y:rimY},
           handleL:{x:cx-rimHalf*1.30,y:rimY+bowlSpan*0.35},
           handleR:{x:cx+rimHalf*1.30,y:rimY+bowlSpan*0.35} };
}

/* rotate a point p about pivot piv by angle a (canvas y-down) */
function rot(p,piv,a){ const s=Math.sin(a),c=Math.cos(a); const dx=p.x-piv.x, dy=p.y-piv.y;
  return { x:piv.x+dx*c-dy*s, y:piv.y+dx*s+dy*c }; }

/* a hand offering / steadying the goblet at the stem */
function drawHand(pen,g,W,H,x,y,side){
  pen.paint(()=>{ g.ellipse(x, y, W*0.038, W*0.028, side*0.2, 0,7); }, toneSolid(inkLevel(HAND)), 4);
  pen.limb(()=>{ g.moveTo(x,y); g.lineTo(x+side*W*0.13, y+H*0.035); }, toneSolid(inkLevel(HAND-1)), W*0.030);
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(x+i*W*0.010, y-W*0.020); g.lineTo(x+i*W*0.010, y-W*0.004); g.stroke(); }
}

/* a wavy dark potion ribbon between two points */
function potionStream(pen,g,W,H,ax,ay,bx,by,wpx,t){
  const midx=(ax+bx)/2 + Math.sin(t*3)*W*0.012, midy=(ay+by)/2;
  pen.paint(()=>{
    g.moveTo(ax-wpx, ay);
    g.quadraticCurveTo(midx-wpx, midy, bx-wpx, by);
    g.lineTo(bx+wpx, by);
    g.quadraticCurveTo(midx+wpx, midy, ax+wpx, ay);
    g.closePath();
  }, toneSolid(inkLevel(MIX)), 3);
}

/* faint sinister SHIMMER — a balanced arc of small sparkles hovering over the
   mouth, spread across the full rim width so it reads as an aura, not noise. */
function drawShimmer(g,W,H,cx,fcy,rimHalf,intensity,t){
  const n=7;
  const lvl = 2 + Math.round(intensity*3);
  for(let i=0;i<n;i++){
    const u = (i+0.5)/n;                         // 0..1 across the mouth width
    const x = cx + (u-0.5)*2*rimHalf*0.92;
    const arc = Math.sin(u*Math.PI);             // higher over the centre
    const bob = Math.sin(t*1.2 + i*1.7)*H*0.012;
    const y = fcy - H*0.03 - arc*H*0.055 + bob;
    const r = (W*0.010+W*0.012*(i%2))*(0.6+0.4*intensity);
    sparkle(g,x,y,r,inkLevel(lvl),Math.max(1.5,2.4*intensity));
  }
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const fill    = st.fill    ?? 0.75;  // potion level 0..1
  const shimmer = st.shimmer ?? 0.4;   // sinister shimmer intensity 0..1
  const tilt    = st.tilt    ?? 0;     // tipped to a drinker (consume)
  const grip    = st.grip    ?? 0;     // an offering hand at the stem
  const spell   = st.spell   ?? 0;     // charm takes: dark rays + ring
  const nullified = st.nullified ?? 0; // moly guard: field broken
  const t       = st.t       ?? 0;

  const cx = W*0.5, footBase = H*params.footBaseY;
  const piv = { x:cx, y:footBase };

  // ---- SPELL-TRIGGER: dark jagged rays + an expanding dark ring behind the cup ----
  if (spell>0.02){
    const scx=cx, scy=H*params.rimY - H*params.rimFlat*params.rimHalf*0.4;
    g.save();
    // dark bloom behind
    g.fillStyle=inkLevel(2);
    g.beginPath(); g.ellipse(scx, scy, W*0.46*spell, H*0.30*spell, 0,0,7); g.fill();
    // jagged transformation bolts radiating out
    const bolts=10;
    g.strokeStyle=inkLevel(7); g.lineCap="round"; g.lineJoin="round";
    for(let i=0;i<bolts;i++){
      const a = i/bolts*Math.PI*2 + t*0.3;
      const r0=W*0.09, r1=W*(0.20+0.10*((i*7)%3)/2)*spell;
      const jx=Math.cos(a), jy=Math.sin(a)*0.66;
      const mx=scx+jx*r0*1.5 + Math.cos(a+1.4)*W*0.02;
      const my=scy+jy*r0*1.5 + Math.sin(a+1.4)*H*0.014;
      g.lineWidth=Math.max(2,3.4*spell);
      g.beginPath();
      g.moveTo(scx+jx*r0, scy+jy*r0);
      g.lineTo(mx,my);
      g.lineTo(scx+jx*(r0+r1), scy+jy*(r0+r1));
      g.stroke();
    }
    // expanding dark rings
    for(let i=0;i<3;i++){
      const phase=((t*0.5+i/3)%1);
      const rr=W*0.10+phase*W*0.34*spell;
      g.strokeStyle=inkLevel(6-Math.round(phase*3));
      g.lineWidth=Math.max(1.5,3.2*(1-phase));
      g.beginPath(); g.ellipse(scx, scy, rr, rr*0.60, 0,0,7); g.stroke();
    }
    g.restore();
  }

  // ---- TILT transform for CONSUME (tip toward a drinker on the right) ----
  const ang = tilt*0.55;
  const airborne = tilt>0.2;
  g.save();
  if (ang>0.001){ g.translate(piv.x,piv.y); g.rotate(ang); g.translate(-piv.x,-piv.y); }
  const K = drawGoblet(pen,g,W,H, fill, t, { airborne });
  g.restore();

  const lipR = rot(K.lipR, piv, ang);
  const surf = rot(K.surface, piv, ang);
  const fcy  = rot({x:cx,y:K.rimY}, piv, ang).y;

  // ---- CONSUME: a potion thread from the lowered lip toward an off-frame mouth ----
  if (tilt>0.6){
    const mx = lipR.x + W*0.11, my = lipR.y + H*0.15;
    potionStream(pen,g,W,H, lipR.x, lipR.y, mx, my, W*0.011, t);
  }

  // ---- the sinister SHIMMER over the mouth (suppressed while nullified) ----
  if (shimmer>0.02 && nullified<0.5){
    drawShimmer(g,W,H, cx, fcy, K.rimHalf, shimmer*(spell>0.5?1.3:1), t);
  }

  // ---- GRIP: an offering hand steadying the stem ----
  if (grip>0.5){ drawHand(pen,g,W,H, cx-W*0.055, K.knopY+H*0.01, -1); }

  // ---- NULLIFIED: moly guard — a bright steady ring, a moly sprig, shimmer struck out ----
  if (nullified>0.5){
    const rcx=cx, rcy=K.rimY - K.rimRh*0.4;
    // a clean bright protective ring around the mouth (not expanding — steady)
    g.strokeStyle=inkLevel(5); g.lineWidth=3.2; g.setLineDash([W*0.02,W*0.012]);
    g.beginPath(); g.ellipse(rcx, rcy, K.rimHalf*1.35, K.rimHalf*1.35*0.62, 0,0,7); g.stroke();
    g.setLineDash([]);
    // strike-through over the shimmer zone (the charm is voided)
    g.strokeStyle=INK; g.lineWidth=3.4; g.lineCap="round";
    g.beginPath();
    g.moveTo(rcx-K.rimHalf*0.9, rcy-H*0.045);
    g.lineTo(rcx+K.rimHalf*0.9, rcy+H*0.03); g.stroke();
    // a MOLY SPRIG beside the cup: dark root bulb, pale stem, white star-flower
    const mgx=cx+W*0.30, mgy=H*0.66;
    pen.paint(()=>{ g.ellipse(mgx, mgy, W*0.028, W*0.020, 0.2, 0,7); }, toneSolid(inkLevel(7)), 3); // black root
    pen.limb(()=>{ g.moveTo(mgx, mgy-W*0.01); g.quadraticCurveTo(mgx-W*0.02, mgy-H*0.10, mgx-W*0.01, mgy-H*0.17); },
             toneSolid(inkLevel(3)), W*0.010); // pale stem
    // white five-point flower head
    const fx=mgx-W*0.01, fy=mgy-H*0.18;
    pen.paint(()=>{ g.ellipse(fx,fy,W*0.030,W*0.030,0,0,7); }, toneSolid(inkLevel(1)), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
    for(let i=0;i<5;i++){ const a=i/5*Math.PI*2-Math.PI/2;
      g.beginPath(); g.moveTo(fx,fy); g.lineTo(fx+Math.cos(a)*W*0.028, fy+Math.sin(a)*W*0.028); g.stroke(); }
    g.fillStyle=INK; g.beginPath(); g.arc(fx,fy,W*0.007,0,7); g.fill();
  }
}

export const asset = {
  id:"prop.drugged-cup",
  type:"PROP",
  name:"Drugged Cup",
  statusWord:"LACED",
  scene:"OD-B10-S06",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","spell-field","handles","foot","stem","knop","bowl","flank",
          "interior","mixture","lumps","lip","girdle","consume-stream","shimmer","hand","moly"],
  // normalized 0..1 anchors: grip / support / contact / serve / field targets
  anchors:{
    "rim:mouth":{x:.50,y:.285},          // centre of the mouth
    "surface:mix":{x:.50,y:.40},         // drugged-mixture surface (mid fill)
    "grip:stem":{x:.50,y:.588},          // knop/stem grip
    "grip:handle-l":{x:.20,y:.44},       // left curved handle
    "grip:handle-r":{x:.80,y:.44},       // right curved handle
    "contact:foot":{x:.50,y:.720},       // foot on the ground
    "spout:lip":{x:.73,y:.285},          // the lip the potion pours from when drunk
    "target:drinker":{x:.86,y:.52},      // an off-frame drinker's mouth
    "field:origin":{x:.50,y:.27},        // source of shimmer / spell field
    "guard:moly":{x:.79,y:.55},          // where the moly sprig neutralizes it
  },
  // collision box (AABB in 0..1) for placement / pathing
  zones:{ bounds:{ x0:.15,y0:.24,x1:.85,y1:.73 }, footprint:{ x0:.36,y0:.70,x1:.64,y1:.73 } },
  // ownership: Circe's cup, pressed on each arriving guest
  ownership:{ source:"Circe", holder:"Circe", offeredTo:"guests/Odysseus", kind:"guest-cup" },
  states:{
    initial:"serve",
    nodes:{
      serve:          { preview:{ fill:0.82, shimmer:0.5, tilt:0,   grip:1, spell:0, nullified:0, status:"SERVED",     progress:.20 } },
      consume:        { preview:{ fill:0.35, shimmer:0.4, tilt:1,   grip:0, spell:0, nullified:0, status:"CONSUMED",   progress:.45 } },
      "spell-trigger":{ preview:{ fill:0.30, shimmer:0.9, tilt:0,   grip:0, spell:1, nullified:0, status:"CHARMED",    progress:.72 } },
      nullified:      { preview:{ fill:0.50, shimmer:0.0, tilt:0,   grip:0, spell:0, nullified:1, status:"NULLIFIED",  progress:.95 } },
    },
    edges:[["serve","consume"],["consume","spell-trigger"],["consume","nullified"],
           ["spell-trigger","serve"],["nullified","serve"]],
  },
  channels:["fill","shimmer","tilt","grip","spell","nullified","t"],

  preview:()=>({ fill:0.82, shimmer:0.5, tilt:0, grip:1, spell:0, nullified:0, t:0, status:"LACED", progress:.28 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
