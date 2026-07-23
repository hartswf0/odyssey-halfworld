/* character.zeus — the cloud-gatherer, father of gods and men.
   CHARACTER asset. Scene function (OD-B01-S01): the troubled sovereign
   speaks from seated authority, then rises to defend the gods' treatment
   of Odysseus. Built on the HALFTRACK hero rig — a mature, bearded king in
   a heavy robe, broad-shouldered, grey of hair, bearing the weight of a
   crown he never takes off. Stable identity across front/three-quarter/
   profile/back; face, gaze, mouth, hands, and every joint stay exposed to
   the rig so scenes can drive him.

   EXPRESSIVENESS: the hero rig reads facial channels (browKnit, browUp,
   eyeNarrow, frown, jaw, mouthAsym) ONLY from the composed POSE, and the
   scene-state mouth overlay can only make a smile or a frown-line — never a
   grave OPEN mouth. So Zeus ships his own bespoke poses in the shared POSE
   registry, each one fusing a knit/heavy brow + an open decreeing jaw + a
   gesturing arm. That is what lets the card actually EMOTE. */
import { makeFigure } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Zeus poses: brow + jaw + arm authored together ----
   Registered into the shared rig registry (same module instance the hero
   figure reads), so preview()/states can name them like any built-in pose. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "zeus", n, opt }; };

// THE CARD — troubled sovereign, grave authority: knit brow, narrowed stern
// eyes, grim open decreeing mouth, forward lean, right arm thrust forward
// mid-decree with a pointing hand. Chin up, looming (rootScale>1).
P("zeus_troubled", {
  browKnit:.86, browUp:.12, eyeNarrow:.36, frown:.36, mouthAsym:.12,
  jaw:.62,                                  // OPEN — the mouth is speaking a decree
  spineLean:-.28, headPitch:-.06, chestOpen:.35,
  bodyYaw:-.10, headYaw:-.14, gazeX:-.34, gazeY:.05,   // near-frontal so BOTH brows + mouth read
  armRUpper:-1.52, armRLower:.16,           // right arm raised/forward, gesturing
  armLUpper:.30, armLLower:-.22,
  shoulderLiftR:.22, rootScale:1.07,
}, { hands:["relaxed","point"] });

// calm settled authority — weary king at rest, level heavy-lidded gaze,
// mouth closed and firm, hands quiet. The still counterpoint.
P("zeus_seated_calm", {
  browKnit:.10, browUp:.02, eyeNarrow:.16, frown:.08, jaw:0,
  headPitch:.03, gazeX:0, gazeY:.05,
  armLUpper:.20, armLLower:-.14, armRUpper:-.20, armRLower:.12,
}, { hands:["relaxed","relaxed"] });

// speaking / expounding — jaw wide open mid-word, brows lifted-and-knit in
// argument, chest thrown open, BOTH hands presenting palms out. Distinct
// from the card: open and explanatory rather than grave and pointed.
P("zeus_speaking", {
  browUp:.34, browKnit:.20, eyeWide:.14, frown:.05,
  jaw:.62,                                  // wide open — mid-sentence
  chestOpen:1, spineLean:-.12,
  armLUpper:.98, armRUpper:-.98, armLLower:-.42, armRLower:.42,
  handRotL:-.22, handRotR:.22, rootScale:1.02,
}, { hands:["open_palm","open_palm"] });

// rising to a decree — one arm flung high, brow knit hard, mouth open in a
// pronouncement. The peak of the beat.
P("zeus_decree", {
  browKnit:.5, browUp:.24, eyeNarrow:.2, frown:.18, mouthAsym:.12,
  jaw:.5,
  spineLean:-.06, headPitch:-.05, headYaw:.1, gazeX:.18, gazeY:-.05,
  armLUpper:2.66, armLLower:-.18, shoulderLiftL:.72,
  armRUpper:-.34, armRLower:.9, rootScale:1.05,
}, { hands:["open_palm","relaxed"] });

const params = {
  skin:"#d8c4a6", hairColor:"#6d685f",   // sun-worn skin, iron-silver mane + full beard
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.06,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.zeus",
  type:"CHARACTER",
  name:"Zeus",
  statusWord:"TROUBLED",
  scene:"OD-B01-S01",

  params,
  layers:["shadow","hair-back","legs","torso","robe","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props / throne
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    scepterGrip:{x:.68,y:.55}, hip:{x:.50,y:.66},
    throneSeat:{x:.50,y:.70}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"seated",
    nodes:{
      // seated authority: grounded, weight settled, level gaze, mouth firm
      seated:    { preview:{ pose:"zeus_seated_calm", gaze:{x:0,y:.05} } },
      // troubled sovereign speaking — leaned in, brow knit, mouth open, arm forward
      troubled:  { preview:{ pose:"zeus_troubled", gaze:{x:-.42,y:.06}, status:"TROUBLED" } },
      // expounding to the council — jaw wide, both palms presenting
      speaking:  { preview:{ pose:"zeus_speaking", gaze:{x:.06,y:0} } },
      // rising to DEFEND the gods — forward point, stern
      defending: { preview:{ pose:"zeus_troubled", gaze:{x:-.5,y:0} } },
      // one arm flung high in pronouncement
      decree:    { preview:{ pose:"zeus_decree", gaze:{x:.18,y:-.05} } },
      // stable identity turns
      profile:   { preview:{ pose:"profile_left" } },
      back:      { preview:{ pose:"back_view" } },
    },
    edges:[
      ["seated","troubled"],["troubled","speaking"],["speaking","defending"],
      ["defending","decree"],["decree","seated"],["troubled","seated"],
      ["seated","profile"],["seated","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band"],

  // EXPRESSIVE signature: grave, forward-leaning, knit-browed, open-mouthed
  // decree with a pointing arm. No `mouth` field — the open jaw + frown live
  // in the pose so the mouth overlay does not flatten them to a smile.
  preview:()=>({ pose:"zeus_troubled", gaze:{x:-.34,y:.05}, t:0.4, status:"TROUBLED", progress:.24 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, t all reach the rig
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
