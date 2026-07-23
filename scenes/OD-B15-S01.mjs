/* ============================================================
   SCENE  OD-B15-S01 — Athena Wakes Telemachus
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Athena appears to Telemachus in Sparta and orders him to return home
        before Penelope is forced to marry.
     2. She warns that the suitors wait in ambush and gives a route that
        avoids the strait.
     3. She tells him to land secretly and go first to Eumaeus's hut.
     4. Telemachus wakes Pisistratus and prepares to depart at dawn.

   Stage layout (back -> front):
     BACKDROP (centre-right) — the AMBUSH-AVOIDANCE MAP: the homecoming chart
              Athena conjures and points to. It reads charted (both routes),
              then the ambush X flares over the Same strait, then the safe
              bow-west route to the secret Eumaeus landing is plotted.
     MID-RIGHT — ATHENA standing over the sleeper, divine and commanding: she
              orders the return, points to the marked strait, then names the
              secret landing.
     FRONT-CENTRE — TELEMACHUS, roused from sleep: he snaps alert to the
              goddess, takes in the warning, then turns to wake his companion.
     FRONT-LEFT (low) — PISISTRATUS, Nestor's son, being shaken awake in the
              grey before dawn to make the departure.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import map from "/assets/set_piece/ambush-avoidance-map.mjs";
import athena from "/assets/character/athena.mjs";
import telemachus from "/assets/character/telemachus.mjs";
import pisistratus from "/assets/character/pisistratus.mjs";

export const scene = {
  id:"OD-B15-S01",
  title:"Athena Wakes Telemachus",
  book:1,
  beats:[
    "Athena appears to Telemachus in Sparta and orders him to return before Penelope is forced to marry.",
    "She warns that the suitors wait in ambush and gives a route that avoids the strait.",
    "She tells him to land secretly and go first to Eumaeus's hut.",
    "Telemachus wakes Pisistratus and prepares to depart at dawn.",
  ],
  exitState:"Telemachus wakes Pisistratus and prepares to depart at dawn.",
  duration:30,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // AMBUSH-AVOIDANCE MAP — the backdrop chart Athena presents: the run from
    // Sparta home, the marked Same-strait ambush, and the safe route to the
    // secret Eumaeus landing. Sits as a flat midground panel behind the figures.
    { asset:"set_piece.ambush-avoidance-map", instance:"map_01",
      anchor:{x:.60, y:.99}, scale:.94 },

    // ATHENA — mid-right, over the sleeper: appears and orders the return,
    // points to the ambush strait, then names the hidden landing.
    { asset:"character.athena", instance:"athena_01",
      anchor:{x:.80, y:.985}, scale:.62, pose:"athena_strategist", band:"threeq",
      gaze:{x:-.42, y:.06} },

    // TELEMACHUS — front-centre: roused from sleep, snaps alert to the goddess,
    // absorbs the warning, then turns to wake Pisistratus.
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.38, y:.99}, scale:.56, pose:"alert", band:"threeq",
      gaze:{x:.30, y:-.10} },

    // PISISTRATUS — front-left, low: Nestor's son shaken awake before dawn to
    // ready the departure.
    { asset:"character.pisistratus", instance:"pisistratus_01",
      anchor:{x:.15, y:1.00}, scale:.48, pose:"neutral", band:"threeq",
      gaze:{x:.22, y:.20} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Athena appears and orders the homeward run; Telemachus wakes alert
    { op:"actor.pose", target:"athena_01",       at:0.0,  args:{ pose:"athena_strategist" } },
    { op:"actor.gaze", target:"athena_01",       at:0.0,  args:{ gaze:{x:-.42,y:.06} } },
    { op:"actor.pose", target:"telemachus_01",   at:1.0,  args:{ pose:"alert" } },
    { op:"actor.gaze", target:"telemachus_01",   at:1.0,  args:{ gaze:{x:.30,y:-.10} } },
    // beat 2: she warns of the ambush and points to the strait; he listens
    { op:"actor.pose", target:"athena_01",       at:6.0,  args:{ pose:"athena_command" } },
    { op:"actor.gaze", target:"athena_01",       at:6.0,  args:{ gaze:{x:-.30,y:.16} } },
    { op:"actor.pose", target:"telemachus_01",   at:6.0,  args:{ pose:"listening" } },
    { op:"actor.gaze", target:"telemachus_01",   at:6.0,  args:{ gaze:{x:.24,y:.04} } },
    // beat 3: land secretly, go first to Eumaeus's hut — she names the landing
    { op:"actor.pose", target:"athena_01",       at:14.0, args:{ pose:"athena_speak" } },
    { op:"actor.gaze", target:"athena_01",       at:14.0, args:{ gaze:{x:-.20,y:.02} } },
    // beat 4 (exit): Telemachus turns and wakes Pisistratus; they ready to depart
    { op:"actor.pose", target:"telemachus_01",   at:22.0, args:{ pose:"hospitality" } },
    { op:"actor.gaze", target:"telemachus_01",   at:22.0, args:{ gaze:{x:-.32,y:.26} } },
    { op:"actor.pose", target:"pisistratus_01",  at:24.0, args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"pisistratus_01",  at:24.0, args:{ gaze:{x:.18,y:-.06} } },
    { op:"timeline.capture", target:"OD-B15-S01", at:29.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the chart, then Athena over the sleeper, then the roused
     Telemachus, then Pisistratus being woken in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "map_01"){
        mod = map;
        // charted early, the ambush X flares as Athena warns, then the safe
        // bow-west route is plotted to the secret Eumaeus landing.
        let node, branch, layers, status;
        if (t < 6){
          node="charted"; branch="both"; status="CHARTED";
          layers=["sea","land","graticule","frame","road","dangerroute","saferoute","danger","nodes","labels"];
        } else if (t < 14){
          node="ambush-marked"; branch="danger"; status="AMBUSH AHEAD";
          layers=["sea","land","graticule","frame","road","dangerroute","danger","nodes","labels"];
        } else {
          node="safe-plotted"; branch="safe"; status="SAFE ROUTE";
          layers=["sea","land","graticule","frame","road","saferoute","danger","nodes","labels"];
        }
        state = { t, branch, layers, status,
                  progress: Math.min(0.96, 0.4 + 0.55*(t/D)) };

      } else if (c.instance === "athena_01"){
        mod = athena;
        const warning = t >= 6 && t < 14;
        const naming  = t >= 14;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  eyeWide: warning ? .3 : .5, browUp: naming ? .34 : .3,
                  browKnit: warning ? .6 : .1, frown: warning ? .3 : 0,
                  jaw: naming ? .5 : warning ? .16 : .26,
                  status: naming ? "GO SECRETLY" : warning ? "AMBUSH" : "RETURN NOW",
                  progress: Math.min(0.96, 0.24 + 0.7*(t/D)) };

      } else if (c.instance === "telemachus_01"){
        mod = telemachus;
        const listening = t >= 6 && t < 22;
        const rousing   = t >= 22;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: rousing ? .3 : .4, eyeWide: listening ? .2 : .34,
                  mouth: rousing ? .3 : -.05,
                  status: rousing ? "WAKING PISISTRATUS" : listening ? "LISTENING" : "ROUSED",
                  progress: Math.min(0.96, 0.18 + 0.72*(t/D)) };

      } else { // pisistratus_01 — the companion shaken awake before dawn
        mod = pisistratus;
        const awake = t >= 24;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: awake ? .3 : .05, eyeWide: awake ? .28 : 0,
                  eyeNarrow: awake ? 0 : .3, mouth: awake ? .1 : -.1,
                  status: awake ? "WOKEN" : "ASLEEP",
                  progress: Math.min(0.9, 0.14 + 0.6*(t/D)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
