/* ensemble.nausicaas-maids — young serving-girls at the washing-place.
   ENSEMBLE asset. A repeatable group of young women built from ONE separable
   member template (drawMaid + a task rig) instanced N times deterministically.
   They wash, bathe, eat, and play ball in a coordinated WORK-LINE / BALL-RING,
   then break into a FEAR-SCATTER when the stranger rises from the thicket, and
   can gradually RETURN under command. Exposes formation (work-line | ball-ring |
   fear-scatter), scatter (0 at station .. 1 fully fled), an attention focus, and
   a reaction-wave that sweeps the startle across the group. Drawn in SOLID grays
   + hard contour; the engine dotify POST pass supplies the halftone. No named
   character is baked in — the alarm source is only a small thicket icon.
   Atlas OD-B06-S02 (washers/bathers/eaters/players + fear-scatter) and
   OD-B06-S03 (flight then gradual return under command).
   Matches the reference THE MAIDS panel: girls running / scattering. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const TASKS = ["wash","bathe","eat","play-ball"];

const params = {
  formation:"work-line",   // work-line | ball-ring | fear-scatter
  scatter:0.0,             // 0 = at station .. 1 = fully fled to the edges
  attention:0.4,           // 0 heads-down at task .. 1 all turned to the alarm
  reaction:0.5,            // reaction-wave sweep position 0..1 (left->right)
  density:1.0,             // 0 = only front band .. 1 = whole group
  spread:1.0,              // lateral width of the work-line about centre
  returning:false,         // faces the group back toward command (S03 return)
  showWater:true,
  showGarments:true,       // washed clothes spread on the shore
  showThicket:true,        // the alarm source (a bush), foreground centre
  alarm:{ x:0.50, y:0.94 },// where the stranger rises — maids flee away from it
};

/* member roster: a separable template on a deterministic list.
   band 0=far(small,light) .. 2=near(large,dark). nx normalized 0..1 along shore. */
const MEMBERS = [
  { task:"play-ball", nx:0.32, band:0, flip: 1 },
  { task:"play-ball", nx:0.63, band:0, flip:-1 },
  { task:"wash",      nx:0.14, band:1, flip: 1 },
  { task:"bathe",     nx:0.46, band:1, flip: 1 },
  { task:"eat",       nx:0.82, band:1, flip:-1 },
  { task:"wash",      nx:0.24, band:2, flip: 1 },
  { task:"play-ball", nx:0.55, band:2, flip:-1 },
  { task:"eat",       nx:0.86, band:2, flip:-1 },
];

const BAND_Y   = [0.495, 0.640, 0.800];  // footline per band
const BAND_S   = [150, 194, 244];        // member height px per band
const BAND_LVL = [2, 3, 3];              // dress ink level per band (light-mid — no black blobs)

/* ============================================================
   POSE PRESETS — each returns pose fields in UNIT space (×s inside drawMaid):
     lean       torso-top x lean
     strideF/B  front / back foot x offset
     bendF/B    knee bend x offset
     seatDrop   lower the hips (sitting/kneeling)
     hemY       skirt hem as fraction of leg span from hip (0 hip .. 1 foot)
     backArm/frontArm  hand targets {x,y} as direction*reach from shoulder
     billow     skirt-hem trailing x
     hairX/hairY  hair stream direction
     headDX/headUp
   F = facing (+1 right / -1 left).
   ============================================================ */
function poseFor(task, F, opt){
  const P = {
    lean:0, strideF:0.05, strideB:-0.05, bendF:0.02, bendB:-0.02, seatDrop:0,
    hemY:0.55, billow:0, hairX:-F*0.02, hairY:0.9, headDX:0, headUp:0,
    backArm:{x:-F*0.12,y:0.85}, frontArm:{x:F*0.12,y:0.85},
  };
  if (task==="wash"){
    P.lean = F*0.10; P.strideF=F*0.06; P.strideB=-F*0.04; P.hemY=0.62;
    P.backArm={x:F*0.22,y:0.85}; P.frontArm={x:F*0.40,y:0.78};
    P.headDX=F*0.06; P.headUp=-0.03; P.hairX=F*0.05; P.hairY=0.85;
  } else if (task==="bathe"){
    P.lean = 0; P.hemY=0.50;
    P.backArm={x:-F*0.14,y:0.75}; P.frontArm={x:F*0.06,y:-0.62}; // one arm raised pouring
    P.headDX=0; P.headUp=0.02;
  } else if (task==="eat"){
    P.seatDrop=0.16; P.strideF=F*0.24; P.strideB=F*0.08; P.bendF=0.10; P.hemY=0.80;
    P.backArm={x:-F*0.18,y:0.55}; P.frontArm={x:F*0.14,y:-0.06};   // hand to mouth
    P.headDX=F*0.02; P.headUp=0.0;
  } else if (task==="play-ball"){
    P.strideF=F*0.12; P.strideB=-F*0.08; P.hemY=0.55;
    P.backArm={x:-F*0.30,y:-0.55}; P.frontArm={x:F*0.32,y:-0.66}; // both arms up for the ball
    P.headUp=0.05; P.headDX=F*0.03;
  } else if (task==="flee"){
    const k = opt && opt.intensity!=null ? opt.intensity : 1;
    P.lean = F*0.13*k;
    P.strideF=F*0.22; P.strideB=-F*0.15; P.bendF=F*0.07; P.bendB=-F*0.05; P.hemY=0.50;
    P.backArm={x:-F*0.24,y:-0.34}; P.frontArm={x:F*0.30,y:-0.44};   // arms flung up
    P.billow=-F*0.12*k;               // skirt streams behind
    P.hairX=-F*0.22*k; P.hairY=0.35;  // hair trails back
    P.headDX=F*0.05; P.headUp=0.06;
    if (opt && opt.lookBack){ P.headDX=-F*0.08; }  // glancing back at the alarm
  }
  return P;
}

/* ============================================================
   MEMBER TEMPLATE — one young woman, drawn deterministically in solid grays.
   ============================================================ */
function drawMaid(pen, g, cx, footY, s, P, look){
  const dress = toneSolid(inkLevel(look.dressLvl));
  const dress2= toneSolid(inkLevel(Math.min(6, look.dressLvl+1)));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(look.hairLvl));
  const cw    = Math.max(2, s*0.02);
  const F     = look.F;

  const hipY0   = footY - s*0.30;
  const hipY    = hipY0 + P.seatDrop*s;
  const shoY    = hipY - s*0.30;
  const shoW    = s*0.26;
  const hemW    = s*0.48;
  const headR   = s*0.122;
  const neckX   = cx + P.lean*s;
  const headCy  = shoY - headR*1.05;
  const hx      = neckX + P.headDX*s;
  const hy      = headCy - P.headUp*s;

  const footFX  = cx + P.strideF*s;
  const footBX  = cx + P.strideB*s;
  const hemY    = hipY + (footY-hipY)*P.hemY;

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.008, hemW*0.55, s*0.038, 0,0,7); g.fill();

  // ---- BACK LEG (behind skirt) ----
  drawLeg(pen,g, cx-shoW*0.14, hipY, footBX, footY, P.bendB*s, skin, Math.max(3,s*0.05), cw);
  // ---- BACK ARM (behind torso) ----
  drawArm(pen,g, {x:neckX-F*shoW*0.44, y:shoY+s*0.03}, P.backArm, s, skin, dress2, Math.max(3,s*0.052), cw);

  // ---- SKIRT / DRESS (shoulders -> flared hem, may billow) ----
  const bill = P.billow*s;
  pen.paint(()=>{
    g.moveTo(neckX-shoW/2, shoY);
    g.lineTo(neckX+shoW/2, shoY);
    g.lineTo(cx+hemW/2+bill, hemY);
    g.lineTo(cx-hemW/2+bill*0.6, hemY);
    g.closePath();
  }, dress, cw);
  // waist sash + one drape fold that leans with motion
  pen.seam(()=>{ g.moveTo(neckX-shoW*0.5, shoY+s*0.20); g.lineTo(neckX+shoW*0.5, shoY+s*0.20); }, cw*0.8);
  pen.seam(()=>{ g.moveTo(neckX+bill*0.2, shoY+s*0.24); g.lineTo(cx+bill*0.8, hemY); }, cw*0.6);

  // ---- FRONT LEG (over the skirt hem) ----
  drawLeg(pen,g, cx+shoW*0.14, hipY, footFX, footY, P.bendF*s, skin, Math.max(3,s*0.055), cw);

  // ---- NECK + HEAD ----
  pen.limb(()=>{ g.moveTo(neckX, shoY+s*0.005); g.lineTo(hx, hy+headR*0.65); }, skin, s*0.05);
  // hair back mass
  pen.paint(()=>{ g.ellipse(hx - P.hairX*s*0.4, hy+headR*0.18, headR*1.12, headR*1.28, 0,0,7); }, hair, cw*0.85);
  // face
  pen.paint(()=>{ g.ellipse(hx, hy, headR*0.9, headR, 0,0,7); }, skin, cw);
  drawFace(g, hx, hy, headR, F);
  // long hair stream (trails opposite motion; drapes for still poses)
  drawHair(pen,g, hx, hy, headR, hair, P.hairX*s, P.hairY, cw);

  // ---- FRONT ARM (over torso) ----
  drawArm(pen,g, {x:neckX+F*shoW*0.44, y:shoY+s*0.03}, P.frontArm, s, skin, dress2, Math.max(3,s*0.05), cw);

  // ---- TASK PROP ----
  drawProp(pen,g, cx, footY, hipY, shoY, s, F, look, P);
}

function drawFace(g, hx, hy, headR, F){
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(hx+F*headR*0.30, hy-headR*0.06, headR*0.12, headR*0.15, 0,0,7); g.fill(); // eye
  g.strokeStyle=INK; g.lineWidth=Math.max(1.4,headR*0.10); g.lineCap="round";
  g.beginPath(); g.moveTo(hx+F*headR*0.5, hy+headR*0.08); g.lineTo(hx+F*headR*0.78, hy+headR*0.34); g.stroke(); // nose
}

function drawHair(pen,g, hx, hy, headR, hair, flowX, flowY, cw){
  const mag = Math.hypot(flowX, flowY*headR);
  if (Math.abs(flowX) > headR*0.6){
    // streaming: a trailing wedge of hair
    pen.paint(()=>{
      g.moveTo(hx, hy-headR*0.9);
      g.lineTo(hx+flowX*1.1, hy-headR*0.5+flowY*headR*0.3);
      g.lineTo(hx+flowX*1.05, hy+headR*0.9+flowY*headR*0.6);
      g.lineTo(hx-headR*0.2, hy+headR*0.8);
      g.closePath();
    }, hair, cw*0.85);
  } else {
    // drape down the back/sides (kept short so the dress reads below it)
    pen.paint(()=>{
      g.moveTo(hx-headR*1.0, hy-headR*0.1);
      g.quadraticCurveTo(hx-headR*1.05, hy+headR*1.1, hx-headR*0.4, hy+headR*1.45);
      g.lineTo(hx+headR*0.4, hy+headR*1.45);
      g.quadraticCurveTo(hx+headR*1.05, hy+headR*1.1, hx+headR*1.0, hy-headR*0.1);
      g.quadraticCurveTo(hx, hy+headR*0.4, hx-headR*1.0, hy-headR*0.1);
      g.closePath();
    }, hair, cw*0.8);
  }
}

/* two-segment arm reaching to a hand target = shoulder + dir*reach*s */
function drawArm(pen,g, sh, target, s, skin, sleeve, thick, cw){
  const n = Math.hypot(target.x, target.y)||1;
  const dx = target.x/n, dy = target.y/n;
  const reach = s*0.30;
  const hand = { x: sh.x + dx*reach, y: sh.y + dy*reach };
  const el   = { x: sh.x + dx*reach*0.55 - dy*reach*0.12, y: sh.y + dy*reach*0.55 + dx*reach*0.12 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, sleeve, thick);         // upper (sleeve)
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hand.x,hand.y); }, skin, thick*0.8);   // forearm
  pen.paint(()=>{ g.arc(hand.x,hand.y, s*0.028, 0,7); }, skin, cw*0.7);               // hand
  return hand;
}

/* two-segment leg hip->foot with a knee bend offset */
function drawLeg(pen,g, hipX, hipY, footX, footY, bend, skin, thick, cw){
  const kneeX = (hipX+footX)/2 + bend;
  const kneeY = (hipY+footY)/2;
  pen.limb(()=>{ g.moveTo(hipX,hipY); g.lineTo(kneeX,kneeY); }, skin, thick);
  pen.limb(()=>{ g.moveTo(kneeX,kneeY); g.lineTo(footX,footY); }, skin, thick*0.9);
  // simple foot
  pen.paint(()=>{ g.ellipse(footX+ (footX-kneeX>0?1:-1)*thick*0.4, footY, thick*0.9, thick*0.42, 0,0,7); }, toneSolid(inkLevel(3)), cw*0.7);
}

function drawProp(pen,g, cx, footY, hipY, shoY, s, F, look, P){
  const task = look.task;
  const prop = toneSolid(inkLevel(2));
  const propM= toneSolid(inkLevel(4));
  if (look.scatterMode) return; // fleeing — props dropped/left behind

  if (task==="wash"){
    // a flat washing-rock with a wet garment draped, in front
    const rx = cx + F*s*0.34, ry = footY - s*0.02;
    pen.paint(()=>{ g.ellipse(rx, ry, s*0.16, s*0.06, 0,0,7); }, propM, Math.max(2,s*0.018)); // rock
    pen.paint(()=>{ g.moveTo(rx-s*0.13, ry-s*0.03); g.lineTo(rx+s*0.13, ry-s*0.03);
                    g.lineTo(rx+s*0.08, ry-s*0.12); g.lineTo(rx-s*0.10, ry-s*0.10); g.closePath(); }, prop, Math.max(2,s*0.016)); // garment
  } else if (task==="bathe"){
    // a raised water-jar pouring in the front hand
    const jx = cx + F*s*0.02, jy = shoY - s*0.24;
    pen.paint(()=>{ g.ellipse(jx, jy, s*0.05, s*0.075, F*0.5, 0,7); }, propM, Math.max(2,s*0.018));
    pen.ink(()=>{ g.moveTo(jx+F*s*0.04, jy+s*0.05); g.lineTo(jx+F*s*0.02, jy+s*0.24); }, Math.max(1.5,s*0.014)); // water stream
  } else if (task==="eat"){
    // a low food-basket / bowl in the lap
    const bx = cx + F*s*0.18, by = hipY + s*0.14;
    pen.paint(()=>{ g.moveTo(bx-s*0.12,by); g.lineTo(bx+s*0.12,by); g.lineTo(bx+s*0.08,by-s*0.10); g.lineTo(bx-s*0.08,by-s*0.10); g.closePath(); }, propM, Math.max(2,s*0.018));
    pen.paint(()=>{ g.ellipse(bx, by-s*0.10, s*0.09, s*0.03, 0,0,7); }, prop, Math.max(2,s*0.016));
  }
  // play-ball prop (the ball) is drawn once at the group level near the ring
}

/* ============================================================
   FORMATION — place each member; returns draw records back->front.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = p.formation;
  const scatter = clamp01(p.scatter);
  const spread = clamp(p.spread, 0.4, 1.6);
  const density = clamp01(p.density);
  const reaction = clamp01(p.reaction);
  const ax = p.alarm.x*W, ay = p.alarm.y*H;
  const ballCenter = { x:0.52*W, y:0.40*H };

  const roster = MEMBERS
    .map((m,i)=>({ ...m, i }))
    .filter(m => density>=1 ? true : m.band >= Math.round((1-density)*2));

  const recs = [];
  for (const m of roster){
    const rng = rnd((m.i*97 + 13)>>>0);
    let footY = BAND_Y[m.band]*H;
    let sBase = BAND_S[m.band];
    let cx, s = sBase, F = m.flip, task = m.task, P;

    // home position on the shore
    const homeX = clamp(0.5 + (m.nx-0.5)*spread, 0.08, 0.92)*W;
    const homeY = footY;

    if (formation==="ball-ring"){
      const idx = recs.length; const N = roster.length;
      const ang = -Math.PI/2 + (idx/N)*Math.PI*2;
      const rr = W*0.30;
      cx = clamp(ballCenter.x + Math.cos(ang)*rr, W*0.08, W*0.92);
      footY = clamp(ballCenter.y + Math.sin(ang)*rr*0.7 + s*0.5, H*0.42, H*0.92);
      s = lerp(150, 250, clamp01((footY/H-0.42)/(0.92-0.42)));
      F = cx < ballCenter.x ? 1 : -1;         // face the ball
      task = "play-ball";
      P = poseFor("play-ball", F);
    } else if (formation==="fear-scatter" && scatter>0.02){
      // flee away from the alarm (mostly outward + up the bank)
      let dx = homeX-ax, dy = homeY-ay, L=Math.hypot(dx,dy)||1;
      let ux = dx/L, uy = dy/L - 0.55;          // bias upward
      const ul = Math.hypot(ux,uy)||1; ux/=ul; uy/=ul;
      cx = clamp(homeX + ux*W*0.34*scatter, W*0.04, W*0.96);
      footY = clamp(homeY + uy*H*0.30*scatter, H*0.40, H*0.92);
      s = sBase * lerp(1, 0.82, clamp01((homeY-footY)/(H*0.3)));
      F = ux>=0 ? 1 : -1;
      // give near-centre girls a definite side
      if (Math.abs(ux) < 0.15) F = (m.i%2? 1:-1);
      task = "flee";
      P = poseFor("flee", F, { intensity: scatter, lookBack: p.returning });
      if (p.returning) F = -F, P = poseFor("flee", F, { intensity: scatter*0.7, lookBack:true });
    } else {
      // work-line: at station, doing the task; attention may turn heads
      cx = homeX; footY = homeY; s = sBase; F = m.flip; task = m.task;
      P = poseFor(task, F);
      // attention: reaction-wave sweeps a startled head-turn across the line
      const wavePos = reaction; const local = clamp(1 - Math.abs(wavePos - m.nx)*3.2, 0, 1);
      const att = clamp01(p.attention) * (0.4 + 0.6*local);
      P = { ...P, headDX:(ax-cx)/W*0.22*att, headUp:P.headUp + local*0.04*att };
    }

    const depth = footY/H;
    const look = {
      task, F,
      dressLvl: BAND_LVL[m.band],
      hairLvl: 5,
      scatterMode: (formation==="fear-scatter" && scatter>0.15),
    };
    recs.push({ cx, footY, s, P, look, depth });
  }
  recs.sort((a,b)=> a.footY - b.footY);   // back -> front
  return { recs, formation, scatter, ballCenter, alarm:{x:ax,y:ay},
           showWater:p.showWater, showGarments:p.showGarments, showThicket:p.showThicket };
}

/* ============================================================
   STAGE — washing-place context, then the member set.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const shoreY = H*0.455;
  const waterY = H*0.71;

  // ---- sky ---- (lightest)
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,shoreY);

  // ---- distant hill + treeline along the horizon (reads as far bank) ----
  pen.paint(()=>{ g.moveTo(0, shoreY);
    for(let x=0;x<=W;x+=W*0.05){ g.lineTo(x, shoreY - H*0.045 - Math.sin(x*0.9/W*Math.PI*3)*H*0.02); }
    g.lineTo(W, shoreY); g.closePath(); }, toneSolid(inkLevel(2)), 3);
  // scalloped tree canopy bumps sitting on the hill crest
  for (let i=0;i<11;i++){
    const tx = W*(0.045 + i*0.091), r = W*0.032*(0.8+((i*7)%3)*0.14);
    const ty = shoreY - H*0.055 - ((i%2)?H*0.012:0);
    pen.paint(()=>{ g.arc(tx, ty, r, Math.PI*1.02, Math.PI*2.02); }, toneSolid(inkLevel(3)), 3);
  }
  pen.ink(()=>{ g.moveTo(0,shoreY); g.lineTo(W,shoreY); }, 3);

  // ---- meadow shore (mid-light ground the maids stand on) ----
  g.fillStyle = inkLevel(2); g.fillRect(0, shoreY, W, H-shoreY);

  // ---- river pool along the lower stage (darker water band) ----
  if (B.showWater){
    pen.paint(()=>{ g.moveTo(0, waterY); g.lineTo(W, waterY-H*0.02);
                    g.lineTo(W, H); g.lineTo(0, H); g.closePath(); }, toneSolid(inkLevel(3)), 3);
    // ripple lines
    g.strokeStyle=INK; g.globalAlpha=0.25; g.lineWidth=2;
    for(let j=0;j<3;j++){ const y=waterY+H*0.04*(j+1);
      g.beginPath(); g.moveTo(W*0.05,y); g.lineTo(W*0.45,y-4); g.moveTo(W*0.55,y+2); g.lineTo(W*0.95,y-3); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- washed garments spread to dry on the shore (light rectangles) ----
  if (B.showGarments){
    for (const gx of [0.10,0.24,0.83]){
      pen.paint(()=>{ g.rect(W*gx-W*0.05, shoreY+H*0.02, W*0.10, H*0.03); }, toneSolid(inkLevel(2)), 2);
    }
  }

  // ---- the ball (in ring / play states), a light sphere in the air ----
  if (B.formation!=="fear-scatter"){
    const bc = B.ballCenter;
    pen.paint(()=>{ g.arc(bc.x, bc.y - (B.formation==="ball-ring"? H*0.16 : H*0.10), W*0.028, 0,7); }, toneSolid(inkLevel(2)), 3);
    // seam cross on the ball
    const by = bc.y - (B.formation==="ball-ring"? H*0.16 : H*0.10);
    pen.ink(()=>{ g.moveTo(bc.x-W*0.028,by); g.lineTo(bc.x+W*0.028,by);
                  g.moveTo(bc.x,by-W*0.028); g.lineTo(bc.x,by+W*0.028); }, 2);
  }

  // ---- the alarm thicket (foreground centre) the maids flee from ----
  if (B.showThicket && B.formation==="fear-scatter"){
    const tx = B.alarm.x, ty = B.alarm.y;
    pen.paint(()=>{ g.ellipse(tx, ty, W*0.11, H*0.05, 0,0,7); }, toneSolid(inkLevel(5)), 4);
    pen.paint(()=>{ g.ellipse(tx-W*0.05, ty-H*0.015, W*0.06, H*0.035, 0,0,7); }, toneSolid(inkLevel(4)), 3);
    pen.paint(()=>{ g.ellipse(tx+W*0.05, ty-H*0.01, W*0.06, H*0.03, 0,0,7); }, toneSolid(inkLevel(4)), 3);
  }

  // ---- the maids, back -> front ----
  for (const r of B.recs) drawMaid(pen, g, r.cx, r.footY, r.s, r.P, r.look);
}

export const asset = {
  id:"ensemble.nausicaas-maids",
  type:"ENSEMBLE",
  name:"Nausicaa's maids",
  statusWord:"STARTLED",
  scene:"OD-B06-S02",

  params,
  // one member template + task rig, instanced across depth bands / formations
  member:{ template:"drawMaid", tasks:TASKS, roster:MEMBERS },
  // back -> front draw order the stage honors
  layers:["far-bank","meadow","water","garments","ball","thicket","maids"],
  // normalized placement / focus / alarm anchors (NOT baked characters)
  anchors:{
    "station:wash":{x:.18,y:.86}, "station:bathe":{x:.50,y:.73},
    "station:eat":{x:.80,y:.86},  "ring:centre":{x:.52,y:.52},
    "focus:alarm":{x:.50,y:.94},  "flee:left":{x:.06,y:.55},
    "flee:right":{x:.94,y:.55},   "flee:up":{x:.50,y:.44},
    "camera:wide":{x:.50,y:.55},
  },
  // walkable shore between the meadow line and the water
  zones:{ shore:{ x0:.04,y0:.60,x1:.96,y1:.82 }, water:{ x0:.0,y0:.80,x1:1.0,y1:1.0 } },
  channels:["formation","scatter","attention","reaction","density","spread"],
  states:{
    initial:"at-work",
    nodes:{
      // S02: coordinated washers / bathers / eaters at their stations
      "at-work":  { preview:{ formation:"work-line", scatter:0, attention:0.35, status:"AT WORK" } },
      // S02: the ball game — everyone ringed around the toss
      "playing":  { preview:{ formation:"ball-ring", scatter:0, attention:0.2, status:"PLAYING" } },
      // S02/S03: the stranger rises — the startle sweeps the line
      "startled": { preview:{ formation:"work-line", scatter:0, attention:1.0, reaction:0.5, status:"STARTLED" } },
      // S02/S03: flight — the reference THE MAIDS panel
      "scattered":{ preview:{ formation:"fear-scatter", scatter:1.0, status:"SCATTERING" } },
      // S03: gradual return under command — half-fled, glancing back
      "returning":{ preview:{ formation:"fear-scatter", scatter:0.4, returning:true, status:"RETURNING" } },
    },
    edges:[
      ["at-work","playing"],["playing","at-work"],
      ["at-work","startled"],["playing","startled"],
      ["startled","scattered"],["scattered","returning"],
      ["returning","at-work"],
    ],
  },

  // neutral preview = the coordinated work-line (washers/bathers/eaters/players);
  // the fear-scatter (the iconic THE MAIDS running panel) is the `scattered` state.
  preview:()=>({ formation:"work-line", scatter:0, attention:0.4, reaction:0.5, status:"AT WORK", progress:0.25 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
