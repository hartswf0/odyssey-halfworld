/* ============================================================
   SCENE  OD-B07-S04 — Arete Recognizes Her Work
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. After the Phaeacians leave, Arete recognizes the clothes Odysseus wears
        as garments from her own household — the woven maker's mark.
     2. She asks who he is and how he obtained them.
     3. Odysseus tells of Calypso, the storm, Nausicaa, and his choice not to
        follow the princess directly.
     4. Alcinous praises his restraint, offers marriage, and renews the promise
        of safe passage at dawn.

   Stage layout (a throne-hall tableau, back -> front):
     ALCINOUS'S PALACE as the empty navigable set (full bleed) — the golden
     hall of welcome: back wall, silver posts, thrones on the dais, the central
     hearth, the guest route running up to the standing point.
       -> the RECOGNIZED GARMENTS as an EXAMINED callout floating mid-right, the
          embroidered maker's mark blown up and glinting — the household weaving
          Arete's eye catches (beat 1). It rides Arete's forensic gaze line.
       -> ALCINOUS enthroned left of the hearth — generous host who at the end
          praises restraint, offers marriage, renews safe passage (beat 4).
       -> ARETE enthroned right — the forensic queen reading her own weaving
          before she questions the stranger (beats 1-2).
       -> ODYSSEUS foreground centre, stood at the guest place in the very
          clothes she recognizes, telling his tale then composed under the offer
          (beats 3-4).
   Recognition, question, tale, and the king's generous ruling all held on one
   clock: the household weaving read from river to hall in a single still.
   ============================================================ */
import { placeInstance, clamp01 } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace    from "../assets/location/alcinouss-palace.mjs";
import garments  from "../assets/prop/recognized-garments.mjs";
import alcinous  from "../assets/character/alcinous.mjs";
import arete     from "../assets/character/arete.mjs";
import odysseus  from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B07-S04",
  title:"Arete Recognizes Her Work",
  book:1,
  beats:[
    "After the Phaeacians leave, Arete recognizes the clothes Odysseus wears as garments from her household.",
    "She asks who he is and how he obtained them.",
    "Odysseus tells of Calypso, the storm, Nausicaa, and his choice not to follow the princess directly.",
    "Alcinous praises his restraint, offers marriage, and renews the promise of safe passage at dawn.",
  ],
  exitState:"Alcinous praises his restraint, offers marriage, and renews the promise of safe passage at dawn.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: golden hall of welcome, thrones + hearth, full
    // bleed — the geography of the whole scene
    { asset:"location.alcinouss-palace", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beat 1: the recognized garments as an EXAMINED callout — the maker's mark
    // blown up + glinting, the household weaving Arete's eye catches. Rides her
    // forensic gaze line, mid-right, above the hearth
    { asset:"prop.recognized-garments", instance:"garments_01",
      anchor:{x:.60,y:.74}, scale:.33 },

    // beat 4: Alcinous enthroned left of the hearth — the generous host who
    // praises restraint, offers marriage, and renews safe passage
    { asset:"character.alcinous", instance:"alcinous_01",
      anchor:{x:.235,y:.905}, scale:.50, pose:"alcinous_raising", band:"front",
      gaze:{x:.30,y:.10} },

    // beats 1-2: Arete enthroned right — the forensic queen reading her own
    // weaving before she questions the stranger
    { asset:"character.arete", instance:"arete_01",
      anchor:{x:.775,y:.905}, scale:.50, pose:"arete_forensic", band:"front",
      gaze:{x:-.28,y:.22} },

    // beats 3-4: Odysseus foreground centre, stood at the guest place in the
    // clothes she recognizes — telling his tale, then composed under the offer
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.49,y:.995}, scale:.60, pose:"neutral", band:"front",
      gaze:{x:.14,y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Arete's eye catches the household weaving — she reads the mark,
    // forensic, gaze down on the cloth (the examined callout glints)
    { op:"actor.pose", target:"arete_01",    at:3.0,  args:{ pose:"arete_forensic" } },
    { op:"actor.gaze", target:"arete_01",    at:3.0,  args:{ gaze:{x:-.28,y:.24} } },
    // beat 2: she turns to the stranger and asks who he is, how he got them
    { op:"actor.pose", target:"arete_01",    at:12.0, args:{ pose:"arete_speak" } },
    { op:"actor.gaze", target:"arete_01",    at:12.0, args:{ gaze:{x:-.34,y:.06} } },
    // beat 3: Odysseus tells of Calypso, the storm, Nausicaa, and his restraint
    { op:"actor.pose", target:"odysseus_01", at:20.0, args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01", at:20.0, args:{ gaze:{x:.20,y:0} } },
    { op:"actor.pose", target:"arete_01",    at:21.0, args:{ pose:"arete_poise" } },
    { op:"actor.gaze", target:"arete_01",    at:21.0, args:{ gaze:{x:-.24,y:.04} } },
    // beat 4 (exit): Alcinous praises his restraint and offers marriage...
    { op:"actor.pose", target:"alcinous_01", at:32.0, args:{ pose:"alcinous_marriage" } },
    { op:"actor.gaze", target:"alcinous_01", at:32.0, args:{ gaze:{x:.26,y:.06} } },
    // ...then renews the promise of safe passage at dawn
    { op:"actor.pose", target:"alcinous_01", at:38.0, args:{ pose:"alcinous_promising" } },
    { op:"actor.gaze", target:"alcinous_01", at:38.0, args:{ gaze:{x:.22,y:.02} } },
    // Odysseus composed under the offer; Arete settles to regal stillness
    { op:"actor.pose", target:"odysseus_01", at:33.0, args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:33.0, args:{ gaze:{x:-.10,y:.02} } },
    { op:"actor.pose", target:"arete_01",    at:34.0, args:{ pose:"arete_poise" } },
    { op:"actor.gaze", target:"arete_01",    at:34.0, args:{ gaze:{x:-.14,y:.04} } },
    { op:"timeline.capture", target:"OD-B07-S04", at:43.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the palace set, the examined garments callout, Alcinous,
     Arete, then Odysseus foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "palace_01"){
        mod = palace;
        // the full hall of welcome: thrones, silver posts, doors, central hearth
        state = { layers:["backwall","frieze","sidewalls","posts","doors",
                          "thrones","sideseats","floor","guestroute","hearth"],
                  fire:0.7, gleam:0.85, t };
      } else if (c.instance === "garments_01"){
        mod = garments;
        // the recognition detail: the maker's mark blown up + glinting, the
        // household weaving Arete's eye catches (deterministic slow spin)
        state = { mode:"examined", glint:true, t:t*0.15 };
      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "alcinous_01") ? alcinous
            : (c.instance === "arete_01")    ? arete
            :                                  odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
