/* prop.hermess-wand — Hermes's caduceus, the herald's wand.
   PROP asset. A single reusable object: a slim staff topped with a small
   winged finial and twin coiled snakes that spiral up the upper shaft to
   face one another below the wings. Drawn in SOLID grays + hard contour
   into the offscreen ctx; the engine dotify pass supplies the halftone.
   Do NOT pre-dither.

   Scene function (OD-B05-S01): the divine staff cycling through
   carry / point / sleep / wake / travel states. The whole wand is drawn
   along a local axis and rotated about the GRIP pivot per state, so grip
   and contact anchors stay meaningful as it moves. A sleep-glow (a halo of
   light rings + radiating spokes) blooms at the finial in sleep/wake/travel.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  length:640,      // wand length in source px (fits 660x880 at any angle)
  shaftW:16,       // slim shaft thickness
  finialR:16,      // top knob radius (below the wings)
  wingSpan:120,    // half-span of each wing from the axis
  wingRise:92,     // how high the wing tips reach above the finial
  coilAmp:30,      // sideways reach of each coiled snake
  coilTurns:3.0,   // number of half-turns down the coil
  metal:5,         // base ink level for the golden metal
  snake:5,         // ink level for the snake bodies
};

/* along-axis station positions, measured from the GRIP pivot.
   negative = toward the winged top (up), positive = toward the butt (down). */
function stations(){
  const L = params.length;
  const finialS  = -L*0.60;              // center of the top knob
  const wingS    = finialS + 44;         // where the wings sprout
  const headS    = wingS + 30;           // the two snake heads
  const coilTopS = headS + 18;           // coil begins (below the heads)
  const coilBotS = coilTopS + 214;       // coil ends, plain shaft below
  const buttS    =  L*0.38;              // rounded shaft foot
  return { L, finialS, wingS, headS, coilTopS, coilBotS, buttS };
}

/* per-state pose: rotation about the grip pivot + scene extras */
const POSE = {
  carry:  { angle:-0.12, glow:0.00, status:"CARRIED",   progress:0.30 },
  point:  { angle: 0.66, glow:0.10, status:"POINTING",  progress:0.55, point:true },
  sleep:  { angle: 0.04, glow:1.00, status:"SLEEP",     progress:0.05 },
  wake:   { angle:-0.06, glow:0.55, status:"WAKING",    progress:0.72, spark:true },
  travel: { angle:-0.34, glow:0.72, status:"TRAVEL",    progress:1.00, motion:true },
};

function drawWand(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "carry";
  const P = POSE[mode] || POSE.carry;
  const S = stations();
  const w = params.shaftW;
  const pivot = { x:W*0.50, y:H*0.55 };

  // ---------- everything is drawn in the ROTATED wand frame ----------
  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  // ---- SLEEP-GLOW behind the finial (a light halo of rings + spokes) ----
  if (P.glow > 0.001){
    const gx = 0, gy = S.finialS;
    // soft light disc so the tip reads as luminous (light tone = few dots)
    g.save();
    const rings = 4;
    for(let i=rings;i>=1;i--){
      const rr = params.finialR*(1.2 + i*0.9)*(0.7+0.5*P.glow);
      g.beginPath(); g.arc(gx,gy,rr,0,7);
      g.fillStyle = inkLevel(Math.max(1, Math.round(1 + (rings-i)*0.4)));
      g.globalAlpha = 0.9;
      // only the innermost couple actually fill; outer are stroked rings
      if (i<=2){ g.fill(); }
      else { g.globalAlpha=1; g.strokeStyle="rgba(0,0,0,0.18)"; g.lineWidth=2; g.stroke(); }
    }
    g.globalAlpha=1;
    // radiating spokes (a beacon)
    g.strokeStyle="rgba(0,0,0,0.30)"; g.lineWidth=2.4; g.lineCap="round";
    const spokes=8, rin=params.finialR*1.5, rout=params.finialR*(2.6+2.4*P.glow);
    for(let i=0;i<spokes;i++){
      const a = (i/spokes)*Math.PI*2 + 0.2;
      g.beginPath();
      g.moveTo(gx+Math.cos(a)*rin, gy+Math.sin(a)*rin);
      g.lineTo(gx+Math.cos(a)*rout, gy+Math.sin(a)*rout);
      g.stroke();
    }
    g.restore();
  }

  // ---- MOTION streaks for the travel state (drawn behind the shaft) ----
  if (P.motion){
    g.strokeStyle="rgba(0,0,0,0.20)"; g.lineCap="round";
    for(let i=0;i<3;i++){ g.lineWidth=6-i;
      g.beginPath(); g.moveTo(w*2.4+i*11, S.coilBotS+30+i*22);
      g.lineTo(w*2.4+i*11, S.buttS+40+i*22); g.stroke();
    }
  }

  // ---- SHAFT (slim golden rod, drawn first so heads/coils sit on top) ----
  const shaftTop = S.wingS - 2, shaftBot = S.buttS;
  pen.paint(()=>{ g.rect(-w/2, shaftTop, w, shaftBot-shaftTop); },
            toneSolid(inkLevel(params.metal)), 5);
  // round the rod: bright left edge, darker right face
  g.fillStyle=inkLevel(2); g.fillRect(-w/2+2, shaftTop+3, w*0.20, (shaftBot-shaftTop)-6);
  g.fillStyle=inkLevel(7); g.fillRect(w/2-w*0.26, shaftTop+3, w*0.26, (shaftBot-shaftTop)-6);
  // rounded foot cap
  pen.paint(()=>{ g.ellipse(0, S.buttS, w*0.9, w*0.7, 0,0,7); }, toneSolid(inkLevel(6)), 4);

  // ---- TWIN COILED SNAKES spiralling up the upper shaft ----
  const N = 26;
  const snakePath = (sign)=>{
    g.beginPath();
    for(let i=0;i<=N;i++){
      const t = i/N;
      const s = lerp(S.coilBotS, S.coilTopS, t);
      const x = sign * params.coilAmp * Math.sin(t*Math.PI*params.coilTurns);
      if (i===0) g.moveTo(x, s); else g.lineTo(x, s);
    }
  };
  // draw both bodies as contoured limbs; the far one first for depth
  const bodyTone = toneSolid(inkLevel(params.snake));
  pen.limb(()=>snakePath(-1), bodyTone, 9);
  pen.limb(()=>snakePath( 1), bodyTone, 9);
  // faint scale ticks along each body
  g.strokeStyle="rgba(0,0,0,0.35)"; g.lineWidth=1.6; g.lineCap="round";
  for(const sign of [-1,1]){
    for(let i=2;i<N-1;i+=2){
      const t=i/N, s=lerp(S.coilBotS,S.coilTopS,t);
      const x=sign*params.coilAmp*Math.sin(t*Math.PI*params.coilTurns);
      g.beginPath(); g.moveTo(x-5,s); g.lineTo(x+5,s-3); g.stroke();
    }
  }

  // ---- SNAKE HEADS facing one another below the wings ----
  const drawHead = (sign)=>{
    const hx = sign*params.coilAmp*0.92, hy=S.headS;
    pen.paint(()=>{ g.ellipse(hx, hy, 13, 9, sign*0.5, 0,7); }, bodyTone, 4);
    // snout toward the axis / upward
    pen.paint(()=>{
      g.moveTo(hx - sign*2, hy-9);
      g.quadraticCurveTo(hx - sign*14, hy-14, hx - sign*17, hy-6);
      g.quadraticCurveTo(hx - sign*10, hy-2, hx - sign*2, hy-9);
    }, bodyTone, 3);
    // eye
    g.fillStyle=INK; g.beginPath(); g.arc(hx+sign*3, hy-2, 2.2, 0,7); g.fill();
    // forked tongue flicking upward
    g.strokeStyle=INK; g.lineWidth=1.8; g.lineCap="round";
    const tx=hx - sign*17, ty=hy-6;
    g.beginPath(); g.moveTo(tx,ty); g.lineTo(tx - sign*9, ty-7); g.stroke();
    g.beginPath(); g.moveTo(tx - sign*9, ty-7); g.lineTo(tx - sign*13, ty-11); g.stroke();
    g.beginPath(); g.moveTo(tx - sign*9, ty-7); g.lineTo(tx - sign*13, ty-4); g.stroke();
  };
  drawHead(-1); drawHead(1);

  // ---- WINGS sprouting from the finial (a fan of feathers each side) ----
  const drawWing = (sign)=>{
    const bx = sign*(w*0.3), by = S.wingS;
    const tipx = sign*params.wingSpan, tipy = S.wingS - params.wingRise;
    // main wing membrane
    pen.paint(()=>{
      g.moveTo(bx, by+8);
      g.quadraticCurveTo(sign*params.wingSpan*0.6, by-params.wingRise*0.55, tipx, tipy);
      // scalloped trailing edge back down toward the base
      g.quadraticCurveTo(sign*params.wingSpan*0.72, by-params.wingRise*0.18, sign*params.wingSpan*0.5, by+2);
      g.quadraticCurveTo(sign*params.wingSpan*0.4, by-params.wingRise*0.10, sign*params.wingSpan*0.28, by+8);
      g.quadraticCurveTo(sign*params.wingSpan*0.2, by-params.wingRise*0.04, bx, by+8);
    }, toneSolid(inkLevel(3)), 4);
    // feather separation lines fanning to the tip
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
    for(let f=1;f<=4;f++){
      const ft=f/5;
      g.beginPath(); g.moveTo(bx, by+4);
      g.lineTo(lerp(bx, tipx, ft*1.0), lerp(by+2, tipy, ft));
      g.stroke();
    }
  };
  drawWing(-1); drawWing(1);

  // ---- FINIAL KNOB (top of the staff, between the wings) ----
  pen.paint(()=>{ g.ellipse(0, S.finialS, params.finialR, params.finialR, 0,0,7); },
            toneSolid(inkLevel(params.metal)), 5);
  g.fillStyle=inkLevel(2); // highlight
  g.beginPath(); g.arc(-params.finialR*0.32, S.finialS-params.finialR*0.32, params.finialR*0.34, 0,7); g.fill();
  // a small collar under the knob
  pen.paint(()=>{ g.rect(-w*0.9, S.finialS+params.finialR*0.7, w*1.8, 12); }, toneSolid(inkLevel(6)), 4);

  // ---- GRIP band at the pivot ----
  const gTop=-46, gBot=64, gW=w+8;
  pen.paint(()=>{ g.rect(-gW/2, gTop, gW, gBot-gTop); }, toneSolid(inkLevel(6)), 5);
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let s=gTop+8; s<gBot-3; s+=9){   // cord cross-wrap
    g.beginPath(); g.moveTo(-gW/2, s); g.lineTo(gW/2, s+6); g.stroke();
  }

  // ---- WAKE sparks near the finial ----
  if (P.spark){
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
    for(let i=0;i<5;i++){
      const a=(i/5)*Math.PI*2, r0=params.finialR*1.4, r1=params.finialR*2.1;
      g.beginPath();
      g.moveTo(Math.cos(a)*r0, S.finialS+Math.sin(a)*r0);
      g.lineTo(Math.cos(a)*r1, S.finialS+Math.sin(a)*r1);
      g.stroke();
    }
  }

  g.restore();
}

export const asset = {
  id:"prop.hermess-wand",
  type:"PROP",
  name:"Hermes's Wand",
  statusWord:"CARRIED",
  scene:"OD-B05-S01",

  params,
  // back -> front draw order the module honors
  layers:["glow","motion","shaft","coils","heads","wings","finial","grip","spark"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'carry' pose; the runtime re-derives them under rotation from the pivot).
  anchors:{
    grip:{x:.50,y:.56},          // where the god's hand takes the shaft (pivot)
    "grip:second":{x:.50,y:.64},  // off-hand hold lower on the staff
    tip:{x:.50,y:.115},          // luminous winged crown (the sleep-glow source)
    "contact:ground":{x:.50,y:.83}, // rounded foot when set down
    "wing:left":{x:.32,y:.145},   // left wingtip
    "wing:right":{x:.68,y:.145},  // right wingtip
    balance:{x:.50,y:.55},       // center of mass (pivot)
  },
  // collision shape: a thin oriented capsule along the shaft (asset space)
  collision:{ kind:"capsule", a:{x:.50,y:.13}, b:{x:.50,y:.83}, r:.025 },
  ownership:"hermes",            // the herald's own staff; lent to sway sleep/wake

  states:{
    initial:"carry",
    nodes:{
      carry:  { preview:{ mode:"carry",  status:"CARRIED",  progress:0.30 } },
      point:  { preview:{ mode:"point",  status:"POINTING", progress:0.55 } },
      sleep:  { preview:{ mode:"sleep",  status:"SLEEP",    progress:0.05 } },
      wake:   { preview:{ mode:"wake",   status:"WAKING",   progress:0.72 } },
      travel: { preview:{ mode:"travel", status:"TRAVEL",   progress:1.00 } },
    },
    edges:[
      ["carry","point"],["point","carry"],
      ["carry","sleep"],["sleep","wake"],["wake","carry"],
      ["carry","travel"],["travel","carry"],
      ["point","sleep"],
    ],
  },
  channels:["angle","state","glow","t"],

  preview:()=>({ mode:"carry", status:"CARRIED", progress:0.30, t:0 }),
  draw(ctx,W,H,state){ drawWand(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
