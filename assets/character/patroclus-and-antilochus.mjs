/* character.patroclus-and-antilochus — two quiet companion shades who frame
   Achilles in the House of Hades. A two-figure CHARACTER: draws BOTH of the
   great warrior's dead companions — Patroclus, his heart's brother, and
   Antilochus, the swift young son of Nestor — standing in silent attendance
   on either side of the empty center where Achilles's shade arrives.

   They are pale translucent young soldiers, NOT the drama of the scene: their
   whole performance is stillness. Calm attending poses, hands folded or a
   quiet hand laid to the chest, heads bowed a little, solemn faces (brows
   lifted AND knit in a settled grief, gaze soft, turned inward toward the
   space Achilles fills). Rendered as SHADES like Achilles: pale skin, faint
   light ink (drawn low-alpha so the dotify pass thins the contour and the
   paper bleeds through), lower bodies washing out into the field of asphodel.

   Distinct silhouettes so the two never read as one doubled figure:
     · Patroclus (LEFT)  — the elder companion: curly hair, a short beard,
       light armor, a heavier steadier build, a hand laid over his heart.
     · Antilochus (RIGHT) — the youngest: beardless, short hair, a plain
       soldier's tunic, a slighter frame, hands clasped low, head bowed.
   Both turn INWARD to frame the center — left faces right, right faces left.

   Composes the HALFTRACK hero rig TWICE, one attendant per side. Ships bespoke
   calm-attendance poses into the shared registry (each fusing a solemn
   brow/gaze with a quiet arm gesture — the expressiveness lives in the hush).
   States: attending / vigil / greeting.
   Atlas scene: OD-B11-S07 — quiet companion shades framing Achilles's arrival. */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* ---- bespoke attendant poses (additive; shared table). Distinct prefixed ids
   so they never collide with another performer's poses. The gesture is small
   on purpose — this is attendance, not oration — but every pose still speaks
   with the arms (hand to heart / hands clasped / a hand lifted in greeting). */

// PATROCLUS attending — turned in toward Achilles, right hand laid flat over
// the heart in quiet loyalty, left arm resting. Brows lifted and knit in a
// settled sorrow, gaze soft toward the center, chin a touch level.
HERO_POSES.pa_attend_l = { id:"pa_attend_l", label:"patroclus, hand to heart", group:"attendant",
  n:{ bodyYaw:.46, headYaw:.3, gazeX:.2, gazeY:.06,
      browUp:.24, browKnit:.34, frown:.16, eyeNarrow:.12,
      spineLean:.02,
      armRUpper:.5, armRLower:1.16, handRotR:.12,   // right forearm folded across to the chest
      armLUpper:.12, armLLower:-.1,                 // left arm hangs quiet
      rootScale:1.02 },
  opt:{ hands:["relaxed","relaxed"] } };

// ANTILOCHUS attending — the youngest, turned in, both hands clasped low in
// front, head bowed a little further, brows lifted in a young grief.
HERO_POSES.pa_attend_r = { id:"pa_attend_r", label:"antilochus, hands clasped", group:"attendant",
  n:{ bodyYaw:-.46, headYaw:-.28, gazeX:-.18, gazeY:.16,
      browUp:.3, browKnit:.28, frown:.14,
      headPitch:.16, neckPitch:.08, headY:.05,
      armLUpper:-.52, armLLower:-1.12,              // left forearm in
      armRUpper:.52, armRLower:1.12,                // right forearm in -> hands clasped low
      rootScale:.97 },
  opt:{ hands:["relaxed","relaxed"] } };

// PATROCLUS vigil — deeper mourning: head bowed heavy, gaze cast down, brows
// shot up and knit, both hands lowered and folded, the shade nearly still.
HERO_POSES.pa_vigil_l = { id:"pa_vigil_l", label:"patroclus, bowed vigil", group:"attendant",
  n:{ bodyYaw:.34, headYaw:.18, gazeX:.08, gazeY:.4,
      browUp:.42, browKnit:.44, frown:.32, eyeNarrow:.5,
      headPitch:.42, neckPitch:.2, headY:.12, spineLean:.06,
      armLUpper:-.44, armLLower:-1.02,
      armRUpper:.46, armRLower:1.06,                // hands folded low over the belt
      rootScale:1.0 },
  opt:{ hands:["relaxed","relaxed"] } };

// ANTILOCHUS vigil — head fully lowered, eyes all but closed, hands clasped,
// the picture of a young soldier's quiet mourning.
HERO_POSES.pa_vigil_r = { id:"pa_vigil_r", label:"antilochus, lowered mourning", group:"attendant",
  n:{ bodyYaw:-.34, headYaw:-.16, gazeX:-.06, gazeY:.44,
      browUp:.44, browKnit:.4, frown:.3, eyeNarrow:.58,
      headPitch:.5, neckPitch:.24, headY:.14, spineLean:.05,
      armLUpper:-.5, armLLower:-1.06,
      armRUpper:.5, armRLower:1.1,
      rootScale:.96 },
  opt:{ hands:["relaxed","relaxed"] } };

// PATROCLUS greeting — Achilles arrives: the head lifts, chin comes level,
// brows ease, and the right hand turns open toward the center in a quiet
// welcome. Still solemn, but attending to his brother's coming.
HERO_POSES.pa_greet_l = { id:"pa_greet_l", label:"patroclus, quiet welcome", group:"attendant",
  n:{ bodyYaw:.5, headYaw:.36, gazeX:.28, gazeY:-.04,
      browUp:.34, browKnit:.14, frown:.06, eyeNarrow:.06,
      headPitch:-.06, spineLean:-.04, chestOpen:.28,
      armRUpper:-.86, armRLower:.5, handRotR:.14,   // right hand lifted, palm turned toward the center
      armLUpper:.14, armLLower:-.12,
      rootScale:1.03 },
  opt:{ hands:["relaxed","offering"] } };

// ANTILOCHUS greeting — the young shade lifts his eyes to Achilles, one hand
// half-raised in acknowledgement, the other still at his side.
HERO_POSES.pa_greet_r = { id:"pa_greet_r", label:"antilochus, lifting his eyes", group:"attendant",
  n:{ bodyYaw:-.5, headYaw:-.34, gazeX:-.26, gazeY:-.02,
      browUp:.4, browKnit:.12, frown:.05,
      headPitch:-.04, spineLean:-.03, chestOpen:.22,
      armLUpper:-.9, armLLower:.42, handRotL:-.14,  // left hand lifted toward the center
      armRUpper:.16, armRLower:.14,
      rootScale:.98 },
  opt:{ hands:["offering","relaxed"] } };

/* ---- the two shades. Pale skin + light ghostly hair so the figure reads
   faint under the dot pass. Distinct dress/build/hair so they never double. */
const paramsL = {   // Patroclus — elder companion, curly, short beard, light armor
  skin:"#e4dfd4", hairColor:"#a89a7c",
  hair:"curly", beard:true, glasses:false,
  garment:"armor", cloak:false, bareLegs:true, scale:1.72,
};
const paramsR = {   // Antilochus — youngest, short hair, beardless, plain tunic
  skin:"#e6e1d6", hairColor:"#b3a686",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:1.62,
};

const figL = makeFigure(paramsL);
const figR = makeFigure(paramsR);

/* per-variant sub-states: which pose + a thin gaze/face overlay each shade
   wears. Both attendants drawn independently so they attend a little
   differently — the scene never reads as a mirror. */
const V = {
  // ATTENDING — the settled default: both flank the center in quiet attendance,
  // Patroclus hand-to-heart, Antilochus hands clasped, solemn soft faces.
  attending: {
    left:  { pose:"pa_attend_l", gaze:{x:.2,y:.06}, browUp:.24, browKnit:.34,
             frown:.16, eyeNarrow:.12, t:.5 },
    right: { pose:"pa_attend_r", gaze:{x:-.18,y:.16}, browUp:.3, browKnit:.28,
             frown:.14, t:.5 },
  },
  // VIGIL — deeper hush: both heads bowed heavy, eyes low, mourning their own
  // fall and their friend among the dead.
  vigil: {
    left:  { pose:"pa_vigil_l", gaze:{x:.08,y:.4}, browUp:.42, browKnit:.44,
             frown:.32, eyeNarrow:.5, t:.5 },
    right: { pose:"pa_vigil_r", gaze:{x:-.06,y:.44}, browUp:.44, browKnit:.4,
             frown:.3, eyeNarrow:.58, t:.5 },
  },
  // GREETING — Achilles's shade arrives: heads lift toward the center, hands
  // turn open in a quiet welcome, faces ease from grief to grave gladness.
  greeting: {
    left:  { pose:"pa_greet_l", gaze:{x:.28,y:-.04}, browUp:.34, browKnit:.14,
             frown:.06, eyeNarrow:.06, t:.5 },
    right: { pose:"pa_greet_r", gaze:{x:-.26,y:-.02}, browUp:.4, browKnit:.12,
             frown:.05, t:.5 },
  },
};

/* draw one attendant into a sub-box on its side of the frame, leaving the
   center empty for Achilles. boxW < half the width so a gap opens between the
   two shades — they FRAME rather than fill. */
function drawAttendant(ctx, W, H, fig, sub, cx){
  const boxW = W*0.46;
  const x0 = cx*W - boxW/2;
  ctx.save();
  ctx.translate(x0, 0);
  fig.draw(ctx, boxW, H, sub);
  ctx.restore();
}

export const asset = {
  id:"character.patroclus-and-antilochus",
  type:"CHARACTER",
  name:"Patroclus and Antilochus",
  statusWord:"ATTENDING",
  scene:"OD-B11-S07",

  params:{ patroclus:paramsL, antilochus:paramsR, figures:2 },
  layers:["asphodel-fade","shadow","hair-back","legs","garment","torso",
          "far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors: each shade's head + lifted/laid hand, plus the
  // empty center anchor where Achilles's shade stands between them.
  anchors:{
    patroclusHead:{x:.22,y:.20}, patroclusHand:{x:.32,y:.46},
    antilochusHead:{x:.78,y:.21}, antilochusHand:{x:.66,y:.50},
    achillesSlot:{x:.50,y:.30}, feet:{x:.50,y:.93},
  },
  states:{
    initial:"attending",
    nodes:{
      // each node is a whole two-figure beat; the sub-poses + faces live in V.
      attending:{ preview:{ variant:"attending", status:"ATTENDING" } },
      vigil:    { preview:{ variant:"vigil",     status:"MOURNING" } },
      greeting: { preview:{ variant:"greeting",  status:"WELCOMING" } },
    },
    edges:[["attending","vigil"],["vigil","attending"],
           ["attending","greeting"],["greeting","attending"]],
  },
  channels:["variant","ghostAlpha","pose","gaze","mouth","browUp","browKnit",
            "frown","eyeNarrow","eyeWide","jaw","blink"],

  // CARD SIGNATURE — ATTENDING: two pale translucent young soldiers flanking an
  // empty center, turned inward in silent attendance — Patroclus with a hand
  // laid over his heart, Antilochus with hands clasped and head bowed, both
  // faces lifted-and-knit in a settled grief. Faint, half-there, the quiet
  // honor guard of the greatest of the Achaeans among the dead.
  preview:()=>({ variant:"attending", status:"ATTENDING", progress:.2 }),

  draw(ctx, W, H, state){
    const s = state || {};
    const v = V[s.variant] || V.attending;

    // shades: draw both figures faint so the dotify pass thins the ink and the
    // paper bleeds through. A touch fainter than Achilles (0.58) — they are the
    // quiet frame, not the subject.
    const alpha = (typeof s.ghostAlpha==="number") ? s.ghostAlpha : 0.56;
    ctx.save();
    ctx.globalAlpha = alpha;
    drawAttendant(ctx, W, H, figL, v.left,  0.24);
    drawAttendant(ctx, W, H, figR, v.right, 0.76);
    ctx.restore();

    // faint lower bodies: wash the legs out into the paper so the two shades
    // have no solid footing and dissolve down into the field of asphodel.
    const gy0 = H*0.60;
    const grad = ctx.createLinearGradient(0, gy0, 0, H);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.62, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0.86)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, gy0, W, H - gy0);
  },
};
export default asset;
