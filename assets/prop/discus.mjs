/* prop.discus — the heavy stone throwing disk of the Phaeacian games.
   PROP asset. A single reusable object: a thick round discus with a raised
   central hub, a machined rim, and a bright edge highlight. Drawn in SOLID
   grays + hard contour into the offscreen ctx; the engine dotify pass supplies
   the halftone. Do NOT pre-dither.

   Scene function (OD-B08-S03): one heavy disk cycling through
   grip / wind-up / flight-arc / ground-strike / mark / retrieve. The disk is
   drawn about its own center with a foreshortening TILT + a SPIN rotation per
   state; the flight state adds a parabolic motion arc and a landing mark, and
   the ground states add an impact/measure diagram. Grip and contact anchors
   stay meaningful across the throw.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  radius:150,      // disk radius in source px at grip scale (fits 660x880)
  thickness:0.15,  // edge depth as a fraction of radius
  hub:0.24,        // raised-hub radius as a fraction of radius
  faceLvl:4,       // ink level for the stone face
  rimLvl:6,        // ink level for the machined edge / rim
  hubLvl:6,        // ink level for the raised hub
  edgeHi:1,        // ink level for the bright edge highlight
};

/* per-state pose: disk center, size, foreshortening tilt, spin, + scene flags.
   cx/cy/r are fractions of W/H/W. tilt 1 = face-on, ~0.3 = lying flat on ground. */
const POSE = {
  grip:     { cx:0.50, cy:0.50, r:0.285, tilt:0.52, rot:-0.16, status:"GRIPPED",  progress:0.30, grip:true },
  windup:   { cx:0.60, cy:0.55, r:0.215, tilt:0.86, rot: 0.52, status:"WOUND",    progress:0.16, ground:true, windup:true },
  flight:   { cx:0.52, cy:0.29, r:0.130, tilt:0.66, rot: 0.42, status:"IN FLIGHT",progress:0.60, flight:true, spin:true },
  strike:   { cx:0.66, cy:0.63, r:0.200, tilt:0.50, rot: 0.94, status:"STRUCK",   progress:0.88, ground:true, strike:true },
  mark:     { cx:0.42, cy:0.66, r:0.200, tilt:0.30, rot: 0.00, status:"MARKED",   progress:1.00, ground:true, mark:true },
  retrieve: { cx:0.50, cy:0.64, r:0.210, tilt:0.30, rot: 0.10, status:"RETRIEVE", progress:0.10, ground:true, retrieve:true },
};

/* a light perspective ground band in SCREEN space */
function drawGround(g, pen, W, H, gy){
  g.fillStyle = inkLevel(2); g.fillRect(0, gy, W, H-gy);
  pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
  for(let x=W*0.10;x<W;x+=W*0.14){ g.beginPath(); g.moveTo(x,gy); g.lineTo(x-W*0.05,H); g.stroke(); }
  g.globalAlpha=1;
}

/* the disk itself, drawn about (cx,cy) with foreshorten tilt + spin rot */
function drawDisk(g, pen, cx, cy, r, tilt, rot){
  const ry = r*tilt, th = r*params.thickness;
  g.save(); g.translate(cx,cy); g.rotate(rot);

  // ---- EDGE / THICKNESS band (the machined side, dark) ----
  pen.paint(()=>{
    g.moveTo(r, 0);
    g.ellipse(0, 0,  r, ry, 0, 0, Math.PI, false);   // top face, bottom rim: right->bottom->left
    g.lineTo(-r, th);
    g.ellipse(0, th, r, ry, 0, Math.PI, 0, true);    // bottom face bottom rim: left->bottom->right
    g.closePath();
  }, toneSolid(inkLevel(params.rimLvl)), 5);

  // ---- FACE (stone, mid tone) ----
  pen.paint(()=>{ g.ellipse(0,0, r, ry, 0, 0, 7); }, toneSolid(inkLevel(params.faceLvl)), 5);

  // ---- bright EDGE HIGHLIGHT along the upper-left rim ----
  g.save();
  g.beginPath(); g.ellipse(0,0, r, ry, 0, 0, 7); g.clip();
  g.strokeStyle = inkLevel(params.edgeHi); g.lineWidth = Math.max(4, r*0.11); g.lineCap="round";
  g.beginPath(); g.ellipse(0,0, r*0.95, ry*0.95, 0, Math.PI*1.02, Math.PI*1.92); g.stroke();
  // a darker settle along the lower-right rim for volume
  g.strokeStyle = inkLevel(7); g.lineWidth = Math.max(3, r*0.08);
  g.beginPath(); g.ellipse(0,0, r*0.95, ry*0.95, 0, Math.PI*0.06, Math.PI*0.9); g.stroke();
  g.restore();

  // ---- concentric machined rings + raised HUB ----
  pen.ink(()=>{ g.ellipse(0,0, r*0.66, ry*0.66, 0, 0, 7); }, 2.4);
  pen.paint(()=>{ g.ellipse(0,0, r*params.hub, ry*params.hub, 0, 0, 7); }, toneSolid(inkLevel(params.hubLvl)), 4);
  // hub sheen
  g.fillStyle = inkLevel(2);
  g.beginPath(); g.ellipse(-r*0.06, -ry*0.06, r*params.hub*0.42, ry*params.hub*0.42, 0, 0, 7); g.fill();

  g.restore();
}

/* short curved spin/motion ticks around a flying disk */
function drawSpin(g, cx, cy, r){
  g.strokeStyle="rgba(0,0,0,0.30)"; g.lineWidth=4; g.lineCap="round";
  for(let i=0;i<3;i++){
    const a0 = -0.5 + i*2.1;
    g.beginPath(); g.arc(cx, cy, r*(1.16+i*0.12), a0, a0+0.7); g.stroke();
  }
}

function drawDiscus(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "grip";
  const P = POSE[mode] || POSE.grip;
  const cx = W*P.cx, cy = H*P.cy, r = W*P.r;
  const gy = H*0.72;

  // -------- SCENE GROUND (screen space) --------
  if (P.ground) drawGround(g, pen, W, H, gy);

  // -------- FLIGHT: parabolic arc + landing mark (behind the disk) --------
  if (P.flight){
    const p0={x:W*0.14,y:H*0.60}, p1={x:W*0.86,y:H*0.66}, ctrl={x:W*0.50,y:-H*0.10};
    g.strokeStyle="rgba(0,0,0,0.35)"; g.lineWidth=3.5; g.setLineDash([12,10]);
    g.beginPath(); g.moveTo(p0.x,p0.y); g.quadraticCurveTo(ctrl.x,ctrl.y, p1.x,p1.y); g.stroke();
    g.setLineDash([]);
    // throw point marker
    g.fillStyle=INK; g.beginPath(); g.arc(p0.x,p0.y,5,0,7); g.fill();
    // landing MARK: ground scuff + peg + pennant
    g.fillStyle="rgba(0,0,0,0.16)"; g.beginPath(); g.ellipse(p1.x,p1.y+6, r*0.5, r*0.16, 0,0,7); g.fill();
    pen.ink(()=>{ g.moveTo(p1.x,p1.y+6); g.lineTo(p1.x,p1.y-r*0.6); }, 5);
    g.fillStyle=ACCENT; g.beginPath();
    g.moveTo(p1.x,p1.y-r*0.6); g.lineTo(p1.x+r*0.34,p1.y-r*0.46); g.lineTo(p1.x,p1.y-r*0.33); g.closePath(); g.fill();
  }

  // -------- WIND-UP: coil sweep behind the disk --------
  if (P.windup){
    g.strokeStyle="rgba(0,0,0,0.30)"; g.lineWidth=5; g.lineCap="round";
    g.beginPath(); g.arc(W*0.40, cy-r*0.1, r*1.15, Math.PI*0.15, Math.PI*0.95); g.stroke();
    // arrowhead on the coil
    g.fillStyle="rgba(0,0,0,0.30)";
    const ax=W*0.40-r*1.15*0.15, ay=cy-r*0.1+r*1.05;
    g.beginPath(); g.moveTo(ax,ay); g.lineTo(ax-16,ay-6); g.lineTo(ax-4,ay+14); g.closePath(); g.fill();
  }

  // -------- STRIKE: impact crater + burst + debris (behind the disk) --------
  if (P.strike){
    g.fillStyle="rgba(0,0,0,0.18)"; g.beginPath(); g.ellipse(cx, gy+8, r*0.9, r*0.22, 0,0,7); g.fill();
    g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round";
    for(let i=0;i<7;i++){ const a=-Math.PI*0.86 + i*(Math.PI*0.72/6);
      g.beginPath(); g.moveTo(cx, gy); g.lineTo(cx+Math.cos(a)*r*0.95, gy+Math.sin(a)*r*0.72); g.stroke(); }
    g.fillStyle=INK;
    for(let i=0;i<5;i++){ const a=-0.4-i*0.5, d=r*(0.9+0.1*i);
      g.beginPath(); g.arc(cx+Math.cos(a)*d, gy-Math.abs(Math.sin(a))*r*0.5, 4,0,7); g.fill(); }
  }

  // -------- MARK: measuring stake + dashed measure line --------
  if (P.mark){
    const lineX0 = W*0.12, stakeX = cx + r*0.86;
    // throw-line post
    pen.paint(()=>{ g.rect(lineX0-4, gy-r*0.5, 8, r*0.5); }, toneSolid(inkLevel(5)), 4);
    // dashed measure line to the stake
    g.strokeStyle="rgba(0,0,0,0.40)"; g.lineWidth=3; g.setLineDash([10,8]);
    g.beginPath(); g.moveTo(lineX0, gy-r*0.16); g.lineTo(stakeX, gy-r*0.16); g.stroke();
    g.setLineDash([]);
    // measuring stake with pennant at the disk's landing edge
    pen.ink(()=>{ g.moveTo(stakeX, gy+4); g.lineTo(stakeX, gy-r*0.85); }, 5);
    g.fillStyle=ACCENT; g.beginPath();
    g.moveTo(stakeX, gy-r*0.85); g.lineTo(stakeX+r*0.38, gy-r*0.70); g.lineTo(stakeX, gy-r*0.56); g.closePath(); g.fill();
  }

  // -------- RETRIEVE: lift arrow + hand-contact tick --------
  if (P.retrieve){
    g.fillStyle="rgba(0,0,0,0.16)"; g.beginPath(); g.ellipse(cx, cy+r*0.24, r*0.9, r*0.20, 0,0,7); g.fill();
    g.strokeStyle=ACCENT; g.lineWidth=6; g.lineCap="round";
    g.beginPath(); g.moveTo(cx+r*0.1, cy-r*0.2); g.lineTo(cx+r*0.1, cy-r*1.05); g.stroke();
    g.fillStyle=ACCENT; g.beginPath();
    g.moveTo(cx+r*0.1, cy-r*1.22); g.lineTo(cx+r*0.1-16, cy-r*0.98); g.lineTo(cx+r*0.1+16, cy-r*0.98); g.closePath(); g.fill();
  }

  // -------- THE DISK --------
  if (P.spin) drawSpin(g, cx, cy, r);
  drawDisk(g, pen, cx, cy, r, P.tilt, P.rot);

  // -------- GRIP: finger-contact ticks along the near rim --------
  if (P.grip){
    g.strokeStyle=INK; g.lineWidth=5; g.lineCap="round";
    const ry = r*P.tilt;
    // curled-finger ticks hugging the lower-right rim (the hand cups the edge)
    g.save(); g.translate(cx,cy); g.rotate(P.rot);
    for(let i=0;i<4;i++){ const a = Math.PI*0.12 + i*Math.PI*0.20;
      const px = Math.cos(a)*r*1.02, py = Math.sin(a)*ry*1.02;
      const nx = Math.cos(a), ny = Math.sin(a);
      g.beginPath(); g.moveTo(px, py); g.lineTo(px+nx*r*0.16, py+ny*ry*0.16); g.stroke();
    }
    g.restore();
  }
}

export const asset = {
  id:"prop.discus",
  type:"PROP",
  name:"Discus",
  statusWord:"GRIPPED",
  scene:"OD-B08-S03",

  params,
  // back -> front draw order the module honors
  layers:["ground","arc-or-measure","impact","spin","edge","face","highlight","hub","grip"],

  // normalized 0..1 attachment / contact anchors (measured in the neutral
  // 'grip' pose; the runtime re-derives them under tilt/spin from the center).
  anchors:{
    center:{x:.50,y:.47},          // center of mass / pivot
    grip:{x:.50,y:.47},            // where the throwing hand takes the disk
    "grip:fingers":{x:.66,y:.55},  // curled fingers cup the lower-right rim
    "grip:thumb":{x:.38,y:.42},    // thumb rides the upper-left rim
    "rim:top":{x:.50,y:.35},       // upper edge (edge-highlight side)
    "rim:bottom":{x:.50,y:.60},    // lower machined edge
    "contact:ground":{x:.50,y:.72},// where the disk meets the ground on landing
    "mark:landing":{x:.72,y:.68},  // struck / measured landing point
  },
  // collision shape: a flat disk (thin oblate) in asset space
  collision:{ kind:"disk", center:{x:.50,y:.47}, r:.235, thickness:.035 },
  ownership:"phaeacian-games",     // communal games equipment; taken up by any thrower

  states:{
    initial:"grip",
    nodes:{
      grip:    { preview:{ mode:"grip",     status:"GRIPPED",  progress:0.30 } },
      windup:  { preview:{ mode:"windup",   status:"WOUND",    progress:0.16 } },
      flight:  { preview:{ mode:"flight",   status:"IN FLIGHT",progress:0.60 } },
      strike:  { preview:{ mode:"strike",   status:"STRUCK",   progress:0.88 } },
      mark:    { preview:{ mode:"mark",     status:"MARKED",   progress:1.00 } },
      retrieve:{ preview:{ mode:"retrieve", status:"RETRIEVE", progress:0.10 } },
    },
    edges:[
      ["grip","windup"],["windup","flight"],["flight","strike"],
      ["strike","mark"],["mark","retrieve"],["retrieve","grip"],
    ],
  },
  channels:["mode","tilt","spin","t"],

  preview:()=>({ mode:"grip", status:"GRIPPED", progress:0.30, t:0 }),
  draw(ctx,W,H,state){ drawDiscus(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
