/* ============================================================
   SCENE  OD-B03-S03 — The Broken Return from Troy
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Nestor recounts the feud between Agamemnon and Menelaus after Troy fell.
     2. Half the fleet sailed; Odysseus turned back to support Agamemnon.
     3. Nestor, Diomedes, and Menelaus escaped by a difficult route and reached home.
     4. Nestor admits he learned Odysseus's later fate only through scattered reports.

   Stage layout (back -> front):
     the sea-route map — the whole chart of the homeward lanes, the backdrop the
     old king traces with his finger (full frame)
       -> the divided Achaean fleet — a window of open sea up on the horizon band
          where the armada comes apart into its lanes
       -> the Atreid kings' memory variant — Agamemnon and Menelaus locked in the
          quarrel that split the host (left)
       -> Odysseus' memory variant — the commander wheeling the ships about to turn
          back for Agamemnon (centre)
       -> Nestor — foreground narrator, mapping the routes with regret, his gaze
          drifting off at the end into the scattered reports of Odysseus' fate.
   The map is the thing Nestor MAPS; the fleet and the two memory figures are the
   remembered content his tracing hand summons across it.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp, smooth } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import seaMap    from "/assets/set_piece/sea-route-map.mjs";
import fleet     from "/assets/ensemble/divided-achaean-fleet.mjs";
import kings     from "/assets/character/agamemnon-and-menelaus-memory-variants.mjs";
import odysseus  from "/assets/character/odysseus-memory-variant.mjs";
import nestor    from "/assets/character/nestor.mjs";

export const scene = {
  id:"OD-B03-S03",
  title:"The Broken Return from Troy",
  book:1,
  beats:[
    "Nestor recounts the feud between Agamemnon and Menelaus after Troy fell.",
    "Half the fleet sailed; Odysseus turned back to support Agamemnon.",
    "Nestor, Diomedes, and Menelaus escaped by a difficult route and reached home.",
    "Nestor admits he learned Odysseus's later fate only through scattered reports.",
  ],
  exitState:"Nestor admits he learned Odysseus's later fate only through scattered reports.",
  duration:36,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the chart of the homeward lanes — full-frame backdrop the old king traces
    { asset:"set_piece.sea-route-map", instance:"map_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"charted" },

    // the armada coming apart — a window of open sea on the horizon band
    { asset:"ensemble.divided-achaean-fleet", instance:"fleet_01",
      anchor:{x:.50,y:.44}, scale:.50, pose:"diverging" },

    // the feud that split the host — Agamemnon vs Menelaus, remembered (left)
    { asset:"character.agamemnon-and-menelaus-memory-variants", instance:"kings_01",
      anchor:{x:.29,y:.66}, scale:.42, pose:"quarrel" },

    // Odysseus wheeling the ships about, turning back for Agamemnon (centre).
    // NOTE: no `pose` here — "commanding" is a state-node name, not a hero pose
    // id, so we let the asset's preview() (pointing_arm + hard brow) drive it and
    // only fold gaze in from the timeline.
    { asset:"character.odysseus-memory-variant", instance:"odysseus_01",
      anchor:{x:.56,y:.80}, scale:.34,
      gaze:{x:.55,y:-.04}, band:"threeq" },

    // Nestor — foreground narrator, mapping the routes with regret
    { asset:"character.nestor", instance:"nestor_01",
      anchor:{x:.85,y:1.00}, scale:.58, pose:"nestor_telling",
      gaze:{x:-.30,y:.18} },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 1 -> 3: the old king shifts from opening the tale to MAPPING the route
    { op:"actor.pose", target:"nestor_01",   at:3.0,  args:{ pose:"nestor_mapping" } },
    // beat 1: his tracing finger follows the lanes down across the chart
    { op:"actor.gaze", target:"nestor_01",   at:3.0,  args:{ gaze:{x:-.30,y:.34} } },
    // beat 2: Odysseus flings the order to bring the fleet about
    { op:"actor.gaze", target:"odysseus_01", at:9.0,  args:{ gaze:{x:.55,y:-.04} } },
    // beat 4: the tale runs out — his gaze lifts and drifts off into hearsay
    { op:"actor.pose", target:"nestor_01",   at:28.0, args:{ pose:"nestor_telling" } },
    { op:"actor.gaze", target:"nestor_01",   at:28.0, args:{ gaze:{x:.30,y:-.46} } },
    // exit: he learned Odysseus's later fate only through scattered reports
    { op:"timeline.capture", target:"OD-B03-S03", at:35.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: chart backdrop, fleet window, the two kings, Odysseus, Nestor. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // --- the chart fills in as the telling proceeds: one trunk lit -> every leg
    //     to Argos and Pylos alight (gathering -> dispersing -> charted) ---
    const litF   = smooth(clamp01((t - 2) / 26));
    const litN   = Math.round(lerp(1, 6, litF));      // 1..6 legs alight
    const mapMode= litN <= 2 ? "GATHERING" : litN <= 4 ? "DISPERSING" : "CHARTED";

    // --- the fleet comes apart off the same clock: massed -> lanes fan -> one
    //     squadron comes about -> the heads dwindle to specks on the horizon ---
    const divergence = smooth(clamp01((t - 2) / 8));          // lanes fan open
    const progress   = lerp(0.58, 1.00, clamp01((t - 6) / 24)); // run seaward
    const turnBack   = smooth(clamp01((t - 11) / 7));          // the return lane reverses
    const fleetForm  = t < 6 ? "united" : turnBack < 0.5 ? "diverging"
                     : progress > 0.9 ? "vanishing" : "turning-back";

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "map_01"){
        mod = seaMap;
        // the whole homeward chart, legs lighting up as Nestor traces the route
        state = { layers:["sea","graticule","frame","branches","pip","nodes","labels"],
                  lit: litN, t: t*0.12, status: mapMode };
      } else if (c.instance === "fleet_01"){
        mod = fleet;
        // the armada dividing on the horizon band — a window of open sea
        state = { formation:fleetForm, divergence, progress, spread:1.0,
                  turnBack, showLanes:true, status: fleetForm.toUpperCase() };
      } else if (c.instance === "kings_01"){
        mod = kings;
        // the feud that broke the host — settle into the quarrel after Troy falls
        state = { variant: t < 3 ? "neutral" : "quarrel" };
      } else if (c.instance === "odysseus_01"){
        mod = odysseus;
        // let the asset's COMMANDING preview (pointing_arm + hard brow) drive the
        // figure; only fold the timeline gaze in. Do NOT pass pose — it's undefined
        // here and would clobber the preview pose, flattening him to neutral.
        state = { t: t*0.5, gaze: s.gaze, mirror:true };
      } else {
        // the foreground narrator: fold pose/gaze/band from the timeline
        mod = nestor;
        state = { t: t*0.5, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
