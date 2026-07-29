/* ============================================================
   SCENE  OD-B16-S03 — The Father Reveals Himself
   REFERENCE SCENE for Book XVI+. Additive: adds nothing to Books I–XV and
   modifies no existing module.

   Three things are demonstrated here, and every later Book XVI+ scene should
   copy this shape:

   1. NO HAND-PLACED ANCHORS. Every position comes from scenes/_plans/
      eumaeus-hut.mjs via blockingAt(). The room is authored once; this scene
      only says who is at which station and when they move. S01 and S06 play
      in the same room and will agree with it automatically.

   2. ONE BODY. Odysseus is character.odysseus-b16 with a guise ramp, not a
      cut from .odysseus-as-beggar to .odysseus-restored. Skin, hair and height
      interpolate; the garment snaps at u=0.5, and the restoration flare is put
      on that exact frame to cover the only discontinuity. The audience must
      read one man changing, which is the entire content of the scene.

   3. STRUCTURED HANDOFF. exitOccupancy is computed from the plan, not written
      as prose, so OD-B16-S04 opens with both men exactly where this left them.

   Beats (Od. 16.166–219):
     1. Athena signals from the door; Odysseus steps out and is restored.
     2. He re-enters transformed; Telemachus takes him for a god and shrinks back.
     3. "I am no god. I am your father."
     4. Telemachus refuses it — no mortal could do this.
     5. It is Athena's work. They embrace and weep, longer than birds crying.

   ROOM NOTE. The atlas casts no location for this scene (5 of 6 Book XVI
   scenes have none), so restage had nothing to paint the field with. The
   field is now location.eumaeus-hut-interior, which builds its architecture
   by projecting scenes/_plans/eumaeus-hut.mjs through the same project()
   used here — so the door, hearth, benches and stool this scene names are
   the door, hearth, benches and stool that get drawn.

   Verify:  node harness/render-scene.mjs scenes/OD-B16-S03.mjs --t 14
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { eumaeusHut } from "./_plans/eumaeus-hut.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/eumaeus-hut-interior.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import restoration from "../assets/divine_fx/athenas-restoration.mjs";

const FIELD_ASSET = "location.eumaeus-hut-interior";   // the authored room (agrees with _plans/eumaeus-hut.mjs)
const D = 46;

/* --- BLOCKING. Stations, not coordinates. -------------------------------- */
const MOVES = [
  // he goes out to the yard with Athena and comes back a king
  { who:"odysseus",   from:"seat_guest", to:"yard",   t0: 2, t1: 6 },
  { who:"odysseus",   from:"yard",       to:"door",   t0:12, t1:15 },
  { who:"odysseus",   from:"door",       to:"centre_r", t0:16, t1:21 },
  // Telemachus backs away from the god, then closes for the embrace
  { who:"telemachus", from:"bench_far",  to:"corner_dark", t0:17, t1:22 },
  { who:"telemachus", from:"corner_dark",to:"centre_l",    t0:33, t1:39 },
];
/* CONTINUITY IN — computed, not asserted. S02 ends with Eumaeus gone and the two
   men alone; this scene opens on exactly that frame. Odysseus leaves for the yard
   at t=5 regardless, so the join costs the picture nothing. */
import { exitOccupancy as INITIAL } from "./OD-B16-S02.mjs";

/* --- THE RAMP. One u drives the body AND the flare. ---------------------- */
const R0 = 8, R1 = 14;                                  // restoration window
const ramp = t => t <= R0 ? 0 : t >= R1 ? 1 : (t - R0) / (R1 - R0);

export const scene = {
  id:"OD-B16-S03",
  title:"The Father Reveals Himself",
  book:16,
  plan:"eumaeus-hut",
  duration:D,
  beats:[
    "Athena signals from the doorway and Odysseus follows her out.",
    "She strikes away the disguise; he returns to the hut as himself.",
    "Telemachus takes him for a god and shrinks back, afraid to look.",
    "Odysseus says he is no god but his father, home in the twentieth year.",
    "Telemachus refuses it — no mortal could change so. Odysseus names Athena's work.",
    "They embrace and weep, longer and louder than birds robbed of their young.",
  ],
  exitState:"Father and son stand together at the centre of the hut, recognized; Eumaeus is still away at the palace.",
  exitOccupancy:occupancyAt(eumaeusHut, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0 },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.94}, scale:.58, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.32,y:.96}, scale:.54, band:"threeq", pose:"alert" },
    { asset:"divine-fx.athenas-restoration", instance:"restore_01",
      anchor:{x:.50,y:.94}, scale:1.0, blend:"multiply" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"alert" } },
    { op:"fx.play",    target:"restore_01", at: R0,  args:{ dir:"restore" } },
    { op:"actor.pose", target:"odysseus",   at:15.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.pose", target:"telemachus", at:17.0, args:{ pose:"grief" } },
    { op:"actor.gaze", target:"telemachus", at:17.0, args:{ gaze:{x:-.34,y:.30} } },
    { op:"actor.pose", target:"odysseus",   at:22.0, args:{ pose:"torso_open" } },
    { op:"actor.pose", target:"telemachus", at:27.0, args:{ pose:"listening" } },
    { op:"actor.pose", target:"odysseus",   at:33.0, args:{ pose:"offering_hand" } },
    { op:"actor.pose", target:"telemachus", at:36.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"odysseus",   at:39.0, args:{ pose:"grief" } },
    { op:"actor.pose", target:"telemachus", at:39.0, args:{ pose:"grief" } },
    { op:"timeline.capture", target:"OD-B16-S03", at:44.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const blk = blockingAt(eumaeusHut, MOVES, t, INITIAL);
    const u   = ramp(t);
    const changing = u > 0.001 && u < 0.999;

    // the field first — it paints the room, everything else keys onto it
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ t:0.5, progress:Math.min(.94, .2 + .7*(t/D)), status:"THE HUT" },
    });

    // --- ODYSSEUS: one body, guise driven by the same u as the flare -------
    {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      const guise = u <= 0     ? "beggar"
                  : u >= 1     ? "restored"
                  : { from:"beggar", to:"restored", u };
      const revealed = t >= 15;
      const weeping  = t >= 39;
      placeInstance(offctx, W, H, odysseus, {
        anchor:{ x:p.x, y:p.y }, scale:0.58 * p.scale,
        state:{
          t:0.5, guise, band:"threeq",
          pose: s.pose || "three_quarter_left",
          gaze: s.gaze || { x:-.10, y:.02 },
          browUp:  weeping ? .40 : revealed ? .30 : .10,
          browKnit:weeping ? .50 : .14,
          smile:   revealed && !weeping ? .22 : 0,
          frown:   weeping ? .55 : 0,
          eyeWide: revealed && !weeping ? .18 : 0,
          status:  weeping ? "WEEPING" : revealed ? "YOUR FATHER"
                 : changing ? "RESTORING" : "THE BEGGAR",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      });
    }

    // --- TELEMACHUS: fear, refusal, then recognition ----------------------
    {
      const p = blk.telemachus;
      const s = st.telemachus || {};
      const afraid   = t >= 17 && t < 27;
      const refusing = t >= 27 && t < 33;
      const weeping  = t >= 39;
      placeInstance(offctx, W, H, telemachus, {
        anchor:{ x:p.x, y:p.y }, scale:0.54 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "alert",
          gaze: s.gaze || { x:.28, y:-.06 },
          eyeWide:  afraid ? .48 : weeping ? .10 : .22,
          browUp:   afraid ? .52 : .28,
          browKnit: refusing ? .46 : weeping ? .50 : .10,
          frown:    weeping ? .58 : refusing ? .26 : 0,
          jaw:      afraid ? .34 : 0,
          status:   weeping ? "WEEPING" : refusing ? "NO MORTAL COULD"
                  : afraid ? "A GOD" : "WAITING",
          progress: Math.min(.96, .14 + .78*(t/D)),
        },
      });
    }

    // --- THE FLARE: same u, aligned to where the body actually is ---------
    if (changing){
      const p = blk.odysseus;
      placeInstance(offctx, W, H, restoration, {
        anchor:{x:.50,y:.99}, scale:1.0,
        state:{
          t:u, dir:"restore", spark:1.0,
          // hand the fx the figure's live box so the corridor wraps the body
          figure:{ x:p.x, y:p.y, w:0.22*p.scale, h:0.64*p.scale },
          status:"RESTORING", progress:u,
        },
      });
    }
  },
};
export default scene;
