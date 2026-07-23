/* character.medon — the loyal palace herald of Ithaca.
   Middle-aged crier in a herald's tunic, a staff (kerykeion) in his off hand,
   who risks his own skin to warn the house of the suitors' murder-plot.
   His signature is an URGENT WARNING: body pitched forward, near hand thrown
   up, brows lifted-and-knit over wide anxious eyes, mouth open on the alarm.
   Atlas: OD-B04-S07 — the herald discloses the conspiracy. */
import { makeFigure, HERO_POSES } from "/engine/halfworld-engine.mjs";

/* ---- bespoke pose: an urgent forewarning gesture ----
   Leans in over the threshold, RIGHT (far) arm flung up open-palmed as a
   "stop / hear me" alarm, left arm low to steady the staff, face already
   pulled into fear. Registered additively onto the shared pose table so the
   rig resolves it like any built-in pose. */
if (!HERO_POSES.urgent_warning) {
  HERO_POSES.urgent_warning = {
    id:"urgent_warning", label:"urgent warning", group:"emotion",
    n:{ spineLean:-.34, headPitch:-.06, bodyYaw:-.16, headYaw:-.12,
        armRUpper:-2.46, armRLower:.24, shoulderLiftR:.62,
        armLUpper:.36, armLLower:-.46, handRotL:.12,
        browUp:.62, browKnit:.42, eyeWide:.44, frown:.14, jaw:.34,
        rootScale:1.02 },
    opt:{ hands:["relaxed","open_palm"] },
  };
}

const params = {
  skin:"#c9b79c", hairColor:"#6c655a",   // weathered skin, greying middle age
  hair:"short", beard:true, glasses:false,
  garment:"tunic", cloak:false, bareLegs:true, scale:1.0,
};

const fig = makeFigure(params);

/* draw a plain herald's staff standing in whichever hand is nearer the
   viewer. anchors come back normalized 0..1 from the rig draw. */
function drawStaff(ctx, W, H, anchors){
  if (!anchors) return;
  const h = anchors.leftHand, other = anchors.rightHand;
  // pick the lower / more-planted hand for the staff grip
  const grip = h || other; if (!grip) return;
  // plant the staff at his side: shift a touch outboard of the gripping hand
  // so it never crosses the face, foot on the ground, hand gripping mid-shaft.
  const px = grip.x*W - W*0.028, py = grip.y*H;
  const top = py - H*0.14, bot = H*0.895;   // chest height -> floor line
  ctx.save();
  ctx.lineCap="round";
  // hard contour
  ctx.strokeStyle="#141414"; ctx.lineWidth=14;
  ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, bot); ctx.stroke();
  // wood shaft (mid gray -> dotifies to a light column)
  ctx.strokeStyle="#7a746a"; ctx.lineWidth=7;
  ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, bot); ctx.stroke();
  // grip binding marks at the hand
  ctx.strokeStyle="#141414"; ctx.lineWidth=2.4;
  for (let i=0;i<3;i++){ const y=py-H*0.015+i*H*0.016;
    ctx.beginPath(); ctx.moveTo(px-7,y); ctx.lineTo(px+7,y); ctx.stroke(); }
  // finial knob (herald's mark) at the top
  ctx.fillStyle="#8a8a83"; ctx.strokeStyle="#141414"; ctx.lineWidth=4;
  ctx.beginPath(); ctx.arc(px, top, H*0.022, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

export const asset = {
  id:"character.medon",
  type:"CHARACTER",
  name:"Medon",
  statusWord:"EARNEST",
  scene:"OD-B04-S07",

  params,
  layers:["shadow","legs","torso","far-arm","neck","head","face","beard","near-arm","staff"],
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.70,y:.32}, leftHand:{x:.34,y:.62},
    staffGrip:{x:.34,y:.62}, staffTop:{x:.34,y:.28},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // earnest baseline — a crier at attention, staff planted, brows a touch
      // raised in duty, gaze steady on the hall
      neutral:   { preview:{ pose:"three_quarter_left", gaze:{x:-.14,y:.03},
                             browUp:.2, browKnit:.06, smile:.05, t:0.5 } },
      // THE SIGNATURE — the urgent warning: leaning in, hand thrown up,
      // fearful lifted-and-knit brow, wide eyes, mouth open on the alarm
      warning:   { preview:{ pose:"urgent_warning", gaze:{x:.16,y:-.04},
                             browUp:.62, browKnit:.42, eyeWide:.44,
                             frown:.14, jaw:.34, t:0.5 } },
      // disclosing — pitched forward, confiding the plot, jaw working on
      // words, brows knit with worry, eyes locked on his listener
      disclosing:{ preview:{ pose:"lean_forward", gaze:{x:.05,y:.02},
                             jaw:.5, browUp:.4, browKnit:.5, eyeNarrow:.16,
                             mouthAsym:.2, t:0.5 } },
      // afraid — the risk lands: he shrinks and cuts a glance to the door,
      // brows flung up, eyes wide, mouth pulled taut
      afraid:    { preview:{ pose:"guarded_withdrawal", gaze:{x:-.55,y:-.02},
                             browUp:.8, browKnit:.3, eyeWide:.6,
                             frown:.32, t:0.5 } },
    },
    edges:[["neutral","warning"],["warning","disclosing"],
           ["disclosing","afraid"],["afraid","neutral"],["neutral","disclosing"]],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // CARD SIGNATURE — EARNEST/URGENT: the forewarning. Leaning across the
  // frame, near hand snapped up in alarm, brow lifted-and-knit over wide
  // eyes, mouth open on the word, the herald's staff at his side.
  preview:()=>({ pose:"urgent_warning", gaze:{x:.16,y:-.04},
                 browUp:.62, browKnit:.42, eyeWide:.44, frown:.14, jaw:.34,
                 t:0.5, status:"URGENT", progress:.28 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    const res = fig.draw(ctx, W, H, state);
    drawStaff(ctx, W, H, res && res.anchors);
    return res;
  },
};
export default asset;
