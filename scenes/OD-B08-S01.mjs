/* ============================================================
   SCENE  OD-B08-S01 — The Phaeacian Assembly and the Ship
   Book 1. A THIN Halfworld composition module: it places existing atlas asset
   instances on one clock. It does NOT redraw any asset. The engine runs ONE
   dotify + scene card over the whole stage, so every instance shares a single
   halftone. Deterministic (no Date/random).

   Beats (causal order):
     1. At dawn Athena moves through the city in a herald's form, calling the
        people to assembly.
     2. She makes Odysseus appear larger and more impressive as he enters.
     3. Alcinous orders fifty-two sailors to prepare a ship and invites the
        nobles to feast.
     4. The people ready the vessel while the palace fills for celebration.

   Composition (back -> front):
     location.phaeacian-assembly-ground  (full-bleed seaside civic bowl: harbor,
        palace connection, ship-route slipway, paved floor, rising tiers, king's
        raised place. The set's OWN baked back ship is dropped so the convoy-ship
        vehicle is THE readied vessel.)
     vehicle.phaeacian-convoy-ship       (the swift self-steering galley moored in
        the harbour, being made ready — moored, then the boarding plank run out)
     ensemble.phaeacian-sailors          (the fifty-two-man work-gang launching,
        masting, provisioning and inspecting the hull on the strand, foreground)
     character.athena-as-herald          (the disguised goddess, the mobile civic
        voice moving through the ground, proclaiming the call to assembly)
     character.odysseus                  (the stranger entering, drawn LARGER and
        more impressive by Athena's grace — foreground centre, the biggest figure)

   Verify:  node harness/render-scene.mjs scenes/OD-B08-S01.mjs --t 8
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

import ground   from "/assets/location/phaeacian-assembly-ground.mjs";
import ship     from "/assets/vehicle/phaeacian-convoy-ship.mjs";
import sailors  from "/assets/ensemble/phaeacian-sailors.mjs";
import herald   from "/assets/character/athena-as-herald.mjs";
import odysseus from "/assets/character/odysseus.mjs";

const MODS = {
  "location.phaeacian-assembly-ground": ground,
  "vehicle.phaeacian-convoy-ship": ship,
  "ensemble.phaeacian-sailors": sailors,
  "character.athena-as-herald": herald,
  "character.odysseus": odysseus,
};

export const scene = {
  id:"OD-B08-S01",
  title:"The Phaeacian Assembly and the Ship",
  book:1,
  beats:[
    "At dawn Athena moves through the city in a herald's form, calling the people to assembly.",
    "She makes Odysseus appear larger and more impressive as he enters.",
    "Alcinous orders fifty-two sailors to prepare a ship and invites the nobles to feast.",
    "The people ready the vessel while the palace fills for celebration.",
  ],
  exitState:"The people ready the vessel while the palace fills for celebration.",
  duration:40,

  cast:[
    // back: the empty navigable seaside ground — harbour, palace connection, the
    // ramped ship-route, the paved civic floor, the rising public tiers and the
    // king's raised place. The set's OWN baked ship is left off so the convoy-ship
    // vehicle placed on the water reads as the single vessel being readied.
    { asset:"location.phaeacian-assembly-ground", instance:"ground",
      anchor:{x:.50,y:1.00}, scale:1.00,
      render:{ layers:["sky","harbor","palace","route","floor","tiers","kingsplace"] } },

    // the swift Phaeacian convoy galley moored in the harbour at back-right, being
    // made ready for the stranger's passage home. Its waterline is set onto the
    // set's harbour band. Mode advances moored -> boarding as the gang preps her.
    { asset:"vehicle.phaeacian-convoy-ship", instance:"ship",
      anchor:{x:.70,y:.50}, scale:.40,
      render:{ mode:"moored" } },

    // the fifty-two-man work-gang readying the vessel on the strand: launching on
    // the hawser, masting the yard, provisioning jars aboard, a captain inspecting.
    // Foreground-right, working the ship-route side of the ground.
    { asset:"ensemble.phaeacian-sailors", instance:"sailors",
      anchor:{x:.70,y:1.02}, scale:.52,
      render:{ formation:"full-launch", attention:.6, density:1.0, spread:1.0, heave:.3 } },

    // Athena as a Phaeacian town herald — the disguised goddess, the mobile civic
    // voice, moving through the ground on the palace-road side and proclaiming the
    // call to assembly; then a beckoning summons; then poised, the crowd gathered.
    { asset:"character.athena-as-herald", instance:"herald",
      anchor:{x:.26,y:.82}, scale:.40, pose:"herald_proclaim", band:"front",
      gaze:{x:.10,y:-.12}, render:{ t:0.5 } },

    // Odysseus entering the assembly — Athena pours grace over him so he stands
    // LARGER and more impressive than any man there. Foreground centre, the
    // biggest figure: he strides in, then settles into a composed, kingly stance.
    { asset:"character.odysseus", instance:"odysseus",
      anchor:{x:.46,y:1.00}, scale:.60, pose:"striding", band:"threeq",
      gaze:{x:.14,y:-.02}, render:{ t:0.5 } },
  ],

  timeline:[
    // beat 1 — dawn: the herald at full cry, calling the people to assembly
    { op:"actor.pose", target:"herald",   at:0.0,  args:{ pose:"herald_proclaim" } },
    { op:"actor.gaze", target:"herald",   at:0.0,  args:{ gaze:{x:.10,y:-.12} } },
    // beat 2 — Odysseus enters; Athena's grace makes him greater. He strides in,
    // then draws up into a composed, impressive stance as eyes turn on him.
    { op:"actor.pose", target:"odysseus", at:9.0,  args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus", at:9.0,  args:{ gaze:{x:.06,y:-.02} } },
    // beat 3 — Alcinous orders the fifty-two to prepare the ship: the herald turns
    // her cry into a beckoning summons, gathering the crowd toward the work
    { op:"actor.pose", target:"herald",   at:16.0, args:{ pose:"herald_summon" } },
    { op:"actor.gaze", target:"herald",   at:16.0, args:{ gaze:{x:-.32,y:-.04} } },
    // beat 4 — the vessel is readied and the palace fills: the summons settles to
    // a poised, ready stance, the call answered, the ground convened
    { op:"actor.pose", target:"herald",   at:30.0, args:{ pose:"herald_poise" } },
    { op:"actor.gaze", target:"herald",   at:30.0, args:{ gaze:{x:.02,y:0} } },
    { op:"timeline.capture", target:"OD-B08-S01", at:39.0, args:{ label:"EXIT" } },
  ],

  /* Draw every cast instance in SOLID tones into the offscreen buffer at time t.
     Back -> front (set, ship, work-gang, herald, then the impressive stranger).
     The engine supplies the single dotify + card pass over the whole stage. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    for (const c of scene.cast){
      const mod = MODS[c.asset];
      if (!mod) continue;
      const s = st[c.instance] || {};
      if (s.visible === false) continue;
      const anchor = s.anchor || c.anchor;

      let state = { ...(c.render || {}) };
      if (c.instance === "ship"){
        // the vessel being readied: moored while the gang preps her, then the
        // boarding plank run out as she is made ready for the passage
        state = { ...state, mode: t < 22 ? "moored" : "boarding", t:0 };
      } else {
        // characters: fold pose / band / gaze from the timeline over the static
        // render config; placeInstance owns anchor + scale
        state = { ...state, pose:s.pose || c.pose, band:c.band, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
