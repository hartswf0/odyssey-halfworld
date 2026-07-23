/* ============================================================
   SCENE  OD-B15-S02 — Farewell from Menelaus and Helen
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Telemachus and Pisistratus take leave of Menelaus after the king insists
        on gifts and a final meal.
     2. Helen gives a robe and reads a bird omen as Odysseus's imminent revenge.
     3. The chariot travels back through Phera to Pylos.
     4. Telemachus asks Pisistratus to take him directly to the ship so Nestor
        cannot delay him.

   Stage layout (back -> front):
     MID-RIGHT   — the GIFT-LADEN CHARIOT: the parting guest-gifts lashed aboard,
                   standing at rest for the farewell (LADEN), then rolling URGENT
                   as it carries the two off through Phera toward Pylos.
     LEFT        — MENELAUS: the host-king pressing the last gifts and the final
                   meal on his guests, opening into recognition as Helen reads the
                   omen.
     CENTRE-LEFT — HELEN: giving the robe and reading the bird omen overhead as a
                   sign of Odysseus's imminent revenge.
     CENTRE      — TELEMACHUS: the guest taking his leave, struck by the omen,
                   then commanding the drive straight to the ship.
     CENTRE-RIGHT— PISISTRATUS: the gracious host's son, taking up the reins to
                   drive the loaded car home.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import chariot from "../assets/vehicle/gift-laden-chariot.mjs";
import menelaus from "../assets/character/menelaus.mjs";
import helen from "../assets/character/helen.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import pisistratus from "../assets/character/pisistratus.mjs";

export const scene = {
  id:"OD-B15-S02",
  title:"Farewell from Menelaus and Helen",
  book:1,
  beats:[
    "Telemachus and Pisistratus take leave of Menelaus after the king insists on gifts and a final meal.",
    "Helen gives a robe and reads a bird omen as Odysseus's imminent revenge.",
    "The chariot travels back through Phera to Pylos.",
    "Telemachus asks Pisistratus to take him directly to the ship so Nestor cannot delay him.",
  ],
  exitState:"Telemachus asks Pisistratus to take him directly to the ship.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // GIFT-LADEN CHARIOT — mid-right set piece: the parting guest-gifts lashed
    // aboard. Stands LADEN for the farewell, rolls URGENT through Phera to Pylos.
    { asset:"vehicle.gift-laden-chariot", instance:"chariot_01",
      anchor:{x:.84, y:.98}, scale:.58 },

    // MENELAUS — left: the host-king pressing the last gifts + final meal, then
    // opening into recognition as the omen is read.
    { asset:"character.menelaus", instance:"menelaus_01",
      anchor:{x:.16, y:.99}, scale:.54, pose:"menelaus_hosting", band:"threeq",
      gaze:{x:.26, y:.04} },

    // HELEN — centre-left: giving the robe, then reading the bird omen overhead
    // as the sign of Odysseus's imminent revenge.
    { asset:"character.helen", instance:"helen_01",
      anchor:{x:.36, y:.99}, scale:.52, pose:"helen_poise", band:"threeq",
      gaze:{x:.18, y:.04} },

    // TELEMACHUS — centre: taking his leave, struck by the omen, then commanding
    // the drive straight to the ship.
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.54, y:.99}, scale:.52, pose:"lean_forward", band:"threeq",
      gaze:{x:-.20, y:-.04} },

    // PISISTRATUS — centre-right by the car: the gracious host's son, taking up
    // the reins to drive the loaded chariot home.
    { asset:"character.pisistratus", instance:"pisistratus_01",
      anchor:{x:.60, y:.99}, scale:.50, pose:"arms_open", band:"threeq",
      gaze:{x:-.14, y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the king insists on the parting gifts + a final meal; the guests
    // take their leave. Pisistratus stands gracious, Telemachus attends the host.
    { op:"actor.pose", target:"menelaus_01",    at:0.0,  args:{ pose:"menelaus_hosting" } },
    { op:"actor.gaze", target:"menelaus_01",    at:0.0,  args:{ gaze:{x:.26,y:.04} } },
    { op:"actor.pose", target:"telemachus_01",  at:0.0,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus_01",  at:0.0,  args:{ gaze:{x:-.20,y:-.04} } },
    { op:"actor.pose", target:"pisistratus_01", at:0.0,  args:{ pose:"arms_open" } },
    // beat 2: Helen gives the robe and reads the bird omen overhead — Odysseus's
    // imminent revenge. Telemachus is struck; Menelaus opens into recognition.
    { op:"actor.pose", target:"helen_01",       at:10.0, args:{ pose:"helen_storyteller" } },
    { op:"actor.gaze", target:"helen_01",       at:10.0, args:{ gaze:{x:-.10,y:.04} } },
    { op:"actor.pose", target:"helen_01",       at:15.0, args:{ pose:"helen_omen" } },
    { op:"actor.gaze", target:"helen_01",       at:15.0, args:{ gaze:{x:.28,y:-.40} } },
    { op:"actor.pose", target:"menelaus_01",    at:15.0, args:{ pose:"menelaus_recognition" } },
    { op:"actor.gaze", target:"menelaus_01",    at:15.0, args:{ gaze:{x:.18,y:.42} } },
    { op:"actor.pose", target:"telemachus_01",  at:16.0, args:{ pose:"desperation" } },
    { op:"actor.gaze", target:"telemachus_01",  at:16.0, args:{ gaze:{x:.16,y:-.30} } },
    // beat 3: the chariot travels back through Phera to Pylos. Pisistratus takes
    // the reins; Telemachus rides alert. (Chariot mode driven by t in stage().)
    { op:"actor.pose", target:"pisistratus_01", at:24.0, args:{ pose:"driving_reins" } },
    { op:"actor.gaze", target:"pisistratus_01", at:24.0, args:{ gaze:{x:.30,y:.02} } },
    { op:"actor.pose", target:"telemachus_01",  at:24.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus_01",  at:24.0, args:{ gaze:{x:.28,y:-.10} } },
    // beat 4 (exit): Telemachus asks Pisistratus to take him straight to the ship
    // so Nestor cannot delay him. He turns and commands; Pisistratus drives on.
    { op:"actor.pose", target:"telemachus_01",  at:33.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus_01",  at:33.0, args:{ gaze:{x:.32,y:-.06} } },
    { op:"actor.gaze", target:"pisistratus_01", at:33.0, args:{ gaze:{x:-.20,y:.02} } },
    { op:"timeline.capture", target:"OD-B15-S02", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the gift-laden chariot (set piece), then Menelaus, Helen,
     Telemachus, Pisistratus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "chariot_01"){
        mod = chariot;
        // stands LADEN for the farewell and while it is loaded with gifts; rolls
        // URGENT once it sets off through Phera toward Pylos (beat 3 on).
        const rolling = t >= 24;
        state = { t: t*0.6,
                  mode: rolling ? "urgent" : "laden",
                  status: rolling ? "TO PYLOS" : "LADEN",
                  progress: Math.min(0.98, 0.28 + 0.7*(t/D)) };

      } else if (c.instance === "menelaus_01"){
        mod = menelaus;
        const recognizing = t >= 15;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  status: recognizing ? "RECOGNIZING" : "HOSTING",
                  progress: Math.min(0.96, 0.2 + 0.7*(t/D)) };

      } else if (c.instance === "helen_01"){
        mod = helen;
        const omen = t >= 15;
        const telling = t >= 10 && t < 15;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  status: omen ? "OMEN" : telling ? "GIFTING" : "RADIANT",
                  progress: Math.min(0.96, 0.2 + 0.7*(t/D)) };

      } else if (c.instance === "telemachus_01"){
        mod = telemachus;
        const struck   = t >= 16 && t < 24;
        const riding   = t >= 24 && t < 33;
        const commands = t >= 33;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: struck ? .6 : 0, browKnit: commands ? .5 : .1,
                  frown: commands ? .4 : 0, eyeWide: struck ? .3 : 0,
                  jaw: struck ? .3 : commands ? .2 : 0,
                  status: commands ? "TO THE SHIP" : riding ? "HOMEWARD" : struck ? "STRUCK" : "TAKING LEAVE",
                  progress: Math.min(0.96, 0.2 + 0.7*(t/D)) };

      } else { // pisistratus_01 — the host's son at the reins
        mod = pisistratus;
        const driving = t >= 24;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browKnit: driving ? .16 : 0, eyeNarrow: driving ? .1 : 0,
                  smile: driving ? 0 : .5,
                  status: driving ? "DRIVING" : "GRACIOUS",
                  progress: Math.min(0.96, 0.2 + 0.7*(t/D)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
