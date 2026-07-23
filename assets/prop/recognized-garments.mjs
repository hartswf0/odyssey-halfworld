/* prop.recognized-garments — the fine palace-woven clothing Odysseus wears into
   Alcinous's hall: a laundered ROBE (chiton) + a heavier CLOAK (chlamys), the
   very set washed at the river and given by Nausicaa — carrying a small
   embroidered MAKER'S MARK / MONOGRAM in one corner that Queen Arete recognizes
   as her own household's weaving. The mark is the load-bearing detail: it holds
   household-ownership metadata and threads narrative continuity from river to
   palace.
   PROP asset. An isolated reusable object drawn in SOLID grays + hard contour
   into the offscreen ctx; the engine dotify pass supplies the halftone. Do NOT
   pre-dither.

   States (from the atlas): the garments as WORN on an implied body / HELD out as
   a neat folded set / EXAMINED — a magnified read of the maker's mark, the woven
   monogram glinting as it is recognized.
     · HELD    — a folded pile: broad folded cloak under a folded robe, the
                 maker's-mark patch set proud on the crown corner.
     · WORN    — belted robe column + cloak mantle on an implied body (no figure
                 rig), the mark carried at the hem corner.
     · EXAMINED— a close read: the maker's mark blown up centre-stage, radiating
                 glint marks + metadata ticks (household ownership being read),
                 a fragment of cloth behind it for context.
   Contact / grip / mark anchors in 0..1; ownership + collision box. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  cloakFolds:3,      // slabs in the folded cloak (broad, heavy)
  robeFolds:4,       // slabs in the folded robe (narrower, fine + light)
  belt:true,         // the woven girdle
  weaveN:4,          // warp/weft lines drawn inside the maker's mark
  glintRays:8,       // radiating glint marks on the examined mark
};

/* ink levels (1 near-paper .. 7 full ink) — palace weaving reads FINE + light */
const ROBE  = 2;   // robe body — fine bleached wool (very bright)
const ROBE2 = 3;   // robe shade / lower fold
const CLK   = 5;   // cloak body — heavier dyed wool (darker)
const CLK2  = 6;   // cloak shade / fold trough
const BELT  = 4;   // woven girdle
const MARKB = 7;   // maker's-mark border / emblem (hard, dark thread)
const MARKF = 2;   // maker's-mark field (bright ground the emblem sits on)
const WEAVE = 5;   // cross-weave lines inside the mark

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
   MAKER'S MARK — the embroidered monogram patch. A bright bordered square,
   a cross-weave grid (the woven ground), and a household emblem (a diamond
   loom-glyph with a vertical warp bar). `glint` draws a sparkle on it. This
   is the recognition detail — the same emblem in every state.
   centre (cx,cy), half-size s.
   ------------------------------------------------------------------ */
function makerMark(pen,g,cx,cy,s,{glint=false}={}){
  // bright field patch with a hard dark border (the stitched selvedge)
  pen.paint(()=>{ rr(g, cx-s, cy-s, s*2, s*2, s*0.22); }, toneSolid(inkLevel(MARKF)), 3.0);
  pen.seam(()=>{ rr(g, cx-s*0.80, cy-s*0.80, s*1.60, s*1.60, s*0.16); }, 2.2); // inner rule
  // cross-weave grid (warp + weft) reads as woven cloth
  const n=params.weaveN;
  for(let i=1;i<n;i++){
    const u=i/n, x=lerp(cx-s*0.80,cx+s*0.80,u), y=lerp(cy-s*0.80,cy+s*0.80,u);
    pen.seam(()=>{ g.moveTo(x, cy-s*0.80); g.lineTo(x, cy+s*0.80); }, 1.2);
    pen.seam(()=>{ g.moveTo(cx-s*0.80, y); g.lineTo(cx+s*0.80, y); }, 1.2);
  }
  // household emblem: a filled diamond with a vertical warp bar (a loom-glyph)
  pen.paint(()=>{
    g.moveTo(cx, cy-s*0.62); g.lineTo(cx+s*0.52, cy);
    g.lineTo(cx, cy+s*0.62); g.lineTo(cx-s*0.52, cy); g.closePath();
  }, toneSolid(inkLevel(MARKB)), 2.4);
  pen.fillPath(()=>{ // bright warp slit down the emblem
    g.rect(cx-s*0.07, cy-s*0.42, s*0.14, s*0.84);
  }, inkLevel(MARKF));
  pen.fillPath(()=>{ g.rect(cx-s*0.30, cy-s*0.06, s*0.60, s*0.12); }, inkLevel(MARKF)); // cross weft
  // glint — a bright four-point spark on the upper-left of the mark
  if (glint){
    const gx=cx-s*0.34, gy=cy-s*0.34;
    pen.fillPath(()=>{ g.ellipse(gx,gy,s*0.16,s*0.16,0,0,7); }, inkLevel(1));
    pen.ink(()=>{ g.moveTo(gx-s*0.30,gy); g.lineTo(gx+s*0.30,gy);
                  g.moveTo(gx,gy-s*0.30); g.lineTo(gx,gy+s*0.30); }, 1.4);
  }
}

/* ------------------------------------------------------------------
   FOLD SLAB STACK — a neat pile of pressed cloth, base centre (cx,baseY),
   width w, per-fold height hf, n folds. Alternating tone steps + a doubled
   folded-edge crease down one side read the pile as hand-stacked linen.
   ------------------------------------------------------------------ */
function slabStack(pen,g,cx,baseY,w,hf,n,tone){
  for(let i=0;i<n;i++){
    const y  = baseY - hf*(i+1);
    const jit= (((i*37)%7)-3)/3 * w*0.02;
    const ww = w*(1 - i*0.03);
    const x  = cx - ww/2 + jit;
    const st = tone + (i%2);
    pen.paint(()=>{ rr(g, x, y, ww, hf, hf*0.30); }, toneSolid(inkLevel(st)), 4.5);        // slab body
    pen.paint(()=>{ rr(g, x, y+hf*0.64, ww, hf*0.36, hf*0.20); }, toneSolid(inkLevel(st+1)), 0); // underside sliver
    pen.seam(()=>{ g.moveTo(x+ww*0.12, y+hf*0.20); g.lineTo(x+ww*0.12, y+hf*0.82); }, 2.4);  // folded-edge crease
  }
  return { topY: baseY - hf*n, cx };
}

/* ------------------------------------------------------------------
   HELD — the given set: a broad folded cloak, a folded robe on top, a coiled
   belt at left and the maker's-mark patch set proud on the crown corner.
   ------------------------------------------------------------------ */
function drawHeld(pen,g,W,H,{glint=false}={}){
  const cx=W*0.5, baseY=H*0.70;
  // ground shadow
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, baseY+10, W*0.30, H*0.022, 0,0,7); g.fill();

  // folded cloak (broad, heavy) — base of the pile
  const cloak = slabStack(pen,g, cx, baseY, W*0.56, H*0.052, params.cloakFolds, CLK-1);
  // folded robe (narrower, fine + light) — sits on the cloak
  const robe  = slabStack(pen,g, cx, cloak.topY, W*0.42, H*0.044, params.robeFolds, ROBE);

  // coiled woven belt resting on the crown, left
  if (params.belt){
    const bx=cx-W*0.14, by=robe.topY-H*0.004;
    pen.paint(()=>{ g.ellipse(bx,by,W*0.082,H*0.026,0,0,7); }, toneSolid(inkLevel(BELT)), 3.5);
    pen.paint(()=>{ g.ellipse(bx,by,W*0.044,H*0.013,0,0,7); }, toneSolid(inkLevel(1)), 3); // coil hole
  }
  // maker's-mark patch set proud on the crown, right — the recognition detail
  makerMark(pen,g, cx+W*0.13, robe.topY+H*0.030, W*0.052, {glint});
}

/* ------------------------------------------------------------------
   WORN — the set as worn on an implied body (no figure rig): a belted robe
   column + a cloak mantle over the shoulders. The maker's mark rides the
   lower-front corner of the robe hem, where a queen's eye would catch it.
   ------------------------------------------------------------------ */
function drawWorn(pen,g,W,H,{glint=false}={}){
  const cx=W*0.5;
  const shY=H*0.22, shH=W*0.25;               // shoulder line + half-width
  const waY=H*0.48, waH=W*0.155;              // waist (belted)
  const hemY=H*0.74, hemH=W*0.28;             // flared hem
  const wave = (u)=> Math.sin(u*Math.PI*3)*H*0.018;

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, hemY+H*0.02, hemH*1.15, H*0.02, 0,0,7); g.fill();

  // ---- CLOAK mantle behind the robe (broad cape spreading to a low hem) ----
  const clHemY=H*0.80, clHemH=W*0.36;
  pen.paint(()=>{
    g.moveTo(cx-shH*1.02, shY+H*0.01);
    g.lineTo(cx+shH*1.02, shY+H*0.01);
    g.lineTo(cx+clHemH, clHemY-H*0.02);
    for(let i=1;i<=6;i++){ const u=i/6; const x=lerp(cx+clHemH,cx-clHemH,u);
      const y=clHemY+wave(u); g.lineTo(x,y); }
    g.closePath();
  }, toneSolid(inkLevel(CLK)), 4.5);
  for(let f=-1;f<=1;f+=2){
    pen.seam(()=>{ g.moveTo(cx+f*shH*0.7, shY+H*0.05);
      g.quadraticCurveTo(cx+f*clHemH*0.7, lerp(shY,clHemY,0.5), cx+f*clHemH*0.85, clHemY-H*0.02); }, 2.4);
  }

  // ---- ROBE body (chiton) over the cloak ----
  pen.paint(()=>{
    g.moveTo(cx-shH, shY);
    g.quadraticCurveTo(cx-waH*1.15, waY, cx-hemH, hemY-H*0.02);
    for(let i=1;i<=5;i++){ const u=i/5; const x=lerp(cx-hemH,cx+hemH,u);
      const y=hemY+wave(u); g.lineTo(x,y); }
    g.quadraticCurveTo(cx+waH*1.15, waY, cx+shH, shY);
    g.lineTo(cx+shH*0.34, shY+H*0.005);
    g.quadraticCurveTo(cx, shY+H*0.055, cx-shH*0.34, shY+H*0.005);
    g.closePath();
  }, toneSolid(inkLevel(ROBE)), 5);

  // cap sleeves at the shoulders
  for(const s of [-1,1]){
    pen.paint(()=>{ g.ellipse(cx+s*shH*0.92, shY+H*0.03, W*0.055, H*0.045, s*0.3,0,7); },
      toneSolid(inkLevel(ROBE2)), 4);
  }

  // vertical robe drape folds
  const nF=5;
  for(let f=1;f<=nF;f++){
    const u=f/(nF+1);
    const xT=lerp(cx-shH*0.8, cx+shH*0.8, u);
    const xH=lerp(cx-hemH*0.85, cx+hemH*0.85, u);
    pen.seam(()=>{ g.moveTo(xT, shY+H*0.07);
      g.quadraticCurveTo(lerp(xT,xH,0.5), waY, xH, hemY-H*0.01); }, f%2?2.6:1.5);
  }

  // ---- woven BELT / girdle at the waist ----
  if (params.belt){
    pen.paint(()=>{ rr(g, cx-waH*1.02, waY-H*0.012, waH*2.04, H*0.028, H*0.012); },
      toneSolid(inkLevel(BELT)), 3.5);
    pen.paint(()=>{ g.ellipse(cx, waY+H*0.002, W*0.022, H*0.016, 0,0,7); }, toneSolid(inkLevel(MARKB-1)), 2.6); // clasp
  }

  // ---- CLOAK front flap over the right shoulder, crossing to the left hip ----
  pen.paint(()=>{
    g.moveTo(cx+shH*0.98, shY+H*0.02);
    g.quadraticCurveTo(cx+shH*0.4, waY*0.9, cx-waH*0.9, waY+H*0.06);
    g.lineTo(cx-waH*0.5, waY+H*0.11);
    g.quadraticCurveTo(cx+shH*0.55, waY*0.95, cx+shH*1.10, shY+H*0.09);
    g.closePath();
  }, toneSolid(inkLevel(CLK)), 4.5);
  for(let i=0;i<3;i++){
    pen.seam(()=>{ g.moveTo(cx+shH*0.85-i*W*0.05, shY+H*0.05+i*H*0.006);
      g.quadraticCurveTo(cx+shH*0.2, waY*0.92, cx-waH*0.7+i*W*0.04, waY+H*0.06); }, 1.6);
  }

  // ---- MAKER'S MARK at the lower-front robe corner (the recognition detail) ----
  makerMark(pen,g, cx+hemH*0.62, hemY-H*0.03, W*0.045, {glint});
}

/* ------------------------------------------------------------------
   EXAMINED — a close read of the maker's mark: the monogram blown up centre-
   stage over a fragment of the cloth, glinting, ringed by a callout with
   radiating glint marks + metadata ticks (household ownership being read).
   ------------------------------------------------------------------ */
function drawExamined(pen,g,W,H,{t=0}={}){
  const cx=W*0.5, cy=H*0.50;
  // cloth fragment behind (a torn corner of the robe, fine + light)
  pen.paint(()=>{
    g.moveTo(W*0.20, H*0.24);
    g.lineTo(W*0.80, H*0.24);
    g.lineTo(W*0.80, H*0.70);
    for(let i=1;i<=6;i++){ const u=i/6; const x=lerp(W*0.80,W*0.20,u);
      const y=H*0.70+Math.sin(u*Math.PI*3)*H*0.02; g.lineTo(x,y); }
    g.closePath();
  }, toneSolid(inkLevel(ROBE)), 4.5);
  // a couple of cloth folds for texture
  for(let f=1;f<=3;f++){ const x=lerp(W*0.28,W*0.72,f/4);
    pen.seam(()=>{ g.moveTo(x, H*0.26); g.lineTo(x+H*0.01, H*0.68); }, f%2?2.2:1.4); }

  // radiating glint marks + metadata ticks around the mark (recognition read)
  const R=W*0.30, r0=W*0.20;
  for(let i=0;i<params.glintRays;i++){
    const a=(i/params.glintRays)*Math.PI*2 + t*0.2;
    const x0=cx+Math.cos(a)*r0, y0=cy+Math.sin(a)*r0;
    const x1=cx+Math.cos(a)*R,  y1=cy+Math.sin(a)*R;
    pen.ink(()=>{ g.moveTo(x0,y0); g.lineTo(x1,y1); }, i%2?2.2:1.2);
    // metadata tick block at each ray end (ownership fields being read)
    pen.fillPath(()=>{ g.rect(x1-4, y1-2, 10, 4); }, inkLevel(6));
  }
  // callout ring around the mark
  pen.ink(()=>{ g.ellipse(cx,cy,r0,r0,0,0,7); }, 2.2);

  // the maker's mark, blown up + glinting
  makerMark(pen,g, cx, cy, W*0.135, {glint:true});
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const mode  = st.mode || "held";
  const t     = st.t ?? 0;
  const glint = !!st.glint;

  if (mode==="worn")          drawWorn(pen,g,W,H,{glint});
  else if (mode==="examined") drawExamined(pen,g,W,H,{t});
  else                        drawHeld(pen,g,W,H,{glint});   // held (default)
}

export const asset = {
  id:"prop.recognized-garments",
  type:"PROP",
  name:"Recognized Garments",
  statusWord:"RECOGNIZED",
  scene:"OD-B07-S04",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","cloak-back","robe","sleeve","fold","belt","cloak-flap","cloth-frag","glint-rays","maker-mark","spark"],
  // normalized 0..1 grip / contact / mark anchors
  anchors:{
    "fold:top":{x:.50,y:.55},           // crown of the folded pile (set / take)
    "mark:maker":{x:.64,y:.30},         // the embroidered maker's-mark patch
    "attach:shoulders":{x:.50,y:.22},   // where the set sits on a wearer
    "belt:waist":{x:.50,y:.48},         // girdle line
    "hem":{x:.50,y:.74},                // robe hem edge
    "contact:ground":{x:.50,y:.80},     // grounded contact
    "lens:examine":{x:.50,y:.50},       // focus point when examined
  },
  // ownership + collision box (AABB in 0..1) — woven by Queen Arete's household,
  // washed at the river by Nausicaa, worn into the palace: continuity metadata
  ownership:"phaeacians:arete",
  collision:{ kind:"box", x0:.14, y0:.18, x1:.86, y1:.86 },
  zones:{ bounds:{ x0:.14,y0:.18,x1:.86,y1:.86 }, footprint:{ x0:.22,y0:.72,x1:.78,y1:.84 } },

  states:{
    initial:"held",
    nodes:{
      held:    { preview:{ mode:"held",                status:"HELD",       progress:.25 } },
      worn:    { preview:{ mode:"worn",                status:"WORN",       progress:.55 } },
      examined:{ preview:{ mode:"examined", glint:true,status:"EXAMINED",   progress:.80 } },
      recognized:{ preview:{ mode:"worn", glint:true,  status:"RECOGNIZED", progress:1.0 } },
    },
    edges:[
      ["held","worn"],["worn","examined"],["examined","recognized"],
      ["recognized","worn"],["worn","held"],
    ],
  },
  channels:["mode","glint","t"],

  preview:()=>({ mode:"held", glint:true, t:0, status:"RECOGNIZED", progress:.25 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision, ownership:asset.ownership }; },
};
export default asset;
