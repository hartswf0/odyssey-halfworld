/* character.medon-and-phemius — the two men the slaughter spared, standing up
   together to testify.

   A two-figure CHARACTER. In Book XXII these are the only two inside the hall
   who are let live: Medon the herald, who had hidden under an oxhide, and
   Phemius the bard, who laid down his lyre and clasped Odysseus's knees. In
   Book XXIV (OD-B24-S06) they are the WITNESSES: the Ithacan assembly gathers
   over the carried-out bodies and these two — the only sober eyes in the room
   that night — swear that no man could have done it alone, that a god stood
   beside Odysseus in the doorway. Their whole performance is TESTIMONY: one
   sworn hand apiece, the emblem of office held low and quiet in the other,
   the faces earnest rather than triumphant.

   Distinct silhouettes so the two never read as one doubled figure:
     · MEDON (LEFT)  — the herald: dark greying cap of hair, short beard, a
       plain crier's tunic and bare shins, the kerykeion (herald's staff)
       planted at his side. His hand goes UP and points: he is naming the god.
     · PHEMIUS (RIGHT) — the singer: white-grey hair, a mantle over the tunic,
       a touch taller and more upright, the phorminx cradled low and silent in
       his outer hand. His inner hand lies flat on his heart: he swears to it.
   One man points to heaven and one lays a hand on his heart; the staff hangs
   between them and the lyre outside them, so a pool of paper opens down the
   middle and neither arm ever crosses into the other man's half of the sheet.

   Composes the HALFTRACK hero rig TWICE, one witness per side, plus two
   identity props (staff, phorminx) drawn in solid grays over the rig — no
   hand-drawn overpaint on the bodies themselves. Every prop finds its own grip
   from the rig's returned hand anchors, so it follows whatever pose is set.
   States: testifying / oath / warning / spared / neutral / turned / back.
   Atlas scene: OD-B24-S06 — survivors giving eyewitness testimony of divine
   involvement. */
import { makeFigure, HERO_POSES, INK } from "../../engine/halfworld-engine.mjs";

/* ============================================================
   bespoke witness poses (additive; shared table). Prefixed `mp_` so they can
   never collide with another performer's poses. Every pose is authored as a
   PAIR — an `_l` for Medon and an `_r` for Phemius — because the two men only
   ever perform together and the composition has to stay balanced.
   ============================================================ */

// MEDON testifying — the signature. Turned a quarter toward the assembly, the
// OUTER (figure-left) arm flung up and one finger pointing to the sky: it was
// a god. Inner arm low, gripping the staff. Brows up and a touch knit over
// wide earnest eyes, jaw open on the word.
HERO_POSES.mp_testify_l = { id:"mp_testify_l", label:"medon, naming the god", group:"witness",
  n:{ bodyYaw:.20, headYaw:.10, gazeX:.06, gazeY:-.18,
      spineLean:-.10, chestOpen:.30, chestLift:.18,
      armLUpper:2.98, armLLower:-.14, shoulderLiftL:.66, handRotL:-.12,
      armRUpper:-.30, armRLower:.44, handRotR:.10,
      browUp:.52, browKnit:.20, eyeWide:.28, jaw:.40,
      rootScale:1.0 },
  opt:{ hands:["point","relaxed"] } };

// PHEMIUS attesting — beside him, half-turned in toward Medon and then out to
// the assembly, the inner (figure-left) hand laid flat over the heart: the
// singer's oath. Outer arm low, cradling the silent phorminx. Grave, level.
HERO_POSES.mp_testify_r = { id:"mp_testify_r", label:"phemius, sworn hand", group:"witness",
  n:{ bodyYaw:-.18, headYaw:-.26, gazeX:-.20, gazeY:-.06,
      spineLean:-.04, chestOpen:.22, chestLift:.14,
      armLUpper:-.48, armLLower:-1.24, shoulderLiftL:.22, handRotL:.16,
      armRUpper:-.26, armRLower:.46, handRotR:.10,
      browUp:.34, browKnit:.18, eyeNarrow:.06, jaw:.12,
      rootScale:.99 },
  opt:{ hands:["open_palm","relaxed"] } };

// MEDON oath — the formal moment: the hand comes down to shoulder height and
// opens flat, chin level, mouth closed. Duty, not alarm.
HERO_POSES.mp_oath_l = { id:"mp_oath_l", label:"medon, hand raised flat", group:"witness",
  n:{ bodyYaw:.14, headYaw:.06, gazeX:.02, gazeY:-.04,
      spineLean:-.02, chestOpen:.24,
      armLUpper:2.88, armLLower:-.26, shoulderLiftL:.52, handRotL:-.18,
      armRUpper:-.26, armRLower:.40,
      browUp:.30, browKnit:.26, frown:.08, eyeNarrow:.10 },
  opt:{ hands:["open_palm","relaxed"] } };

// PHEMIUS oath — the hand presses harder to the chest and the chin comes
// level. Medon's flat palm above and this hand below read as one statement.
HERO_POSES.mp_oath_r = { id:"mp_oath_r", label:"phemius, hand raised flat", group:"witness",
  n:{ bodyYaw:-.14, headYaw:-.06, gazeX:-.02, gazeY:-.04,
      chestOpen:.20,
      armLUpper:-.58, armLLower:-1.42, shoulderLiftL:.30, handRotL:.20,
      armRUpper:-.24, armRLower:.42,
      browUp:.32, browKnit:.22, frown:.06, eyeNarrow:.12 },
  opt:{ hands:["open_palm","relaxed"] } };

// MEDON warning — the herald's other office: pitched forward over the crowd,
// the OUTER hand flung up flat (stop, hear me — the same arm as the testimony
// but with the fingers spread instead of pointing), brows hard knit, mouth
// open. Inner arm stays low so the staff never crosses the frame.
HERO_POSES.mp_warn_l = { id:"mp_warn_l", label:"medon, warning the assembly", group:"witness",
  n:{ bodyYaw:.26, headYaw:.16, gazeX:.14, gazeY:.02,
      spineLean:-.32, headPitch:-.04,
      armLUpper:2.92, armLLower:-.30, shoulderLiftL:.70, handRotL:-.20,
      armRUpper:-.24, armRLower:.58,
      browUp:.44, browKnit:.52, eyeWide:.22, frown:.16, jaw:.34,
      rootScale:1.02 },
  opt:{ hands:["stop","relaxed"] } };

// PHEMIUS grave — while the herald warns, the singer looks down at the bodies:
// head lowered, eyes cast low and aside, both arms quiet, the lyre unplayed.
HERO_POSES.mp_warn_r = { id:"mp_warn_r", label:"phemius, eyes on the dead", group:"witness",
  n:{ bodyYaw:-.22, headYaw:-.30, gazeX:-.26, gazeY:.30,
      headPitch:.28, neckPitch:.12, headY:.08, spineLean:.04,
      armRUpper:-.14, armRLower:.30,
      armLUpper:.34, armLLower:-.66,
      browUp:.38, browKnit:.34, frown:.24, eyeNarrow:.30,
      rootScale:.98 },
  opt:{ hands:["relaxed","relaxed"] } };

// MEDON spared — the memory under the testimony: Book XXII, crouched out of
// the oxhide, both hands up, eyes flung wide. Kept shallow so the rig's legs
// stay legible rather than folding into a knot.
HERO_POSES.mp_spared_l = { id:"mp_spared_l", label:"medon, spared", group:"witness",
  n:{ crouch:.9, kneeL:.92, kneeR:.92, hipL:-.42, hipR:.42, spineLean:-.18,
      bodyYaw:.18, headYaw:.14, gazeX:.10, gazeY:-.20,
      armLUpper:2.92, armLLower:-.34, shoulderLiftL:.45, handRotL:-.16,
      armRUpper:-.34, armRLower:.62, handRotR:.14,
      browUp:.88, browKnit:.24, eyeWide:.58, frown:.20, jaw:.42,
      rootScale:.95 },
  opt:{ hands:["open_palm","relaxed"] } };

// PHEMIUS spared — he has set the phorminx on the floor (it lies at his feet)
// and both forearms come up empty in front of him toward the killer's knees.
HERO_POSES.mp_spared_r = { id:"mp_spared_r", label:"phemius, lyre set down", group:"witness",
  n:{ crouch:.9, kneeL:.92, kneeR:.92, hipL:-.42, hipR:.42, spineLean:-.16,
      bodyYaw:-.18, headYaw:-.14, gazeX:-.12, gazeY:-.22,
      armLUpper:-.40, armLLower:-1.72, shoulderLiftL:.44, handRotL:.18,
      armRUpper:.34, armRLower:1.62, shoulderLiftR:.40, handRotR:-.16,
      browUp:.92, browKnit:.20, eyeWide:.62, jaw:.36,
      rootScale:.94 },
  opt:{ hands:["offering","offering"] } };

/* ============================================================
   the two men. Light planes, dark accents: pale tunic grays, bare shins, and
   two different heads of hair (Medon's dark greying cap against Phemius's
   near-white singer's crop) so the pair never doubles under the dot lattice.
   ============================================================ */
const paramsMedon = {           // the herald — plain crier's tunic, bare shins
  skin:"#cbb9a0", hairColor:"#6c655a",
  hair:"short", beard:true, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:1.62,
};
const paramsPhemius = {         // the singer — a mantle over the tunic, taller
  skin:"#d2c3a8", hairColor:"#aaa49a",
  hair:"short", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.70,
};

const figMedon   = makeFigure(paramsMedon);
const figPhemius = makeFigure(paramsPhemius);

/* Both emblems ride the rig's RIGHT hand, and every authored pose keeps that
   hand hanging — Medon lifts his figure-left arm, Phemius folds his figure-left
   forearm up. That fixes the staff on the inner side of the frame and the
   phorminx on the outer side, so the two objects can never stack on each
   other however the pair is posed. */
function gripHand(a){ return (a && (a.rightHand || a.leftHand)) || null; }

/* ---- MEDON's kerykeion: a plain herald's staff, planted. Pale shaft inside a
   hard contour, three binding marks at the grip, a knob finial. Nudged
   outboard of the grip so it never crosses the body. ---- */
function staff(ctx, W, H, anchors){
  const g = gripHand(anchors); if(!g) return;
  const side = (g.x >= 0.5) ? 1 : -1;
  const px  = g.x*W + side*W*0.030;
  const py  = g.y*H;
  const top = Math.max(H*0.22, py - H*0.20), bot = H*0.895;
  ctx.save(); ctx.lineCap="round";
  ctx.strokeStyle=INK; ctx.lineWidth=13;
  ctx.beginPath(); ctx.moveTo(px,top); ctx.lineTo(px,bot); ctx.stroke();
  ctx.strokeStyle="#a49c90"; ctx.lineWidth=7;          // pale wood: a light column
  ctx.beginPath(); ctx.moveTo(px,top); ctx.lineTo(px,bot); ctx.stroke();
  ctx.strokeStyle=INK; ctx.lineWidth=2.4;              // grip bindings at the hand
  for(let i=0;i<3;i++){ const y=py-H*0.014+i*H*0.014;
    ctx.beginPath(); ctx.moveTo(px-7,y); ctx.lineTo(px+7,y); ctx.stroke(); }
  ctx.fillStyle="#bdb5a8"; ctx.strokeStyle=INK; ctx.lineWidth=4;   // finial
  ctx.beginPath(); ctx.arc(px, top, H*0.019, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

/* ---- PHEMIUS's phorminx: soundbox bowl, two horn arms, yoke, six strings.
   Local frame: y=0 at the soundbox base, the instrument grows toward -y and is
   rotated so that -y aims at (topX,topY). Held silent here — no plucking hand. */
function phorminx(ctx, baseX, baseY, topX, topY, R){
  const theta = Math.atan2(topX-baseX, -(topY-baseY));
  const Hh = R*2.15, armY = -Hh, boxTop = -R*0.92, bridgeY = -R*0.76;
  const cornerX = R*0.40, tipX = R*0.94;
  ctx.save(); ctx.translate(baseX, baseY); ctx.rotate(theta);
  ctx.lineJoin="round"; ctx.lineCap="round";
  ctx.fillStyle="#8e867a"; ctx.strokeStyle=INK; ctx.lineWidth=4;      // rim
  ctx.beginPath(); ctx.ellipse(0,-R*0.44,R*0.76,R*0.64,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle="#b6ad9f";                                            // pale shell face
  ctx.beginPath(); ctx.ellipse(0,-R*0.48,R*0.58,R*0.49,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle="#a89f93";                                            // the two horn arms
  for(const s of [-1,1]){
    ctx.beginPath();
    ctx.moveTo(s*cornerX, boxTop);
    ctx.quadraticCurveTo(s*R*1.32, -Hh*0.42, s*tipX, armY+R*0.28);
    ctx.lineTo(s*(tipX-R*0.28), armY+R*0.28);
    ctx.quadraticCurveTo(s*R*0.80, -Hh*0.42, s*cornerX*0.4, boxTop-R*0.02);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle="#8c8377";                                            // yoke crossbar
  ctx.beginPath(); ctx.roundRect(-tipX-R*0.13, armY-R*0.04, (tipX+R*0.13)*2, R*0.28, R*0.12);
  ctx.fill(); ctx.stroke();
  const span = R*0.44;                                                // pale string plane
  ctx.fillStyle="#cfc7ba"; ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(-span-R*0.13, bridgeY); ctx.lineTo(span+R*0.13, bridgeY);
  ctx.lineTo(span+R*0.02, armY+R*0.16); ctx.lineTo(-span-R*0.02, armY+R*0.16);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle=INK; ctx.lineWidth=2.4;                             // strings
  for(let i=0;i<6;i++){ const x=-span+(span*2)*(i/5);
    ctx.beginPath(); ctx.moveTo(x,bridgeY); ctx.lineTo(x*0.9, armY+R*0.13); ctx.stroke(); }
  ctx.lineWidth=2.6; ctx.beginPath(); ctx.moveTo(-span-R*0.09,bridgeY); ctx.lineTo(span+R*0.09,bridgeY); ctx.stroke();
  ctx.lineWidth=1.8; ctx.beginPath(); ctx.arc(0,-R*0.44,R*0.13,0,Math.PI*2); ctx.stroke();
  ctx.restore();
}

/* draw one witness into a sub-box on his own side of the frame. boxW is under
   half the width so a gap of paper opens down the middle — they FLANK the
   testimony rather than fill the sheet. Props are drawn inside the same
   translated frame, straight off the rig's own anchors. */
const BOXW = 0.46;
function drawWitness(ctx, W, H, fig, sub, cx, prop){
  const boxW = W*BOXW, x0 = cx*W - boxW/2;
  ctx.save(); ctx.translate(x0, 0);
  const res = fig.draw(ctx, boxW, H, sub);
  if (prop) prop(ctx, boxW, H, (res && res.anchors) || null, fig);
  ctx.restore();
  return res;
}

/* Medon's emblem: the staff, always in hand — a herald does not put it down. */
function medonProp(ctx, W, H, anchors){ staff(ctx, W, H, anchors); }

/* Phemius's emblem: cradled at the hanging hand, or (in `spared`) lying flat
   on the floor at his feet where he set it before he begged. */
function phemiusProp(mode){
  return (ctx, W, H, anchors, fig) => {
    if (mode === false) return;
    const R = fig.hero.rig.dim.headR || H*0.06;
    if (mode === "down"){
      const bx = W*0.58, by = H*0.855;
      phorminx(ctx, bx, by, bx - R*1.5, by - R*0.10, R*0.68);
      return;
    }
    const g = gripHand(anchors); if(!g) return;
    // carried clear of the body on his outer side, so the instrument reads
    // against paper instead of dissolving into the torso.
    const r  = R*0.72;
    const bx = g.x*W + r*0.30, by = g.y*H + r*1.15;
    phorminx(ctx, bx, by, bx + r*0.10, by - r*2.15, r);
  };
}

/* ============================================================
   per-state sub-performances: what each man does, drawn independently so the
   pair never reads as a mirror. `lyre` is the phorminx mode for that beat.
   ============================================================ */
const V = {
  // TESTIFYING — the signature beat. Medon's finger goes up to the god,
  // Phemius's palm comes open in oath, staff and lyre hang quiet between them.
  testifying:{
    left: { pose:"mp_testify_l", gaze:{x:.06,y:-.18}, browUp:.52, browKnit:.20,
            eyeWide:.28, jaw:.40, t:.5 },
    right:{ pose:"mp_testify_r", gaze:{x:-.20,y:-.06}, browUp:.34, browKnit:.18,
            eyeNarrow:.06, jaw:.12, t:.5 },
    lyre:"held",
  },
  // OATH — both flat palms up at shoulder height, mouths shut, chins level:
  // one sworn statement given by two men.
  oath:{
    left: { pose:"mp_oath_l", gaze:{x:.02,y:-.04}, browUp:.30, browKnit:.26,
            frown:.08, eyeNarrow:.10, jaw:0, t:.5 },
    right:{ pose:"mp_oath_r", gaze:{x:-.02,y:-.04}, browUp:.32, browKnit:.22,
            frown:.06, eyeNarrow:.12, jaw:0, t:.5 },
    lyre:"held",
  },
  // WARNING — the herald leans out over the assembly with a flat hand; the
  // singer looks down at the bodies instead.
  warning:{
    left: { pose:"mp_warn_l", gaze:{x:.14,y:.02}, browUp:.44, browKnit:.52,
            eyeWide:.22, frown:.16, jaw:.34, t:.5 },
    right:{ pose:"mp_warn_r", gaze:{x:-.26,y:.30}, browUp:.38, browKnit:.34,
            frown:.24, eyeNarrow:.30, t:.5 },
    lyre:"held",
  },
  // SPARED — the Book XXII memory the testimony rests on: both crouched with
  // empty hands up, the lyre on the floor where Phemius set it.
  spared:{
    left: { pose:"mp_spared_l", gaze:{x:.12,y:-.22}, browUp:.88, browKnit:.24,
            eyeWide:.58, frown:.20, jaw:.42, t:.5 },
    right:{ pose:"mp_spared_r", gaze:{x:-.14,y:-.24}, browUp:.92, browKnit:.20,
            eyeWide:.62, jaw:.36, t:.5 },
    lyre:"down",
  },
  // NEUTRAL — the identity plate: both square to front, emblems in hand.
  neutral:{
    left: { pose:"neutral_front", gaze:{x:0,y:0}, t:.5 },
    right:{ pose:"neutral_front", gaze:{x:0,y:0}, t:.5 },
    lyre:"held",
  },
  // TURNED — three-quarter, each man angled in toward the other.
  turned:{
    left: { pose:"three_quarter_right", gaze:{x:.25,y:0}, t:.5 },
    right:{ pose:"three_quarter_left",  gaze:{x:-.25,y:0}, t:.5 },
    lyre:"held",
  },
  // BACK — both turned away, walking out of the assembly. The lyre stows.
  back:{
    left: { pose:"back_view", t:.5 },
    right:{ pose:"back_view", t:.5 },
    lyre:false,
  },
};

export const asset = {
  id:"character.medon-and-phemius",
  type:"CHARACTER",
  name:"Medon and Phemius",
  statusWord:"WITNESS",
  scene:"OD-B24-S06",

  params:{ medon:paramsMedon, phemius:paramsPhemius, figures:2, boxWidth:BOXW },
  layers:["shadow","hair-back","legs","tunic","mantle","far-arm","neck","head",
          "face","hair-front","beard","near-arm","staff","phorminx"],
  // normalized 0..1 anchors: each witness's head, sworn hand and emblem, plus
  // the empty centre where the assembly's attention sits between them.
  anchors:{
    medonHead:{x:.30,y:.38},    medonSwornHand:{x:.09,y:.30}, staffTop:{x:.45,y:.45},
    phemiusHead:{x:.70,y:.37},  phemiusOathHand:{x:.57,y:.53}, lyreYoke:{x:.81,y:.55},
    testimony:{x:.50,y:.34},    feet:{x:.50,y:.93},
  },
  states:{
    initial:"testifying",
    nodes:{
      testifying:{ preview:{ variant:"testifying", status:"WITNESS"  } },
      oath:      { preview:{ variant:"oath",       status:"SWORN"    } },
      warning:   { preview:{ variant:"warning",    status:"WARNING"  } },
      spared:    { preview:{ variant:"spared",     status:"SPARED"   } },
      neutral:   { preview:{ variant:"neutral",    status:"NEUTRAL"  } },
      turned:    { preview:{ variant:"turned",     status:"TURNED"   } },
      back:      { preview:{ variant:"back",       status:"LEAVING"  } },
    },
    edges:[["spared","testifying"],["testifying","oath"],["oath","testifying"],
           ["testifying","warning"],["warning","testifying"],["warning","back"],
           ["neutral","testifying"],["neutral","turned"],["turned","neutral"],
           ["testifying","back"]],
  },
  channels:["variant","pose","gaze","mouth","breath","browUp","browKnit",
            "frown","eyeNarrow","eyeWide","jaw","blink","lyre","staff"],

  // CARD SIGNATURE — WITNESS: the two men the slaughter spared, standing side
  // by side before the assembly with a gap of paper between them. Medon's arm
  // is up and one finger points to the sky — a god was in the doorway — his
  // staff planted at his side; Phemius's palm is open at his shoulder swearing
  // to it, his lyre held low and silent. Earnest, not triumphant.
  preview:()=>({ variant:"testifying", status:"WITNESS", progress:.24 }),

  draw(ctx, W, H, state){
    const s = state || {};
    const v = V[s.variant] || V[s.pose] || V.testifying;
    const lyreMode = (s.lyre !== undefined) ? s.lyre : v.lyre;
    const showStaff = s.staff !== false;

    // back → front is left-to-right here; the two never overlap, so order only
    // has to be deterministic.
    drawWitness(ctx, W, H, figMedon,   v.left,  0.32,
                showStaff ? medonProp : null);
    drawWitness(ctx, W, H, figPhemius, v.right, 0.72,
                phemiusProp(lyreMode === "held" ? "held" : lyreMode));
    return { anchors: asset.anchors };
  },
};
export default asset;
