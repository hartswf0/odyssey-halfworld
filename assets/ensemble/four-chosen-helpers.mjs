/* ensemble.four-chosen-helpers — the four sailors chosen by lot to help handle
   the great olive stake in the Cyclops' cave.
   ENSEMBLE asset. Scene function (OD-B09-S08): EXACTLY FOUR lot-selected
   sailors REHEARSING one coordinated four-beat action on a single shared
   beam — LIFT it off the ground, CARRY it forward, ROTATE (bore/twist) it,
   then WITHDRAW (draw it back). Not the deed itself: the drill, so the crew
   locks into unison before the real thing.

   Built from ONE separable member template (drawHelper) instanced FOUR times
   deterministically. All four grip a SINGLE RIGID BEAM (one pole spanning the
   team); each member's stance interpolates across the four canonical beats by a
   per-member `beat` (0=lift .. 3=withdraw). A `synchrony` control collapses the
   crew into perfect unison (lift-team formation, all one beat) OR staggers the
   beats across the four so the whole coordinated cycle reads left-to-right in a
   single frame — the rehearsal "wave".

   Exposes: formation (lift|carry|rotate|withdraw|rehearse), `beat` + `synchrony`
   (how locked the crew is), `beamLift`/`beamTilt` (the shared pole's height and
   pitch), and `showLots` (the four drawn lots that chose them). Drawn in SOLID
   grays + hard contour — the engine dotify pass supplies the halftone. Do NOT
   bake named characters in; each helper is an addressable identical-template
   member. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };
const SCALE = 0.40;   // member/beam scale as a fraction of H (fills the frame)

const params = {
  formation:"rehearse", // lift | carry | rotate | withdraw | rehearse(spread the cycle across the four)
  count:4,              // ENSEMBLE of exactly four lot-chosen helpers
  beat:1.5,             // global beat 0=lift .. 1=carry .. 2=rotate .. 3=withdraw
  synchrony:0.35,       // 1=locked unison .. 0=fully staggered rehearsal wave
  beamLift:1.02,        // shared pole height (fraction of member scale above the feet)
  beamTilt:-0.05,       // shared pole pitch in radians (+ dips to the right)
  showLots:true,        // draw the four lots on the ground that selected the crew
  showBeat:true,        // draw the coordination beat-strip above the pole
  groundLevel:0.86,     // cave floor line as fraction of H
};

/* ============================================================
   FOUR CANONICAL BEATS of ONE helper, as a stance descriptor (NOT the arms —
   both hands are pinned to the shared beam wherever it is). Fields:
     crouch : 0 upright .. 1 deep squat (lowers hips/shoulders)
     lean   : torso horizontal shift toward the carry(+)/back(-) direction, in s
     twist  : shoulder shear (the bore/rotate beat drives the pole's turn arrows)
     step   : near-foot stride offset (+ forward, - stepped back)
   drawHelper lerps between the bracketing beats by `beat`.
   ============================================================ */
const BEAT = {
  lift:    { crouch:0.86, lean: 0.01, twist:0.00, step: 0.02 }, // deep squat, hauling the pole off the floor
  carry:   { crouch:0.18, lean: 0.13, twist:0.05, step: 0.34 }, // tall, striding it forward
  rotate:  { crouch:0.40, lean: 0.00, twist:0.62, step:-0.04 }, // torso sheared, boring/turning it
  withdraw:{ crouch:0.34, lean:-0.15, twist:0.02, step:-0.40 }, // leaning back, drawing it away
};
const BEAT_SEQ = [BEAT.lift, BEAT.carry, BEAT.rotate, BEAT.withdraw];
const BEAT_NAME = ["lift","carry","rotate","withdraw"];

function beatAt(b){
  const p = clamp(b, 0, 3);
  const i = p>=3 ? 2 : Math.floor(p);
  const f = smooth(p - i);
  const A = BEAT_SEQ[i], B = BEAT_SEQ[i+1];
  return {
    crouch: lerp(A.crouch, B.crouch, f),
    lean:   lerp(A.lean,   B.lean,   f),
    twist:  lerp(A.twist,  B.twist,  f),
    step:   lerp(A.step,   B.step,   f),
    name:   BEAT_NAME[Math.round(p)],
  };
}

/* the shared rigid beam: a single line the whole crew grips.
   returns beamPointAtX(x) -> {x,y} on the pole, plus its endpoints + tip. */
function makeBeam(W, H, st){
  const groundY = (st.groundLevel ?? params.groundLevel) * H;
  const s = H*SCALE;
  const midY = groundY - (st.beamLift ?? params.beamLift) * s;
  const tilt = st.beamTilt ?? params.beamTilt;
  const x0 = W*0.075, x1 = W*0.925, cx = (x0+x1)/2;
  const dydx = Math.tan(tilt);
  const yAt = x => midY + (x - cx)*dydx;
  return {
    x0, x1, cx, s, groundY,
    a:{x:x0, y:yAt(x0)}, b:{x:x1, y:yAt(x1)},
    at: x => ({ x, y: yAt(x) }),
  };
}

/* ============================================================
   ONE member template — a single lot-chosen helper at (cx, footY, s), gripping
   the shared beam with BOTH hands around gripX. `beat` sets the stance; the
   arms always reach up to the real pole so the four read as one crew on one
   pole. Front-facing so the whole team is legible in a row.
   ============================================================ */
function drawHelper(pen, hp, beam){
  const g = pen.ctx, s = hp.s, cx = hp.cx, footY = hp.footY;
  const K = beatAt(hp.beat);
  const dir = hp.dir; // carry/withdraw direction (+1 to the right)

  const skin  = toneSolid(inkLevel(hp.sh.skin));
  const tunic = toneSolid(inkLevel(hp.sh.tunic));
  const belt  = toneSolid(inkLevel(Math.min(7, hp.sh.tunic+2)));
  const hair  = toneSolid(inkLevel(hp.sh.hair));
  const dark  = toneSolid(inkLevel(7));
  const cw    = Math.max(2, s*0.02);

  // ---- vertical body layout, lowered by crouch ----
  const hipY = footY - s*(0.46 - K.crouch*0.20);
  const shoY = footY - s*(0.84 - K.crouch*0.24);
  const headY= footY - s*(1.03 - K.crouch*0.27);
  const leanX = K.lean*dir*s;
  const hipX  = cx + leanX*0.55;
  const shoX  = cx + leanX + K.twist*dir*s*0.10;
  const headX = cx + leanX*0.95;
  const headR = s*0.105*(hp.feat.headS||1);

  // ---- feet + knees (stance) ----
  const feetHalf = s*0.12;
  const nearFootX = cx + feetHalf + K.step*dir*s*0.20;
  const farFootX  = cx - feetHalf + K.step*dir*s*0.05;
  const nearFoot = { x:nearFootX, y:footY };
  const farFoot  = { x:farFootX,  y:footY };
  const kneeBend = s*(0.02 + K.crouch*0.10);
  const nearKnee = { x:lerp(hipX,nearFoot.x,0.5)+kneeBend, y:lerp(hipY,footY,0.52) };
  const farKnee  = { x:lerp(hipX,farFoot.x, 0.5)-kneeBend, y:lerp(hipY,footY,0.52) };

  // ---- both grips on the shared beam (hands slightly apart) ----
  const gp  = beam.at(hp.gripX);
  const gpL = beam.at(hp.gripX - s*0.09);
  const gpR = beam.at(hp.gripX + s*0.07);
  const shoHalf = s*0.135;
  const shoL = { x:shoX - shoHalf, y:shoY + K.twist*dir*s*0.05 };
  const shoR = { x:shoX + shoHalf, y:shoY - K.twist*dir*s*0.05 };
  const elbL = { x:lerp(shoL.x,gpL.x,0.5)-s*0.05, y:lerp(shoL.y,gpL.y,0.5)+s*0.03 };
  const elbR = { x:lerp(shoR.x,gpR.x,0.5)+s*0.05, y:lerp(shoR.y,gpR.y,0.5)+s*0.03 };

  const thighW=Math.max(3,s*0.090), shinW=Math.max(3,s*0.070), armW=Math.max(3,s*0.055);

  // ---- ground shadow ----
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.012, s*0.26, s*0.05, 0,0,7); g.fill();

  // ---- FAR leg + FAR arm (behind torso) ----
  pen.limb(()=>{ g.moveTo(hipX,hipY); g.lineTo(farKnee.x,farKnee.y); }, tunic, thighW);
  pen.limb(()=>{ g.moveTo(farKnee.x,farKnee.y); g.lineTo(farFoot.x,farFoot.y); }, skin, shinW);
  pen.paint(()=>{ g.ellipse(farFoot.x-dir*s*0.02, farFoot.y, s*0.078, s*0.032, 0,0,7); }, dark, cw*0.6);
  pen.limb(()=>{ g.moveTo(shoL.x,shoL.y); g.lineTo(elbL.x,elbL.y); }, tunic, armW);
  pen.limb(()=>{ g.moveTo(elbL.x,elbL.y); g.lineTo(gpL.x,gpL.y); }, skin, armW*0.86);

  // ---- TORSO : tunic trapezoid hip->shoulder (leans/twists with the beat) ----
  const ax=shoX-hipX, ay=shoY-hipY, al=Math.hypot(ax,ay)||1;
  const px=-ay/al, py=ax/al;
  const hipHalf=s*0.105;
  pen.paint(()=>{
    g.moveTo(hipX+px*hipHalf, hipY+py*hipHalf);
    g.lineTo(hipX-px*hipHalf, hipY-py*hipHalf);
    g.lineTo(shoX-px*shoHalf, shoY-py*shoHalf);
    g.lineTo(shoX+px*shoHalf, shoY+py*shoHalf);
    g.closePath();
  }, tunic, cw);
  // belt at the waist
  const wx=lerp(hipX,shoX,0.18), wy=lerp(hipY,shoY,0.18);
  pen.paint(()=>{ g.moveTo(wx+px*hipHalf*1.04, wy+py*hipHalf*1.04); g.lineTo(wx-px*hipHalf*1.04, wy-py*hipHalf*1.04); }, belt, cw*1.5);
  // strain seam down the spine
  pen.seam(()=>{ g.moveTo(hipX, hipY); g.lineTo(shoX, shoY); }, cw*0.5);

  // ---- NEAR leg (front) ----
  pen.limb(()=>{ g.moveTo(hipX,hipY); g.lineTo(nearKnee.x,nearKnee.y); }, tunic, thighW);
  pen.limb(()=>{ g.moveTo(nearKnee.x,nearKnee.y); g.lineTo(nearFoot.x,nearFoot.y); }, skin, shinW);
  pen.paint(()=>{ g.ellipse(nearFoot.x+dir*s*0.02, nearFoot.y, s*0.082, s*0.034, 0,0,7); }, dark, cw*0.6);

  // ---- NECK + HEAD ----
  pen.limb(()=>{ g.moveTo(shoX,shoY); g.lineTo(headX,headY+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.ellipse(headX-dir*headR*0.12, headY-headR*0.05, headR*1.02, headR*1.06, 0,0,7); }, hair, cw*0.7);
  pen.paint(()=>{ g.ellipse(headX, headY, headR*0.94, headR, 0,0,7); }, skin, cw*0.8);
  // face : straining upward at the pole (both eyes + set brows + gritted mouth)
  const eyeY = headY - headR*0.04, gx = dir*headR*0.10;
  g.fillStyle=INK;
  g.beginPath(); g.ellipse(headX+gx-headR*0.30, eyeY, headR*0.13, headR*0.15, 0,0,7); g.fill();
  g.beginPath(); g.ellipse(headX+gx+headR*0.30, eyeY, headR*0.13, headR*0.15, 0,0,7); g.fill();
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.13); g.lineCap="round";
  const browY = eyeY - headR*0.32;
  g.beginPath(); g.moveTo(headX-headR*0.42, browY+headR*0.08); g.lineTo(headX-headR*0.14, browY); g.stroke();
  g.beginPath(); g.moveTo(headX+headR*0.14, browY); g.lineTo(headX+headR*0.42, browY+headR*0.08); g.stroke();
  g.lineWidth=Math.max(2,headR*0.10);
  g.beginPath(); g.moveTo(headX-headR*0.22, headY+headR*0.46); g.lineTo(headX+headR*0.22, headY+headR*0.46); g.stroke();
  // hair front cap + beard
  pen.paint(()=>{
    g.moveTo(headX-headR*1.0, headY);
    g.quadraticCurveTo(headX, headY-headR*1.5, headX+headR*1.0, headY);
    g.quadraticCurveTo(headX+headR*0.6, headY-headR*0.5, headX, headY-headR*0.46);
    g.quadraticCurveTo(headX-headR*0.6, headY-headR*0.5, headX-headR*1.0, headY);
  }, hair, cw*0.7);
  if (hp.feat.beard)
    pen.paint(()=>{
      g.moveTo(headX-headR*0.52, headY+headR*0.22);
      g.quadraticCurveTo(headX, headY+headR*1.22, headX+headR*0.52, headY+headR*0.22);
      g.quadraticCurveTo(headX, headY+headR*0.56, headX-headR*0.52, headY+headR*0.22);
    }, hair, cw*0.6);

  // ---- NEAR arm (front) reaching up to the beam ----
  pen.limb(()=>{ g.moveTo(shoR.x,shoR.y); g.lineTo(elbR.x,elbR.y); }, tunic, armW);
  pen.limb(()=>{ g.moveTo(elbR.x,elbR.y); g.lineTo(gpR.x,gpR.y); }, skin, armW*0.86);

  return { gpL, gpR, gp, head:{x:headX,y:headY}, r:headR, beat:K, cw, s, dir };
}

/* clasp both hands over the beam AFTER the pole is drawn, so they read as
   gripping it. Also draws the per-member rotate/lift/withdraw motion accents. */
function drawGrips(pen, hlp){
  const g = pen.ctx, s = hlp.s, cw = hlp.cw;
  const skin = toneSolid(inkLevel(2));
  pen.paint(()=>{ g.ellipse(hlp.gpL.x, hlp.gpL.y, s*0.045, s*0.036, 0,0,7); }, skin, cw*0.7);
  pen.paint(()=>{ g.ellipse(hlp.gpR.x, hlp.gpR.y, s*0.045, s*0.036, 0,0,7); }, skin, cw*0.7);

  const K = hlp.beat, dir = hlp.dir, gp = hlp.gp;
  g.lineCap="round";
  if (K.name==="rotate"){
    // twin turning arcs around the pole (the boring motion)
    g.strokeStyle=ACCENT; g.lineWidth=Math.max(2,s*0.018);
    for(const sgn of [-1,1]){
      const ay = gp.y + sgn*s*0.11;
      g.beginPath(); g.arc(gp.x, ay, s*0.09, sgn>0?0.15:Math.PI+0.15, sgn>0?Math.PI-0.15:2*Math.PI-0.15); g.stroke();
      const tip = { x:gp.x + (sgn>0?-1:1)*s*0.09, y:ay };
      g.beginPath(); g.moveTo(tip.x,tip.y); g.lineTo(tip.x+ (sgn>0?0.03:-0.03)*s, tip.y - sgn*s*0.05); g.lineTo(tip.x+(sgn>0?0.05:-0.05)*s, tip.y + sgn*s*0.01); g.stroke();
    }
  } else if (K.name==="lift"){
    // up-arrows: the heave off the floor
    g.strokeStyle=ACCENT; g.lineWidth=Math.max(2,s*0.02);
    for(const ox of [-s*0.06, s*0.06]){
      g.beginPath(); g.moveTo(gp.x+ox, gp.y+s*0.16); g.lineTo(gp.x+ox, gp.y+s*0.02); g.stroke();
      g.beginPath(); g.moveTo(gp.x+ox-s*0.03, gp.y+s*0.06); g.lineTo(gp.x+ox, gp.y+s*0.02); g.lineTo(gp.x+ox+s*0.03, gp.y+s*0.06); g.stroke();
    }
  } else {
    // carry / withdraw : a directional arrow along the pole
    g.strokeStyle=ACCENT; g.lineWidth=Math.max(2,s*0.02);
    const d = (K.name==="withdraw"? -1:1)*dir;
    const ax = gp.x, ay = gp.y - s*0.15;
    g.beginPath(); g.moveTo(ax - d*s*0.08, ay); g.lineTo(ax + d*s*0.08, ay); g.stroke();
    g.beginPath(); g.moveTo(ax + d*s*0.04, ay - s*0.03); g.lineTo(ax + d*s*0.08, ay); g.lineTo(ax + d*s*0.04, ay + s*0.03); g.stroke();
  }
}

/* the SHARED rigid beam: the great olive stake, one fire-hardened point. */
function drawBeam(pen, beam){
  const g = pen.ctx, s = beam.s;
  const wood = toneSolid(inkLevel(4)), grain = inkLevel(6), char = toneSolid(inkLevel(7));
  const a = beam.a, b = beam.b;
  const dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1;
  const nx=-dy/L, ny=dx/L;          // pole normal (thickness direction)
  const th = s*0.055;               // half-thickness
  // taper the right end toward a fire-hardened point
  const tip = { x:b.x + dx/L*s*0.10, y:b.y + dy/L*s*0.10 };
  pen.paint(()=>{
    g.moveTo(a.x+nx*th, a.y+ny*th);
    g.lineTo(b.x+nx*th*0.6, b.y+ny*th*0.6);
    g.lineTo(tip.x, tip.y);
    g.lineTo(b.x-nx*th*0.6, b.y-ny*th*0.6);
    g.lineTo(a.x-nx*th, a.y-ny*th);
    g.closePath();
  }, wood, Math.max(3,s*0.02));
  // wood grain seams
  g.strokeStyle=grain; g.lineWidth=Math.max(1,s*0.008); g.lineCap="round"; g.globalAlpha=0.7;
  for(const o of [-0.4,0,0.45]){
    g.beginPath(); g.moveTo(a.x+nx*th*o, a.y+ny*th*o); g.lineTo(b.x+nx*th*o*0.6, b.y+ny*th*o*0.6); g.stroke();
  }
  g.globalAlpha=1;
  // charred / sharpened tip
  pen.paint(()=>{
    g.moveTo(b.x+nx*th*0.6, b.y+ny*th*0.6);
    g.lineTo(tip.x, tip.y);
    g.lineTo(b.x-nx*th*0.6, b.y-ny*th*0.6);
    g.closePath();
  }, char, Math.max(2,s*0.014));
}

/* ============================================================
   the CAVE floor + the four LOTS that chose the crew (background context).
   ============================================================ */
function drawCave(pen, W, H, st){
  const g = pen.ctx;
  const groundY = (st.groundLevel ?? params.groundLevel) * H;
  // dim cave wall (upper) + lighter floor so the dark crew reads
  g.fillStyle=inkLevel(2); g.fillRect(0,0,W,groundY);
  g.fillStyle=inkLevel(3); g.fillRect(0,groundY,W,H-groundY);
  pen.ink(()=>{ g.moveTo(0,groundY); g.lineTo(W,groundY); }, Math.max(2,W*0.004));
  // a few rough floor cracks
  g.strokeStyle=INK; g.globalAlpha=0.3; g.lineWidth=Math.max(1,W*0.002);
  for(let i=0;i<3;i++){ const x=W*(0.2+i*0.3); g.beginPath(); g.moveTo(x,groundY+H*0.04); g.lineTo(x+W*0.05,H*0.99); g.stroke(); }
  g.globalAlpha=1;

  // the four LOTS (drawn pebbles) that selected this crew — a small cluster
  if (st.showLots ?? params.showLots){
    const lx = W*0.5, ly = groundY + (H-groundY)*0.55, r = W*0.012;
    for(let i=0;i<4;i++){
      const a = -Math.PI*0.5 + i*Math.PI*0.5;
      const px = lx + Math.cos(a)*r*2.4, py = ly + Math.sin(a)*r*1.3;
      pen.paint(()=>{ g.ellipse(px, py, r, r*0.8, 0,0,7); }, toneSolid(inkLevel(i===0?6:4)), Math.max(1,W*0.002));
    }
    // the marked (chosen) lot flagged in blue
    g.fillStyle=ACCENT; g.beginPath(); g.arc(lx, ly-r*1.3, r*0.4, 0,7); g.fill();
  }
}

/* the coordination BEAT-STRIP above the pole: four tick marks (one per member).
   Ticks the crew has locked onto the current beat glow ACCENT; the rest are
   faint — a legible read of `synchrony`. */
function drawBeatStrip(pen, W, H, beam, helpers, st){
  if (!(st.showBeat ?? params.showBeat)) return;
  const g = pen.ctx, s = beam.s;
  const y = beam.at(beam.cx).y - s*0.42;
  g.strokeStyle=INK; g.globalAlpha=0.35; g.lineWidth=Math.max(1,W*0.002);
  g.beginPath(); g.moveTo(helpers[0].cxPos, y); g.lineTo(helpers[3].cxPos, y); g.stroke();
  g.globalAlpha=1;
  const sync = clamp01(st.synchrony ?? params.synchrony);
  helpers.forEach((h,i)=>{
    const locked = Math.abs(h.beat - helpers.length*0 - h.groupBeat) < 0.25 || sync>0.85;
    const on = sync>0.85 || h.locked;
    g.strokeStyle = on ? ACCENT : INK;
    g.globalAlpha = on ? 1 : 0.3;
    g.lineWidth = Math.max(2, s*(on?0.03:0.02));
    g.beginPath(); g.moveTo(h.cxPos, y - s*0.06); g.lineTo(h.cxPos, y + s*0.06); g.stroke();
    if (on){ g.fillStyle=ACCENT; g.beginPath(); g.arc(h.cxPos, y - s*0.06, s*0.02, 0,7); g.fill(); }
  });
  g.globalAlpha=1;
}

/* ============================================================
   build the four members deterministically. beats come from the global beat +
   a synchrony stagger: synchrony=1 -> all one beat (unison lift-team); lower ->
   the four-beat cycle spread left->right so the whole coordinated action reads
   in one frame. Formation presets pin the crew to a single beat.
   ============================================================ */
function buildHelpers(W, H, st, beam){
  const p = { ...params, ...st };
  const groundY = beam.groundY;
  const sync = clamp01(p.synchrony);
  let groupBeat = p.beat;

  if (p.formation==="lift")     groupBeat = 0;
  else if (p.formation==="carry")    groupBeat = 1;
  else if (p.formation==="rotate")   groupBeat = 2;
  else if (p.formation==="withdraw") groupBeat = 3;
  const unison = (p.formation && p.formation!=="rehearse");

  const xs = [0.205, 0.40, 0.60, 0.795];   // four evenly-spaced members
  const helpers = [];
  for(let i=0;i<4;i++){
    // synchrony spreads the beat: high sync -> everyone near groupBeat;
    // low sync -> members fan out across the whole 0..3 cycle.
    let beat;
    if (unison) beat = clamp(groupBeat + (1-sync)*(i-1.5)*0.5, 0, 3);
    else        beat = clamp(lerp(i, groupBeat, sync), 0, 3);   // sync=0 -> i (full cycle), sync=1 -> unison
    const rng = rnd((i*167+29)>>>0);
    const s = H*SCALE*(0.97+ (i%2)*0.03);
    const cxPos = W*xs[i];
    const gripX = clamp(cxPos, beam.x0+s*0.12, beam.x1-s*0.12);
    const locked = Math.abs(beat - groupBeat) < 0.28;
    helpers.push({
      idx:i, cx:cxPos, cxPos, footY: groundY, s, beat, groupBeat, locked,
      dir: 1, gripX,
      feat:{ beard: (i%2===1), headS: 0.94+rng()*0.12 },
      sh:{ skin:2, tunic: 5 - (i%2), hair:6 },
    });
  }
  return { helpers, sync };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const beam = makeBeam(W, H, st);
  drawCave(pen, W, H, st);
  const B = buildHelpers(W, H, st, beam);

  // draw bodies back->front by member index parity for slight overlap depth
  const order = [0,3,1,2];
  const drawn = new Array(4);
  order.forEach(i => { drawn[i] = drawHelper(pen, B.helpers[i], beam); });
  // the single rigid pole over the raised arms
  drawBeam(pen, beam);
  // clasp hands + motion accents over the pole
  order.forEach(i => drawGrips(pen, drawn[i]));
  // the coordination beat-strip
  drawBeatStrip(pen, W, H, beam, B.helpers, st);
}

export const asset = {
  id:"ensemble.four-chosen-helpers",
  type:"ENSEMBLE",
  name:"Four chosen helpers",
  statusWord:"IN STEP",
  scene:"OD-B09-S08",

  params,
  // ONE separable member template (drawHelper) instanced exactly four times,
  // all gripping ONE shared rigid beam
  member:{ template:"helper", count:4, beats:["lift","carry","rotate","withdraw"], shared:"beam" },
  // back -> front draw order the ensemble honors
  layers:["cave","lots","helper-back","helper-front","beam","grips","beat-strip"],
  // normalized 0..1 anchors: the four member slots, the four beam grips, the
  // pole ends, the lots, camera
  anchors:{
    "helper:0":{x:.205,y:.86}, "helper:1":{x:.40,y:.86}, "helper:2":{x:.60,y:.86}, "helper:3":{x:.795,y:.86},
    "grip:0":{x:.205,y:.55}, "grip:1":{x:.40,y:.55}, "grip:2":{x:.60,y:.55}, "grip:3":{x:.795,y:.55},
    "beam:butt":{x:.075,y:.56}, "beam:tip":{x:.94,y:.55},
    "lots":{x:.50,y:.92}, "center":{x:.50,y:.62}, "camera:wide":{x:.50,y:.50},
  },
  // walkable cave floor the crew occupy (for scene placement/pathing)
  zones:{ floor:{ x0:.06,y0:.84,x1:.94,y1:.98 }, drill:{ x0:.12,y0:.50,x1:.90,y1:.86 } },
  states:{
    initial:"rehearse",
    nodes:{
      // the four-beat cycle spread across the crew (the default rehearsal read)
      rehearse: { preview:{ formation:"rehearse", synchrony:0.30, status:"REHEARSING" } },
      // all four locked into the same beat (lift-team unison)
      lift:     { preview:{ formation:"lift",     synchrony:1, beamLift:0.86, status:"HEAVE" } },
      carry:    { preview:{ formation:"carry",    synchrony:1, beamLift:1.10, status:"BEARING" } },
      rotate:   { preview:{ formation:"rotate",   synchrony:1, beamLift:1.00, status:"BORING" } },
      withdraw: { preview:{ formation:"withdraw", synchrony:1, beamLift:0.96, status:"DRAWING BACK" } },
    },
    edges:[["rehearse","lift"],["lift","carry"],["carry","rotate"],
           ["rotate","withdraw"],["withdraw","lift"],["rehearse","carry"]],
  },
  channels:["beat","synchrony","formation","beamLift","beamTilt"],

  // neutral preview = the whole coordinated cycle read across the four at once:
  // lift -> carry -> rotate -> withdraw, the crew mid-rehearsal, not yet locked
  preview:()=>({ formation:"rehearse", beat:1.5, synchrony:0.30, beamLift:1.02,
                 beamTilt:-0.05, showLots:true, showBeat:true,
                 status:"IN STEP", progress:0.42 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
