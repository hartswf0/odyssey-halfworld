/* ============================================================
   SCENE  OD-B17-S02 — The Road with Melanthius
   Book XVII, scene 2 of 7. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs.

   WHERE. Not the hall and not the hut — the last stretch of country road below
   the town, with the public spring beside it. There is no authored plan for it,
   so per the brief a SMALL LOCAL plan is authored at the top of this file and
   every position resolves through it. The discipline is kept outdoors.

   THE PLAN IS DERIVED FROM THE SET, NOT GUESSED. location.ithaca-town-road-and-
   fountain draws its carriageway from one cubic and exports every roadside
   anchor off that same cubic. If I hand-wrote plan stations, the plan's road and
   the drawn road would be two different roads. So `st()` below takes the set's
   own exported anchor and runs project() BACKWARDS — solving z from y and x from
   the depth spread — so that blockingAt()'s forward projection lands each figure
   exactly on the road as painted, at the size that stretch of road is painted.
   A station is therefore never a taste decision; it is the set's own geometry
   read in reverse. (Two consequences, both checked: the very near end clamps at
   z=1, i.e. y=.96 instead of the cubic's y=.998, so the bottom band sits a hair
   inside frame; and a straight line in plan space between two ADJACENT road
   stations tracks the cubic to within .001 in x, so transits stay on the road.)

   THE PINCH IS THE PLOT. The set carries a gaussian throat in the carriageway at
   the spring: the road physically narrows to a third of its shoulder width, and
   two parties cannot pass. That is the whole scene. Melanthius has overtaken the
   slow pair on the way up and halted his drove at the narrows; the beggar has to
   come through him.

   CONTACT PAIRS — close enough to touch, never on one point. The kick is a
   touching beat, so it is staged across the set's own pair at the pinch: the
   goatherd swings onto `meet_above_r` (screen .554/.696) and the beggar comes up
   into `throat` one step below him (.503/.754). That is .051 apart in x and .058
   in depth — a boot's length, and two distinct coordinates. The first draft used
   `meet_below` and the rock buttress instead, and rendering it showed the kick
   travelling a third of the frame to reach nobody; the second put the goatherd
   square on `meet_above` and the leg came down through the beggar's head. Both
   corrections came off the picture. Eumaeus is put aside and uphill at
   `spring_terrace` (.423/.722) and the drove is bunched in the fold above,
   `herd_fold` (.700/.612). Four bodies, four x across the frame (.423 / .503 / .554 / .700) and
   four depths, with the swineherd BEHIND the pair in depth so he can never
   occlude the blow.

   THREE THINGS THE ROAD ITSELF FORBIDS:
     · THE CARRIAGEWAY IS NARROW AND GETS NARROWER. A lateral offset that is
       inside the road at the bottom is off it by the throat, so the two walking
       lanes (`*_l` / `*_r`) taper: ±.045 at the near end, ±.035 at the lower
       band, ±.028 at mid. Every one was checked against roadHW() at its own
       depth. Past mid there is only ONE lane, which is why the pair goes single
       file into the pinch.
     · TWO MEN WALKING UP TOGETHER CANNOT SHARE A STATION. Eumaeus leads in the
       left lane and Odysseus follows in the right; they never rest on the same
       point, and "leading" is expressed in TIME (the swineherd reaches each band
       first), not by putting both men on one anchor.
     · THE SPRING SIDE IS ALL DRESSED STONE. `spring_steps` and `altar` put a
       body against the built rock face and the altar block, and at this figure
       size the dot lattice welds the two together — the swineherd rendered as
       part of the masonry and simply could not be found in the frame. Hence
       `spring_terrace`, a plan station one pace uphill of the altar with open
       ground behind it.
     · THE DROVER STANDS BEHIND HIS DROVE. When Melanthius drives on at the end
       the goats go ahead to `road_far` and he holds `road_upper` below them —
       otherwise man and herd resolve onto one coordinate at the last frame.

   ONE BODY. Odysseus is character.odysseus-b16 with guise "beggar" — the same
   body that was restored in XVI and re-veiled, not character.odysseus-as-beggar.
   No guise ramp in this scene and therefore no restoration flare: nothing is
   revealed on this road, which is the point of it.

   CONTINUITY IN — computed, then TRANSLATED. OD-B17-S01 exports exitOccupancy
   and it is imported here. It is a MEGARON occupancy: telemachus at `table_l`,
   theoclymenus at `table_r`, eurycleia at `doorway_maid`, penelope at
   `axe_last`. None of those stations exist on the road, and none of those four
   bodies are on the road — they are all still in the hall the previous scene
   left them standing in. So HALL_TO_ROAD is deliberately EMPTY and all four are
   dropped by the filter, which is the correct outcome and the reason the map is
   written out rather than skipped: the import is what proves they were left
   behind on purpose. The three bodies who ARE here (the beggar and the swineherd
   coming up off the farm, the goatherd already halted at the water) are opened
   from named road stations.

   CONTINUITY OUT. exitOccupancy is computed by occupancyAt() and exported as a
   named binding, so OD-B17-S03 can link it: the pair at the narrows, the
   goatherd and his goats gone on up the road ahead of them.

   Beats (Od. 17.182–260):
     1. Eumaeus leads the disguised Odysseus from the farm toward town.
     2. At the fountain they meet Melanthius driving the suitors' best goats.
     3. The goatherd insults Odysseus, kicks him, and mocks Eumaeus.
     4. Odysseus suppresses the urge to kill him and continues toward the palace.

   Verify:  node harness/render-scene.mjs scenes/OD-B17-S02.mjs --t 12   (the walk)
            node harness/render-scene.mjs scenes/OD-B17-S02.mjs --t 38   (the kick)
            node harness/render-scene.mjs scenes/OD-B17-S02.mjs --t 52   (going on)
   ============================================================ */
import { placeInstance, clamp } from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt, SPREAD_FAR } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { anchors as ROAD } from "../assets/location/ithaca-town-road-and-fountain.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import melanthius from "../assets/character/melanthius.mjs";
import goats      from "../assets/creature/goat-herd.mjs";

const FIELD_ASSET = "location.ithaca-town-road-and-fountain";
const D = 56;

/* --- THE LOCAL PLAN -------------------------------------------------------
   project() is  y = .50 + .46 z^1.08 ,  x = .5 + (xPlan-.5)·(SPREAD_FAR + (1-SPREAD_FAR)z)
   so unproject() solves it the other way. st(name, dx) returns the plan station
   whose forward projection is the set's own exported anchor, optionally shifted
   dx across the carriageway in PLAN space (dx shrinks on screen with depth,
   which is what a road does). */
function unproject(X, Y){
  const z = clamp(Math.pow(Math.max(1e-4, Y - 0.50) / 0.46, 1 / 1.08), 0.08, 1);
  const spread = SPREAD_FAR + (1 - SPREAD_FAR) * z;
  return { x: 0.5 + (X - 0.5) / spread, z };
}
const st = (name, dx = 0) => {
  const a = ROAD[name];
  if (!a) throw new Error(`[OD-B17-S02] the set exports no anchor "${name}"`);
  const p = unproject(a.x, a.y);
  return { x: +(p.x + dx).toFixed(4), z: +p.z.toFixed(4) };
};

export const ithacaRoad = makePlan({
  id:"ithaca-town-road",
  name:"The Town Road and the Fountain",
  notes:"Local plan for OD-B17-S02, inverted out of location.ithaca-town-road-" +
        "and-fountain's own road cubic so the plan and the painted road are one " +
        "road. Walking lanes taper with the carriageway; past `mid` there is only " +
        "one lane, because the set pinches there and that pinch is the scene.",
  stations:{
    // --- the walk up off the farm: two lanes, tapering with the road ---------
    country_r:  st("entrance:country"),          // the swineherd's walk-on
    country_l:  st("entrance:country", -0.088),  // the beggar's, a pace behind him
    near_l:     st("road:near",  -0.045),
    near_r:     st("road:near",   0.040),
    lower_l:    st("road:lower", -0.035),
    lower_r:    st("road:lower",  0.035),
    mid_l:      st("road:mid",   -0.028),
    mid_r:      st("road:mid",    0.028),
    // --- the narrows. CONTACT PAIR: the set's own two sides of the throat ---
    meet_below: st("meet:below"),      // uphill-facing side — the beggar stands here
    throat:     st("road:throat"),     // the narrowest point itself
    meet_above: st("meet:above"),      // downhill-facing side — the goatherd's
    // one pace right of it, on the bare shoulder above the throat. Rendered
    // with the goatherd standing square on `meet_above`, the kicking leg came
    // down through the beggar's head; this half-pace of lateral air is what
    // lets the boot read as travelling to a body instead of merging with it.
    meet_above_r: st("meet:above", 0.035),
    // the rock spur that does the pinching, and the shoulder wide enough to
    // stand aside on. A body on either is beside the road, not on it.
    shoulder_right: st("rock:buttress"),
    verge:          st("verge:rest"),
    // --- the water, and the nymphs' altar above it -------------------------
    spring_steps: st("spring:steps"),
    basin:        st("spring:basin"),
    altar:        st("altar:nymphs"),
    // the trodden patch just uphill of the altar and off the carriageway. This
    // one was earned by rendering: a figure ON `altar` grows out of the altar
    // block, and a figure on `spring_steps` vanishes outright into the dressed
    // courses of the rock face. This is the only standing ground on the spring
    // side with open paper behind it.
    spring_terrace: st("altar:nymphs", 0.085),
    // --- above the throat: the holding fold, and the road on into town -----
    herd_fold:  st("herd:ground"),
    road_upper: st("road:upper"),
    road_far:   st("road:far"),
    waymark:    st("waymark:upper"),
  },
  fixtures:[
    { id:"spring_water", kind:"set_piece", at:"basin" },
    { id:"nymph_altar",  kind:"set_piece", at:"altar" },
  ],
});

/* --- SIZE COMES FROM THE ROAD, NOT FROM project() ------------------------
   This was found by rendering, not by reasoning. project()'s scale ramp is
   tuned for a ROOM: (0.60 + 0.50 z)·1.08 spans only 1.7× between the near
   floor and the far wall, because an interior is four paces deep. This road is
   not. The set's own law is  depthAt(t) = lerp(1.00, 0.09, t^0.80)  — an 11×
   fall from the near verge to the gate — and the whole landscape (stones,
   waymarks, fold, drove ground) is drawn through it. Sizing figures with
   project() instead put a man at `road_far` at four fifths the height of a man
   at the fountain: he walked away up the road and did not get smaller, and next
   to the town wall he read as a colossus.
   So the plan owns WHERE a body stands and the set owns HOW BIG it is there.
   ROAD_T records how far up the road each station sits (the parameter its
   anchor was cut at, or the parameter whose y it shares for the off-road ones),
   depthAt() restates the set's law because the set does not export it, and
   sizeOf() interpolates it across a transit off blockingAt's own from/to/u —
   so a figure shrinks continuously as it walks up, exactly like the road. */
const ROAD_T = {
  country_r:0.03, country_l:0.03, near_l:0.08, near_r:0.08,
  lower_l:0.22, lower_r:0.22, mid_l:0.36, mid_r:0.36,
  meet_below:0.40, throat:0.46, meet_above:0.54, meet_above_r:0.54,
  verge:0.345, spring_steps:0.385, basin:0.42, altar:0.50,
  spring_terrace:0.50, shoulder_right:0.485, herd_fold:0.655,
  road_upper:0.62, road_far:0.76, waymark:0.64,
};
const depthAt = t => 1.00 + (0.09 - 1.00) * Math.pow(t, 0.80);   // the set's law
const tOf = name => {
  const v = ROAD_T[name];
  if (v == null) throw new Error(`[OD-B17-S02] station "${name}" has no road parameter`);
  return v;
};
const sizeOf = p => p.moving
  ? depthAt(tOf(p.from)) + (depthAt(tOf(p.to)) - depthAt(tOf(p.from))) * p.u
  : depthAt(tOf(p.station));

/* one height for every human on this road, times the road's own falloff. At the
   fountain that is a figure about a ninth of the frame — small, because a
   country road with a town on the ridge above it is a wide shot, and the throat
   of the carriageway beside him has to stay readable as something two parties
   cannot both get through. */
const MAN = 0.31;
const DROVE = 0.70;   // the drove's box; its five members sit inside it at their own depths

/* --- CONTINUITY IN --------------------------------------------------------
   The previous scene's exit is a hall occupancy. Translate it, and expect the
   translation to be empty: the hall stations have no road equivalents and the
   four bodies standing in them are not on this road. */
import { exitOccupancy as PREV_EXIT } from "./OD-B17-S01.mjs";
const HALL_TO_ROAD = {
  /* intentionally empty — nobody OD-B17-S01 left standing in the megaron walks
     out onto the road in this scene. Telemachus (table_l), Theoclymenus
     (table_r), Eurycleia (doorway_maid) and Penelope (axe_last) all stay in the
     hall and are dropped by the filter below. */
};
const INHERITED = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, station]) => [who, HALL_TO_ROAD[station]])
    .filter(([, station]) => station)
);
const INITIAL = {
  ...INHERITED,                      // {} — see above, and say so in the assessment
  eumaeus:    "country_r",           // leading, out of the farm lane
  odysseus:   "country_l",           // a pace behind him, on his staff
  melanthius: "meet_above",          // already halted at the narrows, drove watered
  goats:      "herd_fold",           // bunched in the fold on the right shoulder
};

/* --- BLOCKING. Stations, not coordinates. -------------------------------- */
const MOVES = [
  // 1 — up off the country road. Eumaeus in the left lane and always first.
  { who:"eumaeus",    from:"country_r", to:"near_l",       t0: 1, t1: 6 },
  { who:"eumaeus",    from:"near_l",    to:"lower_l",      t0: 6, t1:12 },
  { who:"eumaeus",    from:"lower_l",   to:"mid_l",        t0:12, t1:18 },
  { who:"odysseus",   from:"country_l", to:"near_r",       t0: 4, t1:10 },
  { who:"odysseus",   from:"near_r",    to:"lower_r",      t0:10, t1:17 },
  { who:"odysseus",   from:"lower_r",   to:"mid_r",        t0:17, t1:23 },
  // 2 — the fountain. The swineherd goes aside and uphill to the nymphs' altar;
  //     the beggar walks on into the throat, where the goatherd is standing.
  { who:"eumaeus",    from:"mid_l",     to:"spring_terrace", t0:22, t1:28 },
  { who:"odysseus",   from:"mid_r",     to:"throat",         t0:24, t1:30 },
  // 3 — the goatherd swings out of the middle of the throat onto the shoulder
  //     as they come up — not to let them by but to get his boot in as they
  //     pass. `throat` / `meet_above_r` is the CONTACT pair: .051 apart in x
  //     and .058 in depth, a boot's length, two distinct coordinates.
  { who:"melanthius", from:"meet_above",to:"meet_above_r", t0:26, t1:31 },
  // 4 — he drives on to the palace ahead of them, drove first, drover behind.
  { who:"goats",      from:"herd_fold", to:"road_far",     t0:45, t1:54 },
  { who:"melanthius", from:"meet_above_r",to:"road_upper", t0:47, t1:54 },
  //     and the beggar comes on up through the throat behind him, taking the
  //     ground the goatherd has just left, with the swineherd following.
  { who:"odysseus",   from:"throat",    to:"meet_above",   t0:48, t1:54 },
  { who:"eumaeus",    from:"spring_terrace",to:"throat",   t0:50, t1:56 },
];

/* the set has a state channel; the encounter is a state of the road, not a new
   road — "meeting" strikes the palace sightline onto the water and measures the
   throat across. It comes on when they reach the fountain and stays on. */
const FIELD_STATE = t => (t < 20 ? "day" : "meeting");

export const scene = {
  id:"OD-B17-S02",
  title:"The Road with Melanthius",
  book:17,
  plan:"ithaca-town-road",
  duration:D,
  beats:[
    "Eumaeus leads the disguised Odysseus from the farm toward town.",
    "At a fountain they meet Melanthius driving the suitors' best goats.",
    "The goatherd insults Odysseus, kicks him, and mocks Eumaeus.",
    "Odysseus suppresses the urge to kill him and continues toward the palace.",
  ],
  exitState:"Late morning at the narrows below the town. Melanthius has gone on up the road toward the palace with the suitors' best goats ahead of him, having insulted the beggar, kicked him on the hip as he passed, and told the swineherd to his face what he thinks of him and of the master he still waits for. Odysseus is standing in the throat of the road where the kick landed. He did not fall and he did not answer: he weighed clubbing the man down with his staff against going on, and chose to go on, so the disguise is intact and the insult is now owed. Eumaeus has prayed at the nymphs' spring for his master's return and is coming back up onto the road behind him. Nothing has been revealed. The palace sightline runs from the portico down onto this water, the town gate is in view above, and the two of them are inside a bowshot of the house.",
  exitOccupancy:occupancyAt(ithacaRoad, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ eumaeus:"entrance:country", odysseus:"entrance:country",
              melanthius:"meet_above", goats:"herd_fold" },
  exits:{ melanthius:"exit:city (via road_upper)", goats:"exit:city (via road_far)" },
  walkable:"ithaca-town-road stations on the carriageway, plus the spring steps " +
           "and the right-hand verge. The plan owns them; the throat at " +
           "road:throat admits one party at a time, which is the scene's engine.",
  depthOrder:"one queue, sorted by the plan's own z: goats (.27) behind " +
             "melanthius (.55) behind odysseus (.67) / eumaeus (.68).",
  gazeTargets:{ odysseus:"melanthius, then the road above", eumaeus:"melanthius, then the altar",
                melanthius:"down at the beggar, then the goats", goats:"the narrows" },
  attachments:[
    { at: 0, who:"odysseus",   change:"beggar's staff and scrip carried (guise:beggar)" },
    { at:36, who:"odysseus",   change:"grip tightens on the staff — the weapon he does not use" },
    { at:46, who:"melanthius", change:"goad arm up over the drove again" },
  ],
  sound:[
    { at: 0, source:"basin",          cue:"the fair-flowing spring, under everything" },
    { at: 4, source:"country_r",      cue:"two pairs of feet on a stony road, one of them slow" },
    { at:20, source:"herd_fold",      cue:"bells and hooves, a drove held in a fold" },
    { at:30, source:"meet_above",     cue:"the goatherd's voice thrown down at the road" },
    { at:36, source:"throat",         cue:"the kick — a dull blow on the hip, and no cry" },
    { at:42, source:"spring_terrace", cue:"the swineherd's prayer to the nymphs of the spring" },
    { at:48, source:"road_upper",     cue:"the drove driven on, going away up toward the gate" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"day" },
    { asset:"creature.goat-herd", instance:"goats",
      anchor:{x:.700,y:.612}, scale:.246, pose:"drove" },
    { asset:"character.melanthius", instance:"melanthius",
      anchor:{x:.554,y:.696}, scale:.138, band:"threeq", pose:"mel_drive" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.503,y:.754}, scale:.158, band:"threeq", pose:"walk_neutral" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.423,y:.722}, scale:.148, band:"threeq", pose:"walk_neutral" },
  ],

  timeline:[
    // 1 — the walk
    { op:"actor.pose", target:"eumaeus",    at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eumaeus",    at: 0.0, args:{ gaze:{ x:.10, y:-.06 } } },
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0, args:{ gaze:{ x:.06, y:.22 } } },
    { op:"actor.pose", target:"melanthius", at: 0.0, args:{ pose:"mel_drive" } },
    { op:"actor.gaze", target:"melanthius", at: 0.0, args:{ gaze:{ x:.34, y:.18 } } },
    { op:"actor.pose", target:"eumaeus",    at:14.0, args:{ pose:"eum_speak" } },
    { op:"actor.gaze", target:"eumaeus",    at:14.0, args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"actor.pose", target:"odysseus",   at:16.0, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus",   at:16.0, args:{ gaze:{ x:.14, y:.30 } } },
    // 2 — the fountain, and the drove held in the fold above it
    { op:"actor.pose", target:"melanthius", at:20.0, args:{ pose:"mel_idle" } },
    { op:"actor.gaze", target:"melanthius", at:20.0, args:{ gaze:{ x:-.30, y:.14 } } },
    { op:"actor.pose", target:"eumaeus",    at:24.0, args:{ pose:"eum_listen" } },
    { op:"actor.gaze", target:"eumaeus",    at:24.0, args:{ gaze:{ x:.30, y:.04 } } },
    { op:"actor.pose", target:"odysseus",   at:26.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"odysseus",   at:26.0, args:{ gaze:{ x:.36, y:-.10 } } },
    { op:"actor.pose", target:"melanthius", at:27.0, args:{ pose:"mel_swagger" } },
    { op:"actor.gaze", target:"melanthius", at:27.0, args:{ gaze:{ x:-.42, y:.40 } } },
    // 3 — the insult, the kick, the mockery
    { op:"actor.pose", target:"melanthius", at:31.0, args:{ pose:"mel_jeer" } },
    { op:"actor.gaze", target:"melanthius", at:31.0, args:{ gaze:{ x:-.50, y:.26 } } },
    { op:"actor.pose", target:"eumaeus",    at:31.0, args:{ pose:"eum_skeptic" } },
    { op:"actor.gaze", target:"eumaeus",    at:31.0, args:{ gaze:{ x:.44, y:-.02 } } },
    { op:"actor.pose", target:"melanthius", at:36.0, args:{ pose:"mel_kick" } },
    { op:"actor.gaze", target:"melanthius", at:36.0, args:{ gaze:{ x:-.50, y:.32 } } },
    { op:"actor.pose", target:"odysseus",   at:36.0, args:{ pose:"weight_shift" } },
    { op:"actor.gaze", target:"odysseus",   at:36.0, args:{ gaze:{ x:.44, y:-.08 } } },
    { op:"actor.pose", target:"eumaeus",    at:37.0, args:{ pose:"eum_speak" } },
    { op:"actor.gaze", target:"eumaeus",    at:37.0, args:{ gaze:{ x:.46, y:-.06 } } },
    // 4 — the urge, and the refusal of it
    { op:"actor.pose", target:"odysseus",   at:40.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",   at:40.0, args:{ gaze:{ x:.48, y:-.12 } } },
    { op:"actor.pose", target:"melanthius", at:41.0, args:{ pose:"mel_swagger" } },
    { op:"actor.pose", target:"eumaeus",    at:42.0, args:{ pose:"both_hands_raised" } },
    { op:"actor.gaze", target:"eumaeus",    at:42.0, args:{ gaze:{ x:-.20, y:-.46 } } },
    { op:"actor.pose", target:"odysseus",   at:44.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"odysseus",   at:44.0, args:{ gaze:{ x:.20, y:.28 } } },
    { op:"actor.pose", target:"melanthius", at:46.0, args:{ pose:"mel_drive" } },
    { op:"actor.gaze", target:"melanthius", at:46.0, args:{ gaze:{ x:.30, y:.16 } } },
    { op:"actor.pose", target:"odysseus",   at:48.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at:48.0, args:{ gaze:{ x:.16, y:-.06 } } },
    { op:"actor.pose", target:"eumaeus",    at:50.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eumaeus",    at:50.0, args:{ gaze:{ x:.12, y:.02 } } },
    { op:"timeline.capture", target:"OD-B17-S02", at:54.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s   = stateAt(scene, t);
    const blk = blockingAt(ithacaRoad, MOVES, t, INITIAL);

    /* the field first — it paints the road, everything else keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:FIELD_STATE(t), t:0.4,
              progress:Math.min(.94, .18 + .74*(t/D)), status:"THE NARROWS" },
    });

    /* one queue, sorted by the plan's own depth: the road decides who stands in
       front, not the order these blocks happen to be written in. */
    const queue = [];
    const add = (d, draw) => queue.push({ d, draw });

    /* --- THE DROVE: the suitors' best goats, held in the fold, then driven on */
    {
      const p = blk.goats;
      const piled  = t >= 30 && t < 45;
      const filing = t >= 45;
      add(p.d, () => placeInstance(offctx, W, H, goats, {
        anchor:{ x:p.x, y:p.y }, scale:DROVE * sizeOf(p),
        state:{
          pose: filing ? "squeeze" : piled ? "balk" : "drove",
          t: (t * 0.06) % 1,
          status: filing ? "DRIVEN ON" : piled ? "PILED UP" : "THE BEST OF THE FLOCKS",
          progress: Math.min(.96, .20 + .72*(t/D)),
        },
      }));
    }

    /* --- MELANTHIUS: the goatherd who eats at a table he did not set ------- */
    {
      const p  = blk.melanthius;
      const c  = s.melanthius || {};
      const jeering = t >= 31 && t < 36;
      const kicking = t >= 36 && t < 40;
      const leaving = t >= 46;
      add(p.d, () => placeInstance(offctx, W, H, melanthius, {
        anchor:{ x:p.x, y:p.y }, scale:MAN * sizeOf(p),
        state:{
          t:0.5, band:"threeq",
          pose: c.pose || "mel_drive",
          gaze: c.gaze || { x:-.34, y:.20 },
          browUp:   leaving ? .10 : .06,
          browKnit: kicking ? .62 : jeering ? .58 : .30,
          eyeNarrow:kicking ? .40 : jeering ? .34 : .48,
          smile:    leaving ? .22 : jeering ? .18 : .12,
          frown:    kicking ? .30 : .18,
          jaw:      jeering ? .58 : kicking ? .34 : .20,
          mouthAsym:kicking ? .34 : .72,
          status:   kicking ? "A KICK ON THE HIP"
                  : jeering ? "WHERE ARE YOU TAKING THIS PEST"
                  : leaving ? "ON TO THE SUITORS' TABLE"
                            : "INSOLENT",
          progress: Math.min(.96, .16 + .76*(t/D)),
        },
      }));
    }

    /* --- ODYSSEUS: one body, guise "beggar". Nothing is revealed here. ----- */
    {
      const p  = blk.odysseus;
      const c  = s.odysseus || {};
      const struck    = t >= 36 && t < 40;
      const murderous = t >= 40 && t < 44;
      const holding   = t >= 44 && t < 48;
      add(p.d, () => placeInstance(offctx, W, H, odysseus, {
        anchor:{ x:p.x, y:p.y }, scale:MAN * sizeOf(p),
        state:{
          t:0.5, guise:"beggar", band:"threeq",
          pose: c.pose || "walk_neutral",
          gaze: c.gaze || { x:.10, y:.22 },
          browUp:   struck ? .24 : holding ? .16 : .30,
          browKnit: murderous ? .62 : struck ? .44 : holding ? .38 : .22,
          eyeWide:  struck ? .22 : 0,
          eyeNarrow:murderous ? .46 : holding ? .30 : .24,
          frown:    murderous ? .34 : struck ? .26 : .14,
          jaw:      struck ? .18 : 0,
          mouthAsym:holding ? .30 : 0,
          status:   struck    ? "HE DID NOT FALL"
                  : murderous ? "OR DASH HIS HEAD ON THE GROUND"
                  : holding   ? "HE ENDURED IT"
                  : t >= 48   ? "ON TOWARD THE PALACE"
                              : "THE BEGGAR ON THE ROAD",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* --- EUMAEUS: leads him up, then prays at the water ------------------- */
    {
      const p  = blk.eumaeus;
      const c  = s.eumaeus || {};
      const angry   = t >= 31 && t < 42;
      const praying = t >= 42 && t < 50;
      add(p.d, () => placeInstance(offctx, W, H, eumaeus, {
        anchor:{ x:p.x, y:p.y }, scale:MAN * sizeOf(p),
        state:{
          t:0.5, band:"threeq",
          pose: c.pose || "walk_neutral",
          gaze: c.gaze || { x:.10, y:-.04 },
          browUp:   praying ? .60 : angry ? .30 : .34,
          browKnit: angry ? .58 : praying ? .34 : .16,
          eyeNarrow:angry ? .38 : .10,
          smile:    praying ? .10 : 0,
          frown:    angry ? .40 : 0,
          jaw:      angry ? .40 : praying ? .28 : 0,
          mouthAsym:angry ? .24 : 0,
          status:   angry   ? "YOU TALK BIG"
                  : praying ? "NYMPHS OF THE SPRING"
                  : t >= 50 ? "UP TO THE HOUSE"
                            : "LEADING HIM DOWN",
          progress: Math.min(.96, .22 + .70*(t/D)),
        },
      }));
    }

    /* back → front, by the plan's own depth */
    queue.sort((a, b) => a.d - b.d).forEach(j => j.draw());
  },
};
export default scene;

/* named binding so OD-B17-S03 can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
