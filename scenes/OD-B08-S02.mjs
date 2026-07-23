/* ============================================================
   SCENE  OD-B08-S02 — Demodocus Sings of the Quarrel
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. At the feast the blind bard Demodocus receives his lyre and sings of a
        quarrel between Odysseus and Achilles.
     2. Odysseus repeatedly hides his face in his cloak and weeps.
     3. Alcinous alone notices and stops the song by proposing athletic games.
     4. The company moves from the hall to the contest field.

   Stage layout (a hushed feast-hall tableau, back -> front):
     FEAST HALL AT ATTENTIVE SILENCE as the empty navigable set (full bleed) —
     back wall, frieze, columns, the bard seat left, the narrator dais centre,
     the tables, the gaze-lines converging on the song.
       -> the FEAST LISTENERS as the rapt audience arc filling the hall, all
          attention thrown to the bard (beat 1), one hidden reaction breaking.
       -> DEMODOCUS'S LYRE — the received phorminx, handed to the bard and
          sounding the song (beat 1), riding at the bard side.
       -> ALCINOUS enthroned right — the generous king who alone reads the
          stranger's grief and lifts his hand to stop the song and call the
          games (beat 3).
       -> DEMODOCUS the blind bard left — sightless face lifted, projecting the
          quarrel out over the hall, unaware of the collapse below (beat 1).
       -> ODYSSEUS foreground centre — hiding his face in his cloak and weeping
          as the song names his own war (beat 2).
   Song, grief, the king's notice, and the turn toward the field all held on one
   clock: the blind man's verse read from dais to threshold in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import hall      from "../assets/location/feast-hall-at-attentive-silence.mjs";
import listeners from "../assets/ensemble/feast-listeners.mjs";
import lyre      from "../assets/prop/demodocuss-lyre.mjs";
import alcinous  from "../assets/character/alcinous.mjs";
import demodocus from "../assets/character/demodocus.mjs";
import odysseus  from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B08-S02",
  title:"Demodocus Sings of the Quarrel",
  book:1,
  beats:[
    "At the feast the blind bard Demodocus receives his lyre and sings of a quarrel between Odysseus and Achilles.",
    "Odysseus repeatedly hides his face in his cloak and weeps.",
    "Alcinous alone notices and stops the song by proposing athletic games.",
    "The company moves from the hall to the contest field.",
  ],
  exitState:"The company moves from the hall to the contest field.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: hushed feast hall, bard seat + narrator dais +
    // tables + converging gaze-lines, full bleed — the geography of the scene
    { asset:"location.feast-hall-at-attentive-silence", instance:"hall_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beat 1: the rapt audience arc filling the hall, all attention on the bard,
    // one hidden reaction just breaking — rides behind the named cast
    { asset:"ensemble.feast-listeners", instance:"listeners_01",
      anchor:{x:.50,y:.82}, scale:.82 },

    // beat 1: the received phorminx — handed to the bard and sounding the song,
    // riding at the bard side by the bard seat
    { asset:"prop.demodocuss-lyre", instance:"lyre_01",
      anchor:{x:.405,y:.62}, scale:.22, pose:"song-cue" },

    // beat 3: Alcinous enthroned right — the generous king who alone reads the
    // stranger's grief, then lifts his hand to stop the song and call the games
    { asset:"character.alcinous", instance:"alcinous_01",
      anchor:{x:.835,y:.96}, scale:.50, pose:"alcinous_raising", band:"front",
      gaze:{x:-.30,y:.26} },

    // beat 1: Demodocus the blind bard left — sightless face lifted, projecting
    // the quarrel out over the hall, unaware of the collapse below
    { asset:"character.demodocus", instance:"demodocus_01",
      anchor:{x:.215,y:.985}, scale:.54, pose:"demo_locating", band:"front",
      blink:1, gaze:{x:.10,y:-.14} },

    // beat 2: Odysseus foreground centre — hiding his face in his cloak and
    // weeping as the song names his own war
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.55,y:1.00}, scale:.58, pose:"neutral", band:"threeq",
      gaze:{x:0,y:.36} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the bard receives the lyre and finds the strings, then throws the
    // quarrel-song out over the hall, sightless face lifted, jaw open
    { op:"actor.pose", target:"demodocus_01", at:2.0,  args:{ pose:"demo_projecting" } },
    { op:"actor.gaze", target:"demodocus_01", at:2.0,  args:{ gaze:{x:.12,y:-.18} } },
    // beat 2: Odysseus hides his face in his cloak and weeps as the song names
    // his own war — head bowed, eyes cast low
    { op:"actor.pose", target:"odysseus_01",  at:4.0,  args:{ pose:"grieving" } },
    { op:"actor.gaze", target:"odysseus_01",  at:4.0,  args:{ gaze:{x:0,y:.5} } },
    // beat 3: Alcinous alone notices the stranger's grief...
    { op:"actor.pose", target:"alcinous_01",  at:6.0,  args:{ pose:"alcinous_stunned" } },
    { op:"actor.gaze", target:"alcinous_01",  at:6.0,  args:{ gaze:{x:-.34,y:.28} } },
    // ...and lifts his hand to stop the song and propose the athletic games
    { op:"actor.pose", target:"alcinous_01",  at:7.5,  args:{ pose:"alcinous_raising" } },
    { op:"actor.gaze", target:"alcinous_01",  at:7.5,  args:{ gaze:{x:-.20,y:.10} } },
    // beat 4 (exit): the company turns from the hall toward the contest field
    { op:"timeline.capture", target:"OD-B08-S02", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the hall set, the listeners arc, the lyre, Alcinous, the
     bard, then Odysseus weeping in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "hall_01"){
        mod = hall;
        // the hushed hall: bard seat, narrator dais, tables, gaze-lines all
        // converged on the song, the room held in attentive silence
        state = { layers:["backwall","frieze","sidewalls","columns","floor",
                          "bardseat","narrativeseat","tables","gazelines","focus"],
                  converge:1, hush:1, t };
      } else if (c.instance === "listeners_01"){
        mod = listeners;
        // rapt on the bard, the one hidden reaction just breaking (deterministic)
        state = { attention:0.95, grief:0.7, outlier:0.52, formation:"arc", t:0.4 };
      } else if (c.instance === "lyre_01"){
        mod = lyre;
        // the received phorminx sounding the song
        state = { mode:s.pose || c.pose, status:"SONG", progress:1.0, t:0.4 };
      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "alcinous_01")  ? alcinous
            : (c.instance === "demodocus_01") ? demodocus
            :                                   odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
        if (c.instance === "demodocus_01") state.blink = 1; // always sightless
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
