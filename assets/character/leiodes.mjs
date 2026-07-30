/* character.leiodes — the suitors' diviner: their inspector of burnt
   offerings (thyoskoos), who sits apart by the mixing bowl and alone among
   them loathes what the company does. CHARACTER asset.

   He is the FIRST man to take up the great bow in Book XXI, and the first to
   fail it: soft, un-callused, indoor hands that have handled entrails and
   libation cups, never an oar or a plough. Failing, he does not merely quit —
   he READS the weapon, and pronounces over the hall that this bow will strip
   many a noble of life and breath. A ritual official who reluctantly attempts,
   and in failing recognizes an omen.

   Built on the HALFTRACK hero rig with stable identity across
   front/three-quarter/profile/back. Face, gaze, mouth, hands, shoulders,
   elbows, hips, knees and feet all stay exposed to the rig; the module adds
   NO hand-painted overpaint of any kind, so he cannot drift out of family.

   Scene function:
     OD-B21-S03  the ritual official attempting the bow reluctantly — drawn up
                 unwillingly, straining at a stave that will not bend, then
                 holding it out at arm's length and naming it an omen.

   IDENTITY — how he differs from every other man on the roster at a glance:
     * PALE, unweathered indoor skin (the soft hands are the plot point)
     * a dark mantle drape over one shoulder — an official's himation — which
       is also the one heavy dark accent on an otherwise light figure
     * neat, close-trimmed dark hair and beard: young noble, not an elder seer
     * slight, unathletic stature (scale just under 1)

   TONE — the figure is deliberately built LIGHT: pale skin, bare shins and
   forearms, a mid-gray tunic, and only the hair, beard, mantle and contour
   carrying real ink. Plenty of paper shows through.

   EXPRESSIVENESS — the scene-state overlay can only smile, frown or open the
   jaw; it cannot author the fused body+face of a man straining at a bow he
   already fears. So Leiodes ships bespoke poses into the shared rig registry,
   each authoring brow, gaze, jaw and both arms together. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Leiodes poses ----
   Registered additively into the shared pose registry (same module instance
   the hero figure reads) under a `leiodes_` prefix, so nothing collides and
   preview()/states can name them like any built-in pose.
   Convention reminders: negative headPitch / negative gazeY = eyes cast UP;
   positive armLUpper swings the LEFT arm out and up, negative armRUpper the
   RIGHT; hands are [left, right]. */
const P = (id, n, opt = {}) => {
  if (!POSES[id]) POSES[id] = { id, label: id, group: "leiodes", n, opt };
};

// THE CARD — RECOGNIZING THE OMEN. He has failed, and now holds the bow away
// from his body at the full stretch of his right arm, an offering hand under
// it as if it were a sacrificial portion he must not drop. The torso RECOILS
// backward from the thing he is presenting; the face turns down toward it,
// brows flung up AND knit, lips parted on the prophecy he is speaking over the
// hall. The asymmetry — one arm out at chest height, the other hand dropped at
// the hip, the hips carried away from both — is what reads as holding a thing
// off in dread, and it reads even with the bow cast as a separate prop.
P("leiodes_omen", {
  // NOTE ON THE MOUTH: the rig paints the beard AFTER the mouth, and the beard's
  // upper edge dips to about R*.76 while the mouth sits at R*.60 — so any jaw
  // beyond ~.30 opens straight into hair and reads as nothing. His speech is
  // therefore authored as PARTED LIPS (jaw .30) plus a skewed, downturned
  // mouth; the declamation is carried by the brows, the gaze and the body.
  browUp:.58, browKnit:.44, eyeWide:.36, eyeNarrow:0, frown:.20, jaw:.30, mouthAsym:.14,
  headPitch:.14, neckPitch:.08, headRoll:-.06,        // chin dropped toward the thing he holds
  headYaw:.22, bodyYaw:-.10, gazeX:.48, gazeY:.34,    // eyes down on the weapon he holds off
  // the RECOIL: shoulders back, hips carried away from the extended arm, so the
  // body makes an S away from what the hand offers. Asymmetry is the whole
  // gesture — both arms out would read as a shrug, not as holding a thing off.
  spineLean:.28, chestOpen:.30,
  weightShift:.30, pelvisX:-.14, hipL:.13, hipR:-.02,
  // -1.38 puts the upper arm just under horizontal and the open elbow drops the
  // hand to about x .90 of the source — presented at chest height, clear of the
  // frame edge. Anything past ~-1.55 walks the fingers off the right margin.
  armRUpper:-1.38, armRLower:.66, shoulderLiftR:.30,
  armLUpper:.24, armLLower:-.30, handRotL:-.14,       // left hand dropped at the hip, off the torso
  shoulderLiftL:0, rootScale:.99,
}, { hands:["relaxed","offering"] });

// THE ATTEMPT — straining at a bow that will not bend. Side-on archer's
// stance: left arm thrust out holding the stave, right fist hauled back at
// the chest, both shoulders hunched up around his neck with wasted effort,
// knees softened, spine pitched into it. Brows clamped, eyes narrowed to a
// squint down the arm, teeth set with the jaw just cracked. Everything says
// force applied and nothing moving.
P("leiodes_strain", {
  browKnit:.78, browUp:.10, eyeNarrow:.58, frown:.44, jaw:.24, cheek:.38, mouthAsym:.16,
  bodyYaw:-.36, headYaw:-.16, headPitch:.06, gazeX:-.54, gazeY:-.02,
  spineLean:-.16, spineTwist:.18, chestOpen:.20, crouch:.16, kneeL:.26, kneeR:.24,
  // bow arm locked out. 1.12 rather than a flat 1.42: a fully horizontal bow
  // arm walks the fist off the LEFT margin of the source frame.
  armLUpper:1.12, armLLower:-.32, handRotL:-.12, shoulderLiftL:.66,
  armRUpper:-.52, armRLower:1.46, handRotR:.18, shoulderLiftR:.72,   // draw fist, hauled back
  weightShift:.28, pelvisX:.10, rootScale:1.0,
}, { hands:["fist","fist"] });

// RELUCTANT — rising when the company calls his name. Turned half away from
// the hall, shoulders drawn in, both hands pulled to his belly, gaze dropped
// to the floor, brows up and knit with distaste. He does not want to touch it.
P("leiodes_reluctant", {
  browUp:.46, browKnit:.36, eyeNarrow:.20, frown:.32, jaw:.04,
  bodyYaw:.44, headYaw:-.36, headPitch:.20, gazeX:-.40, gazeY:.26,
  spineLean:.12, shoulderLiftL:.36, shoulderLiftR:.36,
  armLUpper:-.70, armLLower:-1.06, armRUpper:.62, armRLower:.94,
  weightShift:.42, pelvisX:.18, rootScale:.97,
}, { hands:["relaxed","relaxed"] });

// OFFICIATING — the ritual baseline, his office rather than his ordeal: a
// three-quarter turn toward the mixing bowl, both palms turned up over an
// offering, chin lowered, eyes down, mouth closed and composed.
P("leiodes_officiate", {
  browUp:.16, browKnit:.08, eyeNarrow:.24, jaw:0, smile:.04,
  bodyYaw:-.24, headYaw:-.10, headPitch:.22, neckPitch:.12, gazeX:-.12, gazeY:.30,
  spineLean:-.06,
  armLUpper:.60, armLLower:-.80, armRUpper:-.66, armRLower:.86,
  rootScale:.99,
}, { hands:["palm_up","palm_up"] });

// YIELDING — handing the bow on. Head lowered, arms sinking, the offering
// hand let down and open, brows still knit: he has said his omen and no one
// in the hall has listened.
P("leiodes_yield", {
  browUp:.42, browKnit:.46, eyeNarrow:.26, frown:.34, jaw:.06,
  headPitch:.46, neckPitch:.24, headYaw:.10, gazeX:.08, gazeY:.44,
  spineLean:.10, bodyYaw:-.14,
  armRUpper:-.36, armRLower:.50, armLUpper:.32, armLLower:-.46,
  rootScale:.97,
}, { hands:["relaxed","offering"] });

// SUPPLICATING — the same man later, on his knees at the archer's feet with
// both hands out, brows flung high, eyes wide, mouth open pleading his one
// honest defence. Kept here so the character carries his whole arc.
P("leiodes_supplicate", {
  browUp:.88, browKnit:.30, eyeWide:.66, frown:.34, jaw:.30,
  crouch:1, kneeL:1.70, hipL:-.90, kneeR:.60, hipR:.30, rootY:.14,
  spineLean:-.10, headPitch:-.26, headYaw:.12, gazeX:.16, gazeY:-.44,
  armLUpper:1.06, armLLower:-.44, armRUpper:-1.24, armRLower:.56,
  shoulderLiftL:.30, shoulderLiftR:.30, rootScale:.98,
}, { hands:["offering","offering"] });

const params = {
  // PALE, unweathered indoor skin — the soft un-callused hands are the plot
  // point. Dark but not black hair: a close-trimmed young noble, never an
  // iron-grey elder. The mantle (cloak) is the single heavy dark accent.
  skin:"#dcc9ab", hairColor:"#3c352b",
  hair:"short", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:0.99,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.leiodes",
  type:"CHARACTER",
  name:"Leiodes",
  statusWord:"RELUCTANT",
  scene:"OD-B21-S03",

  params,
  layers:["shadow","legs","torso","mantle","far-arm","neck","head","face",
          "hair-front","beard","near-arm"],
  // normalized 0..1 anchors, read off the rendered rig rather than guessed.
  // head/hands are given for the OMEN pose (the preview); bowGrip and drawHand
  // are given for the STRAIN pose, since that is where a bow actually attaches.
  anchors:{
    head:{x:.57,y:.29}, crown:{x:.57,y:.19}, eyes:{x:.575,y:.29},
    rightHand:{x:.87,y:.57}, leftHand:{x:.29,y:.57},
    offerOut:{x:.87,y:.57},     // the weapon held away at arm's length, an omen
    bowGrip:{x:.12,y:.55},      // strain pose: the locked-out bow-arm fist
    drawHand:{x:.60,y:.55},     // strain pose: the fist hauled back at the chest
    hip:{x:.50,y:.65}, feet:{x:.46,y:.91},
  },
  states:{
    initial:"officiate",
    nodes:{
      // his office: the diviner at the mixing bowl, palms up over an offering
      officiate:  { preview:{ pose:"leiodes_officiate", gaze:{x:-.12,y:.30}, status:"OFFICIATING" } },
      // called up, turning away, hands pulled in — he does not want the bow
      reluctant:  { preview:{ pose:"leiodes_reluctant", gaze:{x:-.40,y:.26}, status:"RELUCTANT" } },
      // (S03) the attempt: archer's stance, hunched, straining, nothing bends
      strain:     { preview:{ pose:"leiodes_strain",    gaze:{x:-.54,y:-.02}, status:"STRAINING" } },
      // (S03) THE beat: the weapon held off at arm's length and named an omen
      omen:       { preview:{ pose:"leiodes_omen",      gaze:{x:.46,y:.16},  status:"OMEN-STRUCK" } },
      // handing it on, head down, unheeded
      yield:      { preview:{ pose:"leiodes_yield",     gaze:{x:.08,y:.44},  status:"UNHEEDED" } },
      // the later plea, on his knees
      supplicate: { preview:{ pose:"leiodes_supplicate",gaze:{x:.16,y:-.44}, status:"PLEADING" } },
      // stable identity turns
      profile:    { preview:{ pose:"profile_left" } },
      back:       { preview:{ pose:"back_view" } },
    },
    edges:[
      ["officiate","reluctant"],["reluctant","strain"],["strain","omen"],
      ["omen","yield"],["yield","officiate"],["strain","yield"],
      ["reluctant","officiate"],["yield","supplicate"],["omen","supplicate"],
      ["officiate","profile"],["officiate","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow",
            "jaw","mouthAsym","cheek"],

  // CARD SIGNATURE — OMEN-STRUCK: the failed diviner recoiling from the bow he
  // holds out at full stretch, brows flung up and knit, jaw open on the
  // prophecy. No `mouth` field: the open declaiming mouth and the dropped,
  // dreading gaze live in the pose so a scene overlay cannot flatten them.
  preview:()=>({ pose:"leiodes_omen", gaze:{x:.46,y:.16}, t:0.42,
                 status:"OMEN-STRUCK", progress:.24 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, t all reach the rig
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
