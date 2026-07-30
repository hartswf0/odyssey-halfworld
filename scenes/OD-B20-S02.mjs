/* ============================================================
   SCENE  OD-B20-S02 — Thunder and the Mill Woman        (Od. 20.91–121)
   Book XX, scene 2. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied
   from the reference scene, scenes/OD-B16-S03.mjs.

   Beats (causal order, one master clock):
     1. Before dawn Odysseus asks Zeus for a DOUBLE sign — one out of the sky,
        one out of the household.
     2. Zeus thunders out of a CLEAR sky: no cloud, no bolt to ground, one hard
        report that opens in empty air over the roof and rolls once across the
        house.
     3. The last of the twelve grinding women — the weakest, still at her stone
        when the other eleven have finished and gone to sleep — hears it, stays
        her hand, and prays out loud for the thing nobody in the house dares
        want: let this be the suitors' last supper.
     4. Odysseus hears her voice come through the doorway, recognizes both
        signs, and takes courage.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM. location.hand-mills-and-grain-room, state "night" — eleven mills
      stopped, ONE turning, the night lamp lit, the hall doorway dark. This is
      NOT the megaron and not the hut: the mill house is a service room off the
      hall with its own file and its own authored plan, and nothing here builds
      or casts a second hall. The room is an acoustic instrument and both of its
      openings are plot: `door_hall` carries her prayer out to Odysseus, and the
      roof vent lets the thunder in. Its `sound` layer draws those two channels
      as an explicit diagram, so it is switched ON at the prayer and not before.

   B. NO HAND-PLACED ANCHORS. The room publishes its own plan (`millHouse`,
      exported by the location module), so this scene imports THAT rather than
      authoring a second, disagreeing copy of the same room. Every body resolves
      through blockingAt() by station name. Nothing here is a hand anchor.

   C. FIELD TRANSFORM, ONCE. The shell is placed 35% larger than the plate and
      pinned so the room's own bottom edge lands just under it. That crops the
      pale ceiling lid, two of its three tie beams and the band of empty near
      floor below the last rank, and lifts every figure by the same 35% — this
      room is a wide shot and at 1:1 its bodies dissolve in the dot lattice
      (measured: the woman went from an unreadable 130px to 185px). It is the
      LARGEST crop that still holds both ends of the scene, the roof vent at the
      top and the near rank at the bottom, with all twelve stones still inside
      the frame so the count is not cropped away. Every station borrowed from the
      plan goes through the SAME transform (`A()`), so no mark can drift off the
      thing it names.

   D. WHY SHE IS AT `mat_09` AND NOT AT `mat_weary`. The room aliases the weary
      woman's stone to mill_01 — the inner stone of the FAR rank. A figure
      standing at that mat is crossed by the rank in front of her (mill_05 is
      nearer, and its handle and drum reach above her floor line), and the
      location paints all twelve stones in ONE pass, so a mid-rank body cannot
      be occluded correctly by the stones that stand in front of it: whichever
      order you choose, either she is painted over a nearer mill or her own
      stone is painted over her head. `mat_09` — the inner mat of the NEAREST
      rank — is the only worker station in this room with clear air in front of
      it (the sieves and the meal sacks are at the two far corners of the near
      clip, x≈.06 and x≈.94, and she is at x≈.30). She is therefore blocked
      there, unoccluded and 29% larger than she would be at the far rank. Two
      of the room's own faint diagram marks stay keyed to mill_01 — the turning
      sweep and the origin of the sound layer's voice fan — and that is the
      price: both are a few hundred pale pixels at the far rank, where the
      module puts them, and neither is the object.

   E. ONE BODY. Odysseus is character.odysseus-b16 with guise "beggar" held for
      the whole scene — no cut to .odysseus-as-beggar, and no guise ramp: he is
      not restored until Book XXII, so the channel simply does not move here.

   F. NOBODY TOUCHES ANYBODY, AND THAT IS THE POINT. The only contact in this
      scene is ACOUSTIC, and it is carried by two stations at opposite ends of
      the room's depth — `mat_09` (her mouth, near) and `listener` / `threshold`
      (his ear, outside the door, far). They can never resolve to one point.
      The room's own CONTACT PAIR (`aisle_l`/`aisle_r`) is not needed and not
      used.

   G. THE QUERN IS AN INSTRUMENT, NOT A SECOND STONE. prop.millstone is a
      diagrammatic elevation of one hand mill — a wide squat pair of dressed
      stones with a rate column and an orthographic key plate. The room's own
      twelve stones are tall narrow stands seen in projection; the two are
      differently proportioned drawings of the same object, so docking the prop
      onto a painted mill would print one stone inside another at the wrong
      aspect. It is instead blitted at 1:1 as a called-out DETAIL WINDOW in the
      upper left — one window of the drawing (peg, both stones, the eye, the
      joint, the rotation arrows and the LISTEN mark; the rate column and the
      orthographic key plate are cropped off, which is also what keeps every
      seven-segment numeral in this asset out of the plate at a size that would
      dissolve). Three things had to be got right before it read at all, and all
      three are in the code below: the drawing is rendered into a PORTRAIT box
      (its stone is aspect 3.6 in a landscape one and prints as a flat lens), it
      is given its own paper field and one hard rule (keyed straight onto the
      room, the ceiling beam and the peg rail ran through the stone), and it is
      not shrunk below ~1:1 of that box. Its channels are driven off the same
      clock as her body: the stone turns, slows, is abandoned mid-stroke with the
      last barley still in the eye, and stops. The idiom is OD-B19-S01's ledger.

   H. THE THUNDER IS TWO LOCAL CUTOUTS, NOT A PLATE. divine-fx.zeuss-clear-sky-
      thunder is a whole-sky diagram: full frame it would paint its own household
      of blocks and its own dawn horizon over the inside of the mill house. Only
      the petition, the wave and the seam are drawn, in two boxes that share one
      registration — the fx's OWN `source:vent` anchor is put on the room's
      published `sound:in`, the louvre the module says the thunder comes in by.
      Two boxes because every length in this fx is a fraction of ITS box: the
      wave needs a box larger than the plate or the wedge is sliced along an
      invisible canvas edge, and at that size the seam is a 22px black bar across
      a third of the frame, so the seam gets its own box at half the size and
      comes out as one hard tear a stone's throw long. The fx's `vent` layer is
      dropped: the room already paints that louvre, and the fx's version is a
      100px solid black octagon that reads as a blot. The wedge `direction` is
      not hand-keyed either — it is computed from the vent to her blocked
      position, so the one report travels from the seam to the woman because the
      plan says where she is.

   CONTINUITY IN — computed, then TRANSLATED (brief note F). OD-B20-S01 ends in
   the forecourt and exports `exitOccupancy`; `hide`, `court_far` and
   `stair_foot` are forecourt stations and do not exist in the mill house, so
   they are mapped explicitly and the bodies the story leaves behind are
   dropped: Athena withdrew into the court and Penelope is upstairs, neither is
   in this room. Odysseus' `hide` maps to `listener`, the mill house's own name
   for where a body outside the door stands to hear. The mill woman is new to
   the chain and is declared at her station.

   Verify (early, mid and late — the blocking, the report and the aftermath):
     node harness/render-scene.mjs scenes/OD-B20-S02.mjs --t 8
     node harness/render-scene.mjs scenes/OD-B20-S02.mjs --t 18
     node harness/render-scene.mjs scenes/OD-B20-S02.mjs --t 40
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, clamp01, lerp,
         INK, PAPER } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { millHouse } from "../assets/location/hand-mills-and-grain-room.mjs";
import odysseus  from "../assets/character/odysseus-b16.mjs";
import millWoman from "../assets/character/mill-woman.mjs";
import quern     from "../assets/prop/millstone.mjs";
import thunder   from "../assets/divine_fx/zeuss-clear-sky-thunder.mjs";

const FIELD_ASSET = "location.hand-mills-and-grain-room";
const D = 46;

/* ---- THE CLOCK ---------------------------------------------------------- */
const ASK      = 4;    // he asks Zeus for the double sign
const PET_FULL = 10;   // the ask is fully up
const THUNDER  = 15;   // the seam tears open in clear air
const ROLL_END = 25;   // the report has rolled past her
const STAY     = 17;   // she stays her hand on the mill
const PRAYER   = 22;   // the curse-prayer goes out through the doorway
const LISTEN   = 31;   // did anybody hear her say it
const COURAGE  = 34;   // he recognizes both signs
const STEP0 = 34, STEP1 = 40;   // and comes to the mill-house door
const FX_OFF   = 31;   // the sky closes again

/* ---- THE FIELD TRANSFORM (note C) ---------------------------------------
   1.35 and pinned so the room's own bottom edge lands just under the plate: the
   pale ceiling lid and two of its three tie beams crop off the top, the empty
   near floor below the last rank crops off the bottom, and every body comes up
   35%. It is chosen as the LARGEST crop that still holds both ends of this
   scene — the roof vent the thunder enters by (room y .33) and the near rank the
   woman kneels in (room y .91) — and all twelve stones stay inside the frame at
   this width, so the count is not cropped away. */
const FIELD = { scale: 1.35, ax: 0.49, ay: 1.03 };
const F_X0 = FIELD.ax - FIELD.scale / 2, F_Y0 = FIELD.ay - FIELD.scale;
/* a plan-projected point, in PLATE coordinates */
const A = p => ({ x: F_X0 + p.x * FIELD.scale,
                  y: F_Y0 + p.y * FIELD.scale,
                  scale: p.scale * FIELD.scale, d: p.d,
                  station: p.station, moving: p.moving });
/* the room's painted roof vent, in PLATE coordinates. The location publishes it
   as `sound:in`, which is where it draws the louvre the thunder enters by. */
const VENT = (() => {
  const a = field.anchors["sound:in"];
  if (!a) throw new Error("[OD-B20-S02] the mill house publishes no `sound:in` anchor");
  return { x: F_X0 + a.x * FIELD.scale, y: F_Y0 + a.y * FIELD.scale };
})();

/* ---- CONTINUITY IN: translate the forecourt, drop who is not here -------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B20-S01.mjs";
const FORECOURT_TO_MILL = {
  hide:      "listener",   // the ox-hide in the portico -> the ear outside the door
  hide_head: "listener",
  route_mid: "aisle_far",
  threshold: "threshold",
  court_far:  null,        // Athena withdrew into the court — not in this room
  stair_foot: null,        // Penelope is up her own stair — not in this room
};
const INITIAL = {
  ...Object.fromEntries(
    Object.entries(PREV_EXIT || {})
      .map(([who, st]) => [who, FORECOURT_TO_MILL[st] ?? null])
      .filter(([, st]) => st)),
  /* she is new to the chain: XX.105–110, the last of the twelve still at her
     stone. `mat_09` is the near inner worker station — see note D. */
  mill_woman: "mat_09",
};

/* ---- BLOCKING. Stations, not coordinates. -------------------------------
   Both bodies are near-static, because the text has both of them still: he is
   lying awake in the portico and she is on her knees at a quern. The one move
   is his — having taken the sign he gets up and comes as far as the mill-house
   door, to look at the mouth the second sign came out of. */
const MOVES = [
  { who: "odysseus", from: "listener", to: "threshold", t0: STEP0, t1: STEP1 },
];

/* ---- the fx ramps. One petition, one report, one roll. ------------------- */
const petitionAt = t =>
    t <= ASK        ? 0
  : t <  PET_FULL   ? (t - ASK) / (PET_FULL - ASK)
  : t <  THUNDER    ? 1
  : t <  THUNDER + 4? 1 - (t - THUNDER) / 4
  : 0;
const reportAt = t =>
    t <= THUNDER      ? 0
  : t <  THUNDER + 1.4? (t - THUNDER) / 1.4
  : t <  THUNDER + 9  ? 1 - 0.76 * ((t - THUNDER - 1.4) / 7.6)
  : 0.24;
const rollAt = t => clamp01((t - THUNDER) / (ROLL_END - THUNDER));

/* ---- the quern's channels, off the same clock as her body --------------- */
const rateAt = t =>
    t <  11   ? 1
  : t <  14   ? lerp(1, 0.30, (t - 11) / 3)
  : t <  STAY ? lerp(0.30, 0, (t - 14) / (STAY - 14))
  : 0;
const thetaAt = t => 0.62 + 1.05 * Math.min(t, STAY);

/* ---- placeFigure: a PORTRAIT drawing box --------------------------------
   Verbatim from OD-B20-S01: placeInstance sizes an instance's box srcW×srcH,
   and figure-hero caps body height at min(H*0.9, W*1.26) while the character
   modules lay their custom parts out in box-W units. In a LANDSCAPE box the
   body is H-limited while the cloth stretches with W, so the mill woman's
   shift turns into a wide bell. Any PORTRAIT box (aspect < 0.714) puts the body
   back in the W*1.26 regime the modules were authored in. The 0.10*scale lift
   is the rig's own floor line (H*0.90 of the box): it puts FEET on the mark
   instead of the box edge. */
const BOX_AR = 0.62;
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  const bw = H * BOX_AR;
  placeInstance(offctx, bw, H, mod, {
    anchor: { x: anchor.x * W / bw, y: anchor.y + 0.10 * scale },
    scale, state,
  });
}

/* ---- PLATE — blit one window of a whole-frame drawing at 1:1, keyed, so the
   room shows between its lines and the art keeps its own scale. Dropped into a
   stage at a small uniform scale a diagram's detail clogs; stretched, it
   distorts. So the module is drawn at the size its crop demands and only the
   declared window lands. (The idiom is OD-B19-S01's ledger windows.) */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}

/* WHERE THE QUERN DETAIL SITS (note G).
   CW/CH — a PORTRAIT drawing box, and that is the whole trick. The prop lays its
   parts out in fractions of W and H independently, so in a landscape box its
   stone comes out 587px wide by 163px tall — an aspect of 3.6, which prints as a
   flat lens with a smaller lens inside it and reads as nothing. 620×860 puts the
   same drawing back at aspect 1.6, which is a quern: a squared bedstone with a
   round runner seated in it and a peg standing off the rim.
   WIN — the elevation only: the peg, both stones, the eye, the joint and the
   meal. x stops at .660, well short of the rate column at .780; y stops at .555,
   above the key plate at .65. Nothing in the window is small type — every
   numeral in this drawing is in one of the two parts that were cropped off.
   DST — upper left, below the card label, clear of the doorway the far figure
   stands in (x≥.33) and stopping above the outer far stone (y≈.354). The dst
   aspect is the window's own pixel aspect, so the drawing is not stretched. */
const Q_CW = 620, Q_CH = 860;
const QUERN_WIN = { x0:0.120, y0:0.138, x1:0.680, y1:0.432 };
const QUERN_DST = { x0:0.016, y0:0.026, x1:0.320, y1:0.352 };

/* A DETAIL WINDOW, and it has to be one. Blitted keyed straight onto the room,
   the drawing's paper is transparent and the ceiling's tie beam, the far wall's
   coursing and the peg rail run right through the stone — the quern stopped
   reading as an object and became noise. Its own paper field and one hard rule
   is what makes it a callout instead: the same device the engine's card uses. */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

export const scene = {
  id:"OD-B20-S02",
  title:"Thunder and the Mill Woman",
  book:20,
  plan:"mill-house",
  duration:D,
  beats:[
    "Before dawn Odysseus asks Zeus for a double sign — one from the sky and one out of the household.",
    "Zeus thunders from a clear sky: no cloud, no bolt, one hard report over the roof.",
    "The last of the twelve grinding women hears it and stays her hand on the mill.",
    "She prays out loud that this feast be the suitors' last — the lowest mouth in the house saying the unsayable.",
    "Her voice comes out through the doorway; Odysseus recognizes both signs and takes courage.",
  ],
  exitState:
    "Before dawn, the mill house: the double sign has been given and taken. " +
    "Zeus' one report has rolled through the roof vent and closed again, the sky " +
    "is empty; the twelfth stone is stopped with the last barley still in its eye " +
    "and the meal banked at its foot, and the mill woman is spent on her knees at " +
    "it (`mat_09`, the near inner mat), having said out loud that this should be " +
    "the suitors' last supper. Odysseus, still the beggar, has come off the " +
    "ox-hide to the mill-house doorway (`threshold`) and heard her: he holds both " +
    "signs and has taken courage. Neither of them has spoken to the other and she " +
    "does not know he is there. Athena is withdrawn into the court and Penelope " +
    "is in her upper chamber; neither is in this room. Dawn and the suitors' " +
    "arrival — S03, in the hall — opens from this state.",
  exitOccupancy:occupancyAt(millHouse, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:FIELD.ax,y:FIELD.ay}, scale:FIELD.scale, state:"night" },
    { asset:"divine-fx.zeuss-clear-sky-thunder", instance:"thunder",
      anchor:{x:.63,y:.18}, scale:1.25 },
    { asset:"prop.millstone", instance:"quern",
      anchor:{x:.17,y:.22}, scale:.30, state:"grind" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.48}, scale:.285, band:"threeq", pose:"kneel" },
    { asset:"character.mill-woman", instance:"mill_woman",
      anchor:{x:.30,y:.90}, scale:.25, band:"front", pose:"mlw_grinding" },
  ],

  timeline:[
    { op:"actor.pose", target:"mill_woman", at: 0.0,     args:{ pose:"mlw_grinding" } },
    { op:"actor.pose", target:"odysseus",   at: 0.0,     args:{ pose:"kneel" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0,     args:{ gaze:{ x:.12, y:.30 } } },
    { op:"prop.state", target:"quern",      at: 0.0,     args:{ mode:"grind" } },
    { op:"actor.pose", target:"odysseus",   at: ASK,     args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus",   at: ASK,     args:{ gaze:{ x:.20, y:-.52 } } },
    { op:"fx.play",    target:"thunder",    at: ASK,     args:{ dir:"petition" } },
    { op:"actor.pose", target:"mill_woman", at: 7.0,     args:{ pose:"mlw_heave" } },
    { op:"actor.pose", target:"mill_woman", at:12.0,     args:{ pose:"mlw_grinding" } },
    { op:"fx.play",    target:"thunder",    at: THUNDER, args:{ dir:"report" } },
    { op:"actor.pose", target:"odysseus",   at: THUNDER, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus",   at: THUNDER, args:{ gaze:{ x:.34, y:-.58 } } },
    { op:"actor.pose", target:"mill_woman", at: STAY,    args:{ pose:"mlw_slumped" } },
    { op:"actor.gaze", target:"mill_woman", at: STAY,    args:{ gaze:{ x:.02, y:-.30 } } },
    { op:"prop.state", target:"quern",      at: STAY,    args:{ mode:"prayer-pause" } },
    { op:"actor.pose", target:"mill_woman", at: PRAYER,  args:{ pose:"mlw_prayer" } },
    { op:"actor.gaze", target:"mill_woman", at: PRAYER,  args:{ gaze:{ x:-.06, y:-.56 } } },
    { op:"actor.pose", target:"odysseus",   at: 25.0,    args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus",   at: 25.0,    args:{ gaze:{ x:-.30, y:.22 } } },
    { op:"actor.pose", target:"mill_woman", at: LISTEN,  args:{ pose:"mlw_listening" } },
    { op:"actor.gaze", target:"mill_woman", at: LISTEN,  args:{ gaze:{ x:-.70, y:-.06 } } },
    { op:"actor.pose", target:"odysseus",   at: COURAGE, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",   at: COURAGE, args:{ gaze:{ x:-.24, y:.14 } } },
    { op:"prop.state", target:"quern",      at: 38.0,    args:{ mode:"stop" } },
    { op:"actor.pose", target:"mill_woman", at: 39.0,    args:{ pose:"mlw_slumped" } },
    { op:"actor.gaze", target:"mill_woman", at: 39.0,    args:{ gaze:{ x:0, y:.36 } } },
    { op:"timeline.capture", target:"OD-B20-S02", at:45.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const raw = blockingAt(millHouse, MOVES, t, INITIAL);
    const blk = Object.fromEntries(Object.entries(raw).map(([k, p]) => [k, A(p)]));
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle phase

    const thundered = t >= THUNDER;
    const praying   = t >= PRAYER;

    /* --- 1. THE MILL HOUSE. It paints the room; everything keys onto it. The
       `sound` layer is the room's diagram of its two acoustic channels, so it
       comes on when there is something in them and not before. ------------- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:FIELD.ax, y:FIELD.ay }, scale:FIELD.scale,
      state:{
        state:"night", t:breath,
        layers: praying
          ? ["shell","roof","farwall","door","bins","mills","mats","stores","lamp","dust","sound"]
          : ["shell","roof","farwall","door","bins","mills","mats","stores","lamp","dust"],
        status: praying ? "HER VOICE GOES OUT" : thundered ? "ONE REPORT" : "ONE TURNING",
        progress: clamp01(0.14 + 0.80 * (t / D)),
      },
    });

    /* --- 2. THE CLEAR-SKY THUNDER (note H). A local keyed cutout whose own
       vent is registered onto the room's painted louvre, aimed at the woman by
       computation rather than by hand. ------------------------------------- */
    if (t >= ASK && t < FX_OFF){
      const p   = thunder.params;
      const her = blk.mill_woman;
      const aim = Math.atan2((her.y - 0.121 - VENT.y) * H, (her.x - VENT.x) * W);
      const pet = petitionAt(t), rep = reportAt(t), rol = rollAt(t);
      /* the fx registered on the room's louvre: `k` is the box size as a
         fraction of the plate, and the offset puts the module's OWN
         `source:vent` (params.srcX/srcY of its box) on VENT. */
      const put = (k, layers, extra, sig) => {
        const bw = k * W, bh = k * H;
        const cv = keyedModuleCanvas(thunder, bw, bh, {
          t: t * 0.5, layers, answer: 0, direction: aim,
          petition: pet, report: rep, roll: rol,
          status: rep > 0.5 ? "THUNDER" : rol > 0.1 ? "ROLLING" : "ASKED",
          progress: clamp01(0.10 + 0.84 * (t / D)),
          ...extra,
        }, sig, 0.895);
        offctx.drawImage(cv, VENT.x * W - p.srcX * bw, VENT.y * H - p.srcY * bh);
      };
      /* THE FIELD — one directional report, in a box larger than the plate so
         the wedge is never sliced along an invisible canvas edge. The `wave`
         geometry scales with the box, so this is also what makes the front
         travel the whole width of the room. The ask rides in the same box: its
         line climbs from the near floor and threads out through the louvre. */
      const wide = pet > 0.02 ? ["petition","wave"] : ["wave"];
      put(1.25, wide, {},
        `thuW|${wide.length}|${Math.round(pet*20)}|${Math.round(rol*24)}|${Math.round(aim*40)}`);
      /* THE SOURCE — the seam, in a SMALL box. Its length and stroke weight are
         fractions of the box too, so drawn at field size it is a 22px-thick
         black bar across a third of the frame. At 0.60 it is what it should be:
         one hard tear a stone's throw long, opening in empty air at the louvre.
         The fx's own `vent` layer is NOT drawn — the room already paints that
         louvre, and the fx's version is a 100px solid black octagon. */
      if (rep > 0.02) put(0.60, ["seam"], {}, `thuS|${Math.round(rep*20)}`);
    }

    /* --- 3. THE TWO BODIES, ordered back to front by their own blocked depth
       so the far one is never painted over the near one. ------------------- */
    const draw = {
      /* ODYSSEUS — outside, framed in the hall doorway. One body, guise
         "beggar" held: he is not restored until Book XXII. */
      odysseus: () => {
        const p = blk.odysseus, s = st.odysseus || {};
        const asking = t >= ASK && t < THUNDER;
        const struck = t >= THUNDER && t < 25;
        const heard  = t >= 25 && t < COURAGE;
        const brave  = t >= COURAGE;
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: 0.285 * p.scale,
          state:{
            t: p.moving ? (t * 0.42) % 4 : breath,
            guise:"beggar", band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "kneel"),
            gaze: s.gaze || { x:.12, y:.30 },
            browUp:    struck ? .52 : asking ? .34 : brave ? .16 : .12,
            browKnit:  brave ? .46 : heard ? .30 : .16,
            eyeWide:   struck ? .40 : heard ? .22 : 0,
            eyeNarrow: brave ? .38 : 0,
            jaw:       asking ? .30 : struck ? .22 : 0,
            smile:     brave ? .16 : 0,
            mouthAsym: brave ? .54 : 0,
            frown:     0,
            status: brave  ? "BOTH SIGNS"
                  : heard  ? "OUT OF THE HOUSE"
                  : struck ? "OUT OF A CLEAR SKY"
                  : asking ? "A SIGN, FATHER ZEUS"
                  : "AWAKE BEFORE DAWN",
            progress: clamp01(0.12 + 0.82 * (t / D)),
          },
        });
      },
      /* THE MILL WOMAN — the lowest body in the household, on her knees at the
         twelfth stone. Her one upward movement in the whole module is the
         prayer, and it is the only thing she does in this scene. */
      mill_woman: () => {
        const p = blk.mill_woman, s = st.mill_woman || {};
        const working  = t < STAY;
        const stayed   = t >= STAY && t < PRAYER;
        const speaking = t >= PRAYER && t < LISTEN;
        const checking = t >= LISTEN && t < 39;
        placeFigure(offctx, W, H, millWoman, {
          anchor:{ x:p.x, y:p.y }, scale: 0.28 * p.scale,
          state:{
            t: breath, band:"front",
            pose: s.pose || "mlw_grinding",
            gaze: s.gaze || { x:-.10, y:.42 },
            browUp:   speaking ? .30 : checking ? .46 : stayed ? .34 : .10,
            browKnit: speaking ? .40 : working ? .32 : .18,
            eyeWide:  checking ? .34 : 0,
            frown:    speaking ? .24 : stayed ? .44 : .22,
            jaw:      speaking ? .62 : working ? .12 : .14,
            mouthAsym:speaking ? .20 : 0,
            status: checking ? "DID ANYBODY HEAR"
                  : speaking ? "THEIR LAST SUPPER"
                  : stayed   ? "SHE STAYS HER HAND"
                  : t >= 12  ? "THE TWELFTH MEASURE"
                  : "GRINDING",
            progress: clamp01(0.10 + 0.84 * (t / D)),
          },
        });
      },
    };
    for (const who of Object.keys(draw).sort((a, b) => blk[a].d - blk[b].d)) draw[who]();

    /* --- 4. THE QUERN, called out (note G). One window of the millstone
       drawing, blitted at 1:1 over the cropped ceiling: the stone she is at,
       read as an instrument. The rate column and the key plate are cropped
       away, so nothing in this window depends on small type. -------------- */
    {
      const rate = rateAt(t), listen = (t >= THUNDER && t < 39) ? 1 : 0;
      const qs = {
        theta: thetaAt(t), rate,
        feed:  t < 11 ? 1 : t < STAY ? lerp(1, 0.25, (t - 11) / (STAY - 11)) : 0.22,
        meal:  t < 11 ? 1 : t < STAY ? lerp(1, 0.45, (t - 11) / (STAY - 11)) : 0.40,
        fall:  rate,
        heap:  clamp(0.34 + 0.60 * (t / D), 0, 0.96),
        basket: clamp(0.52 - 0.44 * (t / D), 0.10, 1),
        listen, t: breath,
        status: rate > 0.8 ? "GRINDING" : rate > 0.02 ? "SLOWING"
              : listen ? "PRAYING" : "STOPPED",
        progress: clamp01(0.20 + 0.74 * (t / D)),
      };
      const sig = `q|${Math.round(qs.theta*8)}|${Math.round(rate*20)}|${listen}|${Math.round(qs.heap*20)}|${Math.round(qs.basket*20)}|${Math.round(qs.feed*20)}`;
      detailField(offctx, W, H, QUERN_DST);
      plate(offctx, W, H, quern, Q_CW, Q_CH, QUERN_WIN, QUERN_DST, qs, sig);
    }
  },
};
export default scene;

/* named binding so OD-B20-S03 can `import { exitOccupancy as INITIAL }`.
   S03 plays in the megaron: it must translate or drop these stations —
   `mat_09` and `threshold` are mill-house names. */
export const exitOccupancy = scene.exitOccupancy;
