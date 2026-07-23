/* environment.charybdis — the colossal cyclical sea-whirlpool.
   ENVIRONMENT asset (procedural world force). Scene (OD-B12-S04): a huge
   spiraling vortex funnel that INHALES the sea three times a day (deep terraced
   funnel + exposed seabed at the throat), then ERUPTS it back as a towering
   spray geyser, then RELEASES to a calmer swirl — a self-repeating maelstrom.

   Procedural field: a great throat at (cx,cy) drawn as nested terraced ellipses
   sinking down into darkness (the funnel walls), two logarithmic spiral arms
   winding down the walls (the swirl, rotating over t), a SUCTION RADIUS ring
   with inward tick-arrows marking the pull boundary, and a SOUND FIELD of
   radiating arcs (the roar). The cycle is driven by three scalar channels the
   runtime blends over t:
     depth  (0..1) — how deep/dark the funnel bites (inhale)
     seabed (0..1) — exposed rocky sea-floor visible at the throat (peak inhale)
     spray  (0..1) — erupting geyser column height (erupt)

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  cx:        0.50,   // whirlpool centre x (frac of W)
  cy:        0.52,   // whirlpool centre y (frac of H)
  rimRx:     0.40,   // outer rim radius x (frac of W)
  rimRy:     0.24,   // outer rim radius y (frac of H) — foreshortened (top-down tilt)
  rings:     9,      // nested terraced funnel bands
  drop:      0.16,   // how far the throat sinks below the rim (frac of H) — the funnel depth
  arms:      2,      // spiral swirl arms
  suctionR:  0.47,   // suction-radius ring (frac of W) — the pull boundary
  spin:      1.0,    // swirl rotation speed
};

/* ---- SKY + SEA: light air band up top, mid-tone open water the vortex bites into ---- */
function drawSea(pen,g,W,H){
  const cy = H*params.cy, rimRy = H*params.rimRy;
  const horizon = cy - rimRy*1.35;
  // air / far sea (light)
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  // open water body (mid) filling the rest of the field
  g.fillStyle = inkLevel(3); g.fillRect(0,horizon,W,H-horizon);
  // a darker seam at the waterline
  g.fillStyle = inkLevel(4); g.fillRect(0,horizon,W,H*0.012);
  pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 3);
}

/* ---- SOUND FIELD: concentric roar-arcs radiating outward beyond the suction
   ring, breathing over t. Left+right side arcs so it reads as an emitter halo. ---- */
function drawSound(pen,g,W,H,t,inten){
  const cx = W*params.cx, cy = H*params.cy;
  const baseR = W*params.suctionR;
  const aspect = params.rimRy*H/(params.rimRx*W);
  g.lineCap="round";
  for(let i=0;i<3;i++){
    const puls = 0.5 + 0.5*Math.sin(t*1.6 - i*0.9);
    const rr = baseR*(1.05 + i*0.14) + W*0.02*puls*inten;
    g.strokeStyle = inkLevel(2);
    g.lineWidth = lerp(3.2, 1.4, i/2);
    // two facing arcs (leave a gap top/bottom so it reads as sound, not a full ring)
    g.beginPath(); g.ellipse(cx,cy, rr, rr*aspect, 0,  TAU*0.06, TAU*0.44); g.stroke();
    g.beginPath(); g.ellipse(cx,cy, rr, rr*aspect, 0,  TAU*0.56, TAU*0.94); g.stroke();
  }
}

/* ---- SUCTION RADIUS: the pull-boundary ring with short inward tick-arrows all
   round it (the diagrammatic suction field being dragged toward the throat). ---- */
function drawSuction(pen,g,W,H,t,inten){
  const cx = W*params.cx, cy = H*params.cy;
  const rx = W*params.suctionR, ry = rx*(params.rimRy*H/(params.rimRx*W));
  // the boundary ring (mid, hard)
  g.strokeStyle = inkLevel(4); g.lineWidth = 3; g.setLineDash([W*0.02, W*0.012]);
  g.beginPath(); g.ellipse(cx,cy, rx, ry, 0, 0, TAU); g.stroke();
  g.setLineDash([]);
  // inward-pointing tick arrows around the ring — the drag toward the eye
  const ticks = 20;
  const pull = W*0.028*(0.7+0.4*inten) * (0.85+0.15*Math.sin(t*2.2));
  g.strokeStyle = inkLevel(5); g.lineWidth = 2.4; g.lineCap="round";
  for(let k=0;k<ticks;k++){
    const a = (k/ticks)*TAU;
    const ox = cx+Math.cos(a)*rx,      oy = cy+Math.sin(a)*ry;
    const ux = (cx-ox), uy = (cy-oy);  const L=Math.hypot(ux,uy)||1;
    const ix = ox+ux/L*pull,           iy = oy+uy/L*pull;
    g.beginPath(); g.moveTo(ox,oy); g.lineTo(ix,iy); g.stroke();
    // little chevron head at the inner tip
    const nx=-uy/L, ny=ux/L, hs=pull*0.42;
    g.beginPath();
    g.moveTo(ix - ux/L*hs - nx*hs*0.7, iy - uy/L*hs - ny*hs*0.7);
    g.lineTo(ix,iy);
    g.moveTo(ix - ux/L*hs + nx*hs*0.7, iy - uy/L*hs + ny*hs*0.7);
    g.lineTo(ix,iy);
    g.stroke();
  }
}

/* ---- FUNNEL: nested terraced ellipses sinking from the rim down to a dark
   throat. Each band is lower + smaller + darker than the last, so the overlap
   reads as concentric terraces receding into a deep cone. `depth` deepens the
   sink and darkens the throat (the inhale). ---- */
function drawFunnel(pen,g,W,H,t,depth,inten){
  const cx = W*params.cx, cy = H*params.cy;
  const rimRx = W*params.rimRx, rimRy = H*params.rimRy;
  const drop = H*params.drop * lerp(0.55, 1.15, depth);
  const R = params.rings;
  const throatF = 0.10;
  for(let i=0;i<=R;i++){
    const f = i/R;                         // 0 rim .. 1 throat
    const rx = lerp(rimRx, rimRx*throatF, f);
    const ry = lerp(rimRy, rimRy*throatF, f);
    const ey = cy + Math.pow(f,1.25)*drop; // centre sinks toward the throat
    const lvl = lerp(2.4, lerp(5.6,7,depth), Math.pow(f,0.8));  // lighter rim .. dark deep
    pen.paint(()=>{ g.ellipse(cx, ey, rx, ry, 0, 0, TAU); }, toneSolid(inkLevel(lvl)), i===0?4:2.2);
  }
  // spiral swirl arms winding down the funnel walls
  const arms = params.arms, aspect = rimRy/rimRx;
  const spin = t*params.spin;
  g.lineCap="round"; g.lineJoin="round";
  for(let a=0;a<arms;a++){
    const a0 = a*(TAU/arms) + spin;
    g.strokeStyle = inkLevel(5); g.lineWidth = lerp(5.5, 2, 0);
    g.beginPath();
    let first=true;
    for(let th=0; th<=TAU*2.6; th+=0.14){
      const nr = Math.exp(-0.20*th);            // 1 outer .. ~0 centre
      if (nr < throatF) break;
      const r = nr;
      const ang = a0 + th;
      const px = cx + Math.cos(ang)*rimRx*r;
      const py = cy + (1-nr)*drop + Math.sin(ang)*rimRx*r*aspect;
      g.lineWidth = lerp(6, 1.6, th/(TAU*2.6));  // fat at rim, fine into throat
      if (first){ g.moveTo(px,py); first=false; }
      else g.lineTo(px,py);
    }
    g.stroke();
  }
  return { cx, cy, rimRx, rimRy, drop, throatF };
}

/* ---- THROAT: the deep centre. In heavy inhale with `seabed` up, the exposed
   sandy sea-floor + a few dark rocks show at the bottom of the cone; otherwise a
   plain dark hole. ---- */
function drawThroat(pen,g,W,H,fn,depth,seabed){
  const cx=fn.cx, ty=fn.cy+fn.drop, rx=fn.rimRx*fn.throatF*1.1, ry=fn.rimRy*fn.throatF*1.1;
  if (seabed > 0.02){
    // exposed sandy seabed disc (light) with dark rock lumps
    const sr = rx*lerp(1.1, 2.2, seabed), srY = ry*lerp(1.1, 2.2, seabed);
    pen.paint(()=>{ g.ellipse(cx, ty, sr, srY, 0, 0, TAU); }, toneSolid(inkLevel(2)), 3);
    const rocks=[[-0.4,0.1,0.42],[0.35,-0.15,0.34],[0.05,0.35,0.3],[-0.15,-0.3,0.26]];
    for(const [dx,dy,rr] of rocks){
      pen.paint(()=>{ g.ellipse(cx+dx*sr, ty+dy*srY, rr*sr*0.5, rr*srY*0.5, 0, 0, TAU); }, toneSolid(inkLevel(6)), 2.2);
    }
  } else {
    // plain dark throat hole
    pen.paint(()=>{ g.ellipse(cx, ty, rx*lerp(1.0,1.4,depth), ry*lerp(1.0,1.4,depth), 0, 0, TAU); },
              toneSolid(inkLevel(7)), 3);
  }
}

/* ---- GEYSER: the eruption. A tapered light spray column bursting up from the
   throat with a crown splash and droplets fanning out. Height scales with
   `spray`. Bright (spray) with hard contour so it reads against the dark funnel. ---- */
function drawGeyser(pen,g,W,H,fn,t,spray){
  if (spray < 0.02) return;
  const cx=fn.cx, baseY=fn.cy + fn.drop*0.4;
  const hgt = H*0.34*spray;
  const topY = baseY - hgt;
  const halfW = fn.rimRx*0.20;
  const wob = Math.sin(t*3)*halfW*0.12;
  // column body (light spray) — tapered, widening a touch at the crown
  pen.paint(()=>{
    g.moveTo(cx-halfW*0.9, baseY);
    g.quadraticCurveTo(cx-halfW*0.55+wob, (baseY+topY)/2, cx-halfW*0.75+wob, topY);
    g.lineTo(cx+halfW*0.75+wob, topY);
    g.quadraticCurveTo(cx+halfW*0.55+wob, (baseY+topY)/2, cx+halfW*0.9, baseY);
    g.closePath();
  }, toneSolid(inkLevel(2)), 3);
  // vertical spray streaks inside the column (mid)
  g.strokeStyle = inkLevel(4); g.lineWidth = 2; g.lineCap="round";
  for(let s=-2;s<=2;s++){
    const sx = cx + s*halfW*0.32;
    g.beginPath(); g.moveTo(sx, baseY-hgt*0.06);
    g.quadraticCurveTo(sx+wob*0.5, (baseY+topY)/2, sx+wob, topY+hgt*0.05); g.stroke();
  }
  // crown splash — a fan of droplet lobes bursting at the top
  const drops = 9;
  for(let d=0;d<drops;d++){
    const a = lerp(-0.9, 0.9, d/(drops-1)) - Math.PI/2;   // fan upward
    const rr = halfW*(1.3+0.5*Math.sin(d*1.7+t*2))*(0.6+0.7*spray);
    const dx = cx+wob + Math.cos(a)*rr;
    const dy = topY + Math.sin(a)*rr*0.9;
    pen.paint(()=>{ g.ellipse(dx, dy, halfW*0.22, halfW*0.22, 0, 0, TAU); }, toneSolid(inkLevel(2)), 2);
  }
  // a couple of arcing spray sheets peeling off the crown
  g.strokeStyle = inkLevel(3); g.lineWidth = 2.4;
  for(const side of [-1,1]){
    g.beginPath();
    g.moveTo(cx+wob, topY+halfW*0.2);
    g.quadraticCurveTo(cx+side*halfW*2.4, topY-halfW*0.6, cx+side*halfW*3.2, topY+halfW*1.6);
    g.stroke();
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten  = st.intensity ?? 1.0;
  const depth  = clamp01(st.depth ?? 0.7);
  const seabed = clamp01(st.seabed ?? 0);
  const spray  = clamp01(st.spray ?? 0);
  const layers = st.layers || ["sea","sound","suction","funnel","throat","geyser"];
  const has = l => layers.includes(l);

  if (has("sea"))     drawSea(pen,g,W,H);
  if (has("sound"))   drawSound(pen,g,W,H,t,inten);
  if (has("suction")) drawSuction(pen,g,W,H,t,inten);
  let fn = null;
  if (has("funnel"))  fn = drawFunnel(pen,g,W,H,t,depth,inten);
  if (!fn) fn = { cx:W*params.cx, cy:H*params.cy, rimRx:W*params.rimRx, rimRy:H*params.rimRy, drop:H*params.drop, throatF:0.10 };
  if (has("throat"))  drawThroat(pen,g,W,H,fn,depth,seabed);
  if (has("geyser"))  drawGeyser(pen,g,W,H,fn,t,spray);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"environment.charybdis",
  type:"ENVIRONMENT",
  name:"Charybdis",
  statusWord:"INHALING",
  scene:"OD-B12-S04",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["sea","sound","suction","funnel","throat","geyser"],
  // normalized 0..1 field anchors: the throat eye, rim, suction boundary, roar
  anchors:{
    "eye:throat":{     x:0.50, y:0.68 },   // the swallowing centre (sinks below rim)
    "rim:north":{      x:0.50, y:0.28 },
    "rim:west":{       x:0.10, y:0.52 },
    "rim:east":{       x:0.90, y:0.52 },
    "suction:boundary":{ x:0.97, y:0.52 }, // edge of the pull radius
    "geyser:top":{     x:0.50, y:0.20 },   // eruption crest (erupt state)
    "sound:source":{   x:0.50, y:0.52 },   // roar emitter (whole vortex)
    "camera:wide":{    x:0.50, y:0.50 },
  },
  // affected regions: the pull disc, the throat eye, open water outside
  zones:{
    pull:{   x0:0.03, y0:0.26, x1:0.97, y1:0.86 },
    throat:{ x0:0.42, y0:0.60, x1:0.58, y1:0.76 },
    openwater:{ x0:0.00, y0:0.36, x1:1.00, y1:1.00 },
  },
  // ENVIRONMENT state machine: the three-a-day cycle inhale -> release -> erupt
  states:{
    initial:"inhale",
    nodes:{
      // inhale: deep funnel bites, seabed laid bare at the throat, hard suction
      inhale:{ preview:{ t:1.6, depth:1.0, seabed:0.85, spray:0.0, intensity:1.3,
                         status:"INHALING", progress:0.28,
                         layers:["sea","sound","suction","funnel","throat"] } },
      // erupt: the swallowed sea heaved back up as a towering spray geyser
      erupt:{ preview:{ t:2.4, depth:0.35, seabed:0.0, spray:1.0, intensity:1.5,
                        status:"ERUPTING", progress:0.72,
                        layers:["sea","sound","suction","funnel","throat","geyser"] } },
      // release: the maelstrom eases — shallow swirl, no seabed, no geyser
      release:{ preview:{ t:3.0, depth:0.45, seabed:0.0, spray:0.15, intensity:0.8,
                          status:"RELEASING", progress:0.5,
                          layers:["sea","sound","suction","funnel","throat"] } },
    },
    edges:[["inhale","erupt"],["erupt","release"],["release","inhale"]],
  },
  duration:9.0,
  // animation channels the runtime can drive over the cycle clock
  channels:["t","depth","seabed","spray","intensity"],

  // neutral preview: the great swallowing inhale — deepest terraced funnel, two
  // spiral arms winding down, seabed bared at the throat, suction ring dragging
  // inward (reads unmistakably as the big spiral maelstrom).
  preview:()=>({ t:1.6, depth:1.0, seabed:0.8, spray:0.0, intensity:1.3,
                 status:"INHALING", progress:0.28,
                 layers:["sea","sound","suction","funnel","throat"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
