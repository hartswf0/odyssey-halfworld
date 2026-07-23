/* prop.athenas-bronze-spear — Athena's tall bronze war-spear.
   PROP asset. A single reusable object: ash-wood shaft, leaf-shaped bronze
   head with a socketed collar, a corded hand-grip, and a bronze butt-spike
   (sauroter). Drawn in SOLID grays + hard contour into the offscreen ctx;
   the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B01-S02): one heavy carried spear cycling through
   grip / plant / rack / raise / strike states. The whole weapon is drawn
   along a local axis and rotated about the GRIP pivot per state, so grip
   and contact anchors stay meaningful as it moves.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  length:640,        // spear length in source px (fits 660x880 at any angle)
  shaftW:24,         // shaft thickness
  headLen:158,       // leaf-head length
  headHalfW:38,      // leaf-head half-width at its widest
  gripLen:120,       // corded grip length
  buttLen:64,        // bronze butt-spike length
  bronze:5,          // base ink level for bronze
  wood:3,            // ink level for the ash shaft
};

/* along-axis station positions, measured from the GRIP pivot.
   negative = toward the head (up), positive = toward the butt (down). */
function stations(){
  const L = params.length;
  const tipS      = -L*0.65;                 // spear point
  const headBaseS = tipS + params.headLen;   // where leaf meets socket
  const buttEndS  =  L*0.35;                  // butt-spike tip
  const buttTopS  =  buttEndS - params.buttLen;
  return { L, tipS, headBaseS, buttEndS, buttTopS };
}

/* per-state pose: rotation about the grip pivot + scene extras */
const POSE = {
  grip:   { angle:-0.10, status:"GRIPPED", progress:0.34 },
  plant:  { angle: 0.00, status:"PLANTED", progress:0.10, ground:true },
  rack:   { angle: 0.92, status:"RACKED",  progress:0.05, rack:true  },
  raise:  { angle:-0.52, status:"RAISED",  progress:0.66, motion:"lift" },
  strike: { angle: 1.14, status:"STRIKE",  progress:1.00, motion:"thrust" },
};

function drawSpear(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "grip";
  const P = POSE[mode] || POSE.grip;
  const S = stations();
  const w  = params.shaftW;
  const pivot = { x:W*0.50, y:H*0.505 };

  // ---------- scene ground / support drawn in SCREEN space (not rotated) ----------
  if (P.ground){
    // butt lands here when vertical; draw a light flagstone band
    const gy = pivot.y + S.buttEndS*Math.cos(P.angle);
    g.fillStyle = inkLevel(2); g.fillRect(0, gy, W, H-gy);
    pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let x=W*0.12;x<W;x+=W*0.16){ g.beginPath(); g.moveTo(x,gy); g.lineTo(x-W*0.05,H); g.stroke(); }
    g.globalAlpha=1;
  }
  if (P.rack){
    // a two-peg wall rack the shaft leans across
    const ry = H*0.30, rx0=W*0.16, rx1=W*0.90;
    pen.paint(()=>{ g.rect(rx0, ry, rx1-rx0, 16); }, toneSolid(inkLevel(4)), 5);
    pen.paint(()=>{ g.rect(rx0+18, ry+16, 20, 30); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.rect(rx1-40, ry+16, 20, 30); }, toneSolid(inkLevel(5)), 4);
  }

  // ---------- everything below is drawn in the ROTATED spear frame ----------
  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  // motion cues behind the weapon for dynamic states
  if (P.motion){
    g.strokeStyle="rgba(0,0,0,0.22)"; g.lineCap="round";
    if (P.motion==="thrust"){
      for(let i=0;i<3;i++){ g.lineWidth=6-i; g.beginPath();
        g.moveTo(-w*3-i*10, S.tipS+70+i*26); g.lineTo(-w*3-i*10, S.tipS+150+i*26); g.stroke(); }
    } else {
      g.lineWidth=4; g.beginPath(); g.arc(0, S.tipS+120, 90, Math.PI*1.15, Math.PI*1.55); g.stroke();
    }
  }

  // ---------- SHAFT (ash wood) ----------
  pen.paint(()=>{ g.rect(-w/2, S.headBaseS-2, w, S.buttTopS-S.headBaseS+2); },
            toneSolid(inkLevel(params.wood)), 5);
  // round the pole: a thin bright edge on the left, a darker face on the right
  g.fillStyle=inkLevel(2); g.fillRect(-w/2+3, S.headBaseS+4, w*0.16, (S.buttTopS-S.headBaseS)-8);
  g.fillStyle=inkLevel(5); g.fillRect(w/2-w*0.24, S.headBaseS+4, w*0.24, (S.buttTopS-S.headBaseS)-8);

  // ---------- LEAF-SHAPED BRONZE HEAD ----------
  const hHalf = params.headHalfW, midS = (S.tipS+S.headBaseS)/2;
  const headPath = ()=>{
    g.moveTo(0, S.tipS);
    g.quadraticCurveTo( hHalf, midS,  w/2+3, S.headBaseS);
    g.lineTo(-w/2-3, S.headBaseS);
    g.quadraticCurveTo(-hHalf, midS,  0, S.tipS);
  };
  pen.paint(headPath, toneSolid(inkLevel(params.bronze)), 5);
  // metal highlight on the left blade face (light), shadow on right (dark)
  g.save(); g.beginPath(); headPath(); g.clip();
  g.fillStyle=inkLevel(2);
  g.beginPath(); g.moveTo(0,S.tipS+6); g.quadraticCurveTo(-hHalf*0.7,midS,-2,S.headBaseS-4);
  g.lineTo(-hHalf,midS); g.closePath(); g.fill();
  g.fillStyle=inkLevel(7);
  g.beginPath(); g.moveTo(w/2+2,S.headBaseS); g.quadraticCurveTo(hHalf*0.9,midS,1,S.tipS+10);
  g.lineTo(hHalf,midS); g.closePath(); g.fill();
  g.restore();
  // raised midrib down the center of the blade
  pen.ink(()=>{ g.moveTo(0, S.tipS+8); g.lineTo(0, S.headBaseS-4); }, 3);

  // ---------- SOCKETED COLLAR (head → shaft) ----------
  const colTop=S.headBaseS-4, colH=26, colW=w+12;
  pen.paint(()=>{ g.rect(-colW/2, colTop, colW, colH); }, toneSolid(inkLevel(6)), 5);
  pen.seam(()=>{ g.moveTo(-colW/2, colTop+colH*0.5); g.lineTo(colW/2, colTop+colH*0.5); }, 2);

  // ---------- CORDED HAND-GRIP (at the pivot) ----------
  const gTop=-params.gripLen*0.35, gBot=params.gripLen*0.65, gW=w+7;
  pen.paint(()=>{ g.rect(-gW/2, gTop, gW, gBot-gTop); }, toneSolid(inkLevel(6)), 5);
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let s=gTop+7; s<gBot-4; s+=9){   // cord cross-wrap
    g.beginPath(); g.moveTo(-gW/2, s); g.lineTo(gW/2, s+6); g.stroke();
  }

  // ---------- BRONZE BUTT-SPIKE (sauroter) ----------
  const ferrTop=S.buttTopS-4;
  pen.paint(()=>{ g.rect(-(w+8)/2, ferrTop, w+8, 22); }, toneSolid(inkLevel(6)), 5); // collar ferrule
  pen.paint(()=>{ g.moveTo(-(w+2)/2, ferrTop+22); g.lineTo((w+2)/2, ferrTop+22);
                  g.lineTo(0, S.buttEndS); g.closePath(); }, toneSolid(inkLevel(params.bronze)), 5);
  g.fillStyle=inkLevel(2); // spike highlight
  g.beginPath(); g.moveTo(-(w+2)/2+2, ferrTop+23); g.lineTo(-1, S.buttEndS-4); g.lineTo(-2, ferrTop+23); g.closePath(); g.fill();

  g.restore();
}

export const asset = {
  id:"prop.athenas-bronze-spear",
  type:"PROP",
  name:"Athena's Bronze Spear",
  statusWord:"HEFTED",
  scene:"OD-B01-S02",

  params,
  // back -> front draw order the module honors
  layers:["ground-or-rack","shadow","motion","shaft","head","collar","grip","butt-spike"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'grip' pose; the runtime re-derives them under rotation from the pivot).
  anchors:{
    grip:{x:.50,y:.53},        // where a hand takes the shaft (the pivot)
    "grip:second":{x:.50,y:.62},// off-hand / two-handed hold
    tip:{x:.47,y:.13},         // striking point of the leaf head
    "contact:ground":{x:.52,y:.85}, // butt-spike ground contact when planted
    socket:{x:.49,y:.24},      // head-to-shaft collar
    balance:{x:.50,y:.50},     // center of mass (pivot)
  },
  // collision shape: a thin oriented capsule along the shaft (asset space)
  collision:{ kind:"capsule", a:{x:.47,y:.13}, b:{x:.52,y:.85}, r:.03 },
  ownership:"athena",          // divine-issued; carried by the scene's warrior

  states:{
    initial:"grip",
    nodes:{
      grip:  { preview:{ mode:"grip",   status:"GRIPPED", progress:0.34 } },
      plant: { preview:{ mode:"plant",  status:"PLANTED", progress:0.10 } },
      rack:  { preview:{ mode:"rack",   status:"RACKED",  progress:0.05 } },
      raise: { preview:{ mode:"raise",  status:"RAISED",  progress:0.66 } },
      strike:{ preview:{ mode:"strike", status:"STRIKE",  progress:1.00 } },
    },
    edges:[
      ["rack","grip"],["grip","plant"],["plant","grip"],
      ["grip","raise"],["raise","strike"],["strike","grip"],
      ["raise","grip"],["grip","rack"],
    ],
  },
  channels:["angle","state","sway","t"],

  preview:()=>({ mode:"grip", status:"GRIPPED", progress:0.34, t:0 }),
  draw(ctx,W,H,state){ drawSpear(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
