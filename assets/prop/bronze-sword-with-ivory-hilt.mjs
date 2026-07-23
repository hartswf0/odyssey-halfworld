/* prop.bronze-sword-with-ivory-hilt — a bronze sword with a light ivory hilt
   and its scabbard. PROP asset. A single reusable object: leaf-bladed bronze
   sword (Naue II type), a bright ivory grip + crescent pommel + collar guard,
   and a matching sheath with throat, binding rings, and a bronze chape.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B08-S04): a sheathable GIFT weapon cycling through
   carry / present / accept / wear / sheathed. The whole object is drawn along
   a local axis and rotated about the GRIP pivot per state, so grip and contact
   anchors stay meaningful as it moves. When sheathed, the blade region is
   drawn as the scabbard instead of the bare blade; the ivory hilt stays proud.
   Tone plan (atlas): blade dark-mid, scabbard mid, hilt BRIGHT ivory. */
import { makePen, toneSolid, inkLevel, INK, clamp } from "../../engine/halfworld-engine.mjs";

const params = {
  length:600,        // full object length in source px (fits 660x880 at any angle)
  bladeLen:380,      // bronze leaf-blade length
  bladeHalfW:26,     // blade half-width at the shoulder
  bladeSwellW:32,    // blade half-width at the leaf swell (mid)
  gripLen:108,       // ivory grip length
  gripW:30,          // ivory grip thickness
  guardW:120,        // crossguard span
  guardH:22,         // crossguard height
  pommelR:30,        // crescent pommel radius
  scabW:40,          // scabbard half-width (wider than the blade)
  bronze:5,          // dark-mid ink level for the bronze blade
  ivory:1,           // BRIGHT ivory for the hilt (near paper)
  ivoryEdge:3,       // ivory shadow face for roundness
  sheath:4,          // mid ink level for the scabbard body
  fitting:6,         // bronze fittings (throat, rings, chape)
};

/* along-axis station positions, measured from the GRIP pivot.
   negative = toward the point (up), positive = toward the pommel (down). */
function stations(){
  const gripTopS  = -params.gripLen*0.5;                 // top of grip = guard seat
  const gripBotS  =  params.gripLen*0.5;                 // bottom of grip
  const pommelS   =  gripBotS + params.pommelR*0.6;      // pommel center
  const guardS    =  gripTopS;                           // crossguard center line
  const shoulderS =  guardS - params.guardH*0.5;         // blade base (shoulder)
  const tipS      =  shoulderS - params.bladeLen;        // blade point
  const midBladeS = (tipS + shoulderS) * 0.5;
  const throatS   =  shoulderS + 6;                      // scabbard mouth
  const chapeS    =  tipS - 14;                          // scabbard toe (past the point)
  return { gripTopS, gripBotS, pommelS, guardS, shoulderS, tipS, midBladeS, throatS, chapeS };
}

/* per-state pose: rotation about the grip pivot + scene extras */
const POSE = {
  carry:   { angle:-0.12, status:"CARRIED",   progress:0.30, sheathed:false },
  present: { angle: 1.5708,status:"PRESENTED", progress:0.62, sheathed:false, cloth:true },
  accept:  { angle: 1.16,  status:"ACCEPTED",  progress:0.80, sheathed:false },
  wear:    { angle: 0.62,  status:"WORN",      progress:0.10, sheathed:true, baldric:true },
  sheathed:{ angle: 0.00,  status:"SHEATHED",  progress:0.05, sheathed:true },
};

function drawSword(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "carry";
  const P = POSE[mode] || POSE.carry;
  const sheathed = st.sheathed ?? P.sheathed;
  const S = stations();
  const pivot = { x:W*0.50, y:H*0.585 };

  // ---------- scene support drawn in SCREEN space (not rotated) ----------
  if (P.cloth){
    // a folded presentation cloth the gift is laid across
    const cy = pivot.y + 66, cw = W*0.74, ch = 74;
    pen.paint(()=>{ g.moveTo(pivot.x-cw/2, cy);
      g.lineTo(pivot.x+cw/2, cy-14);
      g.lineTo(pivot.x+cw/2, cy+ch);
      g.lineTo(pivot.x-cw/2, cy+ch+14); g.closePath(); }, toneSolid(inkLevel(2)), 4);
    // soft fold lines
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let i=1;i<5;i++){ const x=pivot.x-cw/2+cw*i/5;
      g.beginPath(); g.moveTo(x, cy-6); g.lineTo(x, cy+ch+6); g.stroke(); }
    g.globalAlpha=1;
  }
  if (P.baldric){
    // a leather baldric strap the sheathed sword hangs from (diagonal band)
    const bx=W*0.30, ang=P.angle;
    g.save(); g.translate(bx, H*0.16); g.rotate(ang);
    pen.paint(()=>{ g.rect(-16, 0, 32, H*0.92); }, toneSolid(inkLevel(3)), 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let s=24; s<H*0.9; s+=30){ g.beginPath(); g.moveTo(-16,s); g.lineTo(16,s); g.stroke(); }
    g.globalAlpha=1; g.restore();
  }

  // ---------- everything below is drawn in the ROTATED sword frame ----------
  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  if (!sheathed){
    // ======== BARE BRONZE LEAF-BLADE (dark-mid) ========
    const bw=params.bladeHalfW, sw=params.bladeSwellW;
    const bladePath = ()=>{
      g.moveTo(0, S.tipS);                                   // point
      g.quadraticCurveTo( sw, S.midBladeS,  bw, S.shoulderS); // right edge (leaf swell)
      g.lineTo(-bw, S.shoulderS);
      g.quadraticCurveTo(-sw, S.midBladeS,  0, S.tipS);       // left edge
    };
    pen.paint(bladePath, toneSolid(inkLevel(params.bronze)), 5);
    // bevel: light left face, dark right face, for hammered-bronze roundness
    g.save(); g.beginPath(); bladePath(); g.clip();
    g.fillStyle=inkLevel(2);
    g.beginPath(); g.moveTo(0,S.tipS+8);
    g.quadraticCurveTo(-sw*0.72,S.midBladeS,-3,S.shoulderS-3);
    g.lineTo(-sw,S.midBladeS); g.closePath(); g.fill();
    g.fillStyle=inkLevel(7);
    g.beginPath(); g.moveTo(bw-2,S.shoulderS-3);
    g.quadraticCurveTo(sw*0.9,S.midBladeS,2,S.tipS+12);
    g.lineTo(sw,S.midBladeS); g.closePath(); g.fill();
    g.restore();
    // raised midrib down the blade
    pen.ink(()=>{ g.moveTo(0, S.tipS+10); g.lineTo(0, S.shoulderS-3); }, 3);
  } else {
    // ======== SCABBARD over the blade (mid tone) ========
    const scw=params.scabW;
    const scabPath = ()=>{
      g.moveTo(-scw, S.throatS);
      g.lineTo( scw, S.throatS);
      g.lineTo( scw*0.72, S.chapeS+18);
      g.quadraticCurveTo(0, S.chapeS, -scw*0.72, S.chapeS+18); // rounded toe
      g.closePath();
    };
    pen.paint(scabPath, toneSolid(inkLevel(params.sheath)), 5);
    // a lengthwise seam + a light left face for roundness
    g.save(); g.beginPath(); scabPath(); g.clip();
    g.fillStyle=inkLevel(2); g.fillRect(-scw+3, S.throatS, scw*0.4, S.chapeS-S.throatS);
    g.restore();
    pen.ink(()=>{ g.moveTo(0, S.throatS+6); g.lineTo(0, S.chapeS+6); }, 2);
    // THROAT collar (bronze fitting) at the mouth
    pen.paint(()=>{ g.rect(-scw-3, S.throatS-4, (scw+3)*2, 26); }, toneSolid(inkLevel(params.fitting)), 5);
    // two binding rings down the sheath
    for(const f of [0.34, 0.66]){
      const ry = S.throatS + (S.chapeS - S.throatS)*f;
      const rw = scw*(1 - f*0.24);
      pen.paint(()=>{ g.rect(-rw-2, ry, (rw+2)*2, 16); }, toneSolid(inkLevel(params.fitting)), 4);
    }
    // CHAPE (bronze toe cap)
    pen.paint(()=>{ g.moveTo(-scw*0.78, S.chapeS+30);
      g.lineTo(scw*0.78, S.chapeS+30);
      g.lineTo(scw*0.5, S.chapeS+10);
      g.quadraticCurveTo(0, S.chapeS-4, -scw*0.5, S.chapeS+10); g.closePath();
    }, toneSolid(inkLevel(params.fitting)), 5);
  }

  // ======== CROSSGUARD (collar guard, ivory-shadow tone so it reads) ========
  const gw=params.guardW, gh=params.guardH;
  pen.paint(()=>{ g.moveTo(-gw/2, S.guardS);
    g.quadraticCurveTo(0, S.guardS-gh*0.7, gw/2, S.guardS);
    g.lineTo(gw/2-6, S.guardS+gh);
    g.quadraticCurveTo(0, S.guardS+gh*0.5, -gw/2+6, S.guardS+gh);
    g.closePath(); }, toneSolid(inkLevel(params.ivoryEdge)), 5);

  // ======== IVORY GRIP (BRIGHT — near paper) ========
  const grw=params.gripW;
  pen.paint(()=>{ g.rect(-grw/2, S.gripTopS, grw, S.gripBotS-S.gripTopS); },
            toneSolid(inkLevel(params.ivory)), 5);
  // subtle shadow face on the right for cylindrical ivory
  g.fillStyle=inkLevel(params.ivoryEdge);
  g.fillRect(grw/2-grw*0.28, S.gripTopS+3, grw*0.28, (S.gripBotS-S.gripTopS)-6);
  // three carved ivory ring-grooves
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let k=1;k<=3;k++){ const y=S.gripTopS + (S.gripBotS-S.gripTopS)*k/4;
    g.beginPath(); g.moveTo(-grw/2, y); g.lineTo(grw/2, y); g.stroke(); }

  // ======== CRESCENT IVORY POMMEL (BRIGHT) ========
  const pr=params.pommelR;
  pen.paint(()=>{ g.ellipse(0, S.pommelS, pr, pr*0.82, 0, 0, 7); },
            toneSolid(inkLevel(params.ivory)), 5);
  // pommel shadow crescent + rivet dot
  g.fillStyle=inkLevel(params.ivoryEdge);
  g.beginPath(); g.ellipse(pr*0.28, S.pommelS+2, pr*0.55, pr*0.62, 0, 0, 7); g.fill();
  g.fillStyle=INK; g.beginPath(); g.arc(0, S.pommelS, 3.4, 0, 7); g.fill();

  g.restore();
}

export const asset = {
  id:"prop.bronze-sword-with-ivory-hilt",
  type:"PROP",
  name:"Bronze Sword with Ivory Hilt",
  statusWord:"GIFTED",
  scene:"OD-B08-S04",

  params,
  // back -> front draw order the module honors
  layers:["cloth-or-baldric","blade-or-scabbard","fittings","guard","grip","pommel"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'carry' pose, blade up; the runtime re-derives them under rotation).
  anchors:{
    grip:{x:.50,y:.52},          // where the hand takes the ivory grip (pivot)
    "grip:offhand":{x:.50,y:.56},// second hand when presented flat
    pommel:{x:.50,y:.60},        // ivory pommel (balance counterweight)
    guard:{x:.50,y:.44},         // crossguard line
    tip:{x:.50,y:.07},           // blade point
    "contact:palm":{x:.50,y:.48},// laid across an open palm when presented
    throat:{x:.50,y:.43},        // scabbard mouth (where blade enters sheath)
    chape:{x:.50,y:.05},         // scabbard toe
    "attach:baldric":{x:.50,y:.46}, // sheath ring the strap clips to when worn
  },
  // collision shape: a thin oriented capsule along the object (asset space)
  collision:{ kind:"capsule", a:{x:.50,y:.07}, b:{x:.50,y:.60}, r:.05 },
  ownership:"host-gift",          // a guest-gift; transfers owner on accept

  states:{
    initial:"carry",
    nodes:{
      carry:   { preview:{ mode:"carry",    status:"CARRIED",   progress:0.30 } },
      present: { preview:{ mode:"present",  status:"PRESENTED", progress:0.62 } },
      accept:  { preview:{ mode:"accept",   status:"ACCEPTED",  progress:0.80 } },
      wear:    { preview:{ mode:"wear",     status:"WORN",      progress:0.10 } },
      sheathed:{ preview:{ mode:"sheathed", status:"SHEATHED",  progress:0.05 } },
    },
    edges:[
      ["carry","present"],["present","accept"],["accept","carry"],
      ["accept","sheathed"],["sheathed","wear"],["wear","sheathed"],
      ["carry","sheathed"],["sheathed","carry"],
    ],
  },
  channels:["angle","state","sheathed","t"],

  preview:()=>({ mode:"carry", status:"CARRIED", progress:0.30, t:0 }),
  draw(ctx,W,H,state){ drawSword(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
