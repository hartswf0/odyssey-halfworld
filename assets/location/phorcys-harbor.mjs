/* location.phorcys-harbor — sheltered Ithacan inlet of Phorcys.
   LOCATION asset. Empty navigable set: twin protecting headlands, a great
   olive tree, a sacred nymph-cave in the cliff, a sand landing, and an inland
   path. Drawn in SOLID grays + hard contour into the offscreen ctx (the engine
   dotify pass supplies the halftone). Depth: fg beach / mid inlet / bg
   headlands. Do NOT bake characters in.
   Atlas: OD-B13-S01 — where the Phaeacians set the sleeping Odysseus ashore. */
import { makePen, toneSolid, inkLevel, INK, clamp } from "/engine/halfworld-engine.mjs";

const params = {
  seaLevel:0.60,       // waterline as fraction of H (bg headlands meet sea here)
  beachLevel:0.80,     // top of the foreground sand landing
  headlandGap:0.30,    // normalized width of the sheltering mouth between headlands
  oliveTree:true,
  nymphCave:true,
  inlandPath:true,
};

/* deterministic scatter helper (stones on the beach, olive foliage clumps) */
function h(n){ const s=Math.sin(n*127.1+311.7)*43758.5453; return s-Math.floor(s); }

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const sea   = H*params.seaLevel;
  const beach = H*params.beachLevel;
  const layers = st.layers || ["sky","headlands","cliff","cave","sea","beach","olive","path","stones","anchors"];
  const has = l => layers.includes(l);

  // ---- SKY (lightest tone -> few dots) ----
  if (has("sky")){
    g.fillStyle = inkLevel(1); g.fillRect(0,0,W,sea);
  }

  // ---- BACKGROUND: twin protecting headlands (mid tone, receding) ----
  if (has("headlands")){
    const gap = params.headlandGap;
    const mouthL = W*(0.5-gap/2), mouthR = W*(0.5+gap/2);
    // left headland — rounded promontory reaching toward the mouth
    pen.paint(()=>{
      g.moveTo(0, sea);
      g.lineTo(0, sea-H*0.24);
      g.quadraticCurveTo(W*0.14, sea-H*0.30, W*0.26, sea-H*0.20);
      g.quadraticCurveTo(mouthL, sea-H*0.10, mouthL, sea);
      g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // right headland — the cliff side, taller, holds the nymph cave
    pen.paint(()=>{
      g.moveTo(W, sea);
      g.lineTo(W, sea-H*0.30);
      g.quadraticCurveTo(W*0.86, sea-H*0.36, W*0.74, sea-H*0.24);
      g.quadraticCurveTo(mouthR, sea-H*0.12, mouthR, sea);
      g.closePath();
    }, toneSolid(inkLevel(4)), 5);
    // ridge seams for rock strata
    pen.seam(()=>{ g.moveTo(W*0.04, sea-H*0.16); g.quadraticCurveTo(W*0.16, sea-H*0.22, W*0.24, sea-H*0.14); }, 2.5);
    pen.seam(()=>{ g.moveTo(W*0.78, sea-H*0.20); g.quadraticCurveTo(W*0.88, sea-H*0.26, W*0.96, sea-H*0.22); }, 2.5);
  }

  // ---- CLIFF face on the right headland (mid tone, frames the cave) ----
  if (has("cliff")){
    pen.paint(()=>{
      g.moveTo(W*0.70, sea);
      g.lineTo(W*0.70, sea-H*0.22);
      g.quadraticCurveTo(W*0.80, sea-H*0.26, W*0.92, sea-H*0.20);
      g.lineTo(W*0.92, sea);
      g.closePath();
    }, toneSolid(inkLevel(5)), 5);
    // rock strata seams across the face
    pen.seam(()=>{ g.moveTo(W*0.70, sea-H*0.14); g.quadraticCurveTo(W*0.81, sea-H*0.18, W*0.92, sea-H*0.13); }, 2.2);
    pen.seam(()=>{ g.moveTo(W*0.70, sea-H*0.07); g.lineTo(W*0.92, sea-H*0.06); }, 2.2);
  }

  // ---- sacred NYMPH-CAVE (darkest hollow arch cut into the cliff) ----
  if (has("cave") && params.nymphCave){
    const cx=W*0.81, cyBase=sea, cw=W*0.058, chh=H*0.14;
    // cave mouth: darkest ink (a true hole), arched top, base at the shelf
    pen.paint(()=>{
      g.moveTo(cx-cw, cyBase);
      g.lineTo(cx-cw, cyBase-chh*0.5);
      g.quadraticCurveTo(cx-cw, cyBase-chh, cx, cyBase-chh);
      g.quadraticCurveTo(cx+cw, cyBase-chh, cx+cw, cyBase-chh*0.5);
      g.lineTo(cx+cw, cyBase);
      g.closePath();
    }, toneSolid(inkLevel(7)), 4);
  }

  // ---- SEA: the mid inlet water (light-mid tone with a few swell lines) ----
  if (has("sea")){
    g.fillStyle = inkLevel(3); g.fillRect(0, sea, W, beach-sea);
    // waterline
    pen.ink(()=>{ g.moveTo(0,sea); g.lineTo(W,sea); }, 3);
    // gentle swell rules receding to the mouth
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let j=1;j<=4;j++){
      const y=sea+(beach-sea)*(j/5);
      g.beginPath();
      for(let x=0;x<=W;x+=W/24){
        const yy=y+Math.sin(x*0.03 + j*1.3)*(2.2+j*0.6);
        if(x===0) g.moveTo(x,yy); else g.lineTo(x,yy);
      }
      g.stroke();
    }
    g.globalAlpha=1;
  }

  // ---- FOREGROUND: sand landing (lightest below the sea so it reads as ground) ----
  if (has("beach")){
    // sand shelf, curving shoreline
    pen.paint(()=>{
      g.moveTo(0, beach);
      g.quadraticCurveTo(W*0.30, beach-H*0.03, W*0.55, beach+H*0.01);
      g.quadraticCurveTo(W*0.80, beach+H*0.03, W, beach-H*0.01);
      g.lineTo(W, H); g.lineTo(0, H); g.closePath();
    }, toneSolid(inkLevel(2)), 4);
    // wet-sand tide seam
    pen.seam(()=>{
      g.moveTo(0, beach+H*0.02);
      g.quadraticCurveTo(W*0.40, beach+H*0.05, W, beach+H*0.02);
    }, 2);
  }

  // ---- great OLIVE TREE at the head of the landing (a landmark) ----
  if (has("olive") && params.oliveTree){
    const tx=W*0.37, groundY=beach+H*0.03;
    const trunkH=H*0.16;
    const forkY=groundY-trunkH;                  // where the crown begins
    // trunk (dark, slightly leaning, gnarled)
    pen.paint(()=>{
      g.moveTo(tx-W*0.016, groundY);
      g.quadraticCurveTo(tx-W*0.006, forkY+trunkH*0.3, tx-W*0.022, forkY);
      g.lineTo(tx+W*0.010, forkY);
      g.quadraticCurveTo(tx+W*0.014, forkY+trunkH*0.3, tx+W*0.018, groundY);
      g.closePath();
    }, toneSolid(inkLevel(6)), 4);
    // boughs splitting up into the crown
    pen.ink(()=>{ g.moveTo(tx-W*0.012, forkY+trunkH*0.1); g.lineTo(tx-W*0.055, forkY-H*0.05); }, 3);
    pen.ink(()=>{ g.moveTo(tx+W*0.008, forkY+trunkH*0.1); g.lineTo(tx+W*0.052, forkY-H*0.05); }, 3);
    // canopy: one rounded olive crown with a few symmetric lobes (mid tone)
    const cCx=tx, cCy=forkY-H*0.055, cR=W*0.085;
    pen.paint(()=>{ g.ellipse(cCx, cCy, cR, cR*0.85, 0, 0, 7); }, toneSolid(inkLevel(4)), 5);
    const lobes=[[-0.9,0.05],[0.9,0.05],[-0.45,-0.75],[0.45,-0.75],[0,-0.9]];
    for(const [lx,ly] of lobes){
      pen.paint(()=>{ g.ellipse(cCx+lx*cR, cCy+ly*cR*0.85, cR*0.5, cR*0.42, 0, 0, 7); }, toneSolid(inkLevel(4)), 4);
    }
  }

  // ---- INLAND PATH climbing away between beach and left headland ----
  if (has("path") && params.inlandPath){
    // tapering track that recedes up toward the tree line / interior
    pen.paint(()=>{
      g.moveTo(W*0.30, H);
      g.lineTo(W*0.40, H);
      g.quadraticCurveTo(W*0.42, beach+H*0.02, W*0.36, beach-H*0.005);
      g.lineTo(W*0.31, beach-H*0.005);
      g.quadraticCurveTo(W*0.27, beach+H*0.02, W*0.30, H);
      g.closePath();
    }, toneSolid(inkLevel(3)), 3);
    // path center seam
    pen.seam(()=>{ g.moveTo(W*0.35, H); g.lineTo(W*0.335, beach); }, 2);
  }

  // ---- scattered STONES on the sand landing (foreground detail) ----
  if (has("stones")){
    for(let i=0;i<9;i++){
      const sx=W*(0.10+h(i*1.7)*0.82);
      const sy=beach+H*(0.07+h(i*4.3)*0.10);
      const sr=W*(0.010+h(i*9.1)*0.014);
      pen.paint(()=>{ g.ellipse(sx, sy, sr, sr*0.7, 0, 0, 7); }, toneSolid(inkLevel(5)), 3);
    }
  }
}

export const asset = {
  id:"location.phorcys-harbor",
  type:"LOCATION",
  name:"Phorcys Harbor",
  statusWord:"SHELTERED",
  scene:"OD-B13-S01",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["sky","headlands","cliff","cave","sea","beach","olive","path","stones","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "landing:sand":{x:.55,y:.88},          // where a boat sets a sleeper ashore
    "threshold:nymph-cave":{x:.81,y:.72},  // sacred cave mouth at the cliff base
    "landmark:olive-tree":{x:.37,y:.83},   // the great olive at the head of the bay
    "headland:left":{x:.14,y:.56},
    "headland:right":{x:.86,y:.54},
    "mouth:inlet":{x:.50,y:.60},           // the sheltered opening between headlands
    "anchorage:deep":{x:.50,y:.66},        // where a ship rides at anchor
    "exit:inland-path":{x:.34,y:.98},      // the path up into Ithaca's interior
    "camera:wide":{x:.50,y:.50},
    "camera:cave":{x:.78,y:.66},
  },
  // walkable ground region (for scene placement / pathing) + water zone
  zones:{
    beach:{ x0:.04,y0:.82,x1:.96,y1:.99 },
    water:{ x0:.06,y0:.60,x1:.94,y1:.80 },
    path:{ x0:.28,y0:.80,x1:.42,y1:.99 },
  },
  states:{
    initial:"empty",
    nodes:{
      empty:{ preview:{ layers:["sky","headlands","cliff","cave","sea","beach","olive","path","stones"] } },
      "landing-ready":{ preview:{ layers:["sky","headlands","cliff","cave","sea","beach","olive","path","stones"] } },
      "cave-focus":{ preview:{ layers:["sky","headlands","cliff","cave","sea","beach"] } },
    },
    edges:[["empty","landing-ready"],["landing-ready","cave-focus"],["cave-focus","empty"]],
  },
  channels:["reveal","camera","tide","light"],

  preview:()=>({
    layers:["sky","headlands","cliff","cave","sea","beach","olive","path","stones"],
    status:"SHELTERED", progress:.18,
  }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
