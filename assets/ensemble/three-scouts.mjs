/* ensemble.three-scouts — the three sailors sent inland among the Lotus-Eaters.
   ENSEMBLE asset. Scene function (OD-B09-S03): EXACTLY THREE curious scouts who
   move through one arc — alert EXPLORATION of a strange shore, DREAMY REFUSAL
   after the honey-lotus is offered and eaten (they will not come back, they
   forget the ship), and finally physical RESISTANCE as they are DRAGGED to the
   hollow ships weeping and clinging to the ground.

   Built from ONE separable member template (drawScout) instanced THREE times
   deterministically. The template pose interpolates across three canonical
   stages by a per-member `phase` (0=explore .. 1=dreamy .. 2=resist), so the
   group can stand all-alert, all-dreamy, all-dragged (formation preset), OR —
   the default — spread the arc across the trio as a reaction-WAVE so the whole
   seduction reads left-to-right in a single frame.

   Exposes: formation (explore|dreamy|resist|spread), `phase` + `wave` (how the
   drug has spread across the three), `attention` (pull of the lotus lure),
   `draggedIndex` (which scout has a visible rescuer hauling him back), and
   `lure` (which side the lotus grove lies on). Drawn in SOLID grays + hard
   contour — the engine dotify pass supplies the halftone. Do NOT bake named
   characters in; each scout is an addressable, identical-template member. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"spread",   // explore | dreamy | resist | spread(the arc across the trio)
  count:3,              // ENSEMBLE of exactly three
  phase:1.0,            // global stage 0=explore .. 1=dreamy .. 2=resist
  wave:1.0,             // how far the stage-spread reaches across the three (0=uniform)
  attention:0.85,       // pull of the lotus lure (drives the dream-haze field)
  draggedIndex:2,       // roster index with a visible rescuer's arm hauling him back (-1=none)
  lure:-1,              // -1 lotus grove on the left (they came from it) .. +1 on the right
  showGrove:true,       // draw the lotus grove they wandered into
  showHaze:true,        // draw the dreamy attention field radiating from the grove
  groundLevel:0.80,     // shore line as fraction of H
};

/* ============================================================
   THREE CANONICAL STAGES of ONE scout, as local joint offsets in units of the
   member scale s, measured from a base at (cx, footY): x toward the lure(+),
   y negative = up. drawScout lerps between the bracketing stages by `phase`.
   armR / legR = the lure(+) side; armL / legL = the anti-lure side (the side a
   rescuer drags him toward).
   ============================================================ */
const STAGE = {
  explore:{ // upright, striding onto the shore, one hand raised to scan/point ahead
    hip:[ 0.00,-0.42], sho:[ 0.03,-0.86], head:[ 0.05,-1.03],
    kneeR:[ 0.11,-0.20], footR:[ 0.16, 0.00], kneeL:[-0.09,-0.21], footL:[-0.12, 0.00],
    elbowR:[ 0.19,-0.90], wristR:[ 0.36,-1.01], elbowL:[-0.11,-0.64], wristL:[-0.13,-0.44],
  },
  dreamy:{  // sunk to the ground, slumped back, a lotus lifted slack to the lips
    hip:[ 0.12,-0.17], sho:[ 0.17,-0.44], head:[ 0.25,-0.55],
    kneeR:[ 0.28,-0.10], footR:[ 0.44,-0.01], kneeL:[ 0.07,-0.09], footL:[ 0.22, 0.00],
    elbowR:[ 0.29,-0.34], wristR:[ 0.33,-0.14], elbowL:[ 0.11,-0.42], wristL:[ 0.22,-0.52],
  },
  resist:{  // hauled anti-lure, heel dug, torso thrown back, reaching for the grove
    hip:[-0.03,-0.40], sho:[ 0.19,-0.80], head:[ 0.31,-0.92],
    kneeR:[ 0.05,-0.17], footR:[ 0.12,-0.05], kneeL:[-0.19,-0.15], footL:[-0.27, 0.00],
    elbowR:[ 0.35,-0.92], wristR:[ 0.52,-1.00], elbowL:[-0.17,-0.66], wristL:[-0.32,-0.70],
  },
};
const STAGE_SEQ = [STAGE.explore, STAGE.dreamy, STAGE.resist];

function keyAt(phase, lure){
  const p = clamp(phase,0,2);
  const i = p>=2 ? 1 : Math.floor(p);
  const f = p - i;
  const A = STAGE_SEQ[i], B = STAGE_SEQ[i+1], out = {};
  for (const k in A){
    out[k] = { x:(lerp(A[k][0],B[k][0],f))*lure, y:lerp(A[k][1],B[k][1],f) };
  }
  return out;
}

/* ============================================================
   ONE member template — a single scout at (cx, footY, s), lure direction `lure`,
   drawn at `phase`. `dragged` adds the rescuer's arm. All geometry keyed off s.
   ============================================================ */
function drawScout(pen, sc){
  const g = pen.ctx, s = sc.s, lure = sc.lure, ph = sc.phase;
  const K = keyAt(ph, lure);
  const P = j => ({ x: sc.cx + K[j].x*s, y: sc.footY + K[j].y*s });
  const stage = ph<0.5 ? "explore" : ph<1.5 ? "dreamy" : "resist";

  const skin  = toneSolid(inkLevel(sc.sh.skin));
  const tunic = toneSolid(inkLevel(sc.sh.tunic));
  const belt  = toneSolid(inkLevel(sc.sh.tunic+1>7?7:sc.sh.tunic+1));
  const hair  = toneSolid(inkLevel(sc.sh.hair));
  const dark  = toneSolid(inkLevel(7));
  const cw    = Math.max(2, s*0.02);

  const hip=P("hip"), sho=P("sho"), head=P("head");
  const kR=P("kneeR"), fR=P("footR"), kL=P("kneeL"), fL=P("footL");
  const eR=P("elbowR"), wR=P("wristR"), eL=P("elbowL"), wL=P("wristL");
  const headR = s*0.10*(sc.feat.headS||1);

  // ---- ground shadow (pools where the body meets the shore) ----
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(sc.cx+lure*s*0.04, sc.footY+s*0.015, s*0.24, s*0.05, 0,0,7); g.fill();

  // ---- FAR LEG (legL, behind) ----
  const thighW=Math.max(3,s*0.085), shinW=Math.max(3,s*0.066);
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(kL.x,kL.y); }, tunic, thighW);
  pen.limb(()=>{ g.moveTo(kL.x,kL.y); g.lineTo(fL.x,fL.y); }, skin, shinW);
  pen.paint(()=>{ g.ellipse(fL.x-lure*s*0.02, fL.y, s*0.075, s*0.032, 0,0,7); }, dark, cw*0.6);

  // ---- FAR ARM (armL) : down/relaxed(explore), up-to-face(dreamy), gripped(resist) ----
  const armW=Math.max(3,s*0.052);
  pen.limb(()=>{ g.moveTo(sho.x,sho.y); g.lineTo(eL.x,eL.y); }, tunic, armW);
  pen.limb(()=>{ g.moveTo(eL.x,eL.y); g.lineTo(wL.x,wL.y); }, skin, armW*0.86);
  pen.paint(()=>{ g.arc(wL.x,wL.y,s*0.032,0,7); }, skin, cw*0.6);

  // ---- TORSO : tunic trapezoid from hip to shoulder (leans with the pose) ----
  const ax=sho.x-hip.x, ay=sho.y-hip.y, al=Math.hypot(ax,ay)||1;
  const px=-ay/al, py=ax/al;               // perpendicular to the spine axis
  const hipHalf=s*0.10, shoHalf=s*0.135;
  pen.paint(()=>{
    g.moveTo(hip.x+px*hipHalf, hip.y+py*hipHalf);
    g.lineTo(hip.x-px*hipHalf, hip.y-py*hipHalf);
    g.lineTo(sho.x-px*shoHalf, sho.y-py*shoHalf);
    g.lineTo(sho.x+px*shoHalf, sho.y+py*shoHalf);
    g.closePath();
  }, tunic, cw);
  // belt at the waist + a hem/fold seam
  const wx=lerp(hip.x,sho.x,0.20), wy=lerp(hip.y,sho.y,0.20);
  pen.paint(()=>{ g.moveTo(wx+px*hipHalf*1.02, wy+py*hipHalf*1.02); g.lineTo(wx-px*hipHalf*1.02, wy-py*hipHalf*1.02); }, belt, cw*1.5);
  pen.seam(()=>{ g.moveTo(hip.x+px*hipHalf*0.7, hip.y+py*hipHalf*0.7); g.lineTo(hip.x-px*hipHalf*0.7, hip.y-py*hipHalf*0.7); }, cw*0.6);

  // ---- NEAR LEG (legR, in front) ----
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(kR.x,kR.y); }, tunic, thighW);
  pen.limb(()=>{ g.moveTo(kR.x,kR.y); g.lineTo(fR.x,fR.y); }, skin, shinW);
  pen.paint(()=>{ g.ellipse(fR.x+lure*s*0.02, fR.y, s*0.078, s*0.033, 0,0,7); }, dark, cw*0.6);

  // ---- NECK + HEAD ----
  pen.limb(()=>{ g.moveTo(sho.x,sho.y); g.lineTo(head.x,head.y+headR*0.7); }, skin, s*0.05);
  // hair back cap (behind the skull)
  pen.paint(()=>{ g.ellipse(head.x-lure*headR*0.15, head.y-headR*0.05, headR*1.02, headR*1.06, 0,0,7); }, hair, cw*0.7);
  pen.paint(()=>{ g.ellipse(head.x, head.y, headR*0.94, headR, 0,0,7); }, skin, cw*0.8);

  // ---- FACE (per stage) : alert / lidded-slack / straining ----
  const gx = lure*headR*0.30;
  const eyeY = head.y - headR*0.05;
  g.lineCap="round";
  if (stage==="dreamy"){
    // heavy closed lids + slack open mouth
    g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.16);
    g.beginPath(); g.moveTo(head.x+gx-headR*0.44, eyeY); g.quadraticCurveTo(head.x+gx-headR*0.30, eyeY+headR*0.14, head.x+gx-headR*0.16, eyeY); g.stroke();
    g.beginPath(); g.moveTo(head.x+gx+headR*0.14, eyeY); g.quadraticCurveTo(head.x+gx+headR*0.28, eyeY+headR*0.14, head.x+gx+headR*0.42, eyeY); g.stroke();
    g.fillStyle=INK; g.beginPath(); g.ellipse(head.x+gx, head.y+headR*0.46, headR*0.20, headR*0.16, 0,0,7); g.fill();
  } else {
    // open eyes (wide when resisting) looking toward the lure
    const eyeR = headR*(stage==="resist"?0.16:0.13);
    g.fillStyle=INK;
    g.beginPath(); g.ellipse(head.x+gx-headR*0.30, eyeY, eyeR, eyeR*1.15, 0,0,7); g.fill();
    g.beginPath(); g.ellipse(head.x+gx+headR*0.30, eyeY, eyeR, eyeR*1.15, 0,0,7); g.fill();
    // brows
    g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.12);
    const browY = eyeY - headR*(stage==="resist"?0.38:0.30);
    g.beginPath(); g.moveTo(head.x+gx-headR*0.44, browY+headR*0.06); g.lineTo(head.x+gx-headR*0.16, browY); g.stroke();
    g.beginPath(); g.moveTo(head.x+gx+headR*0.16, browY); g.lineTo(head.x+gx+headR*0.44, browY+headR*0.06); g.stroke();
    // mouth — a crying-out oval when resisting, a small line when exploring
    if (stage==="resist"){ g.fillStyle=INK; g.beginPath(); g.ellipse(head.x+gx, head.y+headR*0.48, headR*0.20, headR*0.24, 0,0,7); g.fill(); }
    else { g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.10); g.beginPath(); g.moveTo(head.x-headR*0.22, head.y+headR*0.48); g.lineTo(head.x+headR*0.22, head.y+headR*0.46); g.stroke(); }
  }
  // hair front cap over the crown
  pen.paint(()=>{
    g.moveTo(head.x-headR*1.0, head.y);
    g.quadraticCurveTo(head.x, head.y-headR*1.5, head.x+headR*1.0, head.y);
    g.quadraticCurveTo(head.x+headR*0.6, head.y-headR*0.5, head.x, head.y-headR*0.46);
    g.quadraticCurveTo(head.x-headR*0.6, head.y-headR*0.5, head.x-headR*1.0, head.y);
  }, hair, cw*0.7);
  if (sc.feat.beard)
    pen.paint(()=>{
      g.moveTo(head.x-headR*0.52, head.y+headR*0.24);
      g.quadraticCurveTo(head.x, head.y+headR*1.25, head.x+headR*0.52, head.y+headR*0.24);
      g.quadraticCurveTo(head.x, head.y+headR*0.58, head.x-headR*0.52, head.y+headR*0.24);
    }, hair, cw*0.6);

  // ---- NEAR ARM (armR) : scanning(explore), draped(dreamy), reaching-back(resist) ----
  pen.limb(()=>{ g.moveTo(sho.x,sho.y); g.lineTo(eR.x,eR.y); }, tunic, armW);
  pen.limb(()=>{ g.moveTo(eR.x,eR.y); g.lineTo(wR.x,wR.y); }, skin, armW*0.86);
  pen.paint(()=>{ g.arc(wR.x,wR.y,s*0.033,0,7); }, skin, cw*0.6);

  // ---- the LOTUS the dreamy scout holds slack to his lips ----
  if (stage==="dreamy"){
    const lx=wL.x, ly=wL.y;
    pen.limb(()=>{ g.moveTo(lx,ly); g.lineTo(lx+lure*s*0.03, ly+s*0.10); }, toneSolid(inkLevel(4)), Math.max(2,s*0.016)); // stem
    pen.paint(()=>{ g.ellipse(lx, ly-s*0.012, s*0.05, s*0.035, 0,0,7); }, toneSolid(inkLevel(2)), cw*0.6);                 // bloom
    for(let k=-1;k<=1;k++){ pen.seam(()=>{ g.moveTo(lx,ly-s*0.012); g.lineTo(lx+k*s*0.03, ly-s*0.05); }, cw*0.5); }        // petals
  }

  // ---- the RESCUE : a comrade's arm hooked round the resisting scout, HAULING
  //      him anti-lure; a taut tow-line of effort + strain accents ----
  if (sc.dragged && stage==="resist"){
    const gripX = lerp(hip.x, wL.x, 0.5), gripY = lerp(hip.y, wL.y, 0.4);
    const pullX = sc.cx - lure*s*0.42, pullY = sho.y + s*0.06;      // rescuer's braced shoulder
    pen.limb(()=>{ g.moveTo(pullX,pullY); g.lineTo(lerp(pullX,gripX,0.55), lerp(pullY,gripY,0.7)); g.lineTo(gripX,gripY); }, skin, Math.max(3,s*0.058));
    pen.paint(()=>{ g.ellipse(gripX, gripY, s*0.045, s*0.036, 0,0,7); }, skin, cw*0.7);   // gripping hand round the waist/arm
    // taut tow direction + strain accents at the point of force
    g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.014); g.lineCap="round";
    g.beginPath(); g.moveTo(pullX,pullY); g.lineTo(pullX-lure*s*0.10, pullY+s*0.02); g.stroke();
    g.fillStyle=ACCENT;
    g.beginPath(); g.arc(gripX-lure*s*0.06, gripY-s*0.04, Math.max(2,s*0.02), 0,7); g.fill();
    g.strokeStyle=ACCENT; g.lineWidth=Math.max(2,s*0.012);
    for(let k=0;k<2;k++){ g.beginPath(); g.moveTo(gripX-lure*s*(0.10+k*0.05), gripY-s*0.12); g.lineTo(gripX-lure*s*(0.06+k*0.05), gripY-s*0.05); g.stroke(); }
  }

  // ---- dug-heel skid mark under a resisting scout's braced foot ----
  if (stage==="resist"){
    g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=Math.max(2,s*0.02);
    g.beginPath(); g.moveTo(fL.x-lure*s*0.10, fL.y+s*0.02); g.lineTo(fL.x+lure*s*0.06, fL.y+s*0.02); g.stroke();
    g.globalAlpha=1;
  }

  return { head:{x:head.x,y:head.y}, r:headR, stage };
}

/* ============================================================
   THE SHORE + LOTUS GROVE the scouts wandered into (background context).
   A light shore band, a lotus grove on the lure side, and a soft dream-haze
   field whose strength = attention. All light/mid so the dark scouts read.
   ============================================================ */
function drawShore(pen, W, H, st){
  const g = pen.ctx;
  const groundY = (st.groundLevel ?? params.groundLevel) * H;
  const lure = st.lure ?? params.lure;
  const attention = clamp01(st.attention ?? params.attention);

  // ---- sky/backfield (lightest) + shore band ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,groundY);
  g.fillStyle=inkLevel(2); g.fillRect(0,groundY,W,H-groundY);
  pen.ink(()=>{ g.moveTo(0,groundY); g.lineTo(W,groundY); }, Math.max(2,W*0.004));

  // ---- dream-haze : soft concentric light lobes swelling from the grove ----
  if ((st.showHaze ?? params.showHaze) && attention>0.02){
    const hx = lure>0 ? W*0.86 : W*0.14, hy = groundY - H*0.14;
    for(let k=4;k>=1;k--){
      g.fillStyle = inkLevel(1 + (k<=2?1:0));       // very faint swells
      g.globalAlpha = 0.10 + 0.14*attention*(k/4);
      g.beginPath(); g.ellipse(hx, hy, W*0.10*k, H*0.075*k, 0,0,7); g.fill();
    }
    g.globalAlpha=1;
  }

  // ---- LOTUS GROVE on the lure side (kept to the frame edge, clear of the scouts) ----
  if (st.showGrove ?? params.showGrove){
    const bx = lure>0 ? W*0.87 : W*0.13;
    // a low bank of reeds
    pen.paint(()=>{ g.ellipse(bx, groundY+H*0.01, W*0.13, H*0.028, 0,0,7); }, toneSolid(inkLevel(3)), Math.max(3,W*0.005));
    // a cluster of lotus plants: stalk + layered blossom
    const seed = rnd(9173);
    for(let i=0;i<4;i++){
      const t = i/3;
      const lx = bx + lure*(t-0.5)*W*0.16 + (seed()-0.5)*W*0.016;
      const stalkH = H*(0.10 + 0.05*seed());
      const topY = groundY - stalkH;
      pen.limb(()=>{ g.moveTo(lx, groundY); g.lineTo(lx+lure*W*0.01, topY); }, toneSolid(inkLevel(4)), Math.max(2,W*0.006)); // stalk
      // blossom — a light cup with petal seams (mid tone so it stays legible)
      pen.paint(()=>{ g.ellipse(lx+lure*W*0.01, topY, W*0.028, H*0.026, 0,0,7); }, toneSolid(inkLevel(2)), Math.max(2,W*0.005));
      for(let p=-2;p<=2;p++){ pen.seam(()=>{ g.moveTo(lx+lure*W*0.01, topY+H*0.006); g.lineTo(lx+lure*W*0.01+p*W*0.016, topY-H*0.028); }, Math.max(2,W*0.003)); }
      pen.paint(()=>{ g.arc(lx+lure*W*0.01, topY+H*0.004, W*0.008, 0,7); }, toneSolid(inkLevel(5)), Math.max(2,W*0.003)); // center
    }
  }
}

/* ============================================================
   build the three members deterministically. Each scout's `phase` comes from
   the global stage + a reaction-wave spread across the trio (nearest the grove
   most affected). Formation presets collapse the wave to a single stage.
   ============================================================ */
function buildScouts(W, H, st){
  const p = { ...params, ...st };
  const lure = p.lure ?? 1;
  const groundY = (p.groundLevel ?? params.groundLevel) * H;
  const attention = clamp01(p.attention);

  // formation preset -> (phase, wave)
  let phase = p.phase, wave = p.wave;
  if (p.formation==="explore"){ phase=0; wave=0; }
  else if (p.formation==="dreamy"){ phase=1; wave=0; }
  else if (p.formation==="resist"){ phase=2; wave=0; }
  else if (p.formation==="spread"){ phase=(p.phase??1); wave=(p.wave??1); }

  // three ground positions read left->right as the arc: EXPLORE, DREAMY, RESIST.
  // for lure=-1 the grove sits at frame-left (where they wandered in); the
  // exploring scout is nearest it, the resisting scout is hauled to frame-right.
  const baseX = lure<0 ? [0.26,0.50,0.75] : [0.74,0.50,0.25];
  const scouts = [];
  for(let i=0;i<3;i++){
    // wave spreads the stage across the trio: i0 leads(explore) .. i2 last(resist).
    const off = (i-1)*wave;                       // i0:-w  i1:0  i2:+w
    const ph  = clamp(phase + off, 0, 2);
    const rng = rnd((i*131+43)>>>0);
    const feat = { beard: i===1, headS: 0.94+rng()*0.12 };
    const s = H*0.30*(0.96+i*0.02);
    scouts.push({
      idx:i, cx: W*baseX[i], footY: groundY + s*0.01*(i-1), s, lure, phase:ph,
      dragged: (p.draggedIndex===i),
      feat,
      sh:{ skin:2, tunic: 5 - (i%2), hair:6 },
    });
  }
  return { scouts, lure, attention };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  drawShore(pen, W, H, st);
  const B = buildScouts(W, H, st);
  // draw grove-side (back) first so the dragged/front scout sits on top
  [...B.scouts].sort((a,b)=> b.idx-a.idx).forEach(sc => drawScout(pen, sc));
}

export const asset = {
  id:"ensemble.three-scouts",
  type:"ENSEMBLE",
  name:"Three scouts",
  statusWord:"LURED",
  scene:"OD-B09-S03",

  params,
  // ONE separable member template (drawScout) instanced exactly three times
  member:{ template:"scout", count:3, stages:["explore","dreamy","resist"] },
  // back(grove) -> front(ship) draw order the ensemble honors
  layers:["shore","haze","grove","scout-back","scout-mid","scout-front","rescue"],
  // normalized 0..1 anchors: the three member slots, the lure, the rescue tug
  anchors:{
    "scout:0":{x:.26,y:.80}, "scout:1":{x:.50,y:.80}, "scout:2":{x:.75,y:.80},
    "lure:grove":{x:.13,y:.72}, "haze:center":{x:.14,y:.66},
    "rescue:tug":{x:.90,y:.62}, "exit:ship":{x:.96,y:.84},
    "center":{x:.50,y:.66}, "camera:wide":{x:.50,y:.50},
  },
  // walkable shore the trio occupy (for scene placement/pathing)
  zones:{ shore:{ x0:.06,y0:.78,x1:.94,y1:.96 }, grove:{ x0:.02,y0:.60,x1:.30,y1:.86 } },
  states:{
    initial:"exploring",
    nodes:{
      // all three alert, scanning the strange shore
      exploring:{ preview:{ formation:"explore", attention:0.25, draggedIndex:-1, status:"EXPLORING" } },
      // the lotus eaten — all three sunk, refusing to return
      dreamy:   { preview:{ formation:"dreamy",  attention:0.9,  draggedIndex:-1, status:"DREAMY" } },
      // all three hauled to the ships, weeping and clinging
      dragged:  { preview:{ formation:"resist",  attention:0.7,  draggedIndex:1,  status:"DRAGGED" } },
      // the whole arc spread across the trio at once (the default read)
      spread:   { preview:{ formation:"spread", phase:1, wave:1, attention:0.85, draggedIndex:2, status:"LURED" } },
    },
    edges:[["exploring","dreamy"],["dreamy","dragged"],["exploring","spread"],
           ["spread","dragged"],["dragged","exploring"]],
  },
  channels:["phase","wave","attention","formation","draggedIndex","lure"],

  // neutral preview = the seduction read across the trio in one frame:
  // one still exploring, one gone dreamy, one being dragged back
  preview:()=>({ formation:"spread", phase:1, wave:1, attention:0.85, lure:-1,
                 draggedIndex:2, status:"LURED", progress:0.4 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
