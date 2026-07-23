/* prop.inos-veil — the κρήδεμνον of Ino / Leucothea: a light, shimmering
   protective veil-scarf the sea-goddess lends Odysseus so the deep cannot
   drown him. PROP asset. An isolated reusable length of gossamer cloth drawn
   in SOLID grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B05-S06): the veil cycling through its telling states —
     shimmering (neutral flowing cloth) / worn (bound as a sash under the chest) /
     flotation-aid (a buoyant band riding the swell) / remove (drawn off, held
     loose in the fist) / return-to-sea (released, billowing away on the waves).
   Light protective cloth: near-paper base tone with a bright sheen band for the
   shimmer, dark longitudinal fold seams for the weave, hard black contour.
   Atlas: scale, grip/contact anchors, ownership, collision, states. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  baseLvl:3,      // ink level of the cloth body (light — it is gossamer)
  hiLvl:1,        // sheen band tone (near paper) — the shimmer
  foldLvl:5,      // longitudinal fold-seam tone
  folds:6,        // fold seams across the width (weave shimmer)
  clothW:0.34,    // nominal veil width (fraction of W)
};

/* ---- ribbon geometry ----
   A length of cloth is a band traced between a top and bottom edge, each a
   sine undulation of the same centerline. `taper` narrows the two ends so the
   veil reads as a hemmed rectangle gathered at the corners. All ribbons are
   drawn in a translated/rotated frame centred on (0,0), length along ±x. */
function bandPath(g, len, wid, amp, waves, phase, taper, frA, frB){
  const N=64, x0=-len/2, x1=len/2;
  const edge=(u)=>{
    const x=lerp(x0,x1,u);
    const c=amp*Math.sin(u*waves*Math.PI*2+phase);
    const half=wid*0.5*(taper?(0.26+0.74*Math.sin(Math.PI*u)):1);
    return { x, top:c-half, h:2*half };
  };
  for(let i=0;i<=N;i++){ const e=edge(i/N), y=e.top+e.h*frA; i===0?g.moveTo(e.x,y):g.lineTo(e.x,y); }
  for(let i=N;i>=0;i--){ const e=edge(i/N); g.lineTo(e.x, e.top+e.h*frB); }
  g.closePath();
}

/* one length of shimmering cloth centred at (cx,cy), rotated by `ang`. */
function scarf(pen,g, cx,cy, len, wid, ang, amp, waves, phase, taper=true){
  g.save(); g.translate(cx,cy); g.rotate(ang);
  // cloth body (light) + contour
  pen.paint(()=>bandPath(g, len, wid, amp, waves, phase, taper, 0, 1),
            toneSolid(inkLevel(params.baseLvl)), 4);
  // shimmer sheen band near the top edge (bright, no contour)
  pen.fillPath(()=>bandPath(g, len, wid, amp, waves, phase, taper, 0.12, 0.34),
               inkLevel(params.hiLvl));
  // a fainter second sheen ripple lower down
  pen.fillPath(()=>bandPath(g, len, wid, amp, waves, phase, taper, 0.62, 0.74),
               inkLevel(2));
  // longitudinal fold seams tracking the undulation (the weave / shimmer lines)
  const nF=params.folds;
  for(let f=0;f<nF;f++){
    const fr=(f+1)/(nF+1);
    pen.ink(()=>{
      for(let i=0;i<=48;i++){
        const u=i/48, x=lerp(-len/2,len/2,u);
        const c=amp*Math.sin(u*waves*Math.PI*2+phase);
        const half=wid*0.5*(taper?(0.26+0.74*Math.sin(Math.PI*u)):1);
        const y=c-half+2*half*fr;
        i===0?g.moveTo(x,y):g.lineTo(x,y);
      }
    }, f%2 ? 2.4 : 1.4);
  }
  // gathered corner knots at each hemmed end
  if (taper){
    for(const s of [-1,1]){
      const u = s<0?0:1, x=lerp(-len/2,len/2,u);
      const c=amp*Math.sin(u*waves*Math.PI*2+phase);
      pen.paint(()=>{ g.ellipse(x, c, wid*0.09, wid*0.13, 0,0,7); }, toneSolid(inkLevel(6)), 3.5);
    }
  }
  g.restore();
}

/* the sea surface + a few swell crests (for the water-bound states). */
function sea(pen,g,W,H, level, t){
  g.fillStyle=inkLevel(2); g.fillRect(0, level, W, H-level);
  pen.ink(()=>{ for(let i=0;i<=90;i++){ const x=W*i/90, y=level+Math.sin(i*0.42+t)*7; i===0?g.moveTo(x,y):g.lineTo(x,y);} }, 3.5);
  g.strokeStyle=inkLevel(4); g.lineWidth=2.2; g.lineCap="round";
  for(let r=0;r<4;r++){
    const yy=level+(H-level)*(0.16+0.24*r);
    g.beginPath();
    for(let i=0;i<=90;i++){ const x=W*i/90, y=yy+Math.sin(i*0.55+t+r*1.3)*6; i===0?g.moveTo(x,y):g.lineTo(x,y);} g.stroke();
  }
}

/* a knotted sash + two hanging tails — the veil bound under the chest (worn). */
function wornSash(pen,g,W,H,t){
  const cx=W*0.5, bandY=H*0.40, bandLen=W*0.74, bandW=W*0.16;
  // the wrap band, a shallow arc whose ends tuck behind (taper)
  scarf(pen,g, cx, bandY, bandLen, bandW, 0.04, 26, 1.0, 0.3, true);
  // central knot: two folded lobes + a round core
  const ky=bandY+bandW*0.30;
  pen.paint(()=>{ g.moveTo(cx-W*0.10,ky-18); g.quadraticCurveTo(cx-W*0.02,ky, cx-W*0.10,ky+18);
                  g.quadraticCurveTo(cx-W*0.05,ky, cx-W*0.10,ky-18); g.closePath(); },
            toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.moveTo(cx+W*0.10,ky-18); g.quadraticCurveTo(cx+W*0.02,ky, cx+W*0.10,ky+18);
                  g.quadraticCurveTo(cx+W*0.05,ky, cx+W*0.10,ky-18); g.closePath(); },
            toneSolid(inkLevel(4)), 4);
  pen.paint(()=>{ g.ellipse(cx,ky,W*0.052,W*0.052,0,0,7); }, toneSolid(inkLevel(3)), 4);
  pen.fillPath(()=>{ g.ellipse(cx-W*0.012,ky-W*0.012,W*0.02,W*0.02,0,0,7); }, inkLevel(1));
  // two tails hanging + swaying from the knot
  scarf(pen,g, cx-W*0.05, ky+H*0.20, H*0.34, W*0.10, Math.PI/2+0.16, 20+6*Math.sin(t), 1.3, t*0.6, true);
  scarf(pen,g, cx+W*0.06, ky+H*0.22, H*0.30, W*0.09, Math.PI/2-0.20, 18+6*Math.sin(t+1.4), 1.3, t*0.6+2, true);
}

function drawVeil(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const mode = st.mode || "shimmering";
  const t = st.t || 0;

  if (mode==="worn"){
    wornSash(pen,g,W,H,t);
    return;
  }

  if (mode==="removed"){
    // drawn off the body and held loose in the fist: a fist-pinch grip up top,
    // the cloth spilling straight down in gathered folds.
    const gx=W*0.5, gy=H*0.20;
    // the gripping knuckle (hand contact) — a small clenched cap
    pen.paint(()=>{ g.ellipse(gx, gy, W*0.055, H*0.035, 0,0,7); }, toneSolid(inkLevel(5)), 4);
    // gathered cloth falling from the grip
    scarf(pen,g, gx, gy+H*0.30, H*0.58, W*0.30, Math.PI/2, 30, 1.8, 0.6+0.2*Math.sin(t), true);
    return;
  }

  if (mode==="flotation" || mode==="return-to-sea"){
    const level = mode==="flotation" ? H*0.52 : H*0.58;
    sea(pen,g,W,H, level, t);
    if (mode==="flotation"){
      // a buoyant band riding flat on the swell, half its length awash
      scarf(pen,g, W*0.5, level-H*0.02, W*0.86, W*0.14, -0.03, 22+5*Math.sin(t), 2.2, t*0.4, true);
      // wave crests washing OVER the near edge of the band (occlusion)
      g.strokeStyle=inkLevel(4); g.lineWidth=3; g.lineCap="round";
      for(let k=0;k<5;k++){ const x=W*(0.16+0.16*k);
        g.beginPath(); g.moveTo(x-30, level+8); g.quadraticCurveTo(x, level-6, x+30, level+8); g.stroke(); }
    } else {
      // released: the veil billowing away, big amplitude, drifting seaward
      scarf(pen,g, W*0.5, level-H*0.16, W*0.92, W*0.30, -0.10, 54+8*Math.sin(t), 2.4, t*0.5, true);
      // a torn wisp of the veil trailing further out
      scarf(pen,g, W*0.74, level-H*0.05, W*0.34, W*0.10, -0.5, 30, 2.0, t*0.7+1.5, true);
    }
    return;
  }

  // ---- neutral "shimmering": a graceful length of veil flowing on the air ----
  // a light leading wisp echoing above-left (drawn first, behind, well clear)
  scarf(pen,g, W*0.28, H*0.24, H*0.24, W*0.085, -0.34, 20, 1.6, 2.0, true);
  // the main length of veil, centred a touch high so it fills the card
  scarf(pen,g, W*0.52, H*0.48, H*0.80, W*params.clothW, -0.34, 48+8*Math.sin(t), 1.7, 0.5+0.25*Math.sin(t), true);
}

export const asset = {
  id:"prop.inos-veil",
  type:"PROP",
  name:"Ino's Veil",
  statusWord:"SHIMMERING",
  scene:"OD-B05-S06",

  params,
  // back -> front draw order the module honors (sea, then cloth, then folds/knots)
  layers:["sea","wisp","cloth","sheen","folds","knot","tails","grip"],

  // normalized 0..1 grip / support / contact anchors
  anchors:{
    "grip:end-a":{x:.26,y:.28},     // one hemmed corner a hand takes
    "grip:end-b":{x:.74,y:.72},     // the opposite corner
    "attach:chest":{x:.50,y:.40},   // where it binds under the chest when worn
    "knot:front":{x:.50,y:.46},     // the sash knot
    center:{x:.50,y:.50},           // cloth centroid
    "contact:water":{x:.50,y:.54},  // the swell it rides / returns to
    "fx:billow-tip":{x:.72,y:.36},  // leading edge when it billows away
  },
  // collision shape: the loose cloth's footprint (asset space, AABB 0..1)
  collision:{ kind:"box", x0:.06, y0:.16, x1:.94, y1:.90 },
  ownership:"ino-leucothea",        // the sea-goddess's veil, lent then returned

  states:{
    initial:"shimmering",
    nodes:{
      shimmering:    { preview:{ mode:"shimmering",    status:"SHIMMERING", progress:0.30 } },
      worn:          { preview:{ mode:"worn",          status:"WORN",       progress:0.45 } },
      flotation:     { preview:{ mode:"flotation",     status:"AFLOAT",     progress:0.60 } },
      removed:       { preview:{ mode:"removed",        status:"LOOSE",      progress:0.22 } },
      "return-to-sea":{ preview:{ mode:"return-to-sea", status:"ADRIFT",     progress:0.95 } },
    },
    edges:[
      ["shimmering","worn"],["worn","flotation"],["flotation","worn"],
      ["worn","removed"],["removed","return-to-sea"],
      ["flotation","removed"],["return-to-sea","shimmering"],
    ],
  },
  channels:["mode","billow","water","phase","t"],

  preview:()=>({ mode:"shimmering", status:"SHIMMERING", progress:0.30, t:0 }),
  draw(ctx,W,H,state){ drawVeil(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
