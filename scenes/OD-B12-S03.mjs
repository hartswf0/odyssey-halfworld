/* ============================================================
   SCENE  OD-B12-S03 — The Sirens' Song
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The wind dies as the ship approaches the Sirens' island.
     2. Odysseus softens wax and seals every crewman's ears.
     3. The men bind him upright to the mast and row past the flowered shore.
     4. The Sirens promise total knowledge; Odysseus struggles and signals to
        be released.
     5. Perimedes and Eurylochus tighten the ropes until the song fades.

   Stage layout (back -> front, one master clock):
     SIRENS' ISLAND fills the field — the low flowery meadow coast, half-hidden
     bones, the marked singing positions and the windless calm-water radius the
     galley must cross. The world every body below is set into.
       -> THE SIRENS perched on the shore rocks at the left, bird-women thrown
          back mid-song, their vocal wavefront converging on the ship's course.
       -> the CREW AT THE OARS across the foreground: the wax-deaf rowing bank
          holding one cadence, ears stopped, ignoring the flagged release.
       -> the MAST ROPES AND BEESWAX rising amidships: the spar wound with the
          lashing band, its knot and belayed tail, the beeswax kit on the deck.
          The band cycles secure -> tighten as the crew answer the struggle.
       -> ODYSSEUS lashed upright at the mast, the one man who hears: turned to
          the singers in longing, then straining and signalling to be freed,
          then subdued as Perimedes and Eurylochus haul the ropes tight.
   The dying wind, the stopped ears, the bound king and the fading song — all
   held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import island from "../assets/location/sirens-island.mjs";
import sirens from "../assets/ensemble/the-sirens.mjs";
import crew from "../assets/ensemble/crew-at-the-oars.mjs";
import mast from "../assets/prop/mast-ropes-and-beeswax.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B12-S03",
  title:"The Sirens' Song",
  book:1,
  beats:[
    "The wind dies as the ship approaches the Sirens' island.",
    "Odysseus softens wax and seals every crewman's ears.",
    "The men bind him upright to the mast and row past the flowered shore.",
    "The Sirens promise total knowledge; Odysseus struggles and signals to be released.",
    "Perimedes and Eurylochus tighten the ropes until the song fades.",
  ],
  exitState:"Perimedes and Eurylochus tighten the ropes until the song fades.",
  duration:26,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // SIRENS' ISLAND — the full flowery meadow coast: singing positions, unseen
    // bones, the windless calm-water radius the galley must cross. The set every
    // body below is staged into.
    { asset:"location.sirens-island", instance:"island_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // THE SIRENS — perched on the shore rocks at the left, thrown back mid-song,
    // their wavefront converging on the ship's course out over the water.
    { asset:"ensemble.the-sirens", instance:"sirens_01",
      anchor:{x:.27,y:.52}, scale:.42 },

    // CREW AT THE OARS — the wax-deaf rowing bank across the foreground, one
    // cadence, ears stopped, ignoring the flagged release signal.
    { asset:"ensemble.crew-at-the-oars", instance:"crew_01",
      anchor:{x:.54,y:1.00}, scale:.72 },

    // MAST ROPES AND BEESWAX — the spar rising amidships wound with the lashing
    // band, its knot + belayed tail, the beeswax kit on the deck.
    { asset:"prop.mast-ropes-and-beeswax", instance:"mast_01",
      anchor:{x:.50,y:.88}, scale:.60 },

    // ODYSSEUS — lashed upright at the mast, the one man who hears: turned to the
    // singers, then straining, then subdued as the ropes are hauled tight.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.50,y:.82}, scale:.44, pose:"three_quarter_left", band:"threeq",
      gaze:{x:-.42,y:-.06} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1-2: the wind dies, ears sealed; the bank pulls, deaf and calm, while
    // the singers open full song on the ship's course
    { op:"fx.play",    target:"sirens_01",   at:0.0,  args:{} },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.42,y:-.06} } },
    // beat 3: bound upright to the mast, rowing past the flowered shore — the
    // lashing made secure, the king turned to the singers in longing
    { op:"actor.pose", target:"odysseus_01", at:5.0,  args:{ pose:"three_quarter_left" } },
    // beat 4: the Sirens promise total knowledge; Odysseus strains against the
    // ropes and signals to be released — the crew do not turn
    { op:"actor.pose", target:"odysseus_01", at:14.0, args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"odysseus_01", at:14.0, args:{ gaze:{x:-.50,y:-.02} } },
    // beat 5 (exit): Perimedes and Eurylochus haul the ropes tight; the king is
    // subdued and the song fades astern
    { op:"actor.pose", target:"odysseus_01", at:20.0, args:{ pose:"grief" } },
    { op:"actor.gaze", target:"odysseus_01", at:20.0, args:{ gaze:{x:-.20,y:.10} } },
    { op:"timeline.capture", target:"OD-B12-S03", at:25.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the flowery island, the perched singers, the rowing bank, the
     lashed mast, then Odysseus bound at the spar. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "island_01"){
        mod = island;
        // the full luring set: meadow, flowers, unseen bones, marked singing
        // positions, the windless calm-water radius, the safe-passage boundary
        state = { layers:["sky","farsea","hills","meadow","flowers","bones",
                          "singing","water","calm","boundary"],
                  status:"BECKONING", progress:.24 };

      } else if (c.instance === "sirens_01"){
        mod = sirens;
        // full irresistible song through the struggle, fading once the ropes are
        // hauled tight (beat 5) and the ship draws past
        let sing;
        if (t < 18)      sing = 1.0;                       // luring at full voice
        else             sing = Math.max(0, 1 - (t - 18) / 7); // fading astern
        state = { formation:"perched-row", count:3, songIntensity:sing,
                  lure:{ x:0.94, y:0.36 }, density:1, spread:1,
                  showSea:false, showRange:false,
                  status: sing > 0.4 ? "LURING" : "FADING",
                  progress: .3 };

      } else if (c.instance === "crew_01"){
        mod = crew;
        // the wax-deaf bank on one cadence, ears stopped, ignoring the flagged
        // release; the crew haul the ropes tighter at beat 5 (effort rises)
        const cadence = (t * 0.14) % 1;                    // shared stroke phase
        const tightening = t >= 20;
        state = { formation:"rowing-bank", nearCount:5, farCount:4,
                  cadence, wax:1.0, attention:0.0,
                  effort: tightening ? 0.82 : 0.6,
                  oarSide:1, showSignal:true, showHull:true,
                  status:"WAX-DEAF", progress:.30 };

      } else if (c.instance === "mast_01"){
        mod = mast;
        // secure while bound and rowing past; hauled TIGHT at beat 5 as
        // Perimedes and Eurylochus answer the struggle
        const mode = t < 2 ? "apply" : t < 20 ? "secure" : "tighten";
        state = { mode, t,
                  status: mode.toUpperCase(),
                  progress: mode === "tighten" ? .62 : mode === "secure" ? .40 : .14 };

      } else { // odysseus_01 — the one man who hears
        mod = odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
        const straining = t >= 14 && t < 20;
        const subdued   = t >= 20;
        // longing -> a wide, pleading strain toward the song -> a bowed, subdued
        // face as the ropes bite and the singers fade astern
        state.browUp    = straining ? .52 : subdued ? .38 : .18;
        state.browKnit  = straining ? .40 : subdued ? .30 : .12;
        state.eyeWide   = straining ? .5  : subdued ? .12 : .18;
        state.eyeNarrow = subdued ? .18 : 0;
        state.jaw       = straining ? .5  : .06;
        state.frown     = subdued ? .5  : 0;
        state.smile     = (straining || subdued) ? 0 : .1;
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
