/* ============================================================
   SCENE  OD-B09-S05 — The Empty Cave
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus carries a skin of Maron's powerful wine and leads twelve men
        to a huge cave.
     2. They find cheeses, pails, whey, lambs, and kids arranged by age.
     3. The crew begs to steal food and animals and escape.
     4. Odysseus refuses because he wants to meet the owner and receive a
        guest-gift.

   Stage layout (back -> front, one master clock):
     POLYPHEMUS'S CAVE as the empty navigable set, full bleed: the great
     vaulted rock ceiling, the bright arched entrance-mouth at back with the
     door-boulder rolled aside, the central fire-ring, the giant's sleeping
     ledge, the wall cheese-racks, the line of milk pails, the age-sorted
     animal pens.
       -> the CHEESE RACKS AND MILK VESSELS as a hero dairy-store cluster
          drawn large at the point the crew gather — the cheeses, pails and
          whey they find arranged by age.
       -> the TWELVE SAILORS, the expedition read as one arc across the clock:
          they marvel (awe), shrink together and press their case (huddle),
          then point to the mouth and snatch loot to flee (urge-flee).
       -> MARON'S WINE SKIN, the potent Ismarus gift carried at Odysseus's
          side — the guest-offering he keeps sealed for the cave's owner.
       -> ODYSSEUS, foreground right: leads them in, hears the begging, and
          refuses — turning his eyes to the empty threshold, set on meeting the
          owner and receiving a guest-gift.
   The carried wine, the store found, the crew's plea and the captain's fatal
   refusal — all held on one clock in a single still.
   ============================================================ */
import { placeInstance, clamp, clamp01, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import cave from "../assets/location/polyphemuss-cave.mjs";
import cheeseStore from "../assets/prop/cheese-racks-and-milk-vessels.mjs";
import twelveSailors from "../assets/ensemble/twelve-sailors.mjs";
import wineSkin from "../assets/prop/marons-wine-skin.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B09-S05",
  title:"The Empty Cave",
  book:1,
  beats:[
    "Odysseus carries a skin of Maron's powerful wine and leads twelve men to a huge cave.",
    "They find cheeses, pails, whey, lambs, and kids arranged by age.",
    "The crew begs to steal food and animals and escape.",
    "Odysseus refuses because he wants to meet the owner and receive a guest-gift.",
  ],
  exitState:"Odysseus refuses because he wants to meet the owner and receive a guest-gift.",
  duration:42,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: vaulted cavern, bright entrance-mouth, fire-ring,
    // sleeping ledge, wall cheese-racks, milk pails, age-sorted pens — full bleed
    { asset:"location.polyphemuss-cave", instance:"cave_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the CHEESE RACKS AND MILK VESSELS — the dairy store made large where the
    // crew gather: rack of round cheeses, brimming pails, whey
    { asset:"prop.cheese-racks-and-milk-vessels", instance:"store_01",
      anchor:{x:.27,y:.99}, scale:.40, pose:"stocked" },

    // the TWELVE SAILORS — the expedition: marvel -> press their case -> urge
    // to snatch loot and flee back to the daylight of the mouth
    { asset:"ensemble.twelve-sailors", instance:"crew_01",
      anchor:{x:.53,y:1.00}, scale:.60 },

    // MARON'S WINE SKIN — the potent Ismarus gift carried at Odysseus's side,
    // kept sealed for the owner of the cave
    { asset:"prop.marons-wine-skin", instance:"wine_01",
      anchor:{x:.795,y:.90}, scale:.22, pose:"carried" },

    // ODYSSEUS, foreground right: leads the men in, hears the begging, and
    // refuses — set on meeting the owner and receiving a guest-gift
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.86,y:1.00}, scale:.46, pose:"neutral", band:"threeq",
      gaze:{x:-.28,y:.04} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t). The prop/ensemble
  // states are driven from the master clock in stage(); Odysseus's pose+gaze
  // fold through the timeline here.
  timeline:[
    // beat 1: Odysseus leads the men into the huge cave, the wine at his side,
    // eyeing the store and the empty threshold
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.28,y:.04} } },
    // beat 2: the crew find the arranged store — Odysseus watches them marvel
    { op:"actor.gaze", target:"odysseus_01", at:10.0, args:{ gaze:{x:-.40,y:.02} } },
    // beat 3: the crew beg to snatch the food and flee — Odysseus turns to them
    // and REFUSES, the crafty raised palm holding them back
    { op:"actor.pose", target:"odysseus_01", at:22.0, args:{ pose:"crafty" } },
    { op:"actor.gaze", target:"odysseus_01", at:22.0, args:{ gaze:{x:-.36,y:-.02} } },
    // beat 4 (exit): he sets his mind on the owner and a guest-gift — turning his
    // eyes to the bright empty entrance, awaiting the host
    { op:"actor.pose", target:"odysseus_01", at:34.0, args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01", at:34.0, args:{ gaze:{x:-.20,y:-.10} } },
    { op:"timeline.capture", target:"OD-B09-S05", at:40.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the cave set, the hero dairy store, the twelve-sailor arc,
     the carried wine skin, then Odysseus foreground right. The prop + ensemble
     read their progression off the master clock deterministically. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const p  = clamp01(t / scene.duration);   // 0..1 across the scene

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "cave_01"){
        mod = cave;
        // the full empty cave, mouth open with the boulder rolled aside, fire lit
        state = { t,
                  layers:["recesses","vault","backwall","entrance","boulder","sleeping",
                          "floor","cheese","pens","pails","fire"] };

      } else if (c.instance === "store_01"){
        mod = cheeseStore;
        // the store stands stocked and orderly; late in the scene one wheel is
        // lifted as the crew begin snatching at the loot they beg to take
        state = { t, stock:1, milk:0.85, curdle:0, spill:0, stream:0,
                  handled: t > 26 ? 1 : 0, cut:0 };

      } else if (c.instance === "crew_01"){
        mod = twelveSailors;
        // the expedition arc off one clock: marvel -> shrink + press their case
        // -> point to the mouth and snatch loot to flee
        const formation = t < 12 ? "awe"
                        : t < 24 ? "huddle"
                        : "urge-flee";
        state = { formation,
                  fear:      lerp(0.25, 0.90, p),
                  attention: lerp(0.45, 0.92, p),
                  spread:1.0, density:1.0 };

      } else if (c.instance === "wine_01"){
        mod = wineSkin;
        // Maron's gift slung and carried at his side, kept sealed for the owner
        state = { t, fill:0.95, tilt:-0.14, open:false, strap:true };

      } else {
        // ODYSSEUS: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
