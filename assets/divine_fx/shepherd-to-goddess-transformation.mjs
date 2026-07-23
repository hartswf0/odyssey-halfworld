/* divine_fx.shepherd-to-goddess-transformation — Athena in Book 13 sheds the
   YOUNG SHEPHERD disguise she met Odysseus in and stands revealed as the TALL
   RADIANT ARMORED GODDESS. DIVINE_FX asset.

   Scene function (OD-B13-S03): a costume + scale + posture + light transition
   staged as a BEFORE/AFTER MORPH PAIR — the small shepherd silhouette on the
   left, the tall armored goddess on the right — with rising light behind her, a
   GROWTH ARROW spanning the scale change, and an IDENTITY link proving the
   canonical identity is preserved through the change.

   DIVINE_FX contract: SOURCE (the shepherd form) -> FIELD (the rising-light
   corridor + scale ruler between the two poses) -> TARGET (the goddess form) ->
   TRANSFORM (source fades to a ghost as the target solidifies and radiates) ->
   visible CONSEQUENCE (same identity token on both bodies; the growth arrow).
   Animates over state.t: 0 = shepherd solid / goddess a faint outline,
   ~0.5 = both half, light rising, arrow half-drawn, ~0.85 = goddess solid and
   radiant, shepherd a ghost. Identity token is constant at every t.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const params = {
  source:{ x:0.245, y:0.865 },   // where the shepherd stands (source pose)
  target:{ x:0.720, y:0.865 },   // where the goddess stands (target pose)
  ground:0.865,                  // shared standing plane as fraction of H
  shepherdH:0.300,               // shepherd height as fraction of H (short)
  goddessH:0.600,                // goddess height as fraction of H (tall)
  rays:14,                       // radiant halo rays behind the goddess
  radiance:1.0,                  // master light energy (channel-driven)
};

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- shared standing GROUND: a light plane both poses rest on, with a faint
   receding ruled floor. Diagrammatic only, no baked figures. ---- */
function drawGround(pen,g,W,H){
  const gy=H*params.ground;
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,gy);        // open field (light)
  g.fillStyle=inkLevel(2); g.fillRect(0,gy,W,H-gy);     // ground slab
  pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
  for(let j=1;j<=2;j++){ const y=gy+(H-gy)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;
}

/* ---- GROWTH ARROW + scale guides: the FIELD that carries the scale change. A
   bold DIAGONAL arrow rises from the shepherd's crown toward the goddess's
   crown, FILLING with t — the visible measure of the transformation's growth
   (short -> tall). Two faint dashed height guides mark the two crown heights. ---- */
function drawGrowthField(pen,g,W,H,fill){
  const gy=H*params.ground;
  const sCrown=gy-H*params.shepherdH;      // shepherd crown height
  const tCrown=gy-H*params.goddessH;       // goddess crown height

  // faint dashed height guides across the corridor (the ruler backdrop)
  g.save(); g.strokeStyle=inkLevel(4); g.lineWidth=2; g.setLineDash([H*0.014,H*0.012]); g.globalAlpha=0.55;
  g.beginPath(); g.moveTo(W*0.26, sCrown); g.lineTo(W*0.60, sCrown); g.stroke();
  g.beginPath(); g.moveTo(W*0.34, tCrown); g.lineTo(W*0.66, tCrown); g.stroke();
  g.setLineDash([]); g.globalAlpha=1; g.restore();

  // the DIAGONAL GROWTH ARROW from shepherd crown toward goddess crown
  const P0={ x:W*0.325, y:sCrown-H*0.01 };
  const P1={ x:W*0.585, y:tCrown+H*0.02 };
  const f=clamp01(fill);
  const tip={ x:lerp(P0.x,P1.x,f), y:lerp(P0.y,P1.y,f) };
  const dx=P1.x-P0.x, dy=P1.y-P0.y, len=Math.hypot(dx,dy)||1;
  const ux=dx/len, uy=dy/len, nx=-uy, ny=ux;   // unit dir + normal
  const w0=W*0.026, w1=W*0.014, head=W*0.055;   // tapering shaft + head size
  const hb={ x:tip.x-ux*head, y:tip.y-uy*head }; // arrowhead base
  // shaft (tapered) up to the head base
  pen.paint(()=>{
    g.moveTo(P0.x+nx*w0, P0.y+ny*w0);
    g.lineTo(hb.x+nx*w1, hb.y+ny*w1);
    g.lineTo(hb.x-nx*w1, hb.y-ny*w1);
    g.lineTo(P0.x-nx*w0, P0.y-ny*w0);
    g.closePath();
  }, toneSolid(inkLevel(5)), 4);
  // solid arrowhead
  pen.paint(()=>{
    g.moveTo(tip.x, tip.y);
    g.lineTo(hb.x+nx*head*0.6, hb.y+ny*head*0.6);
    g.lineTo(hb.x-nx*head*0.6, hb.y-ny*head*0.6);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
}

/* ---- RISING LIGHT behind the goddess: soft vertical light columns lifting off
   the ground, plus a radial ray-halo around her head. Light tones (few dots) so
   it reads as radiance, not mass. Grows with `rad`. ---- */
function drawRisingLight(pen,g,W,H,cx,haloCy,rad,t){
  if (rad<=0.02) return;
  const gy=H*params.ground;
  // rising columns — vertical light beams lifting off the ground and rising PAST
  // the head into the open sky above (so they read even where the body is solid)
  g.save(); g.lineCap="round";
  const cols=5;
  for(let i=0;i<cols;i++){
    const f=(i/(cols-1))*2-1;
    const x=cx+f*W*0.115;
    const sway=Math.sin(t*TAU*0.6+i)*W*0.006;
    g.strokeStyle=inkLevel(Math.abs(f)<0.35?4:3);
    g.lineWidth=W*(0.018-Math.abs(f)*0.005);
    g.globalAlpha=(0.62-Math.abs(f)*0.14)*rad;
    g.beginPath();
    g.moveTo(x, gy);
    g.quadraticCurveTo(x+sway, lerp(gy,haloCy,0.5), x+sway*0.5, haloCy-H*0.14);
    g.stroke();
  }
  g.globalAlpha=1; g.restore();

  // radial ray halo around the head — long spokes, alternating length
  g.save(); g.lineCap="round";
  const n=params.rays, r0=H*0.030, r1=H*0.125*(0.8+0.4*rad);
  for(let k=0;k<n;k++){
    const a=(k/n)*TAU + t*0.15;
    const rr1=r1*(0.62+0.38*((k%2)));
    g.strokeStyle=inkLevel(k%2?3:4);
    g.lineWidth=(k%2?1.6:3.0);
    g.globalAlpha=0.85*rad;
    g.beginPath();
    g.moveTo(cx+Math.cos(a)*r0, haloCy+Math.sin(a)*r0);
    g.lineTo(cx+Math.cos(a)*rr1, haloCy+Math.sin(a)*rr1);
    g.stroke();
  }
  // inner halo ring
  g.strokeStyle=inkLevel(4); g.globalAlpha=0.6*rad; g.lineWidth=2.4;
  g.beginPath(); g.arc(cx,haloCy,r0*1.3,0,TAU); g.stroke();
  g.globalAlpha=1; g.restore();
}

/* small IDENTITY TOKEN — the same 4-point star mark worn by both bodies,
   proving the canonical identity survives the change. */
function identityMark(g,cx,cy,r,ink){
  g.save(); g.fillStyle=ink; g.beginPath();
  for(let i=0;i<8;i++){
    const a=i*(TAU/8)-Math.PI/2, rr=(i%2? r*0.4 : r);
    const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr;
    if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
  }
  g.closePath(); g.fill(); g.restore();
}

/* ---- SOURCE: the young SHEPHERD silhouette — short, floppy-capped, leaning on
   a crook. Solid dark; fades to a ghost as t rises. Returns his crown + heart. ---- */
function drawShepherd(pen,g,W,H,alpha){
  const gy=H*params.ground, cx=W*params.source.x, h=H*params.shepherdH;
  const topY=gy-h, tone=toneSolid(inkLevel(6));
  const headR=h*0.135, headCy=topY+headR*1.7, shoulderY=headCy+headR*1.35;
  const shW=h*0.20, hipW=h*0.15, heartY=shoulderY+h*0.14;
  const crownY=headCy-headR;
  if (alpha<=0.02) return { crown:{x:cx,y:crownY}, heart:{x:cx,y:heartY} };
  g.save(); g.globalAlpha=alpha;

  // crook staff (behind body), tall with a hooked curl
  const stx=cx-shW*1.25;
  pen.limb(()=>{ g.moveTo(stx, gy); g.lineTo(stx+shW*0.1, crownY-h*0.10); }, toneSolid(inkLevel(5)), h*0.028);
  pen.ink(()=>{
    g.moveTo(stx+shW*0.1, crownY-h*0.10);
    g.quadraticCurveTo(stx+shW*0.9, crownY-h*0.20, stx+shW*0.75, crownY+h*0.02);
  }, Math.max(2,h*0.026));

  // short tunic body (tapered)
  pen.paint(()=>{
    g.moveTo(cx-shW*0.5, shoulderY);
    g.lineTo(cx+shW*0.5, shoulderY);
    g.lineTo(cx+hipW*0.7, gy);
    g.lineTo(cx-hipW*0.7, gy);
    g.closePath();
  }, tone, 4);
  // near arm resting toward the crook
  pen.limb(()=>{ g.moveTo(cx-shW*0.42, shoulderY+h*0.02); g.lineTo(stx+shW*0.4, gy-h*0.34); }, tone, h*0.06);
  // neck + head
  pen.limb(()=>{ g.moveTo(cx,shoulderY); g.lineTo(cx,headCy+headR*0.5); }, tone, h*0.055);
  pen.paint(()=>{ g.arc(cx,headCy,headR,0,TAU); }, tone, 4);
  // floppy shepherd's cap (dome + brim)
  pen.paint(()=>{
    g.moveTo(cx-headR*1.15, headCy-headR*0.35);
    g.quadraticCurveTo(cx, headCy-headR*2.1, cx+headR*1.15, headCy-headR*0.35);
    g.quadraticCurveTo(cx+headR*0.4, headCy-headR*0.7, cx, headCy-headR*0.72);
    g.quadraticCurveTo(cx-headR*0.4, headCy-headR*0.7, cx-headR*1.15, headCy-headR*0.35);
    g.closePath();
  }, toneSolid(inkLevel(7)), 3);
  // brim
  pen.ink(()=>{ g.moveTo(cx-headR*1.3, headCy-headR*0.28); g.lineTo(cx+headR*1.3, headCy-headR*0.28); }, 3);

  // identity token on the chest (paper-light so it reads on the dark body)
  identityMark(g, cx, heartY, h*0.05, inkLevel(1));
  g.restore();
  return { crown:{x:cx,y:crownY}, heart:{x:cx,y:heartY} };
}

/* ---- TARGET: the tall RADIANT ARMORED GODDESS — crested helm, breastplate,
   plated skirt, round shield, upright spear. Solidifies + radiates as t rises.
   Returns her crown + head-centre + heart. ---- */
function drawGoddess(pen,g,W,H,alpha){
  const gy=H*params.ground, cx=W*params.target.x, h=H*params.goddessH;
  const topY=gy-h, tone=toneSolid(inkLevel(7));
  const headR=h*0.078, headCy=topY+h*0.135;
  const shoulderY=topY+h*0.24, waistY=topY+h*0.50;
  const shW=h*0.24, waistW=h*0.15, skW=h*0.30;
  const heartY=shoulderY+h*0.10, crownY=headCy-headR;
  if (alpha<=0.02) return { crown:{x:cx,y:crownY}, head:{x:cx,y:headCy}, heart:{x:cx,y:heartY} };
  g.save(); g.globalAlpha=alpha;

  // upright SPEAR (behind body), taller than she is, with a leaf blade
  const spx=cx+shW*1.25;
  pen.limb(()=>{ g.moveTo(spx, gy); g.lineTo(spx, topY-h*0.10); }, toneSolid(inkLevel(6)), h*0.018);
  pen.paint(()=>{
    g.moveTo(spx, topY-h*0.19);
    g.quadraticCurveTo(spx+h*0.028, topY-h*0.13, spx, topY-h*0.075);
    g.quadraticCurveTo(spx-h*0.028, topY-h*0.13, spx, topY-h*0.19);
    g.closePath();
  }, toneSolid(inkLevel(7)), 3);

  // plated SKIRT (waist -> feet) with vertical plate seams
  pen.paint(()=>{
    g.moveTo(cx-waistW*0.8, waistY);
    g.lineTo(cx+waistW*0.8, waistY);
    g.lineTo(cx+skW*0.6, gy);
    g.lineTo(cx-skW*0.6, gy);
    g.closePath();
  }, tone, 4);
  g.save(); g.strokeStyle=INK; g.lineWidth=2.4; g.globalAlpha=alpha;
  for(let i=-2;i<=2;i++){
    const fx=cx+i*skW*0.22;
    g.beginPath(); g.moveTo(cx+i*waistW*0.30, waistY+h*0.01); g.lineTo(fx, gy); g.stroke();
  }
  g.restore();

  // breastplate TORSO (shoulders -> waist)
  pen.paint(()=>{
    g.moveTo(cx-shW*0.5, shoulderY);
    g.lineTo(cx+shW*0.5, shoulderY);
    g.lineTo(cx+waistW*0.7, waistY);
    g.lineTo(cx-waistW*0.7, waistY);
    g.closePath();
  }, tone, 4);
  // aegis breastplate seams (V neck + chest ridge)
  pen.seam(()=>{ g.moveTo(cx-shW*0.32,shoulderY+h*0.01); g.lineTo(cx,heartY+h*0.02); g.lineTo(cx+shW*0.32,shoulderY+h*0.01); }, 3);

  // flat shoulder pauldrons (armor caps, not hands)
  pen.paint(()=>{ g.ellipse(cx-shW*0.46, shoulderY+h*0.004, shW*0.22, h*0.022, 0, 0, TAU); }, toneSolid(inkLevel(6)), 3);
  pen.paint(()=>{ g.ellipse(cx+shW*0.46, shoulderY+h*0.004, shW*0.22, h*0.022, 0, 0, TAU); }, toneSolid(inkLevel(6)), 3);

  // round SHIELD held in front at her left, over the skirt (clears the corridor)
  const shr=h*0.088, shdx=cx-shW*0.58, shdy=waistY+h*0.20;
  pen.paint(()=>{ g.arc(shdx, shdy, shr, 0, TAU); }, toneSolid(inkLevel(6)), 4);
  pen.seam(()=>{ g.arc(shdx, shdy, shr*0.66, 0, TAU); }, 2.5);
  pen.paint(()=>{ g.arc(shdx, shdy, shr*0.26, 0, TAU); }, toneSolid(inkLevel(7)), 3); // boss

  // neck + head
  pen.limb(()=>{ g.moveTo(cx,shoulderY); g.lineTo(cx,headCy+headR*0.5); }, toneSolid(inkLevel(6)), h*0.04);
  pen.paint(()=>{ g.arc(cx,headCy,headR,0,TAU); }, tone, 4);
  // crested HELM: dome cap over the head + a swept crest plume
  pen.paint(()=>{
    g.moveTo(cx-headR*1.05, headCy-headR*0.1);
    g.quadraticCurveTo(cx, headCy-headR*2.0, cx+headR*1.05, headCy-headR*0.1);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // crest plume sweeping up and back
  pen.paint(()=>{
    g.moveTo(cx-headR*0.2, headCy-headR*1.5);
    g.quadraticCurveTo(cx-headR*0.2, headCy-headR*3.0, cx-headR*1.9, headCy-headR*2.4);
    g.quadraticCurveTo(cx-headR*0.7, headCy-headR*2.1, cx+headR*0.2, headCy-headR*1.35);
    g.closePath();
  }, toneSolid(inkLevel(7)), 3);
  // nose-guard hint
  pen.seam(()=>{ g.moveTo(cx, headCy-headR*0.2); g.lineTo(cx, headCy+headR*0.7); }, 2.5);

  // identity token on the chest — the SAME mark the shepherd wore
  identityMark(g, cx, heartY, h*0.032, inkLevel(1));
  g.restore();
  return { crown:{x:cx,y:crownY}, head:{x:cx,y:headCy}, heart:{x:cx,y:heartY} };
}

/* ---- IDENTITY LINK: a dotted arc joining the two hearts with a shared token at
   its apex — the proof that the canonical identity is unchanged by the morph. ---- */
function drawIdentityLink(pen,g,W,H,a,b){
  // a low dotted tie between the two hearts, dipping BELOW them (clear of the
  // diagonal growth arrow above), with the shared token ringed at its apex.
  const mx=(a.x+b.x)/2, my=Math.max(a.y,b.y)+H*0.055;
  g.save(); g.strokeStyle=inkLevel(4); g.lineWidth=2; g.setLineDash([H*0.010,H*0.012]); g.globalAlpha=0.8;
  g.beginPath();
  g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my, b.x,b.y); g.stroke();
  g.setLineDash([]); g.restore();
  // shared token at the apex, ringed
  identityMark(g, mx, my, H*0.016, inkLevel(6));
  g.save(); g.strokeStyle=inkLevel(5); g.lineWidth=2;
  g.beginPath(); g.arc(mx, my, H*0.026, 0, TAU); g.stroke(); g.restore();
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.6);
  const te=smooth(t);
  const rad=(st.radiance ?? params.radiance)*te;
  const layers=st.layers || ["ground","field","light","shepherd","goddess","identity"];
  const has=l=>layers.includes(l);

  // morph fades: source becomes a ghost, target solidifies
  const shepAlpha=lerp(1.0, 0.26, te);
  const godAlpha =lerp(0.30, 1.0, te);

  // goddess head centre (for the halo) — precompute from geometry
  const gy=H*params.ground, gcx=W*params.target.x, gh=H*params.goddessH;
  const gHeadCy=(gy-gh)+gh*0.135;

  if (has("ground"))   drawGround(pen,g,W,H);
  if (has("field"))    drawGrowthField(pen,g,W,H,te);
  if (has("light"))    drawRisingLight(pen,g,W,H,gcx,gHeadCy,rad,t);
  const shep=has("shepherd") ? drawShepherd(pen,g,W,H,shepAlpha)
                             : { heart:{x:W*params.source.x,y:gy-H*params.shepherdH*0.5} };
  const god =has("goddess")  ? drawGoddess(pen,g,W,H,godAlpha)
                             : { heart:{x:gcx,y:gy-gh*0.5} };
  if (has("identity")) drawIdentityLink(pen,g,W,H,shep.heart,god.heart);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.shepherd-to-goddess-transformation",
  type:"DIVINE_FX",
  name:"Shepherd-to-goddess transformation",
  statusWord:"REVEALED",
  scene:"OD-B13-S03",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["ground","field","light","shepherd","goddess","identity"],
  // normalized 0..1 source / target / field / consequence / camera anchors
  anchors:{
    "source:shepherd":{ x:0.245, y:0.865 },  // the shepherd disguise (source)
    "target:goddess":{  x:0.720, y:0.865 },  // the revealed goddess (target)
    "field:arrow":{     x:0.485, y:0.560 },  // the growth-arrow corridor (field)
    "light:halo":{      x:0.720, y:0.400 },  // the rising-light halo centre
    "identity:link":{   x:0.480, y:0.470 },  // the identity token apex (consequence)
    "camera:wide":{     x:0.500, y:0.520 },
  },
  // the transition corridor + the two standing spots
  zones:{ corridor:{ x0:0.34, y0:0.20, x1:0.66, y1:0.86 },
          stand:{    x0:0.14, y0:0.80, x1:0.90, y1:0.94 } },
  // DIVINE_FX transformation states over t (costume/scale/posture/light)
  states:{
    initial:"revealed",
    nodes:{
      // shepherd: the disguise still solid, goddess a faint outline
      shepherd:{ preview:{ t:0.10, radiance:0.9, status:"SHEPHERD",  progress:0.10 } },
      // transforming: both half, light rising, arrow half-drawn
      transforming:{ preview:{ t:0.50, radiance:1.0, status:"CHANGING", progress:0.50 } },
      // revealed: the tall armored goddess solid and radiant, shepherd a ghost
      revealed:{ preview:{ t:0.85, radiance:1.1, status:"REVEALED",  progress:0.85 } },
    },
    edges:[["shepherd","transforming"],["transforming","revealed"]],
  },
  duration:4.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","radiance"],

  // neutral preview: mid-late morph — goddess solidifying + radiant, shepherd a
  // ghost, growth arrow well up the ruler, identity link joining both hearts.
  preview:()=>({ t:0.68, radiance:1.05, status:"REVEALED", progress:0.68,
                 layers:["ground","field","light","shepherd","goddess","identity"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
