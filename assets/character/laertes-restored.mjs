/* character.laertes-restored — the old king given his stature back.
   CHARACTER asset. Book 24, inside the farmhouse: Laertes is bathed and
   anointed by Dolius's Sicilian woman, and Athena stands beside him and fills
   out his limbs — "taller than before, and thicker" — so that he comes out of
   the bath-room and his own son marvels at him. This is the SAME man as
   `character.laertes`: same white head, same beard, same sun-worn skin. What
   changes is the FRAME he stands in — stature, span, the spine unfolded — and
   the clean cloak over the working tunic.

   RESTORED WITHOUT ERASING AGE. That is the whole brief of this module and it
   is carried by three deliberate refusals:
     · the hair stays white-grey (no dark hair, no youth transplant),
     · every pose keeps a residual set in the neck and a softness in the knees —
       he is upright, never snapped to attention,
     · the eyes stay a little narrowed and the brow a little heavy: an old face
       on a strong body, which is exactly what Athena did to him.

   Atlas performances:
     OD-B24-S05 — aged father whose strength and stature return without erasing age

   THE RESTORE CHANNEL. `state.restore` (0..1) is a continuous ramp from the
   stooped orchard body of `character.laertes` to this one: spine, stature,
   head carriage and chest all interpolate, so a scene can put
   `divine_fx.athenas-restoration` over the ramp instead of cutting between two
   modules. restore defaults to 1 (fully restored) — the card is the end state.

   BUILD NOTE — zero hand-drawn ctx overpaint. No painted cloak, no baked cup,
   no drawn-on muscle. Identity is four figure params plus a bespoke pose set;
   the rig does all of it, which is what keeps him in family with `laertes`.

   TONE — light on purpose. Sun-worn skin, a WHITE head, a mid-grey tunic and
   bare shins: the ink lives in the contour, the heavy brow and the one cloak
   drape, and the frame keeps plenty of paper. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const lerp = (a, b, u) => a + (b - a) * u;

/* ---- bespoke restored-Laertes poses ---------------------------------------
   Registered additively into the shared rig registry under their own group, so
   scenes can name them like any built-in pose. Conventions match
   `character.laertes` so the two modules read as one body:
     negative spineLean  -> upper body tips downstage (here: nearly gone)
     negative bodyYaw    -> the LEFT arm composites in FRONT
     positive gazeY      -> eyes cast DOWN
     POSITIVE hipL / NEGATIVE hipR -> legs SPREAD into a braced stance
   Age is authored into every entry as eyeNarrow + a little browKnit + knees
   that never fully straighten. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label:id, group:"laertes-restored", n, opt }; };

// THE CARD — RESTORED. Out of the bath, standing his full height for the first
// time in twenty years: chest open, shoulders squared and level, stature over
// 1, both hands loose and open at his sides, chin lifted just off level. The
// age is all in the face — heavy lids, knit brow, mouth set — and in the knees,
// which stay softly bent. Royal presence returned to a body that has been
// digging. This is the frame Odysseus is looking at when he says "some god".
P("laer_r_standing", {
  spineLean:.05, chestOpen:.36, bodyYaw:-.16, headYaw:.14, headPitch:-.08, headY:-.05,
  rootScale:1.12, pelvisX:.12, pelvisRot:.04, shoulderTilt:.08,
  shoulderLiftL:.10, shoulderLiftR:.06,
  armLUpper:.22, armLLower:-.34, handRotL:-.22,     // near arm long, hand opening forward
  armRUpper:-.26, armRLower:.14, handRotR:.08,      // far arm hanging easy and slightly back
  hipL:.13, kneeL:.12, ankleL:-.05,
  hipR:-.12, kneeR:.15, ankleR:.05,
  browUp:.18, browKnit:.26, eyeNarrow:.24, frown:.10,
  gazeX:-.10, gazeY:-.06,
}, { hands:["relaxed","fist"] });

// ANOINTED — the moment itself, still in the bath-room: arms lifted a little
// away from the body as the oil goes on and the limbs fill out, head tipped
// back, brows high, eyes wide, mouth parted. Wonder, not triumph. Put the
// restoration FX on this beat.
P("laer_r_anointed", {
  spineLean:.10, chestOpen:.86, bodyYaw:-.06, headPitch:-.30, headY:-.06, headRoll:.05,
  rootScale:1.10, shoulderLiftL:.34, shoulderLiftR:.32,
  armLUpper:.86, armLLower:-.42, handRotL:-.26,
  armRUpper:-.86, armRLower:.42, handRotR:.26,
  hipL:.14, kneeL:.14, hipR:-.14, kneeR:.14,
  browUp:.72, browKnit:.14, eyeWide:.46, jaw:.26,
  gazeX:.08, gazeY:-.40,
}, { hands:["open_palm","open_palm"] });

// MARVELLING — he looks down at his own forearms. Both arms folded up in front
// of the chest, head bent to them, brows up and knit, eyes narrowed on the
// evidence, mouth pulled slightly to one side. The old man checking the god's
// work on his own body.
P("laer_r_marvelling", {
  spineLean:-.10, bodyYaw:-.14, headYaw:.10, headPitch:.34, headY:.05,
  rootScale:1.08, shoulderLiftL:.20, shoulderLiftR:.16,
  armLUpper:-.24, armLLower:-1.42, handRotL:-.30,
  armRUpper:.26, armRLower:1.28, handRotR:.28,
  hipL:.15, kneeL:.16, hipR:-.15, kneeR:.14,
  browUp:.58, browKnit:.34, eyeNarrow:.34, mouthAsym:.34,
  gazeX:-.16, gazeY:.54,
}, { hands:["open_palm","open_palm"] });

// FEASTING — at the farmhouse board with Dolius and his sons: torso turned in
// to the table, near arm out with a cup offered across, far forearm resting on
// the board, weight settled onto one hip. The face finally warm — a small
// smile inside the heavy lids, cheek up. Family eating together, first time.
P("laer_r_feasting", {
  spineLean:-.16, bodyYaw:-.26, headYaw:.20, headPitch:.14, headY:.03,
  rootScale:1.06, pelvisX:.20, weightShift:.4,
  shoulderTilt:.10, shoulderLiftL:.10,
  armLUpper:.98, armLLower:-.30, handRotL:-.12,     // cup carried out to the board
  armRUpper:-.22, armRLower:1.02, handRotR:.14,     // far forearm laid on the table
  hipL:.20, kneeL:.18, ankleL:-.06,
  hipR:-.12, kneeR:.10, ankleR:.05,
  browUp:.24, smile:.44, cheek:.42, eyeNarrow:.36,
  gazeX:-.34, gazeY:.20,
}, { hands:["offering","relaxed"] });

// DECLARING — "what a day this is for me!" — the boast that only the restored
// man can make: son and grandson vying in valour. One arm thrown up and open,
// chest wide, chin high, jaw open on the speech, brows up. The voice of a king
// coming out of a farmhouse.
P("laer_r_declaring", {
  spineLean:.12, chestOpen:1.0, bodyYaw:-.14, headYaw:.10, headPitch:-.26, headY:-.07,
  rootScale:1.14, shoulderLiftL:.62, shoulderLiftR:.16,
  armLUpper:2.34, armLLower:-.28, handRotL:-.20,    // near arm up and open
  armRUpper:-.52, armRLower:.66, handRotR:.16,
  hipL:.18, kneeL:.12, ankleL:-.06,
  hipR:-.16, kneeR:.12, ankleR:.06,
  browUp:.56, browKnit:.20, eyeNarrow:.18, jaw:.38, smile:.22,
  gazeX:.14, gazeY:-.26,
}, { hands:["open_palm","relaxed"] });

// ARMING — the hinge into OD-B24-S08. Torso yawed off, near hand closed around
// a shaft held upright at his side, far hand curled at the belt, weight driven
// back into the rear leg, brows down, eyes pinched, mouth set. The stature is
// no longer a gift being admired; it is being spent.
P("laer_r_arming", {
  spineLean:-.08, bodyYaw:.22, headYaw:-.26, headPitch:.02,
  rootScale:1.12, pelvisRot:-.05, shoulderTilt:-.08, shoulderLiftL:.18,
  armLUpper:.16, armLLower:-.10, handRotL:-.06,     // shaft gripped, arm straight down
  armRUpper:.34, armRLower:1.30, handRotR:.20,      // far fist at the belt
  hipL:.22, kneeL:.14, ankleL:-.08,
  hipR:-.24, kneeR:.08, ankleR:.08,
  browKnit:.62, eyeNarrow:.44, frown:.30, jaw:.10,
  gazeX:-.48, gazeY:-.02,
}, { hands:["fist","fist"] });

/* ---- the RESTORE ramp ------------------------------------------------------
   The stooped orchard body of `character.laertes`, expressed as the handful of
   channels that actually carry the change. restore=0 resolves any pose above
   back onto that body; restore=1 leaves the pose as authored. Everything else
   in the pose (arms, face, gaze) is untouched, so a scene can hold one gesture
   and ramp only the stature underneath it — which is precisely what Athena
   does to him while he stands still. */
const STOOPED = {
  spineLean:-.26, rootScale:.95, headPitch:.26, headY:.05,
  chestOpen:0, shoulderLiftL:.22, shoulderLiftR:.14, kneeL:.20, kneeR:.16,
};
const BLEND_ID = "laer_r__restore_blend";
function blendPose(baseId, u){
  const def = POSES[baseId] || POSES.laer_r_standing;
  const n = { ...def.n };
  for (const k in STOOPED) n[k] = lerp(STOOPED[k], def.n[k] ?? 0, u);
  POSES[BLEND_ID] = { id:BLEND_ID, label:BLEND_ID, group:"laertes-restored", n, opt:def.opt };
  return BLEND_ID;
}

const params = {
  // the SAME head as character.laertes — sun-dried pale skin, white-grey curls
  // and full beard — pitched a half-step brighter here because he has just been
  // washed and oiled. Never darker: the light head mass is the age, and it also
  // keeps the skull a light plane with a hard contour instead of a black cap.
  skin:"#d2bd9f", hairColor:"#7d776d",
  hair:"curly", beard:true, glasses:false,
  // the same working tunic (mid grey) over bare, sandal-strapped shins. No robe
  // and no cloak: a robe floods the torso with ink, and the rig's cloak drape
  // hangs a wedge down the centre line that eats the new silhouette — and the
  // silhouette IS the restoration. The fresh mantle he is given in the
  // bath-room is a separate wearable, attached at `cloakPin`.
  garment:"tunic", cloak:false, bareLegs:true,
  // stature lives in the per-pose rootScale (1.06–1.14, against the orchard
  // Laertes's 0.93–1.06) so the spec scale stays at full frame occupancy.
  scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.laertes-restored",
  type:"CHARACTER",
  name:"Laertes restored",
  statusWord:"RESTORED",
  scene:"OD-B24-S05",

  params,
  layers:["shadow","hair-back","legs","tunic","cloak","far-arm","neck","head","face","hair-front","beard","near-arm"],

  // normalized 0..1 anchors — attachment for the restoration FX and the feast
  // props, the contact points the reunion needs, and camera marks.
  anchors:{
    head:{x:.50,y:.24}, crown:{x:.50,y:.16}, eyes:{x:.50,y:.25},
    leftHand:{x:.38,y:.62}, rightHand:{x:.62,y:.62},
    cupGrip:{x:.38,y:.60}, spearGrip:{x:.38,y:.66},   // feast cup / upright shaft
    cloakPin:{x:.42,y:.40}, shoulder:{x:.42,y:.38},
    aura:{x:.50,y:.46},                               // where athenas-restoration centres
    embrace:{x:.48,y:.46},                            // where his son lands on him
    hip:{x:.50,y:.60}, feet:{x:.50,y:.94},
  },

  states:{
    initial:"restored",
    nodes:{
      // OD-B24-S05 — THE CARD. Full height, chest open, hands loose: the god's
      // work finished, the age left in the face.
      restored:  { preview:{ pose:"laer_r_standing", browUp:.18, browKnit:.26, eyeNarrow:.24,
                             frown:.10, gaze:{x:-.10,y:-.06}, restore:1, t:0.5,
                             status:"RESTORED" } },
      // OD-B24-S05 — the bath-room itself, arms open as the limbs fill out.
      // Hold `restore` ramping 0->1 across this state and flare the FX at .5.
      anointed:  { preview:{ pose:"laer_r_anointed", browUp:.72, eyeWide:.46, jaw:.26,
                             gaze:{x:.08,y:-.40}, restore:.5, t:0.5, status:"ANOINTED" } },
      // OD-B24-S05 — looking down at his own forearms; the old man checking.
      marvelling:{ preview:{ pose:"laer_r_marvelling", browUp:.58, browKnit:.34, eyeNarrow:.34,
                             mouthAsym:.34, gaze:{x:-.16,y:.54}, restore:1, t:0.5,
                             status:"MARVELLING" } },
      // OD-B24-S05 — at the board with Dolius and his sons, cup carried across.
      feasting:  { preview:{ pose:"laer_r_feasting", smile:.44, cheek:.42, eyeNarrow:.36,
                             browUp:.24, gaze:{x:-.34,y:.20}, restore:1, t:0.5,
                             status:"FEASTING" } },
      // OD-B24-S05 — "what a day this is for me": the boast of a king again.
      declaring: { preview:{ pose:"laer_r_declaring", browUp:.56, jaw:.38, smile:.22,
                             gaze:{x:.14,y:-.26}, restore:1, t:0.5, status:"BOASTING" } },
      // OD-B24-S05 -> S08 — the shaft taken up; stature about to be spent.
      arming:    { preview:{ pose:"laer_r_arming", browKnit:.62, eyeNarrow:.44, frown:.30,
                             gaze:{x:-.48,y:-.02}, restore:1, t:0.5, status:"ARMING" } },
      // stable identity turns
      profile:   { preview:{ pose:"profile_left", restore:1 } },
      back:      { preview:{ pose:"back_view", restore:1 } },
    },
    edges:[
      ["anointed","restored"],["anointed","marvelling"],["marvelling","restored"],
      ["restored","marvelling"],["restored","feasting"],["feasting","declaring"],
      ["declaring","feasting"],["declaring","arming"],["restored","arming"],
      ["arming","restored"],["restored","profile"],["restored","back"],
    ],
  },

  channels:["gaze","mouth","breath","pose","stance","band","restore",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym","cheek","smile"],

  // CARD SIGNATURE — RESTORED: the white-headed king at full height, spine
  // unfolded, chest open, shoulders level, both hands loose at his sides, chin
  // just off level. Everything that made him old is still on the face; nothing
  // that made him old is still in the frame.
  preview:()=>({ pose:"laer_r_standing", browUp:.18, browKnit:.26, eyeNarrow:.24, frown:.10,
                 gaze:{x:-.10,y:-.06}, restore:1, t:0.5, status:"RESTORED", progress:.72 }),

  draw(ctx, W, H, state){
    const st = { ...(state || {}) };
    fig.spec.band = st.band || "front";
    // the restore ramp: resolve the named pose onto a body that is still partly
    // the orchard Laertes when restore < 1. No overpaint anywhere.
    const u = typeof st.restore === "number" ? Math.max(0, Math.min(1, st.restore)) : 1;
    const baseId = st.pose || st.band || "laer_r_standing";
    if (u < 1 && POSES[baseId] && POSES[baseId].group === "laertes-restored"){
      st.pose = blendPose(baseId, u);
    } else if (!st.pose) {
      st.pose = baseId;
    }
    return fig.draw(ctx, W, H, st);
  },
};
export default asset;
