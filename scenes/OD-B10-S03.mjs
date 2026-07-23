/* ============================================================
   SCENE  OD-B10-S03 — Scouts on Aeaea
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The lone ship reaches Aeaea and the exhausted survivors rest two days.
     2. Odysseus climbs a lookout, sees smoke inland, then kills a great stag.
     3. He divides the crew into two groups and draws lots.
     4. Eurylochus leads twenty-two men toward Circe's house while Odysseus
        remains with the ship.

   Stage layout (back -> front, one master clock):
     AEAEA COAST AND FOREST, full bleed — the empty navigable set: pale sky and
     distant palace smoke over a dense treeline cut by an inland forest path and
     a branching stag trail, the high lookout hill on the left, and the
     foreground ship-beach with the galley hauled out and the rest camp.
       -> the GREAT STAG up the stag trail on the right, struck down — the food
          Odysseus took after climbing the lookout and seeing the smoke.
       -> EURYLOCHUS higher on the forest-path mouth, striding inland, turned
          toward Circe's house — leading the drawn-lot party away from the shore.
       -> the SURVIVING CREW, the weary company on the beach splitting into two
          groups after the lots — one band pulling toward the path behind their
          leader, the other holding by the ship.
       -> ODYSSEUS at the ship on the left, one arm still lifted from the
          lookout, watching the scouts go — he remains with the galley.
   The landfall, the lookout and the stag, the two groups and the lots, and the
   scouting party's departure — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import aeaea from "../assets/location/aeaea-coast-and-forest.mjs";
import greatStag from "../assets/creature/great-stag.mjs";
import eurylochus from "../assets/character/eurylochus.mjs";
import survivingCrew from "../assets/ensemble/surviving-crew.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B10-S03",
  title:"Scouts on Aeaea",
  book:1,
  beats:[
    "The lone ship reaches Aeaea and the exhausted survivors rest for two days.",
    "Odysseus climbs a lookout and sees smoke inland, then kills a great stag for food.",
    "He divides the crew into two groups and draws lots.",
    "Eurylochus leads twenty-two men toward Circe's house while Odysseus remains with the ship.",
  ],
  exitState:"Eurylochus leads twenty-two men toward Circe's house while Odysseus remains with the ship.",
  duration:30,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // AEAEA COAST AND FOREST — full-bleed empty set: sky + palace smoke, the
    // forest with its inland path and stag trail, the lookout hill, the beach
    // with the hauled-out galley and the rest camp
    { asset:"location.aeaea-coast-and-forest", instance:"aeaea_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // GREAT STAG — on the open sand to the right where the stag trail meets the
    // beach, struck down: the beast Odysseus killed for food after sighting the
    // smoke from the lookout
    { asset:"creature.great-stag", instance:"stag_01",
      anchor:{x:.85,y:.74}, scale:.30, pose:"alert" },

    // EURYLOCHUS — high on the forest-path mouth, striding inland toward Circe's
    // house, leading the party chosen by lot away from the shore
    { asset:"character.eurylochus", instance:"eurylochus_01",
      anchor:{x:.47,y:.63}, scale:.24, pose:"guarded_withdrawal", band:"threeq",
      gaze:{x:.22,y:-.22} },

    // SURVIVING CREW — the weary company on the beach, splitting into two groups
    // after the lots: one band drawn toward the path, the other by the ship
    { asset:"ensemble.surviving-crew", instance:"crew_01",
      anchor:{x:.56,y:.99}, scale:.58 },

    // ODYSSEUS — at the ship on the left, one arm still lifted from the lookout,
    // watching the scouts go inland; he remains with the galley
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.20,y:.80}, scale:.30, pose:"one_arm_raised", band:"threeq",
      gaze:{x:.30,y:-.14} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: landfall + two days' rest — the crew assembled and weary on the
    // beach, Odysseus turned toward the island
    { op:"actor.pose", target:"odysseus_01",   at:0.0,  args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus_01",   at:0.0,  args:{ gaze:{x:.24,y:-.10} } },
    // beat 2: Odysseus climbs the lookout, sights the smoke, and kills the stag —
    // arm lifted on the vantage, the great stag struck down on its trail
    { op:"actor.pose", target:"odysseus_01",   at:6.0,  args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus_01",   at:6.0,  args:{ gaze:{x:.34,y:-.20} } },
    { op:"actor.pose", target:"stag_01",       at:9.0,  args:{ pose:"struck" } },
    // beat 3: he divides the crew into two groups and draws lots (the ensemble
    // formation is folded from the clock in stage())
    // beat 4 (exit): Eurylochus leads the drawn party inland toward Circe's house
    // while Odysseus stays with the ship
    { op:"actor.pose", target:"eurylochus_01", at:18.0, args:{ pose:"suspicious_leading" } },
    { op:"actor.gaze", target:"eurylochus_01", at:18.0, args:{ gaze:{x:.26,y:-.24} } },
    { op:"actor.gaze", target:"odysseus_01",   at:22.0, args:{ gaze:{x:.30,y:-.14} } },
    { op:"timeline.capture", target:"OD-B10-S03", at:29.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the Aeaea set, the struck stag up its trail, Eurylochus on
     the path leading inland, the splitting crew on the beach, and Odysseus by
     the ship in the foreground left. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "aeaea_01"){
        mod = aeaea;
        // the full empty set; keep the rest camp early, thin it once the party
        // is scouting so the inland path reads clear
        const scouting = t >= 18.0;
        state = { layers: scouting
          ? ["sky","hills","palace","forest","trail","beach","ship","camp"]
          : ["sky","hills","palace","forest","trail","beach","ship","camp"] };

      } else if (c.instance === "stag_01"){
        mod = greatStag;
        // alert on its trail until Odysseus takes it, then struck down
        state = { pose: s.pose || c.pose, t:0.3 };

      } else if (c.instance === "crew_01"){
        mod = survivingCrew;
        // fold the formation off the master clock: weary+assembled through the
        // rest, drawing lots as the party is chosen, then split into two groups
        let fState;
        if (t < 9.0){
          fState = { formation:"assembled", split:0.14, weary:0.82,
                     attention:0.30, showLots:false, status:"WEARY" };
        } else if (t < 18.0){
          fState = { formation:"lots", split:1.0, weary:0.72,
                     attention:0.85, showLots:true, status:"DRAWING LOTS" };
        } else {
          fState = { formation:"two-groups", split:1.0, weary:0.66,
                     attention:0.55, showLots:false, status:"DIVIDED" };
        }
        state = { spread:1.0, density:1.0, ...fState };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "eurylochus_01") ? eurylochus : odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
