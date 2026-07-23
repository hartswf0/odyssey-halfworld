/* character.ajaxs-shade — the pale ghost of Great Ajax, the silent warrior.
   CHARACTER asset. In the House of the Dead (OD-B11-S07) Odysseus tries to
   make peace with the shade of Ajax — who killed himself after the arms of
   the dead Achilles were awarded to Odysseus, not to him. But Ajax will not
   answer. He turns his massive back and stalks off into the dark without a
   word: the most eloquent silence in the poem — a huge hulking armored figure
   refusing eye contact or speech over the armor judgment.

   Built on the HALFTRACK hero rig. Distinct silhouette: a big, broad, BEARDED
   warrior in heavy battle ARMOR under a war-cloak, faded near-white hair and
   beard, bare-shinned in sandals, scaled up so he looms. He is a shade, so
   the whole figure is drawn TRANSLUCENT (paper bleeds through the dot pass).

   EXPRESSIVENESS — the opposite of every other card: the emotion here is a
   REFUSAL. The rig reads face channels from the composed POSE, so Ajax ships
   bespoke poses into the shared registry that TURN HIM AWAY — body yawed off
   the viewer, head turned further aside, gaze locked away (never eye contact),
   heavy arms FOLDED shut or hanging in fists, jaw clamped SHUT (he never
   speaks), and a stony resentful brow (knit hard) wherever a sliver of face
   shows. That closed, turned-away body IS the performance. */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* ---- bespoke Ajax poses (additive; shared table) ----
   Conventions: he never gestures OUT — the arms fold in (crossed) or hang in
   heavy fists. Every beat yaws the body AWAY, casts the gaze off the viewer,
   and clamps jaw=0 (silence). A broad, forward carriage (chestOpen + a high
   rootScale bulk) is baked into every beat. */

// THE CARD — COLD SHOULDER: the body wheeled to a full PROFILE and the head
// turned further off along it, so he presents his side and stares ahead into
// the dark — never at us. Head bowed, shoulders hunched, huge arms hanging in
// heavy fists. Brows knit hard over a narrowed eye and a mouth clamped in a
// stony, bitter silence. The whole refusal carried in the turned-away body.
HERO_POSES.ajax_cold = { id:"ajax_cold", label:"cold shoulder", group:"ajax",
  n:{ browUp:.14, browKnit:.58, eyeNarrow:.5, frown:.34, jaw:0, mouthAsym:.26,
      headPitch:.14, neckPitch:.05, headYaw:1.5, headRoll:-.04,
      bodyYaw:1.4, spineLean:.05, chestOpen:.4,
      armLUpper:.18, armLLower:.42, armRUpper:-.18, armRLower:.42,
      handRotL:-.06, handRotR:.06, shoulderLiftL:.16, shoulderLiftR:.16,
      rootScale:1.12 },
  opt:{ hands:["fist","fist"] } };

// TURNING HIS BACK — the full cold shoulder: body and head both wheeled to the
// back view, so nothing of the face shows at all. A big somber armored
// silhouette, shoulders hunched, arms hanging in heavy fists. The refusal made
// total — he will not even be looked at.
HERO_POSES.ajax_back = { id:"ajax_back", label:"turning his back", group:"ajax",
  n:{ browKnit:.4, frown:.2, jaw:0,
      headPitch:.2, neckPitch:.1, headYaw:Math.PI, headRoll:.02,
      bodyYaw:Math.PI, chestOpen:.3, spineLean:.05,
      armLUpper:.14, armLLower:.3, armRUpper:-.14, armRLower:.3,
      shoulderLiftL:.18, shoulderLiftR:.18,
      rootScale:1.12 },
  opt:{ hands:["fist","fist"] } };

// STONY RESENTMENT — the one beat where the face is legible: turned three-
// quarter away, arms hanging in heavy fists, head angled just enough that we
// catch the stony resentful profile — brows crushed together, eyes narrowed to
// a cold glare cast HARD to the side (past us, never at us), jaw set, a bitter
// twist to the shut mouth. The grudge over the armor, worn in the face.
HERO_POSES.ajax_stony = { id:"ajax_stony", label:"stony resentment", group:"ajax",
  n:{ browUp:.1, browKnit:.7, eyeNarrow:.54, frown:.4, jaw:0, mouthAsym:.32,
      headPitch:.06, neckYaw:-.18, headYaw:-.72, headRoll:.06,
      bodyYaw:-.86, chestOpen:.46, spineLean:.02,
      armLUpper:.16, armLLower:.44, armRUpper:-.5, armRLower:1.02,
      handRotL:-.05, handRotR:-.14, shoulderLiftL:.1, shoulderLiftR:.14,
      rootScale:1.1 },
  opt:{ hands:["fist","fist"] } };

// LOOMING SILENCE — a staging/continuity beat: he stands nearly square and
// enormous, arms folded shut, but the head is turned aside and the gaze slid
// off, refusing to meet the eye even face-on. Jaw shut. The huge somber
// presence before he turns and goes.
HERO_POSES.ajax_loom = { id:"ajax_loom", label:"looming silence", group:"ajax",
  n:{ browUp:.08, browKnit:.5, eyeNarrow:.44, frown:.3, jaw:0, mouthAsym:.14,
      headPitch:.05, neckYaw:-.16, headYaw:-.52, headRoll:.03,
      bodyYaw:-.16, chestOpen:.52, spineLean:.0,
      armLUpper:.2, armLLower:.4, armRUpper:-.2, armRLower:.4,
      handRotL:-.06, handRotR:.06, shoulderLiftL:.14, shoulderLiftR:.14,
      rootScale:1.13 },
  opt:{ hands:["fist","fist"] } };

const params = {
  skin:"#ded8cc", hairColor:"#c2bdb0",   // pale shade flesh; faded near-white hair + beard
  hair:"short", beard:true, glasses:false,
  garment:"armor", cloak:true, bareLegs:true, scale:1.06,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.ajaxs-shade",
  type:"CHARACTER",
  name:"Ajax's shade",
  statusWord:"RESENTFUL",
  scene:"OD-B11-S07",

  params,
  layers:["shadow","hair-back","legs","armor","cloak","torso","far-arm","neck",
          "head","face","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.18}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.19},
    leftShoulder:{x:.36,y:.28}, rightShoulder:{x:.64,y:.28},
    leftHand:{x:.42,y:.50}, rightHand:{x:.58,y:.50},
    hip:{x:.50,y:.62}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"refusing",
    nodes:{
      // THE beat — the cold shoulder, turned away, arms folded, stony silence
      refusing:  { preview:{ pose:"ajax_cold", gaze:{x:.5,y:.14},
                             browUp:.14, browKnit:.58, eyeNarrow:.5, frown:.34,
                             jaw:0, mouthAsym:.26, status:"REFUSING" } },
      // the full cold shoulder — wheeled to the back, no face at all
      turned:    { preview:{ pose:"ajax_back", gaze:{x:0,y:.1},
                             browKnit:.4, frown:.2, jaw:0, status:"TURNED AWAY" } },
      // stony resentment — the grudge legible in a three-quarter profile glare
      stony:     { preview:{ pose:"ajax_stony", gaze:{x:-.58,y:.06},
                             browUp:.1, browKnit:.66, eyeNarrow:.52, frown:.36,
                             jaw:0, mouthAsym:.3, status:"RESENTFUL" } },
      // looming silence — massive, square, arms folded, eyes slid off
      looming:   { preview:{ pose:"ajax_loom", gaze:{x:-.5,y:.02},
                             browUp:.08, browKnit:.48, eyeNarrow:.42, frown:.28,
                             jaw:0, status:"SILENT" } },
    },
    edges:[
      ["looming","refusing"],["refusing","stony"],["stony","turned"],
      ["turned","looming"],["refusing","turned"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band","solid",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — RESENTFUL: the big armored shade turned to a full profile,
  // presenting his side and staring ahead into the dark, never at us — head
  // bowed, shoulders hunched, huge arms hanging in heavy fists — brow knit hard
  // over a narrowed eye and a mouth clamped in a stony, bitter silence. The
  // whole refusal carried in the turned-away body.
  preview:()=>({ pose:"ajax_cold", gaze:{x:.5,y:.14},
                 browUp:.14, browKnit:.58, eyeNarrow:.5, frown:.34,
                 jaw:0, mouthAsym:.26, t:0.5, status:"RESENTFUL", progress:.2 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // a shade: draw the figure translucent. `solid` forces him fully present.
    const alpha = st.solid ? 1 : 0.6;
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = fig.draw(ctx, W, H, st);
    ctx.restore();
    return r;
  },
};
export default asset;
