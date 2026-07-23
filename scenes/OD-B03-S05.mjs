/* ============================================================
   SCENE  OD-B03-S05 — Athena Reveals Herself at Pylos
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Night approaches and Nestor invites the guests to his palace.
     2. Athena refuses and suddenly flies away in the form of a sea-eagle.
     3. Nestor recognizes divine favour and prays to Athena.
     4. At dawn a heifer is sacrificed; Telemachus is bathed and dressed for departure.

   Stage layout (back -> front):
     Nestor's palace and courtyard (full-frame set: facade, portico, altar, bath)
       -> the Athena-to-sea-eagle transformation crossing the sky above the court
       -> Nestor in the courtyard, first hosting then lifting hands in prayer
       -> the gilded heifer at the central altar, led to the consecration
       -> Telemachus at the bathing basin, dressed and readied for departure.
   The set supplies the whole palace; the FX supplies the divine sign overhead;
   the heifer + prince carry the dawn sacrifice / bathing of the exit state.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp, smooth } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace     from "../assets/location/nestors-palace-and-courtyard.mjs";
import eagleFX    from "../assets/divine_fx/athena-to-sea-eagle-transformation.mjs";
import nestor     from "../assets/character/nestor.mjs";
import heifer     from "../assets/creature/gilded-heifer-ritual.mjs";
import telemachus from "../assets/character/telemachus.mjs";

export const scene = {
  id:"OD-B03-S05",
  title:"Athena Reveals Herself at Pylos",
  book:1,
  beats:[
    "Night approaches and Nestor invites the guests to his palace.",
    "Athena refuses and suddenly flies away in the form of a sea-eagle.",
    "Nestor recognizes divine favour and prays to Athena.",
    "At dawn a heifer is sacrificed; Telemachus is bathed and dressed for departure.",
  ],
  exitState:"At dawn a heifer is sacrificed; Telemachus is bathed and dressed for departure.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // Nestor's palace + courtyard — the full-frame set the whole scene plays in
    { asset:"location.nestors-palace-and-courtyard", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"sacrifice" },

    // the goddess quitting the gathering as a great sea-eagle, crossing overhead
    // (drawn over the court sky — the set supplies the ground, so drop the FX's
    //  own gathering band and keep only the departing form + wake + bird)
    { asset:"divine_fx.athena-to-sea-eagle-transformation", instance:"eagle_01",
      anchor:{x:.46,y:.60}, scale:.66, pose:"crossing" },

    // Nestor in his courtyard — hosts the guests, then lifts his hands in prayer
    { asset:"character.nestor", instance:"nestor_01",
      anchor:{x:.30,y:.92}, scale:.34, pose:"nestor_host",
      gaze:{x:-.14,y:.06}, band:"threeq" },

    // the gilded heifer led to the central altar for the dawn consecration
    { asset:"creature.gilded-heifer-ritual", instance:"heifer_01",
      anchor:{x:.54,y:.965}, scale:.40, pose:"procession" },

    // the prince at the bathing basin, washed and dressed for the road
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.80,y:.93}, scale:.30, pose:"alert",
      gaze:{x:.10,y:-.06}, band:"threeq" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 1: Nestor, at nightfall, turns to his guests with the invitation
    { op:"actor.gaze", target:"nestor_01",   at:2.0,  args:{ gaze:{x:.20,y:.02} } },
    // beat 2: the goddess flies off — the transformation crosses the sky
    { op:"fx.play",    target:"eagle_01",    at:8.0,  args:{} },
    // beat 3: Nestor recognizes the sign and lifts his hands in prayer
    { op:"actor.pose", target:"nestor_01",   at:14.0, args:{ pose:"nestor_prayer" } },
    { op:"actor.gaze", target:"nestor_01",   at:14.0, args:{ gaze:{x:.06,y:-.66} } },
    // beat 4 (dawn): the heifer is bowed to the altar; the prince is readied
    { op:"actor.pose", target:"telemachus_01", at:30.0, args:{ pose:"hospitality" } },
    // exit: the dawn sacrifice + bathing complete
    { op:"timeline.capture", target:"OD-B03-S05", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: palace set, sky FX, Nestor, heifer, prince. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // set state folds off the clock: night invitation -> sacrifice/bathing at dawn
    const palaceNode = t < 20
      ? ["sky","facade","floor","portico","guestbeds","bath","altar","chariot","gate"]  // beds still up at night
      : ["sky","facade","floor","portico","bath","altar","gate"];                       // beds struck, dawn rite

    // the transformation climbs its crossing arc as the goddess departs (beat 2).
    // by the reveal it is already well up the sky, crossing above the courtyard.
    const fxLift = clamp01(t / 20);                       // ramps to full crossing
    const fxT    = lerp(0.30, 0.70, smooth(fxLift));      // low lift-off -> great eagle crossing

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "palace_01"){
        mod = palace;
        state = { layers: palaceNode };
      } else if (c.instance === "eagle_01"){
        mod = eagleFX;
        // sky sign only — the set already supplies the courtyard ground AND
        // Nestor stands where the FX's own Mentor silhouette would, so drop both
        // the "gathering" band and the "mentor" figure; keep wake + motes + bird
        state = { t:fxT, intensity:1.05, wingSpan:1.0,
                  layers:["wake","motes","eagle"] };
      } else if (c.instance === "heifer_01"){
        mod = heifer;
        // led forward at night, bowed to the altar once the dawn rite begins
        state = t < 30 ? { pose:"procession", t:clamp01(t*0.05) } : { pose:"sacrifice" };
      } else {
        // named figures: fold pose/gaze/band from the timeline over their rig
        mod = c.instance === "nestor_01" ? nestor : telemachus;
        state = { t:t*0.4, band:c.band, ...s };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
