/* environment.four-wind-storm — a multi-directional tempest raised by Poseidon.
   ENVIRONMENT asset (procedural world force). Scene function (OD-B05-S05):
   FOUR winds are loosed at once and converge into a single churning storm.
   Poseidon is the SOURCE — a trident node at the convergence eye — from which
   the field radiates: converging cloud banks stacked in from the four edges,
   four great wind-arrows driving inward (N/E/S/W), driven rain hatching, a
   jagged lightning bolt cracking from cloud to sea, and towering wave crests
   heaved up along the foreground.

   Procedural: SOURCE (Poseidon eye) -> DIRECTION (four inward winds) ->
   INTENSITY (scales cloud mass, arrow length/darkness, rain density, bolt
   flicker, wave height) -> REGION (air / sea). Animates over state.t: clouds
   breathe, arrows pulse inward, rain streaks fall, the bolt flickers, the
   wave crests heave and curl.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:   0.60,   // sea/sky (waterline) as frac of H
  eyeX:      0.50,   // convergence eye (Poseidon source) x as frac of W
  eyeY:      0.44,   // convergence eye y as frac of H
  cloudLvl:  5,      // darkness of the converging cloud banks
  rainRows:  9,      // diagonal rain streak columns
  waveCount: 5,      // towering foreground crests
  intensity: 1.0,    // master field strength (channel-driven, calm->gale)
  bolt:      1.0,    // lightning presence (channel-driven flicker)
};

/* ---- SKY: the roiled airspace the storm fills (mid-light so dark cloud +
   arrows read against it). A darker vignette band up top presses the light down. ---- */
function drawSky(pen,g,W,H){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(2); g.fillRect(0,0,W,hy);
  // a faint heavier band across the very top (the storm ceiling closing in)
  g.fillStyle = inkLevel(3); g.fillRect(0,0,W,H*0.05);
}

/* ---- one lobed cloud bank: a run of overlapping bumps along a baseline with
   a filled body above it and a hard scalloped contour. Rotated toward the eye. ---- */
function cloudBank(pen,g, cx,cy, wdt, hgt, lobes, lvl, ang){
  g.save();
  g.translate(cx,cy); g.rotate(ang);
  const tone = toneSolid(inkLevel(lvl));
  // body: box up from the scalloped underside
  pen.paint(()=>{
    g.moveTo(-wdt/2, 0);
    for(let b=0;b<=lobes;b++){
      const x0 = lerp(-wdt/2, wdt/2, b/lobes);
      const x1 = lerp(-wdt/2, wdt/2, (b+0.5)/lobes);
      const dip = hgt*0.32*(0.7+0.5*Math.sin(b*1.9));
      g.quadraticCurveTo(x0, dip, x1, 0);
    }
    g.lineTo(wdt/2, -hgt);
    g.lineTo(-wdt/2, -hgt);
    g.closePath();
  }, tone, 5);
  // a couple of rounded crown lobes so the top reads as billowing cloud
  for(let b=0;b<lobes;b+=1){
    const x = lerp(-wdt/2, wdt/2, (b+0.5)/lobes);
    pen.paint(()=>{ g.arc(x, -hgt*0.72, wdt/lobes*0.55, 0, TAU); }, tone, 4);
  }
  g.restore();
}

/* ---- CLOUDS: four banks converging from the four edges toward the eye, each
   angled to lean inward. Mass grows a touch with intensity + a breathing wobble. ---- */
function drawClouds(pen,g,W,H,t,inten){
  const lvl = params.cloudLvl;
  const s = 0.80 + 0.24*clamp(inten,0,1.4);
  const br = Math.sin(t*0.9)*0.03;
  // top bank (broad ceiling)
  cloudBank(pen,g, W*0.50, H*0.12, W*0.80*s, H*0.13*s, 6, lvl,  0.00+br);
  // upper-left bank leaning in
  cloudBank(pen,g, W*0.15, H*0.21, W*0.44*s, H*0.11*s, 4, lvl-1,  0.34+br);
  // upper-right bank leaning in
  cloudBank(pen,g, W*0.85, H*0.21, W*0.44*s, H*0.11*s, 4, lvl-1, -0.34-br);
}

/* ---- one great wind-arrow: a bowed streamline driving from `from` toward the
   eye, with a bold chevron arrowhead at the leading (inner) tip. ---- */
function windArrow(pen,g, fx,fy, ex,ey, lvl, lw, ah, bow, t, ph){
  const dx = ex-fx, dy = ey-fy, len = Math.hypot(dx,dy)||1;
  const ux = dx/len, uy = dy/len;          // unit toward eye
  const nx = -uy, ny = ux;                 // normal
  const wob = bow*(0.8+0.3*Math.sin(t*1.4+ph));
  const mx = (fx+ex)/2 + nx*wob, my = (fy+ey)/2 + ny*wob;
  g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lw;
  g.beginPath(); g.moveTo(fx,fy); g.quadraticCurveTo(mx,my, ex,ey); g.stroke();
  // chevron arrowhead at the tip, opening back away from travel
  g.beginPath();
  g.moveTo(ex - ux*ah - nx*ah*0.66, ey - uy*ah - ny*ah*0.66);
  g.lineTo(ex, ey);
  g.lineTo(ex - ux*ah + nx*ah*0.66, ey - uy*ah + ny*ah*0.66);
  g.stroke();
}

/* ---- WINDS: the FOUR compass winds loosed together, all driving inward toward
   the eye. Length/darkness scale with intensity; each pulses on t. ---- */
function drawWinds(pen,g,W,H,t,inten){
  const ex = W*params.eyeX, ey = H*params.eyeY;
  const strength = clamp(inten,0,1.6);
  const lvl = 4 + Math.round(clamp(strength/1.3,0,1)*3);   // ~4..7
  const lw  = lerp(6, 12, clamp(strength/1.3,0,1));
  const ah  = lerp(20, 40, clamp(strength/1.2,0,1));
  const gap = lerp(W*0.22, W*0.15, clamp(strength,0,1.4)); // tips ring clear of the trident eye
  const push = Math.sin(t*1.6)*W*0.012;                    // synchronized inward pulse
  const bow  = W*0.12;                                     // consistent clockwise swirl
  const mk = (fx,fy, ph)=>{
    const dx = ex-fx, dy = ey-fy, L = Math.hypot(dx,dy)||1;
    const tx = fx + (dx/L)*(L-gap-push), ty = fy + (dy/L)*(L-gap-push);
    windArrow(pen,g, fx,fy, tx,ty, lvl, lw, ah, bow, t, ph);
  };
  // NORTH (from top, driving down), SOUTH (from below, up),
  // WEST (from left, right), EAST (from right, left) — all bowed into one swirl
  mk(W*0.50, H*0.05, 0.0);
  mk(W*0.50, H*0.88, 1.6);
  mk(W*0.03, H*0.40, 3.1);
  mk(W*0.97, H*0.48, 4.7);
}

/* ---- RAIN: driven diagonal hatching sweeping across the storm. Slanted short
   streaks, denser + darker with intensity, drifting/falling over t. ---- */
function drawRain(pen,g,W,H,t,inten){
  const hy = H*params.horizon;
  const strength = clamp(inten,0,1.5);
  const cols = Math.round(params.rainRows * (0.7 + 0.6*strength));
  const slant = W*0.055;                     // horizontal lean of each streak
  const segH = H*0.11;
  g.strokeStyle = inkLevel(2 + Math.round(strength*1.6));  // ~2..4
  g.lineWidth = lerp(1.5, 3, clamp(strength,0,1));
  g.lineCap="round";
  const fall = (t*H*0.5) % segH;
  for(let c=0;c<cols;c++){
    const x = ((c+0.5)/cols)*W + ((c*37)%23) - 11;
    for(let y=-segH; y<hy+segH; y+=segH){
      const y0 = y + fall + ((c*53)%segH);
      g.beginPath();
      g.moveTo(x, y0);
      g.lineTo(x - slant, y0 + segH*0.62);
      g.stroke();
    }
  }
}

/* ---- LIGHTNING: a jagged bolt cracking from the cloud ceiling down toward the
   sea, offset from the eye. Bright core (light) with a hard dark contour and a
   short forked branch. Flickers over t but never fully vanishes in preview. ---- */
function drawLightning(pen,g,W,H,t,inten,boltMul){
  const flick = 0.55 + 0.45*Math.abs(Math.sin(t*3.3));   // 0.55..1
  const on = clamp(boltMul,0,1.5) * flick;
  if (on < 0.18) return;
  const x0 = W*0.70, y0 = H*0.15;
  // deterministic jagged descent, stopping just above the crests
  const pts = [[x0,y0]];
  let x=x0, y=y0; const steps=6;
  const jags=[-0.055,0.065,-0.05,0.06,-0.045,0.05];
  const endY = H*(params.horizon-0.02);
  for(let i=0;i<steps;i++){
    y += (endY - y0)/steps;
    x += W*jags[i];
    pts.push([x,y]);
  }
  const lw = lerp(6, 12, clamp01(on)) * (0.8+0.3*clamp(inten,0,1.3));
  // solid bold bolt (dark against the light sky)
  g.strokeStyle = INK; g.lineWidth = lw; g.lineCap="round"; g.lineJoin="round";
  g.beginPath(); g.moveTo(pts[0][0],pts[0][1]);
  for(const p of pts) g.lineTo(p[0],p[1]); g.stroke();
  // a fork branch off the middle
  const mid = pts[3];
  const fork = [mid, [mid[0]+W*0.075, mid[1]+H*0.06], [mid[0]+W*0.03, mid[1]+H*0.12]];
  g.lineWidth = lw*0.7;
  g.beginPath(); g.moveTo(fork[0][0],fork[0][1]);
  for(const p of fork) g.lineTo(p[0],p[1]); g.stroke();
  // a thin bright center vein for electric charge
  g.strokeStyle = inkLevel(1); g.lineWidth = Math.max(1.5, lw*0.24);
  g.beginPath(); g.moveTo(pts[0][0],pts[0][1]);
  for(const p of pts) g.lineTo(p[0],p[1]); g.stroke();
}

/* ---- SEA + towering WAVE crests along the foreground. Dark water body under a
   stack of big scalloped crests whose curling tops rise with intensity + heave
   over t. Bright crest lips (read as spray) with hard contour. ---- */
function drawWaves(pen,g,W,H,t,inten){
  const hy = H*params.horizon;
  const strength = clamp(inten,0,1.6);
  // water body (mid) + darker seam at the waterline
  g.fillStyle = inkLevel(3); g.fillRect(0,hy,W,H-hy);
  g.fillStyle = inkLevel(4); g.fillRect(0,hy,W,H*0.03);
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 4);

  const n = params.waveCount;
  const dir = 1;                                          // crests lean/break to the right
  for(let i=0;i<n;i++){
    const f = i/(n-1);                                   // 0 far/back .. 1 near/front
    const baseY = lerp(hy+H*0.05, H*0.98, f);
    const amp   = lerp(H*0.040, H*0.12, f) * (0.7+0.45*strength);
    const peaks = Math.round(lerp(5, 8, f));
    const phase = t*(0.7+0.5*f) + i*1.1;
    const lvl   = Math.round(lerp(2, 5, f));             // back light .. front mid-dark
    const bandH = lerp(H*0.05, H*0.12, f);               // bounded fill depth (no black slab)
    const step  = (W+40)/peaks;
    // angular breaking-crest silhouette: sharp leaning peaks, bounded band below
    const tips = [];
    g.beginPath();
    g.moveTo(-20, baseY);
    for(let b=0;b<=peaks;b++){
      const bx = -20 + b*step;
      const h  = amp*(0.5+0.5*Math.abs(Math.sin(b*1.7+phase)));
      const px = bx + dir*h*0.5;                          // peak leans forward (breaking)
      const py = baseY - h;
      tips.push([px,py,h]);
      g.lineTo(bx, baseY - h*0.15);                       // rise
      g.lineTo(px, py);                                   // sharp peak
      g.lineTo(bx + step*0.5, baseY - h*0.10);            // fall into trough
    }
    g.lineTo(W+20, baseY+bandH); g.lineTo(-20, baseY+bandH); g.closePath();
    g.fillStyle = inkLevel(lvl); g.fill();
    // hard contour along the crest line
    g.strokeStyle = INK; g.lineWidth = lerp(2.5,4.5,f); g.lineJoin="round"; g.lineCap="round";
    g.beginPath(); g.moveTo(-20, baseY);
    for(let b=0;b<=peaks;b++){
      const bx = -20 + b*step;
      const h  = amp*(0.5+0.5*Math.abs(Math.sin(b*1.7+phase)));
      g.lineTo(bx, baseY - h*0.15);
      g.lineTo(bx + dir*h*0.5, baseY - h);
      g.lineTo(bx + step*0.5, baseY - h*0.10);
    }
    g.stroke();
    // curling white spray-lip hooks on the tallest foreground peaks
    if (f>0.45){
      g.strokeStyle = inkLevel(1); g.lineWidth = lerp(2,3.5,f);
      for(const [px,py,h] of tips){
        if (h > amp*0.72){
          g.beginPath();
          g.moveTo(px, py);
          g.quadraticCurveTo(px+dir*h*0.5, py-h*0.15, px+dir*h*0.32, py+h*0.22);
          g.stroke();
        }
      }
    }
  }
}

/* ---- SOURCE: Poseidon at the convergence eye — a trident emblem where the four
   winds meet, with a ring of short radiating storm-strokes. Drawn dark, on top. ---- */
function drawSource(pen,g,W,H,t,inten){
  const ex = W*params.eyeX, ey = H*params.eyeY;
  const strength = clamp(inten,0,1.5);
  // radiating storm-strokes ringing the eye
  g.strokeStyle = inkLevel(4); g.lineWidth = 3; g.lineCap="round";
  const spokes = 12;
  for(let k=0;k<spokes;k++){
    const a = (k/spokes)*TAU + t*0.4;
    const r0 = W*0.055, r1 = r0 + W*0.03*(0.6+0.5*strength)*(0.7+0.3*Math.sin(t*2+k));
    g.beginPath();
    g.moveTo(ex+Math.cos(a)*r0, ey+Math.sin(a)*r0);
    g.lineTo(ex+Math.cos(a)*r1, ey+Math.sin(a)*r1);
    g.stroke();
  }
  // the trident: a dark shaft with three prongs, sized to the eye
  const sh = W*0.028;                 // scale unit
  pen.paint(()=>{ g.arc(ex,ey, W*0.052, 0, TAU); }, toneSolid(inkLevel(2)), 4);  // pale eye disc
  const tone = toneSolid(inkLevel(7));
  // shaft
  pen.limb(()=>{ g.moveTo(ex, ey+sh*2.6); g.lineTo(ex, ey-sh*0.4); }, tone, sh*0.5);
  // crossbar
  pen.limb(()=>{ g.moveTo(ex-sh*1.5, ey-sh*0.4); g.lineTo(ex+sh*1.5, ey-sh*0.4); }, tone, sh*0.42);
  // three prongs
  pen.limb(()=>{ g.moveTo(ex-sh*1.5, ey-sh*0.4); g.lineTo(ex-sh*1.5, ey-sh*2.4); }, tone, sh*0.42);
  pen.limb(()=>{ g.moveTo(ex,        ey-sh*0.4); g.lineTo(ex,        ey-sh*2.9); }, tone, sh*0.42);
  pen.limb(()=>{ g.moveTo(ex+sh*1.5, ey-sh*0.4); g.lineTo(ex+sh*1.5, ey-sh*2.4); }, tone, sh*0.42);
  // barbed prong tips
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
  for(const px of [ex-sh*1.5, ex, ex+sh*1.5]){
    const ty = px===ex ? ey-sh*2.9 : ey-sh*2.4;
    g.beginPath(); g.moveTo(px-sh*0.5, ty+sh*0.5); g.lineTo(px, ty); g.lineTo(px+sh*0.5, ty+sh*0.5); g.stroke();
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const boltMul = st.bolt ?? params.bolt;
  const layers = st.layers || ["sky","clouds","waves","rain","winds","lightning","source"];
  const has = l => layers.includes(l);

  if (has("sky"))       drawSky(pen,g,W,H);
  if (has("clouds"))    drawClouds(pen,g,W,H,t,inten);
  if (has("waves"))     drawWaves(pen,g,W,H,t,inten);
  if (has("rain"))      drawRain(pen,g,W,H,t,inten);
  if (has("winds"))     drawWinds(pen,g,W,H,t,inten);
  if (has("lightning")) drawLightning(pen,g,W,H,t,inten,boltMul);
  if (has("source"))    drawSource(pen,g,W,H,t,inten);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"environment.four-wind-storm",
  type:"ENVIRONMENT",
  name:"Four-wind storm",
  statusWord:"CONVERGING",
  scene:"OD-B05-S05",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["sky","clouds","waves","rain","winds","lightning","source"],
  // normalized 0..1 field anchors: source eye, four wind directions, sea region
  anchors:{
    "source:poseidon":{ x:0.50, y:0.44 },   // convergence eye where the four winds meet
    "wind:north":{      x:0.50, y:0.05 },
    "wind:south":{      x:0.50, y:0.90 },
    "wind:west":{       x:0.04, y:0.42 },
    "wind:east":{       x:0.96, y:0.46 },
    "cloud:ceiling":{   x:0.50, y:0.11 },
    "strike:bolt":{     x:0.63, y:0.12 },
    "sea:crests":{      x:0.50, y:0.82 },
    "camera:wide":{     x:0.50, y:0.50 },
  },
  // affected regions (airspace the winds churn, sea they heave)
  zones:{
    air:{  x0:0.00, y0:0.00, x1:1.0, y1:0.60 },
    sea:{  x0:0.00, y0:0.60, x1:1.0, y1:1.0 },
    eye:{  x0:0.40, y0:0.34, x1:0.60, y1:0.54 },
  },
  // ENVIRONMENT state machine: winds gather -> converge -> full tempest -> abate
  states:{
    initial:"tempest",
    nodes:{
      // gathering: winds begin to reach inward, clouds massing, sea rising
      gathering:{ preview:{ t:0.6, intensity:0.40, bolt:0.2, status:"GATHERING", progress:0.14 } },
      // converging: the four winds close on the eye, rain sweeps in, first strikes
      converging:{ preview:{ t:1.5, intensity:0.85, bolt:0.7, status:"CONVERGING", progress:0.50 } },
      // tempest: full four-wind storm — arrows driven, bolt cracking, crests towering
      tempest:{ preview:{ t:2.6, intensity:1.45, bolt:1.2, status:"TEMPEST", progress:0.88 } },
    },
    edges:[["gathering","converging"],["converging","tempest"],["tempest","converging"],["converging","gathering"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","bolt","direction"],

  // neutral preview: the full four-wind tempest — converging clouds, four inward
  // arrows, driven rain, a bolt cracking down, towering crests, Poseidon's trident
  // at the convergence eye (reads unmistakably as the four-wind storm).
  preview:()=>({ t:2.4, intensity:1.35, bolt:1.1, status:"CONVERGING", progress:0.80,
                 layers:["sky","clouds","waves","rain","winds","lightning","source"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
