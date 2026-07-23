/* ============================================================
   SCENE  OD-B03-S01 — Arrival at Poseidon's Sacrifice
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. At sunrise the ship reaches Pylos, where nine great divisions sacrifice
        black bulls to Poseidon.
     2. Telemachus hesitates to approach Nestor; Athena urges him past his shyness.
     3. Pisistratus welcomes the strangers, seats them on fleeces, and offers the
        golden cup.
     4. Athena prays to Poseidon and passes the cup to Telemachus.

   Stage layout (back -> front):
     the Pylian sacrificial beach (nine divisions, altar fires, moored ships,
     Nestor's central place — the whole navigable set, full frame)
       -> the black bulls + altar fire of the rite (mid-ground sacred focus)
       -> Nestor and the Pylian host (the reverent arc turning to greet)
       -> Athena as Mentor (foreground, urging then praying to Poseidon)
       -> Telemachus (foreground, shy then roused, receiving the cup at the exit).
   The location supplies the strand; the bulls+fire carry the rite; the host is
   the nine divisions' crowd; the two named figures play the hesitation, the
   welcome, the prayer and the passing of the golden cup that ends the scene.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import beach      from "../assets/location/pylos-sacrificial-beach.mjs";
import bulls      from "../assets/creature/black-bulls-and-altar-fires.mjs";
import host       from "../assets/ensemble/nestor-and-pylian-host.mjs";
import athena     from "../assets/character/athena-as-mentor.mjs";
import telemachus from "../assets/character/telemachus.mjs";

export const scene = {
  id:"OD-B03-S01",
  title:"Arrival at Poseidon's Sacrifice",
  book:1,
  beats:[
    "At sunrise the ship reaches Pylos, where nine great divisions sacrifice black bulls to Poseidon.",
    "Telemachus hesitates to approach Nestor; Athena urges him past his shyness.",
    "Pisistratus welcomes the strangers, seats them on fleeces, and offers the golden cup.",
    "Athena prays to Poseidon and passes the cup to Telemachus.",
  ],
  exitState:"Athena prays to Poseidon and passes the cup to Telemachus.",
  duration:30,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the broad Pylian strand — nine divisions, altar fires, moored ships, Nestor's place
    { asset:"location.pylos-sacrificial-beach", instance:"beach_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"assembled" },

    // the sacred focus of the rite: black bulls led to the kindled altar fire
    { asset:"creature.black-bulls-and-altar-fires", instance:"bulls_01",
      anchor:{x:.50,y:.66}, scale:.48, pose:"rite" },

    // Nestor and the Pylian host — the reverent crowd of the divisions, arc form
    { asset:"ensemble.nestor-and-pylian-host", instance:"host_01",
      anchor:{x:.52,y:.84}, scale:.58, pose:"at-sacrifice" },

    // Athena as Mentor, foreground left — urging the prince, then praying to Poseidon
    { asset:"character.athena-as-mentor", instance:"athena_01",
      anchor:{x:.36,y:1.00}, scale:.36, pose:"mentor_counsel",
      gaze:{x:.22,y:-.04}, band:"threeq" },

    // Telemachus, foreground right — shy at first, then roused, receiving the cup
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.60,y:1.00}, scale:.35, pose:"head_lowered",
      gaze:{x:-.16,y:.34}, band:"threeq" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 1: the rite is under way as the ship makes the strand at sunrise
    // beat 2: Telemachus hangs back, ashamed of his youth before old Nestor...
    { op:"actor.pose", target:"telemachus_01", at:0.0, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"telemachus_01", at:0.0, args:{ gaze:{x:-.16,y:.34} } },
    // ...and Athena urges him past his shyness toward the host
    { op:"actor.pose", target:"athena_01",     at:4.0, args:{ pose:"mentor_command" } },
    { op:"actor.gaze", target:"athena_01",     at:4.0, args:{ gaze:{x:.24,y:-.02} } },
    { op:"actor.pose", target:"telemachus_01", at:7.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus_01", at:7.0, args:{ gaze:{x:.22,y:-.10} } },
    // beat 3: Pisistratus welcomes them — the host turns and greets (driven in stage)
    // beat 4: Athena prays to Poseidon (raised marshalling arm) and passes the cup
    { op:"actor.pose", target:"athena_01",     at:20.0, args:{ pose:"mentor_marshal" } },
    { op:"actor.gaze", target:"athena_01",     at:20.0, args:{ gaze:{x:.10,y:-.14} } },
    { op:"actor.pose", target:"telemachus_01", at:23.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus_01", at:23.0, args:{ gaze:{x:-.20,y:.02} } },
    // exit continuity: the cup is in the prince's hands
    { op:"timeline.capture", target:"OD-B03-S01", at:29.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: beach set, bulls+fire, host crowd, Athena, Telemachus. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the Pylian host folds off the same clock: rapt at the altar -> a ripple of
    // notice as the strangers land -> the turn that welcomes them (beats 1->3).
    const hostState =
      t < 10 ? { attention:1.0, wave:0.20, formation:"arc" }        // at-sacrifice
    : t < 16 ? { attention:0.5, wave:0.95, formation:"arc" }        // noticing the guests
    :          { attention:0.15, wave:0.30, formation:"arc" };      // greeting / welcome

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "beach_01"){
        mod = beach;
        // the full navigable strand, mid-rite: fires lit, feast rows ready
        state = { layers:["sky","sea","surf","ships","divisions","altars","feast","nestor"] };
      } else if (c.instance === "bulls_01"){
        mod = bulls;
        // the rite building: herd + one bull led to the kindled altar, fire rising
        state = { pose:"rite", t: 0.5 + t*0.03 };
      } else if (c.instance === "host_01"){
        mod = host;
        state = { ...hostState, density:1.0, depth:1.0 };
      } else {
        // named figures: fold pose/gaze/band from the timeline over their rig
        mod = c.instance === "athena_01" ? athena : telemachus;
        state = { t:t*0.5, band:c.band, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
