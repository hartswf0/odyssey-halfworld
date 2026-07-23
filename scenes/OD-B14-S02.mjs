/* ============================================================
   SCENE  OD-B14-S02 — The Swineherd Laments His Master
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Eumaeus apologizes for the humble food and curses the suitors who
        consume Odysseus's best animals.
     2. He speaks of the absent king with loyalty and refuses to believe
        hopeful travelers' stories.
     3. Odysseus (as beggar) swears that the master will return within the year.
     4. Eumaeus rejects the prediction but continues to honor the stranger.

   Stage layout (back -> front):
     SET    — EUMAEUS'S PIG FARM, the remote stockaded steading with its hut
              fire, filling the whole stage behind everything.
     BEHIND — the ABSENT-MASTER MEMORY field floating in the upper air between
              the two men: three pale recollection-frames of the good lord's
              former care, summoned by the swineherd's grieving loyalty (beat 2).
     LEFT   — EUMAEUS, the loyal swineherd: speaking grief-and-anger over the
              spread, sinking into mourning, listening to the stranger's oath,
              then setting one firm boundary of disbelief at the exit.
     RIGHT  — ODYSSEUS AS BEGGAR, the humble guest: enduring, then rising into
              the storyteller who swears the master returns within the year, and
              at the exit still received with honor though not believed.
     FRONT  — the humble FARM MEAL on its rough plank table between them, the
              modest spread Eumaeus apologizes for.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import farm from "../assets/location/eumaeuss-pig-farm.mjs";
import memory from "../assets/divine_fx/absent-master-memory.mjs";
import meal from "../assets/prop/farm-meal.mjs";
import eumaeus from "../assets/character/eumaeus.mjs";
import beggar from "../assets/character/odysseus-as-beggar.mjs";

export const scene = {
  id:"OD-B14-S02",
  title:"The Swineherd Laments His Master",
  book:1,
  beats:[
    "Eumaeus apologizes for the humble food and curses the suitors who consume Odysseus's best animals.",
    "He speaks of the absent king with loyalty and refuses to believe hopeful travelers' stories.",
    "Odysseus swears that the master will return within the year.",
    "Eumaeus rejects the prediction but continues to honor the stranger.",
  ],
  exitState:"Eumaeus rejects the prediction but continues to honor the stranger.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // SET — the remote pig farm behind everything, fire lit, gate shut.
    { asset:"location.eumaeuss-pig-farm", instance:"farm_01",
      anchor:{x:.50, y:1.00}, scale:1.0 },

    // ABSENT-MASTER MEMORY — the floating field of recollection, staged high and
    // centred in the air between the two men so it reads as the swineherd's
    // remembering rising over the meal. Summoned in beat 2.
    { asset:"divine-fx.absent-master-memory", instance:"memory_01",
      anchor:{x:.50, y:.58}, scale:.52 },

    // EUMAEUS — left, the loyal swineherd by his staff and hide cloak, speaking.
    { asset:"character.eumaeus", instance:"eumaeus_01",
      anchor:{x:.28, y:.99}, scale:.60, pose:"eum_speak", band:"threeq",
      gaze:{x:.16, y:.02} },

    // ODYSSEUS AS BEGGAR — right, the humble guest, enduring then swearing the oath.
    { asset:"character.odysseus-as-beggar", instance:"beggar_01",
      anchor:{x:.74, y:.99}, scale:.54, pose:"beggar_endure", band:"threeq",
      gaze:{x:-.22, y:-.10} },

    // FARM MEAL — the humble spread on its plank table, front-centre between them.
    { asset:"prop.farm-meal", instance:"meal_01",
      anchor:{x:.50, y:1.00}, scale:.46 },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Eumaeus apologizes for the humble food and curses the suitors —
    // leaning in, near arm flung out in complaint, grief-and-anger.
    { op:"actor.pose", target:"eumaeus_01", at:0.0,  args:{ pose:"eum_speak" } },
    { op:"actor.gaze", target:"eumaeus_01", at:0.0,  args:{ gaze:{x:.16,y:.02} } },
    { op:"actor.pose", target:"beggar_01",  at:0.0,  args:{ pose:"beggar_endure" } },
    { op:"actor.gaze", target:"beggar_01",  at:0.0,  args:{ gaze:{x:-.22,y:-.10} } },

    // beat 2: he speaks of the absent king with loyalty and refuses hopeful
    // stories — sinking into mourning; the memory of the master rises.
    { op:"actor.pose", target:"eumaeus_01", at:11.0, args:{ pose:"eum_grieve" } },
    { op:"actor.gaze", target:"eumaeus_01", at:11.0, args:{ gaze:{x:.02,y:.44} } },
    { op:"fx.play",    target:"memory_01",  at:11.0, args:{} },

    // beat 3: Odysseus swears the master will return within the year — the beggar
    // rises into the storyteller shaping the oath; Eumaeus lifts to listen.
    { op:"actor.pose", target:"beggar_01",  at:22.0, args:{ pose:"beggar_storyteller" } },
    { op:"actor.gaze", target:"beggar_01",  at:22.0, args:{ gaze:{x:-.34,y:-.04} } },
    { op:"actor.pose", target:"eumaeus_01", at:22.0, args:{ pose:"eum_listen" } },
    { op:"actor.gaze", target:"eumaeus_01", at:22.0, args:{ gaze:{x:.24,y:.08} } },

    // beat 4 (exit): Eumaeus rejects the prediction but continues to honor the
    // stranger — the one firm boundary of disbelief; the beggar received with
    // patient honor still.
    { op:"actor.pose", target:"eumaeus_01", at:33.0, args:{ pose:"eum_skeptic" } },
    { op:"actor.gaze", target:"eumaeus_01", at:33.0, args:{ gaze:{x:.30,y:.02} } },
    { op:"actor.pose", target:"beggar_01",  at:33.0, args:{ pose:"beggar_endure" } },
    { op:"actor.gaze", target:"beggar_01",  at:33.0, args:{ gaze:{x:-.20,y:-.06} } },

    { op:"timeline.capture", target:"OD-B14-S02", at:43.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the farm set, the floating memory field, the two men, then
     the humble meal on its table in front. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "farm_01"){
        mod = farm;
        // the steading behind: fire lit, gate shut, the remote loyal outpost
        state = { gateOpen:false, fireLit:true, status:"REMOTE",
                  progress: Math.min(0.9, 0.2 + 0.6 * (t / D)) };

      } else if (c.instance === "memory_01"){
        mod = memory;
        // summoned in beat 2 (t>=11): the swineherd's grief calls up the master.
        // Before that it lies unsummoned under a heavy recollection wash; once
        // called it sweeps greeting->feeding->flock, then thickens back to mist
        // as Eumaeus rejects the hopeful oath at the exit (beat 4).
        const summoned = t >= 11;
        const local = Math.max(0, t - 11);        // drive the sweep from the summons
        const receding = t >= 33 ? Math.min(1, (t - 33) / 9) : 0;
        state = { t: local,
                  mist: summoned ? (0.05 + 0.55 * receding) : 0.82,
                  status: t < 11 ? "UNSPOKEN" : receding > 0 ? "DOUBTED" : "REMEMBERED",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / D)),
                  layers:["thread","greeting","feeding","flock","mist"] };

      } else if (c.instance === "meal_01"){
        mod = meal;
        // the humble spread Eumaeus apologizes for — set on the plank table,
        // slowly eaten as the two men share it through the talk.
        state = { divided:0, eaten: Math.min(0.35, 0.02 + 0.5 * (t / D)),
                  status:"HUMBLE", progress: Math.min(0.9, 0.2 + 0.6 * (t / D)) };

      } else if (c.instance === "eumaeus_01"){
        mod = eumaeus;
        const grieving = t >= 11 && t < 22;
        const listening = t >= 22 && t < 33;
        const skeptical = t >= 33;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  // expression channels tuned per beat (mirroring the asset nodes)
                  browUp: skeptical ? .2 : grieving ? .66 : listening ? .5 : .34,
                  browKnit: skeptical ? .42 : grieving ? .5 : listening ? .42 : .5,
                  frown: grieving ? .5 : listening ? .16 : skeptical ? .12 : .34,
                  eyeNarrow: skeptical ? .42 : grieving ? .22 : .12,
                  mouthAsym: skeptical ? .62 : grieving ? 0 : .2,
                  jaw: (!grieving && !skeptical && !listening) ? .44 : .0,
                  status: skeptical ? "DISBELIEVING" : grieving ? "GRIEVING"
                        : listening ? "LISTENING" : "AGGRIEVED",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / D)) };

      } else { // beggar_01 — Odysseus playing the humble guest
        mod = beggar;
        const swearing = t >= 22 && t < 33;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: swearing ? .42 : .4,
                  browKnit: swearing ? .14 : .36,
                  eyeWide: swearing ? .14 : 0,
                  eyeNarrow: swearing ? 0 : .36,
                  frown: swearing ? 0 : .18,
                  jaw: swearing ? .36 : .04,
                  status: swearing ? "SWEARING" : t >= 33 ? "HONORED" : "HUMBLE",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / D)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
