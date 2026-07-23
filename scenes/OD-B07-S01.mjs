/* ============================================================
   SCENE  OD-B07-S01 — Athena Hides the Walk through Scheria
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Nausicaa reaches the palace while Odysseus waits in Athena's grove.
     2. He enters the city wrapped in a divine mist.
     3. Athena appears as a young girl carrying a pitcher and guides him
        through the streets and harbor.
     4. She describes the Phaeacians, warns him not to question passersby,
        and directs him to Arete.

   Stage layout (back -> front, seaward capital of the Phaeacians):
     the SCHERIA CITY AND HARBOR as the empty navigable set (full bleed): its
       twin harbors, quay, market, temple, walls, gate, and the palace on the
       rise hold the whole geography the guidance walks him through — the road,
       the harbour she names, and the palace he is directed toward.
       -> ODYSSEUS, foreground centre-left, walking up the quay into the town
          (beats 1->2: the traveller who waited in the grove now entering).
       -> the CONCEALING MIST wrapped around him (beat 2): a swirling opacity
          ring cloaking him while his own sight runs clean through — placed over
          Odysseus with its own silhouette dropped, so the real man is shrouded.
       -> ATHENA AS PITCHER GIRL, foreground right, the water-girl disguise
          walking beside him, free hand thrust out to point the way, then held
          level as she names the harbour, warns him off the passersby, and
          directs him to Arete (beats 3->4).
       -> the WATER PITCHER, a plain everyday town vessel at rest on the quay by
          her feet (the ordinary jug that lets the goddess pass as a local girl).
   The waiting man, his concealment, the guiding child, and the palace she points
   him toward all held on one clock: the whole hidden walk read in one still.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import city      from "../assets/location/scheria-city-and-harbor.mjs";
import odysseus  from "../assets/character/odysseus.mjs";
import mist      from "../assets/divine_fx/concealing-mist.mjs";
import athena    from "../assets/character/athena-as-pitcher-girl.mjs";
import pitcher   from "../assets/prop/water-pitcher.mjs";

export const scene = {
  id:"OD-B07-S01",
  title:"Athena Hides the Walk through Scheria",
  book:1,
  beats:[
    "Nausicaa reaches the palace while Odysseus waits in Athena's grove.",
    "He enters the city wrapped in a divine mist.",
    "Athena appears as a young girl carrying a pitcher and guides him through streets and harbor.",
    "She describes the Phaeacians, warns him not to question passersby, and directs him to Arete.",
  ],
  exitState:"She directs him to Arete.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: twin harbors, quay, market, temple, walls, gate,
    // palace on the rise — full bleed, the geography the guidance walks through
    { asset:"location.scheria-city-and-harbor", instance:"city_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beats 1->2: Odysseus, foreground centre-left, walking up the quay into the
    // town — the traveller who waited in the grove now entering the city
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.40,y:.98}, scale:.62, pose:"striding", band:"front",
      gaze:{x:.22,y:-.02} },

    // beat 2: the concealing mist wrapped around him — the swirling opacity ring
    // cloaking the man while his own sight runs clean out through the channel
    { asset:"divine_fx.concealing-mist", instance:"mist_01",
      anchor:{x:.40,y:.98}, scale:.62 },

    // beats 3->4: Athena as the water-girl, foreground right — guiding him up the
    // road, then naming the harbour and directing him to Arete
    { asset:"character.athena-as-pitcher-girl", instance:"athena_01",
      anchor:{x:.66,y:.985}, scale:.52, pose:"pitcher_guiding", band:"front",
      gaze:{x:.4,y:-.06} },

    // the ordinary town water vessel at rest on the quay by her feet — the plain
    // jug that lets the goddess pass as a local girl fetching water
    { asset:"prop.water-pitcher", instance:"pitcher_01",
      anchor:{x:.86,y:.99}, scale:.17 },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 2: Athena pours the mist — the concealment field kindles and clings
    { op:"fx.play",    target:"mist_01",     at:1.5,  args:{} },
    // beat 3: the pitcher-girl guides him, free hand thrust out to point the way;
    // Odysseus walks on into the town, glancing to the child beside him
    { op:"actor.pose", target:"athena_01",   at:8.0,  args:{ pose:"pitcher_guiding" } },
    { op:"actor.gaze", target:"athena_01",   at:8.0,  args:{ gaze:{x:.4,y:-.06} } },
    { op:"actor.gaze", target:"odysseus_01", at:9.0,  args:{ gaze:{x:.30,y:.02} } },
    // beat 4 (exit): she describes the Phaeacians and directs him to Arete — the
    // pointing softens to an offering hand held level, naming the queen; he stops
    // to receive it, composed and listening
    { op:"actor.pose", target:"athena_01",   at:24.0, args:{ pose:"pitcher_instructing" } },
    { op:"actor.gaze", target:"athena_01",   at:24.0, args:{ gaze:{x:.16,y:.02} } },
    { op:"actor.pose", target:"odysseus_01", at:25.0, args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:25.0, args:{ gaze:{x:.34,y:.02} } },
    { op:"timeline.capture", target:"OD-B07-S01", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the city set, Odysseus, the mist wrapping him, Athena the
     pitcher-girl, then the everyday water pitcher on the quay. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "city_01"){
        mod = city;
        // the day of his arrival: full city, ships moored, market busy — the whole
        // seafaring capital he is walked through
        state = { layers:["sky","palace","walls","ground","sheds","market","temple",
                          "harbors","quay","ships"] };
      } else if (c.instance === "mist_01"){
        mod = mist;
        // drive the concealment off the fx.play cue; DROP the mist's own baked
        // silhouette so the real Odysseus (drawn behind) is the shrouded body —
        // the ring, tethers, deflected sight-lines, his clear channel and glyph
        // all wrap the actual man
        const fxT = (s.fxT != null) ? s.fxT : 0;
        const g = clamp01(fxT / 6);        // thin wisps -> full shroud by ~7.5s
        state = { t:fxT,
                  intensity: lerp(0.35, 1.28, g),
                  wrap:      lerp(0.10, 1.00, g),
                  bend:      lerp(0.10, 1.00, g),
                  layers:["source","mist","attach","bounces","vision","glyph"] };
      } else if (c.instance === "pitcher_01"){
        mod = pitcher;
        // the plain town jug set upright on the quay, water in the belly
        state = { fill:0.55, tilt:0, lifted:false, pour:false };
      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "odysseus_01") ? odysseus : athena;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
