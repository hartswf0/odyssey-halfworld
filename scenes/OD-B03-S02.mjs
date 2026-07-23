/* ============================================================
   SCENE OD-B03-S02 — Telemachus Questions Nestor
   Book 3 (staged in the atlas's Book-1 clock family). A thin Halfworld
   COMPOSITION module: it places existing assets on ONE master clock and
   lets the engine run a single dotify + card pass over the whole stage.
   No asset is redrawn here.

   Staged beat (View-1, causal order): the feast on the sacrificial beach at
   Pylos is over. Old Nestor turns to his guests and asks who they are —
   traders or raiders. Telemachus names himself and begs the unsoftened truth
   about his father Odysseus. The old king's face drifts into the war years:
   he praises Odysseus's unequalled cunning, and — as the memory of Troy
   surfaces behind him as a faint ghost field — he begins the account of the
   quarrel that split the returning Greek fleet.

   Cast (back -> front):
     beach      location.pylos-sacrificial-beach        (the set: sea, ships, feast)
     troy       divine_fx.troy-memory-field             (the war surfacing as memory)
     mentor     character.athena-as-mentor              (Athena in Mentor, watching)
     telemachus character.telemachus                    (asks for the truth)
     nestor     character.nestor                        (host -> living archive)
   ============================================================ */
import beach      from "../assets/location/pylos-sacrificial-beach.mjs";
import troy       from "../assets/divine_fx/troy-memory-field.mjs";
import mentor     from "../assets/character/athena-as-mentor.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import nestor     from "../assets/character/nestor.mjs";

import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

const clamp01 = x => x<0?0:(x>1?1:x);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

// instance -> asset module (so stage() can look each cast member up)
const MOD = {
  beach:      beach,
  troy:       troy,
  mentor:     mentor,
  telemachus: telemachus,
  nestor:     nestor,
};

export const scene = {
  id: "OD-B03-S02",
  title: "Telemachus Questions Nestor",
  book: 1,

  beats: [
    "After the meal Nestor asks the strangers who they are — traders or raiders.",
    "Telemachus names himself and asks for the unsoftened truth about Odysseus.",
    "Nestor remembers Troy and praises Odysseus's unequalled cunning.",
    "He begins the account of the quarrel that split the returning Greek fleet.",
  ],
  exitState: "He begins the account of the quarrel that split the returning Greek fleet.",
  duration: 20,

  // which assets, where on the 1120x760 stage, initial pose (feet-anchored y)
  cast: [
    // the Pylos sacrificial beach fills the stage: sky, sea, surf, the drawn-up
    // ships, the divisions of the feasting host, and the banked feast benches.
    { asset:"location.pylos-sacrificial-beach", instance:"beach",
      anchor:{x:.50, y:1.00}, scale:1.00, pose:"feasting" },
    // the Troy memory surfaces as a GHOST field over the whole scene — its own
    // opaque sky/sea "field" layer is withheld so the beach shows through and
    // only the faint councils / routes / fleet / motes / voice draw as memory.
    { asset:"divine_fx.troy-memory-field", instance:"troy",
      anchor:{x:.50, y:1.00}, scale:1.00, pose:"gathering" },
    // Athena wearing Mentor stands quietly at the guest's side, watching —
    // the trusted elder shell, composed and unreadable, turned to the king.
    { asset:"character.athena-as-mentor", instance:"mentor",
      anchor:{x:.17, y:.94}, scale:.42, pose:"mentor_still", gaze:{x:.24, y:0} },
    // the young prince, seated among the guests, leaning in to ask his question,
    // turned right toward the old king.
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.40, y:.92}, scale:.42, pose:"neutral", gaze:{x:.28, y:0} },
    // old Nestor at the head of the feast on the right — the gracious host who
    // opens into the living archive of the war, gaze drifting up into Troy.
    { asset:"character.nestor", instance:"nestor",
      anchor:{x:.72, y:.94}, scale:.50, pose:"nestor_host", gaze:{x:-.20, y:.04} },
  ],

  // ordered ops on ONE clock
  timeline: [
    // beat 1 — the host turns to his guests: who are you, traders or raiders?
    { op:"actor.pose", target:"nestor",     at:0.0, args:{ pose:"nestor_host" } },
    { op:"actor.gaze", target:"nestor",     at:0.0, args:{ gaze:{x:-.24, y:.04} } },
    { op:"actor.gaze", target:"telemachus", at:0.0, args:{ gaze:{x:.28, y:0} } },
    // beat 2 — Telemachus names himself and asks for the unsoftened truth.
    // He leans forward; the old king listens, still the host.
    { op:"actor.pose", target:"telemachus", at:5.0, args:{ pose:"alert" } },
    { op:"actor.gaze", target:"telemachus", at:5.0, args:{ gaze:{x:.30, y:-.06} } },
    { op:"actor.gaze", target:"nestor",     at:5.5, args:{ gaze:{x:-.18, y:.02} } },
    // beat 3 — Nestor remembers Troy and praises Odysseus's cunning. His face
    // drifts up-and-away into the war years; the memory field begins to surface.
    { op:"actor.pose", target:"nestor",     at:10.0, args:{ pose:"nestor_telling" } },
    { op:"actor.gaze", target:"nestor",     at:10.0, args:{ gaze:{x:.34, y:-.42} } },
    { op:"actor.pose", target:"telemachus", at:10.5, args:{ pose:"listening" } },
    { op:"actor.gaze", target:"telemachus", at:10.5, args:{ gaze:{x:.24, y:-.02} } },
    // beat 4 — he begins the account of the quarrel that split the fleet: the
    // living archive opens, the divided homeward routes dominate the memory.
    { op:"actor.pose", target:"nestor",     at:15.0, args:{ pose:"nestor_archive" } },
    { op:"actor.gaze", target:"nestor",     at:15.0, args:{ gaze:{x:.20, y:-.54} } },
    { op:"timeline.capture", target:"OD-B03-S02", at:19.0, args:{ label:"EXIT" } },
  ],

  // the Troy memory GATHERS on the master clock: nothing while the host still
  // asks (beats 1-2), councils welling up as he remembers (beat 3), the divided
  // routes + fleet dominating as he opens the account of the quarrel (beat 4).
  _troyLayersAt(t){
    if (t < 9.0)  return [];                                        // host still asking — no memory
    if (t < 14.5) return ["councils","fleet","motes","source"];    // Troy welling up
    return ["councils","routes","fleet","fallen","motes","source"];// the divided host
  },

  // draw every cast instance in SOLID tones; the engine dotifies the whole
  // stage once. Order is back -> front (set + memory behind the three figures).
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const troyLayers = scene._troyLayersAt(t);

    for (const c of scene.cast){
      const mod = MOD[c.instance];
      if (!mod) continue;
      const s = st[c.instance] || {};
      let extra = { t };

      if (c.instance === "beach"){
        // the full set at the banked-feast register (its own small nestor fixture
        // withheld so the composed Nestor figure is the only king on the beach).
        extra = { layers:["sky","sea","surf","ships","divisions","feast"] };
      } else if (c.instance === "troy"){
        // the war as GHOST memory: withhold the opaque "field" grounds so the
        // beach shows through; surface strata are gated by the master clock.
        if (!troyLayers.length) continue;   // no memory yet — skip entirely
        extra = { t, layers: troyLayers };
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
