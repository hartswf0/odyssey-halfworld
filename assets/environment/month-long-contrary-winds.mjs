/* environment.month-long-contrary-winds — a persistent offshore storm that pens a
   crew ashore for a whole month. ENVIRONMENT asset (procedural world force).
   Scene function (OD-B12-S05): a beached ship cannot launch because the winds
   blow relentlessly ONSHORE while the food stores visibly dwindle day by day.

   The field is a dense curtain of onshore-driving wind arrows over a choppy sea,
   barring the crescent hull hauled up on the shingle. Beside the ship stands the
   PROVISION JAR — a measured food-store marker whose fill sinks as the month wears
   on (a ghost line marks the day-one level, the gap between it and the sinking
   grain-line reads as what has been eaten), flanked by a row of ration sacks that
   empty out one by one.

   Procedural force: DIRECTION (onshore, opposing launch) + INTENSITY (arrow
   density/length/darkness, sea chop, spray) + DURATION via PHASE (0..1 through the
   month) which drains the jar and spends the sacks. States over t: arrows gust,
   crests heave, spray flickers.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine
   POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);

const params = {
  skyBottom: 0.22,   // sky/sea boundary as frac of H
  waterline: 0.60,   // sea/beach shoreline as frac of H
  windCols:  6,      // columns of onshore arrows across the field
  windRows:  4,      // rows of onshore arrows down the field
  windLean:  0.20,   // horizontal lean of the onshore push (frac of arrow length)
  shipX:     0.40,   // beached hull centre x as frac of W
  storeX:    0.80,   // provision-jar centre x as frac of W
  sackN:     5,      // ration sacks flanking the jar
  intensity: 1.0,    // master field strength (channel-driven)
  phase:     0.6,    // 0..1 through the month (drains stores; channel-driven)
};

/* ---- one bowed wind-arrow from (fx,fy) toward (hx,hy) with a chevron head at the
   tip. lvl sets darkness (presence), lw the weight, ah the head size, bow the curl. */
function windArrow(g, fx,fy, hx,hy, lvl, lw, ah, bow){
  const dx = hx-fx, dy = hy-fy, len = Math.hypot(dx,dy)||1;
  const ux = dx/len, uy = dy/len;          // unit toward head
  const nx = -uy, ny = ux;                 // normal
  const mx = (fx+hx)/2 + nx*bow, my = (fy+hy)/2 + ny*bow;
  g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle = inkLevel(lvl); g.lineWidth = lw;
  g.beginPath(); g.moveTo(fx,fy); g.quadraticCurveTo(mx,my, hx,hy); g.stroke();
  // chevron arrowhead opening back away from travel
  g.beginPath();
  g.moveTo(hx - ux*ah - nx*ah*0.60, hy - uy*ah - ny*ah*0.60);
  g.lineTo(hx, hy);
  g.lineTo(hx - ux*ah + nx*ah*0.60, hy - uy*ah + ny*ah*0.60);
  g.stroke();
}

/* ---- SKY: a heavy offshore storm ceiling pressing down over the water (kept mid
   so the dark arrow curtain reads against it; a darker band massed along the top). */
function drawSky(pen,g,W,H){
  const sb = H*params.skyBottom;
  g.fillStyle = inkLevel(2); g.fillRect(0,0,W,sb);
  g.fillStyle = inkLevel(3); g.fillRect(0,0,W,H*0.06);
  // a run of low storm-cloud lobes hanging high in the sky (clear of the water)
  const tone = toneSolid(inkLevel(3));
  for(let i=0;i<5;i++){
    pen.paint(()=>{ g.ellipse(W*(0.12+i*0.20), sb*0.66, W*0.13, H*0.032, 0,0,TAU); }, tone, 4);
  }
}

/* ---- SEA: choppy water body between the sky and the shoreline. Mid tone with a
   darker seam at the waterline and short angular whitecap chevrons that heave over
   t, denser/sharper with intensity. ---- */
function drawSea(pen,g,W,H,t,inten){
  const sb = H*params.skyBottom, wl = H*params.waterline;
  g.fillStyle = inkLevel(3); g.fillRect(0,sb,W,wl-sb);
  g.fillStyle = inkLevel(4); g.fillRect(0,wl-H*0.02,W,H*0.02);
  const strength = clamp(inten,0.4,1.6);
  // whitecaps: bright angular hooks scattered across the water surface
  g.lineCap="round"; g.lineJoin="round";
  const rows = 5, cols = 9;
  for(let r=0;r<rows;r++){
    const y = lerp(sb+H*0.06, wl-H*0.02, r/(rows-1));
    const amp = lerp(H*0.010, H*0.026, r/(rows-1))*strength;
    for(let c=0;c<cols;c++){
      const x = ((c+0.5)/cols)*W + ((r*29+c*17)%19) - 9;
      const ph = t*1.3 + r*0.7 + c*1.1;
      const h = amp*(0.5+0.5*Math.sin(ph));
      g.strokeStyle = inkLevel(1); g.lineWidth = lerp(1.6,3,r/(rows-1));
      g.beginPath();
      g.moveTo(x-amp*0.9, y+h*0.3);
      g.lineTo(x,        y-h);
      g.lineTo(x+amp*0.9, y+h*0.3);
      g.stroke();
      // a short dark trough tick under the crest for chop
      g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(1.4, lerp(1.4,2.4,r/(rows-1)));
      g.beginPath(); g.moveTo(x-amp*0.6, y+h*0.5); g.lineTo(x+amp*0.6, y+h*0.5); g.stroke();
    }
  }
  // clean shoreline contour
  pen.ink(()=>{ g.moveTo(0,wl); g.lineTo(W,wl); }, 3);
}

/* ---- WINDS: the dense ONSHORE curtain — a grid of arrows driving down off the sea
   toward the shore (opposing any launch). Density/length/darkness scale with
   intensity; the whole field gusts on t. A few long emphatic arrows press straight
   at the beached hull. ---- */
function drawWinds(g,W,H,t,inten){
  const strength = clamp(inten,0.4,1.6);
  const cols = params.windCols, rows = params.windRows;
  const y0 = H*0.05, y1 = H*(params.waterline+0.02);      // reach just onto the shore
  const len = lerp(H*0.10, H*0.15, clamp01((strength-0.4)/1.2));
  const lean = params.windLean*len;
  const lw  = lerp(4, 8, clamp01((strength-0.4)/1.2));
  const ah  = lerp(11, 20, clamp01((strength-0.4)/1.2));
  const gust = Math.sin(t*1.7)*H*0.012;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const stagger = (r%2)*(0.5/cols);
      const x = ((c+0.5)/cols + stagger)*W - (stagger*W);
      const fx = ((c+0.5)/cols)*W + (r%2?W*0.5/cols:0);
      const baseY = lerp(y0, y1-len, r/(rows-1)) + gust*Math.sin(c*1.3+r);
      const hy = baseY + len;
      const hx = fx + lean;                                 // onshore lean
      const depth = r/(rows-1);                             // 0 far/top .. 1 near/shore
      const lvl = Math.round(lerp(3.4, 6.6, depth)*clamp(strength,0.5,1.3));
      const bow = len*0.16*Math.sin(c*1.7+r*0.9);
      windArrow(g, fx,baseY, hx,hy, clamp(lvl,3,7), lw*(0.8+0.35*depth), ah*(0.85+0.3*depth), bow);
    }
  }
  // two emphatic gusts bearing straight down onto the hull
  const sx = W*params.shipX;
  for(const dx of [-W*0.06, W*0.05]){
    windArrow(g, sx+dx, H*0.30, sx+dx+lean*1.3, H*(params.waterline-0.02), 7, lw+2, ah+4, len*0.10);
  }
}

/* ---- BEACH: the shingle foreground the ship is hauled onto (light so it reads as
   ground); a scalloped foam line where the chop meets the sand. ---- */
function drawBeach(pen,g,W,H,t){
  const wl = H*params.waterline;
  g.fillStyle = inkLevel(2); g.fillRect(0,wl,W,H-wl);
  // foam hooks along the shoreline
  g.strokeStyle = inkLevel(1); g.lineWidth = 2.4; g.lineCap="round";
  const n = 14;
  for(let i=0;i<n;i++){
    const x = ((i+0.5)/n)*W;
    const y = wl + H*0.012*Math.sin(i*1.7+t);
    g.beginPath();
    g.moveTo(x-W*0.02, y); g.quadraticCurveTo(x, y+H*0.014, x+W*0.02, y);
    g.stroke();
  }
  // faint band of darker wet sand just below the waterline
  g.fillStyle = inkLevel(3); g.globalAlpha = 0.5; g.fillRect(0,wl,W,H*0.025); g.globalAlpha = 1;
}

/* ---- SHIP: the beached crescent hull hauled up on the shingle, prow to the sea,
   mast raised with the sail FURLED (it cannot sail). Dark hull, hard contour. ---- */
function drawShip(pen,g,W,H,t){
  const cx = W*params.shipX, by = H*(params.waterline+0.14);
  const hw = W*0.20, hh = H*0.055;
  g.save();
  g.translate(cx,by); g.rotate(-0.06);                    // tilted, resting on the beach
  const hull = toneSolid(inkLevel(5));
  // hull crescent: curved keel underside, sheer line on top
  pen.paint(()=>{
    g.moveTo(-hw, -hh*0.2);
    g.quadraticCurveTo(-hw*1.05, hh*0.9, 0, hh*1.15);      // down to the keel
    g.quadraticCurveTo(hw*1.05, hh*0.9, hw, -hh*0.2);      // up to the prow
    g.quadraticCurveTo(hw*0.55, -hh*0.7, 0, -hh*0.55);     // sheer line back
    g.quadraticCurveTo(-hw*0.55, -hh*0.7, -hw, -hh*0.2);
    g.closePath();
  }, hull, 5);
  // open deck well: a lighter interior so the crescent reads as a boat, not a blob
  pen.paint(()=>{ g.ellipse(0, -hh*0.20, hw*0.82, hh*0.40, 0, 0, TAU); }, toneSolid(inkLevel(2)), 4);
  // a lighter strake line along the hull belly
  pen.ink(()=>{ g.moveTo(-hw*0.86,hh*0.12); g.quadraticCurveTo(0,hh*0.66,hw*0.86,hh*0.12); }, 3);
  // upswept prow post at the seaward end
  pen.paint(()=>{ g.moveTo(hw*0.9,-hh*0.2); g.quadraticCurveTo(hw*1.25,-hh*1.5,hw*1.02,-hh*1.6);
                  g.quadraticCurveTo(hw*0.98,-hh*0.9,hw*0.78,-hh*0.35); g.closePath(); }, hull, 4);
  // mast + furled sail bundle (raised but bound — no launch)
  const mx = -hw*0.05, deckY = -hh*0.35, mastTop = deckY - H*0.20;
  pen.limb(()=>{ g.moveTo(mx,deckY); g.lineTo(mx,mastTop); }, toneSolid(inkLevel(6)), 6);
  // yard with the furled sail lashed to it (a fat bound bundle so it reads)
  pen.limb(()=>{ g.moveTo(mx-hw*0.46, mastTop+H*0.015); g.lineTo(mx+hw*0.46, mastTop+H*0.015); }, toneSolid(inkLevel(6)), 5);
  pen.paint(()=>{ g.ellipse(mx, mastTop+H*0.030, hw*0.46, H*0.024, 0, 0, TAU); }, toneSolid(inkLevel(3)), 5);
  // lashing ties across the furled sail
  g.strokeStyle = INK; g.lineWidth = 2.4; g.lineCap="round";
  for(let i=-2;i<=2;i++){ const lx = mx + i*hw*0.18; g.beginPath(); g.moveTo(lx, mastTop+H*0.006); g.lineTo(lx, mastTop+H*0.052); g.stroke(); }
  g.restore();
  // beached shadow / chock stones under the keel
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, by+hh*1.1, hw*1.05, hh*0.4, 0, 0, TAU); g.fill();
}

/* ---- PROVISIONS: the dwindling food-store marker. A tall amphora (grain jar) on a
   plinth, its grain FILL sinking with `phase`; a dashed GHOST line marks the day-one
   level so the emptied gap above the grain reads as consumed. Weekly ticks run down
   the side; a row of ration sacks at the base is spent one by one. ---- */
function drawProvisions(pen,g,W,H,phase){
  const remaining = clamp01(1-phase);
  const cx = W*params.storeX, by = H*(params.waterline+0.20);
  const jw = W*0.085, jh = H*0.20;
  const top = by - jh, bot = by;

  // plinth
  pen.paint(()=>{ g.rect(cx-jw*1.05, bot, jw*2.1, H*0.020); }, toneSolid(inkLevel(4)), 4);

  // amphora body outline (empty jar, light interior)
  const body = ()=>{
    g.moveTo(cx-jw*0.55, top+jh*0.10);
    g.quadraticCurveTo(cx-jw, top+jh*0.42, cx-jw*0.72, top+jh*0.78);
    g.quadraticCurveTo(cx-jw*0.5, bot, cx, bot);            // taper to a rounded base
    g.quadraticCurveTo(cx+jw*0.5, bot, cx+jw*0.72, top+jh*0.78);
    g.quadraticCurveTo(cx+jw, top+jh*0.42, cx+jw*0.55, top+jh*0.10);
    g.closePath();
  };
  pen.paint(body, toneSolid(inkLevel(1)), 5);

  // grain FILL clipped to the jar body, rising to `remaining`
  const fillTop = lerp(bot, top+jh*0.12, remaining);
  g.save();
  g.beginPath(); body(); g.clip();
  g.fillStyle = inkLevel(5); g.fillRect(cx-jw*1.2, fillTop, jw*2.4, bot-fillTop);
  // a heaped grain surface line
  g.strokeStyle = INK; g.lineWidth = 2.4; g.lineCap="round";
  g.beginPath(); g.moveTo(cx-jw, fillTop); g.quadraticCurveTo(cx, fillTop-H*0.010, cx+jw, fillTop); g.stroke();
  g.restore();

  // GHOST day-one fill line (dashed) high on the jar — the gap = eaten
  g.strokeStyle = ACCENT; g.lineWidth = 2; g.setLineDash([6,5]);
  const fullY = lerp(bot, top+jh*0.12, 1);
  g.beginPath(); g.moveTo(cx-jw*0.95, fullY); g.lineTo(cx+jw*0.95, fullY); g.stroke();
  g.setLineDash([]);

  // neck + rim + handles
  pen.paint(()=>{ g.rect(cx-jw*0.36, top-jh*0.06, jw*0.72, jh*0.18); }, toneSolid(inkLevel(3)), 4);
  pen.paint(()=>{ g.ellipse(cx, top-jh*0.06, jw*0.44, jh*0.045, 0, 0, TAU); }, toneSolid(inkLevel(2)), 4);
  g.strokeStyle = INK; g.lineWidth = 4; g.lineCap="round";
  g.beginPath(); g.moveTo(cx-jw*0.36, top); g.quadraticCurveTo(cx-jw*0.72, top+jh*0.02, cx-jw*0.52, top+jh*0.16); g.stroke();
  g.beginPath(); g.moveTo(cx+jw*0.36, top); g.quadraticCurveTo(cx+jw*0.72, top+jh*0.02, cx+jw*0.52, top+jh*0.16); g.stroke();

  // weekly level ticks down the right flank
  g.strokeStyle = inkLevel(6); g.lineWidth = 2;
  for(let w=1;w<=4;w++){
    const ty = lerp(top+jh*0.12, bot, w/4);
    g.beginPath(); g.moveTo(cx+jw*0.78, ty); g.lineTo(cx+jw*0.98, ty); g.stroke();
  }

  // ration SACKS at the base — spent one by one as the month wears on
  const N = params.sackN, filled = Math.round(remaining*N);
  const sw = W*0.036, sh = H*0.032, gap = W*0.008;
  const rowW = N*sw + (N-1)*gap;
  const sx0 = cx - rowW/2 + sw/2;
  const sy = by + H*0.055;
  for(let i=0;i<N;i++){
    const x = sx0 + i*(sw+gap);
    const spent = i>=filled;
    const sack = ()=>{
      g.moveTo(x-sw*0.5, sy);
      g.quadraticCurveTo(x-sw*0.6, sy-sh*0.9, x-sw*0.22, sy-sh);
      g.lineTo(x+sw*0.22, sy-sh);
      g.quadraticCurveTo(x+sw*0.6, sy-sh*0.9, x+sw*0.5, sy);
      g.closePath();
    };
    if (spent){
      // slumped, emptied sack: light with a hard contour only
      pen.paint(sack, toneSolid(inkLevel(1)), 3);
    } else {
      pen.paint(sack, toneSolid(inkLevel(5)), 4);
      // tied neck
      g.strokeStyle = INK; g.lineWidth = 2; g.beginPath();
      g.moveTo(x-sw*0.22, sy-sh); g.lineTo(x+sw*0.22, sy-sh); g.stroke();
    }
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const phase = clamp01(st.phase ?? params.phase);
  const layers = st.layers || ["sky","sea","winds","beach","ship","provisions"];
  const has = l => layers.includes(l);

  if (has("sky"))        drawSky(pen,g,W,H);
  if (has("sea"))        drawSea(pen,g,W,H,t,inten);
  if (has("winds"))      drawWinds(g,W,H,t,inten);
  if (has("beach"))      drawBeach(pen,g,W,H,t);
  if (has("ship"))       drawShip(pen,g,W,H,t);
  if (has("provisions")) drawProvisions(pen,g,W,H,phase);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"environment.month-long-contrary-winds",
  type:"ENVIRONMENT",
  name:"Month-long contrary winds",
  statusWord:"CONTRARY",
  scene:"OD-B12-S05",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["sky","sea","winds","beach","ship","provisions"],
  // normalized 0..1 field anchors: storm source, onshore push, blocked launch,
  // the beached hull, the shoreline, and the food-store marker
  anchors:{
    "storm:offshore":{ x:0.50, y:0.14 },   // the persistent storm massed out on the water
    "wind:onshore":{   x:0.50, y:0.42 },   // direction the field drives (toward shore)
    "launch:blocked":{ x:0.40, y:0.52 },   // the sea corridor the ship cannot cross
    "ship:beached":{   x:0.40, y:0.72 },
    "shore:waterline":{x:0.50, y:0.60 },
    "store:provisions":{x:0.80, y:0.72 },
    "camera:wide":{    x:0.50, y:0.50 },
  },
  // affected regions: the stormy sea vs the beach the crew is penned on
  zones:{
    sea:{    x0:0.00, y0:0.22, x1:1.00, y1:0.60 },
    beach:{  x0:0.00, y0:0.60, x1:1.00, y1:1.00 },
    launch:{ x0:0.22, y0:0.44, x1:0.60, y1:0.60 },
  },
  // ENVIRONMENT state machine: storm sets in -> wears on -> stores run desperate
  states:{
    initial:"wearing",
    nodes:{
      // onset: the contrary wind sets in, stores near full, sea rising
      onset:{    preview:{ t:0.5, intensity:1.00, phase:0.10, status:"HOLDING",  progress:0.10 } },
      // wearing: a fortnight gone, jar half sunk, sacks half spent
      wearing:{  preview:{ t:1.6, intensity:1.15, phase:0.52, status:"WEARING",  progress:0.52 } },
      // desperate: month nearly out, grain low, sacks nearly all slumped
      desperate:{preview:{ t:2.7, intensity:1.30, phase:0.88, status:"STARVING", progress:0.88 } },
    },
    edges:[["onset","wearing"],["wearing","desperate"],["desperate","wearing"],["wearing","onset"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","phase","direction"],

  // neutral preview: a fortnight into the siege — the onshore curtain driving hard
  // over a choppy sea onto the beached, furled ship, the provision jar sunk to about
  // half with the day-one ghost line above it and half the ration sacks slumped
  // (reads unmistakably as month-long contrary winds starving a stranded crew).
  preview:()=>({ t:1.6, intensity:1.18, phase:0.55, status:"CONTRARY", progress:0.55,
                 layers:["sky","sea","winds","beach","ship","provisions"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
