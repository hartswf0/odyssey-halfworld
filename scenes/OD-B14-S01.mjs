/* ============================================================
   SCENE  OD-B14-S01 — The Dogs at Eumaeus's Yard
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus approaches Eumaeus's remote pig farm in disguise.
     2. Four savage dogs rush him; he drops his staff and sits to avoid attack.
     3. Eumaeus runs out, scatters the dogs with stones, and brings him inside.
     4. He offers his own seat and prepares two young pigs for a meal.

   Stage layout (back -> front, read as the causal sweep):
     SET    — EUMAEUS'S PIG FARM behind everything: hilltop stockade yard, stone
              hut back-right, pig pens mid-left, the yard fire and visitor's seat.
     MID    — the PIG HERD milling in its pens, upper-left.
     FRONT  — the GUARD DOGS charging in from yard-centre (facing right toward the
              intruder), ODYSSEUS AS BEGGAR dropped onto his haunches right of them
              (staff released, palms spread, watching the pack), and EUMAEUS bursting
              from the hut on the right, stone cocked, warding the dogs off — then,
              at the exit, turning his kind open-handed welcome on the stranger.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import farm from "/assets/location/eumaeuss-pig-farm.mjs";
import pigs from "/assets/creature/pig-herd.mjs";
import dogs from "/assets/creature/guard-dogs.mjs";
import beggar from "/assets/character/odysseus-as-beggar.mjs";
import eumaeus from "/assets/character/eumaeus.mjs";

export const scene = {
  id:"OD-B14-S01",
  title:"The Dogs at Eumaeus's Yard",
  book:1,
  beats:[
    "Odysseus approaches Eumaeus's remote pig farm in disguise.",
    "Four savage dogs rush him and he drops his staff and sits to avoid attack.",
    "Eumaeus runs out, scatters the dogs with stones, and brings the stranger inside.",
    "He offers his own seat and prepares two young pigs for a meal.",
  ],
  exitState:"He offers his own seat and prepares two young pigs for a meal.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // EUMAEUS'S PIG FARM — the whole remote steading, staged behind everything.
    { asset:"location.eumaeuss-pig-farm", instance:"farm_01",
      anchor:{x:.50, y:1.00}, scale:1.0 },

    // PIG HERD — the drove milling in its pens, mid-ground upper-left.
    { asset:"creature.pig-herd", instance:"pigs_01",
      anchor:{x:.20, y:.70}, scale:.30, pose:"pen-grouped" },

    // GUARD DOGS — the four savage dogs, yard-centre, rushing the intruder (dir +1,
    // facing right). Charging in the confrontation, scattered and called off later.
    { asset:"creature.guard-dogs", instance:"dogs_01",
      anchor:{x:.42, y:.99}, scale:.64, pose:"detect" },

    // ODYSSEUS AS BEGGAR — right of the pack, dropped onto his haunches: staff
    // released, both palms spread low and open, head bowed but eyes climbing up to
    // read the dogs. Instant, deliberate submission to avoid the attack.
    { asset:"character.odysseus-as-beggar", instance:"beggar_01",
      anchor:{x:.66, y:.93}, scale:.46, pose:"beggar_submit", band:"threeq",
      gaze:{x:-.34, y:-.30} },

    // EUMAEUS — bursting from the hut on the right, stone cocked overhead, warding
    // the dogs off; at the exit he turns his open-handed welcome on the stranger.
    { asset:"character.eumaeus", instance:"eumaeus_01",
      anchor:{x:.85, y:.94}, scale:.48, pose:"eum_ward", band:"threeq",
      gaze:{x:-.4, y:-.06} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the disguised king arrives — the pack detects the intruder
    { op:"actor.pose", target:"dogs_01",    at:0.0,  args:{ pose:"detect" } },
    { op:"actor.pose", target:"beggar_01",  at:0.0,  args:{ pose:"beggar_submit" } },
    // beat 2: the four savage dogs rush — the beggar has already dropped, staff
    // released, palms spread, sitting to avoid the attack
    { op:"actor.pose", target:"dogs_01",    at:2.5,  args:{ pose:"charge" } },
    { op:"actor.gaze", target:"beggar_01",  at:2.5,  args:{ gaze:{x:-.34,y:-.30} } },
    // beat 3: Eumaeus runs out, stone cocked, and scatters the pack with stones
    { op:"actor.pose", target:"eumaeus_01", at:3.0,  args:{ pose:"eum_ward" } },
    { op:"actor.gaze", target:"eumaeus_01", at:3.0,  args:{ gaze:{x:-.4,y:-.06} } },
    { op:"actor.pose", target:"dogs_01",    at:13.0, args:{ pose:"scatter" } },
    { op:"actor.pose", target:"dogs_01",    at:18.0, args:{ pose:"recall" } },
    // beat 3->4: the pack settles; Eumaeus turns his welcome on the stranger and
    // brings him inside toward the seat
    { op:"actor.pose", target:"dogs_01",    at:27.0, args:{ pose:"settle" } },
    { op:"actor.pose", target:"eumaeus_01", at:22.0, args:{ pose:"eum_welcome" } },
    { op:"actor.gaze", target:"eumaeus_01", at:22.0, args:{ gaze:{x:-.30,y:.06} } },
    { op:"actor.gaze", target:"beggar_01",  at:22.0, args:{ gaze:{x:.24,y:-.10} } },
    // beat 4 (exit): his own seat offered, two young pigs prepared for the meal
    { op:"timeline.capture", target:"OD-B14-S01", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the farm set, the penned pigs, then the dogs, the seated
     beggar, and Eumaeus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "farm_01"){
        mod = farm;
        // the gate is swung open once Eumaeus brings the stranger inside
        const opened = t >= 13;
        state = { gateOpen: opened, fireLit:true,
                  status: t < 13 ? "REMOTE" : "OPEN",
                  progress: Math.min(0.94, 0.10 + 0.80 * (t / 40)) };

      } else if (c.instance === "pigs_01"){
        mod = pigs;
        state = { pose:"pen-grouped", status:"PENNED",
                  progress: Math.min(0.9, 0.20 + 0.4 * (t / 40)) };

      } else if (c.instance === "dogs_01"){
        mod = dogs;
        const charging = t >= 2.5 && t < 13;
        state = { pose: s.pose || c.pose, t: (t * 0.6) % 1,
                  status: charging ? "SAVAGE" : t < 2.5 ? "SAVAGE" : t < 27 ? "COWED" : "SETTLED",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / 40)) };

      } else if (c.instance === "beggar_01"){
        mod = beggar;
        const welcomed = t >= 22;
        state = { t:0.5, band: c.band, pose: s.pose || c.pose,
                  gaze: s.gaze || c.gaze,
                  browKnit:.3, browUp: welcomed ? .3 : .3, eyeNarrow:.18, frown:.06, jaw:.03,
                  status: welcomed ? "GUEST" : "HUMBLE",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / 40)) };

      } else { // eumaeus_01
        mod = eumaeus;
        const welcoming = t >= 22;
        state = { t:0.5, band: c.band, pose: s.pose || c.pose,
                  gaze: s.gaze || c.gaze,
                  smile: welcoming ? .42 : 0,
                  browUp: welcoming ? .34 : .1, browKnit: welcoming ? .06 : .66,
                  eyeNarrow: welcoming ? 0 : .32, frown: welcoming ? 0 : .34,
                  cheek: welcoming ? .3 : 0, jaw: welcoming ? 0 : .1,
                  status: welcoming ? "HOST" : "WARDING",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / 40)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
