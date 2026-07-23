/* character.halitherses — the old seer of Ithaca, reader of birds.
   CHARACTER asset. Scene function (OD-B02-S03): an aged prophet follows a
   pair of eagles across the sky with precise, focused attention BEFORE he
   speaks out against the reckless suitors and the crowd. Built on the
   HALFTRACK hero rig — a stooped, white-bearded elder in a long robe and
   cloak, one hand lifted to read the omen, chin up, eyes cast to the birds.
   Stable identity across front/three-quarter/profile/back; face, gaze,
   mouth, hands and every joint stay exposed so scenes can drive him.

   EXPRESSIVENESS: the hero rig reads facial channels (browUp, browKnit,
   eyeWide, eyeNarrow, frown, jaw, mouthAsym) ONLY from the composed POSE,
   and the scene-state mouth overlay can only smile or draw a frown-line —
   never the INTENT-focused upward stare of augury or an open prophesying
   mouth. So Halitherses ships bespoke poses into the shared POSE registry,
   each one fusing a raised/knit brow + an upward or leveled gaze + a
   reading/pointing arm. That is what lets the card actually EMOTE. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Halitherses poses: brow + gaze + arm authored together ----
   Registered into the shared rig registry (same module instance the hero
   figure reads), so preview()/states can name them like any built-in pose.
   Convention reminders: negative headPitch + negative gazeY = eyes cast UP;
   armRUpper near -2.4 raises the RIGHT arm skyward; point hand = one finger. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "halitherses", n, opt }; };

// THE CARD — following the birds: right arm lifted to read the sky, index
// finger tracing the flight, chin lifted, brows RAISED high in concentration,
// eyes WIDE and cast up-and-outward after the eagles, mouth closed and still
// (he watches BEFORE he speaks). A quiet, precise, upward-straining attention.
P("hal_reading", {
  browUp:.62, browKnit:.10, eyeWide:.42, eyeNarrow:0, frown:0, jaw:0,
  headPitch:-.34, neckPitch:-.20, headRoll:.06,
  gazeX:.26, gazeY:-.72,                       // eyes fixed UP on the wheeling birds
  spineLean:-.06, bodyYaw:-.08, headYaw:.14,   // near-frontal, turned toward his hand
  armRUpper:-2.42, armRLower:.24, shoulderLiftR:.56,   // right arm raised, reading
  armLUpper:.22, armLLower:-.30,               // left arm quiet at his side
}, { hands:["relaxed","point"] });

// calm watching — the still counterpoint: hands lowered, head tilted up,
// brows lifted in soft attention, eyes up but relaxed. Patient augury.
P("hal_watching", {
  browUp:.36, browKnit:.04, eyeWide:.24, jaw:0,
  headPitch:-.22, headRoll:.03, gazeX:.10, gazeY:-.56,
  spineLean:.04,
  armLUpper:.20, armLLower:-.16, armRUpper:-.22, armRLower:.14,
}, { hands:["relaxed","relaxed"] });

// prophesying against the crowd — now leveled at the suitors: jaw OPEN
// mid-warning, brows lifted AND knit in grave argument, eyes narrowed and
// stern, chest thrown open, right arm thrust forward with a pointing hand.
P("hal_prophesy", {
  browUp:.30, browKnit:.50, eyeNarrow:.26, frown:.14, mouthAsym:.12,
  jaw:.58,                                     // OPEN — speaking the prophecy aloud
  spineLean:-.22, headPitch:-.02, chestOpen:.42,
  bodyYaw:-.10, headYaw:-.12, gazeX:-.32, gazeY:.04,   // leveled at the crowd now
  armRUpper:-1.48, armRLower:.14, shoulderLiftR:.22,   // arm thrust forward, warning
  armLUpper:.28, armLLower:-.22, rootScale:1.03,
}, { hands:["relaxed","point"] });

// admonishing — a raised warning finger, brow knit hard, mouth half-open,
// the peak of "you will regret this." Stern old-man authority.
P("hal_warn", {
  browKnit:.64, browUp:.22, eyeNarrow:.32, frown:.22, jaw:.30,
  spineLean:-.10, headYaw:.08, gazeX:.16, gazeY:-.08,
  armRUpper:-2.18, armRLower:.52, shoulderLiftR:.50,   // raised admonishing finger
  armLUpper:.24, armLLower:-.18, rootScale:1.02,
}, { hands:["relaxed","point"] });

const params = {
  skin:"#d2bfa2", hairColor:"#787469",   // weathered skin, iron-grey mane + full seer's beard (dark enough to read the beard mass)
  hair:"curly", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.halitherses",
  type:"CHARACTER",
  name:"Halitherses",
  statusWord:"AUGURING",
  scene:"OD-B02-S03",

  params,
  layers:["shadow","hair-back","legs","torso","robe","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props / staff
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.70,y:.28}, leftHand:{x:.34,y:.62},   // right hand lifted high by default
    staffGrip:{x:.34,y:.58}, hip:{x:.50,y:.66},
    skyRead:{x:.78,y:.10}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"reading",
    nodes:{
      // THE beat — following the eagles with a raised reading hand, chin up
      reading:   { preview:{ pose:"hal_reading", gaze:{x:.26,y:-.72}, status:"AUGURING" } },
      // quiet patient watching, hands lowered
      watching:  { preview:{ pose:"hal_watching", gaze:{x:.10,y:-.56} } },
      // turning to speak the prophecy against the crowd — jaw open, arm forward
      prophesy:  { preview:{ pose:"hal_prophesy", gaze:{x:-.32,y:.04}, status:"PROPHESYING" } },
      // raised warning finger — the admonition
      warning:   { preview:{ pose:"hal_warn", gaze:{x:.16,y:-.08} } },
      // stable identity turns
      profile:   { preview:{ pose:"profile_left" } },
      back:      { preview:{ pose:"back_view" } },
    },
    edges:[
      ["reading","watching"],["watching","reading"],["reading","prophesy"],
      ["prophesy","warning"],["warning","prophesy"],["prophesy","reading"],
      ["reading","profile"],["reading","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym"],

  // EXPRESSIVE signature — AUGURING: chin lifted, brows raised in fierce
  // concentration, eyes wide and cast UP after the birds, one arm lifted with
  // a reading/pointing finger. No `mouth` field — the still closed mouth and
  // the upward stare live in the pose so the overlay can't flatten them.
  preview:()=>({ pose:"hal_reading", gaze:{x:.26,y:-.72}, t:0.4,
                 status:"AUGURING", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, t all reach the rig
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
