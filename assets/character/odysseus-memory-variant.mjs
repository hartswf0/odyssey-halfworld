/* character.odysseus-memory-variant — Odysseus as remembered war-commander.
   A memory-flashback variant of the crafty king: the SAME identity (weathered
   skin, dark curly hair, beard, tunic + cloak, bare sandalled legs) but carried
   younger and harder — an upright, decisive commander mid-battle, wheeling his
   ships back around to shore up Agamemnon's line. Where the base Odysseus is
   sly and persuasive, this variant is martial: set brow, level gaze, a
   commanding arm thrown out to reverse the fleet.
   Atlas: OD-B03-S03 — "wily commander reversing his ships to support Agamemnon". */
import { makeFigure } from "../../engine/halfworld-engine.mjs";

const params = {
  skin:"#cdb89a", hairColor:"#241d16",
  hair:"curly", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true,
  scale:1.05,                    // a touch taller / more upright than the king — youthful command
};

const fig = makeFigure(params);

export const asset = {
  id:"character.odysseus-memory-variant",
  type:"CHARACTER",
  name:"Odysseus memory variant",
  statusWord:"COMMANDING",
  scene:"OD-B03-S03",

  params,
  layers:["shadow","hair-back","legs","torso","cloak","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props (spear, tiller, hail)
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    rightHand:{x:.74,y:.50}, leftHand:{x:.32,y:.60},
    spearGrip:{x:.72,y:.48}, commandPoint:{x:.86,y:.44},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // upright commander at rest — three-quarter stance, level gaze, jaw set,
      // the faint knit of a man already reading the battle line.
      neutral:   { preview:{ pose:"three_quarter_right", gaze:{x:.2,y:0},
                             browKnit:.18, eyeNarrow:.14, t:0.5 } },
      // THE SIGNATURE — reversing the ships: decisive arm flung out to point the
      // fleet about, body turning into the command, hard brow, eyes tracking the
      // gesture, mouth open on the shouted order.
      commanding:{ preview:{ pose:"pointing_arm", mirror:true,
                             browKnit:.55, eyeNarrow:.3, jaw:.34, frown:.16,
                             gaze:{x:.55,y:-.04}, t:0.45 } },
      // rallying the crews — one arm thrown up, shout on an open vowel, brows up,
      // eyes wide, the surge of turning a whole line back toward Agamemnon.
      rallying:  { preview:{ pose:"one_arm_raised", jaw:.5, browUp:.4,
                             browKnit:.2, eyeWide:.3, gaze:{x:.12,y:-.14}, t:0.5 } },
      // resolute — squared confrontation, fist and jaw set, the wily mind gone
      // hard and martial as he commits to the reversal.
      resolute:  { preview:{ pose:"confrontation", browKnit:.7, eyeNarrow:.36,
                             frown:.4, gaze:{x:.0,y:0}, t:0.5 } },
      // striding the deck — walk cycle, jaw set, a determined knit.
      striding:  { preview:{ pose:"walk_neutral", browKnit:.22, eyeNarrow:.12,
                             gaze:{x:.1,y:0}, t:0.35 } },
    },
    edges:[["neutral","commanding"],["commanding","neutral"],
           ["neutral","rallying"],["rallying","commanding"],
           ["neutral","resolute"],["neutral","striding"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band","mirror",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — COMMANDING: the reversal itself. Body wheeling, a decisive
  // arm flung out to bring the ships about, hard-knit brow, narrowed tracking
  // eyes, jaw open on the shouted order. This is Odysseus as martial commander,
  // not the persuasive king.
  preview:()=>({ pose:"pointing_arm", mirror:true,
                 browKnit:.55, eyeNarrow:.3, jaw:.34, frown:.16,
                 gaze:{x:.55,y:-.04}, t:0.45, status:"COMMANDING", progress:.24 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
