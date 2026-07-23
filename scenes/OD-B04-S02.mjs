/* ============================================================
   SCENE  OD-B04-S02 — Recognition through Tears
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Menelaus speaks of Odysseus and Telemachus hides his tears behind his cloak.
     2. Helen enters, recognizes Telemachus by resemblance, and names him aloud.
     3. Pisistratus confirms the identity and recalls his own dead brother Antilochus.
     4. All four weep until Menelaus calls for the mourning to end with the meal.

   Stage layout (back -> front):
     Menelaus's luminous hall (full-frame set, wedding-feast dressing)
       -> the SHARED-MOURNING grief-field (field + collapse-lattice + the
          spoken-name source at center) binding the four through a common
          center — its own mourner-bodies are dropped so the four REAL
          characters occupy the bound positions
       -> Helen (far-left, entering radiant, the recognition arriving whole)
       -> Pisistratus (far-right, confirming, then bowed on his dead brother)
       -> Telemachus (near-left foreground, tears hidden behind the cloak)
       -> Menelaus (near-right foreground, the host who speaks the name and,
          at the last, calls the mourning to end with the meal).

   Exit / continuity: all four weep until Menelaus calls for the mourning to
   end with the meal.
   ============================================================ */
import { placeInstance, clamp, clamp01, lerp } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace      from "/assets/location/menelauss-palace.mjs";
import mourning    from "/assets/divine_fx/shared-mourning.mjs";
import helen       from "/assets/character/helen.mjs";
import menelaus    from "/assets/character/menelaus.mjs";
import telemachus  from "/assets/character/telemachus.mjs";
import pisistratus from "/assets/character/pisistratus.mjs";

/* grief g(t): one field read by every body. Rises from the first spoken name
   to the shared weeping, holds through beat 4, then RECEDES when Menelaus calls
   the mourning to end with the meal. Deterministic — no Date/random. */
function griefRamp(t){
  if (t <= 24) return lerp(0.20, 1.0, clamp01(t/24));   // onset -> shared weeping
  if (t <= 34) return 1.0;                                // beat 4: all four weep
  return lerp(1.0, 0.30, clamp01((t-34)/6));              // Menelaus ends it with the meal
}

export const scene = {
  id:"OD-B04-S02",
  title:"Recognition through Tears",
  book:1,
  beats:[
    "Menelaus speaks of Odysseus and Telemachus hides his tears behind his cloak.",
    "Helen enters, recognizes Telemachus by resemblance, and names him aloud.",
    "Pisistratus confirms the identity and recalls his own dead brother Antilochus.",
    "All four weep until Menelaus calls for the mourning to end with the meal.",
  ],
  exitState:"All four weep until Menelaus calls for the mourning to end with the meal.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the luminous hall, wedding-feast dressing — the whole room in one set
    { asset:"location.menelauss-palace", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"hall-set" },

    // the grief-field: the spoken name gathers at center and the collapse-
    // lattice binds the four — mourner-bodies dropped so the real cast stand in
    { asset:"divine_fx.shared-mourning", instance:"grief_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"mourning" },

    // Helen — far-left, entering radiant; recognition arriving whole
    { asset:"character.helen", instance:"helen_01",
      anchor:{x:.320,y:.605}, scale:.360, pose:"neutral",
      gaze:{x:-.06,y:.10}, band:"front" },

    // Pisistratus — far-right, confirms the identity, then bows on his brother
    { asset:"character.pisistratus", instance:"pisistratus_01",
      anchor:{x:.680,y:.605}, scale:.360, pose:"three_quarter_right",
      gaze:{x:-.14,y:.18}, band:"threeq" },

    // Telemachus — near-left foreground, tears hidden behind the cloak
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.255,y:.955}, scale:.440, pose:"grieving",
      gaze:{x:-.12,y:.60}, band:"front" },

    // Menelaus — near-right foreground, host who speaks the name of Odysseus
    { asset:"character.menelaus", instance:"menelaus_01",
      anchor:{x:.755,y:.955}, scale:.470, pose:"welcoming",
      gaze:{x:-.20,y:.14}, band:"front" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 1: Menelaus's memory of Odysseus tips toward recognition; Telemachus
    // is already bowed, hiding his tears behind the cloak (his cast pose)
    { op:"actor.pose", target:"menelaus_01",    at:5.0,  args:{ pose:"recognition" } },
    { op:"actor.gaze", target:"menelaus_01",    at:5.0,  args:{ gaze:{x:.14,y:.34} } },

    // beat 2: Helen enters, recognizes Telemachus by resemblance, names him
    { op:"actor.pose", target:"helen_01",       at:6.0,  args:{ pose:"recognizing" } },
    { op:"actor.gaze", target:"helen_01",       at:6.0,  args:{ gaze:{x:-.10,y:.26} } },

    // beat 3: Pisistratus confirms, then bows recalling his dead brother
    { op:"actor.gaze", target:"pisistratus_01", at:16.0, args:{ gaze:{x:-.10,y:.40} } },

    // beat 4: all four weep together at full grief
    { op:"actor.pose", target:"menelaus_01",    at:26.0, args:{ pose:"grieving" } },
    { op:"actor.gaze", target:"menelaus_01",    at:26.0, args:{ gaze:{x:.02,y:.50} } },

    // beat 4 exit: Menelaus lifts and calls the mourning to end with the meal
    { op:"actor.pose", target:"menelaus_01",    at:36.0, args:{ pose:"hosting" } },
    { op:"actor.gaze", target:"menelaus_01",    at:36.0, args:{ gaze:{x:-.12,y:.04} } },

    { op:"timeline.capture", target:"OD-B04-S02", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: hall set, grief-field, far pair (Helen, Pisistratus),
     near pair (Telemachus, Menelaus). */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const grief = griefRamp(t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "palace_01"){
        mod = palace;
        // the hall dressed for the feast: architecture + seats + laid table
        state = { layers:["roof","backwall","gate","floor","colonnade",
                           "tripods","seats","feast"] };
      } else if (c.instance === "grief_01"){
        mod = mourning;
        // collapse-lattice + spoken-name source ONLY — drop the FX's flat
        // field-wash (so the hall set behind reads) AND its mourner-bodies (so
        // the four real characters hold the bound positions). The grief g(t) is
        // the scene's shared read, folded on the master clock.
        state = { layers:["lattice","source"], grief, t };
      } else {
        // the four mourners: fold pose/gaze/band from the timeline; the grief
        // read gives a small synchronous breath-bow so the group weeps as one
        mod = c.instance === "helen_01"       ? helen
            : c.instance === "menelaus_01"    ? menelaus
            : c.instance === "telemachus_01"  ? telemachus
            : pisistratus;
        const bow = grief * 0.010 * Math.sin(t*0.9 + c.anchor.x*6);
        state = { t, band:c.band, gaze:c.gaze, ...s, anchor:undefined };
        placeInstance(offctx, W, H, mod, {
          anchor:{ x:c.anchor.x, y:c.anchor.y + bow }, scale:c.scale, state });
        continue;
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
