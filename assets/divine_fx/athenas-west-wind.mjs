/* divine_fx.athenas-west-wind — the goddess-sent following wind that drives the
   night voyage. DIVINE_FX asset. Scene function (OD-B02-S07): a directional
   wind field is BORN at the west edge (source), streams eastward across the
   night air (field/direction), CATCHES the ship's sail cloth so it bellies taut
   to leeward, and AGITATES the sea surface below into driven chop — the visible
   consequence being sustained forward night-motion.

   Procedural: SOURCE (west edge gust bloom) -> FIELD (streaming gust lines) ->
   TARGET (the belled sail) -> the sea agitated beneath. Animates over state.t:
   the streamlines march east, the sail billow pulses taut, the pennant streams,
   the sea chop drifts. The `intensity` channel scales gust length/darkness, sail
   belly, and sea agitation (calm potential -> steady following wind -> gale).

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:   0.64,   // sea/sky (waterline) as frac of H — the ship rides here
  dir:       1,      // wind drive direction (+1 = eastward = to the right)
  source:   "west",  // the wind's origin edge
  gusts:     6,      // streaming gust lines across the night air
  mastX:     0.40,   // ship's mast x as frac of W
  yardHW:    0.17,   // half-width of the sail yard as frac of W
  seaHatch:  9,      // agitated chop rows below the waterline
  belly:     1.0,    // master sail-fill (channel-driven)
  intensity: 1.0,    // overall field strength
};

/* ---- NIGHT SKY: the airspace the wind streams through (light field so the
   dark streamlines read), a moon disc + a scatter of star ticks. ---- */
function drawSky(pen,g,W,H){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(2); g.fillRect(0,0,W,hy);            // night airspace (mid-light)
  // moon, top-right — bright disc with hard contour + a crescent shadow
  const mx = W*0.80, my = H*0.13, mr = W*0.075;
  pen.paint(()=>{ g.arc(mx,my,mr,0,TAU); }, toneSolid(inkLevel(1)), 4);
  pen.paint(()=>{ g.arc(mx+mr*0.42,my-mr*0.12,mr*0.92,0,TAU); }, toneSolid(inkLevel(2)), 0);
  pen.ink(()=>{ g.arc(mx,my,mr,0,TAU); }, 4);
  // star ticks — small dark crosses (night markers)
  g.strokeStyle = INK; g.lineWidth = 2; g.lineCap="round";
  const stars = [[0.12,0.09],[0.24,0.16],[0.55,0.08],[0.63,0.20],[0.90,0.30],[0.34,0.06]];
  for(const [sx,sy] of stars){
    const x=W*sx, y=H*sy, s=W*0.010;
    g.beginPath(); g.moveTo(x-s,y); g.lineTo(x+s,y); g.moveTo(x,y-s); g.lineTo(x,y+s); g.stroke();
  }
}

/* ---- FIELD: streaming gust lines sweeping in from the WEST edge and marching
   eastward, each a gently curved streamline with a chevron arrowhead at its
   leading tip. Center streaks are longest + darkest; they thin at the margins.
   Animates: the streamlines drift east over t. ---- */
function drawGusts(pen,g,W,H,t,inten){
  const hy = H*params.horizon, dir = params.dir, n = params.gusts;
  const strength = clamp(inten,0,1.6);
  g.lineCap="round"; g.lineJoin="round";
  for(let i=0;i<n;i++){
    const fy = (i+0.5)/n;
    const y  = lerp(hy*0.10, hy*0.94, fy) + Math.sin(t*1.2 + i*1.3)*5;
    const edge = 1 - Math.abs(fy-0.5)*0.7;                       // mid-band strongest
    const len  = lerp(W*0.22, W*0.60, clamp(strength,0,1.3)) * (0.72 + 0.28*edge);
    const march = ((t*46*(0.35+strength) + i*63) % (W*0.55));
    const x0 = dir>0 ? (W*0.04 + march) : (W*0.96 - march);
    const x1 = x0 + dir*len;
    const wob = lerp(4, 13, clamp(strength,0,1)) * edge;
    g.strokeStyle = inkLevel(2 + Math.round(edge*3 + strength));  // ~3..6
    g.lineWidth   = lerp(2.5, 6.5, clamp(strength/1.3,0,1)) * (0.6+0.4*edge);
    // curved streamline
    g.beginPath();
    g.moveTo(x0, y);
    g.quadraticCurveTo((x0+x1)/2, y - wob, x1, y);
    g.stroke();
    // chevron arrowhead at the leading tip
    const ah = lerp(8, 22, clamp(strength/1.2,0,1)) * (0.7+0.3*edge);
    g.beginPath();
    g.moveTo(x1 - dir*ah, y - ah*0.62);
    g.lineTo(x1, y);
    g.lineTo(x1 - dir*ah, y + ah*0.62);
    g.stroke();
  }
}

/* ---- SOURCE: the west-edge gust bloom where the goddess-sent wind is born —
   a clustered fan of short curved strokes fanning eastward off the edge. ---- */
function drawSource(pen,g,W,H,t,inten){
  const hy = H*params.horizon, dir = params.dir;
  const strength = clamp(inten,0,1.6);
  const sx = dir>0 ? W*0.02 : W*0.98;
  g.strokeStyle = inkLevel(2 + Math.round(strength*2));
  g.lineWidth = 3; g.lineCap="round";
  for(let k=0;k<4;k++){
    const yk = hy*0.5 + (k-1.5)*hy*0.17;
    const l  = W*0.10*(0.6+strength) * (0.8+0.2*Math.sin(t*1.6+k));
    g.beginPath();
    g.moveTo(sx, yk);
    g.quadraticCurveTo(sx+dir*l*0.5, yk-7, sx+dir*l, yk);
    g.stroke();
  }
}

/* ---- SEA: base water + agitated chop rows driven eastward. Each row is a run
   of short leaning wave-chevrons (whitecaps) that drift with t and steepen with
   intensity — the sea "driven" by the wind, denser toward the foreground. ---- */
function drawSea(pen,g,W,H,t,inten){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);          // water body (mid)
  g.fillStyle = inkLevel(4); g.fillRect(0,hy,W,H*0.03);        // darker seam at horizon
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);
  const dir = params.dir, strength = clamp(inten,0,1.6);
  const n = params.seaHatch;
  g.lineCap="round"; g.lineJoin="round";
  for(let r=0;r<n;r++){
    const f = r/(n-1);                                          // 0 far .. 1 near
    const y = lerp(hy+H*0.03, H*0.985, f);
    const rowLvl = Math.round(lerp(4,6,f));
    const amp = lerp(4, 15, f) * (0.7+0.5*strength);
    const step = lerp(46, 30, f);
    const drift = t*30*dir*(0.4+strength) + r*11;
    g.strokeStyle = inkLevel(rowLvl);
    g.lineWidth = lerp(2, 4.5, f);
    for(let x=-step; x<W+step; x+=step){
      const cx = x + (drift % step);
      // a small leaning chevron whitecap, tip leaning east (leeward)
      g.beginPath();
      g.moveTo(cx, y);
      g.lineTo(cx + step*0.30 + dir*amp*0.35, y - amp);
      g.lineTo(cx + step*0.60, y);
      g.stroke();
    }
  }
}

/* ---- the SHIP: hull crescent at the waterline + mast, drawn dark. The sail is
   drawn separately (drawSail) so it can billow over the mast. ---- */
function drawHull(pen,g,W,H){
  const hy = H*params.horizon, mx = W*params.mastX;
  const bx0 = mx - W*0.17, bx1 = mx + W*0.20, keel = hy + H*0.058;
  // hull: a shallow dark crescent riding the waterline
  pen.paint(()=>{
    g.moveTo(bx0, hy-2);
    g.quadraticCurveTo(mx, keel, bx1, hy-2);
    g.quadraticCurveTo(mx+W*0.02, hy+H*0.012, bx0, hy-2);
    g.closePath();
  }, toneSolid(inkLevel(7)), 5);
  // upturned prow stem (east)
  pen.paint(()=>{
    g.moveTo(bx1-4, hy-2);
    g.lineTo(bx1+W*0.03, hy-H*0.055);
    g.lineTo(bx1-W*0.02, hy-2);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // mast: a dark vertical spar from the deck up (drawn behind the sail)
  const mastTopY = H*0.20;
  pen.limb(()=>{ g.moveTo(mx, hy-2); g.lineTo(mx, mastTopY); }, toneSolid(inkLevel(7)), W*0.012);
  return { mx, mastTopY };
}

/* ---- the SAIL catching the west wind: a square sail on a yard, bellied taut to
   leeward (east). Convex leech, bowed foot, curved billow seams, and short
   east-pointing sail-fill arrows showing the wind pressing the cloth. `belly`
   grows with intensity; a small t-pulse makes it breathe. ---- */
function drawSail(pen,g,W,H,mx,t,inten,bellyMul){
  const dir = params.dir;
  const yardHW = W*params.yardHW;
  const yardY  = H*0.24;
  const sailTopY = yardY + H*0.006;
  const sailBotY = H*0.52;
  const midY = (sailTopY+sailBotY)/2;
  const belly = (W*0.055*bellyMul) * (0.55 + 0.55*clamp(inten,0,1.4)) * (0.92+0.08*Math.sin(t*1.5));
  const luffX = mx - yardHW*0.86;                              // windward edge near mast
  const leechTop = mx + yardHW*0.94;
  const tone = toneSolid(inkLevel(3));                         // light cloth so seams/arrows read

  // ---- the yard (spar) across the top, dark ----
  pen.limb(()=>{ g.moveTo(mx-yardHW, yardY); g.lineTo(mx+yardHW, yardY); }, toneSolid(inkLevel(7)), W*0.012);

  // ---- the belled cloth: straight luff at the mast, convex leech bowed east ----
  pen.paint(()=>{
    g.moveTo(luffX, sailTopY);
    g.lineTo(leechTop, sailTopY);                                              // head (along yard)
    g.quadraticCurveTo(leechTop + dir*belly, midY, mx + yardHW*0.66, sailBotY);// leech bows east
    g.quadraticCurveTo(mx, sailBotY + belly*0.60, luffX, sailBotY);            // foot bows down
    g.lineTo(luffX, sailTopY);                                                 // luff straight down mast
    g.closePath();
  }, tone, 5);

  // ---- billow seams: horizontal curved lines bowing east with the cloth ----
  g.strokeStyle = INK; g.lineWidth = 2.5; g.lineCap="round";
  for(let s=1;s<=3;s++){
    const f = s/4;
    const y = lerp(sailTopY, sailBotY, f);
    const rx = lerp(leechTop, mx + yardHW*0.66, f);
    const bow = belly*(0.7+0.5*Math.sin(f*Math.PI));
    g.beginPath();
    g.moveTo(luffX, y);
    g.quadraticCurveTo((luffX+rx)/2 + dir*bow, y, rx, y);
    g.stroke();
  }

  // ---- sail-fill arrows: short east-pointing arrows pressing into the cloth ----
  g.strokeStyle = INK; g.lineWidth = 3;
  for(let a=0;a<3;a++){
    const y = lerp(sailTopY+ (sailBotY-sailTopY)*0.22, sailBotY - (sailBotY-sailTopY)*0.20, a/2);
    const ax0 = luffX + dir*yardHW*0.20;
    const ax1 = ax0 + dir*(yardHW*0.9 + belly*0.4);
    g.beginPath(); g.moveTo(ax0, y); g.lineTo(ax1, y); g.stroke();
    const ah = W*0.018;
    g.beginPath();
    g.moveTo(ax1 - dir*ah, y - ah*0.7); g.lineTo(ax1, y); g.lineTo(ax1 - dir*ah, y + ah*0.7);
    g.stroke();
  }

  // ---- pennant streaming from the mast top, pointing the wind's heading ----
  const ptx = mx, pty = H*0.20;
  const flag = W*0.11*(0.6+0.6*clamp(inten,0,1.3));
  pen.paint(()=>{
    g.moveTo(ptx, pty);
    g.quadraticCurveTo(ptx + dir*flag*0.6, pty - H*0.012 + Math.sin(t*3)*6,
                       ptx + dir*flag, pty + H*0.006 + Math.sin(t*3+1)*5);
    g.lineTo(ptx + dir*flag*0.66, pty + H*0.014);
    g.quadraticCurveTo(ptx + dir*flag*0.32, pty + H*0.006, ptx, pty + H*0.012);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const bellyMul = st.belly ?? params.belly;
  const layers = st.layers || ["sky","gusts","source","sea","hull","sail"];
  const has = l => layers.includes(l);

  if (has("sky"))    drawSky(pen,g,W,H);
  if (has("gusts"))  drawGusts(pen,g,W,H,t,inten);
  if (has("source")) drawSource(pen,g,W,H,t,inten);
  if (has("sea"))    drawSea(pen,g,W,H,t,inten);
  let mx = W*params.mastX;
  if (has("hull"))   { const r = drawHull(pen,g,W,H); mx = r.mx; }
  if (has("sail"))   drawSail(pen,g,W,H,mx,t,inten,bellyMul);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.athenas-west-wind",
  type:"DIVINE_FX",
  name:"Athena's west wind",
  statusWord:"DRIVING",
  scene:"OD-B02-S07",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sky","gusts","source","sea","hull","sail"],
  // normalized 0..1 source/target/field/direction/consequence anchors
  anchors:{
    "source:west-wind":{ x:0.03, y:0.32 },   // where the goddess-sent wind is born
    "direction:east":{   x:0.97, y:0.32 },   // the heading the wind drives toward
    "field:air":{        x:0.50, y:0.28 },   // the streaming airspace
    "target:sail":{      x:0.46, y:0.34 },   // the belled sail the wind catches
    "ship:mast-top":{    x:0.40, y:0.20 },
    "sea:driven":{       x:0.50, y:0.82 },   // the agitated sea surface
    "camera:wide":{      x:0.50, y:0.50 },
  },
  // affected regions (airspace the wind fills, sea it drives)
  zones:{
    air:{   x0:0.00, y0:0.02, x1:1.0, y1:0.62 },
    sea:{   x0:0.00, y0:0.64, x1:1.0, y1:1.0 },
    sail:{  x0:0.22, y0:0.24, x1:0.62, y1:0.52 },
  },
  // DIVINE_FX field states: calm potential -> rising -> full driving night wind
  states:{
    initial:"driving",
    nodes:{
      // still: faint hanging gusts, slack sail (source present, no drive yet)
      still:{   preview:{ t:0.4, intensity:0.30, belly:0.4, status:"STILL",   progress:0.12 } },
      // rising: the field gathers — gusts lengthen, sail begins to fill
      rising:{  preview:{ t:1.4, intensity:0.80, belly:0.8, status:"RISING",  progress:0.48 } },
      // driving: full following west wind, sail taut, sea driven (neutral)
      driving:{ preview:{ t:2.6, intensity:1.35, belly:1.1, status:"DRIVING", progress:0.86 } },
    },
    edges:[["still","rising"],["rising","driving"],["driving","rising"],["rising","still"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","belly","direction"],

  // neutral preview: full driving wind — streamlines marching east, sail belled
  // taut, pennant streaming, sea driven into chop (reads unmistakably as the
  // goddess-sent west wind driving the night voyage).
  preview:()=>({ t:2.4, intensity:1.3, belly:1.05, status:"DRIVING", progress:0.80,
                 layers:["sky","gusts","source","sea","hull","sail"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
