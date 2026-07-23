/* ============================================================
   SCENE  OD-B12-S02 — Circe Maps the Dangers
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Circe privately explains the Sirens, Scylla, Charybdis, and Thrinacia.
     2. She gives exact procedures for wax, binding, steering, sacrifice, and
        restraint.
     3. Odysseus asks whether he can fight Scylla; Circe condemns his appetite
        for combat.
     4. At dawn the crew launches under a favorable wind.

   Stage layout (back -> front, one master clock — a single briefing still):
     THE DANGER-ROUTE MAP, a large hazard-corridor chart standing center-left as
     the mid-ground panel every gesture points to: Sirens, Scylla, Charybdis,
     Sun Island, and the Wandering-Rocks alternate.
       -> CIRCE, right of the chart: the enchantress-goddess presiding, the wand
          leveled at the chart as she traces the corridor and lays down the
          procedures — turning stern when Odysseus talks of fighting Scylla.
       -> ODYSSEUS, left foreground: the crafty king attending the briefing,
          then leaning in to ask whether he can fight the monster.
       -> THE INSTRUCTION PROPS, right foreground: Circe's laid-out kit — the
          beeswax, the binding ropes, the sacrificial gear, the steering-oar
          reference — the exact procedures made physical beside the chart.
   The private lesson, the exact procedures, the rejected appetite for combat,
   and the dawn launch under a fair wind — all held on one clock in one still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import dangerMap    from "../assets/set_piece/danger-route-map.mjs";
import instructions from "../assets/prop/instruction-props.mjs";
import circe        from "../assets/character/circe.mjs";
import odysseus     from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B12-S02",
  title:"Circe Maps the Dangers",
  book:1,
  beats:[
    "Circe privately explains the Sirens, Scylla, Charybdis, and Thrinacia.",
    "She gives exact procedures for wax, binding, steering, sacrifice, and restraint.",
    "Odysseus asks whether he can fight Scylla; Circe condemns his appetite for combat.",
    "At dawn the crew launches under a favorable wind.",
  ],
  exitState:"At dawn the crew launches under a favorable wind.",
  duration:24,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // THE DANGER-ROUTE MAP — the hazard-corridor chart, the mid-ground panel the
    // whole briefing is built around; both the strait and the Wandering-Rocks
    // alternate charted (nothing chosen yet).
    { asset:"set_piece.danger-route-map", instance:"map_01",
      anchor:{x:.40,y:.86}, scale:.62, pose:"charted" },

    // THE INSTRUCTION PROPS — Circe's laid-out kit at the right foreground: wax,
    // binding ropes, sacrificial gear, steering-oar reference. The procedures
    // made physical. Held in the neutral LAID-OUT state (all four shown), set
    // clear of Circe at the right so the whole board reads.
    { asset:"prop.instruction-props", instance:"kit_01",
      anchor:{x:.90,y:.995}, scale:.46, pose:"laid-out" },

    // CIRCE — right of the chart, presiding: she hosts the lesson, then levels
    // the wand at the corridor to trace it, gaze cast left onto the map.
    { asset:"character.circe", instance:"circe_01",
      anchor:{x:.60,y:.985}, scale:.5, pose:"circe_host", band:"front",
      gaze:{x:-.30,y:.04} },

    // ODYSSEUS — left foreground, attending the briefing, then leaning in to ask
    // whether he can fight Scylla; gaze slid right toward Circe and the chart.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.15,y:.99}, scale:.52, pose:"three_quarter_left", band:"threeq",
      gaze:{x:.42,y:0} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Circe privately explains the four dangers — she opens as the host,
    // Odysseus attends; the chart stands charted with both routes shown
    { op:"actor.pose", target:"circe_01",    at:0.0,  args:{ pose:"circe_host" } },
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"three_quarter_left" } },
    // beat 2: she lays down the exact procedures — the wand levels at the chart,
    // tracing the corridor over the laid-out kit; Odysseus listens
    { op:"actor.pose", target:"circe_01",    at:6.0,  args:{ pose:"circe_guide" } },
    { op:"actor.gaze", target:"circe_01",    at:6.0,  args:{ gaze:{x:-.5,y:.06} } },
    // beat 3: Odysseus asks whether he can fight Scylla — he leans in with an
    // open, urging hand; Circe condemns the appetite, still leveling the chart
    { op:"actor.pose", target:"odysseus_01", at:14.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01", at:14.0, args:{ gaze:{x:.5,y:-.04} } },
    { op:"actor.gaze", target:"circe_01",    at:14.0, args:{ gaze:{x:-.34,y:.02} } },
    // beat 4 (exit): the lesson closes; at dawn the crew launches under a fair
    // wind — Circe settles back to the composed host as the briefing ends
    { op:"actor.pose", target:"circe_01",    at:20.0, args:{ pose:"circe_host" } },
    { op:"actor.gaze", target:"circe_01",    at:20.0, args:{ gaze:{x:-.18,y:.02} } },
    { op:"timeline.capture", target:"OD-B12-S02", at:22.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the danger-route chart, the laid-out instruction kit, Circe
     presiding at the chart, Odysseus attending at the foreground edge. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "map_01"){
        mod = dangerMap;
        // the full hazard-corridor chart, both the strait and the Wandering-Rocks
        // alternate charted; nothing chosen yet
        state = { branch:"both", t };

      } else if (c.instance === "kit_01"){
        mod = instructions;
        // the neutral laid-out kit — all four procedure objects shown on the board
        state = { focus:null, lift:0, t };

      } else if (c.instance === "circe_01"){
        mod = circe;
        // fold pose/gaze from the timeline; keep the wand leveled and held
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  wandHand:"R", wandLen:.30, wandDir:{x:.06,y:-1} };
        // once she is guiding (tracing the corridor) point the wand at the chart
        if ((s.pose || c.pose) === "circe_guide"){
          state.wandLen = .34; state.wandDir = { x:-.62, y:-.12 };
        }

      } else {
        mod = odysseus;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
