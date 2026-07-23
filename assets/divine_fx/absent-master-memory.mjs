/* divine_fx.absent-master-memory — the master, remembered by his old servant.
   DIVINE_FX asset. Scene function (OD-B14-S02): as Eumaeus mourns his long-absent
   lord, three faint recollection-frames float in the pale field of memory —
   young KINGLY ODYSSEUS greeting the boy Eumaeus, ODYSSEUS at the trough feeding
   the estate swine, and ODYSSEUS standing staff-in-hand among his thriving flock.
   Each a small ghost-vignette bobbing in its own soft bubble, all three bound to a
   single source at the heart of the field — the loyal servant's remembering.

   Procedural DIVINE_FX: SOURCE (the swineherd's yearning, a faint origin glow that
   summons the frames) -> FIELD (three pale floating memory-vignettes + a thread of
   loyalty binding them to the source) -> TRANSFORM (the mind DWELLS on one scene of
   the master's former care; it lifts to a firmer tone while the rest stay ghostly,
   a slow sweep over state.t) -> visible CONSEQUENCE (that scene of the good lord
   stands clear a moment, then the servant's mind moves on and it sinks back to a
   pale recollection).

   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine POST pass
   supplies the halftone — do NOT pre-dither. Every stratum is kept LOW ink so the
   whole thing reads as "faintly recalled" — never a black blob, never blank paper.
   The dwelt-on vignette lifts to a moderate tone so the sweep is legible. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);

const params = {
  period: 6.6,        // seconds for the mind to sweep greeting->feeding->flock
  ghost:  0.5,        // base glow floor so every vignette stays legible (ghostly)
  // the three floating memory-vignettes: center (frac of W/H) + radii (frac)
  vigs: [
    { key:"greeting", cx:0.285, cy:0.300, rx:0.235, ry:0.150, ph:0.0 },
    { key:"feeding",  cx:0.715, cy:0.485, rx:0.235, ry:0.150, ph:2.1 },
    { key:"flock",    cx:0.335, cy:0.720, rx:0.235, ry:0.150, ph:4.2 },
  ],
  sourceCx:0.560, sourceCy:0.500,   // the servant's remembering that summons the three
};

/* ---- a blocky silhouette FIGURE from round-capped limbs + a head.
   Local unit = figure height h; origin at feet midpoint (ox, gy). dir flips
   facing. Poses: king / boy / feed. Held props drawn inline. ---- */
function fig(pen, g, ox, gy, h, tone, dir, pose, lw){
  const P = (lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  let J;
  if (pose==="king"){                       // young Odysseus: standing tall, staff + caring hand
    J = {
      hip:P(-.02,.46), sh:P(0,.82), neck:P(.02,.88), head:P(.03,.985), hr:h*.10,
      hipL:P(-.09,.46), hipR:P(.06,.46),
      kneeB:P(-.08,.22), footB:P(-.11,0),
      kneeF:P(.08,.22),  footF:P(.12,0),
      // near arm reaching forward + down, an open hand of care
      shA:P(.10,.82), elA:P(.26,.68), wrA:P(.40,.52),
      // far arm at the side gripping an upright staff
      shB:P(-.08,.82), elB:P(-.15,.66), wrB:P(-.17,.52), staff:true,
    };
  } else if (pose==="boy"){                 // young Eumaeus: small, standing, face lifted
    J = {
      hip:P(-.02,.44), sh:P(0,.72), neck:P(.01,.78), head:P(.02,.90), hr:h*.125,
      hipL:P(-.07,.44), hipR:P(.05,.44),
      kneeB:P(-.06,.22), footB:P(-.08,0),
      kneeF:P(.06,.22),  footF:P(.09,0),
      // near arm reaching up toward the lord
      shA:P(.08,.72), elA:P(.16,.60), wrA:P(.24,.56),
      shB:P(-.07,.72), elB:P(-.12,.58), wrB:P(-.14,.46),
    };
  } else {                                  // feed — Odysseus stooped, tipping a feed bowl
    J = {
      hip:P(-.02,.42), sh:P(.18,.60), neck:P(.25,.63), head:P(.34,.66), hr:h*.092,
      hipL:P(-.07,.42), hipR:P(.04,.42),
      kneeB:P(-.10,.20), footB:P(-.16,0),
      kneeF:P(.08,.21),  footF:P(.15,0),
      shA:P(.20,.59), elA:P(.31,.45), wrA:P(.41,.30), bowl:true,
      shB:P(.16,.60), elB:P(.09,.46), wrB:P(.04,.34),
    };
  }
  const L = lw;
  // back leg + far arm (behind torso for depth)
  pen.limb(()=>{ g.moveTo(J.hipL.x,J.hipL.y); g.lineTo(J.kneeB.x,J.kneeB.y); g.lineTo(J.footB.x,J.footB.y); }, tone, L*0.92);
  pen.limb(()=>{ g.moveTo(J.shB.x,J.shB.y); g.lineTo(J.elB.x,J.elB.y); g.lineTo(J.wrB.x,J.wrB.y); }, tone, L*0.7);
  // upright staff held in the far hand (king)
  if (J.staff){
    const sx=J.wrB.x;
    pen.ink(()=>{ g.moveTo(sx, gy+h*0.01); g.lineTo(sx, gy-h*1.02); }, Math.max(3,L*0.55));
    pen.paint(()=>{ g.arc(sx, gy-h*1.02, h*0.045, 0, TAU); }, tone, 2);   // finial knob
  }
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
  if (J.bowl){
    pen.paint(()=>{ g.ellipse(J.wrA.x, J.wrA.y, h*0.065, h*0.042, 0.5*dir, 0, TAU); }, tone, 2);
    // a faint stream of feed falling to the ground
    g.strokeStyle=inkLevel(4); g.lineWidth=2; g.globalAlpha=0.65; g.setLineDash([3,4]); g.lineCap="round";
    g.beginPath(); g.moveTo(J.wrA.x+dir*h*0.02, J.wrA.y+h*0.04); g.lineTo(J.wrA.x+dir*h*0.05, gy-h*0.02); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
  }
  return J;
}

/* ---- an estate SWINE: round body, snouted head, four short legs, a curly tail.
   center cx, ground gy, body length L, dir faces the snout. ---- */
function drawPig(pen,g,cx,gy,L,tone,dir){
  const bh = L*0.60;                 // body height
  const by = gy - bh*0.60;           // body-center y
  const snout = toneSolid(inkLevel(clamp(Math.round(3),2,6)));
  // 4 short legs (behind the body)
  for(const lx of [-0.30,-0.12,0.14,0.32]){
    pen.limb(()=>{ g.moveTo(cx+lx*L, by+bh*0.30); g.lineTo(cx+lx*L, gy); }, tone, L*0.075);
  }
  // curly tail at the back
  const tx=cx - dir*L*0.48, ty=by;
  g.strokeStyle=INK; g.lineWidth=Math.max(2,L*0.04); g.lineCap="round";
  g.beginPath(); g.moveTo(tx,ty);
  g.quadraticCurveTo(tx-dir*L*0.10, ty-L*0.06, tx-dir*L*0.04, ty-L*0.11);
  g.quadraticCurveTo(tx+dir*L*0.03, ty-L*0.15, tx-dir*L*0.03, ty-L*0.14);
  g.stroke();
  // barrel body
  pen.paint(()=>{ g.ellipse(cx, by, L*0.50, bh*0.50, 0, 0, TAU); }, tone, 3);
  // head + snout at the front
  const hx=cx + dir*L*0.44, hy=by + bh*0.10;
  pen.paint(()=>{ g.ellipse(hx, hy, L*0.20, bh*0.36, 0, 0, TAU); }, tone, 3);
  pen.paint(()=>{ g.ellipse(hx+dir*L*0.16, hy+bh*0.05, L*0.075, bh*0.16, 0, 0, TAU); }, snout, 2); // snout
  // an ear
  pen.paint(()=>{ g.moveTo(hx-dir*L*0.02, hy-bh*0.24);
    g.lineTo(hx+dir*L*0.07, hy-bh*0.40); g.lineTo(hx+dir*L*0.10, hy-bh*0.18); g.closePath(); }, tone, 2);
  // eye dot
  g.fillStyle=INK; g.beginPath(); g.arc(hx+dir*L*0.06, hy-bh*0.04, Math.max(1.4,L*0.02), 0, TAU); g.fill();
}

/* ---- a low feeding TROUGH the master fills for the swine. ---- */
function drawTrough(pen,g,cx,gy,w,lvl){
  const h=w*0.20, tone=toneSolid(inkLevel(lvl));
  pen.paint(()=>{ g.moveTo(cx-w/2, gy-h); g.lineTo(cx-w*0.40, gy);
    g.lineTo(cx+w*0.40, gy); g.lineTo(cx+w/2, gy-h); g.closePath(); }, tone, 3);
  // a fill of feed heaped in the trough
  pen.paint(()=>{ g.ellipse(cx, gy-h*0.9, w*0.42, h*0.4, 0, Math.PI, TAU); }, toneSolid(inkLevel(lvl+1)), 2);
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

/* ---- the loyalty THREAD linking the three floating fragments + a source glow at
   the heart of the field: the servant's remembering that summons and binds them. ---- */
function drawThread(g,W,H,t,glowArr){
  const V=params.vigs;
  const sx=W*params.sourceCx, sy=H*params.sourceCy;
  // source glow — a pulsing well of remembering, radiating rings of attention
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

/* ---- draw one memory-vignette: its bubble, then the recalled scene inside,
   clipped to the bubble so nothing overpaints the pale field. ---- */
function drawVig(pen,g,W,H,v,glow,t){
  const cx=W*v.cx, ry=H*v.ry, rx=W*v.rx;
  const bob=Math.sin(t*0.9 + v.ph)*H*0.006;   // gentle float
  const cy=H*v.cy + bob;

  drawBubble(g,cx,cy,rx,ry,glow);

  g.save();
  g.beginPath(); g.ellipse(cx,cy,rx*0.97,ry*0.97,0,0,TAU); g.clip();

  const gy = cy + ry*0.66;                     // ground line inside the bubble
  const lvl = clamp(Math.round(3 + glow*2.4), 2, 6);    // faint..firm with attention
  const figTone = toneSolid(inkLevel(clamp(lvl,3,7)));  // figures stay a pale recollection
  const pigTone = toneSolid(inkLevel(clamp(lvl-1,2,6)));
  // faint ground shadow band
  g.fillStyle=inkLevel(clamp(lvl-1,1,4)); g.globalAlpha=0.5;
  g.fillRect(cx-rx, gy, rx*2, ry*0.34); g.globalAlpha=1;
  g.strokeStyle=inkLevel(clamp(lvl,2,6)); g.lineWidth=1.6; g.globalAlpha=0.7;
  g.beginPath(); g.moveTo(cx-rx*0.85, gy); g.lineTo(cx+rx*0.85, gy); g.stroke(); g.globalAlpha=1;

  const h = ry*1.42;                           // figure height
  if (v.key==="greeting"){
    // young kingly Odysseus, staff in hand, a caring hand toward the boy Eumaeus
    fig(pen,g, cx-rx*0.34, gy, h, figTone, 1, "king", h*0.055);
    fig(pen,g, cx+rx*0.30, gy, h*0.60, figTone, -1, "boy", h*0.05);
  } else if (v.key==="feeding"){
    // Odysseus stooped over the trough, a swine come to feed
    drawTrough(pen,g, cx+rx*0.26, gy, rx*0.62, lvl);
    drawPig(pen,g, cx+rx*0.52, gy, rx*0.52, pigTone, -1);
    fig(pen,g, cx-rx*0.24, gy, h, figTone, 1, "feed", h*0.055);
  } else { // flock
    // Odysseus standing staff-in-hand amid his thriving estate swine
    drawPig(pen,g, cx-rx*0.52, gy, rx*0.42, pigTone, 1);
    fig(pen,g, cx-rx*0.02, gy, h, figTone, 1, "king", h*0.055);
    drawPig(pen,g, cx+rx*0.48, gy, rx*0.48, pigTone, -1);
  }
  g.restore();

  // vignette tally tick under the bubble — the three read as one set of the master's care
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
  const layers=st.layers||["thread","greeting","feeding","flock","mist"];
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
  id:"divine_fx.absent-master-memory",
  type:"DIVINE_FX",
  name:"Absent-master memory",
  statusWord:"REMEMBERED",
  scene:"OD-B14-S02",

  params,
  // back -> front; scene state may pass a subset to isolate one fragment
  layers:["thread","greeting","feeding","flock","mist"],
  // normalized 0..1 anchors: the servant's remembering + the three floating fragments
  anchors:{
    "source:remembering":{x:0.560,y:0.500},
    "vignette:greeting":{x:0.285,y:0.300},
    "vignette:feeding":{x:0.715,y:0.485},
    "vignette:flock":{x:0.335,y:0.720},
    "camera:wide":{x:0.500,y:0.500},
  },
  // affected regions of the field (for scene placement / occlusion)
  zones:{
    greeting:{ x0:0.050,y0:0.150,x1:0.520,y1:0.450 },
    feeding:{ x0:0.480,y0:0.335,x1:0.950,y1:0.635 },
    flock:{ x0:0.100,y0:0.570,x1:0.570,y1:0.870 },
  },

  // DIVINE_FX state machine: the servant's yearning SUMMONS the three frames from
  // mist, the mind DWELLS on each scene of the master's care in turn (that vignette
  // stands clear), then it all FADES back to a pale recollection — a transform over
  // t + glow + mist.
  states:{
    initial:"master",
    nodes:{
      // all three present, none dominant — the whole memory of the good lord at once
      master:{ preview:{ glow:[0.7,0.6,0.7], mist:0.04, status:"REMEMBERED", progress:0.5,
        layers:["thread","greeting","feeding","flock","mist"] } },
      // dwelling on the young lord greeting the boy Eumaeus (early t)
      "on-greeting":{ preview:{ glow:[1,0.5,0.5], t:0.6, mist:0.03, status:"KINDLY", progress:0.22,
        layers:["thread","greeting","feeding","flock","mist"] } },
      // dwelling on the master feeding the swine (mid t)
      "on-feeding":{ preview:{ glow:[0.5,1,0.5], t:2.9, mist:0.03, status:"TENDING", progress:0.55,
        layers:["thread","greeting","feeding","flock","mist"] } },
      // dwelling on the master amid his thriving flock (late t)
      "on-flock":{ preview:{ glow:[0.5,0.5,1], t:5.0, mist:0.03, status:"HUSBANDING", progress:0.82,
        layers:["thread","greeting","feeding","flock","mist"] } },
      // the memory recedes into mist
      fading:{ preview:{ glow:[0.5,0.5,0.5], t:6.2, mist:0.45, status:"FADING", progress:0.95,
        layers:["thread","greeting","feeding","flock","mist"] } },
    },
    edges:[["master","on-greeting"],["on-greeting","on-feeding"],
           ["on-feeding","on-flock"],["on-flock","fading"],
           ["fading","master"],["master","fading"]],
  },
  duration:6.6,
  channels:["t","glow","mist","dwell"],

  preview:()=>({ glow:[0.7,0.6,0.7], mist:0.04, status:"REMEMBERED", progress:0.5,
    layers:["thread","greeting","feeding","flock","mist"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
