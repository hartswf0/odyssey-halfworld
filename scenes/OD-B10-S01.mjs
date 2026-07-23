/* ============================================================
   SCENE  OD-B10-S01 — Aeolus and the Bag of Winds
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Aeolus hosts Odysseus for a month and listens to the story of Troy.
     2. He gives a sealed oxhide bag of every adverse wind and looses the west
        wind for Ithaca.
     3. After nine days Ithaca appears, but Odysseus falls asleep at the helm.
     4. The crew opens the bag believing it holds treasure, and the winds blast
        them back to Aeolia.
     5. Aeolus refuses further aid, judging Odysseus hated by the gods.

   Stage layout (back -> front, one master clock):
     AEOLIA FLOATING ISLAND, full bleed — the bronze-walled floating home:
     palace, feast hall, sealed wind-storage chamber, harbor, hung over the sea
     boundary edge, the whole becalmed set the beats play across.
       -> CONFINED WINDS massed upper-right over the wind-chamber: sealed and
          tight while the bag holds, then torn open into the chaotic blast that
          drives the ship back once the crew loosens the cord.
       -> AEOLUS at left of court: the gracious host who listens, gives the bag
          two-handed with the west wind loosed, then recoils and refuses,
          judging Odysseus hated by the gods.
       -> the BAG OF WINDS between them: the sealed oxhide gift, still sealed as
          Ithaca nears, then opened and spent as the winds erupt.
       -> ODYSSEUS foreground right: taking the gift, then slumped asleep at the
          helm as Ithaca appears — the lapse the crew's greed turns to ruin.
   Host, gift, sleep, blast and final refusal — all held on one clock.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import aeolia from "../assets/location/aeolia-floating-island.mjs";
import confinedWinds from "../assets/environment/confined-winds.mjs";
import bagOfWinds from "../assets/prop/bag-of-winds.mjs";
import aeolus from "../assets/character/aeolus.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B10-S01",
  title:"Aeolus and the Bag of Winds",
  book:1,
  beats:[
    "Aeolus hosts Odysseus for a month and listens to the story of Troy.",
    "He gives a sealed oxhide bag of every adverse wind and looses the west wind for Ithaca.",
    "After nine days Ithaca appears, but Odysseus falls asleep at the helm.",
    "The crew opens the bag believing it holds treasure, and the winds blast them back to Aeolia.",
    "Aeolus refuses further aid, judging Odysseus hated by the gods.",
  ],
  exitState:"Aeolus refuses further aid, judging Odysseus hated by the gods.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // AEOLIA FLOATING ISLAND — full-bleed bronze-walled set: palace, feast hall,
    // sealed wind chamber, harbor, floating over the sea edge
    { asset:"location.aeolia-floating-island", instance:"aeolia_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // CONFINED WINDS — massed upper-right over the wind-storage chamber: tight
    // and sealed while the bag holds, then torn open into the chaotic blast
    { asset:"environment.confined-winds", instance:"winds_01",
      anchor:{x:.68,y:.56}, scale:.50 },

    // BAG OF WINDS — the sealed oxhide gift between host and guest
    { asset:"prop.bag-of-winds", instance:"bag_01",
      anchor:{x:.44,y:.74}, scale:.24, pose:"sealed" },

    // AEOLUS — the host at left of court: listens, gives the bag, then refuses
    { asset:"character.aeolus", instance:"aeolus_01",
      anchor:{x:.28,y:.82}, scale:.40, pose:"aeolus_welcoming", band:"front",
      gaze:{x:.20,y:.04} },

    // ODYSSEUS — foreground right: takes the gift, then slumps asleep at the helm
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.66,y:.86}, scale:.40, pose:"three_quarter_left", band:"threeq",
      gaze:{x:-.24,y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Aeolus hosts and listens to the story of Troy — the gracious host
    // register, Odysseus turned to him telling the tale
    { op:"actor.pose", target:"aeolus_01",   at:0.0,  args:{ pose:"aeolus_welcoming" } },
    { op:"actor.gaze", target:"aeolus_01",   at:0.0,  args:{ gaze:{x:.20,y:.04} } },
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.26,y:.02} } },

    // beat 2: the two-handed giving of the sealed bag, west wind loosed for Ithaca
    { op:"actor.pose", target:"aeolus_01",   at:8.0,  args:{ pose:"aeolus_giving" } },
    { op:"actor.gaze", target:"aeolus_01",   at:8.0,  args:{ gaze:{x:.16,y:.06} } },
    { op:"actor.pose", target:"bag_01",      at:8.0,  args:{ pose:"sealed" } },
    { op:"actor.pose", target:"odysseus_01", at:8.0,  args:{ pose:"offering_hand" } },

    // beat 3: nine days on, Ithaca appears — Odysseus falls asleep at the helm,
    // the bag pressure-tight and tempting in the hold
    { op:"actor.pose", target:"odysseus_01", at:18.0, args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus_01", at:18.0, args:{ gaze:{x:-.06,y:.30} } },
    { op:"actor.pose", target:"bag_01",      at:18.0, args:{ pose:"bulging" } },

    // beat 4: the crew opens the bag — the confined winds burst and blast the
    // ship back to Aeolia; the bag falls spent
    { op:"fx.play",    target:"winds_01",    at:26.0, args:{} },
    { op:"actor.pose", target:"bag_01",      at:26.0, args:{ pose:"opened" } },

    // beat 5 (exit): Aeolus refuses further aid, judging Odysseus hated by the gods
    { op:"actor.pose", target:"aeolus_01",   at:34.0, args:{ pose:"aeolus_refusing" } },
    { op:"actor.gaze", target:"aeolus_01",   at:34.0, args:{ gaze:{x:.18,y:-.02} } },
    { op:"actor.pose", target:"bag_01",      at:34.0, args:{ pose:"empty" } },
    { op:"timeline.capture", target:"OD-B10-S01", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the floating island set, the massed confined winds, the bag
     between host and guest, Aeolus at left, Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "aeolia_01"){
        mod = aeolia;
        // the full becalmed set for the whole scene
        state = {};

      } else if (c.instance === "winds_01"){
        mod = confinedWinds;
        // sealed and tight while the bag holds; once the crew opens it (fx.play
        // at 26.0) the winds tear loose into the full chaotic blast on the clock
        const ct = (s.fxT != null) ? s.fxT : 0;
        const loosed = s.fxT != null;
        const release = loosed ? Math.min(0.95, 0.4 + ct * 0.12) : 0.06;
        const inten   = loosed ? 1.4 : 1.0;
        state = { t: loosed ? 1.4 + ct * 0.3 : 0.4, intensity:inten, release,
                  status: loosed ? "UNLEASHED" : "SEALED",
                  layers:["sky","contained","vessel","burst","core"] };

      } else if (c.instance === "bag_01"){
        mod = bagOfWinds;
        // the bag's visual state is carried on the timeline as a pose name that
        // maps onto its own state nodes
        const node = bagOfWinds.states.nodes[s.pose || c.pose];
        state = { ...(node ? node.preview : bagOfWinds.preview()) };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "aeolus_01") ? aeolus : odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
