/* ============================================================
   SCENE  OD-B11-S08 — Judges, Punishments, and Flight
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus sees Minos judging the dead and Orion hunting shades of animals.
     2. He sees Tityus attacked by vultures, Tantalus unable to drink or eat, and
        Sisyphus pushing his stone.
     3. Heracles's phantom speaks while the hero himself feasts among gods.
     4. The dead crowd closer and Odysseus fears Persephone may send a monster.
     5. He retreats to the ship and sails back across Ocean.

   Stage layout (back -> front, one master clock):
     PUNISHMENT LANDSCAPE fills the whole field — the gloomy underworld plain,
     its judgment dais, hunting field, vulture ledge, receding pool and rolling-
     stone slope drawn as the world every following body is set into.
       -> the CLOSING GHOST SURGE, a swelling pale crowd massed from the left and
          pressing inward on the escape gap toward the ship at the right; it lies
          low and sparse early (beat 1-2) and rears into a closing wall at beat 4.
       -> the TITYUS-TANTALUS-AND-SISYPHUS triptych centre-ground: the three
          endless punishments turning together on their own constraint loops.
       -> MINOS enthroned at the left on the judgment dais, gold sceptre lifted,
          delivering his decrees over the disputes of the dead.
       -> HERACLES'S PHANTOM right-of-centre, the dark armed double frozen at the
          hunt, bow drawn then flung forward as it speaks from the dead.
       -> ODYSSEUS at the right foreground, the witness — turned back over his
          shoulder at the judged and the damned, then seized by fear of a monster
          and breaking toward the ship on the fleeing point the surge drives at.
   The judge, the three sufferers, the speaking phantom, the closing dead and the
   hero's flight — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import landscape from "/assets/location/punishment-landscape.mjs";
import surge from "/assets/environment/closing-ghost-surge.mjs";
import sufferers from "/assets/ensemble/tityus-tantalus-and-sisyphus.mjs";
import minos from "/assets/character/minos.mjs";
import heracles from "/assets/character/heracless-phantom.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B11-S08",
  title:"Judges, Punishments, and Flight",
  book:1,
  beats:[
    "Odysseus sees Minos judging the dead and Orion hunting shades of animals.",
    "He sees Tityus attacked by vultures, Tantalus unable to drink or eat, and Sisyphus pushing his stone.",
    "Heracles's phantom speaks while the hero himself feasts among gods.",
    "The dead crowd closer and Odysseus fears Persephone may send a monster.",
    "He retreats to the ship and sails back across Ocean.",
  ],
  exitState:"He retreats to the ship and sails back across Ocean.",
  duration:34,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // PUNISHMENT LANDSCAPE — the whole gloomy underworld plain: dais, hunting
    // field, vulture ledge, receding pool, rolling-stone slope. The world every
    // body below is staged into.
    { asset:"location.punishment-landscape", instance:"landscape_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // CLOSING GHOST SURGE — the swelling dead massed from the left, pressing on
    // the escape gap toward the ship at the right. Sparse early, a closing wall
    // by beat 4. Drawn behind the witnessed tableaux so it reads as the pressure
    // gathering at Odysseus's back.
    { asset:"environment.closing-ghost-surge", instance:"surge_01",
      anchor:{x:.44,y:1.00}, scale:.94 },

    // TITYUS · TANTALUS · SISYPHUS — the three great sufferers, centre-ground,
    // each locked in its endless constraint loop.
    { asset:"ensemble.tityus-tantalus-and-sisyphus", instance:"sufferers_01",
      anchor:{x:.47,y:1.00}, scale:.58 },

    // MINOS — enthroned at the left on the judgment dais, gold sceptre lifted,
    // decreeing over the disputes of the dead.
    { asset:"character.minos", instance:"minos_01",
      anchor:{x:.14,y:.94}, scale:.46, pose:"minos_receiving", band:"front",
      gaze:{x:-.16,y:.24} },

    // HERACLES'S PHANTOM — right-of-centre, the dark armed double frozen at the
    // hunt; bow drawn, then flung forward as it speaks from the dead.
    { asset:"character.heracless-phantom", instance:"heracles_01",
      anchor:{x:.74,y:.93}, scale:.42, pose:"her_draw", band:"front",
      gaze:{x:-.50,y:.02} },

    // ODYSSEUS — right foreground, the witness: turned back over his shoulder at
    // the judged and the damned, then seized by fear and breaking for the ship.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.88,y:1.00}, scale:.48, pose:"three_quarter_left", band:"threeq",
      gaze:{x:-.34,y:.04} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Minos, receiving the disputes, settles and hands down judgement;
    // Odysseus watches the judge and Orion's hunt from the right
    { op:"actor.pose", target:"minos_01",     at:0.0,  args:{ pose:"minos_receiving" } },
    { op:"actor.pose", target:"minos_01",     at:4.0,  args:{ pose:"minos_judging" } },
    { op:"actor.gaze", target:"odysseus_01",  at:0.0,  args:{ gaze:{x:-.34,y:.04} } },
    // beat 2: the three punishments turn on their loops (driven in stage by t);
    // Minos rises to his verdict as the damned are witnessed
    { op:"actor.pose", target:"minos_01",     at:9.0,  args:{ pose:"minos_decreeing" } },
    // beat 3: Heracles's phantom, at full draw, flings its arm forward and speaks
    // from the dead
    { op:"actor.pose", target:"heracles_01",  at:14.0, args:{ pose:"her_speak" } },
    { op:"actor.gaze", target:"heracles_01",  at:14.0, args:{ gaze:{x:-.18,y:0} } },
    // beat 4: the dead crowd closer; Odysseus, gripped by fear of a monster
    // Persephone might send, turns from watching to dread
    { op:"actor.pose", target:"odysseus_01",  at:22.0, args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus_01",  at:22.0, args:{ gaze:{x:-.20,y:.02} } },
    { op:"fx.play",    target:"surge_01",     at:22.0, args:{} },
    // beat 5 (exit): he breaks for the ship and sails back across Ocean — turned
    // out toward the fleeing point the surge drives at
    { op:"actor.pose", target:"odysseus_01",  at:30.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus_01",  at:30.0, args:{ gaze:{x:.30,y:0} } },
    { op:"timeline.capture", target:"OD-B11-S08", at:33.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the gloomy plain, the closing surge, the three sufferers,
     Minos, Heracles's phantom, then Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "landscape_01"){
        mod = landscape;
        // the whole gloomy plain, every punishment zone present
        state = { layers:["void","plain","dais","hunting","ledge","pool","slope"],
                  gloom:true, status:"GLOOMY", progress:.16 };

      } else if (c.instance === "surge_01"){
        mod = surge;
        // the dead gather sparse early and rear into a closing wall at beat 4;
        // fx.play (22.0) marks the surge's peak, the flight follows
        const ft = (s.fxT != null) ? s.fxT : Math.max(0, t - 22.0);
        let inten;
        if (t < 20)      inten = 0.34 + 0.14 * (t / 20);          // gathering, low
        else if (t < 30) inten = 0.50 + 0.92 * ((t - 20) / 10);   // surging -> closing
        else             inten = 1.30;                             // fleeing
        state = { t, intensity:inten,
                  layers:["mass","ranks","pressure","flee"],
                  status: t < 20 ? "GATHERING" : t < 30 ? "CLOSING" : "FLEEING",
                  progress: Math.min(0.98, 0.16 + 0.82 * (t / 34)) };

      } else if (c.instance === "sufferers_01"){
        mod = sufferers;
        // the even triptych, every constraint turning on its own loop off t
        state = { focus:-1, spacing:1.0, t, showPanels:true,
                  status:"DAMNED", progress:.5 };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale. Emotion channels ride on the pose so each reads clearly.
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };

        if (c.instance === "minos_01"){
          mod = minos;
          // grave impartial authority: heavy level brows, narrowed stern eyes,
          // deepening from receiving -> decreeing as the verdicts fall
          const decree = t >= 9;
          state.browKnit = decree ? .80 : .34;
          state.eyeNarrow = decree ? .42 : .24;
          state.frown = decree ? .30 : .12;

        } else if (c.instance === "heracles_01"){
          mod = heracles;
          // the dark hunter's double: brows crushed, eyes slit, a held threat;
          // draws, then flings the arm forward on the words from the dead
          const speaking = t >= 14;
          state.browKnit = speaking ? .60 : .76;
          state.browUp = speaking ? .22 : .05;
          state.eyeNarrow = speaking ? .32 : .54;
          state.frown = speaking ? .30 : .42;
          state.jaw = speaking ? .56 : .05;

        } else { // odysseus_01 — the witness, to dread, to flight
          mod = odysseus;
          const fearing = t >= 22 && t < 30;
          const fleeing = t >= 30;
          state.browUp = fearing ? .5 : .18;
          state.browKnit = fearing ? .46 : fleeing ? .24 : .10;
          state.eyeWide = fearing ? .5 : fleeing ? .2 : .1;
          state.eyeNarrow = fleeing ? .14 : 0;
          state.frown = fearing ? .5 : 0;
          state.smile = (fearing || fleeing) ? 0 : .1;
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
