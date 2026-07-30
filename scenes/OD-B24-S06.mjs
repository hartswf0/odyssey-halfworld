/* ============================================================
   SCENE  OD-B24-S06 — The Families Demand Revenge
   Book XXIV, scene 6 of the book. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from the
   scene immediately before this one, OD-B24-S05.

   WHERE — AND WHY THE INHERITED OCCUPANCY IS DROPPED WHOLE. Every scene of
   Book 24 since S01 has played out at Laertes's steading, and S05 ends INSIDE
   the farmhouse with six bodies at six farmhouse stations. This scene is not
   on that farm. It is in TOWN, on location.ithacan-meeting-and-funeral-ground
   — the open ground below the palace where Ithaca lays out its dead and, in
   the same hour, argues itself into a war. So this is brief section F at its
   limit: the room changes, and the translation map is EMPTY ON PURPOSE. Not
   one of Laertes, Odysseus, Telemachus, Eumaeus, Philoetius or Dolius is in
   this town; they are all at meat half a day up-country, and carrying any of
   them across would be a lie about where the poem has them. The import is
   still made and the map still declared, because the discipline is the point:
   FARMHOUSE_TO_TOWN names every station S05 hands over and refuses all six,
   and blockingAt() would throw on any of them if one leaked through. See the
   note over the map for the per-body reason. The three men this scene is
   about walk on from the town's own thresholds instead.

   THE PLAN IS DERIVED FROM THE SET, AND THE SET OWNS THE GROUND. Same
   division as OD-B24-S03/S04, restated because it is load-bearing here too:
   engine/blocking's project() bottoms out at screen y .5288, and the bier
   line, the town gate and the head of the farm road are all painted ABOVE
   that; its 1.7:1 size falloff cannot carry this set's own 13:1 landscape
   ladder either. So THE PLAN OWNS TOPOLOGY — who is at which named station,
   what a transit interpolates along, what the unknown-station throw protects,
   what exitOccupancy hands on — and THE SET OWNS THE GROUND: groundOf() and
   sizeOf() take a station name straight back to
   location.ithacan-meeting-and-funeral-ground's own exported anchors and its
   own depthAtY(). The plan's z IS depthAtY() at the station, so the plan and
   the ground agree about who is in front. Not one figure coordinate in this
   file is hand-tuned.

   THE ROOM IS STATE, NOT THREE ROOMS. mourning -> assembly -> muster on one
   clock: the bodies laid out on the bier line and each house at its own swept
   ground; then the floor cleared and the speaking stone struck in; then the
   arms broken out at the road head, the picket up and the farm road chevroned.
   Same hills, same town, same two roads. (Brief section D.)

   CONTACT PAIRS, USED AS PAIRS. The set authors a pair on every family ground
   — `mourn:c_l`/`mourn:c_r` and their kin — so two mourners can touch over a
   body without landing on one coordinate. Eupithes opens on `mourn:c_r`, his
   own half of the family-c pair, with the stele and the offering bowl of that
   ground beside him; the other half stays open, which is what a bereaved
   father standing over a body looks like. And no two cast bodies ever share a
   station or come within a body's width of each other: the three speaking
   places (`speak:stone`, `speak:slab_l`, `speak:slab_r`) exist in the set
   precisely because this scene has three speakers.

   THE CROWD IS A BLITTED PLATE, RESHAPED TO THIS GROUND, AND IT IS THE ONE
   REAL TRAP IN THE FILE — the same trap OD-B24-S05 hit with Dolius's sons,
   with two extra teeth. ensemble.suitors-families is a whole-sheet drawing
   that sizes its members in ABSOLUTE source pixels (80 back .. 146 front)
   while spacing them as fractions of its sheet, so its scale is a BLIT RATIO,
   not a scale argument. Four things follow:
     · It is rendered at its OWN sheet size (610x415 — see SHEET_W, which is
       SOLVED, not picked) and blitted into a rect CROWD_K times that, so
       the back band stands on CROWD_BACK_FOOT and the front band on
       CROWD_FRONT_FOOT — the two frame lines this ground can carry a crowd
       between. `seatY` is then SOLVED for, not chosen, so the module's own
       front rank lands exactly on the second of those lines.
     · IT IS BLITTED MIRRORED. The module puts its militia bloc on sheet-LEFT
       and its caution bloc on sheet-RIGHT; this set puts the ARMAMENT POINT
       and the farm road on frame-RIGHT and the CAUTION GROUND on frame-LEFT,
       "as far from the armament point as the frame allows". Unmirrored, the
       men with spears up stand over the empty left ground while the men
       refusing to march stand under the spear stack — the composition says
       the opposite of the scene. Mirroring is safe here and only here: the
       members are procedural and anonymous, no lettering is drawn (the
       readout layer is dropped), and nothing in the plate is handed.
     · `rostrumX` is then set to .60, not the default .062, so that AFTER the
       mirror the wave origin and every head turn land on the speaking stone.
       headTurn is read off (rostrumX - cx), so at .60 the militia bloc faces
       sheet-right = frame-left and the caution bloc faces sheet-left =
       frame-right, and both are looking at the man on the stone. At the
       default every head in the agora turned away from him.
     · The layer subset is the whole difference between a crowd and a second
       set. The module draws its OWN agora — a horizon, three blocks of stone
       seating at that horizon, two covered biers, a rostrum, a dashed
       division channel with arrows at H*.938, a tally readout across the head
       of the sheet and an ACCENT front-marker. Every one of those would land
       on top of ground this location already paints, and the seat blocks in
       particular are three full-width bars struck across the middle distance.
       Only ["band-back","band-mid","band-front"] is passed. The counts and
       the division still read — off the arms and the channel of paper the
       blocs themselves leave.
     · And it is keyed at CROWD_THR, which is a MEASURED number, not a taste.
       The module floods its sheet with inkLevel(1) before it draws anything,
       and inkLevel(1) is gray(219) — luminance .8588. borderKey clears what
       it can reach at or above the threshold, so at the .895 default that
       field survives as a pale rectangle over the whole set, and anything
       below .8588 leaves it there. CROWD_THR is .857: low enough to take the
       field out, high enough to keep skin (level 2, .714) and every robe from
       level 2 down. The level-1 robes of the back band are the same tone as
       the field, but each one is closed inside its own hard contour, so the
       flood cannot reach them — which is why the band survives at a threshold
       that deletes its own background.

   THE PLATE IS IN THE FIGURE QUEUE, NOT UNDER IT. OD-B24-S05 draws its
   ensemble under every principal, which is right only when every principal is
   nearer than the plate. That is not safe here — the witnesses come down the
   TOWN ROAD, which enters far above the crowd, and while they are on it they
   are behind the whole agora; drawn over the plate they would walk in front of
   a band standing between them and the camera. So the plate goes into the same
   y-sorted queue as the figures, at CROWD_BACK_FOOT — the frame line its own
   back rank stands on — and the floor decides who is in front. One plate
   cannot be interleaved at every depth it covers, and the back-rank foot line
   is the choice that costs nothing: it is the only line at which no body in
   this scene is on the wrong side of it.

   THREE SPEAKERS, THREE STATIONS, ONE ARGUMENT.
     · MEDON AND PHEMIUS are a TWO-FIGURE module — one asset, two rigs, each
       drawn into a 0.46-wide sub-box of its own sheet — so it needs a wider
       clear floor than a single body, and the LEFT slab is the only station
       on this ground that has one the bier line does not run through. They
       come down the town road behind the bodies, testify from `speak:slab_l`,
       and then never step off it. They are the only two men in Ithaca who saw
       it, and when the assembly divides they join neither half: they are
       still on the slab when the column goes east.
       Their box is sized so a witness's DRAWN height matches
       a single figure's at the same depth: the pair module fits each rig to
       min(h*.9, 0.46*w*1.26) = .854h where a lone rig gets .9h, so the pair's
       box is opened by exactly that ratio and no other.
     · HALITHERSES crosses from the near-left bench to `speak:slab_l`, says
       what he said in Book II and was not listened to then either, and then
       goes back and sits down on the CAUTION GROUND. His blocking is his
       argument: he is the first man to refuse to march, and he refuses by
       walking to the one place in the set that means refusal.
     · EUPITHES is the ramp. He opens folded on `mourn:c_r` over his son, comes
       up off it, walks the length of the cleared floor onto the speaking
       stone, incites from it, crosses to `arms:point` where the set keeps the
       spear stack and the shields, and goes off east down the farm road. His
       module's own state machine is a one-way ramp — mourning, rising,
       inciting, accusing, arming, marching — and the blocking walks the same
       ramp across the ground. He never comes back to the family ground.

   NO DISGUISE, NO FLARE, NO RESTORATION. Odysseus is not in this scene and
   character.odysseus-b16's guise channel is not touched; there is no
   discontinuity anywhere in this file for divine_fx.athenas-restoration to
   cover, so it is not cast. The one god in the scene is the one Medon and
   Phemius testify TO, and testimony is the form it takes.

   TONE. The set's `mourning`/`assembly` table is light (sky 1, ground 2,
   build 3, stone 4) and its swept grounds sit at level 0, so the biggest
   planes in the frame are paper. Nothing here darkens them: the crowd's robes
   are graded 1..4 with skin at 2, Halitherses is a grey robe over a white
   beard, Eupithes is a light tunic with one mid-grey mantle wedge and bare
   shins, and the witnesses are a crier's tunic and a mantle over bare legs.
   The set's own `muster` table lifts the sky and ground a step at t=70, which
   is the only tonal move in the scene and it is the right one: the light goes
   flat when the arms come out. ZERO hand-drawn ctx overpaint on any figure in
   this file. The rig does all of it.

   Beats (Od. 24.412-471):
     1. In town the bodies are carried from the palace and each family mourns
        its dead.
     2. Medon and Phemius testify that a god fought beside Odysseus.
     3. Halitherses reminds the people that he warned them and that their own
        tolerance enabled the disaster.
     4. Eupithes rejects caution and leads armed relatives toward Laertes's
        farm.
     5. Some citizens refuse to join and remain behind.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S06.mjs --t 30  (the testimony)
            node harness/render-scene.mjs scenes/OD-B24-S06.mjs --t 96  (the march)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, clamp01, lerp }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { anchors as TOWN } from "../assets/location/ithacan-meeting-and-funeral-ground.mjs";
import eupithes    from "../assets/character/eupithes.mjs";
import halitherses from "../assets/character/halitherses.mjs";
import witnesses   from "../assets/character/medon-and-phemius.mjs";
import families    from "../assets/ensemble/suitors-families.mjs";

const FIELD_ASSET = "location.ithacan-meeting-and-funeral-ground";
const D = 104;

/* ==========================================================================
   THE SET'S OWN DEPTH LADDER, RESTATED
   location.ithacan-meeting-and-funeral-ground keeps depthAtY() private. It is
   copied here verbatim so that a body's size is the size this ground is
   painted at — the bier stamps, the speaking stone, the herm and the spear
   stack are all sized from it, and now so is every man.
   ========================================================================== */
const HORIZON = 0.262, NEAR_Y = 1.040;
const groundU  = y => clamp((y - HORIZON) / (NEAR_Y - HORIZON), 0, 1);
const depthAtY = y => lerp(0.075, 1.000, Math.pow(groundU(y), 1.22));

/* ==========================================================================
   THE LOCAL PLAN — every station is one of the set's OWN exported anchors.
   Nothing is typed as a coordinate; atSet() throws if the set ever stops
   exporting a name, which is the same protection blockingAt() gives inside
   the scene.
   ========================================================================== */
const atSet = key => {
  const a = TOWN[key];
  if (!a) throw new Error(`[OD-B24-S06] the set exports no anchor "${key}"`);
  return { x:a.x, y:a.y };
};

const GROUND = {
  /* the town side — where the dead come down from the palace */
  town_gate:     atSet("threshold:town-gate"),
  road_town:     atSet("road:town-near"),
  /* THE BODY DISPLAY. Fixtures, except the two ends of the line, which are
     the only places on it a living man stands. */
  bier_1:        atSet("display:bier_1"),
  bier_2:        atSet("display:bier_2"),
  bier_3:        atSet("display:bier_3"),
  display_stand: atSet("display:stand"),
  display_head:  atSet("display:head"),
  display_foot:  atSet("display:foot"),
  display_centre:atSet("display:centre"),
  /* THE SPEAKING PLACES — three, so three speakers never share one */
  bema:          atSet("speak:stone"),
  slab_l:        atSet("speak:slab_l"),
  slab_r:        atSet("speak:slab_r"),
  floor_n:       atSet("speak:floor_n"),
  floor_f:       atSet("speak:floor_f"),
  /* THE FAMILY GROUNDS and their contact pairs */
  fam_a:         atSet("family:a"), fam_b: atSet("family:b"),
  fam_c:         atSet("family:c"), fam_d: atSet("family:d"),
  mourn_a_l:     atSet("mourn:a_l"), mourn_a_r: atSet("mourn:a_r"),
  mourn_b_l:     atSet("mourn:b_l"), mourn_b_r: atSet("mourn:b_r"),
  mourn_c_l:     atSet("mourn:c_l"), mourn_c_r: atSet("mourn:c_r"),
  mourn_d_l:     atSet("mourn:d_l"), mourn_d_r: atSet("mourn:d_r"),
  /* THE ARMAMENT POINT — where the argument becomes a militia */
  arms_point:    atSet("arms:point"),
  arms_spears:   atSet("arms:spears"),
  arms_shields:  atSet("arms:shields"),
  arms_helms:    atSet("arms:helms"),
  muster_l:      atSet("muster:line_l"),
  muster_c:      atSet("muster:line_c"),
  muster_r:      atSet("muster:line_r"),
  /* THE CAUTION GROUND — the citizens who refuse to march */
  caution:       atSet("hold:caution"),
  bench_l:       atSet("hold:bench_l"), bench_r: atSet("hold:bench_r"),
  /* THE FARMWARD EXIT */
  herm:          atSet("threshold:farm-herm"),
  road_farm_far: atSet("road:farm-far"),
  road_farm_bend:atSet("road:farm-bend"),
  road_farm_near:atSet("road:farm-near"),
  exit_farmward: atSet("exit:farmward"),
};

export const ithacaGround = makePlan({
  id:"ithaca-meeting-ground",
  name:"Ithaca — the meeting and funeral ground below the town",
  notes:"Local plan for OD-B24-S06, cut station for station off " +
        "location.ithacan-meeting-and-funeral-ground's own exported anchors. " +
        "z IS the set's depthAtY() at the station, because project() bottoms " +
        "out at y .5288 — above the bier line, the town gate and the head of " +
        "the farm road — and its 1.7:1 falloff cannot carry a 13:1 landscape. " +
        "`mourn:*_l`/`mourn:*_r` are the set's authored contact pairs and are " +
        "never occupied by one body. bier_1..3, display_stand, arms_spears, " +
        "arms_shields, arms_helms and muster_l/c/r are FIXTURES — survey " +
        "references for the biers, the offering stand, the spear stack and " +
        "the picket — not standing places, and nobody is ever blocked onto " +
        "them.",
  stations:Object.fromEntries(Object.entries(GROUND).map(([k, p]) => [k, {
    x:+clamp(p.x, 0, 1).toFixed(4),
    z:+depthAtY(p.y).toFixed(4),
  }])),
  fixtures:[
    { id:"bier_1",     kind:"bier",      at:"bier_1" },
    { id:"bier_2",     kind:"bier",      at:"bier_2" },
    { id:"bier_3",     kind:"bier",      at:"bier_3" },
    { id:"stand",      kind:"offering",  at:"display_stand" },
    { id:"stone",      kind:"rostrum",   at:"bema" },
    { id:"spears",     kind:"arms",      at:"arms_spears" },
    { id:"shields",    kind:"arms",      at:"arms_shields" },
    { id:"helms",      kind:"arms",      at:"arms_helms" },
    { id:"herm",       kind:"threshold", at:"herm" },
    { id:"town_gate",  kind:"threshold", at:"town_gate" },
  ],
});

/* ---- the set's ground, resolved off blockingAt's own from/to/u ----------- */
const G = name => {
  const g = GROUND[name];
  if (!g) throw new Error(`[OD-B24-S06] station "${name}" has no ground`);
  return g;
};
function groundOf(p){
  if (!p.moving) return G(p.station);
  const a = G(p.from), b = G(p.to);
  return { x:lerp(a.x, b.x, p.u), y:lerp(a.y, b.y, p.u) };
}
const sizeOf = p => depthAtY(groundOf(p).y);

/* ==========================================================================
   FIGURE SIZE — one box height for every standing body on this ground, times
   the set's own falloff, and every sole put down BY HAND-OFF rather than by
   eye.

   BOX .46 IS BOUNDED FROM ABOVE BY THE BIER LINE, and that is the whole
   calibration. This is a wide landscape with a town in the top third and the
   display of the dead running across the middle at y .496..556; a standing
   figure's HEAD is what collides with it, not its feet. Drafted at .60 — the
   size that matches the set's own bier stamp, which draws a covered body 191
   px long — every speaker on the cleared floor put its skull straight through
   a pall: 223 px of man with his feet at y .708 has his head at y .414, which
   is bier_2, the offering stand and the town road all at once, and the
   witnesses printed as an unreadable black tangle. At .46 the man on the
   speaking stone is 158 px with his crown just under the display, the near
   figures at the family grounds are 190-200 px instead of 320, and the ground
   between the bier line and the floor stays paper. The figures are smaller
   than a portrait wants and exactly as small as this set can carry.

   figure-hero fits the rig to min(H*.9, W*1.26) of the box it is given and
   stands it with its feet at .905 of that box, so a figure anchored at a
   station's ground y hangs ~9.5% of its own box in the air. FOOT pushes the
   box down by exactly that fraction so the SOLE lands on the station. And the
   two-figure witness module fits each of its rigs to .46*W*1.26 = .854H
   instead of .9H, so its box is opened by that ratio and by nothing else —
   which is what makes a witness the same drawn height as a lone speaker
   standing on the same patch of ground.
   ========================================================================== */
const BOX  = 0.46;
const FOOT = 0.095;
const FIG_SINGLE = 0.900;     // rig height / box height, one-figure module
const FIG_PAIR   = 0.854;     // rig height / box height, medon-and-phemius
const boxOf  = (p, ratio) => BOX * sizeOf(p) * (FIG_SINGLE / ratio);
const standOn = (p, ratio) => {
  const g = groundOf(p);
  return { anchor:{ x:g.x, y:g.y + FOOT * boxOf(p, ratio) }, scale:boxOf(p, ratio) };
};

/* ==========================================================================
   CONTINUITY IN — the room changes to a room none of the inherited bodies is
   in, so the translation is a REFUSAL and it is written out in full.

   OD-B24-S05 ends inside the farmhouse at Laertes's steading. Every station
   it hands over belongs to that building's plan; blockingAt() would throw on
   all six here, correctly. The map below names each one and drops it, and
   each entry is a claim about the POEM, not a convenience:

     seat_e   Laertes  -> DROPPED. At his own place at the east board, at his
                         full height for the first time in the book, half a
                         day up-country. He does not come to town; the town
                         comes to him, in the next scene, with spears.
     greet_r  Odysseus -> DROPPED. The whole point of the assembly is that the
                         man it is about is not standing in it. Medon and
                         Phemius have to testify precisely because he is
                         absent.
     greet_l  Dolius   -> DROPPED. He does not leave the master's side again
                         in this book (XXIV.409).
     board_c  Telemachus-> DROPPED. At the centre board with his father.
     hearth   Eumaeus  -> DROPPED. At the cook fire.
     pot      Philoetius-> DROPPED. At the cauldron.

   So INITIAL is empty by construction, and every body in this scene enters
   from a town station instead: the witnesses down the town road behind the
   bodies, Halitherses off the caution bench, Eupithes off his son's ground.
   blockingAt() resolves each of them to the `from` of their first move.
   ========================================================================== */
import { exitOccupancy as PREV_EXIT } from "./OD-B24-S05.mjs";

const FARMHOUSE_TO_TOWN = {
  seat_e:null, greet_r:null, greet_l:null, board_c:null, hearth:null, pot:null,
};
const INITIAL = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, st]) => [who, FARMHOUSE_TO_TOWN[st] ?? null])
    .filter(([, st]) => st));

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Three journeys, and each one is its speaker's argument walked on the floor.

   · THE WITNESSES come down the town road behind the bodies — `road_town`,
     the last point of the painted band from the palace gate — halt on the
     cleared floor at `floor_f` while the biers are set down, and take the
     LEFT slab to give the testimony, AND THEN NEVER LEAVE IT. They get
     slab_l and not slab_r for one measured reason: the two-figure module
     needs the widest clear floor in the scene, and the only frame-x corridor
     wide enough that the bier line does not run through its heads is the one
     over the left half. Drafted on slab_r they stood with their crowns inside
     bier_3, the offering stand and the near edge of the arms stack, and the
     testimony printed as a black tangle. Staying is also the right reading:
     they are the two men the slaughter spared, they swear to what they saw,
     and then they take neither side and remain when the column goes.
   · HALITHERSES crosses from `bench_l` — the near-left bench of the caution
     ground, where he has been sitting since the bodies came down — to
     `speak:slab_r` for the warning, and then goes BACK to `hold:caution` and
     stops there. He gets the right slab because he is ONE body and fits the
     narrow corridor between bier_3 and the offering stand where the pair
     could not. The walk back is his argument: the set puts the caution ground
     as far from the spear stack as the frame allows, and crossing the whole
     floor to sit down on it is how this scene says a man refuses.
   · EUPITHES walks the ramp. `mourn_c_r`, his half of the family-c pair, with
     his son laid on the ground beside him; up the length of the cleared floor
     to `bema` at t=64, which is the first time in the scene anybody stands on
     the speaking stone; across to `arms_point` at t=86, where the set keeps
     the spears and the shields; and out east down the farm road to
     `road_farm_bend` at t=100, one step from the corner the road bleeds off.
     He is the only body that touches all four quarters of this ground and the
     only one who leaves it.

   Nobody shares a station and nobody comes within a body's width of anyone
   else. The two closest approaches in the file are both deliberate and both
   measured: Eupithes on the stone (x .418) against Halitherses on the right
   slab (x .560) for the twelve seconds they argue across the floor — 159
   stage px between two bodies about 52 px wide — and Eupithes on the stone
   against Phemius, the outer of the two witnesses on the left slab, which
   leaves a 47 px channel of paper. Both are speaking distance with the floor
   showing between. */
const MOVES = [
  { who:"witnesses",   from:"road_town",  to:"floor_f",        t0: 3, t1:12 },
  { who:"witnesses",   from:"floor_f",    to:"slab_l",         t0:14, t1:21 },
  { who:"halitherses", from:"bench_l",    to:"slab_r",         t0:34, t1:42 },
  { who:"halitherses", from:"slab_r",     to:"caution",        t0:76, t1:84 },
  { who:"eupithes",    from:"mourn_c_r",  to:"bema",           t0:56, t1:64 },
  { who:"eupithes",    from:"bema",       to:"arms_point",     t0:78, t1:86 },
  { who:"eupithes",    from:"arms_point", to:"road_farm_bend", t0:92, t1:100 },
];

/* --- THE GROUND'S STATE, on the master clock ----------------------------- */
const ROOM_AT = t => t < 20 ? "mourning" : t < 70 ? "assembly" : "muster";

/* ==========================================================================
   THE CROWD PLATE
   Rendered at its own sheet size and blitted MIRRORED into a rect CROWD_K
   times that. Everything below is derived from four frame numbers — where the
   crowd starts and stops across the frame, and the two ground lines its back
   and front ranks stand on — so the plate is fitted to this set rather than
   composed by eye. See the header for the mirror, the threshold and the
   layer subset.
   ========================================================================== */
/* THE SHEET SIZE IS THE ONE REAL CONTROL AND IT IS NOT A GUESS. The module
   sizes a member in ABSOLUTE source pixels (80 back .. 146 front) but spreads
   the ranks across .045..0.965 of whatever sheet it is given, so the sheet's
   WIDTH sets the ratio of member height to crowd width, and the blit ratio
   then sets both together. Solving Mf = 146·nearScale·K against Wc = .92·
   SHEET_W·K for a front rank 190 stage px tall inside a crowd 750 px wide —
   the height this ground paints a man at the front foot line, and the width
   that leaves the arms point and the farm road clear — gives SHEET_W 626.
   Drafted at 740 with the crowd across the whole frame, the front rank came
   out 219 px and twenty-three strong and the assembly printed as one
   continuous mass of ink from edge to edge with the set invisible under it. */
const SHEET_W = 610, SHEET_H = 415;      // the ensemble's own sheet
const CROWD_X0 = 0.075, CROWD_X1 = 0.590;// frame x the crowd occupies
const CROWD_BACK_FOOT  = 0.560;          // frame y the back rank stands on
const CROWD_FRONT_FOOT = 0.700;          // frame y the front rank stands on
const MEMBER_SPAN = 0.920;               // module clamps members to px .045..0.965
const MEMBER_X0   = 0.045;
const CROWD_ROSTRUM = 0.60;              // wave origin: the speaking stone, mirrored
const CROWD_NEAR  = 1.00;                // front-rank grading
const CROWD_THR   = 0.857;               // measured: inkLevel(1) is .8588
const CROWD_ROWS  = [6, 5, 4];           // fifteen bodies, not twenty-three
const CROWD_LAYERS = ["band-back","band-mid","band-front"];

/* the plate's own geometry, solved rather than chosen */
const crowdRect = (W, H) => {
  const dw = (CROWD_X1 - CROWD_X0) * W / MEMBER_SPAN;
  const K  = dw / SHEET_W;
  const dh = K * SHEET_H;
  const dx = CROWD_X0 * W - MEMBER_X0 * dw;
  const dy = CROWD_BACK_FOOT * H - K * SHEET_H * 0.445;   // module's own back rowY
  const seatY = (CROWD_FRONT_FOOT * H - dy) / (K * SHEET_H);
  return { dx, dy, dw, dh, seatY };
};

/* ONE continuous ramp for the whole assembly, so no member ever pops inside a
   beat. THE WAVE HAS TO START WELL BELOW ZERO, and that is not padding.
   `arrive` is clamped to 0..1, so every member on the militia side of
   rostrumX arrives at 0 and commits together the instant `wave` crosses 0 —
   drafted from -0.14 the entire militia was on its feet with the spears up
   at t=30, in the middle of the testimony, thirty seconds before anybody had
   asked them for anything. From -0.30 against a spread of .22 the agora is
   still fully in grief at t=44, comes up as Eupithes takes the stone at t=64,
   and has swept the far ranks — the ones who take their seats and stay — by
   t=96. The channel of paper opens on the same clock. The one discontinuity
   is the formation change at t=88, and it is placed ON the beat: that is the
   second the militia stops being a bloc in the agora and becomes a column on
   the road. */
const crowdAt = t => ({
  formation: t < 88 ? "assembly" : "column",
  split:     0.58,                                  // "more than half" rise
  divide:    clamp01((t - 58) / 30),
  wave:      lerp(-0.30, 1.42, clamp01((t - 44) / 52)),
  waveSpread:0.22,
  attention: lerp(0.16, 0.94, clamp01((t - 20) / 44)),
  grief:     lerp(1.00, 0.30, clamp01((t - 56) / 40)),
});

export const scene = {
  id:"OD-B24-S06",
  title:"The Families Demand Revenge",
  book:24,
  plan:"ithaca-meeting-ground",
  duration:D,
  beats:[
    "In town the bodies are carried from the palace and each family mourns its dead.",
    "Medon and Phemius testify that a god fought beside Odysseus.",
    "Halitherses reminds the people that he warned them and that their own tolerance enabled the disaster.",
    "Eupithes rejects caution and leads armed relatives toward Laertes's farm.",
    "Some citizens refuse to join and remain behind.",
  ],
  exitState:"On the meeting and funeral ground below the town, state `muster`: " +
    "the bier line still laid out in its two runs with the offering stand in " +
    "the break, the swept family grounds each with its stele and its tally of " +
    "courses cut in stone, the cleared floor struck through with its radial " +
    "paving and the speaking stone standing empty at the centre of it. The " +
    "arms are out. At the paved slab at the head of the farm road the spear " +
    "stack is broken down, one shield is off its rim and the helms are gone " +
    "from the heap; the picket is up along the muster line with the gap they " +
    "file through left open, and the road east is chevroned with the " +
    "direction of the march. EUPITHES is on `road_farm_bend`, one step from " +
    "the corner the farm road bleeds off, spear shouldered and the road ahead " +
    "of him: he came up off his son's body at the family-c ground, took the " +
    "speaking stone, refused every warning given him and is leading the armed " +
    "relatives of the dead suitors out to Laertes's steading. More than half " +
    "the assembly is behind him, strung out of the agora into a column on the " +
    "same road. HALITHERSES is on `hold:caution`, the near-left ground, having " +
    "said from the right slab that he warned them in the second year and that " +
    "it was their own tolerance that did this; he has not moved toward the " +
    "arms and he will not. The caution bloc holds the ground around him, " +
    "seated on the agora stone with palms out — these are the citizens who " +
    "refuse to join and remain behind, and they are the incoming condition of " +
    "the next scene as much as the column is. MEDON AND PHEMIUS are on " +
    "`speak:slab_l`, the left speaking slab, having sworn from it that no man " +
    "did this alone and that a god stood beside Odysseus in the doorway; " +
    "they took neither side and never stepped off the slab. " +
    "Nobody from Laertes's steading is on this ground and nobody on it " +
    "knows what is waiting at the other end of that road.",
  exitOccupancy:occupancyAt(ithacaGround, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    eupithes:"t=0, already on `mourn_c_r`, folded over his son's body on the " +
             "family-c ground — the bodies were carried down before this scene " +
             "starts",
    halitherses:"t=0, on `bench_l`, the near-left bench of the caution ground",
    witnesses:"t=3, down the town road from the palace gate behind the biers, " +
              "entering at `road_town`",
    families:"t=0, the whole agora, blitted across the middle ground between " +
             "`display` and the cleared floor",
  },
  exits:{
    eupithes:"t=100, east down the farm road to `road_farm_bend`, one step " +
             "from the corner it bleeds off — he leaves this ground and the " +
             "next scene has him on the road",
    halitherses:"none — `hold:caution`, refusing to march",
    witnesses:"none — `speak:slab_l`, the left speaking slab they gave the testimony from; they take neither side and do not step off it",
    families:"the militia strings out of the agora into a column on the farm " +
             "road from t=88; the caution bloc keeps its ground",
  },
  walkable:"the stations of the local plan `ithaca-meeting-ground` and nothing " +
           "else, every one of them an anchor location.ithacan-meeting-and-" +
           "funeral-ground exports: the town side (`town_gate`, `road_town`), " +
           "the two ends of the bier line (`display_head`, `display_foot`, " +
           "`display_centre`), the cleared floor and its three speaking places " +
           "(`bema`, `slab_l`, `slab_r`, `floor_n`, `floor_f`), the four family " +
           "grounds and their contact pairs (`fam_a..d`, `mourn:*_l/_r`), the " +
           "armament point (`arms_point`) and the muster line, the caution " +
           "ground (`caution`, `bench_l`, `bench_r`) and the farm road " +
           "(`herm`, `road_farm_far/bend/near`, `exit_farmward`). The biers " +
           "themselves, the offering stand, the spear/shield/helm stations and " +
           "the picket marks are FIXTURES, not standing places. blockingAt() " +
           "throws on anything else — including every farmhouse station this " +
           "scene inherits from, which is why FARMHOUSE_TO_TOWN exists and " +
           "why it drops all six.",
  depthOrder:"the set paints the ground first — sky, hills, harbour, town and " +
             "gate, walls, town road, the bier line, the cleared floor, the " +
             "speaking stone and its slabs, the family grounds, the arms " +
             "stand and the herm, the farm road, the caution ground, the " +
             "muster picket, the verge and the near grave jars. Then ONE queue " +
             "sorted by the set's own ground line, far first: the crowd plate " +
             "enters that queue at the frame line its own back rank stands on, " +
             "so the two witnesses at the bier line print UNDER it and every " +
             "speaker nearer than the back rank prints OVER it.",
  gazeTargets:{
    eupithes:"his son's face under his own hands for the first fifty seconds; " +
             "then out and up over the assembly as he comes off the ground; " +
             "then the crowd, level, from the stone; then off left at the " +
             "absent king he is naming; then down at his own chest strap while " +
             "he arms; then the road east and nothing else",
    halitherses:"the birds first, the way he always does — chin up, eyes cast " +
                "off the ground; then the assembly, leveled, for the warning; " +
                "then Eupithes on the stone; then away, at the ground he is " +
                "sitting back down on",
    witnesses:"Medon points and looks UP, because what he is testifying to is " +
              "not in the room; Phemius looks down at the biers and then " +
              "level at the crowd, because what he is testifying to is",
    families:"the module's own reaction wave turns each head onto the speaking " +
             "stone in order, mirrored with the plate so both blocs face it",
  },
  attachments:[
    { at: 0, who:"field_01", change:"state MOURNING — the bodies down off the " +
      "palace road and laid out on the bier line, each house at its own swept " +
      "ground with a stele and an offering bowl" },
    { at: 3, who:"witnesses", change:"first frame — coming down the town road " +
      "behind the last bier, staff and lyre carried low" },
    { at:20, who:"field_01", change:"state ASSEMBLY — the floor cleared and " +
      "the radial paving struck from the speaking stone" },
    { at:22, who:"witnesses", change:"TESTIFYING at the left slab — Medon's " +
      "finger up at the god, Phemius's hand flat on his heart" },
    { at:30, who:"witnesses", change:"OATH — both palms up at shoulder height, " +
      "one sworn statement given by two men" },
    { at:42, who:"halitherses", change:"on the right slab, arm thrust forward: " +
      "the prophecy of Book II repeated to the men who ignored it" },
    { at:56, who:"eupithes", change:"off his son's body and walking — the one " +
      "hinge in the character, and he never bends again" },
    { at:64, who:"eupithes", change:"on the speaking stone, INCITING; the " +
      "reaction wave is already halfway across the agora" },
    { at:72, who:"eupithes", change:"ACCUSING — the absent king named, far arm " +
      "level, mouth skewed" },
    { at:70, who:"field_01", change:"state MUSTER — the arms broken out at the " +
      "road head, the picket up, the farm road chevroned" },
    { at:86, who:"eupithes", change:"at the armament point, ARMING — head down " +
      "over his own hands on a chest strap" },
    { at:88, who:"families", change:"formation COLUMN — the militia strings " +
      "out of the agora onto the road; the caution bloc keeps its seats" },
    { at:94, who:"eupithes", change:"MARCHING, spear shouldered, at the head " +
      "of the column with the road east in front of him" },
  ],
  sound:[
    { at: 2, source:"road_town",   cue:"the biers coming down off the palace road" },
    { at: 8, source:"fam_c",       cue:"one house at a time finding out" },
    { at:22, source:"slab_l",      cue:"a herald's voice: no man did this alone" },
    { at:30, source:"slab_l",      cue:"and a singer's, swearing to it" },
    { at:42, source:"slab_r",      cue:"I told you in the second year" },
    { at:52, source:"slab_r",      cue:"the ground going quiet in the wrong way" },
    { at:64, source:"bema",        cue:"a father on the stone, and no grief left in it" },
    { at:74, source:"bema",        cue:"the assembly coming apart down the middle" },
    { at:86, source:"arms_point",  cue:"a spear stack coming down" },
    { at:96, source:"road_farm_bend", cue:"boots going east, and behind them nothing" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"mourning" },
    { asset:"ensemble.suitors-families", instance:"families",
      anchor:{x:.45,y:.80}, scale:.90, pose:"mourning" },
    { asset:"character.medon-and-phemius", instance:"witnesses",
      anchor:{x:.268,y:.753}, scale:.26, band:"threeq", pose:"testifying" },
    { asset:"character.halitherses", instance:"halitherses",
      anchor:{x:.560,y:.732}, scale:.23, band:"threeq", pose:"hal_watching" },
    { asset:"character.eupithes", instance:"eupithes",
      anchor:{x:.416,y:.924}, scale:.36, band:"threeq", pose:"eup_mourning" },
  ],

  timeline:[
    // 1 — the bodies down, each house at its own ground
    { op:"actor.pose", target:"eupithes",    at: 0.0, args:{ pose:"eup_mourning" } },
    { op:"actor.gaze", target:"eupithes",    at: 0.0, args:{ gaze:{ x:-.12, y:.62 } } },
    { op:"actor.pose", target:"halitherses", at: 0.0, args:{ pose:"hal_watching" } },
    { op:"actor.gaze", target:"halitherses", at: 0.0, args:{ gaze:{ x:.10, y:-.56 } } },
    { op:"actor.pose", target:"witnesses",   at: 0.0, args:{ pose:"turned" } },
    // 2 — the testimony
    { op:"actor.pose", target:"witnesses",   at:22.0, args:{ pose:"testifying" } },
    { op:"actor.pose", target:"witnesses",   at:30.0, args:{ pose:"oath" } },
    { op:"actor.pose", target:"witnesses",   at:38.0, args:{ pose:"warning" } },
    // 3 — the warning nobody took the first time either
    { op:"actor.pose", target:"halitherses", at:34.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"halitherses", at:42.0, args:{ pose:"hal_prophesy" } },
    { op:"actor.gaze", target:"halitherses", at:42.0, args:{ gaze:{ x:-.32, y:.04 } } },
    { op:"actor.pose", target:"witnesses",   at:46.0, args:{ pose:"oath" } },
    { op:"actor.pose", target:"halitherses", at:52.0, args:{ pose:"hal_warn" } },
    { op:"actor.gaze", target:"halitherses", at:52.0, args:{ gaze:{ x:.16, y:-.08 } } },
    { op:"actor.pose", target:"witnesses",   at:58.0, args:{ pose:"turned" } },
    // 4 — the ramp: off the body, onto the stone, over to the arms
    { op:"actor.pose", target:"eupithes",    at:50.0, args:{ pose:"eup_rising" } },
    { op:"actor.gaze", target:"eupithes",    at:50.0, args:{ gaze:{ x:.30, y:.14 } } },
    { op:"actor.pose", target:"eupithes",    at:56.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"eupithes",    at:64.0, args:{ pose:"eup_inciting" } },
    { op:"actor.gaze", target:"eupithes",    at:64.0, args:{ gaze:{ x:.34, y:-.18 } } },
    { op:"actor.pose", target:"halitherses", at:66.0, args:{ pose:"hal_prophesy" } },
    { op:"actor.pose", target:"eupithes",    at:72.0, args:{ pose:"eup_accusing" } },
    { op:"actor.gaze", target:"eupithes",    at:72.0, args:{ gaze:{ x:-.52, y:.02 } } },
    { op:"actor.pose", target:"halitherses", at:76.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"eupithes",    at:78.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"eupithes",    at:86.0, args:{ pose:"eup_arming" } },
    { op:"actor.gaze", target:"eupithes",    at:86.0, args:{ gaze:{ x:-.08, y:.54 } } },
    // 5 — the road east, and the ground that stays put
    { op:"actor.pose", target:"halitherses", at:84.0, args:{ pose:"hal_watching" } },
    { op:"actor.gaze", target:"halitherses", at:84.0, args:{ gaze:{ x:-.34, y:.22 } } },
    { op:"actor.pose", target:"eupithes",    at:94.0, args:{ pose:"eup_marching" } },
    { op:"actor.gaze", target:"eupithes",    at:94.0, args:{ gaze:{ x:.42, y:-.06 } } },
    { op:"timeline.capture", target:"OD-B24-S06", at:103.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s    = stateAt(scene, t);
    const blk  = blockingAt(ithacaGround, MOVES, t, INITIAL);
    const prog = Math.min(.96, .06 + .88*(t/D));
    const room = ROOM_AT(t);

    /* the ground first — it paints the town, the two roads, the bier line, the
       cleared floor, the family grounds and the arms, and everything keys
       onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:room, t:0.45, progress:prog,
              status: room==="mourning" ? "BODIES LAID"
                    : room==="assembly" ? "IN ASSEMBLY" : "MUSTERING" },
    });

    /* ONE queue, sorted by the set's own ground line: the floor decides who is
       in front, not the order these blocks happen to be written in — and the
       crowd plate is IN the queue, at the frame line its own back rank stands
       on. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- THE ASSEMBLY, mirrored, keyed and layer-cut --------------------- */
    {
      const c = crowdAt(t);
      const R = crowdRect(W, H);
      add(CROWD_BACK_FOOT, () => {
        const cv = keyedModuleCanvas(families, SHEET_W, SHEET_H,
          { ...c, rows:3, perRow:CROWD_ROWS, density:1.0, nearScale:CROWD_NEAR,
            seatY:R.seatY, rostrumX:CROWD_ROSTRUM, rostrumY:0.88,
            layers:CROWD_LAYERS, showBiers:false, showSeats:false,
            showReadout:false, showFront:false,
            status:c.divide < .3 ? "MOURNING" : c.wave < 1 ? "DIVIDING" : "DIVIDED",
            progress:prog },
          `b24s06|crowd|${c.formation}|${c.wave.toFixed(3)}|${c.divide.toFixed(3)}` +
          `|${c.attention.toFixed(3)}|${c.grief.toFixed(3)}|${R.seatY.toFixed(4)}`,
          CROWD_THR);
        offctx.save();
        offctx.translate(R.dx + R.dw, R.dy);
        offctx.scale(-1, 1);                       // militia to the arms side
        offctx.drawImage(cv, 0, 0, cv.width, cv.height, 0, 0, R.dw, R.dh);
        offctx.restore();
      });
    }

    /* --- MEDON AND PHEMIUS: the only two who saw it ---------------------- */
    {
      const p = blk.witnesses, c = s.witnesses || {};
      const g = groundOf(p);
      const swearing = t >= 22 && t < 46;
      add(g.y, () => placeInstance(offctx, W, H, witnesses, {
        ...standOn(p, FIG_PAIR),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          variant: c.pose || "turned",
          status: swearing ? "WITNESS" : t >= 56 ? "SWORN" : "COMING DOWN",
          progress: prog,
        },
      }));
    }

    /* --- HALITHERSES: the man who was right in Book II ------------------- */
    {
      const p = blk.halitherses, c = s.halitherses || {};
      const g = groundOf(p);
      const warning  = t >= 42 && t < 66;
      const arguing  = t >= 66 && t < 76;
      const refusing = t >= 84;
      add(g.y, () => placeInstance(offctx, W, H, halitherses, {
        ...standOn(p, FIG_SINGLE),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "hal_watching",
          gaze: c.gaze || { x:.10, y:-.56 },
          browUp:   warning ? .34 : refusing ? .30 : .40,
          browKnit: arguing ? .62 : warning ? .48 : .16,
          eyeNarrow:arguing ? .40 : refusing ? .34 : .10,
          frown:    arguing ? .30 : refusing ? .26 : .08,
          jaw:      warning ? .44 : arguing ? .30 : 0,
          status:   refusing ? "I WILL NOT GO" : arguing ? "YOU WERE TOLD"
                  : warning ? "I WARNED YOU" : "THE OLD SEER",
          progress: prog,
        },
      }));
    }

    /* --- EUPITHES: one body, one direction, and it kills him ------------- */
    {
      const p = blk.eupithes, c = s.eupithes || {};
      const g = groundOf(p);
      const mourning = t < 50;
      const rising   = t >= 50 && t < 64;
      const inciting = t >= 64 && t < 72;
      const accusing = t >= 72 && t < 78;
      const arming   = t >= 86 && t < 94;
      const marching = t >= 94;
      add(g.y, () => placeInstance(offctx, W, H, eupithes, {
        ...standOn(p, FIG_SINGLE),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "eup_mourning",
          gaze: c.gaze || { x:-.12, y:.62 },
          browUp:   mourning ? .84 : rising ? .66 : accusing ? .30 : .16,
          browKnit: marching ? .60 : accusing ? .54 : inciting ? .74
                  : arming ? .56 : .66,
          eyeNarrow:accusing ? .46 : inciting ? .32 : arming ? .36 : .48,
          eyeWide:  0,
          frown:    mourning ? .58 : rising ? .34 : inciting ? .30 : .24,
          jaw:      inciting ? .52 : rising ? .28 : marching ? .12 : .18,
          mouthAsym:accusing ? .62 : 0,
          status:   marching ? "MARCHING" : arming ? "ARMING"
                  : accusing ? "ACCUSING" : inciting ? "VENGEFUL"
                  : rising ? "TURNING" : "BEREAVED",
          progress: prog,
        },
      }));
    }

    /* far → near, by the set's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
