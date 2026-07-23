/* divine_fx.athena-as-dream-companion — the goddess as a girl in a dream.
   DIVINE_FX asset. Scene function (OD-B06-S01): Athena takes the LIKENESS OF A
   FAMILIAR GIRL (the daughter of Dymas, Nausicaa's playmate), slips into the
   sleeping-chamber, BENDS CLOSE over the dreaming girl and SPEAKS at her ear,
   then DISSOLVES and is gone as the sleeper wakes.

   Procedural: SOURCE (a faint girl-likeness coalescing from motes above the bed)
   -> FIELD (whisper-lines carrying the close counsel from the dream-girl's mouth
   to the sleeper's ear) -> TRANSFORM (a translucent bending figure leaning over
   the sleeper, holding, then breaking into dissolve motes that rise and scatter
   at waking) -> visible CONSEQUENCE (the counsel delivered, the sleeper stirring
   awake, the apparition gone).

   Animates over state.t: 0 = motes gather above the bed, the girl barely there;
   ~0.46 = she stands full, bent close over the sleeper, whisper-lines strongest;
   1 = she breaks into motes that rise off her trailing form and scatter, gone.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  floor:    0.90,   // chamber floor line as frac of H
  bedX0:    0.06,   // bed platform left edge
  bedX1:    0.74,   // bed platform right edge
  bedTop:   0.685,  // bed sleeping surface as frac of H
  pillowX:  0.235,  // sleeper head / pillow center x as frac of W
  sleepY:   0.635,  // sleeper head center y as frac of H
  motes:    20,     // gather / dissolve motes
  glow:     1.0,    // presence glow strength (channel-driven)
  intensity:1.0,    // overall energy of the apparition
};

/* the bending dream-girl's SPINE, ordered head-end -> hips. Fractions of W,H;
   halfW is robe half-width (fraction of W). Shoulders (s2) are the APEX; the
   back arcs down-right to the hips (she kneels at the bedside) while the head
   bows down-LEFT below the shoulders — a figure hunched forward over the sleeper. */
const SPINE = [
  { x:0.374, y:0.498, w:0.026 },  // neck base (below/left of shoulders)
  { x:0.414, y:0.452, w:0.040 },  // upper chest / neck
  { x:0.460, y:0.406, w:0.058 },  // shoulders (apex of the bend)
  { x:0.510, y:0.452, w:0.052 },  // arched back
  { x:0.552, y:0.552, w:0.038 },  // hips / seat at the bedside
];
const HEAD = { x:0.346, y:0.524, r:0.056 };   // dream-girl head, bowed close
const MOUTH= { x:0.322, y:0.548 };            // her mouth, at the sleeper's ear

/* build a ribbon polygon from spine points at a given inset scale (1 = robe
   edge, <1 = bright inner core). Emits a closed path into ctx. */
function ribbonPath(g,W,H,scale){
  const P = SPINE.map(s=>({ x:s.x*W, y:s.y*H, w:s.w*W*scale }));
  const L=[], R=[];
  for(let i=0;i<P.length;i++){
    const a=P[Math.max(0,i-1)], b=P[Math.min(P.length-1,i+1)];
    let tx=b.x-a.x, ty=b.y-a.y; const m=Math.hypot(tx,ty)||1; tx/=m; ty/=m;
    const nx=-ty, ny=tx;
    L.push({ x:P[i].x+nx*P[i].w, y:P[i].y+ny*P[i].w });
    R.push({ x:P[i].x-nx*P[i].w, y:P[i].y-ny*P[i].w });
  }
  g.moveTo(L[0].x,L[0].y);
  for(let i=1;i<L.length;i++) g.lineTo(L[i].x,L[i].y);
  for(let i=R.length-1;i>=0;i--) g.lineTo(R[i].x,R[i].y);
  g.closePath();
}

/* ---- the sleeping CHAMBER: a dark night wall so the pale dream reads, a lighter
   floor plane, a low dado band. Empty of any standing figure. ---- */
function drawChamber(pen,g,W,H){
  const fy = H*params.floor;
  g.fillStyle = inkLevel(2); g.fillRect(0,0,W,fy);            // night chamber wall
  g.fillStyle = inkLevel(1); g.fillRect(0,fy,W,H-fy);         // floor plane
  pen.ink(()=>{ g.moveTo(0,fy); g.lineTo(W,fy); }, 4);        // baseboard seam
  g.fillStyle = inkLevel(3); g.fillRect(0, fy-H*0.040, W, H*0.040);   // dado
  pen.ink(()=>{ g.moveTo(0,fy-H*0.040); g.lineTo(W,fy-H*0.040); }, 3);
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.25;
  for(let j=1;j<=2;j++){ const y=fy+(H-fy)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha = 1;
}

/* ---- TARGET: the bed and the sleeper (the dream's recipient). A low platform,
   a covered mound along it, a pillow at the head, and the sleeper's head resting
   on it. `wake` (0 asleep .. 1 waking) lifts the head slightly and opens motes. */
function drawBed(pen,g,W,H,wake){
  const fy = H*params.floor, bedY = H*params.bedTop;
  const x0 = W*params.bedX0, x1 = W*params.bedX1;
  // bed platform / frame
  pen.paint(()=>{ g.rect(x0, bedY, x1-x0, fy-bedY); }, toneSolid(inkLevel(4)), 5);
  pen.paint(()=>{ g.rect(x0, bedY-H*0.02, x1-x0, H*0.03); }, toneSolid(inkLevel(3)), 4);  // mattress lip
  // headboard at the sleeper's end
  pen.paint(()=>{ g.rect(x0-W*0.008, bedY-H*0.14, W*0.03, H*0.16); }, toneSolid(inkLevel(5)), 4);
  // covers: a long mound over the sleeper's body, mid tone
  const px = W*params.pillowX, sy = H*params.sleepY;
  pen.paint(()=>{
    g.moveTo(px+W*0.02, bedY);
    g.quadraticCurveTo(W*0.42, bedY-H*0.055, W*0.60, bedY-H*0.006);
    g.lineTo(x1, bedY);
    g.lineTo(x1, bedY+H*0.008);
    g.lineTo(px+W*0.02, bedY+H*0.008);
    g.closePath();
  }, toneSolid(inkLevel(3)), 4);
  // fold seams along the covers
  g.strokeStyle = INK; g.lineWidth = 2.5; g.globalAlpha = 0.4; g.lineCap="round";
  for(const fx of [0.36,0.48,0.60]){ const cx=lerp(px,x1,fx);
    g.beginPath(); g.moveTo(cx, bedY-H*0.02); g.lineTo(cx+W*0.01, bedY); g.stroke(); }
  g.globalAlpha = 1;
  // pillow (light) + sleeper head resting on it
  const headLift = wake*H*0.012;
  pen.paint(()=>{ g.ellipse(px, bedY-H*0.008, W*0.075, H*0.028, 0,0,TAU); }, toneSolid(inkLevel(1)), 4);
  pen.paint(()=>{ g.ellipse(px, sy-headLift, W*0.042, H*0.048, 0,0,TAU); }, toneSolid(inkLevel(2)), 4);
  // a loose lock of the sleeper's hair on the pillow
  pen.paint(()=>{
    g.moveTo(px-W*0.03, sy-H*0.02);
    g.quadraticCurveTo(px-W*0.09, sy, px-W*0.06, sy+H*0.03);
    g.quadraticCurveTo(px-W*0.03, sy+H*0.01, px-W*0.02, sy-H*0.01);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  // closed eye line (waking cracks it toward the girl)
  g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.004); g.lineCap="round";
  g.beginPath(); g.moveTo(px-W*0.006, sy-headLift-H*0.002);
  g.lineTo(px+W*0.024, sy-headLift-H*0.004 - wake*H*0.004); g.stroke();
  return { ear:{ x:px+W*0.028, y:sy-headLift-H*0.004 } };
}

/* ---- TRANSFORM: the translucent bending girl. A faint robed figure arcing down
   over the sleeper, head bowed close, long girl-hair draping forward, one arm
   reaching to tend the sleeper. Light fills (you see through her) + a crisp thin
   contour so the bent silhouette reads. `alpha` = presence (0 gone .. ~0.9 full).
   Returns her mouth anchor for the whisper-lines. ---- */
function drawGirl(pen,g,W,H,alpha){
  if (alpha<=0.02) return { x:MOUTH.x*W, y:MOUTH.y*H };
  const hx=HEAD.x*W, hy=HEAD.y*H, hr=HEAD.r*H;
  g.save();
  g.globalAlpha = alpha;

  // ---- arm: from the shoulder reaching down-left to tend the sleeper ----
  const sh = { x:SPINE[2].x*W, y:SPINE[2].y*H };
  const elb= { x:W*0.388, y:H*0.520 };
  const wr = { x:W*0.300, y:H*0.588 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(elb.x,elb.y); }, toneSolid(inkLevel(3)), hr*0.44);
  pen.limb(()=>{ g.moveTo(elb.x,elb.y); g.lineTo(wr.x,wr.y); }, toneSolid(inkLevel(3)), hr*0.36);
  pen.paint(()=>{ g.arc(wr.x,wr.y,hr*0.32,0,TAU); }, toneSolid(inkLevel(2)), 3);

  // ---- robe body (ribbon along the bent spine) + bright inner core ----
  pen.paint(()=>ribbonPath(g,W,H,1.0), toneSolid(inkLevel(3)), 4);
  pen.fillPath(()=>ribbonPath(g,W,H,0.46), inkLevel(1));
  // a couple of crisp robe folds down the back
  g.strokeStyle=INK; g.lineWidth=2.5; g.lineCap="round"; g.globalAlpha=alpha*0.8;
  g.beginPath();
  g.moveTo(SPINE[0].x*W, SPINE[0].y*H);
  g.quadraticCurveTo(SPINE[2].x*W, SPINE[2].y*H, SPINE[4].x*W, SPINE[4].y*H);
  g.stroke();
  g.globalAlpha=alpha;

  // ---- neck + head ----
  pen.limb(()=>{ g.moveTo(SPINE[0].x*W, SPINE[0].y*H); g.lineTo(hx+hr*0.3, hy-hr*0.6); }, toneSolid(inkLevel(3)), hr*0.40);
  pen.paint(()=>{ g.arc(hx,hy,hr,0,TAU); }, toneSolid(inkLevel(2)), 3.5);
  // bright face core (light shows through) facing down-left toward the sleeper
  pen.paint(()=>{ g.ellipse(hx-hr*0.18, hy+hr*0.06, hr*0.62, hr*0.78, -0.35, 0, TAU); }, toneSolid(inkLevel(1)), 2.5);
  // faint profile hint (a girl bending to speak): brow + nose + lip toward sleeper
  g.strokeStyle=INK; g.lineWidth=2; g.lineCap="round"; g.globalAlpha=alpha*0.85;
  g.beginPath();
  g.moveTo(hx-hr*0.55, hy-hr*0.10);
  g.quadraticCurveTo(hx-hr*0.78, hy+hr*0.18, hx-hr*0.58, hy+hr*0.34);   // nose/lip line
  g.stroke();
  g.beginPath(); g.arc(hx-hr*0.20, hy-hr*0.08, hr*0.06, 0, TAU); g.fillStyle=INK; g.fill();  // eye
  g.globalAlpha=alpha;

  // ---- long girl-hair: draped mass over the crown + a lock falling forward
  //      toward the sleeper (she leans in) ----
  pen.paint(()=>{
    g.moveTo(hx-hr*0.9, hy-hr*0.2);
    g.quadraticCurveTo(hx+hr*0.2, hy-hr*1.5, hx+hr*1.05, hy-hr*0.35);
    g.quadraticCurveTo(hx+hr*1.35, hy+hr*0.9, hx+hr*0.75, hy+hr*0.55);
    g.quadraticCurveTo(hx+hr*0.4, hy-hr*0.2, hx-hr*0.1, hy-hr*0.35);
    g.quadraticCurveTo(hx-hr*0.6, hy-hr*0.1, hx-hr*0.9, hy-hr*0.2);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);
  // forward lock falling toward the sleeper
  pen.paint(()=>{
    g.moveTo(hx-hr*0.7, hy+hr*0.1);
    g.quadraticCurveTo(hx-hr*1.1, hy+hr*0.9, hx-hr*0.55, hy+hr*1.25);
    g.quadraticCurveTo(hx-hr*0.35, hy+hr*0.7, hx-hr*0.35, hy+hr*0.2);
    g.closePath();
  }, toneSolid(inkLevel(4)), 3);

  g.restore();
  return { x:MOUTH.x*W, y:MOUTH.y*H };
}

/* ---- FIELD: WHISPER-LINES carrying the close counsel from the dream-girl's
   mouth to the sleeper's ear. Short nested arcs travelling the gap, blooming most
   while she leans speaking. Flat tone steps, no gradient. ---- */
function drawWhisper(pen,g,W,H,mx,my,ear,amt,t){
  if (amt<0.04) return;
  g.save(); g.lineCap="round";
  const dx=ear.x-mx, dy=ear.y-my, dist=Math.hypot(dx,dy)||1;
  const ang=Math.atan2(dy,dx), nx=-dy/dist, ny=dx/dist;
  for(let k=0;k<4;k++){
    const ph=((t*0.7 + k*0.26) % 1);            // travel mouth -> ear
    const cx=mx+dx*ph, cy=my+dy*ph;
    const r=lerp(H*0.014, H*0.034, ph);
    g.strokeStyle=inkLevel(5 - Math.round(ph*2));
    g.lineWidth=lerp(4.5,2,ph);
    g.globalAlpha=(1-ph*0.7)*amt;
    g.beginPath(); g.arc(cx, cy, r, ang-TAU*0.30, ang+TAU*0.30); g.stroke();
    // a faint carrier dot riding the whisper
    g.globalAlpha=(1-ph)*amt*0.6; g.fillStyle=inkLevel(4);
    g.beginPath(); g.arc(cx+nx*r*0.2, cy+ny*r*0.2, lerp(2.5,1,ph), 0, TAU); g.fill();
  }
  g.globalAlpha=1; g.restore();
}

/* ---- dissolve MOTES: the apparition breaking into flecks. On WAKING (dissolveT)
   they rise off her trailing form and scatter upward, gone. While she first
   COALESCES (enterT small) a gentler scatter gathers toward her. ---- */
function drawMotes(pen,g,W,H,amt,driftK,rising){
  if (amt<0.03) return;
  g.save(); g.fillStyle=inkLevel(6);
  const n=params.motes;
  // seed points along the trailing/upper body where she frays
  for(let i=0;i<n;i++){
    const s=(i*47%31)/31;
    // base point sampled along the spine (trailing end frays first)
    const si=lerp(SPINE.length-1, 0, s*0.8);
    const a=SPINE[Math.floor(si)], b=SPINE[Math.min(SPINE.length-1,Math.floor(si)+1)];
    const f=si-Math.floor(si);
    const bx=lerp(a.x,b.x,f)*W + (s-0.5)*W*0.05;
    const by=lerp(a.y,b.y,f)*H;
    const along=clamp01((driftK*1.1 + s*0.4) % 1.2);   // 0 at body .. 1 scattered
    const dir = rising ? -1 : 1;                        // waking: rise & scatter
    const spread = rising ? 0.30 : 0.12;                // motes climb into the room on waking
    const x=bx + Math.sin(s*TAU + driftK*6)*W*0.07*along + (s-0.5)*along*W*0.10;
    const y=by + dir*along*H*spread - along*H*0.02;
    const r=(1.4 + 3.0*(1-along))*amt;
    g.globalAlpha=(0.75*(1-along)+0.15)*amt;
    g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
  }
  g.globalAlpha=1; g.restore();
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = clamp01(st.t ?? 0.46);
  const inten = st.intensity ?? params.intensity;
  const glow = (st.glow ?? params.glow) * inten;
  const layers = st.layers || ["chamber","bed","girl","whisper","motes"];
  const has = l => layers.includes(l);

  // ---- phase kinematics ----
  const enterT    = clamp01(t/0.40);                        // motes gather, girl coalesces
  const dissolveT = clamp01((t-0.60)/0.40);                 // she breaks into motes, wakes
  const presence  = smooth(clamp01(t/0.16)) * (1 - smooth(dissolveT));
  const alpha     = presence * 0.92 * (0.7+0.3*glow);
  const whisperAmt= clamp01(1 - Math.abs(t-0.46)/0.32) * presence;
  const wake      = smooth(dissolveT);                      // sleeper stirs as she goes
  const enterMotes= (1-enterT)*0.45;
  const moteAmt   = clamp01(dissolveT*1.1 + enterMotes + presence*0.16);  // + faint dream-shimmer at hold
  const driftK    = dissolveT>0.02 ? dissolveT : (t*0.6 + (1-enterT));

  let ear = { x:(params.pillowX+0.028)*W, y:params.sleepY*H };
  if (has("chamber")) drawChamber(pen,g,W,H);
  if (has("bed"))     ({ ear } = drawBed(pen,g,W,H,wake));
  const mouth = has("girl") ? drawGirl(pen,g,W,H,alpha) : { x:MOUTH.x*W, y:MOUTH.y*H };
  if (has("whisper")) drawWhisper(pen,g,W,H,mouth.x,mouth.y,ear,whisperAmt,t);
  if (has("motes"))   drawMotes(pen,g,W,H,moteAmt,driftK, true);   // dream-motes always rise

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.athena-as-dream-companion",
  type:"DIVINE_FX",
  name:"Athena as dream companion",
  statusWord:"WHISPERING",
  scene:"OD-B06-S01",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["chamber","bed","girl","whisper","motes"],
  // normalized 0..1 source/field/transform/consequence/camera anchors
  anchors:{
    "source:motes":{     x:0.52, y:0.32 },   // where the girl-likeness gathers from
    "transform:girl":{   x:0.44, y:0.44 },   // the bending dream-companion
    "girl:head":{        x:HEAD.x, y:HEAD.y },// her bowed head, leaning close
    "girl:mouth":{       x:MOUTH.x, y:MOUTH.y },// the whispering mouth
    "field:whisper":{    x:0.30, y:0.61 },    // the whisper-lines to the ear
    "target:sleeper":{   x:params.pillowX, y:params.sleepY },  // the dreaming sleeper
    "target:ear":{       x:0.273, y:0.655 },  // the ear the counsel enters
    "consequence:waking":{x:0.245,y:0.64 },   // the sleeper stirring awake
    "camera:wide":{      x:0.42, y:0.52 },
  },
  // affected regions (the bed it bends over, the space the apparition fills)
  zones:{
    bed:{  x0:0.06, y0:0.57, x1:0.72, y1:0.90 },
    girl:{ x0:0.26, y0:0.28, x1:0.58, y1:0.63 },
    dream:{x0:0.20, y0:0.24, x1:0.62, y1:0.72 },
  },
  // DIVINE_FX transform states: gathering -> whispering -> dissolving
  states:{
    initial:"whispering",
    nodes:{
      // gathering: motes coalesce above the bed into the girl-likeness (source)
      gathering:{  preview:{ t:0.14, intensity:1.0, status:"GATHERING",   progress:0.14 } },
      // whispering: she stands full, bent close, speaking at the ear (neutral)
      whispering:{ preview:{ t:0.46, intensity:1.0, status:"WHISPERING",  progress:0.46 } },
      // dissolving: she breaks into rising motes, the sleeper wakes, gone
      dissolving:{ preview:{ t:0.90, intensity:1.0, status:"DISSOLVING",  progress:0.90 } },
    },
    edges:[["gathering","whispering"],["whispering","dissolving"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","glow","alpha"],

  // neutral preview: the translucent girl bent close over the sleeper, whisper-
  // lines carrying counsel to the ear, a few motes drifting off her trailing form
  // — reads unmistakably as the dream-companion leaning over a sleeper.
  preview:()=>({ t:0.46, intensity:1.0, glow:1.0, status:"WHISPERING", progress:0.46,
                 layers:["chamber","bed","girl","whisper","motes"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
