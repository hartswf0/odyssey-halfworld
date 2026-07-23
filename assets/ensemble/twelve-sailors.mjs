/* ensemble.twelve-sailors — the expedition inside the Cyclops' cave.
   ENSEMBLE asset. A repeatable band of sailors built from ONE separable
   member template (a tunic'd sailor + a gesture rig) instanced twelve times
   across depth bands, with FORMATION (huddle | awe | urge-flee), a FEAR
   channel that hunches shoulders / bends the lean / opens the mouths, an
   ATTENTION channel that turns every head toward the bright cave-mouth, plus
   density + spread. Drawn in SOLID grays + hard contour into the offscreen
   ctx; the engine dotify POST pass supplies the halftone. Do NOT bake named
   characters in. (Matches the reference TERRIFIED crew card.)
   Atlas OD-B09-S05 — awed explorers quickly becoming anxious advocates for
   theft and withdrawal: they marvel, then gesture to snatch the cheeses and
   flee back toward the daylight of the cave-mouth. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

/* ---- the gestures one sailor can strike (the member rig's vocabulary) ---- */
const GESTURES = ["awe","point-exit","grab-loot","cower","urge"];

/* ---- FORMATIONS: the SAME member template arranged three ways.
   Each roster entry = { g:gesture, b:band(0 back..2 front), x(0..1), f:flip(+1 R / -1 L) }.
   Twelve members, four to a depth band. */
const FORMATIONS = {
  // packed tight and low, shoulders up: the first plunge into the dark
  huddle: [
    { g:"cower",      b:0, x:0.42, f: 1 },
    { g:"awe",        b:0, x:0.52, f:-1 },
    { g:"cower",      b:0, x:0.61, f:-1 },
    { g:"point-exit", b:0, x:0.34, f: 1 },
    { g:"cower",      b:1, x:0.36, f: 1 },
    { g:"awe",        b:1, x:0.49, f: 1 },
    { g:"cower",      b:1, x:0.61, f:-1 },
    { g:"grab-loot",  b:1, x:0.71, f:-1 },
    { g:"cower",      b:2, x:0.30, f: 1 },
    { g:"urge",       b:2, x:0.45, f: 1 },
    { g:"cower",      b:2, x:0.59, f:-1 },
    { g:"awe",        b:2, x:0.72, f:-1 },
  ],
  // spread wide, heads back, arms lifting: the moment of wonder
  awe: [
    { g:"awe",        b:0, x:0.18, f: 1 }, { g:"awe",        b:0, x:0.40, f: 1 },
    { g:"awe",        b:0, x:0.60, f:-1 }, { g:"awe",        b:0, x:0.82, f:-1 },
    { g:"awe",        b:1, x:0.14, f: 1 }, { g:"point-exit", b:1, x:0.37, f: 1 },
    { g:"awe",        b:1, x:0.63, f:-1 }, { g:"awe",        b:1, x:0.86, f:-1 },
    { g:"awe",        b:2, x:0.22, f: 1 }, { g:"awe",        b:2, x:0.46, f: 1 },
    { g:"awe",        b:2, x:0.64, f:-1 }, { g:"awe",        b:2, x:0.82, f:-1 },
  ],
  // leaning toward the mouth, pointing the way out, snatching cheeses on the go
  "urge-flee": [
    { g:"urge",       b:0, x:0.30, f: 1 }, { g:"point-exit", b:0, x:0.44, f: 1 },
    { g:"point-exit", b:0, x:0.58, f:-1 }, { g:"urge",       b:0, x:0.70, f:-1 },
    { g:"point-exit", b:1, x:0.24, f: 1 }, { g:"urge",       b:1, x:0.42, f: 1 },
    { g:"point-exit", b:1, x:0.62, f:-1 }, { g:"grab-loot",  b:1, x:0.79, f:-1 },
    { g:"urge",       b:2, x:0.28, f: 1 }, { g:"point-exit", b:2, x:0.46, f: 1 },
    { g:"grab-loot",  b:2, x:0.66, f:-1 }, { g:"urge",       b:2, x:0.82, f:-1 },
  ],
};

const params = {
  formation:"huddle",
  bands:3,
  count: 12,
  floorLevel:0.66,          // cave-floor horizon fraction of H
  mouth:{ x:0.50, y:0.36 }, // the bright cave-mouth (the way out) — attention target
  fear:0.7,                 // 0 upright/calm .. 1 hunched, leaning, mouths open
  attention:0.7,            // 0 heads at own task .. 1 every head turned to the mouth
  spread:1.0,               // formation width multiplier about centre
  density:1.0,              // 0 sparse (front band only) .. 1 full company of twelve
};

const BAND_Y   = [0.585, 0.700, 0.860];   // footline per depth band
const BAND_S   = [128, 176, 244];         // member height px per band
const BAND_LVL = [4, 5, 5];               // tunic ink level per band (dark vs the lit cave)

/* ============================================================
   MEMBER TEMPLATE — one sailor, drawn deterministically.
   cx/footY/s in px. o carries { g, flip, lvl, fear, headDX, seed }.
   ============================================================ */
function sailor(pen, g, cx, footY, s, o){
  const cloth = toneSolid(inkLevel(o.lvl));
  const skin  = toneSolid(inkLevel(2));
  const limbT = toneSolid(inkLevel(3));
  const hair  = toneSolid(inkLevel(6));
  const cheese= toneSolid(inkLevel(3));
  const rind  = toneSolid(inkLevel(5));
  const cw = Math.max(3, s*0.020);
  const F  = o.flip;
  const fear = clamp01(o.fear);
  const R = rnd(o.seed);
  const jit = (R()-0.5)*s*0.05;          // per-member jitter so twelve differ
  const awe = o.g==="awe";

  // ---- body metrics (fear hunches + shrinks the shoulders, sinks the head)
  const hemY   = footY - s*0.14;                  // tunic hem above the ankles
  const torsoH = s*0.50*(1-0.06*fear);
  const shoulderY = hemY - torsoH;
  const shoulderW = s*0.30*(1-0.16*fear);
  const hemW   = s*0.40;
  const headR  = s*0.135;
  const lean   = F * s*0.055 * (0.30+0.70*fear); // fearful sailors lean the way they face
  const headCy = shoulderY - headR*(1.05-0.18*fear) - (awe? headR*0.16:0);
  const hx = cx + lean + o.headDX + jit;
  const hy = headCy;

  // ---- ground shadow
  g.fillStyle = "rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, footY+s*0.015, hemW*0.60, s*0.04, 0,0,7); g.fill();

  // ---- bare legs (skin-shadow tone), a small stance
  pen.limb(()=>{ g.moveTo(cx-hemW*0.20,hemY); g.lineTo(cx-hemW*0.26,footY); }, limbT, cw*2.1);
  pen.limb(()=>{ g.moveTo(cx+hemW*0.20,hemY); g.lineTo(cx+hemW*0.26,footY); }, limbT, cw*2.1);
  pen.paint(()=>{ g.ellipse(cx-hemW*0.26,footY,s*0.055,s*0.026,0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  pen.paint(()=>{ g.ellipse(cx+hemW*0.26,footY,s*0.055,s*0.026,0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);

  // ---- BACK arm (behind the torso), posed toward the gesture
  const backSh = { x:cx-F*shoulderW*0.46+lean, y:shoulderY+s*0.04 };
  drawArm(pen,g, backSh, backArmDir(o.g,F,fear), s, cloth, limbT, cw);

  // ---- TORSO tunic (blocky trapezoid, sheared by the lean)
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hemW/2, hemY);
    g.lineTo(cx-hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  // belt + a vertical fold seam
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.5+lean*0.6, shoulderY+torsoH*0.5); g.lineTo(cx+shoulderW*0.5+lean*0.6, shoulderY+torsoH*0.5); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx+lean*0.4, shoulderY+torsoH*0.55); g.lineTo(cx, hemY); }, cw*0.55);

  // ---- NECK + HEAD
  pen.limb(()=>{ g.moveTo(cx+lean, shoulderY+s*0.005); g.lineTo(hx, hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  // hair cap over the crown (back half of the head)
  pen.paint(()=>{ g.arc(hx, hy-headR*0.05, headR*1.02, Math.PI*1.0, Math.PI*2.0); }, hair, cw*0.8);

  // ---- FACE (the fear reads here: wide eyes, lifted brows, open mouths)
  drawFace(pen,g, hx, hy, headR, fear, awe);

  // ---- FRONT arm + any prop it carries (the visible gesture)
  const frontSh = { x:cx+F*shoulderW*0.46+lean, y:shoulderY+s*0.04 };
  drawFrontGesture(pen,g, { frontSh, cx, cy:hy, hemY, footY, s, F, fear, cloth, skin:limbT, cheese, rind, cw, g:o.g });
}

/* two-segment arm from a shoulder toward a direction {elbow,wrist} */
function drawArm(pen,g, sh, dirs, s, tone, skinT, cw){
  const n = v => { const m=Math.hypot(v.x,v.y)||1; return {x:v.x/m,y:v.y/m}; };
  const e = n(dirs.el), w = n(dirs.wr);
  const L1=s*0.155, L2=s*0.150;
  const el={ x:sh.x+e.x*L1, y:sh.y+e.y*L1 };
  const wr={ x:el.x+w.x*L2, y:el.y+w.y*L2 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, tone, s*0.052);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(wr.x,wr.y); }, skinT, s*0.044);
  pen.paint(()=>{ g.arc(wr.x,wr.y, s*0.030, 0,7); }, skinT, cw*0.7);
  return { el, wr };
}

/* back-arm target direction by gesture */
function backArmDir(gest,F,fear){
  switch(gest){
    case "awe":        return { el:{x:-F*0.5,y:-0.5}, wr:{x:-F*0.6,y:-0.8} };  // both arms lift
    case "cower":      return { el:{x:-F*0.15,y:-0.55}, wr:{x:F*0.15,y:-0.85} };// hand toward face
    case "urge":       return { el:{x:-F*0.35,y:0.7}, wr:{x:-F*0.5,y:0.9} };   // trailing at side
    case "grab-loot":  return { el:{x:-F*0.2,y:0.85}, wr:{x:-F*0.1,y:1.0} };   // steadying
    default:           return { el:{x:-F*0.2,y:0.85}, wr:{x:-F*0.1,y:1.0} };   // point-exit: at side
  }
}

/* the front arm + prop that names the gesture */
function drawFrontGesture(pen,g, C){
  const { frontSh, cx, cy, hemY, footY, s, F, cloth, skin, cheese, rind, cw, g:gest } = C;
  const n = v => { const m=Math.hypot(v.x,v.y)||1; return {x:v.x/m,y:v.y/m}; };
  const L1=s*0.155, L2=s*0.150;

  if (gest==="awe"){
    // arm swept up and out in wonder, palm open
    const a = drawArm(pen,g, frontSh, { el:{x:F*0.55,y:-0.5}, wr:{x:F*0.6,y:-0.85} }, s, cloth, skin, cw);
    // three short finger ticks (open palm)
    pen.seam(()=>{ for(let k=-1;k<=1;k++){ g.moveTo(a.wr.x+k*s*0.014, a.wr.y-s*0.006); g.lineTo(a.wr.x+k*s*0.020, a.wr.y-s*0.05); } }, cw*0.6);
    return;
  }

  if (gest==="point-exit"){
    // arm thrust level toward the exit, index finger extended
    const e=n({x:F*0.85,y:-0.05}), w=n({x:F*0.95,y:-0.1});
    const el={ x:frontSh.x+e.x*L1, y:frontSh.y+e.y*L1 };
    const wr={ x:el.x+w.x*L2, y:el.y+w.y*L2 };
    pen.limb(()=>{ g.moveTo(frontSh.x,frontSh.y); g.lineTo(el.x,el.y); }, cloth, s*0.052);
    pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(wr.x,wr.y); }, skin, s*0.044);
    pen.paint(()=>{ g.arc(wr.x,wr.y, s*0.028, 0,7); }, skin, cw*0.7);
    // pointing finger
    pen.ink(()=>{ g.moveTo(wr.x,wr.y); g.lineTo(wr.x+F*s*0.075, wr.y-s*0.01); }, cw*0.9);
    return;
  }

  if (gest==="grab-loot"){
    // arm reaching down-forward, a round cheese wheel snatched in the fist
    const a = drawArm(pen,g, frontSh, { el:{x:F*0.55,y:0.45}, wr:{x:F*0.7,y:0.62} }, s, cloth, skin, cw);
    const chx=a.wr.x+F*s*0.02, chy=a.wr.y+s*0.02, chr=s*0.075;
    pen.paint(()=>{ g.arc(chx, chy, chr, 0,7); }, cheese, cw);
    pen.paint(()=>{ g.arc(chx, chy, chr, -Math.PI*0.15, Math.PI*0.55); }, rind, cw*0.8); // rind band
    pen.seam(()=>{ g.moveTo(chx,chy); g.lineTo(chx+chr*0.9, chy-chr*0.3); }, cw*0.6);    // wedge cut
    return;
  }

  if (gest==="urge"){
    // arm raised, hand up, beckoning toward the mouth (come away — flee)
    const a = drawArm(pen,g, frontSh, { el:{x:F*0.45,y:-0.6}, wr:{x:F*0.55,y:-1.0} }, s, cloth, skin, cw);
    // beckoning fingers curled forward
    pen.seam(()=>{ g.moveTo(a.wr.x-F*s*0.02,a.wr.y); g.quadraticCurveTo(a.wr.x+F*s*0.04,a.wr.y-s*0.05,a.wr.x-F*s*0.01,a.wr.y-s*0.07); }, cw*0.7);
    return;
  }

  // cower — both hands drawn up defensively before the chest/face
  const a = drawArm(pen,g, frontSh, { el:{x:F*0.2,y:-0.55}, wr:{x:-F*0.15,y:-0.85} }, s, cloth, skin, cw);
  pen.seam(()=>{ g.moveTo(a.wr.x-s*0.02,a.wr.y); g.lineTo(a.wr.x+s*0.02,a.wr.y-s*0.03); }, cw*0.6);
}

function drawFace(pen,g, hx, hy, headR, fear, awe){
  const eyeY = hy - headR*0.06 - (awe? headR*0.05:0);
  const edx  = headR*0.34;
  const eyeR = headR*(0.12 + 0.05*fear);   // fear widens the eyes
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(hx-edx, eyeY, eyeR*0.85, eyeR, 0,0,7); g.fill();
  g.beginPath(); g.ellipse(hx+edx, eyeY, eyeR*0.85, eyeR, 0,0,7); g.fill();
  // brows — lifted high when afraid, level otherwise
  const bl = headR*(0.30 + 0.30*fear);
  g.strokeStyle=INK; g.lineWidth=Math.max(2, headR*0.12); g.lineCap="round";
  g.beginPath(); g.moveTo(hx-edx-headR*0.17, eyeY-bl*0.5); g.quadraticCurveTo(hx-edx, eyeY-bl, hx-edx+headR*0.17, eyeY-bl*0.55); g.stroke();
  g.beginPath(); g.moveTo(hx+edx-headR*0.17, eyeY-bl*0.55); g.quadraticCurveTo(hx+edx, eyeY-bl, hx+edx+headR*0.17, eyeY-bl*0.5); g.stroke();
  // mouth — open oval of alarm when fearful, a flat line when calm
  const my = hy + headR*0.45;
  if (fear>0.4){
    g.fillStyle=INK; g.beginPath();
    g.ellipse(hx, my, headR*0.15, headR*(0.14+0.14*fear), 0,0,7); g.fill();
  } else {
    g.strokeStyle=INK; g.lineWidth=Math.max(2, headR*0.10);
    g.beginPath(); g.moveTo(hx-headR*0.2, my); g.lineTo(hx+headR*0.2, my); g.stroke();
  }
}

/* ============================================================
   STAGE — the Cyclops' cave interior (bright mouth, rock vault, a cheese
   rack of loot), then the twelve sailors back band -> front band.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const floor    = (st.floorLevel ?? params.floorLevel) * H;
  const fear     = st.fear      ?? params.fear;
  const attention= st.attention ?? params.attention;
  const spread   = st.spread    ?? params.spread;
  const density  = st.density   ?? params.density;
  const formation= st.formation || params.formation;
  const roster0  = FORMATIONS[formation] || FORMATIONS.huddle;
  const mouthX   = params.mouth.x*W, mouthY = params.mouth.y*H;

  // ---- CAVE INTERIOR ambient (light rock so the dark sailors + card read) ----
  g.fillStyle = inkLevel(2); g.fillRect(0,0,W,H);
  g.fillStyle = inkLevel(1); g.fillRect(0,floor,W,H-floor);   // lit floor slab

  // ---- side walls: darker rock closing in from both edges (below the label) --
  pen.paint(()=>{ g.moveTo(0,H*0.11); g.lineTo(W*0.15,H*0.11); g.quadraticCurveTo(W*0.05,floor*0.6,W*0.10,floor); g.lineTo(0,floor); g.closePath(); }, toneSolid(inkLevel(4)), 5);
  pen.paint(()=>{ g.moveTo(W,H*0.11); g.lineTo(W*0.85,H*0.11); g.quadraticCurveTo(W*0.95,floor*0.6,W*0.90,floor); g.lineTo(W,floor); g.closePath(); }, toneSolid(inkLevel(4)), 5);

  // ---- ROCK VAULT / ceiling band with stalactites, kept clear of the label ----
  const ceilY = H*0.095;
  pen.paint(()=>{
    g.moveTo(0,ceilY); g.lineTo(W,ceilY);
    const bumps=11;
    for(let i=bumps;i>=0;i--){ const bx=W*(i/bumps); const dep=H*(0.05+0.045*((i*7)%3)); g.lineTo(bx+W*0.02, ceilY); g.lineTo(bx, ceilY+dep); g.lineTo(bx-W*0.02, ceilY); }
    g.lineTo(0,ceilY); g.closePath();
  }, toneSolid(inkLevel(4)), 5);

  // ---- the bright CAVE-MOUTH (the way out to daylight) framed in rock ----
  const mw=W*0.15, mh=(floor-mouthY);
  pen.paint(()=>{ g.moveTo(mouthX-mw*1.25, floor); g.lineTo(mouthX-mw*1.25, mouthY+mh*0.35);
    g.quadraticCurveTo(mouthX, mouthY-mh*0.22, mouthX+mw*1.25, mouthY+mh*0.35); g.lineTo(mouthX+mw*1.25, floor); g.closePath(); }, toneSolid(inkLevel(5)), 5); // rock ring
  pen.paint(()=>{ g.moveTo(mouthX-mw, floor); g.lineTo(mouthX-mw, mouthY+mh*0.4);
    g.quadraticCurveTo(mouthX, mouthY, mouthX+mw, mouthY+mh*0.4); g.lineTo(mouthX+mw, floor); g.closePath(); }, toneSolid(inkLevel(1)), 4); // daylight
  // a couple of distant landscape ticks inside the bright mouth
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.4;
  g.beginPath(); g.moveTo(mouthX-mw*0.7,floor-4); g.lineTo(mouthX+mw*0.7,floor-4); g.stroke();
  g.globalAlpha=1;

  // ---- CHEESE RACK against the right wall (the loot they urge to steal) ----
  const rx=W*0.845, ry=floor-H*0.02, rw=W*0.11, rh=H*0.22;
  pen.paint(()=>{ g.rect(rx-rw/2, ry-rh, rw, rh); }, toneSolid(inkLevel(4)), 4);     // rack frame
  for(let sIdx=0;sIdx<3;sIdx++){
    const sy = ry-rh + rh*(0.28+sIdx*0.30);
    pen.paint(()=>{ g.rect(rx-rw/2, sy, rw, H*0.012); }, toneSolid(inkLevel(6)), 3); // shelf
    for(let c=0;c<3;c++){
      const cxp=rx-rw*0.33+c*rw*0.33, cr=W*0.017;
      pen.paint(()=>{ g.arc(cxp, sy-cr*0.9, cr, 0,7); }, toneSolid(inkLevel(2)), 3); // cheese wheel
    }
  }

  // ---- twelve sailors, drawn back band -> front band (painter's order) ----
  const roster = roster0
    .map((m,i)=>({ m, i }))
    .filter(({m})=> density>=1 ? true : m.b >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> a.m.b - b.m.b);

  roster.forEach(({ m, i })=>{
    const footY = BAND_Y[m.b]*H;
    const s     = BAND_S[m.b];
    const lvl   = BAND_LVL[m.b];
    const nx    = 0.5 + (m.x-0.5)*spread;
    const cx    = clamp(nx,0.07,0.93)*W;
    // attention: turn the head toward the bright mouth (bounded)
    const headDX = clamp((mouthX-cx)*0.10*attention, -s*0.10, s*0.10);
    sailor(pen, g, cx, footY, s, { g:m.g, flip:m.f, lvl, fear, headDX, seed: 1013 + i*97 });
  });
}

export const asset = {
  id:"ensemble.twelve-sailors",
  type:"ENSEMBLE",
  name:"Twelve sailors",
  statusWord:"TERRIFIED",
  scene:"OD-B09-S05",

  params,
  // ONE member template + gesture rig, instanced across depth bands
  member:{ template:"sailor", gestures:GESTURES, formations:Object.keys(FORMATIONS) },
  // back -> front draw order
  layers:["walls","vault","cave-mouth","cheese-rack","floor","band-back","band-mid","band-front"],
  // normalized placement / camera / prop anchors (NOT baked characters)
  anchors:{
    "mouth:center":{x:.50,y:.36}, "mouth:threshold":{x:.50,y:.64},
    "loot:cheese-rack":{x:.845,y:.55},
    "muster:back":{x:.50,y:.585}, "muster:mid":{x:.50,y:.700}, "muster:front":{x:.50,y:.860},
    "exit:mouth":{x:.50,y:.64}, "entrance:deep":{x:.50,y:.50},
    "camera:wide":{x:.50,y:.52}, "camera:mouth":{x:.50,y:.46},
  },
  // walkable cave floor for scene pathing/placement
  zones:{ floor:{ x0:.10,y0:.60,x1:.90,y1:.96 }, threshold:{ x0:.35,y0:.60,x1:.65,y1:.70 } },
  states:{
    initial:"huddle",
    nodes:{
      awe:{        preview:{ formation:"awe",       fear:0.22, attention:0.45, spread:1.0, density:1.0 } },
      huddle:{     preview:{ formation:"huddle",    fear:0.70, attention:0.65, spread:1.0, density:1.0 } },
      "urge-flee":{preview:{ formation:"urge-flee", fear:0.92, attention:0.90, spread:1.0, density:1.0 } },
    },
    // the scene arc: marvel -> shrink together -> press to steal and flee
    edges:[["awe","huddle"],["huddle","urge-flee"],["awe","urge-flee"]],
  },
  channels:["formation","fear","attention","spread","density"],

  preview:()=>({ formation:"huddle", fear:0.70, attention:0.65, spread:1.0, density:1.0, status:"TERRIFIED", progress:.5 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
