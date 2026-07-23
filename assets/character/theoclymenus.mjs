/* character.theoclymenus — the fugitive noble seer taken aboard at Pylos.
   CHARACTER asset. Not an elder like Halitherses but a lean, alert man of
   RANK on the run: a bloodguilt exile of the Melampus prophetic line, fine
   robe + cloak gone travel-worn, intense far-seeing eyes, a seer's bearing.
   Built on the HALFTRACK hero rig with stable identity across
   front/three-quarter/profile/back; face, gaze, mouth, hands and every joint
   stay exposed so scenes can drive him.

   Scene function:
     OD-B15-S03  an alert fugitive seer carrying URGENCY, social RANK and
                 omen-sensitivity — supplicating passage aboard, a hand lifted
                 reading the sky, a tense prophetic face.
     OD-B15-S05  the seer translating a hawk plucking a dove (predator + prey)
                 into dynastic PREDICTION — arm thrust to trace the omen, jaw
                 open declaiming the reign of Odysseus' line.

   EXPRESSIVENESS: the hero rig reads facial channels (browUp, browKnit,
   eyeWide, eyeNarrow, frown, jaw, mouthAsym) from the composed POSE, and the
   scene-state overlay can only smile or draw a frown-line — never the tense,
   urgent upward stare of a fugitive reading an omen, nor an open declaiming
   mouth. So Theoclymenus ships bespoke poses into the shared POSE registry,
   each fusing a raised/knit brow + a strained gaze + a reading/pointing arm.
   That is what makes the card EMOTE as a seer, not a mannequin. */
import { makeFigure } from "../../engine/halfworld-engine.mjs";
import { POSES } from "../../engine/figure-hero.mjs";

/* ---- bespoke Theoclymenus poses: brow + gaze + arm authored together ----
   Registered into the shared rig registry (same module instance the hero
   figure reads), so preview()/states name them like any built-in pose.
   Convention reminders: negative headPitch + negative gazeY = eyes cast UP;
   armRUpper near -2.4 raises the RIGHT arm skyward; point hand = one finger.
   Distinct from Halitherses' calm elder augury: leaner build, urgent forward
   lean, brows raised AND knit (alarm/tension), lips parted on a caught breath. */
const P = (id, n, opt = {}) => { POSES[id] = { id, label: id, group: "theoclymenus", n, opt }; };

// THE CARD — reading the sky as a supplicant: right arm lifted, index finger
// tracing the omen, chin up, brows RAISED HIGH yet KNIT at the inner ends
// (concentration shot through with a fugitive's dread), eyes WIDE and strained
// up-and-out, lips just parted on a held breath. Urgent, not serene. A slight
// forward lean and lifted stature carry both the running man and his rank.
P("theo_omen", {
  browUp:.58, browKnit:.32, eyeWide:.52, eyeNarrow:0, frown:.10, jaw:.30,
  headPitch:-.30, neckPitch:-.16, headRoll:.05,
  gazeX:.24, gazeY:-.70,                        // eyes fixed UP on the sign in the sky
  spineLean:-.16, bodyYaw:-.10, headYaw:.16,    // leaning in, turned toward his hand
  armRUpper:-2.40, armRLower:.22, shoulderLiftR:.58,   // right arm raised, reading
  armLUpper:.20, armLLower:-.28,                // left arm tense at his side
  rootScale:1.03,
}, { hands:["relaxed","point"] });

// supplicating passage — the fugitive's plea at the ship: torso bowed a touch,
// both hands offered forward and open, brows lifted in appeal, eyes wide and
// searching the captain's face, lips parted mid-entreaty. Rank held even while
// begging: the head stays up, the gaze level and direct.
P("theo_supplicate", {
  browUp:.54, browKnit:.22, eyeWide:.40, jaw:.22, frown:.06,
  headPitch:.06, spineLean:-.18, bodyYaw:.04, headYaw:-.04,
  gazeX:-.10, gazeY:.02,                        // leveled, meeting the eye he begs
  armLUpper:.72, armLLower:.30, armRUpper:-.72, armRLower:-.30,   // both hands out, offered
  shoulderLiftL:.24, shoulderLiftR:.24, rootScale:1.0,
}, { hands:["offering","offering"] });

// prophesying the dynasty — translating hawk-and-dove into rule: jaw OPEN
// declaiming, brows lifted AND knit in grave certainty, eyes narrowed and
// fixed on the omen he traces, chest thrown open with an orator's authority,
// right arm thrust forward, pointing hand pinning the sign in the air.
P("theo_prophesy", {
  browUp:.34, browKnit:.48, eyeNarrow:.30, frown:.10, mouthAsym:.14,
  jaw:.58,                                      // OPEN — speaking the prediction aloud
  spineLean:-.24, headPitch:-.04, chestOpen:.46,
  bodyYaw:-.12, headYaw:-.14, gazeX:-.34, gazeY:-.12,   // tracing the flight he reads
  armRUpper:-1.46, armRLower:.12, shoulderLiftR:.24,    // arm thrust out, pointing
  armLUpper:.26, armLLower:-.22, rootScale:1.05,
}, { hands:["relaxed","point"] });

// alert idle — the watchful fugitive at rest: three-quarter turn, brows
// slightly knit, eyes narrowed and far-seeing, mouth closed and set, weight
// ready to move. Rank in the straight spine, dread in the tight brow.
P("theo_alert", {
  browKnit:.26, browUp:.12, eyeNarrow:.30, jaw:0,
  bodyYaw:-.58, headYaw:-.30, gazeX:-.26, gazeY:-.06,
  spineLean:-.04, armLUpper:.18, armLLower:-.10,
  armRUpper:-.18, armRLower:.10,
}, { hands:["relaxed","relaxed"] });

const params = {
  skin:"#cbb695", hairColor:"#2a2318",   // warm, unweathered skin; DARK hair + trimmed beard = noble, NOT an elder
  hair:"short", beard:true, glasses:false,
  garment:"robe", cloak:true, bareLegs:false, scale:0.98,   // fine robe + travel cloak; leaner stature
};

const fig = makeFigure(params);

export const asset = {
  id:"character.theoclymenus",
  type:"CHARACTER",
  name:"Theoclymenus",
  statusWord:"OMEN-READING",
  scene:"OD-B15-S03",

  params,
  layers:["shadow","hair-back","legs","torso","robe","far-arm","neck","head","face","hair-front","beard","near-arm"],
  // normalized 0..1 anchors for scene attachment / gaze / props
  anchors:{
    head:{x:.50,y:.19}, crown:{x:.50,y:.10}, eyes:{x:.50,y:.20},
    rightHand:{x:.70,y:.28}, leftHand:{x:.34,y:.62},   // right hand lifted high by default
    skyRead:{x:.80,y:.10}, hip:{x:.50,y:.66}, feet:{x:.50,y:.94},
  },
  states:{
    initial:"omen",
    nodes:{
      // THE beat (S03) — hand lifted reading the sky, urgent tense augury
      omen:        { preview:{ pose:"theo_omen", gaze:{x:.24,y:-.70}, status:"OMEN-READING" } },
      // the fugitive's plea for passage — both hands offered, appealing
      supplicate:  { preview:{ pose:"theo_supplicate", gaze:{x:-.10,y:.02}, status:"SUPPLICANT" } },
      // (S05) declaiming the dynasty from hawk-and-dove — jaw open, arm forward
      prophesy:    { preview:{ pose:"theo_prophesy", gaze:{x:-.34,y:-.12}, status:"PROPHESYING" } },
      // watchful fugitive at rest
      alert:       { preview:{ pose:"theo_alert", gaze:{x:-.26,y:-.06}, status:"ALERT" } },
      // stable identity turns
      profile:     { preview:{ pose:"profile_left" } },
      back:        { preview:{ pose:"back_view" } },
    },
    edges:[
      ["alert","omen"],["omen","supplicate"],["supplicate","omen"],
      ["omen","prophesy"],["prophesy","omen"],["prophesy","alert"],
      ["alert","profile"],["alert","back"],
    ],
  },
  channels:["gaze","mouth","breath","pose","stance","band",
            "browUp","browKnit","eyeWide","eyeNarrow","jaw","frown","mouthAsym"],

  // EXPRESSIVE signature — OMEN-READING: chin lifted, brows raised AND knit in
  // a fugitive's straining concentration, eyes wide and cast UP after the sign,
  // one arm lifted with a reading finger, lips just parted. No `mouth` field —
  // the tense parted mouth and upward stare live in the pose so the scene
  // overlay can't flatten them.
  preview:()=>({ pose:"theo_omen", gaze:{x:.24,y:-.70}, t:0.4,
                 status:"OMEN-READING", progress:.22 }),

  draw(ctx, W, H, state){
    if (state && state.band) fig.spec.band = state.band;
    // pass the whole state through: pose, gaze, mouth, blink, t all reach the rig
    return fig.draw(ctx, W, H, state);
  },
};
export default asset;
