/* ============================================================
   SCENE  OD-B22-S03 — The Storeroom Arms the Defenders   (Od. 22.99–125)
   Book XXII, scene 3. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied
   from the reference scene, scenes/OD-B16-S03.mjs, and from its two
   predecessors, scenes/OD-B22-S01.mjs and scenes/OD-B22-S02.mjs.

   Beats (causal order, one master clock):
     1. Telemachus runs up the postern lane to the storeroom and brings back
        four shields, four helmets and eight spears — one set each for
        Odysseus, himself, Eumaeus and Philoetius.
     2. He admits he left the storeroom door unbarred after that one trip.
     3. The four arm in formation across the near end of the hall while
        Odysseus keeps loosing from the sill.
     4. The arrows run low; the bow goes against the doorpost and the fight
        becomes spears.

   All pixel figures below are in the stage's own 1120x760 space (renderScene
   hands stage() srcW=1120, srcH=760 and the PNG is that at DPR 2), and every
   one of them was MEASURED off a render of OD-B22-S02, not estimated.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM, NOT ROOMS. The atlas casts no location for this scene. It plays in
      the megaron, so the field is location.megaron-hall in state `contest`,
      anchor (.50,.99) scale 1.0, with the SAME layer list S01 and S02 used —
      so this hall registers to the pixel on both of them and the three shots
      cut together. THE STATE STILL DOES NOT ADVANCE TO `battle`. `battle`
      lifts the whole room one ink level, tumbles every board and lays the
      litter of bodies over the floor; it is the general slaughter, which is
      S05 onward. Here the escalation is carried by what the four men are
      holding, by the near-floor ISSUE register, by the plan windows and by
      the room's own status word. `furniture`, `throne` and `litter` stay
      dropped for the reasons S01 gives; `racks` stays kept and the pegs are
      still bare, which is the whole reason Telemachus has to run.

   B. NO HAND-PLACED ANCHORS. Every body resolves through
      scenes/_plans/megaron.mjs by station NAME. The one man who moves does it
      between three named stations; the five who do not hold theirs; the
      herdsmen's box and both inherited props' footprints are keyed off
      stations too. There is not one hand anchor on a figure in this file.

   C. THE RUN IS THE SCENE'S ONLY BLOCKING, AND IT USES THE TWO STATIONS THE
      PLAN AUTHORED FOR IT. `postern` (x .254, feet y .599) is the side door
      Telemachus took in S01 and held through S02; `storeroom` (x .215, feet
      y .625) is the arms, up that lane. He goes postern -> storeroom -> back
      to postern and does not leave it again: covering that lane is plot he
      inherits, and the door he leaves open behind him is what lets Melanthius
      up it in S04. Measured, his body at `storeroom` spans x 213..269 against
      the wrecked dining boards at x 241..494 — the boards are at d=.70 and he
      is at d=.30, so they are painted over his shins and he reads as passing
      BEHIND the wreck on his way to the door. That is the only overlap any
      figure in this frame has, and it is an occlusion, not a fusion.

   D. THE FOUR-MAN LINE IS A SHALLOW ARC, MEASURED, NOT A ROW.
        · Odysseus holds `threshold` (x .500, feet y .563), body ink 526..605.
          He never leaves the sill — at 22.120 he leans the bow against the
          doorpost and stands there, so the station does not change all scene.
        · Telemachus holds `postern` (x .254, feet .599), ink 244..324.
        · Eumaeus and Philoetius come on at `axe_first` (x .500, feet .468) as
          ONE ensemble box (note E): the swineherd lands at x 436..504 and the
          cowherd at x 616..684.
      So across the near end of the room, left to right: 244..324 (son),
      436..504 (swineherd), 526..605 (king), 616..684 (cowherd) — four bodies,
      three clear gaps of 112, 22 and 11 pixels, and nobody coincident. The
      herdsmen stand 40px NEARER the camera than the king on the sill, which
      is the shallow forward arc set_piece.battle-threshold-formation draws in
      plan. Against the corpses S02 left on the floor: the swineherd clears
      Amphinomus (333..424) by 12px and the cowherd clears Eurymachus
      (696..787) by 12px, and both stand a whole depth band away from them.

   E. THE HERDSMEN ARE AN ENSEMBLE BOX, SIZED BY THE PLAN'S OWN DEPTH LAW.
      ensemble.eumaeus-and-philoetius sizes its members in fractions of its own
      box, so the box height is SOLVED rather than chosen: ch is the height at
      which BAND.front.s (0.585) equals the figure height the plan gives at
      `axe_first` — 0.752*H*K*p.scale, the same product every other body in
      this file is drawn at. At z=.28 that is ch=328, cw=483, and the two men
      print 193px tall against Odysseus' 176px and Telemachus' 186px: one
      ground plane, four men, no second scale.
        · `density` and `background` are 0. The rear rank of household men
          would land inside the drawn doorway (x 448..672, y 195..370) at 59px
          tall — dark on dark, and they are not in the poem's line anyway.
          The scene wants the two men Homer names, and only those.
        · `showShell` is false: the megaron is the room, and the ensemble's own
          floor runs and column stubs would print a second architecture 0.2 of
          a frame wide across the doorway.
        · `foreground` is 0. Its cropped near shield rim is authored for the
          frame EDGE; inside a 483px box it is a level-2 disc in mid-air.
        · The arming channel is the whole point of casting this asset here:
          ONE `arming` number ramps 0.24 -> 1.0 across the issue, and the
          roster's stagger walks each man through farm kit -> helmet in the
          fist -> the snap -> shield up. The swineherd is a soldier while the
          cowherd still has his helmet in his hand. That IS beat 3, and it is
          drawn by the asset, not by a pose cut.

   F. NEITHER SHEET CAN BE A THING IN THE ROOM, AND BOTH ARE WINDOWS.
      prop.defender-armor-set and set_piece.battle-threshold-formation are both
      authored as whole-frame plates whose legibility is pinned to their own
      canvas height: the formation's station numerals are 0.044 of H and the
      armour set's are 0.058 of H, so shrinking either one to a floor object
      dissolves every numeral it owns — exactly the failure the brief warns
      about. Solved as objects standing in this room they are worse still:
      one bay of the armour set at true physical scale (a 0.92m shield, a
      2.15m spear) is 160x238, and after S02 the only clear paper in the
      frame is the near band y 661..750 and two corner patches of far wall.
      So both are laid down the way OD-B21-S02 lays down its alignment
      windows: as DETAIL WINDOWS, each with its own paper field and one hard
      rule, blitted at a declared crop and drawn last. A window is a window;
      it does not pretend to stand on the floor, and the room cannot run
      through its lines.
        · THE ISSUE REGISTER (armour set, near band, 1:1). Window = the
          eight-notch spear ledger, x .137..0.863, y .856..0.940 of an 820x556
          drawing: 595x46, laid at 1:1 into x 263..858, y 667..714 — the one
          strip of near floor S02 leaves empty, clear of the wrecked boards
          (bottom 618), of Antinous' board (bottom 644), of the crowd (right
          edge 271 at d=.90) and of the engine's card rule (.965). The header
          count, the four bays and the bearer pips are cropped out on purpose:
          the panoplies themselves are on the men, drawn by the ensemble's
          arming channel and by the two principals' poses, and what the near
          floor carries is the COUNT — eight shafts, filled while they are in
          hand, two hollow when the first two are thrown at THROW. Its mode
          walks carry -> equip -> block -> throw on the same clock.
        · THE PLAN, TOP RIGHT (formation, 0.66 of 1:1). Window =
          x .240..0.802, y .300..0.632 of a 1120x760 drawing — the four
          station plates with their seven-segment numerals 1..4, the shield
          bands, the spear vectors and the archer's channel left open down the
          spine between stations 2 and 3. At 0.66 the numerals print 22px with
          4.6px strokes on a clean paper field, which is the same compression
          OD-B21-S02 uses for its section. Its destination clears every head
          in the frame: bottom edge y 204 against the highest crown in the
          room (Odysseus' at 252).
        · THE BOLT, RIGHT (formation, same drawing, second window). Window =
          x .082..0.300, y .085..0.285 — the storeroom, the postern lane and
          the BOLT across it. This is beat 2 and it is the only place in the
          frame where it can be stated: `bar` goes `barred` -> `open` at the
          moment Telemachus starts up the lane, and from then the window
          carries the bolt laid aside along the cheek and the dashed leak
          arrow running up to the store. The line arrives in the plan only at
          ISSUE — before that the same drawing shows the floor, the shut
          doors, the sill and the empty channel, because the line does not
          exist yet.

   G. ONE GUISE, ONE MIRROR, NEITHER OF THEM SWITCHED. Odysseus is
      character.odysseus-b16 at guise `restored` for the whole scene, drawn
      `mirror:true` exactly as S01 and S02 draw him: the rig's reaching poses
      are authored to screen LEFT and everything he does goes screen RIGHT.
      There is no transformation here and therefore no
      divine_fx.athenas-restoration — the ramp was spent in S01 and re-running
      it would un-tell the reveal. Telemachus is never mirrored (his one act,
      the run, goes LEFT and the rig walks left), and the corpses keep S02's
      values verbatim. No figure in this file gets a single hand-drawn mark;
      ctx overpaint is zero.

   H. THE THREE DEAD, THE TWO BOARDS AND THE CROWD ARE INHERITED VERBATIM.
      Same stations, same constants, same window geometry, same pose and face
      values S02 closed on, so nothing in the room moves between two adjacent
      shots. The suitors' box is S02's box on S02's two stations with S02's
      midX; only its status and wave advance, because the mass is still on the
      near-left floor and the only men who come on in this scene are the four
      who are arming.

   I. TONE. Room in a lift-0 state, five rig figures and one ensemble with no
      overpaint anywhere, three windows that are mostly paper with dark
      accents on the bosses, the bolt and the beads, and the whole near-right
      floor, the far floor and the right-hand quarter left as paper. The
      darkest masses in the frame are still the roof beams the room owns.

   CONTINUITY IN — INHERITED, NOT ASSERTED.
      import { exitOccupancy as PREV_EXIT } from "./OD-B22-S02.mjs";
   S02 ends in THIS room and every station it hands over (`threshold`,
   `postern`, `pillar_r`, `pillar_l`, `bench_r1`, `table_l`, `table_r`,
   `corner_dead`) is a megaron station, so no translation table is needed and
   NOBODY IS DROPPED. Two entries are ADDED for what this scene brings on: the
   herdsmen at `axe_first`, and the arms themselves, which start in the
   `storeroom` and end at `axe_first` with the line.

   Verify (the run, and the spears):
     node harness/render-scene.mjs scenes/OD-B22-S03.mjs --t 14
     node harness/render-scene.mjs scenes/OD-B22-S03.mjs --t 60
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import eurymachus  from "../assets/character/eurymachus.mjs";
import amphinomus  from "../assets/character/amphinomus.mjs";
import antinous    from "../assets/character/antinous.mjs";
import suitors     from "../assets/ensemble/suitors.mjs";
import herdsmen    from "../assets/ensemble/eumaeus-and-philoetius.mjs";
import tables      from "../assets/prop/raised-dining-tables.mjs";
import board       from "../assets/prop/antinouss-cup-and-feast-table.mjs";
import armour      from "../assets/prop/defender-armor-set.mjs";
import formation   from "../assets/set_piece/battle-threshold-formation.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 64;

/* the same room S01 and S02 leave behind, layer for layer (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth","axes"];

/* ---- THE CLOCK ---------------------------------------------------------- */
const RUN0  = 6;    // "I'll fetch armour" — he leaves the side door
const RUN1  = 11;   // up the lane, at the storeroom
const LOAD  = 13;   // four shields, four helmets, eight spears
const BACK0 = 18;   // down the lane with the armful
const BACK1 = 24;   // back in the side door
const ISSUE = 26;   // one set each: the line is issued
const OWN   = 32;   // "I left the door open — that was me"
const WALL  = 38;   // shields up, the four stand the near end
const LOW   = 46;   // the quiver is going
const SPEARS= 52;   // the bow against the doorpost, two spears in hand
const THROW = 58;   // the first two shafts go

/* ---- CONTINUITY IN (note "CONTINUITY IN") -------------------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B22-S02.mjs";
const ENTERING = {
  herdsmen: "axe_first",   // the two loyal men, up on the near end with the king
  arms:     "storeroom",   // the four panoplies, still behind the side door
};
const INITIAL = { ...PREV_EXIT, ...ENTERING };

/* ---- BLOCKING. Stations, not coordinates (notes B, C). ------------------- */
const MOVES = [
  { who:"telemachus", from:"postern",   to:"storeroom", t0:RUN0,  t1:RUN1  },
  { who:"telemachus", from:"storeroom", to:"postern",   t0:BACK0, t1:BACK1 },
  // the kit comes down the lane with him and stays with the line
  { who:"arms",       from:"storeroom", to:"axe_first", t0:BACK0, t1:ISSUE, kind:"prop" },
];

/* one figure scale for the whole cast; the plan's depth law does the rest */
const K = 0.42;
/* the rig plants its ankles at 0.90 of its box, and 0.752 of a figure box is
   surviving ink — both measured in S01 and used unchanged since. */
const FIG_INK = 0.752;

/* placeFigure — verbatim in intent from S01/S02: the lift puts FEET on the
   mark. Every figure in this scene is pure rig with no ctx-drawn cloth, so the
   default landscape box is the regime the modules were authored in. */
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  placeInstance(offctx, W, H, mod, {
    anchor:{ x:anchor.x, y:anchor.y + 0.10 * scale }, scale, state,
  });
}

/* ---- WINDOW MACHINERY (note F, device verbatim from OD-B21-S02) ---------- */
/* blit one declared WINDOW of a whole-frame drawing, keyed, at a declared
   destination in frame fractions. */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* A DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses. Keyed straight onto the room, the roof
   plane's rafters run through the drawing and it stops reading as a diagram. */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.restore();
}
/* AND THE RULE GOES ON AFTERWARDS, which draft 2 got wrong. The formation
   sheet's floor plane is a level-1 fill, not paper, so borderKey does not key
   it out and the blit lays an opaque light plane over the whole destination —
   including the rule drawn under it. Stroked after the plate, at 7px (a 5px
   rule on paper against paper comes back out of the dotify pass dotted), the
   window declares its own edge and the roof beams stop running through the
   drawing. */
function detailRule(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.strokeStyle = INK; offctx.lineWidth = 7;
  offctx.strokeRect(x + 3.5, y + 3.5, w - 7, h - 7);
  offctx.restore();
}

/* THE ISSUE REGISTER — the armour set's eight-notch ledger, 1:1 (note F) */
const ARM_CW = 820, ARM_CH = Math.round(820 * 760 / 1120);   // 820 x 556
const ARM_WIN = { x0:.137, y0:.856, x1:.863, y1:.940 };
/* laid at 0.72 of 1:1, not 1:1. Draft 1 put it down at full size — 595px, 53%
   of the frame — and the two group rules read as ONE bar striping the near
   floor, which is the failure the brief names. At 0.72 it is 428px wide with a
   53px break at its middle and a separate rule under each group of four, it
   clears the wrecked boards (bottom 618), Antinous' board (644), the crowd's
   right edge (271) and the engine's card rule (.965), and the notch cells are
   still 36x14 with 17px beads. */
const ARM_DST = { x0:.300, y0:.880, x1:.682, y1:.924 };
const armourMode = t => t < ISSUE ? "carry"
                      : t < WALL  ? "equip"
                      : t < THROW ? "block"
                      :             "throw";

/* THE PLAN AND THE BOLT — two windows of one drawing (note F) */
const FORM_CW = 1120, FORM_CH = 760;
/* the window starts at y .196, ABOVE the door wall, and not at the line's own
   top edge. Draft 1 cropped to y .300 — the four stations only — and before
   ISSUE that window is a 415x166 sheet of blank paper punched into the room's
   upper right, because the line does not exist yet and the plan's floor plane
   keys out white. Started at the wall, the window always carries the shut
   leaves, the two jambs and the sill with its four ticks, and the stations
   arrive inside a drawing that was already reading. It stops at y .560 so the
   long spear vectors are cut and the sheet stays 2.27:1 — at that aspect it
   fits the one patch of far wall clear of every crown in the room (its bottom
   edge is y 212 against Odysseus' at 252). */
const LINE_WIN = { x0:.240, y0:.196, x1:.802, y1:.560 };
const LINE_DST = { x0:.618, y0:.048, x1:.975, y1:.279 };
const BOLT_WIN = { x0:.082, y0:.085, x1:.300, y1:.285 };
const BOLT_DST = { x0:.740, y0:.293, x1:.884, y1:.425 };
function formState(t){
  const stood = t >= ISSUE;
  return {
    layers: stood ? ["floor","cover","wall","postern","line","lane"]
                  : ["floor","wall","postern","lane"],
    bar:  t < RUN0 ? "barred" : "open",
    mode: t < LOW ? "arrows" : "spears",
    t:0.5,
    status: t >= SPEARS ? "SPEARS" : stood ? "HELD" : "OPEN",
    progress: clamp01(0.12 + 0.84 * (t / D)),
  };
}

/* ---- THE HERDSMEN'S BOX, solved off the plan's depth law (note E) -------- */
const HERD = { front:0.585, footY:0.955, centre:0.470 };
function herdBox(W, H, p){
  const ch = FIG_INK * H * K * p.scale / HERD.front;
  const cw = ch * W / H;
  return { x: p.x * W - HERD.centre * cw, y: p.y * H - HERD.footY * ch,
           w: Math.round(cw), h: Math.round(ch) };
}
function placeHerds(offctx, W, H, p, state){
  const b = herdBox(W, H, p);
  const sig = `hp|${state.formation}|${Math.round((state.arming ?? 0) * 20)}`
            + `|${Math.round((state.attention ?? 0) * 20)}`;
  offctx.drawImage(keyedModuleCanvas(herdsmen, b.w, b.h, state, sig), b.x, b.y);
}
/* one ramp for the arming, so the two men cross the snap at different seconds */
const armingAt = t =>
    t < ISSUE ? 0.24
  : t < WALL  ? 0.24 + 0.76 * clamp01((t - ISSUE) / (WALL - ISSUE))
  :             1.00;
const formationAt = t =>
    t < ISSUE  ? "barring"
  : t < WALL   ? "arming"
  : t < SPEARS ? "shield-wall"
  :              "guard-door";

/* ---- THE THREE DINING TABLES — S02's constants, unchanged (note H) ------- */
const TAB_CW = 312, TAB_CH = Math.round(312 * 760 / 1120);   // 312 x 212
const TAB_WIN = { x0:.190, x1:1.0, y0:0, y1:1.0 };
const TAB_REF_X = .44;
const TAB_REF_Y = { set:.933, shoved:.972, raised:.908, wrecked:.759 };
const TAB_STATION = "table_l";
function placeTables(offctx, W, H, state){
  const p  = megaron.at(TAB_STATION, { kind:"prop" });
  const ww = (TAB_WIN.x1 - TAB_WIN.x0) * TAB_CW;
  const wh = (TAB_WIN.y1 - TAB_WIN.y0) * TAB_CH;
  const x  = p.x * W - (TAB_REF_X - TAB_WIN.x0) * TAB_CW;
  const y  = p.y * H - (TAB_REF_Y[state.config] - TAB_WIN.y0) * TAB_CH;
  const cv = keyedModuleCanvas(tables, TAB_CW, TAB_CH, state,
               `tab|${state.config}|${Math.round((state.strike ?? 1) * 20)}`);
  offctx.drawImage(cv,
    TAB_WIN.x0 * TAB_CW, TAB_WIN.y0 * TAB_CH, ww, wh, x, y, ww, wh);
}

/* ---- ANTINOUS' OWN BOARD — S01/S02 constants, unchanged (note H) --------- */
const PROP_CW = 289, PROP_CH = 504;
const PROP_WIN = { x0:.150, y0:.386, x1:.940, y1:.858 };
const PROP_BOARD = { x0:.185, x1:.672, floor:.808 };
function placeBoard(offctx, W, H, state){
  const p  = megaron.at("table_r", { kind:"prop" });
  const ww = (PROP_WIN.x1 - PROP_WIN.x0) * PROP_CW;
  const wh = (PROP_WIN.y1 - PROP_WIN.y0) * PROP_CH;
  const fx = ((PROP_BOARD.x0 + PROP_BOARD.x1) / 2 - PROP_WIN.x0) * PROP_CW / ww;
  const fy = (PROP_BOARD.floor - PROP_WIN.y0) * PROP_CH / wh;
  const cv = keyedModuleCanvas(board, PROP_CW, PROP_CH, state, `board|${state.mode}`);
  offctx.drawImage(cv,
    PROP_WIN.x0 * PROP_CW, PROP_WIN.y0 * PROP_CH, ww, wh,
    p.x * W - fx * ww, p.y * H - fy * wh, ww, wh);
}

/* ---- THE CROWD — S02's box on S02's two stations (note H) ---------------- */
const CROWD = { cw:415, ch:380, perRow:[2,3], nearRow:0.86, midX:0.68 };
function placeCrowd(offctx, W, H, state){
  const x = megaron.at("corner_dead").x * W - CROWD.midX * CROWD.cw;
  const y = megaron.at("bench_l2").y * H - CROWD.nearRow * CROWD.ch;
  const sig = `su|${Math.round((state.attention ?? 0)*20)}`
            + `|${Math.round((state.wave ?? 0)*20)}`
            + `|${Math.round((state.density ?? 1)*20)}`;
  offctx.drawImage(keyedModuleCanvas(suitors, CROWD.cw, CROWD.ch, state, sig), x, y);
}
function crowdAt(t){
  if (t < ISSUE)  return { attention:1.00, wave:0.80, status:"BEHIND THE BOARDS" };
  if (t < WALL)   return { attention:1.00, wave:0.90, status:"THEY HAVE NO ARMS" };
  if (t < SPEARS) return { attention:1.00, wave:1.00, status:"FOUR OF THEM ARMED" };
  return                 { attention:1.00, wave:1.00, status:"NO WAY PAST THE SILL" };
}

export const scene = {
  id:"OD-B22-S03",
  title:"The Storeroom Arms the Defenders",
  book:22,
  plan:"megaron",
  duration:D,
  beats:[
    "Telemachus leaves the side door and runs up the lane to the storeroom.",
    "He brings back four shields, four helmets and eight bronze-shod spears — one set each for his father, himself, Eumaeus and Philoetius.",
    "He admits it out loud: he left the storeroom door unbarred after that one trip, and someone will find it.",
    "The three of them arm in a shallow arc across the near end of the hall while Odysseus keeps loosing from the sill.",
    "The arrows run low; the bow goes against the doorpost and the fight becomes spears.",
  ],
  exitState:
    "The megaron, still in its contest state — great doors shut, hearth raked " +
    "flush, the twelve axe helves standing down the spine — with the near end " +
    "of it now HELD by four armed men and three suitors dead on the floor. " +
    "Odysseus has still not moved off the great threshold (`threshold`), as " +
    "himself, guise `restored`: the quiver is spent, the bow is against the " +
    "doorpost and he has a shield at his shoulder and two spears in his hand. " +
    "Telemachus is back at the side door (`postern`) armed, having run the " +
    "postern lane to the storeroom (`storeroom`) and back with four shields, " +
    "four helmets and eight spears — AND HAVING LEFT THE STOREROOM DOOR " +
    "UNBARRED behind him, which he has said out loud; that open door is the " +
    "way Melanthius gets arms to the suitors in S04. Eumaeus and Philoetius " +
    "stand the line with the king at `axe_first`, helmeted, shields up, " +
    "spears at the ordered angle — the arming wave has crossed both of them " +
    "and neither is holding a farm tool. The four panoplies (`arms`) are " +
    "issued and out of the store: eight shafts, of which two have been thrown. " +
    "Eurymachus is still down at the right roof-pillar (`pillar_r`), " +
    "Amphinomus at the left (`pillar_l`), Antinous across his own overturned " +
    "board (`bench_r1` / `table_r`), and the three dining tables (`table_l`) " +
    "are still wrecked where the two men fell over them. The rest of the " +
    "suitors are massed on the near-left floor (`corner_dead`) with nothing in " +
    "their hands, the pegs are still bare and the great doors are still shut. " +
    "S04 opens from this state, with the unbarred storeroom as the question.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared box or
     window. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.29, band:"threeq", pose:"pointing_arm" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.25,y:.60}, scale:.30, band:"threeq", pose:"torso_open" },
    { asset:"ensemble.eumaeus-and-philoetius", instance:"herdsmen",
      anchor:{x:.50,y:.47}, scale:.43, state:"barring" },
    { asset:"character.eurymachus", instance:"eurymachus",
      anchor:{x:.66,y:.69}, scale:.41, band:"threeq", pose:"kneel" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.34,y:.69}, scale:.38, band:"threeq", pose:"kneel" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.75,y:.77}, scale:.38, band:"threeq", pose:"crouch" },
    { asset:"prop.raised-dining-tables", instance:"tables_01",
      anchor:{x:.29,y:.81}, scale:.28, state:"wrecked" },
    { asset:"prop.antinouss-cup-and-feast-table", instance:"board_01",
      anchor:{x:.71,y:.81}, scale:.23, state:"overturned" },
    { asset:"prop.defender-armor-set", instance:"arms",
      anchor:{x:.50,y:.94}, scale:.53, state:"carry" },
    { asset:"set_piece.battle-threshold-formation", instance:"formation_01",
      anchor:{x:.76,y:.27}, scale:.37, state:"open" },
    { asset:"ensemble.suitors", instance:"suitors_01",
      anchor:{x:.12,y:.91}, scale:.37, state:"cornered" },
  ],

  timeline:[
    // opening frame = S02's closing frame
    { op:"actor.pose",  target:"odysseus",     at:0.0,    args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",     at:0.0,    args:{ gaze:{ x:.38, y:.14 } } },
    { op:"actor.pose",  target:"telemachus",   at:0.0,    args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"telemachus",   at:0.0,    args:{ gaze:{ x:.30, y:.16 } } },
    { op:"actor.pose",  target:"eurymachus",   at:0.0,    args:{ pose:"kneel" } },
    { op:"actor.pose",  target:"amphinomus",   at:0.0,    args:{ pose:"kneel" } },
    { op:"actor.pose",  target:"antinous",     at:0.0,    args:{ pose:"crouch" } },
    { op:"prop.state",  target:"tables_01",    at:0.0,    args:{ config:"wrecked" } },
    { op:"prop.state",  target:"board_01",     at:0.0,    args:{ mode:"overturned" } },
    { op:"prop.state",  target:"arms",         at:0.0,    args:{ mode:"carry" } },
    { op:"prop.state",  target:"formation_01", at:0.0,    args:{ bar:"barred", state:"open" } },
    { op:"crowd.state", target:"suitors_01",   at:0.0,    args:{ status:"BEHIND THE BOARDS" } },
    { op:"crowd.state", target:"herdsmen",     at:0.0,    args:{ formation:"barring" } },
    // 1. the run
    { op:"actor.gaze",  target:"telemachus",   at:RUN0-1, args:{ gaze:{ x:-.34, y:.06 } } },
    { op:"sound.cue",   target:"telemachus",   at:RUN0,   args:{ src:"postern", cue:"I will fetch us armour" } },
    { op:"prop.state",  target:"formation_01", at:RUN0,   args:{ bar:"open" } },
    { op:"actor.pose",  target:"telemachus",   at:RUN1,   args:{ pose:"reach_forward" } },
    { op:"sound.cue",   target:"arms",         at:LOAD,   args:{ src:"storeroom", cue:"four shields, four helmets, eight spears" } },
    { op:"actor.pose",  target:"odysseus",     at:LOAD,   args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",     at:LOAD,   args:{ gaze:{ x:.44, y:.10 } } },
    // 2. back down the lane, and the issue
    { op:"actor.pose",  target:"telemachus",   at:BACK1,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"telemachus",   at:BACK1,  args:{ gaze:{ x:.26, y:.04 } } },
    { op:"prop.state",  target:"arms",         at:ISSUE,  args:{ mode:"equip" } },
    { op:"prop.state",  target:"formation_01", at:ISSUE,  args:{ state:"formed" } },
    { op:"crowd.state", target:"herdsmen",     at:ISSUE,  args:{ formation:"arming" } },
    { op:"crowd.state", target:"suitors_01",   at:ISSUE,  args:{ status:"THEY HAVE NO ARMS" } },
    { op:"actor.pose",  target:"odysseus",     at:ISSUE,  args:{ pose:"pointing_arm" } },
    // 3. the admission
    { op:"actor.pose",  target:"telemachus",   at:OWN,    args:{ pose:"palm_up_question" } },
    { op:"actor.gaze",  target:"telemachus",   at:OWN,    args:{ gaze:{ x:-.28, y:.30 } } },
    { op:"sound.cue",   target:"telemachus",   at:OWN,    args:{ src:"postern", cue:"I left the door open — that was me" } },
    { op:"prop.state",  target:"formation_01", at:OWN,    args:{ state:"unbarred" } },
    // 4. the line
    { op:"crowd.state", target:"herdsmen",     at:WALL,   args:{ formation:"shield-wall" } },
    { op:"prop.state",  target:"arms",         at:WALL,   args:{ mode:"block" } },
    { op:"actor.pose",  target:"telemachus",   at:WALL,   args:{ pose:"protective_block" } },
    { op:"actor.gaze",  target:"telemachus",   at:WALL,   args:{ gaze:{ x:.22, y:.08 } } },
    { op:"crowd.state", target:"suitors_01",   at:WALL,   args:{ status:"FOUR OF THEM ARMED" } },
    // 5. the quiver runs out
    { op:"actor.pose",  target:"odysseus",     at:LOW,    args:{ pose:"reach_forward" } },
    { op:"actor.gaze",  target:"odysseus",     at:LOW,    args:{ gaze:{ x:.30, y:.34 } } },
    { op:"prop.state",  target:"formation_01", at:LOW,    args:{ state:"spears" } },
    { op:"actor.pose",  target:"odysseus",     at:SPEARS, args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",     at:SPEARS, args:{ gaze:{ x:.46, y:.08 } } },
    { op:"sound.cue",   target:"odysseus",     at:SPEARS, args:{ src:"threshold", cue:"the bow goes against the doorpost" } },
    { op:"crowd.state", target:"herdsmen",     at:SPEARS, args:{ formation:"guard-door" } },
    { op:"actor.pose",  target:"telemachus",   at:SPEARS, args:{ pose:"one_arm_raised" } },
    { op:"prop.state",  target:"arms",         at:THROW,  args:{ mode:"throw" } },
    { op:"actor.pose",  target:"odysseus",     at:THROW,  args:{ pose:"one_arm_raised" } },
    { op:"timeline.capture", target:"OD-B22-S03", at:62.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st   = stateAt(scene, t);
    const blk  = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);   // deterministic idle phase
    const prog = clamp01(0.10 + 0.84 * (t / D));

    /* --- 1. THE HALL. It paints the room; everything else keys onto it. --- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"contest", t:breath, layers:HALL_LAYERS,
        status: t < RUN0   ? "THE PEGS ARE BARE"
              : t < ISSUE  ? "THE ARMS COME OUT"
              : t < WALL   ? "ONE SET EACH"
              : t < SPEARS ? "THE NEAR END IS HELD"
              :              "SPEARS",
        progress: prog,
      },
    });

    /* --- 2. EVERY BODY, ordered back to front by its own resolved depth --- */
    const draw = [];

    /* ODYSSEUS — the sill, and he never leaves it (notes D, G). */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const loosing = t < LOW;
      const scrape  = t >= LOW && t < SPEARS;      // the last of the shafts
      const spearing= t >= SPEARS;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, guise:"restored", band:"threeq", mirror:true,
            pose: s.pose || "pointing_arm",
            gaze: s.gaze || { x:.38, y:.14 },
            browUp:   scrape ? .34 : .14,
            browKnit: spearing ? .58 : loosing ? .46 : .40,
            eyeNarrow:loosing ? .50 : .32,
            jaw:      spearing ? .34 : 0,
            mouthAsym:.22,
            frown:    spearing ? .26 : 0,
            status: spearing ? "SPEARS"
                  : scrape   ? "THE LAST OF THEM"
                  :            "THE STRING",
            progress: prog,
          },
        });
      }});
    }

    /* TELEMACHUS — the run, the load, the admission, the shield (note C). */
    {
      const p = blk.telemachus, s = st.telemachus || {};
      const loading = t >= RUN1 && t < BACK0;
      const owning  = t >= OWN && t < WALL;
      const walled  = t >= WALL;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, telemachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.62) % 4 : breath, band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "torso_open"),
            gaze: s.gaze || { x:.30, y:.16 },
            browUp:   owning ? .52 : loading ? .30 : .22,
            browKnit: walled ? .48 : owning ? .30 : .38,
            eyeNarrow:walled ? .40 : .22,
            eyeWide:  owning ? .30 : 0,
            jaw:      p.moving ? .40 : owning ? .28 : 0,
            frown:    owning ? .22 : walled ? .18 : 0,
            mouthAsym:owning ? .34 : .16,
            status: walled     ? "SHIELD UP"
                  : owning     ? "I LEFT IT OPEN"
                  : t >= ISSUE ? "ONE SET EACH"
                  : loading    ? "FOUR SHIELDS, EIGHT SPEARS"
                  : p.moving   ? "TO THE STOREROOM"
                  :              "THE SIDE DOOR IS MINE",
            progress: prog,
          },
        });
      }});
    }

    /* EUMAEUS AND PHILOETIUS — one ensemble box, the arming channel doing the
       work the poem gives this scene (note E). */
    {
      const p = blk.herdsmen;
      draw.push({ d:p.d, run(){
        placeHerds(offctx, W, H, p, {
          formation: formationAt(t),
          arming: armingAt(t),
          stagger:0.36, span:0.50,
          density:0, background:0, foreground:0, showShell:false,
          attention: t < ISSUE ? 0.72 : 0.95,
          resolve:   t < ISSUE ? 0.45 : 1.0,
          wave:1.4,
          focus:{ x:-0.28, y:0.34 },        // the suitors, off to the near left
          status: t < ISSUE  ? "BARRING"
                : t < WALL   ? "TAKING ARMS"
                : t < SPEARS ? "WALLED"
                :              "HOLDING",
          progress: prog, t: breath,
        });
      }});
    }

    /* THE THREE DEAD — S02's closing values, verbatim (note H). */
    {
      const p = blk.eurymachus;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, eurymachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", pose:"kneel", gaze:{ x:-.04, y:.54 },
                  blink:1, browUp:.18, browKnit:.34, eyeWide:0, eyeNarrow:0,
                  jaw:.44, frown:.50, smile:0, mouthAsym:0,
                  status:"THROUGH THE CHEST", progress:prog },
        });
      }});
    }
    {
      const p = blk.amphinomus;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, amphinomus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", mirror:true, pose:"kneel",
                  gaze:{ x:.04, y:.54 },
                  blink:1, browUp:.40, browKnit:.36, eyeWide:0,
                  jaw:.42, frown:.48, mouthAsym:0,
                  status:"BETWEEN THE SHOULDERS", progress:prog },
        });
      }});
    }
    {
      const p = blk.antinous;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, antinous, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", pose:"crouch", gaze:{ x:-.06, y:.52 },
                  blink:1, browUp:.10, browKnit:.34, eyeWide:0, eyeNarrow:0,
                  jaw:.46, frown:.50, smile:0, mouthAsym:0,
                  status:"THROUGH THE THROAT", progress:prog },
        });
      }});
    }

    /* THE WRECKED DINING TABLES and ANTINOUS' BOARD — inherited (note H). */
    draw.push({ d:megaron.at(TAB_STATION, { kind:"prop" }).d, run(){
      placeTables(offctx, W, H, { config:"wrecked", strike:1, t:0,
                                 status:"WRECKED", progress:prog });
    }});
    draw.push({ d:megaron.at("table_r", { kind:"prop" }).d, run(){
      placeBoard(offctx, W, H, { mode:"overturned", t:0,
                                 status:"OVERTURNED", progress:prog });
    }});

    /* THE REST OF THE SUITORS — S02's box, unmoved on the clock (note H). */
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

    /* --- 3. THE THREE WINDOWS. Overlays, always last (note F). ----------- */
    {
      const fs  = formState(t);
      const fsg = `bt|${fs.layers.join("")}|${fs.bar}|${fs.mode}`;
      /* THE PLAN COMES IN WITH THE LINE, and not before. Draft 2 held this
         window open from t=0: the plan's floor plane is opaque, so for the
         first 26 seconds it printed a 415x176 flat light panel with a wall
         band across its top and nothing else in it — the largest dead area in
         the frame, and a diagram of a formation that had not been formed. It
         is the B16-S04 device (a chart is up while its count is the subject)
         applied to the hold. The BOLT window opens earlier, on the second
         Telemachus starts up the lane, because from that second the state of
         that door is the thing the scene is about. */
      if (t >= ISSUE){
        detailField(offctx, W, H, LINE_DST);
        plate(offctx, W, H, formation, FORM_CW, FORM_CH, LINE_WIN, LINE_DST, fs, fsg);
        detailRule(offctx, W, H, LINE_DST);
      }
      if (t >= RUN0){
        detailField(offctx, W, H, BOLT_DST);
        plate(offctx, W, H, formation, FORM_CW, FORM_CH, BOLT_WIN, BOLT_DST, fs, fsg);
        detailRule(offctx, W, H, BOLT_DST);
      }
    }
    {
      const mode = armourMode(t);
      const as = { mode, t:0, status:mode.toUpperCase(), progress:prog };
      detailField(offctx, W, H, ARM_DST);
      plate(offctx, W, H, armour, ARM_CW, ARM_CH, ARM_WIN, ARM_DST, as, `arm|${mode}`);
      detailRule(offctx, W, H, ARM_DST);
    }
  },
};
export default scene;

/* named binding so OD-B22-S04 can `import { exitOccupancy as INITIAL }`.
   S04 plays in this same hall, so every station below is a megaron station
   and it needs no translation table — only the men who come in after this. */
export const exitOccupancy = scene.exitOccupancy;
