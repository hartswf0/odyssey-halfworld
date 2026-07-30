/* ============================================================
   SCENE  OD-B18-S01 — Irus Challenges the Stranger
   Book XVIII, scene 1 of N. ADDITIVE: creates nothing, modifies nothing;
   it only COMPOSES assets that already exist. Shape copied from the
   reference scene, scenes/OD-B16-S03.mjs, and from its megaron sibling
   scenes/OD-B16-S05.mjs (the crowd-over-a-room case).

   ROOM. location.megaron-hall, state "day" — the ordinary hall: arms still on
   the walls, the fire low, the floor in order. Not "feast": the feast state
   sets a row of cups along the laden table tops at exactly the height the ring
   of heads occupies, and the crowd dissolves into crockery.
   THE FLOOR IS SHOVED CLEAR. The room is cast with its `furniture` layer
   dropped, because that is the beat: the suitors come up off the benches and
   shove the floor open for the fight (it is the ensemble's own `clearing`
   formation), and the master's chair goes back with them — nobody sets a ring
   round a throne. Everything load-bearing stays: shell, roof, far wall, the
   great doors, THE SILL, the arms racks, the postern, the maids' door, the
   stair, the two pillars, the dressed spine and the hearth — so the room a
   later Book XVIII scene paints is the same room with its benches back, and
   every station this scene names is still painted where it stands. The crowd's
   own `hall`/`floor` layers are switched off for the reason in reverse: this
   room already has architecture and a floor.
   ONE hall asset with a state channel; no second hall is built or cast.

   BLOCKING. No hand-placed figure anchors. Every body resolves through
   scenes/_plans/megaron.mjs via blockingAt(), by station NAME:

     odysseus  threshold  — THE SILL. The whole scene is an attempt to move
                            him off it, so he never leaves it: he holds the
                            doorstone from the first frame to the last.
     irus      postern -> table_l -> pillar_l
                          — the palace's own beggar, who runs errands for
                            whoever feeds him, comes up out of the service
                            passage he fetches through, plants himself at the
                            near end of the floor where everyone can hear him,
                            and gives that ground back — upstage, smaller — as
                            the oath is sworn and the fight becomes real.
     antinous  bench_r1 -> table_r
                          — he is at his place on the right-hand bench and comes
                            forward to his own table to name the prize.

   No two of them ever resolve to the same station, and no two ever share a
   depth: the sill is z .16, the two tables are z .70 to left and right of the
   spine, and Irus ends at z .44. The frame is a triangle, not a line. Irus
   changes depth twice — z .24 to z .70 and back to z .44, crossing the ring's
   own band on the way — so the bodies are painted in an order SORTED on their
   blocked y rather than fixed in the source: the painter's order follows the
   blocking instead of contradicting it.

   ONE BODY, ONE GUISE. The atlas asks for `character.odysseus-as-beggar`.
   That is character.odysseus-b16 with guise:"beggar" — the same body Book XVI
   used, never a cut to a second module. There is no transformation in this
   scene, so no restoration flare: the guise is held flat, which is the point
   (Irus is shouting at a man he cannot read).

   THE CROWD. ensemble.suitor-fight-ring carries the hall coming up off its
   benches: `clearing` while the floor is shoved open, `ring` with a laugh
   travelling the arc while the two beggars trade insults, `betting` on the
   prize, and `oath` on the last beat, every hand up. It floods its own canvas
   with inkLevel(1) before drawing anybody, so it is keyed at 0.85 — just under
   that level — which floods the field away and lands only the crowd on the
   megaron's floor. Its arc is set upstage of the two men who stand in front of
   it, `foreground:0` drops the cropped near pair that would otherwise sit
   exactly where Irus and Antinous stand, and `showFloorRing:false` keeps a
   second scuffed ellipse off a floor this hall already paints a hearth on.

   Beats (Od. 18.1–65):
     1. Irus arrives and tries to drive the stranger off the threshold.
     2. They trade insults; the suitors come up delighted and clear a ring.
     3. Antinous offers the goat paunches on the fire and the run of the hall
        to whichever of them wins.
     4. Odysseus makes the suitors swear that no one will strike him from behind.

   CONTINUITY IN. First scene of Book XVIII: there is no previous
   exitOccupancy to import, so INITIAL is declared here, from the plan, in
   station names. CONTINUITY OUT is computed, never written.

   Verify:  node harness/render-scene.mjs scenes/OD-B18-S01.mjs --t 13
            node harness/render-scene.mjs scenes/OD-B18-S01.mjs --t 43
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field    from "../assets/location/megaron-hall.mjs";
import odysseus from "../assets/character/odysseus-b16.mjs";
import irus     from "../assets/character/irus.mjs";
import antinous from "../assets/character/antinous.mjs";
import ring     from "../assets/ensemble/suitor-fight-ring.mjs";
import prize    from "../assets/prop/goat-sausages.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 46;

/* the room, minus the benches and tables the suitors shove back to make the
   ring. Every load-bearing fixture of the megaron stays. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth"];

/* --- CONTINUITY IN. Opening positions, from the plan, by name. ------------ */
const INITIAL = {
  odysseus: "threshold",   // set down on the sill; he does not leave it
  irus:     "postern",     // in from the service passage he fetches through
  antinous: "bench_r1",    // his own place at the right-hand bench
};

/* --- BLOCKING. Stations, not coordinates. -------------------------------- */
const MOVES = [
  // the palace beggar comes down the left of the floor and takes it
  { who:"irus",     from:"postern",  to:"table_l",  t0: 2, t1:10 },
  // the ringleader stands and comes forward to his table to name the prize
  { who:"antinous", from:"bench_r1", to:"table_r",  t0:21, t1:27 },
  // the bluster drains: he gives the near floor back as the oath is sworn
  { who:"irus",     from:"table_l",  to:"pillar_l", t0:36, t1:42 },
];

/* --- THE CROWD BOX -------------------------------------------------------
   ensemble.suitor-fight-ring lays its members on an ellipse in the fractions
   of whatever box it is given, and sizes each member in absolute pixels
   (78px in the deep band .. 156px at the near clip), so the BOX — not a
   member scale — decides where the ring lands on this room's floor.
   ONE ring, not two: the asset's deep band of craning heads is dropped
   (`rings:1`), because it would stand where the man on the sill stands and bury
   him — and because one horseshoe leaves far more paper showing than two. The
   ellipse is set so the arc runs from screen y≈.69 at the back of the ring —
   upstage of the hearth, so those men read as standing BEHIND the fire and the
   prize on its near rim is painted after them and stays visible — down to
   y≈.81 at its open mouth. The two bodies at the tables (y≈.81) therefore
   stand clear in front of the whole arc, and the man on the sill (feet y≈.562)
   stands clear above it. NINE members, not fifteen: at fifteen they touch and
   their legs print as one picket fence across the frame; at nine there is paper
   between every man and each one reads as a body. Nobody hits the asset's own
   foot clamp, so the ring never flattens onto one line. The front stays open —
   the camera is standing in the gap, and the cleared floor is the subject. */
const CROWD = {
  at:{ x:.50, y:.930 }, w:.86, h:.62,
  centreX:.500, centreY:.790, radiusX:.349, radiusY:.177, openFront:.46,
  ranks:[9],
};

/* the laugh travelling round the arc while the insults are traded */
const W0 = 16, W1 = 25;
const waveAt = t => clamp((t - W0) / (W1 - W0), 0, 1);

/* the ring's formation is a function of the clock, not a hand-drawn frame */
function ringAt(t){
  if (t < 9)  return { formation:"clearing", density:.55, attention:.45, heat:.18,
                       betting:.10, wave:1.4, status:"GATHERING",  progress:.10 };
  if (t < 16) return { formation:"clearing", density:.85, attention:.70, heat:.34,
                       betting:.15, wave:1.4, status:"CLEARING",   progress:.24 };
  if (t < 25) return { formation:"ring",     density:1.0, attention:.85, heat:.50,
                       betting:.35, wave:waveAt(t), waveSpread:.13,
                       status:"LAUGHING",   progress:.46 };
  if (t < 34) return { formation:"betting",  density:1.0, attention:.42, heat:.46,
                       betting:.85, wave:1.4, status:"BETTING",    progress:.62 };
  return             { formation:"oath",     density:1.0, attention:1.0, heat:.10,
                       betting:.00, wave:1.4, status:"SWORN",      progress:.86 };
}

/* THE CROWD CUTOUT. The ensemble floods its canvas with inkLevel(1) (lum .858)
   before it draws a body; placeInstance keys at lum >= .895, which would leave
   that field standing as an opaque panel over the room. Keying at 0.85 floods
   it away from the border and lands only the ring on the megaron's own floor.
   (Same device as scenes/OD-B16-S05.mjs.) */
function placeCrowd(offctx, W, H, state){
  const w = W * CROWD.w, h = H * CROWD.h;
  const x = CROWD.at.x * W - w / 2, y = CROWD.at.y * H - h;
  const sig = `${state.formation}|${Math.round((state.wave ?? 0)*20)}`
            + `|${Math.round((state.heat ?? 0)*20)}|${Math.round((state.density ?? 1)*20)}`
            + `|${Math.round((state.betting ?? 0)*20)}`;
  offctx.drawImage(keyedModuleCanvas(ring, w, h, state, sig, 0.85), x, y);
}

/* THE PRIZE ON THE FIRE. prop.goat-sausages paints its own ember bed inside
   zones.fire (y .42 .. .71 of its box), so the box is dropped by the part of
   itself that lies BELOW that bed, and the bed lands on the near rim of the
   hearth this room already draws at the `hearth` station. Placed through the
   plan like any other body — a prop gets no private geometry either. */
const PRIZE_BASE = 0.17;          // of the hearth station's prop scale
const FIRE_Y1    = 0.71;          // near edge of the asset's own ember bed
const HEARTH_RIM = 0.034;         // the drawn hearth's near rim, below its station

export const scene = {
  id:"OD-B18-S01",
  title:"Irus Challenges the Stranger",
  book:18,
  plan:"megaron",
  duration:D,
  beats:[
    "The palace beggar Irus arrives and tries to drive Odysseus from the threshold.",
    "They trade insults while the suitors gather, delighted by the prospect of a fight.",
    "Antinous offers the goat paunches on the fire, and the run of the hall, to the winner.",
    "Odysseus makes the suitors swear that no one will strike him from behind.",
  ],
  exitState:"The floor is cleared, the ring is set and the terms are sworn. Odysseus has not moved off the threshold: he holds the sill, and he has made the suitors swear that no hand will strike him from behind. Irus has given up the near floor and stands back at the left pillar, still blustering, committed to a fight he has just heard the terms of. Antinous holds his own table on the right, having named the goat paunches on the fire and the run of the hall as the winner's prize. The paunches are on the hearth, one of them marked as the pick. The fight itself has not begun.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"day" },
    { asset:"ensemble.suitor-fight-ring", instance:"ring_01",
      anchor:{x:.50,y:.93}, scale:.62, blend:"multiply" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.37, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.irus", instance:"irus",
      anchor:{x:.29,y:.81}, scale:.41, band:"threeq", pose:"irus_boundary" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.71,y:.81}, scale:.40, band:"threeq", pose:"three_quarter_left" },
    { asset:"prop.goat-sausages", instance:"prize_01",
      anchor:{x:.50,y:.80}, scale:.13 },
  ],

  timeline:[
    { op:"actor.pose",  target:"odysseus", at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus", at: 0.0, args:{ gaze:{ x:-.22, y:.10 } } },
    { op:"actor.pose",  target:"irus",     at: 0.0, args:{ pose:"irus_boundary" } },
    { op:"actor.pose",  target:"antinous", at: 0.0, args:{ pose:"arms_crossed" } },
    { op:"crowd.state", target:"ring_01",  at: 0.0, args:{ formation:"clearing", status:"GATHERING" } },
    // 1. the boundary shouted at a fellow beggar
    { op:"actor.pose",  target:"irus",     at: 9.0, args:{ pose:"irus_bluster" } },
    { op:"actor.gaze",  target:"irus",     at: 9.0, args:{ gaze:{ x:.44, y:-.06 } } },
    { op:"crowd.state", target:"ring_01",  at: 9.0, args:{ formation:"clearing", status:"CLEARING" } },
    // 2. the insults, and the hall on its feet
    { op:"actor.pose",  target:"odysseus", at:14.0, args:{ pose:"skepticism" } },
    { op:"actor.pose",  target:"antinous", at:16.0, args:{ pose:"commanding_stance" } },
    { op:"crowd.state", target:"ring_01",  at:W0,   args:{ formation:"ring", status:"LAUGHING", wave:0 } },
    { op:"actor.pose",  target:"odysseus", at:19.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus", at:19.0, args:{ gaze:{ x:-.46, y:.08 } } },
    // 3. the prize named
    { op:"actor.pose",  target:"antinous", at:25.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"antinous", at:25.0, args:{ gaze:{ x:-.40, y:.18 } } },
    { op:"prop.state",  target:"prize_01", at:26.0, args:{ mode:"select" } },
    { op:"crowd.state", target:"ring_01",  at:25.0, args:{ formation:"betting", status:"BETTING" } },
    { op:"actor.pose",  target:"irus",     at:27.0, args:{ pose:"irus_appetite" } },
    { op:"actor.gaze",  target:"irus",     at:27.0, args:{ gaze:{ x:-.26, y:-.16 } } },
    // 4. the oath: no one strikes the stranger from behind
    { op:"actor.pose",  target:"odysseus", at:34.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze",  target:"odysseus", at:34.0, args:{ gaze:{ x:.10, y:-.04 } } },
    { op:"crowd.state", target:"ring_01",  at:34.0, args:{ formation:"oath", status:"SWORN" } },
    { op:"actor.pose",  target:"irus",     at:36.0, args:{ pose:"irus_boundary" } },
    { op:"actor.gaze",  target:"irus",     at:36.0, args:{ gaze:{ x:.30, y:-.04 } } },
    { op:"actor.pose",  target:"antinous", at:39.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"antinous", at:39.0, args:{ gaze:{ x:-.28, y:-.02 } } },
    { op:"timeline.capture", target:"OD-B18-S01", at:44.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);
    const crowd = ringAt(t);

    const arriving  = t <  9;                 // Irus coming up out of the passage
    const insulting = t >= 12 && t < 25;      // the trade of insults
    const prized    = t >= 25 && t < 34;      // the paunches and the run of the hall
    const sworn     = t >= 34;                // the oath

    /* the field first — it paints the room, everything else keys onto it */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"day", t:0.55, layers:HALL_LAYERS,
              progress:Math.min(.94, .2 + .7*(t/D)), status:"THE FLOOR CLEARED" },
    });

    /* --- THE RING: the hall up off its benches, behind the two beggars --- */
    placeCrowd(offctx, W, H, {
      ...crowd,
      centreX:CROWD.centreX, centreY:CROWD.centreY,
      radiusX:CROWD.radiusX, radiusY:CROWD.radiusY,
      openFront:CROWD.openFront, ringScale:1.0,
      rings:1, perRing:CROWD.ranks, foreground:0,
      showHall:false, showFloorRing:false,
      layers:["ring-inner"],
      t:Math.min(.98, t/D),
    });

    /* --- the painted bodies, ordered by the blocking ---------------------
       Antinous overtakes Odysseus in depth when he steps up to pillar_r, so
       the order is sorted on the resolved y rather than fixed in the source. */
    const draws = [];

    /* ODYSSEUS — one body, guise held flat at "beggar". He does not move. */
    {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale:0.50 * p.scale,
          state:{
            t:0.45, guise:"beggar", band:"threeq",
            pose: s.pose || "three_quarter_left",
            gaze: s.gaze || { x:-.22, y:.10 },
            browKnit: sworn ? .30 : insulting ? .46 : .22,
            browUp:   sworn ? .40 : .16,
            eyeNarrow:insulting ? .40 : .24,
            frown:    insulting ? .26 : 0,
            mouthAsym:insulting ? .44 : .18,
            jaw:      (insulting && t < 22) || (sworn && t < 40) ? .36 : 0,
            status:   sworn ? "SWEAR IT" : insulting ? "OFF THIS DOORSTONE"
                    : prized ? "THE TERMS" : "THE STRANGER",
            progress: Math.min(.96, .16 + .76*(t/D)),
          },
        });
      }});
    }

    /* IRUS — bluster, appetite, and the boundary claimed again. */
    {
      const p = blk.irus;
      const s = st.irus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, irus, {
          anchor:{ x:p.x, y:p.y }, scale:0.40 * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "irus_boundary",
            gaze: s.gaze || { x:.20, y:-.08 },
            browKnit: prized ? .18 : insulting ? .84 : .52,
            browUp:   prized ? .30 : .14,
            eyeNarrow:prized ? .30 : .30,
            frown:    prized ? 0   : insulting ? .50 : .36,
            smile:    prized ? .66 : 0,
            cheek:    prized ? .48 : 0,
            mouthAsym:insulting ? .38 : .10,
            jaw:      insulting ? .92 : prized ? .30 : .26,
            status:   prized ? "THE PAUNCHES" : insulting ? "GET OUT OF THE DOOR"
                    : arriving ? "MY DOORWAY" : "BLUSTER",
            progress: Math.min(.96, .14 + .78*(t/D)),
          },
        });
      }});
    }

    /* ANTINOUS — the terms of the bout, set by the man who owns the fire. */
    {
      const p = blk.antinous;
      const s = st.antinous || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, antinous, {
          anchor:{ x:p.x, y:p.y }, scale:0.39 * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "arms_crossed",
            gaze: s.gaze || { x:-.18, y:-.04 },
            browKnit: prized ? .44 : .26,
            eyeNarrow:sworn ? .40 : .28,
            smile:    prized ? .30 : 0,
            mouthAsym:prized ? .62 : .44,
            jaw:      prized && t < 31 ? .42 : 0,
            status:   sworn ? "NO HAND FROM BEHIND"
                    : prized ? "HIS PICK OF THESE" : "AMUSED",
            progress: Math.min(.96, .18 + .74*(t/D)),
          },
        });
      }});
    }

    /* THE PRIZE — on the hearth, at the hearth station, called at t=26. */
    {
      const p = megaron.at("hearth", { kind:"prop" });
      const s = PRIZE_BASE * p.scale;
      const y = p.y + HEARTH_RIM + s * (1 - FIRE_Y1);
      draws.push({ y, run(){
        placeInstance(offctx, W, H, prize, {
          anchor:{ x:p.x, y }, scale:s,
          state:{
            mode: t >= 26 ? "select" : "fire", char:.35, t:0.5,
            status: t >= 26 ? "CHOICE" : "ON THE FIRE",
            progress: Math.min(.9, .12 + .5*(t/D)),
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
   cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
