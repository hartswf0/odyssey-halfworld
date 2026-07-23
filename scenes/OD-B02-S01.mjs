/* ============================================================
   SCENE  OD-B02-S01 — Telemachus Calls the Assembly
   Book 1 (Book 2 of the poem). A THIN Halfworld composition module: it places
   existing asset instances on one clock. It does NOT redraw any asset.

   Beats (causal order):
     1. At dawn Telemachus dresses, arms himself, and orders heralds to summon Ithaca.
     2. He enters the meeting ground with two hounds and takes Odysseus's old seat.
     3. Aegyptius asks who has called the first assembly since the fleet sailed for Troy.
     4. Telemachus rises with the speaker's staff and names the double ruin of his
        father and his house.

   Composition (back -> front):
     location.ithacan-assembly-ground   (full-bleed civic bowl: tiers, elders, bema)
     ensemble.people-of-ithaca          (the summoned citizens filling the ranks)
     creature.two-hounds                (the prince's pair, at his side)
     character.aegyptius                (the stooped elder, risen first at the front arc)
     character.telemachus               (the prince, rising on the speaker's stone)

   The engine runs ONE dotify + scene card over the whole stage, so every
   instance shares a single halftone. Deterministic (no Date/random).
   Verify:  node harness/render-scene.mjs scenes/OD-B02-S01.mjs --t 8
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

import ground      from "/assets/location/ithacan-assembly-ground.mjs";
import people      from "/assets/ensemble/people-of-ithaca.mjs";
import hounds      from "/assets/creature/two-hounds.mjs";
import aegyptius   from "/assets/character/aegyptius.mjs";
import telemachus  from "/assets/character/telemachus.mjs";

const MODS = {
  "location.ithacan-assembly-ground": ground,
  "ensemble.people-of-ithaca": people,
  "creature.two-hounds": hounds,
  "character.aegyptius": aegyptius,
  "character.telemachus": telemachus,
};

export const scene = {
  id:"OD-B02-S01",
  title:"Telemachus Calls the Assembly",
  book:1,
  beats:[
    "At dawn Telemachus dresses, arms himself, and orders heralds to summon Ithaca.",
    "He enters the meeting ground with two hounds and takes Odysseus's old seat.",
    "Aegyptius asks who has called the first assembly since the fleet sailed for Troy.",
    "Telemachus rises with the speaker's staff and names the double ruin of his father and his house.",
  ],
  exitState:"Telemachus stands on the speaker's stone with the herald's staff, having named the double ruin of his father and his house; Aegyptius has turned to the youth and the assembly hangs hushed, moved toward pity, awaiting his charge against the suitors.",
  duration:26,

  cast:[
    // back: the empty civic bowl — hills, palace on the hill, the route up,
    // the open paved floor, the front arc of elder seats, and the central
    // speaker's stone. Crowd TIERS are left off the set: the citizens below
    // fill the ranks, so the bowl reads populated by living figures.
    { asset:"location.ithacan-assembly-ground", instance:"ground",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"convened",
      render:{ layers:["sky","hills","palace","route","floor","town","elders","stone"] } },

    // the People of Ithaca — summoned at dawn, filling the back/mid ranks of
    // the bowl and turned rapt on the bema. A band of pity rises as the prince
    // names his ruin. Placed as a mid-depth crowd so the location's floor and
    // elder arc frame them.
    { asset:"ensemble.people-of-ithaca", instance:"crowd",
      anchor:{x:.50,y:.62}, scale:.62,
      render:{ formation:"assembly", attention:.9, pity:.32, wave:.5, waveSpread:.2,
               density:1.0, showBema:false } },

    // the prince's two hounds, come with him into the ground, at his right side
    { asset:"creature.two-hounds", instance:"hounds",
      anchor:{x:.70,y:.90}, scale:.33,
      render:{ pose:"guard", t:0.4 } },

    // Aegyptius — the oldest man of Ithaca, risen FIRST at the front elder arc
    // to open the gathering, bowed over his staff, free hand lifted in question.
    { asset:"character.aegyptius", instance:"aegyptius",
      anchor:{x:.255,y:.90}, scale:.50, pose:"opening", band:"threeq",
      gaze:{x:.18,y:-.05}, render:{ t:0.4 } },

    // Telemachus — enters, takes his father's old seat, then rises on the
    // speaker's stone with the staff and names the double ruin. Foreground.
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.53,y:.955}, scale:.54, pose:"neutral", band:"threeq",
      gaze:{x:-.2,y:0}, render:{ t:0.4 } },
  ],

  timeline:[
    // beat 1/2 — dawn: the prince arrives, alert, and takes the old seat
    { op:"actor.pose", target:"telemachus", at:0.0,  args:{ pose:"alert" } },
    { op:"actor.gaze", target:"telemachus", at:0.0,  args:{ gaze:{x:-.18,y:0} } },
    { op:"actor.pose", target:"hounds",     at:0.0,  args:{ pose:"guard" } },
    // beat 3 — Aegyptius rises first and asks who has summoned the assembly
    { op:"actor.pose", target:"aegyptius",  at:4.0,  args:{ pose:"opening" } },
    { op:"actor.gaze", target:"aegyptius",  at:4.0,  args:{ gaze:{x:.2,y:-.06} } },
    { op:"actor.pose", target:"aegyptius",  at:7.0,  args:{ pose:"addressing" } },
    // beat 4 — Telemachus rises with the staff and names the double ruin
    { op:"actor.pose", target:"telemachus", at:12.0, args:{ pose:"command" } },
    { op:"actor.gaze", target:"telemachus", at:12.0, args:{ gaze:{x:.28,y:-.04} } },
    { op:"actor.move", target:"telemachus", at:12.0, args:{ anchor:{x:.50,y:.90} } },
    { op:"actor.pose", target:"hounds",     at:12.0, args:{ pose:"alert" } },
    // the old elder turns, curious, to the youth who has claimed the floor
    { op:"actor.pose", target:"aegyptius",  at:15.0, args:{ pose:"curious" } },
    { op:"actor.gaze", target:"aegyptius",  at:15.0, args:{ gaze:{x:.26,y:-.02} } },
    { op:"timeline.capture", target:"OD-B02-S01", at:25.0, args:{ label:"EXIT" } },
  ],

  // Draw every cast instance in SOLID tones into the offscreen buffer at time t.
  // The engine runs the single dotify + card pass over the whole stage.
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    for (const c of scene.cast){
      const mod = MODS[c.asset];
      if (!mod) continue;
      const s = st[c.instance] || {};
      if (s.visible === false) continue;
      const anchor = s.anchor || c.anchor;
      // static per-instance render config (layers / ensemble controls / breath)
      // then the folded timeline state (pose / band / gaze) on top.
      const state = {
        ...(c.render || {}),
        pose: s.pose,
        band: c.band,
        gaze: s.gaze || c.gaze,
      };
      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
