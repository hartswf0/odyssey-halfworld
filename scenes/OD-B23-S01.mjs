/* ============================================================
   SCENE  OD-B23-S01 — Eurycleia Wakes Penelope            (Od. 23.1–95)
   Book XXIII, scene 1 — the FIRST scene of the book. ADDITIVE: adds nothing to
   Books I–XV, modifies no existing module, and casts only assets that already
   exist. Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from
   its Book XXI sibling OD-B21-S01.

   Beats (causal order, one master clock):
     1. Eurycleia climbs the stair, wakes Penelope on the bed, and says
        Odysseus has returned and killed the suitors.
     2. Penelope first thinks the nurse has gone mad, or that a god punished
        the men.
     3. Eurycleia offers the scar as proof and describes the king waiting below.
     4. Penelope descends, divided between embracing him and testing him from
        a distance.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. NOTHING IS HAND-PLACED — but the plan is not a makePlan() plan, and that
      is deliberate. `location.upper-chamber-and-stair` is a CUTAWAY SECTION:
      two storeys, both true, the descent readable end to end. Its own header
      says so and says why blockingAt()/makePlan() must not be used on it —
      the README §5 projection y = 0.50 + 0.46·z^1.08 cannot put anything above
      the horizon, so an upper storey is unreachable by that law. The room
      therefore EXPORTS its own station table (`STATIONS`) and its own resolver
      (`stationAt`, which throws with the full list on an unknown name), read
      straight out of the same layout table `L` that draws the fixtures — so a
      station and the thing it belongs to cannot drift apart.

      This scene keeps the whole Book XVI+ contract on top of that table:
      positions are named STATIONS and never coordinates; `sectionBlockingAt()`
      below is engine/blocking.mjs's `blockingAt()` semantics line for line
      (held station, first-move fallback, smooth() eased legs, `moving` flag),
      only resolving through `stationAt()` instead of `project()`; and
      `sectionOccupancyAt()` is `occupancyAt()`, so exitOccupancy is COMPUTED.
      An unknown station still throws. Authoring a second, flat local plan for
      a room that already ships a better one would have been the collage the
      convention exists to stop.

   B. CONTACT PAIR, AND THE ONE-WAY CORRIDOR. Od. 23.32: the queen springs from
      the bed and throws her arms round the old woman. That is a touch, so it
      gets the room's own pair — `bedside_l` / `bedside_r`, ±0.048 either side of
      the bed's spine, 107 px apart at this body size, which is two people close
      enough to hold each other and not one coordinate. It is used only for the
      embrace, and only once both of them are on their feet: while the queen is
      still LYING the nurse stands at `bed_foot` instead, because a body laid
      along the bed occupies x .688–.882 and `bedside_l` is inside that.
      The chamber is a one-way corridor — the bed is at the right-hand end and
      every other mark (chest, lamp, chamber door, stair) is to the left — so two
      bodies here can never swap order without walking through each other. They
      therefore never try: the nurse is always the one nearer the door, and she
      moves FIRST every time. She gives ground to `chest` at 32–35 and the queen
      takes the mark she vacated (`bedside_l`) at 36–39; she leaves for the door
      at 52 and the queen crosses the same ground at 55. Going down she is two
      legs (four seconds) ahead the whole way, so no tread ever holds both. At
      the end they are 0.207 of frame width apart — the queen inside the hall
      doorway at `threshold_r`, the nurse out on the low floor at `low_floor`.

   C. THE LYING BODY. Beat 1 is a nurse over a SLEEPING queen, so Penelope has
      to be horizontal, and the rig only stands. She is therefore the rig's own
      output ROTATED a quarter turn about the room's `bed_lie` mark — a
      transform on the figure, not a redraw of it, and the only reason
      `placeFig()` takes a `rot`. `bed_lie` is a body off its feet, so it is a
      CENTRE station: the box is anchored at fy 0.45 while she lies and at the
      rig's own floor line (0.90) once she is up, and the two are lerped by the
      same `lie` ramp that turns her upright. The ramp is read off the move
      itself (`from:"bed_lie" -> to:"bedside_r"`, `p.u`), never off the clock
      twice, so the rise cannot desync from the blocking. She is the same size
      lying as standing — a body is as long as it is tall — which puts 195 px of
      queen along the 281 px mattress the room paints. And she lies in PROFILE,
      not frontal: see the comment on the pose in stage(). The frontal rig
      rotated is a woman a metre thick and read as a blob.

   D. SCALE AGAINST THE ARCHITECTURE (the trap this room sets). The station
      table carries a per-floor `scale` (chamber .30, stair .33, ground .37),
      which is a PERSPECTIVE falloff — a body gets bigger as it comes down. But
      this room is a SECTION: no perspective, both storeys true, which is the
      only reason it can show an upper floor at all. In a section a body is one
      size everywhere, so the three scales are replaced by ONE, `BODY`, and it
      is solved off the room's own three clear heights rather than nudged:
        chamber   floorY − roofY                = .327 H = 249 px
        ground    groundY − (floorY + slabT)    = .384 H = 292 px
        doorway   groundY − thresh.head         = .310 H = 236 px
      The doorway is the binding constraint — she has to get through it — so the
      body is 0.83 of it: 195 px, i.e. `BODY` = 195 / (0.90 · 760) = 0.285 on
      the rig's own floor line. That is 0.78 of the low attic chamber she wakes
      in and 0.67 of the hall storey she comes down into, which is a woman of
      about 1.85 m in a house of 2.5 m and 2.9 m storeys. The station scales are
      still READ — they are what tells this scene the marks are on three
      different floors — they are simply not used as a size.

   E. THE PROOF IS A QUOTE, NOT AN EXHIBIT. `set_piece.scar-evidence` is the
      third instrument on the same body fact and the only one where the marker
      is absent — the welt QUOTED, carried upstairs in a nurse's mouth. So it
      is blitted as ONE declared window on its quote panel (the dashed ghost
      limb and the solid welt), keyed, hanging in the air over the stair well —
      the one part of the chamber no body ever stands in, and the right place for
      a proof that is about to be carried down. Everything under the panel is cropped
      OUT: the relay chain, the three-box ledger and the `1 2 3` / `23` index
      are seven-segment numerals about 0.07 of the plate's height, which at
      this size is type under 20 px and would dissolve in the dot lattice. Its
      own state machine carries beats 3 and 4 — spoken -> heard -> doubted ->
      reserved — and `reserved` is the point: TOLD struck, HEARD struck,
      ACCEPTED never struck, because she keeps her own test.

   F. THE ROOM IS STATE, NOT ROOMS. One field for the whole scene, one asset,
      one clock: night (the climb) -> waking (the news) -> dressing (the way
      out opened) -> descent (the stair alight from below) -> first_sight (the
      hall doorway wide and burning). The chamber, the dog-leg stair and the
      threshold are three parts of ONE room and are never cut into three.
      Nothing above the megaron's `stair_up` door is invented here.

   G. THE ROOM IS PAINTED IN TWO PASSES, ITS OWN WAY ROUND. The asset declares
      `occlusion.front` — the understair void, the stair rail, the doorway
      jambs, the bench. Those four layers are drawn AFTER the figures, so a
      body on the lower flight goes behind the rail and a body in the doorway
      goes behind the jambs instead of pasted over them. No layer is invented;
      the split is the asset's own declaration.

   H. TONE. Both figures are the shared rig plus their own modules' cloth —
      hand-drawn ctx overpaint is ZERO. The room is placed in its light states;
      no state darker than `first_sight` is touched, and `first_sight` earns
      its one black mass (the burning doorway) by being the thing she stops in
      front of. Every band the room draws is already broken; nothing here adds
      a full-width bar.

   CONTINUITY IN — first scene of Book XXIII, so nothing is inherited (Book XXII
   ends in the hall, a different room, and exports nothing this room can name).
   Opening positions are declared from the station table by name: the queen
   asleep on the bed (`bed_lie`), the nurse still on the low floor at the foot
   of the flight (`stair_foot`).

   CONTINUITY OUT — computed, never written:
   { penelope:"threshold_r", eurycleia:"low_floor" }. Both marks are on this
   room's ground floor, which is the head of the megaron's `stair_up` corner —
   so S02 translates with { threshold_r:"stair_up", low_floor:"stair_up" } or an
   equivalent map into scenes/_plans/megaron.mjs, and drops nobody, because this
   scene carries nobody it did not put in the room itself.

   Verify (the sleeping queen, the proof, both on the stair, the threshold):
     node harness/render-scene.mjs scenes/OD-B23-S01.mjs --t 22
     node harness/render-scene.mjs scenes/OD-B23-S01.mjs --t 44
     node harness/render-scene.mjs scenes/OD-B23-S01.mjs --t 63
     node harness/render-scene.mjs scenes/OD-B23-S01.mjs --t 70
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, lerp, smooth }
  from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { STATIONS, stationAt, L as ROOM }
  from "../assets/location/upper-chamber-and-stair.mjs";
import penelope  from "../assets/character/penelope.mjs";
import eurycleia from "../assets/character/eurycleia.mjs";
import evidence  from "../assets/set_piece/scar-evidence.mjs";

const FIELD_ASSET = "location.upper-chamber-and-stair";
const D = 74;

/* ---- THE CLOCK ---------------------------------------------------------- */
const WAKE   = 20;   // the nurse, at the foot of the bed, cries the news
const RISE0  = 22, RISE1 = 26;   // the queen comes off the bed, at its head
const CLOSE0 = 25, CLOSE1 = 28;  // the nurse closes on her — the contact pair
const DOUBT  = 30;   // "the gods have made you mad"
const STEP0  = 32, STEP1 = 35;   // the nurse gives ground, back to the chest
const GOD    = 33;   // "or some god has punished them"
const TURN0  = 36, TURN1 = 39;   // the queen follows her a step, to hear it out
const PROOF  = 40;   // the scar, offered — quoted, not shown
const HEARD  = 43;
const DOUBTED= 46;
const RESERVE= 49;   // she keeps her own test; the plate seals and goes
const PLATE0 = PROOF, PLATE1 = 51;
const LEAD0  = 52;               // the nurse goes first, down the dark stair
const CROSS0 = 55, CROSS1 = 58;  // the queen to the chamber door
const DESC0  = 58;               // and down
const FIRST  = 69;               // the hall doorway comes alight in front of her
const ARRIVE = 70;               // she stops on the threshold

/* ---- CONTINUITY IN: declared from the station table, by name ------------- */
const INITIAL = { penelope:"bed_lie", eurycleia:"stair_foot" };

/* ---- BLOCKING. Stations, not coordinates (notes A, B). ------------------
   Every leg runs between two adjacent NAMED marks on the room's own chain
   `chamber_door -> stair_head -> stair_upper -> landing -> stair_lower ->
   stair_foot -> low_floor -> threshold*` — the same chain the room's exported
   `descentAt(u)` walks. Written out leg by leg so occupancy can name where
   anybody is at any second, which a single ramp cannot do. */
const MOVES = [
  // 1. the nurse climbs, in the dark, to the head of the house, and comes round
  //    to the FOOT of the bed — clear of the body lying along it (note C)
  { who:"eurycleia", from:"stair_foot",   to:"stair_lower",  t0: 2,   t1: 5   },
  { who:"eurycleia", from:"stair_lower",  to:"landing",      t0: 5,   t1: 8   },
  { who:"eurycleia", from:"landing",      to:"stair_upper",  t0: 8,   t1:11   },
  { who:"eurycleia", from:"stair_upper",  to:"stair_head",   t0:11,   t1:13.5 },
  { who:"eurycleia", from:"stair_head",   to:"chamber_door", t0:13.5, t1:16   },
  { who:"eurycleia", from:"chamber_door", to:"bed_foot",     t0:16,   t1:19   },
  // 2. the queen sits up at the HEAD of the bed, where her head already is, and
  //    the nurse closes on her: `bedside_l` / `bedside_r`, the room's own pair
  { who:"penelope",  from:"bed_lie",      to:"bedside_r",    t0:RISE0,  t1:RISE1 },
  { who:"eurycleia", from:"bed_foot",     to:"bedside_l",    t0:CLOSE0, t1:CLOSE1 },
  // 3. the nurse gives ground to the open chest; the queen follows one mark
  { who:"eurycleia", from:"bedside_l",    to:"chest",        t0:STEP0, t1:STEP1 },
  { who:"penelope",  from:"bedside_r",    to:"bedside_l",    t0:TURN0, t1:TURN1 },
  // 4. the nurse goes FIRST, two legs ahead the whole way down
  { who:"eurycleia", from:"chest",        to:"chamber_door", t0:LEAD0, t1:54 },
  { who:"eurycleia", from:"chamber_door", to:"stair_head",   t0:54,   t1:56 },
  { who:"eurycleia", from:"stair_head",   to:"stair_upper",  t0:56,   t1:58 },
  { who:"eurycleia", from:"stair_upper",  to:"landing",      t0:58,   t1:60 },
  { who:"eurycleia", from:"landing",      to:"stair_lower",  t0:60,   t1:62 },
  { who:"eurycleia", from:"stair_lower",  to:"stair_foot",   t0:62,   t1:64 },
  { who:"eurycleia", from:"stair_foot",   to:"low_floor",    t0:64,   t1:66 },
  { who:"penelope",  from:"bedside_l",    to:"chamber_door", t0:CROSS0, t1:CROSS1 },
  { who:"penelope",  from:"chamber_door", to:"stair_head",   t0:DESC0, t1:60 },
  { who:"penelope",  from:"stair_head",   to:"stair_upper",  t0:60,   t1:62 },
  { who:"penelope",  from:"stair_upper",  to:"landing",      t0:62,   t1:64 },
  { who:"penelope",  from:"landing",      to:"stair_lower",  t0:64,   t1:66 },
  { who:"penelope",  from:"stair_lower",  to:"stair_foot",   t0:66,   t1:68 },
  { who:"penelope",  from:"stair_foot",   to:"threshold_r",  t0:68,   t1:ARRIVE },
];

/* ---- blockingAt()/occupancyAt() for a CUTAWAY SECTION (note A) -----------
   engine/blocking.mjs's semantics, resolving through the room's own
   `stationAt()` — which throws on an unknown name — instead of the one-floor
   README §5 projection. */
function sectionBlockingAt(moves, t, initial = {}){
  const out = {}, held = { ...initial };
  const ordered = [...moves].sort((a, b) => a.t0 - b.t0);
  for (const m of ordered){
    if (t >= m.t1) held[m.who] = m.to;
    else if (t >= m.t0) held[m.who] = m.from;
    else if (held[m.who] == null) held[m.who] = m.from;
  }
  for (const [who, name] of Object.entries(held)){
    const live = ordered.find(m => m.who === who && t >= m.t0 && t < m.t1);
    if (live){
      const a = stationAt(live.from), b = stationAt(live.to);
      const u = smooth(clamp01((t - live.t0) / Math.max(1e-6, live.t1 - live.t0)));
      out[who] = { x:lerp(a.x, b.x, u), y:lerp(a.y, b.y, u),
                   scale:lerp(a.scale, b.scale, u), floor:u < .5 ? a.floor : b.floor,
                   station:null, from:live.from, to:live.to, u, moving:true };
    } else {
      const s = stationAt(name);
      out[who] = { x:s.x, y:s.y, scale:s.scale, floor:s.floor,
                   station:name, from:name, to:name, u:0, moving:false };
    }
  }
  return out;
}
function sectionOccupancyAt(moves, t, initial = {}){
  const b = sectionBlockingAt(moves, t, initial);
  const o = {};
  for (const [who, p] of Object.entries(b)) o[who] = p.station ?? p.to;
  return o;
}

/* ---- THE ROOM (notes F, G) ---------------------------------------------- */
const roomState = t => t < WAKE  ? "night"
                     : t < PROOF ? "waking"
                     : t < LEAD0 ? "dressing"
                     : t < FIRST ? "descent"
                     :             "first_sight";
/* the asset's own occlusion.front, expressed in its own layer names */
const FRONT_LAYERS = ["understair", "rail", "threshold", "furniture"];
const BACK_LAYERS  = field.layers.filter(l => !FRONT_LAYERS.includes(l));

/* ---- THE BOX A BODY IS DRAWN IN (the B21-S01 device) --------------------
   placeInstance() hands a module a box of the STAGE's aspect (1120x760).
   character.penelope lays her veil, hair drape and skirt out in box-W
   fractions, so in a landscape box the queen renders as a wide bell with the
   veil off her shoulder. Both figures are therefore drawn into the PORTRAIT
   box the atlas uses for characters, 660/880, and blitted. FIG_FLOOR is the
   rig's own floor line — figure-hero plants the ankles at 0.90 of its box. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
/* note D — ONE body height for the whole section, off the room's own numbers */
const BODY = 0.285;

/* blit a module into a portrait box anchored by a point INSIDE the box, with
   an optional quarter turn about that point (note C). `sig` is required:
   keyedModuleCanvas caches on pose/band/t only, so without it a change of gaze
   or brow returns the previous frame's canvas. */
function placeFig(offctx, W, H, mod, { x, y, hFrac, ar = FIG_AR, fx = 0.5,
                                       fy = FIG_FLOOR, rot = 0, state = {},
                                       sig = "", pad = FIG_PAD, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.save();
  offctx.translate(x * W, y * H);
  if (rot) offctx.rotate(rot);
  offctx.drawImage(cv, -fx * w - pad * w, -fy * h - pad * h);
  offctx.restore();
}

/* ---- THE QUOTED PROOF: one declared window on the quote panel (note E) ----
   set_piece.scar-evidence lays its panel out at L.qx0..qx1 = .200..790,
   qy0..qy1 = .098..428 with a .040 W lean, its two speech glyphs at (.238,.126)
   and (.716,.336), its four register crosses at x .02..07 and its measuring
   rule and ticks at x .88..96. The window below is the panel, its brackets and
   both glyphs, and stops OUTBOARD of the crosses and INBOARD of the rule; the
   relay chain, the ledger and the numerals start at y .49 and are all below
   it. */
const EV_CW = 460, EV_CH = 610;
const EV_WIN = { x0:.170, y0:.072, x1:.848, y1:.458 };
/* WHERE IT HANGS, AND WHY NOT BETWEEN THEM. The obvious place was the air
   between the nurse and the queen, and it failed: the queen breaks off the
   embrace to `chest` (x .577) at TURN1 and her head rises to y .199, straight
   through it. So it hangs over the STAIR WELL instead — the one part of the
   chamber no body ever occupies, and the right place for it anyway, since the
   thing it diagrams is a proof being carried DOWN a stair. It is clear of the
   truss above (L.truss.y = .196, its chevron out to y .26), clear of the
   chamber-door pier to its right (L.pier.x1 = .421), and it stands on nothing:
   it is keyed, so the room shows between its lines — reported speech, not a
   poster nailed to the wall. */
const EV_W  = 0.155;
const EV_CX = (ROOM.land.x0 + ROOM.stairA.xTop) / 2;   // .234 — the stair well
const EV_BASE = ROOM.floorY - 0.015;                   // .440 — just off the floor
function placeEvidence(offctx, W, H, state, sig){
  const cv = keyedModuleCanvas(evidence, EV_CW, EV_CH, state, sig, 0.895);
  const wPx = EV_W * W;
  const hPx = wPx * ((EV_WIN.y1 - EV_WIN.y0) * EV_CH)
                  / ((EV_WIN.x1 - EV_WIN.x0) * EV_CW);
  offctx.drawImage(cv,
    EV_WIN.x0 * EV_CW, EV_WIN.y0 * EV_CH,
    (EV_WIN.x1 - EV_WIN.x0) * EV_CW, (EV_WIN.y1 - EV_WIN.y0) * EV_CH,
    EV_CX * W - wPx / 2, EV_BASE * H - hPx, wPx, hPx);
}
const evidenceMode = t => t < HEARD   ? "spoken"
                        : t < DOUBTED ? "heard"
                        : t < RESERVE ? "doubted"
                        :               "reserved";

export const scene = {
  id:"OD-B23-S01",
  title:"Eurycleia Wakes Penelope",
  book:23,
  plan:"upper-chamber-and-stair (cutaway section — the room's own station table)",
  duration:D,
  beats:[
    "Eurycleia wakes Penelope and says Odysseus has returned and killed the suitors.",
    "Penelope first thinks the nurse has gone mad or that a god punished the men.",
    "Eurycleia offers the scar as proof and describes the king waiting below.",
    "Penelope descends, divided between embracing him and testing him from a distance.",
  ],
  exitState:
    "Night, in the house of Odysseus, at the head of the stair and the bottom " +
    "of it. Penelope is off her bed, out of her chamber and DOWN — standing " +
    "inside the doorway of the hall at `threshold_r`, one step short of " +
    "crossing it, with the hall burning in front of her: she has come to look " +
    "and has not decided to believe. Eurycleia has gone down ahead of her and " +
    "is standing off on the low floor at `low_floor`, having told it twice and " +
    "offered the scar; the scar is SPOKEN and reserved, not accepted — the " +
    "queen keeps her own test, which is the bed, and it is not spent yet. The " +
    "chamber above is left as she left it: covers thrown back, the clothes " +
    "chest open, the robe gone off its peg, the lamp low and the chamber door " +
    "standing open. S02 opens on exactly this frame, from inside the hall: the " +
    "queen in the doorway at the head of the megaron's `stair_up` corner, the " +
    "man across the fire, and nobody yet moving toward anybody.",
  exitOccupancy:sectionOccupancyAt(MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    eurycleia:"entrance:stair (`stair_foot`) — she is already on the low floor " +
              "at t=0 and climbs from t=2",
    penelope:"none — she is asleep on the bed (`bed_lie`) when the scene opens",
    evidence:"not a body: it arrives as SPEECH at PROOF=36 and is gone at 47",
  },
  exits:{
    penelope:"none in this room — she holds `threshold_r`, in the doorway, into S02",
    eurycleia:"none — she holds `low_floor`, out of the doorway, into S02",
    evidence:"sealed at RESERVE=45 and struck from the frame at 47; the claim " +
             "stays open into S02 because ACCEPTED is never struck",
  },
  walkable:"the room's own three bands and nothing else: `walkable:chamber` " +
           "(y .440–.462, the upper floor between the door pier and the bed), " +
           "`walkable:stair` (x .090–.400, the eleven treads and the half " +
           "landing) and `walkable:ground` (y .870–.892, the low floor and the " +
           "hall threshold). The bed is lain on, not walked over; the clothes " +
           "chest, the lampstand, the bench and the understair void are NOT " +
           "walkable, and no mark used here is inside any of them.",
  depthOrder:"one queue, computed: the room's back layers, then the quoted " +
             "proof (a diagram laid IN the room's air, so it goes under the " +
             "bodies and not over them), then the two figures sorted by their " +
             "own y so whoever is lower in the section is nearer and is drawn " +
             "second, then the room's declared occlusion.front — understair, " +
             "rail, doorway jambs, bench — over everything.",
  gazeTargets:{
    eurycleia:"the treads under her feet all the way up, then DOWN onto the " +
              "sleeping queen at the bedside, then the queen's face for the " +
              "whole telling, then the quoted scar between them, then back " +
              "down the stair she is leading her to",
    penelope:"nothing — closed eyes — until WAKE; then up at the nurse's face; " +
             "then away from her at DOUBT (the mad-nurse look, gaze off the " +
             "shoulder); onto the quoted scar at PROOF; then down the stair; " +
             "and at the end down and to her right, through the doorway, at " +
             "the man across the fire",
  },
  attachments:[
    { at:2,       who:"eurycleia", change:"nothing in her hands; the climb is " +
      "the whole action" },
    { at:WAKE,    who:"penelope",  change:"detaches from the bed — the covers " +
      "go back, the room state night -> waking" },
    { at:RISE1,   who:"penelope",  change:"on her feet at `bedside_r`; the " +
      "lying transform is spent (rot pi/2 -> 0, fy .45 -> .90)" },
    { at:CLOSE1,  who:"eurycleia", change:"the embrace — the room's contact " +
      "pair, `bedside_l` against `bedside_r`, 107 px apart" },
    { at:PROOF,   who:"eurycleia", change:"set_piece.scar-evidence attaches at " +
      "her MOUTH (its own attach declaration), mode `spoken` — the welt is " +
      "quoted, never present" },
    { at:HEARD,   who:"penelope",  change:"the claim reaches her: mode `heard`" },
    { at:DOUBTED, who:"penelope",  change:"mode `doubted` — the arrival is a " +
      "hollow copy of the welt, not the welt" },
    { at:RESERVE, who:"penelope",  change:"mode `reserved`: TOLD struck, HEARD " +
      "struck, ACCEPTED left empty, and the RESERVE token sealed instead" },
    { at:DESC0,   who:"penelope",  change:"the chamber door detaches behind " +
      "her; room state dressing -> descent" },
  ],
  sound:[
    { at:2,     source:"stair_foot",   cue:"an old woman's feet on stone, one tread at a time, hurrying and not able to hurry" },
    { at:8,     source:"landing",      cue:"the turn of the dog-leg; the noise of the hall dropping away behind her" },
    { at:16,    source:"chamber_door", cue:"a door pushed in on a sleeping room" },
    { at:WAKE,  source:"bed_foot",     cue:"the news, cried, too loud for the hour: he is here, and he has killed them" },
    { at:DOUBT, source:"bedside_r",    cue:"the queen's answer, flat and cold: the gods have made you mad" },
    { at:GOD,   source:"bedside_r",    cue:"and the second answer, which is a prayer: some god punished them, not a man" },
    { at:PROOF, source:"chest",        cue:"the scar described — the one sentence with the welt in it" },
    { at:RESERVE,source:"bedside_l",   cue:"nothing said; the test she keeps to herself is silent" },
    { at:DESC0, source:"stair_head",   cue:"eleven risers, two sets of feet, the lamp left burning behind them" },
    { at:FIRST, source:"hall_beyond",  cue:"the hall: fire, and men being carried out of it" },
    { at:ARRIVE,source:"threshold_r",  cue:"one step, not taken" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the room's station table or from a
     declared window. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"night" },
    { asset:"set_piece.scar-evidence", instance:"scar_01",
      anchor:{x:EV_CX,y:EV_BASE}, scale:.20, state:"spoken" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:STATIONS.bed_lie.x,y:STATIONS.bed_lie.y}, scale:.285,
      band:"threeq", pose:"profile_left" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:STATIONS.stair_foot.x,y:STATIONS.stair_foot.y}, scale:.285,
      band:"threeq", pose:"walk_neutral" },
  ],

  timeline:[
    { op:"actor.pose", target:"penelope",  at:0.0,     args:{ pose:"profile_left" } },
    { op:"actor.gaze", target:"penelope",  at:0.0,     args:{ gaze:{ x:0, y:.10 } } },
    { op:"actor.pose", target:"eurycleia", at:0.0,     args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eurycleia", at:0.0,     args:{ gaze:{ x:.28, y:-.12 } } },
    // 1. the news
    { op:"set.state",  target:"field_01",  at:WAKE,    args:{ state:"waking" } },
    { op:"actor.pose", target:"eurycleia", at:WAKE,    args:{ pose:"eury_alarm" } },
    { op:"actor.gaze", target:"eurycleia", at:WAKE,    args:{ gaze:{ x:.34, y:.28 } } },
    { op:"actor.pose", target:"penelope",  at:RISE0,   args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"penelope",  at:RISE0,   args:{ gaze:{ x:-.36, y:-.06 } } },
    // 2. mad, or a god
    { op:"actor.pose", target:"penelope",  at:DOUBT,   args:{ pose:"skepticism" } },
    { op:"actor.gaze", target:"penelope",  at:DOUBT,   args:{ gaze:{ x:.24, y:.16 } } },
    { op:"actor.pose", target:"eurycleia", at:DOUBT,   args:{ pose:"eury_clasp" } },
    { op:"actor.pose", target:"penelope",  at:GOD,     args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope",  at:GOD,     args:{ gaze:{ x:-.06, y:-.34 } } },
    // 3. the scar, offered
    { op:"set.state",  target:"field_01",  at:PROOF,   args:{ state:"dressing" } },
    { op:"actor.pose", target:"eurycleia", at:PROOF,   args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"eurycleia", at:PROOF,   args:{ gaze:{ x:.34, y:.06 } } },
    { op:"prop.state", target:"scar_01",   at:PROOF,   args:{ mode:"spoken" } },
    { op:"actor.pose", target:"penelope",  at:PROOF,   args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"penelope",  at:PROOF,   args:{ gaze:{ x:-.34, y:.10 } } },
    { op:"prop.state", target:"scar_01",   at:HEARD,   args:{ mode:"heard" } },
    { op:"prop.state", target:"scar_01",   at:DOUBTED, args:{ mode:"doubted" } },
    { op:"actor.pose", target:"penelope",  at:DOUBTED, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"penelope",  at:DOUBTED, args:{ gaze:{ x:.42, y:.06 } } },
    { op:"prop.state", target:"scar_01",   at:RESERVE, args:{ mode:"reserved" } },
    { op:"actor.pose", target:"penelope",  at:RESERVE, args:{ pose:"arms_crossed" } },
    { op:"actor.pose", target:"eurycleia", at:RESERVE, args:{ pose:"eury_hush" } },
    // 4. down
    { op:"set.state",  target:"field_01",  at:LEAD0,   args:{ state:"descent" } },
    { op:"set.state",  target:"field_01",  at:FIRST,   args:{ state:"first_sight" } },
    { op:"actor.pose", target:"penelope",  at:ARRIVE,  args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"penelope",  at:ARRIVE,  args:{ gaze:{ x:-.18, y:.12 } } },
    { op:"actor.pose", target:"eurycleia", at:67,      args:{ pose:"eury_clasp" } },
    { op:"timeline.capture", target:"OD-B23-S01", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = sectionBlockingAt(MOVES, t, INITIAL);
    const mode   = roomState(t);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.10 + 0.84 * (t / D));

    /* --- 1. THE ROOM, back layers first (notes F, G). One field, one asset,
       placed the way every Book XVI+ scene places a field — anchor (.50,.99),
       scale 1.0 — so this house registers on the megaron's `stair_up` corner. */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{ state:mode, t:breath, layers:BACK_LAYERS,
              status: mode === "first_sight" ? "DIVIDED"
                    : mode === "descent"     ? "DESCENDING"
                    : mode === "dressing"    ? "THE PROOF"
                    : mode === "waking"      ? "ROUSED" : "SLEEPING",
              progress:prog },
    });

    /* --- 2. THE QUOTED PROOF (note E). Under the bodies: it is in the room's
       air between them, not pasted over them. ------------------------------ */
    if (t >= PLATE0 && t < PLATE1){
      const m = evidenceMode(t);
      placeEvidence(offctx, W, H,
        { mode:m, t:0.8, reach: m === "spoken" ? 1.55 : 3,
          status:m.toUpperCase(), progress:0.42 + 0.18 * (t - PROOF) / 10 },
        `scar|${m}`);
    }

    /* --- 3. THE TWO BODIES. Drawn lower-last, so whoever is nearer the bottom
       of the section is nearer the camera (note G). ------------------------ */
    const order = ["eurycleia", "penelope"].sort((a, b) => blk[a].y - blk[b].y);
    for (const who of order){
      const p = blk[who];
      const s = st[who] || {};

      if (who === "penelope"){
        /* the lying transform, read off the move itself (note C) */
        const lie = p.station === "bed_lie" ? 1
                  : (p.from === "bed_lie" && p.to === "bedside_r") ? 1 - p.u : 0;
        /* one size, lying or standing — a body is as long as it is tall, and
           this is a section, so nothing about the floor changes it (note D).
           195 px of queen along the 281 px mattress the room paints: 0.69 of
           it, which is a woman on a royal bed. */
        const hFrac  = BODY;
        const asleep = lie > 0.999;
        const risen  = t >= RISE1;
        const doubting= t >= DOUBT && t < PROOF;
        const holding= t >= RESERVE;
        const divided= t >= ARRIVE;
        /* WHY A PROFILE ASLEEP. The first draft laid the FRONTAL rig on the
           bed and it read as a blob: a frontal body is as wide as its hair
           drape and its skirt hem, and a quarter turn makes that width the
           body's DEPTH — a woman one metre thick. `profile_left` narrows the
           silhouette to a real one, and a sleeper on her side is what the
           narrow one reads as. */
        const pose = asleep      ? "profile_left"
                   : p.moving && lie < 0.001 ? "walk_neutral"
                   : (s.pose || "hands_near_face");
        const gaze = asleep ? { x:0, y:.10 } : (s.gaze || { x:.30, y:-.06 });
        placeFig(offctx, W, H, penelope, {
          x:p.x, y:p.y, hFrac,
          fy: lerp(FIG_FLOOR, 0.45, lie), rot: lie * Math.PI / 2,
          state:{
            t: (p.moving && lie < 0.001) ? (t * 0.40) % 4 : breath,
            band:"threeq", pose, gaze,
            blink: asleep ? 1 : 0,
            mouth: t >= GOD && t < PROOF ? .50 : 0,
            browUp:   asleep ? 0 : t >= WAKE && t < DOUBT ? .70
                    : divided ? .46 : holding ? .24 : .34,
            browKnit: asleep ? 0 : doubting ? .48 : divided ? .40 : .22,
            frown:    asleep ? 0 : holding && !divided ? .30 : divided ? .34 : 0,
            eyeWide:  asleep ? 0 : t >= WAKE && t < DOUBT ? .52 : divided ? .26 : .10,
            eyeNarrow:doubting ? .38 : 0,
            jaw:      t >= GOD && t < PROOF ? .34 : 0,
            status: divided  ? "DIVIDED"
                  : t >= DESC0   ? "SHE GOES DOWN"
                  : holding      ? "HER OWN TEST"
                  : t >= PROOF   ? "THE SCAR, QUOTED"
                  : t >= GOD     ? "A GOD, NOT A MAN"
                  : t >= DOUBT   ? "THE NURSE IS MAD"
                  : risen        ? "OFF THE BED"
                  : t >= WAKE    ? "WOKEN" : "ASLEEP",
            progress:prog,
          },
          sig:`pen|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${Math.round(lie*20)}|${asleep?1:0}|${doubting?1:0}`
             + `|${holding?1:0}|${divided?1:0}`,
        });
      } else {
        const climbing = t < 19;
        const telling  = t >= WAKE && t < DESC0;
        const pose = p.moving ? "walk_neutral" : (s.pose || "eury_clasp");
        const gaze = s.gaze || { x:-.30, y:.34 };
        placeFig(offctx, W, H, eurycleia, {
          x:p.x, y:p.y, hFrac:BODY,
          state:{
            t: p.moving ? (t * 0.44) % 4 : breath,
            band:"threeq", pose, gaze,
            mouth: telling ? .55 : 0,
            browUp:   t >= WAKE && t < DOUBT ? .78 : .42,
            browKnit: .30,
            eyeWide:  t >= WAKE && t < DOUBT ? .55 : .12,
            jaw:      t >= WAKE && t < DOUBT ? .42 : telling ? .20 : 0,
            status: t >= DESC0 ? "SHE LEADS HER DOWN"
                  : t >= RESERVE ? "SHE HAS SAID IT ALL"
                  : t >= PROOF   ? "THE SCAR"
                  : t >= WAKE    ? "HE IS HERE"
                  : climbing     ? "UP THE STAIR" : "THE LOW FLOOR",
            progress:prog,
          },
          sig:`eur|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${telling?1:0}|${t>=WAKE&&t<DOUBT?1:0}|${p.moving?1:0}`,
        });
      }
    }

    /* --- 4. THE ROOM AGAIN, its declared occlusion.front over the bodies
       (note G): the understair void, the stair rail, the doorway jambs and the
       bench. No paper is repainted — the `field` layer is not in this list. */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{ state:mode, t:breath, layers:FRONT_LAYERS,
              status:"", progress:prog },
    });
  },
};
export default scene;

/* named binding so OD-B23-S02 can `import { exitOccupancy as INITIAL }`.
   Both marks are ground-floor marks of this section, and this section's ground
   floor IS the head of the megaron's `stair_up` corner, so S02 needs the
   one-line translation table named in the header — not a guess. */
export const exitOccupancy = scene.exitOccupancy;
