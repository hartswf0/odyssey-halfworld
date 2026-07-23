/* ============================================================
   SCENE  OD-B12-S06 — The Cattle Are Slaughtered
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   ONE clock — it never redraws them. The engine runs a single dotify + scene
   card over the whole stage, so every instance shares one halftone.

   Beats (causal order):
     1. When food is gone, Odysseus withdraws inland to pray and the gods put
        him to sleep.
     2. Eurylochus persuades the crew to sacrifice the best cattle rather than
        starve.
     3. They substitute oak leaves for barley and water for wine, kill the
        animals, and roast the meat.
     4. The hides crawl and the meat bellows on the spits.
     5. Lampetie tells Helios, who demands punishment from Zeus.

   Stage layout (back -> front, one master clock):
     THRINACIA fills the field — the sunlit island of Helios's cattle: storm-
     blocked sea, sacred pastures, prayer place, the landing cove and camp. The
     world every body below is set into.
       -> HELIOS'S COMPLAINT rises on the right as a sky-tall corridor: the
          island report climbing to the scowling sun-god face and on to the
          thunderbolt at Zeus — Lampetie's word and the punishment-demand.
       -> SLEEPING ODYSSEUS laid inland at the upper-left, the removed leader
          held under an unnatural sleep against the rocks while the crime is done.
       -> EURYLOCHUS left-of-centre, the persuader: arm thrown forward urging the
          starving crew to take the best cattle rather than die of hunger.
       -> the CREW SACRIFICIAL GROUP centre-ground, the famished sailors at the
          distorted rite — the ox felled to the knife, the fire raked, meat turned
          on the spit, two hunched in the forced grim feast.
       -> the SACRED CATTLE omen front-and-centre: the flayed hide creeping along
          the ground on its own, then the spitted meat that bellows — the sign the
          Sun's kine are no ordinary beasts.
   The removed leader, the persuader, the famished rite, the crawling omen, and
   the grievance climbing to Zeus — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import thrinacia from "../assets/location/thrinacia.mjs";
import complaint from "../assets/divine_fx/helioss-complaint.mjs";
import sleeper   from "../assets/character/sleeping-odysseus.mjs";
import eurylochus from "../assets/character/eurylochus.mjs";
import crew      from "../assets/ensemble/crew-sacrificial-group.mjs";
import cattle    from "../assets/creature/sacred-cattle.mjs";

const clamp01 = x => x<0?0:(x>1?1:x);

export const scene = {
  id:"OD-B12-S06",
  title:"The Cattle Are Slaughtered",
  book:1,
  beats:[
    "When food is gone, Odysseus withdraws inland to pray and the gods put him to sleep.",
    "Eurylochus persuades the crew to sacrifice the best cattle rather than starve.",
    "They substitute oak leaves for barley and water for wine, kill the animals, and roast the meat.",
    "The hides crawl and the meat bellows on the spits.",
    "Lampetie tells Helios, who demands punishment from Zeus.",
  ],
  exitState:"Lampetie tells Helios, who demands punishment from Zeus.",
  duration:40,

  // asset · instance · anchor(base, normalized) · scale · pose
  cast:[
    // THRINACIA — the sunlit island of the Sun's cattle: storm-sea, sacred
    // pastures, prayer place, landing cove + camp. The whole field.
    { asset:"location.thrinacia", instance:"island_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // HELIOS'S COMPLAINT — the grievance corridor climbing the right sky: island
    // report -> scowling sun-god face -> thunderbolt demand at Zeus. Lampetie's
    // word carried up. Drawn behind the actors so the rite reads in front of it.
    { asset:"divine_fx.helioss-complaint", instance:"complaint_01",
      anchor:{x:.85,y:1.00}, scale:.62 },

    // SLEEPING ODYSSEUS — the removed leader, carried inland and held under an
    // unnatural sleep against the rocks while the irreversible act completes.
    { asset:"character.sleeping-odysseus", instance:"sleeper_01",
      anchor:{x:.20,y:.52}, scale:.42, pose:"recline_hold" },

    // EURYLOCHUS — the persuader, left-of-centre, arm thrown forward urging the
    // starving crew to take the best cattle rather than perish.
    { asset:"character.eurylochus", instance:"eurylochus_01",
      anchor:{x:.32,y:.97}, scale:.50, pose:"suspicious_leading", band:"threeq",
      gaze:{x:.42,y:.04} },

    // CREW SACRIFICIAL GROUP — the famished sailors at the distorted rite: ox to
    // the knife, fire raked, meat turned on the spit, two in the forced feast.
    { asset:"ensemble.crew-sacrificial-group", instance:"crew_01",
      anchor:{x:.55,y:1.00}, scale:.66 },

    // SACRED CATTLE — the eerie omen front-and-centre: the flayed hide creeping
    // on its own, then the spitted meat that bellows. The Sun's kine answering.
    { asset:"creature.sacred-cattle", instance:"cattle_01",
      anchor:{x:.61,y:1.00}, scale:.40, pose:"hide-crawl" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus, laid inland, sinks from settling into the deep hold
    { op:"actor.pose", target:"sleeper_01",    at:0.0,  args:{ pose:"recline_settle" } },
    { op:"actor.pose", target:"sleeper_01",    at:5.0,  args:{ pose:"recline_hold" } },
    { op:"actor.pose", target:"sleeper_01",    at:24.0, args:{ pose:"recline_deep" } },
    // beat 2: Eurylochus argues the crew round — the guarded lead into the open
    // urging that carries the vote
    { op:"actor.pose", target:"eurylochus_01", at:0.0,  args:{ pose:"suspicious_leading" } },
    { op:"actor.gaze", target:"eurylochus_01", at:0.0,  args:{ gaze:{x:.42,y:.04} } },
    { op:"actor.pose", target:"eurylochus_01", at:10.0, args:{ pose:"warning" } },
    // beat 3-4 are driven procedurally in stage() off the master clock:
    //   crew_01  slaughter -> fire -> forced feast
    //   cattle_01 alive -> killed -> hide-crawl -> meat-voice (the omen)
    // beat 5: the complaint completes its climb to Zeus (fx.t folded in stage)
    { op:"fx.play",    target:"complaint_01",  at:2.0,  args:{} },
    { op:"timeline.capture", target:"OD-B12-S06", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the island, the sky complaint, the sleeper, Eurylochus, the
     sacrificial crew, then the crawling-hide omen in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const dur = scene.duration;

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "island_01"){
        mod = thrinacia;
        // the whole sunlit island present; the storm gathering beyond as the
        // grievance rises
        state = { layers:["sky","sea","ridge","pastures","cattle-zone","sheep-zone",
                          "prayer","cove","camp"],
                  storm:0.55, status:"SACRED", progress:0.14 };

      } else if (c.instance === "complaint_01"){
        mod = complaint;
        // the report climbs across the scene: rising from the island (early),
        // reaching the sun-god face (mid), the thunderbolt struck at Zeus (late)
        const ft = clamp01((t - 2) / (dur - 4));
        state = { t:ft, intensity:1.0,
                  status: ft < 0.5 ? "REPORTING" : ft < 0.85 ? "APPEALING" : "STRUCK",
                  progress: clamp01(0.14 + 0.8 * (t / dur)) };

      } else if (c.instance === "crew_01"){
        mod = crew;
        // the famished rite turns from the slaughter, through the roasting fire,
        // into the forced grim feast; hunger stays high, guilt swells late
        let hunger, guilt, phase;
        if (t < 10)      { hunger = 0.90; guilt = 0.20; phase = 0.05; }
        else if (t < 24) { hunger = 0.82; guilt = 0.38; phase = 0.28; }
        else             { hunger = 0.72; guilt = 0.82; phase = 0.55; }
        state = { hunger, guilt, phase, density:1.0,
                  status: t < 10 ? "SLAUGHTER" : t < 24 ? "ROASTING" : "FEASTING",
                  progress: clamp01(0.2 + 0.7 * (t / dur)) };

      } else if (c.instance === "cattle_01"){
        mod = cattle;
        // the Sun's kine: standing, felled, then the supernatural omen — the
        // flayed hide creeps, and at last the spitted meat bellows
        let pose;
        if (t < 3)       pose = "alive";
        else if (t < 6)  pose = "killed";
        else if (t < 20) pose = "hide-crawl";
        else             pose = "meat-voice";
        state = { pose, t,
                  status: pose === "alive" ? "FORBIDDEN" : pose === "killed" ? "SLAIN" : "OMEN",
                  progress: clamp01(0.2 + 0.7 * (t / dur)) };

      } else {
        // named characters: fold pose/gaze/band from the timeline; placeInstance
        // owns anchor/scale. Emotion channels ride on the pose so each reads.
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };

        if (c.instance === "sleeper_01"){
          mod = sleeper;
          // held asleep: sealed lids, soft brow, a slack peaceful near-smile,
          // deepening as the act completes off-frame
          const deep = t >= 24;
          state.blink = 1; state.browUp = 0.06; state.browKnit = 0;
          state.jaw = deep ? 0.11 : 0.08; state.smile = deep ? 0.14 : 0.10;
          state.gaze = { x:0, y:0.2 };

        } else { // eurylochus_01 — the persuader
          mod = eurylochus;
          // urging the crew: brows knit with strained conviction, gaze cut toward
          // the herd he is talking them into taking
          const urging = t < 10;
          state.browKnit = urging ? 0.48 : 0.60;
          state.eyeNarrow = urging ? 0.36 : 0.42;
          state.frown = urging ? 0.22 : 0.32;
          state.mouthAsym = 0.28;
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
