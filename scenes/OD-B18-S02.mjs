/* ============================================================
   SCENE  OD-B18-S02 — Odysseus Drops Irus
   Book XVIII, scene 2. ADDITIVE: creates nothing, modifies nothing; it only
   COMPOSES assets that already exist. Shape copied from the reference scene
   scenes/OD-B16-S03.mjs and from its Book XVIII sibling scenes/OD-B18-S01.mjs.

   ROOM — AND WHY IT IS NOT THE MEGARON. Rule D says a hall variant is the
   megaron in another state, and this scene obeys that rule by NOT being a hall
   variant. location.fight-threshold is the reverse field: OUTSIDE the great
   doors, standing in the courtyard, looking back at them across the porch —
   the ground of XVIII.30–110, where the ring is trodden bare at the door foot
   and where Odysseus hauls Irus "through the porch to the courtyard and the
   gates" to leave him sitting against the wall. The megaron plan has no gate
   and no wall foot; beat 4 is a drag to the gate, so it cannot be staged in
   the hall without inventing plot fixtures. The set module is itself authored
   for this scene (`scene:"OD-B18-S02"`, `adjacentTo:"location.megaron-hall"`
   through `door_main`), and it EXPORTS ITS OWN PLAN.

   PLAN. Rather than author a fresh local plan and let it drift from the paint,
   this scene blocks through the plan the SET ITSELF projects its fixtures from
   — `import { plan as fightThreshold }` — so the ring, the drag furrows, the
   gateway and the wall foot that get drawn are the ring, the drag, the gate
   and the wall foot the bodies stand on. One source of truth, the same
   discipline as _plans/megaron.mjs, kept outdoors.

   WHICH STATIONS, AND WHY NOT THE OTHERS — read off the render, not guessed.
   · `porch_l` / `porch_r` are PORCH COLUMN stations (params.colX = .16 .34 .66
     .84 carries two of them), so a body blocked there stands inside a painted
     column. Draft 1 did that and the cast fused into the facade.
   · `ring_near` and `stools_stow` put a body's FEET on the ring's near kerb and
     its torso up through the stool arc, which the set lays at screen y .64–.75
     across x .19–.62. Draft 2 did that and the centre of the frame became an
     unreadable tangle. They are not used, and the `seats` layer is dropped
     (see below) so that band is paper.
   · The projection compresses x with depth (spread = .42 + .58 z), so the
     ring's right lip (px .494) and the ground just outside it on the gate side
     (px .58–.60) are only .09 of frame apart: two bodies cannot both stand
     there. That is why Amphinomus is an ENTRANCE, not a bystander.
   What IS used is open ground at four separated x-lanes: the two door-posts
   (`torch_l` / `torch_r`) for the two men who stand BESIDE the door and never
   fight in the middle, the fighter pair inside the trodden circle, and the
   gate side of the yard for the drag and the handover.

   THE SEATS LAYER IS DROPPED. Same device as the megaron in S01, where the
   suitors shove the benches back: here the seven stools are the one fixture
   that lands exactly in the band a standing body's torso occupies, and this
   scene has every spectator on his feet. Everything else the set owns stays —
   facade, door, porch, both walls, the gateway, the ring and its kerb, the
   trodden standing MARKS (which carry the spectators on their own), the drag
   furrows, the wall foot, the door-posts, the litter, the jars.

   CONTACT PAIRS. `ring_l` / `ring_r` are the set's own declared fighter pair:
   the two beggars square off at different coordinates on one depth (dx ≈ .137
   of frame). The drag is staged as a LEAD, not a merge — Odysseus enters each
   leg of the furrow line two seconds before Irus does and leaves it two
   seconds before, so hauler and hauled share the path and never the point —
   and it lands with Odysseus at `gate_sill` and Irus at `propped`, adjacent
   but distinct. The handover at the end is `ring_l` (receiver) against
   `ring_gate` (donor), dx ≈ .24.

   ONE BODY, ONE GUISE. The atlas asks for `character.odysseus-as-beggar`.
   That is character.odysseus-b16 with guise:"beggar", the same body Books XVI
   and XVIII S01 used, never a cut to a second module. THERE IS NO GUISE CHANGE
   HERE and no restoration flare: Athena does not restore him in this scene,
   she makes him legible. The guise is held flat at "beggar" from the first
   frame to the last, which is the whole point — the suitors are looking at the
   same rags and suddenly reading a different man inside them.

   ATHENA'S EMPHASIS. divine-fx.athenas-bodily-emphasis is an anatomical
   READABILITY plate and it paints its own diagram figure. Placed whole it
   would stand a second Odysseus on the yard. So it is placed with its BODY
   layers dropped — and with its margin furniture dropped too, because the
   comparison bars (box x .082) and the emphasis gauge (box x .78) are laid in
   the plate's own margins and in a STAGE those margins are occupied ground.
   What is kept is only what is registered on the body: `source` (the divine
   touch, off-body, streaming chevrons into his shoulders) and `ghost` (the
   dashed slack contour the worked contour has swollen past — three curves that
   say "filled out his limbs" on their own, where the ten short reading strokes
   only added mush over a body already crossing the porch steps).
   Registration is computed from the figure's own blocked station —
   the fx's internal figure origin is x .415, feet y .885, height .615 of its
   box, and placeInstance boxes are anchored bottom-centre and take the frame
   aspect, so the box can be solved for exactly — PROVIDED the hero rig's own
   fill inside its placed box is measured off a render rather than assumed. It
   is ~0.72 of the box tall with its feet at ~0.93 of the box (draft 3 assumed
   0.92/1.00, oversized the plate by half, and the reading lines sprawled off
   the body into a scribble). He HOLDS `ring_r` — his own
   corner of the trodden circle — for the whole emphasis window and well past
   it, so the registration is static and cannot drift, and the window closes
   before Irus reaches the far side of the ring: the plate's off-body touch
   burst lands on the pale porch, never on another man's head.

   NO CROWD ENSEMBLE, ON PURPOSE. ensemble.suitor-fight-ring belongs to S01 and
   is authored on the MEGARON's floor. This set makes the opposite choice
   explicitly — "NO characters baked in — spectators are footprints, stools and
   anchors" — and paints the trodden standing marks as GROUND, which is why they
   agree between shots. Laying an arc of bodies over that ground doubled the
   spectators and printed a picket fence across the facade in draft 1. The cheer
   is carried instead by the set's own state channel (`fight` presses the arc in
   and lifts the dust, `drag` cuts the furrows, `aftermath` wears the wall foot)
   and by the two named suitors who ARE cast.

   AMPHINOMUS IS AN ENTRANCE. He is not on this ground until beat 5, which is
   also the truth of it: the suitors are inside, and one of them comes out with
   the winner's portion. He blocks from `door_main` — the great doors — and is
   PAINTED only from his entrance frame, so the fight itself plays with three
   bodies and a great deal of paper.

   THE PROP. prop.victory-meat-and-wine is a TRANSFER — it changes owner on
   camera — so it gets no private geometry either: its position rides the line
   between the DONOR's and the RECEIVER's blocked stations, lifted to hand
   height by the donor's own plan scale, and it walks up the ownership channel
   offered → pledged → handed → received.

   Beats (Od. 18.66–120):
     1. Odysseus tucks up his rags and reveals powerful thighs and shoulders.
     2. Athena enlarges his appearance; Irus trembles but is forced into the ring.
     3. Odysseus chooses not to kill him and breaks his jaw with one compact blow.
     4. He drags Irus to the gate and warns him not to return.
     5. The suitors cheer and Amphinomus gives the victor food and wine.

   CONTINUITY IN. scenes/OD-B18-S01.mjs exports a computed `exitOccupancy`
   ({odysseus:"threshold", irus:"pillar_l", antinous:"table_r"}) and it is
   imported here. Those are MEGARON stations and this is the yard, so they are
   translated through an explicit HALL_TO_YARD map (rule F). Nobody is dropped:
   all three men who ended S01 in the hall are on this ground when it opens.

   Verify:  node harness/render-scene.mjs scenes/OD-B18-S02.mjs --t 13
            node harness/render-scene.mjs scenes/OD-B18-S02.mjs --t 24
            node harness/render-scene.mjs scenes/OD-B18-S02.mjs --t 46
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { plan as fightThreshold } from "../assets/location/fight-threshold.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import irus        from "../assets/character/irus.mjs";
import antinous    from "../assets/character/antinous.mjs";
import amphinomus  from "../assets/character/amphinomus.mjs";
import emphasis    from "../assets/divine_fx/athenas-bodily-emphasis.mjs";
import reward      from "../assets/prop/victory-meat-and-wine.mjs";

const FIELD_ASSET = "location.fight-threshold";
const D = 48;

/* --- CONTINUITY IN. Computed upstream, translated here. -------------------
   A station only exists in its own plan: `threshold`, `pillar_l` and `table_r`
   are megaron stations and blockingAt() would (correctly) throw on them here.
   The map is staging, not a lookup table:
     threshold -> door_sill  the same doorstone, seen from the yard side. He is
                             standing on it when the scene opens and the first
                             thing he does is come DOWN off it.
     pillar_l  -> torch_l    he gave the near floor back at the left pillar; on
                             this side of the door that is the left door-post —
                             out of the ring, off to one side — and it is the
                             ground he gets shoved off.
     table_r   -> torch_r    the man who named the terms watches from the right
                             door-post and never comes down into the ring —
                             which is the whole of Antinous in one station.
   Nobody is dropped. */
const HALL_TO_YARD = { threshold:"door_sill", pillar_l:"torch_l", table_r:"torch_r" };
import { exitOccupancy as PREV_EXIT } from "./OD-B18-S01.mjs";
const INITIAL = {
  ...Object.fromEntries(Object.entries(PREV_EXIT)
    .map(([who, st]) => [who, HALL_TO_YARD[st]])
    .filter(([, st]) => st)),
  /* NEW TO THIS SCENE, and an ENTRANCE: the decent suitor is still inside the
     hall while the beggars fight. He blocks from the great doors and is not
     painted until beat 5 (see AMPHINOMUS_IN). */
  amphinomus: "door_main",
};

/* --- BLOCKING. Stations, not coordinates. -------------------------------- */
const MOVES = [
  // 1. down off the doorstone into his own corner of the ring, girding as he goes
  { who:"odysseus",   from:"door_sill", to:"ring_r",     t0: 3, t1: 9 },
  // 2. Irus is pushed off the door-post across into the far corner
  { who:"irus",       from:"torch_l",   to:"ring_l",     t0:12, t1:19 },
  // 4. the drag: Odysseus leads down the furrow line, Irus comes after him
  { who:"odysseus",   from:"ring_r",    to:"ring_gate",  t0:26, t1:30 },
  { who:"irus",       from:"ring_l",    to:"ring_gate",  t0:28, t1:33 },
  { who:"odysseus",   from:"ring_gate", to:"gate_sill",  t0:30, t1:35 },
  { who:"irus",       from:"ring_gate", to:"propped",    t0:33, t1:38 },
  // 5. he walks back across the yard; Amphinomus comes out with the portion
  { who:"odysseus",   from:"gate_sill", to:"ring_l",     t0:38, t1:44 },
  { who:"amphinomus", from:"door_main", to:"ring_gate",  t0:42, t1:47 },
  // Antinous never moves. That is the point of him.
];

/* his entrance frame: before this he is inside the hall, and not painted. */
const AMPHINOMUS_IN = 42;

/* --- ATHENA'S EMPHASIS WINDOW. One ramp drives the plate. ---------------- */
const E0 = 9, E1 = 15, E2 = 19;   // in, held, and gone before Irus is squared off
const emphAt = t => t <= E0 ? 0
                  : t <  E1 ? (t - E0) / (E1 - E0)
                  : t <  E2 ? 1 - 0.55 * (t - E1) / (E2 - E1)
                  : 0;

/* THE REGISTRATION LAW. The plate paints its diagram figure at x .415 of its
   box, feet at y .885, crown-to-feet .615 of the box height (its own
   params.figure). placeInstance boxes are anchored bottom-centre and take the
   FRAME aspect, so landing that internal figure on a blocked body is exact:
       s        = bodyHeight / 0.615                       (fractions of H)
       anchor.x = bodyX    + (0.500 - 0.415) * s
       anchor.y = bodyFeetY + (1.000 - 0.885) * s
   bodyHeight and bodyFeetY both come from the measured rig fill below. */
const FX_FIG_X = 0.415, FX_FIG_FEET = 0.885, FX_FIG_H = 0.615;
/* MEASURED off renders/scene__OD-B18-S02.png, not assumed: the hero rig draws
   ~0.72 of its placed box tall, with its feet at ~0.93 of the box height. Every
   figure therefore stands slightly above its anchor, and anything that has to
   register on a body has to use these, not 1.0. */
const RIG_FILL = 0.72, RIG_FEET = 0.93;

/* --- FIGURE SIZES (multiplied by the station's own plan scale) ------------
   Sized off the render: at .34 of frame the heads of the two men in the ring
   sat exactly on the porch architrave and their silhouettes were lost in it.
   At these sizes a head standing in the trodden circle clears the architrave
   and reads against the dark door opening behind it, while the two men at the
   door-posts still read against plain wall. */
const FIG_OD = 0.46, FIG_IR = 0.44, FIG_AN = 0.40, FIG_AM = 0.42;

/* the yard, minus the stools. Every load-bearing thing the set owns stays. */
const YARD_LAYERS = ["sky","yard","facade","door","porch","leftwall","rightwall",
                     "gate","ring","marks","furrows","propped","torches","litter",
                     "foreground"];

/* the set's own state channel, on the clock */
function fieldStateAt(t){
  if (t < 19) return "ring";        // the circle cleared, the standing marks set
  if (t < 26) return "fight";       // the arc pressed in, dust up, middle scuffed
  if (t < 38) return "drag";        // the ring broken open, furrows to the gate
  return "aftermath";               // furrows deep, wall foot worn, a body in it
}

export const scene = {
  id:"OD-B18-S02",
  title:"Odysseus Drops Irus",
  book:18,
  plan:"local:fight-threshold",
  duration:D,
  beats:[
    "Odysseus tucks up his rags and reveals powerful thighs and shoulders.",
    "Athena enlarges his appearance; Irus trembles but is forced into the ring.",
    "Odysseus chooses not to kill him and breaks his jaw with one compact blow.",
    "He drags Irus to the gate and warns him not to return.",
    "The suitors cheer and Amphinomus gives the victor food and wine.",
  ],
  exitState:"The yard outside the great doors: the ring is broken open on the gate side, the furrows of the drag cut deep across it, two stools tipped over. Irus is propped against the wall foot beside the courtyard gate with his jaw broken and his staff let go beside him, warned not to come back. Odysseus is back in the ring on the left, still in the beggar's rags — nobody has seen anything but a beggar — and the strength Athena lent his limbs is already falling back. Amphinomus stands on the gate side of the ring having pledged him in the gold cup and put the champion's portion and two barley loaves into his hands: the reward has changed owner on camera. Antinous holds the right door-post, where he named the terms and never came down. The suitors are still cheering.",
  exitOccupancy:occupancyAt(fightThreshold, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"ring" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.49,y:.75}, scale:.44, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.irus", instance:"irus",
      anchor:{x:.21,y:.68}, scale:.39, band:"threeq", pose:"irus_bluster" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.79,y:.68}, scale:.35, band:"threeq", pose:"arms_crossed" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.59,y:.78}, scale:.39, band:"threeq", pose:"three_quarter_left" },
    { asset:"divine-fx.athenas-bodily-emphasis", instance:"emphasis_01",
      anchor:{x:.53,y:.77}, scale:.51, blend:"multiply" },
    { asset:"prop.victory-meat-and-wine", instance:"reward_01",
      anchor:{x:.48,y:.61}, scale:.09 },
  ],

  timeline:[
    { op:"actor.pose",  target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at: 0.0, args:{ gaze:{ x:-.30, y:.10 } } },
    { op:"actor.pose",  target:"irus",       at: 0.0, args:{ pose:"irus_bluster" } },
    { op:"actor.gaze",  target:"irus",       at: 0.0, args:{ gaze:{ x:.40, y:.12 } } },
    { op:"actor.pose",  target:"antinous",   at: 0.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze",  target:"antinous",   at: 0.0, args:{ gaze:{ x:-.34, y:.22 } } },
    { op:"actor.pose",  target:"amphinomus", at: 0.0, args:{ pose:"three_quarter_left" } },
    // 1. down off the doorstone, and the rags come up
    { op:"actor.pose",  target:"odysseus",   at: 3.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at: 3.0, args:{ gaze:{ x:-.10, y:.44 } } },
    // 2. Athena fills out his limbs; Irus is shoved off the post
    { op:"fx.play",     target:"emphasis_01",at: E0,  args:{ dir:"emphasise" } },
    { op:"actor.pose",  target:"irus",       at:12.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze",  target:"irus",       at:12.0, args:{ gaze:{ x:.42, y:.10 } } },
    { op:"actor.pose",  target:"odysseus",   at:11.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at:11.0, args:{ gaze:{ x:-.38, y:.02 } } },
    { op:"actor.pose",  target:"irus",       at:19.0, args:{ pose:"irus_amateur_guard" } },
    { op:"actor.pose",  target:"odysseus",   at:19.5, args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",   at:19.5, args:{ gaze:{ x:-.46, y:.08 } } },
    // 3. the choice not to kill, and the one compact blow
    { op:"actor.pose",  target:"odysseus",   at:22.0, args:{ pose:"reach_forward" } },
    { op:"actor.pose",  target:"irus",       at:23.0, args:{ pose:"irus_struck" } },
    { op:"actor.gaze",  target:"irus",       at:23.0, args:{ gaze:{ x:.08, y:.46 } } },
    { op:"actor.pose",  target:"antinous",   at:24.0, args:{ pose:"laughter" } },
    { op:"actor.pose",  target:"irus",       at:25.0, args:{ pose:"irus_collapse" } },
    // 4. the drag down the furrows, and the warning at the gate
    { op:"actor.pose",  target:"odysseus",   at:26.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze",  target:"odysseus",   at:26.0, args:{ gaze:{ x:.42, y:.28 } } },
    { op:"actor.pose",  target:"irus",       at:34.0, args:{ pose:"irus_removed" } },
    { op:"actor.gaze",  target:"irus",       at:34.0, args:{ gaze:{ x:-.30, y:.18 } } },
    { op:"actor.pose",  target:"odysseus",   at:36.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:36.0, args:{ gaze:{ x:.42, y:.24 } } },
    // 5. back across the yard, the cheer, and the winner's portion
    { op:"actor.pose",  target:"odysseus",   at:38.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze",  target:"odysseus",   at:38.0, args:{ gaze:{ x:-.22, y:.06 } } },
    { op:"actor.pose",  target:"amphinomus", at:42.0, args:{ pose:"courteous_offer" } },
    { op:"actor.gaze",  target:"amphinomus", at:42.0, args:{ gaze:{ x:-.36, y:.22 } } },
    { op:"prop.state",  target:"reward_01",  at:42.0, args:{ mode:"offered" } },
    { op:"actor.pose",  target:"antinous",   at:44.0, args:{ pose:"torso_open" } },
    { op:"prop.state",  target:"reward_01",  at:45.0, args:{ mode:"pledged" } },
    { op:"actor.pose",  target:"odysseus",   at:46.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze",  target:"odysseus",   at:46.0, args:{ gaze:{ x:.26, y:.16 } } },
    { op:"prop.state",  target:"reward_01",  at:46.0, args:{ mode:"handed" } },
    { op:"prop.state",  target:"reward_01",  at:47.5, args:{ mode:"received" } },
    { op:"timeline.capture", target:"OD-B18-S02", at:47.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st   = stateAt(scene, t);
    const blk  = blockingAt(fightThreshold, MOVES, t, INITIAL);
    const emph = emphAt(t);

    const girding = t >= 3  && t < 16;    // the rags up, the limbs filled out
    const matched = t >= 16 && t < 22;    // Irus in the ring, the two squared off
    const struck  = t >= 22 && t < 26;    // the blow
    const dragged = t >= 26 && t < 38;    // hauled down the furrows to the gate
    const cheered = t >= 38;              // the warning, then the portion and cup

    /* the field first — it paints the yard, everything else keys onto it */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:fieldStateAt(t), t:0.5, layers:YARD_LAYERS,
              progress:Math.min(.94, .2 + .7*(t/D)),
              status: cheered ? "PROPPED" : dragged ? "DRAGGED"
                    : struck || matched ? "MATCHED" : "THE RING" },
    });

    /* --- the painted bodies, ordered by the blocking ---------------------
       Odysseus crosses the whole depth of the yard twice (ring z .56 -> gate
       z .82 -> ring z .56) and overtakes Amphinomus on the way, so the draw
       order is SORTED on the resolved y rather than fixed in the source. */
    const draws = [];

    /* ODYSSEUS — one body, guise held flat at "beggar" from end to end. */
    {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_OD * p.scale,
          state:{
            t:0.45, guise:"beggar", band:"threeq",
            pose: s.pose || "three_quarter_left",
            gaze: s.gaze || { x:-.30, y:.06 },
            browKnit: struck ? .52 : matched ? .40 : .22,
            browUp:   cheered ? .34 : girding ? .26 : .10,
            eyeNarrow:matched || struck ? .44 : .26,
            frown:    struck ? .30 : 0,
            smile:    t >= 46 ? .20 : 0,
            mouthAsym:dragged ? .40 : .16,
            jaw:      (dragged && t < 38) ? .34 : 0,
            status:   cheered ? "THE VICTOR" : dragged ? "STAY OUT THERE"
                    : struck ? "ONE BLOW"    : matched ? "MATCHED"
                    : girding ? "TUCKED UP"  : "THE STRANGER",
            progress: Math.min(.96, .16 + .76*(t/D)),
          },
        });
      }});
    }

    /* IRUS — bluster, then a body that is no longer arguing. */
    {
      const p = blk.irus;
      const s = st.irus || {};
      const gone = t >= 34;
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, irus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_IR * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "irus_bluster",
            gaze: s.gaze || { x:.40, y:.12 },
            browKnit: t < 12 ? .78 : struck ? .30 : .48,
            browUp:   t < 12 ? .14 : gone ? .34 : .82,
            eyeWide:  struck ? .88 : matched ? .52 : .18,
            eyeNarrow:t < 12 ? .30 : 0,
            frown:    gone ? .48 : struck ? .26 : .30,
            jaw:      t < 12 ? .92 : struck ? .86 : .24,
            mouthAsym:gone ? .58 : .12,
            status:   gone ? "PUT OUT" : struck ? "THE JAW"
                    : matched ? "TREMBLING" : "MY DOORWAY",
            progress: Math.min(.96, .14 + .78*(t/D)),
          },
        });
      }});
    }

    /* ANTINOUS — he named the terms in S01 and holds the right door-post; he
       never comes down into the ring, which is exactly the character. */
    {
      const p = blk.antinous;
      const s = st.antinous || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, antinous, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_AN * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "arms_crossed",
            gaze: s.gaze || { x:-.34, y:.20 },
            browKnit: matched ? .34 : .22,
            eyeNarrow:.30,
            smile:    struck || cheered ? .42 : .12,
            cheek:    struck ? .48 : 0,
            mouthAsym:.44,
            jaw:      struck && t < 26 ? .52 : 0,
            status:   cheered ? "HIS OWN TERMS" : struck ? "DELIGHTED" : "AMUSED",
            progress: Math.min(.96, .18 + .74*(t/D)),
          },
        });
      }});
    }

    /* AMPHINOMUS — the one decent man in the hall, and the donor of the prop.
       ENTRANCE: nothing of him is painted until he comes out of the doors. */
    if (t >= AMPHINOMUS_IN){
      const p = blk.amphinomus;
      const s = st.amphinomus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, amphinomus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_AM * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "three_quarter_left",
            gaze: s.gaze || { x:-.28, y:.10 },
            browUp:   cheered ? .34 : .48,
            browKnit: struck ? .46 : .24,
            smile:    cheered ? .26 : 0,
            frown:    struck ? .22 : 0,
            status:   cheered ? "THE WINNER'S PORTION"
                    : struck ? "NO STOMACH FOR IT" : "WATCHING",
            progress: Math.min(.96, .12 + .80*(t/D)),
          },
        });
      }});
    }

    /* --- ATHENA'S EMPHASIS: the diagram registered onto the real body ------
       Body layers and margin furniture dropped, so there is exactly ONE
       Odysseus on this yard and nothing of the plate lands on occupied ground.
       What is left is the divine touch, the dashed slack contour he is passing,
       and the reading lines — all of it on him. */
    if (emph > 0.001){
      const p     = blk.odysseus;
      const box   = FIG_OD * p.scale;                    // his placed box, of H
      const bodyH = RIG_FILL * box;                       // his drawn height
      const feetY = p.y - (1 - RIG_FEET) * box;           // where he really stands
      const s     = bodyH / FX_FIG_H;
      draws.push({ y:p.y + 0.0005, run(){
        placeInstance(offctx, W, H, emphasis, {
          anchor:{ x:p.x   + (0.5 - FX_FIG_X)  * s,
                   y:feetY + (1   - FX_FIG_FEET) * s },
          scale:s,
          state:{
            t:emph, intensity:1.0, swell:1.0,
            layers:["source","ghost"],
            status: emph >= .98 ? "LEGIBLE" : t < E1 ? "FILLING" : "FADING",
            progress: emph,
          },
        });
      }});
    }

    /* --- THE REWARD: a thing that changes owner on camera -----------------
       No private geometry: it rides the line between the DONOR's blocked
       station and the RECEIVER's, lifted to hand height by the donor's own
       plan scale, and it is only on the yard once Amphinomus has it. */
    if (t >= AMPHINOMUS_IN){
      const pa = blk.amphinomus, po = blk.odysseus;
      const mode = t >= 47.5 ? "received" : t >= 46 ? "handed"
                 : t >= 45   ? "pledged"  : "offered";
      const w  = mode === "received" ? 0.62 : mode === "handed" ? 0.46
               : mode === "pledged"  ? 0.22 : 0.12;
      const px = pa.x + (po.x - pa.x) * w;
      const py = pa.y + (po.y - pa.y) * w;
      draws.push({ y:pa.y + 0.004, run(){
        placeInstance(offctx, W, H, reward, {
          /* lifted to hand height off the donor's own plan scale, so the
             charger reads against the pale porch and not down in the kerb */
          anchor:{ x:px, y:py - 0.150 * pa.scale },
          scale:0.090 * pa.scale,
          state:{
            mode, t:0.5, wine:1, loaves:2,
            transfer: mode === "handed" ? .5 : mode === "received" ? 1 : 0,
            status: mode.toUpperCase(),
            progress: Math.min(.98, .5 + .48*((t - AMPHINOMUS_IN)/(D - AMPHINOMUS_IN))),
          },
        });
      }});
    }

    draws.sort((a, b) => a.y - b.y).forEach(d => d.run());
  },
};
export default scene;

/* named binding so the next scene of the book can
   `import { exitOccupancy as INITIAL }` — the scene-object property alone
   cannot be linked.

   NOTE FOR THE NEXT SCENE. These are LOCAL fight-threshold stations
   (ring_l / propped / torch_r / ring_gate), not megaron stations, because this
   scene plays in the yard. A following scene set back inside the hall must
   translate them the way this one translated S01's — declare a YARD_TO_HALL map
   and drop Irus, who is left sitting against the courtyard wall and does not
   come back in. `door_main` is the shared doorway between the two plans. */
export const exitOccupancy = scene.exitOccupancy;
