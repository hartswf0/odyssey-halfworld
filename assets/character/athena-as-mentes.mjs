/* character.athena-as-mentes — Athena walking Ithaca in disguise.
   A DISGUISE variant of character.athena: the goddess wears the body of
   MENTES, a bearded Taphian sea-captain in a traveler's cloak, a bronze
   spear in his hand. The mortal shell is complete — weathered sailor's
   skin, dark seafarer's beard, a heavy hooded cloak — but one tell leaks
   through: the eyes stay unnaturally BRIGHT, a divine glint that never
   quite belongs to a mortal captain. That bright-eye cue is the continuity
   thread back to character.athena (Homer's grey-eyed / flashing-eyed goddess).
   Atlas: Book I hall of Ithaca — the visitor who sets Telemachus in motion. */
import { makeFigure, INK, ACCENT } from "/engine/halfworld-engine.mjs";

// MENTES shell: tanned, sea-weathered captain. Distinct from Odysseus'
// warmer tunic look — darker seafarer's beard, a full traveler's cloak,
// staff/spear in hand, upright composed bearing.
const params = {
  skin:"#c7a982", hairColor:"#20180f",
  hair:"short", beard:true, glasses:false,
  garment:"cloak", cloak:true, bareLegs:true, scale:1.0,
};

const fig = makeFigure(params);

// --- the bronze traveler's spear MENTES leans on / gestures with ---
// Drawn in SOLID grays + hard contour ONLY (the engine POST pass dithers).
function drawSpear(ctx, W, H){
  const x = W*0.325;                 // rests along the figure's near (viewer-left) side
  const topY = H*0.085, buttY = H*0.935;
  // shaft
  ctx.strokeStyle = INK; ctx.lineCap="round";
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x, topY+H*0.055); ctx.lineTo(x, buttY); ctx.stroke();
  ctx.strokeStyle = "#7a7a72"; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(x, topY+H*0.055); ctx.lineTo(x, buttY); ctx.stroke();
  // socket collar
  ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x-9, topY+H*0.06); ctx.lineTo(x+9, topY+H*0.06); ctx.stroke();
  // leaf-shaped bronze spearhead
  ctx.beginPath();
  ctx.moveTo(x, topY);
  ctx.quadraticCurveTo(x+14, topY+H*0.03, x, topY+H*0.06);
  ctx.quadraticCurveTo(x-14, topY+H*0.03, x, topY);
  ctx.closePath();
  ctx.fillStyle = "#565651"; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke();
  // midrib
  ctx.strokeStyle = INK; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, topY+H*0.006); ctx.lineTo(x, topY+H*0.052); ctx.stroke();
}

// --- the divine tell: bright, over-lit eyes that outlast the disguise ---
// Uses the figure's reported head anchor so it tracks pose/band.
function drawBrightEyes(ctx, W, H, anchors, state){
  if (!anchors || !anchors.head) return;
  const hx = anchors.head.x * W, hy = anchors.head.y * H;
  const R = Math.min(H*0.9, W*1.26) * (params.scale||1) * 0.105; // mirrors rig headR
  const eyeY = hy - R*0.12;
  const dx = R*0.36;
  const gz = state && state.gaze ? state.gaze : {x:0,y:0};
  const profile = /profile/.test(state && (state.pose||state.band) || "");
  const eyes = profile ? [1] : [-1,1];
  for (const es of eyes){
    const ex = hx + es*dx;
    // a small over-bright catchlight — the goddess showing through
    ctx.fillStyle = "#fbfbf7";
    ctx.beginPath(); ctx.arc(ex - R*0.05 + gz.x*R*0.06, eyeY - R*0.05, R*0.06, 0, 7); ctx.fill();
  }
}

export const asset = {
  id:"character.athena-as-mentes",
  type:"CHARACTER",
  name:"Athena as Mentes",
  statusWord:"DISGUISED",
  scene:"OD-B01-S03",

  params,
  layers:["shadow","spear","hair-back","legs","torso","far-arm","cloak","neck","head","face","beard","hair-front","near-arm","bright-eyes"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.20}, crown:{x:.50,y:.12}, eyes:{x:.50,y:.21},
    rightHand:{x:.66,y:.60}, leftHand:{x:.34,y:.60},
    spearGrip:{x:.325,y:.58}, spearHead:{x:.325,y:.10},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // OD-B01-S03 — composed traveler concealing divine identity.
      // At rest but never blank: measured, faintly amused, eyes a touch
      // narrowed as if reading the room. Left hand on the spear.
      neutral:   { preview:{ pose:"three_quarter_left", gaze:{x:-.1,y:0},
                             smile:.12, browUp:.08, eyeNarrow:.14 } },
      // the wry knowing look — a fingers-to-chin skeptic's tilt, mouth
      // skewed, the goddess quietly appraising the boy. (spear leans free)
      composed:  { preview:{ pose:"skepticism", gaze:{x:-.18,y:.02},
                             smile:.14, mouthAsym:.55, browKnit:.34,
                             browUp:.14, eyeNarrow:.4 } },
      // OD-B01-S04 — probing: leans in, brows lift/knit on a question,
      // mouth open mid-word, eyes widening with interest.
      probing:   { preview:{ pose:"lean_forward", gaze:{x:.24,y:-.06},
                             jaw:.34, browUp:.34, browKnit:.22, eyeWide:.2 } },
      // reassuring: reaches an open hand, a warm full smile (creases fire),
      // brows up, lips parted gently — sympathy for Telemachus.
      reassuring:{ preview:{ pose:"reach_forward", gaze:{x:.12,y:.06},
                             smile:.6, jaw:.18, browUp:.36, eyeNarrow:.12 } },
      // OD-B01-S05 — SIGNATURE counsel: composed, measured OPEN-HAND
      // speaking gesture; lips parted on a word, a calm knowing half-smile,
      // steady level gaze on the listener. This is the card.
      counsel:   { preview:{ pose:"offering_hand", gaze:{x:.14,y:0},
                             smile:.2, mouthAsym:.3, jaw:.24,
                             browUp:.14, eyeNarrow:.18 } },
      // command: the counsel hardens — pointing arm, knit brows, narrowed
      // eyes, a firm open mouth. Sympathy becomes an order.
      command:   { preview:{ pose:"pointing_arm", gaze:{x:-.5,y:-.05},
                             jaw:.5, frown:.28, browKnit:.6, eyeNarrow:.32 } },
    },
    edges:[
      ["neutral","composed"],["neutral","probing"],
      ["probing","reassuring"],["reassuring","counsel"],
      ["counsel","command"],["command","neutral"],
    ],
  },
  channels:["gaze","mouth","smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","breath","pose","stance","band"],

  // SIGNATURE = counsel: a disguised traveler mid-counsel, open right hand
  // measuring out a phrase, calm knowing face, spear still in the left hand.
  preview:()=>({ pose:"offering_hand", gaze:{x:.14,y:0},
                 smile:.2, mouthAsym:.3, jaw:.24, browUp:.14, eyeNarrow:.18,
                 t:0.4, status:"DISGUISED", progress:.24 }),

  draw(ctx, W, H, state={}){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    // spear sits behind the near arm so the hand reads as gripping it
    drawSpear(ctx, W, H);
    const out = fig.draw(ctx, W, H, state) || {};
    // the divine tell, painted last so the bright eyes survive the shell
    drawBrightEyes(ctx, W, H, out.anchors, state);
    return out;
  },
};
export default asset;
