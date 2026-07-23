/* ============================================================
   SCENE  OD-B08-S04 — The Dance and the Net of Hephaestus
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Demodocus sings how Ares and Aphrodite were trapped in Hephaestus's
        invisible net — staged as the song tableau (upper-left vision).
     2. The Phaeacian dancers perform a ball dance with precise leaps and
        exchanges — the ring mid-stage, a ball flying its arc.
     3. Odysseus praises their unmatched movement — foreground left, open-handed.
     4. The nobles offer gifts; Euryalus apologizes and gives a bronze sword —
        foreground right, a deep apology bow, the ivory-hilted sword presented.

   Stage layout (back -> front):
     PHAEACIAN ASSEMBLY GROUND as the empty navigable set (full bleed) — the
     seaside civic ground where the games gave way to the dance.
       -> the ARES-APHRODITE-HEPHAESTUS SONG TABLEAU floating upper-left, the
          bard's comic myth made visible: the invisible net cinched over the
          lovers, the gods arrived and laughing (beat 1).
       -> the PHAEACIAN DANCERS in their ring mid-stage — leap, spin, and a ball
          crossing the circle (beat 2).
       -> the DANCE BALL as a small IN-PLAY callout upper-right — the object kept
          aloft by hand and foot (beat 2 focus).
       -> ODYSSEUS foreground left, open-handed in praise of the unmatched
          movement (beat 3).
       -> EURYALUS foreground right, bowed in apology, presenting the guest-gift
          (beat 4) — the BRONZE SWORD WITH IVORY HILT laid out before him.
   Song, dance, praise, and the apologetic gift all held on one clock.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import ground   from "../assets/location/phaeacian-assembly-ground.mjs";
import songfx   from "../assets/divine_fx/ares-aphrodite-hephaestus-song-tableau.mjs";
import dancers  from "../assets/ensemble/phaeacian-dancers.mjs";
import ball     from "../assets/prop/dance-ball.mjs";
import odysseus from "../assets/character/odysseus.mjs";
import euryalus from "../assets/character/euryalus.mjs";
import sword    from "../assets/prop/bronze-sword-with-ivory-hilt.mjs";

export const scene = {
  id:"OD-B08-S04",
  title:"The Dance and the Net of Hephaestus",
  book:1,
  beats:[
    "Demodocus sings how Ares and Aphrodite were trapped in Hephaestus's invisible net.",
    "Phaeacian dancers perform a ball dance with precise leaps and exchanges.",
    "Odysseus praises their unmatched movement.",
    "The nobles offer gifts; Euryalus apologizes and gives a bronze sword.",
  ],
  exitState:"The nobles offer gifts; Euryalus apologizes and gives a bronze sword.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: the seaside civic ground, full bleed — the
    // geography that holds the dance
    { asset:"location.phaeacian-assembly-ground", instance:"ground_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beat 1: Demodocus's song made visible — the net cinched over the lovers,
    // the gods gathered and laughing. A vision-callout floating upper-left,
    // raised into the open sky over the ground.
    { asset:"divine_fx.ares-aphrodite-hephaestus-song-tableau", instance:"song_01",
      anchor:{x:.255,y:.470}, scale:.40 },

    // beat 2: the dancers' ring mid-stage — leap, spin, a ball crossing the ring
    { asset:"ensemble.phaeacian-dancers", instance:"dancers_01",
      anchor:{x:.485,y:.955}, scale:.56 },

    // beat 2 focus: the dance ball as a small IN-PLAY callout high over the ring,
    // tossed straight up — a distinct object read
    { asset:"prop.dance-ball", instance:"ball_01",
      anchor:{x:.585,y:.315}, scale:.155 },

    // beat 3: Odysseus foreground left, open-handed in praise
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.130,y:.995}, scale:.45, pose:"speaking", band:"threeq",
      gaze:{x:.32,y:.02} },

    // beat 4: Euryalus foreground right, bowed in apology, offering the gift —
    // given clear space on the right edge
    { asset:"character.euryalus", instance:"euryalus_01",
      anchor:{x:.880,y:.995}, scale:.48, pose:"euryalus_apology", band:"threeq",
      gaze:{x:-.30,y:.42} },

    // beat 4: the bronze sword with ivory hilt — the guest-gift, presented on
    // its cloth before Euryalus
    { asset:"prop.bronze-sword-with-ivory-hilt", instance:"sword_01",
      anchor:{x:.720,y:.905}, scale:.28, pose:"present" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the bard's song plays — the net springs, gods arrive, they laugh
    { op:"fx.play",    target:"song_01",     at:0.0,  args:{} },
    // beat 3: Odysseus turns to the dancers and praises their movement
    { op:"actor.pose", target:"odysseus_01", at:16.0, args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01", at:16.0, args:{ gaze:{x:.36,y:0} } },
    // beat 4: Euryalus's pride softens — the apology bow, gift extended
    { op:"actor.pose", target:"euryalus_01", at:26.0, args:{ pose:"euryalus_apology" } },
    { op:"actor.gaze", target:"euryalus_01", at:26.0, args:{ gaze:{x:-.30,y:.44} } },
    // ...then he offers the sword outright, an earnest reach
    { op:"actor.pose", target:"euryalus_01", at:33.0, args:{ pose:"offering" } },
    { op:"actor.gaze", target:"euryalus_01", at:33.0, args:{ gaze:{x:-.24,y:.18} } },
    { op:"timeline.capture", target:"OD-B08-S04", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the assembly ground, the song vision, the dancers' ring, the
     ball callout, then Odysseus and Euryalus with the presented sword. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "ground_01"){
        mod = ground;
        // the seaside civic ground: sea + drawn-up ship, palace road, seating
        // tiers, the king's raised place
        state = { layers:["sky","harbor","ship","palace","route","floor","tiers","kingsplace"],
                  t };
      } else if (c.instance === "song_01"){
        mod = songfx;
        // the sung myth as a self-contained vignette: net taut over the lovers,
        // the gods arrived and laughing at the trapped pair
        state = { drop:1, godsIn:1, laugh:0.9,
                  layers:["ground","bed","lovers","net","gods"], t };
      } else if (c.instance === "dancers_01"){
        mod = dancers;
        // the full circle mid-performance — leap + spins + the ball in flight
        state = { formation:"ring", leap:1, spin:1, pass:1, ballPhase:0.5,
                  density:1, spread:1, t };
      } else if (c.instance === "ball_01"){
        mod = ball;
        // the play-ball at the apex of a straight vertical toss — a distinct,
        // legible object read high over the ring
        state = { toss:1, t };
      } else if (c.instance === "sword_01"){
        mod = sword;
        // the guest-gift laid out and presented on its cloth
        state = { mode:"present", t };
      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "odysseus_01") ? odysseus : euryalus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
