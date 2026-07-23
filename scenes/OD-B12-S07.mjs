/* ============================================================
   SCENE  OD-B12-S07 — Zeus Destroys the Last Ship
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Odysseus wakes, smells the meat, condemns the act — the crew feasts six days.
     2. On the seventh day the wind falls and the ship leaves Thrinacia.
     3. Zeus gathers a black cloud and strikes the mast with lightning.
     4. The ship shatters and every crewman drowns; Odysseus lashes keel and mast.
     5. Driven back to Charybdis, he hangs from the fig tree until the timbers
        reemerge, then drifts alone to Calypso.

   Stage layout (back -> front, read left -> right as the causal sweep on one clock):
     LEFT  — ZEUS'S THUNDERBOLT: the black storm-cloud gathering over the sea, the
             forked bolt lancing down onto the masthead, the white impact flash and
             the shockwave rolling out. The divine blow that opens the wreck.
     CENTRE— the FINAL BLACK SHIP carried through its end: the last galley sailing
             from Thrinacia, struck, dismasted, then its keel and mast splitting
             free — the vessel coming apart under the sky.
     FRONT — the DROWNING CREW flung from the foundering hull across the swell,
             flailing and taken under one by one, rings of foam closing over them.
     RIGHT — the FIG TREE ABOVE CHARYBDIS, its long branch arching over the maw,
             with ODYSSEUS clinging like a bat at the hang-point, waiting out the
             vortex for the timbers to reemerge before he drifts alone to Calypso.
   The bolt, the shattering ship, the drowning men, the fig-tree refuge and the
   lone survivor — all held on one clock in a single still.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import bolt from "/assets/divine_fx/zeuss-thunderbolt.mjs";
import ship from "/assets/vehicle/final-black-ship.mjs";
import crew from "/assets/ensemble/drowning-crew.mjs";
import figtree from "/assets/set_piece/fig-tree-above-charybdis.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B12-S07",
  title:"Zeus Destroys the Last Ship",
  book:1,
  beats:[
    "Odysseus wakes, smells the meat, and condemns the act, but the crew feasts for six days.",
    "On the seventh day the wind falls and the ship leaves Thrinacia.",
    "Zeus gathers a black cloud and strikes the mast with lightning.",
    "The ship shatters and every crewman drowns; Odysseus lashes keel and mast together.",
    "Driven back to Charybdis, he hangs from the fig tree until the timbers reemerge, then drifts alone to Calypso.",
  ],
  exitState:"Driven back to Charybdis, he hangs from the fig tree until the timbers reemerge, then drifts alone to Calypso.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // ZEUS'S THUNDERBOLT — the sky event on the left: black cloud gathering, the
    // forked bolt onto the masthead, flash + shockwave. The divine blow, staged
    // large behind so it reads as the whole sky over the wreck.
    { asset:"divine-fx.zeuss-thunderbolt", instance:"bolt_01",
      anchor:{x:.27, y:1.00}, scale:.80 },

    // FINAL BLACK SHIP — centre, lifted into its own mid-water band so it reads as
    // the distinct vessel breaking up above the foreground drowning: the last
    // galley from Thrinacia dismasted and its keel + mast splitting free.
    { asset:"vehicle.final-black-ship", instance:"ship_01",
      anchor:{x:.45, y:.74}, scale:.40 },

    // FIG TREE ABOVE CHARYBDIS — right: the branch arched over the maw, the refuge
    // hang-point where Odysseus waits out the vortex.
    { asset:"set-piece.fig-tree-above-charybdis", instance:"figtree_01",
      anchor:{x:.82, y:1.00}, scale:.60 },

    // DROWNING CREW — front centre: the men flung from the foundering hull across
    // the swell, flailing and taken under one by one.
    { asset:"ensemble.drowning-crew", instance:"crew_01",
      anchor:{x:.40, y:1.06}, scale:.42 },

    // ODYSSEUS — foreground right: the lone survivor clinging to the fig branch
    // over Charybdis, arm flung up to the hang-point, before he drifts to Calypso.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.845, y:.74}, scale:.30, pose:"one_arm_raised", band:"threeq",
      gaze:{x:-.30,y:.20} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 2->3: the ship sails clear, then Zeus's bolt lands on the mast
    { op:"fx.play",    target:"bolt_01",      at:6.0,  args:{} },
    // beat 4: the ship shatters and the crew drowns; Odysseus, thrown clear,
    // grips the wreckage — arm up, gaze down at the water taking the men
    { op:"actor.gaze", target:"odysseus_01",  at:0.0,  args:{ gaze:{x:-.30,y:.22} } },
    { op:"actor.pose", target:"odysseus_01",  at:0.0,  args:{ pose:"one_arm_raised" } },
    // beat 5 (exit): driven back to Charybdis he hangs from the fig tree, then
    // turns out to sea to drift alone to Calypso
    { op:"actor.gaze", target:"odysseus_01",  at:30.0, args:{ gaze:{x:.16,y:.06} } },
    { op:"timeline.capture", target:"OD-B12-S07", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the sky-strike, the shattering ship, the fig-tree refuge, the
     drowning crew, then Odysseus clinging in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "bolt_01"){
        mod = bolt;
        // the storm charges early and the forked bolt lands and holds; fire then
        // shockwave build after the strike. Kept dramatic from early t so the
        // divine blow reads at any sampled moment.
        const inten = Math.min(1, 0.56 + t * 0.014);
        state = { t, intensity:inten,
                  layers:["sky","cloud","ship","fire","shock","bolt"],
                  status: t < 6 ? "CHARGING" : t < 20 ? "STRUCK" : "FRACTURED",
                  progress: Math.min(0.96, 0.14 + 0.82 * (t / 40)) };

      } else if (c.instance === "ship_01"){
        mod = ship;
        // the vessel's end unfolds on the clock: sailing from Thrinacia -> struck
        // -> dismasted -> keel/mast separating -> debris on the empty sea.
        const mode = t < 5  ? "sailing"
                   : t < 11 ? "lightning"
                   : t < 18 ? "mast-break"
                   : t < 27 ? "separation"
                   : t < 34 ? "debris"
                   :          "lost";
        state = { t, mode, status:mode.toUpperCase(),
                  progress: Math.min(0.98, 0.12 + 0.84 * (t / 40)) };

      } else if (c.instance === "figtree_01"){
        mod = figtree;
        // the fig arched over the maw; Odysseus clings (hang), and the vortex
        // cycles suck<->spew so the released timbers reemerge for his drift out.
        const cycle = Math.sin(t * 0.5);          // vortex breathing
        state = { t, hang:true, intensity:0.9,
                  spew: 0.5 + 0.45 * cycle,        // timbers to the rim on the spew
                  layers:["sky","water","whirlpool","debris","cliff","trunk","branches","canopy","hangpoint"],
                  status: cycle < 0 ? "SUCK" : "SPEW",
                  progress: Math.min(0.96, 0.30 + 0.6 * (t / 40)) };

      } else if (c.instance === "crew_01"){
        mod = crew;
        // flung from the wreck, scattered across the swell, taken one by one as
        // the sea advances (claimed rises); the flail eases as fewer remain.
        const claimed = Math.min(0.95, 0.20 + t * 0.019);
        state = { t, claimed, flail: Math.max(0.35, 0.9 - t * 0.012),
                  spread:0.92, count:7, showSpars:true,
                  formation:"scattered-in-waves",
                  status: t < 14 ? "SCATTERED" : t < 26 ? "SINKING" : "TAKEN",
                  progress: Math.min(0.96, 0.2 + 0.76 * (t / 40)) };

      } else { // odysseus_01 — the lone survivor clinging over Charybdis
        mod = odysseus;
        const drifting = t >= 30;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze,
                  // gripped: brows up and knit, eyes wide, jaw set against the sea
                  browUp: drifting ? .22 : .48,
                  browKnit: drifting ? .30 : .44,
                  eyeWide: drifting ? .18 : .40,
                  frown: drifting ? .12 : .42,
                  smile: 0 };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
