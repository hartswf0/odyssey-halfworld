/* ============================================================
   SCENE  OD-B19-S02 — Penelope Begins the Test        (Od. 19.53–219)
   Book XIX, scene 2. ADDITIVE: creates no asset, modifies no tracked file,
   casts only modules that already exist. Shape copied from the reference
   scene, OD-B16-S03.mjs, and from its Book XIX sibling, OD-B19-S01.mjs.

   WHAT THIS SCENE IS FOR. This is the first of the two long interviews that
   carry Books XIX and XXIII, and it is all speech — so the STAGING has to do
   the work the speech does. The scene is built as ONE MEASURED GAP: the maid is
   driven out of the hall, and then the queen and the stranger settle at the two
   roof-pillars, one on each side of the banked hearth, and neither of them
   crosses it again. In Book XXIII she sits down opposite him at that same
   distance and finally says his name. This is the frame the distance is set in.

   ROOM — rooms are state, not new rooms. The atlas asks for a location called
   `location.night-hearth-interview`. There is no such room and there must not
   be one: it is the megaron at night. So the field is location.megaron-hall in
   state `night`, blocked through scenes/_plans/megaron.mjs, and `night` is the
   state in which that module takes the arms off the walls and leaves bare pegs
   — which is exactly the fact OD-B19-S01 spent fifty-six seconds establishing.
   The room remembers the last scene without being told.

   ONE BODY, ONE GUISE. Odysseus is character.odysseus-b16 with guise:"beggar"
   held for the whole scene — never a cut to `.odysseus-as-beggar`, which is
   what the atlas asks for by name. There is no restoration in Book XIX, so the
   guise channel simply does not move here; that is the point of the channel.

   CONTINUITY IN — inherited, computed, and explicitly pruned.
     import { exitOccupancy as INITIAL } from "./OD-B19-S01.mjs"  ->
       { odysseus:"bench_r2", telemachus:"postern", lamp:"postern",
         weapons:"storeroom" }
   Same room, so nothing has to be translated between plans. Two bodies are
   DROPPED and one is KEPT undrawn:
     · telemachus — dropped. Od. 19.47–50: the moment the arms are stowed he
       goes off across the court to his own room and sleeps until dawn. Keeping
       him would put a witness in a scene whose whole content is that the queen
       and the beggar are alone.
     · lamp — dropped. divine_fx.athenas-golden-lamp withdrew at the end of S01
       (its `lit` channel is back to 0 by t=48 there); the goddess is not in
       this room and no fx is cast.
     · weapons — KEPT, at `storeroom`, and never drawn. The sixteen pieces are
       a fact of the world, not of the frame: they are behind the postern wall
       all through this scene, and Book XXI has to be able to read that off the
       chain. Occupancy is where bodies ARE, not what the camera sees.
   Odysseus therefore opens at `bench_r2` — the stripped right-hand wall he was
   left standing at — and his first move is off it.

   BLOCKING. Stations, never coordinates. This took three passes and every one
   of them was corrected against a rendered frame, so the reasoning is recorded
   here rather than rediscovered by the next scene in the book:
     · In `night` the hall paints benches on bench_l1/l2/r1/r2 and tables with
       stools stacked on them at table_l/table_r. A resting figure on any of
       those wears the furniture through its legs.
     · `throne` paints a near-camera plinth whose TOP FACE lands at y≈0.79–0.85,
       above the foot line of every spine station from `axe_last` inward. The
       whole near spine (x .42–.58, z .68–.92) is therefore unusable for a REST.
       Draft 1 parked Odysseus on `axe_last` and he came out standing on the
       throne's seat. It is fine to walk through — a near-camera occluder passed
       at speed — and never fine to stop on.
     · `axe_first` and `axe_last` are BOTH x=.50. Two bodies parked on the spine
       stack into one totem of heads whatever their depth. Draft 1 had the maid
       on one and the beggar arriving at the other; only one body is ever on the
       spine here, and only in transit.
     · `stair_up` (x.92,z.66) and `bench_r2` (x.84,z.76) resolve 0.04 apart in
       frame x. Draft 2 left the queen standing at the stair while the beggar
       stayed at the wall and the two of them fused into one two-headed figure
       for eighteen seconds. So the beggar is walked OFF that wall before she
       comes down: by the time she is drawn he is past the middle of the room.
   The resting places: `pillar_l` for the beggar, `pillar_r` for the queen — the
   only clean pair of stations at one depth, mirrored across the fire, 0.32
   apart in frame x, and the household's standing places in the poem anyway
   (Od. 21.64 sets Penelope at the pillar of the roof with the veil at her
   face). `stair_up` is where she lands when she comes down and where she stands
   to send the maid out; `pillar_r` is hers only after the maid has left it.
   ROUTES were audited across the whole clock, not eyeballed: the hearth ring
   occupies plan x .395–.605, z .445–.595, and NO body enters it at any t — the
   beggar goes out to the spine and comes up the near-left side of the fire, the
   queen's walk stays to the right of it. The one transient is the beggar inside
   the throne's box between t≈4.5 and t≈8, mid-stride, at the widest part of his
   walk; the alternative routes trade it for two seconds of walking through the
   left-hand tables or for passing within 8px of the maid, which are both worse.
   Closest approach between any two drawn bodies is a pass-UNDER: the beggar
   crosses below the maid at t≈3–5 with 112px of foot line between them, painted
   in the correct order because the draw list is sorted by blocked depth.

   CONTACT — there is no contact pair in this scene, deliberately. No two bodies
   ever resolve to one station: the queen tests the stranger at one room's width,
   and the two who might have touched — maid and beggar — are kept a full
   diagonal apart while she sneers at him. The nearest thing to a touch is the
   queen's arm thrown out at the maid, which stops a clear 100px short of her. `pillar_r` is used by two bodies in the same scene and
   never at the same time: the maid vacates it at t=17 and the queen does not
   arrive until t=36, so the station is a relay, not a collision.

   ENTRANCE AND EXIT. Penelope is not drawn before t=8: she is upstairs until
   she comes down, and `stair_up` is the foot of her own stair, so her entrance
   is the first frame she stands on it. Melantho is not drawn after t=21: she is
   through the women's door in the right wall, which is what her last move
   delivers her to. The occupancy still reports her at `doorway_maid` — she left
   through that door, and a later scene that casts her should find her behind it.
   Her poses are her own module's, minus one: `mth_jeer` jabs the near arm DOWN
   AND LEFT, so it only reads when its target is down-left of her. The abuse is
   carried by `mth_contempt` — akimbo, chin up, the sneer, the eyes sliding down
   — with the gaze aimed across the frame at where the beggar actually is once
   he has crossed to the left, and by `mth_dismiss` on the way out.

   THE SHROUD, AND WHY THERE IS NO LOOM IN THE FRAME. Beat 4 is a story about a
   web, and prop.laertess-shroud-and-loom was composited into draft 2 as a keyed
   diagram on the left wall. It was read back off the plate and it did not
   survive: at every size that stayed clear of the postern opening and the peg
   rails it came out as a barred rectangle — a bookcase, not a loom — because
   the warp and the fell lines fall below the dot pitch. The choice was between
   painting over plot geometry, shrinking it into mush, or cutting it. It is
   cut, and the beat is carried where it belongs: on the queen's own body, the
   grief brows and the hand at the veil, held for twelve seconds.

   NO GUEST CHAIR. Od. 19.97 has a chair set for the stranger and the atlas has
   prop.guest-chair-and-footstool, and it is left out on purpose: the rig has no
   seated pose, so a chair placed on the station he stands at would fuse under
   his legs — the failure this whole file is organised around. The hall paints
   its own furniture; the seat is implied by the fact that he stops there.

   Beats (Od. 19.53–219):
     1. Penelope comes down from her chamber and orders Melantho to stop
        insulting the guest; the maid is sent out through the women's door.
     2. Queen and stranger take their places on either side of the banked fire.
     3. She asks him who he is, and he will not name his lineage before he has
        heard her grief.
     4. She tells him the suitors eating the house, and the shroud she wove by
        day and unwove by night for three years until a maid betrayed her.
     5. She asks for proof that the stranger truly entertained Odysseus.

   Verify:  node harness/render-scene.mjs scenes/OD-B19-S02.mjs --t 16
            node harness/render-scene.mjs scenes/OD-B19-S02.mjs --t 58
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field     from "../assets/location/megaron-hall.mjs";
import odysseus  from "../assets/character/odysseus-b16.mjs";
import penelope  from "../assets/character/penelope.mjs";
import melantho  from "../assets/character/melantho.mjs";

/* CONTINUITY IN — the previous scene's computed exit, imported, not asserted. */
import { exitOccupancy as PREV_EXIT } from "./OD-B19-S01.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 64;

/* who survives the join. Kept as a filter over the inherited map rather than a
   retyped table, so if S01's blocking ever moves the beggar this follows it. */
const CARRIED = new Set(["odysseus", "weapons"]);
const INITIAL = {
  ...Object.fromEntries(Object.entries(PREV_EXIT).filter(([who]) => CARRIED.has(who))),
  penelope: "stair_up",      // she is above it until t=8; this is where she lands
  melantho: "pillar_r",      // going round the hall with a torch, the guest below her
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Three moves, sequenced so that no two bodies are ever resolving toward one
   place at one time: the beggar crosses first and clears the stair, the maid
   goes out second and vacates the right-hand pillar, and the queen takes it
   last (Od. 19.96–99 — the seat is set for the stranger once the maid is gone).
*/
const MOVES = [
  // off the stripped wall, out to the spine, then up the near-left side of the
  // fire to the left-hand roof-pillar. Two legs, because the straight line from
  // bench_r2 to pillar_l runs through the middle of the hearth ring.
  { who:"odysseus", from:"bench_r2",  to:"axe_last",      t0: 1, t1: 6 },
  { who:"odysseus", from:"axe_last",  to:"pillar_l",      t0: 6, t1:14 },
  // the maid is sent out through the women's door in the right wall
  { who:"melantho", from:"pillar_r",  to:"doorway_maid",  t0:17, t1:22 },
  // and the queen comes down off the stair to the pillar the maid has left
  { who:"penelope", from:"stair_up",  to:"pillar_r",      t0:28, t1:36 },
];

/* entrance / exit gates — the two edges of the cast list, in one place */
const PEN_IN  = 8;    // Penelope is upstairs before this
const MTH_OUT = 21;   // Melantho is through the women's door after this

/* WHICH SIDE THE ARM GOES. The rig's directional poses all throw the RIGHT arm,
   i.e. to screen right (`pointing_arm`, `confrontation`, `palm_up_question`,
   `penelope_plea` — and `guarded_withdrawal` turns the head to screen left).
   The rig also ships a `mirror` channel that swaps the limb pairs properly, so
   the fix is one flag and not a hand-drawn arm. In this room every one of
   Penelope's targets is to HER left — the maid at pillar_r seen from the stair,
   the beggar at pillar_l seen from pillar_r — and Odysseus's one target is to
   HIS right. Draft 3 shipped without this and the queen pointed at the wall
   while glaring the other way. */
const MIRROR_PEN = new Set(["confrontation","palm_up_question","penelope_plea"]);
const MIRROR_ODY = new Set(["guarded_withdrawal"]);

export const scene = {
  id:"OD-B19-S02",
  title:"Penelope Begins the Test",
  book:19,
  plan:"megaron",
  duration:D,
  beats:[
    "Penelope comes down from her chamber and orders Melantho to stop insulting the guest.",
    "The maid is driven out of the hall through the women's door.",
    "Queen and stranger take their places on either side of the banked fire.",
    "She asks the beggar who he is, and he will not name his lineage before he has heard her grief.",
    "She tells him the suitors eating the house, and the shroud she wove by day and unwove by night for three years.",
    "She asks for proof that the stranger truly entertained Odysseus.",
  ],
  exitState:"Night in the stripped megaron: bare pegs on both walls, the great doors shut, the fire banked. Penelope stands at the right-hand roof-pillar with her veil at her cheek, having just asked the stranger for proof that he entertained Odysseus; the beggar stands across the hearth at the left-hand roof-pillar, still unnamed, holding the answer back. Melantho has been sent out and is behind the women's door in the right wall. Telemachus is asleep in his own room and Athena's lamp is gone with her; the sixteen pieces of armour are still shut in the storeroom off the postern.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"night" },
    { asset:"character.melantho", instance:"melantho",
      anchor:{x:.66,y:.69}, scale:.46, band:"threeq", pose:"mth_torch" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.79,y:.84}, scale:.56, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.84,y:.79}, scale:.52, band:"threeq", pose:"three_quarter_left" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus", at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus", at: 0.0, args:{ gaze:{ x:-.26, y:.10 } } },
    { op:"actor.pose", target:"melantho", at: 0.0, args:{ pose:"mth_torch" } },
    { op:"actor.gaze", target:"melantho", at: 0.0, args:{ gaze:{ x:.24, y:.30 } } },
    { op:"actor.pose", target:"melantho", at: 9.0, args:{ pose:"mth_contempt" } },
    { op:"actor.gaze", target:"melantho", at: 9.0, args:{ gaze:{ x:-.36, y:.42 } } },
    { op:"actor.pose", target:"penelope", at:PEN_IN, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"penelope", at:PEN_IN, args:{ gaze:{ x:-.36, y:.06 } } },
    { op:"actor.pose", target:"odysseus", at:15.0, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus", at:15.0, args:{ gaze:{ x:.12, y:.34 } } },
    { op:"actor.pose", target:"penelope", at:16.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"penelope", at:16.0, args:{ gaze:{ x:-.40, y:-.12 } } },
    { op:"actor.pose", target:"melantho", at:15.0, args:{ pose:"mth_dismiss" } },
    { op:"actor.pose", target:"penelope", at:36.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"penelope", at:36.0, args:{ gaze:{ x:-.34, y:.06 } } },
    { op:"actor.pose", target:"odysseus", at:36.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"odysseus", at:36.0, args:{ gaze:{ x:.34, y:.04 } } },
    { op:"actor.pose", target:"penelope", at:40.0, args:{ pose:"palm_up_question" } },
    { op:"actor.pose", target:"odysseus", at:40.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"odysseus", at:40.0, args:{ gaze:{ x:.28, y:.20 } } },
    { op:"actor.pose", target:"penelope", at:46.0, args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope", at:46.0, args:{ gaze:{ x:-.06, y:.40 } } },
    { op:"actor.pose", target:"odysseus", at:46.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus", at:46.0, args:{ gaze:{ x:.36, y:.04 } } },
    { op:"actor.pose", target:"penelope", at:56.0, args:{ pose:"penelope_plea" } },
    { op:"actor.gaze", target:"penelope", at:56.0, args:{ gaze:{ x:-.36, y:-.06 } } },
    { op:"actor.pose", target:"odysseus", at:56.0, args:{ pose:"three_quarter_right" } },
    { op:"timeline.capture", target:"OD-B19-S02", at:62.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);

    /* 1. THE HALL at night — stripped walls, shut doors, banked fire. It
       paints the room; everything else keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"night", t:0.5,
              progress:Math.min(.94, .18 + .74*(t/D)),
              status:"NIGHT HEARTH" },
    });

    /* 2. THE BODIES, ordered back to front by their own blocked depth so the
       far one is never painted over the near one. */
    const draw = {
      melantho: () => {
        if (t >= MTH_OUT) return;                       // out through the women's door
        const p = blk.melantho;
        const s = st.melantho || {};
        const scorn = t >= 9 && t < 15;
        const sent  = t >= 15;
        placeInstance(offctx, W, H, melantho, {
          anchor:{ x:p.x, y:p.y }, scale:0.46 * p.scale,
          state:{
            t: p.moving ? (t*0.42) % 4 : 0.5,
            band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "mth_torch"),
            gaze: s.gaze || { x:.24, y:.30 },
            browKnit: sent ? .50 : scorn ? .42 : .18,
            jaw:      scorn ? .34 : .16,
            mouthAsym:scorn ? .90 : .34,
            smile:    sent ? 0 : scorn ? .28 : .10,
            status:   sent ? "SENT OUT" : scorn ? "SLEEP OUTSIDE" : "TENDING",
            progress: Math.min(.96, .10 + .80*(t/D)),
          },
        });
      },
      penelope: () => {
        if (t < PEN_IN) return;                         // still in her chamber
        const p = blk.penelope;
        const s = st.penelope || {};
        const scolding = t >= 16 && t < 28;
        const asking   = t >= 40 && t < 46;
        const grieving = t >= 46 && t < 56;
        const proof    = t >= 56;
        const pose = p.moving ? "walk_neutral" : (s.pose || "three_quarter_left");
        placeInstance(offctx, W, H, penelope, {
          anchor:{ x:p.x, y:p.y }, scale:0.52 * p.scale,
          state:{
            t: p.moving ? (t*0.40) % 4 : 0.5,
            band:"threeq",
            pose: pose,
            mirror: !p.moving && MIRROR_PEN.has(pose),
            gaze: s.gaze || { x:-.32, y:.10 },
            mouth:    scolding ? .55 : proof ? .50 : grieving ? -1 : .22,
            browUp:   grieving ? .62 : proof ? .70 : .28,
            browKnit: scolding ? .48 : grieving ? .50 : .22,
            frown:    grieving ? .58 : scolding ? .30 : .10,
            eyeNarrow:scolding ? .22 : .10,
            jaw:      scolding ? .38 : proof ? .42 : 0,
            status:   proof ? "GIVE ME PROOF" : grieving ? "THREE YEARS"
                    : asking ? "WHO ARE YOU" : scolding ? "LEAVE HIM ALONE"
                    : "COMING DOWN",
            progress: Math.min(.96, .12 + .80*(t/D)),
          },
        });
      },
      odysseus: () => {
        const p = blk.odysseus;
        const s = st.odysseus || {};
        const abused   = t >= 15 && t < 22;
        const withheld = t >= 40 && t < 46;
        const listening= t >= 46 && t < 56;
        const asked    = t >= 56;
        const pose = p.moving ? "walk_neutral" : (s.pose || "three_quarter_left");
        placeInstance(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale:0.52 * p.scale,
          state:{
            t: p.moving ? (t*0.42) % 4 : 0.5,
            guise:"beggar", band:"threeq",
            pose: pose,
            mirror: !p.moving && MIRROR_ODY.has(pose),
            gaze: s.gaze || { x:-.26, y:.10 },
            browKnit: withheld ? .46 : asked ? .40 : listening ? .30 : .26,
            eyeNarrow:withheld ? .38 : asked ? .34 : .24,
            browUp:   abused ? .34 : listening ? .22 : .10,
            frown:    abused ? .30 : 0,
            mouthAsym:asked ? .56 : withheld ? .40 : .18,
            smile:    asked ? .10 : 0,
            status:   asked ? "THE TEST BEGINS" : listening ? "HER GRIEF"
                    : withheld ? "NOT MY LINEAGE" : abused ? "ENDURING"
                    : "TO THE PILLAR",
            progress: Math.min(.96, .16 + .76*(t/D)),
          },
        });
      },
    };
    for (const who of ["melantho","penelope","odysseus"].sort((a,b) => blk[a].d - blk[b].d))
      draw[who]();
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
