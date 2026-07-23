/* location.goat-island-harbor — a hidden deep natural harbor off the Cyclops shore.
   LOCATION asset (empty navigable set, no baked characters). Built in SOLID grays
   + hard contour into the offscreen ctx; the engine dotify POST pass supplies the
   halftone. Depth: bg channel + distant Cyclops shore -> mid wooded hunting slopes
   -> fg still harbor water + beach strand. Named zones/anchors for scene placement.
   Atlas: OD-B09-S04 — hidden deep harbor, beach camp, hunting slopes, freshwater
   spring, channel lookout, ship departure point. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  channelLevel:0.34,    // far channel-mouth waterline (fraction of H)
  strandLevel:0.60,     // beach strand crest (where sand meets the slopes)
  treesPerHead:8,       // deterministic tree tufts per wooded headland
  spring:true,          // freshwater spring on the strand
  lookout:true,         // channel lookout on the right headland facing the Cyclops shore
  cyclopsShore:true,    // far mainland peak across the channel mouth
};

/* deterministic tuft/rock positions (no Math.random — stable render) */
const frac = n => n - Math.floor(n);
const jitter = (i,k)=> frac(Math.sin((i+1)*12.9898 + k*78.233)*43758.5453);

/* a wooded slope mass: a filled hill silhouette + tree-tuft crown (hunting cover).
   side=-1 left, side=+1 right. Frames the cove and rises from the strand. */
function woodedHead(pen, g, W, H, side, baseTone, chan, strand){
  const strandY = H*strand;
  const inner = side<0 ? W*0.40 : W*0.60;         // where the mass meets open water
  const outer = side<0 ? 0 : W;                    // the frame edge
  const crestY = chan + H*0.02;                    // hills top out near the far waterline
  // hill body
  pen.paint(()=>{
    g.moveTo(outer, strandY);
    g.lineTo(outer, crestY + H*0.04);
    // rolling crest toward the water
    const N=6;
    for(let i=0;i<=N;i++){
      const t=i/N;
      const x = lerp(outer, inner, t);
      const y = crestY + H*0.04
              - H*0.10*(0.5+0.5*Math.sin(t*3.1 + (side<0?0:1.6)))
              + t*H*0.20;                          // dip down toward the cove mouth
      g.lineTo(x,y);
    }
    g.lineTo(inner, strandY);
    g.closePath();
  }, toneSolid(baseTone), 5);
  // tree-tuft crown along the ridge (hunting slopes cover)
  const tt = toneSolid(inkLevel(6));
  for(let t=0;t<params.treesPerHead;t++){
    const u = t/(params.treesPerHead-1);
    const jx = jitter(t, side<0?1:11), jy = jitter(t, side<0?5:15);
    const x = lerp(outer, inner, u*0.92) + (jx-0.5)*W*0.03;
    const ridge = crestY + H*0.04
                - H*0.10*(0.5+0.5*Math.sin(u*3.1 + (side<0?0:1.6)))
                + u*H*0.20;
    const th = H*(0.024 + jy*0.020);
    const tw = W*(0.013 + jx*0.008);
    pen.paint(()=>{ g.ellipse(x, ridge - th*0.4, tw, th, 0,0,7); }, tt, 3);
    pen.ink(()=>{ g.moveTo(x, ridge - th*0.1); g.lineTo(x, ridge + th*0.2); }, 2);
  }
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const chan   = H*params.channelLevel;   // far channel waterline
  const strandY= H*params.strandLevel;    // beach crest
  const layers = st.layers || ["sky","cyclops-shore","channel","slopes","headland","spring","strand","harbor","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest tone, above the far channel) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,chan);
    g.fillStyle = inkLevel(2);
    for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(W*(0.20+i*0.22), chan*(0.40+0.14*(i%2)), W*0.10, H*0.020, 0,0,7); g.fill(); }
  }

  // ---- FAR CYCLOPS SHORE across the channel mouth (mid tone + dark peak) ----
  if (has("cyclops-shore") && params.cyclopsShore){
    pen.paint(()=>{
      g.moveTo(0, chan);
      g.lineTo(0, chan-H*0.045);
      g.lineTo(W*0.20, chan-H*0.065);
      g.lineTo(W*0.36, chan-H*0.038);
      g.lineTo(W*0.62, chan-H*0.070);
      g.lineTo(W*0.82, chan-H*0.045);
      g.lineTo(W, chan-H*0.060);
      g.lineTo(W, chan);
      g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    // the Cyclops' mountain — the dark landmark on the far shore
    pen.paint(()=>{
      g.moveTo(W*0.42, chan-H*0.03);
      g.lineTo(W*0.52, chan-H*0.16);
      g.lineTo(W*0.62, chan-H*0.03);
      g.closePath();
    }, toneSolid(inkLevel(6)), 4);
  }

  // ---- FAR CHANNEL water (the strait; mid tone with ripple rules) ----
  if (has("channel")){
    g.fillStyle=inkLevel(3); g.fillRect(0,chan,W,strandY-chan);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.26;
    for(let j=1;j<=4;j++){ const y=chan+(strandY-chan)*(j/6); g.beginPath();
      for(let x=0;x<=W;x+=W*0.05){ const yy=y+Math.sin(x*0.03+j)*2; x===0?g.moveTo(x,yy):g.lineTo(x,yy); } g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- MID: two wooded HUNTING SLOPES framing the hidden cove (dark masses) ----
  if (has("slopes")){
    woodedHead(pen, g, W, H, -1, inkLevel(4), chan, params.strandLevel);   // left slope
    woodedHead(pen, g, W, H,  1, inkLevel(5), chan, params.strandLevel);   // right slope (also the lookout headland)
  }

  // ---- CHANNEL LOOKOUT marker on the right headland crest (facing the shore) ----
  if (has("headland") && params.lookout){
    const lx=W*0.895, ly=strandY-H*0.20;
    pen.paint(()=>{ g.rect(lx-W*0.010, ly-H*0.05, W*0.020, H*0.05); }, toneSolid(inkLevel(7)), 4); // cairn post
    pen.paint(()=>{ g.ellipse(lx, ly-H*0.055, W*0.026, H*0.016, 0,0,7); }, toneSolid(inkLevel(6)), 4);
  }

  // ---- BEACH STRAND (pale crescent of sand across the fg-mid; lightest so it reads) ----
  if (has("strand")){
    pen.paint(()=>{
      g.moveTo(0, strandY+H*0.005);
      g.quadraticCurveTo(W*0.5, strandY-H*0.035, W*1.0, strandY+H*0.005);
      g.lineTo(W*1.0, strandY+H*0.085);
      g.quadraticCurveTo(W*0.5, strandY+H*0.130, 0, strandY+H*0.085);
      g.closePath();
    }, toneSolid(inkLevel(2)), 4);

    // BEACH CAMP: two shelters + a fire ring on the strand (empty set — no figures)
    const camX=W*0.32, camY=strandY+H*0.052;
    pen.paint(()=>{ g.moveTo(camX-W*0.070, camY); g.lineTo(camX-W*0.025, camY-H*0.075); g.lineTo(camX+W*0.020, camY); g.closePath(); }, toneSolid(inkLevel(5)), 4);
    pen.ink(()=>{ g.moveTo(camX-W*0.025, camY-H*0.075); g.lineTo(camX-W*0.025, camY); }, 2);
    pen.paint(()=>{ g.moveTo(camX+W*0.028, camY-H*0.008); g.lineTo(camX+W*0.060, camY-H*0.058); g.lineTo(camX+W*0.092, camY-H*0.008); g.closePath(); }, toneSolid(inkLevel(4)), 4);
    // fire ring
    const fx=camX-W*0.015, fy=camY+H*0.034;
    pen.paint(()=>{ g.ellipse(fx, fy, W*0.032, H*0.013, 0,0,7); }, toneSolid(inkLevel(3)), 3);
    g.fillStyle=inkLevel(7); g.beginPath(); g.ellipse(fx, fy, W*0.015, H*0.006, 0,0,7); g.fill();
  }

  // ---- FRESHWATER SPRING (rock basin + runnel, left of camp) ----
  if (has("spring") && params.spring){
    const sx=W*0.09, sy=strandY+H*0.028;
    pen.paint(()=>{ g.ellipse(sx, sy, W*0.050, H*0.026, 0,0,7); }, toneSolid(inkLevel(5)), 4);
    g.fillStyle=inkLevel(2); g.beginPath(); g.ellipse(sx, sy-H*0.002, W*0.032, H*0.015, 0,0,7); g.fill();
    pen.ink(()=>{ g.moveTo(sx, sy+H*0.022); g.quadraticCurveTo(sx-W*0.012, sy+H*0.06, sx+W*0.010, sy+H*0.11); }, 3);
  }

  // ---- FG: still sheltered HARBOR water (mid-dark, calm; deepest of the water bands) ----
  if (has("harbor")){
    const hy = strandY+H*0.088;
    g.fillStyle=inkLevel(4); g.fillRect(0,hy,W,H-hy);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.20;
    for(let j=1;j<=4;j++){ const y=hy+(H-hy)*(j/5); g.beginPath();
      for(let x=0;x<=W;x+=W*0.06){ const yy=y+Math.sin(x*0.02+j*1.7)*1.6; x===0?g.moveTo(x,yy):g.lineTo(x,yy); } g.stroke(); }
    g.globalAlpha=1;

    // SHIP DEPARTURE POINT: mooring stake + beached prow at the near water (right-fg)
    const dx=W*0.70, dy=H*0.92;
    pen.paint(()=>{
      g.moveTo(dx-W*0.11, dy);
      g.quadraticCurveTo(dx, dy+H*0.035, dx+W*0.13, dy-H*0.010);
      g.quadraticCurveTo(dx+W*0.02, dy-H*0.055, dx-W*0.11, dy);
      g.closePath();
    }, toneSolid(inkLevel(7)), 5);
    // upturned prow post
    pen.ink(()=>{ g.moveTo(dx+W*0.13, dy-H*0.010); g.lineTo(dx+W*0.155, dy-H*0.060); }, 4);
    // mooring stake ashore
    pen.paint(()=>{ g.rect(dx-W*0.170, dy-H*0.060, W*0.013, H*0.060); }, toneSolid(inkLevel(7)), 4);
    pen.ink(()=>{ g.moveTo(dx-W*0.163, dy-H*0.055); g.quadraticCurveTo(dx-W*0.11, dy-H*0.02, dx-W*0.08, dy-H*0.005); }, 2);
  }
}

export const asset = {
  id:"location.goat-island-harbor",
  type:"LOCATION",
  name:"Goat Island Harbor",
  statusWord:"SHELTERED",
  scene:"OD-B09-S04",

  params,
  // back -> front draw order; scene state may pass a subset to reveal/occlude depth
  layers:["sky","cyclops-shore","channel","slopes","headland","spring","strand","harbor","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "camp:beach":{x:.30,y:.71},          // beach camp on the strand
    "spring:fresh":{x:.10,y:.66},        // freshwater spring pool
    "slopes:hunting":{x:.55,y:.50},      // wooded hunting slopes (mid band)
    "lookout:channel":{x:.895,y:.45},    // channel lookout crest facing the Cyclops shore
    "ship:departure":{x:.60,y:.90},      // ship departure / mooring point
    "shore:cyclops":{x:.50,y:.24},       // the far mainland across the channel
    "entrance:trail":{x:.02,y:.74},      // land trail up the slopes (left)
    "exit:channel":{x:.50,y:.34},        // seaward exit through the channel mouth
    "camera:wide":{x:.50,y:.50},
    "camera:lookout":{x:.85,y:.44},
    "camera:camp":{x:.30,y:.70},
  },
  // walkable ground regions (for scene placement / pathing)
  zones:{
    strand:{ x0:.02,y0:.66,x1:.80,y1:.74 },     // beachable shore
    slopes:{ x0:.06,y0:.36,x1:.94,y1:.64 },     // wooded hunting slopes
    harbor:{ x0:.00,y0:.72,x1:1.00,y1:1.00 },   // sheltered water
    channel:{ x0:.00,y0:.30,x1:1.00,y1:.66 },   // navigable channel
  },
  states:{
    initial:"dawn-landing",
    nodes:{
      "dawn-landing":{ preview:{ layers:["sky","cyclops-shore","channel","slopes","headland","spring","strand","harbor"] } },
      "camp-struck":{ preview:{ layers:["sky","cyclops-shore","channel","slopes","headland","spring","strand","harbor"] } },
      "departure":{ preview:{ layers:["sky","cyclops-shore","channel","slopes","headland","strand","harbor"] } },
      "empty-cove":{ preview:{ layers:["sky","cyclops-shore","channel","slopes","headland","strand","harbor"] } },
    },
    edges:[["dawn-landing","camp-struck"],["camp-struck","departure"],["dawn-landing","departure"],["departure","empty-cove"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({ layers:["sky","cyclops-shore","channel","slopes","headland","spring","strand","harbor"], status:"SHELTERED", progress:.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
