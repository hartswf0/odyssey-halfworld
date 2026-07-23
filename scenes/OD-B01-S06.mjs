/* ============================================================
   SCENE  OD-B01-S06 — The Goddess Departs; the Prince Speaks
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Athena refuses a farewell gift and flies away like a bird — divine
        presence revealed (divine_fx.athenas-birdlike-departure).
     2. Telemachus feels his senses sharpen and returns to the suitors with new
        courage (character.telemachus, roused -> command).
     3. Penelope descends, grieving at Phemius's song of the Achaeans' returns
        (character.penelope on the back-right stair; character.phemius at the lyre).
     4. Telemachus tells her to return to her chamber and announces an assembly
        for dawn — first assertion of authority.
     5. The suitors are startled by his authority; the household closes for the
        night (ensemble.suitors, attention snapped to the prince).

   Stage layout (back -> front):
     location hall  ->  suitors (back band)  ->  Penelope (stair)  ->
     Phemius (left, at the lyre)  ->  Telemachus (center, commanding)  ->
     Athena's birdlike departure (divine ascent, upper-left).
   ============================================================ */
import { placeInstance, clamp01, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import hall            from "../assets/location/odysseuss-palace-threshold-and-hall.mjs";
import suitors         from "../assets/ensemble/suitors.mjs";
import penelope        from "../assets/character/penelope.mjs";
import phemius         from "../assets/character/phemius.mjs";
import telemachus      from "../assets/character/telemachus.mjs";
import athenaDeparture from "../assets/divine_fx/athenas-birdlike-departure.mjs";

export const scene = {
  id:"OD-B01-S06",
  title:"The Goddess Departs; the Prince Speaks",
  book:1,
  beats:[
    "Athena refuses a farewell gift and flies away like a bird, revealing her divine presence.",
    "Telemachus feels his senses sharpen and returns to the suitors with new courage.",
    "Penelope descends, grieving at Phemius's song of the Achaeans' returns.",
    "Telemachus tells her to withdraw to her chamber and announces an assembly for dawn.",
    "The suitors are startled by his authority; the household closes for the night.",
  ],
  exitState:"The suitors are startled by his authority; the household closes for the night.",
  duration:32,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    { asset:"location.odysseuss-palace-threshold-and-hall", instance:"hall_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"occupied" },

    { asset:"ensemble.suitors", instance:"suitors_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"hushed" },

    // the veiled queen on the back-right stair, grieving the return-song
    { asset:"character.penelope", instance:"penelope_01",
      anchor:{x:.815,y:.735}, scale:.56, pose:"grief", gaze:{x:.1,y:.5}, band:"front" },

    // the coerced bard, left of the hall, still at the lyre, eyes cast toward her pain
    { asset:"character.phemius", instance:"phemius_01",
      anchor:{x:.255,y:.955}, scale:.60, pose:"neutral_front", gaze:{x:-.55,y:.35}, band:"front" },

    // the prince, center, roused from grief to first command
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.545,y:.975}, scale:.82, pose:"desperation", gaze:{x:.25,y:-.1}, band:"front" },

    // the goddess quitting the room as a sea-eagle (source at the left threshold)
    { asset:"divine_fx.athenas-birdlike-departure", instance:"athena_departure_01",
      anchor:{x:.315,y:.60}, scale:.50, pose:"ascended" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    { op:"fx.play",    target:"athena_departure_01", at:2.0,  args:{} },
    // beat 2: grief sharpens into alertness, then courage
    { op:"actor.pose", target:"telemachus_01",       at:4.0,  args:{ pose:"lean_forward" } },
    { op:"actor.pose", target:"telemachus_01",       at:7.0,  args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus_01",       at:7.0,  args:{ gaze:{x:.32,y:-.05} } },
    // beat 3-4: Penelope descends grieving; Phemius tracks then is silenced
    { op:"actor.pose", target:"penelope_01",         at:12.0, args:{ pose:"head_lowered" } },
    { op:"actor.pose", target:"phemius_01",          at:20.0, args:{ pose:"lean_backward" } },
    { op:"actor.gaze", target:"phemius_01",          at:20.0, args:{ gaze:{x:-.3,y:-.25} } },
    // beat 5: the household closes for the night
    { op:"timeline.capture", target:"OD-B01-S06",    at:31.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // per-instance expressive extras stateAt() doesn't fold (mouth, etc.)
    const extra = {
      penelope_01:   { mouth:-1 },
      phemius_01:    { mouth:.35, lyre:true },
      telemachus_01: { mouth:0 },
    };

    // the birdlike departure driven off the master clock: begins ~t2, high & gone by ~t8
    const fxProg = clamp01((t - 2) / 6);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "hall_01"){
        mod = hall;
        state = {};                                   // preview() layers (occupied hall)
      } else if (c.instance === "suitors_01"){
        mod = suitors;
        // startled by the prince's authority: heads snapped his way, thinner
        // back band so the foreground actors stay clear
        state = { attention:0.92, wave:1.0, density:0.62,
                  layers:["bgrow","bgtable"], seed:1701 };
      } else if (c.instance === "athena_departure_01"){
        mod = athenaDeparture;
        // no floor/human — the goddess is already aloft; a divine ascent over
        // the hall air with the residual courage pulse she leaves behind
        state = { t: lerp(0.30, 0.96, fxProg), intensity:1.05, wingSpan:1.0,
                  layers:["motes","pulse","eagle"] };
      } else {
        // characters: fold pose/gaze/band from the timeline + expressive extras
        mod = c.instance === "penelope_01" ? penelope
            : c.instance === "phemius_01"  ? phemius
            : telemachus;
        state = { ...(extra[c.instance] || {}), ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
