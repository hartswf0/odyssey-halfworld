/* character.mentor — the aged loyalist of Ithaca.
   CHARACTER asset. Scene function (OD-B02-S04): an old man rises in the
   assembly and speaks with MORAL FURY at the collective inaction of the
   Ithacans — a raised, indignant fist, a knit and thunderous brow, a mouth
   thrown open in reproach. Built on the HALFTRACK hero rig: a gray-bearded
   elder in a heavy robe and cloak, leaning on a wooden staff.

   EXPRESSIVENESS: like Zeus, the anger lives in BESPOKE POSES registered on
   the shared rig registry — each fuses a hard knit brow + an OPEN shouting
   jaw + a gesturing arm, because the scene-state mouth overlay alone can only
   bend a smile/frown line and never a furious open mouth. The staff is drawn
   BEHIND the figure so the near arm reads as gripping it. */
import { makeFigure, INK } from "/engine/halfworld-engine.mjs";
import { POSES } from "/engine/figure-hero.mjs";

/* ---- bespoke Mentor poses: brow + jaw + arm authored together ---- */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "mentor", n, opt }; };

// THE CARD — moral fury: brow driven hard down and knit, eyes narrowed and
// blazing, mouth flung wide in reproach, forward lean, RIGHT FIST raised high;
// the left hand keeps its grip on the staff at his side. Near-frontal so both
// brows and the open mouth read.
P("mentor_fury", {
  browKnit:.92, browUp:.10, eyeNarrow:.42, frown:.52, mouthAsym:.10,
  jaw:.64,                                   // OPEN — shouting the reproach
  spineLean:-.24, headPitch:-.08, chestOpen:.30,
  bodyYaw:-.08, headYaw:-.10, gazeX:-.22, gazeY:-.06,
  armRUpper:-2.66, armRLower:.14, shoulderLiftR:.72,   // right FIST flung up
  armLUpper:.16, armLLower:-.10,              // left grips the staff
  rootScale:1.03,
}, { hands:["fist","fist"] });

// pointing the finger of blame at the seated crowd — arm thrust forward,
// brow knit, mouth open mid-accusation. Turned slightly to address them.
P("mentor_pointing", {
  browKnit:.82, browUp:.06, eyeNarrow:.36, frown:.44, mouthAsym:.14,
  jaw:.52,
  spineLean:-.18, headYaw:-.16, bodyYaw:-.12, gazeX:-.42, gazeY:.02,
  armRUpper:-1.50, armRLower:.10,
  armLUpper:.16, armLLower:-.10,
  rootScale:1.02,
}, { hands:["fist","point"] });

// imploring appeal — brows lifted-AND-knit in grieved argument, mouth open,
// right palm turned up beseeching the assembly to act. The pleading register.
P("mentor_appeal", {
  browUp:.52, browKnit:.40, eyeWide:.18, frown:.30, jaw:.40,
  spineLean:-.10, headPitch:-.02, gazeX:.10, gazeY:-.04,
  armRUpper:-1.02, armRLower:.60,             // right hand offered, palm up
  armLUpper:.16, armLLower:-.10,
}, { hands:["fist","offering"] });

// grave settled counterpoint — the still elder leaning on his staff, brow
// only faintly furrowed, mouth closed and firm, level weary gaze.
P("mentor_grave", {
  browKnit:.22, browUp:.04, eyeNarrow:.22, frown:.14, jaw:0,
  headPitch:.05, gazeX:-.10, gazeY:.06,
  armLUpper:.18, armLLower:-.12, armRUpper:-.20, armRLower:.12,
}, { hands:["fist","relaxed"] });

const params = {
  skin:"#c9b598", hairColor:"#807c74",       // weathered skin; iron-gray hair + full gray beard (mid-tone mass, reads as an elder)
  hair:"short", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:1.02,
};

const fig = makeFigure(params);

/* ---- the staff: a gnarled wooden pole drawn BEHIND the figure so the near
   arm/hand overlaps it and reads as a grip. Solid mid-gray + hard ink contour;
   the engine POST pass supplies the halftone. ---- */
function drawStaff(ctx, W, H){
  const topX=W*0.305, topY=H*0.062, botX=W*0.300, botY=H*0.965;
  ctx.lineCap="round";
  ctx.strokeStyle=INK; ctx.lineWidth=W*0.040;               // ink underlay
  ctx.beginPath(); ctx.moveTo(topX,topY); ctx.lineTo(botX,botY); ctx.stroke();
  ctx.strokeStyle="#565049"; ctx.lineWidth=W*0.026;         // solid dark wood
  ctx.beginPath(); ctx.moveTo(topX,topY); ctx.lineTo(botX,botY); ctx.stroke();
  // gnarled knob at the head of the staff
  ctx.fillStyle="#5f584f"; ctx.strokeStyle=INK; ctx.lineWidth=4;
  ctx.beginPath(); ctx.arc(topX,topY,W*0.040,0,Math.PI*2); ctx.fill(); ctx.stroke();
}

export const asset = {
  id:"character.mentor",
  type:"CHARACTER",
  name:"Mentor",
  statusWord:"INDIGNANT",
  scene:"OD-B02-S04",

  params,
  layers:["shadow","staff","hair-back","legs","robe","torso","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.30}, leftHand:{x:.33,y:.60},
    staffGrip:{x:.33,y:.60}, staffTop:{x:.35,y:.08}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"fury",
    nodes:{
      // THE beat — moral fury at collective inaction: fist up, brow thunderous,
      // mouth thrown open in reproach
      fury:     { preview:{ pose:"mentor_fury", gaze:{x:-.22,y:-.06}, status:"INDIGNANT" } },
      // finger of blame leveled at the idle crowd
      pointing: { preview:{ pose:"mentor_pointing", gaze:{x:-.42,y:.02} } },
      // imploring the assembly to rouse itself — palm turned up, brows grieved
      appeal:   { preview:{ pose:"mentor_appeal", gaze:{x:.10,y:-.04} } },
      // grave settled elder, leaning on the staff — the still counterpoint
      grave:    { preview:{ pose:"mentor_grave", gaze:{x:-.10,y:.06} } },
      // stable identity turns
      profile:  { preview:{ pose:"profile_left" } },
      back:     { preview:{ pose:"back_view" } },
    },
    edges:[
      ["grave","fury"],["fury","pointing"],["pointing","appeal"],
      ["appeal","fury"],["fury","grave"],["grave","profile"],["grave","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym"],

  // EXPRESSIVE signature — INDIGNANT: raised fist, hard knit brow, narrowed
  // blazing eyes, mouth open in reproach, forward lean. No `mouth` field: the
  // open jaw + frown live in the pose so the overlay can't flatten them.
  preview:()=>({ pose:"mentor_fury", gaze:{x:-.22,y:-.06}, t:0.4,
                 status:"INDIGNANT", progress:.26 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    drawStaff(ctx, W, H);                    // behind the figure
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
