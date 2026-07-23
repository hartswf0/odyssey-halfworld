/* ============================================================
   SCENE  OD-B04-S07 — The Suitors Prepare an Ambush
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. In Ithaca, Noemon asks Antinous when Telemachus will return his ship.
     2. The suitors discover that the voyage truly occurred without their knowledge.
     3. Antinous selects a crew and sails to the strait between Ithaca and Same
        to ambush the prince.
     4. Medon overhears and tells Penelope; she collapses in fear.
     5. Athena sends a phantom in the shape of Iphthime to reassure the sleeping
        queen.

   Stage layout (a split tableau, back -> front):
     the suitor ambush crew lying in wait at the strait (their own sky/channel/
     ship set, upper-left region) — Antinous's chosen ambush party
       -> the sleeping-chamber apparition (its own dark chamber + door-crack of
          light, lower-right region) where the Iphthime phantom stands
       -> Penelope collapsed in fear before the chamber (foreground right)
       -> Medon mid-stage, the herald who overheard, thrown into the warning
       -> Antinous foreground-left, commanding the ambush crew he has selected.
   Ithaca (the palace / chamber) and the strait (the ambush) held on one clock:
   the plot laid at sea on the left, its consequence and the divine comfort in
   the queen's chamber on the right.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import ambushCrew from "../assets/ensemble/suitor-ambush-crew.mjs";
import phantom    from "../assets/divine_fx/athena-as-iphthime-phantom.mjs";
import penelope   from "../assets/character/penelope.mjs";
import medon      from "../assets/character/medon.mjs";
import antinous   from "../assets/character/antinous.mjs";

export const scene = {
  id:"OD-B04-S07",
  title:"The Suitors Prepare an Ambush",
  book:1,
  beats:[
    "In Ithaca, Noemon asks Antinous when Telemachus will return his ship.",
    "The suitors discover that the voyage truly occurred without their knowledge.",
    "Antinous selects a crew and sails to the strait between Ithaca and Same to ambush the prince.",
    "Medon overhears and tells Penelope; she collapses in fear.",
    "Athena sends a phantom in the shape of Iphthime to reassure the sleeping queen.",
  ],
  exitState:"Athena sends a phantom in the shape of Iphthime to reassure the sleeping queen.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // beat 3: the chosen crew lying in wait at the strait — its own sea set
    // (sky, channel between Ithaca and Same, the black ship, the manned banks)
    { asset:"ensemble.suitor-ambush-crew", instance:"ambush_crew_01",
      anchor:{x:.30,y:.66}, scale:.62, pose:"ambush" },

    // beat 5 (exit): the dark sleeping-chamber + the door-crack of light the
    // Iphthime dream-double is born from — its own set, lower-right
    { asset:"divine_fx.athena-as-iphthime-phantom", instance:"iphthime_phantom_01",
      anchor:{x:.76,y:1.00}, scale:.64, pose:"speaking" },

    // beat 4: Penelope collapsed in fear before the chamber (the sleeping queen)
    { asset:"character.penelope", instance:"penelope_01",
      anchor:{x:.63,y:.99}, scale:.35, pose:"grieving",
      gaze:{x:.02,y:.42}, band:"front" },

    // beat 4: Medon the herald, who overheard the plot, thrown into the warning
    { asset:"character.medon", instance:"medon_01",
      anchor:{x:.45,y:.95}, scale:.33, pose:"urgent_warning",
      gaze:{x:.30,y:.02}, band:"threeq" },

    // beat 3: Antinous, ringleader, commanding the ambush crew he has chosen
    { asset:"character.antinous", instance:"antinous_01",
      anchor:{x:.15,y:.99}, scale:.38, pose:"commanding_stance",
      gaze:{x:.22,y:-.10}, band:"threeq" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Noemon's question lands on Antinous — he speaks
    { op:"actor.pose", target:"antinous_01",  at:3.0,  args:{ pose:"speaking" } },
    // beat 2: the voyage confirmed — Antinous rounds on the news, accusing
    { op:"actor.pose", target:"antinous_01",  at:8.0,  args:{ pose:"accusing" } },
    { op:"actor.gaze", target:"antinous_01",  at:8.0,  args:{ gaze:{x:-.30,y:.02} } },
    // beat 3: he takes command and puts a crew to the strait; they go to stations
    { op:"actor.pose", target:"antinous_01",  at:14.0, args:{ pose:"commanding_stance" } },
    { op:"actor.gaze", target:"antinous_01",  at:14.0, args:{ gaze:{x:.24,y:-.10} } },
    { op:"actor.pose", target:"ambush_crew_01", at:15.0, args:{ pose:"boarding-line" } },
    { op:"actor.pose", target:"ambush_crew_01", at:22.0, args:{ pose:"ambush" } },
    // beat 4: Medon overhears and discloses; then the alarm; Penelope collapses
    { op:"actor.pose", target:"medon_01",     at:24.0, args:{ pose:"disclosing" } },
    { op:"actor.pose", target:"medon_01",     at:28.0, args:{ pose:"urgent_warning" } },
    { op:"actor.pose", target:"penelope_01",  at:30.0, args:{ pose:"mourning" } },
    { op:"actor.gaze", target:"penelope_01",  at:30.0, args:{ gaze:{x:0,y:.5} } },
    // beat 5 (exit): Athena's phantom fills the chamber and reassures the queen
    { op:"fx.play",    target:"iphthime_phantom_01", at:36.0, args:{} },
    { op:"actor.pose", target:"penelope_01",  at:41.0, args:{ pose:"astonished" } },
    { op:"timeline.capture", target:"OD-B04-S07", at:43.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the strait ambush set, the chamber apparition, then the
     queen, the herald, and Antinous in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the Iphthime phantom holds in her standing / speaking band so the divine
    // comfort reads clearly in the tableau (a gentle clock shimmer, never gone)
    const phT = 0.44 + 0.05*Math.sin(t*0.4);
    // subtle shared water/idle motion for the ambush set
    const seaT = t * 0.5;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "ambush_crew_01"){
        mod = ambushCrew;
        const formation = s.pose || "ambush";
        state = { formation, attention:0.7, spread:1.0, density:1.0, ready:0.0, t:seaT };
      } else if (c.instance === "iphthime_phantom_01"){
        mod = phantom;
        state = { t:clamp01(phT), intensity:1.0, glow:1.0,
                  layers:["chamber","door","wedge","phantom","speech","motes"] };
      } else {
        // the three figures: fold pose/gaze/band from the timeline; let
        // placeInstance own the anchor/scale
        mod = c.instance === "penelope_01" ? penelope
            : c.instance === "medon_01"    ? medon
            : antinous;
        state = { t:0.5, band:c.band, gaze:c.gaze, pose:c.pose, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
