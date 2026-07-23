/* prop.cave-blocking-stone — the enormous round slab that seals a cave mouth.
   PROP asset (OD-B09-S06). An ENORMOUS cracked ROUND BOULDER SLAB set against a
   rocky hillside pierced by a dark arched cave mouth. The slab is a giant disc —
   far too heavy for men to shift ("immovable by humans") — and cycles through the
   scene states that reveal or seal the cave: open(aside) / lifted / rolled /
   sealed / later-opened. slabDX/slabDY place the disc; when sealed it caps the
   mouth exactly, otherwise the black opening reads behind/around it. A drag scar
   in the ground and a small human-height scale bracket sell the giant scale.

   Drawn in SOLID grays + hard black contour into the offscreen ctx; the engine
   dotify pass supplies the halftone. Do NOT pre-dither.
   Atlas: isolated reusable object; declared scale, contact anchors, ownership,
   collision, and all scene-required states. Matches the STONE SLAB/BARRIER card. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const params = {
  slabInk:4,        // mid-gray granite body of the disc
  rimInk:6,         // dark thick rim of the slab
  shadeInk:6,       // shaded lower-right of the disc
  faceInk:1,        // bright sunlit face patch
  rockInk:3,        // the hillside rock face (mid-light)
  rockDarkInk:5,    // shaded rock folds / mouth surround
  caveInk:7,        // near-black cave interior
  groundInk:2,      // foreground ground
  radiusFrac:0.255, // slab radius as a fraction of W (giant)
  crackSeed:7,
};

/* fixed scene geometry in the 660x880 source (fractions of W/H) */
function geo(W,H){
  const groundY = H*0.855;
  const R = W*params.radiusFrac;
  const cmx = W*0.42;                 // cave-mouth centre X
  const mouthW = R*1.94;              // mouth roughly the disc's diameter (round plug)
  const archTop = groundY - R*2.05;   // top of the arched opening
  const restY = groundY - R*0.92;     // resting centre height (disc sits slightly embedded)
  return { W,H, groundY, R, cmx, mouthW, archTop, restY };
}

/* per-state placement of the giant disc (centre + how much the mouth shows) */
const POSE = {
  sealed:         { dx:0.40, mode:"rest", lift:0.00, track:false, weather:false, status:"SEALED",   progress:1.00 },
  "open":         { dx:0.72, mode:"rest", lift:0.00, track:false, weather:false, status:"OPEN",     progress:0.30 },
  aside:          { dx:0.72, mode:"rest", lift:0.00, track:false, weather:false, status:"ASIDE",    progress:0.30 },
  lifted:         { dx:0.40, mode:"lift", lift:0.34, track:false, weather:false, status:"LIFTED",   progress:0.60 },
  rolled:         { dx:0.75, mode:"rest", lift:0.00, track:true,  weather:false, status:"ROLLED",   progress:0.20 },
  "later-opened": { dx:0.70, mode:"rest", lift:0.00, track:true,  weather:true,  status:"OPENED",   progress:0.15 },
};

/* deterministic pseudo-random from an integer seed (self-contained) */
function seeded(seed){ let s=(seed>>>0)||1; return ()=>{ s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%100000)/100000; }; }

/* the enormous cracked round slab, centred at (cx,cy) with radius R */
function drawSlab(g, pen, cx, cy, R, weather){
  // ground contact shadow beneath the disc
  g.save(); g.fillStyle="rgba(0,0,0,0.16)";
  g.beginPath(); g.ellipse(cx, cy+R*0.96, R*1.02, R*0.16, 0, 0, 7); g.fill(); g.restore();

  // thick dark rim (reads as the slab's edge thickness)
  pen.paint(()=>{ g.arc(cx, cy, R, 0, 7); }, toneSolid(inkLevel(params.rimInk)), 6);
  // the slab face, inset from the rim
  pen.paint(()=>{ g.arc(cx, cy, R*0.90, 0, 7); }, toneSolid(inkLevel(params.slabInk)), 4);

  // bright sunlit patch on the upper-left of the disc
  g.save(); g.beginPath(); g.arc(cx, cy, R*0.90, 0, 7); g.clip();
  // a soft mid ring first, then the bright core on top (concentric = domed stone)
  g.fillStyle=inkLevel(Math.max(0,params.slabInk-1));
  g.beginPath(); g.ellipse(cx-R*0.20, cy-R*0.24, R*0.56, R*0.50, -0.5, 0, 7); g.fill();
  g.fillStyle=inkLevel(params.faceInk);
  g.beginPath(); g.ellipse(cx-R*0.26, cy-R*0.30, R*0.36, R*0.30, -0.5, 0, 7); g.fill();
  // shaded lower-right rim crescent (kept near the edge, not the centre)
  g.fillStyle=inkLevel(params.shadeInk);
  g.beginPath(); g.ellipse(cx+R*0.52, cy+R*0.50, R*0.40, R*0.44, -0.5, 0, 7); g.fill();
  g.restore();

  // concentric weathering ring (banded stone)
  pen.seam(()=>{ g.arc(cx, cy, R*0.62, 0, 7); }, 2.4);

  // CRACKS — a couple of major fractures plus branching hairlines, clipped to disc
  g.save(); g.beginPath(); g.arc(cx, cy, R*0.90, 0, 7); g.clip();
  const rnd = seeded(params.crackSeed);
  const majors = 3;
  for(let m=0;m<majors;m++){
    const a0 = (m/majors)*Math.PI*2 + rnd()*0.8;
    let x = cx + Math.cos(a0)*R*0.9, y = cy + Math.sin(a0)*R*0.9;
    let ang = a0 + Math.PI + (rnd()-0.5)*0.7;   // head roughly across the disc
    g.strokeStyle=INK; g.lineWidth=3.2; g.lineCap="round";
    g.beginPath(); g.moveTo(x,y);
    const segs = 6 + (m%2);
    for(let s=0;s<segs;s++){
      const step = R*0.30*(0.7+rnd()*0.5);
      ang += (rnd()-0.5)*0.9;
      x += Math.cos(ang)*step; y += Math.sin(ang)*step;
      g.lineTo(x,y);
      // occasional branch
      if(rnd()>0.55){
        const bx = x+Math.cos(ang+1.1)*R*0.20*(0.5+rnd());
        const by = y+Math.sin(ang+1.1)*R*0.20*(0.5+rnd());
        g.moveTo(x,y); g.lineTo(bx,by); g.moveTo(x,y);
      }
    }
    g.stroke();
  }
  // fine surface pits / spall marks
  g.fillStyle=inkLevel(params.rimInk);
  for(let i=0;i<26;i++){
    const a=rnd()*Math.PI*2, rr=R*0.85*Math.sqrt(rnd());
    const px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr;
    g.beginPath(); g.arc(px,py, 1.4+rnd()*2.4, 0, 7); g.fill();
  }
  // moss/weather stains along the base when the stone has sat for years
  if(weather){
    g.fillStyle=inkLevel(params.rimInk);
    for(let i=0;i<7;i++){
      const a=Math.PI*0.15 + i*0.14, rr=R*0.86;
      const px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr*0.6+R*0.2;
      g.beginPath(); g.ellipse(px,py, R*0.10, R*0.16, 0.4, 0, 7); g.fill();
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
  // upper sky sliver (lightest)
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,G.groundY);
  // the rough rocky bluff — a jagged mass filling most of the frame
  pen.paint(()=>{
    g.moveTo(0, H*0.30);
    g.lineTo(W*0.10, H*0.14); g.lineTo(W*0.26, H*0.22); g.lineTo(W*0.40, H*0.09);
    g.lineTo(W*0.58, H*0.20); g.lineTo(W*0.74, H*0.10); g.lineTo(W*0.90, H*0.23);
    g.lineTo(W, H*0.16);
    g.lineTo(W, G.groundY); g.lineTo(0, G.groundY); g.closePath();
  }, toneSolid(inkLevel(params.rockInk)), 5);
  // a few shaded rock folds / strata for texture
  g.strokeStyle=inkLevel(params.rockDarkInk); g.lineWidth=3; g.lineCap="round";
  const folds=[[0.05,0.34,0.30,0.40],[0.62,0.30,0.92,0.40],[0.70,0.50,0.98,0.60],[0.04,0.55,0.22,0.66]];
  for(const [x0,y0,x1,y1] of folds){
    g.beginPath(); g.moveTo(W*x0,H*y0);
    g.quadraticCurveTo(W*(x0+x1)/2, H*((y0+y1)/2-0.03), W*x1, H*y1); g.stroke();
  }
  // darker weathered rock surrounding the mouth (soft, no hard box contour)
  g.save();
  g.fillStyle=inkLevel(params.rockDarkInk);
  g.beginPath(); g.ellipse(G.cmx, G.archTop+ (G.groundY-G.archTop)*0.5, G.mouthW*0.86, (G.groundY-G.archTop)*0.60, 0, 0, 7); g.fill();
  g.restore();

  // ================= CAVE MOUTH (dark arched opening) =================
  // always drawn; the slab caps it when sealed
  pen.paint(()=>{
    const x0=G.cmx-G.mouthW/2, x1=G.cmx+G.mouthW/2;
    g.moveTo(x0, G.groundY);
    g.lineTo(x0, G.archTop+H*0.06);
    g.quadraticCurveTo(x0, G.archTop, G.cmx, G.archTop);
    g.quadraticCurveTo(x1, G.archTop, x1, G.archTop+H*0.06);
    g.lineTo(x1, G.groundY); g.closePath();
  }, toneSolid(inkLevel(params.caveInk)), 5);
  // a rim of deeper shadow just inside the lip
  g.save();
  g.beginPath();
  const x0=G.cmx-G.mouthW/2, x1=G.cmx+G.mouthW/2;
  g.moveTo(x0, G.groundY); g.lineTo(x0, G.archTop+H*0.06);
  g.quadraticCurveTo(x0, G.archTop, G.cmx, G.archTop);
  g.quadraticCurveTo(x1, G.archTop, x1, G.archTop+H*0.06);
  g.lineTo(x1, G.groundY); g.closePath(); g.clip();
  g.strokeStyle=inkLevel(params.rockDarkInk); g.lineWidth=10; g.stroke();
  g.restore();

  // ================= GROUND =================
  g.fillStyle=inkLevel(params.groundInk); g.fillRect(0,G.groundY,W,H-G.groundY);
  pen.ink(()=>{ g.moveTo(0,G.groundY); g.lineTo(W,G.groundY); }, 4);
  // scattered rubble at the mouth base
  g.fillStyle=inkLevel(params.rockDarkInk);
  for(let i=0;i<9;i++){ const x=G.cmx-G.mouthW*0.4+i*(G.mouthW*0.1); const y=G.groundY+6+((i*37)%9);
    g.beginPath(); g.ellipse(x,y, 7+((i*13)%7), 4, 0,0,7); g.fill(); }

  // ================= DRAG SCAR (rolled / later-opened) =================
  if(P.track){
    g.save();
    g.strokeStyle=inkLevel(params.rockDarkInk); g.lineWidth=6; g.lineCap="round";
    const y=G.groundY+ (H-G.groundY)*0.42;
    g.beginPath(); g.moveTo(G.cmx, y); g.lineTo(W*slabDX, y); g.stroke();
    g.lineWidth=2.4;
    for(let x=G.cmx; x<W*slabDX; x+=16){ g.beginPath(); g.moveTo(x,y-9); g.lineTo(x,y+9); g.stroke(); }
    g.restore();
  }

  // ================= THE GIANT SLAB =================
  const cx = W*slabDX;
  const cy = G.restY - H*lift;
  drawSlab(g, pen, cx, cy, G.R, P.weather);
}

export const asset = {
  id:"prop.cave-blocking-stone",
  type:"PROP",
  name:"Cave-blocking Stone",
  statusWord:"SEALED",
  scene:"OD-B09-S06",

  params,
  // back -> front draw order the module honors
  layers:["sky","rock-face","rock-folds","mouth-frame","cave-mouth","ground","rubble","drag-scar","slab","scale"],

  // normalized 0..1 contact / support / grip anchors (slab in its SEALED cap position)
  anchors:{
    "seal:mouth":{x:.40,y:.60},       // the cave-mouth centre the slab caps
    "mouth:top":{x:.40,y:.34},        // apex of the arched opening
    "mouth:floor":{x:.40,y:.815},     // threshold at ground level
    "slab:center":{x:.40,y:.60},      // centre of the disc when sealing
    "slab:crown":{x:.40,y:.375},      // top of the disc (where a god's grip lifts it)
    "contact:ground":{x:.40,y:.815},  // the slab's roll-contact on the ground
    "rest:aside":{x:.72,y:.66},       // where the disc rests when rolled aside
    "track:roll":{x:.60,y:.905},      // the drag scar across the ground
  },
  // collision: the disc footprint in its sealed position (asset space)
  collision:{ kind:"circle", cx:.40, cy:.60, r:.215 },
  scale:{ kind:"giant", note:"immovable by humans; only a god or many men shift it" },
  ownership:"cave / cyclops-den",

  states:{
    initial:"sealed",
    nodes:{
      sealed:         { preview:{ mode:"sealed",        status:"SEALED", progress:1.00 } },
      open:           { preview:{ mode:"open",          status:"OPEN",   progress:0.30 } },
      lifted:         { preview:{ mode:"lifted",        status:"LIFTED", progress:0.60 } },
      rolled:         { preview:{ mode:"rolled",        status:"ROLLED", progress:0.20 } },
      "later-opened": { preview:{ mode:"later-opened",  status:"OPENED", progress:0.15 } },
    },
    edges:[
      ["open","lifted"],["lifted","sealed"],["sealed","lifted"],
      ["lifted","rolled"],["rolled","sealed"],["sealed","open"],
      ["rolled","later-opened"],["open","later-opened"],["later-opened","sealed"],
    ],
  },
  channels:["mode","slabDX","lift","t"],

  preview:()=>({ mode:"sealed", status:"SEALED", progress:1.00, t:0 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
