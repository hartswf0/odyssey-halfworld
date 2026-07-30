/* ============================================================
   SCENE  OD-B19-S03 — The Stranger Describes Odysseus     (Od. 19.220–307)
   Book XIX, scene 3. ADDITIVE: creates no asset, modifies no tracked file,
   casts only modules that already exist. Shape copied from the reference
   scene, OD-B16-S03.mjs, and from its Book XIX siblings S01 and S02.

   WHAT THIS SCENE IS FOR. This is the only place in the poem where Odysseus
   proves his own identity by describing HIMSELF in the third person, and the
   proof is made of OBJECTS: a sea-purple doubled cloak, a golden brooch with a
   hound throttling a dappled fawn, an onion-skin tunic, and a round-shouldered
   dark herald called Eurybates. So the scene is built as a PROOF EXHIBIT laid
   over a room in which nobody moves. The two speakers keep the measured gap
   S02 set — pillar_l and pillar_r, one on each side of the banked fire, the
   whole width of the hall between them — and every new thing that enters the
   frame is a remembered object, not a body crossing the floor. Nothing walks
   except the memory.

   ROOM — rooms are state, not new rooms. Same night, same hall, so the field is
   location.megaron-hall in state `night`, blocked through scenes/_plans/
   megaron.mjs: bare pegs on both walls (S01 stripped them), great doors shut,
   fire banked. The atlas casts no location for this scene at all; `night` is
   the state that already agrees with the two scenes on either side of it, and
   no second hall is built or cast.

   ONE BODY, ONE GUISE. Odysseus is character.odysseus-b16 with guise:"beggar"
   held flat for the whole scene — never a cut to `.odysseus-as-beggar`, which
   is the id the atlas asks for by name. There is no restoration in Book XIX.
   The one place the guise channel WOULD have been tempting is beat 2, where the
   man in rags describes the king's purple: that contrast is carried by putting
   the king's clothes on the wall as a plate while the body stays in rags, which
   is the actual dramatic fact. The channel does not move.

   CONTINUITY IN — inherited, computed, nothing retyped.
     import { exitOccupancy as INITIAL } from "./OD-B19-S02.mjs"  ->
       { odysseus:"pillar_l", penelope:"pillar_r",
         melantho:"doorway_maid", weapons:"storeroom" }
   The whole map is carried and NOBODY is dropped, because for once nobody needs
   to be: all four are in this room's plan and the two that are not drawn are
   not drawn for reasons of frame, not of geography.
     · melantho — KEPT at `doorway_maid`, never drawn. She was sent out in S02
       and is behind the women's door in the right wall. She is a fact of the
       house all through this scene (Od. 19.65 leaves her among the maids), and
       Book XX has to be able to find her there.
     · weapons  — KEPT at `storeroom`, never drawn. Sixteen pieces behind the
       postern wall; Book XXI comes for them.
   Occupancy is where bodies ARE, not what the camera sees. The two speakers
   therefore open exactly where S02 left them and never leave.

   BLOCKING. Stations, never coordinates — and this scene's blocking decision is
   mostly a decision NOT to move:
     · Odysseus holds `pillar_l` (frame x≈.338) and Penelope holds `pillar_r`
       (x≈.662) for all 62 seconds. S02 spent a whole file arguing that pair
       into place: one depth, mirrored across the fire, 0.32 apart in frame x,
       the household's standing places in the poem (Od. 21.64). Book XXIII pays
       that distance off when she finally sits down opposite him. A scene whose
       content is that he will not close the gap and she cannot must not close
       it, so there is no MOVES row for either of them.
     · The hearth ring occupies plan x .395–.605, z .445–.595 and NO body enters
       it at any t. The only walker is the herald, and he walks the far spine
       (`door_main` -> `axe_first`, z .10 -> .28), which is clear of the ring by
       a sixth of the room.
     · `axe_first` (x .50, z .28) is the one station that sits BETWEEN the two
       speakers in frame x and BEHIND both of them in depth: it resolves to
       x=.500, y=.617, against the shut great doors, with the banked hearth
       drawn nearer and lower. A remembered man stood there is inside the gap
       without being in either speaker's place, and the draw list — sorted by
       blocked depth — paints him behind both of them automatically. At the
       scale he is drawn his ink runs x .42–.58, so it laps about 10px of the
       beggar's and 20px of the queen's; because he is the far body those pixels
       are always his loss, never theirs.
     · No contact pair is declared and none is needed: not one body touches
       another in this scene. That is the point of it. The nearest approach is
       the herald's shoulder passing behind Penelope's at t≈29, 0.09 apart in
       frame x and a clear depth step apart, with the near figure drawn last.
     · The herald's SIZE is pinned by two frames at once, and 0.46 is the only
       value that satisfies both. Smaller and he is a doll swallowed by the dark
       leaf of the great doors he is standing against; larger and his crown
       climbs into the magnified brooch hanging above the doors — at 0.52 the top
       of his head lands 20px inside the disc. At 0.46 his crown clears the
       disc's rim by 12px and his legs clear the doors' base rail by 50px, which
       is why the number is 0.46 and not a round one.

   THE PROOF EXHIBIT — three plates, and how each one is composited.
   The remembered things are authored as WHOLE-FRAME plates in two modules, and
   both of those modules are PORTRAIT — the prop's inspection sheet and the fx's
   simile are each about 1.32 as tall as they are wide. Dropped into this stage
   at a small uniform scale a plate's detail clogs into mush; composited
   full-frame it buries the room. So each is drawn at the size its own geometry
   demands and only a declared WINDOW of it lands, blitted 1:1 — the operation
   S01 used for the weapon ledger. Two of the three windows come off ONE cached
   drawing of the prop, so the garment and its magnified device cost a single
   render between them. The cache is 470x620, and both numbers are forced:
   below 466 wide the prop's own level-of-detail switch drops the hound's legs,
   tail and the fawn's dapples and the device stops being the device; below
   ~1.0x the width in height the magnified disc's rim collides with the
   pin-and-sheath elevation drawn under it. 470x620 is the smallest frame that
   clears both and keeps the plate's authored proportions.
     CLOAK   a SHEET, not a cutout — the one place this scene departs from S01's
             method, and it was forced by a rendered frame. Draft 1 keyed the
             garment window into the left wall: ink level 3 wool over a
             plastered wall that halftones to almost exactly the same density,
             and a correct trapezoid with a scalloped hem, five drape folds and
             a doubled under-layer read as an amorphous pale sack. The contour
             was right; the tonal separation did not exist. So the record is
             given a record's ground — PAPER, laid opaquely under the window by
             sheet() — and every level on it then reads exactly as it does on
             the module's own card. The window is chosen to bring the prop's four
             registration brackets with it, so the rectangle articulates as a
             sheet pinned to the wall rather than a hole cut in the room, and the
             plate's `done` channel drives those brackets from 5.0 to 7.0 weight
             on the frame the queen accepts. The plate's verification ledger is
             cropped out: three rows at this cache are 36px tall and each row's
             segmented bar is 4px, which is under the size at which a row
             survives the dot lattice. Nothing in this scene relies on small
             type; the acceptance is carried by the bracket weight, the brooch
             glint, the herald's bow and the queen's own face.
     BROOCH  the magnified callout of the same brooch, hung over the shut great
             doors — keyed, not sheeted, because a lens is not a document and
             because the light face and near-ink hound land hardest against the
             one genuinely dark field in the frame. The window starts just
             inside the disc's left rim, so the plate's own two leader lines
             appear as short pointer stubs leaving the sheet's right edge below
             it and aimed up into the room. They are the same leader the plate
             draws, cut by two windows, and they are kept because the
             description does travel: from a beggar's mouth on one side of the
             hall to a device the queen pinned herself.
     GRIEF   divine-fx.melting-snow-grief, keyed into the right margin, on HER
             side. It is composited as a NORMAL cutout and not with the blend the
             fx declares: multiplied, its snow — level 0, pure paper, the whole
             point of the simile — would come out darker than the wall behind it.
             Keyed, the paper flushes away and only the snowline, the exposed
             ground, the runnels and the two tear-rivers land on the room. The
             cache is 280x369, i.e. the module's own 1.32 portrait ratio: draft
             2 guessed 240x412, and at that aspect headR (which is a fraction of
             HEIGHT) outgrew the width, the veil ran off both edges of its own
             frame, and the head came apart. Two layers are off. `gauge` is the
             stepped snow-depth column, whose cells are 16x13px here — the
             numerals-as-mush failure the brief warns about, and the melt is
             already legible from the height of the snowline itself. `water` is
             the meltwater at the foot of its frame; it would sit on the hall's
             near-right stair and read as a flood in the room instead of a field
             on a figure, and its top edge is a straight rule that would stripe
             the panel. The rivers are carried by the runnels and the falling
             tear-drops. Everything else is in, so the window closes below the
             robe's scalloped hem and no contour is cut by a panel edge.
   The plates are placed by declared window, NOT through the plan, and that is
   deliberate: they are not bodies standing on the floor of the megaron, they
   are callouts hung over the drawing of it, and giving them plan stations would
   assert that the king's cloak is physically in the room — which is the one
   thing that is not true and the whole reason the queen has to be convinced.
   Every FIGURE in the scene, without exception, is resolved through the plan.
   All three are drawn BEFORE the bodies, so wherever a panel and a shoulder
   meet, the body wins.

   THE HERALD. character.eurybates-memory-variant enters through the shut great
   doors at t=26, stands on the spine to be looked at, and goes back out the
   same way at t=50. He is the second identity check and his module was built
   for exactly this scene: three diagnostics — shoulders hauled up round the
   ears, the darkest skin in the Ithacan cast, a woolly crown — baked into
   every pose so the reading survives any angle. Two of the three survive at this
   distance and one does not: the stoop and the woolly crown read, and the dark
   skin does not, because the leaf of the great doors behind him is the darkest
   field in the room and his head and forearms are the closest thing on him to
   its tone. That is why the pose held through the long beat is `eb_profile`, the
   module's own diagnostic view — side-on, the back curved, the shoulders rolled
   forward over a sunken neck, the crown of wool proud of the skull line — which
   is carried by SILHOUETTE and does not need a tonal step to survive. It also
   turns him toward the beggar at pillar_l, which is where the man he served is
   standing. He is blocked as a body because
   he is drawn as one; the fact that he is a memory is carried by where he comes
   from and where he goes, which is a door that never opens. His occupancy is
   reported at `door_main` at the end of the scene: a later scene that wants the
   real Eurybates will find him at the threshold of the hall, and a later scene
   that does not want a remembered herald should drop him, exactly as this one
   dropped nothing.

   WHY NO GUEST CHAIR AND NO SECOND PROP. Od. 19.317 has the chair and the
   footstool, and prop.guest-chair-and-footstool exists; it stays out for the
   reason S02 gave — the rig has no seated pose, so a chair on the station a man
   stands at fuses under his legs. The hall paints its own furniture and the
   seat is implied by the fact that he never moves off the spot.

   Beats (Od. 19.220–307):
     1. He invents the Cretan name Aethon and claims to have hosted Odysseus
        on his way to Troy, wind-bound eleven days off Crete.
     2. He describes the sea-purple doubled cloak, the golden hound-and-fawn
        brooch, the tunic bright as a dried onion skin, and the herald.
     3. Penelope weeps as snow melts on the high peaks, and the rivers fill;
        Odysseus pities her and keeps his eyes hard as horn.
     4. She checks every detail against her own memory — she folded that cloak
        herself, she pinned that brooch — and accepts that he saw her husband.
     5. He swears by Zeus that Odysseus is near, and will be home this month.

   Verify:  node harness/render-scene.mjs scenes/OD-B19-S03.mjs --t 18
            node harness/render-scene.mjs scenes/OD-B19-S03.mjs --t 46
   ============================================================ */
import { placeInstance, keyedModuleCanvas, PAPER } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field     from "../assets/location/megaron-hall.mjs";
import odysseus  from "../assets/character/odysseus-b16.mjs";
import penelope  from "../assets/character/penelope.mjs";
import eurybates from "../assets/character/eurybates-memory-variant.mjs";
import cloak     from "../assets/prop/odysseuss-remembered-cloak-and-brooch.mjs";
import grief     from "../assets/divine_fx/melting-snow-grief.mjs";

/* CONTINUITY IN — the previous scene's computed exit, imported, not asserted. */
import { exitOccupancy as PREV_EXIT } from "./OD-B19-S02.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 62;

/* Nobody is dropped: all four inherited bodies are in this room's plan, and the
   two that are not drawn (melantho behind the women's door, the sixteen pieces
   in the storeroom) are facts of the house that Books XX–XXII need to read off
   the chain. Spread, not retyped, so if S02's blocking ever moves this follows. */
const INITIAL = { ...PREV_EXIT };

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Two rows, both of them the herald's. The speakers have none: the measured gap
   S02 set is the content of this scene and is held for all 62 seconds. */
const MOVES = [
  // the remembered herald walks in up the spine and stands where the gap is
  { who:"eurybates", from:"door_main",  to:"axe_first",  t0:26, t1:31 },
  // and goes back out through the doors he came in by, which never opened
  { who:"eurybates", from:"axe_first",  to:"door_main",  t0:50, t1:56 },
];

/* entrance / exit gates — the two edges of the cast list, in one place */
const EB_IN  = 27;   // the herald is not in the frame before this
const EB_OUT = 55;   // nor after this

/* WHICH SIDE THE ARM GOES. The rig's directional poses all throw the RIGHT arm,
   i.e. to screen right, and the rig ships a `mirror` channel that swaps the limb
   pairs properly — so pointing the other way is one flag, never a hand-drawn
   arm. Penelope's one target is the beggar at pillar_l, which is to HER left,
   so the same three poses are mirrored here as in S02. Odysseus has TWO targets
   on opposite sides: the queen at pillar_r is to his right (unmirrored), and the
   cloak plate in the left margin is to his left, so `pointing_arm` — which he
   uses only to put the audience on the garment — is mirrored, and
   `guarded_withdrawal` is mirrored because it turns the head to screen left. */
const MIRROR_PEN = new Set(["confrontation","palm_up_question","penelope_plea"]);
const MIRROR_ODY = new Set(["guarded_withdrawal","pointing_arm"]);

/* ---- composite helpers. Engine primitives only; no hand-drawn art. -------
   PLATE — blit a WINDOW of a whole-frame plate at 1:1, so the art keeps its own
   scale. cw/ch are given explicitly, which lets two windows of one drawing come
   off ONE cached canvas. Keyed, so the room shows between its lines. */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* SHEET — a plate laid down on its OWN PAPER instead of keyed into the room.
   Draft 1 keyed the cloak record into the left wall and it failed on the plate:
   the mantle's wool is ink level 3 and the hall's plastered wall halftones to
   very nearly the same density, so a perfectly correct trapezoid with a
   scalloped hem and five drape folds read as an amorphous pale sack. The
   contour was there; the tonal separation was not. A record is a DOCUMENT, so
   it gets a document's ground: PAPER is laid opaquely under the window and
   every level on the plate then reads against paper exactly as it does in the
   module's own card. The prop's registration brackets come with the window and
   articulate the four corners, so the rectangle is a sheet pinned to the wall
   and not a hole cut in the room. This is the same operation placeInstance's
   full-bleed branch performs for a set piece, done on a sub-rect. */
function sheet(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  const dx = dst.x0*W, dy = dst.y0*H;
  const dw = (dst.x1 - dst.x0)*W, dh = (dst.y1 - dst.y0)*H;
  offctx.save(); offctx.fillStyle = PAPER; offctx.fillRect(dx, dy, dw, dh); offctx.restore();
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, 0.895);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dx, dy, dw, dh);
}

/* WHERE THE PLATES SIT. Every destination below is 1:1 with its window at the
   declared cache size — no plate is ever scaled, which is why the geometry
   holds. The speakers' ink runs x .25–.43 and x .56–.76, so the two MARGINS —
   x<.24 and x>.76 — are the only regions of this frame that carry neither a
   body nor a load-bearing piece of architecture, and they take the cloak sheet
   and the grief portrait. The magnified brooch is the exception and is placed
   for tone, not for emptiness: it goes over the shut great doors, the one
   genuinely dark field in the room, because a light gold face carrying a
   near-ink hound needs a dark ground and gets nothing from the pale walls.
   Its lower rim clears the herald's crown by 12px. All three panels are drawn
   BEFORE the figures, so wherever a panel and a shoulder meet, the body wins. */
const A_CW = 470, A_CH = 620;                 // the inspection plate cache
const CLOAK_WIN = { x0:0.040, y0:0.145, x1:0.530, y1:0.815 };   // 230 x 415 px
const CLOAK_DST = { x0:0.0180, y0:0.1050, x1:0.2236, y1:0.6516 };
const BR_WIN    = { x0:0.512, y0:0.150, x1:0.975, y1:0.520 };    // 218 x 229 px
const BR_DST    = { x0:0.4000, y0:0.0220, x1:0.5943, y1:0.3238 };
const G_CW = 280, G_CH = 369;                 // the melting-snow portrait cache
const G_WIN     = { x0:0.140, y0:0.055, x1:0.975, y1:0.925 };    // 234 x 321 px
const G_DST     = { x0:0.7750, y0:0.0750, x1:0.9838, y1:0.4974 };

/* the three plates' own gates and channels, off the one clock */
const CLOAK_IN  = 15;   // the cloak is named
const BR_IN     = 21;   // the brooch is named and magnified
const VERIFIED  = 44;   // she has matched all three details
/* the melt: strewn -> thawing -> running -> checked, exactly the fx's own
   state machine, driven by this scene's beats instead of by its free period. */
const GRIEF_IN  = 31;
function meltAt(t){
  if (t <= GRIEF_IN) return 0;
  if (t < 36) return 0.45 * (t - GRIEF_IN) / (36 - GRIEF_IN);
  if (t < 44) return 0.45 + 0.55 * (t - 36) / (44 - 36);
  if (t < 50) return 1 - 0.70 * (t - 44) / (50 - 44);
  return 0.30;
}

export const scene = {
  id:"OD-B19-S03",
  title:"The Stranger Describes Odysseus",
  book:19,
  plan:"megaron",
  duration:D,
  beats:[
    "Odysseus invents the Cretan name Aethon and claims to have hosted Odysseus before Troy.",
    "He describes the king's purple cloak, golden brooch, tunic, and herald Eurybates in exact detail.",
    "Penelope weeps as if melting snow while Odysseus keeps his eyes hard despite inward grief.",
    "She verifies the details and accepts that the stranger truly encountered her husband.",
    "He swears Odysseus is near and will return within the month.",
  ],
  exitState:"Night in the stripped megaron, the fire banked and the great doors shut. The proof has been made and accepted: the sea-purple doubled cloak and the golden hound-and-fawn brooch stand verified on the beggar's side of the hall, the remembered herald Eurybates has been checked and has gone back out through the doors, and the queen's weeping has been mastered — the snow lies again. Odysseus still holds the left-hand roof-pillar as the beggar, unnamed, one arm raised on the oath that Odysseus is near and will be home within this month; Penelope holds the right-hand roof-pillar across the hearth, leaning toward him, believing the stranger and not yet the husband. Melantho is still behind the women's door and the sixteen pieces of armour are still shut in the storeroom off the postern.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"night" },
    { asset:"prop.odysseuss-remembered-cloak-and-brooch", instance:"cloak_01",
      anchor:{x:.11,y:.46}, scale:.18, state:"described" },
    { asset:"prop.odysseuss-remembered-cloak-and-brooch", instance:"brooch_01",
      anchor:{x:.12,y:.78}, scale:.20, state:"brooch" },
    { asset:"divine-fx.melting-snow-grief", instance:"grief_01",
      anchor:{x:.88,y:.68}, scale:.24 },
    { asset:"character.eurybates-memory-variant", instance:"eurybates",
      anchor:{x:.50,y:.62}, scale:.46, band:"threeq", pose:"eb_profile" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.34,y:.69}, scale:.52, band:"threeq", pose:"three_quarter_right" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.66,y:.69}, scale:.52, band:"threeq", pose:"three_quarter_left" },
  ],

  timeline:[
    /* beat 1 — the Cretan lie */
    { op:"actor.pose", target:"odysseus",  at: 0.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"odysseus",  at: 0.0, args:{ gaze:{ x:.34, y:.04 } } },
    { op:"actor.pose", target:"penelope",  at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"penelope",  at: 0.0, args:{ gaze:{ x:-.34, y:.06 } } },
    { op:"actor.pose", target:"odysseus",  at: 4.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",  at: 4.0, args:{ gaze:{ x:.30, y:.02 } } },
    { op:"actor.pose", target:"penelope",  at: 8.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"penelope",  at: 8.0, args:{ gaze:{ x:-.36, y:.04 } } },
    { op:"actor.pose", target:"odysseus",  at:10.0, args:{ pose:"torso_open" } },
    /* beat 2 — the garment, the device, the herald */
    { op:"prop.state", target:"cloak_01",  at:CLOAK_IN, args:{ mode:"described", done:1 } },
    { op:"actor.pose", target:"odysseus",  at:CLOAK_IN, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus",  at:CLOAK_IN, args:{ gaze:{ x:-.40, y:-.16 } } },
    { op:"actor.gaze", target:"penelope",  at:17.0, args:{ gaze:{ x:-.44, y:-.10 } } },
    { op:"prop.state", target:"brooch_01", at:BR_IN,  args:{ mode:"brooch" } },
    { op:"actor.gaze", target:"odysseus",  at:BR_IN,  args:{ gaze:{ x:-.36, y:.22 } } },
    { op:"actor.pose", target:"odysseus",  at:26.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus",  at:26.0, args:{ gaze:{ x:.04, y:-.12 } } },
    { op:"actor.pose", target:"penelope",  at:27.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"penelope",  at:27.0, args:{ gaze:{ x:-.20, y:-.14 } } },
    { op:"actor.pose", target:"eurybates", at:31.0, args:{ pose:"eb_profile" } },
    { op:"actor.gaze", target:"eurybates", at:31.0, args:{ gaze:{ x:-.48, y:0 } } },
    { op:"actor.pose", target:"eurybates", at:36.0, args:{ pose:"eb_attending" } },
    { op:"actor.gaze", target:"eurybates", at:36.0, args:{ gaze:{ x:-.62, y:-.10 } } },
    /* beat 3 — the snow melts, and he holds his face */
    { op:"fx.play",    target:"grief_01",  at:GRIEF_IN, args:{ dir:"thaw" } },
    { op:"actor.pose", target:"penelope",  at:GRIEF_IN, args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope",  at:GRIEF_IN, args:{ gaze:{ x:-.06, y:.44 } } },
    { op:"actor.pose", target:"odysseus",  at:33.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",  at:33.0, args:{ gaze:{ x:.26, y:.10 } } },
    { op:"actor.pose", target:"penelope",  at:38.0, args:{ pose:"penelope_mourn" } },
    /* beat 4 — she checks every detail and accepts */
    { op:"prop.state", target:"cloak_01",  at:VERIFIED, args:{ mode:"verified", done:3 } },
    { op:"actor.pose", target:"eurybates", at:VERIFIED, args:{ pose:"eb_assenting" } },
    { op:"actor.gaze", target:"eurybates", at:VERIFIED, args:{ gaze:{ x:-.04, y:.42 } } },
    { op:"actor.pose", target:"penelope",  at:VERIFIED, args:{ pose:"palm_up_question" } },
    { op:"actor.gaze", target:"penelope",  at:VERIFIED, args:{ gaze:{ x:-.34, y:.08 } } },
    { op:"actor.pose", target:"odysseus",  at:45.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"odysseus",  at:45.0, args:{ gaze:{ x:.32, y:.02 } } },
    { op:"actor.pose", target:"penelope",  at:48.0, args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope",  at:48.0, args:{ gaze:{ x:-.36, y:-.04 } } },
    /* beat 5 — the oath */
    { op:"actor.pose", target:"odysseus",  at:52.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus",  at:52.0, args:{ gaze:{ x:.30, y:-.14 } } },
    { op:"actor.pose", target:"penelope",  at:55.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"penelope",  at:55.0, args:{ gaze:{ x:-.38, y:-.06 } } },
    { op:"timeline.capture", target:"OD-B19-S03", at:60.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);
    const verified = t >= VERIFIED;

    /* 1. THE HALL at night — bare pegs, doors shut, fire banked. It paints the
       room; everything else keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"night", t:0.5,
              progress:Math.min(.94, .18 + .74*(t/D)),
              status:"THE PROOF" },
    });

    /* 2. THE EXHIBIT. Two windows of ONE cached inspection plate, plus the
       simile portrait, all blitted 1:1 and all keyed. Drawn before the bodies
       so a body always wins a shared pixel. */
    if (t >= CLOAK_IN){
      const ps = { mode: verified ? "verified" : "described",
                   done: verified ? 3 : 1, glint: verified, t:0.4,
                   status: verified ? "VERIFIED" : "DESCRIBED",
                   progress: Math.min(.96, t/D) };
      sheet(offctx, W, H, cloak, A_CW, A_CH, CLOAK_WIN, CLOAK_DST, ps,
            "exhibit|" + ps.mode);
      if (t >= BR_IN)
        plate(offctx, W, H, cloak, A_CW, A_CH, BR_WIN, BR_DST, ps,
              "exhibit|" + ps.mode);
    }
    if (t >= GRIEF_IN){
      const m = meltAt(t);
      plate(offctx, W, H, grief, G_CW, G_CH, G_WIN, G_DST,
            { melt:m, t:t*0.5,
              layers:["wind","body","snow","runnels","face","tears"],
              status: m >= .96 ? "RUNNING" : m <= .34 && t > 44 ? "CHECKED" : "THAWING",
              progress: Math.min(.96, t/D) },
            "melt|" + Math.round(m*24));
    }

    /* 3. THE BODIES, ordered back to front by their own blocked depth so the
       far one is never painted over the near one. */
    const draw = {
      eurybates: () => {
        if (t < EB_IN || t >= EB_OUT) return;      // in and out through shut doors
        const p = blk.eurybates;
        const s = st.eurybates || {};
        const shown    = t >= 31 && t < 36;
        const attending= t >= 36 && t < VERIFIED;
        const assenting= t >= VERIFIED;
        const pose = p.moving ? "walk_neutral" : (s.pose || "eb_profile");
        placeInstance(offctx, W, H, eurybates, {
          anchor:{ x:p.x, y:p.y }, scale:0.46 * p.scale,
          state:{
            t: p.moving ? (t*0.40) % 4 : 0.5,
            band:"threeq",
            pose,
            gaze: s.gaze || { x:-.48, y:0 },
            browUp:   assenting ? .28 : attending ? .34 : .14,
            browKnit: assenting ? .18 : .12,
            eyeNarrow:assenting ? .30 : .08,
            smile:    assenting ? .06 : .04,
            status:   assenting ? "THAT WAS THE MAN"
                    : attending ? "AT HIS SHOULDER"
                    : shown     ? "ROUND-SHOULDERED" : "REMEMBERED",
            progress: Math.min(.96, .10 + .80*(t/D)),
          },
        });
      },
      penelope: () => {
        const p = blk.penelope;
        const s = st.penelope || {};
        const listening = t < CLOAK_IN;
        const checking  = t >= CLOAK_IN && t < GRIEF_IN;
        const weeping   = t >= GRIEF_IN && t < VERIFIED;
        const accepting = t >= VERIFIED && t < 52;
        const promised  = t >= 52;
        const pose = s.pose || "three_quarter_left";
        placeInstance(offctx, W, H, penelope, {
          anchor:{ x:p.x, y:p.y }, scale:0.52 * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose,
            mirror: MIRROR_PEN.has(pose),
            gaze: s.gaze || { x:-.34, y:.06 },
            mouth:    weeping ? -1 : accepting ? .46 : promised ? .38 : .20,
            browUp:   weeping ? .64 : accepting ? .58 : promised ? .70 : .30,
            browKnit: weeping ? .52 : checking ? .34 : .18,
            frown:    weeping ? .60 : 0,
            eyeNarrow:checking ? .20 : .08,
            eyeWide:  promised ? .26 : accepting ? .14 : 0,
            jaw:      accepting ? .34 : promised ? .30 : 0,
            status:   promised  ? "THIS MONTH"
                    : accepting ? "I FOLDED IT MYSELF"
                    : weeping   ? "AS THE SNOW MELTS"
                    : checking  ? "THE HOUND AND THE FAWN"
                    : listening ? "WIND-BOUND OFF CRETE" : "LISTENING",
            progress: Math.min(.96, .12 + .80*(t/D)),
          },
        });
      },
      odysseus: () => {
        const p = blk.odysseus;
        const s = st.odysseus || {};
        const lying     = t >= 4 && t < CLOAK_IN;
        const describing= t >= CLOAK_IN && t < 26;
        const naming    = t >= 26 && t < 33;
        const holding   = t >= 33 && t < 45;
        const swearing  = t >= 52;
        const pose = s.pose || "three_quarter_right";
        placeInstance(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale:0.52 * p.scale,
          state:{
            t:0.5, guise:"beggar", band:"threeq",
            pose,
            mirror: MIRROR_ODY.has(pose),
            gaze: s.gaze || { x:.34, y:.04 },
            /* the whole craft of the scene is in this face: the lie is played
               with the crafty asymmetry his card signature is built on, and the
               grief beat takes it AWAY — brows flat, eyes narrowed to nothing,
               no frown at all. Hard as horn is the absence of expression, not
               an expression, so `holding` is where every channel goes quiet. */
            browKnit: holding ? .48 : describing ? .30 : swearing ? .34 : .16,
            eyeNarrow:holding ? .46 : lying ? .30 : swearing ? .22 : .24,
            browUp:   swearing ? .42 : naming ? .26 : .08,
            frown:    0,
            mouthAsym:holding ? 0 : lying ? .62 : describing ? .44 : .20,
            smile:    holding ? 0 : lying ? .16 : t >= 45 && t < 52 ? .12 : 0,
            jaw:      swearing ? .42 : naming ? .24 : 0,
            status:   swearing   ? "WITHIN THE MONTH"
                    : t >= 45    ? "SHE BELIEVES THE STRANGER"
                    : holding    ? "EYES HARD AS HORN"
                    : naming     ? "EURYBATES"
                    : describing ? "SEA-PURPLE, DOUBLED"
                    : lying      ? "I AM AETHON" : "THE BEGGAR",
            progress: Math.min(.96, .16 + .76*(t/D)),
          },
        });
      },
    };
    for (const who of ["eurybates","penelope","odysseus"]
          .filter(w => blk[w]).sort((a,b) => blk[a].d - blk[b].d))
      draw[who]();
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
