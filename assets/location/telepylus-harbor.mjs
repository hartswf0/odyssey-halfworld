/* location.telepylus-harbor — the Laestrygonian trap-harbor at Telepylus.
   LOCATION asset (empty navigable set, no baked characters). Built in SOLID grays
   + hard contour into the offscreen ctx; the engine dotify POST pass supplies the
   halftone. A narrow cliff-RINGED basin: a dark rock frame on all sides encloses
   the still inner water; a single narrow entrance neck opens seaward to an outer
   anchorage; a switchback CITY PATH climbs the cliffs; flat ATTACK LEDGES perch on
   the high rim above. Depth: bg sky/cliff rim -> mid cliff walls + enclosed basin
   with crowded moorings -> fg entrance + outer anchorage. Named zones/anchors.
   Atlas: OD-B10-S02 — narrow cliff-ringed basin, single entrance, inner moorings,
   outer anchorage, city path, high attack ledges. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  rimLevel:0.24,        // cliff-top rim (fraction of H) — attack ledges sit here
  basinTop:0.42,        // inner water surface top
  basinMid:0.60,        // inner water center
  neckLevel:0.79,       // basin narrows to the entrance neck
  outerLevel:0.885,     // outer anchorage waterline (foreground)
  neckHalf:0.065,       // half-width of the single narrow entrance (fraction of W)
  innerShips:8,         // moored ships crowded in the basin
  outerShips:2,         // ships lying off in the outer anchorage
  cityPath:true,        // switchback path up the right cliff
  ledges:true,          // high attack ledges on the rim
};

/* deterministic jitter (no Math.random — stable render) */
const frac = n => n - Math.floor(n);
const jit  = (i,k)=> frac(Math.sin((i+1)*12.9898 + k*78.233)*43758.5453);

/* a small moored galley: crescent hull + mast (harbor furniture, not a figure).
   tone = hull ink level; sail=true adds a furled-sail tick. */
function drawShip(pen, g, cx, cy, w, tone, side=1, sail=false){
  const h = w*0.42;
  pen.paint(()=>{
    g.moveTo(cx-w, cy);
    g.quadraticCurveTo(cx-w*0.2, cy+h, cx+w, cy);         // hull underside
    g.quadraticCurveTo(cx+w*0.55, cy-h*0.5, cx+w*1.18, cy-h*0.9); // upturned prow
    g.quadraticCurveTo(cx+w*0.35, cy-h*0.4, cx-w, cy);    // deck line
    g.closePath();
  }, toneSolid(tone), 3);
  // mast
  pen.ink(()=>{ g.moveTo(cx, cy-h*0.2); g.lineTo(cx, cy-h*2.1); }, 2.4);
  if (sail){ pen.paint(()=>{ g.ellipse(cx, cy-h*1.2, w*0.16, h*0.9, 0,0,7); }, toneSolid(inkLevel(4)), 2); }
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const rimY   = H*params.rimLevel;
  const basTop = H*params.basinTop;
  const basMid = H*params.basinMid;
  const neckY  = H*params.neckLevel;
  const outY   = H*params.outerLevel;
  const nHalf  = W*params.neckHalf;
  const layers = st.layers || ["sky","cliffs","faces","ledges","citypath","basin","moorings","entrance","anchorage","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest tone, above the cliff rim) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);   // paper base for the whole set
    g.fillStyle = inkLevel(2);
    for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(W*(0.18+i*0.22), rimY*(0.42+0.16*(i%2)), W*0.09, H*0.018, 0,0,7); g.fill(); }
  }

  // ---- CLIFF RING (the dark rock frame on all sides) ----
  // one filled rock block from a jagged rim down to the bottom; the basin, the
  // entrance neck and the outer water are carved out of it below so the rock
  // reads as a continuous ring enclosing the harbor.
  if (has("cliffs")){
    pen.paint(()=>{
      g.moveTo(0, H);
      g.lineTo(0, rimY + H*0.02);
      // jagged cliff-top silhouette across the back
      const N=10;
      for(let i=0;i<=N;i++){
        const t=i/N;
        const x=lerp(0,W,t);
        const y=rimY - H*0.055*(0.5+0.5*Math.sin(t*7.0+1.3)) - H*0.02*jit(i,3);
        g.lineTo(x,y);
      }
      g.lineTo(W, rimY + H*0.02);
      g.lineTo(W, H);
      g.closePath();
    }, toneSolid(inkLevel(5)), 5);
    // rock strata — hairline terraces break the mass + give the cliffs texture
    g.save(); g.beginPath();
    g.moveTo(0, rimY+H*0.02);
    for(let i=0;i<=10;i++){ const t=i/10; g.lineTo(lerp(0,W,t), rimY - H*0.055*(0.5+0.5*Math.sin(t*7.0+1.3)) - H*0.02*jit(i,3)); }
    g.lineTo(W, rimY+H*0.02); g.lineTo(W,H); g.lineTo(0,H); g.closePath(); g.clip();
    g.strokeStyle=INK; g.globalAlpha=0.30; g.lineWidth=2;
    for(let j=0;j<7;j++){ const y=rimY+H*0.03 + j*H*0.075; g.beginPath();
      for(let x=0;x<=W;x+=W*0.04){ const yy=y+Math.sin(x*0.02+j*0.8)*H*0.006; x===0?g.moveTo(x,yy):g.lineTo(x,yy); } g.stroke(); }
    // darker crevices low in the rock (near the waterline flanks)
    g.globalAlpha=1; g.strokeStyle=inkLevel(7); g.lineWidth=3;
    for(let i=0;i<5;i++){ const x=lerp(W*0.04,W*0.96,i/4); g.beginPath();
      g.moveTo(x, basTop+H*0.02); g.lineTo(x+(jit(i,2)-0.5)*W*0.03, neckY); g.stroke(); }
    g.restore();
  }

  // ---- CARVE the enclosed BASIN water (mid tone) ----
  if (has("basin")){
    // rounded basin body
    pen.paint(()=>{
      g.moveTo(W*0.20, basTop+H*0.02);
      g.quadraticCurveTo(W*0.5, basTop-H*0.03, W*0.80, basTop+H*0.02); // top shore (under back cliff)
      g.quadraticCurveTo(W*0.90, basMid, W*0.62, neckY);               // right shore in to the neck
      g.lineTo(W*0.5+nHalf, neckY);
      g.lineTo(W*0.5-nHalf, neckY);
      g.quadraticCurveTo(W*0.10, basMid, W*0.20, basTop+H*0.02);       // left shore
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // ripple rules on the still basin
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
    for(let j=1;j<=4;j++){ const y=basTop+ (neckY-basTop)*(j/6); g.beginPath();
      for(let x=W*0.16;x<=W*0.84;x+=W*0.05){ const yy=y+Math.sin(x*0.03+j)*1.8; x<=W*0.16?g.moveTo(x,yy):g.lineTo(x,yy); } g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- inner cliff FACES (a lighter band down the inner walls for depth) ----
  if (has("faces")){
    const face = toneSolid(inkLevel(4));
    // left inner face
    pen.paint(()=>{
      g.moveTo(0, rimY+H*0.02); g.lineTo(W*0.20, basTop+H*0.02);
      g.quadraticCurveTo(W*0.10, basMid, W*0.5-nHalf, neckY);
      g.lineTo(0, neckY);
      g.closePath();
    }, face, 4);
    // right inner face
    pen.paint(()=>{
      g.moveTo(W, rimY+H*0.02); g.lineTo(W*0.80, basTop+H*0.02);
      g.quadraticCurveTo(W*0.90, basMid, W*0.5+nHalf, neckY);
      g.lineTo(W, neckY);
      g.closePath();
    }, face, 4);
    // re-lay the basin water edge so faces don't cover it
    pen.paint(()=>{
      g.moveTo(W*0.20, basTop+H*0.02);
      g.quadraticCurveTo(W*0.5, basTop-H*0.03, W*0.80, basTop+H*0.02);
      g.quadraticCurveTo(W*0.90, basMid, W*0.62, neckY);
      g.lineTo(W*0.5+nHalf, neckY);
      g.lineTo(W*0.5-nHalf, neckY);
      g.quadraticCurveTo(W*0.10, basMid, W*0.20, basTop+H*0.02);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // dark shadow rim where the cliff faces plunge into the still water (depth)
    g.strokeStyle=inkLevel(7); g.lineWidth=5; g.lineCap="round"; g.globalAlpha=0.5;
    g.beginPath();
    g.moveTo(W*0.5-nHalf, neckY);
    g.quadraticCurveTo(W*0.10, basMid, W*0.20, basTop+H*0.02);
    g.moveTo(W*0.5+nHalf, neckY);
    g.quadraticCurveTo(W*0.90, basMid, W*0.80, basTop+H*0.02);
    g.stroke(); g.globalAlpha=1;
  }

  // ---- HIGH ATTACK LEDGES on the cliff rim (flat shelves above the basin) ----
  if (has("ledges") && params.ledges){
    const ledge = toneSolid(inkLevel(4));
    const shelf = (cx, cy, w, hgt)=>{
      pen.paint(()=>{ g.rect(cx-w/2, cy-hgt, w, hgt); }, ledge, 4);      // flat platform
      pen.ink(()=>{ g.moveTo(cx-w/2, cy-hgt); g.lineTo(cx+w/2, cy-hgt); }, 3); // lip highlight
      // a boulder poised on the ledge (the Laestrygonian missiles)
      pen.paint(()=>{ g.ellipse(cx+w*0.22, cy-hgt-H*0.012, W*0.017, H*0.013, 0,0,7); }, toneSolid(inkLevel(7)), 3);
    };
    shelf(W*0.135, rimY-H*0.005, W*0.15, H*0.028);   // left ledge
    shelf(W*0.500, rimY-H*0.045, W*0.17, H*0.028);   // back-center ledge (highest)
    shelf(W*0.865, rimY-H*0.005, W*0.15, H*0.028);   // right ledge
  }

  // ---- CITY PATH: switchback ramp climbing the right cliff to the town ----
  if (has("citypath") && params.cityPath){
    const pts=[
      {x:W*0.66, y:neckY-H*0.01},
      {x:W*0.88, y:basMid+H*0.02},
      {x:W*0.70, y:basTop+H*0.05},
      {x:W*0.90, y:rimY+H*0.03},
    ];
    // pale ramp band
    pen.ink(()=>{ g.moveTo(pts[0].x,pts[0].y); for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x,pts[i].y); }, 9);
    g.strokeStyle=inkLevel(2); g.lineWidth=6; g.lineCap="round";
    g.beginPath(); g.moveTo(pts[0].x,pts[0].y); for(let i=1;i<pts.length;i++) g.lineTo(pts[i].x,pts[i].y); g.stroke();
    // step rungs
    for(let i=0;i<pts.length-1;i++){
      const a=pts[i], b=pts[i+1];
      for(let s=1;s<=4;s++){ const t=s/5; const x=lerp(a.x,b.x,t), y=lerp(a.y,b.y,t);
        pen.ink(()=>{ g.moveTo(x-W*0.012,y); g.lineTo(x+W*0.012,y); }, 2); }
    }
    // a couple of town blocks at the top of the path
    pen.paint(()=>{ g.rect(W*0.85, rimY-H*0.02, W*0.05, H*0.03); }, toneSolid(inkLevel(5)), 3);
    pen.paint(()=>{ g.rect(W*0.91, rimY-H*0.03, W*0.04, H*0.04); }, toneSolid(inkLevel(6)), 3);
  }

  // ---- MOORINGS: ships crowded in the enclosed basin ----
  if (has("moorings")){
    const n=params.innerShips;
    for(let i=0;i<n;i++){
      const row = i<Math.ceil(n/2) ? 0 : 1;
      const k   = i<Math.ceil(n/2) ? i : i-Math.ceil(n/2);
      const cols= row===0 ? Math.ceil(n/2) : Math.floor(n/2);
      const u   = cols>1 ? k/(cols-1) : 0.5;
      const cx  = lerp(W*0.30, W*0.70, u) + (jit(i,7)-0.5)*W*0.02;
      const cy  = (row===0 ? basTop+H*0.05 : basMid-H*0.005) + (jit(i,9)-0.5)*H*0.01;
      drawShip(pen, g, cx, cy, W*0.052, inkLevel(7), 1, i%3===0);
    }
    // mooring posts along the shore
    g.fillStyle=inkLevel(7);
    for(let i=0;i<6;i++){ const x=lerp(W*0.24,W*0.76,i/5); g.beginPath();
      g.rect(x, neckY-H*0.028, W*0.006, H*0.028); g.fill(); }
  }

  // ---- ENTRANCE: the single narrow neck of water through the cliffs ----
  if (has("entrance")){
    pen.paint(()=>{
      g.moveTo(W*0.5-nHalf, neckY);
      g.lineTo(W*0.5+nHalf, neckY);
      g.lineTo(W*0.5+nHalf*1.15, outY);
      g.lineTo(W*0.5-nHalf*1.15, outY);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // the two flanking headland points that pinch the entrance
    pen.ink(()=>{ g.moveTo(W*0.5-nHalf, neckY); g.lineTo(W*0.36, outY); }, 4);
    pen.ink(()=>{ g.moveTo(W*0.5+nHalf, neckY); g.lineTo(W*0.64, outY); }, 4);
  }

  // ---- OUTER ANCHORAGE (foreground open water, lighter, below the entrance) ----
  if (has("anchorage")){
    pen.paint(()=>{
      g.moveTo(0, outY+H*0.01);
      g.quadraticCurveTo(W*0.5, outY-H*0.02, W, outY+H*0.01);
      g.lineTo(W, H); g.lineTo(0, H); g.closePath();
    }, toneSolid(inkLevel(2)), 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.20;
    for(let j=1;j<=3;j++){ const y=outY+(H-outY)*(j/4); g.beginPath();
      for(let x=0;x<=W;x+=W*0.06){ const yy=y+Math.sin(x*0.02+j*1.6)*1.6; x===0?g.moveTo(x,yy):g.lineTo(x,yy); } g.stroke(); }
    g.globalAlpha=1;
    // ships lying off in the outer anchorage (Odysseus' own ship kept outside)
    for(let i=0;i<params.outerShips;i++){
      const cx = i===0 ? W*0.20 : W*0.80;
      drawShip(pen, g, cx, H*0.955, W*0.062, inkLevel(6), i===0?1:-1, true);
    }
  }
}

export const asset = {
  id:"location.telepylus-harbor",
  type:"LOCATION",
  name:"Telepylus Harbor",
  statusWord:"HEMMED-IN",
  scene:"OD-B10-S02",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","cliffs","basin","faces","ledges","citypath","moorings","entrance","anchorage","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "entrance:narrow":{x:.50,y:.83},     // the single narrow entrance neck
    "basin:center":{x:.50,y:.60},        // enclosed inner basin
    "mooring:front":{x:.40,y:.55},       // crowded inner mooring row
    "mooring:back":{x:.60,y:.47},
    "anchorage:outer":{x:.50,y:.95},     // outer anchorage (ship kept off)
    "path:base":{x:.66,y:.78},           // foot of the city path
    "path:town":{x:.90,y:.24},           // town at the top of the path
    "ledge:left":{x:.135,y:.22},         // high attack ledges on the rim
    "ledge:back":{x:.50,y:.17},
    "ledge:right":{x:.865,y:.22},
    "camera:wide":{x:.50,y:.50},
    "camera:entrance":{x:.50,y:.82},
  },
  // zones for scene placement / pathing
  zones:{
    basin:{ x0:.16,y0:.40,x1:.84,y1:.79 },      // enclosed navigable water
    entrance:{ x0:.42,y0:.79,x1:.58,y1:.89 },   // the narrow channel
    anchorage:{ x0:.00,y0:.88,x1:1.00,y1:1.00 },// outer open water
    rim:{ x0:.04,y0:.14,x1:.96,y1:.28 },        // cliff-top ledges (attack line)
    path:{ x0:.62,y0:.24,x1:.94,y1:.80 },       // walkable city path
  },
  states:{
    initial:"trap-set",
    nodes:{
      "trap-set":{ preview:{ layers:["sky","cliffs","basin","faces","ledges","citypath","moorings","entrance","anchorage"] } },
      "fleet-moored":{ preview:{ layers:["sky","cliffs","basin","faces","ledges","citypath","moorings","entrance","anchorage"] } },
      "ambush":{ preview:{ layers:["sky","cliffs","basin","faces","ledges","citypath","moorings","entrance","anchorage"] } },
      "empty-basin":{ preview:{ layers:["sky","cliffs","basin","faces","ledges","citypath","entrance","anchorage"] } },
    },
    edges:[["trap-set","fleet-moored"],["fleet-moored","ambush"],["ambush","empty-basin"],["trap-set","empty-basin"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({ layers:["sky","cliffs","basin","faces","ledges","citypath","moorings","entrance","anchorage"], status:"HEMMED-IN", progress:.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
