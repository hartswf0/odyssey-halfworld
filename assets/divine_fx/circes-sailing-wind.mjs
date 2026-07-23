/* divine_fx.circes-sailing-wind — the steady following wind Circe sends to drive
   the black ship out to the world's rim. DIVINE_FX asset. Scene function
   (OD-B10-S08): a SOURCE (Circe on her headland, arm raised, conjuring a bloom
   of gust) breathes a STEADY, ALIGNED directional wind FIELD that streams flat
   and parallel across the daylight air, CATCHES the black ship's square sail so
   it bellies taut to leeward, and drives the hull TOWARD a dark 'edge of the
   world' — a blackening horizon/abyss at the far rim the vessel is pushed into.

   Unlike a gusting storm wind, this field is DELIBERATE and regimented: the
   streamlines are near-straight, evenly spaced and same-length (a god's steady
   hand), all pointed at the rim. Procedural: SOURCE (headland bloom) -> FIELD
   (aligned streamlines) -> TARGET (belled sail on a black hull) -> the sea
   below + the dark edge of the world ahead. Animates over state.t: the aligned
   lines march toward the rim, the sail breathes taut, the pennant streams, the
   sea drifts. The `intensity` channel scales streamline reach/darkness, sail
   belly and the depth of the rim's dark.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:   0.60,   // sea/sky waterline as frac of H — the ship rides here
  dir:       1,      // wind drive direction (+1 = toward the right = the rim)
  source:   "circe", // the wind's origin — Circe on her headland (left)
  lines:     7,      // aligned streaming gust lines across the daylight air
  mastX:     0.42,   // black ship's mast x as frac of W
  yardHW:    0.16,   // half-width of the sail yard as frac of W
  seaHatch:  8,      // chop rows below the waterline
  rimX:      0.82,   // where the 'edge of the world' dark begins (frac of W)
  belly:     1.0,    // master sail-fill (channel-driven)
  intensity: 1.0,    // overall field strength
};

/* ---- DAYLIGHT SKY: the pale airspace the aligned wind streams through (kept
   light so the dark streamlines + the rim read strongly). A low sun disc sits
   BEHIND the rim, sinking into the edge of the world. ---- */
function drawSky(pen,g,W,H){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hy);              // pale day airspace
  // a faint high cloud-shelf, streaked with the wind (light, breaks the field)
  g.fillStyle = inkLevel(2);
  for(let i=0;i<4;i++){
    g.beginPath();
    g.ellipse(W*(0.10+i*0.19), hy*(0.20+0.05*(i%2)), W*0.10, H*0.022, 0,0,TAU); g.fill();
  }
}

/* ---- EDGE OF THE WORLD: the far rim the ship is driven toward. The airspace
   and sea DARKEN into a wall of ink at the right margin — an abyss where the
   waters pour off. Built from stacked vertical bands of rising ink (1->7) plus
   a hard rim contour and a few 'falling water' ticks going over the edge. ---- */
function drawRim(pen,g,W,H,t,inten){
  const rimX = W*params.rimX;
  const strength = clamp(inten,0,1.6);
  const bands = 8;
  for(let b=0;b<bands;b++){
    const f  = b/(bands-1);                                     // 0 near rim-start .. 1 at edge
    const x  = lerp(rimX, W, f);
    const bw = (W-rimX)/bands + 2;
    const lvl = clamp(Math.round(lerp(1.5, 6.5, smooth(f)) + strength*0.6), 1, 7);
    g.fillStyle = inkLevel(lvl);
    g.fillRect(x, 0, bw, H);
  }
  // the very edge — a solid black lip, full height
  g.fillStyle = inkLevel(7); g.fillRect(W*0.975, 0, W*0.025, H);
  // hard rim contour where the dark begins
  pen.ink(()=>{ g.moveTo(rimX, 0); g.lineTo(rimX, H); }, 3);
  // 'falling water' streaks pouring over the edge into the abyss
  g.strokeStyle = inkLevel(4); g.lineWidth = 2.4; g.lineCap="round";
  const hy = H*params.horizon;
  for(let k=0;k<5;k++){
    const x = lerp(W*0.88, W*0.965, k/4);
    const yTop = hy + H*0.01 + ((t*24 + k*18) % (H*0.10));
    g.beginPath();
    g.moveTo(x, yTop);
    g.lineTo(x + W*0.006, yTop + H*0.10);
    g.stroke();
  }
}

/* ---- FIELD: the steady, ALIGNED streaming wind. Near-straight, evenly-spaced,
   same-length streamlines all pointed at the rim (a god's deliberate hand — no
   wobble), each with a chevron arrowhead at its leading tip. They march toward
   the edge over t and fade as they cross the rim. ---- */
function drawField(pen,g,W,H,t,inten){
  const hy = H*params.horizon, dir = params.dir, n = params.lines;
  const rimX = W*params.rimX;
  const strength = clamp(inten,0,1.6);
  g.lineCap="round"; g.lineJoin="round";
  for(let i=0;i<n;i++){
    const fy = (i+0.5)/n;
    const y  = lerp(hy*0.14, hy*0.92, fy);                      // steady — no vertical wobble
    const edge = 1 - Math.abs(fy-0.5)*0.5;                      // mid-band a touch stronger
    const len  = lerp(W*0.20, W*0.30, clamp(strength,0,1.3));   // UNIFORM reach (aligned)
    const period = W*0.42;
    const march = ((t*40*(0.4+strength) + i*(period/n)) % period);
    const x0 = W*0.06 + march;
    let x1 = x0 + dir*len;
    // streamlines pouring past the rim get clipped to the edge (swallowed)
    x1 = Math.min(x1, W*0.985);
    if (x0 >= rimX) continue;                                   // born only before the rim
    const lvl = 2 + Math.round(edge*2 + strength);              // ~3..5
    g.strokeStyle = inkLevel(clamp(lvl,1,7));
    g.lineWidth   = lerp(3, 6, clamp(strength/1.3,0,1)) * (0.7+0.3*edge);
    // near-straight streamline (tiny bow only, keeps the 'steady' read)
    g.beginPath();
    g.moveTo(x0, y);
    g.quadraticCurveTo((x0+x1)/2, y - 3, x1, y);
    g.stroke();
    // chevron arrowhead at the leading tip
    const ah = lerp(10, 20, clamp(strength/1.2,0,1)) * (0.75+0.25*edge);
    g.beginPath();
    g.moveTo(x1 - dir*ah, y - ah*0.60);
    g.lineTo(x1, y);
    g.lineTo(x1 - dir*ah, y + ah*0.60);
    g.stroke();
  }
}

/* ---- SOURCE: Circe on her headland at the far left — a dark promontory rock,
   a small robed figure standing atop it with one arm RAISED, and a bloom of
   short curved strokes fanning off her raised hand: the wind she conjures and
   sends after the ship. ---- */
function drawSource(pen,g,W,H,t,inten){
  const hy = H*params.horizon, dir = params.dir;
  const strength = clamp(inten,0,1.6);
  // headland rock rising from the waterline at the left
  const rx = W*0.075, ry0 = hy+H*0.02, rTop = hy - H*0.14;
  pen.paint(()=>{
    g.moveTo(0, ry0);
    g.lineTo(0, rTop);
    g.quadraticCurveTo(rx*0.6, rTop-H*0.02, rx, rTop+H*0.02);
    g.lineTo(rx*1.2, ry0);
    g.closePath();
  }, toneSolid(inkLevel(6)), 5);
  // Circe — a small robed standing figure atop the headland
  const fx = rx*0.72, fBase = rTop+H*0.02, fH = H*0.10;
  const headY = fBase - fH;
  pen.paint(()=>{ g.moveTo(fx-W*0.016,fBase); g.lineTo(fx-W*0.010,fBase-fH*0.7);
    g.lineTo(fx+W*0.010,fBase-fH*0.7); g.lineTo(fx+W*0.016,fBase); g.closePath(); }, toneSolid(inkLevel(7)), 3); // robe
  pen.paint(()=>{ g.arc(fx, headY, W*0.014, 0, TAU); }, toneSolid(inkLevel(7)), 3);                              // head
  // raised arm toward the sea
  const handX = fx + dir*W*0.05, handY = headY - H*0.02;
  pen.ink(()=>{ g.moveTo(fx, fBase-fH*0.62); g.lineTo(handX, handY); }, 4);
  // conjured bloom off the raised hand — short curved gust strokes fanning east
  g.strokeStyle = inkLevel(2 + Math.round(strength*2)); g.lineWidth = 3; g.lineCap="round";
  for(let k=0;k<4;k++){
    const yk = handY + (k-1.5)*H*0.03;
    const l  = W*0.11*(0.6+strength) * (0.82+0.18*Math.sin(t*1.8+k));
    g.beginPath();
    g.moveTo(handX, yk);
    g.quadraticCurveTo(handX+dir*l*0.5, yk-6, handX+dir*l, yk);
    g.stroke();
  }
}

/* ---- SEA: base water + chop rows driven toward the rim, steepening toward the
   foreground; the water darkens as it nears the edge of the world. ---- */
function drawSea(pen,g,W,H,t,inten){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);          // water body (mid)
  g.fillStyle = inkLevel(4); g.fillRect(0,hy,W,H*0.028);       // darker seam at horizon
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);
  const dir = params.dir, strength = clamp(inten,0,1.6);
  const n = params.seaHatch, rimX = W*params.rimX;
  g.lineCap="round"; g.lineJoin="round";
  for(let r=0;r<n;r++){
    const f = r/(n-1);                                          // 0 far .. 1 near
    const y = lerp(hy+H*0.028, H*0.985, f);
    const rowLvl = Math.round(lerp(4,6,f));
    const amp = lerp(4, 14, f) * (0.7+0.5*strength);
    const step = lerp(48, 32, f);
    const drift = t*30*dir*(0.4+strength) + r*11;
    g.strokeStyle = inkLevel(rowLvl);
    g.lineWidth = lerp(2, 4.5, f);
    for(let x=-step; x<rimX+step; x+=step){
      const cx = x + (drift % step);
      if (cx > rimX) continue;                                  // sea stops at the rim
      // a small leaning chevron whitecap, tip leaning toward the rim
      g.beginPath();
      g.moveTo(cx, y);
      g.lineTo(cx + step*0.30 + dir*amp*0.35, y - amp);
      g.lineTo(cx + step*0.60, y);
      g.stroke();
    }
  }
}

/* ---- the BLACK SHIP: hull crescent + mast, drawn in full ink (the black ship
   of the tale). The sail is drawn separately so it billows over the mast. ---- */
function drawHull(pen,g,W,H){
  const hy = H*params.horizon, mx = W*params.mastX;
  const bx0 = mx - W*0.16, bx1 = mx + W*0.19, keel = hy + H*0.058;
  // hull: a shallow black crescent riding the waterline
  pen.paint(()=>{
    g.moveTo(bx0, hy-2);
    g.quadraticCurveTo(mx, keel, bx1, hy-2);
    g.quadraticCurveTo(mx+W*0.02, hy+H*0.012, bx0, hy-2);
    g.closePath();
  }, toneSolid(inkLevel(7)), 5);
  // upturned prow stem, pointed at the rim
  pen.paint(()=>{
    g.moveTo(bx1-4, hy-2);
    g.lineTo(bx1+W*0.03, hy-H*0.055);
    g.lineTo(bx1-W*0.02, hy-2);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // stern post (left)
  pen.paint(()=>{
    g.moveTo(bx0+4, hy-2);
    g.lineTo(bx0-W*0.02, hy-H*0.040);
    g.lineTo(bx0+W*0.02, hy-2);
    g.closePath();
  }, toneSolid(inkLevel(7)), 4);
  // mast: a black vertical spar (drawn behind the sail)
  const mastTopY = H*0.19;
  pen.limb(()=>{ g.moveTo(mx, hy-2); g.lineTo(mx, mastTopY); }, toneSolid(inkLevel(7)), W*0.013);
  return { mx, mastTopY };
}

/* ---- the SAIL catching Circe's steady wind: a square sail on a yard, bellied
   taut to leeward (toward the rim). Convex leech, bowed foot, billow seams and
   short rim-pointing fill arrows show the steady pressure. `belly` grows with
   intensity; a small t-pulse makes it breathe. ---- */
function drawSail(pen,g,W,H,mx,t,inten,bellyMul){
  const dir = params.dir;
  const yardHW = W*params.yardHW;
  const yardY  = H*0.23;
  const sailTopY = yardY + H*0.006;
  const sailBotY = H*0.50;
  const midY = (sailTopY+sailBotY)/2;
  const belly = (W*0.055*bellyMul) * (0.55 + 0.55*clamp(inten,0,1.4)) * (0.94+0.06*Math.sin(t*1.4));
  const luffX = mx - yardHW*0.86;
  const leechTop = mx + yardHW*0.94;
  const tone = toneSolid(inkLevel(3));                         // light cloth so seams/arrows read

  // ---- the yard (spar) across the top, black ----
  pen.limb(()=>{ g.moveTo(mx-yardHW, yardY); g.lineTo(mx+yardHW, yardY); }, toneSolid(inkLevel(7)), W*0.012);

  // ---- the belled cloth: straight luff at the mast, convex leech bowed rimward ----
  pen.paint(()=>{
    g.moveTo(luffX, sailTopY);
    g.lineTo(leechTop, sailTopY);
    g.quadraticCurveTo(leechTop + dir*belly, midY, mx + yardHW*0.66, sailBotY);
    g.quadraticCurveTo(mx, sailBotY + belly*0.60, luffX, sailBotY);
    g.lineTo(luffX, sailTopY);
    g.closePath();
  }, tone, 5);

  // ---- billow seams: horizontal curved lines bowing rimward with the cloth ----
  g.strokeStyle = INK; g.lineWidth = 2.5; g.lineCap="round";
  for(let s=1;s<=3;s++){
    const f = s/4;
    const y = lerp(sailTopY, sailBotY, f);
    const rxs = lerp(leechTop, mx + yardHW*0.66, f);
    const bow = belly*(0.7+0.5*Math.sin(f*Math.PI));
    g.beginPath();
    g.moveTo(luffX, y);
    g.quadraticCurveTo((luffX+rxs)/2 + dir*bow, y, rxs, y);
    g.stroke();
  }

  // ---- sail-fill arrows: short rim-pointing arrows pressing into the cloth ----
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

  // ---- pennant streaming from the mast top, pointing the wind's heading (rim) ----
  const ptx = mx, pty = H*0.19;
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
  const layers = st.layers || ["sky","rim","field","source","sea","hull","sail"];
  const has = l => layers.includes(l);

  if (has("sky"))    drawSky(pen,g,W,H);
  if (has("rim"))    drawRim(pen,g,W,H,t,inten);
  if (has("field"))  drawField(pen,g,W,H,t,inten);
  if (has("source")) drawSource(pen,g,W,H,t,inten);
  if (has("sea"))    drawSea(pen,g,W,H,t,inten);
  let mx = W*params.mastX;
  if (has("hull"))   { const r = drawHull(pen,g,W,H); mx = r.mx; }
  if (has("sail"))   drawSail(pen,g,W,H,mx,t,inten,bellyMul);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.circes-sailing-wind",
  type:"DIVINE_FX",
  name:"Circe's sailing wind",
  statusWord:"DRIVING",
  scene:"OD-B10-S08",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["sky","rim","field","source","sea","hull","sail"],
  // normalized 0..1 source/target/field/direction/consequence anchors
  anchors:{
    "source:circe":{    x:0.06, y:0.44 },   // Circe on her headland, conjuring the wind
    "field:air":{       x:0.45, y:0.26 },   // the aligned streaming airspace
    "target:sail":{     x:0.46, y:0.32 },   // the belled sail the wind catches
    "ship:mast-top":{   x:0.42, y:0.19 },
    "ship:hull":{       x:0.42, y:0.62 },
    "direction:rim":{   x:0.97, y:0.40 },   // the heading — the world's edge
    "edge:world":{      x:0.90, y:0.50 },   // the dark rim/abyss ahead
    "sea:driven":{      x:0.45, y:0.82 },
    "camera:wide":{     x:0.50, y:0.50 },
  },
  // affected regions (airspace the wind fills, sea it drives, the rim dark)
  zones:{
    air:{  x0:0.00, y0:0.02, x1:0.82, y1:0.58 },
    sea:{  x0:0.00, y0:0.60, x1:0.82, y1:1.0  },
    sail:{ x0:0.24, y0:0.23, x1:0.62, y1:0.50 },
    rim:{  x0:0.82, y0:0.00, x1:1.00, y1:1.0  },
  },
  // DIVINE_FX field states: latent -> rising -> full steady drive to the rim
  states:{
    initial:"driving",
    nodes:{
      // latent: Circe just raising her hand, faint bloom, slack sail, shallow rim
      latent:{  preview:{ t:0.3, intensity:0.28, belly:0.4, status:"LATENT",  progress:0.12 } },
      // rising: the aligned field gathers, sail begins to fill, rim darkens
      rising:{  preview:{ t:1.3, intensity:0.78, belly:0.8, status:"RISING",  progress:0.46 } },
      // driving: full steady wind, sail taut, ship driven at the world's edge
      driving:{ preview:{ t:2.6, intensity:1.35, belly:1.1, status:"DRIVING", progress:0.86 } },
    },
    edges:[["latent","rising"],["rising","driving"],["driving","rising"],["rising","latent"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","belly","direction"],

  // neutral preview: full steady wind — aligned streamlines marching toward the
  // rim, black ship's sail belled taut, pennant streaming, the dark edge of the
  // world looming ahead (reads unmistakably as Circe's sailing wind).
  preview:()=>({ t:2.4, intensity:1.3, belly:1.05, status:"DRIVING", progress:0.80,
                 layers:["sky","rim","field","source","sea","hull","sail"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
