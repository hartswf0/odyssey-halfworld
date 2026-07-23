/* ============================================================
   SCENE  OD-B13-S04 — The Treasure Is Hidden
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Athena helps Odysseus carry the gifts into the cave of the nymphs.
     2. She seals the cave entrance with a stone and sits with him beneath the
        olive tree.
     3. They count the suitors and devise a concealment strategy.
     4. Athena tells him to go first to Eumaeus while she retrieves Telemachus
        from Sparta.

   Stage layout (back -> front, read as the causal sweep on one clock):
     BACKDROP — the NYMPH CAVE interior: sacred dual-mouthed cavern with its
                treasure-cache alcove, jar rows, stone weaving-benches and the
                sealable north door-stone slot. The room the gifts are stowed in.
     LEFT     — the great CAVE-SEALING STONE, the divinely-movable round plug:
                it shows the LOADED mouth (stowed tripods, cauldrons and jars)
                early, then rolls across to SEAL and later HIDE the cache.
     RIGHT    — the SUITOR-COUNT PLAN, the top-down palace chart they pore over
                beneath the olive tree: the counted block of suitors, the loyalist
                muster at the hall door, the locked arms and the approach routes.
     FRONT    — ODYSSEUS caching the gifts and ATHENA beside him, counsel-close:
                helping carry, then seated planning, then parting as she points
                him to Eumaeus and turns for Sparta and Telemachus.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import cave from "../assets/location/nymph-cave.mjs";
import stone from "../assets/prop/cave-sealing-stone.mjs";
import plan from "../assets/set_piece/suitor-count-plan.mjs";
import odysseus from "../assets/character/odysseus.mjs";
import athena from "../assets/character/athena.mjs";

export const scene = {
  id:"OD-B13-S04",
  title:"The Treasure Is Hidden",
  book:1,
  beats:[
    "Athena helps Odysseus carry the gifts into the cave of the nymphs.",
    "She seals the cave entrance with a stone and sits with him beneath the olive tree.",
    "They count the suitors and devise a concealment strategy.",
    "Athena tells him to go first to Eumaeus while she retrieves Telemachus from Sparta.",
  ],
  exitState:"Athena tells him to go first to Eumaeus while she retrieves Telemachus from Sparta.",
  duration:38,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // NYMPH CAVE — the whole backdrop: the sacred cavern where the Phaeacian
    // gifts are stowed, with its cache alcove, jars, benches and sealable mouth.
    { asset:"location.nymph-cave", instance:"cave_01",
      anchor:{x:.50, y:1.00}, scale:1.00 },

    // CAVE-SEALING STONE — left: the giant round door-stone. Shows the loaded
    // mouth early, then rolls across to seal and hide the cache. Sized as a
    // mid-ground vignette of the very act of sealing.
    { asset:"prop.cave-sealing-stone", instance:"stone_01",
      anchor:{x:.155, y:1.00}, scale:.44 },

    // SUITOR-COUNT PLAN — right: the top-down palace chart they study beneath
    // the olive tree — the counted suitor block, loyalist muster, locked arms
    // and the approach routes of the concealment strategy.
    { asset:"set-piece.suitor-count-plan", instance:"plan_01",
      anchor:{x:.83, y:.985}, scale:.40 },

    // ODYSSEUS — foreground centre-left: caching the gifts, then seated in
    // counsel, then turning to stride off toward Eumaeus.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.40, y:.99}, scale:.42, pose:"offering_hand", band:"threeq",
      gaze:{x:-.20,y:.24} },

    // ATHENA — foreground centre: helping carry, sealing the mouth, planning
    // at his side, then pointing him on and departing for Sparta.
    { asset:"character.athena", instance:"athena_01",
      anchor:{x:.575, y:.99}, scale:.44, pose:"athena_resolute", band:"threeq",
      gaze:{x:-.24,y:.10} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1 (0-9): both carry the gifts in and stow them — Odysseus reaches
    // into the cache, Athena at his side, the stone still rolled aside (loaded).
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.20,y:.24} } },
    { op:"actor.pose", target:"athena_01",   at:0.0,  args:{ pose:"athena_resolute" } },

    // beat 2 (9-18): Athena seals the mouth with the stone and they settle
    // beneath the olive tree — she gestures the seal shut.
    { op:"actor.pose", target:"athena_01",   at:9.0,  args:{ pose:"athena_speak" } },
    { op:"actor.gaze", target:"athena_01",   at:9.0,  args:{ gaze:{x:-.42,y:.06} } },
    { op:"actor.pose", target:"odysseus_01", at:9.0,  args:{ pose:"three_quarter_left" } },

    // beat 3 (18-28): they count the suitors and devise the concealment plan —
    // Athena points across the chart, Odysseus studies it.
    { op:"actor.pose", target:"athena_01",   at:18.0, args:{ pose:"athena_strategist" } },
    { op:"actor.gaze", target:"athena_01",   at:18.0, args:{ gaze:{x:.46,y:.10} } },
    { op:"actor.pose", target:"odysseus_01", at:18.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus_01", at:18.0, args:{ gaze:{x:.40,y:.12} } },

    // beat 4 / exit (28-38): Athena commands him on to Eumaeus and turns for
    // Sparta and Telemachus; Odysseus rises to stride off.
    { op:"actor.pose", target:"athena_01",   at:28.0, args:{ pose:"athena_command" } },
    { op:"actor.gaze", target:"athena_01",   at:28.0, args:{ gaze:{x:.30,y:0} } },
    { op:"actor.pose", target:"odysseus_01", at:28.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:28.0, args:{ gaze:{x:.34,y:.02} } },
    { op:"timeline.capture", target:"OD-B13-S04", at:37.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the cavern backdrop, the sealing stone, the tactical chart,
     then Odysseus and Athena in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "cave_01"){
        mod = cave;
        // the cavern opens to receive the gifts, then is sealed behind them.
        const sealed = t >= 9;
        state = sealed
          ? { layers:["cavern","backwall","recesses","thresholds","doorstone","jars","benches","cache","floor"],
              sealed:true,  status:"SEALED", progress: Math.min(.96, .4 + .5*(t/38)) }
          : { layers:["cavern","backwall","recesses","thresholds","doorstone-open","jars","benches","cache","floor"],
              sealed:false, status:"OPENED", progress:.3 };

      } else if (c.instance === "stone_01"){
        mod = stone;
        // the great plug: rolled aside with the loaded mouth on show while they
        // carry the gifts in, then rolled across to seal, then hidden under brush.
        const mode = t < 9  ? "loaded"
                   : t < 28 ? "sealed"
                   :          "hidden";
        state = { t, mode, status:mode.toUpperCase(),
                  progress: Math.min(.98, .3 + .6*(t/38)) };

      } else if (c.instance === "plan_01"){
        mod = plan;
        // the tactical projection sharpens as counsel proceeds: surveyed, then
        // the routes lit for the concealment plan, then the committed strike.
        const focus = t < 18 ? "all" : t < 28 ? "routes" : "strike";
        const status = focus==="all" ? "COUNTED" : focus==="routes" ? "ROUTED" : "STRIKE";
        state = { t,
                  layers:["floor","rooms","walls","suitors","cache","loyalists","routes","labels"],
                  focus, status, progress: Math.min(.94, .4 + .5*(t/38)) };

      } else if (c.instance === "odysseus_01"){
        mod = odysseus;
        const parting = t >= 28;
        const planning = t >= 18 && t < 28;
        state = { t: parting ? t : 0.5, band:c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze,
                  // intent while caching/planning; set jaw as he turns to go
                  browUp: planning ? .24 : .12,
                  browKnit: parting ? .26 : .14,
                  eyeNarrow: planning ? .18 : .08,
                  smile: .08 };

      } else { // athena_01 — bright-eyed counsel at his side
        mod = athena;
        const departing = t >= 28;
        state = { t: departing ? t : 0.45, band:c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze,
                  browUp:.3, eyeWide:.3, smile:.12 };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
