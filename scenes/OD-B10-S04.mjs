/* ============================================================
   SCENE  OD-B10-S04 — Circe Transforms the Crew
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The scouts find Circe singing at her loom while enchanted wolves and
        lions fawn around them.
     2. All but Eurylochus enter; Circe serves drugged food and strikes them
        with her wand.
     3. The men become pigs in body while retaining human minds.
     4. Circe shuts them in pens and throws them acorns.
     5. Eurylochus runs back to the ship and reports the disappearance.

   Stage layout (back -> front, one master clock — a single composite still that
   holds the whole transformation in one frame):
     CIRCE'S FOREST PALACE, full bleed — the forest wall, the clearing, the
     stone house with its lit LOOM HALL window and DINING ZONE, the paved
     transformation floor before the porch, and the walled pig PENS in the
     animal yard at the left.
       -> ENCHANTED WOLVES AND LIONS, fawning like tame dogs in the clearing
          before the porch, heads lowered toward the arriving humans.
       -> CREW-TO-SWINE VARIANTS, over the walled pens on the left: the crew
          already dropped into pig bodies, keeping their grieving human eyes —
          the titular transformation, penned at the yard.
       -> CIRCE, central on the transformation floor: the singing host turned
          precise alchemist, the WAND driven up on the transforming word.
       -> EURYLOCHUS, the hidden observer at the foreground right edge: frozen
          in dread behind cover, watching the men vanish — coiled to bolt back
          to the ship and report.
   The song at the loom, the drugged food, the wand-strike, the penned swine and
   the lone survivor's flight — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace from "../assets/location/circes-forest-palace.mjs";
import beasts from "../assets/creature/enchanted-wolves-and-lions.mjs";
import swine  from "../assets/creature/crew-to-swine-variants.mjs";
import circe  from "../assets/character/circe.mjs";
import eurylochus from "../assets/character/eurylochus.mjs";

export const scene = {
  id:"OD-B10-S04",
  title:"Circe Transforms the Crew",
  book:1,
  beats:[
    "The scouts find Circe singing at her loom while enchanted wolves and lions fawn around them.",
    "All but Eurylochus enter; Circe serves drugged food and strikes them with her wand.",
    "The men become pigs in body while retaining human minds.",
    "Circe shuts them in pens and throws them acorns.",
    "Eurylochus runs back to the ship and reports the disappearance.",
  ],
  exitState:"Eurylochus runs back to the ship and reports the disappearance.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // CIRCE'S FOREST PALACE — full bleed backdrop: forest wall, clearing, stone
    // house with the lit loom-hall window + dining zone, transformation floor,
    // and the walled pig pens in the animal yard at the left.
    { asset:"location.circes-forest-palace", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // ENCHANTED WOLVES AND LIONS — fawning like tame dogs in the clearing before
    // the porch, heads lowered/forward toward the arriving scouts.
    { asset:"creature.enchanted-wolves-and-lions", instance:"beasts_01",
      anchor:{x:.46,y:.74}, scale:.30, pose:"fawn" },

    // CREW-TO-SWINE VARIANTS — the crew already in pig bodies (grieving human
    // eyes), herded behind the sty rails at the animal yard on the left.
    { asset:"creature.crew-to-swine-variants", instance:"swine_01",
      anchor:{x:.22,y:.86}, scale:.40, pose:"pig-form" },

    // CIRCE — central on the transformation floor: the singing host becoming the
    // precise alchemist, the wand driven up on the transforming word.
    { asset:"character.circe", instance:"circe_01",
      anchor:{x:.60,y:.90}, scale:.50, pose:"striking", band:"front",
      gaze:{x:-.18,y:-.02} },

    // EURYLOCHUS — the hidden observer at the foreground right edge, frozen in
    // dread behind cover, watching the men vanish, coiled to bolt to the ship.
    { asset:"character.eurylochus", instance:"eurylochus_01",
      anchor:{x:.90,y:.96}, scale:.34, pose:"dread", band:"threeq",
      gaze:{x:-.55,y:-.04} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the scouts find Circe singing at the loom, the beasts fawning —
    // she hosts, gracious, the wand held low like a sceptre
    { op:"actor.pose", target:"circe_01",      at:0.0,  args:{ pose:"hosting" } },
    { op:"actor.pose", target:"beasts_01",     at:0.0,  args:{ pose:"fawn" } },
    { op:"actor.pose", target:"eurylochus_01", at:0.0,  args:{ pose:"neutral" } },
    // beat 2: all but Eurylochus enter; she serves the drugged food and strikes
    // with the wand — the transforming gesture; Eurylochus hangs back, watching
    { op:"actor.pose", target:"circe_01",      at:7.0,  args:{ pose:"striking" } },
    { op:"actor.gaze", target:"circe_01",      at:7.0,  args:{ gaze:{x:-.18,y:-.02} } },
    { op:"actor.pose", target:"eurylochus_01", at:7.0,  args:{ pose:"dread" } },
    // beat 3: the men become pigs in body while keeping their human minds
    { op:"actor.pose", target:"swine_01",      at:16.0, args:{ pose:"pig-form" } },
    // beat 4: Circe shuts them in the pens and throws them acorns
    { op:"actor.pose", target:"swine_01",      at:24.0, args:{ pose:"penned" } },
    // beat 5 (exit): Eurylochus breaks and runs back to the ship to report
    { op:"actor.pose", target:"eurylochus_01", at:32.0, args:{ pose:"fleeing" } },
    { op:"actor.gaze", target:"eurylochus_01", at:32.0, args:{ gaze:{x:-.60,y:-.02} } },
    { op:"timeline.capture", target:"OD-B10-S04", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the palace backdrop, the fawning beasts in the clearing, the
     penned swine at the yard, Circe striking on the transformation floor, and
     Eurylochus frozen in dread at the foreground edge. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "palace_01"){
        mod = palace;
        // the full set: forest, clearing, animal yard, pens, house (loom hall +
        // dining), transformation floor
        state = { layers:["forest","yard","pens","house","transform","clearing"] };

      } else if (c.instance === "beasts_01"){
        mod = beasts;
        // fawning like tame drugged dogs, heads lowered toward the arrivals
        state = { pose: s.pose || c.pose || "fawn", t, docile:1.0 };

      } else if (c.instance === "swine_01"){
        mod = swine;
        // the crew in pig bodies with grieving human eyes; penned in the yard
        state = { pose: s.pose || c.pose || "pig-form", t };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "circe_01") ? circe : eurylochus;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
