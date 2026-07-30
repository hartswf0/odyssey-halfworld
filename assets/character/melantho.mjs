/* character.melantho — the favoured maid of the house of Odysseus.
   CHARACTER asset. Dolius' daughter, reared by Penelope "like her own child",
   and the sister-rhyme to character.melanthius: the OTHER traitor in service.
   Where the goatherd's contempt is a man's swagger — one fist on the hip, spine
   lolled, a kick — hers is a young woman's: a fine gift-gown she was never given
   for work, hair bound up and glossy, BOTH hands planted at the waist with the
   elbows swung wide, chin lifted, eyes sliding DOWN at the beggar by the braziers
   she was sent to tend — and then the other face entirely, tipped up and laughing
   at Eurymachus' table.

   Scene function:
     OD-B18-S05  the favoured maid expressing contempt and disloyal intimacy
                 with the suitors — she abandons the braziers, jeers the beggar
                 out of the hall, and turns her warmth on the men at the table.

   CHARACTERISATION: the asset ships BOTH faces, because the pairing is the
   character. Contempt aimed DOWN (akimbo, jeer, dismiss) and intimacy aimed UP
   (lean, laugh). A maid who only sneers is a scold; Melantho is dangerous
   because the same face is charming three feet to the left. The hero rig reads
   brow / eye / jaw / mouth straight off the composed pose, so every beat authors
   its face, its arms and its stance together and no scene layer has to flatten
   them.

   OVERPAINT is costume ONLY — a gown skirt drawn from the rig's OWN reported hip
   anchor (so it tracks the pose instead of drifting off a cocked hip) and a small
   bound hair-knot tracking the head/crown anchors. Body, face and hands are the
   shared rig untouched, so she stays in family and the engine's single dotify
   POST pass supplies the halftone. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Melantho poses ----
   Registered additively into the shared rig registry (the same module singleton
   the hero figure reads), so preview()/states name them like any built-in pose.
   Conventions inherited from the rig: a NEGATIVE bodyYaw draws the LEFT arm in
   FRONT (near camera) and a POSITIVE bodyYaw brings the RIGHT arm near;
   -headPitch lifts the chin while +gazeY drops the pupils, which together is
   looking down the nose — the whole of her contempt beats. Inverted
   (+headPitch with -gazeY) it is the up-glance she keeps for the suitors. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"melantho", n, opt:hands?{hands}:{} }; }

// THE CARD — CONTEMPT: both hands planted at the waist, elbows swung wide, weight
// thrown onto one hip, chin lifted and head cocked while the eyes slide DOWN at
// the man on the floor. The mouth is pulled hard to one side: mouthAsym does the
// sneering and the small smile only supplies the lift, so it never reads as a
// plain frown. Akimbo is the choice that survives the dot lattice — it opens two
// clear triangles of paper between the arms and the body, where a folded cross
// of arms collapses into two horizontal bars laid over the bodice.
P("mth_contempt", {
  weightShift:.42, pelvisX:.14, pelvisRot:.06,
  hipL:.09, kneeL:.02, hipR:-.05, kneeR:.17, footRotR:.06,   // cocked stance, one knee slack
  spineLean:.05, chestLift:.16, shoulderTilt:.07,
  bodyYaw:-.30, headYaw:.05, headRoll:-.13, headPitch:-.19,  // chin up, head tipped
  gazeX:-.32, gazeY:.44,                                     // looking DOWN at him
  // THE SNEER, and every value here is a lesson from the plate: eyeNarrow above
  // ~.15 closes the almond until the white and the pupil both vanish and the eye
  // prints as a second brow — a blank dour mask, not scorn. So the eyes stay OPEN
  // and the gaze does the looking-down; the contempt is carried by knit brows, a
  // lifted chin, and a mouth cracked open and dragged hard to one side (a closed
  // mouth at this dot pitch is always a placid flat line).
  browUp:.02, browKnit:.42, eyeNarrow:.12, smile:.28, frown:.06, mouthAsym:.90, jaw:.34,
  // both elbows swung OUT and the forearms folded back down onto the waist —
  // the hands land just above the girdle and well clear of the skirt edge
  armLUpper:.46, armLLower:-1.26, handRotL:-.16, shoulderLiftL:.14,    // near fist on the waist
  armRUpper:-.46, armRLower:1.26, handRotR:.16, shoulderLiftR:.10,     // far hand on the waist
  rootScale:1.00,
}, ["fist","fist"]);

// JEER — driving the beggar out of the hall: leaned in off the cross, jaw dropped
// on the insult, brows slammed down, eyes pinched, the near arm thrust out and
// DOWN to point him at the door while the far hand stays parked on the hip. A
// level arm runs past the card edge; the downward jab is the truer read anyway.
P("mth_jeer", {
  bodyYaw:-.40, headYaw:-.20, headPitch:-.11, spineLean:-.17, chestOpen:.28,
  gazeX:-.48, gazeY:.30,
  browKnit:.56, browUp:.12, eyeNarrow:.14, jaw:.52, mouthAsym:.52, smile:.16,
  armLUpper:1.04, armLLower:-.32, handRotL:-.14, shoulderLiftL:.22,   // near arm jabbing down
  armRUpper:-.44, armRLower:1.04, handRotR:.16,                       // far hand on the hip
  weightShift:.38, pelvisX:.16, hipL:.12, kneeR:.10,
  rootScale:1.03,
}, ["point","fist"]);

// INTIMACY — the other face, turned on the men at the table: body swung toward
// them, head tipped and dropped while the eyes lift, a warm open smile, the near
// hand raised palm-up toward a suitor's arm. Same girl, inverted. This is what
// the sneer is bought with.
P("mth_intimacy", {
  bodyYaw:.34, headYaw:.28, headRoll:.17, headPitch:.15,
  gazeX:.34, gazeY:-.34,                                     // eyes up, chin down: the up-glance
  browUp:.42, browKnit:.04, smile:.62, cheek:.46, eyeNarrow:.08, jaw:.16, mouthAsym:.22,
  spineLean:-.14, chestOpen:.24, shoulderLiftR:.30,
  armRUpper:-.80, armRLower:.70, handRotR:.16,               // near hand offered across to him
  armLUpper:.22, armLLower:-.40,                             // far arm easy at her side
  weightShift:-.28, pelvisX:-.12, hipR:-.10, kneeL:.12,
  rootScale:1.02,
}, ["relaxed","offering"]);

// LAUGH — shared derision at the table: head thrown back and rolled, jaw wide,
// eyes crinkled shut, shoulders up around her ears, the near hand flown up
// toward her mouth. The loudest thing in the room and none of it her business.
P("mth_laugh", {
  bodyYaw:.24, headYaw:.16, headRoll:.15, headPitch:-.28, gazeY:-.08,
  smile:1, jaw:.68, eyeNarrow:.70, cheek:.60, browUp:.30,
  spineLean:.16, shoulderLiftL:.42, shoulderLiftR:.46,
  armRUpper:.40, armRLower:1.70, handRotR:-.20,              // near hand up to the mouth
  armLUpper:-.28, armLLower:-.64,                            // far arm hugged in
  weightShift:-.18, rootScale:1.01,
}, ["relaxed","open_palm"]);

// TORCH — the duty she was actually given: a pine brand held high over the
// braziers to keep the hall lit. Authored as a static stance so the raised arm
// survives (a walk action mod would overwrite both arms), and cocked STEEPLY
// overhead — a forty-five degree raise puts the hand through the card edge.
// The sneer is already on her: she is lighting the room she is about to insult.
P("mth_torch", {
  bodyYaw:-.28, headYaw:-.16, headPitch:-.06, gazeX:-.34, gazeY:.20,
  browKnit:.24, eyeNarrow:.12, smile:.16, mouthAsym:.36, jaw:.08,
  armLUpper:2.54, armLLower:-.08, shoulderLiftL:.46, handRotL:-.18,   // near arm, brand aloft
  armRUpper:-.58, armRLower:.44, handRotR:.12,                        // far arm low, steadying
  weightShift:.30, pelvisX:.12, hipL:.08, kneeR:.12,
  rootScale:1.01,
}, ["fist","relaxed"]);

// DISMISS — the flounce: body turned away toward the inner door, mid-step, with
// the face swung back over the shoulder for one last narrowed look. The rig
// resolves this to a profile head on a near-back body, which is exactly the
// half-leaving posture. Her exit from every scene she is in.
P("mth_dismiss", {
  bodyYaw:2.50, headYaw:-1.40, headRoll:-.08, headPitch:-.10,
  gazeX:-.50, gazeY:.22,
  browKnit:.32, eyeNarrow:.14, mouthAsym:.50, smile:.12, frown:.10,
  hipL:.30, kneeL:.06, hipR:-.22, kneeR:.26, ankleR:.08,     // mid-step away
  weightShift:.24, pelvisRot:-.06, spineLean:.04,
  armLUpper:.30, armLLower:-.30, armRUpper:-.20, armRLower:.26,
  rootScale:.99,
}, ["relaxed","relaxed"]);

// IDLE — unhelpful rest: three-quarter turn, one hand on the hip, the other
// loose, eyes already narrowed sideways and the mouth already skewed. Watchful,
// available to the wrong people.
P("mth_idle", {
  bodyYaw:-.46, headYaw:-.18, gazeX:-.28, gazeY:.10,
  weightShift:.46, pelvisX:.20, hipL:.12, kneeR:.14,
  browKnit:.20, eyeNarrow:.12, smile:.12, mouthAsym:.36,
  armLUpper:.36, armLLower:-1.22, handRotL:-.20, shoulderLiftL:.12,  // near fist on the hip
  armRUpper:-.24, armRLower:.22, handRotR:.08,
}, ["fist","relaxed"]);

const params = {
  // YOUNG and well-kept — that is the offence. Bright unshadowed skin and a
  // pale gift-gown keep her near paper, so the only heavy ink on her is the
  // black contour and the bound black hair: the tonal ladder runs
  // contour / hair -> mid bodice -> light skirt -> near-paper skin and arms.
  // Set against Melanthius' dark curls, beard and coarse rags, she is his
  // polished twin — the same treason wearing better cloth.
  skin:"#ece0c8", hairColor:"#211d19",
  hair:"short", beard:false, glasses:false,
  garment:"dress", cloak:false, bareLegs:false, scale:0.95,
};

const fig = makeFigure(params);

/* Gown skirt — a light bell of fine cloth from a high girdle to the ankles,
   drawn OVER the rig's legs. Unlike a fixed bell this one is anchored to the
   rig's OWN reported hip point, so when a pose throws her weight onto one hip
   the skirt goes with it instead of leaving the torso standing beside its own
   clothes. Kept LIGHT (near paper) with only the girdle and the hem band dark,
   so she never prints as one mass; the pleats are broken, not full spans. */
function drawGown(ctx, W, H, hip){
  const cx = (hip && Number.isFinite(hip.x) ? hip.x : 0.5) * W;
  const hy = (hip && Number.isFinite(hip.y) ? hip.y : 0.63) * H;
  const waistY = Math.min(Math.max(hy - H*0.030, H*0.50), H*0.68);
  const hemY = H*0.902;
  const wTop = W*0.082, wHem = W*0.146;

  ctx.fillStyle = gray(0xcc); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop, waistY);
  ctx.quadraticCurveTo(cx - wHem*0.84, H*0.79, cx - wHem, hemY);
  ctx.quadraticCurveTo(cx, hemY + H*0.022, cx + wHem, hemY);
  ctx.quadraticCurveTo(cx + wHem*0.84, H*0.79, cx + wTop, waistY);
  ctx.quadraticCurveTo(cx, waistY + H*0.010, cx - wTop, waistY);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // pleats — three long clean falls that follow the flare, each stopping short
  // of the hem so no line runs the full height of the cloth
  ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  const pleats = [[-0.72, 0.10, 0.80], [0.10, 0.18, 0.90], [0.78, 0.08, 0.74]];
  for (const [tx, a, b] of pleats){
    const span = hemY - waistY;
    const px = u => cx + tx*(wTop + (wHem - wTop)*u);
    ctx.beginPath();
    ctx.moveTo(px(a), waistY + span*a);
    ctx.quadraticCurveTo(px((a + b)*0.5), waistY + span*(a + b)*0.5, px(b), waistY + span*b);
    ctx.stroke();
  }

  // hem band — a darker strip of woven border, broken at the centre fold so it
  // does not read as a bar ruled across the plate
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.moveTo(cx - wHem*0.97, hemY - H*0.008);
  ctx.quadraticCurveTo(cx - wHem*0.45, hemY + H*0.011, cx - wHem*0.10, hemY + H*0.014);
  ctx.moveTo(cx + wHem*0.10, hemY + H*0.014);
  ctx.quadraticCurveTo(cx + wHem*0.45, hemY + H*0.011, cx + wHem*0.97, hemY - H*0.008);
  ctx.stroke();

  // the GIRDLE — a high dark band with a small knot: the one gift she wears
  // where everyone can see it
  ctx.fillStyle = gray(0x76); ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - wTop*0.90, waistY - H*0.002);
  ctx.quadraticCurveTo(cx, waistY + H*0.014, cx + wTop*0.90, waistY - H*0.002);
  ctx.lineTo(cx + wTop*0.90, waistY + H*0.014);
  ctx.quadraticCurveTo(cx, waistY + H*0.030, cx - wTop*0.90, waistY + H*0.014);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + W*0.020, waistY + H*0.022);
  ctx.lineTo(cx + W*0.028, waistY + H*0.062);
  ctx.stroke();
}

/* Bound hair — a coiled knot pinned at the back of the crown with a ribbon band
   across it, and one loose strand escaped down the near side. Deliberately
   BOUND and small: Nausicaa wears a girl's loose fall and Penelope a veiled
   dome, so Melantho's glossy pinned coil is her silhouette signature and it
   keeps the black mass at her head small instead of drowning the plate.
   Drawn AFTER the figure off the rig's own head + crown anchors so it tracks
   the pose. */
function drawHairKnot(ctx, W, H, head, crown){
  const cx = head.x*W, cy = head.y*H;
  let R = (head.y - crown.y)*H;
  if (!(R > 8)) R = W*0.10;

  // the coil, sitting high and slightly to one side of the crown
  ctx.fillStyle = gray(0x2a); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.ellipse(cx + R*0.36, cy - R*1.10, R*0.38, R*0.29, -0.42, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  // a second smaller loop so it reads as coiled rope of hair, not a ball
  ctx.beginPath();
  ctx.ellipse(cx + R*0.62, cy - R*0.92, R*0.24, R*0.18, -0.30, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  // coil creases
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  for (const s of [-1, 0, 1]){
    ctx.beginPath();
    ctx.moveTo(cx + R*(0.36 + s*0.18), cy - R*1.30);
    ctx.quadraticCurveTo(cx + R*(0.44 + s*0.16), cy - R*1.08, cx + R*(0.32 + s*0.18), cy - R*0.90);
    ctx.stroke();
  }

  // ribbon band tied round the head, sitting ON the hairline — high on the crown
  // it is swallowed by the hair mass and prints as nothing; down here it cuts a
  // light seam between the crown hair and the coil, which is the whole point of
  // a bound head
  ctx.fillStyle = gray(0xc6); ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - R*1.00, cy - R*0.54);
  ctx.quadraticCurveTo(cx, cy - R*0.94, cx + R*1.00, cy - R*0.54);
  ctx.quadraticCurveTo(cx + R*0.96, cy - R*0.38, cx + R*0.92, cy - R*0.34);
  ctx.quadraticCurveTo(cx, cy - R*0.72, cx - R*0.92, cy - R*0.34);
  ctx.quadraticCurveTo(cx - R*0.96, cy - R*0.38, cx - R*1.00, cy - R*0.54);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // one escaped strand down the near side of the face
  ctx.strokeStyle = INK; ctx.lineWidth = 3.4; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - R*0.92, cy - R*0.52);
  ctx.quadraticCurveTo(cx - R*1.16, cy + R*0.34, cx - R*0.92, cy + R*1.02);
  ctx.stroke();
}

export const asset = {
  id:"character.melantho",
  type:"CHARACTER",
  name:"Melantho",
  statusWord:"SCORNFUL",
  scene:"OD-B18-S05",

  params,
  // separate costume layers, back -> front, honored by the rig's composite order
  layers:["shadow","hair-back","legs","bodice","far-arm","neck","head","face",
          "near-arm","gown","girdle","hair-knot"],
  // normalized 0..1 anchors for scene attachment / gaze / prop grips
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.21},
    hairKnot:{x:.55,y:.12},
    // measured off the plate, not guessed: the akimbo fists land wide at the
    // waist and the raised brand-arm carries well out to the near side
    leftHand:{x:.40,y:.57}, rightHand:{x:.68,y:.56},   // fists planted at the waist
    torchGrip:{x:.19,y:.20},                           // pine brand aloft over the braziers
    hip:{x:.50,y:.60}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"contempt",
    nodes:{
      // SIGNATURE — arms crossed, hip cocked, chin up, eyes down at the beggar
      contempt: { preview:{ pose:"mth_contempt", gaze:{x:-.32,y:.44}, status:"SCORNFUL" } },
      // the duty she was actually set: keeping the hall's braziers alight
      tending:  { preview:{ pose:"mth_torch",    gaze:{x:-.34,y:.20}, status:"TENDING" } },
      // jeering the beggar toward the door
      jeering:  { preview:{ pose:"mth_jeer",     gaze:{x:-.48,y:.30}, status:"JEERING" } },
      // the other face — warmth turned on the men at the table
      intimate: { preview:{ pose:"mth_intimacy", gaze:{x:.34,y:-.34}, status:"FAVOURED" } },
      // laughing with them at the man on the floor
      laughing: { preview:{ pose:"mth_laugh",    gaze:{x:.10,y:-.08}, status:"LAUGHING" } },
      // the flounce out, one look back over the shoulder
      dismissing:{preview:{ pose:"mth_dismiss",  gaze:{x:-.50,y:.22}, status:"LEAVING" } },
      // unhelpful rest
      idle:     { preview:{ pose:"mth_idle",     gaze:{x:-.28,y:.10}, status:"WAITING" } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left" } },
      back:     { preview:{ pose:"back_view" } },
    },
    edges:[
      ["idle","tending"],["tending","contempt"],["contempt","jeering"],
      ["jeering","laughing"],["laughing","intimate"],["intimate","contempt"],
      ["contempt","intimate"],["jeering","dismissing"],["dismissing","idle"],
      ["laughing","dismissing"],["idle","profile"],["idle","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw",
            "mouthAsym","mouthPucker","cheek"],

  // CARD SIGNATURE — SCORNFUL. No `mouth` field: the sneer lives in mouthAsym,
  // which the scene's mouth overlay cannot reach, so the smirk survives any
  // state pass laid over her.
  preview:()=>({ pose:"mth_contempt", gaze:{x:-.32,y:.44},
                 browKnit:.42, eyeNarrow:.12, smile:.28, frown:.06, mouthAsym:.90, jaw:.34,
                 t:0.5, status:"SCORNFUL", progress:.22 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // pass the whole state through: pose, gaze, blink, face channels, t all reach the rig
    const r = fig.draw(ctx, W, H, st);
    const a = (r && r.anchors) || {};
    drawGown(ctx, W, H, a.hip || { x:0.5, y:0.63 });
    drawHairKnot(ctx, W, H, a.head || { x:0.5, y:0.20 }, a.crown || { x:0.5, y:0.13 });
    return r;
  },
};
export default asset;
