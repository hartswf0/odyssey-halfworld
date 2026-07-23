/* ============================================================
   SCENE  OD-B07-S02 — The Palace and the Gardens
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus stops before Alcinous's palace, dazzled by the bronze walls,
        golden doors, and the deathless guardian dogs.
     2. He observes the fifty women weaving and grinding within.
     3. Outside, an orchard and garden bear fruit through every season.
     4. He crosses the threshold under mist and finds the royal feast in
        progress.

   Stage layout (a splendor tableau, back -> front):
     ALCINOUS'S PALACE is the empty navigable set, full bleed — bronze walls,
       the golden double doors, silver posts, the great hearth. Behind and
       beside it two glimpsed panels hold the wonders Odysseus takes in:
       -> the PHAEACIAN ORCHARD AND GARDEN as a panel low-left — the all-season
          fruit and the two springs (beat 3, the marvel outside).
       -> the PALACE WORKING WOMEN as a panel low-right — the loom-line and
          quern-line beating in unison within (beat 2, the labor inside).
     -> the GOLD-AND-SILVER GUARDIAN DOGS flanking the golden doors, center,
        deathless watchers on the threshold (beat 1 / the gate he must pass).
     -> ODYSSEUS foreground center, halted in the doorway gap between the dogs:
        first flung into awe at the gleaming hall, then crossing the sill.
   The dazzling metalwork, the labor within, the fruit without, and the guarded
   threshold he crosses — all held on one clock, the whole arrival in one still.
   ============================================================ */
import { placeInstance, clamp01 } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace   from "../assets/location/alcinouss-palace.mjs";
import orchard  from "../assets/location/phaeacian-orchard-and-garden.mjs";
import dogs     from "../assets/creature/gold-and-silver-guardian-dogs.mjs";
import women    from "../assets/ensemble/palace-working-women.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B07-S02",
  title:"The Palace and the Gardens",
  book:1,
  beats:[
    "Odysseus stops before Alcinous's palace, dazzled by bronze walls, golden doors, and guardian dogs.",
    "He observes the fifty women weaving and grinding within.",
    "Outside, an orchard and garden bear fruit through every season.",
    "He crosses the threshold under mist and finds the royal feast in progress.",
  ],
  exitState:"He crosses the threshold under mist and finds the royal feast in progress.",
  duration:46,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: bronze hall, golden doors, silver posts, hearth,
    // full bleed — the splendor Odysseus is dazzled by (beat 1)
    { asset:"location.alcinouss-palace", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beat 3: the all-season orchard + garden, glimpsed as a panel low-left —
    // pears, apples, figs, olives and the two springs, the marvel outside
    { asset:"location.phaeacian-orchard-and-garden", instance:"orchard_01",
      anchor:{x:.135,y:.66}, scale:.32 },

    // beat 2: the fifty working women, a panel low-right — loom-line and
    // quern-line beating in unison, the skilled labor within
    { asset:"ensemble.palace-working-women", instance:"women_01",
      anchor:{x:.865,y:.66}, scale:.32 },

    // beat 1: the gold-and-silver guardian dogs flanking the golden doors,
    // center, deathless watchers on the threshold
    { asset:"creature.gold-and-silver-guardian-dogs", instance:"dogs_01",
      anchor:{x:.50,y:.70}, scale:.42, pose:"watch" },

    // Odysseus, foreground center in the doorway gap — halted in awe, then
    // crossing the sill inward
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.50,y:.99}, scale:.50, pose:"neutral", band:"front",
      gaze:{x:0,y:-.18} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: he stops, flung into awe at the bronze walls and golden doors;
    // the deathless dogs snap to orient on the approacher
    { op:"actor.pose", target:"odysseus_01", at:2.0,  args:{ pose:"hailing" } },
    { op:"actor.gaze", target:"odysseus_01", at:2.0,  args:{ gaze:{x:0,y:-.20} } },
    { op:"actor.pose", target:"dogs_01",     at:3.0,  args:{ pose:"orient" } },
    // beat 2: he takes in the women weaving and grinding within, to the right
    { op:"actor.pose", target:"odysseus_01", at:8.0,  args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:8.0,  args:{ gaze:{x:.34,y:-.02} } },
    // beat 3: his gaze turns out to the all-season orchard on the left
    { op:"actor.gaze", target:"odysseus_01", at:18.0, args:{ gaze:{x:-.34,y:.04} } },
    // beat 4 (exit): the dogs ease and grant passage; he crosses the threshold
    // inward under mist toward the royal feast
    { op:"actor.pose", target:"dogs_01",     at:30.0, args:{ pose:"allow" } },
    { op:"actor.pose", target:"odysseus_01", at:31.0, args:{ pose:"striding" } },
    { op:"actor.gaze", target:"odysseus_01", at:31.0, args:{ gaze:{x:0,y:-.06} } },
    { op:"timeline.capture", target:"OD-B07-S02", at:45.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the palace set, the orchard + women panels, the guardian
     dogs at the doors, then Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "palace_01"){
        mod = palace;
        // the full splendid hall, gleaming and warm-lit for the arrival
        state = { layers:["backwall","frieze","sidewalls","posts","doors",
                          "thrones","sideseats","floor","guestroute","hearth"],
                  fire:0.8, gleam:0.9, t };
      } else if (c.instance === "orchard_01"){
        mod = orchard;
        // the all-season garden: canopies, springs, planting beds
        state = { layers:["sky","wall","vines","trees","springs","beds","paths"] };
      } else if (c.instance === "women_01"){
        mod = women;
        // the two labor lines beating in unison within
        state = { formation:"both", synchrony:0.92, density:1.0,
                  spread:1.0, attention:0.25, t };
      } else if (c.instance === "dogs_01"){
        mod = dogs;
        // pose folded from the timeline (watch -> orient -> allow)
        state = { pose:s.pose || c.pose, t };
      } else {
        // Odysseus: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
