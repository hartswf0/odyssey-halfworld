/* character.leocritus — a brash young suitor who dismisses civic authority
   and boasts of the suitors' numbers.
   CHARACTER asset built on the engine hero rig. Silhouette: young, cocky,
   athletic, clean-shaven with short tousled hair, a plain belted TUNIC over
   bare sandalled legs — deliberately NOT the fine noble robe+cloak of
   Eurymachus nor the bearded curls of Odysseus. He reads YOUNG and loud: a
   swaggering arms-open stance and a wide boastful grin. Expression is the
   point — the open contemptuous shrug/wave and the numbers-are-on-our-side
   grin.
   Atlas Book 2: OD-B02-S04. */
import { makeFigure } from "/engine/halfworld-engine.mjs";

const params = {
  skin:"#e0c8a6", hairColor:"#2a2016",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:0.98,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.leocritus",
  type:"CHARACTER",
  name:"Leocritus",
  statusWord:"BRASH",
  scene:"OD-B02-S04",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face","hair-front","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.72,y:.52}, leftHand:{x:.28,y:.52},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"brash",
    nodes:{
      // Baseline: a cocky, chin-up ease — weight cocked to one hip, a smug
      // half-smile already tugging one corner, brows up, gaze slid over you.
      neutral:    { preview:{ pose:"weight_shift", gaze:{x:.2,y:-.08},
                              smile:.2, mouthAsym:.34, browUp:.24, eyeNarrow:.12, t:0.5 } },
      // THE SIGNATURE — BRASH swagger: arms flung wide open, a wide boastful
      // grin with jaw parted on a shout, brows flung up, chin lifted. The
      // arms-open dismissive display of a young man sure of his numbers.
      brash:      { preview:{ pose:"arms_open", smile:.72, jaw:.32,
                              browUp:.58, eyeWide:.22, mouthAsym:.18,
                              gaze:{x:.08,y:-.12}, t:0.45 } },
      // OD-B02-S04 core, beat 1 — DISMISSING civic authority: an open
      // contemptuous shrug/wave, palms turned up, one corner curled in scorn,
      // brows up ("what's your assembly to us?"). A careless brush-off.
      dismissing: { preview:{ pose:"shrug", smile:.4, mouthAsym:.66,
                              browUp:.6, eyeNarrow:.26, jaw:.14,
                              gaze:{x:-.24,y:.02}, t:0.4 } },
      // OD-B02-S04 core, beat 2 — imagining NUMERICAL DOMINANCE: arm thrown
      // out counting the ranks behind him, wide derisive grin, jaw dropped on
      // a jeer, gaze sweeping the imagined crowd. Boasting of the numbers.
      boasting:   { preview:{ pose:"pointing_arm", smile:.6, jaw:.5,
                              browUp:.42, eyeWide:.16, mouthAsym:.3,
                              gaze:{x:-.42,y:-.02}, t:0.5 } },
      // Loud open laughter — head back, mouth wide, shoulders up, the mocking
      // guffaw of a suitor who thinks the whole assembly is a joke.
      laughing:   { preview:{ pose:"laughter", smile:1, jaw:.72,
                              eyeNarrow:.6, browUp:.2,
                              gaze:{x:.06,y:-.06}, t:0.45 } },
      // Cocky at rest — arms crossed, chin high, contempt banked behind a
      // narrow-eyed appraisal.
      appraising: { preview:{ pose:"arms_crossed", smile:.14, mouthAsym:.4,
                              browUp:.3, eyeNarrow:.36, gaze:{x:-.18,y:.04}, t:0.5 } },
    },
    edges:[
      ["neutral","brash"],["brash","dismissing"],["dismissing","boasting"],
      ["boasting","laughing"],["laughing","neutral"],
      ["neutral","appraising"],["appraising","brash"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — BRASH: the young suitor's cocky swagger in one frame.
  // Arms flung wide open, a wide boastful grin with the jaw parted on a
  // shout, brows flung up, chin high, gaze sliding out over the hall as if
  // daring anyone to count the odds against him.
  preview:()=>({ pose:"arms_open",
                 smile:.72, jaw:.32, browUp:.58, eyeWide:.22, mouthAsym:.18,
                 gaze:{x:.08,y:-.12}, t:0.45, status:"BRASH", progress:.2 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
