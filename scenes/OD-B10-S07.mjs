/* ============================================================
   SCENE  OD-B10-S07 — The Men Restored
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Circe leads Odysseus to the pigsties and applies a second drug.
     2. The swine regain human form, younger and more handsome than before.
     3. They recognize Odysseus and embrace him in tears; even Circe is moved.
     4. Odysseus retrieves the remaining crew, though Eurylochus warns against returning.
     5. The men live in Circe's halls for a year until they demand the journey resume.

   Stage layout (back -> front, one master clock):
     CIRCE'S FOREST PALACE, full bleed, as the setting — the enchanted house,
     the animal yard and the emptying pig-pens at the left where the counter-
     transformation is worked.
       -> the ONE-YEAR FEAST CYCLE revolves high over the hall at the right: the
          seasons wheeling, the feast/rest/clothing stations struck spent as the
          phase pointer sweeps, an impatience band accruing toward the year's end
          (beat 5, held above the whole still).
       -> the RESTORED CREW spans the mid-ground as a restoration line: swine at
          the pen end, renewed men at the hall end, the change running across them
          as they come upright, younger and handsomer, arms lifting toward Odysseus.
       -> CIRCE at the left, over the pens, presiding with the wand as she works
          the second drug — moved by the reunion (beat 1, beat 3).
       -> ODYSSEUS at the centre foreground, arms opened to the men who recognize
          and embrace him in tears (beats 2-3).
       -> EURYLOCHUS at the right foreground, wary hand thrown up — warning against
          returning to the halls even as the others are led back (beat 4).
   The second drug, the men made new, the weeping embrace, Eurylochus's warning
   and the year that follows — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";
import { clamp01 } from "../engine/halfworld-engine.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace from "../assets/location/circes-forest-palace.mjs";
import feastCycle from "../assets/environment/one-year-feast-cycle.mjs";
import restoredCrew from "../assets/ensemble/restored-crew.mjs";
import circe from "../assets/character/circe.mjs";
import odysseus from "../assets/character/odysseus.mjs";
import eurylochus from "../assets/character/eurylochus.mjs";

export const scene = {
  id:"OD-B10-S07",
  title:"The Men Restored",
  book:1,
  beats:[
    "Circe leads Odysseus to the pigsties and applies a second drug.",
    "The swine regain human form, younger and more handsome than before.",
    "They recognize Odysseus and embrace him in tears; even Circe is moved.",
    "Odysseus retrieves the remaining crew, though Eurylochus warns against returning.",
    "The men live in Circe's halls for a year until they demand the journey resume.",
  ],
  exitState:"The men live in Circe's halls for a year until they demand the journey resume.",
  duration:52,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // CIRCE'S FOREST PALACE — full-bleed setting: enchanted house, animal yard,
    // and the pig-pens at the left where the counter-drug is worked
    { asset:"location.circes-forest-palace", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // ONE-YEAR FEAST CYCLE — the revolving year high over the hall at the right:
    // seasons wheeling, feast stations struck spent, impatience mounting (beat 5)
    { asset:"environment.one-year-feast-cycle", instance:"year_01",
      anchor:{x:.74,y:.52}, scale:.50 },

    // RESTORED CREW — the restoration line across the mid-ground: swine at the pen
    // end, renewed men at the hall end, the change running across (beats 2-3)
    { asset:"ensemble.restored-crew", instance:"crew_01",
      anchor:{x:.50,y:.99}, scale:.62 },

    // CIRCE — at the left over the pens, presiding with the wand as she applies the
    // second drug, moved by the reunion (beats 1, 3)
    { asset:"character.circe", instance:"circe_01",
      anchor:{x:.16,y:1.00}, scale:.44, pose:"circe_restore", band:"threeq",
      gaze:{x:-.08,y:.02}, wandHand:"R", wandLen:.24 },

    // ODYSSEUS — centre foreground, arms opened to the men who recognize and
    // embrace him in tears (beats 2-3)
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.50,y:1.00}, scale:.42, pose:"torso_open", band:"front",
      gaze:{x:-.18,y:.04} },

    // EURYLOCHUS — right foreground, wary hand thrown up, warning against
    // returning to the halls even as the men are led back (beat 4)
    { asset:"character.eurylochus", instance:"eurylochus_01",
      anchor:{x:.86,y:1.00}, scale:.40, pose:"wary_warning", band:"threeq",
      gaze:{x:-.30,y:.04} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Circe leads Odysseus to the sties and applies the second drug —
    // she presides with the wand, working the counter-transformation
    { op:"actor.pose", target:"circe_01",      at:0.0,  args:{ pose:"circe_restore" } },
    { op:"actor.gaze", target:"circe_01",      at:0.0,  args:{ gaze:{x:-.10,y:.03} } },
    // beat 2-3: the swine regain human form and embrace Odysseus in tears — his
    // arms open, turned to the men coming upright along the line
    { op:"actor.pose", target:"odysseus_01",   at:2.0,  args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus_01",   at:2.0,  args:{ gaze:{x:-.18,y:.04} } },
    { op:"fx.play",    target:"crew_01",       at:2.0,  args:{} },
    // beat 3: even Circe is moved — softened gaze toward the reunion
    { op:"actor.gaze", target:"circe_01",      at:8.0,  args:{ gaze:{x:.02,y:.02} } },
    // beat 4: Odysseus retrieves the remaining crew; Eurylochus warns against it,
    // then hardens into resisting the return to the halls
    { op:"actor.pose", target:"eurylochus_01", at:16.0, args:{ pose:"wary_warning" } },
    { op:"actor.pose", target:"eurylochus_01", at:30.0, args:{ pose:"dissenter_resist" } },
    // beat 5 (exit): a year in Circe's halls — the feast cycle turns, then the men
    // demand the journey resume; Odysseus turns outward toward the sea
    { op:"actor.gaze", target:"odysseus_01",   at:44.0, args:{ gaze:{x:.30,y:-.04} } },
    { op:"timeline.capture", target:"OD-B10-S07", at:50.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the palace setting, the revolving year over the hall, the
     restoration line of the crew, then Circe, Odysseus and Eurylochus foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const prog = clamp01(t / scene.duration);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "palace_01"){
        mod = palace;
        // the enchanted house, animal yard and pig-pens — the full setting
        state = { layers:["forest","yard","pens","house","transform","clearing"] };

      } else if (c.instance === "year_01"){
        mod = feastCycle;
        // the compressed year turning above the hall: the pointer sweeps with the
        // master clock, stations behind it struck spent, impatience mounting toward
        // the end (the crew's growing demand to resume the journey)
        const phase = clamp01(0.06 + prog * 0.9);
        state = { t, phase, impatience: 0.25 + prog * 1.1,
                  layers:["ring","seasons","vignettes","impatience","pointer"] };

      } else if (c.instance === "crew_01"){
        mod = restoredCrew;
        // the restoration line: the change running from swine (pen end) to renewed
        // man (hall end), arms lifting in joy toward Odysseus. Past the first stretch
        // of the year the line settles into the year-long feast.
        const restore = clamp01(t / 10);
        const feasting = t > 22;
        state = { formation: feasting ? "feast" : "restoration-line",
                  restore, wave: feasting ? 0.05 : 0.55,
                  joy: clamp01((t - 1) / 12), attention: 0.65, density: 1.0 };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns the
        // anchor/scale and merges the asset's own preview() for the rest
        mod = (c.instance === "circe_01") ? circe
            : (c.instance === "odysseus_01") ? odysseus
            : eurylochus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
        if (c.wandHand != null) state.wandHand = c.wandHand;
        if (c.wandLen != null)  state.wandLen  = c.wandLen;
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
