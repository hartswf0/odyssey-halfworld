/* character.eupithes — the father of Antinous, and the last war in the poem.
   CHARACTER asset. Eupithes is Book 24's counter-weight to Laertes: the other
   old man, the other bereaved father, standing over the other body. Odysseus
   once saved his life; his son Antinous led the suitors and took the first
   arrow. Eupithes does not stoop under that. He converts it — inside a single
   assembly — from private mourning into a public muster, and marches the
   grieving fathers of Ithaca out to be beaten by Athena in an afternoon.

   Atlas performance (Book 24):
     OD-B24-S06 — grieving father of Antinous converting mourning into an
                  immediate militia march

   The whole character is that ONE verb: convert. So the state machine is a
   ramp, not a wheel — mourning -> rising -> inciting -> arming -> marching ->
   charging -> struck — and the SPINE carries it. He begins folded on a knee
   over his son's body and comes up, degree by degree, until he is running with
   a levelled spear. He is the mirror image of Laertes, who spends Book 24 bent
   and comes upright exactly twice; Eupithes comes upright once and never bends
   again, and it kills him.

   BUILD NOTE — zero hand-drawn ctx overpaint. No baked spear, no baked helmet,
   no painted-on tears: the rig does all of it and props attach at the anchors.
   Identity is five figure params (iron-grey head, straight-cut hair rather than
   Laertes's curls, a full beard, an elder's mantle over a light tunic, bare
   sandal-strapped shins) plus a bespoke pose set. Against Laertes he must read
   as the SAME species of old Ithacan noble and a different man: darker head,
   flatter hair silhouette, a cloak Laertes has given up, and a rootScale that
   climbs ABOVE 1 through the ramp where Laertes's sits below it.

   TONE — light tunic plane, bare shins, one mid-grey mantle wedge as the only
   large dark mass; the ink lives in the contour, the slammed brow and the beard.
   Plenty of paper shows. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Eupithes poses ----------------------------------------------
   Registered additively into the shared rig registry so scenes can name them
   like any built-in pose. Sign conventions (same as the rest of the atlas):
     negative spineLean -> upper body tips DOWNSTAGE (toward the viewer)
     negative bodyYaw   -> the LEFT arm composites in FRONT (his gesture hand)
     positive gazeY     -> eyes cast DOWN
     POSITIVE hipL / NEGATIVE hipR -> the legs SPREAD into a braced stance
       (the sign matters: a downward limb swings toward screen-left on a
       positive rotation, so a negative hipL folds the left leg across the
       right and both collapse into one unreadable column.)
   Every pose authors its own brow/eye/mouth so the face emotes off the stance
   instead of off a flat scene-level mouth value. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label:id, group:"eupithes", n, opt }; };

// MOURNING — the bottom of the ramp: folded deep over the laid-out body of
// Antinous, near hand open above him, far forearm braced on the thigh, head
// driven down, shoulders hunched to the ears. Brows lifted AND knit hard, mouth
// pulled down, eyes pinched. The private half of the character, which lasts
// about four lines. Authored as a DEEP STOOP rather than a kneel: a folded knee
// (hipL under -.5) collapses both legs into one unreadable column once the
// rig's floor correction lifts the root, and the pose stops reading at all.
P("eup_mourning", {
  spineLean:-.44, bodyYaw:-.14, headYaw:.12, headPitch:.52, headY:.12,
  rootScale:.94, pelvisX:.18, pelvisRot:.06,
  shoulderLiftL:.48, shoulderLiftR:.42, shoulderTilt:.08,
  armLUpper:.54, armLLower:-.30, handRotL:-.24,   // near hand laid open over the body
  armRUpper:-.24, armRLower:.86, handRotR:.16,    // far forearm braced on the thigh
  hipL:.26, kneeL:.30, ankleL:-.10,
  hipR:-.20, kneeR:.14, ankleR:.08,
  browUp:.84, browKnit:.66, frown:.58, eyeNarrow:.48, jaw:.18,
  gazeX:-.12, gazeY:.62,
}, { hands:["open_palm","relaxed"] });

// RISING — the hinge, and the only genuinely double beat in the module: he is
// coming off the knee with one hand still low over his son while the far arm is
// ALREADY out toward the assembly. Head half-lifted, tears still in the brow
// (up-and-knit) but the jaw beginning to set. Grief turning into an argument.
P("eup_rising", {
  spineLean:-.22, bodyYaw:-.12, headYaw:.16, headPitch:.12, headY:.02,
  rootScale:1.00, pelvisX:-.08,
  shoulderLiftL:.34, shoulderLiftR:.22,
  armLUpper:.90, armLLower:-.96, handRotL:-.20,   // near hand still down at the body
  armRUpper:-1.02, armRLower:.36, handRotR:.14,   // far arm reaching out to the crowd
  hipL:.36, kneeL:.54, ankleL:-.06,               // pushing up off the front leg
  hipR:-.26, kneeR:.16, ankleR:.10,
  browUp:.66, browKnit:.58, frown:.34, eyeNarrow:.26, jaw:.28,
  gazeX:.30, gazeY:.14,
}, { hands:["open_palm","offering"] });

// THE CARD — INCITING. Upright at last, chest thrown open, weight driven onto
// the front foot, the near arm flung up over the assembly with one finger out,
// the far hand closed into a fist at the ribs. Head near-frontal so identity
// reads; brows slammed DOWN and knit, eyes pinched, jaw wide on the shout,
// gaze thrown out past the viewer. Mourning fully converted: this is the frame
// the whole battle comes out of.
P("eup_inciting", {
  spineLean:-.16, chestOpen:.66, bodyYaw:-.16, headYaw:.10, headPitch:-.12, headY:-.04,
  rootScale:1.02, rootX:.10, pelvisX:-.10, shoulderTilt:-.14,
  // the raised arm must clear the CROWN, not swing out level — a shallow
  // armLUpper reads as a horizontal reach and walks straight off the frame.
  shoulderLiftL:.58, armLUpper:2.72, armLLower:-.44, handRotL:-.22,  // arm thrown up over them
  // the far arm hangs STRAIGHT with the fist closed at the thigh. Folded across
  // the waist it disappears behind the torso; raised it competes with the
  // gesture hand and the figure reads as a boxer instead of an orator.
  shoulderLiftR:.08, armRUpper:-.22, armRLower:.34, handRotR:-.06,   // far fist clenched at the thigh
  hipL:.36, kneeL:.14, ankleL:.06,
  hipR:-.24, kneeR:.06, ankleR:-.06,
  browUp:.18, browKnit:.74, frown:.30, eyeNarrow:.32, jaw:.52,
  gazeX:.34, gazeY:-.18,
}, { hands:["point","fist"] });

// ACCUSING — the quieter, nastier half of the same speech: the absent king
// named. Torso turns off, head cocks back the other way, and the far arm comes
// out LEVEL with the finger extended. One brow up, one knit, mouth skewed. The
// demagogue's beat rather than the mourner's.
P("eup_accusing", {
  spineLean:-.08, bodyYaw:.22, headYaw:-.26, headRoll:-.18,
  rootScale:1.03,
  shoulderLiftR:.28, armRUpper:-1.42, armRLower:.16, handRotR:-.10,  // level, pointing off
  armLUpper:.34, armLLower:1.02, handRotL:-.12,
  hipL:.20, kneeL:.10, hipR:-.22, kneeR:.12,
  browUp:.30, browKnit:.54, eyeNarrow:.46, mouthAsym:.62, frown:.20,
  gazeX:-.52, gazeY:.02,
}, { hands:["relaxed","point"] });

// ARMING — the conversion made physical. Head down watching his own hands work
// a strap at the chest, both elbows out, brows knit, mouth shut hard. No
// gesture, no audience: an old man dressing for a fight he will lose.
P("eup_arming", {
  spineLean:-.12, bodyYaw:-.18, headYaw:.06, headPitch:.44, headY:.08,
  rootScale:1.02,
  shoulderLiftL:.32, shoulderLiftR:.30,
  armLUpper:-.48, armLLower:-1.54, handRotL:-.34,  // near hand up at the chest strap
  armRUpper:.42, armRLower:1.46, handRotR:.30,     // far hand meeting it
  hipL:.20, kneeL:.10, ankleL:-.04,
  hipR:-.20, kneeR:.10, ankleR:.04,
  browUp:.10, browKnit:.56, eyeNarrow:.36, frown:.24,
  gazeX:-.08, gazeY:.54,
}, { hands:["relaxed","relaxed"] });

// MARCHING — at the head of the column. Authored as a STATIC stride rather
// than the rig's walk action, because the point of the pose is the shouldered
// spear-hand and the walk mod would flatten both arms to the sides. Long front
// leg, back leg trailing bent, torso turned into the road, gaze fixed ahead.
P("eup_marching", {
  spineLean:-.14, bodyYaw:-.26, headYaw:.22, headPitch:-.04,
  rootScale:1.04, pelvisRot:.06, shoulderTilt:-.10,
  shoulderLiftL:.46, armLUpper:-.36, armLLower:-1.12, handRotL:.28,  // spear shouldered
  armRUpper:-.44, armRLower:.24, handRotR:-.08,                      // far arm swinging back
  hipL:.54, kneeL:.18, ankleL:.10,
  hipR:-.40, kneeR:.36, ankleR:-.12,
  browUp:.06, browKnit:.60, eyeNarrow:.30, frown:.24, jaw:.12,
  gazeX:.42, gazeY:-.06,
}, { hands:["fist","relaxed"] });

// CHARGING — the top of the ramp, and the last thing he does under his own
// power: spine driven forward, spear levelled out of the near shoulder, far arm
// counterweighted back, both legs open in the run. Brows at maximum, jaw parted
// on the war cry. One frame later Laertes throws.
P("eup_charging", {
  spineLean:-.38, bodyYaw:-.22, headYaw:.20, headPitch:.14,
  rootScale:1.07, pelvisRot:-.08, shoulderTilt:-.18,
  // the levelled arm sits BELOW the chin — swung any higher it crosses the face
  shoulderLiftL:.44, armLUpper:-1.28, armLLower:-.16, handRotL:.10,  // spear levelled
  armRUpper:1.18, armRLower:.70, handRotR:.18,                       // far arm thrown back
  hipL:.62, kneeL:.28, ankleL:.12,
  hipR:-.44, kneeR:.48, ankleR:-.14,
  browUp:.04, browKnit:.82, eyeNarrow:.44, frown:.40, jaw:.36,
  gazeX:.50, gazeY:.02,
}, { hands:["fist","fist"] });

// STRUCK — Laertes's cast goes through the bronze cheek-piece. The head snaps
// back and rolls off the impact, both arms are flung open, the knees buckle,
// the spine reverses from -.38 to positive in a single frame. Eyes blown wide,
// brows up, jaw dropped. The war is over in this pose.
P("eup_struck", {
  spineLean:.36, bodyYaw:-.10, headYaw:-.28, headPitch:-.44, headRoll:-.32, headY:-.06,
  rootScale:1.00, rootY:.06, pelvisRot:-.06,
  shoulderLiftL:.32, shoulderLiftR:.36, shoulderTilt:.20,
  armLUpper:1.44, armLLower:.48, handRotL:-.30,    // arms flung open by the impact
  armRUpper:-1.64, armRLower:-.36, handRotR:.30,
  hipL:.46, kneeL:.74, ankleL:-.14,                // knees going out from under him
  hipR:-.28, kneeR:.32, ankleR:.14,
  browUp:.74, browKnit:.28, eyeWide:.80, jaw:.62,
  gazeX:-.30, gazeY:-.34,
}, { hands:["open_palm","open_palm"] });

const params = {
  // sun-worn but not sun-destroyed: he is a town elder, not a farm labourer.
  // The head is IRON-GREY rather than Laertes's white — enough darker to tell
  // the two old men apart at a glance, light enough that the crown never
  // becomes a black cap in the dot lattice.
  skin:"#c9b291", hairColor:"#6e685f",
  // straight-cut hair (Laertes is "curly"): a flatter, harder crown silhouette
  // for the man who is all edges. Full beard, no glasses.
  hair:"short", beard:true, glasses:false,
  // a light tunic under an elder's mantle — the mantle is the ONE large mid
  // grey mass in the figure and it is exactly what Laertes has given up. Bare
  // sandal-strapped shins below the hem keep the lower half paper-light.
  garment:"tunic", cloak:true, bareLegs:true,
  // full stature: unlike Laertes he is not shrunken, and the per-pose rootScale
  // climbs from .96 (on the knee) to 1.07 (charging) across the ramp.
  scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.eupithes",
  type:"CHARACTER",
  name:"Eupithes",
  statusWord:"VENGEFUL",
  scene:"OD-B24-S06",

  params,
  layers:["shadow","hair-back","legs","tunic","mantle","far-arm","neck","head","face","hair-front","beard","near-arm"],

  // normalized 0..1 anchors — prop attachment (spear, shield, helmet), the
  // contact points the scene needs (his son's body, the killing blow), and
  // camera marks.
  anchors:{
    head:{x:.50,y:.28}, crown:{x:.50,y:.20}, eyes:{x:.50,y:.29},
    leftHand:{x:.36,y:.34}, rightHand:{x:.60,y:.62},
    spearGrip:{x:.36,y:.34}, shieldGrip:{x:.62,y:.60},
    helmetMount:{x:.50,y:.20},            // the bronze cap Laertes's cast splits
    cheekPiece:{x:.54,y:.31},             // the exact point of the killing blow
    mantleClasp:{x:.42,y:.44},
    mourn:{x:.46,y:.80},                  // where his son's body lies under him
    shoulder:{x:.44,y:.44}, hip:{x:.50,y:.64}, feet:{x:.50,y:.94},
  },

  states:{
    initial:"inciting",
    nodes:{
      // OD-B24-S06 — down on a knee over Antinous, hands open above the body.
      mourning: { preview:{ pose:"eup_mourning", browUp:.84, browKnit:.66, frown:.58,
                            eyeNarrow:.48, jaw:.18, gaze:{x:-.12,y:.62}, t:0.5,
                            status:"BEREAVED" } },
      // OD-B24-S06 — the hinge: one hand still on the body, one already out.
      rising:   { preview:{ pose:"eup_rising", browUp:.66, browKnit:.58, frown:.34,
                            eyeNarrow:.26, jaw:.28, gaze:{x:.30,y:.14}, t:0.5,
                            status:"TURNING" } },
      // OD-B24-S06 — THE CARD. Arm up over the assembly, jaw wide on the shout.
      inciting: { preview:{ pose:"eup_inciting", browUp:.18, browKnit:.74, frown:.30,
                            eyeNarrow:.32, jaw:.52, gaze:{x:.34,y:-.18}, t:0.5,
                            status:"VENGEFUL" } },
      // OD-B24-S06 — the absent king named, far arm level, mouth skewed.
      accusing: { preview:{ pose:"eup_accusing", browUp:.30, browKnit:.54, eyeNarrow:.46,
                            mouthAsym:.62, gaze:{x:-.52,y:.02}, t:0.42,
                            status:"ACCUSING" } },
      // OD-B24-S06 — head down over his own hands, working a chest strap.
      arming:   { preview:{ pose:"eup_arming", browKnit:.56, eyeNarrow:.36, frown:.24,
                            gaze:{x:-.08,y:.54}, t:0.5, status:"ARMING" } },
      // OD-B24-S06 — at the head of the column, spear shouldered, road ahead.
      marching: { preview:{ pose:"eup_marching", browKnit:.60, eyeNarrow:.30, frown:.24,
                            jaw:.12, gaze:{x:.42,y:-.06}, t:0.5, status:"MARCHING" } },
      // the run onto Laertes's spear.
      charging: { preview:{ pose:"eup_charging", browKnit:.82, eyeNarrow:.44, frown:.40,
                            jaw:.36, gaze:{x:.50,y:.02}, t:0.5, status:"CHARGING" } },
      // the cast lands: head snapped back, arms flung, knees gone.
      struck:   { preview:{ pose:"eup_struck", browUp:.74, browKnit:.28, eyeWide:.80,
                            jaw:.62, gaze:{x:-.30,y:-.34}, t:0.5, status:"STRUCK" } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left" } },
      back:     { preview:{ pose:"back_view" } },
    },
    edges:[
      // the ramp — one direction, because that is the character
      ["mourning","rising"],["rising","inciting"],["inciting","accusing"],
      ["accusing","inciting"],["inciting","arming"],["arming","marching"],
      ["marching","charging"],["charging","struck"],
      // the two reversals the poem actually allows
      ["rising","mourning"],["marching","inciting"],
      ["inciting","profile"],["inciting","back"],
    ],
  },

  channels:["gaze","mouth","breath","pose","stance","band",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym","cheek","smile"],

  // CARD SIGNATURE — VENGEFUL: the iron-grey elder come up off his son's body,
  // mantle swung back, one arm thrown high over the assembly with the finger
  // out, far fist at the ribs, brows slammed down over an open shouting mouth.
  // The single frame in which mourning becomes a militia.
  preview:()=>({ pose:"eup_inciting", browUp:.18, browKnit:.74, frown:.30, eyeNarrow:.32,
                 jaw:.52, gaze:{x:.34,y:-.18}, t:0.5, status:"VENGEFUL", progress:.62 }),

  draw(ctx, W, H, state){
    const st = state || {};
    // pass the whole state through — pose/band, gaze, mouth, blink, the explicit
    // facial channels and t all reach the rig. Zero overpaint on top of it.
    if (!st.pose && !st.band) return fig.draw(ctx, W, H, { ...st, pose:"eup_inciting" });
    return fig.draw(ctx, W, H, st);
  },
};
export default asset;
