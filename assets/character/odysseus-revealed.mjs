/* character.odysseus-revealed — the Book 22 performance of the returned king.
   CHARACTER asset. Book 22 is the one scene where the disguise is not a costume
   but a *plot device being spent*: the beggar's rags come off on the great stone
   threshold, and in the space of four beats the same body has to read as four
   different offices — the concealed suppliant, the archer, the judge, and the
   king of the house.

   ONE BODY, NOT A SEVENTH ODYSSEUS.
   Books I–XV left six drifted Odysseus modules (three skins, a 20% scale
   spread, divergent hand overpaint). `character.odysseus-b16` reconciled them
   into a single body with a `guise` channel, and nothing here re-opens that.
   This module owns NO geometry and NO params of its own: it *delegates every
   mark* to `character.odysseus-b16` and contributes only

     (a) the Book 22 pose set, registered additively into the shared POSES
         registry the hero rig reads, and
     (b) the state graph that spends the disguise in causal order.

   So "revealed" is a PERFORMANCE of the continuity body, not a second man. A
   scene may cast this id or cast `character.odysseus-b16` directly and pass
   `pose:"odr_draw"` — both routes reach the identical figure. That is the point:
   there is no cut between a beggar module and a king module anywhere in Book 22,
   only one man and one ramp.

   THE RAMP. `stripping` is the discontinuity: `guise:{from:"beggar",to:"king",u}`
   with u driven 0 -> 1 across the beat. Skin, hair colour and height interpolate
   continuously; the rags SNAP to the tunic at u = 0.5. Put
   `divine_fx.athenas-restoration` on exactly that frame — the flare exists to
   cover the one discontinuity, and the surface it should be tinted to is
   readable from `surfaceAt()` below.

   Scene function:
     OD-B22-S01  beggar concealment discarded into threshold archer, judge, and
                 returned king: he strips the rags, leaps onto the threshold,
                 pours the remaining arrows out before his feet, shoots Antinous
                 through the throat over a lifted cup, and names himself.

   The bow, the quiver and the spilled arrows are NOT drawn here — they are
   `prop.odysseuss-bow` and `prop.quiver-and-arrows`. This module only publishes
   the contact anchors (`bowGrip`, `stringHand`, `nockPoint`, `quiverMount`,
   `arrowSpill`) those props attach to, so the two never fight over one drawing.

   NO hand-drawn ctx overpaint — zero, by construction, since the draw call is
   forwarded intact to the continuity body. Tonally that inherits the exemplar:
   a light face plane, a light tunic, bare shins, with the hair, beard, brow and
   contour carrying the drawing and paper open everywhere else. */
import b16 from "./odysseus-b16.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Book 22 poses ----
   Registered additively into the shared POSES registry (the same module
   instance the hero figure reads), so preview()/states name them like any
   built-in pose. Sign conventions, verified against the rig:
     +armLUpper  swings the LEFT (screen-left) arm OUT to screen left
     -armRUpper  swings the RIGHT (screen-right) arm OUT to screen right
     upper-arm and forearm rotations ADD, so a hand's position is the sum
     -bodyYaw    turns the body toward screen left; at negative yaw the LEFT
                 arm is the NEAR arm (drawn in front of the torso) and the RIGHT
                 arm is drawn behind it — a far arm swung ACROSS the body
                 vanishes behind the torso, so the far arm always works outboard
   Every beat authors its face, its arms and its stance in one place, so the
   scene layer never has to flatten them. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label:id, group:"odysseus-b22", n, opt }; };

// CONCEALED — the last frame of the disguise. Guise `beggar` supplies the ashen
// skin, the grey crop, the rags and the 0.90 scale; the POSE supplies the lie:
// spine folded over, shoulders pulled up around the neck, the near hand drawn
// in across the belly, chin down. The eyes are the tell — gaze driven UP under
// a knitted brow, because the man is measuring the room he is about to kill.
P("odr_concealed", {
  spineLean:.20, chestLift:-.06, bodyYaw:-.22, weightShift:-.14, pelvisX:-.04,
  shoulderLiftL:.26, shoulderLiftR:.22,
  headPitch:.32, neckPitch:.18, headYaw:-.14, headY:.08,
  gazeX:-.32, gazeY:-.30,                                     // eyes up under the brows
  browKnit:.46, browUp:.14, eyeNarrow:.46, frown:.14, jaw:.02,
  armLUpper:-.26, armLLower:-.66, handRotL:-.20,              // near hand pulled in over the belly
  armRUpper:-.20, armRLower:.28, handRotR:.10,                // far arm hangs outboard, clear of the torso
  hipL:.10, kneeL:.14, hipR:-.06, kneeR:.16,
}, { hands:["relaxed","relaxed"] });

// STRIPPING — THE SNAP. The rags are being flung: the near arm has swept down
// and out to screen left, trailing the discarded cloth, while the far hand is
// still up at the far shoulder where it tore the garment off. The body opens
// and rises through the beat — chest thrown open, shoulders squared, spine
// coming out of the beggar's fold. Face is not triumph: jaw set, brows driven
// down. Run the guise ramp under this pose and put Athena's flare on u = 0.5.
P("odr_strip", {
  spineLean:-.08, chestOpen:.74, chestLift:.52, rootScale:1.04, rootY:-.02,
  bodyYaw:-.26, shoulderLiftL:.30, shoulderLiftR:.34,
  headPitch:-.10, headYaw:-.18, headRoll:-.04, gazeX:-.28, gazeY:-.08,
  browKnit:.52, browUp:.16, eyeNarrow:.20, frown:.24, jaw:.30, mouthAsym:.10,
  armLUpper:1.06, armLLower:-.30, handRotL:-.24,              // near arm swept out, the rags let go
  armRUpper:-1.35, armRLower:-.85, handRotR:.26,              // far hand still up at the torn shoulder
  hipL:.16, kneeL:.04, hipR:-.16, kneeR:.04,                  // both feet squared under him
}, { hands:["open_palm","fist"] });

// THRESHOLD — the leap onto the great stone sill. A high braced step: the
// leading knee driven up, the trailing leg planted and straight, weight carried
// forward over it, both arms low and wide for balance. Authored as a held
// mid-step rather than the rig's walk action, which would overwrite both arms
// wholesale and splay the legs. Chin forward, brows hard down: this is the man
// taking the only door in the room.
P("odr_threshold", {
  spineLean:-.34, chestLift:.30, rootScale:1.05, rootY:-.04,
  hipL:.66, kneeL:.74, ankleL:-.10, footRotL:.12,             // leading knee driven up onto the sill
  hipR:-.20, kneeR:.06, ankleR:.06,                           // trailing leg planted straight
  pelvisRot:.06, weightShift:.22,
  bodyYaw:-.30, headYaw:-.24, headPitch:-.06, gazeX:-.36, gazeY:-.04,
  browKnit:.58, eyeNarrow:.26, frown:.20, jaw:.16,
  armLUpper:.88, armLLower:-.34, handRotL:-.16,               // near arm out low, balancing
  armRUpper:-.72, armRLower:.24, handRotR:.14,                // far arm out low the other way
  shoulderLiftL:.18, shoulderLiftR:.10,
}, { hands:["fist","relaxed"] });

// POURING — the arrows tipped out onto the floor in front of him, ready to
// hand. A braced lunge with the near arm hanging straight down to the boards,
// head dropped over the work, gaze on the spill. The quiver is the prop's
// drawing; this pose only puts the fist at `arrowSpill` and holds it there.
// Deliberately the lowest, most folded silhouette in the set — the beat before
// the shooting is the beat where he is smallest.
P("odr_pour", {
  spineLean:-.44, bodyYaw:-.34, spineTwist:.06,
  hipL:.30, kneeL:.26, ankleL:-.06, hipR:-.14, kneeR:.36, ankleR:.08,
  weightShift:.20, pelvisX:.05,
  headPitch:.50, neckPitch:.26, headYaw:-.10, headRoll:.04,
  gazeX:-.18, gazeY:.58,                                      // down on the arrows at his feet
  browKnit:.44, eyeNarrow:.36, frown:.14, jaw:.08,
  armLUpper:.24, armLLower:-.12, handRotL:-.26,               // near fist low, tipping the quiver out
  armRUpper:-.52, armRLower:.30, handRotR:.12,                // far arm counterweighting
  shoulderLiftL:.10,
}, { hands:["fist","relaxed"] });

// DRAWING — THE CARD. The archer at full draw, turned three-quarter to screen
// left so both arms stay legible (a full profile narrows the shoulders until
// the two arms collapse into one column). The bow arm is the NEAR arm, run out
// straight and level to screen left: upper arm just past the horizontal, elbow
// locked, so the fist parks at `bowGrip` where prop.odysseuss-bow attaches. The
// string arm is folded hard — elbow carried high and back outboard of the far
// shoulder, forearm swung back in so the fist arrives beside the jaw at
// `stringHand`. The face is the sighting face: one long look down the shaft,
// eyes pinched narrow, brows driven down, mouth shut. No effort, no snarl.
P("odr_draw", {
  // Recentred right: the bow arm spends a full arm's length to screen left, and
  // at this scale a level arm off a centred root throws the fist off the page.
  rootX:.34,
  spineLean:-.05, chestOpen:.18, rootScale:1.03,
  bodyYaw:-.78, spineTwist:.10, weightShift:-.12,
  hipL:.24, kneeL:.06, ankleL:-.04, hipR:-.20, kneeR:.06, ankleR:.04,   // planted wide
  headYaw:-.55, headRoll:-.06, headPitch:.02, gazeX:-.62, gazeY:-.02,
  browKnit:.62, eyeNarrow:.55, frown:.16, jaw:.02,
  // Bow arm: elbow locked, the whole limb run out to screen left and DOWN about
  // thirty degrees — he is shooting across the hall at a man sitting at a table.
  // The decline is doing two jobs: it is the aim, and it keeps the arm off the
  // horizontal, where a straight limb at this length prints as a bar striping
  // the frame from edge to edge. The shifted root keeps the fist on the page.
  armLUpper:1.08, armLLower:-.06, handRotL:-.16,
  // String arm folded in half at the ANCHOR, not in front of the face. The far
  // arm is drawn BEHIND the head, so a fist brought to the cheek is swallowed by
  // the hair mass and the limb reads as an arm that ends in nothing. The elbow
  // therefore rides up and OUT past the far shoulder and the forearm folds back
  // up-and-in, landing the fist just outboard of the skull at temple height —
  // an archer's anchor, and the one place it stays legible. Compact on purpose:
  // the drawing arm is a tight V so the bow arm owns the only long line.
  armRUpper:-2.02, armRLower:-1.70, handRotR:.28,
  shoulderLiftR:.34, shoulderLiftL:.06,
}, { hands:["fist","fist"] });

// LOOSING — the release. Bow arm holds its line (an archer does not drop it);
// the string hand has flown back open past the ear, the shoulders have opened a
// notch with the recoil, and the eye stays down the shaft. Jaw parts on the
// breath. Built from `odr_draw`'s exact frame so the two read as one action in
// two frames rather than two poses.
P("odr_loose", {
  rootX:.34,
  spineLean:-.03, chestOpen:.30, rootScale:1.03,
  bodyYaw:-.78, spineTwist:.14, weightShift:-.14,
  hipL:.24, kneeL:.06, ankleL:-.04, hipR:-.20, kneeR:.06, ankleR:.04,
  headYaw:-.55, headRoll:-.04, gazeX:-.64, gazeY:-.04,
  browKnit:.50, browUp:.14, eyeNarrow:.30, eyeWide:.18, jaw:.24,
  armLUpper:1.06, armLLower:-.04, handRotL:-.14,              // the line is held
  armRUpper:-2.16, armRLower:-1.42, handRotR:.14,             // string hand flown back past the ear, opened
  shoulderLiftR:.42, shoulderLiftL:.08,
}, { hands:["fist","open_palm"] });

// NAMING — THE JUDGE. He turns square to the hall and speaks his own name, the
// near arm run out level and pointing across the benches, the far fist gathered
// at his side. Chest lifted, feet planted square, chin level: the accusation is
// delivered standing still. Brows driven hard down over narrowed eyes with the
// jaw parted on the word — the one open mouth in the set, because this is the
// only beat in the scene that is speech.
P("odr_naming", {
  // Same correction as the bow arm: a pointing limb run out level off a centred
  // root puts the fingers through the frame edge, and the straight horizontal
  // stripes the picture. Root shifted right, arm angled down the benches.
  rootX:.55,
  spineLean:-.10, chestLift:.44, chestOpen:.26, rootScale:1.06,
  bodyYaw:-.16, shoulderLiftL:.14, shoulderLiftR:.10,
  hipL:.16, kneeL:.02, hipR:-.16, kneeR:.02,                  // planted square
  headYaw:-.14, headPitch:-.06, headRoll:.03, gazeX:-.30, gazeY:-.04,
  browKnit:.72, eyeNarrow:.26, frown:.32, jaw:.46, mouthAsym:.14,
  armLUpper:1.05, armLLower:-.02, handRotL:-.12,              // near arm out and down, pointing along the benches
  armRUpper:-.20, armRLower:.18, handRotR:.10,                // far fist gathered at the side
}, { hands:["point","fist"] });

// KING — the office arrived at. Everything that was folded in `odr_concealed`
// is unfolded: spine straight, chest lifted, shoulders level and square, both
// hands quiet at the sides, chin level, gaze steady and slightly raised. The
// brows stay faintly knit — the man who has just done this does not soften —
// but nothing else in the body is doing any work. Deliberately the calmest and
// most symmetrical pose in the module, so the scene can END on stillness.
P("odr_king", {
  spineLean:-.02, chestLift:.50, chestOpen:.18, rootScale:1.05,
  shoulderLiftL:.10, shoulderLiftR:.10,
  hipL:.12, kneeL:.02, hipR:-.12, kneeR:.02,
  headPitch:-.08, headYaw:.10, headRoll:-.02, gazeX:.10, gazeY:-.10,
  browKnit:.22, browUp:.10, eyeNarrow:.12, frown:.06, jaw:.02,
  armLUpper:.20, armLLower:-.24, handRotL:-.08,
  armRUpper:-.20, armRLower:.24, handRotR:.08,
}, { hands:["relaxed","relaxed"] });

/* the ramp, in one place, so a scene never hand-authors the transformation */
export const REVEAL = u => ({ from:"beggar", to:"king", u });
export const SNAP_U = 0.5;        // the frame divine_fx.athenas-restoration covers

export const asset = {
  id:"character.odysseus-revealed",
  type:"CHARACTER",
  name:"Odysseus revealed",
  statusWord:"REVEALED",
  scene:"OD-B22-S01",
  /* not a new body: every mark comes from the continuity module, and this id is
     a performance profile over it. */
  continuityOf:"character.odysseus-b16",
  guises:b16.guises,

  params:b16.params,
  layers:b16.layers,
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    neck:{x:.50,y:.34}, shoulderYoke:{x:.50,y:.37},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    hip:{x:.50,y:.66}, leftFoot:{x:.44,y:.93}, rightFoot:{x:.57,y:.93},
    feet:{x:.50,y:.94},
    /* BOOK 22 contact anchors. The bow, the string, the quiver and the spilled
       arrows all belong to prop.odysseuss-bow / prop.quiver-and-arrows; these
       are the points those props attach to at the `drawing` / `loosing` frames.
       `bowGrip` and `stringHand` sit at DIFFERENT heights on purpose so the
       attached shaft crosses the frame as a slight diagonal — a level arrow
       would print as a bar striping the picture. */
    bowGrip:{x:.15,y:.49}, stringHand:{x:.74,y:.23}, nockPoint:{x:.71,y:.25},
    quiverMount:{x:.62,y:.40},
    /* where the poured arrows land, just outboard of the leading foot, so the
       spill never resolves onto the figure's own coordinates */
    arrowSpill:{x:.30,y:.90},
    /* the sill he stands on — a set-piece attaches its top face here */
    thresholdStand:{x:.50,y:.92},
    /* the rags, once let go: a discard point clear of the body */
    ragDrop:{x:.20,y:.86},
  },
  channels:["guise","gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw",
            "mouthAsym","mouthPucker","cheek","blink"],

  states:{
    initial:"drawing",
    nodes:{
      // The disguise still on: guise supplies the ashen skin, grey crop, rags
      // and the 0.90 height; the pose supplies the fold and the measuring eye.
      concealed:{ preview:{ guise:"beggar", pose:"odr_concealed",
                            browKnit:.46, browUp:.14, eyeNarrow:.46,
                            gaze:{x:-.32,y:-.30}, t:0.5 } },
      // THE SNAP. u = 0.5 is the frame the rags flip to the tunic — put
      // divine_fx.athenas-restoration exactly here and nowhere else.
      stripping:{ preview:{ guise:{ from:"beggar", to:"king", u:SNAP_U },
                            pose:"odr_strip", browKnit:.52, frown:.24, jaw:.30,
                            gaze:{x:-.28,y:-.08}, t:0.5 } },
      // Up onto the great stone sill: the only door, taken.
      mounting: { preview:{ guise:"king", pose:"odr_threshold",
                            browKnit:.58, eyeNarrow:.26, frown:.20,
                            gaze:{x:-.36,y:-.04}, t:0.5 } },
      // The remaining arrows tipped out at his feet, ready to hand.
      pouring:  { preview:{ guise:"king", pose:"odr_pour",
                            browKnit:.44, eyeNarrow:.36,
                            gaze:{x:-.18,y:.58}, t:0.5 } },
      // SIGNATURE — full draw on Antinous over the lifted cup.
      drawing:  { preview:{ guise:"king", pose:"odr_draw",
                            browKnit:.62, eyeNarrow:.55, frown:.16,
                            gaze:{x:-.62,y:-.02}, t:0.5 } },
      // The release; the line is held, the string hand flown back open.
      loosing:  { preview:{ guise:"king", pose:"odr_loose",
                            browKnit:.50, eyeWide:.18, jaw:.24,
                            gaze:{x:-.64,y:-.04}, t:0.5 } },
      // The judge: he names himself and reads the charge down the hall.
      naming:   { preview:{ guise:"king", pose:"odr_naming",
                            browKnit:.72, frown:.32, jaw:.46, mouthAsym:.14,
                            gaze:{x:-.30,y:-.04}, t:0.5 } },
      // The office arrived at. Terminal on purpose — nothing re-veils him.
      reigning: { preview:{ guise:"king", pose:"odr_king",
                            browKnit:.22, browUp:.10, eyeNarrow:.12,
                            gaze:{x:.10,y:-.10}, t:0.5 } },
    },
    /* the disguise is spent once and never resumed, so the graph runs one way.
       `drawing` <-> `loosing` cycles because the shooting is repeated, and
       `naming` can drop back to `drawing` because the accusation is interrupted
       by more shooting before it finishes. */
    edges:[["concealed","stripping"],["stripping","mounting"],["mounting","pouring"],
           ["pouring","drawing"],["drawing","loosing"],["loosing","drawing"],
           ["loosing","naming"],["naming","drawing"],["naming","reigning"],
           ["drawing","naming"],["mounting","drawing"]],
  },

  // CARD SIGNATURE — REVEALED: the archer at full draw on the threshold, bow
  // arm run out level, string fist at the jaw, one long look down the shaft.
  // The single frame in which the beggar, the judge and the king are all
  // already true.
  preview:()=>({ guise:"king", pose:"odr_draw",
                 browKnit:.62, eyeNarrow:.55, frown:.16, jaw:.02,
                 gaze:{x:-.62,y:-.02}, t:0.5, status:"REVEALED", progress:.26 }),

  /** the surface at a moment — forwarded to the continuity body so divine-fx
      assets tint the flare to the body they are transforming. */
  surfaceAt(state){ return b16.surfaceAt(state); },

  /* THE render: forwarded intact to character.odysseus-b16. No geometry, no
     overpaint, no second palette — this module cannot drift out of family
     because it does not draw. */
  draw(ctx, W, H, state){
    return b16.draw(ctx, W, H, { guise:"king", ...(state || {}) });
  },
};
export default asset;
