/* ============================================================
   SCENE  OD-B24-S07 — Zeus and Athena Set the Terms
   Book XXIV, scene 7 of the book. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from the
   scene immediately before this one, OD-B24-S06.

   WHERE — AND WHY THE INHERITED OCCUPANCY IS DROPPED WHOLE. OD-B24-S06 plays on
   the meeting and funeral ground below the town of Ithaca and hands over three
   bodies at three town stations. This scene is not in Ithaca and is not on the
   earth. It is on OLYMPUS, in location.olympian-decision-space — the council
   hall of Book I struck down to the one configuration Book XXIV needs: two
   speakers, one question, one verdict. So this is brief section F at its limit
   for the second scene running, and the translation map is EMPTY ON PURPOSE.
   Eupithes is on the farm road at the head of an armed column, Halitherses is
   sitting on the caution ground refusing to march, and Medon and Phemius are
   still on the left speaking slab. None of the three is a god and none of them
   can be on Olympus; carrying any of them across would be a lie about where the
   poem has them, and about what kind of place this is. The import is still made
   and the map still declared, because the discipline is the point:
   TOWN_TO_OLYMPUS names every station S06 hands over and refuses all three, and
   blockingAt() would throw on any of them if one leaked through. The two gods
   this scene is about are already in the room when it opens — that is what an
   Olympian scene is: nobody arrives, the question does.

   THE PLAN IS DERIVED FROM THE SET, AND THE SET OWNS THE GROUND. Same division
   as OD-B24-S06, restated because it is load-bearing here too: engine/blocking's
   project() puts a d=1 body at screen y .96 and bottoms out at y .5288, but this
   chamber's floor runs from the cloud sill at y .560 to y 1.020 and its whole
   ring sits at y .752 — every station in the room falls inside project()'s dead
   band, and its 1.7:1 size falloff is not this set's 1.79:1 either. So THE PLAN
   OWNS TOPOLOGY — who is at which named station, what a transit interpolates
   along, what the unknown-station throw protects, what exitOccupancy hands on —
   and THE SET OWNS THE GROUND: groundOf() and sizeOf() take a station name
   straight back to location.olympian-decision-space's own exported anchors and
   its own depthAtY(). The plan's z IS depthAtY() at the station, so the plan and
   the ground agree about who is in front. Not one figure coordinate in this file
   is hand-tuned: the four standing places are the set's own petitioner and judge
   anchors walked a named fraction along the set's own axis toward the set's own
   ring centre, and the descent station is the set's own descent threshold read
   down onto the set's own cloud sill.

   THE ROOM IS STATE, NOT TWO ROOMS. `judgment` -> `peace` on one clock: the same
   twelve places, ten of them struck and dashed, the same two stations inked
   solid, the same balance on the axis. Only the beam moves. (Brief section D.)
   This is also why no second Olympus is cast: location.olympian-council-hall is
   the same architecture at full assembly, and this set IS that hall reduced. One
   hall, two configurations.

   THE FIXTURES ARE FIXTURES AND THE BODIES STAND BESIDE THEM. The set paints a
   rostrum on `station:petitioner` and a throne on `station:judge`, so those two
   anchors are furniture, not standing places. Each god is blocked to a station a
   NAMED FRACTION along the axis from their own fixture toward the ring centre —
   .30 for the speaking place beside the fixture, .50 for the step onto the axis
   — which is what puts Athena's rostrum clear on her outboard side and Zeus's
   throne clear on his, instead of a figure printing on top of the furniture that
   says who they are. The two speaking places are ~.54 of the frame apart, the
   maximum this room allows: a contact pair by construction that can never
   resolve to one coordinate.

   THE BALANCE IS THE ONLY THING IN THE FRAME THAT ARGUES. The set exports
   occlusion:{behind, ground, front} and this scene uses it, but not the way the
   set's default suggests: the location is placed TWICE, once for everything
   through `balance` and once, after the figures, for `fg` alone. The balance is
   in the GROUND pass, not the front one, and that is a consequence of the
   blocking rather than a preference. Nothing in this scene is ever upstage of
   the balance and overlapping it — the two gods stand at x .269/.335 and
   .665/.731 and never come within a body's width of the standard at x .481..519,
   and Athena's exit was re-routed down the NEAR lane precisely so that when she
   does cross the centre she is in front of the machine and ought to cover it.
   Putting the balance in the front pass would have printed the plinth, the shaft
   and both pans over the one body that is correctly nearer than all of them. The
   corner plinths stay in the front pass, because a figure passing behind them is
   exactly what the set says they are for. `tilt` is a continuous ramp on the
   master clock, not a state flip: it drifts to -.22 (the war pan) while the
   question hangs, and then swings to +.62 (the west pan, the petitioner's,
   falls) as the verdict is given. The verdict is legible with the sound off and
   with no caption.

   THE DECREE IS AN INSTRUMENT, NOT A CAPTION. divine-fx.peace-decree is a whole
   legal plate — assent seal, spine rail, five counted clauses, duration axis and
   the vendetta line flattening under an advancing front. Four things about how
   it is placed, and each one is measured against this set rather than picked:
     · IT IS PLACED IN THE OPEN SKY ABOVE THE ROOFLINE, AND ITS SIZE IS WHAT
       SOLVES THAT. The chamber's back wall is three panels with tops at y .310 /
       .364 / .322, the architrave is two short beams at y .222..261 over the
       outer quarters, and the descent threshold is cut between panels 2 and 3
       with a dashed pediment reaching up to y .276. The plate has to clear all
       of it, and placeInstance forces its box to the stage aspect, so ONE number
       does it: at DECREE_S .34 the plate's own bottom edge falls at y .265 and
       its feud line — the island the decree lands on — at y .287, above every
       panel top; DECREE_Y .335 is then the lowest foot that still keeps the
       assent seal's sworn boundary on the frame; and DECREE_X .43 is the only
       centre that puts the clause plates inboard of the left beam's right end
       (x .292) AND the feud's right end inboard of the descent pediment. Drafted
       at .385 the plate could not be lifted clear without cutting the seal off
       the top of the frame, and its bottom third printed straight through the
       cornice of panel 2 and the descent lintel — the goddess left through her
       own decree.
     · ITS FIELD IS THE SAME TONE AS THE SKY AND THAT IS WHY IT DOES NOT PRINT AS
       A BOX. The module floods its tablet with inkLevel(1) — gray(219),
       luminance .8588, which borderKey at the .895 default will not clear. It
       does not have to: this set's sky is T.sky = 1, the identical level, so the
       tablet plate is invisible and only its hard contour, its spine, its clause
       plates (level 0 pending, level 2 bound) and its seals read. The plate is
       carried by the room's own tone instead of fighting it.
     · IT IS DRIVEN, NOT PREVIEWED. bind / settle / reach / tilt are four
       separate ramps on the master clock so the instrument fills in the causal
       order of the beats — the spine descends while Zeus weighs, clause I
       (KINGSHIP) seals on the word that keeps Odysseus king, II..V (OATH,
       FORGETTING, WEALTH, STABILITY) seal across the order to forget, and the
       settling front only starts to run once the forgetting clause has taken.
       At t=0 the plate is a blank form with the feud jagged end to end, which is
       precisely beat 1: the question, drawn as an unsigned instrument.
     · ITS COUNTS ARE GEOMETRY. The clause indices are square pips and the room's
       station numbers are stacked tally bars. Nothing in this frame depends on
       small type surviving the dot lattice.

   NO DISGUISE, NO FLARE, NO RESTORATION. Odysseus is not in this scene — he is
   the subject of every sentence in it and the body in none of them, which is the
   whole shape of an Olympian scene — so character.odysseus-b16's guise channel
   is not touched and there is no discontinuity anywhere in this file for
   divine_fx.athenas-restoration to cover. It is not cast.

   TONE. The set's table is a bright chamber (sky and floor at ink level 1, the
   order at 2, the wall at 3) and levels 5-6 are spent only on the throne recess,
   the balance pivot and the tally cuts, so the biggest planes in the frame are
   paper. Nothing here darkens them: the decree is paper-dominant by
   construction, Zeus is a light robe with a grey mane and Athena a grey armour
   with one cloak wedge, and the two of them together occupy well under a tenth
   of the frame. ZERO hand-drawn ctx overpaint on any figure in this file. The
   rig does all of it.

   Beats (Od. 24.472-488):
     1. Athena asks Zeus whether the conflict should continue or peace be imposed.
     2. Zeus declares that Odysseus may remain king after punishing the suitors.
     3. He orders both sides to forget the bloodshed through oath and renewed
        prosperity.
     4. Athena descends toward Ithaca to terminate the cycle.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S07.mjs --t 12  (the question)
            node harness/render-scene.mjs scenes/OD-B24-S07.mjs --t 80  (the descent)
   ============================================================ */
import { placeInstance, clamp, clamp01, lerp, smooth }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { anchors as OLYMPUS } from "../assets/location/olympian-decision-space.mjs";
import zeus   from "../assets/character/zeus.mjs";
import athena from "../assets/character/athena.mjs";
import decree from "../assets/divine_fx/peace-decree.mjs";

const FIELD_ASSET = "location.olympian-decision-space";
const D = 88;

/* ==========================================================================
   THE SET'S OWN DEPTH LADDER, RESTATED
   location.olympian-decision-space keeps depthAtY() private. It is copied here
   verbatim so that a body's size is the size this chamber is painted at — the
   throne, the rostrum, the struck benches and the numbering steles are all
   sized from it, and now so is each god.
   ========================================================================== */
const HORIZON = 0.560, NEAR_Y = 1.020;
const groundU  = y => clamp((y - HORIZON) / (NEAR_Y - HORIZON), 0, 1);
const depthAtY = y => lerp(0.560, 1.000, Math.pow(groundU(y), 0.90));

/* ==========================================================================
   THE LOCAL PLAN — every station is one of the set's OWN exported anchors, or a
   named fraction between two of them. Nothing is typed as a coordinate; atSet()
   throws if the set ever stops exporting a name, which is the same protection
   blockingAt() gives inside the scene.
   ========================================================================== */
const atSet = key => {
  const a = OLYMPUS[key];
  if (!a) throw new Error(`[OD-B24-S07] the set exports no anchor "${key}"`);
  return { x:a.x, y:a.y };
};

const PET    = atSet("station:petitioner");   // the rostrum — a FIXTURE
const JUDGE  = atSet("station:judge");        // the throne  — a FIXTURE
const CENTRE = atSet("axis:centre");          // the balance — a FIXTURE
const SILL   = atSet("threshold:sill");       // where the floor runs out into sky
const GAP    = atSet("threshold:descent");    // the opening in the wall, toward Ithaca
const STAIR  = atSet("entrance:stair");       // up out of the near edge of the floor

/* a standing place on the judgment axis: `f` of the way from a fixture toward
   the ring's centre, stepped `dy` nearer so the body clears the furniture it
   belongs to instead of printing on top of it. */
/* .30 is the fraction that clears the fixture; .50 lands exactly on the set's
   own `axis:west-quarter` / `axis:east-quarter`, whose outboard edge is where
   the balance's pan hangs — a body at .50 stands a hair clear of its own pan. */
const onAxis = (fix, f, dy) => ({ x:lerp(fix.x, CENTRE.x, f), y:fix.y + dy });

/* a place on the NEAR floor: a point's own x brought `f` of the way from the
   ring toward the set's own near stair. This is the lane in front of the
   balance, and it is the only lane in the room a body can cross the centre in. */
const nearer = (pt, f) => ({ x:pt.x, y:lerp(pt.y, STAIR.y, f) });

const GROUND = {
  /* THE TWO FIXTURES — surveyed, never occupied */
  rostrum_w:  PET,
  throne_e:   JUDGE,
  balance_c:  CENTRE,
  pan_w:      atSet("balance:pan-west"),
  pan_e:      atSet("balance:pan-east"),
  pivot:      atSet("balance:pivot"),
  stele_1:    atSet("stele:1-petitioner"),
  stele_2:    atSet("stele:2-judge"),
  /* THE FOUR STANDING PLACES — the west pair and the east pair, and they are
     the maximum distance apart this room allows */
  ask_w:      onAxis(PET,   0.30,  0.034),   // Athena beside her rostrum
  near_w:     onAxis(PET,   0.50,  0.030),   // Athena a step onto the axis
  dais_e:     onAxis(JUDGE, 0.30,  0.034),   // Zeus beside his throne
  axis_e:     onAxis(JUDGE, 0.50,  0.030),   // Zeus a step onto the axis
  /* THE MEETING PAIR the set authors on the axis — a contact pair, kept open
     here because these two gods never touch */
  meet_l:     atSet("meet:axis_l"),
  meet_r:     atSet("meet:axis_r"),
  /* THE WAY OUT, AND IT IS NOT A DOOR. The descent threshold is cut in the sky
     ABOVE the cloud sill; the station is its x read down onto the floor, framed
     by the gap she is about to go through. THE OFFSET FROM THE SILL IS MEASURED,
     NOT CHOSEN: the set ranges its five struck benches on an arc whose ground
     line runs across y .5997, eleven thousandths below the sill itself, so a
     body put "on the sill" stands with a cancelled bench through its shins; and
     the east pan of the balance hangs across y .652..672, so a body much above
     .69 gets a scale dish over its ankles. +.140 clears both: she stands on open
     floor in front of the whole bank and in front of the pan, with her head and
     shoulders inside the opening, and it is still the farthest upstage any body
     gets in this scene. */
  descent:    { x:GAP.x, y:SILL.y + 0.140 },
  sill_c:     SILL,
  /* THE NEAR LANE — the only line across the middle of this room that misses
     the balance's standard. See the blocking note. */
  floor_n:    nearer(CENTRE, 0.54),
  east_n:     nearer({ x:lerp(CENTRE.x, JUDGE.x, 0.30), y:CENTRE.y }, 0.26),
  /* the room's own ways in and out, surveyed and unused by this scene */
  entrance_w: atSet("entrance:west"),
  exit_e:     atSet("exit:east"),
  stair_n:    atSet("entrance:stair"),
};

export const olympianAxis = makePlan({
  id:"olympian-judgment-axis",
  name:"Olympus — the decision space, reduced to two speakers and one axis",
  notes:"Local plan for OD-B24-S07, cut station for station off " +
        "location.olympian-decision-space's own exported anchors. z IS the " +
        "set's depthAtY() at the station, because project() puts a d=1 body at " +
        "y .96 and bottoms out at y .5288 while this chamber's whole ring sits " +
        "at y .752 — every station in the room falls inside project()'s dead " +
        "band. `rostrum_w`, `throne_e`, `balance_c`, `pan_w`, `pan_e`, `pivot`, " +
        "`stele_1` and `stele_2` are FIXTURES — survey references for the " +
        "rostrum, the throne, the balance and the two numbering steles — not " +
        "standing places, and nobody is ever blocked onto them. The four " +
        "standing places are each a named fraction along the axis from a " +
        "fixture toward the ring centre (.30 beside it, .50 a step onto the " +
        "axis) so a god clears their own furniture. `meet_l`/`meet_r` are the " +
        "set's authored contact pair and are never occupied by one body.",
  stations:Object.fromEntries(Object.entries(GROUND).map(([k, p]) => [k, {
    x:+clamp(p.x, 0, 1).toFixed(4),
    z:+depthAtY(p.y).toFixed(4),
  }])),
  fixtures:[
    { id:"rostrum", kind:"rostrum",   at:"rostrum_w" },
    { id:"throne",  kind:"throne",    at:"throne_e" },
    { id:"balance", kind:"balance",   at:"balance_c" },
    { id:"stele_1", kind:"marker",    at:"stele_1" },
    { id:"stele_2", kind:"marker",    at:"stele_2" },
    { id:"gap",     kind:"threshold", at:"descent" },
  ],
});

/* ---- the set's ground, resolved off blockingAt's own from/to/u ------------ */
const G = name => {
  const g = GROUND[name];
  if (!g) throw new Error(`[OD-B24-S07] station "${name}" has no ground`);
  return g;
};
function groundOf(p){
  if (!p.moving) return G(p.station);
  const a = G(p.from), b = G(p.to);
  return { x:lerp(a.x, b.x, p.u), y:lerp(a.y, b.y, p.u) };
}
const sizeOf = p => depthAtY(groundOf(p).y);

/* ==========================================================================
   FIGURE SIZE — one box height for every standing body in this chamber, times
   the set's own falloff, and every sole put down BY HAND-OFF rather than by eye.

   BOX .44 IS CALIBRATED ON THE THRONE, and that is the whole of it. The set
   draws the judge's seat with its plate at y .656 and its floor at y .752, so
   the seat stands 96 stage px off the ground; a figure's seat height is about
   .28 of its standing height, so the man the set built that throne for is
   ~340 px... which is 96/.28 measured at the throne's own depth. Solving
   .9 * BOX * depthAtY(.752) * H = 238 px — the height that puts a standing god's
   hip at his own seat plate — gives BOX .44. Drafted at .60 the two of them
   stood taller than the piers of the order and the chamber read as a doll's
   house; at .30 the throne was furniture for somebody who was not in the room.

   figure-hero fits the rig to min(H*.9, W*1.26) of the box it is given and
   stands it with its feet at .905 of that box, so a figure anchored at a
   station's ground y hangs ~9.5% of its own box in the air. FOOT pushes the box
   down by exactly that fraction so the SOLE lands on the station.
   ========================================================================== */
const BOX  = 0.44;
const FOOT = 0.095;
const boxOf   = p => BOX * sizeOf(p);
const standOn = p => {
  const g = groundOf(p);
  return { anchor:{ x:g.x, y:g.y + FOOT * boxOf(p) }, scale:boxOf(p) };
};

/* ==========================================================================
   CONTINUITY IN — the room changes to a room none of the inherited bodies can
   be in, so the translation is a REFUSAL and it is written out in full.

   OD-B24-S06 ends on the meeting and funeral ground below the town of Ithaca.
   Every station it hands over belongs to that ground's plan; blockingAt() would
   throw on all three here, correctly. The map below names each one and drops it,
   and each entry is a claim about the POEM, not a convenience:

     road_farm_bend  eupithes    -> DROPPED. One step from the corner the farm
                                    road bleeds off, at the head of an armed
                                    column going out to kill Laertes's household.
                                    He is a mortal with a spear on his shoulder
                                    and he has about four minutes to live; the
                                    entire point of this scene is that it is
                                    decided somewhere he cannot see.
     caution         halitherses -> DROPPED. Sitting on the caution ground in
                                    town, having refused to march.
     slab_l          witnesses   -> DROPPED. Medon and Phemius, still on the left
                                    speaking slab, having taken neither side.

   So INITIAL is empty by construction, and both gods are simply already in the
   room: blockingAt() resolves each of them to the `from` of their first move.
   ========================================================================== */
import { exitOccupancy as PREV_EXIT } from "./OD-B24-S06.mjs";

const TOWN_TO_OLYMPUS = {
  road_farm_bend:null, caution:null, slab_l:null,
};
const INITIAL = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, st]) => [who, TOWN_TO_OLYMPUS[st] ?? null])
    .filter(([, st]) => st));

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Two bodies, four moves, and between them they draw the shape of a verdict.

   · ATHENA opens on `ask_w`, beside the petitioner's rostrum, and asks the
     question the whole book has been walking toward. When the answer starts she
     takes ONE step onto the axis to `near_w` — the plaintiff coming forward to
     receive, not to argue — and stays there through the terms. Then, at t=68,
     she leaves, and she leaves DOWN THE NEAR LANE, IN THREE LEGS, BECAUSE THE
     BALANCE STANDS ON THE ONLY STRAIGHT LINE BETWEEN HER AND THE DOOR. This is
     the one real trap in the file and it took two drafts to see. The balance
     occupies x .481..519 continuously from the pivot disc at y .646 down to its
     plinth at y .800, and a standing body's own span runs UPWARD from its feet —
     so a body crossing the centre line clears the fixture only if its feet are
     above y .621 (the top of the pivot disc), and the only floor above y .621 is
     the strip the set ranges its five struck benches across at y .5997. There is
     no upstage lane. Drafted as one diagonal `near_w` -> `descent` she crossed at
     y .716 and wore the pivot on her hip for eight seconds; re-drafted upstage
     through a far-floor waypoint she crossed at y .6525 and wore it on her hem.
     So she goes the other way: DOWN to `floor_n` on the near lane, across the
     front of the scales — where she is the nearer body and correctly covers the
     plinth, the shaft and the pans as she passes them — then out to `east_n` and
     only then upstage to `descent` under the gap. The last leg is almost
     vertical and never touches the centre line at all. She does not come back.
     `east_n` is x .599 and not further east for one measured reason: at .648 her
     half-width and Zeus's, back on `dais_e`, summed to 102 stage px across a
     93 px gap, and the two of them touched for a second at t=79.
   · ZEUS opens on `dais_e`, beside his throne. He comes forward to `axis_e` to
     answer, holds the axis through the decree and the order, and goes back to
     `dais_e` at t=62 — the judge returning to his seat with the thing decided.
     He is the fixed point of the scene and the ONLY reason he moves at all is
     that the answer is worth one step of floor.

   Nobody shares a station and nobody comes within a body's width of anyone else.
   The closest approach in the file is the last one and it is deliberate and
   measured: Athena on `east_n` (x .599, 245 px tall at that depth) against Zeus
   back on `dais_e` (x .731, 238 px tall) — 148 stage px between two centres
   whose half-widths sum to about 102, so ~46 px of paper stands between them,
   and it lasts six seconds before she goes upstage and the gap opens to 147 px.
   Drafted with `east_n` at x .648 those two numbers were 93 and 102 and the
   goddess walked through the king. */
const MOVES = [
  { who:"zeus",   from:"dais_e", to:"axis_e",  t0:18, t1:26 },
  { who:"athena", from:"ask_w",  to:"near_w",  t0:24, t1:32 },
  { who:"zeus",   from:"axis_e", to:"dais_e",  t0:62, t1:70 },
  { who:"athena", from:"near_w",  to:"floor_n", t0:68, t1:74 },
  { who:"athena", from:"floor_n", to:"east_n",  t0:74, t1:79 },
  { who:"athena", from:"east_n",  to:"descent", t0:79, t1:85 },
];

/* --- THE ROOM'S STATE, on the master clock ------------------------------- */
const ROOM_AT = t => t < 56 ? "judgment" : "peace";

/* THE BEAM. A continuous ramp, never a state flip. It drifts toward the war pan
   while the question hangs unanswered, and swings the other way as the verdict
   is given: +tilt drops the WEST pan, and west is the petitioner's end. */
const tiltAt = t =>
    t < 10 ? 0
  : t < 26 ? lerp(0, -0.22, smooth((t - 10) / 16))
  :          lerp(-0.22, 0.62, smooth((t - 26) / 34));

/* ==========================================================================
   THE DECREE PLATE
   Placed in the open sky over the west half of the chamber. The three numbers
   below are solved against the set, not composed by eye — see the header.
   placeInstance forces the box to the stage's own aspect, so ONE scale sets
   both dimensions and every number here follows from it.
   ========================================================================== */
const DECREE_S = 0.340;   // box side as a fraction of the stage
const DECREE_X = 0.430;   // box centre x — clear of both beams, left of the gap
const DECREE_Y = 0.335;   // box FOOT y — solved so the feud line lands at y .287

/* four ramps, in the causal order of the beats */
const decreeAt = t => ({
  reach:  clamp01((t - 20) / 46),                    // the spine descends
  bind:   clamp01((t - 26) / 36),                    // the five clauses seal
  settle: clamp01((t - 44) / 34),                    // the vendetta line flattens
  intensity: lerp(0.20, 1.25, clamp01(t / D)),
});

export const scene = {
  id:"OD-B24-S07",
  title:"Zeus and Athena Set the Terms",
  book:24,
  plan:"olympian-judgment-axis",
  duration:D,
  beats:[
    "Athena asks Zeus whether the conflict should continue or peace should be imposed.",
    "Zeus declares that Odysseus may remain king after punishing the suitors.",
    "He orders both sides to forget the bloodshed through oath and renewed prosperity.",
    "Athena descends toward Ithaca to terminate the cycle.",
  ],
  exitState:"In the Olympian decision space, state `peace`: the same reduced " +
    "hall — ten places of the council still struck and dashed on the floor, " +
    "their benches cancelled on the bank behind the order, the two speaking " +
    "stations inked solid at the ends of the long axis with their tally steles " +
    "standing at 1 and 2. The balance on the axis is no longer level: the west " +
    "pan, the petitioner's, has fallen, and the verdict is readable off the " +
    "beam with the sound off. Over the west sky the PEACE DECREE hangs fully " +
    "entered — the assent seal stamped at its head, the spine rail run all the " +
    "way down past the fifth clause to the consequence, all five clauses " +
    "sealed (I KINGSHIP, II OATH, III FORGETTING, IV WEALTH, V CIVIC " +
    "STABILITY), the duration axis extended, and the vendetta line flattened " +
    "end to end from a barbed feud into a straight civic course with small " +
    "standing marks on it. ZEUS is on `dais_e`, back beside his throne with " +
    "the thing decided: he has granted that Odysseus rule on, and ordered both " +
    "sides to forget the killing of their sons and brothers under oath, with " +
    "wealth and peace restored. ATHENA is on `descent`, on the far edge of the " +
    "chamber floor at the cloud sill, framed in the one gap in the back wall, " +
    "already turned away from the hall and facing down and out toward Ithaca " +
    "with the order in her hands. She is the incoming condition of the next " +
    "scene: the column is on the farm road and she is above it. Nothing " +
    "mortal is in this room and nothing in this room has been told yet.",
  exitOccupancy:occupancyAt(olympianAxis, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    athena:"t=0, already on `ask_w`, standing beside the petitioner's rostrum " +
           "at the west end of the judgment axis — nobody arrives on Olympus, " +
           "the question does",
    zeus:"t=0, already on `dais_e`, beside the throne at the east end",
    decree_01:"t=0, hanging over the west sky as a BLANK form — the tablet " +
              "drawn, every clause plate empty, the vendetta line jagged end " +
              "to end. It is the question before it is the answer",
  },
  exits:{
    athena:"t=85, to `descent` by way of the near lane (`floor_n`, " +
           "`east_n`) — the open floor under the gap in the back wall, on her " +
           "way down to Ithaca. She leaves this room and the next scene has " +
           "her over the farm road",
    zeus:"none — `dais_e`, back beside his throne, the verdict given",
    decree_01:"none — it is a STATE, not an event; it stays entered over the " +
              "island for the rest of the poem",
  },
  walkable:"the standing stations of the local plan `olympian-judgment-axis` " +
           "and nothing else: the west pair (`ask_w`, `near_w`), the east pair " +
           "(`dais_e`, `axis_e`), the set's own authored contact pair on the " +
           "axis (`meet_l`, `meet_r`), the near lane (`floor_n`, `east_n`), " +
           "the places under the sill (`sill_c`, `descent`) and the room's " +
           "surveyed ways in and out (`entrance_w`, " +
           "`exit_e`, `stair_n`). The rostrum, the throne, the balance and its " +
           "two pans and pivot, and the two numbering steles are FIXTURES, not " +
           "standing places. blockingAt() throws on anything else — including " +
           "every Ithacan station this scene inherits from, which is why " +
           "TOWN_TO_OLYMPUS exists and why it drops all three.",
  depthOrder:"the set paints the chamber first, back to front — sky and cloud " +
             "banks, the three wall panels and the descent threshold cut " +
             "between two of them, the two short beams of the architrave, the " +
             "floor, the staggered courses and the radial score, the struck " +
             "benches of the bank, the four piers of the order, the council " +
             "ring with its ten dashed places and two inked stations, the " +
             "rostrum and the throne, the tally steles. Then ONE queue sorted " +
             "by the set's own ground line, far first: the decree plate at the " +
             "sky line it hangs on, then the two gods. Then the set AGAIN for " +
             "its declared front layers — the balance on the axis and the two " +
             "corner plinths — so the beam prints over Athena while she crosses " +
             "the ring behind it and both gods pass behind the near plinths.",
  gazeTargets:{
    athena:"Zeus, level across the whole width of the room, for the first " +
           "sixty seconds — she does not look at the balance once while she is " +
           "asking, because she is asking HIM; then down at the beam as it " +
           "swings her way; then out and down through the gap at an island she " +
           "can see from here and he does not need to",
    zeus:"Athena, level, while she asks; then off and up at the decree over the " +
         "west sky as he speaks the terms into it; then down the axis at the " +
         "beam; then nothing in particular — the settled, heavy-lidded look of " +
         "a god who has finished",
    decree_01:"not a gaze target: it is what both of them are looking past",
  },
  attachments:[
    { at: 0, who:"field_01", change:"state JUDGMENT — ten places struck and " +
      "dashed, two stations inked, the beam dead level" },
    { at: 6, who:"athena", change:"STRATEGIST — the two courses named, one in " +
      "each hand: let them fight on, or impose peace" },
    { at:20, who:"decree_01", change:"the spine rail starts down the tablet " +
      "from the assent seal — the question has been taken" },
    { at:26, who:"zeus", change:"on the axis, DECREEING — one arm flung high; " +
      "clause I, KINGSHIP, takes its stamp on the word" },
    { at:40, who:"zeus", change:"SPEAKING the terms — both palms out; clauses " +
      "II OATH, III FORGETTING, IV WEALTH seal in order under him" },
    { at:44, who:"decree_01", change:"the settling front starts along the " +
      "vendetta line — the forgetting clause is what flattens it" },
    { at:56, who:"field_01", change:"state PEACE — the west pan, the " +
      "petitioner's, falls; the verdict is on the beam" },
    { at:58, who:"athena", change:"COMMAND — she takes the order; knit brow, " +
      "narrowed eyes, the point already turned toward the gap" },
    { at:62, who:"zeus", change:"stepping back off the axis to his throne" },
    { at:70, who:"zeus", change:"SETTLED — heavy-lidded, hands quiet, the " +
      "sovereign at rest for the first time in twenty-four books" },
    { at:68, who:"athena", change:"leaving the axis — down the near lane, " +
      "across the front of the scales, then east and upstage" },
    { at:85, who:"athena", change:"under the gap in the wall, DESCENDING — " +
      "turned out of the hall, facing down and away toward Ithaca" },
  ],
  sound:[
    { at: 2, source:"ask_w",     cue:"a spear butt set down once on a stone floor" },
    { at: 8, source:"ask_w",     cue:"the question, put plainly: war on, or peace?" },
    { at:20, source:"balance_c", cue:"a beam finding its play" },
    { at:26, source:"axis_e",    cue:"the answer, and it is short" },
    { at:32, source:"balance_c", cue:"the first seal going down" },
    { at:46, source:"axis_e",    cue:"let them forget the killing of their sons" },
    { at:56, source:"balance_c", cue:"the west pan falling, and staying down" },
    { at:70, source:"dais_e",    cue:"a heavy man sitting back into his own chair" },
    { at:78, source:"floor_n",   cue:"armour going away from you across a floor" },
    { at:84, source:"descent",   cue:"wind in a gap, and under it, very far off, a road" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"judgment" },
    { asset:"divine-fx.peace-decree", instance:"decree_01",
      anchor:{x:DECREE_X,y:DECREE_Y}, scale:DECREE_S },
    { asset:"character.athena", instance:"athena",
      anchor:{x:.269,y:.819}, scale:.348, band:"threeq", pose:"athena_resolute" },
    { asset:"character.zeus", instance:"zeus",
      anchor:{x:.731,y:.819}, scale:.348, band:"threeq", pose:"zeus_seated_calm" },
  ],

  timeline:[
    // 1 — the question
    { op:"actor.pose", target:"athena", at: 0.0, args:{ pose:"athena_resolute" } },
    { op:"actor.gaze", target:"athena", at: 0.0, args:{ gaze:{ x:.44, y:-.02 } } },
    { op:"actor.pose", target:"zeus",   at: 0.0, args:{ pose:"zeus_seated_calm" } },
    { op:"actor.gaze", target:"zeus",   at: 0.0, args:{ gaze:{ x:-.44, y:.04 } } },
    { op:"actor.pose", target:"athena", at: 6.0, args:{ pose:"athena_strategist" } },
    { op:"actor.pose", target:"athena", at:14.0, args:{ pose:"athena_speak" } },
    { op:"actor.pose", target:"zeus",   at:12.0, args:{ pose:"zeus_troubled" } },
    // 2 — the answer: Odysseus rules on
    { op:"actor.pose", target:"zeus",   at:18.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"athena", at:24.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"zeus",   at:26.0, args:{ pose:"zeus_decree" } },
    { op:"actor.gaze", target:"zeus",   at:26.0, args:{ gaze:{ x:-.30, y:-.24 } } },
    { op:"actor.pose", target:"athena", at:32.0, args:{ pose:"athena_resolute" } },
    { op:"actor.gaze", target:"athena", at:32.0, args:{ gaze:{ x:.40, y:-.06 } } },
    // 3 — the terms: oath, forgetting, wealth, stability
    { op:"actor.pose", target:"zeus",   at:40.0, args:{ pose:"zeus_speaking" } },
    { op:"actor.gaze", target:"zeus",   at:40.0, args:{ gaze:{ x:-.48, y:-.14 } } },
    { op:"actor.pose", target:"athena", at:46.0, args:{ pose:"athena_speak" } },
    { op:"actor.pose", target:"zeus",   at:52.0, args:{ pose:"zeus_decree" } },
    { op:"actor.gaze", target:"zeus",   at:52.0, args:{ gaze:{ x:-.26, y:.10 } } },
    { op:"actor.pose", target:"athena", at:58.0, args:{ pose:"athena_command" } },
    { op:"actor.gaze", target:"athena", at:58.0, args:{ gaze:{ x:.18, y:.22 } } },
    // 4 — the descent
    { op:"actor.pose", target:"zeus",   at:62.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"zeus",   at:70.0, args:{ pose:"zeus_seated_calm" } },
    { op:"actor.gaze", target:"zeus",   at:70.0, args:{ gaze:{ x:-.20, y:.10 } } },
    { op:"actor.pose", target:"athena", at:68.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"athena", at:85.0, args:{ pose:"athena_command" } },
    { op:"actor.gaze", target:"athena", at:85.0, args:{ gaze:{ x:-.10, y:.30 } } },
    { op:"timeline.capture", target:"OD-B24-S07", at:87.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s    = stateAt(scene, t);
    const blk  = blockingAt(olympianAxis, MOVES, t, INITIAL);
    const prog = Math.min(.96, .06 + .88*(t/D));
    const room = ROOM_AT(t);
    const tilt = tiltAt(t);
    const dec  = decreeAt(t);

    /* --- THE CHAMBER, back and ground layers ----------------------------- */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{
        state:room, tilt, t:0.45, progress:prog,
        layers:["sky","panels","beams","floor","courses","tiers","columns",
                "ring","fixtures","balance","marks"],
        status: room === "judgment" ? "JUDGMENT" : "DECREED",
      },
    });

    /* ONE queue, sorted by the ground line each thing stands on: the floor
       decides who is in front, not the order these blocks happen to be written
       in. The decree hangs in the sky, so it enters the queue at the sky line
       and everything on the floor prints over it. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- THE DECREE: the grant, drawn as a legal instrument -------------- */
    add(0.0, () => placeInstance(offctx, W, H, decree, {
      anchor:{ x:DECREE_X, y:DECREE_Y }, scale:DECREE_S,
      state:{
        t: t * 0.06,
        intensity: dec.intensity, bind: dec.bind,
        settle: dec.settle, reach: dec.reach,
        layers:["tablet","spine","axis","clauses","stem","assent","feud"],
        status: dec.bind >= 1 ? "DECREED" : dec.bind > 0 ? "SEALING"
              : dec.reach > 0 ? "ENTERED" : "SPOKEN",
        progress: prog,
      },
    }));

    /* --- ATHENA: the petitioner, and the one who carries it down -------- */
    {
      const p = blk.athena, c = s.athena || {};
      const g = groundOf(p);
      const asking    = t < 24;
      const receiving = t >= 32 && t < 58;
      const ordered   = t >= 58 && t < 70;
      const leaving   = t >= 68;
      add(g.y, () => placeInstance(offctx, W, H, athena, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "athena_resolute",
          gaze: c.gaze || { x:.44, y:-.02 },
          browUp:   asking ? .46 : receiving ? .30 : .18,
          browKnit: ordered ? .44 : leaving ? .34 : .10,
          eyeWide:  asking ? .52 : receiving ? .34 : .20,
          eyeNarrow:ordered ? .32 : 0,
          smile:    receiving ? .14 : 0,
          jaw:      asking ? .28 : 0,
          status:   leaving ? "DESCENDING" : ordered ? "SHE HAS IT"
                  : receiving ? "LISTENING" : "THE QUESTION",
          progress: prog,
        },
      }));
    }

    /* --- ZEUS: the fixed point, and the only voice that can end it ------- */
    {
      const p = blk.zeus, c = s.zeus || {};
      const g = groundOf(p);
      const weighing  = t >= 12 && t < 26;
      const decreeing = t >= 26 && t < 40;
      const terms     = t >= 40 && t < 62;
      const settled   = t >= 70;
      add(g.y, () => placeInstance(offctx, W, H, zeus, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "zeus_seated_calm",
          gaze: c.gaze || { x:-.44, y:.04 },
          browUp:   decreeing ? .28 : terms ? .34 : .06,
          browKnit: weighing ? .74 : decreeing ? .50 : terms ? .22 : .08,
          eyeNarrow:weighing ? .40 : settled ? .30 : .14,
          frown:    weighing ? .30 : .06,
          jaw:      decreeing ? .52 : terms ? .48 : 0,
          status:   settled ? "GIVEN" : terms ? "THE TERMS"
                  : decreeing ? "HE RULES ON" : weighing ? "WEIGHING"
                  : "THE FATHER",
          progress: prog,
        },
      }));
    }

    /* far → near, by the set's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());

    /* --- THE CHAMBER AGAIN, front layer only: the two corner plinths and the
       near step. The balance is NOT here — see the header; every body in this
       scene that meets it is correctly nearer than it. ---------------------- */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{
        state:room, tilt, t:0.45, progress:prog,
        layers:["fg"],
        status: room === "judgment" ? "JUDGMENT" : "DECREED",
      },
    });
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
