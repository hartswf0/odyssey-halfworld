/* divine_fx.athenas-beautification — Athena pouring GRACE over the bathed
   Odysseus (OD-B06-S04): a proportional + surface transformation that PRESERVES
   IDENTITY and RIG. Drawn as a diagrammatic BEFORE/AFTER pair standing on one
   plinth — a smaller, grimy, slumped silhouette on the left RESOLVES into a
   taller, upright, radiant silhouette on the right — with a PROPORTION ARROW
   measuring the height/grace gain and a stream of rising ENHANCEMENT SPARKLES
   carrying the same figure across (identity conserved: same rig, same contour).

   DIVINE_FX contract: SOURCE (grimy figure, left) -> FIELD (the sparkle stream +
   the measuring corridor between them) -> TARGET (radiant figure, right) ->
   TRANSFORM over t (the right figure GROWS from the source's height/tone to full
   radiant stature, halo + rays kindling) -> visible CONSEQUENCE (the proportion
   arrow and the glow that now crowns him).

   Animates over state.t: 0 = only the grimy source, after barely begun; ~0.5 =
   sparkles streaming, right figure mid-growth, glow building; 1 = the radiant
   figure at full stature, haloed, the proportion arrow complete.

   Solid grays + hard black contour, engine primitives only. The engine POST
   pass supplies the dot-matrix halftone — do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  ground:    0.82,          // plinth top as fraction of H (both figures' feet)
  before:{ x:0.30 },        // grimy source figure centre (fraction of W)
  after:{  x:0.685 },       // radiant target figure centre (fraction of W)
  beforeH:   0.325,         // source stature as fraction of H (shorter, grimy)
  radiantH:  0.475,         // full radiant stature as fraction of H (taller)
  sparkles:  11,            // enhancement sparkles streaming source -> target
  rays:      9,             // radiance spikes fanning above the crowned figure
  intensity: 1.0,           // master glow / grace energy (channel-driven)
};

/* ---- shared human SILHOUETTE template — the SAME rig for both figures so the
   transformation reads as identity-preserving (only stature, posture, tone, and
   grooming differ). Drawn in solid tone + contour. baseY = feet, hgt = crown-to-
   feet height. Returns the crown point (for guides / halo / sparkle targets). */
function drawFigure(pen,g,W,cx,baseY,hgt,o){
  const tone=toneSolid(inkLevel(o.ink));
  const build=o.build ?? 1.0;
  const slump=o.slump ?? 0.0;                     // 0 upright .. 1 hunched-forward
  const headR=hgt*0.095;
  const crownY=baseY-hgt;
  const headCy=crownY+headR + slump*hgt*0.05;     // hunch lowers/forwards the head
  const headCx=cx + slump*hgt*0.10;               // and leans it forward
  const shoulderY=crownY+hgt*0.235 + slump*hgt*0.05;
  const shW=hgt*0.30*build;
  const hipY=crownY+hgt*0.55;
  const hipW=hgt*0.185*build;
  const lw=Math.max(2,W*0.006);

  // legs (two limbs from hip corners to the plinth)
  pen.limb(()=>{ g.moveTo(cx-hipW*0.5,hipY); g.lineTo(cx-hipW*0.55,baseY); }, tone, hgt*0.075);
  pen.limb(()=>{ g.moveTo(cx+hipW*0.5,hipY); g.lineTo(cx+hipW*0.55,baseY); }, tone, hgt*0.075);
  // feet
  pen.paint(()=>{ g.ellipse(cx-hipW*0.55,baseY,hgt*0.055,hgt*0.026,0,0,TAU); }, tone, lw);
  pen.paint(()=>{ g.ellipse(cx+hipW*0.55,baseY,hgt*0.055,hgt*0.026,0,0,TAU); }, tone, lw);

  // torso trapezoid (shoulders -> hips), leaning with slump
  const sx=cx + slump*hgt*0.07;
  pen.paint(()=>{
    g.moveTo(sx-shW*0.5, shoulderY);
    g.lineTo(sx+shW*0.5, shoulderY);
    g.lineTo(cx+hipW*0.55, hipY);
    g.lineTo(cx-hipW*0.55, hipY);
    g.closePath();
  }, tone, lw);

  // arms down the sides (near-neutral; grimy hangs a touch inward)
  const armSpread=o.radiant?0.62:0.5;
  pen.limb(()=>{ g.moveTo(sx-shW*0.44,shoulderY+hgt*0.02); g.lineTo(sx-shW*armSpread,hipY+hgt*0.02); }, tone, hgt*0.052);
  pen.limb(()=>{ g.moveTo(sx+shW*0.44,shoulderY+hgt*0.02); g.lineTo(sx+shW*armSpread,hipY+hgt*0.02); }, tone, hgt*0.052);

  // neck + head
  pen.limb(()=>{ g.moveTo(sx,shoulderY); g.lineTo(headCx,headCy+headR*0.7); }, tone, hgt*0.05);
  pen.paint(()=>{ g.arc(headCx,headCy,headR,0,TAU); }, tone, lw);

  // grooming: grimy = ragged straggle; radiant = fuller curled crown
  if (o.radiant){
    const ct=toneSolid(inkLevel(clamp(o.ink+2,0,7)));
    pen.paint(()=>{
      g.moveTo(headCx-headR*1.02, headCy-headR*0.1);
      g.quadraticCurveTo(headCx, headCy-headR*1.9, headCx+headR*1.02, headCy-headR*0.1);
      g.quadraticCurveTo(headCx+headR*0.6, headCy-headR*0.8, headCx, headCy-headR*0.7);
      g.quadraticCurveTo(headCx-headR*0.6, headCy-headR*0.8, headCx-headR*1.02, headCy-headR*0.1);
    }, ct, lw*0.8);
    for(let k=-2;k<=2;k++){ pen.paint(()=>{ g.arc(headCx+k*headR*0.42, headCy-headR*0.7, headR*0.34,0,TAU); }, ct, lw*0.7); }
  } else {
    // ragged / grimy: a few straggly locks + smudge dabs on the torso
    const dt=toneSolid(inkLevel(clamp(o.ink+1,0,7)));
    pen.ink(()=>{ g.moveTo(headCx-headR*0.8,headCy-headR*0.5); g.lineTo(headCx-headR*1.3,headCy-headR*1.1); }, 2);
    pen.ink(()=>{ g.moveTo(headCx+headR*0.7,headCy-headR*0.6); g.lineTo(headCx+headR*1.15,headCy-headR*1.05); }, 2);
    g.fillStyle=inkLevel(clamp(o.ink+1,0,7));
    for(let s=0;s<5;s++){ const sx2=cx+((s*53%9)/9-0.5)*shW*0.8, sy2=lerp(shoulderY,hipY,(s*29%7)/7);
      g.beginPath(); g.arc(sx2,sy2,hgt*0.02,0,TAU); g.fill(); }
    // ragged hem
    pen.seam(()=>{ for(let i=0;i<=4;i++){ const x=cx-hipW*0.55+i*(hipW*1.1/4); g.moveTo(x,hipY); g.lineTo(x+hipW*0.06,hipY+hgt*0.03); } }, 2);
  }
  return { x:headCx, y:crownY, headR, shoulderY, cx };
}

/* ---- radiance behind the crowned figure: short radial rays + a halo arc,
   kindling with the glow intensity `k` (0..1). Light tone so it reads as glow. */
function drawRadiance(pen,g,W,H,crown,k,inten){
  if (k<=0.02) return;
  const cx=crown.x, cy=crown.y-crown.headR*0.15;           // burst centre just above the crown
  const R=crown.headR;
  g.save();
  g.strokeStyle=inkLevel(3); g.lineCap="round"; g.lineWidth=Math.max(2,W*0.007);
  // sparse long radial SPIKES fanning up and out (a clear divine burst, not hair)
  for(let i=0;i<params.rays;i++){
    const a=-Math.PI/2 + (i-(params.rays-1)/2)*(Math.PI*1.02/(params.rays-1)); // wide fan overhead
    const r0=R*1.7;                                         // start well clear of the head/hair
    const r1=R*(3.4+1.5*((i*37%5)/5))*(0.55+0.45*k)*inten;  // long, uneven spikes
    g.globalAlpha=(0.34+0.42*k)*inten;
    g.beginPath();
    g.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
    g.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
    g.stroke();
  }
  // halo arc crowning the head
  g.globalAlpha=(0.5+0.5*k)*inten; g.strokeStyle=inkLevel(4); g.lineWidth=Math.max(2,W*0.008);
  g.beginPath(); g.arc(crown.x, crown.y+crown.headR*0.1, crown.headR*1.55, Math.PI*1.16, Math.PI*1.84); g.stroke();
  g.globalAlpha=1; g.restore();
}

/* ---- a single 4-point enhancement SPARKLE (tapered star) at (x,y), radius r. */
function sparkle(g,x,y,r,tone){
  g.fillStyle=tone; g.beginPath();
  g.moveTo(x,y-r); g.quadraticCurveTo(x+r*0.16,y-r*0.16, x+r,y);
  g.quadraticCurveTo(x+r*0.16,y+r*0.16, x,y+r);
  g.quadraticCurveTo(x-r*0.16,y+r*0.16, x-r,y);
  g.quadraticCurveTo(x-r*0.16,y-r*0.16, x,y-r); g.closePath(); g.fill();
}

/* ---- the enhancement SPARKLE STREAM: motes lift off the grimy source and arc
   over to the radiant target, growing as they arrive (grace being conferred). */
function drawSparkles(pen,g,W,H,src,tgt,t,inten){
  const amt=clamp01(Math.sin(clamp01(t)*Math.PI)*1.15);      // peaks mid-transform
  if (amt<0.03) return;
  const x0=src.cx, y0=src.shoulderY, x1=tgt.x, y1=tgt.y+tgt.headR*0.4;
  const arcUp=H*0.16;
  g.save();
  for(let i=0;i<params.sparkles;i++){
    const seed=(i*41%params.sparkles)/params.sparkles;
    const along=(seed + t*0.85 + i*0.055) % 1;
    const bow=Math.sin(along*Math.PI);
    const x=lerp(x0,x1,along) + Math.sin(seed*TAU+t*3)*W*0.02*(1-along);
    const y=lerp(y0,y1,along) - bow*arcUp;
    const r=(W*0.006 + W*0.016*along)*amt*(0.7+0.3*inten);
    g.globalAlpha=(0.35+0.55*along)*amt;
    sparkle(g,x,y,r,inkLevel(along>0.55?5:4));
  }
  g.globalAlpha=1; g.restore();
}

/* ---- the PROPORTION ARROW: dashed height guides at each crown + a vertical
   double-headed arrow measuring the stature gain in the corridor between the
   figures. The blue tick reads as the "grace" datum. */
function drawProportion(pen,g,W,H,src,tgt,reveal){
  if (reveal<=0.02) return;
  const gx=lerp(src.x,tgt.x,0.5);                 // arrow lives in the corridor
  const yb=src.y, ya=lerp(src.y, tgt.y, clamp01(reveal));
  g.save();
  // dashed guide from each crown across to the arrow
  g.strokeStyle=inkLevel(3); g.lineWidth=Math.max(1,W*0.0035); g.setLineDash([W*0.012,W*0.010]);
  g.globalAlpha=0.7*reveal;
  g.beginPath(); g.moveTo(src.x, yb); g.lineTo(gx+W*0.02, yb); g.stroke();
  g.beginPath(); g.moveTo(tgt.x, tgt.y); g.lineTo(gx-W*0.02, tgt.y); g.stroke();
  g.setLineDash([]);
  // vertical measuring shaft (grimy crown up to radiant crown)
  g.globalAlpha=reveal; g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.006);
  g.beginPath(); g.moveTo(gx, yb); g.lineTo(gx, ya); g.stroke();
  // arrowheads at both ends
  const ah=W*0.016;
  const head=(y,dir)=>{ g.beginPath(); g.moveTo(gx,y); g.lineTo(gx-ah*0.6,y+dir*ah); g.lineTo(gx+ah*0.6,y+dir*ah); g.closePath(); g.fillStyle=INK; g.fill(); };
  head(ya,1); head(yb,-1);
  // end ticks
  g.beginPath(); g.moveTo(gx-ah*0.7,yb); g.lineTo(gx+ah*0.7,yb); g.stroke();
  // the blue grace datum at the new (taller) crown level
  g.fillStyle=ACCENT; g.fillRect(gx-ah*0.5, ya-Math.max(2,W*0.006), ah, Math.max(3,W*0.006));
  g.globalAlpha=1; g.restore();
}

/* The engine calls draw() once with the offscreen ctx. We render strictly in
   back->front layer order. */
function render(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.7);
  const inten=st.intensity ?? params.intensity;
  const layers=st.layers || ["plinth","radiance","before","after","proportion","sparkles"];
  const has=l=>layers.includes(l);

  const baseY=H*params.ground;
  const bx=W*params.before.x, ax=W*params.after.x;
  const beforeH=H*params.beforeH, radiantH=H*params.radiantH;
  const grow=smooth(clamp01(t*1.25));
  const afterH=lerp(beforeH, radiantH, grow);
  const afterInk=Math.round(lerp(6,4,grow));                 // tone brightens as he is graced
  const glow=clamp01((t-0.12)/0.88)*inten;

  // predict crown positions for radiance/guides without painting
  const srcCrownY=baseY-beforeH + beforeH*0.095 - beforeH*0.095; // = baseY-beforeH
  const src0={ x:bx + 0.55*beforeH*0.10, y:baseY-beforeH, headR:beforeH*0.095, shoulderY:(baseY-beforeH)+beforeH*0.235, cx:bx };
  const tgt0={ x:ax, y:baseY-afterH, headR:afterH*0.095, shoulderY:(baseY-afterH)+afterH*0.235, cx:ax };

  // 1) plinth
  if (has("plinth")){
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,baseY);
    g.fillStyle=inkLevel(3); g.fillRect(0,baseY,W,H-baseY);
    pen.ink(()=>{ g.moveTo(0,baseY); g.lineTo(W,baseY); }, 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
    for(let j=1;j<=2;j++){ const y=baseY+(H-baseY)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
    g.fillStyle="rgba(0,0,0,0.10)";
    g.beginPath(); g.ellipse(bx,baseY+H*0.006,beforeH*0.24,H*0.010,0,0,TAU); g.fill();
    g.beginPath(); g.ellipse(ax,baseY+H*0.006,afterH*0.24,H*0.012,0,0,TAU); g.fill();
  }
  // 2) radiance behind the target
  if (has("radiance")) drawRadiance(pen,g,W,H,tgt0,glow,inten);
  // 3) grimy SOURCE (left)
  const src = has("before") ? drawFigure(pen,g,W,bx,baseY,beforeH,{ ink:6, build:0.96, slump:0.55, radiant:false })
                            : src0;
  // 4) radiant TARGET (right)
  const tgt = has("after") ? drawFigure(pen,g,W,ax,baseY,afterH,{ ink:afterInk, build:1.08, slump:0.0, radiant:true })
                           : tgt0;
  // 5) proportion arrow between them
  if (has("proportion")) drawProportion(pen,g,W,H,src,tgt,clamp01(t*1.2));
  // 6) rising enhancement sparkles source -> target
  if (has("sparkles")) drawSparkles(pen,g,W,H,src,tgt,t,inten);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.athenas-beautification",
  type:"DIVINE_FX",
  name:"Athena's beautification",
  statusWord:"GRACED",
  scene:"OD-B06-S04",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["plinth","radiance","before","after","proportion","sparkles"],
  // normalized 0..1 source/field/target/consequence/camera anchors
  anchors:{
    "source:grimy":{     x:0.30, y:0.49 },   // the bathed-but-plain figure (source)
    "target:radiant":{   x:0.685, y:0.35 },  // the graced, taller figure (target)
    "field:stream":{     x:0.49, y:0.44 },   // mid-point of the sparkle corridor
    "measure:arrow":{    x:0.49, y:0.52 },   // the proportion arrow datum
    "crown:radiant":{    x:0.685, y:0.345 }, // haloed crown / grace apex
    "camera:pair":{      x:0.50, y:0.55 },
  },
  // the corridor the grace crosses + the two figure footings on the plinth
  zones:{ corridor:{ x0:0.34, y0:0.30, x1:0.66, y1:0.70 },
          plinth:{   x0:0.06, y0:0.82, x1:0.94, y1:0.98 } },
  // DIVINE_FX transformation states over t (source -> field -> target)
  states:{
    initial:"graced",
    nodes:{
      // source: only the grimy figure, grace not yet poured
      grimy:{   preview:{ t:0.06, intensity:0.85, status:"GRIMY",   progress:0.06 } },
      // field: sparkles streaming, the right figure mid-growth, glow building
      pouring:{ preview:{ t:0.48, intensity:1.0,  status:"POURING", progress:0.48 } },
      // target: the radiant figure at full stature, haloed, proportion complete
      graced:{  preview:{ t:0.86, intensity:1.1,  status:"GRACED",  progress:0.86 } },
    },
    edges:[["grimy","pouring"],["pouring","graced"]],
  },
  duration:4.5,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity"],

  // neutral preview: the full before/after pair — grimy source left, radiant
  // target grown tall and haloed right, proportion arrow up, sparkles streaming.
  preview:()=>({ t:0.72, intensity:1.05, status:"GRACED", progress:0.72,
                 layers:["plinth","radiance","before","after","proportion","sparkles"] }),
  draw(ctx,W,H,state){ return render(ctx,W,H,state||{}); },
};
export default asset;
