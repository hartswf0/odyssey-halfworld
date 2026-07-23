/* character.echeneus — the eldest of the Phaeacian counselors. CHARACTER asset
   on the HALFTRACK hero rig. In the hall of Alcinous, Odysseus the suppliant
   has clasped the queen's knees at the hearth and a stunned silence has fallen
   over the whole company. It is Echeneus — the oldest man there, "an elder of
   the Phaeacians, versed beyond all in speech and old in lore" — who breaks it,
   rising to chide the king: a guest must not be left sitting in the ashes; lift
   him up, seat him, pour the wine. A hospitality correction from the eldest.

   Scene function:
     OD-B07-S03  old counselor breaking collective silence with a hospitality
                 correction — rising to advise/admonish the king.

   DISTINCT DRESS (the prompt asks for an elder LIKE Nestor/Aegyptius but set
   apart): where the war-generation Achaean elders wear mid-grey robes under a
   cloak, Echeneus is a PHAEACIAN — wrapped to the ankle in a heavy dark
   ceremonial MANTLE (garment:"cloak"), and he is the WHITEST-haired of them all
   (he is the eldest man in any hall he enters). The dark swathed mass + white
   mane/beard give him his own strong-contrast silhouette. He rises tall and
   grave rather than stooping like Aegyptius, and leans on a tall counselor's
   staff at his left side.

   EXPRESSIVENESS: the hero rig reads POSTURE + ARM channels (spineLean,
   headPitch, armR*, shoulderLift) ONLY from the composed POSE; the scene overlay
   drives the FACE (brows, eyes, jaw, mouth). The rising-and-admonishing raised
   hand, the grave lifted chin, the lowered weighing hand — each needs spine +
   head + arm authored TOGETHER. So Echeneus ships bespoke poses into the shared
   POSE registry (the same module instance the hero figure reads) so the card and
   every state actually EMOTE. */
import { makeFigure } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Echeneus poses: spine + head + staff-grip + gesture together ----
   Convention (mirrors nestor/aegyptius): the LEFT arm hangs near-vertical to
   clutch the staff (hands[0]="fist"); the RIGHT arm does the counselling. He
   stands ESSENTIALLY UPRIGHT (only a small forward lean of address) — his age
   reads in the white mane and the slow authority, not a stoop. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "echeneus", n, opt }; };

// THE CARD — RISING: the beat the prompt asks for. The eldest counselor comes to
// his feet and lifts a single admonishing finger high — "this is not well done,
// king." Chin raised in grave authority, chest a touch open, upright as he can
// still manage, the staff-hand steadying him. Face is driven by the overlay to a
// grave, knit-browed correction with the mouth just parting to speak.
P("ech_rising", {
  spineLean:-.10, headPitch:-.08, neckPitch:-.05, headY:-.03,
  bodyYaw:-.13, headYaw:.12, chestOpen:.18,
  armLUpper:.15, armLLower:-.06, handRotL:.05,             // left hand down, clutching the staff
  armRUpper:-2.34, armRLower:.30, handRotR:.10, shoulderLiftR:.58,  // right arm raised HIGH, admonishing finger
  hipL:.04, kneeL:.10, hipR:-.03, kneeR:.12, rootScale:1.0,
}, { hands:["fist","point"] });

// ADVISING — mid-correction, the raised finger has come forward and OPENED into a
// measured, instructing palm as he lays out what must be done (lift him, seat him,
// pour the wine). The lean deepens toward the king, chest opens, jaw driven OPEN
// by the overlay on this state.
P("ech_advising", {
  spineLean:-.20, headPitch:.02, neckPitch:.0, chestOpen:.40,
  bodyYaw:-.12, headYaw:-.06,
  armLUpper:.15, armLLower:-.06,
  armRUpper:-1.24, armRLower:.44, shoulderLiftR:.22,        // hand out to the king, instructing
  hipL:.04, kneeL:.10, hipR:-.03, kneeR:.12, rootScale:1.01,
}, { hands:["fist","open_palm"] });

// GRAVE — before he speaks, weighing the broken silence: upright and still, chin
// level, the free hand lowered and half-closed, head barely inclined. The sober
// counterweight to the raised admonition. Face driven to a knit, level gravity.
P("ech_grave", {
  spineLean:-.04, headPitch:.10, neckPitch:.05, headRoll:.04,
  bodyYaw:-.10, headYaw:-.06,
  armLUpper:.15, armLLower:-.06,
  armRUpper:-.52, armRLower:.30, shoulderLiftR:.06,         // free hand rests low
  hipL:.04, kneeL:.09, hipR:-.03, kneeR:.11, rootScale:.99,
}, { hands:["fist","relaxed"] });

// WELCOME — the correction resolved into hospitality: the free hand turns palm-up
// and opens toward the hearth, offering the guest his due place. Brows ease, a
// grave warmth. Xenia restored. hand palm-up in an offering.
P("ech_welcome", {
  spineLean:-.10, headPitch:-.02, neckPitch:0, chestOpen:.30,
  bodyYaw:-.10, headYaw:-.10, headRoll:.06,
  armLUpper:.15, armLLower:-.06,
  armRUpper:-.86, armRLower:.80, shoulderLiftR:.16,         // palm-up, offering the guest his seat
  hipL:.04, kneeL:.09, hipR:-.03, kneeR:.11, rootScale:1.0,
}, { hands:["fist","palm_up"] });

const params = {
  // the eldest man in the hall: weathered warm skin, and the WHITEST hair + full
  // patriarch's beard of any of the elders — light enough to read as truly white
  // against his dark mantle, dark enough that the mane + beard still carry real
  // halftone mass and don't dissolve.
  skin:"#d4c4a6", hairColor:"#9a958a",
  hair:"curly", beard:true, glasses:false,
  // DISTINCT DRESS: a heavy dark Phaeacian ceremonial MANTLE (cloak garment) +
  // the drape flag for the mantle fall behind the shoulder.
  garment:"cloak", cloak:true, bareLegs:false, scale:1.0,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.echeneus",
  type:"CHARACTER",
  name:"Echeneus",
  statusWord:"ADMONISHING",
  scene:"OD-B07-S03",

  params,
  layers:["shadow","staff-back","hair-back","legs","torso","mantle","far-arm","neck","head","face","hair-front","beard","near-arm","staff"],
  // normalized 0..1 anchors for scene attachment / gaze / props / staff
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.21},
    rightHand:{x:.70,y:.30}, leftHand:{x:.34,y:.62},
    staffGrip:{x:.33,y:.42}, staffTop:{x:.32,y:.22}, staffFoot:{x:.31,y:.93},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
    king:{x:.16,y:.44}, hearth:{x:.20,y:.62},
  },
  states:{
    initial:"rising",
    nodes:{
      // THE beat / signature — rising to break the silence with the admonishing
      // raised finger, grave and knit-browed, mouth just parting.
      rising:   { preview:{ pose:"ech_rising", browKnit:.42, browUp:.28, frown:.10,
                            eyeNarrow:.18, jaw:.16, gaze:{x:.14,y:-.06}, status:"ADMONISHING" } },
      // OD-B07-S03 mid-speech — laying out the hospitality correction, arm out,
      // jaw open, brows lifted and knit in instruction.
      advising: { preview:{ pose:"ech_advising", browUp:.34, browKnit:.30, jaw:.52,
                            eyeNarrow:.10, gaze:{x:-.12,y:.02}, status:"ADVISING" } },
      // weighing the broken silence before he speaks — level, sober, still.
      grave:    { preview:{ pose:"ech_grave", browKnit:.46, browUp:.16, frown:.18,
                            eyeNarrow:.26, gaze:{x:-.06,y:.10}, status:"GRAVE" } },
      // the correction resolved into welcome — hospitality restored, palm-up.
      welcome:  { preview:{ pose:"ech_welcome", browUp:.40, browKnit:.08, smile:.14,
                            eyeWide:.10, gaze:{x:-.16,y:.04}, status:"WELCOMING" } },
      // stable-identity turns
      profile:  { preview:{ pose:"profile_left" } },
      back:     { preview:{ pose:"back_view" } },
    },
    edges:[
      ["grave","rising"],["rising","advising"],["advising","welcome"],
      ["welcome","grave"],["advising","rising"],["rising","profile"],
      ["rising","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — ADMONISHING: the eldest counselor risen to his feet,
  // one admonishing finger lifted high, chin raised in grave authority, brows
  // knit under lifted inner ends, eyes steady and narrowed, mouth just parting to
  // correct the king — the staff steadying him at his left. The rising posture,
  // staff-grip and raised arm all live in the pose so the overlay can't flatten
  // them.
  preview:()=>({ pose:"ech_rising",
                 browKnit:.42, browUp:.28, frown:.10, eyeNarrow:.18, jaw:.16,
                 gaze:{x:.14,y:-.06}, t:0.4, status:"ADMONISHING", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, facial, t
    const out = fig.draw(ctx, W, H, state);

    // ---- staff: a tall counselor's staff held at his left side, drawn in solid
    // grays + hard contour so the engine POST pass halftones it with the rest.
    // Anchored to the reported left-hand position when available; planted just
    // OUTSIDE the hand so the pole clears the arm mass and reads as its own
    // vertical. Rises to about chest height (an elder's staff, not a spear). ----
    try {
      const a = out && out.anchors;
      const lh = a && a.leftHand;
      const gx = (lh ? lh.x : .34) * W - W*.048;
      const gy = (lh ? lh.y : .60) * H;
      const topY = gy - H*.22;                 // rises to about chest/neck height
      const footY = H*.925;                     // plants near the ground line
      const lean = W*.012;                      // a slight lean, foot tucked inward
      ctx.save();
      ctx.lineCap="round"; ctx.lineJoin="round";
      // contour underlay
      ctx.strokeStyle="#141414"; ctx.lineWidth=W*.030;
      ctx.beginPath(); ctx.moveTo(gx, topY); ctx.lineTo(gx+lean, footY); ctx.stroke();
      // wood fill
      ctx.strokeStyle="#6b6b64"; ctx.lineWidth=W*.016;
      ctx.beginPath(); ctx.moveTo(gx, topY); ctx.lineTo(gx+lean, footY); ctx.stroke();
      // knobbed head of the staff
      ctx.fillStyle="#6b6b64"; ctx.strokeStyle="#141414"; ctx.lineWidth=W*.010;
      ctx.beginPath(); ctx.ellipse(gx, topY, W*.024, W*.028, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // a couple of grain nicks down the shaft
      ctx.strokeStyle="#141414"; ctx.lineWidth=2.2;
      for(let i=1;i<=3;i++){ const t=i/4, x=gx+lean*t, y=topY+(footY-topY)*t;
        ctx.beginPath(); ctx.moveTo(x-W*.006, y); ctx.lineTo(x+W*.008, y+H*.010); ctx.stroke(); }
      ctx.restore();
    } catch(e){ /* staff is decorative; never block the figure render */ }
    return out;
  },
};
export default asset;
