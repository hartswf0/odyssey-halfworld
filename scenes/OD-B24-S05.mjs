/* ============================================================
   SCENE  OD-B24-S05 — Laertes Is Restored
   Book XXIV, scene 5 of the book. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from the
   scene immediately before this one, OD-B24-S04.

   WHERE — AND THE ONE ROOM CHANGE IN THIS RUN OF SCENES. S01/S03/S04 all played
   outdoors on Laertes's ground. This one goes INSIDE the steading house: the
   building that S04's set draws from outside on its cut terrace is
   location.farmhouse-feast seen from within. So this is the case brief section F
   is written for — the room changes, every station name changes with it, and the
   inherited occupancy has to be TRANSLATED rather than carried. The map is
   declared below (ORCHARD_TO_HOUSE) and nothing is guessed: each orchard station
   is named to the farmhouse station that is the same PLACE or the same JOB.

   THE PLAN IS THE SET'S OWN, IMPORTED, NOT RE-AUTHORED. location.farmhouse-feast
   authors its plan in its own file — `export const farmhouse = makePlan({...})`
   — and then DERIVES every anchor it paints from it. The brief's instruction for
   a room with no scenes/_plans/ file is to author a small local plan and block
   through it; here a better one already exists, built by the module that draws
   the walls, so this scene imports it instead of writing a second one that could
   drift. The tub, the three boards, the stools, the yard door, the spear block
   and the lookout slit are all drawn AT plan stations, which is why a body put
   on `seat_e` stands at the east board and not somewhere near it.

   AND THIS ROOM SHARES THE ENGINE'S OWN PROJECTION. Unlike S03/S04 — where the
   orchard's 13:1 depth ladder had to be restated because project() bottoms out
   at y .5288 — the farmhouse is built on README §5 exactly: x = .5+(x-.5)(.42+
   .58z), y = .50+.46 z^1.08. So plan.at() IS the set's own ground, and there is
   no local ground model in this file at all: blk.x, blk.y and blk.scale are used
   raw. Not one figure coordinate here is hand-tuned.

   THE ROOM IS STATE, NOT THREE ROOMS. bath -> dressing -> table on one clock:
   the tub fills and steams, then drains while the chest opens and the fresh
   mantle comes down off its peg, then the three boards are laid and the stools
   drawn in. Same walls, same door, same beams. (Brief section D.)

   ONE BODY FOR THE OLD MAN TOO. Laertes is not cut from `character.laertes` to
   `character.laertes-restored` at the moment Athena touches him.
   `character.laertes-restored` carries a `restore` channel (0 = the stooped
   orchard body of S03/S04, 1 = the god's work finished) that interpolates spine,
   stature, head carriage and chest under whatever pose is held, and this scene
   ramps it 0 -> 1 across R0..R1 while he holds ONE gesture — arms out, being
   anointed — so the audience reads one man filling out, not a substitution.
   divine_fx.athenas-restoration runs on the SAME u, aligned to the live figure
   box, exactly the way OD-B16-S03 drives the guise ramp. Odysseus, by contrast,
   holds `guise:"restored"` from the first frame to the last: Book 24 has no
   disguise in it and there is no discontinuity for a flare to cover.

   THE SONS ARE A BLITTED PLATE, RESHAPED TO THIS ROOM, AND THAT IS THE ONE REAL
   TRAP IN THE FILE. ensemble.doliuss-sons is a whole-frame drawing that sizes
   its members in ABSOLUTE source pixels (186 back .. 262 near) while spacing
   them as fractions of its sheet, so its scale is a BLIT RATIO, not a scale
   argument — placeInstance cannot size it. Two things follow:
     · The blit ratio is chosen so a son's drawn height MATCHES what this room
       paints a man at on the floor line his feet land on (see SONS_K): at 1:1 a
       son is ~70% of a principal at the same depth and reads as standing behind
       the wall he is in front of.
     · The crescent is RESHAPED through the module's own exported params
       (centreX/radiusX/centreY/radiusY) before it is blitted, because the stock
       greet-arc is authored for open yard: at the ratio that fixes the scale it
       throws its two near horns to frame x .065 and .935, and it throws its
       crown down to frame y .81 — the first is INSIDE the side walls (the floor
       at that depth only runs .117..883) and the second stands men in the middle
       of the boards. Narrowed to radiusX .20 / radiusY .05 about centreY .62 the
       whole family stands on painted floor between the yard door and the
       tables, under a roof their raised arms do not go through.
     · And FOUR of the six, through the module's own `density` control. At six
       the crescent's two horns bunch — adjacent members land 26 plan-thousandths
       apart with bodies twice that wide — and a farm hall is not a yard: six
       hailing men plus three principals printed as one continuous band of ink
       across the middle of the frame. The other two are in the exitState, where
       they belong; `density` exists for exactly this.
     · And it is keyed at thr .999, not the default .895. The sons are near-paper
       tunics and pale skin with ink spent only on hair, hafts and belts; at the
       default threshold the border flood walks straight through their bodies and
       what survives is a scatter of black marks with no men under them. Nothing
       of the ensemble's own yard is drawn here (`showYard:false`), so there is
       no background to key OUT — see OD-B24-S02, which hit this first.
     · `showDropped:false`. Indoors the module's dropped-tool branch lays a haft
       across the floor 0.61·s to the side of each man, which put a hoe under
       Laertes's feet at the east board. They leave the tools at the door.

   CONTACT PAIR, USED AS A PAIR. XXIV.397-8 is a touch — Dolius runs at the king,
   takes him by the wrist and kisses the hand — so it is played on the set's own
   authored pair, `greet_l` / `greet_r`, 114 stage px apart. Put both men on one
   station and they resolve to identical coordinates and print as one blot.
   Dolius crosses to greet_l; Odysseus comes off `centre` to greet_r to meet him.

   THE THREE COMPANIONS ARE INHERITED BUT NOT DRAWN, same as S04. S04 hands over
   Telemachus, Eumaeus and Philoetius getting the meal ready; they are translated
   into this room at the jobs they are doing (the centre board, the cook hearth,
   the cauldron), carried through INITIAL and handed on by exitOccupancy
   untouched. They are not CAST: three more foreground bodies on the cook side
   would bury the two things this scene is — an old man getting his stature back,
   and a servant recognizing a dead king — under a crowd, and the room already
   carries the sons in the middle distance.

   TONE. The set's own tables are light (ceiling 1, far wall 1, floor 2, lane 1)
   and nothing here darkens them: the sons are light planes with black contour,
   both principals wear mid-grey tunics over bare shins, and Dolius's bald crown
   renders in skin, which makes the lightest plane in the frame the head of the
   man the scene turns on. ZERO hand-drawn ctx overpaint on any figure in this
   file. The rig does all of it.

   Beats (Od. 24.365-412):
     1. Laertes is bathed and anointed inside the farmhouse.
     2. Athena makes him taller and stronger, restoring royal presence.
     3. Dolius and his sons return from the fields, recognize Odysseus, and join
        the feast.
     4. The reunited household eats while rumors of the massacre spread through
        town.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S05.mjs --t 19  (the god's work)
            node harness/render-scene.mjs scenes/OD-B24-S05.mjs --t 70  (the hand kissed)
            node harness/render-scene.mjs scenes/OD-B24-S05.mjs --t 94  (the household at meat)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { farmhouse } from "../assets/location/farmhouse-feast.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import laertes     from "../assets/character/laertes-restored.mjs";
import dolius      from "../assets/character/dolius.mjs";
import sons        from "../assets/ensemble/doliuss-sons.mjs";
import restoration from "../assets/divine_fx/athenas-restoration.mjs";

const FIELD_ASSET = "location.farmhouse-feast";
const D = 100;

/* one height for every standing body in this house, times the plan's own
   falloff. .56 puts a man at the centre board at about 400 stage px — a face big
   enough to carry the two recognitions this scene is made of, and still clear of
   the low farm roof at every station a body stands on. It is bounded ABOVE by
   the bathing bay: the ceiling there is at y .192 and `laer_r_anointed` carries
   rootScale 1.10 with both arms lifted, so at .62 the old man's hands went up
   through the rafters at the exact moment the god is filling out his limbs.

   AND EVERY FIGURE IS PUT DOWN ON THE FLOOR BY HAND-OFF, NOT BY EYE.
   placeInstance() anchors a module's BOX bottom, and figure-hero stands the rig
   inside that box with its feet at about .895 of it — so a figure anchored at a
   station's ground y hangs ~10% of its own height in the air, which at this size
   is 40 stage px of daylight under a man's sandals. FOOT_LIFT pushes the box
   down by exactly that fraction of the drawn height, so the SOLE lands on the
   station instead of the box. Measured off the first draft, where all three men
   floated. */
const MAN = 0.42;
const FOOT_LIFT = 0.105;
const stand = p => ({ x:p.x, y:p.y + FOOT_LIFT * MAN * p.scale });

/* ==========================================================================
   CONTINUITY IN — the room changes, so the occupancy is TRANSLATED.
   OD-B24-S04 ends out on the labour plot deep in the orchard. Every station it
   hands over belongs to that plan and to no other, and blockingAt() would throw
   on all five of them here — correctly. The map below is explicit and each entry
   is a claim about the SAME PLACE or the SAME JOB, not a convenience:

     labor_r  -> bath_stand   Laertes. Brought up from the plot he was digging
                              and set down in the bathing bay, where the Sicilian
                              woman washes and anoints him. `bath` itself is the
                              TUB on its plinth, a fixture; `bath_stand` is the
                              floor the bath is attended from, and a body put on
                              the tub stands in it.
     labor_l  -> centre       Odysseus. He came in off the plot at his father's
                              shoulder and is standing in the middle of his
                              grandfather's house watching a god work.
     house_door -> board_c    Telemachus. He was at the farmhouse door getting
                              the meal ready; inside, that job is the centre
                              board, cutting the meat up (XXIV.364).
     outbuilding -> hearth    Eumaeus, at the cook fire.
     tool_shed   -> pot       Philoetius, at the cauldron on its tripod.

   Nobody is DROPPED — every body S04 hands over is inside this building or its
   fittings, and dropping a man who walked in through the door would be a lie.
   Three of them are simply not cast; see the header.
   ========================================================================== */
import { exitOccupancy as PREV_EXIT } from "./OD-B24-S04.mjs";

const ORCHARD_TO_HOUSE = {
  labor_r:     "bath_stand",
  labor_l:     "centre",
  house_door:  "board_c",
  outbuilding: "hearth",
  tool_shed:   "pot",
};
const INITIAL = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, st]) => [who, ORCHARD_TO_HOUSE[st]])
    .filter(([, st]) => st));

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Three journeys and nothing else moves.

   · LAERTES walks the length of his own restoration. bath_stand -> dress_stand
     (the chest is open and the fresh mantle is down off its peg) -> seat_e, his
     place at the east board. He holds ONE gesture through the god's work and
     travels only after it: the stature has to arrive under a still body or it
     reads as a man walking into shot at a different size.
   · DOLIUS comes in the yard door — the opening the whole back half of Book 24
     comes through — halts one step inside it at `threshold`, crosses to
     `greet_l` for the hand, and finally takes his place at the west board.
   · ODYSSEUS comes off `centre` to `greet_r`, the other half of the pair, to be
     met — AND STAYS THERE. Drafted with the two of them going on to `seat_c`
     and `seat_w` for the last beat, both men ended up standing in their own
     boards: the room paints a laden table AND a stool at every seat station, so
     a body put on one has a trestle across its shins and a stool between its
     feet, and at this figure size the legs simply disappeared into the fittings.
     They hold the open floor of the contact pair instead, which is also what
     XXIV.409 says — from the moment he has kissed the hand Dolius does not leave
     the master's side. Laertes keeps `seat_e`, so the meal has a man at a board;
     the other two stand at it.

   Dolius has no entry in INITIAL — he is in the vine rows when this starts — so
   blockingAt() resolves him to the `from` of his first move, the yard door, and
   stage() simply does not draw him before DOL_IN. */
const MOVES = [
  { who:"laertes",  from:"bath_stand", to:"dress_stand", t0:30, t1:36 },
  { who:"laertes",  from:"dress_stand", to:"seat_e",     t0:46, t1:52 },
  { who:"dolius",   from:"door_yard",  to:"threshold",   t0:52, t1:57 },
  { who:"odysseus", from:"centre",     to:"greet_r",     t0:56, t1:61 },
  { who:"dolius",   from:"threshold",  to:"greet_l",     t0:62, t1:67 },
];

/* --- THE ROOM'S STATE, on the master clock ------------------------------- */
const ROOM_AT = t => t < 26 ? "bath" : t < 46 ? "dressing" : "table";

/* --- THE RESTORE RAMP. One u drives the body AND the flare. ---------------
   AND THE FLARE IS DRAWN BEHIND THE MAN, NOT OVER HIM. This is the one place
   this scene departs from OD-B16-S03's order, and it is a tested departure.
   divine_fx.athenas-restoration is cast at scale 1.0, which is the full-bleed
   branch of placeInstance() — the one instance in this file that is NOT dot-law
   keyed and paints its own field straight into the stage. Two of its five layers
   are FILLS, not strokes: `corridor` lays a pale inkLevel(1) rectangle at alpha
   .30 down the whole standing figure, and `sweep` fills a band across it. Drawn
   last, as S03 draws it over an empty hut, those two composite onto the one body
   this scene is about and lift its tunic, its skin and half its contour above
   dotifyField's own .895 threshold: the ink stops printing and Laertes fades out
   of his own restoration for the fourteen seconds it runs. Two drafts rendered
   exactly that, and cutting the corridor layer only halved it.

   So the corridor goes in FIRST, on the wall the old man is standing against,
   and he is drawn into it. Nothing about the event is lost — it is a shaft of
   changed air with a sweep band travelling up it, shedding age downward, with
   the wand spark at the crown and the accent struck on the snap — and the man
   inside it keeps every line he has. A god working on a body is not a filter
   laid over the body. */
const R0 = 12, R1 = 26;
const ramp = t => t <= R0 ? 0 : t >= R1 ? 1 : (t - R0) / (R1 - R0);

/* --- THE SONS' PLATE -----------------------------------------------------
   The ensemble is rendered at its natural sheet size and blitted at SONS_K.
   SONS_K is not a composition choice, it is a scale correction: the module
   draws a member ~0.96·s tall where s = 186..262 source px, and this room
   paints a man MAN·684·(0.60+0.50z)·1.08 tall. At the depths the crescent
   lands on, 1.45 is where those two agree.

   The crescent is reshaped first. Stock (centreY .980, radiusY .395,
   radiusX .340) it spans ny .585..864 and nx .175..825; blitted at 1.45 the
   near horns land outside the side walls and the far crown lands above the
   far wall's own floor line. Narrowed to radiusX .22 / radiusY .16 around
   centreY .78 the family stands between the yard door and the boards, on
   floor the set actually paints, with the crown at SONS_FAR_FOOT. */
const SONS_IN   = 54;             // the first frame any of them is in the house
const SONS_K    = 1.22;
const SONS_SHAPE = { centreX:0.500, radiusX:0.200, centreY:0.620, radiusY:0.050,
                     spread:1.0 };
const SONS_FAR_FOOT = 0.605;      // frame y the crown of the crescent stands on
const SONS_DENSITY  = 0.67;       // FOUR of the six — see the header note
const SONS_THR  = 0.999;          // light-plane crowd: the default key eats it

/* wave 0 -> 1 twice: first the news runs down the line and they halt, then the
   tools go down and both arms come up. One continuous ramp per phase, so no
   member ever pops. */
const sonsAt = t => {
  if (t < SONS_IN) return null;
  if (t < 68) return { phase:"recognition", wave:clamp((t - SONS_IN)/14, 0, 1),
                       waveLag:0.85, attention:0.90 };
  return { phase:"greeting", wave:clamp((t - 68)/14, 0, 1),
           waveLag:0.75, attention:0.95 };
};

export const scene = {
  id:"OD-B24-S05",
  title:"Laertes Is Restored",
  book:24,
  plan:"laertes-farmhouse",
  duration:D,
  beats:[
    "Laertes is bathed and anointed inside the farmhouse.",
    "Athena makes him taller and stronger, restoring royal presence.",
    "Dolius and his sons return from the fields, recognize Odysseus, and join the feast.",
    "The reunited household eats while rumors of the massacre spread through town.",
  ],
  exitState:"Inside the farmhouse at Laertes's steading, state `table`: the tub " +
    "drained on its plinth, the fire down to a low flame, the three boards laid " +
    "with loaves, the joint on its platter and the mixing bowl, the stools drawn " +
    "in, the arms of the house still on the wall either side of the yard door and " +
    "the lookout slit still shuttered. Laertes has been washed and anointed and " +
    "Athena has filled out his limbs — taller than before and thicker, the white " +
    "head and the heavy lids left exactly as they were, the stoop he has carried " +
    "since OD-B24-S03 gone — and he stands at his own place at the east board " +
    "with a cup carried out across it, at his full height for the first time in " +
    "the book. Odysseus is at the centre board, still `restored`, no disguise " +
    "anywhere in this room. Dolius came up from the vine rows at the end of the " +
    "day, stopped dead one step inside the yard door at the sight of a dead man " +
    "in his master's house, crossed the floor, took the king by the wrist and " +
    "kissed the hand and asked whether the wise Penelope knows. He is still " +
    "on his half of the contact pair with Odysseus on the other: from this " +
    "moment he does not leave the master's side. Four of his sons stand in a " +
    "crescent between the yard door and the boards, tools left at the door, " +
    "both arms up, the shout still going round the family. Telemachus is at the centre board, Eumaeus at the cook " +
    "hearth and Philoetius at the cauldron, out of the shot the whole scene. " +
    "The yard door stands ajar and every head in the house has turned toward it " +
    "at least once: the report of the massacre is going through the town, and " +
    "the next thing to come up that road will not be a servant.",
  exitOccupancy:occupancyAt(farmhouse, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    laertes:"none — inherited at `bath_stand` from OD-B24-S04's `labor_r`, " +
            "brought in off the labour plot and set down in the bathing bay",
    odysseus:"none — inherited at `centre` from `labor_l`",
    dolius:"t=52, through `door_yard` from the vine rows; first drawn at t=51",
    sons:"t=54, behind him through the same door; the crescent fills as the " +
         "reaction wave runs down the family",
    telemachus:"INHERITED, NOT CAST — `board_c`, cutting the meat up",
    eumaeus:"INHERITED, NOT CAST — `hearth`",
    philoetius:"INHERITED, NOT CAST — `pot`",
  },
  exits:{
    laertes:"none — `seat_e`, his place at the east board",
    odysseus:"none — `greet_r`, his half of the contact pair",
    dolius:"none — `greet_l`, the other half of it, at his master's side",
    sons:"none — the crescent between the door and the boards",
    telemachus:"none — `board_c`", eumaeus:"none — `hearth`",
    philoetius:"none — `pot`",
  },
  walkable:"the stations of location.farmhouse-feast's own plan and nothing " +
           "else: the doorway (`door_yard`, `threshold`), the cook side " +
           "(`hearth`, `pot`, `door_store`), the bathing bay (`bath_stand`, " +
           "`linen`, `dress_stand`) — `bath` and `chest` are fixtures, not " +
           "standing places — the three boards and their seats (`seat_w`, " +
           "`seat_c`, `seat_e`, `seat_near`, `board_*`), the arms of the house " +
           "(`spear_block`, `shield_pegs`, `arm_up`), the lookout block, the " +
           "near-corner stores and the contact pair `greet_l`/`greet_r`. " +
           "blockingAt() throws on anything else — including every station of " +
           "the orchard plan this scene inherits from, which is why " +
           "ORCHARD_TO_HOUSE exists.",
  depthOrder:"the set paints the room first — shell, daylight blade on the " +
             "floor, roof, far wall, yard door, slit, hearth, bath, dressing, " +
             "arms, boards, food, steam, stores. Then the sons' plate, blitted " +
             "over the middle distance and under every principal. Then ONE " +
             "figure queue sorted by the plan's own ground y, far first, so the " +
             "floor decides who is in front: Laertes at the east board is behind " +
             "Odysseus at the centre board, and Dolius is in front of both while " +
             "he is on the pair. Then the restoration corridor, which is " +
             "multiply and only exists between R0 and R1.",
  gazeTargets:{
    laertes:"up and back as the oil goes on and the limbs fill out; then down " +
            "at his own forearms, checking the god's work; then his son; then " +
            "Dolius coming through the door; then the board",
    odysseus:"his father through the whole bath and the restoration; then " +
             "Dolius's face, and then Dolius's hands on his wrist; and at the " +
             "end off toward the yard door and the road down from town",
    dolius:"the house, craning up out of the digger's stoop at a voice that " +
           "should not be in it; then Odysseus, and nothing else until he has " +
           "kissed the hand; then away on the question about Penelope",
    sons:"whoever stands nearest the open yard knows first; the module's own " +
         "reaction wave turns each head onto the focus in order, and the focus " +
         "is Odysseus's live position, not a fixed mark",
  },
  attachments:[
    { at: 0, who:"field_01", change:"state BATH — tub full on its plinth, " +
      "cauldron over a high fire, screen up, steam to the rafters, boards bare" },
    { at:12, who:"restore_01", change:"struck in — the corridor opens over " +
      "Laertes and the sweep starts at his feet" },
    { at:19, who:"restore_01", change:"the snap: stature, span and spine cross " +
      "over, and the one accent mark is spent on that frame" },
    { at:26, who:"restore_01", change:"absent — the god's work is finished and " +
      "there is nothing left to cover" },
    { at:26, who:"field_01", change:"state DRESSING — tub drained, chest open, " +
      "the fresh mantle down off its peg onto the dressing stand" },
    { at:46, who:"field_01", change:"state TABLE — the three boards laden, " +
      "stools drawn in, fire low, door ajar" },
    { at:51, who:"dolius", change:"first frame — in the yard door, bent from " +
      "the digging, craning at the house" },
    { at:54, who:"sons", change:"the crescent struck in behind him, phase " +
      "RECOGNITION, wave running down the family from whoever is nearest the door" },
    { at:67, who:"dolius", change:"attached to Odysseus's wrist at the contact " +
      "pair — both hands under it, head driven down onto it" },
    { at:68, who:"sons", change:"phase GREETING — tools left at the door, both " +
      "arms up, the shout going round the crescent" },
    { at:90, who:"dolius", change:"detached from the wrist, still on his half of " +
      "the pair — he does not leave the master's side again in this book" },
  ],
  sound:[
    { at: 4, source:"bath",       cue:"water going over a shoulder; nothing said" },
    { at:12, source:"bath_stand", cue:"the room going quiet at once" },
    { at:28, source:"dress_stand",cue:"an old man's breath, and then a laugh he " +
      "did not expect to have" },
    { at:40, source:"centre",     cue:"father, some god has been at work on you" },
    { at:52, source:"door_yard",  cue:"boots on the threshold stone" },
    { at:58, source:"threshold",  cue:"a tool dropped, and a shout with no words in it" },
    { at:67, source:"greet_l",    cue:"a hand taken at the wrist, and kissed" },
    { at:76, source:"greet_l",    cue:"and does the wise Penelope know?" },
    { at:90, source:"seat_e",     cue:"a cup carried out across the east board" },
    { at:96, source:"door_yard",  cue:"a long way off, a town finding out" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"bath" },
    { asset:"ensemble.doliuss-sons", instance:"sons",
      anchor:{x:.50,y:.76}, scale:.62, pose:"greeting" },
    { asset:"character.laertes-restored", instance:"laertes",
      anchor:{x:.602,y:.694}, scale:.45, band:"threeq", pose:"laer_r_standing" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.500,y:.755}, scale:.48, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.dolius", instance:"dolius",
      anchor:{x:.449,y:.732}, scale:.46, band:"threeq", pose:"dol_arriving" },
    { asset:"divine-fx.athenas-restoration", instance:"restore_01",
      anchor:{x:.50,y:.99}, scale:1.0, blend:"multiply" },
  ],

  timeline:[
    // 1 — the bath. He is still the body S04 left in the orchard.
    { op:"actor.pose", target:"laertes",  at: 0.0, args:{ pose:"laer_r_standing" } },
    { op:"actor.gaze", target:"laertes",  at: 0.0, args:{ gaze:{ x:-.24, y:.30 } } },
    { op:"actor.pose", target:"odysseus", at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus", at: 0.0, args:{ gaze:{ x:.40, y:.06 } } },
    { op:"actor.pose", target:"laertes",  at: 8.0, args:{ pose:"laer_r_anointed" } },
    { op:"actor.gaze", target:"laertes",  at: 8.0, args:{ gaze:{ x:.08, y:-.40 } } },
    // 2 — the god's work
    { op:"fx.play",    target:"restore_01", at:R0, args:{ dir:"restore" } },
    { op:"actor.pose", target:"odysseus", at:20.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus", at:20.0, args:{ gaze:{ x:.46, y:-.10 } } },
    { op:"actor.pose", target:"laertes",  at:28.0, args:{ pose:"laer_r_marvelling" } },
    { op:"actor.gaze", target:"laertes",  at:28.0, args:{ gaze:{ x:-.16, y:.54 } } },
    { op:"actor.pose", target:"laertes",  at:30.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"laertes",  at:36.0, args:{ pose:"laer_r_marvelling" } },
    { op:"actor.pose", target:"odysseus", at:40.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus", at:40.0, args:{ gaze:{ x:.42, y:-.04 } } },
    { op:"actor.pose", target:"laertes",  at:46.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"laertes",  at:46.0, args:{ gaze:{ x:-.34, y:.10 } } },
    { op:"actor.pose", target:"laertes",  at:52.0, args:{ pose:"laer_r_standing" } },
    // 3 — Dolius, and the family behind him
    { op:"actor.pose", target:"dolius",   at:51.0, args:{ pose:"dol_arriving" } },
    { op:"actor.gaze", target:"dolius",   at:51.0, args:{ gaze:{ x:.36, y:-.08 } } },
    { op:"actor.pose", target:"dolius",   at:57.0, args:{ pose:"dol_amazed" } },
    { op:"actor.gaze", target:"dolius",   at:57.0, args:{ gaze:{ x:.30, y:-.12 } } },
    { op:"actor.pose", target:"odysseus", at:56.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus", at:56.0, args:{ gaze:{ x:-.36, y:-.04 } } },
    { op:"actor.pose", target:"laertes",  at:60.0, args:{ pose:"laer_r_declaring" } },
    { op:"actor.gaze", target:"laertes",  at:60.0, args:{ gaze:{ x:-.40, y:-.16 } } },
    { op:"actor.pose", target:"dolius",   at:62.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"odysseus", at:62.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus", at:62.0, args:{ gaze:{ x:-.30, y:.22 } } },
    { op:"actor.pose", target:"dolius",   at:67.0, args:{ pose:"dol_kissing_hand" } },
    { op:"actor.gaze", target:"dolius",   at:67.0, args:{ gaze:{ x:-.10, y:.62 } } },
    { op:"actor.pose", target:"dolius",   at:76.0, args:{ pose:"dol_weeping" } },
    { op:"actor.pose", target:"odysseus", at:74.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus", at:74.0, args:{ gaze:{ x:-.34, y:.10 } } },
    // 4 — the household at meat, and the road
    { op:"actor.pose", target:"laertes",  at:74.0, args:{ pose:"laer_r_feasting" } },
    { op:"actor.gaze", target:"laertes",  at:74.0, args:{ gaze:{ x:-.34, y:.20 } } },
    { op:"actor.pose", target:"odysseus", at:88.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus", at:88.0, args:{ gaze:{ x:-.44, y:-.16 } } },
    { op:"actor.pose", target:"dolius",   at:90.0, args:{ pose:"dol_questioning" } },
    { op:"actor.gaze", target:"dolius",   at:90.0, args:{ gaze:{ x:.30, y:-.10 } } },
    { op:"timeline.capture", target:"OD-B24-S05", at:99.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s    = stateAt(scene, t);
    const blk  = blockingAt(farmhouse, MOVES, t, INITIAL);
    const u    = ramp(t);
    const changing = u > 0.001 && u < 0.999;
    const prog = Math.min(.96, .08 + .86*(t/D));
    const room = ROOM_AT(t);

    /* the room first — it paints walls, roof, floor, the daylight blade, the
       tub, the boards and the arms of the house, and everything keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:room, t:0.45, progress:prog,
              status: room==="bath" ? "THE BATH"
                    : room==="dressing" ? "ANOINTED" : "AT MEAT" },
    });

    /* --- THE FLARE, laid on the wall FIRST and stood in, not painted over ---
       Same u as the body, aligned to where that body actually is this second. */
    if (changing){
      const p = blk.laertes;
      const hgt = 0.90 * MAN * p.scale;              // the rig's own frame height
      placeInstance(offctx, W, H, restoration, {
        anchor:{x:.50,y:.99}, scale:1.0,
        state:{
          t:u, dir:"restore", spark:1.0,
          figure:{ x:p.x, y:p.y, w:0.34*hgt, h:1.02*hgt },
          status:"RESTORING", progress:u,
        },
      });
    }

    /* --- THE SONS, blitted over the middle distance and under everyone ------
       Rendered at the stage's own dimensions (the module sizes members in
       absolute source px, so the sheet must be near its natural size for the
       family to lay out at all) and drawn into a rect SONS_K times that, placed
       so the crown of the reshaped crescent stands on SONS_FAR_FOOT. */
    const sn = sonsAt(t);
    if (sn){
      const dw = W * SONS_K, dh = H * SONS_K;
      const dx = W*0.5 - SONS_SHAPE.centreX * dw;
      const dy = SONS_FAR_FOOT*H - (SONS_SHAPE.centreY - SONS_SHAPE.radiusY) * dh;
      /* the family aims at the man they have recognized, wherever he is standing
         this second — the focus is expressed back in SHEET coordinates. */
      const o = blk.odysseus;
      const focus = { x:(o.x*W - dx)/dw, y:(o.y*H - dy)/dh };
      const cv = keyedModuleCanvas(sons, W, H,
        { ...SONS_SHAPE, formation:"greet-arc", phase:sn.phase, wave:sn.wave,
          waveLag:sn.waveLag, attention:sn.attention, count:6, density:SONS_DENSITY,
          layer:"full", focus, showYard:false, showFocus:false, showDropped:false,
          status:sn.phase==="greeting" ? "GREETING" : "RECOGNIZING", progress:prog },
        `b24s05|sons|${sn.phase}|${Math.round(sn.wave*20)}`, SONS_THR);
      offctx.drawImage(cv, 0, 0, cv.width, cv.height, dx, dy, dw, dh);
    }

    /* one queue, sorted by the plan's own ground line: the floor decides who is
       in front, not the order these blocks happen to be written in. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- LAERTES: one body, the stature ramped under a held gesture -------- */
    {
      const p = blk.laertes, c = s.laertes || {};
      const anointed  = t >= 8  && t < 28;
      const marvel    = t >= 28 && t < 46;
      const boasting  = t >= 60 && t < 74;
      const feasting  = t >= 74;
      add(p.y, () => placeInstance(offctx, W, H, laertes, {
        anchor:stand(p), scale:MAN * p.scale,
        state:{
          t: p.moving ? (t*0.62) % 1 : 0.5,
          restore: u, band:"threeq",
          pose: c.pose || "laer_r_standing",
          gaze: c.gaze || { x:-.24, y:.30 },
          browUp:   anointed ? .72 : marvel ? .58 : boasting ? .56 : .22,
          browKnit: marvel ? .34 : feasting ? .12 : .26,
          eyeWide:  anointed ? .46 : 0,
          eyeNarrow:feasting ? .36 : marvel ? .34 : .20,
          jaw:      boasting ? .38 : anointed ? .26 : 0,
          smile:    feasting ? .44 : boasting ? .22 : 0,
          cheek:    feasting ? .42 : 0,
          mouthAsym:marvel ? .34 : 0,
          status:   feasting ? "FEASTING" : boasting ? "WHAT A DAY"
                  : marvel ? "MARVELLING" : changing ? "RESTORING"
                  : anointed ? "ANOINTED" : "THE OLD KING",
          progress: prog,
        },
      }));
    }

    /* --- ODYSSEUS: one body, one guise. `restored` first frame to last. ---- */
    {
      const p = blk.odysseus, c = s.odysseus || {};
      const watching = t < 40;
      const naming   = t >= 40 && t < 56;
      const met      = t >= 62 && t < 82;
      const listening= t >= 88;
      add(p.y, () => placeInstance(offctx, W, H, odysseus, {
        anchor:stand(p), scale:MAN * p.scale,
        state:{
          t: p.moving ? (t*0.62) % 1 : 0.5,
          guise:"restored", band:"threeq",
          pose: c.pose || "three_quarter_left",
          gaze: c.gaze || { x:.40, y:.06 },
          browUp:   naming ? .46 : met ? .34 : .18,
          browKnit: listening ? .48 : watching ? .22 : .12,
          eyeNarrow:listening ? .30 : watching ? .24 : 0,
          eyeWide:  changing ? .26 : 0,
          smile:    met ? .30 : naming ? .18 : 0,
          jaw:      naming ? .22 : 0,
          status:   listening ? "THE ROAD FROM TOWN" : met ? "OLD FRIEND"
                  : naming ? "SOME GOD HAS DONE THIS" : "MY FATHER",
          progress: prog,
        },
      }));
    }

    /* --- DOLIUS: not in the house until he walks into it ------------------- */
    if (t >= 51){
      const p = blk.dolius, c = s.dolius || {};
      const amazed  = t >= 57 && t < 67;
      const kissing = t >= 67 && t < 76;
      const weeping = t >= 76 && t < 90;
      const asking  = t >= 90;
      add(p.y, () => placeInstance(offctx, W, H, dolius, {
        anchor:stand(p), scale:MAN * p.scale,
        state:{
          t: p.moving ? (t*0.62) % 1 : 0.46,
          band:"threeq",
          pose: c.pose || "dol_arriving",
          gaze: c.gaze || { x:.36, y:-.08 },
          browUp:   amazed ? .92 : kissing ? .74 : weeping ? .86 : .48,
          browKnit: weeping ? .58 : kissing ? .44 : amazed ? .12 : .30,
          eyeWide:  amazed ? .66 : asking ? .26 : 0,
          eyeNarrow:kissing ? .40 : weeping ? .52 : 0,
          jaw:      amazed ? .44 : weeping ? .30 : asking ? .26 : 0,
          frown:    amazed ? .52 : weeping ? .46 : kissing ? .22 : 0,
          mouthPucker: kissing ? .55 : 0,
          status:   asking ? "AND PENELOPE?" : weeping ? "WEEPING"
                  : kissing ? "SERVING" : amazed ? "AMAZED" : "RETURNING",
          progress: prog,
        },
      }));
    }

    /* far → near, by the plan's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());

  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
