/* location.lotus-shore-and-meadow — a gentle coast for the Lotus-eaters.
   LOCATION asset. Empty navigable set: a landing beach in the foreground, a
   flowering lotus food-field across the middle meadow, an inland path winding
   back, and a ship-return route lane on the sea. Drawn in SOLID grays + hard
   contour into the offscreen ctx; the engine dotify pass supplies the halftone.
   Do NOT bake characters in.
   Atlas: OD-B09-S03 — gentle coast, landing beach, inland path, food field, ship route. */
import { makePen, toneSolid, inkLevel, INK, clamp } from "/engine/halfworld-engine.mjs";

const params = {
  seaLevel:0.30,       // sea/sky horizon as fraction of H
  meadowLevel:0.52,    // where the meadow band begins
  beachLevel:0.74,     // where the foreground beach begins
  lotusRows:4,         // rows of lotus blossoms in the food-field
  lotusCols:6,         // blossoms per row
  shipRoute:true,      // dashed return-lane + tiny hull on the sea
};

/* one lotus blossom: a low pad + a stylized cupped flower, in solid grays */
function lotus(pen, g, x, y, s){
  // lily pad under it
  pen.paint(()=>{ g.ellipse(x, y+s*0.16, s*0.9, s*0.34, 0, 0, 7); }, toneSolid(inkLevel(3)), 3);
  // outer petals
  pen.paint(()=>{
    g.moveTo(x, y-s*0.9);
    g.quadraticCurveTo(x+s*0.85, y-s*0.2, x+s*0.5, y+s*0.05);
    g.quadraticCurveTo(x, y-s*0.1, x-s*0.5, y+s*0.05);
    g.quadraticCurveTo(x-s*0.85, y-s*0.2, x, y-s*0.9);
  }, toneSolid(inkLevel(2)), 3);
  // inner cup (darker)
  pen.paint(()=>{
    g.moveTo(x, y-s*0.62);
    g.quadraticCurveTo(x+s*0.34, y-s*0.14, x, y+s*0.02);
    g.quadraticCurveTo(x-s*0.34, y-s*0.14, x, y-s*0.62);
  }, toneSolid(inkLevel(5)), 3);
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const seaY    = H*params.seaLevel;
  const meadowY = H*params.meadowLevel;
  const beachY  = H*params.beachLevel;
  const layers = st.layers || ["sky","sea","route","headland","meadow","field","beach","path","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,seaY);
    // a few soft cloud steps
    g.fillStyle = inkLevel(2);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(0.22+i*0.28), seaY*(0.42+0.12*(i%2)), W*0.10, H*0.022, 0,0,7); g.fill(); }
  }

  // ---- SEA band with wave rules (mid tone) ----
  if (has("sea")){
    pen.paint(()=>{ g.rect(0, seaY, W, meadowY-seaY); }, toneSolid(inkLevel(3)), 0);
    // horizon contour
    pen.ink(()=>{ g.moveTo(0,seaY); g.lineTo(W,seaY); }, 4);
    // wave rules
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let j=1;j<=4;j++){ const y=seaY+(meadowY-seaY)*(j/5);
      g.beginPath();
      for(let x=0;x<=W;x+=W/14){ const yy=y+Math.sin((x/W)*7+j)*3; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- SHIP-RETURN ROUTE — dashed lane on the sea + tiny hull ----
  if (has("route") && params.shipRoute){
    const ax=W*0.10, ay=meadowY-H*0.015, bx=W*0.70, by=seaY+H*0.03;
    g.strokeStyle=INK; g.lineWidth=3; g.setLineDash([10,8]); g.globalAlpha=0.75;
    g.beginPath(); g.moveTo(ax,ay); g.quadraticCurveTo(W*0.42,meadowY-H*0.02, bx,by); g.stroke();
    g.setLineDash([]); g.globalAlpha=1;
    // tiny returning ship near the far end of the lane
    const sx=W*0.70, sy=by;
    pen.paint(()=>{
      g.moveTo(sx-W*0.045, sy); g.lineTo(sx+W*0.045, sy);
      g.lineTo(sx+W*0.028, sy+H*0.018); g.lineTo(sx-W*0.028, sy+H*0.018); g.closePath();
    }, toneSolid(inkLevel(6)), 3);
    pen.ink(()=>{ g.moveTo(sx,sy); g.lineTo(sx,sy-H*0.045); }, 3);              // mast
    pen.paint(()=>{ g.moveTo(sx,sy-H*0.045); g.lineTo(sx+W*0.03,sy-H*0.012); g.lineTo(sx,sy-H*0.008); g.closePath(); }, toneSolid(inkLevel(2)), 2); // sail
  }

  // ---- HEADLAND / coast hills at the shoreline (bg framing) ----
  if (has("headland")){
    pen.paint(()=>{
      g.moveTo(0, meadowY);
      g.quadraticCurveTo(W*0.14, meadowY-H*0.075, W*0.30, meadowY);
      g.lineTo(0, meadowY); g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    pen.paint(()=>{
      g.moveTo(W*0.78, meadowY);
      g.quadraticCurveTo(W*0.92, meadowY-H*0.06, W, meadowY);
      g.lineTo(W, meadowY+H*0.02); g.lineTo(W*0.78, meadowY); g.closePath();
    }, toneSolid(inkLevel(4)), 4);
  }

  // ---- MEADOW band (middle ground) ----
  if (has("meadow")){
    pen.paint(()=>{ g.rect(0, meadowY, W, beachY-meadowY); }, toneSolid(inkLevel(3)), 0);
    pen.ink(()=>{ g.moveTo(0,meadowY); g.lineTo(W,meadowY); }, 3);
    // scattered grass tufts
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    for(let i=0;i<26;i++){
      const gx=(i*53%100)/100*W, gy=meadowY+((i*37%100)/100)*(beachY-meadowY);
      g.beginPath(); g.moveTo(gx,gy); g.lineTo(gx-3,gy-7); g.moveTo(gx,gy); g.lineTo(gx+3,gy-7); g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- FLOWERING LOTUS FOOD-FIELD across the meadow ----
  if (has("field")){
    const rows=params.lotusRows, cols=params.lotusCols;
    const y0=meadowY+(beachY-meadowY)*0.30, y1=beachY-(beachY-meadowY)*0.06;
    for(let r=0;r<rows;r++){
      const t=r/(rows-1);
      const y=y0+(y1-y0)*t;
      const s=(0.020+0.020*t)*H;                 // blossoms grow toward foreground
      const inset=W*(0.10+0.02*(1-t));
      const stagger=(r%2)? (W-inset*2)/cols/2 : 0;
      for(let c=0;c<cols;c++){
        const x=inset+stagger+(W-inset*2)*(c/(cols-1));
        if (x>W-inset*0.4) continue;
        lotus(pen, g, x, y, s);
      }
    }
  }

  // ---- LANDING BEACH (foreground, light sand) ----
  if (has("beach")){
    pen.paint(()=>{ g.rect(0, beachY, W, H-beachY); }, toneSolid(inkLevel(2)), 0);
    // wet shoreline curve where beach meets meadow
    pen.paint(()=>{
      g.moveTo(0, beachY);
      g.quadraticCurveTo(W*0.5, beachY-H*0.03, W, beachY);
      g.lineTo(W, beachY+H*0.02);
      g.quadraticCurveTo(W*0.5, beachY-H*0.01, 0, beachY+H*0.02);
      g.closePath();
    }, toneSolid(inkLevel(3)), 3);
    // ripple lines on the sand
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
    for(let j=1;j<=3;j++){ const y=beachY+(H-beachY)*(j/4);
      g.beginPath();
      for(let x=0;x<=W;x+=W/12){ const yy=y+Math.sin((x/W)*6+j*1.3)*2.5; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- INLAND PATH — winds from the beach up through the meadow ----
  if (has("path")){
    const px0=W*0.42, py0=H*0.97, px1=W*0.60, py1=meadowY+H*0.02;
    // path body (light, so it reads as walkable ground)
    pen.paint(()=>{
      g.moveTo(px0-W*0.09, py0);
      g.quadraticCurveTo(W*0.30, beachY, W*0.50, meadowY+H*0.05);
      g.lineTo(px1+W*0.02, py1);
      g.lineTo(px1-W*0.02, py1);
      g.quadraticCurveTo(W*0.42, beachY, px0+W*0.02, py0);
      g.closePath();
    }, toneSolid(inkLevel(1)), 3);
    // path edge stones
    g.fillStyle=inkLevel(4);
    for(let i=0;i<6;i++){ const t=i/5;
      const ex=px0-W*0.09 + (px1-W*0.02 - (px0-W*0.09))*t - Math.sin(t*3)*W*0.06;
      const ey=py0+(py1-py0)*t;
      g.beginPath(); g.ellipse(ex, ey, 6, 4, 0,0,7); g.fill();
    }
  }
}

export const asset = {
  id:"location.lotus-shore-and-meadow",
  type:"LOCATION",
  name:"Lotus Shore and Meadow",
  statusWord:"BECALMED",
  scene:"OD-B09-S03",

  params,
  // back -> front draw order; scene state can pass a subset to reveal/occlude depth
  layers:["sky","sea","route","headland","meadow","field","beach","path","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "landing:beach":{x:.50,y:.86},
    "moor:ship":{x:.20,y:.80},
    "route:return":{x:.70,y:.34},
    "field:center":{x:.50,y:.62},
    "field:near":{x:.62,y:.70},
    "path:mouth":{x:.44,y:.94},
    "path:inland":{x:.60,y:.55},
    "exit:inland":{x:.60,y:.52},
    "entrance:sea":{x:.20,y:.80},
    "camera:wide":{x:.50,y:.50},
    "camera:shore":{x:.50,y:.80},
  },
  // walkable ground regions (for scene placement / pathing)
  zones:{
    beach:{ x0:.04,y0:.76,x1:.96,y1:.99 },
    meadow:{ x0:.06,y0:.52,x1:.94,y1:.74 },
    path:{ x0:.34,y0:.52,x1:.66,y1:.98 },
  },
  states:{
    initial:"arrival",
    nodes:{
      arrival:{ preview:{ layers:["sky","sea","route","headland","meadow","field","beach","path"] } },
      "ship-departed":{ preview:{ layers:["sky","sea","headland","meadow","field","beach","path"] } },
      "field-only":{ preview:{ layers:["sky","sea","headland","meadow","field"] } },
    },
    edges:[["arrival","ship-departed"],["arrival","field-only"],["ship-departed","arrival"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({ layers:["sky","sea","route","headland","meadow","field","beach","path"], status:"BECALMED", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
