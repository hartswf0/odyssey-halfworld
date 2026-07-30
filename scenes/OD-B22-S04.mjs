/* ============================================================
   SCENE  OD-B22-S04 — Melanthius Arms the Suitors   (Od. 22.126–200)
   Book XXII, scene 4. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its predecessor,
   scenes/OD-B22-S03.mjs, whose room, props, corpses and near-floor window are
   inherited here verbatim.

   Beats (causal order, one master clock):
     1. Melanthius finds the storeroom route open — the door Telemachus admits
        he left unbarred in S03 — and carries shields, helmets and spears down
        the postern lane to the suitors.
     2. Odysseus sees the enemy suddenly armed and sends Eumaeus and Philoetius
        up the lane to find out who is doing it.
     3. They catch him at the store door on his second trip, arms still full.
     4. They lash his hands and feet behind him, rove a cord over the tie beam,
        haul him up the pillar and leave him hanging there alive.

   Every pixel figure below is in the stage's own 1120x760 space (renderScene
   hands stage() srcW=1120, srcH=760 and the PNG is that at DPR 2), and every
   one of them was COMPUTED off scenes/_plans/megaron.mjs through project(),
   not estimated.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM, NOT ROOMS. The atlas casts no location for this scene. It plays in
      the megaron, so the field is location.megaron-hall in state `contest`,
      anchor (.50,.99) scale 1.0, with the SAME layer list S01, S02 and S03
      used — so this hall registers to the pixel on all three and the four
      shots cut together. THE STATE STILL DOES NOT ADVANCE TO `battle`: that
      lifts the whole room an ink level, tumbles every board and lays the
      litter of bodies over the floor, which is the general slaughter from S05
      onward. Here the escalation is carried by what the SUITORS are holding,
      by the store-chamber window's duty cycle, and by the room's status word.
      `furniture`, `throne` and `litter` stay dropped for the reasons S01
      gives; `racks` stays kept and the pegs are still bare — the arms in this
      scene come out of the store, not off the walls.

   B. NO HAND-PLACED ANCHORS. Every body resolves through megaron.mjs by
      station NAME. There is not one hand anchor on a figure in this file. The
      one derived offset in it — the hoist — is computed from the room's own
      ceiling law (note F) and not chosen.

   C. THE LEFT LANE IS A ONE-BODY CORRIDOR, AND THE SCENE IS BLOCKED AROUND
      THAT FACT. `postern` (x .06 z .24 -> px 284, feet 455), `storeroom`
      (x .02 z .30 -> px 241, feet 475) and `bench_l1` (x .18 z .62 -> px 281,
      feet 589) all converge toward the spine with depth, so they land within
      43px of each other in x: any two standing bodies in that lane overlap.
      That is a property of the authored room, not something to work around, so
      the lane is TIME-SHARED and the overlaps that remain are all
      farther-behind-nearer occlusions with no two heads at one height:
        · t 0..9    Telemachus still holds `postern` (his post since S01) and
                    Melanthius is up in the store. He then comes down the axe
                    line to his father, and the lane goes unwatched — which is
                    the whole mechanism of beat 1.
        · t 12..19  Melanthius carries the first armful `storeroom` ->
                    `bench_l1`. He passes in FRONT of nobody: the lane is his.
        · t 29..42  Philoetius comes up it and takes the store door. Eumaeus
                    does NOT: he stops out in the hall.
        · t 43..50  Melanthius goes back up for more and is taken at the door.
      AND ONLY TWO BODIES ARE EVER IN IT. Draft 3 put Eumaeus at `bench_l1`
      (x 230..332) — 1px off the postern lane's own x — so from the seizure to
      the haul the frame carried Melanthius, Philoetius and Eumaeus stacked in
      one 100px column, and at TRUSS, with two of the three stooped over the
      knot, the three of them printed as one unreadable dark mass. He is at
      `table_l` instead (x 267..371, feet 618): out in the hall, in front of the
      boards the two dead suitors went over, 37px right of the lane and a whole
      depth band nearer the camera. He can watch the store door, take the fall
      and say the thing Homer gives him to say from there, and the lane stays a
      two-body corridor — which is what the room is.
      MEASURED at the closing frame, left to right: Melanthius hanging at
      `storeroom` (x 200..285, y 112..277), Philoetius at `postern` (x 244..324,
      head 268..300), Eumaeus at `table_l` (x 267..371, head 372..405). Three
      bodies, head bands 68 and 72px apart, and the only body-on-body overlap in
      the lane is the hanging man's dangling toes behind Philoetius' hair — an
      occlusion, not a fusion (note F).

   D. THE CONTACT PAIR IS THE ONE THE ASSET AUTHORED. character.philoetius
      carries the Book XXII poses this scene exists for — `phi_pursuit`,
      `phi_seizing`, `phi_binding`, `phi_hoisting`, `phi_craning` — and its
      `captiveGrip` anchor is documented as sitting OUTBOARD of its own near
      fist "so the seized body and the hand holding it are two coordinates,
      never one". So the cowherd is the man who touches Melanthius, and the two
      of them resolve to the paired lane stations `postern` / `storeroom`: 43px
      apart in x and a depth band apart, which is a grapple and not a
      coincidence. Eumaeus stands off at `table_l`, out of the lane and two depth
      bands nearer, and shares that station with nothing but the wrecked-tables
      PROP — he stands in front of the boards the two dead suitors went over,
      which is the reason that station and not another. He is
      mirrored so his gesture goes screen LEFT, up the lane, at the man; his
      poses come from the shared rig library (the module authors no Book XXII
      pose of its own) and his own staff and hide cloak come with him.

   E. THE LINE HANDS THE TWO MEN OVER, ONCE, AT THE ORDER.
      S03 stood Eumaeus and Philoetius in the shield-wall as ONE box,
      `ensemble.eumaeus-and-philoetius` at `axe_first`, because two men
      shoulder to shoulder in a line are a group and the asset's `arming`
      channel was the content of that scene. This scene needs them as
      individuals — the atlas asks for `character.eumaeus` and
      `character.philoetius`, and one seizes while the other watches — so at
      ORDER the box goes off and the two rig bodies come on. The box is drawn
      with S03's constants unchanged until that second and no frame ever shows
      both; `herdsmen` is therefore DROPPED from the inherited occupancy and
      replaced by two named entries, so the handoff to S05 is unambiguous
      rather than self-contradictory. Both men also keep the station the box
      held, `axe_first`, as the `from` of their first move: they walk out of
      the line they were standing in.
      (The line itself cannot be two rig figures: `axe_first`, `threshold`,
      `axe_last`, `hearth`, `shot_mark` and `throne` are all at plan x .50 and
      project to px 560, so exactly ONE rig body can stand on the spine —
      Odysseus, on the sill, who by plot never leaves it. The ensemble box is
      what puts two men at 470 and 650 without inventing a station.)

   F. THE HOIST IS A COMPUTED LIFT, AND HE SORTS BACKWARD AS HE RISES.
      character.melanthius-b22 owns the transformation: `bound` closes the cord
      on the wrists and ankles from the rig's OWN returned anchors, `hoist`
      lifts the whole rig clear of the floor and lays a fresh ground mark back
      down where he is no longer standing. That internal lift is 0.17 of the
      figure's own box — 44px at this station — which is a man off the ground,
      not a man at the roof. The rest of the rise is solved off the room's own
      ceiling law, the same un-clamped projection megaron-hall draws its roof
      with (ceil(z) = .50 - (.30 + .26 z^1.08)): haul him until his crown hangs
      CROWN_CLEAR of a frame height under the ceiling plane AT HIS OWN STATION.
      At `storeroom` that is ceil(.30)*H = 98 + 27 = 125, so from an unlifted
      crown of 281 the total lift is 155, of which the module already does 44
      and the placement does the remaining 111. His crown lands at 126, between
      the transverse roof beams at 90 and 125 — literally close under the roof
      beams, which is what the order in the poem says.
      And he sorts BACKWARD while he rises: he has gone up the pillar, which
      stands against the wall, so his draw depth is p.d - .12*hoist. Below .24
      he passes behind `postern`, and the man standing at the store door
      occludes the dangling feet instead of the feet printing over his head.
      No pixel of Melanthius is drawn by this file; ctx overpaint on every
      figure in this scene is ZERO.

   G. THE STORE CHAMBER IS A WINDOW, AND ITS DUTY CYCLE IS BEATS 3 AND 4.
      prop.storeroom-rope-and-rafter is authored as a whole-frame plate — a
      tie beam of three timbers at three depths, a masonry pillar, a belaying
      cleat, the fall, and a six-state ledger — whose legibility is pinned to
      its own canvas height. Solved as an object standing in the megaron it
      would dissolve; and it is not in the megaron anyway. The binding and the
      hoisting happen INSIDE the arms-store, off the hall, which a shot of the
      hall cannot show. So the chamber is laid down the way OD-B21-S02 and S03
      lay down their instruments: as a DETAIL WINDOW with its own paper field
      and one hard rule, blitted at a declared crop, drawn last.
        · WINDOW = x .05..0.72, y .34..0.904 of a 1120x760 drawing — the
          pillar and its cleat, the bearing point on the middle timber, the
          load, the rise dimension up the left margin, the floor hatches, the
          arms standing on the store floor, and the six-state ledger. The
          header's seven-segment counts are cropped OUT on purpose: at this
          reduction they would be 12px numerals in a dot lattice, which is
          exactly the failure the brief names. What the window carries is
          GEOMETRY — where the cord bears, how many turns are on the cleat,
          how far off the floor the load is.
        · DESTINATION = x .560..0.953, y .048..0.380 (440x252, the crop's own
          1.748 aspect, so nothing is stretched). It takes the patch of far
          wall S03 put its formation plan in: bottom edge y 289 against the
          highest crown under it (Eurymachus' at 311) and left edge 627
          against Odysseus' right shoulder at 605.
        · MODE walks `coiled` -> `tied` -> `hoist` -> `suspended` on the same
          clock as the bodies. It is open from t=0 because from t=0 the store
          chamber IS the subject: `coiled` is that room standing as it stands,
          with the arms on its floor and the cord made up and the beam bare —
          the thing Melanthius is robbing. It becomes a machine at TRUSS.

   H. THE ENEMY ARMING IS AN ENSEMBLE CHANNEL, NOT A POSE CUT.
      ensemble.armed-suitors is built for exactly this scene: one member
      template instanced over depth bands, and a single ARMING FRONT (`wave`,
      softened by `waveSpread`, ceilinged by `arming`) opening out of the
      supply point. Men inside the front have gear and face the sill; men
      outside it are still being shot at in the dark. The conversion is drawn
      by the asset, and the scene only says how far the front has swept.
        · It stands on S02/S03's box, on S02/S03's two stations, with S02/S03's
          midX, so the mass does not jump between adjacent shots: cw 415,
          ch 380, x = corner_dead.x*W - .68*cw, y = bench_l2.y*H - .86*ch.
          It runs off the near-left edge exactly as it has since S02, and its
          members print 74px (back band) and 150px (front band) because the
          template sizes itself in absolute pixels rather than in fractions of
          its box — the same read S02 and S03 published.
        · `supplyX` is moved to .90 and `targetX` to .99: in THIS room the
          store lane and the great doors are both up and to the right of the
          near-left corner, so the gear arrives from Melanthius on their right
          and the armed men turn bodily onto the sill, also right. The
          `supply` layer — the chest, the leaning shields, the standing bundle
          of spears — comes in only at HAND, because until then there is no
          heap: it is the armful he just put down.
        · `hall`, `floor`, `gauge`, `cover` and `volley` are OFF. The first two
          would print a second architecture and a second set of floor lines
          over the megaron's own; `cover` a second wreck beside the real
          overturned boards; and `volley`'s flight lanes are authored to cross
          ITS canvas up and to the left, which in this placement throws spears
          away from the door they are aimed at. `arming-front` is off because
          its dashed arc is drawn in ACCENT, and the POST pass quantizes by
          luminance — a blue arc prints BLACK, and a black dashed ellipse
          across the near-left floor is not a semantic accent, it is a stain.

   I. THE ISSUE REGISTER, THE BOARDS, THE CORPSES AND THE CROWD-SIDE PROPS ARE
      INHERITED VERBATIM. prop.defender-armor-set's eight-notch ledger stays in
      S03's crop at S03's destination on the one clear strip of near floor, in
      mode `throw` — the four defenders' count does not change in this scene,
      and holding it still is the point: the shafts on the near floor are the
      same shafts while the ENEMY's count goes from nothing to a rank. The
      three dead keep S03's stations, poses, faces and constants; the wrecked
      dining tables and Antinous' overturned board keep S03's window geometry
      and reference points. Nothing in the room moves between two adjacent
      shots except the people whose business this scene is.

   J. TONE. The room is in a lift-0 state; six rig figures with no overpaint
      anywhere; one ensemble box of light shields and dark bosses; two windows
      that are mostly paper with dark accents on the cleat, the load straps and
      the notch beads. The upper-left quarter, the right-hand floor and the
      whole near-right band stay paper, and the darkest masses in the frame are
      still the roof beams the room owns.

   CONTINUITY IN — INHERITED, NOT ASSERTED.
      import { exitOccupancy as PREV_EXIT } from "./OD-B22-S03.mjs";
   S03 ends in THIS room and every station it hands over (`threshold`,
   `postern`, `pillar_r`, `pillar_l`, `bench_r1`, `table_l`, `table_r`,
   `corner_dead`, `axe_first`) is a megaron station, so no translation table is
   needed and NOBODY IS DROPPED FOR BEING IN ANOTHER ROOM. One key is dropped
   for a different reason: `herdsmen`, the two-man ensemble box, is replaced by
   the individual entries `eumaeus` and `philoetius` (note E). One key is
   added: `melanthius`, who comes in through the raised side passage and is
   already up in the store when the scene opens.

   Verify (the delivery, and the man on the beam):
     node harness/render-scene.mjs scenes/OD-B22-S04.mjs --t 20
     node harness/render-scene.mjs scenes/OD-B22-S04.mjs --t 70
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import melanthius  from "../assets/character/melanthius-b22.mjs";
import eumaeus     from "../assets/character/eumaeus.mjs";
import philoetius  from "../assets/character/philoetius.mjs";
import eurymachus  from "../assets/character/eurymachus.mjs";
import amphinomus  from "../assets/character/amphinomus.mjs";
import antinous    from "../assets/character/antinous.mjs";
import armedSuitors from "../assets/ensemble/armed-suitors.mjs";
import herdsmen    from "../assets/ensemble/eumaeus-and-philoetius.mjs";
import tables      from "../assets/prop/raised-dining-tables.mjs";
import board       from "../assets/prop/antinouss-cup-and-feast-table.mjs";
import armour      from "../assets/prop/defender-armor-set.mjs";
import rope        from "../assets/prop/storeroom-rope-and-rafter.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 72;

/* the same room S01, S02 and S03 leave behind, layer for layer (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth","axes"];

/* ---- THE CLOCK ---------------------------------------------------------- */
const LEAVE0  = 2;    // Telemachus leaves the side door for the axe line
const LEAVE1  = 9;    //   ... and the lane is unwatched from here
const DELIV0  = 12;   // Melanthius comes out of the store with the first load
const DELIV1  = 19;   //   ... and reaches the suitors
const HAND    = 21;   // the gear is put down: the arming front opens
const SEE     = 25;   // Odysseus sees bronze in their hands
const OWN     = 27;   // Telemachus: the open door was mine
const ORDER   = 29;   // "go up and see who is arming them" — the line splits
const BACK0   = 43;   // Melanthius starts back up for more
const BACK1   = 50;   //   ... and walks into them at the door
const CAUGHT  = 52;   // taken, arms still full
const TRUSS   = 57;   // hands and feet lashed behind him
const HOIST0  = 61;   // the fall taken in
const HOIST1  = 68;   // close under the roof beams

/* ---- CONTINUITY IN (note "CONTINUITY IN", note E) ----------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B22-S03.mjs";
const { herdsmen: _lineBox, ...CARRIED } = PREV_EXIT;   // the box becomes two men
const ENTERING = {
  melanthius: "storeroom",   // already up in the store when the scene opens
  eumaeus:    "axe_first",   // standing in the line the box held
  philoetius: "axe_first",
};
const INITIAL = { ...CARRIED, ...ENTERING };

/* ---- BLOCKING. Stations, not coordinates (notes B, C, D). --------------- */
const MOVES = [
  // the side door goes unwatched, which is beat 1's mechanism
  { who:"telemachus", from:"postern",   to:"axe_last",  t0:LEAVE0, t1:LEAVE1 },
  // the traitor's two trips
  { who:"melanthius", from:"storeroom", to:"bench_l1",  t0:DELIV0, t1:DELIV1 },
  { who:"melanthius", from:"bench_l1",  to:"storeroom", t0:BACK0,  t1:BACK1  },
  // the two loyal men walk out of the line: one takes the store door, the other
  // stops out in the hall at the wrecked boards (note C)
  { who:"eumaeus",    from:"axe_first", to:"table_l",   t0:ORDER,    t1:ORDER+11 },
  { who:"philoetius", from:"axe_first", to:"postern",   t0:ORDER+2,  t1:ORDER+13 },
];

/* one figure scale for the whole cast; the plan's depth law does the rest */
const K = 0.42;
/* the rig plants its ankles at 0.90 of its box, and 0.752 of a figure box is
   surviving ink — both measured in S01 and used unchanged since. */
const FIG_INK = 0.752;

/* placeFigure — verbatim in intent from S01/S02/S03: the lift puts FEET on the
   mark. Every figure in this scene is pure rig with no ctx-drawn cloth, so the
   default landscape box is the regime the modules were authored in. */
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  placeInstance(offctx, W, H, mod, {
    anchor:{ x:anchor.x, y:anchor.y + 0.10 * scale }, scale, state,
  });
}

/* ---- THE HOIST, solved off the room's own ceiling law (note F) ----------- */
/* megaron-hall's un-clamped ceiling: the same formula, so the man and the roof
   he is hauled up to agree by construction. */
const ceilAt = z => 0.50 - (0.30 + 0.26 * Math.pow(z, 1.08));
/* The hoisted rig does not fill its box the way a standing rig does, so FIG_INK
   is the wrong ruler for it. These two are MEASURED off the module's own card,
   renders/character__melanthius-b22__hoisted.png: with hoist=1 its surviving
   ink runs from 0.111 to 0.750 of the box height (the module's own internal
   0.17 lift is already inside those numbers, so it must not be counted twice),
   and both transfer to this scene unchanged because the rig sizes itself off
   min(H*0.90, W*1.26) and the box here is height-limited exactly as the card
   is. Draft 1 used FIG_INK and over-lifted: his dangling toes came down into
   the top of Philoetius' head. */
const HOIST_TOP = 0.111, HOIST_BOT = 0.750;
/* CROWN_CLEAR: how far under the ceiling plane AT HIS OWN STATION the crown
   hangs. 0.018 of a frame height = 14px, which at `storeroom` lands the crown
   at y 112 — under the ceiling line (98) and clear of the transverse roof beam
   that crosses at 90..99, so his head is among the beams and not fused to one.
   His toes then land at 277, 9px into the top of Philoetius' hair — and he
   sorts BEHIND `postern` while he rises (note F), so those 9px are the cowherd
   occluding the feet, which is the right way round. */
const CROWN_CLEAR = 0.018;
function hoistExtra(H, p){
  const boxH  = H * K * p.scale;
  const boxTop = (p.y + 0.10 * K * p.scale) * H - boxH;    // placeFigure's own box
  const crownTarget = (ceilAt(p.d) + CROWN_CLEAR) * H;
  return Math.max(0, boxTop + HOIST_TOP * boxH - crownTarget);
}
const ramp = (t, a, b) => clamp01((t - a) / Math.max(1e-6, b - a));

/* ---- WINDOW MACHINERY (note G, device verbatim from S03 / OD-B21-S02) --- */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* a DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses. Keyed straight onto the room, the roof
   plane's rafters run through the drawing and it stops reading as a diagram. */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save(); offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h); offctx.restore();
}
/* and the rule goes on AFTERWARDS: the sheets' floor planes are level-1 fills,
   not paper, so borderKey does not key them out and the blit lays an opaque
   light plane over anything drawn under it. 7px, because a 5px rule on paper
   comes back out of the dotify pass dotted. */
function detailRule(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save(); offctx.strokeStyle = INK; offctx.lineWidth = 7;
  offctx.strokeRect(x + 3.5, y + 3.5, w - 7, h - 7); offctx.restore();
}

/* THE STORE CHAMBER — the rope prop's chamber in elevation (note G).
   THE SHEET IS PORTRAIT. Every PROP in this atlas is authored against the
   harness card, 660x880 — 3:4 — and this one's geometry is all fractions of its
   own W and H. Draft 1 keyed it at 1120x760 like the scene, which stretched the
   chamber to 2.3x its width and squashed its height: the tie beam printed as a
   thin bar across the top of the window and the pillar, the cleat and the load
   collapsed into specks. It is keyed at 780x1040 here — the authored 3:4, at
   more than card resolution so the reduction has marks to give away. */
const ROPE_CW = 780, ROPE_CH = 1040;
const ROPE_WIN = { x0:.030, y0:.385, x1:.960, y1:.827 };   // 725 x 460, 1.577:1
const ROPE_DST = { x0:.620, y0:.048, x1:.955, y1:.361 };   // 375 x 238, 1.577:1
/* AND IT OPENS AT TRUSS, NOT AT t=0. Draft 1 held it open from the first frame
   in mode `coiled` on the argument that the store chamber is the subject from
   the start. It is — but `coiled` has no load, nothing rove and a bare beam, so
   for fifty-seven seconds the window printed a 375x238 panel with a pillar down
   one edge and paper in the middle: the largest dead area in the frame, and a
   diagram of a machine that had not been built. This is the same call S03 makes
   about its formation plan. What is up before TRUSS is the count instead. */
const ropeMode = t => t < HOIST0 ? "tied"
                    : t < HOIST1 ? "hoist"
                    :              "suspended";

/* THE ARMING TALLY — the ensemble's OWN readout, up while its count is the
   subject (note H). Two columns of eight cells, panicked emptying into armed,
   with a transfer arrow between them and three per-band pips: no type at all,
   which is why it survives the reduction. It is keyed at 1140x1140 — EXACTLY
   3x the crowd box, which is square — so `level` and `bands` are computed off
   the same member geometry the mass on the floor is drawn from and the two can
   never disagree. */
const TALLY_CW = 1140, TALLY_CH = 1140;
/* the crop starts left of the instrument's open bracket and right of its band
   pips: drawn to its own edges, draft 1 cut both off against the window rule. */
const TALLY_WIN = { x0:.555, y0:.070, x1:.700, y1:.255 };  // 165 x 211, 0.782:1
const TALLY_DST = { x0:.806, y0:.048, x1:.955, y1:.328 };  // 167 x 213, 0.784:1

/* THE ISSUE REGISTER — S03's crop of the armour set at S03's destination (I) */
const ARM_CW = 820, ARM_CH = Math.round(820 * 760 / 1120);   // 820 x 556
const ARM_WIN = { x0:.137, y0:.856, x1:.863, y1:.940 };
const ARM_DST = { x0:.300, y0:.880, x1:.682, y1:.924 };

/* ---- THE LINE'S BOX, solved off the plan's depth law (note E) ------------
   S03's constants: ch is the height at which the ensemble's own front-band
   fraction equals the figure height the plan gives at `axe_first`. */
const HERD = { front:0.585, footY:0.955, centre:0.470 };
function herdBox(W, H, p){
  const ch = FIG_INK * H * K * p.scale / HERD.front;
  const cw = ch * W / H;
  return { x: p.x * W - HERD.centre * cw, y: p.y * H - HERD.footY * ch,
           w: Math.round(cw), h: Math.round(ch) };
}
function placeHerds(offctx, W, H, p, state){
  const b = herdBox(W, H, p);
  const sig = `hp|${state.formation}|${Math.round((state.arming ?? 0) * 20)}`
            + `|${Math.round((state.attention ?? 0) * 20)}`;
  offctx.drawImage(keyedModuleCanvas(herdsmen, b.w, b.h, state, sig), b.x, b.y);
}

/* ---- THE THREE DINING TABLES — S03's constants, unchanged (note I) ------- */
const TAB_CW = 312, TAB_CH = Math.round(312 * 760 / 1120);   // 312 x 212
const TAB_WIN = { x0:.190, x1:1.0, y0:0, y1:1.0 };
const TAB_REF_X = .44;
const TAB_REF_Y = { set:.933, shoved:.972, raised:.908, wrecked:.759 };
const TAB_STATION = "table_l";
function placeTables(offctx, W, H, state){
  const p  = megaron.at(TAB_STATION, { kind:"prop" });
  const ww = (TAB_WIN.x1 - TAB_WIN.x0) * TAB_CW;
  const wh = (TAB_WIN.y1 - TAB_WIN.y0) * TAB_CH;
  const x  = p.x * W - (TAB_REF_X - TAB_WIN.x0) * TAB_CW;
  const y  = p.y * H - (TAB_REF_Y[state.config] - TAB_WIN.y0) * TAB_CH;
  const cv = keyedModuleCanvas(tables, TAB_CW, TAB_CH, state,
               `tab|${state.config}|${Math.round((state.strike ?? 1) * 20)}`);
  offctx.drawImage(cv,
    TAB_WIN.x0 * TAB_CW, TAB_WIN.y0 * TAB_CH, ww, wh, x, y, ww, wh);
}

/* ---- ANTINOUS' OWN BOARD — S01/S02/S03 constants, unchanged (note I) ----- */
const PROP_CW = 289, PROP_CH = 504;
const PROP_WIN = { x0:.150, y0:.386, x1:.940, y1:.858 };
const PROP_BOARD = { x0:.185, x1:.672, floor:.808 };
function placeBoard(offctx, W, H, state){
  const p  = megaron.at("table_r", { kind:"prop" });
  const ww = (PROP_WIN.x1 - PROP_WIN.x0) * PROP_CW;
  const wh = (PROP_WIN.y1 - PROP_WIN.y0) * PROP_CH;
  const fx = ((PROP_BOARD.x0 + PROP_BOARD.x1) / 2 - PROP_WIN.x0) * PROP_CW / ww;
  const fy = (PROP_BOARD.floor - PROP_WIN.y0) * PROP_CH / wh;
  const cv = keyedModuleCanvas(board, PROP_CW, PROP_CH, state, `board|${state.mode}`);
  offctx.drawImage(cv,
    PROP_WIN.x0 * PROP_CW, PROP_WIN.y0 * PROP_CH, ww, wh,
    p.x * W - fx * ww, p.y * H - fy * wh, ww, wh);
}

/* ---- THE ENEMY, ARMING — S02/S03's box, new module (note H) -------------- */
/* S02/S03's box, to the pixel: cw 415, ch 380, midX .68 on `corner_dead` and
   nearRow .86 on `bench_l2`, so the mass does not move between four adjacent
   shots. Only `rows` and `perRow` change, from S03's two thin ranks of a beaten
   huddle to three of a mob being issued gear — and the near rank clears the
   nearest living man in the frame (Eumaeus at `table_l`, left edge 267) by 35px. */
const CROWD = { cw:415, ch:380, rows:3, perRow:[3,4,4], nearRow:0.86, midX:0.68 };
function placeCrowd(offctx, W, H, state){
  const x = megaron.at("corner_dead").x * W - CROWD.midX * CROWD.cw;
  const y = megaron.at("bench_l2").y * H - CROWD.nearRow * CROWD.ch;
  const sig = `as|${state.formation}|${Math.round((state.wave ?? 0)*20)}`
            + `|${Math.round((state.arming ?? 0)*20)}`
            + `|${(state.layers||[]).join("")}`;
  offctx.drawImage(keyedModuleCanvas(armedSuitors, CROWD.cw, CROWD.ch, state, sig), x, y);
}
/* ONE front sweeps out of the heap he put down. Before HAND there is no gear in
   the room at all, so the ceiling is zero and every man is still panicking. */
function crowdAt(t){
  const swept = ramp(t, HAND, CAUGHT);
  const gear  = t < HAND ? 0 : 1;
  return {
    formation: t < HAND   ? "huddle"
             : t < ORDER  ? "supply-line"
             : t < CAUGHT ? "ranks"
             :              "volley",
    arming: gear,
    wave:   t < HAND ? 0 : 0.10 + 1.05 * swept,
    waveSpread: 0.34,
    volley: t < ORDER ? 0 : 0.30,
    attention: 0.92,
    rows:CROWD.rows, perRow:CROWD.perRow, density:1.0,
    supplyX:0.90, supplyY:0.50, targetX:0.99, targetY:0.20,
    showHall:false, showGauge:false, showFront:false,
    showVolley:false, showCover:false, showSupply:t >= HAND,
    /* THREE band layers, and `band-mid` is not optional: the module maps a
       member's row to bandLayer[min(row,2)], so with rows:3 the middle and
       front ranks live in `band-mid` and `band-front`. Draft 1 passed
       ["band-back","band-front"] and silently dropped the entire near rank —
       the mass printed as two 74px men alone on the near-left floor. */
    layers: t >= HAND ? ["supply","band-back","band-mid","band-front"]
                      : ["band-back","band-mid","band-front"],
    status: t < HAND   ? "NOTHING IN THEIR HANDS"
          : t < ORDER  ? "THE ARMS COME DOWN THE LANE"
          : t < CAUGHT ? "SHIELDS ON THEIR ARMS"
          :              "A RANK OF THEM",
  };
}

export const scene = {
  id:"OD-B22-S04",
  title:"Melanthius Arms the Suitors",
  book:22,
  plan:"megaron",
  duration:D,
  beats:[
    "Telemachus leaves the side door for the axe line and the postern lane goes unwatched.",
    "Melanthius finds the storeroom route still open and carries shields, helmets and spears down to the suitors.",
    "Odysseus sees bronze in the enemy's hands and sends Eumaeus and Philoetius up the lane to find out who is arming them.",
    "They catch Melanthius at the store door on his second trip, his arms still full.",
    "They lash his hands and feet behind him, rove a cord over the tie beam and haul him up the pillar.",
    "They leave him hanging close under the roof beams, alive, and go back down to the sill.",
  ],
  exitState:
    "The megaron, still in its contest state — great doors shut, hearth raked " +
    "flush, the twelve axe helves standing down the spine, the wall pegs still " +
    "bare — with the near end of it held and the suitors NO LONGER UNARMED. " +
    "MELANTHIUS HANGS IN THE ARMS-STORE off the postern lane (`storeroom`), " +
    "hands and feet lashed behind him and a cord rove over the tie beam and " +
    "made fast with three turns at the pillar cleat: bound 1, hoist 1, his " +
    "crown close under the roof beams, alive and in pain. That is the state " +
    "S05 inherits and nothing in the poem takes him down. He got two loads out " +
    "of the store before they took him: the suitors at `corner_dead` now have " +
    "shields on their arms, helmets on, spears cocked and their faces turned " +
    "on the sill — the arming front has swept the whole mass, so the fight " +
    "from here is armed men against armed men. Philoetius holds the store " +
    "door (`postern`), Eumaeus is out in the hall at the wrecked boards "+
    "(`table_l`) with the fall in his hands; " +
    "both walked out of the shield-wall at `axe_first` on Odysseus' order and " +
    "have not yet gone back down to it. Odysseus has still not moved off the " +
    "great threshold (`threshold`), as himself, guise `restored`, spears in " +
    "hand and the bow against the doorpost. Telemachus has left the side door " +
    "for the last axe helve (`axe_last`), having said out loud that the open " +
    "storeroom was his doing. Eurymachus is still down at the right " +
    "roof-pillar (`pillar_r`), Amphinomus at the left (`pillar_l`), Antinous " +
    "across his own overturned board (`bench_r1` / `table_r`), and the three " +
    "dining tables (`table_l`) are still wrecked. The four defenders' " +
    "panoplies (`arms`) are still issued at `axe_first`, eight shafts of which " +
    "two have been thrown.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared box or
     window. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.29, band:"threeq", pose:"confrontation" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.25,y:.60}, scale:.30, band:"threeq", pose:"protective_block" },
    { asset:"character.melanthius-b22", instance:"melanthius",
      anchor:{x:.22,y:.63}, scale:.34, band:"threeq", pose:"m22_slip" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.28,y:.81}, scale:.43, band:"threeq", pose:"eum_ward" },
    { asset:"character.philoetius", instance:"philoetius",
      anchor:{x:.25,y:.60}, scale:.33, band:"threeq", pose:"phi_barred" },
    { asset:"ensemble.eumaeus-and-philoetius", instance:"line_01",
      anchor:{x:.50,y:.47}, scale:.43, state:"guard-door" },
    { asset:"character.eurymachus", instance:"eurymachus",
      anchor:{x:.66,y:.69}, scale:.41, band:"threeq", pose:"kneel" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.34,y:.69}, scale:.38, band:"threeq", pose:"kneel" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.75,y:.77}, scale:.38, band:"threeq", pose:"crouch" },
    { asset:"prop.raised-dining-tables", instance:"tables_01",
      anchor:{x:.29,y:.81}, scale:.28, state:"wrecked" },
    { asset:"prop.antinouss-cup-and-feast-table", instance:"board_01",
      anchor:{x:.71,y:.81}, scale:.23, state:"overturned" },
    { asset:"prop.defender-armor-set", instance:"arms",
      anchor:{x:.50,y:.94}, scale:.53, state:"throw" },
    { asset:"prop.storeroom-rope-and-rafter", instance:"rope_01",
      anchor:{x:.76,y:.21}, scale:.39, state:"coiled" },
    { asset:"ensemble.armed-suitors", instance:"suitors_01",
      anchor:{x:.12,y:.91}, scale:.37, state:"cornered" },
  ],

  timeline:[
    // opening frame = S03's closing frame
    { op:"actor.pose",  target:"odysseus",    at:0.0,     args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",    at:0.0,     args:{ gaze:{ x:.42, y:.10 } } },
    { op:"actor.pose",  target:"telemachus",  at:0.0,     args:{ pose:"protective_block" } },
    { op:"actor.gaze",  target:"telemachus",  at:0.0,     args:{ gaze:{ x:.22, y:.08 } } },
    { op:"actor.pose",  target:"melanthius",  at:0.0,     args:{ pose:"m22_slip" } },
    { op:"actor.gaze",  target:"melanthius",  at:0.0,     args:{ gaze:{ x:.66, y:-.04 } } },
    { op:"actor.pose",  target:"eurymachus",  at:0.0,     args:{ pose:"kneel" } },
    { op:"actor.pose",  target:"amphinomus",  at:0.0,     args:{ pose:"kneel" } },
    { op:"actor.pose",  target:"antinous",    at:0.0,     args:{ pose:"crouch" } },
    { op:"prop.state",  target:"tables_01",   at:0.0,     args:{ config:"wrecked" } },
    { op:"prop.state",  target:"board_01",    at:0.0,     args:{ mode:"overturned" } },
    { op:"prop.state",  target:"arms",        at:0.0,     args:{ mode:"throw" } },
    { op:"prop.state",  target:"rope_01",     at:0.0,     args:{ mode:"coiled" } },
    { op:"crowd.state", target:"line_01",     at:0.0,     args:{ formation:"guard-door" } },
    { op:"crowd.state", target:"suitors_01",  at:0.0,     args:{ status:"NOTHING IN THEIR HANDS" } },
    // 1. the side door goes unwatched
    { op:"actor.gaze",  target:"telemachus",  at:LEAVE0,  args:{ gaze:{ x:.30, y:-.10 } } },
    { op:"sound.cue",   target:"telemachus",  at:LEAVE0,  args:{ src:"postern", cue:"he comes down the axe line to his father" } },
    { op:"actor.pose",  target:"telemachus",  at:LEAVE1,  args:{ pose:"one_arm_raised" } },
    // 2. the traitor works the store
    { op:"actor.pose",  target:"melanthius",  at:DELIV0,  args:{ pose:"m22_load" } },
    { op:"actor.gaze",  target:"melanthius",  at:DELIV0,  args:{ gaze:{ x:-.30, y:.14 } } },
    { op:"sound.cue",   target:"melanthius",  at:DELIV0,  args:{ src:"storeroom", cue:"shields, helmets, spears — out of the open door" } },
    { op:"actor.exit",  target:"melanthius",  at:DELIV0,  args:{ via:"postern-lane", note:"the orsothyre nobody closed" } },
    { op:"prop.state",  target:"suitors_01",  at:HAND,    args:{ supply:"heap" } },
    { op:"crowd.state", target:"suitors_01",  at:HAND,    args:{ status:"THE ARMS COME DOWN THE LANE" } },
    { op:"actor.pose",  target:"melanthius",  at:HAND+2,  args:{ pose:"m22_swagger" } },
    // 3. the sill sees it
    { op:"actor.pose",  target:"odysseus",    at:SEE,     args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",    at:SEE,     args:{ gaze:{ x:-.40, y:.26 } } },
    { op:"sound.cue",   target:"odysseus",    at:SEE,     args:{ src:"threshold", cue:"they have bronze in their hands" } },
    { op:"actor.pose",  target:"telemachus",  at:OWN,     args:{ pose:"palm_up_question" } },
    { op:"actor.gaze",  target:"telemachus",  at:OWN,     args:{ gaze:{ x:-.10, y:-.42 } } },
    { op:"sound.cue",   target:"telemachus",  at:OWN,     args:{ src:"axe_last", cue:"the open storeroom was mine" } },
    { op:"actor.gaze",  target:"odysseus",    at:ORDER,   args:{ gaze:{ x:-.46, y:.10 } } },
    { op:"sound.cue",   target:"odysseus",    at:ORDER,   args:{ src:"threshold", cue:"go up and see who is arming them" } },
    { op:"actor.pose",  target:"eumaeus",     at:ORDER,   args:{ pose:"walk_neutral" } },
    { op:"actor.pose",  target:"philoetius",  at:ORDER+2, args:{ pose:"phi_pursuit" } },
    { op:"crowd.state", target:"suitors_01",  at:ORDER,   args:{ status:"SHIELDS ON THEIR ARMS" } },
    // 4. the catch
    { op:"actor.pose",  target:"melanthius",  at:BACK0,   args:{ pose:"m22_slip" } },
    { op:"actor.gaze",  target:"melanthius",  at:BACK0,   args:{ gaze:{ x:.58, y:.02 } } },
    { op:"actor.pose",  target:"philoetius",  at:ORDER+13,args:{ pose:"phi_barred" } },
    { op:"actor.pose",  target:"eumaeus",     at:ORDER+11,args:{ pose:"eum_ward" } },
    { op:"actor.pose",  target:"melanthius",  at:CAUGHT,  args:{ pose:"m22_caught" } },
    { op:"actor.gaze",  target:"melanthius",  at:CAUGHT,  args:{ gaze:{ x:.56, y:-.22 } } },
    { op:"actor.pose",  target:"philoetius",  at:CAUGHT,  args:{ pose:"phi_seizing" } },
    { op:"actor.gaze",  target:"philoetius",  at:CAUGHT,  args:{ gaze:{ x:-.40, y:.20 } } },
    { op:"sound.cue",   target:"philoetius",  at:CAUGHT,  args:{ src:"postern", cue:"they take him at the door" } },
    // 5. the binding and the haul
    { op:"actor.pose",  target:"melanthius",  at:TRUSS,   args:{ pose:"m22_truss" } },
    { op:"actor.gaze",  target:"melanthius",  at:TRUSS,   args:{ gaze:{ x:-.14, y:.52 } } },
    { op:"actor.pose",  target:"philoetius",  at:TRUSS,   args:{ pose:"phi_binding" } },
    { op:"actor.gaze",  target:"philoetius",  at:TRUSS,   args:{ gaze:{ x:-.28, y:.62 } } },
    { op:"prop.state",  target:"rope_01",     at:TRUSS,   args:{ mode:"tied" } },
    { op:"actor.pose",  target:"eumaeus",     at:TRUSS,   args:{ pose:"reach_forward" } },
    { op:"actor.pose",  target:"melanthius",  at:HOIST0,  args:{ pose:"m22_hoist" } },
    { op:"actor.gaze",  target:"melanthius",  at:HOIST0,  args:{ gaze:{ x:-.18, y:.44 } } },
    { op:"actor.pose",  target:"philoetius",  at:HOIST0,  args:{ pose:"phi_hoisting" } },
    { op:"actor.gaze",  target:"philoetius",  at:HOIST0,  args:{ gaze:{ x:-.18, y:-.56 } } },
    { op:"actor.pose",  target:"eumaeus",     at:HOIST0,  args:{ pose:"both_hands_raised" } },
    { op:"prop.state",  target:"rope_01",     at:HOIST0,  args:{ mode:"hoist" } },
    // 6. left hanging
    { op:"prop.state",  target:"rope_01",     at:HOIST1,  args:{ mode:"suspended" } },
    { op:"actor.pose",  target:"philoetius",  at:HOIST1,  args:{ pose:"phi_craning" } },
    { op:"actor.gaze",  target:"philoetius",  at:HOIST1,  args:{ gaze:{ x:-.16, y:-.78 } } },
    { op:"actor.pose",  target:"eumaeus",     at:HOIST1,  args:{ pose:"eum_speak" } },
    { op:"actor.gaze",  target:"eumaeus",     at:HOIST1,  args:{ gaze:{ x:-.34, y:-.62 } } },
    { op:"sound.cue",   target:"eumaeus",     at:HOIST1,  args:{ src:"table_l", cue:"now you will keep watch all night, Melanthius" } },
    { op:"crowd.state", target:"suitors_01",  at:HOIST1,  args:{ status:"A RANK OF THEM" } },
    { op:"timeline.capture", target:"OD-B22-S04", at:70.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);   // deterministic idle phase
    const prog   = clamp01(0.14 + 0.82 * (t / D));
    const bound  = ramp(t, TRUSS, TRUSS + 3);
    const hoist  = ramp(t, HOIST0, HOIST1);

    /* --- 1. THE HALL. It paints the room; everything else keys onto it. --- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"contest", t:breath, layers:HALL_LAYERS,
        status: t < DELIV0 ? "THE STORE IS OPEN"
              : t < HAND   ? "HE IS CARRYING ARMS"
              : t < ORDER  ? "THE ENEMY IS ARMED"
              : t < CAUGHT ? "GO UP AND SEE"
              : t < HOIST0 ? "TAKEN AT THE DOOR"
              :              "SUSPENDED",
        progress: prog,
      },
    });

    /* --- 2. EVERY BODY, ordered back to front by its own resolved depth --- */
    const draw = [];

    /* ODYSSEUS — the sill, and he never leaves it. One guise, one mirror:
       the rig's reaching poses are authored to screen LEFT and everything he
       does goes screen RIGHT, exactly as S01/S02/S03 draw him. No
       transformation here, so no divine_fx.athenas-restoration. */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const seeing = t >= SEE && t < ORDER;
      const order  = t >= ORDER && t < CAUGHT;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, guise:"restored", band:"threeq", mirror:true,
            pose: s.pose || "confrontation",
            gaze: s.gaze || { x:.42, y:.10 },
            browUp:   seeing ? .46 : .16,
            browKnit: order ? .62 : seeing ? .30 : .54,
            eyeNarrow:order ? .46 : .34,
            eyeWide:  seeing ? .30 : 0,
            jaw:      order ? .40 : seeing ? .26 : .18,
            mouthAsym:.22,
            frown:    order ? .30 : 0,
            status: t < SEE    ? "SPEARS"
                  : seeing     ? "BRONZE IN THEIR HANDS"
                  : order      ? "GO UP AND SEE"
                  :              "THE NEAR END IS HELD",
            progress: prog,
          },
        });
      }});
    }

    /* TELEMACHUS — off the side door and down the axe line, then the man who
       says out loud whose open door this was. */
    {
      const p = blk.telemachus, s = st.telemachus || {};
      const owning = t >= OWN && t < ORDER;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, telemachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.62) % 4 : breath, band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "protective_block"),
            gaze: s.gaze || { x:.22, y:.08 },
            browUp:   owning ? .52 : .22,
            browKnit: owning ? .34 : .44,
            eyeNarrow:owning ? .10 : .38,
            eyeWide:  owning ? .32 : 0,
            jaw:      p.moving ? .34 : owning ? .30 : 0,
            frown:    owning ? .24 : .16,
            mouthAsym:owning ? .34 : .14,
            status: owning     ? "THAT DOOR WAS MINE"
                  : p.moving   ? "OFF THE SIDE DOOR"
                  : t >= ORDER ? "THE LAST HELVE"
                  :              "SHIELD UP",
            progress: prog,
          },
        });
      }});
    }

    /* MELANTHIUS — one body, two continuous channels, a computed rise, and a
       depth that walks backward as he goes up the pillar (note F). */
    {
      const p = blk.melanthius, s = st.melanthius || {};
      const lift = hoistExtra(H, p) * hoist;   // p.d IS the station's plan z
      const carrying = t >= DELIV0 && t < BACK0;
      const taken    = t >= CAUGHT;
      draw.push({ d: p.d - 0.12 * hoist, run(){
        placeFigure(offctx, W, H, melanthius, {
          anchor:{ x:p.x, y:p.y - lift / H }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.58) % 4 : breath, band:"threeq",
            pose: s.pose || "m22_slip",
            gaze: s.gaze || { x:.66, y:-.04 },
            bound, hoist, suspension:"cord",
            status: hoist > .04   ? "SUSPENDED"
                  : bound > .04   ? "TRUSSED"
                  : taken         ? "CAUGHT"
                  : carrying      ? "ARMING THEM"
                  :                 "SLIPPING",
            progress: prog,
          },
        });
      }});
    }

    /* THE LINE, until the order splits it — S03's box, S03's constants (E). */
    if (t < ORDER){
      const p = megaron.at("axe_first");
      draw.push({ d:p.d, run(){
        placeHerds(offctx, W, H, p, {
          formation:"guard-door", arming:1.0, stagger:0.36, span:0.50,
          density:0, background:0, foreground:0, showShell:false,
          attention:0.95, resolve:1.0, wave:1.4,
          focus:{ x:-0.28, y:0.34 },        // the suitors, off to the near left
          status: t < HAND ? "HOLDING" : "THEY ARE ARMING",
          progress: prog, t: breath,
        });
      }});
    }

    /* PHILOETIUS — the man who touches him. Mirrored, so the pursuit, the
       seizure and the haul all go screen LEFT, up the lane (note D). */
    if (t >= ORDER + 2){
      const p = blk.philoetius, s = st.philoetius || {};
      const hauling = t >= HOIST0 && t < HOIST1;
      const done    = t >= HOIST1;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, philoetius, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.62) % 4 : breath, band:"threeq", mirror:true,
            pose: p.moving ? "walk_neutral" : (s.pose || "phi_barred"),
            gaze: s.gaze || { x:-.34, y:.06 },
            browKnit: done ? .40 : hauling ? .44 : .64,
            browUp:   done ? .34 : .22,
            eyeNarrow:done ? .18 : .38,
            frown:    done ? .20 : .30,
            jaw:      hauling ? .34 : p.moving ? .30 : .18,
            status: done      ? "LOOK AT IT"
                  : hauling   ? "HAND OVER HAND"
                  : t >= TRUSS  ? "HANDS AND FEET"
                  : t >= CAUGHT ? "I HAVE HIM"
                  : p.moving    ? "UP THE LANE"
                  :               "THE STORE DOOR",
            progress: prog,
          },
        });
      }});
    }

    /* EUMAEUS — OUT of the lane, at the wrecked boards, two depth bands nearer
       than the store door: off the contact, on the fall, and then on the taunt.
       Mirrored so his gesture goes up the lane at the man (notes C, D). */
    if (t >= ORDER){
      const p = blk.eumaeus, s = st.eumaeus || {};
      const taunting = t >= HOIST1;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, eumaeus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: p.moving ? (t * 0.62) % 4 : breath, band:"threeq", mirror:true,
            pose: p.moving ? "walk_neutral" : (s.pose || "eum_ward"),
            gaze: s.gaze || { x:-.36, y:.04 },
            browUp:   taunting ? .34 : .18,
            browKnit: taunting ? .44 : .62,
            eyeNarrow:taunting ? .30 : .34,
            jaw:      taunting ? .48 : p.moving ? .28 : .10,
            frown:    taunting ? .26 : .30,
            mouthAsym:taunting ? .38 : .12,
            status: taunting      ? "KEEP WATCH ALL NIGHT"
                  : t >= HOIST0   ? "ON THE FALL"
                  : t >= TRUSS    ? "THE CORD OVER THE BEAM"
                  : p.moving      ? "UP THE LANE"
                  :                 "WHO IS ARMING THEM",
            progress: prog,
          },
        });
      }});
    }

    /* THE THREE DEAD — S03's closing values, verbatim (note I). */
    {
      const p = blk.eurymachus;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, eurymachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", pose:"kneel", gaze:{ x:-.04, y:.54 },
                  blink:1, browUp:.18, browKnit:.34, eyeWide:0, eyeNarrow:0,
                  jaw:.44, frown:.50, smile:0, mouthAsym:0,
                  status:"THROUGH THE CHEST", progress:prog },
        });
      }});
    }
    {
      const p = blk.amphinomus;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, amphinomus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", mirror:true, pose:"kneel",
                  gaze:{ x:.04, y:.54 },
                  blink:1, browUp:.40, browKnit:.36, eyeWide:0,
                  jaw:.42, frown:.48, mouthAsym:0,
                  status:"BETWEEN THE SHOULDERS", progress:prog },
        });
      }});
    }
    {
      const p = blk.antinous;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, antinous, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", pose:"crouch", gaze:{ x:-.06, y:.52 },
                  blink:1, browUp:.10, browKnit:.34, eyeWide:0, eyeNarrow:0,
                  jaw:.46, frown:.50, smile:0, mouthAsym:0,
                  status:"THROUGH THE THROAT", progress:prog },
        });
      }});
    }

    /* THE WRECKED DINING TABLES and ANTINOUS' BOARD — inherited (note I). */
    draw.push({ d:megaron.at(TAB_STATION, { kind:"prop" }).d, run(){
      placeTables(offctx, W, H, { config:"wrecked", strike:1, t:0,
                                 status:"WRECKED", progress:prog });
    }});
    draw.push({ d:megaron.at("table_r", { kind:"prop" }).d, run(){
      placeBoard(offctx, W, H, { mode:"overturned", t:0,
                                 status:"OVERTURNED", progress:prog });
    }});

    /* THE ENEMY, ARMING — S02/S03's box on S02/S03's stations (note H). */
    {
      const c = crowdAt(t);
      draw.push({ d:megaron.at("corner_dead").d, run(){
        placeCrowd(offctx, W, H, { ...c, t:Math.min(.98, t / D), progress:prog });
      }});
    }

    draw.sort((a, b) => a.d - b.d).forEach(x => x.run());

    /* --- 3. THE WINDOWS. Overlays, always last (notes G, H, I). ---------- */
    /* THE COUNT while the count is the subject; THE MACHINE once it exists. */
    if (t < TRUSS){
      const c = crowdAt(t);
      const ts = { ...c, showGauge:true, layers:["gauge"],
                   t:Math.min(.98, t / D), progress:prog };
      const sig = `tal|${Math.round((ts.wave ?? 0)*20)}|${Math.round((ts.arming ?? 0)*20)}`;
      detailField(offctx, W, H, TALLY_DST);
      plate(offctx, W, H, armedSuitors, TALLY_CW, TALLY_CH, TALLY_WIN, TALLY_DST, ts, sig);
      detailRule(offctx, W, H, TALLY_DST);
    } else {
      const mode = ropeMode(t);
      const rs = { mode, t:0, status:mode.toUpperCase(), progress:prog };
      detailField(offctx, W, H, ROPE_DST);
      plate(offctx, W, H, rope, ROPE_CW, ROPE_CH, ROPE_WIN, ROPE_DST, rs, `rope|${mode}`);
      detailRule(offctx, W, H, ROPE_DST);
    }
    {
      const as = { mode:"throw", t:0, status:"THROW", progress:prog };
      detailField(offctx, W, H, ARM_DST);
      plate(offctx, W, H, armour, ARM_CW, ARM_CH, ARM_WIN, ARM_DST, as, `arm|throw`);
      detailRule(offctx, W, H, ARM_DST);
    }
  },
};
export default scene;

/* named binding so OD-B22-S05 can `import { exitOccupancy as INITIAL }`.
   S05 plays in this same hall, so every station below is a megaron station and
   it needs no translation table. Note that `herdsmen` is gone and `eumaeus`,
   `philoetius` and `melanthius` are in its place (notes E, F). */
export const exitOccupancy = scene.exitOccupancy;
