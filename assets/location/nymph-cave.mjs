/* location.nymph-cave — sacred dual-entrance cavern of the Naiad nymphs.
   LOCATION asset. Empty navigable set drawn in SOLID grays + hard contour into
   the offscreen ctx (engine dotify pass supplies the halftone). Declares depth
   layers, walkable ground, two thresholds, a treasure cache alcove, a sealable
   door-stone slot, and placement/camera anchors. No baked characters.
   Atlas: OD-B13-S04 — storage recesses, stone weaving-benches, rows of water
   jars, treasure cache, sealable door. */
import { makePen, toneSolid, inkLevel, INK, clamp } from "../../engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.70,     // cave floor horizon as fraction of H
  jars:5,              // water jars in the mid row
  recesses:3,          // storage recesses cut into the back wall
  benches:2,           // stone weaving-benches on the floor
  cache:true,          // treasure cache alcove
  doorStone:true,      // sealable door-stone slot at the second (north) mouth
};

/* round-topped cavern mouth path centered at (cx,groundY) */
function mouthPath(g, cx, groundY, w, h){
  g.moveTo(cx-w/2, groundY);
  g.lineTo(cx-w/2, groundY-h*0.55);
  g.quadraticCurveTo(cx-w*0.42, groundY-h, cx, groundY-h);
  g.quadraticCurveTo(cx+w*0.42, groundY-h, cx+w/2, groundY-h*0.55);
  g.lineTo(cx+w/2, groundY);
}

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const layers = st.layers || ["cavern","backwall","recesses","thresholds","doorstone","jars","benches","cache","floor","anchors"];
  const has = l => layers.includes(l);
  const sealed = st.sealed ?? (params.doorStone && !has("doorstone-open"));

  // ---- CAVERN VAULT: irregular rock ceiling arching over the whole set ----
  if (has("cavern")){
    // sky/gloom above the vault (lightest -> few dots)
    g.fillStyle=inkLevel(1); g.fillRect(0,0,W,horizon);
    // ragged stone vault as a filled band with a lumpy lower edge (mid tone)
    pen.paint(()=>{
      g.moveTo(0,0); g.lineTo(W,0); g.lineTo(W,H*0.19);
      const bumps=7;
      for(let i=bumps;i>=0;i--){
        const x=W*(i/bumps);
        const y=H*(0.15+0.05*Math.sin(i*1.7)+0.025*Math.cos(i*2.3));
        g.lineTo(x,y);
      }
      g.lineTo(0,H*0.19); g.closePath();
    }, toneSolid(inkLevel(3)), 5);
    // interior rock ridges so the ceiling reads as stone, not a slab
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.45;
    for(let r=0;r<4;r++){ const y=H*(0.04+r*0.035);
      g.beginPath(); g.moveTo(0,y);
      for(let x=0;x<=W;x+=W*0.12){ g.lineTo(x, y+H*0.012*Math.sin(x*0.03+r)); } g.stroke(); }
    g.globalAlpha=1;
    // a couple of stalactite nubs hanging from the vault edge
    g.fillStyle=inkLevel(5);
    for(const sx of [W*0.30,W*0.58,W*0.80]){
      g.beginPath(); g.moveTo(sx-W*0.018,H*0.15); g.lineTo(sx+W*0.018,H*0.15);
      g.lineTo(sx,H*0.15+H*0.045); g.closePath(); g.fill();
    }
  }

  // ---- BACK WALL of the cavern (mid tone, between vault and floor) ----
  if (has("backwall")){
    pen.paint(()=>{ g.rect(0, H*0.17, W, horizon-H*0.17); }, toneSolid(inkLevel(2)), 4);
  }

  // ---- STORAGE RECESSES cut into the back wall (dark rectangular hollows) ----
  if (has("recesses")){
    const n=params.recesses;
    for(let i=0;i<n;i++){
      const rx=W*(0.14+i*0.19), ry=horizon-H*0.30;
      const rw=W*0.11, rh=H*0.17;
      // hollow (dark)
      pen.paint(()=>{ g.rect(rx, ry, rw, rh); }, toneSolid(inkLevel(6)), 4);
      // stone lip / shelf line
      pen.ink(()=>{ g.moveTo(rx,ry+rh*0.5); g.lineTo(rx+rw,ry+rh*0.5); }, 3);
      // a stored bundle sitting on the lower shelf
      pen.paint(()=>{ g.rect(rx+rw*0.18, ry+rh*0.5-H*0.045, rw*0.64, H*0.045); }, toneSolid(inkLevel(4)),3);
    }
  }

  // ---- TWO CAVERN-MOUTH THRESHOLDS (dual entrance) ----
  if (has("thresholds")){
    // south mouth (mortals' way) — left, open, brightest opening
    const sx=W*0.10, sw=W*0.17, sh=H*0.34;
    pen.paint(()=>{ mouthPath(g,sx,horizon,sw,sh); }, toneSolid(inkLevel(2)), 5);
    pen.ink(()=>{ mouthPath(g,sx,horizon,sw,sh); }, 4);

    // north mouth (gods' way) — right, framed for the door-stone
    const nx=W*0.90, nw=W*0.17, nh=H*0.34;
    pen.paint(()=>{ mouthPath(g,nx,horizon,nw,nh); }, toneSolid(inkLevel(2)), 5);
    pen.ink(()=>{ mouthPath(g,nx,horizon,nw,nh); }, 4);
  }

  // ---- SEALABLE DOOR-STONE SLOT at the north mouth ----
  if (has("doorstone") && params.doorStone){
    const nx=W*0.90, nw=W*0.17, nh=H*0.34;
    // the runner slot (a channel groove around the mouth)
    pen.ink(()=>{ g.rect(nx-nw*0.62, horizon-nh, nw*1.24, nh); }, 3);
    if (sealed){
      // the great round door-stone rolled into the slot
      pen.paint(()=>{ g.ellipse(nx, horizon-nh*0.5, nw*0.62, nh*0.5, 0,0,7); }, toneSolid(inkLevel(6)), 5);
      // grain rings on the stone
      pen.ink(()=>{ g.ellipse(nx, horizon-nh*0.5, nw*0.4, nh*0.32, 0,0,7); }, 2);
      pen.ink(()=>{ g.ellipse(nx, horizon-nh*0.5, nw*0.2, nh*0.16, 0,0,7); }, 2);
    } else {
      // rolled aside: the stone parked to the right of the slot
      pen.paint(()=>{ g.ellipse(W*0.99, horizon-nh*0.4, nw*0.4, nh*0.42, 0,0,7); }, toneSolid(inkLevel(6)), 5);
    }
  }

  // ---- ROWS OF WATER JARS along the mid floor ----
  if (has("jars")){
    const n=params.jars;
    for(let i=0;i<n;i++){
      const jx=W*(0.30+i*0.10), jy=horizon-H*0.01;
      const jw=W*0.045, jh=H*0.11;
      // amphora body
      pen.paint(()=>{
        g.moveTo(jx-jw*0.3, jy-jh);
        g.quadraticCurveTo(jx-jw, jy-jh*0.45, jx-jw*0.55, jy);
        g.lineTo(jx+jw*0.55, jy);
        g.quadraticCurveTo(jx+jw, jy-jh*0.45, jx+jw*0.3, jy-jh);
        g.closePath();
      }, toneSolid(inkLevel(5)), 4);
      // neck + rim
      pen.paint(()=>{ g.rect(jx-jw*0.3, jy-jh-H*0.02, jw*0.6, H*0.02); }, toneSolid(inkLevel(6)),3);
      // handle seams
      pen.ink(()=>{ g.moveTo(jx-jw*0.35,jy-jh*0.9); g.quadraticCurveTo(jx-jw*0.9,jy-jh*0.7,jx-jw*0.5,jy-jh*0.5); }, 2);
      pen.ink(()=>{ g.moveTo(jx+jw*0.35,jy-jh*0.9); g.quadraticCurveTo(jx+jw*0.9,jy-jh*0.7,jx+jw*0.5,jy-jh*0.5); }, 2);
    }
  }

  // ---- STONE WEAVING-BENCHES on the floor (foreground furniture) ----
  if (has("benches")){
    const n=params.benches;
    for(let i=0;i<n;i++){
      const bx=W*(0.16+i*0.44), by=horizon+ (H-horizon)*0.40;
      const bw=W*0.20, bh=H*0.05;
      // upright loom frame behind the bench
      pen.paint(()=>{ g.rect(bx-bw*0.42, by-H*0.16, W*0.012, H*0.16); }, toneSolid(inkLevel(5)),4);
      pen.paint(()=>{ g.rect(bx+bw*0.42-W*0.012, by-H*0.16, W*0.012, H*0.16); }, toneSolid(inkLevel(5)),4);
      pen.ink(()=>{ g.moveTo(bx-bw*0.42,by-H*0.16); g.lineTo(bx+bw*0.42,by-H*0.16); }, 3);
      // warp threads
      g.strokeStyle=INK; g.lineWidth=1; g.globalAlpha=0.5;
      for(let w=0;w<6;w++){ const wx=bx-bw*0.34+w*(bw*0.68/5); g.beginPath(); g.moveTo(wx,by-H*0.155); g.lineTo(wx,by-H*0.02); g.stroke(); }
      g.globalAlpha=1;
      // stone bench slab + legs
      pen.paint(()=>{ g.rect(bx-bw/2, by, bw, bh); }, toneSolid(inkLevel(4)), 4);
      pen.paint(()=>{ g.rect(bx-bw*0.42, by+bh, W*0.02, H*0.04); }, toneSolid(inkLevel(5)),3);
      pen.paint(()=>{ g.rect(bx+bw*0.40, by+bh, W*0.02, H*0.04); }, toneSolid(inkLevel(5)),3);
    }
  }

  // ---- TREASURE CACHE ALCOVE (low, dark hollow with stacked goods) ----
  if (has("cache") && params.cache){
    const cx=W*0.50, cy=horizon-H*0.135, cw=W*0.15, ch=H*0.115;
    // dark alcove
    pen.paint(()=>{ g.rect(cx-cw/2, cy, cw, ch); }, toneSolid(inkLevel(7)), 4);
    // arched lintel
    pen.paint(()=>{
      g.moveTo(cx-cw/2, cy);
      g.quadraticCurveTo(cx, cy-ch*0.5, cx+cw/2, cy);
      g.lineTo(cx+cw*0.6, cy); g.lineTo(cx-cw*0.6, cy); g.closePath();
    }, toneSolid(inkLevel(4)), 4);
    // stacked cache goods (tripods / cauldrons) inside
    g.fillStyle=inkLevel(3);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(cx-cw*0.28+i*cw*0.28, cy+ch*0.7, cw*0.11, ch*0.16, 0,0,7); g.fill(); }
    g.strokeStyle=INK; g.lineWidth=2;
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(cx-cw*0.28+i*cw*0.28, cy+ch*0.7, cw*0.11, ch*0.16, 0,0,7); g.stroke(); }
  }

  // ---- CAVE FLOOR (lightest so it reads as walkable ground) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    // scattered flagstone seams for depth
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
    for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3.2); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    for(let i=1;i<6;i++){ const x=W*(i/6); g.beginPath(); g.moveTo(x,horizon); g.lineTo(x+(x-W/2)*0.25,H); g.stroke(); }
    g.globalAlpha=1;
    // contour where floor meets back wall
    pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 4);
  }
}

export const asset = {
  id:"location.nymph-cave",
  type:"LOCATION",
  name:"Nymph Cave",
  statusWord:"SACRED",
  scene:"OD-B13-S04",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["cavern","backwall","recesses","thresholds","doorstone","jars","benches","cache","floor","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "threshold:south":{x:.10,y:.66},   // mortals' entrance (left mouth)
    "threshold:north":{x:.90,y:.66},   // gods' entrance (right mouth, sealable)
    "doorstone:slot":{x:.90,y:.55},
    "cache:treasure":{x:.50,y:.62},
    "recess:a":{x:.19,y:.48}, "recess:b":{x:.38,y:.48}, "recess:c":{x:.57,y:.48},
    "jars:row":{x:.50,y:.68},
    "bench:left":{x:.16,y:.82}, "bench:right":{x:.60,y:.82},
    "camera:wide":{x:.50,y:.50}, "camera:cache":{x:.50,y:.62},
  },
  // walkable ground region (for scene placement / pathing)
  zones:{
    walkable:{ x0:.08,y0:.72,x1:.92,y1:.96 },
    jarRow:{ x0:.26,y0:.66,x1:.74,y1:.72 },
    cacheFront:{ x0:.42,y0:.70,x1:.58,y1:.78 },
  },
  states:{
    initial:"sealed",
    nodes:{
      sealed:{ preview:{ layers:["cavern","backwall","recesses","thresholds","doorstone","jars","benches","cache","floor"], sealed:true } },
      open:{ preview:{ layers:["cavern","backwall","recesses","thresholds","doorstone-open","jars","benches","cache","floor"], sealed:false } },
      empty:{ preview:{ layers:["cavern","backwall","recesses","thresholds","floor"], sealed:true } },
    },
    edges:[["sealed","open"],["open","sealed"],["sealed","empty"]],
  },
  channels:["reveal","seal","camera","light"],

  preview:()=>({ layers:["cavern","backwall","recesses","thresholds","doorstone","jars","benches","cache","floor"], sealed:true, status:"SACRED", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
