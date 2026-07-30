/* ============================================================
   SCENE  OD-B17-S07 — Eumaeus Leaves the Hall
   Book XVII, scene 7 of 7 — the last frame of the book. ADDITIVE: this file
   creates no asset and modifies none; it only COMPOSES modules that already
   exist. Shape copied from the reference scene scenes/OD-B16-S03.mjs and, for
   this room at this hour, from its own predecessor scenes/OD-B17-S06.mjs.
   Everything S05/S06 settled about the megaron is inherited rather than
   re-decided: the same hall asset, MAN = 0.36, the portrait figure box
   (FIG_AR / FIG_PAD / FIG_FLOOR), the same HALL_LAYERS list, and the fallen
   footstool at the exact screen point S05 measured and S06 re-used.

   ROOM. location.megaron-hall — ONE hall with a state channel. The atlas asks
   for `location.night-palace-hall`; per the hall module's own header that name
   IS this room, and the only question is which row of MODES to pass.

   IT IS PASSED `feast`, NOT `night`, AND THE HOUR IS CARRIED BY THE ACTION.
   MODES.night is written for Book XX: doors:"shut", arms:false, litter:"none",
   lift:1, floorLift:1. Every one of those is false at Od. 17.599. The great
   doors cannot be shut in a scene whose whole event is a man walking out of
   them; the arms are still on the walls (Telemachus does not take them down
   until XIX.1–33, and XXII turns on their being there); the litter of the
   afternoon's feast is on the floor and the thrown stool is still lying in it,
   which is this scene's inherited continuity; and lift:1 + floorLift:1 would
   push the whole room two ink levels down — the exact failure the brief warns
   about, a hall that prints as one near-black mass. So the room stays the
   lift-0 `feast` room S04–S06 painted, the suitors are still at their food, and
   EVENING is carried by what happens in it: the queen goes up her stair, the
   swineherd goes out the door, and the frame empties down to three men.

   CONTINUITY IN — computed, and it needs no translation. S06 exports
   exitOccupancy = { eumaeus:"bench_r2", odysseus:"threshold",
   telemachus:"table_l", antinous:"table_r", penelope:"pillar_r" }. All five are
   megaron stations and this scene plays in the megaron, so NOBODY IS DROPPED
   and INITIAL is that object verbatim.

   WHO IS PAINTED, AND WHO IS ONLY CARRIED.
     · EUMAEUS, TELEMACHUS, ODYSSEUS and ANTINOUS are painted — the three the
       atlas requires, plus the suitor, because the closing beat is "the beggar
       remains in the palace under the suitors' gaze" and a gaze needs an eye in
       the frame. Antinous is the right one: he is already at table_r in the
       inherited occupancy, and the stool on the floor is the stool HE threw.
     · PENELOPE is carried and NOT painted, the S06 move inverted. S06 brought
       her down to pillar_r; Homer keeps her upstairs for the whole of Book XVII
       (17.505 she sends for the swineherd from her own room), and by XVIII.206
       she has to come down again, which means she must be up. So her one move
       here is the withdrawal pillar_r -> stair_up (t 2–10) and the exit
       occupancy records her off the hall floor at the foot of her own stair.
       She is not drawn: this frame is the prince's table, the sill and the
       door, and a fifth body left standing at stair_up (sx 938) would be welded
       to the suitor who moves down to bench_r2 (sx 888) for no beat at all.

   THE FOUR BODIES AND THE PAPER BETWEEN THEM (W 1120 x H 760, MAN 0.36):
     eumaeus    bench_l2  z .76  sx 232  feet 640  crown 350   the swineherd
     telemachus table_l   z .70  sx 319  feet 618  crown 337   the prince
     odysseus   threshold z .16  sx 560  feet 428  crown 227   the beggar, the sill
     antinous   bench_r2  z .76  sx 888  feet 640  crown 350   the suitors' eye
   The left pair is the S05/S06 arrangement — the swineherd AT THE PRINCE'S
   HAND, 87px apart, the nearer man overlapping the farther by about 20px the
   way two men in one conversation do. The centre is 241px of empty lane and
   floor between the prince's table and the sill; the right is 328px between the
   sill and the suitor, who is the nearest and biggest body in the frame and is
   looking up the whole length of it at the smallest. Nobody is coincident and
   nobody is closer to anyone than a man talking to him would be.

   ANTINOUS DOES NOT STAY AT HIS TABLE, AND THE REASON IS THE PLATE. He is
   inherited at table_r and draft 1 left him there; two drafts were read back
   off the render before he landed. At table_r (sx 801, feet 618) his shins and
   the thrown footstool (sx 744–824, floor 667) print as one black clot — the
   fixture-fusing-under-the-legs failure with the fixture merely low. Draft 2
   moved him to pillar_r, which clears the stool by 143px, and that failed for a
   different reason: the hall draws each pillar a BASE, an ink-4 block at
   sx 702–780 / y 506–530, exactly across the ankles of a body on that mark.
   S06 could stand Penelope there because a gown to the floor reads as a hem in
   front of a block; antinous.mjs is bareLegs:true and his legs disappear into
   it. So he goes to bench_r2 (t 16–24), the near corner Eumaeus vacates at
   t 15 — clear of the stool, clear of the pillar bases, and 50px clear of the
   stair, whose flight rises to the RIGHT of sx 938. The action it buys is the
   right one anyway: the man who threw that stool leaves his food and comes down
   to the near end of his host's hall, where he can see the door and the sill at
   once, and he is still looking at the sill when the scene ends. He is the
   nearest and largest body in the last frames and the beggar is the smallest,
   which is the whole of the last beat.

   THE WALKS ACROSS THIS FLOOR, AND WHY THESE ROUTES. (Two are the swineherd's;
   the suitor's short move up the right-hand wall is argued above.)
     1 · bench_r2 -> bench_l2, t 2–15. S06's crossing, reversed: a straight line
         at constant plan z .76, i.e. NEARER the camera than the hearth ring
         (plan z .445–.595). His feet run along screen y 640, 87px below the
         hearth's own base at 553, so when he passes the fire at sx 475–645 he
         passes in FRONT of it and the depth queue draws him there. S06 measured
         this route and it is not re-argued. He also passes in front of Antinous
         at sx 801 around t 6, 22px nearer than the suitor's feet — a servant
         crossing in front of a seated man, which is what it looks like.
     2 · bench_l2 -> door_main, t 40–56, THE DEPARTURE. This is the walk the
         scene is named for and it is the one piece of blocking that had to be
         solved rather than inherited. door_main projects to sx 560, the same
         spine as `threshold`, 19px shallower: a body that arrives there stands
         inside the beggar's silhouette. THE FIX IS NOT A NEW STATION — S06
         already showed that inventing `sill_beside` poisons the handoff with a
         name megaron does not have. The fix is that he goes THROUGH the door:
         `actor.hide` fires at GONE = 49, by which time the walk has him at
         sx 462 / feet 499 with 22px of clear paper between him and the beggar,
         and he is never painted again. The move still runs to door_main at t 56,
         so the handoff records WHICH DOOR HE USED, and every rendered frame has
         him either clear of the sill or gone. The route itself climbs the LEFT
         side of the room: at the hearth's own depths (z .445–.595) it is at
         plan x .268–.298, well outside the fire's plan x .395–.605, so he never
         walks through the flames. At t 46 he passes pillar_l (sx 379) — one
         stride against a light ink-2 shaft with hard edges, which is a man
         passing a column.
         THE ONE THING THIS ROUTE CANNOT AVOID, and it is the same class of thing
         S06 accepted about the fire: for about four seconds, t 42.5–46.2, his
         screen x runs through 264–374, which is the band TELEMACHUS occupies at
         his table. He is at plan z .73 -> .55 there and the prince is at .70, so
         for most of it the prince is NEARER and is drawn in front — it is a
         servant walking away up the hall and passing behind the man he was just
         talking to, which is what leaving a table looks like from this camera.
         It is four seconds of a walk and not a resting mark, and the plates are
         taken either side of it. The gap he has to thread is real and it is
         narrow: the prince's right edge is sx 374 and the beggar's left edge is
         sx 522, 148px for a 90px body, so the ONE window where he stands clear
         of both is sx 419–477, i.e. t 48–49. That is exactly where PASS = 46
         puts the raised hand and where the plate is taken.

   THE LEAVE-TAKING IS TAKEN IN PASSING, WHICH IS THE POINT. Beat 3 asks for
   Eumaeus to take leave of the beggar and the prince "without recognizing their
   bond". The prince gets a proper parting — they are 87px apart at the table and
   there is a paired station for it. The beggar gets a hand raised from the lane
   at PASS = 45 and nothing more: there is no station beside the sill, the man on
   it will not get up (S06), and a swineherd does not embrace a stranger. So the
   one farewell in the Odyssey that ought to be an embrace is a `wave` thrown
   sideways at a heap of rags on his master's own threshold. Nothing in the frame
   marks it. That is the scene.

   TONE AND OVERPAINT. `feast` is a lift-0 state: light planes with dark accents,
   the only near-black masses being the seven flames, the doorway furniture and
   the stair's upper leaf. HAND-DRAWN ctx OVERPAINT IN THIS FILE IS ZERO — the
   rig draws the four bodies, the room draws itself, the prop draws itself. No
   text is drawn by this file at any size, and nothing here draws a full-width
   horizontal band.

   Beats (Od. 17.591–606):
     1. At night Eumaeus prepares to return to the farm and asks Telemachus for instructions.
     2. Telemachus tells him to come back at dawn with news.
     3. Eumaeus takes leave of the disguised Odysseus and the prince without recognizing their bond.
     4. The beggar remains in the palace under the suitors' gaze.

   Verify:  node harness/render-scene.mjs scenes/OD-B17-S07.mjs --t 32  (the order given)
            node harness/render-scene.mjs scenes/OD-B17-S07.mjs --t 48  (passing the sill)
            node harness/render-scene.mjs scenes/OD-B17-S07.mjs --t 54  (the beggar, watched)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import antinous   from "../assets/character/antinous.mjs";
import stool      from "../assets/prop/thrown-footstool.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 60;

/* S06's layer list, unchanged and for its own reasons:
   `furniture` out (it builds a 41px slab at the exact stations three of these
   bodies rest on — the fixture-fusing-under-the-legs failure), `maidsdoor` out
   (a solid dark leaf at sx 881, 26px from Antinous' silhouette, and nobody uses
   it before XXII), `throne` and `axes` out. `racks` in: the arms are still on
   these walls in Book XVII. `stair` in: the queen has just gone up it, and its
   flight rises to the RIGHT of sx 938 so nothing of anyone's touches it. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "stair","pillars","lane","hearth","litter"];

/* --- SIZES: one man, times the plan's own falloff (S02–S06 all use this) --- */
const MAN = 0.36;
/* --- THE BOX A BODY IS DRAWN IN (S04–S06's reasoning, unchanged) -----------
   placeInstance() hands a module a box of the STAGE's aspect (1.474 wide) and
   every width-relative decoration — a herdsman's staff, a cloak — is stretched
   with it. So figures are drawn into the PORTRAIT box makeRestage() uses for
   every character in the atlas, and blitted. FIG_FLOOR is the rig's own ankle
   line: the box bottom is not the floor. */
const FIG_AR    = 660 / 880;
const FIG_PAD   = 0.06;
const FIG_FLOOR = 0.90;

/* blit a module into a box of a chosen aspect, anchored by a point inside it.
   sigExtra is REQUIRED: keyedModuleCanvas caches on pose/band/t only. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                   state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* --- CONTINUITY IN — no translation needed; all five of S06's stations are
   megaron stations and this scene plays in the megaron. Nobody dropped. */
import { exitOccupancy as INITIAL } from "./OD-B17-S06.mjs";

/* --- THE CLOCK ------------------------------------------------------------ */
const ASK   = 20;   // "what would you have me do, and when shall I come back?"
const ORDER = 30;   // "at dawn, with news — and drive up the best of the swine"
const LEAVE = 40;   // he takes his leave of the prince and starts up the hall
const PASS  = 46;   // passing the sill: a hand raised at a heap of rags
const GONE  = 49;   // out through the great doors; not painted again
const WATCH = 50;   // the suitor's eye settles on the man on the sill

/* --- BLOCKING. Stations, not coordinates. --------------------------------- */
const MOVES = [
  // the queen goes back up to her own room (Od. 17.505 keeps her there all book)
  { who:"penelope", from:"pillar_r", to:"stair_up",  t0: 2, t1:10 },
  // the swineherd leaves her corner and comes to the prince's hand
  { who:"eumaeus",  from:"bench_r2", to:"bench_l2",  t0: 2, t1:15 },
  // and then out. He is hidden at GONE=48; the move runs on so the handoff
  // records the door he used.
  { who:"eumaeus",  from:"bench_l2", to:"door_main", t0:LEAVE, t1:56 },
  // the suitor moves down to the near end of the hall, into the corner the
  // swineherd has just left, where he can watch the door and the sill at once.
  // MEASURED, not staged for taste, and it cost two drafts:
  //   · table_r (sx 801, feet 618) is where he is inherited, and there his
  //     shins and the fallen stool (sx 744–824, floor 667) print as ONE black
  //     clot — the fixture-under-the-legs failure with the fixture merely low.
  //   · pillar_r (sx 741, feet 524) clears the stool by 143px but the hall's
  //     own pillar BASE is an ink-4 block at sx 702–780, y 506–530, i.e.
  //     straight across the ankles of anyone standing there. S06 could put
  //     Penelope on that mark because a gown to the floor reads as a hem in
  //     front of a block; antinous.mjs is bareLegs:true and his legs simply
  //     vanish into it.
  //   · bench_r2 (sx 888, feet 640) is clear of both, and it is the corner
  //     Eumaeus vacates at t 15, so it costs the room nothing.
  { who:"antinous", from:"table_r",  to:"bench_r2",  t0:16, t1:24 },
];

/* --- THE FALLEN STOOL: S05's numbers, inherited through S06 unchanged ------
   the prop module's POSE table, which it does not export: cx/cy are the box
   fractions its transform origin lands on, s is the half-width as a fraction of
   the box width, floor is the y its own broken ground line is drawn at. Nobody
   has picked it up since Antinous threw it, and once he has left his table for
   the near bench it lies alone on open boards, clear of his silhouette and
   nearer the camera than every pair of feet in the room. */
const STOOL_POSE = { evidence:{ cx:0.47, cy:0.453, s:0.262, floor:0.680 } };
const STOOL_HALF = 0.036;                 // 40px of half-width, as in S05/S06
const STOOL_AR   = 660 / 880;
const STOOL_AT   = { x:.700, floorY:.878 };   // where S05 left it, unchanged

function placeStool(offctx, W, H, t){
  const P = STOOL_POSE.evidence, A = STOOL_AT;
  const wFrac = STOOL_HALF / P.s;
  const hFrac = wFrac * W / (STOOL_AR * H);
  const y = A.floorY - (P.floor - P.cy) * hFrac;
  const left = A.x - P.cx * wFrac, top = y - P.cy * hFrac;
  const w = wFrac * W, h = hFrac * H, pad = 0.10;
  const cv = keyedModuleCanvas(stool, w, h, {
    mode:"evidence", t, status:"EVIDENCE",
    progress: clamp(0.10 + 0.9 * (t / D), 0, 1),
  }, "stool|evidence", 0.895, pad);
  offctx.drawImage(cv, left * W - pad * w, top * H - pad * h);
}

export const scene = {
  id:"OD-B17-S07",
  title:"Eumaeus Leaves the Hall",
  book:17,
  plan:"megaron",
  duration:D,
  beats:[
    "At night Eumaeus prepares to return to the farm and asks Telemachus for instructions.",
    "Telemachus tells him to come back at dawn with news.",
    "Eumaeus takes leave of the disguised Odysseus and the prince without recognizing their bond.",
    "The beggar remains in the palace under the suitors' gaze.",
  ],
  exitState:"Evening in the great hall at Ithaca, the same room and the same fire as OD-B17-S05 and S06, and the house is one man emptier. Penelope has gone back up to her own chamber — she left the right-hand pillar early and is off the hall floor at the foot of her stair, plan (.92,.66), which is where Book XVIII will have to fetch her down from. Eumaeus came across the whole floor from the queen's corner to the prince's table, said he had to be back with his pigs before dark, and asked Telemachus what he wanted done; Telemachus told him to come at dawn with whatever news the town had and to bring up the best of the swine, and to leave the rest of it — the beggar, the suitors, the appointment — to him. Then the swineherd took his leave. HE IS GONE: he went up the left side of the hall, past the pillar, raised a hand to the ragged stranger sitting on the sill as he passed him, and went out through the great doors at plan (.50,.10). Any scene that follows must DROP eumaeus from its occupancy — he is on the road to the farm and will not be in this room again until Book XX. He took his leave of two men and did not know they were father and son, and he did not know that the one he waved at was his master; nothing in the room marked it. What is left in the hall is three: odysseus is still at threshold, plan (.50,.16), guise beggar, disguise wholly intact, on the ash sill he has not risen from in three scenes and the station he will stand on to shoot in Book XXI; Telemachus is at table_l where he has been since S04, keeping his mouth shut as instructed; and Antinous has left his food and is standing at the near end of the hall at bench_r2, plan (.84,.76) — the corner Eumaeus left at the start of the scene — with nothing to do but look up the room at the beggar, still unanswered for the stool, which is still lying out on the open boards nearer the camera than any of them, where it fell. The suitors have turned back to their food and their music and their looking, and it is the beggar they are looking at. The doors are open, the arms are on the walls, the litter is on the floor, and the appointment S06 made for dusk has not been kept yet.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ eumaeus:"already at bench_r2 from OD-B17-S06 (the queen's corner); crosses to bench_l2, t 2–15",
              telemachus:"already at table_l; does not move",
              odysseus:"already on the sill at threshold (guise:beggar); does not rise, and there is no move for him in MOVES",
              antinous:"already at table_r; moves down to the near corner Eumaeus vacates, table_r -> bench_r2 t 16–24, and stays there — he is the eye the last beat needs",
              penelope:"already at pillar_r; withdraws up her own stair, pillar_r -> stair_up t 2–10, and is NOT painted",
              stool_01:"already on the floor at the point OD-B17-S05 measured and S06 re-used (mode:evidence)" },
  exits:{ eumaeus:"bench_l2 -> door_main, t 40–56; hidden at t 48 as he goes through the leaf, " +
                  "44px clear of the beggar at the moment he stops being painted. The move completes " +
                  "so the handoff names the door. HE IS OUT OF THE HOUSE — drop him downstream.",
          penelope:"pillar_r -> stair_up, t 2–10; off the hall floor, up to her chamber, unpainted" },
  walkable:"megaron zones.walkable, MINUS the hearth ring (plan x .395–.605, z .445–.595), " +
           "MINUS the near spine (the master's ground), MINUS the stair's footprint. Resting " +
           "ground in this scene is bench_l2, table_l, threshold and bench_r2. Three paths are " +
           "walked: bench_r2 -> bench_l2 (straight across plan z .76, in FRONT of the fire), " +
           "bench_l2 -> door_main (up the LEFT side, plan x .268–.298 at the fire's own depths, " +
           "so outside the flames, and past pillar_l in one stride) and table_r -> bench_r2 " +
           "(a short move NEARER down the right-hand wall, nowhere near the ring or the spine).",
  depthOrder:"one queue, sorted by the plan's own z: odysseus (.16) behind telemachus (.70) " +
             "behind antinous (.70 -> .76, so he comes FORWARD in the queue as he moves down " +
             "the hall) and eumaeus (.76, who on the departure walk rises through .76 -> .43 " +
             "and correctly falls back behind the near bodies) behind the fallen stool (.78, so " +
             "the slab lies nearer than every pair of feet in the room). No instrument or fx is " +
             "laid over the queue: this scene has none.",
  gazeTargets:{ eumaeus:"the floor ahead while he crosses, then the prince beside him, then the " +
                        "prince's hands as he is given the order, then — once, from the middle of " +
                        "the lane — the beggar on the sill, and then the open door",
                telemachus:"his swineherd coming across the floor, then his own hands, then the " +
                           "man going out, then the sill, then the suitors watching the sill",
                odysseus:"the prince's table while the two of them talk, then the one man in the " +
                         "house who has been kind to him walking out of it, then Antinous",
                antinous:"the conference at the prince's table as he moves down the hall, then " +
                         "the door the servant leaves by, then the beggar, and from t 50 he does " +
                         "not stop looking at the beggar" },
  attachments:[
    { at: 0,     who:"stool_01", change:"unclaimed on the floor, evidence, exactly where OD-B17-S05 left it" },
    { at:16,     who:"antinous", change:"stands away from table_r; the stool he threw is left on the boards behind him" },
    { at: 0,     who:"eumaeus",  change:"his staff and satchel are with him — he is dressed to walk out" },
    { at:LEAVE,  who:"eumaeus",  change:"he stands away from the prince's table and starts up the hall" },
    { at:GONE,   who:"eumaeus",  change:"hidden — through the door leaf and out of the room" },
  ],
  sound:[
    { at: 3, source:"stair_up",  cue:"a woman's door closing above the hall, and a bolt" },
    { at: 8, source:"hearth",    cue:"the fire, and the suitors' noise at both walls" },
    { at:ASK,source:"bench_l2",  cue:"the swineherd, low, at the prince's shoulder: I must be back before dark" },
    { at:ORDER,source:"table_l", cue:"Telemachus: at dawn, with news, and bring up the best of the swine" },
    { at:LEAVE,source:"bench_l2",cue:"a stool pushed back; a staff taken up off the boards" },
    { at:PASS,source:"threshold",cue:"one word thrown sideways at the sill, and nothing answered aloud" },
    { at:GONE,source:"door_main",cue:"the door leaf, and footsteps going away down the outer court" },
    { at:WATCH,source:"bench_r2",cue:"a lyre starting again, and under it men not talking about the beggar" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.500,y:.564}, scale:.264, band:"threeq", pose:"crouch" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.793,y:.842}, scale:.381, band:"threeq", pose:"arms_crossed" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.285,y:.813}, scale:.369, band:"threeq", pose:"torso_open" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.793,y:.842}, scale:.381, band:"threeq", pose:"walk_neutral" },
    { asset:"prop.thrown-footstool", instance:"stool_01",
      anchor:{x:.700,y:.878}, scale:.137 },
  ],

  timeline:[
    // 0 — the queen goes up; the swineherd leaves her corner
    { op:"actor.pose", target:"eumaeus",    at: 0.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eumaeus",    at: 0.0, args:{ gaze:{ x:-.42, y:.06 } } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"telemachus", at: 0.0, args:{ gaze:{ x:.44, y:.08 } } },
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"crouch" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0, args:{ gaze:{ x:-.30, y:.10 } } },
    { op:"actor.pose", target:"antinous",   at: 0.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"antinous",   at: 0.0, args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"prop.state", target:"stool_01",   at: 0.0, args:{ mode:"evidence" } },
    // 1 — he comes to the prince's hand and asks for his orders
    { op:"actor.gaze", target:"telemachus", at: 8.0, args:{ gaze:{ x:-.34, y:.10 } } },
    { op:"actor.pose", target:"antinous",   at:16.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"antinous",   at:16.0, args:{ gaze:{ x:-.36, y:-.04 } } },
    { op:"actor.pose", target:"antinous",   at:24.0, args:{ pose:"arms_crossed" } },
    { op:"actor.pose", target:"eumaeus",    at:15.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"eumaeus",    at:15.0, args:{ gaze:{ x:.30, y:-.02 } } },
    { op:"actor.pose", target:"telemachus", at:16.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:16.0, args:{ gaze:{ x:-.28, y:.04 } } },
    { op:"actor.pose", target:"eumaeus",    at:ASK,  args:{ pose:"palm_up_question" } },
    { op:"actor.gaze", target:"eumaeus",    at:ASK,  args:{ gaze:{ x:.26, y:-.04 } } },
    { op:"actor.pose", target:"antinous",   at:26.0, args:{ pose:"skepticism" } },
    { op:"actor.gaze", target:"antinous",   at:26.0, args:{ gaze:{ x:-.40, y:.04 } } },
    { op:"actor.gaze", target:"odysseus",   at:24.0, args:{ gaze:{ x:-.34, y:.12 } } },
    // 2 — dawn, with news, and the best of the swine
    { op:"actor.pose", target:"telemachus", at:ORDER,args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"telemachus", at:ORDER,args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"actor.pose", target:"eumaeus",    at:ORDER,args:{ pose:"repeated_nod" } },
    { op:"actor.gaze", target:"eumaeus",    at:ORDER,args:{ gaze:{ x:.22, y:.16 } } },
    { op:"actor.pose", target:"telemachus", at:36.0, args:{ pose:"offering_hand" } },
    { op:"actor.pose", target:"eumaeus",    at:36.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"eumaeus",    at:36.0, args:{ gaze:{ x:.28, y:-.02 } } },
    // 3 — the leave-taking, taken in passing
    { op:"actor.pose", target:"eumaeus",    at:LEAVE,args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eumaeus",    at:LEAVE,args:{ gaze:{ x:.18, y:-.14 } } },
    { op:"actor.pose", target:"antinous",   at:LEAVE,args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"antinous",   at:LEAVE,args:{ gaze:{ x:-.46, y:-.06 } } },
    { op:"actor.pose", target:"telemachus", at:42.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"telemachus", at:42.0, args:{ gaze:{ x:.10, y:-.16 } } },
    { op:"actor.pose", target:"eumaeus",    at:PASS, args:{ pose:"wave" } },
    { op:"actor.gaze", target:"eumaeus",    at:PASS, args:{ gaze:{ x:.34, y:-.10 } } },
    { op:"actor.gaze", target:"odysseus",   at:PASS, args:{ gaze:{ x:-.36, y:.16 } } },
    { op:"actor.hide", target:"eumaeus",    at:GONE, args:{} },
    // 4 — the beggar remains, and is looked at
    { op:"actor.pose", target:"antinous",   at:WATCH,args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"antinous",   at:WATCH,args:{ gaze:{ x:-.24, y:-.06 } } },
    { op:"actor.gaze", target:"odysseus",   at:WATCH,args:{ gaze:{ x:.40, y:.06 } } },
    { op:"actor.pose", target:"telemachus", at:52.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"telemachus", at:52.0, args:{ gaze:{ x:.42, y:-.04 } } },
    { op:"actor.pose", target:"antinous",   at:56.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus",   at:56.0, args:{ gaze:{ x:.14, y:.14 } } },
    { op:"timeline.capture", target:"OD-B17-S07", at:58.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s   = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);

    /* the field first — the hall, the doors, the sill, the stair, the fire, the
       litter. ONE state for the whole scene: the same lift-0 feast S04 opened,
       for the reasons in the header. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"feast", t:0.55, layers:HALL_LAYERS,
              progress:Math.min(.94, .20 + .74*(t/D)), status:"MISRULE" },
    });

    /* one queue, sorted by the plan's own depth */
    const queue = [];
    const add = (d, draw) => queue.push({ d, draw });

    /* --- ODYSSEUS: on the ash sill, and he does not get up --------------- */
    {
      const p = blk.odysseus, c = s.odysseus || {};
      const conferring = t >= 16 && t < LEAVE;
      const farewell   = t >= PASS && t < WATCH;
      const watched    = t >= WATCH;
      const pose = c.pose || "crouch";
      add(p.d, () => place(offctx, W, H, odysseus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"ody|" + pose + "|" + (watched?"g":farewell?"f":conferring?"c":"w"),
        state:{
          t:0.5, guise:"beggar", band:"threeq", pose,
          gaze: c.gaze || { x:-.30, y:.10 },
          browUp:   farewell ? .44 : conferring ? .20 : .12,
          browKnit: farewell ? .38 : watched ? .30 : .24,
          eyeNarrow:watched ? .48 : conferring ? .34 : .18,
          eyeWide:  farewell && t < PASS + 3 ? .20 : 0,
          frown:    farewell ? .30 : 0,
          smile:    0,
          jaw:      0,
          mouthAsym:watched ? .20 : .10,
          status:   watched    ? "UNDER THEIR EYES"
                  : farewell   ? "HE DOES NOT KNOW WHO HE IS LEAVING"
                  : conferring ? "HIS SON IS GIVING THE ORDERS"
                               : "HE KEEPS THE SILL",
          progress: Math.min(.96, .14 + .78*(t/D)),
        },
      }));
    }

    /* --- TELEMACHUS: the prince gives an order for the first time -------- */
    {
      const p = blk.telemachus, c = s.telemachus || {};
      const receiving = t >= 16 && t < ORDER;
      const ordering  = t >= ORDER && t < LEAVE;
      const parting   = t >= LEAVE && t < WATCH;
      const after     = t >= WATCH;
      const pose = c.pose || "torso_open";
      add(p.d, () => place(offctx, W, H, telemachus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"tel|" + pose + "|" + (after?"a":parting?"p":ordering?"o":receiving?"r":"w"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:.44, y:.08 },
          browUp:   receiving ? .34 : after ? .30 : .20,
          browKnit: ordering ? .40 : after ? .44 : .16,
          eyeNarrow:ordering ? .32 : after ? .38 : .12,
          eyeWide:  parting ? .18 : 0,
          frown:    after ? .22 : 0,
          smile:    parting ? .16 : 0,
          jaw:      ordering && t < ORDER + 5 ? .34 : 0,
          mouthAsym:after ? .18 : 0,
          status:   after     ? "THEY ARE ALL LOOKING AT HIS FATHER"
                  : parting   ? "GO ON, THEN"
                  : ordering  ? "AT DAWN, WITH NEWS"
                  : receiving ? "HIS OWN SWINEHERD, ASKING HIM"
                              : "THE PRINCE'S TABLE",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* --- ANTINOUS: the eye the last beat needs -------------------------- */
    {
      const p = blk.antinous, c = s.antinous || {};
      const rising   = t >= 16 && t < 24;
      const noticing = t >= 26 && t < LEAVE;
      const watching = t >= WATCH;
      const pose = c.pose || "arms_crossed";
      add(p.d, () => place(offctx, W, H, antinous, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"ant|" + pose + "|" + (watching?"k":noticing?"n":rising?"r":"w"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:-.30, y:.06 },
          browUp:   noticing ? .28 : .12,
          browKnit: watching ? .52 : noticing ? .34 : .22,
          eyeNarrow:watching ? .46 : .24,
          frown:    watching ? .24 : 0,
          smile:    noticing ? .18 : 0,
          mouthAsym:watching ? .48 : .30,
          status:   watching ? "AND THE BEGGAR IS STILL HERE"
                  : noticing ? "WHAT IS THE BOY TELLING HIM"
                  : rising   ? "HE WANTS A BETTER LOOK"
                             : "AT HIS OWN TABLE",
          progress: Math.min(.96, .16 + .76*(t/D)),
        },
      }));
    }

    /* --- EUMAEUS: across, then out. Not painted once he is through the
       door — see the header: door_main is the beggar's own spine. --------- */
    if ((s.eumaeus || {}).visible !== false){
      const p = blk.eumaeus, c = s.eumaeus || {};
      const crossing = t < 15;
      const asking   = t >= ASK && t < ORDER;
      const told     = t >= ORDER && t < LEAVE;
      const going    = t >= LEAVE;
      const pose = c.pose || "walk_neutral";
      add(p.d, () => place(offctx, W, H, eumaeus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"eum|" + pose + "|" + (going?"g":told?"t":asking?"a":crossing?"c":"w"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:-.42, y:.06 },
          browUp:   asking ? .46 : going ? .30 : .26,
          browKnit: told ? .38 : going ? .22 : .18,
          eyeNarrow:told ? .30 : .12,
          eyeWide:  asking && t < ASK + 4 ? .26 : 0,
          frown:    crossing ? .18 : 0,
          smile:    going ? .22 : told ? .14 : 0,
          jaw:      asking && t < ASK + 5 ? .42 : 0,
          mouthAsym:told ? .16 : 0,
          status:   going    ? "BACK BEFORE DARK"
                  : told     ? "AT DAWN, THEN"
                  : asking   ? "WHAT WOULD YOU HAVE ME DO"
                  : crossing ? "HE IS WANTED BACK AT THE FARM"
                             : "AT THE PRINCE'S HAND",
          progress: Math.min(.96, .20 + .72*(t/D)),
        },
      }));
    }

    /* --- THE STOOL: nobody has picked it up ----------------------------- */
    add(0.78, () => placeStool(offctx, W, H, t));

    queue.sort((a, b) => a.d - b.d).forEach(j => j.draw());
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. NOTE: eumaeus resolves to
   `door_main` here because that is the door he went out of; he is NOT in the
   room any more and whatever scene follows must drop him. */
export const exitOccupancy = scene.exitOccupancy;
