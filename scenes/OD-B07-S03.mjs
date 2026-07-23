/* ============================================================
   SCENE  OD-B07-S03 — Supplication at Arete's Knees
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Athena's mist falls away only when Odysseus reaches Arete.
     2. He clasps her knees and asks passage home, then sits humbly in the ashes
        by the hearth.
     3. The hall remains silent until the elder Echeneus tells Alcinous to raise
        the suppliant.
     4. Odysseus is seated beside the king, fed, and promised a convoy home.

   Stage layout (back -> front, one master clock):
     the ROYAL HEARTH as the empty navigable set, full bleed: the lit stone
     fire-ring, the ash bed, the supplication slab in front, the rise-assist
     post, and the guest-seat to the right — the whole architecture of the rite.
       -> ALCINOUS enthroned right, by the guest-seat: first stunned by the
          stranger at his hearth, then rising to raise and welcome him.
       -> ARETE, the crowned queen, centre-right: the appeal is made to HER
          first — she receives it, still and shrewd, weighing the suppliant.
       -> ECHENEUS, the eldest counsellor, left: grave in the silence, then
          risen with the admonishing finger to bid the king lift the guest.
       -> ODYSSEUS, foreground centre, low at the queen's knees in the ashes —
          the suppliant clasping her knees and asking passage home.
   The mist's falling, the clasped knees, the broken silence, and the guest
   raised and promised his ship — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import hearth    from "/assets/set_piece/royal-hearth.mjs";
import alcinous  from "/assets/character/alcinous.mjs";
import arete     from "/assets/character/arete.mjs";
import echeneus  from "/assets/character/echeneus.mjs";
import odysseus  from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B07-S03",
  title:"Supplication at Arete's Knees",
  book:1,
  beats:[
    "Athena's mist falls away only when Odysseus reaches Arete.",
    "He clasps her knees and asks passage home, then sits humbly in the ashes by the hearth.",
    "The hall remains silent until the elder Echeneus tells Alcinous to raise the suppliant.",
    "Odysseus is seated beside the king, fed, and promised a convoy home.",
  ],
  exitState:"Odysseus is seated beside the king, fed, and promised a convoy home.",
  duration:46,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: lit fire-ring, ash bed, supplication slab,
    // rise-assist post, guest-seat — full bleed, the architecture of the rite
    { asset:"set-piece.royal-hearth", instance:"hearth_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // ALCINOUS enthroned at the right, by the guest-seat: first stunned by the
    // stranger, then rising to raise and welcome him and pledge the ship
    { asset:"character.alcinous", instance:"alcinous_01",
      anchor:{x:.855,y:.965}, scale:.60, pose:"alcinous_stunned", band:"front",
      gaze:{x:-.34,y:.16} },

    // ARETE, crowned queen, centre-right: the appeal is made to HER first —
    // she receives it, still and shrewd, weighing the suppliant at her knees
    { asset:"character.arete", instance:"arete_01",
      anchor:{x:.665,y:.965}, scale:.62, pose:"arete_receive", band:"front",
      gaze:{x:-.20,y:.24} },

    // ECHENEUS, eldest counsellor, left: grave in the silence, then risen with
    // the admonishing finger to bid the king lift the guest
    { asset:"character.echeneus", instance:"echeneus_01",
      anchor:{x:.155,y:.975}, scale:.58, pose:"ech_grave", band:"front",
      gaze:{x:.30,y:.06} },

    // ODYSSEUS, foreground centre, low at the queen's knees in the ashes — the
    // suppliant clasping her knees and asking passage home (raised at the close)
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.475,y:.985}, scale:.475, pose:"grieving", band:"threeq",
      gaze:{x:.34,y:-.30} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the mist falls away as he reaches Arete — he lifts his eyes to the
    // queen at whose knees he has come to ground
    { op:"actor.gaze", target:"odysseus_01", at:2.0,  args:{ gaze:{x:.34,y:-.32} } },
    // beat 2: he clasps her knees and asks passage home; she receives the appeal,
    // still and shrewd, and he settles humbly into the ashes
    { op:"actor.pose", target:"arete_01",    at:5.0,  args:{ pose:"arete_receive" } },
    { op:"actor.gaze", target:"arete_01",    at:5.0,  args:{ gaze:{x:-.22,y:.26} } },
    { op:"actor.pose", target:"odysseus_01", at:6.0,  args:{ pose:"grieving" } },
    // beat 3: the hall holds silent — Alcinous stunned, Echeneus grave — until
    // the eldest rises with the admonishing finger to bid the king raise him
    { op:"actor.pose", target:"echeneus_01", at:16.0, args:{ pose:"ech_rising" } },
    { op:"actor.gaze", target:"echeneus_01", at:16.0, args:{ gaze:{x:.20,y:-.06} } },
    { op:"actor.pose", target:"echeneus_01", at:22.0, args:{ pose:"ech_advising" } },
    // Alcinous obeys the counsel — reaches down to raise the suppliant
    { op:"actor.pose", target:"alcinous_01", at:24.0, args:{ pose:"alcinous_raising" } },
    { op:"actor.gaze", target:"alcinous_01", at:24.0, args:{ gaze:{x:-.14,y:.28} } },
    // beat 4 (exit): Odysseus is raised up and seated beside the king, fed, and
    // promised a convoy home — he rises from the ashes to the guest-seat
    { op:"actor.move", target:"odysseus_01", at:30.0, args:{ anchor:{x:.735,y:.985} } },
    { op:"actor.pose", target:"odysseus_01", at:30.0, args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:30.0, args:{ gaze:{x:.18,y:-.02} } },
    { op:"actor.pose", target:"echeneus_01", at:31.0, args:{ pose:"ech_welcome" } },
    { op:"actor.pose", target:"alcinous_01", at:34.0, args:{ pose:"alcinous_promising" } },
    { op:"actor.gaze", target:"alcinous_01", at:34.0, args:{ gaze:{x:-.10,y:.02} } },
    { op:"timeline.capture", target:"OD-B07-S03", at:45.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the hearth set, then Alcinous, Arete, Echeneus, and Odysseus
     foreground at the queen's knees. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "hearth_01"){
        mod = hearth;
        // the full lit fire-ring rite: fire + ash bed + supplication slab +
        // rise-assist post + guest-seat; t drives only the deterministic flicker
        state = { lit:true, t,
                  layers:["hall","floor","drum","rim","ashbed","fire","smoke",
                          "slab","post","seat"] };
      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "alcinous_01") ? alcinous
            : (c.instance === "arete_01")    ? arete
            : (c.instance === "echeneus_01") ? echeneus
            : odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
