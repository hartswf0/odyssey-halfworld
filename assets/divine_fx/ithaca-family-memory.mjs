/* divine_fx.ithaca-family-memory — the family, recalled from far off.
   DIVINE_FX asset. Scene function (OD-B11-S04): three faint distant domestic
   fragments float in the pale field of memory — PENELOPE at her loom, TELEMACHUS
   at a feast, LAERTES on his farm — each a small ghost-vignette bobbing in its own
   soft bubble, the three bound by a faint thread of kinship.

   Procedural DIVINE_FX: SOURCE (the longing that summons the three, a faint origin
   glow at the heart of the field) -> FIELD (three pale floating memory-vignettes +
   the kinship thread that links them) -> TRANSFORM (which loved one the mind is
   dwelling on brightens, the rest stay ghostly; a slow sweep over state.t) ->
   visible CONSEQUENCE (the dwelt-on face of home stands clear a moment, then the
   mind moves on and it sinks back to a pale recollection). Everything animates over
   state.t and a per-vignette glow.

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine POST pass
   supplies the halftone — do NOT pre-dither. Every stratum is kept LOW ink so the
   whole thing reads as "faintly recalled" — never a black blob, never blank paper.
   The dwelt-on vignette lifts to a moderate tone so the sweep is legible. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);

const params = {
  period: 6.6,        // seconds for the mind to sweep penelope->telemachus->laertes
  ghost:  0.5,        // base glow floor so every vignette stays legible (ghostly)
  // the three floating memory-vignettes: center (frac of W/H) + radii (frac)
  vigs: [
    { key:"penelope",   cx:0.285, cy:0.300, rx:0.235, ry:0.150, ph:0.0 },
    { key:"telemachus", cx:0.715, cy:0.485, rx:0.235, ry:0.150, ph:2.1 },
    { key:"laertes",    cx:0.335, cy:0.720, rx:0.235, ry:0.150, ph:4.2 },
  ],
  sourceCx:0.545, sourceCy:0.500,   // the heart of longing that summons the three
};

/* ---- a blocky silhouette FIGURE from round-capped limbs + a head.
   Local unit = figure height h; origin at feet midpoint (ox, gy). dir flips
   facing. Poses: weave / sit / stoop. Held props drawn inline. ---- */
function fig(pen, g, ox, gy, h, tone, dir, pose, lw){
  const P = (lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  let J;
  if (pose==="weave"){                      // Penelope: standing, near arm up to the loom
    J = {
      hip:P(-.02,.46), sh:P(0,.80), neck:P(.02,.86), head:P(.03,.965), hr:h*.10,
      hipL:P(-.09,.46), hipR:P(.06,.46),
      kneeB:P(-.09,.22), footB:P(-.12,0),
      kneeF:P(.07,.22),  footF:P(.11,0),
      shA:P(.10,.80), elA:P(.26,.82), wrA:P(.44,.92),
      shB:P(-.08,.80), elB:P(-.13,.64), wrB:P(-.11,.48),
    };
  } else if (pose==="sit"){                 // Telemachus: reclined at the feast, cup raised
    J = {
      hip:P(-.02,.34), sh:P(-.04,.66), neck:P(-.02,.72), head:P(-.01,.80), hr:h*.10,
      hipL:P(-.05,.34), hipR:P(.02,.34),
      kneeB:P(.26,.31), footB:P(.29,.02),
      kneeF:P(.30,.33), footF:P(.33,.03),
      shA:P(.06,.66), elA:P(.18,.54), wrA:P(.12,.42), cup:true,
      shB:P(-.12,.66), elB:P(-.06,.50), wrB:P(.18,.36),
    };
  } else {                                  // stoop — Laertes: bent over the farm, hoe in hand
    J = {
      hip:P(-.02,.42), sh:P(.20,.60), neck:P(.27,.63), head:P(.37,.66), hr:h*.092,
      hipL:P(-.07,.42), hipR:P(.04,.42),
      kneeB:P(-.11,.20), footB:P(-.17,0),
      kneeF:P(.09,.21),  footF:P(.17,0),
      shA:P(.22,.59), elA:P(.33,.42), wrA:P(.40,.26), hoe:true,
      shB:P(.17,.60), elB:P(.10,.45), wrB:P(.05,.33),
    };
  }
  const L = lw;
  // back leg + far arm (behind torso for depth)
  pen.limb(()=>{ g.moveTo(J.hipL.x,J.hipL.y); g.lineTo(J.kneeB.x,J.kneeB.y); g.lineTo(J.footB.x,J.footB.y); }, tone, L*0.92);
  pen.limb(()=>{ g.moveTo(J.shB.x,J.shB.y); g.lineTo(J.elB.x,J.elB.y); g.lineTo(J.wrB.x,J.wrB.y); }, tone, L*0.7);
  // torso
  pen.limb(()=>{ g.moveTo(J.hip.x,J.hip.y); g.lineTo(J.sh.x,J.sh.y); }, tone, L*1.5);
  // front leg
  pen.limb(()=>{ g.moveTo(J.hipR.x,J.hipR.y); g.lineTo(J.kneeF.x,J.kneeF.y); g.lineTo(J.footF.x,J.footF.y); }, tone, L*0.97);
  // neck + head
  pen.limb(()=>{ g.moveTo(J.sh.x,J.sh.y); g.lineTo(J.neck.x,J.neck.y); }, tone, L*0.7);
  pen.paint(()=>{ g.arc(J.head.x,J.head.y,J.hr,0,TAU); }, tone, 3);
  // near arm
  pen.limb(()=>{ g.moveTo(J.shA.x,J.shA.y); g.lineTo(J.elA.x,J.elA.y); g.lineTo(J.wrA.x,J.wrA.y); }, tone, L*0.76);
  // held props
  if (J.cup){ pen.paint(()=>{ g.ellipse(J.wrA.x, J.wrA.y-h*0.02, h*0.05, h*0.055, 0,0,TAU); }, tone, 2); }
  if (J.hoe){
    const bx=J.wrA.x + dir*h*0.10, by=gy;   // hoe head bites the ground ahead of the hand
    pen.ink(()=>{ g.moveTo(J.wrA.x,J.wrA.y); g.lineTo(bx,by); }, Math.max(3,L*0.5));
    pen.ink(()=>{ g.moveTo(bx,by); g.lineTo(bx+dir*h*0.09, by-h*0.03); }, Math.max(3,L*0.55)); // blade
  }
  return J;
}

/* ---- Penelope's LOOM: an upright warp-weighted frame, posts + beams, a fan of
   warp threads, a woven band growing at the bottom, and the shed bar. ---- */
function drawLoom(pen,g,x,gy,w,ht,lvl){
  const x0=x-w/2, x1=x+w/2, top=gy-ht;
  const tone=toneSolid(inkLevel(lvl));
  pen.paint(()=>{ g.rect(x0, top, w*0.12, ht); }, tone, 3);            // left post
  pen.paint(()=>{ g.rect(x1-w*0.12, top, w*0.12, ht); }, tone, 3);    // right post
  pen.paint(()=>{ g.rect(x0, top, w, ht*0.10); }, toneSolid(inkLevel(lvl+1)), 3);  // top beam
  // warp threads fanning down the frame
  g.strokeStyle=inkLevel(clamp(lvl-1,2,6)); g.lineWidth=1.4; g.globalAlpha=0.8;
  const wn=7;
  for(let i=0;i<wn;i++){ const wx=x0+w*0.14 + (w*0.72)*i/(wn-1);
    g.beginPath(); g.moveTo(wx, top+ht*0.10); g.lineTo(wx, gy-ht*0.30); g.stroke(); }
  g.globalAlpha=1;
  // the shed bar crossing the warp
  pen.ink(()=>{ g.moveTo(x0+w*0.10, gy-ht*0.46); g.lineTo(x1-w*0.10, gy-ht*0.46); }, 2.4);
  // finished cloth growing at the bottom
  pen.paint(()=>{ g.rect(x0+w*0.12, gy-ht*0.30, w*0.76, ht*0.30); }, toneSolid(inkLevel(lvl+1)), 2.4);
  g.strokeStyle=inkLevel(clamp(lvl+2,3,7)); g.lineWidth=1.2; g.globalAlpha=0.7;
  for(let r=1;r<=3;r++){ const ry=gy-ht*0.30 + ht*0.30*r/4; g.beginPath(); g.moveTo(x0+w*0.12,ry); g.lineTo(x1-w*0.12,ry); g.stroke(); }
  g.globalAlpha=1;
}

/* ---- Telemachus's FEAST: a low couch to recline on + a side table bearing a
   krater/bowl, and a hanging cup — the hall at supper. ---- */
function drawFeast(pen,g,cx,gy,w,ht,lvl){
  const tone=toneSolid(inkLevel(lvl));
  // reclining couch
  pen.paint(()=>{ g.rect(cx-w*0.55, gy-ht*0.34, w*0.72, ht*0.34); }, tone, 3);
  pen.paint(()=>{ g.rect(cx-w*0.55, gy-ht*0.62, w*0.10, ht*0.62); }, toneSolid(inkLevel(lvl+1)), 2.4);
  pen.paint(()=>{ g.rect(cx+w*0.07, gy-ht*0.62, w*0.10, ht*0.62); }, toneSolid(inkLevel(lvl+1)), 2.4);
  // side table with a mixing bowl
  const tx=cx+w*0.42;
  pen.paint(()=>{ g.rect(tx-w*0.14, gy-ht*0.30, w*0.28, ht*0.08); }, tone, 2.4);
  pen.paint(()=>{ g.rect(tx-w*0.05, gy-ht*0.30, w*0.03, ht*0.30); }, tone, 2);   // pedestal
  pen.paint(()=>{ g.rect(tx+w*0.03, gy-ht*0.30, w*0.03, ht*0.30); }, tone, 2);
  pen.paint(()=>{ g.moveTo(tx-w*0.11, gy-ht*0.30);                                 // krater bowl
    g.quadraticCurveTo(tx, gy-ht*0.12, tx+w*0.11, gy-ht*0.30); g.closePath(); }, toneSolid(inkLevel(lvl+1)), 2.4);
}

/* ---- Laertes's FARM: furrowed earth rows, a low field wall, and a staked vine
   he has tended — the orchard-croft where the old king labors. ---- */
function drawFarm(pen,g,x0,x1,gy,ht,lvl){
  const tone=toneSolid(inkLevel(lvl));
  // low field wall at the back
  pen.paint(()=>{ g.rect(x0, gy-ht*0.42, (x1-x0)*0.30, ht*0.18); }, tone, 2.4);
  g.strokeStyle=inkLevel(clamp(lvl+2,3,7)); g.lineWidth=1; g.globalAlpha=0.6;
  g.beginPath(); g.moveTo(x0+(x1-x0)*0.10, gy-ht*0.42); g.lineTo(x0+(x1-x0)*0.10, gy-ht*0.24); g.stroke();
  g.globalAlpha=1;
  // a staked vine / sapling on the right
  const vx=x1-(x1-x0)*0.14;
  pen.ink(()=>{ g.moveTo(vx, gy); g.lineTo(vx, gy-ht*0.50); }, 3);                  // stake
  pen.paint(()=>{ g.ellipse(vx, gy-ht*0.52, (x1-x0)*0.10, ht*0.14, 0,0,TAU); }, tone, 2.4); // foliage
  pen.paint(()=>{ g.ellipse(vx-(x1-x0)*0.05, gy-ht*0.40, (x1-x0)*0.06, ht*0.09, 0,0,TAU); }, tone, 2);
  // furrow rows raked into the near earth
  g.strokeStyle=inkLevel(clamp(lvl,2,6)); g.lineWidth=2; g.globalAlpha=0.7; g.lineCap="round";
  for(let r=0;r<3;r++){ const fy=gy+ht*0.06 + r*ht*0.10;
    g.beginPath();
    for(let sx=x0; sx<=x1; sx+=(x1-x0)/10){ const w2=Math.sin(sx*0.05 + r)*2.2; (sx===x0?g.moveTo(sx,fy+w2):g.lineTo(sx,fy+w2)); }
    g.stroke(); }
  g.globalAlpha=1;
}

/* ---- the pale VIGNETTE bubble: a soft memory frame the fragment floats in.
   Faint fill + a broken ring; the dwelt-on one gains a halo + firmer ring. ---- */
function drawBubble(g,cx,cy,rx,ry,glow){
  const active = glow>0.85;
  // faint interior field
  g.fillStyle=inkLevel(active?2:1);
  g.beginPath(); g.ellipse(cx,cy,rx,ry,0,0,TAU); g.fill();
  // halo of attention around the dwelt-on memory
  if (active){
    g.strokeStyle=inkLevel(3); g.globalAlpha=0.5;
    for(let k=1;k<=2;k++){ g.lineWidth=2.4-k*0.6; g.beginPath();
      g.ellipse(cx,cy,rx+k*rx*0.05,ry+k*ry*0.05,0,0,TAU); g.stroke(); }
    g.globalAlpha=1;
  }
  // broken ring frame
  g.strokeStyle=inkLevel(active?4:3); g.lineWidth=active?2.6:1.6; g.globalAlpha=active?0.9:0.6;
  g.setLineDash([ry*0.10, ry*0.075]);
  g.beginPath(); g.ellipse(cx,cy,rx,ry,0,0,TAU); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
}

/* ---- the kinship THREAD linking the three floating fragments + a source glow at
   the heart of the field: the longing that summons and binds the family. ---- */
function drawThread(g,W,H,t,glowArr){
  const V=params.vigs;
  const sx=W*params.sourceCx, sy=H*params.sourceCy;
  // source glow — a pulsing well of longing, radiating rings of attention
  const pulse=0.5+0.5*Math.sin(t*1.2);
  g.save(); g.globalAlpha=0.26+pulse*0.10; g.fillStyle=inkLevel(3);
  g.beginPath(); g.ellipse(sx,sy,W*0.062,H*0.052,0,0,TAU); g.fill(); g.restore();
  for(let k=1;k<=2;k++){ g.strokeStyle=inkLevel(3); g.lineWidth=1.8-k*0.4;
    g.globalAlpha=clamp(0.30 - k*0.06 + pulse*0.10, 0.1, 0.4);
    g.beginPath(); g.ellipse(sx,sy,W*(0.062+k*0.028),H*(0.052+k*0.026),0,0,TAU); g.stroke(); }
  g.globalAlpha=1;
  // faint threads from the source out to each fragment
  g.strokeStyle=inkLevel(3); g.lineWidth=1.6; g.setLineDash([6,7]);
  V.forEach((v,i)=>{
    const bob=Math.sin(t*0.9 + v.ph)*H*0.006;
    g.globalAlpha=clamp(0.40+ (glowArr[i]>0.85?0.35:0), 0.3, 0.75);
    g.beginPath(); g.moveTo(sx,sy); g.lineTo(W*v.cx, H*v.cy+bob); g.stroke();
  });
  g.setLineDash([]); g.globalAlpha=1;
  // a small heart-node at the source (the one crisp anchor mark)
  const pen=makePen(g,{outline:true});
  pen.paint(()=>{ const s=W*0.018;
    g.moveTo(sx, sy+s*0.7);
    g.quadraticCurveTo(sx-s*1.4, sy-s*0.4, sx-s*0.4, sy-s*0.9);
    g.quadraticCurveTo(sx, sy-s*1.1, sx, sy-s*0.5);
    g.quadraticCurveTo(sx, sy-s*1.1, sx+s*0.4, sy-s*0.9);
    g.quadraticCurveTo(sx+s*1.4, sy-s*0.4, sx, sy+s*0.7);
    g.closePath(); }, toneSolid(inkLevel(5)), 2);
}

/* ---- draw one memory-vignette: its bubble, then the domestic scene inside,
   clipped to the bubble so nothing overpaints the pale field. ---- */
function drawVig(pen,g,W,H,v,glow,t){
  const cx=W*v.cx, ry=H*v.ry, rx=W*v.rx;
  const bob=Math.sin(t*0.9 + v.ph)*H*0.006;   // gentle float
  const cy=H*v.cy + bob;

  drawBubble(g,cx,cy,rx,ry,glow);

  g.save();
  g.beginPath(); g.ellipse(cx,cy,rx*0.97,ry*0.97,0,0,TAU); g.clip();

  const gy = cy + ry*0.66;                     // ground line inside the bubble
  const lvl = clamp(Math.round(3 + glow*2.4), 2, 6);   // faint..firm with attention
  const figTone = toneSolid(inkLevel(clamp(lvl,3,7)));  // figures stay a pale recollection
  // faint ground shadow band
  g.fillStyle=inkLevel(clamp(lvl-1,1,4)); g.globalAlpha=0.5;
  g.fillRect(cx-rx, gy, rx*2, ry*0.34); g.globalAlpha=1;
  g.strokeStyle=inkLevel(clamp(lvl,2,6)); g.lineWidth=1.6; g.globalAlpha=0.7;
  g.beginPath(); g.moveTo(cx-rx*0.85, gy); g.lineTo(cx+rx*0.85, gy); g.stroke(); g.globalAlpha=1;

  const h = ry*1.42;                           // figure height
  if (v.key==="penelope"){
    drawLoom(pen,g, cx+rx*0.34, gy, rx*0.52, h*0.98, lvl);
    fig(pen,g, cx-rx*0.30, gy, h, figTone, 1, "weave", h*0.055);
  } else if (v.key==="telemachus"){
    drawFeast(pen,g, cx+rx*0.06, gy, rx*0.90, h*0.72, lvl);
    fig(pen,g, cx-rx*0.16, gy, h*0.94, figTone, 1, "sit", h*0.055);
  } else { // laertes
    drawFarm(pen,g, cx-rx*0.85, cx+rx*0.85, gy, h*0.86, lvl);
    fig(pen,g, cx-rx*0.06, gy, h, figTone, 1, "stoop", h*0.055);
  }
  g.restore();

  // vignette label tick under the bubble (which loved one) — a tiny tally so the
  // three read as a set even before you parse each scene
  g.fillStyle=inkLevel(glow>0.85?6:4);
  g.beginPath(); g.arc(cx, cy+ry*1.06, W*(glow>0.85?0.010:0.006), 0, TAU); g.fill();
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=st.t||0;

  // per-vignette glow: caller may pass an explicit array; else sweep over t
  let glow=st.glow;
  if(!Array.isArray(glow)){
    const ph=frac(t/params.period);
    const active=Math.min(2, Math.floor(ph*3));
    glow=[0,1,2].map(i=> i===active ? 1 : params.ghost);
  }
  const mist=(st.mist!=null)?st.mist:0.04;
  const layers=st.layers||["thread","penelope","telemachus","laertes","mist"];
  const has=l=>layers.includes(l);

  if(has("thread")) drawThread(g,W,H,t,glow);
  params.vigs.forEach((v,i)=>{ if(has(v.key)) drawVig(pen,g,W,H,v,glow[i],t); });

  // global recollection wash — pushes the whole field back into memory
  if(has("mist") && mist>0){
    g.save(); g.globalAlpha=clamp(mist,0,0.85); g.fillStyle="#ffffff";
    g.fillRect(0,0,W,H); g.restore();
  }
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.ithaca-family-memory",
  type:"DIVINE_FX",
  name:"Ithaca family memory",
  statusWord:"YEARNING",
  scene:"OD-B11-S04",

  params,
  // back -> front; scene state may pass a subset to isolate one fragment
  layers:["thread","penelope","telemachus","laertes","mist"],
  // normalized 0..1 anchors: the source of longing + the three floating fragments
  anchors:{
    "source:longing":{x:0.545,y:0.500},
    "vignette:penelope":{x:0.285,y:0.300},
    "vignette:telemachus":{x:0.715,y:0.485},
    "vignette:laertes":{x:0.335,y:0.720},
    "camera:wide":{x:0.500,y:0.500},
  },
  // affected regions of the field (for scene placement / occlusion)
  zones:{
    penelope:{ x0:0.050,y0:0.150,x1:0.520,y1:0.450 },
    telemachus:{ x0:0.480,y0:0.335,x1:0.950,y1:0.635 },
    laertes:{ x0:0.100,y0:0.570,x1:0.570,y1:0.870 },
  },

  // DIVINE_FX state machine: the longing SUMMONS the three from mist, the mind
  // DWELLS on each loved one in turn (that vignette stands clear), then it all
  // FADES back to a pale recollection — a transform over t + glow + mist.
  states:{
    initial:"family",
    nodes:{
      // all three present, none dominant — the whole family held at once (neutral)
      family:{ preview:{ glow:[0.7,0.6,0.7], mist:0.04, status:"YEARNING", progress:0.5,
        layers:["thread","penelope","telemachus","laertes","mist"] } },
      // dwelling on Penelope at her loom (early t)
      "on-penelope":{ preview:{ glow:[1,0.5,0.5], t:0.6, mist:0.03, status:"WEAVING", progress:0.22,
        layers:["thread","penelope","telemachus","laertes","mist"] } },
      // dwelling on Telemachus at the feast (mid t)
      "on-telemachus":{ preview:{ glow:[0.5,1,0.5], t:2.9, mist:0.03, status:"FEASTING", progress:0.55,
        layers:["thread","penelope","telemachus","laertes","mist"] } },
      // dwelling on Laertes on the farm (late t)
      "on-laertes":{ preview:{ glow:[0.5,0.5,1], t:5.0, mist:0.03, status:"LABORING", progress:0.82,
        layers:["thread","penelope","telemachus","laertes","mist"] } },
      // the memory recedes into mist
      fading:{ preview:{ glow:[0.5,0.5,0.5], t:6.2, mist:0.45, status:"FADING", progress:0.95,
        layers:["thread","penelope","telemachus","laertes","mist"] } },
    },
    edges:[["family","on-penelope"],["on-penelope","on-telemachus"],
           ["on-telemachus","on-laertes"],["on-laertes","fading"],
           ["fading","family"],["family","fading"]],
  },
  duration:6.6,
  channels:["t","glow","mist","dwell"],

  preview:()=>({ glow:[0.7,0.6,0.7], mist:0.04, status:"YEARNING", progress:0.5,
    layers:["thread","penelope","telemachus","laertes","mist"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
