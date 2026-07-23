/* ============================================================
   SCENE  OD-B09-S06 — Polyphemus Seals the Cave
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   ONE clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. At dusk Polyphemus returns carrying a massive load of wood and drives
        his flock inside.
     2. He lifts a stone slab that no ordinary team could move and blocks the
        entrance.
     3. He milks ewes and goats, sets young beneath mothers, curdles milk, and
        lights a fire.
     4. The fire reveals the hidden men and the giant demands their identity.

   Stage layout (back -> front, one master clock):
     the CAVE-BLOCKING STONE as the full-bleed set — the rocky den wall pierced
     by the dark mouth, now capped by the enormous SEALED round slab: the men
     are shut in (beats 1-2, the sealing that names the scene).
       -> the CYCLOPS FLOCK penned on the den floor at the right, ewes stood over
          the milking-pails (beat 3, pastoral labor inside the sealed cave).
       -> ODYSSEUS'S EXPEDITION pressed into the dark lower-left corner — a knot
          of unarmed sailors that the new firelight sweeps across and EXPOSES.
       -> the FIRE AND DRY LOGS kindled on the hearth, foreground centre: the
          dropped wood catching into a blaze, the new light source of the reveal.
       -> POLYPHEMUS, colossal, looming over hearth and flock — turning from his
          milking to fix the men the fire has just found, and demand who they are.
   The sealed slab, the penned flock, the kindled fire and the exposed men — all
   held on one clock in a single still. Exit: the fire reveals the hidden men and
   the giant demands their identity.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import stone from "../assets/prop/cave-blocking-stone.mjs";
import flock from "../assets/creature/cyclops-flock.mjs";
import expedition from "../assets/ensemble/odysseuss-expedition.mjs";
import fire from "../assets/environment/fire-and-dry-logs.mjs";
import polyphemus from "../assets/character/polyphemus.mjs";

const clamp01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
const ramp = (t, a, b) => clamp01((t - a) / (b - a));

export const scene = {
  id:"OD-B09-S06",
  title:"Polyphemus Seals the Cave",
  book:1,
  beats:[
    "At dusk Polyphemus returns carrying a massive load of wood and drives his flock inside.",
    "He lifts a stone slab that no ordinary team could move and blocks the entrance.",
    "He milks ewes and goats, sets young beneath mothers, curdles milk, and lights a fire.",
    "The fire reveals the hidden men and the giant demands their identity.",
  ],
  exitState:"The fire reveals the hidden men and the giant demands their identity.",
  duration:36,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the full-bleed SET: the den wall + dark mouth, capped by the SEALED slab —
    // the entrance blocked, the men shut in (the sealing that names the scene)
    { asset:"prop.cave-blocking-stone", instance:"stone_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the CYCLOPS FLOCK penned on the den floor, right of the hearth — ewes stood
    // over the milking-pails (pastoral labor inside the sealed cave)
    { asset:"creature.cyclops-flock", instance:"flock_01",
      anchor:{x:.72,y:.66}, scale:.34, pose:"milking" },

    // ODYSSEUS'S EXPEDITION pressed into the dark lower-left corner — the huddle
    // the new firelight sweeps across and exposes (fire on their right side)
    { asset:"ensemble.odysseuss-expedition", instance:"expedition_01",
      anchor:{x:.20,y:1.00}, scale:.50 },

    // the FIRE AND DRY LOGS on the hearth, foreground centre — the dropped wood
    // catching into a blaze; the new light source of the reveal
    { asset:"environment.fire-and-dry-logs", instance:"fire_01",
      anchor:{x:.42,y:.94}, scale:.42 },

    // POLYPHEMUS, colossal, looming over hearth and flock — turning from his
    // milking to fix the exposed men and demand who they are
    { asset:"character.polyphemus", instance:"poly_01",
      anchor:{x:.60,y:.99}, scale:.80, pose:"poly_labor", band:"front",
      gaze:{x:-.22,y:.28} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1-3: the giant at his pastoral labor — herding, then milking; head
    // bowed to the flock and the pails
    { op:"actor.pose", target:"poly_01",  at:0.0,  args:{ pose:"poly_labor" } },
    { op:"actor.gaze", target:"poly_01",  at:0.0,  args:{ gaze:{x:-.22,y:.28} } },
    { op:"actor.pose", target:"flock_01", at:0.0,  args:{ pose:"milking" } },
    // beat 3: the dropped wood catches — the hearth-fire kindles (its light ramps
    // deterministically in stage() from this cue)
    { op:"fx.play",    target:"fire_01",  at:2.0,  args:{} },
    // beat 4: the blaze finds the corner — the giant lifts from his work and fixes
    // the exposed men, demanding their identity
    { op:"actor.gaze", target:"poly_01",  at:6.5,  args:{ gaze:{x:-.34,y:.05} } },
    // the young set beneath the mothers as the night settles
    { op:"actor.pose", target:"flock_01", at:20.0, args:{ pose:"pair" } },
    { op:"timeline.capture", target:"OD-B09-S06", at:34.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the sealed-mouth set, the penned flock, the cornered men, the
     kindled hearth, and the colossal Cyclops looming over them. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // deterministic reveal ramps folded from the master clock
    const fr = ramp(t, 3.5, 7.5);          // fire ember -> blaze
    const hr = ramp(t, 4.0, 7.5);          // firelight reaching the huddle

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "stone_01"){
        mod = stone;
        // the entrance sealed: the giant round slab capping the dark mouth
        state = { mode:"sealed", t:0 };

      } else if (c.instance === "flock_01"){
        mod = flock;
        // ewes over the pails, then dams paired with young (pose from timeline)
        state = { pose:s.pose || c.pose, t:0.3 };

      } else if (c.instance === "expedition_01"){
        mod = expedition;
        // the huddle in the dark corner, swept by the new firelight from the
        // hearth on their right; no self-fire (the real hearth is adjacent)
        state = {
          formation: hr > 0.55 ? "exposed" : "huddle-in-dark",
          light: 0.08 + 0.86 * hr,
          fear:  0.50 + 0.45 * ramp(t, 5.0, 8.0),
          fireDir: 1, showFire: false,
          t: 0.3,
        };

      } else if (c.instance === "fire_01"){
        mod = fire;
        // the dropped wood catching into a blaze — no opaque "room"/"shadows"
        // fill so the fire lays over the set; light + flames + smoke only
        state = {
          layers:["light","hearth","logs","embers","flames","sparks","smoke"],
          intensity: 0.05 + 1.30 * fr,
          lightR:    0.30 + 1.15 * fr,
          smoke:     0.10 + 1.00 * ramp(t, 4.5, 9.0),
          drop:      1 - ramp(t, 1.0, 3.0),
          t,
        };

      } else { // poly_01
        mod = polyphemus;
        // labor -> lifts to a glare and fixes the exposed men (the demand)
        const demanding = t >= 6.5;
        state = {
          pose: s.pose || c.pose, band: c.band,
          gaze: s.gaze || c.gaze,
          eye: demanding ? "glare" : "watch",
          browKnit: demanding ? 0.80 : 0.28,
          t: 0.4,
        };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
