/* ============================================================
   SCENE  OD-B15-S03 — Theoclymenus Joins the Voyage
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. At the Pylian harbor Telemachus orders the crew to ready the ship.
     2. The fugitive seer Theoclymenus approaches and asks for passage after
        killing a kinsman.
     3. Telemachus accepts him and places him aboard.
     4. The ship leaves under Athena's wind and sails through the night toward
        Ithaca.

   Stage layout (back -> front, read LEFT -> RIGHT as the causal sweep):
     BACKDROP — PYLOS HARBOR spread across the whole stage: night-lit sky, the
                open sea, the tapering open-sea ROUTE OUT, the sandy beach, the
                farewell waterline, the chariot road and the crew staging ring.
                Drawn WITHOUT its own berthed ship — the crew ensemble supplies
                the working vessel, so the two don't fight.
     MID      — TELEMACHUS'S CREW at the moored ship: the practised homeward
                company loading guest-gifts up the gangplank, boarding over the
                gunwale and shipping their looms — the readied vessel of beats
                1 & 3, brisk to the prince's order.
     RIGHT    — ATHENA'S HOMEWARD WIND as the terminus panel: the ship under a
                taut square sail, the goddess's star-emblem breathing the gusts,
                the bold safe-path arrow lifting over the suitors' ambush X to
                the home landfall — beat 4, the overnight run to Ithaca.
     FRONT    — TELEMACHUS at the left, turned to the ship, ordering the crew
                then opening a hand to accept the suppliant; THEOCLYMENUS beside
                him, the fugitive seer bowed and both hands offered, begging
                passage, then boarded.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import harbor from "/assets/location/pylos-harbor.mjs";
import wind from "/assets/divine_fx/athenas-homeward-wind.mjs";
import crew from "/assets/ensemble/telemachuss-crew.mjs";
import telemachus from "/assets/character/telemachus.mjs";
import theoclymenus from "/assets/character/theoclymenus.mjs";

export const scene = {
  id:"OD-B15-S03",
  title:"Theoclymenus Joins the Voyage",
  book:1,
  beats:[
    "At the Pylian harbor Telemachus orders the crew to ready the ship.",
    "The fugitive seer Theoclymenus approaches and asks for passage after killing a kinsman.",
    "Telemachus accepts him and places him aboard.",
    "The ship leaves under Athena's wind and sails through the night toward Ithaca.",
  ],
  exitState:"The ship leaves under Athena's wind and sails through the night toward Ithaca.",
  duration:42,

  // asset · instance · anchor(feet/base, normalized) · scale · pose · band · gaze
  cast:[
    // PYLOS HARBOR — the whole set behind everything (no ship layer: the crew
    // ensemble carries the vessel).
    { asset:"location.pylos-harbor", instance:"harbor_01",
      anchor:{x:.50, y:1.00}, scale:1.00 },

    // ATHENA'S HOMEWARD WIND — the terminus panel, upper-right over the open
    // sea: the exit heading, the taut sail and the safe-path arrow to Ithaca.
    { asset:"divine-fx.athenas-homeward-wind", instance:"wind_01",
      anchor:{x:.82, y:.70}, scale:.50 },

    // TELEMACHUS'S CREW — the readied ship + working company, mid-ground,
    // pushed centre-right so the left foreground opens for the two principals.
    { asset:"ensemble.telemachuss-crew", instance:"crew_01",
      anchor:{x:.46, y:1.00}, scale:.66 },

    // TELEMACHUS — foreground far left, the tallest figure, turned to the ship,
    // ordering the crew; clearly apart from the working company.
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.125, y:.99}, scale:.58, pose:"confrontation", band:"threeq",
      gaze:{x:.34, y:-.06} },

    // THEOCLYMENUS — foreground centre-left between the prince and the ship, the
    // fugitive seer bowed and both hands offered, supplicating for passage.
    { asset:"character.theoclymenus", instance:"theoclymenus_01",
      anchor:{x:.30, y:1.00}, scale:.52, pose:"theo_supplicate", band:"threeq",
      gaze:{x:-.14, y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Telemachus orders the crew — knit brow, pointing to the ship
    { op:"actor.pose", target:"telemachus_01",  at:0.0,  args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus_01",  at:0.0,  args:{ gaze:{x:.32,y:-.06} } },
    // beat 2: the seer approaches and begs passage — bowed, both hands offered
    { op:"actor.pose", target:"theoclymenus_01", at:2.0,  args:{ pose:"theo_supplicate" } },
    { op:"actor.gaze", target:"theoclymenus_01", at:2.0,  args:{ gaze:{x:-.12,y:.02} } },
    // beat 3: Telemachus accepts — hand opened in welcome, places him aboard
    { op:"actor.pose", target:"telemachus_01",  at:18.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"telemachus_01",  at:18.0, args:{ gaze:{x:.20,y:.02} } },
    // beat 3->4: the seer is aboard — the watchful fugitive settling seaward
    { op:"actor.pose", target:"theoclymenus_01", at:22.0, args:{ pose:"theo_alert" } },
    { op:"actor.gaze", target:"theoclymenus_01", at:22.0, args:{ gaze:{x:.30,y:-.08} } },
    // beat 4 (exit): the ship leaves under Athena's wind, sailing through the
    // night toward Ithaca — the wind field rises to full homeward drive
    { op:"fx.play",    target:"wind_01",         at:26.0, args:{} },
    { op:"timeline.capture", target:"OD-B15-S03", at:40.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the harbor set, the homeward-wind sea panel, the readied
     ship+crew, then Telemachus and the suppliant seer in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "harbor_01"){
        mod = harbor;
        // the full harbor set MINUS its own berthed ship (the crew supplies the
        // vessel); farewell waterline before departure, then the emptied berth.
        state = { layers:["sky","sea","searoute","waves","beach","farewell","road","staging"],
                  status: t < 26 ? "READYING" : "DEPARTED",
                  progress: Math.min(0.94, 0.16 + 0.78 * (t / D)) };

      } else if (c.instance === "wind_01"){
        mod = wind;
        // the terminus panel: Athena's homeward wind. Kept legible throughout as
        // the exit heading, then rising to full steady drive at cast-off (t>=26).
        const rise = Math.min(1, t / 30);
        state = { t: 0.6 + t * 0.12,
                  intensity: 0.85 + 0.55 * rise,
                  belly: 0.7 + 0.4 * rise,
                  avoid: 1.15,
                  layers:["sky","source","gusts","sea","ambush","landfall","direct","safepath","hull","sail"],
                  status: t < 26 ? "RISING" : "HOMEWARD",
                  progress: Math.min(0.92, 0.20 + 0.7 * (t / D)) };

      } else if (c.instance === "crew_01"){
        mod = crew;
        // beats 1&3: the practised company loads gifts and boards, brisk to the
        // order; at cast-off (t>=22) they settle to the oars for the run home.
        const departing = t >= 22;
        const haste = Math.min(0.95, 0.55 + 0.4 * (t / D));
        state = { formation: departing ? "row" : "loading-departure",
                  attention: departing ? 0.9 : 0.8,
                  haste,
                  density: 1.0, spread: 1.0,
                  bustle: (0.15 + 0.7 * ((t * 0.06) % 1)),   // deterministic reaction-wave sweep
                  status: departing ? "OARS" : "BRISK",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / D)) };

      } else if (c.instance === "telemachus_01"){
        mod = telemachus;
        // ordering the crew, then opening a hand to accept the suppliant seer
        const accepting = t >= 18;
        state = { t: 0.5, band: c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  mouth: accepting ? 0.4 : -0.2, blink: 0,
                  status: accepting ? "ACCEPTS" : "ORDERS",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / D)) };

      } else { // theoclymenus_01 — the fugitive seer
        mod = theoclymenus;
        const aboard = t >= 22;
        state = { t: 0.45, band: c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  status: aboard ? "ABOARD" : "SUPPLIANT",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / D)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
