/* ============================================================
   SCENE  OD-B16-S06 — The Beggar Returns
   Book XVI, scene 6 of 6 — the close of the book. ADDITIVE: creates nothing,
   modifies nothing. Shape copied from the reference scene, OD-B16-S03.mjs.

   THIS IS S03 RUN BACKWARD. S03 ramped guise beggar→restored with
   divine_fx.athenas-restoration on dir:"restore". Here the same one body runs
   restored→beggar with the same fx on dir:"reveil" — the module was built
   bidirectional for exactly this scene: the sweep starts at the crown instead
   of the feet, and the shed still falls downward, because gravity does not
   reverse when a god does. The garment snaps at u=0.5 (guise.mjs snapAt) and
   the flare is put on that frame to cover the one discontinuity. The audience
   must read ONE man being covered over again, not a cut to another module.

   ROOM. location.eumaeus-hut-interior, the same hut as S01–S03, blocked
   through scenes/_plans/eumaeus-hut.mjs. Its state runs day → fire_high (the
   meal) → night (they sleep), which is the whole shape of the scene's clock.

   CONTINUITY ACROSS THE ROOM CHANGE. S05's exitOccupancy is imported by name.
   Four of its six names are suitors standing in the megaron; they are NOT
   carried into the hut — a hall station is not a hut station, and blockingAt()
   would rightly throw on one. Only the two men who come back here are
   translated, through an explicit map, and the suitors are left where the hall
   left them. Change S05 and this scene follows.

   Beats (Od. 16.452–481):
     1. Athena touches Odysseus and the beggar is laid back over the king.
     2. Eumaeus comes in and reports the prince safe and the ambush ship home.
     3. A crewman's message reaches Penelope at the same hour, in the town.
     4. The three men eat and sleep; father and son keep the secret.

   Verify:  node harness/render-scene.mjs scenes/OD-B16-S06.mjs --t 10
            node harness/render-scene.mjs scenes/OD-B16-S06.mjs --t 34
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { eumaeusHut } from "./_plans/eumaeus-hut.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/eumaeus-hut-interior.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import eumaeus     from "../assets/character/eumaeus.mjs";
import restoration from "../assets/divine_fx/athenas-restoration.mjs";

import { exitOccupancy as PREV } from "./OD-B16-S05.mjs";

const FIELD_ASSET = "location.eumaeus-hut-interior";
const D = 52;

/* --- CONTINUITY IN, translated back across the room change --------------- */
const HALL_TO_HUT = {
  bench_r2:"seat_guest", table_r:"seat_guest", bench_r1:"bench_far",
  bench_l1:"bench_near", bench_l2:"bench_near", table_l:"bench_near",
  threshold:"door",      door_main:"door",     axe_last:"centre",
  hearth:"hearth",       corner_dead:"corner_dark", pillar_l:"corner_dark",
  pillar_r:"pen_wall",   stair_up:"pen_wall",  postern:"door",
};
const home = (who, fallback) => HALL_TO_HUT[PREV[who]] || fallback;
const INITIAL = {
  // the suitors in PREV keep the hall; only these two come back up the hill
  odysseus:   home("odysseus",   "seat_guest"),
  telemachus: home("telemachus", "door"),
  eumaeus:    "yard",
};

/* --- BLOCKING. Stations, not coordinates. -------------------------------- */
const MOVES = [
  { who:"telemachus", from:"door",       to:"bench_near", t0: 1, t1: 6 },
  // he stands clear of the stool for the goddess, then takes it back as a beggar
  { who:"odysseus",   from:"seat_guest", to:"centre",     t0: 3, t1: 7 },
  { who:"odysseus",   from:"centre",     to:"seat_guest", t0:15, t1:20 },
  // the swineherd comes up from the town
  { who:"eumaeus",    from:"yard",       to:"door",       t0:22, t1:26 },
  { who:"eumaeus",    from:"door",       to:"hearth",     t0:26, t1:31 },
  { who:"eumaeus",    from:"hearth",     to:"bench_far",  t0:42, t1:47 },
];

/* --- THE RAMP, RUN BACKWARD. One u drives the body AND the flare. -------- */
const R0 = 7, R1 = 13;                                  // re-veiling window
const ramp = t => t <= R0 ? 0 : t >= R1 ? 1 : (t - R0) / (R1 - R0);

export const scene = {
  id:"OD-B16-S06",
  title:"The Beggar Returns",
  book:16,
  plan:"eumaeus-hut",
  duration:D,
  beats:[
    "Athena comes to the hut and lays the beggar back over the king before the swineherd can see him.",
    "Eumaeus comes in from the town and reports Telemachus safely home and the ambush ship come back empty.",
    "A crewman's message reaches Penelope in the same hour, so the news is public before the plot can move.",
    "The three men eat and lie down; father and son give nothing away.",
  ],
  exitState:"Odysseus is the old beggar again on his stool, Telemachus on the near bench, Eumaeus across the hut at the far bench, the fire banked for the night. Nothing has been said aloud; Book XVII opens with the walk down to the town.",
  exitOccupancy:occupancyAt(eumaeusHut, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0 },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.57,y:.93}, scale:.52, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.38,y:.95}, scale:.50, band:"threeq", pose:"lean_forward" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.46,y:.86}, scale:.50, band:"threeq", pose:"eum_welcome" },
    { asset:"divine-fx.athenas-restoration", instance:"reveil_01",
      anchor:{x:.50,y:.99}, scale:1.0, blend:"multiply" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"lean_forward" } },
    { op:"fx.play",    target:"reveil_01",  at: R0,  args:{ dir:"reveil" } },
    { op:"actor.pose", target:"odysseus",   at: 8.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.pose", target:"telemachus", at: 8.0, args:{ pose:"hands_near_face" } },
    { op:"actor.gaze", target:"telemachus", at: 8.0, args:{ gaze:{ x:.30, y:-.04 } } },
    { op:"actor.pose", target:"odysseus",   at:13.0, args:{ pose:"head_lowered" } },
    { op:"actor.pose", target:"odysseus",   at:20.0, args:{ pose:"offering_hand" } },
    { op:"actor.pose", target:"telemachus", at:20.0, args:{ pose:"neutral_front" } },
    { op:"actor.pose", target:"eumaeus",    at:26.0, args:{ pose:"eum_welcome" } },
    { op:"actor.pose", target:"eumaeus",    at:31.0, args:{ pose:"eum_speak" } },
    { op:"actor.pose", target:"telemachus", at:31.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:31.0, args:{ gaze:{ x:-.10, y:.06 } } },
    { op:"actor.pose", target:"odysseus",   at:33.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose", target:"eumaeus",    at:40.0, args:{ pose:"eum_listen" } },
    { op:"actor.pose", target:"telemachus", at:44.0, args:{ pose:"head_lowered" } },
    { op:"actor.pose", target:"odysseus",   at:46.0, args:{ pose:"head_lowered" } },
    { op:"timeline.capture", target:"OD-B16-S06", at:50.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(eumaeusHut, MOVES, t, INITIAL);
    const u   = ramp(t);
    const changing = u > 0.001 && u < 0.999;
    const hidden   = t >= R1;                 // the disguise is back on
    const night    = t >= 44;
    /* the room's light is the scene's clock: they talk by daylight through the
       open door, the fire is built up for the meal, and it is banked for the
       night. fire_high is a heavy state — smoke to the roof hole — so it is
       held to the meal itself rather than run under the whole report. */
    const meal     = t >= 38 && t < 44;

    /* the field first — it paints the room, everything else keys onto it */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state: night ? "night" : meal ? "fire_high" : "day",
              t:0.5, progress:Math.min(.94, .2 + .7*(t/D)), status:"THE HUT" },
    });

    /* --- ODYSSEUS: one body, the ramp of S03 run in reverse -------------- */
    {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      const guise = u <= 0 ? "restored"
                  : u >= 1 ? "beggar"
                  : { from:"restored", to:"beggar", u };
      placeInstance(offctx, W, H, odysseus, {
        anchor:{ x:p.x, y:p.y }, scale:0.52 * p.scale,
        state:{
          t:0.5, guise, band:"threeq",
          pose: s.pose || "three_quarter_left",
          gaze: s.gaze || { x:-.14, y:.10 },
          browKnit: changing ? .40 : hidden ? .30 : .14,
          browUp:   changing ? .34 : .22,
          eyeNarrow:hidden ? .30 : .12,
          frown:    hidden && !night ? .20 : 0,
          smile:    !hidden ? .16 : 0,
          status:   night ? "SAYS NOTHING" : hidden ? "THE BEGGAR"
                  : changing ? "CONCEALING" : "THE KING",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      });
    }

    /* --- TELEMACHUS: he watches his father be taken away again ---------- */
    {
      const p = blk.telemachus;
      const s = st.telemachus || {};
      const watching = changing || (t >= R1 && t < 20);
      placeInstance(offctx, W, H, telemachus, {
        anchor:{ x:p.x, y:p.y }, scale:0.50 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "lean_forward",
          gaze: s.gaze || { x:.26, y:-.02 },
          eyeWide:  watching ? .44 : .16,
          browUp:   watching ? .48 : .24,
          browKnit: watching ? .22 : night ? .30 : .10,
          jaw:      changing ? .30 : 0,
          status:   night ? "KEEPING IT" : watching ? "GONE AGAIN" : "LISTENING",
          progress: Math.min(.96, .14 + .78*(t/D)),
        },
      });
    }

    /* --- EUMAEUS: he brings the news he does not know is already stale --- */
    if (t >= 22){
      const p = blk.eumaeus;
      const s = st.eumaeus || {};
      const reporting = t >= 31 && t < 40;
      placeInstance(offctx, W, H, eumaeus, {
        anchor:{ x:p.x, y:p.y }, scale:0.50 * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: s.pose || "eum_welcome",
          gaze: s.gaze || { x:.08, y:.02 },
          smile:    reporting ? .18 : .40,
          browUp:   reporting ? .34 : .34,
          browKnit: reporting ? .50 : .06,
          jaw:      reporting ? .44 : 0,
          status:   night ? "ASLEEP" : reporting ? "THE SHIP CAME HOME EMPTY" : "HOME FROM THE TOWN",
          progress: Math.min(.96, .30 + .62*(t/D)),
        },
      });
    }

    /* --- THE FLARE: same u, dir:"reveil", aligned to the body ----------- */
    if (changing){
      const p = blk.odysseus;
      placeInstance(offctx, W, H, restoration, {
        anchor:{x:.50,y:.99}, scale:1.0,
        state:{
          t:u, dir:"reveil", spark:1.0,
          /* NO CORRIDOR. The asset's `corridor` layer is a pale shaft laid
             OVER the body; in this small room, at this figure size, it lifts
             the whole middle of the frame off the dot threshold and washes out
             the very change it exists to frame. The other four layers are what
             carry the event — the sweep band running crown→foot, the shed
             falling downward, the wand spark at the crown and the one blue
             ACCENT mark at the u=0.5 garment snap — so the scene runs the fx
             on those and lets the room stay printed. */
          layers:["sweep","shed","spark","snap"],
          // hand the fx the figure's live box so the sweep spans the body
          figure:{ x:p.x, y:p.y, w:0.22*p.scale, h:0.60*p.scale },
          status:"CONCEALING", progress:u,
        },
      });
    }
  },
};
export default scene;
export const exitOccupancy = scene.exitOccupancy;
