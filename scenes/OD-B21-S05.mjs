/* ============================================================
   SCENE  OD-B21-S05 — The Beggar Requests the Bow          (Od. 21.274–379)
   Book XXI, scene 5. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its immediate
   predecessors OD-B21-S03 (same room) and OD-B21-S04 (whose computed exit
   occupancy this scene imports and translates back indoors).

   Beats (causal order, one master clock):
     1. Back in the hall, out of the near corner, the beggar asks for the bow —
        not to win the queen, only to put his hands on it and find out what is
        left in them.
     2. The house comes off its benches in one noise. The register of the noise
        moves: a shout, then a threat, then a suspicion turned sideways onto
        each other — who put him up to this — then a jeer, because a beggar
        with a bow is either a scandal or a joke and they cannot decide which.
     3. Penelope holds that a guest in her house is not to be shamed, and
        promises the stranger a cloak, a tunic, sandals, a sword and a bow of
        his own if he can bend this one.
     4. Telemachus comes off his own chair and takes the thing over: no man in
        Ithaca has more right than he to give this bow away or keep it, and
        his mother is to go up to her own rooms and leave the weapons to the
        men. The uproar folds — not from conviction; they let him have it.
     5. Eumaeus carries the bow out of the doorway, across the floor, through
        the shouting, and puts it into the beggar's hands.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. NOTHING HAND-PLACED. Every body in this scene is resolved by STATION NAME
      through a plan and `blockingAt()` does the arithmetic. There is not one
      invented coordinate in the blocking table.

   B. THE ROOM IS STATE, AND IT IS THE SAME ROOM (brief §D). One field,
      `location.megaron-hall`, cast ONCE, in its `contest` state with the
      `axes` layer on, for every frame — exactly the room OD-B21-S03 handed
      over and OD-B21-S04 left standing while the men were outside: benches and
      tables shoved to the walls, hearth raked flush, one trench down the spine
      with the twelve heads in it. Nothing here builds or casts a second hall.
      The layer set is S03's, verbatim, for the same two reasons:
        · `racks` stays dropped — the arms came off these walls in Book XIX.
        · `postern` stays dropped, and here the reason is even stronger than it
          was in S03. That layer paints the side door as a solid dark leaf, and
          EUMAEUS STANDS IN THAT DOORWAY FOR THE FIRST SIXTY-SIX SECONDS of
          this scene. Drafted with the leaf on he was a black mass with a face
          in it. The STATION is untouched: the plan calls the postern
          load-bearing and it still is, occupied by exactly the man who has
          just come in through it.

   C. THE LOCAL PLAN IS THE MEGARON PLUS FOUR DECLARED OFFSETS, and every one
      of the four exists because a measurement said so, not because a picture
      wanted it (brief §A/§B).
        `hand_off`   = corner_dead + (+0.18, +0.03) — THE CONTACT PAIR. The bow
                       changing hands is two bodies touching, and the megaron
                       plan has no pair in the dead corner. Resolved, the two
                       men's ink runs .045–.202 and .209–.369 of frame width:
                       adjacent, arms meeting, nothing coincident. Both feet
                       are BELOW the shoved-back left-wall furniture (which in
                       `cleared` occupies frame x .087–.254, y .74–.87), so
                       neither man is standing inside a bench.
        `sons_place` = throne + (+0.22, +0.06) — Telemachus off his own chair.
                       He CANNOT be drawn at `throne`: that station is at plan
                       x .500, i.e. ON the lane, and a body there takes rings
                       off the twelve, which is plot in S06. One step to the
                       right of the chair puts his ink at .630–.789 — clear of
                       the lane's right edge (.579 at this depth) and clear of
                       the right-wall furniture in x, with his feet at y .920,
                       in front of it.
        `the_stand`  = pillar_r + (-0.10, +0.24) — where a man stands to lift a
                       bow that is leaning on the post. `pillar_r` itself is at
                       z .44, DEEPER than the crowd's middle band (note E), and
                       drafted there the swineherd was taking up the bow from
                       behind two suitors. At z .68 he is in front of the band,
                       behind Telemachus, and his head clears Telemachus's
                       crown — the son in front, the servant at the stand
                       behind him, which is the blocking of the beat.
        `queen_step` = pillar_l + (+0.08, +0.26) — the queen off the roof post.
                       Same measurement: `pillar_l` is at z .44 and a middle-band
                       suitor printed straight across her while she was
                       speaking. Forward at z .70 she is in front of the band,
                       her ink (.297–.439) is clear of the left-wall furniture
                       and clear of the twelve, and a queen arguing with the
                       whole house is not leaning on a post anyway.

   D. ONE BODY, ONE GUISE CHANNEL, HELD AT ZERO (brief §C). Odysseus is
      `character.odysseus-b16` with `guise:"beggar"` and the channel does not
      move for a hundred seconds. S04 let the ramp go to 0.34 and the stoop
      come out of him, because the only two men who could see him were the two
      who had just been told. Here the two men who know are behind him and the
      hundred who do not are in front of him, so the ramp goes back to 0 and
      stays. There is no restoration flare, no cut to `.odysseus-restored`, and
      no second Odysseus module: one body, one channel, and the channel is
      pinned. Holding still is the hardest thing this body does in Book XXI.

   E. THE CROWD IS TWO BLITS AT TWO DEPTHS, AND THAT IS THE ONE THING THIS
      SCENE DOES THAT S03 DID NOT. `ensemble.suitor-uproar` was authored for
      this scene (its own `scene:` field says so) and it builds THREE depth
      bands whose footlines are fixed fractions of its sheet — back .545, mid
      .725, front .905. S03 blitted its line ONCE, behind everything, which
      only works while every named body is nearer than every seated man. That
      is impossible here: a crowd deep enough to sit behind a body at z .44
      would have to be drawn at .30 of frame width, i.e. thirty-pixel men. So
      the ensemble is blitted TWICE, one layer subset per band, and each blit
      is pushed into the depth queue at the z its own footline implies:
          band-back  footline .545  ->  z .116
          band-mid   footline .725  ->  z .516
      (z solved from the room's own law, y = .50 + .46 z^1.08.) The named
      bodies then interleave correctly: Eumaeus in the far doorway (z .24) is
      drawn in front of the back band and BEHIND the middle band, which is
      exactly right — he is the servant nobody in this room is looking at, and
      for sixty-six seconds a suitor prints across him. The queen (z .70), the
      son (z .92), the beggar (z .90) and the handover (z .93) are all in front
      of both bands.
      THE FRONT BAND IS DROPPED, and that is a tone decision as much as a depth
      one. Its footline is .905 — the near floor, where all four named bodies
      stand — so it both fights them for ground and fills the bottom of the
      frame with near cropped bodies. Ten men in two rows across the middle
      distance say "the whole house is on its feet" and leave the near floor as
      paper. `hall` is dropped (it prints a second megaron), `floor` is dropped
      (the room has its own), `place` is dropped (it paints the master's step
      and a standing spear at plan centre, i.e. ON the lane, and Telemachus is
      a drawn body here, not a stance plate), `gauge` is dropped (it lands in
      the roof rafters and fights them) and `quell-ring` is dropped because it
      is drawn in ACCENT and a blue mark prints BLACK — a dashed ellipse
      0.9 of the frame wide, laid across a painted room, in ink.
      THE POPULATION IS FOUR AND FOUR, and that number is a measurement too.
      Drafted at six in the back band, four of the six landed with their heads
      on the great doors' dark leaf or on a roof pillar, and stacked with the
      middle band the left third of the frame went to mush — three heads and two
      torsos inside 0.15 of frame width. At `perRow:[4,4,·]` the back band
      resolves at frame x .185/.395/.605/.815 and the middle at
      .227/.437/.647/.858, so each far man stands just off the near man's
      shoulder with his crown ABOVE the nearer man's — a recession instead of a
      pile — and the helve column (a 0.03-wide band at frame x .485–.515) is
      left with clear paper on both sides of it. Eight men, plus four named
      bodies, plus a room whose own `contest` state says the rest of the house is
      on the shoved-back benches.
      The sheet is 532x361 — the STAGE's own aspect, so member x fractions land
      on the same frame x fractions — and blitted 1:1 onto the whole frame. At
      that sheet size the module's absolute member heights (74px back, 112px
      mid) blit to .205 and .310 of frame height, which is what the room's own
      depth law asks for at those two footlines. The module opens by flooding
      its sheet with `inkLevel(1)` (lum .859), so both blits are keyed at
      ENS_THR = 0.845, S03's number: the field clears to the border and the
      room shows between the men, while every tone the drawing uses survives.

   F. THE NOISE IS A CHANNEL, NOT A SET OF PICTURES. The uproar walks its OWN
      declared state graph — seated -> shouting -> threatening -> suspicious ->
      ridiculing -> submitting -> yielded -> shouting -> submitting -> yielded
      — and every step is an edge the asset itself declares legal. The scene
      passes the asset's own `states.nodes[...].preview` and overrides only the
      population (`perRow`) so the number of men in the room never changes, and
      the FOCUS, which is the arc: until Telemachus is on his feet every head
      in the hall is turned onto the beggar in the corner (focusX .145); from
      the moment he stands, onto him (focusX .710, which is where `sons_place`
      actually resolves). Antinous, Eurymachus and Leiodes are carried in the
      occupancy and NOT drawn — they are inside this ensemble, which is the
      only thing they do in this scene.

   G. THE BOW IS NEVER DRAWN WITHOUT HANDS ON IT (S03 note F, same rule, same
      constants). It lies on the stand at `pillar_r` where Eurymachus set it
      down, and it is NOT DRAWN there: a weapon lying on a floor is a weapon
      the eye reads as a mark in the ink. It appears the frame Eumaeus lifts it
      (TAKE), keyed to his live blocked box at the near hand, 0.19 of a body
      height outboard and 0.16 down at the hip, so the crescent sweeps across
      the lit floor plane instead of closing round him; and at GIVE it moves to
      the beggar's box with the same two offsets. Exactly one bow, always in
      hands, and it changes hands on one frame at a contact pair.
      AND IT IS QUEUED ONE NOTCH NEARER THAN ITS CARRIER, at d + 0.05, as its
      own entry. Drafted with the carrier's own d, the handover put the bow at
      z .90 and the man handing it over at z .93, so the swineherd was painted
      over the weapon he was giving away and half the crescent vanished. A thing
      held out at arm's length IS in front of the body holding it; saying so in
      the queue is what made the bow read, and it cost no change to the two
      offsets, which stay S03's.

   H. THE ONE INSTRUMENT IS THE DEED, AND IT IS CROPPED SO THERE IS NO SECOND
      BOW. `prop.odysseuss-bow` ships a `bestowed` mode — the weapon laid flat
      across two open hands with the ownership tally cutting its third bar —
      and that is the legal question of this scene: whose bow is it to give.
      Cast whole it would put a SECOND bow in the frame, breaking note G. So it
      is windowed to everything BELOW the stave: the two open-hand contact
      brackets and the ownership tally with its seven-segment numeral. The
      window opens at SON, when Telemachus claims the right, and stays — the
      deed before the delivery. Drawn on a HALF sheet (330x440) for the reason
      S03 and S04 both record: the module's rules are typed in FIXED PIXELS, so
      halving the geometry while the rules stay put lets the same window blit at
      1.2x instead of 0.6x, and the numeral lands at 36x62px instead of
      dissolving into the dot lattice.

   I. THE ONE CROSSING OF THE LANE, AND IT IS THE PLOT. S03 kept every body off
      the spine because the count of twelve is plot. This scene breaks that
      exactly twice, both times as a WALK and never as a held frame: Eumaeus
      goes postern -> the_stand (t 66–76) and the_stand -> hand_off (t 84–93),
      and both routes cross plan x .500. That crossing IS the fifth beat — the
      bow goes across the room in a servant's hands, through the shouting. Both
      verify frames are outside both walks, and no body stands on the lane at
      any other time: the drawn ink of every station used here stops at frame x
      .439 on the left and starts at .543 on the right, and the helve rings are
      a 0.03-wide column at .485–.515.

   J. ONE DEPTH QUEUE, COMPUTED. The room paints the field; then every body and
      both crowd bands are pushed with their live blocked z (or, for the bands,
      their declared footline z) and drawn far -> near; then what each body
      carries, immediately after its carrier; then the deed plate, which is an
      overlay and is always last.

   K. TONE, AND NO OVERPAINT. `contest` is a lift-0 state; the dark states are
      Book XXII's and are never touched here. The crowd's own shading law keeps
      tunics in the paper half of the scale (levels 1–4) and only hair goes to
      5–6. NO hand-drawn ctx overpaint is added to any figure anywhere in this
      file: every mark on every body is the shared rig plus that character's
      own module. The only ctx drawing in the file is the deed plate's paper
      field and its one hard rule, which is the engine's own card idiom.

   CONTINUITY IN — computed, then TRANSLATED (brief §F). S04 played OUTDOORS,
   so its three exit stations are YARD stations and every one of them has to be
   translated or dropped:
        route_a    -> postern      Eumaeus, one pace short of the side door on
                                   the dressed slabs, comes through it. The
                                   threshold was S05's cut and this is S05.
        oath_watch -> corner_dead  the beggar, off the near ground that kept the
                                   lit doorway in view and back into the corner
                                   he has held since Book XVII.
        gate_sill  -> DROPPED      Philoetius is out at the courtyard gate doing
                                   what he was told: shutting the leaves, barring
                                   them, lashing the bar to the mooring post. He
                                   is not in this room and must not be carried
                                   into it.
   Everything else in the hall is declared in ADDED from S03's own computed exit
   — penelope `pillar_l`, telemachus `throne`, the bow on the stand at
   `pillar_r`, antinous `stair_up`, eurymachus `pillar_r`, leiodes `bench_r2`,
   melanthius back down the store passage at `storeroom`, the brazier burning
   down at `table_l`, the maids and the emptied axe chest at `storeroom` —
   because S04's occupancy is three men in a yard and cannot carry a room.
   Two of those are moved off ground this scene needs, undrawn, in the first six
   seconds, by actions the postponement already implies: eurymachus off the
   stand to `bench_r1` (he has been beaten and he sits down) and antinous off
   the foot of the queen's stair to `table_r` (the queen is about to be sent up
   it). Nobody is ever assigned a station another body holds.

   Verify (the uproar; the bow in his hands):
     node harness/render-scene.mjs scenes/OD-B21-S05.mjs --t 30
     node harness/render-scene.mjs scenes/OD-B21-S05.mjs --t 97
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import hall       from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import penelope   from "../assets/character/penelope.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import uproar     from "../assets/ensemble/suitor-uproar.mjs";
import bow        from "../assets/prop/odysseuss-bow.mjs";

/* CONTINUITY IN — the previous scene's computed exit occupancy. */
import { exitOccupancy as PREV_EXIT } from "./OD-B21-S04.mjs";

const HALL_ASSET = "location.megaron-hall";
const D = 100;

/* ---- THE LOCAL PLAN (note C) -------------------------------------------- */
const MS  = megaron.stations;
const OFF = (s, dx, dz) => ({ x:+(s.x + dx).toFixed(4), z:+(s.z + dz).toFixed(4) });

const hallPlan = makePlan({
  id:"megaron-s05",
  name:"The Great Hall at Ithaca — the ask",
  notes:"scenes/_plans/megaron.mjs entire (imported, not re-authored) plus FOUR "
       +"stations derived from it by declared offsets: `hand_off` is the contact "
       +"pair for the bow changing hands in the dead corner; `sons_place` is one "
       +"step right of the throne, because the throne is ON the axe lane and a "
       +"body there takes rings off the twelve; `the_stand` and `queen_step` are "
       +"one pace forward of the two roof pillars, because both pillars sit "
       +"DEEPER than the crowd's middle band and a suitor printed across both "
       +"speakers. No station of the megaron is moved or shadowed.",
  stations:{
    ...MS,
    hand_off:   OFF(MS.corner_dead, +0.18, +0.03),  // {x .28, z .93} contact pair
    sons_place: OFF(MS.throne,      +0.22, +0.06),  // {x .72, z .92} off his chair
    the_stand:  OFF(MS.pillar_r,    -0.10, +0.24),  // {x .64, z .68} lifting ground
    queen_step: OFF(MS.pillar_l,    +0.08, +0.26),  // {x .34, z .70} off the post
  },
  fixtures:megaron.fixtures,
});

/* ---- THE CLOCK ---------------------------------------------------------- */
const ASK    = 10;              // >>> "let me try the bow"
const ROAR   = 18;              // the house comes off its benches
const THREAT = 28;              // arms cocked, hands on hilts
const SUSPECT= 38;              // heads turned sideways: who put him up to it
const QUEEN0 = 6,  QUEEN1 = 16; // Penelope comes off the roof post
const QUEEN  = 44;              // >>> a guest in her house is not to be shamed
const PROMISE= 52;              // cloak, tunic, sandals, a sword and a bow
const MOCK   = 58;              // the jeer: let the beggar try, then
const RISE0  = 62, RISE1 = 69;  // Telemachus comes off his own chair
const SON    = 70;              // >>> the bow is mine to give or to keep
const FOLD   = 74;              // the uproar folds, mid-sweep
const UP     = 78;              // go up to your own rooms, mother
const GONE   = 82;              // she is off the floor; the stair is in the seam
const WALK0  = 66, WALK1 = 76;  // Eumaeus, the doorway -> the stand
const TAKE   = 78;              // he takes the bow up
const BRAY   = 84;              // the hall shouts at the swineherd
const CARRY0 = 86, CARRY1 = 94; // the stand -> the beggar, across the floor
const CHECK  = 89;              // Telemachus checks them; the hall folds again
const GIVE   = 95;              // >>> the bow into the beggar's hands
const YIELD  = 97;              // yielded, and the grumble never reaches zero

/* ---- THE ROOM (note B) -------------------------------------------------- */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill",
                     "maidsdoor","stair","pillars","lane","hearth","furniture",
                     "litter","throne","axes"];

/* ---- CONTINUITY IN, TRANSLATED (brief §F) ------------------------------- */
const YARD_TO_HALL = {
  route_a:    "postern",      // the swineherd, in through the side door
  oath_watch: "corner_dead",  // the beggar, back into his corner
  // gate_sill: DROPPED — Philoetius is out at the gate, barring it
};
const CARRIED = Object.fromEntries(Object.entries(PREV_EXIT)
  .map(([who, st]) => [who, YARD_TO_HALL[st]])
  .filter(([, st]) => st));

/* what the hall still holds, from S03's own computed exit — S04's occupancy is
   three men in a yard and cannot carry a room. */
const ADDED = {
  penelope:  "pillar_l",   // leaning on the pillar of the roof (21.64)
  telemachus:"throne",     // in his own chair since he leaned the bow aside
  bow:       "pillar_r",   // on the stand where Eurymachus set it down
  antinous:  "stair_up",   // at the foot of the queen's stair — undrawn
  eurymachus:"pillar_r",   // beaten, still on the stand — undrawn
  leiodes:   "bench_r2",   // apart on the near right — undrawn
  melanthius:"storeroom",  // back down the store passage — undrawn
  fire:      "table_l",    // the brazier burning down — undrawn
  maids:     "storeroom",
  axes:      "storeroom",  // the emptied chest
};
const INITIAL = { ...ADDED, ...CARRIED };

/* ---- BLOCKING. Stations, not coordinates (notes A, C, I). --------------- */
const MOVES = [
  /* housekeeping, undrawn, in the first six seconds — both by actions the
     postponement already implies, and both to free ground this scene needs */
  { who:"eurymachus", from:"pillar_r",   to:"bench_r1",   t0:0, t1:5 },
  { who:"antinous",   from:"stair_up",   to:"table_r",    t0:0, t1:6 },

  /* the queen comes off the roof post onto the open floor to speak */
  { who:"penelope",   from:"pillar_l",   to:"queen_step", t0:QUEEN0, t1:QUEEN1 },
  /* and goes up. The walk crosses the spine, so it is put in the seam: she is
     not drawn from GONE, and the occupancy climbs the stair behind the cut. */
  { who:"penelope",   from:"queen_step", to:"stair_up",   t0:GONE, t1:GONE + 8 },

  /* the son off his own chair — one step right of it, never onto the lane */
  { who:"telemachus", from:"throne",     to:"sons_place", t0:RISE0, t1:RISE1 },

  /* the swineherd: the side door -> the stand -> the beggar (note I) */
  { who:"eumaeus",    from:"postern",    to:"the_stand",  t0:WALK0,  t1:WALK1 },
  { who:"eumaeus",    from:"the_stand",  to:"hand_off",   t0:CARRY0, t1:CARRY1 },

  /* the bow travels with whoever has hold of it, and ends in the beggar's
     station the way a carried thing does */
  { who:"bow", from:"pillar_r",  to:"the_stand",   t0:TAKE - 2, t1:TAKE,   kind:"prop" },
  { who:"bow", from:"the_stand", to:"hand_off",    t0:CARRY0, t1:CARRY1,   kind:"prop" },
  { who:"bow", from:"hand_off",  to:"corner_dead", t0:GIVE,   t1:GIVE + 3, kind:"prop" },
];

/* ---- THE BOX A BODY IS DRAWN IN (verbatim device from S01 / S02 / S03) ---
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide), and every character module in this repo lays its garment out in
   fractions of its box WIDTH, so a landscape box turns a body into a bell.
   Every figure here is drawn into the PORTRAIT box the atlas uses for
   characters, 660/880, and blitted. FIG_FLOOR is the rig's own floor line:
   figure-hero plants the ankles at 0.90 of its box height. K_HALL is S02's
   one height for every adult in this room, unchanged through S03 and unchanged
   here, so a body cut between these scenes does not change size. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
const K_HALL    = 0.46;

/* blit a module into a box of a chosen aspect, anchored by a point INSIDE the
   box. `sig` is required: keyedModuleCanvas caches on pose/band/mode/t only, so
   without it a change of gaze, brow or guise returns the previous frame. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* PLATE — blit one declared WINDOW of a whole-frame drawing, keyed, so the room
   shows between its lines and the drawing's own frame furniture stays out. */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* A DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses. Keyed straight onto the room, the roof
   plane's rafters run through the drawing and it stops reading as a diagram.
   (Verbatim device from OD-B20-S03 / OD-B21-S01..S04.) */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

/* ---- THE CROWD, TWO BLITS AT TWO DEPTHS (notes E, F) --------------------
   The sheet carries the STAGE's aspect so member x fractions land on the same
   frame x fractions, and it is blitted 1:1 over the whole frame, so the
   module's absolute member heights (74px back, 112px mid on a 361-tall sheet)
   arrive at .205 and .310 of frame height — which is what the room's own depth
   law asks for at footlines .545 and .725. Z_BACK / Z_MID are those two
   footlines solved back through y = .50 + .46 z^1.08. */
const ENS_CW = 532, ENS_CH = 361;
const ENS_FULL = { x0:0, y0:0, x1:1, y1:1 };
const ENS_THR  = 0.845;
const Z_BACK = 0.116, Z_MID = 0.516;

/* population and instrument switches held CONSTANT across every state, so the
   number of men in the room never changes and no band ever prints a second
   megaron, a stance plate on the lane, or an accent-blue ellipse in ink. */
const CROWD_FIXED = {
  rows:3, perRow:[4,4,5], density:1.0, seed:2141, t:0.5,
  showHall:false, showPlace:false, showRing:false, showGauge:false,
};
/* the FOCUS is the arc: every head onto the beggar in the corner until the son
   is on his feet, then onto him. .710 is where `sons_place` actually resolves. */
const focusOf = t => (t < RISE1 ? { focusX:0.145, focusY:0.780 }
                                : { focusX:0.710, focusY:0.720 });
/* the asset's own state graph, walked along its own declared edges */
const crowdNode = t => t < ASK     ? "seated"
                     : t < THREAT  ? "shouting"
                     : t < SUSPECT ? "threatening"
                     : t < MOCK    ? "suspicious"
                     : t < FOLD    ? "ridiculing"
                     : t < FOLD+6  ? "submitting"
                     : t < BRAY    ? "yielded"
                     : t < CHECK   ? "shouting"
                     : t < YIELD   ? "submitting"
                     :               "yielded";
function crowdState(t){
  const node = crowdNode(t);
  return { node, s:{ ...uproar.states.nodes[node].preview,
                     ...CROWD_FIXED, ...focusOf(t) } };
}

/* ---- THE BOW (constants from S01/S02/S03, unchanged): in mode `carried` the
   bow lies on the diagonal of its box and the grip block — the ivory plate
   under the carry strap — is at (.667,.566). It goes on the NEAR hand, 0.19 of
   a body height outboard, and is carried LOW, at 0.16 of a body height. */
const BOW_AR   = FIG_AR;
const BOW_H    = 0.88;
const BOW_GRIP = { x:0.667, y:0.566 };
const BOW_OUT  = 0.19;
const BOW_LOW  = 0.16;
/* NO exception, and that was drafted three ways before it was left alone. The
   temptation at the handover is to lift the bow into the GAP between the two
   men, at the height their hands are — and drafted that way (0.40 outboard,
   0.30 up) the crescent became a swoosh across the swineherd's chest, because a
   crescent with a paper interior only reads when it is over paper. On S03's own
   two numbers it comes down the beggar's near side and sweeps along the lit
   floor with its lower ear almost on the boards, which is both what an unstrung
   reflexed bow does in one hand and the one place in this corner where there is
   clean floor for it to be seen against. What actually needed fixing was DEPTH,
   not offset: see the queue note below. */

/* ---- THE DEED (note H) --------------------------------------------------
   `bestowed` drawn on a HALF sheet, and windowed to everything BELOW the
   stave — the two open-hand contact brackets (y .575–.635 of the sheet) and
   the ownership tally with its seven-segment numeral (y .68–.79) — so there is
   never a second bow in the frame. It lands top RIGHT, the one clear wall this
   framing has, the same ground S03 gave its tallow panel. */
const BST_SHEET_W = 330, BST_SHEET_H = 440;
const BST_WIN = { x0:.195, y0:.568, x1:.790, y1:.845 };
const BST_DST = { x0:.733, y0:.048, x1:.946, y1:.243 };

export const scene = {
  id:"OD-B21-S05",
  title:"The Beggar Requests the Bow",
  book:21,
  plan:"megaron-s05",
  duration:D,
  beats:[
    "Back in the hall Odysseus asks to test his strength with the bow.",
    "The suitors erupt in anger and fear that a beggar may succeed.",
    "Penelope insists the stranger deserves a try and promises clothing and weapons if he wins.",
    "Telemachus takes authority over the bow and orders his mother upstairs.",
    "Eumaeus carries the bow through the shouting crowd to Odysseus.",
  ],

  exitState:
    "Evening of Apollo's feast day, in the megaron, still in its CONTEST " +
    "state and unchanged as architecture: the tables and benches shoved back " +
    "against the walls, the hearth raked flush, the great doors shut, and the " +
    "twelve axe heads standing haft-down in the trench along the spine with " +
    "every socket eye on one line — the count is intact, because the only " +
    "thing that has crossed the lane all evening is a swineherd carrying a " +
    "bow, twice, on his feet. WHAT HAS CHANGED IS WHO IS HOLDING THE BOW. It " +
    "is out of the house's hands for good: it came off the stand at the " +
    "right-hand roof pillar where Eurymachus left it, went into Eumaeus's " +
    "hands on Telemachus's word, crossed the floor through the shouting, and " +
    "is now in the beggar's own two hands in the near corner (`bow` -> " +
    "`corner_dead`, sharing his station the way a carried thing does), " +
    "unstrung, still reflexed, its string coiled off one ear. He has not " +
    "touched the string yet. He is still the beggar and nothing about him has " +
    "changed: guise `beggar`, the ramp pinned at 0 for the whole scene, no " +
    "god has been near him, and the two men who know who he is are one at the " +
    "side door and one out at the gate. He holds `corner_dead`, apart, with " +
    "the weapon. EUMAEUS IS AT THE HANDOVER (`hand_off`), a pace off the " +
    "beggar's shoulder, having just put it into his hands and not yet moved " +
    "away — the first of the three orders given in the yard is now carried " +
    "out, and it is the only one of the three that had to happen in front of " +
    "everybody. TELEMACHUS IS ON THE FLOOR, not in his chair: he holds " +
    "`sons_place`, one step to the right of the throne, having taken the whole " +
    "question over in public — no man in Ithaca has more right than he to give " +
    "this bow away or keep it — and having twice checked the hall when it " +
    "turned on the servant. He is between the house and his father and he does " +
    "not know it. PENELOPE IS GONE UP. She came off the roof post to speak for " +
    "the stranger and promised him a cloak, a tunic, sandals, a sword and a " +
    "bow of his own if he could bend this one; she was then sent to her own " +
    "rooms by her son in front of the whole house and she went (`penelope` -> " +
    "`stair_up`), so she is off the floor and out of the room for the killing, " +
    "which is the reason the order was given. THE HOUSE IS YIELDED AND STILL " +
    "GRUMBLING. `ensemble.suitor-uproar` ends in its `yielded` node — palms " +
    "turned out, arms down, heads level, the residual heat never reaching zero " +
    "— after going through a shout, a threat, a suspicion turned sideways onto " +
    "each other, a jeer, a fold, and one more shout at the swineherd. They " +
    "have let a beggar take the bow because letting him take it is funnier " +
    "than the alternative. Antinous is at the right-hand table, Eurymachus on " +
    "the right bench where he sat down after being beaten, Leiodes apart on the " +
    "near right with his prophecy still unanswered, Melanthius back down the " +
    "store passage, the brazier burning down at the left table, the maids and " +
    "the emptied axe chest at the mouth of the arms passage. Philoetius is NOT " +
    "in this room: he is out at the courtyard gate, which by now is shut, " +
    "barred and lashed to the mooring post. The next thing that happens is " +
    "that the beggar turns the bow over in his hands like a man checking a " +
    "lyre, and strings it.",
  exitOccupancy:occupancyAt(hallPlan, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    odysseus:"none — the seam between S04 and S05 covers the walk back in " +
             "through the side door. He opens the scene where he has been " +
             "since Book XVII, apart in the near corner (`corner_dead`), in " +
             "guise `beggar`",
    eumaeus:"in through the side door — S04 left him one pace short of it on " +
            "the dressed slabs (`route_a`), and this scene opens with him " +
            "standing in it (`postern`), carrying the first of the three " +
            "orders and waiting to be asked",
    penelope:"none — already at `pillar_l`, leaning on the pillar of the roof " +
             "since 21.64; she comes forward onto the open floor (`queen_step`) " +
             "between t=6 and t=16, before she is drawn speaking",
    telemachus:"none — in his own chair (`throne`) since he leaned the bow " +
               "aside at the top of S03. He is NOT DRAWN until he stands, " +
               "because `throne` is at plan x .500, on the lane, and a body " +
               "there takes rings off the twelve",
    crowd:"none — the house is on the benches when the scene opens, in the " +
          "ensemble's own `seated` node, attention scattered, low noise. It " +
          "comes off them at ASK=10",
    antinous:"none — carried at `stair_up` and never drawn; he is inside the " +
             "ensemble, and he yields the foot of the stair at t=6 because the " +
             "queen is about to be sent up it",
    eurymachus:"none — carried, off the stand to `bench_r1` by t=5, undrawn",
    leiodes:"none — carried at `bench_r2`, undrawn",
  },
  exits:{
    penelope:"UP THE STAIR. She is drawn until UP=78 and off the floor from " +
             "GONE=82; the occupancy walks `queen_step` -> `stair_up` between " +
             "t=82 and t=90. The walk itself crosses the spine, which nothing " +
             "in this hall is allowed to do in a held frame, so it is put in " +
             "the seam behind the cut — the last thing the audience sees of " +
             "her is a woman turning away from her son, which is the beat",
    eumaeus:"none — he ends at `hand_off`, a pace off the beggar's shoulder, " +
            "with the bow just out of his hands",
    telemachus:"none — he holds `sons_place`",
    odysseus:"none — he holds `corner_dead`, with the bow",
    bow:"off the stand at `pillar_r` (TAKE=78), across the floor in the " +
        "swineherd's hands (CARRY0=86 to CARRY1=94), into the beggar's hands " +
        "at GIVE=95, and it shares his station from there",
    antinous:"none — `table_r`", eurymachus:"none — `bench_r1`",
    leiodes:"none — `bench_r2`", melanthius:"none — `storeroom`",
    fire:"none — still burning down at `table_l`",
    maids:"none — off frame at `storeroom` with the emptied chest",
  },
  walkable:{
    allowed:["corner_dead","hand_off","postern","the_stand","sons_place",
             "queen_step","pillar_l","pillar_r","stair_up","storeroom",
             "doorway_maid"],
    forbidden:["threshold","door_main","shot_mark","axe_first","axe_last",
               "throne","hearth","bench_l1","bench_l2","bench_r1","bench_r2",
               "table_l","table_r"],
    note:"the LANE (plan x .415–.585) and the SILL are empty in every held " +
         "frame, because a body drawn there takes rings off the twelve and the " +
         "count is plot in S06. `throne` is forbidden for the same reason and " +
         "that is why the son has `sons_place`. The hearth ring is raked flush " +
         "but is still the fire. ALL SIX bench and table stations are seats and " +
         "prop grounds, never stood on: in `cleared` the room paints the " +
         "shoved-back furniture at frame x .087–.254 and .745–.872, y .74–.87, " +
         "and every one of those stations puts a body's feet inside its own " +
         "table. The two crossings of the lane are Eumaeus's two walks with the " +
         "bow, t=66–76 and t=86–94, and they are walks, never held frames.",
  },
  depthOrder:"the room paints the field; then ONE queue holding every body at " +
             "its LIVE blocked z AND the crowd's two bands at the z their own " +
             "footlines imply (back .116, mid .516), sorted every frame and " +
             "drawn far -> near: the back band, the swineherd in the far " +
             "doorway (.24), the middle band, the queen on the open floor " +
             "(.70), the beggar in the corner (.90), the son off his chair " +
             "(.92) and the handover (.93) painted last; then what each body " +
             "carries, immediately after its carrier; then the deed plate, " +
             "which is an overlay and is always last.",
  gazeTargets:{
    odysseus:"the bow, without a break, in whatever hands it is in — and the " +
             "floor whenever the shouting is aimed at him, because a beggar " +
             "who stares back is a beggar who gets thrown out",
    penelope:"the house while she argues with it, then the stranger while she " +
             "makes the promise, then her son, then away",
    telemachus:"the whole hall for the claim, his mother for the order, the " +
               "swineherd and then the hall again for the check",
    eumaeus:"his own master's son, waiting to be asked; then the bow; then, " +
            "when the noise comes at him, the son again; then the beggar's hands",
    crowd:"the beggar in the corner until the son is on his feet (focusX " +
          ".145), then the son (focusX .710) — except in the `suspicious` " +
          "node, where the register turns every head onto its NEIGHBOUR " +
          "instead, which is the whole content of that beat",
  },
  attachments:[
    { at:TAKE,   who:"eumaeus",  change:"prop.odysseuss-bow at his grip, mode " +
      "`carried`, near hand, hip height — off the stand at `pillar_r`" },
    { at:SON,    who:"deed_01",  change:"prop.odysseuss-bow in mode `bestowed`, " +
      "windowed to the two open-hand contact brackets and the ownership tally " +
      "ONLY — the deed, not a second bow" },
    { at:GIVE,   who:"odysseus", change:"the bow leaves Eumaeus's hands and is " +
      "keyed to the beggar's live blocked box with the same two offsets" },
  ],
  sound:[
    { at:ASK,     source:"corner_dead", cue:"a beggar's voice, level, asking for a weapon" },
    { at:ROAR,    source:"row:front",   cue:"a hundred men off their benches at once" },
    { at:THREAT,  source:"row:mid",     cue:"hilts moving in their scabbards" },
    { at:SUSPECT, source:"row:back",    cue:"the room muttering sideways at itself" },
    { at:QUEEN,   source:"queen_step",  cue:"a woman's voice over the top of it, unhurried" },
    { at:MOCK,    source:"row:front",   cue:"laughter, which is worse than the shouting" },
    { at:SON,     source:"sons_place",  cue:"a young man's voice claiming a thing in public" },
    { at:UP,      source:"sons_place",  cue:"an order given to his own mother" },
    { at:BRAY,    source:"row:mid",     cue:"the hall turning on a servant" },
    { at:CHECK,   source:"sons_place",  cue:"one voice stopping it, and the hall letting him" },
    { at:GIVE,    source:"hand_off",    cue:"horn and sinew coming to rest in two hands" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:HALL_ASSET, instance:"hall_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"ensemble.suitor-uproar", instance:"crowd_back",
      anchor:{x:.50,y:.55}, scale:1.0, state:"seated" },
    { asset:"ensemble.suitor-uproar", instance:"crowd_mid",
      anchor:{x:.50,y:.73}, scale:1.0, state:"seated" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.25,y:.60}, scale:.36, band:"threeq", pose:"eum_listen" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.37,y:.81}, scale:.46, band:"threeq", pose:"guarded_withdrawal" },
    /* the atlas job names `character.odysseus-as-beggar`; Book XVI+ casts the
       continuity body `character.odysseus-b16` with guise:"beggar" instead
       (brief §C) — one module, one guise channel, never a cut. */
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.12,y:.91}, scale:.52, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.71,y:.92}, scale:.53, band:"threeq", pose:"walk_neutral" },
    { asset:"prop.odysseuss-bow", instance:"bow_01",
      anchor:{x:.62,y:.75}, scale:.41, state:"carried" },
    { asset:"prop.odysseuss-bow", instance:"deed_01",
      anchor:{x:.84,y:.24}, scale:.21, state:"bestowed" },
  ],

  timeline:[
    /* 1. THE ASK */
    { op:"actor.pose",  target:"odysseus",   at:0,        args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:0,        args:{ gaze:{ x:.42, y:.08 } } },
    { op:"actor.pose",  target:"penelope",   at:0,        args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze",  target:"penelope",   at:0,        args:{ gaze:{ x:.30, y:.10 } } },
    { op:"actor.pose",  target:"eumaeus",    at:0,        args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:0,        args:{ gaze:{ x:.44, y:.10 } } },
    { op:"actor.pose",  target:"odysseus",   at:ASK,      args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"odysseus",   at:ASK,      args:{ gaze:{ x:.46, y:-.06 } } },
    { op:"set.state",   target:"crowd_back", at:ASK,      args:{ state:"shouting" } },
    { op:"set.state",   target:"crowd_mid",  at:ASK,      args:{ state:"shouting" } },

    /* 2. THE UPROAR */
    { op:"actor.pose",  target:"odysseus",   at:ROAR,     args:{ pose:"head_lowered" } },
    { op:"actor.gaze",  target:"odysseus",   at:ROAR,     args:{ gaze:{ x:.20, y:.46 } } },
    { op:"actor.pose",  target:"penelope",   at:ROAR,     args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"penelope",   at:ROAR,     args:{ gaze:{ x:.38, y:.02 } } },
    { op:"set.state",   target:"crowd_back", at:THREAT,   args:{ state:"threatening" } },
    { op:"set.state",   target:"crowd_mid",  at:THREAT,   args:{ state:"threatening" } },
    { op:"actor.pose",  target:"eumaeus",    at:THREAT,   args:{ pose:"eum_skeptic" } },
    { op:"actor.gaze",  target:"eumaeus",    at:THREAT,   args:{ gaze:{ x:.36, y:.06 } } },
    { op:"set.state",   target:"crowd_back", at:SUSPECT,  args:{ state:"suspicious" } },
    { op:"set.state",   target:"crowd_mid",  at:SUSPECT,  args:{ state:"suspicious" } },
    { op:"actor.pose",  target:"odysseus",   at:SUSPECT,  args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:SUSPECT,  args:{ gaze:{ x:.34, y:.16 } } },

    /* 3. THE QUEEN */
    { op:"actor.pose",  target:"penelope",   at:QUEEN,    args:{ pose:"penelope_plea" } },
    { op:"actor.gaze",  target:"penelope",   at:QUEEN,    args:{ gaze:{ x:.42, y:-.04 } } },
    { op:"actor.pose",  target:"penelope",   at:PROMISE,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"penelope",   at:PROMISE,  args:{ gaze:{ x:-.34, y:.14 } } },
    { op:"actor.pose",  target:"odysseus",   at:PROMISE,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:PROMISE,  args:{ gaze:{ x:.30, y:.02 } } },
    { op:"set.state",   target:"crowd_back", at:MOCK,     args:{ state:"ridiculing" } },
    { op:"set.state",   target:"crowd_mid",  at:MOCK,     args:{ state:"ridiculing" } },
    { op:"actor.pose",  target:"penelope",   at:MOCK,     args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"penelope",   at:MOCK,     args:{ gaze:{ x:.40, y:.06 } } },

    /* 4. THE SON */
    { op:"actor.pose",  target:"telemachus", at:RISE0,    args:{ pose:"walk_neutral" } },
    { op:"actor.gaze",  target:"telemachus", at:RISE0,    args:{ gaze:{ x:-.26, y:.10 } } },
    { op:"actor.pose",  target:"telemachus", at:SON,      args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"telemachus", at:SON,      args:{ gaze:{ x:-.34, y:-.08 } } },
    { op:"actor.pose",  target:"odysseus",   at:SON,      args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:SON,      args:{ gaze:{ x:.48, y:-.02 } } },
    { op:"set.state",   target:"crowd_back", at:FOLD,     args:{ state:"submitting" } },
    { op:"set.state",   target:"crowd_mid",  at:FOLD,     args:{ state:"submitting" } },
    { op:"actor.pose",  target:"telemachus", at:UP,       args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"telemachus", at:UP,       args:{ gaze:{ x:-.44, y:.04 } } },
    { op:"actor.pose",  target:"penelope",   at:UP,       args:{ pose:"penelope_mourn" } },
    { op:"actor.gaze",  target:"penelope",   at:UP,       args:{ gaze:{ x:-.20, y:.34 } } },
    { op:"set.state",   target:"crowd_back", at:FOLD+6,   args:{ state:"yielded" } },
    { op:"set.state",   target:"crowd_mid",  at:FOLD+6,   args:{ state:"yielded" } },

    /* 5. THE BOW GOES ACROSS THE ROOM */
    { op:"actor.pose",  target:"eumaeus",    at:WALK0,    args:{ pose:"walk_neutral" } },
    { op:"actor.gaze",  target:"eumaeus",    at:WALK0,    args:{ gaze:{ x:.30, y:.10 } } },
    { op:"actor.pose",  target:"eumaeus",    at:TAKE,     args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"eumaeus",    at:TAKE,     args:{ gaze:{ x:-.14, y:.40 } } },
    { op:"set.state",   target:"crowd_back", at:BRAY,     args:{ state:"shouting" } },
    { op:"set.state",   target:"crowd_mid",  at:BRAY,     args:{ state:"shouting" } },
    { op:"actor.pose",  target:"eumaeus",    at:BRAY,     args:{ pose:"eum_ward" } },
    { op:"actor.gaze",  target:"eumaeus",    at:BRAY,     args:{ gaze:{ x:.34, y:-.04 } } },
    { op:"actor.pose",  target:"telemachus", at:CHECK,    args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:CHECK,    args:{ gaze:{ x:.30, y:-.02 } } },
    { op:"set.state",   target:"crowd_back", at:CHECK,    args:{ state:"submitting" } },
    { op:"set.state",   target:"crowd_mid",  at:CHECK,    args:{ state:"submitting" } },
    { op:"actor.pose",  target:"odysseus",   at:CARRY0,   args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:CARRY0,   args:{ gaze:{ x:.34, y:.20 } } },
    { op:"actor.pose",  target:"eumaeus",    at:GIVE,     args:{ pose:"eum_welcome" } },
    { op:"actor.gaze",  target:"eumaeus",    at:GIVE,     args:{ gaze:{ x:-.36, y:.18 } } },
    { op:"actor.pose",  target:"odysseus",   at:GIVE,     args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at:GIVE,     args:{ gaze:{ x:.10, y:.30 } } },
    { op:"actor.pose",  target:"telemachus", at:GIVE,     args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"telemachus", at:GIVE,     args:{ gaze:{ x:-.40, y:.12 } } },
    { op:"set.state",   target:"crowd_back", at:YIELD,    args:{ state:"yielded" } },
    { op:"set.state",   target:"crowd_mid",  at:YIELD,    args:{ state:"yielded" } },
    { op:"timeline.capture", target:"OD-B21-S05", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(hallPlan, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.06 + 0.90 * (t / D));

    /* --- 1. THE ROOM. One field; it paints the world and everything else keys
       onto it. Placed the way every Book XVI+ scene places this hall — anchor
       (.50,.99), scale 1.0 — so it registers on B18–B21's hall exactly. ----- */
    placeInstance(offctx, W, H, hall, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"contest", t:breath, layers:HALL_LAYERS,
        status: t >= GIVE   ? "IN HIS HANDS"
              : t >= TAKE   ? "ACROSS THE FLOOR"
              : t >= SON    ? "MINE TO GIVE"
              : t >= QUEEN  ? "NOT TO BE SHAMED"
              : t >= ROAR   ? "THE HOUSE IS UP"
              : t >= ASK    ? "HE ASKS FOR IT"
              :               "THE TWELVE STAND",
        progress:prog,
      },
    });

    /* --- 2. ONE DEPTH QUEUE (note J). ----------------------------------- */
    const queue = [];
    const push = (d, draw) => queue.push({ d, draw });

    /* THE CROWD — the same module twice, one band each, each at the z its own
       footline implies (note E). One blit cannot interleave with four bodies
       spread over z .24 to .93; two can. */
    {
      const { node, s } = crowdState(t);
      const band = (layer, z) => push(z, () => plate(
        offctx, W, H, uproar, ENS_CW, ENS_CH, ENS_FULL, ENS_FULL,
        { ...s, layers:[layer], status:s.status, progress:prog },
        `uproar|${layer}|${node}|${Math.round((s.wave ?? 0) * 50)}`
        + `|${Math.round((s.uproar ?? 1) * 50)}|${Math.round((s.attention ?? 0) * 50)}`
        + `|${s.register}|${Math.round(s.focusX * 100)}`,
        ENS_THR));
      band("band-back", Z_BACK);
      band("band-mid",  Z_MID);
    }

    /* one figure, from the plan, into the portrait box, at the room's one
       height times this station's own depth falloff. `holds` says whether the
       bow is in this body's hands on this frame. */
    const figure = (who, mod, extra, statusOf, holds = () => false) => {
      const p = blk[who], s = st[who] || {};
      const scale = K_HALL * p.scale;
      const pose  = p.moving ? "walk_neutral" : (s.pose || "neutral");
      const gaze  = s.gaze || { x:0, y:.06 };
      const ex    = extra(t);
      const state = {
        t: p.moving ? (t * 0.40) % 4 : breath,
        band:"threeq", pose, gaze,
        status: statusOf(t), progress:prog,
        ...ex,
      };
      const sig = `${who}|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
                + `|${Math.round(t)}|${ex.guise && ex.guise.u != null
                                        ? Math.round(ex.guise.u*24) : "-"}`;
      push(p.d, () => {
        place(offctx, W, H, mod, {
          x:p.x, y:p.y, hFrac:scale, ar:FIG_AR, fx:0.5, fy:FIG_FLOOR,
          pad:FIG_PAD, state, sig,
        });
      });
      /* WHAT HE CARRIES — keyed to this body's LIVE blocked box, so a weapon in
         a hand cannot drift off it (note G). Offsets verbatim from S01/S02/S03,
         where they were solved over three drafts. It is pushed as its OWN queue
         entry at d + 0.05, one notch NEARER than the body: a thing held out in
         a hand is in front of the man holding it, and at the handover the two
         men are 0.03 of plan depth apart, so a bow queued with its carrier's
         own d disappeared under the other man. */
      if (holds(t)){
        const bodyH = scale * 0.78;
        push(p.d + 0.05, () => place(offctx, W, H, bow, {
          x: p.x + BOW_OUT * bodyH, y: p.y - BOW_LOW * bodyH,
          hFrac: scale * BOW_H, ar:BOW_AR,
          fx:BOW_GRIP.x, fy:BOW_GRIP.y, pad:0.05,
          state:{ mode:"carried", t:0.5, flex:0, owner:3,
                  status:"UNSTRUNG", progress:.18 },
          sig:"bow|carried",
        }));
      }
    };

    /* EUMAEUS — the servant nobody in this room is looking at. He stands in
       the side doorway with an order in him for sixty-six seconds, is asked,
       takes the bow off the stand, is shouted at, is covered by the master's
       son, and carries it across the floor. His hospitality pose does the
       handover, because that is what a guest-gift handover is. */
    figure("eumaeus", eumaeus,
      tt => {
        const warned  = tt >= THREAT && tt < WALK0;
        const lifting = tt >= TAKE && tt < BRAY;
        const balked  = tt >= BRAY && tt < CHECK;
        const giving  = tt >= GIVE;
        return {
          browUp:   balked ? .74 : giving ? .40 : warned ? .30 : .46,
          browKnit: balked ? .52 : warned ? .44 : lifting ? .34 : .26,
          frown:    balked ? .44 : warned ? .18 : 0,
          eyeWide:  balked ? .48 : 0,
          eyeNarrow:warned ? .34 : lifting ? .22 : .08,
          smile:    giving ? .36 : 0,
          cheek:    giving ? .28 : 0,
          jaw:      balked ? .28 : 0,
        };
      },
      tt => tt >= GIVE   ? "INTO HIS HANDS"
          : tt >= CHECK  ? "HE CARRIES IT"
          : tt >= BRAY   ? "THE HALL AT HIM"
          : tt >= TAKE   ? "HE TAKES IT UP"
          : tt >= WALK0  ? "ASKED AT LAST"
          : tt >= THREAT ? "SAYING NOTHING"
          :                "IN THE DOORWAY",
      /* the bow is in HIS hands from the frame he lifts it off the stand to the
         frame he lets go of it, and in nobody's hands before that (note G) */
      tt => tt >= TAKE && tt < GIVE);

    /* PENELOPE — drawn only while she is in the room arguing. She comes off
       the roof post, holds that a guest is not to be shamed, makes the one
       concrete promise anybody makes in this book, is laughed at, is sent
       upstairs by her own son, and goes. */
    if (t < GONE){
      figure("penelope", penelope,
        tt => {
          const arguing  = tt >= QUEEN && tt < PROMISE;
          const promising= tt >= PROMISE && tt < MOCK;
          const mocked   = tt >= MOCK && tt < UP;
          const sent     = tt >= UP;
          return {
            browUp:   promising ? .38 : sent ? .44 : .22,
            browKnit: arguing ? .48 : mocked ? .44 : sent ? .40 : .20,
            frown:    sent ? .46 : mocked ? .30 : 0,
            eyeNarrow:mocked ? .38 : arguing ? .22 : .10,
            smile:    promising ? .18 : 0,
            jaw:      arguing ? .38 : promising ? .30 : 0,
            mouthAsym:mocked ? .24 : .08,
          };
        },
        tt => tt >= UP      ? "SHE GOES UP"
            : tt >= MOCK    ? "LAUGHED AT"
            : tt >= PROMISE ? "A CLOAK AND A SWORD"
            : tt >= QUEEN   ? "MY GUEST"
            : tt >= ROAR    ? "SHE HEARS IT"
            :                 "OFF THE PILLAR");
    }

    /* ODYSSEUS — the beggar in the near corner, asking for his own bow. One
       body, one guise channel, and the channel is PINNED at `beggar` for the
       whole hundred seconds (note D): the two men who know are behind him. */
    figure("odysseus", odysseus,
      tt => ({
        guise:"beggar",
        browKnit: tt >= GIVE ? .30 : tt >= ROAR && tt < QUEEN ? .34 : .24,
        browUp:   tt >= SON ? .30 : tt >= ASK ? .22 : .10,
        eyeNarrow:tt >= GIVE ? .22 : tt >= SUSPECT ? .40 : .34,
        eyeWide:  tt >= CARRY0 && tt < GIVE ? .20 : 0,
        smile:    tt >= GIVE ? .22 : tt >= MOCK && tt < SON ? .12 : .04,
        jaw:      tt >= ASK && tt < ROAR ? .30 : 0,
        mouthAsym:tt >= MOCK && tt < SON ? .34 : .08,
      }),
      tt => tt >= GIVE   ? "HIS OWN BOW"
          : tt >= CARRY0 ? "IT IS COMING"
          : tt >= SON    ? "HIS SON SPEAKS"
          : tt >= QUEEN  ? "SHE SPEAKS FOR HIM"
          : tt >= ROAR   ? "HEAD DOWN"
          : tt >= ASK    ? "LET ME TRY IT"
          :                "THE BEGGAR",
      /* and in HIS hands from GIVE — one bow, two pairs of hands, changing on
         one frame at a contact pair, on the handover offsets */
      tt => tt >= GIVE);

    /* TELEMACHUS — NOT DRAWN until he stands, because `throne` is on the lane
       (note C). From RISE0 he is a body on the floor taking a public decision
       for the first time in his life, and twice stopping a hundred men. */
    if (t >= RISE0){
      figure("telemachus", telemachus,
        tt => {
          const claiming = tt >= SON && tt < UP;
          const ordering = tt >= UP && tt < BRAY;
          const checking = tt >= CHECK && tt < GIVE;
          const holding  = tt >= GIVE;
          return {
            browUp:   claiming ? .34 : ordering ? .20 : .24,
            browKnit: checking ? .68 : ordering ? .48 : claiming ? .36 : .28,
            frown:    checking ? .40 : ordering ? .22 : 0,
            eyeNarrow:checking ? .44 : holding ? .30 : .18,
            eyeWide:  claiming ? .22 : 0,
            jaw:      claiming ? .42 : checking ? .38 : 0,
            smile:    holding ? .14 : 0,
            mouthAsym:checking ? .30 : .10,
          };
        },
        tt => tt >= GIVE  ? "HE LET IT GO"
            : tt >= CHECK ? "LET HIM CARRY IT"
            : tt >= UP    ? "GO UP, MOTHER"
            : tt >= SON   ? "MINE TO GIVE"
            :               "OFF HIS CHAIR");
    }

    queue.sort((a, b) => a.d - b.d).forEach(q => q.draw());

    /* --- 3. THE DEED. An overlay, always last (note H). ------------------ */
    if (t >= SON){
      detailField(offctx, W, H, BST_DST);
      plate(offctx, W, H, bow, BST_SHEET_W, BST_SHEET_H, BST_WIN, BST_DST,
            { mode:"bestowed", t:0.5, owner:3,
              status: t >= GIVE ? "BESTOWED" : "TO GIVE", progress:prog },
            `deed|bestowed|${t >= GIVE ? 1 : 0}`);
    }
  },
};
export default scene;

/* named binding so OD-B21-S06 can `import { exitOccupancy as INITIAL }`.
   S06 plays in this same hall and every station above is a megaron station or
   one of this file's four declared offsets, so it needs no translation table —
   the bow is in the beggar's hands at `corner_dead`, the swineherd is a pace
   off his shoulder at `hand_off`, the son is on the floor at `sons_place`, and
   `threshold` / `shot_mark` / the whole lane are empty and have been all
   evening, which is what S06 needs and why this scene kept them clear. */
export const exitOccupancy = scene.exitOccupancy;

/* the plan is exported too, so S06 can block through the same four offsets
   rather than re-deriving them and drifting. */
export const plan = hallPlan;
