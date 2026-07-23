export const meta = {
  name: 'build-odyssey-book',
  description: 'Generate a book of Halfworld assets + scene compositions with a per-asset write→render→self-verify→revise loop',
  phases: [
    { title: 'Assets', detail: 'one agent per unique asset: write module, render headless, read PNG, revise to quality' },
    { title: 'Scenes', detail: 'one agent per scene: compose the timeline from registry assets, render a keyframe' },
  ],
};

const ROOT = '/Users/gaia/Downloads/odyssey-halfworld';

/* args may arrive as a JSON string or a parsed object — normalize. */
const A = typeof args === 'string' ? JSON.parse(args) : (args || {});
/* skip the alias split (ensemble.suitors == ensemble.the-suitors) */
const jobs = (A.jobs || []).filter(j => j.id !== 'ensemble.suitors');
const scenes = A.scenes || [];
log(`Loaded ${jobs.length} asset jobs + ${scenes.length} scenes.`);

const ASSET_RESULT = {
  type:'object', additionalProperties:false,
  required:['id','path','ok','iterations','selfAssessment'],
  properties:{
    id:{type:'string'},
    path:{type:'string', description:'project-relative path written'},
    ok:{type:'boolean', description:'validator passed AND the rendered PNG matches the reference aesthetic'},
    iterations:{type:'integer'},
    selfAssessment:{type:'string', description:'1-3 sentences: what it looks like now, any remaining weakness'},
    warnings:{type:'array', items:{type:'string'}},
  },
};
const SCENE_RESULT = {
  type:'object', additionalProperties:false,
  required:['id','path','ok','selfAssessment'],
  properties:{
    id:{type:'string'}, path:{type:'string'}, ok:{type:'boolean'},
    missingAssets:{type:'array', items:{type:'string'}},
    selfAssessment:{type:'string'},
  },
};

const AESTHETIC = `
THE LOOK (match these, they are the quality floor + the reference aesthetic):
- Warm off-white paper, HARD black structural contour, eight quantized ink levels, ordered-dot HALFTONE.
- Blocky, diagrammatic, procedural geometry. Crisp monochrome. NO gradients, painterly texture, photorealism, cinematic blur, or baked-in unrelated figures.
- Every asset renders as a "card": LABEL (top-left, letterspaced caps), blue mark (top-right), one STATUS word + meter (bottom-left). The engine draws the card for you.
- The dot-matrix texture is produced by the engine's POST pass — you draw in FLAT SOLID GRAYS + black contour into the offscreen ctx; DO NOT pre-dither or draw your own dots for shading.`;

const CONTRACT_RULES = `
CONTRACT (engine/asset-contract.mjs): export const asset = { id, type, name, statusWord, params, layers, anchors, states, channels, preview(), draw(ctx,W,H,state) } (also \`export default asset\`).
- id = "<type-slug>.<name-slug>" (already given). type = the exact atlas type. anchors are normalized 0..1.
- states = a small state machine { initial, nodes:{<name>:{preview:{...}}}, edges:[[a,b]] }; channels = animation channels the runtime can drive.
- preview() returns the neutral state (include status + progress for the card).
- draw() renders SOLID grays + contour into the offscreen ctx. Use engine primitives ONLY.
- MODULE IMPORTS MUST be server-root-absolute: import { ... } from "/engine/halfworld-engine.mjs"  (NOT relative paths, NOT node fs).`;

function assetPrompt(j){
  const isFigure = j.type === 'CHARACTER';   // creatures use custom geometry (may opt into the rig if humanoid)
  const exemplar = isFigure
    ? 'assets/character/odysseus.mjs (+ its render renders/character__odysseus.png)'
    : 'assets/location/olympian-council-hall.mjs (+ its render renders/location__olympian-council-hall.png)';
  const slug = j.id.split('.').slice(1).join('.');
  const typeDir = j.type.toLowerCase();
  const outPath = `assets/${typeDir}/${slug}.mjs`;
  const pngPath = `renders/${typeDir}__${slug}.png`;
  const figureHelp = isFigure ? `
This is a ${j.type}. Use the hero rig: import { makeFigure } from "/engine/halfworld-engine.mjs" and tune params
{ skin, hairColor, hair:"short|curly|bald", beard:bool, glasses:bool, garment:"tunic|robe|cloak|armor|dress|rags|bare", cloak:bool, bareLegs:bool, scale }.
Give it a distinct silhouette that fits the character (age, dress, bearing).

EXPRESSIVENESS STANDARD (required — study assets/character/odysseus.mjs, it is the template):
  - The engine reads facial channels from state: smile, frown, browUp, browKnit, eyeWide, eyeNarrow, jaw, mouthAsym, gaze:{x,y}, blink. Set these in preview() AND in each states.nodes[*].preview.
  - preview() MUST be an EXPRESSIVE signature: a characterful POSE that gestures with the ARMS (torso_open, pointing_arm, one_arm_raised, reach_forward, offering_hand, lean_forward, grief, confrontation, enthusiasm, head_lowered, kneel, walk_neutral, etc.) PLUS facial channels matching the character's mood. A neutral arms-hanging card is NOT acceptable.
  - states.nodes: ≥3 states, each with a DISTINCT pose + facial expression (e.g. calm / speaking-with-jaw-open / the signature emotion). Map the scene performances to these.
  - draw() must pass state through to the figure (see odysseus.mjs draw()).
Available pose ids: neutral_front, three_quarter_left/right, profile_left/right, back_view, lean_forward, lean_backward, torso_open, step_closer, step_away, weight_shift, crouch, kneel, arms_crossed, arms_open, one_arm_raised, both_hands_raised, shrug, reach_forward, pointing_arm, protective_block, hands_near_face, open_palm, hand_point, wave, offering_hand, palm_up_question, enthusiasm, skepticism, confrontation, guarded_withdrawal, grief, desperation, laughter, head_lowered, repeated_nod, walk_neutral. You may also register bespoke poses onto the shared exported POSES table (import { HERO_POSES } — mutate additively) if you need a specific brow+jaw+arm combination.` : `
This is a ${j.type}. Build CUSTOM geometry with engine primitives — do NOT use the figure rig. Import from "/engine/halfworld-engine.mjs":
makePen(ctx) -> { paint, limb, ink, seam, fillPath, toneSolid }, plus toneSolid, inkLevel(0..7), INK, ACCENT, clamp, lerp.
Draw in solid grays (inkLevel 1=near-paper .. 7=full ink) with black contour. Follow the construction spec for a ${j.type} (see contract TYPE_SPEC).
Declare real anchors/zones/layers/states that the atlas prompt implies. For DIVINE_FX/ENVIRONMENT animate over state.t. For ENSEMBLE draw N members deterministically from a member template with formation controls. For SOUND_SOURCE render a legible emitter DIAGRAM (position + radiating intensity rings + rhythm marks).
${j.type==='CREATURE' ? 'CREATURE: build a fully articulated non-human body with its own segments/skeleton and expressive states (idle/alert/attack/locomotion). If the creature is essentially HUMANOID (a giant, a monster with a human torso) you MAY import { makeHeroFigure } from "/engine/figure-hero.mjs" and extend it; if it is an animal/bird/sea-monster, build custom geometry from primitives.' : ''}
${j.type==='VEHICLE' ? 'VEHICLE (e.g. a ship): declare board/ride/dock anchors, motion states (moored/rowing/sailing), capacity, collision. Draw it empty (no crew baked in).' : ''}`;

  return `You are generating ONE reusable Halfworld asset module for the Odyssey scene atlas.

WORKSPACE ROOT (cd here for all commands): ${ROOT}

ASSET
  id:    ${j.id}
  type:  ${j.type}
  name:  ${j.name}
  write to: ${outPath}

ATLAS GENERATION PROMPT (what this asset must be/do):
${j.prompt}

SCENE PERFORMANCES it must support:
${(j.perfs||[]).map(p=>'  - '+p).join('\n') || '  (first appearance)'}

FIRST, READ THESE (do not skip — they define the quality floor and the pattern):
  1. ${ROOT}/engine/halfworld-engine.mjs   (primitives, renderAsset, card, dotify)
  2. ${ROOT}/engine/asset-contract.mjs      (the contract + TYPE_SPEC + validateAsset)
  ${isFigure ? '3. '+ROOT+'/engine/figure-hero.mjs        (the rig + POSES + POSE_ALIAS)' : ''}
  4. The matching EXEMPLAR module + its PNG render so you SEE the target look:
     ${ROOT}/${exemplar}
${AESTHETIC}
${CONTRACT_RULES}
${figureHelp}

THEN THE LOOP (this is the point — verify against a real rendered image, not your imagination):
  1. Write ${outPath}.
  2. Render + validate:  cd ${ROOT} && node harness/render.mjs ${outPath} --pipeline MESH
     - It prints [OK]/[FAIL] + JSON with errors/warnings and writes ${pngPath}.
  3. READ the PNG at ${ROOT}/${pngPath} with the Read tool and look at it critically:
     Does it read as "${j.name}"? Right silhouette/structure? Clean contour? Good tonal range (not one black blob, not empty)? Card correct?
  4. If validation FAILS or the image is weak, revise the module and repeat. Do UP TO 3 render+read iterations.
  5. Stop when it validates OK and the image clearly reads as the asset in the reference halftone style.

Return the structured result. Set ok=true only if the final render both validates and looks right.`;
}

function scenePrompt(s, builtIds){
  const outPath = `scenes/${s.id}.mjs`;
  return `You are composing ONE Odyssey scene as a thin Halfworld composition module. Assets already exist — COMPOSE them, do not redraw them.

WORKSPACE ROOT (cd here): ${ROOT}

SCENE  ${s.id} — ${s.title}
Timeline of action (beats, in causal order):
${(s.beats||[]).map((b,i)=>`  ${i+1}. ${b}`).join('\n')}

Whole-scene composition prompt:
${s.composePrompt}

Scene exit / continuity state:
${s.exitState}

REQUIRED asset instances (these modules exist under ${ROOT}/assets/<type>/<slug>.mjs):
${(s.assets||[]).map(a=>'  - '+a).join('\n')}
(Assets confirmed built this run: ${builtIds.join(', ')})

FIRST READ (required):
  1. ${ROOT}/scenes/_scene-contract.mjs   (the exact scene shape + stateAt() + validateScene())
  2. ${ROOT}/engine/halfworld-engine.mjs  (placeInstance(), renderScene())
  3. One required asset module under ${ROOT}/assets/ to confirm its preview()/states/anchors and that the file exists.

WRITE ${outPath} exporting \`export const scene\` (and \`export default scene\`) per the contract:
  id, title, book:1, beats:[...], exitState:"...", duration:<sec>,
  cast:[ { asset:"<id>", instance:"<name>", anchor:{x,y}, scale:<0..1>, pose:"<pose>" } ... ],
  timeline:[ { op:"actor.pose"|"actor.gaze"|"actor.move"|"fx.play"|"timeline.capture", target:"<instance>", at:<sec>, args:{...} } ... ],
  stage(offctx, W, H, t){ ... }
Implement stage(): import the required asset modules ("/assets/<type>/<slug>.mjs"), import { placeInstance } and { stateAt } from the engine/contract,
compute const st = stateAt(scene, t), then for each cast member call placeInstance(offctx, W, H, <assetModule>, { anchor:c.anchor, scale:c.scale, state: st[c.instance] }).
Order cast back->front (distant/large-set first, foreground actors last). Use location/set anchors where sensible. Do NOT redraw assets yourself — only place them.
The engine runs ONE dotify + scene card over the whole stage, so the scene shares a single halftone. Keep it deterministic (no Date/random).

THE LOOP:
  1. Write ${outPath}.
  2. Verify:  cd ${ROOT} && node harness/render-scene.mjs scenes/${s.id}.mjs --t 8
     (writes renders/scene__${s.id}.png, prints [OK]/[FAIL]+errors)
  3. READ ${ROOT}/renders/scene__${s.id}.png and check the staged beat reads (right cast present, placed sensibly, one unified halftone, card shows the title).
  4. Revise up to 3× until it validates and reads.

Return the structured result. List any required asset whose module file is genuinely missing in missingAssets.`;
}

/* ---- run ---- */
phase('Assets');
log(`Building ${jobs.length} Book-1 assets (2 exemplars already hand-authored).`);
const assetResults = await parallel(jobs.map(j => () =>
  agent(assetPrompt(j), { label:`asset:${j.id}`, phase:'Assets', schema: ASSET_RESULT })
));
const built = assetResults.filter(Boolean);
// prior-book assets already exist on disk (reused); include them so scene
// agents know they resolve. A.existing is the list of already-built asset ids.
const builtIds = built.filter(r=>r.ok).map(r=>r.id).concat(A.existing || ['location.olympian-council-hall','character.odysseus']);
log(`Assets done: ${built.filter(r=>r.ok).length}/${jobs.length} ok. Composing ${scenes.length} scenes.`);

phase('Scenes');
const sceneResults = await parallel(scenes.map(s => () =>
  agent(scenePrompt(s, builtIds), { label:`scene:${s.id}`, phase:'Scenes', schema: SCENE_RESULT })
));

return {
  assets: assetResults,
  scenes: sceneResults.filter(Boolean),
  summary: {
    assetsOk: built.filter(r=>r.ok).length,
    assetsTotal: jobs.length,
    scenesOk: sceneResults.filter(Boolean).filter(r=>r.ok).length,
    scenesTotal: scenes.length,
  },
};
