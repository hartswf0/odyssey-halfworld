/* character.ctesippus — the suitor who makes cruelty into a joke.
   CHARACTER asset. Ctesippus of Same, "a man who trusted enormously to his
   wealth": the suitor who stands up at the meal, announces that the beggar
   shall have his guest-gift like everybody else — and throws an ox hoof at
   his head. The horror of him is not rage; it is wit. He performs the whole
   ritual of hospitality correctly — the rise, the address to the company,
   the formal bestowal — and then inverts the object inside it. So the body
   is built as a HOST'S body used wrong: ceremonial squareness, both palms
   presented, chin up for the room's laugh, and a throwing arm cocked behind
   the head at the exact moment the ceremony should have handed something
   over.

   Kept in family with the other suitors (antinous, amphinomus, eurymachus):
   the identity lives in the spec and the pose channels — ZERO hand-drawn
   overpaint — so he holds together across front, three-quarter, profile and
   back, and across every band a scene asks for.
   Atlas: OD-B20-S04 — the ox hoof thrown as a guest-gift. */
import { makeFigure, HERO_POSES } from "../../engine/halfworld-engine.mjs";

/* ---- bespoke poses, registered additively onto the shared rig table ----
   Antinous jabs, Amphinomus hedges, Ctesippus PERFORMS. Every pose below
   keeps the shoulders open to the room rather than to his target: he is
   always playing to an audience, never simply attacking. */

/* THE SIGNATURE — the guest-gift hurl. The ritual and the assault in one
   body: shoulders still squared to the company, chin up, mouth open on the
   laugh, while the right arm is cocked back over the shoulder with the hoof
   and the left hand points out the man it is aimed at. */
HERO_POSES.guest_gift_hurl = {
  id:"guest_gift_hurl", label:"guest-gift hurl", group:"emotion",
  n:{ bodyYaw:-.30, spineLean:-.20, spineTwist:.55, chestOpen:.62, rootScale:1.05,
      shoulderTilt:-.20, shoulderLiftR:.62,
      armRUpper:-1.98, armRLower:-1.10, handRotR:.34,
      armLUpper:1.26, armLLower:-.44, handRotL:-.30,
      headYaw:-.30, headPitch:-.16, headRoll:-.10,
      gazeX:-.55, gazeY:-.10,
      browUp:.46, browKnit:.30, eyeNarrow:.30, smile:.66, jaw:.28, mouthAsym:.48,
      weightShift:.35, pelvisX:.18, hipL:.20, kneeL:.22, hipR:-.16 },
  opt:{ hands:["point","fist"] },
};

/* Ritual inversion — the bestowal itself. Perfectly correct host geometry:
   square to the room, both palms up and forward at chest height, head
   lifted, a broad public smile. Only the thing in the hands is wrong. */
HERO_POSES.mock_bestowal = {
  id:"mock_bestowal", label:"mock bestowal", group:"hands",
  n:{ bodyYaw:.10, spineLean:-.10, chestOpen:.72, rootScale:1.03,
      armRUpper:-.86, armRLower:1.24, handRotR:.34, shoulderLiftR:.22,
      armLUpper:.86, armLLower:-1.24, handRotL:-.34, shoulderLiftL:.22,
      headPitch:-.20, headYaw:.10, gazeX:.16, gazeY:-.24,
      browUp:.58, smile:.62, jaw:.26, cheek:.30 },
  opt:{ hands:["offering","offering"] },
};

/* The appeal to the room — the beat AFTER the joke, when he turns away from
   the man he hurt to collect the laugh. Half-turned from his target, one
   palm thrown open to his fellows, head tipped back, shoulders up. */
HERO_POSES.wit_appeal = {
  id:"wit_appeal", label:"appeal for the laugh", group:"emotion",
  n:{ bodyYaw:.52, spineLean:.16, chestOpen:.55, rootScale:1.02,
      armRUpper:.62, armRLower:1.10, handRotR:.30, shoulderLiftR:.42,
      armLUpper:1.26, armLLower:-.34, handRotL:-.30, shoulderLiftL:.30,
      headYaw:.40, headPitch:.16, headRoll:.14, gazeX:.52, gazeY:-.16,
      browUp:.66, eyeNarrow:.52, smile:1, jaw:.62, cheek:.55 },
  opt:{ hands:["open_palm","palm_up"], action:"laugh" },
};

/* Wealth at rest — the lounging owner's stance he holds through the meal:
   weight cocked on one hip, cup hand low, the other hand loose, a small
   permanent private amusement in the face. */
HERO_POSES.moneyed_lounge = {
  id:"moneyed_lounge", label:"moneyed lounge", group:"torso",
  n:{ bodyYaw:-.44, spineLean:.20, rootScale:1.02,
      weightShift:.85, pelvisX:.30, pelvisRot:.09, hipL:.22, hipR:-.06, kneeL:.10,
      armRUpper:-.34, armRLower:.54, handRotR:.18,
      armLUpper:-.42, armLLower:-.86, handRotL:-.20,
      headYaw:-.22, headPitch:-.10, headRoll:.12, gazeX:-.34, gazeY:-.12,
      browUp:.22, eyeNarrow:.34, mouthAsym:.62, smile:.24 },
  opt:{ hands:["relaxed","relaxed"] },
};

/* Checked — Telemachus's spear-threat lands and the wit has nowhere to go.
   The performing shoulders drop, the hands come down and in, the smile is
   still on the face a half second after it stopped being funny. */
HERO_POSES.checked_wit = {
  id:"checked_wit", label:"checked wit", group:"emotion",
  n:{ bodyYaw:.24, spineLean:.26, rootScale:.98,
      shoulderLiftL:.18, shoulderLiftR:.18,
      armRUpper:.30, armRLower:1.02, handRotR:.22,
      armLUpper:-.36, armLLower:-.94, handRotL:-.22,
      headPitch:.10, headYaw:-.14, gazeX:-.36, gazeY:-.06,
      browUp:.74, browKnit:.30, eyeWide:.44, smile:.28, mouthAsym:.40, jaw:.14 },
  opt:{ hands:["relaxed","relaxed"] },
};

const params = {
  // wealthy, well-fed, clean-shaven: reads light against the two bearded
  // suitors he shares the hall with, and keeps plenty of paper in the face
  skin:"#dcc9ad", hairColor:"#241a12",
  hair:"curly", beard:false, glasses:false,
  garment:"tunic", cloak:true, bareLegs:true, scale:1.05,
};

const fig = makeFigure(params);

export const asset = {
  id:"character.ctesippus",
  type:"CHARACTER",
  name:"Ctesippus",
  statusWord:"MOCKING",
  scene:"OD-B20-S04",

  params,
  layers:["shadow","cloak","hair-back","legs","torso","far-arm","neck","head",
          "face","hair-front","near-arm","held-gift"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.11}, eyes:{x:.50,y:.20},
    rightHand:{x:.66,y:.34}, leftHand:{x:.26,y:.42},
    hoofGrip:{x:.66,y:.31},     // the ox hoof rides in the cocked throwing hand
    releasePoint:{x:.78,y:.26}, // where prop.ox-hoof leaves him on the throw
    bestowal:{x:.50,y:.50},     // both palms, the parody of the gift
    cupGrip:{x:.34,y:.62},
    hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"neutral",
    nodes:{
      // baseline — the owner at the meal, weight cocked, privately amused
      neutral:  { preview:{ pose:"moneyed_lounge", gaze:{x:-.34,y:-.12},
                            browUp:.22, eyeNarrow:.34, mouthAsym:.62, t:0.5 } },
      // "let the stranger have his guest-gift too" — addressing the company
      speaking: { preview:{ pose:"mock_bestowal", jaw:.54, browUp:.58,
                            smile:.55, gaze:{x:.16,y:-.22}, t:0.5 } },
      // RITUAL INVERSION — the formal bestowal, both palms presented
      bestowing:{ preview:{ pose:"mock_bestowal", browUp:.58, smile:.62,
                            jaw:.26, cheek:.30, gaze:{x:.16,y:-.24}, t:0.5 } },
      // THE SIGNATURE — the hoof cocked behind the head, the target pointed
      // out with the other hand, the laugh already open in the mouth
      hurling:  { preview:{ pose:"guest_gift_hurl", browUp:.46, browKnit:.30,
                            eyeNarrow:.30, smile:.66, jaw:.28, mouthAsym:.48,
                            gaze:{x:-.55,y:-.10}, t:0.5 } },
      // he turns from the man he hit to collect the room's laughter
      mocking:  { preview:{ pose:"wit_appeal", browUp:.66, eyeNarrow:.52,
                            smile:1, jaw:.62, gaze:{x:.52,y:-.16}, t:0.5 } },
      // Telemachus promises the spear: the smile outlives the joke
      checked:  { preview:{ pose:"checked_wit", browUp:.74, browKnit:.30,
                            eyeWide:.44, smile:.28, gaze:{x:-.36,y:-.06},
                            blink:.15, t:0.5 } },
      // and when the hall finally turns, the wit is a body like any other
      alarmed:  { preview:{ pose:"protective_block", browUp:.62, browKnit:.48,
                            eyeWide:.62, jaw:.50, smile:0,
                            gaze:{x:-.30,y:-.05}, t:0.5 } },
    },
    edges:[
      ["neutral","speaking"],["speaking","bestowing"],["bestowing","hurling"],
      ["hurling","mocking"],["mocking","checked"],["checked","neutral"],
      ["neutral","hurling"],["checked","alarmed"],["mocking","alarmed"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw",
            "mouthAsym","cheek"],

  // CARD SIGNATURE — MOCKING: the guest-gift hurl. Shoulders still squared to
  // the company like a host mid-ceremony, chin up, mouth open on his own joke,
  // the ox hoof cocked back over the shoulder and the free hand pointing out
  // the head it is meant for.
  preview:()=>({ pose:"guest_gift_hurl",
                 browUp:.46, browKnit:.30, eyeNarrow:.30,
                 smile:.66, jaw:.28, mouthAsym:.48,
                 gaze:{x:-.55,y:-.10}, t:0.5, status:"MOCKING", progress:.45 }),

  draw(ctx, W, H, state){
    // band can be driven by scene ("front"|"threeq"|"profile"|"back")
    if (state && state.band) fig.spec.band = state.band;
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
