/* ============================================================
   SCENE  OD-B05-S02 — Calypso Receives the Order
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Calypso recognizes Hermes, offers ambrosia and nectar, and asks his
        purpose.
     2. Hermes reports Zeus's command and warns her against divine anger.
     3. Calypso denounces the gods' jealousy toward goddesses who love mortal
        men.
     4. She agrees to release Odysseus but says she cannot escort him herself.

   Stage layout (back -> front):
     Ogygia's cavern-and-grove set (full-bleed; the island cave where she keeps
     Odysseus, her own hearth-loom held back so the hero loom reads)
       -> Calypso's fine upright FRAME LOOM, her weaving set to the right, still
          active as the scene opens and abandoned by its close
       -> the AMBROSIA-AND-NECTAR SERVICE she sets before her divine guest,
          low and centred between the two immortals
       -> CALYPSO foreground-right, the proud host turned to the messenger —
          gracious welcome, then outrage, then the dignified release
       -> HERMES foreground-left, the swift messenger arrived with Zeus's word,
          caduceus at rest, delivering the command.
   One clock: the welcome, the order, the goddess's protest, and her reluctant
   yielding all fold onto the master time.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import location from "/assets/location/ogygia-cavern-and-grove.mjs";
import loom     from "/assets/prop/calypsos-loom.mjs";
import service  from "/assets/prop/ambrosia-and-nectar-service.mjs";
import calypso  from "/assets/character/calypso.mjs";
import hermes   from "/assets/character/hermes.mjs";

export const scene = {
  id:"OD-B05-S02",
  title:"Calypso Receives the Order",
  book:1,
  beats:[
    "Calypso recognizes Hermes, offers ambrosia and nectar, and asks his purpose.",
    "Hermes reports Zeus's command and warns her against divine anger.",
    "Calypso denounces the gods' jealousy toward goddesses who love mortal men.",
    "She agrees to release Odysseus but says she cannot escort him herself.",
  ],
  exitState:"She agrees to release Odysseus but says she cannot escort him herself.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the island cave set (full-bleed backdrop); its own loom layer held back
    { asset:"location.ogygia-cavern-and-grove", instance:"set_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"day" },

    // Calypso's fine frame loom — her weaving, set to the right, active at open
    { asset:"prop.calypsos-loom", instance:"loom_01",
      anchor:{x:.855,y:.955}, scale:.46, pose:"active-cloth" },

    // the divine hospitality she sets before the messenger, low & centred
    { asset:"prop.ambrosia-and-nectar-service", instance:"service_01",
      anchor:{x:.50,y:1.02}, scale:.40, pose:"set" },

    // Calypso, proud host, foreground-right, turned to the messenger
    { asset:"character.calypso", instance:"calypso_01",
      anchor:{x:.72,y:.975}, scale:.56, pose:"welcome",
      gaze:{x:-.16,y:-.02}, band:"front" },

    // Hermes, the swift messenger, foreground-left with the word from Zeus
    { asset:"character.hermes", instance:"hermes_01",
      anchor:{x:.28,y:.975}, scale:.54, pose:"available",
      gaze:{x:.30,y:.02}, band:"threeq" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: she knows him and sets the divine table; he is welcomed
    { op:"actor.pose", target:"service_01", at:4.0,  args:{ pose:"pour" } },
    { op:"actor.pose", target:"service_01", at:8.0,  args:{ pose:"drink" } },
    // beat 2: Hermes reports Zeus's command and warns her against divine anger
    { op:"actor.pose", target:"hermes_01",  at:11.0, args:{ pose:"delivering" } },
    { op:"actor.pose", target:"service_01", at:12.0, args:{ pose:"rest" } },
    { op:"actor.pose", target:"loom_01",    at:12.0, args:{ pose:"pause" } },
    // beat 3: Calypso rounds on the messenger — denounces the gods' jealousy
    { op:"actor.pose", target:"hermes_01",  at:20.0, args:{ pose:"available" } },
    { op:"actor.gaze", target:"hermes_01",  at:20.0, args:{ gaze:{x:.24,y:.06} } },
    { op:"actor.pose", target:"calypso_01", at:21.0, args:{ pose:"outrage" } },
    { op:"actor.gaze", target:"calypso_01", at:21.0, args:{ gaze:{x:-.20,y:-.02} } },
    // beat 4 (exit): she yields — the dignified release; the weaving abandoned
    { op:"actor.pose", target:"calypso_01", at:31.0, args:{ pose:"release" } },
    { op:"actor.gaze", target:"calypso_01", at:31.0, args:{ gaze:{x:.24,y:.12} } },
    { op:"actor.pose", target:"loom_01",    at:33.0, args:{ pose:"abandoned-work" } },
    { op:"timeline.capture", target:"OD-B05-S02", at:38.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card
     pass, so the whole tableau shares one halftone. Back -> front. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // map the service prop's timeline "pose" onto its channel state
    const serviceState = (pose)=>{
      switch(pose){
        case "pour":  return { pour:1, stream:1, fill:.5, drink:0, food:1,  glow:1, cleared:0 };
        case "drink": return { pour:0, stream:0, fill:.7, drink:1, food:.7, glow:1, cleared:0 };
        case "rest":  return { pour:0, stream:0, fill:.5, drink:0, food:.8, glow:1, cleared:0 };
        default:      return { pour:0, stream:0, fill:0,  drink:0, food:1,  glow:1, cleared:0 };
      }
    };

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "set_01"){
        mod = location;
        // hold back the set's own baked loom so the hero frame loom reads
        state = { layers:["sky","sea","floor","woods","massif","cavemouth",
                          "hearth","shore","springs","raft","vines","birds"] };
      } else if (c.instance === "loom_01"){
        mod = loom;
        state = { mode: s.pose || "active-cloth", t: t*0.5 };
      } else if (c.instance === "service_01"){
        mod = service;
        state = { ...serviceState(s.pose || "set"), t: t*0.6 };
      } else {
        // the two immortals: fold pose + gaze from the timeline; placeInstance
        // owns the anchor/scale
        mod = c.instance === "calypso_01" ? calypso : hermes;
        state = { t:0.5, band:c.band, gaze:s.gaze || c.gaze, pose:s.pose,
                  staff:true };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
