/* prop.shipbuilding-tool-set — Odysseus' raft-building kit, laid out as a
   TOOL BOARD: a plank backing with six separate grip-ready tools arranged on
   it — a felling AXE, an ADZE, a rack of AUGERS (boring bits), a MEASURING
   LINE (winder + plumb bob), a coil of CORDS, and a bolt of folded SAIL CLOTH.
   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B05-S04): Calypso hands over the gear to build the raft —
   each tool is an independently addressable, grip-ready object. The set has a
   neutral LAID-OUT state plus one "ready" state per tool that lifts it off the
   board and rings its grip anchor, so the runtime can pick a single tool up.
   Every tool declares a grip anchor in 0..1 space; the board declares its
   collision bounds + ownership. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  boardX0:44, boardY0:56, boardX1:616, boardY1:824,  // tool-board plank rect (src px)
  planks:4,          // vertical plank seams on the board face
  augers:3,          // boring bits in the auger rack
  cordWraps:5,       // concentric wraps in the rope coil
  clothFolds:4,      // fold layers in the sail-cloth bolt
};

const BOARD  = 2;    // board face (light, so tools pop)
const FRAME  = 5;    // board frame / plank shadow
const WOOD   = 4;    // tool handles (ash / oak)
const WOOD2  = 5;    // shaded wood face
const IRON   = 6;    // forged iron heads / bits
const IRON2  = 7;    // deepest iron shadow
const EDGE   = 2;    // bright ground cutting edge
const ROPE   = 4;    // cord / measuring line
const CLOTH  = 2;    // folded sail linen (very light)
const CLOTH2 = 3;    // cloth fold shadow

/* rounded-rect sub-path (no fill/stroke; caller wraps in pen.paint) */
function rr(g,x,y,w,h,r){
  r=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  g.moveTo(x+r,y);
  g.lineTo(x+w-r,y); g.arcTo(x+w,y,x+w,y+r,r);
  g.lineTo(x+w,y+h-r); g.arcTo(x+w,y+h,x+w-r,y+h,r);
  g.lineTo(x+r,y+h); g.arcTo(x,y+h,x,y+h-r,r);
  g.lineTo(x,y+r); g.arcTo(x,y,x+r,y,r);
  g.closePath();
}

/* two short binding ticks across a handle so it reads as a grip zone */
function gripTicks(pen,g,x,y,w){
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(x-w/2, y+i*7-3); g.lineTo(x+w/2, y+i*7+3); g.stroke(); }
}

/* ------------------------------------------------------------------
   THE TOOL BOARD — a plank backing behind everything. Light so the iron
   tools pop against it. Vertical plank seams + peg row along the top.
   ------------------------------------------------------------------ */
function drawBoard(pen,g){
  const {boardX0:x0,boardY0:y0,boardX1:x1,boardY1:y1} = params;
  const bw=x1-x0, bh=y1-y0;
  pen.paint(()=>{ rr(g,x0,y0,bw,bh,14); }, toneSolid(inkLevel(BOARD)), 5);
  // vertical plank seams
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
  for(let i=1;i<params.planks;i++){ const x=x0+bw*(i/params.planks);
    g.beginPath(); g.moveTo(x,y0+8); g.lineTo(x,y1-8); g.stroke(); }
  g.globalAlpha=1;
  // two cross battens (top + bottom) darker
  pen.paint(()=>{ rr(g,x0,y0,bw,26,10); }, toneSolid(inkLevel(FRAME)), 4);
  pen.paint(()=>{ rr(g,x0,y1-26,bw,26,10); }, toneSolid(inkLevel(FRAME)), 4);
  // peg holes along the top batten
  g.fillStyle=INK;
  for(let i=0;i<8;i++){ const x=x0+bw*((i+0.5)/8);
    g.beginPath(); g.arc(x,y0+13,3.2,0,7); g.fill(); }
}

/* ------------------------------------------------------------------
   TOOLS — each drawn in a LOCAL frame (origin = its board slot), up = -y.
   Every tool returns nothing; the caller has already translated/lifted it.
   ------------------------------------------------------------------ */
function drawAxe(pen,g){
  g.save(); g.rotate(-0.11);
  // ash shaft
  pen.paint(()=>{ rr(g,-9,-96,18,214,9); }, toneSolid(inkLevel(WOOD)), 4);
  g.fillStyle=inkLevel(WOOD2); g.fillRect(3,-88,5,200);   // rounded shadow face
  // iron head (bearded blade fanning left)
  pen.paint(()=>{
    g.moveTo(8,-116);
    g.quadraticCurveTo(-48,-134,-80,-108);
    g.quadraticCurveTo(-64,-92,-80,-72);
    g.quadraticCurveTo(-44,-86,8,-72);
    g.closePath();
  }, toneSolid(inkLevel(IRON)), 5);
  // lighter cheek so the head isn't one blob
  pen.paint(()=>{ g.moveTo(-6,-112); g.quadraticCurveTo(-40,-104,-40,-90);
                  g.quadraticCurveTo(-40,-80,-4,-76); g.closePath(); }, toneSolid(inkLevel(WOOD2)), 0);
  // eye block where the head seats on the shaft
  pen.paint(()=>{ rr(g,-12,-120,26,56,5); }, toneSolid(inkLevel(IRON2)), 4);
  // bright ground cutting edge
  pen.paint(()=>{
    g.moveTo(-80,-108); g.quadraticCurveTo(-64,-92,-80,-72);
    g.lineTo(-72,-74); g.quadraticCurveTo(-58,-92,-72,-106); g.closePath();
  }, toneSolid(inkLevel(EDGE)), 2);
  gripTicks(pen,g,0,60,20);
  g.restore();
}

function drawAdze(pen,g){
  g.save(); g.rotate(0.08);
  // curved oak haft
  pen.paint(()=>{ rr(g,-9,-92,18,208,9); }, toneSolid(inkLevel(WOOD)), 4);
  g.fillStyle=inkLevel(WOOD2); g.fillRect(3,-84,5,196);
  // socket collar at the head
  pen.paint(()=>{ rr(g,-15,-104,30,28,6); }, toneSolid(inkLevel(IRON2)), 4);
  // blade set CROSSWISE — sweeps forward and down (the adze signature)
  pen.paint(()=>{
    g.moveTo(12,-100);
    g.quadraticCurveTo(70,-92,84,-44);
    g.quadraticCurveTo(66,-36,58,-54);
    g.quadraticCurveTo(44,-80,6,-80);
    g.closePath();
  }, toneSolid(inkLevel(IRON)), 5);
  // bright hollow-ground edge along the sweep
  pen.paint(()=>{
    g.moveTo(84,-44); g.quadraticCurveTo(66,-36,58,-54);
    g.lineTo(66,-48); g.quadraticCurveTo(74,-42,80,-42); g.closePath();
  }, toneSolid(inkLevel(EDGE)), 2);
  gripTicks(pen,g,0,62,20);
  g.restore();
}

function drawAugers(pen,g){
  // a rack of boring bits: T-handle + iron shank + spiral/spoon tip
  const n=params.augers, span=136, step=span/(n-1);
  for(let i=0;i<n;i++){
    const dx=-span/2 + i*step;
    const len=118 + (i%2)*16;      // slight length variation
    g.save(); g.translate(dx,0);
    // T cross-handle (wood)
    pen.paint(()=>{ rr(g,-40,-126,80,16,8); }, toneSolid(inkLevel(WOOD)), 4);
    g.fillStyle=inkLevel(WOOD2); g.fillRect(-38,-115,76,4);
    // iron shank
    pen.paint(()=>{ rr(g,-4.5,-118,9,len,4); }, toneSolid(inkLevel(IRON)), 4);
    // spiral flutes down the shank
    g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
    for(let s=-118+20; s<-118+len-24; s+=15){
      g.beginPath(); g.moveTo(-4,s); g.lineTo(4,s+8); g.stroke();
    }
    // spoon/point tip
    const ty=-118+len;
    pen.paint(()=>{
      g.moveTo(-6,ty-12); g.quadraticCurveTo(-9,ty, -1,ty+14);
      g.quadraticCurveTo(8,ty, 6,ty-12); g.closePath();
    }, toneSolid(inkLevel(IRON2)), 3);
    g.restore();
  }
  gripTicks(pen,g,0,-118,52);
}

function drawMeasuringLine(pen,g){
  // a winder (bobbin) of cord + a length hanging to a plumb bob
  // bobbin body with wound line
  pen.paint(()=>{ rr(g,-16,-96,32,96,7); }, toneSolid(inkLevel(ROPE)), 4);
  // wound-cord ticks
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round";
  for(let y=-88; y<-4; y+=8){ g.beginPath(); g.moveTo(-16,y); g.lineTo(16,y+2); g.stroke(); }
  // bobbin end caps
  pen.paint(()=>{ rr(g,-24,-104,48,14,5); }, toneSolid(inkLevel(WOOD2)), 4);
  pen.paint(()=>{ rr(g,-24,-6,48,14,5); }, toneSolid(inkLevel(WOOD2)), 4);
  // line paying off the bottom, curving down to the plumb bob
  pen.ink(()=>{ g.moveTo(6,8); g.quadraticCurveTo(18,48,12,92); }, 2.4);
  // conical bronze plumb bob
  pen.paint(()=>{
    g.moveTo(-2,90); g.lineTo(22,104); g.quadraticCurveTo(12,120,12,142);
    g.quadraticCurveTo(-2,136,-4,104); g.closePath();
  }, toneSolid(inkLevel(IRON)), 4);
  g.fillStyle=inkLevel(EDGE); g.fillRect(0,100,4,32);   // bob highlight
}

function drawCords(pen,g){
  // a flat coil of rope: concentric wraps with a dark center hole
  const rx=96, ry=66, n=params.cordWraps;
  pen.paint(()=>{ g.ellipse(0,0,rx,ry,0,0,7); }, toneSolid(inkLevel(ROPE)), 5);
  // concentric wrap seams
  g.strokeStyle=INK; g.lineWidth=2.4;
  for(let i=1;i<n;i++){ const f=i/n;
    g.beginPath(); g.ellipse(0,0,rx*(1-f*0.72),ry*(1-f*0.72),0,0,7); g.stroke(); }
  // dark eye of the coil
  pen.paint(()=>{ g.ellipse(0,0,rx*0.16,ry*0.16,0,0,7); }, toneSolid(inkLevel(IRON2)), 3);
  // twist ticks across the outer wrap so it reads as laid rope
  g.strokeStyle=INK; g.lineWidth=1.8; g.lineCap="round";
  for(let a=0;a<Math.PI*2;a+=0.5){
    const x=Math.cos(a)*rx*0.86, y=Math.sin(a)*ry*0.86;
    const nx=Math.cos(a+0.4)*rx*0.72, ny=Math.sin(a+0.4)*ry*0.72;
    g.beginPath(); g.moveTo(x,y); g.lineTo(nx,ny); g.stroke();
  }
}

function drawSailCloth(pen,g){
  // a bolt of folded sail linen: stacked fold layers, top edge draped
  const w=190, layerH=26, n=params.clothFolds;
  for(let i=n-1;i>=0;i--){
    const y=i*(layerH-4);
    const tone = i%2 ? CLOTH2 : CLOTH;
    pen.paint(()=>{ rr(g,-w/2, y, w, layerH, 6); }, toneSolid(inkLevel(tone)), 4);
    // fold crease line
    pen.ink(()=>{ g.moveTo(-w/2+6, y+layerH-3); g.lineTo(w/2-6, y+layerH-3); }, 2);
  }
  // soft draped top selvage
  pen.paint(()=>{
    g.moveTo(-w/2,0);
    for(let i=0;i<=6;i++){ const x=-w/2 + w*(i/6); g.quadraticCurveTo(x-w/24,-14,x,-4); }
    g.lineTo(w/2,10); g.lineTo(-w/2,10); g.closePath();
  }, toneSolid(inkLevel(CLOTH)), 3);
  // vertical fold hint
  pen.seam(()=>{ g.moveTo(-w*0.12,4); g.lineTo(-w*0.12, (n-1)*(layerH-4)+layerH); }, 1.6);
  pen.seam(()=>{ g.moveTo( w*0.18,4); g.lineTo( w*0.18, (n-1)*(layerH-4)+layerH); }, 1.6);
}

/* board-slot centres (source px) for each tool */
const SLOTS = {
  axe:  { x:170, y:220, grip:60 },
  adze: { x:452, y:214, grip:62 },
  auger:{ x:180, y:495, grip:-118 },
  line: { x:522, y:466, grip:-48 },
  cords:{ x:190, y:705, grip:0 },
  cloth:{ x:452, y:700, grip:0 },
};

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const focus = st.focus || null;      // which tool is picked up
  const lift  = st.lift ?? (focus?1:0);// 0 on board .. 1 lifted off

  // scale everything from a 660x880 design frame to the actual buffer
  const sx=W/660, sy=H/880, s=Math.min(sx,sy);
  g.save(); g.translate((W-660*s)/2,(H-880*s)/2); g.scale(s,s);

  drawBoard(pen,g);

  const drawAt = (name, fn)=>{
    const P=SLOTS[name];
    const up = (focus===name) ? lift*22 : 0;   // lift the picked tool off the board
    g.save(); g.translate(P.x, P.y-up);
    fn(pen,g);
    g.restore();
    // ring the grip anchor of the focused tool
    if (focus===name){
      g.strokeStyle=INK; g.lineWidth=3; g.setLineDash([7,6]);
      g.beginPath(); g.arc(P.x, P.y-up+(P.grip||0), 30,0,7); g.stroke();
      g.setLineDash([]);
    }
  };

  drawAt("cloth", drawSailCloth);   // back-to-front: soft cloth first
  drawAt("cords", drawCords);
  drawAt("line",  drawMeasuringLine);
  drawAt("auger", drawAugers);
  drawAt("adze",  drawAdze);
  drawAt("axe",   drawAxe);

  g.restore();
}

export const asset = {
  id:"prop.shipbuilding-tool-set",
  type:"PROP",
  name:"Shipbuilding Tool Set",
  statusWord:"STOWED",
  scene:"OD-B05-S04",

  params,
  // back -> front draw order the module honors
  layers:["board","sail-cloth","cords","measuring-line","augers","adze","axe","grip-rings"],

  // normalized 0..1 grip anchors — one per separately grip-ready tool —
  // plus board mount/contact anchors. Grips sit on each tool's handle.
  anchors:{
    "grip:axe":{x:.258,y:.318},        // low on the axe haft
    "grip:adze":{x:.685,y:.314},       // low on the adze haft
    "grip:auger":{x:.273,y:.428},      // the T cross-handle
    "grip:line":{x:.791,y:.475},       // the winder bobbin
    "grip:cords":{x:.288,y:.801},      // the rope coil
    "grip:cloth":{x:.685,y:.795},      // the cloth bolt
    "mount:board":{x:.50,y:.075},      // top batten (hangs / leans here)
    "contact:board":{x:.50,y:.50},     // board face centre
  },
  // collision: the tool-board plank bounds (AABB in 0..1) for placement
  collision:{ kind:"aabb", x0:.067,y0:.064,x1:.933,y1:.936 },
  zones:{ bounds:{ x0:.067,y0:.064,x1:.933,y1:.936 } },
  ownership:"calypso",                 // Calypso's kit, handed to Odysseus

  states:{
    initial:"laid-out",
    nodes:{
      "laid-out":  { preview:{ focus:null,    status:"STOWED",   progress:.12 } },
      "axe-ready": { preview:{ focus:"axe",   lift:1, status:"AXE",      progress:.34 } },
      "adze-ready":{ preview:{ focus:"adze",  lift:1, status:"ADZE",     progress:.44 } },
      "auger-ready":{preview:{ focus:"auger", lift:1, status:"AUGER",    progress:.54 } },
      "line-ready":{ preview:{ focus:"line",  lift:1, status:"MEASURE",  progress:.64 } },
      "cords-ready":{preview:{ focus:"cords", lift:1, status:"CORDS",    progress:.74 } },
      "cloth-ready":{preview:{ focus:"cloth", lift:1, status:"SAILCLOTH",progress:.84 } },
    },
    edges:[
      ["laid-out","axe-ready"],["laid-out","adze-ready"],["laid-out","auger-ready"],
      ["laid-out","line-ready"],["laid-out","cords-ready"],["laid-out","cloth-ready"],
      ["axe-ready","laid-out"],["adze-ready","laid-out"],["auger-ready","laid-out"],
      ["line-ready","laid-out"],["cords-ready","laid-out"],["cloth-ready","laid-out"],
    ],
  },
  channels:["focus","lift","t"],

  preview:()=>({ focus:null, lift:0, t:0, status:"STOWED", progress:.12 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision, zones:asset.zones }; },
};
export default asset;
