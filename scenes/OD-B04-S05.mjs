/* ============================================================
   SCENE  OD-B04-S05 — Menelaus Wrestles Proteus
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Telemachus asks directly for news of Odysseus.
     2. Menelaus recounts being trapped in Egypt until Eidothea taught him to
        seize Proteus.
     3. He and three men hid beneath sealskins and grappled the Old Man of the Sea.
     4. Proteus changed into beasts, water, and a tree before yielding prophecy.
     5. He revealed that Odysseus lived, detained by Calypso on an island.

   Stage layout (back -> front):
     the Egyptian seal beach of Pharos (sun, sea, surf boundary, seal herd,
     grapple zone, full frame)
       -> Eidothea off at the left, instructing — the sea-goddess who taught
          the ambush (the recounted counsel that set the trap)
       -> the Proteus transformation chain rising in the seam between the
          wrestlers — lion · serpent · leopard · boar · water · tree, the two
          grip marks pinned while the shape cycles underneath
       -> Proteus, the Old Man of the Sea, gripped and shifting (center-right)
       -> Menelaus braced and crouched into the hold, both fists hauled in,
          refusing to let go until the prophecy comes (foreground).
   The beach supplies the whole ambush ground; Eidothea's counsel frames it;
   the chain shows the metamorphosis; the two figures hold the causal center —
   the grapple that wrings the news of Odysseus from the sea.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import beach     from "../assets/location/seal-beach.mjs";
import eidothea  from "../assets/character/eidothea.mjs";
import chain     from "../assets/divine_fx/proteus-transformation-chain.mjs";
import proteus   from "../assets/character/proteus.mjs";
import menelaus  from "../assets/character/menelaus.mjs";

// the six links of the metamorphosis, in the order Proteus cycles them
const MORPH = ["lion","serpent","leopard","boar","water","tree"];
// map each Proteus shape node to his bespoke shifting pose
const MORPH_POSE = {
  prophet:"proteus_prophet", lion:"proteus_lion", serpent:"proteus_serpent",
  leopard:"proteus_leopard", boar:"proteus_boar", water:"proteus_water",
  tree:"proteus_tree",
};

export const scene = {
  id:"OD-B04-S05",
  title:"Menelaus Wrestles Proteus",
  book:1,
  beats:[
    "Telemachus asks directly for news of Odysseus.",
    "Menelaus recounts being trapped in Egypt until Eidothea taught him to seize Proteus.",
    "He and three men hid beneath sealskins and grappled the Old Man of the Sea.",
    "Proteus changed into beasts, water, and a tree before yielding prophecy.",
    "He revealed that Odysseus lived, detained by Calypso on an island.",
  ],
  exitState:"He revealed that Odysseus lived, detained by Calypso on an island.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the Egyptian shore of Pharos — sun, sea, surf boundary, basking seal herd,
    // the scuffed grapple ring where the sea-god is seized: the whole ambush set
    { asset:"location.seal-beach", instance:"beach_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"seized" },

    // Eidothea off at the left — daughter of Proteus, who pitied Menelaus and
    // taught him the ambush; staged smaller as the recounted counsel
    { asset:"character.eidothea", instance:"eidothea_01",
      anchor:{x:.145,y:.865}, scale:.30, pose:"instructing",
      gaze:{x:.34,y:.02}, band:"threeq" },

    // the transformation chain rising over the wrestlers as a vision — the morph
    // the grip can't shake; the pinned contact marks + the six-shape strip. Kept
    // clear of the noon sun and staged as a contained diagram above the struggle.
    { asset:"divine_fx.proteus-transformation-chain", instance:"chain_01",
      anchor:{x:.505,y:.560}, scale:.40, pose:"lion" },

    // Proteus, the Old Man of the Sea — gripped and shifting, wary prophet at rest
    { asset:"character.proteus", instance:"proteus_01",
      anchor:{x:.680,y:.910}, scale:.42, pose:"proteus_prophet",
      gaze:{x:-.34,y:.18}, band:"threeq" },

    // Menelaus braced into the hold, both fists hauled in, will not let go
    { asset:"character.menelaus", instance:"menelaus_01",
      anchor:{x:.355,y:.950}, scale:.46, pose:"menelaus_grapple",
      gaze:{x:.30,y:.08}, band:"threeq" },
  ],

  // ordered ops on ONE clock (render is sampled at --t). The scene folds the
  // whole recollection off one timeline: the counsel, the seizing, the cycling
  // metamorphosis, and the yielded prophecy.
  timeline:[
    // beat 2: Eidothea speaks the counsel that lays out the trap
    { op:"actor.pose", target:"eidothea_01", at:4.0,  args:{ pose:"speaking" } },
    { op:"actor.pose", target:"eidothea_01", at:9.0,  args:{ pose:"instructing" } },

    // beat 4: Proteus runs the chain of shapes while Menelaus holds the grip.
    // one shape per beat of the sweep; Menelaus stays clenched throughout.
    { op:"actor.pose", target:"proteus_01",  at:12.0, args:{ pose:"proteus_lion" } },
    { op:"actor.gaze", target:"proteus_01",  at:12.0, args:{ gaze:{x:.05,y:0} } },
    { op:"actor.pose", target:"proteus_01",  at:16.0, args:{ pose:"proteus_serpent" } },
    { op:"actor.gaze", target:"proteus_01",  at:16.0, args:{ gaze:{x:.60,y:.04} } },
    { op:"actor.pose", target:"proteus_01",  at:20.0, args:{ pose:"proteus_leopard" } },
    { op:"actor.pose", target:"proteus_01",  at:24.0, args:{ pose:"proteus_boar" } },
    { op:"actor.gaze", target:"proteus_01",  at:24.0, args:{ gaze:{x:.10,y:.40} } },
    { op:"actor.pose", target:"proteus_01",  at:28.0, args:{ pose:"proteus_water" } },
    { op:"actor.pose", target:"proteus_01",  at:32.0, args:{ pose:"proteus_tree" } },
    { op:"actor.gaze", target:"proteus_01",  at:32.0, args:{ gaze:{x:0,y:-.28} } },

    // beat 5: exhausted, the shape-shifter yields and prophesies — Odysseus lives
    { op:"actor.pose", target:"proteus_01",  at:35.5, args:{ pose:"proteus_prophet" } },
    { op:"actor.gaze", target:"proteus_01",  at:35.5, args:{ gaze:{x:-.34,y:.20} } },

    { op:"timeline.capture", target:"OD-B04-S05", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: beach set, Eidothea, the transformation chain, Proteus,
     Menelaus. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the metamorphosis sweeps the chain over the grapple beats (t 12..34). The
    // FX param t is 0..1 across the six shapes; before/after it holds the ends.
    const fxT = clamp01((t - 12) / 22);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "beach_01"){
        mod = beach;
        // the seized moment: herd still basking, the scuffed grapple ring shown,
        // hollows now abandoned as the men break from cover
        state = { layers:["sky","sun","sea","headland","surf","beach","herd","grapple","arrival"] };
        placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
        continue;
      }

      if (c.instance === "chain_01"){
        mod = chain;
        state = { t:fxT, layers:["field","ghost","form","grips","strip"] };
        placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
        continue;
      }

      // the three figures: fold pose/gaze/band from the timeline. A small strain
      // tremor on the grapple so the hold reads as a living struggle.
      mod = c.instance === "eidothea_01" ? eidothea
          : c.instance === "proteus_01"  ? proteus
          : menelaus;
      const struggling = (c.instance !== "eidothea_01");
      const tremor = struggling ? Math.sin(t*6 + (c.instance==="menelaus_01"?0:1.7)) * 0.004 : 0;
      state = {
        pose: s.pose || c.pose,
        gaze: s.gaze || c.gaze,
        band: c.band,
        t: t*0.5,
      };
      placeInstance(offctx, W, H, mod, {
        anchor:{ x:c.anchor.x, y:c.anchor.y + tremor }, scale:c.scale, state });
    }
  },
};
export default scene;
