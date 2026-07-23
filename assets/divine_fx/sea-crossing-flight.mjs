/* divine_fx.sea-crossing-flight — a LOW rapid travel field skimming the wave
   crests. DIVINE_FX asset. Scene function (OD-B05-S01): a divine traveller is
   launched from one sea-edge (SOURCE), streaks in a near-horizontal FIELD held
   just above the swell (a corridor of stacked speed lines), throwing a torn
   SPRAY WAKE off the crests it clips, and arrives at the far edge (TARGET). The
   visible consequence is a disturbed strip of sea — kicked-up spray and a
   wave-crest furrow drawn along the flight line.

   Procedural: SOURCE (near-edge launch bloom) -> FIELD (horizontal speed lines
   in a low travel band) -> the skimming STREAK body with a comet wake -> SPRAY
   flung off the clipped crests -> TARGET (far-edge landfall). Animates over
   state.t (0 = poised at the near edge, 1 = arrived at the far edge). The
   `intensity` channel scales speed-line length/darkness, spray density, and
   streak heat; `dir` flips the crossing (+1 = left->right).

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:   0.62,   // sea/sky waterline as frac of H — crests ride here
  travelY:   0.55,   // the flight band height — just ABOVE the crests
  dir:       1,      // crossing direction (+1 = left->right)
  lines:     7,      // stacked horizontal speed lines in the travel field
  crests:    9,      // wave-crest chevrons along the horizon
  spray:     14,     // torn spray flecks flung off the wake
  intensity: 1.0,    // overall field energy
};

/* ---- SKY: the airspace the streak crosses. Light field so the dark speed
   lines + streak read; a low sun/haze disc to the leeward edge. ---- */
function drawSky(pen,g,W,H,dir){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);              // open air (lightest)
  // low sun-haze disc near the target edge (bright, faint contour)
  const sx = dir>0 ? W*0.86 : W*0.14, sy = H*0.16, sr = W*0.070;
  pen.paint(()=>{ g.arc(sx,sy,sr,0,TAU); }, toneSolid(inkLevel(2)), 3);
  pen.fillPath(()=>{ g.arc(sx,sy,sr*0.5,0,TAU); }, inkLevel(1));
  // high air-drift streaks: faint long horizontal motion lines threading the
  // open air, so the crossing reads as travel THROUGH a vast airspace
  g.strokeStyle = inkLevel(2); g.lineCap="round";
  const drift = [[0.10,0.24,0.30],[0.55,0.30,0.22],[0.20,0.40,0.26],[0.62,0.10,0.18],[0.32,0.46,0.20]];
  for(const [dx,dy,dl] of drift){
    const y = H*dy, x0 = dir>0 ? W*dx : W*(1-dx-dl);
    g.lineWidth = 2.2; g.globalAlpha = 0.6;
    g.beginPath(); g.moveTo(x0, y);
    g.lineTo(x0 + dir*W*dl, y - H*0.006);
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---- SEA: base water + a row of wave-crest chevrons riding the horizon, plus
   a disturbed FURROW of steeper crests along the flight line beneath the head.
   The crests drift with t so the sea reads as moving under the skimming body. ---- */
function drawSea(pen,g,W,H,t,inten,dir,headX){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);          // water body (mid)
  g.fillStyle = inkLevel(4); g.fillRect(0,hy,W,H*0.028);       // darker seam at the waterline
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);

  const strength = clamp(inten,0,1.6);
  // rolling wave-crest chevrons stepping down the near water (foreground denser)
  g.lineCap="round"; g.lineJoin="round";
  const rows = 5;
  for(let r=0;r<rows;r++){
    const f = r/(rows-1);                                       // 0 far .. 1 near
    const y = lerp(hy+H*0.03, H*0.97, f);
    const step = lerp(52, 34, f);
    const amp  = lerp(5, 16, f)*(0.7+0.4*strength);
    const drift = t*26*dir*(0.4+strength) + r*13;
    g.strokeStyle = inkLevel(Math.round(lerp(4,6,f)));
    g.lineWidth = lerp(2, 4.2, f);
    for(let x=-step; x<W+step; x+=step){
      const cx = x + (drift % step);
      g.beginPath();
      g.moveTo(cx, y);
      g.lineTo(cx + step*0.32 + dir*amp*0.3, y - amp);
      g.lineTo(cx + step*0.62, y);
      g.stroke();
    }
  }

  // disturbed FURROW: a bright cut in the crest right under the travelling head
  const fy = hy + H*0.012;
  g.strokeStyle = inkLevel(2); g.lineWidth = 4; g.lineCap="round"; g.globalAlpha = 0.85;
  g.beginPath();
  g.moveTo(headX - dir*W*0.16, fy);
  g.quadraticCurveTo(headX - dir*W*0.06, fy - H*0.02, headX, fy);
  g.stroke();
  g.globalAlpha = 1;
}

/* ---- FIELD: the low travel corridor — stacked near-horizontal speed lines
   held just above the crests. Center lines longest + darkest; they thin toward
   the band edges. Dashes stream toward the target = velocity. ---- */
function drawField(pen,g,W,H,t,inten,dir){
  const by = H*params.travelY, n = params.lines;
  const strength = clamp(inten,0,1.6);
  const band = H*0.11;                                          // vertical thickness of the corridor
  g.save(); g.lineCap="round";
  for(let i=0;i<n;i++){
    const f = n>1 ? (i/(n-1))*2-1 : 0;                          // -1..1 across the band
    const y = by + f*band*0.5;
    const edge = 1 - Math.abs(f)*0.55;                          // center strongest
    const len = lerp(W*0.30, W*0.72, clamp(strength,0,1.2)) * (0.6+0.4*edge);
    const x1 = dir>0 ? W*0.94 : W*0.06;
    const x0 = x1 - dir*len;
    g.strokeStyle = inkLevel(2 + Math.round(edge*3));           // ~2..5
    g.lineWidth = (1.4 + edge*2.6);
    g.setLineDash([W*0.05, W*0.028]);
    g.lineDashOffset = -(t*W*1.1 + i*9)*dir;                    // dashes stream toward target
    g.globalAlpha = (0.5 + 0.4*edge)*clamp(strength,0,1.3);
    g.beginPath();
    g.moveTo(x0, y + Math.sin(t*1.4+i)*2);
    g.lineTo(x1, y);
    g.stroke();
  }
  g.setLineDash([]); g.globalAlpha = 1; g.restore();
}

/* ---- SPRAY WAKE: torn flecks of water flung UP and BACK off the crests the
   body clips — a tapered fan trailing the head, densest just behind it. ---- */
function drawSpray(pen,g,W,H,headX,headY,t,inten,dir,seed){
  const strength = clamp(inten,0,1.6);
  const n = Math.round(params.spray*(0.5+0.5*strength));
  let s = seed>>>0 || 7;
  const rr = ()=>{ s ^= s<<13; s ^= s>>>17; s ^= s<<5; return ((s>>>0)%100000)/100000; };
  g.fillStyle = inkLevel(6);
  for(let i=0;i<n;i++){
    const back = rr();                                          // 0 near head .. 1 far back
    const bx = headX - dir*back*W*0.24 - dir*W*0.02;
    const up = (rr()*rr())*H*0.10;                              // biased low, some high flecks
    const by = headY + H*0.02 - up + (rr()-0.5)*H*0.02;
    const rad = lerp(3.4, 1.0, back)*(0.7+0.5*strength);
    g.globalAlpha = (0.85*(1-back)+0.15);
    g.beginPath(); g.arc(bx, by, Math.max(0.8,rad), 0, TAU); g.fill();
  }
  g.globalAlpha = 1;
  // a couple of longer torn streaks lifting off the wake
  g.strokeStyle = inkLevel(5); g.lineWidth = 2.4; g.lineCap="round";
  for(let k=0;k<3;k++){
    const bx = headX - dir*W*(0.05+k*0.06);
    const y0 = headY + H*0.02;
    g.globalAlpha = 0.7-0.15*k;
    g.beginPath();
    g.moveTo(bx, y0);
    g.quadraticCurveTo(bx - dir*W*0.03, y0 - H*0.05, bx - dir*W*0.05, y0 - H*0.075 - k*H*0.01);
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---- COMET WAKE: a bundle of tapered speed streaks streaming back from the
   head along the travel band — reads as rapid horizontal motion. ---- */
function drawWake(pen,g,W,H,headX,headY,t,inten,dir){
  const strength = clamp(inten,0,1.6);
  const nT = 5;
  g.lineCap="round";
  const tailX = headX - dir*W*(0.16+0.10*clamp(strength,0,1.4));
  for(let i=0;i<nT;i++){
    const f = nT>1 ? (i/(nT-1))*2-1 : 0;                        // -1..1 across the wake
    const cen = 1 - Math.abs(f);
    const y = headY + f*H*0.028;
    const bx = lerp(headX, tailX, 0.4 + 0.6*cen);              // center reaches furthest back
    g.strokeStyle = inkLevel(4 + Math.round(cen*2));           // 4..6
    g.lineWidth = (1.4 + cen*4.0)*(0.55+0.45*clamp(strength,0,1.3));
    g.globalAlpha = 0.7 + 0.3*cen;
    g.beginPath();
    g.moveTo(bx, y);
    g.quadraticCurveTo(lerp(bx,headX,0.5), (y+headY)/2, headX - dir*W*0.01, headY);
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---- STREAK BODY: the skimming divine traveller — a horizontal teardrop head
   pointing toward the target, with a bright hot core and short forward slashes. ---- */
function drawStreak(pen,g,W,H,headX,headY,inten,dir){
  const hw = W*0.070, hh = W*0.030;                            // long horizontal teardrop
  pen.paint(()=>{
    g.moveTo(headX + dir*hw, headY);                            // nose (leading point)
    g.quadraticCurveTo(headX, headY - hh, headX - dir*hw*0.55, headY);
    g.quadraticCurveTo(headX, headY + hh, headX + dir*hw, headY);
    g.closePath();
  }, toneSolid(inkLevel(7)), Math.max(2, W*0.007));
  // hot core (bright -> tonal contrast against the black head)
  pen.fillPath(()=>{ g.ellipse(headX - dir*hw*0.1, headY, hh*0.5, hh*0.34, 0, 0, TAU); }, inkLevel(1));
  // short forward speed slashes ahead of the nose
  g.strokeStyle = inkLevel(5); g.lineWidth = 2.4; g.lineCap="round"; g.globalAlpha = 0.85;
  for(const s of [-1,1]){
    g.beginPath();
    g.moveTo(headX + dir*hw*1.25, headY + s*hh*0.5);
    g.lineTo(headX + dir*hw*1.7, headY + s*hh*0.25);
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---- SOURCE / TARGET: launch bloom at the near edge, landfall mark at the far
   edge — small radiant nodes anchoring the crossing. ---- */
function drawEndpoint(pen,g,W,H,cx,cy,r,active){
  pen.paint(()=>{ g.arc(cx,cy,r,0,TAU); }, toneSolid(inkLevel(active?7:4)), Math.max(2,W*0.006));
  pen.fillPath(()=>{ g.arc(cx,cy,r*0.42,0,TAU); }, inkLevel(1));
  if (active){
    g.strokeStyle = INK; g.lineWidth = 2.6; g.lineCap="round";
    for(let a=0;a<8;a++){
      const ang=(a/8)*TAU, r0=r*1.2, r1=r*(1.7+0.25*(a%2));
      g.beginPath();
      g.moveTo(cx+Math.cos(ang)*r0, cy+Math.sin(ang)*r0);
      g.lineTo(cx+Math.cos(ang)*r1, cy+Math.sin(ang)*r1);
      g.stroke();
    }
  }
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = clamp01(st.t ?? 0);
  const inten = st.intensity ?? params.intensity;
  const dir = st.dir ?? params.dir;
  const layers = st.layers || ["sky","sea","field","wake","spray","streak","source","target"];
  const has = l => layers.includes(l);

  const te = smooth(t);
  const by = H*params.travelY;
  const nearX = dir>0 ? W*0.08 : W*0.92;
  const farX  = dir>0 ? W*0.92 : W*0.08;
  const headX = lerp(nearX, farX, te);
  const headY = by + Math.sin(t*6)*H*0.006;                    // slight skim bob

  if (has("sky"))    drawSky(pen,g,W,H,dir);
  if (has("sea"))    drawSea(pen,g,W,H,t,inten,dir,headX);
  if (has("field"))  drawField(pen,g,W,H,t,inten,dir);
  if (has("wake"))   drawWake(pen,g,W,H,headX,headY,t,inten,dir);
  if (has("spray"))  drawSpray(pen,g,W,H,headX,headY,t,inten,dir,1337);
  if (has("streak")) drawStreak(pen,g,W,H,headX,headY,inten,dir);
  if (has("source")) drawEndpoint(pen,g,W,H,nearX,by,W*0.030, t<0.12);
  if (has("target")) drawEndpoint(pen,g,W,H,farX, by,W*0.030, t>0.88);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.sea-crossing-flight",
  type:"DIVINE_FX",
  name:"Sea-crossing flight",
  statusWord:"SKIMMING",
  scene:"OD-B05-S01",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sky","sea","field","wake","spray","streak","source","target"],
  // normalized 0..1 source/target/field/consequence anchors
  anchors:{
    "source:near-edge":{ x:0.08, y:0.52 },   // launch point
    "target:far-edge":{  x:0.92, y:0.52 },   // landfall point
    "field:band":{       x:0.50, y:0.52 },   // the low travel corridor
    "streak:head":{      x:0.50, y:0.52 },   // representative mid-crossing position
    "wake:sea":{         x:0.42, y:0.62 },   // disturbed sea strip
    "camera:wide":{      x:0.50, y:0.50 },
  },
  // the low corridor the flight body travels through (normalized band)
  zones:{
    corridor:{ x0:0.06, y0:0.46, x1:0.94, y1:0.58 },
    sea:{      x0:0.00, y0:0.60, x1:1.00, y1:1.00 },
  },
  // transformation states over the crossing
  states:{
    initial:"launched",
    nodes:{
      launched:{ preview:{ t:0.04, intensity:0.9, status:"LAUNCHED", progress:0.04 } },
      skimming:{ preview:{ t:0.5,  intensity:1.2, status:"SKIMMING", progress:0.50 } },
      arrived:{  preview:{ t:0.98, intensity:0.9, status:"ARRIVED",  progress:1.00 } },
    },
    edges:[["launched","skimming"],["skimming","arrived"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","dir"],

  // neutral preview: mid-crossing — head near center over a torn wake, speed
  // lines streaming, spray flung off the crests (reads unmistakably as a low
  // rapid sea-skimming flight).
  preview:()=>({ t:0.5, intensity:1.2, dir:1, status:"SKIMMING", progress:0.5,
                 layers:["sky","sea","field","wake","spray","streak","source","target"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
