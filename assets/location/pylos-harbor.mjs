/* location.pylos-harbor — the sandy harbor of Pylos: a ship beach, a chariot
   arrival road, a crew staging area, a farewell edge at the waterline, and an
   open-sea route out toward the horizon.
   LOCATION asset. Empty navigable set drawn in SOLID grays + hard contour into
   the offscreen ctx (the engine dotify pass supplies the halftone). Declares
   depth layers (fg beach / mid staging / bg sea), walkable zones, the road
   entrance, the ship berth, the farewell edge, camera anchors, and states.
   NO baked characters.
   Atlas: OD-B15-S03 — ship beach, chariot arrival, crew staging, farewell edge,
   open-sea route. */
import { makePen, toneSolid, inkLevel, INK, ACCENT } from "/engine/halfworld-engine.mjs";

const params = {
  skyLevel:   0.14,   // sky band bottom, fraction of H
  horizon:    0.30,   // far sea meets sky
  shore:      0.52,   // waterline / farewell edge, fraction of H
  roadY:      0.62,   // where the chariot road enters at the left edge
  berthX:     0.70,   // ship berth center, fraction of W
  waveRows:   5,      // wave rules over the sea
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const skyY   = H*params.skyLevel;
  const horiz  = H*params.horizon;
  const shore  = H*params.shore;
  const layers = st.layers || ["sky","sea","searoute","waves","beach","farewell","road","staging","ship","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY band (lightest — nearly bare paper) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,skyY+H*0.02);
  }

  // ---- BACKGROUND: open SEA (light-mid tone) from sky band to the shore ----
  if (has("sea")){
    g.fillStyle = inkLevel(2); g.fillRect(0, skyY, W, shore-skyY);
    // deeper water toward the shore reads a touch darker
    g.fillStyle = inkLevel(3); g.fillRect(0, horiz+(shore-horiz)*0.45, W, shore-(horiz+(shore-horiz)*0.45));
    // horizon rule
    pen.ink(()=>{ g.moveTo(0,horiz); g.lineTo(W,horiz); }, 3);
  }

  // ---- OPEN-SEA ROUTE OUT: a light lane tapering from the shore gap to the
  //      horizon (the exit heading), read as calmer water ----
  if (has("searoute")){
    const mouthX0 = W*0.26, mouthX1 = W*0.50;         // wide at the shore
    const vanX0   = W*0.375, vanX1 = W*0.415;         // narrow at the horizon
    const cShore = (mouthX0+mouthX1)/2, cVan = (vanX0+vanX1)/2;
    const laneX = t => cShore + (cVan-cShore)*t;      // center of lane at param t (0 shore..1 horizon)
    const laneY = t => shore + (horiz-shore)*t;
    // faint calmer-water lane (lighter tone, NO hard outline)
    g.save();
    g.fillStyle = inkLevel(1);
    g.beginPath();
    g.moveTo(mouthX0, shore); g.lineTo(mouthX1, shore);
    g.lineTo(vanX1, horiz);   g.lineTo(vanX0, horiz); g.closePath(); g.fill();
    g.restore();
    // dashed channel-edge guides converging to the horizon gap
    g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.55; g.setLineDash([5,5]);
    g.beginPath(); g.moveTo(mouthX0,shore); g.lineTo(vanX0,horiz); g.stroke();
    g.beginPath(); g.moveTo(mouthX1,shore); g.lineTo(vanX1,horiz); g.stroke();
    g.setLineDash([]);
    // chevrons pointing out to sea (the departure heading)
    g.lineWidth=2; g.globalAlpha=0.6; g.lineCap="round";
    for(const t of [0.28,0.55,0.82]){
      const x=laneX(t), y=laneY(t), w=8*(1-0.5*t), h=8*(1-0.5*t);
      g.beginPath(); g.moveTo(x-w,y+h); g.lineTo(x,y); g.lineTo(x+w,y+h); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- WAVE rules over the sea (thin dashes, receding) ----
  if (has("waves")){
    g.strokeStyle=INK; g.lineCap="round";
    for(let r=0;r<params.waveRows;r++){
      const t=r/(params.waveRows-1);
      const y=horiz+(shore-horiz)*(0.10+0.9*t*t);
      const gap=14+t*10, dash=7+t*7, amp=1.5+t*2;
      g.lineWidth=1.4+t*1.6; g.globalAlpha=0.35+0.2*t;
      for(let x=8; x<W-8; x+=gap+dash){
        g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+dash*0.5, y-amp, x+dash, y); g.stroke();
      }
    }
    g.globalAlpha=1;
  }

  // ---- FOREGROUND: the ship BEACH (light sand) below the shoreline ----
  if (has("beach")){
    g.fillStyle = inkLevel(2); g.fillRect(0, shore, W, H-shore);
    // a faint drier-sand band lower down
    g.fillStyle = inkLevel(1); g.fillRect(0, shore+(H-shore)*0.42, W, (H-shore)*0.58);
  }

  // ---- FAREWELL EDGE: the waterline where crews part — a lapping contour ----
  if (has("farewell")){
    g.strokeStyle=INK; g.lineWidth=4; g.lineJoin="round"; g.lineCap="round";
    g.beginPath();
    for(let x=0;x<=W;x+=W/24){
      const y=shore + Math.sin(x/W*Math.PI*6)*4;
      if(x===0) g.moveTo(x,y); else g.lineTo(x,y);
    }
    g.stroke();
    // thin foam line just below
    g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.4; g.beginPath();
    for(let x=0;x<=W;x+=W/24){ const y=shore+7+Math.sin(x/W*Math.PI*6+1)*3; if(x===0)g.moveTo(x,y);else g.lineTo(x,y); }
    g.stroke(); g.globalAlpha=1;
  }

  // ---- CHARIOT ARRIVAL ROAD: a packed track receding in from the left, down
  //      to the staging ground (a trapezoid with edge lines + cross ruts) ----
  if (has("road")){
    const ry = H*params.roadY;
    const nearX=0, nearYt=ry-H*0.055, nearYb=ry+H*0.075;   // wide at the left edge
    const farX=W*0.30, farYt=shore+H*0.02, farYb=shore+H*0.055; // narrows toward staging
    pen.paint(()=>{
      g.moveTo(nearX, nearYt);
      g.lineTo(farX,  farYt);
      g.lineTo(farX,  farYb);
      g.lineTo(nearX, nearYb);
      g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    // cross ruts / wheel marks
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    for(let i=1;i<=5;i++){
      const t=i/6;
      const xt=nearX+(farX-nearX)*t, yt=nearYt+(farYt-nearYt)*t;
      const xb=nearX+(farX-nearX)*t, yb=nearYb+(farYb-nearYb)*t;
      g.beginPath(); g.moveTo(xt,yt); g.lineTo(xb,yb); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- CREW STAGING AREA: a marked oval mustering ground on the sand with
  //      corner posts (empty — no baked crew) ----
  if (has("staging")){
    const sx=W*0.40, sy=H*0.74, sw=W*0.22, sh=H*0.075;
    pen.paint(()=>{ g.ellipse(sx,sy,sw,sh,0,0,7); }, toneSolid(inkLevel(2)), 4);
    // inner ring
    pen.ink(()=>{ g.ellipse(sx,sy,sw*0.66,sh*0.66,0,0,7); }, 2);
    // corner posts
    const posts=[[-1,-1],[1,-1],[-1,1],[1,1]];
    for(const [dx,dy] of posts){
      const px=sx+dx*sw*0.92, py=sy+dy*sh*0.88;
      pen.paint(()=>{ g.rect(px-2.5, py-H*0.028, 5, H*0.028); }, toneSolid(inkLevel(6)), 2);
    }
  }

  // ---- SHIP BERTH: a beached ship hull drawn up on the sand at the waterline
  //      (dark focal mass, empty — the vessel only, no crew) ----
  if (has("ship")){
    const bx=W*params.berthX, keel=shore+H*0.06, len=W*0.30, dep=H*0.085;
    // berth scored into the sand under the hull
    pen.paint(()=>{ g.ellipse(bx, keel+dep*0.55, len*0.62, dep*0.55, 0,0,7); }, toneSolid(inkLevel(3)), 3);
    // hull — a beached crescent
    pen.paint(()=>{
      g.moveTo(bx-len/2, keel-dep*0.5);
      g.quadraticCurveTo(bx-len*0.30, keel+dep, bx, keel+dep);
      g.quadraticCurveTo(bx+len*0.30, keel+dep, bx+len/2, keel-dep*0.5);
      g.quadraticCurveTo(bx+len*0.34, keel-dep*0.2, bx+len*0.20, keel-dep*0.3);
      g.lineTo(bx-len*0.20, keel-dep*0.3);
      g.quadraticCurveTo(bx-len*0.34, keel-dep*0.2, bx-len/2, keel-dep*0.5);
      g.closePath();
    }, toneSolid(inkLevel(6)), 5);
    // upswept prow post
    pen.paint(()=>{
      g.moveTo(bx-len/2, keel-dep*0.5);
      g.quadraticCurveTo(bx-len*0.56, keel-dep*1.9, bx-len*0.44, keel-dep*2.1);
      g.quadraticCurveTo(bx-len*0.40, keel-dep*1.3, bx-len*0.42, keel-dep*0.7);
      g.closePath();
    }, toneSolid(inkLevel(6)), 4);
    // strake line along the hull
    pen.ink(()=>{ g.moveTo(bx-len*0.44, keel-dep*0.1); g.quadraticCurveTo(bx, keel+dep*0.45, bx+len*0.44, keel-dep*0.1); }, 2);
    // mast + furled yard
    pen.paint(()=>{ g.rect(bx-3, keel-dep*2.4, 6, dep*2.4); }, toneSolid(inkLevel(6)), 3);
    pen.ink(()=>{ g.moveTo(bx-len*0.16, keel-dep*2.15); g.lineTo(bx+len*0.16, keel-dep*2.15); }, 4);
  }
}

export const asset = {
  id:"location.pylos-harbor",
  type:"LOCATION",
  name:"Pylos Harbor",
  statusWord:"BECALMED",
  scene:"OD-B15-S03",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","sea","searoute","waves","beach","farewell","road","staging","ship","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "berth:ship":{x:.70,y:.58},
    "road:entrance":{x:.02,y:.62},
    "staging:crew":{x:.40,y:.74},
    "edge:farewell":{x:.28,y:.52},
    "route:open-sea":{x:.61,y:.30},
    "exit:sea":{x:.60,y:.20},
    "entrance:road":{x:.02,y:.62},
    "camera:wide":{x:.50,y:.44},
    "camera:beach":{x:.45,y:.70},
    "camera:farewell":{x:.40,y:.55},
  },
  // navigable regions (for scene placement / pathing)
  zones:{
    beach:{ x0:.04,y0:.54,x1:.96,y1:.96 },
    staging:{ x0:.26,y0:.68,x1:.54,y1:.82 },
    water:{ x0:.00,y0:.16,x1:1.0,y1:.52 },
    road:{ x0:.00,y0:.55,x1:.32,y1:.72 },
    searoute:{ x0:.50,y0:.30,x1:.74,y1:.52 },
  },
  states:{
    initial:"arrival",
    nodes:{
      // chariot arrival: full set, ship berthed
      arrival:{ preview:{ layers:["sky","sea","searoute","waves","beach","farewell","road","staging","ship"] } },
      // crew mustered, farewell at the waterline
      farewell:{ preview:{ layers:["sky","sea","searoute","waves","beach","farewell","road","staging","ship"] } },
      // the ship has taken the open-sea route out — berth empty
      departed:{ preview:{ layers:["sky","sea","searoute","waves","beach","farewell","road","staging"] } },
    },
    edges:[["arrival","farewell"],["farewell","departed"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({
    layers:["sky","sea","searoute","waves","beach","farewell","road","staging","ship"],
    status:"BECALMED", progress:.22,
  }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
