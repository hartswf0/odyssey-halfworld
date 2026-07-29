/* creature.friendly-farm-dogs — Eumaeus's steading dogs in Book XVI.
   CREATURE asset. THE SAME animals as creature.guard-dogs (OD-B14-S01), which
   drove Odysseus onto the ground; here they meet Telemachus and do the one
   thing a guard dog does that no diagram of a guard dog shows: they SWITCH.
   The atlas line is "same guard dogs switching to recognition, wag, circle,
   and settle behaviors", so this module is built around the switch itself —
   one articulated quadruped template driven by continuous behaviour knobs, so
   THREAT and RECOGNITION are the two ends of the same rig, not two drawings.

   The tells that carry the switch (all rigged, none baked):
     ear      1 = pricked hard forward (threat)  ->  0 = swept back along the
              neck, soft (fawning). The single loudest canine signal.
     hackle   raised zigzag along the topline  ->  flat.
     teeth    bared fang triangles in a dark maw  ->  no teeth, a lolling
              TONGUE in an open panting mouth.
     tail     stiff high sabre, still  ->  wagging arc with sweep marks.
     topline  high and forward-leaning  ->  lowered, or dropped into a full
              PLAY-BOW (forelegs flat, rump up) — the extreme friendly pose.
     eye      hard glare + snarl creases  ->  soft lidded eye, no crease.

   Fully custom quadruped geometry on engine primitives: two-segment legs with
   paws, articulated neck, gaze head, hinged jaw, ears, tail. Locomotion is
   exposed (gait drives paw swing + lift) so the circling behaviour reads as
   movement. Drawn in SOLID grays + hard contour; the engine POST pass supplies
   the dot-matrix halftone. Do NOT pre-dither.

   Atlas: OD-B16-S01 — the dogs greet Telemachus without aggression.
   Verify:  node harness/render.mjs assets/creature/friendly-farm-dogs.mjs --pipeline MESH */
import { makePen, toneSolid, inkLevel, INK, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- flat tone levels (POST turns them into dots) ---- */
const T_BODY    = ()=> toneSolid(inkLevel(4));
const T_HEAD    = ()=> toneSolid(inkLevel(4));
const T_NEARLEG = ()=> toneSolid(inkLevel(5));
const T_FARLEG  = ()=> toneSolid(inkLevel(6));
const T_EAR     = ()=> toneSolid(inkLevel(6));
const T_MUZZLE  = ()=> toneSolid(inkLevel(5));
const T_TAIL    = ()=> toneSolid(inkLevel(4));
const T_MOUTH   = ()=> toneSolid(inkLevel(7));   // dark open maw
const T_TONGUE  = ()=> toneSolid(inkLevel(2));   // pale tongue against the maw
const T_TOOTH   = ()=> inkLevel(1);              // near-paper fangs

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;

/* ---------- behaviour presets ----------
   Absolute fractions of S (dog scale) + 0..1 behaviour knobs. ONE template.
   `soft` flips the face from glare+snarl to a lidded, panting expression. */
const BEHAVIOUR = {
  // the Book XIV animal: hackles up, teeth out, tail rigid, weight forward
  threat:   { wither:0.172, croup:0.158, headFwd:0.50, headY:0.248, ear:1.00,
              jaw:0.78, teeth:1, tongue:0,    hackle:1.00, tailA:1.18, tailL:0.90,
              wag:0,   gait:0, bow:0, lean:0.14, gazeDown:0,    soft:0 },
  // the switch has happened: ears down, head lowered, tail beginning to swing
  recognise:{ wither:0.150, croup:0.156, headFwd:0.40, headY:0.206, ear:0.10,
              jaw:0.28, teeth:0, tongue:0.55, hackle:0,    tailA:0.85, tailL:0.95,
              wag:0.55, gait:0, bow:0, lean:0.05, gazeDown:0.18, soft:1 },
  // full fawning: mouth open, tongue out, tail sweeping hard
  wag:      { wither:0.154, croup:0.160, headFwd:0.42, headY:0.214, ear:0.06,
              jaw:0.50, teeth:0, tongue:1.00, hackle:0,    tailA:1.00, tailL:1.00,
              wag:1.00, gait:0, bow:0, lean:0.08, gazeDown:0.10, soft:1 },
  // PLAY-BOW — the extreme friendly pose: forelegs flat, chest down, rump high
  bow:      { wither:0.086, croup:0.176, headFwd:0.50, headY:0.176, ear:0.08,
              jaw:0.42, teeth:0, tongue:0.70, hackle:0,    tailA:1.02, tailL:0.86,
              wag:1.00, gait:0, bow:1, lean:0.00, gazeDown:0.05, soft:1 },
  // circling the returning man — locomotion on, tail still going
  circle:   { wither:0.148, croup:0.152, headFwd:0.42, headY:0.204, ear:0.32,
              jaw:0.32, teeth:0, tongue:0.60, hackle:0,    tailA:0.95, tailL:0.95,
              wag:0.70, gait:1, bow:0, lean:0.04, gazeDown:0.12, soft:1 },
  // neutral standing animal, nothing asked of it
  neutral:  { wither:0.158, croup:0.154, headFwd:0.40, headY:0.216, ear:0.62,
              jaw:0.00, teeth:0, tongue:0,    hackle:0.10, tailA:0.55, tailL:1.00,
              wag:0.10, gait:0, bow:0, lean:0.00, gazeDown:0,    soft:1 },
};

/* ---------- one leg: two segments + paw ---------- */
function drawLeg(pen, hip, knee, paw, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(paw.x,paw.y); }, tone, w*0.82);
  pen.paint(()=>{ g.ellipse(paw.x, paw.y - w*0.15, w*0.85, w*0.5, 0, 0, TAU); }, tone, 3.5);
}

/* ---------- TAIL: elevation angle + wag sweep + sweep marks ----------
   The wag is the loudest friendly signal in the frame, so it is drawn twice:
   the tail itself at its current angle, and two faint marks at the extremes of
   the sweep so a still frame still reads as motion. */
function drawTail(pen, tb, U, dir, cfg, t, phase){
  const g = pen.ctx;
  const wag = cfg.wag || 0;
  const sweep = wag * 0.52;
  const a = cfg.tailA + Math.sin(t*8.2 + phase) * sweep;
  const L = U * 0.62 * (cfg.tailL || 1);
  const vec = (ang, r)=> P(tb.x - dir*Math.cos(ang)*r, tb.y - Math.sin(ang)*r);

  // sweep marks first (behind the tail)
  if (wag > 0.15){
    const th = ang => dir > 0 ? ang + Math.PI : -ang;
    const t1 = th(cfg.tailA - sweep*1.05), t2 = th(cfg.tailA + sweep*1.05);
    g.save(); g.globalAlpha = 0.46; g.strokeStyle = INK; g.lineWidth = 3; g.lineCap="round";
    for (const r of [L*0.70, L*1.04]){
      g.beginPath(); g.arc(tb.x, tb.y, r, Math.min(t1,t2), Math.max(t1,t2)); g.stroke();
    }
    g.restore();
  }
  const tip = vec(a, L);
  const ctl = vec(a - 0.45, L*0.62);
  pen.limb(()=>{ g.moveTo(tb.x,tb.y); g.quadraticCurveTo(ctl.x,ctl.y,tip.x,tip.y); },
           T_TAIL(), U*0.095);
}

/* ---------- dog head: skull, ears, hinged jaw, teeth OR tongue, eye ---------- */
function drawDogHead(pen, HC, rx, ry, dir, U, cfg){
  const g = pen.ctx;
  const earUp = cfg.ear, jaw = cfg.jaw || 0, teeth = cfg.teeth || 0;
  const tongue = cfg.tongue || 0, soft = cfg.soft, gazeDown = cfg.gazeDown || 0;

  /* ears: earUp=1 pricked hard up/forward (threat); earUp=0 flattened BACK
     across the skull (fawning). Both ears are drawn BEHIND the skull so the
     laid-back pair silhouettes off the back of the head instead of blobbing
     over the cheek — the head has to keep reading as a head at thumbnail
     size, and this is the loudest signal on the animal. */
  const ear = (bx, tone)=>{
    const tipUp   = P(HC.x + dir*rx*0.06 + bx, HC.y - ry*0.35 - lerp(ry*0.10, ry*1.70, earUp));
    const tipBack = P(HC.x - dir*rx*1.24 + bx, HC.y - ry*0.30);
    const tip = P(lerp(tipBack.x, tipUp.x, earUp), lerp(tipBack.y, tipUp.y, earUp));
    pen.paint(()=>{
      g.moveTo(HC.x - dir*rx*0.24 + bx, HC.y - ry*0.62);
      g.lineTo(HC.x + dir*rx*0.34 + bx, HC.y - ry*0.42);
      g.lineTo(tip.x, tip.y);
      g.closePath();
    }, tone, 4);
  };
  ear(-dir*rx*0.16, T_EAR());                       // far ear
  ear( dir*rx*0.08, T_EAR());                       // near ear

  // ---- upper jaw / muzzle wedge (fixed to the skull) ----
  const noseTip = P(HC.x + dir*(rx*0.55 + U*0.40), HC.y + ry*0.26);
  const lipY = noseTip.y + ry*0.20;
  pen.paint(()=>{
    g.moveTo(HC.x + dir*rx*0.18, HC.y - ry*0.32);
    g.quadraticCurveTo(HC.x + dir*(rx*0.72 + U*0.15), HC.y - ry*0.10, noseTip.x, noseTip.y);
    g.lineTo(noseTip.x - dir*U*0.02, lipY);
    g.quadraticCurveTo(HC.x + dir*rx*0.50, HC.y + ry*0.32, HC.x + dir*rx*0.10, HC.y + ry*0.24);
    g.closePath();
  }, T_MUZZLE(), 4);

  // ---- open maw + hinged lower jaw ----
  const drop = jaw * ry * 0.90;
  const commis = P(HC.x + dir*rx*0.34, HC.y + ry*0.28);          // corner of the mouth
  const chin   = P(noseTip.x - dir*U*0.04, lipY + drop);
  if (jaw > 0.02){
    pen.paint(()=>{
      g.moveTo(commis.x, commis.y);
      g.lineTo(noseTip.x - dir*U*0.02, lipY);
      g.lineTo(chin.x, chin.y);
      g.quadraticCurveTo(HC.x + dir*rx*0.56, chin.y + ry*0.08, commis.x, commis.y);
      g.closePath();
    }, T_MOUTH(), 3.5);
  }
  pen.paint(()=>{
    g.moveTo(commis.x, commis.y + ry*0.02);
    g.lineTo(chin.x, chin.y);
    g.quadraticCurveTo(chin.x - dir*U*0.10, chin.y + ry*0.22, HC.x + dir*rx*0.38, HC.y + ry*0.46 + drop*0.6);
    g.quadraticCurveTo(HC.x + dir*rx*0.30, HC.y + ry*0.34, commis.x, commis.y + ry*0.02);
    g.closePath();
  }, T_MUZZLE(), 4);

  // ---- skull (over the ear roots and the muzzle base) ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, rx, ry, 0, 0, TAU); }, T_HEAD(), 4);

  // ---- snarl creases + heavy brow (threat only) ----
  if (teeth){
    pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.34, HC.y - ry*0.06); g.lineTo(HC.x + dir*rx*0.52, HC.y - ry*0.22); }, 2.2);
    pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.44, HC.y - ry*0.02); g.lineTo(HC.x + dir*rx*0.60, HC.y - ry*0.16); }, 2.2);
    pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.10, HC.y - ry*0.22); g.lineTo(HC.x + dir*rx*0.46, HC.y - ry*0.04); }, 3.2);
  } else {
    pen.ink(()=>{ g.moveTo(HC.x + dir*rx*0.16, HC.y - ry*0.14); g.lineTo(HC.x + dir*rx*0.44, HC.y - ry*0.02); }, 2.2);
  }

  // ---- eye: hard glare (threat) vs soft lidded eye (friendly) ----
  const eye = P(HC.x + dir*rx*0.40, HC.y - ry*0.06 + gazeDown*ry*0.34);
  g.fillStyle = INK;
  g.beginPath();
  g.ellipse(eye.x, eye.y, rx*(soft?0.115:0.145), rx*(soft?0.085:0.115), 0, 0, TAU);
  g.fill();
  if (soft){
    pen.ink(()=>{ g.moveTo(eye.x - rx*0.19, eye.y - rx*0.05);
                  g.quadraticCurveTo(eye.x, eye.y - rx*0.24, eye.x + rx*0.19, eye.y - rx*0.06); }, 2.2);
  }

  // ---- nose ----
  g.fillStyle = INK; g.beginPath();
  g.ellipse(noseTip.x + dir*rx*0.02, noseTip.y, rx*0.16, rx*0.13, 0, 0, TAU); g.fill();

  // ---- BARED TEETH (threat) ----
  if (teeth && jaw > 0.2){
    const topY = lipY, botY = chin.y;
    for (let i=0;i<3;i++){
      const fx = noseTip.x - dir*(U*0.05 + i*U*0.080);
      const fw = (i===0?rx*0.16:rx*0.10);
      g.beginPath();
      g.moveTo(fx - fw, topY); g.lineTo(fx + fw, topY);
      g.lineTo(fx, topY + (i===0?ry*0.44:ry*0.28)); g.closePath();
      g.fillStyle = T_TOOTH(); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke();
    }
    for (let i=0;i<2;i++){
      const fx = noseTip.x - dir*(U*0.09 + i*U*0.090);
      const fw = (i===0?rx*0.13:rx*0.09);
      g.beginPath();
      g.moveTo(fx - fw, botY); g.lineTo(fx + fw, botY);
      g.lineTo(fx, botY - (i===0?ry*0.36:ry*0.22)); g.closePath();
      g.fillStyle = T_TOOTH(); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke();
    }
  }

  // ---- LOLLING TONGUE (the friendly tell) ----
  if (!teeth && tongue > 0.05 && jaw > 0.1){
    const bx = noseTip.x - dir*U*0.10, by = lipY + ry*0.08;
    const len = ry*(0.55 + 0.85*tongue), wid = ry*0.34;
    pen.paint(()=>{
      g.moveTo(bx - dir*wid*0.55, by);
      g.quadraticCurveTo(bx + dir*wid*1.15, by + len*0.55, bx + dir*wid*0.15, by + len);
      g.quadraticCurveTo(bx - dir*wid*1.20, by + len*0.55, bx - dir*wid*0.55, by);
      g.closePath();
    }, T_TONGUE(), 3);
    pen.ink(()=>{ g.moveTo(bx + dir*wid*0.05, by + len*0.18);
                  g.lineTo(bx + dir*wid*0.12, by + len*0.78); }, 2);
  }

  // ---- closed mouth line ----
  if (jaw <= 0.1){
    pen.ink(()=>{ g.moveTo(noseTip.x - dir*U*0.02, lipY - ry*0.04);
                  g.lineTo(HC.x + dir*rx*0.24, HC.y + ry*0.32); }, 2.4);
  }
}

/* ---------- STANDING / BOWING dog ---------- */
function drawStandDog(pen, cx, gy, S, dir, cfg, t, phase){
  const g = pen.ctx;
  const U = S*0.255;
  const bow = cfg.bow || 0;
  const shoulderX = cx + dir*(U*0.34 + (cfg.lean||0)*U);
  const hipX      = cx - dir*U*0.34;
  const witherY = gy - S*cfg.wither;
  const croupY  = gy - S*cfg.croup;

  // locomotion
  const ph = t*4.4 + phase;
  const gA = cfg.gait ? Math.sin(ph) : 0;
  const gB = cfg.gait ? Math.sin(ph + Math.PI) : 0;
  const swF  = cfg.gait ? dir*U*0.20*gA : 0;
  const swR  = cfg.gait ? dir*U*0.20*gB : 0;
  const liftF = cfg.gait ? Math.max(0,gA)*S*0.030 : 0;
  const liftR = cfg.gait ? Math.max(0,gB)*S*0.030 : 0;

  // ground shadow
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, gy+4, U*0.80, U*0.14, 0, 0, TAU); g.fill(); g.restore();

  // torso key points
  const WP = P(shoulderX, witherY);
  const C  = P(hipX,      croupY);
  const CF = P(shoulderX + dir*U*0.22, gy - S*cfg.wither*0.56);
  const CB = P(shoulderX + dir*U*0.08, gy - S*cfg.wither*0.28);
  const BR = P(hipX + dir*U*0.10,      gy - S*cfg.croup*0.30);
  const RT = P(hipX - dir*U*0.16,      gy - S*cfg.croup*0.64);

  // ---- tail (behind everything) ----
  drawTail(pen, P(hipX - dir*U*0.10, croupY + S*0.006), U, dir, cfg, t, phase);

  // ---- FAR legs ----
  const off = dir*U*0.07;
  drawLeg(pen,
    P(shoulderX-off, witherY + S*0.006),
    bow ? P(shoulderX-off + dir*U*0.06, gy - S*0.022)
        : P(shoulderX-off + dir*U*0.03, lerp(witherY, gy, 0.55)),
    bow ? P(shoulderX-off + dir*U*0.42, gy - S*0.004)
        : P(shoulderX-off + swF*0.9, gy - liftF),
    U*0.11, T_FARLEG());
  drawLeg(pen,
    P(hipX-off, croupY + S*0.006),
    P(hipX-off + dir*U*0.09, lerp(croupY, gy, 0.52)),
    P(hipX-off + swR*0.9, gy - liftR),
    U*0.11, T_FARLEG());

  // ---- torso ----
  pen.paint(()=>{
    g.moveTo(CF.x, CF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.14, WP.y - S*0.012, WP.x, WP.y);   // chest -> withers
    g.quadraticCurveTo(cx, Math.min(WP.y,C.y) - S*0.008, C.x, C.y);           // back
    g.quadraticCurveTo(hipX - dir*U*0.14, C.y + S*0.004, RT.x, RT.y);         // croup -> thigh
    g.quadraticCurveTo(hipX - dir*U*0.06, BR.y, BR.x, BR.y);                  // thigh -> belly rear
    g.quadraticCurveTo(cx, BR.y + S*0.010, CB.x, CB.y);                       // belly
    g.quadraticCurveTo(shoulderX + dir*U*0.20, CB.y - S*0.006, CF.x, CF.y);   // chest bottom
    g.closePath();
  }, T_BODY(), 4.5);

  // ---- raised HACKLES along the topline (threat only) ----
  if ((cfg.hackle||0) > 0.05){
    g.strokeStyle = INK; g.lineWidth = 2.4; g.lineJoin = "round";
    g.beginPath();
    const n = 9;
    for (let i=0;i<=n;i++){
      const s = i/n;
      const bx = lerp(WP.x, C.x, s);
      const by = lerp(WP.y, C.y, s) - (i%2 ? S*0.030*cfg.hackle : 0);
      if (i===0) g.moveTo(bx,by); else g.lineTo(bx,by);
    }
    g.stroke();
  }

  // ---- neck wedge ----
  const HC = P(shoulderX + dir*U*cfg.headFwd, gy - S*cfg.headY);
  const rx = U*0.275, ry = U*0.222;
  /* In the bow the withers drop almost to the ground while the head stays up,
     so a neck rooted at the withers leaves a deep V between back and skull.
     Root it further back along the topline instead — a broad trapezius that
     carries the head, which is what a bowing dog actually shows. */
  const nbX = shoulderX - dir*U*(bow ? 0.34 : 0.03);
  const nbY = (bow ? lerp(witherY, croupY, 0.36) : witherY) + S*0.006;
  pen.paint(()=>{
    g.moveTo(nbX, nbY);
    g.quadraticCurveTo(HC.x - dir*rx*0.7, HC.y - ry*0.45, HC.x - dir*rx*0.2, HC.y - ry*0.24);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.58);
    g.quadraticCurveTo(shoulderX + dir*U*0.26, CF.y - S*0.010, CF.x, CF.y);
    g.closePath();
  }, T_BODY(), 4.5);

  drawDogHead(pen, HC, rx, ry, dir, U, cfg);

  // ---- NEAR legs (over the body) ----
  drawLeg(pen,
    P(shoulderX, witherY + S*0.006),
    bow ? P(shoulderX + dir*U*0.09, gy - S*0.020)
        : P(shoulderX + dir*U*0.03, lerp(witherY, gy, 0.55)),
    bow ? P(shoulderX + dir*U*0.46, gy - S*0.004)
        : P(shoulderX + swF, gy - liftR),
    U*0.12, T_NEARLEG());
  drawLeg(pen,
    P(hipX, croupY + S*0.006),
    P(hipX + dir*U*0.09, lerp(croupY, gy, 0.52)),
    P(hipX + swR, gy - liftF),
    U*0.12, T_NEARLEG());
}

/* ---------- SETTLED dog (lying down, calm, tail curled) ---------- */
function drawSettleDog(pen, cx, gy, S, dir, t, phase){
  const g = pen.ctx;
  const U = S*0.255;
  const shoulderX = cx + dir*U*0.34;
  const hipX      = cx - dir*U*0.40;
  const breath = Math.sin(t*1.3 + phase)*S*0.004;

  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, gy+3, U*0.94, U*0.14, 0, 0, TAU); g.fill(); g.restore();

  // tail curled around the flank, resting on the ground
  pen.limb(()=>{ g.moveTo(hipX - dir*U*0.08, gy - S*0.024);
    g.quadraticCurveTo(hipX - dir*U*0.48, gy - S*0.006, hipX - dir*U*0.26, gy - S*0.056); },
    T_TAIL(), U*0.090);

  // folded rear haunch
  pen.paint(()=>{ g.ellipse(hipX + dir*U*0.08, gy - S*0.058, U*0.34, S*0.060, 0, 0, TAU); }, T_BODY(), 4.5);

  // lying torso — a long low loaf
  pen.paint(()=>{
    g.moveTo(shoulderX + dir*U*0.28, gy - S*0.030);
    g.quadraticCurveTo(shoulderX + dir*U*0.14, gy - S*0.126 + breath, shoulderX - dir*U*0.02, gy - S*0.120 + breath);
    g.quadraticCurveTo(cx, gy - S*0.132 + breath, hipX + dir*U*0.10, gy - S*0.106);
    g.quadraticCurveTo(hipX - dir*U*0.28, gy - S*0.024, hipX - dir*U*0.08, gy - S*0.006);
    g.lineTo(shoulderX, gy - S*0.006);
    g.closePath();
  }, T_BODY(), 4.5);

  // outstretched forepaws
  drawLeg(pen, P(shoulderX, gy - S*0.052), P(shoulderX + dir*U*0.18, gy - S*0.022),
          P(shoulderX + dir*U*0.44, gy - S*0.004), U*0.10, T_FARLEG());
  drawLeg(pen, P(shoulderX + dir*U*0.03, gy - S*0.052), P(shoulderX + dir*U*0.21, gy - S*0.022),
          P(shoulderX + dir*U*0.48, gy - S*0.004), U*0.11, T_NEARLEG());

  // neck + calm raised head
  const HC = P(shoulderX + dir*U*0.62, gy - S*0.112 + breath);
  const rx = U*0.265, ry = U*0.215;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.02, gy - S*0.114 + breath);
    g.quadraticCurveTo(HC.x - dir*rx*0.8, HC.y - ry*0.34, HC.x - dir*rx*0.2, HC.y - ry*0.22);
    g.lineTo(HC.x + dir*rx*0.5, HC.y + ry*0.58);
    g.quadraticCurveTo(shoulderX + dir*U*0.34, gy - S*0.052, shoulderX + dir*U*0.28, gy - S*0.030);
    g.closePath();
  }, T_BODY(), 4.5);

  drawDogHead(pen, HC, rx, ry, dir, U,
    { ear:0.30, jaw:0.10, teeth:0, tongue:0, hackle:0, gazeDown:0.20, soft:1 });
}

/* ---------- one dog dispatch ---------- */
function drawDog(pen, cx, gy, S, dir, pose, t, phase){
  if (pose === "settle") return drawSettleDog(pen, cx, gy, S, dir, t, phase);
  drawStandDog(pen, cx, gy, S, dir, BEHAVIOUR[pose] || BEHAVIOUR.neutral, t, phase);
}

/* ---------- pack formations per behaviour ----------
   Three dogs, depth-staggered (far = smaller + higher on the plane), so the
   pack overlaps and reads as a group instead of a row of specimens. */
function formation(pose){
  switch(pose){
    case "threat":                       // the Book XIV animal: all three at the stranger
      return [
        { x:0.245, gy:0.470, sc:0.58, dir:+1, pose:"threat" },
        { x:0.755, gy:0.540, sc:0.66, dir:+1, pose:"threat" },
        { x:0.435, gy:0.760, sc:0.95, dir:+1, pose:"threat" },
      ];
    case "recognise":                    // the switch: ears drop, one goes into a bow
      return [
        { x:0.245, gy:0.470, sc:0.58, dir:+1, pose:"recognise" },
        { x:0.755, gy:0.540, sc:0.66, dir:-1, pose:"recognise" },
        { x:0.435, gy:0.760, sc:0.95, dir:+1, pose:"bow" },
      ];
    case "wag":                          // full fawning
      return [
        { x:0.245, gy:0.470, sc:0.58, dir:+1, pose:"wag" },
        { x:0.755, gy:0.540, sc:0.66, dir:-1, pose:"wag" },
        { x:0.435, gy:0.760, sc:0.95, dir:+1, pose:"bow" },
      ];
    case "circle":                       // a ring closing around the returning man
      return [
        { x:0.235, gy:0.475, sc:0.60, dir:+1, pose:"circle" },
        { x:0.765, gy:0.545, sc:0.66, dir:-1, pose:"circle" },
        { x:0.440, gy:0.765, sc:0.94, dir:-1, pose:"circle" },
      ];
    case "settle":                       // down around the yard
      return [
        { x:0.245, gy:0.485, sc:0.60, dir:+1, pose:"settle" },
        { x:0.760, gy:0.555, sc:0.66, dir:-1, pose:"settle" },
        { x:0.430, gy:0.770, sc:0.94, dir:+1, pose:"settle" },
      ];
    default:                             // "greet" — the neutral composition
      return [
        { x:0.245, gy:0.470, sc:0.58, dir:+1, pose:"recognise" },
        { x:0.755, gy:0.540, sc:0.66, dir:-1, pose:"wag" },
        { x:0.435, gy:0.760, sc:0.95, dir:+1, pose:"bow" },
      ];
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const t = state.t || 0;
  const base = Math.min(W, H) * 0.80;
  const pack = formation(state.pose || "greet");

  /* Depth-staggered ground: one line per row, not one line through the pack —
     the three dogs stand on three different distances of the same yard. */
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.12)"; ctx.lineWidth=2; ctx.lineCap="round";
  for (const d of pack){
    const half = base*d.sc*0.255*1.45;
    ctx.beginPath(); ctx.moveTo(W*d.x-half, H*d.gy+4); ctx.lineTo(W*d.x+half, H*d.gy+4); ctx.stroke();
  }
  ctx.restore();

  // far (smaller) dogs first so the near ones overlap them
  pack.map((d,i)=>({d,i})).sort((a,b)=> a.d.sc - b.d.sc)
      .forEach(({d,i})=> drawDog(pen, W*d.x, H*d.gy, base*d.sc, d.dir, d.pose, t, i*1.9));
}

export const asset = {
  id:"creature.friendly-farm-dogs",
  type:"CREATURE",
  name:"Friendly farm dogs",
  statusWord:"FAWNING",
  scene:"OD-B16-S01",
  sameAnimalsAs:"creature.guard-dogs",   // Book XIV's pack, one book later

  /* procedural knobs — ONE dog template drawn three times in formation */
  params:{
    count:3,
    breedMass:1.0,     // body mass multiplier
    aggression:0.0,    // 1 drives hackles + bared teeth; 0 is the Book XVI default
    friendliness:1.0,  // drives ear sweep-back, tongue, wag amplitude
    wagRate:8.2,       // tail sweeps per second * 2pi
    packSpread:1.0,
    faceDir:+1,        // default orientation toward the arriving man
  },
  // back -> front draw order every dog honors
  layers:["shadow","tail","sweep-marks","far-legs","body","hackles","neck",
          "head","ears","muzzle","jaw","teeth","tongue","near-legs","eye"],
  // normalized 0..1 attention / attachment anchors (neutral "greet" composition)
  anchors:{
    "dog1:head":{x:.32,y:.42}, "dog2:head":{x:.59,y:.53}, "dog3:head":{x:.83,y:.75},
    "dog1:paws":{x:.22,y:.56}, "dog2:paws":{x:.46,y:.68}, "dog3:paws":{x:.70,y:.81},
    "dog1:tail":{x:.13,y:.44}, "dog2:tail":{x:.33,y:.54}, "dog3:tail":{x:.53,y:.62},
    "arrival:telemachus":{x:.98,y:.80},   // the man they are greeting, off-frame right
    "handler:eumaeus":{x:.02,y:.84},
    "camera:pack":{x:.50,y:.62},
  },
  // collision volumes / walkable ground for placement + pathing
  zones:{
    "dog1:collision":{ x0:.10,y0:.40,x1:.36,y1:.58 },
    "dog2:collision":{ x0:.30,y0:.50,x1:.64,y1:.70 },
    "dog3:collision":{ x0:.52,y0:.62,x1:.94,y1:.84 },
    walkable:{ x0:.04,y0:.50,x1:.96,y1:.92 },
  },
  /* the behaviour switch, as a state machine. threat is reachable — these are
     the same dogs — but every path out of it lands in the friendly cluster. */
  states:{
    initial:"recognise",
    nodes:{
      threat:{    preview:{ pose:"threat",    status:"THREAT",     progress:0.16 } },
      recognise:{ preview:{ pose:"recognise", status:"RECOGNISED", progress:0.38 } },
      wag:{       preview:{ pose:"wag",   t:0.25, status:"FAWNING", progress:0.56 } },
      circle:{    preview:{ pose:"circle", t:0.4, status:"CIRCLING",progress:0.74 } },
      settle:{    preview:{ pose:"settle",     status:"SETTLED",   progress:0.94 } },
      greet:{     preview:{ pose:"greet",  t:0.2, status:"FAWNING", progress:0.46 } },
    },
    edges:[
      ["threat","recognise"],["recognise","wag"],["wag","circle"],
      ["circle","settle"],["settle","greet"],["greet","wag"],
      ["recognise","circle"],["wag","settle"],["settle","threat"],
    ],
  },
  channels:["pose","gaze","attention","gait","tail","ear","jaw","tongue","hackle"],

  preview:()=>({ pose:"greet", t:0.2, status:"FAWNING", progress:.46 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
