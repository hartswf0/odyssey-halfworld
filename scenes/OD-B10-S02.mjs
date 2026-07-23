/* ============================================================
   SCENE  OD-B10-S02 — The Laestrygonian Harbor
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The fleet enters a narrow harbor ringed by cliffs; Odysseus alone moors
        outside.
     2. Three scouts meet a giant girl who directs them to her parents' house.
     3. The queen summons Antiphates, who seizes and eats one scout.
     4. Laestrygonians mass on the cliffs, spear crews like fish, and crush the
        trapped ships with boulders.
     5. Odysseus cuts his cable and escapes with only his own ship.

   Stage layout (back -> front, one master clock):
     TELEPYLUS HARBOR, full bleed — the empty trap-set: cliff ring, high attack
     ledges, the switchback city path, the single narrow entrance neck and the
     outer anchorage where Odysseus keeps his own ship off (the "empty-basin"
     layers, so the intact moorings don't fight the wrecks laid over them).
       -> ANTIPHATES AND QUEEN, an inset up on the city cliff (top right) — the
          king's hall where the queen summons Antiphates and he seizes a scout.
       -> the DESTROYED FLEET, crushed and splintering down in the enclosed basin
          — the eleven black galleys smashed by boulders, decks empty.
       -> the LAESTRYGONIAN GIANTS massed along the cliff rim above the basin
          (their own harbour/boats layers dropped — the real harbor and fleet play
          those parts), hurling boulders and spearing the swimmers like fish.
       -> ODYSSEUS in the foreground at the outer anchorage — moored outside the
          throat, first watching the slaughter, then cutting his cable to escape
          with only his own ship.
   The narrow-harbor trap, the summons, the seized scout, the massing giants and
   the crushed fleet, and the lone escape — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import harbor from "/assets/location/telepylus-harbor.mjs";
import antiphates from "/assets/character/antiphates-and-queen.mjs";
import fleet from "/assets/vehicle/destroyed-fleet.mjs";
import giants from "/assets/ensemble/laestrygonian-giants.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B10-S02",
  title:"The Laestrygonian Harbor",
  book:1,
  beats:[
    "The fleet enters a narrow harbor ringed by cliffs; Odysseus alone moors outside.",
    "Three scouts meet a giant girl who directs them to her parents' house.",
    "The queen summons Antiphates, who seizes and eats one scout.",
    "Laestrygonians mass on the cliffs, spear crews like fish, and crush the trapped ships with boulders.",
    "Odysseus cuts his cable and escapes with only his own ship.",
  ],
  exitState:"Odysseus cuts his cable and escapes with only his own ship.",
  duration:36,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // TELEPYLUS HARBOR — full bleed backdrop, the empty trap-set. Uses the
    // "empty-basin" layer subset (no intact moorings) so the wrecks laid over the
    // basin read clean; keeps cliffs, attack ledges, city path, entrance neck and
    // the outer anchorage where Odysseus' own ship lies off.
    { asset:"location.telepylus-harbor", instance:"harbor_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // ANTIPHATES AND QUEEN — the king's hall inset high on the city cliff: the
    // queen flings up the summons, the king lunges to seize the scout. Drawn as a
    // crisp panel up where the switchback path climbs to the town.
    { asset:"character.antiphates-and-queen", instance:"royals_01",
      anchor:{x:.80,y:.35}, scale:.34, pose:"looming" },

    // DESTROYED FLEET — the eleven black galleys crushed in the enclosed basin,
    // splitting and going under, decks empty (the crew-loss).
    { asset:"vehicle.destroyed-fleet", instance:"fleet_01",
      anchor:{x:.50,y:.80}, scale:.62, mode:"impact" },

    // LAESTRYGONIAN GIANTS — the cannibal population massed on the cliff rim over
    // the basin, hurling boulders and spearing the swimmers. Their own harbour and
    // boats layers are dropped (the real harbor + fleet play those parts).
    { asset:"ensemble.laestrygonian-giants", instance:"giants_01",
      anchor:{x:.50,y:.72}, scale:.88 },

    // ODYSSEUS — foreground at the outer anchorage, moored outside the throat.
    // First watching the slaughter up in the basin, then turning to cut his cable
    // and run seaward with his single ship.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.28,y:.99}, scale:.30, pose:"neutral", band:"front",
      gaze:{x:.24,y:-.16} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: fleet enters the narrow harbor; Odysseus alone moors outside,
    // watching the basin fill with the other ships
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:.24,y:-.16} } },
    // beat 2 -> 3: the scouts are directed to the house; the queen summons
    // Antiphates and he seizes a scout — the hall goes from loom to seize to roar
    { op:"actor.pose", target:"royals_01",   at:5.0,  args:{ pose:"initiating" } },
    { op:"actor.pose", target:"royals_01",   at:14.0, args:{ pose:"roaring" } },
    // beat 4: the population masses on the cliffs; boulders rain, the fleet is
    // crushed and begins to splinter and sink in the trapped basin
    { op:"fx.play",    target:"giants_01",   at:16.0, args:{} },
    { op:"fx.play",    target:"fleet_01",    at:18.0, args:{} },
    // beat 5 (exit): Odysseus cuts his cable and escapes seaward, alone
    { op:"actor.pose", target:"odysseus_01", at:29.0, args:{ pose:"striding" } },
    { op:"actor.gaze", target:"odysseus_01", at:29.0, args:{ gaze:{x:-.34,y:.06} } },
    { op:"timeline.capture", target:"OD-B10-S02", at:35.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the harbor trap-set, the royal hall inset on the cliff, the
     crushed fleet in the basin, the giants massed on the rim, and Odysseus
     escaping at the outer anchorage in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "harbor_01"){
        mod = harbor;
        // the empty trap-set: drop the intact moorings so the wrecks below read
        state = { status:"HEMMED-IN",
                  layers:["sky","cliffs","basin","faces","ledges","citypath",
                          "entrance","anchorage"] };

      } else if (c.instance === "royals_01"){
        mod = antiphates;
        // the timeline drives the hall from loom -> initiating(summons/seize) ->
        // roaring(alarm); pose folds onto the asset's `variant`
        state = { variant: s.pose || c.pose };

      } else if (c.instance === "fleet_01"){
        mod = fleet;
        // the crushing progresses on the master clock: crushed at impact, then
        // splintering, then hulls settling as empty wrecks
        const mode = t < 20 ? "impact" : (t < 30 ? "splinter" : "crewloss");
        state = { mode, t };

      } else if (c.instance === "giants_01"){
        mod = giants;
        // just the giants (harbour + boats dropped — the harbor & fleet assets
        // stand in): the population converges over the throat and the assault
        // builds once they mass on the rim (fx.play at 16.0)
        const gt = (s.fxT != null) ? s.fxT : Math.max(0, t - 16.0);
        const ferocity = Math.min(0.95, 0.55 + gt * 0.05);
        state = { showHarbour:false, showBoats:false,
                  formation:"converge", converge:0.88, ferocity, count:6,
                  density:1.0, status:"RAVENOUS" };

      } else {
        // ODYSSEUS: fold pose/gaze/band from the timeline; placeInstance owns the
        // anchor/scale
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
