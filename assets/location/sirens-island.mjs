/* location.sirens-island — the Sirens' flowery meadow coast.
   LOCATION asset. Empty navigable set: a low flowery meadow coast in the
   middle ground, scattered (half-hidden) bones among the blossoms, three
   marked singing positions along the shore, a calm-water radius of windless
   sea in the foreground, and a safe-passage boundary line offshore. Drawn in
   SOLID grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone. Do NOT bake characters in.
   Atlas: OD-B12-S03 — low meadow coast, unseen bones, singing positions,
   calm-water radius, safe-passage boundary. */
import { makePen, toneSolid, inkLevel, INK, rnd, clamp } from "../../engine/halfworld-engine.mjs";

const params = {
  horizonLevel:0.26,   // sky / far-sea horizon as fraction of H
  meadowLevel:0.30,    // where the island meadow band begins
  shoreLevel:0.62,     // where the meadow meets the foreground calm water
  flowerCount:120,     // flowers scattered across the meadow
  boneCount:9,         // scattered unseen bones half-hidden in the flowers
  singingSpots:3,      // marked singing positions along the coast
  calmRadius:0.44,     // calm-water radius as fraction of W (fg semicircle)
  boundaryLevel:0.87,  // safe-passage boundary line as fraction of H
};

/* one small meadow flower: a pale petal ring + a dark eye (flat fills;
   the dotify pass supplies the texture). Flowers read LIGHTER than the
   meadow, their eyes darker, so the coast reads as "flowery". */
function flower(g, x, y, s){
  g.fillStyle = inkLevel(2);
  for(let k=0;k<5;k++){ const a=k/5*Math.PI*2;
    g.beginPath(); g.ellipse(x+Math.cos(a)*s*0.6, y+Math.sin(a)*s*0.6, s*0.42, s*0.42, 0,0,7); g.fill(); }
  g.fillStyle = inkLevel(6);
  g.beginPath(); g.arc(x, y, s*0.34, 0, 7); g.fill();
}

/* one scattered bone: pale bone-white shaft + knuckle knobs with a hard
   contour, so it reads as a bone half-lost in the meadow. */
function bone(pen, g, x, y, len, ang){
  g.save(); g.translate(x,y); g.rotate(ang);
  const bt = toneSolid(inkLevel(2));
  pen.limb(()=>{ g.moveTo(-len/2, 0); g.lineTo(len/2, 0); }, bt, len*0.20);
  pen.paint(()=>{ g.arc(-len/2, -len*0.11, len*0.17, 0,7); }, bt, 2);
  pen.paint(()=>{ g.arc(-len/2,  len*0.11, len*0.17, 0,7); }, bt, 2);
  pen.paint(()=>{ g.arc( len/2, -len*0.11, len*0.17, 0,7); }, bt, 2);
  pen.paint(()=>{ g.arc( len/2,  len*0.11, len*0.17, 0,7); }, bt, 2);
  g.restore();
}

/* one marked singing position: low dais stone, a marker post + banner, and
   radiating song arcs — the diegetic "sing here" mark. No siren baked in. */
function singingMark(pen, g, x, y, s){
  // low dais stone
  pen.paint(()=>{ g.ellipse(x, y, s*1.25, s*0.5, 0,0,7); }, toneSolid(inkLevel(5)), 4);
  // marker post
  pen.paint(()=>{ g.rect(x-s*0.12, y-s*1.5, s*0.24, s*1.5); }, toneSolid(inkLevel(6)), 3);
  // banner notch
  pen.paint(()=>{ g.moveTo(x+s*0.12, y-s*1.5); g.lineTo(x+s*0.72, y-s*1.28);
                  g.lineTo(x+s*0.12, y-s*1.08); g.closePath(); }, toneSolid(inkLevel(3)), 2);
  // radiating song arcs above the post
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.55;
  for(let r=1;r<=3;r++){ g.beginPath(); g.arc(x, y-s*1.5, s*(0.55+r*0.55), Math.PI*1.14, Math.PI*1.86); g.stroke(); }
  g.globalAlpha=1;
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizonY = H*params.horizonLevel;
  const meadowY  = H*params.meadowLevel;
  const shoreY   = H*params.shoreLevel;
  const band     = shoreY - meadowY;
  const layers = st.layers || ["sky","farsea","hills","meadow","flowers","bones","singing","water","calm","boundary","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizonY);
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.24+i*0.27), horizonY*(0.40+0.14*(i%2)), W*0.10, H*0.020, 0,0,7); g.fill(); }
  }

  // ---- FAR SEA behind the island (mid-light) ----
  if (has("farsea")){
    pen.paint(()=>{ g.rect(0, horizonY, W, meadowY-horizonY); }, toneSolid(inkLevel(2)), 0);
    pen.ink(()=>{ g.moveTo(0,horizonY); g.lineTo(W,horizonY); }, 3);
    g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=0.35;
    for(let j=1;j<=2;j++){ const y=horizonY+(meadowY-horizonY)*(j/3);
      g.beginPath();
      for(let x=0;x<=W;x+=W/16){ const yy=y+Math.sin((x/W)*8+j)*2; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
      g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- LOW HILLS at the back of the island (bg framing) ----
  if (has("hills")){
    pen.paint(()=>{
      g.moveTo(0, meadowY);
      g.quadraticCurveTo(W*0.16, meadowY-H*0.055, W*0.34, meadowY);
      g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{
      g.moveTo(W*0.62, meadowY);
      g.quadraticCurveTo(W*0.82, meadowY-H*0.045, W, meadowY);
      g.lineTo(W, meadowY); g.closePath();
    }, toneSolid(inkLevel(4)), 4);
  }

  // ---- MEADOW band (middle ground, the flowery coast) ----
  if (has("meadow")){
    pen.paint(()=>{ g.rect(0, meadowY, W, band); }, toneSolid(inkLevel(3)), 0);
    pen.ink(()=>{ g.moveTo(0,meadowY); g.lineTo(W,meadowY); }, 3);
    // grass tufts
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.40;
    for(let i=0;i<30;i++){
      const gx=(i*53%100)/100*W, gy=meadowY+((i*41%100)/100)*band;
      g.beginPath(); g.moveTo(gx,gy); g.lineTo(gx-3,gy-7); g.moveTo(gx,gy); g.lineTo(gx+3,gy-7); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- SCATTERED FLOWERS across the meadow ----
  if (has("flowers")){
    const R = rnd(1207);
    for(let i=0;i<params.flowerCount;i++){
      const fx = W*0.03 + R()*W*0.94;
      const fy = meadowY + (0.06 + R()*0.9)*band;
      const s  = 4 + R()*4.5;
      flower(g, fx, fy, s);
    }
  }

  // ---- SCATTERED UNSEEN BONES half-hidden in the flowers ----
  if (has("bones")){
    const B = rnd(4801);
    for(let i=0;i<params.boneCount;i++){
      const bx = W*0.08 + B()*W*0.84;
      const by = meadowY + (0.28 + B()*0.66)*band;
      bone(pen, g, bx, by, 12 + B()*10, B()*Math.PI);
    }
  }

  // ---- MARKED SINGING POSITIONS along the coast ----
  if (has("singing")){
    const n = params.singingSpots;
    for(let i=0;i<n;i++){
      const t = (i+0.5)/n;
      const x = W*(0.16 + 0.68*t);
      const y = meadowY + band*(0.60 + (i%2?0.06:-0.04));
      singingMark(pen, g, x, y, H*0.028);
    }
  }

  // ---- FOREGROUND CALM WATER ----
  if (has("water")){
    pen.paint(()=>{ g.rect(0, shoreY, W, H-shoreY); }, toneSolid(inkLevel(3)), 0);
    // wet shoreline where meadow meets water
    pen.paint(()=>{
      g.moveTo(0, shoreY);
      g.quadraticCurveTo(W*0.5, shoreY-H*0.028, W, shoreY);
      g.lineTo(W, shoreY+H*0.018);
      g.quadraticCurveTo(W*0.5, shoreY-H*0.006, 0, shoreY+H*0.018);
      g.closePath();
    }, toneSolid(inkLevel(4)), 3);
    // restless swell OUTSIDE the calm radius (drawn first; calm fill covers center)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.40;
    for(let j=1;j<=4;j++){ const y=shoreY+(H-shoreY)*(j/5);
      g.beginPath();
      for(let x=0;x<=W;x+=W/14){ const yy=y+Math.sin((x/W)*7+j*1.2)*4; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
      g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- CALM-WATER RADIUS (windless glassy semicircle around the island) ----
  if (has("calm")){
    const cx=W*0.5, cy=shoreY, cr=W*params.calmRadius;
    // glassy calm fill (lighter than the surrounding swell)
    pen.paint(()=>{ g.arc(cx, cy, cr, 0, Math.PI, false); g.closePath(); }, toneSolid(inkLevel(1)), 0);
    // radius contour + an inner marker ring
    pen.ink(()=>{ g.arc(cx, cy, cr, 0, Math.PI, false); }, 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    g.beginPath(); g.arc(cx, cy, cr*0.6, 0, Math.PI, false); g.stroke();
    g.globalAlpha=1;
    // a faint radius spoke marking the measured radius
    g.strokeStyle=INK; g.lineWidth=2; g.setLineDash([7,7]); g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx+cr, cy); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
    // faint concentric calm rings inside
    g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=0.28;
    for(let r=1;r<=3;r++){ g.beginPath(); g.arc(cx, cy, cr*0.6*(r/3.2), 0, Math.PI, false); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- SAFE-PASSAGE BOUNDARY LINE offshore ----
  if (has("boundary")){
    const by=H*params.boundaryLevel;
    g.strokeStyle=INK; g.lineWidth=3; g.setLineDash([16,11]); g.globalAlpha=0.9;
    g.beginPath();
    for(let x=0;x<=W;x+=W/18){ const yy=by+Math.sin((x/W)*6)*3; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
    g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
    // buoy markers along the boundary
    for(let i=0;i<5;i++){
      const x=W*(0.12+0.19*i), y=by+Math.sin((x/W)*6)*3;
      pen.paint(()=>{ g.moveTo(x, y-H*0.016); g.lineTo(x+W*0.014, y); g.lineTo(x, y+H*0.012); g.lineTo(x-W*0.014, y); g.closePath(); }, toneSolid(inkLevel(6)), 3);
      pen.ink(()=>{ g.moveTo(x, y-H*0.016); g.lineTo(x, y-H*0.032); }, 2);
    }
  }
}

export const asset = {
  id:"location.sirens-island",
  type:"LOCATION",
  name:"Sirens' Island",
  statusWord:"BECKONING",
  scene:"OD-B12-S03",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude depth
  layers:["sky","farsea","hills","meadow","flowers","bones","singing","water","calm","boundary","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "sing:west":{x:.26,y:.53},
    "sing:mid":{x:.50,y:.51},
    "sing:east":{x:.74,y:.53},
    "bone:field":{x:.40,y:.55},
    "meadow:center":{x:.50,y:.46},
    "shore:landing":{x:.50,y:.62},
    "calm:center":{x:.50,y:.72},
    "calm:edge":{x:.94,y:.62},
    "boundary:west":{x:.12,y:.87},
    "boundary:mid":{x:.50,y:.87},
    "boundary:east":{x:.88,y:.87},
    "entrance:sea":{x:.50,y:.99},
    "exit:inland":{x:.50,y:.31},
    "camera:wide":{x:.50,y:.50},
    "camera:shore":{x:.50,y:.62},
  },
  // walkable / navigable regions (for scene placement / pathing)
  zones:{
    meadow:{ x0:.04,y0:.31,x1:.96,y1:.62 },
    calmWater:{ x0:.08,y0:.62,x1:.92,y1:.86 },
    safePassage:{ x0:.02,y0:.87,x1:.98,y1:.99 },
  },
  states:{
    initial:"luring",
    nodes:{
      luring:{ preview:{ layers:["sky","farsea","hills","meadow","flowers","bones","singing","water","calm","boundary"] } },
      "silent-passage":{ preview:{ layers:["sky","farsea","hills","meadow","flowers","bones","water","calm","boundary"] } },
      "empty-set":{ preview:{ layers:["sky","farsea","hills","meadow","water","calm","boundary"] } },
    },
    edges:[["luring","silent-passage"],["luring","empty-set"],["silent-passage","luring"]],
  },
  channels:["reveal","camera","song","tide","light"],

  preview:()=>({ layers:["sky","farsea","hills","meadow","flowers","bones","singing","water","calm","boundary"], status:"BECKONING", progress:.24 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
