/* ============================================================
   SCENE  OD-B05-S05 — Poseidon Breaks the Sea
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. For seventeen days Odysseus steers by the stars until Scheria rises ahead.
     2. Poseidon sees him, gathers clouds, and strikes the sea with a four-wind storm.
     3. The raft rolls; Odysseus is swept away and barely regains it.
     4. Ino gives him an immortal veil and orders him to abandon the raft and swim.
     5. Athena restrains the winds except the north wind that drives him shoreward.

   Stage layout (back -> front, one sea, one clock):
     the FOUR-WIND STORM fills the whole field — converging clouds, the four
     inward winds, driven rain, a bolt, towering crests, Poseidon's trident at
     the convergence eye
       -> POSEIDON himself upper-left, the Earth-Shaker smiting the deep
       -> the STORM-TORN RAFT riding the trough mid-stage, working to pieces
       -> INO-LEUCOTHEA risen from the swell at the left rail, the immortal veil
          held out
       -> ODYSSEUS on the foundering raft foreground-right, swept and clinging.
   The tempest laid over the whole stage; its maker above, his victim below, and
   the sea-goddess's mercy between them.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import storm    from "../assets/environment/four-wind-storm.mjs";
import poseidon from "../assets/character/poseidon.mjs";
import raft     from "../assets/vehicle/storm-torn-raft.mjs";
import ino      from "../assets/character/ino-leucothea.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B05-S05",
  title:"Poseidon Breaks the Sea",
  book:1,
  beats:[
    "For seventeen days Odysseus steers by the stars until Scheria rises ahead.",
    "Poseidon sees him, gathers clouds, and strikes the sea with a four-wind storm.",
    "The raft rolls; Odysseus is swept away and barely regains it.",
    "Ino gives him an immortal veil and orders him to abandon the raft and swim.",
    "Athena restrains the winds except the north wind that drives him shoreward.",
  ],
  exitState:"Athena restrains the winds except the north wind that drives him shoreward.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the four-wind tempest fills the whole stage (its own sky/sea/trident-eye)
    { asset:"environment.four-wind-storm", instance:"storm_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"tempest" },

    // beat 2: Poseidon upper-left, the Earth-Shaker who raises the storm
    { asset:"character.poseidon", instance:"poseidon_01",
      anchor:{x:.20,y:.58}, scale:.50, pose:"poseidon_smite",
      gaze:{x:.36,y:.14}, band:"threeq" },

    // beats 1-3: the raft riding the trough, working to pieces
    { asset:"vehicle.storm-torn-raft", instance:"raft_01",
      anchor:{x:.54,y:.86}, scale:.52, pose:"intact" },

    // beat 4: Ino-Leucothea risen from the swell, holding out the immortal veil
    { asset:"character.ino-leucothea", instance:"ino_01",
      anchor:{x:.30,y:.98}, scale:.34, pose:"ino_offer_veil",
      gaze:{x:.16,y:.18}, band:"front" },

    // beats 1-3: Odysseus on the foundering raft, swept and clinging
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.62,y:.92}, scale:.34, pose:"striding",
      gaze:{x:.10,y:0}, band:"front" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: seventeen days steering by the stars, Scheria rising — steady at the helm
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"striding" } },
    // beat 2: Poseidon sees him and gathers the four-wind storm; the raft heels over
    { op:"actor.pose", target:"poseidon_01", at:4.0,  args:{ pose:"poseidon_smite" } },
    { op:"actor.gaze", target:"poseidon_01", at:4.0,  args:{ gaze:{x:.36,y:.14} } },
    { op:"actor.pose", target:"raft_01",     at:6.0,  args:{ pose:"rolling" } },
    // beat 3: the raft rolls; Odysseus is swept away and barely regains it
    { op:"actor.pose", target:"odysseus_01", at:8.0,  args:{ pose:"grieving" } },
    { op:"actor.gaze", target:"odysseus_01", at:8.0,  args:{ gaze:{x:-.2,y:.3} } },
    { op:"actor.pose", target:"raft_01",     at:14.0, args:{ pose:"dismasted" } },
    { op:"actor.pose", target:"poseidon_01", at:14.0, args:{ pose:"poseidon_wrath" } },
    // beat 4: Ino rises and presses the veil on him — abandon the raft, swim
    { op:"actor.pose", target:"ino_01",      at:22.0, args:{ pose:"ino_arrive" } },
    { op:"actor.pose", target:"ino_01",      at:26.0, args:{ pose:"ino_offer_veil" } },
    { op:"actor.pose", target:"odysseus_01", at:27.0, args:{ pose:"hailing" } },
    { op:"actor.pose", target:"raft_01",     at:28.0, args:{ pose:"regripped" } },
    // beat 5 (exit): Athena stills the winds but the north wind, driving him shoreward
    { op:"actor.pose", target:"poseidon_01", at:34.0, args:{ pose:"poseidon_storm" } },
    { op:"actor.pose", target:"ino_01",      at:34.0, args:{ pose:"ino_urge" } },
    { op:"actor.pose", target:"odysseus_01", at:36.0, args:{ pose:"striding" } },
    { op:"actor.gaze", target:"odysseus_01", at:36.0, args:{ gaze:{x:.24,y:-.06} } },
    { op:"timeline.capture", target:"OD-B05-S05", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the whole-field storm, Poseidon above, the raft, Ino at the
     rail, then Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // storm field: gathers over the first beats to full tempest, then the winds
    // are restrained near the exit (Athena) — driven by the master clock, not by
    // a character pose. Deterministic (no Date/random).
    const rise   = clamp01((t-2)/8);                 // gather -> tempest
    const settle = clamp01((t-34)/5);                // Athena restrains the winds
    const inten  = lerp(0.45, 1.40, rise) * lerp(1.0, 0.55, settle);
    const bolt   = lerp(0.25, 1.20, rise) * lerp(1.0, 0.30, settle);
    // near the exit only the north wind remains (Athena's carve-out)
    const stormLayers = settle > 0.5
      ? ["sky","clouds","waves","rain","winds","source"]
      : ["sky","clouds","waves","rain","winds","lightning","source"];

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "storm_01"){
        mod = storm;
        state = { t:t*0.6, intensity:inten, bolt, layers:stormLayers };
      } else if (c.instance === "raft_01"){
        mod = raft;
        // the raft's timeline pose IS its ruin mode (intact->rolling->...->regripped)
        state = { mode:s.pose || "intact", t:t*0.8 };
      } else {
        // the three figures: fold pose/gaze/band from the timeline; let
        // placeInstance own the anchor/scale
        mod = c.instance === "poseidon_01" ? poseidon
            : c.instance === "ino_01"      ? ino
            : odysseus;
        state = { t:0.5, band:c.band, gaze:c.gaze, pose:c.pose, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
