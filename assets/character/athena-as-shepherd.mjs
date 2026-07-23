/* character.athena-as-shepherd — Athena's Book 13 disguise on the Ithacan shore.
   A DISGUISE variant of character.athena: the goddess folds herself into the
   body of a DELICATE YOUNG HERDSMAN — a slight, youthful, clean-shaven local
   in a short tunic with a cloak thrown back, a SHEPHERD'S CROOK in the near
   hand, standing easy on the beach where the sleeping Odysseus has just been
   set down. She meets his instant reflexive lie — the stranger inventing a
   Cretan past on the spot — not with anger but with delight: she is AMUSED by
   the reflex, leaning on the crook with a knowing sidelong half-smile before
   she drops the disguise and laughs. The mortal shell is a herd-boy, but the
   same tell that leaks through every Athena disguise leaks through here: the
   eyes stay unnaturally BRIGHT, a divine glint too knowing for a shepherd.
   That bright-eye cue is the continuity thread back to character.athena.

   Scene function:
     OD-B13-S02 — young local figure amused by the hero's reflexive deception

   Built on the engine hero rig: a slight youthful scale, a short tunic + cloak
   over bare legs, and a shepherd's crook carried in the NEAR (viewer-left) hand
   across every beat while the FAR (right) arm does the acting — an amused
   palm-up shrug, a quiet laugh, a light word, a relaxed lean. The crook is
   drawn around the figure so it reads crisp, and the divine bright-eye
   catchlight is painted last. All solid grays + hard contour — the engine's
   dotify POST pass supplies the halftone, so nothing is pre-dithered. */
import { makeFigure, INK, gray } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

// HERDSMAN shell: a slight, delicate youth. Clean-shaven and short-haired to
// read YOUNG and quick, fresh warm skin, a short tunic with a herder's cloak
// thrown back off the free (calling) arm, bare young legs and sandals.
const params = {
  skin:"#e8d3b4", hairColor:"#3a2c1c",
  hair:"short", beard:false, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:0.86,   // slight youthful frame
};

const fig = makeFigure(params);

/* ---- custom poses ----
   Every beat keeps the NEAR (left, viewer-left) arm dropped at the side so the
   hand closes on the crook shaft planted there; the FAR (right) arm carries the
   whole performance. The rig reads brow/jaw/eye channels only from the pose
   def, so each expression needs its own authored pose. POSES is a shared module
   singleton — registering here makes these ids resolvable by composeStatic. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"shepherd", n, opt:hands?{hands}:{} }; }

// crook arm preset — near (left) upper arm dropped nearly straight down, forearm
// tucked slightly in so the hand closes on the crook shaft at the side.
const CROOK = { armLUpper:.15, armLLower:-.12, handRotL:.10, shoulderLiftL:.06 };

// SIGNATURE — AMUSED (OD-B13-S02): weight cocked onto the crook, the young
// herdsman leaning easy, head tilted, a KNOWING half-smile skewed to one side,
// one brow lifted while the other knits a touch, eyes narrowed in amusement,
// gaze slid sidelong to the lying stranger, the free hand turned palm-up in a
// small "go on, then" shrug. Delighted by the reflexive deception, not fooled.
P("shepherd_amused", {
  ...CROOK,
  weightShift:.5, pelvisX:.22, hipL:.16, hipR:-.05, shoulderTilt:.05,
  browUp:.36, browKnit:.12, eyeNarrow:.34, smile:.42, mouthAsym:.6, cheek:.32, jaw:.06,
  headYaw:.14, headRoll:.13, gazeX:.42, spineLean:.04,
  armRUpper:-.86, armRLower:.66, handRotR:.16, shoulderLiftR:.1,   // free hand palm-up shrug
}, ["relaxed","palm_up"]);

// LAUGHING (OD-B13-S02): the amusement breaks open — the disguise about to drop,
// a broad grin, jaw parting on a quiet laugh, eyes crinkled nearly shut, cheeks
// up, shoulders lifting, the free arm loose and easy. The goddess enjoying the
// craft of the man she made.
P("shepherd_laughing", {
  ...CROOK,
  smile:.75, jaw:.3, eyeNarrow:.62, cheek:.52, browUp:.24,
  headYaw:.1, headRoll:.08, gazeX:.28, spineLean:.03,
  shoulderLiftR:.26, armRUpper:-.5, armRLower:.5,                  // free arm loose
}, ["relaxed","relaxed"]);

// A LIGHT WORD (OD-B13-S02): the herd-boy addressing the stranger — chin up, an
// offering hand held level, jaw open on a word, brows up, a bright open face
// still glinting with private amusement. Drawing the lie out of him.
P("shepherd_speaking", {
  ...CROOK,
  browUp:.3, browKnit:.04, smile:.24, mouthAsym:.2, eyeWide:.1, jaw:.42,
  headYaw:.12, headPitch:-.05, headRoll:.03, gazeX:.26, spineLean:-.04, chestOpen:.28,
  armRUpper:-1.02, armRLower:.58, handRotR:.12, shoulderLiftR:.06,  // offering the word forward
}, ["relaxed","offering"]);

// RELAXED LEAN (OD-B13-S02): weight fully cocked onto the crook, hip slung out,
// the young shepherd standing utterly at ease on his own shore, a faint private
// smile, gaze level and easy, the free arm resting light. Unbothered ownership
// of the place — she is home ground and he is not.
P("shepherd_leaning", {
  ...CROOK,
  weightShift:.72, pelvisX:.3, hipL:.22, hipR:-.07, shoulderTilt:.07,
  browUp:.14, smile:.2, eyeNarrow:.16, mouthAsym:.24,
  headYaw:.08, headRoll:.07, gazeX:.2, spineLean:.02,
  armRUpper:-.2, armRLower:.3,                                     // free arm easy at side
}, ["relaxed","relaxed"]);

// composed baseline — upright and easy with the crook planted, a faint ready
// half-smile, the free arm resting light, poised between amusement and the reveal.
P("shepherd_poise", {
  ...CROOK,
  browUp:.14, smile:.14, eyeNarrow:.08, mouthAsym:.16,
  headYaw:.03, headRoll:.03, spineLean:-.01, chestOpen:.14,
  armRUpper:-.18, armRLower:.28,                                   // free arm easy at side
}, ["relaxed","relaxed"]);

/* The shepherd's crook — a tall slender wooden staff planted on the near
   (viewer-left) side under the left hand, its top curling into an open HOOK: a
   candy-cane curl that reads unmistakably as a herder's crook, not a spear or a
   herald's knob. Drawn BEFORE the figure so the near left hand closes over the
   shaft in front of it. Solid grays; the dotify POST pass supplies the grain. */
function drawCrook(ctx, W, H){
  const x = W*0.360;                    // aligns under the dropped near (left) hand
  const shaftTopY = H*0.190, buttY = H*0.940;
  // shaft + hook as one continuous stroked path — ink casing, then wood core.
  const hook = (g) => {
    g.moveTo(x, buttY);
    g.lineTo(x, shaftTopY);                                        // straight shaft
    g.quadraticCurveTo(x, H*0.128, x - W*0.048, H*0.120);         // up and over to the left
    g.quadraticCurveTo(x - W*0.098, H*0.113, x - W*0.093, H*0.166); // curl down the outside
    g.quadraticCurveTo(x - W*0.089, H*0.205, x - W*0.052, H*0.200); // hook tip curling back in
  };
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = INK; ctx.lineWidth = 11;
  ctx.beginPath(); hook(ctx); ctx.stroke();
  ctx.strokeStyle = gray(0x8c); ctx.lineWidth = 6;
  ctx.beginPath(); hook(ctx); ctx.stroke();
  // a small worn nub at the very tip of the hook
  ctx.fillStyle = gray(0x9c); ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(x - W*0.052, H*0.200, W*0.016, H*0.014, 0, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  // two binding rings at the grip where the hand closes
  ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
  for (const gy of [H*0.585, H*0.625]){
    ctx.beginPath(); ctx.moveTo(x - W*0.015, gy); ctx.lineTo(x + W*0.015, gy); ctx.stroke();
  }
}

/* The divine tell — a small over-bright catchlight in each eye, painted last so
   the goddess shows through the herd-boy shell. Uses the rig's reported head
   anchor so it tracks pose/band (mirrors athena-as-herald's bright-eye cue). */
function drawBrightEyes(ctx, W, H, anchors, state){
  if (!anchors || !anchors.head) return;
  const hx = anchors.head.x * W, hy = anchors.head.y * H;
  const R = Math.min(H*0.9, W*1.26) * (params.scale||1) * 0.105;   // mirrors rig headR
  const eyeY = hy - R*0.10;
  const dx = R*0.34;
  const gz = state && state.gaze ? state.gaze : {x:0,y:0};
  const profile = /profile/.test((state && (state.pose||state.band)) || "");
  const eyes = profile ? [1] : [-1,1];
  for (const es of eyes){
    const ex = hx + es*dx;
    ctx.fillStyle = "#fcfcf8";
    ctx.beginPath();
    ctx.arc(ex - R*0.05 + gz.x*R*0.06, eyeY - R*0.05 + gz.y*R*0.05, R*0.062, 0, 7);
    ctx.fill();
  }
}

export const asset = {
  id:"character.athena-as-shepherd",
  type:"CHARACTER",
  name:"Athena as shepherd",
  statusWord:"AMUSED",
  scene:"OD-B13-S02",

  params,
  layers:["shadow","crook","hair-back","legs","torso","far-arm","cloak","neck","head","face","hair-front","near-arm","bright-eyes"],
  // normalized 0..1 anchors for scene attachment / gaze / staging
  anchors:{
    head:{x:.50,y:.22}, crown:{x:.50,y:.15}, eyes:{x:.50,y:.23},
    crookHook:{x:.31,y:.13}, crookGrip:{x:.360,y:.605},
    rightHand:{x:.70,y:.52}, leftHand:{x:.34,y:.61},
    hip:{x:.50,y:.65}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // composed baseline — upright, easy, crook planted, faint ready half-smile
      neutral:   { preview:{ pose:"shepherd_poise", gaze:{x:.04,y:0}, t:0.5 } },
      // OD-B13-S02 SIGNATURE — amused: leaning on the crook, knowing sidelong smirk
      amused:    { preview:{ pose:"shepherd_amused", gaze:{x:.42,y:.02}, t:0.5 } },
      // OD-B13-S02 — laughing: the amusement breaks open, disguise about to drop
      laughing:  { preview:{ pose:"shepherd_laughing", gaze:{x:.28,y:.0}, t:0.5 } },
      // OD-B13-S02 — a light word: chin up, offering hand, drawing the lie out
      speaking:  { preview:{ pose:"shepherd_speaking", gaze:{x:.26,y:-.04}, t:0.5 } },
      // OD-B13-S02 — relaxed lean: weight cocked on the crook, wholly at ease
      leaning:   { preview:{ pose:"shepherd_leaning", gaze:{x:.2,y:.02}, t:0.5 } },
    },
    edges:[["neutral","amused"],["amused","laughing"],["laughing","speaking"],
           ["speaking","leaning"],["leaning","amused"],["amused","neutral"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — AMUSED: the disguised goddess enjoying the lie. The
  // shepherd's crook carried in the near hand, weight cocked onto it, head
  // tilted, a knowing half-smile skewed to one side with one brow up and eyes
  // narrowed, gaze slid sidelong to the stranger, the free hand turned palm-up
  // in a small "go on, then" shrug — and the divine bright-eye tell glinting
  // through the herd-boy shell.
  preview:()=>({ pose:"shepherd_amused", gaze:{x:.42,y:.02},
                 browUp:.36, browKnit:.12, eyeNarrow:.34, smile:.42, mouthAsym:.6, cheek:.32,
                 t:0.5, status:"AMUSED", progress:.22 }),

  draw(ctx, W, H, state){
    const st = state || {};
    if (st.band) fig.spec.band = st.band; else fig.spec.band = "front";
    // crook planted behind the near hand so the grip reads
    drawCrook(ctx, W, H);
    const r = fig.draw(ctx, W, H, st) || {};
    // the divine bright-eye tell, painted last so it survives the shell
    drawBrightEyes(ctx, W, H, r.anchors, st);
    return r;
  },
};
export default asset;
