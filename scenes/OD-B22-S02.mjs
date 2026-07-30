/* ============================================================
   SCENE  OD-B22-S02 — Eurymachus Bargains and Attacks     (Od. 22.44–125)
   Book XXII, scene 2. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied
   from the reference scene, scenes/OD-B16-S03.mjs, and from its immediate
   predecessor, scenes/OD-B22-S01.mjs.

   Beats (causal order, one master clock):
     1. Eurymachus blames Antinous and offers repayment many times over if
        Odysseus spares them.
     2. Odysseus rejects compensation and promises no survivor can escape
        his rage.
     3. Eurymachus rallies the suitors to rush the archer beneath raised
        tables.
     4. Odysseus shoots Eurymachus in the chest; Amphinomus charges and
        Telemachus kills him with a spear.

   All pixel figures below are in the stage's own 1120x760 space (renderScene
   hands stage() srcW=1120, srcH=760 and the PNG is that at DPR 2), and every
   one of them was MEASURED off a render, not estimated.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM, NOT ROOMS. The atlas casts no location for this scene. It plays in
      the megaron, so the field is location.megaron-hall in state `contest`,
      placed at anchor (.50,.99) scale 1.0 with the SAME layer list S01 used —
      so this hall registers to the pixel on S01's hall and the two shots cut
      together. THE STATE STILL DOES NOT ADVANCE TO `battle`: three men are
      down at the end of this scene, not a hundred and eight, and `battle`
      lifts the whole room a level and tumbles every board. The escalation is
      carried by the three bodies, by the dining tables coming up off the
      floor, and by the room's own status word. `furniture`, `throne` and
      `litter` stay dropped for exactly the reasons S01 gives; `racks` stays
      kept, and the bare pegs are still bare.

   B. NO HAND-PLACED ANCHORS. Every position resolves through
      scenes/_plans/megaron.mjs by station NAME — the one man who moves, the
      five who do not, the crowd's box and both props' footprints. Nothing in
      this file is a hand anchor.

   C. CONTACT PAIRS — TWO KILLINGS, NEITHER OF THEM A COLLISION.
        · THE ARROW: `threshold` (x .500, feet y .563) -> `pillar_r`
          (x .662, feet y .690). The archer never leaves the sill and
          Eurymachus never gets off his mark: 0.16 of the frame apart, and the
          contact is the shot, not a touch.
        · THE SPEAR: `postern` (x .254, feet y .599) -> `pillar_l` (x .339,
          feet y .690). Telemachus holds the side door he took in S01 —
          covering the storeroom passage is plot he inherits and must not give
          up — and throws at a man 0.09 of the frame nearer the camera than he
          is. Two stations, never one.
        · THE TWO BODIES THAT SHARE THE RIGHT-HAND FLOOR: Eurymachus at
          `pillar_r` occupies x 696..787 and Antinous' corpse at `bench_r1`
          occupies x 789..890 — TWO PIXELS of clear paper between them, and
          different depths, sizes and head heights, so they read as two men.

   D. WHY EURYMACHUS DOES NOT MOVE, AND WHY THAT IS THE POEM.
      The first draft had him rise from his own place at `bench_r2` and rush
      the sill. Rendered, it is the fusion bug: his body at `bench_r2` spans
      x 834..942 against the corpse's 789..890, and the two printed as ONE
      near-black mass with two heads side by side — the single worst thing in
      the frame. Every other right-hand mark fails the same test or worse:
      `table_r` (748..853) overlaps the corpse by 64px and is the board's own
      station, `doorway_maid` (837..925) by 53px, and `stair_up` (886..989)
      lands inside the room's drawn stair (x 900..1060) and prints dark on
      dark. `pillar_r` is the ONLY right-hand mark that clears the corpse, and
      it is where he has to die.
      So he stands there for the whole scene — and Homer agrees: at 22.79–83
      Eurymachus draws his sword and springs at Odysseus WITH A SHOUT, and the
      arrow is already in his chest. He never crosses the floor. The lunge is
      therefore carried by the pose channel (`lean_forward` at t=43, jaw and
      brow wide open, status AT HIM, ALL OF YOU) instead of by a station
      change, and the scene's motion is carried by the one man who does cross
      the floor, by the boards' four-state career, and by the crowd's wave.
      Nobody enters this room and nobody leaves it.

   E. ONE GUISE, TWO MIRRORS, NEITHER OF THEM SWITCHED. Odysseus is
      character.odysseus-b16 at guise `restored` for the whole scene. There is
      no transformation here and therefore no `divine_fx.athenas-restoration`:
      the ramp was spent in S01 and re-running it would un-tell the reveal.
      He is drawn `mirror:true` throughout, exactly as S01 draws him — the
      rig's reaching poses (`reach_forward`, `pointing_arm`, `confrontation`)
      are authored to screen LEFT and every act of this scene goes screen
      RIGHT: he looses at a man on x .662. Amphinomus is mirrored throughout
      too, and for the same reason: he charges from x .207 to x .339 at a man
      on x .500, so his lunge must read inboard-RIGHT. He is pure rig — his
      three bespoke poses are registered on the shared HERO_POSES table and
      there is no ctx overpaint anywhere in his module — so the mirror is
      exact. Nobody else is mirrored: Eurymachus stands right of the spine and
      pleads and points LEFT at the archer; Antinous is already down; and
      Telemachus stands LEFT while his one act goes RIGHT, so the throw is
      carried by a SYMMETRIC pose (`one_arm_raised` — the spear cocked
      overhead) plus an explicit gaze, which overrides the pose's own gazeX
      after the mirror is composed and is therefore authored in final screen
      terms. No figure in this file gets a single hand-drawn mark.

   F. THE SPINE IS EMPTY, AND THAT IS WHAT DECIDES THE BLOCKING.
      `axe_first`, `axe_last`, `hearth`, `shot_mark`, `throne` and `door_main`
      are all x=.50, and `threshold` is occupied for all 62 seconds. A figure
      on any of them puts a second head within 105px of Odysseus' feet on the
      same vertical — the totem S01 measured and refused. So the two forward
      marks in this scene are the roof-pillars, the only forward stations that
      are neither the spine nor a door: `pillar_r` (696..787) and `pillar_l`
      (333..424). Measured against the room's own drawn pillars (x 302..375
      and 628..700), both figures stand just INBOARD of the stone, not fused
      with it.
      AMPHINOMUS OPENS AT `bench_l2` (x 178..286), NOT `bench_l1`. bench_l1
      projects to x 281 and `postern` to x 284 — three pixels apart — so the
      first draft printed Telemachus' head directly above Amphinomus' head on
      one vertical, which is the same totem in miniature. From `bench_l2` the
      two men's centres are 52px apart, his outboard shoulder stands behind
      the crowd's front rank where a man at a bench belongs, and his charge
      lands him at `pillar_l` clear of every other instance in the frame.

   G. THE THREE TABLES ARE ONE OBJECT WITH A CAREER, NOT FOUR PICTURES.
      prop.raised-dining-tables is authored for this scene and holds the same
      three boards through every configuration, so it is cast ONCE at
      `table_l` and driven through `config` along four of the asset's own
      declared edges, in order: SET (three other men's boards, still laid —
      only Antinous' own table went over in S01) -> SHOVED (the hall comes off
      the benches) -> RAISED (beat 3: hauled upright, undersides flat to the
      camera, arrows arriving in them) -> WRECKED (beat 4: splintered, a leg
      gone, the spill trodden across the floor).
        · IT IS BLITTED 1:1 THROUGH A WINDOW, the same device S01 used for
          Antinous' board. TAB_CW is not free: the near board is 0.416 of the
          prop's own frame width, so CW=312 prints it 130px long — 0.92m
          against a man who prints 246px (1.75m) at this station. CH/CW is set
          to the stage's own aspect so the prop's internal cy spread reads as
          floor depth instead of a parade.
        · ONLY x IS CROPPED, at .19, and not for taste: the asset's
          `drawScaleBar` overlay lands at x .115..0.159 depending on config,
          and a capped measuring rod standing on the floor of a killing is the
          one mark in this prop that belongs to the study rather than to the
          room. Everything else it draws — the tumble ghost, the grip ticks,
          the arrows buried in the boards, the spill, the loaf and cup on the
          floor, the floor ticks, the scuffs — is kept, because all of it is
          what the object is doing. The cropped edge falls at x 241, behind
          the crowd's front rank.
        · TAB_REF_Y IS PER CONFIG. The registration point is the near board's
          own floor contact, and that MOVES when the board is hauled upright
          (.908) or thrown over (.759) instead of standing (.933/.972). On one
          number the wreck sank 42px through the floor; on four, the cluster is
          rooted — whatever the boards do, their feet stay on `table_l`'s floor
          line.
        · WHY `table_l` AND NOT THE MIDDLE OF THE FLOOR. Placed on the near
          spine (`axe_last`, then `throne`) the cluster printed straight across
          the twelve axe helves and the raked hearth ring, and the three
          objects turned into one tangle of sticks — the axe line stopped
          reading, which in Book XXII is a plot loss. At `table_l` the cluster
          spans x 241..494 and touches the drawn helves (x 480..545) for 14px,
          the hearth ring is clear, and there are 29px of paper between the
          boards and Odysseus' own body. The suitors' furniture is on the
          suitors' side of the room, which is also where it was.
        · IT OCCLUDES AMPHINOMUS FROM THE KNEE DOWN AT `pillar_l`, and that is
          correct rather than tolerated: the boards are at d=.70 and he is at
          d=.44, so they are painted over his shins — which is, exactly, beat
          3. He comes on BENEATH the raised tables and is cut off at the knee
          by the thing he is sheltering behind. `strike` ramps 0->1 across the
          rush so the arrows arrive in the boards while they are up.

   H. THE CROWD IS S01'S BOX, SLID ONE THIRD OF ITS WIDTH LEFT. Same asset,
      same two stations (x from `corner_dead`, floor line from `bench_l2`),
      same 415x380 box, same [2,3] ranks, same four dropped layers, same
      depth — only `midX` goes .51 -> .68, which moves the group 71px along
      its own floor line and nothing else. It has to: at .51 the group's ink
      reached x 336 and buried both Amphinomus and the near board, and a
      buried figure is worse than a group that continues further past the
      frame edge. At .68 the ink stops at x 218, which leaves 27px of clear
      paper under Telemachus' heel at the postern and puts Amphinomus' bench
      in front of the rank instead of behind it. THE GROUP DOES NOT MOVE ON
      THE CLOCK, and that is the reading: the mass holds the near-left floor
      and shouts, and the only suitors who come on are the two the poem names.
      The ensemble sizes its members in ABSOLUTE pixels, so a box walked up
      the floor would translate the men without shrinking them — this crowd
      cannot change depth, and pretending otherwise would break the one ground
      plane the book is built on.

   I. THE THREE DEAD, AND WHY TWO OF THEM KNEEL. The rig floor-corrects both
      ankles onto its own floor line, so no body in this atlas can be drawn
      prone. Antinous keeps S01's `crouch` verbatim — same pose, same face
      values, so the corpse does not change between two adjacent shots.
      Eurymachus and Amphinomus, who die in THIS scene, are dropped further
      with `kneel`: measured, it takes 31px off Eurymachus' crown, and against
      an upright Telemachus and an upright archer that is the difference
      between a man slumped and a man standing still. Homer has Eurymachus go
      down doubled over with his forehead on the floor; `kneel` plus blink 1,
      jaw open and the eyes shut is as close as the rig goes.

   J. TONE. Room in a lift-0 state, both props' light planes turned to the
      camera, five figures that are all rig and no overpaint, and the whole
      near foreground, the far floor and the right-hand quarter left as paper.
      The darkest masses in the frame are the roof beams the room already owns.

   CONTINUITY IN — INHERITED, NOT ASSERTED.
      import { exitOccupancy as PREV_EXIT } from "./OD-B22-S01.mjs";
   S01 ends in THIS room and every station it hands over (`threshold`,
   `postern`, `bench_r1`, `corner_dead`, `table_r`) is a megaron station, so
   no translation table is needed and NOBODY IS DROPPED. Odysseus is still on
   the sill with the arrows at his feet, Telemachus still in the side door,
   Antinous still dead at his own place, his board still overturned in front of
   him, the rest of the suitors still on the near-left floor. Three entries are
   ADDED for what this scene brings on: Eurymachus already on his feet at the
   right roof-pillar, Amphinomus in his own place on the near left-hand bench,
   and the three dining tables out on the suitors' floor.

   Verify (early and late — the offer, and all three down):
     node harness/render-scene.mjs scenes/OD-B22-S02.mjs --t 12
     node harness/render-scene.mjs scenes/OD-B22-S02.mjs --t 60
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01 } from "../engine/halfworld-engine.mjs";
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
import tables      from "../assets/prop/raised-dining-tables.mjs";
import board       from "../assets/prop/antinouss-cup-and-feast-table.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 62;

/* the same room S01 leaves behind, layer for layer (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth","axes"];

/* ---- THE CLOCK ---------------------------------------------------------- */
const BLAME   = 2;    // "it was all Antinous"
const OFFER   = 10;   // repayment, many times over, twenty oxen each
const REJECT  = 22;   // not for your whole inheritance
const RAGE    = 30;   // not one of you gets out of this hall
const RALLY   = 36;   // draw your swords, hold the tables against the arrows
const RAISE   = 38;   // the boards come up off the floor
const LUNGE   = 43;   // sword out, and he springs at the man on the sill
const SHOT    = 48;   // the bowstring
const HIT     = 49;   // through the chest, beside the nipple
const FALL    = 51;   // doubled over, forehead on the floor
const CHARGE0 = 52;   // Amphinomus comes on with the sword out
const CHARGE1 = 57;   // and reaches the left roof-pillar
const SPEAR   = 57;   // between the shoulders
const DOWN    = 59;   // full length on the floor
const WRECK   = 59;   // the boards splinter under the two of them

/* ---- CONTINUITY IN (note "CONTINUITY IN") -------------------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B22-S01.mjs";
const ENTERING = {
  eurymachus: "pillar_r",    // on his feet at the right roof-pillar, out on the floor
  amphinomus: "bench_l2",    // his own place on the near left-hand bench
  tables:     "table_l",     // the three dining boards, out on the floor
};
const INITIAL = { ...PREV_EXIT, ...ENTERING };

/* ---- BLOCKING. Stations, not coordinates (notes B, C, D, F). ------------- */
const MOVES = [
  // and the second man, up the left flank, into his own death
  { who:"amphinomus", from:"bench_l2", to:"pillar_l", t0:CHARGE0, t1:CHARGE1 },
];

/* one figure scale for the whole cast; the plan's depth law does the rest */
const K = 0.42;

/* placeFigure — the rig's floor line is H*0.90 of its own box, so an instance
   placed straight on a station floats 0.10*scale of the frame above it. The
   lift puts FEET on the mark. Verbatim in intent from OD-B22-S01: every
   figure in this scene is pure rig with no ctx-drawn cloth, so the default
   landscape box is the regime all five modules were authored in. */
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  placeInstance(offctx, W, H, mod, {
    anchor:{ x:anchor.x, y:anchor.y + 0.10 * scale }, scale, state,
  });
}

/* ---- THE THREE DINING TABLES, blitted 1:1 onto their own station (note G) */
const TAB_CW = 312, TAB_CH = Math.round(312 * 760 / 1120);   // 312 x 212
const TAB_WIN = { x0:.190, x1:1.0, y0:0, y1:1.0 };
/* BOTH components describe THE NEAR BOARD: x is its centre-line (it sits at
   .402..0.454 depending on config, so .44 is that line), y is its own floor
   contact, measured in the asset's frame for each configuration this scene
   drives it through. Registered on one y the wreck sank 42px through the
   floor; registered on four, the cluster is rooted. */
const TAB_REF_X = .44;
const TAB_REF_Y = { set:.933, shoved:.972, raised:.908, wrecked:.759 };
const TAB_STATION = "table_l";

function tablesDst(W, H, config){
  const p  = megaron.at(TAB_STATION, { kind:"prop" });
  const ww = (TAB_WIN.x1 - TAB_WIN.x0) * TAB_CW;
  const wh = (TAB_WIN.y1 - TAB_WIN.y0) * TAB_CH;
  const x = p.x * W - (TAB_REF_X - TAB_WIN.x0) * TAB_CW;
  const y = p.y * H - (TAB_REF_Y[config] - TAB_WIN.y0) * TAB_CH;
  return { x, y, w:ww, h:wh, d:p.d };
}
function placeTables(offctx, W, H, state){
  const dst = tablesDst(W, H, state.config);
  const cv  = keyedModuleCanvas(tables, TAB_CW, TAB_CH, state,
                `tab|${state.config}|${Math.round((state.strike ?? 1) * 20)}`);
  offctx.drawImage(cv,
    TAB_WIN.x0 * TAB_CW, TAB_WIN.y0 * TAB_CH,
    (TAB_WIN.x1 - TAB_WIN.x0) * TAB_CW, (TAB_WIN.y1 - TAB_WIN.y0) * TAB_CH,
    dst.x, dst.y, dst.w, dst.h);
}
const tablesConfigAt = t =>
    t < RALLY ? "set"        // three other men's boards, still laid
  : t < RAISE ? "shoved"     // knocked askew as the hall comes off the benches
  : t < WRECK ? "raised"     // hauled upright, flat to the camera, arrows in them
  :             "wrecked";

/* ---- ANTINOUS' OWN BOARD, inherited overturned. Constants verbatim from
   OD-B22-S01 so the object does not move a pixel between the two shots. --- */
const PROP_CW = 289, PROP_CH = 504;
const PROP_WIN = { x0:.150, y0:.386, x1:.940, y1:.858 };
const PROP_BOARD = { x0:.185, x1:.672, floor:.808 };
function boardDst(W, H){
  const p  = megaron.at("table_r", { kind:"prop" });
  const ww = (PROP_WIN.x1 - PROP_WIN.x0) * PROP_CW;
  const wh = (PROP_WIN.y1 - PROP_WIN.y0) * PROP_CH;
  const fx = ((PROP_BOARD.x0 + PROP_BOARD.x1) / 2 - PROP_WIN.x0) * PROP_CW / ww;
  const fy = (PROP_BOARD.floor - PROP_WIN.y0) * PROP_CH / wh;
  return { x:p.x * W - fx * ww, y:p.y * H - fy * wh, w:ww, h:wh, d:p.d };
}
function placeBoard(offctx, W, H, state){
  const dst = boardDst(W, H);
  const cv  = keyedModuleCanvas(board, PROP_CW, PROP_CH, state, `board|${state.mode}`);
  offctx.drawImage(cv,
    PROP_WIN.x0 * PROP_CW, PROP_WIN.y0 * PROP_CH,
    (PROP_WIN.x1 - PROP_WIN.x0) * PROP_CW, (PROP_WIN.y1 - PROP_WIN.y0) * PROP_CH,
    dst.x, dst.y, dst.w, dst.h);
}

/* ---- THE CROWD, S01's box on S01's two stations, slid left (note H) ------ */
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
  if (t < REJECT)  return { attention:0.85, wave:0.30, status:"THEY WANT TERMS" };
  if (t < RALLY)   return { attention:1.00, wave:0.60, status:"NO TERMS" };
  if (t < HIT)     return { attention:1.00, wave:1.00, status:"BEHIND THE BOARDS" };
  return                  { attention:1.00, wave:1.00, status:"TWO MORE DOWN" };
}

export const scene = {
  id:"OD-B22-S02",
  title:"Eurymachus Bargains and Attacks",
  book:22,
  plan:"megaron",
  duration:D,
  beats:[
    "Eurymachus lays the whole thing on the dead Antinous and offers repayment many times over if Odysseus spares the rest.",
    "Odysseus refuses compensation: not for their whole inheritance, and not one of them gets out of the hall.",
    "Eurymachus calls the suitors on — swords out, the dining tables hauled up as shields against the arrows.",
    "Odysseus shoots Eurymachus through the chest and he goes down doubled over his own board.",
    "Amphinomus charges with the sword out and Telemachus takes him between the shoulders with a spear.",
  ],
  exitState:
    "The megaron, still in its contest state — doors shut, hearth raked flush, " +
    "the twelve axe helves standing in their trench — with THREE men dead in it. " +
    "Odysseus has not moved: he holds the great threshold (`threshold`) as " +
    "himself, guise `restored`, bow in hand, the poured arrows still on the " +
    "sill at his feet, and he has refused payment out loud — not for their " +
    "whole inheritance, and no survivors. Eurymachus is down at the right " +
    "roof-pillar (`pillar_r`), shot through the chest one station short of the " +
    "man he charged, doubled forward with his eyes shut. Amphinomus is down at " +
    "the left roof-pillar (`pillar_l`), speared between the shoulders in " +
    "mid-charge. Antinous is where S01 left him (`bench_r1`), fallen across his " +
    "own overturned board (`table_r`). Telemachus still holds the side door " +
    "(`postern`) — he threw from it and did not leave it, so the storeroom " +
    "passage is still covered and Melanthius has not been up it yet. The three " +
    "dining tables (`table_l`) are WRECKED: hauled upright as shields during " +
    "the rush, arrows buried in the boards, then splintered with a leg gone " +
    "when the two men went down over them. The rest of the suitors are still " +
    "on the near-left floor (`corner_dead`), massed and shouting and behind " +
    "what is left of the boards; the pegs are still bare and the great doors " +
    "are still shut. Nobody has reached a weapon that matters — S03 opens from " +
    "this state, with the hall's arms about to become the question.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared box.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.29, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.25,y:.60}, scale:.30, band:"threeq", pose:"confrontation" },
    { asset:"character.eurymachus", instance:"eurymachus",
      anchor:{x:.79,y:.84}, scale:.41, band:"threeq", pose:"palm_up_question" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.25,y:.77}, scale:.38, band:"threeq", pose:"uneasy_reserve" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.75,y:.77}, scale:.38, band:"threeq", pose:"crouch" },
    { asset:"prop.raised-dining-tables", instance:"tables_01",
      anchor:{x:.29,y:.81}, scale:.28, state:"shoved" },
    { asset:"prop.antinouss-cup-and-feast-table", instance:"board_01",
      anchor:{x:.71,y:.81}, scale:.23, state:"overturned" },
    { asset:"ensemble.suitors", instance:"suitors_01",
      anchor:{x:.12,y:.91}, scale:.37, state:"cornered" },
  ],

  timeline:[
    // opening frame = S01's closing frame
    { op:"actor.pose",  target:"odysseus",   at: 0.0,     args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at: 0.0,     args:{ gaze:{ x:-.44, y:.12 } } },
    { op:"actor.pose",  target:"telemachus", at: 0.0,     args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"telemachus", at: 0.0,     args:{ gaze:{ x:-.42, y:.04 } } },
    { op:"actor.pose",  target:"antinous",   at: 0.0,     args:{ pose:"crouch" } },
    { op:"actor.gaze",  target:"antinous",   at: 0.0,     args:{ gaze:{ x:-.06, y:.52 } } },
    { op:"prop.state",  target:"board_01",   at: 0.0,     args:{ mode:"overturned" } },
    { op:"prop.state",  target:"tables_01",  at: 0.0,     args:{ config:"shoved" } },
    { op:"crowd.state", target:"suitors_01", at: 0.0,     args:{ status:"THEY WANT TERMS" } },
    // 1. the blame, and the offer
    { op:"actor.pose",  target:"eurymachus", at:BLAME,    args:{ pose:"palm_up_question" } },
    { op:"actor.gaze",  target:"eurymachus", at:BLAME,    args:{ gaze:{ x:-.18, y:.44 } } },
    { op:"sound.cue",   target:"eurymachus", at:BLAME,    args:{ src:"bench_r2", cue:"it was all Antinous" } },
    { op:"actor.pose",  target:"amphinomus", at:BLAME,    args:{ pose:"uneasy_reserve" } },
    { op:"actor.gaze",  target:"amphinomus", at:BLAME,    args:{ gaze:{ x:.30, y:.06 } } },
    { op:"actor.pose",  target:"eurymachus", at:OFFER,    args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"eurymachus", at:OFFER,    args:{ gaze:{ x:-.40, y:.02 } } },
    { op:"sound.cue",   target:"eurymachus", at:OFFER,    args:{ src:"bench_r2", cue:"twenty oxen each, bronze and gold" } },
    { op:"actor.pose",  target:"odysseus",   at:OFFER,    args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"odysseus",   at:OFFER,    args:{ gaze:{ x:.42, y:.10 } } },
    // 2. the refusal
    { op:"actor.pose",  target:"odysseus",   at:REJECT,   args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"odysseus",   at:REJECT,   args:{ gaze:{ x:.44, y:.06 } } },
    { op:"crowd.state", target:"suitors_01", at:REJECT,   args:{ status:"NO TERMS" } },
    { op:"actor.pose",  target:"eurymachus", at:REJECT,   args:{ pose:"both_hands_raised" } },
    { op:"actor.pose",  target:"odysseus",   at:RAGE,     args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",   at:RAGE,     args:{ gaze:{ x:.46, y:.08 } } },
    { op:"sound.cue",   target:"odysseus",   at:RAGE,     args:{ src:"threshold", cue:"not one of you gets out" } },
    { op:"actor.pose",  target:"amphinomus", at:RAGE,     args:{ pose:"protective_block" } },
    // 3. the rally, and the boards
    { op:"actor.pose",  target:"eurymachus", at:RALLY,    args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"eurymachus", at:RALLY,    args:{ gaze:{ x:-.34, y:-.06 } } },
    { op:"sound.cue",   target:"eurymachus", at:RALLY,    args:{ src:"bench_r2", cue:"swords out, tables up" } },
    { op:"prop.state",  target:"tables_01",  at:RAISE,    args:{ config:"raised" } },
    { op:"sound.cue",   target:"tables_01",  at:RAISE,    args:{ src:"table_l", cue:"the boards come up" } },
    { op:"crowd.state", target:"suitors_01", at:RAISE,    args:{ status:"BEHIND THE BOARDS" } },
    // 4. the arrow
    { op:"actor.pose",  target:"eurymachus", at:LUNGE,    args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"eurymachus", at:LUNGE,    args:{ gaze:{ x:-.46, y:.10 } } },
    { op:"sound.cue",   target:"eurymachus", at:LUNGE,    args:{ src:"pillar_r", cue:"the sword comes out" } },
    { op:"actor.pose",  target:"odysseus",   at:SHOT,     args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:SHOT,     args:{ gaze:{ x:.38, y:.14 } } },
    { op:"sound.cue",   target:"odysseus",   at:SHOT,     args:{ src:"threshold", cue:"the string" } },
    { op:"actor.pose",  target:"eurymachus", at:HIT,      args:{ pose:"desperation" } },
    { op:"actor.gaze",  target:"eurymachus", at:HIT,      args:{ gaze:{ x:-.08, y:-.30 } } },
    { op:"actor.pose",  target:"eurymachus", at:FALL,     args:{ pose:"kneel" } },
    { op:"actor.gaze",  target:"eurymachus", at:FALL,     args:{ gaze:{ x:-.04, y:.54 } } },
    { op:"crowd.state", target:"suitors_01", at:HIT,      args:{ status:"TWO MORE DOWN" } },
    // 5. the charge, and the spear
    { op:"actor.gaze",  target:"telemachus", at:CHARGE0,  args:{ gaze:{ x:.30, y:.16 } } },
    { op:"actor.pose",  target:"telemachus", at:SPEAR - 3, args:{ pose:"one_arm_raised" } },
    { op:"sound.cue",   target:"telemachus", at:SPEAR,    args:{ src:"postern", cue:"the spear between the shoulders" } },
    { op:"actor.pose",  target:"amphinomus", at:SPEAR,    args:{ pose:"desperation" } },
    { op:"actor.gaze",  target:"amphinomus", at:SPEAR,    args:{ gaze:{ x:.10, y:-.28 } } },
    { op:"actor.pose",  target:"amphinomus", at:DOWN,     args:{ pose:"kneel" } },
    { op:"actor.gaze",  target:"amphinomus", at:DOWN,     args:{ gaze:{ x:.04, y:.54 } } },
    { op:"prop.state",  target:"tables_01",  at:WRECK,    args:{ config:"wrecked" } },
    { op:"actor.pose",  target:"telemachus", at:DOWN,     args:{ pose:"torso_open" } },
    { op:"timeline.capture", target:"OD-B22-S02", at:60.0, args:{ label:"EXIT" } },
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
        status: t < REJECT  ? "TERMS OFFERED"
              : t < RALLY   ? "NO TERMS"
              : t < SHOT    ? "THE BOARDS COME UP"
              : t < CHARGE0 ? "EURYMACHUS DOWN"
              :               "THREE DEAD",
        progress: prog,
      },
    });

    /* --- 2. EVERY OTHER INSTANCE, ordered back to front by its own resolved
       depth, so a farther thing is never painted over a nearer one. ------- */
    const draw = [];

    /* ODYSSEUS — the sill, and he never leaves it. One body, guise
       `restored`, mirror:true for the whole scene (note E). */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const refusing = t >= REJECT && t < RALLY;
      const loosing  = t >= SHOT && t < FALL;
      const after    = t >= FALL;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, guise:"restored", band:"threeq", mirror:true,
            pose: s.pose || "torso_open",
            gaze: s.gaze || { x:-.44, y:.12 },
            browUp:   refusing ? .38 : .16,
            browKnit: loosing ? .52 : refusing ? .56 : .30,
            eyeNarrow:loosing ? .50 : after ? .34 : .24,
            jaw:      refusing ? .40 : 0,
            mouthAsym:refusing ? .38 : loosing ? .26 : .14,
            frown:    after ? .24 : refusing ? .20 : 0,
            status: after    ? "NO SURVIVORS"
                  : loosing  ? "THE STRING"
                  : refusing ? "NOT FOR ALL OF IT"
                  :            "LET HIM TALK",
            progress: prog,
          },
        });
      }});
    }

    /* TELEMACHUS — the side door he took in S01, held to the end. His one act
       goes screen RIGHT, so it is a SYMMETRIC pose plus an explicit gaze
       (note E). Never mirrored. */
    {
      const p = blk.telemachus, s = st.telemachus || {};
      const cocked = t >= SPEAR - 3 && t < DOWN;
      const thrown = t >= DOWN;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, telemachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq",
            pose: s.pose || "confrontation",
            gaze: s.gaze || { x:-.42, y:.04 },
            browUp:   cocked ? .44 : .26,
            browKnit: cocked ? .50 : .40,
            eyeNarrow:cocked ? .42 : .28,
            eyeWide:  thrown ? .22 : 0,
            jaw:      cocked ? .34 : 0,
            frown:    thrown ? .18 : .20,
            status: thrown ? "BETWEEN THE SHOULDERS"
                  : cocked ? "MINE"
                  :          "THE SIDE DOOR IS MINE",
            progress: prog,
          },
        });
      }});
    }

    /* EURYMACHUS — the bargain, the rally, the rush, the arrow. The fall is
       `crouch` for the same reason S01 gives for Antinous: the rig
       floor-corrects both ankles onto its own floor line, so no body in this
       atlas can be drawn prone, and `kneel` drops the head a whole head
       lower until the man stops reading as a man. Never mirrored: he stands
       right of the spine and everything he does goes LEFT, at the archer. */
    {
      const p = blk.eurymachus, s = st.eurymachus || {};
      const offering = t >= OFFER && t < REJECT;
      const pleading = t >= REJECT && t < RALLY;
      const rallying = t >= RALLY && t < LUNGE;
      const lunging  = t >= LUNGE && t < HIT;
      const struck   = t >= HIT && t < FALL;
      const dead     = t >= FALL;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, eurymachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq",
            pose: s.pose || "palm_up_question",
            gaze: s.gaze || { x:-.18, y:.44 },
            blink:    dead ? 1 : 0,
            browUp:   struck ? .94 : pleading ? .66 : offering ? .44 : .18,
            browKnit: dead ? .34 : lunging ? .70 : rallying ? .62 : pleading ? .30 : .20,
            eyeWide:  struck ? .72 : pleading ? .34 : 0,
            eyeNarrow:dead ? 0 : lunging ? .52 : rallying ? .40 : 0,
            jaw:      dead ? .44 : struck ? .64 : lunging ? .62 : rallying ? .56 : offering ? .30 : .14,
            frown:    dead ? .50 : struck ? .32 : lunging ? .40 : rallying ? .28 : 0,
            smile:    offering ? .14 : 0,
            mouthAsym:dead ? 0 : struck ? 0 : rallying ? .42 : .28,
            status: dead     ? "THROUGH THE CHEST"
                  : struck   ? "THE ARROW"
                  : lunging  ? "AT HIM, ALL OF YOU"
                  : rallying ? "SWORDS OUT, TABLES UP"
                  : pleading ? "SPARE THE REST OF US"
                  : offering ? "TWENTY OXEN EACH"
                  :            "IT WAS ANTINOUS",
            progress: prog,
          },
        });
      }});
    }

    /* AMPHINOMUS — the decent one, who hedges, then comes on anyway and dies
       for it. mirror:true for the whole scene, never switched (note E). */
    {
      const p = blk.amphinomus, s = st.amphinomus || {};
      const alarmed = t >= RAGE && t < CHARGE0;
      const struck  = t >= SPEAR && t < DOWN;
      const dead    = t >= DOWN;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, amphinomus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.62) % 4 : breath, band:"threeq", mirror:true,
            pose: p.moving ? "walk_neutral" : (s.pose || "uneasy_reserve"),
            gaze: s.gaze || { x:.30, y:.06 },
            blink:    dead ? 1 : 0,
            browUp:   struck ? .90 : alarmed ? .58 : .40,
            browKnit: dead ? .36 : alarmed ? .46 : .28,
            eyeWide:  struck ? .70 : alarmed ? .38 : .14,
            jaw:      dead ? .42 : struck ? .60 : p.moving ? .46 : 0,
            frown:    dead ? .48 : struck ? .30 : alarmed ? .22 : 0,
            mouthAsym:dead ? 0 : .18,
            status: dead     ? "BETWEEN THE SHOULDERS"
                  : struck   ? "THE SPEAR"
                  : p.moving ? "SWORD OUT"
                  : alarmed  ? "NO WAY OUT OF THIS HALL"
                  :            "HE ASKED ME TO GO HOME",
            progress: prog,
          },
        });
      }});
    }

    /* ANTINOUS — inherited dead at his own place. Values verbatim from S01's
       closing frame so the corpse does not change between the two shots. */
    {
      const p = blk.antinous, s = st.antinous || {};
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, antinous, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq",
            pose: s.pose || "crouch",
            gaze: s.gaze || { x:-.06, y:.52 },
            blink:1, browUp:.10, browKnit:.34, eyeWide:0, eyeNarrow:0,
            jaw:.46, frown:.50, smile:0, mouthAsym:0,
            status:"THROUGH THE THROAT", progress:prog,
          },
        });
      }});
    }

    /* THE THREE DINING TABLES — one object with a career (note G). */
    {
      const config = tablesConfigAt(t);
      const strike = clamp01((t - RAISE) / Math.max(1e-6, FALL - RAISE));
      draw.push({ d:megaron.at(TAB_STATION, { kind:"prop" }).d, run(){
        placeTables(offctx, W, H, {
          config, strike, t:0,
          status:config.toUpperCase(), progress:prog,
        });
      }});
    }

    /* ANTINOUS' OWN BOARD — inherited overturned, an obstacle now. */
    {
      draw.push({ d:megaron.at("table_r", { kind:"prop" }).d, run(){
        placeBoard(offctx, W, H, {
          mode:"overturned", t:0, status:"OVERTURNED", progress:prog,
        });
      }});
    }

    /* THE REST OF THE SUITORS — S01's box, slid left, unmoved on the clock (note H). */
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

/* named binding so OD-B22-S03 can `import { exitOccupancy as INITIAL }`.
   S03 plays in this same hall, so every station below is a megaron station
   and it needs no translation table — only the men who come in after this. */
export const exitOccupancy = scene.exitOccupancy;
