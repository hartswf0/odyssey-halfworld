/* ============================================================
   SCENE  OD-B09-S04 — Goat Island and the Cyclops Coast
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The fleet reaches a fertile, unworked island opposite the Cyclopes' land.
     2. In darkness the ships enter a sheltered harbor and rest.
     3. At dawn the crews hunt wild goats and feast, watching smoke across the
        channel.
     4. Odysseus takes one ship and selects twelve men to investigate.

   Stage layout (back -> front, one master clock):
     the GOAT ISLAND HARBOR as the empty navigable set, full bleed: the sheltered
     cove water, the wooded hunting slopes, the beach camp on the strand, the
     channel lookout, and the far mainland across the channel mouth.
       -> the CYCLOPS COAST placed small and distant across the channel — the
          neighboring people's land, its cook-smoke rising (the smoke the crews
          watch while they feast).
       -> the WILD GOATS grazing on the hunting slopes / strand — the dawn quarry
          the crews take and feast on.
       -> the SELECTED TWELVE SAILORS in the right foreground with the one leading
          ship at the water's edge — the crew Odysseus picks to go and look.
       -> ODYSSEUS in the near foreground, ahead of the band, hailing the smoking
          coast and then striding out to embark with the chosen twelve.
   The landfall, the sheltered rest, the goat-hunt feast, and the picked ship —
   all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import harbor       from "/assets/location/goat-island-harbor.mjs";
import cyclopsCoast from "/assets/location/cyclops-coast.mjs";
import wildGoats    from "/assets/creature/wild-goats.mjs";
import sailors      from "/assets/ensemble/selected-twelve-sailors.mjs";
import odysseus     from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B09-S04",
  title:"Goat Island and the Cyclops Coast",
  book:1,
  beats:[
    "The fleet reaches a fertile, unworked island opposite the Cyclopes' land.",
    "In darkness the ships enter a sheltered harbor and rest.",
    "At dawn the crews hunt wild goats and feast, watching smoke across the channel.",
    "Odysseus takes one ship and selects twelve men to investigate the neighboring people.",
  ],
  exitState:"Odysseus takes one ship and selects twelve men to investigate the neighboring people.",
  duration:38,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: the sheltered goat-island harbor, full bleed —
    // cove water, hunting slopes, beach camp, channel lookout, far shore
    { asset:"location.goat-island-harbor", instance:"harbor_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the CYCLOPS COAST — small and distant across the channel mouth: the
    // neighboring land the crews watch, its cook-smoke rising
    { asset:"location.cyclops-coast", instance:"coast_01",
      anchor:{x:.50,y:.42}, scale:.32 },

    // the WILD GOATS grazing on the far-left strand — the dawn quarry (kept
    // clear of the ensemble's opaque water band so the herd reads)
    { asset:"creature.wild-goats", instance:"goats_01",
      anchor:{x:.17,y:.88}, scale:.34, pose:"graze" },

    // the SELECTED TWELVE with the one leading ship, right foreground — the
    // crew picked to investigate, filing toward the water
    { asset:"ensemble.selected-twelve-sailors", instance:"sailors_01",
      anchor:{x:.60,y:1.00}, scale:.58, pose:"gather" },

    // ODYSSEUS, near foreground, ahead of the band: hailing the smoking coast,
    // then striding out to embark with the twelve
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.31,y:.99}, scale:.40, pose:"hailing", band:"threeq",
      gaze:{x:.30,y:-.10} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 3: the crews look across the channel — Odysseus hails the smoke while
    // the picked band gathers at the strand and the goats crop the slope
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:.30,y:-.10} } },
    // the hunt: the herd breaks from grazing as the crews close in
    { op:"actor.pose", target:"goats_01",    at:14.0, args:{ pose:"hunted" } },
    // beat 4: the twelve fall into file to embark on the single ship
    { op:"actor.pose", target:"sailors_01",  at:24.0, args:{ pose:"following-file" } },
    // beat 4 (exit): Odysseus strides out ahead of the band to take the ship
    { op:"actor.pose", target:"odysseus_01", at:26.0, args:{ pose:"striding" } },
    { op:"actor.gaze", target:"odysseus_01", at:26.0, args:{ gaze:{x:.36,y:-.04} } },
    { op:"timeline.capture", target:"OD-B09-S04", at:36.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the harbor set, the distant smoking coast, the goat herd on
     the slopes, the picked twelve with the ship, and Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "harbor_01"){
        mod = harbor;
        // the full sheltered set at dawn — cove, slopes, camp, lookout, far shore
        state = { t,
          layers:["sky","cyclops-shore","channel","slopes","headland","spring","strand","harbor"] };

      } else if (c.instance === "coast_01"){
        mod = cyclopsCoast;
        // distant landmass across the channel — the smoke the crews watch. Drop
        // the near shore/strait bands so it reads as a far silhouette + smoke
        state = { t, layers:["fields","smoke","cliff","cave","dwelling","paths"] };

      } else if (c.instance === "goats_01"){
        mod = wildGoats;
        state = { t, pose: s.pose || c.pose };

      } else if (c.instance === "sailors_01"){
        mod = sailors;
        // the ensemble carries its own leading ship + water; formation folds from
        // the timeline (gather at the feast -> following-file to embark)
        state = { t, formation: s.pose || c.pose,
                  attention:0.7, spread:1.0, density:1.0, trudge:0.0 };

      } else { // odysseus_01
        mod = odysseus;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
