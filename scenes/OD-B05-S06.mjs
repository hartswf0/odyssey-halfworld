/* ============================================================
   SCENE  OD-B05-S06 — The River Accepts the Castaway
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus swims two nights and days while waves hurl him toward a
        reef-lined coast.
     2. Athena shows him a river mouth free of rocks and wind.
     3. He prays to the river god, who stills the current and receives him.
     4. Odysseus returns Ino's veil to the sea, crawls ashore, and hides
        beneath two intertwined olive bushes.
     5. He buries himself in leaves and Athena seals him in sleep.

   Stage layout (a stations-of-landfall tableau, back -> front, sea-left to
   refuge-right on one coast):
     the Scherian coast + river mouth as the empty navigable set (full bleed)
       -> the RIVER GOD's calmed concentric rings + benevolent face + parted
          landing lane, laid over the sheltered estuary channel (mid-right)
       -> the OLIVE-LEAF SHELTER on the bank at far right, its crawl-in hollow
          heaped LEAF-COVERED — the scene's exit continuity (Odysseus buried,
          sealed in sleep)
       -> INO'S VEIL returned to the sea, billowing adrift on the fg swell (left)
       -> ODYSSEUS kneeling at the river mouth, praying to the god who receives
          him — the pivotal divine beat, foreground.
   The dangerous reef, the safe estuary, the god's mercy, the returned veil, and
   the leaf refuge all held on one clock: the whole landfall read in one still.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import coast    from "../assets/location/scherian-coast-and-river-mouth.mjs";
import riverGod from "../assets/divine_fx/river-god.mjs";
import shelter  from "../assets/set_piece/olive-leaf-shelter.mjs";
import veil     from "../assets/prop/inos-veil.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B05-S06",
  title:"The River Accepts the Castaway",
  book:1,
  beats:[
    "Odysseus swims two nights and days while waves hurl him toward a reef-lined coast.",
    "Athena shows him a river mouth free of rocks and wind.",
    "He prays to the river god, who stills the current and receives him.",
    "Odysseus returns Ino's veil to the sea, crawls ashore, and hides beneath two intertwined olive bushes.",
    "He buries himself in leaves and Athena seals him in sleep.",
  ],
  exitState:"He buries himself in leaves and Athena seals him in sleep.",
  duration:46,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: reef coast -> sheltered river estuary, full bleed
    { asset:"location.scherian-coast-and-river-mouth", instance:"coast_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beat 3: the river god's calmed rings + parted landing lane + benevolent
    // face, laid over the sheltered estuary channel, right before the kneeling
    // castaway (mid-frame water)
    { asset:"divine_fx.river-god", instance:"river_god_01",
      anchor:{x:.66,y:.74}, scale:.42 },

    // beat 5 (exit): the olive-leaf shelter up on the bank at far right, crawl-in
    // hollow heaped LEAF-COVERED — Odysseus buried, sealed in sleep (continuity)
    { asset:"set-piece.olive-leaf-shelter", instance:"olive_shelter_01",
      anchor:{x:.88,y:.86}, scale:.36 },

    // beat 4: Ino's veil returned to the sea, billowing adrift on the fg swell
    // in the open water between the reef and the channel
    { asset:"prop.inos-veil", instance:"inos_veil_01",
      anchor:{x:.42,y:.92}, scale:.36 },

    // beat 3: Odysseus kneeling at the river mouth, praying to the god who
    // receives him — foreground, facing the rings to his right
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.58,y:.74}, scale:.38, pose:"kneel",
      gaze:{x:.34,y:.10}, band:"threeq" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: he swims in, buffeted toward the reef coast (arms flailing)
    { op:"actor.pose", target:"odysseus_01",  at:1.0,  args:{ pose:"desperation" } },
    { op:"actor.gaze", target:"odysseus_01",  at:1.0,  args:{ gaze:{x:.20,y:.24} } },
    // beat 2-3: he finds the calm river mouth and kneels in prayer to its god
    { op:"fx.play",    target:"river_god_01", at:5.0,  args:{} },
    { op:"actor.pose", target:"odysseus_01",  at:6.0,  args:{ pose:"kneel" } },
    { op:"actor.gaze", target:"odysseus_01",  at:6.0,  args:{ gaze:{x:.34,y:.10} } },
    // beat 4: he loosens Ino's veil and casts it back on the outgoing swell
    { op:"fx.play",    target:"inos_veil_01", at:22.0, args:{} },
    // beat 4: he crawls up the bank toward the olive thicket
    { op:"actor.pose", target:"odysseus_01",  at:30.0, args:{ pose:"crouch" } },
    { op:"actor.gaze", target:"odysseus_01",  at:30.0, args:{ gaze:{x:.40,y:.16} } },
    // beat 5 (exit): he burrows into the leaves; Athena seals him in sleep
    { op:"actor.pose", target:"odysseus_01",  at:40.0, args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus_01",  at:40.0, args:{ gaze:{x:.05,y:.5} } },
    { op:"timeline.capture", target:"OD-B05-S06", at:45.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the coast set, the river-god field over the estuary, the
     leaf-covered olive shelter, the returned veil on the swell, then Odysseus
     kneeling in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the god holds calmed (glassy rings, open lane, benevolent face); a gentle
    // clock shimmer keeps the water alive without ever un-calming it
    const godT = t * 0.5;
    // slow canopy/veil idle motion shared off the one clock
    const idleT = t * 0.5;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "coast_01"){
        mod = coast;
        // full landfall set: reef + foam on the left, sheltered estuary + bank +
        // olive-bush refuge on the right
        state = { layers:["sky","sea","woods","bank","estuary","reef","olivebush","foam"] };
      } else if (c.instance === "river_god_01"){
        mod = riverGod;
        // drop the god's own opaque water + bank so it overlays the estuary as a
        // translucent field: calmed rings, parted lane, benevolent face, locus
        state = { t:godT, calm:1.0, opening:1.0,
                  layers:["pool","rings","opening","face","source"] };
      } else if (c.instance === "olive_shelter_01"){
        mod = shelter;
        // the exit state: mouth heaped shut with leaf litter (Odysseus buried)
        state = { t:idleT*0.4, covered:true,
                  layers:["ground","hollow","trunks","canopy-back","canopy","leaf-bed","leaf-cover"] };
      } else if (c.instance === "inos_veil_01"){
        mod = veil;
        // the veil given back — billowing away on the outgoing swell
        state = { mode:"return-to-sea", t:idleT };
      } else {
        // Odysseus: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = odysseus;
        state = { t:0.5, band:c.band, gaze:s.gaze || c.gaze, pose:s.pose || c.pose };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
