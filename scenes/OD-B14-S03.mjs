/* ============================================================
   SCENE  OD-B14-S03 — The Cretan Tale at the Hut
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. At Eumaeus's request the beggar invents a long life as a Cretan warrior
        and raider.
     2. He tells of Troy, a disastrous Egyptian raid, enslavement, escape, and a
        Thesprotian report that Odysseus is alive and near.
     3. The tale mixes precise truth with a false identity, testing what the loyal
        swineherd will accept.
     4. Eumaeus pities the ragged stranger but still refuses the claim that his
        master is near.

   Stage layout (back -> front, read across the hearth):
     BEHIND — the HUT FIRE fills the stage: the round hut in night, the low steady
              hearth the only light, its warm pool catching the two seated faces.
     MIDDLE — the CRETAN LIFE-STORY FIELD surfaces above the flames as a filmstrip
              of fabricated memories (Crete / Troy / Egypt / Slavery / Thesprotia /
              Escape), every cell flagged CONSTRUCTED, a playhead asserting one
              invented memory at a time — the lie made visible as it is spun.
     FRONT  — ODYSSEUS AS BEGGAR at the right rim, the improviser: chest open, free
              hand shaping the tale; and EUMAEUS at the left rim, leaning in to
              listen, warming to pity but hardening against the one claim too far.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import hutfire from "../assets/environment/hut-fire.mjs";
import cretan  from "../assets/divine_fx/cretan-life-story-field.mjs";
import eumaeus from "../assets/character/eumaeus.mjs";
import beggar  from "../assets/character/odysseus-as-beggar.mjs";

const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;

export const scene = {
  id:"OD-B14-S03",
  title:"The Cretan Tale at the Hut",
  book:1,
  beats:[
    "At Eumaeus's request the beggar invents a long life as a Cretan warrior and raider.",
    "He tells of Troy, a disastrous Egyptian raid, enslavement, escape, and a Thesprotian report of Odysseus.",
    "The tale mixes precise truth with a false identity, testing what the swineherd will accept.",
    "Eumaeus pities the stranger but still refuses the claim that Odysseus is near.",
  ],
  exitState:"Eumaeus pities the stranger but still refuses the claim that Odysseus is near.",
  duration:38,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // HUT FIRE — the whole set: the night hut, the steady low hearth, its warm
    // pool the only light on the two seated faces.
    { asset:"environment.hut-fire", instance:"hut_01",
      anchor:{x:.50, y:1.00}, scale:1.00 },

    // CRETAN LIFE-STORY FIELD — the fabricated autobiography surfacing above the
    // flames as a filmstrip of flagged, ghosted memories with a reading playhead.
    { asset:"divine-fx.cretan-life-story-field", instance:"tale_01",
      anchor:{x:.50, y:.615}, scale:.55 },

    // EUMAEUS — left rim of the fire, leaning in to listen; pity rising, but the
    // one claim (that Odysseus is near) hardens him against it.
    { asset:"character.eumaeus", instance:"eumaeus_01",
      anchor:{x:.235, y:.985}, scale:.47, pose:"eum_listen", band:"threeq",
      gaze:{x:.55, y:-.02} },

    // ODYSSEUS AS BEGGAR — right rim, the improviser working the story, then
    // folding the ask into it, then enduring the refusal.
    { asset:"character.odysseus-as-beggar", instance:"beggar_01",
      anchor:{x:.765, y:.99}, scale:.49, pose:"beggar_storyteller", band:"threeq",
      gaze:{x:-.5, y:-.06} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the tale begins — the beggar invents the Cretan warrior; Eumaeus
    // leans in and listens; the fabricated filmstrip starts unspooling.
    { op:"actor.pose", target:"beggar_01",  at:0.0,  args:{ pose:"beggar_storyteller" } },
    { op:"actor.gaze", target:"beggar_01",  at:0.0,  args:{ gaze:{x:-.5,y:-.06} } },
    { op:"actor.pose", target:"eumaeus_01", at:0.0,  args:{ pose:"eum_listen" } },
    { op:"actor.gaze", target:"eumaeus_01", at:0.0,  args:{ gaze:{x:.55,y:-.02} } },
    { op:"fx.play",    target:"tale_01",    at:1.0,  args:{} },

    // beat 2: Troy -> Egypt -> Slavery -> Thesprotia -> Escape reel past as the
    // playhead sweeps; the beggar keeps shaping it, eyes sliding aside inventing.
    { op:"actor.gaze", target:"beggar_01",  at:12.0, args:{ gaze:{x:-.22,y:-.24} } },

    // beat 3: the test — the Thesprotian report of Odysseus folded into the
    // anecdote as a needful ask; Eumaeus turns skeptical, weighing the claim.
    { op:"actor.pose", target:"beggar_01",  at:20.0, args:{ pose:"beggar_anecdote" } },
    { op:"actor.gaze", target:"beggar_01",  at:20.0, args:{ gaze:{x:.28,y:.10} } },
    { op:"actor.pose", target:"eumaeus_01", at:20.0, args:{ pose:"eum_skeptic" } },
    { op:"actor.gaze", target:"eumaeus_01", at:20.0, args:{ gaze:{x:.30,y:.04} } },

    // beat 4 (exit): Eumaeus pities the stranger (grieving warmth) but wards off
    // the one claim too far — Odysseus is NOT near; the beggar endures it.
    { op:"actor.pose", target:"eumaeus_01", at:30.0, args:{ pose:"eum_grieve" } },
    { op:"actor.gaze", target:"eumaeus_01", at:30.0, args:{ gaze:{x:.40,y:.10} } },
    { op:"actor.pose", target:"eumaeus_01", at:34.0, args:{ pose:"eum_ward" } },
    { op:"actor.gaze", target:"eumaeus_01", at:34.0, args:{ gaze:{x:.45,y:.02} } },
    { op:"actor.pose", target:"beggar_01",  at:33.0, args:{ pose:"beggar_endure" } },
    { op:"actor.gaze", target:"beggar_01",  at:33.0, args:{ gaze:{x:-.2,y:-.18} } },
    { op:"timeline.capture", target:"OD-B14-S03", at:37.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the hut fire set, the surfaced fabricated tale, then the two
     seated figures at the hearth rim in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D  = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "hut_01"){
        mod = hutfire;
        // a steady low hearth through the tale; as the evening deepens toward the
        // refusal the world beyond the pool goes further to night.
        const night = 0.35 + 0.25 * clamp01((t - 24) / 12);
        state = { t, intensity:0.58, lightR:0.95, smoke:0.7, cook:0.7, night,
                  status:"HEARTH",
                  progress: Math.min(0.94, 0.15 + 0.8 * (t / D)) };

      } else if (c.instance === "tale_01"){
        mod = cretan;
        // the fabricated autobiography unspools over the first third, then the
        // playhead sweeps cell-to-cell (Crete..Escape) asserting one lie at a time.
        const reveal   = clamp01(t / 11);                       // tale told out
        const playing  = t >= 5;
        const playhead = clamp01((t - 5) / 26) * 5.98;          // 0..~6 sweep
        const layers = playing
          ? ["field","strip","cells","tinge","playhead","source"]
          : ["field","strip","cells","source"];
        state = { t, reveal, playing, playhead, layers,
                  status: t < 5 ? "NARRATING" : t < 30 ? "FALSE-TINGED" : "CONSTRUCTED",
                  progress: Math.min(0.94, 0.12 + 0.82 * (t / D)) };

      } else if (c.instance === "eumaeus_01"){
        mod = eumaeus;
        const testing  = t >= 20 && t < 30;
        const pitying  = t >= 30 && t < 34;
        const warding  = t >= 34;
        state = { band: s.band || c.band, pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: pitying ? .66 : warding ? .2 : .5,
                  browKnit: warding ? .66 : testing ? .42 : .4,
                  frown: warding ? .34 : pitying ? .5 : .16,
                  eyeNarrow: warding ? .32 : testing ? .42 : .1,
                  smile: (!testing && !warding && t < 20) ? .18 : 0,
                  status: warding ? "REFUSING" : pitying ? "PITY" : testing ? "WEIGHING" : "LISTENING",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / D)) };

      } else { // beggar_01 — the improviser working the false tale
        mod = beggar;
        const asking   = t >= 20 && t < 33;
        const enduring = t >= 33;
        state = { band: s.band || c.band, pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: asking ? .52 : enduring ? .4 : .42,
                  browKnit: enduring ? .36 : asking ? .2 : .14,
                  eyeWide: (!asking && !enduring) ? .14 : 0,
                  eyeNarrow: enduring ? .36 : asking ? .2 : 0,
                  jaw: enduring ? .04 : asking ? .2 : .36,
                  frown: enduring ? .18 : asking ? .1 : 0,
                  mouthAsym: asking ? .3 : 0,
                  status: enduring ? "ENDURING" : asking ? "THE ASK" : "SPINNING",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / D)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
