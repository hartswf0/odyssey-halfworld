/* ============================================================
   SCENE  OD-B20-S05 — The Hall of Death                 (Od. 20.345–394)
   Book XX, scene 5 — the last scene of the book. ADDITIVE: adds nothing to
   Books I–XV, modifies no existing module, casts only assets that already
   exist. Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and
   from its immediate predecessor, scenes/OD-B20-S04.mjs.

   Beats (causal order, one master clock):
     1. Athena stirs the suitors into laughter they cannot stop, and the meat
        they are lifting runs with blood in their sight.
     2. Their faces come apart under it — the laughter holds and the tears run
        underneath it at the same time.
     3. Theoclymenus sees it: darkness coming down over them, the dead
        crowding in, blood on the walls.
     4. He tells them their destruction is already walking toward them, and
        when they laugh at him he walks out of the house.
     5. Telemachus and Odysseus find each other's eyes across the feast, and
        say nothing.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM, NOT ROOMS. One hall: location.megaron-hall in state `feast`,
      placed the way every Book XVI+ hall scene places its field (anchor
      .50/.99, scale 1.0), so this hall registers on B16-S04, B17-S01,
      B18-S01, B19-S02, B20-S03, B20-S04 and B21-S01 to the pixel. The layer
      list is S04's MEAL list verbatim and for S04's two reasons:
        · `racks` DROPPED — Od. 19.1–33, father and son carried every spear
          and shield out of this hall by night; from Book XX there is nothing
          to hang on the walls.
        · `litter` ON for the whole scene — S04 ends with the meal in
          progress and the floor already fouled, and this scene is the same
          meal, ten minutes later. Nothing arrives on the clock here.
      The state stays `feast` (lift 0, the LIGHT room) even though the scene
      is about darkness falling. `night`/`battle`/`aftermath` are lift 1 and
      belong to Book XXII; and the point of Od. 20.345ff is precisely that the
      hall is NOT dark — it is bright, loud and full of food, and the darkness
      is in one man's eyes. Painting the room dark would tell the audience what
      only Theoclymenus can see. TONE: the room is light, the halftone budget
      is spent on four figures, one crowd cutout and one small window; there is
      no full-frame dark plane anywhere in this scene, and the only dark mass in
      the upper half of the frame is the vision plate, which is 0.056 of the
      frame's area and is meant to be the one hard thing in a bright room.

   B. NO HAND-PLACED ANCHORS. Every position resolves through
      scenes/_plans/megaron.mjs by station NAME. The usable-station question
      was settled by B18-S01, B19-S02, B20-S03, B20-S04 and B21-S01 and is not
      re-litigated: bench_l1/l2/r1/r2 and table_l/r paint furniture through a
      standing body, `hearth` is a fire, `throne` is a plinth, and only ONE
      body at a time may stand on the spine (`threshold`, `axe_first`,
      `door_main` are all x=.50 and any two of them occupied stack into a
      totem of heads).

   C. WHERE THE FOUR DRAWN BODIES STAND, AND WHY. This scene reuses S04's
      verified diagram exactly, with the seer stepping into the mark the
      thrower held:
        · ODYSSEUS holds `axe_first` — one pace INSIDE the stone sill, on the
          spine, the stool Telemachus set him at in S04. He does not move in
          this scene and he does not speak in it.
        · TELEMACHUS holds `pillar_r`, the right-hand roof-pillar, where S04
          left him.
        · THEOCLYMENUS takes `pillar_l`, the left-hand roof-pillar. That puts
          the seer and the prince on the two pillars, 0.324 of plan width
          apart at one depth, with the beggar on the spine BEHIND and BETWEEN
          them — the same three-body triangle S04 rendered and verified, which
          is also the diagram of this scene: the man who says what is coming on
          one side, the son who hears it on the other, and the thing itself
          standing in the middle distance in rags.
        · AMPHINOMUS keeps `corner_dead`, the near left, where S04 left him. He
          is the biggest body in the frame (d .90) and he is here to do a job no
          crowd cutout can do: beats 1 and 2 are a FACE — laughter nobody can
          stop, and the tears running under it while it holds — and a keyed
          crowd of lounging young men cannot show a mouth open in a laugh with a
          frown line through it. He is also the right man for it: he is the one
          who stopped the murder plan this morning over a bird (S04), so the god
          taking his face away from him is the sharpest version of the beat in
          this room. Without him the whole left half of the late frame is empty
          floor, which the first pass of this scene proved.

   D. WHO IS CARRIED AND NOT DRAWN, AND THE ONE TRANSLATION.
      S04 ends { odysseus:axe_first, eurycleia:postern, eumaeus:door_main,
      melanthius:door_main, philoetius:door_main, telemachus:pillar_r,
      ctesippus:pillar_l, amphinomus:corner_dead, hoof:door_main }. Nothing is
      dropped from the chain. Five of those nine are carried unchanged and NOT
      drawn: Eurycleia is through the service passage; the three herdsmen are
      at their work at the court mouth; and the ox hoof is still on the floor at
      the foot of the far wall where it was thrown, behind the man it was thrown
      at (S04 had to call it out in a window for exactly that reason, and this
      scene does not need the insult on screen again). None of those marks has a
      drawn body standing on it. Odysseus, Telemachus and Amphinomus are carried
      unchanged AND drawn, on the same three marks S04 left them on.
      ONE TRANSLATION: CTESIPPUS is moved `pillar_l` -> `table_l`, four paces
      to the left-hand board. He is not drawn either — he is in the company,
      in the crowd cutout, laughing with the rest of them. The move is
      continuity, not convenience: S04 ends with his joke checked and the
      prince's promise of a spear on him, the meal still going, and a man whose
      performance has just died sits back down at his cup. It also frees the
      left-hand pillar for the seer, which is the mark this scene needs.

   E. THE VISION, AND THE ONE SUBSTITUTION IN THIS SCENE.
      The atlas asks for `divine-fx.hall-of-death-vision`. IT DOES NOT EXIST —
      it is still an open job in book20/jobs.json — and this scene will not
      invent a divine_fx inside a scene file or import a module that is not
      there. The nearest thing the atlas already owns is
      `divine_fx.murder-feast-memory` (built for OD-B11-S06, Agamemnon's death
      surfacing in the underworld): ONE hall, in low-tone ghost silhouette,
      holding a laid banquet board with reclining guests and a great doorway
      behind it — and over its `transform` channel the cups tip, the guest
      bodies topple one after another, a woman flings her arms out reaching,
      and the doors swing shut. A feast turning into a killing inside a sealed
      hall, on a clock.
      That is this scene's vision almost line for line, and the parallel is
      Homer's own: the suitors' meal and Aegisthus' banquet are the same event
      in the poem's arithmetic, and Book XX is where the second one starts
      being visible. So the plate is not a stand-in for a picture the atlas
      lacks — it is the picture, drawn once for the first murder feast and
      re-used for the second. The named difference, recorded here and in
      selfAssessment rather than papered over: the module's hall is
      MYCENAE, not Ithaca, its fallen are Agamemnon's men and the reaching
      figure is Cassandra, so it is a TYPE of this room's death and not a
      survey of it. When the Ithacan module lands, one import and one window
      swap this scene over.
      It runs on the master clock and it is GONE with the man who sees it:
      `transform` ramps 0.06 -> 0.95 from SEE0 through ANNOUNCE to MOCK, so the
      remembered feast comes apart in the window at the same rate the real one
      does in the room, and nothing is drawn after GONE.
      WHAT IS NOT DRAWN. The vision's other two clauses — the dark coming down
      over them, and blood on the walls — have no module in the atlas that owns
      them, and this scene does not improvise them with scene-level ctx paint.
      They are carried by the seer's body, his status line and the beat list.
      One thing this substitution is NOT: `ensemble.gathering-shades` was
      tried first, composited into the room itself as the dead crowding in, and
      it was CUT after three renders. Its ink levels are robe 1 / wisp 1 /
      skin 2 — and the megaron paints its floor at inkLevel(1) and its walls at
      inkLevel(2). A pale shade standing on a floor of its own exact tone is
      not faint, it is absent: at 170–230px through this dot lattice the whole
      rank printed as scattered speckle and a haze that dulled the bright
      doorway, and raising it against the darker wall only moved the noise.
      Recorded because the next agent will otherwise reach for the same module.

   F. THE VISION IS CALLED OUT, NOT PAINTED INTO THE ROOM. It is one DETAIL
      WINDOW in the upper LEFT — the idiom of B19-S01's arms ledger, B20-S02's
      quern, B20-S03's court and B20-S04's omen — with its own paper field and
      one hard rule, the same device the engine's card uses. Upper LEFT and not
      right because the seer is on the left-hand pillar directly under it, so
      the plate reads as the thing behind his eyes; it hangs above and clear of
      his lifted reading arm and covers no plot geometry.
      A window and not an overlay for the reason in note E: this room's own
      planes are one ink level apart from anything a vision could be drawn in,
      and a plate with its own paper field is the only place in the frame where
      a light-toned hall can be read against something. It also keeps the room
      honest — nobody in the hall except Theoclymenus can see this, and putting
      it in the room would hand it to the audience as a fact about the room.
      SIZE IS DERIVED FROM THE BLIT, NOT EYEBALLED. S04's lesson: a 660px
      canvas blitted into a 125px plate is a 5x downscale, and a module held
      together by absolute-pixel strokes loses its contour and prints as loose
      dots. So the source canvas is computed so the declared window lands
      1:1 — the module is drawn at 336x454, its authored aspect, and the window
      (0.70 by 0.45 of that canvas = 235x204px) is blitted into a plate of
      exactly 235x204 stage pixels. Every stroke lands at the width the module
      asked for. The window keeps the hall, the board, the three toppling
      guests and the closing doors, and crops the empty upper two-thirds of the
      module's canvas and the reaching figure's legs below the board. Nothing
      in it is type: the module draws no numerals and the engine card is off
      (`card:false` inside keyedModuleCanvas).

   G. THE HALL, FULL OF THEM, AND LAUGHING. `ensemble.suitors` — the alias
      module, which re-exports the one canonical `ensemble.the-suitors`
      appearance under the id the atlas asks for here — as a keyed crowd
      cutout, the B18-S01 / B20-S04 / B21-S01 device, never a field. Box,
      density and key are S04's numbers verbatim (x .50 / y .965, 0.76 by 0.36,
      density 0.70, key 0.85) so the near band registers between the two
      scenes: `backwall` and `floor` are dropped because the megaron paints
      this room, both tables are dropped because the hall's own `furniture`
      lays the boards they eat at, and the baked "stranger" figure is dropped
      because it belongs to Book I and would put a second beggar in a scene
      that has the real one on the sill. The key is 0.85 and not the default
      because the ensemble's lightest plane is lum .858 and the dot-law key
      would leave an opaque panel standing in the hall.
      The crowd is the instrument the laughter is played on: `wave` is the
      head-turn that runs down the rows, `attention` is the whole hall's face
      lifting off its cup. It runs: at meat -> Athena's laughter taking them one
      after another -> the meat running red -> laughing and weeping at once ->
      all of them turned on the seer -> mocking him out of the house -> back to
      the meat as if nothing had happened.

   H. THE SEER LEAVES, AND THE CAMERA LOSES HIM BEFORE THE SPINE DOES.
      His route is `pillar_l` -> `door_main`, which is the door he came in by
      and the door he goes out by. In PLAN it runs z .44 -> .10, so it never
      enters the hearth ring (x .395–.605, z .445–.595) and he does not walk
      through the fire. But `door_main` is on the spine at x=.50, and Odysseus
      is standing one station inboard of it at `axe_first`: a body that
      completes that walk ends up 0.078 of frame height BEHIND the beggar's
      head and almost entirely inside his silhouette — two heads fused into a
      totem, which is the failure mode the plan's own note warns about.
      So the walk is blocked in full — he really does reach the doors, and the
      chain records him there — but he is DRAWN only until GONE, one second
      before his projected body would begin to overlap the man on the sill. At
      GONE he is at plan (.332,.338), screen x .397, and his right edge is
      .006 of frame width clear of Odysseus' left edge, walking away, smaller
      and higher than he was. After that the room has no seer in it, which is
      the state the next scene inherits. The last two beats are deliberately
      staged in that order: he goes, and THEN the father and son look at each
      other, in a hall where the only two men who know what is coming are the
      two who are pretending not to.

   I. NOTHING CONVERGES. Only one body moves. At rest the four drawn figures
      sit at screen x .123 (corner_dead), .338 (pillar_l), .500 (axe_first) and
      .662 (pillar_r) — never less than 0.162 of frame width apart, each about
      0.21–0.30 wide in its box and much narrower in the body, so no two
      silhouettes touch. In motion the seer crosses no station any drawn body
      holds: he leaves z .44 immediately and Odysseus is at z .28 on a different
      x for the whole of the walk (checked at GONE, note H); he moves AWAY from
      Amphinomus in both x and z from the first frame of the walk; and the crowd
      cutout is a near-band element at d .78 that he never enters. Amphinomus
      overlaps the crowd cutout's left edge and is drawn AFTER it, because at
      d .90 he is nearer than it is — S04's queue, unchanged.

   J. ONE BODY, ONE GUISE. Odysseus is character.odysseus-b16 with guise
      "beggar" held for the whole scene — no cut to .odysseus-as-beggar (which
      is what the atlas names, and which is this same man in the guise channel)
      and no ramp: he is not restored until Book XXII, so the channel does not
      move here and no divine_fx is cast on him.

   K. NO OVERPAINT, NO MIRRORS, AND EVERY POSE IS A REAL POSE. Zero ctx
      overpaint on any figure and zero scene-level ctx drawing of any kind —
      every mark in this frame is either the hall, a shared-rig figure, the
      crowd cutout or the shade rank. Nobody is mirrored: Theoclymenus' bespoke
      poses aim his lifted right arm and his gaze at POSITIVE x (his own
      anchors put rightHand at .70 and theo_omen carries gazeX +.24), and from
      `pillar_l` positive x is the hall, the company and the far doors — which
      is where he is pointing. Telemachus at `pillar_r` is turned the other way
      by gaze alone.
      Every pose id used here is checked to exist: theo_alert / theo_omen /
      theo_prophesy are registered into the shared registry by
      character.theoclymenus, and every other id is base figure-hero
      (head_lowered, lean_forward, head_left, arms_crossed, three_quarter_left,
      three_quarter_right, hands_near_face, walk_neutral). character.telemachus
      and character.odysseus-b16 ship no bespoke poses of their own, and this
      scene names none of the ctesippus/amphinomus poses S04 could use, because
      it does not import those modules and their ids would silently degrade to
      neutral_front.

   Verified by reading the PNG at five moments — the meal before Athena touches
   it, the faces coming apart, the announcement with the window open, the seer
   going out with his back to the camera, and the two men left with what they
   know:
     node harness/render-scene.mjs scenes/OD-B20-S05.mjs --t 8
     node harness/render-scene.mjs scenes/OD-B20-S05.mjs --t 22
     node harness/render-scene.mjs scenes/OD-B20-S05.mjs --t 38
     node harness/render-scene.mjs scenes/OD-B20-S05.mjs --t 49
     node harness/render-scene.mjs scenes/OD-B20-S05.mjs --t 57
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, lerp, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field        from "../assets/location/megaron-hall.mjs";
import odysseus     from "../assets/character/odysseus-b16.mjs";
import telemachus   from "../assets/character/telemachus.mjs";
import theoclymenus from "../assets/character/theoclymenus.mjs";
import amphinomus   from "../assets/character/amphinomus.mjs";
import vision       from "../assets/divine_fx/murder-feast-memory.mjs";
import suitors      from "../assets/ensemble/suitors.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 62;

/* ---- THE CLOCK ---------------------------------------------------------- */
const LAUGH0   = 5;    // Athena stirs it; the laughter starts taking them
const BLOOD    = 13;   // the meat they are lifting runs with blood
const WEEP     = 20;   // the faces come apart; tears under the laughter
const SEE0     = 25;   // Theoclymenus sees the dark come down
const SEE1     = 31;   // the dead crowd in
const ANNOUNCE = 36;   // "your destruction is already on its way to you"
const MOCK     = 43;   // and they laugh at him
const LEAVE0   = 46;   // he goes
const GONE     = 51;   // last frame the camera keeps him (note H)
const WATCH    = 52;   // father and son find each other
const LEAVE1   = 58;   // he is out through the great doors

/* the room: S04's meal list. `racks` dropped in Book XIX, `litter` on from the
   moment they started eating, which was the scene before this one (note A). */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","postern","maidsdoor",
                     "stair","pillars","lane","hearth","furniture","litter","throne"];

/* ---- CONTINUITY IN (note D) --------------------------------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B20-S04.mjs";
const INITIAL = {
  ...PREV_EXIT,
  ctesippus:    "table_l",   // translated: back to his cup at the left board
  theoclymenus: "pillar_l",  // new to the chain — the guest seer, on his feet
};

/* ---- BLOCKING. Stations, not coordinates (notes B, C, H). ---------------- */
const MOVES = [
  { who:"theoclymenus", from:"pillar_l", to:"door_main", t0:LEAVE0, t1:LEAVE1 },
];

/* ---- THE BOX A BODY IS DRAWN IN (verbatim from OD-B20-S04 / OD-B21-S01) --
   placeInstance() hands a module a box of the STAGE's aspect (1120x760, 1.474
   wide). figure-hero caps the skeleton at min(H*0.9, W*1.26), so body height
   survives a wide box, but every width-relative decoration stretches with W.
   Characters are therefore drawn into the PORTRAIT box the atlas authored them
   in and blitted. FIG_FLOOR is the rig's own floor line: it plants the ankles
   at H*0.90 of its box, so anchoring by the box bottom would hang the body a
   tenth of its height above the mark the plan gave it. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
const K         = 0.52;      // one height for the whole cast; the plan's depth
                             // law does the rest, so nobody is hand-tuned.

/* blit a module into a box of a chosen aspect, anchored by a point INSIDE the
   box. `sig` is required: keyedModuleCanvas caches on pose/band/t only, so
   without it a change of gaze or brow returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* ---- THE VISION PLATE (notes E, F) --------------------------------------
   PLATE — blit one declared WINDOW of a whole-frame drawing, keyed, so the
   plate carries the drawing and none of its frame furniture. `cw`/`ch` is the
   canvas the drawing is made on, chosen so the window lands ~1:1 (note F). */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* A DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses (note F). */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.restore();
}
/* the rule goes on LAST. The plate's blit covers the whole destination rect, so
   a rule struck before it is painted over and the window has no edge. */
function detailRule(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}
/* The module's authored aspect is 1340x1810. Drawn at 336x454 — the same
   aspect — its declared window (x .14–.84, y .33–.78) is 235x204 canvas
   pixels, and the destination plate is 235x204 STAGE pixels: a 1:1 blit, so
   every absolute-pixel stroke in the module lands at its authored width.
   The window keeps the hall, the board, the three guests and the doors, and
   crops the module's empty upper canvas and the reaching figure's legs. */
const VIS_CW = 336, VIS_CH = 454;
const VIS_WIN = { x0:0.140, y0:0.330, x1:0.840, y1:0.780 };
const VIS_DST = { x0:0.034, y0:0.070, x1:0.244, y1:0.339 };
/* `field` is DROPPED, the same move S04 made on the omen's `sky`. drawField()
   lays three FULL-WIDTH horizontal bands across the canvas — air at inkLevel(1)
   and both the back wall and the floor at inkLevel(2) — plus four full-width
   perspective rules. Kept, the window prints as a solid grey panel hung in the
   ceiling of a bright hall, with the plate's own paper field and rule buried
   under it and a horizontal bar striping the frame. Dropped, the plate is PAPER
   with the doorway, the guests, the board and the reaching figure on it: the
   vision reads as a drawing rather than a photograph, which is what it is.
   `doors` supplies its own lit slot and jambs, so nothing is left floating. */
const VIS_LAYERS = ["doors","attacker","guests","table","cassandra"];
/* the vision opens at SEE0 and comes apart on the master clock: a feast, then
   the turn under the announcement, then the sealed ambush under the mockery.
   It goes out of the frame with the man whose eyes it is in. */
const visionAt = t => {
  if (t < SEE0 || t >= GONE) return null;
  const u = clamp01((t - SEE0) / (MOCK - SEE0));
  return {
    layers: VIS_LAYERS,
    transform: lerp(0.06, 0.95, u),
    t: clamp01(u),
    status: t >= MOCK ? "SEALED" : t >= ANNOUNCE ? "TURNING" : "THE SAME FEAST",
    progress: clamp01(0.10 + 0.86 * u),
  };
};

/* ---- THE CROWD (note G) — S04's box, density and key verbatim ------------ */
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
  if (t < LAUGH0)   return { ...base, attention:0.00, wave:0.00,
                             status:"AT MEAT", progress:.10 };
  if (t < BLOOD)    return { ...base, attention:0.10,
                             wave: clamp01((t - LAUGH0) / 7),
                             status:"THE LAUGHTER TAKES THEM", progress:.20 };
  if (t < WEEP)     return { ...base, attention:0.10, wave:1.00,
                             status:"THE MEAT RUNS RED", progress:.32 };
  if (t < SEE0)     return { ...base, attention:0.15, wave:1.00,
                             status:"LAUGHING AND WEEPING", progress:.42 };
  if (t < ANNOUNCE) return { ...base, attention:0.35, wave:1.00,
                             status:"THEY CANNOT STOP", progress:.54 };
  if (t < MOCK)     return { ...base, attention:1.00, wave:1.00,
                             status:"TURNED ON THE SEER", progress:.68 };
  if (t < GONE)     return { ...base, attention:0.85, wave:1.00,
                             status:"MOCKING HIM OUT", progress:.82 };
  return              { ...base, attention:0.05, wave:0.00,
                             status:"BACK TO THE MEAT", progress:.94 };
};

export const scene = {
  id:"OD-B20-S05",
  title:"The Hall of Death",
  book:20,
  plan:"megaron",
  duration:D,
  beats:[
    "Athena stirs the suitors into laughter they cannot stop, and the meat in their hands runs with blood in their sight.",
    "Their faces come apart under it: the laughter holds and the tears run underneath it at once.",
    "Theoclymenus sees the dark coming down over them, the dead crowding into the hall, blood on the walls.",
    "He tells them their destruction is already walking toward them, and none of them will get out of this house.",
    "They laugh at him, and he walks out through the great doors.",
    "Telemachus and Odysseus find each other's eyes across the feast, and say nothing.",
  ],
  exitState:
    "Late in the afternoon of Apollo's feast day, in the megaron, the same meal " +
    "still going: high fire, laden boards, litter on the floor, the great doors " +
    "open, the walls bare of arms since Book XIX, the ox hoof still lying at the " +
    "foot of the far wall by the doors (`door_main`) where it was thrown. The " +
    "portent has come and gone and changed nothing anyone in the company will " +
    "admit to. Odysseus, still the beggar, has not moved from his stool inside " +
    "the stone threshold (`axe_first`) and has not said one word in this scene; " +
    "Telemachus holds the right-hand roof-pillar (`pillar_r`). The last thing " +
    "that happens is that the two of them look at each other across the hall and " +
    "keep their faces shut — the recognition of Book XVI held in the open, in " +
    "front of everybody, and unspoken. Theoclymenus is OUT: he read the hall, " +
    "announced their destruction, was laughed at, and walked through the great " +
    "doors (`door_main`, this hall's off-stage mark); he does not come back into " +
    "the poem, and the next scene should drop him from the chain. Ctesippus is " +
    "at the left-hand board (`table_l`), laughing with the rest; Amphinomus " +
    "keeps the near-left corner (`corner_dead`) with the morning's omen still on " +
    "him; Eumaeus, Melanthius and Philoetius are at their work at the court " +
    "mouth (`door_main`); Eurycleia is through the service passage (`postern`). " +
    "The vision is gone with the man who had it. Book XXI opens on this hall, " +
    "this company and these two men.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    theoclymenus:"already in the hall as a guest of the house; holds `pillar_l` " +
                 "from t=0 (translated into the chain there, note D)",
    odysseus:"already on his stool at `axe_first` since S04; no entrance",
    telemachus:"already at `pillar_r` since S04; no entrance",
    amphinomus:"already at `corner_dead` since S04; no entrance",
    suitors:"the company is in the hall for the whole scene — a crowd cutout, never blocked",
    vision:"not an entrance and not a body in this room: a called-out VISION " +
           "WINDOW, upper left, from SEE0=25, seen by one man and gone with him " +
           "at GONE=51",
  },
  exits:{
    theoclymenus:"walks out by the great doors, `pillar_l` -> `door_main`, " +
                 "LEAVE0=46 -> LEAVE1=58; last drawn at GONE=51 (note H). " +
                 "He is out of the house and out of the poem.",
    odysseus:"none — he holds `axe_first` into Book XXI",
    telemachus:"none — he holds `pillar_r` into Book XXI",
    amphinomus:"none — he holds `corner_dead` into Book XXI",
    vision:"gone at GONE=51, with the eyes that saw it",
  },
  walkable:"the megaron's walkable band, minus the hearth ring (plan x .395–" +
           ".605, z .445–.595), minus the bench and table stations, which paint " +
           "furniture through a standing body, and minus the spine " +
           "(`threshold`, `axe_first`, `door_main`) while the beggar's stool is " +
           "occupied — the seer's exit is the one thing that crosses it, and the " +
           "camera lets him go before he reaches it.",
  depthOrder:"one queue, sorted by the plan's own z: the room, then the living " +
             "sorted by depth — Theoclymenus (z .44, dropping to .10 as he " +
             "leaves, so he passes BEHIND the beggar), Odysseus (z .28), " +
             "Telemachus (z .44) — then the crowd cutout at d .78, then " +
             "Amphinomus (z .90), the nearest body in the frame, drawn last of " +
             "the living; and on top of the picture, outside its depth " +
             "entirely, the vision window.",
  gazeTargets:{
    theoclymenus:"the company while the laughter is only wrong, then UP as the " +
                 "dark comes down, then level across the hall at the dead " +
                 "standing in it, then the men he is telling, then the floor as " +
                 "he turns for the door",
    telemachus:"the laughing hall, then LEFT onto the seer for the whole " +
               "prophecy, then across and up onto his father at `axe_first` for " +
               "the last beat",
    odysseus:"the floor and his own hands for most of it — a beggar does not " +
             "look up at a table — then up and left at the seer, then down " +
             "again under the mockery, then RIGHT and level onto his son",
    amphinomus:"the man across from him as the laughter starts, then DOWN at " +
               "the joint in his own hand when it runs red, then nowhere at all " +
               "while his face works, then UP and RIGHT at the seer for the " +
               "mockery, then down again",
    suitors:"their cups, then each other as the laughter runs down the rows, " +
            "then the meat in their hands, then all of them onto the seer, then " +
            "their cups again",
    vision:"the plate has no gaze of its own; it is what Theoclymenus is " +
           "looking at when his eyes come off the room",
  },
  attachments:[
    { at:SEE0, who:"vision", change:"divine_fx.murder-feast-memory opens in the " +
      "upper-left window at transform 0.06 — the standing substitution for " +
      "divine-fx.hall-of-death-vision (note E)" },
    { at:ANNOUNCE, who:"vision", change:"transform through ~0.55: the cups tip " +
      "and the first bodies go down as he says it out loud" },
    { at:MOCK, who:"vision", change:"transform 0.95 — the doors shut, the hall " +
      "in the window is sealed with everybody in it" },
    { at:ANNOUNCE, who:"theoclymenus", change:"pose theo_omen -> theo_prophesy: " +
      "the reading arm comes down and forward, the jaw opens on the declaration" },
    { at:LEAVE0, who:"theoclymenus", change:"detaches from `pillar_l`; walk_neutral " +
      "on the plan line pillar_l -> door_main" },
    { at:GONE, who:"theoclymenus", change:"no longer drawn; the chain carries him " +
      "to `door_main` and out (note H)" },
    { at:GONE, who:"vision", change:"the window closes with him" },
  ],
  sound:[
    { at:0,        source:"table_l",  cue:"a hall eating: boards, cups, forty men talking" },
    { at:WEEP,     source:"corner_dead", cue:"one man laughing and crying at the same time, close to the camera" },
    { at:LAUGH0,   source:"hearth",   cue:"the laughter starting in the wrong place and not stopping" },
    { at:BLOOD,    source:"table_r",  cue:"one man's cup going down on the board too hard" },
    { at:WEEP,     source:"table_l",  cue:"laughter with crying inside it, all through the room" },
    { at:SEE0,     source:"pillar_l", cue:"one voice under the noise: the seer, to nobody, naming what he sees" },
    { at:ANNOUNCE, source:"pillar_l", cue:"Theoclymenus, loud, over the whole hall: none of you will get out of this house" },
    { at:MOCK,     source:"table_r",  cue:"the hall laughing at him — a chair going back, somebody offering him the door" },
    { at:LEAVE0,   source:"door_main",cue:"one man's footsteps leaving a room that is still laughing" },
    { at:WATCH,    source:"axe_first",cue:"nothing: two men not speaking, under the noise of the feast" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared box.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"divine-fx.murder-feast-memory", instance:"vision_01",
      anchor:{x:.139,y:.339}, scale:.21, state:"turning" },
    { asset:"character.theoclymenus", instance:"theoclymenus",
      anchor:{x:.34,y:.69}, scale:.46, band:"threeq", pose:"theo_alert" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.62}, scale:.42, band:"threeq", pose:"head_lowered" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.66,y:.69}, scale:.46, band:"threeq", pose:"lean_forward" },
    { asset:"ensemble.suitors", instance:"suitors_01",
      anchor:{x:.50,y:.965}, scale:.86, blend:"multiply" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.12,y:.91}, scale:.59, band:"threeq", pose:"three_quarter_left" },
  ],

  timeline:[
    { op:"actor.pose", target:"theoclymenus", at:0.0,      args:{ pose:"theo_alert" } },
    { op:"actor.gaze", target:"theoclymenus", at:0.0,      args:{ gaze:{ x:.36, y:.06 } } },
    { op:"actor.pose", target:"odysseus",     at:0.0,      args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus",     at:0.0,      args:{ gaze:{ x:-.16, y:.36 } } },
    { op:"actor.pose", target:"telemachus",   at:0.0,      args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus",   at:0.0,      args:{ gaze:{ x:-.24, y:.14 } } },
    { op:"actor.pose", target:"amphinomus",   at:0.0,      args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"amphinomus",   at:0.0,      args:{ gaze:{ x:.22, y:.08 } } },
    // 1. Athena's laughter, and the meat
    { op:"actor.gaze", target:"theoclymenus", at:LAUGH0,   args:{ gaze:{ x:.44, y:.02 } } },
    { op:"actor.gaze", target:"telemachus",   at:LAUGH0,   args:{ gaze:{ x:-.10, y:.10 } } },
    { op:"actor.pose", target:"amphinomus",   at:LAUGH0,   args:{ pose:"laughter" } },
    { op:"actor.gaze", target:"amphinomus",   at:LAUGH0,   args:{ gaze:{ x:.30, y:-.06 } } },
    { op:"actor.gaze", target:"odysseus",     at:BLOOD,    args:{ gaze:{ x:.20, y:.28 } } },
    { op:"actor.gaze", target:"amphinomus",   at:BLOOD,    args:{ gaze:{ x:.12, y:.42 } } },
    // 2. the faces come apart
    { op:"actor.pose", target:"theoclymenus", at:WEEP,     args:{ pose:"theo_alert" } },
    { op:"actor.gaze", target:"theoclymenus", at:WEEP,     args:{ gaze:{ x:.40, y:.14 } } },
    { op:"actor.gaze", target:"amphinomus",   at:WEEP,     args:{ gaze:{ x:-.06, y:.16 } } },
    { op:"actor.pose", target:"telemachus",   at:WEEP,     args:{ pose:"head_left" } },
    { op:"actor.gaze", target:"telemachus",   at:WEEP,     args:{ gaze:{ x:-.34, y:.06 } } },
    // 3. the vision
    { op:"fx.play",    target:"vision_01",    at:SEE0,     args:{ dir:"turn" } },
    { op:"actor.pose", target:"theoclymenus", at:SEE0,     args:{ pose:"theo_omen" } },
    { op:"actor.gaze", target:"theoclymenus", at:SEE0,     args:{ gaze:{ x:.26, y:-.52 } } },
    { op:"actor.pose", target:"telemachus",   at:SEE0,     args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus",   at:SEE0,     args:{ gaze:{ x:-.46, y:-.04 } } },
    { op:"actor.gaze", target:"theoclymenus", at:SEE1,     args:{ gaze:{ x:.46, y:-.12 } } },
    { op:"actor.gaze", target:"odysseus",     at:SEE1,     args:{ gaze:{ x:-.40, y:-.14 } } },
    // 4. the announcement
    { op:"actor.pose", target:"theoclymenus", at:ANNOUNCE, args:{ pose:"theo_prophesy" } },
    { op:"actor.gaze", target:"theoclymenus", at:ANNOUNCE, args:{ gaze:{ x:.50, y:-.04 } } },
    { op:"actor.pose", target:"odysseus",     at:ANNOUNCE, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus",     at:ANNOUNCE, args:{ gaze:{ x:-.34, y:-.06 } } },
    // 5. the mockery, and he goes
    { op:"actor.pose", target:"theoclymenus", at:MOCK,     args:{ pose:"theo_alert" } },
    { op:"actor.gaze", target:"theoclymenus", at:MOCK,     args:{ gaze:{ x:.22, y:.22 } } },
    { op:"actor.gaze", target:"amphinomus",   at:ANNOUNCE, args:{ gaze:{ x:.36, y:-.24 } } },
    { op:"actor.pose", target:"telemachus",   at:MOCK,     args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"telemachus",   at:MOCK,     args:{ gaze:{ x:-.40, y:.04 } } },
    { op:"actor.pose", target:"odysseus",     at:MOCK,     args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"odysseus",     at:MOCK,     args:{ gaze:{ x:-.10, y:.34 } } },
    // 6. the two of them, across the feast
    { op:"actor.pose", target:"odysseus",     at:WATCH,    args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"odysseus",     at:WATCH,    args:{ gaze:{ x:.30, y:.12 } } },
    { op:"actor.pose", target:"amphinomus",   at:WATCH,    args:{ pose:"uneasy_reserve" } },
    { op:"actor.gaze", target:"amphinomus",   at:WATCH,    args:{ gaze:{ x:-.18, y:.30 } } },
    { op:"actor.pose", target:"telemachus",   at:WATCH,    args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"telemachus",   at:WATCH,    args:{ gaze:{ x:-.30, y:-.10 } } },
    { op:"timeline.capture", target:"OD-B20-S05", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.10 + 0.86 * (t / D));

    /* --- 1. THE HALL. It paints the room; everything else keys onto it. --- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"feast", t:breath, layers:HALL_LAYERS,
        status: t >= GONE     ? "AS IF NOTHING HAD HAPPENED"
              : t >= MOCK     ? "THEY LAUGH HIM OUT"
              : t >= ANNOUNCE ? "THE SEER SPEAKS"
              : t >= SEE0     ? "THE HALL OF DEATH"
              : t >= LAUGH0   ? "LAUGHTER THEY CANNOT STOP" : "MISRULE AT MEAT",
        progress: prog,
      },
    });

    /* --- 2. THE FOUR BODIES + the crowd, one queue sorted by the plan's own
       depth so a farther thing is never painted over a nearer one. No ctx
       overpaint on any figure, nobody mirrored (note K). ------------------- */
    const figures = {
      /* THEOCLYMENUS — the only man in the hall who says what the room is.
         Reads it, names it, is laughed at, and walks out of the poem. */
      theoclymenus: () => {
        const p = blk.theoclymenus, s = st.theoclymenus || {};
        const seeing    = t >= SEE0 && t < ANNOUNCE;
        const declaring = t >= ANNOUNCE && t < MOCK;
        const mocked    = t >= MOCK;
        place(offctx, W, H, theoclymenus, {
          x:p.x, y:p.y, hFrac:K * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          state:{
            t: p.moving ? (t * 0.44) % 4 : breath,
            band:"threeq",
            /* leaving, he is drawn `back_view`: a front-facing walk cycle at
               this size reads as a man crossing the room toward the camera,
               which is the opposite of what he is doing. */
            pose: p.moving ? "back_view" : (s.pose || "theo_alert"),
            gaze: s.gaze || { x:.36, y:.06 },
            browUp:    seeing ? .78 : declaring ? .60 : mocked ? .46 : .30,
            browKnit:  seeing ? .46 : declaring ? .52 : mocked ? .58 : .22,
            eyeWide:   seeing ? .62 : declaring ? .34 : 0,
            eyeNarrow: mocked ? .40 : 0,
            frown:     mocked ? .48 : seeing ? .16 : 0,
            jaw:       declaring ? .58 : seeing ? .30 : 0,
            mouthAsym: mocked ? .34 : .10,
            status: p.moving   ? "OUT OF THIS HOUSE"
                  : mocked     ? "LAUGHED AT"
                  : declaring  ? "IT IS ALREADY COMING"
                  : seeing     ? "BLOOD ON THE WALLS" : "SOMETHING IS WRONG HERE",
            progress: prog,
          },
          sig:`theo|${s.pose || ""}|${Math.round((s.gaze?.x ?? 0) * 40)}`
             + `|${Math.round((s.gaze?.y ?? 0) * 40)}`
             + `|${seeing?1:0}${declaring?1:0}${mocked?1:0}${p.moving?1:0}`,
        });
      },
      /* ODYSSEUS — one body, guise "beggar" held. He sits through all of it,
         says nothing, and looks up exactly twice: once at the seer, once at
         his son. */
      odysseus: () => {
        const p = blk.odysseus, s = st.odysseus || {};
        const listening = t >= SEE1 && t < MOCK;
        const hiding    = t >= MOCK && t < WATCH;
        const watching  = t >= WATCH;
        place(offctx, W, H, odysseus, {
          x:p.x, y:p.y, hFrac:K * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          state:{
            t:breath, guise:"beggar", band:"threeq",
            pose: s.pose || "head_lowered",
            gaze: s.gaze || { x:-.16, y:.36 },
            browUp:    listening ? .34 : .10,
            browKnit:  watching ? .40 : listening ? .38 : .24,
            eyeNarrow: watching ? .50 : listening ? .26 : .18,
            frown:     hiding ? .30 : 0,
            mouthAsym: watching ? .62 : .16,
            smile:     watching ? .14 : 0,
            jaw:       0,
            status: watching  ? "HE KNOWS I KNOW"
                  : hiding    ? "A BEGGAR EATS"
                  : listening ? "EVERY WORD OF IT" : "SAYING NOTHING",
            progress: prog,
          },
          sig:`ody|${s.pose || ""}|${Math.round((s.gaze?.x ?? 0) * 40)}`
             + `|${Math.round((s.gaze?.y ?? 0) * 40)}`
             + `|${listening?1:0}${hiding?1:0}${watching?1:0}`,
        });
      },
      /* TELEMACHUS — he is the only other man who can hear the prophecy as
         information. He does not laugh, and at the end he looks at his father
         and keeps his face shut. */
      telemachus: () => {
        const p = blk.telemachus, s = st.telemachus || {};
        const uneasy   = t >= WEEP && t < SEE0;
        const hearing  = t >= SEE0 && t < MOCK;
        const apart    = t >= MOCK && t < WATCH;
        const watching = t >= WATCH;
        place(offctx, W, H, telemachus, {
          x:p.x, y:p.y, hFrac:K * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          state:{
            t:breath, band:"threeq",
            pose: s.pose || "lean_forward",
            gaze: s.gaze || { x:-.24, y:.14 },
            mouth:    watching ? -.10 : uneasy ? -.20 : .05,
            browUp:   hearing ? .54 : uneasy ? .40 : .24,
            browKnit: watching ? .46 : apart ? .40 : hearing ? .30 : .12,
            eyeWide:  hearing ? .36 : 0,
            eyeNarrow:watching ? .34 : 0,
            frown:    apart ? .34 : 0,
            jaw:      0,
            status: watching ? "NOT A WORD"
                  : apart    ? "HE IS NOT LAUGHING"
                  : hearing  ? "THE SEER IS RIGHT"
                  : uneasy   ? "SOMETHING IS WRONG WITH THEM" : "THE PRINCE AT THE PILLAR",
            progress: prog,
          },
          sig:`tel|${s.pose || ""}|${Math.round((s.gaze?.x ?? 0) * 40)}`
             + `|${Math.round((s.gaze?.y ?? 0) * 40)}`
             + `|${uneasy?1:0}${hearing?1:0}${apart?1:0}${watching?1:0}`,
        });
      },
      /* AMPHINOMUS — the nearest body in the frame, and the face beats 1 and 2
         are actually made of: the laugh Athena puts in him, and the tears that
         come up under it while the laugh is still holding. He is drawn last of
         the living because at z .90 he is in front of everything. */
      amphinomus: () => {
        const p = blk.amphinomus, s = st.amphinomus || {};
        const laughing = t >= LAUGH0 && t < WEEP;
        const bleeding = t >= BLOOD && t < WEEP;
        const coming   = t >= WEEP && t < MOCK;
        const mocking  = t >= MOCK && t < WATCH;
        const heavy    = t >= WATCH;
        place(offctx, W, H, amphinomus, {
          x:p.x, y:p.y, hFrac:K * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          state:{
            t:breath, band:"threeq",
            pose: s.pose || "three_quarter_left",
            gaze: s.gaze || { x:.22, y:.08 },
            /* the whole beat is in this stack: the smile and the jaw never come
               down once Athena has them, and the brow, the knit and the frown
               climb underneath the laugh instead of replacing it. */
            smile:     heavy ? 0 : mocking ? .92 : coming ? 1 : laughing ? .88 : .10,
            jaw:       heavy ? 0 : mocking ? .70 : coming ? .74 : laughing ? .66 : .06,
            browUp:    coming ? .80 : mocking ? .62 : laughing ? .54 : heavy ? .46 : .18,
            browKnit:  coming ? .72 : heavy ? .52 : bleeding ? .40 : .10,
            frown:     coming ? .62 : heavy ? .34 : 0,
            eyeNarrow: coming ? .58 : mocking ? .44 : laughing ? .36 : .12,
            eyeWide:   bleeding && !coming ? .34 : 0,
            mouthAsym: coming ? .58 : mocking ? .30 : .12,
            blink:     coming ? .30 : 0,
            status: heavy   ? "A HEAVY HEART"
                  : mocking ? "LAUGHING HIM OUT"
                  : coming  ? "CRYING AND LAUGHING"
                  : bleeding? "BLOOD ON THE JOINT"
                  : laughing? "HE CANNOT STOP" : "AT MEAT",
            progress: prog,
          },
          sig:`amp|${s.pose || ""}|${Math.round((s.gaze?.x ?? 0) * 40)}`
             + `|${Math.round((s.gaze?.y ?? 0) * 40)}`
             + `|${laughing?1:0}${bleeding?1:0}${coming?1:0}${mocking?1:0}${heavy?1:0}`,
        });
      },
    };

    const queue = [
      ["odysseus",   blk.odysseus.d,   figures.odysseus],
      ["telemachus", blk.telemachus.d, figures.telemachus],
      ["crowd",      0.78,             () => placeCrowd(offctx, W, H, crowdAt(t))],
      ["amphinomus", blk.amphinomus.d, figures.amphinomus],
    ];
    /* the seer is drawn only while the camera can keep him clear of the spine
       (note H); the chain carries him to `door_main` regardless. */
    if (t < GONE) queue.push(["theoclymenus", blk.theoclymenus.d, figures.theoclymenus]);
    queue.sort((a, b) => a[1] - b[1]);
    for (const [, , fn] of queue) fn();

    /* --- 3. THE VISION, called out (notes E, F). One window of the murder
       feast in the upper LEFT, over the seer's own pillar, on the same clock
       as the room: nobody in the hall but him can see it. ------------------ */
    const vis = visionAt(t);
    if (vis){
      detailField(offctx, W, H, VIS_DST);
      plate(offctx, W, H, vision, VIS_CW, VIS_CH, VIS_WIN, VIS_DST, vis,
            `vision|${Math.round(vis.transform * 40)}`);
      detailRule(offctx, W, H, VIS_DST);
    }
  },
};
export default scene;

/* named binding so OD-B21-S01 can `import { exitOccupancy as INITIAL }`.
   Book XXI plays in this same hall, so every station here is a megaron station
   and needs no translation table — but `theoclymenus` should be DROPPED from
   the chain by whoever picks it up: he is out through the great doors and out
   of the poem. */
export const exitOccupancy = scene.exitOccupancy;
