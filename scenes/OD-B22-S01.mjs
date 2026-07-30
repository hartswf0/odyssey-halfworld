/* ============================================================
   SCENE  OD-B22-S01 — Antinous Falls                     (Od. 22.1–64)
   Book XXII, scene 1. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied
   from the reference scene, scenes/OD-B16-S03.mjs, and from its Book XVIII
   and XX siblings, OD-B18-S01 and OD-B20-S03.

   Beats (causal order, one master clock):
     1. Odysseus strips off his rags, leaps onto the threshold, and pours the
        remaining arrows out before his feet.
     2. He shoots Antinous through the throat while the suitor lifts a cup.
     3. Antinous falls across the table, spilling food and wine as the room
        erupts.
     4. The suitors assume an accident and search the walls for weapons that
        are no longer there.
     5. Odysseus names himself and accuses them of consuming his house and
        violating his servants.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM, NOT ROOMS. The atlas casts no location for this scene. It plays in
      the megaron, so the field is location.megaron-hall in state `contest` —
      the room Book XXI leaves behind: doors shut, fire raked flush, floor
      cleared, and the twelve axe helves standing in their trench down the
      spine. It is placed exactly as every other Book XVI+ hall scene places
      it — anchor (.50,.99), scale 1.0 — so this hall registers to the pixel on
      B18-S01's and B20-S03's hall.

      THE STATE DOES NOT ADVANCE TO `battle`, ON PURPOSE. `battle` is authored
      for the general slaughter: lift 1 over the whole room (two ink levels
      down), every bench and board tumbled, arrows in the floor and the litter
      of bodies. At this moment exactly ONE man is down and exactly ONE board
      goes over — his own, which is a separate instance
      (prop.antinouss-cup-and-feast-table) with its own state channel carrying
      laid -> raised -> struck -> spilled -> overturned. Painting the room's
      `battle` wreck here would pre-empt four scenes of killing and would print
      this frame near-black. The eruption is carried by the bodies, the board
      and the ensemble's reaction wave, and the room's own status word.

      THREE LAYERS ARE DROPPED, each for a reason:
        · `furniture` — `contest` shoves the benches and boards OUT to the
          walls (bench stations +/-0.07, table stations +/-0.12 in plan x). The
          one board that matters is back out on the floor and is cast as the
          prop; the room's pushed-back table would print a SECOND board 0.12
          outboard of it and the right-hand floor would read as two tables.
          The ensemble draws its own benches under its own members.
        · `throne` — its near plinth's top face lands at y .79..0.85, which is
          where `axe_last` (.832) and `shot_mark` (.862) put a body. The archer's
          own mark and the near end of the axe line are load-bearing plot this
          scene inherits from Book XXI; the throne is not, and nobody sits on it
          in Book XXII. The axes win.
        · `litter` — `contest` has none anyway. Dropped so the layer list says
          what it means.
      `racks` is KEPT, and it is beat 4: with `arms:false` that layer draws the
      side-wall panels, the two peg rails and the BARE PEGS. Nothing hangs on
      them. The men who search the walls are searching those pegs.

   B. NO HAND-PLACED ANCHORS. Every position resolves through
      scenes/_plans/megaron.mjs by station NAME — the two figures that move,
      the two that do not, the ensemble's box and the board's own footprint.
      Nothing in this file is a hand anchor.

   C. THE CONTACT PAIR: THE MAN AND THE BOARD HE FALLS ACROSS. Antinous holds
      his own place at `bench_r1` (.7495,.7746); the board stands a pace nearer
      the camera and inboard at `table_r` (.7148,.813, resolved with
      kind:"prop"). Two stations, never one, so the body and the furniture it
      goes down over can never land on the same coordinates. The board is
      NEARER than the man, so it is painted after him and takes his shins: he
      is behind his own board, which is where a man at a feast is, and the fall
      is a pose over the near edge rather than a body teleported onto a
      station. The KILLING is not a contact pair at all — it is a shot from
      `threshold` to `bench_r1`, 0.25 of the frame apart, and the arrow itself
      is the prop's own `struck` mark.

   D. ONE BODY, ONE GUISE RAMP, AND NO FLARE. Odysseus is
      character.odysseus-b16 with guise ramping beggar -> restored over t 3..9;
      skin, hair and height interpolate and the garment SNAPS at u=0.5, t=6.
      divine_fx.athenas-restoration is NOT cast, and that is the point: the
      flare exists to cover a discontinuity a god makes. Here the discontinuity
      IS the beat — a man pulling his own rags off — so it is covered by
      MOTION instead. The snap at t=6 lands exactly in the middle of the leap
      (shot_mark -> threshold, t 4..8, midpoint t=6), so the garment changes on
      a body that is crossing the room at speed. Nothing else in the atlas gets
      to do that; it is the only self-performed transformation Odysseus has.

   E. ONE MIRROR, AND ONLY ONE. Odysseus is drawn `mirror:true` for the WHOLE
      scene, never switched. The rig's reaching poses are authored to screen
      LEFT (`reach_forward`, `pointing_arm`, `confrontation` all point -x), and
      every physical act of this scene goes to screen RIGHT: he pours the
      arrows down at his right, and he looses at a man on the right-hand
      benches. He is pure rig with no ctx overpaint, so the mirror is exact.
      The words are NOT mirrored: the accusation is aimed left at the suitors,
      and it is carried by SYMMETRIC poses (`one_arm_raised`, `torso_open`) plus
      an explicit gaze — explicit gaze overrides the pose's own gazeX after the
      mirror is composed, so it is authored in final screen terms.
      Nobody else is mirrored: Antinous sits on the right and faces inboard
      left, Telemachus stands on the left and faces inboard right, and at the
      postern his one pointing pose covers the side door in the LEFT wall.

   F. ROUTES CHECKED, NOT ASSUMED — AND ONE MARK MOVED AFTER LOOKING AT IT.
        · THE ARCHER'S MARK IS NOT A STANDING MARK IN THIS ROOM. The first draft
          opened him on `shot_mark` (.50,.80) — the plan's own "where the archer
          stands to loose" — and leapt the whole length of the spine to the
          sill. Rendered, it is the fixture-fusing bug from the brief's own
          list: the room draws the raked hearth ring at y .70..0.75 and the last
          three axe helves at y .77..0.83, so a body standing anywhere on the
          near spine wears the hearth across its thighs and the helves behind
          its legs, and the leap then crossed both on the way out. The near
          spine belongs to the axe line and to nothing else. He therefore opens
          at the FAR end of the lane, `axe_first` (.50,.28) — one step inside
          the sill, feet just short of the slab's near edge — and the leap is
          the last stride of it, z .28 -> .16, crossing no fixture at all. The
          cost is honest and small: he covers the first of the twelve helves
          (65px, at his feet) for four seconds.
        · ONE BODY ON THE SPINE AT A TIME. `axe_first` and `threshold` are both
          x=.50 and would stack into a totem of heads if both were occupied.
          They never are: they are the two ends of one man's move, and nobody
          else in this scene is on the spine at any time.
        · THE SON IS NEVER IN THE LINE OF FIRE. The shot runs from (.50,.56) to
          (.75,.66). `pillar_r` (.662,.690) sits on that line, so Telemachus is
          kept on the LEFT the whole scene: `pillar_l` (.338,.690) until the
          hall is up, then `postern` (.254,.599) to cover the side door — the
          storeroom passage Melanthius fetches armour through later in this
          book. His route stays at plan z .24..0.44, and the ensemble's two
          ranks sit at y .703 and .842, so he never walks into the crowd and
          never crosses the hearth ring.
        · NOBODY IS COINCIDENT AND NOBODY IS BURIED. Measured at 1120x760:
          the ensemble's near-rank crowns reach y 429 and its far-rank crowns
          y 407, and the group stops at x 336. Telemachus' feet land at 524
          (pillar_l) and 455 (postern) with his body in x 350..408 / 255..313 —
          26px of clear paper between his heel at the postern and the nearest
          crown, and 14px between his body and the crowd at the pillar. Nobody's
          feet are painted over, and no two bodies resolve within a body width
          of each other at any time on the clock.

   G. THE CROWD IS A BOX ON TWO STATIONS. ensemble.suitors is an ALIAS of
      ensemble.the-suitors, which sizes its members in ABSOLUTE pixels (a near
      member is 211px from bench to crown, a far member 127px) and lays them
      out in the FRACTIONS of whatever box it is given. So the box — not a
      member scale — decides where the men land, and the box is set from the
      plan: the near rank takes its x from `corner_dead` (.1232) and its floor
      line from `bench_l2` (.8421), and at the asset's own fixed row separation
      (0.28 of its box height) the far rank lands at y .703, the depth of the
      roof-pillars. Two ranks, two stations, no hand tuning. Pinned in y to
      corner_dead as well — the first draft — the group jammed into the
      bottom-left corner with no floor under it and printed as one dark mass;
      on the bench line there is paper below it and the men are sitting where
      the benches are.
      TWO NEAR MEN AND THREE FAR, NOT FOUR AND THREE: at the authored [4,3] the
      near benches (156px wide, 80px apart) overlap into ONE dark bar 396px
      long across the bottom left, and their legs print as a picket fence.
      [2,3] leaves 84px of paper between the two near benches and breaks the
      bar. Five men stand for a hundred and eight, the same synecdoche
      OD-B18-S01 made with nine.
      THE LEFTMOST NEAR MAN RUNS OFF THE LEFT EDGE, and that is kept: his bench
      is 156px wide and the rank spans 0.58 of its own box, so centring it any
      further inboard walks the far end of the rank into Telemachus at the left
      pillar. The megaron's left bench continues out of shot, and a crowd that
      continues past the frame edge reads as more men than five.
      FOUR LAYERS ARE DROPPED (`backwall`, `floor`, `stranger`, `bgtable`,
      `fgtable`): the first two flood the box with a painted field that would
      stand as an opaque panel over the room, the third paints a second
      doorway with a second cloaked Odysseus in it, and the tables are
      full-width bars across the box.

   H. TONE. The room is in a lift-0 state; the field, the board and the bodies
      are the atlas' light planes with dark accents, and NO ctx overpaint is
      added to any figure — every mark on every body is the shared rig, which
      is what keeps the six Odysseus modules in one family.

   I. THE CUP IS DELIBERATELY OVERSIZED, and it is the asset's decision, not a
      scale error. The board prints at the plan's own scale (0.82m long = 141px
      at this station, against a 288px man = 1.75m), because PROP_CW is chosen
      so that the blit is 1:1. In the source drawing the vessel is drawn at
      roughly twice its metric size relative to the board, so that a two-eared
      gold cup — a plot object, and the thing in his hand when the arrow
      arrives — is legible rather than a 20px smudge. Shrinking the plate to
      fix the cup would put the board below scale, so the cup keeps its
      emphasis.

   CONTINUITY IN — FIRST SCENE OF THE BOOK. There is no OD-B21-Snn to import
   an exitOccupancy from, so opening positions are DECLARED by station name and
   nothing is inherited: Odysseus on the archer's mark he loosed the trial shot
   from, his son a pace out from the left roof-pillar, Antinous in his own place
   at the right-hand bench, the rest of the suitors on the near-left floor, and
   the board on its station in front of Antinous. Every one of those is a
   megaron station, so no translation table is needed.

   Verify (early and late — the leap and the accusation):
     node harness/render-scene.mjs scenes/OD-B22-S01.mjs --t 7
     node harness/render-scene.mjs scenes/OD-B22-S01.mjs --t 52
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01 } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import antinous    from "../assets/character/antinous.mjs";
import suitors     from "../assets/ensemble/suitors.mjs";
import board       from "../assets/prop/antinouss-cup-and-feast-table.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 58;

/* the room Book XXI leaves behind, minus the boards shoved to the walls, minus
   the throne plinth that swallows the near spine, minus a litter this state
   does not have. The bare pegs stay: they are beat 4. (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth","axes"];

/* ---- THE CLOCK ---------------------------------------------------------- */
const STRIP   = 3;    // the rags come off
const LEAP0   = 4;    // he springs for the sill
const LEAP1   = 8;    // and holds it
const POUR    = 11;   // the arrows out of the quiver, at his feet
const LIFT    = 15;   // Antinous raises the two-eared cup
const SHOT    = 19;   // the bowstring
const HIT     = 20;   // through the throat
const FALL    = 22;   // he goes down across the board; the cup is on the floor
const BOARD   = 26;   // his heel takes the table over; food and wine fouled
const TEL0    = 24;   // the son leaves the pillar
const TEL1    = 30;   // and stands in the side door
const SEARCH  = 32;   // they take it for an accident and look for spears
const NAME    = 42;   // "I am Odysseus"
const ACCUSE  = 49;   // you ate my house and you took my women

/* the guise ramp. ONE u, and its snap is put where the body is moving. */
const R0 = STRIP, R1 = 9;
const ramp = t => t <= R0 ? 0 : t >= R1 ? 1 : (t - R0) / (R1 - R0);

/* ---- CONTINUITY IN: declared, first scene of the book -------------------- */
const INITIAL = {
  odysseus:   "axe_first",    // the head of the lane, one step inside the sill
  telemachus: "pillar_l",     // armed, a pace out from the left roof-pillar
  antinous:   "bench_r1",     // his own place on the right-hand benches
  suitors:    "corner_dead",  // the rest of them on the near-left floor
  board:      "table_r",      // his board, back out on the floor in front of him
};

/* ---- BLOCKING. Stations, not coordinates (notes B, F). ------------------- */
const MOVES = [
  // THE LEAP: the last stride of the lane, up onto the sill slab
  { who:"odysseus",   from:"axe_first", to:"threshold", t0:LEAP0, t1:LEAP1 },
  // the son gives up the pillar and covers the side door
  { who:"telemachus", from:"pillar_l",  to:"postern",   t0:TEL0,  t1:TEL1 },
];

/* ---- one figure scale for the whole cast; the plan's depth law does the
   rest, so nobody is hand-tuned bigger than the room allows. ------------- */
const K = 0.42;

/* placeFigure — the rig's floor line is H*0.90 of its own box, so an instance
   placed straight on a station floats 0.10*scale of the frame above it. The
   lift puts FEET on the mark. Verbatim in intent from OD-B20-S03, minus its
   portrait box: every figure in this scene is pure rig with no ctx-drawn
   cloth, so the default landscape box (body H-limited at 0.9*scale) is the
   regime these three modules were authored in. */
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  placeInstance(offctx, W, H, mod, {
    anchor:{ x:anchor.x, y:anchor.y + 0.10 * scale }, scale, state,
  });
}

/* ---- THE BOARD, blitted 1:1 onto its own station ------------------------
   prop.antinouss-cup-and-feast-table is a whole-frame study: the vessel in
   elevation, the board in plan, the mouth in section, calipers and a state
   ledger in the top half, and the object IN THE HALL in the bottom half. Only
   the hall half belongs in the room, so one WINDOW of it is keyed and blitted
   at the board's station — the same device OD-B20-S03 used for the court, minus
   its called-out paper field, because this object is not a called-out detail:
   it is furniture standing on this floor, and the room must show between its
   lines.
   The window keeps everything the beats need and nothing the study owns: the
   board, its legs, the loaf and the roast, the cup in whatever state it is in,
   the arrow that grazes the rim, the pool, the scattered food and the kicked
   ghost of the board. It stops above the ledger and below the divider.
   PROP_CW/PROP_CH are not free: CW is chosen so the 0.82m board prints 141px
   long — its true size against a 288px man at this station — and CH/CW = 1.74
   so that the 0.44m table height prints at the same scale. The blit is then
   1:1 and the drawing keeps its authored proportion. */
const PROP_CW = 289, PROP_CH = 504;
/* the window's LEFT edge is cut at .150 and not at the drawing's own margin:
   the `overturned` state throws a loaf out at x .088, which lands 0.12 of the
   frame away from the board — out on the open floor between the board and the
   hearth, where it printed as a scatter of loose dots with nothing to belong
   to. Cropped there, the fouled food that stays is the roast and the knife by
   the board, the pool, and the heel-impulse arrow under it. */
const PROP_WIN = { x0:.150, y0:.386, x1:.940, y1:.858 };
/* measured in the asset's own frame: the board's ends and its floor line */
const PROP_BOARD = { x0:.185, x1:.672, floor:.808 };

function boardDst(W, H){
  const p  = megaron.at("table_r", { kind:"prop" });
  const ww = (PROP_WIN.x1 - PROP_WIN.x0) * PROP_CW;
  const wh = (PROP_WIN.y1 - PROP_WIN.y0) * PROP_CH;
  const fx = ((PROP_BOARD.x0 + PROP_BOARD.x1) / 2 - PROP_WIN.x0) * PROP_CW / ww;
  const fy = (PROP_BOARD.floor - PROP_WIN.y0) * PROP_CH / wh;
  const x = p.x * W - fx * ww, y = p.y * H - fy * wh;
  return { x, y, w:ww, h:wh, d:p.d };
}
function placeBoard(offctx, W, H, state){
  const dst = boardDst(W, H);
  const cv  = keyedModuleCanvas(board, PROP_CW, PROP_CH, state, `board|${state.mode}`);
  offctx.drawImage(cv,
    PROP_WIN.x0 * PROP_CW, PROP_WIN.y0 * PROP_CH,
    (PROP_WIN.x1 - PROP_WIN.x0) * PROP_CW, (PROP_WIN.y1 - PROP_WIN.y0) * PROP_CH,
    dst.x, dst.y, dst.w, dst.h);
}
const boardModeAt = t =>
    t <  LIFT  ? "laid"
  : t <  SHOT  ? "raised"
  : t <  FALL  ? "struck"
  : t <  BOARD ? "spilled"
  :              "overturned";

/* ---- THE CROWD, a box on two stations (note G) --------------------------- */
const CROWD = { cw:415, ch:380, perRow:[2,3], nearRow:0.86, midX:0.51 };
function placeCrowd(offctx, W, H, state){
  /* x from `corner_dead`, y from `bench_l2`: the rank runs along the left side
     from the near corner in toward the centre, seated on the near bench's own
     floor line. Pinned in y to corner_dead as well (the first draft) the whole
     group jammed into the bottom-left corner and printed as one dark mass with
     no floor under it; on the bench line there is paper below it and the men
     are sitting where the benches are. */
  const x = megaron.at("corner_dead").x * W - CROWD.midX * CROWD.cw;
  const y = megaron.at("bench_l2").y * H - CROWD.nearRow * CROWD.ch;
  const sig = `su|${Math.round((state.attention ?? 0)*20)}`
            + `|${Math.round((state.wave ?? 0)*20)}`
            + `|${Math.round((state.density ?? 1)*20)}`;
  offctx.drawImage(keyedModuleCanvas(suitors, CROWD.cw, CROWD.ch, state, sig), x, y);
}
/* the hall's own reaction, on the master clock: absorbed, then the wave of
   turning heads, then every head at the walls where the spears used to be. */
function crowdAt(t){
  if (t < HIT)    return { attention:0.00, wave:0.00, status:"CAROUSING" };
  if (t < SEARCH) return { attention:0.30, wave:clamp01((t - HIT) / 8),
                           status:"AN ACCIDENT" };
  if (t < NAME)   return { attention:1.00, wave:1.00, status:"NOTHING ON THE PEGS" };
  return                 { attention:1.00, wave:1.00, status:"THEY KNOW HIM" };
}

export const scene = {
  id:"OD-B22-S01",
  title:"Antinous Falls",
  book:22,
  plan:"megaron",
  duration:D,
  beats:[
    "Odysseus strips off his rags, leaps onto the threshold, and pours the remaining arrows out before his feet.",
    "He shoots Antinous through the throat while the suitor lifts a two-eared cup of gold.",
    "Antinous falls across his own table; the cup goes down, the board goes over, food and wine are fouled on the floor.",
    "The suitors take it for an accident and search the walls for weapons that are no longer hanging there.",
    "Odysseus names himself and accuses them of consuming his house and violating his servants.",
  ],
  exitState:
    "The megaron, still in its contest state — doors shut, hearth raked flush, " +
    "floor cleared, the twelve axe helves standing in their trench — with one " +
    "man dead in it. Odysseus holds the great threshold (`threshold`) as " +
    "himself: the rags are off, the guise is `restored`, the bow is in his hand " +
    "and the rest of the arrows are poured out on the sill at his feet. He has " +
    "named himself and laid the charge: they ate his house and forced his " +
    "women. Antinous is down at his own place (`bench_r1`), shot through the " +
    "throat, fallen forward across his board with his eyes shut. His board " +
    "(`table_r`) is OVERTURNED — kicked over by his heel, its top face on edge, " +
    "the two-eared gold cup emptied on the floor beside it, the loaf and the " +
    "roast fouled and the wine spreading; from here it stops being furniture " +
    "and becomes an obstacle in the hall. Telemachus stands armed in the side " +
    "door (`postern`), covering the storeroom passage. The rest of the suitors " +
    "are up off the near-left floor (`corner_dead` / `bench_l1`) with every head " +
    "turned to the walls: the peg rails are bare, there is not a spear or a " +
    "shield in the hall, and the great doors are shut behind the man on the " +
    "sill. Nobody has reached a weapon and nobody has moved on him yet — S02 " +
    "opens from this state.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared box.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.31, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.34,y:.69}, scale:.37, band:"threeq", pose:"three_quarter_right" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.75,y:.77}, scale:.41, band:"threeq", pose:"three_quarter_left" },
    { asset:"prop.antinouss-cup-and-feast-table", instance:"board_01",
      anchor:{x:.71,y:.81}, scale:.23, state:"laid" },
    { asset:"ensemble.suitors", instance:"suitors_01",
      anchor:{x:.12,y:.91}, scale:.37, state:"carousing" },
  ],

  timeline:[
    { op:"actor.pose",  target:"odysseus",   at: 0.0,    args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at: 0.0,    args:{ gaze:{ x:.30, y:.08 } } },
    { op:"actor.pose",  target:"telemachus", at: 0.0,    args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"telemachus", at: 0.0,    args:{ gaze:{ x:.34, y:.10 } } },
    { op:"actor.pose",  target:"antinous",   at: 0.0,    args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"antinous",   at: 0.0,    args:{ gaze:{ x:-.24, y:-.06 } } },
    { op:"prop.state",  target:"board_01",   at: 0.0,    args:{ mode:"laid" } },
    { op:"crowd.state", target:"suitors_01", at: 0.0,    args:{ status:"CAROUSING" } },
    // 1. the rags, the leap, the arrows
    { op:"actor.pose",  target:"odysseus",   at:STRIP,   args:{ pose:"torso_open" } },
    { op:"fx.play",     target:"odysseus",   at:STRIP,   args:{ dir:"strip" } },
    { op:"sound.cue",   target:"odysseus",   at:LEAP0,   args:{ src:"threshold", cue:"the sill under him" } },
    { op:"actor.pose",  target:"odysseus",   at:POUR,    args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:POUR,    args:{ gaze:{ x:.20, y:.44 } } },
    { op:"sound.cue",   target:"odysseus",   at:POUR,    args:{ src:"threshold", cue:"arrows on stone" } },
    // 2. the cup, and the bowstring
    { op:"actor.pose",  target:"antinous",   at:LIFT,    args:{ pose:"palm_up_question" } },
    { op:"actor.gaze",  target:"antinous",   at:LIFT,    args:{ gaze:{ x:-.16, y:-.14 } } },
    { op:"prop.state",  target:"board_01",   at:LIFT,    args:{ mode:"raised" } },
    { op:"actor.pose",  target:"odysseus",   at:SHOT,    args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:SHOT,    args:{ gaze:{ x:.46, y:.10 } } },
    { op:"sound.cue",   target:"odysseus",   at:SHOT,    args:{ src:"threshold", cue:"the string" } },
    { op:"prop.state",  target:"board_01",   at:HIT,     args:{ mode:"struck" } },
    { op:"actor.pose",  target:"antinous",   at:HIT,     args:{ pose:"desperation" } },
    { op:"actor.gaze",  target:"antinous",   at:HIT,     args:{ gaze:{ x:-.10, y:-.30 } } },
    // 3. the fall, and the board
    { op:"actor.pose",  target:"antinous",   at:FALL,    args:{ pose:"crouch" } },
    { op:"actor.gaze",  target:"antinous",   at:FALL,    args:{ gaze:{ x:-.06, y:.52 } } },
    { op:"prop.state",  target:"board_01",   at:FALL,    args:{ mode:"spilled" } },
    { op:"actor.pose",  target:"telemachus", at:FALL,    args:{ pose:"lean_forward" } },
    { op:"crowd.state", target:"suitors_01", at:HIT,     args:{ status:"AN ACCIDENT", wave:0 } },
    { op:"prop.state",  target:"board_01",   at:BOARD,   args:{ mode:"overturned" } },
    { op:"sound.cue",   target:"board_01",   at:BOARD,   args:{ src:"table_r", cue:"the board goes over" } },
    { op:"actor.pose",  target:"telemachus", at:TEL0,    args:{ pose:"walk_neutral" } },
    // 4. the search of a wall with nothing on it
    { op:"actor.pose",  target:"odysseus",   at:SEARCH,  args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at:SEARCH,  args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"crowd.state", target:"suitors_01", at:SEARCH,  args:{ status:"NOTHING ON THE PEGS" } },
    { op:"actor.pose",  target:"telemachus", at:TEL1,    args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at:TEL1,    args:{ gaze:{ x:-.42, y:.04 } } },
    // 5. the name, and the charge
    { op:"actor.pose",  target:"odysseus",   at:NAME,    args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"odysseus",   at:NAME,    args:{ gaze:{ x:-.20, y:-.04 } } },
    { op:"crowd.state", target:"suitors_01", at:NAME,    args:{ status:"THEY KNOW HIM" } },
    { op:"actor.pose",  target:"odysseus",   at:ACCUSE,  args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at:ACCUSE,  args:{ gaze:{ x:-.44, y:.12 } } },
    { op:"timeline.capture", target:"OD-B22-S01", at:56.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st   = stateAt(scene, t);
    const blk  = blockingAt(megaron, MOVES, t, INITIAL);
    const u    = ramp(t);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);   // deterministic idle phase
    const prog = clamp01(0.10 + 0.84 * (t / D));

    /* --- 1. THE HALL. It paints the room; everything else keys onto it. --- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"contest", t:breath, layers:HALL_LAYERS,
        status: t < STRIP  ? "THE AXES ARE SHOT"
              : t < POUR   ? "THE RAGS COME OFF"
              : t < SHOT   ? "THE ARROWS AT HIS FEET"
              : t < SEARCH ? "THE FIRST ARROW"
              : t < NAME   ? "NOTHING ON THE PEGS"
              :              "HE NAMES HIMSELF",
        progress: prog,
      },
    });

    /* --- 2. EVERY OTHER INSTANCE, ordered back to front by its own resolved
       depth, so a farther thing is never painted over a nearer one. ------- */
    const draw = [];

    /* ODYSSEUS — one body. Rags off on a ramp whose snap lands mid-leap; then
       the sill, the poured arrows, the shot, the name and the charge. */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const guise = u <= 0 ? "beggar" : u >= 1 ? "restored"
                  : { from:"beggar", to:"restored", u };
      const changing = u > 0.001 && u < 0.999;
      const pouring  = t >= POUR && t < SHOT;
      const loosing  = t >= SHOT && t < FALL;
      const naming   = t >= NAME && t < ACCUSE;
      const charging = t >= ACCUSE;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.52) % 4 : breath,
            guise, band:"threeq", mirror:true,
            pose: p.moving ? "walk_neutral" : (s.pose || "three_quarter_left"),
            gaze: s.gaze || { x:.30, y:.08 },
            browUp:   charging ? .34 : naming ? .40 : changing ? .30 : .12,
            browKnit: charging ? .58 : loosing ? .46 : .24,
            eyeNarrow:loosing ? .48 : charging ? .34 : .20,
            eyeWide:  naming ? .22 : 0,
            jaw:      charging ? .42 : naming ? .34 : 0,
            mouthAsym:charging ? .40 : loosing ? .28 : .14,
            frown:    charging ? .22 : 0,
            status: charging ? "MY HOUSE, MY WOMEN"
                  : naming   ? "I AM ODYSSEUS"
                  : loosing  ? "THE STRING"
                  : pouring  ? "ARROWS AT MY FEET"
                  : changing ? "THE RAGS COME OFF" : "THE AXES ARE SHOT",
            progress: prog,
          },
        });
      }});
    }

    /* TELEMACHUS — armed beside his father's mark, then in the side door.
       Never mirrored: he stands left of the spine and every pose he is given
       reads inboard, and at the postern the door he covers is to his left. */
    {
      const p = blk.telemachus, s = st.telemachus || {};
      const watching = t >= FALL && t < TEL0;
      const holding  = t >= TEL1;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, telemachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.46) % 4 : breath,
            band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "three_quarter_right"),
            gaze: s.gaze || { x:.34, y:.10 },
            browUp:   watching ? .48 : .26,
            browKnit: holding ? .46 : watching ? .22 : .18,
            eyeWide:  watching ? .40 : .16,
            eyeNarrow:holding ? .34 : 0,
            jaw:      watching ? .26 : 0,
            frown:    holding ? .20 : 0,
            status: holding  ? "THE SIDE DOOR IS MINE"
                  : watching ? "THAT WAS THE FIRST"
                  : t >= SHOT ? "NOW" : "BESIDE HIM",
            progress: prog,
          },
        });
      }});
    }

    /* ANTINOUS — his own place, the cup, the arrow, and down. The rig
       floor-corrects both ankles onto its own floor line, so no body in this
       atlas can be drawn prone; the fall is `crouch` — both knees gone, the
       spine pitched forward over the near edge of his own board, eyes shut
       (blink 1), jaw open. `kneel` was tried first and is worse: it drops the
       whole body a head lower and, at this depth and against an overturned
       board, the man stopped reading as a man and read as part of the wreck.
       The board's own state channel carries everything else. */
    {
      const p = blk.antinous, s = st.antinous || {};
      const lifting = t >= LIFT && t < HIT;
      const struck  = t >= HIT  && t < FALL;
      const dead    = t >= FALL;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, antinous, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq",
            pose: s.pose || "three_quarter_left",
            gaze: s.gaze || { x:-.24, y:-.06 },
            blink:    dead ? 1 : 0,
            browUp:   struck ? .92 : lifting ? .30 : .10,
            browKnit: dead ? .34 : struck ? .18 : .30,
            eyeWide:  struck ? .70 : 0,
            eyeNarrow:dead ? 0 : lifting ? .10 : .30,
            jaw:      dead ? .46 : struck ? .62 : lifting ? .18 : 0,
            frown:    dead ? .50 : struck ? .30 : 0,
            smile:    lifting ? .16 : 0,
            mouthAsym:dead ? 0 : struck ? 0 : .46,
            status: dead    ? "THROUGH THE THROAT"
                  : struck  ? "THE CUP GOES"
                  : lifting ? "A CUP OF GOLD" : "ARROGANT",
            progress: prog,
          },
        });
      }});
    }

    /* THE BOARD — one object with a career, on its own station (note C). */
    {
      const mode = boardModeAt(t);
      draw.push({ d:megaron.at("table_r", { kind:"prop" }).d, run(){
        placeBoard(offctx, W, H, {
          mode, t:0, status:mode.toUpperCase(), progress:prog,
        });
      }});
    }

    /* THE REST OF THE SUITORS — a box on two stations (note G). */
    {
      const c = crowdAt(t);
      draw.push({ d:megaron.at("corner_dead").d, run(){
        placeCrowd(offctx, W, H, {
          ...c, density:1.0, rows:2, perRow:CROWD.perRow,
          layers:["bgrow","fgrow"], t:Math.min(.98, t / D), progress:prog,
        });
      }});
    }

    draw.sort((a, b) => a.d - b.d).forEach(x => x.run());
  },
};
export default scene;

/* named binding so OD-B22-S02 can `import { exitOccupancy as INITIAL }`.
   S02 plays in this same hall and every station below is a megaron station, so
   it needs no translation table — only the men who come in after this. */
export const exitOccupancy = scene.exitOccupancy;
