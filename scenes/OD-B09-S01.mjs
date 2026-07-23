/* ============================================================
   SCENE  OD-B09-S01 — Odysseus Names Himself
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus praises Demodocus and the ordered feast.
     2. He finally declares his name, lineage, and Ithacan homeland.
     3. He describes Ithaca's rugged beauty and his longing to return.
     4. He begins the account of the disasters that followed Troy.

   Stage layout (back -> front, one master clock):
     the PHAEACIAN FEAST HALL as the empty navigable set, full bleed: hushed
     back wall + hearth, side walls, the radial fan of empty audience seats, the
     flanking feast tables, and the focal guest-seat of honour before the fire —
     the whole attentive chamber turned on its speaker.
       -> the ITHACA MEMORY LANDSCAPE, surfacing as a faint recalled vista in the
          upper chamber once he names his home: the rocky island crowned by Mount
          Neriton, its scatter of islets, the home hearth's curl of smoke and the
          longing glow pulsing across the water — his homeland made visible as he
          speaks it.
       -> ODYSSEUS, foreground centre before the seat of honour: the guest who
          praises the bard, then at last names himself and his Ithacan line, whose
          gaze lifts to the recalled island in longing, and who turns grave as he
          begins the tale of the disasters that followed Troy.
   The praise, the named name, the longed-for home and the opening of the grief
   — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import feastHall from "../assets/location/phaeacian-feast-hall.mjs";
import ithacaMemory from "../assets/divine_fx/ithaca-memory-landscape.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B09-S01",
  title:"Odysseus Names Himself",
  book:1,
  beats:[
    "Odysseus praises Demodocus and the ordered feast.",
    "He finally declares his name, lineage, and Ithacan homeland.",
    "He describes Ithaca's rugged beauty and his longing to return.",
    "He begins the account of the disasters that followed Troy.",
  ],
  exitState:"He begins the account of the disasters that followed Troy.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: the hushed feast hall, radial audience faced on
    // the guest-seat, hearth glowing at the back — full bleed, the architecture
    // of the attentive chamber
    { asset:"location.phaeacian-feast-hall", instance:"hall_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the ITHACA MEMORY LANDSCAPE — his named home surfacing as a faint recalled
    // vista over the upper chamber (island, islets, home hearth, longing glow).
    // Only placed once he names Ithaca (fx.play at beat 3).
    { asset:"divine_fx.ithaca-memory-landscape", instance:"ithaca_01",
      anchor:{x:.50,y:.585}, scale:.52 },

    // ODYSSEUS, foreground centre before the seat of honour: praising the bard,
    // then naming himself, longing toward the island, then turning to his grief
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.500,y:.995}, scale:.50, pose:"speaking", band:"threeq",
      gaze:{x:-.28,y:-.04} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus praises Demodocus and the ordered feast — open, warm
    // oration, gaze turned out across the attentive room toward the bard
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.28,y:-.04} } },
    // beat 2: he finally declares his name, lineage, and Ithacan homeland — the
    // crafty king naming himself, gaze slid out to hold the whole hall
    { op:"actor.pose", target:"odysseus_01", at:6.0,  args:{ pose:"crafty" } },
    { op:"actor.gaze", target:"odysseus_01", at:6.0,  args:{ gaze:{x:.34,y:-.04} } },
    // beat 3: he describes Ithaca's rugged beauty and his longing — the recalled
    // island surfaces above the hall; his eyes lift to it in longing
    { op:"fx.play",    target:"ithaca_01",   at:5.0,  args:{} },
    { op:"actor.pose", target:"odysseus_01", at:12.0, args:{ pose:"hailing" } },
    { op:"actor.gaze", target:"odysseus_01", at:12.0, args:{ gaze:{x:.06,y:-.18} } },
    // beat 4 (exit): he begins the account of the disasters that followed Troy —
    // the longing hardens into grief, the head bows, the eyes cast low
    { op:"actor.pose", target:"odysseus_01", at:28.0, args:{ pose:"grieving" } },
    { op:"actor.gaze", target:"odysseus_01", at:28.0, args:{ gaze:{x:0,y:.42} } },
    { op:"timeline.capture", target:"OD-B09-S01", at:38.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the feast-hall set, then the surfacing Ithaca memory, then
     Odysseus at the seat of honour in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;

      if (c.instance === "hall_01"){
        // the fully attentive chamber: audience faced on the speaker, room hushed
        // for the tale; t drives only the deterministic hearth/focus shimmer
        placeInstance(offctx, W, H, feastHall, {
          anchor, scale:c.scale,
          state:{ t, attention:1, hush:1,
            layers:["backwall","hearth","sidewalls","floor","audience","tables","speakerseat","focus"] },
        });

      } else if (c.instance === "ithaca_01"){
        // his named home surfacing as a faint recalled vista — only once he names
        // Ithaca (fx.play at 5.0). Its own clock starts from that cue; the mist
        // clears as the recollection stands clear, then lingers in longing.
        if (s.fxT == null) continue;              // not yet named — no memory
        const mt = s.fxT;
        const mist = Math.max(0.06, 0.46 - mt*0.09);   // surfaces then stands clear
        placeInstance(offctx, W, H, ithacaMemory, {
          anchor, scale:c.scale,
          state:{ t:mt, mist,
            layers:["field","glow","islets","island","hearth","smoke","mist"] },
        });

      } else {
        // Odysseus: fold pose/gaze/band from the timeline; placeInstance owns the
        // anchor/scale
        placeInstance(offctx, W, H, odysseus, {
          anchor, scale:c.scale,
          state:{ t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze },
        });
      }
    }
  },
};
export default scene;
