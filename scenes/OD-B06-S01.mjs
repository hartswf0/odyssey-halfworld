/* ============================================================
   SCENE  OD-B06-S01 — Athena Enters Nausicaa's Dream
   A thin Halfworld COMPOSITION module. It places existing atlas assets on one
   master clock; it never redraws them. The engine runs ONE dotify + scene card
   pass over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Athena reaches the palace of Alcinous and enters Nausicaa's chamber in
        the likeness of a friend.
     2. She reproaches the princess for leaving fine clothes unwashed before
        marriage.
     3. Nausicaa wakes, asks her father for a wagon, and conceals the marriage
        motive.
     4. Alcinous orders the mule cart prepared; her mother packs food, wine,
        and oil.

   Staging (a left->right causal tableau on one clock, back -> front):
     the Phaeacian royal chamber frames the WHOLE set (the protected princess
     bedroom, its dream-entry window admitting the goddess's descent)
       -> the dream-companion FX pools on the LEFT over the bed (beats 1-2 —
          Athena bent close as a familiar girl, whispering the reproach at the
          sleeper's ear)
       -> Nausicaa herself stands CENTER, newly woken and taking practical
          initiative (beat 3 — the girl who wakes from the dream and asks for
          the wagon, the marriage motive kept inside)
       -> the laundry wagon stands READIED at the RIGHT (beat 4 / exit — the
          mule cart prepared, the load aboard)
       -> the sorted laundry bundles ride FOREGROUND by the cart (beat 4 — the
          fine clothes packed with the mother's food, wine, and oil).
   Dream on the left, waking princess at the center, the readied cart on the
   right — the whole morning read on one clock.
   ============================================================ */
import { placeInstance, clamp, clamp01, lerp, smooth } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import chamber  from "/assets/location/phaeacian-royal-chamber.mjs";
import dreamFx  from "/assets/divine_fx/athena-as-dream-companion.mjs";
import nausicaa from "/assets/character/nausicaa.mjs";
import wagon    from "/assets/vehicle/laundry-wagon.mjs";
import bundles  from "/assets/prop/laundry-bundles.mjs";

export const scene = {
  id:"OD-B06-S01",
  title:"Athena Enters Nausicaa's Dream",
  book:1,

  beats:[
    "Athena reaches the palace of Alcinous and enters Nausicaa's chamber in the likeness of a friend.",
    "She reproaches the princess for leaving fine clothes unwashed before marriage.",
    "Nausicaa wakes, asks her father for a wagon, and conceals the marriage motive.",
    "Alcinous orders the mule cart prepared; her mother packs food, wine, and oil.",
  ],
  exitState:"Alcinous orders the mule cart prepared; her mother packs food, wine, and oil.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // back -> front
    // the whole set: the protected princess chamber, its dream-entry window
    // glowing as the goddess descends (beats 1-4 all play inside this room).
    { asset:"location.phaeacian-royal-chamber", instance:"chamber_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"dream-entry" },

    // beats 1-2: the dream-companion, LEFT over the bed — Athena as a familiar
    // girl bent close over the sleeping princess, whispering the reproach.
    { asset:"divine_fx.athena-as-dream-companion", instance:"athena_01",
      anchor:{x:.255,y:.955}, scale:.56, pose:"whispering" },

    // beat 4 / exit: the laundry wagon, RIGHT — the mule cart readied, standing
    // with its wash, food basket, and oil flask aboard.
    { asset:"vehicle.laundry-wagon", instance:"wagon_01",
      anchor:{x:.815,y:.995}, scale:.50, pose:"parked" },

    // beat 4: the sorted royal linen, FOREGROUND by the cart — the fine clothes
    // folded and readied to be packed with the mother's provisions.
    { asset:"prop.laundry-bundles", instance:"bundles_01",
      anchor:{x:.605,y:1.00}, scale:.30, pose:"folded" },

    // beat 3: the princess herself, CENTER, newly woken and directing — she asks
    // her father for the wagon, the marriage motive kept quietly inside.
    { asset:"character.nausicaa", instance:"nausicaa_01",
      anchor:{x:.445,y:.985}, scale:.58, pose:"nausicaa_dreaming",
      gaze:{x:.3,y:-.2}, band:"front" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beats 1-2: she still sleeps, wonder held inside the dream
    { op:"actor.pose", target:"nausicaa_01", at:0.0,  args:{ pose:"nausicaa_dreaming" } },
    { op:"actor.gaze", target:"nausicaa_01", at:0.0,  args:{ gaze:{x:.3,y:-.24} } },
    // beat 1: the dream-companion arrives, bends close, and begins the whisper
    { op:"fx.play",    target:"athena_01",   at:0.5,  args:{} },
    // beat 3: she wakes and takes practical initiative — the near hand points the
    // way as she asks for the wagon, gaze thrown toward the readied cart.
    { op:"actor.pose", target:"nausicaa_01", at:4.0,  args:{ pose:"nausicaa_directing" } },
    { op:"actor.gaze", target:"nausicaa_01", at:4.0,  args:{ gaze:{x:.4,y:.02} } },
    { op:"timeline.capture", target:"OD-B06-S01", at:38.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify + card
     pass. Back -> front: the chamber set, the dream FX (left), the readied
     wagon (right) and its laundry, then the woken princess in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the dream apparition animates 0 -> 1; map the clock so a single render lands
    // Athena mid-whisper (~0.46), bent close over the sleeper.
    const fxT = clamp01((t - 0.5) / 15.0);
    // the princess is speaking once she wakes (asking her father for the wagon).
    const speaking = t >= 4;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "chamber_01"){
        mod = chamber;
        // the protected chamber with the dream-entry window glow spilling to the bed
        state = { layers:["backwall","window","doorways","alcoves","floor","bed","dreamfield"],
                  morning:0.35, dream:0.9, t };
      } else if (c.instance === "athena_01"){
        mod = dreamFx;
        // the familiar-girl apparition bent close, whisper-lines to the sleeper's ear
        state = { t:fxT, intensity:1.0, glow:1.0,
                  layers:["chamber","bed","girl","whisper","motes"] };
      } else if (c.instance === "wagon_01"){
        mod = wagon;
        // the mule cart readied and standing, load aboard, mule in the traces
        state = { mode:"parked", showMule:true, t:0.5 };
      } else if (c.instance === "bundles_01"){
        mod = bundles;
        // the sorted royal linen, folded and readied to be packed
        state = { layout:"folded", t:0.5 };
      } else { // nausicaa_01
        mod = nausicaa;
        state = { t:0.5, band:c.band, pose:s.pose, gaze:s.gaze,
                  mouth: speaking ? 0.5 : 0.12 };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
