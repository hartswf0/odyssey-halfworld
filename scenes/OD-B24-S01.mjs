/* ============================================================
   SCENE  OD-B24-S01 — The Suitors Enter Hades
   Book XXIV, scene 1 of the book. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from the
   outdoor variant, scenes/OD-B17-S02.mjs.

   WHERE. Not the hall and not the hut — the road the new dead are driven down,
   from the streams of Ocean to the meadow of asphodel. There is no authored plan
   for it, so per the brief a SMALL LOCAL plan is authored at the top of this file
   and every position resolves through it by station name. The discipline is kept
   outdoors.

   THE PLAN IS DERIVED FROM THE SET, NOT GUESSED. location.road-to-hades draws its
   whole way from ONE Catmull-Rom chain and sizes everything on ONE depth ladder,
   depthAtY(). Both are restated verbatim below (the set does not export them), so
   the stations this scene names are points ON the drawn road, and a figure walking
   between two of them walks along the drawn curve rather than across the plain.

   WHY THE GROUND IS READ FORWARD AND NOT THROUGH project().
   engine/blocking.mjs projects a plan station with y = .50 + .46·z^1.08 and clamps
   z at .08, so the highest screen y it can ever produce is .5288. That law was cut
   for a ROOM whose far wall is four paces off. This road is not a room: its far
   end — the meadow of asphodel, where beats 3 and 4 play — is painted at y .394,
   and the muster ring in it at y .406. A plan-projected body literally cannot stand
   in the asphodel; it would stop dead on the open plain a third of a frame short of
   the kerb, and the whole last movement of the scene would be staged in the wrong
   place. So this file follows the division OD-B17-S02 already made and extends it
   by one term: THE PLAN OWNS TOPOLOGY — who is at which named station, when they
   move, what a transit interpolates between, what the unknown-station throw
   protects, and what exitOccupancy hands on — and THE SET OWNS THE GROUND: where
   that station actually is (its own way curve / its own exported anchor) and how
   big a body is there (its own depth ladder). Nothing here is a hand-tuned anchor:
   groundOf() and sizeOf() take the station name out of blockingAt() and hand it
   straight to the set's own geometry. The plan's z is itself the set's depth at
   that station, so the plan and the road agree about which body is in front.

   CONTINUITY IN. This is the first scene of Book XXIV: no previous scene of this
   book exports an occupancy, and OD-B23-S06 ends in the marriage chamber, a room
   with no station in common with a road in the underworld and no body on it who
   walks here. So INITIAL is opened from the plan, from named road stations, and the
   note is left explicit rather than importing a hall occupancy in order to drop all
   of it. Opening positions come from the text: Hermes is already over the causeway
   and turned back on his flock, the shades are still coming up out of the world
   behind him at `entrance` (the set puts the living world behind camera), and the
   war-dead are ALREADY in the asphodel — Achilles and Agamemnon are mid-conversation
   when the new dead arrive, so they are not an entrance, they are the destination.

   CONTACT PAIR. The one beat where bodies close is the handover in the meadow, and
   it is staged across the set's OWN declared pair: Hermes halts at `muster_l`
   (.252/.411) and the flock is driven the last step onto `muster_r` (.344/.403).
   Two coordinates, .092 apart in x — at that depth about two and a half of the
   figures standing there. The war-dead never share either: they come forward from
   `meadow_east` (.720/.408) to `asphodel_edge` (.672/.466), the fifth stele, half a
   frame away across the meadow, so "the dead gather to hear" reads as a crowd
   stepping DOWN toward the road and never as two crowds resolving onto one point.

   ONE BODY, ONE WAND. Hermes carries his own rhabdos: character.hermes-psychopomp
   draws it rigged to the hand it grips it with, and the module says in as many
   words that the snaked herald's staff is put away for this job. Casting
   prop.hermess-wand into the world beside him would therefore put a SECOND wand in
   the frame and the wrong one. It is cast instead as a DETAIL PLATE — the device
   OD-B20-S03 and OD-B21-S01..S06 use — windowed to the WORKING END: the winged
   finial, the charm glow, the two snake heads and the head of the coil, which is
   the half of the instrument Book XXIV names ("with which he charms the eyes of men
   asleep, and wakes the sleepers"). The long plain shaft below it is cropped away,
   so the plate is not a staff standing in the road but a drawing of what the wand
   in his hand is doing, and it walks its own state graph on the master clock:
   sleep -> wake -> travel. Its frame is dropped clear of the card label, which the
   engine paints over the stage afterwards: at y .046 the title ran through it.

   TONE. The set is a bleached sunless plain and stays mostly paper; both crowds are
   drawn light with hard contour, with ink spent only on wounds, sockets, crests and
   the gate mouth. Nothing here paints a second background: the shades' own meadow,
   gate-notch and testimony arcs are switched OFF and the road paints the world. The
   bats are switched ON only while they are being driven — that is Homer's simile
   and it belongs to the driving, not to the muster.

   Beats (Od. 24.1–98):
     1. Hermes gathers the suitors' shades with his wand and leads them squeaking
        like bats toward the dead.
     2. They pass Ocean, the White Rock, the Gates of the Sun, and the land of dreams.
     3. In the meadow of asphodel they meet Achilles, Agamemnon, Ajax and other warriors.
     4. The dead gather to hear how so many noble young men died together.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S01.mjs --t 10   (the gathering)
            node harness/render-scene.mjs scenes/OD-B24-S01.mjs --t 44   (past the Gates)
            node harness/render-scene.mjs scenes/OD-B24-S01.mjs --t 62   (the muster)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, lerp, PAPER, INK }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field,   { anchors as ROAD } from "../assets/location/road-to-hades.mjs";
import hermes   from "../assets/character/hermes-psychopomp.mjs";
import shades   from "../assets/ensemble/suitors-shades.mjs";
import warriors from "../assets/ensemble/warrior-shades.mjs";
import wand     from "../assets/prop/hermess-wand.mjs";

const FIELD_ASSET = "location.road-to-hades";
const D = 64;

/* ==========================================================================
   THE SET'S OWN GEOMETRY, RESTATED
   location.road-to-hades keeps both of these private. They are copied here
   verbatim so the plan's stations are points on the drawn road and a body's
   size is the size that stretch of road is painted at.
   ========================================================================== */
const CR = [
  [0.545, 1.070], [0.545, 1.070], [0.372, 0.912], [0.268, 0.766],
  [0.398, 0.646], [0.596, 0.552], [0.548, 0.462], [0.486, 0.394], [0.486, 0.394],
];
function wayPtN(t){
  const segs = CR.length - 3;
  const u = clamp(t, 0, 1) * segs;
  const i = Math.min(Math.floor(u), segs - 1), s = u - i;
  const c = (a,b,cc,d) => 0.5*((2*b) + (-a+cc)*s + (2*a-5*b+4*cc-d)*s*s + (-a+3*b-3*cc+d)*s*s*s);
  const p0=CR[i], p1=CR[i+1], p2=CR[i+2], p3=CR[i+3];
  return { x:c(p0[0],p1[0],p2[0],p3[0]), y:c(p0[1],p1[1],p2[1],p3[1]) };
}
const HORIZON = 0.300, NEAR_Y = 1.060;
const groundU  = y => clamp((y - HORIZON) / (NEAR_Y - HORIZON), 0, 1);
const depthAtY = y => lerp(0.075, 1.000, Math.pow(groundU(y), 1.22));

/* ==========================================================================
   THE LOCAL PLAN
   Two kinds of station. ON-WAY stations carry the road parameter they were cut
   at, so a transit between two of them follows the curve. FIXED stations are the
   set's own exported anchors (rings, the contact pair, the meadow ground, the
   shingle bar) and are read straight out of ROAD. Neither is typed by hand.
   ========================================================================== */
const onWay = t => ({ t, p:wayPtN(t) });
const atSet = key => {
  const a = ROAD[key];
  if (!a) throw new Error(`[OD-B24-S01] the set exports no anchor "${key}"`);
  return { t:null, p:{ x:a.x, y:a.y } };
};

const GROUND = {
  /* the crossing, near the bottom edge — the living world is behind camera */
  entrance:      atSet("entrance:ocean"),
  landing:       onWay(0.00),
  bar:           atSet("ocean:bar"),
  ring_landing:  atSet("ring:landing"),
  crossing:      onWay(0.09),          // threshold 1 — the streams of Ocean
  shore:         onWay(0.19),
  /* the west side, read against the White Rock */
  rock:          onWay(0.33),          // threshold 2 — the White Rock
  rock_foot:     atSet("rock:foot"),
  lower_plain:   onWay(0.43),
  ring_waiting:  atSet("ring:waiting"),
  waiting_l:     atSet("meet:waiting_l"),
  waiting_r:     atSet("meet:waiting_r"),
  /* the gates and beyond */
  gate_approach: onWay(0.50),
  gate:          onWay(0.56),          // threshold 3 — the Gates of the Sun
  beyond_gate:   onWay(0.65),
  dreams:        onWay(0.75),          // threshold 4 — the country of dreams
  dream_exit:    onWay(0.86),
  /* the asphodel */
  meadow_head:   onWay(0.95),          // threshold 5 — the meadow of asphodel
  muster_l:      atSet("meet:muster_l"),   // CONTACT PAIR — the handover
  muster_r:      atSet("meet:muster_r"),
  meadow_east:   atSet("meadow:east"),     // where the war-dead already stand
  asphodel_edge: atSet("stele:5-asphodel"),// they come down to the road to hear
};

export const roadToHades = makePlan({
  id:"road-to-hades",
  name:"The Road to Hades",
  notes:"Local plan for OD-B24-S01, cut off location.road-to-hades' own way curve " +
        "and its own exported anchors. z IS the set's depth at the station, so the " +
        "plan and the road agree about who is in front. The plan owns topology; " +
        "groundOf()/sizeOf() below take the station back to the set for its screen " +
        "position and its size, because project() bottoms out at y .5288 and the " +
        "asphodel is painted at y .394.",
  stations:Object.fromEntries(Object.entries(GROUND).map(([k, g]) => [k, {
    x:+clamp(g.p.x, 0, 1).toFixed(4),
    z:+depthAtY(g.p.y).toFixed(4),
  }])),
  fixtures:[
    { id:"sun_gates",  kind:"set_piece", at:"gate" },
    { id:"white_rock", kind:"set_piece", at:"rock" },
    { id:"muster_ring",kind:"set_piece", at:"muster_l" },
  ],
});

/* ---- the set's ground, resolved off blockingAt's own from/to/u ------------
   A transit between two ON-WAY stations interpolates the ROAD PARAMETER and is
   evaluated on the curve, so a body walking from the crossing to the White Rock
   follows the bend the set painted instead of cutting the corner. Anything
   involving a fixed anchor lerps the two points. */
const G = name => {
  const g = GROUND[name];
  if (!g) throw new Error(`[OD-B24-S01] station "${name}" has no ground`);
  return g;
};
function groundOf(p){
  if (!p.moving) { const g = G(p.station); return { x:g.p.x, y:g.p.y }; }
  const a = G(p.from), b = G(p.to), u = p.u;
  if (a.t != null && b.t != null) return wayPtN(lerp(a.t, b.t, u));
  return { x:lerp(a.p.x, b.p.x, u), y:lerp(a.p.y, b.p.y, u) };
}
const sizeOf = p => depthAtY(groundOf(p).y);

/* one height for every walking body on this road, times the road's own falloff.
   At the crossing that is a figure about a third of the frame; at the meadow head
   it is a sixteenth of it, which is what an eleven-fold depth ladder means and why
   the muster reads as far away. .40 rather than .34: at .34 the guide was a 52px
   smudge by the country of dreams and could not be told from the verge stones. */
const MAN = 0.40;

/* ==========================================================================
   CONTINUITY IN — first scene of the book, opened from the plan.
   OD-B23-S06 ends in location.marriage-chamber with Odysseus and Penelope in the
   olive-tree bed. Not one of its stations exists on this road and not one of its
   bodies is on it, so there is no occupancy to translate and nothing to drop: the
   three parties here are opened from named road stations instead.
   ========================================================================== */
const INITIAL = {
  hermes:   "shore",         // already over the causeway, turned back on the flock
  shades:   "entrance",      // still coming up out of the world, behind camera
  warriors: "meadow_east",   // already in the asphodel; the destination, not an entrance
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   THE GUIDE IS ALWAYS TWO STATIONS UP THE ROAD, and that spacing is a rule and
   not a taste. A crowd plate covers a BAND of ground, not a point: the flock's
   far rank stands about a third of its own sheet above its footline, so a guide
   only one station ahead is inside the crowd's box and is painted over by the men
   he is leading. Drafted with Hermes opening at `crossing`, he came out standing
   in the middle of his own flock at t=10 and could not be found in the frame. */
const MOVES = [
  /* 1 — THE GATHERING. He calls them up out of the world and holds them on the
     shingle bar while he counts the flock; then he takes the lead. */
  { who:"shades",   from:"entrance",     to:"bar",           t0: 3, t1:11 },
  { who:"hermes",   from:"shore",        to:"rock",          t0:14, t1:21 },
  /* 2 — THE CROSSING. Ocean, the White Rock, the Gates of the Sun, the country of
     dreams. NOBODY HALTS ANYWHERE NEAR THE GATES — not in the mouth and not at
     `gate_approach` either. The mouth is the darkest solid in the set, five ink
     levels under everything around it and only 52px of a 760px frame tall, and the
     two piers stand at x .404 / .544 with `gate_approach` at x .398: rendered with
     halts there, Hermes first vanished into the black opening at t=34 and then, one
     station back, welded to the west pier at t=40 — a body fused to a fixture, twice.
     `lower_plain` -> `beyond_gate` is therefore ONE transit that carries the whole
     gate between two clear standing places, which is also what a threshold is for. */
  { who:"shades",   from:"bar",          to:"crossing",      t0:15, t1:22 },
  { who:"shades",   from:"crossing",     to:"shore",         t0:22, t1:29 },
  { who:"hermes",   from:"rock",         to:"lower_plain",   t0:24, t1:31 },
  { who:"shades",   from:"shore",        to:"rock",          t0:29, t1:36 },
  { who:"hermes",   from:"lower_plain",  to:"beyond_gate",   t0:35, t1:43 },
  { who:"shades",   from:"rock",         to:"lower_plain",   t0:36, t1:43 },
  { who:"hermes",   from:"beyond_gate",  to:"dreams",        t0:47, t1:51 },
  { who:"shades",   from:"lower_plain",  to:"beyond_gate",   t0:46, t1:53 },
  /* 3 — THE MEADOW. He brings them out of dream country onto the head of the
     asphodel and stands aside at the ring. */
  { who:"hermes",   from:"dreams",       to:"meadow_head",   t0:54, t1:58 },
  { who:"shades",   from:"beyond_gate",  to:"dreams",        t0:53, t1:57 },
  { who:"shades",   from:"dreams",       to:"dream_exit",    t0:57, t1:61 },
  /* 4 — THE MUSTER. The CONTACT PAIR: he halts left of the ring, they are driven
     the last step onto its right station. Two coordinates, never one. */
  { who:"hermes",   from:"meadow_head",  to:"muster_l",      t0:59, t1:63 },
  { who:"shades",   from:"dream_exit",   to:"muster_r",      t0:61, t1:64 },
  /*     and the famous dead come down off the meadow to the road's edge to hear. */
  { who:"warriors", from:"meadow_east",  to:"asphodel_edge", t0:50, t1:62 },
];



/* the set has a state channel and the passage is a state of the road, not a new
   road: `muster` strikes in the landing ring while the flock is held on the water,
   `arrival` lights the meadow ring and its contact pair as they come up to it. */
const FIELD_STATE = t => (t < 13 ? "muster" : t < 51 ? "passage" : "arrival");

/* ==========================================================================
   THE TWO CROWD PLATES
   Both ensembles are whole-frame drawings. Neither is a figure that placeInstance
   can size, because each lays its members out across its own sheet — so each is
   blitted into a RECT computed from where its station is and how big the road is
   there, and each plate's own reference line is put on the station's ground.

     · ensemble.suitors-shades sizes its members in ABSOLUTE source pixels (134
       back .. 228 near), so its scale is the blit ratio: a sheet blitted at k makes
       the near band 228k tall. SHADE_K sets k against the road's depth so the flock
       shrinks up the road exactly like a walking man does, and the sheet is WINDOWED
       (see SHADE_* below).
     · ensemble.warrior-shades sizes its members as fractions of its sheet HEIGHT,
       so it is rendered AT the destination size and never resampled, and it is
       reduced to its near rank (see WAR_* below).
   ========================================================================== */
/* THE SHEET IS THE INSTRUMENT AND IT HAS ONE RIGHT SIZE, AND THE ROAD ONLY WANTS
   PART OF IT. Member SIZE is absolute source pixels (134 back .. 228 near) while
   member SPACING is a fraction of the sheet, so the sheet's dimensions alone decide
   how far apart the men stand. Two drafts got this wrong and the render said so:
   at 640x760 the five knots closed to within a shoulder of each other and the crowd
   came out an unreadable tangle of contour; at 1040x780 they were far enough apart
   sideways but the three tiers were 300px apart carrying 228px men, so the file in
   `column` stacked into one blot at t=44.

   1240x1160 is close to the proportion the module's own standalone plate is drawn
   at, and at that size every tier separates. But a sheet that deep is a CROWD IN A
   DEEP FIELD, and this road has no deep field to give it at mid distance: blitted
   whole it stood 500px tall on a 760px frame and its back rank came out above the
   meadow kerb. So the flock is WINDOWED to its front two thirds — everything below
   sheet y .55, which in every formation the scene uses (huddle / column / clusters /
   arc) is the mid knot and the two near knots, eight or nine men. Inside that window
   the crowd's own depth and the ROAD's depth finally agree: on the lower plain the
   mid knot renders 80px where the road's ladder asks for 76 and the near knot 112
   where it asks for 149 — so the shades read a little shorter than a living man,
   which is what they are.

   The bats are the other two thirds of the sheet — they live at sheet y .09..-.20,
   above the window — so Homer's simile is blitted SEPARATELY through the same
   mapping and hung just over the flock's heads. */
const SHADE_CW = 1240, SHADE_CH = 1160;
const SHADE_K  = 1.00;                   // blit ratio per unit of road depth
const SHADE_WIN = { x0:0.04, y0:0.55, x1:0.96, y1:1.00 };   // the men
const SHADE_BAT = { x0:0.05, y0:0.03, x1:0.56, y1:0.26 };   // the simile
const SHADE_FOOT = 0.848;                // the near band's footline in the sheet

/* ONE RANK, not a three-tier chorus. ensemble.warrior-shades sets its back tier
   at a FIXED .29 of its own sheet and its front tier at `groundY`, and that spread
   is deeper than the band of asphodel it has to stand in: the meadow runs from the
   horizon at y .300 to the kerb at y .418, a tenth of the frame, and the full
   chorus put its back rank above the skyline and lost the whole group in the far
   ridge. `layer:"foreground"` is the module's own answer — it keeps the near rank
   only — so the famous dead stand as one rank across the asphodel, at a size the
   dot lattice can actually hold. */
const WAR_AR   = 1.00;
const WAR_DH   = 1600;                   // sheet height per unit of road depth
const WAR_GY   = 0.62;                   // the single rank's shoulder line
const WAR_FOOT = 0.745;                  // that rank's feet in the sheet

function blitPlate(offctx, mod, cw, ch, dst, state, sig){
  const cv = keyedModuleCanvas(mod, Math.round(cw), Math.round(ch), state, sig);
  offctx.drawImage(cv, 0, 0, cv.width, cv.height, dst.x, dst.y, dst.w, dst.h);
}
/* blit ONE declared window of a sheet, keyed, so the road shows between its lines
   and the sheet's own paper never lands as a rectangle. */
function blitWindow(offctx, mod, cw, ch, win, dst, state, sig){
  const cv = keyedModuleCanvas(mod, Math.round(cw), Math.round(ch), state, sig);
  offctx.drawImage(cv,
    win.x0*cw, win.y0*ch, (win.x1-win.x0)*cw, (win.y1-win.y0)*ch,
    dst.x, dst.y, dst.w, dst.h);
}

/* ==========================================================================
   THE WAND PLATE — windowed to the CHARM CROWN only (see header). The sheet is
   660x880 because prop.hermess-wand types its wand in FIXED pixels (length 640)
   against that sheet; drawn smaller the finial comes out bigger than the shaft.
   The window holds the crown through every angle the three modes use, so the
   drawing moves inside its own frame instead of being cropped by it.
   ========================================================================== */
const WAND_CW = 660, WAND_CH = 880;
const WAND_WIN = { x0:0.094, y0:0.000, x1:0.712, y1:0.380 };
const WAND_DST = { x0:0.046, y0:0.078, x1:0.201, y1:0.266 };
/* sleep (the charm that puts the eyes of men under) -> wake (the charm that
   wakes the sleepers, which is what a summons of the dead is) -> carry (the wand
   stowed: the escort is over). `travel` is not used — its -.34 rad swing throws
   the crown out of the window and the plate came out a scribble. */
const WAND_MODE = t => (t < 9 ? "sleep" : t < 55 ? "wake" : "carry");

function detailField(offctx, W, H, dst){
  const x = dst.x0*W, y = dst.y0*H, w = (dst.x1-dst.x0)*W, h = (dst.y1-dst.y0)*H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 4;
  offctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  offctx.restore();
}
function wandPlate(offctx, W, H, t){
  detailField(offctx, W, H, WAND_DST);
  const mode = WAND_MODE(t);
  const cv = keyedModuleCanvas(wand, WAND_CW, WAND_CH, { mode, t:0.5 }, "b24s01|"+mode);
  offctx.drawImage(cv,
    WAND_WIN.x0*WAND_CW, WAND_WIN.y0*WAND_CH,
    (WAND_WIN.x1-WAND_WIN.x0)*WAND_CW, (WAND_WIN.y1-WAND_WIN.y0)*WAND_CH,
    WAND_DST.x0*W, WAND_DST.y0*H,
    (WAND_DST.x1-WAND_DST.x0)*W, (WAND_DST.y1-WAND_DST.y0)*H);
}

export const scene = {
  id:"OD-B24-S01",
  title:"The Suitors Enter Hades",
  book:24,
  plan:"road-to-hades",
  duration:D,
  beats:[
    "Hermes gathers the suitors' shades with his wand and leads them squeaking like bats toward the dead.",
    "They pass Ocean, the White Rock, the Gates of the Sun, and the land of dreams.",
    "In the meadow of asphodel they meet Achilles, Agamemnon, Ajax, and other warriors.",
    "The dead gather to hear how so many noble young men died together.",
  ],
  exitState:"The far end of the road to Hades, in the meadow of asphodel. Hermes " +
    "Kyllenios has finished the job: the souls of the suitors, one day dead and " +
    "still carrying the wounds that killed them, have been called up out of the " +
    "house with the golden wand, driven gibbering like bats along the streams of " +
    "Ocean, past the White Rock, through the Gates of the Sun and the country of " +
    "dreams, and delivered onto the muster ground. He stands off the ring's left " +
    "station with the wand carried low, the escort discharged and no longer " +
    "leading. The flock is halted on the ring's right station, out of file and " +
    "falling back into the knots they kept in the megaron, every man turned toward " +
    "the meadow and ready to say how he died. Across the asphodel the famous dead " +
    "of Troy — Achilles, Agamemnon, Ajax and the war-dead with them — have come " +
    "down off the meadow to the fifth stele at the road's edge and are aimed at " +
    "the new arrivals, waiting for the account. Nothing has been told yet. The " +
    "next scene opens on that account: one voice out of the new dead, and a " +
    "chorus of the old dead already turned to hear it.",
  exitOccupancy:occupancyAt(roadToHades, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ shades:"entrance (entrance:ocean — the living world is behind camera)",
              hermes:"shore (already over the causeway, turned back on the flock)",
              warriors:"none — already standing in the asphodel at meadow_east" },
  exits:{ hermes:"none — he holds muster_l, the escort discharged",
          shades:"none — muster_r is where Book XXIV leaves them",
          warriors:"none — asphodel_edge, aimed at the new dead" },
  walkable:"road-to-hades stations on the way (landing..meadow_head), plus the " +
           "shingle bar, the three holding rings, the two declared contact pairs " +
           "and the meadow ground. The plan owns them; the way itself is the only " +
           "continuous surface and every transit between two on-way stations is " +
           "evaluated on the set's own curve.",
  depthOrder:"one queue sorted by the SET's ground y, far first: warriors " +
             "(.408 -> .466) behind hermes and the flock while they are still down " +
             "the road, in front of neither once the flock reaches the muster. The " +
             "wand plate is a diagram and is laid over everything last.",
  gazeTargets:{ hermes:"back over the gathering shoulder at the flock, then ahead " +
                        "down the crossing, then across at the war-dead",
                shades:"Hermes and the wand, then the road, then the meadow",
                warriors:"the new dead arriving at the muster ring" },
  attachments:[
    { at: 0, who:"hermes",  change:"rhabdos raised at his right on the summons " +
      "(wandTilt .10, wandLen 3.9); prop.hermess-wand plate in mode `sleep`" },
    { at: 9, who:"wand_01", change:"prop.hermess-wand plate to mode `wake` — the " +
      "charm that wakes the sleepers, spark at the finial" },
    { at:12, who:"hermes",  change:"wand carried low and forward as the pointer " +
      "(pose hp_lead); the two diagram pulses go off for the long haul" },
    { at:40, who:"hermes",  change:"wand levelled as the pointer into the meadow " +
      "(wandTilt .62), the two diagram pulses back on" },
    { at:55, who:"hermes",  change:"wand lowered and carried; plate to mode `carry` " +
      "— the wand stowed, the escort discharged" },
  ],
  sound:[
    { at: 0, source:"entrance",   cue:"the golden wand struck once; a hall emptying of its dead" },
    { at: 3, source:"bar",        cue:"the shades gibbering — bats disturbed in a cave, thin and dry" },
    { at:13, source:"crossing",   cue:"the streams of Ocean running over the causeway slabs" },
    { at:25, source:"rock",       cue:"nothing at all under the White Rock; the flock's noise thins" },
    { at:37, source:"gate",       cue:"the Gates of the Sun — a hollow draught out of the mouth" },
    { at:48, source:"dreams",     cue:"the country of dreams; voices with no bodies behind them" },
    { at:57, source:"muster_r",   cue:"the flock halted, breaking out of file into knots" },
    { at:59, source:"asphodel_edge", cue:"the war-dead coming down through the asphodel to hear" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"muster" },
    { asset:"ensemble.warrior-shades", instance:"warriors",
      anchor:{x:.720,y:.408}, scale:.23, pose:"listening" },
    { asset:"ensemble.suitors-shades", instance:"shades",
      anchor:{x:.545,y:.998}, scale:.90, pose:"huddled" },
    { asset:"character.hermes-psychopomp", instance:"hermes",
      anchor:{x:.352,y:.891}, scale:.302, band:"threeq", pose:"hp_summon" },
    { asset:"prop.hermess-wand", instance:"wand_01",
      anchor:{x:.124,y:.266}, scale:.155, pose:"sleep" },
  ],

  timeline:[
    // 1 — the summons and the gathering
    { op:"actor.pose", target:"hermes",   at: 0.0, args:{ pose:"hp_summon" } },
    { op:"actor.gaze", target:"hermes",   at: 0.0, args:{ gaze:{ x:-.18, y:-.22 } } },
    { op:"set.state",  target:"shades",   at: 0.0, args:{ state:"huddled" } },
    { op:"set.state",  target:"warriors", at: 0.0, args:{ state:"listening" } },
    { op:"set.state",  target:"wand_01",  at: 0.0, args:{ state:"sleep" } },
    { op:"set.state",  target:"wand_01",  at: 9.0, args:{ state:"wake" } },
    { op:"actor.pose", target:"hermes",   at: 9.0, args:{ pose:"hp_gather" } },
    { op:"actor.gaze", target:"hermes",   at: 9.0, args:{ gaze:{ x:-.50, y:.04 } } },
    { op:"set.state",  target:"shades",   at:11.0, args:{ state:"driven" } },
    // 2 — the crossing
    { op:"actor.pose", target:"hermes",   at:12.0, args:{ pose:"hp_lead" } },
    { op:"actor.gaze", target:"hermes",   at:12.0, args:{ gaze:{ x:-.22, y:-.06 } } },
    { op:"set.state",  target:"field_01", at:13.0, args:{ state:"passage" } },
    { op:"set.state",  target:"warriors", at:31.0, args:{ state:"turning" } },
    { op:"set.state",  target:"wand_01",  at:55.0, args:{ state:"carry" } },
    // 3 — the meadow
    { op:"actor.pose", target:"hermes",   at:40.0, args:{ pose:"hp_gather" } },
    { op:"actor.gaze", target:"hermes",   at:40.0, args:{ gaze:{ x:-.10, y:.02 } } },
    { op:"set.state",  target:"field_01", at:51.0, args:{ state:"arrival" } },
    { op:"set.state",  target:"shades",   at:55.0, args:{ state:"clustering" } },
    // 4 — the muster
    { op:"set.state",  target:"warriors", at:55.0, args:{ state:"assenting" } },
    { op:"actor.gaze", target:"hermes",   at:57.0, args:{ gaze:{ x:.34, y:-.04 } } },
    { op:"set.state",  target:"shades",   at:59.0, args:{ state:"explaining" } },
    { op:"timeline.capture", target:"OD-B24-S01", at:62.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s   = stateAt(scene, t);
    const blk = blockingAt(roadToHades, MOVES, t, INITIAL);

    /* the field first — it paints the road, everything else keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:FIELD_STATE(t), t:0.4,
              progress:Math.min(.94, .16 + .76*(t/D)), status:"THRESHOLDS" },
    });

    /* one queue, sorted by the SET's own ground y: the road decides who stands in
       front, not the order these blocks happen to be written in. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- THE WAR-DEAD: already in the asphodel, then down to the road's edge -- */
    {
      const p  = blk.warriors;
      const g  = groundOf(p), z = sizeOf(p);
      const dh = WAR_DH * z, dw = dh * WAR_AR;
      const dst = { x:g.x*W - dw*0.5, y:g.y*H - dh*WAR_FOOT, w:dw, h:dh };
      // aim them at wherever the new dead are standing, in the plate's own space
      const fp = groundOf(blk.shades);
      const phase = t < 31 ? "listening" : t < 55 ? "turning" : "assenting";
      const wave  = clamp(0.10 + 0.90*((t - 45)/22), 0.06, 1);
      const att   = clamp(0.30 + 0.70*((t - 40)/20), 0.25, 1);
      // "the dead gather": the rank fills out as the new arrivals come up
      const perRow = t < 45 ? [4,4] : t < 57 ? [4,5] : [4,6];
      add(g.y, () => blitPlate(offctx, warriors, dw, dh, dst, {
        formation:"chorus-arc", rows:2, perRow,
        phase, wave, waveLag:0.7, attention:att, layer:"foreground",
        focus:{ x:clamp((fp.x*W - dst.x)/dw, -0.4, 1.4),
                y:clamp((fp.y*H - dst.y)/dh,  0.2, 1.4) },
        /* THE DIAGRAM MARKS ARE THE READING AT DISTANCE. At the asphodel a
           warrior's body is about 60 stage pixels and its light planes fall out of
           the lattice, leaving only crest and spear ticks — confetti. The module's
           own focus tick and aiming arc are long thin ink, they hold at any size,
           and they say the one thing the beat is about: this rank is aimed at the
           new dead. They come on with the turn. */
        groundY:WAR_GY, showFocus: t >= 50, showWave: t >= 55, showMeadow:false,
        status: phase === "assenting" ? "THE DEAD GATHER" : "THE FAMOUS DEAD",
        progress: Math.min(.96, .12 + .80*(t/D)),
      }, `b24s01|w|${phase}|${perRow[1]}|${wave.toFixed(2)}|${att.toFixed(2)}`));
    }

    /* --- THE SUITORS' SHADES: driven up the whole road as one flock ---------- */
    {
      const p  = blk.shades;
      const g  = groundOf(p), z = sizeOf(p);
      const k  = SHADE_K * z;
      /* ONE mapping from the sheet to the frame, so the men and the bats above them
         are two windows of the same drawing at the same scale and can never drift
         apart: sheet (0.5, SHADE_FOOT) is put on the station's ground. */
      const ox = g.x*W - 0.5*SHADE_CW*k;
      const oy = g.y*H - SHADE_FOOT*SHADE_CH*k;
      const rect = win => ({ x:ox + win.x0*SHADE_CW*k, y:oy + win.y0*SHADE_CH*k,
                             w:(win.x1-win.x0)*SHADE_CW*k, h:(win.y1-win.y0)*SHADE_CH*k });
      const men = rect(SHADE_WIN);
      const bat = rect(SHADE_BAT);
      bat.y = men.y - bat.h*0.86;          // hung just over their heads, not in the sky
      const called   = t < 11;
      const driven   = t >= 11 && t < 55;
      const settling = t >= 55 && t < 59;
      const formation = called ? "huddle" : driven ? "column" : "clusters";
      const batsOn = t >= 3 && t < 50;
      // the guide is what they are watching until they are put down in the meadow
      const hp = groundOf(blk.hermes);
      const st = {
        formation,
        density: called ? 0.72 : 1.0,
        attention: called ? 0.24 : driven ? 0.14 : settling ? 0.40 : 0.92,
        wave: clamp(0.16 + 0.72*((t % 19)/19), 0, 1),
        waveWidth: called ? 0.46 : driven ? 0.30 : 0.24,
        fear: called ? 0.82 : driven ? 0.52 : settling ? 0.34 : 0.22,
        foreground:0.72, background:0.58,
        focus:{ x:clamp((hp.x*W - ox)/(SHADE_CW*k), -0.6, 1.6),
                y:clamp((hp.y*H - oy)/(SHADE_CH*k), -0.4, 1.6) },
        // the road paints the world: the sheet's own meadow, gate-notch and
        // testimony arcs stay off. The testimony comes on only at the muster,
        // where the bodies are 36px and the dotted speech arcs are what reads.
        showMeadow:false, showGate:false, showTestimony: t >= 57,
        showBats: batsOn,
        status: called ? "SUMMONED" : driven ? "DRIVEN" : settling ? "OUT OF FILE" : "EXPLAINING",
        progress: Math.min(.96, .14 + .80*(t/D)),
      };
      const sig = `b24s01|s|${formation}|${called?1:driven?2:settling?3:4}|${Math.round(t)}`;
      add(g.y, () => {
        if (batsOn) blitWindow(offctx, shades, SHADE_CW, SHADE_CH, SHADE_BAT, bat, st, sig);
        blitWindow(offctx, shades, SHADE_CW, SHADE_CH, SHADE_WIN, men, st, sig);
      });
    }

    /* --- HERMES: the guide, always one stage up the road from his flock ------ */
    {
      const p  = blk.hermes;
      const g  = groundOf(p), z = sizeOf(p);
      const c  = s.hermes || {};
      const calling  = t < 9;
      const counting = t >= 9 && t < 12;
      const leading  = t >= 12 && t < 40;
      const handing  = t >= 55;
      add(g.y, () => placeInstance(offctx, W, H, hermes, {
        anchor:{ x:g.x, y:g.y }, scale:MAN * z,
        state:{
          t: leading ? (t*0.07) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "hp_gather",
          gaze: c.gaze || { x:-.40, y:.04 },
          wand:true,
          wandTilt: calling ? .10 : leading ? .20 : handing ? .34 : .62,
          wandLen:  calling ? 3.9 : leading ? 3.3 : 3.1,
          field: !leading,
          browUp:   calling ? .55 : counting ? .12 : .06,
          browKnit: leading ? .22 : .14,
          eyeNarrow:leading ? .20 : counting ? .14 : 0,
          eyeWide:  calling ? .30 : 0,
          jaw:      calling ? .58 : counting ? .22 : 0,
          smile:    handing ? .10 : counting ? .06 : 0,
          status:   calling  ? "SUMMONING"
                  : counting ? "SHEPHERDING"
                  : leading  ? "LEADING"
                  : handing  ? "DELIVERED"
                             : "ORIENTING",
          progress: Math.min(.96, .18 + .76*(t/D)),
        },
      }));
    }

    /* far → near, by the SET's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());

    /* --- THE WAND, as its own detail plate: a drawing of the instrument, not a
       second wand in the world. Laid over the sunless sky last. */
    wandPlate(offctx, W, H, t);
  },
};
export default scene;

/* named binding so OD-B24-S02 can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
