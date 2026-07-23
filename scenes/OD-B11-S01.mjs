/* ============================================================
   SCENE  OD-B11-S01 — The Blood Pit Opens
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The ship reaches the misty land of the Cimmerians at Ocean's edge.
     2. Odysseus digs a trench, pours libations, sacrifices sheep, and holds
        the spirits back with his sword.
     3. The dead gather in multitudes, crying around the blood.
     4. Odysseus waits for Tiresias before allowing any other shade to drink.

   Stage layout (back -> front, one master clock):
     THE CIMMERIAN SHORE AND UNDERWORLD PIT fills the whole field — the
     sunless fog-sky, the black ocean-stream, Persephone's dark grove, the
     beached ship, the river-meeting and, in the foreground, the dug blood-
     trench with its sacrifice zone and the scored ghost-perimeter ring.
       -> the GATHERING SHADES throng the scored ring around the pit, drawn
          in by the blood, crying and straining at the boundary but held out.
       -> the CREW RITUAL ASSISTANTS work the rite at the left of the pit —
          the diggers and pourers who raised the trench and the libations.
       -> the BLACK EWE AND RAM at the pit's edge, throats bared, their dark
          blood running down into the trench: the offering that calls the dead.
       -> ODYSSEUS in the near foreground, sword drawn and raised across the
          pit, holding the multitude of shades back until Tiresias comes.
   Landfall, the dug pit and poured blood, the crying crowd of the dead, and
   the drawn sword that waits for the prophet — all on one clock in one still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import shore   from "/assets/location/cimmerian-shore-and-underworld-pit.mjs";
import shades  from "/assets/ensemble/gathering-shades.mjs";
import crew    from "/assets/ensemble/crew-ritual-assistants.mjs";
import sheep   from "/assets/creature/black-ewe-and-ram.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B11-S01",
  title:"The Blood Pit Opens",
  book:1,
  beats:[
    "The ship reaches the misty land of the Cimmerians at Ocean's edge.",
    "Odysseus digs a trench, pours libations, sacrifices sheep, and holds the spirits back with his sword.",
    "The dead gather in multitudes, crying around the blood.",
    "Odysseus waits for Tiresias before allowing any other shade to drink.",
  ],
  exitState:"Odysseus waits for Tiresias before allowing any other shade to drink.",
  duration:32,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // CIMMERIAN SHORE AND UNDERWORLD PIT — the whole sunless set: fog-sky, black
    // ocean-stream, Persephone's grove, beached ship, river-meeting, the dug
    // blood-trench, sacrifice zone and the scored ghost-perimeter ring.
    { asset:"location.cimmerian-shore-and-underworld-pit", instance:"shore_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // GATHERING SHADES — the dead throng the scored ring around the pit, drawn by
    // the blood, crying and straining at the boundary but held out by the sword.
    { asset:"ensemble.gathering-shades", instance:"shades_01",
      anchor:{x:.50,y:1.00}, scale:.92 },

    // CREW RITUAL ASSISTANTS — the diggers and pourers who raised the trench and
    // poured the libations, working the rite at the left of the pit.
    { asset:"ensemble.crew-ritual-assistants", instance:"crew_01",
      anchor:{x:.20,y:1.00}, scale:.46 },

    // BLACK EWE AND RAM — at the pit's edge, throats bared, dark blood running
    // down into the trench: the offering that calls up the dead.
    { asset:"creature.black-ewe-and-ram", instance:"sheep_01",
      anchor:{x:.66,y:.92}, scale:.34, pose:"blood-flow" },

    // ODYSSEUS — near foreground, sword drawn and raised across the pit, holding
    // the multitude of shades back until Tiresias comes to drink first.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.48,y:1.00}, scale:.50, pose:"one_arm_raised", band:"threeq",
      gaze:{x:.18,y:-.06} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: landfall at the misty Cimmerian shore — the crew begin the rite
    { op:"actor.pose", target:"crew_01",     at:0.0,  args:{ pose:"digging" } },
    // beat 2: the trench dug, libations poured, the sheep sacrificed, and the
    // sword drawn up over the pit to guard the blood
    { op:"actor.pose", target:"crew_01",     at:6.0,  args:{ pose:"offering" } },
    { op:"actor.pose", target:"sheep_01",    at:6.0,  args:{ pose:"blood-flow" } },
    { op:"actor.pose", target:"odysseus_01", at:8.0,  args:{ pose:"one_arm_raised" } },
    // beat 3: the dead gather in multitudes, crying around the blood — the ring
    // presses in toward the pit
    { op:"actor.pose", target:"shades_01",   at:14.0, args:{ pose:"pressing" } },
    // beat 4 (exit): the sword holds hard — Odysseus waits for Tiresias and lets
    // no other shade drink; the crowd is held back at the rim
    { op:"actor.pose", target:"shades_01",   at:22.0, args:{ pose:"held" } },
    { op:"actor.gaze", target:"odysseus_01", at:22.0, args:{ gaze:{x:.10,y:.04} } },
    { op:"timeline.capture", target:"OD-B11-S01", at:31.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the sunless set, the gathering shades, the working crew, the
     bled ewe and ram, then Odysseus with the drawn sword in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "shore_01"){
        mod = shore;
        // the full rite is staged: pit, poured libations, gathered ghost-ring.
        state = { t, status:"SUNLESS", progress:.2,
                  layers:["sky","sea","grove","shore","rivers","ship",
                          "ghostring","trench","sacrifice","anchors"] };

      } else if (c.instance === "shades_01"){
        mod = shades;
        // the dead crowd the scored ring: gathering -> pressing at the blood ->
        // held hard back once the sword guards the pit for Tiresias.
        const pose = s.pose || "gathering";
        const attention = pose === "pressing" ? 1.0 : pose === "held" ? 0.55 : 0.9;
        const boundary  = pose === "pressing" ? 0.85 : pose === "held" ? 1.0 : 0.9;
        state = { t, pose, attention, boundary, nearest:0.5, formation:"ring",
                  status: pose === "pressing" ? "THIRSTING" : pose === "held" ? "HELD BACK" : "GATHERING",
                  progress:.44 };

      } else if (c.instance === "crew_01"){
        mod = crew;
        // the diggers/pourers: hard at the trench first, then withdrawn to the
        // offering stance as the shades gather and the sword takes the line.
        const pose = s.pose || "digging";
        const offering = pose === "offering";
        state = { t, attention: offering ? 0.85 : 0.90, withdraw:0.0,
                  ghost: offering ? 0.30 : 0.10, phase: offering ? 0.2 : 0.0,
                  density:1.0, status:"OFFERING", progress:.5 };

      } else if (c.instance === "sheep_01"){
        mod = sheep;
        // the black ewe and ram bled into the trench — the offering that draws
        // the dead. Blood running strong by the time the ring presses in.
        const pose = s.pose || "blood-flow";
        state = { t:0.5, pose, blood: t >= 6 ? 0.8 : 0.5 };

      } else { // odysseus_01
        mod = odysseus;
        // sword drawn and raised across the pit, jaw set, holding the multitude
        // of crying shades back; watchful, waiting for Tiresias to come first.
        state = { t:0.5, band:s.band || c.band, pose:s.pose || c.pose,
                  gaze:s.gaze || c.gaze,
                  jaw:.32, browKnit:.34, browUp:.24, eyeNarrow:.2, smile:0 };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
