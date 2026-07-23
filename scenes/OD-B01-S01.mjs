/* OD-B01-S01 — The Gods Consider Odysseus
   A thin Halfworld COMPOSITION module. It places existing assets on one master
   clock; it does not redraw any of them. The engine runs a single dotify + card
   pass over the whole stage, so every instance shares one halftone.

   Beats (causal order):
     1. The Olympian gods assemble while Poseidon is absent among the Ethiopians.
     2. Zeus recalls Aegisthus — mortals enlarge the suffering they blame on gods.
     3. Athena redirects the council toward Odysseus, captive on Calypso's island.
     4. Zeus names Poseidon's anger as the obstacle and permits Odysseus's return.

   Staging: the council hall frames the space (its own central throne omitted so
   the vacant charged seat can hold center). The seated ASSEMBLY sits behind and
   above; POSEIDON'S ABSENCE stands dead center as the empty, trident-marked
   throne the council regards; ZEUS speaks from foreground-left, ATHENA answers
   from foreground-right. The assembly's collective attention sweeps from Zeus to
   Athena on the master clock (beat 2 -> beat 3). */

import hall     from "/assets/location/olympian-council-hall.mjs";
import zeus     from "/assets/character/zeus.mjs";
import athena   from "/assets/character/athena.mjs";
import assembly from "/assets/ensemble/assembly-of-gods.mjs";
import absence  from "/assets/divine_fx/poseidons-absence.mjs";

import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

const clamp01 = x => x<0?0:(x>1?1:x);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

export const scene = {
  id:"OD-B01-S01",
  title:"The Gods Consider Odysseus",
  book:1,

  beats:[
    "The Olympian gods assemble while Poseidon is absent among the Ethiopians.",
    "Zeus recalls Aegisthus and argues that mortals enlarge the suffering they blame on gods.",
    "Athena redirects the council toward Odysseus, captive on Calypso's island.",
    "Zeus names Poseidon's anger as the obstacle and permits a plan for Odysseus's return.",
  ],
  exitState:"Zeus names Poseidon's anger as the obstacle and permits a plan for Odysseus's return.",
  duration:40,

  cast:[
    // back -> front
    { asset:"location.olympian-council-hall", instance:"hall_01",     anchor:{x:.50,y:1.00}, scale:1.00, pose:"assembled" },
    { asset:"ensemble.assembly-of-gods",      instance:"assembly_01", anchor:{x:.50,y:.56},  scale:.64,  pose:"attending-zeus" },
    { asset:"divine_fx.poseidons-absence",    instance:"absence_01",  anchor:{x:.50,y:.90},  scale:.50,  pose:"charged" },
    { asset:"character.zeus",                 instance:"zeus_01",     anchor:{x:.28,y:.99},  scale:.60,  pose:"lean_forward", gaze:{x:.30,y:.06} },
    { asset:"character.athena",               instance:"athena_01",   anchor:{x:.72,y:.99},  scale:.58,  pose:"neutral",      gaze:{x:-.40,y:0} },
  ],

  timeline:[
    // beat 1 — the council is assembled; the absent sea-god's place charges
    { op:"fx.play",    target:"absence_01", at:0.5, args:{} },
    // beat 2 — Zeus speaks (recalls Aegisthus), assembly rapt on him
    { op:"actor.pose", target:"zeus_01",    at:2.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"zeus_01",    at:2.0, args:{ gaze:{x:.25,y:.05} } },
    // beat 3 — Athena redirects toward Odysseus; the council turns to her
    { op:"actor.pose", target:"athena_01",  at:5.0, args:{ pose:"point" } },
    { op:"actor.gaze", target:"athena_01",  at:5.0, args:{ gaze:{x:-.40,y:0} } },
    { op:"actor.pose", target:"zeus_01",    at:6.0, args:{ pose:"neutral_front" } },
    { op:"actor.gaze", target:"zeus_01",    at:6.0, args:{ gaze:{x:.45,y:.02} } },
    // beat 4 — Zeus names Poseidon's anger and permits the plan
    { op:"actor.pose", target:"zeus_01",    at:12.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"zeus_01",    at:12.0, args:{ gaze:{x:.10,y:0} } },
    { op:"actor.pose", target:"athena_01",  at:12.0, args:{ pose:"command" } },
    { op:"timeline.capture", target:"OD-B01-S01", at:38.0, args:{ label:"EXIT" } },
  ],

  // ---- assembly attention sweep on the master clock (beat 2 -> beat 3) ----
  // attention: 0 = all heads rapt on Zeus (left) .. 1 = all on Athena (right)
  _attentionAt(t){ return smooth((t-3.0)/6.0); },   // begins turning as Athena rises

  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const attention = scene._attentionAt(t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let extra = { t };

      if (c.instance === "assembly_01"){
        // drive the collective turn from the master clock (not a rig pose)
        extra = { t, attention, wave:0.85, formation:"arc", showGaze:true };
      } else if (c.instance === "absence_01"){
        // let the charged empty place breathe/animate on the master clock
        extra = { t, intensity:1.0 };
      } else if (c.instance === "hall_01"){
        // omit the hall's own throne so the vacant charged seat holds center
        extra = { layers:["sky","backwall","portal","columns","floor"] };
      } else {
        // principals: carry pose + gaze from the folded timeline, plus a little
        // speaking motion so the current speaker's mouth reads open
        const speaking = (c.instance === "zeus_01" && t>=2 && t<6) ||
                         (c.instance === "athena_01" && t>=5);
        extra = { t, gaze:s.gaze, mouth: speaking ? (0.6+0.4*Math.sin(t*6)*0) + 0.7 : (c.instance==="zeus_01" ? -0.2 : 0.2) };
      }

      const mod = { hall_01:hall, assembly_01:assembly, absence_01:absence,
                    zeus_01:zeus, athena_01:athena }[c.instance];

      placeInstance(offctx, W, H, mod, {
        anchor:c.anchor, scale:c.scale,
        state:{ pose:s.pose, band:s.band, ...extra },
      });
    }
  },
};
export default scene;
