/* ============================================================
   SCENE  OD-B21-S06 — The Doors Are Secured                 (Od. 21.380–411)
   Book XXI, scene 6. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its immediate
   predecessor OD-B21-S05, whose computed exit occupancy and whose local plan
   this scene imports rather than re-deriving.

   Beats (causal order, one master clock):
     1. On Telemachus's word Eurycleia takes the fifty women out of the hall,
        drives them into their own quarters, shoots the bolt across the
        close-fitted doors and knots the strap to the jamb hook: whatever they
        hear through the wood, none of them comes out.
     2. Philoetius goes out the side door with a papyrus ship's hawser, swings
        the courtyard gate to on the bar that is already in its sockets, runs
        the cable ring to ring, fraps it, hitches it to the bar, and pulls
        against it from both sides to see that it holds. Then he comes back in
        and stands in the door he came through.
     3. All this time the beggar has the bow in his hands and is turning it
        over — every part of it, horn, core and sinew, looking for the worm
        that gets into a weapon nobody has drawn in twenty years — while the
        far end of the hall sneers that here is a great fancier of bows.
     4. The three men are at their posts and the two ways out of the house are
        shut: the women behind a bolt on the right, the yard behind a cable on
        the left, and the great doors the only leaf left in the story.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. NOTHING HAND-PLACED. Every body is resolved by STATION NAME through a
      plan and `blockingAt()` does the arithmetic. There is not one invented
      coordinate in the blocking table.

   B. THE ROOM IS STATE, AND IT IS THE SAME ROOM (brief §D). One field,
      `location.megaron-hall`, cast ONCE, in its `contest` state, with S05's
      layer list VERBATIM — including its two drops, which are inherited on
      purpose so that the room does not change across the cut:
        · `racks` stays dropped — the arms came off these walls in Book XIX.
        · `postern` stays dropped. S05 dropped it because Eumaeus stood in that
          doorway for sixty-six seconds and the layer paints it as a solid
          level-5 leaf, so he came out a black mass with a face in it. In THIS
          scene Philoetius stands in the same doorway for the last twenty-four
          seconds and ends the scene in it, so the reason is identical and the
          drop has to be identical: if S05 and S06 disagree about one wall of
          this hall they are two halls. The STATION is untouched and is exactly
          as load-bearing as the plan says: it is the way out to the yard, it
          is the route Melanthius takes for the arms in XXII, and the man
          standing in it at the end of this scene is the man who catches him.
      Nothing here builds or casts a second hall.

   C. THE LOCAL PLAN IS S05'S PLAN PLUS ONE DECLARED OFFSET. S05 exports its
      plan for exactly this reason, so the four offsets it solved (`hand_off`,
      `sons_place`, `the_stand`, `queen_step`) are imported, not re-derived, and
      cannot drift. ONE station is added, and it exists because a measurement
      said so:
        `nurse_call` = doorway_maid + (-0.16, +0.06) — {x .78, z .46}, one pace
          out of the maids' doorway onto the open floor, where the nurse takes
          the order before she goes in and bolts it. She CANNOT be drawn at
          `doorway_maid` for the length of the scene: that station resolves
          into the maids' door itself, which the room paints as a level-5 leaf
          between z .32 and .50 (frame x .803–.855), and a gray-dressed woman
          in a gray kerchief standing on it is S05's postern problem again.
          Resolved, `nurse_call` puts her box at frame x .587–.797 with her
          feet at y .699: clear of the lane's right edge (.558 at this depth)
          by .029, clear of the axe-ring column (.485–.515) entirely, and ABOVE
          the shoved-back right-hand bench (which in `cleared` occupies frame
          x .752–.872, y .709–.791), so she is standing behind the furniture
          and not inside it. She walks INTO `doorway_maid` at the end of the
          first beat and is not drawn once the bolt is shot, which is the only
          twenty seconds the dark leaf could have hurt her.
      NO CONTACT PAIR IS ADDED, and that is a fact about the scene rather than
      an omission (brief §B): nothing in it is two bodies touching. The one
      handover in this stretch of the book happened in S05, at S05's pair. What
      touches here is a woman and a bolt, and a man and a cable — a body and a
      fixture, which is an attachment, not a pair.

   D. ONE BODY, ONE GUISE CHANNEL, HELD AT ZERO (brief §C). Odysseus is
      `character.odysseus-b16` with `guise:"beggar"` and the channel does not
      move for ninety-two seconds — the module's own header names this scene in
      that guise. There is no restoration flare, no cut to `.odysseus-restored`
      and no second Odysseus module. The reason is S05's, only harder: he now
      has the weapon, and the whole hall is watching him hold it. The scene's
      content is a man being careful.

   E. THE CROWD IS ONE BLIT, AND THE BAND CHOICE IS A MEASUREMENT. S05 blitted
      `ensemble.suitor-uproar` TWICE, one layer per depth band, at the z each
      band's own footline implies (back .545 -> z .116, mid .725 -> z .516). It
      dropped the FRONT band because its footline is the near floor, where the
      named bodies stand. THIS scene has to drop the MID band as well, for the
      same kind of reason and with the same kind of arithmetic:
        · the mid band's footline is .725 and its members are .310 of frame
          height, so it occupies y .415–.725 at frame x .227/.437/.647/.858;
        · the two bodies this scene adds stand at y .699 (`nurse_call`) and
          y .598 (`postern`) — i.e. INSIDE that band, and behind it, because
          both stations are farther than z .516. Drafted with the mid band on,
          the man at frame x .647 printed straight across the nurse from the
          shoulder down, and the man at .227 printed across the cowherd.
      So the crowd is the BACK band only: four men on one line at frame
      x .185/.395/.605/.815, footline .545, up by the far wall, behind
      everything and in front of nothing. That is also what the story says is
      happening — S05 ended with the house YIELDED, and yielded men are back on
      the benches the `contest` state has already shoved against the walls,
      jeering from the far end at a beggar holding a bow. The population
      controls (`perRow`, `seed`, `density`) are S05's, unchanged, so the same
      men are in the room; only the near ranks are out of shot.
      Every one of S05's instrument drops is kept for the reasons S05 recorded:
      `hall` (it prints a second megaron), `floor` (the room has its own),
      `place` (it paints a standing spear at plan centre, i.e. ON the lane),
      `gauge` (it lands in the rafters), and `quell-ring` (it is drawn in
      ACCENT, and a blue mark prints BLACK).

   F. THE NOISE IS A CHANNEL AND IT WALKS THE ASSET'S OWN EDGES. The uproar
      opens where S05 left it, in `yielded`, and goes
        yielded -> seated -> shouting -> submitting -> yielded -> seated,
      every step an edge the asset itself declares legal. `seated` is not a
      retreat from the drama: the node's own register is "ridicule" at uproar
      .44 — the house back at its tables, sneering under its breath, which is
      precisely the line Homer gives them while he handles the bow. The FOCUS
      moves once: until the house sits down every head is still turned on the
      son who took the bow off them (focusX .710, where `sons_place` resolves);
      from then on, on the beggar in the corner who has it (focusX .140, where
      `corner_dead` resolves).

   G. THE BOW IS NEVER DRAWN WITHOUT HANDS ON IT — S05's note G, same rule and
      the same four constants, because it is the same bow in the same hands and
      it has not moved. It is in mode `carried`, keyed to Odysseus's LIVE
      blocked box at the near hand, 0.19 of a body height outboard and 0.16
      down at the hip, and it is pushed into the depth queue as its own entry
      at d + 0.05 — one notch nearer than the body, because a thing held out in
      a hand is in front of the man holding it. There is exactly one bow in the
      frame in the round, and the second instance of the module is a windowed
      SECTION (note H), which is not a bow but a drawing of one.

   H. THREE INSTRUMENTS ACROSS THE TOP, AND THE TOP IS WHERE THEY GO. Every
      required prop in this scene is an ELEVATION or a DIAGRAM — the whole
      sheet is the drawing — so each is blitted as a declared WINDOW over its
      own paper field and rule, the device S05 used for the deed plate and
      OD-B20-S03 before it. All three sit in one strip, y .052–.262:
        LEFT   `prop.courtyard-gate-and-cable`, windowed to the gate elevation
               (piers, leaves, meeting stile, bar, the two rings and the
               lashing) — the yard shut.
        CENTRE `prop.odysseuss-bow`, mode `examined`, windowed to the LAMINAE
               CROSS-SECTION ONLY: the three-ply section with its numbered
               leader lines. Two reasons for that crop, and both are hard.
               First, the mode's main figure is the bow in SHAPES.braced with a
               taut string, and this bow is not strung until S07 — a plate
               showing it braced would put a strung bow in a scene whose whole
               tension is that nobody has bent it yet. Second, note G: a second
               whole bow in the frame is a second bow. What is left when the
               braced drawing is cropped away is exactly the beat — horn, core
               and sinew, the parts a man checks for worm.
        RIGHT  `prop.womens-chamber-doors`, windowed across the leaves at bolt
               height: both pivots, the meeting stile, the bar in its two
               staples, the ring handles and the strap on its jamb hook.
      The strip stops at y .262 on purpose. The two tallest heads in this
      scene are the nurse's at `doorway_maid` (top y .313) and the cowherd's at
      `postern` (top y .277), so a strip that reached the .330 it wanted to
      would have taken the top off both of them; and it stops well clear of the
      back band, whose crowns are at y .340.
      Each plate is drawn on the sheet size its OWN rules want. The doors and
      the gate are laid out in fractions of W/H, so their sheets are sized to
      make the windowed region land near 1:1 in the frame and the fixed-pixel
      contour weights stay hard. The bow's callout numerals are typed in FIXED
      PIXELS (26 x 46), so its sheet is small (700 x 686) and the window blits
      at 0.90x, which lands the numerals at 23 x 41 instead of dissolving in
      the dot lattice.

   I. THE LANE IS EMPTY IN EVERY FRAME, AND THIS TIME THERE IS NOT EVEN A
      CROSSING. S03 kept every body off the spine because the count of twelve
      is plot; S05 broke it twice, as walks, because the bow had to cross the
      room in a servant's hands. Here nothing crosses at all. The nurse's walk
      runs right-to-right (`nurse_call` -> `doorway_maid`, plan x .78 -> .94)
      and the cowherd's runs left-to-left (`queen_step` -> `postern`, plan
      x .34 -> .06). The drawn ink of every station used in this scene stops at
      frame x .439 on the left and starts at .563 on the right; the twelve
      helve-rings are a 0.03-wide column at .485–.515. Nobody is ever assigned
      a station another body holds, and no plate is ever laid over the lane —
      the three windows are in the roof plane, and the roof is the one part of
      this room with nothing in it that S07 needs.

   J. ONE DEPTH QUEUE, COMPUTED. The room paints the field; then every body and
      the crowd's one band are pushed with their live blocked z (or, for the
      band, the z its declared footline implies) and drawn far -> near; then
      what a body carries, immediately after its carrier, one notch nearer;
      then the three plates, which are overlays and are always last.

   K. TONE, AND NO OVERPAINT. `contest` is a lift-0 state and the dark states
      are Book XXII's; nothing here touches them. The gate's own ink table is
      light planes and dark accents (plank 1, stone 1, rail 2, iron 6) and the
      doors' leaves are bare paper inside a hard contour (leafInk 0), so the
      three windows read as paper with drawing on it and give the top of the
      frame back to the page. NO hand-drawn ctx overpaint is added to any
      figure anywhere in this file: every mark on every body is the shared rig
      plus that character's own module. The only ctx drawing in the file is the
      plate field's paper and its one hard rule, which is the engine's own card
      idiom.

   CONTINUITY IN — computed, and NOT translated, because this is the same room
   (brief §E/§F). S05 ends in the megaron and every station it hands over is
   either a megaron station or one of its own four declared offsets, all of
   which are imported here, so `blockingAt()` resolves the inherited occupancy
   without a translation table and nobody is dropped:
        odysseus   corner_dead  the beggar in the near corner, with the bow
        eumaeus    hand_off     a pace off his shoulder, having just given it
        telemachus sons_place   on the floor, one step right of his own chair
        bow        corner_dead  in the beggar's hands, sharing his station
        penelope   stair_up     gone up, and not drawn: she is out of the room
        antinous   table_r      undrawn — inside the ensemble
        eurymachus bench_r1     undrawn — inside the ensemble
        leiodes    bench_r2     undrawn — inside the ensemble
        melanthius storeroom    undrawn — down the store passage
        fire       table_l      undrawn — the brazier burning down
        maids      storeroom    undrawn — and they MOVE this scene, see below
        axes       storeroom    undrawn — the emptied chest
   TWO bodies are added, because two people who have not been in this room
   since Book XX walk into the middle of it:
        eurycleia  nurse_call   the housekeeper, called out of her own doorway
        philoetius queen_step   the cowherd, in off the yard in the seam, on
                                the open floor the queen left empty in S05
   Philoetius is the one join that needs saying out loud. S04 left him at the
   yard's `gate_sill` and S05 dropped him with a note that he was already out
   there shutting and barring the gate — but S05's COMPUTED occupancy, which is
   the actual contract, does not carry him at all, and the job for THIS scene
   assigns him the fastening as a beat. So the two are reconciled the way the
   text does it: the leaves are shut and the bar is in its sockets when this
   scene's gate plate opens (`closed`), and what S06 stages is the part S05
   only promised — the ship's cable, run, frapped, hitched and TESTED. He is on
   the floor of the hall when the scene opens because he came in through the
   side door in the seam, which is the same door he goes back out of at t=38.
   And the fifty women move: `maids` walks `storeroom` -> `doorway_maid`
   undrawn between t=8 and t=20, so the occupancy agrees with the plate that
   shows them driven through the leaf and counted behind it.

   Verify (the nurse going in; the house shut):
     node harness/render-scene.mjs scenes/OD-B21-S06.mjs --t 18
     node harness/render-scene.mjs scenes/OD-B21-S06.mjs --t 78
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import hall        from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import eumaeus     from "../assets/character/eumaeus.mjs";
import eurycleia   from "../assets/character/eurycleia.mjs";
import philoetius  from "../assets/character/philoetius.mjs";
import uproar      from "../assets/ensemble/suitor-uproar.mjs";
import bow         from "../assets/prop/odysseuss-bow.mjs";
import gate        from "../assets/prop/courtyard-gate-and-cable.mjs";
import chamber     from "../assets/prop/womens-chamber-doors.mjs";

/* CONTINUITY IN — the previous scene's computed exit occupancy AND its plan,
   both named exports, so the four offsets S05 solved are not re-derived here. */
import { exitOccupancy as PREV_EXIT, plan as S05_PLAN } from "./OD-B21-S05.mjs";

const HALL_ASSET = "location.megaron-hall";
const D = 92;

/* ---- THE LOCAL PLAN (note C) -------------------------------------------- */
const MS  = S05_PLAN.stations;                 // megaron + S05's four offsets
const OFF = (s, dx, dz) => ({ x:+(s.x + dx).toFixed(4), z:+(s.z + dz).toFixed(4) });

const hallPlan = makePlan({
  id:"megaron-s06",
  name:"The Great Hall at Ithaca — the doors",
  notes:"scenes/OD-B21-S05.mjs's plan entire (imported, not re-authored: the "
       +"megaron plus S05's `hand_off`, `sons_place`, `the_stand` and "
       +"`queen_step`) plus ONE station derived from it by a declared offset. "
       +"`nurse_call` is one pace out of the maids' doorway, because "
       +"`doorway_maid` resolves onto the door's own level-5 leaf and a body "
       +"drawn there is a dark mass with a face in it. No station of the "
       +"megaron is moved or shadowed.",
  stations:{
    ...MS,
    nurse_call: OFF(MS.doorway_maid, -0.16, +0.06),   // {x .78, z .46}
  },
  fixtures:S05_PLAN.fixtures,
});

/* ---- THE CLOCK ---------------------------------------------------------- */
const ORDER  = 6;               // >>> the word to the nurse: shut them in
const DRIVE0 = 10, DRIVE1 = 19; // she crosses back into her own doorway
const GATHER = 12;              // the plate: one leaf swung, the women going through
const SETTLE = 20;              // the house sits back down at its tables
const SEAL   = 22;              // the bolt shot, the strap knotted: twelve inside
const WORD   = 26;              // >>> the second order: the yard gate
const HAUL0  = 28, HAUL1 = 37;  // the cowherd, off the floor to the side door
const OUT    = 38;              // through it; he is not in the room
const SHUT   = 42;              // the plate: leaves met, bar dropped in its sockets
const CABLE  = 50;              // six turns run ring to ring, frapped and hitched
const TURN   = 30;              // the beggar begins turning the bow over
const SECTION= 44;              // horn, core, sinew — he is looking for the worm
const MOCK   = 52;              // the jeer from the far end of the hall
const TEST   = 60;              // the cable pulled against from both sides: it holds
const CALM   = 64;              // the jeer folds
const BACK   = 68;              // he comes back in and stands in the door
const YIELD  = 70;              // the house yields again
const POST   = 76;              // the three men at their posts
const CLOSED = 84;              // both ways out are shut

/* ---- THE ROOM (note B) — S05's layer list, verbatim --------------------- */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill",
                     "maidsdoor","stair","pillars","lane","hearth","furniture",
                     "litter","throne","axes"];

/* ---- CONTINUITY IN (no translation: same room) -------------------------- */
const ADDED = {
  eurycleia:  "nurse_call",   // called out of her doorway to be given the order
  philoetius: "queen_step",   // in off the yard in the seam, on the open floor
};
const INITIAL = { ...PREV_EXIT, ...ADDED };

/* ---- BLOCKING. Stations, not coordinates (notes A, C, I). ---------------
   Two walks, and neither one goes near the spine: the nurse's runs
   right-to-right, the cowherd's left-to-left. The fifty women move undrawn. */
const MOVES = [
  { who:"maids",      from:"storeroom",  to:"doorway_maid", t0:8,     t1:20 },
  { who:"eurycleia",  from:"nurse_call", to:"doorway_maid", t0:DRIVE0, t1:DRIVE1 },
  { who:"philoetius", from:"queen_step", to:"postern",      t0:HAUL0,  t1:HAUL1 },
];

/* ---- THE BOX A BODY IS DRAWN IN (verbatim device from S01–S05) -----------
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide), and every character module in this repo lays its garment out in
   fractions of its box WIDTH, so a landscape box turns a body into a bell.
   Every figure here is drawn into the PORTRAIT box the atlas uses for
   characters, 660/880, and blitted. FIG_FLOOR is the rig's own floor line:
   figure-hero plants the ankles at 0.90 of its box height. K_HALL is S02's one
   height for every adult in this room, unchanged through S03–S05 and unchanged
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
   (Verbatim device from OD-B20-S03 / OD-B21-S01..S05.) */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

/* ---- THE CROWD, ONE BLIT AT ONE DEPTH (notes E, F) ----------------------
   The sheet carries the STAGE's aspect so member x fractions land on the same
   frame x fractions, and it is blitted 1:1 over the whole frame, so the
   module's absolute member height (74px back on a 361-tall sheet) arrives at
   .205 of frame height — which is what the room's own depth law asks for at
   footline .545. Z_BACK is that footline solved back through y = .50+.46 z^1.08.
   Sheet size, threshold, population and instrument switches are S05's numbers,
   unchanged, so it is the same crowd of the same men. */
const ENS_CW = 532, ENS_CH = 361;
const ENS_FULL = { x0:0, y0:0, x1:1, y1:1 };
const ENS_THR  = 0.845;
const Z_BACK   = 0.116;

const CROWD_FIXED = {
  rows:3, perRow:[4,4,5], density:1.0, seed:2141, t:0.5,
  showHall:false, showPlace:false, showRing:false, showGauge:false,
};
/* the focus moves once: off the son who took the bow off them, onto the beggar
   who has it. .710 and .140 are where `sons_place` and `corner_dead` resolve. */
const focusOf = t => (t < SETTLE ? { focusX:0.710, focusY:0.720 }
                                 : { focusX:0.140, focusY:0.800 });
/* the asset's own state graph, walked along its own declared edges */
const crowdNode = t => t < SETTLE ? "yielded"
                     : t < MOCK   ? "seated"
                     : t < CALM   ? "shouting"
                     : t < YIELD  ? "submitting"
                     : t < POST   ? "yielded"
                     :              "seated";
function crowdState(t){
  const node = crowdNode(t);
  return { node, s:{ ...uproar.states.nodes[node].preview,
                     ...CROWD_FIXED, ...focusOf(t) } };
}

/* ---- THE BOW (constants from S01–S05, unchanged): in mode `carried` the bow
   lies on the diagonal of its box and the grip block — the ivory plate under
   the carry strap — is at (.667,.566). It goes on the NEAR hand, 0.19 of a body
   height outboard, and is carried LOW, at 0.16 of a body height. */
const BOW_AR   = FIG_AR;
const BOW_H    = 0.88;
const BOW_GRIP = { x:0.667, y:0.566 };
const BOW_OUT  = 0.19;
const BOW_LOW  = 0.16;

/* ---- THE THREE WINDOWS (note H) ----------------------------------------
   One strip, y .052–.262, stopping above the two tallest heads (.277) and well
   clear of the back band's crowns (.340). Each sheet is sized so its own rules
   land where they can survive the dot lattice. */
const STRIP_Y0 = 0.052, STRIP_Y1 = 0.262;

/* the yard gate: drawn at the stage's own size, because the module's ring radii
   (26px) and cable ring offsets (±72px from the meeting stile) are typed in
   FIXED PIXELS against a ~1120-wide sheet — draw it smaller and the rings come
   out bigger than the leaves. Windowed to the FASTENING and nothing else: the
   two leaves meeting, the stile, both rings, the lashing between them and the
   bar with its hitch. Drafted first as the whole elevation, piers and all —
   784x338 source into 349x160 of frame, i.e. 0.46x — and every cable pass and
   plank joint turned to dotted noise. This window lands at 0.96x, so the
   contour weights the module actually typed are the weights that print. */
const GATE_CW = 1120, GATE_CH = 760;
const GATE_WIN = { x0:.272, y0:.487, x1:.728, y1:.796 };
const GATE_DST = { x0:.048, y0:STRIP_Y0, x1:.360, y1:STRIP_Y1 };

/* the bow: mode `examined`, windowed to the LAMINAE SECTION ONLY (note H) —
   the braced drawing is cropped away, so there is no second bow and no strung
   bow. The sheet is small (500x560) because the section's three callout
   numerals are typed at a FIXED 26x46 px: on a small sheet they are large
   against the section they label, and the window still blits at 0.86x, which
   lands them at 22x39. This is the ONE window that is portrait, because the
   thing it frames is — the section sits above one numeral and below another —
   and it is the one window that can be, because the column of frame above
   x .467–.575 holds nothing until the far wall at y .329. */
const SECT_CW = 500, SECT_CH = 560;
const SECT_WIN = { x0:.020, y0:.620, x1:.340, y1:.995 };
const SECT_DST = { x0:.467, y0:STRIP_Y0, x1:.585, y1:0.283 };

/* the women's doors: windowed across the leaves at BOLT HEIGHT — the meeting
   stile, both ring handles, the bar in its two staples and the strap sagging
   from the jamb hook to its knot. Sheet sized, and the window kept tight, so
   the blit MAGNIFIES (1.24x): the bar is the one level-6 accent in the drawing
   and it has to read as a bar dropped into two staples. */
const DOOR_CW = 360, DOOR_CH = 400;
const DOOR_WIN = { x0:.200, y0:.380, x1:.840, y1:.700 };
const DOOR_DST = { x0:.700, y0:STRIP_Y0, x1:.955, y1:STRIP_Y1 };

export const scene = {
  id:"OD-B21-S06",
  title:"The Doors Are Secured",
  book:21,
  plan:"megaron-s06",
  duration:D,
  beats:[
    "Eurycleia locks the women into their quarters at Telemachus's instruction.",
    "Philoetius fastens the courtyard gate with a ship's cable.",
    "Odysseus turns the bow in his hands, inspecting every part while the suitors mock him.",
    "The hidden allies take their assigned positions and the escape routes close.",
  ],

  exitState:
    "Evening of Apollo's feast day, in the megaron, still in its CONTEST state " +
    "and unchanged as architecture: the tables and benches shoved back against " +
    "the walls, the hearth raked flush, the great doors shut, and the twelve " +
    "axe heads standing haft-down in the trench along the spine with every " +
    "socket eye on one line. THE COUNT IS INTACT AND NOTHING CROSSED THE LANE " +
    "AT ALL THIS SCENE: both walks ran along their own side of the room. WHAT " +
    "HAS CHANGED IS THAT THE HOUSE IS NOW A CLOSED ROOM. The women's quarters " +
    "are sealed — Eurycleia took the fifty women off the floor on Telemachus's " +
    "word, drove them through the close-fitted doors, shot the bar across both " +
    "leaves into its two staples and knotted the strap to the jamb hook, and " +
    "she is behind it with them (`eurycleia` -> `doorway_maid`, `maids` -> " +
    "`doorway_maid`), with orders that whatever they hear through the wood — " +
    "groaning, or the thud of men — none of them comes out. " +
    "`prop.womens-chamber-doors` stands in its SEALED node, twelve counted " +
    "inside, and that is the state Book XXII needs it in: the massacre is a " +
    "closed room because of this bolt, and the twelve disloyal maids can be " +
    "produced and counted afterwards because of this tally. THE COURTYARD GATE " +
    "IS CABLED AND TESTED. Philoetius went out the side door with a papyrus " +
    "ship's hawser, shut the leaves onto the bar already in its pier sockets, " +
    "ran the cable ring to ring, frapped it at mid-span, hitched it round the " +
    "bar and then pulled against it from both sides to see that it held; " +
    "`prop.courtyard-gate-and-cable` ends in its TESTED node, turns run and " +
    "the gap at the meeting stile showing nothing. The only way out of this " +
    "house that anybody in the hall knows about is the great doors, and the " +
    "sill in front of them is empty, which is the whole point of the " +
    "arrangement. THE THREE MEN ARE AT THEIR POSTS. Odysseus holds " +
    "`corner_dead` with the bow in his own two hands (`bow` -> `corner_dead`, " +
    "sharing his station the way a carried thing does), unstrung, still " +
    "reflexed, its string coiled off one ear; he has spent the scene turning it " +
    "over and looking at every part of it — horn, core, sinew, the joints, the " +
    "ears — for the worm that gets into a weapon nobody has drawn in twenty " +
    "years, and there is none: the thing is sound. HE HAS NOT TOUCHED THE " +
    "STRING YET. He is still the beggar and nothing about him has changed: " +
    "guise `beggar`, the channel pinned at 0 for the whole scene, no god has " +
    "been near him. Eumaeus holds `hand_off`, a pace off his master's " +
    "shoulder, where he has stood since he put the bow into his hands. " +
    "Philoetius holds `postern` — standing in the side door he came back " +
    "through, which is the door to the storeroom passage and therefore the door " +
    "Melanthius will try to carry arms out of in Book XXII. Telemachus holds " +
    "`sons_place`, one step right of his own chair, facing the great doors, " +
    "having given both orders in public. PENELOPE IS UPSTAIRS and stays there " +
    "(`penelope` -> `stair_up`, undrawn). THE HOUSE IS BACK AT ITS TABLES AND " +
    "STILL SNEERING: `ensemble.suitor-uproar` ends in its `seated` node — " +
    "ranks, attention scattered, register `ridicule` at low volume — after one " +
    "flare of open jeering at the sight of a beggar handling a bow, which " +
    "Antinous's crowd have already decided is the joke of the evening. " +
    "Antinous is at the right-hand table, Eurymachus on the right bench where " +
    "he sat down after being beaten, Leiodes apart on the near right with his " +
    "prophecy still unanswered, Melanthius back down the store passage, the " +
    "brazier burning down at the left table, the emptied axe chest at the mouth " +
    "of the arms passage. The next thing that happens is that the beggar seats " +
    "the string as easily as a singer seats a new gut on a lyre, and plucks it.",
  exitOccupancy:occupancyAt(hallPlan, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    eurycleia:"none as a walk — the seam between S05 and S06 covers the " +
              "housekeeper being fetched. She opens the scene at `nurse_call`, " +
              "one pace out of her own doorway on the near right, waiting to be " +
              "given the order she can already guess at",
    philoetius:"in through the SIDE DOOR, in the seam. S04 left him out at the " +
               "yard's `gate_sill` and S05 dropped him from the room; he came " +
               "back in the way Eumaeus did, and opens this scene on the open " +
               "floor at `queen_step` — the ground the queen vacated when her " +
               "son sent her upstairs",
    odysseus:"none — he holds `corner_dead`, where S05 left him with the bow",
    eumaeus:"none — he holds `hand_off`, where S05 left him, a pace off his " +
            "master's shoulder with the bow just out of his hands",
    telemachus:"none — he holds `sons_place`, on the floor since he took the " +
               "question of the bow over in public",
    crowd:"none — the house is where S05 left it, in the ensemble's `yielded` " +
          "node, and it sits back down at its tables at SETTLE=20",
    maids:"none as a drawn body — the fifty women walk `storeroom` -> " +
          "`doorway_maid` undrawn between t=8 and t=20, which is what the " +
          "doors plate is a picture of",
  },
  exits:{
    eurycleia:"THROUGH THE DOORS SHE BOLTS. She is drawn until SEAL=22 and off " +
              "the floor from there; the occupancy walks `nurse_call` -> " +
              "`doorway_maid` between t=10 and t=19, and the last thing the " +
              "audience sees of her is an old woman going into a doorway with " +
              "fifty women in front of her. She does not come out again in " +
              "this book",
    philoetius:"OUT THE SIDE DOOR AND BACK IN AGAIN. Drawn on the floor until " +
               "OUT=38, not drawn between OUT and BACK=68 — he is in the yard, " +
               "and the yard is a plate, not a room — and drawn again from " +
               "BACK, standing in the doorway he returned through. He ends at " +
               "`postern`",
    odysseus:"none — he holds `corner_dead`, with the bow",
    eumaeus:"none — he holds `hand_off`",
    telemachus:"none — he holds `sons_place`",
    bow:"none — it does not leave his hands at any point in this scene",
    penelope:"already gone: carried at `stair_up` and never drawn",
    antinous:"none — `table_r`", eurymachus:"none — `bench_r1`",
    leiodes:"none — `bench_r2`", melanthius:"none — `storeroom`",
    fire:"none — still burning down at `table_l`",
    axes:"none — the emptied chest at `storeroom`",
  },
  walkable:{
    allowed:["corner_dead","hand_off","sons_place","queen_step","postern",
             "nurse_call","doorway_maid","stair_up","storeroom"],
    forbidden:["threshold","door_main","shot_mark","axe_first","axe_last",
               "throne","hearth","bench_l1","bench_l2","bench_r1","bench_r2",
               "table_l","table_r","the_stand"],
    note:"the LANE (plan x .415–.585) and the SILL are empty in every frame of " +
         "this scene and are never even crossed, because the count of twelve is " +
         "plot in S07 and the sill is where the archer stands. `throne` is " +
         "forbidden because it is ON the lane, which is why the son has " +
         "`sons_place`. ALL SIX bench and table stations are seats and prop " +
         "grounds, never stood on: in `cleared` the room paints the shoved-back " +
         "furniture at frame x .073–.248 and .752–.927, y .697–.859, and every " +
         "one of those stations puts a body's feet inside its own table. " +
         "`the_stand` is forbidden HERE, though S05 used it: at z .68 a body " +
         "there resolves to frame x .495–.733 and takes the top rings off the " +
         "twelve, which S05 could afford because it was a walk and this scene " +
         "cannot because it would be a held frame.",
  },
  depthOrder:"the room paints the field; then ONE queue holding every body at " +
             "its LIVE blocked z and the crowd's single band at the z its own " +
             "footline implies (back .116), sorted every frame and drawn far -> " +
             "near: the back band, the cowherd at the side door (.24), the " +
             "nurse at the maids' door (.46 -> .40), the beggar in the corner " +
             "(.90), the son off his chair (.92) and the swineherd at his " +
             "shoulder (.93); then the bow, one notch nearer than the hands " +
             "holding it; then the three plates, which are overlays and are " +
             "always last.",
  gazeTargets:{
    telemachus:"the nurse for the first order, the cowherd for the second, " +
               "then the great doors, which are the only way anybody is coming " +
               "in or going out",
    eurycleia:"her master's son while he gives the order, then the women in " +
              "front of her, then the bolt",
    philoetius:"the son while he is told, then the side door he is going out " +
               "of, then — coming back — the beggar in the corner, because he " +
               "is the only man in the room who knows what he has just done",
    odysseus:"the bow, without a break, the whole scene. He looks up exactly " +
             "once, when the jeering starts, and he looks at the floor",
    eumaeus:"his master's hands on the bow, then the hall when it starts on him",
    crowd:"the son until the house sits down (focusX .710), then the beggar in " +
          "the corner with the bow (focusX .140)",
  },
  attachments:[
    { at:0,       who:"odysseus",  change:"prop.odysseuss-bow in mode `carried` " +
      "at his near hand, hip height — inherited from S05's handover and never " +
      "put down" },
    { at:GATHER,  who:"doors_01",  change:"prop.womens-chamber-doors enters at " +
      "`gathered`: the right leaf swung inward, the women driven through, the " +
      "tally filling" },
    { at:SEAL,    who:"doors_01",  change:"-> `sealed`: both leaves shut on " +
      "their pivots, the bar shot through its two staples, the strap knotted " +
      "to the jamb hook, twelve notches solid" },
    { at:SHUT,    who:"gate_01",   change:"prop.courtyard-gate-and-cable enters " +
      "at `closed`: leaves met, bar dropped in its pier sockets, cable still " +
      "coiled under the colonnade" },
    { at:CABLE,   who:"gate_01",   change:"-> `cabled`: turns run ring to ring, " +
      "frapped at mid-span, hitched round the bar" },
    { at:TEST,    who:"gate_01",   change:"-> `tested`: hauled against from " +
      "both sides, the lashing taut, the stile showing two fingers of strain " +
      "and holding" },
    { at:SECTION, who:"sect_01",   change:"prop.odysseuss-bow in mode " +
      "`examined`, windowed to the laminae cross-section ONLY — horn, core and " +
      "sinew, numbered. A drawing of the bow, not a second bow" },
  ],
  sound:[
    { at:ORDER,  source:"sons_place",   cue:"an order given across a hall, in the clear" },
    { at:GATHER, source:"doorway_maid", cue:"fifty women moving at once, and none of them talking" },
    { at:SEAL,   source:"doorway_maid", cue:"a bar going home in two staples" },
    { at:WORD,   source:"sons_place",   cue:"the second order, quieter than the first" },
    { at:OUT,    source:"postern",      cue:"a door pulled to behind a man" },
    { at:CABLE,  source:"postern",      cue:"papyrus hawser dragging on stone, off in the yard" },
    { at:MOCK,   source:"row:back",     cue:"laughter from the far end — a great fancier of bows" },
    { at:TEST,   source:"postern",      cue:"a gate taking a man's whole weight and not moving" },
    { at:POST,   source:"corner_dead",  cue:"horn and sinew turning over in two hands" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:HALL_ASSET, instance:"hall_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"ensemble.suitor-uproar", instance:"crowd_back",
      anchor:{x:.50,y:.55}, scale:1.0, state:"yielded" },
    { asset:"character.philoetius", instance:"philoetius",
      anchor:{x:.37,y:.81}, scale:.47, band:"threeq", pose:"phi_resolve" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:.69,y:.70}, scale:.41, band:"threeq", pose:"eury_clasp" },
    /* the atlas job names `character.odysseus-as-beggar`; Book XVI+ casts the
       continuity body `character.odysseus-b16` with guise:"beggar" instead
       (brief §C) — one module, one guise channel, never a cut. */
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.12,y:.91}, scale:.52, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.71,y:.92}, scale:.53, band:"threeq", pose:"arms_crossed" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.29,y:.93}, scale:.53, band:"threeq", pose:"eum_listen" },
    { asset:"prop.odysseuss-bow", instance:"bow_01",
      anchor:{x:.20,y:.85}, scale:.46, state:"carried" },
    { asset:"prop.odysseuss-bow", instance:"sect_01",
      anchor:{x:.49,y:.26}, scale:.18, state:"examined" },
    { asset:"prop.courtyard-gate-and-cable", instance:"gate_01",
      anchor:{x:.21,y:.26}, scale:.29, state:"cabled" },
    { asset:"prop.womens-chamber-doors", instance:"doors_01",
      anchor:{x:.83,y:.26}, scale:.23, state:"sealed" },
  ],

  timeline:[
    /* 1. THE WOMEN ARE SHUT IN */
    { op:"actor.pose",  target:"odysseus",   at:0,       args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:0,       args:{ gaze:{ x:.24, y:.36 } } },
    { op:"actor.pose",  target:"eumaeus",    at:0,       args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:0,       args:{ gaze:{ x:-.30, y:.30 } } },
    { op:"actor.pose",  target:"telemachus", at:0,       args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"telemachus", at:0,       args:{ gaze:{ x:.16, y:.02 } } },
    { op:"actor.pose",  target:"eurycleia",  at:0,       args:{ pose:"eury_clasp" } },
    { op:"actor.gaze",  target:"eurycleia",  at:0,       args:{ gaze:{ x:-.26, y:.10 } } },
    { op:"actor.pose",  target:"philoetius", at:0,       args:{ pose:"phi_resolve" } },
    { op:"actor.gaze",  target:"philoetius", at:0,       args:{ gaze:{ x:.28, y:.06 } } },
    { op:"actor.pose",  target:"telemachus", at:ORDER,   args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"telemachus", at:ORDER,   args:{ gaze:{ x:.24, y:-.04 } } },
    { op:"actor.pose",  target:"eurycleia",  at:ORDER,   args:{ pose:"eury_hush" } },
    { op:"actor.gaze",  target:"eurycleia",  at:ORDER,   args:{ gaze:{ x:-.22, y:.02 } } },
    { op:"set.state",   target:"doors_01",   at:GATHER,  args:{ state:"gathered" } },
    { op:"actor.pose",  target:"eurycleia",  at:DRIVE1,  args:{ pose:"eury_hush" } },
    { op:"actor.gaze",  target:"eurycleia",  at:DRIVE1,  args:{ gaze:{ x:.30, y:.24 } } },
    { op:"set.state",   target:"crowd_back", at:SETTLE,  args:{ state:"seated" } },
    { op:"set.state",   target:"doors_01",   at:SEAL,    args:{ state:"sealed" } },
    { op:"actor.hide",  target:"eurycleia",  at:SEAL,    args:{} },

    /* 2. THE GATE */
    { op:"actor.pose",  target:"telemachus", at:WORD,    args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"telemachus", at:WORD,    args:{ gaze:{ x:-.34, y:.04 } } },
    { op:"actor.pose",  target:"philoetius", at:WORD,    args:{ pose:"phi_hauling" } },
    { op:"actor.gaze",  target:"philoetius", at:WORD,    args:{ gaze:{ x:-.20, y:.18 } } },
    { op:"actor.hide",  target:"philoetius", at:OUT,     args:{} },
    { op:"set.state",   target:"gate_01",    at:SHUT,    args:{ state:"closed" } },
    { op:"set.state",   target:"gate_01",    at:CABLE,   args:{ state:"cabled" } },
    { op:"set.state",   target:"gate_01",    at:TEST,    args:{ state:"tested" } },

    /* 3. THE BOW TURNED OVER */
    { op:"actor.pose",  target:"odysseus",   at:TURN,    args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:TURN,    args:{ gaze:{ x:.20, y:.44 } } },
    { op:"actor.pose",  target:"telemachus", at:TURN+4,  args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"telemachus", at:TURN+4,  args:{ gaze:{ x:-.40, y:.14 } } },
    { op:"set.state",   target:"sect_01",    at:SECTION, args:{ state:"examined" } },
    { op:"actor.pose",  target:"odysseus",   at:SECTION, args:{ pose:"head_lowered" } },
    { op:"actor.gaze",  target:"odysseus",   at:SECTION, args:{ gaze:{ x:.14, y:.52 } } },
    { op:"set.state",   target:"crowd_back", at:MOCK,    args:{ state:"shouting" } },
    { op:"actor.pose",  target:"eumaeus",    at:MOCK,    args:{ pose:"eum_ward" } },
    { op:"actor.gaze",  target:"eumaeus",    at:MOCK,    args:{ gaze:{ x:.34, y:-.06 } } },
    { op:"actor.pose",  target:"odysseus",   at:MOCK+4,  args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:MOCK+4,  args:{ gaze:{ x:.10, y:.50 } } },
    { op:"set.state",   target:"crowd_back", at:CALM,    args:{ state:"submitting" } },

    /* 4. THE POSTS */
    { op:"actor.pose",  target:"philoetius", at:BACK,    args:{ pose:"phi_barred" } },
    { op:"actor.gaze",  target:"philoetius", at:BACK,    args:{ gaze:{ x:-.24, y:.14 } } },
    { op:"set.state",   target:"crowd_back", at:YIELD,   args:{ state:"yielded" } },
    { op:"actor.pose",  target:"odysseus",   at:POST,    args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at:POST,    args:{ gaze:{ x:.22, y:.40 } } },
    { op:"actor.pose",  target:"eumaeus",    at:POST,    args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:POST,    args:{ gaze:{ x:-.32, y:.28 } } },
    { op:"actor.pose",  target:"telemachus", at:POST,    args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"telemachus", at:POST,    args:{ gaze:{ x:-.16, y:-.10 } } },
    { op:"set.state",   target:"crowd_back", at:POST,    args:{ state:"seated" } },
    { op:"timeline.capture", target:"OD-B21-S06", at:D - 1, args:{ label:"EXIT" } },
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
        status: t >= CLOSED ? "THE HOUSE IS SHUT"
              : t >= TEST   ? "IT HOLDS"
              : t >= CABLE  ? "SIX TURNS"
              : t >= SECTION? "HORN, CORE, SINEW"
              : t >= OUT    ? "OUT TO THE GATE"
              : t >= SEAL   ? "TWELVE INSIDE"
              : t >= ORDER  ? "SHUT THEM IN"
              :               "THE TWELVE STAND",
        progress:prog,
      },
    });

    /* --- 2. ONE DEPTH QUEUE (note J). ----------------------------------- */
    const queue = [];
    const push = (d, draw) => queue.push({ d, draw });

    /* THE CROWD — one band, at the z its own footline implies (note E). */
    {
      const { node, s } = crowdState(t);
      push(Z_BACK, () => plate(
        offctx, W, H, uproar, ENS_CW, ENS_CH, ENS_FULL, ENS_FULL,
        { ...s, layers:["band-back"], status:s.status, progress:prog },
        `uproar|band-back|${node}|${Math.round((s.wave ?? 0) * 50)}`
        + `|${Math.round((s.uproar ?? 1) * 50)}|${Math.round((s.attention ?? 0) * 50)}`
        + `|${s.register}|${Math.round(s.focusX * 100)}`,
        ENS_THR));
    }

    /* one figure, from the plan, into the portrait box, at the room's one
       height times this station's own depth falloff. `holds` says whether the
       bow is in this body's hands on this frame; `movePose` is the pose a body
       walks in, because two of these people walk carrying something. */
    const figure = (who, mod, extra, statusOf, holds = () => false,
                    movePose = "walk_neutral") => {
      const p = blk[who], s = st[who] || {};
      const scale = K_HALL * p.scale;
      const pose  = p.moving ? movePose : (s.pose || "neutral");
      const gaze  = s.gaze || { x:0, y:.06 };
      const ex    = extra(t);
      const state = {
        t: p.moving ? (t * 0.40) % 4 : breath,
        band:"threeq", pose, gaze,
        status: statusOf(t), progress:prog,
        ...ex,
      };
      const sig = `${who}|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
                + `|${Math.round(t)}`;
      push(p.d, () => {
        place(offctx, W, H, mod, {
          x:p.x, y:p.y, hFrac:scale, ar:FIG_AR, fx:0.5, fy:FIG_FLOOR,
          pad:FIG_PAD, state, sig,
        });
      });
      /* WHAT HE CARRIES — keyed to this body's LIVE blocked box, so a weapon in
         a hand cannot drift off it (note G). Offsets verbatim from S01–S05. It
         is pushed as its OWN queue entry at d + 0.05, one notch NEARER than the
         body: a thing held out in a hand is in front of the man holding it. */
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

    /* PHILOETIUS — the cowherd, who is given a job made entirely of geography
       and does it without saying anything. He is on the open floor, is told,
       walks out with the hawser on his shoulder, is off frame for thirty
       seconds while the gate plate is what he is doing, and comes back to
       stand in the door he used. `phi_barred` is the module's own terminal
       Book XXI node: the only exit is shut and he is standing in it. */
    if (t < OUT || t >= BACK){
      figure("philoetius", philoetius,
        tt => {
          const told   = tt >= WORD && tt < OUT;
          const back   = tt >= BACK && tt < POST;
          const posted = tt >= POST;
          return {
            browKnit: posted ? .66 : back ? .52 : told ? .38 : .30,
            browUp:   told ? .30 : .18,
            eyeNarrow:posted ? .34 : back ? .26 : .20,
            frown:    posted ? .26 : 0,
            jaw:      told ? .16 : 0,
          };
        },
        tt => tt >= POST ? "IN THE DOORWAY"
            : tt >= BACK ? "IT IS SHUT"
            : tt >= WORD ? "THE CABLE"
            :              "TOLD OFF",
        () => false,
        "phi_hauling");
    }

    /* EURYCLEIA — the nurse, who takes fifty women off the floor and puts a
       bar between them and what is going to happen. Drawn only while she is in
       the room: from SEAL she is behind her own doors, which is where the
       plate takes over. */
    if (t < SEAL){
      figure("eurycleia", eurycleia,
        tt => {
          const told    = tt >= ORDER && tt < DRIVE0;
          const driving = tt >= DRIVE0 && tt < DRIVE1;
          const bolting = tt >= DRIVE1;
          return {
            browUp:   told ? .48 : bolting ? .34 : .40,
            browKnit: bolting ? .52 : told ? .40 : .30,
            frown:    bolting ? .28 : .14,
            eyeNarrow:bolting ? .34 : .06,
            eyeWide:  told ? .26 : 0,
            jaw:      driving ? .18 : 0,
          };
        },
        tt => tt >= DRIVE1 ? "THE BAR"
            : tt >= DRIVE0 ? "ALL OF THEM"
            : tt >= ORDER  ? "AND SAY NOTHING"
            :                "THE NURSE",
        () => false,
        "eury_hush");
    }

    /* ODYSSEUS — the beggar in the near corner with his own bow in his hands,
       turning it over. One body, one guise channel, PINNED at `beggar` for the
       whole scene (note D). He looks at the bow the entire time and up exactly
       once, at the floor, when the laughing starts. */
    figure("odysseus", odysseus,
      tt => ({
        guise:"beggar",
        browKnit: tt >= SECTION ? .44 : tt >= TURN ? .34 : .24,
        browUp:   tt >= POST ? .26 : .12,
        eyeNarrow:tt >= MOCK && tt < CALM ? .48 : tt >= SECTION ? .40 : .30,
        smile:    tt >= POST ? .20 : tt >= MOCK && tt < CALM ? .10 : .04,
        mouthAsym:tt >= MOCK && tt < CALM ? .32 : .08,
        jaw:      0,
      }),
      tt => tt >= POST    ? "IT IS SOUND"
          : tt >= MOCK    ? "LET THEM LAUGH"
          : tt >= SECTION ? "EVERY PART"
          : tt >= TURN    ? "HE TURNS IT OVER"
          :                 "IN HIS OWN HANDS",
      /* the bow is in HIS hands on every frame of this scene, and in nobody
         else's: there is one bow and it does not change hands here (note G) */
      () => true);

    /* EUMAEUS — a pace off his master's shoulder, watching the hands he put
       the bow into, and bristling when the hall starts on the beggar again. */
    figure("eumaeus", eumaeus,
      tt => {
        const balked = tt >= MOCK && tt < CALM;
        return {
          browUp:   balked ? .68 : .44,
          browKnit: balked ? .50 : .26,
          frown:    balked ? .40 : 0,
          eyeWide:  balked ? .42 : 0,
          eyeNarrow:balked ? 0 : .12,
          smile:    tt >= POST ? .28 : 0,
          cheek:    tt >= POST ? .22 : 0,
        };
      },
      tt => tt >= POST ? "AT HIS SHOULDER"
          : tt >= MOCK ? "THE HALL AT HIM"
          : tt >= TURN ? "HE IS LOOKING AT IT"
          :              "IT IS DONE");

    /* TELEMACHUS — on the floor, giving the two orders that close the house,
       then facing the great doors, which are now the only leaf in the story. */
    figure("telemachus", telemachus,
      tt => {
        const ordering = tt >= ORDER && tt < DRIVE1;
        const second   = tt >= WORD && tt < HAUL1;
        const posted   = tt >= POST;
        return {
          browUp:   ordering ? .32 : .22,
          browKnit: posted ? .44 : second ? .38 : ordering ? .30 : .26,
          frown:    posted ? .24 : 0,
          eyeNarrow:posted ? .36 : .18,
          jaw:      ordering || second ? .40 : 0,
          smile:    0,
          mouthAsym:.10,
        };
      },
      tt => tt >= POST ? "THE DOORS ONLY"
          : tt >= WORD ? "AND THE YARD GATE"
          : tt >= ORDER? "SHUT THE WOMEN IN"
          :              "HE HAS THE FLOOR");

    queue.sort((a, b) => a.d - b.d).forEach(q => q.draw());

    /* --- 3. THE THREE INSTRUMENTS. Overlays, always last (note H). ------- */
    if (t >= SHUT){
      const mode = t >= TEST ? "tested" : t >= CABLE ? "cabled" : "closed";
      detailField(offctx, W, H, GATE_DST);
      plate(offctx, W, H, gate, GATE_CW, GATE_CH, GATE_WIN, GATE_DST,
            { mode, t:0.5, status:mode.toUpperCase(), progress:prog },
            `gate|${mode}`);
    }
    if (t >= SECTION){
      detailField(offctx, W, H, SECT_DST);
      plate(offctx, W, H, bow, SECT_CW, SECT_CH, SECT_WIN, SECT_DST,
            { mode:"examined", t:0.5, owner:3, status:"EXAMINED", progress:prog },
            `bow|examined|section`);
    }
    if (t >= GATHER){
      const mode = t >= SEAL ? "sealed" : "gathered";
      detailField(offctx, W, H, DOOR_DST);
      plate(offctx, W, H, chamber, DOOR_CW, DOOR_CH, DOOR_WIN, DOOR_DST,
            { mode, t:0.5, status:mode.toUpperCase(), progress:prog },
            `doors|${mode}`);
    }
  },
};
export default scene;

/* named binding so OD-B21-S07 can `import { exitOccupancy as INITIAL }`.
   S07 plays in this same hall and every station above is a megaron station, an
   S05 offset or this file's one declared offset, so it needs no translation
   table — the bow is in the beggar's hands at `corner_dead`, the swineherd is
   at `hand_off`, the cowherd is in the side door at `postern`, the son is at
   `sons_place`, the nurse and the women are behind the bolt at `doorway_maid`,
   and `threshold` / `shot_mark` / the whole lane are empty and have been all
   evening, which is exactly what S07 needs to shoot down. */
export const exitOccupancy = scene.exitOccupancy;

/* the plan is exported too, so S07 can block through the same offsets rather
   than re-deriving them and drifting. */
export const plan = hallPlan;
