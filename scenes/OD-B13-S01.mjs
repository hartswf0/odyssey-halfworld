/* ============================================================
   SCENE  OD-B13-S01 — The Phaeacians Carry Odysseus Home
   Book 1. A THIN Halfworld composition module: it places existing atlas asset
   instances on one clock. It does NOT redraw any asset. The engine runs ONE
   dotify + scene card over the whole stage, so every instance shares a single
   halftone. Deterministic (no Date/random).

   Beats (causal order):
     1. Odysseus finishes his tale and the Phaeacians sit in silence.
     2. Alcinous orders additional gifts packed in a chest and the farewell feast begins.
     3. At sunset Odysseus boards the convoy ship and lies on a prepared bed in the stern.
     4. The ship runs faster than a hawk while he sleeps and reaches Ithaca before dawn.
     5. The crew carries the sleeping man and his treasure onto the shore.

   The one location is Phorcys harbor (Ithaca) — the landing. The causal arc is
   compressed onto the arrival: the swift self-steering ship glides home under its
   own guidance while the drowsing king settles to rest (beats 3-4), then the
   silent expert crew bears the sleeping man and the sealed gift-chest onto the
   sheltered strand (beat 5, the exit state). As the wrapped sleeper is borne
   ashore in the crew's litter, the standing king "becomes" that borne passenger,
   so he is hidden once the carry begins (no double Odysseus).

   Composition (back -> front):
     location.phorcys-harbor          (full-bleed sheltered inlet: twin headlands,
        the great olive, the sacred nymph-cave, the sand landing, the inland path)
     vehicle.phaeacian-convoy-ship    (the swift self-navigating galley riding the
        deep anchorage of the inlet — HOMEWARD as she glides in, then MOORED)
     prop.gift-chest-and-treasures    (the sealed banded chest of guest-gifts set
        on the sand, the treasure the crew carries up the strand)
     ensemble.phaeacian-convoy-crew   (the silent expert convoy company: loading
        the gifts, then bearing the wrapped sleeping passenger ashore on a litter)
     character.odysseus               (the drowsing king aboard, sinking into sleep
        on the prepared bed; hidden once the crew bears the wrapped sleeper ashore)

   Exit / continuity: the crew carries the sleeping man and his treasure onto the shore.

   Verify:  node harness/render-scene.mjs scenes/OD-B13-S01.mjs --t 8
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

import harbor   from "../assets/location/phorcys-harbor.mjs";
import ship     from "../assets/vehicle/phaeacian-convoy-ship.mjs";
import chest    from "../assets/prop/gift-chest-and-treasures.mjs";
import crew     from "../assets/ensemble/phaeacian-convoy-crew.mjs";
import odysseus from "../assets/character/odysseus.mjs";

const MODS = {
  "location.phorcys-harbor": harbor,
  "vehicle.phaeacian-convoy-ship": ship,
  "prop.gift-chest-and-treasures": chest,
  "ensemble.phaeacian-convoy-crew": crew,
  "character.odysseus": odysseus,
};

// the moment the standing king is taken up as the borne wrapped sleeper
const CARRY_AT = 24;

export const scene = {
  id:"OD-B13-S01",
  title:"The Phaeacians Carry Odysseus Home",
  book:1,
  beats:[
    "Odysseus finishes his tale and the Phaeacians sit in silence.",
    "Alcinous orders additional gifts packed in a chest and the farewell feast begins.",
    "At sunset Odysseus boards the convoy ship and lies on a prepared bed in the stern.",
    "The ship runs faster than a hawk while he sleeps and reaches Ithaca before dawn.",
    "The crew carries the sleeping man and his treasure onto the shore.",
  ],
  exitState:"The crew carries the sleeping man and his treasure onto the shore.",
  duration:46,

  cast:[
    // back: the empty navigable inlet of Phorcys — twin sheltering headlands, the
    // great olive at the head of the bay, the sacred nymph-cave in the cliff, the
    // sand landing where a boat sets a sleeper ashore, the inland path up into
    // Ithaca. Full-bleed; no characters baked in.
    { asset:"location.phorcys-harbor", instance:"harbor",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the swift self-steering Phaeacian galley riding the deep anchorage of the
    // sheltered inlet. HOMEWARD (bright navigation aura, long wake) as she glides
    // in "faster than a hawk", then MOORED once she has fetched the landing.
    { asset:"vehicle.phaeacian-convoy-ship", instance:"ship",
      anchor:{x:.56,y:.585}, scale:.46,
      render:{ sail:"furled", t:0 } },

    // the sealed banded chest of guest-gifts, set on the sand of the landing at
    // left — the treasure the crew bears up the strand. Kept SEALED throughout.
    { asset:"prop.gift-chest-and-treasures", instance:"chest",
      anchor:{x:.175,y:.905}, scale:.285,
      render:{ open:0, conceal:0 } },

    // the silent expert convoy company on the strand: first a quiet carry-line
    // filing the gifts aboard, then the signature — the wrapped sleeping passenger
    // borne level on a litter by two bearers, gifts up the strand, the benched
    // oars and helmsman waiting. Foreground.
    { asset:"ensemble.phaeacian-convoy-crew", instance:"crew",
      anchor:{x:.44,y:1.02}, scale:.50,
      render:{ calm:0.85, spread:1.0, density:1.0 } },

    // Odysseus aboard, sinking into sleep on the prepared bed in the stern as the
    // ship carries him home — head bowed, gaze cast low, drowsing. Foreground-right.
    // Once the crew takes him up as the wrapped sleeper (CARRY_AT), he is hidden:
    // the borne passenger in the litter IS the sleeping king.
    { asset:"character.odysseus", instance:"odysseus",
      anchor:{x:.80,y:1.00}, scale:.55, pose:"grieving", band:"threeq",
      gaze:{x:0,y:.5}, render:{ t:0.5 } },
  ],

  timeline:[
    // beats 3-4 — at sunset he boards and lies down; the ship runs faster than a
    // hawk while he sleeps. The drowsing king settles, head bowed, eyes cast low.
    { op:"actor.pose", target:"odysseus", at:0.0,  args:{ pose:"grieving" } },
    { op:"actor.gaze", target:"odysseus", at:0.0,  args:{ gaze:{x:0,y:.5} } },
    { op:"actor.gaze", target:"odysseus", at:12.0, args:{ gaze:{x:-.06,y:.6} } },
    // beat 5 — the crew takes up the sleeping man: the standing king becomes the
    // wrapped passenger borne ashore in the litter, so the standing figure is hidden
    { op:"actor.hide", target:"odysseus", at:CARRY_AT, args:{} },
    { op:"timeline.capture", target:"OD-B13-S01", at:45.0, args:{ label:"EXIT" } },
  ],

  /* Draw every cast instance in SOLID tones into the offscreen buffer at time t.
     Back -> front (inlet, ship, chest, crew, then the drowsing king). The engine
     supplies the single dotify + card pass over the whole stage. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const carrying = t >= CARRY_AT;
    for (const c of scene.cast){
      const mod = MODS[c.asset];
      if (!mod) continue;
      const s = st[c.instance] || {};
      if (s.visible === false) continue;
      const anchor = s.anchor || c.anchor;

      let state = { ...(c.render || {}) };
      if (c.instance === "ship"){
        // glides home under her own guidance (bright aura + long wake), then rides
        // moored once she has fetched the sheltered landing
        state = { ...state, mode: carrying ? "moored" : "homeward", t:0 };
      } else if (c.instance === "crew"){
        // first a quiet carry-line loading the gifts aboard; then bearing the
        // wrapped sleeping passenger ashore, the crew's attention turned to him
        state = carrying
          ? { ...state, formation:"depart",  attention:0.7, cadence:0.28 }
          : { ...state, formation:"load",    attention:0.2, cadence:0.28 };
      } else if (c.instance === "odysseus"){
        // characters: fold pose / band / gaze from the timeline over static config
        state = { ...state, pose:s.pose || c.pose, band:c.band, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
