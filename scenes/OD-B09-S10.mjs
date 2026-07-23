/* ============================================================
   SCENE  OD-B09-S10 — Escape beneath the Rams
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. At dawn Polyphemus opens the cave and feels every animal's back as it passes.
     2. Odysseus binds three rams abreast for each man, suspending a sailor
        beneath the middle animal.
     3. He clings beneath the great lead ram while Polyphemus speaks tenderly to it.
     4. Outside, the men release themselves, drive the flock to the ship, and row away.
     5. They divide the animals and sacrifice the great ram to Zeus.

   Stage layout (back -> front, one master clock). Read LEFT -> RIGHT as time:
     the CYCLOPS BEACH AND WAITING SHIP as the empty navigable set, full bleed:
     the dark cave-mouth + switchback path on the left headland, the flat sand
     and launch water, the moored ship prow-to-sea on the right.
       -> POLYPHEMUS at the cave mouth (left), blind, groping — the gatekeeper
          feeling every back as the flock files out at dawn.
       -> the LEAD RAM passing right beneath him, Odysseus cinched flat under its
          belly, held in the extended pause under the searching giant hand.
       -> the ESCAPE RAM TEAMS mid-frame: three rams lashed abreast, a sailor
          slung beneath the middle beast, edging carefully clear of the cave.
       -> ODYSSEUS on the sand near the berth (right), released and upright now,
          driving the freed flock down to the waiting ship.
       -> the freed FLOCK grazing at the berth (a second ram-team, unbound) —
          the animals gathered to be divided, the great ram set apart for Zeus.
   Dawn's blind groping, the three-abreast rig, the lead-ram anchor, the drive to
   the ship and the divided flock — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import beach from "/assets/location/cyclops-beach-and-waiting-ship.mjs";
import polyphemus from "/assets/character/polyphemus.mjs";
import leadRam from "/assets/creature/lead-ram.mjs";
import escapeTeams from "/assets/creature/escape-ram-teams.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B09-S10",
  title:"Escape beneath the Rams",
  book:1,
  beats:[
    "At dawn Polyphemus opens the cave and feels every animal's back as it passes.",
    "Odysseus binds three rams abreast for each man, suspending a sailor beneath the middle animal.",
    "He clings beneath the great lead ram while Polyphemus speaks tenderly to it.",
    "Outside, the men release themselves, drive the flock to the ship, and row away.",
    "They divide the animals and sacrifice the great ram to Zeus.",
  ],
  exitState:"They divide the animals and sacrifice the great ram to Zeus.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: cave-mouth + path on the left, sand + launch
    // water, the waiting ship moored prow-to-sea on the right — full bleed
    { asset:"location.cyclops-beach-and-waiting-ship", instance:"beach_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // POLYPHEMUS at the cave mouth, blind, feeling the backs as the flock files
    // out — the towering gatekeeper who cannot see the men under the fleece
    { asset:"character.polyphemus", instance:"polyphemus_01",
      anchor:{x:.145,y:.505}, scale:.50, pose:"poly_grope", band:"threeq",
      gaze:{x:.34,y:.40} },

    // the LEAD RAM passing right beneath him, Odysseus cinched flat under the
    // belly, held in the extended pause under the giant searching hand (beat 3)
    { asset:"creature.lead-ram", instance:"leadram_01",
      anchor:{x:.31,y:.735}, scale:.34, pose:"pause-under-hand" },

    // the ESCAPE RAM TEAMS mid-frame: three rams lashed abreast, a sailor slung
    // beneath the middle beast, edging carefully clear of the cave (beats 2 & 4)
    { asset:"creature.escape-ram-teams", instance:"teams_01",
      anchor:{x:.505,y:.845}, scale:.42, pose:"slow-exit" },

    // ODYSSEUS on the sand by the berth, released and upright, driving the freed
    // flock down to the waiting ship (beat 4)
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.685,y:.945}, scale:.30, pose:"striding", band:"threeq",
      gaze:{x:.30,y:.02} },

    // the freed FLOCK grazing at the berth — a second, unbound ram-team; the
    // gathered animals to be divided, the great ram set apart for Zeus (beat 5)
    { asset:"creature.escape-ram-teams", instance:"flock_01",
      anchor:{x:.855,y:.985}, scale:.30, pose:"herd" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: dawn — Polyphemus opens the cave and gropes the backs as they pass
    { op:"actor.gaze", target:"polyphemus_01", at:0.0,  args:{ gaze:{x:.34,y:.40} } },
    // beat 3: the great lead ram halts under the searching hand, Odysseus flat
    // beneath it — the extended pause (its initial cast pose is already this)
    { op:"actor.pose", target:"leadram_01", at:2.0,  args:{ pose:"pause-under-hand" } },
    // the pause ends: the lead ram files on and the teams edge carefully out
    { op:"actor.pose", target:"leadram_01", at:18.0, args:{ pose:"walk" } },
    { op:"actor.pose", target:"teams_01",   at:20.0, args:{ pose:"slow-exit" } },
    // beat 4: clear of the cave, the men release and drive the flock to the ship
    { op:"actor.pose", target:"teams_01",    at:30.0, args:{ pose:"release" } },
    { op:"actor.pose", target:"odysseus_01", at:30.0, args:{ pose:"hailing" } },
    { op:"actor.gaze", target:"odysseus_01", at:30.0, args:{ gaze:{x:.36,y:-.06} } },
    // beat 5 (exit): the animals gathered at the berth, divided — the great ram
    // set apart for Zeus (the flock settles to grazing)
    { op:"actor.pose", target:"flock_01",    at:38.0, args:{ pose:"herd" } },
    { op:"timeline.capture", target:"OD-B09-S10", at:42.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the beach-and-ship set, then Polyphemus at the cave, the lead
     ram beneath him, the escaping teams, Odysseus by the berth, the freed flock. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "beach_01"){
        mod = beach;
        // the full navigable set at first light: cave, path, ship, marker, hides
        state = { t };

      } else if (c.instance === "polyphemus_01"){
        mod = polyphemus;
        // blind, groping the backs — gaze cast down toward the passing flock
        state = { t:0.5, band:c.band, pose:s.pose || c.pose,
                  eye:"blind", browKnit:.42, gaze:s.gaze || c.gaze };

      } else if (c.instance === "odysseus_01"){
        mod = odysseus;
        state = { t:0.5, band:c.band, pose:s.pose || c.pose,
                  gaze:s.gaze || c.gaze };

      } else if (c.instance === "leadram_01"){
        mod = leadRam;
        state = { t, pose:s.pose || c.pose };

      } else { // teams_01 / flock_01
        mod = escapeTeams;
        state = { t, pose:s.pose || c.pose };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
