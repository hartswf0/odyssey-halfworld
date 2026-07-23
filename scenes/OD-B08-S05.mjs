/* ============================================================
   SCENE  OD-B08-S05 — The Trojan Horse Song and the Name
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus gives Demodocus a choice cut of meat and asks for the song of
        the wooden horse.
     2. The bard sings the Greeks' emergence, the sack, and Odysseus's attack on
        Deiphobus's house.
     3. Odysseus weeps like a captive woman over a fallen husband.
     4. Alcinous stops the music and asks the stranger for his name, homeland,
        and reason for grief.
     5. Odysseus prepares to narrate his wanderings.

   Stage layout (back -> front, one master clock):
     the FEAST HALL AT ATTENTIVE SILENCE as the empty navigable set, full bleed:
     back wall + niche, columns, the bard's seat left, the raised narrative
     guest-seat centre, banquet tables, and every gaze-line converged on the
     hushed focus.
       -> the TROJAN-SACK MEMORY as a faint ghost field surfacing over the hall
          — the burning skyline, the wooden horse spilling its ambush, the wall
          combat and the bowed captives — the exact song welling up made visible.
       -> DEMODOCUS at the left, on the bard's seat: the blind inspired singer
          pouring the exact tale, lyre raised, unaware of the stranger's grief.
       -> ALCINOUS enthroned right: the host who catches the weeping, stops the
          music, and turns to ask the stranger his name.
       -> ODYSSEUS, foreground centre at the narrative seat: the guest who asked
          for the song and now weeps like a captive woman, then lifts his eyes,
          preparing to name himself and narrate his wanderings.
   The gift of meat, the exact song, the hidden weeping, the halted music and
   the asked name — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import feastHall from "/assets/location/feast-hall-at-attentive-silence.mjs";
import trojanMemory from "/assets/divine_fx/trojan-sack-memory.mjs";
import demodocus from "/assets/character/demodocus.mjs";
import alcinous from "/assets/character/alcinous.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B08-S05",
  title:"The Trojan Horse Song and the Name",
  book:1,
  beats:[
    "Odysseus gives Demodocus a choice cut of meat and asks for the song of the wooden horse.",
    "The bard sings the Greeks' emergence, the sack, and Odysseus's attack on Deiphobus's house.",
    "Odysseus weeps like a captive woman over a fallen husband.",
    "Alcinous stops the music and asks the stranger for his name, homeland, and reason for grief.",
    "Odysseus prepares to narrate his wanderings.",
  ],
  exitState:"Odysseus prepares to narrate his wanderings.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: hushed hall, converged gaze-lines, focus above
    // the narrative seat — full bleed, the architecture of the attentive silence
    { asset:"location.feast-hall-at-attentive-silence", instance:"hall_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the TROJAN-SACK MEMORY — the exact song surfacing as a faint ghost field
    // over the back of the hall (the wooden horse, the sack, the captives)
    { asset:"divine_fx.trojan-sack-memory", instance:"memory_01",
      anchor:{x:.50,y:.585}, scale:.56 },

    // DEMODOCUS, blind inspired bard, left on his seat: pouring the exact tale,
    // head thrown back, lyre raised — unaware of the stranger's collapse
    { asset:"character.demodocus", instance:"demodocus_01",
      anchor:{x:.175,y:.975}, scale:.52, pose:"demo_rapt", band:"front",
      blink:1, gaze:{x:0,y:0} },

    // ALCINOUS enthroned right: the gracious host, listening, then stopping the
    // music and turning to ask the weeping stranger his name and homeland
    { asset:"character.alcinous", instance:"alcinous_01",
      anchor:{x:.845,y:.975}, scale:.58, pose:"alcinous_promising", band:"front",
      gaze:{x:-.30,y:.06} },

    // ODYSSEUS, foreground centre at the narrative seat: asked for the song,
    // now weeping like a captive woman, then lifting his eyes to be named
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.500,y:.995}, scale:.50, pose:"crafty", band:"threeq",
      gaze:{x:-.34,y:-.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus gives the bard a choice cut and asks for the wooden-horse
    // song — an offering gesture turned toward Demodocus at the left
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.34,y:-.02} } },
    // beat 2: the bard takes up the exact tale — the sack surfaces behind him
    { op:"actor.pose", target:"demodocus_01", at:3.0, args:{ pose:"demo_inspired" } },
    { op:"fx.play",    target:"memory_01",    at:3.0, args:{} },
    // beat 3: hearing the exact tale of his own war, Odysseus weeps like a
    // captive woman — head bowed, eyes cast low, hidden in the guest-seat
    { op:"actor.pose", target:"odysseus_01", at:6.0,  args:{ pose:"grieving" } },
    { op:"actor.gaze", target:"odysseus_01", at:6.0,  args:{ gaze:{x:0,y:.5} } },
    // beat 4: Alcinous catches the grief, STOPS the music and turns to the
    // stranger to ask his name, homeland, and the reason for his tears
    { op:"actor.pose", target:"alcinous_01",  at:20.0, args:{ pose:"alcinous_restoring" } },
    { op:"actor.gaze", target:"alcinous_01",  at:20.0, args:{ gaze:{x:-.20,y:.12} } },
    // the music halts — the bard settles from the pouring song to a rapt stillness
    { op:"actor.pose", target:"demodocus_01", at:22.0, args:{ pose:"demo_rapt" } },
    // beat 5 (exit): Odysseus lifts his eyes to the king, gathering himself to
    // name himself and narrate his wanderings
    { op:"actor.pose", target:"odysseus_01", at:32.0, args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01", at:32.0, args:{ gaze:{x:.30,y:-.06} } },
    { op:"timeline.capture", target:"OD-B08-S05", at:38.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the hushed hall set, then the surfacing Troy memory, then the
     bard, the king, and Odysseus at the narrative seat in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "hall_01"){
        mod = feastHall;
        // the fully hushed hall: every gaze converged, the focus lifted above
        // the narrative seat; t drives only the deterministic focus shimmer
        state = { t, converge:1, hush:1 };

      } else if (c.instance === "memory_01"){
        mod = trojanMemory;
        // the exact song made visible — a faint ghost field that only begins to
        // surface once the bard takes up the tale (fx.play at 3.0). Its own clock
        // starts from that cue. Drop the "source" glyph — the real bard is the
        // source of the song.
        const mt = (s.fxT != null) ? s.fxT : Math.max(0, t - 3.0);
        state = { t:mt,
                  layers:["field","skyline","horse","warriors","combat","captives","embers"] };

      } else {
        // characters: fold pose/gaze/band/blink from the timeline; placeInstance
        // owns the anchor/scale
        mod = (c.instance === "demodocus_01") ? demodocus
            : (c.instance === "alcinous_01")  ? alcinous
            : odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
        if (c.blink != null) state.blink = c.blink;
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
