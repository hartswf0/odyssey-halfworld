/* environment.hut-fire — a steady low hearth fire inside a hut.
   ENVIRONMENT asset (procedural world force). Scene function (OD-B14-S03):
   a low, steady hearth fire burns at the centre of a round hut. It is the
   only LIGHT SOURCE — a warm radiant pool spills across the packed floor and
   up the low walls, catching the near faces of anyone seated at its rim
   (facial reveal), while the roof and the doorway threshold fall away into
   night. A cooking pot hangs on a tripod over the flames (cooking glow), and
   a thin wisp of smoke climbs to the smoke-hole at the roof apex.

   The FIRE is the SOURCE. INTENSITY drives everything downstream: flame
   height, the light-pool radius (how far the reveal reaches), ember glow,
   cooking glow, and smoke mass. States trace the hearth over an evening:
     low     — the neutral steady low flame
     flare   — a fed fire leaps up, the pool widens, faces brighten
     embers  — flames sink to glowing coals as the hut goes to night
   The `night` channel darkens the world beyond the pool for the night beat.

   Drawn in SOLID grays + hard black contour (engine primitives only); the
   engine POST pass supplies the dot-matrix halftone. Do NOT pre-dither. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

const params = {
  apexY:    0.11,   // roof apex / smoke-hole centre, frac of H
  wallTopY: 0.38,   // where the roof meets the wall top, frac of H
  floorY:   0.64,   // wall/floor seam, frac of H
  fireX:    0.50,   // hearth centre x, frac of W
  hearthY:  0.80,   // ember-bed / hearth base y, frac of H
  beams:    9,      // radial roof poles converging on the smoke-hole
  flameCount:5,     // tongues of flame
  sparks:   8,      // rising ember motes
  wallLvl:  4,      // dimness of the hut wall
  roofLvl:  3,      // roof: the lit underside of thatch, lighter than the wall
  nightLvl: 6,      // darkness of the doorway / world beyond
  intensity:0.55,   // master field strength (low..flare) — steady LOW default
  lightR:   0.9,    // light-pool radius multiplier (reveal reach)
  smoke:    0.7,    // smoke-wisp mass
  cook:     0.8,    // cooking glow under the pot
  night:    0.35,   // how far the world beyond the pool has gone to night
};

/* ---- HUT SHELL: the round hut the fire lives in. A dark night beyond the
   low doorway, a conical roof of radial poles converging on a smoke-hole at
   the apex, mid-dark walls, and a packed-earth floor. The fire will be the
   only thing that lifts this out of the dark. ---- */
function drawHut(pen,g,W,H,night){
  const cx = W*params.fireX;
  const apex = { x:cx, y:H*params.apexY };
  const wallTop = H*params.wallTopY;
  const fy = H*params.floorY;
  const wl = W*0.08, wr = W*0.92;                 // wall span
  const nb = clamp01(night);

  // world beyond (behind the shell) — pushed darker as night falls
  g.fillStyle = inkLevel(clamp(params.wallLvl-1 + Math.round(nb*2),1,7));
  g.fillRect(0,0,W,fy);

  // ---- ROOF: filled cone, then radial poles + ring rafters ----
  pen.paint(()=>{
    g.moveTo(apex.x, apex.y);
    g.lineTo(wr, wallTop);
    g.lineTo(wl, wallTop);
    g.closePath();
  }, toneSolid(inkLevel(params.roofLvl)), 5);
  // radial poles from the smoke-hole out to the eaves
  g.strokeStyle = inkLevel(clamp(params.roofLvl+2,1,7)); g.lineWidth = 3; g.lineCap="round";
  for(let i=0;i<params.beams;i++){
    const f = i/(params.beams-1);
    const ex = lerp(wl, wr, f), ey = wallTop;
    g.beginPath(); g.moveTo(apex.x, apex.y+H*0.02); g.lineTo(ex, ey); g.stroke();
  }
  // two ring rafters wrapping the cone
  g.strokeStyle = inkLevel(clamp(params.roofLvl+1,1,7)); g.lineWidth = 2.5;
  for(const rf of [0.42, 0.74]){
    g.beginPath();
    g.moveTo(lerp(apex.x, wl, rf), lerp(apex.y, wallTop, rf));
    g.quadraticCurveTo(cx, lerp(apex.y, wallTop, rf)+H*0.03, lerp(apex.x, wr, rf), lerp(apex.y, wallTop, rf));
    g.stroke();
  }
  // smoke-hole: a small dark opening at the apex (night sky / smoke escape)
  pen.paint(()=>{ g.ellipse(apex.x, apex.y+H*0.008, W*0.055, H*0.022, 0, 0, TAU); },
            toneSolid(inkLevel(clamp(params.nightLvl+Math.round(nb*1),1,7))), 4);

  // ---- WALLS: a low mid-dark band around the base of the cone ----
  pen.paint(()=>{ g.moveTo(wl,wallTop); g.lineTo(wr,wallTop); g.lineTo(wr,fy); g.lineTo(wl,fy); g.closePath(); },
            toneSolid(inkLevel(params.wallLvl)), 5);
  // a low doorway on the right, opening on the night (the night-transition threshold)
  const dw0 = W*0.72, dw1 = W*0.86, dTop = lerp(wallTop, fy, 0.30);
  pen.paint(()=>{ g.moveTo(dw0,fy); g.lineTo(dw0,dTop);
                  g.quadraticCurveTo((dw0+dw1)/2, dTop-H*0.03, dw1, dTop);
                  g.lineTo(dw1,fy); g.closePath(); },
            toneSolid(inkLevel(clamp(params.nightLvl+Math.round(nb*1),1,7))), 4);

  // ---- FLOOR: packed earth, a touch lighter so the pool reads on it ----
  g.fillStyle = inkLevel(clamp(params.wallLvl-1,1,7)); g.fillRect(0,fy,W,H-fy);
  pen.ink(()=>{ g.moveTo(0,fy); g.lineTo(W,fy); }, 4);
}

/* ---- LIGHT POOL: the fire's warm radiant field. Concentric ellipses centred
   on the hearth, painted largest(dim)->smallest(bright) so a contained glow
   gathers at the fire and washes UP the dark hut. Radius = how far the reveal
   reaches; scales with intensity*lightR. ---- */
function drawLightPool(pen,g,W,H,inten,lr){
  const cx = W*params.fireX, cy = H*(params.hearthY-0.05);
  const maxR = W*0.46 * (0.52+0.62*clamp(inten,0,1.4)) * clamp(lr,0.2,1.6);
  const rings = 7;
  for(let k=rings;k>=1;k--){
    const f = k/rings;                                   // 1 outer .. ~0 inner
    const r = maxR*f;
    const lvl = Math.round(lerp(1, params.wallLvl, f*f));
    g.fillStyle = inkLevel(lvl);
    g.beginPath(); g.ellipse(cx, cy, r, r*0.80, 0, 0, TAU); g.fill();
  }
  // the reveal rim — two soft bright patches at seated-head height on either
  // side, where the pool washes up and CATCHES nearby faces (facial reveal).
  const revY = H*0.70;
  g.fillStyle = inkLevel(2);
  for(const s of [-1,1]){
    g.beginPath();
    g.ellipse(cx + s*maxR*0.52, revY, maxR*0.16, maxR*0.22, 0, 0, TAU);
    g.fill();
  }
}

/* ---- CAST SHADOWS: hard dark wedges thrown from the hearth OUTWARD across the
   lit floor, away from the fire. Length + darkness grow with intensity (a
   brighter fire throws longer, sharper shadows across the hut floor). ---- */
function drawCastShadows(pen,g,W,H,inten){
  const cx = W*params.fireX, cy = H*(params.hearthY);
  const strength = clamp(inten,0,1.5);
  if (strength < 0.06) return;
  const len = lerp(W*0.14, W*0.42, clamp01(strength/1.3));
  const lvl = params.wallLvl + Math.round(clamp01(strength/1.3)*2); // ~4..6
  const spokes = [ -1.30, -0.95, 0.95, 1.30 ];
  g.fillStyle = inkLevel(clamp(lvl,1,7));
  for(const a of spokes){
    const dx = Math.sin(a), dy = Math.max(0.30, Math.cos(a)*0.50 + 0.55);
    const tipx = cx + dx*len, tipy = cy + dy*len;
    const wob = (0.04 + 0.03*Math.abs(dx)) * len;
    g.beginPath();
    g.moveTo(cx - dx*W*0.018, cy);
    g.lineTo(cx + dx*W*0.018, cy);
    g.lineTo(tipx + wob, tipy);
    g.lineTo(tipx - wob, tipy);
    g.closePath(); g.fill();
  }
}

/* ---- HEARTH: a low ring of stones cradling the ember bed. ---- */
function drawHearth(pen,g,W,H){
  const cx = W*params.fireX, by = H*params.hearthY;
  const rw = W*0.22, rh = H*0.045;
  const stones = 7;
  for(let i=0;i<stones;i++){
    const a = lerp(-0.12, Math.PI+0.12, i/(stones-1));
    const sx = cx - Math.cos(a)*rw;
    const sy = by + Math.sin(a)*rh*0.5 + rh*0.5;
    const s = W*0.030*(0.85+0.3*pr(i,7));
    const lvl = 4 + (i%2);
    pen.paint(()=>{ g.ellipse(sx, sy, s, s*0.78, 0, 0, TAU); }, toneSolid(inkLevel(lvl)), 4);
  }
}

/* ---- COOKING RIG: a low SPIT over the fire — two forked uprights planted at
   the sides of the hearth carry a horizontal bar, and a small pot hangs from
   the bar just above the flame tips (cooking glow). Kept thin + to the sides so
   the flames stay the bright centre; only the pot sits over the fire. ---- */
function drawCookingRig(pen,g,W,H,cook){
  const cx = W*params.fireX, by = H*params.hearthY;
  const barY = H*0.615;                                  // spit bar height
  const ux = W*0.185;                                    // upright offset from centre
  // two forked uprights (thin sticks) planted just outside the hearth
  for(const s of [-1,1]){
    const bx = cx + s*ux;
    pen.limb(()=>{ g.moveTo(bx, by+H*0.01); g.lineTo(bx, barY); }, toneSolid(inkLevel(5)), W*0.005);
    // the fork V at the top cradling the bar
    pen.ink(()=>{ g.moveTo(bx - W*0.018, barY - H*0.022); g.lineTo(bx, barY);
                  g.lineTo(bx + W*0.018, barY - H*0.022); }, 2.5);
  }
  // the horizontal spit bar
  pen.limb(()=>{ g.moveTo(cx-ux, barY); g.lineTo(cx+ux, barY); }, toneSolid(inkLevel(5)), W*0.004);
  // hanger down to the pot
  const potY = H*0.66, potR = W*0.052;
  g.strokeStyle = inkLevel(6); g.lineWidth = 2.5;
  g.beginPath(); g.moveTo(cx, barY); g.lineTo(cx, potY-potR*0.9); g.stroke();
  // bail handle
  pen.ink(()=>{ g.moveTo(cx-potR*0.85, potY-potR*0.30);
                g.quadraticCurveTo(cx, potY-potR*1.05, cx+potR*0.85, potY-potR*0.30); }, 3);
  // the pot: a small rounded cauldron with a rim
  pen.paint(()=>{
    g.moveTo(cx-potR, potY-potR*0.20);
    g.quadraticCurveTo(cx-potR*1.10, potY+potR*0.75, cx, potY+potR*0.88);
    g.quadraticCurveTo(cx+potR*1.10, potY+potR*0.75, cx+potR, potY-potR*0.20);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{ g.ellipse(cx, potY-potR*0.20, potR, potR*0.30, 0,0,TAU); }, toneSolid(inkLevel(5)), 3.5);
  // cooking glow: a warm crescent on the pot underside + curling steam
  const cg = clamp01(cook);
  if (cg > 0.05){
    g.fillStyle = inkLevel(Math.round(lerp(4,2,cg)));
    g.beginPath(); g.ellipse(cx, potY+potR*0.60, potR*0.66, potR*0.30, 0, 0, Math.PI); g.fill();
    g.strokeStyle = inkLevel(2); g.lineWidth = 2.5; g.lineCap="round";
    for(const s of [-1,1]){
      g.beginPath();
      g.moveTo(cx+s*potR*0.4, potY-potR*0.25);
      g.quadraticCurveTo(cx+s*potR*0.9, potY-potR*1.0, cx+s*potR*0.3, potY-potR*1.5);
      g.stroke();
    }
  }
}

/* ---- EMBER BED: glowing coals under the flames. Bright motes (near-paper)
   with hard dark contour so they read as live embers. Glow scales with intensity. */
function drawEmbers(pen,g,W,H,t,inten){
  const cx = W*params.fireX, by = H*params.hearthY;
  const strength = clamp(inten,0,1.4);
  const n = 10;
  for(let i=0;i<n;i++){
    const a = pr(i,3)*TAU;
    const rr = W*0.10*Math.sqrt(pr(i,4));
    const px = cx + Math.cos(a)*rr;
    const py = by - H*0.008 + Math.sin(a)*rr*0.30;
    const glow = 0.5 + 0.5*Math.sin(t*3 + i*1.3);
    const lvl = Math.round(lerp(4, 1, clamp01(0.35+strength)*(0.5+0.5*glow)));
    const r = W*0.011*(0.7+0.5*pr(i,6))*(0.7+0.5*strength);
    pen.paint(()=>{ g.ellipse(px,py,r,r*0.8,0,0,TAU); }, toneSolid(inkLevel(lvl)), 2.5);
  }
}

/* ---- one FLAME tongue: a pointed teardrop rising from a base, tip wobbling
   over t. Layered broad/dark(back) to slim/bright(core). ---- */
function flame(pen,g, bx,by, h, w, lvl, t, ph){
  const flick = Math.sin(t*4 + ph);
  const sway = flick*w*0.28;
  const tipx = bx + sway, tipy = by - h;
  const midy = by - h*0.50;
  pen.paint(()=>{
    g.moveTo(bx - w, by);
    g.quadraticCurveTo(bx - w*1.15, by - h*0.30, bx - w*0.62, midy);
    g.quadraticCurveTo(bx + sway*0.5 - w*0.30, by - h*0.78, tipx, tipy);
    g.quadraticCurveTo(bx + sway*0.5 + w*0.30, by - h*0.78, bx + w*0.62, midy);
    g.quadraticCurveTo(bx + w*1.15, by - h*0.30, bx + w, by);
    g.quadraticCurveTo(bx, by - h*0.12, bx - w, by);
    g.closePath();
  }, toneSolid(inkLevel(lvl)), 3.5);
}

/* ---- FLAMES: a cluster of tongues, tallest at the core, height scaling with
   intensity. A LOW steady fire by default — tongues stay short and full.
   FIRE IS THE LIGHT SOURCE: tongues are BRIGHT with a hard dark contour. ---- */
function drawFlames(pen,g,W,H,t,inten){
  const cx = W*params.fireX, by = H*(params.hearthY-0.02);
  const strength = clamp(inten,0,1.4);
  if (strength < 0.02) return;
  const baseH = H*0.24*strength;                         // steady, lower than a blaze
  const n = params.flameCount;
  // back layer — broad tongues, mid tone
  for(let i=0;i<n;i++){
    const f = (i/(n-1))*2-1;
    const x = cx + f*W*0.070;
    const h = baseH*(0.55 + 0.32*(1-Math.abs(f)));
    flame(pen,g, x, by, h, W*0.058*(1-0.18*Math.abs(f)), 3, t, i*1.7);
  }
  // mid layer — lighter
  for(let i=0;i<n-1;i++){
    const f = (i/(n-2))*2-1;
    const x = cx + f*W*0.046;
    const h = baseH*(0.80 + 0.22*(1-Math.abs(f)));
    flame(pen,g, x, by, h, W*0.044*(1-0.14*Math.abs(f)), 2, t*1.15, i*2.3+0.6);
  }
  // core — one tall near-paper tongue (the brightest note)
  flame(pen,g, cx, by, baseH*1.15, W*0.032, 1, t*1.3, 0.2);
}

/* ---- SPARKS: ember motes lifting off the flame, dwindling as they rise. ---- */
function drawSparks(pen,g,W,H,t,inten){
  const cx = W*params.fireX, by = H*(params.hearthY-0.02);
  const strength = clamp(inten,0,1.4);
  if (strength < 0.12) return;
  const n = params.sparks;
  const riseH = H*(0.22+0.14*strength);
  for(let i=0;i<n;i++){
    const ph = frac(t*0.22 + pr(i,8));
    const drift = Math.sin(ph*5 + i)*W*0.04;
    const x = cx + (pr(i,9)*2-1)*W*0.05 + drift*ph;
    const y = by - riseH*ph;
    const r = lerp(3.0, 0.8, ph)*(0.7+0.4*strength);
    g.fillStyle = inkLevel(Math.round(lerp(1,3,ph)));
    g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
  }
}

/* ---- SMOKE WISP: a thin serpentine ribbon rising off the flames toward the
   smoke-hole at the roof apex, thinning and lightening as it climbs. Mass
   scales with the smoke channel. ---- */
function drawSmoke(pen,g,W,H,t,smoke,inten){
  const cx = W*params.fireX, by = H*(params.hearthY - 0.16*clamp(inten,0.2,1.4));
  const mass = clamp(smoke,0,1.5);
  if (mass < 0.05) return;
  const topY = H*(params.apexY+0.03);                    // reaches the smoke-hole
  const steps = 26;
  // a thin ribbon that leans off to one side as it climbs (not a central column)
  const cxAt = f => cx + Math.sin(f*2.6 + t*0.7)*W*0.055*(0.2+f) + f*W*0.05;
  for(let s=0;s<=steps;s++){
    const f = s/steps;                                   // 0 base .. 1 top
    const y = lerp(by, topY, f);
    const x = cxAt(f);
    const r = W*(0.006 + 0.014*f) * mass;                // a thin wisp, not a plume
    // smoke is a soft MID gray (never bright) so it never reads as a light beam
    const lvl = Math.round(lerp(4, 2, f));
    g.fillStyle = inkLevel(lvl);
    g.beginPath(); g.ellipse(x, y, r, r*0.95, 0, 0, TAU); g.fill();
  }
}

function drawField(ctx,W,H,st){
  const pen = makePen(ctx,{outline:true});
  const g = ctx;
  const t     = st.t ?? 0;
  const inten = st.intensity ?? params.intensity;
  const lr    = st.lightR ?? params.lightR;
  const smoke = st.smoke ?? params.smoke;
  const cook  = st.cook ?? params.cook;
  const night = st.night ?? params.night;
  const layers = st.layers ||
    ["hut","light","shadows","hearth","cooking","embers","flames","sparks","smoke"];
  const has = l => layers.includes(l);

  if (has("hut"))     drawHut(pen,g,W,H,night);
  if (has("light"))   drawLightPool(pen,g,W,H,inten,lr);
  if (has("shadows")) drawCastShadows(pen,g,W,H,inten);
  if (has("hearth"))  drawHearth(pen,g,W,H);
  if (has("cooking")) drawCookingRig(pen,g,W,H,cook);
  if (has("embers"))  drawEmbers(pen,g,W,H,t,inten);
  if (has("flames"))  drawFlames(pen,g,W,H,t,inten);
  if (has("sparks"))  drawSparks(pen,g,W,H,t,inten);
  if (has("smoke"))   drawSmoke(pen,g,W,H,t,smoke,inten);
  return { anchors: asset.anchors, zones: asset.zones };
}

export const asset = {
  id:"environment.hut-fire",
  type:"ENVIRONMENT",
  name:"Hut fire",
  statusWord:"HEARTH",
  scene:"OD-B14-S03",

  params,
  // back -> front draw order the field honors; scene state may pass a subset
  layers:["hut","light","shadows","hearth","cooking","embers","flames","sparks","smoke"],
  // normalized 0..1 field anchors: the source, the reveal rim, pot, plume, hole
  anchors:{
    "source:flame":  { x:0.50, y:0.79 },   // the light node — flame core
    "bed:embers":    { x:0.50, y:0.82 },   // glowing coal bed
    "pot:cook":      { x:0.50, y:0.62 },   // hanging cooking pot
    "reveal:left":   { x:0.28, y:0.72 },   // near face-place the pool catches
    "reveal:right":  { x:0.72, y:0.72 },   // near face-place the pool catches
    "plume:smoke":   { x:0.50, y:0.20 },   // rising wisp
    "smokehole:apex":{ x:0.50, y:0.07 },   // roof opening the smoke escapes
    "threshold:door":{ x:0.79, y:0.58 },   // doorway to the night
    "camera:wide":   { x:0.50, y:0.50 },
  },
  // affected regions: the lit reveal pool vs. the dark hut vs. the night beyond
  zones:{
    lit:    { x0:0.16, y0:0.58, x1:0.84, y1:0.98 },
    reveal: { x0:0.22, y0:0.62, x1:0.78, y1:0.82 },
    dark:   { x0:0.00, y0:0.00, x1:1.00, y1:0.58 },
    hearth: { x0:0.36, y0:0.76, x1:0.64, y1:0.90 },
  },
  // ENVIRONMENT state machine: the hearth over an evening
  states:{
    initial:"low",
    nodes:{
      // low — the neutral steady low flame, faces just caught, pot cooking
      low:{ preview:{ t:1.4, intensity:0.55, lightR:0.9, smoke:0.7, cook:0.8, night:0.35,
                      status:"LOW", progress:0.45 } },
      // flare — the fire is fed and leaps; pool widens, faces brighten
      flare:{ preview:{ t:2.2, intensity:1.15, lightR:1.35, smoke:1.0, cook:1.0, night:0.20,
                        status:"FLARE", progress:0.72 } },
      // embers — flames sink to coals as the hut goes to night
      embers:{ preview:{ t:3.0, intensity:0.14, lightR:0.5, smoke:0.35, cook:0.25, night:0.85,
                         status:"EMBERS", progress:0.95 } },
    },
    edges:[["low","flare"],["flare","low"],["low","embers"],["embers","low"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","intensity","lightR","smoke","cook","night"],

  // neutral preview: the steady low hearth — short full tongues, a warm reveal
  // pool catching the near places, a pot cooking, a thin wisp to the smoke-hole.
  preview:()=>({ t:1.4, intensity:0.55, lightR:0.9, smoke:0.7, cook:0.8, night:0.35,
                 status:"LOW", progress:0.45,
                 layers:["hut","light","shadows","hearth","cooking","embers","flames","sparks","smoke"] }),
  draw(ctx,W,H,state){ return drawField(ctx,W,H,state||{}); },
};
export default asset;
