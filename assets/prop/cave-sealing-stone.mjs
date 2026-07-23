/* prop.cave-sealing-stone — the great round door-stone of the Cave of the Nymphs.
   PROP asset (OD-B13-S04). A big flat boulder-plug — a divinely movable disc that
   seals the mouth of the Naiads' cave at Ithaca, where Odysseus stows the Phaeacian
   treasure. It cycles the scene states that reveal, fill, seal, conceal and later
   re-open the cave: open(aside) / loaded / sealed / hidden / reopened. The stone is
   an enormous flat plug (far too heavy for a man — "only a god could shift it"); a
   drag scar and a low scale bracket sell the giant scale. When LOADED the dark mouth
   shows stowed tripods, cauldrons and jars; when SEALED the disc caps the mouth; when
   HIDDEN Athena's olive-brush is drawn over the seam so the stone reads as hillside.

   Drawn in SOLID grays + hard black contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: isolated reusable object; declared scale, contact anchors, ownership,
   collision, and all scene-required states. Matches the STONE PLUG / BARRIER card. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  slabInk:4,        // mid-gray body of the flat disc
  rimInk:6,         // dark thick rim of the plug (its edge thickness)
  shadeInk:6,       // shaded lower-right crescent of the disc
  faceInk:1,        // bright sunlit face patch
  rockInk:3,        // the hillside rock face (mid-light)
  rockDarkInk:5,    // shaded rock folds / mouth surround
  caveInk:7,        // near-black cave interior
  goodsInk:4,       // stowed treasure inside the mouth (reads against the dark cave)
  goodsHiInk:1,     // sunlit facets on the treasure
  leafInk:5,        // Athena's concealing olive-brush
  groundInk:2,      // foreground ground
  radiusFrac:0.250, // slab radius as a fraction of W (giant flat plug)
  crackSeed:19,
};

/* fixed scene geometry in the 660x880 source (fractions of W/H) */
function geo(W,H){
  const groundY = H*0.850;
  const R = W*params.radiusFrac;
  const cmx = W*0.42;                 // cave-mouth centre X
  const mouthW = R*1.98;              // mouth ~ the disc's diameter (round plug)
  const archTop = groundY - R*2.00;   // top of the arched opening
  const restY = groundY - R*0.92;     // resting centre height (disc sits slightly embedded)
  return { W,H, groundY, R, cmx, mouthW, archTop, restY };
}

/* per-state placement of the giant plug + what the cave shows */
const POSE = {
  open:      { dx:0.74, lift:0.00, track:false, goods:false, leafy:false, weather:false, status:"OPEN",   progress:0.25 },
  aside:     { dx:0.74, lift:0.00, track:false, goods:false, leafy:false, weather:false, status:"ASIDE",  progress:0.25 },
  loaded:    { dx:0.75, lift:0.00, track:false, goods:true,  leafy:false, weather:false, status:"LOADED", progress:0.55 },
  sealed:    { dx:0.42, lift:0.00, track:true,  goods:false, leafy:false, weather:false, status:"SEALED", progress:1.00 },
  hidden:    { dx:0.42, lift:0.00, track:false, goods:false, leafy:true,  weather:true,  status:"HIDDEN", progress:0.90 },
  reopened:  { dx:0.72, lift:0.00, track:true,  goods:false, leafy:false, weather:true,  status:"REOPENED", progress:0.20 },
};

/* deterministic pseudo-random from an integer seed (self-contained) */
function seeded(seed){ let s=(seed>>>0)||1; return ()=>{ s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%100000)/100000; }; }

/* stowed treasure inside the dark cave mouth (LOADED state) */
function drawGoods(g, G){
  const bx = G.cmx, by = G.groundY;
  g.save();
  // a bronze tripod-cauldron at centre
  const cw = G.mouthW*0.20;
  g.fillStyle=inkLevel(params.goodsInk);
  g.beginPath(); g.ellipse(bx, by-cw*1.15, cw*0.62, cw*0.5, 0, Math.PI, 0); // cauldron bowl
  g.lineTo(bx+cw*0.5, by-cw*0.35); g.lineTo(bx-cw*0.5, by-cw*0.35); g.closePath(); g.fill();
  g.strokeStyle=INK; g.lineWidth=2.4;
  // tripod legs
  for(const s of [-1,0,1]){ g.beginPath(); g.moveTo(bx+s*cw*0.42, by-cw*0.4); g.lineTo(bx+s*cw*0.55, by-2); g.stroke(); }
  g.beginPath(); g.ellipse(bx, by-cw*1.15, cw*0.62, cw*0.5, 0, Math.PI, 0); g.stroke();
  // sunlit facet on the cauldron
  g.fillStyle=inkLevel(params.goodsHiInk);
  g.beginPath(); g.ellipse(bx-cw*0.2, by-cw*1.2, cw*0.2, cw*0.16, -0.4, 0, 7); g.fill();

  // stacked jars / amphorae to either side
  const jars=[[-0.60,0.9],[-0.42,1.15],[0.52,1.0],[0.66,0.8]];
  for(const [ox,sc] of jars){
    const jx=bx+G.mouthW*ox*0.5, jh=cw*1.2*sc, jw=cw*0.42*sc, jy=by-4;
    g.fillStyle=inkLevel(params.goodsInk); g.strokeStyle=INK; g.lineWidth=2.2;
    g.beginPath();
    g.moveTo(jx-jw*0.5, jy);
    g.quadraticCurveTo(jx-jw*0.9, jy-jh*0.55, jx-jw*0.28, jy-jh*0.8);
    g.lineTo(jx-jw*0.22, jy-jh);           // neck L
    g.lineTo(jx+jw*0.22, jy-jh);           // neck R
    g.quadraticCurveTo(jx+jw*0.9, jy-jh*0.55, jx+jw*0.5, jy);
    g.closePath(); g.fill(); g.stroke();
    // handles
    g.beginPath(); g.moveTo(jx-jw*0.22,jy-jh*0.86); g.quadraticCurveTo(jx-jw*0.75,jy-jh*0.78,jx-jw*0.5,jy-jh*0.55); g.stroke();
    g.beginPath(); g.moveTo(jx+jw*0.22,jy-jh*0.86); g.quadraticCurveTo(jx+jw*0.75,jy-jh*0.78,jx+jw*0.5,jy-jh*0.55); g.stroke();
    g.fillStyle=inkLevel(params.goodsHiInk);
    g.beginPath(); g.ellipse(jx-jw*0.12, jy-jh*0.5, jw*0.14, jh*0.22, 0, 0, 7); g.fill();
  }
  g.restore();
}

/* Athena's concealing brush drawn over the sealed seam (HIDDEN state) */
function drawBrush(g, G, cx, cy, R){
  const rnd = seeded(params.crackSeed+3);
  // a low bank of olive-brush across the bottom third of the plug + mouth
  g.save();
  const baseY = cy + R*0.42;
  for(let i=0;i<34;i++){
    const t=i/33;
    const bx=cx - R*1.1 + t*R*2.2 + (rnd()-0.5)*R*0.14;
    const by=baseY + (rnd()-0.5)*R*0.5 + Math.sin(t*Math.PI)*(-R*0.18);
    const rr=R*(0.10+rnd()*0.10);
    g.fillStyle=inkLevel(params.leafInk);
    // a leafy tuft = a few overlapping leaf blades
    for(let k=0;k<5;k++){
      const a=(k/5)*Math.PI*2 + rnd();
      g.beginPath();
      g.ellipse(bx+Math.cos(a)*rr*0.5, by+Math.sin(a)*rr*0.5, rr*0.55, rr*0.2, a, 0, 7);
      g.fill();
    }
    g.strokeStyle=INK; g.lineWidth=1.6;
    g.beginPath(); g.moveTo(bx,by+rr*0.5); g.lineTo(bx+(rnd()-0.5)*rr, by-rr); g.stroke();
  }
  g.restore();
}

/* the enormous flat round door-stone, centred at (cx,cy) with radius R */
function drawSlab(g, pen, cx, cy, R, weather){
  // ground contact shadow beneath the disc
  g.save(); g.fillStyle="rgba(0,0,0,0.16)";
  g.beginPath(); g.ellipse(cx, cy+R*0.94, R*1.04, R*0.16, 0, 0, 7); g.fill(); g.restore();

  // thick dark rim (the flat plug's edge thickness read side-on) — a squat ellipse
  pen.paint(()=>{ g.ellipse(cx, cy, R, R*0.96, 0, 0, 7); }, toneSolid(inkLevel(params.rimInk)), 6);
  // the broad flat face, inset from the rim
  pen.paint(()=>{ g.ellipse(cx, cy, R*0.88, R*0.84, 0, 0, 7); }, toneSolid(inkLevel(params.slabInk)), 4);

  // bright sunlit patch on the upper-left of the disc (domed flat stone)
  g.save(); g.beginPath(); g.ellipse(cx, cy, R*0.88, R*0.84, 0, 0, 7); g.clip();
  g.fillStyle=inkLevel(Math.max(0,params.slabInk-1));
  g.beginPath(); g.ellipse(cx-R*0.20, cy-R*0.22, R*0.54, R*0.48, -0.5, 0, 7); g.fill();
  g.fillStyle=inkLevel(params.faceInk);
  g.beginPath(); g.ellipse(cx-R*0.26, cy-R*0.28, R*0.34, R*0.28, -0.5, 0, 7); g.fill();
  // shaded lower-right rim crescent
  g.fillStyle=inkLevel(params.shadeInk);
  g.beginPath(); g.ellipse(cx+R*0.50, cy+R*0.44, R*0.40, R*0.42, -0.5, 0, 7); g.fill();
  g.restore();

  // concentric weathering band (flat stone reads as banded)
  pen.seam(()=>{ g.ellipse(cx, cy, R*0.60, R*0.56, 0, 0, 7); }, 2.4);

  // CRACKS + surface pits, clipped to the flat face
  g.save(); g.beginPath(); g.ellipse(cx, cy, R*0.88, R*0.84, 0, 0, 7); g.clip();
  const rnd = seeded(params.crackSeed);
  const majors = 3;
  for(let m=0;m<majors;m++){
    const a0 = (m/majors)*Math.PI*2 + rnd()*0.8;
    let x = cx + Math.cos(a0)*R*0.85, y = cy + Math.sin(a0)*R*0.8;
    let ang = a0 + Math.PI + (rnd()-0.5)*0.7;
    g.strokeStyle=INK; g.lineWidth=3.0; g.lineCap="round";
    g.beginPath(); g.moveTo(x,y);
    const segs = 6 + (m%2);
    for(let s=0;s<segs;s++){
      const step = R*0.28*(0.7+rnd()*0.5);
      ang += (rnd()-0.5)*0.9;
      x += Math.cos(ang)*step; y += Math.sin(ang)*step;
      g.lineTo(x,y);
      if(rnd()>0.55){
        const bx = x+Math.cos(ang+1.1)*R*0.18*(0.5+rnd());
        const by = y+Math.sin(ang+1.1)*R*0.18*(0.5+rnd());
        g.moveTo(x,y); g.lineTo(bx,by); g.moveTo(x,y);
      }
    }
    g.stroke();
  }
  g.fillStyle=inkLevel(params.rimInk);
  for(let i=0;i<24;i++){
    const a=rnd()*Math.PI*2, rr=R*0.82*Math.sqrt(rnd());
    const px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr*0.9;
    g.beginPath(); g.arc(px,py, 1.4+rnd()*2.2, 0, 7); g.fill();
  }
  if(weather){
    g.fillStyle=inkLevel(params.rimInk);
    for(let i=0;i<7;i++){
      const a=Math.PI*0.15 + i*0.14, rr=R*0.80;
      const px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr*0.55+R*0.2;
      g.beginPath(); g.ellipse(px,py, R*0.09, R*0.15, 0.4, 0, 7); g.fill();
    }
  }
  g.restore();
}

function drawScene(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "sealed";
  const P = POSE[mode] || POSE.sealed;
  const G = geo(W,H);
  const slabDX = (typeof st.slabDX==="number") ? st.slabDX : P.dx;
  const lift   = (typeof st.lift==="number")   ? st.lift   : P.lift;

  // ================= HILLSIDE ROCK FACE (background mass) =================
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,G.groundY);
  pen.paint(()=>{
    g.moveTo(0, H*0.32);
    g.lineTo(W*0.12, H*0.16); g.lineTo(W*0.28, H*0.24); g.lineTo(W*0.42, H*0.11);
    g.lineTo(W*0.60, H*0.22); g.lineTo(W*0.76, H*0.12); g.lineTo(W*0.90, H*0.25);
    g.lineTo(W, H*0.18);
    g.lineTo(W, G.groundY); g.lineTo(0, G.groundY); g.closePath();
  }, toneSolid(inkLevel(params.rockInk)), 5);
  // shaded rock folds / strata
  g.strokeStyle=inkLevel(params.rockDarkInk); g.lineWidth=3; g.lineCap="round";
  const folds=[[0.05,0.36,0.30,0.42],[0.64,0.32,0.92,0.42],[0.72,0.52,0.98,0.62],[0.04,0.57,0.22,0.68]];
  for(const [x0,y0,x1,y1] of folds){
    g.beginPath(); g.moveTo(W*x0,H*y0);
    g.quadraticCurveTo(W*(x0+x1)/2, H*((y0+y1)/2-0.03), W*x1, H*y1); g.stroke();
  }
  // darker weathered rock surrounding the mouth
  g.save();
  g.fillStyle=inkLevel(params.rockDarkInk);
  g.beginPath(); g.ellipse(G.cmx, G.archTop+(G.groundY-G.archTop)*0.5, G.mouthW*0.86, (G.groundY-G.archTop)*0.60, 0, 0, 7); g.fill();
  g.restore();

  // ================= CAVE MOUTH (dark arched opening) =================
  pen.paint(()=>{
    const x0=G.cmx-G.mouthW/2, x1=G.cmx+G.mouthW/2;
    g.moveTo(x0, G.groundY);
    g.lineTo(x0, G.archTop+H*0.06);
    g.quadraticCurveTo(x0, G.archTop, G.cmx, G.archTop);
    g.quadraticCurveTo(x1, G.archTop, x1, G.archTop+H*0.06);
    g.lineTo(x1, G.groundY); g.closePath();
  }, toneSolid(inkLevel(params.caveInk)), 5);
  // deeper shadow rim just inside the lip
  g.save();
  g.beginPath();
  const x0=G.cmx-G.mouthW/2, x1=G.cmx+G.mouthW/2;
  g.moveTo(x0, G.groundY); g.lineTo(x0, G.archTop+H*0.06);
  g.quadraticCurveTo(x0, G.archTop, G.cmx, G.archTop);
  g.quadraticCurveTo(x1, G.archTop, x1, G.archTop+H*0.06);
  g.lineTo(x1, G.groundY); g.closePath(); g.clip();
  g.strokeStyle=inkLevel(params.rockDarkInk); g.lineWidth=10; g.stroke();
  g.restore();

  // ================= STOWED TREASURE (loaded) — clipped to the mouth =================
  if(P.goods){
    g.save();
    g.beginPath();
    g.moveTo(x0, G.groundY); g.lineTo(x0, G.archTop+H*0.06);
    g.quadraticCurveTo(x0, G.archTop, G.cmx, G.archTop);
    g.quadraticCurveTo(x1, G.archTop, x1, G.archTop+H*0.06);
    g.lineTo(x1, G.groundY); g.closePath(); g.clip();
    drawGoods(g, G);
    g.restore();
  }

  // ================= GROUND =================
  g.fillStyle=inkLevel(params.groundInk); g.fillRect(0,G.groundY,W,H-G.groundY);
  pen.ink(()=>{ g.moveTo(0,G.groundY); g.lineTo(W,G.groundY); }, 4);
  g.fillStyle=inkLevel(params.rockDarkInk);
  for(let i=0;i<9;i++){ const x=G.cmx-G.mouthW*0.4+i*(G.mouthW*0.1); const y=G.groundY+6+((i*37)%9);
    g.beginPath(); g.ellipse(x,y, 7+((i*13)%7), 4, 0,0,7); g.fill(); }

  // ================= DRAG SCAR (sealed / reopened) =================
  if(P.track){
    g.save();
    g.strokeStyle=inkLevel(params.rockDarkInk); g.lineWidth=6; g.lineCap="round";
    const y=G.groundY+ (H-G.groundY)*0.42;
    const x1t=W*slabDX;
    g.beginPath(); g.moveTo(G.cmx, y); g.lineTo(x1t, y); g.stroke();
    g.lineWidth=2.4;
    const lo=Math.min(G.cmx,x1t), hi=Math.max(G.cmx,x1t);
    for(let x=lo; x<hi; x+=16){ g.beginPath(); g.moveTo(x,y-9); g.lineTo(x,y+9); g.stroke(); }
    g.restore();
  }

  // ================= THE GIANT DOOR-STONE =================
  const cx = W*slabDX;
  const cy = G.restY - H*lift;
  drawSlab(g, pen, cx, cy, G.R, P.weather);

  // ================= ATHENA'S CONCEALING BRUSH (hidden) =================
  if(P.leafy) drawBrush(g, G, cx, cy, G.R);
}

export const asset = {
  id:"prop.cave-sealing-stone",
  type:"PROP",
  name:"Cave Sealing Stone",
  statusWord:"SEALED",
  scene:"OD-B13-S04",

  params,
  // back -> front draw order the module honors
  layers:["sky","rock-face","rock-folds","mouth-frame","cave-mouth","goods","ground","rubble","drag-scar","slab","brush"],

  // normalized 0..1 contact / support / grip anchors (plug in its SEALED cap position)
  anchors:{
    "seal:mouth":{x:.42,y:.60},       // the cave-mouth centre the plug caps
    "mouth:top":{x:.42,y:.35},        // apex of the arched opening
    "mouth:floor":{x:.42,y:.815},     // threshold at ground level
    "slab:center":{x:.42,y:.60},      // centre of the disc when sealing
    "slab:crown":{x:.42,y:.40},       // top of the plug (where a god's grip lifts it)
    "contact:ground":{x:.42,y:.79},   // the plug's contact on the ground
    "rest:aside":{x:.74,y:.66},       // where the disc rests when rolled aside
    "stow:cave":{x:.42,y:.72},        // where the treasure is stowed inside
    "track:roll":{x:.58,y:.905},      // the drag scar across the ground
  },
  // collision: the disc footprint in its sealed position (asset space)
  collision:{ kind:"circle", cx:.42, cy:.60, r:.20 },
  scale:{ kind:"giant", note:"divinely movable; too heavy for a man — Athena shifts it" },
  ownership:"cave-of-the-nymphs / ithaca (odysseus' cache)",

  states:{
    initial:"sealed",
    nodes:{
      open:     { preview:{ mode:"open",     status:"OPEN",     progress:0.25 } },
      loaded:   { preview:{ mode:"loaded",   status:"LOADED",   progress:0.55 } },
      sealed:   { preview:{ mode:"sealed",   status:"SEALED",   progress:1.00 } },
      hidden:   { preview:{ mode:"hidden",   status:"HIDDEN",   progress:0.90 } },
      reopened: { preview:{ mode:"reopened", status:"REOPENED", progress:0.20 } },
    },
    edges:[
      ["open","loaded"],["loaded","sealed"],["sealed","hidden"],
      ["hidden","reopened"],["reopened","open"],["sealed","open"],
      ["open","sealed"],["hidden","sealed"],
    ],
  },
  channels:["mode","slabDX","lift","t"],

  preview:()=>({ mode:"sealed", status:"SEALED", progress:1.00, t:0 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
