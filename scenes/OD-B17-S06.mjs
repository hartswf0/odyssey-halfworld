/* ============================================================
   SCENE  OD-B17-S06 — Penelope Summons the Stranger
   Book XVII, scene 6 of 7. ADDITIVE: this file creates no asset and modifies
   none; it only COMPOSES modules that already exist. Shape copied from the
   reference scene scenes/OD-B16-S03.mjs and from its own predecessor
   scenes/OD-B17-S05.mjs, which solved this room, this hour and these bodies one
   minute earlier. Everything S05 argued about the megaron is inherited without
   re-deciding it: the same hall asset in the same `feast` state, MAN = 0.36, the
   portrait figure box (FIG_AR / FIG_PAD / FIG_FLOOR), the CROWN/BODY fractions,
   and the fallen footstool at the exact screen point S05 left it lying on.

   ROOM. location.megaron-hall, state "feast" — ONE hall with a state channel;
   no second hall is built or cast. It is still the same afternoon: the tables
   are still laden, the fire is still high, the litter is still on the floor.
   Every body resolves through scenes/_plans/megaron.mjs by station NAME, so the
   sill this beggar will not get up from is the sill he shoots from in XXI.

   CONTINUITY IN — computed, and it needs no translation. S05 exports
   exitOccupancy = { eumaeus:"bench_l2", odysseus:"threshold", telemachus:
   "table_l", antinous:"table_r" }. All four are megaron stations and this scene
   plays in the megaron, so nobody is dropped and INITIAL is that object plus ONE
   body the story brings into the room: penelope, entering at "stair_up", the
   station OD-B23-S02 already established as the foot of the queen's own stair
   (its HOUSE_TO_HALL map is `threshold_r -> stair_up`). ANTINOUS IS CARRIED BUT
   NOT CAST: he is still at his table — Book XVII never sends him out — so
   dropping him would hand S07 a hall with a hole in it. He is simply not painted
   in this frame, which is the queen's corner and the door; the atlas does not
   ask for him here, and the one thing that must survive is his station.

   THE FOUR BODIES, AND WHY THEY STAND WHERE THEY STAND. Four bodies at four
   depths and four screen x's, which is the whole of the staging problem in a
   room this size:

     telemachus  table_l    z .70   x 319   feet 618   the prince at his table
     odysseus    threshold  z .16   x 560   feet 428   the beggar on the ash sill
     penelope    pillar_r   z .44   x 741   feet 524   the queen at the pillar
     eumaeus     bench_r2   z .76   x 888   feet 640   the swineherd, her runner

   · PENELOPE STANDS AT THE PILLAR, not at the stair she comes down. Od. 1.333
     and 17.36 both put her beside the pillar of the roof with her veil held up,
     and the pillar is a station this plan already owns. The reason it is
     pillar_r and not stair_up is measured, not literary: stair_up projects to
     screen x 938, and the only clean crossing of this floor (see the ROUTE note)
     lands the swineherd at bench_r2, screen x 888 — fifty pixels away, two
     286px bodies welded into one mass. From pillar_r she is 147px from him and
     116px deeper, so his crown (435) sits below her hem (524) and neither
     silhouette touches the other: the paper between them is 56px wide. The
     pillar itself is drawn at ink 2 — a LIGHT shaft with hard edges at x 712 and
     770, both inside her own silhouette, so what survives above her head is a
     column and a capital, and what she reads as is a woman standing against it.
   · SHE ARRIVES. penelope enters on the descent stair_up -> pillar_r, t 1–9,
     which is why she is in INITIAL at stair_up: the move is the entrance, and it
     is over before the swineherd is anywhere near that corner.
   · ODYSSEUS DOES NOT MOVE, AND THAT IS THE SCENE. He is on the sill in `crouch`
     — S05's last pose for him — from the first frame to the last. The content of
     beat 2 is a refusal to cross his own floor: he will not come to the queen
     while the hall is full, and there is no move in MOVES for him. THE MESSAGE
     IS CARRIED BY GAZE AND VOICE, NOT BY A SECOND WALK. Homer sends Eumaeus up
     the hall to him (17.543) and there is no station beside the sill to send him
     to: `door_main` is x .50 like `threshold` itself and would stack the runner
     on the man he is talking to, and `axe_first` is the same spine one step
     nearer and would simply cover him. Inventing `sill_beside` in a local plan
     is worse than either, because exitOccupancy would then carry a station name
     megaron does not have and OD-B17-S07's own blockingAt() would throw on it.
     So the swineherd calls up the lane and the beggar answers down it — the
     sound[] cues and gazeTargets carry the crossing, and every station in the
     handoff is a real one.

   THE ROUTE, AND THE ONE THING IT HAS TO CLEAR. bench_l2 (.16,.76) ->
   bench_r2 (.84,.76) is a straight line at constant plan z .76, i.e. the whole
   crossing happens NEARER the camera than the hearth ring (plan z .445–.595).
   His feet run along screen y 640, 87px below the hearth's own base (553), so
   when he passes the fire at screen x 475–645 he passes in FRONT of it and the
   depth queue draws him there. The two routes that look shorter both fail: a
   direct bench_l2 -> pillar_r walks through the ring (at z .595 it is at plan x
   .459, inside the fire's .395–.605) and a mid-depth crossing at z .44–.62 puts
   his legs inside flames he is standing BEHIND. What no route can avoid is the
   fire's screen x: for about three seconds around t 12 his torso is against the
   flames, which the t 12 plate confirms and which is the price of a hall with a
   hearth in the middle of it. It is three seconds of a walk and not a resting
   mark, and the depth is right — feet below the rim, body over the flame.

   THE OMEN IS AN INSTRUMENT, AND IT IS LAID ON THE FLOOR IT IS A PLAN OF.
   sound_source.sneeze-omen is written for this scene and its own `scene` field
   says so. It is a full emitter diagram — hall plan, impulse star, crossing
   lobe, listener rosette, travel measure, omen readout, envelope and two rhythm
   lanes — it honours no layers channel, and every size in it is ABSOLUTE pixels
   (a 76px star, 23/34px discs, a 58px seat), so it is legible only at about
   800px wide and the only way to use part of it is to cut the plate. FOUR things
   are done to it and each one was decided by a render:
     1 · IT IS DRAWN AT ITS OWN SIZE AND CROPPED, NEVER SCALED. The box is 820 x
       545 stage px and the blit is 1:1 from source rows 40–336: the hall plan,
       the axis, the wavefronts, the impulse star, the two seats, the listener
       rosette, the travel measure and the omen readout. Nothing is upscaled, so
       nothing is soft, and nothing is downscaled, so the module's absolute
       2.5–7px strokes stay one to two dot cells wide instead of dissolving.
       Rows past 336 are the ENVELOPE and the two RHYTHM LANES — 26 ticks 6–8px
       wide on a 592px baseline, a striped band at any size that fits this frame
       — and row 338 is where the module puts its ACCENT square, which prints
       BLACK through the POST pass. Cropping above it is how that trap is avoided
       rather than argued with.
     2 · thr 0.84 INSTEAD OF THE DEFAULT .895. The diagram opens with an
       uncontoured ink-1 ellipse (gray 219, luminance .859) over the whole
       stretch of room the report covers. At the default key it survives as an
       opaque light plane — a second background, with a hard cropped edge 600px
       long. At .84 the flood eats it, because it has no contour of its own;
       every contoured light plane (the readout plate, the two discs, the seats)
       is enclosed by its own ink and stays.
     3 · IT IS BLITTED WITH globalCompositeOperation "multiply", the blend its
       cast entry declares, so the room's own boards, hearth rim and litter read
       THROUGH the instrument instead of being punched out by it.
     4 · IT GOES ON THE FLOOR, NOT IN THE ROOF. Draft 1 hung the cut band across
       the roof space at dest (155, 8) and it was read back off the plate twice:
       the roof already carries the pillar beam (y 54–78), a rafter band
       (y 120–134) and two rake diagonals, and the diagram's own plan brackets
       and readout rectangles simply joined them. What printed was more
       architecture — a fifth and sixth beam and two more windows — and the
       instrument disappeared into the building. So the plate is laid where it
       belongs: dest (132, 430), i.e. ON THE FLOOR, which is this frame's largest
       light plane and the thing the diagram is a plan OF. Every mark then lands
       on the body it names:
         · the impulse star at stage (296, 570) bursts out of TELEMACHUS, who
           spans x 264–374 — and the module's own emitter seat, 52px under it,
           lands at (296, 622–644), which is the prince's own seat at his feet.
         · the listener rosette at (788, 499) opens back toward the star from
           PENELOPE's right shoulder — she is at 741 and her silhouette ends
           about 780 — with its own seat on the floor beside her.
         · the omen readout, the one cell in the diagram that carries the
           meaning, sits at stage x 554–891, y 660–726: clear near floor, 20px
           below the swineherd's ankle line and 22px below the fallen stool, the
           only rectangle of empty boards in the room big enough for it. At
           t >= READ its verdict cell is struck with a 10px chevron — the sound
           was assent — and that chevron is the largest single graphic in the
           lower frame.
       The wavefront arcs sweep from the prince to the queen across the hearth,
       and where they cross the seven flames they are simply not there, because
       multiply over ink 7 is ink 7. That is correct: the fire is between them.

   THE STOOL IS STILL ON THE FLOOR. prop.thrown-footstool in `evidence`, at the
   exact point S05 measured for it (x .700, floor y .878) and through the same
   inverse-of-its-own-POSE placement, because it is the same stool and nobody has
   picked it up. Its slab lands at screen x 744–824, 6px clear of the swineherd's
   silhouette and 27px nearer than his feet, so it lies in front of him on the
   boards the way an unclaimed thing does.

   HALL LAYERS. S05's list, minus `maidsdoor` for a new reason and minus
   `furniture` for the old one, plus `stair` restored:
     · `stair` is BACK. S05 dropped it because a body stood at bench_r2 in front
       of it; the flight rises to the RIGHT of its station (sx = f.x + run·i, tw
       65px) and the queen at pillar_r is 197px to its left, so nothing of hers
       touches it. It is the stair she has just come down and the dark leaf at
       the top of it is the chamber she came out of.
     · `maidsdoor` is dropped. Plan (.94,.40) projects to screen x 881 — the one
       band of paper between the queen at 741 and her runner at 888 — and it is a
       door leaf seen edge-on, a solid dark quadrilateral from y 312 to 593. It
       would weld the two bodies of the conversation together through the middle.
       Nobody uses it: the maids are shut in their quarters until XXII.
     · `furniture` is dropped, as in S05. In `feast` it draws benches at
       bench_l1/l2/r1/r2 and laden tables at table_l/table_r — a 41px slab at the
       exact stations three of these four bodies rest on, which is the
       fixture-fusing-under-the-legs failure with the fixture merely low.
     · `racks` is kept: the arms on the walls are a fact XXII turns on.
     · `throne` and `axes` stay out (the near spine, and twelve helves nobody has
       thought of yet).

   TONE. `feast` is a lift-0 state. The room is light planes with dark accents —
   the only near-black masses in the frame are the seven flames, the doorway
   furniture and the stair's upper leaf. Hand-drawn ctx overpaint in this file is
   ZERO: the rig draws the four bodies, the room draws itself, the prop draws
   itself, the instrument draws itself. Nothing here draws a full-width
   horizontal band; the longest span in the file is the instrument's own dashed
   travel measure, 492px of broken line in the roof space.

   Beats (Od. 17.492–606):
     1. Penelope hears of the beggar's endurance and asks Eumaeus to bring him for questioning.
     2. Odysseus delays until dusk, saying the suitors may attack him in the open hall.
     3. Penelope praises the stranger's caution and asks that he come when the room empties.
     4. Telemachus sneezes loudly; Penelope reads it as an omen that the suitors will die.

   Verify:  node harness/render-scene.mjs scenes/OD-B17-S06.mjs --t 22  (the order given)
            node harness/render-scene.mjs scenes/OD-B17-S06.mjs --t 58  (the omen, struck)
            node harness/render-scene.mjs scenes/OD-B17-S06.mjs --t 12  (mid-crossing)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, lerp, smooth } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import penelope   from "../assets/character/penelope.mjs";
import stool      from "../assets/prop/thrown-footstool.mjs";
import omen       from "../assets/sound_source/sneeze-omen.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 64;

const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "stair","pillars","lane","hearth","litter"];

/* --- SIZES: one man, times the plan's own falloff (S02–S05 all use this) --- */
const MAN = 0.36;
/* --- THE BOX A BODY IS DRAWN IN (S04/S05's reasoning, unchanged) ----------
   placeInstance() hands a module a box of the STAGE's aspect (1.474 wide) and
   every width-relative decoration — a herdsman's staff, a queen's veil and hair
   drape — is stretched with it. So figures are drawn into the PORTRAIT box
   makeRestage() uses for every character in the atlas, and blitted. FIG_FLOOR is
   the rig's own ankle line: the box bottom is not the floor. */
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

/* --- CONTINUITY IN — no translation needed; all of S05's stations are ------
   megaron stations. penelope is added at the foot of her own stair. */
import { exitOccupancy as PREV_EXIT } from "./OD-B17-S05.mjs";
const INITIAL = { ...PREV_EXIT, penelope:"stair_up" };

/* --- BLOCKING. Stations, not coordinates. --------------------------------- */
const MOVES = [
  // the queen comes down and takes her place at the pillar of the roof
  { who:"penelope", from:"stair_up", to:"pillar_r",  t0: 1, t1: 9 },
  // her runner crosses the whole floor to her, in front of his own fire
  { who:"eumaeus",  from:"bench_l2", to:"bench_r2",  t0: 6, t1:18 },
];

/* --- THE CLOCK ------------------------------------------------------------ */
const ASK   = 18;   // "go and tell the stranger to come to me"
const CALL  = 26;   // the swineherd calls up the lane
const DELAY = 32;   // the beggar's answer: at dusk, when the hall empties
const PRAISE= 40;   // she praises the caution
const SN0   = 48;   // Telemachus sneezes
const READ  = 56;   // she laughs, and reads it

/* --- THE FALLEN STOOL: S05's own numbers, inverted the same way -----------
   the prop module's POSE table, which it does not export: cx/cy are the box
   fractions its transform origin lands on, s is the half-width as a fraction of
   the box width, floor is the y its own broken ground line is drawn at. Only
   `evidence` is needed here; the stool has not been touched since S05. */
const STOOL_POSE = { evidence:{ cx:0.47, cy:0.453, s:0.262, floor:0.680 } };
const STOOL_HALF = 0.036;                 // 40px of half-width, as in S05
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

/* --- THE OMEN: a plate, cut and multiplied over the roof space ------------
   absolute stage px, because every number in it was measured against this
   frame and none of it may be scaled. */
const OMEN_W = 820, OMEN_H = 545;         // the box the module draws itself in
const OMEN_Y0 = 40, OMEN_Y1 = 336;        // the rows that are used
const OMEN_X = 132, OMEN_TOP = 430;       // where the cut band is laid down
const OMEN_THR = 0.84;                    // clears the uncontoured ink-1 field

function omenState(t){
  const u = clamp((t - SN0) / 14, 0, 1);
  const decay = clamp((t - SN0 - 2) / 10, 0, 1);
  return {
    intensity: lerp(1.00, 0.26, smooth(decay)),
    phase:     lerp(0.20, 0.95, smooth(u)),
    cut:true, stopped:false, read: t >= READ,
    status: t >= READ ? "OMEN" : t >= SN0 + 6 ? "HEARD"
          : t >= SN0 + 2 ? "CROSSING" : "SNEEZE",
    progress: 0.30 + 0.62 * u,
  };
}
function placeOmen(offctx, st){
  const sh = OMEN_Y1 - OMEN_Y0;
  const sig = "omen|" + Math.round((st.phase ?? 0) * 40) + "|"
            + Math.round((st.intensity ?? 0) * 20) + "|" + (st.read ? "r" : "-");
  const cv = keyedModuleCanvas(omen, OMEN_W, OMEN_H, st, sig, OMEN_THR, 0);
  offctx.save();
  offctx.globalCompositeOperation = "multiply";
  offctx.drawImage(cv, 0, OMEN_Y0, OMEN_W, sh, OMEN_X, OMEN_TOP, OMEN_W, sh);
  offctx.restore();
}

export const scene = {
  id:"OD-B17-S06",
  title:"Penelope Summons the Stranger",
  book:17,
  plan:"megaron",
  duration:D,
  beats:[
    "Penelope hears of the beggar's endurance and asks Eumaeus to bring him for questioning.",
    "Odysseus delays until dusk, saying the suitors may attack him in the open hall.",
    "Penelope praises the stranger's caution and asks that he come when the room empties.",
    "Telemachus sneezes loudly; Penelope reads it as an omen that the suitors will die.",
  ],
  exitState:"Late in the same afternoon in the great hall, the same fire and the same litter as OD-B17-S05, and an appointment has been made that Book XIX will keep. Penelope has come down from her chamber — she is off her stair now and standing at the right-hand pillar of the roof, veil up, plan (.74,.44) — because word reached her that a wandering beggar in her house was struck by Antinous and did not answer it with anything but patience. She sent Eumaeus across the whole floor to her, in front of the fire, and told him to bring the stranger over so she could question him about Odysseus. The swineherd called it up the lane and the beggar answered from the ash sill without getting up: not now, not while the hall is full of them — one of them has already thrown furniture at him and the queen should let it wait for dusk, when the suitors have gone home and the room is empty. She took that for good sense rather than insolence, said so out loud, and agreed to the hour: he will come to her when the room empties, which is the appointment Book XIX opens on. Then Telemachus sneezed, loud, and the whole house rang with it; the report crossed the room from the prince's table to the queen's pillar and she laughed and read it as the omen it is — the sound was assent, and every one of these men is already dead. Nobody in the room can read that except the man on the sill, and he has not moved from it once in the whole scene: odysseus is still at threshold, plan (.50,.16), guise beggar, disguise wholly intact, the station he will stand on to shoot. Telemachus is at table_l where he has been all afternoon, Eumaeus is at bench_r2 at the queen's corner, Antinous is still at table_r and has still not answered for the stool, which is still lying on the floor between the benches where it fell. The doors are open, the arms are on the walls, and the hour of the interview is set.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ penelope:"enters at stair_up, down from her own chamber, and crosses to pillar_r (t 1–9)",
              eumaeus:"already at bench_l2 from OD-B17-S05; summoned across to bench_r2 (t 6–18)",
              odysseus:"already on the sill at threshold (guise:beggar), and does not rise",
              telemachus:"already at table_l",
              antinous:"carried in occupancy at table_r; not painted in this frame",
              stool_01:"already on the floor at the point OD-B17-S05 left it (mode:evidence)",
              omen_01:"armed and silent until t 48; the report is a transient, not a bed" },
  exits:{ /* nobody leaves. The appointment is for dusk, which is Book XIX */ },
  walkable:"megaron zones.walkable + lane:spine, MINUS the hearth ring (plan x " +
           ".395–.605, z .445–.595, flames to screen y 456), MINUS the near spine " +
           "(the master's ground), MINUS the stair's own footprint. Resting ground " +
           "in this scene is threshold, table_l, pillar_r and bench_r2; the two " +
           "paths walked are stair_up -> pillar_r (down the right-hand wall) and " +
           "bench_l2 -> bench_r2 (straight across plan z .76, in FRONT of the fire).",
  depthOrder:"one queue, sorted by the plan's own z: odysseus (.16) behind " +
             "penelope (.66 -> .44 on the descent) behind telemachus (.70) behind " +
             "eumaeus (.76) behind the fallen stool (.78, so the slab lies in " +
             "front of the man standing nearest it). The OMEN is not in the queue: " +
             "it is an instrument, cut from its own plate and multiplied onto the " +
             "FLOOR after every body is down — a plan of this hall lying on this " +
             "hall, with its emitter seat under the prince and its listener " +
             "rosette at the queen's shoulder.",
  gazeTargets:{ penelope:"the hall and the litter as she comes down, then her runner on her right, then the sill she is bargaining with, then the son who sneezed",
                eumaeus:"the floor ahead of him while he crosses, then up to the queen, then away up the lane to the beggar, then back to her",
                odysseus:"the queen's corner, level and patient; and once, at the sneeze, his own son",
                telemachus:"his mother at the pillar, then his own hands, then the room" },
  attachments:[
    { at: 0, who:"stool_01", change:"unclaimed on the floor, evidence, exactly where OD-B17-S05 left it" },
    { at: 0, who:"omen_01",  change:"armed at the prince's seat; not sounding" },
    { at:SN0, who:"omen_01", change:"fired — the impulse leaves table_l and crosses the plan toward pillar_r" },
    { at:READ, who:"omen_01",change:"read — the verdict cell is struck: the sound was assent" },
  ],
  sound:[
    { at: 2, source:"stair_up",  cue:"a door above, and a woman coming down stone steps" },
    { at:10, source:"pillar_r",  cue:"the queen, low, to her housekeeper: fetch me the swineherd" },
    { at:ASK,source:"pillar_r",  cue:"bring the stranger over — I want to ask him about my husband" },
    { at:CALL,source:"bench_r2", cue:"Eumaeus calling up the lane, over the noise of the tables" },
    { at:DELAY,source:"threshold",cue:"the beggar answering from the sill: not while the hall is full" },
    { at:PRAISE,source:"pillar_r",cue:"she says he is no fool; let him come when the room empties" },
    { at:SN0,source:"table_l",   cue:"one enormous sneeze, and the whole house ringing with it" },
    { at:READ,source:"pillar_r", cue:"the queen laughing out loud: they are all dead men" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.500,y:.564}, scale:.264, band:"threeq", pose:"crouch" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.837,y:.794}, scale:.362, band:"threeq", pose:"penelope_grief" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.285,y:.813}, scale:.369, band:"threeq", pose:"guarded_withdrawal" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.207,y:.842}, scale:.381, band:"threeq", pose:"lean_forward" },
    { asset:"prop.thrown-footstool", instance:"stool_01",
      anchor:{x:.700,y:.878}, scale:.137 },
    { asset:"sound-source.sneeze-omen", instance:"omen_01",
      anchor:{x:.484,y:.955}, scale:.732, blend:"multiply" },
  ],

  timeline:[
    // 0 — the queen comes down her own stair into her own hall
    { op:"actor.pose", target:"penelope",   at: 0.0, args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope",   at: 0.0, args:{ gaze:{ x:-.18, y:.28 } } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"telemachus", at: 0.0, args:{ gaze:{ x:.34, y:.16 } } },
    { op:"actor.pose", target:"eumaeus",    at: 0.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"eumaeus",    at: 0.0, args:{ gaze:{ x:.46, y:.04 } } },
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"crouch" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0, args:{ gaze:{ x:.34, y:.06 } } },
    { op:"prop.state", target:"stool_01",   at: 0.0, args:{ mode:"evidence" } },
    // 1 — she has heard what happened, and sends for the swineherd
    { op:"actor.pose", target:"eumaeus",    at: 6.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eumaeus",    at: 6.0, args:{ gaze:{ x:.40, y:-.02 } } },
    { op:"actor.pose", target:"penelope",   at:10.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"penelope",   at:10.0, args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"actor.pose", target:"telemachus", at:12.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:12.0, args:{ gaze:{ x:.46, y:-.04 } } },
    { op:"actor.pose", target:"penelope",   at:ASK,  args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope",   at:ASK,  args:{ gaze:{ x:.34, y:.02 } } },
    { op:"actor.pose", target:"eumaeus",    at:ASK,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"eumaeus",    at:ASK,  args:{ gaze:{ x:-.20, y:-.10 } } },
    // 2 — the message goes up the lane, and the beggar will not come
    { op:"actor.pose", target:"eumaeus",    at:CALL, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"eumaeus",    at:CALL, args:{ gaze:{ x:-.46, y:.04 } } },
    { op:"actor.gaze", target:"odysseus",   at:CALL, args:{ gaze:{ x:.44, y:.10 } } },
    { op:"actor.gaze", target:"odysseus",   at:DELAY,args:{ gaze:{ x:.30, y:.02 } } },
    { op:"actor.pose", target:"telemachus", at:DELAY,args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"telemachus", at:DELAY,args:{ gaze:{ x:.30, y:.06 } } },
    // 3 — she takes it for sense, and sets the hour
    { op:"actor.pose", target:"penelope",   at:36.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"penelope",   at:36.0, args:{ gaze:{ x:-.36, y:-.02 } } },
    { op:"actor.pose", target:"eumaeus",    at:PRAISE,args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"eumaeus",    at:PRAISE,args:{ gaze:{ x:-.24, y:-.08 } } },
    { op:"actor.pose", target:"penelope",   at:44.0, args:{ pose:"palm_up_question" } },
    { op:"actor.gaze", target:"penelope",   at:44.0, args:{ gaze:{ x:-.34, y:.00 } } },
    { op:"actor.gaze", target:"odysseus",   at:46.0, args:{ gaze:{ x:.26, y:.06 } } },
    // 4 — the sneeze, and the reading of it
    { op:"actor.pose", target:"telemachus", at:SN0,  args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"telemachus", at:SN0,  args:{ gaze:{ x:.06, y:.30 } } },
    { op:"fx.play",    target:"omen_01",    at:SN0,  args:{ dir:"fire" } },
    { op:"actor.pose", target:"eumaeus",    at:50.0, args:{ pose:"head_left" } },
    { op:"actor.gaze", target:"eumaeus",    at:50.0, args:{ gaze:{ x:-.50, y:.06 } } },
    { op:"actor.pose", target:"penelope",   at:50.0, args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"penelope",   at:50.0, args:{ gaze:{ x:-.42, y:.10 } } },
    { op:"actor.gaze", target:"odysseus",   at:50.0, args:{ gaze:{ x:-.40, y:.12 } } },
    { op:"actor.pose", target:"telemachus", at:54.0, args:{ pose:"lean_backward" } },
    { op:"actor.gaze", target:"telemachus", at:54.0, args:{ gaze:{ x:.40, y:-.06 } } },
    { op:"actor.pose", target:"penelope",   at:READ, args:{ pose:"laughter" } },
    { op:"actor.gaze", target:"penelope",   at:READ, args:{ gaze:{ x:-.40, y:.02 } } },
    { op:"actor.pose", target:"telemachus", at:58.0, args:{ pose:"torso_open" } },
    { op:"actor.pose", target:"eumaeus",    at:58.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",   at:58.0, args:{ gaze:{ x:.28, y:.04 } } },
    { op:"timeline.capture", target:"OD-B17-S06", at:62.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s   = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);

    /* the field first — the hall, the doors, the sill, the stair, the fire, the
       litter. ONE state for the whole scene: the same feast S04 opened. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"feast", t:0.55, layers:HALL_LAYERS,
              progress:Math.min(.94, .20 + .74*(t/D)), status:"MISRULE" },
    });

    /* one queue, sorted by the plan's own depth */
    const queue = [];
    const add = (d, draw) => queue.push({ d, draw });

    /* --- ODYSSEUS: on his own ash sill, and he does not get up ----------- */
    {
      const p = blk.odysseus, c = s.odysseus || {};
      const called   = t >= CALL && t < DELAY;
      const answering= t >= DELAY && t < PRAISE;
      const sneeze   = t >= SN0 && t < READ;
      const after    = t >= READ;
      const pose = c.pose || "crouch";
      add(p.d, () => place(offctx, W, H, odysseus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"ody|" + pose + "|" + (after?"f":sneeze?"s":answering?"a":called?"c":"w"),
        state:{
          t:0.5, guise:"beggar", band:"threeq", pose,
          gaze: c.gaze || { x:.34, y:.06 },
          browUp:   sneeze ? .34 : called ? .26 : .14,
          browKnit: answering ? .40 : after ? .34 : .22,
          eyeNarrow:after ? .44 : answering ? .30 : .18,
          eyeWide:  sneeze && t < SN0 + 3 ? .22 : 0,
          frown:    answering ? .24 : 0,
          smile:    after ? .14 : 0,
          jaw:      answering && t < DELAY + 5 ? .30 : 0,
          mouthAsym:after ? .18 : .10,
          status:   after     ? "HIS SON HAS ANSWERED FOR HIM"
                  : sneeze    ? "THE HOUSE RINGS"
                  : answering ? "NOT WHILE THE HALL IS FULL"
                  : called    ? "THE QUEEN IS ASKING FOR HIM"
                              : "HE KEEPS THE SILL",
          progress: Math.min(.96, .14 + .78*(t/D)),
        },
      }));
    }

    /* --- PENELOPE: down the stair, and up against her own pillar --------- */
    {
      const p = blk.penelope, c = s.penelope || {};
      const arriving = t < 12;
      const asking   = t >= ASK && t < 36;
      const setting  = t >= 36 && t < SN0;
      const struck   = t >= SN0 && t < READ;
      const laughing = t >= READ;
      const pose = c.pose || "penelope_grief";
      add(p.d, () => place(offctx, W, H, penelope, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"pen|" + pose + "|" + (laughing?"l":struck?"k":setting?"s":asking?"a":arriving?"d":"w"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:-.18, y:.28 },
          browUp:   arriving ? .58 : struck ? .50 : laughing ? .36 : .30,
          browKnit: arriving ? .46 : setting ? .34 : laughing ? .10 : .24,
          eyeNarrow:setting ? .30 : laughing ? .38 : .12,
          eyeWide:  struck ? .40 : 0,
          frown:    arriving ? .52 : asking ? .20 : 0,
          smile:    laughing ? .62 : setting ? .10 : 0,
          jaw:      laughing ? .46 : asking && t < ASK + 6 ? .38 : 0,
          mouth:    laughing ? .70 : asking ? .40 : -1,
          mouthAsym:setting ? .16 : 0,
          status:   laughing ? "THEY ARE ALL DEAD MEN"
                  : struck   ? "THE WHOLE HOUSE RANG"
                  : setting  ? "THEN LET HIM COME AT DUSK"
                  : asking   ? "BRING THE STRANGER TO ME"
                  : arriving ? "DOWN FROM HER OWN CHAMBER" : "SHE HAS HEARD OF IT",
          progress: Math.min(.96, .16 + .76*(t/D)),
        },
      }));
    }

    /* --- TELEMACHUS: at his table all afternoon, and then the omen ------- */
    {
      const p = blk.telemachus, c = s.telemachus || {};
      const watching = t >= 12 && t < DELAY;
      const holding  = t >= DELAY && t < SN0;
      const sneezing = t >= SN0 && t < 54;
      const after    = t >= 54;
      const pose = c.pose || "guarded_withdrawal";
      add(p.d, () => place(offctx, W, H, telemachus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"tel|" + pose + "|" + (after?"f":sneezing?"z":holding?"h":watching?"w":"x"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:.34, y:.16 },
          browUp:   sneezing ? .64 : after ? .34 : .22,
          browKnit: holding ? .56 : sneezing ? .30 : .18,
          eyeWide:  sneezing ? .10 : after ? .26 : 0,
          eyeNarrow:sneezing ? .70 : holding ? .36 : .10,
          frown:    holding ? .40 : 0,
          smile:    after ? .26 : 0,
          jaw:      sneezing && t < SN0 + 4 ? .74 : 0,
          mouthAsym:holding ? .20 : 0,
          status:   after    ? "HE DID NOT MEAN IT AS AN ORACLE"
                  : sneezing ? "ONE ENORMOUS SNEEZE"
                  : holding  ? "HE HAS BEEN TOLD TO SAY NOTHING"
                  : watching ? "HIS MOTHER, AT THE PILLAR" : "THE PRINCE'S TABLE",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* --- EUMAEUS: the runner, across his own fire and back again --------- */
    {
      const p = blk.eumaeus, c = s.eumaeus || {};
      const walking = t >= 6 && t < 18;
      const told    = t >= ASK && t < CALL;
      const calling = t >= CALL && t < PRAISE;
      const back    = t >= PRAISE && t < SN0;
      const struck  = t >= SN0;
      const pose = c.pose || "lean_forward";
      add(p.d, () => place(offctx, W, H, eumaeus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"eum|" + pose + "|" + (struck?"k":back?"b":calling?"c":told?"t":walking?"w":"x"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:.46, y:.04 },
          browUp:   told ? .48 : struck ? .52 : .28,
          browKnit: calling ? .44 : back ? .30 : .18,
          eyeNarrow:back ? .32 : .12,
          eyeWide:  struck && t < SN0 + 4 ? .34 : 0,
          frown:    calling ? .26 : 0,
          smile:    back ? .12 : 0,
          jaw:      calling && t < CALL + 5 ? .48 : 0,
          mouthAsym:back ? .18 : 0,
          status:   struck  ? "HE HEARD IT TOO"
                  : back    ? "THE STRANGER WILL COME AT DUSK"
                  : calling ? "CALLING UP THE LANE"
                  : told    ? "AT THE QUEEN'S PILLAR"
                  : walking ? "ACROSS HIS OWN FIRE" : "AT THE PRINCE'S HAND",
          progress: Math.min(.96, .20 + .72*(t/D)),
        },
      }));
    }

    /* --- THE STOOL: nobody has picked it up ----------------------------- */
    add(0.78, () => placeStool(offctx, W, H, t));

    queue.sort((a, b) => a.d - b.d).forEach(j => j.draw());

    /* --- THE OMEN: not in the queue. A plan of this hall, cut from its own
       plate and multiplied into the roof space over the two seats it is
       about — the one that sounds and the one that reads it. -------------- */
    if (t >= SN0) placeOmen(offctx, omenState(t));
  },
};
export default scene;

/* named binding so OD-B17-S07 can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
