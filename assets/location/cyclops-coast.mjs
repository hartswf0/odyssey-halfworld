/* location.cyclops-coast — the Cyclops' wild uncultivated shore.
   LOCATION asset for OD-B09-S04. An EMPTY navigable set drawn in SOLID grays
   + hard contour into the offscreen ctx (the engine dotify pass supplies the
   halftone). Viewed from across a narrow strait: a foreground rocky shore, a
   sea band, then the OPPOSITE cliff wall with a dark cave-mouth punched into
   it (the isolated giant's dwelling), high pasture fields on the clifftop,
   flock-worn paths zig-zagging down the rock, and smoke columns rising from
   the habitation. NO baked characters — anchors + zones only.
   Atlas: dark cave opening · high fields · smoke columns · flock paths ·
   isolated habitation · empty navigable set. */
import { makePen, toneSolid, inkLevel, INK } from "../../engine/halfworld-engine.mjs";

const params = {
  horizon:0.26,       // sky / distant meeting line as fraction of H
  fieldsTop:0.26,     // top of the high pasture plateau
  cliffTop:0.42,      // where the cliff face begins below the fields
  waterLine:0.70,     // cliff base / strait waterline
  shoreLine:0.80,     // near shore begins (foreground beach)
  smokeColumns:3,     // rising smoke plumes from the habitation
  flockPaths:true,
};

/* a soft wavy smoke plume rising from (x,y0) upward by `rise`, curling and
   widening/fading as it climbs. Drawn in light grays so it reads as smoke. */
function smoke(pen, g, x, y0, rise, amp, seed){
  const n=12, dy=rise/n;
  g.lineCap="round"; g.lineJoin="round";
  // core strand
  g.strokeStyle=inkLevel(3); g.lineWidth=3;
  g.beginPath(); g.moveTo(x, y0);
  for(let i=1;i<=n;i++){ const t=i/n; const xx=x+(Math.sin(t*4.2+seed)+0.4*Math.sin(t*9.1+seed))*amp*(0.25+t*1.1); g.lineTo(xx, y0-dy*i); }
  g.stroke();
  // a second offset wisp, fainter and higher-frequency
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
  g.beginPath(); g.moveTo(x+amp*0.4, y0);
  for(let i=1;i<=n;i++){ const t=i/n; const xx=x+amp*0.4+(Math.sin(t*4.2+seed+2.1))*amp*(0.25+t*1.2); g.lineTo(xx, y0-dy*i); }
  g.stroke(); g.globalAlpha=1;
}

/* a flock-worn switchback path scuffed down the cliff face: a pale worn band
   with a darker contour edge on its lower side so it reads as a trodden track */
function flockPath(pen, g, pts){
  g.lineCap="round"; g.lineJoin="round";
  // pale worn band (lighter than the rock)
  g.strokeStyle=inkLevel(2); g.lineWidth=6;
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0], pts[i][1]);
  g.stroke();
  // thin dark edge just below to seat it into the rock
  g.strokeStyle=INK; g.lineWidth=1.4; g.globalAlpha=0.5;
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]+3);
  for(let i=1;i<pts.length;i++) g.lineTo(pts[i][0], pts[i][1]+3);
  g.stroke(); g.globalAlpha=1;
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const fieldsTop= H*params.fieldsTop;
  const cliffTop = H*params.cliffTop;
  const water    = H*params.waterLine;
  const shore    = H*params.shoreLine;
  const layers = st.layers || ["sky","fields","smoke","cliff","cave","dwelling","paths","strait","shore"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest -> few dots) with a couple of drifting clouds ----
  if (has("sky")){
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,fieldsTop+H*0.02);
    g.fillStyle=inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.12+i*0.26), horizon*(0.42+0.16*(i%2)), W*0.11, H*0.022, 0,0,7); g.fill(); }
  }

  // ---- HIGH PASTURE FIELDS: the clifftop plateau (mid-light) ----
  if (has("fields")){
    // undulating grass plateau capping the cliff
    pen.paint(()=>{
      g.moveTo(0, fieldsTop+H*0.05);
      g.quadraticCurveTo(W*0.18, fieldsTop-H*0.02, W*0.38, fieldsTop+H*0.03);
      g.quadraticCurveTo(W*0.58, fieldsTop+H*0.09, W*0.74, fieldsTop+H*0.01);
      g.quadraticCurveTo(W*0.90, fieldsTop-H*0.03, W, fieldsTop+H*0.04);
      g.lineTo(W, cliffTop+H*0.02);
      g.lineTo(0, cliffTop);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // pasture ridge line
    pen.ink(()=>{
      g.moveTo(0, fieldsTop+H*0.05);
      g.quadraticCurveTo(W*0.18, fieldsTop-H*0.02, W*0.38, fieldsTop+H*0.03);
      g.quadraticCurveTo(W*0.58, fieldsTop+H*0.09, W*0.74, fieldsTop+H*0.01);
      g.quadraticCurveTo(W*0.90, fieldsTop-H*0.03, W, fieldsTop+H*0.04);
    }, 4);
    // grass tufts across the pasture
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let x=W*0.05;x<W*0.98;x+=W*0.06){ const y=cliffTop-H*0.02-((x*11)%18); g.beginPath();
      g.moveTo(x,y); g.lineTo(x-3,y-8); g.moveTo(x,y); g.lineTo(x+3,y-9); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- SMOKE COLUMNS rising from the habitation, up off the clifftop ----
  if (has("smoke")){
    // roots sit on the pasture ridge and rise UP into the open sky
    const roots=[ [0.32,fieldsTop+H*0.02], [0.49,fieldsTop-H*0.01], [0.64,fieldsTop+H*0.01] ];
    for(let i=0;i<Math.min(params.smokeColumns,roots.length);i++){
      smoke(pen, g, W*roots[i][0], roots[i][1], H*0.16+i*H*0.01, W*0.03+i*W*0.006, i*1.7);
    }
  }

  // ---- CLIFF FACE: the sheer opposite wall, mid tone so the cave reads dark ----
  if (has("cliff")){
    pen.paint(()=>{
      g.moveTo(0, cliffTop);
      g.lineTo(W, cliffTop+H*0.02);
      g.lineTo(W, water);
      // jagged rocky base biting into the waterline
      g.lineTo(W*0.82, water-H*0.01);
      g.lineTo(W*0.66, water+H*0.01);
      g.lineTo(W*0.50, water-H*0.015);
      g.lineTo(W*0.33, water+H*0.005);
      g.lineTo(W*0.16, water-H*0.01);
      g.lineTo(0, water);
      g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // strata seams across the rock
    pen.seam(()=>{ g.moveTo(W*0.04,cliffTop+H*0.10); g.quadraticCurveTo(W*0.30,cliffTop+H*0.07,W*0.60,cliffTop+H*0.12); g.quadraticCurveTo(W*0.82,cliffTop+H*0.15,W,cliffTop+H*0.11); }, 3);
    pen.seam(()=>{ g.moveTo(W*0.02,cliffTop+H*0.20); g.quadraticCurveTo(W*0.34,cliffTop+H*0.18,W*0.66,cliffTop+H*0.22); g.quadraticCurveTo(W*0.86,cliffTop+H*0.24,W,cliffTop+H*0.21); }, 3);
    // a few vertical crack marks
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(const cx of [0.12,0.28,0.72,0.88]){ g.beginPath(); g.moveTo(W*cx,cliffTop+H*0.05); g.lineTo(W*cx+W*0.01,water-H*0.03); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- CAVE MOUTH: dark arched opening punched into the cliff (the dwelling) ----
  if (has("cave")){
    const mx=W*0.46, mw=W*0.20, baseY=water-H*0.02, topY=cliffTop+H*0.14;
    pen.paint(()=>{
      g.moveTo(mx-mw/2, baseY);
      g.lineTo(mx-mw/2, topY+H*0.05);
      g.quadraticCurveTo(mx, topY-H*0.05, mx+mw/2, topY+H*0.05);
      g.lineTo(mx+mw/2, baseY);
      g.closePath();
    }, toneSolid(inkLevel(7)), 5);
    // inner-shadow lip to seat it into the rock
    pen.seam(()=>{
      g.moveTo(mx-mw/2, topY+H*0.05);
      g.quadraticCurveTo(mx, topY-H*0.05, mx+mw/2, topY+H*0.05);
    }, 3);
  }

  // ---- ISOLATED DWELLING: boulders + rough pen-wall framing the cave mouth ----
  if (has("dwelling")){
    const mx=W*0.46, baseY=water-H*0.02;
    // flanking boulders at the threshold
    pen.paint(()=>{ g.ellipse(mx-W*0.14, baseY-H*0.02, W*0.045, H*0.04, 0,0,7); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.ellipse(mx+W*0.13, baseY-H*0.015, W*0.05, H*0.045, 0,0,7); }, toneSolid(inkLevel(5)), 4);
    // a low drystone pen-wall of stacked rocks to one side (giant's sheepfold)
    const wx0=mx+W*0.11, wy=baseY-H*0.005;
    for(let i=0;i<6;i++){ const bx=wx0+i*W*0.028;
      pen.paint(()=>{ g.ellipse(bx, wy-(i%2)*H*0.006, W*0.017, H*0.014, 0,0,7); }, toneSolid(inkLevel(4)), 3); }
  }

  // ---- FLOCK-WORN PATHS: switchbacks scuffed down the cliff to the water ----
  if (has("paths") && params.flockPaths){
    flockPath(pen, g, [ [W*0.10,cliffTop+H*0.02],[W*0.20,cliffTop+H*0.09],[W*0.12,cliffTop+H*0.16],[W*0.22,water-H*0.05],[W*0.14,water-H*0.005] ]);
    flockPath(pen, g, [ [W*0.86,cliffTop+H*0.03],[W*0.76,cliffTop+H*0.10],[W*0.86,cliffTop+H*0.18],[W*0.78,water-H*0.04] ]);
  }

  // ---- STRAIT: the narrow sea band between the two shores ----
  if (has("strait")){
    pen.paint(()=>{ g.rect(0, water, W, shore-water); }, toneSolid(inkLevel(3)), 3);
    pen.ink(()=>{ g.moveTo(0,water); g.lineTo(W,water); }, 3);
    // wave dashes
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let j=0;j<3;j++){ const y=water+(shore-water)*(0.25+j*0.28);
      for(let x=W*0.03;x<W*0.97;x+=W*0.085){ g.beginPath(); g.moveTo(x,y); g.lineTo(x+W*0.03,y); g.stroke(); } }
    g.globalAlpha=1;
  }

  // ---- NEAR SHORE: foreground rocky beach (lightest ground) with boulders ----
  if (has("shore")){
    pen.paint(()=>{
      g.moveTo(0, shore+H*0.005);
      g.quadraticCurveTo(W*0.30, shore-H*0.01, W*0.55, shore+H*0.01);
      g.quadraticCurveTo(W*0.80, shore+H*0.02, W, shore-H*0.005);
      g.lineTo(W, H); g.lineTo(0, H); g.closePath();
    }, toneSolid(inkLevel(1)), 4);
    // waterline scallops where beach meets the strait
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
    for(let x=0;x<W;x+=W*0.05){ g.beginPath(); g.arc(x+W*0.025, shore+H*0.006, W*0.024, Math.PI, 0); g.stroke(); }
    g.globalAlpha=1;
    // scattered foreground rocks/boulders on the beach
    const rocks=[ [0.14,0.90,0.05],[0.40,0.95,0.06],[0.70,0.89,0.045],[0.88,0.96,0.055] ];
    for(const [rx,ry,rr] of rocks){
      pen.paint(()=>{ g.ellipse(W*rx, H*ry, W*rr, H*rr*0.5, 0,0,7); }, toneSolid(inkLevel(4)), 4);
      pen.seam(()=>{ g.moveTo(W*rx-W*rr*0.5, H*ry); g.lineTo(W*rx+W*rr*0.4, H*ry-H*rr*0.2); }, 2);
    }
  }
}

export const asset = {
  id:"location.cyclops-coast",
  type:"LOCATION",
  name:"Cyclops Coast",
  statusWord:"WILD",
  scene:"OD-B09-S04",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude
  layers:["sky","fields","smoke","cliff","cave","dwelling","paths","strait","shore","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "threshold:cave-mouth":{x:.46,y:.66},
    "dwelling":{x:.46,y:.66}, "sheepfold":{x:.60,y:.67},
    "fields":{x:.50,y:.34}, "field:west":{x:.20,y:.33}, "field:east":{x:.80,y:.33},
    "smoke:1":{x:.34,y:.36}, "smoke:2":{x:.50,y:.34}, "smoke:3":{x:.63,y:.36},
    "path:west":{x:.16,y:.55}, "path:east":{x:.82,y:.55},
    "strait":{x:.50,y:.75}, "shore":{x:.50,y:.90},
    "entrance:cave":{x:.46,y:.68}, "exit:fields-west":{x:.06,y:.34}, "exit:fields-east":{x:.96,y:.34},
    "camera:wide":{x:.50,y:.50}, "camera:cave":{x:.46,y:.60}, "camera:shore":{x:.50,y:.82},
  },
  // walkable ground regions (for scene placement / pathing)
  zones:{
    shore:{ x0:.00,y0:.80,x1:1.0,y1:1.0 },
    fields:{ x0:.00,y0:.26,x1:1.0,y1:.42 },
    cave:{ x0:.36,y0:.56,x1:.56,y1:.68 },
    strait:{ x0:.00,y0:.70,x1:1.0,y1:.80 },
  },
  states:{
    initial:"day",
    nodes:{
      day:{ preview:{ layers:["sky","fields","smoke","cliff","cave","dwelling","paths","strait","shore"] } },
      "smoke-rising":{ preview:{ layers:["sky","fields","smoke","cliff","cave","dwelling","paths","strait","shore"] } },
      "empty-quiet":{ preview:{ layers:["sky","fields","cliff","cave","dwelling","paths","strait","shore"] } },
      "cave-focus":{ preview:{ layers:["sky","cliff","cave","dwelling","strait","shore"] } },
    },
    edges:[["day","smoke-rising"],["day","empty-quiet"],["day","cave-focus"],["empty-quiet","day"]],
  },
  channels:["reveal","camera","smoke","tide"],

  preview:()=>({ layers:["sky","fields","smoke","cliff","cave","dwelling","paths","strait","shore"], status:"WILD", progress:.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
