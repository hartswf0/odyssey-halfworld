/* sound_source.imitated-wives-voices — Helen circling the wooden horse,
   calling each hidden man in the voice of his own wife.
   SOUND_SOURCE asset. An ADDRESSABLE DIEGETIC EMITTER rendered as a legible
   emitter DIAGRAM, not an illustration: a central WOODEN-SHELL outline (the
   hollow horse), a CIRCLING PATH ringing it with a direction arrow, a ring of
   VOICE-EMITTER stations spaced around that path — each a position marker with
   concentric intensity rings — and a bottom RHYTHM strip of calling ticks. The
   voice MOVES: one station is lit brightest at { position }, its neighbours
   fall off, the rest sit as dim waypoints. Drawn in SOLID grays + hard contour
   into the offscreen ctx; the engine dotify pass supplies the halftone. Do NOT
   pre-dither.

   Scene function (OD-B04-S04): a spatialized sequence of intimate voices moving
   around the wooden shell, coaxing the men inside to answer. Driven by
   { position, intensity, moving, stopped, beats } so the runtime can walk the
   voice around, raise/lower it, or fall silent. States: calling / circling /
   listening / stopped.
   Atlas: addressable emitter — position, intensity, rhythm, start/stop. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const params = {
  shell:{ x:0.50, y:0.45, rx:0.190, ry:0.118 }, // wooden horse belly in asset space
  path:{ rx:0.370, ry:0.290 },                  // circling voice path around the shell
  stations:7,                                    // voice-emitter positions on the path
  startAngle:-Math.PI/2,                         // station 0 sits at the top
  ringBase:[0.60, 1.05, 1.50],                   // ring radii as multiples of the unit
  beatCount:22,                                  // rhythm ticks (the calling cadence)
  beatPattern:[3,1,2,1, 3,1,1,2, 3,2,1,1, 3,1,2,1, 3,1,1,2, 3,1], // 1=soft..3=named-call
  intensity:0.90,                                // default loudness 0..1
  position:0.12,                                 // where the voice currently is, 0..1 around
};

/* smallest absolute angular distance between two angles, in 0..PI */
function angDist(a,b){ let d=Math.abs((a-b)%TAU); if(d>Math.PI) d=TAU-d; return d; }

/* the hollow WOODEN SHELL at the centre: planked hull outline the voices ring */
function drawShell(ctx,W,H,pen){
  const g=ctx;
  const cx=W*params.shell.x, cy=H*params.shell.y;
  const rx=W*params.shell.rx, ry=H*params.shell.ry;
  // hull body
  pen.paint(()=>{ g.ellipse(cx,cy,rx,ry,0,0,TAU); }, toneSolid(inkLevel(3)), 5);
  // vertical PLANKS, clipped to the hull, to read as wooden shell
  g.save();
  g.beginPath(); g.ellipse(cx,cy,rx,ry,0,0,TAU); g.clip();
  g.strokeStyle=inkLevel(5); g.lineWidth=3;
  for(let x=cx-rx; x<=cx+rx; x+=rx*0.24){ g.beginPath(); g.moveTo(x,cy-ry); g.lineTo(x,cy+ry); g.stroke(); }
  // two cross-braces / keel seams
  g.strokeStyle=inkLevel(6); g.lineWidth=4;
  g.beginPath(); g.moveTo(cx-rx,cy-ry*0.10); g.lineTo(cx+rx,cy-ry*0.10); g.stroke();
  g.beginPath(); g.moveTo(cx-rx,cy+ry*0.42); g.lineTo(cx+rx,cy+ry*0.42); g.stroke();
  g.restore();
  // a small trap-hatch on the belly (where a man could answer from)
  pen.paint(()=>{ g.rect(cx-rx*0.14, cy+ry*0.20, rx*0.28, ry*0.42); }, toneSolid(inkLevel(6)), 4);
  return { cx, cy, rx, ry };
}

function drawDiagram(ctx,W,H,st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const cx=W*params.shell.x, cy=H*params.shell.y;
  const prx=W*params.path.rx, pry=H*params.path.ry;
  const N=params.stations;
  const intensity = clamp(st.intensity ?? params.intensity, 0, 1);
  const stopped = !!st.stopped;
  const moving  = st.moving !== false && !stopped;
  const pos = clamp(st.position ?? params.position, 0, 1);
  const activeAng = params.startAngle + pos*TAU;
  const unit = Math.min(W,H)*0.048;

  // ---- SPATIAL FIELD: faint acoustic disc the voices carry across ----
  if (!stopped){
    pen.paint(()=>{ g.ellipse(cx,cy,prx+unit*1.4,pry+unit*1.4,0,0,TAU); }, toneSolid(inkLevel(1)), 0);
  }

  // ---- CIRCLING PATH: dashed ellipse the voice walks around the shell ----
  g.save();
  g.strokeStyle=INK; g.lineWidth= stopped?2:3; g.globalAlpha= stopped?0.35:0.8;
  g.setLineDash([12,10]);
  g.beginPath(); g.ellipse(cx,cy,prx,pry,0,0,TAU); g.stroke();
  g.restore();

  // ---- DIRECTION ARROWHEADS along the path (movement of the voice) ----
  if (moving){
    for(const fa of [0.30,0.63,0.96]){
      const a = params.startAngle + fa*TAU;
      const px = cx+Math.cos(a)*prx, py = cy+Math.sin(a)*pry;
      const tx = -Math.sin(a)*prx, ty = Math.cos(a)*pry;       // tangent (clockwise)
      const tl = Math.hypot(tx,ty)||1; const ux=tx/tl, uy=ty/tl;
      const nx=Math.cos(a), ny=Math.sin(a);
      g.strokeStyle=INK; g.lineWidth=3; g.lineCap="round";
      g.beginPath();
      g.moveTo(px-ux*10+nx*7-uy*0, py-uy*10+ny*7);
      g.lineTo(px+ux*10, py+uy*10);
      g.lineTo(px-ux*10-nx*7, py-uy*10-ny*7);
      g.stroke();
    }
  }

  // ---- the WOODEN SHELL the voices surround ----
  drawShell(ctx,W,H,pen);

  // ---- VOICE-EMITTER STATIONS around the path ----
  let activeIdx=0, activeBest=1e9;
  const stat=[];
  for(let i=0;i<N;i++){
    const a = params.startAngle + i/N*TAU;
    const sx = cx+Math.cos(a)*prx, sy = cy+Math.sin(a)*pry;
    const d = angDist(a, activeAng);
    const w = clamp(1 - d/(Math.PI*0.72), 0, 1);              // falloff around the active voice
    const si = stopped ? 0 : intensity*w;
    stat.push({ a, sx, sy, si });
    if (d<activeBest){ activeBest=d; activeIdx=i; }
  }

  // rings + markers (draw dim ones first so the loud voice sits on top)
  const order=[...stat.keys()].sort((p,q)=>stat[p].si-stat[q].si);
  for(const i of order){
    const s=stat[i];
    const nx=Math.cos(s.a), ny=Math.sin(s.a);                 // outward normal
    // radiating intensity rings (open toward the outside), count by loudness
    const rings = stopped ? 0 : Math.round(s.si*3);
    for(let k=0;k<rings;k++){
      const r = unit*params.ringBase[k];
      g.strokeStyle=INK; g.lineWidth=clamp(5-k*1.4,2,5);
      g.globalAlpha = clamp(0.9 - k*0.18, 0.3, 1) * (0.5+0.5*s.si);
      g.beginPath();
      // an outward-facing arc so it reads as sound leaving the shell
      g.arc(s.sx,s.sy, r, s.a-1.15, s.a+1.15);
      g.stroke(); g.globalAlpha=1;
    }
    // seat disc + position marker dot
    const seat = unit*0.42;
    pen.paint(()=>{ g.arc(s.sx,s.sy,seat,0,TAU); }, toneSolid(inkLevel(1)), 3);
    const lvl = stopped ? 2 : Math.round(2 + s.si*5);
    pen.paint(()=>{ g.arc(s.sx,s.sy,seat*0.55,0,TAU); }, toneSolid(inkLevel(lvl)), 3);
  }

  // ---- ACTIVE VOICE highlight: crosshair + blue mark at the current position ----
  if (!stopped){
    const s=stat[activeIdx];
    g.strokeStyle=INK; g.lineWidth=3;
    g.beginPath(); g.moveTo(s.sx-unit*0.9,s.sy); g.lineTo(s.sx+unit*0.9,s.sy); g.stroke();
    g.beginPath(); g.moveTo(s.sx,s.sy-unit*0.9); g.lineTo(s.sx,s.sy+unit*0.9); g.stroke();
    pen.paint(()=>{ g.arc(s.sx,s.sy,unit*0.22,0,TAU); }, toneSolid(inkLevel(7)), 2);
    g.fillStyle=ACCENT; g.beginPath(); g.arc(s.sx,s.sy,unit*0.10,0,TAU); g.fill();
  }

  // ---- RHYTHM STRIP: the calling cadence (named cries = accents) ----
  const bx0=W*0.14, bx1=W*0.86, baseY=H*0.90;
  const n=params.beatCount, span=bx1-bx0, gapW=span/(n-1);
  pen.ink(()=>{ g.moveTo(bx0-14,baseY); g.lineTo(bx1+14,baseY); }, 3);
  for(let i=0;i<n;i++){
    const bx=bx0+i*gapW;
    const acc=params.beatPattern[i%params.beatPattern.length]; // 1..3
    // ticks light in a travelling window that follows the voice position
    const phase=((i/n) - pos + 1)%1;
    const on = stopped ? false : (phase < 0.55);
    const h=(12+acc*15) * (on?1:0.5);
    const lvl = on ? (acc>=3?6:acc>=2?5:4) : 1;
    const w = acc>=3?9:6;
    g.fillStyle=inkLevel(lvl); g.fillRect(bx-w/2, baseY-h, w, h);
    if(on){ g.strokeStyle=INK; g.lineWidth=2; g.strokeRect(bx-w/2, baseY-h, w, h); }
  }
}

/* precomputed normalized station anchors (7 points on the path around the shell) */
const STATION_ANCHORS = (()=>{
  const o={}; const N=params.stations;
  for(let i=0;i<N;i++){
    const a=params.startAngle + i/N*TAU;
    o[`voice:${i}`]={ x:+(0.5+params.path.rx*Math.cos(a)).toFixed(3),
                      y:+(0.45+params.path.ry*Math.sin(a)).toFixed(3) };
  }
  return o;
})();

export const asset = {
  id:"sound_source.imitated-wives-voices",
  type:"SOUND_SOURCE",
  name:"Imitated wives' voices",
  statusWord:"CALLING",
  scene:"OD-B04-S04",

  params,
  // back -> front draw order the diagram honors
  layers:["field","path","arrows","shell","rings","markers","active","rhythm"],
  // normalized 0..1 emitter stations + shell centre + path
  anchors:{
    "shell:center":{ x:0.50, y:0.45 },
    "shell:hatch":{ x:0.50, y:0.53 },
    ...STATION_ANCHORS,
    "camera:diagram":{ x:0.50, y:0.50 },
  },
  // relation to visible action: voices ring the shell; cadence runs along the base
  zones:{ field:{ x0:.10,y0:.14,x1:.90,y1:.76 }, rhythm:{ x0:.14,y0:.84,x1:.86,y1:.92 } },
  states:{
    initial:"calling",
    nodes:{
      calling:{ preview:{ intensity:0.92, position:0.12, moving:true,  stopped:false, status:"CALLING",   progress:0.92 } },
      circling:{ preview:{ intensity:0.85, position:0.52, moving:true,  stopped:false, status:"CIRCLING",  progress:0.55 } },
      listening:{ preview:{ intensity:0.34, position:0.78, moving:false, stopped:false, status:"LISTENING", progress:0.34 } },
      stopped:{ preview:{ intensity:0.00, position:0.00, moving:false, stopped:true,  status:"SILENT",    progress:0.02 } },
    },
    edges:[
      ["calling","circling"],["circling","calling"],
      ["circling","listening"],["listening","circling"],
      ["listening","calling"],
      ["calling","stopped"],["stopped","calling"],
    ],
  },
  channels:["position","intensity","rhythm","pan"],

  preview:()=>({ intensity:0.92, position:0.12, moving:true, stopped:false, status:"CALLING", progress:0.92 }),
  draw(ctx,W,H,state){ drawDiagram(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
