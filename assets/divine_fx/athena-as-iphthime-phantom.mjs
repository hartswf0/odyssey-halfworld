/* divine_fx.athena-as-iphthime-phantom — the goddess sends a dream-double.
   DIVINE_FX asset. Scene function (OD-B04-S07): Athena fashions a phantom in the
   likeness of Iphthime (Penelope's sister), sends it EDGEWISE through the bolted
   door as a slit of light, it stands translucent in the sleeping-chamber and
   SPEAKS REASSURANCE, then DISSOLVES back into the door-crack and is gone.

   Procedural: SOURCE (a vertical door-crack of light where the phantom is born)
   -> FIELD (a wedge of spilled light across the chamber floor + reassurance
   ripples in the dark air) -> TRANSFORM (a faint translucent ghost-woman
   coalescing from the crack, holding, then breaking into dissolve motes that
   stream back to the crack) -> visible CONSEQUENCE (reassurance delivered, the
   room left empty and calmed).

   Animates over state.t: 0 = the door-crack opens, the dream-double emerges near
   it, barely there; ~0.45 = the phantom stands full in the room, brightest,
   speaking (reassurance ripples bloom at her head); 1 = she dissolves into motes
   that drain back through the crack, the light narrowing to a seam.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  floor:     0.82,   // chamber floor line as frac of H
  doorX:     0.17,   // x of the door-crack (the source seam) as frac of W
  doorX0:    0.06,   // door panel left edge
  doorX1:    0.28,   // door panel right edge
  centerX:   0.57,   // where the standing phantom settles (target)
  figH:      0.52,   // phantom height as frac of H
  motes:     16,     // dissolve motes streaming to/from the crack
  glow:      1.0,    // master door-glow strength (channel-driven)
  intensity: 1.0,    // overall energy of the apparition
};

/* ---- the sleeping CHAMBER the apparition happens in: a dark night wall so the
   door-glow and the pale phantom read, a lighter floor plane, a hint of the
   bolted door frame the crack splits. Empty — no sleeper baked in. ---- */
function drawChamber(pen,g,W,H){
  const fy = H*params.floor;
  g.fillStyle = inkLevel(2); g.fillRect(0,0,W,fy);            // night chamber wall (soft)
  g.fillStyle = inkLevel(1); g.fillRect(0,fy,W,H-fy);         // floor plane (lightest)
  pen.ink(()=>{ g.moveTo(0,fy); g.lineTo(W,fy); }, 4);        // baseboard seam
  // a low dark dado band along the wall base so the room reads as a chamber
  g.fillStyle = inkLevel(3); g.fillRect(0, fy-H*0.045, W, H*0.045);
  pen.ink(()=>{ g.moveTo(0,fy-H*0.045); g.lineTo(W,fy-H*0.045); }, 3);
  // a couple of receding floor joints so the plane reads as ground
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.30;
  for(let j=1;j<=2;j++){ const y=fy+(H-fy)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha = 1;
}

/* ---- SOURCE: the bolted door and its vertical CRACK OF LIGHT. The dark door
   panel splits along a bright seam; concentric halo bands (no gradients — flat
   tone steps) bloom the glow; a few thin rays fan into the room. The crack
   WIDENS as the phantom emerges (enterT) and NARROWS to a seam as she drains
   back (1-dissolveT). ---- */
function drawDoor(pen,g,W,H,t,crackK,glow){
  const fy = H*params.floor;
  const x0 = W*params.doorX0, x1 = W*params.doorX1, topY = H*0.09;
  const sx = W*params.doorX;
  // dark door panel
  pen.paint(()=>{ g.rect(x0, topY, x1-x0, fy-topY); }, toneSolid(inkLevel(6)), 5);
  // vertical plank seams on the door
  g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.5;
  for(const fx of [0.36,0.68]){ const px=lerp(x0,x1,fx); g.beginPath(); g.moveTo(px,topY); g.lineTo(px,fy); g.stroke(); }
  g.globalAlpha = 1;
  // two iron bolt studs
  g.fillStyle = inkLevel(7);
  for(const fyf of [0.28,0.72]){ g.beginPath(); g.arc(lerp(x0,x1,0.20), lerp(topY,fy,fyf), W*0.011, 0, TAU); g.fill(); }

  // ---- the crack of light: flat halo bands widest->brightest, centered on sx
  const sw = lerp(W*0.004, W*0.015, crackK) * (0.8+0.2*glow);   // seam half-width
  const cy0 = topY+6, cy1 = fy-4;
  const band = (hw, lvl)=>{ g.fillStyle = inkLevel(lvl); g.fillRect(sx-hw, cy0, hw*2, cy1-cy0); };
  band(sw*3.0, 3);      // outer bloom
  band(sw*1.9, 1);      // inner bloom
  band(sw*1.0, 0);      // near-paper glow
  band(sw*0.45, 0);     // pure light seam
  // crisp edges of the seam
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.6;
  g.beginPath(); g.moveTo(sx-sw*1.2, cy0); g.lineTo(sx-sw*1.2, cy1);
  g.moveTo(sx+sw*1.2, cy0); g.lineTo(sx+sw*1.2, cy1); g.stroke();
  g.globalAlpha = 1;

  // ---- thin light rays fanning from the crack into the room ----
  g.strokeStyle = inkLevel(1); g.lineCap="round";
  g.globalAlpha = (0.5+0.4*glow)*0.7;
  for(let k=-2;k<=2;k++){
    const ry = lerp(cy0, cy1, 0.5) + k*H*0.10;
    const l  = W*0.30*(0.7+0.3*glow);
    g.lineWidth = lerp(6,2,Math.abs(k)/2);
    g.beginPath(); g.moveTo(sx+sw*1.2, ry);
    g.lineTo(sx+sw*1.2 + l, ry + k*H*0.02);
    g.stroke();
  }
  g.globalAlpha = 1;
  return { sx, cy0, cy1 };
}

/* ---- FIELD: the wedge of light spilled from the crack across the floor, on
   which the phantom stands. Flat bright polygon (no gradient). ---- */
function drawLightWedge(pen,g,W,H,sx,glow){
  const fy = H*params.floor;
  g.save();
  g.globalAlpha = (0.55+0.45*glow);
  g.fillStyle = inkLevel(1);
  g.beginPath();
  g.moveTo(sx, fy-2);
  g.lineTo(W*0.30, H*0.995);
  g.lineTo(W*0.86, H*0.995);
  g.lineTo(sx+W*0.02, fy-2);
  g.closePath(); g.fill();
  g.restore();
  // a couple of seams within the wedge (spill edges)
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.25;
  g.beginPath(); g.moveTo(sx, fy-2); g.lineTo(W*0.30, H*0.995);
  g.moveTo(sx+W*0.02, fy-2); g.lineTo(W*0.86, H*0.995); g.stroke();
  g.globalAlpha = 1;
}

/* ---- TRANSFORM: the translucent dream-double of Iphthime. A faint robed
   ghost-woman — veiled head, long robe flaring to the floor, one hand raised in
   reassurance. Drawn at reduced alpha in light tones with a brighter inner core
   so she glows rather than blocks; the contour is thin and soft. `alpha` is her
   presence (0 gone .. ~0.62 full); `px` her x. Returns the head anchor. ---- */
function drawPhantom(pen,g,W,H,px,alpha){
  const fy = H*params.floor;
  const figH = H*params.figH;
  const headR = figH*0.100;
  const headCy = fy - figH + headR;
  const shY = headCy + headR*1.7;
  const hipY = fy - figH*0.44;
  const shW = figH*0.30, hipW = figH*0.24, hemW = figH*0.46;
  if (alpha<=0.02) return { x:px, y:headCy };
  g.save();
  // translucency comes from LIGHT fills (you see through her); the CONTOUR stays
  // crisp so the ghost-woman silhouette is legible. alpha only fades her as a
  // whole while she materializes / dissolves.
  g.globalAlpha = alpha;
  const robe = toneSolid(inkLevel(3));   // faint body — barely above the wall

  // ---- robe: shoulders -> flaring hem at the floor ----
  pen.paint(()=>{
    g.moveTo(px-shW*0.5, shY);
    g.quadraticCurveTo(px-shW*0.62, hipY, px-hemW*0.5, fy);
    g.quadraticCurveTo(px, fy+figH*0.02, px+hemW*0.5, fy);
    g.quadraticCurveTo(px+shW*0.62, hipY, px+shW*0.5, shY);
    g.quadraticCurveTo(px, shY-figH*0.03, px-shW*0.5, shY);
    g.closePath();
  }, robe, 4);
  // bright inner core of the robe (the light passing through her)
  pen.fillPath(()=>{
    g.moveTo(px-shW*0.24, shY+figH*0.03);
    g.quadraticCurveTo(px-shW*0.26, hipY, px-hemW*0.22, fy-4);
    g.lineTo(px+hemW*0.22, fy-4);
    g.quadraticCurveTo(px+shW*0.26, hipY, px+shW*0.24, shY+figH*0.03);
    g.closePath();
  }, inkLevel(1));
  // vertical robe folds (crisp)
  g.strokeStyle = INK; g.lineWidth = 2.5; g.lineCap="round";
  for(const ff of [-0.55,0,0.55]){
    g.beginPath(); g.moveTo(px+ff*shW*0.5, shY+figH*0.05);
    g.quadraticCurveTo(px+ff*hemW*0.55, hipY, px+ff*hemW*0.6, fy-4); g.stroke();
  }

  // ---- raised reassurance hand (near arm), open palm at head height ----
  const shoR = { x:px+shW*0.44, y:shY+figH*0.02 };
  const elb  = { x:px+shW*0.80, y:shY-figH*0.09 };
  const wr   = { x:px+shW*0.66, y:headCy+headR*0.5 };
  pen.limb(()=>{ g.moveTo(shoR.x,shoR.y); g.lineTo(elb.x,elb.y); }, robe, figH*0.052);
  pen.limb(()=>{ g.moveTo(elb.x,elb.y); g.lineTo(wr.x,wr.y); }, robe, figH*0.042);
  pen.paint(()=>{ g.arc(wr.x, wr.y, figH*0.038, 0, TAU); }, toneSolid(inkLevel(2)), 3);
  // resting far arm along the robe
  pen.limb(()=>{ g.moveTo(px-shW*0.44, shY+figH*0.02); g.lineTo(px-shW*0.50, hipY); }, robe, figH*0.048);

  // ---- neck + head ----
  pen.limb(()=>{ g.moveTo(px, shY); g.lineTo(px, headCy+headR*0.7); }, robe, figH*0.044);
  pen.paint(()=>{ g.arc(px, headCy, headR, 0, TAU); }, toneSolid(inkLevel(2)), 3.5);

  // ---- veil/hair drape framing the head (a woman, Iphthime) ----
  pen.paint(()=>{
    g.moveTo(px-headR*1.08, headCy-headR*0.1);
    g.quadraticCurveTo(px, headCy-headR*1.6, px+headR*1.08, headCy-headR*0.1);
    g.quadraticCurveTo(px+headR*1.42, headCy+headR*1.5, px+headR*0.9, shY-figH*0.01);
    g.quadraticCurveTo(px, headCy+headR*1.0, px-headR*0.9, shY-figH*0.01);
    g.quadraticCurveTo(px-headR*1.42, headCy+headR*1.5, px-headR*1.08, headCy-headR*0.1);
    g.closePath();
  }, toneSolid(inkLevel(3)), 3);
  // bright face oval inside the veil (the light shows through)
  pen.paint(()=>{ g.ellipse(px, headCy-headR*0.02, headR*0.66, headR*0.82, 0, 0, TAU); }, toneSolid(inkLevel(1)), 2.5);

  g.restore();
  return { x:px, y:headCy };
}

/* ---- reassurance RIPPLES: soft concentric arcs opening from the phantom's head
   into the dark air — the spoken comfort. Bloom most while she stands speaking. */
function drawSpeech(pen,g,W,H,hx,hy,amt,t){
  if (amt<0.04) return;
  g.save(); g.lineCap="round";
  for(let k=0;k<4;k++){
    const ph = ((t*0.6 + k*0.25) % 1);
    const r = H*(0.03 + ph*0.16);
    g.strokeStyle = inkLevel(3 - Math.round(ph*2));
    g.lineWidth = lerp(4,1.5,ph);
    g.globalAlpha = (1-ph)*amt*0.9;
    g.beginPath();
    // arcs opening to the right/up, toward the sleeper's side of the room
    g.arc(hx, hy, r, -TAU*0.32, TAU*0.20);
    g.stroke();
  }
  g.globalAlpha = 1; g.restore();
}

/* ---- dissolve MOTES: the phantom breaking into flecks that stream BACK to the
   door-crack as she leaves (dissolveT). A gentler scatter while she first
   coalesces from the crack (enterT small). ---- */
function drawMotes(pen,g,W,H,px,hy,sx,cy,amt,drainK){
  if (amt<0.03) return;
  const fy = H*params.floor;
  g.save(); g.fillStyle = inkLevel(6);
  const n = params.motes;
  for(let i=0;i<n;i++){
    const seed = (i*53%29)/29;
    const along = ((seed + drainK*0.85 + i*0.05) % 1);           // 0 at phantom .. 1 at crack
    // path from a point on the phantom's body toward the crack seam
    const bx = px + (seed-0.5)*W*0.10;
    const by = lerp(hy, fy-H*0.06, (i%5)/5);
    const tx = sx, ty = lerp(cy, hy, 0.4);
    const x = lerp(bx, tx, along) + Math.sin(seed*TAU + drainK*6)*W*0.03*(1-along);
    const y = lerp(by, ty, along) - along*H*0.02;
    const r = (1.4 + 3.2*(1-along))*amt;
    g.globalAlpha = (0.75*(1-along)+0.2)*amt;
    g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
  }
  g.globalAlpha = 1; g.restore();
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = clamp01(st.t ?? 0.45);
  const inten = st.intensity ?? params.intensity;
  const glow = (st.glow ?? params.glow) * inten;
  const layers = st.layers || ["chamber","door","wedge","phantom","speech","motes"];
  const has = l => layers.includes(l);

  // ---- phase kinematics ----
  const enterT    = clamp01(t/0.42);                       // crack opens, phantom emerges
  const dissolveT = clamp01((t-0.58)/0.42);                // phantom drains back to crack
  const doorX = W*params.doorX, centerX = W*params.centerX;
  const px = lerp(doorX + W*0.06, centerX, smooth(enterT));// slides in from the crack
  // presence: fade in as she emerges, hold, fade out as she dissolves
  const presence = smooth(clamp01(t/0.16)) * (1 - smooth(dissolveT));
  const alpha = presence * 0.92;   // translucency is in the light fills; alpha fades her on enter/dissolve
  const crackK = clamp01(enterT) * (1 - 0.75*dissolveT);   // crack width over the arc
  const speechAmt = clamp01(1 - Math.abs(t-0.46)/0.30) * presence;
  const moteAmt = clamp01(dissolveT*1.05 + (1-enterT)*0.35);

  let door = { sx:doorX, cy0:H*0.09, cy1:H*params.floor };
  if (has("chamber")) drawChamber(pen,g,W,H);
  if (has("door"))    door = drawDoor(pen,g,W,H,t,crackK,glow);
  if (has("wedge"))   drawLightWedge(pen,g,W,H,door.sx,glow);
  const head = drawPhantom(pen,g,W,H, has("phantom")?px:px, has("phantom")?alpha:0);
  if (has("speech"))  drawSpeech(pen,g,W,H,head.x,head.y,speechAmt,t);
  if (has("motes"))   drawMotes(pen,g,W,H,px,head.y,door.sx,(door.cy0+door.cy1)/2,moteAmt,dissolveT);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.athena-as-iphthime-phantom",
  type:"DIVINE_FX",
  name:"Athena as Iphthime phantom",
  statusWord:"REASSURING",
  scene:"OD-B04-S07",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["chamber","door","wedge","phantom","speech","motes"],
  // normalized 0..1 source/field/transform/consequence/camera anchors
  anchors:{
    "source:door-crack":{ x:0.20, y:0.46 },   // the seam of light the phantom is born from
    "field:light-wedge":{ x:0.52, y:0.90 },   // the spilled light she stands in
    "transform:phantom":{ x:0.56, y:0.50 },   // the standing dream-double
    "phantom:head":{      x:0.56, y:0.28 },   // where reassurance ripples bloom
    "phantom:hand":{      x:0.62, y:0.32 },   // the raised reassuring hand
    "consequence:calm":{  x:0.72, y:0.60 },   // the reassured sleeper's side (empty)
    "camera:wide":{       x:0.50, y:0.50 },
  },
  // affected regions (the crack it enters by, the space it fills)
  zones:{
    crack:{  x0:0.16, y0:0.09, x1:0.24, y1:0.82 },
    room:{   x0:0.34, y0:0.20, x1:0.94, y1:0.99 },
    phantom:{x0:0.44, y0:0.24, x1:0.68, y1:0.84 },
  },
  // DIVINE_FX transform states: entering -> speaking -> dissolving
  states:{
    initial:"speaking",
    nodes:{
      // entering: crack opens, the dream-double barely there at the seam (source)
      entering:{   preview:{ t:0.12, intensity:1.0, status:"ENTERING",   progress:0.12 } },
      // speaking: phantom full in the room, brightest, reassurance ripples (neutral)
      speaking:{   preview:{ t:0.46, intensity:1.0, status:"REASSURING", progress:0.46 } },
      // dissolving: she breaks into motes draining back to the crack
      dissolving:{ preview:{ t:0.90, intensity:1.0, status:"DISSOLVING", progress:0.90 } },
    },
    edges:[["entering","speaking"],["speaking","dissolving"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","glow","alpha"],

  // neutral preview: the phantom stands full in the chamber, translucent, one
  // hand raised, reassurance ripples blooming, the door-crack of light behind
  // her and a few dissolve motes drifting — reads unmistakably as the Iphthime
  // dream-double.
  preview:()=>({ t:0.46, intensity:1.0, glow:1.0, status:"REASSURING", progress:0.46,
                 layers:["chamber","door","wedge","phantom","speech","motes"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
