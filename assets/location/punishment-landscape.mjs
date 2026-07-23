/* location.punishment-landscape — the gloomy underworld plain of the damned.
   LOCATION asset. An EMPTY navigable set (no baked characters): a dark
   plain divided into five separable punishment zones the runtime can occupy
   and the camera can frame independently —
     · a raised JUDGMENT DAIS (Minos' seat of sentencing)
     · an open HUNTING FIELD (Orion's asphodel chase)
     · a rocky VULTURE-ATTACK LEDGE (Tityos, birds circling overhead)
     · a receding WATER / FRUIT POOL (Tantalus, water sunk low, fruit above reach)
     · a rolling-STONE SLOPE (Sisyphus' incline + boulder)
   Drawn in SOLID grays + hard contour; the engine dotify pass supplies the
   halftone. Gloomy: dark void overhead, pale plain, dark structures.
   Atlas: OD-B11-S08 — separable zones for judgment / hunting / vulture /
   receding water-fruit / rolling stone. */
import { makePen, toneSolid, inkLevel, INK } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.40,          // fraction of H where the void meets the plain
  zones:5,               // judgment / hunting / vulture / pool / slope
  gloom:true,            // dark void band overhead
};

/* ---- zone: JUDGMENT DAIS — stepped platform + throne back ---- */
function drawDais(pen,g,W,H,cx,by){
  const w=W*0.11;
  for(let i=0;i<3;i++){                       // three receding steps
    const ww=w*(1-i*0.16), hh=H*0.026;
    pen.paint(()=>{ g.rect(cx-ww/2, by-hh*(i+1), ww, hh); }, toneSolid(inkLevel(3+i)), 4);
  }
  const tw=w*0.46, seatTop=by-H*0.078;
  pen.paint(()=>{ g.rect(cx-tw/2, seatTop-H*0.075, tw, H*0.11); }, toneSolid(inkLevel(6)),4); // throne back
  pen.paint(()=>{ g.rect(cx-tw*0.72, seatTop, tw*1.44, H*0.026); }, toneSolid(inkLevel(6)),4); // seat slab
}

/* ---- zone: HUNTING FIELD — open patch with reed/asphodel tufts ---- */
function drawHuntingField(pen,g,W,H,cx,by){
  const w=W*0.15, h=H*0.05;
  pen.paint(()=>{ g.ellipse(cx,by,w,h,0,0,7); }, toneSolid(inkLevel(3)),3); // field patch
  g.strokeStyle=INK; g.lineWidth=2.4; g.lineCap="round";
  for(let i=-3;i<=3;i++){
    const x=cx+i*w*0.26, y=by-h*0.2-Math.abs(i)*1.5, tall=H*0.05;
    g.beginPath(); g.moveTo(x,y); g.lineTo(x,y-tall); g.stroke();          // stalk
    g.beginPath(); g.moveTo(x,y-tall*0.55); g.lineTo(x-7,y-tall*0.95); g.stroke(); // fronds
    g.beginPath(); g.moveTo(x,y-tall*0.55); g.lineTo(x+7,y-tall*0.95); g.stroke();
  }
}

/* ---- zone: VULTURE-ATTACK LEDGE — low rock shelf + circling birds ---- */
function drawVultureLedge(pen,g,W,H,cx,by){
  const w=W*0.11;
  pen.paint(()=>{                              // low blocky outcrop (a shelf, not a peak)
    g.moveTo(cx-w, by);
    g.lineTo(cx-w*0.85, by-H*0.07);
    g.lineTo(cx-w*0.2,  by-H*0.055);
    g.lineTo(cx+w*0.3,  by-H*0.10);
    g.lineTo(cx+w*0.9,  by-H*0.075);
    g.lineTo(cx+w, by);
    g.closePath();
  }, toneSolid(inkLevel(5)),4);
  pen.paint(()=>{ g.rect(cx-w*0.95, by-H*0.115, w*1.9, H*0.022); }, toneSolid(inkLevel(6)),4); // flat ledge slab
  // circling vultures overhead (clear gull marks against the void)
  g.strokeStyle=INK; g.lineWidth=3.4; g.lineCap="round"; g.lineJoin="round";
  const birds=[[cx-w*0.75,by-H*0.30,16],[cx+w*0.6,by-H*0.37,13],[cx-w*0.05,by-H*0.45,20]];
  for(const [bx,byy,s] of birds){
    g.beginPath();
    g.moveTo(bx-s,byy); g.quadraticCurveTo(bx-s*0.42,byy-s*0.5, bx,byy);
    g.quadraticCurveTo(bx+s*0.42,byy-s*0.5, bx+s,byy); g.stroke();
  }
}

/* ---- zone: RECEDING WATER / FRUIT POOL — sunk water + overhanging fruit ---- */
function drawPool(pen,g,W,H,cx,by){
  const w=W*0.10, h=H*0.038;
  pen.paint(()=>{ g.ellipse(cx,by,w,h,0,0,7); }, toneSolid(inkLevel(4)),4); // basin rim
  // water receded low: a small pale pool sunk at the bottom of the basin
  g.fillStyle=inkLevel(2);
  g.beginPath(); g.ellipse(cx,by+h*0.28,w*0.5,h*0.42,0,0,7); g.fill();
  g.strokeStyle=INK; g.lineWidth=1.6; g.beginPath(); g.ellipse(cx,by+h*0.28,w*0.5,h*0.42,0,0,7); g.stroke();
  // overhanging branch + fruit, forever above reach
  g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round";
  g.beginPath(); g.moveTo(cx+w*1.15, by-H*0.155);
  g.quadraticCurveTo(cx+w*0.35, by-H*0.125, cx-w*0.15, by-H*0.075); g.stroke();
  for(const [fx,fy] of [[cx+w*0.55,by-H*0.108],[cx+w*0.05,by-H*0.088],[cx-w*0.08,by-H*0.07]]){
    pen.paint(()=>{ g.arc(fx,fy, W*0.013,0,7); }, toneSolid(inkLevel(5)),3);
  }
}

/* ---- zone: ROLLING-STONE SLOPE — incline + boulder + track ---- */
function drawSlope(pen,g,W,H,cx,by){
  const w=W*0.13, h=H*0.15;
  pen.paint(()=>{                              // incline wedge
    g.moveTo(cx-w, by);
    g.lineTo(cx+w, by);
    g.lineTo(cx+w, by-h);
    g.closePath();
  }, toneSolid(inkLevel(4)),4);
  g.strokeStyle=INK; g.lineWidth=2; g.setLineDash([7,7]); // rolled track down the face
  g.beginPath(); g.moveTo(cx+w, by-h); g.lineTo(cx-w, by); g.stroke(); g.setLineDash([]);
  const bx=cx+w*0.05, byy=by-h*0.42;           // boulder caught partway up
  pen.paint(()=>{ g.arc(bx,byy, W*0.036,0,7); }, toneSolid(inkLevel(6)),4);
  g.strokeStyle=INK; g.lineWidth=1.5;          // a couple of chisel cracks
  g.beginPath(); g.moveTo(bx-W*0.014,byy-W*0.01); g.lineTo(bx+W*0.01,byy+W*0.006); g.stroke();
}

/* draw a subset of layers so scene state can reveal / isolate zones */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["void","plain","dais","hunting","ledge","pool","slope","anchors"];
  const has = l => layers.includes(l);

  // ---- BACKGROUND: cavern void, gloom thickening toward the plain ----
  if (has("void")){
    g.fillStyle = inkLevel(2); g.fillRect(0,0,W,horizon);                    // light roof air (keeps LABEL legible)
    if (params.gloom){                                                       // stepped murk near the ground (no gradient)
      g.fillStyle = inkLevel(3); g.fillRect(0,horizon-H*0.14,W,H*0.14);
      g.fillStyle = inkLevel(4); g.fillRect(0,horizon-H*0.05,W,H*0.05);
    }
    // hanging stalactites — kept clear of the top-left label
    g.fillStyle = inkLevel(6);
    for(let i=0;i<6;i++){
      const x=W*(0.46+i*0.095), d=H*(0.05+0.03*((i*11)%3));
      g.beginPath(); g.moveTo(x-W*0.016,0); g.lineTo(x+W*0.016,0); g.lineTo(x,d); g.closePath(); g.fill();
    }
  }

  // ---- PLAIN: pale ground so the dark structures read (mid-far to fg) ----
  if (has("plain")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 4);       // horizon lip
    // a few receding furrow rules to give the plain depth
    g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=0.35;
    for(let j=1;j<=4;j++){ const y=horizon+(H-horizon)*(j/4)*(j/4);
      g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
    // darker foreground lip for a gloomy near-edge
    g.fillStyle=inkLevel(3); g.fillRect(0,H*0.94,W,H*0.06);
  }

  // ---- the five separable punishment ZONES (back -> front by base-y) ----
  if (has("ledge"))   drawVultureLedge (pen,g,W,H, W*0.55, H*0.58);
  if (has("dais"))    drawDais         (pen,g,W,H, W*0.15, H*0.66);
  if (has("pool"))    drawPool         (pen,g,W,H, W*0.76, H*0.72);
  if (has("hunting")) drawHuntingField (pen,g,W,H, W*0.36, H*0.80);
  if (has("slope"))   drawSlope        (pen,g,W,H, W*0.91, H*0.86);
}

export const asset = {
  id:"location.punishment-landscape",
  type:"LOCATION",
  name:"Punishment Landscape",
  statusWord:"GLOOMY",
  scene:"OD-B11-S08",

  params,
  // back -> front draw order; scene state can pass any subset to isolate a zone
  layers:["void","plain","dais","hunting","ledge","pool","slope","anchors"],
  // normalized 0..1 placement / camera anchors (NO baked characters)
  anchors:{
    "zone:judgment":{x:.15,y:.62},   "zone:hunting":{x:.36,y:.78},
    "zone:vulture":{x:.55,y:.55},    "zone:water-fruit":{x:.76,y:.70},
    "zone:rolling-stone":{x:.91,y:.80},
    "mark:throne-seat":{x:.15,y:.58}, "mark:ledge-top":{x:.55,y:.50},
    "mark:pool-water":{x:.76,y:.73},  "mark:boulder":{x:.91,y:.74},
    "vultures:orbit":{x:.55,y:.30},
    "threshold:descent":{x:.03,y:.90}, "exit:far":{x:.97,y:.46},
    "camera:wide":{x:.50,y:.50}, "camera:judgment":{x:.15,y:.60},
    "camera:slope":{x:.91,y:.66},
  },
  // walkable plain + per-zone footprints for scene placement / pathing
  zones:{
    walkable:{ x0:.02,y0:.42,x1:.98,y1:.98 },
    judgment:{ x0:.05,y0:.55,x1:.27,y1:.70 },
    hunting:{ x0:.22,y0:.72,x1:.51,y1:.86 },
    vulture:{ x0:.44,y0:.40,x1:.66,y1:.62 },
    "water-fruit":{ x0:.66,y0:.55,x1:.87,y1:.78 },
    "rolling-stone":{ x0:.78,y0:.68,x1:.99,y1:.90 },
  },
  states:{
    initial:"gloomy",
    nodes:{
      gloomy:{ preview:{ layers:["void","plain","dais","hunting","ledge","pool","slope"] } },
      "judgment-focus":{ preview:{ layers:["void","plain","dais"] } },
      "hunting-focus":{ preview:{ layers:["void","plain","hunting"] } },
      "vulture-focus":{ preview:{ layers:["void","plain","ledge"] } },
      "water-focus":{ preview:{ layers:["void","plain","pool"] } },
      "stone-focus":{ preview:{ layers:["void","plain","slope"] } },
      empty:{ preview:{ layers:["void","plain"] } },
    },
    edges:[
      ["gloomy","judgment-focus"],["gloomy","hunting-focus"],["gloomy","vulture-focus"],
      ["gloomy","water-focus"],["gloomy","stone-focus"],["gloomy","empty"],
    ],
  },
  channels:["reveal","camera","gloom"],

  preview:()=>({ layers:["void","plain","dais","hunting","ledge","pool","slope"], status:"GLOOMY", progress:.16 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
