/* character.elpenor — the youngest crewman, hapless and half-drunk.
   CHARACTER asset. On Circe's island he sleeps off the wine on the roof,
   is startled awake by the crew's clamour, missteps, and falls to his death —
   then lingers as a wispy shade Odysseus meets first among the dead.
   Built on the engine hero rig. Youthful silhouette: slight build, short
   stature, beardless, tousled hair, a plain sailor's tunic, bare legs.
   Registers a few bespoke off-balance / drift poses onto the shared table.
   Atlas: OD-B10-S08 (sleep -> startled rise -> misstep -> fall -> ghost). */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* ---- bespoke poses for the tumble sequence (additive; shared table) ----
   Each is {id,label,group,n,opt}; composeStatic reads n + opt.action/hands. */
HERO_POSES.elpenor_drowse = { id:"elpenor_drowse", label:"drowsy slump", group:"elpenor",
  n:{ spineLean:.30, headPitch:.52, headRoll:.30, neckPitch:.24, neckRoll:.18,
      weightShift:.34, pelvisX:.14, shoulderTilt:.12,
      armLUpper:.16, armLLower:-.20, armRUpper:-.10, armRLower:.28,
      hipL:.16, kneeL:.10, hipR:-.06, kneeR:.05 }, opt:{} };

HERO_POSES.elpenor_startle = { id:"elpenor_startle", label:"startled rise", group:"elpenor",
  n:{ spineLean:-.26, headPitch:-.16, chestOpen:.5,
      shoulderLiftL:.66, shoulderLiftR:.66,
      armLUpper:.82, armLLower:-1.05, armRUpper:-.82, armRLower:1.05,
      hipL:-.10, kneeL:.30, hipR:.10, kneeR:.24, rootScale:1.02 },
  opt:{ hands:["open_palm","open_palm"] } };

HERO_POSES.elpenor_misstep = { id:"elpenor_misstep", label:"misstep", group:"elpenor",
  n:{ spineLean:-.20, pelvisRot:.16, pelvisX:.24, weightShift:.7, headRoll:-.24, headYaw:.2,
      armLUpper:1.55, armLLower:-.30, armRUpper:-.55, armRLower:1.15, handRotL:-.3,
      hipL:-.55, kneeL:.9, ankleL:-.2, hipR:.42, kneeR:.14, rootScale:1.0 },
  opt:{ hands:["open_palm","relaxed"] } };

HERO_POSES.elpenor_fall = { id:"elpenor_fall", label:"tumbling fall", group:"elpenor",
  n:{ spineLean:.58, headPitch:.34, headRoll:.34, pelvisRot:-.12, weightShift:-.4,
      armLUpper:2.35, armLLower:-.35, armRUpper:-2.15, armRLower:.4,
      shoulderLiftL:.7, shoulderLiftR:.7,
      hipL:-.62, kneeL:.55, ankleL:.2, hipR:.5, kneeR:.4, rootScale:1.02 },
  opt:{ hands:["open_palm","open_palm"] } };

HERO_POSES.elpenor_shade = { id:"elpenor_shade", label:"wispy shade", group:"elpenor",
  n:{ spineLean:.06, headPitch:.16, headRoll:.1, rootY:-.10, rootScale:.98,
      armLUpper:.42, armLLower:-.5, armRUpper:-.42, armRLower:.5,
      hipL:.05, kneeL:.06, hipR:-.05, kneeR:.06 }, opt:{} };

const params = {
  skin:"#dcc7a4", hairColor:"#4a3a24",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:0.86,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.elpenor",
  type:"CHARACTER",
  name:"Elpenor",
  statusWord:"HAPLESS",
  scene:"OD-B10-S08",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head","face","hair-front","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.22}, crown:{x:.50,y:.14}, eyes:{x:.50,y:.23},
    rightHand:{x:.68,y:.60}, leftHand:{x:.32,y:.60},
    wineGrip:{x:.66,y:.58}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"drowsy",
    nodes:{
      // OD-B10-S08 beat map. Each node sets its OWN face channels so it never
      // inherits the signature dazed look; brows/jaw ride on the emotion pose.
      // wine-heavy sleep on the roof — head lolls, heavy lids, lopsided mouth
      drowsy:   { preview:{ pose:"elpenor_drowse", gaze:{x:-.1,y:.5}, blink:.82,
                            eyeNarrow:.5, browUp:.12, mouthAsym:.5, smile:.14, t:0.5 } },
      // jolted awake by the clamour — brows fly up, eyes snap wide, mouth opens
      startled: { preview:{ pose:"elpenor_startle", gaze:{x:.2,y:-.2}, eyeWide:.85,
                            browUp:.95, jaw:.5, blink:0, t:0.5 } },
      // the drunken misstep — off balance, one arm grabbing at nothing
      misstep:  { preview:{ pose:"elpenor_misstep", gaze:{x:.3,y:.18}, eyeWide:.6,
                            browUp:.7, browKnit:.2, jaw:.32, mouthAsym:.3, t:0.5 } },
      // the fall — pitched backward off the roof, arms flung up, a last cry
      falling:  { preview:{ pose:"elpenor_fall", gaze:{x:.05,y:-.35}, eyeWide:.95,
                            browUp:1, jaw:.7, blink:0, t:0.5 } },
      // death — the slack, dazed stare, lids sinking, mouth fallen open
      dazed:    { preview:{ pose:"elpenor_drowse", gaze:{x:.04,y:.32}, blink:.55,
                            eyeNarrow:.35, browUp:.28, jaw:.22, frown:.2, t:0.5 } },
      // ghost continuity — a wispy shade, hollow-eyed, arms drifting (see draw)
      ghost:    { preview:{ pose:"elpenor_shade", ghost:true, gaze:{x:-.06,y:.14},
                            eyeNarrow:.2, browUp:.4, jaw:.16, mouthAsym:.16, t:0.5 } },
      neutral:  { preview:{ pose:"neutral", gaze:{x:0,y:0}, blink:0, t:0.5 } },
    },
    edges:[
      ["drowsy","startled"],["startled","misstep"],["misstep","falling"],
      ["falling","dazed"],["dazed","ghost"],["ghost","neutral"],["neutral","drowsy"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","ghost",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","blink"],

  // CARD SIGNATURE — HAPLESS: caught mid-fall off the roof. Arms flung up,
  // shoulders hunched, body pitched backward; eyes snapped wide, brows shot up,
  // mouth open on a last startled cry. The tipsy sailor's whole undoing in one
  // frame — unmistakably NOT a calm arms-hanging stance.
  preview:()=>({ pose:"elpenor_fall", gaze:{x:.05,y:-.32}, eyeWide:.95, browUp:1,
                 jaw:.66, blink:0, t:0.5, status:"HAPLESS", progress:.16 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    // ghost continuity: draw the figure faint so the dotify pass yields a
    // wispy, half-there shade (white paper bleeds through the thinned ink).
    const ghost = state && (state.ghost || state.pose === "elpenor_shade" || state.pose === "ghost");
    if (ghost){
      ctx.save();
      ctx.globalAlpha = 0.42;
      const r = fig.draw(ctx, W, H, state);
      ctx.restore();
      return r;
    }
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
