/* divine_fx.torchlit-night-memory — Penelope's loom as a temporal OVERLAY.
   DIVINE_FX asset. Scene function (OD-B02-S02): a single loom split by a
   vertical seam into two counter-running times — the DAY side where the web is
   woven forward (built-up cloth, sun overhead, thread motes settling DOWN into
   the weave) and the secret NIGHT side where the same web is un-woven in
   torchlight (loosening warp, a jagged dissolving hem, thread motes reversing
   UPWARD off the loose ends). Procedural: source (the loom) -> field (day/night
   split) -> transform (weave vs reversal) -> visible consequence (motes running
   opposite directions across the seam). Animate everything over state.t. Solid
   grays + hard contour only; the engine POST pass supplies the halftone (do NOT
   pre-dither). */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  loomTop:    0.14,   // top beam y as frac of H
  clothTop:   0.50,   // where the woven web begins as frac of H
  hem:        0.88,   // bottom of the web as frac of H
  leftPost:   0.13,   // loom post x (frac of W)
  rightPost:  0.87,
  warp:       15,     // number of vertical warp threads
  weftLines:  9,      // horizontal weft courses in the day cloth
  motes:      11,     // thread motes per side
  balance:    0.5,    // 0 = night dominates .. 1 = day dominates (channel-driven)
};

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);
// deterministic pseudo-random from an index
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

/* ---- the day/night SPLIT FIELD: one loom, two counter-running times ---- */
function drawField(pen,g,W,H,cx){
  const top = H*params.loomTop - H*0.02, bot = H*params.hem + H*0.02;
  // DAY half (left): near-paper, open light
  g.fillStyle = inkLevel(1); g.fillRect(0, top, cx, bot-top);
  // NIGHT half (right): a charged dark ground for the torchlit reversal
  g.fillStyle = inkLevel(3); g.fillRect(cx, top, W-cx, bot-top);
  // a deeper vignette up the night edge so the torch glow reads against it
  g.fillStyle = inkLevel(4); g.fillRect(W*0.80, top, W-W*0.80, bot-top);
}

/* ---- the SUN over the day side: forward-time marker ---- */
function drawSun(pen,g,W,H){
  const sx = W*0.27, sy = H*0.235, r = W*0.052;
  // rays
  g.strokeStyle = inkLevel(4); g.lineWidth = 3; g.lineCap="round";
  for(let i=0;i<12;i++){ const a=(i/12)*TAU; g.beginPath();
    g.moveTo(sx+Math.cos(a)*r*1.35, sy+Math.sin(a)*r*1.35);
    g.lineTo(sx+Math.cos(a)*r*1.95, sy+Math.sin(a)*r*1.95); g.stroke(); }
  // disc (bright, hollow — a daytime sun)
  pen.paint(()=>{ g.arc(sx,sy,r,0,TAU); }, toneSolid(inkLevel(2)), 5);
}

/* ---- the TORCH over the night side: reversal is lit by hand ---- */
function drawTorch(pen,g,W,H,pulse,inten){
  const hx = W*0.71, hy = H*0.30;            // flame base (torch head)
  // handle — a raked shaft down into the night
  pen.paint(()=>{
    g.moveTo(hx-W*0.012, hy);
    g.lineTo(hx+W*0.012, hy);
    g.lineTo(hx+W*0.055, hy+H*0.14);
    g.lineTo(hx+W*0.031, hy+H*0.14);
    g.closePath();
  }, toneSolid(inkLevel(6)), 5);
  // sconce cup
  pen.paint(()=>{ g.moveTo(hx-W*0.045,hy); g.lineTo(hx+W*0.045,hy);
    g.lineTo(hx+W*0.028,hy+H*0.03); g.lineTo(hx-W*0.028,hy+H*0.03); g.closePath();
  }, toneSolid(inkLevel(7)), 5);
  // glow rings — broken concentric arcs, unstable torchlight
  const gx=hx, gy=hy-H*0.02;
  for(let k=0;k<4;k++){
    const r = W*0.07 + k*W*0.055 + pulse*W*0.012*(k+1);
    g.strokeStyle = inkLevel(clamp(3-k,1,3)); g.lineWidth = lerp(5,2,k/4); g.lineCap="round";
    const segs = 6+k;
    for(let s=0;s<segs;s++){
      const a0=(s/segs)*TAU + pulse*0.5 + k*0.4;
      const a1=a0+(TAU/segs)*0.62;
      g.beginPath(); g.ellipse(gx,gy,r,r*1.04,0,a0,a1); g.stroke();
    }
  }
  // flame core (dark tongue) above the cup — tall, tapering to a point
  const fl = 1 + 0.16*Math.sin(pulse*TAU);
  pen.paint(()=>{
    g.moveTo(hx-W*0.030, hy);
    g.quadraticCurveTo(hx-W*0.050, hy-H*0.06*fl, hx-W*0.010, hy-H*0.115*fl);
    g.quadraticCurveTo(hx-W*0.004, hy-H*0.15*fl, hx, hy-H*0.175*fl);   // tip
    g.quadraticCurveTo(hx+W*0.006, hy-H*0.13*fl, hx+W*0.012, hy-H*0.09*fl);
    g.quadraticCurveTo(hx+W*0.045, hy-H*0.04*fl, hx+W*0.030, hy);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  // inner bright core
  pen.paint(()=>{ g.ellipse(hx, hy-H*0.04*fl, W*0.011, H*0.03*fl, 0, 0, TAU); }, toneSolid(inkLevel(2)), 2);
}

/* ---- the WARP: vertical threads strung on the loom, drawn full length.
   On the NIGHT side the warp loosens (waver + gaps) as the web is undone. ---- */
function drawWarp(pen,g,W,H,cx,pulse,inten){
  const x0=W*params.leftPost, x1=W*params.rightPost;
  const top=H*params.loomTop+H*0.02, bot=H*params.hem;
  const n=params.warp;
  for(let i=0;i<n;i++){
    const x = lerp(x0+W*0.02, x1-W*0.02, i/(n-1));
    const night = x>cx;
    g.strokeStyle = inkLevel(night?2:3);
    g.lineWidth = night?2:2.5; g.lineCap="round";
    g.beginPath(); g.moveTo(x,top);
    // day warp is taut; night warp wavers loose in the torchlight
    const steps=10;
    for(let sI=1;sI<=steps;sI++){
      const ty=lerp(top,bot,sI/steps);
      const wob = night ? Math.sin(ty*0.05 + i + pulse*TAU)*W*0.008*inten : 0;
      g.lineTo(x+wob, ty);
    }
    g.stroke();
  }
}

/* ---- the WOVEN WEB: DAY side a solid built-up cloth with weft courses;
   NIGHT side the same cloth un-woven — gaps open, the hem dissolves upward. ---- */
function drawCloth(pen,g,W,H,cx,t,inten){
  const x0=W*params.leftPost+W*0.02, x1=W*params.rightPost-W*0.02;
  const top=H*params.clothTop, hem=H*params.hem;
  // --- DAY cloth (left of seam): finished web, mid tone, ordered courses ---
  pen.paint(()=>{ g.rect(x0, top, cx-x0, hem-top); }, toneSolid(inkLevel(4)), 5);
  // weft courses (horizontal seams) — the ordered structure of weaving
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha=0.55;
  for(let j=1;j<params.weftLines;j++){
    const y=lerp(top,hem,j/params.weftLines);
    g.beginPath(); g.moveTo(x0,y); g.lineTo(cx,y); g.stroke();
  }
  g.globalAlpha=1;
  // a bright leading course at the growing edge (weaving-forward marker)
  const grow = hem - (0.10+0.06*Math.sin(t))* (hem-top);
  pen.paint(()=>{ g.rect(x0, grow-H*0.012, cx-x0, H*0.018); }, toneSolid(inkLevel(1)), 3);

  // --- NIGHT cloth (right of seam): the web being pulled apart ---
  // reversal front rises over time -> more of the cloth is undone (but the
  // fraying band stays visible so the un-weaving reads, not blank paper)
  const rev = clamp(0.30 + 0.16*(0.5+0.5*Math.sin(t*0.8)), 0.18, 0.55)*inten;
  // remaining intact cloth is the UPPER band; the lower band is dissolving.
  const intactBot = lerp(top, hem, 1-rev);
  // intact upper night cloth (still woven, slightly lighter than day = ghostly)
  pen.paint(()=>{ g.rect(cx, top, x1-cx, intactBot-top); }, toneSolid(inkLevel(3)), 4);
  g.strokeStyle = INK; g.lineWidth=2; g.globalAlpha=0.4;
  for(let j=1;j<params.weftLines;j++){
    const y=lerp(top,hem,j/params.weftLines);
    if (y<intactBot){ g.beginPath(); g.moveTo(cx,y); g.lineTo(x1,y); g.stroke(); }
  }
  g.globalAlpha=1;
  // the DISSOLVING hem: loose warp ends dangling below the reversal front,
  // with broken remnant wefts between them so the frayed band still has body
  const nWarpNight = 11;
  const dangleBase = hem-intactBot;
  for(let i=0;i<nWarpNight;i++){
    const x = lerp(cx+W*0.012, x1-W*0.012, i/(nWarpNight-1));
    const dangle = dangleBase*(0.60+0.40*pr(i,3));
    g.strokeStyle = inkLevel(4); g.lineWidth = 2.5; g.lineCap="round";
    g.beginPath(); g.moveTo(x,intactBot);
    const steps=6;
    for(let sI=1;sI<=steps;sI++){
      const ty=intactBot + dangle*(sI/steps);
      const wob=Math.sin(ty*0.06 + i*1.7 + t)*W*0.016;
      g.lineTo(x+wob, ty);
    }
    g.stroke();
  }
  // broken remnant weft threads still caught in the fraying band
  g.strokeStyle=inkLevel(3); g.lineWidth=2; g.lineCap="round";
  for(let j=0;j<5;j++){
    const y=lerp(intactBot+dangleBase*0.12, hem-H*0.01, j/5);
    const span = (x1-cx)*(0.62-0.10*j);           // shorter as it dissolves down
    const off = Math.sin(j*2.1+t)*W*0.02;
    g.beginPath(); g.moveTo(cx+W*0.02+off, y); g.lineTo(cx+W*0.02+off+span, y+Math.sin(j+t)*H*0.006); g.stroke();
  }
  // a torn reversal-front line across the night cloth
  g.strokeStyle=INK; g.lineWidth=3; g.beginPath();
  g.moveTo(cx,intactBot);
  for(let s=0;s<=8;s++){ const x=lerp(cx,x1,s/8); const y=intactBot+Math.sin(s*1.9+t)*H*0.01; g.lineTo(x,y); }
  g.stroke();
}

/* ---- the LOOM frame: posts + top beam + cloth beam, spanning BOTH times ---- */
function drawLoom(pen,g,W,H,cx){
  const x0=W*params.leftPost, x1=W*params.rightPost, pw=W*0.03;
  const top=H*params.loomTop, cb=H*params.clothTop;
  // top beam
  pen.paint(()=>{ g.rect(x0-pw*0.4, top-H*0.018, (x1-x0)+pw*0.8, H*0.03); }, toneSolid(inkLevel(6)), 5);
  // cloth beam (where the finished web hangs from)
  pen.paint(()=>{ g.rect(x0-pw*0.4, cb-H*0.012, (x1-x0)+pw*0.8, H*0.024); }, toneSolid(inkLevel(6)), 5);
  // posts
  pen.paint(()=>{ g.rect(x0-pw/2, top-H*0.03, pw, H*params.hem-top+H*0.05); }, toneSolid(inkLevel(6)), 5);
  pen.paint(()=>{ g.rect(x1-pw/2, top-H*0.03, pw, H*params.hem-top+H*0.05); }, toneSolid(inkLevel(6)), 5);
  // finials
  pen.paint(()=>{ g.arc(x0, top-H*0.03, pw*0.7,0,TAU); }, toneSolid(inkLevel(7)),4);
  pen.paint(()=>{ g.arc(x1, top-H*0.03, pw*0.7,0,TAU); }, toneSolid(inkLevel(7)),4);
}

/* ---- thread MOTES: day motes settle DOWN into the weave, night motes reverse
   UPWARD off the loose ends. The two streams cross the seam in opposite time. -- */
function drawMotes(pen,g,W,H,cx,t,inten){
  const top=H*params.loomTop+H*0.03, cloth=H*params.clothTop, hem=H*params.hem;
  const n=params.motes;
  // DAY motes — descend from the loom head to the growing cloth edge
  for(let i=0;i<n;i++){
    const x = lerp(W*params.leftPost+W*0.03, cx-W*0.02, pr(i,1));
    const ph = frac(t*0.15 + pr(i,2));           // 0..1 down
    const y = lerp(top, cloth+H*0.02, ph);
    const r = lerp(4.5, 1.8, ph);                // dwindle as it lands (woven in)
    g.fillStyle = inkLevel(5);
    g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
    // short downward tail
    g.strokeStyle=inkLevel(3); g.lineWidth=1.5;
    g.beginPath(); g.moveTo(x,y-r*2.2); g.lineTo(x,y-r*0.6); g.stroke();
  }
  // NIGHT motes — reverse UPWARD off the dissolving hem, drifting off the loom
  for(let i=0;i<n;i++){
    const x0 = lerp(cx+W*0.02, W*params.rightPost-W*0.03, pr(i,4));
    const ph = frac(t*0.17 + pr(i,5));           // 0..1 up
    const y = lerp(hem-H*0.02, top-H*0.03, ph);
    const drift = Math.sin(ph*4 + i)*W*0.02;      // loose thread wander
    const x = x0 + drift*ph;
    const r = lerp(4.2, 1.6, ph);                 // dwindle as it escapes
    g.fillStyle = inkLevel(6);
    g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
    // short upward tail (reversal direction)
    g.strokeStyle=inkLevel(4); g.lineWidth=2;
    g.beginPath(); g.moveTo(x,y+r*2.6); g.lineTo(x,y+r*0.6); g.stroke();
  }
}

/* ---- the SEAM: the vertical break between the two times, faintly shimmering -- */
function drawSeam(pen,g,W,H,cx,pulse){
  const top=H*params.loomTop-H*0.02, bot=H*params.hem+H*0.02;
  g.strokeStyle=INK; g.lineWidth=4.5; g.setLineDash([H*0.028, H*0.016]); g.lineCap="round";
  g.beginPath();
  for(let s=0;s<=24;s++){ const y=lerp(top,bot,s/24); const x=cx+Math.sin(y*0.05+pulse*TAU)*W*0.007; s===0?g.moveTo(x,y):g.lineTo(x,y); }
  g.stroke(); g.setLineDash([]);
  // small day/night glyphs flanking the seam top
  g.fillStyle=INK;
  g.beginPath(); g.arc(cx-W*0.045, top+H*0.02, 4,0,TAU); g.fill();          // day dot (open sun echo)
  g.beginPath(); g.arc(cx+W*0.045, top+H*0.02, 6, 0.4, Math.PI+0.4); g.fill();// night crescent
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t || 0;
  const inten = (st.intensity!=null?st.intensity:1.0);
  const bal   = (st.balance!=null?st.balance:params.balance);   // reserved channel
  const pulse = 0.5 + 0.5*Math.sin(t*1.6);
  const cx = W*0.5;

  const layers = st.layers || ["field","warp","cloth","loom","sun","torch","motes","seam"];
  const has = l => layers.includes(l);

  if (has("field")) drawField(pen,g,W,H,cx);
  if (has("warp"))  drawWarp(pen,g,W,H,cx,pulse,inten);
  if (has("cloth")) drawCloth(pen,g,W,H,cx,t,inten);
  if (has("loom"))  drawLoom(pen,g,W,H,cx);
  if (has("sun"))   drawSun(pen,g,W,H);
  if (has("torch")) drawTorch(pen,g,W,H,pulse,inten);
  if (has("motes")) drawMotes(pen,g,W,H,cx,t,inten);
  if (has("seam"))  drawSeam(pen,g,W,H,cx,pulse);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.torchlit-night-memory",
  type:"DIVINE_FX",
  name:"Torchlit night memory",
  statusWord:"UNWEAVING",
  scene:"OD-B02-S02",

  params,
  // back -> front; scene state may pass a subset of layers
  layers:["field","warp","cloth","loom","sun","torch","motes","seam"],
  // normalized 0..1 anchors: the source loom, the two fields, the crossing motes
  anchors:{
    "source:loom":{x:.50,y:.50},
    "field:day":{x:.28,y:.50},        // forward-time weaving half
    "field:night":{x:.72,y:.50},      // secret reversal half
    "marker:sun":{x:.27,y:.24},
    "marker:torch":{x:.71,y:.30},
    "beam:cloth":{x:.50,y:.50},
    "hem:day":{x:.30,y:.88},          // growing woven edge
    "hem:night":{x:.70,y:.70},        // dissolving reversal front
    "seam:break":{x:.50,y:.50},       // the temporal split
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions (for scene placement / pathing)
  zones:{ day:{ x0:.13,y0:.14,x1:.50,y1:.88 }, night:{ x0:.50,y0:.14,x1:.87,y1:.88 } },

  // DIVINE_FX state machine: source -> split field -> transform, with duration
  states:{
    initial:"overlay",
    nodes:{
      // day-weaving: the public web grows forward, light dominates (low t)
      "day-weaving":{ preview:{ t:0.6, intensity:0.7, balance:0.85, status:"WEAVING", progress:.30 } },
      // overlay: both times run at once — the reveal of the deception (neutral)
      overlay:{ preview:{ t:2.2, intensity:1.0, balance:0.5, status:"UNWEAVING", progress:.55 } },
      // night-reversal: torchlit undoing surges, motes stream upward (high t)
      "night-reversal":{ preview:{ t:3.4, intensity:1.4, balance:0.15, status:"REVERSING", progress:.82 } },
    },
    edges:[["day-weaving","overlay"],["overlay","night-reversal"],
           ["night-reversal","overlay"],["overlay","day-weaving"]],
  },
  duration:6.0,
  channels:["weave","unravel","torch","balance","intensity","t"],

  preview:()=>({ t:2.2, intensity:1.0, balance:0.5, status:"UNWEAVING", progress:.55,
                 layers:["field","warp","cloth","loom","sun","torch","motes","seam"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
