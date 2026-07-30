/* ============================================================
   SCENE  OD-B20-S01 — The Restless Night        (Od. 20.1–90)
   Book XX, scene 1. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist.

   Beats (causal order, one master clock):
     1. Odysseus lies awake on the undressed ox-hide in the forecourt and
        counts the maids slipping out of the women's quarters to the suitors.
        He counts twelve. His heart growls in him like a bitch over her whelps.
     2. Athena comes down and stands over his head: why do you still doubt,
        now that you are inside your own walls?
     3. She promises she would hold him safe against fifty companies of men —
        and pours sleep over his eyelids at last.
     4. Upstairs Penelope wakes, prays Artemis for death, and dreams that
        Odysseus lies beside her as he looked the year he sailed.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM. This is the one Book XX scene that does NOT play in the great
      hall. Od. 20.1: he makes his bed in the PRODOMOS — the roofed forecourt
      outside the hall door — and the twelve women cross it on their way to the
      suitors. So the field is not location.megaron-hall: the megaron's `night`
      state is the HALL at night and belongs to S03–S05, which play in it, and
      casting it here would put the forecourt action inside the hall. Nothing
      builds or casts a second hall; the hall is simply not this room.
      The forecourt is painted by ensemble.disloyal-maids, whose own shell IS
      this location (`scene:"OD-B20-S01"`): the door of the women's quarters
      back left, four portico columns, the stair to the upper chamber back
      right, the hall-threshold pier as a foreground occluder at the right
      edge, and the ox-hide bed in the forecourt — drawn EMPTY, because the man
      on it is cast separately. That is exactly this scene's cast list.

   B. NO HAND-PLACED ANCHORS. The forecourt gets a small LOCAL plan (below),
      and every body resolves through blockingAt(). The plan is not invented
      twice over: its stations are the INVERSE PROJECTION of the shell's own
      published anchors (`focus:hide`, `threshold:hall`, `route:mid`,
      `stair:upper-chamber`), so a figure blocked at `hide` stands on the hide
      that is actually painted, at the size the painted architecture implies.

   C. CONTACT PAIR. Athena "stood over his head" — she must never resolve onto
      the man. `hide` (his body, near) and `hide_head` (the fleece end, a step
      further off) are a declared pair; they are separate stations and they
      cross-check in every frame.

   D. ONE BODY. Odysseus is character.odysseus-b16 with guise "beggar" held for
      the whole scene — no cut to .odysseus-as-beggar, and no guise ramp: he is
      not restored until Book XXII, so the channel simply does not move here.

   E. PENELOPE. Her chamber is up the stair and out of frame, so the deepest
      station in the plan is where she can be: `stair_foot`, the paving at the
      foot of the painted stair, directly under her door — inverse-projected
      from the shell's own `stair:upper-chamber` anchor and clamped to the
      plan's far limit, which is exactly that spot. She wakes, comes as far as
      the light, prays, and is the farthest and smallest body in the plate.
      She is resolved through the plan like everyone else; no hand anchor.

   F. FIELD TRANSFORM, ONCE. The shell is placed slightly larger than the plate
      and pinned to the bottom edge: that crops its empty upper margin, lifts
      the horizon, and — because the shell draws its twelve members at a FIXED
      pixel height — is the only way to make the painted doorways read taller
      than the women walking through them. Every anchor this scene borrows goes
      through the same transform (`A()`), so no station can drift off the thing
      it names, while values the shell reads back itself (`focus`) stay in the
      shell's own space (`RAW()`).

   G. THE COUNT IS THE PLOT. The shell draws a dotted route with one tick per
      member slot: a count register. `density` thins the file from the far end,
      so ramping it 0→1 over the first twelve seconds IS Odysseus counting the
      women one after another, and the twelve filled ticks stay on the paving
      after the file has gone out — the tally he will kill them for in XXII.

   CONTINUITY IN: first scene of Book XX. Opening positions are declared as
   plan stations (INITIAL), nothing is inherited.

   Verify:
     node harness/render-scene.mjs scenes/OD-B20-S01.mjs --t 9
     node harness/render-scene.mjs scenes/OD-B20-S01.mjs --t 43
   ============================================================ */
import { placeInstance, clamp, clamp01, lerp } from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import shell     from "../assets/ensemble/disloyal-maids.mjs";   // the forecourt + the file
import odysseus  from "../assets/character/odysseus-b16.mjs";
import athena    from "../assets/character/athena.mjs";
import penelope  from "../assets/character/penelope.mjs";

const D = 48;
const FILE_OUT = 15;          // the last of the twelve passes the pier
const ATHENA_IN = 16;         // the goddess stands over his head
const SLEEP = 38;             // she pours sleep on his eyelids
const WAKE = 38;              // upstairs, Penelope wakes in the same moment

/* ---- THE FIELD TRANSFORM (note F) --------------------------------------- */
const FIELD = { scale: 1.12, ax: 0.50, ay: 1.00 };
const F_X0 = FIELD.ax - FIELD.scale / 2, F_Y0 = FIELD.ay - FIELD.scale;

/* ---- THE LOCAL PLAN -----------------------------------------------------
   A road, an orchard, a forecourt: nowhere with an authored plan gets hand
   anchors either. Stations come back out of the painted shell by inverting
   project() (blocking.mjs): z from the screen y, plan x from the screen x and
   the same spread law. A station therefore lands exactly on the thing the
   shell painted, and can never drift away from it. */
const RAW = n => {
  const a = shell.anchors[n];
  if (!a) throw new Error(`[OD-B20-S01] disloyal-maids publishes no anchor "${n}"`);
  return a;
};
/* the shell's anchor, in PLATE coordinates */
const A = n => {
  const a = RAW(n);
  return { x: F_X0 + a.x * FIELD.scale, y: F_Y0 + a.y * FIELD.scale };
};
const stationOf = n => {
  const a = A(n);
  const z = clamp(Math.pow(clamp((a.y - 0.50) / 0.46, 1e-4, 1.25), 1 / 1.08), 0.085, 1);
  return { x: 0.5 + (a.x - 0.5) / (0.42 + 0.58 * z), z };
};

export const forecourt = makePlan({
  id: "b20-forecourt",
  name: "The forecourt and portico of Odysseus, by night",
  notes: "Od. 20.1–90. The prodomos, not the hall: his bed is the ox-hide at " +
         "`hide`, the women's route runs from the quarters door across to " +
         "`threshold` (the hall door, behind the foreground pier), and " +
         "`stair_foot` is the paving under Penelope's door, the deepest mark " +
         "in the room. `hide`/`hide_head` are a CONTACT PAIR: the goddess " +
         "stands at his head, never on him.",
  stations: {
    hide:       stationOf("focus:hide"),            // the undressed ox-hide, near left
    hide_head:  { x: 0.024, z: 0.725 },             // paving off the fleece end — pairs with `hide`
    route_mid:  stationOf("route:mid"),             // mid-portico, where the file passes
    threshold:  stationOf("threshold:hall"),        // the hall door, right, behind the pier
    court_far:  { x: 0.238, z: 0.198 },             // deep in the court, under the colonnade
    stair_foot: stationOf("stair:upper-chamber"),   // under Penelope's door (note E)
  },
  fixtures: [
    { id: "count_register", kind: "prop", along: ["route_mid", "threshold"], count: 12,
      note: "the shell's own route ticks: twelve slots, one per woman he counts" },
  ],
});

/* ---- BLOCKING. Stations, not coordinates. ------------------------------- */
const INITIAL = { odysseus: "hide", athena: "court_far", penelope: "stair_foot" };
const MOVES = [
  // she comes down out of the court once the last woman is out of the forecourt
  { who: "athena", from: "court_far", to: "hide_head", t0: ATHENA_IN, t1: 21 },
  // and withdraws into the court again the moment sleep takes him
  { who: "athena", from: "hide_head", to: "court_far", t0: SLEEP + 2, t1: SLEEP + 7 },
];

/* ---- placeFigure: a PORTRAIT drawing box ---------------------------------
   placeInstance sizes an instance's box srcW×srcH — here 1120×760, landscape.
   figure-hero caps body height at min(H*0.9, W*1.26), and the character
   modules lay their custom parts out in box-W units (athena's spear at x=.665,
   penelope's veil and skirt widths, the plumed crest). In a landscape box the
   body is H-limited while those parts stretch with W, so the spear detaches
   from the hand and the queen turns into a wide dark bell. Any PORTRAIT box
   (aspect < 0.714) puts the body back in the W*1.26 regime the modules were
   authored in — W/bodyHeight is then exactly 1/1.26 whatever the aspect — so
   every figure here gets one, and its plan mark is re-expressed in that box's
   units so the body still lands exactly where the plan put it. The 0.10*scale
   lift is the rig's own floor line (H*0.90 of the box): it puts FEET on the
   mark instead of the box edge. */
const BOX_AR = 0.62;
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  const bw = H * BOX_AR;
  placeInstance(offctx, bw, H, mod, {
    anchor: { x: anchor.x * W / bw, y: anchor.y + 0.10 * scale },
    scale, state,
  });
}

/* he counts them one by one: 12 slots, the far end of the route filling last */
const counted = t => Math.round(lerp(5, 12, clamp01(t / 12)));
const density = t => clamp01((counted(t) / 12 - 0.40) / 0.60);

export const scene = {
  id: "OD-B20-S01",
  title: "The Restless Night",
  book: 20,
  plan: "b20-forecourt",
  duration: D,
  beats: [
    "Odysseus lies awake on the ox-hide in the forecourt; the maids slip out to the suitors and he counts twelve.",
    "His heart growls in him like a bitch standing over her whelps; he beats his breast and holds still.",
    "Athena comes down and stands over his head: why do you doubt, inside your own walls, with your son alive?",
    "She promises she would hold him safe against fifty companies of men, and pours sleep over his eyelids.",
    "Upstairs Penelope wakes, prays Artemis for death, and dreams Odysseus lies beside her as he looked at sailing.",
  ],
  exitState:
    "Night, forecourt: Odysseus asleep at last on the ox-hide, twelve counted " +
    "maids gone out to the suitors' beds and the tally left on the paving; " +
    "Athena withdrawn into the court; Penelope awake at the foot of her stair " +
    "(`stair_foot`, under the upper chamber), having prayed Artemis for death " +
    "and dreamed him beside her. Neither of them knows the other is there. " +
    "Dawn — S02, the mill room — opens from this state.",
  exitOccupancy: occupancyAt(forecourt, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast: [
    { asset: "ensemble.disloyal-maids", instance: "forecourt_night",
      anchor: { x: FIELD.ax, y: FIELD.ay }, scale: FIELD.scale },
    { asset: "character.penelope", instance: "penelope",
      anchor: { x: .77, y: .53 }, scale: .36, band: "front", pose: "penelope_grief" },
    { asset: "character.athena", instance: "athena",
      anchor: { x: .36, y: .58 }, scale: .28, band: "threeq", pose: "athena_resolute" },
    { asset: "character.odysseus-b16", instance: "odysseus",
      anchor: { x: .214, y: .863 }, scale: .29, band: "threeq", pose: "crouch" },
  ],

  timeline: [
    { op: "actor.pose", target: "odysseus", at: 0.0,  args: { pose: "crouch" } },
    { op: "actor.gaze", target: "odysseus", at: 0.0,  args: { gaze: { x: .58, y: -.10 } } },
    { op: "actor.pose", target: "odysseus", at: 12.0, args: { pose: "crouch" } },
    { op: "actor.gaze", target: "odysseus", at: 12.0, args: { gaze: { x: .40, y: .16 } } },
    { op: "actor.pose", target: "athena",  at: ATHENA_IN, args: { pose: "athena_resolute" } },
    { op: "actor.gaze", target: "odysseus", at: 21.0, args: { gaze: { x: -.48, y: -.14 } } },
    { op: "actor.pose", target: "athena",  at: 22.0, args: { pose: "athena_speak" } },
    { op: "actor.gaze", target: "athena",  at: 22.0, args: { gaze: { x: .34, y: .26 } } },
    { op: "actor.pose", target: "athena",  at: 30.0, args: { pose: "athena_command" } },
    { op: "actor.pose", target: "odysseus", at: 30.0, args: { pose: "crouch" } },
    { op: "actor.pose", target: "odysseus", at: SLEEP, args: { pose: "kneel" } },
    { op: "actor.gaze", target: "odysseus", at: SLEEP, args: { gaze: { x: 0, y: .46 } } },
    { op: "actor.pose", target: "athena",  at: SLEEP, args: { pose: "athena_resolute" } },
    { op: "actor.pose", target: "penelope", at: WAKE, args: { pose: "penelope_plea" } },
    { op: "actor.gaze", target: "penelope", at: WAKE, args: { gaze: { x: .06, y: -.18 } } },
    { op: "actor.pose", target: "penelope", at: 43.0, args: { pose: "penelope_grief" } },
    { op: "actor.gaze", target: "penelope", at: 43.0, args: { gaze: { x: .04, y: .40 } } },
    { op: "timeline.capture", target: "OD-B20-S01", at: 47.0, args: { label: "EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(forecourt, MOVES, t, INITIAL);
    const gone   = t >= FILE_OUT;                       // the file is out of the forecourt
    const asleep = t >= SLEEP;
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);    // deterministic idle phase

    /* --- THE FORECOURT: the field. Portico, hide and count register always;
       the three file bands only while the women are crossing it. ---------- */
    placeInstance(offctx, W, H, shell, {
      anchor: { x: FIELD.ax, y: FIELD.ay }, scale: FIELD.scale,
      state: {
        layers: gone ? ["portico", "route", "hide", "pier"]
                     : ["portico", "route", "hide", "file-back", "file-mid", "file-front", "pier"],
        formation: "file", count: 12, dir: 1,
        density: density(t),
        attention: 0.16 + 0.20 * clamp01(t / 12),       // they glance at a bed they think is empty
        mirth: lerp(0.42, 0.95, clamp01(t / 12)),
        stealth: 0.64, spread: 1.0, lamps: 3,
        wave: 1.6,                                      // no reaction wave: he lets them pass
        focus: RAW("focus:hide"),                       // shell space: every head aims at the man
        t: 0.5,
        status: gone ? "TWELVE COUNTED" : "SLIPPING OUT",
        progress: clamp01(0.16 + 0.78 * (t / D)),
      },
    });

    /* --- PENELOPE at the foot of her stair (note E). Deepest body: first. -- */
    if (t >= WAKE){
      const p = blk.penelope, s = st.penelope || {};
      const dreaming = t >= 43;
      placeFigure(offctx, W, H, penelope, {
        anchor: { x: p.x, y: p.y },
        scale: 0.36 * p.scale,
        state: {
          t: breath, band: "front",
          pose: s.pose || "penelope_grief",
          gaze: s.gaze || { x: .05, y: .40 },
          mouth: dreaming ? -1 : .5,
          status: dreaming ? "HE LAY BESIDE HER" : "PRAYING FOR DEATH",
          progress: clamp01((t - WAKE) / (D - WAKE)),
        },
      });
    }

    /* --- ATHENA: out of the court, over his head, and back into the court. */
    if (t >= ATHENA_IN){
      const p = blk.athena, s = st.athena || {};
      const arriving = t < 21, leaving = t >= SLEEP + 2;
      placeFigure(offctx, W, H, athena, {
        anchor: { x: p.x, y: p.y }, scale: 0.28 * p.scale,
        state: {
          t: breath, band: "threeq",
          pose: s.pose || "athena_resolute",
          gaze: s.gaze || { x: .30, y: .22 },
          browUp: arriving ? .18 : .34,
          eyeWide: leaving ? .16 : .30,
          status: leaving ? "SLEEP GIVEN" : arriving ? "SHE COMES DOWN" : "FIFTY COMPANIES",
          progress: clamp01(0.20 + 0.74 * (t / D)),
        },
      });
    }

    /* --- ODYSSEUS: one body, guise "beggar" held. Nearest, so last. ------ */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const raging = t >= 12 && t < ATHENA_IN;
      placeFigure(offctx, W, H, odysseus, {
        anchor: { x: p.x, y: p.y }, scale: 0.29 * p.scale,
        state: {
          t: breath, guise: "beggar", band: "threeq",
          pose: s.pose || "crouch",
          gaze: s.gaze || { x: .58, y: -.10 },
          browKnit: asleep ? .06 : raging ? .62 : .40,
          browUp:   asleep ? .04 : t >= 21 ? .30 : .10,
          frown:    asleep ? 0 : raging ? .52 : .24,
          eyeNarrow: asleep ? .96 : raging ? .48 : .30,
          eyeWide:  asleep ? 0 : t >= 21 ? .16 : 0,
          jaw:      raging ? .18 : 0,
          status: asleep ? "SLEEP AT LAST"
                : t >= 21 ? "WHY DO I DOUBT"
                : raging ? "LIKE A BITCH OVER HER WHELPS"
                : `COUNTING ${counted(t)}`,
          progress: clamp01(0.12 + 0.80 * (t / D)),
        },
      });
    }
  },
};
export default scene;

/* named binding so OD-B20-S02 can `import { exitOccupancy as INITIAL }`.
   S02 plays in the mill room: it must translate or drop these stations —
   `hide` and `upper_chamber` do not exist in that plan. */
export const exitOccupancy = scene.exitOccupancy;
