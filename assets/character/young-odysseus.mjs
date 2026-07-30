/* character.young-odysseus — Odysseus before he was Odysseus.
   CHARACTER asset. The adolescent who went up Mount Parnassus to hunt with
   Autolycus' sons, met the boar in its thicket, took the tusk above the knee
   and killed it anyway. This is the body Eurycleia's hands recognise twenty
   years later: the boy is the origin of the permanent mark.

   Scene function:
     OD-B19-S05  adolescent canonical variant displaying early courage and
                 the origin of a permanent mark.

   IDENTITY — he must read as the SAME man as character.odysseus-b16, younger.
   So: the shared hero rig, the same curly head and the same skin family, one
   shade warmer and lighter for youth; the beard subtracted (that is what makes
   him a boy on this rig); the cloak subtracted (a hunting chiton, and a cloak
   is a slab of dark that would sink the tonal balance); scale 0.86, a head
   shorter than Telemachus at 0.90. Everything else the rig does untouched.

   THE MARK is the one thing the rig cannot supply and the one thing this asset
   exists for, so it is the ONLY overpaint — a `mark` channel drawn from the
   rig's OWN hip and knee nodes (so the gash rides the thigh through every pose
   instead of floating at a guessed coordinate):
     none    before the thicket — an unmarked boy
     fresh   the tusk rip, open, running
     healed  the seam Autolycus' sons bound and sang shut — the scar itself
   The full diagrammatic plate of the wound is a separate asset
   (set-piece.boar-scar); what lives here is only the mark ON the body.

   Poses are registered additively into the shared rig registry, so scenes name
   them like any built-in pose. */
import { makeFigure, INK, gray } from "../../engine/halfworld-engine.mjs";
import { POSES, POSE_ALIAS } from "../../engine/figure-hero.mjs";

/* ---- bespoke Parnassus poses ----
   Rig conventions used throughout, and every one of them was read off a render
   rather than guessed:
     · a NEGATIVE bodyYaw turns him toward screen LEFT and brings the LEFT arm
       and LEFT leg NEAR the camera — which is what presents the near thigh,
       and therefore the mark, to the plate;
     · a POSITIVE rotation on any joint swings that limb toward screen LEFT, so
       a positive spineLean pitches him INTO the charge he is facing;
     · the knee must carry the OPPOSITE sign to its hip. Matching signs
       hyperextend the leg into a straight horizontal stick — the single
       failure that made the first plate of this asset read as a man slipping
       over rather than a boy lunging. */
function P(id, n, hands){ POSES[id] = { id, label:id, group:"young-odysseus", n, opt:hands?{hands}:{} }; }

// THE CARD — UNFLINCHING: the boar has already opened his thigh and the boy is
// still going forward. Deep lunge onto the near leg, spear-grip in both fists
// carried forward at chest height (the shaft is prop.spear-and-wound-bandage,
// never drawn here), spine pitched into the charge, chin driven up, brows
// slammed together, jaw set on the effort. The hands ride HIGH on purpose: they
// must not cross the near thigh, because the thigh is where the mark is.
P("yod_lunge", {
  bodyYaw:-.44, headYaw:-.20, headPitch:-.10, spineLean:.28, chestLift:.22,
  gazeX:-.52, gazeY:-.06,
  browKnit:.52, browUp:.10, eyeNarrow:.10, eyeWide:.16, frown:.14, jaw:.26,
  // lunge: near leg thrown forward with the shin dropped back to vertical, rear
  // leg driven back and long. The two ankles land within a few pixels of each
  // other so the floor correction plants BOTH feet.
  hipL:.40, kneeL:-.22, ankleL:-.06, footRotL:.08,
  hipR:-.38, kneeR:.30, ankleR:.14, footRotR:-.16,
  weightShift:.30, pelvisX:-.10, pelvisRot:.05,
  // two-handed grip carried forward: near fist out on the shaft, rear fist
  // tucked in at the ribs behind it (the shaft itself is a separate prop)
  armLUpper:1.10, armLLower:-.62, handRotL:-.20, shoulderLiftL:.18,
  armRUpper:.48, armRLower:.72, handRotR:.22, shoulderLiftR:.22,
  rootScale:1.02,
}, ["fist","fist"]);

// THE HIT — the tusk goes in. Weight snapped back off the wounded leg, torso
// twisted away, near leg still thrust out and exposed (the mark is on it), the
// near hand flung open and down toward the thigh, brows up, eyes wide, jaw
// dropped on the cry. Courage is only legible if the wound costs something.
P("yod_gored", {
  bodyYaw:-.55, headYaw:-.10, headPitch:-.10, headRoll:-.18, spineLean:-.38,
  gazeX:-.30, gazeY:.46,
  browUp:.86, browKnit:.30, eyeWide:.54, jaw:.56, frown:.34, mouthAsym:.22,
  hipL:.52, kneeL:-.30, ankleL:-.04,        // the struck leg thrust out, exposed
  hipR:-.02, kneeR:.52, ankleR:.10,         // the sound leg buckling under him
  weightShift:-.34, pelvisX:.12, pelvisRot:-.06,
  // near hand thrown straight DOWN at the wound (a hand held out sideways read
  // as a shrug on the plate); far arm flung UP and back — up, because a level
  // arm prints as a bar laid across the paper
  armLUpper:-.06, armLLower:.46, handRotL:-.30, shoulderLiftL:.30,
  armRUpper:-1.95, armRLower:.30, handRotR:.22, shoulderLiftR:.55,
  rootScale:1.00,
}, ["open_palm","fist"]);

// THE KILL — the boy answers. Spine driven down over the front knee, both fists
// low on the shaft, head pitched down onto the thing he is killing, teeth bared.
P("yod_kill", {
  bodyYaw:-.40, headYaw:-.14, headPitch:.30, spineLean:.46, chestOpen:.20,
  gazeX:-.44, gazeY:.34,
  browKnit:.70, eyeNarrow:.24, frown:.42, jaw:.44,
  hipL:.54, kneeL:-.34, ankleL:-.10,
  hipR:-.44, kneeR:.38, ankleR:.20, footRotR:-.18,
  weightShift:.42, pelvisX:-.12,
  armLUpper:.92, armLLower:-.34, handRotL:-.18, shoulderLiftL:.10,
  armRUpper:.34, armRLower:.78, handRotR:.18, shoulderLiftR:.14,
  rootScale:1.04,
}, ["fist","fist"]);

// BOUND — the wound dressed, the song sung over it. Standing off the hurt leg,
// weight thrown onto the sound one, near hand hanging down toward the bandage,
// mouth shut, eyes level. The stillness after.
P("yod_bound", {
  bodyYaw:-.36, headYaw:-.16, headPitch:.14, spineLean:-.08,
  gazeX:-.26, gazeY:.30,
  browKnit:.26, browUp:.16, eyeNarrow:.14, frown:.12,
  hipL:.16, kneeL:-.22, ankleL:-.10, footRotL:.14,  // the hurt leg slack, toe down
  hipR:-.05, kneeR:.05,
  weightShift:-.40, pelvisX:.16, pelvisRot:-.05, shoulderTilt:.10,
  armLUpper:.34, armLLower:.22, handRotL:-.14,      // hand hanging toward the dressing
  armRUpper:-.22, armRLower:.14,
  rootScale:1.00,
}, ["relaxed","relaxed"]);

// HAILED — the sons of Autolycus over the carcass, and the boy is given the
// spoils and the name. One arm up, chest open, the first grin of the man who
// will be famous for it.
P("yod_hailed", {
  bodyYaw:-.24, headYaw:-.06, headPitch:-.16, spineLean:-.08, chestOpen:.62, chestLift:.30,
  gazeX:-.10, gazeY:-.14,
  smile:.62, browUp:.42, eyeWide:.20, jaw:.30, cheek:.34,
  hipL:.14, kneeL:-.10, hipR:-.06, kneeR:.06,
  weightShift:.22, pelvisX:.08,
  armLUpper:2.42, armLLower:-.26, handRotL:-.20, shoulderLiftL:.66,
  armRUpper:-.52, armRLower:.34, handRotR:.16,
  rootScale:1.02,
}, ["open_palm","relaxed"]);

// THE BOY — unmarked baseline, three-quarter left, the family turn. Everything
// that is Odysseus is already here except the beard, the scar and the twenty
// years: the head cocked, the eyes already sizing something up.
P("yod_boy", {
  bodyYaw:-.58, headYaw:-.42, headRoll:-.08, spineLean:.04, chestLift:.14,
  gazeX:-.30, gazeY:.02,
  smile:.14, browUp:.10, browKnit:.10, eyeNarrow:.08,
  hipL:.08, kneeL:-.06, hipR:-.05, kneeR:.05,
  weightShift:.18, pelvisX:.06,
  armLUpper:.24, armLLower:-.14, armRUpper:-.22, armRLower:.10,
  rootScale:1.00,
});

const params = {
  // one shade warmer and lighter than character.odysseus' #cdb89a — a boy who
  // has not had twenty years of sea light on him yet
  skin:"#d6c2a4", hairColor:"#2b231a",
  hair:"curly", beard:false, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:0.86,
};

const fig = makeFigure(params);

/* Which leg is nearest camera. The rig composites legs by
   `frontL = Math.sin(bodyYaw) <= 0` and draws the near one LAST; resolving the
   same way here (off the pose table, never off a guess) means the mark always
   lands on the thigh the plate can actually see. */
function nearSideFor(st){
  let id = st.pose || st.band || "neutral_front";
  id = POSE_ALIAS[id] || id;
  const def = POSES[id];
  let yaw = (def && def.n && typeof def.n.bodyYaw === "number") ? def.n.bodyYaw : 0;
  if (st.mirror) yaw = -yaw;
  return Math.sin(yaw) <= 0 ? "L" : "R";
}

/* THE MARK — drawn from the rig's own hip and knee nodes, in leg-local
   coordinates (a = across the thigh, b = along it), so it tracks any pose.
   Sized off the thigh capsule, not off the canvas.

   It is a NOTCH IN THE SILHOUETTE, and that is two lessons from two plates.
   First: strokes laid across the thigh came back from dotify as a broken band
   that read like the sandal strapping the rig already draws on the shins.
   Second: replacing them with a solid lens only made a neater band — anything
   drawn INSIDE a fifty-pixel limb is competing with the dot lattice at its own
   scale and loses. So the fresh wound instead takes a bite out of the leading
   edge of the thigh: paper cut into the contour, the two torn edges inked, and
   the rip running on into the flesh. Silhouette is the one channel this system
   renders at full strength, so the one thing this asset exists for is spent on
   it. The healed mark keeps the contour whole — it closed — and carries the
   seam and its stitch ticks instead. */
function drawBoarMark(ctx, rig, side, mode){
  const hipN  = side === "L" ? rig.hipL  : rig.hipR;
  const kneeN = side === "L" ? rig.shinL : rig.shinR;
  const h = hipN.point(), k = kneeN.point();
  const dx = k.x - h.x, dy = k.y - h.y, L = Math.hypot(dx, dy);
  if (!(L > 8)) return;
  const ux = dx/L, uy = dy/L;          // down the thigh
  const px = -uy, py = ux;             // across the thigh
  const halfW = rig.dim.pelvis * 0.42 * 0.5;
  // Homer is specific: above the knee. Sit it at 0.60 down the thigh — low
  // enough to be "above the knee", high enough that it does not crowd the
  // kneecap ellipse the rig draws.
  const cx = h.x + ux*L*0.60, cy = h.y + uy*L*0.60;
  const X = (a,b) => cx + px*a*halfW + ux*b*L;
  const Y = (a,b) => cy + py*a*halfW + uy*b*L;
  const line = (pts, w, style) => {
    ctx.strokeStyle = style; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(X(pts[0][0],pts[0][1]), Y(pts[0][0],pts[0][1]));
    for (let i=1;i<pts.length;i++) ctx.lineTo(X(pts[i][0],pts[i][1]), Y(pts[i][0],pts[i][1]));
    ctx.stroke();
  };

  ctx.save();
  ctx.lineCap = "round"; ctx.lineJoin = "round";

  if (mode === "fresh"){
    // +a is the LEADING edge of the thigh — the side he is lunging toward, and
    // the side the boar came from. Cut the notch there.
    const APEX = [-0.14, -0.02];
    // paper eats the contour: the outer vertices sit well past the capsule edge
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(X(1.75, -0.235), Y(1.75, -0.235));
    ctx.lineTo(X(APEX[0], APEX[1]), Y(APEX[0], APEX[1]));
    ctx.lineTo(X(1.75,  0.215), Y(1.75,  0.215));
    ctx.closePath(); ctx.fill();
    // the two torn edges, inked back in from just outside the old contour
    line([[1.22, -0.190], APEX], 6, INK);
    line([[1.20,  0.178], APEX], 6, INK);
    // the rip running on into the flesh, tapering out before the far contour
    ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(X(APEX[0], APEX[1]), Y(APEX[0], APEX[1]));
    ctx.quadraticCurveTo(X(-0.55, 0.010), Y(-0.55, 0.010), X(-1.00, -0.075), Y(-1.00, -0.075));
    ctx.quadraticCurveTo(X(-0.55, -0.105), Y(-0.55, -0.105), X(APEX[0], APEX[1]), Y(APEX[0], APEX[1]));
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else {
    // healed: the seam that closed, laid across the thigh from the leading edge
    // — black rip with a PALE core (that contrast is what makes it read as old)
    // and three stitch ticks, plus a small pucker in the contour it healed into
    ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(X(1.02, -0.120), Y(1.02, -0.120));
    ctx.quadraticCurveTo(X(0.10, -0.010), Y(0.10, -0.010), X(-0.86, -0.070), Y(-0.86, -0.070));
    ctx.quadraticCurveTo(X(0.10, -0.086), Y(0.10, -0.086), X(1.02, -0.120), Y(1.02, -0.120));
    ctx.closePath(); ctx.fill(); ctx.stroke();
    line([[0.92, -0.116], [0.10, -0.046], [-0.78, -0.072]], halfW*0.24, gray(0xe4));
    for (const [a,b] of [[0.72,-0.100],[0.06,-0.046],[-0.62,-0.066]]){
      line([[a, b - 0.062], [a, b + 0.062]], halfW*0.32, INK);
    }
  }
  ctx.restore();
}

export const asset = {
  id:"character.young-odysseus",
  type:"CHARACTER",
  name:"Young Odysseus",
  statusWord:"UNFLINCHING",
  scene:"OD-B19-S05",
  youthOf:"character.odysseus-b16",

  params,
  // separate costume layers, back -> front, in the order the rig composites
  layers:["shadow","hair-back","legs","chiton","far-arm","neck","head","face",
          "hair-front","near-arm","mark"],
  // normalized 0..1 anchors for scene attachment / gaze / prop grips
  anchors:{
    head:{x:.50,y:.21}, crown:{x:.50,y:.13}, eyes:{x:.50,y:.22},
    // hands and mark measured off the signature plate, not guessed
    leftHand:{x:.17,y:.51}, rightHand:{x:.40,y:.55},
    spearGrip:{x:.17,y:.51},      // the near fist — prop.spear-and-wound-bandage rides here
    bandageWrap:{x:.40,y:.72},    // the dressing goes over the mark
    boarScar:{x:.40,y:.72},       // above the near knee — the permanent mark
    hip:{x:.50,y:.65}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"boy",
    nodes:{
      // before the thicket — the unmarked adolescent, family turn
      boy:      { preview:{ pose:"yod_boy",    mark:"none",   gaze:{x:-.30,y:.02}, status:"UNMARKED" } },
      // the charge, still clean
      charging: { preview:{ pose:"yod_lunge",  mark:"none",   gaze:{x:-.52,y:-.06}, status:"FEARLESS" } },
      // the tusk goes in
      gored:    { preview:{ pose:"yod_gored",  mark:"fresh",  gaze:{x:-.30,y:.46}, status:"GORED" } },
      // SIGNATURE — wounded and still going forward
      unflinching:{preview:{ pose:"yod_lunge", mark:"fresh",  gaze:{x:-.52,y:-.06}, status:"UNFLINCHING" } },
      // the boy answers the boar
      killing:  { preview:{ pose:"yod_kill",   mark:"fresh",  gaze:{x:-.44,y:.34}, status:"KILLING" } },
      // bound and sung shut
      bound:    { preview:{ pose:"yod_bound",  mark:"healed", gaze:{x:-.26,y:.30}, status:"BOUND" } },
      // spoils, and the name
      hailed:   { preview:{ pose:"yod_hailed", mark:"healed", gaze:{x:-.10,y:-.14}, status:"HAILED" } },
      // stable identity turns, carrying the finished scar
      profile:  { preview:{ pose:"profile_left", mark:"healed" } },
      back:     { preview:{ pose:"back_view",    mark:"healed" } },
    },
    edges:[
      ["boy","charging"],["charging","gored"],["gored","unflinching"],
      ["unflinching","killing"],["killing","bound"],["bound","hailed"],
      ["hailed","boy"],["boy","profile"],["profile","back"],["back","boy"],
    ],
  },
  channels:["mark","gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw",
            "mouthAsym","cheek"],

  // CARD SIGNATURE — UNFLINCHING. The lunge with the rip already open on the
  // near thigh: early courage and the origin of the permanent mark in one frame.
  preview:()=>({ pose:"yod_lunge", mark:"fresh",
                 gaze:{x:-.52,y:-.06}, browKnit:.52, eyeNarrow:.10, frown:.14, jaw:.26,
                 t:0.5, status:"UNFLINCHING", progress:.24 }),

  draw(ctx, W, H, state){
    const st = state || {};
    const r = fig.draw(ctx, W, H, st);
    const mark = typeof st.mark === "string" ? st.mark : "none";
    if (mark !== "none") drawBoarMark(ctx, fig.hero.rig, nearSideFor(st), mark);
    return r;
  },
};
export default asset;
