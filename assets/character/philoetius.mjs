/* character.philoetius — the loyal cowherd of Ithaca.
   CHARACTER asset. The THIRD herdsman, and the one the poem uses for a
   recognition that never becomes knowledge: he ferries the master's cattle in
   for the suitors' feast, takes the beggar's hand, and weeps — not because he
   has worked anything out, but because the stranger's body reminds him of
   Odysseus. His whole performance is a man moved by a resemblance he cannot
   name.

   Deliberately triangulated against the two herdsmen already in the atlas so
   the three never blur:
     Eumaeus    — grizzled, hide-cloaked, planted on a staff, arms swung open.
     Melanthius — wiry, black-curled, lolled back, one fist on the hip.
     Philoetius — the biggest of the three (a cattleman's frame), light
                  sun-bleached tunic and bare drover's shins, pale grizzled
                  curls, and a body that is always leaning TOWARD someone:
                  reaching, clasping, wiping his eyes.

   Scene function:
     OD-B20-S03  loyal cowherd whose physical recognition remains emotional
                 rather than factual — arrives driving cattle, greets the
                 stranger, stares, takes his hand, weeps at the likeness, pours
                 out his grievance against the suitors, and leaves steadied by
                 the beggar's promise that the master is coming.
     OD-B21-S02  the same felt recognition again, now MIRRORED with Eumaeus:
                 the two herdsmen weep together over the master's bow.
     OD-B21-S04  that recognition finally converted into duty — the scar shown,
                 the oath sworn with the hand up, and a job given: the gate.
     OD-B21-S06  gate keeper. He goes out into the yard and makes the courtyard
                 gate fast with a ship's cable, a sailor's fastening used on a
                 landward door, so that no suitor can break out of the hall.

   Book 21 is the hinge of this body: the man whose recognition never became a
   fact is the man who is trusted with the one irreversible physical act of the
   plot. The gate poses are therefore built out of the SAME frame as the clasp —
   big shoulders rolled forward, spine bowed in, both hands working close to the
   body — so the audience reads the knot as the same gesture as the handclasp,
   only turned into infrastructure.

   The cable and the gate leaf are NOT drawn here: they are
   `prop.courtyard-gate-and-cable`. This module only exposes the grip anchors
   (`cableGripNear` / `cableGripFar` / `gatePost`) the prop attaches to, so the
   two never fight over one drawing.

   NO hand-drawn ctx overpaint: every mark is the shared hero rig, so he stays
   in family with the rest of the cast and the engine's single dotify POST pass
   supplies the halftone. Tonally he is built LIGHT — pale tunic, bare shins,
   grey curls — so the dark accents (brow, beard edge, sandals, contour) carry
   the drawing and plenty of paper stays open. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

const params = {
  // Sun-bleached working skin, a shade lighter than Eumaeus' ruddy weather and
  // Melanthius' olive, so his face prints as an open light plane and the brows,
  // eyes and beard edge do the drawing.
  skin:"#cdb392",
  // Dark iron-brown curls + a full beard. The curls give him a third crown
  // silhouette (Eumaeus' smooth grizzled cap, Melanthius' black mass, these),
  // and the tone is the figure's main DARK accent — the face, tunic and bare
  // shins are all light planes, so the hair, brows and sandals carry the
  // drawing and paper stays open everywhere else.
  hairColor:"#463f38", hair:"curly", beard:true, glasses:false,
  // Plain undyed working tunic, no cloak (he has just walked the herd up from
  // the ferry), bare drover's shins in sandals.
  garment:"tunic", cloak:false, bareLegs:true,
  // The largest frame of the three herdsmen — an ox-handler.
  scale:1.03,
};

const fig = makeFigure(params);

/* ---- bespoke Philoetius poses ----
   Registered additively into the shared POSES registry (the same module
   instance the hero figure reads), so preview()/states name them like any
   built-in pose. Sign conventions used below, verified against the rig:
     +armLUpper  swings the LEFT (screen-left) arm OUT to screen left
     -armLUpper  swings the LEFT arm ACROSS the body toward screen right
     -armRUpper  swings the RIGHT (screen-right) arm OUT to screen right
     +headYaw / +gazeX  turn the head and pupils to screen right
     +headPitch / +gazeY  bow the head and drop the pupils
   The rig reads brow/eye/jaw/mouth channels straight off the composed pose, so
   every beat authors its face, its arms and its stance in one place and the
   scene layer never has to flatten them. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label:id, group:"philoetius", n, opt }; };

// THE CARD — CLASP: the beat the character exists for. He has crossed to the
// stranger and taken his hand in both of his, big shoulders rolled forward,
// spine bowed in, head tipped down over the joined hands — and he is crying
// while he does it. The weeping is authored as brows UP-and-KNIT over a heavy
// frown with the eyes pinched narrow: grief that arrives before understanding.
P("phi_clasp", {
  rootX:-.05,                                                 // recentre: both arms have gone right
  spineLean:-.24, chestOpen:.10, shoulderLiftL:.16, shoulderLiftR:.06,
  weightShift:.20, pelvisX:.05, hipL:.14, kneeL:.10, hipR:-.09, kneeR:.13,  // a step taken toward him
  bodyYaw:.18, headYaw:.26, headPitch:.44, neckPitch:.24, headRoll:.02, headY:.10,
  gazeX:.28, gazeY:.46,                                       // looking down at the two joined hands
  browUp:.74, browKnit:.52, frown:.46, eyeNarrow:.34, jaw:.10, cheek:.16, mouthAsym:.14,
  // The clasp is carried by the NEAR arm alone: elbow tucked in at the ribs,
  // forearm swung out and DOWN so the open hand lands at hand height off his
  // right hip — where a standing man's hand actually is. Angles are kept well
  // short of horizontal so it can never read as a salute, and the hand stays
  // inside the frame. The far arm must NOT cross the body: the rig draws it
  // behind the torso, so a crossing far arm disappears and leaves an orphaned
  // shoulder cap. It hangs open-palmed and slightly out instead — the loose,
  // helpless hand of a man who has been overtaken by something.
  armRUpper:-.30, armRLower:-.55, handRotR:.40,               // near hand out and down, taken
  armLUpper:.36,  armLLower:-.30, handRotL:-.18,              // far hand fallen open at his side
}, { hands:["open_palm","offering"] });

// DRIVING — the entrance: he comes up the track behind the cattle, one arm
// swung across to haze the beasts along, chin level, brows set in plain work
// concentration.
// The stride is AUTHORED, not the rig's walk action: actionMods("walk")
// overwrites armLUpper/armRUpper wholesale, which would throw the hazing arm
// away and splay the legs into a starfish. A held mid-step keeps the arms.
P("phi_driving", {
  spineLean:-.16, chestLift:.24, rootScale:1.03, rootY:-.02,
  hipL:.17, kneeL:.06, ankleL:-.05,                           // far leg carried forward
  hipR:-.09, kneeR:.30, ankleR:.06, footRotR:.10,             // near leg trailing, heel breaking
  pelvisRot:.04, weightShift:.14,
  bodyYaw:-.18, headYaw:-.14, gazeX:-.34, gazeY:.16,          // watching the herd ahead and low
  browKnit:.24, eyeNarrow:.18, jaw:.06,
  armLUpper:.92, armLLower:-.62, handRotL:-.18,               // far arm swung out, hazing them on
  armRUpper:-.14, armRLower:.20,                              // near arm swings back with the step
  shoulderLiftL:.16,
}, { hands:["open_palm","relaxed"] });

// GREETING — the kindly hail he gives the ragged stranger before anything
// happens: one arm lifted open, chest broad, brows up, an unguarded half-smile.
// Hospitality offered by reflex, exactly like Eumaeus and unlike Melanthius.
P("phi_greeting", {
  chestOpen:.54, spineLean:-.06, rootX:.04,
  armRUpper:-1.92, armRLower:.22, handRotR:.10, shoulderLiftR:.42,  // near arm raised in salute
  armLUpper:.34, armLLower:-.30,
  headYaw:.16, headRoll:-.06, gazeX:.22, gazeY:-.04,
  smile:.34, browUp:.42, browKnit:.06, cheek:.28,
}, { hands:["relaxed","open_palm"] });

// WONDER — the recognition that stalls short of a fact. He has stopped
// mid-approach and is simply STARING at the beggar: head cocked, eyes wide,
// brows climbing, jaw slightly loose, one hand drifting up half-formed. He can
// feel the likeness in his chest and cannot make it into a thought.
P("phi_wonder", {
  spineLean:-.10, bodyYaw:.14, headYaw:.24, headRoll:-.18, headPitch:-.06,
  gazeX:.26, gazeY:-.04,
  browUp:.86, browKnit:.20, eyeWide:.62, jaw:.24, frown:.08,
  armRUpper:-.45, armRLower:-1.35, handRotR:.14,              // near hand risen, unresolved
  armLUpper:.20, armLLower:-.34,
  shoulderLiftR:.22,
}, { hands:["relaxed","palm_up"] });

// WEEPING — the tears arriving on their own. He has turned half away and
// brought the near hand up to his face, head dropped, shoulders sunk, gaze
// fallen to the floor, brows driven up-and-together over a deep frown. A big
// man crying about something he cannot explain.
P("phi_weeping", {
  spineLean:.14, bodyYaw:-.22, headPitch:.46, neckPitch:.24, headY:.14, headRoll:-.10,
  gazeY:.58, gazeX:-.14,
  browUp:.92, browKnit:.62, frown:.58, eyeNarrow:.52, jaw:.14, cheek:.10,
  // near hand up at the eyes: the forearm must reach a total angle near +2.5
  // (upper + lower) before it points UP-and-inward — the same construction the
  // rig's own hands_near_face pose uses. Anything under ~1.5 leaves the hand
  // stranded at the belly.
  armRUpper:.52, armRLower:1.94, handRotR:-.26, shoulderLiftR:.40,
  armLUpper:.18, armLLower:-.50, handRotL:-.12,               // far arm hangs, forgotten
}, { hands:["relaxed","open_palm"] });

// GRIEVANCE — the loyal servant's complaint: he leans in and speaks his anger
// at the men eating the herd he has kept, near arm flung out, jaw parted on a
// hard word, brows knit AND raised over a downturned mouth. Bitterness, but a
// good man's bitterness — the brows stay lifted, so it never turns cruel.
P("phi_grievance", {
  spineLean:-.20, chestOpen:.34, bodyYaw:.10,
  armRUpper:-1.20, armRLower:.42, handRotR:.16,
  armLUpper:.38, armLLower:-.56,
  headYaw:.14, gazeX:.20, gazeY:.06,
  browKnit:.52, browUp:.38, frown:.36, jaw:.46, eyeNarrow:.14, mouthAsym:.24,
}, { hands:["relaxed","open_palm"] });

// RESOLVE — the exit beat: the beggar swears the master is on his way, and the
// cowherd straightens. Chin comes level, chest lifts, the near hand closes into
// a fist at his side, brows knit hard but the eyes open wide with hope rather
// than narrowed with anger. The man who will bar the courtyard gate in Book 21.
P("phi_resolve", {
  spineLean:-.04, chestLift:.46, chestOpen:.22, rootScale:1.05,
  shoulderLiftL:.14, shoulderLiftR:.14,
  headPitch:-.10, headYaw:.10, gazeX:.14, gazeY:-.10,
  browKnit:.46, browUp:.30, eyeWide:.34, frown:.14, jaw:.08,
  armRUpper:-.16, armRLower:.24, handRotR:.08,                // fist gathered at the side
  armLUpper:.14, armLLower:-.26,
  hipL:.06, kneeL:.02, hipR:-.06, kneeR:.02,                  // both feet planted square
}, { hands:["relaxed","fist"] });

/* ---- BOOK 21: the recognition becomes a job ----
   Four more beats, same body, same rig, no overpaint. They are deliberately
   built from the clasp's geometry (shoulders rolled forward, spine bowed in,
   hands working close to the chest) so the gate work reads as the handclasp
   turned into infrastructure rather than as a different man. */

// MIRRORING — OD-B21-S02. Eumaeus weeps over the master's bow and the cowherd
// weeps WITH him: turned a quarter toward his fellow servant rather than toward
// the thing, one hand lifted half-open in the space between them, the other
// hanging. He is not reacting to the bow; he is catching the swineherd's grief.
// Same brow signature as phi_weeping so the two beats are legibly one feeling,
// but the head is UP and turned outward — grief shared, not grief hidden.
P("phi_mirroring", {
  spineLean:.06, bodyYaw:-.30, weightShift:-.14, pelvisX:-.04,
  headYaw:-.30, headRoll:.14, headPitch:.16, neckPitch:.10,
  gazeX:-.36, gazeY:.22,                                      // across at Eumaeus
  browUp:.88, browKnit:.58, frown:.50, eyeNarrow:.44, jaw:.12, cheek:.12,
  armLUpper:.62, armLLower:-.86, handRotL:-.24,               // far hand lifted between them
  armRUpper:-.22, armRLower:-.20, handRotR:.10,               // near hand hanging, useless
  shoulderLiftL:.30, shoulderLiftR:.08,
}, { hands:["palm_up","relaxed"] });

// OATH — OD-B21-S04. The scar has been shown. He swears by Zeus and the master's
// own homecoming, near hand straight up and open, chin lifted, eyes up and wide
// under raised-and-knit brows, jaw parted on the word. This is the exact frame
// where the feeling of Book 20 finally converts into an assignment: everything
// after it is duty. Built tall and open — the one beat where he is not bowed.
P("phi_oath", {
  spineLean:-.05, chestLift:.44, chestOpen:.28, rootScale:1.05, rootX:-.03,
  // The forearm is folded back toward vertical rather than left straight along
  // the line of the upper arm: a straight raised arm at this angle throws the
  // hand into the top-right corner and the fingers get cropped by the frame.
  // Bending it brings the hand back over the elbow — higher AND further inside.
  armRUpper:-2.10, armRLower:-.72, handRotR:.30, shoulderLiftR:.48,  // near hand raised, open
  armLUpper:.26, armLLower:-.34, handRotL:-.10,
  headPitch:-.18, headYaw:.12, headRoll:-.04, gazeX:.10, gazeY:-.26,
  browUp:.56, browKnit:.36, eyeWide:.32, jaw:.24, frown:.10,
  hipL:.08, kneeL:.02, hipR:-.08, kneeR:.02,
}, { hands:["relaxed","open_palm"] });

// HAULING — OD-B21-S06, the approach: he crosses the outer yard carrying the
// ship's cable, a coil of byblos hawser hanging from the near fist. The walk
// action supplies the stride so he arrives moving, and the near fist parks the
// coil at `cableCoil` where prop.courtyard-gate-and-cable attaches.
// The load is authored in the SHOULDERS, not the arms: the near shoulder is
// pulled DOWN (negative lift) and the far one rides up, so the weight is legible
// without folding a forearm across the belly — a folded forearm at this scale
// puts a fist-sized dark mass over the pelvis that reads as a second face.
// Chin down, brows set: a working man with a job and no doubt about it.
P("phi_hauling", {
  walkSpeed:1, spineLean:-.10, chestLift:.12, rootScale:1.03,
  bodyYaw:.12, headYaw:-.10, headPitch:.12, headRoll:-.10, gazeX:-.16, gazeY:.20,
  browKnit:.34, eyeNarrow:.20, jaw:.06, frown:.10,
  armRUpper:-.36, armRLower:.20, handRotR:.12, shoulderLiftR:-.14,  // coil hung from the near fist
  armLUpper:.42, armLLower:-.42, handRotL:-.14, shoulderLiftL:.18,  // far arm counterweighting
}, { hands:["relaxed","fist"], action:"walk", loop:true });

// LASHING — OD-B21-S06, THE ACT. Braced low at the gate post with his weight
// back, both fists closed on the cable and hauling it across his chest, head
// down over the knot he is tying. A sailor's fastening, put on a landward door
// by a man who came home by sea: this is the moment the hall becomes a trap.
// Deliberately the clasp's silhouette under load — shoulders rolled forward,
// spine bowed in, both hands close and low — so the knot rhymes with the
// handshake. The cable itself is the prop's line; his fists only give it two
// grips, `cableGripNear` and `cableGripFar`, at different heights so the rope
// between them reads as a diagonal and not a horizontal bar across the frame.
P("phi_lashing", {
  // A braced LUNGE, not a crouch. The rig's `crouch` channel folds both knees
  // together and the two shins collapse into one column with the feet stacked
  // off the shadow; splitting the hips instead (one leg forward, one driven
  // back) gives the same low braced read with two legs that stay legible.
  hipL:.26, kneeL:.14, hipR:-.12, kneeR:.30, ankleL:-.06, ankleR:.06,
  weightShift:.20, pelvisX:.05,
  spineLean:-.24, chestOpen:.06, bodyYaw:.28, spineTwist:.08,
  shoulderLiftL:.26, shoulderLiftR:.30,
  headYaw:.22, headPitch:.38, neckPitch:.20, headRoll:.06,
  gazeX:.24, gazeY:.48,                                       // down on his own hands
  browKnit:.60, eyeNarrow:.40, frown:.22, jaw:.16, cheek:.14, mouthAsym:.10,
  // Both elbows flare WIDE and both forearms swing back in toward the body's
  // centre line: the hauling triangle. Upper-arm and forearm rotations add, so
  // these are chosen to land the near fist high and inboard and the far fist low
  // and outboard — the rope between them is then a short diagonal held close to
  // the chest, never a level line spanning the frame.
  armRUpper:-.95, armRLower:1.75, handRotR:.36,               // near fist hauled up and in
  armLUpper:.95,  armLLower:-1.05, handRotL:-.34,             // far fist braced low and out
}, { hands:["fist","fist"] });

// BARRED — the consequence. The cable is on, the gate will not open, and he has
// turned back to face the hall with both fists shut at his sides and his feet
// planted wide. Chin level, brows driven down, eyes narrowed on the door he has
// just sealed. The gentlest man in the atlas, standing in front of the only exit.
P("phi_barred", {
  spineLean:-.02, chestLift:.38, chestOpen:.20, rootScale:1.06,
  shoulderLiftL:.12, shoulderLiftR:.12,
  hipL:.18, kneeL:.02, hipR:-.18, kneeR:.02,                  // planted wide
  headPitch:-.06, headYaw:-.18, headRoll:.04, gazeX:-.22, gazeY:-.02,
  browKnit:.66, eyeNarrow:.34, frown:.26, jaw:.04,
  armRUpper:-.36, armRLower:.16, handRotR:.12,
  armLUpper:.34, armLLower:-.18, handRotL:-.12,
}, { hands:["fist","fist"] });

/* ---- BOOK 22: the job becomes violence ----
   OD-B22-S04 — "partner in pursuit, binding, and hoisting". Melanthius is caught
   in the storeroom carrying arms up to the suitors; the two herdsmen go after
   him, take him, tie his hands and feet behind his back, run a rope through the
   binding and haul him up a pillar to the roof beams, and leave him there.

   He is the PARTNER in all three: never the man who gives the order, always the
   second pair of hands. So every Book 22 beat is authored to be readable as one
   half of a pair — the far arm is thrown out and back as counterweight rather
   than folded in, leaving the whole screen-left side of the frame open for
   Eumaeus and the captive to occupy. Cast alone, that same construction still
   reads as a man hauling something heavy that is simply out of frame.

   Continuous with the rest of the body, not a new man: the pursuit is the
   `phi_driving` stride opened out and pitched forward, and the hoist is
   `phi_lashing`'s hauling triangle stood upright and turned toward the roof.
   The gentleness has not been replaced — the brows keep the raised inner ends
   that carry every other beat, so even at the knot he is grim rather than cruel.
   Melanthius, the cord and the rope belong to their own modules; this figure
   exposes only the contact and grip anchors they attach to. No overpaint. */

// PURSUIT — the chase into the storeroom. Pitched forward off a driving stride,
// near hand open and thrown ahead to catch a shoulder, far arm flung back as
// counterweight, trailing foot folded up behind. The stride is AUTHORED, not
// actionMods("walk") — the walk action overwrites both upper arms wholesale and
// would throw the catching hand away (the same trap `phi_driving` documents).
// He is a big man moving fast and unhappy about it: mouth open on a shout,
// brows down, eyes narrowed on the back of the man in front of him.
// He runs to screen RIGHT, so the LEADING leg is the near one and the trailing
// leg is the far one, folded up behind him to screen left. Verified against the
// rig by rendering: +hipL swings the far leg to screen LEFT and -hipR swings the
// near leg to screen RIGHT, so leading with the far leg (the obvious first
// guess) strides him away from the hand he is reaching with, and the frame
// contradicts itself.
P("phi_pursuit", {
  rootX:.05, rootY:-.05, rootScale:1.02, spineLean:-.34, chestLift:.10, pelvisRot:-.06,
  hipR:-.44, kneeR:.12, ankleR:.06,                           // near leg thrown out ahead
  hipL:.20, kneeL:.70, ankleL:-.10, footRotL:-.16,            // far leg folded up behind
  weightShift:.10, bodyYaw:.22,
  headYaw:.24, headPitch:-.06, headRoll:-.04, gazeX:.42, gazeY:-.06,
  browKnit:.62, eyeNarrow:.28, frown:.30, jaw:.30, mouthAsym:.10,
  armRUpper:-.92, armRLower:.30, handRotR:.20, shoulderLiftR:.24,   // near hand out to catch
  armLUpper:1.00, armLLower:-.72, handRotL:-.28, shoulderLiftL:.14, // far arm flung back
}, { hands:["fist","open_palm"] });

// SEIZING — he has him. One hand shut on the man and hauling him back off his
// feet, the whole body leaned AWAY from the grip and the far arm swung out to
// screen left as the counterweight. The far arm must not cross the body toward
// the captive: the rig draws it behind the torso and it would vanish, leaving an
// orphaned shoulder cap — so the second hand does the work it really does in a
// two-man seizure, which is balance. The captive attaches at `captiveGrip`,
// outboard of the near fist, so the two bodies never resolve to one coordinate.
P("phi_seizing", {
  rootX:-.04, spineLean:.22, chestOpen:.10, spineTwist:.12, bodyYaw:.26,
  weightShift:-.18, pelvisX:-.05,
  hipL:.10, kneeL:.30, ankleL:-.04,                           // far leg driven back, braced
  hipR:-.28, kneeR:.10, ankleR:.06,                           // near leg planted under the pull
  headYaw:.30, headPitch:.10, neckPitch:.06, headRoll:.08, gazeX:.40, gazeY:.20,
  browKnit:.70, browUp:.22, eyeNarrow:.40, frown:.40, jaw:.26, mouthAsym:.16,
  // The two arms must do DIFFERENT things or the pose prints as a scarecrow —
  // the first two drafts put both of them out at the same angle (level, then
  // 45° down) and both read as "standing with his arms out". So: the near elbow
  // is driven well out and UP while its forearm hangs back down from it, giving
  // a bent, loaded arm with the fist at hip height and safely inboard; and the
  // far arm is dropped to nearly straight. Upper and lower rotations add, so the
  // forearm's world angle is roughly their sum (-1.15+.95 ≈ hanging) while the
  // elbow sits at the upper value alone. The shoulders are tilted to match, one
  // hauled up and one dragged down: the asymmetry is the whole read.
  armRUpper:-1.15, armRLower:.95, handRotR:.30, shoulderLiftR:.42,  // near fist shut on him
  armLUpper:.14,  armLLower:-.10, handRotL:-.14, shoulderLiftL:-.08, // far arm dropped, ballast
}, { hands:["fist","fist"] });

// BINDING — over the man on the floor, running the cord round the wrists and
// ankles drawn up behind his back. A deep STOOP, not a kneel. The rig cannot
// kneel from this module: its `crouch` channel is declared in the channel base
// but never read by rig.apply(), so the library's own kneel is really just a
// folded left leg, and copying those numbers here produced a man standing
// upright with his knees slightly bent — no read at all. Bending hard at the
// waist over two bent knees gives the low working silhouette honestly.
// The arms hang open into the space below the chest rather than folding across
// it: a forearm laid over the pelvis at this scale prints a fist-sized dark mass
// that reads as a second face, and two of them close the figure into a blob.
P("phi_binding", {
  rootX:.08, rootY:.10, rootScale:.97, spineLean:-.60, chestOpen:.04, bodyYaw:.22,
  hipR:-.18, kneeR:.58, ankleR:.10,                           // near knee bent under him
  hipL:.24, kneeL:.66, ankleL:-.08,                           // far knee bent, feet apart
  weightShift:.12, pelvisX:.04,
  headYaw:.22, headPitch:.60, neckPitch:.30, headRoll:.06, gazeX:.28, gazeY:.62,
  browKnit:.66, browUp:.26, eyeNarrow:.46, frown:.28, jaw:.14, cheek:.12, mouthAsym:.12,
  // Arm angles are in TORSO space, so the deep lean rotates both of them out
  // with it: the obvious "hanging" values printed the near arm sticking straight
  // out sideways like a signpost. Roughly the whole lean has to be added back
  // into the near upper arm to bring the hand down to the floor where the knot
  // is — which pushes it positive, across the body. That is safe for the NEAR
  // arm only; the rig draws it in front of the torso. The far arm must stay
  // positive-and-open or it vanishes behind the chest.
  armRUpper:.26, armRLower:-.28, handRotR:.28, shoulderLiftR:.14,   // near fist down on the cord
  armLUpper:.40, armLLower:-.18, handRotL:-.20, shoulderLiftL:.06,  // far hand down, bracing him
}, { hands:["open_palm","fist"] });

// HOISTING — THE ACT. The rope has been made fast to the binding and thrown over
// the roof beam, and he is hauling hand over hand: near fist high on the line,
// far fist dragging the tail down and out past his hip, body leaned back under
// the load, chin thrown up to watch the man rise. This is `phi_lashing`'s
// hauling triangle stood upright — the same shoulders, the same closed fists,
// turned ninety degrees from the gate to the ceiling.
// Both fists have to stay INSIDE the frame, which is harder here than anywhere
// else in the module. Verified by rendering: -2.58 on the near upper arm is
// straight up and -1.34 is dead level, so the intuitive "raised" value of about
// -2.2 is really a 45° diagonal that throws the fist off the right edge, and the
// answer is to go almost fully vertical and then fold the forearm slightly in.
// The far hand is LIFTED to the line rather than flung out sideways — for the
// far arm a more negative lower value raises the hand (the construction
// `phi_mirroring` uses), so a small upper and a large negative lower puts that
// fist inboard at chest height. The two grips end up far apart in BOTH axes on
// purpose: a rope drawn between grips at one height prints as a level bar and
// stripes the frame, where this one crosses it as a long diagonal.
P("phi_hoisting", {
  rootY:.04, rootScale:1.00, spineLean:.24, chestLift:.28, chestOpen:.10,
  bodyYaw:.14, weightShift:-.14, pelvisX:-.04,
  hipL:.20, kneeL:.14, ankleL:-.06,                           // far foot forward, braced
  hipR:-.16, kneeR:.22, ankleR:.08,                           // near foot back, taking the pull
  headPitch:-.46, neckPitch:-.22, headYaw:.14, headRoll:-.06, gazeX:.18, gazeY:-.56,
  browKnit:.44, browUp:.20, eyeNarrow:.26, frown:.18, jaw:.34,
  armRUpper:-2.62, armRLower:-.28, handRotR:.34, shoulderLiftR:.54, // near fist high on the line
  armLUpper:.38,  armLLower:-1.02, handRotL:-.22, shoulderLiftL:.16, // far fist lower on the line
}, { hands:["fist","fist"] });

// CRANING — done. The rope is belayed, Melanthius is swinging from the beam, and
// the cowherd stands under him with his hands fallen open and his head all the
// way back. Chest still lifted from the haul. Deliberately NOT triumphant: the
// brows keep the raised inner ends of every other beat over a frown, so the last
// Book 22 frame of the gentlest man in the atlas is a man looking up at what he
// has just done to somebody.
P("phi_craning", {
  spineLean:.10, chestLift:.42, chestOpen:.16, rootScale:1.02,
  // The weight is dumped onto one leg and the shoulders are tilted. Standing
  // square with two matched arms prints a mannequin: this beat is a man who has
  // stopped, and stopping is asymmetric.
  shoulderLiftL:.02, shoulderLiftR:.22, weightShift:.22, pelvisX:.06, pelvisRot:.04,
  hipL:.20, kneeL:.02, hipR:-.08, kneeR:.12,                  // weight on the far leg
  // The head-back read is carried mostly by the PUPILS, not the skull: headPitch
  // shifts the features rather than rotating the head much, so the gaze has to
  // be driven near its limit or the pose prints as a man staring straight ahead.
  headPitch:-.62, neckPitch:-.30, headYaw:.14, headRoll:.10, gazeX:.16, gazeY:-.78,
  browUp:.34, browKnit:.40, eyeNarrow:.18, frown:.20, jaw:.20,
  armRUpper:-.30, armRLower:.22, handRotR:.10,
  armLUpper:.30, armLLower:-.28, handRotL:-.12,
}, { hands:["relaxed","open_palm"] });

export const asset = {
  id:"character.philoetius",
  type:"CHARACTER",
  name:"Philoetius",
  statusWord:"FAITHFUL",
  scene:"OD-B20-S03",

  params,
  // separate costume layers, back -> front, honoured by the rig's composite order
  layers:["shadow","hair-back","legs","sandals","tunic","far-arm","neck","head",
          "face","beard","hair-front","near-arm"],
  // normalized 0..1 attachment / contact / gaze anchors for scene staging
  anchors:{
    head:{x:.50,y:.22}, crown:{x:.50,y:.13}, eyes:{x:.51,y:.23},
    neck:{x:.50,y:.35}, shoulderYoke:{x:.50,y:.38},
    rightHand:{x:.75,y:.53}, leftHand:{x:.30,y:.60},
    // the contact point the clasp beat resolves to — a second figure's hand
    // attaches HERE, just outboard of his own, so the two never land on one
    // coordinate and the clasp reads as two hands rather than one
    claspPoint:{x:.80,y:.53},
    hip:{x:.50,y:.63}, leftFoot:{x:.44,y:.93}, rightFoot:{x:.58,y:.93},
    feet:{x:.50,y:.94},
    // BOOK 21 gate work. The cable and the gate leaf belong to
    // prop.courtyard-gate-and-cable; these are the two fists it runs between and
    // the post it is made fast to. The two grips sit at DIFFERENT heights on
    // purpose so the attached rope crosses the frame as a diagonal — a cable
    // strung level would print as a full-width bar and stripe the picture.
    cableGripNear:{x:.62,y:.52}, cableGripFar:{x:.29,y:.63},
    gatePost:{x:.90,y:.34}, cableCoil:{x:.72,y:.64},
    // BOOK 22 — OD-B22-S04. Melanthius, the cord and the hoist rope are their
    // own modules; these are the four points they attach to. `captiveGrip` sits
    // OUTBOARD of his own near fist so the seized body and the hand holding it
    // are two coordinates, never one, and `bindPoint` is out on the floor in
    // front of him for the same reason at the knot.
    // Measured off the rendered `seizing` and `binding` frames rather than
    // guessed: his own near fist lands at about (.79,.60) in the seizure, so the
    // captive hangs one hand-width outboard of it.
    captiveGrip:{x:.87,y:.60}, bindPoint:{x:.74,y:.88},
    // The hoist line runs between these two, measured off the rendered
    // `hoisting` frame. They are far apart in BOTH axes: a rope drawn between
    // grips at one height prints as a full-width bar and stripes the frame,
    // where this one crosses it as a long diagonal.
    hoistGripHigh:{x:.87,y:.17}, hoistGripLow:{x:.36,y:.57},
    // where the line leaves him for the roof beam, and where his eyes follow it
    beamEye:{x:.92,y:.03},
  },
  states:{
    initial:"clasping",
    nodes:{
      // ARRIVAL — driving the master's cattle up for the feast day.
      driving:  { preview:{ pose:"phi_driving", browKnit:.24, eyeNarrow:.18,
                            gaze:{x:-.34,y:.16}, t:0.5 } },
      // The unguarded hail he gives the beggar before anything happens.
      greeting: { preview:{ pose:"phi_greeting", smile:.34, browUp:.42, browKnit:.06,
                            cheek:.28, gaze:{x:.22,y:-.04}, t:0.5 } },
      // RECOGNITION THAT STAYS EMOTIONAL — staring, wide-eyed, jaw loose.
      wondering:{ preview:{ pose:"phi_wonder", browUp:.86, browKnit:.20, eyeWide:.62,
                            jaw:.24, gaze:{x:.26,y:-.04}, t:0.5 } },
      // SIGNATURE — takes the stranger's hand in both of his and weeps.
      clasping: { preview:{ pose:"phi_clasp", browUp:.74, browKnit:.52, frown:.46,
                            eyeNarrow:.34, gaze:{x:.30,y:.42}, t:0.5 } },
      // The tears on their own, hand up at the eyes, head dropped.
      weeping:  { preview:{ pose:"phi_weeping", browUp:.92, browKnit:.62, frown:.58,
                            eyeNarrow:.52, gaze:{x:-.14,y:.58}, t:0.5 } },
      // Speaking his complaint against the men eating his herd.
      grieving: { preview:{ pose:"phi_grievance", browKnit:.52, browUp:.38, frown:.36,
                            jaw:.46, mouthAsym:.24, gaze:{x:.20,y:.06}, t:0.5 } },
      // EXIT — steadied by the promise of the master's return.
      resolving:{ preview:{ pose:"phi_resolve", browKnit:.46, browUp:.30, eyeWide:.34,
                            gaze:{x:.14,y:-.10}, t:0.5 } },

      // ---- BOOK 21 ----
      // OD-B21-S02 — weeping WITH Eumaeus over the bow, turned toward him.
      mirroring:{ preview:{ pose:"phi_mirroring", browUp:.88, browKnit:.58, frown:.50,
                            eyeNarrow:.44, gaze:{x:-.36,y:.22}, t:0.5 } },
      // OD-B21-S04 — the scar shown, the oath sworn, hand straight up.
      swearing: { preview:{ pose:"phi_oath", browUp:.56, browKnit:.36, eyeWide:.32,
                            jaw:.24, gaze:{x:.10,y:-.26}, t:0.5 } },
      // OD-B21-S06 — crossing the yard with the ship's cable on his shoulder.
      // t is parked near the walk cycle's passing phase (sin(5.2t)≈0): the stride
      // extremes throw the leading foot clear of the ground shadow in a still.
      hauling:  { preview:{ pose:"phi_hauling", browKnit:.34, eyeNarrow:.20,
                            gaze:{x:-.16,y:.20}, t:0.60 } },
      // OD-B21-S06 — THE ACT: the sailor's fastening going onto the gate.
      lashing:  { preview:{ pose:"phi_lashing", browKnit:.60, eyeNarrow:.40, frown:.22,
                            jaw:.16, gaze:{x:.30,y:.46}, t:0.5 } },
      // OD-B21-S06 — done. The only exit is shut and he is standing in it.
      barred:   { preview:{ pose:"phi_barred", browKnit:.66, eyeNarrow:.34, frown:.26,
                            gaze:{x:-.22,y:-.02}, t:0.5 } },

      // ---- BOOK 22 · OD-B22-S04 ----
      // The chase after Melanthius, caught carrying arms out of the storeroom.
      pursuing: { preview:{ pose:"phi_pursuit", browKnit:.62, eyeNarrow:.28, frown:.30,
                            jaw:.30, gaze:{x:.42,y:-.06}, t:0.5 } },
      // Taken: one fist shut on him, the whole body hauling him back.
      seizing:  { preview:{ pose:"phi_seizing", browKnit:.70, browUp:.22, eyeNarrow:.40,
                            frown:.40, jaw:.26, gaze:{x:.40,y:.20}, t:0.5 } },
      // Down over him, cord round the wrists and ankles drawn up behind.
      binding:  { preview:{ pose:"phi_binding", browKnit:.66, browUp:.26, eyeNarrow:.46,
                            frown:.28, gaze:{x:.28,y:.62}, t:0.5 } },
      // THE ACT — hauling him up the pillar to the roof beam, hand over hand.
      hoisting: { preview:{ pose:"phi_hoisting", browKnit:.44, browUp:.20, eyeNarrow:.26,
                            jaw:.34, gaze:{x:.18,y:-.56}, t:0.5 } },
      // Done. Standing under what is now hanging there, looking up at it.
      craning:  { preview:{ pose:"phi_craning", browUp:.34, browKnit:.40, frown:.20,
                            jaw:.20, gaze:{x:.16,y:-.78}, t:0.5 } },
    },
    edges:[["driving","greeting"],["greeting","wondering"],["wondering","clasping"],
           ["clasping","weeping"],["weeping","grieving"],["grieving","clasping"],
           ["grieving","resolving"],["resolving","driving"],["clasping","wondering"],
           ["weeping","resolving"],
           // Book 21: the felt recognition (mirroring) is converted by the oath
           // into a job, and the job runs one way — fetch, tie, stand. `barred`
           // is terminal on purpose: nothing in the story unties that gate.
           ["wondering","mirroring"],["mirroring","weeping"],["weeping","mirroring"],
           ["mirroring","clasping"],["clasping","swearing"],["mirroring","swearing"],
           ["resolving","swearing"],["swearing","hauling"],["hauling","lashing"],
           ["lashing","barred"],["lashing","hauling"],
           // Book 22: `barred` is no longer the end of him, but the gate is
           // still never untied — there is deliberately no edge back into
           // hauling or lashing from anything below. Standing in the shut door
           // is what puts him in the fight, so barred leads ONWARD only.
           ["barred","pursuing"],["pursuing","seizing"],["seizing","binding"],
           ["binding","hoisting"],["hoisting","craning"],
           // the chase can be broken off and retaken, and the haul is done in
           // stages with pauses, so those two beats loop back on themselves
           ["seizing","pursuing"],["craning","hoisting"],
           // and afterwards he goes back to the doorway he sealed
           ["craning","barred"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw",
            "mouthAsym","mouthPucker","cheek","blink"],

  // CARD SIGNATURE — FAITHFUL: the big cowherd bowed forward with the
  // stranger's hand taken in both of his, weeping over a likeness he cannot
  // name. The recognition of Book 20: entirely felt, never known.
  preview:()=>({ pose:"phi_clasp", browUp:.74, browKnit:.52, frown:.46, eyeNarrow:.34,
                 cheek:.16, gaze:{x:.30,y:.42}, t:0.5, status:"FAITHFUL", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    fig.spec.band = st.band || "front";
    // The rig does all of it — no overpaint, so he cannot drift out of family.
    return fig.draw(ctx, W, H, st);
  },
};
export default asset;
