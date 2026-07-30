/* ============================================================
   SCENE  OD-B18-S04 — Penelope Appears before the Suitors
   Book XVIII, scene 4. ADDITIVE: creates nothing, modifies nothing; it only
   COMPOSES assets that already exist. Shape copied from the reference scene
   scenes/OD-B16-S03.mjs and from its Book XVIII siblings OD-B18-S01.mjs (the
   megaron-with-a-crowd case) and OD-B18-S03.mjs (the registered-plate case).

   ROOM. location.megaron-hall, state "feast", with the SAME layer list S01 and
   S03 painted — so every fixture this scene names stands where those two shots
   put it: the great doors open in the far wall, THE SILL under the beggar, the
   fire high at the hearth, both pillars, the arms racks, the postern, the maids'
   door, and THE STAIR, which is the one fixture this scene is really about. The
   `furniture`, `litter` and `throne` layers stay dropped for the reason S01
   dropped them and nobody has undone: the floor was shoved open for the fight
   in S01 and the benches, the laden tables and the master's chair are still
   back against the walls. That is also what frees the six bench/table stations
   to hold bodies at all — the megaron draws its furniture exactly there.
   ONE hall asset with a state channel; no second hall is built or cast.

   THE PICTURE. A queen comes down her own stair into a hall she has not stood
   in for years, and the men who have been eating the house suddenly want to be
   seen giving. So the frame is built as a transaction with three corners and a
   witness:

     penelope    stair_up -> bench_r1   the near RIGHT flank. She appears at the
                                        head of her own stair (the only station
                                        in this plan that leads to her chamber,
                                        where Athena does the work) and comes
                                        two steps down onto the floor. She is
                                        the largest body in the frame and the
                                        only one the light is doing anything to.
     telemachus  table_l -> bench_l1    the near LEFT flank, close enough to
                                        camera to have a face taken off him.
                                        18.215 is a rebuke delivered across the
                                        whole width of the room, so the two of
                                        them are on opposite flanks and the
                                        pointing arm crosses the hall.
     odysseus    threshold              THE SILL, where S01, S03 and 18.110 all
                                        leave him, and he does not move once:
                                        the man this is being performed for is
                                        sitting in the doorway in rags and is
                                        the only person present who knows what
                                        the performance is worth. Static hero.
     the queue   near floor, centre     ensemble.suitor-gift-procession walked
                                        up the middle of the room between the
                                        three of them.

   WHICH STATIONS, AND WHY NOT THE OTHERS — read off renders, not guessed.
   · A near-band body in this projection prints about 0.17 of the frame wide, so
     two of them need 0.18 of x between them or they read as one clump. On the
     right flank `table_r` (.715), `bench_r1` (.749), `bench_r2` (.793) and
     `stair_up` (.837) all lie inside 0.12 of one another: the flank holds
     exactly ONE body, and it is the queen. The left flank (`bench_l2` .207,
     `bench_l1` .251, `table_l` .285) holds exactly one, and it is her son.
   · The spine is unusable for a second body. `hearth`, `throne`, `axe_first`,
     `axe_last` and `shot_mark` all project to x .500, the sill's own x, and a
     near body on the spine puts its head (throne: y .49) well above the sill
     man's feet (y .564) at the same x — the two silhouettes print as one
     column. Nobody but Odysseus stands on the centre line.
   · No pillar station is used. Draft work on S03 put a body on `pillar_l` and
     it printed as a caryatid, with the shaft's scored lines running down
     through the torso. The pillars are left to hold the roof up.
   · The three painted bodies never share a station, never share a flank and
     never share a depth: the sill is z .16, the queen ends at z .62 on the
     right, the boy at z .70 on the left and then z .62 on the left. The frame
     is a triangle round an empty middle, and the middle is what the gift queue
     walks into.

   AMPHINOMUS IS NOT PAINTED, AND IS NOT LOST. OD-B18-S03 hands over
   {odysseus:"threshold", amphinomus:"bench_l1"}. Both are MEGARON stations, so
   the occupancy is imported straight — no translation map is needed and none is
   invented (rule F only bites when the room changes). He is carried in the
   blocking and withdraws to his own bench (`bench_l1` -> `bench_l2`, the seat
   18.157 sent him back to), so `exitOccupancy` still hands him to the next
   scene. He is simply not painted as a named body here, for two reasons that
   are both about this shot: the near-left flank holds one body and the rebuke
   needs it to be Telemachus; and this scene's crowd asset IS the suitors —
   ensemble.suitor-gift-procession's `suitor`-role bearers are these men sending
   for these gifts. Painting him twice, once as a named body and once as a
   member of the line, would be a double.

   ONE BODY, ONE GUISE, AND NO FLARE. The atlas asks for
   `character.odysseus-as-beggar`. That is character.odysseus-b16 with
   guise:"beggar" — the same body Books XVI and XVII used and the same one S01,
   S02 and S03 used, never a cut to a second module. The guise is held FLAT at
   "beggar" from the first frame to the last and there is no
   divine_fx.athenas-restoration anywhere in this scene: the restoration flare
   exists to cover the garment snap at u=0.5, and nothing about this man changes
   here. What changes is only what his face is doing, which is the joke of the
   beat — 18.281, "he was glad because she drew gifts out of them".

   THE GRACE IS REGISTERED, NOT FLOATED. divine-fx.athenas-beautification is a
   BEFORE/AFTER plate: it paints its own plinth and its own two diagrammatic
   silhouettes with a proportion arrow between them. On a stage that already has
   a painted room and a painted queen in it, all three of those are wrong — the
   plinth floods its canvas with inkLevel(1) and would stand as an opaque panel
   over the hall, and `before`/`after` are exactly the "baked-in unrelated
   figures" the look forbids. So the plate is cast with its two figures, its
   plinth and its proportion arrow DROPPED, and only `radiance` and `sparkles`
   kept: the halo and the fan of spikes that the module hangs on its target's
   crown, and the stream of motes that carries the grace across to it.
   Those two layers are then landed on the QUEEN's own crown, computed from her
   live blocked station:
       crownY = p.y - 0.79 * FIG_PEN * p.scale        (rig: 0.72 of the box tall,
                                                       feet at 0.93 of the box)
       anchor.x = p.x   - 0.185 * FXW
       anchor.y = crownY + (1 - (0.82 - afterH)) * FXH
   `afterH` is recomputed here with the module's own ramp so the halo tracks the
   crown while the effect grows, instead of sliding off her head. The blue tick
   in `proportion` is another reason to drop it: ACCENT prints BLACK once the
   POST pass quantizes by luminance, so a "colour" accent is just a dark bar.
   The window opens at t=6, before she is painted: for five seconds the radiance
   and the motes gather at the head of the stair with nobody standing there,
   which is the only honest way to stage 18.187 — the goddess does her work on a
   sleeping woman in a room that is not this room, at the top of these stairs.

   THE INVENTORY IS A PLATE ON THE FLOOR. prop.courtship-gifts is not a pile,
   it is a five-item register with a donor numeral under each gift, and it is
   cast the way S03 cast its diagram: laid on plan-adjacent ground, painted
   BEFORE the bodies so people stand on it and no stroke crosses a face, and cut
   to what survives the lattice. `tag:false` drops the donor numerals: the
   module draws them as seven-segment GEOMETRY, but at any size that fits this
   floor a digit cell is ~10px and the bars fall under the dot pitch and clot.
   It is also drawn BIG — 0.30 of the frame wide, which is 0.59 of it tall at the
   module's own aspect. Draft 2 set it at 0.21 and every gift below the robe came
   out as illegible scaffolding; the plinths, the collar crescent and the bead
   strings only start to read at this size.
   What is kept is the five silhouettes on their five short plinths — gold and
   cloth as light planes, which is what makes them readable at all — and, from
   t=41, `owned:true`, whose grip ticks are the one mark in the module that says
   the title has moved. It is drawn at the module's own 660:880 aspect rather
   than through placeInstance's frame-shaped box, because a portrait register
   stretched to 1120:760 turns every gift into a squat smear.

   THE QUEUE. ensemble.suitor-gift-procession is authored for this scene. It
   sizes its bearers in ABSOLUTE pixels (150px in the deep band, 185px mid,
   235px front) regardless of the box it is given, so the box only decides where
   the three footlines land — which makes the box a blocking decision:
   ·  density 0.40 keeps the FRONT band only — three bearers, at x .378, .506
      and .625, with a tenth of the frame of paper between each of them. Both
      cuts are measured off drafts, not tonal preference. The deep band foots at
      .749 with its heads at .552, which is ABOVE the sill man's feet (.564) at
      the sill man's own x: those two silhouettes print as one column. The mid
      band foots lower and clears him, but draft 3 rendered it at density 0.60
      and the five bearers' raised gifts closed the gaps — the two bands' arms,
      heads and gift glyphs printed as one dark clot across the middle of the
      floor, which is the opposite of a queue you can count. Three bearers, one
      footline at .905, heads at .596: the line passes UNDER Odysseus, never
      touches him, and every man in it reads as a man carrying one thing.
   ·  `showDoor`, `showDais`, `showIndex` and `showFront` are all off. This stage
      has a door already (the great doors, with the beggar on the sill), it has a
      receiver already (the queen, standing on her own floor, not on a drawn
      dais), and the overhead catalogue and the dashed reaction track are
      margin furniture — in a STAGE the margins are occupied room.
   ·  `focus` is moved off the asset's empty dais and onto the flagstones just in
      front of the queen's feet, so the one mark the ensemble insists on drawing
      — the receiving bracket — lands where the gifts are being set down instead
      of printing two ticks across her skirt.
   ·  The line is not there for the first two thirds of the scene. Nobody has
      been sent yet, and an empty floor is what the first four beats need.

   PAINT ORDER is sorted on resolved y, not fixed in the source: the field, then
   the register on the floor, then the grace, then the three bodies back to
   front, and the queue LAST because every bearer's footline (.827, .945) is
   nearer than every named body's (.564, .774, .813). That is also what lets the
   head of the queue lift a gift across the queen's chest without the arm
   printing behind her.

   Beats (Od. 18.158–303):
     1. Athena puts it in Penelope's heart to show herself to the suitors.
     2. She is put to sleep, made taller, whiter, more beautiful, and woken.
     3. She comes down with two maids and rebukes Telemachus for letting the
        stranger be abused under his roof.
     4. She repeats what Odysseus told her on the day he left, and asks the
        suitors for courtship gifts.
     5. The heralds are sent; robe, chain, earrings, collar and tokens come up
        the hall, and Odysseus is quietly delighted at what she is doing.

   THE TWO MAIDS. The beat says she descends with two maids and this scene does
   not paint them. There is no station for them that is not one of the four
   near-flank stations already argued over, and there is no two-maid asset that
   is not a crowd; a pair of unblocked figures beside her would be the exact
   collage this book is trying to stop. They are in the beat text and in the
   exit state, not in the picture.

   CONTINUITY IN. scenes/OD-B18-S03.mjs exports a computed `exitOccupancy` and
   it is imported here as PREV_EXIT. Penelope and Telemachus are added to the
   initial occupancy by NAME (stair_up, table_l) because S03 painted neither and
   this scene is where they enter the book.

   Verify:  node harness/render-scene.mjs scenes/OD-B18-S04.mjs --t 13
            node harness/render-scene.mjs scenes/OD-B18-S04.mjs --t 42
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, lerp, smooth } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import penelope   from "../assets/character/penelope.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import queue      from "../assets/ensemble/suitor-gift-procession.mjs";
import gifts      from "../assets/prop/courtship-gifts.mjs";
import grace      from "../assets/divine_fx/athenas-beautification.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 46;

/* the room, minus the benches, the laden tables, the litter and the master's
   chair — all still shoved back from the fight in S01. Identical to the list
   S01 and S03 paint, so this is the same hall. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth"];

/* --- CONTINUITY IN. Computed upstream, imported straight. -----------------
   S03 ends {odysseus:"threshold", amphinomus:"bench_l1"} — both MEGARON
   stations, both still true, so there is nothing to translate. The two bodies
   this scene brings into the book are declared by station name. */
import { exitOccupancy as PREV_EXIT } from "./OD-B18-S03.mjs";
const INITIAL = {
  ...PREV_EXIT,
  penelope:   "stair_up",   // the head of her own stair; her chamber is above it
  telemachus: "table_l",    // his own place, near left, where she can be heard
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Odysseus has no row: he holds the sill for the whole scene, which is the
   plot of this doorway in every Book XVIII shot. */
const MOVES = [
  // Amphinomus goes back to his own bench and is not painted (see header)
  { who:"amphinomus", from:"bench_l1", to:"bench_l2", t0: 2, t1: 9 },
  // the queen comes down off the stair onto her own floor
  { who:"penelope",   from:"stair_up", to:"bench_r1", t0:14, t1:21 },
  // the boy gives ground under the rebuke — upstage, still on the left flank
  { who:"telemachus", from:"table_l",  to:"bench_l1", t0:26, t1:33 },
];

/* --- FIGURE SIZES (multiplied by the station's own plan scale) ------------
   0.50 on the sill is the size S01 and S03 give this body on this station, so
   the man in the doorway is the same man at the same distance in all three
   shots. The queen takes 0.46 and the plan scale gives her the rest: she stands
   0.46 of the room's depth nearer the camera than he does and prints ~247px to
   his ~201px, the largest body in the frame. She is NOT given his 0.50, and
   that is read off draft 1 — character.penelope's veil hood and hair drape are
   a near-black mass by authorship, and at 0.50 on this station that mass closed
   the gap to the drawn stair beside her and the right third of the frame went
   to one black shape. */
const FIG_OD = 0.50, FIG_PEN = 0.46, FIG_TEL = 0.46;

/* rig geometry, measured off renders (S03's note): the hero draws ~0.72 of its
   placed box tall with its feet at ~0.93 of the box height. */
const CROWN = 0.79;                      // box-heights from the feet to the crown
const crownY = (p, fig) => p.y - CROWN * fig * p.scale;
/* character.penelope draws a veil hood and a hair drape ABOVE the rig's own
   crown anchor — measured off draft 2 at 0.036 of the frame. The halo has to
   clear that or it prints inside the black of the hood, which is what draft 2
   did: the arc was landed at the rig crown, the hood swallowed it, and every
   spike went with it. */
const VEIL_LIFT = 0.055;

/* --- THE GRACE WINDOW. One clock drives radiance, motes and her face. ----
   It opens five seconds before she is painted: the work is done on a sleeping
   woman upstairs, and what this room can see of it is a light at the head of
   the stair. */
const G0 = 6, G1 = 20;
const graceT  = t => clamp((t - G0) / (G1 - G0), 0, 1);
/* the plate's box, as fractions of the frame. It is drawn LARGE on purpose: the
   module scales its ray length off the box height and its stroke width off the
   box width, so at the third of this that the queen's own band would have
   allowed, the spikes fell to 2px of inkLevel(3) and the dot lattice turned the
   whole burst into three grey specks. */
const FXW = 0.46, FXH = 0.65;
const FX_LAYERS = ["radiance","sparkles"];
/* intensity above 1: the module draws its rays and motes with globalAlpha in
   the 0.34..0.9 band, and anything that composites lighter than lum .895 is
   flood-cleared by the dot-law key before it ever reaches the paper. Draft 1
   at intensity 1.0 landed the halo arc and lost every spike. */
const FX_INTEN = 1.55;
/* the module's own stature ramp, recomputed so the halo can be landed on the
   crown while the effect is still growing. This mirrors the asset's math; it
   does not redefine its art. */
const afterH = u => lerp(0.325, 0.475, smooth(clamp(u * 1.25, 0, 1)));

/* --- WHEN THINGS ARE ON THE FLOOR --------------------------------------- */
const P_IN   = 11;                       // the queen is visible from here
const Q_IN   = 32;                       // the heralds come back up the hall
const PLATE  = 34;                       // the gifts are set out
const OWNED  = 41;                       // and change hands

/* the register, at the module's authored 660:880 aspect, in the one corner of
   this floor that no body and no fixture stands on. */
const PL_W = 0.30, PL_H = PL_W * 1120 / (0.75 * 760);
const PL_AT = { x:0.160, y:0.990 };

/* the queue's box. Absolute-pixel bearers, so this is pure blocking: with
   h = 0.56 the two kept bands foot at .827 and .945 and their heads (.584,
   .636) both stay below the sill man's feet (.564). */
const QBOX = { x:0.550, y:0.944, w:0.440, h:0.520 };
const Q_DENSITY = 0.40;
const qFront = t => clamp((t - Q_IN) / 12, 0, 1);      // the crest along the line

/* plates are keyed by hand so their light fields cannot stand as panels. */
function placePlate(offctx, W, H, mod, at, wf, hf, state, sig, thr = 0.895){
  const w = W * wf, h = H * hf;
  offctx.drawImage(keyedModuleCanvas(mod, w, h, state, sig, thr),
                   at.x * W - w / 2, at.y * H - h);
}

export const scene = {
  id:"OD-B18-S04",
  title:"Penelope Appears before the Suitors",
  book:18,
  plan:"megaron",
  duration:D,
  beats:[
    "Athena puts the desire in Penelope to show herself to the suitors and draw their gifts out of them.",
    "She puts the queen to sleep, makes her taller and whiter than cut ivory, and wakes her radiant.",
    "Penelope comes down the stair with two maids and rebukes Telemachus for letting the stranger be abused.",
    "She repeats what Odysseus told her on the day he sailed, and asks for courtship gifts.",
    "The suitors send heralds for robe, chain, earrings and collar, and Odysseus is quietly delighted at her strategy.",
  ],
  exitState:"The great hall with the doors standing open and the fire high, the benches and the laden tables still shoved back from the fight. Penelope has come down off her own stair and stands on the floor of the hall on the near right, awake, beautified by Athena in her sleep and taller than she was — the first time in the poem she has shown herself to the suitors on purpose. She has rebuked Telemachus in front of all of them for letting a guest be handled that way under his roof, and he has taken it and given ground to his own bench on the left without answering back. She has repeated Odysseus's parting instruction word for word and used it to ask, in public, for courtship gifts. The heralds have been sent and the line is coming up the middle of the room: the embroidered robe with its twelve gold pins, the amber chain, the triple-drop earrings, the worked collar and a tray of lesser tokens, each held a little higher than the one before it because the man behind is watching. The five are set out on the flagstones in front of her and the title has moved: they are hers, and nothing has been promised for them. Odysseus has not moved off the sill for a single frame. He is still in the beggar's rags, nobody in the room has looked at him twice, and he is glad — she is stripping the men who are eating his house and he is the only person present who knows what he is watching. Amphinomus is back at his own bench with the rest of the suitors, and the two maids who came down with her are standing behind her at the stair foot.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"prop.courtship-gifts", instance:"gifts_01",
      anchor:{x:PL_AT.x,y:PL_AT.y}, scale:PL_W },
    { asset:"divine-fx.athenas-beautification", instance:"grace_01",
      anchor:{x:.69,y:.70}, scale:FXW, blend:"multiply" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.37, band:"threeq", pose:"three_quarter_right" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.75,y:.77}, scale:.49, band:"threeq", pose:"profile_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.29,y:.81}, scale:.47, band:"threeq", pose:"three_quarter_right" },
    { asset:"ensemble.suitor-gift-procession", instance:"queue_01",
      anchor:{x:QBOX.x,y:QBOX.y}, scale:QBOX.w, blend:"multiply" },
  ],

  timeline:[
    { op:"actor.pose",  target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"odysseus",   at: 0.0, args:{ gaze:{ x:.16, y:.16 } } },
    { op:"actor.pose",  target:"telemachus", at: 0.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"telemachus", at: 0.0, args:{ gaze:{ x:.30, y:-.04 } } },
    // 1..2 the desire, the sleep, the beautification at the head of the stair
    { op:"fx.play",     target:"grace_01",   at:G0,   args:{ dir:"beautify" } },
    { op:"actor.pose",  target:"penelope",   at:P_IN, args:{ pose:"profile_left" } },
    { op:"actor.gaze",  target:"penelope",   at:P_IN, args:{ gaze:{ x:-.30, y:.18 } } },
    { op:"actor.gaze",  target:"odysseus",   at:13.0, args:{ gaze:{ x:.34, y:-.02 } } },
    // 3 the descent and the rebuke, delivered across the hall
    { op:"actor.pose",  target:"penelope",   at:15.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose",  target:"telemachus", at:18.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"telemachus", at:18.0, args:{ gaze:{ x:.44, y:-.10 } } },
    { op:"actor.pose",  target:"penelope",   at:22.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"penelope",   at:22.0, args:{ gaze:{ x:-.50, y:.06 } } },
    { op:"actor.pose",  target:"telemachus", at:25.0, args:{ pose:"head_lowered" } },
    { op:"actor.gaze",  target:"telemachus", at:25.0, args:{ gaze:{ x:.10, y:.40 } } },
    // 4 the parting instruction, repeated, and the gifts asked for
    { op:"actor.pose",  target:"penelope",   at:28.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"penelope",   at:28.0, args:{ gaze:{ x:-.34, y:-.04 } } },
    { op:"actor.pose",  target:"telemachus", at:31.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.pose",  target:"penelope",   at:33.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"penelope",   at:33.0, args:{ gaze:{ x:-.20, y:.10 } } },
    // 5 the line comes up the hall; the beggar is delighted
    { op:"crowd.state", target:"queue_01",   at:Q_IN, args:{ formation:"queue", status:"SENT FOR" } },
    { op:"prop.state",  target:"gifts_01",   at:PLATE,args:{ mode:"display" } },
    { op:"actor.pose",  target:"odysseus",   at:36.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"odysseus",   at:36.0, args:{ gaze:{ x:.40, y:.06 } } },
    { op:"crowd.state", target:"queue_01",   at:38.0, args:{ formation:"queue", status:"OUTBIDDING" } },
    { op:"actor.pose",  target:"penelope",   at:40.0, args:{ pose:"profile_left" } },
    { op:"actor.gaze",  target:"penelope",   at:40.0, args:{ gaze:{ x:-.16, y:.22 } } },
    { op:"prop.state",  target:"gifts_01",   at:OWNED,args:{ mode:"display", owned:true } },
    { op:"actor.pose",  target:"telemachus", at:42.0, args:{ pose:"lean_forward" } },
    { op:"timeline.capture", target:"OD-B18-S04", at:45.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);

    const asleep   = t <  P_IN;             // the work is being done upstairs
    const woken    = t >= P_IN && t < 22;    // she appears at the head of the stair
    const rebuking = t >= 22 && t < 28;      // "you no longer have steady thoughts"
    const asking   = t >= 28 && t < Q_IN;    // the parting instruction, and the ask
    const giving   = t >= Q_IN;              // the line comes up the hall
    const held     = t >= OWNED;             // and the title has moved

    /* the field first — it paints the room, everything else keys onto it */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"feast", t:0.55, layers:HALL_LAYERS,
              progress:Math.min(.94, .2 + .7*(t/D)),
              status: held ? "SHE HAS THEIR GIFTS" : giving ? "THE BIDDING"
                    : asleep ? "THE STAIR" : "THE QUEEN COMES DOWN" },
    });

    /* --- THE REGISTER, on the flagstones, under everybody ----------------
       Drawn at the module's own 660:880 aspect: a portrait inventory stretched
       to the frame's 1120:760 box turns every gift into a squat smear. The
       donor numerals are dropped (`tag:false`) because a digit cell at this
       size is ~10px and its seven-segment bars fall under the dot pitch; the
       grip ticks that say the title has moved arrive at t=41. */
    if (t >= PLATE){
      const owned = t >= OWNED;
      placePlate(offctx, W, H, gifts, PL_AT, PL_W, PL_H,
        { mode:"display", tag:false, owned, t:0.5,
          status: owned ? "ACCEPTED" : "DISPLAYED",
          progress: Math.min(.96, .3 + .6*(t/D)) },
        `disp|${owned?1:0}`);
    }

    /* --- THE GRACE: two layers of a five-layer plate, landed on her crown --
       `plinth` (which floods), `before`, `after` and `proportion` are dropped:
       the first would stand as an opaque panel over the hall, the next two are
       the plate's own diagrammatic silhouettes and this stage has a real queen
       in it, and the last carries an ACCENT tick that prints black anyway. */
    const gt = graceT(t);
    if (gt > 0.001 && gt < 0.999){
      const p  = blk.penelope;
      const cy = crownY(p, FIG_PEN) - VEIL_LIFT;
      placePlate(offctx, W, H, grace,
        { x: p.x - 0.185 * FXW,
          y: cy + (1 - (0.82 - afterH(gt))) * FXH },
        FXW, FXH,
        { t:gt, intensity:FX_INTEN, layers:FX_LAYERS,
          status: asleep ? "POURING" : "GRACED", progress:gt },
        `g|${Math.round(gt*20)}`);
    }

    /* --- the painted bodies, ordered by the blocking -------------------- */
    const draws = [];

    /* ODYSSEUS — one body, guise held flat at "beggar", and he does not move
       off the sill for a single frame. The face is the whole performance:
       nothing at all while she is being made beautiful, and then 18.281. */
    {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_OD * p.scale,
          state:{
            t:0.45, guise:"beggar", band:"threeq",
            pose: s.pose || "three_quarter_right",
            gaze: s.gaze || { x:.16, y:.16 },
            browUp:   woken ? .34 : held ? .26 : .14,
            browKnit: rebuking ? .30 : .16,
            eyeNarrow:giving ? .44 : .26,
            smile:    held ? .34 : giving ? .26 : woken ? .12 : 0,
            mouthAsym:giving ? .48 : .22,
            status:   held ? "HE IS GLAD" : giving ? "SHE IS TAKING THEM"
                    : rebuking ? "HE SAYS NOTHING" : asleep ? "THE BEGGAR"
                    : "HIS WIFE",
            progress: Math.min(.96, .16 + .76*(t/D)),
          },
        });
      }});
    }

    /* PENELOPE — not painted until she is at the head of the stair. Beautified,
       then the rebuke, then the ask, then a queen receiving. */
    if (t >= P_IN){
      const p = blk.penelope;
      const s = st.penelope || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, penelope, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_PEN * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "profile_left",
            gaze: s.gaze || { x:-.30, y:.18 },
            mouth:   rebuking ? .55 : asking ? .40 : -.15,
            browUp:  woken ? .30 : held ? .18 : .12,
            browKnit:rebuking ? .52 : asking ? .22 : .06,
            frown:   rebuking ? .34 : 0,
            eyeNarrow:held ? .22 : rebuking ? .18 : 0,
            jaw:     rebuking || asking ? .30 : 0,
            status:  held ? "HERS NOW" : giving ? "THE GIFTS ASKED FOR"
                   : asking ? "WHAT HE TOLD ME" : rebuking ? "UNDER YOUR ROOF"
                   : "WOKEN",
            progress: Math.min(.96, .10 + .84*(t/D)),
          },
        });
      }});
    }

    /* TELEMACHUS — he takes it. Attention, then a lowered head, then back up
       to watch what his mother is doing to the men in his hall. */
    {
      const p = blk.telemachus;
      const s = st.telemachus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, telemachus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_TEL * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "three_quarter_right",
            gaze: s.gaze || { x:.30, y:-.04 },
            mouth:  rebuking ? -.45 : -.05,
            browUp: woken ? .40 : rebuking ? .30 : .20,
            browKnit:rebuking ? .44 : .10,
            frown:  rebuking ? .30 : 0,
            eyeWide:woken ? .34 : .12,
            status: held ? "HE LETS HER" : giving ? "HE WATCHES"
                  : rebuking ? "HE TAKES IT" : woken ? "HIS MOTHER" : "THE HALL",
            progress: Math.min(.96, .12 + .80*(t/D)),
          },
        });
      }});
    }

    draws.sort((a, b) => a.y - b.y).forEach(d => d.run());

    /* --- THE QUEUE, last: every bearer is nearer than every named body ----
       density 0.60 drops the deep band, whose heads would print above the sill
       man's feet at his own x. The asset's door, dais, overhead catalogue and
       reaction track are all off — this stage has its own — and the receiving
       bracket is moved onto the flagstones in front of the queen's feet. */
    if (t >= Q_IN){
      const p  = blk.penelope;
      const wv = qFront(t);
      /* her x, in box units, held off the canvas edge so both halves of the
         bracket land on paper instead of under the border key */
      const fx = clamp((p.x - QBOX.x) / QBOX.w + 0.5, 0.06, 0.90);
      const fy = ((p.y + 0.086) - (QBOX.y - QBOX.h)) / QBOX.h;
      const state = {
        formation:"queue", density:Q_DENSITY, depth:1.0,
        attention: lerp(0.50, 0.92, clamp((t - Q_IN) / 8, 0, 1)),
        wave: wv, waveSpread: lerp(0.44, 0.30, wv),
        raise: lerp(0.42, 1.0, clamp((t - Q_IN) / 6, 0, 1)),
        focus:{ x:fx, y:fy },
        showDoor:false, showDais:false, showIndex:false, showFront:false,
        t: Math.min(.98, t / D),
        status: held ? "PRESENTED" : "OUTBIDDING",
        progress: Math.min(.96, .34 + .6*(t/D)),
      };
      placePlate(offctx, W, H, queue, { x:QBOX.x, y:QBOX.y }, QBOX.w, QBOX.h, state,
        `q|${Math.round(wv*20)}|${Math.round(state.raise*20)}|${Math.round(state.attention*20)}`,
        0.85);
    }
  },
};
export default scene;

/* named binding so the next scene of the book can
   `import { exitOccupancy as INITIAL }` — the scene-object property alone
   cannot be linked.

   NOTE FOR THE NEXT SCENE. These are MEGARON stations and can be imported
   straight. Four bodies are in it: Odysseus still on `threshold`, Penelope on
   `bench_r1`, Telemachus on `bench_l1` and Amphinomus back on `bench_l2`. The
   gifts are on the floor in front of the queen and they are hers; the two maids
   who came down with her are behind her at the stair foot and have no station
   yet — give them one before painting them. */
export const exitOccupancy = scene.exitOccupancy;
