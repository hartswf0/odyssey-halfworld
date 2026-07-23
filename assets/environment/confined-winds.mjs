/* environment.confined-winds — multiple directional winds stored in one object,
   then loosed as a chaotic combined blast. ENVIRONMENT asset (procedural world
   force). Scene function (OD-B10-S01): the winds of Aeolus, sealed in a single
   vessel, are opened — the compressed compass-winds burst outward in every
   direction at once.

   The "one object" is a bounded CONTAINMENT vessel (a cinched pouch/knot ring)
   centered in the field. Two opposed wind systems play against `release`:
     · CONTAINED (release low): many arrows drive INWARD, compressed into the
       small zone, ringed by an intact boundary + a tight swirl core.
     · BURST (release high): the boundary breaks and the winds fire OUTWARD in
       all directions — chaotic, jittered, unequal — a combined blast star.

   Procedural: SOURCE (vessel center) -> DIRECTION (radial, per-arrow chaos) ->
   INTENSITY (arrow length/darkness, blast reach) -> RELEASE (contained<->burst)
   -> STATES over t (swirl breathes, blast pulses/flickers outward).

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  cx:        0.50,   // vessel / convergence center x as frac of W
  cy:        0.50,   // vessel / convergence center y as frac of H
  ringR:     0.185,  // containment radius as frac of min(W,H) span (uses W)
  spokes:    12,     // number of compass winds stored in the object
  intensity: 1.0,    // master field strength (channel-driven)
  release:   0.5,    // 0 = fully contained, 1 = fully burst blast
  chaos:     1.0,    // per-arrow angular/length scatter (the "combined" chaos)
};

/* ---- deterministic per-spoke scatter so the blast reads chaotic, not neat ---- */
function scatter(seed){ const r = rnd(seed); return { a:(r()-0.5), b:(r()-0.5), c:(r()-0.5), d:(r()-0.5) }; }

/* ---- SKY: the light airspace the winds fill (kept pale so dark arrows + the
   vessel read hard against it; a faint pressure vignette top + bottom). ---- */
function drawSky(pen,g,W,H){
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  g.fillStyle = inkLevel(2); g.fillRect(0,0,W,H*0.05);
  g.fillStyle = inkLevel(2); g.fillRect(0,H*0.95,W,H*0.05);
}

/* ---- one bowed wind-arrow from (fx,fy) to (hx,hy) with a chevron head at the
   tip. lvl sets darkness (presence), lw the weight, ah the head size. ---- */
function windArrow(g, fx,fy, hx,hy, lvl, lw, ah, bow){
  const dx = hx-fx, dy = hy-fy, len = Math.hypot(dx,dy)||1;
  const ux = dx/len, uy = dy/len;         // unit toward head
  const nx = -uy, ny = ux;                // normal
  const mx = (fx+hx)/2 + nx*bow, my = (fy+hy)/2 + ny*bow;
  g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lw;
  g.beginPath(); g.moveTo(fx,fy); g.quadraticCurveTo(mx,my, hx,hy); g.stroke();
  // chevron arrowhead opening back away from travel
  g.beginPath();
  g.moveTo(hx - ux*ah - nx*ah*0.62, hy - uy*ah - ny*ah*0.62);
  g.lineTo(hx, hy);
  g.lineTo(hx - ux*ah + nx*ah*0.62, hy - uy*ah + ny*ah*0.62);
  g.stroke();
}

/* ---- CONTAINED winds: compass arrows compressed INWARD into the small zone,
   ringing the boundary and pointing at the core. Present when release is low. ---- */
function drawContained(g,W,H,t,inten,presence){
  if (presence < 0.12) return;
  const cx = W*params.cx, cy = H*params.cy, R = W*params.ringR;
  const lvl = Math.round(lerp(1.5, 6, presence*clamp(inten,0.4,1.4)));
  const lw  = lerp(3, 8, presence);
  const ah  = lerp(9, 18, presence);
  const push = Math.sin(t*1.6)*R*0.06;                 // synchronized inward squeeze
  const n = params.spokes;
  for(let k=0;k<n;k++){
    const a = (k/n)*TAU;
    const ca = Math.cos(a), sa = Math.sin(a);
    const fx = cx + ca*R*0.98,          fy = cy + sa*R*0.98;      // tail at ring edge
    const hx = cx + ca*(R*0.28+push),   hy = cy + sa*(R*0.28+push);// head near core
    windArrow(g, fx,fy, hx,hy, lvl, lw, ah, R*0.10*Math.sin(a*2));
  }
}

/* ---- BURST winds: the loosed blast — arrows firing OUTWARD in all directions,
   chaotic in angle, length and bow (unequal winds combined). Present when
   release is high; reach + darkness pulse over t. ---- */
function drawBurst(g,W,H,t,inten,presence){
  if (presence < 0.12) return;
  const cx = W*params.cx, cy = H*params.cy, R = W*params.ringR;
  const chaos = params.chaos;
  const n = params.spokes;
  const pulse = 0.85 + 0.15*Math.sin(t*2.2);
  for(let k=0;k<n;k++){
    const s = scatter(k*131 + 7);
    const jit = s.a * 0.42 * chaos;                    // angular scatter
    const a = (k/n)*TAU + jit;
    const ca = Math.cos(a), sa = Math.sin(a);
    const reachF = (0.70 + 0.55*(s.b+0.5)) * pulse;    // unequal reach per wind
    const r0 = R*0.35;                                  // tails start inside the broken ring
    const rE = R + (W*0.36)*reachF*presence*clamp(inten,0.4,1.5);
    const fx = cx + ca*r0, fy = cy + sa*r0;
    const hx = cx + ca*rE, hy = cy + sa*rE;
    const lvl = Math.round(lerp(1.5, 7, presence*(0.55+0.45*(s.c+0.5))));
    const lw  = lerp(3, 9, presence*(0.5+0.5*(s.d+0.5)));
    const ah  = lerp(10, 24, presence)*(0.7+0.5*(s.b+0.5));
    const bow = R*0.55*s.a*chaos;                       // chaotic curl each way
    windArrow(g, fx,fy, hx,hy, lvl, lw, ah, bow);
  }
}

/* ---- the CONTAINMENT VESSEL (the one object): a bounded ring with a cinched
   knot at the top. Intact + dark when contained; broken into gapped arcs +
   flung outward when released. ---- */
function drawVessel(pen,g,W,H,t,release){
  const cx = W*params.cx, cy = H*params.cy, R = W*params.ringR;
  const intact = 1-clamp01(release);
  // boundary ring — solid arcs with a break-gap that widens as it releases
  const gap = lerp(0.05, 0.9, clamp01(release));       // radians of missing arc, x2
  const lvl = Math.round(lerp(2, 6, intact));
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lerp(4, 9, intact); g.lineCap="round";
  // two arcs leaving a top gap (the mouth of the pouch)
  g.beginPath(); g.arc(cx,cy, R, -Math.PI/2 + gap, Math.PI*1.5 - gap); g.stroke();
  // knot / cinch at the top of the vessel
  const ky = cy - R;
  const knotTone = toneSolid(inkLevel(Math.round(lerp(3,7,intact))));
  pen.paint(()=>{ g.ellipse(cx, ky, W*0.026, W*0.020, 0, 0, TAU); }, knotTone, lerp(3,5,intact));
  // when released, two frayed cord-ends flick up from the burst knot
  if (release > 0.3){
    g.strokeStyle = inkLevel(4); g.lineWidth = 4; g.lineCap="round";
    const fl = (release-0.3)*1.4;
    g.beginPath();
    g.moveTo(cx-W*0.02, ky); g.quadraticCurveTo(cx-W*0.06, ky-H*0.05*fl, cx-W*0.09, ky-H*0.02*fl);
    g.moveTo(cx+W*0.02, ky); g.quadraticCurveTo(cx+W*0.07, ky-H*0.06*fl, cx+W*0.05, ky-H*0.09*fl);
    g.stroke();
  }
}

/* ---- CORE: the pressure heart at the vessel center. Contained -> a tight dark
   compressed swirl; released -> a bright blown-open eye with a spiked star. ---- */
function drawCore(pen,g,W,H,t,release,inten){
  const cx = W*params.cx, cy = H*params.cy, R = W*params.ringR;
  const intact = 1-clamp01(release);
  // pale eye disc under everything at center
  pen.paint(()=>{ g.arc(cx,cy, R*0.30, 0, TAU); },
            toneSolid(inkLevel(Math.round(lerp(1, 4, intact)))), 3);
  if (intact > 0.25){
    // compressed swirl: a few tight spiral strokes wound into the core
    g.strokeStyle = inkLevel(Math.round(lerp(2,6,intact))); g.lineWidth = lerp(2,4,intact); g.lineCap="round";
    const arms = 3;
    for(let m=0;m<arms;m++){
      const a0 = (m/arms)*TAU + t*0.5;
      g.beginPath();
      let first=true;
      for(let s=0;s<=10;s++){
        const f = s/10;
        const rr = R*0.30*(1-f*0.85);
        const aa = a0 + f*2.4;
        const x = cx + Math.cos(aa)*rr, y = cy + Math.sin(aa)*rr;
        if(first){ g.moveTo(x,y); first=false; } else g.lineTo(x,y);
      }
      g.stroke();
    }
  }
  if (release > 0.35){
    // blast star: short bright spikes bursting from the opened core
    const on = clamp01((release-0.35)/0.65);
    g.strokeStyle = inkLevel(6); g.lineWidth = lerp(2,5,on); g.lineCap="round";
    const spikes = 8;
    for(let k=0;k<spikes;k++){
      const a = (k/spikes)*TAU + Math.PI/spikes;
      const r1 = R*0.34*(0.7+0.4*Math.sin(t*3+k));
      g.beginPath();
      g.moveTo(cx,cy);
      g.lineTo(cx+Math.cos(a)*r1*on, cy+Math.sin(a)*r1*on);
      g.stroke();
    }
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const release = clamp01(st.release ?? params.release);
  const layers = st.layers || ["sky","contained","vessel","burst","core"];
  const has = l => layers.includes(l);

  if (has("sky"))       drawSky(pen,g,W,H);
  if (has("contained")) drawContained(g,W,H,t,inten, 1-release);
  if (has("vessel"))    drawVessel(pen,g,W,H,t,release);
  if (has("burst"))     drawBurst(g,W,H,t,inten, release);
  if (has("core"))      drawCore(pen,g,W,H,t,release,inten);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"environment.confined-winds",
  type:"ENVIRONMENT",
  name:"Confined winds",
  statusWord:"UNLEASHED",
  scene:"OD-B10-S01",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["sky","contained","vessel","burst","core"],
  // normalized 0..1 field anchors: the vessel source + compass burst directions
  anchors:{
    "source:vessel":{ x:0.50, y:0.50 },   // the one object holding the winds
    "knot:mouth":{    x:0.50, y:0.345 },   // cinch/mouth of the pouch
    "burst:north":{   x:0.50, y:0.16 },
    "burst:east":{    x:0.84, y:0.50 },
    "burst:south":{   x:0.50, y:0.84 },
    "burst:west":{    x:0.16, y:0.50 },
    "burst:ne":{      x:0.74, y:0.26 },
    "burst:se":{      x:0.74, y:0.74 },
    "camera:wide":{   x:0.50, y:0.50 },
  },
  // affected regions: the small containment zone vs the full blast field
  zones:{
    containment:{ x0:0.34, y0:0.34, x1:0.66, y1:0.66 },
    blast:{       x0:0.00, y0:0.00, x1:1.00, y1:1.00 },
  },
  // ENVIRONMENT state machine: winds sealed -> vessel opened -> chaotic blast -> spent
  states:{
    initial:"burst",
    nodes:{
      // sealed: all winds compressed inward, ring intact, tight swirl core
      sealed:{ preview:{ t:0.4, intensity:1.0, release:0.06, status:"SEALED", progress:0.16 } },
      // opening: the knot gives, ring breaking, winds begin to fire out
      opening:{ preview:{ t:1.2, intensity:1.15, release:0.5, status:"OPENING", progress:0.5 } },
      // burst: the full chaotic combined blast in every direction
      burst:{ preview:{ t:2.0, intensity:1.4, release:0.95, status:"UNLEASHED", progress:0.9 } },
    },
    edges:[["sealed","opening"],["opening","burst"],["burst","opening"],["opening","sealed"]],
  },
  duration:5.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","release","chaos"],

  // neutral preview: the vessel caught at the break — ring torn open, remnant
  // winds still converging while the loosed blast fires outward in all directions
  // (reads unmistakably as confined winds released as one chaotic blast).
  preview:()=>({ t:1.6, intensity:1.3, release:0.6, status:"UNLEASHED", progress:0.78,
                 layers:["sky","contained","vessel","burst","core"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
