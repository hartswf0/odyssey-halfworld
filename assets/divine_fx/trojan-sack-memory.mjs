/* divine_fx.trojan-sack-memory — the fall of Troy surfacing behind a song.
   DIVINE_FX asset. Scene function (OD-B08-S05): as the bard Demodocus sings of
   the wooden horse, the sack of the city wells up as a FIELD of faint, layered,
   ghostly strata — the burning skyline far behind, the great WOODEN HORSE opening
   its belly-hatch with warriors descending on a rope, COMBAT silhouettes locked
   at the walls, and the bowed CAPTIVE-GRIEF figures at the near ground. Nothing
   is solid: each stratum is a low-tone silhouette that SURFACES and RECEDES on
   its own slow phase, so the recollection reads as superimposed, half-present.

   Procedural DIVINE_FX: SOURCE (Demodocus' song, a voice emitter at the base)
   -> FIELD (four receding strata: skyline / horse+descent / combat / captives)
   -> TRANSFORM (which stratum dominates, by state / t) -> visible CONSEQUENCE
   (silhouettes fade up and down, fire flickers, warriors slide down the rope,
   embers rise from the burning city into the field). Animate over state.t.
   Solid grays + contour into the offscreen ctx; the engine POST pass supplies
   the halftone (do NOT pre-dither). Ghost strata are LOW ink with thin tonal
   contour so they stay faint; only the song source carries a hard, crisp mark. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

const params = {
  horizon:   0.62,   // the city ground line (frac of H)
  skylineY:  0.62,   // burning skyline sits on the horizon
  horseY:    0.42,   // register of the wooden horse (dominant memory)
  combatY:   0.755,  // register of the wall combat (foreground ground)
  captiveY:  0.88,   // the near band of bowed captives
  towers:    7,      // buildings across the burning skyline
  warriors:  2,      // men descending the horse's rope
  combats:   2,      // duelling pairs at the base
  captives:  4,      // bowed grief silhouettes at the front
  embers:    18,     // sparks rising from the fire into the field
};

/* a ghost fill: flat gray body + a thin same-family contour so the silhouette
   holds an edge but stays faint under the halftone (never full-black INK). */
function ghost(g, pathFn, fillL, edgeL=fillL+2, lw=2){
  g.beginPath(); pathFn();
  g.fillStyle = inkLevel(clamp(fillL,1,7)); g.fill();
  g.strokeStyle = inkLevel(clamp(edgeL,1,7)); g.lineWidth = lw;
  g.lineJoin="round"; g.stroke();
}
/* surfacing tone: a memory stratum brightens & dims on its own slow phase so
   the whole field reads as recollection welling up and receding (layered). */
function surface(base, t, speed, phase, amp=1.3){
  return clamp(base + amp*Math.sin(t*speed + phase), 1, 6);
}

/* ---- FIELD: two faint receding grounds (sky-memory over city-memory) ---- */
function drawField(g,W,H){
  const hz = H*params.horizon;
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,hz);          // sky of memory
  g.fillStyle = inkLevel(2); g.fillRect(0,hz,W,H-hz);       // scorched ground
  g.strokeStyle = inkLevel(3); g.lineWidth = 2; g.beginPath();
  g.moveTo(0,hz); g.lineTo(W,hz); g.stroke();               // the ruled horizon
}

/* ---- a single FLAME: a wavering teardrop tongue rising from a rooftop ---- */
function flame(g,x,y,s,fillL,t,seed){
  const sway = Math.sin(t*3.4 + seed*2.1)*s*0.18;
  const tip  = 1.0 + 0.25*Math.sin(t*4.1 + seed);
  ghost(g, ()=>{
    g.moveTo(x-s*0.5, y);
    g.quadraticCurveTo(x-s*0.6+sway, y-s*1.1, x+sway*0.4, y-s*2.0*tip);
    g.quadraticCurveTo(x+s*0.6+sway, y-s*1.1, x+s*0.5, y);
    g.closePath();
  }, fillL, fillL+1, 1.3);
}

/* ---- SKYLINE register: the burning city — blocky towers along the horizon,
   battlemented tops, flames licking up and receding. Far / faint memory. ---- */
function drawSkyline(g,W,H,t){
  const hz = H*params.skylineY, n = params.towers;
  for(let i=0;i<n;i++){
    const x = lerp(W*0.06, W*0.94, i/(n-1));
    const bw = W*(0.070 + 0.030*pr(i,3));
    const bh = H*(0.070 + 0.075*pr(i,5));
    const base = 3;
    const fillL = Math.round(surface(base, t, 0.5, i*1.4, 0.9));
    // tower body
    ghost(g, ()=> g.rect(x-bw/2, hz-bh, bw, bh), fillL, fillL+2, 1.6);
    // battlemented crown
    const merl = 3;
    for(let m=0;m<merl;m++){
      const mx = x-bw/2 + bw*(m+0.15)/(merl-0.7);
      ghost(g, ()=> g.rect(mx, hz-bh-bh*0.10, bw*0.20, bh*0.12), fillL, fillL+2, 1.2);
    }
    // fire from the rooftops (odd towers burn hardest)
    if (i%2===0){
      const fs = bw*0.42;
      const fL = Math.round(surface(4, t, 0.9, i*1.7, 1.2));
      flame(g, x, hz-bh, fs, fL, t, i);
      flame(g, x-bw*0.22, hz-bh*0.9, fs*0.7, clamp(fL-1,2,5), t, i+3);
    }
  }
}

/* ---- deterministic geometry for the wooden horse (shared by body + descent) -- */
function horseGeom(W,H){
  const s  = H*0.105;                       // horse unit
  const gy = H*params.horizon;              // it stands on the horizon ground
  const cx = W*0.50;
  const cy = gy - s*1.95;                   // belly centre high above the legs
  const rx = s*1.90, ry = s*0.80;           // a long barrel, not a bulb
  return { s, gy, cx, cy, rx, ry,
           hatchX: cx - s*0.30, hatchY: cy + ry*0.55 };
}

/* ---- the WOODEN HORSE: dominant memory. Blocky planked body on wheels, four
   pillar legs, arched neck + squared head, and an OPEN belly-hatch flap. ---- */
function drawHorse(g,W,H,t){
  const pen = makePen(g,{outline:true});
  const G = horseGeom(W,H);
  const { s, gy, cx, cy, rx, ry, hatchX, hatchY } = G;
  const fillL = Math.round(surface(3, t, 0.35, 0.6, 0.6));

  // wheels (behind the legs, kept faint)
  for(const wx of [cx-s*0.95, cx+s*0.95]){
    ghost(g, ()=> g.arc(wx, gy, s*0.28, 0, TAU), clamp(fillL-2,1,5), fillL, 1.4);
    g.strokeStyle=inkLevel(fillL+1); g.lineWidth=1.4;
    g.beginPath(); g.arc(wx, gy, s*0.11, 0, TAU); g.stroke();
  }
  // four pillar legs from belly to ground (crisp so they read as columns)
  for(const lx of [cx-rx*0.80, cx-rx*0.34, cx+rx*0.34, cx+rx*0.80]){
    ghost(g, ()=> g.rect(lx-s*0.13, cy+ry*0.35, s*0.26, gy-(cy+ry*0.35)), fillL, fillL+3, 1.8);
  }
  // tail (back of body)
  ghost(g, ()=>{
    g.moveTo(cx-rx*0.94, cy-ry*0.1);
    g.quadraticCurveTo(cx-rx*1.30, cy+ry*0.5, cx-rx*1.10, cy+ry*1.3);
    g.quadraticCurveTo(cx-rx*1.05, cy+ry*0.7, cx-rx*0.86, cy+ry*0.3);
    g.closePath();
  }, fillL, fillL+2, 1.5);
  // body — the great planked barrel (kept mid-tone so it reads as a ghost)
  ghost(g, ()=> g.ellipse(cx, cy, rx, ry, 0, 0, TAU), fillL, fillL+3, 2.4);
  // a couple of faint plank seams along the body
  g.strokeStyle=inkLevel(fillL+2); g.lineWidth=1.2;
  for(const yk of [-0.4,0.1,0.55]){ g.beginPath();
    g.ellipse(cx, cy+ry*yk, rx*Math.sqrt(1-yk*yk*0.7), ry*0.14, 0, 0, TAU); g.stroke(); }
  // arched neck
  ghost(g, ()=>{
    g.moveTo(cx+rx*0.42, cy-ry*0.35);
    g.quadraticCurveTo(cx+rx*0.95, cy-ry*0.9, cx+rx*0.98, cy-ry*1.55);
    g.lineTo(cx+rx*0.70, cy-ry*1.55);
    g.quadraticCurveTo(cx+rx*0.62, cy-ry*0.7, cx+rx*0.30, cy-ry*0.30);
    g.closePath();
  }, fillL, fillL+2, 1.8);
  // squared head + muzzle
  ghost(g, ()=>{
    g.moveTo(cx+rx*0.70, cy-ry*1.45);
    g.lineTo(cx+rx*0.70, cy-ry*1.78);
    g.lineTo(cx+rx*1.32, cy-ry*1.62);
    g.lineTo(cx+rx*1.36, cy-ry*1.38);
    g.lineTo(cx+rx*1.00, cy-ry*1.30);
    g.closePath();
  }, fillL, fillL+2, 1.7);
  // ear + eye
  ghost(g, ()=>{ g.moveTo(cx+rx*0.78, cy-ry*1.80); g.lineTo(cx+rx*0.86, cy-ry*2.05);
    g.lineTo(cx+rx*0.96, cy-ry*1.78); g.closePath(); }, fillL, fillL+2, 1.4);
  g.fillStyle=inkLevel(1); g.beginPath();
  g.ellipse(cx+rx*1.05, cy-ry*1.55, s*0.06, s*0.05, 0, 0, TAU); g.fill();

  // OPEN belly-hatch: a dark opening + a hanging flap (warriors emerge here)
  const hw = s*0.7, hh = s*0.44;
  g.fillStyle=inkLevel(1); g.beginPath();
  g.rect(hatchX-hw/2, hatchY-hh*0.2, hw, hh); g.fill();
  g.strokeStyle=inkLevel(fillL+2); g.lineWidth=1.6; g.stroke();
  // the swung-down flap
  ghost(g, ()=>{
    g.moveTo(hatchX-hw/2, hatchY-hh*0.2+hh);
    g.lineTo(hatchX-hw/2-s*0.5, hatchY+hh*1.3);
    g.lineTo(hatchX-hw/2-s*0.34, hatchY+hh*1.5);
    g.lineTo(hatchX-hw/2+hw*0.4, hatchY-hh*0.2+hh);
    g.closePath();
  }, clamp(fillL-1,2,6), fillL+1, 1.4);
  return G;
}

/* ---- a compact silhouette FIGURE from round-capped limbs + a head.
   Local unit = height h; origin at the feet midpoint (ox, gy). dir flips
   facing. Poses: descend (gripping a rope) / strike / fall / grief. ---- */
function fig(pen, g, ox, gy, h, tone, dir, pose, lw){
  const P = (lx,ly)=>({ x: ox + lx*h*dir, y: gy - ly*h });
  let J;
  if (pose==="descend"){        // hanging on a rope, legs drawn up
    J = {
      hip:P(0,.44), sh:P(0,.74), neck:P(0,.80), head:P(0,.93), hr:h*.10,
      hipL:P(-.07,.44), kneeB:P(-.17,.24), footB:P(-.10,.06),
      hipR:P(.07,.44), kneeF:P(.16,.26), footF:P(.24,.10),
      shA:P(.07,.74), elA:P(.06,.95), wrA:P(.02,1.12),
      shB:P(-.07,.74), elB:P(-.06,.95), wrB:P(-.02,1.12),
    };
  } else if (pose==="strike"){  // raised weapon
    J = {
      hip:P(-.05,.46), sh:P(.12,.80), neck:P(.10,.86), head:P(.09,.965), hr:h*.105,
      hipL:P(-.11,.46), kneeB:P(-.11,.23), footB:P(-.22,0),
      hipR:P(.03,.46), kneeF:P(.16,.22), footF:P(.27,0),
      shA:P(.14,.80), elA:P(.05,.99), wrA:P(.15,1.13), bladeTip:P(.31,1.30),
      shB:P(.10,.80), elB:P(.25,.70), wrB:P(.37,.62), shield:true,
    };
  } else if (pose==="fall"){    // struck down
    J = {
      hip:P(.04,.28), sh:P(.24,.31), neck:P(.31,.25), head:P(.42,.16), hr:h*.10,
      hipL:P(.0,.28), kneeB:P(-.10,.17), footB:P(-.25,.05),
      hipR:P(.07,.28), kneeF:P(-.02,.12), footF:P(-.15,.005),
      shA:P(.24,.31), elA:P(.41,.29), wrA:P(.55,.23),
      shB:P(.24,.29), elB:P(.31,.15), wrB:P(.41,.06),
    };
  } else {                      // grief — kneeling, head bowed into the hands
    J = {
      hip:P(0,.26), sh:P(.06,.50), neck:P(.13,.53), head:P(.21,.55), hr:h*.11,
      hipL:P(-.07,.26), kneeB:P(-.20,.05), footB:P(-.30,.01),
      hipR:P(.07,.26), kneeF:P(.06,.05), footF:P(.18,.01),
      shA:P(.08,.50), elA:P(.22,.40), wrA:P(.23,.53),
      shB:P(.04,.50), elB:P(.16,.38), wrB:P(.20,.53),
    };
  }
  const L = lw;
  pen.limb(()=>{ g.moveTo(J.hipL.x,J.hipL.y); g.lineTo(J.kneeB.x,J.kneeB.y); g.lineTo(J.footB.x,J.footB.y); }, tone, L*0.92);
  pen.limb(()=>{ g.moveTo(J.shB.x,J.shB.y); g.lineTo(J.elB.x,J.elB.y); g.lineTo(J.wrB.x,J.wrB.y); }, tone, L*0.7);
  pen.limb(()=>{ g.moveTo(J.hip.x,J.hip.y); g.lineTo(J.sh.x,J.sh.y); }, tone, L*1.5);
  pen.limb(()=>{ g.moveTo(J.hipR.x,J.hipR.y); g.lineTo(J.kneeF.x,J.kneeF.y); g.lineTo(J.footF.x,J.footF.y); }, tone, L*0.97);
  pen.limb(()=>{ g.moveTo(J.sh.x,J.sh.y); g.lineTo(J.neck.x,J.neck.y); }, tone, L*0.7);
  pen.paint(()=>{ g.arc(J.head.x,J.head.y,J.hr,0,TAU); }, tone, 3);
  pen.limb(()=>{ g.moveTo(J.shA.x,J.shA.y); g.lineTo(J.elA.x,J.elA.y); g.lineTo(J.wrA.x,J.wrA.y); }, tone, L*0.76);
  if (J.bladeTip){
    pen.ink(()=>{ g.moveTo(J.wrA.x,J.wrA.y); g.lineTo(J.bladeTip.x,J.bladeTip.y); }, Math.max(3,L*0.5));
    pen.ink(()=>{ g.moveTo(J.wrA.x-L*0.7*dir, J.wrA.y-L*0.2); g.lineTo(J.wrA.x+L*0.7*dir, J.wrA.y+L*0.2); }, Math.max(2,L*0.4));
  }
  if (J.shield){ pen.paint(()=>{ g.arc(J.wrB.x, J.wrB.y, h*0.20, 0, TAU); }, tone, Math.max(2,L*0.4)); }
}

/* ---- WARRIORS DESCENDING: a rope from the horse's belly-hatch, men sliding
   down it, the ambush pouring out. Warriors slide over t. ---- */
function drawWarriors(g,W,H,t){
  const pen = makePen(g,{outline:true});
  const G = horseGeom(W,H);
  const topX = G.hatchX - G.s*0.36, topY = G.hatchY + G.s*0.46;
  const botX = topX - G.s*0.28,     botY = G.gy - G.s*0.02;
  const rope = f => ({ x: lerp(topX,botX,f), y: lerp(topY,botY,f) });
  // the rope itself
  g.strokeStyle=inkLevel(5); g.lineWidth=2.2; g.lineCap="round";
  g.beginPath(); g.moveTo(topX,topY); g.lineTo(botX,botY); g.stroke();
  // men strung down it, well spaced, sliding on their own phase
  const n = params.warriors, h = G.s*0.82;
  for(let i=0;i<n;i++){
    const f = clamp(0.10 + (i+ (t*0.06 % 1))*0.32, 0.06, 0.92);
    const p = rope(f);
    const fillL = Math.round(surface(3, t, 0.8, i*1.5, 0.7));
    fig(pen, g, p.x, p.y + h*0.9, h, toneSolid(inkLevel(fillL)), -1, "descend", h*0.06);
  }
}

/* ---- COMBAT register: duelling pairs at the walls, one striking, one falling.
   Mid-ground memory of the killing in the streets. ---- */
function drawCombat(g,W,H,t){
  const pen = makePen(g,{outline:true});
  const gy = H*params.combatY, n = params.combats, h = H*0.115;
  for(let i=0;i<n;i++){
    const cx = i===0 ? W*0.165 : W*0.835;
    const dir = i===0 ? 1 : -1;
    const fillL = Math.round(surface(3, t, 0.7, i*2.0, 0.9));
    const jit = Math.sin(t*5 + i*3)*h*0.02;      // clash tremor
    fig(pen, g, cx + dir*h*0.95, gy, h, toneSolid(inkLevel(clamp(fillL-1,2,5))), -dir, "fall", h*0.06);
    fig(pen, g, cx, gy+jit, h, toneSolid(inkLevel(fillL)), dir, "strike", h*0.06);
  }
}

/* ---- CAPTIVES register: the bowed grief-figures at the near ground, the taken
   women and children the song mourns. Nearest, but kept faint. ---- */
function drawCaptives(g,W,H,t){
  const pen = makePen(g,{outline:true});
  const gy = H*params.captiveY, n = params.captives, h = H*0.135;
  for(let i=0;i<n;i++){
    const x = lerp(W*0.16, W*0.84, i/(n-1));
    const dir = i%2 ? -1 : 1;
    const fillL = Math.round(surface(3, t, 0.45, i*1.3, 1.0));
    const rock = Math.sin(t*1.4 + i*1.1)*h*0.015;
    fig(pen, g, x, gy + rock, h, toneSolid(inkLevel(fillL)), dir, "grief", h*0.058);
  }
}

/* ---- EMBERS: sparks lifting from the burning city up through the strata. ---- */
function drawEmbers(g,W,H,t){
  const n = params.embers, hz = H*params.horizon;
  for(let i=0;i<n;i++){
    const ph = frac(t*0.13 + pr(i,5));
    const x = lerp(W*(0.10+0.8*pr(i,6)), W*(0.30+0.4*pr(i,8)), ph) + Math.sin(t*2+i)*W*0.01;
    const y = lerp(hz, H*0.10, ph);
    const r = lerp(3.0, 0.9, ph);
    g.fillStyle = inkLevel(clamp(Math.round(5-ph*3),1,5));
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
}

/* ---- SOURCE: Demodocus' song — the voice emitter at the base from which the
   whole field rises. A crisp mouth glyph + radiating sound arcs sweeping up:
   the one hard-contour mark that anchors the ghost field. ---- */
function drawSource(g,W,H,t){
  const sx = W*0.5, sy = H*0.94;
  const pulse = 0.5 + 0.5*Math.sin(t*2.2);
  for(let k=0;k<4;k++){
    const r = W*0.05 + k*W*0.05 + pulse*W*0.012*(k+1);
    g.strokeStyle = inkLevel(clamp(4-k,1,4)); g.lineWidth = lerp(3.5,1.5,k/4);
    g.lineCap="round";
    g.beginPath(); g.ellipse(sx, sy, r, r*0.9, 0, Math.PI*1.15, Math.PI*1.85); g.stroke();
  }
  const pen = makePen(g,{outline:true});
  pen.paint(()=> g.ellipse(sx, sy, W*0.03, H*0.014, 0, 0, TAU), toneSolid(inkLevel(6)), 3);
  g.fillStyle = inkLevel(0);
  g.beginPath(); g.ellipse(sx, sy, W*0.012, H*0.005, 0, 0, TAU); g.fill();
}

function drawFX(ctx,W,H,st){
  const g = ctx;
  const t = st.t || 0;
  const layers = st.layers || ["field","skyline","horse","warriors","combat","captives","embers","source"];
  const has = l => layers.includes(l);

  if (has("field"))    drawField(g,W,H);
  if (has("skyline"))  drawSkyline(g,W,H,t);
  if (has("embers"))   drawEmbers(g,W,H,t);
  if (has("horse"))    drawHorse(g,W,H,t);
  if (has("warriors")) drawWarriors(g,W,H,t);
  if (has("combat"))   drawCombat(g,W,H,t);
  if (has("captives")) drawCaptives(g,W,H,t);
  if (has("source"))   drawSource(g,W,H,t);
  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.trojan-sack-memory",
  type:"DIVINE_FX",
  name:"Trojan sack memory",
  statusWord:"REMEMBERING",
  scene:"OD-B08-S05",

  params,
  // back -> front; scene state may pass a subset to isolate a stratum
  layers:["field","skyline","horse","warriors","combat","captives","embers","source"],
  // normalized 0..1 anchors: the song source, each recollection stratum
  anchors:{
    "source:demodocus-song":{x:.50,y:.94},
    "field:skyline":{x:.50,y:.55},
    "fx:horse":{x:.50,y:.40},
    "fx:horse-hatch":{x:.455,y:.53},
    "fx:combat-left":{x:.19,y:.72},
    "fx:combat-right":{x:.83,y:.72},
    "field:captives":{x:.50,y:.86},
    "horizon:city":{x:.50,y:.62},
    "camera:wide":{x:.50,y:.50},
  },
  // affected regions of the field (for scene placement / occlusion)
  zones:{
    sky:{ x0:.0,y0:.0,x1:1,y1:.62 },
    city:{ x0:.0,y0:.62,x1:1,y1:1 },
  },

  // DIVINE_FX state machine: source song -> field strata surfacing -> transform,
  // with a duration over which the recollection plays.
  states:{
    initial:"layered",
    nodes:{
      // gathering: the song begins, only the far burning skyline faintly present
      gathering:{ preview:{ t:0.5, status:"GATHERING", progress:.20,
        layers:["field","skyline","embers","source"] } },
      // layered: the full sack surfaces at once (neutral)
      layered:{ preview:{ t:2.4, status:"REMEMBERING", progress:.55,
        layers:["field","skyline","horse","warriors","combat","captives","embers","source"] } },
      // descending: the horse dominates, the ambush pours out (mid t)
      descending:{ preview:{ t:3.4, status:"DESCENDING", progress:.72,
        layers:["field","skyline","horse","warriors","embers","source"] } },
      // sacking: the killing + the taken grieve, the city burns hardest (high t)
      sacking:{ preview:{ t:4.8, status:"SACKED", progress:.90,
        layers:["field","skyline","combat","captives","embers","source"] } },
    },
    edges:[["gathering","layered"],["layered","descending"],["descending","sacking"],
           ["sacking","layered"],["layered","gathering"]],
  },
  duration:7.0,
  channels:["surface","fire","descent","intensity","t"],

  preview:()=>({ t:2.4, status:"REMEMBERING", progress:.55,
    layers:["field","skyline","horse","warriors","combat","captives","embers","source"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
