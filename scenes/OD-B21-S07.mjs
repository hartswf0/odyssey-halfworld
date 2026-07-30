/* ============================================================
   SCENE  OD-B21-S07 — The Bow Sings                          (Od. 21.404–434)
   Book XXI, scene 7 — the last of the book. ADDITIVE: adds nothing to Books
   I–XV, modifies no existing module, and casts only assets that already exist.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from its
   immediate predecessor OD-B21-S06, whose computed exit occupancy and whose
   local plan this scene imports rather than re-deriving.

   Beats (causal order, one master clock):
     1. The beggar turns the great bow over one last time and then seats the
        string on it, without effort and without standing up to it — the way a
        singer who knows lyres slips a new gut over the peg and pulls it true.
        Nobody in the room has been able to bend it all afternoon.
     2. He tries the string with his right hand and it sings back at him, one
        clear high note, like a swallow. Zeus thunders on the beat, out of a
        sky nobody had asked anything of, and the man in the rags smiles.
     3. Telemachus slings the sword on, takes his spear, and comes down off his
        own place to the archer's hand, bronze on him, and stands there.
     4. Odysseus takes the one bare shaft off the table, sets it on the bridge,
        draws string and notch together sitting exactly as he was, and lets fly
        — and misses no axe from the first handle-hole clean through, and out
        past the last the bronze-weighted arrow goes.
     5. "The stranger you had in your house has not disgraced you." And a nod,
        which is the whole of the next book.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. NOTHING HAND-PLACED. Every body is resolved by STATION NAME through a
      plan and `blockingAt()` does the arithmetic. There is not one invented
      coordinate in the blocking table.

   B. THE ROOM IS STATE, AND IT IS THE SAME ROOM (brief §D). One field,
      `location.megaron-hall`, cast ONCE, in its `contest` state, with S06's
      layer list VERBATIM — including its two inherited drops (`racks`,
      `postern`), which are kept for the reasons S05 and S06 recorded and which
      apply here word for word: the arms came off these walls in Book XIX, and
      Philoetius stands in the side doorway for the whole of this scene, so the
      layer that paints that doorway as a solid level-5 leaf would give him a
      black body with a face on it. If S06 and S07 disagreed about one wall of
      this hall they would be two halls. Nothing here builds or casts a second
      hall, and the room does not change state: `contest` is the state the
      twelve axe heads stand in, and they have to stand for one more scene.

   C. THE LOCAL PLAN IS S06'S PLAN PLUS THREE DECLARED OFFSETS. S06 exports its
      plan for exactly this reason, so the five offsets already solved in this
      book (`hand_off`, `sons_place`, `the_stand`, `queen_step`, `nurse_call`)
      are imported, not re-derived, and cannot drift. Three stations are added,
      and every one of them exists because a measurement said so:

        `bow_stance` = shot_mark + (-0.14, +0.16) — {x .36, z .96}. THE
          ARCHER'S GROUND. It is an offset from the plan's own `shot_mark`
          because `shot_mark` itself cannot be stood on in THIS scene, which is
          the one scene it was authored for. At {x .50, z .80} a body resolves
          to frame x .440–.560 with its crown at y .473 and its feet at y .861
          — and the twelve axe heads, which the hall paints from
          `plan.ray(axe_first, axe_last)`, occupy frame x .460–.540 (blades)
          around a 0.035-wide ring column at x .4825–.5175, running from y
          .5355 at the far helve to y .7263 at the near one. A man on
          `shot_mark` covers ALL TWELVE: the single thing this scene exists to
          show would be behind his chest. Backed off one pace toward the camera
          and moved two hands to the left, he resolves to frame x .318–.408
          with his crown at y .645 and his feet at y .940 — a clear .052 of
          paper between his shoulder and the first blade, nearer than the
          nearest helve (z .96 against z .74) so he stands at the MOUTH of the
          corridor and not among the heads, standing in front of the throne,
          which is where a man stands who is about to shoot down his own hall.
          NOTHING IN THIS SCENE IS INSIDE THE LANE (plan x .415–.585). The
          archer is beside it; only the arrow is in it.
        `sons_side` = sons_place + (-0.10, +0.02) — {x .62, z .94}. Telemachus
          comes down off his own place to the shot. He cannot be put on his
          father's left: `bow_stance` already has the near-left, `hand_off` and
          `corner_dead` are behind it, and a fourth body in that quarter puts
          two heads in one column. Resolved, `sons_side` is frame x .553–.679,
          clear of the ring column on the RIGHT by .036, and the two men stand
          one either side of the corridor with the twelve between them, which
          is a truer picture of what they are doing than shoulder to shoulder
          would be: he is at the archer's hand, on the other side of the shot.
          It is a PAIRED STATION with `bow_stance` (brief §B) — father and son
          are the two bodies this scene brings together and they must never
          resolve to one point.
        `mark_step` = corner_dead + (+0.16, +0.08) — {x .26, z .98}. A WAYPOINT,
          and it exists because the direct walk is a collision. Eumaeus has
          stood at `hand_off` {x .28, z .93} since he put the bow into his
          master's hands in S05, and he is not moved in this scene — Homer does
          not move him and the room does not need him moved. But a straight
          lerp from `corner_dead` to `bow_stance` passes through plan {.26,.93}
          at the eight-second mark, which is `hand_off` to within .02 in x and
          exactly on it in z: the archer would walk through the swineherd. Sent
          by way of `mark_step` he goes out along the near floor first, at
          z .98 — nearer than the man he is passing, so he passes IN FRONT of
          him and at no point in the walk are the two within .05 of each other
          at the same depth. Standing, they are frame x .244–.334 (Eumaeus) and
          .318–.408 (Odysseus) at z .93 and z .96, so the sixteen thousandths
          where the two boxes meet is a near shoulder in front of a far one,
          which is a picture and not a fault.

   D. ONE BODY, ONE GUISE CHANNEL, HELD AT ZERO (brief §C). Odysseus is
      `character.odysseus-b16` with `guise:"beggar"` and the channel does not
      move for ninety-six seconds. This is the scene where it is hardest to
      leave alone and where leaving it alone is the entire point: the man who
      strings the bow no man could string, and who puts one arrow through
      twelve axes, is still in rags and still nobody. Homer does not restore
      him until 22.1, when he strips the rags himself. There is no restoration
      flare here, no cut to `.odysseus-restored`, no second Odysseus module,
      and no ramp. The one thing that changes on his face is that he smiles.

   E. THE CROWD IS ONE BLIT, AND THE BAND CHOICE IS S06'S MEASUREMENT. S06
      dropped the FRONT band (its footline is the near floor, where the named
      bodies stand) and the MID band (footline .725, members .415–.725 at frame
      x .227/.437/.647/.858, which printed straight across bodies standing
      behind it). Both reasons hold here and one of them is worse: THIS scene
      puts a body at frame x .359–.485 with its crown at y .522, i.e. squarely
      inside the mid band's box, and that body is the archer. So the crowd is
      the BACK band only, four men on one line at frame x .185/.395/.605/.815,
      footline .545, up by the far wall — behind everything, in front of
      nothing, and therefore incapable of printing across the shot. The
      population controls (`perRow`, `seed`, `density`) are S05's and S06's,
      unchanged, so it is the same room of the same men; only the near ranks
      are out of shot. Every one of S06's instrument drops is kept for the
      reasons S06 recorded: `hall`, `floor`, `place`, `gauge` and `quell-ring`
      (that last one because it is drawn in ACCENT, and a blue mark prints
      BLACK through the POST pass).

   F. THE NOISE IS A CHANNEL AND IT WALKS THE ASSET'S OWN EDGES. The uproar
      opens where S06 left it, in `seated` — the house back at its tables,
      register `ridicule`, sneering at a beggar handling a bow — and goes
        seated -> shouting -> threatening -> suspicious,
      every step an edge the asset itself declares legal, and every step a line
      of the text: the colour of their faces changed when the string went on;
      hands went to hilts when the shaft went on the string; and after it was
      through the twelve they looked at each other, which is the `suspicious`
      node exactly ("heads turned onto NEIGHBOURS, not onto him: who put him up
      to this"). That is the disposition Book XXII opens on. The FOCUS moves
      once, off the dead corner (focusX .123) onto the archer's mark
      (focusX .422), the frame x those two stations actually resolve to.

   G. THE BOW IS NEVER DRAWN WITHOUT HANDS ON IT — S05's and S06's rule, same
      constants, and now with three more modes on the same rule. There is ONE
      bow in the round for the whole scene and it is keyed to Odysseus's LIVE
      blocked box on every frame, pushed into the depth queue as its own entry
      at d + 0.05 (a thing held out in a hand is in front of the man holding
      it). The mode walks `carried -> strung -> drawn -> shot` along the
      module's own declared edges, and the GRIP ANCHOR is recomputed per mode
      from the module's own geometry so the bow does not jump when the mode
      changes: the module lays every mode out from `halfLen` = 0.415·H and its
      own limb keyframes, so the grip block sits at (.6300,.500) of the box in
      `strung`, (.7822,.500) in `drawn`, (.6273,.500) in `shot`, against
      S06's (.667,.566) in `carried`. Those four numbers are what keep one
      object continuous across four drawings of it. The three new modes are
      also given their own box height (0.62 of the figure's, against `carried`'s
      inherited 0.88): a braced bow fills 0.772 of its box where a reflexed one
      lying on the diagonal fills far less, so at the archer's mark the strung
      bow's ink comes out 0.257 of frame height against a drawn body height of
      0.295 — 0.87, and a 1550 mm bow against a man is 0.89. Its lower ear
      stops 0.056 above his feet and its upper ear 0.017 above his head, which
      is where a bow that size stands when a man holds it at the grip. It is
      carried 0.21 of a body height OUTBOARD, which is not decoration: at that
      offset the whole object sits at frame x .407–.451, i.e. off the archer's
      own silhouette (.318–.408) on one side and clear of the first axe blade
      (.460) on the other, so the bow reads as a bow instead of merging into
      the man on the left or the row on the right. It is never once inside the
      lane it is aimed down.

   H. THE ARROW IS THE MODULE, NOT A MARK. `prop.axis-shot-arrow` is used
      twice and both uses are the module:
        · IN THE ROOM, in flight, as a declared WINDOW of its own `rest` plate
          — {x .045–.950, y .300–.500}, which is the measured shaft and nothing
          else, the dimension line and the four numbered callouts cropped away
          — blitted rotated a quarter turn so the shaft points down the hall,
          with its POINT advancing along the plan's own ray. It is never
          redrawn by hand.
        · ON THE SHEET, as the RIGHT instrument, walking its own state graph
          `nocked -> drawn -> flight -> proof`, each state windowed to the
          register that state is about.
      THE FLIGHT PATH IS THE PLAN'S, not an invention. The megaron's own
      fixture says it: "the arrow's path is plan.ray('shot_mark','door_main')".
      Both stations are at plan x .50, so the ray projects to a VERTICAL line
      at frame x .500, and the twelve ring centres — which the hall computes
      from the same plan by the same projection — sit on it at y .5355 to
      .7263, collinear to within .002. The shaft travels that line from y .765
      (one pace nearer than the near helve) to y .428 (into the far wall past
      the twelfth), and the dash-dot CENTRELINE drawn under it from DRAW
      onwards is that ray and nothing else. It threads the ring column because
      it IS the ring column's axis.
      AND IT IS DRAWN AT ITS OWN SIZE, not at a size that would read better.
      An 860 mm shaft against a 1750 mm man whose drawn height at `bow_stance`
      is 0.295 of frame height is 0.145 of frame height, and 0.120 by the time
      it reaches the doors; it is drawn at 0.175 tapering to 0.120, which is
      that measurement with one thickness of licence at the near end. The
      consequence is real and is left in: for the middle two seconds of the
      flight the shaft is inside the twelve axe heads, which `contest` paints
      as a dense level-4-to-6 mass, and an 11 mm cane crossing that is three
      dots of light on a dark field. Drafted at twice the size it read
      beautifully and was a lie about how big an arrow is. So the beat is
      carried by TWO registers instead of one inflated one: the ROOM carries
      the AXIS — the dash-dot ray, which stays on the plate from DRAW to the
      last frame, and the twelve rings it runs through — and the SHEET carries
      the OBJECT, `flight` and then `proof`, twelve bores on one line and a
      deviation ladder reading zero. The claim gets made twice and neither
      telling of it is false.

   I. THE SKY IS AN OVERLAY AND IT GOES BEHIND THE BODIES.
      `divine-fx.zeuss-thunder` is blitted full-frame — its own instrument,
      `layers:["seam","gate","fronts"]`, with `sky`, `bow`, `call`, `ledger` and
      `confirm` dropped. The bow layer would put a SECOND bow in the frame
      (note G); `call`, `ledger` and `confirm` are readouts belonging to the
      fx's own plate and not to a hall; and `sky` — drafted in and thrown out —
      lays an even tone across its whole field, which over a room that already
      has a floor, a roof and four walls in it turned every square inch of this
      frame grey and cost the picture all its paper at once. What is kept is
      the three layers that are EVENTS: the gate, the seam that tears out of
      it, and the fronts coming down. It is pushed into the depth queue at d = 0.02,
      behind the crowd's back band (.116) and behind every body, because the
      sky is behind the room: the gate tears open over the far wall and the
      broken chevron wavefronts come down the corridor past the men, not over
      them. It walks `singing -> report -> rolling -> confirmed`, the asset's
      own edges, and it is on frame for seventeen seconds only. Its gate sits
      at frame (.760,.155), which is why the sheet's right-hand instrument does
      not open until NOCK=56, nine seconds after the sky has shut again.

   J. TWO INSTRUMENTS ACROSS THE TOP, AND THE TOP IS WHERE THEY GO. Both
      required registers in this scene are DIAGRAMS — the whole sheet is the
      drawing — so each is blitted as a declared WINDOW over its own paper
      field and rule, the device S06 and OD-B20-S03 used. Both sit in one
      strip, y .052–.262:
        LEFT   `sound_source.bow-string-song`, windowed to the PITCH LADDER,
               the HARMONIC COMB, the STATE-CHANGE readout and both RHYTHM
               lanes — one partial, high, and nothing else; and a latch that
               says the room understood it. The emitter elevation at the top of
               that sheet is cropped away for note G's reason: it draws a bow.
        RIGHT  `prop.axis-shot-arrow`, windowed per state to the register that
               state is about — the notch on the served string; the draw length
               between two ticks; the twelve apertures on one line with the
               shaft leaving the last; and the proof, twelve bores and a
               deviation ladder that reads zero.
      The strip stops at y .262 for S06's reason, unchanged: the two tallest
      heads in this room are Philoetius's at the postern (crown y .277) and
      Eumaeus's at his new post (crown y .451), and the back band's crowns are
      at y .340. Each plate is drawn on the sheet size its OWN rules want, and
      every window is aspect-matched to its destination to within a percent, so
      no socket ring is blitted into an ellipse.

   K. TONE, AND NO OVERPAINT. `contest` is a lift-0 state and the dark states
      are Book XXII's; nothing here touches them. The arrow's own ink table is
      light planes with dark accents (cane 2, socket plane 1, blade 2, wall 2,
      bronze 6) and the song's spectrum is rules and ticks on bare paper, so
      both windows give the top of the frame back to the page. NO hand-drawn
      ctx overpaint is added to any figure anywhere in this file: every mark on
      every body is the shared rig plus that character's own module. The only
      ctx drawing in the file is the two plate fields' paper and their one hard
      rule, which is the engine's own card idiom, and the plan's dash-dot
      centreline, which is drafting furniture and is the plan's declared ray.

   CONTINUITY IN — computed, and NOT translated, because this is the same room
   (brief §E/§F). S06 ends in the megaron and every station it hands over is a
   megaron station or one of the offsets imported here, so `blockingAt()`
   resolves the inherited occupancy without a translation table and NOBODY IS
   DROPPED:
        odysseus   corner_dead  the beggar with the bow, having found it sound
        eumaeus    hand_off     a pace off his shoulder since the handover
        telemachus sons_place   on the floor, one step right of his own chair
        philoetius postern      standing in the side door he came back through
        bow        corner_dead  in the beggar's hands, sharing his station
        eurycleia  doorway_maid behind the bolt with the fifty women, undrawn
        maids      doorway_maid behind the same bolt, undrawn
        penelope   stair_up     gone up, undrawn: she is out of the room
        antinous   table_r      undrawn — inside the ensemble
        eurymachus bench_r1     undrawn — inside the ensemble
        leiodes    bench_r2     undrawn — inside the ensemble
        melanthius storeroom    undrawn — down the store passage
        fire       table_l      undrawn — the brazier burning down
        axes       storeroom    undrawn — the emptied chest
   ONE body is added, and it is not a person: `arrow`, the single bare shaft
   that was lying on the table beside him, carried at `bow_stance` and walked
   to `door_main` between LOOSE and CATCH so that the occupancy this scene
   hands to Book XXII has the thing where Book XXII needs it — buried in the
   far wall by the great doors, past twelve axe heads, in front of the whole
   house.

   Verify (the note and the sky; the shaft through the twelve):
     node harness/render-scene.mjs scenes/OD-B21-S07.mjs --t 40
     node harness/render-scene.mjs scenes/OD-B21-S07.mjs --t 86
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, lerp, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import hall        from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import eumaeus     from "../assets/character/eumaeus.mjs";
import philoetius  from "../assets/character/philoetius.mjs";
import uproar      from "../assets/ensemble/suitor-uproar.mjs";
import bow         from "../assets/prop/odysseuss-bow.mjs";
import arrow       from "../assets/prop/axis-shot-arrow.mjs";
import song        from "../assets/sound_source/bow-string-song.mjs";
import thunder     from "../assets/divine_fx/zeuss-thunder.mjs";

/* CONTINUITY IN — the previous scene's computed exit occupancy AND its plan,
   both named exports, so the offsets S05 and S06 solved are not re-derived. */
import { exitOccupancy as PREV_EXIT, plan as S06_PLAN } from "./OD-B21-S06.mjs";

const HALL_ASSET = "location.megaron-hall";
const D = 96;

/* ---- THE LOCAL PLAN (note C) -------------------------------------------- */
const MS  = S06_PLAN.stations;      // megaron + S05's four offsets + `nurse_call`
const OFF = (s, dx, dz) => ({ x:+(s.x + dx).toFixed(4), z:+(s.z + dz).toFixed(4) });

const hallPlan = makePlan({
  id:"megaron-s07",
  name:"The Great Hall at Ithaca — the shot",
  notes:"scenes/OD-B21-S06.mjs's plan entire (imported, not re-authored: the "
       +"megaron plus `hand_off`, `sons_place`, `the_stand`, `queen_step` and "
       +"`nurse_call`) plus THREE stations derived from it by declared "
       +"offsets. `bow_stance` is the archer's ground, backed one pace off the "
       +"plan's own `shot_mark` because a body ON `shot_mark` covers all "
       +"twelve helve-rings. `sons_side` is its PAIR — the son at the other "
       +"hand of the shot, so that father and son can never resolve to one "
       +"point. `mark_step` is a waypoint on the near floor, so that the "
       +"archer's walk to the mark passes in FRONT of the swineherd standing "
       +"at `hand_off` rather than straight through him. No station of the "
       +"megaron is moved or shadowed, and nobody but the archer moves at all "
       +"on the left-hand side of this room.",
  stations:{
    ...MS,
    bow_stance: OFF(MS.shot_mark,   -0.14, +0.16),  // {x .36, z .96} the mark
    sons_side:  OFF(MS.sons_place,  -0.10, +0.02),  // {x .62, z .94} the pair
    mark_step:  OFF(MS.corner_dead, +0.16, +0.08),  // {x .26, z .98} pass in front
  },
  fixtures:S06_PLAN.fixtures,
});

/* ---- THE CLOCK ---------------------------------------------------------- */
const STEP0 = 6,  STEP1 = 14;   // out along the near floor, in front of the swineherd
const MARK0 = 14, MARK1 = 22;   // and up onto the archer's ground
const BRACE = 26;               // >>> he seats the string: carried -> strung
const EASY  = 30;               // it is on. No effort, and no man saw how
const PLUCK = 34;               // his right hand on the string
const SING  = 35;               // >>> ONE CLEAR HIGH NOTE, like a swallow
const THUND = 37;               // >>> Zeus answers, with no gap at all
const ROLL  = 41;               // the report crosses the corridor
const CONF  = 46;               // it reaches him; the reading is ZERO
const ARM0  = 40, ARM1 = 50;    // the son crosses to the other hand of the shot
const SET   = 52;               // sword slung, spear grounded; the note latches
const NOCK  = 56;               // the one bare shaft onto the bridge
const DRAW  = 64;               // string and notch back together
const LOOSE = 72;               // >>> away
const CATCH = 78;               // through twelve, and into the far wall
const PROOF = 82;               // the plate that says it happened
const WORD  = 86;               // "he has not disgraced you"
const SIGNAL= 92;               // the nod. The next book.

/* ---- THE ROOM (note B) — S06's layer list, verbatim --------------------- */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill",
                     "maidsdoor","stair","pillars","lane","hearth","furniture",
                     "litter","throne","axes"];

/* ---- CONTINUITY IN (no translation: same room) -------------------------- */
const ADDED = { arrow:"bow_stance" };   // the one bare shaft off the table
const INITIAL = { ...PREV_EXIT, ...ADDED };

/* ---- BLOCKING. Stations, not coordinates (notes A, C, H). ---------------
   Five moves for three bodies and one shaft. The archer's walk is in two legs
   by way of `mark_step`, so that it passes in FRONT of the swineherd instead
   of through him; the bow goes with it, because it is in his hands. The son's
   step stays entirely right of plan x .585 and never touches the corridor.
   Eumaeus and Philoetius do not move at all. The shaft's walk IS the shot. */
const MOVES = [
  { who:"odysseus",   from:"corner_dead", to:"mark_step",  t0:STEP0, t1:STEP1 },
  { who:"odysseus",   from:"mark_step",   to:"bow_stance", t0:MARK0, t1:MARK1 },
  { who:"bow",        from:"corner_dead", to:"mark_step",  t0:STEP0, t1:STEP1, kind:"prop" },
  { who:"bow",        from:"mark_step",   to:"bow_stance", t0:MARK0, t1:MARK1, kind:"prop" },
  { who:"telemachus", from:"sons_place",  to:"sons_side",  t0:ARM0,  t1:ARM1 },
  { who:"arrow",      from:"bow_stance",  to:"door_main",  t0:LOOSE, t1:CATCH, kind:"prop" },
];

/* ---- THE BOX A BODY IS DRAWN IN (verbatim device from S01–S06) -----------
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide), and every character module in this repo lays its garment out in
   fractions of its box WIDTH, so a landscape box turns a body into a bell.
   Every figure here is drawn into the PORTRAIT box the atlas uses for
   characters, 660/880, and blitted. FIG_FLOOR is the rig's own floor line:
   figure-hero plants the ankles at 0.90 of its box height. K_HALL is S02's one
   height for every adult in this room, unchanged through S03–S06 and unchanged
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
   (Verbatim device from OD-B20-S03 / OD-B21-S01..S06.) */
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
   S06's numbers, unchanged, so it is the same crowd of the same men in the
   same room: the sheet carries the STAGE's aspect, is blitted 1:1, and the
   band's absolute member height lands at .205 of frame height, which is what
   the room's own depth law asks for at footline .545. Z_BACK is that footline
   solved back through y = .50 + .46 z^1.08. */
const ENS_CW = 532, ENS_CH = 361;
const ENS_FULL = { x0:0, y0:0, x1:1, y1:1 };
const ENS_THR  = 0.845;
const Z_BACK   = 0.116;

const CROWD_FIXED = {
  rows:3, perRow:[4,4,5], density:1.0, seed:2141, t:0.5,
  showHall:false, showPlace:false, showRing:false, showGauge:false,
};
/* the focus moves once, off the dead corner onto the archer's mark: .123 and
   .422 are where `corner_dead` and `bow_stance` actually resolve. */
const focusOf = t => (t < MARK1 ? { focusX:0.123, focusY:0.800 }
                                : { focusX:0.422, focusY:0.860 });
/* the asset's own state graph, walked along its own declared edges */
const crowdNode = t => t < EASY  ? "seated"
                     : t < NOCK  ? "shouting"
                     : t < PROOF ? "threatening"
                     :             "suspicious";
function crowdState(t){
  const node = crowdNode(t);
  return { node, s:{ ...uproar.states.nodes[node].preview,
                     ...CROWD_FIXED, ...focusOf(t) } };
}

/* ---- THE BOW (note G). One object, four drawings of it, and the grip block
   solved out of the module's own geometry for each so it cannot jump:
     halfLen = .415·H, box aspect 660/880, grip = SHAPES[key][0].x · L offset
     from that mode's own centre. `out` and `up` are in BODY HEIGHTS from the
     blocked foot point; `carried` keeps S05/S06's pair (.19, .16) exactly, so
     the cut into this scene does not move the bow at all. */
const BOW_AR  = FIG_AR;
const BOW_RIG = {
  carried:{ grip:{ x:0.6670, y:0.5660 }, out:0.19, up:0.16, h:0.88 },
  strung: { grip:{ x:0.6300, y:0.5000 }, out:0.21, up:0.44, h:0.62 },
  drawn:  { grip:{ x:0.7822, y:0.5000 }, out:0.21, up:0.44, h:0.62 },
  shot:   { grip:{ x:0.6273, y:0.5000 }, out:0.21, up:0.44, h:0.62 },
};
const bowMode = t => t < BRACE ? "carried" : t < DRAW ? "strung"
                   : t < LOOSE ? "drawn"   : "shot";

/* ---- THE SHOT (note H) --------------------------------------------------
   plan.ray("shot_mark","door_main") projects to a VERTICAL at frame x .500,
   because both stations are at plan x .50. The twelve ring centres, computed
   by the hall from the same plan, sit on that line between y .5355 and .7263.
   RUN_Y0 is one pace nearer than the near helve; RUN_Y1 is into the far wall
   past the twelfth. The shaft shortens as it recedes, by the room's own law. */
const RUN_X  = 0.500;
const RUN_Y0 = 0.765;
const RUN_Y1 = 0.428;
const SHAFT_NEAR = 0.175, SHAFT_FAR = 0.120;   // shaft length, fraction of H

/* the shaft: a declared WINDOW of the arrow's own `rest` plate — the measured
   piece and nothing else, the dimension line above and the four numbered
   callouts below both cropped away — blitted a quarter turn round so it points
   down the hall. The module draws it; this file never redraws it. */
const SHAFT_CW = 900, SHAFT_CH = 520;
const SHAFT_WIN = { x0:.045, y0:.300, x1:.950, y1:.500 };

function flightShaft(offctx, W, H, u){
  const cv = keyedModuleCanvas(arrow, SHAFT_CW, SHAFT_CH,
    { mode:"rest", passed:12, status:"TRUE", progress:0.5, t:0.5 },
    "arrow|rest|shaft", 0.895);
  const sw = (SHAFT_WIN.x1 - SHAFT_WIN.x0) * SHAFT_CW;
  const sh = (SHAFT_WIN.y1 - SHAFT_WIN.y0) * SHAFT_CH;
  const len = lerp(SHAFT_NEAR, SHAFT_FAR, u) * H;
  const dh  = len * (sh / sw);
  offctx.save();
  offctx.translate(RUN_X * W, lerp(RUN_Y0, RUN_Y1, u) * H);
  offctx.rotate(-Math.PI / 2);                       // +x of the plate -> up the hall
  offctx.drawImage(cv, SHAFT_WIN.x0 * SHAFT_CW, SHAFT_WIN.y0 * SHAFT_CH, sw, sh,
                   -len, -dh / 2, len, dh);          // the POINT lands on the ray
  offctx.restore();
}
/* the plan's ray, as drafting furniture: dash-dot, broken, light. It is the
   axis of the twelve, so it is drawn through their centres and nowhere else. */
function centreline(offctx, W, H, y0, y1){
  offctx.save();
  offctx.strokeStyle = INK; offctx.lineWidth = 2.4; offctx.lineCap = "butt";
  offctx.setLineDash([26, 9, 4, 9]);
  offctx.beginPath();
  offctx.moveTo(RUN_X * W, y0 * H); offctx.lineTo(RUN_X * W, y1 * H);
  offctx.stroke();
  offctx.setLineDash([]);
  offctx.restore();
}

/* ---- THE SKY (note I) — full frame, behind every body ------------------- */
const THU_CW = 1120, THU_CH = 760;
const THU_FULL = { x0:0, y0:0, x1:1, y1:1 };
const THU_LAYERS = ["seam","gate","fronts"];
const thunderNode = t => t < THUND ? "singing" : t < ROLL ? "report"
                       : t < CONF  ? "rolling" : "confirmed";

/* ---- THE TWO WINDOWS (note J) ------------------------------------------
   One strip, y .052–.262, stopping above the tallest head in the room
   (Philoetius at the postern, crown y .277) and well clear of the back band's
   crowns (.340). Both destinations are .37 of frame width, so both windows are
   cut at aspect 2.596 and nothing is blitted into an ellipse. */
const STRIP_Y0 = 0.052, STRIP_Y1 = 0.262;

/* the note: pitch ladder, harmonic comb, state-change readout, envelope and
   both rhythm lanes. The emitter elevation on the top half of that sheet is
   cropped away — it draws a bow, and there is one bow (note G). Sheet 640x422
   so the window (.890 x .520 -> 570 x 219) blits at 0.73x and the panel's
   fixed-pixel rules stay hard. */
const SONG_CW = 900, SONG_CH = 410;
const SONG_WIN = { x0:.300, y0:.075, x1:.945, y1:.620 };
const SONG_DST = { x0:.042, y0:STRIP_Y0, x1:.412, y1:STRIP_Y1 };

/* the shaft's own instrument, one window per state, each cut to the register
   that state is about and each on the sheet its own rules want. The sheet
   HEIGHTS differ because the windows differ: every one of them is solved so
   that (win.w · cw) / (win.h · ch) = 2.596, the destination's aspect. */
const ARROW_DST = { x0:.588, y0:STRIP_Y0, x1:.958, y1:STRIP_Y1 };
const ARROW_PLATE = {
  nocked: { cw:640, ch:716, win:{ x0:.08, y0:.33, x1:.98, y1:.64 } },
  drawn:  { cw:640, ch:709, win:{ x0:.06, y0:.34, x1:.98, y1:.66 } },
  flight: { cw:640, ch:756, win:{ x0:.04, y0:.40, x1:.96, y1:.70 } },
  proof:  { cw:640, ch:717, win:{ x0:.05, y0:.13, x1:.98, y1:.45 } },
};
const arrowPlateMode = t => t < DRAW  ? "nocked" : t < LOOSE ? "drawn"
                          : t < PROOF ? "flight" : "proof";

export const scene = {
  id:"OD-B21-S07",
  title:"The Bow Sings",
  book:21,
  plan:"megaron-s07",
  duration:D,
  beats:[
    "Odysseus strings the bow effortlessly, as a musician strings a lyre.",
    "He plucks the string and it sings like a swallow; Zeus answers with thunder.",
    "Telemachus places sword and spear beside him and moves to his father's side.",
    "Odysseus nocks an arrow and shoots cleanly through all twelve axes.",
    "He tells Telemachus that the stranger has not disgraced the house and signals the next phase.",
  ],

  exitState:
    "Evening of Apollo's feast day, in the megaron, still in its CONTEST state " +
    "and unchanged as architecture: the tables and benches shoved back against " +
    "the walls, the hearth raked flush, the great doors shut, the women's " +
    "quarters bolted and the courtyard gate cabled, and the twelve axe heads " +
    "still standing haft-down in the trench along the spine — THE COUNT IS " +
    "INTACT, and it has now been used. THE BOW IS STRUNG, AND IT HAS BEEN " +
    "SHOT. `prop.odysseuss-bow` ends in its `shot` node, limbs recoiling, the " +
    "string singing past brace, in Odysseus's own two hands at `bow_stance` " +
    "(`bow` -> `bow_stance`, sharing his station the way a carried thing " +
    "does). He seated the string without standing up to it and without haste, " +
    "the way a man who knows lyres seats a new gut; he tried it with his right " +
    "hand and it gave back one clear high note; and Zeus thundered on the beat " +
    "out of a clear sky, which is the sign, and which nobody in the room asked " +
    "for. THE SHAFT IS IN THE FAR WALL. `prop.axis-shot-arrow` ends in its " +
    "`proof` node with twelve passed and a deviation ladder reading zero: it " +
    "went from the first handle-hole clean through and out past the last, and " +
    "the occupancy carries it to `door_main` (`arrow` -> `door_main`), buried " +
    "in the wall by the great doors where the whole house can see it. THE " +
    "ARCHER HOLDS THE MOUTH OF THE LANE. Odysseus is at `bow_stance`, one pace " +
    "nearer than the nearest helve and in front of his own chair, facing the " +
    "doors down the axis of the twelve. HE IS STILL THE BEGGAR: guise " +
    "`beggar`, the channel pinned at 0 for the whole scene, no god has been " +
    "near him and he has not touched the rags. That is the state Book XXII " +
    "needs him in, because 22.1 is the line where he strips them himself. " +
    "TELEMACHUS IS ARMED AND AT THE OTHER HAND OF THE SHOT (`telemachus` -> " +
    "`sons_side`), sword slung on, spear grounded, bronze on him, standing " +
    "where he can reach the sill in one step. EUMAEUS HAS NOT MOVED " +
    "(`eumaeus` -> `hand_off`): he is standing exactly where S05 left him when " +
    "he put the bow into those hands, a pace off the shoulder, with nothing in " +
    "his own hands and nothing to do but watch what he carried across the room. " +
    "PHILOETIUS HOLDS THE SIDE DOOR (`philoetius` -> `postern`), which is the " +
    "door to the storeroom passage and therefore the door Melanthius will try " +
    "to carry arms out of. The women and the nurse are behind the bolt " +
    "(`eurycleia`, `maids` -> `doorway_maid`) and Penelope is upstairs and " +
    "asleep (`penelope` -> `stair_up`, undrawn); none of the four of them hear " +
    "any of this as what it is. THE HOUSE HAS STOPPED LAUGHING. " +
    "`ensemble.suitor-uproar` ends in its `suspicious` node — formation " +
    "scatter, register `suspect`, attention .45 — heads turned onto each other " +
    "rather than onto him, which is the exact disposition Book XXII opens on: " +
    "Antinous at the right-hand table with a two-handled gold cup in his " +
    "fingers and about to lift it, Eurymachus on the right bench, Leiodes " +
    "apart on the near right with his prophecy now answered in front of him, " +
    "Melanthius back down the store passage, the brazier burning down at the " +
    "left table, the emptied axe chest at the mouth of the arms passage. " +
    "The next thing that happens is that the beggar leaps onto the great " +
    "threshold, empties the quiver out at his feet, and shoots Antinous " +
    "through the throat.",
  exitOccupancy:occupancyAt(hallPlan, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    odysseus:"none — he holds `corner_dead`, where S06 left him, having spent " +
             "ninety seconds turning the bow over and finding it sound. He " +
             "takes the archer's ground at MARK0=12 and does not leave it",
    telemachus:"none — he holds `sons_place`, on the floor since he took the " +
               "question of the bow over in public",
    eumaeus:"none — he holds `hand_off`, a pace off his master's shoulder " +
            "since he put the bow into his hands, and he does not move once " +
            "in ninety-six seconds. The archer goes round him",
    philoetius:"none — he holds `postern`, standing in the side door he came " +
               "back through, and he does not move for the whole scene",
    crowd:"none — the house is where S06 left it, in the ensemble's `seated` " +
          "node, sneering at its tables, and it stops at EASY=30",
    arrow:"none as a walk — the single bare shaft was lying on the table " +
          "beside him and is carried at `bow_stance` from the first frame, " +
          "undrawn until NOCK=56",
    eurycleia:"none — she is behind the bolt she shot in S06 and is not in " +
              "this room",
  },
  exits:{
    odysseus:"none — he ends at `bow_stance`, holding the mouth of the lane " +
             "with the shot bow in his hands",
    telemachus:"none — he ends at `sons_side`, armed",
    eumaeus:"none — he ends at `hand_off`, where he has stood since S05",
    philoetius:"none — he ends at `postern`",
    bow:"none — it does not leave his hands at any point in this scene, in " +
        "any of its four modes",
    arrow:"AWAY. Drawn only between LOOSE=72 and CATCH=78, travelling the " +
          "plan's own ray at frame x .500 from y .765 to y .428; the occupancy " +
          "walks `bow_stance` -> `door_main` over exactly those six seconds. " +
          "From CATCH it is inside the far wall and the room does not draw it; " +
          "the proof plate does",
    penelope:"already gone: carried at `stair_up` and never drawn",
    eurycleia:"none — `doorway_maid`", maids:"none — `doorway_maid`",
    antinous:"none — `table_r`", eurymachus:"none — `bench_r1`",
    leiodes:"none — `bench_r2`", melanthius:"none — `storeroom`",
    fire:"none — still burning down at `table_l`",
    axes:"none — the emptied chest at `storeroom`",
  },
  walkable:{
    allowed:["corner_dead","hand_off","mark_step","bow_stance",
             "sons_place","sons_side","postern","doorway_maid","stair_up",
             "storeroom"],
    forbidden:["shot_mark","threshold","door_main","axe_first","axe_last",
               "throne","hearth","bench_l1","bench_l2","bench_r1","bench_r2",
               "table_l","table_r","the_stand","nurse_call","queen_step"],
    note:"THE LANE IS THE SHOT, and it is empty of bodies in every frame. " +
         "NOT ONE station used in this scene is inside the lane's own width " +
         "(plan x .415–.585): `bow_stance` is at plan x .36 and z .96, beside " +
         "the corridor's left edge and NEARER than the nearest helve at z .74, " +
         "so the archer stands at the mouth of it and the only thing that " +
         "travels down the middle of this room is the arrow. `shot_mark` " +
         "itself is FORBIDDEN, which is the whole argument of this scene's " +
         "plan: at z .80 a body on it resolves to frame x .440–.560, y " +
         ".473–.861 and covers all twelve helve-rings (x .4825–.5175, y " +
         ".5355–.7263). `threshold` and `door_main` are forbidden because the " +
         "shaft has to reach them and because the sill is Book XXII's opening " +
         "image. `the_stand` is forbidden for S06's reason: at z .68 a body " +
         "there takes the top rings off the twelve. ALL SIX bench and table " +
         "stations are seats and prop grounds, never stood on: in `cleared` " +
         "the room paints the shoved-back furniture at frame x .073–.248 and " +
         ".752–.927, y .697–.859, and every one of those stations puts a " +
         "body's feet inside its own table. NOBODY CROSSES THE SPINE: only " +
         "two people move in this scene, and the archer's walk runs left along " +
         "the near floor to the lane's own edge and stops there (plan x .10 -> " +
         ".26 -> .42), while the son's runs right-to-right (plan x .72 -> .62, " +
         "never inside .585). The only thing that goes down the middle of this " +
         "room is the arrow.",
  },
  depthOrder:"the room paints the field; then ONE queue holding the sky at " +
             "d .02 (behind everything: the thunder is weather and weather is " +
             "behind a hall), the crowd's single back band at the z its own " +
             "footline implies (.116), and every body at its LIVE blocked z — " +
             "the cowherd in the side door (.24), the swineherd off the " +
             "shoulder (.93), the son at the other hand of the shot (.92 -> " +
             ".94) and the archer at the mark (.90 -> .98 -> .96) — sorted every " +
             "frame and drawn far -> near; then the bow, one notch nearer " +
             "than the hands holding it; then the shaft in flight and the " +
             "plan's centreline, which are ON the axis and therefore over the " +
             "twelve; then the two plates, which are overlays and are always " +
             "last.",
  gazeTargets:{
    odysseus:"the bow, without a break, until the string is on it. From SING " +
             "he looks down the hall — at the far wall, over the twelve — and " +
             "he does not look at the suitors once in the whole scene. At " +
             "WORD he looks at his son for the first time since S05",
    telemachus:"his father's hands on the string; then, from the thunder, the " +
               "roof; then the great doors, which are the only way anybody is " +
               "coming in or going out",
    eumaeus:"his master's hands, then his master's face",
    philoetius:"the archer, then the side door at his back, then the archer",
    crowd:"the dead corner until the mark is taken (focusX .123), then the " +
          "archer (focusX .422), and after the shot each other",
  },
  attachments:[
    { at:0,      who:"odysseus",  change:"prop.odysseuss-bow in mode `carried` " +
      "at his near hand, hip height — inherited from S05's handover and never " +
      "put down" },
    { at:BRACE,  who:"odysseus",  change:"-> mode `strung`: the string seated, " +
      "the double curve reversed. The grip anchor moves from (.667,.566) to " +
      "(.630,.500) of the bow's box, which is where that mode's own geometry " +
      "puts the grip block, so the object does not jump" },
    { at:SING,   who:"song_01",   change:"sound_source.bow-string-song -> " +
      "`pluck`, then `singing`: one partial, high, and nothing else" },
    { at:THUND,  who:"sky_01",    change:"divine-fx.zeuss-thunder enters at " +
      "`report`: the gate tears open over the far wall and the first front " +
      "leaves it. There is no gap between the note and the report and the " +
      "ledger reading is ZERO" },
    { at:SET,    who:"song_01",   change:"-> `recognized`: the state-change " +
      "readout latches. The room has understood what it heard" },
    { at:NOCK,   who:"arrow_01",  change:"prop.axis-shot-arrow enters at " +
      "`nocked`, windowed to the notch on the served string" },
    { at:DRAW,   who:"odysseus",  change:"bow -> mode `drawn`, grip anchor " +
      "(.7822,.500); arrow_01 -> `drawn`, the draw length dimensioned" },
    { at:LOOSE,  who:"odysseus",  change:"bow -> mode `shot`, grip anchor " +
      "(.6273,.500), recoil arcs off both ears; arrow_01 -> `flight`; and the " +
      "shaft itself appears in the room on the plan's ray" },
    { at:PROOF,  who:"arrow_01",  change:"-> `proof`: twelve bores on one " +
      "line, twelve cells struck in the ledger, the deviation ladder at zero" },
  ],
  sound:[
    { at:BRACE,  source:"bow_stance", cue:"gut going over horn, and a man not hurrying" },
    { at:SING,   source:"bow_stance", cue:"ONE CLEAR HIGH NOTE — a swallow, indoors" },
    { at:THUND,  source:"row:back",   cue:"thunder, out of a sky nobody asked" },
    { at:CONF,   source:"bow_stance", cue:"the note and the report ending together" },
    { at:SET,    source:"sons_side",  cue:"a sword belt taking a young man's weight" },
    { at:DRAW,   source:"bow_stance", cue:"sinew loading, very quietly, close" },
    { at:LOOSE,  source:"bow_stance", cue:"the string past brace, and nothing else in the room" },
    { at:CATCH,  source:"door_main",  cue:"bronze into stone, once, a long way off" },
    { at:WORD,   source:"bow_stance", cue:"an old man's voice, level, to his son" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:HALL_ASSET, instance:"hall_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"divine-fx.zeuss-thunder", instance:"sky_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"report" },
    { asset:"ensemble.suitor-uproar", instance:"crowd_back",
      anchor:{x:.50,y:.55}, scale:1.0, state:"seated" },
    { asset:"character.philoetius", instance:"philoetius",
      anchor:{x:.25,y:.63}, scale:.36, band:"threeq", pose:"phi_barred" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.29,y:.93}, scale:.53, band:"threeq", pose:"eum_listen" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.62,y:.93}, scale:.53, band:"threeq", pose:"arms_crossed" },
    /* the atlas job names `character.odysseus`; Book XVI+ casts the continuity
       body `character.odysseus-b16` with guise:"beggar" instead (brief §C) —
       one module, one guise channel, never a cut. He is not restored in this
       book and the channel is pinned at 0 for the whole scene. */
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.36,y:.94}, scale:.54, band:"threeq", pose:"three_quarter_left" },
    { asset:"prop.odysseuss-bow", instance:"bow_01",
      anchor:{x:.46,y:.73}, scale:.47, state:"strung" },
    { asset:"prop.axis-shot-arrow", instance:"shaft_01",
      anchor:{x:.50,y:.60}, scale:.16, state:"flight" },
    { asset:"prop.axis-shot-arrow", instance:"arrow_01",
      anchor:{x:.77,y:.26}, scale:.37, state:"proof" },
    { asset:"sound_source.bow-string-song", instance:"song_01",
      anchor:{x:.23,y:.26}, scale:.37, state:"singing" },
  ],

  timeline:[
    /* 1. THE STRING GOES ON */
    { op:"actor.pose",  target:"odysseus",   at:0,      args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:0,      args:{ gaze:{ x:.20, y:.44 } } },
    { op:"actor.pose",  target:"eumaeus",    at:0,      args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:0,      args:{ gaze:{ x:.32, y:.18 } } },
    { op:"actor.pose",  target:"telemachus", at:0,      args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"telemachus", at:0,      args:{ gaze:{ x:-.34, y:.14 } } },
    { op:"actor.pose",  target:"philoetius", at:0,      args:{ pose:"phi_barred" } },
    { op:"actor.gaze",  target:"philoetius", at:0,      args:{ gaze:{ x:.26, y:.12 } } },
    { op:"actor.pose",  target:"eumaeus",    at:STEP1,  args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:STEP1,  args:{ gaze:{ x:.30, y:.10 } } },
    { op:"actor.pose",  target:"odysseus",   at:MARK1,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"odysseus",   at:MARK1,  args:{ gaze:{ x:.08, y:.40 } } },
    { op:"actor.pose",  target:"odysseus",   at:BRACE,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:BRACE,  args:{ gaze:{ x:.14, y:.46 } } },
    { op:"actor.pose",  target:"telemachus", at:BRACE,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"telemachus", at:BRACE,  args:{ gaze:{ x:-.42, y:.22 } } },
    { op:"set.state",   target:"crowd_back", at:EASY,   args:{ state:"shouting" } },

    /* 2. THE NOTE, AND THE ANSWER */
    { op:"actor.pose",  target:"odysseus",   at:PLUCK,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"odysseus",   at:PLUCK,  args:{ gaze:{ x:.10, y:.30 } } },
    { op:"fx.play",     target:"song_01",    at:SING,   args:{ dir:"pluck" } },
    { op:"fx.play",     target:"sky_01",     at:THUND,  args:{ dir:"report" } },
    { op:"actor.pose",  target:"odysseus",   at:THUND,  args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:THUND,  args:{ gaze:{ x:-.16, y:-.10 } } },
    { op:"actor.pose",  target:"telemachus", at:THUND,  args:{ pose:"head_lowered" } },
    { op:"actor.gaze",  target:"telemachus", at:THUND,  args:{ gaze:{ x:-.10, y:-.52 } } },
    { op:"actor.pose",  target:"eumaeus",    at:THUND,  args:{ pose:"eum_ward" } },
    { op:"actor.gaze",  target:"eumaeus",    at:THUND,  args:{ gaze:{ x:.18, y:-.42 } } },
    { op:"actor.pose",  target:"philoetius", at:THUND,  args:{ pose:"phi_resolve" } },
    { op:"actor.gaze",  target:"philoetius", at:THUND,  args:{ gaze:{ x:.30, y:-.30 } } },

    /* 3. THE SON ARMS AND COMES DOWN */
    { op:"actor.pose",  target:"telemachus", at:ARM1,   args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"telemachus", at:ARM1,   args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"actor.pose",  target:"telemachus", at:SET,    args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:SET,    args:{ gaze:{ x:-.20, y:-.02 } } },
    { op:"actor.pose",  target:"philoetius", at:SET,    args:{ pose:"phi_barred" } },
    { op:"actor.gaze",  target:"philoetius", at:SET,    args:{ gaze:{ x:.24, y:.10 } } },

    /* 4. THE SHOT */
    { op:"set.state",   target:"crowd_back", at:NOCK,   args:{ state:"threatening" } },
    { op:"actor.pose",  target:"odysseus",   at:NOCK,   args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"odysseus",   at:NOCK,   args:{ gaze:{ x:-.12, y:.18 } } },
    { op:"set.state",   target:"arrow_01",   at:NOCK,   args:{ state:"nocked" } },
    { op:"actor.pose",  target:"odysseus",   at:DRAW,   args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:DRAW,   args:{ gaze:{ x:-.24, y:-.06 } } },
    { op:"set.state",   target:"arrow_01",   at:DRAW,   args:{ state:"drawn" } },
    { op:"actor.pose",  target:"eumaeus",    at:DRAW,   args:{ pose:"eum_listen" } },
    { op:"actor.gaze",  target:"eumaeus",    at:DRAW,   args:{ gaze:{ x:.34, y:.02 } } },
    { op:"set.state",   target:"arrow_01",   at:LOOSE,  args:{ state:"flight" } },
    { op:"actor.pose",  target:"odysseus",   at:LOOSE,  args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at:LOOSE,  args:{ gaze:{ x:-.28, y:-.10 } } },
    { op:"set.state",   target:"arrow_01",   at:PROOF,  args:{ state:"proof" } },
    { op:"set.state",   target:"crowd_back", at:PROOF,  args:{ state:"suspicious" } },

    /* 5. THE WORD, AND THE NOD */
    { op:"actor.pose",  target:"odysseus",   at:WORD,   args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"odysseus",   at:WORD,   args:{ gaze:{ x:.34, y:.02 } } },
    { op:"actor.pose",  target:"telemachus", at:WORD,   args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"telemachus", at:WORD,   args:{ gaze:{ x:-.36, y:.04 } } },
    { op:"actor.pose",  target:"odysseus",   at:SIGNAL, args:{ pose:"repeated_nod" } },
    { op:"actor.gaze",  target:"odysseus",   at:SIGNAL, args:{ gaze:{ x:.28, y:.06 } } },
    { op:"actor.pose",  target:"telemachus", at:SIGNAL, args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:SIGNAL, args:{ gaze:{ x:.06, y:-.14 } } },
    { op:"timeline.capture", target:"OD-B21-S07", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(hallPlan, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.05 + 0.92 * (t / D));

    /* --- 1. THE ROOM. One field; it paints the world and everything else keys
       onto it. Placed the way every Book XVI+ scene places this hall — anchor
       (.50,.99), scale 1.0 — so it registers on B18–B21's hall exactly. ----- */
    placeInstance(offctx, W, H, hall, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"contest", t:breath, layers:HALL_LAYERS,
        status: t >= SIGNAL ? "THE NEXT PHASE"
              : t >= WORD   ? "NOT DISGRACED"
              : t >= PROOF  ? "THROUGH TWELVE"
              : t >= LOOSE  ? "AWAY"
              : t >= NOCK   ? "ON THE STRING"
              : t >= THUND  ? "ZEUS ANSWERS"
              : t >= SING   ? "IT SINGS"
              : t >= BRACE  ? "HE SEATS IT"
              :               "THE TWELVE STAND",
        progress:prog,
      },
    });

    /* --- 2. ONE DEPTH QUEUE (depthOrder). ------------------------------- */
    const queue = [];
    const push = (d, draw) => queue.push({ d, draw });

    /* THE SKY — behind everything, because weather is behind a hall (note I) */
    if (t >= THUND && t < CONF + 11){
      const node = thunderNode(t);
      const s = thunder.states.nodes[node].preview;
      push(0.02, () => plate(
        offctx, W, H, thunder, THU_CW, THU_CH, THU_FULL, THU_FULL,
        { ...s, layers:THU_LAYERS, status:s.status, progress:prog },
        `thunder|${node}`, 0.845));
    }

    /* THE CROWD — one band, at the z its own footline implies (note E) */
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
       walks in. */
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
         a hand cannot drift off it (note G). The grip anchor and the two
         offsets are read from BOW_RIG for the mode this frame is in, which is
         what keeps one object continuous across four drawings of it. It is
         pushed as its OWN queue entry at d + 0.05, one notch NEARER than the
         body: a thing held out in a hand is in front of the man holding it. */
      if (holds(t)){
        const mode  = bowMode(t);
        const rig   = BOW_RIG[mode];
        const bodyH = scale * 0.78;
        push(p.d + 0.05, () => place(offctx, W, H, bow, {
          x: p.x + rig.out * bodyH, y: p.y - rig.up * bodyH,
          hFrac: scale * rig.h, ar:BOW_AR,
          fx:rig.grip.x, fy:rig.grip.y, pad:0.05,
          state:{ mode, t:0.5, flex:0, owner:3,
                  status:mode === "shot" ? "LOOSED" : mode === "drawn" ? "DRAWN"
                       : mode === "strung" ? "STRUNG" : "UNSTRUNG",
                  progress:prog },
          sig:`bow|${mode}`,
        }));
      }
    };

    /* PHILOETIUS — the cowherd in the side door, who does not move once in
       ninety-six seconds and whose whole performance is that he is between
       this room and the arms. `phi_barred` is the module's own terminal Book
       XXI node: the only exit is shut and he is standing in it. */
    figure("philoetius", philoetius,
      tt => {
        const struck = tt >= THUND && tt < CONF;
        const after  = tt >= LOOSE;
        return {
          browUp:   struck ? .58 : .20,
          browKnit: after ? .62 : struck ? .30 : .48,
          eyeWide:  struck ? .40 : 0,
          eyeNarrow:after ? .34 : .18,
          frown:    after ? .24 : 0,
          jaw:      struck ? .22 : 0,
        };
      },
      tt => tt >= PROOF ? "THE DOOR IS MINE"
          : tt >= LOOSE ? "THROUGH"
          : tt >= THUND ? "THAT WAS THE SKY"
          : tt >= BRACE ? "HE HAS IT ON"
          :               "IN THE DOORWAY");

    /* EUMAEUS — the swineherd, who does not move and does not speak and has
       nothing left to do: he carried the thing across the room and put it in
       those hands, and now he watches them do what nobody else in the house
       could do. He is the only man here who has already been told why. */
    figure("eumaeus", eumaeus,
      tt => {
        const struck = tt >= THUND && tt < CONF;
        const done   = tt >= PROOF;
        return {
          browUp:   struck ? .74 : done ? .52 : .44,
          browKnit: struck ? .30 : .34,
          eyeWide:  struck ? .48 : tt >= BRACE ? .26 : 0,
          eyeNarrow:done ? .16 : .08,
          smile:    done ? .34 : 0,
          cheek:    done ? .26 : 0,
          jaw:      struck ? .30 : 0,
        };
      },
      tt => tt >= PROOF ? "I KNEW THE HANDS"
          : tt >= LOOSE ? "TWELVE"
          : tt >= THUND ? "OUT OF A CLEAR SKY"
          : tt >= BRACE ? "HE DID NOT EVEN STAND"
          : tt >= STEP1 ? "HE HAS GONE TO IT"
          :               "AT HIS SHOULDER",
      () => false,
      "eum_listen");

    /* TELEMACHUS — who hears the thunder, goes and puts bronze on, and comes
       down off his own place to stand at the other hand of the shot. He is the
       only person in the room besides his father who knows what is coming. */
    figure("telemachus", telemachus,
      tt => {
        const struck = tt >= THUND && tt < CONF;
        const armed  = tt >= SET;
        const after  = tt >= PROOF;
        return {
          browUp:   struck ? .56 : .24,
          browKnit: after ? .52 : armed ? .44 : .28,
          eyeWide:  struck ? .44 : 0,
          eyeNarrow:after ? .38 : armed ? .26 : .16,
          frown:    after ? .26 : 0,
          jaw:      struck ? .26 : 0,
          mouthAsym:.10,
          smile:    0,
        };
      },
      tt => tt >= SIGNAL ? "I HAVE THE SILL"
          : tt >= WORD   ? "NO, FATHER"
          : tt >= LOOSE  ? "CLEAN THROUGH"
          : tt >= SET    ? "BRONZE ON ME"
          : tt >= ARM0   ? "MY SWORD AND SPEAR"
          : tt >= THUND  ? "THE SKY ANSWERED"
          : tt >= BRACE  ? "HE IS STRINGING IT"
          :                "HE HAS THE FLOOR",
      () => false,
      "walk_neutral");

    /* ODYSSEUS — the beggar at the mouth of his own lane, doing the two
       things nobody in the room believes he can do. One body, one guise
       channel, PINNED at `beggar` for the whole scene (note D). The bow is in
       his hands on every frame and in nobody else's. */
    figure("odysseus", odysseus,
      tt => ({
        guise:"beggar",
        browKnit: tt >= DRAW ? .46 : tt >= BRACE ? .28 : .34,
        browUp:   tt >= THUND && tt < CONF ? .34 : .14,
        eyeNarrow:tt >= NOCK ? .52 : tt >= BRACE ? .38 : .30,
        smile:    tt >= THUND ? .30 : tt >= EASY ? .16 : .04,
        mouthAsym:tt >= THUND ? .36 : .10,
        cheek:    tt >= THUND ? .20 : 0,
        jaw:      0,
      }),
      tt => tt >= SIGNAL ? "THE NEXT PHASE"
          : tt >= WORD   ? "NOT DISGRACED"
          : tt >= PROOF  ? "NO AXE MISSED"
          : tt >= LOOSE  ? "AWAY"
          : tt >= DRAW   ? "STRING AND NOTCH"
          : tt >= NOCK   ? "ONE SHAFT"
          : tt >= THUND  ? "THE SIGN"
          : tt >= SING   ? "LIKE A SWALLOW"
          : tt >= BRACE  ? "AS A SINGER SEATS A GUT"
          :                "IT IS SOUND",
      /* the bow is in HIS hands on every frame of this scene, and in nobody
         else's: there is one bow and it does not change hands here (note G) */
      () => true,
      "walk_neutral");

    queue.sort((a, b) => a.d - b.d).forEach(q => q.draw());

    /* --- 3. THE SHOT (note H). The plan's own ray, and the module on it. -- */
    if (t >= DRAW) centreline(offctx, W, H, RUN_Y0 + 0.035, RUN_Y1 - 0.030);
    if (t >= LOOSE && t < CATCH){
      const u = clamp01((t - LOOSE) / (CATCH - LOOSE));
      flightShaft(offctx, W, H, u);
    }

    /* --- 4. THE TWO INSTRUMENTS. Overlays, always last (note J). --------- */
    if (t >= SING){
      const node = t >= SET ? "recognized" : t >= SING + 3 ? "singing" : "pluck";
      const s = song.states.nodes[node].preview;
      detailField(offctx, W, H, SONG_DST);
      plate(offctx, W, H, song, SONG_CW, SONG_CH, SONG_WIN, SONG_DST,
            { ...s, status:s.status, progress:prog }, `song|${node}`);
    }
    if (t >= NOCK){
      const mode = arrowPlateMode(t);
      const P = ARROW_PLATE[mode];
      const s = arrow.states.nodes[mode].preview;
      detailField(offctx, W, H, ARROW_DST);
      plate(offctx, W, H, arrow, P.cw, P.ch, P.win, ARROW_DST,
            { ...s, t:0.5, status:s.status, progress:prog }, `arrow|${mode}|plate`);
    }
  },
};
export default scene;

/* named binding so Book XXII's first scene can `import { exitOccupancy as
   INITIAL }`. S07 plays in the same hall as S05 and S06 and every station
   above is a megaron station or one of this book's declared offsets, so it
   needs no translation table — the archer is at `bow_stance` with the shot bow
   in his hands, the shaft is in the wall at `door_main`, the son is armed at
   `sons_side`, the swineherd is still at `hand_off`, the cowherd is in the
   side door at `postern`, the women are behind the bolt at `doorway_maid`, and
   `threshold` — the sill Book XXII opens on — is empty and has been empty all
   evening. */
export const exitOccupancy = scene.exitOccupancy;

/* the plan is exported too, so Book XXII can block through the same offsets
   rather than re-deriving them and drifting. */
export const plan = hallPlan;
