/* divine_fx.proteus-transformation-chain — the OLD MAN OF THE SEA writhing in the
   wrestler's grip, his body cycling through a chain of shapes while the HANDS that
   pin him never move. DIVINE_FX asset.
   Scene function (OD-B04-S05): an interruptible morph system. A central grappled
   form cycles lion -> serpent -> leopard -> boar -> water -> tree; the two grip /
   contact points stay pinned in screen space (marked with registration bullseyes)
   while the silhouette + body topology change underneath them.

   DIVINE_FX contract: SOURCE (the seized shape-shifter) -> FIELD (the morph energy
   ring around the grappled mass) -> TARGET (the next shape in the chain, ghosted in)
   -> TRANSFORM (the chain of six stages, current stage held big + the strip below)
   -> visible CONSEQUENCE (the grip never releases — the marks stay put).
   Animates over state.t: t sweeps the chain, i0 = current shape, the next shape
   ghosts in as the morph advances, the strip below highlights the active link.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const CHAIN = ["lion","serpent","leopard","boar","water","tree"];
const N = CHAIN.length;

const params = {
  center:{ x:0.50, y:0.35 },   // where the grappled mass sits (source)
  gripA:{  x:0.415, y:0.285 },  // upper contact / grip point (pinned, marked)
  gripB:{  x:0.560, y:0.430 },  // lower contact / grip point (pinned, marked)
  scale:0.23,                   // master mass size as fraction of W
  stripTop:0.68,                // divider between stage + the chain strip
  ghost:true,                   // ghost the next shape while morphing
};

/* ============================================================
   SHAPE LIBRARY — each drawn centered at (cx,cy) within a box of half-extent u,
   in a single solid fill level + hard contour. Same functions serve the big
   central mass (detail=true) and the small strip icons (detail=false).
   Every land-shape's mass covers the pinned grip zone near the centre.
   ============================================================ */
function quadBody(g,pen,cx,cy,u,tone,lw,ry){
  ry=ry||0.30;
  pen.paint(()=>{ g.ellipse(cx, cy-0.02*u, 0.60*u, ry*u, 0, 0, TAU); }, tone, lw);
  const legs=[-0.44,-0.17,0.17,0.44], lw2=0.12*u;
  for(const f of legs) pen.paint(()=>{ g.rect(cx+f*u-lw2/2, cy+ (ry*0.55)*u, lw2, 0.46*u); }, tone, lw);
}
function drawLion(g,pen,cx,cy,u,lvl,lw,detail){
  const tone=toneSolid(inkLevel(lvl));
  // tail arcing UP and back off the rump, ending in a flicked tuft
  pen.limb(()=>{ g.moveTo(cx+0.54*u,cy+0.02*u); g.quadraticCurveTo(cx+0.86*u,cy-0.06*u,cx+0.80*u,cy-0.36*u); }, tone, 0.045*u);
  pen.paint(()=>{ g.arc(cx+0.80*u,cy-0.40*u,0.075*u,0,TAU); }, tone, lw);
  quadBody(g,pen,cx,cy,u,tone,lw,0.27);
  // mane ring (broad) behind head
  const hx=cx-0.62*u, hy=cy-0.06*u;
  pen.paint(()=>{ g.arc(hx,hy,0.34*u,0,TAU); }, tone, lw);
  // mane spikes
  g.strokeStyle=INK; g.lineWidth=Math.max(2,0.03*u); g.lineCap="round";
  for(let k=0;k<11;k++){ const a=k/11*TAU; g.beginPath(); g.moveTo(hx+Math.cos(a)*0.30*u,hy+Math.sin(a)*0.30*u); g.lineTo(hx+Math.cos(a)*0.42*u,hy+Math.sin(a)*0.42*u); g.stroke(); }
  // head
  pen.paint(()=>{ g.arc(hx,hy,0.22*u,0,TAU); }, tone, lw);
  // muzzle
  pen.paint(()=>{ g.ellipse(hx-0.18*u,hy+0.06*u,0.11*u,0.08*u,0,0,TAU); }, tone, lw);
  if(detail){ g.fillStyle=INK; g.beginPath(); g.arc(hx-0.05*u,hy-0.05*u,0.03*u,0,TAU); g.fill(); }
}
function drawLeopard(g,pen,cx,cy,u,lvl,lw,detail){
  const tone=toneSolid(inkLevel(lvl));
  // long sinuous tail up-right
  pen.limb(()=>{ g.moveTo(cx+0.55*u,cy-0.04*u); g.quadraticCurveTo(cx+0.95*u,cy-0.2*u,cx+0.8*u,cy-0.5*u); }, tone, 0.055*u);
  quadBody(g,pen,cx,cy,u,tone,lw,0.24);          // sleeker than the lion
  // small head + pricked ears, low neck
  const hx=cx-0.6*u, hy=cy-0.02*u;
  pen.paint(()=>{ g.moveTo(hx-0.02*u,hy-0.14*u); g.lineTo(hx-0.14*u,hy-0.26*u); g.lineTo(hx-0.16*u,hy-0.1*u); g.closePath(); }, tone, lw);
  pen.paint(()=>{ g.moveTo(hx+0.12*u,hy-0.16*u); g.lineTo(hx+0.06*u,hy-0.28*u); g.lineTo(hx+0.18*u,hy-0.18*u); g.closePath(); }, tone, lw);
  pen.paint(()=>{ g.arc(hx,hy,0.17*u,0,TAU); }, tone, lw);
  pen.paint(()=>{ g.ellipse(hx-0.15*u,hy+0.03*u,0.08*u,0.06*u,0,0,TAU); }, tone, lw);
  // rosette spots (ring marks — identity, not shading)
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,0.02*u);
  for(const s of [[-0.1,-0.08],[0.14,-0.02],[0.02,0.06],[0.3,-0.05]]){
    g.beginPath(); g.arc(cx+s[0]*u,cy+s[1]*u,0.06*u,0,TAU); g.stroke();
  }
}
function drawBoar(g,pen,cx,cy,u,lvl,lw,detail){
  const tone=toneSolid(inkLevel(lvl));
  // bulky humped body
  pen.paint(()=>{
    g.moveTo(cx-0.5*u,cy+0.12*u);
    g.quadraticCurveTo(cx-0.35*u,cy-0.34*u,cx+0.05*u,cy-0.30*u);   // raised shoulder hump
    g.quadraticCurveTo(cx+0.5*u,cy-0.24*u,cx+0.56*u,cy+0.06*u);
    g.quadraticCurveTo(cx+0.5*u,cy+0.26*u,cx+0.1*u,cy+0.26*u);
    g.quadraticCurveTo(cx-0.3*u,cy+0.28*u,cx-0.5*u,cy+0.12*u);
    g.closePath();
  }, tone, lw);
  // short stubby legs
  const legs=[-0.34,-0.08,0.2,0.42], lw2=0.11*u;
  for(const f of legs) pen.paint(()=>{ g.rect(cx+f*u-lw2/2, cy+0.2*u, lw2, 0.30*u); }, tone, lw);
  // snout wedge pointing down-left with tusks
  const sx=cx-0.52*u, sy=cy+0.02*u;
  pen.paint(()=>{ g.moveTo(sx+0.12*u,sy-0.12*u); g.lineTo(sx-0.16*u,sy+0.04*u); g.lineTo(sx-0.14*u,sy+0.16*u); g.lineTo(sx+0.12*u,sy+0.14*u); g.closePath(); }, tone, lw);
  g.strokeStyle=INK; g.lineWidth=Math.max(2,0.03*u); g.lineCap="round";
  g.beginPath(); g.moveTo(sx-0.1*u,sy+0.1*u); g.quadraticCurveTo(sx-0.22*u,sy+0.02*u,sx-0.16*u,sy-0.08*u); g.stroke();  // tusk
  g.beginPath(); g.moveTo(sx-0.02*u,sy+0.12*u); g.quadraticCurveTo(sx-0.12*u,sy+0.04*u,sx-0.08*u,sy-0.04*u); g.stroke();
  // dorsal bristles
  for(let k=0;k<7;k++){ const f=-0.32+k*0.09; g.beginPath(); g.moveTo(cx+f*u,cy-0.30*u+0.05*u*Math.abs(k-3)); g.lineTo(cx+f*u,cy-0.44*u+0.05*u*Math.abs(k-3)); g.stroke(); }
}
function drawSerpent(g,pen,cx,cy,u,lvl,lw,detail){
  const tone=toneSolid(inkLevel(lvl));
  // a fat tapering S-coil, no legs — head to the left
  const pts=[[0.62,0.34],[0.34,0.30],[0.16,0.06],[0.30,-0.16],[0.10,-0.30],[-0.20,-0.24],[-0.34,-0.02],[-0.20,0.2]];
  for(let i=0;i<pts.length-1;i++){
    const w=lerp(0.20*u,0.05*u,i/(pts.length-2));   // thick body -> thin tail... reversed so head end is thick
    pen.limb(()=>{ g.moveTo(cx+pts[i][0]*u,cy+pts[i][1]*u); g.lineTo(cx+pts[i+1][0]*u,cy+pts[i+1][1]*u); }, tone, w);
  }
  // head at the thick end (left/last point)
  const hx=cx-0.22*u, hy=cy+0.2*u;
  pen.paint(()=>{ g.ellipse(hx,hy,0.15*u,0.10*u,0.5,0,TAU); }, tone, lw);
  // forked tongue
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,0.02*u); g.lineCap="round";
  g.beginPath(); g.moveTo(hx-0.1*u,hy+0.06*u); g.lineTo(hx-0.22*u,hy+0.12*u);
  g.moveTo(hx-0.22*u,hy+0.12*u); g.lineTo(hx-0.3*u,hy+0.09*u);
  g.moveTo(hx-0.22*u,hy+0.12*u); g.lineTo(hx-0.3*u,hy+0.16*u); g.stroke();
  if(detail){ g.fillStyle=inkLevel(0); g.beginPath(); g.arc(hx-0.04*u,hy-0.02*u,0.025*u,0,TAU); g.fill(); }
}
function drawWater(g,pen,cx,cy,u,lvl,lw,detail){
  const tone=toneSolid(inkLevel(lvl));
  // a rising fluid column that curls into a crest at the top
  pen.paint(()=>{
    g.moveTo(cx-0.30*u,cy+0.5*u);
    g.quadraticCurveTo(cx-0.42*u,cy+0.05*u,cx-0.24*u,cy-0.24*u);
    g.quadraticCurveTo(cx-0.10*u,cy-0.5*u,cx+0.18*u,cy-0.42*u);
    g.quadraticCurveTo(cx+0.02*u,cy-0.30*u,cx+0.12*u,cy-0.16*u);   // curling crest
    g.quadraticCurveTo(cx+0.34*u,cy-0.02*u,cx+0.28*u,cy+0.26*u);
    g.quadraticCurveTo(cx+0.22*u,cy+0.5*u,cx-0.02*u,cy+0.5*u);
    g.closePath();
  }, tone, lw);
  // flung droplets
  for(const d of [[0.30,-0.5,0.06],[0.42,-0.34,0.045],[-0.34,-0.34,0.05]]) pen.paint(()=>{ g.arc(cx+d[0]*u,cy+d[1]*u,d[2]*u,0,TAU); }, tone, lw);
  // wave seams inside
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,0.02*u); g.lineCap="round";
  for(let k=0;k<3;k++){ const yy=cy+(-0.1+k*0.16)*u; g.beginPath(); g.moveTo(cx-0.2*u,yy); g.quadraticCurveTo(cx,yy-0.06*u,cx+0.2*u,yy); g.stroke(); }
}
function drawTree(g,pen,cx,cy,u,lvl,lw,detail){
  const tone=toneSolid(inkLevel(lvl));
  // trunk
  pen.paint(()=>{ g.moveTo(cx-0.09*u,cy+0.5*u); g.lineTo(cx-0.06*u,cy-0.16*u); g.lineTo(cx+0.06*u,cy-0.16*u); g.lineTo(cx+0.09*u,cy+0.5*u); g.closePath(); }, tone, lw);
  // roots
  g.strokeStyle=INK; g.lineWidth=Math.max(2,0.03*u); g.lineCap="round";
  g.beginPath(); g.moveTo(cx-0.06*u,cy+0.46*u); g.lineTo(cx-0.24*u,cy+0.54*u);
  g.moveTo(cx+0.06*u,cy+0.46*u); g.lineTo(cx+0.24*u,cy+0.54*u); g.stroke();
  // limbs
  pen.limb(()=>{ g.moveTo(cx,cy-0.02*u); g.lineTo(cx-0.26*u,cy-0.24*u); }, tone, 0.05*u);
  pen.limb(()=>{ g.moveTo(cx,cy-0.04*u); g.lineTo(cx+0.28*u,cy-0.26*u); }, tone, 0.05*u);
  // canopy — overlapping crowns
  for(const c of [[0,-0.34,0.24],[-0.22,-0.24,0.17],[0.22,-0.26,0.18],[-0.06,-0.5,0.16],[0.12,-0.46,0.15]])
    pen.paint(()=>{ g.arc(cx+c[0]*u,cy+c[1]*u,c[2]*u,0,TAU); }, tone, lw);
}
const SHAPES = { lion:drawLion, serpent:drawSerpent, leopard:drawLeopard, boar:drawBoar, water:drawWater, tree:drawTree };
function drawShape(name,g,pen,cx,cy,u,lvl,lw,detail){ (SHAPES[name]||drawLion)(g,pen,cx,cy,u,lvl,lw,detail); }

/* ---- the pinned GRIP / contact registration mark: a bullseye with a white halo
   so it survives the halftone and reads as a fixed contact the morph can't shake. */
function drawGrip(g,cx,cy,r){
  g.fillStyle=inkLevel(0); g.beginPath(); g.arc(cx,cy,r*1.35,0,TAU); g.fill();     // halo
  g.strokeStyle=INK; g.lineWidth=r*0.5; g.beginPath(); g.arc(cx,cy,r,0,TAU); g.stroke();
  g.lineWidth=r*0.28; g.beginPath();
  g.moveTo(cx-r*1.6,cy); g.lineTo(cx+r*1.6,cy);
  g.moveTo(cx,cy-r*1.6); g.lineTo(cx,cy+r*1.6); g.stroke();
  g.fillStyle=INK; g.beginPath(); g.arc(cx,cy,r*0.24,0,TAU); g.fill();
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=clamp01(st.t ?? 0.0);
  const layers=st.layers || ["field","ghost","form","grips","strip"];
  const has=l=>layers.includes(l);

  const cx=W*params.center.x, cy=H*params.center.y, u=W*params.scale;
  const idxf=t*(N-1), i0=Math.min(N-1,Math.floor(idxf+1e-6)), i1=Math.min(N-1,i0+1);
  const frac=clamp01(idxf-i0);

  // ---- open field behind the stage (light) + a stage baseline ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,H*params.stripTop);
  const baseY=cy+u*0.72;
  g.save(); g.globalAlpha=0.5; g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx,baseY,u*0.8,u*0.14,0,0,TAU); g.fill(); g.restore();

  // ---- FIELD: the morph energy ring around the grappled mass ----
  if (has("field")){
    g.save(); g.strokeStyle=inkLevel(3); g.lineCap="round";
    for(let k=0;k<2;k++){
      const rr=u*(1.05+k*0.16);
      g.lineWidth=Math.max(1.5,W*0.005); g.globalAlpha=0.5-k*0.16;
      g.setLineDash([u*0.13, u*0.10]); g.lineDashOffset=(frac*u*1.2+k*7);
      g.beginPath(); g.ellipse(cx,cy,rr,rr*0.92,0,0,TAU); g.stroke();
    }
    g.setLineDash([]); g.globalAlpha=1; g.restore();
  }

  // ---- TARGET: the next shape in the chain ghosting in as the morph advances.
  // Kept faint so the current shape stays legible under the pinned grips. ----
  if (has("ghost") && params.ghost && frac>0.35 && i1!==i0){
    g.save(); g.globalAlpha=clamp01((frac-0.35)*0.5);
    drawShape(CHAIN[i1],g,pen,cx,cy,u,2,2.5,false);
    g.restore();
  }

  // ---- current SOURCE shape, held big ----
  if (has("form")) drawShape(CHAIN[i0],g,pen,cx,cy,u,5,Math.max(3,W*0.006),true);

  // ---- the pinned GRIP marks — same screen position for every shape ----
  if (has("grips")){
    drawGrip(g, W*params.gripA.x, H*params.gripA.y, u*0.10);
    drawGrip(g, W*params.gripB.x, H*params.gripB.y, u*0.10);
    // a thin tie-line between the two contacts (the wrestler's hold)
    g.strokeStyle=INK; g.lineWidth=Math.max(1.5,W*0.004); g.setLineDash([u*0.05,u*0.05]);
    g.beginPath(); g.moveTo(W*params.gripA.x,H*params.gripA.y); g.lineTo(W*params.gripB.x,H*params.gripB.y); g.stroke();
    g.setLineDash([]);
  }

  // ---- TRANSFORM CHAIN: the six morph stages as a strip, active link highlighted ----
  if (has("strip")){
    const y0=H*params.stripTop, y1=H*0.965, midY=(y0+y1)/2;
    pen.ink(()=>{ g.moveTo(W*0.04,y0); g.lineTo(W*0.96,y0); }, 3);   // divider
    const x0=0.06, x1=0.94, span=x1-x0;
    const cellW=span/N*W, iu=cellW*0.36;
    for(let i=0;i<N;i++){
      const ccx=W*(x0+ (i+0.5)*span/N);
      const active=(i===i0);
      // cell frame
      const fw=cellW*0.82, fh=(y1-y0)*0.82;
      pen.paint(()=>{ g.rect(ccx-fw/2, midY-fh/2, fw, fh); }, toneSolid(inkLevel(active?2:1)), active?4:2);
      // icon (centred in the cell)
      drawShape(CHAIN[i],g,pen,ccx,midY,iu,active?6:4,active?3:2,false);
      // arrow to next
      if (i<N-1){
        const ax=W*(x0+ (i+1)*span/N)-cellW*0.09;
        g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.005); g.lineCap="round";
        g.beginPath(); g.moveTo(ax-cellW*0.05,midY); g.lineTo(ax+cellW*0.02,midY);
        g.moveTo(ax-cellW*0.005,midY-cellW*0.05); g.lineTo(ax+cellW*0.02,midY); g.lineTo(ax-cellW*0.005,midY+cellW*0.05); g.stroke();
      }
    }
  }

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.proteus-transformation-chain",
  type:"DIVINE_FX",
  name:"Proteus transformation chain",
  statusWord:"WRITHING",
  scene:"OD-B04-S05",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["field","ghost","form","grips","strip"],
  // normalized 0..1 source/target/field/contact/camera anchors
  anchors:{
    "source:mass":{     x:0.50, y:0.35 },   // the grappled shape-shifter (source)
    "grip:upper":{      x:0.415,y:0.285 },  // pinned contact point A (held constant)
    "grip:lower":{      x:0.560,y:0.430 },  // pinned contact point B (held constant)
    "field:ring":{      x:0.50, y:0.35 },   // morph energy field centre
    "chain:lion":{      x:0.13, y:0.83 },
    "chain:serpent":{   x:0.27, y:0.83 },
    "chain:leopard":{   x:0.41, y:0.83 },
    "chain:boar":{      x:0.55, y:0.83 },
    "chain:water":{     x:0.69, y:0.83 },
    "chain:tree":{      x:0.83, y:0.83 },
    "camera:wide":{     x:0.50, y:0.50 },
  },
  // the grappling stage + the chain-strip diagram band below it
  zones:{ stage:{ x0:0.10,y0:0.06,x1:0.90,y1:0.66 },
          chain:{ x0:0.04,y0:0.68,x1:0.96,y1:0.97 } },
  // DIVINE_FX transformation states: one node per link in the chain (interruptible —
  // the runtime can hold, advance, or reverse t; the grip never releases)
  states:{
    initial:"lion",
    nodes:{
      lion:{    preview:{ t:0.00, status:"LION",    progress:0.02 } },
      serpent:{ preview:{ t:0.20, status:"SERPENT", progress:0.20 } },
      leopard:{ preview:{ t:0.40, status:"LEOPARD", progress:0.40 } },
      boar:{    preview:{ t:0.60, status:"BOAR",    progress:0.60 } },
      water:{   preview:{ t:0.80, status:"WATER",   progress:0.80 } },
      tree:{    preview:{ t:1.00, status:"TREE",    progress:1.00 } },
    },
    edges:[["lion","serpent"],["serpent","leopard"],["leopard","boar"],
           ["boar","water"],["water","tree"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","morph","grip"],

  // neutral preview: mid-morph — the lion shape held big in the grip, the serpent
  // ghosting in, both grip marks pinned, the full chain strip below.
  preview:()=>({ t:0.06, status:"WRITHING", progress:0.12,
                 layers:["field","ghost","form","grips","strip"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
