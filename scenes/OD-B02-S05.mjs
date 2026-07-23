/* ============================================================
   SCENE OD-B02-S05 — Athena Answers on the Shore
   Book 2 (staged in the atlas's Book-1 clock family). A thin Halfworld
   COMPOSITION module: it places existing assets on ONE master clock and
   lets the engine run a single dotify + card pass over the whole stage.
   No asset is redrawn here.

   Staged beat (View-1): Telemachus walks alone down to the Ithacan
   waterline, washes his hands in the grey surf, and prays to Athena at the
   marked prayer stone. The goddess answers — she stands beside him wearing
   the familiar elder MENTOR, tall and certain, the divine tell leaking
   through the old man's bright eyes, and promises he will not lack courage.
   Her counsel hardens into logistical COMMAND: gather provisions while she
   recruits a crew and finds a ship. Over the sea the following-wind
   POTENTIAL gathers — latent gust arrows lengthening toward the voyage —
   as the whole enterprise becomes a hidden operation under the suitors' gaze.

   Cast (back -> front):
     shore     location.ithacan-shore                              (the set)
     wind      environment.sea-foam-and-following-wind-potential   (gust overlay)
     telemachus character.telemachus                               (prays -> resolves)
     mentor    character.athena-as-mentor                          (answers -> commands)
   ============================================================ */
import shore      from "/assets/location/ithacan-shore.mjs";
import wind       from "/assets/environment/sea-foam-and-following-wind-potential.mjs";
import telemachus from "/assets/character/telemachus.mjs";
import mentor     from "/assets/character/athena-as-mentor.mjs";

import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

const clamp01 = x => x<0?0:(x>1?1:x);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

// instance -> asset module (so stage() can look each cast member up)
const MOD = {
  shore:      shore,
  wind:       wind,
  telemachus: telemachus,
  mentor:     mentor,
};

export const scene = {
  id: "OD-B02-S05",
  title: "Athena Answers on the Shore",
  book: 1,

  beats: [
    "Telemachus walks alone to the beach, washes his hands, and prays to Athena.",
    "Athena appears with Mentor's body and voice and promises he will not lack courage.",
    "She orders him to gather provisions while she recruits a crew and finds a ship.",
    "The voyage becomes a hidden operation running beneath the suitors' gaze.",
  ],
  exitState: "The voyage becomes a hidden operation running beneath the suitors' gaze.",
  duration: 20,

  // which assets, where on the 1120x760 stage, initial pose (feet-anchored y)
  cast: [
    // the Ithacan shore fills the stage: sky, sea, harbor, foaming waterline,
    // wet + dry beach, dune, town path, launch route, and the prayer stone.
    { asset:"location.ithacan-shore", instance:"shore",
      anchor:{x:.50, y:1.00}, scale:1.00, pose:"calm" },
    // the following-wind POTENTIAL overlays the sea as gust streamlines born
    // on the west edge (its opaque sky/sea/foam layers are withheld so the
    // set below shows through — only the gust arrows + source bloom draw).
    { asset:"environment.sea-foam-and-following-wind-potential", instance:"wind",
      anchor:{x:.50, y:1.00}, scale:1.00, pose:"latent" },
    // the prince at the prayer stone on the wet sand (shore anchor prayer:shore
    // ~ x.30). Youthful, slighter, kneeling grief that lifts to alert resolve.
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.31, y:.86}, scale:.40, pose:"grief", gaze:{x:-.06, y:.42} },
    // Athena wearing Mentor answers at his side, standing tall — counsel that
    // hardens into logistical command, looking left toward the prince.
    { asset:"character.athena-as-mentor", instance:"mentor",
      anchor:{x:.56, y:.90}, scale:.46, pose:"mentor_still", gaze:{x:-.22, y:0} },
  ],

  // ordered ops on ONE clock
  timeline: [
    // beat 1 — Telemachus prays at the stone, head bowed to the surf
    { op:"actor.gaze", target:"telemachus", at:0.0, args:{ gaze:{x:-.06, y:.42} } },
    // beat 2 — the goddess answers in Mentor's form; counsel, promise of courage.
    // The prince's head lifts and turns toward the familiar elder voice.
    { op:"actor.pose", target:"mentor",     at:3.0, args:{ pose:"mentor_counsel" } },
    { op:"actor.gaze", target:"mentor",     at:3.0, args:{ gaze:{x:-.16, y:0} } },
    { op:"actor.pose", target:"telemachus", at:4.0, args:{ pose:"alert" } },
    { op:"actor.gaze", target:"telemachus", at:4.0, args:{ gaze:{x:.30, y:-.06} } },
    // beat 3 — counsel hardens into COMMAND: gather provisions, a crew, a ship.
    // Mentor stands tall and lays out the order with a firm forward directive.
    { op:"actor.pose", target:"mentor",     at:9.0, args:{ pose:"mentor_command" } },
    { op:"actor.gaze", target:"mentor",     at:9.0, args:{ gaze:{x:-.16, y:-.02} } },
    { op:"actor.pose", target:"telemachus", at:10.0, args:{ pose:"listening" } },
    { op:"actor.gaze", target:"telemachus", at:10.0, args:{ gaze:{x:.22, y:-.04} } },
    // beat 4 — the prince takes the charge: the voyage becomes a hidden operation
    { op:"actor.pose", target:"telemachus", at:15.0, args:{ pose:"command" } },
    { op:"actor.gaze", target:"telemachus", at:15.0, args:{ gaze:{x:.18, y:-.08} } },
    { op:"timeline.capture", target:"OD-B02-S05", at:19.0, args:{ label:"EXIT" } },
  ],

  // the following-wind field GATHERS on the master clock: latent potential at
  // the prayer, rising as the command lands, toward the voyage-driving wind.
  _intensityAt(t){ return 0.35 + 0.75*smooth((t-3.0)/13.0); },

  // draw every cast instance in SOLID tones; the engine dotifies the whole
  // stage once. Order is back -> front (set + wind behind the two figures).
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const inten = scene._intensityAt(t);

    for (const c of scene.cast){
      const mod = MOD[c.instance];
      if (!mod) continue;
      const s = st[c.instance] || {};
      let extra = { t };

      if (c.instance === "shore"){
        // the full set; its own prayer stone + launch route read the scene
        extra = { layers:["sky","sea","harbor","surf","beach","dune","path","launch","prayer","anchors"] };
      } else if (c.instance === "wind"){
        // overlay ONLY the gathering gust streamlines + their western source,
        // driven by the master clock — the opaque sky/sea/foam are withheld so
        // the shore set behind shows through the potential.
        extra = { t, intensity:inten, layers:["wind","source"] };
      } else {
        // principals: carry pose + gaze from the folded timeline
        extra = { t, gaze:s.gaze };
      }

      placeInstance(offctx, W, H, mod, {
        anchor: c.anchor,
        scale:  c.scale,
        state:  { pose:s.pose, band:s.band, ...extra },
      });
    }
  },
};
export default scene;
