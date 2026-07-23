/* prop.phaeacian-tunic-and-cloak — the borrowed clothing Nausicaa's household
   lends the shipwrecked, salt-crusted Odysseus: a laundered wool CHITON (tunic)
   and a heavier CHLAMYS (cloak), given fresh from the wash and taken back after.
   PROP asset. An isolated reusable set of garments drawn in SOLID grays + hard
   contour into the offscreen ctx; the engine dotify pass supplies the halftone.
   Do NOT pre-dither.

   Built from THREE cloth constructions scaled + placed by state:
     · FOLDED STACK  — a neat pile: a broad folded cloak under a folded tunic,
                        a coiled belt and a bronze fibula (brooch) set on top.
     · HUNG / OFFERED — the cloak draped over a held rod (offered by an implied
                        hand) hanging in vertical drape folds, the folded tunic
                        resting below, brooch pinned near the shoulder.
     · WORN          — the garments as worn on an implied body (no figure rig):
                        a belted tunic column with cap sleeves + a cloak mantle
                        over the shoulders pinned at the right with the fibula.
   Scene function (OD-B06-S04): borrowed clothing across its telling states —
     FOLDED (given, neat) / OFFERED (held out) / WORN (dressed) /
     WET (sea-soaked, clinging + dripping) / RETURNED (folded back, continuity).
   Contact / grip / pin anchors in 0..1; ownership + collision box. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  cloakFolds:3,      // slabs in the folded cloak (broad, heavy)
  tunicFolds:4,      // slabs in the folded tunic (narrower, light)
  brooch:true,       // the bronze fibula that pins the cloak
  belt:true,         // the coiled leather girdle
  dropFolds:5,       // vertical drape seams on the hung cloak
};

/* ink levels (1 near-paper .. 7 full ink) */
const TUN   = 3;   // tunic body — laundered light wool (bright)
const TUN2  = 4;   // tunic shade / lower fold
const CLK   = 5;   // cloak body — heavier dyed wool (darker)
const CLK2  = 6;   // cloak shade / fold trough
const BELT  = 5;   // leather girdle
const BROO  = 6;   // bronze fibula disc
const PIN   = 7;   // pin / rivet accent
const ROD   = 5;   // the offered wooden rod
const WETADD = 2;  // darkening applied to a soaked garment

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
   FOLD SLAB STACK — a neat pile of pressed cloth, base centre (cx,baseY),
   width w, per-fold height hf, n folds. Alternating tone steps and a doubled
   folded-edge crease down one side read the pile as hand-stacked linen.
   ------------------------------------------------------------------ */
function slabStack(pen,g,cx,baseY,w,hf,n,tone){
  for(let i=0;i<n;i++){
    const y  = baseY - hf*(i+1);
    const jit= (((i*37)%7)-3)/3 * w*0.02;
    const ww = w*(1 - i*0.03);
    const x  = cx - ww/2 + jit;
    const st = tone + (i%2);
    // slab body
    pen.paint(()=>{ rr(g, x, y, ww, hf, hf*0.30); }, toneSolid(inkLevel(st)), 4.5);
    // shaded underside sliver (stacked depth)
    pen.paint(()=>{ rr(g, x, y+hf*0.64, ww, hf*0.36, hf*0.20); }, toneSolid(inkLevel(st+1)), 0);
    // doubled folded-edge crease down the left
    pen.seam(()=>{ g.moveTo(x+ww*0.12, y+hf*0.20); g.lineTo(x+ww*0.12, y+hf*0.82); }, 2.4);
  }
  return { topY: baseY - hf*n, cx };
}

/* ------------------------------------------------------------------
   BRONZE FIBULA (brooch) — the pin that fastens the cloak. A disc with a
   raised boss + a straight pin bar. centre (cx,cy), radius r.
   ------------------------------------------------------------------ */
function fibula(pen,g,cx,cy,r){
  pen.paint(()=>{ g.ellipse(cx,cy,r,r,0,0,7); }, toneSolid(inkLevel(BROO)), 3.5);   // disc
  pen.paint(()=>{ g.ellipse(cx,cy,r*0.46,r*0.46,0,0,7); }, toneSolid(inkLevel(PIN)), 2.4); // boss
  pen.fillPath(()=>{ g.ellipse(cx-r*0.16,cy-r*0.16,r*0.16,r*0.16,0,0,7); }, inkLevel(2));   // glint
  pen.ink(()=>{ g.moveTo(cx-r*1.3, cy+r*0.5); g.lineTo(cx+r*1.4, cy-r*0.2); }, 2.6);        // pin bar
}

/* ------------------------------------------------------------------
   FOLDED — the given set: a broad folded cloak, a folded tunic on top, a
   coiled belt and the fibula set on the crown. `wet` soaks the tones + drips.
   ------------------------------------------------------------------ */
function drawFolded(pen,g,W,H,{wet=false,t=0}={}){
  const cx=W*0.5, baseY=H*0.70;
  const dk = wet?WETADD:0;
  // ground shadow
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, baseY+10, W*0.30, H*0.022, 0,0,7); g.fill();

  // folded cloak (broad, heavy) — the base of the pile (a touch darker than the tunic)
  const cloak = slabStack(pen,g, cx, baseY, W*0.54, H*0.052, params.cloakFolds, TUN2+dk);
  // folded tunic (narrower, light) — sits on the cloak
  const tunic = slabStack(pen,g, cx, cloak.topY, W*0.40, H*0.044, params.tunicFolds, TUN+dk);

  // coiled leather belt resting on the crown, left
  if (params.belt){
    const bx=cx-W*0.13, by=tunic.topY-H*0.006;
    pen.paint(()=>{ g.ellipse(bx,by,W*0.085,H*0.028,0,0,7); }, toneSolid(inkLevel(BELT+dk)), 3.5);
    pen.paint(()=>{ g.ellipse(bx,by,W*0.045,H*0.014,0,0,7); }, toneSolid(inkLevel(1)), 3); // coil hole
  }
  // fibula set on the crown, right
  if (params.brooch) fibula(pen,g, cx+W*0.12, tunic.topY-H*0.004, W*0.045);

  // wet: drip marks off the front lip of the pile
  if (wet){
    g.fillStyle=inkLevel(CLK+1);
    for(let i=0;i<6;i++){
      const dx=cx+(i-2.5)*W*0.09;
      const dy=baseY+H*0.01 + ((t*40+i*33)%(H*0.05));
      g.beginPath(); g.ellipse(dx,dy,2.6,4.4,0,0,7); g.fill();
    }
  }
}

/* ------------------------------------------------------------------
   OFFERED — the cloak draped over a held wooden rod (offered by an implied
   hand at the right), hanging in vertical drape folds; the folded tunic rests
   below. Brooch pinned near the shoulder of the drape.
   ------------------------------------------------------------------ */
function drawOffered(pen,g,W,H,{t=0}={}){
  const rodY=H*0.24, rodX0=W*0.20, rodX1=W*0.80;
  // draped cloak: top edge just above the rod, hanging to lower third
  const topL=W*0.30, topR=W*0.70, hemY=H*0.62;
  const hemL=W*0.25, hemR=W*0.75;
  // fold-over lip above the rod
  pen.paint(()=>{
    g.moveTo(topL, rodY-H*0.03); g.lineTo(topR, rodY-H*0.03);
    g.lineTo(topR, rodY+H*0.01); g.lineTo(topL, rodY+H*0.01); g.closePath();
  }, toneSolid(inkLevel(CLK2)), 4);
  // main hanging drape (wavy hem)
  pen.paint(()=>{
    g.moveTo(topL, rodY);
    g.lineTo(topR, rodY);
    g.lineTo(hemR, hemY-H*0.02);
    for(let i=1;i<=6;i++){ const u=i/6; const x=lerp(hemR,hemL,u);
      const y=hemY + Math.sin(u*Math.PI*3)*H*0.018; g.lineTo(x,y); }
    g.closePath();
  }, toneSolid(inkLevel(CLK)), 4.5);
  // vertical drape folds
  for(let f=1;f<=params.dropFolds;f++){
    const u=f/(params.dropFolds+1);
    const xT=lerp(topL,topR,u), xB=lerp(hemL,hemR,u);
    pen.seam(()=>{ g.moveTo(xT, rodY+H*0.02);
      g.quadraticCurveTo(lerp(xT,xB,0.5)+Math.sin(f)*6, lerp(rodY,hemY,0.5), xB, hemY-H*0.01); },
      f%2?2.6:1.6);
  }
  // the wooden rod, over the drape lip, with a grip knob at the offered (right) end
  pen.paint(()=>{ rr(g, rodX0, rodY-H*0.012, rodX1-rodX0, H*0.024, H*0.012); }, toneSolid(inkLevel(ROD)), 4);
  pen.paint(()=>{ g.ellipse(rodX1, rodY, W*0.028, H*0.022, 0,0,7); }, toneSolid(inkLevel(ROD+1)), 3.5); // knob

  // fibula pinning the cloak near the left shoulder of the drape
  if (params.brooch) fibula(pen,g, topL+W*0.05, rodY+H*0.05, W*0.040);

  // folded tunic resting on the ground below the drape
  slabStack(pen,g, W*0.5, H*0.82, W*0.40, H*0.044, params.tunicFolds, TUN);
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(W*0.5, H*0.83, W*0.22, H*0.018, 0,0,7); g.fill();
}

/* ------------------------------------------------------------------
   WORN — the set as worn on an implied body (no figure rig): a belted tunic
   column with cap sleeves and a cloak mantle over the shoulders pinned at the
   right with the fibula. `wet` darkens + clings + drips at the hem.
   ------------------------------------------------------------------ */
function drawWorn(pen,g,W,H,{wet=false,t=0}={}){
  const cx=W*0.5;
  const shY=H*0.22, shH=W*0.25;               // shoulder line + half-width
  const waY=H*0.48, waH=W*0.155;              // waist (belted)
  const hemY=H*0.74, hemH=W*0.28;             // flared hem
  const dk = wet?WETADD:0;
  const wave = (u)=> wet ? Math.sin(u*Math.PI*4)*H*0.010 : Math.sin(u*Math.PI*3)*H*0.018;

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, hemY+H*0.02, hemH*1.15, H*0.02, 0,0,7); g.fill();

  // ---- CLOAK mantle behind the tunic (broad cape spreading to a low hem) ----
  const clHemY=H*0.80, clHemH=W*0.36;
  pen.paint(()=>{
    g.moveTo(cx-shH*1.02, shY+H*0.01);
    g.lineTo(cx+shH*1.02, shY+H*0.01);
    g.lineTo(cx+clHemH, clHemY-H*0.02);
    for(let i=1;i<=6;i++){ const u=i/6; const x=lerp(cx+clHemH,cx-clHemH,u);
      const y=clHemY+wave(u); g.lineTo(x,y); }
    g.closePath();
  }, toneSolid(inkLevel(CLK+dk)), 4.5);
  // a couple of cloak drape folds
  for(let f=-1;f<=1;f+=2){
    pen.seam(()=>{ g.moveTo(cx+f*shH*0.7, shY+H*0.05);
      g.quadraticCurveTo(cx+f*clHemH*0.7, lerp(shY,clHemY,0.5), cx+f*clHemH*0.85, clHemY-H*0.02); }, 2.4);
  }

  // ---- TUNIC body (chiton) over the cloak ----
  pen.paint(()=>{
    g.moveTo(cx-shH, shY);
    // left side: shoulder -> cinched waist -> flared hem
    g.quadraticCurveTo(cx-waH*1.15, waY, cx-hemH, hemY-H*0.02);
    for(let i=1;i<=5;i++){ const u=i/5; const x=lerp(cx-hemH,cx+hemH,u);
      const y=hemY+wave(u); g.lineTo(x,y); }
    // right side up to shoulder
    g.quadraticCurveTo(cx+waH*1.15, waY, cx+shH, shY);
    // shoulder yoke with a round neck opening dip
    g.lineTo(cx+shH*0.34, shY+H*0.005);
    g.quadraticCurveTo(cx, shY+H*0.055, cx-shH*0.34, shY+H*0.005);
    g.closePath();
  }, toneSolid(inkLevel(TUN+dk)), 5);

  // cap sleeves at the shoulders
  for(const s of [-1,1]){
    pen.paint(()=>{ g.ellipse(cx+s*shH*0.92, shY+H*0.03, W*0.055, H*0.045, s*0.3,0,7); },
      toneSolid(inkLevel(TUN2+dk)), 4);
  }

  // vertical tunic drape folds (cling tighter + more when wet)
  const nF = wet?7:5;
  for(let f=1;f<=nF;f++){
    const u=f/(nF+1);
    const xT=lerp(cx-shH*0.8, cx+shH*0.8, u);
    const xH=lerp(cx-hemH*0.85, cx+hemH*0.85, u);
    pen.seam(()=>{ g.moveTo(xT, shY+H*0.07);
      g.quadraticCurveTo(lerp(xT,xH,0.5), waY, xH, hemY-H*0.01); }, f%2?2.6:1.5);
  }

  // ---- BELT / girdle at the waist ----
  if (params.belt){
    pen.paint(()=>{ rr(g, cx-waH*1.02, waY-H*0.012, waH*2.04, H*0.028, H*0.012); },
      toneSolid(inkLevel(BELT+dk)), 3.5);
    pen.paint(()=>{ g.ellipse(cx, waY+H*0.002, W*0.022, H*0.016, 0,0,7); }, toneSolid(inkLevel(BROO)), 2.6); // buckle
  }

  // ---- CLOAK front flap over the right shoulder, crossing to the left hip ----
  pen.paint(()=>{
    g.moveTo(cx+shH*0.98, shY+H*0.02);
    g.quadraticCurveTo(cx+shH*0.4, waY*0.9, cx-waH*0.9, waY+H*0.06);
    g.lineTo(cx-waH*0.5, waY+H*0.11);
    g.quadraticCurveTo(cx+shH*0.55, waY*0.95, cx+shH*1.10, shY+H*0.09);
    g.closePath();
  }, toneSolid(inkLevel(CLK+dk)), 4.5);
  // fold lines on the flap
  for(let i=0;i<3;i++){
    pen.seam(()=>{ g.moveTo(cx+shH*0.85-i*W*0.05, shY+H*0.05+i*H*0.006);
      g.quadraticCurveTo(cx+shH*0.2, waY*0.92, cx-waH*0.7+i*W*0.04, waY+H*0.06); }, 1.6);
  }
  // fibula pinning the cloak at the right shoulder
  if (params.brooch) fibula(pen,g, cx+shH*1.0, shY+H*0.05, W*0.045);

  // wet: drips off the hem
  if (wet){
    g.fillStyle=inkLevel(CLK+1);
    for(let i=0;i<7;i++){
      const dx=cx+(i-3)*hemH*0.28;
      const dy=hemY+H*0.02 + ((t*40+i*29)%(H*0.05));
      g.beginPath(); g.ellipse(dx,dy,2.6,4.6,0,0,7); g.fill();
    }
  }
}

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const mode = st.mode || "folded";
  const t = st.t ?? 0;
  const wet = !!st.wet;

  if (mode==="offered")      drawOffered(pen,g,W,H,{t});
  else if (mode==="worn")    drawWorn(pen,g,W,H,{wet,t});
  else                       drawFolded(pen,g,W,H,{wet,t}); // folded / returned
}

export const asset = {
  id:"prop.phaeacian-tunic-and-cloak",
  type:"PROP",
  name:"Phaeacian Tunic and Cloak",
  statusWord:"BORROWED",
  scene:"OD-B06-S04",

  params,
  // back -> front draw order the prop honors
  layers:["shadow","cloak-back","tunic","sleeve","fold","belt","cloak-flap","brooch","drip"],
  // normalized 0..1 grip / contact / pin anchors
  anchors:{
    "grip:offer":{x:.80,y:.24},         // held end of the offered rod
    "fold:top":{x:.50,y:.55},           // crown of the folded pile (set / take)
    "pin:brooch":{x:.74,y:.27},         // the fibula pin point on the shoulder
    "attach:shoulders":{x:.50,y:.22},   // where the set sits on a wearer
    "belt:waist":{x:.50,y:.48},         // girdle line
    "contact:ground":{x:.50,y:.80},     // grounded contact
    "hem":{x:.50,y:.74},                // tunic hem edge
  },
  // ownership + collision box (AABB in 0..1) — lent by the Phaeacian household
  ownership:"phaeacians:nausicaa",      // borrowed, then returned (continuity)
  collision:{ kind:"box", x0:.14, y0:.18, x1:.86, y1:.86 },
  zones:{ bounds:{ x0:.14,y0:.18,x1:.86,y1:.86 }, footprint:{ x0:.22,y0:.72,x1:.78,y1:.84 } },

  states:{
    initial:"folded",
    nodes:{
      folded:  { preview:{ mode:"folded",           status:"FOLDED",   progress:.20 } },
      offered: { preview:{ mode:"offered",          status:"OFFERED",  progress:.40 } },
      worn:    { preview:{ mode:"worn",             status:"WORN",     progress:.65 } },
      wet:     { preview:{ mode:"worn", wet:true,   status:"SOAKED",   progress:.55 } },
      returned:{ preview:{ mode:"folded",           status:"RETURNED", progress:1.0 } },
    },
    edges:[
      ["folded","offered"],["offered","worn"],["worn","wet"],
      ["wet","worn"],["worn","returned"],["returned","folded"],
    ],
  },
  channels:["mode","wet","t"],

  preview:()=>({ mode:"worn", t:0, status:"BORROWED", progress:.65 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision, ownership:asset.ownership }; },
};
export default asset;
