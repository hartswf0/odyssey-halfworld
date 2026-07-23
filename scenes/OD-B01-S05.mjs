/* ============================================================
   SCENE OD-B01-S05 — Athena Arms Telemachus with a Course
   Book 1. A thin Halfworld COMPOSITION module: it places existing
   assets on one clock and lets the engine run a single dotify + card
   pass over the whole stage. No asset is redrawn here.

   Staged beat (View-1): in the hall at Ithaca, Athena-as-Mentes leans
   toward the grieving prince and counsels him — call an assembly,
   dismiss the suitors, sail for news. Between them the ABSENT king is
   conjured: the imagined armed Odysseus flashes at the gate. Off to the
   side, the plotted voyage projects as a chart — Pylos, Sparta, and the
   still-unresolved father past the last port.

   Cast (back -> front):
     route_map        set_piece.route-to-pylos-and-sparta   (projection)
     odysseus_vision  divine_fx.imagined-armed-odysseus      (thought-image)
     telemachus       character.telemachus                   (listening)
     mentes           character.athena-as-mentes             (counsel->command)
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";
import Mentes from "/assets/character/athena-as-mentes.mjs";
import Telemachus from "/assets/character/telemachus.mjs";
import ImaginedOdysseus from "/assets/divine_fx/imagined-armed-odysseus.mjs";
import RouteMap from "/assets/set_piece/route-to-pylos-and-sparta.mjs";

// instance -> asset module (so stage() can look each cast member up)
const MOD = {
  route_map:       RouteMap,
  odysseus_vision: ImaginedOdysseus,
  telemachus:      Telemachus,
  mentes:          Mentes,
};

export const scene = {
  id: "OD-B01-S05",
  title: "Athena Arms Telemachus with a Course",
  book: 1,

  beats: [
    "Telemachus explains Penelope's suspended marriage and the suitors' destruction of his estate.",
    "Athena imagines Odysseus returning armed and condemns the suitors' behavior.",
    "She orders Telemachus to call an assembly, dismiss the suitors, and sail for news.",
    "She invokes Orestes as a model and tells Telemachus to leave boyhood behind.",
  ],
  exitState: "She invokes Orestes as a model and tells Telemachus to leave boyhood behind.",
  duration: 24,

  // which assets, where on the 1120x760 stage, initial pose (feet-anchored y)
  cast: [
    { asset:"set_piece.route-to-pylos-and-sparta", instance:"route_map",
      anchor:{x:.865, y:.50}, scale:.35, pose:"plotted" },
    { asset:"divine_fx.imagined-armed-odysseus", instance:"odysseus_vision",
      anchor:{x:.66, y:1.0}, scale:.54, pose:"present" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.40, y:1.0}, scale:.50, pose:"lean_forward", gaze:{x:.28, y:-.06} },
    { asset:"character.athena-as-mentes", instance:"mentes",
      anchor:{x:.20, y:1.0}, scale:.58, pose:"reach_forward", gaze:{x:.22, y:.05} },
  ],

  // ordered ops on ONE clock
  timeline: [
    // 1. the prince lays out the ruin of his house — head still low, listening
    { op:"actor.gaze", target:"telemachus", at:0.0, args:{ gaze:{x:.10, y:.20} } },
    // 2. the absent king is conjured armed at the gate
    { op:"fx.play", target:"odysseus_vision", at:4.0, args:{} },
    { op:"actor.gaze", target:"telemachus", at:5.0, args:{ gaze:{x:.30, y:-.08} } },
    // 3. counsel hardens into command — Mentes points the course
    { op:"actor.pose", target:"mentes", at:13.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"mentes", at:13.0, args:{ gaze:{x:.30, y:-.05} } },
    // 4. leave boyhood behind — the prince lifts his eyes to the road ahead
    { op:"actor.pose", target:"telemachus", at:19.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus", at:19.0, args:{ gaze:{x:.35, y:-.10} } },
    { op:"timeline.capture", target:"OD-B01-S05", at:23.0, args:{ label:"EXIT" } },
  ],

  // draw every cast instance in SOLID tones; the engine dotifies the whole
  // stage once. Order is back -> front (chart + vision behind the actors).
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    for (const c of scene.cast){
      const mod = MOD[c.instance];
      if (!mod) continue;
      placeInstance(offctx, W, H, mod, {
        anchor: c.anchor,
        scale:  c.scale,
        state:  { ...st[c.instance], t },
      });
    }
  },
};
export default scene;
