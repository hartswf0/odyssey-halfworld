/* ============================================================
   SCENE  OD-B05-S03 — Odysseus Distrusts Freedom
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order, one clock):
     1. Calypso finds Odysseus weeping on the shore and tells him to build a
        raft for home.
     2. He suspects a trap and demands a binding oath that she will not plan
        his ruin.
     3. Calypso swears by earth, sky, and Styx and offers practical help.
     4. At supper she argues that immortality with her surpasses Penelope;
        Odysseus tactfully refuses.

   Stage layout (back -> front):
     the Ogygia shore set (rocky lookout, weeping rock, sea horizon, cave path)
       -> the Oath of Styx sealing in the upper air over the sea (a divine
          apparition that GATHERS while he weeps and demands, then is SWORN
          fast when she takes the vow — driven off the fx clock)
       -> Calypso on the ledge, left of the weeping rock (welcome -> swearing
          release -> tender persuasion), always turned toward him
       -> Odysseus foreground-right at the weeping rock (grieving -> the wary
          demand for the oath -> the crafty, tactful refusal at supper).
   Ogygia held on one clock: the mortal's distrust, the goddess's binding vow,
   and the quiet refusal of immortality, all on the same shore.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import ogygiaShore from "/assets/location/ogygia-shore.mjs";
import oathOfStyx  from "/assets/divine_fx/oath-of-styx.mjs";
import calypso     from "/assets/character/calypso.mjs";
import odysseus    from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B05-S03",
  title:"Odysseus Distrusts Freedom",
  book:1,
  beats:[
    "Calypso finds Odysseus weeping on the shore and tells him to build a raft for home.",
    "He suspects a trap and demands a binding oath that she will not plan his ruin.",
    "Calypso swears by earth, sky, and Styx and offers practical help.",
    "At supper she argues that immortality with her surpasses Penelope; Odysseus tactfully refuses.",
  ],
  exitState:"At supper she argues that immortality with her surpasses Penelope; Odysseus tactfully refuses.",
  duration:46,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable shore set — full stage, back-most
    { asset:"location.ogygia-shore", instance:"ogygia_shore_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the Oath of Styx sealing in the air over the sea — a divine apparition
    // hung in the upper-centre, behind the figures. Only the GLYPH shows (bond-
    // ring + descending oath-lines + closing gesture) so the shore's own sky and
    // sea read through it; the field/river layers are dropped in stage(). Driven
    // by the fx clock below.
    { asset:"divine_fx.oath-of-styx", instance:"oath_of_styx_01",
      anchor:{x:.52,y:.52}, scale:.42 },

    // Calypso on the ledge, to the left of the weeping rock, turned toward him
    { asset:"character.calypso", instance:"calypso_01",
      anchor:{x:.32,y:.905}, scale:.47, pose:"calypso_welcome",
      gaze:{x:.30,y:.06}, band:"threeq" },

    // Odysseus foreground-right at the weeping rock, weeping toward the sea
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.66,y:.94}, scale:.50, pose:"grieving",
      gaze:{x:-.22,y:.30}, band:"threeq" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: she finds him weeping and tells him to build a raft for home
    { op:"actor.pose", target:"calypso_01",   at:5.0,  args:{ pose:"calypso_tender" } },
    { op:"actor.gaze", target:"calypso_01",   at:5.0,  args:{ gaze:{x:.28,y:.04} } },
    // beat 2: he suspects a trap and demands a binding oath — the wary demand
    { op:"actor.pose", target:"odysseus_01",  at:12.0, args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01",  at:12.0, args:{ gaze:{x:-.30,y:-.02} } },
    // beat 3: Calypso swears by earth, sky, and Styx — the oath is taken
    { op:"actor.pose", target:"calypso_01",   at:20.0, args:{ pose:"calypso_release" } },
    { op:"actor.gaze", target:"calypso_01",   at:20.0, args:{ gaze:{x:.20,y:-.06} } },
    { op:"fx.play",    target:"oath_of_styx_01", at:20.0, args:{} },
    // she offers practical help; his distrust eases
    { op:"actor.pose", target:"odysseus_01",  at:27.0, args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus_01",  at:27.0, args:{ gaze:{x:-.16,y:.02} } },
    // beat 4 (exit): at supper she argues immortality surpasses Penelope; he
    // tactfully refuses — the crafty, diplomatic half-smile
    { op:"actor.pose", target:"calypso_01",   at:34.0, args:{ pose:"calypso_tender" } },
    { op:"actor.gaze", target:"calypso_01",   at:34.0, args:{ gaze:{x:.26,y:-.02} } },
    { op:"actor.pose", target:"odysseus_01",  at:38.0, args:{ pose:"crafty" } },
    { op:"actor.gaze", target:"odysseus_01",  at:38.0, args:{ gaze:{x:-.34,y:-.04} } },
    { op:"timeline.capture", target:"OD-B05-S03", at:45.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the shore set, the oath apparition, Calypso, Odysseus. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the oath GATHERS faintly while he weeps and demands, then swears fast the
    // moment she takes the vow — intensity/bind ramp off the fx clock (fxT set
    // by fx.play). Deterministic in t; never fully absent (a divine presence).
    const oath = st["oath_of_styx_01"] || {};
    const sworn = oath.fxT != null;                       // has the vow been taken
    const sw = sworn ? clamp01(oath.fxT/5) : 0;           // 0..1 through the swear
    const oInt  = sworn ? lerp(0.55, 1.30, sw) : 0.30;    // solemn darkening
    const oBind = sworn ? lerp(0.42, 1.00, sw) : 0.30;    // links drawn tight
    const oClk  = t * 0.9;                                // slow ripple/link clock

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "ogygia_shore_01"){
        mod = ogygiaShore;
        // full weeping-day set (rocks / surf / horizon / cave / weeprock / launch)
        state = { layers:["sky","sea","surf","cliff","cave","ledge","weeprock","launch"] };
      } else if (c.instance === "oath_of_styx_01"){
        mod = oathOfStyx;
        // GLYPH only — drop the full-field "dark" heavens + "styx" river so the
        // shore's own sky/sea show through and the oath reads as a sign in the air
        state = { t:oClk, intensity:oInt, bind:oBind,
                  layers:["oathlines","gesture","ring"] };
      } else {
        // the two figures: fold pose/gaze/band from the timeline; let
        // placeInstance own the anchor/scale
        mod = c.instance === "calypso_01" ? calypso : odysseus;
        state = { t:0.5, band:c.band, gaze:c.gaze, pose:c.pose, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
