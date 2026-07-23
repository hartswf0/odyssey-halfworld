/* character.child-eumaeus-memory-variant — the swineherd remembered as a boy.
   A memory-flashback variant of loyal Eumaeus: the SAME lineage identity carried
   back to childhood — a small ROYAL CHILD (scale ~0.55) in a fine child's tunic,
   the king's son of Syrie before the Phoenicians stole him. Where the base
   Eumaeus is a sturdy, weathered, open-handed host, this variant is tiny and
   frightened: a small reaching boy carried/led away into abduction and sale, his
   face pulled wide with a child's terror. Un-weathered soft skin, no beard, the
   same warm ruddy-brown coloring un-greyed to a child's brown hair — a
   memory-toned young Eumaeus who never loses his canonical thread.
   Atlas: OD-B15-S04 — "royal child carried into abduction and sale". */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  // soft un-weathered child's skin (a lighter, warmer read of the adult's
  // ruddy #c6a37c), and the adult's grizzled grey-brown carried back to a
  // young child's natural brown — the memory thread to grown Eumaeus.
  skin:"#dcc09a", hairColor:"#4a3f33",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true,
  scale:0.55,                     // a small royal CHILD — tiny in frame
};

const fig = makeFigure(params);

/* ---- bespoke frightened-child poses ----
   The rig reads brow/frown/jaw/eye/arm channels straight off the pose def, so
   each beat of the abduction gets its own registered pose. A child's terror is
   baked in: raised-and-knit brows, wide eyes, a parted crying mouth, small
   lifted shoulders. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"child-eumaeus", n, opt:hands?{hands}:{} }; }

// REACH-AWAY — the SIGNATURE: the small boy twists hard and throws his far arm
// up and back, reaching after the home being torn away from him, while the near
// arm stretches out grasping at nothing; body pulled off balance, mouth wrenched
// open on a cry, eyes blown wide, brows up-and-knit in pure child fear. The
// reaching-carried-away pose.
P("child_reach_away", {
  spineLean:-.30, bodyYaw:-.44, headYaw:-.52, headRoll:-.14, rootScale:.98,
  armLUpper:2.66, armLLower:-.14, handRotL:-.28,        // far arm flung straight UP, reaching after home
  armRUpper:-.60, armRLower:1.18, handRotR:.24,          // near arm dropped LOW, grasping down/forward
  shoulderLiftL:.18, shoulderLiftR:.34,
  browUp:.82, browKnit:.48, eyeWide:.86, jaw:.64, frown:.44, mouthAsym:.16,
}, ["open_palm","open_palm"]);

// CARRIED — hoisted and hauled off: the body tilts hard, one arm thrown back
// toward home, the other flung up, small legs kicking out from under the tunic,
// head rolled, a wail on the open mouth. Being carried into abduction.
P("child_carried", {
  spineLean:-.10, headRoll:.34, headYaw:.22, pelvisRot:.16, bodyYaw:.18, rootY:-.04,
  armLUpper:2.10, armLLower:-.22, handRotL:-.18,         // far arm flung up
  armRUpper:.70, armRLower:1.36, handRotR:.16,           // near arm reaching back/down toward home
  shoulderLiftL:.40, shoulderLiftR:.24,
  hipL:.62, kneeL:.86, hipR:-.30, kneeR:.30,             // legs kicking loose
  browUp:.66, browKnit:.46, eyeWide:.66, jaw:.44, frown:.40,
}, ["open_palm","offering"]);

// FRIGHTENED — cowering, shrinking small: shoulders hauled up around the ears,
// both hands snatched up near the face, body leaning back away from the looming
// captor, head tucked and eyes rolled up, the widest terror-face. A small
// frightened boy.
P("child_frightened", {
  spineLean:.16, headPitch:.10, headY:.08, rootScale:.94,
  armLUpper:-.56, armLLower:-1.78, handRotL:.10,         // hands snatched up near face
  armRUpper:.56, armRLower:1.78, handRotR:-.10,
  shoulderLiftL:.62, shoulderLiftR:.62,
  browUp:.86, browKnit:.50, eyeWide:.82, frown:.30, jaw:.18,
}, ["open_palm","open_palm"]);

// LED — pulled reluctantly along by the wrist: one arm stretched out and up in
// the captor's grip, dragging back on it, the other arm limp, body twisting to
// look back the way he came, a small refusing step. Led away into sale.
P("child_led", {
  bodyYaw:.28, headYaw:-.42, headRoll:-.10, spineLean:.06, weightShift:-.4, pelvisX:-.18,
  armRUpper:-2.30, armRLower:-.10, handRotR:.06,         // near arm stretched up, gripped/pulled
  armLUpper:.14, armLLower:-.30,                          // far arm hanging limp
  shoulderLiftR:.44, shoulderLiftL:.14,
  hipL:.26, kneeL:.24,                                    // heels-in reluctant step
  browUp:.62, browKnit:.44, eyeWide:.54, frown:.30, jaw:.16,
}, ["relaxed","open_palm"]);

// TIMID — the neutral baseline: a small royal child standing uncertain, arms
// drawn in close, shoulders a little up, brows raised in a wary, about-to-cry
// timidity, gaze up toward the grown-ups over him.
P("child_timid", {
  spineLean:.04, headPitch:.06, rootScale:.96,
  armLUpper:.10, armLLower:-.36, armRUpper:-.10, armRLower:.36,
  shoulderLiftL:.24, shoulderLiftR:.24,
  browUp:.44, browKnit:.24, eyeWide:.30, frown:.12,
}, ["relaxed","relaxed"]);

export const asset = {
  id:"character.child-eumaeus-memory-variant",
  type:"CHARACTER",
  name:"Child Eumaeus memory variant",
  statusWord:"STOLEN",
  scene:"OD-B15-S04",

  params,
  layers:["shadow","hair-back","legs","tunic","far-arm","neck","head","face","hair-front","near-arm"],
  // normalized 0..1 anchors for scene attachment / carry-grip / gaze
  anchors:{
    head:{x:.50,y:.30}, crown:{x:.50,y:.23}, eyes:{x:.50,y:.31},
    rightHand:{x:.62,y:.52}, leftHand:{x:.38,y:.44},
    carryGrip:{x:.50,y:.58}, wristGrip:{x:.64,y:.42},
    hip:{x:.50,y:.70}, feet:{x:.50,y:.90},
  },
  states:{
    initial:"reaching",
    nodes:{
      // SIGNATURE — REACHING away: both small arms flung out toward the home he
      // is being torn from, mouth open on a cry, eyes blown wide, fear brows.
      reaching:   { preview:{ pose:"child_reach_away", browUp:.82, browKnit:.48,
                              eyeWide:.86, jaw:.64, frown:.44, mouthAsym:.16,
                              gaze:{x:-.62,y:.04}, t:0.5 } },
      // OD-B15-S04 — CARRIED into abduction: hoisted and hauled off, tilted, legs
      // kicking, one arm thrown back toward home, a wail on the open mouth.
      carried:    { preview:{ pose:"child_carried", browUp:.66, browKnit:.46,
                              eyeWide:.66, jaw:.44, frown:.40,
                              gaze:{x:-.4,y:.10}, t:0.5 } },
      // FRIGHTENED — cowering small, hands up near the face, shrinking from the
      // looming captor, the widest terror-face. A small frightened boy.
      frightened: { preview:{ pose:"child_frightened", browUp:.86, browKnit:.50,
                              eyeWide:.82, frown:.30, jaw:.18,
                              gaze:{x:.14,y:-.30}, t:0.5 } },
      // LED — pulled reluctantly along by the wrist toward the sale, twisting
      // back to look the way he came, a small refusing step.
      led:        { preview:{ pose:"child_led", browUp:.62, browKnit:.44,
                              eyeWide:.54, frown:.30, jaw:.16,
                              gaze:{x:-.5,y:.04}, t:0.5 } },
      // TIMID baseline — a small royal child standing uncertain, arms drawn in,
      // wary raised brows, gaze up at the grown-ups over him.
      timid:      { preview:{ pose:"child_timid", browUp:.44, browKnit:.24,
                              eyeWide:.30, frown:.12, gaze:{x:.06,y:-.22}, t:0.5 } },
    },
    edges:[["timid","reaching"],["reaching","carried"],["carried","frightened"],
           ["frightened","led"],["led","reaching"],["timid","frightened"],
           ["reaching","timid"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band","mirror",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — STOLEN: the small royal child in his fine tunic, twisting
  // and flinging both arms out to reach back toward the home torn away from him,
  // mouth open on a cry, eyes blown wide, brows raised-and-knit in a child's
  // terror. The reaching-carried-away boy — a memory-toned young Eumaeus.
  preview:()=>({ pose:"child_reach_away",
                 browUp:.82, browKnit:.48, eyeWide:.86, jaw:.64, frown:.44, mouthAsym:.16,
                 gaze:{x:-.62,y:.04}, t:0.5, status:"STOLEN", progress:.18 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band; else fig.spec.band = "front";
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
