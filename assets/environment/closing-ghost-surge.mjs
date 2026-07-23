/* environment.closing-ghost-surge — the crowding dead of the Nekyia.
   ENVIRONMENT asset (procedural world force). Scene function (OD-B11-S08):
   a SWELLING WAVE of pale ghosts presses INWARD, rank behind rank, closing on
   a single FLEEING POINT (the way back to the ship). The field is built as
   concentric arcs of hooded shades centered on that point: far ranks large and
   sparse, near ranks massing into a wall that rings the escape. APPROACH-
   PRESSURE arrows drive radially inward from the mass toward the point; a lone
   FLEE arrow breaks outward off the right edge (the living crew's flight).

   Procedural: SOURCE (the massed dead, off the left) -> DIRECTION (radially
   inward on the fleeing point) -> DENSITY / APPROACH-PRESSURE (ranks + arrow
   length/darkness rise with intensity) -> REGION (the ring of dead vs. the
   open escape gap). Animates over state.t: the ranks creep inward and the pale
   cloud breathes, the pressure arrows pulse, the flee arrow bobs.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  fpX:       0.82,   // fleeing point (escape node) x as frac of W
  fpY:       0.50,   // fleeing point y as frac of H
  ranksMax:  5,      // concentric ghost ranks at full density
  rNear:     0.21,   // closest rank radius (frac of W) — leaves the escape gap
  rFar:      0.82,   // farthest rank radius (frac of W)
  arcLo:     0.60,   // rank angular span start (× PI) — the left hemisphere
  arcHi:     1.40,   // rank angular span end   (× PI)
  squash:    0.88,   // vertical squash so the arcs fit the frame
  intensity: 1.0,    // master field strength (channel-driven: gathering->breaking)
};

/* ---- one hooded SHADE: a pale draped ghost with a domed hood, wavy hem, and
   two dark eye hollows. Pale body (few dots) + hard contour so it reads. ---- */
function shade(pen,g, x,y, s, lvl, contour){
  const tone = toneSolid(inkLevel(lvl));
  pen.paint(()=>{
    g.moveTo(x - s*0.60, y + s*0.85);
    g.lineTo(x - s*0.60, y - s*0.20);
    g.quadraticCurveTo(x - s*0.60, y - s*1.12, x, y - s*1.12);   // hood dome
    g.quadraticCurveTo(x + s*0.60, y - s*1.12, x + s*0.60, y - s*0.20);
    g.lineTo(x + s*0.60, y + s*0.85);
    g.quadraticCurveTo(x + s*0.28, y + s*0.55, x, y + s*0.92);   // wavy hem
    g.quadraticCurveTo(x - s*0.30, y + s*1.22, x - s*0.60, y + s*0.85);
    g.closePath();
  }, tone, contour);
  // hollow eyes (dark, read as sunken)
  g.fillStyle = inkLevel(6);
  g.beginPath(); g.ellipse(x - s*0.24, y - s*0.34, s*0.12, s*0.19, 0,0,TAU); g.fill();
  g.beginPath(); g.ellipse(x + s*0.24, y - s*0.34, s*0.12, s*0.19, 0,0,TAU); g.fill();
}

/* ---- the pale MASS wash: a soft light body behind the ranks so the crowd
   reads as a swelling cloud pressing from the left. Grows with density. ---- */
function drawMass(pen,g,W,H,t,inten){
  const fx=W*params.fpX, fy=H*params.fpY;
  const strength = clamp(inten,0,1.5);
  const grow = 0.9 + 0.22*strength + Math.sin(t*0.8)*0.03;
  g.fillStyle = inkLevel(1);
  g.beginPath(); g.ellipse(fx - W*0.30, fy, W*0.52*grow, H*0.44*grow, 0,0,TAU); g.fill();
  // a denser core toward the deep of the crowd
  g.fillStyle = inkLevel(2);
  g.beginPath(); g.ellipse(fx - W*0.46, fy, W*0.24*grow, H*0.30*grow, 0,0,TAU); g.fill();
}

/* ---- the RANKS: concentric arcs of shades centered on the fleeing point.
   Far ranks large + sparse; near ranks small + crowded into a wall. More ranks
   appear as density rises; the whole crowd creeps inward over t. ---- */
function drawRanks(pen,g,W,H,t,inten){
  const fx=W*params.fpX, fy=H*params.fpY;
  const strength = clamp(inten,0,1.5);
  const rMax = params.ranksMax;
  const ranksOn = Math.round(lerp(2.6, rMax, clamp(strength/1.3,0,1)));  // density
  const a0 = Math.PI*params.arcLo, a1 = Math.PI*params.arcHi;
  // draw FAR -> NEAR so nearer, larger shades overlap in front
  for(let ri=ranksOn-1; ri>=0; ri--){
    const f = ri/(rMax-1);                                   // 0 near .. ~1 far
    const creep = Math.sin(t*1.05 + ri*0.7)*W*0.014*strength; // ranks pulse inward
    const rad = lerp(W*params.rNear, W*params.rFar, f) - creep;
    const s   = lerp(H*0.070, H*0.036, f) * (0.92+0.14*strength);
    const lvl = 1 + (ri%2);                                  // pale, alternating 1/2
    const contour = lerp(4.6, 2.4, f);
    const count = Math.max(3, Math.round(lerp(3.4, 8, f)));  // more shades further out
    for(let k=0;k<count;k++){
      const a = lerp(a0, a1, count===1?0.5:k/(count-1));
      const gx = fx + Math.cos(a)*rad;
      const gy = fy + Math.sin(a)*rad*params.squash;
      if (gx > W*0.98 || gx < -s*1.4 || gy < -s*1.4 || gy > H+s*1.4) continue;
      shade(pen,g, gx, gy, s, lvl, contour);
    }
  }
}

/* ---- one APPROACH-PRESSURE arrow: a bold radial streamline driving inward from
   the mass toward the fleeing point, chevron head at the inner tip. ---- */
function pressureArrow(pen,g, ox,oy, ix,iy, lvl, lw, ah){
  const dx = ix-ox, dy = iy-oy, len = Math.hypot(dx,dy)||1;
  const ux = dx/len, uy = dy/len, nx = -uy, ny = ux;
  g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lw;
  g.beginPath(); g.moveTo(ox,oy); g.lineTo(ix,iy); g.stroke();
  g.beginPath();
  g.moveTo(ix - ux*ah - nx*ah*0.62, iy - uy*ah - ny*ah*0.62);
  g.lineTo(ix, iy);
  g.lineTo(ix - ux*ah + nx*ah*0.62, iy - uy*ah + ny*ah*0.62);
  g.stroke();
}

/* ---- PRESSURE: three bold arrows converging inward on the fleeing point along
   the upper-left / left / lower-left lines. Length + darkness scale with the
   field; tips pulse toward the point over t. ---- */
function drawPressure(pen,g,W,H,t,inten){
  const fx=W*params.fpX, fy=H*params.fpY;
  const strength = clamp(inten,0,1.5);
  const lvl = 5 + Math.round(clamp(strength/1.4,0,1)*2);   // 5..7
  const lw  = lerp(6, 11, clamp(strength/1.3,0,1));
  const ah  = lerp(15, 28, clamp(strength/1.2,0,1));
  const push = Math.sin(t*1.7)*W*0.02*strength;            // synchronized inward jab
  const angs = [Math.PI*0.80, Math.PI*1.00, Math.PI*1.20];
  for(const a of angs){
    const rOuter = W*0.60, rInner = W*0.245 - push;         // tip stops short of the gap
    const ox = fx+Math.cos(a)*rOuter, oy = fy+Math.sin(a)*rOuter*params.squash;
    const ix = fx+Math.cos(a)*rInner, iy = fy+Math.sin(a)*rInner*params.squash;
    pressureArrow(pen,g, ox,oy, ix,iy, lvl, lw, ah);
  }
}

/* ---- FLEEING POINT: the escape node ringing the gap in the wall of dead, with
   a lone FLEE arrow breaking outward off the right edge (the living crew's
   flight the surge triggers). Bobs over t. ---- */
function drawFleePoint(pen,g,W,H,t,inten){
  const fx=W*params.fpX, fy=H*params.fpY;
  // pale escape disc (the open way back)
  pen.paint(()=>{ g.arc(fx,fy, W*0.058, 0, TAU); }, toneSolid(inkLevel(1)), 4);
  // hard target ring + a short inner ring
  g.strokeStyle=INK; g.lineWidth=4; g.lineCap="round";
  g.beginPath(); g.arc(fx,fy, W*0.058, 0, TAU); g.stroke();
  g.lineWidth=2.5; g.beginPath(); g.arc(fx,fy, W*0.030, 0, TAU); g.stroke();
  // FLEE arrow — the crew breaking outward, off the right edge
  const bob = Math.sin(t*2.0)*W*0.012;
  const sx = fx+W*0.075+bob, ex = fx+W*0.155+bob, ah = W*0.032;
  g.strokeStyle=inkLevel(6); g.lineWidth=8;
  g.beginPath(); g.moveTo(sx,fy); g.lineTo(ex,fy); g.stroke();
  g.beginPath();
  g.moveTo(ex-ah, fy-ah*0.85); g.lineTo(ex, fy); g.lineTo(ex-ah, fy+ah*0.85);
  g.stroke();
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const layers = st.layers || ["mass","ranks","pressure","flee"];
  const has = l => layers.includes(l);

  if (has("mass"))     drawMass(pen,g,W,H,t,inten);
  if (has("ranks"))    drawRanks(pen,g,W,H,t,inten);
  if (has("pressure")) drawPressure(pen,g,W,H,t,inten);
  if (has("flee"))     drawFleePoint(pen,g,W,H,t,inten);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"environment.closing-ghost-surge",
  type:"ENVIRONMENT",
  name:"Closing ghost surge",
  statusWord:"CLOSING",
  scene:"OD-B11-S08",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["mass","ranks","pressure","flee"],
  // normalized 0..1 field anchors: escape node, wave front, crowd source, arrows
  anchors:{
    "flee:point":{   x:0.82, y:0.50 },   // the fleeing point the dead press toward
    "flee:exit":{    x:0.99, y:0.50 },   // where the crew breaks off-edge
    "front:wave":{   x:0.60, y:0.50 },   // leading edge of the near rank
    "source:dead":{  x:0.18, y:0.50 },   // deep of the massed crowd
    "arrow:upper":{  x:0.55, y:0.24 },
    "arrow:mid":{    x:0.44, y:0.50 },
    "arrow:lower":{  x:0.55, y:0.76 },
    "camera:wide":{  x:0.50, y:0.50 },
  },
  // affected regions: the ring of dead vs. the open escape gap
  zones:{
    crowd:{  x0:0.00, y0:0.06, x1:0.72, y1:0.94 },
    gap:{    x0:0.74, y0:0.36, x1:0.92, y1:0.64 },
    exit:{   x0:0.90, y0:0.42, x1:1.00, y1:0.58 },
  },
  // ENVIRONMENT state machine: the dead gather -> surge/press -> the crew breaks
  states:{
    initial:"surging",
    nodes:{
      // gathering: first ranks form, pale and sparse, arrows barely reaching
      gathering:{ preview:{ t:0.5, intensity:0.42, status:"GATHERING", progress:0.16 } },
      // surging: ranks massing into a wall, pressure arrows driving inward
      surging:{   preview:{ t:1.6, intensity:0.95, status:"SURGING",   progress:0.52 } },
      // closing: full density, the wall rings the gap, pressure at its peak
      closing:{   preview:{ t:2.7, intensity:1.45, status:"CLOSING",   progress:0.90 } },
      // fleeing: the crew breaks off-edge as the surge triggers flight
      fleeing:{   preview:{ t:3.2, intensity:1.30, status:"FLEEING",   progress:0.98,
                             layers:["mass","ranks","pressure","flee"] } },
    },
    edges:[["gathering","surging"],["surging","closing"],["closing","fleeing"],["closing","surging"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","density","pressure"],

  // neutral preview: the dead massed into a closing wall of pale shades, three
  // pressure arrows driving inward on the escape node, the flee arrow breaking
  // off the right edge (reads unmistakably as the closing ghost surge).
  preview:()=>({ t:2.4, intensity:1.30, status:"CLOSING", progress:0.82,
                 layers:["mass","ranks","pressure","flee"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
