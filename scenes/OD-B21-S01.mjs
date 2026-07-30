/* ============================================================
   SCENE  OD-B21-S01 — Penelope Retrieves the Bow          (Od. 21.1–62)
   Book XXI, scene 1 — the first scene of the book. ADDITIVE: adds nothing to
   Books I–XV, modifies no existing module, and casts only assets that already
   exist. Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from
   its Book XVII–XX siblings OD-B17-S03, OD-B18-S01 and OD-B20-S03.

   Beats (causal order, one master clock):
     1. Athena puts it in Penelope's mind to set the contest of the bow — the
        contest that will put the weapon into her husband's hands.
     2. She goes to the locked store, draws the thong off the hook, shoots the
        bolt back, and lifts the bow of Iphitus and its quiver down off the peg.
     3. She stops in the carrying lane between the two arms chests with the
        weapon in her arms and weeps over it before she can carry it out.
     4. She carries it into the hall; two women bring the chest of axe heads
        behind her and set it down on the spine of the floor before the suitors.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. TWO ROOMS, BOTH AUTHORED, NOTHING HAND-PLACED. The scene crosses a
      threshold, so it blocks through TWO plans and never invents a coordinate
      in either:
        · the store — `storeroomPlan`, EXPORTED by assets/location/weapon-
          storeroom.mjs, the same plan that file projects its own fixtures
          from. So `bow_peg` is the peg the case is painted on, `axe_crate` is
          the crate the twelve are painted in, and `aisle_far`/`aisle_near` are
          the bright carrying lane it paints down the spine. No local plan is
          authored here because a better one already exists: authored once, in
          the room that draws itself from it.
        · the hall — scenes/_plans/megaron.mjs, by station name, as every other
          Book XVI+ hall scene does.
      The cut between them is at CUT=54s and it is the only cut in the scene.

   B. THE ROOM IS THE ROOM, NOT A NEW ROOM (brief note D). The atlas asks for
      `location.bow-storeroom` — "locked chamber with key, pegs, weapon case,
      quiver storage, and private grief zone". That is not a new chamber: it is
      `location.weapon-storeroom`, whose own header names this very passage
      (XXI.5–62, "Penelope climbs to it with the crooked key, draws the thong,
      shoots the bolt back, and lifts down the bow of Iphitus and the twelve
      axes"), and whose plan already carries `bow_peg`, `axe_crate` and the two
      arms chests. It is the room on the far side of the hall's postern — the
      megaron paints that opening and puts two steps DOWN through it at station
      `storeroom` — which is exactly how Penelope gets from one half of this
      scene to the other. So this scene casts the arms store with a STATE, and
      no second storeroom is built or cast. Its state moves
      `sealed` (LOCKED, the case shut on its peg) -> `stocked` (STOWED: the
      door ajar, the racks full and the heap of arms father and son carried in
      here in Book XIX, a lamp set down) on the frame the bolt goes back.
      The hall is `location.megaron-hall` in state `feast` — Apollo's feast day,
      the day B20-S03 dressed the room for — minus `racks`, because the spears
      and shields came off those walls in Book XIX and are lying in the store
      this scene opens in. Nothing here builds or casts a second hall.

   C. THE BOW IS DRAWN ONCE. The store paints a bow CASE on the peg (state
      `sealed`/`stocked` draw the case and the peg, never a bow inside it), and
      `prop.odysseuss-bow` is placed only from LIFT=27 onward, in her hands.
      So the case hangs on the wall for the whole scene and the weapon appears
      out of it exactly once: mode `stored` for the two seconds it comes off the
      peg, then `carried` for the rest of the scene. The room's own state is
      never advanced to `open` (which would draw a second, small bow down by
      the chest) or to `raided`/`barred` (Melanthius, Book XXII, lift 1 — two
      ink levels darker and three books early).

   D. THE TWELVE ARE A CROPPED PLATE, NOT A CAST FIGURE (the B20-S03 window
      idiom). `prop.twelve-axe-heads` is an alignment INSTRUMENT: a whole-frame
      study with a seven-segment header, a bore-clearance diagram, a caliper, a
      depth gauge and a twelve-notch ledger. Cast whole into a room it prints as
      a technical plate laid over the floor, and its numerals fall to ~20px and
      dissolve in the dot lattice. So it is blitted through ONE declared window
      — mode `stored`, cropped to the chest itself: the corner-bracketed box,
      the lid thrown back in two short planes, and the twelve heads laid flat in
      two courses of six. That window is the object; the header, the ledger and
      the gauges are cropped out on purpose. The count is carried by the beats
      and by the exit state instead. In the store the twelve are already painted
      by the room (`axe_crate`) — a second set of axes in the same room would be
      a lie about how many there are — so the chest plate exists only once the
      women have it up and are through the door, from CARRY0=57.

   E. THE QUIVER, SAME DEVICE, SMALLER. `prop.quiver-and-arrows` frames itself
      in corner brackets, lays a flight axis across its canvas and prints a
      seven-segment count. Cropped to the quiver body and the standing bundle
      of shafts, it is a slung leather quiver full of arrows and nothing else,
      and it stands against the wall under the bow case until she takes it.
      Its window excludes all four brackets, the flight axis, the staged arrow
      and the count block.

   F. THE TWO WOMEN ARE A CALLED-OUT WINDOW, AND THAT IS AN ASSET FACT, NOT A
      PREFERENCE. Two bodies carrying one chest must not resolve to one station
      (brief note B), and the atlas has no maidservant CHARACTER, so the pair is
      `ensemble.loyal-maids` — the house-woman template, long peplos with an
      overfold, girdle, head-cloth — cast at count 2, formation `file`, torches
      out, with its shell, field, focus mark, sightline and pillar layers
      dropped. ONE instance, so the pair is internal to the asset and there is
      no pair of stations to collide.
      But it cannot be scaled onto this floor, and the reason is in the module:
      `depthScale()` returns member height in ABSOLUTE PIXELS, lerping 76px to
      152px off the woman's own floor line, so a woman is 76–152px tall no
      matter how big the canvas is. Blitted into a box big enough to stand a
      body at z .28 in this hall (~0.35 of frame height, 266px) the women come
      out a third the size of the queen; and blitted into a box small enough for
      them to be the right size, their own ring geometry — a Book XXII
      recognition arc, not a plan — floats their feet 0.38 of the box above the
      mark, which the first hall render showed exactly. Inventing an offset to
      correct that is what this discipline forbids.
      So they are shown the way B20-S03 shows the droves and B19-S01 the arms:
      ONE detail window, 1:1, in the upper left where `racks` is dropped and
      there is bare wall — which is the ONE size at which this asset is right,
      its own. They are still BLOCKED through the megaron plan by name, because
      occupancy is state rather than a drawing: they come in behind the queen,
      go to the spine at `axe_first` — where Telemachus digs the trench in S02,
      so the chest lands at the head of the line it will fill — and stand off at
      `doorway_maid`, out of the lane, which is what `exitOccupancy` hands S02.
      The CHEST is only drawn once it is down (SETDOWN=69): a chest gliding
      across the floor with nobody's hands on it is worse than a chest that
      arrives between two shots.

   G. THE SUITORS ARE A KEYED CROWD CUTOUT, NOT A FIELD (the B18-S01 device).
      `ensemble.the-suitors` floods its canvas with a back wall and a floor
      before it draws a body; both layers are dropped, together with its own
      two tables — the megaron's `furniture` layer already lays the feast tables
      this room eats at — and its ignored-stranger figure, which is a baked
      character and belongs to Book I. ITS FRONT ROW IS DROPPED TOO, and that is
      the correction this scene needed most: the asset draws that row at s=1.0
      on a baseline 0.86 of its box, and cast across the near floor it printed
      as a near-solid black band over the whole bottom third of the frame with
      heads the size of the hearth. What is left is the DEEP row only, five men
      at 0.60 of their own size, keyed at 0.85 (the ensemble's lightest plane is
      lum .858, above placeInstance's own 0.895 threshold, so the default key
      would leave an opaque panel standing over the room), on a box solved so
      that row sits on the far benches at y≈.774 — the ground the megaron paints
      those benches on. Their attention is on the clock: carousing, then the
      reaction wave as the queen appears with the bow, then hushed as the chest
      goes down.

   H. ROUTES CHECKED ACROSS TIME, NOT ASSUMED.
        · IN THE STORE only one body ever stands, so nothing can converge. Her
          route door -> aisle_far -> bow_peg -> aisle_near -> door never crosses
          a painted fixture at rest: the three aisle stations are the carrying
          lane the room draws clear and bright, and `bow_peg` at z .18 is the
          bare wall UNDER the case — above the right-hand rack, which runs
          z .24–.70 and so lies entirely below her feet there (note I).
        · IN THE HALL the queen takes `pillar_l` (Od. 21.64: she stands by the
          pillar of the roof), which is a short walk up the left wall from the
          postern steps and never reaches the hearth ring (plan x .395–.605,
          z .445–.595): her route stops at z=.44. The women take the spine at
          `axe_first` (x .50, z .28) and then `doorway_maid` (x .94, z .40).
          Measured through project(), those three marks are (.338,.689),
          (.500,.616) and (.787,.671) — no two of them within 0.16 of frame
          width, and no route crosses another body's resting mark. ONE BODY ON
          THE SPINE AT A TIME: the queen is never on it, and `threshold` and
          `door_main` stay empty for the whole scene.

   I. WHY SHE DOES NOT SIT DOWN. Homer sits her on the arms chest with the bow
      across her knees, and the first draft did exactly that — on `chest_r`,
      with the seat lifted onto the lid by the room's own 0.090 unit-heights of
      chest. It failed twice, and both failures are properties of the assets
      rather than opinions:
        · the store's right third is a rack of six stacked spears with two hung
          shield discs, running z .24–.70, and a body seated on the near right
          chest keys straight into that lattice and loses its silhouette
          completely — 400px of queen with no edge anywhere in it;
        · character.penelope lays her skirt, hair drape and veil out at FIXED
          fractions of its own box (drawSkirt / drawHairDrape: ±0.150W of drape,
          a hem at 0.185W) instead of off the rig's joints, so a seated or
          kneeling pose slides the body out from under its own clothes. That
          module is authored upright and only upright.
      So the weeping is staged upright on `aisle_near`, in the bright carrying
      lane between the two arms chests, with the bow low in her arms. The
      station is the room's own; no coordinate is invented; and she reads as one
      figure on light stone with the open door behind her.
      THE CAMERA IS INSIDE THE STORE for the whole first half, which is why the
      locked door is a FAR-WALL event: we are shut in with the bow, and she is
      on the other side of it until the bolt goes back.

   J. TONE AND TYPE. Both rooms are placed in their light states (lift 0); the
      dark states of the arms store (`raided`, `barred`) and of the hall
      (`night`, `battle`, `aftermath`) are Book XXII's and are never touched
      here. No hand-drawn ctx overpaint is added to any figure — every mark on
      the queen is the shared rig plus her own module's veil, hair and skirt.
      Every numeral in the three prop plates is cropped out of frame; nothing
      in this scene depends on type under 33px.

   CONTINUITY IN — first scene of Book XXI, so nothing is inherited. Opening
   positions are declared from the plans by name: the queen outside the locked
   store door (`door`), the two women and the chest still in the passage on the
   hall side (`storeroom`). The suitors are already in the hall, which is where
   OD-B20-S03 and its siblings left them.

   CONTINUITY OUT — computed from the megaron plan, never written:
   { penelope:"pillar_l", maids:"doorway_maid", axes:"axe_first" }.

   Verify (the store, the weeping, the hall):
     node harness/render-scene.mjs scenes/OD-B21-S01.mjs --t 12
     node harness/render-scene.mjs scenes/OD-B21-S01.mjs --t 42
     node harness/render-scene.mjs scenes/OD-B21-S01.mjs --t 72
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, clamp01, lerp, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import store, { storeroomPlan } from "../assets/location/weapon-storeroom.mjs";
import hall      from "../assets/location/megaron-hall.mjs";
import penelope  from "../assets/character/penelope.mjs";
import bow       from "../assets/prop/odysseuss-bow.mjs";
import quiver    from "../assets/prop/quiver-and-arrows.mjs";
import axes      from "../assets/prop/twelve-axe-heads.mjs";
import maids     from "../assets/ensemble/loyal-maids.mjs";
import suitors   from "../assets/ensemble/the-suitors.mjs";

const STORE_ASSET = "location.weapon-storeroom";
const HALL_ASSET  = "location.megaron-hall";
const D = 78;

/* ---- THE CLOCK ---------------------------------------------------------- */
const IMPULSE = 4;    // Athena puts the contest in her mind, at the locked door
const UNLOCK  = 10;   // the thong off the hook, the bolt shot back
const ENTER0  = 11, ENTER1 = 17;   // down the three steps into the store
const CROSS0  = 19, CROSS1 = 25;   // along the racks to the peg
const LIFT    = 27;   // the bow of Iphitus comes down off its peg
const TAKEQ   = 29;   // and the quiver with it
const SIT0    = 31, SIT1 = 37;     // to the near arms chest
const WEEP    = 39;   // the bow across her knees; she weeps over it
const LOAD    = 44;   // the two women lift the chest of axe heads
const RISE    = 46;   // she stands, and carries it out
const OUT0    = 46, OUT1 = 52;
const CUT     = 54;   // >>> the megaron
const HALLIN0 = 54, HALLIN1 = 64;  // up the postern steps to the roof-pillar
const CARRY0  = 57, CARRY1 = 68;   // the women behind her, down to the spine
const SETDOWN = 69;   // the chest goes down on the floor before the suitors
const STEPOFF0= 70, STEPOFF1 = 75; // and they stand off, out of the lane
const CHALLENGE = 70; // she names the contest

/* the arms store, minus nothing: the racks are FULL in Book XXI, because that
   is where Book XIX put them, and the heap of carried-in arms is the reason the
   room reads as a store rather than a cellar. */
const STORE_LAYERS = ["shell","ceiling","farwall","door","steps","racks",
                      "loophole","stores","aisle","foreground"];
/* the hall, minus the arms that were carried out in Book XIX (note B). */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","postern","maidsdoor",
                     "stair","pillars","lane","hearth","furniture","litter","throne"];

/* ---- CONTINUITY IN: declared from the plans, by name (first scene) ------- */
const STORE_INITIAL = { penelope:"door" };
const HALL_INITIAL  = { penelope:"storeroom", maids:"storeroom", axes:"storeroom" };

/* ---- BLOCKING. Stations, not coordinates (notes A, H). ------------------- */
const STORE_MOVES = [
  { who:"penelope", from:"door",      to:"aisle_far",  t0:ENTER0, t1:ENTER1 },
  { who:"penelope", from:"aisle_far", to:"bow_peg",    t0:CROSS0, t1:CROSS1 },
  { who:"penelope", from:"bow_peg",   to:"aisle_near", t0:SIT0,   t1:SIT1   },
  { who:"penelope", from:"aisle_near",to:"door",       t0:OUT0,   t1:OUT1   },
];
const HALL_MOVES = [
  { who:"penelope", from:"storeroom",  to:"pillar_l",     t0:HALLIN0, t1:HALLIN1 },
  // the two women, one instance, behind her and out onto the spine
  { who:"maids",    from:"storeroom",  to:"axe_first",    t0:CARRY0,  t1:CARRY1 },
  { who:"maids",    from:"axe_first",  to:"doorway_maid", t0:STEPOFF0,t1:STEPOFF1 },
  // the chest itself is blocked like anything else, as a PROP
  { who:"axes",     from:"storeroom",  to:"axe_first",    t0:CARRY0,  t1:CARRY1,
    kind:"prop" },
];

/* ---- THE BOX A BODY IS DRAWN IN -----------------------------------------
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide). engine/figure-hero.mjs caps the skeleton at min(H*0.9, W*1.26) so the
   body height survives a wide box, but every width-relative decoration
   stretches with W — and character.penelope lays her hair drape, her skirt and
   her veil out in box-W fractions (±0.150W of drape, a skirt hem at 0.185W).
   In a landscape box the queen renders as a wide bell with a veil off her
   shoulder. Every figure here is therefore drawn into the PORTRAIT box the
   atlas uses for characters, 660/880, and blitted.
   FIG_FLOOR is the rig's own floor line: figure-hero plants the ankles at
   H*0.90 of its box, so anchoring the box by its bottom edge would hang the
   body a tenth of its height above the mark the plan gave it. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
/* ONE height for the queen per room, times that plan's own depth falloff. The
   two numbers are the two rooms' own proportions, not a nudge: megaron-hall is
   built with roofRise 0.30 / roofRake 0.26 and weapon-storeroom with 0.21 /
   0.30 — "a cellar off the hall, not a hall", in its own words. A woman
   standing in a low cellar is a larger fraction of it than the same woman in
   the great hall, and at the hall's 0.50 she read as a doll in the store. */
const K_HALL  = 0.50;
const K_STORE = 0.60;

/* blit a module into a box of a chosen aspect, anchored by a point INSIDE the
   box. `fx`/`fy` say where in the box the anchor lands (0..1). `sig` is
   required: keyedModuleCanvas caches on pose/band/t only, so without it a
   change of gaze or brow returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* PLATE — blit one declared WINDOW of a whole-frame drawing, keyed, so the room
   shows between its lines and the plate's frame furniture, headers and numerals
   stay out of frame (notes D, E). `cw`/`ch` is the canvas the drawing is made
   on; `dst` is where the window lands, in frame fractions. */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* place a windowed plate by its FOOT MARK — the middle of its bottom edge — so
   a prop stands on the ground the plan gave it instead of on a hand anchor. */
function propAt(offctx, W, H, mod, { x, y, wFrac, hFrac, cw, ch, win, state, sig }){
  plate(offctx, W, H, mod, cw, ch, win,
        { x0: x - wFrac / 2, y0: y - hFrac, x1: x + wFrac / 2, y1: y },
        state, sig);
}

/* ---- THE CHEST OF AXE HEADS: mode `stored`, cropped to the chest ---------
   rowGeo(): the row band is x .050..912 with pitch (x1-x0)/12, and chest()
   insets by 0.30 pitch a side and runs from geo.y - u*0.46 down to
   geo.yG + u*0.22 with u = 0.088H — i.e. x .071..890, y .571..725. The window
   below is that box plus a 2% margin, and nothing else. */
const AXE_CW = 389, AXE_CH = 638;
const AXE_WIN = { x0:.050, y0:.545, x1:.912, y1:.752 };

/* ---- THE QUIVER: mode `carry`, cropped to the quiver and its bundle -------
   The asset frames itself with corner brackets at design px (40,40)-(102,96)
   and their three mirrors on a 660x880 grid — x .061..155, y .045..109 and
   y .891..955 — and prints a flight axis, a staged arrow and a count block on
   the right half. The window starts OUTBOARD of the left brackets at x .158,
   stops before the staged arrow at x .535, and ends above the ground register
   dashes at y .910. */
const QIV_CW = 260, QIV_CH = 347;
const QIV_WIN = { x0:.158, y0:.040, x1:.535, y1:.910 };

/* ---- THE BOW ------------------------------------------------------------
   Measured off renders/prop__odysseuss-bow__carried.png (1320x1750): in mode
   `carried` the bow lies on the diagonal of its box, ink from (.06,.10) to
   (.79,.72), so its tip-to-tip length is 0.83 of the box HEIGHT, and the grip
   block — the ivory plate with the carry strap over it — sits at (.667,.566).
   A figure's body is 0.78 of its own box height (the rig caps at W*1.26 and
   FIG_AR is 0.75). The bow is 1550mm against a queen of about 1650mm, so
   0.83*boxH_bow = 0.94*0.78*boxH_fig -> boxH_bow = 0.88*boxH_fig. BOW_H is a
   little under that, at 0.80, because the crescent reads longer than it
   measures and at 0.88 it took the frame off her. */
const BOW_AR   = FIG_AR;
const BOW_H    = 0.78;
const BOW_GRIP = { x:0.667, y:0.566 };

/* ---- THE CROWD (note G) -------------------------------------------------- */
/* THE BOX, MEASURED, AND WHY THE FRONT ROW IS GONE. ensemble.the-suitors draws
   its background row at s=0.60 on a baseline 0.58 of its box and its foreground
   row at s=1.0 on a baseline 0.86. Cast at s=1.0 across the near floor the front
   row printed as a near-solid black band over the whole bottom third of the
   frame with heads the size of the hearth — the exact failure the brief warns
   about. So `fgrow` is DROPPED with the tables and the back wall, and what is
   left is the deep row only, thinned by depth to 0.60 of its own size: five
   young men on the far benches, seated on the ground the megaron paints them
   on. Solving for the box: the row runs x .30w..86w and sits at .58h, so
   putting it on bench_l1/bench_r1 (projected x .25..75, y .774) gives
   w = .893, x0 = -.018 and a bottom edge at .774 + .42h. */
const CROWD = { at:{ x:.4285, y:.883 }, w:.893, h:.26 };
const CROWD_LAYERS = ["bgrow"];
const CROWD_ROW = [1, 5];      // perRow[1] is the deep row: five on the benches
function placeCrowd(offctx, W, H, state){
  const w = W * CROWD.w, h = H * CROWD.h;
  const sig = `sui|${Math.round((state.attention ?? 0) * 20)}`
            + `|${Math.round((state.wave ?? 0) * 20)}`
            + `|${Math.round((state.density ?? 1) * 20)}`;
  offctx.drawImage(keyedModuleCanvas(suitors, w, h, state, sig, 0.85),
                   CROWD.at.x * W - w / 2, CROWD.at.y * H - h);
}
const crowdAt = t =>
    t < HALLIN1 - 4 ? { attention:0.10, wave:0.00, density:1.0, perRow:CROWD_ROW, layers:CROWD_LAYERS,
                        status:"CAROUSING", progress:.22 }
  : t < SETDOWN     ? { attention:0.35, wave:clamp01((t - (HALLIN1 - 4)) / 8),
                        density:1.0, perRow:CROWD_ROW, layers:CROWD_LAYERS,
                        status:"THE QUEEN, ARMED", progress:.52 }
  :                   { attention:1.00, wave:1.00, density:1.0, perRow:CROWD_ROW,
                        layers:CROWD_LAYERS, status:"HUSHED", progress:.80 };

/* ---- THE TWO WOMEN, AS ONE WINDOW (note F) ------------------------------
   MAID_CW/CH is the canvas the ensemble is drawn on and MAID_DST is 1:1 with the
   declared window on it: 234 x 168px, so the women print at the 76-152px the
   module gives them and are neither upscaled nor shrunk. The window is the AISLE
   half of the canvas — `formation:"file"` starts every woman at ENTRY (x .112,
   y .498) and walks her up an aisle toward the ring, so the file is spread
   across that half. The crop was closed down onto the two of them over two
   passes: too tight caught one woman, too loose left a bright empty panel
   pulling the eye off the queen. The ring, the focus mark and the empty
   stations stay out of frame. It sits in the upper RIGHT on bare wall and roof
   plane: clear of the card's label band, of the postern opening (top-left
   (.241,.376)) and of the stair at `stair_up` (y .746), so it covers no door,
   no figure and no plot geometry. */
const MAID_LAYERS = ["band-mid","band-front"];
const MAID_CW = 520, MAID_CH = 700;
const MAID_WIN = { x0:.140, y0:.560, x1:.590, y1:.800 };
const MAID_DST = { x0:.740, y0:.062, x1:.949, y1:.283 };
function maidState(t){
  return {
    formation:"file", count:2, density:1.0, approach:0.52, lag:0.20,
    attention:0.55, wave:0.0, waveSpread:0.0, weeping:0.0, torches:0,
    spread:0.55, radius:1.0, layers:MAID_LAYERS,
    showShell:false, showField:false, showFocus:false, t:0.5,
    status: t < SETDOWN ? "THE CHEST" : "STOOD OFF",
    progress: clamp01(0.20 + 0.72 * (t / D)),
  };
}
/* A DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses. Keyed straight onto the room, the roof
   plane's rafters and tie beams run through the women and they stop reading as
   bodies. (Verbatim device from OD-B20-S03.) */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

/* (note I) THE WEEPING IS IN THE LANE, NOT ON A CHEST. The first render put
   her down on `chest_r`, and it failed for a reason worth writing down: the
   store's right third is a rack of six stacked spears and two hung shield
   discs from z .24 to .70, and a body seated on the near right chest keys
   straight into that lattice and disappears — 400px of queen with no silhouette
   anywhere in it. The clear ground in this room is the CARRYING AISLE the room
   paints bright down the spine, so she goes down on `aisle_near`, between the
   two arms chests, with the bow across her knees. The station is the room's
   own, no coordinate is invented, and she reads as one dark figure on light
   stone with the shut door behind her. */

export const scene = {
  id:"OD-B21-S01",
  title:"Penelope Retrieves the Bow",
  book:21,
  plan:"weapon-storeroom -> megaron",
  duration:D,
  beats:[
    "Athena puts it in Penelope's mind to set the contest of the bow before the suitors.",
    "She unlocks the arms store, draws the bolt, and lifts the bow of Iphitus and its quiver down off the peg.",
    "She stops in the carrying lane between the two arms chests and weeps over the weapon in her arms.",
    "Two women bring the chest of axe heads in behind her and set it down before the suitors.",
  ],
  exitState:
    "Afternoon of Apollo's feast day, in the megaron. The contest is set. " +
    "Penelope stands at the left-hand roof-pillar (`pillar_l`) with the great " +
    "back-bent bow of Iphitus in her hands and its quiver of twelve arrows " +
    "with it — the first time the weapon has been out of the locked arms store " +
    "in twenty years — and she has just named the terms: the man who strings " +
    "it and shoots through the axes takes her. The chest of twelve axe heads " +
    "is on the floor on the spine of the hall at `axe_first`, lid thrown back, " +
    "the heads lying flat in two courses of six, set down at the head of the " +
    "line the trench will fill; the two women who carried it in have stood off " +
    "at the mouth of the women's door (`doorway_maid`), out of the lane. The " +
    "suitors are hushed on the benches and at the tables, all attention on the " +
    "bow. The arms store is left OPEN behind her, with the empty bow case " +
    "hanging on its peg, the racks still full of the spears and shields that " +
    "came out of this hall in Book XIX, and a lamp burning on the stand — " +
    "which is the door Melanthius gets through in Book XXII. Nothing is dug " +
    "yet: no trench, no helves, no axes planted. S02 opens from exactly this " +
    "state, with Telemachus taking the spade to the spine of this floor.",
  exitOccupancy:occupancyAt(megaron, HALL_MOVES, D, HALL_INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    penelope:"entrance:store-door (`door`, at the head of the three steps) — " +
             "then entrance:postern into the hall (`storeroom`)",
    maids:"entrance:postern (`storeroom`), behind the queen, from CARRY0=57",
    axes:"carried in — `storeroom` -> `axe_first`",
    suitors:"already in the hall since B20-S03; never blocked, a crowd cutout",
  },
  exits:{
    penelope:"none — she holds `pillar_l` into S02",
    maids:"they stand off at `doorway_maid` and hold it into S02",
    axes:"set down at `axe_first` and stays there",
    bow:"none — it does not leave her hands again in this book until XXI.281",
  },
  walkable:"IN THE STORE: the carrying aisle (`aisle_far`/`aisle_mid`/" +
           "`aisle_near`), the clear wall under the case (`bow_peg`), and the " +
           "lids of the two arms chests, which are sat on, not walked over. " +
           "The racks, the crate of axes and the heap are NOT walkable. " +
           "IN THE HALL: the megaron's walkable band, minus the hearth ring " +
           "(plan x .395–.605, z .445–.595) and minus the bench and table " +
           "stations, which paint furniture through a standing body.",
  depthOrder:"one queue per room, sorted by the plan's own z. Store: the room, " +
             "then the queen (z .12 -> .18 -> .86), then whatever she carries, " +
             "painted after her because it is in front of her body. Hall: the " +
             "room, then the chest (z .28), then the women (z .28 -> .40), " +
             "then the queen (z .44), then the crowd cutout, which is the " +
             "nearest thing in the frame and is drawn last.",
  gazeTargets:{
    penelope:"the locked door, then the bolt under her hands, then up to the " +
             "case on the peg, then DOWN onto the bow across her knees for the " +
             "whole of the weeping, then level at the suitors",
    maids:"the chest between them, then the floor they are setting it on, then " +
          "the queen",
    suitors:"each other and their cups, then the wave turns them one after " +
            "another onto the bow, then all of them onto it",
  },
  attachments:[
    { at:UNLOCK,  who:"penelope", change:"the crooked key and the thong leave " +
      "her hands; the door state goes sealed -> stocked" },
    { at:LIFT,    who:"penelope", change:"prop.odysseuss-bow attaches at her " +
      "grip, mode `stored` (still in the shape the case held it)" },
    { at:LIFT + 2,who:"bow",      change:"mode stored -> carried; the coiled " +
      "string and the carry strap take the weight" },
    { at:TAKEQ,   who:"penelope", change:"prop.quiver-and-arrows leaves the " +
      "wall and rides with her, mode `carry`, twelve counted" },
    { at:WEEP,    who:"bow",      change:"low in both arms, over the lane, while she weeps" },
    { at:LOAD,    who:"maids",    change:"the crate at `axe_crate` is emptied " +
      "into the chest and the pair take it up — off frame, because the room " +
      "paints that crate and a second set of axes in it would be a lie about " +
      "the count" },
    { at:CARRY0,  who:"axes",      change:"prop.twelve-axe-heads enters the " +
      "frame with them, mode `stored`, lid thrown back" },
    { at:SETDOWN, who:"maids",    change:"the chest detaches onto the floor at " +
      "`axe_first`; both women let go" },
  ],
  sound:[
    { at:IMPULSE,  source:"door",       cue:"nothing at all — the thought arrives in silence" },
    { at:UNLOCK,   source:"door",       cue:"the thong off the hook, then the bolt: one hard slide of oiled bronze" },
    { at:ENTER0+1, source:"step_foot",  cue:"three steps down, and the door leaves swinging in like a bull bellowing in a meadow" },
    { at:CROSS0,   source:"rack_r",     cue:"her hem along a rack of stacked spears" },
    { at:LIFT,     source:"bow_peg",    cue:"a leather case coming off a wooden peg" },
    { at:WEEP,     source:"aisle_near", cue:"the queen weeping over her husband's bow, alone, with the door open behind her" },
    { at:LOAD,     source:"axe_crate",  cue:"iron on iron — twelve heads shifting as the chest comes up" },
    { at:CUT,      source:"storeroom",  cue:"the noise of the hall coming up the passage" },
    { at:HALLIN1,  source:"pillar_l",   cue:"the hall going quiet in patches as they see what she is carrying" },
    { at:SETDOWN,  source:"axe_first",  cue:"the chest set down on stone; the heads settle" },
    { at:CHALLENGE,source:"pillar_l",   cue:"the terms, named once, in a level voice" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from a plan or a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:STORE_ASSET, instance:"store_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"stocked" },
    { asset:HALL_ASSET, instance:"hall_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"ensemble.the-suitors", instance:"suitors_01",
      anchor:{x:.50,y:.945}, scale:.92, blend:"multiply" },
    { asset:"prop.twelve-axe-heads", instance:"axes_01",
      anchor:{x:.50,y:.62}, scale:.22, state:"stored" },
    { asset:"ensemble.loyal-maids", instance:"maids_01",
      anchor:{x:.50,y:.62}, scale:.30 },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.50,y:.69}, scale:.44, band:"threeq", pose:"neutral" },
    { asset:"prop.odysseuss-bow", instance:"bow_01",
      anchor:{x:.52,y:.62}, scale:.44, state:"carried" },
    { asset:"prop.quiver-and-arrows", instance:"quiver_01",
      anchor:{x:.58,y:.66}, scale:.14, state:"carry" },
  ],

  timeline:[
    { op:"actor.pose",  target:"penelope",   at:0.0,        args:{ pose:"neutral" } },
    { op:"actor.gaze",  target:"penelope",   at:0.0,        args:{ gaze:{ x:.06, y:-.08 } } },
    // 1. the thought
    { op:"actor.pose",  target:"penelope",   at:IMPULSE,    args:{ pose:"head_lowered" } },
    { op:"actor.gaze",  target:"penelope",   at:IMPULSE,    args:{ gaze:{ x:-.10, y:.26 } } },
    // 2. the thong, the bolt, the store
    { op:"actor.pose",  target:"penelope",   at:UNLOCK,     args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"penelope",   at:UNLOCK,     args:{ gaze:{ x:.10, y:.34 } } },
    { op:"set.state",   target:"store_01",   at:UNLOCK,     args:{ state:"stocked" } },
    { op:"actor.pose",  target:"penelope",   at:ENTER1,     args:{ pose:"profile_left" } },
    { op:"actor.gaze",  target:"penelope",   at:ENTER1,     args:{ gaze:{ x:.34, y:-.10 } } },
    { op:"actor.pose",  target:"penelope",   at:CROSS1,     args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"penelope",   at:CROSS1,     args:{ gaze:{ x:.30, y:-.30 } } },
    { op:"prop.state",  target:"bow_01",     at:LIFT,       args:{ mode:"stored" } },
    { op:"prop.state",  target:"bow_01",     at:LIFT + 2,   args:{ mode:"carried" } },
    { op:"prop.state",  target:"quiver_01",  at:TAKEQ,      args:{ mode:"carry" } },
    // 3. the chest, the knees, the weeping
    { op:"actor.pose",  target:"penelope",   at:SIT1,       args:{ pose:"penelope_grief" } },
    { op:"actor.gaze",  target:"penelope",   at:SIT1,       args:{ gaze:{ x:.04, y:.44 } } },
    { op:"actor.pose",  target:"penelope",   at:WEEP,       args:{ pose:"penelope_mourn" } },
    { op:"actor.gaze",  target:"penelope",   at:WEEP,       args:{ gaze:{ x:.02, y:.52 } } },
    { op:"prop.state",  target:"axes_01",    at:LOAD,       args:{ mode:"stored" } },
    // 4. out, and into the hall
    { op:"actor.pose",  target:"penelope",   at:RISE,       args:{ pose:"profile_left" } },
    { op:"actor.gaze",  target:"penelope",   at:RISE,       args:{ gaze:{ x:-.30, y:.14 } } },
    { op:"crowd.state", target:"suitors_01", at:CUT,        args:{ status:"CAROUSING" } },
    { op:"actor.pose",  target:"penelope",   at:HALLIN1,    args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"penelope",   at:HALLIN1,    args:{ gaze:{ x:.30, y:.10 } } },
    { op:"crowd.state", target:"suitors_01", at:HALLIN1 - 4,args:{ status:"THE QUEEN, ARMED" } },
    { op:"actor.pose",  target:"penelope",   at:CHALLENGE,  args:{ pose:"penelope_plea" } },
    { op:"actor.gaze",  target:"penelope",   at:CHALLENGE,  args:{ gaze:{ x:.26, y:.04 } } },
    { op:"crowd.state", target:"suitors_01", at:SETDOWN,    args:{ status:"HUSHED" } },
    { op:"timeline.capture", target:"OD-B21-S01", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st      = stateAt(scene, t);
    const inHall  = t >= CUT;
    const blk     = inHall ? blockingAt(megaron, HALL_MOVES, t, HALL_INITIAL)
                           : blockingAt(storeroomPlan, STORE_MOVES, t, STORE_INITIAL);
    const breath  = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const p       = blk.penelope;
    const seated  = !inHall && t >= SIT1 && t < RISE;
    const carrying= t >= LIFT;
    const hasQuiv = t >= TAKEQ;

    /* --- 1. THE ROOM. One field at a time; it paints the world and everything
       else keys onto it. Both are placed the way every Book XVI+ scene places a
       field — anchor (.50,.99), scale 1.0 — so this hall registers on B18–B20's
       hall and this store on B19-S01's store. --------------------------------- */
    if (inHall){
      placeInstance(offctx, W, H, hall, {
        anchor:{ x:.50, y:.99 }, scale:1.0,
        state:{ state:"feast", t:breath, layers:HALL_LAYERS,
                status: t >= SETDOWN ? "THE CONTEST IS SET" : "APOLLO'S FEAST DAY",
                progress: clamp01(0.12 + 0.82 * (t / D)) },
      });
    } else {
      placeInstance(offctx, W, H, store, {
        anchor:{ x:.50, y:.99 }, scale:1.0,
        state:{ state: t >= UNLOCK ? "stocked" : "sealed", t:breath,
                layers:STORE_LAYERS,
                status: t >= UNLOCK ? "UNBOLTED" : "LOCKED",
                progress: clamp01(0.10 + 0.84 * (t / D)) },
      });
    }

    /* --- 2. THE CHEST OF AXE HEADS. Blocked as a prop, blitted through one
       declared window (note D). In the STORE the room already paints the twelve
       helve-up in their crate at `axe_crate`, so the chest plate would be a
       second set of axes in the same room: it exists only once the women have it
       up and are carrying it through the door. ------------------------------- */
    if (inHall && t >= SETDOWN){
      const a = blk.axes;
      const wF = 0.285 * (a.scale / 0.75);
      const hF = wF * (W / H) * ((AXE_WIN.y1 - AXE_WIN.y0) * AXE_CH)
                              / ((AXE_WIN.x1 - AXE_WIN.x0) * AXE_CW);
      propAt(offctx, W, H, axes, {
        x:a.x, y:a.y, wFrac:wF, hFrac:hF,
        cw:AXE_CW, ch:AXE_CH, win:AXE_WIN,
        state:{ mode:"stored", t:0.5, status:"TWELVE", progress:.34 },
        sig:"chest|stored",
      });
    }

    /* --- 3. THE TWO WOMEN, called out at their own scale (note F). --------- */
    if (inHall && t >= CARRY0 && t <= STEPOFF1 + 2){
      detailField(offctx, W, H, MAID_DST);
      plate(offctx, W, H, maids, MAID_CW, MAID_CH, MAID_WIN, MAID_DST,
            maidState(t), `maids|${t < SETDOWN ? "c" : "s"}`, 0.85);
    }

    /* --- 4. THE QUEEN. One body across both rooms; the guise channel is not
       hers, so nothing about her is switched at the cut — only her station. -- */
    {
      const s = st.penelope || {};
      const y = p.y;
      const grieving = seated;
      const naming   = inHall && t >= CHALLENGE;
      const scale    = (inHall ? K_HALL : K_STORE) * p.scale;
      const pose = p.moving ? "walk_neutral"
                 : seated   ? (t >= WEEP ? "penelope_mourn" : "penelope_grief")
                 : (s.pose || "neutral");
      const gaze = s.gaze || { x:.06, y:.10 };
      place(offctx, W, H, penelope, {
        x:p.x, y, hFrac:scale, ar:FIG_AR, fx:0.5, fy:FIG_FLOOR, pad:FIG_PAD,
        state:{
          t: p.moving ? (t * 0.40) % 4 : breath,
          band:"threeq", pose, gaze,
          mouth: naming ? .55 : grieving ? -1 : 0,
          browUp:   grieving ? .70 : naming ? .40 : t >= IMPULSE && t < UNLOCK ? .48 : .30,
          browKnit: grieving ? .48 : naming ? .34 : .22,
          frown:    grieving ? .56 : 0,
          eyeNarrow:grieving ? .22 : t >= UNLOCK && t < ENTER1 ? .30 : .08,
          jaw:      naming ? .42 : 0,
          status: naming        ? "THE TERMS"
                : inHall        ? "OUT OF THE STORE"
                : t >= RISE     ? "SHE CARRIES IT IN"
                : t >= WEEP     ? "WEEPING OVER IT"
                : seated        ? "ACROSS HER KNEES"
                : t >= LIFT     ? "THE BOW OF IPHITUS"
                : t >= UNLOCK   ? "THE BOLT BACK"
                : t >= IMPULSE  ? "THE THOUGHT"
                :                 "THE LOCKED DOOR",
          progress: clamp01(0.10 + 0.84 * (t / D)),
        },
        sig:`pen|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
           + `|${grieving?1:0}|${naming?1:0}`,
      });

      /* --- 5. WHAT SHE CARRIES. Both are keyed to her live blocked box, so a
         weapon in her hands cannot drift off them across the cut (note C). -- */
      const bodyH = scale * 0.78;                          // W*1.26 of the box
      if (carrying){
        const mode = t < LIFT + 2 ? "stored" : "carried";
        /* WHICH HAND, AND WHY. Both of the bow's modes are wide crescents about
           as long as she is tall, so wherever the grip goes the weapon crosses
           her body — as it does in life. The grip is therefore put in her FAR
           hand, a QUARTER of her own body height outboard of her spine on the
           screen-left side — which is her own half-width plus a hand's breadth,
           so the crescent stands almost entirely clear of her silhouette and
           runs over paper rather than over her own dark hair and veil. Centred
           on her (draft 1) it vanished into her completely; a fifth of a body
           out (draft 2) left only a fragment of one limb showing. The quiver
           takes the other side by the same rule. */
        place(offctx, W, H, bow, {
          x: p.x - 0.235 * bodyH,
          y: y - (grieving ? 0.40 : 0.56) * bodyH,
          hFrac: scale * BOW_H, ar:BOW_AR,
          fx:BOW_GRIP.x, fy:BOW_GRIP.y, pad:0.05,
          state:{ mode, t:0.5, flex:0, owner:3,
                  status: mode === "stored" ? "OFF THE PEG" : "CARRIED",
                  progress: mode === "stored" ? .05 : .18 },
          sig:`bow|${mode}`,
        });
      }
      if (hasQuiv){
        const qh = bodyH * 0.62;                           // ~1.0m of quiver+shafts
        const qw = qh * ((QIV_WIN.x1 - QIV_WIN.x0) * QIV_CW)
                      / ((QIV_WIN.y1 - QIV_WIN.y0) * QIV_CH) * (H / W);
        propAt(offctx, W, H, quiver, {
          x: p.x + 0.215 * bodyH, y: y - (grieving ? 0.05 : 0.10) * bodyH,
          wFrac:qw, hFrac:qh, cw:QIV_CW, ch:QIV_CH, win:QIV_WIN,
          state:{ mode:"carry", count:12, t:0.5, status:"TWELVE", progress:.16 },
          sig:"quiver|carry",
        });
      }
    }

    /* --- 6. THE HALL, FULL OF THEM. Drawn last: the crowd is the nearest
       thing in the frame and the room's own benches are under it (note G). -- */
    if (inHall) placeCrowd(offctx, W, H, crowdAt(t));
  },
};
export default scene;

/* named binding so OD-B21-S02 can `import { exitOccupancy as INITIAL }`.
   S02 plays in this same hall and every station in it is a megaron station, so
   it needs no translation table — only Telemachus and the herdsmen added. */
export const exitOccupancy = scene.exitOccupancy;
