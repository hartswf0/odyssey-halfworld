/* ============================================================
   HALFWORLD ENGINE  ·  odyssey-halfworld
   The quality floor. Ported and modularized from the Halftrack
   native renderer in synthcine-halfworld-beflix-story-onboarding.html.

   Every asset in the atlas compiles against this. It provides:
     · the warm-paper / hard-contour / eight-level ordered-halftone look
     · the dot-matrix POST pass (GRID / MESH) that unifies every asset
     · drawing primitives (paint / limb / ink / seam) + tone factories
     · a parametric articulated figure rig for CHARACTER / CREATURE assets
     · the reference-style asset "card" frame (LABEL + STATUS + meter)
     · renderAsset(): offscreen draw -> dotify -> card, in one call

   Browser ESM. Runs in the viewer and under Playwright for headless PNG.
   ============================================================ */

/* ---------------- palette + math ---------------- */
export const PAPER   = "#f4f4f0";   // warm off-white field
export const PAPER2  = "#fdfdfa";   // post-pass field (slightly brighter)
export const INK     = "#141414";   // hard black structural contour
export const DIM     = "#8a8a86";
export const ACCENT  = "#0033cc";   // the single blue mark in the references
export const LW      = 4;           // default contour weight

export const clamp = (v,a,b)=> v<a?a:(v>b?b:v);
export const clamp01 = x => clamp(x,0,1);
export const lerp  = (a,b,t)=> a+(b-a)*t;
export const smooth= t => { t=clamp(t,0,1); return t*t*(3-2*t); };
export const rnd   = (seed)=>{ // deterministic 0..1 from an integer seed
  let s = (seed>>>0) || 1;
  return ()=>{ s ^= s<<13; s ^= s>>>17; s ^= s<<5; return ((s>>>0)%100000)/100000; };
};
const hex2 = n => n.toString(16).padStart(2,"0");
export function gray(v){ v=clamp(Math.round(v),0,255); const h=hex2(v); return "#"+h+h+h; }
/* eight quantized ink levels: 0 = paper, 7 = full ink */
export function inkLevel(l){ l=clamp(Math.round(l),0,7); return gray(Math.round(255 - l*255/7)); }
export function hexLum(hex){
  const n = parseInt(String(hex||"#808080").replace("#","").padEnd(6,"0").slice(0,6),16);
  return ((n>>16)*.299 + ((n>>8)&255)*.587 + (n&255)*.114)/255;
}
export function shade(hex,d){ // nudge a hex toward black(-)/white(+) by d (0..255)
  const n = parseInt(String(hex||"#808080").replace("#","").padEnd(6,"0").slice(0,6),16);
  const r=clamp((n>>16)+d,0,255),g=clamp(((n>>8)&255)+d,0,255),b=clamp((n&255)+d,0,255);
  return "#"+hex2(r)+hex2(g)+hex2(b);
}

/* ---------------- render pipelines ----------------
   Exactly the four families from the source renderer. The POST pass is
   what gives the atlas its dot-matrix identity. MESH is the default look
   in the reference cards (faint horizontal rules under the dots). */
export const RENDER_PIPELINES = {
  SHEET: { outline:true,  tones:"sheet", post:null },
  NOLINE:{ outline:false, tones:"clean", post:null },
  GRID:  { outline:true,  tones:"post",  post:{ cell:8, bg:"dots",  gain:1.0  } },
  MESH:  { outline:true,  tones:"post",  post:{ cell:5, bg:"lines", gain:1.05 } },
};

/* ---------------- tone factories ----------------
   A "tone" is {base, pat}. base is a solid fill; pat is an optional
   repeating ordered-dot pattern layered over it for the sheet look.
   Under the POST pipelines we draw flat grays (the dotify pass supplies
   the texture), so tones collapse to solids there. */
export function toneSolid(base){ return { base, pat:null }; }
export function toneDots(ctx, base, dotR, gap){
  const sz = Math.max(3, Math.round(gap));
  const c = document.createElement("canvas"); c.width=c.height=sz;
  const q = c.getContext("2d");
  q.fillStyle = "#1c1c1c"; q.beginPath(); q.arc(sz/2,sz/2,dotR,0,7); q.fill();
  return { base, pat: ctx.createPattern(c,"repeat") };
}
/* Build a full tone set for a body/asset given skin + garment colors and the
   active pipeline. Mirrors toneSet() in the source. */
export function toneSet(ctx, spec, toneName){
  const skin = spec.skin || "#e3e0d9";
  const sl   = hexLum(skin);
  const skinDot = .5 + (1-sl)*1.5;
  const postGray = Math.round(0x58 + sl*0x60);
  const postHex  = "#"+hex2(postGray)+hex2(postGray)+hex2(postGray);
  if (toneName === "post") return {
    skin: toneSolid(postHex), sweater: toneSolid("#2a2a2a"),
    pants: toneSolid("#3a3a3a"), shoe: toneSolid("#161616"),
  };
  if (toneName === "clean") return {
    skin: toneDots(ctx, shade(skin,-8), skinDot*1.05, 4),
    sweater: toneDots(ctx, shade(spec.shirt||"#c8c8c1",-16), 1.20, 4),
    pants: toneDots(ctx, "#b4b4ad", 1.35, 4), shoe: toneDots(ctx, "#9d9d96", 1.45, 3.4),
  };
  return { // sheet
    skin: toneDots(ctx, skin, skinDot, 4),
    sweater: toneDots(ctx, spec.shirt||"#c8c8c1", 1.10, 4),
    pants: toneDots(ctx, "#ccccc6", 1.25, 4), shoe: toneDots(ctx, "#c2c2bc", 1.35, 3.4),
  };
}

/* ---------------- primitives ----------------
   These take a live ctx + a STYLE flag object {outline}. Assets receive a
   ready-made `pen` bound to their ctx via makePen() so they never juggle STYLE. */
export function makePen(ctx, style={outline:true}){
  const S = { outline: style.outline !== false };
  function paint(pathFn, tone, lw=LW){
    ctx.beginPath(); pathFn();
    ctx.fillStyle = tone.base; ctx.fill();
    if (tone.pat){ ctx.fillStyle = tone.pat; ctx.fill(); }
    if (S.outline){ ctx.strokeStyle=INK; ctx.lineWidth=lw; ctx.lineJoin="round"; ctx.stroke(); }
  }
  function limb(pathFn, tone, lw){
    ctx.lineCap="round"; ctx.lineJoin="round";
    if (S.outline){ ctx.strokeStyle=INK; ctx.lineWidth=lw+LW*1.9; ctx.beginPath(); pathFn(); ctx.stroke(); }
    ctx.strokeStyle=tone.base; ctx.lineWidth=lw; ctx.beginPath(); pathFn(); ctx.stroke();
    if (tone.pat){ ctx.strokeStyle=tone.pat; ctx.lineWidth=lw; ctx.beginPath(); pathFn(); ctx.stroke(); }
  }
  function ink(pathFn, lw=3){
    ctx.strokeStyle=INK; ctx.lineWidth=lw; ctx.lineCap="round"; ctx.lineJoin="round";
    ctx.beginPath(); pathFn(); ctx.stroke();
  }
  function seam(pathFn, lw=3){ if (S.outline) ink(pathFn, lw); }
  function fillPath(pathFn, color){ ctx.beginPath(); pathFn(); ctx.fillStyle=color; ctx.fill(); }
  return { ctx, S, paint, limb, ink, seam, fillPath, toneSolid,
           toneDots:(b,r,g)=>toneDots(ctx,b,r,g), toneSet:(spec,tn)=>toneSet(ctx,spec,tn) };
}

/* ---------------- POST pass: the dot-matrix identity ----------------
   Ported verbatim in behavior from dotifyField(). Samples a solid-tone
   source and stamps dots by darkness, over a faint background field. */
export function containRect(SW,SH,CW,CH){
  const s=Math.min(CW/SW,CH/SH); return { s, ox:(CW-SW*s)/2, oy:(CH-SH*s)/2, w:SW*s, h:SH*s };
}
export function directField(g, source, CW, CH){
  const r=containRect(source.width,source.height,CW,CH);
  g.save(); g.globalAlpha=1; g.setTransform(1,0,0,1,0,0);
  g.fillStyle=PAPER2; g.fillRect(0,0,CW,CH);
  g.imageSmoothingEnabled=true; g.imageSmoothingQuality="high";
  g.drawImage(source,0,0,source.width,source.height,r.ox,r.oy,r.w,r.h); g.restore();
}
export function dotifyField(g, src, SW, SH, CW, CH, post, DPR=1, big=false){
  const r=containRect(SW,SH,CW,CH), cell=Math.max(3, post.cell*DPR*(big?.82:.68));
  g.save(); g.globalAlpha=1; g.setTransform(1,0,0,1,0,0);
  g.fillStyle=PAPER2; g.fillRect(0,0,CW,CH);
  if (post.bg==="lines"){
    g.strokeStyle="rgba(0,0,0,.08)"; g.lineWidth=Math.max(1,DPR*.55); g.beginPath();
    for(let y=cell*.45;y<CH;y+=Math.max(3,cell*.72)){ g.moveTo(0,y); g.lineTo(CW,y); } g.stroke();
  } else {
    g.fillStyle="rgba(0,0,0,.10)";
    for(let y=cell/2;y<CH;y+=cell) for(let x=cell/2;x<CW;x+=cell){ g.beginPath(); g.arc(x,y,Math.max(.65,DPR*.45),0,7); g.fill(); }
  }
  g.fillStyle="#0a0a0a";
  const x0=Math.max(cell/2,r.ox+cell/2), x1=Math.min(CW,r.ox+r.w-cell/2);
  const y0=Math.max(cell/2,r.oy+cell/2), y1=Math.min(CH,r.oy+r.h-cell/2);
  for(let y=y0;y<=y1;y+=cell){
    const sy=Math.max(0,Math.min(SH-1,Math.floor((y-r.oy)/r.s)));
    for(let x=x0;x<=x1;x+=cell){
      const sx=Math.max(0,Math.min(SW-1,Math.floor((x-r.ox)/r.s))), i=(sy*SW+sx)*4;
      const lum=(src[i]*.299+src[i+1]*.587+src[i+2]*.114)/255, d=1-lum; if(d<.10) continue;
      g.beginPath(); g.arc(x,y,Math.pow(d,.9)*cell*.62*post.gain,0,7); g.fill();
    }
  }
  g.restore();
}
export function compositePipeline(g, source, sourceCtx, CW, CH, pipeline, DPR=1, big=false){
  if (!pipeline.post){ directField(g, source, CW, CH); return; }
  const img = sourceCtx.getImageData(0,0,source.width,source.height).data;
  dotifyField(g, img, source.width, source.height, CW, CH, pipeline.post, DPR, big);
}

/* ---------------- the reference "card" frame ----------------
   Matches the object cards in the reference images: thin outer frame,
   LABEL top-left in letterspaced caps, a blue mark top-right, a STATUS
   word bottom-left with a progress meter. Drawn AFTER the dotify pass in
   screen space (not dotified) so text stays crisp. */
export function drawCard(g, CW, CH, { label="", status="", progress=0.15, DPR=1 }={}){
  g.save(); g.setTransform(1,0,0,1,0,0);
  const pad = 10*DPR, fw = Math.max(2,DPR*2);
  // outer frame
  g.strokeStyle=INK; g.lineWidth=fw; g.strokeRect(pad, pad, CW-pad*2, CH-pad*2);
  // label
  if (label){
    g.fillStyle=INK; g.textBaseline="alphabetic";
    g.font=`800 ${Math.round(13*DPR)}px Helvetica,Arial,sans-serif`;
    g.save(); g.translate(pad+12*DPR, pad+22*DPR);
    drawTracked(g, label.toUpperCase(), 2.2*DPR); g.restore();
  }
  // blue mark
  g.fillStyle=ACCENT; g.fillRect(CW-pad-16*DPR, pad+8*DPR, 9*DPR, 9*DPR);
  // status + meter
  if (status){
    g.fillStyle=ACCENT; g.font=`800 ${Math.round(11*DPR)}px Helvetica,Arial,sans-serif`;
    g.save(); g.translate(pad+12*DPR, CH-pad-16*DPR); drawTracked(g, status.toUpperCase(), 2*DPR); g.restore();
    const mx=pad+12*DPR, my=CH-pad-8*DPR, mw=CW-pad*2-24*DPR;
    g.fillStyle="#d9d9d4"; g.fillRect(mx,my,mw,3*DPR);
    g.fillStyle=ACCENT; g.fillRect(mx,my,mw*clamp01(progress),3*DPR);
  }
  g.restore();
}
function drawTracked(g, text, track){ // letterspaced text at current origin
  let x=0; for(const ch of text){ g.fillText(ch, x, 0); x += g.measureText(ch).width + track; }
}

/* ============================================================
   PARAMETRIC ARTICULATED FIGURE RIG
   For CHARACTER and CREATURE assets. The real HALFTRACK hero rig lives in
   figure-hero.mjs (matrix skeleton, 60-pose library, fingered hands, spring
   animation). makeFigure() is a thin adapter so asset modules get the full
   rig by default; the sketch rig below (makeSketchFigure) is retained only
   as a fallback.
   ============================================================ */
import { makeHeroFigure, POSES as HERO_POSES, POSE_IDS, POSE_ALIAS } from "./figure-hero.mjs";
export { HERO_POSES, POSE_IDS, POSE_ALIAS };

export function makeFigure(spec={}){
  // map the legacy figure spec onto the hero spec
  const hero = makeHeroFigure({
    skin: spec.skin, garment: spec.garment || "tunic",
    hairColor: spec.hairColor || (spec.hair==="gray"?"#8a8a84":"#1d1d1d"),
    hair: spec.hair, beard: !!spec.beard, glasses: !!spec.glasses,
    cloak: !!spec.cloak, bareLegs: spec.bareLegs, scale: spec.scale || 1.0,
  });
  return {
    spec,
    draw(ctx, W, H, state={}){
      // legacy `band` maps to a neutral pose direction if no pose given
      const st = { ...state };
      if (!st.pose && st.band) st.pose = st.band;
      return hero.draw(ctx, W, H, st);
    },
    hero,
  };
}

const norm = v => { const n=Math.hypot(v.x,v.y)||1; return {x:v.x/n,y:v.y/n}; };

export const FIGURE_DEFAULTS = {
  skin:"#e3e0d9", shirt:"#c8c8c1",
  h:1.0, build:1.0, headS:1.0,          // height, build mass, head scale
  hair:"short", beard:false, glasses:false,
  browW:1.0, eyeS:1.0, mouthW:1.0,
  garment:"tunic",                       // tunic | robe | cloak | armor | dress | bare
  band:"front",                          // front | threeq | profile | back
};

/* metrics from height/build, mirrors mkMetrics() */
function figureMetrics(W,H,spec){
  const hs=spec.h, bs=spec.build, groundY=H*.94;
  const ry=H*.118*spec.headS*hs, rx=ry*.82, baseR=H*.118*.82;
  return {
    W,H,groundY, hipY:groundY-H*.275*hs, shoulderY:groundY-H*.485*hs, rx, ry,
    shw:baseR*2*1.42*hs*bs, hipW:baseR*2*.72*hs*bs,
    L1:H*.115*hs, L2:H*.105*hs, LT:H*.130*hs, LS:H*.125*hs,
    handLen:H*.045*hs*(.5+.5*bs),
  };
}
const BANDF = { front:0, threeq:0.7, profile:1.15, back:1.6 };

export function makeSketchFigure(spec={}){
  spec = { ...FIGURE_DEFAULTS, ...spec };
  return {
    spec,
    /* draw the figure in SOLID tones + contour onto an offscreen ctx sized W×H.
       state: { pose, gaze:{x,y}, mouth, t } */
    draw(ctx, W, H, state={}){
      const pen = makePen(ctx, {outline:true});
      const M = figureMetrics(W,H,spec);
      const F = BANDF[spec.band] ?? 0;
      const bd = spec.band;
      const dir = 1;
      const T = state.t||0;
      const tones = toneSet(ctx, { skin:spec.skin, shirt:spec.shirt }, "post");
      const cx = W/2;
      const sq = bd==="front"?1 : bd==="threeq"?0.84 : bd==="profile"?0.58 : 1;
      const shwE=M.shw*sq, hipWE=M.hipW*(0.55+0.45*sq);

      // ground shadow
      ctx.fillStyle="rgba(0,0,0,0.08)";
      ctx.beginPath(); ctx.ellipse(cx,M.groundY+5,M.hipW*1.6,M.hipW*0.20,0,0,7); ctx.fill();

      const breath = Math.sin(T*1.2)*2;
      const HJL={x:cx-hipWE/2,y:M.hipY}, HJR={x:cx+hipWE/2,y:M.hipY};
      const AJL={x:cx-shwE/2,y:M.shoulderY+breath*.3}, AJR={x:cx+shwE/2,y:M.shoulderY+breath*.3};

      // legs
      drawLeg(pen,M,tones,HJL,-1,state);
      drawLeg(pen,M,tones,HJR, 1,state);
      // torso
      drawTorso(pen,M,tones,cx,shwE,hipWE,breath,spec);
      // far arm (behind torso for depth)
      drawArm(pen,M,tones,AJL,-1,state,spec);
      // neck + head + face
      const head = drawNeckHead(pen,M,tones,cx,shwE,breath,spec,state,F,dir);
      // near arm
      drawArm(pen,M,tones,AJR, 1,state,spec);
      return { anchors: head.anchors, ground:M.groundY };
    },
  };
}

function garmentColor(spec){
  switch(spec.garment){
    case "robe": return "#3a3a3a";
    case "cloak": return "#242424";
    case "armor": return "#4a4a44";
    case "dress": return "#333";
    case "bare": return spec.skin;
    default: return "#2a2a2a"; // tunic
  }
}
function drawTorso(pen,M,tones,cx,shwE,hipWE,breath,spec){
  const gt = toneSolid(garmentColor(spec));
  const sy=M.shoulderY+breath*.3, hy=M.hipY;
  pen.paint(()=>{
    pen.ctx.moveTo(cx-shwE/2, sy);
    pen.ctx.lineTo(cx+shwE/2, sy);
    pen.ctx.lineTo(cx+hipWE/2, hy);
    pen.ctx.lineTo(cx-hipWE/2, hy);
    pen.ctx.closePath();
  }, spec.garment==="bare"?tones.skin:gt, LW);
  // belt / hem seam
  pen.seam(()=>{ pen.ctx.moveTo(cx-hipWE/2,hy-2); pen.ctx.lineTo(cx+hipWE/2,hy-2); }, 3);
}
function drawArm(pen,M,tones,AJ,side,state,spec){
  const sway=Math.sin((state.t||0)+(side<0?0:2.1))*.03;
  const pose = state.pose||"neutral";
  let d1={x:side*.14+sway,y:.99}, d2={x:side*.04,y:1};
  if (pose==="open-palm"||pose==="gesture"){ d1={x:side*.55,y:.5}; d2={x:side*.5,y:-.2}; }
  else if (pose==="raise"||pose==="hail"){ d1={x:side*.35,y:-.6}; d2={x:side*.2,y:-1}; }
  else if (pose==="reach"){ d1={x:side*.7,y:.3}; d2={x:side*.8,y:.1}; }
  else if (pose==="cross"){ d1={x:side*.3,y:.7}; d2={x:-side*.5,y:.3}; }
  d1=norm(d1); d2=norm(d2);
  const el={x:AJ.x+d1.x*M.L1,y:AJ.y+d1.y*M.L1};
  const wr={x:el.x+d2.x*M.L2,y:el.y+d2.y*M.L2};
  const sleeve = toneSolid(garmentColor(spec));
  pen.limb(()=>{ pen.ctx.moveTo(AJ.x,AJ.y); pen.ctx.lineTo(el.x,el.y); }, spec.garment==="bare"?tones.skin:sleeve, M.shw*.20);
  pen.limb(()=>{ pen.ctx.moveTo(el.x,el.y); pen.ctx.lineTo(wr.x,wr.y); }, tones.skin, M.shw*.15);
  // hand
  pen.paint(()=>{ pen.ctx.arc(wr.x,wr.y,M.handLen*.7,0,7); }, tones.skin, LW*.8);
  return {el,wr};
}
function drawLeg(pen,M,tones,HJ,side,state){
  const pose=state.pose||"neutral";
  let d1={x:side*.05,y:1}, d2={x:0,y:1};
  if (pose==="walk"||pose==="stride"){ const ph=(state.t||0)*3+(side<0?Math.PI:0); d1={x:.4*Math.sin(ph),y:1}; d2={x:.2*Math.sin(ph-.5),y:1}; }
  else if (pose==="kneel"&&side<0){ d1={x:-.5,y:.7}; d2={x:-.7,y:.4}; }
  d1=norm(d1); d2=norm(d2);
  const k={x:HJ.x+d1.x*M.LT,y:HJ.y+d1.y*M.LT};
  const a={x:k.x+d2.x*M.LS,y:k.y+d2.y*M.LS};
  const pants=toneSolid("#3a3a3a");
  pen.limb(()=>{ pen.ctx.moveTo(HJ.x,HJ.y); pen.ctx.lineTo(k.x,k.y); }, pants, M.hipW*.28);
  pen.limb(()=>{ pen.ctx.moveTo(k.x,k.y); pen.ctx.lineTo(a.x,a.y); }, pants, M.hipW*.22);
  // sandal/shoe
  pen.paint(()=>{ pen.ctx.ellipse(a.x+side*M.handLen*.3,a.y,M.handLen*1.1,M.handLen*.5,0,0,7); }, toneSolid("#161616"), LW*.8);
}
function drawNeckHead(pen,M,tones,cx,shwE,breath,spec,state,F,dir){
  const neckY=M.shoulderY+breath*.3;
  const headCy=neckY - M.ry*1.15;
  const rx=M.rx, ry=M.ry;
  // neck
  pen.limb(()=>{ pen.ctx.moveTo(cx,neckY); pen.ctx.lineTo(cx,headCy+ry*.7); }, tones.skin, M.shw*.16);
  // hair back layer
  if (spec.hair && spec.hair!=="none") drawHairBack(pen,cx,headCy,rx,ry,spec);
  // head
  pen.paint(()=>{ pen.ctx.ellipse(cx,headCy,rx,ry,0,0,7); }, tones.skin, LW);
  // face (front / threeq only shows two eyes; profile one)
  drawFace(pen,cx,headCy,rx,ry,spec,state,F);
  if (spec.hair && spec.hair!=="none") drawHairFront(pen,cx,headCy,rx,ry,spec);
  if (spec.beard) drawBeard(pen,cx,headCy,rx,ry);
  if (spec.glasses) drawGlasses(pen,cx,headCy,rx,ry);
  return { anchors:{ head:{x:cx,y:headCy}, neck:{x:cx,y:neckY}, crown:{x:cx,y:headCy-ry} } };
}
function drawFace(pen,cx,cy,rx,ry,spec,state,F){
  const g=pen.ctx;
  const gaze=state.gaze||{x:0,y:0};
  const eyeY=cy - ry*.08;
  const eyeDX=rx*.42*spec.eyeS;
  const profile = F>=1.15;
  const showL = !profile, showR = true;
  g.fillStyle=INK;
  const eye=(ex)=>{ g.beginPath(); g.ellipse(ex+gaze.x*rx*.12, eyeY+gaze.y*ry*.1, rx*.09*spec.eyeS, ry*.07*spec.eyeS, 0,0,7); g.fill(); };
  if (showL) eye(cx-eyeDX);
  if (showR) eye(cx+eyeDX*(profile?.2:1));
  // brows
  g.strokeStyle=INK; g.lineWidth=Math.max(2, rx*.06*spec.browW); g.lineCap="round";
  const brow=(ex,dir)=>{ g.beginPath(); g.moveTo(ex-rx*.11,eyeY-ry*.22); g.lineTo(ex+rx*.11,eyeY-ry*.24); g.stroke(); };
  if (showL) brow(cx-eyeDX);
  if (showR) brow(cx+eyeDX*(profile?.2:1));
  // nose
  g.strokeStyle=INK; g.lineWidth=Math.max(2,rx*.05); g.beginPath();
  g.moveTo(cx+(profile?rx*.5:0), eyeY+ry*.05); g.lineTo(cx+(profile?rx*.62:rx*.06), eyeY+ry*.3); g.stroke();
  // mouth
  const mo=state.mouth||0;
  g.beginPath(); g.lineWidth=Math.max(2,rx*.06);
  g.moveTo(cx-rx*.22*spec.mouthW, cy+ry*.42);
  g.quadraticCurveTo(cx, cy+ry*.42+mo*ry*.12+ry*.05, cx+rx*.22*spec.mouthW, cy+ry*.42);
  g.stroke();
}
function drawHairBack(pen,cx,cy,rx,ry,spec){
  const t=toneSolid("#1a1a1a");
  if (spec.hair==="long"||spec.hair==="robe"){
    pen.paint(()=>{ pen.ctx.ellipse(cx,cy+ry*.3,rx*1.15,ry*1.35,0,0,7); }, t, LW);
  }
}
function drawHairFront(pen,cx,cy,rx,ry,spec){
  const t=toneSolid("#1a1a1a"); const g=pen.ctx;
  if (spec.hair==="ring"){ // bald ring — no crown hair
    pen.paint(()=>{ g.ellipse(cx,cy+ry*.55,rx*1.02,ry*.5,0,Math.PI*.05,Math.PI-.05); }, t, LW);
    return;
  }
  // generic cap of hair over the crown
  pen.paint(()=>{
    g.moveTo(cx-rx*1.02, cy);
    g.quadraticCurveTo(cx, cy-ry*1.5, cx+rx*1.02, cy);
    g.quadraticCurveTo(cx+rx*.7, cy-ry*.55, cx, cy-ry*.5);
    g.quadraticCurveTo(cx-rx*.7, cy-ry*.55, cx-rx*1.02, cy);
  }, t, LW);
  if (spec.hair==="curly"){ g.fillStyle="#1a1a1a";
    for(let i=-2;i<=2;i++){ g.beginPath(); g.arc(cx+i*rx*.4, cy-ry*.4, rx*.28,0,7); g.fill(); } }
}
function drawBeard(pen,cx,cy,rx,ry){
  pen.paint(()=>{
    pen.ctx.moveTo(cx-rx*.75, cy+ry*.15);
    pen.ctx.quadraticCurveTo(cx, cy+ry*1.25, cx+rx*.75, cy+ry*.15);
    pen.ctx.quadraticCurveTo(cx, cy+ry*.6, cx-rx*.75, cy+ry*.15);
  }, toneSolid("#1a1a1a"), LW);
}
function drawGlasses(pen,cx,cy,rx,ry){
  const g=pen.ctx; const eyeY=cy-ry*.08, eyeDX=rx*.42;
  g.strokeStyle=INK; g.lineWidth=Math.max(2,rx*.05);
  g.beginPath(); g.ellipse(cx-eyeDX,eyeY,rx*.2,ry*.16,0,0,7); g.stroke();
  g.beginPath(); g.ellipse(cx+eyeDX,eyeY,rx*.2,ry*.16,0,0,7); g.stroke();
  g.beginPath(); g.moveTo(cx-eyeDX+rx*.2,eyeY); g.lineTo(cx+eyeDX-rx*.2,eyeY); g.stroke();
}

/* ============================================================
   renderAsset — the one call the render harness + viewer use.
   Draws an asset module's draw() into an offscreen buffer, runs the
   active pipeline's POST pass onto the visible canvas, then the card.
   `mod` is an asset module satisfying the contract (see asset-contract.mjs).
   ============================================================ */
export function renderAsset(cv, mod, {
  pipeline="MESH", state, big=true, DPR=1, card=true, srcW=660, srcH=880,
}={}){
  const pipe = RENDER_PIPELINES[pipeline] || RENDER_PIPELINES.MESH;
  const g = cv.getContext("2d");
  const CW=cv.width, CH=cv.height;
  // offscreen source in solid tones + contour
  const off = document.createElement("canvas"); off.width=srcW; off.height=srcH;
  const og = off.getContext("2d", { willReadFrequently:true });
  og.fillStyle = "#ffffff"; og.fillRect(0,0,srcW,srcH);
  const st = state || (mod.preview ? mod.preview() : {});
  mod.draw(og, srcW, srcH, { ...st, pipeline: pipe });
  // post pass -> visible
  compositePipeline(g, off, og, CW, CH, pipe, DPR, big);
  // card frame (crisp, on top)
  if (card){
    drawCard(g, CW, CH, {
      label: mod.name || mod.id || "",
      status: (st && st.status) || mod.statusWord || (mod.type||"").replace(/_/g," "),
      progress: (st && st.progress) ?? 0.2, DPR,
    });
  }
  return cv;
}

/* ============================================================
   renderScene — compose a whole scene (multiple asset instances) onto one
   offscreen buffer in solid tones, then run the POST pass + a scene card
   over the FULL stage in one pass (so the whole scene shares one halftone).
   `scene.stage(offctx, srcW, srcH, t)` draws all cast assets in solid grays.
   ============================================================ */
export function renderScene(cv, scene, { pipeline="MESH", t=0, DPR=1, card=true, srcW=1120, srcH=760 }={}){
  const pipe = RENDER_PIPELINES[pipeline] || RENDER_PIPELINES.MESH;
  const g = cv.getContext("2d");
  const off = document.createElement("canvas"); off.width=srcW; off.height=srcH;
  const og = off.getContext("2d", { willReadFrequently:true });
  og.fillStyle="#ffffff"; og.fillRect(0,0,srcW,srcH);
  if (typeof scene.stage==="function") scene.stage(og, srcW, srcH, t);
  compositePipeline(g, off, og, cv.width, cv.height, pipe, DPR, true);
  if (card){
    drawCard(g, cv.width, cv.height, {
      label: scene.title || scene.id || "SCENE",
      status: scene.id || "", progress: scene.duration ? clamp01(t/scene.duration) : 0.2, DPR,
    });
  }
  return cv;
}

/* ---------------- dot-law keying ----------------
   The occlusion law: a pixel too light to ever print a dot (lum >= .895,
   dotifyField's own threshold) must not occlude what is behind it either.
   borderKey() flood-clears near-white paint connected to the canvas border,
   so an asset's background field disappears while interior whites (eyes,
   teeth, highlights enclosed by ink) stay solid. */
export function borderKey(kctx, w, h, thr=.895){
  const id = kctx.getImageData(0,0,w,h), d = id.data, N = w*h;
  const visited = new Uint8Array(N);
  const stack = new Int32Array(N); let sp = 0;
  const passable = i => {
    const a = d[i*4+3];
    if (a < 10) return 1;                       // unpainted: pass through
    const al = a/255;
    const lum = ((d[i*4]*.299 + d[i*4+1]*.587 + d[i*4+2]*.114)/255)*al + (1-al);
    return lum >= thr ? 2 : 0;                  // 2 = light paint: clear it
  };
  const push = i => { if (!visited[i]){ const p = passable(i); if (p){ visited[i]=1; if(p===2)d[i*4+3]=0; stack[sp++]=i; } else visited[i]=1; } };
  for (let x=0;x<w;x++){ push(x); push((h-1)*w+x); }
  for (let y=0;y<h;y++){ push(y*w); push(y*w+w-1); }
  while (sp>0){
    const i = stack[--sp], x = i%w, y = (i-x)/w;
    if (x>0) push(i-1);
    if (x<w-1) push(i+1);
    if (y>0) push(i-w);
    if (y<h-1) push(i+w);
  }
  kctx.putImageData(id,0,0);
}

/* keyedModuleCanvas — draw a module onto a transparent canvas and border-key
   it. Cached by a state signature so animated scenes stay realtime. */
const _keyCache = new Map();
export function keyedModuleCanvas(mod, w, h, state={}, sigExtra="", thr=.895, pad=0){
  w = Math.max(2, Math.round(w)); h = Math.max(2, Math.round(h));
  /* pad: bleed margin (fraction of w/h) so art that overshoots its box —
     staffs, raised arms, wings — is never truncated at the canvas edge.
     Callers draw at (x − pad·w, y − pad·h). */
  const px = Math.round(w*pad), py = Math.round(h*pad);
  const W2 = w + 2*px, H2 = h + 2*py;
  const sig = (mod.id||mod.name||"?")+"|"+w+"x"+h+"|"+(state.pose||"")+"|"+(state.band||"")
    +"|"+(state.mode||"")+"|"+(state.formation||"")+"|"+Math.round(((+state.t)||0)*4)+"|"+sigExtra+"|"+thr+"|"+pad;
  const hit = _keyCache.get(sig);
  if (hit) return hit;
  const cv = document.createElement("canvas"); cv.width=W2; cv.height=H2;
  const g = cv.getContext("2d", { willReadFrequently:true });
  g.save(); g.translate(px, py);
  try{ mod.draw(g, w, h, { ...(mod.preview?mod.preview():{}), ...state, card:false }); }catch(e){}
  g.restore();
  if (W2*H2 <= 1700*1300) borderKey(g, W2, H2, thr);
  if (_keyCache.size > 360){ let n=0; for (const k of _keyCache.keys()){ _keyCache.delete(k); if(++n>=120)break; } }
  _keyCache.set(sig, cv);
  return cv;
}

/* placeInstance — helper for scene stage(): draw one asset module into the
   stage offscreen at a normalized anchor {x,y} with a size fraction. Each
   asset draws in solid tone; the scene's single dotify pass unifies them.
   Instances are dot-law keyed so backgrounds never occlude as rectangles;
   pass state.key===false to restore opaque box behavior (full-bleed sets). */
export function placeInstance(offctx, srcW, srcH, assetMod, { anchor={x:.5,y:.5}, scale=0.5, state={} }={}){
  const w = srcW*scale, h = srcH*scale;
  const x = anchor.x*srcW - w/2, y = anchor.y*srcH - h;   // anchor at feet/base
  if (state && state.key === false || scale >= 0.98){
    // full-bleed set pieces keep their painted field
    offctx.save(); offctx.translate(x, y);
    offctx.beginPath(); offctx.rect(0,0,w,h); offctx.clip();
    assetMod.draw(offctx, w, h, { ...(assetMod.preview?assetMod.preview():{}), ...state, card:false });
    offctx.restore();
    return;
  }
  const keyed = keyedModuleCanvas(assetMod, w, h, state);
  offctx.drawImage(keyed, x, y);
}

/* ============================================================
   RESTAGE — the unified stage model.
   The collage problem: every asset paints its own world-fragment, so a
   composed scene stacks backgrounds on backgrounds and reads jumbled;
   frozen per-instance t makes it dead. makeRestage() rebuilds any scene
   from its declared cast[] + timeline[] on ONE ground plane:
     · only the LOCATION paints the field (the one true background)
     · every other instance is a dot-law-keyed cutout standing on a
       shared floor — depth from its anchor -> scale + foot line + shadow
     · live t flows into every figure (breath, blink, spring idle)
     · characters rotate through their OWN states.nodes on the beat when
       the timeline isn't directing them — everyone keeps performing
     · attention: while an op acts on an instance, everyone else's gaze
       turns toward it — the scene is directed, not a lineup
   ============================================================ */
/* inkBounds — render a module once at generous square size, key it, and
   measure the true bounding box of surviving ink. The measured aspect is the
   ONLY fair frame for an asset: type tables guess, this knows. Cached. */
const _boundsCache = new Map();
export function inkBounds(mod){
  const id = (mod && (mod.id || mod.name)) || "?";
  if (_boundsCache.has(id)) return _boundsCache.get(id);
  let out = null;
  try{
    const S = 520;
    const cvb = document.createElement("canvas"); cvb.width = S; cvb.height = S;
    const gb = cvb.getContext("2d", { willReadFrequently: true });
    mod.draw(gb, S, S, { ...(mod.preview ? mod.preview() : {}), card: false });
    borderKey(gb, S, S);
    const d = gb.getImageData(0, 0, S, S).data;
    let x0 = S, y0 = S, x1 = 0, y1 = 0, found = false;
    for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2){
      if (d[(y*S + x)*4 + 3] > 25){ found = true;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    out = found ? { x: x0/S, y: y0/S, w: (x1-x0+1)/S, h: (y1-y0+1)/S,
                    ar: (x1-x0+1)/(y1-y0+1) } : null;
  }catch(e){ out = null; }
  _boundsCache.set(id, out); return out;
}
/* measuredDims — standalone render dims matching the art's true aspect.
   base = the SHORT side; long side capped at base*2.4. */
export function measuredDims(mod, base = 380){
  const b = inkBounds(mod);
  const ar = b ? clamp(b.ar, 1/2.4, 2.4) : .75;
  return ar >= 1 ? [Math.round(base*ar), base] : [base, Math.round(base/ar)];
}

/* inkCutout — THE no-crop primitive. Modules recompose their art to
   whatever canvas shape they're given, so any fixed-aspect canvas can cut
   something off. Instead: draw the module ONCE at a generous square, key it,
   measure the true ink bounding box, and hand back the canvas + bbox. The
   caller blits exactly the ink — cropping becomes impossible by construction. */
const _cutCache = new Map();
export function inkCutout(mod, state = {}, sigExtra = "", thr = .895){
  const S = 560;
  const sig = (mod.id||mod.name||"?")+"|CUT|"+(state.pose||"")+"|"+(state.band||"")
    +"|"+(state.mode||"")+"|"+Math.round(((+state.t)||0)*4)+"|"+sigExtra+"|"+thr;
  const hit = _cutCache.get(sig);
  if (hit) return hit;
  const cv = document.createElement("canvas"); cv.width = S; cv.height = S;
  const g = cv.getContext("2d", { willReadFrequently: true });
  try{ mod.draw(g, S, S, { ...(mod.preview ? mod.preview() : {}), ...state, card:false }); }catch(e){}
  borderKey(g, S, S, thr);
  const d = g.getImageData(0, 0, S, S).data;
  let x0 = S, y0 = S, x1 = 0, y1 = 0, found = false;
  for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2){
    if (d[(y*S + x)*4 + 3] > 25){ found = true;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  let out;
  if (!found) out = { cv, x:0, y:0, w:S, h:S, ar:1 };
  else {
    const m = Math.round(S*.025);
    x0 = Math.max(0, x0-m); y0 = Math.max(0, y0-m);
    x1 = Math.min(S-1, x1+m); y1 = Math.min(S-1, y1+m);
    out = { cv, x:x0, y:y0, w:x1-x0+1, h:y1-y0+1, ar:(x1-x0+1)/(y1-y0+1) };
  }
  if (_cutCache.size > 260){ let n=0; for (const k of _cutCache.keys()){ _cutCache.delete(k); if(++n>=90)break; } }
  _cutCache.set(sig, out);
  return out;
}

/* normStateNodes — the atlas carries two rig shapes: an array of
   {key, preview()} and an object map {name:{preview:{}}}. Normalize both to
   [{key, prev()}] so every front-end drives every character. */
export function normStateNodes(mod){
  const raw = mod && mod.states && mod.states.nodes;
  if(!raw) return [];
  if(Array.isArray(raw))
    return raw.map((n,i)=>({ key:(n&&(n.key||n.label))||("state-"+(i+1)),
      prev:()=> typeof n.preview==="function" ? (n.preview()||{}) : (n.preview||n||{}) }));
  return Object.entries(raw).map(([k,v])=>({ key:k,
    prev:()=> typeof (v||{}).preview==="function" ? (v.preview()||{}) : ((v||{}).preview||v||{}) }));
}

export function makeRestage(sceneMod, resolveMod, resolveType, initialOverrides){
  /* per-instance overrides — the arrange layer:
     { dx, dz (anchor shifts), scale (multiplier), blend (composite op),
       key (dot-law threshold), hidden } */
  const ov = Object.assign({}, initialOverrides || {});
  const ovOf = inst => ov[inst] || {};
  const dur = sceneMod.duration || 36;
  const beats = sceneMod.beats || [];
  const ops = (sceneMod.timeline||[]).filter(o=>o.op!=="timeline.capture")
    .slice().sort((a,b)=>a.at-b.at);
  const items = (sceneMod.cast||[]).map(c=>{
    const mod = resolveMod(c.asset);
    const type = (resolveType && resolveType(c.asset)) || c.asset.split(".")[0].replace(/-/g,"_");
    return mod ? { c, mod, type } : null;
  }).filter(Boolean);
  const loc = items.find(it=>it.type==="location")
    || items.find(it=>(it.c.scale||0)>=0.95);
  const actors = items.filter(it=>it!==loc);
  /* clones — duplicated instances live in the override store (__clones) */
  const clones = Array.isArray(ov.__clones) ? ov.__clones.slice() : [];
  function applyClone(cl){
    const src = actors.find(a=>a.c.instance===cl.src); if(!src) return;
    actors.push({ ...src, c:{ ...src.c, instance: cl.instance } });
  }
  clones.forEach(applyClone);
  /* how much horizontal room each type deserves — wide things stay whole */
  const ASPECT = { vehicle:1.5, set_piece:1.5, environment:1.65, location:1.6,
    ensemble:1.35, divine_fx:1.15, creature:1.15, sound_source:1.05, prop:.95, wearable:.9 };
  const seedOf = s => { let h=0; for(const ch of s) h=(h*31+ch.charCodeAt(0))|0; return (h>>>0)/4294967295; };
  const isFigure = it => /character|ensemble/.test(it.type);
  const opsFor = inst => ops.filter(o=>o.target===inst);

  function stateFor(it, t){
    let pose=it.c.pose, gaze=it.c.gaze, extra=null, sig="cast";
    for(const o of opsFor(it.c.instance)){
      if(o.at>t)break;
      if(o.args&&o.args.pose){pose=o.args.pose;sig="op:"+o.args.pose;}
      if(o.args&&o.args.gaze)gaze=o.args.gaze;
    }
    // undirected characters keep acting: their own state machine, on the beat
    const nodes = normStateNodes(it.mod);
    if(isFigure(it) && nodes.length>1 && !opsFor(it.c.instance).length){
      const beatN = Math.max(1,beats.length||4);
      const bi = Math.min(beatN-1, Math.floor(t/dur*beatN));
      const k = (Math.floor(seedOf(it.c.instance)*97)+bi) % nodes.length;
      const node = nodes[k];
      extra={...node.prev()}; if(extra.pose)pose=extra.pose; sig="node:"+node.key;
    }
    return { pose, gaze, extra, sig };
  }

  /* shared-floor placements — exposed so cameras can frame instances.
     Anti-crowding: cap sizes, keep margins, and relax overlaps so nothing
     stacks — the scene gets air instead of a pile. */
  function layout(W, H, t){
    const placed = actors.map(it=>{
      const o = ovOf(it.c.instance);
      if(o.hidden) return null;
      const ax=((it.c.anchor&&it.c.anchor.x)??.5)+(o.dx||0);
      const ay=((it.c.anchor&&it.c.anchor.y)??.8)+(o.dz||0);
      const sc=(it.c.scale??.4)*(o.scale||1);
      const d = clamp((ay-.42)/.58, .08, 1);            // authored feet-line -> depth
      const m = .60+.50*d;                              // near = bigger
      let h = H*sc*m*(isFigure(it)?1.08:.92);           // slightly smaller = more air
      h = Math.min(h, H*.92);
      let ar;
      if(it.type==="character") ar = 660/880;
      else { const b = inkBounds(it.mod);
             ar = b ? clamp(b.ar, .5, 2.4) : (ASPECT[it.type]||1); }
      let w = Math.min(h*ar, W*.88);
      const idle = isFigure(it) ? Math.sin(t*1.15+seedOf(it.c.instance)*6.28)*h*.007 : 0;
      return { it, d, w, h, instance:it.c.instance, figure:isFigure(it),
        type:it.type, o,
        x: clamp(ax*W, w*.25, W-w*.25),
        y: H*(.50+.46*Math.pow(d,1.08)) + idle };
    }).filter(Boolean);
    // relax: push apart neighbors at similar depth until they stop stacking
    for(let pass=0; pass<3; pass++){
      for(let i=0;i<placed.length;i++)for(let j=i+1;j<placed.length;j++){
        const a=placed[i], b=placed[j];
        if(Math.abs(a.d-b.d)>.30)continue;
        const minGap=(a.w+b.w)*.30, dx=b.x-a.x;
        if(Math.abs(dx)<minGap){
          const push=(minGap-Math.abs(dx))/2*(dx>=0?1:-1)||minGap/2;
          a.x=clamp(a.x-push, a.w*.28, W-a.w*.28);
          b.x=clamp(b.x+push, b.w*.28, W-b.w*.28);
        }
      }
    }
    return placed.sort((a,b)=>a.d-b.d);
  }

  function stage(og, W, H, t){
    // ── the one background ──
    if(loc){
      try{ loc.mod.draw(og, W, H, { ...(loc.mod.preview?loc.mod.preview():{}), t:Math.min(t,3), card:false, key:false }); }catch(e){}
      og.fillStyle="rgba(255,255,255,.20)"; og.fillRect(0,0,W,H);   // air between set and players
    }else{
      og.fillStyle="#ffffff"; og.fillRect(0,0,W,H);
      og.strokeStyle="#c9c7c0"; og.lineWidth=2;
      og.beginPath(); og.moveTo(0,H*.52); og.lineTo(W,H*.52); og.stroke();
    }
    // ── shared floor placements ──
    const placed = layout(W, H, t);
    // ── attention: who is the timeline acting on right now ──
    let att=null;
    for(const o of ops){ if(o.at<=t && t<o.at+4){ const p=placed.find(q=>q.it.c.instance===o.target); if(p)att=p; } }
    // ── the players ──
    for(const p of placed){
      og.fillStyle="rgba(20,20,20,.13)";
      og.beginPath(); og.ellipse(p.x, p.y+2, p.w*.33, p.w*.075, 0, 0, 7); og.fill();
      const st = stateFor(p.it, t);
      let gaze = st.gaze;
      if(att && att.it!==p.it && isFigure(p.it) && !gaze)
        gaze = { x:clamp((att.x-p.x)/W*3,-.6,.6), y:clamp((att.y-p.y)/H*2,-.3,.3) };
      const state = { ...(st.extra||{}), pose:st.pose, band:p.it.c.band, gaze, t };
      const gz = gaze ? "g"+Math.round(gaze.x*4)+","+Math.round(gaze.y*4) : "";
      /* HOW it meets the scene: CHARACTERS stand out at full presence
         (source-over, keyed) — they must never sink into the set. Panels,
         fx, ensembles, props DARKEN so their fields melt in. Per-instance
         blend overrides always win. */
      const thr = p.o.key || .895;
      const defBlend = /character|creature/.test(p.type) ? "source-over" : "darken";
      let saved=false;
      try{
        /* frame the INK, not the canvas: whatever this state actually drew is
           measured and blitted whole. dw follows the state's true aspect. */
        const cut = inkCutout(p.it.mod, state, st.sig+gz, thr);
        let dh = p.h, dw = dh*cut.ar;
        if(dw > W*.92){ dw = W*.92; dh = dw/cut.ar; }
        og.save(); saved=true;
        og.globalCompositeOperation = p.o.blend || defBlend;
        if(p.o.flip){ og.translate(p.x*2,0); og.scale(-1,1); }
        og.drawImage(cut.cv, cut.x, cut.y, cut.w, cut.h, p.x-dw/2, p.y-dh, dw, dh);
        og.restore(); saved=false;
      }catch(e){ if(saved)og.restore(); og.globalCompositeOperation="source-over"; }
    }
  }
  return { stage, layout, loc, duration:dur, id:sceneMod.id, title:sceneMod.title, cast:sceneMod.cast,
           timeline:sceneMod.timeline, beats:sceneMod.beats, exitState:sceneMod.exitState,
           overrides:()=>ov,
           cloneInstance:inst=>{
             const src=actors.find(a=>a.c.instance===inst); if(!src) return null;
             const base=inst.replace(/~\d+$/,"");
             const n=base+"~"+(2+clones.filter(c=>c.src===base||c.src===inst).length);
             const cl={src:src.c.instance,instance:n};
             clones.push(cl); ov.__clones=clones; applyClone(cl);
             const o0=ovOf(inst); ov[n]={...o0, dx:(o0.dx||0)+.07};
             return n; },
           removeInstance:inst=>{
             const ci=clones.findIndex(c=>c.instance===inst);
             if(ci>=0){ clones.splice(ci,1); ov.__clones=clones;
               const ai=actors.findIndex(a=>a.c.instance===inst);
               if(ai>=0)actors.splice(ai,1); delete ov[inst]; return "removed"; }
             ov[inst]={...ovOf(inst),hidden:true}; return "hidden"; },
           setOverride:(inst,patch)=>{ ov[inst]={...ovOf(inst),...patch};
             for(const k of Object.keys(ov[inst])) if(ov[inst][k]==null) delete ov[inst][k];
             if(!Object.keys(ov[inst]).length) delete ov[inst]; },
           clearOverride:inst=>{ delete ov[inst]; },
           clearOverrides:()=>{ for(const k of Object.keys(ov)) delete ov[k]; } };
}

export const ENGINE_VERSION = "hw-engine/1.1.0";
