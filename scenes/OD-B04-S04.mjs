/* ============================================================
   SCENE  OD-B04-S04 — The Wooden Horse
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Menelaus answers with the story of the wooden horse.
     2. Helen circled the horse and imitated the voices of the warriors' wives.
     3. The hidden Greeks nearly answered; Odysseus restrained them and
        silenced Anticlus.
     4. Telemachus hears proof of his father's endurance and command.

   Stage layout (back -> front):
     the wooden-horse interior cavity (ribs, planks, ladder, roof hatch,
     light-leaking seams — the whole hollow set, full frame)
       -> the hidden Greek warriors packed in the belly (the tempted knot,
          one man being forcibly stilled)
       -> Helen at the horse's flank, calling in a borrowed voice (right)
       -> Odysseus foreground, reaching to clamp and silence Anticlus
       -> the imitated wives' voices, an emitter diagram circling the shell
          (upper-left inset annotation).
   The interior holds the men; Helen's mimicry leaks through the seam; the
   voice-diagram walks the temptation around the hull; Odysseus holds the line.
   ============================================================ */
import { placeInstance, clamp01, clamp, lerp } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import interior from "/assets/location/wooden-horse-interior.mjs";
import warriors from "/assets/ensemble/hidden-greek-warriors.mjs";
import helen    from "/assets/character/helen-at-the-horse.mjs";
import odysseus from "/assets/character/odysseus.mjs";
import voices   from "/assets/sound_source/imitated-wives-voices.mjs";

export const scene = {
  id:"OD-B04-S04",
  title:"The Wooden Horse",
  book:1,
  beats:[
    "Menelaus answers with the story of the wooden horse.",
    "Helen circled the horse and imitated the voices of the warriors' wives.",
    "The hidden Greeks nearly answered; Odysseus restrained them and silenced Anticlus.",
    "Telemachus hears proof of his father's endurance and command under pressure.",
  ],
  exitState:"Telemachus hears proof of his father's endurance and command under pressure.",
  duration:40,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the hollow horse itself: curved rib beams, planking, boarding ladder,
    // roof hatch, and thin daylight seams — the whole concealed cavity, framing
    { asset:"location.wooden-horse-interior", instance:"interior_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"concealed" },

    // the Achaeans crammed in the belly: a dark packed knot under the cross-brace,
    // a familiar voice leaking through the seam, one man caught and stilled
    { asset:"ensemble.hidden-greek-warriors", instance:"warriors_01",
      anchor:{x:.500,y:.990}, scale:.70, pose:"crammed" },

    // Helen at the horse's flank, head cocked to the wood, throwing a wife's
    // voice into the hull — intent unreadable
    { asset:"character.helen-at-the-horse", instance:"helen_01",
      anchor:{x:.855,y:.965}, scale:.34, pose:"helen_listen",
      gaze:{x:-.55,y:.05} },

    // Odysseus foreground: reaching in to clamp Anticlus's mouth, holding the
    // ranks under command — endurance and control under pressure
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.415,y:.990}, scale:.365, pose:"three_quarter_right",
      gaze:{x:.26,y:.22}, band:"threeq" },

    // the circling wives' voices as a legible emitter diagram (upper-left inset):
    // the shell ringed by a moving voice walking station to station
    { asset:"sound_source.imitated-wives-voices", instance:"voices_01",
      anchor:{x:.190,y:.400}, scale:.33, pose:"calling" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 2: Helen begins the mimicry, then throws the borrowed voice louder
    { op:"actor.pose", target:"helen_01", at:2.0,  args:{ pose:"helen_mimic" } },
    { op:"actor.gaze", target:"helen_01", at:2.0,  args:{ gaze:{x:-.62,y:.02} } },
    { op:"actor.pose", target:"helen_01", at:13.0, args:{ pose:"helen_call" } },
    // beat 3: Odysseus reaches in to restrain and silence the man
    { op:"actor.pose", target:"odysseus_01", at:3.0, args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"odysseus_01", at:3.0, args:{ gaze:{x:.30,y:.26} } },
    // beat 4 exit: proof of Odysseus's endurance and command lands on Telemachus
    { op:"timeline.capture", target:"OD-B04-S04", at:39.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: interior set, packed warriors, Helen at the flank, Odysseus
     restraining, then the circling-voice diagram inset. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the temptation folds off one clock: silent and packed -> the voice reaches
    // them and heads turn -> one man caught and forcibly stilled
    const strain    = clamp01((t - 1.5) / 7);        // reaction wave spreading
    const attention = clamp01((t - 0.5) / 5);        // pull of the voice
    const silenced  = t >= 4;                         // Anticlus clamped at t=4
    const formation = t < 4 ? "packed" : "pressing";
    const voicePos  = (0.12 + t * 0.030) % 1;         // the voice walks the hull
    const voiceInt  = clamp(0.55 + t * 0.05, 0, 0.94);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      let mod, state;

      if (c.instance === "interior_01"){
        mod = interior;
        // the full concealed cavity, seams admitting thin daylight
        state = { layers:["hull","planks","seams","stern","ribs","benches","ladder","hatch","floor"],
                  daylight:0.5 };
      } else if (c.instance === "warriors_01"){
        mod = warriors;
        state = { formation, strain, attention, voiceSide:1,
                  silencedIndex: silenced ? 10 : -1,
                  showVoice:true, showBeam:true };
      } else if (c.instance === "voices_01"){
        mod = voices;
        state = { position:voicePos, intensity:voiceInt, moving:true, stopped:false };
      } else {
        // the two named figures: fold pose/gaze/band from the timeline
        mod = c.instance === "helen_01" ? helen : odysseus;
        state = { t, band:c.band, gaze:c.gaze, ...s, anchor:undefined };
        placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
        continue;
      }

      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
