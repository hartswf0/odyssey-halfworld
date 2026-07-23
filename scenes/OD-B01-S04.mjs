/* ============================================================
   SCENE  OD-B01-S04 — Mentes Questions the Prince
   A thin Halfworld COMPOSITION module. It places already-built asset
   instances on one clock; it never redraws an asset's appearance.

   Beats (causal order):
     1. Telemachus seats the stranger in honor and sits close to speak privately.
     2. He complains the suitors consume Odysseus' wealth while the man is presumed dead.
     3. Athena, still as Mentes, gives a plausible identity and declares Odysseus lives.
     4. She studies his resemblance to his father and asks why the palace is overrun.

   Staging: a private two-figure exchange set apart from the hall. The honored
   guest chair (draped) holds the disguised goddess at right; Telemachus sits
   close at left; the used hospitality set (golden ewer / silver basin) rests in
   the near foreground; the feast bed DUCKS in the background so the pair can
   speak. The engine runs ONE dotify + scene card over the whole stage.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

import mentes  from "../assets/character/athena-as-mentes.mjs";
import prince  from "../assets/character/telemachus.mjs";
import chair   from "../assets/prop/guest-chair-and-footstool.mjs";
import vessels from "../assets/prop/golden-pitcher-and-silver-basin.mjs";
import feast   from "../assets/sound_source/feast-noise.mjs";

export const scene = {
  id:"OD-B01-S04",
  title:"Mentes Questions the Prince",
  book:1,
  beats:[
    "Telemachus seats the stranger in honor and sits close enough to speak privately.",
    "He complains that the suitors consume another man's wealth while Odysseus is presumed dead.",
    "Athena, still as Mentes, gives a plausible identity and declares that Odysseus lives.",
    "She studies Telemachus's resemblance to his father and asks why the palace is overrun.",
  ],
  exitState:"She studies Telemachus's resemblance to his father and asks why the palace is overrun.",
  duration:40,

  // which assets, where they stand, and their opening pose/state.
  // anchor.y is the FEET/BASE line (placeInstance anchors at the box bottom).
  cast:[
    // background feast bed — ducked beneath the private exchange
    { asset:"sound_source.feast-noise", instance:"feast_bed", anchor:{x:.50,y:.54}, scale:.50, pose:"playing" },
    // the honored guest chair the stranger has been given (draped = honor)
    { asset:"prop.guest-chair-and-footstool", instance:"honor_chair", anchor:{x:.70,y:.97}, scale:.46, pose:"honored" },
    // Athena in the Mentes shell — the honored guest, angled toward the prince
    { asset:"character.athena-as-mentes", instance:"mentes", anchor:{x:.665,y:.985}, scale:.64,
      pose:"three_quarter_left", gaze:{x:-.18,y:0} },
    // Telemachus, seated close, turned to his guest
    { asset:"character.telemachus", instance:"telemachus", anchor:{x:.355,y:.99}, scale:.58,
      pose:"three_quarter_right", gaze:{x:.22,y:.02} },
    // the used hospitality set in the near foreground (hands already washed)
    { asset:"prop.golden-pitcher-and-silver-basin", instance:"wash_set", anchor:{x:.28,y:1.0}, scale:.34, pose:"wash" },
  ],

  // ordered ops on ONE clock (harness verifies at t=8, so the exit beat lands by then)
  timeline:[
    // BEAT 1 — the prince finishes seating the guest, then leans close
    { op:"actor.pose", target:"telemachus", at:0.8, args:{ pose:"offering_hand" } },
    { op:"actor.pose", target:"telemachus", at:2.0, args:{ pose:"lean_forward" } },
    // BEAT 2 — Telemachus complains of the suitors devouring the house
    { op:"actor.pose", target:"telemachus", at:3.2, args:{ pose:"skepticism" } },
    { op:"actor.gaze", target:"telemachus", at:3.2, args:{ gaze:{x:.10,y:.06} } },
    // BEAT 3 — Mentes offers an identity and declares Odysseus lives
    { op:"actor.pose", target:"mentes", at:4.6, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"mentes", at:4.6, args:{ gaze:{x:-.10,y:0} } },
    // BEAT 4 (exit) — the goddess studies the son's likeness and asks why the hall is overrun
    { op:"actor.pose", target:"mentes", at:6.8, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"mentes", at:6.8, args:{ gaze:{x:-.22,y:.02} } },
    { op:"actor.pose", target:"telemachus", at:6.8, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"telemachus", at:6.8, args:{ gaze:{x:.24,y:.20} } },
    // continuity capture at the scene exit
    { op:"timeline.capture", target:"OD-B01-S04", at:39.0, args:{ label:"EXIT" } },
  ],

  // draw every cast instance in SOLID tones into the offscreen buffer at time t.
  // back -> front; the engine's single dotify + card pass unifies the halftone.
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const MODS = {
      "sound_source.feast-noise": feast,
      "prop.guest-chair-and-footstool": chair,
      "character.athena-as-mentes": mentes,
      "character.telemachus": prince,
      "prop.golden-pitcher-and-silver-basin": vessels,
    };
    // preset state per instance (maps the scene's pose token onto each asset's
    // own state node preview so props get their {stoolFwd,cushion,...} channels)
    const PRESET = {
      feast_bed:  { intensity:0.40, ducked:true, stopped:false },   // ducked bed
      honor_chair:{ stoolFwd:1.0, cushion:1, drape:1 },             // honored
      wash_set:   { tilt:0.35, lift:0.4, fill:0.8, stream:0.2, hand:0 }, // wash
    };
    for (const c of scene.cast){
      const mod = MODS[c.asset]; if(!mod) continue;
      const s = st[c.instance] || {};
      const state = { ...(PRESET[c.instance]||{}), pose:s.pose, gaze:s.gaze, t };
      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
