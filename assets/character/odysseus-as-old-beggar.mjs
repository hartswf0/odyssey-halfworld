/* character.odysseus-as-old-beggar — the KEY recurring disguise.
   Not the Trojan-spy beggar (that man is still young, curly, dark-bearded):
   THIS is Athena's transformation — Odysseus AGED and withered. She dims the
   eyes, thins the flaxen hair to a wispy grey, shrivels the fair skin, and
   folds the king down into a decrepit mendicant: bald-crowned thin grey hair,
   a straggly grey beard, an ashen wrinkled cast, filthy rags, a stooped weak
   carriage leaning on a staff with a beggar's bag at his hip.
   And yet — the tell the poem keeps: a faint hint of the true frame under the
   rags (hidden strength, full combat capacity), and under the clouded rheumy
   lids a sharp watchful glint that never stops cataloguing the room.
   Atlas performance: OD-B13-S05 — canonical Odysseus with aged surface,
   altered carriage, weak silhouette, full hidden combat capacity.
   Shares Odysseus' skin/beard identity, greyed and withered, so it reads as
   the same man wearing old age like a costume. */
import { makeFigure, HERO_POSES } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke aged-beggar poses: register additively onto the shared rig ----
   The library has no decrepit-elder stances, so we author them: a stooped
   lean on the staff, a low watchful peer, a straightening beat where the true
   warrior frame surfaces, and a supplicant's plea. */

// SIGNATURE — the aged beggar folded onto his staff. Deep forward stoop, knees
// softly bent, shoulders hauled up around a bowed neck, the LEFT arm dropped to
// grip a tall staff he leans his weight into, the RIGHT hand cupped out low to
// beg. Head bowed — but the eyes climb up out of it, narrowed and knit: rheumy,
// clouded, yet sharp. A shrunken silhouette (rootScale low) with the ghost of a
// bigger man inside it.
HERO_POSES.old_beggar_lean = { id:"old_beggar_lean", label:"aged beggar lean", group:"emotion",
  n:{ spineLean:-.34, crouch:.24, kneeL:.34, kneeR:.28, hipL:-.1, hipR:.08,
      headPitch:.46, neckPitch:.28, headY:.14, headRoll:.05,
      shoulderLiftL:.6, shoulderLiftR:.66,             // shoulders drawn up, frail neck
      armLUpper:.26, armLLower:-.36, handRotL:-.15,    // left hand down and forward, gripping the staff
      armRUpper:-.92, armRLower:.62, handRotR:.18,     // right hand out low, cupped to beg
      browKnit:.32, browUp:.1, eyeNarrow:.4, frown:.14, rootScale:.86 },
  opt:{ hands:["relaxed","offering"] } };

// WATCHFUL PEER — the mendicant mask kept as cover: head low, gaze slid hard to
// the side, lids pinched to rheumy slits but the glint underneath is disciplined
// and awake, brow knit. The old beggar reading the whole hall while looking
// beaten and blind.
HERO_POSES.beggar_peer = { id:"beggar_peer", label:"watchful peer", group:"emotion",
  n:{ spineLean:-.26, crouch:.26, kneeL:.32, kneeR:.28, hipL:-.08, hipR:.06,
      headPitch:.34, neckYaw:-.2, headYaw:-.28, headY:.1,
      shoulderLiftL:.54, shoulderLiftR:.6,
      armLUpper:.24, armLLower:-.4, handRotL:-.15,     // still on the staff
      armRUpper:-.5, armRLower:.9, handRotR:.2,         // right hand drawn in, guarded
      browKnit:.48, eyeNarrow:.5, frown:.14, rootScale:.86 },
  opt:{ hands:["relaxed","fist"] } };

// HIDDEN FRAME — the beat OD-B13-S05 turns on: the decrepit carriage briefly
// resolves. The spine straightens, the crouch eases, the shoulders drop and set,
// the chest opens a fraction — the true warrior surfaces under the rags. The
// face hardens: brows slam together, eyes open from their rheumy slits, jaw set.
// The staff-hand becomes a grip, not a crutch. Full combat capacity, contained.
HERO_POSES.beggar_true_frame = { id:"beggar_true_frame", label:"hidden frame", group:"emotion",
  n:{ spineLean:-.12, crouch:.06, kneeL:.12, kneeR:.1, hipL:-.04, hipR:.04,
      headPitch:.06, neckPitch:.02, headY:.02,
      shoulderLiftL:.14, shoulderLiftR:.18, chestOpen:.34,
      armLUpper:.3, armLLower:-.46, handRotL:-.2,       // staff gripped like a weapon
      armRUpper:.2, armRLower:1.16, handRotR:.28,        // free hand loose, ready, low
      browKnit:.66, eyeNarrow:.2, frown:.24, jaw:.06, rootScale:1.0 },
  opt:{ hands:["relaxed","fist"] } };

const params = {
  // Athena's withering: Odysseus' warm skin gone ASHEN and greyed; the flaxen
  // hair thinned to a wispy light grey; beard kept but straggled and grey — so
  // he reads unmistakably as an OLD man, and distinct from the dark-curled young
  // Odysseus and the still-young Trojan-beggar.
  skin:"#c4bba9", hairColor:"#a9a49b",
  hair:"short", beard:true, glasses:false,
  garment:"rags", cloak:false, bareLegs:true, scale:0.9,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.odysseus-as-old-beggar",
  type:"CHARACTER",
  name:"Odysseus as old beggar",
  statusWord:"WITHERED",
  scene:"OD-B13-S05",

  params,
  layers:["shadow","staff","hair-back","legs","torso","far-arm","neck","head","face","hair-front","beard","near-arm","beggar-bag"],
  // normalized 0..1 anchors — lowered / stooped, with staff + bag grips
  anchors:{
    head:{x:.49,y:.27}, crown:{x:.49,y:.19}, eyes:{x:.49,y:.28},
    rightHand:{x:.66,y:.66}, leftHand:{x:.38,y:.60},
    staffGrip:{x:.35,y:.46}, staffFoot:{x:.33,y:.95},
    begBowl:{x:.68,y:.68}, bagKnot:{x:.62,y:.58}, hip:{x:.50,y:.70}, feet:{x:.50,y:.95},
  },
  states:{
    initial:"stooped",
    nodes:{
      // SIGNATURE — folded onto the staff, hand cupped out, eyes climbing up
      // out of the bowed head: rheumy, narrowed, knit — but watching.
      stooped:  { preview:{ pose:"old_beggar_lean", browKnit:.32, browUp:.1,
                            eyeNarrow:.4, frown:.14, gaze:{x:.08,y:-.4}, jaw:.04, t:0.5 } },
      // WATCHFUL — head kept low as cover, gaze slid hard sideways, lids pinched
      // to slits, cataloguing the room from under the disguise.
      watching: { preview:{ pose:"beggar_peer", browKnit:.5, eyeNarrow:.52,
                            frown:.14, gaze:{x:-.64,y:-.24}, t:0.42 } },
      // HIDDEN FRAME — OD-B13-S05: the aged surface resolves for a beat, the
      // warrior straightens under the rags, brows slam, jaw sets. Full capacity.
      trueFrame:{ preview:{ pose:"beggar_true_frame", browKnit:.66, eyeNarrow:.2,
                            frown:.24, jaw:.06, gaze:{x:-.32,y:-.06}, t:0.4 } },
      // BEGGING — the performance for the hall: brows lifted in a supplicant's
      // plea, jaw parting on a wheedled word, a weak asymmetric mouth. Cover.
      begging:  { preview:{ pose:"offering_hand", browUp:.5, browKnit:.18,
                            frown:.16, jaw:.34, eyeNarrow:.22, mouthAsym:.32,
                            gaze:{x:.22,y:.16}, t:0.5 } },
      // SHUFFLING — moving through the hall at a bent, dragging elder's walk.
      shuffling:{ preview:{ pose:"walk_neutral", spineLean:-.22, browKnit:.3,
                            eyeNarrow:.4, frown:.1, gaze:{x:.1,y:-.24}, t:0.35 } },
    },
    edges:[["stooped","watching"],["watching","stooped"],["stooped","trueFrame"],
           ["trueFrame","stooped"],["stooped","begging"],["stooped","shuffling"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — WITHERED: a shrunken old man folded onto his staff, a bag
  // at his hip, one hand cupped out to beg — and the tell that never leaves him,
  // the rheumy narrowed eyes lifted out of the bowed head, knit and sharp,
  // watching you from inside the disguise.
  preview:()=>({ pose:"old_beggar_lean", browKnit:.32, browUp:.1, eyeNarrow:.4,
                 frown:.14, gaze:{x:.08,y:-.4}, jaw:.04, t:0.5,
                 status:"WITHERED", progress:.2 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;

    // ---- STAFF (behind the body): a tall, worn beggar's staff planted at his
    // left side that he leans his weight into. Drawn first so the figure and
    // gripping hand overlap it. Solid grays + hard contour -> engine halftones
    // it with the rest. Anchored to the reported left-hand position. ----
    const st = state || (this.preview ? this.preview() : {});
    // pre-run the figure once? No — we need the anchors, so draw figure after
    // and place the staff at the declared grip. Use the static anchor.
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

    // ---- the aged figure (draws over the staff shaft, hand grips it) ----
    const out = fig.draw(ctx, W, H, state);

    // ---- BEGGAR'S BAG: a battered sack slung on a cord over his stooped
    // shoulder, hanging at the near hip. Drawn last so it sits in front of the
    // rags. Solid grays + contour for the POST pass. ----
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
