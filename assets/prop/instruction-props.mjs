/* prop.instruction-props — Circe's LAID-OUT INSTRUCTION KIT for the trials
   ahead, arranged as a labeled layout board with four separately grip-ready
   objects, each linked to a FUTURE CUE:
     · a lump of BEESWAX (+ formed ear-plugs)      -> Sirens hearing-block
     · a coil of BINDING ROPES (+ bound hank)      -> lashing to the mast
     · SACRIFICIAL GEAR (libation bowl, ritual     -> the offering at the
       knife, honey/wine ewer)                        pit / Thrinacia
     · a STEERING-OAR REFERENCE (schematic oar,    -> holding the course
       dashed callout + dimension ticks)              between Scylla/Charybdis

   PROP asset. Drawn in SOLID grays + hard contour into the offscreen ctx; the
   engine dotify pass supplies the halftone. Do NOT pre-dither.

   Scene function (OD-B12-S02): Circe lays out the gear + instructions before
   the ships leave Aeaea. The kit has a neutral LAID-OUT state plus one "cued"
   state per object that lifts it off the board and rings its grip anchor and
   its cue-leader, so the runtime can highlight the single item a later scene
   calls back to. Each object declares a grip anchor in 0..1 space; the board
   declares its collision bounds + ownership. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  boardX0:44, boardY0:56, boardX1:616, boardY1:824,   // layout-board rect (src px)
  cols:2, rows:2,       // 2x2 kit grid
  cordWraps:5,          // concentric wraps in the rope coil
  waxR:66,              // beeswax lump radius
};

/* ink levels (1 = near-paper .. 7 = full ink) */
const BOARD = 2;    // board face (light, so objects pop)
const FRAME = 5;    // board frame / batten
const WAX   = 4;    // beeswax body
const ROPE  = 4;    // hemp rope
const ROPE2 = 6;    // rope shadow / eye
const BRONZE= 5;    // bowl / knife bronze
const BRONZE2=7;    // deep bronze shadow
const EDGE  = 2;    // ground cutting edge / rim highlight
const WOOD  = 4;    // oar loom
const WOOD2 = 6;    // shaded wood face
const CLAY  = 3;    // ewer body

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

/* three short binding ticks across a handle so it reads as a grip zone */
function gripTicks(pen,g,x,y,w){
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let i=-1;i<=1;i++){ g.beginPath(); g.moveTo(x-w/2, y+i*7-3); g.lineTo(x+w/2, y+i*7+3); g.stroke(); }
}

/* ------------------------------------------------------------------
   THE LAYOUT BOARD — a light plank behind everything, split into four
   labeled cells so the kit reads as a laid-out instruction set. Top batten
   with peg row; thin cross-dividers between the four objects.
   ------------------------------------------------------------------ */
function drawBoard(pen,g){
  const {boardX0:x0,boardY0:y0,boardX1:x1,boardY1:y1} = params;
  const bw=x1-x0, bh=y1-y0;
  pen.paint(()=>{ rr(g,x0,y0,bw,bh,14); }, toneSolid(inkLevel(BOARD)), 5);
  // top + bottom battens (darker)
  pen.paint(()=>{ rr(g,x0,y0,bw,28,10); }, toneSolid(inkLevel(FRAME)), 4);
  pen.paint(()=>{ rr(g,x0,y1-24,bw,24,10); }, toneSolid(inkLevel(FRAME)), 4);
  // peg holes along the top batten
  g.fillStyle=INK;
  for(let i=0;i<8;i++){ const x=x0+bw*((i+0.5)/8); g.beginPath(); g.arc(x,y0+14,3.2,0,7); g.fill(); }
  // cross-dividers between the four cells
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5; g.setLineDash([9,7]);
  g.beginPath(); g.moveTo((x0+x1)/2, y0+34); g.lineTo((x0+x1)/2, y1-30); g.stroke();
  g.beginPath(); g.moveTo(x0+10, (y0+y1)/2); g.lineTo(x1-10, (y0+y1)/2); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
}

/* ------------------------------------------------------------------
   1 · BEESWAX LUMP (+ formed ear-plugs)  — organic blob, kneaded dents
   ------------------------------------------------------------------ */
function blob(g, cx, cy, R){
  g.moveTo(cx+R, cy);
  g.bezierCurveTo(cx+R, cy+R*0.72, cx+R*0.5, cy+R*1.06, cx-R*0.12, cy+R*0.98);
  g.bezierCurveTo(cx-R*0.92, cy+R*0.88, cx-R*1.06, cy+R*0.2, cx-R*0.94, cy-R*0.32);
  g.bezierCurveTo(cx-R*0.80, cy-R*1.0, cx-R*0.1, cy-R*1.06, cx+R*0.42, cy-R*0.86);
  g.bezierCurveTo(cx+R*0.92, cy-R*0.70, cx+R*1.02, cy-R*0.38, cx+R, cy);
  g.closePath();
}
function drawBeeswax(pen,g){
  const R=params.waxR;
  pen.paint(()=>blob(g,0,0,R), toneSolid(inkLevel(WAX)), 4);
  g.save(); g.beginPath(); blob(g,0,0,R); g.clip();
  g.fillStyle=inkLevel(2); g.beginPath(); g.ellipse(-R*0.28,-R*0.34,R*0.52,R*0.36,-0.3,0,7); g.fill();
  g.fillStyle=inkLevel(6); g.beginPath(); g.ellipse(R*0.34,R*0.42,R*0.6,R*0.42,0.1,0,7); g.fill();
  // kneading dents
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round"; g.globalAlpha=0.7;
  for(let i=-1;i<=1;i++){ g.beginPath(); g.arc(i*R*0.42, R*0.1, R*0.22, Math.PI*0.15, Math.PI*0.85); g.stroke(); }
  g.globalAlpha=1; g.restore();
  // two formed ear-plugs set beside the lump (future Sirens cue)
  const pr=R*0.30;
  const plug=(px,py)=>{
    pen.paint(()=>{ g.ellipse(px,py,pr,pr*1.08,0.3,0,7); }, toneSolid(inkLevel(3)), 3);
    g.fillStyle=inkLevel(1); g.beginPath(); g.arc(px-pr*0.3,py-pr*0.35,pr*0.34,0,7); g.fill();
    g.fillStyle=inkLevel(5); g.beginPath(); g.ellipse(px+pr*0.55,py+pr*0.2,pr*0.4,pr*0.5,0,0,7); g.fill();
  };
  plug(R*1.28, R*0.10); plug(R*1.66, R*0.62);
}

/* ------------------------------------------------------------------
   2 · BINDING ROPES  — a flat coil + a bound hank of the same rope
   ------------------------------------------------------------------ */
function drawBindingRopes(pen,g){
  const rx=94, ry=62, n=params.cordWraps;
  pen.paint(()=>{ g.ellipse(0,-6,rx,ry,0,0,7); }, toneSolid(inkLevel(ROPE)), 5);
  // concentric wrap seams
  g.strokeStyle=INK; g.lineWidth=2.4;
  for(let i=1;i<n;i++){ const f=i/n; g.beginPath(); g.ellipse(0,-6,rx*(1-f*0.72),ry*(1-f*0.72),0,0,7); g.stroke(); }
  // dark eye of the coil
  pen.paint(()=>{ g.ellipse(0,-6,rx*0.16,ry*0.16,0,0,7); }, toneSolid(inkLevel(ROPE2)), 3);
  // twist ticks across the outer wrap (laid rope)
  g.strokeStyle=INK; g.lineWidth=1.8; g.lineCap="round";
  for(let a=0;a<Math.PI*2;a+=0.5){
    const x=Math.cos(a)*rx*0.86, y=-6+Math.sin(a)*ry*0.86;
    const nx=Math.cos(a+0.4)*rx*0.72, ny=-6+Math.sin(a+0.4)*ry*0.72;
    g.beginPath(); g.moveTo(x,y); g.lineTo(nx,ny); g.stroke();
  }
  // a bound hank/loop hanging below, whipped at the neck (for lashing)
  pen.paint(()=>{
    g.moveTo(-26,ry-8);
    g.bezierCurveTo(-46,ry+58,-46,ry+108,-16,ry+118);
    g.bezierCurveTo(14,ry+108,14,ry+58,-6,ry-8);
    g.closePath();
  }, toneSolid(inkLevel(ROPE)), 4);
  // whipping bands at the neck of the hank
  g.strokeStyle=INK; g.lineWidth=2.2; g.lineCap="round";
  for(let i=0;i<3;i++){ const y=ry+6+i*7; g.beginPath(); g.moveTo(-30,y); g.lineTo(2,y); g.stroke(); }
}

/* ------------------------------------------------------------------
   3 · SACRIFICIAL GEAR  — a wide libation bowl, a curved ritual knife
   laid across it, and a small honey/wine ewer beside
   ------------------------------------------------------------------ */
function drawSacrificialGear(pen,g){
  // ewer / small jug behind, to the right
  g.save(); g.translate(92,4);
  pen.paint(()=>{
    g.moveTo(-20,-6); g.quadraticCurveTo(-30,34,-18,70);
    g.lineTo(18,70); g.quadraticCurveTo(30,34,20,-6);
    g.quadraticCurveTo(0,-16,-20,-6); g.closePath();
  }, toneSolid(inkLevel(CLAY)), 4);
  pen.paint(()=>{ rr(g,-14,-30,28,26,7); }, toneSolid(inkLevel(CLAY)), 3);  // neck
  g.fillStyle=inkLevel(6); g.beginPath(); g.ellipse(10,40,10,26,0.1,0,7); g.fill(); // shade
  pen.ink(()=>{ g.moveTo(-20,-2); g.bezierCurveTo(-40,6,-40,44,-22,52); }, 3);       // handle
  g.restore();

  // wide libation bowl (phiale) — shallow, dark inside
  pen.paint(()=>{ g.ellipse(0,54,104,34,0,0,7); }, toneSolid(inkLevel(BRONZE)), 5);   // bowl body
  pen.paint(()=>{ g.ellipse(0,44,92,24,0,0,7); }, toneSolid(inkLevel(BRONZE2)), 3);   // bowl well (dark)
  g.fillStyle=inkLevel(1); g.beginPath(); g.ellipse(-30,38,36,10,0,0,7); g.fill();    // rim highlight
  // central omphalos boss
  pen.paint(()=>{ g.ellipse(0,46,14,7,0,0,7); }, toneSolid(inkLevel(BRONZE)), 2);

  // curved sacrificial knife laid across the bowl
  g.save(); g.rotate(-0.18); g.translate(-6,-2);
  // bronze blade (curved)
  pen.paint(()=>{
    g.moveTo(-96,-14); g.quadraticCurveTo(-6,-40,74,-10);
    g.quadraticCurveTo(-4,-20,-92,-2); g.closePath();
  }, toneSolid(inkLevel(BRONZE)), 4);
  // bright ground edge
  pen.paint(()=>{
    g.moveTo(-96,-14); g.quadraticCurveTo(-6,-40,74,-10);
    g.quadraticCurveTo(-6,-32,-92,-8); g.closePath();
  }, toneSolid(inkLevel(EDGE)), 0);
  // bound wooden handle
  pen.paint(()=>{ rr(g,64,-18,54,18,8); }, toneSolid(inkLevel(WOOD)), 4);
  g.strokeStyle=INK; g.lineWidth=1.8; g.lineCap="round";
  for(let x=72;x<112;x+=8){ g.beginPath(); g.moveTo(x,-17); g.lineTo(x+3,-1); g.stroke(); }
  g.restore();
}

/* ------------------------------------------------------------------
   4 · STEERING-OAR REFERENCE — a schematic steering oar (loom + broad
   blade + tiller grip) inside a DASHED callout with dimension ticks, so it
   reads as a reference sheet linked to a future steering cue.
   ------------------------------------------------------------------ */
function drawSteeringOarRef(pen,g){
  g.save(); g.rotate(0.34);
  // loom / shaft
  pen.paint(()=>{ rr(g,-11,-150,22,286,10); }, toneSolid(inkLevel(WOOD)), 4);
  g.fillStyle=inkLevel(WOOD2); g.fillRect(4,-142,5,270);
  // tiller cross-grip at the top
  pen.paint(()=>{ rr(g,-44,-162,88,22,10); }, toneSolid(inkLevel(WOOD)), 4);
  g.fillStyle=inkLevel(WOOD2); g.fillRect(-42,-146,84,4);
  // broad flat blade at the bottom
  pen.paint(()=>{
    g.moveTo(-10,120);
    g.quadraticCurveTo(-56,150,-46,224);
    g.quadraticCurveTo(-2,246,44,224);
    g.quadraticCurveTo(54,150,10,120);
    g.closePath();
  }, toneSolid(inkLevel(WOOD)), 5);
  g.save(); g.beginPath();
  g.moveTo(-10,120); g.quadraticCurveTo(-56,150,-46,224);
  g.quadraticCurveTo(-2,246,44,224); g.quadraticCurveTo(54,150,10,120); g.closePath(); g.clip();
  g.fillStyle=inkLevel(6); g.fillRect(2,120,52,130);          // shaded half
  g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.5;      // blade grain
  for(let k=-2;k<=2;k++){ g.beginPath(); g.moveTo(k*16,124); g.lineTo(k*16+6,244); g.stroke(); }
  g.globalAlpha=1; g.restore();
  gripTicks(pen,g,0,-40,26);
  g.restore();

  // DASHED reference callout box + dimension line (marks it a REFERENCE)
  g.strokeStyle=INK; g.lineWidth=2; g.setLineDash([8,6]);
  g.strokeRect(-112,-176,214,430);
  g.setLineDash([]);
  // dimension line down the right edge with end ticks
  g.lineWidth=2; g.lineCap="round";
  g.beginPath(); g.moveTo(120,-172); g.lineTo(120,250); g.stroke();
  g.beginPath(); g.moveTo(112,-172); g.lineTo(128,-172); g.stroke();
  g.beginPath(); g.moveTo(112,250);  g.lineTo(128,250);  g.stroke();
  // three registration ticks along the loom (reference marks)
  for(let i=0;i<3;i++){ const y=-70+i*70; g.beginPath(); g.moveTo(28,y); g.lineTo(44,y); g.stroke(); }
}

/* board-slot centres (source px) + grip offset within each object */
const SLOTS = {
  beeswax: { x:190, y:250, grip:{x:0,y:0} },
  ropes:   { x:452, y:236, grip:{x:0,y:-6} },
  gear:    { x:180, y:604, grip:{x:0,y:54} },
  oar:     { x:470, y:582, grip:{x:0,y:-40}, rot:0.34 },
};
const DRAW = { beeswax:drawBeeswax, ropes:drawBindingRopes, gear:drawSacrificialGear, oar:drawSteeringOarRef };

/* ------------------------------------------------------------------ */
function drawProp(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const focus = st.focus || null;       // which object is cued/picked up
  const lift  = st.lift ?? (focus?1:0); // 0 on board .. 1 lifted off

  // scale from the 660x880 design frame to the actual buffer
  const s=Math.min(W/660,H/880);
  g.save(); g.translate((W-660*s)/2,(H-880*s)/2); g.scale(s,s);

  drawBoard(pen,g);

  const drawAt=(name)=>{
    const P=SLOTS[name];
    const up=(focus===name)? lift*22 : 0;
    g.save(); g.translate(P.x, P.y-up);
    DRAW[name](pen,g);
    g.restore();
    if (focus===name){
      // ring the grip anchor (account for the object's own rotation of the grip)
      let gx=P.grip.x, gy=P.grip.y;
      if (P.rot){ const c=Math.cos(P.rot), s2=Math.sin(P.rot); const rx=gx*c-gy*s2, ry=gx*s2+gy*c; gx=rx; gy=ry; }
      const ax=P.x+gx, ay=P.y-up+gy;
      g.strokeStyle=INK; g.lineWidth=3; g.setLineDash([7,6]);
      g.beginPath(); g.arc(ax, ay, 30,0,7); g.stroke();
      // cue leader: dashed line up-right to a small bracket (linked to a future cue)
      g.beginPath(); g.moveTo(ax+22, ay-20); g.lineTo(ax+70, ay-64); g.stroke();
      g.setLineDash([]);
      g.beginPath(); g.moveTo(ax+70,ay-72); g.lineTo(ax+70,ay-56); g.lineTo(ax+86,ay-56); g.stroke();
    }
  };

  // back-to-front (soft/large first)
  drawAt("beeswax");
  drawAt("ropes");
  drawAt("gear");
  drawAt("oar");

  g.restore();
}

export const asset = {
  id:"prop.instruction-props",
  type:"PROP",
  name:"Instruction Props",
  statusWord:"LAID OUT",
  scene:"OD-B12-S02",

  params,
  // back -> front draw order the module honors
  layers:["board","beeswax","binding-ropes","sacrificial-gear","steering-oar-ref","cue-rings"],

  // normalized 0..1 grip anchors — one per separately grip-ready object —
  // plus board mount/contact anchors. Grips sit on each object's hold point.
  anchors:{
    "grip:beeswax":{x:.288,y:.284},        // the wax lump
    "grip:ropes":{x:.685,y:.261},          // the rope coil
    "grip:gear":{x:.273,y:.748},           // the libation-bowl rim / knife
    "grip:oar":{x:.688,y:.616},            // the steering-oar tiller grip
    "mount:board":{x:.50,y:.079},          // top batten (hangs / leans here)
    "contact:board":{x:.50,y:.50},         // board face centre
  },
  // future-cue linkage: each object anticipates a later scene beat
  cues:{
    "grip:beeswax":"OD-B12-S03:sirens-earplugs",
    "grip:ropes":"OD-B12-S03:lash-to-mast",
    "grip:gear":"OD-B12-S08:thrinacia-offering",
    "grip:oar":"OD-B12-S05:hold-course",
  },
  // collision: the layout-board plank bounds (AABB in 0..1) for placement
  collision:{ kind:"aabb", x0:.067,y0:.064,x1:.933,y1:.936 },
  zones:{ bounds:{ x0:.067,y0:.064,x1:.933,y1:.936 } },
  ownership:"circe",                        // Circe's kit, handed to Odysseus

  states:{
    initial:"laid-out",
    nodes:{
      "laid-out":    { preview:{ focus:null,      status:"LAID OUT", progress:.12 } },
      "beeswax-cued":{ preview:{ focus:"beeswax", lift:1, status:"BEESWAX", progress:.34 } },
      "ropes-cued":  { preview:{ focus:"ropes",   lift:1, status:"BINDING", progress:.52 } },
      "gear-cued":   { preview:{ focus:"gear",    lift:1, status:"OFFERING",progress:.70 } },
      "oar-cued":    { preview:{ focus:"oar",     lift:1, status:"STEERING",progress:.88 } },
    },
    edges:[
      ["laid-out","beeswax-cued"],["laid-out","ropes-cued"],
      ["laid-out","gear-cued"],["laid-out","oar-cued"],
      ["beeswax-cued","laid-out"],["ropes-cued","laid-out"],
      ["gear-cued","laid-out"],["oar-cued","laid-out"],
    ],
  },
  channels:["focus","lift","t"],

  preview:()=>({ focus:null, lift:0, t:0, status:"LAID OUT", progress:.12 }),
  draw(ctx,W,H,state){ drawProp(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision, zones:asset.zones, cues:asset.cues }; },
};
export default asset;
