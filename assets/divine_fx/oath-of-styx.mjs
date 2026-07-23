/* divine_fx.oath-of-styx — the unbreakable oath by the waters of Styx, the one
   vow no god may take back. DIVINE_FX asset. Scene function (OD-B05-S03): the
   air itself GOES SOLEMN as the promise is spoken — the sky DARKENS from the
   heavens down (the environmental field). At the swearing, a heavy BOND GLYPH
   seals in the upper air: a great oath-ring holding two interlocked links (the
   binding). From it fall straight DOWNWARD OATH-LINES, plumb and knotted,
   binding the vow to the black river STYX below whose light-streaked waters
   witness it. Flanking BINDING-GESTURE arcs sweep down and in — the promise
   drawn shut. The visible consequence: an irreversible divine promise made.

   Procedural: FIELD (heavens darkening) -> SOURCE (the sealing bond-ring in the
   air) -> TRANSFORM (links pull tight, oath-lines descend, gesture closes) ->
   TARGET (the river Styx, the witness). Animates over state.t: the sky deepens,
   the two links draw together, the oath-lines lengthen toward the water, the
   knots tighten, the gesture arcs close. `intensity` scales the darkening, the
   descent of the oath-lines, and how tight the bond is drawn.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, smooth } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  horizon:   0.80,   // waterline of the Styx as frac of H (river fills below)
  ringCx:    0.50,   // oath bond-ring center x
  ringCy:    0.38,   // oath bond-ring center y
  ringR:     0.205,  // oath-ring outer radius as frac of W
  oathLines: 7,      // downward plumb oath-lines binding vow to the river
  ripples:   5,      // light flow-streaks on the black river
  bind:      1.0,    // how tightly the two links are drawn together (channel)
  intensity: 1.0,    // overall solemnity: darkening + descent + bond tightness
};

/* ---- FIELD: the heavens DARKEN. A vertical stack of bands from a deep dark at
   the top (the divine silence descending) easing to a lighter tone at the
   waterline, so the bond-ring and oath-lines read against it. Darkness scales
   with intensity — from a grey hush to a near-black solemn sky. ---- */
function drawDarkening(g,W,H,d){
  const hy = H*params.horizon;
  const topLvl = lerp(2.2, 4.8, clamp01(d/1.2));   // crown of sky (solemn, not a black blob)
  const botLvl = lerp(1.3, 2.6, clamp01(d/1.2));   // just over the water
  const bands = 18;
  for(let i=0;i<bands;i++){
    const f  = i/(bands-1);
    const y0 = hy*(i/bands), y1 = hy*((i+1)/bands);
    g.fillStyle = inkLevel(lerp(topLvl, botLvl, f));
    g.fillRect(0, y0, W, y1-y0+1.2);
  }
}

/* ---- TARGET: the river STYX. Black witnessing waters filling the foot of the
   frame, a hard darker seam at the shore, and slow LIGHT ripple-streaks carved
   into the black (paper-toned) that drift with t — the current that seals the
   vow no god unspeaks. ---- */
function drawStyx(pen,g,W,H,t,d){
  const hy = H*params.horizon;
  g.fillStyle = inkLevel(6); g.fillRect(0,hy,W,H-hy);            // black river body
  g.fillStyle = inkLevel(7); g.fillRect(0,hy,W,H*0.018);        // darker shore seam
  pen.ink(()=>{ g.moveTo(0,hy); g.lineTo(W,hy); }, 5);
  // light ripple-streaks (carve paper channels into the black water)
  g.strokeStyle = inkLevel(1); g.lineCap="round";
  const n = params.ripples;
  for(let r=0;r<n;r++){
    const f = (r+0.5)/n;
    const y = lerp(hy+H*0.03, H*0.985, f);
    const amp = lerp(3, 9, f);
    const step = lerp(64, 44, f);
    const drift = (t*22 + r*17) % step;
    g.lineWidth = lerp(2, 4, f);
    g.beginPath();
    for(let x=-step; x<W+step; x+=step){
      const cx = x + drift;
      g.moveTo(cx, y);
      g.quadraticCurveTo(cx+step*0.5, y - amp, cx+step, y);
    }
    g.stroke();
  }
}

/* ---- the DOWNWARD OATH-LINES: straight plumb lines dropping from beneath the
   bond-ring to the river — the vow bound to the witnessing water. Center lines
   are longest + heaviest; they thin at the margins. Each carries small binding
   KNOT ticks and ends in a downward arrowhead at the water (the vow driven
   down, irreversible). They lengthen with intensity (`reach`). ---- */
function drawOathLines(pen,g,W,H,t,d){
  const cx = W*params.ringCx, cy = H*params.ringCy, R = W*params.ringR;
  const hy = H*params.horizon;
  const n = params.oathLines;
  const spread = R*1.7;
  const reach = smooth(clamp01(d/1.15));                        // 0 short .. 1 to the water
  const y0base = cy + R*0.94;
  for(let i=0;i<n;i++){
    const f = (i/(n-1)) - 0.5;                                  // -0.5..0.5
    const x = cx + f*spread;
    const edge = 1 - Math.abs(f)*1.35;                          // center strongest
    const y0 = y0base + Math.abs(f)*R*0.28;                     // outer lines start lower
    const y1 = lerp(y0+H*0.05, hy-H*0.006, reach*(0.7+0.3*edge)) + Math.sin(t*1.3+i)*3;
    g.strokeStyle = inkLevel(3 + Math.round(edge*3.2));         // ~3..6
    g.lineWidth = lerp(2, 5.5, clamp01(edge));
    g.lineCap="round";
    g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke();
    // binding knot ticks along the line (short horizontal crossings)
    const knots = 3;
    for(let k=1;k<=knots;k++){
      const ky = lerp(y0, y1, k/(knots+1));
      const kw = lerp(3, 8, clamp01(edge)) * (0.7+0.3*Math.sin(t*2+k+i));
      g.beginPath(); g.moveTo(x-kw, ky); g.lineTo(x+kw, ky); g.stroke();
    }
    // downward arrowhead at the water — the vow driven home
    if (edge > 0.05 && y1 > y0 + 20){
      const ah = lerp(5, 11, clamp01(edge));
      g.beginPath();
      g.moveTo(x-ah, y1-ah*1.3); g.lineTo(x, y1); g.lineTo(x+ah, y1-ah*1.3);
      g.stroke();
    }
  }
}

/* ---- SOURCE / bond glyph: the great OATH-RING sealed in the air. A heavy dark
   annulus (dark ring body, light hole) framing two interlocked LINKS — a chain
   bond that draws tight with `bind`. The binding is the promise; the two links
   are the two parties held. A faint outer oath-circle frames the seal. ---- */
function drawRing(pen,g,W,H,t,d,bind){
  const cx = W*params.ringCx, cy = H*params.ringCy, R = W*params.ringR;
  const rIn = R*0.60;
  // faint outer oath-circle (the sworn boundary)
  pen.ink(()=>{ g.arc(cx,cy,R*1.16,0,TAU); }, 3);
  // ring body: dark annulus (fill outer disc dark, punch inner hole light)
  pen.paint(()=>{ g.arc(cx,cy,R,0,TAU); }, toneSolid(inkLevel(7)), 6);
  pen.paint(()=>{ g.arc(cx,cy,rIn,0,TAU); }, toneSolid(inkLevel(1)), 5);
  // twelve solemn oath-notches around the ring band
  g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
  for(let a=0;a<12;a++){
    const th = a/12*TAU;
    const r0 = rIn + (R-rIn)*0.24, r1 = R - (R-rIn)*0.12;
    g.beginPath();
    g.moveTo(cx+Math.cos(th)*r0, cy+Math.sin(th)*r0);
    g.lineTo(cx+Math.cos(th)*r1, cy+Math.sin(th)*r1);
    g.stroke();
  }
  // ---- the two interlocked LINKS inside the hole (the bond drawn tight) ----
  const tight = clamp01(bind) * (0.85 + 0.15*Math.sin(t*1.4));
  const lr = rIn*0.62;                                           // link long radius
  const lw = rIn*0.42;                                           // link short radius
  const off = lerp(lr*0.92, lr*0.44, tight);                    // links pull together
  g.strokeStyle = INK; g.lineCap="round"; g.lineJoin="round";
  g.lineWidth = Math.max(4, rIn*0.16);
  // left link
  g.beginPath(); g.ellipse(cx-off, cy, lw, lr, 0, 0, TAU); g.stroke();
  // right link
  g.beginPath(); g.ellipse(cx+off, cy, lw, lr, 0, 0, TAU); g.stroke();
  // a small binding knot where they cross
  pen.paint(()=>{ g.arc(cx, cy, rIn*0.14*(0.8+0.4*tight), 0, TAU); }, toneSolid(inkLevel(7)), 3);
}

/* ---- BINDING-GESTURE: two symmetric arcs sweeping DOWN and IN from the ring's
   sides toward the river — the promise drawn shut, the hands closing on the vow.
   They close (curl inward + reach lower) as the oath is sealed. ---- */
function drawGesture(pen,g,W,H,t,d){
  const cx = W*params.ringCx, cy = H*params.ringCy, R = W*params.ringR;
  const hy = H*params.horizon;
  const close = smooth(clamp01(d/1.15));
  g.strokeStyle = inkLevel(6); g.lineWidth = 5; g.lineCap="round"; g.lineJoin="round";
  for(const side of [-1, 1]){
    const sx = cx + side*R*1.16, sy = cy + R*0.18;
    const midx = cx + side*lerp(R*1.5, R*0.9, close);
    const midy = lerp(cy+R*1.1, hy-H*0.10, close);
    const endx = cx + side*lerp(R*0.9, R*0.30, close);
    const endy = lerp(cy+R*1.7, hy-H*0.02, close);
    g.beginPath();
    g.moveTo(sx, sy);
    g.quadraticCurveTo(midx, midy, endx, endy);
    g.stroke();
    // arrowhead at the inward-closing tip (down + inward)
    const ah = W*0.02;
    g.beginPath();
    g.moveTo(endx - side*ah*0.2, endy - ah*1.2);
    g.lineTo(endx, endy);
    g.lineTo(endx - side*ah*1.2, endy - ah*0.2);
    g.stroke();
  }
}

function drawFX(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const d = st.intensity ?? params.intensity;
  const bind = st.bind ?? params.bind;
  const layers = st.layers || ["dark","styx","oathlines","gesture","ring"];
  const has = l => layers.includes(l);

  if (has("dark"))     drawDarkening(g,W,H,d);
  if (has("styx"))     drawStyx(pen,g,W,H,t,d);
  if (has("oathlines"))drawOathLines(pen,g,W,H,t,d);
  if (has("gesture"))  drawGesture(pen,g,W,H,t,d);
  if (has("ring"))     drawRing(pen,g,W,H,t,d,bind);

  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"divine_fx.oath-of-styx",
  type:"DIVINE_FX",
  name:"Oath of Styx",
  statusWord:"SWORN",
  scene:"OD-B05-S03",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["dark","styx","oathlines","gesture","ring"],
  // normalized 0..1 source / field / transform / target / consequence anchors
  anchors:{
    "source:bond-ring":{ x:0.50, y:0.38 },   // the sealing oath-glyph in the air
    "field:heavens":{    x:0.50, y:0.14 },   // the darkening sky (solemn field)
    "seal:link-left":{   x:0.44, y:0.38 },   // party held (left link)
    "seal:link-right":{  x:0.56, y:0.38 },   // party held (right link)
    "oath:plumb":{       x:0.50, y:0.60 },   // the downward oath-lines
    "gesture:left":{     x:0.30, y:0.55 },   // binding gesture arc (left)
    "gesture:right":{    x:0.70, y:0.55 },   // binding gesture arc (right)
    "target:styx":{      x:0.50, y:0.90 },   // the river Styx, the witness
    "camera:wide":{      x:0.50, y:0.50 },
  },
  // affected regions: the darkening sky-field, and the river it is bound to
  zones:{
    heavens:{ x0:0.00, y0:0.00, x1:1.0, y1:0.62 },
    seal:{    x0:0.28, y0:0.18, x1:0.72, y1:0.58 },
    styx:{    x0:0.00, y0:0.80, x1:1.0, y1:1.0 },
  },
  // DIVINE_FX transformation states: the vow gathering -> binding -> sworn fast
  states:{
    initial:"sworn",
    nodes:{
      // gathering: sky begins to darken, ring faint, links slack, no descent yet
      gathering:{ preview:{ t:0.4, intensity:0.34, bind:0.30, status:"GATHERING", progress:0.14 } },
      // binding: the seal draws tight, oath-lines reach down, gesture closing
      binding:{   preview:{ t:1.5, intensity:0.82, bind:0.72, status:"BINDING",   progress:0.52 } },
      // sworn: full solemn dark, links locked, vow bound to the Styx (neutral)
      sworn:{     preview:{ t:2.6, intensity:1.30, bind:1.00, status:"SWORN",     progress:0.90 } },
    },
    edges:[["gathering","binding"],["binding","sworn"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","bind","darkness"],

  // neutral preview: the oath fully SWORN — heavens dark, the bond-ring sealed
  // with its two links locked tight, plumb oath-lines driven down into the black
  // river Styx, the binding gesture closed (reads as an irreversible promise).
  preview:()=>({ t:2.5, intensity:1.28, bind:1.0, status:"SWORN", progress:0.88,
                 layers:["dark","styx","oathlines","gesture","ring"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
