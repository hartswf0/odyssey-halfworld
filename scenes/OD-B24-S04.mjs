/* ============================================================
   SCENE  OD-B24-S04 — The Scar and the Orchard Trees
   Book XXIV, scene 4 of the book. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from the
   scene immediately before this one, OD-B24-S03, whose plan, ground model and
   plate grammar are continued here on purpose: this is the SAME half-minute of
   ground, ten seconds later, and it must agree with it to the pixel.

   WHERE. location.laertess-orchard, state `worked`, on the ISOLATED LABOUR PLOT
   deep in the orchard — a disc of turned earth with a staked sapling, a spoil
   heap, a leaning hoe and a basket, an exclusion radius no planted row may grow
   inside. Nobody arrives and nobody leaves. Two men are alone on it for a
   minute and a half and the last recognition of the poem is transacted between
   them in EVIDENCE: a scar at arm's length, then a count of trees given at
   speaking distance, then an embrace back at arm's length again.

   THE PLAN IS DERIVED FROM THE SET, NOT GUESSED, AND THE SET OWNS THE GROUND.
   Same division as OD-B24-S01/S03, restated because it is load-bearing:
   engine/blocking's project() bottoms out at screen y .5288 (the farm gate is
   painted at y .492) and its size falloff is 1.7:1 where this set's own ladder,
   depthAtY(), is 13:1. So THE PLAN OWNS TOPOLOGY — who is at which named
   station, what a transit interpolates along, what the unknown-station throw
   protects, what exitOccupancy hands on — and THE SET OWNS THE GROUND:
   groundOf() and sizeOf() take a station name straight back to the set's own
   exported anchors, its own lane polyline and its own depth ladder. The plan's
   z IS depthAtY() at the station, so the plan and the orchard agree about who
   is in front. Not one coordinate in this file is hand-tuned.

   Two differences from S03's plan, both deliberate:
     · the approach Catmull-Rom chain is NOT restated — nobody walks the road in
       this scene, and `threshold:farm-gate` is one of the set's own anchors, so
       the one road station this scene names is read rather than re-derived. It
       lands on (.238,.492), which is exactly where S03's onRoad(1.00) put it.
     · four ROW stations are added — rows_pear / rows_apple / rows_fig /
       rows_vine, the set's own `orchard:*` anchors. They are survey references,
       not standing places: they are where the deed plate hooks into the drawn
       orchard, so the recitation is a map of THIS farm and not a chart in the
       abstract. Nobody is ever blocked onto them.

   THE TWO PROOFS ARE PLATES, NOT WORLD OBJECTS, AND THAT IS THE WHOLE STAGING.
   set_piece.boar-scar is a CLOSE-UP REGISTRATION PLATE — a limb filling a frame
   with a measure rule and a seven-segment plate index — and set_piece.orchard-
   inventory is a SURVEYED DEED, a ledger column of counts beside a planting
   plan. Neither is a thing that can be stood in a field: blitted into the world
   the scar becomes a giant leg lying in the orchard and the deed becomes a
   billboard. They are cast the way OD-B24-S01 casts the wand and S03 the kit:
   as DETAIL PLATES hung in the open sky, each laying its own paper down first,
   walking their state on the master clock. The recitation is what walks the
   deed plate: ONE PARCEL AT A TIME, ledger cell and planting together —
   THIRTEEN pear, TEN apple, FORTY fig, FIFTY vine — and then the header, GIVEN
   over a seven-segment 113, struck heavy on `proved`. Every count on that plate
   is drawn as BAR GEOMETRY by the module itself, which is why the numbers are
   readable through the dot lattice at a sixth of the frame.

   THE LEADER IS THE ARGUMENT. A plate hung in the sky is a diagram about
   nothing until it is tied to the world. The deed plate is therefore hooked
   into the world by a dashed LEADER dropped out of its foot into the patch of
   drawn orchard whose parcel is open on it — the real pears, the real apples,
   the real figs, the real vine rows, at the set's own anchors, so the chart is
   a chart OF THIS FARM. It is drawn BEFORE the figures, so a body occludes the
   end of its own callout: the line goes behind the man, which is what a callout
   does. The scar plate is tied the other way, by position; see its note.

   ODYSSEUS DOES NOT CHANGE FACE HERE. Same reason as S03 and it is worth saying
   twice: Book 24 is the one recognition in the poem with NO disguise in it. He
   has been washed and restored since Book 23, and the false name he tried on
   his father last scene was a WORD. character.odysseus-b16 therefore holds
   `guise:"restored"` from the first frame to the last — no ramp, and so no
   restoration flare, because there is no discontinuity for one to cover. What
   changes in this scene is not his face, it is what he is willing to show.

   CONTACT PAIR, USED AS A PAIR. `meet:labor_l` / `meet:labor_r` are the set's
   authored pair, 116 stage px apart with the staked sapling standing between
   them. Laertes holds labor_r for the whole scene — he has held it since the
   first frame of S03, he does not come to meet anyone — and Odysseus is on
   labor_l for the two beats that need to be within reach, the scar and the
   collapse. THE COLLAPSE IS PLAYED ON THE PAIR AND NOT ON ONE POINT: an old man
   going into his son's arms is two bodies leaning into a shared space, which
   the pair gives; put both on one station and they resolve to identical
   coordinates and print as one blot. And the beat BETWEEN those two is played
   at a distance — see the blocking note: the count is not a thing you hold out,
   it is a hundred and thirteen trees standing in the frame behind you.

   THE THREE COMPANIONS ARE INHERITED BUT NOT DRAWN. S03's exitOccupancy has
   Telemachus at the farmhouse door, Eumaeus at the outbuilding and Philoetius
   at the tool shed, getting a meal ready. They are alive, they are on this
   farm, and dropping them would be a lie — so they are carried through INITIAL
   and handed on by exitOccupancy untouched. They are not CAST, for the reason
   S03 gives at length: those three stations sit above the terrace line at
   y .476, where a foreground-scale body reads as standing on the farmhouse
   roof, and they are indoors at their jobs half a mile up-country besides. The
   isolation of the old man is the scene.

   TONE. The set's `worked` table is light (sky 1, ground 2, field 3) and
   nothing here darkens it. Both plates lay paper down before their window goes
   in; the scar plate's `touched` state is drawn with a CUT layer stack, because
   the module's full instrumentation for that state printed as a blot at this
   size (see SCAR_LAYERS); the leader is dashed, so its lightness comes from
   gaps rather than from grey ink that the dot lattice would simply delete; and
   the two figures are ordinary — a grey patched tunic over bare shins and a
   white-grey head on Laertes. ZERO hand-drawn ctx overpaint on any figure in
   this file. The rig does all of it.

   Beats (Od. 24.331–355):
     1. Odysseus shows the boar scar as physical proof.
     2. He names the thirteen pear trees, ten apple trees, forty fig trees and
        fifty vine rows Laertes gave him as a child.
     3. Laertes recognizes the private map of inheritance and collapses into his
        son's arms.
     4. He fears that Ithaca lacks men willing to defend them from the suitors'
        kin.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S04.mjs --t 18  (the scar)
            node harness/render-scene.mjs scenes/OD-B24-S04.mjs --t 54  (the count)
            node harness/render-scene.mjs scenes/OD-B24-S04.mjs --t 82  (the fear)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, lerp, PAPER, INK }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { anchors as FARM } from "../assets/location/laertess-orchard.mjs";
import odysseus from "../assets/character/odysseus-b16.mjs";
import laertes  from "../assets/character/laertes.mjs";
import deed     from "../assets/set_piece/orchard-inventory.mjs";
import scar     from "../assets/set_piece/boar-scar.mjs";

const FIELD_ASSET = "location.laertess-orchard";
const D = 92;

/* ==========================================================================
   THE SET'S OWN GEOMETRY, RESTATED
   location.laertess-orchard keeps its depth ladder and its lane private. Both
   are copied here verbatim from the set (and match OD-B24-S03 exactly) so that
   a station is a point ON the drawn lane and a body's size is the size that
   patch of ground is painted at.
   ========================================================================== */
const HORIZON = 0.280, NEAR_Y = 1.040;
const groundU  = y => clamp((y - HORIZON) / (NEAR_Y - HORIZON), 0, 1);
const depthAtY = y => lerp(0.075, 1.000, Math.pow(groundU(y), 1.22));

/* the lane — the walk from the yard out to where the old man works. Its last
   point is cut off the set's own labour plot, read from the exported anchor. */
const LAB = FARM["labor:plot"];
const LANE = [ {x:0.352,y:0.566}, {x:0.436,y:0.664}, {x:0.510,y:0.762},
               {x:0.578,y:0.842}, {x:LAB.x - 0.038, y:LAB.y - 0.020} ];
function lanePtN(u){
  const segs = LANE.length - 1;
  const q = clamp(u, 0, 1) * segs;
  const i = Math.min(Math.floor(q), segs - 1), s = q - i;
  return { x: lerp(LANE[i].x, LANE[i+1].x, s), y: lerp(LANE[i].y, LANE[i+1].y, s) };
}

/* ==========================================================================
   THE LOCAL PLAN
   Two kinds of station, neither of them a typed coordinate: ON-LANE stations
   carry the lane parameter they were cut at, FIXED stations are the set's own
   exported anchors. A transit between two lane stations follows the lane.
   ========================================================================== */
const onLane = k => ({ curve:"lane", k, p:lanePtN(k) });
const atSet  = key => {
  const a = FARM[key];
  if (!a) throw new Error(`[OD-B24-S04] the set exports no anchor "${key}"`);
  return { curve:null, k:null, p:{ x:a.x, y:a.y } };
};

const GROUND = {
  /* the steading — where the meal is being got ready, out of frame all scene */
  farm_gate:    atSet("threshold:farm-gate"),
  house_door:   atSet("farm:house-door"),
  outbuilding:  atSet("farm:outbuilding"),
  tool_shed:    atSet("farm:tool-shed"),
  yard:         atSet("yard:feast"),
  yard_hearth:  atSet("yard:hearth"),
  /* the orchard gate and the drawn lane back up to it */
  orchard_gate: atSet("threshold:orchard-gate"),
  lane_head:    onLane(0.25),
  lane_mid:     onLane(0.50),
  lane_foot:    onLane(0.75),
  /* THE LABOUR PLOT and its authored contact pair — the whole scene */
  labor_plot:   atSet("labor:plot"),
  labor_l:      atSet("meet:labor_l"),
  labor_r:      atSet("meet:labor_r"),
  labor_tools:  atSet("labor:tools"),
  /* THE COUNTED GROUND. Survey references, never standing places: these four
     are where the deed plate hooks into the orchard the deed is a deed OF. */
  rows_pear:    atSet("orchard:pears"),
  rows_apple:   atSet("orchard:apples"),
  rows_fig:     atSet("orchard:figs"),
  rows_vine:    atSet("orchard:vines"),
};

export const laertesPlot = makePlan({
  id:"laertes-plot",
  name:"Laertes's farm — the labour plot, the lane back, and the counted rows",
  notes:"Local plan for OD-B24-S04, cut off location.laertess-orchard's own " +
        "lane polyline and its own exported anchors, and agreeing station for " +
        "station with OD-B24-S03's laertes-farm plan where the two overlap. " +
        "z IS the set's depth at the station, because project() bottoms out at " +
        "y .5288 and its 1.7:1 falloff cannot carry a 13:1 landscape. " +
        "`labor_l`/`labor_r` are the set's authored contact pair and are never " +
        "occupied by one body. rows_* are survey references for the deed " +
        "plate's leaders, not walkable ground.",
  stations:Object.fromEntries(Object.entries(GROUND).map(([k, g]) => [k, {
    x:+clamp(g.p.x, 0, 1).toFixed(4),
    z:+depthAtY(g.p.y).toFixed(4),
  }])),
  fixtures:[
    { id:"sapling",   kind:"set_piece", at:"labor_plot"  },
    { id:"hoe",       kind:"prop",      at:"labor_tools" },
    { id:"farm_gate", kind:"threshold", at:"farm_gate"   },
    { id:"pears",     kind:"planting",  at:"rows_pear"   },
    { id:"apples",    kind:"planting",  at:"rows_apple"  },
    { id:"figs",      kind:"planting",  at:"rows_fig"    },
    { id:"vines",     kind:"planting",  at:"rows_vine"   },
  ],
});

/* ---- the set's ground, resolved off blockingAt's own from/to/u ------------
   A transit between two stations of the SAME curve interpolates that curve's
   parameter and is evaluated on the curve, so the one walk in this file goes
   UP THE DRAWN LANE and not across the planted rows. */
const G = name => {
  const g = GROUND[name];
  if (!g) throw new Error(`[OD-B24-S04] station "${name}" has no ground`);
  return g;
};
function groundOf(p){
  if (!p.moving){ const g = G(p.station); return { x:g.p.x, y:g.p.y }; }
  const a = G(p.from), b = G(p.to), u = p.u;
  if (a.curve && a.curve === b.curve && a.curve === "lane")
    return lanePtN(lerp(a.k, b.k, u));
  return { x:lerp(a.p.x, b.p.x, u), y:lerp(a.p.y, b.p.y, u) };
}
const sizeOf = p => depthAtY(groundOf(p).y);

/* one height for every standing body on this farm, times the set's own falloff.
   Identical to OD-B24-S03: .62 puts a man at the labour plot at about 275 stage
   pixels, over the set's own near-camera fig (250) and well clear of its near
   orchard rows (115). It is NOT the row-stamp scale, and it must not be — the
   last recognition in the poem is an old man's face, and a face pitched at
   stamp scale is a 60-pixel smudge. See S03's FIGURE SCALE note. */
const MAN = 0.62;

/* ==========================================================================
   CONTINUITY IN — inherited whole, from the same room, untranslated.
   OD-B24-S03 ends on this exact plot with these exact five bodies, and every
   station it hands over — labor_r, labor_l, house_door, outbuilding, tool_shed
   — is a station of this plan under the same name and at the same coordinate.
   So there is no crossing map here and there must not be one: brief section F
   translates when the ROOM changes, and the room has not changed. If a station
   ever drifts between the two files, blockingAt() throws, which is the point.
   ========================================================================== */
import { exitOccupancy as INITIAL } from "./OD-B24-S03.mjs";

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   THE DISTANCE BETWEEN THE TWO MEN IS THE ONLY THING THAT MOVES IN THIS SCENE,
   AND IT MOVES TWICE. Two proofs are given and they are given at two different
   distances, which is not a compositional convenience but what the proofs are:

   · THE SCAR IS GIVEN AT ARM'S LENGTH. He holds labor_l — his half of the
     set's authored contact pair, 116 px from his father with the staked
     sapling standing between them — because a wound is shown by baring it and
     letting the other man put his hand on it. At that range two
     foreground-scale bodies necessarily overlap. That overlap is the beat.
   · THE COUNT IS GIVEN AT SPEAKING DISTANCE. It is not held in the hand, it is
     out there: thirteen pears, ten apples, forty figs, fifty vine rows, all of
     them planted on this farm and all of them in frame. So he steps off the
     pair and back UP THE DRAWN LANE to `lane_mid` — 208 px west and a whole
     depth step up-frame, S03's own talking distance — turns out to the rows,
     and counts them where they stand. Two clearly separated bodies at two
     clearly different sizes, with the deed plate hooked into the real trees
     above them. Drafted with him held on the pair for all ninety seconds, the
     two figures printed as one ink mass for a minute and a half.
   · AND THEN HE COMES BACK, and that is the recognition. lane_mid ->
     lane_foot -> labor_l, arriving on the pair at t=68, the exact second the
     deed plate strikes PROVED and his father's stoop lets go.

   Every leg of both journeys is walked on the drawn lane: the transits between
   lane stations interpolate the lane's own parameter, so he follows the curve
   the set painted instead of cutting across planted rows. The one non-lane hop,
   labor_l <-> lane_foot, is a single step off the turned earth onto the path.
   Laertes never moves. He has held labor_r since the first frame of S03. */
const MOVES = [
  /* out to speaking distance, to count the trees where they are standing */
  { who:"odysseus", from:"labor_l",  to:"lane_foot", t0:34, t1:38 },
  { who:"odysseus", from:"lane_foot", to:"lane_mid", t0:38, t1:43 },
  /* and back in, as the old man breaks */
  { who:"odysseus", from:"lane_mid",  to:"lane_foot", t0:60, t1:64 },
  { who:"odysseus", from:"lane_foot", to:"labor_l",   t0:64, t1:68 },
];

/* ==========================================================================
   THE TWO PLATES
   Each hangs in the open sky, lays its own paper down, and never touches the
   ground the figures stand on. Windows are blitted 1:1 into a destination
   fitted at the window's OWN aspect, so no register is ever resampled and the
   plate keeps its contour weight.
   ========================================================================== */

/* ---- 1. THE SCAR: the whole close-up plate, no window --------------------
   Hung in the sky DIRECTLY OVER THE MAN IT IS A CLOSE-UP OF, which is how it is
   tied to him — see the leader note in stage(). Drafted in the top-left corner
   instead, over the empty sky above the road, it was a plate about nobody: it
   needed a callout raked across the entire steading to reach his thigh, and
   that line read as one more piece of farm. Over him it needs no line at all.
   The plate is gone by t=34, before the deed plate arrives, so the two never
   share the sky. */
const SCAR_AR  = 0.66;                                   // plate w : h
const SCAR_BOX = { x0:0.596, y0:0.058, x1:0.810, y1:0.400 };
/* hidden -> bared -> touched: the flap comes off the leg, then the old man's
   hand goes on the ridge. The module's own states, on the master clock. */
const SCAR_AT = t => t <  5 ? null
                   : t < 11 ? "hidden"
                   : t < 25 ? "bared"
                   : t < 34 ? "touched"
                            : null;
/* THE TOUCHED STATE IS DRAWN WITH A CUT LAYER STACK, and this is the tone note
   for the whole file. The module's own `touched` default adds a reticle ring of
   radius .205·W, three fingertip pads at ink level 3 and nine pucker ticks, all
   of them landing on the same 40 px of plate as the welt and the seam. At the
   size this plate is hung — 172 px wide, a sixth of the frame — that stack
   printed as one black blot with a wound somewhere inside it. The module
   declares `layers` as a channel for exactly this, so the scene passes the
   subset that carries the MEANING of the beat — a hand laid on the ridge — and
   drops the instrumentation that only reads at full-plate size. Light plane,
   dark accents, paper still showing. */
const SCAR_LAYERS = {
  touched:["limb","rim","muscle","welt","seam","touch","rule","marks","index"],
};

/* ---- 2. THE DEED: one parcel at a time, top right ------------------------ */
const DEED_AR  = 0.72;                                   // sheet w : h
const DEED_BOX = { x0:0.330, y0:0.052, x1:0.962, y1:0.300 };
const DEED_WIN = {
  /* ledger cell + planting for one species, read together */
  pear:  { x0:0.052, y0:0.158, x1:0.948, y1:0.348, named:1, rows:"rows_pear"  },
  apple: { x0:0.052, y0:0.342, x1:0.948, y1:0.520, named:2, rows:"rows_apple" },
  fig:   { x0:0.052, y0:0.514, x1:0.948, y1:0.734, named:3, rows:"rows_fig"   },
  vine:  { x0:0.052, y0:0.728, x1:0.948, y1:0.936, named:4, rows:"rows_vine"  },
  /* the head of the deed: GIVEN over a seven-segment 113, and the gift seal —
     a sapling handed down — straddling the spine. The total struck heavy. */
  given: { x0:0.050, y0:0.038, x1:0.640, y1:0.178, named:4, rows:null, proved:true },
};
const DEED_AT = t => t < 36 ? null
                   : t < 44 ? "pear"
                   : t < 52 ? "apple"
                   : t < 60 ? "fig"
                   : t < 68 ? "vine"
                            : "given";

/* paper + border under a plate, so nothing of the world shows through it */
function plateField(offctx, x, y, w, h){
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 4;
  offctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  offctx.restore();
}

/* fit a window of a sheet inside a box at the window's own aspect. Returns the
   destination rect AND the sheet size that makes the blit 1:1. */
function fitWindow(W, H, box, sheetAR, win){
  const ww = win.x1 - win.x0, wh = win.y1 - win.y0;
  const ar = (ww * sheetAR) / wh;                        // this window on screen
  const bw = (box.x1 - box.x0)*W, bh = (box.y1 - box.y0)*H;
  let dw = bw, dh = bw / ar;
  if (dh > bh){ dh = bh; dw = bh * ar; }
  return { dx: box.x1*W - dw, dy: box.y0*H + (bh - dh)*0.5, dw, dh,
           cw: dw / ww, ch: dh / wh, ww, wh };
}

/* a dashed callout leader, drawn UNDER the figures so a body occludes the end
   of its own line. It is a reference, not a beam — but it is DASHED AND FULL
   WEIGHT rather than thin and pale, because pale is how a line dies: drafted at
   2.2 px and .34 alpha it vanished from the plate completely, since a hairline
   that pale averages under the dotify threshold inside its lattice cell and
   prints no dot at all. Lightness comes from the GAPS, not from grey ink. */
function leader(offctx, x0, y0, x1, y1){
  offctx.save();
  offctx.strokeStyle = INK; offctx.lineWidth = 5; offctx.globalAlpha = 0.85;
  offctx.lineCap = "butt"; offctx.setLineDash([16, 14]);
  offctx.beginPath(); offctx.moveTo(x0, y0); offctx.lineTo(x1, y1); offctx.stroke();
  offctx.setLineDash([]);
  offctx.beginPath(); offctx.arc(x1, y1, 10, 0, 7); offctx.stroke();
  offctx.restore();
}

export const scene = {
  id:"OD-B24-S04",
  title:"The Scar and the Orchard Trees",
  book:24,
  plan:"laertes-plot",
  duration:D,
  beats:[
    "Odysseus shows the boar scar as physical proof.",
    "He names the thirteen pear trees, ten apple trees, forty fig trees, and fifty vine rows Laertes gave him as a child.",
    "Laertes recognizes the private map of inheritance and collapses into his son's arms.",
    "He fears that Ithaca lacks men willing to defend them from the suitors' kin.",
  ],
  exitState:"The isolated labour plot deep in Laertes's orchard, both proofs " +
    "given and accepted. The scar was bared first — the tusk-wound above the " +
    "right knee, the mark Eurycleia knew in Book 19 — held out and put under " +
    "the old man's own hand; then the private map: thirteen pear trees, ten " +
    "apple trees, forty fig trees and fifty rows of vines, the count of a farm " +
    "a father walked a small boy round and gave away tree by tree, one hundred " +
    "and thirteen in all. Nothing about a resemblance, everything about a " +
    "holding only the two of them could know. Laertes has come up out of the " +
    "stoop he has held since S03 — upright for the first time in the book, arms " +
    "wide, weeping — and gone into his son's arms at the contact pair beside " +
    "the staked sapling, where he still stands. Odysseus is on the other half " +
    "of that pair: he had stepped back up the lane to speaking distance to " +
    "count the trees where they stand, and came back down it to arrive on the " +
    "pair at the exact second the count was accepted. He has not moved since. " +
    "But the recognition does not end the danger and the old man says so: he is " +
    "afraid there is no one left in Ithaca willing to stand with them when the " +
    "suitors' families come, and both of them are looking off up the country as " +
    "he says it — past the orchard gate, up the lane, to the steading, the farm " +
    "gate and the road down from town. Telemachus is at the farmhouse door, Eumaeus at the " +
    "outbuilding and Philoetius at the tool shed, still getting the meal ready, " +
    "out of frame the whole scene. The deed plate stands on its last window: " +
    "GIVEN, over a seven-segment 113, struck heavy on PROVED.",
  exitOccupancy:occupancyAt(laertesPlot, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ odysseus:"none — already at labor_l, where OD-B24-S03 left him, " +
                       "arms open from an embrace his father had not returned",
              laertes:"none — labor_r, held since the first frame of S03",
              telemachus:"INHERITED, NOT CAST — house_door, getting the meal ready",
              eumaeus:"INHERITED, NOT CAST — outbuilding",
              philoetius:"INHERITED, NOT CAST — tool_shed" },
  exits:{ odysseus:"none — labor_l. He leaves the pair at t=34 for speaking " +
                   "distance (lane_mid) and is back on it at t=68 for the " +
                   "embrace; the scene ends where it began, one step apart",
          laertes:"none — labor_r, where he has stood for two scenes",
          telemachus:"none — house_door", eumaeus:"none — outbuilding",
          philoetius:"none — tool_shed" },
  walkable:"the stations of the laertes-plot plan and nothing else: the labour " +
           "plot with its authored contact pair (labor_l, labor_r, labor_plot, " +
           "labor_tools), the drawn lane back up to the orchard gate " +
           "(lane_foot, lane_mid, lane_head, orchard_gate), and the steading " +
           "(yard, yard_hearth, house_door, outbuilding, tool_shed, farm_gate). " +
           "rows_pear / rows_apple / rows_fig / rows_vine are NOT walkable — " +
           "they are planted ground, and exist only as the deed plate's leader " +
           "targets. blockingAt() throws on anything else, which is the " +
           "cross-scene check.",
  depthOrder:"the set paints the field first. Then the deed plate's leader, on " +
             "the ground plane, so a body occludes the end of the callout. " +
             "Then one figure queue sorted by the SET's own ground y, far " +
             "first — which puts Laertes BEHIND Odysseus while Odysseus is down " +
             "on the pair, and IN FRONT of him for the whole count, when " +
             "Odysseus is up the lane at speaking distance. Then the two " +
             "plates, laid over the sky last.",
  gazeTargets:{ odysseus:"his own bared thigh for the scar, then his father, " +
                         "then out along the real rows as he counts them, then " +
                         "his father again, and at the end off up the lane " +
                         "toward the farm gate and the road from town",
                laertes:"the offered scar, close and down; then the rows his " +
                        "son is pointing at, which are his own planting; then " +
                        "his son's face; then, on the fear, the country" },
  attachments:[
    { at: 0, who:"scar_01", change:"absent" },
    { at: 5, who:"scar_01", change:"scar plate struck in HIDDEN — the garment " +
      "flap still over the limb, the marker a dashed ghost under it" },
    { at:11, who:"scar_01", change:"BARED — the flap off: welt, seam, pucker " +
      "ticks, the measure rule and the plate index" },
    { at:25, who:"scar_01", change:"TOUCHED — the reticle and three fingertip " +
      "contact pads across the ridge: his father's hand on the proof" },
    { at:34, who:"scar_01", change:"struck — the hand comes off the leg as he " +
      "steps back; the body proof is spent and the deed takes the frame" },
    { at:36, who:"deed_01", change:"deed plate struck in on PEAR — ledger cell " +
      "and planting together, thirteen counted as bar geometry, leader hooked " +
      "into the drawn pear rows at rows_pear" },
    { at:44, who:"deed_01", change:"window walks to APPLE — ten; leader to rows_apple" },
    { at:52, who:"deed_01", change:"window walks to FIG — forty; leader to rows_fig" },
    { at:60, who:"deed_01", change:"window walks to VINE — fifty rows; leader to rows_vine" },
    { at:68, who:"deed_01", change:"window walks to the head of the deed: " +
      "GIVEN over 113, the gift seal, struck heavy on PROVED. No leader — the " +
      "total is about the whole farm, and hooks to no single parcel" },
    { at:34, who:"odysseus", change:"detached from the contact pair; up the " +
      "drawn lane to speaking distance" },
    { at:68, who:"odysseus", change:"back on the pair, in time to take him" },
    { at:68, who:"laertes", change:"the stoop is released — upright for the " +
      "first time in the book, and into his son's arms on the contact pair" },
  ],
  sound:[
    { at: 4, source:"labor_l",  cue:"cloth pulled aside; nothing said" },
    { at:14, source:"labor_r",  cue:"an old man's breath stopping" },
    { at:25, source:"labor_l",  cue:"a hand laid on skin, and held there" },
    { at:36, source:"lane_mid", cue:"a count begun quietly: thirteen pear trees" },
    { at:52, source:"rows_fig", cue:"forty fig trees, named out over the rows" },
    { at:68, source:"labor_r",  cue:"a cry, and the whole weight of a man going " +
      "forward into another man" },
    { at:78, source:"labor_r",  cue:"and who in Ithaca will stand with us" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"worked" },
    { asset:"character.laertes", instance:"laertes",
      anchor:{x:.696,y:.893}, scale:.50, band:"threeq", pose:"lae_doubting" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.592,y:.909}, scale:.50, band:"threeq", pose:"arms_open" },
    { asset:"set_piece.boar-scar", instance:"scar_01",
      anchor:{x:.113,y:.400}, scale:.20, pose:"bared" },
    { asset:"set_piece.orchard-inventory", instance:"deed_01",
      anchor:{x:.760,y:.300}, scale:.32, pose:"naming" },
  ],

  timeline:[
    // 1 — the scar. He is still standing as S03 left him, arms open.
    { op:"actor.pose", target:"odysseus", at: 0.0, args:{ pose:"arms_open" } },
    { op:"actor.gaze", target:"odysseus", at: 0.0, args:{ gaze:{ x:.44, y:.06 } } },
    { op:"actor.pose", target:"laertes",  at: 0.0, args:{ pose:"lae_doubting" } },
    { op:"actor.gaze", target:"laertes",  at: 0.0, args:{ gaze:{ x:-.54, y:.06 } } },
    { op:"actor.pose", target:"odysseus", at: 5.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus", at: 5.0, args:{ gaze:{ x:.16, y:.52 } } },
    { op:"fx.play",    target:"scar_01",  at: 5.0, args:{ dir:"hidden" } },
    { op:"actor.pose", target:"odysseus", at:11.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus", at:11.0, args:{ gaze:{ x:.22, y:.44 } } },
    { op:"set.state",  target:"scar_01",  at:11.0, args:{ state:"bared" } },
    { op:"actor.pose", target:"laertes",  at:14.0, args:{ pose:"lae_examining" } },
    { op:"actor.gaze", target:"laertes",  at:14.0, args:{ gaze:{ x:-.36, y:.30 } } },
    { op:"actor.pose", target:"odysseus", at:25.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus", at:25.0, args:{ gaze:{ x:.42, y:.10 } } },
    { op:"set.state",  target:"scar_01",  at:25.0, args:{ state:"touched" } },
    // 2 — the count. He steps back to speaking distance and names the rows.
    { op:"actor.pose", target:"odysseus", at:34.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus", at:34.0, args:{ gaze:{ x:.30, y:-.10 } } },
    { op:"actor.pose", target:"odysseus", at:43.0, args:{ pose:"hand_point" } },
    { op:"actor.gaze", target:"odysseus", at:43.0, args:{ gaze:{ x:.58, y:-.16 } } },
    { op:"fx.play",    target:"deed_01",  at:36.0, args:{ dir:"pear" } },
    { op:"actor.gaze", target:"laertes",  at:39.0, args:{ gaze:{ x:.34, y:-.12 } } },
    { op:"set.state",  target:"deed_01",  at:44.0, args:{ state:"apple" } },
    { op:"actor.pose", target:"odysseus", at:52.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus", at:52.0, args:{ gaze:{ x:.62, y:-.04 } } },
    { op:"set.state",  target:"deed_01",  at:52.0, args:{ state:"fig" } },
    { op:"set.state",  target:"deed_01",  at:60.0, args:{ state:"vine" } },
    { op:"actor.gaze", target:"laertes",  at:60.0, args:{ gaze:{ x:-.40, y:.06 } } },
    { op:"actor.pose", target:"odysseus", at:60.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus", at:60.0, args:{ gaze:{ x:.44, y:.06 } } },
    // 3 — it lands. He comes upright and goes forward into his son.
    { op:"set.state",  target:"deed_01",  at:68.0, args:{ state:"given" } },
    { op:"actor.pose", target:"laertes",  at:68.0, args:{ pose:"lae_embracing" } },
    { op:"actor.gaze", target:"laertes",  at:68.0, args:{ gaze:{ x:-.10, y:-.06 } } },
    { op:"actor.pose", target:"odysseus", at:68.0, args:{ pose:"arms_open" } },
    { op:"actor.gaze", target:"odysseus", at:68.0, args:{ gaze:{ x:.40, y:.08 } } },
    { op:"actor.pose", target:"odysseus", at:72.0, args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus", at:72.0, args:{ gaze:{ x:.24, y:.34 } } },
    // 4 — and who is left in Ithaca to stand with us
    { op:"actor.pose", target:"laertes",  at:78.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"laertes",  at:78.0, args:{ gaze:{ x:-.60, y:-.14 } } },
    { op:"actor.pose", target:"odysseus", at:84.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus", at:84.0, args:{ gaze:{ x:-.46, y:-.10 } } },
    { op:"timeline.capture", target:"OD-B24-S04", at:91.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s    = stateAt(scene, t);
    const blk  = blockingAt(laertesPlot, MOVES, t, INITIAL);
    const prog = Math.min(.96, .10 + .84*(t/D));

    /* the field first — it paints the whole steading and the orchard, and
       everything keys onto it. `zonesLit` stays false so the meeting discs read
       as faint swept ground and not as survey rings. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"worked", zonesLit:false, t:0.4, progress:prog,
              status:"WORKED GROUND" },
    });

    /* --- the two plates, measured now: the destination rect is needed first by
       the deed's leader, which is drawn UNDER the figures, and then by the
       plates themselves, which are drawn OVER everything. ------------------- */
    const scarKey = SCAR_AT(t);
    const deedKey = DEED_AT(t);
    const scarFit = scarKey ? fitWindow(W, H, SCAR_BOX, SCAR_AR,
                      { x0:0, y0:0, x1:1, y1:1 }) : null;
    const deedFit = deedKey ? fitWindow(W, H, DEED_BOX, DEED_AR, DEED_WIN[deedKey]) : null;

    /* --- THE LEADER: the deed tied to the ground it is a deed of ----------- */
    {
      /* THE SCAR PLATE GETS NO LEADER, and that is a tested decision, not an
         omission. Drafted with one, the line had to cross the row of orchard
         stamps between the sky and the men and then terminate inside a body:
         four dashes of it survived, in a part of the frame already full of
         little crossed marks, and it read as one more piece of planting. The
         plate is tied to him by POSITION instead — it hangs in the sky directly
         over the only man on the plot whose leg it can be, which is how S03
         hangs the kit plate over its own subject. The deed plate keeps its
         leaders because the trees it counts are somewhere ELSE in the frame,
         and a chart of a place has to point at the place. */
      if (deedFit && DEED_WIN[deedKey].rows){
        /* down from the plate's foot into the patch of orchard whose parcel is
           open on it. The line leaves the bottom edge at the x nearest the
           rows, so each hook is short and near-vertical instead of a long
           diagonal raked across the whole planting. */
        const r = G(DEED_WIN[deedKey].rows), f = deedFit;
        const sx = clamp(r.p.x*W, f.dx + f.dw*0.10, f.dx + f.dw*0.90);
        leader(offctx, sx, f.dy + f.dh, r.p.x*W, r.p.y*H);
      }
    }

    /* one queue, sorted by the SET's own ground line: the floor decides who is
       in front, not the order these blocks happen to be written in. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- ODYSSEUS: one body, one guise, and the proof carried by pose ------
       `restored` from the first frame to the last — no ramp, no flare. What
       changes is what he shows, not what he looks like. */
    {
      const p = blk.odysseus, c = s.odysseus || {};
      const g = groundOf(p);
      const baring   = t >= 5  && t < 25;
      const offering = t >= 25 && t < 34;
      const counting = t >= 34 && t < 68;
      const taking   = t >= 68 && t < 78;
      const asking   = t >= 78;
      add(g.y, () => placeInstance(offctx, W, H, odysseus, {
        anchor:{ x:g.x, y:g.y }, scale:MAN * sizeOf(p),
        state:{
          t: p.moving ? (t*0.62) % 1 : 0.5,
          guise:"restored", band:"threeq",
          pose: c.pose || "arms_open",
          gaze: c.gaze || { x:.44, y:.06 },
          browUp:   taking ? .52 : offering ? .34 : counting ? .20 : .14,
          browKnit: asking ? .54 : taking ? .38 : baring ? .30 : .16,
          eyeNarrow:asking ? .30 : baring ? .22 : 0,
          eyeWide:  taking ? .20 : 0,
          smile:    counting && t < 58 ? .12 : 0,
          frown:    taking ? .44 : asking ? .22 : 0,
          jaw:      taking ? .30 : counting ? .22 : 0,
          status:   asking ? "WHO WILL STAND" : taking ? "MY FATHER"
                  : counting ? "THIRTEEN PEARS" : offering ? "PUT YOUR HAND ON IT"
                  : baring ? "THE SCAR" : "NO SIGN YET",
          progress: prog,
        },
      }));
    }

    /* --- LAERTES: doubt, weighing, recognition, dread. He never moves. -----
       Every pose here is the module's own — lae_doubting carried in from S03,
       then lae_examining for the two proofs, then lae_embracing, which is the
       one pose in the module where the stoop is released and he stands up. The
       characterisation is the SPINE, not an overpainted prop. */
    {
      const p = blk.laertes, c = s.laertes || {};
      const g = groundOf(p);
      const doubting  = t < 14;
      const weighing  = t >= 14 && t < 68;
      const taking    = t >= 68 && t < 78;
      const afraid    = t >= 78;
      add(g.y, () => placeInstance(offctx, W, H, laertes, {
        anchor:{ x:g.x, y:g.y }, scale:MAN * sizeOf(p),
        state:{
          t:0.5, band:"threeq",
          pose: c.pose || "lae_doubting",
          gaze: c.gaze || { x:-.54, y:.06 },
          browUp:   taking ? .78 : weighing ? .80 : afraid ? .46 : .26,
          browKnit: afraid ? .60 : taking ? .46 : weighing ? .22 : .52,
          eyeWide:  weighing ? .56 : taking ? .24 : 0,
          eyeNarrow:doubting ? .50 : afraid ? .36 : 0,
          frown:    taking ? .32 : afraid ? .40 : 0,
          jaw:      taking ? .42 : weighing ? .24 : 0,
          mouthAsym:doubting ? .66 : 0,
          status:   afraid ? "WHO IS LEFT" : taking ? "FATHER"
                  : weighing ? "WEIGHING" : "DOUBTING",
          progress: prog,
        },
      }));
    }

    /* far → near, by the set's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());

    /* --- THE PLATES, laid over the sky last -------------------------------
       Each lays paper first, then blits its window 1:1 out of a sheet sized so
       the window's own pixels ARE the destination's pixels. */
    if (scarFit){
      const f = scarFit;
      plateField(offctx, f.dx, f.dy, f.dw, f.dh);
      const cv = keyedModuleCanvas(scar, Math.round(f.cw), Math.round(f.ch),
        { mode:scarKey, layers:SCAR_LAYERS[scarKey], t:(t*0.5) % 2,
          status:"THE SCAR", progress:clamp(t/D,0,.96) },
        `b24s04|scar|${scarKey}`, 0.895);
      offctx.drawImage(cv, 0, 0, f.cw, f.ch, f.dx, f.dy, f.dw, f.dh);
    }
    if (deedFit){
      const w = DEED_WIN[deedKey], f = deedFit;
      plateField(offctx, f.dx, f.dy, f.dw, f.dh);
      const cv = keyedModuleCanvas(deed, Math.round(f.cw), Math.round(f.ch),
        { named:w.named, gift:true, proved:!!w.proved, t:0.6,
          status:w.proved ? "PROVED" : "NAMING", progress:clamp(t/D,0,.96) },
        `b24s04|deed|${deedKey}`, 0.895);
      offctx.drawImage(cv, w.x0*f.cw, w.y0*f.ch, f.ww*f.cw, f.wh*f.ch,
                           f.dx, f.dy, f.dw, f.dh);
    }
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
