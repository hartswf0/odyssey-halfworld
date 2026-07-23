/* environment.night-rain-and-cold — a cold wet stormy night on exposed ground.
   ENVIRONMENT asset (procedural world force). Scene function (OD-B14-S04):
   WIND drives dense diagonal RAIN across a DARK night; a small sheltered FIRE
   is kindled in RESPONSE to the cold; a knot of animals HUDDLES together with
   their backs to the gale; and an EXPOSURE-PRESSURE FIELD (isobar contours +
   inward chevrons) presses on the huddle from the windward edge.

   Procedural: WIND (direction + gust streamlines) drives RAIN (diagonal streak
   density/darkness) under DARKNESS (night ground/sky level) — the master force.
   The FIRE is a warmth node throwing a small light pool that eases the field;
   the HUDDLE is the exposed body the field acts on. Animatable over state.t:
   rain streaks fall, gusts sweep, flames flicker, the pressure isobars close in.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

const params = {
  horizon:  0.64,   // ground/sky line as frac of H
  huddleX:  0.42,   // huddling animals centre x as frac of W
  fireX:    0.63,   // sheltered fire centre x (leeward of the huddle)
  windDir:  1,      // gale blows left -> right (+1); rain + gusts lean this way
  rainCols: 16,     // diagonal rain streak columns
  gustCount:5,      // long wind-gust streamlines
  isobars:  5,      // exposure-pressure contour arcs
  huddleN:  3,      // animals in the huddle
  flameCount:4,     // tongues in the small fire
  darkLvl:  1.0,    // master darkness of the night (channel-driven)
  rain:     1.0,    // rain-streak density/darkness (channel-driven)
  wind:     1.0,    // gust strength / rain slant (channel-driven)
  fire:     1.0,    // fire response 0 (none/exposed) .. 1 (kindled) (channel-driven)
  pressure: 1.0,    // exposure-pressure field strength (channel-driven)
};

/* ---- NIGHT: the dark cold field. A mid-dark sky over a darker ground so rain
   and gusts read against it; a heavier vignette closes the top + the windward
   (left) edge in, pressing the cold darkness toward the huddle. ---- */
function drawNight(pen,g,W,H,dark){
  const hy = H*params.horizon;
  const d = clamp(dark,0,1.4);
  // sky kept fairly light so the DARK driven rain reads as the dominant texture;
  // ground darker so the huddle + rain-strike ground read as cold wet night.
  const skyL = Math.round(lerp(1,2,clamp01(d/1.2)));   // 1..2
  const gndL = Math.round(lerp(3,4,clamp01(d/1.2)));   // 3..4
  g.fillStyle = inkLevel(skyL); g.fillRect(0,0,W,hy);
  g.fillStyle = inkLevel(gndL); g.fillRect(0,hy,W,H-hy);
  // vignette: a soft cold band low in the sky + a dark windward wall on the left.
  // (kept off the very top edge so the card label stays legible.)
  g.fillStyle = inkLevel(clamp(skyL+1,1,7)); g.fillRect(0,hy-H*0.10,W,H*0.10);
  g.fillStyle = inkLevel(clamp(skyL+1,1,7)); g.fillRect(0,H*0.10,W*0.10,hy-H*0.10);
  g.fillStyle = inkLevel(clamp(gndL+1,1,7)); g.fillRect(0,hy,W*0.11,H-hy);
  // horizon seam
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);
}

/* ---- EXPOSURE-PRESSURE FIELD: a weather-diagram overlay of isobar contour arcs
   sweeping in from the windward edge and wrapping the huddle, packed closer
   (steeper gradient) as they near the exposed group, plus inward chevron
   pressure arrows. Thin light strokes so it reads as an overlaid field. ---- */
function drawPressure(pen,g,W,H,t,press){
  const p = clamp(press,0,1.4);
  if (p < 0.05) return;
  const hx = W*params.huddleX, hy = H*(params.horizon-0.02);
  const close = 0.5 + 0.5*Math.sin(t*0.8);              // isobars breathe inward
  // isobar contour arcs — concentric bowed lines centred on the huddle, opening
  // toward the windward (left) side; inner arcs pack tighter (higher pressure).
  // Drawn BOLD + dark so the field diagram punches through the fine rain hatching.
  g.strokeStyle = inkLevel(5 + Math.round(clamp01(p/1.3)));   // ~5..6
  for(let i=0;i<params.isobars;i++){
    const f = i/(params.isobars-1);                     // 0 inner .. 1 outer
    const rx = W*(0.14 + f*f*0.34) * (0.9+0.1*close);   // packed near, spread far
    const ry = rx*1.18;
    g.lineWidth = lerp(4.5, 2.4, f);
    g.beginPath();
    // left-opening arc (windward face of the pressure envelope)
    g.ellipse(hx + rx*0.30, hy, rx, ry, 0, TAU*0.30, TAU*0.70);
    g.stroke();
  }
  // inward chevron pressure-arrows driving from the cold windward edge to the huddle
  const arrows = 3;
  const drift = Math.sin(t*1.3)*W*0.01;
  g.strokeStyle = INK;                                   // solid bold arrows
  g.lineWidth = 5; g.lineCap="round"; g.lineJoin="round";
  for(let a=0;a<arrows;a++){
    const ay = hy - H*0.16 + a*H*0.14;
    const fx = W*0.05, tx = hx - W*0.16 + drift;
    // shaft
    g.beginPath(); g.moveTo(fx, ay);
    g.quadraticCurveTo((fx+tx)/2, ay - H*0.03, tx, ay); g.stroke();
    // chevron head opening back to the wind
    const ah = W*0.024;
    g.beginPath();
    g.moveTo(tx - ah, ay - ah*0.7);
    g.lineTo(tx, ay);
    g.lineTo(tx - ah, ay + ah*0.7);
    g.stroke();
  }
}

/* ---- WIND GUSTS: long bowed streamlines sweeping across the airspace in the
   wind direction, leaning down as they cross, with a leading hook. Length +
   count grow with wind. Drawn light (level 2-3) so rain reads on top. ---- */
function drawGusts(pen,g,W,H,t,wind){
  const w = clamp(wind,0,1.6);
  const dir = params.windDir;
  const n = Math.round(params.gustCount * (0.7+0.5*clamp01(w/1.2)));
  g.strokeStyle = inkLevel(2 + Math.round(clamp01(w/1.3)*1.6));  // ~2..3
  g.lineCap="round"; g.lineJoin="round";
  const hy = H*params.horizon;
  for(let i=0;i<n;i++){
    const baseY = H*0.10 + (i/(n))*hy*0.86;
    const drift = frac(t*0.30 + pr(i,4));
    const x0 = -W*0.1 + dir*drift*W*1.2;                // streams travel with the wind
    const len = W*(0.5 + 0.34*clamp01(w/1.3)) * (0.7+0.5*pr(i,2));
    const sag = H*0.05*(0.6+0.5*pr(i,3));
    g.lineWidth = lerp(2, 4.5, clamp01(w/1.4)) * (0.7+0.4*pr(i,5));
    const x1 = x0 + dir*len;
    g.beginPath();
    g.moveTo(x0, baseY);
    g.quadraticCurveTo(x0 + dir*len*0.5, baseY + sag, x1, baseY + sag*0.4);
    g.stroke();
    // a short leading hook curling with the gust
    g.beginPath();
    g.moveTo(x1, baseY + sag*0.4);
    g.quadraticCurveTo(x1 + dir*W*0.03, baseY + sag*0.4 + H*0.02, x1 + dir*W*0.015, baseY + sag*0.4 + H*0.045);
    g.stroke();
  }
}

/* ---- FIRE RESPONSE (light pool): a small warm glow kindled against the cold,
   sheltered on the leeward side of the huddle. Concentric ellipses brightest at
   the core fading into the night. Modest radius — the night stays dark. ---- */
function drawFireGlow(pen,g,W,H,fire){
  const f = clamp(fire,0,1.3);
  if (f < 0.05) return;
  const cx = W*params.fireX, cy = H*(params.horizon+0.035);
  const maxR = W*0.28 * (0.55+0.6*f);
  const rings = 6;
  for(let k=rings;k>=1;k--){
    const q = k/rings;                                  // 1 outer .. 0 inner
    const r = maxR*q;
    const lvl = Math.round(lerp(1, 4, q*q));            // bright core -> blends to night
    g.fillStyle = inkLevel(lvl);
    g.beginPath(); g.ellipse(cx, cy, r, r*0.60, 0, 0, TAU); g.fill();
  }
}

/* ---- one FLAME tongue (bright teardrop, leaning with the wind). ---- */
function flame(pen,g, bx,by, h, w, lvl, t, ph, lean){
  const flick = Math.sin(t*4 + ph);
  const sway = flick*w*0.30 + lean;
  const tipx = bx + sway, tipy = by - h;
  const midy = by - h*0.50;
  pen.paint(()=>{
    g.moveTo(bx - w, by);
    g.quadraticCurveTo(bx - w*1.12, by - h*0.30, bx - w*0.60, midy);
    g.quadraticCurveTo(bx + sway*0.5 - w*0.30, by - h*0.78, tipx, tipy);
    g.quadraticCurveTo(bx + sway*0.5 + w*0.30, by - h*0.78, bx + w*0.60, midy);
    g.quadraticCurveTo(bx + w*1.12, by - h*0.30, bx + w, by);
    g.quadraticCurveTo(bx, by - h*0.12, bx - w, by);
    g.closePath();
  }, toneSolid(inkLevel(lvl)), 3.2);
}

/* ---- FIRE: a small sheltered blaze — an ember bed under a few tongues that
   lean downwind (the gale bends the flame). Bright tongues so the fire reads as
   the one warm thing in the night. Scales with the fire channel. ---- */
function drawFire(pen,g,W,H,t,fire,wind){
  const f = clamp(fire,0,1.3);
  if (f < 0.06) return;
  const cx = W*params.fireX, by = H*(params.horizon+0.045);
  const lean = params.windDir * W*0.02 * clamp(wind,0.2,1.4);   // flame bent downwind
  // ember bed
  for(let i=0;i<6;i++){
    const a = pr(i,3)*TAU, rr = W*0.05*Math.sqrt(pr(i,4));
    const px = cx + Math.cos(a)*rr, py = by + Math.sin(a)*rr*0.34;
    const glow = 0.5+0.5*Math.sin(t*3+i*1.3);
    pen.paint(()=>{ g.ellipse(px,py,W*0.008*(0.7+0.5*pr(i,6)), W*0.006, 0,0,TAU); },
              toneSolid(inkLevel(Math.round(lerp(4,1,glow)))), 2);
  }
  const baseH = H*0.15*f;
  const n = params.flameCount;
  // back layer (mid), then bright core
  for(let i=0;i<n;i++){
    const s = (i/(n-1))*2-1;
    const x = cx + s*W*0.045;
    const h = baseH*(0.6+0.3*(1-Math.abs(s)));
    flame(pen,g, x, by, h, W*0.040*(1-0.15*Math.abs(s)), 3, t, i*1.7, lean*0.7);
  }
  flame(pen,g, cx, by, baseH*1.1, W*0.026, 1, t*1.3, 0.2, lean);
}

/* ---- one HUDDLING animal: a low humped body pressed down against the cold, head
   tucked toward the group, backs raised to the wind. Blocky rounded silhouette
   with short leg marks — drawn dark so it reads against the fire glow. ---- */
function huddleAnimal(pen,g, cx,by, bw,bh, headSide, lvl){
  // humped body — a rounded back rising to the windward shoulder. Heavy black
  // contour so each animal reads as a separate hump even when pressed together.
  const tone = toneSolid(inkLevel(lvl));
  pen.paint(()=>{
    g.moveTo(cx - bw, by);
    g.quadraticCurveTo(cx - bw*1.05, by - bh*1.20, cx - bw*0.20, by - bh*1.30); // high windward shoulder
    g.quadraticCurveTo(cx + bw*0.60, by - bh*1.18, cx + bw*0.95, by - bh*0.50); // slope down leeward
    g.quadraticCurveTo(cx + bw*1.08, by - bh*0.15, cx + bw, by);
    g.closePath();
  }, tone, 5);
  // a lighter back-fleece band along the spine so the hump has form (not a flat blob)
  g.strokeStyle = inkLevel(clamp(lvl-3,1,7)); g.lineWidth = Math.max(3, bw*0.14); g.lineCap="round";
  g.beginPath();
  g.moveTo(cx - bw*0.55, by - bh*1.02);
  g.quadraticCurveTo(cx - bw*0.05, by - bh*1.18, cx + bw*0.55, by - bh*0.80);
  g.stroke();
  // head tucked low toward the group (headSide -1 = tucked left/inward)
  const hx = cx + headSide*bw*0.78, hyy = by - bh*0.30;
  pen.paint(()=>{ g.ellipse(hx, hyy, bw*0.36, bh*0.46, 0, 0, TAU); }, tone, 5);
  // a small ear/horn nub
  pen.ink(()=>{ g.moveTo(hx + headSide*bw*0.05, hyy - bh*0.40); g.lineTo(hx + headSide*bw*0.18, hyy - bh*0.62); }, 3);
  // two short bunched leg marks
  g.strokeStyle = INK; g.lineWidth = Math.max(2.5, bw*0.11); g.lineCap="round";
  for(const lx of [cx - bw*0.40, cx + bw*0.28]){
    g.beginPath(); g.moveTo(lx, by - bh*0.12); g.lineTo(lx, by + bh*0.16); g.stroke();
  }
}

/* ---- HUDDLE: a knot of animals pressed shoulder-to-shoulder, backs to the wind,
   heads tucked inward. Sizes staggered for depth; all clustered at huddleX. ---- */
function drawHuddle(pen,g,W,H){
  const cx = W*params.huddleX, by = H*(params.horizon+0.085);
  const n = params.huddleN;
  const specs = [
    { dx:-0.090, dy: 0.014, bw:0.064, bh:0.072, head:-1, lvl:6 },
    { dx: 0.002, dy: 0.000, bw:0.078, bh:0.086, head:-1, lvl:5 },
    { dx: 0.092, dy: 0.018, bw:0.060, bh:0.066, head: 1, lvl:7 },
  ];
  // ground contact shadow under the group
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, by+H*0.01, W*0.16, H*0.02, 0,0,TAU); g.fill();
  for(let i=0;i<n;i++){
    const s = specs[i%specs.length];
    huddleAnimal(pen,g, cx + s.dx*W, by + s.dy*H, s.bw*W, s.bh*H, s.head, s.lvl);
  }
}

/* ---- RAIN: dense diagonal streaks driven across the whole frame by the wind.
   Slant + density + darkness scale with rain*wind; streaks fall + drift over t.
   Drawn last (foreground) over the night, gusts, fire and huddle. ---- */
function drawRain(pen,g,W,H,t,rainI,wind){
  const r = clamp(rainI,0,1.6), w = clamp(wind,0,1.6);
  if (r < 0.04) return;
  const dir = params.windDir;
  const cols = Math.round(params.rainCols * (0.7+0.5*clamp01(r/1.2)));
  const segH = H*0.115;                                    // streak length + gap unit
  const slant = dir * segH*0.62 * (0.7+0.6*clamp01(w/1.2)); // wind-driven diagonal lean
  const fall = (t*H*0.6) % segH;
  // dense DARK diagonal streaks — the dominant texture of the driven rain
  g.strokeStyle = inkLevel(5 + Math.round(clamp01(r/1.4)));   // ~5..6
  g.lineWidth = lerp(2.4, 3.6, clamp01(r/1.3));
  g.lineCap="round";
  for(let c=0;c<cols;c++){
    const x = ((c+0.5)/cols)*W + ((c*37)%29) - 14;
    for(let y=-segH; y<H+segH; y+=segH){
      const y0 = y + fall + ((c*53)%segH);
      g.beginPath();
      g.moveTo(x, y0);
      g.lineTo(x + slant, y0 + segH*0.60);                  // clear diagonal, gap below
      g.stroke();
    }
  }
  // a lighter interleaved layer of finer streaks for depth/density
  g.strokeStyle = inkLevel(3);
  g.lineWidth = lerp(1.4, 2.2, clamp01(r/1.3));
  for(let c=0;c<cols;c++){
    const x = (c/cols)*W + ((c*61)%23);
    for(let y=-segH; y<H+segH; y+=segH){
      const y0 = y + (fall+segH*0.5)%segH + ((c*29)%segH);
      g.beginPath();
      g.moveTo(x, y0);
      g.lineTo(x + slant*0.9, y0 + segH*0.48);
      g.stroke();
    }
  }
  // a scatter of bright impact ticks along the ground where the rain strikes
  const hy = H*params.horizon;
  g.strokeStyle = inkLevel(1);
  g.lineWidth = lerp(1.4,2.4,clamp01(r/1.3));
  for(let i=0;i<Math.round(cols*1.2);i++){
    const x = frac(pr(i,7) + t*0.15)*W;
    const y = hy + frac(pr(i,8))* (H-hy);
    g.beginPath(); g.moveTo(x - W*0.007, y); g.lineTo(x + dir*W*0.007, y - H*0.012); g.stroke();
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t    = st.t ?? 0;
  const dark = st.dark ?? params.darkLvl;
  const rainI= st.rain ?? params.rain;
  const wind = st.wind ?? params.wind;
  const fire = st.fire ?? params.fire;
  const press= st.pressure ?? params.pressure;
  const layers = st.layers || ["night","pressure","gusts","glow","huddle","fire","rain"];
  const has = l => layers.includes(l);

  if (has("night"))    drawNight(pen,g,W,H,dark);
  if (has("pressure")) drawPressure(pen,g,W,H,t,press);
  if (has("gusts"))    drawGusts(pen,g,W,H,t,wind);
  if (has("glow"))     drawFireGlow(pen,g,W,H,fire);
  if (has("huddle"))   drawHuddle(pen,g,W,H);
  if (has("fire"))     drawFire(pen,g,W,H,t,fire,wind);
  if (has("rain"))     drawRain(pen,g,W,H,t,rainI,wind);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"environment.night-rain-and-cold",
  type:"ENVIRONMENT",
  name:"Night rain and cold",
  statusWord:"EXPOSED",
  scene:"OD-B14-S04",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["night","pressure","gusts","glow","huddle","fire","rain"],
  // normalized 0..1 field anchors: wind source, the exposed huddle, the fire, field
  anchors:{
    "wind:source":{    x:0.03, y:0.34 },   // gale drives in from the windward edge
    "huddle:centre":{  x:0.42, y:0.72 },   // the exposed animals pressed together
    "fire:core":{      x:0.63, y:0.69 },   // the small sheltered warmth node
    "pressure:front":{ x:0.26, y:0.62 },   // windward face of the exposure envelope
    "shelter:lee":{    x:0.72, y:0.74 },   // the calmer leeward side
    "sky:ceiling":{    x:0.50, y:0.05 },
    "camera:wide":{    x:0.50, y:0.50 },
  },
  // affected regions: the cold windward air, the exposed ground, the lit warm pool
  zones:{
    air:     { x0:0.00, y0:0.00, x1:1.00, y1:0.64 },
    ground:  { x0:0.00, y0:0.64, x1:1.00, y1:1.00 },
    warm:    { x0:0.48, y0:0.58, x1:0.82, y1:0.86 },
    exposed: { x0:0.20, y0:0.58, x1:0.58, y1:0.90 },
  },
  // ENVIRONMENT state machine: the atlas performance beats, in order
  states:{
    initial:"downpour",
    nodes:{
      // wind rising, first rain, the night darkening — no fire yet, huddle forms
      gathering:{ preview:{ t:0.6, dark:0.55, rain:0.40, wind:0.55, fire:0.0, pressure:0.5,
                            status:"GATHERING", progress:0.16,
                            layers:["night","pressure","gusts","huddle","rain"] } },
      // full cold storm — dense driven rain, strong gusts, darkest, animals huddled
      downpour:{ preview:{ t:2.4, dark:1.15, rain:1.35, wind:1.30, fire:0.0, pressure:1.15,
                           status:"DOWNPOUR", progress:0.62,
                           layers:["night","pressure","gusts","huddle","rain"] } },
      // fire-response: a small blaze kindled against the cold, warmth pool eases the field
      "fire-response":{ preview:{ t:3.0, dark:1.0, rain:1.10, wind:1.05, fire:1.1, pressure:0.75,
                           status:"WARMING", progress:0.82 } },
      // exposed: peak exposure-pressure — no fire, isobars closed tight on the huddle
      exposed:{ preview:{ t:3.6, dark:1.25, rain:1.25, wind:1.35, fire:0.0, pressure:1.4,
                           status:"EXPOSED", progress:0.95,
                           layers:["night","pressure","gusts","huddle","rain"] } },
    },
    edges:[["gathering","downpour"],["downpour","exposed"],
           ["downpour","fire-response"],["fire-response","downpour"],
           ["exposed","fire-response"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","dark","rain","wind","fire","pressure"],

  // neutral preview: the full cold night storm — dark ground, driven diagonal rain,
  // sweeping gusts, a knot of animals huddled against the gale under an isobar
  // exposure-pressure field, with a small sheltered fire kindled in response.
  preview:()=>({ t:2.2, dark:1.05, rain:1.15, wind:1.10, fire:0.85, pressure:1.0,
                 status:"EXPOSED", progress:0.60,
                 layers:["night","pressure","gusts","glow","huddle","fire","rain"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
