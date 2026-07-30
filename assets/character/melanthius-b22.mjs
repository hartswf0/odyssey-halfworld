/* character.melanthius-b22 — the continuity Melanthius. Book XXII.
   ADDITIVE: does not modify or shadow character.melanthius. Books I–XXI keep
   casting the original; Book XXII scenes cast THIS id.

   Same body, same wardrobe, same swagger — the params below are lifted
   VERBATIM from assets/character/melanthius.mjs so the identity is bit-stable
   across the join. What Book XXII adds is the arc the original had no states
   for: the traitor who finds the one gap the plan left open, works it, is
   taken mid-operation, is lashed limb-to-limb, and ends the scene hanging.

   Scene function:
     OD-B22-S04  the traitor exploiting a procedural gap, then captured
                 mid-operation and transformed into a suspended prisoner.
                 slipping -> hauling -> caught -> trussed -> hoisted.

   THE GAP is the point. The hall was stripped of weapons and both doors were
   watched; what nobody closed was the orsothyre, the raised side-passage out
   of the megaron. Melanthius is the only man in Ithaca who knows the palace
   as a servant knows it, so he is the only man who can walk through a hole in
   someone else's procedure. `slipping` and `hauling` are that exploit; they
   are furtive and WORKING poses, not villain poses — the menace is competence.

   THE TRANSFORMATION is procedural, not a second costume. Two continuous
   channels do it and the scene ramps them:
     bound  0..1   the twisted cord closes on wrists and ankles (drawn from the
                   rig's OWN returned hand/foot anchors — nothing hand-placed)
     hoist  0..1   the whole rig lifts clear of the floor, feet dangling
   `hoist` is a placement transform, never overpaint. The rig plants its lowest
   ankle on a floor at 0.90·H and drops a ground shadow at 0.905·H, so the
   shadow follows the feet through any transform and the man never leaves the
   ground. So: draw the untouched rig into a buffer, drop the one
   semi-transparent thing in it (that shadow is the only sub-opaque fill the
   rig makes — every body tone is a solid fill or stroke), blit the buffer up
   and a few degrees off plumb, and lay a fresh ground mark back down at the
   real floor. No pixel of Melanthius is drawn by this module; the rig does all
   of it, exactly as in the Book XVII file. Hand-drawn geometry here is the
   cord and nothing else, and even the cord is placed from the rig's own
   returned wrist and ankle anchors.

   THE ROPE. `prop.storeroom-rope-and-rafter` owns the rafter, the pillar and
   the tackle. This module therefore draws only the short twisted cord leaving
   his lashed wrists and running off the top of the frame — enough to read
   HAULED UP on a card, little enough that the prop can sit over it in a scene.
   Pass `suspension:"none"` when the scene supplies its own rope. */
import { makeFigure, INK, inkLevel, clamp01, lerp } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- Book XXII poses ----
   Registered additively into the shared rig registry, same as the Book XVII
   module does, so preview()/states name them like any built-in pose.
   Conventions, verified against the rig's own returned anchors rather than
   assumed: a limb angle of 0 hangs straight down and ±π points straight up,
   and POSITIVE swings a limb toward SCREEN-LEFT whichever side of the body it
   is on — arms and legs, L and R alike. (The mirrored pairs in the pose
   library make it look like the two sides take opposite signs; they take
   opposite signs to be SYMMETRIC. Two limbs going the same way share a sign.)
   -headPitch lifts the chin, +headPitch drops it. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label:id, group:"melanthius-b22", n, opt }; };

// SLIPPING — the exploit. Near profile, sidling along the wall toward the
// raised side-passage, weight low and forward, one hand out ahead feeling for
// the sill, head cranked BACK the other way to check the hall behind him.
// Brows up and eyes wide, mouth barely open: this is concentration, not rage.
P("m22_slip", {
  bodyYaw:-1.02, headYaw:.58, neckYaw:.26, gazeX:.66, gazeY:-.04,
  spineLean:-.30, chestLift:.06, rootY:.03,
  hipL:.34, kneeL:.30, hipR:-.28, kneeR:.34, ankleR:.10,   // low sidling stride
  armLUpper:-1.02, armLLower:.34, handRotL:.16,            // lead hand out ahead, low
  armRUpper:.48, armRLower:-.36, handRotR:-.18,            // trailing arm tucked back
  shoulderLiftL:.20, shoulderLiftR:.26,
  browUp:.40, browKnit:.26, eyeWide:.30, jaw:.10, mouthAsym:.26, smile:.12,
  rootScale:1.00,
}, { hands:["offering","fist"] });

// HAULING — mid-operation: twelve shields and helmets and spears carried out
// of the storeroom in both arms, forearms folded up under the load, spine
// rocked BACK to counterweight it, stance planted wide. The face is strained
// and pleased at once — mouthAsym keeps the smirk under the effort.
P("m22_load", {
  bodyYaw:-.34, headYaw:-.14, headPitch:-.12, gazeX:-.30, gazeY:.14,
  spineLean:.30, chestOpen:.20, chestLift:.24,
  armLUpper:.86, armLLower:-1.46, handRotL:-.30, shoulderLiftL:.34,  // arms clamped
  armRUpper:-.90, armRLower:1.44, handRotR:.30, shoulderLiftR:.34,   //   around the load
  hipL:.20, kneeL:.12, hipR:-.20, kneeR:.16, footRotL:-.08, footRotR:.08,
  browKnit:.44, browUp:.16, eyeNarrow:.36, jaw:.30, frown:.18, mouthAsym:.34,
  rootScale:1.02,
}, { hands:["fist","fist"] });

// CAUGHT — taken on the second trip, arms still full. The body is arrested and
// thrown back over the planted leg, the near arm flung wide, the far arm still
// crooked round a load that is about to go on the floor. Brows blown up, eyes
// wide, jaw dropped: the one moment this man is not composed.
P("m22_caught", {
  bodyYaw:-.42, headYaw:.34, headPitch:-.26, headRoll:-.12, gazeX:.56, gazeY:-.22,
  spineLean:.34, chestOpen:.34, shoulderTilt:-.14,
  // flung wide and up, but the elbow folds it back inside the card: a fully
  // extended arm at this scale puts the hand through the frame edge
  armLUpper:1.72, armLLower:-1.02, handRotL:-.34, shoulderLiftL:.62,
  armRUpper:-1.04, armRLower:1.10, handRotR:.22, shoulderLiftR:.20,   // still crooked round the load
  hipL:.52, kneeL:.26, hipR:-.30, kneeR:.46, ankleL:-.18,             // stumbling back
  browUp:.92, browKnit:.14, eyeWide:.82, jaw:.72, frown:.34, mouthAsym:.14,
  rootScale:1.03,
}, { hands:["open_palm","fist"] });

// TRUSSED — dragged down onto the storeroom floor and lashed: knees folded
// under him, spine bowed forward, head hanging, both arms wrenched BACK past
// the hips so the wrists meet behind. The upper arms swing behind vertical
// (negative on the left, positive on the right) and the forearms run straight,
// which is exactly the shape of hands pulled together at the small of the back.
P("m22_truss", {
  bodyYaw:-.92, headYaw:-.24, gazeX:-.20, gazeY:.54,
  // he faces screen-left, so BEHIND him is screen-right and on this rig that
  // is the NEGATIVE direction for every limb angle, left and right alike
  // (positive swings a limb toward screen-left whichever side it is on).
  // Both hands therefore resolve behind the hips and land within a hand's
  // width of each other — one bond, not two arms doing separate things.
  kneeL:1.72, hipL:-.94, kneeR:.66, hipR:-.26, rootY:.14, ankleL:.20,
  spineLean:-.34, chestOpen:-.08, headPitch:.46, neckPitch:.24, headY:.10,
  armLUpper:-.72, armLLower:.34, handRotL:.26, shoulderLiftL:-.16,
  armRUpper:-.22, armRLower:.44, handRotR:-.26, shoulderLiftR:-.16,
  browKnit:.62, browUp:.34, frown:.52, eyeNarrow:.38, jaw:.40, mouthAsym:.18,
  rootScale:1.00,
}, { hands:["fist","fist"] });

// HOISTED — the terminal state. The lashed wrists go up the pillar first and
// the whole man follows, so the silhouette is one long vertical: both upper
// arms swung past straight-up and angled INWARD so the two fists converge
// above the crown (that convergence is what the hauling cord is made fast to),
// shoulders dragged to the ears, the body hanging off them dead-weight — spine
// slack, head dropped forward and rolled, ankles lashed and the legs trailing
// with the knees soft and the toes pointed down. Nothing here is planted: the
// legs are authored to DANGLE, which is why the pair is asymmetric.
// (The wrenched hands-and-feet-behind knot is in `trussed`, on the floor,
// where the rig can show it. Off the ground it would fold him into an
// illegible bundle, and this asset has to read at scene scale too.)
P("m22_hoist", {
  bodyYaw:-.38, headYaw:-.24, neckYaw:-.10,
  // past straight-up on both sides and angled inward, so the two fists close
  // to within a hand's width directly above the crown — that convergence is
  // the knot the hauling cord is made fast to.
  armLUpper:3.62, armLLower:-.16, handRotL:.20, shoulderLiftL:.88,
  armRUpper:-3.54, armRLower:.18, handRotR:-.20, shoulderLiftR:.82,
  hipL:-.02, kneeL:.44, ankleL:.34, footRotL:.20,      // slack, pointed, dangling
  hipR:.06, kneeR:.26, ankleR:.28, footRotR:-.12,
  spineLean:.06, spineTwist:.12, chestOpen:-.14, chestLift:-.06, shoulderTilt:.10,
  headPitch:.46, neckPitch:.30, headRoll:.22, headY:.12, gazeX:-.26, gazeY:.50,
  browUp:.52, browKnit:.50, frown:.50, eyeNarrow:.46, jaw:.28, mouthAsym:.14,
  rootScale:.84, rootX:.05,
}, { hands:["fist","fist"] });

/* Identity-carryover swagger. Authored here rather than imported so this module
   has no dependency on the Book XVII file, but numerically the same man. */
P("m22_swagger", {
  rootX:-.14, weightShift:.42, pelvisX:.08, pelvisRot:.07,
  hipL:.06, kneeL:.02, hipR:-.05, kneeR:.18, footRotR:.08,
  spineLean:.08, chestOpen:.46, chestLift:.2, shoulderTilt:.08,
  bodyYaw:-.34, headYaw:.02, headRoll:-.10, headPitch:-.20,
  gazeX:-.35, gazeY:.42,
  browUp:.04, browKnit:.38, eyeNarrow:.55, smile:.10, frown:.22, mouthAsym:.80, jaw:.20,
  armLUpper:.42, armLLower:-1.28, handRotL:-.22, shoulderLiftL:.14,
  armRUpper:-.30, armRLower:.16, handRotR:.10,
  rootScale:1.00,
}, { hands:["fist","relaxed"] });

/* ---- the body: VERBATIM from character.melanthius ---- */
const params = {
  skin:"#c2a87e", hairColor:"#201d19",
  hair:"curly", beard:true, glasses:false,
  garment:"rags", cloak:true, bareLegs:true, scale:0.99,
};
const fig = makeFigure(params);

/* ============================================================
   THE CORD — twisted rope, drawn only where the rig says the wrists and
   ankles actually are. Two light-cored strands under a hard black contour,
   with short counter-ticks for the twist: dark enough to be structure, thin
   enough that it never becomes a tonal mass.
   ============================================================ */
const ROPE_CORE = inkLevel(3);
const ROPE_DEEP = inkLevel(5);

function cord(ctx, ax, ay, bx, by, w){
  ctx.lineCap = "round";
  ctx.strokeStyle = INK;      ctx.lineWidth = w + 3.2;
  ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();
  ctx.strokeStyle = ROPE_CORE; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();
  // twist: short ticks across the strand at a fixed pitch
  const dx = bx-ax, dy = by-ay, len = Math.hypot(dx,dy) || 1;
  const ux = dx/len, uy = dy/len, px = -uy, py = ux;
  const pitch = Math.max(9, w*2.6);
  ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
  for (let s = pitch*0.5; s < len; s += pitch){
    const cx = ax+ux*s, cy = ay+uy*s;
    ctx.beginPath();
    ctx.moveTo(cx - px*w*0.5 - ux*w*0.34, cy - py*w*0.5 - uy*w*0.34);
    ctx.lineTo(cx + px*w*0.5 + ux*w*0.34, cy + py*w*0.5 + uy*w*0.34);
    ctx.stroke();
  }
}

/* a lashing: the cord wound and knotted at a joint. `u` is 0..1 tightness. */
function lash(ctx, x, y, r, ang, u){
  if (u <= 0.02) return;
  const R = r * (0.55 + 0.45*u);
  ctx.save(); ctx.translate(x,y); ctx.rotate(ang);
  ctx.fillStyle = ROPE_DEEP; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(0, 0, R, R*0.52, 0, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 2;
  for (let i=-1; i<=1; i++){
    ctx.beginPath(); ctx.moveTo(i*R*0.5, -R*0.52); ctx.lineTo(i*R*0.5 + R*0.16, R*0.52); ctx.stroke();
  }
  ctx.restore();
}

const ang = (a,b) => Math.atan2(b.y-a.y, b.x-a.x);

export const asset = {
  id:"character.melanthius-b22",
  type:"CHARACTER",
  name:"Melanthius",
  statusWord:"SUSPENDED",
  scene:"OD-B22-S04",
  continuityOf:"character.melanthius",
  satisfies:["character.melanthius"],

  params,
  // separate costume layers, back -> front, honored by the rig's composite
  // order; `bindings` and `cord` are the Book XXII additions and sit on top.
  layers:["shadow","hair-back","legs","tunic","gift-cloak","far-arm","neck","head",
          "face","hair-front","beard","near-arm","bindings","cord"],
  // normalized 0..1 anchors for scene attachment / gaze / prop grips
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.21},
    rightHand:{x:.61,y:.60}, leftHand:{x:.37,y:.58},
    loadGrip:{x:.50,y:.55},      // where the armfuls of shields and spears ride
    gapSill:{x:.12,y:.42},       // the orsothyre sill he goes up through
    bindWrists:{x:.50,y:.20},    // the lashing the hauling cord is made fast to
    bindAnkles:{x:.52,y:.74},
    ropeTop:{x:.50,y:.00},       // where the cord leaves frame for the rafter
    hip:{x:.52,y:.64}, feet:{x:.50,y:.94},
  },
  channels:["gaze","mouth","breath","pose","stance","band","bound","hoist","suspension",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw",
            "mouthAsym","mouthPucker","cheek"],

  states:{
    initial:"swagger",
    nodes:{
      // carried over so the Book XXII module still opens on the man Book XVII
      // established — hip cocked, chin up, eyes down the nose, smirk.
      swagger:  { preview:{ pose:"m22_swagger", gaze:{x:-.35,y:.42},
                            bound:0, hoist:0, status:"INSOLENT" } },
      // the procedural gap: sidling to the side-passage, checking behind him
      slipping: { preview:{ pose:"m22_slip",   gaze:{x:.66,y:-.04},
                            bound:0, hoist:0, status:"SLIPPING" } },
      // mid-operation: the storeroom emptied into the suitors' hands
      hauling:  { preview:{ pose:"m22_load",   gaze:{x:-.30,y:.14},
                            bound:0, hoist:0, status:"ARMING THEM" } },
      // taken on the second trip, arms still full
      caught:   { preview:{ pose:"m22_caught", gaze:{x:.56,y:-.22},
                            bound:0, hoist:0, status:"CAUGHT" } },
      // hands and feet wrenched back and lashed together on the floor
      trussed:  { preview:{ pose:"m22_truss",  gaze:{x:-.14,y:.52},
                            bound:1, hoist:0, status:"TRUSSED" } },
      // hauled up the pillar until he is near the roof beams
      hoisted:  { preview:{ pose:"m22_hoist",  gaze:{x:-.18,y:.44},
                            bound:1, hoist:1, status:"SUSPENDED", progress:.94 } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left", bound:0, hoist:0 } },
      back:     { preview:{ pose:"back_view",    bound:0, hoist:0 } },
    },
    edges:[
      ["swagger","slipping"],["slipping","hauling"],["hauling","slipping"],
      ["hauling","caught"],["slipping","caught"],["caught","trussed"],
      ["trussed","hoisted"],["hoisted","trussed"],
      ["swagger","profile"],["swagger","back"],
    ],
  },

  // CARD SIGNATURE — the state this module exists to add. Everything the
  // original Melanthius card asserted about him ends here.
  preview:()=>({ pose:"m22_hoist", gaze:{x:-.18,y:.44}, t:0.5,
                 bound:1, hoist:1, suspension:"cord",
                 status:"SUSPENDED", progress:.94 }),

  draw(ctx, W, H, state){
    const st = { ...(state||{}) };
    if (st.band) fig.spec.band = st.band;

    const hoist = clamp01(typeof st.hoist === "number" ? st.hoist
                        : (st.pose === "m22_hoist" ? 1 : 0));
    const bound = clamp01(typeof st.bound === "number" ? st.bound
                        : (st.pose === "m22_truss" || hoist > 0 ? 1 : 0));
    const susp  = st.suspension || "cord";     // "cord" | "none"

    /* --- placement: lift the whole rig clear of the floor ---------------
       The rig plants its lowest ankle on a floor at 0.90·H and drops a ground
       shadow at 0.905·H, so ANY transform of the figure carries the shadow
       with it and he never leaves the ground. The fix is not to repaint him:
       draw the untouched rig into a transparent buffer, drop the one
       semi-transparent thing in it (that shadow is the only sub-opaque fill
       the rig makes; every body tone is a solid fill or stroke), blit the
       buffer up by `hoist`, and lay a fresh ground mark back down at the real
       floor. The body is still 100% rig output — it has simply been moved. */
    const R = Math.min(H*0.90, W*1.26);          // the rig's own height unit
    const lift = H*0.17*hoist;
    // dead weight does not hang plumb. A few degrees off vertical about the
    // rope point is the difference between "suspended" and "standing".
    const tilt = -0.085*hoist;
    let out, pivot = { x:W*0.5, y:0 };
    const rot = p => {
      const c = Math.cos(tilt), s = Math.sin(tilt), dx = p.x-pivot.x, dy = p.y-pivot.y;
      return { x: pivot.x + c*dx - s*dy, y: pivot.y + s*dx + c*dy };
    };

    if (hoist > 0.02 && typeof document !== "undefined"){
      const buf = document.createElement("canvas");
      buf.width = Math.max(1, Math.round(W)); buf.height = Math.max(1, Math.round(H));
      const bg = buf.getContext("2d", { willReadFrequently:true });
      out = fig.draw(bg, W, H, st);
      try{
        const im = bg.getImageData(0, 0, buf.width, buf.height), px = im.data;
        for (let i = 3; i < px.length; i += 4) if (px[i] < 128) px[i] = 0;   // shadow away
        bg.putImageData(im, 0, 0);
      }catch(e){ /* buffer unreadable: keep the shadow rather than lose the body */ }
      const A0 = (out && out.anchors) || { leftHand:{x:.5,y:.1}, rightHand:{x:.5,y:.1} };
      pivot = { x:(A0.leftHand.x + A0.rightHand.x)*0.5*W,
                y:(A0.leftHand.y + A0.rightHand.y)*0.5*H - lift };
      // the floor he is no longer standing on — flat, light, well short of the
      // card edges so it reads as a mark on the ground, not a rule across it
      ctx.save();
      ctx.fillStyle = inkLevel(1);
      ctx.beginPath(); ctx.ellipse(W*0.50, H*0.905, R*0.15, R*0.018, 0, 0, Math.PI*2); ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(pivot.x, pivot.y); ctx.rotate(tilt); ctx.translate(-pivot.x, -pivot.y);
      ctx.drawImage(buf, 0, -lift);
      ctx.restore();
    } else {
      out = fig.draw(ctx, W, H, st);
    }

    /* --- the cord, placed from the rig's OWN returned anchors ----------- */
    const A = (out && out.anchors) || null;
    if (!A) return out;
    const map = p => rot({ x: p.x*W, y: p.y*H - lift });
    const lh = map(A.leftHand),  rh = map(A.rightHand);
    const lf = map(A.leftFoot),  rf = map(A.rightFoot);
    const w  = R*0.030;

    if (bound > 0.02){
      // wrists lashed to wrists, ankles lashed to ankles
      const wm = { x:(lh.x+rh.x)/2, y:(lh.y+rh.y)/2 };
      const fm = { x:(lf.x+rf.x)/2, y:(lf.y+rf.y)/2 };
      cord(ctx, lh.x, lh.y, rh.x, rh.y, w*0.62);
      cord(ctx, lf.x, lf.y, rf.x, rf.y, w*0.62);
      lash(ctx, wm.x, wm.y, w*1.30, ang(lh,rh), bound);
      lash(ctx, fm.x, fm.y, w*1.20, ang(lf,rf), bound);
      // on the floor the knot is the hogtie proper: the wrenched-back hands
      // run down to the bound feet and the two lashings are one bond
      if (hoist < 0.5) cord(ctx, wm.x, wm.y, fm.x, fm.y, w*0.50);

      // the hauling cord: made fast above the wrist lashing and straight up
      // off the top of the frame. `prop.storeroom-rope-and-rafter` owns the
      // rafter, the pillar and the tackle above that edge.
      if (hoist > 0.02 && susp !== "none"){
        const topY = -H*0.02;
        cord(ctx, wm.x, wm.y, wm.x - (wm.y-topY)*0.06, topY, w*0.78);
      }
    }
    return out;
  },
};
export default asset;
