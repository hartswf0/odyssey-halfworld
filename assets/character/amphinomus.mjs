/* character.amphinomus — the decent suitor.
   CHARACTER asset. Son of Nisus of Dulichium, the one man in the hall whose
   talk pleases Penelope: he is the suitor who blocks the ambush of Telemachus
   by putting a condition on it — "not until we have asked the will of Zeus" —
   and the one Odysseus, in beggar's rags, warns to go home. He does not go.
   The bearing is a well-meaning man standing among predators: weight held
   back rather than thrown forward, an open palm instead of a jabbing finger,
   the eyes lifted to a sign the others never look for. Nothing about him
   commands; that is why he dies with the rest.

   Built entirely on the engine hero rig — the identity is in the spec and the
   pose channels, not in overpaint, so he stays in family with the other
   suitors (antinous, eurymachus) across every band and scene.
   Atlas: OD-B16-S05 — the cautious suitor placing a divine condition. */
import { makeFigure, HERO_POSES } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke poses, registered additively onto the shared rig table.
   Antinous jabs; Amphinomus hedges. Every one of these keeps the weight
   slightly back and the near arm open — deference made structural. */

/* THE SIGNATURE — the divine condition. Body angled a quarter away from the
   council, one palm turned up in offer rather than command, chin lifted and
   gaze raised past the room toward the omen he wants consulted first. */
HERO_POSES.divine_condition = {
  id:"divine_condition", label:"divine condition", group:"emotion",
  n:{ bodyYaw:.34, spineLean:.12, chestOpen:.30, rootScale:.99,
      armRUpper:-.92, armRLower:-.74, handRotR:.34, shoulderLiftR:.20,
      armLUpper:.30, armLLower:-.52, handRotL:-.14,
      headYaw:-.32, headPitch:-.22, headRoll:.10,
      gazeX:-.20, gazeY:-.55, browUp:.52, browKnit:.24, eyeWide:.14 },
  opt:{ hands:["relaxed","palm_up"] },
};

/* Misgiving — the omen has landed and he cannot name it. Arms drawn in,
   head lowered, one hand up near the chest; a man arguing with himself. */
HERO_POSES.uneasy_reserve = {
  id:"uneasy_reserve", label:"uneasy reserve", group:"emotion",
  n:{ bodyYaw:.20, spineLean:.14, rootScale:.97,
      armRUpper:.42, armRLower:1.32, handRotR:.30,
      armLUpper:-.62, armLLower:-1.10, handRotL:-.24,
      headPitch:.34, headYaw:-.16, gazeX:-.24, gazeY:.34,
      browUp:.44, browKnit:.46, eyeNarrow:.12, frown:.30 },
  opt:{ hands:["relaxed","relaxed"] },
};

/* Courtesy — the decency that marks him: leaning in to hand bread and wine
   to the beggar at his knee, both hands offered, weight forward but soft. */
HERO_POSES.courteous_offer = {
  id:"courteous_offer", label:"courteous offer", group:"hands",
  n:{ bodyYaw:-.28, spineLean:-.26, chestOpen:.22, rootScale:.99,
      armRUpper:-1.22, armRLower:.30, handRotR:.18,
      armLUpper:.52, armLLower:-.30, handRotL:-.14,
      headYaw:-.24, headPitch:.20, gazeX:-.30, gazeY:.32,
      browUp:.34, smile:.22 },
  opt:{ hands:["relaxed","offering"] },
};

const params = {
  skin:"#cfb999", hairColor:"#33261a",
  hair:"curly", beard:true, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:0.96,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.amphinomus",
  type:"CHARACTER",
  name:"Amphinomus",
  statusWord:"CAUTIOUS",
  scene:"OD-B16-S05",

  params,
  layers:["shadow","cloak","hair-back","legs","torso","far-arm","neck","head",
          "face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.70,y:.55}, leftHand:{x:.35,y:.63},
    openPalm:{x:.72,y:.52},   // the palm that carries the condition
    cupGrip:{x:.35,y:.62}, breadGrip:{x:.70,y:.58},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"cautious",
    nodes:{
      // baseline — seated-council civility: three-quarter, listening, no sneer
      neutral:   { preview:{ pose:"three_quarter_left", gaze:{x:-.14,y:.02},
                             browUp:.16, mouth:0, blink:0, t:0.5 } },
      // THE SIGNATURE — the condition on the conspiracy, gaze lifted to Zeus
      cautious:  { preview:{ pose:"divine_condition", browUp:.52, browKnit:.24,
                             eyeWide:.14, gaze:{x:-.20,y:-.55}, jaw:.18, t:0.5 } },
      // mid-sentence in the council: the same open hand, mouth working
      speaking:  { preview:{ pose:"divine_condition", jaw:.48, browUp:.40,
                             browKnit:.20, gaze:{x:-.16,y:-.36}, t:0.5 } },
      // hearing the beggar's warning: still, brows up, eyes wide, no answer
      warned:    { preview:{ pose:"lean_forward", browUp:.72, browKnit:.34,
                             eyeWide:.40, frown:.20, gaze:{x:-.30,y:.10},
                             mouth:-.2, t:0.5 } },
      // he walks back to his seat with a heavy heart — the doom already on him
      foreboding:{ preview:{ pose:"uneasy_reserve", browUp:.44, browKnit:.46,
                             frown:.30, gaze:{x:-.24,y:.34}, blink:.20, t:0.5 } },
      // his decency, made visible: bread and wine handed to the beggar
      courteous: { preview:{ pose:"courteous_offer", browUp:.34, smile:.22,
                             gaze:{x:-.30,y:.32}, t:0.5 } },
      // when the hall turns on him he is a suitor after all — but a slow one
      alarmed:   { preview:{ pose:"protective_block", browUp:.60, browKnit:.42,
                             eyeWide:.55, jaw:.42, gaze:{x:.30,y:-.08}, t:0.5 } },
    },
    edges:[
      ["neutral","cautious"],["cautious","speaking"],["speaking","neutral"],
      ["neutral","courteous"],["courteous","warned"],["warned","foreboding"],
      ["foreboding","neutral"],["foreboding","alarmed"],["cautious","warned"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — CAUTIOUS: the divine condition. Half-turned from the
  // conspiracy he will not quite refuse, one palm open and empty, brows raised,
  // eyes lifted to a sign none of the others intend to wait for.
  preview:()=>({ pose:"divine_condition",
                 browUp:.52, browKnit:.24, eyeWide:.14, jaw:.18,
                 gaze:{x:-.20,y:-.55}, t:0.5, status:"CAUTIOUS", progress:.30 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
