export const meta = {
  name: 'refine-odyssey-characters',
  description: 'Loop each Book-1 character to the expressiveness standard: signature emotive pose + face (nose/mouth/brows) + arms, verified across states',
  phases: [ { title: 'Refine', detail: 'per-character: set expressive preview + states, render 3 emotions, read, revise' } ],
};
const ROOT = '/Users/gaia/Downloads/odyssey-halfworld';
const A = typeof args === 'string' ? JSON.parse(args) : (args || {});
const chars = A.chars || [];

const RESULT = {
  type:'object', additionalProperties:false,
  required:['id','ok','iterations','selfAssessment'],
  properties:{
    id:{type:'string'}, ok:{type:'boolean'}, iterations:{type:'integer'},
    signaturePose:{type:'string'},
    selfAssessment:{type:'string', description:'how the face (nose/mouth/brows) + arms read across the 3 states'},
  },
};

function prompt(c){
  const slug = c.id.split('.')[1];
  const path = `assets/character/${slug}.mjs`;
  const png = `renders/character__${slug}.png`;
  return `Refine ONE Odyssey character to a higher EXPRESSIVENESS standard. The engine face was just upgraded (real nose with nostrils, articulated lips that open to teeth, brows that knit/raise, nasolabial creases). Your job: make THIS character visibly EMOTE — face (nose, mouth, brows, eyes) AND arms/pose — on its card and across its states. A neutral arms-hanging card is NOT acceptable.

WORKSPACE ROOT (cd here): ${ROOT}
CHARACTER: ${c.id} — ${c.name}
SIGNATURE EMOTION for the card: ${c.emotion}  (its mood word / dramatic beat)

READ FIRST:
  1. ${ROOT}/${path}                          (the current module — you EDIT this)
  2. ${ROOT}/engine/figure-hero.mjs           (POSES list, POSE_ALIAS, and the face channels the draw reads: smile, frown, browUp, browKnit, eyeWide, eyeNarrow, jaw, gaze, mouthAsym)
  3. ${ROOT}/renders/character__${slug}.png    (current render — see what needs to change)

WHAT TO CHANGE in ${path}:
  - preview() must return an EXPRESSIVE signature: a characterful POSE (e.g. torso_open, pointing_arm, one_arm_raised, lean_forward, grief, confrontation, skepticism, enthusiasm, reach_forward, offering_hand, head_lowered) that gestures with the ARMS + facial channels that match ${c.emotion} (set some of smile/frown/browUp/browKnit/eyeWide/eyeNarrow/jaw/mouth/gaze). Keep the character's identity params (skin/hair/beard/garment/props).
  - states.nodes: ensure at least 3 states carry DISTINCT facial expressions + poses (e.g. a calm one, a speaking/gesturing one with jaw open, and the signature emotion). Each node's preview should set the relevant face channels, not just a pose name.
  - Keep it valid against the contract (still exports \`asset\`, draw passes state through — most modules already do; add mouth/gaze passthrough in draw if missing).

THE LOOP (verify against real pixels — this is the point):
  1. Edit ${path}.
  2. Render the card:   cd ${ROOT} && node harness/render.mjs ${path} --pipeline MESH
  3. Render 2 more states:  node harness/render.mjs ${path} --pipeline MESH --state <stateName>   (for two of your states.nodes)
  4. READ each produced PNG (${ROOT}/${png} and the per-state PNGs renders/character__${slug}__<state>.png). Check: does the NOSE read? do the LIPS/mouth show the emotion (open when speaking, curve when smiling/frowning)? do the BROWS knit/raise? do the ARMS gesture (not just hang)? is it distinctly ${c.name}?
  5. Revise and repeat, UP TO 4 iterations, until the card clearly emotes (${c.emotion}) with an expressive face AND gesturing arms, and the extra states look distinct.

Return the structured result: id, ok (true only if the final card emotes with expressive face + arms), iterations, signaturePose, selfAssessment.`;
}

phase('Refine');
log(`Refining ${chars.length} characters to the expressiveness standard.`);
const results = await parallel(chars.map(c => () =>
  agent(prompt(c), { label:`refine:${c.id}`, phase:'Refine', schema: RESULT })
));
return { results: results.filter(Boolean), ok: results.filter(Boolean).filter(r=>r.ok).length, total: chars.length };
