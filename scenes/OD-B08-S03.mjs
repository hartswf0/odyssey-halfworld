/* ============================================================
   SCENE  OD-B08-S03 — The Athletic Challenge
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Phaeacian youths compete in running, wrestling, jumping, discus, boxing.
     2. Laodamas invites Odysseus; Euryalus insults him as a merchant with no
        athletic skill.
     3. Angered, Odysseus hurls a discus beyond every mark and challenges the
        athletes.
     4. Alcinous calms the confrontation and shifts the display toward dance
        and song.

   Stage layout (the marked games ground, back -> front):
     PHAEACIAN ATHLETIC FIELD as the empty navigable set (full bleed) — the
     diagrammatic top-down games ground: numbered track, wrestling ring, long-
     jump pit, boxing square, and the discus throwing arc fanning to its
     distance markers. This is the geography every beat sits on.
       -> EURYALUS left, the cocky young athlete whose careless insult triggers
          the demonstration (beat 2).
       -> LAODAMAS right, the courteous prince who invites the guest and later
          helps mend the hall (beats 2, 4).
       -> the DISCUS in flight over the sector — the heavy disk Odysseus hurls
          beyond every distance marker (beat 3).
       -> ODYSSEUS foreground centre at the throwing circle, arm thrown up on
          the release, then challenging the athletes (beat 3), composed again as
          Alcinous calms the field (beat 4).
   Invitation, insult, the great throw, and the king's calming all held on one
   clock over a single marked field.
   ============================================================ */
import { placeInstance } from "/engine/halfworld-engine.mjs";
import { stateAt } from "/scenes/_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import field     from "/assets/location/phaeacian-athletic-field.mjs";
import euryalus  from "/assets/character/euryalus.mjs";
import laodamas  from "/assets/character/laodamas.mjs";
import odysseus  from "/assets/character/odysseus.mjs";
import discus    from "/assets/prop/discus.mjs";

export const scene = {
  id:"OD-B08-S03",
  title:"The Athletic Challenge",
  book:1,
  beats:[
    "Phaeacian youths compete in running, wrestling, jumping, discus, and boxing.",
    "Laodamas invites Odysseus; Euryalus insults him as a merchant without athletic skill.",
    "Angered, Odysseus hurls a discus beyond every mark and challenges the athletes.",
    "Alcinous calms the confrontation and shifts the display toward dance and song.",
  ],
  exitState:"Alcinous calms the confrontation and shifts the display toward dance and song.",
  duration:22,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the empty navigable set: the marked games ground, full bleed — the
    // geography of the whole scene
    { asset:"location.phaeacian-athletic-field", instance:"field_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // beat 2: Euryalus left — the cocky athlete whose careless insult triggers
    // the demonstration
    { asset:"character.euryalus", instance:"euryalus_01",
      anchor:{x:.255,y:.70}, scale:.40, pose:"euryalus_cocky", band:"front",
      gaze:{x:.30,y:-.04} },

    // beats 2 & 4: Laodamas right — the courteous prince inviting the guest,
    // later helping mend the hall
    { asset:"character.laodamas", instance:"laodamas_01",
      anchor:{x:.815,y:.60}, scale:.40, pose:"laodamas_inviting", band:"front",
      gaze:{x:-.30,y:.06} },

    // beat 3: the discus in flight over the sector — the disk Odysseus hurls
    // beyond every distance marker (mode driven by the clock in stage())
    { asset:"prop.discus", instance:"discus_01",
      anchor:{x:.64,y:.52}, scale:.42 },

    // beat 3: Odysseus foreground centre at the throwing circle — arm thrown up
    // on the release, then challenging the athletes, composed again at the calm
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.50,y:.905}, scale:.52, pose:"neutral", band:"front",
      gaze:{x:.16,y:-.04} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 2: Laodamas invites the guest into the games...
    { op:"actor.pose", target:"laodamas_01", at:3.0, args:{ pose:"laodamas_inviting" } },
    { op:"actor.gaze", target:"laodamas_01", at:3.0, args:{ gaze:{x:-.30,y:.06} } },
    // ...and Euryalus flicks out the careless insult (merchant, no athlete's skill)
    { op:"actor.pose", target:"euryalus_01", at:4.0, args:{ pose:"euryalus_dismiss" } },
    { op:"actor.gaze", target:"euryalus_01", at:4.0, args:{ gaze:{x:.6,y:-.06} } },
    // beat 3: angered, Odysseus takes the disk up and HURLS — arm thrown high
    { op:"actor.pose", target:"odysseus_01", at:6.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus_01", at:6.0, args:{ gaze:{x:.28,y:-.20} } },
    // ...then rounds on the athletes and challenges them all
    { op:"actor.pose", target:"odysseus_01", at:11.0, args:{ pose:"speaking" } },
    { op:"actor.gaze", target:"odysseus_01", at:11.0, args:{ gaze:{x:-.30,y:-.02} } },
    // beat 4: Alcinous calms the field — Laodamas leans in to mend the hall,
    // Euryalus's swagger falls, Odysseus is composed as the show turns to dance
    { op:"actor.pose", target:"laodamas_01", at:15.0, args:{ pose:"laodamas_reconciling" } },
    { op:"actor.gaze", target:"laodamas_01", at:15.0, args:{ gaze:{x:-.12,y:.24} } },
    { op:"actor.pose", target:"euryalus_01", at:15.5, args:{ pose:"euryalus_cocky" } },
    { op:"actor.gaze", target:"euryalus_01", at:15.5, args:{ gaze:{x:.1,y:.06} } },
    { op:"actor.pose", target:"odysseus_01", at:16.0, args:{ pose:"neutral" } },
    { op:"actor.gaze", target:"odysseus_01", at:16.0, args:{ gaze:{x:-.10,y:.02} } },
    { op:"timeline.capture", target:"OD-B08-S03", at:21.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the marked field, the two Phaeacians, the flying discus,
     then Odysseus foreground at the throwing circle. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the discus mode is driven directly off the clock (grip -> windup ->
    // flight -> strike -> mark): the great throw, deterministic
    const discusMode =
      t < 6.0  ? "grip"   :
      t < 7.5  ? "windup" :
      t < 10.0 ? "flight" :
      t < 12.0 ? "strike" :
                 "mark";

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "field_01"){
        mod = field;
        // the full marked games ground — every event zone + framing crowd
        state = { layers:["ground","crowd","track","jumppit",
                          "wrestling","boxing","discus"], t };
      } else if (c.instance === "discus_01"){
        mod = discus;
        // the disk in its clock-driven throw state (in flight at the check-t)
        state = { mode:discusMode, t };
      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale
        mod = (c.instance === "euryalus_01") ? euryalus
            : (c.instance === "laodamas_01") ? laodamas
            :                                  odysseus;
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
