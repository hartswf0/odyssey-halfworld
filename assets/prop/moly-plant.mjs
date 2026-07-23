/* prop.moly-plant — moly, the rare herb Hermes gives Odysseus against Circe's
   drugs (OD-B10-S05): a milk-WHITE flower on a slim stem over a gnarled BLACK
   root. PROP asset. A single reusable object drawn in SOLID grays + hard
   contour into the offscreen ctx; the engine dotify pass supplies the halftone.
   Do NOT pre-dither.

   The plant is drawn about a collar pivot (where stem meets root) and rotated /
   lifted per state so grip / earth-contact / root-tip / bloom anchors stay
   meaningful across the scene state machine:
     rooted(in earth) -> uprooted(divinely pulled) -> held -> ingested
       -> protection-active(glow).
   Earth band, glow rays+rings, ingestion mote and ghost overlays are drawn in
   SCREEN space (un-rotated) so they register to the plant's world position.
   The white bloom is near-paper ink (few dots) inside a hard black contour; the
   root is full ink (dense dots) — the two-tone identity the atlas requires.
   Atlas: isolated reusable object; scale, grip/contact anchors, ownership,
   collision, states. White bloom + black root clearly shown. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const params = {
  bloomR:120,        // flower radius in source px (fits 660x880)
  petalN:6,          // white petals (moly = milk-white bloom)
  stemW:16,          // stem thickness at the collar
  rootSpan:0.20,     // root reach as fraction of H below the collar
  petalWhite:1,      // near-paper -> reads white after dotify
  petalShade:2,      // faintly shaded back petals for depth
  centerTone:2,      // bloom heart
  stamenTone:5,      // a few stamen dots in the heart
  stemTone:3,        // pale-green stem in mono
  rootTone:7,        // FULL INK black root (the dark identity)
  rootMid:6,         // secondary root strands
  earthTone:2,       // light tilled soil band (cutaway; keeps root readable)
  seed:100905,       // deterministic seed (scene OD-B10-S05)
};

/* per-state pose knobs */
const POSE = {
  rooted:             { angle:0.00,  lift:0.00, glow:0.0, earth:true,  dirt:false, ingest:false, ghost:false, status:"ROOTED",     progress:0.18 },
  uprooted:           { angle:0.22,  lift:0.16, glow:0.0, earth:false, dirt:true,  ingest:false, ghost:false, hole:true, status:"UPROOTED",   progress:0.42 },
  held:               { angle:0.34,  lift:0.20, glow:0.0, earth:false, dirt:false, ingest:false, ghost:false, grip:true, status:"HELD",       progress:0.60 },
  ingested:           { angle:0.20,  lift:0.20, glow:0.3, earth:false, dirt:false, ingest:true,  ghost:true,  status:"INGESTED",   progress:0.80 },
  "protection-active":{ angle:0.06,  lift:0.14, glow:1.0, earth:false, dirt:false, ingest:false, ghost:false, status:"PROTECTED",  progress:1.00 },
};

/* rotation so a shape drawn along local +y points outward at (dx,dy).
   canvas: local +y -> (-sin r, cos r). */
function outwardRot(dx, dy){ return Math.atan2(-dx, dy); }

/* one rounded white petal seated at (bx,by), pointing outward along (dx,dy) */
function drawPetal(pen, g, bx, by, dx, dy, len, wid, tone){
  const r = outwardRot(dx, dy);
  pen.paint(()=>{
    g.save(); g.translate(bx,by); g.rotate(r);
    g.moveTo(0,0);
    g.quadraticCurveTo( wid, len*0.42, wid*0.28, len*0.92);
    g.quadraticCurveTo( 0,   len*1.02, -wid*0.28, len*0.92);
    g.quadraticCurveTo(-wid, len*0.42, 0, 0);
    g.restore();
  }, toneSolid(inkLevel(tone)), 3.5);
  // faint midrib crease
  g.save(); g.translate(bx,by); g.rotate(r);
  g.strokeStyle=INK; g.lineWidth=1.4; g.globalAlpha=0.30;
  g.beginPath(); g.moveTo(0,len*0.14); g.lineTo(0,len*0.82); g.stroke();
  g.globalAlpha=1; g.restore();
}

/* a gnarled dark root strand: curved tapering limb from p0 toward a direction */
function drawRootStrand(pen, g, x0, y0, dx, dy, len, w, curl, tone){
  const mx = x0 + dx*len*0.55 + (-dy)*curl;
  const my = y0 + dy*len*0.55 + ( dx)*curl;
  const ex = x0 + dx*len,      ey = y0 + dy*len;
  // ink-cased dark strand (contour + near-black fill => reads solid black)
  pen.limb(()=>{ g.moveTo(x0,y0); g.quadraticCurveTo(mx,my,ex,ey); }, toneSolid(inkLevel(tone)), w);
  // a hair rootlet off the tip
  pen.limb(()=>{ g.moveTo(ex,ey); g.lineTo(ex+dx*len*0.22 - dy*4, ey+dy*len*0.22 + dx*4); },
           toneSolid(inkLevel(tone)), Math.max(2,w*0.5));
}

function drawFlower(pen, g, fx, fy, R, P){
  const petalL = R*1.05, petalW = R*0.52;
  // back ring (shaded, slightly rotated for depth)
  for(let i=0;i<params.petalN;i++){
    const th = (i/params.petalN)*Math.PI*2 + Math.PI/params.petalN;
    const dx = Math.sin(th), dy = -Math.cos(th);
    const bx = fx + dx*R*0.22, by = fy + dy*R*0.22;
    drawPetal(pen, g, bx, by, dx, dy, petalL*0.86, petalW*0.9, params.petalShade);
  }
  // front ring (milk-white)
  for(let i=0;i<params.petalN;i++){
    const th = (i/params.petalN)*Math.PI*2;
    const dx = Math.sin(th), dy = -Math.cos(th);
    const bx = fx + dx*R*0.20, by = fy + dy*R*0.20;
    drawPetal(pen, g, bx, by, dx, dy, petalL, petalW, params.petalWhite);
  }
  // bloom heart + stamen dots
  const hr = R*0.30;
  pen.paint(()=>{ g.ellipse(fx, fy, hr, hr, 0, 0, 7); }, toneSolid(inkLevel(params.centerTone)), 3);
  g.fillStyle = inkLevel(params.stamenTone);
  for(let i=0;i<6;i++){
    const a=(i/6)*Math.PI*2 + 0.3;
    g.beginPath(); g.arc(fx+Math.cos(a)*hr*0.5, fy+Math.sin(a)*hr*0.5, hr*0.14, 0, 7); g.fill();
  }
  g.beginPath(); g.arc(fx, fy, hr*0.16, 0, 7); g.fill();
}

function drawPlant(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = st.mode || "rooted";
  const P = { ...POSE.rooted, ...(POSE[mode]||{}) };
  const R = rnd(params.seed);
  const cx = W*0.50;
  const groundY = H*0.66;                       // fixed world ground line (screen space)
  const pivot = { x:cx, y:groundY - H*P.lift }; // collar lifts off the ground when pulled

  const br = params.bloomR;
  const flowerLocalY = -H*0.30;                 // flower center above the collar
  const stemTopLocalY = flowerLocalY + br*0.72; // stem meets bloom base
  const rootBot = H*params.rootSpan;            // root reach below collar

  // ---------- SCREEN-SPACE backing: protection glow behind the bloom ----------
  // flower world position (approx, small tilt) for the aura
  const fwx = pivot.x + Math.sin(P.angle)*(-flowerLocalY);
  const fwy = pivot.y + Math.cos(P.angle)*flowerLocalY;
  if (P.glow>0){
    g.save();
    const rays = 18;
    g.strokeStyle="rgba(0,0,0,0.16)"; g.lineCap="round";
    for(let i=0;i<rays;i++){
      const a = (i/rays)*Math.PI*2 + 0.15;
      const r0 = br*1.02, r1 = br*(1.30 + 0.55*P.glow*((i%2)?1:0.55));
      g.lineWidth = (i%2)?4:2.2;
      g.beginPath();
      g.moveTo(fwx+Math.cos(a)*r0, fwy+Math.sin(a)*r0);
      g.lineTo(fwx+Math.cos(a)*r1, fwy+Math.sin(a)*r1);
      g.stroke();
    }
    g.setLineDash([7,9]);
    for(let k=1;k<=3;k++){
      g.strokeStyle=`rgba(0,0,0,${0.10*P.glow})`; g.lineWidth=2.5;
      g.beginPath(); g.arc(fwx, fwy, br*(1.10+k*0.20), 0, Math.PI*2); g.stroke();
    }
    g.setLineDash([]);
    g.restore();
  }

  // ---------- SCREEN-SPACE backing: soil CUTAWAY band (rooted) ----------
  // A shallow light-toned soil cross-section so the BLACK root, drawn on top,
  // stays clearly visible below the surface (diagrammatic, not a black void).
  const soilBot = groundY + rootBot*1.30;
  if (P.earth){
    g.save();
    g.fillStyle = inkLevel(params.earthTone);            // light soil (level 2)
    g.beginPath();
    g.moveTo(0, groundY);
    const crestN=12;
    for(let i=0;i<=crestN;i++){
      const x=(i/crestN)*W;
      const y=groundY + ((i%2)?-4:2) + (R()-0.5)*3;
      g.lineTo(x,y);
    }
    g.lineTo(W, soilBot); g.lineTo(0, soilBot); g.closePath(); g.fill();
    // crest contour (the ground line)
    pen.ink(()=>{
      g.moveTo(0,groundY);
      for(let i=0;i<=crestN;i++){ const x=(i/crestN)*W; g.lineTo(x, groundY+((i%2)?-4:2)); }
    }, 3);
    // a lower soil boundary + a few clods
    g.strokeStyle=INK; g.globalAlpha=0.35; g.lineWidth=2;
    g.beginPath(); g.moveTo(0,soilBot); g.lineTo(W,soilBot); g.stroke(); g.globalAlpha=1;
    g.fillStyle=inkLevel(params.earthTone+2);
    for(let i=0;i<20;i++){
      const x=R()*W, y=groundY+10+R()*(soilBot-groundY-18);
      g.beginPath(); g.arc(x,y,2+R()*3,0,7); g.fill();
    }
    g.restore();
  }

  // ---------- ROTATED plant frame (about the collar pivot) ----------
  g.save();
  g.translate(pivot.x, pivot.y);
  g.rotate(P.angle);

  // ROOT: gnarled black strands radiating down/out from the collar
  const strands = [
    { dir:-0.42, len:1.02, w:15, curl: 26, tone:params.rootTone },
    { dir: 0.10, len:1.14, w:18, curl:-10, tone:params.rootTone },   // taproot
    { dir: 0.55, len:0.96, w:14, curl:-28, tone:params.rootMid  },
    { dir:-0.90, len:0.70, w:10, curl: 34, tone:params.rootMid  },
    { dir: 1.00, len:0.66, w:10, curl:-30, tone:params.rootMid  },
  ];
  for(const s of strands){
    const a = s.dir;                      // 0 = straight down
    const dx = Math.sin(a), dy = Math.cos(a);
    drawRootStrand(pen, g, 0, rootBot*0.14, dx, dy, rootBot*s.len, s.w, s.curl, s.tone);
  }
  // central knotted tuber crown of the root (full ink)
  pen.paint(()=>{
    g.moveTo(-params.stemW*0.9, 0);
    g.quadraticCurveTo(-params.stemW*1.5, rootBot*0.24, -params.stemW*0.5, rootBot*0.42);
    g.quadraticCurveTo( 0, rootBot*0.30, params.stemW*0.6, rootBot*0.44);
    g.quadraticCurveTo( params.stemW*1.5, rootBot*0.22, params.stemW*0.9, 0);
    g.closePath();
  }, toneSolid(inkLevel(params.rootTone)), 4);
  // a couple of knot creases on the tuber
  g.strokeStyle=INK; g.lineWidth=1.6; g.globalAlpha=0.5;
  for(let k=0;k<2;k++){
    g.beginPath();
    g.moveTo(-params.stemW*0.6, rootBot*(0.12+k*0.12));
    g.quadraticCurveTo(0, rootBot*(0.20+k*0.12), params.stemW*0.6, rootBot*(0.12+k*0.12));
    g.stroke();
  }
  g.globalAlpha=1;

  // dirt clods clinging + falling (uprooted)
  if (P.dirt){
    g.fillStyle=inkLevel(params.earthTone+1);
    const clods=[[-18,rootBot*0.5,10],[22,rootBot*0.62,8],[-6,rootBot*0.86,7],[30,rootBot*0.34,6]];
    for(const [dxc,dyc,rc] of clods){ g.beginPath(); g.arc(dxc,dyc,rc,0,7); g.fill(); }
    // falling motion streaks
    g.strokeStyle="rgba(0,0,0,0.22)"; g.lineWidth=2.4; g.lineCap="round";
    for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(-10+k*16, rootBot*0.9); g.lineTo(-10+k*16, rootBot*1.14); g.stroke(); }
  }

  // STEM: slim pale stalk from tuber crown up to the bloom base
  const stemBotY = 0;
  pen.paint(()=>{
    g.moveTo(-params.stemW*0.42, stemBotY);
    g.quadraticCurveTo(-params.stemW*0.30, (stemBotY+stemTopLocalY)/2, -params.stemW*0.34, stemTopLocalY);
    g.lineTo( params.stemW*0.34, stemTopLocalY);
    g.quadraticCurveTo( params.stemW*0.30, (stemBotY+stemTopLocalY)/2, params.stemW*0.42, stemBotY);
    g.closePath();
  }, toneSolid(inkLevel(params.stemTone)), 4);
  // a pair of small stem leaves
  drawPetal(pen, g, -params.stemW*0.3, lerp(stemBotY,stemTopLocalY,0.42), -0.92, 0.30, br*0.52, br*0.20, params.stemTone);
  drawPetal(pen, g,  params.stemW*0.3, lerp(stemBotY,stemTopLocalY,0.60),  0.92, 0.26, br*0.46, br*0.18, params.stemTone);

  // grip highlight (held): a bracket where the hand takes the stem
  if (P.grip){
    const gy = lerp(stemBotY, stemTopLocalY, 0.30);
    g.strokeStyle=ACCENT; g.lineWidth=3; g.lineCap="round";
    g.beginPath(); g.moveTo(-params.stemW*1.1, gy-10); g.lineTo(-params.stemW*1.1, gy+10); g.stroke();
    g.beginPath(); g.moveTo( params.stemW*1.1, gy-10); g.lineTo( params.stemW*1.1, gy+10); g.stroke();
  }

  // FLOWER: the milk-white bloom (near-paper petals in a hard black contour)
  if (!P.ghost){
    drawFlower(pen, g, 0, flowerLocalY, br, P);
  } else {
    // ingested: bloom consumed -> faint ghost outline of where it was
    g.save();
    g.strokeStyle=INK; g.globalAlpha=0.32; g.lineWidth=2; g.setLineDash([7,7]);
    for(let i=0;i<params.petalN;i++){
      const th=(i/params.petalN)*Math.PI*2, dx=Math.sin(th), dy=-Math.cos(th);
      const bx=dx*br*0.22, by=flowerLocalY+dy*br*0.22;
      const r=outwardRot(dx,dy);
      g.save(); g.translate(bx,by); g.rotate(r);
      g.beginPath(); g.moveTo(0,0);
      g.quadraticCurveTo(br*0.5, br*0.44, 0, br*0.98);
      g.quadraticCurveTo(-br*0.5, br*0.44, 0, 0); g.stroke();
      g.restore();
    }
    g.setLineDash([]); g.globalAlpha=1; g.restore();
  }

  g.restore(); // end rotated frame

  // ---------- SCREEN-SPACE: divot / hole where it was pulled (uprooted/held) ----------
  if (P.hole){
    g.save();
    g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=3;
    g.beginPath(); g.ellipse(cx, groundY+6, br*0.55, br*0.16, 0, 0, Math.PI*2); g.stroke();
    g.fillStyle="rgba(0,0,0,0.12)";
    g.beginPath(); g.ellipse(cx, groundY+6, br*0.5, br*0.12, 0, Math.PI, Math.PI*2); g.fill();
    g.globalAlpha=1; g.restore();
  }

  // ---------- SCREEN-SPACE: ingestion mote (the herb's virtue taken in) ----------
  if (P.ingest){
    g.save();
    const mx = fwx, my = fwy - br*0.2;
    // rising bright core with short rays -> essence internalized
    g.fillStyle="#ffffff";
    g.beginPath(); g.arc(mx, my, br*0.16, 0, 7); g.fill();
    g.strokeStyle=INK; g.lineWidth=2.5; g.beginPath(); g.arc(mx, my, br*0.16, 0, 7); g.stroke();
    g.strokeStyle="rgba(0,0,0,0.45)"; g.lineWidth=2; g.lineCap="round";
    for(let i=0;i<8;i++){ const a=(i/8)*Math.PI*2; g.beginPath();
      g.moveTo(mx+Math.cos(a)*br*0.22, my+Math.sin(a)*br*0.22);
      g.lineTo(mx+Math.cos(a)*br*0.34, my+Math.sin(a)*br*0.34); g.stroke(); }
    // upward trail
    g.setLineDash([4,6]); g.strokeStyle="rgba(0,0,0,0.4)";
    g.beginPath(); g.moveTo(mx, my-br*0.28); g.lineTo(mx, my-br*0.72); g.stroke();
    g.setLineDash([]); g.restore();
  }
}

export const asset = {
  id:"prop.moly-plant",
  type:"PROP",
  name:"Moly Plant",
  statusWord:"ROOTED",
  scene:"OD-B10-S05",

  params,
  // back -> front draw order the module honors
  layers:["glow","root","tuber","dirt","stem","stem-leaves","grip","flower","earth","hole","ingest-mote"],

  // normalized 0..1 attachment / contact anchors (neutral 'rooted' pose)
  anchors:{
    "flower:center":{x:.50,y:.32},   // milk-white bloom heart (effect origin)
    "flower:crown":{x:.50,y:.18},    // topmost petal tip
    grip:{x:.50,y:.55},              // where a hand takes the stem (the pivot-ish)
    "collar":{x:.50,y:.66},          // stem meets root
    "root:tip":{x:.52,y:.86},        // deepest black root tip
    "contact:earth":{x:.50,y:.66},   // where it roots in the soil
    "contact:lips":{x:.50,y:.30},    // where the herb meets the mouth when eaten
  },
  // collision shape: an oriented capsule from bloom to root tip (asset space)
  collision:{ kind:"capsule", a:{x:.50,y:.18}, b:{x:.52,y:.86}, r:.12 },
  ownership:"hermes->odysseus",      // dug by Hermes, given to Odysseus

  states:{
    initial:"rooted",
    nodes:{
      rooted:              { preview:{ mode:"rooted",              status:"ROOTED",    progress:0.18 } },
      uprooted:            { preview:{ mode:"uprooted",            status:"UPROOTED",  progress:0.42 } },
      held:                { preview:{ mode:"held",                status:"HELD",      progress:0.60 } },
      ingested:            { preview:{ mode:"ingested",            status:"INGESTED",  progress:0.80 } },
      "protection-active": { preview:{ mode:"protection-active",   status:"PROTECTED", progress:1.00 } },
    },
    edges:[
      ["rooted","uprooted"],["uprooted","held"],["uprooted","rooted"],
      ["held","ingested"],["held","protection-active"],
      ["ingested","protection-active"],
    ],
  },
  channels:["mode","angle","lift","glow","t"],

  preview:()=>({ mode:"rooted", status:"ROOTED", progress:0.18, t:0 }),
  draw(ctx,W,H,state){ drawPlant(ctx,W,H,state||{}); return { anchors:asset.anchors, collision:asset.collision }; },
};
export default asset;
