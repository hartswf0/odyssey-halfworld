/* ============================================================
   SCENE  OD-B13-S02 — Odysseus Wakes on an Unknown Shore
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order, one clock):
     1. Odysseus wakes after the ship has gone and fails to recognize Ithaca
        because Athena has covered it in mist.
     2. He counts the Phaeacian gifts and fears he has been cheated or
        abandoned in some other country.
     3. He walks the unfamiliar shore grieving and searching for signs.
     4. Athena approaches disguised as a young shepherd.

   Stage layout (back -> front):
     the Ithacan concealment mist — the whole coastline (Neriton, the harbour
       of Phorkys, the olive, the nymph-cave) draped in a FOREIGN grey veil,
       the recognition glyph BARRED; it fills the frame as the landscape and
       holds the "unknown shore" the entire scene (Athena keeps it hidden here)
       -> the Phaeacian Gift inventory heaped low-left on the beach (UNLOADED
          off the vanished ship, then SPREAD and COUNTED over as he tallies)
       -> Odysseus foreground-centre (waking bewildered -> grieving over the
          count -> striding the strange shore -> turning to hail the stranger)
       -> Athena-as-shepherd entering from the right at the close, a slight
          young herdsman on the crook, approaching — the scene's exit.
   One clock holds the concealed home, the counted gifts, the mortal's grief,
   and the goddess's disguised approach on the same foreign beach.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import concealmentMist from "../assets/divine_fx/ithacan-concealment-mist.mjs";
import giftInventory    from "../assets/prop/gift-inventory.mjs";
import odysseus         from "../assets/character/odysseus.mjs";
import athenaShepherd   from "../assets/character/athena-as-shepherd.mjs";

const ATHENA_IN = 30;   // the shepherd only appears at beat 4

export const scene = {
  id:"OD-B13-S02",
  title:"Odysseus Wakes on an Unknown Shore",
  book:1,
  beats:[
    "Odysseus wakes after the ship has gone and fails to recognize Ithaca because Athena covers it in mist.",
    "He counts the Phaeacian gifts and fears he has been cheated or abandoned elsewhere.",
    "He walks the unfamiliar shore grieving and searching for signs.",
    "Athena approaches disguised as a young shepherd.",
  ],
  exitState:"Athena approaches disguised as a young shepherd.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the concealment mist IS the landscape here — the full stage, back-most.
    // The known Ithacan coast draped in a foreign grey veil, landmarks surviving
    // only as dashed ghosts, the recognition glyph barred. Veil/clock driven in
    // stage() (deterministic in t).
    { asset:"divine_fx.ithacan-concealment-mist", instance:"mist_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the Phaeacian parting-gifts heaped low on the beach, left of centre —
    // unloaded off the vanished ship, then spread and told over. Layout/count
    // driven in stage().
    { asset:"prop.gift-inventory", instance:"gifts_01",
      anchor:{x:.285,y:.995}, scale:.42 },

    // Odysseus foreground-centre — wakes bewildered, grieves over the count,
    // walks the strange shore, then turns to the approaching stranger.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.560,y:.965}, scale:.50, pose:"three_quarter_left",
      gaze:{x:.05,y:-.12}, band:"threeq" },

    // Athena as a young shepherd, entering from the right at the close. Placed
    // in the cast for continuity; only drawn once t >= ATHENA_IN (beat 4).
    { asset:"character.athena-as-shepherd", instance:"athena_01",
      anchor:{x:.845,y:.965}, scale:.44, pose:"shepherd_poise",
      gaze:{x:-.30,y:.02}, band:"threeq" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: he wakes and fails to know his own coast — gaze cast up over the
    // foreign, fog-flattened landscape, bewildered.
    // (initial pose set in cast)

    // beat 2: he counts the gifts and fears he has been cheated — grief bends
    // to the tally heaped at his feet-left.
    { op:"actor.pose", target:"odysseus_01", at:9.0,  args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus_01", at:9.0,  args:{ gaze:{x:-.30,y:.28} } },

    // beat 3: he walks the unfamiliar shore grieving, searching for a sign.
    { op:"actor.pose", target:"odysseus_01", at:20.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:20.0, args:{ gaze:{x:.14,y:-.02} } },

    // beat 4 (exit): the young shepherd appears on the right; Odysseus turns and
    // lifts a hand to hail the stranger.
    { op:"actor.pose", target:"odysseus_01", at:32.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus_01", at:32.0, args:{ gaze:{x:.36,y:-.06} } },
    { op:"actor.pose", target:"athena_01",   at:36.0, args:{ pose:"shepherd_amused" } },
    { op:"actor.gaze", target:"athena_01",   at:36.0, args:{ gaze:{x:-.36,y:.02} } },

    { op:"timeline.capture", target:"OD-B13-S02", at:43.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the mist landscape, the gifts, Odysseus, the shepherd. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the mist: gathers over the first seconds then holds full FOREIGN veil for
    // the whole scene (Athena keeps home hidden until a later scene). Slow drift.
    const veil = clamp01(lerp(0.70, 1.00, clamp01(t/6)));
    const mistState = { t: t*0.4, veil,
                        layers:["sky","coast","sea","veil","ghosts","source","glyph"] };

    // the gifts: heaped (UNLOADED) as he first wakes, then laid out and COUNTED
    // over as he tallies them and fears he was cheated. Deterministic in t.
    let giftState;
    if (t < 8){
      giftState = { layout:"pile", t };
    } else {
      const cf = clamp01((t-9)/11);         // the count sweeps across during beat 2
      giftState = { layout:"row", count: Math.max(cf, 0.001), t };
    }

    for (const c of scene.cast){
      const s = st[c.instance] || {};

      if (c.instance === "mist_01"){
        placeInstance(offctx, W, H, concealmentMist,
          { anchor:c.anchor, scale:c.scale, state: mistState });
      } else if (c.instance === "gifts_01"){
        placeInstance(offctx, W, H, giftInventory,
          { anchor:c.anchor, scale:c.scale, state: giftState });
      } else if (c.instance === "odysseus_01"){
        placeInstance(offctx, W, H, odysseus,
          { anchor:c.anchor, scale:c.scale,
            state:{ t:0.5, band:c.band, gaze:c.gaze, pose:c.pose, ...s } });
      } else if (c.instance === "athena_01"){
        if (t < ATHENA_IN) continue;        // she only enters at beat 4
        placeInstance(offctx, W, H, athenaShepherd,
          { anchor:c.anchor, scale:c.scale,
            state:{ t:0.5, band:c.band, gaze:c.gaze, pose:c.pose, ...s } });
      }
    }
  },
};
export default scene;
