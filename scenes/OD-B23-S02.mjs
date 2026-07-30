/* ============================================================
   SCENE  OD-B23-S02 — Penelope Studies the Stranger        (Od. 23.85–152)
   Book XXIII, scene 2. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its hall siblings
   OD-B22-S01 and OD-B19-S02.

   Beats (causal order, one master clock):
     1. Penelope sits opposite Odysseus in silence and studies his face and
        clothing.
     2. Telemachus rebukes her for hardness; she says she and Odysseus share
        private signs.
     3. Odysseus accepts the delay and turns to the danger from the suitors'
        families.
     4. He orders the household to create the sound of a wedding so the deaths
        remain hidden.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. THE ROOM IS STATE, AND "RECOGNITION SEATING" IS NOT A ROOM. The atlas
      asks for `location.recognition-seating`. No such asset exists and none is
      built here: this plays in the great hall, so the field is
      location.megaron-hall in state `cleaned` — the asset's own Book XXIII
      state ("scoured, sulphur brazier smoking, order restored"), which is the
      room Book XXII leaves once the bodies are out and the hall has been
      fumigated. Building a second hall called "recognition seating" is exactly
      the collage the state channel exists to stop (the asset's own header names
      four such invented halls). It is placed the way every Book XVI+ hall scene
      places it — anchor (.50,.99), scale 1.0 — so this hall registers to the
      pixel on B19-S02's, B21-S01's and B22-S01's hall.

      THE SEATING IS THEREFORE THE ROOM'S OWN, AND IT IS TWO NAMED MARKS.
      `cleaned` carries `furniture:"order"`: four benches and two boards back on
      their stations. The recognition seat itself is the plan's own facing pair
      of roof-pillars — Od. 23.90 sits Odysseus down against a tall pillar, and
      Homer sits the queen opposite him across the firelight, which is what
      `pillar_l` (.26,.44) and `pillar_r` (.74,.44) are: symmetric about the
      hearth (.50,.52), 0.324 of frame width apart on screen, the fire between
      them. Nothing is invented and nothing is hand-placed.

      prop.guest-chair-and-footstool is NOT cast, for the reason OD-B19-S02 and
      OD-B19-S03 already gave in this same room: the rig has no seated pose, so
      a chair standing on the station a body stands on fuses under its legs.
      The sitting is carried by absolute stillness at a named mark against a
      painted pillar — neither of these two moves once they are down — and by
      the room's own boards and benches in order behind them.

      THREE LAYERS ARE DROPPED, each for a reason:
        · `throne` — its near plinth and open back stand across the near spine
          at y .79–.85 and its base box runs out to x .42–.58, which is the
          ground the son crosses on his way to `corner_dead` and the one part of
          the near floor that has to stay clear of furniture. Same collision
          B22-S01 dropped it for; nobody sits on it in this scene.
        · `axes` — `cleaned` has no axes (M.axes false), so the layer is dropped
          rather than left in the list saying something it does not do.
        · `litter` — `cleaned` has none either. Same reason.
      `racks` is KEPT and is doing work: with `arms:false` it draws the side
      panels, the peg rails and BARE PEGS. The arms are still out of the hall
      from XIX, which is precisely why beat 3 — the suitors' fathers are coming
      — is a real danger and not a boast.

   B. NO HAND-PLACED ANCHORS, AND NOTHING ELSE IN THE FRAME EITHER. Every
      position in this file resolves through scenes/_plans/megaron.mjs by station
      NAME, through blockingAt(). There is not one literal coordinate in the
      staging: no anchor, no offset, no nudge, and (after note G) no blitted
      window. The four cast anchors in `cast[]` are contract placeholders and
      stage() overrides every one of them.

   C. NOBODY TOUCHES ANYBODY, WHICH IS THE POINT — SO THERE IS NO CONTACT PAIR.
      This is the one scene in the book where the two of them do NOT close: she
      will not come near him and he will not go to her (the embrace is two
      scenes away, after the bed). The four marks used are therefore chosen to
      stay apart at every second, measured at 1120x760:
        odysseus   `pillar_l`    (.338,.690)  307px body, x ~323–433
        penelope   `pillar_r`    (.662,.690)  305px body, x ~686–796
        telemachus `corner_dead` (.123,.911)  363px body, x ~ 73–203
      253px of clear paper between the two seated bodies, and 120px between the
      son and his father, with the son 168px lower in the frame and half again
      as large because he is 0.47 of the room nearer the camera. No two marks are
      ever occupied at once and no route crosses an occupied one — there is only
      one route in the scene (note D).

   D. THE ROUTES AVOID THE FIRE, AND THAT IS WHY SHE KEEPS THE WALL. The hearth
      ring is painted at screen x 475–645, y 526–580 (plan (.50,.52), ring
      z .445–.595), and it eats the middle of the room:
        · THE QUEEN COMES DOWN ON HER OWN SIDE. She is inherited at the foot of
          the hall stair, `stair_up` (.92,.66). A straight line from there to
          the far pillar passes through plan (.50,.52) — the centre of the fire,
          exactly. So she does not take it. She goes UP her own wall to
          `doorway_maid` (.94,.40), outboard of `bench_r1`'s box (which ends at
          plan x .895), and only then inboard to `pillar_r`. Two legs, both
          clear of every bench, board and stone. It costs nothing and it is the
          beat: the queen crosses her own hall keeping the greatest possible
          distance from the man in it, which is what Telemachus is about to call
          hardness.
        · THE SON DOES NOT MOVE EITHER, AND THAT IS THE THIRD THING READ OFF
          THE PLATE. He was given a route in two drafts and both were rendered
          and thrown out:
            `postern` (.254,.599) leaves 6px of paper between his shoulder and
            his father's at the size this scene uses — at halftone pitch that is
            no gap at all, and the two men printed as one dark mass at the left
            pillar;
            `axe_last` (.500,.832) is downstage centre, and the hearth ring is
            painted at x 475–645 / y 526–580 while a body there covers x 505–615,
            so the ring's two ends stand out either side of his hips and the
            flames come up inside his tunic. He is nearer than the fire and is
            correctly drawn over it, and it still reads as a fixture fused into a
            body, because an ellipse wider than a man at the height of his thighs
            reads as part of him whatever the draw order says.
          A third draft kept him off both and walked him `axe_first` ->
          `corner_dead`. Rendered at t=23, mid-leg, that route puts 56px of him
          straight through his father: the two seated marks flank the centre at
          mid depth, he starts on the centre line farther off than both, and EVERY
          near diagonal out of the middle of this room passes across one parent or
          the other, because the projection puts a walker's whole body over the
          body whose feet he passes in front of. There is no clean route out of
          the middle, so he is not given one.
          HE THEREFORE HOLDS `corner_dead` (.123,.911) FOR THE WHOLE SCENE — the
          near-left corner he had the wreck cleared out of and the floor scoured
          at the end of Book XXII (22.437ff is his own detail: the son directs
          the cleaning), where he is the largest body in the frame, downstage of
          his father, filling a quarter that is otherwise bare floor, with clear
          paper on every side of him at every second.
          WHICH LEAVES ONE MOVING BODY IN THE SCENE, AND IT IS THE RIGHT ONE.
          Penelope's two legs are the only blocking in sixty-two seconds, and
          they go the long way round to a mark as far from her husband as the
          room allows. A scene in which one person moves and moves AWAY is what
          Od. 23.85–152 is; the son's rebuke and the father's order are spoken
          across that distance and are not allowed to close it.
        · NO BODY ON THE SPINE AT ALL. `door_main`, `threshold`, `axe_first`,
          `axe_last` and `shot_mark` are empty for the whole scene, so the lane
          from the doors to the camera stays open and the fire keeps the middle
          of its own room.

   E. ONE BODY, AND THE GUISE IS HELD OFF ITS SNAP ON PURPOSE. Odysseus is
      character.odysseus-b16 at ONE guise position for the whole scene —
      `{ from:"beggar", to:"restored", u:0.44 }` — and it never moves, so there
      is no cut, no snap and no flare anywhere in this file.
      WHY NOT `restored`. Od. 23.95 is unambiguous and it is the entire beat:
      she studies his face and cannot know him, ὅτι κακὰ εἵματα ἕστο — because
      he had poor clothing on. He does not stop being a beggar to look at until
      he has bathed at 23.153, which is why the atlas' own job list casts
      `character.odysseus` for THIS scene and `character.odysseus-restored` for
      the next one. Holding him at u=0.44 is the one position that says both
      true things at once: the guise engine SNAPS discrete params at u>=0.5 and
      lerps continuous ones, so at 0.44 the garment is still the beggar's rags
      and cloakless, while skin, hair and height have travelled 42% of the way
      back to the king (scale 0.975 of 1.08, i.e. a 248px man against her
      247px). The king's body in the beggar's clothes. She is looking at a man
      the right size and the right colour wearing the wrong things.
      WHY THIS IS NOT A REGRESSION FROM B22-S01. That scene ramps him
      beggar -> restored as the rags come off for the shooting, and reads the
      strip as the restoration. Book XXIII puts the restoration at the bath, and
      the atlas agrees. There is no computed chain between the two books —
      B23-S01 carries no Odysseus at all — so his guise here is DECLARED, once,
      exactly as his station is declared, and it is stated rather than smuggled.
      S03 continues the same ramp from 0.44 to 1: the garment snap, and
      divine_fx if it wants one, belong on the frame he comes out of the bath.

   F. ONE MIRROR, AND ONLY ONE. Odysseus is drawn `mirror:true` for the whole
      scene and never switched — the same rule B22-S01 set for him, so the man
      is composed the same way in both books. He sits on the LEFT and every act
      of his goes to screen RIGHT (his eyes down and across at the queen, his
      hand out to the son, his arm up toward the doors), and the rig's reaching
      poses (`offering_hand`, `pointing_arm`) are all authored to screen left.
      Nobody else is mirrored, and nobody else needs to be: the queen sits on
      the right and everything of hers goes left, and the son stands on the
      spine and is given only symmetric poses (`torso_open`, `lean_forward`,
      `head_lowered`) plus an explicit gaze — explicit gaze is applied AFTER the
      mirror is composed, so every gaze in the timeline is in final screen terms.

   G. THE ORDER IS AN ORDER, NOT AN EMITTER — THE PLATE WAS RENDERED AND CUT.
      Beat 4 is the ORDER for the wedding noise; the noise itself is
      OD-B23-S03, which is what casts sound_source.false-wedding-music. Draft 2
      cast it here anyway, for the last ten seconds, in its `cue` state, as one
      keyed window of its upper band — the palace wall in section, the jambed
      gap, the gain chevron, the street-side fan and the two passers-by — hung
      high over the right-hand wall above the maids' doorway, because the
      household being ordered is through that door. It was read back off the
      plate and it did not survive. At every size that stayed clear of the
      maids' door head (y 331), the right rack (y 355) and the frame edge, the
      window came out about 190x174px, and at that size the wall section, the
      five wavefronts and the two receivers fall below the dot pitch: what
      prints is a scatter of loose rings and two little roof-and-tree glyphs
      floating on a blank wall — the exact failure OD-B19-S02 recorded when it
      composited the loom and got a bookcase. Enlarging it does not rescue it
      either: legibility needs about 0.30 of frame width, and there is no 336px
      square in this room that is not either architecture or somebody's head.
      So it is cut, and beat 4 is carried where beats belong in this file — on
      the bodies (the father's hand out to his son, the son leaning in to take
      it), on the room's own status word, and on the declared `sound[]` cue and
      the exitState, which hand S03 an emitter that is CUED and not yet playing.
      Nothing in this scene depends on a diagram, and nothing in it is type.

   H. TONE. The room is in a lift-0 state and `cleaned` lifts the FLOOR one
      level lighter still (floorLift -1), which is the whole reason this state
      and not `night` is used for a night scene: the dark hall states belong to
      XX and XXII and are never touched here. The three figures are the shared
      rig plus the queen's own veil, hair and skirt; hand-drawn ctx overpaint is
      ZERO. The one near-black mass in the frame is the far doorway's own
      furniture and the five small flames of a fresh fire. Nothing in this file
      draws a full-width band: the room's near boards stop at x 401 and restart
      at x 719, and the son stands in the gap.

   I. THE BOX A BODY IS DRAWN IN. placeInstance() hands a module a box of the
      STAGE's aspect (1120x760). character.penelope lays her veil, hair drape
      and skirt out in box-W fractions, so in a landscape box the queen renders
      as a wide bell with the veil off her shoulder (the B21-S01 / B23-S01
      finding). Every figure here is therefore blitted through placeFig() into
      an upright box — 0.75 for the queen, 0.95 for the two men, who are pure
      rig and only need the width their arms use. The rig plants its ankles at
      0.90 of its own box either way, and since min(h·0.9, w·1.26) is h-limited
      for any aspect above 0.714, hFrac = K·p.scale gives all three EXACTLY the
      body height the landscape regime would have given them. Same scale law as
      B22-S01, same K, different box.

   CONTINUITY IN — COMPUTED, THEN TRANSLATED (brief note F). OD-B23-S01 exports
   exitOccupancy { penelope:"threshold_r", eurycleia:"low_floor" }, and both are
   stations of location.upper-chamber-and-stair, not of the megaron — so it is
   imported and translated through one declared map instead of guessed:
     threshold_r -> stair_up    the queen in the hall doorway at the head of the
                                megaron's stair corner is the queen at the foot
                                of the hall stair; it is the same corner of the
                                same house, named in S01's own exitState.
     low_floor   -> (dropped)   EURYCLEIA IS DROPPED, deliberately. She is not
                                in this scene's cast, Homer sends the household
                                women off to their own work at 23.117ff, and a
                                fourth body on the hall floor would have to be
                                given a mark, a route and a reason. Dropping is
                                the documented behaviour for a figure the story
                                leaves behind; she is not lost, she is simply
                                not in this frame, and any later scene that
                                wants her declares her again.
   The two men are DECLARED by station name, because nothing in Book XXII exports
   into this chain: Odysseus already down against the left pillar where 23.90
   puts him, the son down in the corner of his own hall that he had cleaned out.

   CONTINUITY OUT — computed, never written:
   { penelope:"pillar_r", odysseus:"pillar_l", telemachus:"corner_dead" }. All three
   are megaron stations, so S03 needs no translation table — only the bard, the
   dancers and the noise it brings in.

   Verify (the one moving body mid-leg, the silent study, and the order):
     node harness/render-scene.mjs scenes/OD-B23-S02.mjs --t 6
     node harness/render-scene.mjs scenes/OD-B23-S02.mjs --t 17
     node harness/render-scene.mjs scenes/OD-B23-S02.mjs --t 55
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01 } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import penelope    from "../assets/character/penelope.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
/* sound_source.false-wedding-music is NOT imported: see note G. The order is
   given here; the emitter is OD-B23-S03's instance. */

const FIELD_ASSET = "location.megaron-hall";
const D = 62;

/* the scoured hall, minus the throne plinth that swallows the near spine, minus
   two layers this state does not draw anything with (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth","furniture"];

/* ---- THE CLOCK ---------------------------------------------------------- */
const WALL0  = 2,  WALL1 = 7;    // she keeps her own wall, up to the maids' door
const SEAT0  = 9,  SEAT1 = 15;   // and in to the far pillar, opposite him
const STUDY  = 16;               // the silence: she reads his face and his clothes
const REBUKE = 28;               // "mother, hard heart" — no other woman would
const SIGNS  = 35;               // her answer: there are signs known only to us
const ACCEPT = 41;               // he lets the test stand
const DANGER = 47;               // and turns to the dead men's fathers
const ORDER  = 53;               // the household is to make the sound of a wedding

/* ---- CONTINUITY IN: imported, then translated by one declared map -------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B23-S01.mjs";
/* upper-chamber-and-stair station -> megaron station. Unmapped = dropped. */
const HOUSE_TO_HALL = { threshold_r:"stair_up" };   // low_floor: eurycleia, dropped
const CARRIED = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, st]) => [who, HOUSE_TO_HALL[st]])
    .filter(([, st]) => st));
const INITIAL = {
  ...CARRIED,                    // penelope, at the foot of the hall stair
  odysseus:  "pillar_l",         // already down against the tall pillar (23.90)
  telemachus:"corner_dead",      // the corner he had scoured out (22.437ff)
};

/* ---- BLOCKING. Stations, not coordinates (notes B, D). ------------------- */
const MOVES = [
  // the queen crosses her own hall by her own wall, and stops on the far side
  { who:"penelope",   from:"stair_up",     to:"doorway_maid", t0:WALL0, t1:WALL1 },
  { who:"penelope",   from:"doorway_maid", to:"pillar_r",     t0:SEAT0, t1:SEAT1 },
  // NOBODY ELSE MOVES, and that is deliberate (note D). Beat 3 is a man
  // agreeing to be tested: his stillness at one mark for sixty-two seconds is
  // the content of the scene, and the son has no clean route out of the middle
  // of this room, so he keeps the corner he cleaned.
];

/* ---- THE GUISE, HELD (note E) ------------------------------------------- */
const GUISE_U = 0.44;
const GUISE = { from:"beggar", to:"restored", u:GUISE_U };

/* ---- one figure scale for the whole cast; the plan's depth law does the
   rest, so nobody is hand-tuned bigger than the room allows. ---------------
   K WAS RAISED FROM B22-S01's 0.42 AFTER LOOKING AT THE PLATE, and the number
   is not free: this hall paints its roof-pillars 57px wide at plan z .44, and
   at 0.42 a body seated against one is 248px tall and ~90px wide, so the
   column's two hard contour lines run straight down THROUGH the figure and it
   loses its silhouette — 250px of king with the pillar's edge for a spine. At
   0.52 the same body is 307px and wide enough that the column passes behind it
   and reads as the thing he is leaning on. 0.52 is also the middle of the range
   OD-B19-S02 uses for the same three bodies on two of the same three marks
   (0.46 / 0.52 / 0.52), so this scene is the same size as its sibling in the
   same room, and 307px against the 453px storey at that depth is a man of
   about 1.85m in a hall of 2.7m. */
const K = 0.52;

/* ---- placeFig — blit a module into an upright box anchored on the rig's own
   floor line (note I). `sig` is required: keyedModuleCanvas caches on
   pose/band/t only, so without it a change of gaze or brow returns the
   previous frame's canvas. -------------------------------------------------- */
const AR_QUEEN = 660 / 880;      // the atlas' character box
const AR_MAN   = 0.95;           // pure rig: only as wide as the arms need
const FIG_FLOOR = 0.90;          // where figure-hero plants the ankles
const FIG_PAD   = 0.07;          // bleed, so a raised arm is never truncated
function placeFig(offctx, W, H, mod, { x, y, hFrac, ar = AR_MAN, fx = 0.5,
                                       fy = FIG_FLOOR, state = {}, sig = "",
                                       pad = FIG_PAD, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

export const scene = {
  id:"OD-B23-S02",
  title:"Penelope Studies the Stranger",
  book:23,
  plan:"megaron",
  duration:D,
  beats:[
    "Penelope sits opposite Odysseus in silence and studies his face and clothing.",
    "Telemachus rebukes her for hardness; she says she and Odysseus share private signs.",
    "Odysseus accepts the delay and turns to the danger from the suitors' families.",
    "He orders the household to create the sound of a wedding so the deaths remain hidden.",
  ],
  exitState:
    "Night in the scoured hall — bodies out, floor washed, the sulphur brazier " +
    "still smoking beside a fresh fire, the benches and boards back in order, " +
    "the peg rails bare. Three people and the whole width of the room between " +
    "them. Odysseus holds the left roof-pillar (`pillar_l`) where he sat down " +
    "to wait, and he has NOT been recognized: he is one body at one held guise " +
    "position — the king's height and colour in the beggar's rags, u=0.44, the " +
    "garment still short of its snap — because he has not bathed yet, and that " +
    "unwashed clothing is the whole reason she cannot know him. He has said the " +
    "two things this scene exists for: let her test me as long as she likes, " +
    "and the men we killed have fathers who will come. Penelope holds the right " +
    "roof-pillar (`pillar_r`), opposite him across the fire, exactly as far off " +
    "as the room allows: she came down her own wall to get there, she has " +
    "studied his face and his clothes in silence, she has been called " +
    "hard-hearted by her own son and has answered him — there are signs the two " +
    "of them know and nobody else does — and she has neither crossed to him nor " +
    "spent that test, which is the bed, and is still hers to spend. Telemachus " +
    "has not moved out of the near-left corner (`corner_dead`) that he had " +
    "scoured out at the end of Book XXII: downstage of his father, the largest " +
    "body in the frame, rebuked by his mother's " +
    "answer and holding his father's order. THE ORDER IS THE HANDOFF: the " +
    "household is to raise " +
    "the sound of a wedding — lyre, stamping feet, festive calls — loud enough " +
    "to go out through the wall and be believed in the street, so the town says " +
    "the queen has married at last instead of counting its dead sons. " +
    "sound_source.false-wedding-music is CUED and not yet playing; the great " +
    "doors are open, nobody in the town knows anything, and no member of the " +
    "household is in the frame yet. S03 opens on exactly this: the same hall, " +
    "the same three marks, and the bard sent for.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    penelope:"entrance:stair (`stair_up`) — inherited from OD-B23-S01 at the " +
             "foot of the hall stair, and moving from t=2",
    odysseus:"none — he is already down against `pillar_l` when the scene opens",
    telemachus:"none — he is already in the near-left corner (`corner_dead`), " +
               "where he had the wreck cleared and the floor scoured",
    wedding_order:"not a body and not an instance in this scene: the order is " +
                  "SPOKEN at ORDER=53 (see note G) and is handed to S03 as a " +
                  "cued, unplayed emitter",
  },
  exits:{
    penelope:"none — she holds `pillar_r` into S03",
    odysseus:"none — he holds `pillar_l` into S03; the bath is S03's move",
    telemachus:"none — he holds `corner_dead` into S03",
    wedding_order:"none to make — nothing is emitting yet; S03 strikes it",
  },
  walkable:"the megaron's own `walkable` band (x .12–.88, y .55–.98) minus " +
           "three exclusions this scene actually respects: the hearth ring " +
           "(screen x 475–645, y 526–580), the four bench boxes and the two " +
           "board boxes that `cleaned` puts back in order, and the near " +
           "throne footprint — which is why the `throne` layer is dropped " +
           "rather than walked over. `lane:spine` is walkable and is used at " +
           "one point only, its near end.",
  depthOrder:"one queue, computed: the hall's layers, then the quoted order " +
             "(a diagram laid IN the room's air high on the right wall, so it " +
             "goes under the bodies and not over them), then the three figures " +
             "sorted by their own resolved plan depth so the nearer body is " +
             "drawn later — the son (d .74) over the two at the pillars " +
             "(d .44), who never overlap each other at all.",
  gazeTargets:{
    penelope:"his face, and then his clothes, and then his face again, for " +
             "sixteen seconds without speaking; down-left at her son while he " +
             "rebukes her; back across the fire at Odysseus for the answer " +
             "about the signs; and at the end still on him, and not on the door",
    odysseus:"the floor in front of his own feet at first — a man waiting to be " +
             "spoken to and not asking for it — then across and up at her when " +
             "he accepts the test, then out to the open doors and the road when " +
             "he names the fathers, then down-right at his son with the order",
    telemachus:"up-right at his mother for the rebuke, down at the floor when " +
               "she answers him, and up-left at his father for the order",
  },
  attachments:[
    { at:WALL0,  who:"penelope",   change:"detaches from the stair foot; nothing " +
      "in her hands for the whole scene" },
    { at:SEAT1,  who:"penelope",   change:"at rest against `pillar_r`; from here " +
      "she does not move again in this scene" },
    { at:REBUKE, who:"telemachus", change:"nothing in his hands — he had the " +
      "cleaning tools in them until this scene; the rebuke is the whole action" },
    { at:ORDER,  who:"odysseus",   change:"nothing in his hands; the order " +
      "attaches to the HOUSEHOLD, through the maids' door, and is carried into " +
      "S03 as a cued, unplayed emitter — no instance of it is drawn here" },
    { at:"never",who:"odysseus",   change:"the guise does NOT change: held at " +
      "{ beggar -> restored, u:0.44 } from first frame to last, so no garment " +
      "snap happens in this scene and no divine_fx is cast" },
  ],
  sound:[
    { at:WALL0,  source:"stair_up",     cue:"a woman's feet on stone, unhurried, going the long way round her own hall" },
    { at:16,     source:"corner_dead",  cue:"a bucket set down on the flags of the corner the blood was washed out of" },
    { at:SEAT1,  source:"pillar_r",     cue:"nothing — the silence is the beat, and it is sixteen seconds long" },
    { at:REBUKE, source:"corner_dead",  cue:"a young man's voice, too loud for the room: no other woman would sit apart like this" },
    { at:SIGNS,  source:"pillar_r",     cue:"the queen, level and quiet: there are signs between us that nobody else knows" },
    { at:ACCEPT, source:"pillar_l",     cue:"let her test me as long as she likes" },
    { at:DANGER, source:"door_main",    cue:"and the men we killed had fathers — the road outside, and nothing on the pegs" },
    { at:ORDER,  source:"doorway_maid", cue:"the order, given through the maids' door: lyre, feet, voices — a wedding, for the ears of the street" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"cleaned" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.338,y:.690}, scale:.46, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.662,y:.690}, scale:.46, band:"threeq", pose:"guarded_withdrawal" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.123,y:.911}, scale:.62, band:"threeq", pose:"three_quarter_right" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at:0.0,     args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus",   at:0.0,     args:{ gaze:{ x:.10, y:.34 } } },
    { op:"actor.pose", target:"penelope",   at:0.0,     args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"penelope",   at:0.0,     args:{ gaze:{ x:-.30, y:.10 } } },
    { op:"actor.pose", target:"telemachus", at:0.0,     args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"telemachus", at:0.0,     args:{ gaze:{ x:.30, y:.02 } } },
    // 1. she sits down opposite him, and looks
    { op:"actor.pose", target:"penelope",   at:SEAT1,   args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"penelope",   at:SEAT1,   args:{ gaze:{ x:-.34, y:.04 } } },
    { op:"actor.gaze", target:"penelope",   at:STUDY,   args:{ gaze:{ x:-.36, y:.16 } } },
    // 2. the son's rebuke, and her answer
    { op:"actor.pose", target:"telemachus", at:REBUKE,  args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"telemachus", at:REBUKE,  args:{ gaze:{ x:.44, y:-.22 } } },
    { op:"actor.gaze", target:"penelope",   at:REBUKE,  args:{ gaze:{ x:-.20, y:.32 } } },
    { op:"actor.pose", target:"penelope",   at:SIGNS,   args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"penelope",   at:SIGNS,   args:{ gaze:{ x:-.40, y:.02 } } },
    { op:"actor.pose", target:"telemachus", at:SIGNS,   args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"telemachus", at:SIGNS,   args:{ gaze:{ x:.08, y:.34 } } },
    // 3. he accepts the delay, then turns to the fathers
    { op:"actor.pose", target:"odysseus",   at:ACCEPT,  args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus",   at:ACCEPT,  args:{ gaze:{ x:.36, y:.02 } } },
    { op:"actor.pose", target:"penelope",   at:ACCEPT + 3, args:{ pose:"arms_crossed" } },
    { op:"actor.pose", target:"odysseus",   at:DANGER,  args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus",   at:DANGER,  args:{ gaze:{ x:.18, y:-.16 } } },
    { op:"actor.pose", target:"telemachus", at:DANGER,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:DANGER,  args:{ gaze:{ x:.26, y:-.20 } } },
    // 4. the order for the wedding noise
    { op:"actor.pose", target:"odysseus",   at:ORDER,   args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:ORDER,   args:{ gaze:{ x:.24, y:.24 } } },
    { op:"actor.gaze", target:"penelope",   at:ORDER,   args:{ gaze:{ x:-.38, y:.06 } } },
    { op:"timeline.capture", target:"OD-B23-S02", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.10 + 0.84 * (t / D));

    /* --- 1. THE HALL, `cleaned` (note A). It paints the room; everything else
       keys onto it. Placed like every other Book XVI+ hall scene. --------- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"cleaned", t:breath, layers:HALL_LAYERS,
        status: t < SEAT1  ? "SHE COMES BY THE WALL"
              : t < REBUKE ? "SHE WILL NOT KNOW HIM"
              : t < SIGNS  ? "HARD HEART"
              : t < ACCEPT ? "SIGNS OF OUR OWN"
              : t < DANGER ? "LET HER TEST ME"
              : t < ORDER  ? "THEY HAD FATHERS"
              :              "A WEDDING, FOR THE EARS",
        progress: prog,
      },
    });

    /* --- 2. THE THREE BODIES, nearer drawn later (note C). No diagram is
       laid in this room's air; see note G. ------------------------------- */
    const order = ["odysseus", "penelope", "telemachus"]
      .sort((a, b) => (blk[a].d - blk[b].d) || (blk[a].x - blk[b].x));

    for (const who of order){
      const p = blk[who];
      const s = st[who] || {};
      const hFrac = K * p.scale;

      if (who === "odysseus"){
        /* ONE BODY, ONE HELD GUISE (note E). Mirrored once and never switched
           (note F): he sits on the left and everything he does goes right. */
        const seated   = true;                       // he never leaves the pillar
        const accepting= t >= ACCEPT && t < DANGER;
        const warning  = t >= DANGER && t < ORDER;
        const ordering = t >= ORDER;
        const waiting  = t < ACCEPT;
        const pose = s.pose || "three_quarter_left";
        const gaze = s.gaze || { x:.10, y:.34 };
        placeFig(offctx, W, H, odysseus, {
          x:p.x, y:p.y, hFrac, ar:AR_MAN,
          state:{
            t:breath, guise:GUISE, band:"threeq", mirror:true, pose, gaze,
            browUp:   ordering ? .26 : warning ? .30 : accepting ? .22 : .10,
            browKnit: warning ? .54 : ordering ? .40 : waiting ? .30 : .18,
            eyeNarrow:waiting ? .38 : warning ? .42 : .22,
            eyeWide:  0,
            jaw:      ordering ? .38 : warning ? .30 : accepting ? .26 : 0,
            mouthAsym:ordering ? .34 : accepting ? .22 : .12,
            smile:    accepting ? .14 : 0,
            frown:    warning ? .24 : 0,
            status: ordering ? "MAKE IT SOUND LIKE A WEDDING"
                  : warning  ? "THEY HAD FATHERS"
                  : accepting? "LET HER TEST ME"
                  : seated   ? "HE WAITS TO BE SPOKEN TO" : "",
            progress: prog,
          },
          sig:`ody|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${Math.round(GUISE_U*20)}|${waiting?1:0}|${accepting?1:0}`
             + `|${warning?1:0}|${ordering?1:0}`,
        });

      } else if (who === "penelope"){
        /* the queen: two legs by her own wall, then perfectly still. She is
           drawn in the atlas' upright character box (note I) because her veil,
           hair drape and skirt are laid out in box-W fractions. */
        const studying = t >= SEAT1 && t < REBUKE;
        const answered = t >= SIGNS && t < ACCEPT;
        const held     = t >= ACCEPT;
        const pose = p.moving ? "walk_neutral" : (s.pose || "arms_crossed");
        const gaze = s.gaze || { x:-.34, y:.04 };
        placeFig(offctx, W, H, penelope, {
          x:p.x, y:p.y, hFrac, ar:AR_QUEEN,
          state:{
            t: p.moving ? (t * 0.40) % 4 : breath,
            band:"threeq", pose, gaze,
            mouth: answered ? .45 : 0,
            browUp:   studying ? .34 : answered ? .30 : held ? .22 : .26,
            browKnit: studying ? .44 : answered ? .34 : .28,
            eyeNarrow:studying ? .40 : held ? .30 : .16,
            eyeWide:  0,
            frown:    studying ? .22 : held ? .18 : 0,
            jaw:      answered ? .32 : 0,
            status: held     ? "SHE KEEPS HER TEST"
                  : answered ? "SIGNS OF OUR OWN"
                  : studying ? "HIS FACE, AND HIS CLOTHES"
                  : p.moving ? "BY HER OWN WALL" : "SHE SITS DOWN APART",
            progress: prog,
          },
          sig:`pen|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${studying?1:0}|${answered?1:0}|${held?1:0}|${p.moving?1:0}`,
        });

      } else {
        /* the son: the scoured corner, held all scene (note D). Never
           mirrored, and given only symmetric poses (note F). */
        const rebuking = t >= REBUKE && t < SIGNS;
        const answered = t >= SIGNS && t < DANGER;
        const listening= t >= DANGER;
        const pose = p.moving ? "walk_neutral" : (s.pose || "three_quarter_right");
        const gaze = s.gaze || { x:.30, y:.02 };
        placeFig(offctx, W, H, telemachus, {
          x:p.x, y:p.y, hFrac, ar:AR_MAN,
          state:{
            t: p.moving ? (t * 0.46) % 4 : breath,
            band:"threeq", pose, gaze,
            browUp:   rebuking ? .52 : answered ? .30 : .24,
            browKnit: rebuking ? .40 : answered ? .44 : listening ? .34 : .16,
            eyeWide:  rebuking ? .34 : 0,
            eyeNarrow:answered ? .30 : listening ? .22 : .10,
            jaw:      rebuking ? .48 : listening ? .12 : 0,
            frown:    answered ? .28 : 0,
            mouthAsym:rebuking ? .26 : 0,
            status: listening ? "HE TAKES THE ORDER"
                  : answered  ? "HE IS ANSWERED"
                  : rebuking  ? "NO OTHER WOMAN WOULD"
                  :             "THE CORNER IS SCOURED",
            progress: prog,
          },
          sig:`tel|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${rebuking?1:0}|${answered?1:0}|${listening?1:0}|${p.moving?1:0}`,
        });
      }
    }
  },
};
export default scene;

/* named binding so OD-B23-S03 can `import { exitOccupancy as INITIAL }`.
   All three marks are megaron stations and S03 plays in this same hall, so it
   needs no translation table — only the bard, the dancers and the noise. */
export const exitOccupancy = scene.exitOccupancy;
