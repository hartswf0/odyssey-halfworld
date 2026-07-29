/* character.melanthius — the disloyal goatherd of Ithaca.
   CHARACTER asset. Eumaeus' exact opposite and deliberate visual rhyme: the
   OTHER herdsman. Where the swineherd is grizzled, hide-cloaked, planted on a
   staff and open-handed, Melanthius is a younger wiry man with black curls and
   a trimmed black beard, a suitor's gift-mantle thrown over a working tunic,
   bare goatherd shins — and a body language of pure swagger: weight cocked on
   one hip, spine lolled BACK, chin up, eyes cast down his nose, one fist parked
   on the hip. He drives his master's best goats down to his master's enemies
   and eats at their table for it.

   Scene function:
     OD-B17-S02  the disloyal goatherd swaggering under suitor patronage and
                 using livestock as tribute — met at the fountain driving the
                 suitors' best goats, insulting the beggar, kicking him, mocking
                 Eumaeus, then on toward the palace.

   CHARACTERISATION: the man has two faces and the asset ships both — contempt
   aimed DOWN (swagger, jeer, kick) and servility aimed UP (fawn). That pairing
   IS Melanthius; a single sneering pose would only be a thug. The hero rig
   reads brow/eye/jaw/mouth channels straight off the composed pose, so each
   beat authors its face, its arms and its stance together and the scene layer
   never has to flatten them.

   NO hand-drawn overpaint: everything here is the shared rig, so he stays in
   family with the rest of the cast and the engine's single dotify POST pass
   supplies the halftone. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Melanthius poses ----
   Registered additively into the shared rig registry (same module instance the
   hero figure reads), so preview()/states name them like any built-in pose.
   Conventions: +armLUpper swings the LEFT (far, screen-left) arm outward, and
   -armRUpper swings the RIGHT (near) arm outward; a forearm angle near +1.0 on
   the right folds the hand back onto the hip. -headPitch lifts the chin while
   +gazeY drops the pupils — together that is looking down the nose, which is
   the whole man. +hipL swings the left leg forward (screen left). */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "melanthius", n, opt }; };

// THE CARD — SWAGGER: hip thrown, weight lolled onto one leg, spine leaned
// BACK (the posture of a man who eats at a table he did not set), chest open,
// head cocked and chin lifted while the eyes slide DOWN at whoever is beneath
// him. One fist parked on the hip, the far arm swung loose. Mouth pulled hard
// to one side — a smirk, not a smile: mouthAsym does the sneering, the small
// smile only supplies the lift so it never reads as a frown.
P("mel_swagger", {
  rootX:-.14,                                                // re-centre: the lean is a loll, not a topple
  weightShift:.42, pelvisX:.08, pelvisRot:.07,
  hipL:.06, kneeL:.02, hipR:-.05, kneeR:.18, footRotR:.08,   // cocked stance, one knee slack
  spineLean:.08, chestOpen:.46, chestLift:.2, shoulderTilt:.08,  // lolled back, chest thrown open
  bodyYaw:-.34, headYaw:.02, headRoll:-.10, headPitch:-.20,  // chin up, head tipped
  gazeX:-.35, gazeY:.42,                                     // looking DOWN his nose
  // the sneer: corners DOWN (frown outruns smile) and the jaw cracked just far
  // enough to open a dark slot, so the mouth cannot be misread as the beard's
  // upper edge — a closed mouth inside that beard always prints as a grin.
  browUp:.04, browKnit:.38, eyeNarrow:.55, smile:.10, frown:.22, mouthAsym:.80, jaw:.20,
  armLUpper:.42, armLLower:-1.28, handRotL:-.22, shoulderLiftL:.14, // NEAR fist parked on the hip
  armRUpper:-.30, armRLower:.16, handRotR:.10,                      // far arm hangs loose
  rootScale:1.00,
}, { hands:["fist","relaxed"] });

// JEER — insulting the beggar and mocking Eumaeus: leaned in off the swagger,
// jaw dropped on a hard word, brows slammed together, eyes pinched, the far arm
// thrust out to point at the man on the ground while the near fist STAYS on the
// hip. Contempt that never fully commits its body.
P("mel_jeer", {
  bodyYaw:-.42, headYaw:-.22, headPitch:-.12, spineLean:-.18, chestOpen:.30,
  gazeX:-.50, gazeY:.24,
  browKnit:.58, browUp:.14, eyeNarrow:.34, jaw:.58, mouthAsym:.50, smile:.18,
  // NEAR arm out and DOWN, pointing at the man he has put on the ground — a
  // level arm reaches past the card edge, and the downward jab is the truer read
  armLUpper:1.12, armLLower:-.30, handRotL:-.14, shoulderLiftL:.22,
  armRUpper:-.48, armRLower:1.06, handRotR:.18,                      // near fist still on the hip
  weightShift:.42, pelvisX:.18, hipL:.14,
  rootScale:1.03,
}, { hands:["point","fist"] });

// KICK — the beat itself: the left leg driven out at the beggar, torso rocked
// back over the planted right leg, far arm swung back as counterweight, near
// arm flung open. Brows down, frown hard, jaw parted on the effort. The rig's
// floor solve plants the standing foot, so the kicking leg reads clean.
P("mel_kick", {
  hipL:.92, kneeL:-.06, ankleL:-.34, footRotL:-.30,   // driving leg
  hipR:-.16, kneeR:.06,                                // planted leg
  pelvisRot:-.10, weightShift:-.40, spineLean:.34,
  bodyYaw:-.30, headYaw:-.20, headPitch:-.06, gazeX:-.50, gazeY:.30,
  browKnit:.62, eyeNarrow:.40, frown:.30, jaw:.34, mouthAsym:.34,
  // near arm flung open as counterweight — kept well inside the frame; a fully
  // horizontal arm runs off the card edge at this scale
  armLUpper:.82, armLLower:-.22, handRotL:-.16, shoulderLiftL:.34,
  armRUpper:.45, armRLower:.90, handRotR:.14,                       // far arm swung back
  rootScale:1.04,
}, { hands:["open_palm","fist"] });

// DRIVE — livestock as tribute: mid-stride down the road with the goad arm
// cocked high over the flock and the far arm out low, sweeping them on. Head
// turned down toward the animals, mouth open on a herding shout, the smirk of
// a man pleased with his errand still on it. Authored as a static stride so the
// raised goad arm survives (the walk action mod would overwrite both arms).
P("mel_drive", {
  hipL:.42, kneeL:.06, hipR:-.36, kneeR:.46, ankleR:.10, rootY:-.02, rootX:.10,
  spineLean:-.12, bodyYaw:-.50, headYaw:-.22, gazeX:-.45, gazeY:.18,
  browKnit:.30, eyeNarrow:.24, smile:.24, mouthAsym:.40, jaw:.20,
  // goad arm cocked STEEPLY overhead (near vertical, not swung out sideways —
  // a 45-degree raise puts the hand through the card edge)
  armLUpper:2.62, armLLower:-.05, shoulderLiftL:.50, handRotL:-.20,
  armRUpper:-.85, armRLower:.48, handRotR:.16,                      // far arm low, herding
  rootScale:1.02,
}, { hands:["fist","open_palm"] });

// FAWN — the other face, aimed UP at his patrons: shoulders hunched to the
// ears, torso bowed forward, both hands offered open, brows high, eyes wide,
// a broad ingratiating grin, gaze lifted to the man at the table. Same body,
// inverted: this is what the swagger is bought with.
P("mel_fawn", {
  spineLean:-.30, headPitch:.20, neckPitch:.14, headY:.08,
  bodyYaw:.30, headYaw:.34, gazeX:.46, gazeY:-.34,                  // looking UP at the patron
  browUp:.62, browKnit:.10, eyeWide:.34, smile:.66, cheek:.50, jaw:.18,
  armLUpper:.66, armLLower:-.62, armRUpper:-.72, armRLower:.66,     // both hands offered up
  shoulderLiftL:.44, shoulderLiftR:.44, rootScale:.96,
}, { hands:["offering","offering"] });

// IDLE — insolent rest: three-quarter turn, arms crossed, hip cocked, eyes
// narrowed sideways, mouth already skewed. Watchful and unhelpful.
P("mel_idle", {
  bodyYaw:-.50, headYaw:-.20, gazeX:-.30, gazeY:.10,
  weightShift:.50, pelvisX:.22, hipL:.14, kneeR:.12,
  browKnit:.20, eyeNarrow:.30, smile:.14, mouthAsym:.40,
  armLUpper:-1.00, armLLower:-1.30, handRotL:-.40,
  armRUpper:1.00, armRLower:1.30, handRotR:.40,
}, { hands:["relaxed","relaxed"] });

const params = {
  // younger and better-fed than a herdsman should be — the suitors' table shows
  // in him. BLACK curls + a trimmed black beard set him against Eumaeus' grizzled
  // grey-brown crop; the working tunic keeps his class, the cloak is the gift.
  // The coarse dark goatherd's tunic is the mid ink plane, the gift-mantle
  // drapes a step darker over it, and the bare working shins stay near paper —
  // that ladder (black contour / dark mantle / mid tunic / light skin) is what
  // keeps him legible instead of one flat mass.
  skin:"#c2a87e", hairColor:"#201d19",
  hair:"curly", beard:true, glasses:false,
  garment:"rags", cloak:true, bareLegs:true, scale:0.99,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.melanthius",
  type:"CHARACTER",
  name:"Melanthius",
  statusWord:"INSOLENT",
  scene:"OD-B17-S02",

  params,
  // separate costume layers, back -> front, honored by the rig's composite order
  layers:["shadow","hair-back","legs","tunic","gift-cloak","far-arm","neck","head",
          "face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / prop grips
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.21},
    rightHand:{x:.61,y:.60}, leftHand:{x:.37,y:.58},   // near fist on the hip, far arm loose
    goadGrip:{x:.68,y:.26},                             // where the driving switch sits, arm cocked
    kickFoot:{x:.30,y:.78}, hip:{x:.52,y:.64}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"swagger",
    nodes:{
      // SIGNATURE — hip cocked, spine lolled back, chin up, eyes down the nose,
      // fist on the hip, mouth pulled into a smirk.
      swagger: { preview:{ pose:"mel_swagger", gaze:{x:-.35,y:.42}, status:"INSOLENT" } },
      // driving the suitors' best goats to town — tribute out of his master's herd
      driving: { preview:{ pose:"mel_drive",   gaze:{x:-.45,y:.18}, status:"DRIVING" } },
      // insulting the beggar, mocking the swineherd
      jeering: { preview:{ pose:"mel_jeer",    gaze:{x:-.50,y:.24}, status:"JEERING" } },
      // the kick at the fountain
      kicking: { preview:{ pose:"mel_kick",    gaze:{x:-.50,y:.30}, status:"KICKING" } },
      // the face he keeps for his patrons
      fawning: { preview:{ pose:"mel_fawn",    gaze:{x:.46,y:-.34}, status:"FAWNING" } },
      // insolent rest
      idle:    { preview:{ pose:"mel_idle",    gaze:{x:-.30,y:.10}, status:"WAITING" } },
      // stable identity turns
      profile: { preview:{ pose:"profile_left" } },
      back:    { preview:{ pose:"back_view" } },
    },
    edges:[
      ["idle","driving"],["driving","swagger"],["swagger","jeering"],
      ["jeering","kicking"],["kicking","swagger"],["swagger","driving"],
      ["swagger","fawning"],["fawning","swagger"],["jeering","idle"],
      ["idle","profile"],["idle","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw",
            "mouthAsym","mouthPucker","cheek"],

  // CARD SIGNATURE — INSOLENT. No `mouth` field: the sneer is mouthAsym, which
  // the scene overlay cannot reach, so the smirk survives any state pass.
  preview:()=>({ pose:"mel_swagger", gaze:{x:-.35,y:.42}, t:0.5,
                 status:"INSOLENT", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, t all reach the rig
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
