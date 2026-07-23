/* ============================================================
   SCENE  OD-B15-S04 — Eumaeus Tells His Own Story
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. At the hut Odysseus (the beggar) suggests going to the palace to seek
        work; Eumaeus refuses to expose him.
     2. The beggar asks about Laertes, Anticleia, and Eumaeus's own origins.
     3. Eumaeus tells how Phoenician traders abducted him from the island of
        Syria after corrupting a slave woman of the house.
     4. Laertes bought him in Ithaca and the royal household raised him.

   Stage layout (back -> front):
     BACKDROP — the ISLAND OF SYRIA MEMORY spread across the whole stage: the
              recollected royal house on the hill, the stepped town, the harbor
              with its moored trader, and the dashed abduction route. Faint
              while the two men talk at the hut; it firms into the full
              remembered set as Eumaeus narrates the theft.
     MEMORY INSET (upper-right) — the PHOENICIAN TRADERS working their long
              con: the seduction with trinkets, then the secret loading of
              stores and the stolen child up the gangway, then the voyage/sale.
     MEMORY FIGURE (upper-left of the inset) — CHILD EUMAEUS, the small royal
              boy: timid at first, then reaching and carried away as the theft
              is told. The memory-toned young Eumaeus.
     FRONT-LEFT  — EUMAEUS the swineherd, present-day teller: he refuses to
              risk the stranger at the palace, then pours out his own history.
     FRONT-RIGHT — ODYSSEUS AS BEGGAR, present-day listener: he floats the
              palace idea, asks after the old house and Eumaeus's origins, then
              settles in to hear the tale.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import island from "../assets/location/island-of-syria-memory.mjs";
import traders from "../assets/ensemble/phoenician-traders.mjs";
import childEumaeus from "../assets/character/child-eumaeus-memory-variant.mjs";
import eumaeus from "../assets/character/eumaeus.mjs";
import beggar from "../assets/character/odysseus-as-beggar.mjs";

export const scene = {
  id:"OD-B15-S04",
  title:"Eumaeus Tells His Own Story",
  book:1,
  beats:[
    "At the hut the beggar suggests going to the palace for work; Eumaeus refuses to expose him.",
    "The beggar asks about Laertes, Anticleia, and Eumaeus's origins.",
    "Eumaeus tells how Phoenician traders abducted him from the island of Syria after corrupting a slave woman.",
    "Laertes bought him in Ithaca and the royal household raised him.",
  ],
  exitState:"Laertes bought him in Ithaca and the royal household raised him.",
  duration:46,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // ISLAND OF SYRIA MEMORY — the full-frame recollected homeland behind
    // everything: royal house, town, harbor, moored trader, abduction route.
    { asset:"location.island-of-syria-memory", instance:"syria_01",
      anchor:{x:.50, y:1.00}, scale:1.00 },

    // PHOENICIAN TRADERS — memory inset upper-right: the seduction, the secret
    // loading of stores and the stolen child, the voyage and the sale.
    { asset:"ensemble.phoenician-traders", instance:"traders_01",
      anchor:{x:.60, y:.56}, scale:.56 },

    // CHILD EUMAEUS — the small royal boy in the memory, upper-left of the
    // inset: timid, then reaching back toward the home torn away, then carried.
    { asset:"character.child-eumaeus-memory-variant", instance:"child_01",
      anchor:{x:.30, y:.47}, scale:.30, pose:"child_timid",
      gaze:{x:.20, y:-.10} },

    // EUMAEUS — front-left, present-day teller: refuses to risk the stranger,
    // then pours out his own history of abduction, sale, and a good house.
    { asset:"character.eumaeus", instance:"eumaeus_01",
      anchor:{x:.28, y:.99}, scale:.60, pose:"eum_skeptic", band:"threeq",
      gaze:{x:.34, y:.02} },

    // ODYSSEUS AS BEGGAR — front-right, present-day listener: floats the palace
    // idea, asks after the old house and Eumaeus's origins, then settles to hear.
    { asset:"character.odysseus-as-beggar", instance:"beggar_01",
      anchor:{x:.84, y:.99}, scale:.56, pose:"beggar_storyteller", band:"threeq",
      gaze:{x:-.34, y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the beggar floats going to the palace for work; Eumaeus refuses to
    // expose him — the firm boundary, the one "no" of the great host.
    { op:"actor.pose", target:"beggar_01",  at:1.0,  args:{ pose:"beggar_storyteller" } },
    { op:"actor.gaze", target:"beggar_01",  at:1.0,  args:{ gaze:{x:-.34,y:-.04} } },
    { op:"actor.pose", target:"eumaeus_01", at:5.0,  args:{ pose:"eum_skeptic" } },
    { op:"actor.gaze", target:"eumaeus_01", at:5.0,  args:{ gaze:{x:.30,y:.02} } },
    // beat 2: the beggar asks after Laertes, Anticleia, and Eumaeus's origins;
    // Eumaeus bows into remembering.
    { op:"actor.pose", target:"beggar_01",  at:12.0, args:{ pose:"beggar_anecdote" } },
    { op:"actor.gaze", target:"beggar_01",  at:12.0, args:{ gaze:{x:-.26,y:.06} } },
    { op:"actor.pose", target:"eumaeus_01", at:16.0, args:{ pose:"eum_listen" } },
    { op:"actor.gaze", target:"eumaeus_01", at:16.0, args:{ gaze:{x:.10,y:.14} } },
    // beat 3: Eumaeus tells of the Phoenician abduction from Syria; the beggar
    // settles to listen while the memory firms behind them.
    { op:"actor.pose", target:"eumaeus_01", at:20.0, args:{ pose:"eum_speak" } },
    { op:"actor.gaze", target:"eumaeus_01", at:20.0, args:{ gaze:{x:-.30,y:-.06} } },
    { op:"actor.pose", target:"beggar_01",  at:22.0, args:{ pose:"beggar_endure" } },
    { op:"actor.gaze", target:"beggar_01",  at:22.0, args:{ gaze:{x:-.12,y:.10} } },
    // memory figure: the boy from timid, to reaching, to carried away
    { op:"actor.pose", target:"child_01",   at:20.0, args:{ pose:"child_reach_away" } },
    { op:"actor.gaze", target:"child_01",   at:20.0, args:{ gaze:{x:-.56,y:.04} } },
    { op:"actor.pose", target:"child_01",   at:32.0, args:{ pose:"child_carried" } },
    { op:"actor.gaze", target:"child_01",   at:32.0, args:{ gaze:{x:-.40,y:.10} } },
    // beat 4 (exit): Laertes bought him in Ithaca and the household raised him;
    // Eumaeus settles into the kindly grieving loyalty the memory leaves behind.
    { op:"actor.pose", target:"eumaeus_01", at:39.0, args:{ pose:"eum_grieve" } },
    { op:"actor.gaze", target:"eumaeus_01", at:39.0, args:{ gaze:{x:.06,y:.42} } },
    { op:"actor.pose", target:"child_01",   at:39.0, args:{ pose:"child_led" } },
    { op:"actor.gaze", target:"child_01",   at:39.0, args:{ gaze:{x:-.50,y:.04} } },
    { op:"timeline.capture", target:"OD-B15-S04", at:45.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the remembered island, the trader inset, the memory boy, then
     Eumaeus and the beggar in the present-day foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const D = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "syria_01"){
        mod = island;
        // faint while the men talk; the full remembered set (town + route) firms
        // in as Eumaeus narrates the theft, then holds through the exit.
        const telling = t >= 18;
        state = { layers: telling
                    ? ["sky","hill","royal-house","town","shore","water","jetty","ship","route"]
                    : ["sky","hill","royal-house","shore","water","ship"],
                  status: telling ? "ABDUCTION" : "REMEMBERED",
                  progress: Math.min(0.96, 0.14 + 0.8*(t/D)) };

      } else if (c.instance === "traders_01"){
        mod = traders;
        // the con unspools in the order Eumaeus tells it: the year-long seduction
        // with trinkets, the secret loading of stores and the child, then sale.
        let formation, status;
        if (t < 22)      { formation = "barter"; status = "SEDUCING"; }
        else if (t < 34) { formation = "load";   status = "LOADING"; }
        else             { formation = "sale";   status = "SELLING"; }
        state = { formation, attention: 0.7, spread: 1.0, density: 1.0,
                  status, progress: Math.min(0.94, 0.16 + 0.7*(t/D)) };

      } else if (c.instance === "child_01"){
        mod = childEumaeus;
        const carried = t >= 32;
        const stolen  = t >= 20;
        state = { band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: carried ? .66 : stolen ? .82 : .44,
                  browKnit: carried ? .46 : stolen ? .48 : .24,
                  eyeWide: carried ? .66 : stolen ? .86 : .30,
                  jaw: stolen ? .5 : .1, frown: stolen ? .42 : .12,
                  status: stolen ? "STOLEN" : "ROYAL CHILD",
                  progress: Math.min(0.94, 0.18 + 0.7*(t/D)) };

      } else if (c.instance === "eumaeus_01"){
        mod = eumaeus;
        const telling  = t >= 20 && t < 39;
        const closing  = t >= 39;
        const refusing = t < 12;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: closing ? .66 : telling ? .34 : refusing ? .2 : .5,
                  browKnit: refusing ? .42 : telling ? .5 : closing ? .5 : .42,
                  frown: telling ? .34 : closing ? .5 : .16,
                  eyeNarrow: refusing ? .42 : telling ? .12 : closing ? .22 : .06,
                  jaw: telling ? .44 : 0,
                  mouthAsym: refusing ? .62 : telling ? .2 : 0,
                  status: closing ? "RAISED" : telling ? "TELLING" : refusing ? "REFUSING" : "REMEMBERING",
                  progress: Math.min(0.96, 0.18 + 0.72*(t/D)) };

      } else { // beggar_01 — Odysseus disguised, the present-day listener
        mod = beggar;
        const asking    = t >= 12 && t < 20;
        const listening = t >= 20;
        state = { t:0.5, band: s.band || c.band,
                  pose: s.pose || c.pose, gaze: s.gaze || c.gaze,
                  browUp: asking ? .52 : listening ? .4 : .42,
                  browKnit: asking ? .2 : listening ? .36 : .14,
                  eyeNarrow: listening ? .36 : asking ? .2 : .06,
                  eyeWide: (!asking && !listening) ? .14 : 0,
                  frown: listening ? .18 : .06,
                  mouthAsym: asking ? .3 : 0,
                  jaw: listening ? .04 : asking ? .2 : .34,
                  status: listening ? "LISTENING" : asking ? "ASKING" : "SUGGESTING",
                  progress: Math.min(0.96, 0.18 + 0.72*(t/D)) };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
