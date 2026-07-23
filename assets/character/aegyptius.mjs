/* character.aegyptius — the stooped elder who opens the assembly of Ithaca.
   CHARACTER asset. Scene function (OD-B02-S01): the oldest man of the island,
   bowed with age over a walking staff, rises FIRST to open the gathering —
   curious who has called them together, yet carrying an old grief for the son
   the Cyclops took. Built on the HALFTRACK hero rig: a bent, white-bearded
   elder in a long robe and cloak, one hand clutching a staff planted on the
   ground, the other lifted in an opening, questioning gesture. Stable identity
   across front/three-quarter/profile/back; face, gaze, mouth, hands and every
   joint stay exposed so scenes can drive him.

   EXPRESSIVENESS: the hero rig reads POSTURE and ARM channels (spineLean,
   headPitch, armR*, shoulderLift) ONLY from the composed POSE — the scene
   overlay can drive the FACE (brows, eyes, jaw, mouth) but never the bent
   spine, the bowed head, or the staff-gripping / gesturing arms. So Aegyptius
   ships bespoke poses into the shared registry, each fusing a stooped spine +
   a bowed/lifted head + a staff-grip left arm + an expressive right arm. The
   walking staff itself is drawn in draw() at the live left-hand anchor. */
import { makeFigure, INK } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Aegyptius poses: stooped spine + head + staff-grip + gesture ----
   Registered into the shared rig registry (same module instance the hero figure
   reads) so preview()/states can name them like any built-in pose.
   Conventions: negative spineLean bends the spine FORWARD (a stoop); positive
   headPitch bows the head DOWN; the LEFT arm hangs near-vertical to clutch the
   staff (hands[0]="fist"); the RIGHT arm does the talking. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "aegyptius", n, opt }; };

// THE CARD — opening the gathering: bowed forward over the staff, the free
// right hand lifted and opened in an "who has summoned us?" welcome, head low
// but face turned up to the crowd, knees softened with age. Face is driven by
// the overlay (curiosity raised high, grief knit underneath).
P("aeg_open", {
  spineLean:-.24, headPitch:.15, neckPitch:.10, headY:.05,
  bodyYaw:-.16, headYaw:-.04,
  armLUpper:.13, armLLower:-.05, handRotL:.04,            // left hand down, clutching staff
  armRUpper:-.90, armRLower:.60, handRotR:.10, shoulderLiftR:.16,  // right hand lifted, opened
  hipL:.05, kneeL:.17, hipR:-.03, kneeR:.19, ankleL:-.05, ankleR:.02,
  rootScale:.93,
}, { hands:["fist","open_palm"] });

// addressing — mid-speech to the assembly: the stoop eases a touch as he lifts
// to be heard, chest opens, the right arm reaches forward to the crowd. Jaw is
// driven OPEN by the overlay on this state.
P("aeg_address", {
  spineLean:-.16, headPitch:.04, neckPitch:.02, chestOpen:.34,
  bodyYaw:-.12, headYaw:-.10,
  armLUpper:.14, armLLower:-.06,
  armRUpper:-1.20, armRLower:.30, shoulderLiftR:.20,       // arm thrust toward the gathering
  hipL:.05, kneeL:.15, hipR:-.03, kneeR:.17, rootScale:.95,
}, { hands:["fist","offering"] });

// grieving — the memory of his lost son buckles him: the deepest stoop, head
// bowed hard, the free hand drawn up toward the chest/beard, weight sinking
// onto the staff. Face driven to a knit, downturned grief by the overlay.
P("aeg_grief", {
  spineLean:-.32, headPitch:.48, neckPitch:.26, headY:.14,
  bodyYaw:-.10, headYaw:.02,
  armLUpper:.12, armLLower:-.04,
  armRUpper:-.42, armRLower:1.36, shoulderLiftR:.30,       // hand comes up to the heart
  hipL:.06, kneeL:.22, hipR:-.02, kneeR:.24, rootScale:.90,
}, { hands:["fist","relaxed"] });

// curious — head cocked, brows up, the free hand turned palm-up in a genuine
// question. The lighter, quizzical counterpoint to the grief.
P("aeg_curious", {
  spineLean:-.20, headPitch:.06, headRoll:.15, neckRoll:.10,
  bodyYaw:-.14, headYaw:-.08,
  armLUpper:.13, armLLower:-.05,
  armRUpper:-.80, armRLower:.78, shoulderLiftR:.12,        // palm-up question
  hipL:.05, kneeL:.16, hipR:-.03, kneeR:.18, rootScale:.93,
}, { hands:["fist","palm_up"] });

const params = {
  skin:"#cdba9c", hairColor:"#7c7869",     // weathered pale skin; silvered grey hair + full elder's beard (dark enough to read the mass)
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

/* the walking staff — a gnarled wooden shaft the elder clutches and leans on.
   Drawn in solid wood-gray + hard contour at the live left-hand anchor so the
   engine's dotify POST pass gives it the same halftone as the figure. */
function drawStaff(ctx, W, H, gx, gy){
  // a walking cane clutched at the fist: top sits just ABOVE the grip (never
  // rising into the face), the shaft angles out to the floor at his side.
  const shaftX = gx - W*0.012;
  const topX = shaftX + W*0.004, topY = gy - H*0.085;
  const botX = shaftX - W*0.012, botY = H*0.905;
  const midX = shaftX + W*0.006, midY = (topY+botY)*0.5;   // a slight gnarl bow
  const w = W*0.019;
  ctx.save();
  ctx.lineCap="round"; ctx.lineJoin="round";
  const path=()=>{ ctx.beginPath(); ctx.moveTo(topX,topY); ctx.quadraticCurveTo(midX,midY,botX,botY); };
  ctx.strokeStyle=INK;      ctx.lineWidth=w+7; path(); ctx.stroke();   // contour
  ctx.strokeStyle="#9a9188"; ctx.lineWidth=w;  path(); ctx.stroke();   // wood
  // knobbed head of the staff
  ctx.fillStyle="#8a8178"; ctx.strokeStyle=INK; ctx.lineWidth=4;
  ctx.beginPath(); ctx.ellipse(topX, topY, w*1.2, w*1.35, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // grain nicks down the shaft
  ctx.strokeStyle=INK; ctx.lineWidth=2.2;
  for(let i=1;i<=3;i++){ const t=i/4, x=topX+(botX-topX)*t, y=topY+(botY-topY)*t;
    ctx.beginPath(); ctx.moveTo(x-w*0.40, y); ctx.lineTo(x+w*0.55, y+H*0.011); ctx.stroke(); }
  ctx.restore();
}

export const asset = {
  id:"character.aegyptius",
  type:"CHARACTER",
  name:"Aegyptius",
  statusWord:"GRIEVING",
  scene:"OD-B02-S01",

  params,
  layers:["shadow","staff-back","hair-back","legs","torso","robe","far-arm","neck","head","face","hair-front","beard","near-arm","staff"],
  // normalized 0..1 anchors for scene attachment / gaze / props / staff
  anchors:{
    head:{x:.50,y:.22}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.23},
    rightHand:{x:.66,y:.44}, leftHand:{x:.35,y:.62},
    staffGrip:{x:.35,y:.62}, staffTop:{x:.36,y:.24}, staffBase:{x:.34,y:.90},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.93},
  },
  states:{
    initial:"opening",
    nodes:{
      // THE beat — rising first to open the assembly: bowed over the staff,
      // free hand lifted in welcome, brows raised in curiosity, a grief-knit
      // underneath, mouth just parting to speak.
      opening:   { preview:{ pose:"aeg_open", browUp:.46, browKnit:.30, frown:.12,
                             eyeWide:.12, jaw:.15, gaze:{x:.05,y:-.05}, status:"OPENING" } },
      // speaking to the gathering — arm thrust forward, jaw open, brows lifted
      addressing:{ preview:{ pose:"aeg_address", browUp:.40, browKnit:.18, jaw:.52,
                             smile:.05, gaze:{x:.12,y:-.02}, status:"SPEAKING" } },
      // the old grief for his lost son — head bowed, mouth pulled down, brows
      // knit AND lifted, eyes cast low to the ground.
      grieving:  { preview:{ pose:"aeg_grief", frown:.60, browKnit:.55, browUp:.46,
                             eyeNarrow:.24, gaze:{x:0,y:.48}, status:"GRIEVING" } },
      // quizzical — head cocked, brows high, a genuine palm-up question.
      curious:   { preview:{ pose:"aeg_curious", browUp:.56, browKnit:.12, eyeWide:.22,
                             gaze:{x:.14,y:-.10}, status:"CURIOUS" } },
      // stable-identity turns
      profile:   { preview:{ pose:"profile_left" } },
      back:      { preview:{ pose:"back_view" } },
    },
    edges:[
      ["opening","addressing"],["addressing","opening"],["opening","grieving"],
      ["grieving","opening"],["opening","curious"],["curious","addressing"],
      ["opening","profile"],["opening","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — GRIEVING/OPENING: bowed forward over the walking
  // staff, the free right hand lifted and opened to the assembly, head low but
  // face turned up, brows raised in curiosity with a grief-knit beneath, mouth
  // just parting. The bent spine, staff-grip and lifted arm all live in the
  // pose so the overlay can't flatten them.
  preview:()=>({ pose:"aeg_open",
                 browUp:.46, browKnit:.30, frown:.12, eyeWide:.12, jaw:.15,
                 gaze:{x:.05,y:-.05}, t:0.4, status:"GRIEVING", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, facial, t
    const res = fig.draw(ctx, W, H, state);
    // plant the walking staff at the live left-hand grip (falls back if absent)
    const a = res && res.anchors;
    const gx = a && a.leftHand ? a.leftHand.x*W : W*0.35;
    const gy = a && a.leftHand ? a.leftHand.y*H : H*0.62;
    drawStaff(ctx, W, H, gx, gy);
    return res;
  },
};
export default asset;
