/* prop.helens-mixing-bowl — a wide two-handled wine krater on a footed stand:
   Helen's mixing bowl, in which she mixes the grief-drug (nepenthe) into the
   wine before serving it round. PROP asset. Drawn in SOLID grays + hard
   contour into the offscreen ctx; the engine dotify pass supplies the
   halftone. Do NOT pre-dither.
   Scene function (OD-B04-S03): a reusable wine vessel with five states —
   POUR (wine streams down into the mouth, level rising), DRUG-ADD (a hand
   above the bowl releases the dark drug, drops falling + a spreading ring on
   the wine), STIR (a long ladle-rod dips in and swirls the surface), SERVE (the
   ladle lifts out to the side and pours a thread into a waiting cup), and
   AFFECT-FIELD (a soft calm radiates outward from the bowl in concentric
   rings once the drugged wine takes hold).
   The krater is a fired terracotta body (mid tone) with a dark interior and a
   dark wine surface — the tonal steps separate lip / body / wine / stand.
   Grip / support / contact / pour anchors declared in 0..1 space. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  rimHalf:0.315,     // mouth half-width (fraction of W)
  waistHalf:0.085,   // narrow join half-width where the bowl meets the stem
  rimFlat:0.24,      // mouth ellipse flatten (rh = rimHalf*rimFlat)
  rimY:0.335,        // mouth height (fraction of H)
  bowlBotY:0.600,    // bottom of the bell where it joins the stem
  footTopY:0.655,    // top of the spreading foot
  footBaseY:0.720,   // foot sits here on the ground
  footHalf:0.150,    // foot disc half-width (fraction of W)
  friezeBands:2,     // decorative girdle seams around the belly
};

const BODY   = 4;    // krater terracotta body (mid tone)
const BODY_D = 5;    // shoulder / stem shade
const INTER  = 6;    // dark interior of the mouth
const WINE   = 6;    // wine surface (dark)
const WINE_G = 5;    // wine glint band
const FOOT   = 5;    // foot / stem
const LADLE  = 4;    // ladle + hand tone
const CUP    = 4;    // serving cup

/* bell cross-section: half-width at fraction f down the bowl (0 rim .. 1 join).
   Concave sides, wide mouth narrowing to the stem. */
function bowlHalf(f){
  f = clamp(f,0,1);
  return params.waistHalf + (params.rimHalf-params.waistHalf)*Math.pow(1-f,1.35);
}

/* ------------------------------------------------------------------
   THE KRATER — drawn in absolute canvas coords. Returns key world points. */
function drawKrater(pen,g,W,H,fill,t){
  const cx = W*0.5;
  const rimHalf = W*params.rimHalf;
  const rimY    = H*params.rimY;
  const rimRh   = rimHalf*params.rimFlat;
  const bowlBot = H*params.bowlBotY;
  const footTop = H*params.footTopY;
  const footBase= H*params.footBaseY;
  const footHW  = W*params.footHalf;
  const bowlSpan= bowlBot - rimY;
  const halfAt  = f => W*bowlHalf(f);         // world half-width at fraction f

  // ---- ground shadow under the foot ----
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footBase+H*0.006, footHW*1.1, H*0.017, 0,0,7); g.fill();

  // ---- HANDLES (behind the body so the belly overlaps their roots; the paper
  //      gap between handle and body opens into a loop) ----
  for(const s of [-1,1]){
    const topA = { x:cx + s*halfAt(0.06)*0.96, y:rimY + rimRh*1.4 };
    const botA = { x:cx + s*halfAt(0.46)*1.00, y:rimY + bowlSpan*0.46 };
    const far  = { x:cx + s*rimHalf*1.36,       y:(topA.y+botA.y)/2 };
    pen.limb(()=>{
      g.moveTo(topA.x, topA.y);
      g.quadraticCurveTo(far.x, topA.y - bowlSpan*0.02, far.x, far.y);
      g.quadraticCurveTo(far.x, botA.y, botA.x, botA.y);
    }, toneSolid(inkLevel(BODY_D)), W*0.028);
  }

  // ---- FOOT (spreading disc) + STEM (short column) ----
  pen.paint(()=>{                                   // foot disc
    g.moveTo(cx-footHW, footBase);
    g.lineTo(cx+footHW, footBase);
    g.lineTo(cx+footHW*0.62, footBase-(footBase-footTop)*0.55);
    g.lineTo(cx+W*params.waistHalf*1.1, footTop);
    g.lineTo(cx-W*params.waistHalf*1.1, footTop);
    g.lineTo(cx-footHW*0.62, footBase-(footBase-footTop)*0.55);
    g.closePath();
  }, toneSolid(inkLevel(FOOT)), 6);
  pen.paint(()=>{ g.ellipse(cx, footBase, footHW, H*0.016, 0,0,7); }, toneSolid(inkLevel(BODY_D)), 5);
  pen.paint(()=>{                                   // stem between bowl join and foot
    const sw = W*params.waistHalf;
    g.moveTo(cx-sw*0.92, bowlBot);
    g.lineTo(cx+sw*0.92, bowlBot);
    g.lineTo(cx+sw*1.15, footTop);
    g.lineTo(cx-sw*1.15, footTop);
    g.closePath();
  }, toneSolid(inkLevel(FOOT)), 5);

  // ---- BOWL BODY (the bell silhouette, drawn as a solid) ----
  pen.paint(()=>{
    g.moveTo(cx-rimHalf, rimY);
    // left side down to the join (concave)
    g.quadraticCurveTo(cx-halfAt(0.55)*1.02, rimY+bowlSpan*0.52, cx-halfAt(1)*1.0, bowlBot);
    g.lineTo(cx+halfAt(1)*1.0, bowlBot);
    // right side up to the rim
    g.quadraticCurveTo(cx+halfAt(0.55)*1.02, rimY+bowlSpan*0.52, cx+rimHalf, rimY);
    // back rim arc closes the mouth
    g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0, Math.PI, true);
    g.closePath();
  }, toneSolid(inkLevel(BODY)), 6);

  // ---- MOUTH interior (dark hollow) — sits inside a lighter body ring ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf*0.90, rimRh*0.90, 0,0,7); }, toneSolid(inkLevel(INTER)), 4);

  // ---- WINE surface inside the bowl ----
  let surface = { x:cx, y:rimY, half:rimHalf*0.9 };
  if (fill>0.02){
    const fSurf = clamp(1 - fill*0.92, 0, 1);          // fraction down from rim
    const surfY = rimY + bowlSpan*fSurf;
    const surfH = halfAt(fSurf)*0.92;
    const surfRh= surfH*params.rimFlat;
    pen.paint(()=>{ g.ellipse(cx, surfY, surfH, surfRh, 0,0,7); }, toneSolid(inkLevel(WINE)), 3);
    // swirl / glint bands on the wine
    g.strokeStyle=inkLevel(WINE_G); g.lineWidth=2; g.lineCap="round";
    for(let i=1;i<=2;i++){
      const rr = surfH*(0.34+0.26*i) + Math.sin(t*1.6+i)*surfH*0.04;
      g.beginPath(); g.ellipse(cx, surfY, rr, rr*params.rimFlat, 0,0,7); g.stroke();
    }
    surface = { x:cx, y:surfY, half:surfH };
  }

  // ---- near-rim LIP highlight (a light band on the front edge) ----
  pen.paint(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0.06, Math.PI-0.06); }, toneSolid(inkLevel(BODY-2)), 4);
  pen.seam(()=>{ g.ellipse(cx, rimY, rimHalf, rimRh, 0, 0, Math.PI); }, 3);

  // ---- decorative frieze girdles around the belly ----
  for(let i=1;i<=params.friezeBands;i++){
    const f = 0.30 + i*0.22;
    const yy = rimY + bowlSpan*f, hw = halfAt(f)*0.98;
    pen.seam(()=>{ g.moveTo(cx-hw, yy); g.lineTo(cx+hw, yy); }, 2.5);
  }
  // a few frieze ticks (black-figure suggestion) on the widest band
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  const fy = rimY+bowlSpan*0.30, fhw = halfAt(0.30)*0.9;
  for(let k=-3;k<=3;k++){ const x=cx+k*fhw/3.4; g.beginPath(); g.moveTo(x, fy-bowlSpan*0.05); g.lineTo(x, fy+bowlSpan*0.05); g.stroke(); }

  return { cx, rimY, rimHalf, rimRh, bowlBot, footBase, surface };
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const fill  = st.fill   ?? 0.6;   // wine level 0..1
  const pour  = st.pour   ?? 0;     // wine streaming in from above
  const drug  = st.drug   ?? 0;     // drug released above the bowl
  const stir  = st.stir   ?? 0;     // ladle-rod dipped + swirling
  const serve = st.serve  ?? 0;     // ladle lifted, pouring into a cup
  const field = st.field  ?? 0;     // radiating calm field intensity 0..1
  const t     = st.t      ?? 0;

  const K = drawKrater(pen,g,W,H,fill,t);
  const cx=K.cx, surf=K.surface;

  // ---- POUR: a wavy wine stream falling into the mouth ----
  if (pour>0.02){
    const topY = H*0.11, wpx = W*0.014*pour;
    const landY = K.rimY - K.rimRh*0.2;
    g.save();
    pen.paint(()=>{
      const midY=(topY+landY)/2, wob=Math.sin(t*3)*W*0.012;
      g.moveTo(cx-wpx, topY);
      g.quadraticCurveTo(cx-wpx+wob, midY, cx-wpx*1.3, landY);
      g.lineTo(cx+wpx*1.3, landY);
      g.quadraticCurveTo(cx+wpx+wob, midY, cx+wpx, topY);
      g.closePath();
    }, toneSolid(inkLevel(WINE)), 3);
    // splash ticks on the surface
    g.strokeStyle=inkLevel(WINE_G); g.lineWidth=2; g.lineCap="round";
    for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(cx+i*W*0.02, surf.y); g.lineTo(cx+i*W*0.03, surf.y-H*0.02); g.stroke(); }
    g.restore();
  }

  // ---- DRUG-ADD: a pinching hand above releases dark drops; a ring spreads ----
  if (drug>0.02){
    const hx=cx+W*0.10, hy=H*0.20;
    // hand (a small fist with a pinch)
    pen.paint(()=>{ g.ellipse(hx, hy, W*0.030, W*0.024, 0.3, 0,7); }, toneSolid(inkLevel(LADLE)), 4);
    pen.limb(()=>{ g.moveTo(hx, hy); g.lineTo(hx+W*0.11, hy-H*0.03); }, toneSolid(inkLevel(LADLE-1)), W*0.026); // wrist
    // pinched fingers releasing
    pen.ink(()=>{ g.moveTo(hx-W*0.01, hy+W*0.02); g.lineTo(hx-W*0.005, hy+W*0.05); }, 3);
    // falling dark drops
    g.fillStyle=inkLevel(WINE);
    for(let i=0;i<3;i++){
      const dy = hy+W*0.06 + ((t*H*0.35 + i*H*0.06) % (surf.y-hy-W*0.05));
      const dx = hx-W*0.008 + Math.sin((dy)*0.05)*W*0.006;
      g.beginPath(); g.ellipse(dx, dy, W*0.008, W*0.013, 0,0,7); g.fill();
    }
    // spreading ring where the drug meets the wine
    g.strokeStyle=inkLevel(WINE_G); g.lineWidth=2.5; g.lineCap="round";
    for(let i=0;i<2;i++){
      const rr = surf.half*(0.2+0.35*i) + (Math.sin(t*2)*0.5+0.5)*surf.half*0.2;
      g.beginPath(); g.ellipse(cx, surf.y, rr, rr*params.rimFlat, 0,0,7); g.stroke();
    }
  }

  // ---- STIR: a long ladle-rod dipped in at an angle, swirl arcs on the wine ----
  if (stir>0.02){
    const topX=cx-W*0.20, topY=H*0.17;
    const dipX=cx-W*0.05, dipY=surf.y+H*0.01;
    pen.limb(()=>{ g.moveTo(topX, topY); g.lineTo(dipX, dipY); }, toneSolid(inkLevel(LADLE)), W*0.014);
    // ladle bowl at the top (grip end knob)
    pen.paint(()=>{ g.ellipse(topX-W*0.01, topY-H*0.01, W*0.02, W*0.016, 0.4, 0,7); }, toneSolid(inkLevel(LADLE-1)), 3);
    // swirl arcs radiating from the dip point
    g.strokeStyle=inkLevel(WINE_G); g.lineWidth=2.5; g.lineCap="round";
    for(let i=1;i<=3;i++){
      const rr=surf.half*0.22*i;
      g.beginPath(); g.ellipse(dipX, surf.y, rr, rr*params.rimFlat, 0, -0.4+t, Math.PI*1.1+t); g.stroke();
    }
  }

  // ---- SERVE: a ladle lifted to the side pours a thread into a cup ----
  if (serve>0.02){
    const lx=cx+W*0.30, ly=H*0.32;                  // raised ladle bowl
    const handleTopX=cx+W*0.10, handleTopY=H*0.42;
    // ladle handle from over the rim out to the raised bowl
    pen.limb(()=>{ g.moveTo(handleTopX, handleTopY); g.lineTo(lx, ly); }, toneSolid(inkLevel(LADLE)), W*0.013);
    // ladle bowl (a small dipper, tipped to pour)
    pen.paint(()=>{ g.arc(lx, ly, W*0.038, 0.15*Math.PI, 0.95*Math.PI); g.closePath(); }, toneSolid(inkLevel(LADLE-1)), 4);
    // wine thread from the ladle lip into the cup
    const cupX=cx+W*0.34, cupTop=H*0.56;
    g.save();
    pen.paint(()=>{
      const sx=lx+W*0.03, sy=ly+W*0.02, wpx=W*0.008;
      g.moveTo(sx-wpx, sy);
      g.quadraticCurveTo(cupX-wpx, (sy+cupTop)/2, cupX-wpx, cupTop);
      g.lineTo(cupX+wpx, cupTop);
      g.quadraticCurveTo(cupX+wpx, (sy+cupTop)/2, sx+wpx, sy);
      g.closePath();
    }, toneSolid(inkLevel(WINE)), 3);
    g.restore();
    // the cup (a small stemmed kylix) receiving
    pen.paint(()=>{ g.ellipse(cupX, cupTop, W*0.05, W*0.05*0.4, 0,0,Math.PI); g.closePath(); }, toneSolid(inkLevel(CUP)), 4);
    pen.paint(()=>{ g.moveTo(cupX-W*0.05,cupTop); g.quadraticCurveTo(cupX,cupTop+H*0.05,cupX+W*0.05,cupTop); g.closePath(); }, toneSolid(inkLevel(CUP)), 4);
    pen.paint(()=>{ g.rect(cupX-W*0.008, cupTop+H*0.03, W*0.016, H*0.02); }, toneSolid(inkLevel(CUP+1)), 3); // stem
  }

  // ---- AFFECT-FIELD: soft calm radiating outward in concentric rings ----
  if (field>0.02){
    const fcx=cx, fcy=K.rimY - K.rimRh*0.4;
    g.save();
    // soft glow bloom behind the rings (very light)
    g.fillStyle=inkLevel(1);
    g.beginPath(); g.ellipse(fcx, fcy, W*0.44*field, H*0.26*field, 0,0,7); g.fill();
    // concentric radiating rings, phase animated so they read as expanding
    const rings=5;
    for(let i=0;i<rings;i++){
      const phase=((t*0.5+i/rings)%1);
      const rr = W*0.10 + phase*W*0.40;
      const a  = (1-phase)*0.9*field;
      g.strokeStyle=inkLevel(2+Math.round(a*2));
      g.lineWidth=Math.max(1.5, 3*(1-phase));
      g.beginPath(); g.ellipse(fcx, fcy, rr, rr*0.62, 0,0,7); g.stroke();
    }
    g.restore();
  }
}

export const asset = {
  id:"prop.helens-mixing-bowl",
  type:"PROP",
  name:"Helen's Mixing Bowl",
  statusWord:"MIXING",
  scene:"OD-B04-S03",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","handles","foot","stem","body","interior","wine","lip","frieze","pour","drug","stir","serve","field"],
  // normalized 0..1 anchors: grip / support / contact / pour targets
  anchors:{
    "rim:mouth":{x:.50,y:.335},          // centre of the mixing mouth
    "surface:wine":{x:.50,y:.44},        // wine surface centre (mid fill)
    "grip:handle-l":{x:.075,y:.44},      // left loop handle
    "grip:handle-r":{x:.925,y:.44},      // right loop handle
    "contact:foot":{x:.50,y:.72},        // foot on the ground
    "target:pour":{x:.50,y:.30},         // where a pour enters the mouth
    "serve:cup":{x:.84,y:.56},           // the receiving cup when serving
    "field:origin":{x:.50,y:.31},        // source of the calm field
  },
  // collision box (AABB in 0..1) for placement / pathing
  zones:{ bounds:{ x0:.06,y0:.30,x1:.94,y1:.74 }, footprint:{ x0:.35,y0:.68,x1:.65,y1:.74 } },
  states:{
    initial:"pour",
    nodes:{
      pour:     { preview:{ fill:0.35, pour:1, drug:0, stir:0, serve:0, field:0,   status:"POURING",  progress:.20 } },
      "drug-add":{ preview:{ fill:0.6,  pour:0, drug:1, stir:0, serve:0, field:0,   status:"DRUGGED",  progress:.40 } },
      stir:     { preview:{ fill:0.6,  pour:0, drug:0, stir:1, serve:0, field:0,   status:"STIRRING", progress:.60 } },
      serve:    { preview:{ fill:0.55, pour:0, drug:0, stir:0, serve:1, field:0,   status:"SERVING",  progress:.80 } },
      "affect-field":{ preview:{ fill:0.5, pour:0, drug:0, stir:0, serve:0, field:1, status:"CALM",   progress:.95 } },
    },
    edges:[["pour","drug-add"],["drug-add","stir"],["stir","serve"],["serve","affect-field"],
           ["affect-field","serve"],["serve","stir"],["stir","drug-add"],["drug-add","pour"]],
  },
  channels:["fill","pour","drug","stir","serve","field","t"],

  preview:()=>({ fill:0.6, pour:0, drug:0, stir:0, serve:0, field:0, t:0, status:"MIXING", progress:.5 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
