/* location.phaeacian-athletic-field — the marked games ground of Scheria.
   LOCATION asset. An EMPTY navigable set drawn in SOLID grays + hard contour
   (the engine dotify pass supplies the halftone). A diagrammatic top-down
   games field: a straight running track with numbered lanes, a wrestling
   ring, a long-jump run-up + sand pit with a takeoff board, a marked boxing
   square with corner posts, and a discus throwing arc fanning out to distance
   markers. Spectator crowd edges frame the back and both sides. No baked
   characters — only marked event zones + placement anchors.
   Atlas: OD-B08-S03 — the Phaeacians hold games to honour their guest. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;

const params = {
  lanes:5,             // running-track lanes
  distanceArcs:4,      // discus distance markers
  cornerPosts:true,    // boxing-square corner posts
  takeoffBoard:true,   // long-jump takeoff board
  crowdBack:true,      // rising spectator tier across the back
  crowdSides:true,     // narrow spectator strips down both edges
  horizon:0.24,        // top edge of the field ground
};

/* a small tick mark perpendicular to a direction, centered at p */
function tick(g, p, dir, len){
  const n = { x:-dir.y, y:dir.x };
  g.beginPath();
  g.moveTo(p.x - n.x*len, p.y - n.y*len);
  g.lineTo(p.x + n.x*len, p.y + n.y*len);
  g.stroke();
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["ground","crowd","track","jumppit","wrestling","boxing","discus"];
  const has = l => layers.includes(l);
  const horizon = H*params.horizon;

  // ---- FIELD GROUND (lightest — reads as open earth) ----
  if (has("ground")){
    g.fillStyle = inkLevel(2); g.fillRect(0,0,W,horizon);        // sky band
    g.fillStyle = inkLevel(1); g.fillRect(0,horizon,W,H-horizon); // field
    // faint groundline at the horizon
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 3);
  }

  // ---- SPECTATOR CROWD EDGES (framing tiers, darker so they read as bodies) ----
  if (has("crowd")){
    // back tier: a few stacked bands above the horizon
    if (params.crowdBack){
      for(let b=0;b<3;b++){
        const y = horizon - H*0.02 - b*H*0.045;
        pen.paint(()=>{ g.rect(W*0.08, y-H*0.045, W*0.84, H*0.045); },
          toneSolid(inkLevel(3 + (b%2))), 3);
      }
      // vertical seat dividers on the back tier
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
      for(let i=1;i<18;i++){ const x=lerp(W*0.08,W*0.92,i/18); g.beginPath(); g.moveTo(x,horizon-H*0.155); g.lineTo(x,horizon-H*0.02); g.stroke(); }
      g.globalAlpha=1;
    }
    // side strips: narrow spectator margins down both edges of the field
    if (params.crowdSides){
      for(const side of [-1,1]){
        const x = side<0 ? 0 : W-W*0.05;
        pen.paint(()=>{ g.rect(x, horizon, W*0.05, H-horizon); }, toneSolid(inkLevel(3)), 3);
        // hatch rows so the strip reads as tiered seating
        g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
        for(let y=horizon+H*0.03; y<H; y+=H*0.045){ g.beginPath(); g.moveTo(x,y); g.lineTo(x+W*0.05,y); g.stroke(); }
        g.globalAlpha=1;
      }
    }
  }

  // ---- RUNNING TRACK — straight numbered lanes across the bottom ----
  if (has("track")){
    const x0=W*0.09, x1=W*0.91, yTop=H*0.80, yBot=H*0.95;
    const n=params.lanes;
    // track bed
    pen.paint(()=>{ g.rect(x0,yTop,x1-x0,yBot-yTop); }, toneSolid(inkLevel(2)), 4);
    // lane divider lines
    g.strokeStyle=INK; g.lineWidth=2;
    for(let i=1;i<n;i++){ const y=lerp(yTop,yBot,i/n); g.beginPath(); g.moveTo(x0,y); g.lineTo(x1,y); g.stroke(); }
    // start line (left) + finish line (right), heavy bars
    pen.paint(()=>{ g.rect(x0, yTop, W*0.012, yBot-yTop); }, toneSolid(inkLevel(6)), 2);
    pen.paint(()=>{ g.rect(x1-W*0.012, yTop, W*0.012, yBot-yTop); }, toneSolid(inkLevel(6)), 2);
    // starting blocks per lane at the left
    g.fillStyle=inkLevel(5);
    for(let i=0;i<n;i++){ const yc=lerp(yTop,yBot,(i+0.5)/n); g.fillRect(x0+W*0.02, yc-H*0.006, W*0.02, H*0.012); }
  }

  // ---- LONG-JUMP RUN-UP + SAND PIT (left-mid) ----
  if (has("jumppit")){
    const rx=W*0.30;                     // run-up center x
    const runTop=H*0.52, runBot=H*0.70;  // vertical run-up strip
    const rw=W*0.09;
    // run-up strip (light, with a center guide line)
    pen.paint(()=>{ g.rect(rx-rw/2, runTop, rw, runBot-runTop); }, toneSolid(inkLevel(1)), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.5;
    g.beginPath(); g.setLineDash([6,6]); g.moveTo(rx,runTop); g.lineTo(rx,runBot); g.stroke(); g.setLineDash([]);
    g.globalAlpha=1;
    // takeoff board across the strip
    if (params.takeoffBoard){
      pen.paint(()=>{ g.rect(rx-rw/2, runBot-H*0.01, rw, H*0.014); }, toneSolid(inkLevel(6)), 3);
    }
    // sand pit below the board (mid tone, filled)
    const pitTop=runBot+H*0.006, pitBot=H*0.775, pw=W*0.14;
    pen.paint(()=>{ g.rect(rx-pw/2, pitTop, pw, pitBot-pitTop); }, toneSolid(inkLevel(3)), 4);
    // rake furrows in the sand
    g.strokeStyle=INK; g.lineWidth=1.5; g.globalAlpha=0.4;
    for(let i=1;i<5;i++){ const y=lerp(pitTop,pitBot,i/5); g.beginPath(); g.moveTo(rx-pw/2,y); g.lineTo(rx+pw/2,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- WRESTLING RING — a marked circle (left-upper) ----
  if (has("wrestling")){
    const cx=W*0.30, cy=H*0.37, r=W*0.115;
    pen.paint(()=>{ g.ellipse(cx,cy,r,r*0.82,0,0,TAU); }, toneSolid(inkLevel(2)), 5);   // ring bed
    pen.ink(()=>{ g.ellipse(cx,cy,r*0.62,r*0.62*0.82,0,0,TAU); }, 3);                    // inner circle
    // center mark
    g.fillStyle=inkLevel(6); g.beginPath(); g.ellipse(cx,cy,r*0.06,r*0.05,0,0,TAU); g.fill();
    // cross guide through center
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    g.beginPath(); g.moveTo(cx-r,cy); g.lineTo(cx+r,cy); g.moveTo(cx,cy-r*0.82); g.lineTo(cx,cy+r*0.82); g.stroke();
    g.globalAlpha=1;
  }

  // ---- BOXING SQUARE — marked square with corner posts (right-upper) ----
  if (has("boxing")){
    const cx=W*0.70, cy=H*0.37, s=W*0.185;
    const x=cx-s/2, y=cy-s*0.42, sh=s*0.84;
    pen.paint(()=>{ g.rect(x, y, s, sh); }, toneSolid(inkLevel(2)), 5);        // square bed
    pen.ink(()=>{ g.rect(x+s*0.14, y+sh*0.14, s*0.72, sh*0.72); }, 3);         // inner scratch line
    // corner posts
    if (params.cornerPosts){
      const pr=s*0.09;
      for(const [px,py] of [[x,y],[x+s,y],[x,y+sh],[x+s,y+sh]]){
        pen.paint(()=>{ g.rect(px-pr/2, py-pr/2, pr, pr); }, toneSolid(inkLevel(6)), 3);
      }
    }
    // center scratch mark
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    g.beginPath(); g.moveTo(cx-s*0.1,cy); g.lineTo(cx+s*0.1,cy); g.stroke();
    g.globalAlpha=1;
  }

  // ---- DISCUS THROWING ARC + DISTANCE MARKERS (right-lower, fanning down) ----
  if (has("discus")){
    const cx=W*0.70, cy=H*0.555;         // throwing point (top of the fan)
    const A=0.44;                         // sector half-angle from downward vertical
    const rMax=H*0.20;
    const dirs = [
      { x:Math.sin(-A), y:Math.cos(-A) },
      { x:Math.sin( A), y:Math.cos( A) },
    ];
    // throwing circle
    pen.paint(()=>{ g.ellipse(cx,cy,W*0.045,W*0.045*0.7,0,0,TAU); }, toneSolid(inkLevel(4)), 4);
    // sector fill (very light so distance arcs read on top)
    pen.paint(()=>{
      g.moveTo(cx,cy);
      g.lineTo(cx+dirs[0].x*rMax, cy+dirs[0].y*rMax);
      g.arc(cx,cy,rMax, Math.PI/2 - A + 0, Math.PI/2 + A, false);
      g.closePath();
    }, toneSolid(inkLevel(1)), 3);
    // sector boundary lines
    g.strokeStyle=INK; g.lineWidth=3;
    for(const d of dirs){ g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+d.x*rMax, cy+d.y*rMax); g.stroke(); }
    // distance-marker arcs + ticks
    const n=params.distanceArcs;
    g.lineWidth=2;
    for(let i=1;i<=n;i++){
      const r = rMax*i/n;
      g.strokeStyle=INK; g.globalAlpha=0.7;
      g.beginPath(); g.arc(cx,cy,r, Math.PI/2 - A, Math.PI/2 + A, false); g.stroke();
      // a tick at the centerline of each distance marker
      g.globalAlpha=1;
      const p={ x:cx, y:cy+r };
      tick(g, p, {x:1,y:0}, W*0.012);
    }
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"location.phaeacian-athletic-field",
  type:"LOCATION",
  name:"Phaeacian Athletic Field",
  statusWord:"MARKED",
  scene:"OD-B08-S03",

  params,
  // back -> front draw order the set honors; scene state may pass a subset
  layers:["ground","crowd","track","jumppit","wrestling","boxing","discus"],
  // normalized 0..1 placement / camera + event anchors (NOT baked characters)
  anchors:{
    "zone:wrestling":{x:.30,y:.37}, "zone:boxing":{x:.70,y:.37},
    "zone:jump-runup":{x:.30,y:.60}, "zone:jump-pit":{x:.30,y:.74},
    "zone:discus":{x:.70,y:.555}, "marker:discus-far":{x:.70,y:.75},
    "track:start":{x:.11,y:.875}, "track:finish":{x:.89,y:.875},
    "crowd:back":{x:.50,y:.14}, "crowd:left":{x:.03,y:.60}, "crowd:right":{x:.97,y:.60},
    "entrance:left":{x:.03,y:.90}, "exit:right":{x:.97,y:.90},
    "camera:wide":{x:.50,y:.52}, "camera:track":{x:.50,y:.87}, "camera:ring":{x:.30,y:.37},
  },
  // walkable / staging regions for scene placement + pathing
  zones:{
    field:{ x0:.06,y0:.24,x1:.94,y1:.98 },
    track:{ x0:.09,y0:.80,x1:.91,y1:.95 },
    wrestling:{ x0:.19,y0:.28,x1:.41,y1:.46 },
    boxing:{ x0:.60,y0:.28,x1:.80,y1:.46 },
    jumpPit:{ x0:.23,y0:.70,x1:.37,y1:.78 },
    discus:{ x0:.55,y0:.53,x1:.85,y1:.76 },
  },
  states:{
    initial:"marked",
    nodes:{
      marked:{ preview:{ layers:["ground","crowd","track","jumppit","wrestling","boxing","discus"] } },
      empty:{  preview:{ layers:["ground","track","jumppit","wrestling","boxing","discus"] } },   // no crowd
      "track-only":{ preview:{ layers:["ground","crowd","track"] } },                              // race focus
    },
    edges:[["marked","empty"],["marked","track-only"],["track-only","marked"]],
  },
  channels:["reveal","camera","light","crowdDensity"],

  preview:()=>({ layers:["ground","crowd","track","jumppit","wrestling","boxing","discus"], status:"MARKED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
