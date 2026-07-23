/* ============================================================
   SCENE  OD-B09-S11 — The Boast and the Curse
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. From offshore Odysseus taunts the blinded Cyclops despite his men's pleas.
     2. Polyphemus tears off a mountain peak and hurls it, driving a wave that
        nearly beaches the ship.
     3. Odysseus rows farther out, then reveals his true name and lineage.
     4. Polyphemus recalls a prophecy, calls on Poseidon, and asks that Odysseus
        return late, alone, in pain.
     5. A second rock misses as the ship escapes to the fleet.

   Stage layout (back -> front, one master clock):
     POSEIDON'S CURSE FIELD, full bleed, as the sea + divine backdrop — the pale
     sky and dark sea, the risen prayer-glyph, Poseidon's trident-seal, and the
     heavy dark tether arcing across the water to brand the fleeing ship at the
     right (its own praying giant + ship layers dropped; the real Polyphemus and
     the real galley stand in for them).
       -> POLYPHEMUS, colossal on the shore at the left: blinded, face lifted to
          the voice on the water, one arm flung overhead — hurling a torn crag and
          roaring the curse to his father.
       -> the HURLED MOUNTAIN ROCKS mid-flight in a parabola over the sea, a tiny
          ship (the waiting fleet) on the far horizon selling the giant scale.
       -> ODYSSEUS'S CREW, the galley rowing-bank in the foreground right: hauling
          hard, some flinging hands up, some ducking as the reversal-wave nearly
          throws the hull back onto the shore.
       -> ODYSSEUS himself, standing at the stern, one arm flung up — taunting the
          giant across the water and then naming himself, despite his men's pleas.
   The taunt, the hurled peak, the named name, the prayer to Poseidon and the
   escape to the fleet — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import curseField from "../assets/divine_fx/poseidons-curse-field.mjs";
import polyphemus from "../assets/character/polyphemus.mjs";
import hurledRocks from "../assets/prop/hurled-mountain-rocks.mjs";
import crew from "../assets/ensemble/odysseuss-crew.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B09-S11",
  title:"The Boast and the Curse",
  book:1,
  beats:[
    "From offshore Odysseus taunts the blinded Cyclops despite his men's pleas.",
    "Polyphemus tears off a mountain peak and hurls it, driving a wave that nearly beaches the ship.",
    "Odysseus rows farther out, then reveals his true name and lineage.",
    "Polyphemus recalls a prophecy, calls on Poseidon, and asks that Odysseus return late, alone, in pain.",
    "A second rock misses as the ship escapes to the fleet.",
  ],
  exitState:"A second rock misses as the ship escapes to the fleet.",
  duration:34,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // POSEIDON'S CURSE FIELD — full bleed, the sea + divine backdrop. Its own
    // praying-giant and ship layers are dropped (the real Polyphemus and galley
    // play those parts); we keep the sea, the risen prayer-glyph, the trident
    // seal, the dark tether and the brand reaching to the ship at the right.
    { asset:"divine_fx.poseidons-curse-field", instance:"curse_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // POLYPHEMUS — colossal on the left shore, blinded, hurling a crag overhead
    // and roaring the curse across the water toward the voice on the sea
    { asset:"character.polyphemus", instance:"polyphemus_01",
      anchor:{x:.15,y:1.00}, scale:.95, pose:"poly_shore", band:"front",
      eye:"blind", browKnit:.7, gaze:{x:.20,y:-.32} },

    // the HURLED MOUNTAIN ROCKS — the torn-off peak mid-flight over the sea,
    // arcing from the giant toward the fleeing ship
    { asset:"prop.hurled-mountain-rocks", instance:"rock_01",
      anchor:{x:.42,y:.75}, scale:.46, pose:"throw" },

    // ODYSSEUS'S CREW — the galley rowing-bank foreground right: hauling,
    // pleading, ducking as the reversal-wave nearly throws the hull back
    { asset:"ensemble.odysseuss-crew", instance:"crew_01",
      anchor:{x:.74,y:1.00}, scale:.56 },

    // ODYSSEUS — standing at the stern (the trailing left end of the galley),
    // one arm flung up, turned back across the water to taunt the giant and then
    // name himself, despite his men's pleas
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.53,y:.79}, scale:.33, pose:"one_arm_raised", band:"front",
      gaze:{x:-.34,y:-.14} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus taunts the Cyclops across the water — arm flung up,
    // shouting back toward the shore despite his crew's pleas
    { op:"actor.pose", target:"odysseus_01",   at:0.0,  args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus_01",   at:0.0,  args:{ gaze:{x:-.34,y:-.14} } },
    // beat 2: Polyphemus tears off a peak and hurls it — the rock takes flight,
    // the crew strains under the reversal-wave that nearly beaches the ship
    { op:"actor.pose", target:"polyphemus_01", at:5.0,  args:{ pose:"poly_shore" } },
    { op:"fx.play",    target:"rock_01",       at:5.0,  args:{} },
    // beat 3: Odysseus rows farther out and reveals his name and lineage —
    // still turned back to the shore, arm raised on the shout of his own name
    { op:"actor.gaze", target:"odysseus_01",   at:14.0, args:{ gaze:{x:-.30,y:-.06} } },
    // beat 4: Polyphemus recalls the prophecy and prays to Poseidon — the curse
    // field charges, the tether reaches across the sea to brand the ship
    { op:"fx.play",    target:"curse_01",      at:20.0, args:{} },
    // beat 5 (exit): a second rock misses as the ship escapes to the fleet
    { op:"actor.gaze", target:"odysseus_01",   at:30.0, args:{ gaze:{x:.30,y:-.02} } },
    { op:"timeline.capture", target:"OD-B09-S11", at:33.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the curse-field sea + divine backdrop, the colossal
     Polyphemus on the shore, the hurled peak in flight, the straining galley,
     and Odysseus standing at the stern in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "curse_01"){
        mod = curseField;
        // the divine backdrop: sea + risen prayer-glyph + trident seal + tether +
        // brand. Drop the FX's own praying-giant and ship layers — the real
        // Polyphemus and galley stand in their places. The curse charges once the
        // prayer is spoken (fx.play at 20.0); before that the tether has not yet
        // crossed, so it charges from that cue on the master clock.
        const ct = (s.fxT != null) ? s.fxT : Math.max(0, t - 20.0);
        const inten = 0.55 + 0.6 * Math.min(1, ct / 8);
        state = { t:ct, intensity:inten, rise:1.0,
                  reach: Math.min(1, 0.45 + ct * 0.11),
                  lock:  Math.min(0.9, ct * 0.10),
                  layers:["sea","rise","trident","tether","brand"] };

      } else if (c.instance === "rock_01"){
        mod = hurledRocks;
        // the torn-off peak mid-flight over the sea, arcing toward the ship
        state = { mode:"throw", t };

      } else if (c.instance === "crew_01"){
        mod = crew;
        // the reversal-wave tableau: hauling hard, some hands flung to the gods,
        // some ducking as the crest nearly throws the hull back onto the shore
        state = { effort:0.7, fear:0.85, duck:0.4, wave:0.9, waveLag:0.4,
                  oarSide:-1 };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "polyphemus_01") ? polyphemus : odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
        if (c.eye != null) state.eye = c.eye;
        if (c.browKnit != null) state.browKnit = c.browKnit;
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
