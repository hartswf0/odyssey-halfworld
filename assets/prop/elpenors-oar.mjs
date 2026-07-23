/* prop.elpenors-oar — the ship's oar Elpenor pulled in life and that,
   at his ghost's request, is planted upright over his grave-mound.
   PROP asset. One reusable long wooden oar (blade + loom + handle) drawn
   along a local axis and rotated about a BALANCE pivot per state, so a single
   body carries the whole arc: rowing at sea → carried up the beach → set as a
   grave-marker → planted in the mound → the finished, continuity-complete
   barrow. Situation states (water + oarlock, earth mound, binding + name-tablet)
   are SCREEN/frame-space overlays. Drawn in SOLID grays + hard contour into the
   offscreen ctx; the engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B11-S02): crew oar cycling through
   ship-use / carried / grave-marker / planted / continuity-complete.
   Atlas: isolated reusable object; scale, grip/support/contact anchors,
   ownership, collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  length:700,     // oar length along its axis in source px (fits 660x880)
  bladeHalf:48,   // max blade half-width (the flat paddle)
  bladeFrac:0.26, // fraction of length taken up by the blade
  loomHalf:13,    // half-width of the round loom (shaft)
  gripHalf:17,    // half-width of the swelled handle grip
  gripFrac:0.07,  // fraction of length taken up by the handle
  wood:3,         // base ink level for the oar wood
};

/* along-axis stations measured from the BALANCE pivot.
   negative = toward the blade (up when planted), positive = toward the handle. */
function stations(){
  const L = params.length;
  const bladeS  = -L*0.60;                 // blade tip
  const handleS =  L*0.40;                 // handle end
  const throatS =  bladeS + L*params.bladeFrac;  // blade -> loom
  const gripS   =  handleS - L*params.gripFrac;  // loom -> handle grip
  return { L, bladeS, handleS, throatS, gripS };
}

/* per-state pose: rotation about the balance pivot + situation flags.
   water/oarlock: at sea in the thole. mound: planted in a barrow of earth.
   tie: bound with cord + a name-tablet (a marked grave). wreath: mourning tie. */
const POSE = {
  "ship-use":           { angle: 0.60, water:1, oarlock:1, motion:"row", status:"SHIP-USE",            progress:0.14 },
  "carried":            { angle:-1.16,                     motion:"carry",status:"CARRIED",             progress:0.38 },
  "grave-marker":       { angle: 0.00, mound:1, tie:1,                    status:"GRAVE-MARKER",        progress:0.66 },
  "planted":            { angle: 0.00, mound:1,                           status:"PLANTED",             progress:0.84 },
  "continuity-complete":{ angle: 0.00, mound:1, tie:1, wreath:1,          status:"CONTINUITY-COMPLETE", progress:1.00 },
};

/* trace the oar silhouette in the local (rotated) frame. Sub-path only —
   the caller wraps it in pen.paint()/clip(). A wide leaf blade tapering
   through a throat into a straight loom that swells to a rounded handle. */
function bodyPath(g, S){
  const HB=params.bladeHalf, HL=params.loomHalf, HG=params.gripHalf;
  const bMid = S.bladeS + (S.throatS-S.bladeS)*0.42;   // widest part of blade
  const bLow = S.throatS - (S.throatS-S.bladeS)*0.18;  // blade shoulder into loom
  g.moveTo(0, S.bladeS);                                            // blade apex (up)
  g.quadraticCurveTo( HB*0.9, bMid, HB*0.72, bLow);                 // blade right
  g.quadraticCurveTo( HL*1.7,  S.throatS, HL, S.throatS+8);         // throat right
  g.lineTo( HL, S.gripS);                                           // loom right (straight)
  g.quadraticCurveTo( HG, S.gripS+6, HG, (S.gripS+S.handleS)/2);    // grip swell right
  g.quadraticCurveTo( HG, S.handleS, 0, S.handleS);                 // rounded handle end
  g.quadraticCurveTo(-HG, S.handleS, -HG, (S.gripS+S.handleS)/2);   // grip swell left
  g.quadraticCurveTo(-HG, S.gripS+6, -HL, S.gripS);
  g.lineTo(-HL, S.throatS+8);                                       // loom left
  g.quadraticCurveTo(-HL*1.7, S.throatS, -HB*0.72, bLow);           // throat left
  g.quadraticCurveTo(-HB*0.9, bMid, 0, S.bladeS);                   // blade left
  g.closePath();
}

function drawOar(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "planted";
  const P = POSE[mode] || POSE.planted;
  const S = stations();
  const HB=params.bladeHalf;
  const pivot = { x:W*0.50, y:H*0.58 };
  const groundY = H*0.86;

  // ---------- SITUATION in SCREEN space (not rotated) ----------
  // sea + a suggestion of the ship's gunwale for the rowing state
  if (P.water){
    // waterline band
    g.fillStyle=inkLevel(2); g.fillRect(0, groundY, W, H-groundY);
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.55;
    for(let k=0;k<3;k++){ const y=groundY+18+k*22;
      g.beginPath();
      for(let x=0;x<=W;x+=26){ const yy=y+Math.sin((x/W)*7+k)*5; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
      g.stroke(); }
    g.globalAlpha=1;
  }

  // earth grave-mound (planted states): low barrow the handle is driven into
  if (P.mound){
    const my = groundY;
    pen.paint(()=>{
      g.moveTo(W*0.10, H*0.98);
      g.quadraticCurveTo(W*0.26, my-H*0.02, W*0.50, my-H*0.06);
      g.quadraticCurveTo(W*0.74, my-H*0.02, W*0.90, H*0.98);
      g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // clods so the barrow isn't a flat blob
    g.fillStyle=inkLevel(5);
    for(let i=0;i<8;i++){ const x=W*(0.18+i*0.085), y=my+H*(0.02+0.03*Math.sin(i*1.9));
      g.beginPath(); g.ellipse(x,y,W*0.045,H*0.02,0,0,7); g.fill(); }
    g.fillStyle=inkLevel(3);
    for(let i=0;i<6;i++){ const x=W*(0.24+i*0.09), y=my+H*(0.08+0.03*Math.cos(i*2.2));
      g.beginPath(); g.ellipse(x,y,W*0.03,H*0.014,0,0,7); g.fill(); }
    // stone kerb at the barrow foot
    g.strokeStyle=INK; g.lineWidth=2.4; g.globalAlpha=0.6;
    g.beginPath(); g.moveTo(W*0.16, H*0.955); g.quadraticCurveTo(W*0.5, H*0.90, W*0.84, H*0.955); g.stroke();
    g.globalAlpha=1;
  }

  // ---------- everything below is drawn in the ROTATED oar frame ----------
  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  // motion cues for the dynamic states
  if (P.motion){
    g.strokeStyle="rgba(0,0,0,0.18)"; g.lineCap="round";
    if (P.motion==="row"){
      g.lineWidth=5; g.beginPath(); g.arc(0, S.bladeS+140, 150, Math.PI*1.05, Math.PI*1.42); g.stroke();
    } else {
      for(let i=0;i<3;i++){ g.lineWidth=6-i*1.2; g.beginPath();
        g.moveTo(HB*1.3+i*14, S.bladeS+40+i*24); g.lineTo(HB*1.9+i*14, S.bladeS+70+i*24); g.stroke(); }
    }
  }

  // ---------- OAR BODY ----------
  pen.paint(()=>bodyPath(g,S), toneSolid(inkLevel(params.wood)), 5);

  // round the oar: bright left edge, dark right face (clipped to the body)
  g.save(); g.beginPath(); bodyPath(g,S); g.clip();
  const HL=params.loomHalf;
  // loom shading strips
  g.fillStyle=inkLevel(2); g.fillRect(-HL, S.throatS, HL*0.5, S.handleS-S.throatS);       // left highlight
  g.fillStyle=inkLevel(5); g.fillRect(HL*0.28, S.throatS, HL*0.8, S.handleS-S.throatS);    // right shadow
  // blade facets: bright left half, darker right half, split by the central spine
  g.fillStyle=inkLevel(2); g.beginPath();
  g.moveTo(0,S.bladeS); g.lineTo(-HB*0.72,(S.bladeS+S.throatS)*0.5); g.lineTo(-2,S.throatS); g.lineTo(0,S.bladeS); g.fill();
  g.fillStyle=inkLevel(5); g.beginPath();
  g.moveTo(0,S.bladeS); g.lineTo(HB*0.72,(S.bladeS+S.throatS)*0.5); g.lineTo(2,S.throatS); g.lineTo(0,S.bladeS); g.fill();
  // long wood grain down the loom
  g.strokeStyle=INK; g.lineWidth=1.6; g.lineCap="round"; g.globalAlpha=0.45;
  for(let k=-1;k<=1;k++){ const off=k*HL*0.5;
    g.beginPath(); g.moveTo(off, S.throatS+10);
    g.bezierCurveTo(off+HL*0.5,(S.throatS+S.gripS)*0.4, off-HL*0.4,(S.throatS+S.gripS)*0.7, off+HL*0.2, S.gripS);
    g.stroke(); }
  g.globalAlpha=1;
  g.restore(); // end body clip

  // central spine ridge of the blade
  g.strokeStyle=INK; g.lineWidth=2.6; g.lineCap="round";
  g.beginPath(); g.moveTo(0, S.bladeS+6); g.lineTo(0, S.throatS); g.stroke();
  // a couple of grain ribs fanning off the spine
  g.lineWidth=1.6; g.globalAlpha=0.5;
  for(let i=1;i<=3;i++){ const s=S.bladeS+(S.throatS-S.bladeS)*(0.22*i+0.12); const w=HB*(0.55-0.1*i);
    g.beginPath(); g.moveTo(0,s-6); g.quadraticCurveTo( w*0.6, s, w, s+10); g.stroke();
    g.beginPath(); g.moveTo(0,s-6); g.quadraticCurveTo(-w*0.6, s,-w, s+10); g.stroke(); }
  g.globalAlpha=1;

  // handle collar ring
  g.strokeStyle=INK; g.lineWidth=2.2;
  g.beginPath(); g.ellipse(0, S.gripS+6, params.gripHalf*0.9, 5, 0, 0, 7); g.stroke();

  // ---------- GRAVE binding + name-tablet (marker states) ----------
  if (P.tie){
    // cord lashing around the upper loom
    g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
    const ty=S.throatS+34;
    for(let i=0;i<4;i++){ const y=ty+i*9;
      g.beginPath(); g.moveTo(-HL-3, y-3); g.lineTo(HL+3, y+3); g.stroke(); }
    // a small hanging name-tablet
    g.save(); g.translate(HL+18, ty+8); g.rotate(0.12);
    pen.paint(()=>{ g.rect(-2,-14, 34, 40); }, toneSolid(inkLevel(2)), 3);
    g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.7;
    for(let r=0;r<3;r++){ g.beginPath(); g.moveTo(4, -4+r*10); g.lineTo(26, -4+r*10); g.stroke(); }
    g.globalAlpha=1;
    // tie thread from loom to tablet
    g.strokeStyle=INK; g.lineWidth=1.8; g.beginPath(); g.moveTo(-16,-6); g.lineTo(0,-10); g.stroke();
    g.restore();
  }

  // ---------- mourning wreath at the blade (continuity-complete) ----------
  if (P.wreath){
    g.strokeStyle=INK; g.lineWidth=3;
    g.beginPath(); g.ellipse(0, S.throatS-6, HB*0.6, HB*0.34, 0, 0, 7); g.stroke();
    g.fillStyle=inkLevel(5);
    for(let i=0;i<10;i++){ const a=i/10*Math.PI*2, rx=HB*0.6, ry=HB*0.34;
      g.beginPath(); g.ellipse(Math.cos(a)*rx, S.throatS-6+Math.sin(a)*ry, 5, 8, a, 0, 7); g.fill(); }
  }

  g.restore(); // end rotated frame

  // ---------- thole-pin / oarlock at the balance point (ship-use) ----------
  if (P.oarlock){
    pen.paint(()=>{ g.rect(pivot.x-46, pivot.y-6, 92, 16); }, toneSolid(inkLevel(6)), 4); // gunwale bar
    pen.paint(()=>{ g.rect(pivot.x-8, pivot.y-24, 7, 22); }, toneSolid(inkLevel(7)), 3);    // thole pin
    pen.paint(()=>{ g.rect(pivot.x+6, pivot.y-24, 7, 22); }, toneSolid(inkLevel(7)), 3);
  }
}

export const asset = {
  id:"prop.elpenors-oar",
  type:"PROP",
  name:"Elpenor's Oar",
  statusWord:"PLANTED",
  scene:"OD-B11-S02",

  params,
  // back -> front draw order the module honors
  layers:["sea-or-mound","motion","oar-body","surface","spine","collar","tie-tablet","wreath","oarlock"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'planted' pose ~vertical, blade up; the runtime re-derives them under
  // rotation from the balance pivot).
  anchors:{
    blade:{x:.50,y:.10},            // flat paddle end (into the water / up on the mound)
    throat:{x:.50,y:.29},           // blade meets loom
    "grip:loom":{x:.50,y:.45},      // outboard hand on the loom
    "grip:pull":{x:.50,y:.63},      // inboard hand at the handle
    handle:{x:.50,y:.90},           // handle end (driven into the mound)
    balance:{x:.50,y:.58},          // centre of mass (pivot / thole seat)
    "contact:oarlock":{x:.50,y:.58},// rides the thole pin at sea
    "contact:mound":{x:.50,y:.86},  // where it enters the grave-barrow
  },
  // collision shape: an oriented capsule along the oar axis (asset space)
  collision:{ kind:"capsule", a:{x:.50,y:.10}, b:{x:.50,y:.90}, r:.06 },
  ownership:"elpenor",              // the crewman's own oar, planted over his grave

  states:{
    initial:"ship-use",
    nodes:{
      "ship-use":           { preview:{ mode:"ship-use",            status:"SHIP-USE",            progress:0.14 } },
      "carried":            { preview:{ mode:"carried",             status:"CARRIED",             progress:0.38 } },
      "grave-marker":       { preview:{ mode:"grave-marker",        status:"GRAVE-MARKER",        progress:0.66 } },
      "planted":            { preview:{ mode:"planted",             status:"PLANTED",             progress:0.84 } },
      "continuity-complete":{ preview:{ mode:"continuity-complete", status:"CONTINUITY-COMPLETE", progress:1.00 } },
    },
    edges:[
      ["ship-use","carried"],["carried","grave-marker"],
      ["grave-marker","planted"],["planted","continuity-complete"],
      ["grave-marker","continuity-complete"],
    ],
  },
  channels:["mode","angle","t"],

  preview:()=>({ mode:"planted", status:"PLANTED", progress:0.84, t:0 }),
  draw(ctx,W,H,state){ drawOar(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
