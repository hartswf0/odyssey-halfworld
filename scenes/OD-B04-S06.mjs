/* ============================================================
   SCENE  OD-B04-S06 — The Gifts and the Eagle Omen
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Menelaus urges Telemachus to remain, but the prince asks to return quickly.
     2. The king exchanges the offered horses for a mixing bowl suited to rocky Ithaca.
     3. Helen gives Telemachus a robe for his future bride.
     4. As the travelers depart, an eagle carrying a goose appears and Helen reads
        it as Odysseus's returning vengeance.

   Stage layout (back -> front):
     Menelaus's Spartan palace at the departure gate (full frame backdrop)
       -> the eagle-with-goose omen crossing the upper sky from the right
       -> the silver mixing bowl, the parting gift, held out between host and guest
       -> Menelaus at the gate, urging the prince and pressing the bowl on him
       -> Telemachus, the departing guest, receiving gift and robe
       -> Helen, giving the robe then flinging her arm up to read the sky-sign.
   One host, one guest, one queen, one gift, one omen — the whole leavetaking on
   a single clock, ending with Helen's reading of the returning vengeance.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace     from "../assets/location/menelauss-palace.mjs";
import menelaus   from "../assets/character/menelaus.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import helen      from "../assets/character/helen.mjs";
import bowl       from "../assets/prop/silver-mixing-bowl.mjs";
import eagle      from "../assets/creature/eagle-with-goose.mjs";

export const scene = {
  id:"OD-B04-S06",
  title:"The Gifts and the Eagle Omen",
  book:1,
  beats:[
    "Menelaus urges Telemachus to remain, but the prince asks to return quickly.",
    "The king exchanges the offered horses for a mixing bowl suited to rocky Ithaca.",
    "Helen gives Telemachus a robe for his future bride.",
    "As the travelers depart, an eagle carrying a goose appears and Helen reads it as Odysseus's returning vengeance.",
  ],
  exitState:"An eagle carrying a goose appears and Helen reads it as Odysseus's returning vengeance.",
  duration:34,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the Spartan palace at the gate — the leavetaking set, full frame
    { asset:"location.menelauss-palace", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"guests-only" },

    // the omen crossing the upper sky from the right: sea-eagle with a white
    // goose clenched below, the dashed augur-arc sweeping ahead of it. Placed
    // small in the upper right so it reads as a distant sign over the group;
    // its own sky/ground layers are dropped so it never overpaints the palace.
    { asset:"creature.eagle-with-goose", instance:"omen_01",
      anchor:{x:.795,y:.520}, scale:.50, pose:"cross" },

    // the parting gift: the silver mixing bowl, held out between the two men
    { asset:"prop.silver-mixing-bowl", instance:"bowl_01",
      anchor:{x:.375,y:.640}, scale:.150, pose:"display" },

    // the host at the gate, pressing the bowl on his guest
    { asset:"character.menelaus", instance:"menelaus_01",
      anchor:{x:.270,y:.905}, scale:.360, pose:"hosting",
      gaze:{x:.22,y:.06}, band:"threeq" },

    // the departing prince, receiving gift and robe, turning to go
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.520,y:.905}, scale:.345, pose:"hospitality",
      gaze:{x:-.14,y:.04}, band:"threeq" },

    // the queen: gives the robe, then flings her arm up to read the sign
    { asset:"character.helen", instance:"helen_01",
      anchor:{x:.760,y:.905}, scale:.360, pose:"neutral",
      gaze:{x:-.10,y:.04}, band:"threeq" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 1: Menelaus urges the prince to stay; Telemachus asks leave to go home
    { op:"actor.pose", target:"menelaus_01",   at:2.0,  args:{ pose:"welcoming" } },
    { op:"actor.gaze", target:"telemachus_01", at:2.5,  args:{ gaze:{x:-.20,y:.02} } },

    // beat 2: the king presses the mixing bowl on his guest in place of horses
    { op:"actor.pose", target:"menelaus_01",   at:9.0,  args:{ pose:"hosting" } },
    { op:"actor.pose", target:"bowl_01",       at:9.0,  args:{ pose:"gift" } },
    { op:"actor.gaze", target:"telemachus_01", at:9.5,  args:{ gaze:{x:-.16,y:.10} } },

    // beat 3: Helen gives Telemachus the robe for his bride
    { op:"actor.pose", target:"helen_01",      at:17.0, args:{ pose:"storytelling" } },
    { op:"actor.gaze", target:"helen_01",      at:17.0, args:{ gaze:{x:-.16,y:.06} } },
    { op:"actor.pose", target:"bowl_01",       at:17.0, args:{ pose:"carry" } },

    // beat 4: as they depart the eagle-omen crosses; Helen reads it aloud
    { op:"actor.pose", target:"telemachus_01", at:24.0, args:{ pose:"alert" } },
    { op:"actor.gaze", target:"telemachus_01", at:24.0, args:{ gaze:{x:.30,y:-.30} } },
    { op:"actor.pose", target:"omen_01",       at:25.0, args:{ pose:"clutch" } },
    { op:"actor.pose", target:"helen_01",      at:26.0, args:{ pose:"omenreading" } },
    { op:"actor.gaze", target:"helen_01",      at:26.0, args:{ gaze:{x:.28,y:-.40} } },
    { op:"actor.gaze", target:"menelaus_01",   at:26.0, args:{ gaze:{x:.30,y:-.34} } },

    { op:"timeline.capture", target:"OD-B04-S06", at:33.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: palace set, the sky-omen, the gift bowl, host, guest, queen. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "palace_01"){
        mod = palace;
        // the departure set: gate, floor, colonnade, tripods, seats — no feast
        // clutter, so the leavetaking group and the omen read cleanly
        state = { layers:["roof","backwall","gate","floor","colonnade","tripods","seats"] };
        placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
        continue;
      }

      if (c.instance === "omen_01"){
        mod = eagle;
        // drop the eagle's own sky + horizon; keep only the augur arc and the
        // raptor+goose so it floats as a distant sign over the palace gate
        const pose = s.pose || c.pose;
        state = { pose, t:t*0.6, layers:["arc","eagle"] };
        placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
        continue;
      }

      if (c.instance === "bowl_01"){
        mod = bowl;
        const pose = s.pose || c.pose;
        state = { ...(bowl.states.nodes[pose]?.preview || {}), t };
        placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
        continue;
      }

      // the three figures: fold pose/gaze/band from the timeline
      mod = c.instance === "menelaus_01" ? menelaus
          : c.instance === "telemachus_01" ? telemachus : helen;
      state = { t, band:c.band, gaze:c.gaze, ...s };
      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
