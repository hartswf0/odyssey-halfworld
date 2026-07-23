/* ============================================================
   SCENE  OD-B09-S08 — The Name Nobody and the Stake
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus considers killing the sleeping giant but realizes the sealing
        stone would trap the men in the cave forever.
     2. At dawn Polyphemus eats two more men and drives the flock out, sealing
        the cave behind him.
     3. Odysseus cuts and smooths an olive trunk into a stake and hardens its
        point in the fire.
     4. The men hide the stake and draw lots for the four who will help wield it.
     5. When the giant returns, Odysseus offers the potent wine and gives his
        name as Nobody.

   Stage layout (back -> front, one master clock):
     POLYPHEMUS'S CAVE as the empty navigable set, full bleed — vault, sealed
     entrance, hearth-fire, cheese racks and pens — the trap Odysseus reads.
       -> the FOUR CHOSEN HELPERS in the cave's left depth: the lot-picked crew
          rehearsing the coordinated heave on the great beam (their own drawn
          lots on the floor before them).
       -> POLYPHEMUS, colossal at the right, returned with the flock and settling
          by the fire — the giant Odysseus first thought to kill, now the guest
          to be plied.
       -> the OLIVEWOOD STAKE, fire-hardened and set upright against the wall at
          the left, its charred point ready and hidden from the giant's eye.
       -> ODYSSEUS, foreground centre, turning from the trap to the offering —
          the crafty half-smile, the persuasive open hand — lifting the wine.
       -> the WINE CUP, the great crude ivy-wood bowl of Maron's dark wine,
          tipped toward the giant in Odysseus's grip: the offer, and the name.
   The abandoned killing, the sealed dawn, the worked and hidden stake, the
   drawn lots and the offered wine with the false name — all one clock, one still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import cave    from "/assets/location/polyphemuss-cave.mjs";
import helpers from "/assets/ensemble/four-chosen-helpers.mjs";
import poly    from "/assets/character/polyphemus.mjs";
import stake   from "/assets/prop/olivewood-stake.mjs";
import odysseus from "/assets/character/odysseus.mjs";
import cup     from "/assets/prop/wine-cup.mjs";

/* semantic pose -> full asset preview (real hero-pose ids + expression channels).
   Scene ops set pose by these keys; stage() folds the matching preview. */
const ODY = {
  wary:    { pose:"three_quarter_left", gaze:{x:.30,y:.02}, smile:.10, browUp:.10, browKnit:.30, eyeNarrow:.24, t:0.5 },
  offering:{ pose:"offering_hand", smile:.52, mouthAsym:.62, browUp:.4, browKnit:.12, eyeNarrow:.3, gaze:{x:.46,y:-.06}, t:0.4 },
  naming:  { pose:"torso_open", jaw:.5, smile:.4, browUp:.34, eyeWide:.14, gaze:{x:.40,y:-.04}, t:0.5 },
};
const POLY = {
  laboring:{ pose:"poly_labor", eye:"watch", browKnit:.28, gaze:{x:-.30,y:.30}, t:0.5 },
  drunk:   { pose:"poly_drunk", eye:"half",  browKnit:.05, smile:.3, gaze:{x:-.20,y:.22}, t:0.5 },
};

export const scene = {
  id:"OD-B09-S08",
  title:"The Name Nobody and the Stake",
  book:1,
  beats:[
    "Odysseus considers killing the sleeping giant but realizes the sealing stone would trap the men forever.",
    "At dawn Polyphemus eats two more men and drives the flock out, sealing the cave behind him.",
    "Odysseus cuts and smooths an olive trunk into a stake and hardens its point in the fire.",
    "The men hide the stake and draw lots for the four who will help wield it.",
    "When the giant returns, Odysseus offers the potent wine and gives his name as Nobody.",
  ],
  exitState:"Odysseus offers the potent wine and says his name is Nobody.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the cave set: the trap Odysseus reads — sealed entrance, hearth-fire,
    // pens and racks; full bleed as the navigable ground of the whole scene
    { asset:"location.polyphemuss-cave", instance:"cave_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // the FOUR CHOSEN HELPERS — the lot-picked crew rehearsing the heave on the
    // great beam in the cave's left depth (their drawn lots on the floor)
    { asset:"ensemble.four-chosen-helpers", instance:"helpers_01",
      anchor:{x:.235,y:.62}, scale:.34 },

    // POLYPHEMUS, colossal at the right — returned with the flock, settling by
    // the fire; the giant first marked for death, now the guest to be plied
    { asset:"character.polyphemus", instance:"poly_01",
      anchor:{x:.815,y:1.00}, scale:.82, pose:"laboring", band:"front",
      gaze:{x:-.30,y:.30} },

    // the OLIVEWOOD STAKE — fire-hardened, its charred point ready, propped
    // upright and hidden against the wall at the left
    { asset:"prop.olivewood-stake", instance:"stake_01",
      anchor:{x:.115,y:1.00}, scale:.66, pose:"hardened" },

    // ODYSSEUS, foreground centre — turning from the trap to the offering, the
    // crafty half-smile and open persuasive hand, lifting the wine to the giant
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.455,y:1.00}, scale:.50, pose:"offering", band:"threeq",
      gaze:{x:.46,y:-.06} },

    // the WINE CUP — the great crude ivy-wood bowl of Maron's dark wine, tipped
    // toward the giant in Odysseus's grip: the offer, and the false name
    { asset:"prop.wine-cup", instance:"cup_01",
      anchor:{x:.575,y:.905}, scale:.30, pose:"offer" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Odysseus eyes the sleeping giant, weighing the sword — then reads
    // the sealing stone he could never move and turns the thought aside
    { op:"actor.pose", target:"odysseus_01", at:0.0,  args:{ pose:"wary" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:.34,y:.10} } },
    // beat 2: at dawn the giant eats two more men and drives the flock out,
    // sealing the cave — the same laboring routine that leaves them shut in
    { op:"actor.pose", target:"poly_01",     at:6.0,  args:{ pose:"laboring" } },
    // beats 3-4 happen while the giant is gone: the stake is worked, hidden, and
    // the lots drawn (staged as standing set — the crew rehearsing, stake ready)
    // beat 5: the giant returns; Odysseus turns to the offering, lifts the cup,
    // and gives his name as Nobody
    { op:"actor.pose", target:"odysseus_01", at:22.0, args:{ pose:"offering" } },
    { op:"actor.gaze", target:"odysseus_01", at:22.0, args:{ gaze:{x:.46,y:-.06} } },
    { op:"actor.gaze", target:"poly_01",     at:26.0, args:{ gaze:{x:-.30,y:.26} } },
    // the wine begins to take hold as the naming lands
    { op:"actor.pose", target:"poly_01",     at:34.0, args:{ pose:"drunk" } },
    { op:"actor.pose", target:"odysseus_01", at:36.0, args:{ pose:"naming" } },
    { op:"timeline.capture", target:"OD-B09-S08", at:42.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the cave set, the rehearsing crew, the colossal giant, the
     hidden stake, Odysseus, and the offered cup in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "cave_01"){
        mod = cave;
        // the standing set: sealed entrance, hearth-fire alive; t drives only
        // the deterministic fire flicker
        state = { t, layers:["recesses","vault","backwall","entrance","boulder",
                              "sleeping","floor","cheese","pens","pails","fire"] };

      } else if (c.instance === "helpers_01"){
        mod = helpers;
        // the lot-picked crew mid-rehearsal — the four-beat heave spread across
        // the team, their drawn lots on the floor
        state = { t, formation:"rehearse", beat:1.5, synchrony:0.30,
                  beamLift:1.02, beamTilt:-0.05, showLots:true, showBeat:true };

      } else if (c.instance === "stake_01"){
        mod = stake;
        // the finished stake: fire-hardened point, propped and ready
        state = { t, mode:s.pose || c.pose };

      } else if (c.instance === "cup_01"){
        mod = cup;
        // the great crude bowl of Maron's wine, tipped toward the guest, gripped
        state = { t, fill:0.78, pour:0, tilt:0.42, grip:1, spill:0 };

      } else {
        // characters: fold the semantic pose -> full preview, override gaze;
        // placeInstance owns the anchor/scale
        const key = s.pose || c.pose;
        if (c.instance === "poly_01"){
          mod = poly;  state = { ...(POLY[key]||POLY.laboring), band:c.band };
        } else {
          mod = odysseus; state = { ...(ODY[key]||ODY.offering), band:c.band };
        }
        if (s.gaze) state.gaze = s.gaze;
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
