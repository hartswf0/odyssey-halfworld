/* location.phaeacian-orchard-and-garden — Alcinous's magical perpetual orchard.
   LOCATION asset. An EMPTY navigable set drawn in SOLID grays + hard contour
   into the offscreen ctx (the engine dotify pass supplies the halftone).
   Back-to-front depth: sky / the enclosing wall + heavy-hanging GRAPE VINE
   trellis rows / a standing row of perpetually-fruitful FRUIT TREES (pear ·
   pomegranate · apple · fig · olive) each carrying BLOSSOM and FRUIT at once
   (all four seasons together) / the TWIN SPRINGS that water the ground / the
   foreground GARDEN BEDS in worked rows, with walkable lanes between. No baked
   characters.
   Atlas: OD-B07-S02 — pears, pomegranates, apples, figs, olives, vines, beds,
   twin springs, seasons at once. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, rnd } from "/engine/halfworld-engine.mjs";

const params = {
  wallLevel:0.42,       // top of the enclosing wall / trellis band (fraction of H)
  horizon:0.56,         // ground horizon
  vineRows:1,           // heavy grape-trellis row across the back
  trees:5,              // pear · pomegranate · apple · fig · olive
  springs:2,            // the twin springs
  beds:3,               // foreground worked garden beds
};

/* ---- one perpetually-fruitful tree: blossom + ripe fruit together ---- */
function drawFruitTree(pen, g, cx, baseY, h, w, o){
  const canopy = o.canopy ?? 4, fruit = o.fruit ?? 6, nfruit = o.nfruit ?? 9;
  const shape = o.shape || "round", seed = o.seed || 1;
  const trunkH = h*0.30, trunkW = w*0.13;
  // trunk (dark) + a low root flare
  pen.paint(()=>{ g.moveTo(cx-trunkW*0.5, baseY);
                  g.lineTo(cx-trunkW*0.34, baseY-trunkH);
                  g.lineTo(cx+trunkW*0.34, baseY-trunkH);
                  g.lineTo(cx+trunkW*0.5, baseY); g.closePath(); }, toneSolid(inkLevel(6)), 3);
  const cy = baseY - trunkH - h*0.30;
  let rx, ry;
  if (shape==="tall"){ rx=w*0.36; ry=h*0.44; }        // pear — upright
  else if (shape==="broad"){ rx=w*0.56; ry=h*0.30; }  // fig — broad low
  else if (shape==="slim"){ rx=w*0.40; ry=h*0.34; }   // olive — narrow silvery
  else { rx=w*0.48; ry=h*0.36; }                       // round — apple/pomegranate
  // canopy: light main mass + two soft lobes (kept pale so fruit + blossom read)
  pen.paint(()=>{ g.ellipse(cx, cy, rx, ry, 0,0,7); }, toneSolid(inkLevel(canopy)), 4);
  pen.paint(()=>{ g.ellipse(cx-rx*0.50, cy+ry*0.12, rx*0.50, ry*0.56, 0,0,7); }, toneSolid(inkLevel(Math.max(1,canopy-1))), 3);
  pen.paint(()=>{ g.ellipse(cx+rx*0.50, cy-ry*0.06, rx*0.48, ry*0.54, 0,0,7); }, toneSolid(inkLevel(canopy)), 3);
  // scatter BLOSSOM (light outlined) + FRUIT (dark) deterministically inside
  const R = rnd(seed);
  const fr = w*0.052;
  for (let k=0;k<nfruit;k++){
    const a = R()*Math.PI*2, rr = Math.sqrt(R());
    const px = cx + Math.cos(a)*rx*0.78*rr, py = cy + Math.sin(a)*ry*0.78*rr;
    if (k % 2 === 1){
      // blossom — a light bloom that reads as a paper spot with a ring
      pen.paint(()=>{ g.arc(px, py, fr*0.78, 0,7); }, toneSolid(inkLevel(1)), 2);
    } else {
      // ripe fruit — dark bead; pomegranate/olive get a paired second bead
      pen.paint(()=>{ g.arc(px, py, fr, 0,7); }, toneSolid(inkLevel(fruit)), 2);
      if (o.paired) pen.paint(()=>{ g.arc(px+fr*1.3, py+fr*0.55, fr*0.8, 0,7); }, toneSolid(inkLevel(fruit)), 2);
    }
  }
}

/* ---- a heavy grape-vine trellis row: rail on posts + hanging clusters ---- */
function drawVineRow(pen, g, W, railY, postH){
  // horizontal training rail
  pen.ink(()=>{ g.moveTo(W*0.04, railY); g.lineTo(W*0.96, railY); }, 4);
  // posts
  for (let x=0.10; x<=0.90; x+=0.20){
    pen.paint(()=>{ g.rect(W*x-3, railY, 6, postH); }, toneSolid(inkLevel(5)), 2);
  }
  // leaves + hanging clusters spaced along the rail (compact so they stay clear of the trees)
  const R = rnd(7);
  for (let x=0.11; x<0.93; x+=0.135){
    const gx = W*x, gy = railY+4;
    // vine leaf
    pen.paint(()=>{ g.ellipse(gx-8, gy+3, 9, 6, 0.6, 0,7); }, toneSolid(inkLevel(3)), 2);
    // pendant grape cluster — narrowing rows of dark berries
    const rows = 3;
    for (let r=0; r<rows; r++){
      const cw = (rows-r);            // berries per row (wide top, point bottom)
      const by = gy + 5 + r*5;
      for (let b=0; b<cw; b++){
        const bx = gx - (cw-1)*2.6 + b*5.2 + (R()-0.5)*1.5;
        pen.paint(()=>{ g.arc(bx, by, 2.5, 0,7); }, toneSolid(inkLevel(6)), 1);
      }
    }
  }
}

/* ---- a spring: sunken basin, water, radiating ripple rings ---- */
function drawSpring(pen, g, cx, cy, r){
  // stone lip / basin
  pen.paint(()=>{ g.ellipse(cx, cy, r*1.14, r*0.62, 0,0,7); }, toneSolid(inkLevel(4)), 4);
  // water pool (light) inside
  pen.paint(()=>{ g.ellipse(cx, cy, r, r*0.5, 0,0,7); }, toneSolid(inkLevel(2)), 3);
  // radiating ripple rings from the welling source
  for (let i=1; i<=3; i++){
    const t = i/3.4;
    pen.ink(()=>{ g.ellipse(cx, cy, r*t, r*0.5*t, 0,0,7); }, 2);
  }
  // welling source mark at centre
  g.fillStyle = inkLevel(6); g.beginPath(); g.arc(cx, cy, r*0.10, 0,7); g.fill();
}

/* ---- a worked garden bed: raised plot with rows of tufts ---- */
function drawBed(pen, g, x, y, w, d){
  // top soil face (light) with a slight forward skew for depth
  pen.paint(()=>{ g.moveTo(x, y); g.lineTo(x+w, y);
                  g.lineTo(x+w+d*0.4, y+d); g.lineTo(x-d*0.4, y+d); g.closePath(); },
    toneSolid(inkLevel(2)), 3);
  // front earthen face (darker)
  pen.paint(()=>{ g.moveTo(x-d*0.4, y+d); g.lineTo(x+w+d*0.4, y+d);
                  g.lineTo(x+w+d*0.4, y+d+d*0.42); g.lineTo(x-d*0.4, y+d+d*0.42); g.closePath(); },
    toneSolid(inkLevel(4)), 3);
  // planted rows of small tufts across the soil (dark so they read as sprouts)
  const R = rnd(Math.round(x+y));
  for (let ry=0.30; ry<0.95; ry+=0.32){
    const yy = y + d*ry;
    for (let t=0.10; t<0.92; t+=0.13){
      const tx = x + w*t + (R()-0.5)*3, ty = yy;
      pen.paint(()=>{ g.moveTo(tx-4, ty); g.lineTo(tx, ty-9); g.lineTo(tx+4, ty); g.closePath(); },
        toneSolid(inkLevel(6)), 1);
    }
  }
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const wallY = H*params.wallLevel;
  const horizon = H*params.horizon;
  const layers = st.layers || ["sky","wall","vines","trees","springs","beds","paths","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
    g.fillStyle = inkLevel(2);
    for (let i=0;i<4;i++){ g.beginPath(); g.ellipse(W*(0.18+i*0.22), H*(0.12+0.05*(i%2)), W*0.12, H*0.026, 0,0,7); g.fill(); }
  }
  // ---- GROUND (walkable earth, light) ----
  if (has("sky")){ g.fillStyle = inkLevel(2); g.fillRect(0,horizon,W,H-horizon); }

  // ---- enclosing WALL band across the back ----
  if (has("wall")){
    pen.paint(()=>{ g.rect(0, wallY, W, horizon-wallY); }, toneSolid(inkLevel(3)), 0);
    // coping line along the top of the wall
    pen.ink(()=>{ g.moveTo(0, wallY); g.lineTo(W, wallY); }, 4);
    // faint ashlar courses
    g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=0.35;
    for (let j=1;j<3;j++){ const y=wallY+(horizon-wallY)*j/3; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
    pen.ink(()=>{ g.moveTo(0, horizon); g.lineTo(W, horizon); }, 3);
  }

  // ---- heavy GRAPE-VINE trellis rows against the wall ----
  if (has("vines")){
    const n = params.vineRows;
    for (let i=0;i<n;i++){
      const railY = wallY + (horizon-wallY)*(0.24 + i*0.34);
      drawVineRow(pen, g, W, railY, (horizon-railY)*0.42);
    }
  }

  // ---- the standing row of perpetually-fruitful FRUIT TREES ----
  if (has("trees")){
    // deterministic species placement across the plot, rooted near the horizon
    const rows = [
      { cx:0.13, h:0.40, w:0.17, shape:"tall",  canopy:2, fruit:6, nfruit:9,  seed:11, dy:0.02 }, // pear
      { cx:0.33, h:0.36, w:0.18, shape:"round", canopy:3, fruit:7, nfruit:10, seed:23, dy:0.03, paired:true }, // pomegranate
      { cx:0.52, h:0.42, w:0.19, shape:"round", canopy:2, fruit:6, nfruit:9,  seed:37, dy:0.02 }, // apple
      { cx:0.71, h:0.34, w:0.21, shape:"broad", canopy:3, fruit:6, nfruit:8,  seed:53, dy:0.03 }, // fig
      { cx:0.89, h:0.38, w:0.16, shape:"slim",  canopy:2, fruit:5, nfruit:11, seed:71, dy:0.02, paired:true }, // olive
    ];
    for (const r of rows){
      drawFruitTree(pen, g, W*r.cx, horizon + H*r.dy, H*r.h, W*r.w, r);
    }
  }

  // ---- the TWIN SPRINGS that water the ground ----
  if (has("springs")){
    drawSpring(pen, g, W*0.26, H*0.72, W*0.11);
    drawSpring(pen, g, W*0.74, H*0.72, W*0.11);
    // a runnel linking the near spring toward the beds
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    g.beginPath(); g.moveTo(W*0.26, H*0.755); g.quadraticCurveTo(W*0.40, H*0.82, W*0.50, H*0.86); g.stroke();
    g.globalAlpha=1;
  }

  // ---- foreground GARDEN BEDS in worked rows ----
  if (has("beds")){
    const bw = W*0.26, bd = H*0.062;
    const spots = [ [0.06,0.82], [0.37,0.84], [0.68,0.82] ];
    for (let i=0;i<Math.min(params.beds,spots.length);i++){
      drawBed(pen, g, W*spots[i][0], H*spots[i][1], bw, bd);
    }
  }

  // ---- walkable lane markings between rows ----
  if (has("paths")){
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    // cross lane in front of the trees
    g.beginPath(); g.moveTo(0, H*0.665); g.lineTo(W, H*0.665); g.stroke();
    // receding centre lane
    g.beginPath(); g.moveTo(W*0.5, H*0.665); g.lineTo(W*0.5, horizon); g.stroke();
    g.globalAlpha=1;
  }

  // ---- ANCHOR / camera marks (faint blue, non-halftone hints) ----
  if (has("anchors")){
    g.save(); g.globalAlpha=0.9; g.fillStyle=ACCENT;
    const marks = [[0.26,0.72],[0.74,0.72],[0.50,0.66],[0.50,0.90]];
    for (const m of marks){ g.beginPath(); g.arc(W*m[0],H*m[1],3.2,0,7); g.fill(); }
    g.restore();
  }
}

export const asset = {
  id:"location.phaeacian-orchard-and-garden",
  type:"LOCATION",
  name:"Phaeacian Orchard and Garden",
  statusWord:"FRUITFUL",
  scene:"OD-B07-S02",

  params,
  layers:["sky","wall","vines","trees","springs","beds","paths","anchors"],
  // normalized 0..1 placement / camera anchors — NO baked characters
  anchors:{
    "tree:pear":{x:.13,y:.58},
    "tree:pomegranate":{x:.33,y:.59},
    "tree:apple":{x:.52,y:.58},
    "tree:fig":{x:.71,y:.59},
    "tree:olive":{x:.89,y:.58},
    "vines:back":{x:.50,y:.50},
    "spring:near":{x:.26,y:.72},
    "spring:far":{x:.74,y:.72},
    "bed:left":{x:.19,y:.90},
    "bed:centre":{x:.50,y:.92},
    "bed:right":{x:.81,y:.90},
    "entrance:lane":{x:.50,y:.98},
    "exit:wall-gate":{x:.50,y:.50},
    "camera:wide":{x:.50,y:.50},
    "camera:springs":{x:.50,y:.72},
  },
  // walkable ground regions + the planting rows (for scene placement / pathing)
  zones:{
    walkable:{ x0:.02,y0:.60,x1:.98,y1:.98 },
    "row:trees":{ x0:.04,y0:.60,x1:.96,y1:.70 },
    "row:springs":{ x0:.10,y0:.66,x1:.90,y1:.80 },
    "row:beds":{ x0:.04,y0:.84,x1:.96,y1:.98 },
  },
  states:{
    initial:"fruitful",
    nodes:{
      // all seasons at once — the default magical state
      fruitful:{ preview:{ layers:["sky","wall","vines","trees","springs","beds","paths","anchors"] } },
      // trees only, springs + beds hidden (tighter framing on the canopies)
      grove:{ preview:{ layers:["sky","wall","vines","trees","paths"] } },
      // bare navigable ground (set struck for blocking)
      empty:{ preview:{ layers:["sky","wall","paths"] } },
    },
    edges:[["fruitful","grove"],["fruitful","empty"],["grove","fruitful"]],
  },
  channels:["reveal","camera","light","season"],

  preview:()=>({
    layers:["sky","wall","vines","trees","springs","beds","paths","anchors"],
    status:"FRUITFUL", progress:.30,
  }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
