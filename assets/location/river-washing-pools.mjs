/* location.river-washing-pools — the river washing-place where Nausicaa and
   her maids do the palace laundry. LOCATION asset. Empty navigable set:
   shallow stone WASH-BASINS in the foreground, fed off a RIVER, a shingly
   CLOTHES-SPREADING BEACH, a MULE GRAZING meadow, a flat BALL-COURT, a
   PICNIC patch, and a BG FOREST EDGE with a leaf-covered HOLLOW. Draws SOLID
   grays + hard contour into the offscreen ctx (the engine dotify pass supplies
   the halftone). Declares depth layers (fg pools / mid beach / bg forest),
   walkable zones, entrances/exits and camera anchors. Do NOT bake characters in.
   Atlas: OD-B06-S02 — basins, clothes beach, mule zone, picnic, ball court,
   forest edge with leaf hollow. */
import { makePen, toneSolid, inkLevel, INK, lerp, clamp } from "/engine/halfworld-engine.mjs";

const params = {
  forestBase:0.27,     // forest crown reaches down to this fraction of H
  riverTop:0.27,       // river band top (fraction of H)
  riverBot:0.37,       // river band bottom
  poolsTop:0.60,       // foreground wash-basins begin here
  hollowX:0.84,        // leaf-covered hollow centre (fraction of W)
  basins:3,            // number of stone wash-basins
};

/* one shallow stone wash-basin: stone rim (dark) + light still water inset */
function drawBasin(pen, g, cx, cy, w, h){
  // outer stone rim — a rounded stone trough
  pen.paint(()=>{ ellipsePath(g, cx, cy, w*0.5, h*0.5); }, toneSolid(inkLevel(6)), 5);
  // inner lip
  pen.paint(()=>{ ellipsePath(g, cx, cy-h*0.04, w*0.40, h*0.40); }, toneSolid(inkLevel(5)), 3);
  // still water pool (light so it reads as water in a stone basin)
  pen.paint(()=>{ ellipsePath(g, cx, cy-h*0.06, w*0.30, h*0.30); }, toneSolid(inkLevel(2)), 3);
  // a couple of calm ripple arcs on the water
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45; g.lineCap="round";
  for(let i=1;i<=2;i++){
    g.beginPath(); g.ellipse(cx, cy-h*0.06, w*0.30*(0.4+0.28*i), h*0.30*(0.4+0.28*i), 0, Math.PI*0.15, Math.PI*0.85); g.stroke();
  }
  g.globalAlpha=1;
  // set stones ringing the rim (worked stone blocks) for the diagrammatic look
  g.fillStyle=inkLevel(7);
  const blocks=8;
  for(let i=0;i<blocks;i++){
    const a=(i/blocks)*Math.PI*2 + 0.2;
    const x=cx+Math.cos(a)*w*0.47, y=cy+Math.sin(a)*h*0.47;
    g.fillRect(x-w*0.03, y-h*0.03, w*0.06, h*0.06);
  }
}
function ellipsePath(g, cx, cy, rx, ry){ g.ellipse(cx, cy, rx, ry, 0, 0, 7); }

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const fBase = H*params.forestBase;
  const rTop  = H*params.riverTop, rBot = H*params.riverBot;
  const pTop  = H*params.poolsTop;
  const layers = st.layers || ["sky","forest","hollow","river","beach","mule","picnic","court","channel","pools","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY strip behind the tree line (lightest tone) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,fBase);
  }

  // ---- BG FOREST: a scalloped dark tree crown across the top ----
  if (has("forest")){
    const top=H*0.05;
    pen.paint(()=>{
      g.moveTo(0, fBase);
      const n=11;
      for(let i=0;i<=n;i++){
        const x=(W)*(i/n);
        const crown = top + (i%2?H*0.045:H*0.01) + Math.abs(Math.sin(i*1.9))*H*0.03;
        if(i===0){ g.lineTo(x, crown); }
        else { const px=W*((i-0.5)/n); g.quadraticCurveTo(px, crown-H*0.05, x, crown); }
      }
      g.lineTo(W, fBase); g.closePath();
    }, toneSolid(inkLevel(5)), 4);
    // hard tree-line seam along the meadow edge
    pen.ink(()=>{ g.moveTo(0,fBase); g.lineTo(W,fBase); }, 4);
    // inner trunk band for depth
    g.fillStyle=inkLevel(6);
    for(let i=0;i<8;i++){ const tx=W*(0.06+i*0.12); g.fillRect(tx, fBase-H*0.055, W*0.012, H*0.055); }
  }

  // ---- RIVER: a water band running across, below the forest (mid tone) ----
  if (has("river")){
    pen.paint(()=>{ g.rect(0, rTop, W, rBot-rTop); }, toneSolid(inkLevel(3)), 3);
    // hard banks
    pen.ink(()=>{ g.moveTo(0,rTop); g.lineTo(W,rTop); }, 4);
    pen.ink(()=>{ g.moveTo(0,rBot); g.lineTo(W,rBot); }, 4);
    // flowing ripple lines along the current
    g.strokeStyle=INK; g.lineCap="round"; g.globalAlpha=0.5;
    for(let j=1;j<=3;j++){
      const y=lerp(rTop, rBot, j/4); g.lineWidth=2;
      g.beginPath();
      for(let x=0;x<=W;x+=W/24){ const yy=y+Math.sin(x/W*11+j)*H*0.006; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- MID BEACH: the light sand/meadow ground plane (river -> pools) ----
  if (has("beach")){
    pen.paint(()=>{ g.rect(0, rBot, W, pTop-rBot); }, toneSolid(inkLevel(2)), 3);
    // CLOTHES-SPREADING shingle: a light gravel strip of pebbles beside the river
    g.fillStyle=inkLevel(3);
    for(let i=0;i<26;i++){
      const x=W*(0.06+ (i*0.037)%0.88), y=rBot+H*0.015+ (i%3)*H*0.012 + Math.sin(i*1.7)*H*0.006;
      g.beginPath(); g.ellipse(x, y, W*0.012, H*0.006, 0,0,7); g.fill();
    }
    // dividing seam between the shingle beach and the grassy meadow behind the pools
    pen.seam(()=>{ g.moveTo(0, pTop); g.lineTo(W, pTop); }, 3);
  }

  // ---- MULE GRAZING zone: grass tufts on the meadow (left) ----
  if (has("mule")){
    g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round";
    for(let i=0;i<14;i++){
      const x=W*(0.05+ (i*0.021)), y=rBot+H*0.055 + (i%4)*H*0.018;
      if(x>W*0.30) continue;
      g.beginPath();
      g.moveTo(x, y); g.lineTo(x-W*0.006, y-H*0.02);
      g.moveTo(x, y); g.lineTo(x, y-H*0.026);
      g.moveTo(x, y); g.lineTo(x+W*0.006, y-H*0.02);
      g.stroke();
    }
  }

  // ---- PICNIC area: a flat cleared patch with a low spread mat (centre) ----
  if (has("picnic")){
    const cx=W*0.40, cy=rBot+H*0.115, w=W*0.14, h=H*0.05;
    pen.paint(()=>{ g.rect(cx-w/2, cy-h/2, w, h); }, toneSolid(inkLevel(3)), 3);
    // fold lines across the mat
    pen.seam(()=>{ g.moveTo(cx-w/2, cy); g.lineTo(cx+w/2, cy); }, 2);
    pen.seam(()=>{ g.moveTo(cx, cy-h/2); g.lineTo(cx, cy+h/2); }, 2);
  }

  // ---- flat BALL-COURT: a marked-out play rectangle in perspective (right) ----
  if (has("court")){
    const y0=rBot+H*0.06, y1=rBot+H*0.155;
    const xL0=W*0.55, xR0=W*0.80, xL1=W*0.52, xR1=W*0.84;   // slight trapezoid
    pen.paint(()=>{
      g.moveTo(xL0,y0); g.lineTo(xR0,y0); g.lineTo(xR1,y1); g.lineTo(xL1,y1); g.closePath();
    }, toneSolid(inkLevel(2)), 3);
    // court boundary + centre line
    pen.ink(()=>{
      g.moveTo(xL0,y0); g.lineTo(xR0,y0); g.lineTo(xR1,y1); g.lineTo(xL1,y1); g.closePath();
    }, 3);
    pen.seam(()=>{ g.moveTo((xL0+xR0)/2, y0); g.lineTo((xL1+xR1)/2, y1); }, 2);
  }

  // ---- leaf-covered HOLLOW: a leafy bush thicket at the right treeline with a
  //      dark sleeping nook, sat on the light bank so it reads off the forest.
  //      Drawn after the meadow plane so it is not painted over. ----
  if (has("hollow")){
    const hx=W*0.90, hy=rBot+H*0.075, r=W*0.095;
    // short trunk grounding the thicket on the bank
    pen.paint(()=>{ g.rect(hx-W*0.012, hy+r*0.34, W*0.024, H*0.045); }, toneSolid(inkLevel(6)), 3);
    // leafy scalloped bush mass (mid tone, distinct from the darker forest)
    pen.paint(()=>{
      const lobes=11;
      for(let i=0;i<=lobes;i++){
        const a=(i/lobes)*Math.PI*2;
        const rr=r*(0.82+0.20*Math.sin(i*2.3));
        const x=hx+Math.cos(a)*rr, y=hy+Math.sin(a)*rr*0.80;
        i===0?g.moveTo(x,y):g.lineTo(x,y);
      }
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    // interior leaf clumps for foliage texture
    g.fillStyle=inkLevel(5);
    for(let i=0;i<5;i++){ const a=i*1.3; g.beginPath(); g.arc(hx+Math.cos(a)*r*0.42, hy+Math.sin(a)*r*0.28, r*0.22, 0,7); g.fill(); }
    // the dark leaf-covered hollow itself (the sleeping nook at its base)
    g.fillStyle=inkLevel(7);
    g.beginPath(); g.ellipse(hx, hy+r*0.40, r*0.36, r*0.26, 0,0,7); g.fill();
  }

  // ---- CHANNEL: a narrow feeder cut carrying river water down to the basins ----
  if (has("channel")){
    const cx=W*0.50;
    pen.paint(()=>{
      g.moveTo(cx-W*0.02, rBot);
      g.lineTo(cx+W*0.02, rBot);
      g.lineTo(cx+W*0.035, pTop);
      g.lineTo(cx-W*0.035, pTop);
      g.closePath();
    }, toneSolid(inkLevel(3)), 3);
    pen.seam(()=>{ g.moveTo(cx-W*0.02,rBot); g.lineTo(cx-W*0.035,pTop); }, 2);
    pen.seam(()=>{ g.moveTo(cx+W*0.02,rBot); g.lineTo(cx+W*0.035,pTop); }, 2);
  }

  // ---- FG POOLS: the shallow stone wash-basins (foreground, contoured) ----
  if (has("pools")){
    // back row basin (further, smaller, centred back), then two side basins
    drawBasin(pen, g, W*0.50, pTop+H*0.055, W*0.24, H*0.11);
    drawBasin(pen, g, W*0.21, H*0.80, W*0.34, H*0.16);
    drawBasin(pen, g, W*0.80, H*0.80, W*0.34, H*0.16);
    // large front-centre basin, closest to camera (drawn last = frontmost)
    drawBasin(pen, g, W*0.50, H*0.885, W*0.42, H*0.185);
  }
}

export const asset = {
  id:"location.river-washing-pools",
  type:"LOCATION",
  name:"River Washing Pools",
  statusWord:"WASH-DAY",
  scene:"OD-B06-S02",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","forest","hollow","river","beach","mule","picnic","court","channel","pools","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "forest:edge":{x:0.50,y:0.18},          // tree line at the top of the meadow
    "hollow:leaf":{x:0.82,y:0.30},           // leaf-covered sleeping nook
    "river:flow":{x:0.50,y:0.355},           // running river the basins draw from
    "beach:clothes-spread":{x:0.28,y:0.47},  // shingle where laundry is spread
    "zone:mule-graze":{x:0.15,y:0.52},       // meadow where the mules crop grass
    "zone:picnic":{x:0.40,y:0.53},           // cleared spot with the food-mat
    "court:ball":{x:0.68,y:0.53},            // flat marked-out play court
    "pool:basin-back":{x:0.50,y:0.66},       // the receding back basin
    "pool:basin-left":{x:0.22,y:0.86},       // left wash-basin
    "pool:basin-right":{x:0.80,y:0.86},      // right wash-basin
    "pool:basin-front":{x:0.50,y:0.93},      // frontmost basin, closest to camera
    "entrance:road":{x:0.04,y:0.55},         // mule-cart arrives on the meadow road
    "exit:river-up":{x:0.96,y:0.355},        // the river running away upstream
    "camera:wide":{x:0.50,y:0.50},
    "camera:pools":{x:0.50,y:0.80},
  },
  // navigable regions (for scene placement / pathing)
  zones:{
    water:{ x0:0.00,y0:0.30,x1:1.00,y1:0.41 },       // the river
    walkable:{ x0:0.03,y0:0.41,x1:0.97,y1:0.98 },     // meadow + beach + pool surrounds
    pools:{ x0:0.04,y0:0.62,x1:0.96,y1:0.98 },        // the stone wash-basins
    graze:{ x0:0.03,y0:0.43,x1:0.32,y1:0.60 },        // mule grazing meadow
    picnic:{ x0:0.32,y0:0.47,x1:0.50,y1:0.60 },       // picnic patch
    court:{ x0:0.50,y0:0.45,x1:0.86,y1:0.62 },        // ball court
    beach:{ x0:0.03,y0:0.41,x1:0.97,y1:0.52 },        // clothes-spreading shingle
    forest:{ x0:0.00,y0:0.05,x1:1.00,y1:0.30 },       // occluding tree line
  },
  states:{
    initial:"set",
    nodes:{
      set:{ preview:{ layers:["sky","forest","hollow","river","beach","mule","picnic","court","channel","pools"] } },
      "wash-day":{ preview:{ layers:["sky","forest","hollow","river","beach","channel","pools"] } }, // work at the basins
      "ball-game":{ preview:{ layers:["sky","forest","river","beach","court","pools"] } },            // play on the court
      empty:{ preview:{ layers:["sky","forest","river","beach","pools"] } },                          // bare terrain
    },
    edges:[["set","wash-day"],["wash-day","ball-game"],["ball-game","set"],["set","empty"]],
  },
  channels:["reveal","camera","water","wind","light"],

  preview:()=>({ layers:["sky","forest","hollow","river","beach","mule","picnic","court","channel","pools"], status:"WASH-DAY", progress:0.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
