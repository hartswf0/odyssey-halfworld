/* prop.golden-staff-of-tiresias — the tall gold seer's staff of Tiresias.
   PROP asset. A single reusable object: a slim gold shaft, an ornate finial
   at the top (stacked collar rings, a round knob, and an open crowning ring),
   and a tapered ferrule foot. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B11-S03): the underworld authority object of the blind
   prophet. The whole staff is drawn along a local axis and rotated about the
   GRIP pivot per state, so grip and contact anchors stay meaningful as it moves.
   States: carry / ground-contact / point / prophecy-emphasis(glint).
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  length:660,        // staff length in source px (fits 660x880 at any angle)
  shaftW:20,         // shaft thickness
  knobR:33,          // round finial knob radius
  ringOuter:42,      // crowning open ring outer radius
  ringInner:24,      // crowning open ring inner radius (the hole)
  gripLen:130,       // hand-grip band length
  footLen:70,        // tapered ferrule foot length
  gold:5,            // base ink level for the gold metal
  goldLo:2,          // gold highlight (light face -> few dots)
  goldHi:7,          // gold shadow (dark face)
  shaftLvl:4,        // base ink level for the plain shaft
};

/* along-axis station positions, measured from the GRIP pivot.
   negative = toward the finial (up), positive = toward the foot (down). */
function stations(){
  const L = params.length;
  const headBaseS = -L*0.40;                 // where the ornate finial meets the shaft
  const footEndS  =  L*0.40;                  // ferrule foot tip
  const footTopS  =  footEndS - params.footLen;
  return { L, headBaseS, footEndS, footTopS };
}

/* per-state pose: rotation about the grip pivot + scene extras */
const POSE = {
  carry:    { angle:-0.11, status:"CARRIED", progress:0.30 },
  ground:   { angle: 0.00, status:"PLANTED", progress:0.10, ground:true },
  point:    { angle: 0.86, status:"POINTING", progress:0.62, motion:"point" },
  prophecy: { angle:-0.34, status:"PROPHECY", progress:1.00, glint:true },
};

function drawStaff(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "carry";
  const P = POSE[mode] || POSE.carry;
  const S = stations();
  const w  = params.shaftW;
  const pivot = { x:W*0.50, y:H*0.575 };

  // ---------- scene ground drawn in SCREEN space (not rotated) ----------
  if (P.ground){
    const gy = pivot.y + S.footEndS*Math.cos(P.angle);
    g.fillStyle = inkLevel(2); g.fillRect(0, gy, W, H-gy);
    pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.32;
    for(let x=W*0.12;x<W;x+=W*0.16){ g.beginPath(); g.moveTo(x,gy); g.lineTo(x-W*0.05,H); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---------- everything below is drawn in the ROTATED staff frame ----------
  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  // finial center stations (in the rotated frame, up = negative)
  const collarS = S.headBaseS - 14;             // stacked collar just above shaft
  const knobS   = S.headBaseS - 14 - 26 - params.knobR;   // knob center
  const ringCy  = knobS - params.knobR - 6 - params.ringOuter; // crowning ring center
  const tipS    = ringCy - params.ringOuter;    // very top of the ring

  // motion cue: a small forward arc when pointing
  if (P.motion==="point"){
    g.strokeStyle="rgba(0,0,0,0.20)"; g.lineCap="round"; g.lineWidth=4;
    g.beginPath(); g.arc(0, tipS+70, 74, Math.PI*1.16, Math.PI*1.52); g.stroke();
    // a short directional dash off the finial
    g.lineWidth=5; g.beginPath(); g.moveTo(0, tipS-8); g.lineTo(0, tipS-40); g.stroke();
  }

  // ---------- SHAFT (plain gold pole) ----------
  pen.paint(()=>{ g.rect(-w/2, collarS, w, S.footTopS-collarS); },
            toneSolid(inkLevel(params.shaftLvl)), 5);
  // round the pole: bright edge left, darker face right
  g.fillStyle=inkLevel(params.goldLo); g.fillRect(-w/2+3, collarS+6, w*0.17, (S.footTopS-collarS)-12);
  g.fillStyle=inkLevel(6);             g.fillRect(w/2-w*0.24, collarS+6, w*0.24, (S.footTopS-collarS)-12);
  // a couple of incised binding rings down the shaft (seer's staff detail)
  for(const t of [0.30,0.58,0.82]){
    const ys = lerp(collarS, S.footTopS, t);
    pen.paint(()=>{ g.rect(-(w+6)/2, ys, w+6, 9); }, toneSolid(inkLevel(6)), 3);
  }

  // ---------- TAPERED FERRULE FOOT ----------
  const ferrTop=S.footTopS;
  pen.paint(()=>{ g.rect(-(w+8)/2, ferrTop, w+8, 20); }, toneSolid(inkLevel(6)), 5); // collar ferrule
  pen.paint(()=>{ g.moveTo(-(w+3)/2, ferrTop+20); g.lineTo((w+3)/2, ferrTop+20);
                  g.lineTo(0, S.footEndS); g.closePath(); }, toneSolid(inkLevel(params.gold)), 5);
  g.fillStyle=inkLevel(params.goldLo); // foot highlight
  g.beginPath(); g.moveTo(-(w+3)/2+2, ferrTop+21); g.lineTo(-1, S.footEndS-4); g.lineTo(-2, ferrTop+21); g.closePath(); g.fill();

  // ---------- HAND-GRIP BAND (at the pivot) ----------
  const gTop=-params.gripLen*0.40, gBot=params.gripLen*0.60, gW=w+7;
  pen.paint(()=>{ g.rect(-gW/2, gTop, gW, gBot-gTop); }, toneSolid(inkLevel(6)), 5);
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let s=gTop+7; s<gBot-4; s+=9){   // cord cross-wrap
    g.beginPath(); g.moveTo(-gW/2, s); g.lineTo(gW/2, s+6); g.stroke();
  }

  // ---------- ORNATE FINIAL: stacked collar + knob + crowning ring ----------
  // stacked collar rings (two bands) just above the shaft
  pen.paint(()=>{ g.rect(-(w+16)/2, collarS-10, w+16, 12); }, toneSolid(inkLevel(params.gold)), 4);
  pen.paint(()=>{ g.rect(-(w+22)/2, collarS-26, w+22, 14); }, toneSolid(inkLevel(6)), 4);

  // round KNOB
  const knobR=params.knobR;
  pen.paint(()=>{ g.arc(0, knobS, knobR, 0, 7); }, toneSolid(inkLevel(params.gold)), 5);
  g.save(); g.beginPath(); g.arc(0,knobS,knobR,0,7); g.clip();
  g.fillStyle=inkLevel(params.goldLo);                       // crescent highlight
  g.beginPath(); g.arc(-knobR*0.28, knobS-knobR*0.26, knobR*0.62, 0, 7); g.fill();
  g.fillStyle=inkLevel(params.goldHi);                       // shadow arc
  g.beginPath(); g.arc(knobR*0.55, knobS+knobR*0.4, knobR*0.7, 0, 7); g.fill();
  g.restore();
  // a neck stem between knob and crowning ring
  pen.paint(()=>{ g.rect(-6, knobS-knobR-8, 12, 12); }, toneSolid(inkLevel(6)), 4);

  // crowning OPEN RING (annulus) at the very top
  const rO=params.ringOuter, rI=params.ringInner;
  pen.paint(()=>{
    g.arc(0, ringCy, rO, 0, Math.PI*2);
    g.arc(0, ringCy, rI, 0, Math.PI*2, true);   // punch the hole
  }, toneSolid(inkLevel(params.gold)), 5);
  // shade the ring: light on the upper-left arc, dark on the lower-right
  g.save();
  g.beginPath(); g.arc(0,ringCy,rO,0,Math.PI*2); g.arc(0,ringCy,rI,0,Math.PI*2,true); g.clip();
  g.strokeStyle=inkLevel(params.goldLo); g.lineWidth=(rO-rI)*0.55;
  g.beginPath(); g.arc(0,ringCy,(rO+rI)/2, Math.PI*0.9, Math.PI*1.6); g.stroke();
  g.strokeStyle=inkLevel(params.goldHi); g.lineWidth=(rO-rI)*0.55;
  g.beginPath(); g.arc(0,ringCy,(rO+rI)/2, Math.PI*0.0, Math.PI*0.55); g.stroke();
  g.restore();

  // ---------- PROPHECY-EMPHASIS: glint starburst off the finial ----------
  if (P.glint){
    g.strokeStyle=INK; g.lineCap="round";
    const rays=8;
    for(let i=0;i<rays;i++){
      const a=(i/rays)*Math.PI*2 + 0.2;
      const r0=rO+8, r1=rO+ (i%2? 40:24);
      g.lineWidth = i%2? 3.5 : 2.2;
      g.beginPath();
      g.moveTo(Math.cos(a)*r0, ringCy+Math.sin(a)*r0);
      g.lineTo(Math.cos(a)*r1, ringCy+Math.sin(a)*r1);
      g.stroke();
    }
    // a bright pinpoint spark at the ring's top-left
    g.fillStyle=inkLevel(0);
    g.beginPath(); g.arc(-rO*0.5, ringCy-rO*0.5, 6, 0, 7); g.fill();
    g.strokeStyle=INK; g.lineWidth=2;
    g.beginPath(); g.arc(-rO*0.5, ringCy-rO*0.5, 6, 0, 7); g.stroke();
  }

  g.restore();
}

export const asset = {
  id:"prop.golden-staff-of-tiresias",
  type:"PROP",
  name:"Golden Staff of Tiresias",
  statusWord:"CARRIED",
  scene:"OD-B11-S03",

  params,
  // back -> front draw order the module honors
  layers:["ground","motion","shaft","foot","grip","finial","glint"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'carry' pose; the runtime re-derives them under rotation from the pivot).
  anchors:{
    grip:{x:.50,y:.52},          // where the seer's hand takes the shaft (the pivot)
    "grip:second":{x:.50,y:.60}, // off-hand / two-handed hold
    knob:{x:.50,y:.24},          // ornate knob (the "point" that emphasizes prophecy)
    ring:{x:.50,y:.15},          // crowning open ring (top)
    "contact:ground":{x:.51,y:.84}, // ferrule foot ground contact when planted
    balance:{x:.50,y:.50},       // center of mass (near the pivot)
  },
  // collision shape: a thin oriented capsule along the shaft (asset space)
  collision:{ kind:"capsule", a:{x:.50,y:.15}, b:{x:.51,y:.84}, r:.03 },
  ownership:"tiresias",          // the underworld prophet's authority object

  states:{
    initial:"carry",
    nodes:{
      carry:   { preview:{ mode:"carry",    status:"CARRIED",  progress:0.30 } },
      ground:  { preview:{ mode:"ground",   status:"PLANTED",  progress:0.10 } },
      point:   { preview:{ mode:"point",    status:"POINTING", progress:0.62 } },
      prophecy:{ preview:{ mode:"prophecy", status:"PROPHECY", progress:1.00 } },
    },
    edges:[
      ["carry","ground"],["ground","carry"],
      ["carry","point"],["point","carry"],
      ["ground","prophecy"],["prophecy","ground"],
      ["carry","prophecy"],["prophecy","carry"],
    ],
  },
  channels:["angle","state","glint","t"],

  preview:()=>({ mode:"carry", status:"CARRIED", progress:0.30, t:0 }),
  draw(ctx,W,H,state){ drawStaff(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
