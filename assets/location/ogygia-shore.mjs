/* location.ogygia-shore — a rocky lookout on Calypso's island shore.
   LOCATION asset. Empty navigable set: foreground rocks / middle surf /
   background horizon over the sea. Draws SOLID grays + hard contour into the
   offscreen ctx (the engine dotify pass supplies the halftone). Declares depth
   layers, a walkable ledge zone, a fixed weeping-rock position, a horizon
   sightline, a cave path (entrance), a future launch point, and camera anchors.
   Do NOT bake characters in.
   Atlas: OD-B05-S03 — rocky lookout, weeping position, horizon sightline,
   cave path, launch point. */
import { makePen, toneSolid, inkLevel, INK, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  horizon:0.38,        // sea horizon as fraction of H (the sightline)
  waterline:0.56,      // where surf meets the rocks
  cliffSide:"left",    // cliff + cave on the left
  weepX:0.62,          // fixed weeping-rock x (fraction of W)
  launchX:0.86,        // future launch point x
};

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const water   = H*params.waterline;
  const layers = st.layers || ["sky","sea","surf","cliff","cave","ledge","weeprock","launch","anchors"];
  const has = l => layers.includes(l);

  // ---- BACKGROUND: sky (lightest tone -> few dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    // a couple of distant cloud steps, slightly darker
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.30+i*0.28), horizon*(0.30+0.12*(i%2)), W*0.12, H*0.022, 0,0,7); g.fill(); }
  }

  // ---- SEA band with the horizon sightline ----
  if (has("sea")){
    pen.paint(()=>{ g.rect(0,horizon, W, water-horizon); }, toneSolid(inkLevel(3)), 4);
    // hard horizon line = the sightline over the sea
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 5);
    // receding swell lines that get denser + darker toward the shore
    g.strokeStyle=INK; g.lineCap="round";
    for(let j=1;j<=7;j++){
      const t=j/7, y=lerp(horizon, water, t*t);
      g.globalAlpha=0.30+0.40*t; g.lineWidth=2+t*1.5;
      g.beginPath();
      for(let x=0;x<=W;x+=W/16){ const yy=y+Math.sin(x/W*7+j)*H*0.006; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- SURF: foam line where the sea meets the rocks ----
  if (has("surf")){
    pen.paint(()=>{
      g.moveTo(0,water);
      for(let x=0;x<=W;x+=W/14){ g.lineTo(x, water + Math.sin(x/W*11)*H*0.010); }
      g.lineTo(W,water+H*0.04); g.lineTo(0,water+H*0.04); g.closePath();
    }, toneSolid(inkLevel(1)), 3);
    // a few foam flecks (dark contour dabs)
    g.fillStyle=inkLevel(4);
    for(let i=0;i<8;i++){ g.beginPath(); g.arc(W*(0.06+i*0.12), water+Math.sin(i*1.7)*H*0.006, W*0.007, 0,7); g.fill(); }
  }

  // ---- CLIFF headland on the left, a solid dark silhouette to the sky ----
  if (has("cliff")){
    pen.paint(()=>{
      g.moveTo(0, horizon-H*0.05);
      g.lineTo(W*0.20, horizon-H*0.09);
      g.lineTo(W*0.31, horizon+H*0.03);
      g.lineTo(W*0.33, H);
      g.lineTo(0, H);
      g.closePath();
    }, toneSolid(inkLevel(5)), 5);
    // strata seams across the cliff face
    for(let i=1;i<=5;i++){
      const t=i/6;
      pen.seam(()=>{ g.moveTo(0, lerp(horizon,H,t)); g.lineTo(W*(0.31-0.05*t), lerp(horizon+H*0.02,H,t)); }, 3);
    }
  }

  // ---- CAVE mouth set into the cliff base, with a worn path down to the ledge ----
  if (has("cave")){
    const cx=W*0.14, base=water+H*0.10, cw=W*0.13, ch=H*0.15;
    // worn lighter path first, under the mouth, spilling toward the ledge
    pen.paint(()=>{
      g.moveTo(cx-cw*0.30, base);
      g.lineTo(cx+cw*0.30, base);
      g.lineTo(cx+cw*0.70, H);
      g.lineTo(cx-cw*0.10, H);
      g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // the arched opening (darkest)
    pen.paint(()=>{
      g.moveTo(cx-cw/2, base);
      g.lineTo(cx-cw/2, base-ch*0.5);
      g.quadraticCurveTo(cx-cw/2, base-ch, cx, base-ch);
      g.quadraticCurveTo(cx+cw/2, base-ch, cx+cw/2, base-ch*0.5);
      g.lineTo(cx+cw/2, base);
      g.closePath();
    }, toneSolid(inkLevel(7)), 5);
    // path centre-track seam
    pen.seam(()=>{ g.moveTo(cx, base); g.lineTo(cx+cw*0.4, H); }, 3);
  }

  // ---- LEDGE: the foreground rocky lookout (walkable), spanning the base ----
  if (has("ledge")){
    // solid rock shelf mass (medium-dark, reads as ground)
    pen.paint(()=>{
      g.moveTo(W*0.30, water+H*0.04);
      g.lineTo(W, water+H*0.00);
      g.lineTo(W, H);
      g.lineTo(W*0.24, H);
      g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // lighter top surface so the ledge reads as a flat walkable platform
    pen.paint(()=>{
      g.moveTo(W*0.32, water+H*0.038);
      g.lineTo(W, water-H*0.004);
      g.lineTo(W, water+H*0.055);
      g.lineTo(W*0.34, water+H*0.10);
      g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // foreground rock blocks rooted to the bottom edge (fg detail, darkest)
    const blocks=[[0.44,0.88,0.11],[0.74,0.92,0.13]];
    for(const [bx,by,bw] of blocks){
      pen.paint(()=>{ g.rect(W*bx-W*bw/2, H*by, W*bw, H*(1-by)+2); }, toneSolid(inkLevel(6)), 4);
    }
    // crack seams across the ledge surface
    pen.seam(()=>{ g.moveTo(W*0.42, water+H*0.08); g.lineTo(W*0.55, H*0.86); }, 3);
    pen.seam(()=>{ g.moveTo(W*0.90, water+H*0.05); g.lineTo(W*0.84, H*0.90); }, 3);
  }

  // ---- WEEPING ROCK: a fixed standing stone on the lookout (angular, streaked) ----
  if (has("weeprock")){
    const wx=W*params.weepX, base=water+H*0.14, rw=W*0.12, rh=H*0.22;
    pen.paint(()=>{
      g.moveTo(wx-rw/2, base);
      g.lineTo(wx-rw*0.42, base-rh*0.62);
      g.lineTo(wx-rw*0.18, base-rh);         // angular shoulder
      g.lineTo(wx+rw*0.20, base-rh*0.94);
      g.lineTo(wx+rw*0.46, base-rh*0.55);
      g.lineTo(wx+rw/2, base);
      g.closePath();
    }, toneSolid(inkLevel(5)), 5);
    // a facet seam giving the stone volume
    pen.seam(()=>{ g.moveTo(wx-rw*0.18, base-rh); g.lineTo(wx-rw*0.05, base); }, 3);
    // "weeping" streaks running down the rock face (water/tears)
    g.strokeStyle=INK; g.lineCap="round";
    for(let i=-2;i<=2;i++){
      g.lineWidth=3; g.globalAlpha=0.7;
      const sx=wx+i*rw*0.16;
      g.beginPath(); g.moveTo(sx, base-rh*0.78); g.lineTo(sx+i*W*0.006, base-H*0.004); g.stroke();
    }
    g.globalAlpha=1;
    // a pooled damp patch at the base (darkest)
    g.fillStyle=inkLevel(7);
    g.beginPath(); g.ellipse(wx, base, rw*0.60, H*0.014, 0,0,7); g.fill();
  }

  // ---- LAUNCH POINT: a flat jut of rock at the water's edge (future departure) ----
  if (has("launch")){
    const lx=W*params.launchX, ly=water+H*0.03;
    pen.paint(()=>{
      g.moveTo(lx-W*0.12, ly);
      g.lineTo(lx+W*0.13, ly-H*0.012);
      g.lineTo(lx+W*0.11, ly+H*0.05);
      g.lineTo(lx-W*0.12, ly+H*0.055);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // a mooring notch marking the embark spot
    g.fillStyle=inkLevel(7);
    g.beginPath(); g.arc(lx+W*0.05, ly+H*0.010, W*0.013, 0,7); g.fill();
    pen.seam(()=>{ g.moveTo(lx+W*0.05, ly-H*0.02); g.lineTo(lx+W*0.05, ly+H*0.04); }, 3);
  }
}

export const asset = {
  id:"location.ogygia-shore",
  type:"LOCATION",
  name:"Ogygia Shore",
  statusWord:"LONGING",
  scene:"OD-B05-S03",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","sea","surf","cliff","cave","ledge","weeprock","launch","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "weeping:seat":{x:0.60,y:0.72},        // fixed weeping-rock position
    "sightline:horizon":{x:0.50,y:0.40},   // the sea horizon he gazes toward
    "cave:mouth":{x:0.15,y:0.58},          // cave opening
    "path:cave":{x:0.20,y:0.86},           // worn path down from the cave
    "launch:point":{x:0.84,y:0.62},        // future embark / departure spot
    "entrance:cave":{x:0.15,y:0.60},
    "exit:water":{x:0.90,y:0.62},
    "camera:wide":{x:0.50,y:0.50},
    "camera:lookout":{x:0.60,y:0.66},
  },
  // walkable ground region + sub-zones (for scene placement / pathing)
  zones:{
    walkable:{ x0:0.34,y0:0.66,x1:0.98,y1:0.96 },
    lookout:{ x0:0.50,y0:0.66,x1:0.72,y1:0.80 },
    waterline:{ x0:0.00,y0:0.58,x1:1.00,y1:0.64 },
  },
  states:{
    initial:"day",
    nodes:{
      day:{ preview:{ layers:["sky","sea","surf","cliff","cave","ledge","weeprock","launch"] } },
      weeping:{ preview:{ layers:["sky","sea","surf","cliff","cave","ledge","weeprock"] } },
      departure:{ preview:{ layers:["sky","sea","surf","cliff","ledge","launch"] } },
    },
    edges:[["day","weeping"],["weeping","day"],["day","departure"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({ layers:["sky","sea","surf","cliff","cave","ledge","weeprock","launch"], status:"LONGING", progress:0.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
