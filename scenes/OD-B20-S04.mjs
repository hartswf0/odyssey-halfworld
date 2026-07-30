/* ============================================================
   SCENE  OD-B20-S04 — The Ox Hoof                       (Od. 20.240–344)
   Book XX, scene 4. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied
   from the reference scene, scenes/OD-B16-S03.mjs, and from its Book XX and
   XXI siblings, OD-B20-S03 and OD-B21-S01.

   Beats (causal order, one master clock):
     1. The suitors are still on the plan to kill Telemachus when a bird
        crosses on their LEFT — a raptor with a dove clenched in its talons —
        and Amphinomus tells them the killing cannot go forward until they
        know whose sign it is.
     2. At the meal Ctesippus stands up, announces that the stranger shall
        have his guest-gift like everybody else, takes an ox hoof out of the
        meat basket and throws it at his head.
     3. Odysseus leans his head aside; the hoof goes over him and strikes the
        wall by the great doors. Telemachus promises the offender the spear
        if there is a second throw.
     4. Agelaus challenges the prince over his mother; Telemachus refuses to
        drive her out or to choose for her.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM, NOT ROOMS. One hall: location.megaron-hall in state `feast` —
      the misrule state, laden tables and high fire — placed the way every
      Book XVI+ hall scene places its field (anchor .50/.99, scale 1.0), so
      this hall registers on B16-S04, B17-S01, B18-S01, B19-S02, B20-S03 and
      B21-S01 to the pixel. TWO CHANGES to the layer list, both continuity
      rather than taste:
        · `racks` is DROPPED. Od. 19.1–33: father and son carried every spear
          and shield out of this hall by night. `feast` still hangs arms on
          the walls for XVI–XVIII; from Book XX there is nothing to hang.
          B20-S03 dropped it and this scene inherits that.
        · `litter` is OFF until the meal is actually under way (MEAL=28) and
          on afterwards. B20-S03 ended at dawn with a dressed hall and a
          clean floor — "no litter on the floor yet" — and this is the scene
          in which they eat, so the litter arrives on the clock instead of
          being asserted at t=0.

   B. NO HAND-PLACED ANCHORS. Every position resolves through
      scenes/_plans/megaron.mjs by station NAME. The usable-station question
      was settled by B18-S01, B19-S02, B20-S03 and B21-S01 and is not
      re-litigated: bench_l1/l2/r1/r2 and table_l/r paint furniture through a
      standing body, `hearth` is a fire, `throne` is a plinth. What is used
      here is the clean floor: axe_first, door_main, pillar_l, pillar_r,
      doorway_maid, corner_dead — plus `table_l` for a PROP, which is a
      table, and is therefore exactly where an object lies (note J).

   C. WHERE THE FOUR BODIES STAND, AND WHY.
        · ODYSSEUS on `axe_first` — one pace INSIDE the stone sill, on the
          spine. Od. 20.257–259: Telemachus sets him a stool and a table
          "INSIDE the hall by the stone threshold", and this is that mark. It
          is not `threshold` itself, for a reason the first render made
          plain: in `feast` the great doors are OPEN, so the megaron paints a
          bright aperture from y .43 to .70 dead centre, and a body standing
          on the sill (feet y .564, head y .28 at that depth) lands wholly
          INSIDE it with the door frame drawn round him — he stops reading as
          a man in a room and starts reading as a portrait hung in the
          doorway. One station inboard (z .16 -> .28) makes him bigger, puts
          his feet on floor the room paints as floor, and takes his head up
          over the top edge of the aperture, so the bright doorway becomes
          what it should be: the light he is silhouetted against. He comes
          there off the right-hand wall (`doorway_maid`), the ground S03 left
          him standing on.
        · CTESIPPUS on `pillar_l` and TELEMACHUS on `pillar_r`: the two
          roof-pillars, one depth, 0.324 of the frame apart, with the beggar
          on the spine BEHIND and BETWEEN them. That is the diagram of the
          scene — the thrower on one side, the prince who answers him on the
          other, the target in the middle distance — and it is also what puts
          the throw across the whole width of the room instead of along it.
        · AMPHINOMUS on `corner_dead`, the near left. He is the biggest body
          in the frame (d .90) and the only one who looks UP AND LEFT, which
          is where the omen window is (note E): a suitor on his feet at the
          front bench, reading a bird over the roof.
      ONE BODY ON THE SPINE AT A TIME. `threshold`, `axe_first` and
      `door_main` are all x=.50 and any two of them occupied stack into a
      totem of heads, so only `axe_first` is ever used: the sill and the great
      doors stay empty of bodies for the whole scene, and the only thing that
      crosses them is the thrown hoof.

   D. ONE BODY, ONE GUISE. Odysseus is character.odysseus-b16 with guise
      "beggar" held for the whole scene — no cut to .odysseus-as-beggar and no
      guise ramp: he is not restored until Book XXII, so the channel does not
      move here and no divine_fx is cast.

   E. THE OMEN, AND THE ONE SUBSTITUTION IN THIS SCENE.
      The atlas asks for `creature.left-side-eagle-omen`. IT DOES NOT EXIST —
      it is still an open job in book20/jobs.json, and this scene will not
      invent a second bird module or import a file that is not there. The
      nearest thing the atlas already owns is `creature.hawk-and-dove-omen`
      (built for OD-B15-S05): a raptor in a fast diagonal stoop with a
      plucked DOVE clenched in its talons, feathers coming loose at the grip,
      and a dashed strike arc an augur can read. The dove is the load-bearing
      detail of Od. 20.242–243 and this asset has it; the species is a hawk
      and not an eagle, and that is a real, named difference, recorded here
      and in selfAssessment rather than papered over. When the eagle module
      lands, one import and one window swap this scene over.
      The bird is NOT in this room, so it is not painted in it. It is
      composited as ONE called-out DETAIL WINDOW in the upper LEFT — the
      idiom of B19-S01's arms ledger, B20-S02's quern and B20-S03's court —
      because the left is the whole point: the sign crossed on the suitors'
      unfavourable side. The window has its own paper field and one hard
      rule, and the creature's own `sky` layer is DROPPED so the plate is
      paper with two birds on it instead of a grey panel: the module floods
      its canvas with inkLevel(1) (lum .858), which survives the 0.895 dot
      key and would print as a solid tile over the ceiling.
      It runs on the master clock and then it is GONE: `seize` (the collision
      instant) from OMEN0, `strike` (the plunge, carrying it away) from
      OMEN_SEIZE, nothing after OMEN1. A sign that stayed up for the whole
      scene would stop being an event.

   F. AGELAUS HAS NO MODULE, AND IS NOT PUPPETED BY SOMEBODY ELSE. Beat 4 is
      spoken by Agelaus son of Damastor; there is no `character.agelaus` in
      assets/character, and dressing Eurymachus or Antinous in his line would
      be a false identification in a continuity atlas. His challenge is
      carried by the CROWD (attention 1.0, the hall's whole face turned on
      the prince) and by what Telemachus does with it — which is the half of
      the exchange the scene actually needs, because the beat is the prince's
      refusal, not the question. Named in `sound` at its own timecode.

   G. THE HALL, FULL OF THEM: `ensemble.the-suitors` as a keyed crowd cutout
      (the B18-S01 / B21-S01 device), not a field. Its `backwall` and `floor`
      layers are dropped — the megaron paints this room — and so are its two
      tables (the hall's own `furniture` lays the boards they eat at) and its
      baked "stranger" figure, which belongs to Book I and would put a second
      beggar in a scene that has the real one on the sill. What is left is
      the two rows of lounging young men, keyed at 0.85 because the
      ensemble's lightest plane is lum .858 and the default key would leave an
      opaque panel standing in the hall. Density is held at 0.85 and the box
      is smaller than B21-S01's, because this room is already carrying four
      figures and a laden feast: the crowd is the near band, not the frame.
      They run: the murder council -> the meal -> the reaction wave as the
      hoof crosses -> hushed under the prince's answer.

   H. CONTINUITY IN — computed, then DECLARED for the two additions, with the
      three herdsmen TRANSLATED OUT. B20-S03 ends
      { odysseus:doorway_maid, eurycleia:postern, eumaeus:corner_dead,
        melanthius:pillar_l, philoetius:pillar_r }.
      Odysseus and Eurycleia are inherited unchanged (she is through the
      service passage and is not drawn, exactly as S03 stopped drawing her).
      Eumaeus, Melanthius and Philoetius are moved to `door_main` — the mouth
      of the court — because that is where their work is: S03's own exit
      state has Philoetius told "he is coming" *before the herdsman goes to
      his work*, Melanthius' twelve goats tied under the portico, and three
      droves standing inside the court gate waiting to be butchered for THIS
      meal. They are carried in the chain at that mark and are NOT drawn: no
      drawn body ever stands on a station one of them holds, and nothing is
      dropped from the chain. `door_main` is this scene's off-stage mark and
      three bodies share it, exactly as they shared it in S03 before they
      came in.
      Ctesippus and Amphinomus are new to the chain and are declared at
      `door_main` too — they come in with the company — and the ox hoof is
      declared at `table_l`, on the carving board, before anybody touches it.

   I. ROUTES CHECKED ACROSS TIME, NOT ASSUMED. Four things move.
        · AMPHINOMUS door_main(.50,.10) -> corner_dead(.10,.90) crosses
          z=.445 at x=.328 and z=.595 at x=.252 — outside the hearth ring
          (plan x .395–.605, z .445–.595) on the left, so he does not walk
          through the fire. He passes z=.44 at t≈4.8, when Ctesippus (who
          ends there) is still up at z≈.17 near the doors.
        · CTESIPPUS door_main -> pillar_l never reaches z .445 and so never
          touches the fire. Both men leave the doors on the same diagonal two
          seconds apart, but Amphinomus dives twice as deep per second, so
          the gap between them only opens: at t=6 they are (.278,.544) and
          (.420,.213) in plan, a third of the room apart.
        · ODYSSEUS doorway_maid(.94,.40) -> axe_first(.50,.28) passes the
          x of `pillar_r` at z=.334 — 0.106 of plan depth FARTHER than
          Telemachus standing there, which projects to 0.05 of frame height
          above him, at speed, at t≈7. One nearer body over one farther one
          in motion, never at rest: the same crossing B20-S03 kept for
          Eurycleia and for the same reason.
        · THE HOOF flies pillar_l -> door_main. Its plan line runs z .44 ->
          .10, so it never enters the hearth ring either, and it is LIFTED off
          the floor plane to head height for the whole flight (note J), so
          "over the beggar's head" is where it actually is: it ends 0.06 of
          plan depth BEYOND the man on the sill and 0.26 of frame height above
          the floor, which is the wall behind him.
      Nothing at rest is within 0.16 of frame width of anything else at rest.

   J. THE HOOF IS AN OBJECT IN THE ROOM, NOT A POSTER OF ONE. prop.ox-hoof
      draws a whole-frame DIAGRAM per state — carving plank, declared-length
      caliper, sight line and reticle, flight parabola, clearance brackets,
      struck masonry, grease pool, marker peg. Cast full-frame it would paint
      its own wall and its own floor over the inside of the hall, and its
      seven-segment numerals would fall to 20-odd pixels, under the legible
      floor. So it is blitted through ONE DECLARED WINDOW per state, cut from
      the module's own POSE table rather than guessed:
        · the window is centred on the object's PIVOT (the sawn-face centre,
          which is what `rot` turns about), and its half-size is given in the
          module's own local units, where the object is 1.75 units long and
          no point of it is further than 1.164 from the pivot. A window of
          radius 1.25 therefore holds the whole hoof AT ANY ROTATION, which
          is what lets the thing tumble in flight without being clipped.
        · `board` (on the carving plank, before anyone touches it) uses an
          ASYMMETRIC window, 0.70 by 1.15, because at its authored rotation
          the object only reaches -0.36..+0.60 across: that crops the caliper
          and its numerals out of frame and keeps the plank, which is the
          board the hoof is lying on.
        · `seized` keeps the grip ticks — it is in a hand — and its window
          stops short of the lift arrow. `flight` keeps the spin ticks and a
          fragment of the module's own dashed parabola, which is a motion
          trail on a thrown object. `evidence` keeps the grease pool and the
          scuff and crops the marker peg and its leader.
        · SIZE IS DECLARED, NOT EYEBALLED. The module says the object is
          45cm; a man is about 170cm and the rig draws his body at 0.78 of
          its box; so the hoof's length is 0.45/1.70 of the body height the
          plan gives at the hoof's own depth. It shrinks as it flies away
          from the camera because the plan's depth law makes it, not because
          a number was tuned.
        · IN HAND it is keyed to Ctesippus' LIVE blocked box through the
          module's own declared `hoofGrip` anchor (.66,.31), mirrored with
          him, so it cannot drift off his fist when his mark or his scale
          changes.
        · BEFORE and AFTER, the object is CALLED OUT in one slot hanging from
          the top-right corner — `board` from the omen leaving to the hand
          taking it, `evidence` from the moment it settles — because at both
          those moments the room cannot show it: on the table it is 74px of
          light plane among the room's own laden boards and the crowd cutout,
          and at rest it is behind the body it was thrown at. In between —
          seized, thrown, striking — it is in the room and in no window. The
          reasons are recorded at BOARD_WIN/EVID_WIN, where the numbers are.

   K. TWO MIRRORS, DECIDED ONCE. The rig aims its pointing poses at NEGATIVE
      x (pointing_arm and confrontation both carry gazeX -.55, headYaw -.3),
      and character.ctesippus' bespoke poses do the same: `guest_gift_hurl`
      cocks the right arm behind the head and points the target out with the
      left, down and to the LEFT. In this room the man Ctesippus is throwing
      at is on his RIGHT, so he is drawn `mirror:true` for the WHOLE scene —
      never switched mid-scene, which would flip his cloak from one shoulder
      to the other in one frame. He is pure rig (zero ctx overpaint in the
      module, checked), so the mirror is exact. Telemachus is NEVER mirrored:
      Ctesippus is on his left, which is where his confrontation already
      points. Gaze is passed in FINAL screen terms, because figure-hero
      applies state.gaze AFTER mirroring the pose numerics.

   L. TONE. The hall is placed in a LIGHT state (`feast`, lift 0), never
      `night`/`battle`/`aftermath` (lift 1), which are the dark rooms of
      Book XXII. No ctx overpaint is added to any figure — every mark on all
      four is the shared rig, which is what keeps the six Odysseus modules in
      family. The only scene-level ctx work is the detail window's paper
      field and its single rule, which is the same device the engine's card
      uses. Nothing in this scene depends on type: the omen plate carries no
      numerals and every numeral in the hoof's diagram is cropped out.

   Verified at four moments (the council under the omen, the meal with the
   guest-gift called out, the throw crossing the doorway, the threat with the
   hoof on the floor):
     node harness/render-scene.mjs scenes/OD-B20-S04.mjs --t 16
     node harness/render-scene.mjs scenes/OD-B20-S04.mjs --t 30
     node harness/render-scene.mjs scenes/OD-B20-S04.mjs --t 43
     node harness/render-scene.mjs scenes/OD-B20-S04.mjs --t 52
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, lerp, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import ctesippus   from "../assets/character/ctesippus.mjs";
import amphinomus  from "../assets/character/amphinomus.mjs";
import hoof        from "../assets/prop/ox-hoof.mjs";
import omen        from "../assets/creature/hawk-and-dove-omen.mjs";
import suitors     from "../assets/ensemble/the-suitors.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 66;

/* ---- THE CLOCK ---------------------------------------------------------- */
const AMP_IN0 = 1,  AMP_IN1 = 10;   // Amphinomus in from the doors to the near bench
const CTE_IN0 = 3,  CTE_IN1 = 12;   // Ctesippus in to the left-hand roof-pillar
const SILL0   = 4,  SILL1   = 11;   // the beggar off the right wall onto the sill
const OMEN0   = 12;                 // the bird crosses on the left, dove in its talons
const OMEN_SEIZE = 17;              // it carries the kill away
const OMEN1   = 26;                 // and it is gone
const REJECT  = 18;                 // "not while a sign like that is over the house"
const MEAL    = 28;                 // the meal: litter on the floor from here
const SEIZE   = 34;                 // Ctesippus takes the hoof off the board
const HURL    = 40;                 // the guest-gift, cocked
const FLY0    = 41, FLY1 = 45;      // across the hall
const DODGE   = 43;                 // he leans his head aside
const HIT     = 45, DROP1 = 47;     // the wall, then the floor
const LAUGH   = 46;                 // and the thrower turns for the laugh
const THREAT  = 51;                 // the prince promises the spear
const AGELAUS = 57;                 // Agelaus challenges him over his mother
const REFUSE  = 61;                 // "I will not drive her out"

/* the room, minus the arms carried out in Book XIX (note A). `litter` joins
   the list once they are eating, and only then. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","postern","maidsdoor",
                     "stair","pillars","lane","hearth","furniture","throne"];
const HALL_LAYERS_MEAL = [...HALL_LAYERS, "litter"];

/* ---- CONTINUITY IN (note H) ---------------------------------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B20-S03.mjs";
/* the three herdsmen are at their work in the court: the droves S03 left
   inside the court gate are the meat of this meal. Carried, not dropped. */
const AT_WORK = new Set(["eumaeus", "melanthius", "philoetius"]);
const INITIAL = {
  ...Object.fromEntries(
    Object.entries(PREV_EXIT || {})
      .map(([who, st]) => [who, AT_WORK.has(who) ? "door_main" : st])
      .filter(([, st]) => st)),
  /* new to the chain */
  telemachus: "pillar_r",    // the prince, already in the hall all morning
  ctesippus:  "door_main",   // in with the company
  amphinomus: "door_main",
  hoof:       "table_l",     // on the carving board in the meat basket
};

/* ---- BLOCKING. Stations, not coordinates (notes B, C, I). ---------------- */
const MOVES = [
  { who:"amphinomus", from:"door_main",    to:"corner_dead", t0:AMP_IN0, t1:AMP_IN1 },
  { who:"ctesippus",  from:"door_main",    to:"pillar_l",    t0:CTE_IN0, t1:CTE_IN1 },
  { who:"odysseus",   from:"doorway_maid", to:"axe_first",   t0:SILL0,   t1:SILL1   },
  // the guest-gift, blocked like anything else — from the thrower's mark to
  // the wall by the great doors, where it stays as evidence
  { who:"hoof",       from:"pillar_l",     to:"door_main",   t0:FLY0, t1:FLY1,
    kind:"prop" },
];

/* ---- THE BOX A BODY IS DRAWN IN (verbatim from OD-B21-S01) ---------------
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide). figure-hero caps the skeleton at min(H*0.9, W*1.26), so body height
   survives a wide box, but every width-relative decoration stretches with W.
   Characters are therefore drawn into the PORTRAIT box the atlas authored
   them in and blitted. FIG_FLOOR is the rig's own floor line: it plants the
   ankles at H*0.90 of its box, so anchoring by the box bottom would hang the
   body a tenth of its height above the mark the plan gave it. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
const FIG_BODY  = 0.78;      // body height as a fraction of the box height
/* one height for the whole cast: the plan's own depth law does the rest, so
   nobody is hand-tuned bigger than the room allows. */
const K = 0.52;

/* blit a module into a box of a chosen aspect, anchored by a point INSIDE the
   box. `sig` is required: keyedModuleCanvas caches on pose/band/t only, so
   without it a change of gaze or brow returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* PLATE — blit one declared WINDOW of a whole-frame drawing, keyed, so the
   room shows between its lines and the plate's frame furniture stays out of
   frame. `cw`/`ch` is the canvas the drawing is made on. */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* A DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses (note E). */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

/* ---- THE OMEN WINDOW (note E) -------------------------------------------
   Measured off renders/creature__hawk-and-dove-omen.png: in `strike` the pair
   occupies canvas x .345–.765, y .29–.596, centred (.555,.443). The window is
   cut to the aspect of the destination plate so nothing is stretched, and it
   is 0.50 of the canvas wide — the pair is ~235px inside a 280px window, and
   blows DOWN slightly into a 237px plate. Upper LEFT, starting below the card
   label, stopping short of the postern opening whose top-left corner is at
   (.241,.376): it covers no door and no plot geometry. */
const OMEN_CW = 560, OMEN_CH = 778;              // the aspect the module was measured at
const OMEN_DST = { x0:0.034, y0:0.062, x1:0.246, y1:0.352 };
const OMEN_WIN = { x0:0.305, y0:0.276, x1:0.805, y1:0.610 };
const OMEN_LAYERS = ["arc","hawk","feathers"];   // `sky` dropped: paper, not a panel
const omenPoseAt = t => t < OMEN0 ? null
                      : t < OMEN_SEIZE ? "seize"
                      : t < OMEN1 ? "strike" : null;

/* ---- THE HOOF (note J) ---------------------------------------------------
   POSE geometry read straight off assets/prop/ox-hoof.mjs: cx/cy is the pivot
   in canvas fractions, s the module's local unit as a fraction of canvas
   WIDTH. rx/ry are window half-sizes in those local units. */
const HOOF_CW = 660, HOOF_CH = 857;
const HOOF_LEN_LOCAL = 1.75;      // sawn face (-1.13) to sole (+0.62)
const HOOF_POSE = {
  board:    { cx:.485, cy:.508, s:.320, rx:0.70, ry:1.15 },
  seized:   { cx:.545, cy:.470, s:.272, rx:1.25, ry:1.25 },
  flight:   { cx:.470, cy:.420, s:.248, rx:1.25, ry:1.25 },
  evidence: { cx:.436, cy:.577, s:.280, rx:1.25, ry:1.25 },
};
/* THE BOARD IS A LEGEND, NOT A BODY IN THE ROOM. Iteration 1 put the hoof on
   the near-left table at its true declared size — 0.098 of frame height, 74px —
   and it printed as noise: that table is where the room paints its own laden
   boards and where the crowd cutout sits, so a 45cm object among a table of
   joints had nothing to read against. Before anybody picks it up it is
   therefore CALLED OUT in the upper right — the empty ceiling plane opposite
   the omen — as one plate of the prop's own neutral `board` state, cut to the
   object and the plank it stands on. It shows only in the gap between the omen
   going and the hand taking it (OMEN1 -> SEIZE), so there is never more than
   one window in the frame, and from SEIZE the hoof is in the room at its
   declared size and nowhere else.
   The window is cut at x .330 to crop the caliper AND its seven-segment
   numeral, which drawNumber() lays out from canvas x .170 to .314 at 68px and
   which would fall to 23px in a 125px plate — under the legible floor. */
const BOARD_WIN = { x0:0.330, y0:0.205, x1:0.700, y1:0.725 };
/* Both plates are 0.215 of frame height and hang from the same top-right
   corner, so the slot reads as ONE window: only the width follows the state's
   own aspect. 0.215 and not more because the megaron paints a dark wall panel
   from about y .33 on that side, and a taller plate ran the hoof straight into
   it — the object appeared to continue below the rule. */
const BOARD_DST = { x0:0.8691, y0:0.075, x1:0.9490, y1:0.290 };
/* AND AFTER. The hoof comes to rest at `door_main` — the foot of the far wall,
   which is where it actually fell — and that mark is on the spine, 0.078 of
   frame height BEHIND the man standing at `axe_first`, so in this camera the
   object at rest is occluded by the body it was thrown at. That is the truth of
   the room and it is not nudged: it is CALLED OUT instead, in the same
   top-right slot, as the prop's own `evidence` state — grease pool, scuff, the
   thing left in the hall. Same corner, same instance, cut to its own state, so
   the slot reads as one window whose contents change: the guest-gift before
   anybody touches it, and the guest-gift afterwards. The window stops at x .780
   to crop the marker peg at .862 and its dashed leader. */
const EVID_WIN = { x0:0.180, y0:0.330, x1:0.780, y1:0.770 };
const EVID_DST = { x0:0.7960, y0:0.075, x1:0.9490, y1:0.290 };

const HOOF_CM = 45, MAN_CM = 170;            // both declared by their own modules
const PROP_TO_FIG = 1.08 / 0.92;             // project()'s prop kind vs figure kind
/* THE SOURCE CANVAS IS SIZED TO THE BLIT, NOT LEFT AT SOME ROUND NUMBER.
   Iteration 2 drew the flying hoof out of a 660px canvas into a 92px box — a
   4.4x downscale — and it printed as a scatter of stray dots: the object is a
   LIGHT plane (ink level 2) held together by a 5px contour, and at 4.4:1 that
   contour lands at ~1px, under the POST pass's dot pitch, so the outline
   dissolves and the light plane has nothing to be bounded by. The module's
   stroke widths are absolute pixels, so the fix is to render it at the size it
   is going to be USED at: the canvas is computed per blit from the declared
   length, at OVERSAMPLE just above 1:1, which lands the contour at ~4px on the
   stage — a continuous line of dots — and makes the object chunkier as it gets
   smaller, which is the right direction for this pipeline. The authored aspect
   is preserved so the module's own cx/cy/s stay valid. */
const HOOF_OVERSAMPLE = 1.05;
function placeHoof(offctx, W, H, { mode, x, y, len, rot, status, progress }){
  const P = HOOF_POSE[mode];
  const win = { x0:P.cx - P.rx*P.s,               x1:P.cx + P.rx*P.s,
                y0:P.cy - P.ry*P.s*HOOF_CW/HOOF_CH,
                y1:P.cy + P.ry*P.s*HOOF_CW/HOOF_CH };
  // the canvas that makes this blit ~1:1 for the length asked for
  const cw = Math.max(48, Math.round(HOOF_OVERSAMPLE * len * H
                                     / (HOOF_LEN_LOCAL * P.s)));
  const ch = Math.round(cw * HOOF_CH / HOOF_CW);
  const kpx = (len * H) / (HOOF_LEN_LOCAL * P.s * cw);
  const wF  = (win.x1 - win.x0) * cw * kpx / W;
  const hF  = (win.y1 - win.y0) * ch * kpx / H;
  const fx  = (P.cx - win.x0) / (win.x1 - win.x0);
  const fy  = (P.cy - win.y0) / (win.y1 - win.y0);
  plate(offctx, W, H, hoof, cw, ch, win,
        { x0: x - fx*wF, y0: y - fy*hF, x1: x + (1-fx)*wF, y1: y + (1-fy)*hF },
        { mode, rot, t:0.5, status, progress },
        `hoof|${mode}|${Math.round((rot ?? 0) * 24)}`);
}
/* the legend plates are sized the same way as the in-room object and for the
   same reason: a 660px canvas blitted into a 125px plate is a 5x downscale, and
   the first pass of this window printed the hide as a scatter of loose dots
   with no contour holding it. cw is derived from the plate width so the blit is
   ~1:1 and the module's own 5px strokes land at 5px on the stage. */
function legendPlate(offctx, W, H, dst, win, state, sig){
  const cw = Math.round((dst.x1 - dst.x0) * W / (win.x1 - win.x0));
  const ch = Math.round(cw * HOOF_CH / HOOF_CW);
  detailField(offctx, W, H, dst);
  plate(offctx, W, H, hoof, cw, ch, win, dst, state, sig);
}

/* the length the object should be at a given blocked depth: the plan's own
   figure law, times the two declared sizes. */
const hoofLen = p => FIG_BODY * K * p.scale * PROP_TO_FIG * (HOOF_CM / MAN_CM);
/* the table it lies on. megaron-hall builds both feast tables 0.105 unit
   heights tall — planBox(..., 0.105, ...) — at their own station scale, so the
   lift onto the board is read off the room's own params, not off the picture. */
const TABLE_UNIT_H = 0.105;
const SZ = z => 0.60 + 0.50 * z;
const TABLE_LIFT = TABLE_UNIT_H * SZ(megaron.stations.table_l.z);

/* ---- THE CROWD (note G) -------------------------------------------------- */
const CROWD = { at:{ x:.50, y:.965 }, w:.76, h:.36 };
const CROWD_LAYERS = ["bgrow","fgrow"];
function placeCrowd(offctx, W, H, state){
  const w = W * CROWD.w, h = H * CROWD.h;
  const sig = `${Math.round((state.attention ?? 0) * 20)}`
            + `|${Math.round((state.wave ?? 0) * 20)}`;
  offctx.drawImage(keyedModuleCanvas(suitors, w, h, state, sig, 0.85),
                   CROWD.at.x * W - w / 2, CROWD.at.y * H - h);
}
const crowdAt = t => {
  const base = { density:0.70, layers:CROWD_LAYERS };
  if (t < REJECT)  return { ...base, attention:0.00, wave:0.00,
                            status:"THE MURDER COUNCIL", progress:.14 };
  if (t < MEAL)    return { ...base, attention:0.10, wave:0.20,
                            status:"A BIRD ON THE LEFT", progress:.26 };
  if (t < HURL)    return { ...base, attention:0.05, wave:0.00,
                            status:"CAROUSING", progress:.44 };
  if (t < THREAT)  return { ...base, attention:0.30,
                            wave: clamp01((t - HURL) / 8),
                            status:"THE LAUGH", progress:.66 };
  if (t < AGELAUS) return { ...base, attention:1.00, wave:1.00,
                            status:"HUSHED", progress:.80 };
  return             { ...base, attention:1.00, wave:1.00,
                            status:"AGELAUS SPEAKS", progress:.92 };
};

export const scene = {
  id:"OD-B20-S04",
  title:"The Ox Hoof",
  book:20,
  plan:"megaron",
  duration:D,
  beats:[
    "The suitors hold to the plan of killing Telemachus until a bird crosses on their left with a dove in its talons.",
    "Amphinomus stops the killing: not until they know whose sign that was.",
    "At the meal Ctesippus announces the stranger's guest-gift and throws an ox hoof at his head.",
    "Odysseus leans his head aside; the hoof goes over him and strikes the wall by the doors.",
    "Telemachus promises the spear to the next man who throws, and the hall goes quiet.",
    "Agelaus challenges him over his mother; the prince refuses to drive her out or to choose for her.",
  ],
  exitState:
    "Midday of Apollo's feast day, in the megaron, the meal in progress: high " +
    "fire, laden tables, litter on the floor, the great doors open, the walls " +
    "still bare of arms since Book XIX. The assault has happened and been " +
    "answered. Odysseus, still the beggar, is on his stool at the stone " +
    "threshold (`axe_first`) where Telemachus seated him, unhurt — he leaned " +
    "his head aside — and he has said nothing; the ox hoof lies on the floor " +
    "at the foot of the far wall by the great doors (`door_main`), grease on " +
    "the stone where it struck, the insult left in the room as an object. " +
    "Ctesippus is at the left-hand roof-pillar (`pillar_l`), his joke checked: " +
    "Telemachus has promised him the spear if there is a second throw, and " +
    "nobody in the hall laughed the second time. Telemachus holds the " +
    "right-hand roof-pillar (`pillar_r`), having just refused Agelaus over his " +
    "mother — he will not drive her out and he will not choose for her. " +
    "Amphinomus is on his feet at the near bench in the left corner " +
    "(`corner_dead`) with the omen still on him: he stopped the murder plan " +
    "this morning and he has said nothing since. The bird is gone. Eumaeus, " +
    "Melanthius and Philoetius are at their work at the court mouth " +
    "(`door_main`); Eurycleia is through the service passage (`postern`). " +
    "S05 opens from exactly this state, with the suitors laughing at a meal " +
    "they cannot see clearly.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    amphinomus:"entrance:main-door (`door_main`) -> `corner_dead`, from AMP_IN0=1",
    ctesippus:"entrance:main-door (`door_main`) -> `pillar_l`, from CTE_IN0=3",
    odysseus:"already in the hall since B19-S02; off `doorway_maid` onto the sill",
    telemachus:"already in the hall; holds `pillar_r` throughout",
    suitors:"the company is in the hall for the whole scene — a crowd cutout, never blocked",
    omen:"outside and above, on the LEFT: a detail window, not a body in the room",
  },
  exits:{
    odysseus:"none — he holds `axe_first` into S05",
    ctesippus:"none — he holds `pillar_l`, checked",
    telemachus:"none — he holds `pillar_r`",
    amphinomus:"none — he holds `corner_dead`",
    hoof:"thrown; comes to rest at `door_main` and stays in the room as evidence",
    omen:"gone at OMEN1=26 — it crossed and carried the dove away",
  },
  walkable:"the megaron's walkable band, minus the hearth ring (plan x .395–" +
           ".605, z .445–.595), minus the bench and table stations, which " +
           "paint furniture through a standing body, and minus the spine " +
           "(`axe_first`, `door_main`) while the sill is occupied.",
  depthOrder:"one queue, sorted by the plan's own z: the room, then Odysseus " +
             "(z .40 -> .16), then Ctesippus and Telemachus on the two pillars " +
             "(z .44), then the hoof at whatever depth it is at, then the crowd " +
             "cutout (the near benches), then Amphinomus (z .90), who is the " +
             "nearest body in the frame and is drawn last.",
  gazeTargets:{
    amphinomus:"UP AND LEFT to the bird for the whole omen, then down and " +
               "across at the men he is arguing with, then nothing",
    ctesippus:"the company while he performs the bestowal, the beggar's head " +
              "for the throw, the company again for the laugh, then Telemachus",
    telemachus:"the beggar he has just fed, then LEFT onto Ctesippus for the " +
               "threat, then level at the hall for Agelaus' question",
    odysseus:"the floor, then up and left following the hoof past his ear, " +
             "then the thrower, then the floor again",
    suitors:"each other over the murder plan, then their cups, then the wave " +
            "turns them one after another onto the throw, then all of them " +
            "onto the prince",
  },
  attachments:[
    { at:SEIZE, who:"ctesippus", change:"prop.ox-hoof leaves the carving board " +
      "at `table_l` and attaches at his declared `hoofGrip` anchor, mode `seized`" },
    { at:HURL,  who:"ctesippus", change:"pose guest_gift_hurl — the hoof cocked " +
      "behind the head, the target pointed out with the other hand" },
    { at:FLY0,  who:"hoof", change:"detaches; mode seized -> flight, tumbling on " +
      "the plan line pillar_l -> door_main at head height" },
    { at:HIT,   who:"hoof", change:"the wall by the doors; the lift falls away " +
      "over two seconds" },
    { at:DROP1, who:"hoof", change:"mode flight -> evidence, on the floor at " +
      "`door_main`: grease pool, scuff, and it stays there" },
  ],
  sound:[
    { at:0,       source:"door_main",  cue:"the company coming in, still talking about killing the boy" },
    { at:OMEN0,   source:"omen",       cue:"one hard wingbeat over the roof on the left, and a dove that stops crying" },
    { at:REJECT,  source:"corner_dead",cue:"Amphinomus, flat and quiet: not today" },
    { at:MEAL,    source:"table_l",    cue:"meat on boards, cups, the hall eating" },
    { at:SEIZE,   source:"table_l",    cue:"a hoof coming out of a basket of joints" },
    { at:HURL,    source:"pillar_l",   cue:"Ctesippus, loud, to the whole room: his guest-gift" },
    { at:HIT,     source:"door_main",  cue:"forty-five centimetres of bone on dressed stone" },
    { at:LAUGH,   source:"pillar_l",   cue:"the laugh he collects, and one man not laughing" },
    { at:THREAT,  source:"pillar_r",   cue:"the prince, level: the spear next time, and the funeral instead of a wedding" },
    { at:AGELAUS, source:"table_r",    cue:"Agelaus son of Damastor, reasonable, asking about his mother" },
    { at:REFUSE,  source:"pillar_r",   cue:"the refusal — I will not drive her out of the house that bore her son" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"creature.hawk-and-dove-omen", instance:"omen_01",
      anchor:{x:.14,y:.35}, scale:.21, state:"seize" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.38, band:"threeq", pose:"head_lowered" },
    { asset:"character.ctesippus", instance:"ctesippus",
      anchor:{x:.34,y:.69}, scale:.46, band:"threeq", pose:"moneyed_lounge" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.66,y:.69}, scale:.46, band:"threeq", pose:"alert" },
    { asset:"prop.ox-hoof", instance:"hoof_01",
      anchor:{x:.29,y:.71}, scale:.10, state:"board" },
    { asset:"ensemble.the-suitors", instance:"suitors_01",
      anchor:{x:.50,y:.965}, scale:.86, blend:"multiply" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.12,y:.91}, scale:.59, band:"threeq", pose:"three_quarter_left" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at:0.0,     args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus",   at:0.0,     args:{ gaze:{ x:-.18, y:.36 } } },
    { op:"actor.pose", target:"telemachus", at:0.0,     args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:0.0,     args:{ gaze:{ x:-.30, y:.10 } } },
    { op:"actor.pose", target:"ctesippus",  at:0.0,     args:{ pose:"moneyed_lounge" } },
    { op:"actor.gaze", target:"ctesippus",  at:0.0,     args:{ gaze:{ x:.34, y:-.12 } } },
    { op:"actor.pose", target:"amphinomus", at:0.0,     args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"amphinomus", at:0.0,     args:{ gaze:{ x:-.14, y:.02 } } },
    // 1. the sign on the left
    { op:"fx.play",    target:"omen_01",    at:OMEN0,   args:{ dir:"cross" } },
    { op:"actor.pose", target:"amphinomus", at:OMEN0,   args:{ pose:"divine_condition" } },
    { op:"actor.gaze", target:"amphinomus", at:OMEN0,   args:{ gaze:{ x:-.44, y:-.56 } } },
    { op:"actor.pose", target:"ctesippus",  at:OMEN0,   args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"ctesippus",  at:OMEN0,   args:{ gaze:{ x:-.40, y:-.44 } } },
    { op:"actor.gaze", target:"telemachus", at:OMEN0,   args:{ gaze:{ x:-.38, y:-.40 } } },
    // 2. Amphinomus stops it
    { op:"actor.gaze", target:"amphinomus", at:REJECT,  args:{ gaze:{ x:.30, y:-.14 } } },
    { op:"actor.pose", target:"ctesippus",  at:REJECT,  args:{ pose:"moneyed_lounge" } },
    { op:"actor.gaze", target:"ctesippus",  at:REJECT,  args:{ gaze:{ x:-.26, y:.06 } } },
    // 3. the meal
    { op:"actor.pose", target:"amphinomus", at:MEAL,    args:{ pose:"uneasy_reserve" } },
    { op:"actor.gaze", target:"amphinomus", at:MEAL,    args:{ gaze:{ x:-.22, y:.32 } } },
    { op:"actor.pose", target:"telemachus", at:MEAL,    args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"telemachus", at:MEAL,    args:{ gaze:{ x:-.34, y:.18 } } },
    { op:"actor.pose", target:"odysseus",   at:MEAL,    args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus",   at:MEAL,    args:{ gaze:{ x:.24, y:.24 } } },
    // 4. the guest-gift
    { op:"actor.pose", target:"ctesippus",  at:SEIZE,   args:{ pose:"mock_bestowal" } },
    { op:"actor.gaze", target:"ctesippus",  at:SEIZE,   args:{ gaze:{ x:-.16, y:-.24 } } },
    { op:"prop.state", target:"hoof_01",    at:SEIZE,   args:{ mode:"seized" } },
    { op:"actor.pose", target:"telemachus", at:SEIZE+2, args:{ pose:"alert" } },
    { op:"actor.gaze", target:"telemachus", at:SEIZE+2, args:{ gaze:{ x:-.42, y:-.06 } } },
    { op:"actor.pose", target:"ctesippus",  at:HURL,    args:{ pose:"guest_gift_hurl" } },
    { op:"actor.gaze", target:"ctesippus",  at:HURL,    args:{ gaze:{ x:.55, y:-.10 } } },
    { op:"prop.state", target:"hoof_01",    at:FLY0,    args:{ mode:"flight" } },
    { op:"actor.pose", target:"odysseus",   at:DODGE,   args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"odysseus",   at:DODGE,   args:{ gaze:{ x:-.62, y:-.28 } } },
    { op:"actor.pose", target:"ctesippus",  at:LAUGH,   args:{ pose:"wit_appeal" } },
    { op:"actor.gaze", target:"ctesippus",  at:LAUGH,   args:{ gaze:{ x:-.52, y:-.16 } } },
    { op:"prop.state", target:"hoof_01",    at:DROP1,   args:{ mode:"evidence" } },
    { op:"actor.pose", target:"odysseus",   at:DROP1,   args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus",   at:DROP1,   args:{ gaze:{ x:-.34, y:.06 } } },
    // 5. the threat
    { op:"actor.pose", target:"telemachus", at:THREAT,  args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus", at:THREAT,  args:{ gaze:{ x:-.55, y:-.04 } } },
    { op:"actor.pose", target:"ctesippus",  at:THREAT+2,args:{ pose:"checked_wit" } },
    { op:"actor.gaze", target:"ctesippus",  at:THREAT+2,args:{ gaze:{ x:.36, y:-.06 } } },
    { op:"actor.pose", target:"amphinomus", at:THREAT+2,args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"amphinomus", at:THREAT+2,args:{ gaze:{ x:.34, y:-.10 } } },
    // 6. Agelaus, and the refusal
    { op:"actor.pose", target:"telemachus", at:AGELAUS, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:AGELAUS, args:{ gaze:{ x:-.20, y:.08 } } },
    { op:"actor.pose", target:"telemachus", at:REFUSE,  args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"telemachus", at:REFUSE,  args:{ gaze:{ x:-.26, y:-.02 } } },
    { op:"actor.pose", target:"amphinomus", at:REFUSE,  args:{ pose:"uneasy_reserve" } },
    { op:"actor.gaze", target:"amphinomus", at:REFUSE,  args:{ gaze:{ x:-.20, y:.30 } } },
    { op:"timeline.capture", target:"OD-B20-S04", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const eating = t >= MEAL;
    const prog   = clamp01(0.12 + 0.82 * (t / D));

    /* --- 1. THE HALL. It paints the room; everything else keys onto it. --- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"feast", t:breath,
        layers: eating ? HALL_LAYERS_MEAL : HALL_LAYERS,
        status: t >= THREAT ? "THE HALL GOES QUIET"
              : t >= HURL   ? "THE GUEST-GIFT"
              : eating      ? "MISRULE AT MEAT" : "THE COMPANY COMES IN",
        progress: prog,
      },
    });

    /* --- 2. WHAT THE HOOF IS DOING, in one place ------------------------- */
    const hoofMode = t < SEIZE ? "board"
                   : t < FLY0  ? "seized"
                   : t < DROP1 ? "flight" : "evidence";
    const hoofDraw = () => {
      const p = blk.hoof;
      if (hoofMode === "board") return;      // it is a legend, not a body (below)
      if (hoofMode === "seized"){
        // keyed to Ctesippus' LIVE box through his own declared hoofGrip
        // anchor (.66,.31), MIRRORED with him (note K)
        const c = blk.ctesippus, h = K * c.scale;
        const bw = h * FIG_AR * H / W;                    // his box width, in W
        const gx = c.x + ((1 - 0.66) - 0.5) * bw;         // mirrored grip
        const gy = c.y - (FIG_FLOOR - 0.31) * h;
        placeHoof(offctx, W, H, {
          mode:"seized", x:gx, y:gy, len:hoofLen(c) * (0.92 / 1.08),
          status: t >= HURL ? "COCKED" : "SEIZED", progress:.28,
        });
        return;
      }
      if (hoofMode === "flight"){
        const u = clamp01((t - FLY0) / (FLY1 - FLY0));
        /* Head height at both ends of the line, plus a little arc. The factor
           is 0.78 of body height and not 0.86 for a reason iteration 3 showed:
           at 0.86 plus a 0.035 arc the object flew along y≈.30, which is
           exactly where the room paints the dark frame band over the great
           doors, and a light-planed object with a hard contour disappeared into
           it. At 0.78 the flight crosses the BRIGHT aperture instead — the
           doorway's own light — which is the one plane in this room that a dark
           contour reads against, and it is still over the beggar's head. */
        const lift = (0.78 * FIG_BODY * K * p.scale * PROP_TO_FIG)
                   + 0.012 * Math.sin(Math.PI * u);
        const fall = clamp01((t - HIT) / (DROP1 - HIT));
        placeHoof(offctx, W, H, {
          mode:"flight", x:p.x, y:p.y - lift * (1 - fall),
          len:hoofLen(p), rot: 1.42 + 7.4 * u,
          status: t >= HIT ? "WALL STRUCK" : "IN FLIGHT", progress:.60,
        });
        return;
      }
      placeHoof(offctx, W, H, {
        mode:"evidence", x:p.x, y:p.y - 0.22 * hoofLen(p),
        len:hoofLen(p), status:"EVIDENCE", progress:1.0,
      });
    };
    /* in hand it rides just in front of the thrower; thrown, it is wherever the
       plan says it is. */
    const hoofDepth = hoofMode === "seized" ? blk.ctesippus.d + 0.002
                                            : blk.hoof.d;

    /* --- 3. THE FOUR BODIES + the hoof + the crowd, one queue sorted by the
       plan's own depth so a farther thing is never painted over a nearer
       one. No ctx overpaint on any figure (note L). --------------------- */
    const figures = {
      /* ODYSSEUS — one body, guise "beggar" held. He takes the sill, is fed,
         is used as a target, leans his head aside, and says nothing. */
      odysseus: () => {
        const p = blk.odysseus, s = st.odysseus || {};
        const fed     = t >= MEAL && t < DODGE;
        const ducking = t >= DODGE && t < DROP1;
        const grim    = t >= DROP1;
        place(offctx, W, H, odysseus, {
          x:p.x, y:p.y, hFrac:K * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          state:{
            t: p.moving ? (t * 0.42) % 4 : breath,
            guise:"beggar", band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "head_lowered"),
            gaze: s.gaze || { x:-.18, y:.34 },
            browUp:    ducking ? .46 : grim ? .24 : .12,
            browKnit:  grim ? .44 : ducking ? .30 : .22,
            eyeNarrow: grim ? .42 : .18,
            eyeWide:   ducking ? .40 : 0,
            mouthAsym: grim ? .68 : .14,
            smile:     grim ? .18 : fed ? .16 : 0,
            jaw:       ducking ? .26 : 0,
            status: grim    ? "A GRIM SMILE"
                  : ducking ? "HEAD ASIDE"
                  : fed     ? "BREAD AND MEAT"
                  : t >= SILL1 ? "ON THE SILL" : "OFF THE WALL",
            progress: prog,
          },
          sig:`ody|${s.pose || ""}|${Math.round((s.gaze?.x ?? 0) * 40)}`
             + `|${Math.round((s.gaze?.y ?? 0) * 40)}|${ducking?1:0}${grim?1:0}`,
        });
      },
      /* CTESIPPUS — the host's body used wrong. MIRRORED for the whole scene
         so the ritual and the throw are aimed at the man on the sill, who is
         on his right (note K). */
      ctesippus: () => {
        const p = blk.ctesippus, s = st.ctesippus || {};
        const performing = t >= SEIZE && t < HURL;
        const throwing   = t >= HURL && t < LAUGH;
        const laughing   = t >= LAUGH && t < THREAT + 2;
        const checked    = t >= THREAT + 2;
        place(offctx, W, H, ctesippus, {
          x:p.x, y:p.y, hFrac:K * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          state:{
            t: p.moving ? (t * 0.46) % 4 : breath,
            band:"threeq", mirror:true,
            pose: p.moving ? "walk_neutral" : (s.pose || "moneyed_lounge"),
            gaze: s.gaze || { x:.34, y:-.12 },
            browUp:    checked ? .74 : laughing ? .66 : performing ? .58 : .22,
            browKnit:  checked ? .30 : throwing ? .30 : 0,
            eyeNarrow: laughing ? .52 : throwing ? .30 : .34,
            eyeWide:   checked ? .44 : 0,
            smile:     laughing ? 1 : checked ? .28 : performing ? .62 : .10,
            jaw:       laughing ? .62 : performing ? .26 : .08,
            mouthAsym: checked ? .20 : throwing ? .48 : .62,
            cheek:     performing ? .30 : laughing ? .24 : .08,
            status: checked    ? "THE SPEAR, HE SAYS"
                  : laughing   ? "TAKE THE JOKE"
                  : throwing   ? "HIS GUEST-GIFT"
                  : performing ? "A GIFT FOR THE STRANGER" : "THE OWNER AT MEAT",
            progress: prog,
          },
          sig:`cte|${s.pose || ""}|${Math.round((s.gaze?.x ?? 0) * 40)}`
             + `|${Math.round((s.gaze?.y ?? 0) * 40)}|${throwing?1:0}${laughing?1:0}${checked?1:0}`,
        });
      },
      /* TELEMACHUS — he feeds the beggar, then answers the throw with the
         only threat he makes in the book, then refuses to sell his mother.
         Never mirrored: the thrower is on his left already. */
      telemachus: () => {
        const p = blk.telemachus, s = st.telemachus || {};
        const hosting   = t >= MEAL && t < SEIZE + 2;
        const watching  = t >= SEIZE + 2 && t < THREAT;
        const promising = t >= THREAT && t < AGELAUS;
        const refusing  = t >= REFUSE;
        place(offctx, W, H, telemachus, {
          x:p.x, y:p.y, hFrac:K * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          state:{
            t: p.moving ? (t * 0.40) % 4 : breath,
            band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "lean_forward"),
            gaze: s.gaze || { x:-.30, y:.10 },
            mouth:    promising ? -.30 : hosting ? .45 : refusing ? .20 : -.05,
            browUp:   refusing ? .40 : watching ? .52 : .26,
            browKnit: promising ? .70 : refusing ? .40 : watching ? .34 : .10,
            frown:    promising ? .45 : 0,
            eyeNarrow:promising ? .35 : 0,
            eyeWide:  watching ? .34 : 0,
            jaw:      promising ? .40 : refusing ? .30 : 0,
            status: refusing  ? "HER CHOICE, NOT MINE"
                  : t >= AGELAUS ? "ASK HER, THEN"
                  : promising ? "THE SPEAR NEXT TIME"
                  : watching  ? "WHAT IS IN HIS HAND"
                  : hosting   ? "EAT, STRANGER" : "THE PRINCE AT THE PILLAR",
            progress: prog,
          },
          sig:`tel|${s.pose || ""}|${Math.round((s.gaze?.x ?? 0) * 40)}`
             + `|${Math.round((s.gaze?.y ?? 0) * 40)}|${promising?1:0}${refusing?1:0}${watching?1:0}`,
        });
      },
      /* AMPHINOMUS — the only man in the frame who reads the sky. He is the
         nearest body and he is drawn last. */
      amphinomus: () => {
        const p = blk.amphinomus, s = st.amphinomus || {};
        const reading  = t >= OMEN0 && t < REJECT;
        const speaking = t >= REJECT && t < MEAL;
        const heavy    = t >= MEAL;
        place(offctx, W, H, amphinomus, {
          x:p.x, y:p.y, hFrac:K * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          state:{
            t: p.moving ? (t * 0.44) % 4 : breath,
            band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "three_quarter_left"),
            gaze: s.gaze || { x:-.14, y:.02 },
            browUp:   reading ? .72 : speaking ? .48 : heavy ? .44 : .18,
            browKnit: heavy ? .46 : speaking ? .24 : .16,
            eyeWide:  reading ? .42 : .10,
            frown:    heavy ? .30 : 0,
            jaw:      speaking ? .48 : reading ? .18 : 0,
            blink:    heavy ? .20 : 0,
            status: heavy    ? "A HEAVY HEART"
                  : speaking ? "NOT WHILE THAT IS OVER US"
                  : reading  ? "ON THE LEFT" : "THE PLAN AGAINST THE BOY",
            progress: prog,
          },
          sig:`amp|${s.pose || ""}|${Math.round((s.gaze?.x ?? 0) * 40)}`
             + `|${Math.round((s.gaze?.y ?? 0) * 40)}|${reading?1:0}${speaking?1:0}${heavy?1:0}`,
        });
      },
    };

    const queue = [
      ["odysseus",   blk.odysseus.d,   figures.odysseus],
      ["ctesippus",  blk.ctesippus.d,  figures.ctesippus],
      ["telemachus", blk.telemachus.d, figures.telemachus],
      ["hoof",       hoofDepth,        hoofDraw],
      ["crowd",      0.78,             () => placeCrowd(offctx, W, H, crowdAt(t))],
      ["amphinomus", blk.amphinomus.d, figures.amphinomus],
    ].sort((a, b) => a[1] - b[1]);
    for (const [, , fn] of queue) fn();

    /* --- 4. THE SIGN, called out (note E). One window of the omen, upper
       LEFT, its sky dropped so the plate is paper: the bird is not in this
       room and is not painted in it. --------------------------------------- */
    const pose = omenPoseAt(t);
    if (pose){
      detailField(offctx, W, H, OMEN_DST);
      plate(offctx, W, H, omen, OMEN_CW, OMEN_CH, OMEN_WIN, OMEN_DST,
            { pose, t:breath, layers:OMEN_LAYERS,
              status: pose === "seize" ? "SEIZE" : "ON THE LEFT",
              progress: clamp01(0.30 + 0.60 * ((t - OMEN0) / (OMEN1 - OMEN0))) },
            `omen|${pose}`);
    }

    /* --- 5. THE GUEST-GIFT, called out before it is a weapon. One plate of
       prop.ox-hoof's own `board` state in the upper right, in the gap between
       the omen leaving and the hand taking it, so the frame never carries two
       windows at once. Caliper and numerals cropped (see BOARD_WIN). -------- */
    if (t >= OMEN1 && t < SEIZE){
      legendPlate(offctx, W, H, BOARD_DST, BOARD_WIN,
                  { mode:"board", t:0.5, status:"ON THE BOARD", progress:.10 },
                  "hoof|legend");
    } else if (t >= DROP1){
      legendPlate(offctx, W, H, EVID_DST, EVID_WIN,
                  { mode:"evidence", t:0.5, status:"EVIDENCE", progress:1.0 },
                  "hoof|left-in-the-hall");
    }
  },
};
export default scene;

/* named binding so OD-B20-S05 can `import { exitOccupancy as INITIAL }`.
   S05 plays in this same hall — the vision of the hall of death is laid over
   THIS room — so every station below is a megaron station and it needs no
   translation table at all. */
export const exitOccupancy = scene.exitOccupancy;
