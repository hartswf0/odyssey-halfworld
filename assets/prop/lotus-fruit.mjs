/* prop.lotus-fruit — the honey-sweet lotus blossom-fruit the Lotus-Eaters
   press on Odysseus' scouts (OD-B09-S03).
   PROP asset. A single stylized edible bloom: a rounded seed-pod fruit at the
   core, two rings of pointed petals fanned around it, and a short gripped
   stalk with a pair of leaves. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone. Do NOT
   pre-dither.

   The whole bloom is drawn about a center pivot so grip / lip-contact / center
   anchors stay meaningful across the scene state machine:
     offered -> tasted -> euphoric(glow) -> memory-dimming -> removed / resisted.
   Screen-space overlays (glow rays+rings, dimming veil, refusal bar, ghost
   dashes) are drawn un-rotated so they register to the bloom's world position.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const params = {
  bloomR:150,       // bloom radius in source px (fits 660x880)
  outerN:11,        // outer petal count
  innerN:8,         // inner petal count
  podTone:5,        // seed-pod core tone
  petalMid:3,       // mid petal tone
  petalLite:2,      // sunlit petal faces
  petalDeep:4,      // shaded back petals
  stemTone:4,       // stalk tone
  seed:90903,       // deterministic seed (scene OD-B09-S03)
};

/* per-state pose knobs */
const POSE = {
  offered:          { open:1.00, droop:0.00, glow:0.0, tshift:0, bite:0, tilt:0.00, ghost:false, veil:false, resist:false, status:"OFFERED",  progress:0.20 },
  tasted:           { open:1.00, droop:0.06, glow:0.2, tshift:0, tshiftV:0, bite:1, tilt:0.02, status:"TASTED",   progress:0.40 },
  euphoric:         { open:1.14, droop:0.00, glow:1.0, tshift:-1, bite:1, tilt:0.05, status:"EUPHORIC", progress:0.62 },
  "memory-dimming": { open:0.88, droop:0.55, glow:0.3, tshift:1,  bite:1, tilt:0.00, veil:true, status:"DIMMING", progress:0.80 },
  removed:          { open:0.80, droop:0.25, glow:0.0, tshift:0, bite:1, tilt:0.34, ghost:true, status:"REMOVED", progress:0.94 },
  resisted:         { open:0.94, droop:0.10, glow:0.0, tshift:0, bite:0, tilt:0.30, resist:true, status:"RESISTED", progress:1.00 },
};

/* rotation r such that a petal drawn along local +y points outward at compass
   angle theta (0 = up). canvas: local +y -> (-sin r, cos r). */
function outwardRot(dx, dy){ return Math.atan2(-dx, dy); }

/* one pointed petal from (cx,cy) outward along unit dir (dx,dy) */
function drawPetal(pen, g, cx, cy, dx, dy, len, wid, tone, ghost){
  const r = outwardRot(dx, dy);
  if (ghost){
    g.save(); g.translate(cx,cy); g.rotate(r);
    g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.28; g.lineJoin="round";
    g.beginPath();
    g.moveTo(0,0); g.quadraticCurveTo(wid, len*0.55, 0, len);
    g.quadraticCurveTo(-wid, len*0.55, 0, 0); g.stroke();
    g.globalAlpha=1; g.restore();
    return;
  }
  pen.paint(()=>{
    g.save(); g.translate(cx,cy); g.rotate(r);
    g.moveTo(0,0);
    g.quadraticCurveTo(wid, len*0.55, 0, len);
    g.quadraticCurveTo(-wid, len*0.55, 0, 0);
    g.restore();
  }, toneSolid(inkLevel(tone)), 2);
  // midrib
  g.save(); g.translate(cx,cy); g.rotate(r);
  g.strokeStyle=INK; g.lineWidth=1.4; g.globalAlpha=0.42;
  g.beginPath(); g.moveTo(0,len*0.12); g.lineTo(0,len*0.86); g.stroke();
  g.globalAlpha=1; g.restore();
}

/* a ring of petals */
function drawRing(pen, g, cx, cy, n, radius, len, wid, P, tones, phase){
  const R = rnd(params.seed + Math.round(radius));
  for(let i=0;i<n;i++){
    const theta = (i/n)*Math.PI*2 + phase;
    let dx = Math.sin(theta), dy = -Math.cos(theta);
    // droop: pull each petal toward straight-down as memory dims
    dy = dy + P.droop*0.95;
    const m = Math.hypot(dx,dy)||1; dx/=m; dy/=m;
    const bx = cx + dx*radius*0.34, by = cy + dy*radius*0.34;  // petals seat on the pod rim
    const jl = 0.86 + R()*0.28;
    const L = len*P.open*jl;
    const tone = clamp(tones[i%tones.length] + (P.tshift||0), 1, 7);
    drawPetal(pen, g, bx, by, dx, dy, L, wid*(0.9+R()*0.2), tone, P.ghost);
  }
}

function drawBloom(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "offered";
  const P = { ...POSE.offered, ...(POSE[mode]||{}) };
  const br = params.bloomR;
  const cx = W*0.50, cy = H*0.42;

  // ---------- SCREEN-SPACE backing (glow behind the bloom) ----------
  if (P.glow>0){
    g.save();
    // radiant rays
    const rays = 16;
    g.strokeStyle="rgba(0,0,0,0.16)"; g.lineCap="round";
    for(let i=0;i<rays;i++){
      const a = (i/rays)*Math.PI*2 + 0.2;
      const r0 = br*1.05, r1 = br*(1.35 + 0.45*P.glow*((i%2)?1:0.6));
      g.lineWidth = (i%2)?4:2.2;
      g.beginPath();
      g.moveTo(cx+Math.cos(a)*r0, cy+Math.sin(a)*r0);
      g.lineTo(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1);
      g.stroke();
    }
    // concentric aura rings
    g.setLineDash([7,9]);
    for(let k=1;k<=3;k++){
      g.strokeStyle=`rgba(0,0,0,${0.10*P.glow})`; g.lineWidth=2.5;
      g.beginPath(); g.arc(cx, cy, br*(1.12+k*0.22), 0, Math.PI*2); g.stroke();
    }
    g.setLineDash([]);
    g.restore();
  }

  // ---------- ROTATED bloom frame ----------
  g.save();
  g.translate(cx, cy); g.rotate(P.tilt); g.translate(-cx, -cy);

  // stalk (drawn first, behind the bloom)
  const stemTop = cy + br*0.30, stemBot = H*0.86;
  pen.paint(()=>{
    g.moveTo(cx-7, stemTop);
    g.quadraticCurveTo(cx-16, (stemTop+stemBot)/2, cx-5, stemBot);
    g.lineTo(cx+9, stemBot);
    g.quadraticCurveTo(cx+16, (stemTop+stemBot)/2, cx+7, stemTop);
    g.closePath();
  }, toneSolid(inkLevel(P.ghost?1:params.stemTone)), 4);
  // a pair of stalk leaves
  if(!P.ghost){
    drawPetal(pen, g, cx-6, lerp(stemTop,stemBot,0.40), -0.90, 0.24, br*0.44, br*0.22, clamp(params.petalDeep+(P.tshift||0),1,7), false);
    drawPetal(pen, g, cx+8, lerp(stemTop,stemBot,0.58),  0.92, 0.28, br*0.38, br*0.20, clamp(params.petalMid+(P.tshift||0),1,7), false);
  }

  // ---------- back petal ring (deep tone, wide) ----------
  drawRing(pen, g, cx, cy, params.outerN, br,
           br*1.02, br*0.34, P,
           [params.petalDeep, params.petalMid, params.petalDeep, params.petalMid], 0.0);
  // ---------- front petal ring (lighter, offset) ----------
  drawRing(pen, g, cx, cy, params.innerN, br*0.72,
           br*0.70, br*0.30, P,
           [params.petalLite, params.petalMid, params.petalLite], Math.PI/params.innerN);

  // ---------- central seed-pod fruit ----------
  const podR = br*0.42;
  const podTone = clamp(params.podTone + (P.tshift||0), 1, 7);
  pen.paint(()=>{ g.ellipse(cx, cy, podR, podR*0.92, 0, 0, 7); },
            toneSolid(inkLevel(P.ghost?1:podTone)), 4);
  if(!P.ghost){
    // seed dots (the edible fruit), grid clipped to the pod
    g.save();
    g.beginPath(); g.ellipse(cx, cy, podR*0.94, podR*0.86, 0, 0, 7); g.clip();
    g.fillStyle = inkLevel(7);
    for(let yy=-podR; yy<=podR; yy+=podR*0.32){
      for(let xx=-podR; xx<=podR; xx+=podR*0.32){
        const ox=(Math.round(yy/(podR*0.32))%2)?podR*0.16:0;
        g.beginPath(); g.arc(cx+xx+ox, cy+yy, podR*0.075, 0, 7); g.fill();
      }
    }
    g.restore();
    // pod rim highlight
    g.strokeStyle=inkLevel(2); g.lineWidth=3; g.globalAlpha=0.6;
    g.beginPath(); g.arc(cx, cy, podR*0.86, Math.PI*1.05, Math.PI*1.55); g.stroke();
    g.globalAlpha=1;
  }

  // ---------- bite taken out (tasted onward) ----------
  if(P.bite){
    g.save();
    // carve two paper-white scallops from the upper-right rim
    g.fillStyle="#ffffff";
    g.beginPath(); g.arc(cx+podR*0.62, cy-podR*0.55, podR*0.42, 0, 7); g.fill();
    g.beginPath(); g.arc(cx+podR*0.16, cy-podR*0.80, podR*0.30, 0, 7); g.fill();
    // re-ink the bitten edge
    g.strokeStyle=INK; g.lineWidth=3; g.lineJoin="round";
    g.beginPath();
    g.arc(cx+podR*0.62, cy-podR*0.55, podR*0.42, Math.PI*0.55, Math.PI*1.35);
    g.stroke();
    g.beginPath();
    g.arc(cx+podR*0.16, cy-podR*0.80, podR*0.30, Math.PI*0.2, Math.PI*1.1);
    g.stroke();
    g.restore();
  }

  g.restore(); // end rotated frame

  // ---------- SCREEN-SPACE overlays in FRONT ----------
  if(P.veil){
    // memory-dimming haze: soft translucent bands drifting over the bloom
    g.save();
    for(let k=0;k<4;k++){
      g.fillStyle=`rgba(0,0,0,${0.06+0.02*k})`;
      g.beginPath();
      g.ellipse(cx, cy - br*0.3 + k*br*0.28, br*(1.15-0.08*k), br*0.16, 0, 0, 7);
      g.fill();
    }
    g.restore();
  }
  if(P.ghost){
    // removed: dashed ring marking where the bloom was, plus sweep streaks
    g.save();
    g.strokeStyle=INK; g.globalAlpha=0.35; g.lineWidth=2; g.setLineDash([8,8]);
    g.beginPath(); g.arc(cx, cy, br*0.95, 0, Math.PI*2); g.stroke();
    g.setLineDash([]);
    g.globalAlpha=0.25; g.lineWidth=4; g.lineCap="round";
    for(let k=0;k<3;k++){
      g.beginPath();
      g.arc(cx+br*1.3, cy-br*0.2, br*(0.5+k*0.18), Math.PI*0.75, Math.PI*1.15);
      g.stroke();
    }
    g.globalAlpha=1; g.restore();
  }
  if(P.resist){
    // refusal: bold blue diagonal bar barring the bloom (the mind resisting)
    g.save();
    g.strokeStyle=ACCENT; g.lineWidth=10; g.lineCap="round";
    g.beginPath();
    g.moveTo(cx-br*1.05, cy+br*0.9); g.lineTo(cx+br*1.05, cy-br*0.9);
    g.stroke();
    // hand-off gesture: a short pushing arc
    g.strokeStyle=INK; g.lineWidth=4; g.globalAlpha=0.5;
    g.beginPath(); g.arc(cx-br*1.2, cy, br*0.5, -Math.PI*0.4, Math.PI*0.4); g.stroke();
    g.globalAlpha=1; g.restore();
  }
}

export const asset = {
  id:"prop.lotus-fruit",
  type:"PROP",
  name:"Lotus Fruit",
  statusWord:"OFFERED",
  scene:"OD-B09-S03",

  params,
  // back -> front draw order the module honors
  layers:["glow","stalk","leaves","petals-back","petals-front","pod","seeds","bite","veil","ghost","refusal"],

  // normalized 0..1 attachment / contact anchors (neutral 'offered' pose)
  anchors:{
    center:{x:.50,y:.42},        // bloom heart (the edible pod)
    grip:{x:.50,y:.86},          // where a hand takes the stalk
    "contact:lips":{x:.55,y:.28},// where the fruit meets the mouth when tasted
    "petal:crown":{x:.50,y:.11}, // topmost petal tip
    "stem:base":{x:.50,y:.86},   // stalk foot
  },
  // collision shape: a disc around the bloom
  collision:{ kind:"circle", c:{x:.50,y:.42}, r:.26 },
  ownership:"lotus-eaters",      // grown & proffered by the Lotus-Eaters

  states:{
    initial:"offered",
    nodes:{
      offered:          { preview:{ mode:"offered",         status:"OFFERED",  progress:0.20 } },
      tasted:           { preview:{ mode:"tasted",          status:"TASTED",   progress:0.40 } },
      euphoric:         { preview:{ mode:"euphoric",        status:"EUPHORIC", progress:0.62 } },
      "memory-dimming": { preview:{ mode:"memory-dimming",  status:"DIMMING",  progress:0.80 } },
      removed:          { preview:{ mode:"removed",         status:"REMOVED",  progress:0.94 } },
      resisted:         { preview:{ mode:"resisted",        status:"RESISTED", progress:1.00 } },
    },
    edges:[
      ["offered","tasted"],["offered","resisted"],
      ["tasted","euphoric"],["euphoric","memory-dimming"],
      ["memory-dimming","removed"],["tasted","removed"],
      ["resisted","offered"],
    ],
  },
  channels:["mode","glow","droop","tilt","t"],

  preview:()=>({ mode:"offered", status:"OFFERED", progress:0.20, t:0 }),
  draw(ctx,W,H,state){ drawBloom(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
