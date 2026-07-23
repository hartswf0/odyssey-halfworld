/* prop.laundry-bundles — sorted royal garments for the river-washing beat.
   PROP asset built from THREE cloth templates — a FOLDED STACK of pressed
   garments, a TIED BUNDLE cinched in a cross of cord, and a SPREAD CLOTH laid
   flat to dry — each a local-frame body scaled + placed into a layout. Drawn
   in SOLID grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. Do NOT pre-dither.
   Scene function (OD-B06-S01): Nausicaa's wash-day laundry across six states —
   DIRTY  (a soiled crumpled heap, unsorted),
   WASHED (a wet tied bundle, wrung and gathered, dripping),
   SPREAD (cloths laid flat over the ground/rocks, damp),
   DRIED  (the same cloths spread but light + sun-bleached),
   FOLDED (neat pressed stacks + a tied bundle, sorted royal linen),
   CART-LOADED (folded stacks packed onto the mule cart bed).
   Each template exposes tone/wet/fold knobs so the same body draws every
   member. Contact / grip / load anchors in 0..1; ownership + collision box. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  stacks:2,          // folded stacks in the sorted layout
  foldsPerStack:5,   // pressed garments per stack
  royalBorder:true,  // dark embroidered hem stripe on each cloth (royal linen)
  cordCross:true,    // cross of cinch cord on the tied bundle
  cart:true,         // mule-cart bed for the cart-loaded state
};

/* ink levels (1 near-paper .. 7 full ink) */
const LINEN   = 3;   // clean cloth body (light)
const LINEN2  = 4;   // shaded flank / lower fold (depth)
const SOILED  = 5;   // dirty / wet cloth (darker)
const HEM     = 6;   // embroidered royal border stripe
const CORD    = 6;   // cinch cord
const WOOD    = 5;   // cart timber
const WHEEL   = 6;   // cart wheel rim

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
   FOLDED STACK — a neat pile of pressed garments, base centre (cx,baseY),
   width w, fold height hf, n folds. Each fold is a rounded slab with a folded
   edge crease on the left and a royal hem stripe along its front-lower edge.
   ------------------------------------------------------------------ */
function drawFoldedStack(pen,g,cx,baseY,w,hf,n,tone=LINEN){
  for(let i=0;i<n;i++){
    const y = baseY - hf*(i+1);
    // gentle deterministic taper + jitter so the pile reads as hand-stacked
    const jit = (((i*37)%7)-3)/3 * w*0.02;
    const ww  = w*(1 - i*0.02);
    const x   = cx - ww/2 + jit;
    const slabTone = (i%2===0)? tone : tone+1;
    // slab body (light linen dominates the fold)
    pen.paint(()=>{ rr(g, x, y, ww, hf, hf*0.24); }, toneSolid(inkLevel(slabTone)), 4.5);
    // folded-edge crease (the doubled cloth spine, left side)
    pen.seam(()=>{ g.moveTo(x+ww*0.10, y+hf*0.22); g.lineTo(x+ww*0.10, y+hf*0.82); }, 2.4);
    // thin shaded underside for stacked depth (subtle, not a heavy band)
    pen.paint(()=>{ rr(g, x, y+hf*0.80, ww, hf*0.20, hf*0.12); }, toneSolid(inkLevel(slabTone+1)), 0);
    // royal embroidered hem — a thin accent stripe along the front lip
    if (params.royalBorder){
      pen.paint(()=>{ rr(g, x+ww*0.06, y+hf*0.62, ww*0.88, hf*0.10, hf*0.04); },
        toneSolid(inkLevel(HEM)), 0);
    }
  }
  return { top:{ x:cx, y:baseY-hf*n } };
}

/* ------------------------------------------------------------------
   TIED BUNDLE — a gathered lump of cloth cinched in a cross of cord, with a
   knotted top gather. base centre (cx,baseY), width w, height h. wet adds drip
   marks + a darker body.
   ------------------------------------------------------------------ */
function drawTiedBundle(pen,g,cx,baseY,w,h,{tone=LINEN, wet=false, t=0}={}){
  const bw=w*0.5, bh=h*0.5;
  const body = wet ? SOILED : tone;
  // rounded lumpy body
  pen.paint(()=>{
    g.moveTo(cx-bw, baseY-bh*0.15);
    g.quadraticCurveTo(cx-bw*1.12, baseY-bh*1.05, cx-bw*0.35, baseY-bh*1.28);
    g.quadraticCurveTo(cx, baseY-bh*1.42, cx+bw*0.35, baseY-bh*1.28);
    g.quadraticCurveTo(cx+bw*1.12, baseY-bh*1.05, cx+bw, baseY-bh*0.15);
    g.quadraticCurveTo(cx+bw*0.9, baseY+bh*0.12, cx, baseY+bh*0.06);
    g.quadraticCurveTo(cx-bw*0.9, baseY+bh*0.12, cx-bw, baseY-bh*0.15);
    g.closePath();
  }, toneSolid(inkLevel(body)), 5);
  // shaded near-flank
  pen.paint(()=>{
    g.moveTo(cx+bw*0.20, baseY-bh*1.15);
    g.quadraticCurveTo(cx+bw*1.05, baseY-bh*0.9, cx+bw*0.92, baseY-bh*0.15);
    g.quadraticCurveTo(cx+bw*0.85, baseY+bh*0.08, cx+bw*0.30, baseY);
    g.quadraticCurveTo(cx+bw*0.55, baseY-bh*0.6, cx+bw*0.20, baseY-bh*1.15);
    g.closePath();
  }, toneSolid(inkLevel(body+1)), 0);
  // gather folds radiating from the knot
  for(let i=-2;i<=2;i++){
    pen.seam(()=>{ g.moveTo(cx+i*bw*0.16, baseY-bh*1.18);
      g.lineTo(cx+i*bw*0.42, baseY-bh*0.2); }, 2.2);
  }
  // cross of cinch cord
  if (params.cordCross){
    pen.paint(()=>{ rr(g, cx-bw*1.02, baseY-bh*0.70, bw*2.04, h*0.075, h*0.03); },
      toneSolid(inkLevel(CORD)), 3);                       // horizontal band
    pen.paint(()=>{ rr(g, cx-bw*0.14, baseY-bh*1.30, bw*0.28, bh*1.42, bw*0.10); },
      toneSolid(inkLevel(CORD)), 3);                       // vertical band
    // knot at the top gather
    pen.paint(()=>{ g.ellipse(cx, baseY-bh*1.30, w*0.09, w*0.075, 0,0,7); },
      toneSolid(inkLevel(CORD)), 3);
    pen.ink(()=>{ g.moveTo(cx, baseY-bh*1.34); g.lineTo(cx-w*0.10, baseY-bh*1.55);
                  g.moveTo(cx, baseY-bh*1.34); g.lineTo(cx+w*0.09, baseY-bh*1.52); }, 2.4); // tails
  }
  // wet drip marks
  if (wet){
    g.fillStyle=inkLevel(SOILED+1);
    for(let i=0;i<5;i++){
      const dx = cx + (i-2)*bw*0.36 + Math.sin(i*1.3)*4;
      const dy = baseY + bh*0.10 + ((t*40+i*30)%(bh*0.5));
      g.beginPath(); g.ellipse(dx, dy, 2.4, 4.2, 0,0,7); g.fill();
    }
  }
  return { top:{ x:cx, y:baseY-bh*1.4 }, cinch:{ x:cx, y:baseY-bh*0.66 } };
}

/* ------------------------------------------------------------------
   SPREAD CLOTH — a garment laid flat over the ground/rocks to dry, drawn as a
   cloth quad in shallow perspective with wrinkle seams + a royal border inset.
   centre (cx,cy), width w, depth h. skew leans the near edge.
   ------------------------------------------------------------------ */
function drawSpreadCloth(pen,g,cx,cy,w,h,{tone=LINEN, skew=0.12, sun=false}={}){
  const tw=w*0.42, bw=w*0.5;   // top edge narrower (further), bottom wider (near)
  const ty=cy-h*0.5, by=cy+h*0.5;
  const sx=w*skew;
  // cloth body (draped quad, wavy near edge)
  pen.paint(()=>{
    g.moveTo(cx-tw-sx*0.4, ty);
    g.lineTo(cx+tw-sx*0.4, ty);
    g.lineTo(cx+bw, by-h*0.05);
    g.quadraticCurveTo(cx, by+h*0.06, cx-bw, by-h*0.05);
    g.closePath();
  }, toneSolid(inkLevel(tone)), 4.5);
  // royal border inset stripe
  if (params.royalBorder){
    const iy0=ty+h*0.10, iy1=by-h*0.14;
    pen.seam(()=>{
      g.moveTo(cx-tw*0.8-sx*0.4, iy0); g.lineTo(cx+tw*0.8-sx*0.4, iy0);
      g.lineTo(cx+bw*0.8, iy1); g.lineTo(cx-bw*0.8, iy1); g.closePath();
    }, 3.2);
  }
  // wrinkle seams across the cloth (soft horizontal folds)
  for(let i=1;i<=3;i++){
    const yy = lerp(ty, by, i/4);
    const hw = lerp(tw, bw, i/4)*0.86;
    pen.seam(()=>{ g.moveTo(cx-hw-sx*0.3, yy); g.quadraticCurveTo(cx, yy+h*0.03, cx+hw, yy); }, 2.2);
  }
  // sun-bleach highlight patch when dried
  if (sun){
    g.fillStyle=inkLevel(1);
    g.beginPath(); g.ellipse(cx-w*0.06, cy-h*0.02, w*0.18, h*0.16, 0,0,7); g.fill();
  }
  return { centre:{ x:cx, y:cy } };
}

/* ------------------------------------------------------------------
   CRUMPLED HEAP — the dirty, unsorted mound: overlapping irregular cloth blobs
   with wrinkle scribbles, darker soiled tone. base centre (cx,baseY).
   ------------------------------------------------------------------ */
function drawHeap(pen,g,cx,baseY,w,h){
  const blobs = [
    { x:-0.22, y:0.00, rx:0.30, ry:0.22, tone:SOILED   },
    { x: 0.24, y:0.02, rx:0.28, ry:0.20, tone:SOILED   },
    { x: 0.02, y:-0.02,rx:0.34, ry:0.24, tone:SOILED   },
    { x:-0.08, y:-0.26,rx:0.26, ry:0.20, tone:SOILED-1 },
    { x: 0.16, y:-0.30,rx:0.20, ry:0.17, tone:SOILED-1 },
    { x:-0.02, y:-0.48,rx:0.18, ry:0.15, tone:SOILED-1 },
  ];
  for(const b of blobs){
    const bx=cx+b.x*w, by=baseY+b.y*h, rx=b.rx*w, ry=b.ry*h;
    pen.paint(()=>{
      g.moveTo(bx-rx, by);
      g.quadraticCurveTo(bx-rx*0.9, by-ry*1.4, bx-rx*0.1, by-ry);
      g.quadraticCurveTo(bx+rx*0.5, by-ry*1.5, bx+rx, by-ry*0.4);
      g.quadraticCurveTo(bx+rx*1.05, by+ry*0.5, bx+rx*0.3, by+ry*0.4);
      g.quadraticCurveTo(bx-rx*0.6, by+ry*0.55, bx-rx, by);
      g.closePath();
    }, toneSolid(inkLevel(b.tone)), 4.5);
    // wrinkle scribbles
    for(let i=-1;i<=1;i++){
      pen.seam(()=>{ g.moveTo(bx+i*rx*0.4, by-ry*0.5);
        g.quadraticCurveTo(bx+i*rx*0.4+rx*0.15, by, bx+i*rx*0.4-rx*0.1, by+ry*0.3); }, 2.0);
    }
  }
}

/* ------------------------------------------------------------------
   MULE CART — a plank bed on two wheels; folded stacks ride the bed.
   ------------------------------------------------------------------ */
function drawCart(pen,g,W,H){
  const bedY=H*0.66, bedX0=W*0.16, bedX1=W*0.86, bedH=H*0.05;
  // bed
  pen.paint(()=>{ rr(g, bedX0, bedY, bedX1-bedX0, bedH, bedH*0.3); }, toneSolid(inkLevel(WOOD)), 5);
  // plank seams
  for(let i=1;i<5;i++){ const x=lerp(bedX0,bedX1,i/5);
    pen.seam(()=>{ g.moveTo(x, bedY+bedH*0.15); g.lineTo(x, bedY+bedH*0.85); }, 2.2); }
  // side rail
  pen.ink(()=>{ g.moveTo(bedX0, bedY); g.lineTo(bedX1, bedY); }, 3);
  // two wheels
  const wy=bedY+bedH+H*0.075, wr=H*0.075;
  for(const wx of [W*0.30, W*0.72]){
    pen.paint(()=>{ g.arc(wx, wy, wr, 0, 7); }, toneSolid(inkLevel(WOOD)), 5);
    pen.paint(()=>{ g.arc(wx, wy, wr*0.30, 0, 7); }, toneSolid(inkLevel(WHEEL)), 4); // hub
    for(let s=0;s<6;s++){ const a=s/6*Math.PI*2;
      pen.ink(()=>{ g.moveTo(wx+Math.cos(a)*wr*0.3, wy+Math.sin(a)*wr*0.3);
        g.lineTo(wx+Math.cos(a)*wr*0.9, wy+Math.sin(a)*wr*0.9); }, 2.4); }        // spokes
  }
  return { bedY, bedX0, bedX1 };
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const layout = st.layout || "folded";
  const groundY = H*0.80;

  // ground shadow band (shared, faint) — skip for cart (has its own base)
  const shadow = (cx,rw)=>{ g.fillStyle="rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(cx, groundY+8, rw, H*0.02, 0,0,7); g.fill(); };

  if (layout==="heap"){
    shadow(W*0.5, W*0.30);
    drawHeap(pen,g, W*0.5, groundY, W*0.62, H*0.34);

  } else if (layout==="bundle"){
    shadow(W*0.5, W*0.24);
    drawTiedBundle(pen,g, W*0.5, groundY, W*0.46, H*0.42, { wet:!!st.wet, t });

  } else if (layout==="spread"){
    // three cloths laid across the ground at receding depths
    const wet = st.wet, sun = !!st.sun;
    const tone = wet ? SOILED : LINEN;
    const cloths = [
      { cx:.30, cy:.58, w:.40, h:.20, tone:tone+1 },
      { cx:.68, cy:.55, w:.36, h:.18, tone:tone+1 },
      { cx:.50, cy:.74, w:.52, h:.24, tone:tone   },  // near, largest
    ];
    for(const c of cloths){
      shadow(W*c.cx, W*c.w*0.42);
      drawSpreadCloth(pen,g, W*c.cx, H*c.cy, W*c.w, H*c.h, { tone:c.tone, sun });
    }

  } else if (layout==="cart"){
    const bed = drawCart(pen,g, W, H);
    // folded stacks loaded on the bed
    drawFoldedStack(pen,g, W*0.36, bed.bedY, W*0.30, H*0.042, 4, LINEN);
    drawFoldedStack(pen,g, W*0.64, bed.bedY, W*0.26, H*0.042, 3, LINEN);
    // a tied bundle wedged between
    drawTiedBundle(pen,g, W*0.50, bed.bedY, W*0.24, H*0.20, {});

  } else { // folded — sorted royal linen: two pressed stacks + a tied bundle
    shadow(W*0.30, W*0.22);
    shadow(W*0.55, W*0.17);
    shadow(W*0.79, W*0.15);
    drawFoldedStack(pen,g, W*0.30, groundY, W*0.36, H*0.058, params.foldsPerStack, LINEN);
    drawFoldedStack(pen,g, W*0.56, groundY, W*0.28, H*0.056, params.foldsPerStack-1, LINEN);
    drawTiedBundle(pen,g, W*0.80, groundY, W*0.32, H*0.34, {});
  }
}

export const asset = {
  id:"prop.laundry-bundles",
  type:"PROP",
  name:"Laundry Bundles",
  statusWord:"SORTED",
  scene:"OD-B06-S01",

  params,
  // back -> front draw order the prop honors
  layers:["cart","shadow","cloth-body","cloth-flank","fold-crease","wrinkle","hem","cord","drip"],
  // normalized 0..1 anchors: grip / contact / load points
  anchors:{
    "grip:bundle":{x:.80,y:.63},        // where a hand takes the tied bundle cinch
    "top:stack":{x:.30,y:.55},          // top of the tall folded stack (add/remove garment)
    "contact:ground":{x:.50,y:.80},     // grounded set contact
    "spread:centre":{x:.50,y:.74},      // centre of the near spread cloth
    "load:cart":{x:.50,y:.66},          // bed contact when cart-loaded
    "wash:point":{x:.50,y:.80},         // river-edge wash contact
  },
  // ownership + collision box (AABB in 0..1) for placement / pathing
  owner:"nausicaa:royal-linen",
  zones:{ bounds:{ x0:.10,y0:.40,x1:.92,y1:.92 }, footprint:{ x0:.16,y0:.74,x1:.90,y1:.86 } },
  states:{
    initial:"dirty",
    nodes:{
      dirty:        { preview:{ layout:"heap",              status:"DIRTY",   progress:.10 } },
      washed:       { preview:{ layout:"bundle", wet:true,  status:"WASHED",  progress:.30 } },
      spread:       { preview:{ layout:"spread", wet:true,  status:"SPREAD",  progress:.50 } },
      dried:        { preview:{ layout:"spread", sun:true,  status:"DRIED",   progress:.70 } },
      folded:       { preview:{ layout:"folded",            status:"FOLDED",  progress:.88 } },
      "cart-loaded":{ preview:{ layout:"cart",              status:"LOADED",  progress:1.0 } },
    },
    edges:[
      ["dirty","washed"],["washed","spread"],["spread","dried"],
      ["dried","folded"],["folded","cart-loaded"],["cart-loaded","folded"],
    ],
  },
  channels:["layout","wet","sun","t"],

  preview:()=>({ layout:"folded", t:0, status:"SORTED", progress:.88 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones, owner:asset.owner }; },
};
export default asset;
