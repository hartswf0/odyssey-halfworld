/* character.dolius — the old field-servant of Laertes, the last man in the poem
   to recognize Odysseus.
   CHARACTER asset. Dolius is Penelope's own gift-servant, kept out at the farm,
   who comes up from the vine rows with earth still on his hands, stops dead at
   the sight of a dead man sitting at his master's table, and then does the only
   thing a house-servant can do with joy that size: he runs at the king, takes
   him by the wrist, kisses the hand, and asks after the mistress. From that
   moment he does not leave the master's side — by the end of the book he and his
   six sons are standing armed in front of the old king with the militia coming
   up the road. Recognition tipping straight over into a bodyguard.

   Atlas performance (Book 24, the farmhouse):
     OD-B24-S05 — old servant recognizing the master and entering protective loyalty

   BUILT AGAINST character.laertes AND character.eumaeus so the three old men of
   the farm read apart at a glance:
     Laertes  — grey CURLY head + full beard, permanently stooped, bereft.
     Eumaeus  — grizzled short hair, hide cloak, planted and sturdy.
     Dolius   — BALD pate under a long pale beard, no cloak, the shortest of the
                three, and the only one whose spine STRAIGHTENS as the scene runs:
                he comes in bent from the digging and ends upright on guard.

   BUILD NOTE — the rig does all of it. Zero hand-drawn ctx overpaint: no baked
   spade, no baked spear, no painted-on age (the tools are prop.farm-clothing-
   and-tools, a separate asset, hung on the anchors below). Dolius's identity is
   four figure params — bald head, pale grey beard, light working tunic over bare
   sandal-strapped shins, sub-unity scale — plus a bespoke pose set where the
   SPINE carries the arc: -.30 stooped on arrival, -.46 folded over the kissed
   hand, and +.04 (upright, chest open) on guard.

   TONE — deliberately light. The bald crown renders as a large PAPER-coloured
   plane where Laertes has a grey hair mass, so the head reads as the lightest
   thing in the frame; the ink lives in the contour, the beard, the deep brow and
   the cast shadow. No cloak, no robe, no black mass anywhere. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Dolius poses -------------------------------------------------
   Registered additively into the shared rig registry so scenes can name them
   like any built-in pose. Sign conventions used below (same as the Laertes set):
     negative spineLean  -> upper body tips downstage (the digger's stoop)
     negative bodyYaw    -> the LEFT arm composites in FRONT (his acting hand)
     positive bodyYaw    -> the RIGHT arm composites in front
     positive gazeY      -> eyes cast DOWN (at the soil, at the kissed hand)
     POSITIVE hipL / NEGATIVE hipR -> the legs SPREAD into a braced stance
   Every pose authors its own brow/eye/mouth so the face emotes off the stance
   itself and not off a flat scene-state mouth overlay. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label:id, group:"dolius", n, opt }; };

// ARRIVING — up from the vine rows at the end of the day: spine folded, near
// hand hanging heavy where the spade rides, far forearm braced across the
// thigh, one leg still mid-stride, head craned UP out of the stoop toward the
// house because there is a voice in it that should not be there. Suspicion
// before recognition.
P("dol_arriving", {
  spineLean:-.30, bodyYaw:-.14, headYaw:.16, headPitch:-.08, headX:.42, headY:.02,
  rootScale:.94, pelvisX:.14, pelvisRot:.05,
  shoulderTilt:.05, shoulderLiftL:.22, shoulderLiftR:.12,
  armLUpper:.30, armLLower:.18, handRotL:-.18,     // near arm hanging, tool-heavy
  armRUpper:-.22, armRLower:.66, handRotR:.14,     // far forearm across the thigh
  hipL:.34, kneeL:.20, ankleL:-.06,                // still walking in
  hipR:-.26, kneeR:.14, ankleR:.06,
  browUp:.30, browKnit:.34, eyeNarrow:.26, frown:.14,
  gazeX:-.36, gazeY:-.08,
}, { hands:["relaxed","relaxed"] });

// THE CARD — AMAZED. He stops dead one step inside the door. The stoop half
// releases, the near hand goes straight OUT toward the man at the table while
// the far arm is flung UP beside the head; shoulders shoot to the ears, chin
// comes back, brows go all the way up, eyes wide, jaw dropped. The asymmetry is
// the point — half of him is already crossing the room and half is still stunned.
// (Symmetrical hands-up variants were tried first: with the elbows out the rig
// folds both forearms back down to the hips and the whole thing reads akimbo.)
P("dol_amazed", {
  spineLean:-.08, chestOpen:.52, bodyYaw:-.10, headYaw:.10, headPitch:-.20, headY:-.05,
  rootScale:.96, pelvisRot:.03,
  shoulderLiftL:.30, shoulderLiftR:.62, shoulderTilt:.06,
  armLUpper:1.24, armLLower:-.34, handRotL:-.16,   // near arm out to the master
  armRUpper:-2.45, armRLower:.28, handRotR:.14,    // far arm flung up beside the head
  hipL:.20, kneeL:.14, ankleL:-.04,
  hipR:-.22, kneeR:.10, ankleR:.05,
  // frown past .45 trips the rig's nasolabial creases — the one age line the
  // face can grow without a single stroke of overpaint.
  browUp:.92, browKnit:.12, eyeWide:.66, jaw:.44, frown:.52,
  gazeX:-.26, gazeY:-.12,
}, { hands:["open_palm","open_palm"] });

// KISSING THE HAND — the Homeric gesture and the lowest point of the module:
// he crosses the floor and folds right over, both hands out to cradle the
// master's wrist, head driven down onto it, mouth pursed on the kiss, brows
// up-and-knit, eyes pinched. Servant's joy, performed as service.
P("dol_kissing_hand", {
  spineLean:-.46, bodyYaw:-.20, headYaw:.12, headPitch:.56, headY:.10,
  rootScale:.90, pelvisX:.18, pelvisRot:.06,
  shoulderLiftL:.32, shoulderLiftR:.26, shoulderTilt:.06,
  armLUpper:.62, armLLower:-1.55, handRotL:-.26,   // near hand under the wrist
  armRUpper:-.62, armRLower:1.55, handRotR:.26,    // far hand closing over it
  hipL:.22, kneeL:.30, ankleL:-.08,
  hipR:-.16, kneeR:.14, ankleR:.06,
  browUp:.74, browKnit:.44, frown:.22, eyeNarrow:.40, mouthPucker:.55,
  gazeX:-.10, gazeY:.62,
}, { hands:["offering","offering"] });

// QUESTIONING — "and does the wise Penelope know?" He half-turns off the king,
// cocks his head, one hand flat to his own chest, the far hand turned palm-up
// and held out on the question. Brows high, jaw parted, still short of breath.
P("dol_questioning", {
  spineLean:-.12, bodyYaw:.20, headYaw:-.24, headRoll:.18, headPitch:-.04,
  rootScale:.94, shoulderLiftR:.20,
  armLUpper:.30, armLLower:-1.95, handRotL:-.14,   // hand flat to his own chest
  armRUpper:-.70, armRLower:-.20, handRotR:.26,    // palm up, held out on the question
  hipL:.16, kneeL:.14, hipR:-.18, kneeR:.10,
  browUp:.64, browKnit:.28, eyeWide:.26, jaw:.26,
  gazeX:.30, gazeY:-.10,
}, { hands:["relaxed","palm_up"] });

// WEEPING — the release after the kiss: both hands come up beside the face,
// head down, shoulders hunched, brows up-and-knit hard over squeezed eyes and
// an open mouth. Joy that arrives as grief, which is the only way it arrives
// in this poem.
P("dol_weeping", {
  spineLean:-.18, bodyYaw:-.08, headPitch:.44, headY:.13, headRoll:-.05,
  rootScale:.91, shoulderLiftL:.60, shoulderLiftR:.56,
  armLUpper:-.50, armLLower:-1.78, handRotL:-.28,  // hands raised beside the head
  armRUpper:.50, armRLower:1.78, handRotR:.28,
  hipL:.16, kneeL:.20, hipR:-.14, kneeR:.16,
  browUp:.86, browKnit:.58, frown:.46, eyeNarrow:.52, jaw:.30,
  gazeX:.04, gazeY:.56,
}, { hands:["open_palm","open_palm"] });

// ARMING — the turn into the second half of the book: the old man reaches up
// over his own shoulder and lifts a spear down off the wall, chin up, far hand
// closed at the belt, brows down. No heroics in it — a servant fetching a tool
// he happens to have used before.
P("dol_arming", {
  spineLean:-.06, bodyYaw:-.12, headYaw:.10, headPitch:-.24, headY:-.04,
  rootScale:.98, shoulderLiftL:.64, shoulderTilt:-.10,
  armLUpper:2.40, armLLower:-.30, handRotL:-.12,   // near arm up to the wall rack
  armRUpper:-.24, armRLower:.86, handRotR:.12,     // far hand closed at the belt
  hipL:.24, kneeL:.14, ankleL:-.05,
  hipR:-.20, kneeR:.10, ankleR:.05,
  browUp:.22, browKnit:.46, eyeNarrow:.22, jaw:.14,
  gazeX:-.12, gazeY:-.42,
}, { hands:["fist","relaxed"] });

// GUARDING — the payoff, and the ONLY pose in the set where he is upright:
// stoop gone, chest open, planted square in front of his master with the near
// arm thrown out across the road to bar it, far fist down on a grounded spear,
// legs braced wide. Brows slammed down, mouth hard. Protective loyalty.
P("dol_guarding", {
  spineLean:.04, chestOpen:.46, bodyYaw:-.16, headYaw:.18, headPitch:-.02,
  rootScale:1.00, pelvisRot:-.04, shoulderLiftL:.18, shoulderTilt:.05,
  armLUpper:1.28, armLLower:-.30, handRotL:-.10,   // barring arm across the road
  armRUpper:-.20, armRLower:.12, handRotR:.10,     // fist down on the shaft
  hipL:.34, kneeL:.14, ankleL:-.08,
  hipR:-.32, kneeR:.06, ankleR:.08,
  browKnit:.62, eyeNarrow:.38, frown:.28, jaw:.06,
  gazeX:-.50, gazeY:-.04,
}, { hands:["stop","fist"] });

const params = {
  // pale sun-worn skin under a dark iron-grey beard. `hair:"bald"` is the
  // identity call: the crown renders in SKIN, so the top of the head is the
  // lightest plane in the frame — the exact inverse of Laertes's grey curly
  // mass — and the beard is pitched several steps darker than the cheek so the
  // bare dome sits on a hard dark jaw frame. That light-dome / dark-beard
  // contrast is the whole face. (Tried at #8c867c and #706a5f first: both
  // dissolved into the skin in the dot lattice and the old man came out
  // looking thirty and completely clean-shaven.)
  skin:"#cfb89b", hairColor:"#4f4a42",
  hair:"bald", beard:true, glasses:false,
  // an undyed working tunic over bare, sandal-strapped shins. No cloak: he has
  // been digging, and a dark drape would put a black mass in a light figure.
  garment:"tunic", cloak:false, bareLegs:true,
  // shorter than both his master and the king; the per-pose rootScale takes him
  // down to .90 folded over the kissed hand and back to 1.00 on guard.
  scale:.97,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.dolius",
  type:"CHARACTER",
  name:"Dolius",
  statusWord:"AMAZED",
  scene:"OD-B24-S05",

  params,
  layers:["shadow","legs","tunic","far-arm","neck","head","face","beard","near-arm"],

  // normalized 0..1 anchors — attachment points for the farm props (spade, hoe,
  // spear, sun-cap), the contact points this recognition needs, and camera marks.
  anchors:{
    head:{x:.50,y:.30}, crown:{x:.50,y:.22}, eyes:{x:.50,y:.31},
    leftHand:{x:.41,y:.66}, rightHand:{x:.60,y:.70},
    spadeGrip:{x:.41,y:.72}, hoeGrip:{x:.41,y:.70},   // working grips, near hand
    spearGrip:{x:.40,y:.58},                          // grounded shaft, on guard
    capMount:{x:.50,y:.22},
    handKiss:{x:.44,y:.60},                           // where the master's wrist lands
    embrace:{x:.47,y:.52}, shoulder:{x:.43,y:.46},
    hip:{x:.50,y:.67}, feet:{x:.50,y:.94},
  },

  states:{
    initial:"arriving",
    nodes:{
      // OD-B24-S05 — in from the vine rows, bent, craning at a voice in the house.
      arriving:  { preview:{ pose:"dol_arriving", browUp:.30, browKnit:.34, eyeNarrow:.26,
                             frown:.14, gaze:{x:-.36,y:-.08}, t:0.42, status:"RETURNING" } },
      // OD-B24-S05 — THE CARD. Stopped dead: hands up, shoulders to the ears,
      // brows to the hairline he no longer has. The recognition itself.
      amazed:    { preview:{ pose:"dol_amazed", browUp:.92, browKnit:.12, eyeWide:.66,
                             jaw:.44, frown:.52, gaze:{x:-.26,y:-.12}, t:0.5,
                             status:"AMAZED" } },
      // OD-B24-S05 — folded over the master's wrist, mouth pursed on the kiss.
      kissing:   { preview:{ pose:"dol_kissing_hand", browUp:.74, browKnit:.44, frown:.22,
                             eyeNarrow:.40, mouthPucker:.55, gaze:{x:-.10,y:.62}, t:0.5,
                             status:"SERVING" } },
      // OD-B24-S05 — "does the wise Penelope know?" Palm up, head cocked.
      questioning:{ preview:{ pose:"dol_questioning", browUp:.64, browKnit:.28, eyeWide:.26,
                             jaw:.26, gaze:{x:.30,y:-.10}, t:0.46, status:"ASKING" } },
      // OD-B24-S05 — the release: hands to the face, joy arriving as grief.
      weeping:   { preview:{ pose:"dol_weeping", browUp:.86, browKnit:.58, frown:.46,
                             eyeNarrow:.52, jaw:.30, gaze:{x:.04,y:.56}, t:0.5,
                             status:"WEEPING" } },
      // OD-B24-S05 — a spear lifted down off the wall, without ceremony.
      arming:    { preview:{ pose:"dol_arming", browUp:.22, browKnit:.46, eyeNarrow:.22,
                             jaw:.14, gaze:{x:-.12,y:-.42}, t:0.5, status:"ARMING" } },
      // OD-B24-S05 — upright at last, barring the road in front of his master.
      guarding:  { preview:{ pose:"dol_guarding", browKnit:.62, eyeNarrow:.38, frown:.28,
                             jaw:.06, gaze:{x:-.50,y:-.04}, t:0.5, status:"GUARDING" } },
      // stable identity turns
      profile:   { preview:{ pose:"profile_left" } },
      back:      { preview:{ pose:"back_view" } },
    },
    edges:[
      ["arriving","amazed"],["amazed","kissing"],["kissing","questioning"],
      ["questioning","weeping"],["weeping","questioning"],["kissing","weeping"],
      ["questioning","arming"],["weeping","arming"],["arming","guarding"],
      ["guarding","arming"],["guarding","questioning"],["amazed","arriving"],
      ["arriving","profile"],["arriving","back"],
    ],
  },

  channels:["gaze","mouth","breath","pose","stance","band",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym",
            "mouthPucker","cheek","smile"],

  // CARD SIGNATURE — AMAZED: a short bald old servant stopped one step inside
  // the door, near hand already out toward the master, far arm flung up beside
  // the head, shoulders at the ears, dark beard under a bare crown, brows at
  // full height over wide eyes and a dropped jaw. No prop: the whole read is a
  // working body that has stopped mid-walk.
  preview:()=>({ pose:"dol_amazed", browUp:.92, browKnit:.12, eyeWide:.66, jaw:.44,
                 frown:.52, gaze:{x:-.26,y:-.12}, t:0.5, status:"AMAZED", progress:.30 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // the whole state passes through — pose, gaze, mouth, blink, the explicit
    // facial channels and t all reach the rig. No overpaint on top of it.
    return fig.draw(ctx, W, H, st);
  },
};
export default asset;
