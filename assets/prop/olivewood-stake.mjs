/* prop.olivewood-stake — the great olive-wood trunk Odysseus and his men
   sharpen into a stake to blind the Cyclops.
   PROP asset. A single reusable object: a thick, gnarled olive trunk drawn
   along a local axis and rotated about the GRIP pivot per state. Bark, char,
   and glow are toggled per state so one body carries the whole preparation
   sequence. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B09-S08): the trunk cycles through
   raw / cut / stripped / sharpened / fire-hardened / hidden / heated /
   lifted / thrust. States that change its FORM (bark, taper, point, char)
   are baked into the silhouette + surface; states that change its SITUATION
   (hidden under dung, heated in the embers, lifted, thrust) add screen-space
   overlays or rotate the whole stake about the grip pivot.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  length:660,     // stake length in source px (fits 660x880 at any angle)
  buttHalf:38,    // trunk half-width at the butt (thick olive bole)
  midHalf:33,     // half-width through the body
  bluntHalf:24,   // half-width at a blunt/un-sharpened working end
  coneFrac:0.30,  // fraction of length taken up by the sharpened cone
  wood:3,         // base ink level for stripped olive wood
  bark:5,         // ink level for rough bark
};

/* along-axis stations, measured from the GRIP pivot.
   negative = toward the working point (up), positive = toward the butt (down). */
function stations(point){
  const L = params.length;
  const tipS   = -L*0.62;                                   // working end (point)
  const buttS  =  L*0.38;                                   // held / back end
  const coneS  =  tipS + L*params.coneFrac*(point?1:0.14);  // where the cone meets the body
  return { L, tipS, buttS, coneS };
}

/* per-state pose: form flags + rotation about the grip pivot + scene extras.
   bark: bark still on. point: tip sharpened. char: fire-hardened tip.
   glow: tip heated to glowing in the embers. */
const POSE = {
  raw:      { angle: 0.14, bark:1, point:0, char:0, glow:0, branch:1, status:"RAW",       progress:0.07 },
  cut:      { angle: 0.09, bark:1, point:0, char:0, glow:0, sawn:1,   status:"CUT",       progress:0.17 },
  stripped: { angle: 0.05, bark:0, point:0, char:0, glow:0,           status:"STRIPPED",  progress:0.30 },
  sharpened:{ angle: 0.04, bark:0, point:1, char:0, glow:0,           status:"SHARPENED", progress:0.44 },
  hardened: { angle: 0.04, bark:0, point:1, char:1, glow:0,           status:"FIRE-HARDENED", progress:0.56 },
  hidden:   { angle: 0.86, bark:0, point:1, char:1, glow:0, dung:1,   status:"HIDDEN",    progress:0.63 },
  heated:   { angle: 0.03, bark:0, point:1, char:1, glow:1,           status:"HEATED",    progress:0.78 },
  lifted:   { angle:-0.46, bark:0, point:1, char:1, glow:1, motion:"lift",   status:"LIFTED", progress:0.89 },
  thrust:   { angle: 1.02, bark:0, point:1, char:1, glow:1, motion:"thrust", status:"THRUST", progress:1.00 },
};

/* trace the trunk silhouette in the local (rotated) frame. Sub-path only —
   the caller wraps it in pen.paint()/clip(). Slightly convex edges + a
   knotty swell give the olive-wood read. */
function bodyPath(g, S, point){
  const HB=params.buttHalf, HM=params.midHalf, HN=params.bluntHalf;
  const bMid=(S.coneS+S.buttS)/2;
  if (point){
    g.moveTo(0, S.tipS);                                       // sharp apex
    g.quadraticCurveTo( HM*0.42, S.tipS+(S.coneS-S.tipS)*0.55,  HM, S.coneS);   // cone right
    g.quadraticCurveTo( HB*1.02, bMid,  HB, S.buttS-16);        // trunk right (swelling)
    g.quadraticCurveTo( HB,      S.buttS, HB-10, S.buttS);      // round butt R
    g.lineTo(-(HB-10), S.buttS);
    g.quadraticCurveTo(-HB,      S.buttS, -HB, S.buttS-16);
    g.quadraticCurveTo(-HB*1.02, bMid, -HM, S.coneS);           // trunk left
    g.quadraticCurveTo(-HM*0.42, S.tipS+(S.coneS-S.tipS)*0.55, 0, S.tipS);      // cone left
    g.closePath();
  } else {
    g.moveTo(-HN, S.coneS);
    g.quadraticCurveTo(-HN*0.9, S.tipS-4, 0, S.tipS-8);         // rounded blunt top
    g.quadraticCurveTo( HN*0.9, S.tipS-4,  HN, S.coneS);
    g.quadraticCurveTo( HM*1.03, bMid,  HB, S.buttS-16);
    g.quadraticCurveTo( HB,      S.buttS, HB-10, S.buttS);
    g.lineTo(-(HB-10), S.buttS);
    g.quadraticCurveTo(-HB,      S.buttS, -HB, S.buttS-16);
    g.quadraticCurveTo(-HM*1.03, bMid, -HN, S.coneS);
    g.closePath();
  }
}

function drawStake(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "sharpened";
  const P = POSE[mode] || POSE.sharpened;
  const S = stations(P.point);
  const HB=params.buttHalf;
  const pivot = { x:W*0.50, y:H*0.505 };

  // ---------- scene ground / support in SCREEN space (not rotated) ----------
  if (P.dung){
    // the stake is buried under a heap of cave-floor dung; only the point shows.
    const gy = H*0.30;
    // long lumpy mound covering the lower body
    pen.paint(()=>{
      g.moveTo(W*0.10, H*0.96);
      g.quadraticCurveTo(W*0.20, gy+H*0.10, W*0.40, gy+H*0.02);
      g.quadraticCurveTo(W*0.55, gy-H*0.02, W*0.72, gy+H*0.06);
      g.quadraticCurveTo(W*0.88, gy+H*0.12, W*0.92, H*0.96);
      g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // clumps so the heap isn't one flat blob
    g.fillStyle=inkLevel(5);
    for(let i=0;i<9;i++){ const x=W*(0.18+i*0.075), y=gy+H*(0.06+0.05*Math.sin(i*1.7));
      g.beginPath(); g.ellipse(x,y,W*0.05,H*0.028,0,0,7); g.fill(); }
    g.fillStyle=inkLevel(3);
    for(let i=0;i<7;i++){ const x=W*(0.24+i*0.08), y=gy+H*(0.14+0.04*Math.cos(i*2.1));
      g.beginPath(); g.ellipse(x,y,W*0.03,H*0.018,0,0,7); g.fill(); }
  }

  // ---------- everything below is drawn in the ROTATED stake frame ----------
  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  // motion cues behind the stake for the dynamic states
  if (P.motion){
    g.strokeStyle="rgba(0,0,0,0.20)"; g.lineCap="round";
    if (P.motion==="thrust"){
      for(let i=0;i<3;i++){ g.lineWidth=7-i*1.4; g.beginPath();
        g.moveTo(-HB*1.6-i*12, S.tipS+90+i*30); g.lineTo(-HB*1.6-i*12, S.tipS+180+i*30); g.stroke(); }
    } else {
      g.lineWidth=5; g.beginPath(); g.arc(0, S.tipS+150, 120, Math.PI*1.12, Math.PI*1.5); g.stroke();
    }
  }

  // ---------- TRUNK BODY ----------
  const bodyTone = P.bark ? params.bark : params.wood;
  pen.paint(()=>bodyPath(g,S,P.point), toneSolid(inkLevel(bodyTone)), 5);

  // round the log: bright left edge, dark right face (clipped to the body)
  g.save(); g.beginPath(); bodyPath(g,S,P.point); g.clip();
  g.fillStyle=inkLevel(P.bark?3:2);                       // left highlight strip
  g.fillRect(-HB, S.coneS, HB*0.36, S.buttS-S.coneS);
  g.fillStyle=inkLevel(P.bark?6:5);                       // right shadow face
  g.fillRect(HB*0.30, S.coneS, HB*0.7, S.buttS-S.coneS);

  if (P.bark){
    // rough bark: short cross-cracks + a couple of vertical fissures
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round"; g.globalAlpha=0.7;
    for(let s=S.tipS+30; s<S.buttS-10; s+=17){
      const w=HB*0.9; g.beginPath(); g.moveTo(-w, s); g.lineTo(-w*0.2, s+5); g.stroke();
      g.beginPath(); g.moveTo(w*0.15, s+8); g.lineTo(w, s+3); g.stroke();
    }
    g.globalAlpha=1;
    g.strokeStyle=INK; g.lineWidth=2.6;
    g.beginPath(); g.moveTo(-HB*0.2,S.coneS+20);
    g.bezierCurveTo(-HB*0.4,S.coneS+120,-HB*0.1,S.buttS-160,-HB*0.25,S.buttS-40); g.stroke();
  } else {
    // stripped: long wandering grain lines
    g.strokeStyle=INK; g.lineWidth=1.8; g.lineCap="round"; g.globalAlpha=0.5;
    for(let k=-2;k<=2;k++){
      const off=k*HB*0.34;
      g.beginPath(); g.moveTo(off, S.coneS+16);
      g.bezierCurveTo(off+HB*0.16, (S.coneS+S.buttS)*0.4, off-HB*0.14, (S.coneS+S.buttS)*0.65, off+HB*0.06, S.buttS-14);
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // olive-wood knots (a few, on any state)
  g.globalAlpha=0.85;
  const knots=[[HB*0.30,S.coneS+70],[-HB*0.42,(S.coneS+S.buttS)*0.55],[HB*0.10,S.buttS-90]];
  for(const [kx,ky] of knots){
    g.fillStyle=inkLevel(P.bark?6:5); g.beginPath(); g.ellipse(kx,ky,8,11,0.4,0,7); g.fill();
    g.strokeStyle=INK; g.lineWidth=1.6; g.beginPath(); g.ellipse(kx,ky,8,11,0.4,0,7); g.stroke();
    g.fillStyle=inkLevel(7); g.beginPath(); g.ellipse(kx,ky,3,4,0.4,0,7); g.fill();
  }
  g.globalAlpha=1;
  g.restore();  // end body clip

  // ---------- SAWN BUTT FACE (cut state): growth rings on the back end ----------
  if (P.sawn){
    const cy=S.buttS-2;
    g.strokeStyle=INK; g.lineWidth=1.8;
    for(let r=6;r<=HB-4;r+=6){ g.beginPath(); g.ellipse(0,cy,r*0.9,r*0.32,0,Math.PI,Math.PI*2); g.stroke(); }
  }

  // ---------- LOPPED BRANCH STUB (raw state) ----------
  if (P.branch){
    g.save(); g.translate(HB*0.7, (S.coneS+S.buttS)*0.42); g.rotate(0.5);
    pen.paint(()=>{ g.moveTo(-8,0); g.lineTo(46,-6); g.lineTo(50,10); g.lineTo(-6,16); g.closePath(); },
              toneSolid(inkLevel(params.bark)), 4);
    g.fillStyle=inkLevel(6); g.beginPath(); g.ellipse(46,2,8,9,0,0,7); g.fill();
    g.restore();
  }

  // ---------- SHARPENED / FIRE-HARDENED / HEATED TIP OVERLAYS ----------
  if (P.point){
    const coneMid = S.tipS + (S.coneS-S.tipS)*0.5;
    // cone shading: bright left facet, dark right facet (clip to cone)
    g.save();
    g.beginPath();
    g.moveTo(0,S.tipS);
    g.quadraticCurveTo( params.midHalf*0.42, coneMid, params.midHalf, S.coneS);
    g.lineTo(-params.midHalf, S.coneS);
    g.quadraticCurveTo(-params.midHalf*0.42, coneMid, 0, S.tipS);
    g.closePath(); g.clip();
    g.fillStyle=inkLevel(2); g.beginPath();
    g.moveTo(0,S.tipS); g.lineTo(-params.midHalf*0.7,S.coneS); g.lineTo(-2,S.coneS); g.closePath(); g.fill();
    g.fillStyle=inkLevel(5); g.beginPath();
    g.moveTo(0,S.tipS); g.lineTo(params.midHalf*0.9,S.coneS); g.lineTo(2,S.coneS); g.closePath(); g.fill();

    if (P.char){
      // fire-hardened: charred tip, darkest at the point, fading down the cone
      const charLen=(S.coneS-S.tipS)*0.62;
      for(let i=0;i<7;i++){
        const t=i/6, s=S.tipS+charLen*t, hw=lerp(1,params.midHalf*0.62,t);
        g.fillStyle=inkLevel(Math.round(lerp(7,4,t)));
        g.beginPath(); g.ellipse(0,s,hw,7,0,0,7); g.fill();
      }
    }
    g.restore(); // end cone clip

    if (P.glow){
      // heated to glowing: bright hot core at the very point + radiant heat.
      const tip={x:0,y:S.tipS};
      // faint hot halo (light -> few dots -> reads as glowing)
      g.fillStyle=inkLevel(1); g.beginPath(); g.arc(tip.x,tip.y+14,40,0,7); g.fill();
      g.fillStyle=inkLevel(0); g.beginPath(); g.arc(tip.x,tip.y+14,22,0,7); g.fill();
      // re-draw a clean bright point on top of the char
      g.fillStyle=inkLevel(0); g.beginPath();
      g.moveTo(tip.x,tip.y); g.lineTo(tip.x-11,tip.y+44); g.lineTo(tip.x+11,tip.y+44); g.closePath(); g.fill();
      g.strokeStyle=INK; g.lineWidth=2.4; g.stroke();
      // radiating heat ticks + floating embers
      g.strokeStyle="rgba(0,0,0,0.5)"; g.lineWidth=2.2; g.lineCap="round";
      for(let a=-2;a<=2;a++){
        const ang=-Math.PI/2 + a*0.5;
        const x0=tip.x+Math.cos(ang)*30, y0=tip.y+14+Math.sin(ang)*30;
        const x1=tip.x+Math.cos(ang)*52, y1=tip.y+14+Math.sin(ang)*52;
        g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.stroke();
      }
      g.fillStyle=INK;
      for(let i=0;i<5;i++){ const ang=-Math.PI/2+(i-2)*0.62, r=60+((i*13)%18);
        g.beginPath(); g.arc(tip.x+Math.cos(ang)*r, tip.y+14+Math.sin(ang)*r, 2.4,0,7); g.fill(); }
    }
  }

  g.restore(); // end rotated frame
}

export const asset = {
  id:"prop.olivewood-stake",
  type:"PROP",
  name:"Olivewood Stake",
  statusWord:"SHARPENED",
  scene:"OD-B09-S08",

  params,
  // back -> front draw order the module honors
  layers:["ground-or-dung","motion","trunk","surface","knots","sawn-face","branch-stub","tip","char","glow"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'sharpened' pose ~vertical; the runtime re-derives them under rotation
  // from the pivot).
  anchors:{
    point:{x:.50,y:.10},            // working point (into the eye / the embers)
    "grip:lead":{x:.50,y:.60},      // Odysseus' two-handed hold
    "grip:crew":{x:.50,y:.72},      // the four crewmen's shared hold
    butt:{x:.50,y:.86},             // back end
    "contact:eye":{x:.50,y:.10},    // strike point vs. the Cyclops
    "contact:embers":{x:.50,y:.10}, // point buried in the fire to heat/harden
    balance:{x:.50,y:.505},         // centre of mass (pivot)
  },
  // collision shape: a thick oriented capsule along the trunk (asset space)
  collision:{ kind:"capsule", a:{x:.50,y:.10}, b:{x:.50,y:.86}, r:.05 },
  ownership:"odysseus",             // cut from the Cyclops' own olive club, worked by the crew

  states:{
    initial:"raw",
    nodes:{
      raw:      { preview:{ mode:"raw",       status:"RAW",           progress:0.07 } },
      cut:      { preview:{ mode:"cut",       status:"CUT",           progress:0.17 } },
      stripped: { preview:{ mode:"stripped",  status:"STRIPPED",      progress:0.30 } },
      sharpened:{ preview:{ mode:"sharpened", status:"SHARPENED",     progress:0.44 } },
      hardened: { preview:{ mode:"hardened",  status:"FIRE-HARDENED", progress:0.56 } },
      hidden:   { preview:{ mode:"hidden",    status:"HIDDEN",        progress:0.63 } },
      heated:   { preview:{ mode:"heated",    status:"HEATED",        progress:0.78 } },
      lifted:   { preview:{ mode:"lifted",    status:"LIFTED",        progress:0.89 } },
      thrust:   { preview:{ mode:"thrust",    status:"THRUST",        progress:1.00 } },
    },
    edges:[
      ["raw","cut"],["cut","stripped"],["stripped","sharpened"],
      ["sharpened","hardened"],["hardened","hidden"],["hidden","heated"],
      ["heated","lifted"],["lifted","thrust"],["thrust","heated"],
      ["hidden","sharpened"],
    ],
  },
  channels:["mode","angle","glow","t"],

  preview:()=>({ mode:"sharpened", status:"SHARPENED", progress:0.44, t:0 }),
  draw(ctx,W,H,state){ drawStake(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
