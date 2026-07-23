/* ============================================================
   SCENE  OD-B09-S09 — The Blinding
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Polyphemus drinks three bowls, promises Nobody the last death, and
        collapses.
     2. Odysseus heats the stake until it glows and the men drive it into the
        Cyclops's eye.
     3. They twist it as blood and steam erupt; Polyphemus wakes with a roar and
        tears it free.
     4. Other Cyclopes call from outside but leave when he says Nobody is killing
        him.
     5. Polyphemus gropes at the entrance while the men hide among the animals.

   Stage layout — a paneled cave splash, unified by the single halftone:
     Polyphemus's cave (full-bleed page ground, sealed door, fire down to embers)
       -> CYCLOPES-OUTSIDE, an upper-left vignette: the roused neighbours at the
          sealed mouth, distant silhouettes calling in (beats 3-4)
       -> the EYE-BLINDING-EFFECT, the focal medallion upper-centre: the burning
          stake driven into the one giant eye — burst, ember, steam, blood
       -> the FOUR STAKE BEARERS across the lower centre: the braced team spinning
          the glowing olive stake like a drill (the mechanism of the deed)
       -> POLYPHEMUS colossal at right, reeling — drunken collapse into the
          blinding, both fists driven to the ruined eye, then groping at the door
       -> ODYSSEUS foreground-left, the crafty captain directing the drive, then
          slipping among the animals as the deed is done.
   One clock: the collapse, the heated drive, the twist and roar, the neighbours'
   calling, and the blind groping all fold onto the master time.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import cave     from "/assets/location/polyphemuss-cave.mjs";
import cyclopes from "/assets/ensemble/cyclopes-outside.mjs";
import blinding from "/assets/divine_fx/eye-blinding-effect.mjs";
import bearers  from "/assets/ensemble/four-stake-bearers.mjs";
import polyphemus from "/assets/character/polyphemus.mjs";
import odysseus from "/assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B09-S09",
  title:"The Blinding",
  book:1,
  beats:[
    "Polyphemus drinks three bowls, promises Nobody the last death, and collapses.",
    "Odysseus heats the stake until it glows and the men drive it into the Cyclops's eye.",
    "They twist it as blood and steam erupt; Polyphemus wakes with a roar and tears it free.",
    "Other Cyclopes call from outside but leave when he says Nobody is killing him.",
    "Polyphemus gropes at the entrance while the men hide among the animals.",
  ],
  exitState:"Polyphemus gropes at the entrance while the men hide among the animals.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the cave interior — full-bleed page ground, door sealed, fire to embers
    { asset:"location.polyphemuss-cave", instance:"cave_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"sealed" },

    // the roused neighbours outside the sealed mouth (upper-left vignette)
    { asset:"ensemble.cyclopes-outside", instance:"cyclopes_01",
      anchor:{x:.195,y:.520}, scale:.40, pose:"approaching" },

    // the focal medallion — the burning stake driven into the one giant eye
    { asset:"divine_fx.eye-blinding-effect", instance:"blinding_01",
      anchor:{x:.500,y:.500}, scale:.44, pose:"struck" },

    // the braced team spinning the glowing olive stake (the mechanism)
    { asset:"ensemble.four-stake-bearers", instance:"bearers_01",
      anchor:{x:.500,y:1.00}, scale:.60, pose:"heave" },

    // Polyphemus colossal at right — drunken collapse into the blinding
    { asset:"character.polyphemus", instance:"poly_01",
      anchor:{x:.755,y:.990}, scale:.80, pose:"poly_drunk",
      gaze:{x:.06,y:.18}, band:"threeq" },

    // Odysseus foreground-left, directing the drive
    { asset:"character.odysseus", instance:"ody_01",
      anchor:{x:.130,y:.990}, scale:.50, pose:"one_arm_raised",
      gaze:{x:.36,y:-.06}, band:"threeq" },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: the wine takes him — heavy-lidded, then the drunken collapse
    { op:"actor.pose", target:"poly_01",     at:0.0,  args:{ pose:"poly_drunk" } },
    { op:"actor.pose", target:"bearers_01",  at:0.0,  args:{ pose:"brace" } },
    // beat 2: Odysseus commands the heated drive; the team heaves the stake in
    { op:"actor.pose", target:"bearers_01",  at:5.0,  args:{ pose:"heave" } },
    { op:"actor.pose", target:"poly_01",     at:6.0,  args:{ pose:"poly_blinded" } },
    { op:"actor.gaze", target:"poly_01",     at:6.0,  args:{ gaze:{x:0,y:-.10} } },
    // beat 3: they twist it — the auger bites; he wakes with a roar
    { op:"actor.pose", target:"bearers_01",  at:16.0, args:{ pose:"rotate" } },
    // beat 4: the neighbours rouse, gather at the mouth, then are answered off
    { op:"actor.pose", target:"cyclopes_01", at:20.0, args:{ pose:"gathering" } },
    { op:"actor.pose", target:"cyclopes_01", at:28.0, args:{ pose:"answered" } },
    { op:"actor.pose", target:"cyclopes_01", at:33.0, args:{ pose:"dispersing" } },
    // beat 5 (exit): Polyphemus gropes the door; Odysseus slips among the flock
    { op:"actor.pose", target:"poly_01",     at:31.0, args:{ pose:"poly_grope" } },
    { op:"actor.gaze", target:"poly_01",     at:31.0, args:{ gaze:{x:0,y:.40} } },
    { op:"actor.pose", target:"ody_01",      at:32.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"ody_01",      at:32.0, args:{ gaze:{x:.18,y:.14} } },
    { op:"timeline.capture", target:"OD-B09-S09", at:38.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify + card
     pass, so the whole splash shares one halftone. Back -> front. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);
    const prog = Math.max(0, Math.min(1, t / scene.duration));

    // --- per-asset pose -> channel-state adapters -------------------------
    const polyEye = (pose)=>({
      poly_drunk:"half", poly_sleep:"shut", poly_blinded:"blind",
      poly_grope:"blind", poly_labor:"watch", poly_brutal:"glare",
    }[pose] || "glare");

    const bearersState = (pose)=>{
      switch(pose){
        case "brace":  return { strain:0.45, synchrony:0.55, phase:0.02, spread:1.0 };
        case "rotate": return { strain:0.90, synchrony:0.98, phase:0.70, spread:1.0 };
        default:       return { strain:0.95, synchrony:0.95, phase:0.30, spread:1.0 };
      }
    };

    const cyclopesState = (pose)=>{
      switch(pose){
        case "approaching":return { formation:"gathering",  gather:0.30, attention:0.65, distance:0.68 };
        case "gathering":  return { formation:"gathered",   gather:0.82, attention:0.92, distance:0.42 };
        case "answered":   return { formation:"gathered",   gather:0.66, attention:0.32, distance:0.46 };
        case "dispersing": return { formation:"dispersing", gather:0.12, attention:0.14, distance:0.70 };
        default:           return { formation:"gathering",  gather:0.30, attention:0.65, distance:0.68 };
      }
    };

    // the eye-blinding effect is driven continuously off the master clock:
    // intact -> struck (impact) -> permanently blinded.  Peaks struck ~t8.
    const fxInternal = Math.max(0, Math.min(1, (t - 2) / 24));

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "cave_01"){
        mod = cave;
        // sealed door, fire down to embers — the men are shut in with the deed
        state = { sealed:true, fireLevel:"embers",
                  layers:["recesses","vault","backwall","entrance","sleeping",
                          "floor","cheese","pens","pails","fire"], t:0.6 };
      } else if (c.instance === "cyclopes_01"){
        mod = cyclopes;
        state = { ...cyclopesState(s.pose || "approaching"), count:5,
                  showHills:true, showThreshold:true };
      } else if (c.instance === "blinding_01"){
        mod = blinding;
        state = { t:fxInternal, intensity:1.1,
                  layers:["face","stake","eye","ember","burst","steam","blood","smoke"] };
      } else if (c.instance === "bearers_01"){
        mod = bearers;
        state = { ...bearersState(s.pose || "heave") };
      } else if (c.instance === "poly_01"){
        mod = polyphemus;
        const pose = s.pose || c.pose;
        state = { pose, eye:polyEye(pose), band:c.band,
                  gaze:s.gaze || c.gaze, browKnit: pose==="poly_blinded"?1:0.4,
                  jaw: pose==="poly_blinded"?0.8:0.2, t:0.5 };
      } else { // ody_01
        mod = odysseus;
        const pose = s.pose || c.pose;
        state = { pose, band:c.band, gaze:s.gaze || c.gaze,
                  jaw: pose==="one_arm_raised"?0.42:0.1,
                  browUp: pose==="one_arm_raised"?0.4:0.1,
                  eyeWide: pose==="one_arm_raised"?0.3:0.0, t:0.5 };
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
