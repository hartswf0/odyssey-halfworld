/* ============================================================
   SCENE  OD-B19-S05 — The Boar Hunt on Parnassus            (Od. 19.392–466)
   Book XIX, scene 5. ADDITIVE: creates no asset, modifies no tracked file,
   casts only modules that already exist. Shape copied from the reference scene
   scenes/OD-B16-S03.mjs, with the mature compositing helpers of its Book XIX
   sibling OD-B19-S04 (windowed plate, document sheet, foot-mark placement) and
   one new one this scene needs — a mirrored stamp, because two of the five
   modules are handed and they are handed the wrong way round for this set.

   >>> READ THIS BEFORE YOU CHAIN OD-B19-S06 OFF THIS FILE. <<<
   This scene is a DIGRESSION: it does not play in the house it is remembered
   in. `exitOccupancy` below is therefore in PARNASSUS stations and cannot be
   blocked through scenes/_plans/megaron.mjs. The megaron did not move while the
   digression ran — Od. 19.392–466 is sixty lines outside the story's own time,
   cut in between the nurse's fingers closing on the ridge and her letting the
   foot fall — so this file ALSO exports `exitOccupancyHall`, which is S04's
   hall occupancy passed through untouched. A scene that resumes in the hall
   wants that one:
       import { exitOccupancyHall as INITIAL } from "./OD-B19-S05.mjs";
   A scene that stays on the mountain wants `exitOccupancy`. Both are computed;
   neither is retyped.

   WHAT THIS SCENE IS FOR. All five modules the atlas asks for here were
   authored FOR this scene and every one of them says so in its own header
   (`scene:"OD-B19-S05"`): location.mount-parnassus-hunt holds the whole hunt in
   one frame bottom-to-top and publishes the trail as a cubic with every anchor
   read off it; ensemble.autolycuss-sons is a formation machine that walks
   track -> surround -> set -> alarm -> bind -> chant -> carry and draws NOTHING
   in the middle of its own horseshoe on purpose; creature.parnassus-boar runs
   bed -> erupt -> charge -> gore -> impact -> collapse -> carcass;
   character.young-odysseus is the shared hero rig with the beard and the cloak
   subtracted and a `mark` channel that takes a bite out of the thigh contour;
   prop.spear-and-wound-bandage is the manufacture of the mark, strike -> blood
   -> wrap -> tighten -> scar. So the scene's job is to run four state machines
   against each other on ONE clock and let the fifth (the set) change state
   under them. Nothing here is a poster of a single moment: every machine is a
   function of t, and the animal is bedded and invisible for the first third.

   THE ROOM IS OUTDOORS, SO THE PLAN IS AUTHORED HERE. There is no plan for a
   mountain and Books XX–XXIV will never come back to this one, so a SMALL LOCAL
   plan is declared at the top of this file with makePlan() and every position in
   the scene is resolved through it — the same discipline as the hall, indoors or
   out. Its stations are not invented: each one is the INVERSE of the projection
   in engine/blocking.mjs applied to an anchor the location module already
   publishes, so a body sent to `clearing_man` stands on the drawn contact floor
   and a boar sent to `lair` comes out of the drawn thicket mouth. The two
   near-bottom trail stations clamp at z=1 (the law's floor is y=.96 and the
   drawn trail runs to y=.99), which is a hundredth of the frame and the only
   place the plan and the set disagree. Stations above the law's horizon — the
   crest, the upper ledge, the outcrop — are NOT authored, because nothing in
   this scene stands there and a station that cannot be projected is a trap.

   CONTINUITY IN — inherited, translated, mostly dropped.
     import { exitOccupancy as PREV_EXIT } from "./OD-B19-S04.mjs"  ->
       { odysseus:"pillar_l", penelope:"pillar_r", melantho:"doorway_maid",
         weapons:"storeroom", eurycleia:"bench_l2", basin:"pillar_l" }
   A memory forty years old has exactly ONE body in common with the room it is
   remembered in, so the map has exactly one entry.
     · odysseus  KEPT, translated pillar_l -> trail_foot. This is the whole
       continuity claim of the scene and it is worth being explicit about: the
       body standing at the left roof-pillar with his hand on the nurse's throat
       and the boy coming up out of the valley are ONE body, and they keep one
       key. character.young-odysseus declares `youthOf:"character.odysseus-b16"`
       and is built on the same rig with the beard and the cloak subtracted; the
       guise channel is not touched anywhere in this file because there is no
       transformation in this scene — the twenty years are not a guise, they are
       a different asset that says whose youth it is. There is no cut inside the
       scene: the boy is the only Odysseus in it, start to finish.
     · penelope, eurycleia, basin, melantho, weapons  ALL DROPPED. They are in
       the megaron at midnight, twenty years and a mountain away. Carrying any of
       them would put the queen of Ithaca on a hillside in Phocis. Dropping a
       body the story left in another TIME is the same operation as dropping one
       it left in another room — and the hall's own occupancy is not lost, it is
       re-exported whole as `exitOccupancyHall`.
     · boar ADDED at `lair`, bedded in the thicket. It is not inherited from
       anywhere; it is the one body in the poem that exists only inside this
       digression, and it does not leave the clearing again.
   The first MOVES row's `from` is `trail_foot` as well, so if S04 ever stops
   ending at pillar_l the translation degrades to the same opening mark instead
   of throwing — the join is belt and braces, not a dependency.

   HANDEDNESS, AND WHY TWO THINGS ARE MIRRORED. The set is not symmetrical and
   cannot be flipped: it draws the thicket on the RIGHT (mouth at x .628), the
   glen the beat is cast out of on the LEFT, the approach trail up the middle and
   the return switchback down the left. It also publishes the contact pair
   itself — `clearing:left` is annotated "the man", `clearing:right` "the
   animal" — and in the `strike` state it draws a five-pixel charge arrow from
   the thicket mouth to `clearing:right` and a registration ring on each of the
   two marks. So the geography is decided: the animal comes out of the right and
   drives LEFT, and the man stands to its left, facing RIGHT.
     · The BOAR is drawn with `const dir = +1` hardcoded — it always faces
       screen right — so a boar charging left would be running backwards. Its
       canvas is therefore stamped with a negative x scale about its own ground
       contact point. This is safe in a way mirroring is usually not: the module
       draws no type, no numerals and no readout anywhere, so there is nothing
       in it that can come out backwards. (Same licence, same reasoning as the
       mirrored diversion overlay in OD-B19-S04.)
     · The BOY's Parnassus poses are all authored with a NEGATIVE bodyYaw, which
       turns him toward screen LEFT and brings his left leg near the camera —
       and the module's own header says that is what presents the thigh, and
       therefore the mark, to the plate. Facing him right is one flag, not a
       hand-drawn arm: figure-hero's `mirror` swaps the limb pairs properly, and
       young-odysseus resolves which thigh carries the mark through
       nearSideFor(), which reads `st.mirror` — so the bite in the contour
       crosses to the other leg by itself. `mirror` is true for every pose of
       his in this scene, which is why it is a constant and not a set.
   Gaze is passed in VIEW space (positive x = screen right) because figure-hero
   overlays an explicit `st.gaze` AFTER the mirror, so the pose's own mirrored
   gaze is discarded. He looks right at the animal all the way through the
   strike and down at his own leg when it opens.

   THE CONTACT PAIR is `clearing_man` (plan x .332, z .526) and
   `clearing_beast` (plan x .590, z .501): adjacent, never the same station, and
   the plan's own projection says how far apart that puts them — frame x .378
   and .564, which is 208 px of stage between the two marks. The boy's ink is
   about 100 px wide at this body scale and the boar's head, mirrored, reaches
   109 px to the left of its contact point, so at rest there is a hand's width
   of paper between them and the only thing that crosses it is the tusk sweep
   the `gore` pose throws — which is the contact, and which the boy is drawn
   OVER, because he is the nearer of the two by a fortieth of the room's depth.
   That occlusion is what puts the tusk in his thigh rather than beside it.

   SCALE, HONESTLY. The men are the ruler here, not taste. The ensemble sizes its
   members in ABSOLUTE pixels (s = 78..152 across the working rank, height about
   0.94 s), so its depth ladder is fixed in pixels and a scene that blits it 1:1
   onto a 760-tall stage gets men 115 px tall in the clearing. That is a real
   ladder but it is a small one, and at that size the boy's head is four dot
   cells. So the ensemble is drawn into a canvas 0.72 of the stage and blitted
   up, which multiplies every man by 1.39 without moving anybody — the layout is
   all in H-fractions, only the member sizes are absolute — and puts a grown man
   in the clearing at 160 px. K_PARN is then set so the boy stands 150 px there:
   a head shorter than the uncles, which is what the module's own scale:0.86
   asks for. The boar follows from the boy — crest 93 px, body 149 px long
   against a 150 px boy, which is a great boar and not a pony.
     WHY THE FACE IS NOT THE PLAN. At 150 px the boy's head is 20 px and the
     bite in his thigh is four. That is the numerals-as-mush failure applied to
     anatomy, and it is exactly the failure OD-B19-S04 solved for the same wound:
     the mark is carried by a PLATE, at plate size, and the body only has to
     carry the silhouette. The `mark` channel is still driven correctly on the
     body — none -> fresh -> healed — because it costs nothing and because a
     figure whose thigh is intact in the same frame as a bleeding plate is a lie.

   THE PROP IS ONE MODULE DOING TWO JOBS, IN TWO WINDOWS.
   prop.spear-and-wound-bandage is a field-surgery inspection plate: the weapon
   under registration down the left of its frame, and on the right a magnified
   callout, the thigh carrying the wound through its whole life, the linen strip
   as its own object, and a five-step ledger drawn as GEOMETRY. It honours no
   layer subset, so it is all or nothing — which means both jobs are done with
   windows.
     · `spear_01` — the weapon only. Window x .085–.480, y .085–.895, which is
       the shaft from leaf head to butt and nothing else: the vertical scale rule
       ends at x .076 and the registration brackets' arms end at x .083 and start
       again at x .487, so both are cropped out by construction rather than by
       eye. It is stamped in mode `strike` (whose lie is the most diagonal of the
       five, and which draws the motion chevrons), mirrored so the head leads
       right, and rotated about the plate's own `grip` anchor to the angle the
       beat wants — carried forward and a shade down for the lunge, driven down
       for the kill. It exists ONLY between the advance and the kill, which are
       the two poses the module authored a two-fisted grip for; the declared
       grip anchor was measured on `yod_lunge`, so that is the only pose it can
       be pinned to honestly, and `yod_kill` (both fists low on the same shaft)
       is one pose away from it. The instant the spear goes into the animal it
       stops being drawn here, because the BOAR module draws it: `impact`,
       `collapse` and `carcass` all carry `spear:1` and stand a shaft in the
       shoulder hump. That is the attachment change, and it is a real handover of
       one object between two owners rather than two spears in one frame.
     · `dressing_01` — the plate as a DOCUMENT, on its own paper ground, in the
       top-right corner where the set draws only sky. Window x .500–.980,
       y .400–.905: the thigh from the hip cut down past the kneecap, the turns,
       the knot, the linen strip standing beside it, and the five-chip ledger,
       which is the one readout in this frame that is legible BECAUSE it is
       geometry. The magnified callout above it is cropped off — at this
       destination the lens would be 90 px of ring holding a 40 px read — and so
       is the whole left column, because the spear is in the boy's hands over on
       the other side of the picture. The window is 0.713 wide to high and the
       destination is 0.160 W by 0.331 H, so the plate is never scaled off its
       own proportions.
       IT IS THE TRIGGER, TOO. Beat 1 is not a picture — "the scar triggers the
       story" is a cut. So the sheet is on the frame for the first six seconds in
       mode `scar-forming`, which is the healed seam as it is at that moment in
       the megaron, under the nurse's hand; then it leaves the frame for the
       whole climb, and comes back on the frame the tusk goes in, in mode
       `strike`, and runs forward — blood, wrap, tighten, and back to
       `scar-forming` at the end. The plate ends in the state it opened in. That
       is what a flashback is, and it is the only structure in the scene that
       says so.
       It is drawn BEFORE the bodies and before the men, on the OD-B19-S04 rule:
       wherever a document and a shoulder meet, the body wins.

   THE SET IS STATE, NOT FOUR SETS. location.mount-parnassus-hunt is cast once
   and its `state` channel is driven: `dawn` while they climb (the sun just up
   off the deep, nothing struck), `hunt` from the moment the beat is cast out of
   the glen (sightlines drawn onto the lair), `strike` when the animal comes out
   (the charge line and the two contact rings appear under the two bodies that
   are standing on them), `after` once the wound is bound (the lair stood down,
   the cross on the floor where it happened, the return route lit with its
   waymarks). Four states, one field, no second mountain.

   THE PARTY IS A FORMATION MACHINE AND IT IS COMPOSITED IN TWO DEPTH PASSES.
   ensemble.autolycuss-sons fills its own box with level-1 tone before it draws
   anybody, which is opaque, so blitting it over the set at the default keying
   threshold would erase the mountain. It is keyed at 0.84 instead: level 1
   (luminance .859) flood-clears from the border and level 2 and darker survive,
   so the field goes and the men stay — and the far band up-slope, whose jerkins
   ARE level 1, comes through as pure contour, which is the atmospheric depth the
   module's own comment asks for and could not otherwise get past the dot law.
   Its `slope` and `lair` layers are dropped (the set draws both, better, and
   under everything) and so is `foreground` — the cropped near pair at
   baseY 1.038 H are two near-black half-figures with the camera between them,
   which is a fine card and would be a wall across the bottom of this stage.
   What is left is blitted twice, `band-far` behind the animal and the boy and
   `rank`+`poles` in front of them, because the ring has men on both sides of the
   contact floor and one blit can only be on one side of it. The two passes share
   a seed and a state, so they are the same men.

   Beats (Od. 19.392–466):
     1. The scar triggers the story of young Odysseus visiting his grandfather
        Autolycus.
     2. At dawn he hunts with his uncles on Mount Parnassus.
     3. A boar bursts from dense cover and charges.
     4. Odysseus spears it but receives a deep tusk wound above the knee.
     5. The hunters bind the wound, stop the blood with a charm, and carry him
        home.
   ON BEAT 5, HONESTLY. The rig has no prone pose and inventing one is not a
   scene's business, so the carrying is drawn the way this system can draw it:
   the party goes to `carry`, which pairs its bearers front-to-back and hangs a
   litter pole between them, the set lights the return switchback (the gentle way
   down, which the module says exists because they are carrying a man who cannot
   walk), and the boy walks the first two legs of that route on his sound leg in
   `yod_bound` — standing off the hurt one, weight thrown onto the other, hand
   hanging toward the dressing. He is upright because a figure lifted off the
   floor is the one failure this whole plan exists to prevent. And the litter
   comes down EMPTY, which is not a compromise but the same rule: the `load`
   channel draws a lashed bundle on the pole, and a bundle on the pole in the
   same frame as the boy is one body drawn twice.

   Verify:  node harness/render-scene.mjs scenes/OD-B19-S05.mjs --t 12
            node harness/render-scene.mjs scenes/OD-B19-S05.mjs --t 30
            node harness/render-scene.mjs scenes/OD-B19-S05.mjs --t 47
   ============================================================ */
import { placeInstance, keyedModuleCanvas, PAPER, clamp, clamp01, lerp }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field    from "../assets/location/mount-parnassus-hunt.mjs";
import sons     from "../assets/ensemble/autolycuss-sons.mjs";
import boar     from "../assets/creature/parnassus-boar.mjs";
import boy      from "../assets/character/young-odysseus.mjs";
import kit      from "../assets/prop/spear-and-wound-bandage.mjs";

/* CONTINUITY IN — the previous scene's computed exit, imported, not asserted. */
import { exitOccupancy as PREV_EXIT } from "./OD-B19-S04.mjs";

const FIELD_ASSET = "location.mount-parnassus-hunt";
const D = 56;

/* ============================================================
   THE LOCAL PLAN. Authored here because the atlas has no plan for a mountain
   and no later book returns to it — but blocked through exactly like the hall.

   Every station is the inverse of engine/blocking.mjs project() applied to an
   anchor location.mount-parnassus-hunt already publishes:
       z = ((y_frame - .50) / .46) ^ (1/1.08)
       x = .5 + (x_frame - .5) / (.42 + .58 z)
   so plan.at(name) lands back on the drawn set to within a hundredth of the
   frame. The set anchor each one comes from is named in its comment.
   ============================================================ */
export const parnassus = makePlan({
  id:"parnassus-hunt",
  name:"The wooded flank of Mount Parnassus",
  notes:"A memory, not a room: only Book XIX plays here. Stations are the " +
        "inverse projection of location.mount-parnassus-hunt's own anchors, so " +
        "the trail a body walks is the trail the set draws. The clearing pair " +
        "clearing_man / clearing_beast is the declared contact pair and must " +
        "never be collapsed to one station — a man and an animal cross once.",
  stations:{
    // --- the approach, up the drawn trail cubic (near -> far) ---
    trail_foot:     { x:.417, z:1.000 },   // set `trail:foot`         (.417,.991)
    trail_lower:    { x:.442, z:.988 },    // set `trail:lower`        (.442,.954)
    trail_mid:      { x:.410, z:.725 },    // set `trail:mid`          (.424,.825)
    trail_lip:      { x:.409, z:.452 },    // set `trail:clearing-lip` (.438,.695)
    // --- the contact floor: the lightest ground in the set ---
    clearing_near:  { x:.437, z:.581 },    // set `clearing:near`      (.452,.756)
    clearing_man:   { x:.332, z:.526 },    // set `clearing:left`  — THE MAN
    clearing_beast: { x:.590, z:.501 },    // set `clearing:right` — THE ANIMAL
    clearing_far:   { x:.500, z:.411 },    // set `clearing:far`       (.500,.676)
    // --- the lair, and the leaf bank at its foot ---
    lair:           { x:.718, z:.288 },    // set `thicket:mouth`      (.628,.620)
    thicket_edge:   { x:.804, z:.319 },    // set `leafbank:foot`      (.684,.634)
    // --- the hollow the beat is cast out of ---
    glen:           { x:.158, z:.193 },    // set `glen:mouth`         (.318,.578)
    // --- the OTHER way down: the switchback, because he cannot walk ---
    return_head:    { x:.292, z:.535 },    // set `return:head`        (.348,.734)
    return_bend:    { x:.251, z:.719 },    // set `return:bend`        (.292,.822)
    return_foot:    { x:.082, z:1.000 },   // set `return:foot`        (.082,.994)
  },
  fixtures:[
    { id:"thicket", kind:"location", at:"lair",
      note:"dense cover — neither wind nor sun nor rain gets in, which is why " +
           "the animal is in there. No body is ever routed through it." },
    { id:"contact", kind:"note", along:["clearing_man","clearing_beast"],
      note:"the crossing. 208 px of stage between the two marks at this scale." },
  ],
});

/* --- THE CLOCK. One set of gates; every machine in the scene reads them. --- */
const TRIG   = 6;                 // beat 1: the scar on the plate, then the cut
const CLIMB0 = 3,  CLIMB1 = 10;   // up out of the valley
const CLIMB2 = 10, CLIMB3 = 15;   // the long middle leg
const CLIMB4 = 15, CLIMB5 = 19;   // onto the lip of the clearing
const CAST   = 11;                // the beat cast out of the glen -> set `hunt`
const SET    = 20;                // spears couched, the ring closed, nothing up
const ADV0   = 21, ADV1  = 25;    // the boy onto his mark
const ERUPT  = 22;                // the lair bursts -> set `strike`
const CH0    = 23, CH1   = 27;    // the run, mouth -> contact floor
const GORE   = 27;                // the tusk goes in above the knee
const BLEED  = 30;                // the dark blood; and he is still going forward
const KILL   = 33;                // the spear through the shoulder hump
const FALL   = 36;                // the forequarters pitch down
const DEAD   = 39;                // downed, the shaft standing in it
const BIND   = 40;                // the knot down over the leg
const TIGHT  = 44;                // four close turns, hauled
const CHANT  = 46;                // the black blood checked with a charm
const SCAR   = 49;                // the binding off, the seam -> set `after`
const CARRY0 = 49, CARRY1 = 53, CARRY2 = 56;   // down the switchback

const seg = (t, a, b) => clamp01((t - a) / Math.max(1e-6, b - a));

/* --- CONTINUITY IN: translate the one body that is in both, drop the rest. --- */
const HALL_TO_PARNASSUS = { pillar_l:"trail_foot" };
const INITIAL = {
  ...Object.fromEntries(Object.entries(PREV_EXIT)
    .map(([who, st]) => [who, who === "odysseus" ? HALL_TO_PARNASSUS[st] : null])
    .filter(([, st]) => st)),
  boar:"lair",
};

/* --- BLOCKING. Stations, never coordinates. -------------------------------
   Two walkers. The boy climbs the drawn trail in three legs, steps onto his
   mark, and leaves down the other side of the clearing on the switchback. The
   animal has exactly one row in its life: out of the mouth onto the floor. It
   never moves again, because it is dead. No leg of any move enters the thicket
   or crosses the lair. ------------------------------------------------------- */
const MOVES = [
  { who:"odysseus", from:"trail_foot",    to:"trail_mid",     t0:CLIMB0, t1:CLIMB1 },
  { who:"odysseus", from:"trail_mid",     to:"trail_lip",     t0:CLIMB2, t1:CLIMB3 },
  { who:"odysseus", from:"trail_lip",     to:"clearing_near", t0:CLIMB4, t1:CLIMB5 },
  { who:"odysseus", from:"clearing_near", to:"clearing_man",  t0:ADV0,   t1:ADV1   },
  /* THE WAY HOME is not the way up. Two legs of the switchback: he ends nearer
     the camera and lower than he was, which is what going down looks like. */
  { who:"odysseus", from:"clearing_man",  to:"return_head",   t0:CARRY0, t1:CARRY1 },
  { who:"odysseus", from:"return_head",   to:"return_bend",   t0:CARRY1, t1:CARRY2 },
  { who:"boar",     from:"lair",          to:"clearing_beast",t0:CH0,    t1:CH1    },
];

/* ---- THE BOX A BODY IS DRAWN IN (the OD-B21-S01 / OD-B19-S04 rule) -------
   placeInstance() hands a module a box of the STAGE's aspect. figure-hero caps
   the skeleton height so a body survives a wide box, but every width-relative
   decoration stretches with W, so every figure is drawn into the PORTRAIT box
   the atlas uses for characters, 660/880, and blitted. FIG_FLOOR is the rig's
   own floor line: figure-hero corrects the lower ankle onto H*0.90 of its box,
   whatever the pose and whatever the spec scale, so anchoring by the box's
   bottom edge would hang the body a tenth of its height above its mark. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.08;          // yod_hailed throws an arm to 2.42 rad
/* ONE body height for this mountain, times the plan's own depth falloff. At the
   clearing (p.scale .932) this puts 150 px of boy on a 760 px stage — a head
   under the 160 px uncles the ensemble draws at the same depth, which is what
   character.young-odysseus' own scale:0.86 is for. figure-hero renders
   min(H*.9, W*1.26)*0.86 = 0.774 of the box in this aspect, so the box is
   bigger than the body and the arithmetic is: 150 / 0.774 / 0.932 / 760. */
const K_PARN = 0.275;

/* THE ANIMAL'S BOX. The boar sizes itself off U = .225*min(W,H) of its box, so
   it wants a LANDSCAPE box or it clips its own head off: at ar 1.6 the drawn
   body is 0.819 of the box height long and the crest stands 0.511 of it. Crest
   93 px and body 149 px against a 150 px boy. */
const BOAR_AR = 1.60;
const BOAR_K  = 0.261;
const BOAR_PAD= 0.10;            // `rear` and `pitch` rotate about a ground pivot
/* the boar's own ground contact inside its box, per drawing mode — cx and
   groundY are read straight off drawScene(), never guessed. Mirrored, fx
   becomes 1-fx; the helper does that. */
function boarFoot(pose){
  switch (pose){
    case "bed":      return { fx:0.40, fy:0.64 };   // couch
    case "erupt":    return { fx:0.52, fy:0.72 };   // rear
    case "gore":     return { fx:0.42, fy:0.72 };   // drive
    case "carcass":  return { fx:0.42, fy:0.64 };   // downed
    default:         return { fx:0.40, fy:0.72 };   // run / struck / pitch
  }
}

/* ---- THE PARTY'S CANVAS. See header: the ensemble's member sizes are absolute
   pixels, so the only way to move its depth ladder is to change the canvas it is
   measured in. 0.721 of the stage, blitted up, multiplies every man by 1.387 and
   moves nobody. Keyed at 0.84 so its opaque level-1 field clears. */
const ENS_CW = 808, ENS_CH = 548;        // 808/548 = 1.474 = 1120/760
const ENS_THR = 0.84;
/* THE RING IS SLID, NOT RESHAPED — and this took two drafts to get right.
   The module's horseshoe is authored as an EMPTY INTERIOR: its own contact
   anchors put the boy at (.395,.800) and the boar at (.610,.796), which is
   0.038 of H below the ring centre at .762, and at those x values the arc
   itself is 0.195 of H higher up. That gap is not slack — it is exactly one
   man's height, so the far arm's FEET land on the near bodies' HEADS and the
   two never tangle. Draft 1 kept the module's centre and got men standing in
   the middle of the wooded band; draft 2 answered that by squashing radiusY to
   .125, which pulled the far arm's feet down to y .591, forty-six pixels INSIDE
   the boy's torso, and the strike frame came back as one snarl of hunter, boy,
   boar and fir with no protagonist in it. So the ring is not reshaped at all:
   radiusY stays the authored .165 and the whole ellipse is SLID UP by .086, to
   centreY .676, which is the offset that puts this set's drawn contact marks
   (.730 and .718, from `clearing:left` and `clearing:right`) at the same place
   inside the interior that the module's own anchors sit at. The far arm's feet
   come out at y .511 and the boy's head at .531 — sixteen pixels of paper, by
   construction rather than by eye. radiusX is nudged to .350 and the party is
   thinned to five men in the ring and three up-slope, because nine men, a boy,
   a boar, a mountain and a wood is more actors than a 760-pixel frame has room
   for, and the horseshoe reads as a horseshoe at five.
   WHICH PASS THE RANK GOES IN — the blocked depth decides, and it INVERTS.
   Through the cast, the closing and the break, everything the ring does happens
   BEHIND the two bodies in the middle of it: of the nine men, the only two
   whose feet fall nearer than the boy's are the ends of the horseshoe's arms,
   at frame x .164 and .776, which touch neither body — so the whole rank is
   drawn before the animal and the boy and the depth is right everywhere it can
   be seen. From the binding on, that flips: `bind` and `chant` put an inner
   crescent at cy+.048, which is NEARER than the boy standing at .730, and the
   whole point of the beat is hands on the leg — those men have to be in front
   of him or they are binding thin air. Same rule as the carried basin in
   OD-B19-S04: the blocked depth in both cases, and only the beat inverts it. */
const ENS_RING = { centreY:0.676, radiusX:0.350, count:6 };
/* AND FOR THE BINDING, THE RING RE-CENTRES ON THE LEG. Every member's face and
   spear aim at (centreX, centreY) — the module's own quarry point — so with the
   ring on the clearing's centre the two men who kneel to bind knelt facing a
   spot 122 px to the boy's right and reached into it. `bind` and `chant` are the
   only beats whose subject is a body rather than a lair, so for those two the
   centre is taken FROM THE PLAN — the boy's own blocked frame x at
   `clearing_man`, not a number typed here — and dropped 0.024 so the inner
   crescent's feet land clearly nearer the camera than his. The inner pair then
   comes out at frame x .303 and .453, one either side of a boy standing at .378,
   both turned in on him: two men on their knees at the leg. */
const WOUND_X = parnassus.at("clearing_man").x;
const ensSplit = t => t >= BIND
  ? { back:["band-far"],                front:["rank","poles"] }
  : { back:["band-far","rank","poles"], front:[] };

/* ---- THE PROP'S TWO WINDOWS (see header) ---- */
const KIT_CW = 420, KIT_CH = 560;
/* the weapon alone: the scale rule ends at x .076, the bracket arms at x .083
   and .487, so this window crops both by construction. */
const SPEAR_WIN = { x0:0.085, y0:0.085, x1:0.480, y1:0.895 };
const spU = x => (x - SPEAR_WIN.x0) / (SPEAR_WIN.x1 - SPEAR_WIN.x0);
const spV = y => (y - SPEAR_WIN.y0) / (SPEAR_WIN.y1 - SPEAR_WIN.y0);
/* the `strike` lie, and the plate's own declared grip — not measured off a render */
const SP_TIP  = { u:spU(0.105), v:spV(0.130) };
const SP_BUTT = { u:spU(0.445), v:spV(0.845) };
const SP_GRIP = { u:spU(0.255), v:spV(0.615) };
/* destination: sized so the shaft is about 1.2x the boy — a hunting spear
   against a boy of sixteen — and DELIBERATELY WIDENED, which is the one place
   this scene overrides a module's proportions and the reason is the dot lattice.
   params.shaftRatio is 0.030 of the spear's length, which is already generous
   for a real ash shaft; at 180 px of stage that is five pixels of wood, and the
   POST pass resolves five pixels into a dotted line with a blob on the end. So
   the window is stretched 1.9x across its own axis: the shaft comes out at ten
   pixels, three dot cells, which is the narrowest thing this pipeline can print
   as a solid, and the leaf head keeps a leaf's outline instead of becoming one
   dot. The length is held by dropping SP_DH to compensate, so it is a fatter
   spear and not a longer one. Same licence, same accounting as the 1.3x bronze
   basin in OD-B19-S04: called out at its own scale rather than lost, and only as
   far as it has to be. */
const SP_WIDEN = 1.9;
const SP_DH = 0.222;                                     // of stage H
const SP_DW = SP_DH * ((SPEAR_WIN.x1 - SPEAR_WIN.x0) * KIT_CW)
                    / ((SPEAR_WIN.y1 - SPEAR_WIN.y0) * KIT_CH)
                    * (760 / 1120) * SP_WIDEN;
/* the rotation that puts the butt->tip axis at a declared screen angle, given
   the destination box and the mirror. Angles are canvas angles: 0 = right,
   positive = down. */
function spearRot(deg){
  const dw = SP_DW * 1120, dh = SP_DH * 760;
  const a0 = Math.atan2((SP_TIP.v - SP_BUTT.v) * dh,
                        -(SP_TIP.u - SP_BUTT.u) * dw);   // mirrored: negate x
  return deg * Math.PI / 180 - a0;
}
const SP_ANG_LUNGE = spearRot(  14);   // carried forward, a shade down
const SP_ANG_KILL  = spearRot(  44);   // driven down into the shoulder hump
/* where the plate's grip has to land: the boy's own declared spearGrip anchor
   (.17,.51 of his box), mirrored to .83, expressed off his live blocked box. */
const BOY_GRIP = { ax:1 - 0.17, ay:0.51 };

/* the document sheet: thigh + turns + knot + strip + the five-chip ledger.
   Window 0.713 wide to high; destination 0.160 W x 0.331 H, so it is never
   scaled off its own proportions. Top right, where the set draws only sky. */
const DRESS_WIN = { x0:0.500, y0:0.400, x1:0.980, y1:0.905 };
const DRESS_DST = { x0:0.790, y0:0.078, x1:0.950, y1:0.409 };

/* ============================================================
   COMPOSITING HELPERS. Place, never redraw.
   ============================================================ */
/* stamp a module into a box of a chosen aspect, anchored by a point INSIDE the
   box, optionally mirrored about that point. `sig` is required: keyedModuleCanvas
   caches on pose/band/mode/t only, so without it a change of gaze, brow or
   layer subset returns the previous frame's canvas. */
function stamp(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895,
                                    flip = false }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.save();
  offctx.translate(x * W, y * H);
  if (flip) offctx.scale(-1, 1);
  offctx.drawImage(cv, -(pad * w + fx * w), -(pad * h + fy * h));
  offctx.restore();
}
/* stamp one declared WINDOW of a whole-frame drawing, keyed, pinned by a point
   inside the window and rotated about that pin. This is how a plate's spear
   becomes an object in somebody's hands without a line of it being redrawn. */
function stampWin(offctx, W, H, mod, { cw, ch, win, dw, dh, pin, x, y,
                                       rot = 0, flip = false, state, sig,
                                       thr = 0.895 }){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  const sx = win.x0 * cw, sy = win.y0 * ch;
  const sw = (win.x1 - win.x0) * cw, sh = (win.y1 - win.y0) * ch;
  const pw = dw * W, ph = dh * H;
  offctx.save();
  offctx.translate(x * W, y * H);
  if (rot) offctx.rotate(rot);
  if (flip) offctx.scale(-1, 1);
  offctx.drawImage(cv, sx, sy, sw, sh, -pin.u * pw, -pin.v * ph, pw, ph);
  offctx.restore();
}
/* SHEET — a window laid down on its OWN PAPER instead of keyed into the world.
   A record is a document and gets a document's ground, so every level on it
   reads as it does on the module's own card instead of fighting a hillside that
   halftones to the same density. (Introduced in OD-B19-S03, used in S04.) */
function sheet(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  const dx = dst.x0 * W, dy = dst.y0 * H;
  const dw = (dst.x1 - dst.x0) * W, dh = (dst.y1 - dst.y0) * H;
  offctx.save(); offctx.fillStyle = PAPER; offctx.fillRect(dx, dy, dw, dh);
  offctx.restore();
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, 0.895);
  offctx.drawImage(cv, win.x0 * cw, win.y0 * ch,
                   (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
                   dx, dy, dw, dh);
}
/* one full-frame blit of the party, at one layer subset. Two calls per frame,
   one on each side of the bodies in the middle of the ring; either can be empty. */
function party(offctx, W, H, state, layers, tag){
  if (!layers.length) return;
  const cv = keyedModuleCanvas(sons, ENS_CW, ENS_CH, { ...state, layers },
                               tag + "|" + layers.join(","), ENS_THR);
  offctx.drawImage(cv, 0, 0, ENS_CW, ENS_CH, 0, 0, W, H);
}

/* ============================================================
   THE STATE MACHINES, as functions of one t.
   ============================================================ */
/* the set: dawn -> hunt -> strike -> after. One field, four states. */
/* `after` arrives at DEAD, not at SCAR: the state is "the lair stood down, the
   mark on the floor, the return route lit", and all three of those are true the
   moment the animal is down. Holding `strike` through the binding would keep the
   charge arrow drawn across a clearing where the charge is ten seconds over. */
const fieldMode = t => t >= DEAD  ? "after"
                     : t >= ERUPT ? "strike"
                     : t >= CAST  ? "hunt" : "dawn";

/* the animal: bedded and invisible, then out, across, over, and down. */
const boarPose = t => t >= DEAD  ? "carcass"
                    : t >= FALL  ? "collapse"
                    : t >= KILL  ? "impact"
                    : t >= GORE  ? "gore"
                    : t >= CH0   ? "charge"
                    : t >= ERUPT ? "erupt" : "bed";

/* the marker on the body: an unmarked boy, the rip, the seam. */
const boyMark = t => t >= SCAR ? "healed" : t >= GORE ? "fresh" : "none";

/* the plate: the seam it starts from, then the whole manufacture of it. */
const kitMode = t => t <  TRIG  ? "scar-forming"
                   : t >= SCAR  ? "scar-forming"
                   : t >= TIGHT ? "tighten"
                   : t >= BIND  ? "wrap"
                   : t >= BLEED ? "blood" : "strike";
const kitStep = m => m === "scar-forming" ? "SCARRED" : m === "tighten" ? "BOUND"
                   : m === "wrap" ? "WRAPPED" : m === "blood" ? "BLEEDING" : "STRIKE";

/* the party: seven formations on the same clock, with the cry running along the
   line at the two moments a line of men shouts — the slot found, and the break. */
function sonsState(t){
  const base = { showSlope:false, showLair:false, foreground:0,
                 spread:1.0, wave:1.4, waveSpread:0.15, load:0.10, ...ENS_RING };
  let s;
  if (t < CAST)        s = { formation:"track",    density:0.62, attention:0.34,
                             effort:0.20, status:"CASTING" };
  else if (t < 15)     s = { formation:"track",    density:0.66, attention:0.86,
                             effort:0.46, wave:seg(t, CAST, 15), waveSpread:0.13,
                             status:"ON THE SLOT" };
  else if (t < SET)    s = { formation:"surround", density:0.62, attention:0.88,
                             effort:0.50, openFront:0.30, status:"CLOSING" };
  else if (t < ERUPT)  s = { formation:"surround", density:0.62, attention:0.98,
                             effort:0.78, openFront:0.26, spread:0.92,
                             status:"SET" };
  else if (t < BIND)   s = { formation:"alarm",    density:0.62, attention:1.0,
                             effort:1.0, openFront:0.30, spread:1.08,
                             wave:seg(t, ERUPT, GORE), waveSpread:0.20,
                             status:"BROKEN" };
  else if (t < CHANT)  s = { formation:"bind",     density:0.62, attention:0.95,
                             effort:0.62, spread:0.96, status:"BINDING",
                             centreX:WOUND_X, centreY:0.700 };
  else if (t < CARRY0) s = { formation:"chant",    density:0.62, attention:0.90,
                             effort:0.40, status:"CHANTING",
                             centreX:WOUND_X, centreY:0.700 };
  /* THE FILE DOWN, AND WHY THE LITTER GOES EMPTY. `carry` pairs its bearers
     front-to-back and hangs a pole between each pair, and `load` puts a lashed
     bundle on it. A loaded litter in the same frame as the boy is the SAME BODY
     DRAWN TWICE — the collage failure Book XVI+ exists to end, and it is no more
     defensible than two Penelopes in one hall. So load stays at a tenth: the
     poles come down the mountain bare, and the boy walks the first legs of the
     switchback himself, on his sound leg, in the middle of them. The count goes
     up here and the far band goes off: the pole is drawn between two bearers, and
     `bearer` is every third member, so a thin file puts its two bearers a third
     of the frame apart and the pole becomes a bar across the picture. Nine men
     brings them within 0.30 W of each other, and with no bundle on it the pole is
     five pixels of wood instead of a slab. */
  else                 s = { formation:"carry",    density:0.85, attention:0.55,
                             effort:0.45, load:0.12, count:9, bands:1,
                             status:"CARRYING" };
  return { ...base, ...s, t:0.5, progress:clamp01(0.06 + 0.90 * (t / D)) };
}

export const scene = {
  id:"OD-B19-S05",
  title:"The Boar Hunt on Parnassus",
  book:19,
  plan:"parnassus-hunt",
  duration:D,
  beats:[
    "The scar triggers the story of young Odysseus visiting his grandfather Autolycus.",
    "At dawn he hunts with his uncles on Mount Parnassus.",
    "A boar bursts from dense cover and charges.",
    "Odysseus spears it but receives a deep tusk wound above the knee.",
    "The hunters bind the wound, stop the blood with a charm, and carry him home.",
  ],
  exitState:"Full morning on the wooded flank of Parnassus, the lair stood down and the hunt over. The great boar lies dead on the contact floor of the clearing at `clearing_beast`, tipped onto its side with the hunting spear still standing in its right shoulder hump and the tusks turned up — it came out of the thicket mouth once, crossed the floor once, and has not moved since. The thicket above and right of the clearing is empty for the first time in the poem, and the cross on the ground at `clearing_man` marks where the two of them crossed. Young Odysseus is on the return switchback at `return_bend`, two legs down the gentle way, standing off his hurt leg with the linen bound and hauled tight over the thigh above the right knee and the black blood checked with a charm: the wound is closed, the binding is on it, and the seam it leaves is now permanent — this is the mark, and from here it is continuity for the rest of the poem. Autolycus's sons are in file around him, bringing him down off the mountain to Autolycus's house, which is off-frame below the bottom edge, with the litter poles carried empty between the bearers because he is still on his feet. Nobody is left in the clearing and nobody is left at the lair. NOTE FOR THE NEXT SCENE: this is a digression, not a room the story lives in. The megaron did not move while it ran — Odysseus still holds the left roof-pillar with his hand on the old nurse's throat, Penelope still holds the right one turned away, the basin is still tipped over on the flags, Melantho is still behind the women's door and the sixteen pieces of armour are still in the storeroom. That state is re-exported whole as `exitOccupancyHall`; a scene resuming in the hall must open from it and not from the Parnassus occupancy below.",
  exitOccupancy:occupancyAt(parnassus, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:1.0}, scale:1.0, state:"dawn" },
    { asset:"prop.spear-and-wound-bandage", instance:"dressing_01",
      anchor:{x:.87,y:.41}, scale:.16, state:"scar-forming" },
    { asset:"ensemble.autolycuss-sons", instance:"sons",
      anchor:{x:.50,y:1.0}, scale:1.0, state:"track" },
    { asset:"creature.parnassus-boar", instance:"boar",
      anchor:{x:.72,y:.62}, scale:.21, state:"bed" },
    { asset:"character.young-odysseus", instance:"odysseus",
      anchor:{x:.42,y:.96}, scale:.33, band:"threeq", pose:"walk_neutral" },
    { asset:"prop.spear-and-wound-bandage", instance:"spear_01",
      anchor:{x:.42,y:.60}, scale:.06, state:"strike" },
  ],

  timeline:[
    /* beat 1 — the scar in the megaron triggers the story */
    { op:"prop.state", target:"dressing_01", at: 0.0,   args:{ mode:"scar-forming" } },
    { op:"actor.pose", target:"odysseus",    at: 0.0,   args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",    at: 0.0,   args:{ gaze:{ x:.22, y:-.10 } } },
    { op:"actor.hide", target:"dressing_01", at:TRIG,   args:{} },
    /* beat 2 — at dawn he hunts with his uncles */
    { op:"actor.pose", target:"odysseus",    at:CLIMB0, args:{ pose:"walk_neutral" } },
    { op:"fx.play",    target:"sons",        at:CAST,   args:{ dir:"cast" } },
    { op:"actor.gaze", target:"odysseus",    at:CAST,   args:{ gaze:{ x:.40, y:-.06 } } },
    { op:"actor.pose", target:"odysseus",    at:CLIMB5, args:{ pose:"yod_boy" } },
    { op:"actor.gaze", target:"odysseus",    at:CLIMB5, args:{ gaze:{ x:.46, y:-.04 } } },
    /* beat 3 — a boar bursts from dense cover and charges */
    { op:"prop.state", target:"boar",        at:ERUPT,  args:{ mode:"erupt" } },
    { op:"actor.pose", target:"odysseus",    at:ADV0,   args:{ pose:"yod_lunge" } },
    { op:"actor.gaze", target:"odysseus",    at:ADV0,   args:{ gaze:{ x:.52, y:-.06 } } },
    { op:"prop.state", target:"boar",        at:CH0,    args:{ mode:"charge" } },
    /* beat 4 — he spears it, and takes the tusk above the knee */
    { op:"prop.state", target:"boar",        at:GORE,   args:{ mode:"gore" } },
    { op:"actor.pose", target:"odysseus",    at:GORE,   args:{ pose:"yod_gored" } },
    { op:"actor.gaze", target:"odysseus",    at:GORE,   args:{ gaze:{ x:.30, y:.46 } } },
    { op:"prop.state", target:"dressing_01", at:GORE,   args:{ mode:"strike" } },
    { op:"actor.pose", target:"odysseus",    at:BLEED,  args:{ pose:"yod_lunge" } },
    { op:"actor.gaze", target:"odysseus",    at:BLEED,  args:{ gaze:{ x:.52, y:-.06 } } },
    { op:"prop.state", target:"dressing_01", at:BLEED,  args:{ mode:"blood" } },
    { op:"actor.pose", target:"odysseus",    at:KILL,   args:{ pose:"yod_kill" } },
    { op:"actor.gaze", target:"odysseus",    at:KILL,   args:{ gaze:{ x:.44, y:.34 } } },
    { op:"prop.state", target:"boar",        at:KILL,   args:{ mode:"impact" } },
    { op:"actor.hide", target:"spear_01",    at:KILL,   args:{} },
    { op:"prop.state", target:"boar",        at:FALL,   args:{ mode:"collapse" } },
    { op:"prop.state", target:"boar",        at:DEAD,   args:{ mode:"carcass" } },
    /* beat 5 — they bind it, sing the blood shut, and carry him down */
    { op:"actor.pose", target:"odysseus",    at:BIND,   args:{ pose:"yod_bound" } },
    { op:"actor.gaze", target:"odysseus",    at:BIND,   args:{ gaze:{ x:.26, y:.30 } } },
    { op:"prop.state", target:"dressing_01", at:BIND,   args:{ mode:"wrap" } },
    { op:"prop.state", target:"dressing_01", at:TIGHT,  args:{ mode:"tighten" } },
    { op:"actor.gaze", target:"odysseus",    at:CHANT,  args:{ gaze:{ x:.10, y:.26 } } },
    { op:"prop.state", target:"dressing_01", at:SCAR,   args:{ mode:"scar-forming" } },
    { op:"actor.gaze", target:"odysseus",    at:SCAR,   args:{ gaze:{ x:-.30, y:.14 } } },
    { op:"timeline.capture", target:"OD-B19-S05", at:54.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st   = stateAt(scene, t);
    const blk  = blockingAt(parnassus, MOVES, t, INITIAL);
    const brth = 0.35 + 0.30 * Math.sin(t * 0.58);      // deterministic idle
    const mode = fieldMode(t);

    /* 1. THE MOUNTAIN. Cast once, state driven; it paints the field and
       everything else keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:1.0}, scale:1.0,
      state:{ state:mode, beatLit: mode === "hunt" || mode === "strike",
              t:brth,
              status: mode === "after" ? "THE MARK" : mode === "strike" ? "HE COMES OUT"
                    : mode === "hunt" ? "ON THE SLOT" : "FIRST LIGHT",
              progress: clamp01(0.10 + 0.84 * (t / D)) },
    });

    /* 2. THE PLATE, as a document on its own paper in the sky corner. It is the
       TRIGGER for six seconds in the state the seam is in twenty years later,
       then it leaves the frame for the whole climb, then it comes back on the
       frame the tusk goes in and runs the wound forward to the same state it
       started in. Drawn before the bodies: where a document and a shoulder meet,
       the body wins. */
    const km = kitMode(t);
    if (t < TRIG || t >= GORE){
      const trigger = t < TRIG;
      sheet(offctx, W, H, kit, KIT_CW, KIT_CH, DRESS_WIN, DRESS_DST,
            { mode:km, turns: km === "tighten" ? 4 : 3,
              t: clamp01(0.10 + 0.80 * (t / D)),
              status: trigger ? "SCARRED" : kitStep(km),
              progress: trigger ? 1.0
                      : clamp01(0.18 + 0.80 * seg(t, GORE, SCAR + 4)) },
            `kit|dress|${km}|${trigger ? "trig" : "run"}|${Math.round(t / 3)}`);
    }

    /* 3. THE PARTY, back pass. Up to the binding that is the WHOLE party — the
       far band up-slope (level-1 jerkins, so it comes through as pure contour:
       the atmospheric depth the module asks for and could not get past the dot
       law) and the working ring closed round the contact floor. From the binding
       on it is the far band alone; see ensSplit(). */
    const ss  = sonsState(t);
    const sig = `sons|${ss.formation}|${Math.round((ss.wave ?? 1.4) * 20)}`
              + `|${Math.round(ss.effort * 20)}|${Math.round(ss.spread * 20)}`;
    const spl = ensSplit(t);
    party(offctx, W, H, ss, spl.back, sig);

    /* 4. THE ANIMAL. Mirrored, because it is hardcoded to face screen right and
       everything it does here it does leftward — out of the mouth at x .628 and
       down onto the floor at x .564. Bedded, it is drawn with its own thicket
       cover over it, in the thicket the set has already drawn: the lair is one
       place twice, not two places. Drawn BEFORE the boy because it is farther by
       a fortieth of the depth, which is what puts his body over the tusk sweep
       when the sweep lands. */
    {
      const p  = blk.boar;
      const bp = boarPose(t);
      const ft = boarFoot(bp);
      stamp(offctx, W, H, boar, {
        x:p.x, y:p.y, hFrac:BOAR_K * p.scale, ar:BOAR_AR,
        fx:1 - ft.fx, fy:ft.fy, pad:BOAR_PAD, flip:true,
        state:{
          pose:bp, t: bp === "bed" ? 0.0 : bp === "carcass" ? 1.0 : brth,
          status: bp === "carcass" ? "DOWN" : bp === "collapse" ? "PITCHING"
                : bp === "impact"  ? "THE SHOULDER HUMP"
                : bp === "gore"    ? "THE TUSK GOES IN"
                : bp === "charge"  ? "COMING" : bp === "erupt" ? "THE LAIR BURSTS"
                : "BEDDED",
          progress: clamp01(0.05 + 0.90 * (t / D)),
        },
        sig:`boar|${bp}`,
      });
    }

    /* 5. THE BOY. One body all scene, mirrored so he faces the animal — which
       also crosses the mark to the thigh the camera can see, because
       young-odysseus resolves the near leg through nearSideFor(st.mirror)
       rather than off a guess. The face is not the plan at this size (see
       header); the performance is in the pose, the mark and the walk. */
    const p  = blk.odysseus;
    const s  = st.odysseus || {};
    const climbing = p.moving && t < CLIMB5;
    const pose = climbing ? "walk_neutral" : (s.pose || "yod_boy");
    const gaze = s.gaze || { x:.30, y:.02 };
    const bh   = K_PARN * p.scale;
    {
      const going  = t >= CARRY0;
      const struck = t >= GORE && t < BLEED;
      const killing= t >= KILL && t < BIND;
      stamp(offctx, W, H, boy, {
        x:p.x, y:p.y, hFrac:bh, ar:FIG_AR, fx:0.5, fy:FIG_FLOOR, pad:FIG_PAD,
        state:{
          t: climbing ? (t * 0.42) % 4 : brth,
          band:"threeq", pose, mirror:true, gaze, mark:boyMark(t),
          browUp:   struck ? .86 : going ? .16 : .12,
          browKnit: killing ? .70 : struck ? .30 : t >= ADV0 ? .52 : .10,
          eyeWide:  struck ? .54 : 0,
          eyeNarrow:killing ? .24 : .08,
          frown:    struck ? .34 : killing ? .42 : going ? .12 : 0,
          jaw:      struck ? .56 : killing ? .44 : t >= ADV0 ? .26 : 0,
          smile:    t < CLIMB0 ? .14 : 0,
          status:   going   ? "CARRIED DOWN"
                  : t >= SCAR ? "THE MARK"
                  : t >= BIND ? "BOUND"
                  : killing ? "KILLING"
                  : t >= BLEED ? "UNFLINCHING"
                  : struck  ? "GORED"
                  : t >= ADV0 ? "FEARLESS"
                  : climbing ? "THE CLIMB" : "UNMARKED",
          progress: clamp01(0.08 + 0.88 * (t / D)),
        },
        sig:`yod|${pose}|${boyMark(t)}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
           +`|${struck?1:0}|${killing?1:0}|${going?1:0}|${climbing?Math.round(t*4):0}`,
      });
    }

    /* 6. THE SPEAR, windowed out of the plate and pinned to his own declared
       grip anchor off his live blocked box — never a guessed offset. It exists
       only between the advance and the kill, and at the kill it stops being
       drawn here because the boar module starts drawing it standing in the
       shoulder hump. One object, two owners, one handover. */
    if (t >= ADV1 && t < KILL){
      const w = bh * H * FIG_AR;
      const gx = p.x + (BOY_GRIP.ax - 0.5) * (w / W);
      const gy = p.y + (BOY_GRIP.ay - FIG_FLOOR) * bh;
      stampWin(offctx, W, H, kit, {
        cw:KIT_CW, ch:KIT_CH, win:SPEAR_WIN, dw:SP_DW * p.scale, dh:SP_DH * p.scale,
        pin:SP_GRIP, x:gx, y:gy, flip:true,
        rot: pose === "yod_kill" ? SP_ANG_KILL : SP_ANG_LUNGE,
        state:{ mode:"strike", t:0.4, status:"STRIKE", progress:.25 },
        sig:"kit|spear|strike",
      });
    }

    /* 7. THE PARTY, front pass — empty until the binding, and from then on it is
       the working knot: the inner crescent down over the leg at cy+.048, nearer
       the camera than the boy standing at .730, and at the end the file going
       down the switchback with a loaded pole between the bearers. Same seed and
       same state as the back pass, so these are the same men. */
    party(offctx, W, H, ss, spl.front, sig);
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;

/* THE FRAME ROOM, re-exported whole. The digression takes sixty lines and no
   time: nothing in the megaron moved while it ran. A scene that resumes in the
   hall must open from THIS, not from the Parnassus occupancy above — see the
   header. Passed through untouched, so it stays computed all the way back to
   OD-B19-S01 and nothing on this chain is ever retyped. */
export const exitOccupancyHall = PREV_EXIT;
