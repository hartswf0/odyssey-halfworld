/* character.odysseus-as-beggar — the SAME aged disguise as
   character.odysseus-as-old-beggar (Athena's withering), now performing the
   Book-14 arrival at Eumaeus' steading. This is Odysseus the veteran fighter
   playing the harmless mendicant: he meets the swineherd's dogs not with the
   staff but with instant, deliberate submission — sitting down and letting the
   staff fall from his hand — then endures dismissal, and finally works the room
   the only way a beggar can, by spinning a wartime tale and folding his need
   into it. IDENTICAL surface to odysseus-as-old-beggar (same params, same
   staff + bag) so the continuity holds across the disguise; only the carriage
   and face change per performance.

   Atlas performances:
     OD-B14-S01 — experienced fighter performing immediate submission to the dogs
     OD-B14-S02 — testing loyalty while enduring dismissal
     OD-B14-S03 — improvisational storyteller modulating detail and truths
     OD-B14-S04 — indirect requester embedding need inside a wartime anecdote */
import { makeFigure, HERO_POSES } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke Book-14 beggar poses: register additively onto the shared rig.
   The library carries no "old fighter dropping to placate the dogs" or
   "beggar working a story", so we author them. Every pose keeps the withered
   silhouette (low rootScale, hauled-up shoulders, soft knees) so the man reads
   as the same decrepit mendicant regardless of what he is performing. ---- */

// SUBMISSION — OD-B14-S01. The veteran's answer to the charging dogs is not to
// swing the staff but to DROP: he sinks straight down onto his haunches, deep
// crouch, the staff released, BOTH hands spreading low and open, palms turned
// out and down in the universal placating "I am nothing, I am harmless". Head
// bowed under the shoulders — but the eyes climb up, narrowed and reading the
// pack. An experienced fighter performing surrender with total, deliberate calm.
HERO_POSES.beggar_submit = { id:"beggar_submit", label:"beggar submission", group:"emotion",
  n:{ spineLean:-.3, crouch:.62, kneeL:.72, kneeR:.66, hipL:-.34, hipR:.34, rootY:.04,
      headPitch:.42, neckPitch:.24, headY:.13, headRoll:.03,
      shoulderLiftL:.32, shoulderLiftR:.36,
      armLUpper:.72, armLLower:-.5, handRotL:-.34,     // left hand dropped low, palm out — placate
      armRUpper:-.72, armRLower:.5, handRotR:.34,       // right hand dropped low, palm out — placate
      browKnit:.3, browUp:.3, eyeNarrow:.18, frown:.06, rootScale:.85 },
  opt:{ hands:["open_palm","open_palm"] } };

// ENDURING DISMISSAL — OD-B14-S02. Held stooped and patient while he is waved
// off or spoken past: head kept low as cover, the free hand drawn in and still,
// weight leaned into the staff. The face is the tell — brows lifted AND knit in
// a humble, wary supplication, lids pinched, a faint downturned mouth. He takes
// the slight without a flicker while cataloguing exactly how loyal this man is.
HERO_POSES.beggar_endure = { id:"beggar_endure", label:"enduring dismissal", group:"emotion",
  n:{ spineLean:-.24, crouch:.3, kneeL:.34, kneeR:.3, hipL:-.08, hipR:.06,
      headPitch:.44, neckPitch:.26, headY:.15, headRoll:.05,
      shoulderLiftL:.6, shoulderLiftR:.66,
      armLUpper:.24, armLLower:-.4, handRotL:-.15,      // still on the staff
      armRUpper:-.42, armRLower:1.02, handRotR:.2,       // free hand drawn in, patient
      browUp:.4, browKnit:.36, eyeNarrow:.36, frown:.18, rootScale:.85 },
  opt:{ hands:["relaxed","relaxed"] } };

// STORYTELLER — OD-B14-S03. The improviser at work: the spine lifts a little,
// the crouch eases, the chest opens, and the free right hand rises off the staff
// to shape the air — laying out a scene, sizing a claim, spending detail he can
// afford and skirting the ones he can't. Jaw parted on speech, brows up and
// lively, eyes a touch wide, gaze cast out to the listener he is reeling in.
HERO_POSES.beggar_storyteller = { id:"beggar_storyteller", label:"beggar storyteller", group:"emotion",
  n:{ spineLean:-.14, crouch:.14, kneeL:.2, kneeR:.16, hipL:-.05, hipR:.05,
      headPitch:.12, headY:.04, headYaw:.12, neckYaw:.08,
      shoulderLiftL:.3, shoulderLiftR:.26, chestOpen:.32,
      armLUpper:.26, armLLower:-.42, handRotL:-.15,     // left keeps the staff
      armRUpper:-1.04, armRLower:.5, handRotR:.2,         // right up, open, shaping the tale
      browUp:.42, browKnit:.14, eyeWide:.14, jaw:.34, rootScale:.9 },
  opt:{ hands:["relaxed","open_palm"] } };

// EMBEDDED REQUEST — OD-B14-S04. Still telling the war story, but the free hand
// has slipped low and cupped — the ask folded inside the anecdote. Brows lifted
// high in a wistful, needful cast, mouth pulled a little asymmetric, gaze slid
// aside as if remembering — the practised craft of asking without asking.
HERO_POSES.beggar_anecdote = { id:"beggar_anecdote", label:"embedded request", group:"emotion",
  n:{ spineLean:-.18, crouch:.2, kneeL:.24, kneeR:.2, hipL:-.06, hipR:.06,
      headPitch:.2, headY:.06, headYaw:-.12, neckYaw:-.08,
      shoulderLiftL:.42, shoulderLiftR:.46,
      armLUpper:.26, armLLower:-.4, handRotL:-.15,      // staff
      armRUpper:-.92, armRLower:.66, handRotR:.2,         // right hand cupped low — the embedded ask
      browUp:.52, browKnit:.2, eyeNarrow:.2, frown:.1, mouthAsym:.3, jaw:.2, rootScale:.88 },
  opt:{ hands:["relaxed","offering"] } };

/* IDENTICAL disguise params to character.odysseus-as-old-beggar — same ashen
   greyed skin, same wispy grey hair, same straggled grey beard, same rags, same
   shrunken scale — so the two modules render as the exact same man. */
const params = {
  skin:"#c4bba9", hairColor:"#a9a49b",
  hair:"short", beard:true, glasses:false,
  garment:"rags", cloak:false, bareLegs:true, scale:0.9,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.odysseus-as-beggar",
  type:"CHARACTER",
  name:"Odysseus as beggar",
  statusWord:"HUMBLE",
  scene:"OD-B14-S01",

  params,
  layers:["shadow","staff","hair-back","legs","torso","far-arm","neck","head","face","hair-front","beard","near-arm","beggar-bag"],
  // normalized 0..1 anchors — stooped, with staff + bag grips (same scheme as old-beggar)
  anchors:{
    head:{x:.49,y:.27}, crown:{x:.49,y:.19}, eyes:{x:.49,y:.28},
    rightHand:{x:.66,y:.66}, leftHand:{x:.38,y:.60},
    staffGrip:{x:.35,y:.46}, staffFoot:{x:.33,y:.95},
    begBowl:{x:.68,y:.68}, bagKnot:{x:.62,y:.58}, hip:{x:.50,y:.70}, feet:{x:.50,y:.95},
  },
  states:{
    initial:"submitting",
    nodes:{
      // SIGNATURE — OD-B14-S01: dropped to placate the dogs, staff released,
      // both palms spread low, head bowed but the eyes climbing up to read the pack.
      submitting:{ preview:{ pose:"beggar_submit", browKnit:.3, browUp:.3,
                             eyeNarrow:.18, frown:.06, gaze:{x:.1,y:-.42}, jaw:.03, t:0.5 } },
      // OD-B14-S02 — held stooped, enduring the slight, wary humble face.
      enduring:  { preview:{ pose:"beggar_endure", browUp:.4, browKnit:.36,
                             eyeNarrow:.36, frown:.18, gaze:{x:-.2,y:-.3}, jaw:.04, t:0.46 } },
      // OD-B14-S03 — the improviser: chest open, free hand shaping the tale,
      // jaw parted on speech, brows lively.
      storytelling:{ preview:{ pose:"beggar_storyteller", browUp:.42, browKnit:.14,
                               eyeWide:.14, jaw:.36, gaze:{x:.34,y:-.04}, t:0.5 } },
      // OD-B14-S04 — the ask folded into the anecdote: hand cupped low, brows
      // lifted needful, gaze slid aside remembering.
      requesting:{ preview:{ pose:"beggar_anecdote", browUp:.52, browKnit:.2,
                             eyeNarrow:.2, frown:.1, mouthAsym:.3, jaw:.2,
                             gaze:{x:-.3,y:.12}, t:0.44 } },
    },
    edges:[["submitting","enduring"],["enduring","submitting"],
           ["enduring","storytelling"],["storytelling","requesting"],
           ["requesting","storytelling"],["storytelling","enduring"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — HUMBLE: the veteran fighter folded low in instant surrender,
  // staff dropped, both hands spread open and placating, head bowed — and the
  // tell that never leaves the disguise, the narrowed eyes lifted out of the
  // bowed head, reading the room from inside the harmless mask.
  preview:()=>({ pose:"beggar_submit", browKnit:.3, browUp:.3, eyeNarrow:.18,
                 frown:.06, gaze:{x:.1,y:-.42}, jaw:.03, t:0.5,
                 status:"HUMBLE", progress:.2 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;

    // ---- STAFF (behind the body): the same worn beggar's staff as
    // odysseus-as-old-beggar, planted at his left side. In the submission
    // performance his hands leave it (he has "dropped" it) but it still rests
    // beside him; in the other stances his left hand grips it. Drawn first so the
    // figure overlaps it. Solid grays + hard contour -> engine halftones it. ----
    const gx = 0.35 * W;
    const topY = H * 0.47;                    // knob at the gripping hand — a crutch, not a spear
    const footY = H * 0.94;                   // plants near the ground line
    const lean = W * 0.02;                    // slight lean, foot tucked inward
    ctx.save();
    ctx.lineCap="round"; ctx.lineJoin="round";
    // contour underlay
    ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.034;
    ctx.beginPath(); ctx.moveTo(gx, topY); ctx.lineTo(gx+lean, footY); ctx.stroke();
    // weathered wood fill (mid grey)
    ctx.strokeStyle="#6a6862"; ctx.lineWidth=W*0.02;
    ctx.beginPath(); ctx.moveTo(gx, topY); ctx.lineTo(gx+lean, footY); ctx.stroke();
    // a couple of knots down the shaft
    ctx.fillStyle="#4d4b46"; ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.008;
    for (const f of [0.34, 0.66]){
      const ky = topY + (footY-topY)*f, kx = gx + lean*f;
      ctx.beginPath(); ctx.ellipse(kx, ky, W*0.02, W*0.03, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
    // worn knob head of the staff
    ctx.fillStyle="#6a6862"; ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.01;
    ctx.beginPath(); ctx.arc(gx, topY, W*0.028, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.restore();

    // ---- the aged figure (draws over the staff shaft) ----
    const out = fig.draw(ctx, W, H, state);

    // ---- BEGGAR'S BAG: the same battered sack slung over the stooped shoulder,
    // hanging at the near hip. Drawn last so it sits in front of the rags. ----
    try {
      const a = out && out.anchors;
      const hip = (a && a.hip) ? a.hip : { x:.52, y:.70 };
      const neck = (a && a.neck) ? a.neck : { x:.5, y:.42 };
      const bx = (hip.x*W) + W*0.10;          // out at the near hip
      const by = (hip.y*H) + H*0.02;
      const sx = (neck.x*W) + W*0.06;          // strap anchors near the shoulder
      const sy = (neck.y*H);
      ctx.save();
      ctx.lineCap="round"; ctx.lineJoin="round";
      // cord/strap from shoulder to bag
      ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.016;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx+W*0.02, by-H*0.09, bx, by-H*0.05); ctx.stroke();
      ctx.strokeStyle="#4d4b46"; ctx.lineWidth=W*0.008;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx+W*0.02, by-H*0.09, bx, by-H*0.05); ctx.stroke();
      // the sack body — a lumpy pouch, contour + mid grey
      ctx.fillStyle="#5c5a54"; ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.014;
      ctx.beginPath();
      ctx.moveTo(bx - W*0.05, by - H*0.045);
      ctx.quadraticCurveTo(bx - W*0.075, by + H*0.045, bx, by + H*0.06);
      ctx.quadraticCurveTo(bx + W*0.075, by + H*0.045, bx + W*0.05, by - H*0.045);
      ctx.quadraticCurveTo(bx, by - H*0.02, bx - W*0.05, by - H*0.045);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // cinched neck of the sack
      ctx.strokeStyle="#141414"; ctx.lineWidth=W*0.012;
      ctx.beginPath(); ctx.moveTo(bx - W*0.05, by - H*0.045);
      ctx.quadraticCurveTo(bx, by - H*0.028, bx + W*0.05, by - H*0.045); ctx.stroke();
      // a crease or two for the worn-cloth read
      ctx.strokeStyle="#2b2a27"; ctx.lineWidth=W*0.006;
      ctx.beginPath(); ctx.moveTo(bx - W*0.02, by - H*0.01); ctx.lineTo(bx - W*0.03, by + H*0.03); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + W*0.02, by - H*0.008); ctx.lineTo(bx + W*0.028, by + H*0.028); ctx.stroke();
      ctx.restore();
    } catch(e){ /* the bag is decorative; never block the figure render */ }

    return out;
  },
};
export default asset;
