/* character.eidothea — the sea-goddess helper, daughter of Proteus.
   CHARACTER asset. A graceful woman in a flowing sea-toned robe, long hair,
   who takes pity on Menelaos and teaches him the ambush of her father — how
   to seize the shifting Old Man of the Sea, and how to bear the reek of the
   seal-skins she tucks the men under (ambrosia under the nose).
   Atlas: OD-B04-S05 — instructs the ambush and neutralizes the seals' stench. */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* A bespoke signature pose: she TEACHES — one arm extended low, palm turned
   to lay out the plan (offering the seal-skins / drawing the trap in the air),
   torso half-open toward her pupil, gaze steady and level. Distinct from the
   sharp "pointing_arm" jab: this is instruction, calm and deliberate. */
HERO_POSES.instructing = {
  id:"instructing", label:"instructing", group:"emotion",
  n:{ bodyYaw:-.34, headYaw:-.20, spineLean:-.06, chestOpen:.35,
      armRUpper:-1.18, armRLower:.30, handRotR:.12,
      armLUpper:.30, armLLower:-.28, gazeX:-.14 },
  opt:{ hands:["relaxed","offering"] },
};

const params = {
  skin:"#dcd6c8", hairColor:"#2b2620",
  hair:"short", beard:false, glasses:false,
  garment:"dress", cloak:true, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.eidothea",
  type:"CHARACTER",
  name:"Eidothea",
  statusWord:"KNOWING",
  scene:"OD-B04-S05",

  params,
  layers:["shadow","hair-back","legs","robe","far-arm","neck","head","face","hair-front","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.30,y:.62}, leftHand:{x:.66,y:.60},
    sealskin:{x:.28,y:.60}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // calm baseline — she rises from the swell, three-quarter, a knowing
      // half-smile and level, unhurried gaze
      neutral:    { preview:{ pose:"three_quarter_left", gaze:{x:-.12,y:.02},
                              smile:.16, browUp:.08, eyeNarrow:.1, t:0.5 } },
      // THE signature: teaching the ambush — arm laid out to draw the plan,
      // knowing face, brow lifted a touch, mouth just parted on the counsel
      instructing:{ preview:{ pose:"instructing", smile:.14, browUp:.22,
                              eyeNarrow:.16, jaw:.14, mouthAsym:.28,
                              gaze:{x:-.16,y:.0}, t:0.45 } },
      // speaking the counsel — torso open, jaw dropped on a word, brows up
      speaking:   { preview:{ pose:"torso_open", jaw:.5, smile:.22, browUp:.3,
                              eyeWide:.12, gaze:{x:.04,y:-.02}, t:0.5 } },
      // pity — a soft frown, brows knit-and-lift, head inclined toward the
      // wearied king before she gives her help
      pitying:    { preview:{ pose:"lean_forward", frown:.28, browUp:.36,
                              browKnit:.28, eyeNarrow:.14, gaze:{x:-.06,y:.16},
                              t:0.5 } },
      // shielding — the ambrosia under the nose against the seals' reek: a
      // raised, protective offering hand, calm assurance
      shielding:  { preview:{ pose:"one_arm_raised", smile:.1, browUp:.18,
                              eyeNarrow:.2, gaze:{x:.08,y:-.06}, t:0.5 } },
    },
    edges:[["neutral","instructing"],["instructing","speaking"],
           ["speaking","instructing"],["neutral","pitying"],
           ["pitying","instructing"],["instructing","shielding"],
           ["shielding","neutral"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — KNOWING: she teaches the ambush. One arm laid open to
  // draw the plan in the air, a knowing half-smile with a slight skew, one
  // lifted brow and calm narrowed eyes, gaze level on her pupil, mouth just
  // parted on the counsel.
  preview:()=>({ pose:"instructing",
                 smile:.14, browUp:.22, eyeNarrow:.16, jaw:.14, mouthAsym:.28,
                 gaze:{x:-.16,y:.0}, t:0.45, status:"KNOWING", progress:.22 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
