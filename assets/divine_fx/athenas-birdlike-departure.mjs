/* divine_fx.athenas-birdlike-departure — the goddess quitting a mortal room as a
   bird. DIVINE_FX asset. Scene function (OD-B01-S06): a human silhouette (Athena
   in disguise / Mentes) RESOLVES upward into a swift ascending sea-eagle and
   leaves a residual PULSE OF COURAGE behind at the spot she left.
   Procedural: SOURCE (the standing human at the floor) -> FIELD (a vertical
   ascent corridor of lift streaks) -> TARGET (the open air above) -> TRANSFORM
   (human -> bird -> pulse) -> visible CONSEQUENCE (a courage pulse blooming at
   the departure point). Animates over state.t: 0 = human still present,
   ~0.5 = mid-resolve (bird formed and rising, human dissolving into motes),
   1 = the sea-eagle high and gone, only the courage pulse remaining.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const params = {
  departure:{ x:0.50, y:0.84 },  // the spot on the floor she leaves from (source)
  apex:{      x:0.50, y:0.16 },  // where the ascending bird reaches (target)
  ground:0.86,                   // floor line as fraction of H
  liftStreaks:8,                 // vertical lift lines in the ascent corridor
  wingSpan:1.0,                  // master wing extension (channel-driven)
  intensity:1.0,                 // overall energy of the effect
};

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

/* ---- FLOOR + the ROOM plane the departure happens over ---- */
function drawFloor(pen,g,W,H){
  const gy = H*params.ground;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,gy);          // airy room above (light)
  g.fillStyle = inkLevel(3); g.fillRect(0,gy,W,H-gy);        // floor slab
  pen.ink(()=>{ g.moveTo(0,gy); g.lineTo(W,gy); }, 4);
  // a couple of receding floor seams so the plane reads as ground, not a bar
  g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.35;
  for(let j=1;j<=2;j++){ const y=gy+(H-gy)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha = 1;
}

/* ---- residual HUMAN silhouette (the disguise she sheds) — fades as t rises,
   and sends up rising motes as the form dissolves into the bird ---- */
function drawHuman(pen,g,W,H,dx,dy,fade){
  const hH = H*0.28;                         // figure height
  const headR = hH*0.12;
  const headCy = dy - hH + headR;
  const crownY = headCy - headR;
  if (fade<=0.02) return crownY;
  g.save();
  g.globalAlpha = fade;
  const tone = toneSolid(inkLevel(6));
  const shY = headCy + headR*1.4;
  const hipY = dy - hH*0.42;
  const shW = hH*0.30, hipW = hH*0.22;
  // torso
  pen.paint(()=>{
    g.moveTo(dx-shW*0.5, shY);
    g.lineTo(dx+shW*0.5, shY);
    g.lineTo(dx+hipW*0.5, hipY);
    g.lineTo(dx-hipW*0.5, hipY);
    g.closePath();
  }, tone, 4);
  // legs
  pen.limb(()=>{ g.moveTo(dx-hipW*0.32, hipY); g.lineTo(dx-hipW*0.30, dy); }, tone, hH*0.075);
  pen.limb(()=>{ g.moveTo(dx+hipW*0.32, hipY); g.lineTo(dx+hipW*0.30, dy); }, tone, hH*0.075);
  // arms lifting slightly (mid-transformation)
  pen.limb(()=>{ g.moveTo(dx-shW*0.42, shY+hH*0.02); g.lineTo(dx-shW*0.72, shY-hH*0.16); }, tone, hH*0.06);
  pen.limb(()=>{ g.moveTo(dx+shW*0.42, shY+hH*0.02); g.lineTo(dx+shW*0.72, shY-hH*0.16); }, tone, hH*0.06);
  // neck + head
  pen.limb(()=>{ g.moveTo(dx,shY); g.lineTo(dx,headCy+headR*0.6); }, tone, hH*0.05);
  pen.paint(()=>{ g.arc(dx, headCy, headR, 0, TAU); }, tone, 4);
  g.restore();
  return crownY;
}

/* ---- ASCENT FIELD: vertical lift streaks funneling from floor -> apex ---- */
function drawField(pen,g,W,H,dx,dy,ax,ay,t,inten){
  const n = params.liftStreaks;
  g.save(); g.lineCap = "round";
  for(let i=0;i<n;i++){
    const f = n>1 ? (i/(n-1))*2-1 : 0;            // -1..1 across the corridor
    const botX = dx + f*W*0.14;
    const topX = ax + f*W*0.05;
    const midX = lerp(botX,topX,0.5) + f*W*0.02;
    const edge = 1 - Math.abs(f)*0.45;            // center streaks strongest
    g.strokeStyle = inkLevel(2 + Math.round(edge*2));  // 2..4
    g.lineWidth = 1.4 + edge*1.8;
    g.setLineDash([H*0.03, H*0.028]);
    g.lineDashOffset = (t*H*1.1 + i*9);           // dashes stream UPWARD = lift
    g.globalAlpha = (0.5 + 0.35*edge)*inten;
    g.beginPath();
    g.moveTo(botX, dy - H*0.02);
    g.quadraticCurveTo(midX, (dy+ay)/2, topX, ay);
    g.stroke();
  }
  g.setLineDash([]); g.globalAlpha = 1; g.restore();
}

/* ---- rising MOTES: the human form dissolving upward into the bird.
   Stream begins at `fromY` (the human's crown) so the standing figure below
   stays legible and the motes clearly peel OFF it toward the bird. ---- */
function drawMotes(pen,g,W,H,dx,fromY,bx,by,t,inten){
  const amt = clamp01(1 - Math.abs(t-0.5)*1.6);   // densest at mid-transform
  if (amt<0.03) return;
  g.save(); g.fillStyle = inkLevel(5);
  const n = 13;
  for(let i=0;i<n;i++){
    const seed = (i*37%13)/13;
    const along = ((seed + t*0.9 + i*0.06)%1);     // 0 crown .. 1 bird
    const x = lerp(dx,bx,along) + Math.sin(seed*TAU + t*3)*W*0.055*(1-along);
    const y = lerp(fromY, by, along);
    const r = (1.3 + 3.0*(1-along))*amt*(0.6+0.4*inten);
    g.globalAlpha = (0.8*(1-along)+0.18)*amt;
    g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
  }
  g.globalAlpha = 1; g.restore();
}

/* ---- the SEA-EAGLE: broad-winged silhouette, wings up-swept in ascent.
   `form` 0..1 morphs folded->fully-spread. Drawn dark + crisp contour. ---- */
function drawEagle(pen,g,W,H,bx,by,scale,form){
  const tone = toneSolid(inkLevel(7));
  const bodyLen = W*0.24*scale;
  const bodyHW  = bodyLen*0.20;
  const wl = W*0.24*scale*(0.32 + 0.68*form);   // wing length grows with the transformation
  const up = wl*0.60;                            // up-sweep of the wingtips

  // ---- WINGS (drawn first, behind the body) ----
  const wing = (side)=>{
    const sh = { x: bx + side*bodyHW*0.6, y: by - bodyLen*0.06 };
    const tip = { x: sh.x + side*wl, y: sh.y - up };
    pen.paint(()=>{
      g.moveTo(sh.x, sh.y - bodyLen*0.22);                                       // leading root (high)
      g.quadraticCurveTo(bx + side*wl*0.55, tip.y - wl*0.14, tip.x, tip.y);      // leading edge -> tip
      g.quadraticCurveTo(tip.x - side*wl*0.06, tip.y + up*0.34,
                         sh.x + side*wl*0.46, sh.y + bodyLen*0.10);              // outer/trailing curve
      g.quadraticCurveTo(sh.x + side*wl*0.18, sh.y + bodyLen*0.20,
                         sh.x, sh.y + bodyLen*0.10);                             // trailing -> root
      g.closePath();
    }, tone, Math.max(2, W*0.006));
    // primary-feather "fingers" split near the tip (structural seams)
    g.strokeStyle = INK; g.lineWidth = Math.max(2, W*0.005); g.lineCap="round";
    for(let k=0;k<3;k++){
      const fx = lerp(sh.x, tip.x, 0.62 + k*0.13);
      const fy = lerp(sh.y - bodyLen*0.02, tip.y, 0.62 + k*0.13);
      g.beginPath(); g.moveTo(fx, fy);
      g.lineTo(fx + side*wl*0.10, fy + up*0.14 + wl*0.03*k);
      g.stroke();
    }
  };
  wing(-1); wing(1);

  // ---- BODY (teardrop, nose up) ----
  pen.paint(()=>{
    g.moveTo(bx, by - bodyLen*0.55);
    g.quadraticCurveTo(bx + bodyHW*1.15, by - bodyLen*0.28, bx + bodyHW*0.92, by + bodyLen*0.04);
    g.quadraticCurveTo(bx + bodyHW*0.70, by + bodyLen*0.40, bx + bodyHW*0.50, by + bodyLen*0.56);
    g.lineTo(bx, by + bodyLen*0.64);                                            // tail center notch
    g.lineTo(bx - bodyHW*0.50, by + bodyLen*0.56);
    g.quadraticCurveTo(bx - bodyHW*0.70, by + bodyLen*0.40, bx - bodyHW*0.92, by + bodyLen*0.04);
    g.quadraticCurveTo(bx - bodyHW*1.15, by - bodyLen*0.28, bx, by - bodyLen*0.55);
    g.closePath();
  }, tone, Math.max(2, W*0.006));
  // tail wedge splits
  pen.seam(()=>{ g.moveTo(bx, by+bodyLen*0.30); g.lineTo(bx, by+bodyLen*0.62); }, 2);

  // ---- HEAD + hooked beak (points up, direction of flight) ----
  const headCy = by - bodyLen*0.62, headR = bodyLen*0.15;
  pen.paint(()=>{ g.arc(bx, headCy, headR, 0, TAU); }, tone, Math.max(2, W*0.006));
  pen.paint(()=>{                                                              // beak
    g.moveTo(bx - headR*0.32, headCy - headR*0.55);
    g.lineTo(bx, headCy - headR*1.7);
    g.lineTo(bx + headR*0.32, headCy - headR*0.55);
    g.closePath();
  }, tone, 2);
  // bright eye-mark (tonal contrast on the dark head)
  pen.fillPath(()=>{ g.arc(bx + headR*0.32, headCy - headR*0.1, headR*0.20, 0, TAU); }, inkLevel(1));
}

/* ---- the COURAGE PULSE left at the departure point: a steady heart-beat
   bloom — clean expanding rings + a rising flame/chevron core (courage). ---- */
function drawPulse(pen,g,W,H,dx,dy,beat,inten){
  // expanding rings on the floor
  g.save(); g.lineCap="round";
  for(let k=0;k<3;k++){
    const ph = (beat + k*0.34)%1;
    const r = W*(0.04 + ph*0.20);
    g.strokeStyle = inkLevel(4 - Math.round(ph*2));
    g.lineWidth = lerp(4.5,1.5,ph);
    g.globalAlpha = (1-ph)*inten;
    g.beginPath(); g.ellipse(dx, dy, r, r*0.30, 0, 0, TAU); g.stroke();
  }
  g.globalAlpha = 1; g.restore();

  // the courage core: an upward flame/chevron that pulses in size
  const s = W*0.05*(0.85 + 0.3*Math.sin(beat*TAU));
  pen.paint(()=>{
    g.moveTo(dx, dy - s*2.1);                          // flame tip
    g.quadraticCurveTo(dx + s*0.9, dy - s*0.8, dx + s*0.55, dy);
    g.quadraticCurveTo(dx + s*0.25, dy + s*0.35, dx, dy + s*0.15);
    g.quadraticCurveTo(dx - s*0.25, dy + s*0.35, dx - s*0.55, dy);
    g.quadraticCurveTo(dx - s*0.9, dy - s*0.8, dx, dy - s*2.1);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // inner bright heart of the flame (contrast)
  pen.fillPath(()=>{
    g.moveTo(dx, dy - s*1.2);
    g.quadraticCurveTo(dx + s*0.4, dy - s*0.5, dx + s*0.22, dy - s*0.02);
    g.quadraticCurveTo(dx, dy + s*0.12, dx - s*0.22, dy - s*0.02);
    g.quadraticCurveTo(dx - s*0.4, dy - s*0.5, dx, dy - s*1.2);
    g.closePath();
  }, inkLevel(1));
  // two short up-chevron sparks flanking the flame (courage radiating)
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
  for(const side of [-1,1]){
    g.beginPath();
    g.moveTo(dx + side*s*1.5, dy - s*0.2);
    g.lineTo(dx + side*s*1.15, dy - s*1.0);
    g.stroke();
  }
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = clamp01(st.t ?? 0.5);
  const inten = st.intensity ?? params.intensity;
  const span = st.wingSpan ?? params.wingSpan;
  const layers = st.layers || ["floor","field","human","motes","pulse","eagle"];
  const has = l => layers.includes(l);

  const dx = W*params.departure.x, dy = H*params.departure.y;
  const ax = W*params.apex.x,      ay = H*params.apex.y;

  // ascent kinematics: the bird lifts fast then settles high
  const te = smooth(t);
  const bx = lerp(dx, ax, te);
  const by = lerp(dy - H*0.10, ay, te);
  const scale = lerp(0.82, 1.12, te);                 // grows as it rises into view
  const form  = clamp01(t*1.8);                        // wings spread quickly
  const humanFade = clamp01(1 - t*1.05);               // dissolves as t rises
  const beat = (st.t ?? 0.5)*0.9 % 1;                  // courage heartbeat phase

  // the human's crown — where the dissolving motes peel off toward the bird
  const crownY = drawHuman(pen,g,W,H,dx,dy,0) || dy - H*0.28;

  if (has("floor"))  drawFloor(pen,g,W,H);
  if (has("field"))  drawField(pen,g,W,H,dx,dy,ax,ay,t,inten);
  if (has("human"))  drawHuman(pen,g,W,H,dx,dy,humanFade);
  if (has("pulse"))  drawPulse(pen,g,W,H,dx,dy,beat,inten);   // pulse blooms at the floor
  if (has("motes"))  drawMotes(pen,g,W,H,dx,crownY,bx,by,t,inten);
  if (has("eagle"))  drawEagle(pen,g,W,H,bx,by,scale*span,form);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.athenas-birdlike-departure",
  type:"DIVINE_FX",
  name:"Athena's birdlike departure",
  statusWord:"ASCENDING",
  scene:"OD-B01-S06",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["floor","field","human","motes","pulse","eagle"],
  // normalized 0..1 source/target/field/consequence/camera anchors
  anchors:{
    "source:human":{      x:0.50, y:0.84 },   // where the disguise stood (source)
    "target:apex":{       x:0.50, y:0.16 },   // where the bird ascends to (target)
    "bird:mid":{          x:0.50, y:0.50 },   // representative mid-ascent position
    "consequence:pulse":{ x:0.50, y:0.84 },   // the courage pulse left behind
    "field:left":{        x:0.42, y:0.50 },
    "field:right":{       x:0.58, y:0.50 },
    "camera:wide":{       x:0.50, y:0.50 },
  },
  // the vertical corridor the transformation travels through
  zones:{ corridor:{ x0:0.34, y0:0.14, x1:0.66, y1:0.86 },
          pulse:{    x0:0.40, y0:0.78, x1:0.60, y1:0.90 } },
  // DIVINE_FX transformation states: human -> bird -> pulse, with duration
  states:{
    initial:"resolving",
    nodes:{
      // human: the disguise still stands, wings just beginning (source present)
      human:{     preview:{ t:0.08, intensity:0.9, status:"HUMAN",     progress:0.08 } },
      // resolving: mid-transform — bird formed and rising, human in motes (neutral)
      resolving:{ preview:{ t:0.50, intensity:1.0, status:"RESOLVING", progress:0.50 } },
      // ascended: the sea-eagle high and swift, only the courage pulse remains
      ascended:{  preview:{ t:0.94, intensity:1.1, status:"ASCENDED",  progress:0.94 } },
    },
    edges:[["human","resolving"],["resolving","ascended"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","wingSpan","pulse"],

  // neutral preview: mid-resolve — a clearly-formed sea-eagle ascending with
  // wings spread, the human dissolving into rising motes, the courage pulse
  // blooming at the floor (reads unmistakably as the birdlike departure).
  preview:()=>({ t:0.52, intensity:1.0, wingSpan:1.0, status:"RESOLVING", progress:0.52,
                 layers:["floor","field","human","motes","pulse","eagle"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
