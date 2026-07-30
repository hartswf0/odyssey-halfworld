/* character.laertes — the old king of Ithaca, gone to ground in his own orchard.
   CHARACTER asset. Odysseus's father: a former king who has put off the palace
   entirely and works his terraced farm by hand, in a patched labourer's tunic,
   white-headed, stooped, sun-dried and shrunken inside a frame that used to be
   royal. He is the last recognition of the poem, and the hardest one: he does
   not accept his son on sight — he demands evidence, gets it twice over, and
   only then straightens up.

   Atlas performances (Book 24, the farm):
     OD-B24-S03 — aged king reduced to farm labor, grief, suspicion, need for evidence
     OD-B24-S04 — skeptic becoming father through cumulative evidence, not appearance
     OD-B24-S08 — restored elder taking the decisive first throw against his counterpart

   BUILD NOTE — the rig does all of it. There is zero hand-drawn ctx overpaint in
   this module: no baked hoe, no baked gaiters (those are prop.farm-clothing-and-
   tools, a separate asset), no painted-on age. Laertes's identity is carried by
   four figure params — a white-grey head and beard, pale sun-worn skin, a light
   patched working tunic over bare shins, and a rootScale under 1 so he reads
   shrunken next to his son — plus a bespoke pose set in which the SPINE, not a
   drawn prop, is the characterisation: he is bent through most of the book and
   comes upright exactly twice, at the embrace and at the throw.

   TONE — deliberately light. The tunic gray + bare shins + white head keep him
   mid-tone with plenty of paper showing; the ink lives in the contour, the deep
   brow and the shadow, not in a black robe mass. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Laertes poses ------------------------------------------------
   Registered additively into the shared rig registry, so scenes can name them
   like any built-in pose. Conventions used below:
     negative spineLean  -> the upper body tips downstage (his working stoop)
     negative bodyYaw    -> the LEFT arm composites in FRONT (his working hand)
     positive gazeY      -> eyes cast DOWN, at the soil / at the proof
     POSITIVE hipL / NEGATIVE hipR -> the legs SPREAD into a braced stance.
       (the sign matters: a downward limb swings toward screen-left on a
       positive rotation, so a negative hipL folds the left leg across the
       right and the two collapse into a single unreadable column.)
   Every pose authors its own brow/eye/mouth so the face emotes off the pose
   itself rather than off the flat scene-state mouth overlay. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label:id, group:"laertes", n, opt }; };

// THE CARD — TENDING. The king at spade-work: spine folded forward over the
// vine, near (left) hand down among the roots, far hand braced on the thigh,
// one knee driven forward to take the weight, shoulders hunched up around the
// ears. The head is turned a little UP out of the stoop so the face still
// reads: brows lifted AND knit, mouth pulled down, eyes cast to the ground.
// Grief doing manual labour — the whole of his half of Book 24 in one stance.
P("lae_tending", {
  spineLean:-.28, bodyYaw:-.12, headYaw:.14, headX:.55, headY:.04, headPitch:.30,
  rootScale:.98, pelvisRot:.05, pelvisX:.16,       // hips push back under the folded chest
  shoulderTilt:.06, shoulderLiftL:.26, shoulderLiftR:.14,
  armLUpper:.34, armLLower:.16, handRotL:-.20,     // near arm dropped straight into the roots
  armRUpper:-.20, armRLower:.78, handRotR:.16,     // far forearm folded across the thigh
  hipL:.18, kneeL:.22, ankleL:-.08,
  hipR:-.16, kneeR:.10, ankleR:.06,
  browUp:.56, browKnit:.44, frown:.30, eyeNarrow:.16,
  gazeX:-.22, gazeY:.48,
}, { hands:["relaxed","relaxed"] });

// GRIEF — the Homeric gesture: told the stranger's tale of a long-dead guest,
// he takes up the dust of the farm in both hands and pours it over his white
// head. Both arms come up beside the skull, head driven down, brows up-and-knit
// hard, mouth open on the cry, eyes squeezed narrow.
P("lae_grief", {
  spineLean:-.22, bodyYaw:-.10, headY:.14, headPitch:.52, headRoll:-.06,
  rootScale:.93, shoulderLiftL:.66, shoulderLiftR:.62,
  armLUpper:-.52, armLLower:-1.86, handRotL:-.30,  // hand raised beside the head
  armRUpper:.52, armRLower:1.86, handRotR:.30,
  hipL:.18, kneeL:.24, hipR:-.14, kneeR:.20,
  browUp:.86, browKnit:.62, frown:.54, eyeNarrow:.44, jaw:.34,
  gazeX:.06, gazeY:.62,
}, { hands:["open_palm","open_palm"] });

// DOUBTING — "prove it." The skeptic beat: he turns his torso off the stranger
// and cocks his head back the other way, one brow climbing while the other
// knits, eyes pinched, mouth skewed hard to one side, the near forearm lifted
// level in a check. Refusing to be comforted by a resemblance.
P("lae_doubting", {
  spineLean:-.14, bodyYaw:.24, headYaw:-.30, headRoll:-.24,
  rootScale:.95, shoulderLiftL:.18,
  armLUpper:-.30, armLLower:-1.34, handRotL:-.16,  // forearm up, palm checking
  armRUpper:.30, armRLower:1.10,
  hipL:.16, kneeL:.16, hipR:-.18, kneeR:.10,
  browUp:.26, browKnit:.52, eyeNarrow:.50, mouthAsym:.66, frown:.16,
  gazeX:-.54, gazeY:.06,
}, { hands:["relaxed","stop"] });

// EXAMINING — the evidence arriving: he bends IN toward the offered scar and
// the counted trees, one hand out to take hold of the proof, the other drawn
// back. Brows shoot up, eyes go wide, jaw parts. Doubt cracking, not yet broken.
P("lae_examining", {
  spineLean:-.34, bodyYaw:-.16, headYaw:.14, headPitch:.24, headY:.04,
  rootScale:.95, shoulderLiftL:.14, shoulderTilt:.06,
  armLUpper:.96, armLLower:-.34, handRotL:-.14,    // near hand out to the proof
  armRUpper:-.26, armRLower:1.16,
  hipL:.22, kneeL:.26, hipR:-.18, kneeR:.12,
  browUp:.80, browKnit:.22, eyeWide:.56, jaw:.24,
  gazeX:-.36, gazeY:.30,
}, { hands:["offering","relaxed"] });

// EMBRACING — the first time in the module he is UPRIGHT. Stoop released,
// chest thrown open, both arms swung wide to take his son, head tipped back,
// brows up-and-knit over an open mouth: weeping recognition, not joy.
P("lae_embracing", {
  spineLean:.10, chestOpen:.92, bodyYaw:-.08, headPitch:-.16, headY:-.06,
  rootScale:1.0, shoulderLiftL:.24, shoulderLiftR:.24,
  armLUpper:1.24, armLLower:-.52, handRotL:-.24,
  armRUpper:-1.24, armRLower:.52, handRotR:.24,
  hipL:.14, kneeL:.10, hipR:-.14, kneeR:.10,
  browUp:.78, browKnit:.46, frown:.32, jaw:.42, eyeNarrow:.20,
  gazeX:-.10, gazeY:-.06,
}, { hands:["open_palm","open_palm"] });

// PRAYING — Book 24's last hinge: before the throw he washes his hands and
// prays to Athena. Both arms lifted, palms up and open, chin raised, brows high,
// eyes cast up, mouth parted on the vow. Old man asking for one more throw.
P("lae_praying", {
  spineLean:.06, bodyYaw:-.06, headPitch:-.34, headY:-.04, headRoll:.04,
  rootScale:.98, shoulderLiftL:.60, shoulderLiftR:.58,
  armLUpper:2.30, armLLower:-.34, handRotL:-.18,
  armRUpper:-2.30, armRLower:.34, handRotR:.18,
  hipL:.16, kneeL:.12, hipR:-.16, kneeR:.12,
  browUp:.72, browKnit:.16, eyeWide:.34, jaw:.30,
  gazeX:.10, gazeY:-.58,
}, { hands:["palm_up","palm_up"] });

// THROWING — the decisive first cast at Eupithes. Fully restored stature:
// rootScale over 1, spear arm cocked back over the shoulder, far arm thrown
// out ahead to sight along, weight driven onto the front leg, brows slammed
// down, eyes pinched, jaw set. The old king who is briefly young again.
P("lae_throwing", {
  spineLean:-.24, bodyYaw:-.18, headYaw:.12, headPitch:.02,
  rootScale:1.06, pelvisRot:-.08, shoulderTilt:-.16,
  armLUpper:-2.52, armLLower:.30, handRotL:.12, shoulderLiftL:.58,  // spear cocked overhead
  armRUpper:-1.42, armRLower:-.22, handRotR:-.10,                    // far arm sighting ahead
  hipL:.52, kneeL:.26, ankleL:.10,          // front leg driven out into the lunge
  hipR:-.30, kneeR:.06, ankleR:-.12,        // back leg braced straight behind
  browKnit:.74, eyeNarrow:.40, frown:.36, jaw:.22,
  gazeX:.46, gazeY:-.04,          // sighting along the FAR arm — body, head and eyes all aim one way
}, { hands:["fist","point"] });

const params = {
  // sun-dried pale skin and a WHITE-GREY head + full beard: the light hair mass
  // is what makes him read old at a glance, and it keeps the head a light plane
  // with a hard contour instead of the black cap a dark-haired figure gets.
  // (the grey is pitched DARK enough to separate the beard mass from the cheek
  // in the dot lattice, and light enough that the head never becomes a black cap)
  skin:"#cdb699", hairColor:"#807a70",
  hair:"curly", beard:true, glasses:false,
  // a patched working tunic (mid grey) over bare, sandal-strapped shins — no
  // cloak, no royal robe: the whole point of him is a king out of his clothes.
  garment:"tunic", cloak:false, bareLegs:true,
  // shrunken: the per-pose rootScale keeps him under his son's height until
  // Athena restores him, so the spec scale stays at full frame occupancy.
  scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.laertes",
  type:"CHARACTER",
  name:"Laertes",
  statusWord:"BEREFT",
  scene:"OD-B24-S03",

  params,
  layers:["shadow","hair-back","legs","tunic","far-arm","neck","head","face","hair-front","beard","near-arm"],

  // normalized 0..1 anchors — attachment for the farm props (hoe, gaiters,
  // gloves, cap), the contact points the recognition needs, and camera marks.
  anchors:{
    head:{x:.50,y:.30}, crown:{x:.50,y:.22}, eyes:{x:.50,y:.31},
    leftHand:{x:.40,y:.72}, rightHand:{x:.60,y:.66},
    hoeGrip:{x:.40,y:.70}, spearGrip:{x:.42,y:.30},   // working grip / cocked cast
    capMount:{x:.50,y:.22}, gaiterL:{x:.45,y:.86}, gaiterR:{x:.56,y:.86},
    embrace:{x:.46,y:.52},                            // where his son lands on him
    shoulder:{x:.44,y:.46}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },

  states:{
    initial:"tending",
    nodes:{
      // OD-B24-S03 — THE CARD. Folded over the vine, hand in the roots, face
      // turned up out of the stoop: labour and grief in the same stance.
      tending:  { preview:{ pose:"lae_tending", browUp:.56, browKnit:.44, frown:.30,
                            eyeNarrow:.16, gaze:{x:-.22,y:.48}, t:0.5, status:"BEREFT" } },
      // OD-B24-S03 — dust poured over the white head at the stranger's tale.
      grieving: { preview:{ pose:"lae_grief", browUp:.86, browKnit:.62, frown:.54,
                            eyeNarrow:.44, jaw:.34, gaze:{x:.06,y:.62}, t:0.5,
                            status:"GRIEVING" } },
      // OD-B24-S03/S04 — "proof beyond desire": torso off, head cocked, forearm up.
      doubting: { preview:{ pose:"lae_doubting", browUp:.26, browKnit:.52, eyeNarrow:.50,
                            mouthAsym:.66, gaze:{x:-.54,y:.06}, t:0.42,
                            status:"DOUBTING" } },
      // OD-B24-S04 — bending in to the scar and the counted trees. Doubt cracking.
      examining:{ preview:{ pose:"lae_examining", browUp:.80, eyeWide:.56, jaw:.24,
                            gaze:{x:-.36,y:.30}, t:0.5, status:"WEIGHING" } },
      // OD-B24-S04 — upright at last, arms wide, weeping. The recognition lands.
      embracing:{ preview:{ pose:"lae_embracing", browUp:.78, browKnit:.46, frown:.32,
                            jaw:.42, gaze:{x:-.10,y:-.06}, t:0.5, status:"FATHER" } },
      // OD-B24-S08 — hands washed, arms up, the vow to Athena before the cast.
      praying:  { preview:{ pose:"lae_praying", browUp:.72, eyeWide:.34, jaw:.30,
                            gaze:{x:.10,y:-.58}, t:0.5, status:"VOWING" } },
      // OD-B24-S08 — the decisive first throw: stature restored, spear cocked.
      throwing: { preview:{ pose:"lae_throwing", browKnit:.74, eyeNarrow:.40, frown:.36,
                            jaw:.22, gaze:{x:.46,y:-.04}, t:0.5, status:"CASTING" } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left" } },
      back:     { preview:{ pose:"back_view" } },
    },
    edges:[
      ["tending","grieving"],["grieving","doubting"],["tending","doubting"],
      ["doubting","examining"],["examining","doubting"],["examining","embracing"],
      ["embracing","praying"],["praying","throwing"],["throwing","embracing"],
      ["grieving","tending"],["tending","profile"],["tending","back"],
    ],
  },

  channels:["gaze","mouth","breath","pose","stance","band",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym","cheek","smile"],

  // CARD SIGNATURE — BEREFT: the white-headed old king folded over his own
  // vine-row, near hand down in the dirt, far arm braced on the thigh, face
  // turned up out of the stoop with lifted-and-knit brows and a pulled-down
  // mouth. No prop, no robe: a king identifiable only by what he has lost.
  preview:()=>({ pose:"lae_tending", browUp:.56, browKnit:.44, frown:.30, eyeNarrow:.16,
                 gaze:{x:-.22,y:.48}, t:0.5, status:"BEREFT", progress:.24 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // pass the whole state through — pose, gaze, mouth, blink, the explicit
    // facial channels and t all reach the rig. No overpaint on top of it.
    return fig.draw(ctx, W, H, st);
  },
};
export default asset;
