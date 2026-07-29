/* character.irus — the town beggar of Ithaca. CHARACTER asset.
   Arnaeus, whom everyone calls Irus because he runs errands for whoever
   feeds him. He is the biggest body in the doorway and the weakest man in
   it: bulk without training, a belly carried like a title, a voice that
   does all the fighting. He owns the palace threshold the way a dog owns a
   step, and when a second beggar sits on it he swells, jabs, and shouts the
   boundary. Then Athena lifts the stranger's rags, Irus reads the thighs,
   and every one of his loud parts goes out at once.

   The whole performance is therefore a SUBTRACTION: he begins with the
   shoulders up, the chest thrown, the chin lifted and the elbows wide, and
   across two scenes each of those channels drains — shoulders down, chest
   in, chin tucked, elbows folded — until he is a kneeling heap being towed
   out by the foot. Nothing is added to make him afraid; the bluster is
   simply removed.

   Built entirely on the engine hero rig. The identity lives in the spec and
   in the registered poses — there is no hand overpaint at all — so he stays
   in family with the other Book XVIII bodies at every band and scale.
   Atlas: OD-B18-S01 (territorial bluster), OD-B18-S02 (collapse, blow, drag). */
import { makeFigure, HERO_POSES } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke poses, registered additively onto the shared rig table.
   Every pose here is a point on one axis: how much air is still in him. */

/* THE SIGNATURE — territorial bluster. Chest thrown, chin up, shoulders
   hiked, one fist parked on the hip and the other hand jabbing the finger
   at the stranger on HIS step. The sneer is asymmetric: half of him is
   already unsure, and it shows on the mouth before it shows anywhere else. */
HERO_POSES.irus_bluster = {
  id:"irus_bluster", label:"territorial bluster", group:"emotion",
  n:{ bodyYaw:.26, spineLean:-.13, chestOpen:.52, chestLift:.48, rootScale:1.02,
      shoulderLiftL:.40, shoulderLiftR:.24,
      armRUpper:-1.02, armRLower:.44, handRotR:.26,
      armLUpper:.80, armLLower:-1.50, handRotL:-.38,
      headYaw:.20, headPitch:-.24, headRoll:-.08,
      gazeX:.42, gazeY:-.06,
      browKnit:.78, browUp:.14, eyeNarrow:.34, frown:.42, mouthAsym:.30, jaw:.74,
      weightShift:.34, pelvisX:.20, hipL:.16, hipR:-.10 },
  opt:{ hands:["fist","point"] },
};

/* The boundary claim — both fists on the hips, elbows out to make himself
   wide, feet planted square. This is the pose he holds in the doorway all
   day and the reason nobody else begs at this palace. */
HERO_POSES.irus_boundary = {
  id:"irus_boundary", label:"boundary claim", group:"torso",
  n:{ bodyYaw:.06, chestOpen:.72, chestLift:.55, rootScale:1.03,
      shoulderLiftL:.58, shoulderLiftR:.46,
      armLUpper:.80, armLLower:-1.56, handRotL:-.44,
      armRUpper:-.80, armRLower:1.56, handRotR:.44,
      headPitch:-.20, headYaw:.10, gazeX:.14, gazeY:-.08,
      browKnit:.50, eyeNarrow:.32, frown:.36, jaw:.28,
      hipL:.11, hipR:-.11 },
  opt:{ hands:["fist","fist"] },
};

/* The reading — Athena lifts the stranger's rags and Irus, who has spent a
   life sizing up other men's arms, sizes up these. Weight goes back, the
   knees soften, the hiked shoulders drop, the jaw slackens. He is still
   standing, and he already knows. */
HERO_POSES.irus_collapse = {
  id:"irus_collapse", label:"confidence collapsing", group:"emotion",
  n:{ bodyYaw:.28, spineLean:.32, rootScale:1.01,
      kneeL:.32, kneeR:.26, hipL:.08, hipR:-.16,
      shoulderLiftL:.06, shoulderLiftR:.10,
      armLUpper:-.28, armLLower:-.66, handRotL:-.18,
      armRUpper:.36, armRLower:.98, handRotR:.24,
      headPitch:.16, headYaw:-.36, headRoll:.12, headX:-.18,
      gazeX:-.58, gazeY:.30,
      browUp:.86, browKnit:.40, eyeWide:.62, frown:.44, jaw:.34, mouthAsym:.20,
      weightShift:-.40 },
  opt:{ hands:["relaxed","relaxed"] },
};

/* Involuntary combat — the ring will not let him leave, so he throws up the
   guard of a man who has never been taught one: elbow across the face,
   chin buried, other fist low and useless, body turned away from the punch
   he is about to receive. */
HERO_POSES.irus_amateur_guard = {
  id:"irus_amateur_guard", label:"amateur guard", group:"arms",
  n:{ bodyYaw:.44, spineLean:.24, rootScale:1.03,
      kneeL:.56, kneeR:.42, hipL:-.24, hipR:.16,
      armRUpper:-.62, armRLower:1.74, handRotR:.52,
      armLUpper:-.52, armLLower:-1.12, handRotL:-.30,
      shoulderLiftL:.78, shoulderLiftR:.88,
      headPitch:.30, headYaw:.26, headRoll:.16,
      gazeX:.44, gazeY:.28,
      browUp:.74, browKnit:.56, eyeWide:.55, frown:.50, jaw:.46 },
  opt:{ hands:["fist","stop"] },
};

/* The blow — one punch under the ear. Spine whips back, head snaps aside
   and up, both arms fly open, the near knee folds. Held for a single frame
   in the scene clock; the body has not started falling yet. */
HERO_POSES.irus_struck = {
  id:"irus_struck", label:"impact", group:"emotion",
  n:{ bodyYaw:-.24, spineLean:.54, pelvisRot:-.12, rootScale:1.04,
      headPitch:-.44, headYaw:.32, headRoll:-.32, headX:.42, headY:-.10,
      armLUpper:1.14, armLLower:-.82, handRotL:-.30,
      armRUpper:-1.24, armRLower:-.58, handRotR:.34,
      shoulderLiftL:.62, shoulderLiftR:.34,
      kneeL:.88, kneeR:.28, hipL:-.32, hipR:.20, weightShift:-.55,
      gazeX:.24, gazeY:-.52,
      browUp:.95, browKnit:.14, eyeWide:.88, jaw:.86, frown:.30 },
  opt:{ hands:["open_palm","open_palm"] },
};

/* Removal — set down in the gateway where the stranger propped him, knees
   under him, head hung, hands open and empty on the ground. The staff of
   his own kingdom is put in his fist as a joke. He is not dead; he is
   finished, which in this hall is a different and lesser thing. */
HERO_POSES.irus_removed = {
  id:"irus_removed", label:"set down at the gate", group:"torso",
  /* one knee folded under, the other shin planted — the rig grounds on the
     lower of the two ankles, so ONE leg has to stay long or the whole body
     floats off the floor. */
  n:{ crouch:1, rootY:.14, rootScale:.98, bodyYaw:.42,
      kneeL:1.66, hipL:-.88, kneeR:.62, hipR:.30,
      spineLean:.26, pelvisRot:.06,
      armLUpper:.26, armLLower:-.18, handRotL:-.10,
      armRUpper:-.34, armRLower:.44, handRotR:.14,
      shoulderLiftL:0, shoulderLiftR:0,
      headPitch:.44, headYaw:-.22, headRoll:.14, headY:.10,
      gazeY:.55, blinkL:.78, blinkR:.78,
      browUp:.34, frown:.48, jaw:.18 },
  opt:{ hands:["relaxed","relaxed"] },
};

/* Appetite — the reason he is in the doorway. Both hands out for the goat
   sausages before anyone has said he may have them. Loose, greedy, cheerful:
   the only unmixed emotion he owns. */
HERO_POSES.irus_appetite = {
  id:"irus_appetite", label:"appetite", group:"hands",
  n:{ bodyYaw:-.18, spineLean:-.28, chestOpen:.34, rootScale:1.05,
      armRUpper:-.96, armRLower:.62, handRotR:.20,
      armLUpper:-.86, armLLower:-.56, handRotL:-.22,
      shoulderLiftL:.30, shoulderLiftR:.22,
      headYaw:-.16, headPitch:-.10, gazeX:-.26, gazeY:-.16,
      smile:.68, cheek:.5, eyeNarrow:.30, browUp:.30, jaw:.30 },
  opt:{ hands:["offering","offering"] },
};

/* ---- the body ----
   Weathered, sun-cooked skin kept LIGHT so the halftone reads him as mass
   rather than shadow; unwashed hair and beard in a dusty mid-grey, never
   black, so the head is a textured lump and not a blot. He wears a worn
   TUNIC, not rags — he is the palace's own beggar, fed at this door daily,
   and the pale garment is the visual argument he keeps making: he is better
   dressed than the stranger and therefore, he assumes, the better man. Bare
   shins and sandals under it. The frame is filled head to heel: within the
   card that IS his size, and in a scene the placement scale carries the
   rest. */
const params = {
  skin:"#d8cfbe", hairColor:"#5f574e",
  hair:"short", beard:true, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:0.96,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.irus",
  type:"CHARACTER",
  name:"Irus",
  statusWord:"BLUSTER",
  scene:"OD-B18-S01",

  params,
  layers:["shadow","hair-back","legs","torso","far-arm","neck","head",
          "face","hair-front","beard","near-arm"],

  /* normalized 0..1 anchors for scene attachment, contact and props */
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    jawContact:{x:.55,y:.24},          // where the one punch lands, under the ear
    rightHand:{x:.71,y:.56}, leftHand:{x:.30,y:.60},
    jabPoint:{x:.76,y:.52},            // the finger at the end of the bluster
    fistGrip:{x:.30,y:.62},            // hip fist / staff grip when he is propped
    foodGrip:{x:.68,y:.58},            // goat sausages, offered or seized
    belly:{x:.50,y:.56}, hip:{x:.50,y:.65},
    dragAnkle:{x:.44,y:.93},           // the foot he is towed out by
    feet:{x:.50,y:.94},
  },

  states:{
    initial:"territorial",
    nodes:{
      /* baseline identity — the doorway loafer, three-quarter, taking stock */
      neutral:     { preview:{ pose:"three_quarter_left", gaze:{x:-.16,y:.06},
                               browKnit:.16, eyeNarrow:.14, mouth:0, t:0.5 } },
      /* THE SIGNATURE — OD-B18-S01, the boundary shouted at a fellow beggar */
      territorial: { preview:{ pose:"irus_bluster", browKnit:.78, browUp:.14,
                               eyeNarrow:.34, frown:.42, mouthAsym:.30, jaw:.74,
                               gaze:{x:.42,y:-.06}, t:0.5 } },
      /* the same body wide in the door, both fists on the hips, nobody passing */
      claiming:    { preview:{ pose:"irus_boundary", browKnit:.50, eyeNarrow:.32,
                               frown:.36, gaze:{x:.14,y:-.08}, t:0.5 } },
      /* mid-insult: the mouth is doing all of the work */
      shouting:    { preview:{ pose:"irus_bluster", jaw:.92, browKnit:.84,
                               eyeNarrow:.22, frown:.50, mouthAsym:.38,
                               gaze:{x:.46,y:-.14}, t:0.4 } },
      /* the prize named — sausages on the fire, and he forgets to be angry */
      greedy:      { preview:{ pose:"irus_appetite", smile:.68, cheek:.5,
                               eyeNarrow:.30, browUp:.30,
                               gaze:{x:-.26,y:-.16}, t:0.5 } },
      /* OD-B18-S02 — the rags come up and he reads the stranger's thighs */
      doubting:    { preview:{ pose:"irus_collapse", browUp:.86, browKnit:.40,
                               eyeWide:.62, frown:.44, jaw:.34,
                               gaze:{x:-.58,y:.30}, t:0.5 } },
      /* the ring will not open; fear with nowhere to put itself */
      cornered:    { preview:{ pose:"guarded_withdrawal", browUp:.80, browKnit:.52,
                               eyeWide:.58, frown:.50, jaw:.30, blink:.14,
                               gaze:{x:.52,y:.18}, t:0.5 } },
      /* involuntary combat — a guard nobody taught him */
      guarding:    { preview:{ pose:"irus_amateur_guard", browUp:.74, browKnit:.56,
                               eyeWide:.55, frown:.50, jaw:.46,
                               gaze:{x:.44,y:.28}, t:0.5 } },
      /* the blow, one frame */
      struck:      { preview:{ pose:"irus_struck", browUp:.95, eyeWide:.88, jaw:.86,
                               frown:.30, gaze:{x:.24,y:-.52}, t:0.5 } },
      /* set down in the gateway, propped, finished */
      removed:     { preview:{ pose:"irus_removed", browUp:.34, frown:.48,
                               jaw:.20, blink:.82, gaze:{x:0,y:.60}, t:0.5 } },
    },
    edges:[
      ["neutral","territorial"],["territorial","shouting"],["shouting","claiming"],
      ["claiming","territorial"],["territorial","greedy"],["greedy","territorial"],
      ["territorial","doubting"],["doubting","cornered"],["cornered","guarding"],
      ["guarding","struck"],["struck","removed"],["doubting","neutral"],
      ["removed","neutral"],
    ],
  },

  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow",
            "jaw","mouthAsym","cheek","blink"],

  /* CARD SIGNATURE — BLUSTER: the doorway defended. Chest out, chin up,
     shoulders hiked, one fist on the hip and one finger in the stranger's
     face, and a sneer that is already only half committed. */
  preview:()=>({ pose:"irus_bluster",
                 browKnit:.78, browUp:.14, eyeNarrow:.34,
                 mouthAsym:.30, jaw:.74, frown:.42,
                 gaze:{x:.42,y:-.06}, t:0.5, status:"BLUSTER", progress:.18 }),

  draw(ctx, W, H, state){
    // band can be driven by a scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
