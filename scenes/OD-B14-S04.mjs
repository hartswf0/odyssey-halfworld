/* ============================================================
   SCENE  OD-B14-S04 — The Cloak Test
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Night turns cold and wet as Eumaeus's herdsmen return.
     2. The stranger tells a story of once tricking Odysseus, during the war,
        into getting a freezing scout a cloak — the ask folded into the tale.
     3. Eumaeus reads the indirect request and lends him a heavy swineherd cloak.
     4. Eumaeus goes out and sleeps near the pigs himself, guarding the herd
        through the storm.

   Stage layout (back -> front):
     BEHIND — NIGHT RAIN AND COLD spread across the whole stage: the driven
              diagonal rain, sweeping gusts, the huddled herd, the isobar
              exposure field, and the one small sheltered fire. The cold wet
              night the whole scene turns on.
     DISTANCE (left) — the RETURNING HERDSMEN coming up out of the dusk with the
              herd, a lighter arrival vignette against the dark storm.
     FRONT-LEFT  — EUMAEUS by the fire: the great listener, who reads the buried
              ask and lends the cloak, then moves off to sleep by the pigs.
     FRONT-CENTRE— ODYSSEUS AS BEGGAR: the improviser spinning the wartime
              anecdote, free hand cupped low on the embedded request, then
              mantled in the lent cloak.
     FRONT-RIGHT — the HEAVY SWINEHERD CLOAK itself: offered, then wrapped, then
              draped as the sleeping-cover over the settled stranger.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import night from "/assets/environment/night-rain-and-cold.mjs";
import herdsmen from "/assets/ensemble/returning-herdsmen.mjs";
import eumaeus from "/assets/character/eumaeus.mjs";
import beggar from "/assets/character/odysseus-as-beggar.mjs";
import cloak from "/assets/wearable/heavy-swineherd-cloak.mjs";

export const scene = {
  id:"OD-B14-S04",
  title:"The Cloak Test",
  book:1,
  beats:[
    "Night turns cold and wet as Eumaeus's herdsmen return.",
    "The stranger tells a story of tricking Odysseus into getting a scout a cloak during the war.",
    "Eumaeus understands the indirect request and lends the stranger a heavy cloak.",
    "He sleeps near the pigs himself, guarding the herd through the storm.",
  ],
  exitState:"He sleeps near the pigs himself, guarding the herd through the storm.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // NIGHT RAIN AND COLD — the full-frame storm behind everything: driven rain,
    // gusts, the huddled herd, the exposure-pressure field, the one small fire.
    { asset:"environment.night-rain-and-cold", instance:"night_01",
      anchor:{x:.50, y:1.00}, scale:1.00 },

    // RETURNING HERDSMEN — a distance vignette back-left: the hands driving the
    // herd home up out of the last dusk light as the cold closes in.
    { asset:"ensemble.returning-herdsmen", instance:"herdsmen_01",
      anchor:{x:.17, y:.60}, scale:.40 },

    // EUMAEUS — front-left by the fire: listening, then lending the cloak, then
    // moving off to bed down among the pigs.
    { asset:"character.eumaeus", instance:"eumaeus_01",
      anchor:{x:.38, y:.99}, scale:.60, pose:"eum_listen", band:"threeq",
      gaze:{x:.28, y:.06} },

    // ODYSSEUS AS BEGGAR — front-centre: the improviser working the wartime tale
    // with the ask cupped low in his free hand, then wrapped in the lent cloak.
    { asset:"character.odysseus-as-beggar", instance:"beggar_01",
      anchor:{x:.62, y:.99}, scale:.56, pose:"beggar_storyteller", band:"threeq",
      gaze:{x:-.30, y:-.04} },

    // HEAVY SWINEHERD CLOAK — front-right: offered, then wrapped, then draped as
    // the sleeping-cover over the settled stranger.
    { asset:"wearable.heavy-swineherd-cloak", instance:"cloak_01",
      anchor:{x:.86, y:.92}, scale:.34 },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the cold wet night sets in as the herd is driven home
    { op:"fx.play",    target:"night_01",    at:0.0,  args:{} },
    // beat 2: the stranger spins the wartime anecdote, then folds the ask into it;
    // Eumaeus bows into his listening
    { op:"actor.pose", target:"eumaeus_01",  at:5.0,  args:{ pose:"eum_listen" } },
    { op:"actor.pose", target:"beggar_01",   at:8.0,  args:{ pose:"beggar_storyteller" } },
    { op:"actor.gaze", target:"beggar_01",   at:8.0,  args:{ gaze:{x:.30,y:-.04} } },
    { op:"actor.pose", target:"beggar_01",   at:17.0, args:{ pose:"beggar_anecdote" } },
    { op:"actor.gaze", target:"beggar_01",   at:17.0, args:{ gaze:{x:-.30,y:.12} } },
    // beat 3: Eumaeus reads the buried request and lends the heavy cloak; the
    // stranger takes it and wraps it round himself
    { op:"actor.pose", target:"eumaeus_01",  at:26.0, args:{ pose:"eum_welcome" } },
    { op:"actor.gaze", target:"eumaeus_01",  at:26.0, args:{ gaze:{x:.34,y:.04} } },
    { op:"actor.pose", target:"beggar_01",   at:30.0, args:{ pose:"beggar_endure" } },
    { op:"actor.gaze", target:"beggar_01",   at:30.0, args:{ gaze:{x:.10,y:.10} } },
    // beat 4 (exit): the stranger settles wrapped; Eumaeus takes his own gear and
    // moves out to sleep beside the pigs, guarding the herd through the storm
    { op:"actor.move", target:"cloak_01",    at:38.0, args:{ anchor:{x:.60,y:.985} } },
    { op:"actor.move", target:"eumaeus_01",  at:37.0, args:{ anchor:{x:.24,y:.99} } },
    { op:"actor.pose", target:"eumaeus_01",  at:37.0, args:{ pose:"eum_grieve" } },
    { op:"actor.gaze", target:"eumaeus_01",  at:37.0, args:{ gaze:{x:.12,y:.42} } },
    { op:"actor.pose", target:"beggar_01",   at:38.0, args:{ pose:"beggar_submit" } },
    { op:"actor.gaze", target:"beggar_01",   at:38.0, args:{ gaze:{x:0,y:.30} } },
    { op:"timeline.capture", target:"OD-B14-S04", at:43.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the storm night, the distant returning herdsmen, then Eumaeus,
     the beggar, and the lent cloak in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "night_01"){
        mod = night;
        // the storm holds through the scene, easing a touch once the fire is
        // tended and the exposure field never quite lets go — cold all night.
        const warming = t >= 24;                 // fire tended as the cloak is lent
        state = { t: t*0.5,
                  dark: 1.12, rain: warming ? 1.05 : 1.30, wind: warming ? 1.05 : 1.28,
                  fire: t < 4 ? 0.5 : 1.05, pressure: warming ? 0.85 : 1.2,
                  layers:["night","pressure","gusts","glow","huddle","fire","rain"],
                  status: t < 10 ? "DOWNPOUR" : t < 36 ? "COLD NIGHT" : "STORM WATCH",
                  progress: Math.min(0.96, 0.14 + 0.82*(t/D)) };

      } else if (c.instance === "herdsmen_01"){
        mod = herdsmen;
        // beat 1: driving the herd home; they settle by their own fire as the
        // night sets in. A distant arrival, so kept light and small back-left.
        const settling = t >= 8;
        state = { formation: settling ? "settle" : "drive",
                  weariness: settling ? 0.72 : 0.4,
                  attention: settling ? 0.66 : 0.2,
                  spread: 1.0, density: 1.0,
                  status: settling ? "SETTLED" : "DRIVING",
                  progress: Math.min(0.9, 0.16 + 0.5*(t/D)) };

      } else if (c.instance === "eumaeus_01"){
        mod = eumaeus;
        const lending  = t >= 26 && t < 37;
        const guarding = t >= 37;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  smile: lending ? .42 : 0, cheek: lending ? .3 : 0,
                  browUp: guarding ? .66 : lending ? .34 : .5,
                  browKnit: guarding ? .5 : lending ? .06 : .42,
                  frown: guarding ? .5 : .16,
                  eyeNarrow: guarding ? .22 : .06,
                  status: guarding ? "GUARDING" : lending ? "LENDING" : "LISTENING",
                  progress: Math.min(0.96, 0.18 + 0.7*(t/D)) };

      } else if (c.instance === "beggar_01"){
        mod = beggar;
        const asking  = t >= 17 && t < 30;
        const took    = t >= 30 && t < 38;
        const resting = t >= 38;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: asking ? .52 : took ? .3 : .42,
                  browKnit: asking ? .2 : .16,
                  eyeNarrow: resting ? .5 : asking ? .2 : .06,
                  eyeWide: (!asking && !took && !resting) ? .14 : 0,
                  frown: took ? .12 : .06,
                  mouthAsym: asking ? .3 : 0,
                  jaw: resting ? .02 : asking ? .2 : .34,
                  status: resting ? "WRAPPED" : took ? "GIVEN" : asking ? "ASKING" : "TELLING",
                  progress: Math.min(0.96, 0.18 + 0.7*(t/D)) };

      } else { // cloak_01 — the lent heavy swineherd cloak
        mod = cloak;
        // offered as Eumaeus reads the ask, wrapped round the stranger, then
        // draped as the sleeping-cover over the settled form at the exit.
        let mode, status;
        if (t < 24)      { mode = "folded";         status = "EUMAEUS'S"; }
        else if (t < 30) { mode = "offered";        status = "OFFERED"; }
        else if (t < 38) { mode = "wrapped";        status = "WRAPPED"; }
        else             { mode = "sleeping-cover";  status = "COVER"; }
        state = { t, mode, status,
                  progress: Math.min(0.98, 0.2 + 0.75*(t/D)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
