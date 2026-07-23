/* environment.fire-and-dry-logs — a hearth fire kindled from a dropped wood pile.
   ENVIRONMENT asset (procedural world force). Scene function (OD-B09-S06):
   a bundle of dry logs is DROPPED onto a hearth, CATCHES, and grows into a
   blaze that throws a widening pool of light and long cast shadows across a
   dim room. The FIRE is the SOURCE — a light node at the flame core — from
   which the field radiates: a radial light pool (near-paper at the core,
   darkening outward into the dim room), hard cast-shadow wedges thrown away
   from the source along the floor, tongues of flame, and a rising smoke plume.

   Procedural: SOURCE (flame core) -> INTENSITY (scales flame height, light
   radius, ember glow, shadow length/darkness, smoke mass) -> REGION (the lit
   floor pool vs. the dim room beyond). Animatable channels over state.t:
   `drop` tumbles the wood pile with impact dust (wood-drop shock), `intensity`
   grows the illumination, `smoke` thickens the plume, flames flicker, sparks
   and smoke rise, cast shadows lengthen (shadow-reveal).

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

const params = {
  floor:     0.72,   // floor/wall line as frac of H
  fireX:     0.50,   // hearth centre x as frac of W
  hearthY:   0.80,   // ember-bed / log-pile base y as frac of H
  logCount:  5,      // dry logs in the dropped pile
  flameCount:5,      // tongues of flame
  smokePuffs:6,      // stacked puffs in the rising plume
  sparks:    9,      // rising ember motes
  roomLvl:   3,      // dimness of the room beyond the light pool
  intensity: 1.0,    // master field strength (channel-driven, ember->blaze)
  lightR:    1.0,    // light-pool radius multiplier (channel-driven)
  smoke:     1.0,    // smoke-plume mass (channel-driven)
  drop:      0.0,    // wood-drop shock: 0 settled .. 1 mid-fall (channel-driven)
};

/* ---- ROOM: the dim interior the fire will reveal. Mid-dark ground so the
   light pool + flames read bright against it, with a heavier vignette so the
   glow presses the dark back. ---- */
function drawRoom(pen,g,W,H){
  const fy = H*params.floor;
  // back wall (dimmer up top) and floor (a touch darker where shadows fall)
  g.fillStyle = inkLevel(params.roomLvl);   g.fillRect(0,0,W,fy);
  g.fillStyle = inkLevel(params.roomLvl+1); g.fillRect(0,fy,W,H-fy);
  // vignette: heavier band at the very top + outer edges
  g.fillStyle = inkLevel(params.roomLvl+2); g.fillRect(0,0,W,H*0.05);
  // the floor/wall seam
  pen.ink(()=>{ g.moveTo(0,fy); g.lineTo(W,fy); }, 4);
}

/* ---- LIGHT POOL: the fire's radiant field. Concentric ellipses centred on the
   hearth, painted largest(dim)->smallest(bright) so a contained glow gathers at
   the fire and fades back into the dim room. Radius scales with intensity*lightR.
   Kept moderate so the room stays dark and the flames read as the brightest thing. */
function drawLightPool(pen,g,W,H,inten,lr){
  const cx = W*params.fireX, cy = H*(params.hearthY-0.02);
  const maxR = W*0.36 * (0.55 + 0.60*clamp(inten,0,1.4)) * clamp(lr,0.2,1.6);
  const rings = 6;
  for(let k=rings;k>=1;k--){
    const f = k/rings;                       // 1 outer .. ~0 inner
    const r = maxR*f;
    // outer rings sit at room level (blend), inner rings brighten toward the fire.
    // flatter than round so the glow spreads over the floor + low wall, not a high orb.
    const lvl = Math.round(lerp(1, params.roomLvl, f*f));
    g.fillStyle = inkLevel(lvl);
    g.beginPath(); g.ellipse(cx, cy, r, r*0.62, 0, 0, TAU); g.fill();
  }
}

/* ---- CAST SHADOWS: the shadow-reveal. Hard dark wedges thrown from the hearth
   OUTWARD across the lit floor, away from the source. Length + darkness grow
   with intensity (a brighter fire casts longer, sharper shadows). ---- */
function drawCastShadows(pen,g,W,H,inten){
  const cx = W*params.fireX, cy = H*(params.hearthY);
  const strength = clamp(inten,0,1.5);
  const len = lerp(W*0.18, W*0.52, clamp01(strength/1.3));
  const lvl = params.roomLvl + 1 + Math.round(clamp01(strength/1.3)*2); // ~4..6
  // wedges fan across the lower floor (light source above the pile throws them down/out)
  const spokes = [ -1.35, -1.02, -0.70, 0.70, 1.02, 1.35 ];
  g.fillStyle = inkLevel(lvl);
  for(const a of spokes){
    const dx = Math.sin(a), dy = Math.max(0.35, Math.cos(a)*0.55 + 0.55);
    const tipx = cx + dx*len, tipy = cy + dy*len;
    const wobble = (0.04 + 0.03*Math.abs(dx)) * len;
    g.beginPath();
    g.moveTo(cx - dx*W*0.02, cy);
    g.lineTo(cx + dx*W*0.02, cy);
    g.lineTo(tipx + wobble, tipy);
    g.lineTo(tipx - wobble, tipy);
    g.closePath();
    g.fill();
  }
}

/* ---- HEARTH: a low ring of stones cradling the ember bed. Drawn as a shallow
   arc of rounded blocks across the front of the pile. ---- */
function drawHearth(pen,g,W,H){
  const cx = W*params.fireX, by = H*params.hearthY;
  const rw = W*0.24, rh = H*0.045;
  const stones = 7;
  for(let i=0;i<stones;i++){
    const a = lerp(-0.15, Math.PI+0.15, i/(stones-1));
    const sx = cx - Math.cos(a)*rw;
    const sy = by + Math.sin(a)*rh*0.5 + rh*0.4;
    const s = W*0.032*(0.85+0.3*pr(i,7));
    const lvl = 4 + (i%2);
    pen.paint(()=>{ g.ellipse(sx, sy, s, s*0.78, 0, 0, TAU); }, toneSolid(inkLevel(lvl)), 4);
  }
}

/* ---- one dry LOG: a thick capsule at an angle with a concentric end-grain
   ring at the visible tip (reads as split, seasoned wood). ---- */
function log(pen,g, x,y, ang, len, rad, lvl){
  const ux = Math.cos(ang), uy = Math.sin(ang);
  const ax = x - ux*len/2, ay = y - uy*len/2;
  const bx = x + ux*len/2, by = y + uy*len/2;
  // body capsule
  pen.limb(()=>{ g.moveTo(ax,ay); g.lineTo(bx,by); }, toneSolid(inkLevel(lvl)), rad*2);
  // a bark seam line along the length
  g.strokeStyle = inkLevel(clamp(lvl+2,1,7)); g.lineWidth = Math.max(1.5,rad*0.28); g.lineCap="round";
  g.beginPath(); g.moveTo(ax+ux*rad, ay+uy*rad - rad*0.35);
  g.lineTo(bx-ux*rad, by-uy*rad - rad*0.35); g.stroke();
  // end-grain: concentric rings on the near tip
  const ex = bx, ey = by;
  pen.paint(()=>{ g.ellipse(ex, ey, rad*1.02, rad*0.9, ang, 0, TAU); }, toneSolid(inkLevel(clamp(lvl-1,1,7))), 3);
  g.strokeStyle = inkLevel(clamp(lvl+2,1,7)); g.lineWidth = 2;
  for(const rr of [0.66,0.36]){ g.beginPath(); g.ellipse(ex,ey,rad*rr,rad*rr*0.88,ang,0,TAU); g.stroke(); }
  g.fillStyle = inkLevel(clamp(lvl+3,1,7)); g.beginPath(); g.ellipse(ex,ey,rad*0.14,rad*0.14,0,0,TAU); g.fill();
}

/* ---- the dropped WOOD PILE: crossed dry logs cradled in the hearth. When
   `drop`>0 the logs are lifted + splayed mid-fall with impact dust below. ---- */
function drawLogs(pen,g,W,H,drop){
  const cx = W*params.fireX, by = H*params.hearthY;
  const n = params.logCount;
  const R = W*0.028;
  const L = W*0.30;
  const lift = drop * H*0.14;            // mid-fall elevation
  // deterministic crossed arrangement
  const arr = [
    { dx:-0.02, dy: 0.010, a: 0.10, l:1.00, lvl:5 },
    { dx: 0.03, dy:-0.004, a:-0.14, l:0.96, lvl:5 },
    { dx:-0.06, dy:-0.018, a: 0.34, l:0.82, lvl:4 },
    { dx: 0.07, dy:-0.020, a:-0.40, l:0.80, lvl:6 },
    { dx: 0.00, dy:-0.030, a: 0.02, l:0.70, lvl:4 },
  ];
  for(let i=0;i<n;i++){
    const s = arr[i%arr.length];
    // in wood-drop the top logs lift more and tilt further (tumbling)
    const dropTilt = drop * (i%2? 0.5 : -0.5) * (0.4+0.15*i);
    const x = cx + s.dx*W;
    const y = by + s.dy*H - lift*(0.4 + 0.6*(i/n));
    log(pen,g, x, y, s.a + dropTilt, L*s.l, R*(0.9+0.2*pr(i,2)), s.lvl);
  }
  // impact dust when the pile is still falling
  if (drop > 0.05){
    g.fillStyle = inkLevel(2);
    for(let i=0;i<8;i++){
      const a = lerp(-0.4, Math.PI+0.4, i/7);
      const rr = W*0.10*(0.6+0.5*pr(i,5))*drop;
      const px = cx - Math.cos(a)*rr;
      const py = by + H*0.03 + Math.sin(a)*rr*0.3;
      g.beginPath(); g.ellipse(px, py, W*0.022*drop, W*0.013*drop, 0,0,TAU); g.fill();
    }
    // motion streaks above the lifted logs
    g.strokeStyle = inkLevel(3); g.lineWidth = 2.5; g.lineCap="round";
    for(let i=0;i<4;i++){
      const x = cx + lerp(-W*0.08,W*0.08,i/3);
      g.beginPath(); g.moveTo(x, by - lift*0.4); g.lineTo(x, by - lift*0.4 - H*0.06*drop); g.stroke();
    }
  }
}

/* ---- EMBER BED: glowing coals under the logs. Bright motes (near-paper) with
   hard dark contour so they read as live embers. Glow scales with intensity. ---- */
function drawEmbers(pen,g,W,H,t,inten){
  const cx = W*params.fireX, by = H*params.hearthY;
  const strength = clamp(inten,0,1.4);
  const n = 10;
  for(let i=0;i<n;i++){
    const a = pr(i,3)*TAU;
    const rr = W*0.11*Math.sqrt(pr(i,4));
    const px = cx + Math.cos(a)*rr;
    const py = by - H*0.006 + Math.sin(a)*rr*0.32;
    const glow = 0.5 + 0.5*Math.sin(t*3 + i*1.3);
    const lvl = Math.round(lerp(4, 1, clamp01(strength)* (0.5+0.5*glow)));
    const r = W*0.012*(0.7+0.5*pr(i,6))*(0.7+0.5*strength);
    pen.paint(()=>{ g.ellipse(px,py,r,r*0.8,0,0,TAU); }, toneSolid(inkLevel(lvl)), 2.5);
  }
}

/* ---- one FLAME tongue: a pointed teardrop rising from a base, its tip wobbling
   over t. Layered from broad/dark(back) to slim/bright(core). ---- */
function flame(pen,g, bx,by, h, w, lvl, t, ph){
  const flick = Math.sin(t*4 + ph);
  const sway = flick*w*0.30;                 // gentle lean so tongues stay full, not spiky
  const tipx = bx + sway, tipy = by - h;
  const midy = by - h*0.50;
  pen.paint(()=>{
    g.moveTo(bx - w, by);
    // full bulging belly up to a rounded shoulder, then taper to the tip
    g.quadraticCurveTo(bx - w*1.15, by - h*0.30, bx - w*0.62, midy);
    g.quadraticCurveTo(bx + sway*0.5 - w*0.30, by - h*0.78, tipx, tipy);   // tip
    g.quadraticCurveTo(bx + sway*0.5 + w*0.30, by - h*0.78, bx + w*0.62, midy);
    g.quadraticCurveTo(bx + w*1.15, by - h*0.30, bx + w, by);
    // notch the base so tongues read separate
    g.quadraticCurveTo(bx, by - h*0.12, bx - w, by);
    g.closePath();
  }, toneSolid(inkLevel(lvl)), 3.5);
}

/* ---- FLAMES: a cluster of tongues, tallest at the core, height scaling with
   intensity. FIRE IS THE LIGHT SOURCE — tongues are BRIGHT (broad mid-tone at
   the back, near-paper core) with a hard dark contour so they read as flame. -- */
function drawFlames(pen,g,W,H,t,inten){
  const cx = W*params.fireX, by = H*(params.hearthY-0.02);
  const strength = clamp(inten,0,1.4);
  if (strength < 0.02) return;
  const baseH = H*0.24*strength;
  const n = params.flameCount;
  // back layer — broad tongues, mid tone (level 3) spread across the bed
  for(let i=0;i<n;i++){
    const f = (i/(n-1))*2-1;                       // -1..1
    const x = cx + f*W*0.075;
    const h = baseH*(0.55 + 0.32*(1-Math.abs(f)));
    flame(pen,g, x, by, h, W*0.060*(1-0.18*Math.abs(f)), 3, t, i*1.7);
  }
  // mid layer — lighter (level 2)
  for(let i=0;i<n-1;i++){
    const f = (i/(n-2))*2-1;
    const x = cx + f*W*0.050;
    const h = baseH*(0.80 + 0.22*(1-Math.abs(f)));
    flame(pen,g, x, by, h, W*0.046*(1-0.14*Math.abs(f)), 2, t*1.15, i*2.3+0.6);
  }
  // core — one tall near-paper tongue at centre (the brightest note)
  flame(pen,g, cx, by, baseH*1.15, W*0.034, 1, t*1.3, 0.2);
}

/* ---- SPARKS: ember motes lifting off the flame, dwindling as they rise. ---- */
function drawSparks(pen,g,W,H,t,inten){
  const cx = W*params.fireX, by = H*(params.hearthY-0.02);
  const strength = clamp(inten,0,1.4);
  if (strength < 0.15) return;
  const n = params.sparks;
  const riseH = H*(0.30+0.14*strength);
  for(let i=0;i<n;i++){
    const ph = frac(t*0.22 + pr(i,8));
    const drift = Math.sin(ph*5 + i)*W*0.05;
    const x = cx + (pr(i,9)*2-1)*W*0.06 + drift*ph;
    const y = by - riseH*ph;
    const r = lerp(3.2, 0.8, ph)*(0.7+0.4*strength);
    g.fillStyle = inkLevel(Math.round(lerp(1,3,ph)));
    g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
  }
}

/* ---- SMOKE: a rising, drifting wisp above the flames — a serpentine ribbon
   that thins and lightens as it climbs. Filled soft blobs along a waving column
   (no hard outline) so it reads as smoke, not stacked bubbles. Mass scales with
   the smoke channel. ---- */
function drawSmoke(pen,g,W,H,t,smoke,inten){
  const cx = W*params.fireX, by = H*(params.hearthY - 0.20*clamp(inten,0.2,1.4));
  const mass = clamp(smoke,0,1.5);
  if (mass < 0.05) return;
  const topY = by - H*0.46*(0.6+0.4*mass);
  const steps = 22;
  // serpentine centre-line, drifting over t
  const cxAt = f => cx + Math.sin(f*3.4 + t*0.7)*W*0.06*(0.3+f) + (f-0.2)*W*0.02;
  for(let s=0;s<=steps;s++){
    const f = s/steps;                              // 0 base .. 1 top
    const y = lerp(by, topY, f);
    const x = cxAt(f);
    const r = W*(0.018 + 0.060*f) * mass;           // broadens as it rises
    const lvl = Math.round(lerp(4, 1, f*f));        // thins toward paper up high
    if (lvl<=1 && f>0.9) continue;
    g.fillStyle = inkLevel(lvl);
    g.beginPath(); g.ellipse(x, y, r, r*0.9, 0, 0, TAU); g.fill();
    // a small offset lobe for body on the lower half
    if (f<0.6){ const off = Math.sin(f*7+t)*r*0.7;
      g.beginPath(); g.ellipse(x+off, y-r*0.3, r*0.6, r*0.55, 0, 0, TAU); g.fill(); }
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t     = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const lr    = st.lightR ?? params.lightR;
  const smoke = st.smoke ?? params.smoke;
  const drop  = st.drop ?? params.drop;
  const layers = st.layers || ["room","light","shadows","hearth","logs","embers","flames","sparks","smoke"];
  const has = l => layers.includes(l);

  if (has("room"))    drawRoom(pen,g,W,H);
  if (has("light"))   drawLightPool(pen,g,W,H,inten,lr);
  if (has("shadows")) drawCastShadows(pen,g,W,H,inten);
  if (has("hearth"))  drawHearth(pen,g,W,H);
  if (has("logs"))    drawLogs(pen,g,W,H,drop);
  if (has("embers"))  drawEmbers(pen,g,W,H,t,inten);
  if (has("flames"))  drawFlames(pen,g,W,H,t,inten);
  if (has("sparks"))  drawSparks(pen,g,W,H,t,inten);
  if (has("smoke"))   drawSmoke(pen,g,W,H,t,smoke,inten);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"environment.fire-and-dry-logs",
  type:"ENVIRONMENT",
  name:"Fire and dry logs",
  statusWord:"KINDLING",
  scene:"OD-B09-S06",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["room","light","shadows","hearth","logs","embers","flames","sparks","smoke"],
  // normalized 0..1 field anchors: the source, the light region, the plume, casters
  anchors:{
    "source:flame":{ x:0.50, y:0.70 },     // the light node — flame core
    "bed:embers":{   x:0.50, y:0.80 },      // glowing coal bed under the logs
    "pile:wood":{    x:0.50, y:0.79 },      // the dropped wood pile
    "plume:smoke":{  x:0.50, y:0.30 },      // rising smoke column
    "shadow:left":{  x:0.20, y:0.94 },      // long cast shadow thrown left
    "shadow:right":{ x:0.80, y:0.94 },      // long cast shadow thrown right
    "hearth:front":{ x:0.50, y:0.86 },
    "camera:wide":{  x:0.50, y:0.50 },
  },
  // affected regions: the lit pool near the fire vs. the dim room beyond
  zones:{
    lit:  { x0:0.18, y0:0.50, x1:0.82, y1:0.98 },
    dim:  { x0:0.00, y0:0.00, x1:1.00, y1:0.50 },
    hearth:{ x0:0.34, y0:0.74, x1:0.66, y1:0.88 },
  },
  // ENVIRONMENT state machine: the atlas performance beats, in order
  states:{
    initial:"growing-illumination",
    nodes:{
      // wood-drop: the bundle is dropped — logs splayed mid-fall, dust, no fire
      "wood-drop":{ preview:{ t:0.2, intensity:0.02, lightR:0.2, smoke:0.0, drop:0.9,
                              status:"WOOD-DROP", progress:0.10,
                              layers:["room","hearth","logs"] } },
      // ignition: first tongues catch, a faint glow gathers at the bed
      ignition:{ preview:{ t:0.9, intensity:0.30, lightR:0.5, smoke:0.25, drop:0.0,
                           status:"IGNITION", progress:0.32 } },
      // growing-illumination: the blaze rises, the light pool widens (neutral)
      "growing-illumination":{ preview:{ t:1.9, intensity:0.80, lightR:1.0, smoke:0.6, drop:0.0,
                           status:"KINDLING", progress:0.60 } },
      // smoke: full blaze throwing a heavy rising plume
      smoke:{ preview:{ t:2.6, intensity:1.10, lightR:1.15, smoke:1.4, drop:0.0,
                           status:"BLAZING", progress:0.80 } },
      // shadow-reveal: peak light — longest, sharpest cast shadows across the room
      "shadow-reveal":{ preview:{ t:3.1, intensity:1.35, lightR:1.5, smoke:1.0, drop:0.0,
                           status:"REVEALING", progress:0.94 } },
    },
    edges:[["wood-drop","ignition"],["ignition","growing-illumination"],
           ["growing-illumination","smoke"],["smoke","shadow-reveal"],
           ["shadow-reveal","growing-illumination"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","lightR","smoke","drop"],

  // neutral preview: the growing blaze — logs cradled in the hearth, tongues up,
  // a widened light pool, cast shadows thrown out, a curling plume of smoke.
  preview:()=>({ t:1.9, intensity:0.85, lightR:1.05, smoke:0.7, drop:0.0,
                 status:"KINDLING", progress:0.60,
                 layers:["room","light","shadows","hearth","logs","embers","flames","sparks","smoke"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
