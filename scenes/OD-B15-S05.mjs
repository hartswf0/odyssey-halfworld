/* ============================================================
   SCENE  OD-B15-S05 — Telemachus Lands in Secret
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. As the ship approaches Ithaca, a hawk tears a dove beside Telemachus.
     2. Theoclymenus reads the omen: Odysseus's line will remain supreme.
     3. Telemachus orders the crew to take the ship to town while he lands
        near Eumaeus's farm.
     4. He entrusts Theoclymenus to Piraeus and walks inland alone.

   Stage layout (back -> front):
     BEHIND      — SECRET ITHACAN LANDING: the whole cove — hidden strand,
                   the flat landing rock, the townward ship-lane out to sea,
                   the farm path leaving inland. The full-frame set.
     WATER       — RETURNING SHIP AND CREW: the black galley that noses the
                   prince ashore, then pulls back out and bears away to town.
     SKY (right) — HAWK AND DOVE OMEN: the strike crossing in from the right,
                   the dove seized beside the prince, the omen arc + feathers.
     FRONT-RIGHT — THEOCLYMENUS: the seer who reads the sign into prophecy,
                   then is entrusted to Piraeus.
     FRONT-LEFT  — TELEMACHUS: the prince who takes the omen, orders the ship
                   townward, and walks inland alone toward Eumaeus's farm.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import landing from "../assets/location/secret-ithacan-landing.mjs";
import ship from "../assets/vehicle/returning-ship-and-crew.mjs";
import omen from "../assets/creature/hawk-and-dove-omen.mjs";
import theoclymenus from "../assets/character/theoclymenus.mjs";
import telemachus from "../assets/character/telemachus.mjs";

export const scene = {
  id:"OD-B15-S05",
  title:"Telemachus Lands in Secret",
  book:1,
  beats:[
    "As the ship approaches Ithaca, a hawk tears a dove beside Telemachus.",
    "Theoclymenus reads the omen as proof that Odysseus's line will remain supreme.",
    "Telemachus orders the crew to take the ship to town while he lands near Eumaeus's farm.",
    "He entrusts Theoclymenus to Piraeus and walks inland alone.",
  ],
  exitState:"He entrusts Theoclymenus to Piraeus and walks inland alone.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // SECRET ITHACAN LANDING — the full-frame cove behind everything: the
    // hidden strand, the landing rock, the townward lane, the inland farm path.
    { asset:"location.secret-ithacan-landing", instance:"landing_01",
      anchor:{x:.50, y:1.00}, scale:1.00 },

    // RETURNING SHIP AND CREW — in the water mid-left: it drops the prince,
    // then pulls back out and bears away down the lane toward the harbour town.
    { asset:"vehicle.returning-ship-and-crew", instance:"ship_01",
      anchor:{x:.44, y:.66}, scale:.52, pose:"dropping-passenger" },

    // HAWK AND DOVE OMEN — upper-right sky: the strike crosses in from the
    // right and plunges toward the prince, the dove seized, feathers flying.
    { asset:"creature.hawk-and-dove-omen", instance:"omen_01",
      anchor:{x:.62, y:.46}, scale:.56, pose:"strike" },

    // THEOCLYMENUS — front-right on the strand: watchful, then reading the
    // sign into prophecy, then handed off to Piraeus.
    { asset:"character.theoclymenus", instance:"theoclymenus_01",
      anchor:{x:.62, y:.98}, scale:.48, pose:"theo_alert", band:"threeq",
      gaze:{x:.24, y:-.30} },

    // TELEMACHUS — front-left on the landing: takes the omen, orders the ship
    // townward, then walks inland alone toward the pig farm.
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.34, y:.97}, scale:.50, pose:"astonished", band:"threeq",
      gaze:{x:.30, y:-.34} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1 (~0-10): the hawk strikes beside the prince; he stares up at it
    { op:"fx.play",    target:"omen_01",         at:0.0,  args:{} },
    { op:"actor.pose", target:"telemachus_01",   at:0.0,  args:{ pose:"astonished" } },
    { op:"actor.gaze", target:"telemachus_01",   at:0.0,  args:{ gaze:{x:.34,y:-.36} } },
    { op:"actor.pose", target:"theoclymenus_01", at:2.0,  args:{ pose:"theo_alert" } },
    { op:"actor.gaze", target:"theoclymenus_01", at:2.0,  args:{ gaze:{x:.26,y:-.40} } },
    { op:"actor.pose", target:"omen_01",         at:6.0,  args:{ pose:"seize" } },
    // beat 2 (~10-20): Theoclymenus reads the sign — the dynasty will hold
    { op:"actor.pose", target:"theoclymenus_01", at:11.0, args:{ pose:"theo_prophesy" } },
    { op:"actor.gaze", target:"theoclymenus_01", at:11.0, args:{ gaze:{x:-.30,y:-.10} } },
    { op:"actor.pose", target:"telemachus_01",   at:12.0, args:{ pose:"listening" } },
    { op:"actor.gaze", target:"telemachus_01",   at:12.0, args:{ gaze:{x:.30,y:-.04} } },
    // beat 3 (~20-30): the prince orders the crew townward; the ship pulls out
    { op:"actor.pose", target:"telemachus_01",   at:20.0, args:{ pose:"command" } },
    { op:"actor.gaze", target:"telemachus_01",   at:20.0, args:{ gaze:{x:-.34,y:-.02} } },
    { op:"actor.pose", target:"ship_01",         at:23.0, args:{ pose:"continuing-to-town" } },
    { op:"actor.move", target:"ship_01",         at:23.0, args:{ anchor:{x:.26,y:.60} } },
    // beat 4 (exit, ~30-40): entrusts Theoclymenus to Piraeus, walks inland alone
    { op:"actor.pose", target:"theoclymenus_01", at:31.0, args:{ pose:"theo_supplicate" } },
    { op:"actor.gaze", target:"theoclymenus_01", at:31.0, args:{ gaze:{x:-.28,y:.04} } },
    { op:"actor.pose", target:"telemachus_01",   at:32.0, args:{ pose:"alert" } },
    { op:"actor.gaze", target:"telemachus_01",   at:32.0, args:{ gaze:{x:.42,y:-.06} } },
    { op:"actor.move", target:"telemachus_01",   at:33.0, args:{ anchor:{x:.60,y:.86} } },
    { op:"timeline.capture", target:"OD-B15-S05", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the cove, the ship in the water, the omen in the sky, then
     the seer and the prince in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "landing_01"){
        mod = landing;
        // the hidden cove: the townward lane shows while the ship still rides
        // it, then thins as the galley bears away; the farm path always reads.
        const boatGone = t >= 23;
        state = { layers: boatGone
                    ? ["sky","sea","hills","olives","surf","beach","landing","path"]
                    : ["sky","sea","lane","hills","olives","surf","beach","landing","path"],
                  status: boatGone ? "ASHORE" : "HIDDEN",
                  progress: Math.min(0.96, 0.16 + 0.8*(t/D)) };

      } else if (c.instance === "ship_01"){
        mod = ship;
        // noses the prince ashore, then pulls back out and bears away to town
        const away = t >= 23;
        state = { t: t*0.5,
                  mode: away ? "continuing-to-town" : "dropping-passenger",
                  status: away ? "BOUND HOME" : "DROPPING OFF",
                  progress: away ? Math.min(0.95, 0.6 + 0.4*(t/D)) : 0.35 };

      } else if (c.instance === "omen_01"){
        mod = omen;
        // the strike crosses the prince's right; drop the creature's own full
        // sky so it composites OVER the cove — only the arc, hawk, feathers.
        const seized = t >= 6;
        state = { t, pose: s.pose || c.pose,
                  layers:["arc","hawk","feathers"],
                  status: seized ? "SEIZE" : "OMEN",
                  progress: Math.min(0.9, 0.3 + 0.5*(t/D)) };

      } else if (c.instance === "theoclymenus_01"){
        mod = theoclymenus;
        const reading = t >= 11 && t < 31;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: reading ? .6 : .4, browKnit: reading ? .3 : .5,
                  eyeWide: reading ? .3 : .12, jaw: reading ? .4 : .1,
                  status: t < 11 ? "READING SKY" : reading ? "PROPHESYING" : "ENTRUSTED",
                  progress: Math.min(0.96, 0.2 + 0.72*(t/D)) };

      } else { // telemachus_01 — the prince
        mod = telemachus;
        const struck   = t < 12;
        const ordering = t >= 20 && t < 32;
        const leaving  = t >= 32;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  mouth: struck ? -.25 : ordering ? -.28 : -.05,
                  blink: struck ? 0 : leaving ? .1 : 0,
                  status: struck ? "OMEN SEEN" : ordering ? "SHIP TO TOWN"
                          : leaving ? "INLAND ALONE" : "LISTENING",
                  progress: Math.min(0.98, 0.2 + 0.76*(t/D)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
