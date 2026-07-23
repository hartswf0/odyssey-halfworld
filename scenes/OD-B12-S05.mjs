/* ============================================================
   SCENE  OD-B12-S05 — The Island of the Sun
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The exhausted crew sees the cattle and sheep of Helios on Thrinacia.
     2. Odysseus orders them to sail past, but Eurylochus accuses him of
        mercilessness.
     3. The men swear to touch no livestock and land for one night.
     4. A month of storm winds traps them while stores diminish.
     5. Odysseus repeatedly reminds them of the oath.

   Stage layout (back -> front, one master clock):
     THRINACIA fills the whole field — the sunlit island: bright sacred
     pastures split into separate cattle and sheep grazing zones, a stone
     prayer place on the central rise, the landing cove and beach camp below,
     the storm-blocked sea beyond. The world every body is set into.
       -> HELIOS'S CATTLE AND SHEEP grazing the sacred pasture band mid-stage,
          the immortal radiant herds under their sun-glow — heads UP and
          watching as the crew arrives (beat 1), then heads down grazing once
          the sparing oath is sworn (beat 3).
       -> the MONTH-LONG CONTRARY WINDS as an onshore curtain driving down the
          sky over the sea, with the dwindling PROVISION JAR marking the stores
          sinking day by day — the storm that pens them ashore (beat 4). Low and
          calm early, a hard-driving field with a near-spent jar by the end.
       -> EURYLOCHUS at the left foreground, the wary second — first watching,
          then flinging up his refusal, accusing Odysseus of mercilessness
          (beat 2), then head bowed into the sworn argument (beat 3).
       -> ODYSSEUS at the right foreground — ordering the crew to sail past
          (beat 2), accepting the oath (beat 3), and standing over the trapped,
          starving month to remind them again and again of the oath (beat 5).
   Island, herds, contrary winds, the accuser and the king — one clock, one
   still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import thrinacia from "../assets/location/thrinacia.mjs";
import herds from "../assets/creature/helioss-cattle-and-sheep.mjs";
import winds from "../assets/environment/month-long-contrary-winds.mjs";
import eurylochus from "../assets/character/eurylochus.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B12-S05",
  title:"The Island of the Sun",
  book:1,
  beats:[
    "The exhausted crew sees the cattle and sheep of Helios on Thrinacia.",
    "Odysseus orders them to sail past, but Eurylochus accuses him of mercilessness.",
    "The men swear to touch no livestock and land for one night.",
    "A month of storm winds traps them while stores diminish.",
    "Odysseus repeatedly reminds them of the oath.",
  ],
  exitState:"Odysseus repeatedly reminds them of the oath.",
  duration:34,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // THRINACIA — the whole sunlit island: sacred pastures, cattle & sheep
    // grazing zones, prayer place, landing cove, beach camp, storm-blocked sea.
    // The world every body below is staged into.
    { asset:"location.thrinacia", instance:"thrinacia_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // HELIOS'S CATTLE AND SHEEP — the immortal radiant herds grazing the sacred
    // pasture band mid-stage. Heads up, watching, as the crew arrives; heads
    // down once the oath to spare them is sworn.
    { asset:"creature.helioss-cattle-and-sheep", instance:"herds_01",
      anchor:{x:.50,y:.64}, scale:.60, pose:"observe" },

    // MONTH-LONG CONTRARY WINDS — the onshore storm curtain driving down the
    // sky over the sea, with the dwindling provision jar. Calm early; a hard,
    // near-spent siege by the close of the month.
    { asset:"environment.month-long-contrary-winds", instance:"winds_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // EURYLOCHUS — the wary second at the left foreground: watching, then the
    // refusal flung up accusing Odysseus of mercilessness, then head bowed into
    // the sworn argument.
    { asset:"character.eurylochus", instance:"eurylochus_01",
      anchor:{x:.28,y:1.00}, scale:.50, pose:"guarded_withdrawal", band:"threeq",
      gaze:{x:.30,y:.02} },

    // ODYSSEUS — the king at the right foreground: ordering the crew past,
    // accepting the oath, and standing over the trapped month to remind them of
    // it again and again.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.72,y:1.00}, scale:.52, pose:"three_quarter_left", band:"threeq",
      gaze:{x:-.30,y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the exhausted crew sees the cattle and sheep — the herds watch
    // (heads up); Odysseus and Eurylochus both take in the sacred pasture
    { op:"actor.gaze", target:"odysseus_01",   at:0.0,  args:{ gaze:{x:-.30,y:.02} } },
    { op:"actor.gaze", target:"eurylochus_01", at:0.0,  args:{ gaze:{x:.30,y:.02} } },
    // beat 2: Odysseus orders them to sail PAST — arms thrown open, commanding;
    // Eurylochus flings up his refusal, accusing him of mercilessness
    { op:"actor.pose", target:"odysseus_01",   at:3.0,  args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus_01",   at:3.0,  args:{ gaze:{x:.10,y:-.04} } },
    { op:"actor.pose", target:"eurylochus_01", at:6.0,  args:{ pose:"dissenter_resist" } },
    { op:"actor.gaze", target:"eurylochus_01", at:6.0,  args:{ gaze:{x:.34,y:-.04} } },
    // beat 3: the men swear to touch no livestock and land one night — the oath;
    // Eurylochus bows into the sworn argument, Odysseus takes the promise
    { op:"actor.pose", target:"eurylochus_01", at:12.0, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"eurylochus_01", at:12.0, args:{ gaze:{x:.06,y:.28} } },
    { op:"actor.pose", target:"odysseus_01",   at:13.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01",   at:13.0, args:{ gaze:{x:-.20,y:.04} } },
    // beat 4: a month of storm winds traps them while stores diminish — the
    // contrary field rises and the jar drains (driven by t in stage)
    { op:"fx.play",    target:"winds_01",      at:18.0, args:{} },
    // beat 5 (exit): Odysseus, over the trapped starving month, reminds them of
    // the oath again and again — arms open, gaze turned back on the crew
    { op:"actor.pose", target:"odysseus_01",   at:28.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus_01",   at:28.0, args:{ gaze:{x:-.24,y:.02} } },
    { op:"timeline.capture", target:"OD-B12-S05", at:33.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the sunlit island, the sacred herds, the contrary-wind field,
     Eurylochus, then Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "thrinacia_01"){
        mod = thrinacia;
        // the whole sunlit island; the far sea broods harder once the month-long
        // storm sets in (beat 4)
        const storm = t < 18 ? 0.38 : 0.38 + 0.60 * Math.min(1, (t - 18) / 12);
        state = { layers:["sky","sun","storm-sea","island","pastures",
                           "cattle-zone","sheep-zone","prayer","cove","camp"],
                  storm, status:"SUNLIT", progress:.18 };

      } else if (c.instance === "herds_01"){
        mod = herds;
        // heads UP and watching as the crew arrives; heads down grazing once the
        // sparing oath is sworn (beat 3, ~t 12)
        const grazing = t >= 12;
        state = { pose: grazing ? "graze" : "observe", t,
                  status:"IMMORTAL", progress:.28 };

      } else if (c.instance === "winds_01"){
        mod = winds;
        // the onshore curtain + the dwindling provision jar. Calm early; the
        // storm sets in at beat 4 (fx.play 18.0) and wears the month down — the
        // field drives harder and the stores sink toward spent.
        const ft = (s.fxT != null) ? s.fxT : Math.max(0, t - 18);
        let inten, phase;
        if (t < 18){ inten = 0.55; phase = 0.06 + 0.10 * (t / 18); }   // before: light airs, stores full
        else       { const p = Math.min(1, (t - 18) / 14);
                     inten = 0.85 + 0.45 * p; phase = 0.16 + 0.74 * p; } // month wears on, jar drains
        state = { t, intensity:inten, phase,
                  layers:["winds","provisions"],
                  status: t < 18 ? "CALM" : "CONTRARY",
                  progress: Math.min(0.96, 0.10 + 0.86 * (t / 34)) };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale. Emotion channels ride on the pose so each reads.
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };

        if (c.instance === "eurylochus_01"){
          mod = eurylochus;
          // the wary second: guarded watching -> the cornered refusal accusing
          // Odysseus of mercilessness -> head bowed into the stubborn oath-argument
          const accusing = t >= 6 && t < 12;
          const arguing  = t >= 12;
          state.browKnit  = accusing ? .50 : arguing ? .50 : .34;
          state.browUp    = accusing ? .68 : .06;
          state.eyeWide   = accusing ? .40 : 0;
          state.eyeNarrow = accusing ? 0  : arguing ? .24 : .30;
          state.frown     = accusing ? .55 : arguing ? .40 : .16;
          state.jaw       = accusing ? .34 : 0;
          state.mouthAsym = arguing ? .20 : .18;

        } else { // odysseus_01 — command, then acceptance, then the reminded oath
          mod = odysseus;
          const commanding = t >= 3 && t < 13;      // ordering them to sail past
          const accepting  = t >= 13 && t < 28;     // taking the oath
          const reminding  = t >= 28;               // reminding them again and again
          state.browUp   = commanding ? .34 : reminding ? .30 : .10;
          state.browKnit = reminding ? .18 : .06;
          state.jaw      = (commanding || reminding) ? .5 : 0;
          state.eyeWide  = commanding ? .18 : 0;
          state.smile    = accepting ? .30 : .12;
          state.mouthAsym= accepting ? .40 : 0;
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
