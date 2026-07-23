/* OD-B02-S02 — The Secret of Penelope's Loom
   A thin Halfworld COMPOSITION module. It places existing assets on one master
   clock; it does not redraw any of them. The engine runs a single dotify + card
   pass over the whole stage, so every instance shares one halftone.

   Beats (causal order):
     1. Antinous rejects Telemachus's charge and blames Penelope for prolonging
        the courtship.
     2. He recounts how she wove Laertes's shroud by day and secretly unravelled
        it by night.
     3. A maid exposed the deception and the suitors forced her to finish the web.
     4. Antinous demands that Telemachus send his mother back to Icarius to choose
        a husband.

   Staging: the present-time assembly ground frames the whole space. Upper-center,
   as a recalled TORCHLIT NIGHT MEMORY, hangs the temporal-split loom overlay — the
   web woven by day, unpicked by night. Within that memory the queen PENELOPE works
   her LOOM (the shroud object). In the foreground the two present-time speakers:
   ANTINOUS jabs his accusation from the left, TELEMACHUS receives the charge on the
   right. On the master clock the memory runs its telling — day-weave (beat 2) into
   night-unravel, then the shroud forced to completion (beat 3) — while Antinous
   turns from the accusing jab (beats 1-2) to the flat command (beat 4). */

import ground   from "/assets/location/ithacan-assembly-ground.mjs";
import memory   from "/assets/divine_fx/torchlit-night-memory.mjs";
import shroud   from "/assets/prop/laertess-shroud-and-loom.mjs";
import penelope from "/assets/character/penelope-at-the-loom.mjs";
import antinous from "/assets/character/antinous.mjs";
import telem    from "/assets/character/telemachus.mjs";

import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

export const scene = {
  id:"OD-B02-S02",
  title:"The Secret of Penelope's Loom",
  book:2,

  beats:[
    "Antinous rejects Telemachus's charge and blames Penelope for prolonging the courtship.",
    "He recounts how she wove Laertes's shroud by day and secretly unravelled it by night.",
    "A maid exposed the deception and the suitors forced Penelope to finish the web.",
    "Antinous demands that Telemachus send his mother back to Icarius to choose a husband.",
  ],
  exitState:"Antinous demands that Telemachus send his mother back to Icarius to choose a husband.",
  duration:44,

  cast:[
    // back -> front
    { asset:"location.ithacan-assembly-ground", instance:"ground_01",   anchor:{x:.50,y:1.00}, scale:1.00, pose:"convened" },
    { asset:"divine_fx.torchlit-night-memory",  instance:"memory_01",   anchor:{x:.50,y:.62},  scale:.68,  pose:"day-weaving" },
    { asset:"prop.laertess-shroud-and-loom",    instance:"shroud_01",   anchor:{x:.585,y:.74}, scale:.42,  pose:"woven-length" },
    { asset:"character.penelope-at-the-loom",   instance:"penelope_01", anchor:{x:.40,y:.72},  scale:.46,  pose:"penelope_weave_public", gaze:{x:.28,y:.14} },
    { asset:"character.antinous",               instance:"antinous_01", anchor:{x:.22,y:.99},  scale:.58,  pose:"jabbing_accusation",    gaze:{x:.40,y:-.02} },
    { asset:"character.telemachus",             instance:"telem_01",    anchor:{x:.81,y:.99},  scale:.52,  pose:"head_lowered",          gaze:{x:-.32,y:.10} },
  ],

  timeline:[
    // beat 1 — Antinous rejects the charge, jabbing at Telemachus; the prince
    // stands ashamed under the accusation
    { op:"fx.play",    target:"memory_01",   at:1.5, args:{} },
    // beat 2 — the recounting: by day she wove, by night she unpicked it. The
    // memory turns from public weaving to the secret night reversal
    { op:"actor.pose", target:"penelope_01", at:2.0, args:{ pose:"penelope_unweave" } },
    { op:"actor.gaze", target:"penelope_01", at:2.0, args:{ gaze:{x:-.55,y:-.05} } },
    { op:"actor.pose", target:"telem_01",    at:3.0, args:{ pose:"skepticism" } },
    { op:"actor.gaze", target:"telem_01",    at:3.0, args:{ gaze:{x:-.24,y:0} } },
    // beat 3 — a maid exposed it; the suitors forced her to finish the web
    { op:"actor.pose", target:"penelope_01", at:5.0, args:{ pose:"penelope_pause" } },
    { op:"actor.gaze", target:"penelope_01", at:5.0, args:{ gaze:{x:-.10,y:-.12} } },
    // beat 4 — Antinous drops the jab for a flat command: send her to Icarius.
    // Telemachus meets it, roused
    { op:"actor.pose", target:"antinous_01", at:6.5, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"antinous_01", at:6.5, args:{ gaze:{x:.30,y:-.02} } },
    { op:"actor.pose", target:"telem_01",    at:7.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telem_01",    at:7.0, args:{ gaze:{x:-.32,y:-.04} } },
    { op:"timeline.capture", target:"OD-B02-S02", at:42.0, args:{ label:"EXIT" } },
  ],

  // ---- derived state on the master clock ----
  // The recalled shroud cycles through its telling as Antinous narrates it:
  // woven-length (day) -> unravel-track (the night undoing) -> completed (forced).
  _shroudModeAt(t){
    if (t < 2.0) return "woven-length";
    if (t < 5.0) return "unravel-track";
    return "completed";
  },
  // Penelope's own loom (drawn inside her figure) mirrors the same telling.
  _penelopeLoomAt(t){ return (t >= 2.0 && t < 5.0) ? "unwoven" : "woven"; },
  // The memory overlay intensifies as the deception is laid bare, then eases as
  // the web is forced to completion.
  _memoryIntensityAt(t){
    if (t < 2.0) return 0.7;
    if (t < 5.0) return 1.35;
    return 1.0;
  },

  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let extra = { t };

      if (c.instance === "ground_01"){
        // present-time civic backdrop, full set
        extra = { layers:["sky","hills","palace","route","floor","tiers","town","elders","stone"] };
      } else if (c.instance === "memory_01"){
        // the torchlit night memory runs on the master clock; intensity tracks
        // the beats (weave -> unravel -> forced completion)
        extra = { t, intensity: scene._memoryIntensityAt(t) };
      } else if (c.instance === "shroud_01"){
        // the shroud object cycles its telling state (not a rig pose)
        extra = { t, mode: scene._shroudModeAt(t) };
      } else if (c.instance === "penelope_01"){
        // the queen at her work: pose + gaze from the folded timeline, loom mode
        // and secretive face carried alongside
        extra = { t, gaze:s.gaze, loom: scene._penelopeLoomAt(t),
                  smile:.12, mouthAsym:.36, browUp:.16, browKnit:.18, eyeNarrow:.12 };
      } else {
        // the two present-time speakers: carry pose + gaze; Antinous speaks
        // throughout (mouth open), Telemachus mostly holds silent
        const speaking = (c.instance === "antinous_01");
        extra = { t, gaze:s.gaze, mouth: speaking ? 0.6 : -0.2 };
      }

      const mod = { ground_01:ground, memory_01:memory, shroud_01:shroud,
                    penelope_01:penelope, antinous_01:antinous, telem_01:telem }[c.instance];

      placeInstance(offctx, W, H, mod, {
        anchor:c.anchor, scale:c.scale,
        state:{ pose:s.pose, band:s.band, ...extra },
      });
    }
  },
};
export default scene;
