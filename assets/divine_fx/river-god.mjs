/* divine_fx.river-god — a localized current-intelligence that calms the water.
   DIVINE_FX asset. Scene function (OD-B05-S06): a river's own mind gathers at a
   LANDING POINT (source/locus), stills the surface into calmed CONCENTRIC RINGS
   (field), PARTS an opening lane through the current toward the shore (the safe
   landing path / target), and shows a faint BENEVOLENT FACE forming in the moving
   water — the visible consequence being a swimmer's granted safe landfall.

   Procedural, top-down-on-the-surface view. SOURCE = the still locus where the
   god manifests; FIELD = the concentric rings radiating from it; TARGET = the
   parted lane leading to the bank; TRANSFORM = turbulent current -> calmed water.
   Animates over state.t: rings breathe/shimmer outward, the parted lane's flow
   chevrons drift shoreward, the face breathes. The `calm` channel drives the whole
   effect (0 = churning river, no face, no lane -> 1 = glassy rings, open lane,
   clear benevolent face). `opening` scales the parted path width.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  cx:        0.50,   // ring center / god locus + face, x frac of W
  cy:        0.40,   // ring center / god locus + face, y frac of H
  rings:     7,      // concentric calmed rings radiating from the locus
  ringGap:   0.055,  // spacing between rings, frac of W
  ring0:     0.078,  // innermost ring radius, frac of W
  ryRatio:   0.60,   // vertical squash (water-surface foreshortening)
  laneHalf:  0.052,  // half-width of the parted opening lane, frac of W
  laneTop:   0.13,   // lane head below the face center, frac of H
  landingY:  0.88,   // shore/bank waterline, frac of H
  calm:      1.0,    // master stilling (channel-driven)
  opening:   1.0,    // parted-path width scale (channel-driven)
  intensity: 1.0,    // overall presence
};

/* ---- WATER: the river surface the intelligence inhabits (mid field so rings +
   face read), with residual current wavelets at the margins that AGITATE more as
   calm drops — the un-stilled river outside the god's reach. ---- */
function drawWater(pen,g,W,H,t,calm){
  g.fillStyle = inkLevel(3); g.fillRect(0,0,W,H*params.landingY);          // river body (mid)
  const turb = 1-calm;
  // residual current wavelets down the left + right margins (outside the calm)
  g.lineCap="round"; g.strokeStyle = inkLevel(4);
  for(let s=-1;s<=1;s+=2){
    const bx = s<0 ? W*0.08 : W*0.92;
    for(let r=0;r<7;r++){
      const y = lerp(H*0.06, H*params.landingY*0.94, r/6) + Math.sin(t*1.4 + r*1.1)*3;
      const amp = W*0.020*(0.5 + 1.4*turb);
      g.lineWidth = lerp(2, 3.5, r/6);
      g.beginPath();
      g.moveTo(bx - W*0.05, y);
      g.quadraticCurveTo(bx, y - amp, bx + W*0.05, y);
      g.stroke();
    }
  }
}

/* ---- FIELD: concentric calmed rings radiating from the god's locus, each an
   ellipse (surface foreshortening) PARTED at the bottom where the opening lane
   passes toward the shore. Darkest/thickest near the locus, fading outward.
   Animates: the ring set breathes outward with t; a low `calm` wobbles + breaks
   the rings into an agitated churn. ---- */
/* ---- the STILL CENTER POOL: the glassiest water right at the locus, a bright
   calm disc the benevolent face reads against (so the face isn't lost in the ring
   lines). Brightens with calm. ---- */
function drawPool(pen,g,W,H,calm){
  const cx = W*params.cx, cy = H*params.cy + H*0.012;
  const rx = W*0.185, ry = H*0.135;
  pen.paint(()=>{ g.ellipse(cx, cy, rx, ry, 0, 0, TAU); },
            toneSolid(inkLevel(calm>0.5?1:2)), 3);
}

function drawRings(pen,g,W,H,t,calm,opening){
  const cx = W*params.cx, cy = H*params.cy;
  const n = params.rings, turb = 1-calm;
  const laneHW = W*params.laneHalf*opening;
  const phase = (t*0.30) % 1;                                  // outward breathing
  g.lineJoin="round"; g.lineCap="round";
  for(let i=0;i<n;i++){
    const f = (i+phase)/n;                                     // 0 inner .. ~1 outer
    let rx = W*params.ring0 + (i+phase)*W*params.ringGap;
    const wob = W*0.016*turb*Math.sin(t*2.3 + i*1.7);          // churn when un-calm
    rx += wob;
    if (rx <= W*0.175) continue;                              // leave the still center pool clear
    const ry = rx*params.ryRatio;
    const lvl = Math.round(lerp(6, 2, clamp01(f)));            // dark near locus -> faint out
    g.strokeStyle = inkLevel(lvl);
    g.lineWidth   = lerp(4.5, 1.8, clamp01(f));
    // bottom gap where the parted lane runs through
    const ratio = clamp01(laneHW/Math.max(1,rx));
    const phi = Math.asin(ratio);                             // half-angle of the gap
    g.globalAlpha = lerp(0.55, 1, calm) * (1 - 0.25*turb*(i%2));
    g.beginPath();
    // draw the ring everywhere EXCEPT the bottom lane gap (theta ~ PI/2)
    g.ellipse(cx, cy, rx, ry, 0, Math.PI/2 + phi, Math.PI/2 - phi + TAU);
    g.stroke();
    g.globalAlpha = 1;
  }
}

/* ---- TARGET: the parted opening lane. A calm bright channel from the locus down
   to the shore (the water literally opened), flanked by two parted-current edge
   lines, with flow chevrons drifting shoreward to read the safe landing path.
   Grows/brightens with calm + opening. ---- */
function drawOpening(pen,g,W,H,t,calm,opening){
  const cx = W*params.cx, cy = H*params.cy;
  const topY = cy + H*params.laneTop;                        // lane head sits below the face
  const botY = H*params.landingY;
  const hw0 = W*params.laneHalf*opening*0.82;                 // half-width at the head
  const hw1 = W*params.laneHalf*opening*1.55;                 // widens toward the bank
  const bow = W*0.02*opening;                                 // gentle outward part

  // calm channel (the opened, stilled water) — a touch lighter than the river
  pen.paint(()=>{
    g.moveTo(cx-hw0, topY);
    g.quadraticCurveTo(cx-hw0-bow, (topY+botY)/2, cx-hw1, botY);
    g.lineTo(cx+hw1, botY);
    g.quadraticCurveTo(cx+hw0+bow, (topY+botY)/2, cx+hw0, topY);
    g.closePath();
  }, toneSolid(inkLevel(calm>0.5?1:2)), 0);

  // parted-current edge lines (the water held back on either side)
  g.strokeStyle = INK; g.lineCap="round"; g.lineWidth = 3.5;
  g.globalAlpha = lerp(0.35, 1, calm);
  for(let s=-1;s<=1;s+=2){
    g.beginPath();
    g.moveTo(cx + s*hw0, topY);
    g.quadraticCurveTo(cx + s*(hw0+bow), (topY+botY)/2, cx + s*hw1, botY);
    g.stroke();
  }
  // flow chevrons drifting shoreward down the lane (the current invites landfall)
  g.lineWidth = 3; g.strokeStyle = inkLevel(4);
  const nCh = 4, drift = (t*0.22) % 1;
  for(let k=0;k<nCh;k++){
    const fk = (k+drift)/nCh;
    const y = lerp(topY + (botY-topY)*0.14, botY - (botY-topY)*0.10, fk);
    const w = lerp(hw0, hw1, fk)*0.55;
    g.beginPath();
    g.moveTo(cx - w, y - w*0.45);
    g.lineTo(cx, y + w*0.28);
    g.lineTo(cx + w, y - w*0.45);
    g.stroke();
  }
  g.globalAlpha = 1;
}

/* ---- the faint BENEVOLENT FACE forming in the current: gentle closed calm eyes,
   soft brows, a small nose ripple, and a broad kind smile — all rendered FAINT
   (low ink, reduced alpha) so it reads as suggested-in-water, not drawn-on-top.
   It breathes with t and fades in with calm. Centered on the locus. ---- */
function drawFace(pen,g,W,H,t,calm){
  const cx = W*params.cx, cy = H*params.cy + Math.sin(t*0.9)*H*0.004;
  const eyeDX = W*0.125, eyeY = cy - H*0.028, browY = eyeY - H*0.032;
  const a = clamp01(lerp(-0.1, 0.95, calm));                  // face only after calming
  if (a <= 0.02) return;
  g.save();
  g.globalAlpha = a;
  g.lineCap="round"; g.lineJoin="round";
  // calm closed eyes — gentle downward smiling arcs (kindly, half-moon)
  g.strokeStyle = inkLevel(5); g.lineWidth = 3.6;
  for(let s=-1;s<=1;s+=2){
    const ex = cx + s*eyeDX;
    g.beginPath();
    g.moveTo(ex - W*0.052, eyeY - H*0.004);
    g.quadraticCurveTo(ex, eyeY + H*0.024, ex + W*0.052, eyeY - H*0.004);
    g.stroke();
    // a small under-eye ripple for a kindly crease
    g.strokeStyle = inkLevel(3); g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(ex - W*0.032, eyeY + H*0.018);
    g.quadraticCurveTo(ex, eyeY + H*0.032, ex + W*0.032, eyeY + H*0.018);
    g.stroke();
    g.strokeStyle = inkLevel(5); g.lineWidth = 3.6;
  }
  // soft brows
  g.strokeStyle = inkLevel(4); g.lineWidth = 3;
  for(let s=-1;s<=1;s+=2){
    const ex = cx + s*eyeDX;
    g.beginPath();
    g.moveTo(ex - W*0.058, browY + H*0.008);
    g.quadraticCurveTo(ex, browY - H*0.012, ex + W*0.058, browY + H*0.008);
    g.stroke();
  }
  // nose ripple
  g.strokeStyle = inkLevel(4); g.lineWidth = 2.8;
  g.beginPath();
  g.moveTo(cx - W*0.006, eyeY + H*0.012);
  g.lineTo(cx - W*0.016, cy + H*0.026);
  g.quadraticCurveTo(cx, cy + H*0.038, cx + W*0.020, cy + H*0.024);
  g.stroke();
  // broad benevolent smile
  g.strokeStyle = inkLevel(5); g.lineWidth = 3.8;
  g.beginPath();
  g.moveTo(cx - W*0.135, cy + H*0.058);
  g.quadraticCurveTo(cx, cy + H*0.110, cx + W*0.135, cy + H*0.058);
  g.stroke();
  g.restore();
}

/* ---- SOURCE: the god's still locus at the ring center — a small calm disc with
   a few short radiating stilling ticks marking where the current-intelligence
   gathers. The blue-adjacent dark point the whole field organizes around. ---- */
function drawSource(pen,g,W,H,t,calm){
  // the wellspring locus sits at the head of the opened lane (below the face),
  // feeding the parted path — NOT on the face, so it never reads as an eye.
  const cx = W*params.cx, cy = H*params.cy + H*params.laneTop;
  const r = W*0.020*(0.85 + 0.15*Math.sin(t*1.6));
  pen.paint(()=>{ g.arc(cx, cy, r, 0, TAU); }, toneSolid(inkLevel(6)), 3.5);
  pen.paint(()=>{ g.arc(cx, cy, r*0.42, 0, TAU); }, toneSolid(inkLevel(2)), 2.5);
  // short stilling ticks radiating from the wellspring (calm scales their reach)
  g.strokeStyle = inkLevel(5); g.lineWidth = 2.4; g.lineCap="round";
  const nT = 8;
  for(let k=0;k<nT;k++){
    const ang = (k/nT)*TAU + t*0.2;
    const r0 = r*1.3, r1 = r*(1.9 + 0.9*calm);
    g.beginPath();
    g.moveTo(cx + Math.cos(ang)*r0, cy + Math.sin(ang)*r0*params.ryRatio);
    g.lineTo(cx + Math.cos(ang)*r1, cy + Math.sin(ang)*r1*params.ryRatio);
    g.stroke();
  }
}

/* ---- the LANDING / shore bank at the foot of the parted lane (foreground, dark
   solid) with a stepped-ashore notch at the lane mouth — the target the god's
   opened path delivers the swimmer to. ---- */
function drawLanding(pen,g,W,H,calm,opening){
  const by = H*params.landingY;
  const cx = W*params.cx;
  const hw = W*params.laneHalf*opening*1.35;
  // the bank (dark solid foreground) with a gently curved waterline top
  pen.paint(()=>{
    g.moveTo(0, by);
    g.quadraticCurveTo(W*0.25, by - H*0.012, cx - hw, by);
    // the calm landing notch dips into the bank at the lane mouth
    g.lineTo(cx - hw*0.55, by + H*0.026);
    g.quadraticCurveTo(cx, by + H*0.040, cx + hw*0.55, by + H*0.026);
    g.lineTo(cx + hw, by);
    g.quadraticCurveTo(W*0.75, by - H*0.012, W, by);
    g.lineTo(W, H); g.lineTo(0, H); g.closePath();
  }, toneSolid(inkLevel(6)), 5);
  // a lighter footing at the landing point (safe step-ashore)
  pen.paint(()=>{ g.ellipse(cx, by + H*0.020, hw*0.42, H*0.014, 0, 0, TAU); }, toneSolid(inkLevel(2)), 3);
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const calm = clamp01(st.calm ?? params.calm);
  const opening = clamp01(st.opening ?? params.opening);
  const layers = st.layers || ["water","pool","rings","opening","face","source","landing"];
  const has = l => layers.includes(l);

  if (has("water"))   drawWater(pen,g,W,H,t,calm);
  if (has("pool"))    drawPool(pen,g,W,H,calm);
  if (has("rings"))   drawRings(pen,g,W,H,t,calm,opening);
  if (has("opening")) drawOpening(pen,g,W,H,t,calm,opening);
  if (has("face"))    drawFace(pen,g,W,H,t,calm);
  if (has("source"))  drawSource(pen,g,W,H,t,calm);
  if (has("landing")) drawLanding(pen,g,W,H,calm,opening);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.river-god",
  type:"DIVINE_FX",
  name:"River god",
  statusWord:"CALMING",
  scene:"OD-B05-S06",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["water","pool","rings","opening","face","source","landing"],
  // normalized 0..1 source/target/field/consequence anchors
  anchors:{
    "source:locus":{   x:0.50, y:0.53 },   // wellspring at the head of the opened lane
    "field:rings":{    x:0.50, y:0.40 },   // the calmed concentric ring field
    "face:current":{   x:0.50, y:0.40 },   // the faint benevolent face
    "path:opening":{   x:0.50, y:0.65 },   // the parted lane toward shore
    "target:landing":{ x:0.50, y:0.90 },   // the safe landing point on the bank
    "camera:wide":{    x:0.50, y:0.50 },
  },
  // affected regions
  zones:{
    calm:{    x0:0.14, y0:0.14, x1:0.86, y1:0.70 },   // the stilled ring field
    lane:{    x0:0.38, y0:0.42, x1:0.62, y1:0.88 },   // the parted opening path
    landing:{ x0:0.34, y0:0.86, x1:0.66, y1:0.98 },   // the shore step-ashore
  },
  // DIVINE_FX field states: churning current -> calming -> calmed, open, benevolent
  states:{
    initial:"calmed",
    nodes:{
      // churning: no face, closed water, agitated rings — the river before the god acts
      churning:{ preview:{ t:0.6, calm:0.10, opening:0.15, status:"CHURNING", progress:0.10 } },
      // calming: rings organizing, lane parting, face just emerging
      calming:{  preview:{ t:1.6, calm:0.55, opening:0.60, status:"CALMING",  progress:0.50 } },
      // calmed: glassy concentric rings, open lane, clear benevolent face (neutral)
      calmed:{   preview:{ t:2.4, calm:1.00, opening:1.00, status:"CALMED",   progress:0.88 } },
    },
    edges:[["churning","calming"],["calming","calmed"],["calmed","calming"],["calming","churning"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","calm","opening","intensity"],

  // neutral preview: the calmed state — concentric rings glassy around the locus,
  // the opening lane parted clear to the landing, the benevolent face formed in
  // the current (reads unmistakably as the river god granting safe landfall).
  preview:()=>({ t:2.2, calm:1.0, opening:1.0, status:"CALMED", progress:0.85,
                 layers:["water","pool","rings","opening","face","source","landing"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
