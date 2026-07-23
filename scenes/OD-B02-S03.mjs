/* ============================================================
   OD-B02-S03 — The Eagles Tear the Air
   A thin Halfworld composition module. It COMPOSES existing assets on one
   clock — it never redraws them. In the Ithacan assembly Telemachus renews his
   demand that the suitors quit the house; Zeus answers with a paired sign — two
   eagles that wheel in, lock wings and tear at one another over the crowd. The
   old seer Halitherses reads the omen as Odysseus's return and the suitors'
   ruin; Eurymachus mocks the prophecy and turns a threat on the old man.

   Stage geography (back -> front):
     · the Ithacan assembly ground fills the field as the civic bowl.
     · the two omen eagles wheel high over the centre (their own sky layer
       dropped so they composite onto the set): soaring -> wing-lock -> bank ->
       talon-strike -> departure across the scene clock.
     · the assembly reaction wave stirs mid-ground — heads pulled up at the sign,
       ducking as the birds clash, murmuring, then dividing into two factions
       (its self-contained omen/rays dropped; the real eagles are the sign).
     · three principals stand in the foreground: Telemachus (left) pressing his
       demand and thrown into astonishment by the sign; Halitherses (centre)
       reading the birds then prophesying; Eurymachus (right) sliding from smug
       scorn into ridicule and finally a threat leveled at the seer.

   Exit: Eurymachus mocks the prophecy and threatens the old seer.
   Verify: node harness/render-scene.mjs scenes/OD-B02-S03.mjs --t 8
   ============================================================ */
import ground      from "../assets/location/ithacan-assembly-ground.mjs";
import eagles      from "../assets/creature/two-omen-eagles.mjs";
import crowd       from "../assets/ensemble/assembly-reaction-wave.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import halitherses from "../assets/character/halitherses.mjs";
import eurymachus  from "../assets/character/eurymachus.mjs";
import { placeInstance, clamp01, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

export const scene = {
  id:"OD-B02-S03",
  title:"The Eagles Tear the Air",
  book:1,
  beats:[
    "Telemachus refuses to expel Penelope and renews his demand that the suitors leave.",
    "Zeus sends two eagles that wheel above the assembly and slash at one another.",
    "Halitherses interprets the omen as Odysseus's imminent return and the suitors' destruction.",
    "Eurymachus mocks the prophecy and threatens the old seer.",
  ],
  exitState:"Eurymachus mocks the prophecy and threatens the old seer.",
  duration:44,

  cast:[
    // distant/backdrop first, foreground actors last
    { asset:"location.ithacan-assembly-ground", instance:"ground01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"convened" },
    { asset:"creature.two-omen-eagles", instance:"eagles01",
      anchor:{x:.50,y:.60}, scale:.62, pose:"soaring" },
    { asset:"ensemble.assembly-reaction-wave", instance:"crowd01",
      anchor:{x:.50,y:.92}, scale:.94, pose:"staring" },
    { asset:"character.telemachus", instance:"telemachus01",
      anchor:{x:.185,y:.955}, scale:.50, pose:"command", band:"threeq", gaze:{x:.30,y:-.10} },
    { asset:"character.halitherses", instance:"halitherses01",
      anchor:{x:.50,y:.965}, scale:.55, pose:"hal_watching", gaze:{x:.20,y:-.60} },
    { asset:"character.eurymachus", instance:"eurymachus01",
      anchor:{x:.82,y:.955}, scale:.53, pose:"neutral", band:"threeq", gaze:{x:-.24,y:-.04} },
  ],

  timeline:[
    // beat 1 — Telemachus presses his demand; the seer only watches the sky yet
    { op:"actor.pose", target:"telemachus01",  at:0.0,  args:{ pose:"command" } },
    { op:"actor.gaze", target:"telemachus01",  at:0.0,  args:{ gaze:{x:.34,y:-.06} } },
    { op:"actor.pose", target:"halitherses01", at:5.0,  args:{ pose:"hal_reading" } },
    { op:"actor.gaze", target:"halitherses01", at:5.0,  args:{ gaze:{x:.26,y:-.72} } },
    { op:"actor.pose", target:"eurymachus01",  at:5.0,  args:{ pose:"scornful" } },
    // beat 2 — the eagles wheel, lock wings, bank, and tear at one another
    { op:"actor.pose", target:"eagles01",      at:6.0,  args:{ pose:"wing-lock" } },
    { op:"actor.pose", target:"eagles01",      at:12.0, args:{ pose:"bank" } },
    { op:"actor.pose", target:"telemachus01",  at:12.0, args:{ pose:"astonished" } },
    { op:"actor.gaze", target:"telemachus01",  at:12.0, args:{ gaze:{x:.10,y:-.55} } },
    { op:"actor.pose", target:"eagles01",      at:18.0, args:{ pose:"talon-strike" } },
    // beat 3 — Halitherses reads the sign: the father's return, the suitors' ruin
    { op:"actor.pose", target:"halitherses01", at:22.0, args:{ pose:"hal_prophesy" } },
    { op:"actor.gaze", target:"halitherses01", at:22.0, args:{ gaze:{x:-.30,y:.04} } },
    { op:"actor.pose", target:"telemachus01",  at:24.0, args:{ pose:"command" } },
    { op:"actor.gaze", target:"telemachus01",  at:24.0, args:{ gaze:{x:.30,y:-.02} } },
    { op:"actor.pose", target:"eagles01",      at:30.0, args:{ pose:"departure" } },
    // beat 4 — Eurymachus jeers the prophecy, then levels a threat at the seer
    { op:"actor.pose", target:"eurymachus01",  at:31.0, args:{ pose:"ridiculing" } },
    { op:"actor.gaze", target:"eurymachus01",  at:31.0, args:{ gaze:{x:-.30,y:-.02} } },
    { op:"actor.pose", target:"eurymachus01",  at:38.0, args:{ pose:"threatening" } },
    { op:"actor.gaze", target:"eurymachus01",  at:38.0, args:{ gaze:{x:-.36,y:-.02} } },
    { op:"actor.pose", target:"halitherses01", at:38.0, args:{ pose:"hal_warn" } },
    { op:"actor.gaze", target:"halitherses01", at:38.0, args:{ gaze:{x:.16,y:-.06} } },
    { op:"timeline.capture", target:"OD-B02-S03", at:43.0, args:{ label:"EXIT" } },
  ],

  /* Draw every cast instance in SOLID tones into the offscreen buffer at time t.
     The engine runs ONE dotify + card pass over the whole stage, so the scene
     shares a single halftone. Deterministic — clock only, no random. */
  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const dur = scene.duration || 44;

    // ---- back: the Ithacan assembly ground (the civic bowl) ----
    placeInstance(offctx, W, H, ground, {
      anchor:{x:.50,y:1.00}, scale:1.00,
      state:{ ...st.ground01, layers:["sky","hills","palace","route","floor","tiers","town","elders","stone"] },
    });

    // ---- the OMEN eagles high over the centre; drop their own sky/trails so
    //      the pair composites onto the set. pose is folded from the timeline. ----
    placeInstance(offctx, W, H, eagles, {
      anchor:{x:.50,y:.60}, scale:.62,
      state:{ pose: st.eagles01.pose, t, layers:["eagleB","eagleA"] },
    });

    // ---- the assembly reaction wave stirs mid-ground. Its phase/wave/attention
    //      ride the scene clock: heads up -> flinch as the birds clash -> murmur
    //      -> divide into factions. Its self-contained omen/rays are dropped —
    //      the real eagles above are the sign. ----
    let phase, wave, attention;
    if (t < 11){            // beat 1..early 2 — heads pulled up to the wheeling pair
      phase="stare";  wave=clamp01(0.30 + (t/11)*0.45); attention=0.95;
    } else if (t < 20){     // the eagles lock and tear — a flinch sweeps the ranks
      phase="duck";   wave=clamp01((t-11)/9);           attention=0.85;
    } else if (t < 31){     // the omen read — neighbour murmurs to neighbour
      phase="murmur"; wave=clamp01(0.5 + (t-20)/11*0.5);attention=0.45;
    } else {                // mockery vs prophecy — the crowd divides
      phase="divide"; wave=clamp01((t-31)/10);          attention=0.30;
    }
    placeInstance(offctx, W, H, crowd, {
      anchor:{x:.50,y:.92}, scale:.94,
      state:{ phase, wave, waveLag:0.7, attention, formation:"rows",
              showOmen:false, showRays:false },
    });

    // ---- foreground principals (feet on the front of the bowl) ----
    // Telemachus, left — pressing his demand, then astonished at the sign.
    placeInstance(offctx, W, H, telemachus, {
      anchor:{x:.185,y:.955}, scale:.50,
      state:{ pose: st.telemachus01.pose, band:"threeq", gaze: st.telemachus01.gaze, t },
    });
    // Halitherses, centre — reading the birds, then prophesying, then warning.
    placeInstance(offctx, W, H, halitherses, {
      anchor:{x:.50,y:.965}, scale:.55,
      state:{ pose: st.halitherses01.pose, gaze: st.halitherses01.gaze, t },
    });
    // Eurymachus, right — smug scorn sliding into ridicule and a leveled threat.
    placeInstance(offctx, W, H, eurymachus, {
      anchor:{x:.82,y:.955}, scale:.53,
      state:{ pose: st.eurymachus01.pose, band:"threeq", gaze: st.eurymachus01.gaze, t },
    });
  },
};
export default scene;
