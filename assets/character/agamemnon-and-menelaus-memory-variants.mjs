/* character.agamemnon-and-menelaus-memory-variants — the two Atreid kings.
   A "memory variant" CHARACTER that draws BOTH royal brothers mid-quarrel:
   Agamemnon (left) commanding and enraged, Menelaus (right) contentious.
   Two bearded warrior-kings in armor and cloaks, arms flung in opposed
   confrontational gestures before a drunken army at sunset.
   Composes the hero rig TWICE, one figure per half of the card.
   Atlas scene: OD-B03-S03 — brothers arguing before a drunken army at sunset. */
import { makeFigure } from "/engine/halfworld-engine.mjs";

// Agamemnon — the elder, high king: taller, darker beard, heavier build.
const paramsAg = {
  skin:"#c9b394", hairColor:"#20180f",
  hair:"curly", beard:true, glasses:false,
  garment:"armor", cloak:true, bareLegs:true, scale:1.24,
};
// Menelaus — the younger brother: auburn/red hair (the fair-haired Atreid),
// a touch shorter, a leaner set. Distinct silhouette from Agamemnon.
const paramsMe = {
  skin:"#d3bd9c", hairColor:"#7a4526",
  hair:"short", beard:true, glasses:false,
  garment:"armor", cloak:true, bareLegs:true, scale:1.16,
};

const figAg = makeFigure(paramsAg);
const figMe = makeFigure(paramsMe);

// per-figure sub-states for each named node of the quarrel
const V = {
  // poised standoff — both turned in, brows already knit, the calm before
  neutral: {
    left:  { pose:"three_quarter_right", browKnit:.28, eyeNarrow:.15, frown:.18,
             gaze:{x:.4,y:0}, t:.5 },
    right: { pose:"three_quarter_left", browKnit:.24, eyeNarrow:.12, mouthAsym:.3,
             gaze:{x:-.4,y:0}, t:.5 },
  },
  // THE QUARREL — Agamemnon jabs a commanding fist, jaw open on a shout;
  // Menelaus flings an accusing point back, sneering, contentious.
  quarrel: {
    left:  { pose:"confrontation", jaw:.66, frown:.7, browKnit:.9, eyeNarrow:.4,
             gaze:{x:.5,y:-.02}, t:.5 },
    right: { pose:"pointing_arm", mirror:true, jaw:.52, frown:.55, browKnit:.72,
             eyeNarrow:.42, mouthAsym:.55, gaze:{x:-.55,y:-.02}, t:.5 },
  },
  // Agamemnon dominant — arm flung up in royal command, roaring;
  // Menelaus recoils, guarded, brows lifted in protest.
  agamemnonCommands: {
    left:  { pose:"one_arm_raised", jaw:.55, frown:.6, browKnit:.8, eyeWide:.15,
             gaze:{x:.4,y:-.05}, t:.5 },
    right: { pose:"guarded_withdrawal", mirror:true, browUp:.4, browKnit:.35,
             frown:.3, eyeWide:.2, gaze:{x:-.35,y:.05}, t:.5 },
  },
  // Menelaus contends — leans in accusing, both arms open in outrage;
  // Agamemnon folds arms, skeptical, jaw set, refusing.
  menelausContends: {
    left:  { pose:"arms_crossed", browKnit:.5, eyeNarrow:.4, frown:.4, mouthAsym:.4,
             gaze:{x:.5,y:.02}, t:.5 },
    right: { pose:"lean_forward", mirror:true, jaw:.4, frown:.5, browKnit:.65,
             eyeNarrow:.2, gaze:{x:-.5,y:0}, t:.5 },
  },
};

function drawPair(ctx, W, H, v){
  // left king occupies the left ~56% of the card, right king the right ~56%,
  // overlapping in the central gap where the gestures meet.
  ctx.save(); ctx.translate(-W*0.05, 0);
  figAg.draw(ctx, W*0.58, H, v.left);
  ctx.restore();
  ctx.save(); ctx.translate(W*0.47, 0);
  figMe.draw(ctx, W*0.58, H, v.right);
  ctx.restore();
}

export const asset = {
  id:"character.agamemnon-and-menelaus-memory-variants",
  type:"CHARACTER",
  name:"Agamemnon and Menelaus memory variants",
  statusWord:"QUARREL",
  scene:"OD-B03-S03",

  params:{ agamemnon:paramsAg, menelaus:paramsMe, figures:2 },
  layers:["shadow","hair-back","legs","torso","cloak","far-arm","neck","head",
          "face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors: each king's head + gesturing hand, and the
  // contested midpoint between them.
  anchors:{
    agamemnonHead:{x:.24,y:.20}, agamemnonHand:{x:.44,y:.52},
    menelausHead:{x:.74,y:.20}, menelausHand:{x:.56,y:.52},
    quarrelPoint:{x:.50,y:.50}, feet:{x:.50,y:.92},
  },
  states:{
    initial:"neutral",
    nodes:{
      neutral:          { preview:{ variant:"neutral" } },
      quarrel:          { preview:{ variant:"quarrel" } },
      agamemnonCommands:{ preview:{ variant:"agamemnonCommands" } },
      menelausContends: { preview:{ variant:"menelausContends" } },
    },
    edges:[["neutral","quarrel"],["quarrel","agamemnonCommands"],
           ["quarrel","menelausContends"],["agamemnonCommands","quarrel"],
           ["menelausContends","quarrel"],["quarrel","neutral"]],
  },
  channels:["variant","pose","gaze","mouth","jaw","browKnit","browUp",
            "frown","eyeNarrow","eyeWide","mouthAsym"],

  // CARD SIGNATURE — QUARREL: both Atreid kings mid-argument, Agamemnon's
  // commanding fist jabbing right, Menelaus's accusing point stabbing left,
  // both bearded, both roaring, opposed confrontational gestures across the gap.
  preview:()=>({ variant:"quarrel", status:"QUARREL", progress:.5 }),

  draw(ctx, W, H, state){
    const s = state || {};
    const v = V[s.variant] || V.quarrel;
    drawPair(ctx, W, H, v);
  },
};
export default asset;
