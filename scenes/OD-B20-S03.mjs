/* ============================================================
   SCENE  OD-B20-S03 — The Herdsmen Arrive               (Od. 20.122–239)
   Book XX, scene 3. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied
   from the reference scene, scenes/OD-B16-S03.mjs, and from its two Book XX
   siblings, OD-B20-S01 and OD-B20-S02.

   Beats (causal order, one master clock):
     1. Eurycleia wakes the household; the hall is dressed for the feast day of
        Apollo — fire built up, tables laid, the great doors thrown open.
     2. Eumaeus arrives with his three hogs and greets the beggar kindly.
     3. Melanthius comes in behind his goats and renews the abuse.
     4. Philoetius brings the cattle, takes the stranger's hand and weeps,
        because the body in the rags is the shape of Odysseus.
     5. Odysseus tells him the master is coming, before the herdsman goes to
        his work.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM, NOT ROOMS. The atlas asks for `location.festival-ready-hall`. There
      is no such room: it is the megaron in a different STATE, so this scene
      casts location.megaron-hall and moves its state channel `day` -> `feast`
      at the moment the servants finish dressing it (t=13). Nothing here builds
      or casts a second hall, and the field is placed exactly as every other
      Book XVI+ hall scene places it — anchor (.50,.99), scale 1.0 — so this
      hall registers on B16-S04, B17-S01, B18-S01 and B19-S02's hall to the
      pixel.
      TWO LAYERS ARE DROPPED, both for continuity rather than for looks:
        · `racks` — Od. 19.1–33: father and son carried every spear and shield
          out of this hall by night. `feast` is authored for XVI–XVIII and still
          hangs arms on the walls; from Book XX there is nothing to hang, and
          the peg rails with them are more honest gone than repainted.
        · `litter` — `feast` scatters bones and fallen cups. It is DAWN. Nobody
          has eaten yet; the suitors do not come in until S04.
      Everything load-bearing stays: both doors, the sill, the pillars, the
      lane, the hearth, the stair, the throne and the furniture — because the
      whole point of the feast-day state is the laden tables.

   B. NO HAND-PLACED ANCHORS. Every position resolves through
      scenes/_plans/megaron.mjs by station NAME. Nothing here is a hand anchor.
      Which stations are USABLE in this room was settled by OD-B19-S02 and
      OD-B18-S01 and is not re-litigated: a body resting on bench_l1/l2/r1/r2
      or table_l/r wears the painted furniture through its legs; `throne` paints
      a near plinth whose top face lands at y≈0.79–0.85, so the near spine
      (axe_last, shot_mark) puts a figure on the seat; `hearth` is a fire. What
      is left, and what is used here: threshold, door_main, postern, axe_first,
      pillar_l, pillar_r, doorway_maid, corner_dead.

   C. THE CONTACT PAIR, AND WHY IT IS WHERE IT IS. Beat 4 is a touch — the
      cowherd takes the beggar's hand — so the two bodies must resolve to two
      stations, never one. In the hut plan that is centre_l/centre_r, 0.10 of
      the frame apart at one depth. The megaron plan has no such twinned pair;
      measured through project(), its only clean pair at one depth is
      `pillar_r` (x .662, y .690) and `doorway_maid` (x .792, y .671) — 0.130
      apart in x and 0.019 in y, which is the hut pair's geometry almost
      exactly. So the clasp is staged there, with the CLOSER-to-camera station
      (pillar_r, d .44) given to Philoetius and the farther (doorway_maid,
      d .40) to Odysseus: the big cowherd bows in FRONT of the beggar, which is
      the way round the beat wants. `doorway_maid` is used for its floor, not
      for its door — the mouth of the women's door in the right wall is simply
      the clean pace of ground outboard of the right-hand roof-pillar, and
      nobody goes through that door in this scene. Od. 20.257 sets the beggar's
      stool "inside the hall by the stone threshold"; the sill itself cannot
      hold him here, because three droves and three herdsmen come in over it —
      any entrance from `door_main` passes within 17px of a body standing on
      `threshold`, at the same depth. He therefore comes off the sill in the
      first ten seconds and takes the right-hand wall, where B19-S02 left him
      the night before.

   D. ONE BODY, ONE GUISE. Odysseus is character.odysseus-b16 with guise
      "beggar" held for the whole scene — no cut to .odysseus-as-beggar, and no
      guise ramp: he is not restored until Book XXII, so the channel does not
      move here and no divine_fx is cast.

   E. ROUTES CHECKED, NOT ASSUMED. Every walk in MOVES was resolved against
      every other body's resting mark, because that is the class of bug that
      only shows across time:
        · Nobody walks through the fire. The hearth ring occupies plan
          x .395–.605, z .445–.595. Eurycleia's two legs stay at z ≤ .28;
          Eumaeus' and Melanthius' routes cross z=.445 at x .346 and .330,
          outside it on the left; Philoetius' route never reaches z .445.
        · ONE BODY ON THE SPINE AT A TIME. `threshold` and `axe_first` are both
          x=.50 and stack into a totem of heads whenever both are occupied. So
          the two of them are never on it together: Odysseus is walking OFF the
          sill (t 4–12) along the right-hand diagonal while Eurycleia is walking
          ONTO axe_first (t 5–10) from the left, 0.25 of the frame apart the
          whole way, and from t=17 the spine is empty and stays empty — the
          three herdsmen only cross it, none of them stops on it.
        · The near-left corner is reachable only across the left-mid floor, so
          `pillar_l` is left EMPTY until Eumaeus has finished crossing it to
          `corner_dead` (t=26) — Melanthius does not start for it until t=30.
        · Philoetius stops at pillar_r, which is INBOARD of Odysseus at
          doorway_maid, so his route never crosses the body he is walking
          toward: closest approach 173px, and no pass-through at all.
      One crossing is deliberate and kept: Eurycleia's second leg clips in
      FRONT of Odysseus around t=15, near-side, at speed. She is a nearer body
      passing a farther one and it never happens at rest.

   F. THE LIVESTOCK IS OUTSIDE, SO IT IS DRAWN AS A WINDOW.
      creature.festival-livestock is not a herd of loose beasts: it is a whole-
      frame diagram of the COURT — three tapering routes, a broken court wall,
      the gate mouth and three tally plates. Two facts follow. First, the
      beasts are not in this room and must not be painted in it: Eumaeus' hogs,
      Melanthius' goats tied under the portico and Philoetius' heifer are all
      in the yard on the other side of the great doors, and a pig standing on
      the megaron floor would be a false room. Second, cast full-frame it would
      paint its own court, its own gate and its own wall over the inside of the
      hall. So it is composited as ONE called-out DETAIL WINDOW in the upper
      left — the idiom of OD-B19-S01's arms ledger and OD-B20-S02's quern —
      with its own paper field and one hard rule, because keyed straight onto
      the ceiling plane the rafters and the transverse beams run through the
      animals and they stop reading as objects.
      The window MOVES on the master clock instead of the plate: the drawing is
      rendered once per state and the blit takes the swine lane while the hogs
      come (t 18–30), the goat lane while the goats come (30–41), the cattle
      lane while the oxen come (41–52), and the massed court once all three
      droves are in (52+). The plate never moves or changes size, so it reads as
      ONE window whose contents change. The first pass drew each window 1:1 out
      of a 519px-wide canvas and printed almost nothing — a 100px beast inside a
      235px plate is a scatter of legs — so each window is now cut TIGHT around
      one animal and blown up into the plate instead. That is safe in this
      pipeline and not a shortcut: the halftone is applied once, afterwards, over
      the whole stage, so upscaling solid tone yields a chunkier contour and a
      coarser dot field, never a soft one.
      THE TALLY PLATES ARE CROPPED OUT ON PURPOSE: at this
      plate size their seven-segment numerals fall to 23px wide, under the
      legible floor, and a numeral that dissolves in the dot lattice is worse
      than no numeral. The counts (three hogs, twelve goats, the heifer and her
      drove) are carried by the beats and the exit state instead.

   G. TONE. The room is placed in its two LIGHT states — `day` and `feast`,
      both lift 0 — and never `night` (lift 1), which is the darker room S02
      left behind and would have printed this frame two levels down. The three
      herdsmen are the atlas' light bodies (Philoetius' pale tunic and bare
      shins, Eumaeus' hide over an undyed tunic); no ctx overpaint is added to
      any figure — every mark is the shared rig, which is what keeps the six
      Odysseus modules in family.

   H. ONE MIRROR, AND ONLY ONE. Melanthius' abuse poses are authored jabbing
      DOWN AND LEFT (mel_jeer), and in this room the man he is abusing is to
      his RIGHT: the jeer would point at the postern instead of at the beggar.
      He is therefore drawn `mirror:true` for the whole scene — never switched
      mid-scene, which would flip his gift-cloak from one shoulder to the other
      in one frame. He is pure rig with no overpaint, so the mirror is exact.
      Eumaeus is never mirrored: his staff and hide cloak are ctx work at fixed
      box coordinates and would detach.

   CONTINUITY IN — computed, then TRANSLATED (brief note F). OD-B20-S02 ends in
   the mill house and exports `exitOccupancy`; `mat_09` is a mill-house name and
   does not exist here. The mill house's `threshold` and the hall's `threshold`
   are two different doors with one name, and the translation is deliberate: he
   was standing in the mill-room doorway listening, and that doorway opens off
   this hall, so the body that steps out of it steps onto this sill. The mill
   woman is DROPPED — she is spent on her knees at the twelfth stone in the
   other room and the story leaves her there. Eurycleia and the three herdsmen
   are new to the chain and are declared at their stations: she at the service
   door she comes out of, the three of them outside the great doors.

   Verify (early, mid and late — the dressing, the abuse and the clasp):
     node harness/render-scene.mjs scenes/OD-B20-S03.mjs --t 8
     node harness/render-scene.mjs scenes/OD-B20-S03.mjs --t 38
     node harness/render-scene.mjs scenes/OD-B20-S03.mjs --t 56
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import eurycleia   from "../assets/character/eurycleia.mjs";
import eumaeus     from "../assets/character/eumaeus.mjs";
import melanthius  from "../assets/character/melanthius.mjs";
import philoetius  from "../assets/character/philoetius.mjs";
import livestock   from "../assets/creature/festival-livestock.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 62;

/* ---- THE CLOCK ---------------------------------------------------------- */
const ROUSE    = 2;    // Eurycleia calls the household up
const DRESSED  = 13;   // the hall is festival-ready: state day -> feast
const EUR_OUT  = 17;   // she goes back through the service door
const EUM_IN   = 18;   // the swineherd comes in with the hogs counted
const EUM_HAIL = 27;   // he greets the beggar kindly
const MEL_IN   = 30;   // the goatherd, behind his goats
const MEL_JEER = 37;   // and the abuse begins again
const PHI_IN   = 41;   // the cowherd, behind the cattle
const PHI_HAIL = 49;   // the unguarded greeting
const WONDER   = 51;   // the stare: this man is the shape of my master
const CLASP    = 53;   // he takes the stranger's hand and weeps
const GRIEF    = 56;   // his complaint against the men eating the herd
const PROPHECY = 58;   // "he is coming" — before the herdsman goes to work
const MASSED   = 52;   // all three droves are inside the court gate

/* the room, minus the arms that were carried out in Book XIX and minus the
   feast litter of a meal nobody has eaten yet (note A). Every load-bearing
   fixture of the megaron stays. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","postern","maidsdoor",
                     "stair","pillars","lane","hearth","furniture","throne"];

/* ---- CONTINUITY IN: translate the mill house, drop who is not here ------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B20-S02.mjs";
const MILL_TO_HALL = {
  threshold:  "threshold",   // the mill-room doorway opens off this hall: he steps onto the sill
  listener:   "door_main",   // the ear outside a door -> the great doors
  aisle_far:  "axe_first",
  mat_09:     null,          // her stone. The mill woman stays in the mill room.
  mat_weary:  null,
};
const INITIAL = {
  ...Object.fromEntries(
    Object.entries(PREV_EXIT || {})
      .map(([who, st]) => [who, MILL_TO_HALL[st] ?? null])
      .filter(([, st]) => st)),
  /* new to the chain */
  eurycleia:  "postern",     // out of the service passage at dawn, rousing the house
  eumaeus:    "door_main",   // the three of them are still outside the great doors
  melanthius: "door_main",
  philoetius: "door_main",
};

/* ---- BLOCKING. Stations, not coordinates (notes B, C, E). ---------------- */
const MOVES = [
  // the beggar comes off the sill before the droves come in over it, and takes
  // the right-hand wall — the ground B19-S02 left him standing on
  { who:"odysseus",   from:"threshold", to:"doorway_maid", t0: 4,  t1:12 },
  // the nurse crosses to the middle of the hall to set the household working,
  // then goes back out the way she came
  { who:"eurycleia",  from:"postern",   to:"axe_first",    t0: 5,  t1:10 },
  { who:"eurycleia",  from:"axe_first", to:"postern",      t0:12,  t1:EUR_OUT },
  // the swineherd comes the whole depth of the room to the near floor
  { who:"eumaeus",    from:"door_main", to:"corner_dead",  t0:EUM_IN, t1:26 },
  // the goatherd stops mid-floor at the left-hand pillar, which Eumaeus has
  // finished crossing four seconds earlier
  { who:"melanthius", from:"door_main", to:"pillar_l",     t0:MEL_IN, t1:36 },
  // the cowherd comes to the right-hand pillar — INBOARD of the beggar, so he
  // walks toward him and never across him
  { who:"philoetius", from:"door_main", to:"pillar_r",     t0:PHI_IN, t1:48 },
];

/* ---- placeFigure: a PORTRAIT drawing box --------------------------------
   Verbatim from OD-B20-S01/S02: placeInstance sizes an instance's box
   srcW×srcH — here 1120×760, landscape — and figure-hero caps body height at
   min(H*0.9, W*1.26) while the character modules lay their custom parts out in
   box-W units (Eurycleia's skirt and apron, Eumaeus' staff and hide cloak). In
   a landscape box the body is H-limited while that cloth stretches with W, so
   the nurse turns into a wide bell and the swineherd's staff walks out of his
   hand. Any PORTRAIT box (aspect < 0.714) puts the body back in the W*1.26
   regime the modules were authored in. The 0.10*scale lift is the rig's own
   floor line (H*0.90 of the box): it puts FEET on the mark. */
const BOX_AR = 0.62;
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  const bw = H * BOX_AR;
  placeInstance(offctx, bw, H, mod, {
    anchor: { x: anchor.x * W / bw, y: anchor.y + 0.10 * scale },
    scale, state,
  });
}
/* one figure scale for the whole cast: the plan's own depth law does the rest,
   so nobody is hand-tuned bigger than the room allows. */
const K = 0.54;

/* ---- PLATE — blit ONE declared window of a whole-frame drawing, keyed on the
   dot law so only ink lands (note F). */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* A DETAIL WINDOW has to be one: its own paper field and one hard rule, the
   same device the engine's card uses. Keyed straight onto the room, the
   ceiling plane's rafters and tie beams run through the beasts. */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 5;
  offctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  offctx.restore();
}

/* WHERE THE COURT WINDOW SITS. Upper left: ceiling plane and the far end of the
   left wall, and with `racks` dropped there is nothing there at all. It starts
   at y .058, below the card label, and stops at x .232 and y .392 — short of the
   postern opening, whose top-left corner is at (.241,.376) — so it covers no
   door and no plot geometry. 235×254px on the plate.
   CW/CH is the canvas the livestock diagram is drawn on. Every length in that
   module is a fraction of its own canvas, so CW is what sets how big a beast is:
   at 519 the lead ox comes out ~166px long, which is a whole animal inside a
   235px window. Rendered any larger and one hoof fills the plate; any smaller
   and the beasts fall under the dot lattice. */
const COURT_CW = 519, COURT_CH = 794;
const COURT_DST = { x0:0.022, y0:0.058, x1:0.232, y1:0.392 };
/* Four views, one frame. Each window is cut to the aspect of COURT_DST (0.925)
   so nothing is stretched, and each is centred on the BODY of its lead beast —
   not on its foot mark, which would crop the back off. Each lane view is 208×225
   of the drawing, blown up ~1.13× into the plate, which is the widest crop that
   still holds one whole animal INCLUDING its head: the first pass cut tighter
   and sliced the goat's horns and the hog's snout off at the frame, and a
   quadruped without a head does not read as a quadruped. The massed view is
   wider again (257×278, ~0.9×) because three bunched beasts are the whole
   content of that state — and that view has no route bands in it, which is why
   it is the cleanest of the four: a lane edge is a hard stroke and it crosses
   the barrel of any beast standing on its own lane.
   Blowing a solid-tone drawing UP is safe here — the halftone is applied once,
   afterwards, over the whole stage, so an upscaled contour comes out chunkier,
   never softer. */
const COURT_WIN = {
  swine:  { x0:.042, y0:.665, x1:.442, y1:.948 },   // the near hog on the swine route
  goat:   { x0:.286, y0:.606, x1:.686, y1:.889 },   // the bearded goat on the middle route
  ox:     { x0:.520, y0:.320, x1:.920, y1:.603 },   // two cattle, the lead one marked
  massed: { x0:.115, y0:.360, x1:.610, y1:.710 },   // three droves bunched inside the gate
};
const courtViewAt = t =>
    t <  EUM_IN ? null
  : t <  MEL_IN ? "swine"
  : t <  PHI_IN ? "goat"
  : t <  MASSED ? "ox"
  : "massed";

export const scene = {
  id:"OD-B20-S03",
  title:"The Herdsmen Arrive",
  book:20,
  plan:"megaron",
  duration:D,
  beats:[
    "Eurycleia wakes the household and the servants dress the hall for Apollo's feast day.",
    "Eumaeus arrives with three fat hogs and greets the beggar kindly.",
    "Melanthius comes in behind his goats and renews his abuse of the stranger.",
    "Philoetius brings the cattle, takes the stranger's hand and weeps at the likeness.",
    "Odysseus tells him the master is coming, before the herdsman goes to his work.",
  ],
  exitState:
    "Morning in the megaron, dressed for the feast day of Apollo: fire built " +
    "up, tables laid, the great doors thrown open, the walls still bare of arms " +
    "since Book XIX and no litter on the floor yet. Odysseus, still the beggar, " +
    "is off the sill and standing against the right-hand wall at the mouth of " +
    "the women's door (`doorway_maid`), having just told the cowherd that " +
    "Odysseus is coming home; Philoetius stands a pace inboard of him at the " +
    "right-hand roof-pillar (`pillar_r`), steadied, having taken the stranger's " +
    "hand and wept at the likeness without once working out what it means. " +
    "Eumaeus is on the near floor at the left (`corner_dead`) with his three " +
    "hogs delivered; Melanthius is at the left-hand roof-pillar (`pillar_l`) " +
    "with his twelve goats tied under the portico, having been answered by " +
    "nobody. Eurycleia has gone back through the service passage (`postern`). " +
    "All three droves are inside the court gate. Nobody in the hall except the " +
    "beggar knows the beggar; the suitors have not come in yet — S04 opens from " +
    "this state, with the hall exactly this dressed and these four men in it.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"creature.festival-livestock", instance:"droves",
      anchor:{x:.12,y:.36}, scale:.20, state:"arriving" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.79,y:.67}, scale:.36, band:"threeq", pose:"head_lowered" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:.25,y:.60}, scale:.33, band:"threeq", pose:"eury_clasp" },
    { asset:"character.philoetius", instance:"philoetius",
      anchor:{x:.66,y:.69}, scale:.37, band:"threeq", pose:"phi_driving" },
    { asset:"character.melanthius", instance:"melanthius",
      anchor:{x:.34,y:.69}, scale:.37, band:"threeq", pose:"mel_swagger" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.12,y:.91}, scale:.48, band:"threeq", pose:"eum_welcome" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at: 0.0,      args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0,      args:{ gaze:{ x:-.16, y:.38 } } },
    { op:"actor.pose", target:"eurycleia",  at: 0.0,      args:{ pose:"eury_clasp" } },
    { op:"actor.gaze", target:"eurycleia",  at: 0.0,      args:{ gaze:{ x:.24, y:.06 } } },
    { op:"actor.pose", target:"eurycleia",  at: ROUSE,    args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"eurycleia",  at: ROUSE,    args:{ gaze:{ x:.36, y:-.28 } } },
    { op:"actor.pose", target:"eurycleia",  at:11.0,      args:{ pose:"eury_clasp" } },
    { op:"actor.pose", target:"odysseus",   at:12.0,      args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus",   at:12.0,      args:{ gaze:{ x:-.30, y:.16 } } },
    { op:"actor.pose", target:"eumaeus",    at:EUM_HAIL,  args:{ pose:"eum_welcome" } },
    { op:"actor.gaze", target:"eumaeus",    at:EUM_HAIL,  args:{ gaze:{ x:.52, y:-.18 } } },
    { op:"actor.pose", target:"odysseus",   at:EUM_HAIL,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus",   at:EUM_HAIL,  args:{ gaze:{ x:-.46, y:.30 } } },
    { op:"actor.pose", target:"melanthius", at:MEL_JEER,  args:{ pose:"mel_jeer" } },
    { op:"actor.gaze", target:"melanthius", at:MEL_JEER,  args:{ gaze:{ x:.52, y:.26 } } },
    { op:"actor.pose", target:"odysseus",   at:MEL_JEER,  args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"odysseus",   at:MEL_JEER,  args:{ gaze:{ x:-.22, y:.34 } } },
    { op:"actor.pose", target:"eumaeus",    at:MEL_JEER+1,args:{ pose:"eum_skeptic" } },
    { op:"actor.gaze", target:"eumaeus",    at:MEL_JEER+1,args:{ gaze:{ x:.30, y:-.06 } } },
    { op:"actor.pose", target:"melanthius", at:44.0,      args:{ pose:"mel_swagger" } },
    { op:"actor.gaze", target:"melanthius", at:44.0,      args:{ gaze:{ x:.40, y:.34 } } },
    { op:"actor.pose", target:"philoetius", at:PHI_HAIL,  args:{ pose:"phi_greeting" } },
    { op:"actor.gaze", target:"philoetius", at:PHI_HAIL,  args:{ gaze:{ x:.34, y:-.06 } } },
    { op:"actor.pose", target:"odysseus",   at:PHI_HAIL,  args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus",   at:PHI_HAIL,  args:{ gaze:{ x:-.34, y:.10 } } },
    { op:"actor.pose", target:"eumaeus",    at:PHI_HAIL,  args:{ pose:"eum_listen" } },
    { op:"actor.pose", target:"philoetius", at:WONDER,    args:{ pose:"phi_wonder" } },
    { op:"actor.gaze", target:"philoetius", at:WONDER,    args:{ gaze:{ x:.30, y:-.02 } } },
    { op:"actor.pose", target:"odysseus",   at:52.0,      args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus",   at:52.0,      args:{ gaze:{ x:-.30, y:.22 } } },
    { op:"actor.pose", target:"philoetius", at:CLASP,     args:{ pose:"phi_clasp" } },
    { op:"actor.gaze", target:"philoetius", at:CLASP,     args:{ gaze:{ x:.28, y:.46 } } },
    { op:"actor.pose", target:"philoetius", at:GRIEF,     args:{ pose:"phi_grievance" } },
    { op:"actor.gaze", target:"philoetius", at:GRIEF,     args:{ gaze:{ x:.24, y:.06 } } },
    { op:"actor.pose", target:"odysseus",   at:PROPHECY,  args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus",   at:PROPHECY,  args:{ gaze:{ x:-.34, y:-.10 } } },
    { op:"actor.pose", target:"philoetius", at:60.0,      args:{ pose:"phi_resolve" } },
    { op:"actor.gaze", target:"philoetius", at:60.0,      args:{ gaze:{ x:.16, y:-.14 } } },
    { op:"timeline.capture", target:"OD-B20-S03", at:61.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle phase
    const dressed = t >= DRESSED;

    /* --- 1. THE HALL. It paints the room; everything else keys onto it. The
       state channel carries the whole first beat: the servants' work is the
       room changing from an ordinary morning hall into a festival one. ----- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state: dressed ? "feast" : "day",
        t: breath, layers: HALL_LAYERS,
        status: dressed ? "APOLLO'S FEAST DAY" : "DRESSING THE HALL",
        progress: clamp01(0.12 + 0.82 * (t / D)),
      },
    });

    /* --- 2. THE FIVE BODIES, ordered back to front by their own blocked depth
       so a farther one is never painted over a nearer one. ----------------- */
    const draw = {
      /* ODYSSEUS — one body, guise "beggar" held. He comes off the sill, takes
         the right-hand wall, is greeted, is abused, gives his hand, and makes
         the only promise in the scene. */
      odysseus: () => {
        const p = blk.odysseus, s = st.odysseus || {};
        const greeted  = t >= EUM_HAIL && t < MEL_JEER;
        const abused   = t >= MEL_JEER && t < PHI_HAIL;
        const clasped  = t >= CLASP && t < PROPHECY;
        const swearing = t >= PROPHECY;
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.42) % 4 : breath,
            guise:"beggar", band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "head_lowered"),
            gaze: s.gaze || { x:-.20, y:.30 },
            browUp:    swearing ? .34 : clasped ? .40 : greeted ? .26 : .12,
            browKnit:  swearing ? .44 : abused ? .40 : .22,
            eyeNarrow: abused ? .40 : swearing ? .30 : .18,
            eyeWide:   clasped ? .16 : 0,
            smile:     greeted ? .20 : clasped ? .14 : 0,
            mouthAsym: swearing ? .52 : abused ? .34 : .14,
            jaw:       swearing ? .34 : 0,
            frown:     abused ? .18 : 0,
            status: swearing ? "HE IS COMING"
                  : clasped  ? "YOUR HAND, HERDSMAN"
                  : abused   ? "ENDURING"
                  : greeted  ? "KINDLY MEANT"
                  : dressed  ? "OFF THE SILL" : "BEFORE THE HOUSE WAKES",
            progress: clamp01(0.12 + 0.82 * (t / D)),
          },
        });
      },
      /* EURYCLEIA — beat 1 and nothing else: she rouses the house, sets the
         servants working in the middle of the floor, and goes back out through
         the service passage. Not drawn once she is through it. */
      eurycleia: () => {
        if (t >= EUR_OUT) return;
        const p = blk.eurycleia, s = st.eurycleia || {};
        const calling = t >= ROUSE && t < 8;
        placeFigure(offctx, W, H, eurycleia, {
          anchor:{ x:p.x, y:p.y }, scale: K * 0.94 * p.scale,
          state:{
            t: p.moving ? (t * 0.40) % 4 : breath,
            band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "eury_clasp"),
            gaze: s.gaze || { x:.24, y:.06 },
            browUp:   calling ? .58 : .36,
            browKnit: calling ? .28 : .30,
            jaw:      calling ? .48 : .10,
            frown:    .12,
            status:   calling ? "UP — THE FEAST DAY" : "THE HOUSE IS WAKING",
            progress: clamp01(0.10 + 0.84 * (t / D)),
          },
        });
      },
      /* EUMAEUS — the hogs are delivered, so the swineherd comes the whole
         depth of the room and stands nearest the camera. His welcome is the
         warmest gesture in the atlas and it is aimed up and across the hall at
         a man in rags. Never mirrored (note H). */
      eumaeus: () => {
        if (t < EUM_IN) return;
        const p = blk.eumaeus, s = st.eumaeus || {};
        const hailing = t >= EUM_HAIL && t < MEL_JEER + 1;
        const galled  = t >= MEL_JEER + 1 && t < PHI_HAIL;
        placeFigure(offctx, W, H, eumaeus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.44) % 4 : breath,
            band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "eum_welcome"),
            gaze: s.gaze || { x:.46, y:-.14 },
            smile:    hailing ? .42 : 0,
            cheek:    hailing ? .30 : .08,
            browUp:   hailing ? .34 : galled ? .18 : .44,
            browKnit: galled ? .46 : hailing ? .06 : .34,
            eyeNarrow:galled ? .42 : .08,
            mouthAsym:galled ? .58 : 0,
            frown:    galled ? .14 : .10,
            status:   galled ? "THAT MOUTH AGAIN"
                    : hailing ? "WELCOME, STRANGER"
                    : t >= PHI_HAIL ? "LISTENING" : "THREE FAT HOGS",
            progress: clamp01(0.14 + 0.80 * (t / D)),
          },
        });
      },
      /* MELANTHIUS — in behind his goats, mid-floor at the left-hand pillar,
         and straight back to the abuse. MIRRORED for the whole scene so the
         jeer is aimed at the beggar and not at the postern (note H). */
      melanthius: () => {
        if (t < MEL_IN) return;
        const p = blk.melanthius, s = st.melanthius || {};
        const jeering = t >= MEL_JEER && t < 44;
        placeFigure(offctx, W, H, melanthius, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.46) % 4 : breath,
            band:"threeq", mirror:true,
            pose: p.moving ? "walk_neutral" : (s.pose || "mel_swagger"),
            gaze: s.gaze || { x:.44, y:.30 },
            browKnit: jeering ? .44 : .34,
            eyeNarrow:jeering ? .58 : .52,
            jaw:      jeering ? .42 : .18,
            mouthAsym:jeering ? .88 : .78,
            smile:    .10,
            frown:    jeering ? .26 : .20,
            status:   jeering ? "STILL HERE, BEGGAR" : "TWELVE GOATS",
            progress: clamp01(0.14 + 0.80 * (t / D)),
          },
        });
      },
      /* PHILOETIUS — the body this scene exists for. He greets, stares, takes
         the hand and weeps at a likeness he never converts into a fact. He
         stands INBOARD of the beggar, which is why his own poses need no
         mirror: every one of them reaches and looks to screen right, and the
         man he is reaching for is on his right. */
      philoetius: () => {
        if (t < PHI_IN) return;
        const p = blk.philoetius, s = st.philoetius || {};
        const wondering = t >= WONDER && t < CLASP;
        const clasping  = t >= CLASP && t < GRIEF;
        const grieving  = t >= GRIEF && t < 60;
        const steadied  = t >= 60;
        placeFigure(offctx, W, H, philoetius, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.44) % 4 : breath,
            band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "phi_greeting"),
            gaze: s.gaze || { x:.30, y:.06 },
            browUp:   clasping ? .74 : wondering ? .86 : grieving ? .38 : .46,
            browKnit: clasping ? .52 : grieving ? .52 : steadied ? .46 : .12,
            frown:    clasping ? .46 : grieving ? .36 : 0,
            eyeNarrow:clasping ? .34 : 0,
            eyeWide:  wondering ? .62 : steadied ? .34 : .10,
            jaw:      wondering ? .24 : grieving ? .46 : .12,
            smile:    t >= PHI_HAIL && t < WONDER ? .34 : 0,
            cheek:    t >= PHI_HAIL && t < WONDER ? .28 : .14,
            mouthAsym:grieving ? .24 : 0,
            status:   steadied  ? "THEN I AM READY"
                    : grieving  ? "THEY EAT HIS HERD"
                    : clasping  ? "YOU ARE HIS SHAPE"
                    : wondering ? "WHO DOES HE LOOK LIKE"
                    : t >= PHI_HAIL ? "WELCOME, FATHER" : "THE CATTLE ARE IN",
            progress: clamp01(0.16 + 0.78 * (t / D)),
          },
        });
      },
    };
    for (const who of Object.keys(draw).sort((a, b) => blk[a].d - blk[b].d)) draw[who]();

    /* --- 3. THE DROVES, called out (note F). One window of the court diagram,
       blitted 1:1 over the cropped ceiling: the beasts are outside this room
       and are shown as what they are — three files converging on the court
       gate — with the window moving from drove to drove on the same clock the
       herdsmen walk in on. -------------------------------------------------- */
    {
      const view = courtViewAt(t);
      if (view){
        const pose = view === "massed" ? "massed" : "arriving";
        const state = {
          pose, t: breath,
          status: view === "massed" ? "ALL THREE DROVES" : "ARRIVING",
          progress: clamp01(0.18 + 0.76 * (t / D)),
        };
        detailField(offctx, W, H, COURT_DST);
        plate(offctx, W, H, livestock, COURT_CW, COURT_CH,
              COURT_WIN[view], COURT_DST, state, `drove|${pose}`);
      }
    }
  },
};
export default scene;

/* named binding so OD-B20-S04 can `import { exitOccupancy as INITIAL }`.
   S04 plays in this same hall and every station below is a megaron station, so
   it needs no translation table at all — only the suitors added to it. */
export const exitOccupancy = scene.exitOccupancy;
