/* character.mill-woman — the last of the twelve grinding women, Book XX.
   CHARACTER asset. Twelve slave women turn the hand mills through the night for
   barley and wheat meal; eleven finish their measure and go to sleep. She is the
   WEAKEST, and so she is still grinding when the house has gone quiet — and it is
   her mouth, the lowest mouth in the household, that says out loud the thing
   everyone in the palace wants and nobody dares want: let them eat here for the
   last time. Odysseus, lying awake on the porch, takes it as the omen.

   Scene function:
     OD-B20-S02  exhausted lowest-status worker voicing the household's hidden
                 desire for an ending — the mill stops, the head comes up, and
                 the curse-prayer goes out of her.

   CHARACTERISATION: she is built as the household's floor. Everything about the
   rig is set SMALL and LOW — the shortest root scale in the palace cast, a spine
   that never quite straightens, and a pose library whose centre of gravity is on
   the knees rather than on the feet. Her one upward movement in the whole module
   is the prayer, and that is the point: the only time this body lifts is to
   speak. So the card previews that beat while the state machine still opens
   where the scene finds her, at the stone.

   DISTINCT IN THE HOUSE: Melantho is a black pinned coil and a fine gift-gown;
   Eurycleia is an opaque scarf and an apron. The mill woman is bare-headed grey
   hair — no pins, no cloth, no time — over a plain patched shift. Head uncovered
   is her status, not her style.

   OVERPAINT is ONE costume element: the shift, drawn from the rig's OWN reported
   hip anchor so it tracks whatever the pose does with her weight, and hemmed to
   the floor so a kneel pools it instead of leaving it hanging in the air. Body,
   face, hands and hair are the shared rig untouched — that is what keeps her in
   family, and the engine's single dotify POST pass supplies the halftone.

   TONE: light planes, dark accents. Pale skin, mid-grey bodice, near-paper shift;
   the only heavy ink on her is the contour, the rope girdle and the patch stitching.
   The millstone is a separate asset (prop.millstone) — nothing of it is baked in
   here, only the grips it can attach to. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke mill-woman poses ----
   Registered additively into the shared rig registry (the same module singleton
   figure-hero reads), so preview()/states name them like any built-in pose.
   Rig conventions used throughout: a NEGATIVE bodyYaw brings the LEFT arm to the
   near side of camera; -headPitch lifts the chin and -gazeY lifts the pupils, so
   the pair is a face turned up; +headPitch with +gazeY is a head hung over work.
   NOTE the rig ignores the `crouch` channel entirely — a kneel is authored as
   real hip/knee/ankle angles plus rootY, never as `crouch`. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"mill-woman", n, opt:hands?{hands}:{} }; }

// THE CARD — PRAYER. She has let go of the handle and sat back off the stone.
// The spine is pushed upright with effort it does not have, the chin comes UP and
// the eyes go further up than the chin does, the jaw is open on the sentence, and
// the near hand turns palm-up while the far hand stays braced on the thigh —
// half a prayer gesture, because a woman this tired cannot spare two hands.
// Brows knit AND lifted is the appeal shape; knit alone would be plain anger,
// and anger is not what this is. But browUp is held to .30 and no higher, which
// is a lesson straight off the plate: the eye is a near-white almond with a small
// pupil, so on light skin it carries almost no ink of its own and it is the BROW
// sitting close above it that makes the eye legible. Fly the brows up to .66 and
// the whole eye region bleaches out — a face with two arcs floating over nothing.
// eyeNarrow is likewise left at zero: past ~.15 the almond closes until white and
// pupil both vanish and the face prints as a blank mask.
P("mlw_prayer", {
  // A REAL KNEEL, and it has to be authored as one: the rig pins its LOWEST
  // ankle to the floor, so if either shin still reaches down the whole body is
  // hauled back up to standing height and the kneel becomes invisible under the
  // cloth. Both thighs therefore drop vertically to the knees and both shins
  // fold back flat, which puts the knees on the ground and the hips a thigh's
  // length above it — the only leg geometry that actually reads as kneeling here.
  hipL:.10, kneeL:1.60, ankleL:.10, footRotL:.14,
  hipR:-.08, kneeR:1.66, ankleR:.06, footRotR:-.10,
  pelvisRot:-.04, spineLean:-.05, chestLift:.26, shoulderTilt:.05,
  bodyYaw:-.34, headYaw:-.10, headRoll:-.09, headPitch:-.52, neckPitch:-.20,
  gazeX:-.06, gazeY:-.56,                                // eyes further up than the chin
  browUp:.30, browKnit:.40, eyeWide:0, eyeNarrow:0,     // see the note below on brows
  jaw:.62, smile:.12, frown:.24, mouthAsym:.20,          // open on the word, corners down
  // ONE hand closed at the breast, elbow tucked in against the ribs, and the far
  // arm folded low across the lap where the cloth takes it. Three findings off
  // the plate are packed into that: a spread palm loses every finger to the dot
  // lattice where a CLOSED hand keeps a clean silhouette; two hands brought to
  // the same point resolve to the same coordinates and print as one blob; and an
  // elbow swung wide opens a big empty triangle beside the figure that reads as
  // hand-on-hip swagger, which is the last thing this body is doing. Measured,
  // the hands land at .46/.48 and .55/.68 — the second one half into the shift.
  // The gesture is a vow rather than a supplication, which is also the truer
  // reading: what she asks Zeus for is that these men never eat here again.
  armLUpper:.02, armLLower:-2.30, handRotL:-.34, shoulderLiftL:.34,
  armRUpper:-.10, armRLower:.85, handRotR:.16, shoulderLiftR:.06,
  // a kneel costs a third of the frame height, so the kneeling poses carry a
  // large root scale to keep her filling the card. Standing poses stay small —
  // she is still the shortest figure in the palace cast when she is on her feet.
  rootScale:1.42,
}, ["fist","fist"]);

// GRINDING — the work itself, and the pose the scene opens on: down over the
// quern, back rounded, shoulders up around the ears, both fists closed on the
// handle out in front at knee height, head hung and the eyes following the stone.
// Two limits learned off the plate: arm angles stay modest, because swung wider
// the forearms run out past the card edge and the figure loses its silhouette to
// the frame; and spineLean stops at -.32, because past that the lean carries the
// whole head out over the left margin.
P("mlw_grinding", {
  hipL:.12, kneeL:1.58, ankleL:.10, footRotL:.14, hipR:-.06, kneeR:1.64, ankleR:.06,
  spineLean:-.32, pelvisRot:-.05,
  bodyYaw:-.22, headYaw:-.06, headPitch:.46, neckPitch:.16, gazeX:-.10, gazeY:.42,
  browKnit:.32, browUp:.10, eyeNarrow:.14, frown:.22, jaw:.12,
  armLUpper:.42, armLLower:-.80, handRotL:-.12, shoulderLiftL:.28,  // near fist on the handle
  armRUpper:-.16, armRLower:.90, handRotR:.12, shoulderLiftR:.24,   // far fist on the handle
  rootScale:1.40,
}, ["fist","fist"]);

// HEAVE — one full turn of the stone, which at her strength is a whole-body
// effort: the shoulder driven forward, the pelvis twisted after it, teeth set.
// jaw with browKnit and a skewed mouth is a grimace; jaw alone would be speech.
P("mlw_heave", {
  hipL:.16, kneeL:1.52, ankleL:.08, footRotL:.12, hipR:-.10, kneeR:1.70, ankleR:.06,
  spineLean:-.34, spineTwist:.20, pelvisRot:.09,
  bodyYaw:-.44, headYaw:-.15, headPitch:.26, gazeX:-.14, gazeY:.30,
  browKnit:.64, browUp:.08, eyeNarrow:.14, jaw:.38, frown:.34, mouthAsym:.26,
  armLUpper:.44, armLLower:-1.05, handRotL:-.20, shoulderLiftL:.42,
  armRUpper:-.30, armRLower:.72, handRotR:.10, shoulderLiftR:.18,
  rootScale:1.42,
}, ["fist","fist"]);

// SLUMPED — "they have loosened my knees." The measure is finished and the body
// simply stops: deep on the heels, head dropped, both arms hanging dead off the
// shoulders, shoulders themselves let down. Nothing in this pose is holding
// anything up. It is the pose the prayer comes out of.
P("mlw_slumped", {
  hipL:.06, kneeL:1.74, ankleL:.16, footRotL:.16, hipR:-.04, kneeR:1.78, ankleR:.10,
  spineLean:-.22, pelvisRot:-.06,
  bodyYaw:-.28, headYaw:.06, headRoll:.12, headPitch:.58, neckPitch:.22,
  gazeY:.36, browUp:.34, browKnit:.38, eyeNarrow:.12, frown:.44, jaw:.08,
  armLUpper:.16, armLLower:-.12, handRotL:-.06,
  armRUpper:-.14, armRLower:.10, handRotR:.06,
  rootScale:1.40,
}, ["relaxed","relaxed"]);

// LISTENING — the beat straight after the prayer: she has said the unsayable in
// a house full of men and now she looks toward the door to find out whether
// anybody heard. Head swung hard off the body, eyes wider than the head turn,
// near hand lifted off the stone and stopped in the air.
P("mlw_listening", {
  hipL:.10, kneeL:1.56, ankleL:.10, footRotL:.12, hipR:-.34, kneeR:1.24, ankleR:.06,
  spineLean:-.14,
  bodyYaw:-.30, headYaw:-.86, neckYaw:-.42, headPitch:-.08, headRoll:-.05,
  gazeX:-.70, gazeY:-.06,
  browUp:.46, browKnit:.18, eyeWide:.34, jaw:.14, frown:.10,
  armLUpper:.34, armLLower:-.56, handRotL:-.14, shoulderLiftL:.20,
  armRUpper:-.26, armRLower:.42, handRotR:.10,
  rootScale:1.38,
}, ["open_palm","fist"]);

// RISING — getting off the floor the way an exhausted body does, by pushing the
// near hand down onto its own thigh. The last of her poses to leave the knees.
P("mlw_rising", {
  hipL:.14, kneeL:1.46, ankleL:.12, footRotL:.12, hipR:-.62, kneeR:1.10, ankleR:.08,
  spineLean:-.28, pelvisRot:-.05,
  bodyYaw:-.36, headYaw:-.10, headPitch:.14, gazeY:.14,
  browKnit:.32, browUp:.16, eyeNarrow:.12, frown:.24, jaw:.24,
  armLUpper:.55, armLLower:-1.05, handRotL:-.18, shoulderLiftL:.24,  // pressing on the knee
  armRUpper:-.22, armRLower:.28, handRotR:.08,
  rootScale:1.24,
}, ["open_palm","fist"]);

// IDLE — standing, and even standing she is folded: weight thrown onto one hip,
// shoulders forward of the chest, head carried low, eyes already down. The
// smallest carriage in the palace cast.
P("mlw_idle", {
  bodyYaw:-.26, headYaw:-.08, headRoll:.07, headPitch:.28, gazeX:-.10, gazeY:.22,
  spineLean:-.18, chestLift:-.10, shoulderTilt:.07,
  browKnit:.24, browUp:.18, eyeNarrow:.12, frown:.24, jaw:.06,
  weightShift:.24, pelvisX:.10, hipL:.07, kneeL:.11, hipR:-.05, kneeR:.16,
  armLUpper:.22, armLLower:-.18, armRUpper:-.16, armRLower:.14,
  rootScale:.93,
}, ["relaxed","relaxed"]);

const params = {
  // The tonal ladder runs: black contour / grey hair -> mid bodice -> near-paper
  // shift and skin. Nothing on her is allowed to become a mass. Grey hair is
  // deliberately MID grey, not black: Melantho's head is the black note in this
  // household and the mill woman's must not compete with it, and a lighter head
  // also keeps the top of the plate open.
  skin:"#e4dac3", hairColor:"#8e887c",
  hair:"short", beard:false, glasses:false,
  // dress + covered legs: the shift overpaint below is what the eye reads, and
  // the rig's leg tubes underneath only have to not be bare.
  garment:"dress", cloak:false, bareLegs:false,
  // the shortest figure in the palace cast — she is the weakest of the twelve
  scale:0.90,
};

const fig = makeFigure(params);

/* The SHIFT — one coarse undyed garment, ankle length, worn to near-paper.
   Anchored to the rig's own reported hip point so a cocked hip or a kneel takes
   the cloth with it, and hemmed to the floor with a cap, so kneeling poses pool
   the skirt on the ground instead of hanging it in the air.

   Everything here is drawn to keep paper showing and to avoid ruled spans: the
   fill is light, the falls stop short of the hem, the worn hem is a row of short
   broken tears rather than a band, and the two patches are outlines with a light
   fill and stitch ticks — geometry, not type, so they survive the dot lattice. */
function drawShift(ctx, W, H, hip){
  const cx = (hip && Number.isFinite(hip.x) ? hip.x : 0.5) * W;
  const hy = (hip && Number.isFinite(hip.y) ? hip.y : 0.63) * H;
  const waistY = Math.min(Math.max(hy - H*0.026, H*0.42), H*0.76);
  const hemY   = Math.min(H*0.906, waistY + H*0.330);
  const span   = hemY - waistY;
  // KNEEL is what the cloth has to say, because the cloth is what covers it: the
  // rig pins its lowest ankle to the floor, so a folded leg brings the hips DOWN
  // and the skirt gets short — and a short skirt must also get WIDE, or a
  // kneeling woman prints as a small standing one. k is that read, 0 on her feet
  // and 1 on her knees, and it drives the flare and the knee that pushes the
  // cloth forward.
  const k = Math.min(Math.max((0.300 - span/H) / 0.115, 0), 1);
  const wTop = W*(0.086 + 0.026*k), wHem = W*(0.150 + 0.115*k);
  const px = (tx, u) => cx + tx*(wTop + (wHem - wTop)*u);

  // body of the cloth — light, so she stays near paper. On the knees the near
  // side bulges over the raised knee instead of falling straight.
  const kneeX = cx - wHem*(0.52 + 0.16*k), kneeY = waistY + span*(0.60 - 0.06*k);
  ctx.fillStyle = gray(0xd6); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(kneeX - W*0.030*k, kneeY - span*0.16, kneeX, kneeY);
  ctx.quadraticCurveTo(cx - wHem*(0.94 + 0.10*k), kneeY + span*0.22, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + span*0.07, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.86, waistY + span*0.62, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // the far knee under the cloth — one closed arc, only when she is down. Two
  // knees stated makes the pooled skirt read as a body folded inside it rather
  // than as a bell of fabric.
  if (k > 0.25){
    ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + wHem*0.10, waistY + span*0.86);
    ctx.quadraticCurveTo(cx + wHem*0.54, waistY + span*0.50, cx + wHem*0.90, waistY + span*0.84);
    ctx.stroke();
  }

  // falls of cloth — each stops short of the hem so no line rules the full height
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  for (const [tx, a, b] of [[-0.70,0.12,0.78],[0.06,0.22,0.88],[0.76,0.10,0.72]]){
    ctx.beginPath();
    ctx.moveTo(px(tx,a), waistY + span*a);
    ctx.quadraticCurveTo(px(tx,(a+b)*0.5), waistY + span*(a+b)*0.5, px(tx,b), waistY + span*b);
    ctx.stroke();
  }

  // WORN HEM — not a band. Five short tears climbing off the edge at different
  // heights, which reads as cloth gone through at the bottom and deliberately
  // refuses to lay a horizontal bar across the plate.
  ctx.lineWidth = 3; ctx.lineCap = "round";
  for (const [tx, h] of [[-0.82,0.052],[-0.40,0.028],[0.02,0.046],[0.44,0.026],[0.84,0.050]]){
    const x = px(tx, 1.0), y = hemY + Math.abs(tx) * -span*0.045 + span*0.045;
    ctx.beginPath();
    ctx.moveTo(x, Math.min(y, hemY + span*0.05));
    ctx.lineTo(x + span*0.012, Math.min(y, hemY + span*0.05) - span*h);
    ctx.stroke();
  }

  // PATCHES — the mark of the lowest place in the house. Light fill, hard
  // outline, a few stitch ticks: pure geometry, legible at any dot pitch, and
  // set at two different heights on two different sides so they never pair into
  // a stripe.
  ctx.lineJoin = "miter"; ctx.lineCap = "butt";
  for (const [tx, u, w, h] of [[-0.52,0.42,0.052,0.062],[0.58,0.68,0.044,0.050]]){
    const x = px(tx,u), y = waistY + span*u;
    ctx.fillStyle = gray(0xb4); ctx.strokeStyle = INK; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.rect(x - W*w*0.5, y - H*h*0.5, W*w, H*h); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 2.2;
    for (let i = 1; i <= 3; i++){
      const sy = y - H*h*0.5 + (H*h)*(i/4);
      ctx.beginPath();
      ctx.moveTo(x - W*w*0.5 - W*0.006, sy); ctx.lineTo(x - W*w*0.5 + W*0.006, sy);
      ctx.moveTo(x + W*w*0.5 - W*0.006, sy); ctx.lineTo(x + W*w*0.5 + W*0.006, sy);
      ctx.stroke();
    }
  }

  // ROPE GIRDLE — a twisted cord, not a woven band: the one dark accent on the
  // lower half, drawn as two short arcs with a knot and two loose ends so it
  // stays broken. Working women of the house are belted with what is to hand.
  // Sat DOWN off the waist seam and cut in the middle by a wide gap: laid on the
  // seam at full width the two strokes merge into one ruled bar across the plate,
  // which is the exact failure this whole module is drawn to avoid.
  const gy = waistY + H*0.030;
  ctx.strokeStyle = INK; ctx.lineWidth = 4.2; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop*0.92, gy - H*0.010);
  ctx.quadraticCurveTo(cx - wTop*0.62, gy + H*0.004, cx - wTop*0.34, gy + H*0.006);
  ctx.moveTo(cx + wTop*0.34, gy + H*0.006);
  ctx.quadraticCurveTo(cx + wTop*0.62, gy + H*0.004, cx + wTop*0.92, gy - H*0.010);
  ctx.stroke();
  // the knot, and two loose ends of cord hanging off it down the near side
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  ctx.moveTo(cx - wTop*0.30, gy + H*0.002);
  ctx.quadraticCurveTo(cx - wTop*0.04, gy + H*0.016, cx + wTop*0.30, gy + H*0.002);
  ctx.moveTo(cx - W*0.006, gy + H*0.012);
  ctx.quadraticCurveTo(cx + W*0.004, gy + H*0.036, cx - W*0.004, gy + H*0.058);
  ctx.moveTo(cx + W*0.008, gy + H*0.012);
  ctx.quadraticCurveTo(cx + W*0.020, gy + H*0.034, cx + W*0.024, gy + H*0.050);
  ctx.stroke();
}

export const asset = {
  id:"character.mill-woman",
  type:"CHARACTER",
  name:"Mill woman",
  statusWord:"SPENT",
  scene:"OD-B20-S02",

  params,
  // separate costume layers, back -> front, honored by the rig's composite order
  layers:["shadow","hair-back","legs","bodice","far-arm","neck","head","face",
          "near-arm","shift","patches","girdle"],
  // normalized 0..1 anchors — attachment, contact, gaze and prop grips.
  // Measured off the rendered plate in the signature (prayer) pose, with the
  // grinding grips measured off mlw_grinding, so prop.millstone can dock to a
  // real hand position instead of a guessed one.
  anchors:{
    head:{x:.50,y:.27}, crown:{x:.50,y:.21}, eyes:{x:.50,y:.28},
    neck:{x:.50,y:.40},
    leftHand:{x:.46,y:.48},          // near hand closed at the breast in the prayer
    rightHand:{x:.55,y:.68},         // far hand folded low across the lap
    millGripNear:{x:.41,y:.75},      // the two grips on the quern, off mlw_grinding
    millGripFar:{x:.66,y:.70},
    hip:{x:.50,y:.70}, knee:{x:.42,y:.80}, feet:{x:.50,y:.88},
  },
  states:{
    // the scene finds her AT THE STONE — that is where the state machine opens.
    // The card previews `praying` instead, because that is the beat the whole
    // character exists for.
    initial:"grinding",
    nodes:{
      // the work: eleven have finished and gone to bed, she has not
      grinding:  { preview:{ pose:"mlw_grinding",  gaze:{x:-.10,y:.42}, status:"GRINDING" } },
      // one full turn of the stone at the limit of her strength
      heaving:   { preview:{ pose:"mlw_heave",     gaze:{x:-.14,y:.30}, status:"STRAINING" } },
      // the measure done and the body simply stopping
      slumped:   { preview:{ pose:"mlw_slumped",   gaze:{x:0,y:.36},    status:"SPENT" } },
      // SIGNATURE — the head comes up and the curse-prayer goes out
      praying:   { preview:{ pose:"mlw_prayer",    gaze:{x:-.06,y:-.44},status:"PRAYING" } },
      // did anyone hear her say it
      listening: { preview:{ pose:"mlw_listening", gaze:{x:-.70,y:-.06},status:"LISTENING" } },
      // off the floor again
      rising:    { preview:{ pose:"mlw_rising",    gaze:{x:0,y:.14},    status:"RISING" } },
      // standing, and still folded
      idle:      { preview:{ pose:"mlw_idle",      gaze:{x:-.10,y:.22}, status:"WORN" } },
      // stable identity turns
      profile:   { preview:{ pose:"profile_left" } },
      back:      { preview:{ pose:"back_view" } },
    },
    edges:[
      ["grinding","heaving"],["heaving","grinding"],["heaving","slumped"],
      ["grinding","slumped"],["slumped","praying"],["praying","listening"],
      ["listening","praying"],["listening","rising"],["praying","slumped"],
      ["rising","idle"],["idle","grinding"],["slumped","rising"],
      ["idle","profile"],["idle","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw",
            "mouthAsym","mouthPucker","cheek"],

  // CARD SIGNATURE — SPENT, in the one pose where she is not. The face channels
  // are restated here rather than left to the pose so that a scene state pass
  // laid over her cannot flatten the appeal into a neutral mask; no `mouth`
  // field, because `mouth` would overwrite smile/frown and close the jaw that is
  // mid-sentence.
  preview:()=>({ pose:"mlw_prayer", gaze:{x:-.06,y:-.44},
                 browUp:.30, browKnit:.40, eyeWide:0, eyeNarrow:0,
                 jaw:.62, smile:.12, frown:.24, mouthAsym:.20,
                 t:0.5, status:"SPENT", progress:.18 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // the whole state passes through: pose, gaze, blink, face channels and t all
    // reach the rig, so scenes drive her face without any redraw here
    const r = fig.draw(ctx, W, H, st);
    const a = (r && r.anchors) || {};
    drawShift(ctx, W, H, a.hip || { x:0.5, y:0.66 });
    return r;
  },
};
export default asset;
