/* ============================================================
   SCENE  OD-B02-S06 — The Secret Stores
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Telemachus returns among the suitors and refuses Antinous's false
        friendliness (carried in as a hard, level command in his bearing).
     2. He enters the locked storeroom filled with metal, cloth, oil, wine, and
        meal (location.palace-storeroom, stocked, doors open behind him).
     3. He orders Eurycleia to prepare twelve jars of wine and twenty measures
        of barley (prop.travel-wine-jars filled+sealed; prop.barley-bags tied).
     4. Eurycleia protests in fear, then swears not to tell Penelope
        (character.eurycleia: neutral -> alarmed -> weeping -> secretive).

   Stage layout (back -> front):
     storeroom set  ->  travel wine jars (left store)  ->  barley bags (right
     store)  ->  Eurycleia (right of the aisle)  ->  Telemachus (left of the
     aisle, commanding).
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import storeroom   from "../assets/location/palace-storeroom.mjs";
import wineJars    from "../assets/prop/travel-wine-jars.mjs";
import barleyBags  from "../assets/prop/barley-bags.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import eurycleia   from "../assets/character/eurycleia.mjs";

export const scene = {
  id:"OD-B02-S06",
  title:"The Secret Stores",
  book:1,
  beats:[
    "Telemachus returns among the suitors and refuses Antinous's false friendliness.",
    "He enters the locked storeroom filled with metal, cloth, oil, wine, and meal.",
    "He orders Eurycleia to prepare twelve jars of wine and twenty measures of barley.",
    "Eurycleia protests in fear, then swears not to tell Penelope.",
  ],
  exitState:"Eurycleia protests in fear, then swears not to tell Penelope.",
  duration:30,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the vaulted secure chamber — the whole set, doors open at the back
    { asset:"location.palace-storeroom", instance:"storeroom_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"doors-open" },

    // twelve travel-wine jars ranked in the left store, filled and sealed
    { asset:"prop.travel-wine-jars", instance:"wine_jars_01",
      anchor:{x:.205,y:.90}, scale:.34, pose:"sealed" },

    // twenty measures of barley — bags tied at the right store
    { asset:"prop.barley-bags", instance:"barley_bags_01",
      anchor:{x:.805,y:.90}, scale:.34, pose:"tie" },

    // the faithful nurse, right of the aisle, moving from alarm to secrecy
    { asset:"character.eurycleia", instance:"eurycleia_01",
      anchor:{x:.635,y:.985}, scale:.74, pose:"eury_alarm", gaze:{x:-.16,y:-.04}, band:"front" },

    // the prince, left of the aisle, giving the secret order
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.375,y:.985}, scale:.80, pose:"confrontation", gaze:{x:.28,y:-.04}, band:"front" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 3: the prince gives the order, turned toward the nurse
    { op:"actor.pose", target:"telemachus_01", at:2.0,  args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus_01", at:2.0,  args:{ gaze:{x:.30,y:-.02} } },
    // beat 4: Eurycleia's arc — alarm -> tears -> disciplined secrecy
    { op:"actor.pose", target:"eurycleia_01",  at:4.0,  args:{ pose:"eury_alarm" } },
    { op:"actor.pose", target:"eurycleia_01",  at:12.0, args:{ pose:"eury_weep" } },
    { op:"actor.gaze", target:"eurycleia_01",  at:12.0, args:{ gaze:{x:.04,y:.46} } },
    { op:"actor.pose", target:"eurycleia_01",  at:22.0, args:{ pose:"eury_hush" } },
    { op:"actor.gaze", target:"eurycleia_01",  at:22.0, args:{ gaze:{x:.18,y:.02} } },
    { op:"timeline.capture", target:"OD-B02-S06", at:29.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // per-instance expressive extras stateAt() doesn't fold, and prop layout state
    const extra = {
      storeroom_01:   { layers:["vault","backwall","shelves","floor","foreground"] },
      wine_jars_01:   { fill:0.9, sealed:true, rack:false, pole:false },
      barley_bags_01: { layout:"row", open:0 },
      telemachus_01:  { mouth:-.2 },
      eurycleia_01:   {},
    };

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const mod = c.instance === "storeroom_01"   ? storeroom
                : c.instance === "wine_jars_01"   ? wineJars
                : c.instance === "barley_bags_01" ? barleyBags
                : c.instance === "telemachus_01"  ? telemachus
                : eurycleia;
      const state = { ...(extra[c.instance] || {}), ...s };
      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
