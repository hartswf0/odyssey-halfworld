/* ============================================================
   SCENE  OD-B24-S03 — Odysseus Tests Laertes
   Book XXIV, scene 3 of the book. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from the
   two outdoor scenes of this book, OD-B24-S01 (a landscape with its own depth
   ladder) and OD-B24-S02 (a detail plate hung over an open field).

   WHERE. location.laertess-orchard, state `worked` — the farm as Odysseus finds
   it. The set owns the whole steading in one frame: the way in from town, the
   farm gate, the house and its terrace, the swept feast yard, and the surveyed
   quincunx of the orchard with the ISOLATED LABOUR PLOT cut out of it — a disc
   of turned earth with a staked sapling, a spoil heap, a leaning hoe and a
   basket, protected by an exclusion radius no orchard row may grow inside.
   That plot is the scene. The whole of Book 24's recognition happens on it.

   THE PLAN IS DERIVED FROM THE SET, NOT GUESSED, AND THE SET OWNS THE GROUND.
   Per the brief a SMALL LOCAL plan is authored here and every position resolves
   through it by station name — but two pieces of the set's own geometry are
   restated verbatim (the set keeps them private): the APPROACH Catmull-Rom
   chain, so a body walking up from town walks along the drawn road, and the
   LANE polyline, so a body walking out to the labour plot walks down the drawn
   lane. Every other station is one of the set's OWN exported anchors, read
   straight out of `anchors`. Nothing in this file is a hand-tuned coordinate.

   WHY THE GROUND IS READ FORWARD AND NOT THROUGH project(). Same division
   OD-B24-S01 made, for the same reason and then one more. (1) engine/blocking's
   project() bottoms out at screen y .5288, and the farm gate is painted at
   y .492 and the house door at y .470 — a plan-projected body cannot stand at
   the steading at all. (2) project()'s size falloff is 1.7:1 from the far wall
   of a room to its near edge; this set's own ladder, depthAtY(), is 13:1, which
   is what makes the farm read as half a mile away from the labour plot. So THE
   PLAN OWNS TOPOLOGY — who is at which named station, when they move, what a
   transit interpolates along, what the unknown-station throw protects, and what
   exitOccupancy hands on — and THE SET OWNS THE GROUND: groundOf() and sizeOf()
   take the station name straight back to the road curve, the lane, the set's
   anchors and the set's ladder. The plan's z IS depthAtY() at the station, so
   the plan and the orchard agree about who is in front.

   FIGURE SCALE, WHICH IS A REAL DECISION AND NOT AN ACCIDENT. This set is drawn
   at SURVEY scale: a fruit-tree stamp is W·0.122·depth, so a near-row tree is
   about 115 stage pixels and the farmhouse block is 58. A man sized off that
   same ladder at true stamp scale is a 60-pixel smudge, and the last and hardest
   recognition in the poem — an old man's face going from labour to grief to
   refusal — cannot be played by a smudge. The set itself already breaks its own
   ladder for exactly this reason: its `fg` layer plants a 250-pixel fig tree off
   the bottom-right corner as a near-camera foreground element. MAN is therefore
   pitched at that NEAR-FOREGROUND scale, not at row scale: about 215 stage
   pixels at the labour plot, between the set's own near fig (250) and its near
   rows (115), falling away down the same 13:1 ladder as everything else — so the
   three men sent up to the house are ~100 pixels at the yard and the depth
   reads. Drafted at row scale the two principals were unfindable in the frame.

   ODYSSEUS DOES NOT CHANGE FACE HERE, AND THAT IS THE POINT. Book 24 is the one
   recognition in the poem with NO disguise in it: he has been washed, dressed
   and restored since Book 23, and the false identity he tries on his father —
   Eperitus of Alybas, a man who once hosted Odysseus — is a WORD, not a face.
   So character.odysseus-b16 holds `guise:"restored"` for the whole scene. A
   guise ramp here would be the module lying about the poem; the lie is carried
   entirely by pose, gaze and the beat structure, which is why beat 3 is staged
   as a man standing on the lane a body's length short of his father, talking.

   CONTACT PAIR. The set authors `meet:labor_l` / `meet:labor_r` as a pair for
   precisely this beat and they are used as the pair: Laertes holds labor_r
   (east of the sapling, at his spoil heap) from the first frame to the last and
   never moves — the old man does not come to meet anyone, the son comes to him —
   and Odysseus comes down the lane and halts at `lane_mid` (208 px west and a
   whole depth step up-frame of him, close enough to speak, far enough that
   neither body touches the other) for the whole false tale. He closes to
   `lane_foot` only when the old man breaks, and steps onto `labor_l` only for
   the embrace: two coordinates 104 px apart, with the staked sapling standing
   on the ground between them. The three companions never enter the plot at all:
   they are sent to `house_door`, `outbuilding` and `tool_shed`, three distinct
   jobs half a frame up-country, and are out of frame from t=22.

   THE KIT IS A PLATE, NOT A SET DRESSING. prop.farm-clothing-and-tools is an
   orthographic KIT SHEET — a cap, a patched work chiton, gloves, gaiters, a
   billhook, a hoe, over a four-tile STATUS DESCENT STRIP counting the mends as
   seven-segment geometry. Blitted whole it is a second background, and worse,
   the set ALREADY paints a hoe and a prunings basket at the labour plot, so
   standing the prop in the world would put a second hoe in the frame. It is
   cast the way OD-B24-S01 casts the wand and OD-B24-S02 the memory tableau: as
   a DETAIL PLATE, windowed to ONE group at a time and hung in the open sky at
   the top right, walking its window on the master clock — the patched chiton
   while Odysseus is reading what his father is wearing, the working tools while
   the old man is still hoeing, and from the grief onward the mend census, which
   is the diminished-status reading the prop was built to carry. Each window
   blits 1:1 into a destination fitted to its own aspect inside one fixed box,
   so no register is ever resampled and the plate keeps its contour weight.

   TONE. The set's `worked` table is already light (sky 1, ground 2, field 3) and
   nothing here darkens it: no second field is painted, the panel lays its own
   paper down before the window goes in, and the two principals are ordinary
   figures — a grey patched tunic over bare shins and a white-grey head on
   Laertes, which is the module's own answer to the black-mass trap. There is
   ZERO hand-drawn ctx overpaint on any figure in this file. The rig does it all.

   Beats (Od. 24.205–350):
     1. Odysseus reaches the farm and finds Laertes alone in patched clothes,
        tending a tree.
     2. He sends his companions to prepare food and approaches under another
        false identity.
     3. He claims to have hosted Odysseus years earlier and watches his father
        collapse in grief.
     4. Unable to continue, Odysseus embraces him and names himself.
     5. Laertes asks for proof beyond desire.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S03.mjs --t 12  (the road)
            node harness/render-scene.mjs scenes/OD-B24-S03.mjs --t 44  (the grief)
            node harness/render-scene.mjs scenes/OD-B24-S03.mjs --t 66  (the proof)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, lerp, PAPER, INK }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { anchors as FARM } from "../assets/location/laertess-orchard.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import laertes    from "../assets/character/laertes.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import philoetius from "../assets/character/philoetius.mjs";
import kit        from "../assets/prop/farm-clothing-and-tools.mjs";

const FIELD_ASSET = "location.laertess-orchard";
const D = 72;

/* ==========================================================================
   THE SET'S OWN GEOMETRY, RESTATED
   location.laertess-orchard keeps its ladder, its approach chain and its lane
   private. They are copied here verbatim so that a station is a point ON the
   drawn road / ON the drawn lane and a body's size is the size that patch of
   ground is painted at.
   ========================================================================== */
const HORIZON = 0.280, NEAR_Y = 1.040;
const groundU  = y => clamp((y - HORIZON) / (NEAR_Y - HORIZON), 0, 1);
const depthAtY = y => lerp(0.075, 1.000, Math.pow(groundU(y), 1.22));

/* the approach — one Catmull-Rom chain, t=0 at the near edge (the way in from
   town), t=1 at the farm gate. y is monotonic: the road only ever recedes. */
const CR = [
  [0.118, 1.050], [0.118, 1.050], [0.048, 0.874], [0.108, 0.722],
  [0.194, 0.614], [0.228, 0.540], [0.238, 0.492], [0.238, 0.492],
];
function roadPtN(t){
  const segs = CR.length - 3;
  const u = clamp(t, 0, 1) * segs;
  const i = Math.min(Math.floor(u), segs - 1), s = u - i;
  const c = (a,b,cc,d) => 0.5*((2*b) + (-a+cc)*s + (2*a-5*b+4*cc-d)*s*s + (-a+3*b-3*cc+d)*s*s*s);
  const p0=CR[i], p1=CR[i+1], p2=CR[i+2], p3=CR[i+3];
  return { x:c(p0[0],p1[0],p2[0],p3[0]), y:c(p0[1],p1[1],p2[1],p3[1]) };
}

/* the lane — the walk from the yard out to where the old man is working. Its
   last point is cut off the set's own labour plot, so it is read from the set's
   exported anchor rather than typed. */
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
   Three kinds of station, none of them a typed coordinate. ON-ROAD stations
   carry the approach parameter they were cut at; ON-LANE stations carry the
   lane parameter; FIXED stations are the set's own exported anchors. A transit
   between two stations of the same curve follows that curve.
   ========================================================================== */
const onRoad = k => ({ curve:"road", k, p:roadPtN(k) });
const onLane = k => ({ curve:"lane", k, p:lanePtN(k) });
const atSet  = key => {
  const a = FARM[key];
  if (!a) throw new Error(`[OD-B24-S03] the set exports no anchor "${key}"`);
  return { curve:null, k:null, p:{ x:a.x, y:a.y } };
};

const GROUND = {
  /* the way in from town — five points up the drawn road, then the gate */
  road_near:    onRoad(0.10),
  road_low:     onRoad(0.20),
  road_mid:     onRoad(0.34),
  road_high:    onRoad(0.46),
  road_bend:    onRoad(0.60),
  farm_gate:    onRoad(1.00),
  /* the steading — the three jobs the meal is sent up to */
  house_door:   atSet("farm:house-door"),
  outbuilding:  atSet("farm:outbuilding"),
  tool_shed:    atSet("farm:tool-shed"),
  yard:         atSet("yard:feast"),
  yard_hearth:  atSet("yard:hearth"),
  /* out through the orchard gate and down the lane */
  orchard_gate: atSet("threshold:orchard-gate"),
  lane_head:    onLane(0.25),
  lane_mid:     onLane(0.50),
  lane_foot:    onLane(0.75),
  /* THE ISOLATED LABOUR POSITION and its authored contact pair */
  labor_plot:   atSet("labor:plot"),
  labor_l:      atSet("meet:labor_l"),
  labor_r:      atSet("meet:labor_r"),
  labor_tools:  atSet("labor:tools"),
};

export const laertesFarm = makePlan({
  id:"laertes-farm",
  name:"Laertes's farm — the approach, the steading and the labour plot",
  notes:"Local plan for OD-B24-S03, cut off location.laertess-orchard's own " +
        "approach chain, its own lane and its own exported anchors. z IS the " +
        "set's depth at the station. The plan owns topology; groundOf() and " +
        "sizeOf() take the station back to the set for its screen position and " +
        "its size, because project() bottoms out at y .5288 (the farm gate is " +
        "painted at .492) and its 1.7:1 falloff cannot carry a 13:1 landscape. " +
        "`labor_l`/`labor_r` are the set's authored contact pair and are never " +
        "occupied by one body.",
  stations:Object.fromEntries(Object.entries(GROUND).map(([k, g]) => [k, {
    x:+clamp(g.p.x, 0, 1).toFixed(4),
    z:+depthAtY(g.p.y).toFixed(4),
  }])),
  fixtures:[
    { id:"sapling",   kind:"set_piece", at:"labor_plot"   },
    { id:"hoe",       kind:"prop",      at:"labor_tools"  },
    { id:"farm_gate", kind:"threshold", at:"farm_gate"    },
    { id:"hearth",    kind:"set_piece", at:"yard_hearth"  },
  ],
});

/* ---- the set's ground, resolved off blockingAt's own from/to/u ------------
   A transit between two stations of the SAME curve interpolates that curve's
   parameter and is evaluated on the curve, so a body coming up from town bends
   with the road and a body going out to the plot follows the lane instead of
   cutting across the planted rows. Anything else lerps the two points. */
const G = name => {
  const g = GROUND[name];
  if (!g) throw new Error(`[OD-B24-S03] station "${name}" has no ground`);
  return g;
};
function groundOf(p){
  if (!p.moving){ const g = G(p.station); return { x:g.p.x, y:g.p.y }; }
  const a = G(p.from), b = G(p.to), u = p.u;
  if (a.curve && a.curve === b.curve)
    return a.curve === "road" ? roadPtN(lerp(a.k, b.k, u)) : lanePtN(lerp(a.k, b.k, u));
  return { x:lerp(a.p.x, b.p.x, u), y:lerp(a.p.y, b.p.y, u) };
}
const sizeOf = p => depthAtY(groundOf(p).y);

/* one height for every standing body on this farm, times the set's own falloff.
   .62 puts a man at the labour plot at about 275 stage pixels — a little over
   the set's own near-camera fig (250) and well clear of its near orchard rows
   (115) — and the three companions at about 130 up at the yard, half a frame
   up-country. See the FIGURE SCALE note in the header for why this is not the
   row-stamp scale. Drafted at .46 the two principals came out the same height
   as the tree stamps they were standing among: the orchard read as a field of
   equal blobs and the recognition could not be found in it at all. */
const MAN = 0.62;

/* THE THREE COMPANIONS ARE CAST AGAINST THE ROAD, NOT AGAINST THE GROUND, and
   that is a rule with a reason. The drawn approach climbs from y .97 to y .685
   between road parameters .10 and .46 — a third of the whole ladder — while
   moving only .085 in x, and the set narrows its own way from a half-width of
   .048 to .005 across it, a 10:1 taper over a stretch where the depth ladder
   only halves a body. Four bodies at full foreground scale on that stretch are
   wider than the road they are walking on: drafted at MAN they stacked into one
   ink mass against the left edge and the file could not be counted. They are
   therefore pitched at the way's own ratio. Odysseus keeps full MAN throughout —
   he is the only one who leaves the road, and his scale has to agree with the
   labour plot, which is where the scene actually plays. */
const SERVANT = 0.66;

/* ==========================================================================
   CONTINUITY IN — translated, and honestly empty.
   OD-B24-S02 exports a computed exitOccupancy over ITS plan, the muster ground
   in the meadow of asphodel. Per brief section F the crossing is declared
   explicitly rather than guessed — and the honest map is EMPTY. Not one of that
   scene's five bodies is a living body: agamemnon, achilles and amphimedon are
   shades, `warriors` is the war-dead of Troy and `shades` is the flock of dead
   suitors, and Book XXIV brings none of them above ground. Every one of them is
   therefore DROPPED, which is what section F says dropping is for. The import
   is kept and the map is kept so the chain is real and auditable: if a later
   pass ever moves a living body through the underworld scene, it will appear
   here as an unmapped station rather than silently vanish.
   ========================================================================== */
import { exitOccupancy as PREV_EXIT } from "./OD-B24-S02.mjs";

const HADES_TO_FARM = {
  /* deliberately empty — no station of the asphodel assembly has a counterpart
     on a working farm in Ithaca, and no body standing on one belongs on the
     other. new_dead / chorus_near / aga_verdict / ach_close / witness all drop. */
};
const INHERITED = Object.fromEntries(
  Object.entries(PREV_EXIT || {})
    .map(([who, st]) => [who, HADES_TO_FARM[st]])
    .filter(([, st]) => st));

const INITIAL = {
  ...INHERITED,
  /* the four living bodies, opened from named stations of this plan. Laertes is
     ALREADY at his plot: he is not an entrance, he is the destination — the
     whole first beat is that he is found, alone, a long way from the house. */
  laertes:    "labor_r",
  odysseus:   "road_high",
  telemachus: "road_mid",
  eumaeus:    "road_low",
  philoetius: "road_near",
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   THE COMPANIONS ARE SENT UP-COUNTRY AND THE SON GOES OUT ALONE. Their three
   destinations are three distinct stations round the steading — the door, the
   swept yard, the hearth ring — so "go in and get a meal ready" is three men
   dispersing to three jobs and never three bodies stacked on one coordinate.
   ODYSSEUS HALTS ON THE LANE AND CLOSES IN THREE STEPS, WHICH IS THE SCENE.
   `lane_mid` is 208 px west and a depth step up-frame of his father — a
   stranger's distance, far enough that neither body touches the other, and he
   holds it for the whole false tale. He comes down to `lane_foot` only when the
   old man breaks, and steps off the lane onto `labor_l` only for the embrace.
   Those last two are the only moves in the file that are actions rather than
   journeys, and they are the only two the audience is meant to feel. */
const MOVES = [
  /* 1 — up the drawn road from town, the four of them strung out in single file */
  { who:"odysseus",   from:"road_high",    to:"road_bend",    t0: 3, t1:12 },
  /* strung out in TIME as well as in space: the three arrive at their next mark
     at 10 / 12 / 16, so no two of them are ever on adjacent road parameters at
     the same instant. The way doubles back on itself between .10 and .34 and a
     file walked in lockstep collapses onto one vertical there. */
  { who:"telemachus", from:"road_mid",     to:"road_high",    t0: 3, t1:10 },
  { who:"eumaeus",    from:"road_low",     to:"road_mid",     t0: 3, t1:12 },
  { who:"philoetius", from:"road_near",    to:"road_low",     t0: 3, t1:16 },
  /* 2 — the three are sent up to three jobs at the steading; he turns off for
     the orchard. HIS IS ONE TRANSIT AND IT DOES NOT HALT. road_bend ->
     orchard_gate carries the farm gate, the cut terrace, the swept yard and the
     bath in a single move between two clear standing places. Drafted with a
     halt at `farm_gate`, a foreground-scale man stood with his feet ABOVE the
     terrace base and read as standing on the farmhouse roof — the same failure
     the three companions had when they were walked all the way to the door in
     shot. Everything drawn on this farm now keeps its feet below y .476, the
     terrace line, so a near body OCCLUDES the distant steading instead of
     standing on top of it. */
  { who:"telemachus", from:"road_high",    to:"house_door",   t0:16, t1:30 },
  { who:"eumaeus",    from:"road_mid",     to:"outbuilding",  t0:17, t1:31 },
  { who:"philoetius", from:"road_low",     to:"tool_shed",    t0:18, t1:32 },
  { who:"odysseus",   from:"road_bend",    to:"orchard_gate", t0:18, t1:32 },
  /* 3 — down the drawn lane to a stranger's distance, and stop there */
  { who:"odysseus",   from:"orchard_gate", to:"lane_mid",     t0:32, t1:39 },
  /* 4 — the two steps that are not journeys: drawn in as the old man breaks,
     then off the lane onto his half of the authored contact pair */
  { who:"odysseus",   from:"lane_mid",     to:"lane_foot",    t0:47, t1:52 },
  { who:"odysseus",   from:"lane_foot",    to:"labor_l",      t0:54, t1:60 },
  /* Laertes never moves. He holds labor_r from the first frame to the last. */
];

/* ==========================================================================
   THE KIT PLATE — one group of the sheet at a time, hung in the open sky.
   PLATE_AR is the sheet's own drawn aspect, so cw/ch is fixed and no window is
   ever distorted; each window is fitted inside ONE box at its own aspect and
   the sheet is sized so the window blits 1:1 into that destination.
   ========================================================================== */
const PLATE_AR = 0.763;                                   // sheet w : h
const PLATE_BOX = { x0:0.598, y0:0.062, x1:0.966, y1:0.322 };
const KIT_WIN = {
  /* the patched work chiton and the goatskin cap — what he is wearing */
  clothing:{ x0:0.035, y0:0.070, x1:0.560, y1:0.415 },
  /* the gloves, the billhook and the hoe — what he is working with */
  tools:   { x0:0.565, y0:0.095, x1:0.945, y1:0.640 },
  /* the four-tile status descent strip: the mend census, 0 -> 2 -> 4 -> 6,
     cut as seven-segment geometry. A king counted in patches. */
  strip:   { x0:0.040, y0:0.630, x1:0.965, y1:0.878 },
};
/* the group the scene is looking at, on the master clock. Nothing before t=8:
   the first beat is a man coming up a road and the sky over it is empty. */
const KIT_AT = t => t <  8 ? null
                  : t < 28 ? "clothing"
                  : t < 44 ? "tools"
                           : "strip";
const KIT_STATE = t => t < 28 ? { wear:1.00, soil:0.35, stage:3, tool:null,      cut:0 }
                     : t < 44 ? { wear:1.00, soil:1.00, stage:3, tool:"hoe",     cut:0 }
                              : { wear:1.00, soil:0.55, stage:3, tool:null,      cut:1 };

function detailField(offctx, W, H, x, y, w, h){
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 4;
  offctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  offctx.restore();
}
function kitPlate(offctx, W, H, t){
  const key = KIT_AT(t);
  if (!key) return;
  const win = KIT_WIN[key];
  const ww = win.x1 - win.x0, wh = win.y1 - win.y0;
  const ar = (ww * PLATE_AR) / wh;                        // this window on screen
  const bw = (PLATE_BOX.x1 - PLATE_BOX.x0)*W, bh = (PLATE_BOX.y1 - PLATE_BOX.y0)*H;
  /* fit inside the one box at the window's own aspect — never stretched */
  let dw = bw, dh = bw / ar;
  if (dh > bh){ dh = bh; dw = bh * ar; }
  const dx = PLATE_BOX.x1*W - dw;                         // hung off the box's right edge
  const dy = PLATE_BOX.y0*H + (bh - dh)*0.5;
  /* 1:1 sheet: the window's width in sheet pixels IS dw, its height IS dh */
  const cw = dw / ww, ch = dh / wh;
  const st = KIT_STATE(t);
  detailField(offctx, W, H, dx, dy, dw, dh);
  const cv = keyedModuleCanvas(kit, Math.round(cw), Math.round(ch),
    { ...st, t:0.5, status:"THE KIT", progress:clamp(t/D, 0, .96) },
    `b24s03|kit|${key}`, 0.895);
  offctx.drawImage(cv, win.x0*cw, win.y0*ch, ww*cw, wh*ch, dx, dy, dw, dh);
}

export const scene = {
  id:"OD-B24-S03",
  title:"Odysseus Tests Laertes",
  book:24,
  plan:"laertes-farm",
  duration:D,
  beats:[
    "Odysseus reaches the farm and finds Laertes alone in patched clothes, tending a tree.",
    "He sends his companions to prepare food and approaches under another false identity.",
    "He claims to have hosted Odysseus years earlier and watches his father collapse in grief.",
    "Unable to continue, Odysseus embraces him and names himself.",
    "Laertes asks for proof beyond desire.",
  ],
  exitState:"The isolated labour plot deep in Laertes's orchard, the tale told " +
    "and the name given. Laertes holds the ground he has held since the first " +
    "frame — east of the staked sapling at his own turned earth, where he was " +
    "found alone hoeing round one young tree in a patched labourer's tunic — but " +
    "he is no longer working: the dust he took up in both hands and poured over " +
    "his white head at the stranger's tale of a guest gone twenty years is still " +
    "on him, and he has come out of the grief into refusal. Torso turned off the " +
    "man in front of him, head cocked back, forearm lifted in a check, he has " +
    "asked for proof beyond desire — a sign, not a resemblance, because he has " +
    "been visited by his own wishes before. Odysseus stands on the contact pair " +
    "opposite him, one step off the lane, the false name (a stranger from " +
    "Alybas who once hosted Odysseus) abandoned and his own name spoken, arms " +
    "still open from the embrace his father has not yet returned, with the proof " +
    "not yet given: the scar above the knee and the count of the trees this farm " +
    "was planted with are both still owed, and both are the next scene. " +
    "Telemachus is at the farmhouse door, Eumaeus in the swept feast yard and " +
    "Philoetius at the hearth ring, sent up-country to get a meal ready and out " +
    "of frame since the orchard gate. The kit plate stands on its last window: " +
    "the mend census, four tiles counting a king from nought patches to six.",
  exitOccupancy:occupancyAt(laertesFarm, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ odysseus:"road_high — already on the drawn approach, coming up from town",
              telemachus:"road_mid — behind him on the road",
              eumaeus:"road_low — behind him on the road",
              philoetius:"road_near — behind him on the road, nearest camera",
              laertes:"none — already at labor_r. He is the destination, not an entrance",
              shades:"DROPPED — OD-B24-S02 ends in the underworld; see the map above",
              warriors:"DROPPED", agamemnon:"DROPPED", achilles:"DROPPED",
              amphimedon:"DROPPED" },
  exits:{ telemachus:"out of frame at t=22 on the climb, house_door at t=30 — the house",
          eumaeus:"out of frame at t=22 on the climb, outbuilding at t=31 — the store",
          philoetius:"out of frame at t=22 on the climb, tool_shed at t=32 — the gear",
          odysseus:"none — labor_l, on the contact pair",
          laertes:"none — labor_r, where he has stood all scene" },
  walkable:"the stations of the laertes-farm plan and nothing else: the drawn " +
           "approach from town (road_near .. farm_gate), the steading " +
           "(house_door, outbuilding, tool_shed, yard, yard_hearth), the " +
           "orchard gate, the drawn lane " +
           "(lane_head, lane_mid, lane_foot) and the labour plot with its " +
           "authored contact pair (labor_l, labor_r, labor_plot, labor_tools). " +
           "blockingAt() throws on anything else, which is the cross-scene check.",
  depthOrder:"one queue sorted by the set's own ground y, far first — the three " +
             "companions up at the steading, then Odysseus coming down the lane, " +
             "then Laertes at the near plot. The set paints the field first and " +
             "the kit plate is a diagram, laid over the sky last.",
  gazeTargets:{ odysseus:"the farm gate on the way up, then his father from the " +
                         "moment the plot comes into view, and never off him again",
                laertes:"the soil and the roots he is working while the stranger " +
                        "talks, up at the stranger on the grief, then hard at him " +
                        "for the proof",
                telemachus:"the farmhouse door he is being sent to",
                eumaeus:"the yard", philoetius:"the hearth ring" },
  attachments:[
    { at: 0, who:"kit_01",     change:"absent — the sky over the road is empty" },
    { at: 8, who:"kit_01",     change:"kit plate struck in on the CLOTHING window: " +
      "the goatskin cap and the patched work chiton, what his father is wearing" },
    { at:28, who:"kit_01",     change:"window walks to TOOLS: gloves, billhook, hoe" },
    { at:44, who:"kit_01",     change:"window walks to the STATUS DESCENT STRIP — " +
      "the mend census, a king counted in patches, held to the end of the scene" },
    { at:16, who:"odysseus",   change:"the three companions are detached and sent " +
      "up to the steading; from here he is alone in the orchard" },
    { at:47, who:"odysseus",   change:"comes down the lane a step as his father breaks" },
    { at:54, who:"odysseus",   change:"steps off the lane onto the contact pair" },
  ],
  sound:[
    { at: 0, source:"road_bend",   cue:"four sets of feet on a dry country road; no voices" },
    { at:16, source:"farm_gate",   cue:"an order given quietly: go in, get a meal ready" },
    { at:30, source:"labor_r",     cue:"a hoe striking stony ground, close, and stopping" },
    { at:36, source:"lane_mid",    cue:"a stranger's voice: I hosted a man of that name once" },
    { at:44, source:"labor_r",     cue:"a cry, and dust running out of two hands" },
    { at:56, source:"labor_l",     cue:"the name given, plainly, without a title" },
    { at:66, source:"labor_r",     cue:"an old man asking for a sign, not for comfort" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"worked" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.205,y:.470}, scale:.17, band:"threeq", pose:"walk_neutral" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.300,y:.582}, scale:.17, band:"threeq", pose:"walk_neutral" },
    { asset:"character.philoetius", instance:"philoetius",
      anchor:{x:.232,y:.616}, scale:.19, band:"threeq", pose:"walk_neutral" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.578,y:.842}, scale:.32, band:"threeq", pose:"walk_neutral" },
    { asset:"character.laertes", instance:"laertes",
      anchor:{x:.696,y:.893}, scale:.36, band:"threeq", pose:"lae_tending" },
    { asset:"prop.farm-clothing-and-tools", instance:"kit_01",
      anchor:{x:.782,y:.322}, scale:.36, pose:"digging" },
  ],

  timeline:[
    // 1 — up the road; the old man is already at his tree
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0, args:{ gaze:{ x:.18, y:-.04 } } },
    { op:"actor.pose", target:"laertes",    at: 0.0, args:{ pose:"lae_tending" } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"eumaeus",    at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"philoetius", at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"fx.play",    target:"kit_01",     at: 8.0, args:{ dir:"clothing" } },
    // 2 — the companions are sent in; he goes out through the orchard alone
    { op:"actor.pose", target:"odysseus",   at:13.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus",   at:13.0, args:{ gaze:{ x:-.42, y:-.10 } } },
    { op:"actor.pose", target:"telemachus", at:14.0, args:{ pose:"head_lowered" } },
    { op:"actor.pose", target:"eumaeus",    at:15.0, args:{ pose:"lean_forward" } },
    { op:"actor.pose", target:"philoetius", at:15.0, args:{ pose:"head_lowered" } },
    { op:"actor.pose", target:"odysseus",   at:18.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at:18.0, args:{ gaze:{ x:.30, y:.14 } } },
    { op:"actor.pose", target:"telemachus", at:17.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"eumaeus",    at:18.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"philoetius", at:19.0, args:{ pose:"walk_neutral" } },
    // 3 — the false name, the tale of the guest, and the collapse
    { op:"set.state",  target:"kit_01",     at:28.0, args:{ state:"digging" } },
    { op:"actor.pose", target:"odysseus",   at:39.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:39.0, args:{ gaze:{ x:.44, y:.10 } } },
    { op:"actor.pose", target:"odysseus",   at:42.0, args:{ pose:"torso_open" } },
    { op:"actor.pose", target:"laertes",    at:44.0, args:{ pose:"lae_grief" } },
    { op:"actor.gaze", target:"laertes",    at:44.0, args:{ gaze:{ x:.06, y:.62 } } },
    { op:"set.state",  target:"kit_01",     at:44.0, args:{ state:"laid-down" } },
    { op:"actor.pose", target:"odysseus",   at:47.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus",   at:47.0, args:{ gaze:{ x:.50, y:.22 } } },
    // 4 — he cannot go on: the embrace and the name
    { op:"actor.pose", target:"odysseus",   at:54.0, args:{ pose:"arms_open" } },
    { op:"actor.gaze", target:"odysseus",   at:54.0, args:{ gaze:{ x:.46, y:.04 } } },
    // 5 — proof beyond desire
    { op:"actor.pose", target:"laertes",    at:62.0, args:{ pose:"lae_doubting" } },
    { op:"actor.gaze", target:"laertes",    at:62.0, args:{ gaze:{ x:-.54, y:.06 } } },
    { op:"actor.pose", target:"odysseus",   at:66.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:66.0, args:{ gaze:{ x:.40, y:.06 } } },
    { op:"timeline.capture", target:"OD-B24-S03", at:70.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s    = stateAt(scene, t);
    const blk  = blockingAt(laertesFarm, MOVES, t, INITIAL);
    const prog = Math.min(.96, .10 + .84*(t/D));

    /* the field first — it paints the whole steading and everything keys onto
       it. The full `worked` layer stack is used deliberately: the road, the
       gate, the house and the yard are the ground the second beat is played on
       (three men sent somewhere have to be sent somewhere), and the labour
       layer is the plot itself — its sapling, spoil heap, leaning hoe and
       prunings basket ARE the scene's dressing, which is exactly why no prop is
       stood in the world beside them. `zonesLit` stays false so the meeting
       discs read as faint swept ground and not as survey rings. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"worked", zonesLit:false, t:0.4, progress:prog,
              status:"WORKED GROUND" },
    });

    /* one queue, sorted by the SET's own ground line: the floor decides who is
       in front, not the order these blocks happen to be written in. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- THE THREE COMPANIONS: sent up-country, then gone ------------------
       They are on the road with him for the first beat and climbing toward the
       steading for the second, and the camera lets them go at t=22 while they
       are still on open ground below the terrace. That cutoff is not laziness:
       past it their walk takes them up over the farm's own base line, where a
       foreground-scale body reads as standing on a roof. It is also the plot —
       the isolation of the old man is the whole first beat, and three figures
       idling in the yard behind the recognition would contradict it. They keep
       walking off-stage; exitOccupancy puts them at the door, the outbuilding
       and the tool shed, which is where the meal gets made. */
    if (t < 22){
      for (const [who, mod, base] of [["telemachus", telemachus, 1.00],
                                      ["eumaeus",    eumaeus,    0.98],
                                      ["philoetius", philoetius, 0.99]]){
        const p = blk[who], c = s[who] || {};
        const g = groundOf(p);
        add(g.y, () => placeInstance(offctx, W, H, mod, {
          anchor:{ x:g.x, y:g.y }, scale:MAN * SERVANT * base * sizeOf(p),
          state:{
            t:(t*0.6) % 1, band:"threeq",
            pose: c.pose || "walk_neutral",
            gaze: c.gaze || { x:-.22, y:.06 },
            browUp:.16, status:"SENT AHEAD", progress:prog,
          },
        }));
      }
    }

    /* --- ODYSSEUS: one body, one guise, and the lie carried by pose --------
       `restored` from the first frame to the last. See the header: the disguise
       in Book 24 is a name, not a face, so there is no guise ramp here and no
       restoration flare — there is nothing discontinuous for one to cover. */
    {
      const p = blk.odysseus, c = s.odysseus || {};
      const g = groundOf(p);
      const walking   = p.moving;
      const sending   = t >= 13 && t < 18;
      const telling   = t >= 39 && t < 47;
      const watching  = t >= 47 && t < 54;
      const naming    = t >= 54 && t < 66;
      const proving   = t >= 66;
      add(g.y, () => placeInstance(offctx, W, H, odysseus, {
        anchor:{ x:g.x, y:g.y }, scale:MAN * sizeOf(p),
        state:{
          t: walking ? (t*0.62) % 1 : 0.5,
          guise:"restored", band:"threeq",
          pose: c.pose || "walk_neutral",
          gaze: c.gaze || { x:.18, y:-.04 },
          browUp:   watching ? .58 : naming ? .44 : telling ? .22 : .12,
          browKnit: watching ? .52 : naming ? .34 : telling ? .30 : .16,
          eyeNarrow:telling ? .34 : 0,
          eyeWide:  naming ? .22 : watching ? .18 : 0,
          mouthAsym:telling ? .48 : 0,
          smile:    telling ? .14 : 0,
          frown:    watching ? .40 : naming ? .26 : 0,
          jaw:      naming ? .34 : telling ? .26 : 0,
          status:   proving ? "THE SCAR" : naming ? "I AM HE"
                  : watching ? "HE CANNOT GO ON" : telling ? "A MAN OF ALYBAS"
                  : sending ? "GO IN AND EAT" : "COMING UP FROM TOWN",
          progress: prog,
        },
      }));
    }

    /* --- LAERTES: labour, then grief, then refusal. He never moves. --------
       Every one of these poses is the module's own — lae_tending, lae_grief,
       lae_doubting — and the characterisation is the SPINE, not an overpainted
       prop: folded over the vine for the labour, driven down under both raised
       hands for the dust, turned off the stranger with the forearm up for the
       refusal. lae_embracing is deliberately NOT used: the module assigns it to
       OD-B24-S04, and in the poem Laertes does not take his son back until the
       proof is given, which is the next scene, not this one. */
    {
      const p = blk.laertes, c = s.laertes || {};
      const g = groundOf(p);
      const working  = t < 44;
      const grieving = t >= 44 && t < 62;
      const doubting = t >= 62;
      add(g.y, () => placeInstance(offctx, W, H, laertes, {
        anchor:{ x:g.x, y:g.y }, scale:MAN * sizeOf(p),
        state:{
          t:0.5, band:"threeq",
          pose: c.pose || "lae_tending",
          gaze: c.gaze || { x:-.22, y:.48 },
          browUp:   grieving ? .86 : doubting ? .26 : .56,
          browKnit: grieving ? .62 : doubting ? .52 : .44,
          frown:    grieving ? .54 : doubting ? .16 : .30,
          eyeNarrow:grieving ? .44 : doubting ? .50 : .16,
          jaw:      grieving ? .34 : 0,
          mouthAsym:doubting ? .66 : 0,
          status:   doubting ? "PROVE IT" : grieving ? "DUST ON A WHITE HEAD"
                  : working  ? "BEREFT" : "BEREFT",
          progress: prog,
        },
      }));
    }

    /* far → near, by the set's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());

    /* --- THE KIT, as its own plate: a drawing of what he is wearing and
       working with, never a second hoe in the world. Laid over the sky last. */
    kitPlate(offctx, W, H, t);
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
