/* ============================================================
   SCENE  OD-B19-S06 — The Dream of the Geese              (Od. 19.508–604)
   Book XIX, scene 6 — the last scene of the book. ADDITIVE: creates no asset,
   modifies no tracked file, casts only modules that already exist. Shape copied
   from the reference scene scenes/OD-B16-S03.mjs, with the mature compositing
   helpers of its Book XIX siblings OD-B19-S04 and OD-B19-S05 (portrait figure
   box, windowed plate, document sheet) and one this scene needs — a COMPOSITE
   SHEET, one piece of paper carrying three windows of two different modules,
   because the set piece the atlas asks for by name does not exist (see MISSING
   MODULE below).

   WHAT THIS SCENE IS FOR. Two of the five modules the atlas asks for here were
   authored FOR this scene and say so in their own headers (`scene:"OD-B19-S06"`):
   creature.twenty-dream-geese is a flock machine that runs feed -> alarm ->
   attack -> fallen -> reset and lays its dead out in countable rows, and
   divine_fx.dream-eagle-with-odysseus-voice is a measuring instrument for a
   SOUND — a corridor from a raptor's gape to a listener's ear with an
   articulation gate that slides back up it, so the cry becomes speech in front
   of you instead of being labelled as speech. The scene's whole job is to run
   those two machines against each other on ONE clock while the woman who is
   dreaming them says them out loud, in a dark hall, to the man they are about.
   Nothing physical happens in this room for fifty seconds: the content is a
   told dream, an interpretation, and a set of terms. So the room is staged as
   what it is — a night hall with two people either side of a banked fire — and
   the dream is staged as INSTRUMENTS on paper, which is the only honest way an
   atlas of this kind can draw a thing that is not in the room.

   ROOM — rooms are state, not new rooms. Same night as S01–S05, so the field is
   location.megaron-hall in state `night`, blocked through scenes/_plans/
   megaron.mjs. No second hall is built or cast. The three layers that are pure
   mass at this state's lift:1 (`furniture` = benches stacked, `throne`,
   `litter`) are dropped exactly as S04 drops them; what is left is shell, roof,
   far wall, shut doors, sill, both side doors, stair, the two roof-pillars, the
   lane and the banked hearth — the architecture the plan names, and paper
   between it.

   MISSING MODULE, AND WHAT STANDS IN FOR IT. The atlas asks for
   `set-piece.bow-and-twelve-axes-preview`. It is job 19 of book19/jobs.json and
   it has not been built; the ADDITIVE rule forbids this scene from building it.
   So the preview is COMPOSED, on one sheet, from the two tracked modules that
   already own its two halves: `prop.odysseuss-bow` in mode `examined` (the
   braced weapon with its string path — see THE TERMS for why that mode and not
   `strung`, which is the semantically right one), laid on its side
   across the top of the sheet, and `set_piece.axe-alignment-lane` windowed to
   its COUNT block, which states the twelve as GEOMETRY: a seven-segment `12`
   over a twelve-stroke tally comb, printed here at very close to 1:1 with the
   module's own drawing, so the numeral stands 48 px tall. The sheet is
   therefore literally "bow and twelve axes, previewed": the weapon that has to
   be strung, and how many holes the arrow has to go through.
     WHAT IS NOT ON IT, AND WHY. The lane itself is not drawn — twelve axes
     solved into 230 px of sheet is twelve 19-px blades, i.e. mush — and no axe
     is put on this hall's floor, because in Book XIX there are no axes in this
     hall: it is a proposal, not a set-up. The module's SOCKET SECTION inset was
     on this sheet in draft 2 and came off it: its ink lives in the right third
     of its own declared box, so windowed at 160 px it printed as two corner
     brackets and an inch of haft on empty paper — a slot that says nothing is
     worse than a slot that is not there.
     The lane module is rendered at exactly 660x880 and never at another size:
     its tally comb is typed in ABSOLUTE pixels against that canvas (COUNT.step
     = 16), so a different canvas would slide the strokes off their own numeral.

   ONE BODY, ONE GUISE. Odysseus is character.odysseus-b16 with guise:"beggar"
   held flat for all 56 seconds — never a cut to `.odysseus-as-beggar`, which is
   the id the atlas asks for by name. There is no restoration in Book XIX. The
   whole tension of the scene is that the voice in the queen's dream is his and
   the body in front of her is not, and a body that changed would give that away.

   THE THREE INSTRUMENTS, AND WHERE THEY SIT.
     · THE FLOCK, upper left, as a document on its own paper (the `sheet`
       operation S03 introduced for the cloak record and S04 used for the scar).
       Window: the twenty birds and their troughs only. Its own tally and its own
       big `20` are CROPPED OUT — solved into this destination they come out 22 px
       tall, which is the numerals-as-mush failure the brief warns about, and the
       count is carried instead by the eagle's ledger, where it prints at 40.
       The flock is a light asset (level-1 domestic plumage, dark only on bills,
       feet and grain) and it is 0.29 x 0.47 of the frame of opaque PAPER in a
       room whose state pushes every tone a level darker and the floor two. The
       frame needs that much paper, and this is the one corner where it can go
       without covering a body.
       SIZE, HONESTLY. A goose comes out about a tenth of the panel's width, so
       at this destination each bird is 60 px and no bird is a portrait. What the
       plate carries at 60 px is the FLOCK — a field of birds over troughs while
       they are alive, and, from FALLEN on, the ARRAY: four ranks of five laid out
       in rows, which is countable at this size and is the one thing the dream
       actually asks the dreamer to do. That is why the clock below gets the flock
       into `fallen` at t=29 and holds it there for twenty-five seconds instead of
       spending them on the stoop.
     · THE OMEN, centre, keyed onto its own paper and PINNED BY THE EAR. The
       module is authored in its own portrait aspect (its eagle is 1.76 wide to
       high in it; stretched into a landscape canvas it becomes a 3.4:1 bird), so
       it is drawn at 660x880 and windowed — eagle, corridor, gate, speech blocks
       and the ear, and nothing else. The window is solved so the module's own
       `target:ear` anchor lands at frame (.600,.337), which is 0.06 of the frame
       to the LEFT of the queen's blocked head: the corridor arrives at her, and
       her figure, drawn after, laps its last inch. The gape lands at (.414,.151),
       high in the room over the shut great doors — the projecting roof-beam of
       Od. 19.544. Left of the gate the sound is a jagged cry; right of it it is
       quantized into words. That gate sliding back toward the beak IS beat 2,
       and it is the one thing in this scene that no figure could carry.
     · THE LEDGER, upper right, as its own strip. Second window of the SAME cached
       eagle canvas (keyedModuleCanvas caches on state+sig, so it costs one
       draw): twenty tally strokes struck through, the seven-segment `20`, and the
       struck suitor-cluster the count is equated to. This is the sentence "the
       geese are the suitors" drawn as arithmetic, and it is the only place in the
       frame where a numeral is big enough to survive the dot lattice — 40 px.
       It arrives on the frame the voice becomes intelligible and never leaves.
       0.26 of the frame wide, not a full-width bar, in the one band nothing else
       in this scene ever occupies: no head in the room rises above y .27.
     · THE TERMS, lower left, the composite sheet above. Arrives at CONTEST and
       stays: once a woman has said it out loud, it is in the room.

   CONTINUITY IN — inherited, computed, nothing retyped. This is the one join in
   Book XIX that needs a decision, because the previous scene is a DIGRESSION.
     import { exitOccupancy as PREV_PARNASSUS } from "./OD-B19-S05.mjs"
       -> { odysseus:"return_bend", boar:"clearing_beast" }   PARNASSUS stations
     import { exitOccupancyHall as PREV_HALL }  from "./OD-B19-S05.mjs"
       -> { odysseus:"pillar_l", penelope:"pillar_r", eurycleia:"bench_l2",
            melantho:"doorway_maid", weapons:"storeroom", basin:"pillar_l" }
     S05's own header instructs exactly this: "A scene that resumes in the hall
     wants that one." S05 is Od. 19.392–466, sixty lines outside the story's own
     time, cut in between the nurse's fingers closing on the ridge and her
     letting the foot fall; the megaron did not move while it ran. So the hall
     occupancy is the live one and it is imported whole. `PREV_PARNASSUS` is
     imported too, and DROPPED entire, deliberately and by name:
       · odysseus at `return_bend` — that station only exists in the mountain's
         local plan. Carrying it would ask blockingAt(megaron, ...) for a station
         the hall does not have, and it would (correctly) throw. The man himself
         is already in this room, at `pillar_l`, in the hall occupancy.
       · boar at `clearing_beast` — a dead animal on a mountain in a memory.
         Dropping a body the story left in another register is the same
         operation as dropping one it left in another room.
     Nobody else is dropped. `melantho` (still behind the women's door),
     `weapons` (the sixteen pieces shut in the storeroom, which Book XXI comes
     for) and `basin` (tipped over on the flags at his feet, never righted) are
     carried through unmoved and never drawn: they are facts, not pictures.

   BLOCKING. Stations, never coordinates. Two walkers, one leg each.
     · eurycleia `bench_l2` -> `doorway_maid`. Od. 19.503–507: sworn to silence
       she goes out for water, and the poem gets her off the floor before the
       queen comes back down to the stranger. It is also what the frame needs —
       at bench_l2 she stands 0.50 of the frame's height tall with her head at
       y .34, i.e. inside the flock sheet, and the dream cannot come up over the
       top of her. So she leaves BEFORE the telling starts (out at t=13, the
       sheet arrives at t=16) and the scene never has to draw a woman and a
       document in the same square inch.
     · penelope `pillar_r` -> `stair_up`. The last beat of the book. `stair_up`
       is the plan's own station for the way to her chamber (x .92, z .66), so
       "she withdraws upstairs" is one declared leg through the room she has
       been standing in, ending nearer the camera and to the right, which is
       what walking to a stair on the right-hand wall looks like. She is 0.10 of
       the frame from the preview sheet's right edge when she gets there and
       laps nothing.
     · odysseus: no row. He holds `pillar_l`, as he has since S02. Od. 19.508ff
       has him answer her without moving, and the beggar who has just had his
       hand on the nurse's throat has every reason to stay where the firelight
       does not reach. The gap the pillars set — his .338, hers .662 of the
       frame — is the gap S02 measured and S03, S04 and this scene hold: close
       enough to talk across a fire, far enough that neither of them can touch
       the other, which is the whole condition of Book XIX.
     · THE CONTACT PAIR is `pillar_l` / `pillar_r`, and it is a NON-contact pair
       by construction: nothing in this scene touches anything. The only two
       bodies that could collide are the nurse leaving and the queen standing,
       and they pass with 0.13 of frame x and a whole depth step between them
       (bench_l2 scale 1.058, pillar_r scale .886), near body drawn last.
     · No body enters the hearth ring at any t, at any leg of any move.

   Beats (Od. 19.508–604):
     1. With the nurse sworn and gone, Penelope tells the beggar her dream:
        twenty geese feeding in the house, and a great eagle out of the mountain
        that breaks their necks and leaves them lying in rows.
     2. In the dream the eagle comes back, and its raptor cry turns into a man's
        voice — her husband's — saying the geese are the suitors and he is the
        eagle.
     3. Odysseus refuses to read it any other way: the dream has one meaning and
        no other, and it is not one of the false ones out of the ivory gate.
     4. She names the terms all the same: the axes her husband used to set up in
        a line, the bow nobody else can string, and marriage to whoever shoots
        through all twelve.
     5. She goes up to her room, lies down, and Athena pours sleep over her.

   Verify:  node harness/render-scene.mjs scenes/OD-B19-S06.mjs --t 28
            node harness/render-scene.mjs scenes/OD-B19-S06.mjs --t 52
   ============================================================ */
import { placeInstance, keyedModuleCanvas, PAPER, INK, clamp, clamp01, lerp }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field     from "../assets/location/megaron-hall.mjs";
import odysseus  from "../assets/character/odysseus-b16.mjs";
import penelope  from "../assets/character/penelope.mjs";
import eurycleia from "../assets/character/eurycleia.mjs";
import geese     from "../assets/creature/twenty-dream-geese.mjs";
import eagle     from "../assets/divine_fx/dream-eagle-with-odysseus-voice.mjs";
import bow       from "../assets/prop/odysseuss-bow.mjs";
import lane      from "../assets/set_piece/axe-alignment-lane.mjs";

/* CONTINUITY IN — both of the previous scene's computed exits are imported.
   The hall one is used; the mountain one is dropped, by name, in INITIAL. */
import { exitOccupancyHall as PREV_HALL,
         exitOccupancy     as PREV_PARNASSUS } from "./OD-B19-S05.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 56;

/* the hall minus the three layers that are pure mass at lift:1 (see header). */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks",
                     "postern","maidsdoor","stair","pillars","lane","hearth"];

/* the digression's occupancy is in PARNASSUS stations and is dropped whole:
   `odysseus:"return_bend"` is a station this plan does not have (the man is
   already in the hall occupancy at pillar_l) and `boar:"clearing_beast"` is a
   dead animal in a memory. Named here so the drop is a decision, not a slip. */
const DROPPED_FROM_DIGRESSION = Object.keys(PREV_PARNASSUS);   // ["odysseus","boar"]
const INITIAL = { ...PREV_HALL };

/* --- THE CLOCK. One set of gates; every machine in the scene reads them. --- */
const RELEASE = 4;                    // his hand comes off the nurse's throat
const EU_OUT0 = 7,  EU_OUT1 = 13;     // the nurse out through the women's door
const SETTLE  = 14;                   // the queen turns back to the stranger
const DREAM0  = 16;                   // "hear this dream of mine" — FEEDING
const ALARM   = 21;                   // in the dream the flock reads the sky
const EAGLE0  = 22;                   // the omen enters: the beam, the stoop
const STOOP   = 25;                   // the stoop; the birds bolt; first dead
const FALLEN  = 29;                   // twenty dead in rows on the dream floor
const VOICE0  = 34;                   // the cry begins to articulate
const VOICE1  = 41;                   // "the geese are the suitors"
const INSIST  = 43;                   // one meaning, and no other
const CONTEST = 46;                   // she names the terms; the sheet arrives
const WD0     = 50, WD1 = 54;         // up the hall to the stair
const SLEEP   = 54;                   // Athena pours sleep; the flock ghosts

const seg = (t, a, b) => clamp01((t - a) / Math.max(1e-6, b - a));

/* --- BLOCKING. Stations, not coordinates. One leg each for two walkers; the
   beggar has no row at all and holds the left roof-pillar for 56 seconds. --- */
const MOVES = [
  { who:"eurycleia", from:"bench_l2", to:"doorway_maid", t0:EU_OUT0, t1:EU_OUT1 },
  { who:"penelope",  from:"pillar_r", to:"stair_up",     t0:WD0,     t1:WD1     },
];

/* WHICH SIDE THE ARM GOES. The rig throws every directional pose with the RIGHT
   arm, i.e. to screen right, and ships a `mirror` flag that swaps the limb pairs
   properly — so pointing the other way is one flag and never a hand-drawn arm.
   Penelope's one target, the stranger at pillar_l, is to her LEFT all scene, so
   the set S02/S03/S04 mirrored is mirrored again. Odysseus is mirrored ONLY
   while his hand is still on the nurse, who is down on his left; from RELEASE on
   his only target is the queen, who is to his right, and nothing of his is
   mirrored. */
const DIRECTIONAL = new Set(["confrontation","reach_forward","pointing_arm",
                             "guarded_withdrawal","protective_block","lean_forward",
                             "palm_up_question","penelope_plea","offering_hand"]);

/* ---- THE BOX A BODY IS DRAWN IN (the OD-B21-S01 / OD-B19-S04 rule) -------
   placeInstance() hands a module a box of the STAGE's aspect, 1120x760.
   figure-hero caps the skeleton height so a body survives a wide box, but every
   width-relative decoration stretches with W — character.penelope lays her veil
   and skirt out in box-W fractions and character.eurycleia her apron and her
   opaque headscarf. In a landscape box the queen renders as a wide bell under a
   flattened kerchief. Every figure here is therefore drawn into the PORTRAIT box
   the atlas uses for characters, 660/880, and blitted. FIG_FLOOR is the rig's
   own floor line: figure-hero corrects the lower ankle onto H*0.90 of its box,
   so anchoring by the box's bottom edge would hang the body a tenth of its
   height above the mark the plan gave it. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
/* ONE body height for this room, times the plan's own depth falloff. S04 uses
   0.55 in this hall for a scene whose content is a hand on a leg; this one has
   three instruments standing in the same frame as three bodies, and at 0.55 the
   queen's head lands at y .20 — a fifth of the way down the frame — and there is
   no room above her for the dream that is the whole scene. Draft 1 answered that
   with 0.47 and lost the argument the other way: the instruments came back
   reading as the subject and the two people in the room as annotations on them,
   which is exactly backwards for a scene whose content is one person talking to
   another. 0.53 is where it balances — the pillar bodies stand 357 px tall on a
   760 px stage with their heads at y .27, and every plate in the frame is solved
   to sit above .27 or outboard of x .32 / .70, so no head is ever inside a sheet.
   Nothing is nudged per figure; one number, and the plates move instead. */
const K_HALL    = 0.53;

/* blit a module into a box of a chosen aspect, anchored by a point INSIDE the
   box. `sig` is required: keyedModuleCanvas caches on pose/band/t only, so
   without it a change of gaze or brow returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* PAPER — lay a document ground down on the stage. A record is a document and
   gets a document's ground, so every level on it reads exactly as it does on the
   module's own card instead of fighting a wall that halftones to the same
   density. Same operation placeInstance's full-bleed branch performs for a set
   piece, done on a sub-rect, plus the hairline the atlas gives a plate. */
function paper(offctx, W, H, dst){
  const x = dst.x0*W, y = dst.y0*H;
  const w = (dst.x1-dst.x0)*W, h = (dst.y1-dst.y0)*H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 3;
  offctx.strokeRect(x+1.5, y+1.5, w-3, h-3);
  offctx.restore();
}
/* SLOT — blit one declared WINDOW of a module's own drawing into one rect of a
   sheet. `cw`/`ch` is the canvas the drawing is made on, and it is never varied:
   several of these modules type sizes in absolute pixels against their own
   design canvas. */
function slot(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* SLOT, TURNED — the same operation with the window rotated a quarter turn, so a
   tall object can be laid down across a wide sheet. Used once, for the bow (see
   THE TERMS): solved upright into this sheet the weapon is 69 px wide and its
   string is a single dot-cell, which is a crescent and not a bow; laid on its
   side it is 230 px long and the string survives — and a bow off its owner lies
   down, in a chest or on a table, so the turn costs the picture nothing. */
function slotTurned(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  const dx = dst.x0*W, dy = dst.y0*H;
  const dw = (dst.x1-dst.x0)*W, dh = (dst.y1-dst.y0)*H;
  offctx.save();
  offctx.translate(dx + dw, dy);
  offctx.rotate(Math.PI/2);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    0, 0, dh, dw);
  offctx.restore();
}

/* SHEET — paper, then one window on it. */
function sheet(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  paper(offctx, W, H, dst);
  slot(offctx, W, H, mod, cw, ch, win, dst, state, sig);
}

/* ---- WHERE THE THREE INSTRUMENTS SIT -----------------------------------
   Every destination below has the aspect of its own window, so no plate is ever
   scaled off its own proportions, and every one is solved against the blocked
   bodies rather than placed by eye.

   THE FLOCK. Canvas 660x880 (the module's own aspect; it sizes every goose off
   min(W,H) so a landscape canvas gives twenty small birds in a wide field).
   Window: the twenty and their troughs — x .055–.955, y .150–.885 — which is
   594x647, aspect 0.918. Destination 0.282 W by 0.4526 H = 316x344 px, aspect
   0.919. The module's own tally and `20` (y .90–.96) are cropped: see header. */
const GO_CW = 660, GO_CH = 880;
const GO_WIN = { x0:.055, y0:.150, x1:.955, y1:.885 };
const GO_DST = { x0:.018, y0:.085, x1:.310, y1:.553 };

/* THE OMEN. Same canvas discipline. Window: the bird, the whole corridor with
   its gate and speech blocks, and the ear — x .070–.990, y .020–.660, which is
   607x563, aspect 1.078. Destination 0.268 W by 0.366 H = 300x278, aspect 1.079.
   Solved by the EAR: the module's `target:ear` (.868,.598) sits at window-
   relative (.862,.909) and therefore at frame (.600,.337) — 0.06 of the frame
   left of the queen's blocked HEAD (her head runs y .267–.36 at this body
   scale), which is where a voice arriving at somebody belongs. Its gape then
   falls at (.414,.151), high in the room over the shut great doors — the
   projecting roof-beam. The left margin the module leaves under the corridor is
   cropped by x0 .105: it held only the falling feathers, which are off. */
const EG_CW = 660, EG_CH = 880;
const EG_WIN = { x0:.105, y0:.030, x1:.990, y1:.655 };
const EG_DST = { x0:.389, y0:.028, x1:.634, y1:.368 };
/* THE LEDGER — second window of the SAME cached canvas: the struck tally, the
   seven-segment `20`, and the suitor cluster it is equated to. x .020–.965,
   y .752–.892 is 624x123, aspect 5.07; destination 0.259 W by 0.0987 H =
   290x57, aspect 5.09. At that reduction the numeral prints 40 px tall, which is
   why the count lives here and not on the flock sheet. It goes in the upper
   RIGHT, the one band of this frame nothing else wants: the queen's own head
   never rises above y .267 even standing on the stair, so a strip stopping at
   .160 is clear of every body at every t, and it is clear of the card's blue
   mark at x .94. A readout belongs at the top of a sheet of instruments. */
const EG_LEDGER_WIN = { x0:.020, y0:.752, x1:.965, y1:.892 };
const EG_LEDGER_DST = { x0:.705, y0:.085, x1:.964, y1:.160 };
const EG_LAYERS        = ["corridor","eagle","ear"];
const EG_LEDGER_LAYERS = ["ledger"];

/* THE TERMS — the composite sheet that stands in for the unbuilt set piece.
   One ground, two windows, two modules, on the lower left under the flock:
     BOW      prop.odysseuss-bow, mode `examined` — the inspection drawing:
              braced limbs, the horn-core-sinew laminae, the ivory grip plate and
              the STRING PATH. Window x .285–.640, y .085–.860 = 234x682, aspect
              0.343, laid down TURNED: 230x79 px. This module has no layer gate —
              `mode` decides what is built — so the mode is the whole
              specification, and the choice of `examined` over `strung` is the
              one thing on this sheet that took three drafts. `strung` is the
              semantically right mode (the terms are about stringing it) and it
              was used in drafts 2 and 3; at this reduction its string is a rule
              one dot-cell wide and it printed as nothing at all, so the plate
              came back as a plain crescent — a bowl rim, not a bow. `examined`
              draws the same braced weapon with a heavy called-out string path,
              and that survives: the plate now reads as limbs curving up off a
              straight chord with the grip block at its middle, which is a bow at
              80 px. The window stops at x .640 so the callout column, its
              swatches and its numerals stay out of the frame; the leader stubs
              that cross the cut are the only thing it lets in, and a spec plate
              is allowed leader stubs. The ownership tally is not on it: that
              chain is Book XXI's business.
     COUNT    set_piece.axe-alignment-lane, cropped tight to the seven-segment
              `12` over its twelve-stroke tally comb (x .075–.420, y .775–.905 =
              228x114, aspect 2.0), laid down at 230x115 — very nearly 1:1 with
              the module's own drawing, so the numeral prints 48 px tall and the
              twelve strokes stand 10 px apart. The count is stated as GEOMETRY,
              per the module's own header and the brief; nothing in this frame
              relies on set type.
   The lane's own lane, sightline, arrow, aperture and section are never drawn:
   no axe goes on this hall's floor in Book XIX. */
const BOW_CW = 660, BOW_CH = 880;
const BOW_WIN = { x0:.285, y0:.085, x1:.640, y1:.860 };     // 234x682, ar .343
const LANE_CW = 660, LANE_CH = 880;
const CNT_WIN = { x0:.075, y0:.775, x1:.420, y1:.905 };     // 228x114, ar 2.00
const TERMS_DST = { x0:.030, y0:.618, x1:.290, y1:.920 };   // 291x230 of paper
const TERMS_BOW = { x0:.042, y0:.640, x1:.247, y1:.744 };   // 230x 79, TURNED
const TERMS_CNT = { x0:.042, y0:.762, x1:.247, y1:.913 };   // 230x115, ar 2.00

/* ---- the two dream machines, as functions of one t --------------------- */
/* the flock: feeding -> heads up -> the stoop -> twenty counted -> and, when
   sleep comes down on the dreamer, the loop back to the trough as ghosts. */
const gooseMode = t => t >= SLEEP  ? "reset"
                     : t >= FALLEN ? "fallen"
                     : t >= STOOP  ? "attack"
                     : t >= ALARM  ? "alarm" : "feed";
function gooseState(t){
  const mode = gooseMode(t);
  return {
    pose: mode,
    /* the module's own internal beat, held slow: a told dream is not newsreel */
    t: mode === "fallen" ? 0 : ((t - DREAM0) * 0.42) % 6,
    layers:["troughs","grain","shadow","stoop","flock","feathers"],
    status: mode === "reset"  ? "DREAMING" : mode === "fallen" ? "TWENTY"
          : mode === "attack" ? "STOOP"    : mode === "alarm"  ? "ALARM" : "FEEDING",
    progress: clamp01(0.12 + 0.84 * ((t - DREAM0) / (D - DREAM0))),
  };
}
/* the omen: the stoop, the kill, the raw cry, the articulation, the declaration.
   kill and voice are driven off this scene's gates and not off the module's own
   nine-second period, so the bird's clock and the dreamer's mouth agree. */
function eagleState(t){
  const kill  = clamp01(seg(t, STOOP, FALLEN));
  const voice = clamp01(seg(t, VOICE0, VOICE1));
  return {
    t: (t - EAGLE0) * 0.55,
    kill, voice,
    /* the gape is wide on the cry and closes as the sound becomes words: a mouth
       making speech is not a mouth screaming. */
    gape: t < STOOP ? 0.25 + 0.60 * seg(t, EAGLE0, STOOP)
        : t < VOICE0 ? 1.0
        : lerp(1.0, 0.52, voice),
    status: voice >= 1 ? "DECLARED" : voice > 0 ? "ARTICULATING"
          : kill  >= 1 ? "CRYING"   : kill  > 0 ? "KILLING" : "STOOPING",
    progress: clamp01(0.07 + 0.90 * ((t - EAGLE0) / (D - EAGLE0))),
  };
}

export const scene = {
  id:"OD-B19-S06",
  title:"The Dream of the Geese",
  book:19,
  plan:"megaron",
  duration:D,
  beats:[
    "After the secret is restored, Penelope tells the beggar her dream of twenty geese killed by a great eagle.",
    "In the dream the eagle speaks with Odysseus's voice and says the geese are the suitors.",
    "Odysseus insists the dream has one unavoidable meaning.",
    "Penelope announces the bow contest: she will marry the man who strings Odysseus's bow and shoots through twelve axes.",
    "She withdraws upstairs and Athena gives her sleep.",
  ],
  exitState:
    "Late night in the stripped megaron, the fire banked, the great doors shut, the arms gone from the walls. " +
    "The dream has been told, read, and answered, and the contest has been set out loud in front of the man it is for. " +
    "Penelope is no longer in the hall: her last declared leg takes her from the right-hand roof-pillar to `stair_up`, " +
    "the foot of the stair to her own chamber on the right-hand wall, and she is standing on it with her head down " +
    "and Athena's sleep already coming over her — she goes up, lies down, and sleeps, and she does not know that the " +
    "terms she has just named will be met tomorrow by the man she named them to. The terms themselves are now fixed " +
    "continuity for Book XXI and must not drift: the axes her husband used to stand up in a line down the floor of " +
    "this hall, twelve of them; his own bow, which no one else in the house can string; and marriage to whoever " +
    "strings it and sends an arrow through all twelve socket-eyes. Odysseus is still the beggar and has not moved all " +
    "scene: he holds the left-hand roof-pillar at `pillar_l`, unnamed to the house, out of the firelight, having just " +
    "heard his wife hand him the one contest he cannot lose. The old nurse Eurycleia is out of the hall — sworn to " +
    "silence in S04, she has gone back through the women's door at `doorway_maid`, where Melantho has been all night; " +
    "neither is drawn again in Book XIX. The foot-washing basin is still lying over on the flags at the beggar's feet " +
    "where she struck it, empty and never righted, and the sixteen pieces of armour are still shut in the storeroom " +
    "off the postern. NOTE FOR BOOK XX: the hall is left with nobody standing in it but the beggar, and the first " +
    "thing Book XX does is put him down on the floor of the forecourt to lie awake — he leaves this room from " +
    "`pillar_l` and from nowhere else.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"night" },
    { asset:"creature.twenty-dream-geese", instance:"geese_01",
      anchor:{x:.16,y:.54}, scale:.28, state:"feed" },
    { asset:"divine-fx.dream-eagle-with-odysseus-voice", instance:"eagle_01",
      anchor:{x:.51,y:.43}, scale:.27, state:"stooping" },
    { asset:"prop.odysseuss-bow", instance:"bow_01",
      anchor:{x:.08,y:.91}, scale:.06, state:"examined" },
    { asset:"set_piece.axe-alignment-lane", instance:"axes_01",
      anchor:{x:.20,y:.87}, scale:.14, state:"laid" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.34,y:.69}, scale:.42, band:"threeq", pose:"confrontation" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.66,y:.69}, scale:.42, band:"threeq", pose:"penelope_grief" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:.21,y:.84}, scale:.50, band:"threeq", pose:"eury_hush" },
  ],

  timeline:[
    /* the frame S04 left: his hand on her throat, the queen turned away */
    { op:"actor.pose", target:"odysseus",  at: 0.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",  at: 0.0, args:{ gaze:{ x:-.52, y:.22 } } },
    { op:"actor.pose", target:"eurycleia", at: 0.0, args:{ pose:"eury_hush" } },
    { op:"actor.gaze", target:"eurycleia", at: 0.0, args:{ gaze:{ x:.30, y:-.10 } } },
    { op:"actor.pose", target:"penelope",  at: 0.0, args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope",  at: 0.0, args:{ gaze:{ x:.18, y:-.16 } } },
    /* he lets her go; she gets up and goes out for water */
    { op:"actor.pose", target:"odysseus",  at:RELEASE, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"odysseus",  at:RELEASE, args:{ gaze:{ x:-.34, y:.16 } } },
    { op:"actor.pose", target:"eurycleia", at:EU_OUT0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eurycleia", at:EU_OUT0, args:{ gaze:{ x:.42, y:.06 } } },
    { op:"actor.pose", target:"odysseus",  at:EU_OUT1, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",  at:EU_OUT1, args:{ gaze:{ x:.30, y:.04 } } },
    /* beat 1 — the queen comes back to the stranger and tells the dream */
    { op:"actor.pose", target:"penelope",  at:SETTLE, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"penelope",  at:SETTLE, args:{ gaze:{ x:-.34, y:.08 } } },
    { op:"actor.pose", target:"penelope",  at:DREAM0, args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope",  at:DREAM0, args:{ gaze:{ x:-.40, y:-.18 } } },
    { op:"actor.pose", target:"odysseus",  at:DREAM0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus",  at:DREAM0, args:{ gaze:{ x:.36, y:.02 } } },
    { op:"actor.pose", target:"penelope",  at:ALARM,  args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"penelope",  at:ALARM,  args:{ gaze:{ x:-.30, y:-.30 } } },
    { op:"fx.play",    target:"eagle_01",  at:EAGLE0, args:{ dir:"stoop" } },
    { op:"actor.pose", target:"penelope",  at:STOOP,  args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"penelope",  at:STOOP,  args:{ gaze:{ x:-.24, y:-.36 } } },
    { op:"actor.pose", target:"penelope",  at:FALLEN, args:{ pose:"penelope_mourn" } },
    { op:"actor.gaze", target:"penelope",  at:FALLEN, args:{ gaze:{ x:-.10, y:.34 } } },
    /* beat 2 — the cry turns into his voice */
    { op:"actor.pose", target:"penelope",  at:VOICE0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"penelope",  at:VOICE0, args:{ gaze:{ x:-.34, y:-.22 } } },
    { op:"actor.pose", target:"odysseus",  at:VOICE0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"odysseus",  at:VOICE0, args:{ gaze:{ x:.28, y:-.34 } } },
    /* beat 3 — one meaning, and no other */
    { op:"actor.pose", target:"odysseus",  at:INSIST, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus",  at:INSIST, args:{ gaze:{ x:.40, y:.02 } } },
    { op:"actor.pose", target:"penelope",  at:INSIST, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"penelope",  at:INSIST, args:{ gaze:{ x:-.36, y:.04 } } },
    /* beat 4 — the terms */
    { op:"prop.state", target:"bow_01",    at:CONTEST, args:{ mode:"examined" } },
    { op:"prop.state", target:"axes_01",   at:CONTEST, args:{ mode:"laid" } },
    { op:"actor.pose", target:"penelope",  at:CONTEST, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"penelope",  at:CONTEST, args:{ gaze:{ x:-.42, y:.02 } } },
    { op:"actor.pose", target:"odysseus",  at:CONTEST, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",  at:CONTEST, args:{ gaze:{ x:.34, y:.00 } } },
    /* beat 5 — up the hall, and sleep */
    { op:"actor.pose", target:"penelope",  at:WD0,   args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"penelope",  at:WD0,   args:{ gaze:{ x:.30, y:.10 } } },
    { op:"actor.pose", target:"odysseus",  at:WD0,   args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"odysseus",  at:WD0,   args:{ gaze:{ x:.46, y:-.06 } } },
    { op:"actor.pose", target:"penelope",  at:SLEEP, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"penelope",  at:SLEEP, args:{ gaze:{ x:.10, y:.40 } } },
    { op:"timeline.capture", target:"OD-B19-S06", at:55.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st   = stateAt(scene, t);
    const blk  = blockingAt(megaron, MOVES, t, INITIAL);
    const brth = 0.35 + 0.30 * Math.sin(t * 0.58);      // deterministic idle

    /* 1. THE HALL at night, three mass layers dropped. It paints the room and
       everything else keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"night", t:brth, layers:HALL_LAYERS,
              status: t >= CONTEST ? "THE TERMS" : t >= DREAM0 ? "THE DREAM" : "BANKED",
              progress: clamp01(0.14 + 0.80 * (t / D)) },
    });

    /* 2. THE FLOCK, as a document in the upper left. It arrives when the telling
       does, not at t=0: before she opens her mouth the dream has no business in
       the frame, and the nurse is still on that floor. Drawn before the bodies,
       so wherever the sheet and a shoulder meet, the body wins. */
    if (t >= DREAM0){
      const gs = gooseState(t);
      sheet(offctx, W, H, geese, GO_CW, GO_CH, GO_WIN, GO_DST, gs,
            `geese|${gs.pose}|${Math.round(gs.t*4)}`);
    }

    /* 3. THE OMEN, centre, pinned by the ear (see header). One cached canvas,
       two windows: the bird and its voice corridor here, the ledger at 5. */
    const es = eagleState(t);
    const eSig = `eagle|${Math.round(es.kill*24)}|${Math.round(es.voice*24)}`
               + `|${Math.round(es.gape*20)}|${Math.round(es.t*4)}`;
    if (t >= EAGLE0){
      sheet(offctx, W, H, eagle, EG_CW, EG_CH, EG_WIN, EG_DST,
            { ...es, layers:EG_LAYERS }, eSig + "|omen");
    }

    /* 4. THE TERMS — the composite sheet standing in for the unbuilt set piece:
       one ground, the bow with its string path, and the twelve-count. */
    if (t >= CONTEST){
      paper(offctx, W, H, TERMS_DST);
      slotTurned(offctx, W, H, bow, BOW_CW, BOW_CH, BOW_WIN, TERMS_BOW,
           { mode:"examined", t:0.5, owner:3,
             status:"EXAMINED", progress:.50 }, "bow|examined|terms");
      slot(offctx, W, H, lane, LANE_CW, LANE_CH, CNT_WIN, TERMS_CNT,
           { layers:["count"], t:0.5, arrowQ:-0.075,
             status:"PLANTED", progress:.28 }, "lane|count");
    }

    /* 5. THE LEDGER — the interpretation as arithmetic, on the near floor in
       front of the fire. Arrives on the frame the cry becomes intelligible. */
    if (t >= VOICE0){
      sheet(offctx, W, H, eagle, EG_CW, EG_CH, EG_LEDGER_WIN, EG_LEDGER_DST,
            { ...es, layers:EG_LEDGER_LAYERS }, eSig + "|ledger");
    }

    /* 6. THE BEGGAR. One body, one guise, no move row: he holds the left
       roof-pillar for 56 seconds. His hand comes off the nurse at RELEASE and
       after that everything he has is in the face and the gaze — a man listening
       to his wife describe him killing twenty men and having to answer as
       somebody else. */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const pose = s.pose || "confrontation";
      const gripping = t < RELEASE;
      const listening= t >= DREAM0 && t < VOICE0;
      const hearing  = t >= VOICE0 && t < INSIST;    // his own voice, in her dream
      const insisting= t >= INSIST && t < CONTEST;
      const given    = t >= CONTEST;
      const gaze = s.gaze || { x:-.52, y:.22 };
      place(offctx, W, H, odysseus, {
        x:p.x, y:p.y, hFrac:K_HALL * p.scale, ar:FIG_AR,
        fx:0.5, fy:FIG_FLOOR, pad:FIG_PAD,
        state:{
          t:brth, guise:"beggar", band:"threeq", pose,
          mirror: gripping && DIRECTIONAL.has(pose), gaze,
          browKnit: gripping ? .70 : insisting ? .58 : hearing ? .30 : .22,
          browUp:   hearing ? .44 : given ? .34 : .10,
          eyeNarrow:listening ? .46 : insisting ? .38 : .24,
          eyeWide:  hearing ? .30 : 0,
          frown:    gripping ? .40 : 0,
          mouthAsym:given ? .46 : insisting ? .22 : .14,
          jaw:      insisting ? .34 : 0,
          smile:    given ? .16 : 0,
          status:   given     ? "TOMORROW"
                  : insisting ? "ONE MEANING"
                  : hearing   ? "HIS OWN VOICE"
                  : listening ? "TWENTY GEESE"
                  : gripping  ? "NOT A WORD" : "THE BEGGAR",
          progress: clamp01(0.16 + 0.78 * (t / D)),
        },
        sig:`ody|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
           +`|${gripping?1:0}|${listening?1:0}|${hearing?1:0}|${insisting?1:0}|${given?1:0}`,
      });
    }

    /* 7. THE QUEEN. One leg, at the very end. Everything before it is told: the
       dream is in her mouth and her hands, and the frame's two instruments are
       what she is saying. Her whole set is mirrored — her one target, the
       stranger, is to her left all scene. */
    {
      const p = blk.penelope, s = st.penelope || {};
      const pose = s.pose || "penelope_grief";
      const telling  = t >= DREAM0 && t < FALLEN;
      const counting = t >= FALLEN && t < VOICE0;
      const hearing  = t >= VOICE0 && t < CONTEST;
      const naming   = t >= CONTEST && t < WD0;
      const going    = t >= WD0;
      const gaze = s.gaze || { x:.18, y:-.16 };
      place(offctx, W, H, penelope, {
        x:p.x, y:p.y, hFrac:K_HALL * p.scale, ar:FIG_AR,
        fx:0.5, fy:FIG_FLOOR, pad:FIG_PAD,
        state:{
          t: p.moving ? (t * 0.40) % 4 : brth,
          band:"threeq", pose, mirror: DIRECTIONAL.has(pose), gaze,
          mouth:    naming ? .46 : telling ? .40 : counting ? -1 : .10,
          browUp:   counting ? .70 : hearing ? .56 : telling ? .40 : .34,
          browKnit: naming ? .44 : counting ? .40 : .22,
          frown:    counting ? .50 : going ? .24 : 0,
          eyeWide:  counting ? .40 : hearing ? .30 : .12,
          eyeNarrow:naming ? .28 : going ? .38 : .06,
          jaw:      naming ? .40 : telling ? .34 : 0,
          status:   going    ? "ATHENA POURS SLEEP"
                  : naming   ? "WHOEVER STRINGS IT"
                  : hearing  ? "IT WAS HIS VOICE"
                  : counting ? "TWENTY, IN ROWS"
                  : telling  ? "HEAR MY DREAM" : "THE QUEEN",
          progress: clamp01(0.12 + 0.84 * (t / D)),
        },
        sig:`pen|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
           +`|${telling?1:0}|${counting?1:0}|${hearing?1:0}|${naming?1:0}|${going?1:0}`,
      });
    }

    /* 8. THE NURSE, drawn last while she is in the room because she is the
       nearest body in it (bench_l2, depth .76 against the pillars' .44). She is
       sworn, she is on her feet, and she is out the women's door before the
       telling starts — which is what keeps a woman and a document out of the
       same square inch of frame. */
    if (t < EU_OUT1 + 0.5){
      const p = blk.eurycleia, s = st.eurycleia || {};
      const walking = p.moving;
      const pose = walking ? "walk_neutral" : (s.pose || "eury_hush");
      const gaze = s.gaze || { x:.30, y:-.10 };
      place(offctx, W, H, eurycleia, {
        x:p.x, y:p.y, hFrac:K_HALL * p.scale, ar:FIG_AR,
        fx:0.5, fy:FIG_FLOOR, pad:FIG_PAD,
        state:{
          t: walking ? (t * 0.44) % 4 : brth,
          band:"threeq", pose, gaze,
          mouth: -1, browUp:.52, browKnit:.58, eyeNarrow:.30, frown:.20,
          status: walking ? "GONE FOR WATER" : "SWORN",
          progress: clamp01(0.10 + 0.20 * (t / D)),
        },
        sig:`eu|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}|${walking?1:0}`,
      });
    }
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. Book XX opens in this
   room with the beggar still at `pillar_l`. */
export const exitOccupancy = scene.exitOccupancy;

/* what was thrown away at the join, kept as data rather than as a claim:
   the Parnassus digression's own occupancy (see header, CONTINUITY IN). */
export const droppedFromDigression = DROPPED_FROM_DIGRESSION;
