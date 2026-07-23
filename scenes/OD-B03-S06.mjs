/* ============================================================
   SCENE  OD-B03-S06 — The Chariot Road to Sparta
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Nestor orders the horses harnessed and provisions loaded for Telemachus.
     2. Pisistratus takes the reins beside him and drives out of Pylos.
     3. They spend the night at Phera under Diocles's hospitality.
     4. At dawn they continue through the wheatlands toward Lacedaemon.

   Stage layout (back -> front):
     the Pylos-to-Sparta road (Pylos gate · Phera lodging · wheatlands · the
     mountain pass toward Sparta, full frame)
       -> the matched harness team, yoked and pulling forward (mid-ground)
       -> Nestor's Pylian chariot rolling behind the team
       -> Telemachus riding as passenger on the open car
       -> Pisistratus at the front rail with the reins in both fists (foreground).
   The road supplies the whole overland journey in one navigable set; the team
   pulls the chariot along it; the two young princes ride it out toward Sparta.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import road        from "/assets/location/pylos-to-sparta-road.mjs";
import horses      from "/assets/creature/matched-horse-team.mjs";
import chariot     from "/assets/vehicle/pylian-chariot.mjs";
import telemachus  from "/assets/character/telemachus.mjs";
import pisistratus from "/assets/character/pisistratus.mjs";

export const scene = {
  id:"OD-B03-S06",
  title:"The Chariot Road to Sparta",
  book:1,
  beats:[
    "Nestor orders the horses harnessed and provisions loaded for Telemachus.",
    "Pisistratus takes the reins beside him and drives out of Pylos.",
    "They spend the night at Phera under Diocles's hospitality.",
    "At dawn they continue through the wheatlands toward Lacedaemon.",
  ],
  exitState:"At dawn they continue through the wheatlands toward Lacedaemon.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the two-day overland route: Pylos gate, Phera lodging, wheatlands, the
    // mountain pass toward Sparta — the whole journey in one navigable set
    { asset:"location.pylos-to-sparta-road", instance:"road_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"scroll" },

    // the matched, full-maned pair in harness, yoked ahead of the car, pulling
    // forward (rightward) up the road toward the pass
    { asset:"creature.matched-horse-team", instance:"team_01",
      anchor:{x:.680,y:.845}, scale:.55, pose:"halt" },

    // Nestor's royal chariot rolling behind the team, wheel spinning once away
    { asset:"vehicle.pylian-chariot", instance:"chariot_01",
      anchor:{x:.320,y:.905}, scale:.68, pose:"stop" },

    // the prince aboard as passenger, roused, watching the road ahead
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.230,y:.678}, scale:.285, pose:"neutral",
      gaze:{x:.30,y:-.08}, band:"threeq" },

    // Nestor's son at the front rail, reins in both fists, pitched into the drive
    { asset:"character.pisistratus", instance:"pisistratus_01",
      anchor:{x:.315,y:.682}, scale:.300, pose:"three_quarter_right",
      gaze:{x:.16,y:-.04}, band:"threeq" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 2: Pisistratus takes the reins and pitches into the drive
    { op:"actor.pose", target:"pisistratus_01", at:3.0,  args:{ pose:"driving_reins" } },
    // beat 2: Telemachus, moving off, fixes his gaze up the road toward Sparta
    { op:"actor.pose", target:"telemachus_01",  at:3.5,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus_01",  at:3.5,  args:{ gaze:{x:.34,y:-.10} } },
    // beat 4 exit: at dawn they roll on through the wheatlands toward Lacedaemon
    { op:"timeline.capture", target:"OD-B03-S06", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: road backdrop, harness team, chariot, passenger, driver. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the journey folds off one clock: harnessed at the gate -> pulling out of
    // Pylos -> the steady overland trot toward Sparta
    const rolling  = t >= 3;                       // the reins are taken at t=3
    const teamGait = t < 3 ? "halt" : t < 12 ? "walk" : "trot";
    const carMode  = rolling ? "gallop" : "stop";
    const rollT    = t * 0.55;                     // shared locomotion phase

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "road_01"){
        mod = road;
        // the full route revealed: departure gate, Phera lodging, ripening
        // wheatlands and the mountain pass funnelling toward Lacedaemon
        state = { layers:["sky","mountains","fields","wheat","lodge","road","gate","waypoints"] };
      } else if (c.instance === "team_01"){
        mod = horses;
        state = { pose:teamGait, t:rollT };
      } else if (c.instance === "chariot_01"){
        mod = chariot;
        state = { mode:carMode, t:rollT };
      } else {
        // the two riders: fold pose/gaze/band from the timeline, add a little
        // road-bob so the standing car reads as moving
        mod = c.instance === "telemachus_01" ? telemachus : pisistratus;
        const bob = rolling ? Math.sin(t*4 + (c.instance==="pisistratus_01"?1:0))*0.006 : 0;
        state = { t:rollT, band:c.band, gaze:c.gaze, ...s,
                  anchor:undefined };            // let placeInstance own the anchor
        placeInstance(offctx, W, H, mod, {
          anchor:{ x:c.anchor.x, y:c.anchor.y + bob }, scale:c.scale, state });
        continue;
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
