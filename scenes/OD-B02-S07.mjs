/* ============================================================
   SCENE  OD-B02-S07 — The Night Launch
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Athena, disguised as Mentor, recruits crewmen and borrows the ship.
     2. She casts drowsiness over the suitors and calls the prince outside.
     3. The crew carries provisions from the palace and stows them below deck.
     4. Telemachus boards; Athena takes the pilot's seat and sends a west wind.
     5. The sail fills, libations are poured, and the ship travels through the night.

   Stage layout (back -> front):
     Athena's west wind (night sky + moon + gust field + driven sea, full frame)
       -> the black Ithacan ship under full sail (hero mid-ground)
       -> Athena as Mentor at the pilot's steering-oar (stern)
       -> Telemachus on the open deck, roused seaward
       -> the volunteer crew working the near thwarts (foreground band).
   The wind FX supplies the whole night backdrop; the ship carries the sail the
   wind fills; the crew band pours the libations of the exit state.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import westWind   from "../assets/divine_fx/athenas-west-wind.mjs";
import ship       from "../assets/vehicle/black-ithacan-ship.mjs";
import athena     from "../assets/character/athena-as-mentor.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import crew       from "../assets/ensemble/volunteer-crew.mjs";

export const scene = {
  id:"OD-B02-S07",
  title:"The Night Launch",
  book:2,
  beats:[
    "Athena, disguised as Mentor, recruits crewmen and borrows Noemon's ship.",
    "She casts drowsiness over the suitors and calls the prince outside.",
    "The crew carries provisions from the palace and stows them below deck.",
    "Telemachus boards; Athena takes the pilot's seat and sends a strong west wind.",
    "The sail fills, libations are poured, and the ship travels through the night.",
  ],
  exitState:"The sail fills, libations are poured, and the ship travels through the night.",
  duration:34,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the goddess-sent following wind = the whole night seascape it drives
    { asset:"divine_fx.athenas-west-wind", instance:"wind_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"driving" },

    // the black twenty-oared ship, hero mid-ground, sail set full to the wind
    { asset:"vehicle.black-ithacan-ship", instance:"ship_01",
      anchor:{x:.50,y:.905}, scale:.96, pose:"sailing" },

    // Athena as Mentor at the raised stern seat, marshalling the launch / piloting
    { asset:"character.athena-as-mentor", instance:"athena_01",
      anchor:{x:.208,y:.505}, scale:.30, pose:"mentor_marshal",
      gaze:{x:.20,y:-.10}, band:"threeq" },

    // the prince aboard on the open deck, roused, watching the sea ahead
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.435,y:.520}, scale:.30, pose:"alert",
      gaze:{x:.30,y:-.10}, band:"threeq" },

    // the volunteer company at the near thwarts — the labour + the libation
    { asset:"ensemble.volunteer-crew", instance:"crew_01",
      anchor:{x:.50,y:1.00}, scale:.42, pose:"launch" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 4-5: the goddess sends the wind; it rises to a full driving gale
    { op:"fx.play",    target:"wind_01",        at:1.0,  args:{} },
    // beat 4: the prince, boarding, snaps his gaze seaward with new resolve
    { op:"actor.gaze", target:"telemachus_01",  at:5.0,  args:{ gaze:{x:.34,y:-.12} } },
    // beat 5: Athena leans into the pilot's oar, calling the wind to its height
    { op:"actor.pose", target:"athena_01",      at:6.0,  args:{ pose:"mentor_marshal" } },
    // beat 5 exit: ship travels through the night
    { op:"timeline.capture", target:"OD-B02-S07", at:33.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: wind backdrop, ship, pilot, prince, foreground crew. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the west wind rises over the launch: still (t<1) -> rising -> full driving
    const windRise  = clamp01((t - 1) / 6);          // 0 at the call, 1 once aloft
    const intensity = lerp(0.55, 1.40, windRise);
    const belly     = lerp(0.50, 1.10, windRise);
    const windT     = 0.4 + t * 0.30;                // streamlines march east

    // the ship's voyage state folds off the same clock:
    // boarding -> launch -> under full sail through the night
    const shipMode = t < 2 ? "boarding" : t < 4 ? "launch" : "sailing";

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "wind_01"){
        mod = westWind;
        // atmosphere only — the wind supplies night sky, moon, gust field and
        // the driven sea; the ship it fills is the separate black-ship asset,
        // so drop the FX's own stand-in hull/sail.
        state = { t:windT, intensity, belly,
                  layers:["sky","gusts","source","sea"] };
      } else if (c.instance === "ship_01"){
        mod = ship;
        state = { mode:shipMode, t:t*0.6 };          // oars up, sail full when sailing
      } else if (c.instance === "crew_01"){
        mod = crew;
        // the near company: full launch formation (haulers, carriers, rowers,
        // and the libation being poured), a heave pulse sweeping the labour
        state = { formation:"launch", attention:0.6, spread:1.0, density:1.0,
                  heave: clamp01((Math.sin(t*0.8)+1)/2) };
      } else {
        // named figures aboard: fold pose/gaze/band from the timeline
        mod = c.instance === "athena_01" ? athena : telemachus;
        state = { t:t*0.5, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
