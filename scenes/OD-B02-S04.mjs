/* ============================================================
   SCENE  OD-B02-S04 — Mentor Rebukes Ithaca
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Telemachus announces a voyage to Pylos and Sparta for news of Odysseus
        (character.telemachus, alert -> command).
     2. Mentor condemns the people for forgetting the king and tolerating the
        suitors (character.mentor, grave -> fury -> pointing finger of blame).
     3. Leocritus boasts that even Odysseus could not defeat the suitors now
        gathered (character.leocritus, appraising -> dismissing -> boasting ->
        mocking laughter).
     4. He dissolves the assembly; citizens disperse and the suitors return to
        the palace (ensemble.dispersing-assembly, gathered -> breaking).

   Stage layout (back -> front):
     assembly ground set  ->  dispersing assembly (back band)  ->
     Telemachus (left) -> Mentor (center, the rebuke) -> Leocritus (right).
   ============================================================ */
import { placeInstance, clamp01, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import ground     from "../assets/location/ithacan-assembly-ground.mjs";
import assembly   from "../assets/ensemble/dispersing-assembly.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import mentor     from "../assets/character/mentor.mjs";
import leocritus  from "../assets/character/leocritus.mjs";

export const scene = {
  id:"OD-B02-S04",
  title:"Mentor Rebukes Ithaca",
  book:1,
  beats:[
    "Telemachus announces a voyage to Pylos and Sparta for news of Odysseus.",
    "Mentor condemns the people for forgetting the king and tolerating the suitors.",
    "Leocritus boasts that even Odysseus could not defeat the suitors now gathered.",
    "He dissolves the assembly; citizens disperse and the suitors return to the palace.",
  ],
  exitState:"He dissolves the assembly; citizens disperse and the suitors return to the palace.",
  duration:20,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the civic ring: sky, hills, palace route, tiers of seats
    { asset:"location.ithacan-assembly-ground", instance:"ground_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"convened" },

    // the assembled people, seated back on the tiers, beginning to loosen
    { asset:"ensemble.dispersing-assembly", instance:"assembly_01",
      anchor:{x:.50,y:.66}, scale:.66, pose:"gathered" },

    // the prince at the speaker's stone, left — announcing his voyage
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.345,y:.905}, scale:.58, pose:"lean_forward",
      gaze:{x:.20,y:-.05}, band:"front" },

    // the aged loyalist, center foreground — the rebuke (THE beat, largest)
    { asset:"character.mentor", instance:"mentor_01",
      anchor:{x:.525,y:.985}, scale:.76, pose:"mentor_grave",
      gaze:{x:-.10,y:.06}, band:"front" },

    // the brash suitor, right — boasting of the numbers, dissolving the assembly
    { asset:"character.leocritus", instance:"leocritus_01",
      anchor:{x:.735,y:.930}, scale:.64, pose:"arms_crossed",
      gaze:{x:-.18,y:.04}, band:"front" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 1 — the prince rises from grief to command, announcing the voyage
    { op:"actor.pose", target:"telemachus_01", at:2.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus_01", at:2.0, args:{ gaze:{x:.28,y:-.05} } },
    // beat 2 — Mentor's moral fury, then the leveled finger of blame
    { op:"actor.pose", target:"mentor_01",     at:3.0, args:{ pose:"mentor_fury" } },
    { op:"actor.gaze", target:"mentor_01",     at:3.0, args:{ gaze:{x:-.22,y:-.06} } },
    { op:"actor.pose", target:"mentor_01",     at:5.0, args:{ pose:"mentor_pointing" } },
    { op:"actor.gaze", target:"mentor_01",     at:5.0, args:{ gaze:{x:-.42,y:.02} } },
    // beat 3 — Leocritus dismisses, then boasts, then mocks with open laughter
    { op:"actor.pose", target:"leocritus_01",  at:4.0, args:{ pose:"shrug" } },
    { op:"actor.gaze", target:"leocritus_01",  at:4.0, args:{ gaze:{x:-.24,y:.02} } },
    { op:"actor.pose", target:"leocritus_01",  at:6.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"leocritus_01",  at:6.0, args:{ gaze:{x:-.42,y:-.02} } },
    { op:"actor.pose", target:"leocritus_01",  at:8.0, args:{ pose:"laughter" } },
    { op:"actor.gaze", target:"leocritus_01",  at:8.0, args:{ gaze:{x:.06,y:-.06} } },
    // beat 4 — the assembly is dissolved; the crowd breaks toward the exits
    { op:"timeline.capture", target:"OD-B02-S04", at:19.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // expressive overlay per rig pose — the smile/jaw/brow channels the pose id
    // alone doesn't carry (mirrors each asset's own state-node preview).
    const OVERLAY = {
      // telemachus
      lean_forward:  { mouth:-.15, blink:0 },
      confrontation: { mouth:-.28, blink:0 },
      // leocritus
      arms_crossed:  { smile:.14, mouthAsym:.40, browUp:.30, eyeNarrow:.36 },
      shrug:         { smile:.40, mouthAsym:.66, browUp:.60, eyeNarrow:.26, jaw:.14 },
      pointing_arm:  { smile:.60, jaw:.50, browUp:.42, eyeWide:.16, mouthAsym:.30 },
      laughter:      { smile:1, jaw:.72, eyeNarrow:.60, browUp:.20 },
    };

    // beat 4: the seated body loosens and the streams begin to pull for the
    // exits (dissolution driven off the master clock, deterministic).
    const dispProg = clamp01((t - 5) / 8);
    const assemblyState = {
      formation: dispProg > 0.02 ? "streams" : "cluster",
      disperse:  lerp(0.06, 0.62, dispProg),
      spread:    1.0,
      wave:      lerp(0.45, 0.95, dispProg),
      seed:      2049,
    };

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "ground_01"){
        mod = ground;
        state = {};                          // preview() layers — the convened ring
      } else if (c.instance === "assembly_01"){
        mod = assembly;
        state = assemblyState;
      } else {
        mod = c.instance === "telemachus_01" ? telemachus
            : c.instance === "mentor_01"     ? mentor
            : leocritus;
        state = { ...(OVERLAY[s.pose] || {}), ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
