/* ============================================================
   SCENE  OD-B09-S02 — The Raid on the Cicones
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus's fleet sacks Ismarus and divides the captured wealth.
     2. He orders immediate departure, but the crews remain to feast.
     3. Cicones from inland arrive in organized force and fight through the day.
     4. Six men from every ship are killed before the fleet escapes at dusk.

   Stage layout (back -> front, one master clock):
     the ISMARUS COAST AND TOWN as the empty navigable set, full bleed: the
     sacked walled town smoking on the inland ridge, the trampled battlefield,
     the raiders' camp, the beached ship-line and the open sea, with the marked
     retreat route winding gate -> field -> camp -> ships.
       -> the CICONES ARMY massing across the inland band: the disciplined
          reinforcements pouring from the tree-line into ranked lines with
          spears and chariots, then leaning the whole advance down onto the beach.
       -> the TWELVE-SHIP FLEET drawn up at the waterline right: the squadron
          hauled on the strand, gangplank down loading the spoils, then shoving
          off, taking a casualty, and the flight to sea at dusk.
       -> ODYSSEUS'S FLEET CREWS on the beach left: victorious raiders driving up
          the sand, sprawling careless around the fire to feast, then crouched in
          a desperate shield-line when the Cicones counter.
       -> ODYSSEUS, foreground centre: the captain who takes Ismarus and divides
          the wealth, flings an arm up ordering immediate departure his men ignore,
          and finally strides for the ships leading the dusk escape.
   The sack, the ignored order, the day-long fight and the costly escape — all
   held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import ismarus from "/assets/location/ismarus-coast-and-town.mjs";
import cicones from "/assets/ensemble/cicones-army.mjs";
import fleet   from "/assets/vehicle/twelve-ship-fleet.mjs";
import crews   from "/assets/ensemble/odysseuss-fleet-crews.mjs";
import odysseus from "/assets/character/odysseus.mjs";

/* pose-token -> asset state, for the ensemble/vehicle instances the timeline
   drives with actor.pose ops (kept in the asset's own vocabulary). */
const FLEET_MODE = { beached:"beach", loading:"load", escape:"escape" };
const CREWS_FORM = {
  raid:   { formation:"raid",   attention:0.85, spread:1.0, density:1.0, surge:0.35 },
  feast:  { formation:"feast",  attention:0.15, spread:1.0, density:1.0, surge:0.0  },
  defend: { formation:"defend", attention:0.95, spread:1.0, density:1.0, surge:0.55 },
};
const CICONES_STATE = {
  mustering: { formation:"ranked-line",  pressure:0.14 },
  formed:    { formation:"ranked-line",  pressure:0.55 },
  advancing: { formation:"chariot-wedge", pressure:0.95 },
};

export const scene = {
  id:"OD-B09-S02",
  title:"The Raid on the Cicones",
  book:1,
  beats:[
    "Odysseus's fleet sacks Ismarus and divides the captured wealth.",
    "He orders immediate departure, but the crews remain to feast.",
    "Cicones from inland arrive in organized force and fight through the day.",
    "Six men from every ship are killed before the fleet escapes at dusk.",
  ],
  exitState:"Six men from every ship are killed before the fleet escapes at dusk.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: sacked Ismarus — town + battlefield + camp +
    // ship-line + sea + retreat route, full bleed
    { asset:"location.ismarus-coast-and-town", instance:"ismarus_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the CICONES ARMY across the inland band: disciplined reinforcements
    // mustering at the tree-line, then leaning the ranked advance down the beach
    { asset:"ensemble.cicones-army", instance:"cicones_01",
      anchor:{x:.52,y:.42}, scale:.50, pose:"mustering" },

    // the TWELVE-SHIP FLEET at the waterline right: beached, loading, escaping
    { asset:"vehicle.twelve-ship-fleet", instance:"fleet_01",
      anchor:{x:.77,y:1.00}, scale:.47, pose:"beached" },

    // ODYSSEUS'S FLEET CREWS on the beach left: raiders -> feasters -> defenders
    { asset:"ensemble.odysseuss-fleet-crews", instance:"crews_01",
      anchor:{x:.27,y:.92}, scale:.44, pose:"raid" },

    // ODYSSEUS, foreground centre: sacks the town, orders departure, leads escape
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.52,y:1.00}, scale:.35, pose:"hailing", band:"threeq",
      gaze:{x:-.30,y:-.10} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the sack — victorious raiders drive up the beach, ships hauled up
    // to divide and load the captured wealth; Odysseus surveys his taken town
    { op:"actor.pose", target:"crews_01",    at:0.0,  args:{ pose:"raid" } },
    { op:"actor.pose", target:"fleet_01",    at:0.0,  args:{ pose:"beached" } },
    { op:"actor.pose", target:"cicones_01",  at:0.0,  args:{ pose:"mustering" } },
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"crafty" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.30,y:.02} } },
    // beat 2: Odysseus orders immediate departure — arm flung up toward the
    // ships — but the crews ignore it and sprawl to feast; the fleet loads on
    { op:"actor.pose", target:"odysseus_01", at:6.0,  args:{ pose:"hailing" } },
    { op:"actor.gaze", target:"odysseus_01", at:6.0,  args:{ gaze:{x:.34,y:-.12} } },
    { op:"actor.pose", target:"fleet_01",    at:7.0,  args:{ pose:"loading" } },
    { op:"actor.pose", target:"crews_01",    at:11.0, args:{ pose:"feast" } },
    // beat 3: the Cicones muster from inland and bear disciplined pressure onto
    // the beach through the day; the feasting crews scramble into a shield-line
    { op:"actor.pose", target:"cicones_01",  at:20.0, args:{ pose:"formed" } },
    { op:"actor.pose", target:"crews_01",    at:24.0, args:{ pose:"defend" } },
    { op:"actor.pose", target:"cicones_01",  at:30.0, args:{ pose:"advancing" } },
    { op:"actor.pose", target:"odysseus_01", at:26.0, args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01", at:26.0, args:{ gaze:{x:.10,y:-.20} } },
    // beat 4 (exit): six men from every ship fall; the fleet breaks off and
    // flees to sea at dusk — Odysseus strides for the ships leading the escape
    { op:"actor.pose", target:"odysseus_01", at:36.0, args:{ pose:"striding" } },
    { op:"actor.gaze", target:"odysseus_01", at:36.0, args:{ gaze:{x:.38,y:.04} } },
    { op:"actor.pose", target:"fleet_01",    at:38.0, args:{ pose:"escape" } },
    { op:"timeline.capture", target:"OD-B09-S02", at:42.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the Ismarus set, the inland Cicones host, the fleet at the
     water, the crews on the beach, then Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "ismarus_01"){
        mod = ismarus;
        // the sacked, smoking settlement with the retreat route marked
        state = { layers:["sky","town","smoke","battlefield","camp","beach","sea","ships","retreat"] };

      } else if (c.instance === "cicones_01"){
        mod = cicones;
        const cs = CICONES_STATE[s.pose] || CICONES_STATE.mustering;
        state = { ...cs, showFocusPole:true };

      } else if (c.instance === "fleet_01"){
        mod = fleet;
        state = { mode: FLEET_MODE[s.pose] || "beach", t };

      } else if (c.instance === "crews_01"){
        mod = crews;
        state = CREWS_FORM[s.pose] || CREWS_FORM.raid;

      } else { // odysseus_01
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
