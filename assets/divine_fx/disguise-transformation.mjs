/* divine_fx.disguise-transformation — the REVERSIBLE aging/withering morph a
   god lays on a mortal: a strong upright figure WITHERS into a stooped, wrinkled
   beggar at the touch of a wand — and, because it is reversible, springs back.
   DIVINE_FX asset. (Athena wands Odysseus into the beggar in Book 13, then
   restores him; this module is the generic body-surface + proportion modifier.)

   Scene function (OD-B13-S05): a reversible body-surface and proportion modifier
   that PRESERVES the underlying skeleton, canonical identity, wounds, and
   animation tracks. Staged as a BEFORE/AFTER MORPH PAIR — the tall strong
   silhouette on the left, the shrunken stooped beggar on the right — joined by a
   DOUBLE-HEADED REVERSIBLE ARROW, touched off by a WAND + SPARK (the source),
   with the SAME skeleton drawn through both bodies and the SAME wound + identity
   token surviving on each, proving nothing but surface and proportion changed.

   DIVINE_FX contract: SOURCE (the wand touch + spark) -> FIELD (the reversible
   arrow corridor + proportion ruler + shared skeleton) -> TARGET (the beggar
   form) -> TRANSFORM (strong body withers/shrinks as beggar solidifies, and back)
   -> visible CONSEQUENCE (identical skeleton, wound, and identity token on both).
   Animates over state.t: 0 = strong solid / beggar a faint outline, the wand
   just arriving; ~0.5 = both half, spark at its brightest, arrow live; ~0.85 =
   beggar solid and stooped, strong form a ghost. The double arrow marks that t
   runs both ways. Skeleton + wound + identity token are constant at every t.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const params = {
  source:{ x:0.220, y:0.860 },   // where the strong figure stands (source pose)
  target:{ x:0.790, y:0.860 },   // where the beggar stands (target pose)
  ground:0.860,                  // shared standing plane as fraction of H
  strongH:0.550,                 // strong figure height as fraction of H (tall)
  beggarH:0.400,                 // beggar height as fraction of H (shrunk + stooped)
  wandFrom:{ x:0.120, y:0.075 }, // where the wand enters, from above-left (source)
  sparkRays:12,                  // spark burst rays at the wand's touch point
  spark:1.0,                     // master spark energy (channel-driven)
};

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- shared standing GROUND: a light plane both poses rest on, with a faint
   receding ruled floor. Diagrammatic only, no baked-in unrelated figures. ---- */
function drawGround(pen,g,W,H){
  const gy=H*params.ground;
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,gy);        // open field (light)
  g.fillStyle=inkLevel(2); g.fillRect(0,gy,W,H-gy);     // ground slab
  pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.26;
  for(let j=1;j<=2;j++){ const y=gy+(H-gy)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;
}

/* small IDENTITY TOKEN — the same 4-point star worn by both bodies, proving the
   canonical identity survives the reversible morph. */
function identityMark(g,cx,cy,r,ink){
  g.save(); g.fillStyle=ink; g.beginPath();
  for(let i=0;i<8;i++){
    const a=i*(TAU/8)-Math.PI/2, rr=(i%2? r*0.4 : r);
    const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr;
    if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
  }
  g.closePath(); g.fill(); g.restore();
}

/* a preserved WOUND mark — a short scar hatch at a fixed body location (the
   canonical scar), drawn identically on both forms to prove wounds survive. */
function woundMark(g,cx,cy,s,ink){
  g.save(); g.strokeStyle=ink; g.lineWidth=Math.max(1.6,s*0.18); g.lineCap="round";
  g.beginPath(); g.moveTo(cx-s,cy-s*0.7); g.lineTo(cx+s,cy+s*0.7); g.stroke();
  for(let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(cx-s*0.5+k*s*0.5, cy-s*0.1); g.lineTo(cx-s*0.5+k*s*0.5+s*0.4, cy+s*0.1); g.stroke(); }
  g.restore();
}

/* the invariant SKELETON drawn INSIDE a body (paper-light over the dark form):
   crown, spine, shoulder + hip bars, and the four limb bones. `bend` curves the
   spine forward for the stooped beggar. Identical topology on both figures — the
   proof that only surface + proportion changed, not the skeleton. */
function drawSkeleton(g, cx, crownY, shoulderY, hipY, footY, shW, hipW, bend, ink){
  const sx = cx - bend;                          // stooped shoulder shifts forward
  const nx = cx - bend*0.5;                       // neck follows partway
  g.save(); g.strokeStyle=ink; g.lineWidth=3.2; g.lineCap="round"; g.lineJoin="round";
  // spine (hip -> shoulder), curved by bend  — the clear X-ray backbone
  g.beginPath(); g.moveTo(cx,hipY); g.quadraticCurveTo(nx,(hipY+shoulderY)/2, sx,shoulderY); g.stroke();
  // shoulder + hip bars (clavicle + pelvis)
  g.beginPath(); g.moveTo(sx-shW,shoulderY); g.lineTo(sx+shW,shoulderY); g.stroke();
  g.beginPath(); g.moveTo(cx-hipW,hipY); g.lineTo(cx+hipW,hipY); g.stroke();
  // a couple of ribs off the spine
  g.lineWidth=2.2;
  for(let i=1;i<=2;i++){ const yy=lerp(shoulderY,hipY,i/3), rr=lerp(shW,hipW,i/3)*0.8, mx=lerp(sx,cx,i/3);
    g.beginPath(); g.moveTo(mx-rr,yy-2); g.lineTo(mx+rr,yy-2); g.stroke(); }
  // leg bones (hip -> foot), the standing pair
  g.lineWidth=3.0;
  for(const s of [-1,1]){ const hp={x:cx+s*hipW,y:hipY}, ft={x:cx+s*hipW*0.7,y:footY};
    g.beginPath(); g.moveTo(hp.x,hp.y); g.lineTo(ft.x,ft.y); g.stroke(); }
  // joint dots at shoulders + hips only (kept sparse)
  g.fillStyle=ink;
  for(const p of [[sx,shoulderY],[cx,(shoulderY+hipY)/2],[cx-hipW,hipY],[cx+hipW,hipY]]){
    g.beginPath(); g.arc(p[0],p[1],3.0,0,TAU); g.fill();
  }
  g.restore();
}

/* ---- SOURCE: the strong UPRIGHT figure the god withers — tall, broad-shouldered,
   straight spine, chin up, a short cloak. Solid dark; fades to a ghost as t rises.
   Carries the shared skeleton, wound, and identity token. Returns crown + heart. */
function drawStrong(pen,g,W,H,alpha){
  const gy=H*params.ground, cx=W*params.source.x, h=H*params.strongH;
  const topY=gy-h, tone=toneSolid(inkLevel(7));
  const headR=h*0.100, headCy=topY+headR*1.25, crownY=headCy-headR*1.15;
  const shoulderY=headCy+headR*1.4, hipY=gy-h*0.44;
  const shW=h*0.22, hipW=h*0.15, heartY=shoulderY+h*0.12;
  if (alpha<=0.02) return { crown:{x:cx,y:crownY}, heart:{x:cx,y:heartY} };
  g.save(); g.globalAlpha=alpha;

  // legs (straight, planted wide)
  const legTone=toneSolid(inkLevel(6));
  pen.limb(()=>{ g.moveTo(cx-hipW*0.6,hipY); g.lineTo(cx-hipW*0.75,gy); }, legTone, h*0.075);
  pen.limb(()=>{ g.moveTo(cx+hipW*0.6,hipY); g.lineTo(cx+hipW*0.75,gy); }, legTone, h*0.075);

  // broad tapered torso (shoulders -> hips)
  pen.paint(()=>{
    g.moveTo(cx-shW*0.5, shoulderY);
    g.lineTo(cx+shW*0.5, shoulderY);
    g.lineTo(cx+hipW*0.85, hipY);
    g.lineTo(cx-hipW*0.85, hipY);
    g.closePath();
  }, tone, 4);
  // short cloak over one shoulder
  pen.paint(()=>{
    g.moveTo(cx-shW*0.5, shoulderY-h*0.01);
    g.lineTo(cx-shW*0.66, shoulderY+h*0.02);
    g.lineTo(cx-hipW*1.0, hipY+h*0.02);
    g.lineTo(cx-hipW*0.4, hipY-h*0.02);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // belt seam
  pen.seam(()=>{ g.moveTo(cx-hipW*0.85,hipY); g.lineTo(cx+hipW*0.85,hipY); }, 3);

  // arms — near arm strong at the side, far arm slightly out
  pen.limb(()=>{ g.moveTo(cx-shW*0.44,shoulderY+h*0.01); g.lineTo(cx-shW*0.62,hipY-h*0.02); }, tone, h*0.07);
  pen.limb(()=>{ g.moveTo(cx+shW*0.44,shoulderY+h*0.01); g.lineTo(cx+shW*0.60,hipY+h*0.00); }, tone, h*0.07);

  // neck + head (upright), straight
  pen.limb(()=>{ g.moveTo(cx,shoulderY); g.lineTo(cx,headCy+headR*0.6); }, tone, h*0.055);
  pen.paint(()=>{ g.arc(cx,headCy,headR,0,TAU); }, tone, 4);
  // trim chin beard (kept small so the head reads clearly)
  pen.paint(()=>{
    g.moveTo(cx-headR*0.6, headCy+headR*0.45);
    g.quadraticCurveTo(cx, headCy+headR*1.15, cx+headR*0.6, headCy+headR*0.45);
    g.quadraticCurveTo(cx, headCy+headR*0.75, cx-headR*0.6, headCy+headR*0.45);
    g.closePath();
  }, toneSolid(inkLevel(6)), 2.5);

  // shared SKELETON (paper-light), wound + identity token
  drawSkeleton(g, cx, crownY, shoulderY, hipY, gy, shW*0.5, hipW*0.85, 0, inkLevel(1));
  woundMark(g, cx+hipW*0.4, lerp(hipY,gy,0.4), h*0.028, inkLevel(1));
  identityMark(g, cx, heartY, h*0.042, inkLevel(1));
  g.restore();
  return { crown:{x:cx,y:crownY}, heart:{x:cx,y:heartY} };
}

/* ---- TARGET: the withered BEGGAR — shrunken, stooped (curved spine), gaunt,
   leaning on a gnarled staff, ragged hem, wrinkle hatching. Solidifies as t rises.
   Carries the SAME skeleton, wound, and identity token. Returns crown + heart. */
function drawBeggar(pen,g,W,H,alpha){
  const gy=H*params.ground, cx=W*params.target.x, h=H*params.beggarH;
  const topY=gy-h, tone=toneSolid(inkLevel(7));
  const bend=h*0.20;                                   // forward stoop
  const headR=h*0.115;
  const shoulderY=topY+h*0.28, hipY=gy-h*0.40;
  const sx=cx-bend;                                    // stooped shoulder forward
  const headCy=shoulderY-h*0.10, crownY=headCy-headR;
  const shW=h*0.20, hipW=h*0.15, heartY=shoulderY+h*0.14;
  if (alpha<=0.02) return { crown:{x:crownX(sx,bend),y:crownY}, heart:{x:sx,y:heartY} };
  g.save(); g.globalAlpha=alpha;

  // gnarled STAFF (behind body), taller than he is, with a knobbed top
  const stx=cx+hipW*1.3;
  pen.limb(()=>{ g.moveTo(stx-hipW*0.2, gy); g.lineTo(stx, topY-h*0.02); }, toneSolid(inkLevel(6)), h*0.032);
  pen.paint(()=>{ g.arc(stx, topY-h*0.04, h*0.045, 0, TAU); }, toneSolid(inkLevel(6)), 3); // knob

  // legs (thin, bent)
  const legTone=toneSolid(inkLevel(6));
  pen.limb(()=>{ g.moveTo(cx-hipW*0.5,hipY); g.lineTo(cx-hipW*0.6,gy); }, legTone, h*0.06);
  pen.limb(()=>{ g.moveTo(cx+hipW*0.5,hipY); g.lineTo(cx+hipW*0.55,gy); }, legTone, h*0.06);

  // stooped tunic torso (spine curved forward): shoulders shifted to sx
  pen.paint(()=>{
    g.moveTo(sx-shW*0.5, shoulderY);
    g.lineTo(sx+shW*0.5, shoulderY);
    g.quadraticCurveTo(cx+hipW*0.9, (shoulderY+hipY)/2, cx+hipW*0.8, hipY);
    // ragged hem across the bottom
    g.lineTo(cx+hipW*0.4, hipY-h*0.02);
    g.lineTo(cx+hipW*0.1, hipY+h*0.03);
    g.lineTo(cx-hipW*0.2, hipY-h*0.02);
    g.lineTo(cx-hipW*0.55, hipY+h*0.02);
    g.quadraticCurveTo(cx-hipW*0.9, (shoulderY+hipY)/2, sx-shW*0.5, shoulderY);
    g.closePath();
  }, tone, 4);

  // near arm leaning onto the staff
  pen.limb(()=>{ g.moveTo(sx+shW*0.40,shoulderY+h*0.02); g.lineTo(stx-hipW*0.1, topY+h*0.08); }, tone, h*0.055);
  // far arm tucked across the belly (kept clear of the corridor)
  pen.limb(()=>{ g.moveTo(sx-shW*0.36,shoulderY+h*0.04); g.lineTo(cx-hipW*0.15,hipY-h*0.10); }, tone, h*0.05);

  // hunched neck + bowed head
  pen.limb(()=>{ g.moveTo(sx,shoulderY); g.lineTo(crownX(sx,bend),headCy+headR*0.5); }, tone, h*0.05);
  const hcx=crownX(sx,bend);
  pen.paint(()=>{ g.arc(hcx,headCy,headR,0,TAU); }, tone, 4);
  // long straggly beard
  pen.paint(()=>{
    g.moveTo(hcx-headR*0.75, headCy+headR*0.2);
    g.quadraticCurveTo(hcx-headR*0.2, headCy+headR*2.4, hcx+headR*0.2, headCy+headR*0.9);
    g.quadraticCurveTo(hcx+headR*0.7, headCy+headR*1.3, hcx+headR*0.75, headCy+headR*0.2);
    g.quadraticCurveTo(hcx, headCy+headR*0.8, hcx-headR*0.75, headCy+headR*0.2);
    g.closePath();
  }, toneSolid(inkLevel(7)), 3);

  // WRINKLE HATCHING — a few short curved strokes across the face (the withering)
  g.save(); g.strokeStyle=inkLevel(2); g.lineWidth=1.8; g.lineCap="round";
  for(let i=0;i<2;i++){ const yy=headCy-headR*0.15+i*headR*0.3;
    g.beginPath(); g.moveTo(hcx-headR*0.6,yy); g.quadraticCurveTo(hcx,yy+headR*0.12,hcx+headR*0.6,yy); g.stroke(); }
  g.restore();

  // shared SKELETON (paper-light) — SAME topology, bent spine; wound + token
  drawSkeleton(g, cx, crownY, shoulderY, hipY, gy, shW*0.5, hipW*0.85, bend, inkLevel(1));
  woundMark(g, cx+hipW*0.4, lerp(hipY,gy,0.4), h*0.030, inkLevel(1));
  identityMark(g, sx, heartY, h*0.05, inkLevel(1));
  g.restore();
  return { crown:{x:hcx,y:crownY}, heart:{x:sx,y:heartY} };
}
function crownX(sx,bend){ return sx - bend*0.55; }   // bowed head leans further forward

/* ---- FIELD: the REVERSIBLE double-headed ARROW + PROPORTION RULER in the
   corridor between the two forms. A bold horizontal shaft with arrowheads on
   BOTH ends (t runs both ways), a curved "return" loop above it reinforcing
   reversibility, and a height bracket measuring the proportion drop. ---- */
function drawReversibleField(pen,g,W,H,phase){
  const gy=H*params.ground;
  const sCrown=gy-H*params.strongH;                    // strong crown height
  const bCrown=gy-H*params.beggarH*0.92;               // beggar crown height (lower)
  const ax0=W*0.395, ax1=W*0.605, ay=H*0.505;          // arrow corridor
  const hw=W*0.034, hh=H*0.028;                         // arrowhead size

  // proportion RULER: dashed crown guides across the corridor + a height bracket
  g.save(); g.strokeStyle=inkLevel(4); g.lineWidth=2; g.setLineDash([H*0.014,H*0.012]); g.globalAlpha=0.7;
  g.beginPath(); g.moveTo(W*0.30, sCrown); g.lineTo(W*0.58, sCrown); g.stroke();
  g.beginPath(); g.moveTo(W*0.42, bCrown); g.lineTo(W*0.70, bCrown); g.stroke();
  g.setLineDash([]); g.restore();
  // height bracket between the two crowns
  g.save(); g.strokeStyle=inkLevel(3); g.lineWidth=2; const bx=W*0.495;
  g.beginPath(); g.moveTo(bx,sCrown); g.lineTo(bx,bCrown); g.stroke();
  g.beginPath(); g.moveTo(bx-W*0.012,sCrown); g.lineTo(bx+W*0.012,sCrown);
                 g.moveTo(bx-W*0.012,bCrown); g.lineTo(bx+W*0.012,bCrown); g.stroke();
  g.restore();

  // the DOUBLE-HEADED reversible arrow shaft
  const shH=H*0.013;
  pen.paint(()=>{ g.rect(ax0, ay-shH, ax1-ax0, shH*2); }, toneSolid(inkLevel(5)), 3);
  // left arrowhead (points to strong -> restore)
  pen.paint(()=>{ g.moveTo(ax0-hw, ay); g.lineTo(ax0+hw*0.4, ay-hh); g.lineTo(ax0+hw*0.4, ay+hh); g.closePath(); }, toneSolid(inkLevel(6)), 3);
  // right arrowhead (points to beggar -> disguise)
  pen.paint(()=>{ g.moveTo(ax1+hw, ay); g.lineTo(ax1-hw*0.4, ay-hh); g.lineTo(ax1-hw*0.4, ay+hh); g.closePath(); }, toneSolid(inkLevel(6)), 3);

  // curved RETURN loop above the shaft — the "reversible" cycle glyph
  g.save(); g.strokeStyle=inkLevel(5); g.lineWidth=Math.max(2.4,W*0.007); g.lineCap="round";
  const cy=ay-H*0.052, r=H*0.030;
  g.beginPath(); g.arc((ax0+ax1)/2, cy, r, Math.PI*0.15, Math.PI*0.95, false); g.stroke();
  // little arrowhead on the loop end (marks the cycle direction)
  const la=Math.PI*0.95, lx=(ax0+ax1)/2+Math.cos(la)*r, ly=cy+Math.sin(la)*r;
  g.fillStyle=inkLevel(6); g.beginPath();
  g.moveTo(lx-W*0.006, ly+H*0.001); g.lineTo(lx+W*0.014, ly+H*0.006); g.lineTo(lx+W*0.001, ly+H*0.018); g.closePath(); g.fill();
  g.restore();

  // a small phase pip riding the shaft, showing which way t currently runs
  const px=lerp(ax0, ax1, clamp01(phase));
  g.save(); g.fillStyle=ACCENT; g.globalAlpha=0.9; g.beginPath(); g.arc(px, ay, H*0.008, 0, TAU); g.fill(); g.restore();
}

/* ---- SOURCE: the WAND descending from above-left, its tip resting at the strong
   figure's crown, with a SPARK burst at the point of contact (the touch that
   triggers the reversible morph). Spark brightest mid-transform. ---- */
function drawWand(pen,g,W,H,tip,spark){
  const from={x:W*params.wandFrom.x, y:H*params.wandFrom.y};
  // the rod
  pen.limb(()=>{ g.moveTo(from.x,from.y); g.lineTo(tip.x,tip.y); }, toneSolid(inkLevel(6)), Math.max(3,W*0.008));
  // a small handle knob at the top
  pen.paint(()=>{ g.arc(from.x,from.y,W*0.014,0,TAU); }, toneSolid(inkLevel(7)), 3);
  // SPARK burst at the touch point (bold — the trigger of the morph)
  if (spark<=0.02) return;
  g.save(); g.translate(tip.x,tip.y+H*0.012);   // seated onto the crown (the touch)
  g.strokeStyle=inkLevel(5); g.lineCap="round";
  const n=params.sparkRays, r0=H*0.013, r1=H*0.062*(0.7+0.5*spark);
  for(let k=0;k<n;k++){
    const a=(k/n)*TAU;
    const rr=r1*(0.68+0.32*(k%2));
    g.lineWidth=(k%2?2.2:3.6); g.globalAlpha=(0.6+0.4*(k%2))*spark;
    g.beginPath(); g.moveTo(Math.cos(a)*r0, Math.sin(a)*r0); g.lineTo(Math.cos(a)*rr, Math.sin(a)*rr); g.stroke();
  }
  // bright core ringed by a dark rim so it reads against the paper
  g.globalAlpha=spark; g.fillStyle=inkLevel(6);
  g.beginPath(); g.arc(0,0,r0*1.4,0,TAU); g.fill();
  g.fillStyle=inkLevel(1);
  g.beginPath(); g.arc(0,0,r0*0.7,0,TAU); g.fill();
  g.globalAlpha=1; g.restore();
}

/* ---- IDENTITY / SKELETON LINK: a dotted arc joining the two hearts with the
   shared token at its apex — the proof the canonical identity + skeleton are
   unchanged by the reversible morph. ---- */
function drawIdentityLink(pen,g,W,H,a,b){
  const mx=(a.x+b.x)/2, my=Math.min(a.y,b.y)-H*0.075;
  g.save(); g.strokeStyle=inkLevel(4); g.lineWidth=2; g.setLineDash([H*0.010,H*0.012]); g.globalAlpha=0.8;
  g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my, b.x,b.y); g.stroke();
  g.setLineDash([]); g.restore();
  identityMark(g, mx, my+H*0.006, H*0.015, inkLevel(6));
  g.save(); g.strokeStyle=inkLevel(5); g.lineWidth=2;
  g.beginPath(); g.arc(mx, my+H*0.006, H*0.025, 0, TAU); g.stroke(); g.restore();
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.6);
  const te=smooth(t);
  const spark=(st.spark ?? params.spark) * clamp01(1-Math.abs(t-0.5)*1.7);  // peaks mid-morph
  const layers=st.layers || ["ground","field","strong","beggar","wand","identity"];
  const has=l=>layers.includes(l);

  // morph fades: source (strong) becomes a ghost, target (beggar) solidifies
  const strongAlpha=lerp(1.0, 0.28, te);
  const beggarAlpha=lerp(0.30, 1.0, te);

  if (has("ground")) drawGround(pen,g,W,H);
  if (has("field"))  drawReversibleField(pen,g,W,H,t);
  const strong=has("strong") ? drawStrong(pen,g,W,H,strongAlpha)
                             : { crown:{x:W*params.source.x,y:H*(params.ground-params.strongH)}, heart:{x:W*params.source.x,y:H*0.55} };
  const beggar=has("beggar") ? drawBeggar(pen,g,W,H,beggarAlpha)
                             : { crown:{x:W*params.target.x,y:H*(params.ground-params.beggarH)}, heart:{x:W*params.target.x,y:H*0.62} };
  if (has("wand"))     drawWand(pen,g,W,H,strong.crown,spark);
  if (has("identity")) drawIdentityLink(pen,g,W,H,strong.heart,beggar.heart);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.disguise-transformation",
  type:"DIVINE_FX",
  name:"Disguise transformation",
  statusWord:"WITHERING",
  scene:"OD-B13-S05",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["ground","field","strong","beggar","wand","identity"],
  // normalized 0..1 source / target / field / consequence / camera anchors
  anchors:{
    "source:strong":{ x:0.270, y:0.860 },   // the strong original form (source pose)
    "target:beggar":{ x:0.730, y:0.860 },   // the withered beggar (target pose)
    "source:wand":{   x:0.270, y:0.300 },   // the wand's touch point at the crown
    "field:arrow":{   x:0.500, y:0.545 },   // the reversible double-arrow corridor
    "field:ruler":{   x:0.485, y:0.440 },   // the proportion-drop bracket
    "identity:link":{ x:0.500, y:0.470 },   // shared identity/skeleton token (consequence)
    "camera:wide":{   x:0.500, y:0.520 },
  },
  // the transition corridor + the two standing spots
  zones:{ corridor:{ x0:0.36, y0:0.20, x1:0.64, y1:0.86 },
          stand:{    x0:0.14, y0:0.80, x1:0.90, y1:0.94 } },
  // DIVINE_FX transformation states over t — REVERSIBLE (t runs both ways)
  states:{
    initial:"withering",
    nodes:{
      // strong: the original form solid, beggar a faint outline, wand arriving
      strong:{    preview:{ t:0.10, spark:0.7, status:"STRONG",    progress:0.10 } },
      // withering: both half, spark at its brightest, arrow live
      withering:{ preview:{ t:0.50, spark:1.0, status:"WITHERING", progress:0.50 } },
      // beggar: the stooped beggar solid, strong form a ghost
      beggar:{    preview:{ t:0.85, spark:0.5, status:"BEGGAR",    progress:0.85 } },
    },
    // reversible: every edge runs both directions
    edges:[["strong","withering"],["withering","beggar"],["beggar","withering"],["withering","strong"]],
  },
  duration:4.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","spark"],

  // neutral preview: mid-late morph — beggar solidifying + stooped, strong form a
  // ghost, wand touched to the crown, reversible arrow + skeleton/identity link live.
  preview:()=>({ t:0.62, spark:0.85, status:"WITHERING", progress:0.62,
                 layers:["ground","field","strong","beggar","wand","identity"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
