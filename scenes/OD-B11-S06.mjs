/* ============================================================
   SCENE  OD-B11-S06 — Agamemnon's Warning
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Agamemnon drinks and tells how Aegisthus and Clytemnestra murdered him
        at a feast.
     2. He describes Cassandra's death and his wife's refusal even to close his eyes.
     3. He warns Odysseus to return secretly and distrust women.
     4. He asks about Orestes, but Odysseus has no news.

   Stage layout (back -> front, one master clock):
     THE MURDER-FEAST MEMORY fills the field behind everything: the remembered
     banquet turning to ambush inside one faint hall — cups tipping, the guests
     toppling, Cassandra reaching, the great doors swinging shut. It TRANSFORMS
     from feast toward sealed ambush across the scene as Agamemnon relives it.
       -> THE CONSPIRATORS, Clytemnestra and Aegisthus, faint memory-figures
          hung mid-field: first leaning together to plot, then the queen's
          dagger flung overhead to strike, then cold and still. The agents of
          the deed, recalled inside the same account.
       -> AGAMEMNON'S SHADE at the left foreground, the murdered king reliving
          it: raging over the murder, then bowed in humiliation at Cassandra's
          death and his wife closing not even his eyes, then leaning in to thrust
          his bitter warning at Odysseus, then lifting an open, pleading hand to
          ask after his son Orestes.
       -> ODYSSEUS at the right foreground, turned to the shade and listening —
          grave, then downcast: he has no news of Orestes to give.
   The telling, the remembered ambush, the two conspirators, the warning and the
   unanswered question about the son — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import agamemnon from "/assets/character/agamemnons-shade.mjs";
import odysseus from "/assets/character/odysseus.mjs";
import feastMemory from "/assets/divine_fx/murder-feast-memory.mjs";
import conspirators from "/assets/character/clytemnestra-and-aegisthus-memory-variants.mjs";

export const scene = {
  id:"OD-B11-S06",
  title:"Agamemnon's Warning",
  book:1,
  beats:[
    "Agamemnon drinks and tells how Aegisthus and Clytemnestra murdered him at a feast.",
    "He describes Cassandra's death and his wife's refusal even to close his eyes.",
    "He warns Odysseus to return secretly and distrust women.",
    "He asks about Orestes, but Odysseus has no news.",
  ],
  exitState:"He asks about Orestes, but Odysseus has no news.",
  duration:32,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // THE MURDER-FEAST MEMORY — the whole-field backdrop: the remembered banquet
    // turning to ambush inside one faint hall. It transforms feast -> sealed
    // ambush across the scene as Agamemnon relives the deed.
    { asset:"divine_fx.murder-feast-memory", instance:"feast_01",
      anchor:{x:.50,y:1.00}, scale:.98 },

    // THE CONSPIRATORS — Clytemnestra and Aegisthus as faint memory-figures hung
    // mid-field: they plot, then the queen strikes, then hold cold. The agents of
    // the murder, recalled inside Agamemnon's account.
    { asset:"character.clytemnestra-and-aegisthus-memory-variants", instance:"plotters_01",
      anchor:{x:.53,y:.74}, scale:.42 },

    // AGAMEMNON'S SHADE — left foreground, reliving his own murder: raging, then
    // humiliated, then the bitter warning thrust at Odysseus, then the pleading
    // question about Orestes.
    { asset:"character.agamemnons-shade", instance:"agamemnon_01",
      anchor:{x:.24,y:1.00}, scale:.60, pose:"aga_rage", band:"front",
      gaze:{x:.22,y:-.04} },

    // ODYSSEUS — right foreground, turned to the shade and listening; grave, then
    // downcast with no news of Orestes to give.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.78,y:1.00}, scale:.54, pose:"neutral", band:"front",
      gaze:{x:-.42,y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Agamemnon relives the murder at the feast — anguished rage
    { op:"actor.pose", target:"agamemnon_01", at:0.0,  args:{ pose:"aga_rage" } },
    { op:"actor.gaze", target:"agamemnon_01", at:0.0,  args:{ gaze:{x:.10,y:-.16} } },
    // beat 2: Cassandra's death and his wife refusing even to close his eyes —
    // he bows into the shame of it
    { op:"actor.pose", target:"agamemnon_01", at:8.0,  args:{ pose:"aga_shame" } },
    { op:"actor.gaze", target:"agamemnon_01", at:8.0,  args:{ gaze:{x:.1,y:.4} } },
    // beat 3: the bitter warning — return secretly, trust no woman — thrust at
    // Odysseus (the card beat)
    { op:"actor.pose", target:"agamemnon_01", at:16.0, args:{ pose:"aga_warn" } },
    { op:"actor.gaze", target:"agamemnon_01", at:16.0, args:{ gaze:{x:.28,y:-.02} } },
    // beat 4 (exit): he lifts an open, pleading hand to ask after Orestes
    { op:"actor.pose", target:"agamemnon_01", at:24.0, args:{ pose:"aga_ask" } },
    { op:"actor.gaze", target:"agamemnon_01", at:24.0, args:{ gaze:{x:.30,y:-.14} } },
    // Odysseus listens gravely, then — asked about Orestes he cannot answer —
    // turns downcast with no news to give
    { op:"actor.gaze", target:"odysseus_01",  at:0.0,  args:{ gaze:{x:-.42,y:.02} } },
    { op:"actor.pose", target:"odysseus_01",  at:24.0, args:{ pose:"grieving" } },
    { op:"actor.gaze", target:"odysseus_01",  at:24.0, args:{ gaze:{x:-.24,y:.22} } },
    // the remembered ambush gathers as he tells it
    { op:"fx.play",    target:"feast_01",     at:0.0,  args:{} },
    { op:"timeline.capture", target:"OD-B11-S06", at:31.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the murder-feast memory backdrop, the faint conspirators,
     then Agamemnon and Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "feast_01"){
        mod = feastMemory;
        // the remembered feast turns to sealed ambush as the telling proceeds:
        // cups tip, the guests topple, Cassandra reaches, the doors swing shut.
        const transform = Math.max(0, Math.min(0.96, 0.24 + (t/24)*0.72));
        state = { t, transform,
                  layers:["field","doors","attacker","guests","table","cassandra"] };

      } else if (c.instance === "plotters_01"){
        mod = conspirators;
        // the two agents of the deed, recalled: they plot together, then the
        // queen's dagger is flung overhead to strike, then hold cold and still.
        const variant = t < 8 ? "conspiring" : t < 20 ? "striking" : "cold";
        state = { variant };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale. Emotion channels ride on the composed pose.
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };

        if (c.instance === "agamemnon_01"){
          mod = agamemnon;
          // a shade — left translucent (asset default); the death-wounds read.

        } else { // odysseus_01
          mod = odysseus;
          // listening gravely, then — no news of Orestes — downcast
          const noNews = t >= 24;
          state.browUp = noNews ? .38 : .16;
          state.browKnit = noNews ? .44 : .18;
          state.frown = noNews ? .5 : .12;
          state.eyeNarrow = noNews ? .2 : .12;
          state.smile = 0;
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
