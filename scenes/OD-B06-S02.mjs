/* OD-B06-S02 — Laundry and Ball at the River
   A thin Halfworld COMPOSITION module. It places existing assets on one master
   clock; it does not redraw any of them. The engine runs a single dotify + card
   pass over the whole stage, so every instance shares one halftone.

   Beats (causal order):
     1. Nausicaa and her maids reach the washing pools, unharness the mules, and
        tread the palace clothes clean in the stone basins.
     2. They spread the garments on the shore, bathe, eat, and play ball while the
        clothes dry.
     3. Athena deflects the ball into deep water; the girls cry out.
     4. The shout wakes Odysseus, buried under the leaves at the forest edge.

   Staging: the RIVER WASHING POOLS set frames the whole space — forest edge and
   leaf-hollow at the top-right, the river band across the middle, the stone
   wash-basins in the foreground. SLEEPING ODYSSEUS lies buried in the leaf hollow
   at the right treeline (back). NAUSICAA'S MAIDS work / play / scatter across the
   meadow (mid). NAUSICAA stands foreground-left, directing then playing. The
   LAUNDRY BALL flies over the court, is missed into the river, and its splash +
   the maids' shout carry back to the hollow where Odysseus stirs and lifts to
   listen. All four beats run on one clock. */

import pools    from "/assets/location/river-washing-pools.mjs";
import odysseus from "/assets/character/sleeping-odysseus-under-leaves.mjs";
import maids    from "/assets/ensemble/nausicaas-maids.mjs";
import nausicaa from "/assets/character/nausicaa.mjs";
import ball     from "/assets/prop/laundry-ball.mjs";

import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

const clamp01 = x => x<0?0:(x>1?1:x);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

export const scene = {
  id:"OD-B06-S02",
  title:"Laundry and Ball at the River",
  book:1,

  beats:[
    "Nausicaa and her maids drive to the washing pools, unharness the mules, and tread the clothes clean.",
    "They spread garments on the shore, bathe, eat, and play ball while the clothes dry.",
    "Athena deflects the ball into deep water; the girls cry out.",
    "The shout wakes Odysseus beneath the leaves.",
  ],
  exitState:"The shout wakes Odysseus beneath the leaves.",
  duration:36,

  cast:[
    // back -> front
    { asset:"location.river-washing-pools",            instance:"pools_01",    anchor:{x:.50,y:1.00}, scale:1.00, pose:"set" },
    { asset:"character.sleeping-odysseus-under-leaves", instance:"odysseus_01", anchor:{x:.88,y:.46},  scale:.30,  pose:"deep_sleep", gaze:{x:0,y:.2} },
    { asset:"ensemble.nausicaas-maids",                instance:"maids_01",    anchor:{x:.60,y:.80},  scale:.56,  pose:"at-work" },
    { asset:"character.nausicaa",                      instance:"nausicaa_01", anchor:{x:.30,y:.90},  scale:.42,  pose:"nausicaa_directing", gaze:{x:.4,y:.02} },
    { asset:"prop.laundry-ball",                       instance:"ball_01",     anchor:{x:.66,y:.52},  scale:.30,  pose:"idle" },
  ],

  timeline:[
    // beat 1 — arrive at the basins, tread the clothes clean (maids at work)
    { op:"actor.pose", target:"nausicaa_01", at:0.5,  args:{ pose:"nausicaa_directing" } },
    // beat 2 — clothes spread to dry; the girls play ball
    { op:"actor.pose", target:"nausicaa_01", at:6.0,  args:{ pose:"nausicaa_ballgame" } },
    { op:"actor.gaze", target:"nausicaa_01", at:6.0,  args:{ gaze:{x:-.2,y:-.3} } },
    // beat 3 — Athena deflects the ball into deep water; the girls cry out
    { op:"actor.gaze", target:"nausicaa_01", at:18.0, args:{ gaze:{x:.5,y:-.1} } },
    { op:"actor.gaze", target:"odysseus_01", at:22.0, args:{ gaze:{x:.2,y:.1} } },
    // beat 4 — the shout reaches the leaf hollow; Odysseus wakes
    { op:"actor.pose", target:"odysseus_01", at:24.0, args:{ pose:"stirring" } },
    { op:"actor.pose", target:"odysseus_01", at:30.0, args:{ pose:"listening" } },
    { op:"actor.gaze", target:"odysseus_01", at:30.0, args:{ gaze:{x:.55,y:-.08} } },
    { op:"timeline.capture", target:"OD-B06-S02", at:35.0, args:{ label:"EXIT" } },
  ],

  // ---- per-instance drivers folded off the one master clock ----

  // the ball's life: idle on the grass -> tossed in play -> missed -> splash ->
  // and finally the alerting ripple that carries the shout to the hollow.
  _ballState(t){
    if (t < 6)  return { status:"IN PLAY" };                              // resting at the picnic
    if (t < 11) return { throw:1,  status:"IN FLIGHT" };                  // first tosses
    if (t < 16) return { catch:1,  status:"CAUGHT" };                     // caught, tossed back
    if (t < 20) return { miss:1,   status:"MISSED" };                     // Athena deflects it
    if (t < 26) return { splash:1, status:"SPLASH" };                     // into deep water
    return { attention:1, status:"ALERT" };                              // the cry goes up
  },
  // the maids: treading clothes -> ring at play -> startled at the miss
  _maidsState(t){
    if (t < 6)  return { formation:"work-line",   scatter:0, attention:0.35, status:"AT WORK" };
    if (t < 18) return { formation:"ball-ring",    scatter:0, attention:0.2,  status:"PLAYING" };
    return { formation:"work-line", scatter:0, attention:1.0, reaction:smooth((t-18)/4), status:"STARTLED" };
  },
  // Odysseus's face flags, matched to the pose the timeline has selected
  _sleepFlags(pose, t){
    if (pose==="listening") return { blink:0,  browUp:.5,  browKnit:.14, eyeWide:.4,  jaw:.10 };
    if (pose==="stirring")  return { blink:.55,browUp:.12, browKnit:.18, eyeNarrow:.4,jaw:.04 };
    return { blink:1, browUp:.05, jaw:.06, smile:0 };
  },

  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let extra = { t };

      if (c.instance === "pools_01"){
        // the full navigable set (drop the loose mule-tuft layer once play begins
        // so the meadow reads clean under the ring of girls)
        const layers = t < 6
          ? ["sky","forest","hollow","river","beach","mule","picnic","court","channel","pools"]
          : ["sky","forest","hollow","river","beach","picnic","court","channel","pools"];
        extra = { layers };
      } else if (c.instance === "odysseus_01"){
        const pose = s.pose || "curl_deep";
        // stateAt stores the node name for pose; map node -> figure pose
        const figPose = pose==="listening" ? "curl_listen"
                       : pose==="stirring"  ? "curl_stir" : "curl_deep";
        extra = { t, pose:figPose, gaze:s.gaze, ...scene._sleepFlags(pose, t) };
      } else if (c.instance === "maids_01"){
        extra = { t, ...scene._maidsState(t) };
      } else if (c.instance === "ball_01"){
        extra = { t, throw:0, catch:0, miss:0, splash:0, retrieve:0, attention:0, ...scene._ballState(t) };
      } else { // nausicaa — a principal figure
        const speaking = t>=0.5 && t<6;   // calling out her instructions
        extra = { t, gaze:s.gaze, mouth: speaking ? 0.6 : 0.1 };
      }

      const mod = { pools_01:pools, odysseus_01:odysseus, maids_01:maids,
                    nausicaa_01:nausicaa, ball_01:ball }[c.instance];

      placeInstance(offctx, W, H, mod, {
        anchor:c.anchor, scale:c.scale,
        state:{ pose:s.pose, band:s.band, ...extra },
      });
    }
  },
};
export default scene;
