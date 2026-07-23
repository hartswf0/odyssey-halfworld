/* ============================================================
   SCENE  OD-B13-S05 — Athena Makes the Beggar
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Athena touches Odysseus with her wand and shrivels his skin, hair, limbs.
     2. She clouds his eyes, dresses him in filthy rags, and gives him a staff
        and a patched bag.
     3. The transformed king is instructed to test the servants unrecognized.
     4. Athena departs for Sparta and Odysseus walks toward Eumaeus's farm.

   Stage layout (back -> front, read left -> right as the causal sweep):
     BEHIND — the DISGUISE TRANSFORMATION field spread across the whole stage:
              the strong original form on the left, the withered beggar on the
              right, the reversible corridor + the spark of Athena's wand at the
              crown. The divine morph that the whole scene turns on.
     LEFT   — ATHENA, wand out and commanding, touching the king and then, at the
              exit, striding away toward Sparta.
     RIGHT  — ODYSSEUS AS OLD BEGGAR, the finished disguise: stooped onto his
              staff, rheumy eyes climbing watchfully out of the bowed head,
              turning at the exit to shuffle off toward Eumaeus's farm.
     FRONT  — the given equipment laid at the edges: the filthy BEGGAR RAGS and
              the BEGGAR STAFF AND BAG she hands the transformed king.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import disguise from "/assets/divine_fx/disguise-transformation.mjs";
import rags from "/assets/wearable/beggar-rags.mjs";
import staffbag from "/assets/prop/beggar-staff-and-bag.mjs";
import athena from "/assets/character/athena.mjs";
import beggar from "/assets/character/odysseus-as-old-beggar.mjs";

export const scene = {
  id:"OD-B13-S05",
  title:"Athena Makes the Beggar",
  book:1,
  beats:[
    "Athena touches Odysseus with her wand and shrivels his skin, hair, and limbs.",
    "She clouds his eyes, dresses him in filthy rags, and gives him a staff and a patched bag.",
    "The transformed king is instructed to test the servants without being recognized.",
    "Athena departs for Sparta and Odysseus walks toward Eumaeus's farm.",
  ],
  exitState:"Athena departs for Sparta and Odysseus walks toward Eumaeus's farm.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // DISGUISE TRANSFORMATION — the divine morph field, staged large behind so it
    // reads as the whole event: strong form left, withered beggar right, wand
    // spark at the crown, the reversible corridor between them.
    { asset:"divine-fx.disguise-transformation", instance:"disguise_01",
      anchor:{x:.50, y:1.00}, scale:.92 },

    // BEGGAR RAGS — foreground left, the filthy costume she dresses him in.
    { asset:"wearable.beggar-rags", instance:"rags_01",
      anchor:{x:.15, y:.96}, scale:.30 },

    // BEGGAR STAFF AND BAG — foreground right, the staff and patched bag she gives him.
    { asset:"prop.beggar-staff-and-bag", instance:"staffbag_01",
      anchor:{x:.88, y:.97}, scale:.30 },

    // ATHENA — left of centre, wand out and commanding; at the exit she strides
    // off toward Sparta.
    { asset:"character.athena", instance:"athena_01",
      anchor:{x:.32, y:.98}, scale:.50, pose:"athena_command", band:"threeq",
      gaze:{x:.42, y:.02} },

    // ODYSSEUS AS OLD BEGGAR — right of centre, the finished disguise: stooped on
    // his staff, watchful; at the exit he turns to shuffle toward Eumaeus's farm.
    { asset:"character.odysseus-as-old-beggar", instance:"beggar_01",
      anchor:{x:.66, y:.99}, scale:.56, pose:"old_beggar_lean", band:"threeq",
      gaze:{x:-.34, y:-.30} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the divine morph begins — the wand touches, the king shrivels
    { op:"fx.play",    target:"disguise_01", at:1.0,  args:{} },
    // beat 1->2: Athena commands, wand out, gaze on the shrinking king
    { op:"actor.pose", target:"athena_01",   at:0.0,  args:{ pose:"athena_command" } },
    { op:"actor.gaze", target:"athena_01",   at:0.0,  args:{ gaze:{x:.42,y:.02} } },
    // beat 2: the beggar solidifies — stooped onto the staff, cupped hand out
    { op:"actor.pose", target:"beggar_01",   at:0.0,  args:{ pose:"old_beggar_lean" } },
    // beat 3: instructed to test the servants — the mendicant mask, watchful,
    // cataloguing the room from under the disguise
    { op:"actor.pose", target:"beggar_01",   at:16.0, args:{ pose:"beggar_peer" } },
    { op:"actor.gaze", target:"beggar_01",   at:16.0, args:{ gaze:{x:-.60,y:-.22} } },
    // beat 4 (exit): Athena departs for Sparta — she turns and strides away west,
    // and Odysseus turns east to shuffle off toward Eumaeus's farm
    { op:"actor.pose", target:"athena_01",   at:31.0, args:{ pose:"departing" } },
    { op:"actor.gaze", target:"athena_01",   at:31.0, args:{ gaze:{x:-.5,y:.0} } },
    { op:"actor.pose", target:"beggar_01",   at:32.0, args:{ pose:"shuffling" } },
    { op:"actor.gaze", target:"beggar_01",   at:32.0, args:{ gaze:{x:.22,y:-.10} } },
    { op:"timeline.capture", target:"OD-B13-S05", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the disguise-morph field, the given equipment at the edges,
     then Athena and the finished beggar in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "disguise_01"){
        mod = disguise;
        // the morph runs forward over the scene: strong original -> withered
        // beggar. The spark peaks mid-touch (Athena's wand) and eases as the
        // beggar solidifies. Reversible fx, driven one way here.
        const morph = Math.min(0.92, 0.08 + 0.92 * (t / 34));
        const bell = Math.max(0, 1 - Math.abs((t - 10) / 12));  // spark peak near the wand-touch
        state = { t:morph, spark: 0.45 + 0.55 * bell,
                  layers:["ground","field","strong","beggar","wand","identity"],
                  status: t < 6 ? "STRONG" : t < 24 ? "WITHERING" : "BEGGAR",
                  progress: Math.min(0.94, 0.10 + 0.82 * (t / 40)) };

      } else if (c.instance === "rags_01"){
        mod = rags;
        // the filthy rags laid out as the costume she dresses him in
        state = { mode:"flat", status:"FILTHY",
                  progress: Math.min(0.9, 0.20 + 0.5 * (t / 40)) };

      } else if (c.instance === "staffbag_01"){
        mod = staffbag;
        // the staff and patched bag given to the king, gripped and ready
        state = { t, mode:"grip", status:"GIVEN",
                  progress: Math.min(0.9, 0.30 + 0.4 * (t / 40)) };

      } else if (c.instance === "athena_01"){
        mod = athena;
        const departing = t >= 31;
        state = { t:0.45, band: departing ? "threeq" : (s.band || c.band),
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: departing ? .18 : .12,
                  status: departing ? "DEPARTING" : "COMMAND",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / 40)) };

      } else { // beggar_01 — the finished disguise
        mod = beggar;
        const watching = t >= 16 && t < 32;
        const leaving  = t >= 32;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browKnit: watching ? .5 : .32,
                  eyeNarrow: watching ? .52 : .4,
                  frown: .14, browUp: leaving ? .18 : .1, jaw: .04,
                  status: leaving ? "SHUFFLING" : watching ? "WATCHING" : "WITHERED",
                  progress: Math.min(0.94, 0.2 + 0.7 * (t / 40)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
