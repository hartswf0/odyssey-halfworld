/* location.thrinacia — the bright sunlit island of Helios' cattle.
   LOCATION asset (empty navigable set, no baked characters/animals). Built in
   SOLID grays + hard contour into the offscreen ctx; the engine dotify POST pass
   supplies the halftone. Depth: bg storm-blocked sea + brooding cloud band -> mid
   sacred pastures split into separate cattle & sheep grazing zones, a prayer
   place -> fg landing cove + beach camp. Named zones/anchors for scene placement.
   Atlas: OD-B12-S05 — sunlit island, landing cove, sacred pastures, separate
   cattle and sheep herds, prayer place, camp, storm-blocked sea beyond. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  seaLevel:0.27,       // far storm-sea horizon (fraction of H)
  ridgeLevel:0.42,     // rolling island ridge crest (sea shows as a strip above it)
  coveLevel:0.71,      // where the sunlit pasture meets the cove sand
  waterLevel:0.83,     // inner cove waterline in the foreground
  storm:0.40,          // 0 calm .. 1 raging sea beyond (state can override)
  cattleZone:true,     // sacred cattle grazing enclosure (left)
  sheepZone:true,      // sacred sheep grazing enclosure (right)
  prayer:true,         // stone prayer altar on the central rise
  camp:true,           // beach camp above the cove
};

/* deterministic jitter (no Math.random — stable render) */
const frac = n => n - Math.floor(n);
const jitter = (i,k)=> frac(Math.sin((i+1)*12.9898 + k*78.233)*43758.5453);

/* the rolling island ridge height at horizontal fraction u (0..1) */
function ridgeY(H, u){
  const base = H*params.ridgeLevel;
  return base - H*0.055*(0.5+0.5*Math.sin(u*7.4+0.8)) - H*0.028*Math.sin(u*3.1+2.0);
}

/* a low grazing enclosure: dry-stone wall rectangle in the pasture band.
   side=-1 cattle (left, coarser/darker turf), side=+1 sheep (right, lighter). */
function grazeEnclosure(pen, g, W, H, side, tone){
  const x0 = side<0 ? W*0.10 : W*0.545;
  const x1 = side<0 ? W*0.455 : W*0.90;
  const yTop = H*0.475, yBot = H*params.coveLevel - H*0.03;
  // turf panel
  pen.paint(()=>{ g.rect(x0, yTop, x1-x0, yBot-yTop); }, toneSolid(tone), 4);
  // dry-stone wall — short vertical ticks along the perimeter posts
  const postTone = toneSolid(inkLevel(6));
  const nx = 5;
  for(let i=0;i<=nx;i++){
    const x = lerp(x0, x1, i/nx);
    pen.paint(()=>{ g.rect(x-W*0.006, yTop-H*0.012, W*0.012, H*0.020); }, postTone, 3); // top wall posts
    pen.paint(()=>{ g.rect(x-W*0.006, yBot-H*0.008, W*0.012, H*0.020); }, postTone, 3); // bottom wall posts
  }
  // grazing tussocks (turf marks, NOT animals) scattered deterministically
  g.fillStyle = inkLevel(side<0?5:4);
  for(let t=0;t<9;t++){
    const jx = jitter(t, side<0?2:12), jy = jitter(t, side<0?7:17);
    const tx = lerp(x0+W*0.03, x1-W*0.03, jx);
    const ty = lerp(yTop+H*0.03, yBot-H*0.03, jy);
    g.beginPath(); g.ellipse(tx, ty, W*0.010, H*0.006, 0,0,7); g.fill();
  }
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const seaY   = H*params.seaLevel;
  const coveY  = H*params.coveLevel;
  const waterY = H*params.waterLevel;
  const storm  = clamp(st.storm ?? params.storm, 0, 1);
  const layers = st.layers || ["sky","sun","storm-sea","island","pastures","cattle-zone","sheep-zone","prayer","cove","camp","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest tone — bright sunlit day above the far sea) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,seaY+H*0.02);
  }

  // ---- SUN (bright disk high over the island; near-paper so it reads as light) ----
  if (has("sun")){
    const sx=W*0.74, sy=H*0.15, sr=W*0.058;
    // rays
    pen.ctx.save();
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2;
      pen.ink(()=>{ g.moveTo(sx+Math.cos(a)*sr*1.25, sy+Math.sin(a)*sr*1.25);
                    g.lineTo(sx+Math.cos(a)*sr*1.7,  sy+Math.sin(a)*sr*1.7); }, 3);
    }
    pen.ctx.restore();
    pen.paint(()=>{ g.arc(sx,sy,sr,0,7); }, toneSolid(inkLevel(0)), 5);
  }

  // ---- STORM-BLOCKED SEA BEYOND (brooding clouds + choppy water strip) ----
  if (has("storm-sea")){
    // scalloped cloud band brooding high over the sea, clear of the horizon
    const cloudTone = inkLevel(clamp(Math.round(2 + storm*3),2,6));
    for(let i=0;i<7;i++){
      const cx=W*(0.03+i*0.15), cy=seaY-H*0.085 - (i%2)*H*0.018;
      pen.paint(()=>{ g.ellipse(cx, cy, W*0.085, H*0.022, 0,0,7); }, toneSolid(cloudTone), 3);
    }
    // the sea itself: a choppy strip at the horizon (island overlaps its lower edge)
    const seaTone = inkLevel(clamp(Math.round(2 + storm*2),2,5));
    g.fillStyle=seaTone; g.fillRect(0, seaY, W, H*(params.ridgeLevel-0.03) - seaY);
    // wave chevrons — steeper/denser as the storm rises
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.28+storm*0.22;
    const rows = 3 + Math.round(storm*2);
    for(let j=0;j<rows;j++){
      const y = seaY + H*0.014 + j*H*0.018;
      g.beginPath();
      for(let x=0;x<=W;x+=W*0.045){
        const yy = y - Math.abs(((x/W*11+j)%2)-1)*H*(0.009+storm*0.009);
        x===0?g.moveTo(x,yy):g.lineTo(x,yy);
      }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- ISLAND LANDMASS (bright sunlit grass; rolling ridge, fills mid+fg) ----
  if (has("island")){
    pen.paint(()=>{
      g.moveTo(0, ridgeY(H,0));
      const N=22;
      for(let i=1;i<=N;i++){ const u=i/N; g.lineTo(W*u, ridgeY(H,u)); }
      g.lineTo(W, coveY+H*0.10);
      g.lineTo(0, coveY+H*0.10);
      g.closePath();
    }, toneSolid(inkLevel(2)), 5);
    // headland point reaching toward the sea (right)
    pen.paint(()=>{
      g.moveTo(W*0.80, ridgeY(H,0.80));
      g.lineTo(W*1.02, ridgeY(H,0.98)-H*0.02);
      g.lineTo(W*1.02, coveY);
      g.lineTo(W*0.80, coveY);
      g.closePath();
    }, toneSolid(inkLevel(3)), 5);
  }

  // ---- SACRED PASTURES (terraced contour lines across the island turf) ----
  if (has("pastures")){
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.40;
    for(let j=1;j<=4;j++){
      const y = lerp(H*params.ridgeLevel+H*0.02, coveY-H*0.02, j/5);
      g.beginPath();
      for(let x=0;x<=W;x+=W*0.05){ const yy=y+Math.sin(x*0.02+j)*3; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
    // central dividing hedge/wall separating the two herds' grazing zones
    pen.paint(()=>{ g.rect(W*0.492, H*0.455, W*0.016, H*(params.coveLevel-0.455)); }, toneSolid(inkLevel(5)), 4);
  }

  // ---- SEPARATE GRAZING ZONES (empty enclosures — NO animals baked in) ----
  if (has("cattle-zone") && params.cattleZone) grazeEnclosure(pen, g, W, H, -1, inkLevel(3)); // cattle: coarser darker turf
  if (has("sheep-zone")  && params.sheepZone)  grazeEnclosure(pen, g, W, H,  1, inkLevel(2)); // sheep: lighter turf

  // ---- PRAYER PLACE (dry-stone altar / cairn on the central rise, with smoke) ----
  if (has("prayer") && params.prayer){
    const ax=W*0.50, ay=H*0.545;
    // stacked altar stones on the central rise between the herds
    pen.paint(()=>{ g.rect(ax-W*0.028, ay, W*0.056, H*0.036); }, toneSolid(inkLevel(5)), 4);   // base
    pen.paint(()=>{ g.rect(ax-W*0.020, ay-H*0.022, W*0.040, H*0.024); }, toneSolid(inkLevel(6)), 4); // mid
    pen.paint(()=>{ g.rect(ax-W*0.012, ay-H*0.038, W*0.024, H*0.018); }, toneSolid(inkLevel(7)), 3); // crown
    // curl of offering smoke rising from the altar
    pen.ink(()=>{
      g.moveTo(ax, ay-H*0.038);
      g.quadraticCurveTo(ax-W*0.028, ay-H*0.075, ax+W*0.008, ay-H*0.105);
      g.quadraticCurveTo(ax+W*0.040, ay-H*0.135, ax+W*0.004, ay-H*0.165);
    }, 3);
  }

  // ---- FG LANDING COVE (pale sand crescent + calm inner water; contrast to the sea) ----
  if (has("cove")){
    // sand strand (lightest so it reads as beach)
    pen.paint(()=>{
      g.moveTo(0, coveY-H*0.01);
      g.quadraticCurveTo(W*0.5, coveY-H*0.05, W*1.0, coveY-H*0.01);
      g.lineTo(W*1.0, waterY);
      g.quadraticCurveTo(W*0.5, waterY-H*0.06, 0, waterY);
      g.closePath();
    }, toneSolid(inkLevel(1)), 4);
    // calm inner cove water (mid tone, gentle ripples — sheltered from the storm)
    g.fillStyle=inkLevel(3); g.fillRect(0, waterY-H*0.005, W, H-(waterY-H*0.005));
    pen.paint(()=>{
      g.moveTo(0, waterY);
      g.quadraticCurveTo(W*0.5, waterY-H*0.055, W*1.0, waterY);
      g.lineTo(W,waterY); g.lineTo(0,waterY); g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
    for(let j=1;j<=3;j++){ const y=waterY+(H-waterY)*(j/4); g.beginPath();
      for(let x=0;x<=W;x+=W*0.06){ const yy=y+Math.sin(x*0.02+j*1.6)*1.6; x===0?g.moveTo(x,yy):g.lineTo(x,yy); } g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- BEACH CAMP above the cove (lean-to shelters + fire ring; empty set) ----
  if (has("camp") && params.camp){
    const cx=W*0.30, cy=coveY+H*0.020;
    // lean-to shelter
    pen.paint(()=>{ g.moveTo(cx-W*0.072, cy); g.lineTo(cx-W*0.024, cy-H*0.070); g.lineTo(cx+W*0.022, cy); g.closePath(); }, toneSolid(inkLevel(5)), 4);
    pen.ink(()=>{ g.moveTo(cx-W*0.024, cy-H*0.070); g.lineTo(cx-W*0.024, cy); }, 2);
    // second smaller shelter
    pen.paint(()=>{ g.moveTo(cx+W*0.030, cy-H*0.006); g.lineTo(cx+W*0.060, cy-H*0.052); g.lineTo(cx+W*0.092, cy-H*0.006); g.closePath(); }, toneSolid(inkLevel(4)), 4);
    // fire ring
    const fx=cx-W*0.010, fy=cy+H*0.030;
    pen.paint(()=>{ g.ellipse(fx, fy, W*0.030, H*0.012, 0,0,7); }, toneSolid(inkLevel(3)), 3);
    g.fillStyle=inkLevel(7); g.beginPath(); g.ellipse(fx, fy, W*0.013, H*0.006, 0,0,7); g.fill();
  }
}

export const asset = {
  id:"location.thrinacia",
  type:"LOCATION",
  name:"Thrinacia",
  statusWord:"SUNLIT",
  scene:"OD-B12-S05",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","sun","storm-sea","island","pastures","cattle-zone","sheep-zone","prayer","cove","camp","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters/animals)
  anchors:{
    "cove:landing":{x:.50,y:.80},        // where the ship beaches in the cove
    "camp:beach":{x:.30,y:.74},          // beach camp above the strand
    "prayer:altar":{x:.55,y:.50},        // stone prayer place on the central rise
    "graze:cattle":{x:.27,y:.56},        // sacred cattle grazing zone (left)
    "graze:sheep":{x:.74,y:.56},         // sacred sheep grazing zone (right)
    "pasture:sacred":{x:.50,y:.52},      // the sacred pasture band (mid)
    "headland:point":{x:.90,y:.46},      // rocky point reaching toward the sea
    "sea:storm":{x:.50,y:.34},           // the storm-blocked sea beyond
    "sun:helios":{x:.74,y:.15},          // the sun overhead (Helios watches)
    "entrance:cove":{x:.50,y:.98},       // seaward entrance / beaching approach
    "exit:pasture":{x:.06,y:.55},        // inland path up into the pastures
    "camera:wide":{x:.50,y:.50},
    "camera:cove":{x:.50,y:.78},
    "camera:pasture":{x:.50,y:.54},
  },
  // walkable ground regions (for scene placement / pathing)
  zones:{
    beach:{ x0:.06,y0:.70,x1:.94,y1:.86 },        // strand around the cove
    pasture:{ x0:.04,y0:.44,x1:.96,y1:.70 },       // sacred pasture band
    grazeCattle:{ x0:.10,y0:.475,x1:.455,y1:.69 }, // cattle enclosure
    grazeSheep:{ x0:.545,y0:.475,x1:.90,y1:.69 },  // sheep enclosure
    cove:{ x0:.00,y0:.83,x1:1.00,y1:1.00 },        // calm inner water
    stormSea:{ x0:.00,y0:.30,x1:1.00,y1:.46 },     // impassable sea beyond
  },
  states:{
    initial:"sunlit-landing",
    nodes:{
      "sunlit-landing":{ preview:{ layers:["sky","sun","storm-sea","island","pastures","cattle-zone","sheep-zone","prayer","cove","camp"], storm:0.45 } },
      "herds-grazing":{ preview:{ layers:["sky","sun","storm-sea","island","pastures","cattle-zone","sheep-zone","prayer","cove"], storm:0.35 } },
      "storm-blocked":{ preview:{ layers:["sky","storm-sea","island","pastures","cattle-zone","sheep-zone","prayer","cove","camp"], storm:1.0 } },
      "prayer":{ preview:{ layers:["sky","sun","storm-sea","island","pastures","prayer","cove","camp"], storm:0.6 } },
      "empty":{ preview:{ layers:["sky","sun","storm-sea","island","pastures","cove"], storm:0.5 } },
    },
    edges:[["sunlit-landing","herds-grazing"],["sunlit-landing","storm-blocked"],
           ["storm-blocked","prayer"],["herds-grazing","prayer"],["prayer","empty"]],
  },
  channels:["reveal","camera","storm","light","smoke"],

  preview:()=>({ layers:["sky","sun","storm-sea","island","pastures","cattle-zone","sheep-zone","prayer","cove","camp"], storm:0.40, status:"SUNLIT", progress:.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
