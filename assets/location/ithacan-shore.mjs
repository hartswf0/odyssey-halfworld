/* location.ithacan-shore — the Ithacan waterline where the wanderer lands and prays.
   LOCATION asset (OD-B02-S05). An EMPTY navigable set: sky over a distant harbor,
   an open sea, a foaming scalloped waterline, wet then dry beach, a low dune with a
   town path winding up and off, and a keel-groove launch route running down into the
   surf. A marked prayer position (a low altar stone) sits on the wet sand. Drawn in
   SOLID grays + hard contour into the offscreen ctx — the engine dotify pass supplies
   the halftone. No characters are baked in; only placement / camera anchors.
   Atlas: OD-B02-S05 — foaming waterline, prayer position, harbor view, town path, launch route. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  horizon:0.24,       // sea/sky meeting line as fraction of H
  foamLevel:0.46,     // centre of the foaming waterline band
  duneSide:-1,        // dunes + town path on the left
  harborSide:1,       // harbor view on the right of the horizon
  scallops:9,         // foam-edge lobes
  launch:true,        // keel-groove launch route + beached hull
  prayer:true,        // marked prayer position (altar stone) on the wet sand
};

/* deterministic scalloped waterline y at fractional x (0..1) for a given band centre */
function foamY(x, H, centre, amp){
  return H*centre + Math.sin(x*Math.PI*params.scallops)*amp + Math.sin(x*Math.PI*2.3)*amp*0.6;
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.horizon;
  const layers = st.layers || ["sky","sea","harbor","surf","beach","dune","path","launch","prayer","anchors"];
  const has = l => layers.includes(l);
  const foamAmp = H*0.018;

  // ---- SKY (lightest tone -> sparse dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    // a few low cloud banks
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.22+i*0.30), horizon*(0.42+0.12*(i%2)), W*0.13, H*0.022, 0,0,7); g.fill(); }
  }

  // ---- SEA (mid tone) from horizon down to the surf band ----
  if (has("sea")){
    const seaBot = H*params.foamLevel + foamAmp*2;
    pen.paint(()=>{ g.rect(0,horizon,W,seaBot-horizon); }, toneSolid(inkLevel(3)), 0);
    // a darker near band just above the surf gives the sea depth without a flat blob
    g.fillStyle=inkLevel(4); g.fillRect(0, seaBot-H*0.06, W, H*0.06);
    // horizon contour
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 4);
    // a few swell lines (darker), receding toward the horizon
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let j=1;j<=4;j++){
      const y = lerp(horizon+H*0.03, seaBot-H*0.02, j/5);
      g.beginPath();
      for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.9+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- HARBOR view on the far horizon (distant mole + moored hulls) ----
  if (has("harbor")){
    const hx = W*(0.5 + params.harborSide*0.30);
    const hy = horizon;
    // breakwater mole running off toward the headland
    pen.paint(()=>{ g.rect(hx-W*0.14, hy-H*0.012, W*0.30, H*0.016); }, toneSolid(inkLevel(6)), 3);
    // headland behind
    pen.paint(()=>{ g.moveTo(hx-W*0.02,hy-H*0.012); g.quadraticCurveTo(hx+W*0.14,hy-H*0.06,hx+W*0.20,hy-H*0.010); g.lineTo(hx+W*0.20,hy); g.closePath(); }, toneSolid(inkLevel(5)), 3);
    // three moored hulls with masts
    g.fillStyle=inkLevel(7); g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<3;i++){
      const bx = hx-W*0.09+i*W*0.075, by = hy-H*0.006;
      g.beginPath(); g.moveTo(bx-W*0.022,by); g.lineTo(bx+W*0.022,by); g.lineTo(bx+W*0.012,by+H*0.014); g.lineTo(bx-W*0.012,by+H*0.014); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(bx,by); g.lineTo(bx,by-H*0.03); g.stroke();
    }
  }

  // ---- FOAMING WATERLINE (the surf): scalloped light band with foam lobes ----
  if (has("surf")){
    // wet-sand band under the foam (a touch darker than dry beach)
    const topY = x=>foamY(x,H,params.foamLevel,foamAmp);
    g.beginPath();
    g.moveTo(0,H); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } g.lineTo(W,H); g.closePath();
    g.fillStyle=inkLevel(3); g.fill();
    // the foam itself: lightest tone, scalloped upper edge, with rounded lobes
    g.beginPath();
    g.moveTo(0, topY(0)+H*0.035);
    for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); }
    g.lineTo(W, topY(1)+H*0.035); g.closePath();
    g.fillStyle=inkLevel(1); g.fill();
    // hard contour of the seaward foam edge
    pen.ink(()=>{ g.moveTo(0,topY(0)); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } }, 4);
    // scattered foam bubbles (near-paper dots kept as tiny filled lobes, drawn as flat light)
    g.fillStyle=inkLevel(1); g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<params.scallops;i++){
      const x=(i+0.5)/params.scallops; const y=topY(x)+H*0.012;
      g.beginPath(); g.arc(x*W, y, W*0.018, 0, 7); g.fill(); g.stroke();
    }
  }

  // ---- BEACH (dry sand, foreground, light so it reads as ground) ----
  if (has("beach")){
    const topY = x=>foamY(x,H,params.foamLevel,foamAmp)+H*0.04;
    g.beginPath();
    g.moveTo(0,H); for(let s=0;s<=60;s++){ const x=s/60; g.lineTo(x*W, topY(x)); } g.lineTo(W,H); g.closePath();
    g.fillStyle=inkLevel(2); g.fill();
    // faint drift/ripple lines in the sand
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28;
    for(let j=1;j<=3;j++){ const y=lerp(H*(params.foamLevel+0.11), H*0.96, j/3);
      g.beginPath(); for(let s=0;s<=20;s++){ const x=W*s/20; const yy=y+Math.sin(s*0.7+j)*H*0.006; s?g.lineTo(x,yy):g.moveTo(x,yy);} g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- DUNE (a low sand mound on the town side, mid tone) ----
  if (has("dune")){
    const s = params.duneSide;
    const bx = s<0 ? 0 : W;
    pen.paint(()=>{
      g.moveTo(bx, H*(params.foamLevel+0.02));
      g.quadraticCurveTo(bx - s*W*0.16, H*(params.foamLevel-0.06), bx - s*W*0.34, H*0.62);
      g.quadraticCurveTo(bx - s*W*0.20, H*0.74, bx, H*0.78);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // a tuft of dune grass along the crest
    g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<7;i++){
      const t=i/6; const gx = lerp(bx, bx - s*W*0.32, t)+ s*W*0.01;
      const gy = lerp(H*(params.foamLevel-0.02), H*0.60, t);
      g.beginPath(); g.moveTo(gx,gy); g.quadraticCurveTo(gx+ s*W*0.012, gy-H*0.03, gx+ s*W*0.028, gy-H*0.05); g.stroke();
      g.beginPath(); g.moveTo(gx,gy); g.quadraticCurveTo(gx- s*W*0.008, gy-H*0.028, gx- s*W*0.014, gy-H*0.052); g.stroke();
    }
  }

  // ---- TOWN PATH winding up the dune and off the top edge (exit to Ithaca town) ----
  if (has("path")){
    const s = params.duneSide;
    const x0 = W*(0.5 + s*0.16), y0 = H*0.86;               // path mouth on the beach
    const x1 = W*(0.5 + s*0.30), y1 = H*0.66;
    const x2 = (s<0?0:W) - s*W*0.10, y2 = H*(params.foamLevel+0.03);
    // path is a light ribbon between two ink edges
    const edge = (off)=>{ g.beginPath(); g.moveTo(x0+off,y0); g.quadraticCurveTo(x1+off,y1,x2+off,y2); };
    g.strokeStyle=INK; g.lineWidth=3;
    edge(-W*0.05); g.stroke(); edge(W*0.05); g.stroke();
    // light fill down the middle (kept narrow so the path reads as a track, not a wedge)
    g.strokeStyle=inkLevel(1); g.lineWidth=W*0.06; g.lineCap="round";
    edge(0); g.stroke(); g.lineCap="butt";
  }

  // ---- LAUNCH ROUTE: keel-groove down to the surf + a beached hull ready to run out ----
  if (has("launch") && params.launch){
    const cx = W*0.60;
    // twin keel grooves scored into the sand, from mid-beach into the foam
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=0.6;
    for(const off of [-W*0.03, W*0.03]){
      g.beginPath();
      g.moveTo(cx+off, H*0.92);
      g.quadraticCurveTo(cx+off*1.4, H*0.72, cx+off*1.1, H*(params.foamLevel+0.06));
      g.stroke();
    }
    g.globalAlpha=1;
    // a beached hull sitting in the groove
    const bx=cx, by=H*0.80, bw=W*0.15, bh=H*0.05;
    pen.paint(()=>{
      g.moveTo(bx-bw, by);
      g.quadraticCurveTo(bx-bw*0.4, by+bh, bx+bw, by);       // hull underside
      g.quadraticCurveTo(bx+bw*0.5, by-bh*0.5, bx-bw, by);   // gunwale
      g.closePath();
    }, toneSolid(inkLevel(6)), 5);
    // mast + a furled sail block
    pen.ink(()=>{ g.moveTo(bx, by-bh*0.3); g.lineTo(bx, by-H*0.10); }, 4);
    pen.paint(()=>{ g.rect(bx-W*0.008, by-H*0.10, W*0.016, H*0.05); }, toneSolid(inkLevel(4)), 3);
  }

  // ---- PRAYER POSITION: a low altar stone marked on the wet sand near the foam ----
  if (has("prayer") && params.prayer){
    const px = W*0.30, py = H*(params.foamLevel+0.14);
    // a scuffed kneeling ring in the sand
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    g.beginPath(); g.ellipse(px, py+H*0.02, W*0.08, H*0.028, 0, 0, 7); g.stroke();
    g.globalAlpha=1;
    // the altar stone / offering slab
    pen.paint(()=>{ g.rect(px-W*0.045, py-H*0.02, W*0.09, H*0.030); }, toneSolid(inkLevel(5)), 5);   // base slab
    pen.paint(()=>{ g.rect(px-W*0.055, py-H*0.028, W*0.11, H*0.010); }, toneSolid(inkLevel(6)), 4);   // capstone
    // a thin votive plume rising off the stone
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.6;
    g.beginPath(); g.moveTo(px, py-H*0.028);
    g.quadraticCurveTo(px+W*0.02, py-H*0.07, px-W*0.01, py-H*0.11);
    g.quadraticCurveTo(px-W*0.03, py-H*0.15, px+W*0.005, py-H*0.19);
    g.stroke(); g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.ithacan-shore",
  type:"LOCATION",
  name:"Ithacan Shore",
  statusWord:"LANDFALL",
  scene:"OD-B02-S05",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","sea","harbor","surf","beach","dune","path","launch","prayer","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "prayer:shore":{x:.30,y:.60},        // marked prayer / kneeling position on the wet sand
    "view:harbor":{x:.80,y:.24},         // sightline to the moored harbor on the horizon
    "path:town":{x:.34,y:.86},           // mouth of the town path on the beach
    "exit:town":{x:.06,y:.28},           // where the path leaves the top edge toward town
    "route:launch":{x:.60,y:.86},        // foot of the keel-groove launch route
    "route:surf":{x:.62,y:.52},          // where the launch route meets the waterline
    "hull:beached":{x:.60,y:.80},        // the beached boat ready to run out
    "entrance:beach":{x:.94,y:.92},      // walk-on from the far end of the strand
    "camera:wide":{x:.50,y:.50}, "camera:prayer":{x:.34,y:.58}, "camera:surf":{x:.50,y:.46},
  },
  // walkable / interaction regions for scene placement + pathing
  zones:{
    dryBeach:{ x0:.04,y0:.58,x1:.96,y1:.98 },
    wetSand:{ x0:.04,y0:.50,x1:.96,y1:.60 },
    surf:{ x0:.00,y0:.42,x1:1.0,y1:.52 },
    sea:{ x0:.00,y0:.24,x1:1.0,y1:.44 },
  },
  states:{
    initial:"calm",
    nodes:{
      calm:{ preview:{ layers:["sky","sea","harbor","surf","beach","dune","path","launch","prayer"] } },
      "prayer-set":{ preview:{ layers:["sky","sea","harbor","surf","beach","dune","path","prayer"] } },
      "launch-ready":{ preview:{ layers:["sky","sea","harbor","surf","beach","dune","path","launch"] } },
      bare:{ preview:{ layers:["sky","sea","harbor","surf","beach","dune","path"] } },
    },
    edges:[["calm","prayer-set"],["calm","launch-ready"],["calm","bare"],["prayer-set","launch-ready"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({ layers:["sky","sea","harbor","surf","beach","dune","path","launch","prayer"], status:"LANDFALL", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
