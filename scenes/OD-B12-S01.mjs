/* ============================================================
   SCENE  OD-B12-S01 — Elpenor's Funeral
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. The ship returns to Aeaea and the exhausted crew sleeps on shore.
     2. At dawn they retrieve Elpenor's body, burn it with his armor, and raise
        a mound.
     3. They plant his oar at the top as promised.
     4. Circe arrives with food, wine, and knowledge that they have returned
        from death.

   Stage layout (back -> front, one master clock):
     THE AEAEA FUNERAL SHORE fills the whole field — the sunrise sky over Circe's
     dark forest, the strip of sea with the black ship drawn up at the landing,
     the broad burial beach carrying the burned-out pyre crib, the fresh mound
     with the planted oar, and the low feast set in the foreground; the path
     rising through the trees to Circe's hall lies at the right.
       -> the CREW work the rite across the beach — carrying, burning, and
          raising the barrow, then setting the oar as they promised.
       -> ELPENOR'S BODY AND OAR is the focus at the mound: borne on its bier,
          laid on the pyre, and at last the oar stands planted in the barrow.
       -> ODYSSEUS in the near foreground, grieving, keeping the vow and turning
          to greet Circe as she comes down from the forest.
       -> CIRCE arrives at the right from the tree-path with food and wine and
          the knowledge that they have come back alive out of death.
   Landfall and exhausted sleep, the dawn rite and the raised mound, the oar set
   upright, and Circe's arrival — all on one clock in one still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import shore    from "/assets/location/aeaea-funeral-shore.mjs";
import crew     from "/assets/ensemble/crew.mjs";
import body     from "/assets/prop/elpenors-body-and-oar.mjs";
import odysseus from "/assets/character/odysseus.mjs";
import circe    from "/assets/character/circe.mjs";

export const scene = {
  id:"OD-B12-S01",
  title:"Elpenor's Funeral",
  book:1,
  beats:[
    "The ship returns to Aeaea and the exhausted crew sleeps on shore.",
    "At dawn they retrieve Elpenor's body, burn it with his armor, and raise a mound.",
    "They plant his oar at the top as promised.",
    "Circe arrives with food, wine, and knowledge that they have returned from death.",
  ],
  exitState:"Circe arrives with food, wine, and knowledge that they have returned from death.",
  duration:36,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // AEAEA FUNERAL SHORE — the whole set: dawn sky over Circe's forest, the sea
    // with the beached ship, the burial beach with pyre crib, fresh mound and
    // planted oar, the foreground feast, and the tree-path up to Circe's hall.
    { asset:"location.aeaea-funeral-shore", instance:"shore_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // CREW — Odysseus's men working the rite across the beach: they carry the
    // body, burn it on the pyre, raise the mound, and set the oar as promised.
    { asset:"ensemble.crew", instance:"crew_01",
      anchor:{x:.50,y:.98}, scale:.56, pose:"wood" },

    // ELPENOR'S BODY AND OAR — the focus at the mound: on its bier, then on the
    // pyre, and at last the oar stands planted upright in the raised barrow.
    { asset:"prop.elpenors-body-and-oar", instance:"body_01",
      anchor:{x:.60,y:.80}, scale:.44, pose:"on-bier" },

    // ODYSSEUS — near foreground, grieving, keeping his vow at the mound and
    // turning to greet Circe as she comes down from the forest with her gifts.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.22,y:1.00}, scale:.46, pose:"grieving", band:"threeq",
      gaze:{x:.24,y:-.04} },

    // CIRCE — arrives at the right down the tree-path with food and wine and the
    // knowledge that they have returned alive out of the land of the dead.
    { asset:"character.circe", instance:"circe_01",
      anchor:{x:.80,y:.84}, scale:.46, pose:"circe_guide",
      gaze:{x:-.42,y:.06} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: landfall on Aeaea — the exhausted crew gather at the shore
    { op:"actor.pose", target:"crew_01",     at:0.0, args:{ pose:"wood" } },
    { op:"actor.pose", target:"body_01",     at:0.0, args:{ pose:"on-bier" } },
    // beat 2: at dawn they carry the body, burn it with its armor, raise a mound
    { op:"actor.pose", target:"crew_01",     at:2.0, args:{ pose:"carry" } },
    { op:"actor.pose", target:"crew_01",     at:3.5, args:{ pose:"pyre" } },
    { op:"actor.pose", target:"body_01",     at:3.5, args:{ pose:"on-pyre" } },
    { op:"actor.pose", target:"crew_01",     at:5.0, args:{ pose:"mound" } },
    // beat 3: they plant his oar at the top of the barrow as they promised him
    { op:"actor.pose", target:"crew_01",     at:6.5, args:{ pose:"plant" } },
    { op:"actor.pose", target:"body_01",     at:6.5, args:{ pose:"mound-with-oar" } },
    // beat 4 (exit): Circe comes down from the forest with food, wine and the
    // knowledge that they have come back alive; Odysseus turns to greet her
    { op:"actor.pose", target:"circe_01",    at:7.5, args:{ pose:"circe_host" } },
    { op:"actor.gaze", target:"circe_01",    at:7.5, args:{ gaze:{x:-.30,y:.04} } },
    { op:"actor.gaze", target:"odysseus_01", at:8.0, args:{ gaze:{x:.30,y:-.02} } },
    { op:"timeline.capture", target:"OD-B12-S01", at:35.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the funeral shore, the working crew, the body/oar at the
     mound, Odysseus grieving in the foreground, then Circe arriving at right. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "shore_01"){
        mod = shore;
        // the full set: dawn sky, forest, sea + beached ship, the burial beach
        // with the pyre crib, the raised mound + planted oar, and the feast.
        state = { t, status:"MOURNING", progress:.2,
                  layers:["sky","forest","route","sea","surf","beach",
                          "ship","pyre","mound","feast","anchors"] };

      } else if (c.instance === "crew_01"){
        mod = crew;
        // the men working the rite: gathering, carrying, burning, raising the
        // mound, then setting the oar. Fire only during the pyre burning.
        const pose = s.pose || "wood";
        const fire = pose === "pyre" ? 1.0 : 0.0;
        const solemn = pose === "plant" ? 0.9 : pose === "pyre" ? 0.85 : 0.7;
        state = { t, formation:pose, solemn, fire, spread:1.0,
                  status:"MOURNING", progress:.5 };

      } else if (c.instance === "body_01"){
        mod = body;
        // Elpenor: borne on the bier -> laid on the pyre -> the oar planted in
        // the finished barrow. state.pose carries the prop's mode name.
        const mode = s.pose || "on-bier";
        state = { t, mode,
                  status: mode === "mound-with-oar" ? "MOUND+OAR"
                        : mode === "on-pyre" ? "ON-PYRE" : "ON-BIER",
                  progress: mode === "mound-with-oar" ? 1.0
                          : mode === "on-pyre" ? 0.55 : 0.2 };

      } else if (c.instance === "odysseus_01"){
        mod = odysseus;
        // grieving at the mound, keeping the vow, then turning to greet Circe.
        state = { t:0.5, band:s.band || c.band, pose:s.pose || c.pose,
                  gaze:s.gaze || c.gaze,
                  frown:.6, browKnit:.5, browUp:.4, jaw:.2, smile:0 };

      } else { // circe_01
        mod = circe;
        // arriving from the forest with food and wine and the knowledge that
        // they have returned alive out of death; guiding, then welcoming.
        state = { t:0.5, pose:s.pose || c.pose, gaze:s.gaze || c.gaze,
                  status:"HOSTING", progress:.6 };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
