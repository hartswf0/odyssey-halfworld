/* environment.ithaca-revealed — the concealment mist withdrawing from Ithaca.
   ENVIRONMENT asset (procedural world force). Scene function (OD-B13-S03):
   Athena's disguising MIST peels back in ordered layers to EXPOSE the familiar
   terrain Odysseus failed to recognise — the sheltered HARBOR (of Phorcys),
   the wooded slope of Mount NERITON, the cave of the NYMPHS (Naiads), the
   long-leaved OLIVE at the harbour head, and the home shore beyond.

   The MIST is the SOURCE FIELD. A single REVEAL front sweeps across the frame;
   everything BEHIND the front (already uncovered) reads as clear, crisp
   landscape, everything AHEAD of it is smothered under flat near-paper fog with
   a scalloped, lifting fog-bank edge at the front. `reveal` (0 fully concealed
   .. 1 fully clear) drives the front; `dir` chooses the withdrawal ordering
   (default: harbour/foreground first, then up the mountain — the ordered peel).

   Procedural: SOURCE (mist field) -> REVEAL (front position along the sweep
   axis) -> REGION (cleared vs. still-concealed). Animatable over state.t: the
   front advances, the fog-bank edge lifts and drifts on `wind`, wisps thin.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);
const smoothstep = (a,b,x)=>{ const t=clamp01((x-a)/(b-a||1e-6)); return t*t*(3-2*t); };

const params = {
  horizon:  0.66,   // sea/land waterline as frac of H
  reveal:   1.0,    // master field: 0 fully concealed .. 1 fully clear
  dir:      1,      // withdrawal ordering: +1 foreground->mountain, -1 reversed
  wind:     1.0,    // fog-bank drift + edge lift strength
  peakX:    0.60,   // Mount Neriton summit x as frac of W
  caveX:    0.20,   // nymph cave x as frac of W
  oliveX:   0.82,   // the long-leaved olive x as frac of W
};

/* Each landscape feature owns a REVEAL threshold (0..1). The front uncovers a
   feature once reveal >= its threshold. Ordered peel: harbour/shore first,
   then the cave, the olive, the near slope, and finally the summit last. */
const FEATURES = {
  sky:      0.00,
  sea:      0.04,
  harbor:   0.10,
  shore:    0.16,
  farHills: 0.28,
  cave:     0.38,   // cave of the nymphs on the near slope
  neriton:  0.46,   // the wooded mountain body
  olive:    0.52,   // the sacred olive at the harbour head
  summit:   0.84,   // the very peak clears last
};

/* clarity(feature): 0 = still under mist, 1 = fully exposed. A soft band around
   the threshold so features fade in as the front passes rather than popping. */
function clarity(reveal, key){
  const th = FEATURES[key] ?? 0;
  return smoothstep(th-0.02, th+0.12, reveal);
}

/* ---------- SKY: lightest field behind everything ---------- */
function drawSky(g,W,H){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);
  // a couple of faint high cloud steps
  g.fillStyle = inkLevel(2);
  for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(W*(0.18+i*0.22), hy*0.28+ (i%2?H*0.02:0), W*0.10, H*0.022, 0,0,TAU); g.fill(); }
}

/* ---------- FAR HILLS: the familiar terrain rolling behind the mountain ---------- */
function drawFarHills(pen,g,W,H,c){
  if (c<=0.02) return;
  const hy = H*params.horizon;
  const lvl = Math.round(lerp(1, 3, c));
  g.fillStyle = inkLevel(lvl);
  g.beginPath(); g.moveTo(0,hy);
  const pts = 7;
  for(let i=0;i<=pts;i++){ const x=W*i/pts; const y=hy-H*(0.05+0.045*Math.sin(i*1.7+0.5)); g.lineTo(x,y); }
  g.lineTo(W,hy); g.closePath(); g.fill();
}

/* ---------- MOUNT NERITON: the great wooded slope. Body + a summit cap that
   is the LAST thing the mist releases. Tree-line hatch marks read as woods. -- */
function drawNeriton(pen,g,W,H,cBody,cSummit){
  if (cBody<=0.02) return;
  const hy = H*params.horizon;
  const px = W*params.peakX;
  const peakY = H*0.15;
  // ridge silhouette points (left base -> shoulder -> summit -> shoulder -> right base)
  const RID = [
    { x:W*0.14, y:hy },
    { x:W*0.34, y:hy-H*0.20 },
    { x:px-W*0.12, y:peakY+H*0.11 },
    { x:px,       y:peakY },
    { x:px+W*0.17, y:peakY+H*0.15 },
    { x:W*0.98, y:hy },
  ];
  const lvl = Math.round(lerp(2, 4, cBody));    // wooded slope: mid tone, never a black blob
  pen.paint(()=>{
    g.moveTo(RID[0].x, RID[0].y);
    for(let i=1;i<RID.length;i++) g.lineTo(RID[i].x, RID[i].y);
    g.closePath();
  }, toneSolid(inkLevel(lvl)), 5);
  // a darker lower band (the shadowed foot of the slope) for depth
  g.fillStyle = inkLevel(clamp(lvl+2,1,7));
  g.beginPath();
  g.moveTo(RID[0].x, hy); g.lineTo(W*0.98, hy); g.lineTo(W*0.98, hy-H*0.02);
  g.quadraticCurveTo(px, hy-H*0.10, RID[0].x, hy-H*0.02); g.closePath(); g.fill();
  // wooded texture: short tree ticks marching up the visible slope
  if (cBody>0.35){
    g.strokeStyle = inkLevel(clamp(lvl+2,1,7)); g.lineWidth = 2; g.lineCap="round";
    for(let i=0;i<60;i++){
      const u = pr(i,3), v = pr(i,7);
      const x = lerp(W*0.18, W*0.94, u);
      // ridge height at x (piecewise-linear over RID) as an upper clamp
      let ry = hy;
      for(let k=0;k<RID.length-1;k++){
        if (x>=RID[k].x && x<=RID[k+1].x){ const f=(x-RID[k].x)/((RID[k+1].x-RID[k].x)||1); ry=lerp(RID[k].y,RID[k+1].y,f); break; }
      }
      const y = lerp(ry+H*0.015, hy-H*0.005, v);
      if (y < ry+H*0.01) continue;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x - W*0.004, y - H*0.016); g.stroke();
    }
  }
  // ridge contour on top
  pen.ink(()=>{ g.moveTo(RID[1].x,RID[1].y); for(let i=2;i<=4;i++) g.lineTo(RID[i].x,RID[i].y); }, 3);
  // summit cap — bright crown that clears last (still veiled -> pale)
  const capLvl = Math.round(lerp(1, 3, cSummit));
  g.fillStyle = inkLevel(capLvl);
  g.beginPath();
  g.moveTo(px - W*0.05, peakY + H*0.05);
  g.lineTo(px, peakY);
  g.lineTo(px + W*0.07, peakY + H*0.065);
  g.closePath(); g.fill();
}

/* ---------- NYMPH CAVE: a dark arched mouth set into the near slope on the left,
   with two hinted stone jambs — the Naiads' cave of bowls and jars. ---------- */
function drawCave(pen,g,W,H,c){
  if (c<=0.02) return;
  const hy = H*params.horizon;
  const cx = W*params.caveX, cy = hy - H*0.015;
  const rw = W*0.038, rh = H*0.062;
  // a small rounded knoll the cave mouth is set into (mid tone, reads as rock)
  const hillLvl = Math.round(lerp(2,4,c));
  pen.paint(()=>{ g.ellipse(cx, hy+H*0.005, W*0.085, H*0.075, 0, Math.PI, TAU); }, toneSolid(inkLevel(hillLvl)), 4);
  // the dark cave mouth (arched) — darkest note, but small so it reads as an opening
  const mouthLvl = Math.round(lerp(3, 6, c));
  pen.paint(()=>{
    g.moveTo(cx-rw, cy);
    g.lineTo(cx-rw, cy-rh*0.55);
    g.quadraticCurveTo(cx, cy-rh*1.3, cx+rw, cy-rh*0.55);
    g.lineTo(cx+rw, cy);
    g.closePath();
  }, toneSolid(inkLevel(mouthLvl)), 4);
  // stone lintel arc over the mouth
  pen.ink(()=>{ g.moveTo(cx-rw*1.2, cy-rh*0.5); g.quadraticCurveTo(cx, cy-rh*1.45, cx+rw*1.2, cy-rh*0.5); }, 3);
}

/* ---------- THE OLIVE: the long-leaved sacred olive at the harbour head —
   a leaning trunk with a broad grey-green (mid-tone) canopy. ---------- */
function drawOlive(pen,g,W,H,c){
  if (c<=0.02) return;
  const hy = H*params.horizon;
  const bx = W*params.oliveX, by = hy + H*0.02;
  const trunkLvl = Math.round(lerp(3, 6, c));
  const leafLvl  = Math.round(lerp(2, 4, c));
  // trunk (leaning slightly seaward)
  pen.limb(()=>{ g.moveTo(bx, by); g.lineTo(bx - W*0.02, by - H*0.16); }, toneSolid(inkLevel(trunkLvl)), W*0.014);
  // two low boughs
  pen.limb(()=>{ g.moveTo(bx - W*0.012, by - H*0.10); g.lineTo(bx - W*0.06, by - H*0.15); }, toneSolid(inkLevel(trunkLvl)), W*0.008);
  pen.limb(()=>{ g.moveTo(bx - W*0.012, by - H*0.12); g.lineTo(bx + W*0.04, by - H*0.18); }, toneSolid(inkLevel(trunkLvl)), W*0.008);
  // canopy — clustered leaf lobes
  const cxs = [ [-0.06,-0.17], [0.02,-0.20], [-0.01,-0.15], [0.05,-0.16], [-0.04,-0.22] ];
  for(const [dx,dy] of cxs){
    pen.paint(()=>{ g.ellipse(bx+W*dx, by+H*dy, W*0.05, H*0.055, 0, 0, TAU); }, toneSolid(inkLevel(leafLvl)), 4);
  }
}

/* ---------- SHORE: the near land shelf between olive/cave and the water ------ */
function drawShore(pen,g,W,H,c){
  if (c<=0.02) return;
  const hy = H*params.horizon;
  const lvl = Math.round(lerp(2, 4, c));
  pen.paint(()=>{
    g.moveTo(0, hy);
    g.lineTo(W, hy);
    g.lineTo(W, hy+H*0.05);
    g.quadraticCurveTo(W*0.5, hy+H*0.10, 0, hy+H*0.05);
    g.closePath();
  }, toneSolid(inkLevel(lvl)), 4);
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 3);
}

/* ---------- HARBOR: the sheltered water of Phorcys — a bay with two enclosing
   headland arms and horizontal ripple rules. ---------- */
function drawHarbor(pen,g,W,H,c){
  if (c<=0.02) return;
  const hy = H*params.horizon;
  const lvl = Math.round(lerp(2, 3, c));
  // water field below the waterline
  g.fillStyle = inkLevel(lvl); g.fillRect(0, hy, W, H-hy);
  // two low headland spits curling in from the sides to enclose the bay
  const armLvl = Math.round(lerp(3,5,c));
  pen.paint(()=>{ g.moveTo(0,hy); g.lineTo(W*0.16,hy); g.quadraticCurveTo(W*0.20, hy+H*0.05, W*0.11, hy+H*0.075); g.quadraticCurveTo(W*0.04, hy+H*0.05, 0, hy+H*0.055); g.closePath(); }, toneSolid(inkLevel(armLvl)), 4);
  pen.paint(()=>{ g.moveTo(W,hy); g.lineTo(W*0.84,hy); g.quadraticCurveTo(W*0.80, hy+H*0.05, W*0.89, hy+H*0.075); g.quadraticCurveTo(W*0.96, hy+H*0.05, W, hy+H*0.055); g.closePath(); }, toneSolid(inkLevel(armLvl)), 4);
  // ripple rules — light strokes gaining toward the shore
  g.strokeStyle = inkLevel(clamp(lvl+2,1,7)); g.lineWidth = 2; g.lineCap="round";
  const rows = 6;
  for(let r=0;r<rows;r++){
    const y = lerp(hy+H*0.02, H-H*0.015, r/(rows-1));
    const amp = H*0.006*(0.5+r/rows);
    g.beginPath();
    for(let x=W*0.06;x<=W*0.94;x+=W*0.05){ const yy=y+Math.sin(x*0.05+r)*amp; if(x===W*0.06) g.moveTo(x,yy); else g.lineTo(x,yy); }
    g.stroke();
  }
}

/* ---------- THE MIST: flat near-paper fog smothering everything AHEAD of the
   reveal front, with a scalloped, lifting fog-bank edge at the front and a few
   drifting wisps trailing into the cleared region. Along the sweep axis: the
   front is a MAP from screen position -> reveal-needed. We approximate the
   ordered peel with a diagonal front (bottom-right foreground clears first,
   sweeping up toward the summit at top). ---------- */
function drawMist(pen,g,W,H,reveal,dir,wind,t){
  if (reveal>=0.999) return;
  // Coverage front, column by column: fog covers from the top down to a front
  // line yFront(x). As reveal grows yFront rises (the mist lifts up off the
  // land). A per-column lead makes it an ORDERED diagonal peel; a billow term
  // gives the fog bank its scalloped, drifting lifting edge.
  const cols = 72;
  const dx = W/cols;
  const edge = [];
  for(let i=0;i<=cols;i++){
    const x = i*dx;
    const u = x/W;
    const lead = dir>0 ? (1-u)*0.10 : u*0.10;       // foreground side leads
    const localReveal = clamp01(reveal + lead - 0.05);
    let yFront = lerp(H*1.04, -H*0.06, localReveal);
    const bill = Math.sin(u*9 + t*0.8*wind)*H*0.022*(0.5+0.5*wind)
               + Math.sin(u*21 - t*0.5*wind)*H*0.013*(0.5+0.5*wind);
    yFront += bill;
    edge.push({ x, y: yFront });
  }
  // (1) solid fog body (near-paper) from the top down to the front — this is
  // what actually HIDES the still-concealed heights.
  g.fillStyle = inkLevel(1);
  g.beginPath();
  g.moveTo(0, -H*0.08); g.lineTo(W, -H*0.08);
  for(let i=edge.length-1;i>=0;i--) g.lineTo(edge[i].x, edge[i].y);
  g.closePath(); g.fill();
  // (2) drifting interior strata so the veil isn't dead-flat (thin light bands
  // clipped to the fog body).
  g.save();
  g.beginPath();
  g.moveTo(0,-H*0.08); g.lineTo(W,-H*0.08);
  for(let i=edge.length-1;i>=0;i--) g.lineTo(edge[i].x, edge[i].y);
  g.closePath(); g.clip();
  g.strokeStyle = inkLevel(2); g.lineWidth = H*0.010; g.lineCap="round";
  for(let b=0;b<5;b++){
    const yy = lerp(-H*0.02, H*0.72, b/4) + Math.sin(t*0.3*wind+b)*H*0.01;
    g.beginPath();
    for(let x=0;x<=W;x+=W*0.05){ const y=yy+Math.sin(x*0.012+b*1.3+t*0.4*wind)*H*0.012; if(x===0) g.moveTo(x,y); else g.lineTo(x,y); }
    g.stroke();
  }
  g.restore();
  // (3) the FOG BANK: a scalloped wall of overlapping lobes riding the front,
  // filled near-paper with a hard contour arc so the boundary reads as a rolling
  // bank of mist even against the bright sky.
  const step = 2;
  for(let i=0;i<=cols;i+=step){
    const e = edge[i];
    if (e.y < -H*0.06 || e.y > H*1.06) continue;
    const r = W*0.045*(0.8+0.5*pr(i,4));
    // filled overlapping lobes (no per-lobe outline) so the bank reads as soft mist
    g.fillStyle = inkLevel(2);
    g.beginPath(); g.ellipse(e.x, e.y - r*0.30, r, r*0.60, 0, 0, TAU); g.fill();
  }
  // (4) a continuous scalloped contour tracing the lifting edge (the one hard line)
  pen.ink(()=>{
    for(let i=0;i<=cols;i++){ const e=edge[i]; if(i===0) g.moveTo(e.x,e.y); else g.lineTo(e.x,e.y); }
  }, 3.5);
  // (5) wisps: light tufts drifting into the just-cleared air below the edge
  g.fillStyle = inkLevel(1);
  for(let i=0;i<6;i++){
    const u = pr(i,9);
    const idx = clamp(Math.round(u*cols),0,cols);
    const fy = edge[idx].y;
    const drift = Math.sin(t*0.6*wind + i)*W*0.02*wind;
    const wy = fy + H*(0.05+0.05*pr(i,2));
    if (wy > H) continue;
    const r = W*0.03*(0.6+0.5*pr(i,5));
    g.beginPath(); g.ellipse(lerp(W*0.05,W*0.95,u)+drift, wy, r, r*0.4, 0, 0, TAU); g.fill();
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t      = st.t ?? 0;
  const reveal = clamp01(st.reveal ?? params.reveal);
  const dir    = st.dir ?? params.dir;
  const wind   = st.wind ?? params.wind;
  const layers = st.layers || ["sky","farHills","neriton","sea","harbor","shore","cave","olive","mist"];
  const has = l => layers.includes(l);

  // clear landscape (drawn fully; the mist overlay decides what stays hidden)
  if (has("sky"))      drawSky(g,W,H);
  if (has("farHills")) drawFarHills(pen,g,W,H, clarity(reveal,"farHills"));
  if (has("neriton"))  drawNeriton(pen,g,W,H, clarity(reveal,"neriton"), clarity(reveal,"summit"));
  if (has("cave"))     drawCave(pen,g,W,H, clarity(reveal,"cave"));
  if (has("harbor")||has("sea")) drawHarbor(pen,g,W,H, clarity(reveal,"harbor"));
  if (has("shore"))    drawShore(pen,g,W,H, clarity(reveal,"shore"));
  if (has("olive"))    drawOlive(pen,g,W,H, clarity(reveal,"olive"));
  // the withdrawing mist smothers everything ahead of the front
  if (has("mist"))     drawMist(pen,g,W,H, reveal, dir, wind, t);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"environment.ithaca-revealed",
  type:"ENVIRONMENT",
  name:"Ithaca revealed",
  statusWord:"UNVEILING",
  scene:"OD-B13-S03",

  params,
  // back -> front draw order; the mist overlay is last so it conceals
  layers:["sky","farHills","neriton","sea","harbor","shore","cave","olive","mist"],
  // normalized 0..1 field anchors: the landmarks the mist uncovers, in peel order
  anchors:{
    "landmark:harbor":{  x:0.50, y:0.82 },   // sheltered bay of Phorcys
    "landmark:shore":{   x:0.50, y:0.70 },   // the home shore shelf
    "landmark:cave":{    x:0.20, y:0.62 },   // cave of the nymphs
    "landmark:olive":{   x:0.82, y:0.58 },   // the long-leaved olive
    "landmark:neriton":{ x:0.60, y:0.30 },   // Mount Neriton's wooded slope
    "landmark:summit":{  x:0.60, y:0.16 },   // the peak — clears last
    "front:origin":{     x:0.90, y:0.95 },   // where the peel begins
    "camera:wide":{      x:0.50, y:0.50 },
  },
  // affected regions: cleared foreground vs. the mist still holding the heights
  zones:{
    cleared:   { x0:0.00, y0:0.62, x1:1.00, y1:1.00 },
    concealed: { x0:0.00, y0:0.00, x1:1.00, y1:0.40 },
    harbor:    { x0:0.10, y0:0.66, x1:0.90, y1:0.98 },
  },
  // ENVIRONMENT state machine: the withdrawal beats, in order
  states:{
    initial:"withdrawing",
    nodes:{
      // concealed: the disguising mist lies over everything (Odysseus lost)
      concealed:{ preview:{ t:0.0, reveal:0.04, wind:1.1, status:"CONCEALED", progress:0.06 } },
      // harbor-clears: the sheltered bay is the first familiar thing to surface
      "harbor-clears":{ preview:{ t:0.6, reveal:0.24, wind:1.1, status:"CLEARING", progress:0.24 } },
      // withdrawing: mid-peel — harbour, shore, cave, olive out; mountain still veiled (neutral)
      withdrawing:{ preview:{ t:1.2, reveal:0.62, wind:1.0, status:"UNVEILING", progress:0.62 } },
      // summit-last: only the peak of Neriton still holds a cap of mist
      "summit-last":{ preview:{ t:1.8, reveal:0.84, wind:0.8, status:"CRESTING", progress:0.86 } },
      // revealed: the mist is gone — the whole familiar terrain stands clear
      revealed:{ preview:{ t:2.4, reveal:1.0, wind:0.5, status:"REVEALED", progress:1.0 } },
    },
    edges:[["concealed","harbor-clears"],["harbor-clears","withdrawing"],
           ["withdrawing","summit-last"],["summit-last","revealed"],
           ["revealed","concealed"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","reveal","dir","wind"],

  // neutral preview: mid-withdrawal — harbour, shore, cave and olive exposed,
  // the fog bank lifting up the slope of Neriton with the summit still veiled.
  preview:()=>({ t:1.2, reveal:0.62, dir:1, wind:1.0, status:"UNVEILING", progress:0.62,
                 layers:["sky","farHills","neriton","sea","harbor","shore","cave","olive","mist"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
