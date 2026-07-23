/* character.circe — the enchantress-goddess of Aeaea.
   CHARACTER asset. A striking woman in an elaborate flowing gown, long auburn
   hair, a subtle magical radiance, and a WAND she can hold, level, or strike
   with. Beautiful and gracious as a singing host — then a precise alchemist who
   transforms and jails. Distinct from Calypso by the WAND and a sharper, cooler
   elegance (paler skin, auburn hair, blade-thin radiance rays).

   Scene function:
     OD-B10-S04 — singing host becoming precise alchemist, wand operator, jailer
     OD-B10-S06 — confidence collapsing into recognition, fear, seduction, oath,
                  revised hospitality
     OD-B10-S07 — restorer applying counter-transformation, then presiding over ease
     OD-B10-S08 — unresisting guide replacing the route home with a darker route

   Built on the engine hero rig (garment:"dress") with custom solid-gray layers
   so the engine's dotify POST pass supplies the halftone:
     · a faint RADIANCE aureole of sharp rays behind the head (her divinity)
     · a loose long HAIR drape behind the figure
     · a flowing GOWN skirt drawn over the rig's legs
     · a WAND drawn from the live hand anchor after the rig, angled per beat
   Dramatic beats need brow/frown/jaw combos the base poses don't carry, so they
   are registered as bespoke poses on the shared POSES table. */
import { makeFigure, INK, gray } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

const params = {
  skin:"#f1e7d6", hairColor:"#5a2e18",
  hair:"long", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

/* ---- bespoke poses for Circe's beats ----
   composeStatic reads brow/frown/jaw ONLY from the pose def, so each signature
   emotion needs its own numeric pose. POSES is a shared module singleton, so
   registering here makes these ids resolvable by the rig. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"circe", n, opt:hands?{hands}:{} }; }

// SIGNATURE / HOSTING — the beautiful singing host: the left hand opens in song
// and welcome while the right holds the wand low like a gracious sceptre. Warm,
// self-possessed, faintly knowing smile; chin lifted; brows raised.
P("circe_host", {
  chestOpen:.5, spineLean:-.04,
  armLUpper:1.0, armLLower:-.5, handRotL:-.18,          // left hand raised, open in song
  armRUpper:-.86, armRLower:.62, handRotR:.16,          // right hand low, holding the wand
  headY:-.06, headYaw:.05,
  smile:.32, browUp:.3, eyeNarrow:.08,
}, ["open_palm","relaxed"]);

// WAND-STRIKE — the precise alchemist: the right arm thrusts the wand up and out
// on the transforming word; brows knit, eyes narrowed to a sharp aim, a small
// cold asymmetric smile, jaw set. This is the jailer's operating gesture.
P("circe_strike", {
  chestOpen:.2, spineLean:-.16, rootScale:1.05,
  armRUpper:-2.18, armRLower:.42, handRotR:.12, shoulderLiftR:.55,   // wand hand driven high
  armLUpper:.42, armLLower:-.7, handRotL:-.16,
  headY:-.03, headYaw:.04, headPitch:-.04,
  browKnit:.62, eyeNarrow:.5, mouthAsym:.5, smile:.16, jaw:.12,
}, ["relaxed","relaxed"]);

// RECOGNITION / ALARM — confidence collapsing: she recoils, spine back, the near
// hand flung up to guard, wand loosened low; brows fly up, eyes go wide, jaw
// drops mid-gasp. The moment the spell fails and she knows who he is.
P("circe_alarm", {
  spineLean:.34, rootScale:.97, bodyYaw:.06,
  armLUpper:-.5, armLLower:-1.72, handRotL:.28, shoulderLiftL:.5,   // near hand up, warding
  armRUpper:-.42, armRLower:.66, handRotR:.1,                         // wand hand dropping away
  headPitch:.06, headY:.04, neckPitch:.06,
  browUp:.9, browKnit:.16, eyeWide:.72, jaw:.5, frown:.28,
}, ["stop","relaxed"]);

// SEDUCTION — the revised, softer host: she leans in, the offered hand reaching,
// head tilted, a warm inviting smile under half-lidded eyes; wand held low and
// idle at her side. Persuasion, not power.
P("circe_seduce", {
  bodyYaw:.13, headYaw:.2, headRoll:.12, spineLean:-.26,
  armLUpper:.9, armLLower:-.36, handRotL:-.12,                        // near hand offered forward
  armRUpper:-.8, armRLower:.6, handRotR:.14,                          // wand hand low, idle
  headY:.02, gazeY:-.02,
  smile:.4, browUp:.28, eyeNarrow:.34,
}, ["offering","relaxed"]);

// OATH — she swears the great oath: the free left hand raised flat and high, the
// wand hand held quiet at her side; face level and solemn, brows a touch raised,
// gaze steady and direct. A binding promise, not a spell.
P("circe_oath", {
  spineLean:-.02,
  armLUpper:2.5, armLLower:-.2, handRotL:-.1, shoulderLiftL:.66,      // left hand raised, palm out (oath)
  armRUpper:-.78, armRLower:.6, handRotR:.14,                          // wand hand at side
  headY:-.03,
  browUp:.24, eyeNarrow:.06, mouthAsym:.06,
}, ["stop","relaxed"]);

// RESTORING — the counter-transformation, then presiding over ease: the wand
// hand extended forward and level, the gesture gentle and giving; a benevolent
// warm smile, brows relaxed-open, eyes calm. The undoing of her own work.
P("circe_restore", {
  bodyYaw:-.06, spineLean:-.1,
  armRUpper:-1.28, armRLower:.34, handRotR:.14,                        // wand hand forward, level
  armLUpper:.5, armLLower:-.44, handRotL:-.12,
  headYaw:-.06, headY:-.02, gazeY:.04,
  smile:.28, browUp:.22, eyeNarrow:.1,
}, ["relaxed","relaxed"]);

// GUIDING — the unresisting guide: she points the darker road with the wand,
// arm and gaze following the line she draws; a sober, resigned face, faint
// frown, brows a little knit. She replaces the way home with the way below.
P("circe_guide", {
  bodyYaw:-.16, headYaw:-.3, spineLean:-.05,
  armRUpper:-1.5, armRLower:.12, handRotR:.1,                          // wand hand pointing out
  armLUpper:.3, armLLower:-.4,
  gazeX:-.5, gazeY:.06,
  browKnit:.28, frown:.24, eyeNarrow:.18,
}, ["relaxed","point"]);

/* Subtle RADIANCE — a faint aureole behind the head, but with SHARP blade-thin
   rays (cooler and more precise than Calypso's soft halo) to mark her sharper
   elegance. Kept light (near paper) so dotify renders it as a soft scatter of
   dots that never competes with the hard contour. Drawn FIRST (behind all). */
function drawRadiance(ctx, W, H){
  const cx = W*0.50, cy = H*0.180, R = W*0.125;
  ctx.save();
  ctx.fillStyle = gray(0xe6);
  ctx.beginPath(); ctx.arc(cx, cy, R*1.28, 0, 7); ctx.fill();
  // sharp, tapered blade rays — thinner and longer than a soft halo
  ctx.fillStyle = gray(0xcc);
  for (let i=0;i<20;i++){
    const a = (i/20)*Math.PI*2 - Math.PI/2;
    const r0 = R*1.1, r1 = R*(1.85 + 0.34*(i%2));
    const wdt = 0.032;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a-wdt)*r0, cy+Math.sin(a-wdt)*r0);
    ctx.lineTo(cx+Math.cos(a)*r1,     cy+Math.sin(a)*r1);
    ctx.lineTo(cx+Math.cos(a+wdt)*r0, cy+Math.sin(a+wdt)*r0);
    ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = gray(0xc2); ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.arc(cx, cy, R*1.1, 0, 7); ctx.stroke();
  ctx.restore();
}

/* Loose immortal HAIR — a long auburn mass behind head/shoulders falling to
   mid-torso. Solid gray; dotify weaves it. Drawn BEFORE the figure (behind it)
   at fixed fractions. */
function drawHairDrape(ctx, W, H){
  const cx = W*0.50, crownY = H*0.132, dropY = H*0.585;
  ctx.fillStyle = gray(0x40); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - W*0.178, crownY + H*0.052);
  ctx.quadraticCurveTo(cx - W*0.225, H*0.35, cx - W*0.150, dropY);
  ctx.quadraticCurveTo(cx - W*0.078, dropY + H*0.030, cx, dropY + H*0.014);
  ctx.quadraticCurveTo(cx + W*0.078, dropY + H*0.030, cx + W*0.150, dropY);
  ctx.quadraticCurveTo(cx + W*0.225, H*0.35, cx + W*0.178, crownY + H*0.052);
  ctx.quadraticCurveTo(cx, crownY - H*0.042, cx - W*0.178, crownY + H*0.052);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // strand seams so it reads as flowing hair, not a helmet
  ctx.strokeStyle = INK; ctx.lineWidth = 2.1; ctx.lineCap = "round";
  for (const s of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.128, crownY + H*0.02);
    ctx.quadraticCurveTo(cx + s*W*0.196, H*0.35, cx + s*W*0.126, dropY - H*0.02);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + s*W*0.064, crownY + H*0.01);
    ctx.quadraticCurveTo(cx + s*W*0.096, H*0.36, cx + s*W*0.052, dropY - H*0.01);
    ctx.stroke();
  }
}

/* Flowing GOWN skirt — an elaborate flared bell from a high waist to the ankles,
   drawn OVER the rig's legs so she reads as gowned. Narrow at the waist so the
   gesturing hands stay clear; a decorated hem band marks the "elaborate" gown. */
function drawSkirt(ctx, W, H){
  const cx = W*0.50, waistY = H*0.600, hemY = H*0.905;
  const wTop = W*0.084, wHem = W*0.182;
  ctx.fillStyle = gray(0x92); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.78, H*0.79, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.028, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.78, H*0.79, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // soft vertical folds
  ctx.strokeStyle = INK; ctx.lineWidth = 2.3; ctx.lineCap = "round";
  for (let i=-2;i<=2;i++){
    const tx = i/2.2;
    ctx.beginPath();
    ctx.moveTo(cx + tx*wTop, waistY + H*0.012);
    ctx.quadraticCurveTo(cx + tx*wHem*0.92, H*0.79, cx + tx*wHem, hemY - H*0.004);
    ctx.stroke();
  }
  // decorated hem band (the elaborate gown)
  ctx.strokeStyle = INK; ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(cx - wHem*0.96, hemY - H*0.028);
  ctx.quadraticCurveTo(cx, hemY - H*0.006, cx + wHem*0.96, hemY - H*0.028);
  ctx.stroke();
  ctx.fillStyle = gray(0x2c);
  for (let i=-3;i<=3;i++){
    const t = i/3, hx = cx + t*wHem*0.9, hy = hemY - H*0.020 + Math.abs(t)*H*0.010;
    ctx.beginPath(); ctx.arc(hx, hy, W*0.008, 0, 7); ctx.fill();
  }
  // high waist sash
  ctx.strokeStyle = INK; ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY + H*0.004);
  ctx.quadraticCurveTo(cx, waistY + H*0.018, cx + wTop, waistY + H*0.004);
  ctx.stroke();
}

/* WAND — the signature prop. Drawn AFTER the rig from the live hand anchor so it
   always reads as held. A tapered near-black rod with a gripped base and a small
   crystal orb at the tip wrapped in a faint magical glow (light gray, so dotify
   scatters it into a soft aura). Angle is taken from neck->hand by default (the
   wand continues the line of the arm) or overridden per beat via st.wandDir. */
function drawWand(ctx, W, H, anchors, st){
  if (st.wandOn === false || !anchors) return;
  const handKey = st.wandHand === "L" ? "leftHand" : "rightHand";
  const a = anchors[handKey]; if (!a) return;
  const neck = anchors.neck || { x:.5, y:.34 };
  let dx, dy;
  if (st.wandDir){ dx = st.wandDir.x; dy = st.wandDir.y; }
  else { dx = a.x - neck.x; dy = a.y - neck.y; }
  const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
  const hx = a.x*W, hy = a.y*H;
  const len = (st.wandLen || 0.22) * W;
  const tipx = hx + dx*len, tipy = hy + dy*len;
  const buttx = hx - dx*len*0.16, butty = hy - dy*len*0.16;
  const px = -dy, py = dx;                       // perpendicular
  const wButt = Math.max(4, W*0.015), wTip = Math.max(2, W*0.006);

  // faint glow behind the tip (magical aura)
  ctx.save();
  ctx.fillStyle = gray(0xdf);
  ctx.beginPath(); ctx.arc(tipx, tipy, W*0.046, 0, 7); ctx.fill();
  ctx.fillStyle = gray(0xc6);
  for (let i=0;i<8;i++){
    const ang = (i/8)*Math.PI*2;
    const r0 = W*0.014, r1 = W*(0.044 + 0.014*(i%2));
    const wd = 0.16;
    ctx.beginPath();
    ctx.moveTo(tipx+Math.cos(ang-wd)*r0, tipy+Math.sin(ang-wd)*r0);
    ctx.lineTo(tipx+Math.cos(ang)*r1,    tipy+Math.sin(ang)*r1);
    ctx.lineTo(tipx+Math.cos(ang+wd)*r0, tipy+Math.sin(ang+wd)*r0);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  // tapered rod
  ctx.fillStyle = gray(0x18); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(buttx + px*wButt, butty + py*wButt);
  ctx.lineTo(tipx  + px*wTip,  tipy  + py*wTip);
  ctx.lineTo(tipx  - px*wTip,  tipy  - py*wTip);
  ctx.lineTo(buttx - px*wButt, butty - py*wButt);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // grip band just past the hand
  const gx = hx + dx*len*0.14, gy = hy + dy*len*0.14;
  ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(gx + px*wButt*0.95, gy + py*wButt*0.95);
  ctx.lineTo(gx - px*wButt*0.95, gy - py*wButt*0.95);
  ctx.stroke();

  // crystal orb at the tip (a defined object over the glow)
  ctx.fillStyle = gray(0x6e); ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(tipx, tipy, W*0.019, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = gray(0xe8);
  ctx.beginPath(); ctx.arc(tipx - W*0.006, tipy - W*0.006, W*0.006, 0, 7); ctx.fill();
}

export const asset = {
  id:"character.circe",
  type:"CHARACTER",
  name:"Circe",
  statusWord:"ENCHANTRESS",
  scene:"OD-B10-S04",

  params,
  layers:["radiance","hair-drape","legs","dress","far-arm","neck","head","face","hair-front","near-arm","skirt","wand"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.185}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.195},
    halo:{x:.50,y:.18}, rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    wandTip:{x:.74,y:.42}, hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"hosting",
    nodes:{
      // OD-B10-S04: the beautiful singing host (SIGNATURE) — wand held upright
      // like a gracious sceptre at her side so it reads clearly as held
      hosting:  { preview:{ pose:"circe_host", gaze:{x:.05,y:-.04},
                            wandHand:"R", wandLen:.34, wandDir:{x:.06,y:-1}, t:0.5 } },
      // OD-B10-S04: precise alchemist / wand operator / jailer — the strike
      striking: { preview:{ pose:"circe_strike", gaze:{x:.14,y:-.1},
                            wandHand:"R", wandLen:.26, wandDir:{x:.5,y:-.86}, t:0.5 } },
      // OD-B10-S06: confidence collapsing into recognition & fear
      alarmed:  { preview:{ pose:"circe_alarm", gaze:{x:.02,y:-.06},
                            wandHand:"R", wandLen:.16, wandDir:{x:.35,y:.9}, t:0.45 } },
      // OD-B10-S06: seduction — the revised, softer hospitality
      seducing: { preview:{ pose:"circe_seduce", gaze:{x:.12,y:-.02},
                            wandHand:"R", wandLen:.18, wandDir:{x:.28,y:.94}, t:0.45 } },
      // OD-B10-S06: the great oath
      swearing: { preview:{ pose:"circe_oath", gaze:{x:.0,y:-.02},
                            wandHand:"R", wandLen:.18, wandDir:{x:.28,y:.94}, t:0.5 } },
      // OD-B10-S07: restorer applying counter-transformation, presiding over ease
      restoring:{ preview:{ pose:"circe_restore", gaze:{x:-.08,y:.02},
                            wandHand:"R", wandLen:.24, t:0.5 } },
      // OD-B10-S08: unresisting guide — pointing the darker road
      guiding:  { preview:{ pose:"circe_guide", gaze:{x:-.5,y:.06},
                            wandHand:"R", wandLen:.28, t:0.5 } },
    },
    edges:[["hosting","striking"],["striking","alarmed"],["alarmed","seducing"],
           ["seducing","swearing"],["swearing","restoring"],["restoring","guiding"],
           ["guiding","hosting"],["hosting","seducing"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band","wand",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — ENCHANTRESS: the singing host, one hand open in welcome,
  // the wand held low like a gracious sceptre, a warm knowing smile under a
  // sharp radiance. Beautiful, poised, quietly in control.
  preview:()=>({ pose:"circe_host", gaze:{x:.05,y:-.04},
                 wandHand:"R", wandLen:.34, wandDir:{x:.06,y:-1},
                 t:0.5, status:"ENCHANTRESS", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // divinity behind, then loose hair behind the figure
    drawRadiance(ctx, W, H);
    drawHairDrape(ctx, W, H);
    const r = fig.draw(ctx, W, H, st);
    // flowing gown over the legs, then the wand from the live hand anchor
    drawSkirt(ctx, W, H);
    drawWand(ctx, W, H, r && r.anchors, st);
    return r;
  },
};
export default asset;
