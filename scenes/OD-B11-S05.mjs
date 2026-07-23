/* ============================================================
   SCENE  OD-B11-S05 — The Heroines of the Past
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus lets a succession of famous women drink and identify their lineages.
     2. Tyro tells of Poseidon and her river-born sons.
     3. Many heroines appear in turn.
     4. The sequence becomes a living genealogy of desire, birth, crime, and death.

   Stage layout (back -> front, one master clock):
     UNDERWORLD CHORUS fills the whole murk as the ambient field — the hushed
     female voices of Erebus, receding to focus on whichever shade names herself.
       -> the GENEALOGY FIELD surfaces across the centre: the faint kinship-line
          network of the recited bloodlines, generation by generation, one line
          traced up to a god as each heroine speaks her descent.
       -> the HEROINES' SHADES, the waiting chorus of famous women, one shade
          stepped FORWARD to the blood-trench to testify while the rest listen.
       -> ODYSSEUS at the foreground left, presiding at the trench: letting the
          women drink one at a time and drawing out each lineage.
   The drinking, Tyro's telling, the turning succession and the whole surfacing
   into a living genealogy of desire, birth, crime and death — one clock, one still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import chorus from "/assets/sound_source/underworld-chorus.mjs";
import genealogy from "/assets/divine_fx/genealogy-field.mjs";
import heroines from "/assets/ensemble/heroines-shades.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B11-S05",
  title:"The Heroines of the Past",
  book:1,
  beats:[
    "Odysseus lets a succession of famous women drink and identify their lineages.",
    "Tyro tells of Poseidon and her river-born sons.",
    "Many heroines appear in turn.",
    "The sequence becomes a living genealogy of desire, birth, crime, and death.",
  ],
  exitState:"The sequence becomes a living genealogy of desire, birth, crime, and death.",
  duration:32,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // UNDERWORLD CHORUS — the ambient field of the murk: the hushed female
    // voices of Erebus, murmuring then receding to the shade who names herself.
    { asset:"sound_source.underworld-chorus", instance:"chorus_01",
      anchor:{x:.52,y:1.00}, scale:.94 },

    // GENEALOGY FIELD — the recited bloodlines surfacing as a faint kinship
    // network across the centre; one line traced up to a god as each speaks.
    { asset:"divine_fx.genealogy-field", instance:"genealogy_01",
      anchor:{x:.55,y:1.00}, scale:.80 },

    // HEROINES' SHADES — the waiting chorus of famous women; one shade stepped
    // forward to the trench to testify while the rest turn to listen.
    { asset:"ensemble.heroines-shades", instance:"heroines_01",
      anchor:{x:.55,y:1.00}, scale:.82 },

    // ODYSSEUS — foreground left, presiding at the blood-trench: letting the
    // women drink one at a time and drawing out each lineage.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.17,y:1.00}, scale:.52, pose:"offering_hand", band:"threeq",
      gaze:{x:.34,y:.05} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus presides — an offered hand invites each woman to drink
    // and name herself; the chorus murmurs
    { op:"actor.pose", target:"odysseus_01",  at:0.0,  args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus_01",  at:0.0,  args:{ gaze:{x:.34,y:.05} } },
    { op:"fx.play",    target:"genealogy_01", at:2.0,  args:{} },
    // beat 2: Tyro steps forward and tells of Poseidon and her river-born sons —
    // the chorus recedes to focus, one bloodline begins to trace
    { op:"fx.play",    target:"heroines_01",  at:6.0,  args:{} },
    // beat 3: many heroines appear in turn — Odysseus turns to listen
    { op:"actor.gaze", target:"odysseus_01",  at:16.0, args:{ gaze:{x:.28,y:.02} } },
    // beat 4 (exit): the whole surfaces into a living genealogy of desire,
    // birth, crime and death — the traced bloodline lights to a god
    { op:"timeline.capture", target:"OD-B11-S05", at:31.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the chorus field, the surfacing genealogy network, the
     heroines' chorus with one shade forward, then Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "chorus_01"){
        mod = chorus;
        // the murk murmurs, then recedes to focus on the shade who names herself.
        // focus rises as the heroines begin testifying (heroines fx at 6.0).
        const focus = clamp01((t - 6) / 10);
        state = { t, intensity: 0.72 - 0.20 * focus, focus: 0.06 + 0.80 * focus,
                  focusIndex:3, stopped:false, status:"MURMURING", progress:0.72 };

      } else if (c.instance === "genealogy_01"){
        mod = genealogy;
        // the recited descent surfaces (fx.play at 2.0): first the source heroine,
        // then the whole kinship field, then one bloodline traced up to a god.
        const gt = (s.fxT != null) ? s.fxT : Math.max(0, t - 2.0);
        const reveal = clamp01(gt / 8);
        const traced = t >= 16;
        state = { t: gt, reveal, traced,
                  status: traced ? "BLOODLINE" : "DESCENDED",
                  progress: traced ? 1.0 : 0.55,
                  layers: traced
                    ? ["field","edges","figures","glyphs","highlight","source","token"]
                    : ["field","edges","figures","glyphs","source"] };

      } else if (c.instance === "heroines_01"){
        mod = heroines;
        // the waiting chorus with Tyro stepped forward to the trench to testify;
        // once she has spoken (t>=24) she turns back and the succession continues.
        const returning = t >= 24;
        state = { formation:"one-forward", forwardIndex:3, step:1.0,
                  attention: 0.9, returning, density:1.0, spread:1.0,
                  showTrench:true, showArch:true,
                  status: returning ? "RETURNING" : "TESTIFY", progress:0.4 };

      } else { // odysseus_01
        mod = odysseus;
        // presiding at the trench: offered hand inviting each to drink, then
        // turning to listen as the succession of women names itself
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze,
                  smile:.2, mouthAsym:.4, browUp:.24, eyeNarrow:.1 };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;

const clamp01 = x => x < 0 ? 0 : (x > 1 ? 1 : x);
