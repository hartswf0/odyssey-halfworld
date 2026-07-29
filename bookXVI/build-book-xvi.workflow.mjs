export const meta = {
  name: 'build-odyssey-book-xvi',
  description: 'Books XVI–XXIV: assets + PLAN-BLOCKED scenes (rooms authored once, stations not anchors, guise ramps)',
  phases: [
    { title: 'Assets', detail: 'one agent per unique asset: write module, render headless, read PNG, revise to quality' },
    { title: 'Scenes', detail: 'one agent per scene: compose the timeline from registry assets, render a keyframe' },
  ],
};

const ROOT = '/Users/gaia/Downloads/odyssey-halfworld';

/* args may arrive as a JSON string or a parsed object — normalize. */
const A = typeof args === 'string' ? JSON.parse(args) : (args || {});
/* skip the alias split (ensemble.suitors == ensemble.the-suitors) */
/* ROOMS ARE STATE: the atlas fragments one hall into five "locations" and the hut into
   several. Those are states of location.megaron-hall / .eumaeus-hut-interior, which are
   authored once against scenes/_plans/. Never build them a second time. */
const ROOM_ALIASES = [
  'location.night-palace-hall', 'location.festival-ready-hall', 'location.aftermath-hall',
  'location.cleaned-palace-hall', 'location.palace-night-interior', 'location.recognition-seating',
  'location.fight-threshold', 'location.night-hearth-interview', 'location.palace-family-chamber',
];
const jobs = (A.jobs || [])
  .filter(j => j.id !== 'ensemble.suitors')
  .filter(j => !ROOM_ALIASES.includes(j.id));
if ((A.jobs || []).length !== jobs.length)
  log(`skipped ${(A.jobs||[]).length - jobs.length} duplicate-room/alias jobs (they are states of megaron-hall / eumaeus-hut-interior)`);
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

ADDITIVE CONSTRAINT (Books XVI+): create ONLY your new module file. Do NOT modify any file that
already exists — Books I–XV must be bit-identical when you are done. Check with \`git status --short\`:
your new file must be the only thing you added, and nothing may show as modified.
If your asset is a room/interior, remember the rooms are already authored: the great hall is
location.megaron-hall and the swineherd's hut is location.eumaeus-hut-interior, both with state
channels and both agreeing with scenes/_plans/. Do not build a competing hall or hut.

Return the structured result. Set ok=true only if the final render both validates and looks right.`;
}

function scenePrompt(s, builtIds, prev){
  const outPath = `scenes/${s.id}.mjs`;
  const handoff = prev
    ? `\nCONTINUITY IN: the previous scene ${ROOT}/scenes/${prev.id}.mjs was just built and exports
\`exitOccupancy\` (a computed {who: station} map). READ IT and import it as your INITIAL:
    import { exitOccupancy as INITIAL } from "./${prev.id}.mjs";
so this scene opens with every body exactly where the last one left it. If that export is
genuinely absent, say so in selfAssessment and start from sensible plan stations.\n`
    : `\nCONTINUITY IN: this is the first scene of the book — establish opening positions from the plan.\n`;
  return `You are composing ONE Odyssey scene as a thin Halfworld composition module. Assets already exist — COMPOSE them, do not redraw them.

WORKSPACE ROOT (cd here): ${ROOT}

SCENE  ${s.id} — ${s.title}
Timeline of action (beats, in causal order):
${(s.beats||[]).map((b,i)=>`  ${i+1}. ${b}`).join('\n')}

Whole-scene composition prompt:
${s.composePrompt}

Scene exit / continuity state:
${s.exitState}
${handoff}

REQUIRED asset instances (these modules exist under ${ROOT}/assets/<type>/<slug>.mjs):
${(s.assets||[]).map(a=>'  - '+a).join('\n')}
(Assets confirmed built this run: ${builtIds.join(', ')})

FIRST READ (required):
  1. ${ROOT}/scenes/OD-B16-S03.mjs        ★ THE REFERENCE SCENE for Books XVI+. Copy its SHAPE.
  2. ${ROOT}/engine/blocking.mjs          (makePlan, blockingAt, occupancyAt, toCast, project)
  3. ${ROOT}/scenes/_plans/megaron.mjs and ${ROOT}/scenes/_plans/eumaeus-hut.mjs (the authored rooms)
  4. ${ROOT}/scenes/_scene-contract.mjs   (the exact scene shape + stateAt() + validateScene())
  5. ${ROOT}/engine/halfworld-engine.mjs  (placeInstance(), renderScene())
  6. One required asset module under ${ROOT}/assets/ to confirm its preview()/states/anchors and that the file exists.

★★ THE BOOK XVI+ CONVENTION — this is what makes the back half of the poem hold together.
Books I–XV were collages: every scene invented its own anchors, so the same room was a
different room each time. That cannot survive Books XXI–XXII, where the axe line, the two
doors and the position of every body are PLOT, sustained across dozens of shots.

  A. NO HAND-PLACED FIGURE ANCHORS. If this scene plays in the great hall or in the
     swineherd's hut, import that plan and resolve EVERY figure position through it:
         import { megaron } from "./_plans/megaron.mjs";        // or eumaeus-hut.mjs
         import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
         const MOVES = [ { who:"odysseus", from:"threshold", to:"hearth", t0:6, t1:11 }, ... ];
         const block = blockingAt(PLAN, MOVES, t, INITIAL);   // -> {who:{x,y,scale,d}}
     then place each figure at block[who].x / .y with scale block[who].scale.
     Stations are referenced BY NAME. blockingAt() THROWS on an unknown station — that is
     the cross-room continuity check; do not work around it, use a real station.
     If the scene plays somewhere with no authored plan (a road, an orchard, the underworld),
     author a SMALL LOCAL plan at the top of your scene file with makePlan({id,name,stations})
     and block through it the same way. Keep the discipline even outdoors.

  B. CONTACT PAIRS. Two bodies that touch — embrace, grapple, hand something over, a killing
     blow — must NEVER resolve to the same station, or they land on identical coordinates.
     Use the paired stations (centre_l/centre_r and their kin) or add a pair to your local plan.
     Book XXII needs many of these.

  C. ONE BODY, MANY GUISES. Odysseus in Books XVI+ is \`character.odysseus-b16\`
     (assets/character/odysseus-b16.mjs) — ONE module with a guise channel
     (king | restored | beggar | old-beggar | trojan-beggar | memory), NOT a cut between
     .odysseus-as-beggar and .odysseus-restored. Pass state { guise:"beggar" } or, during a
     transformation, { guise:{ from:"beggar", to:"king", u } } where u ramps 0→1: skin, hair
     and height interpolate continuously and the garment SNAPS at u=0.5. Put the restoration
     fx (divine_fx.athenas-restoration) on exactly that snap frame — the flare exists to cover
     the one discontinuity. Read assets/character/odysseus-b16.mjs before using it.

  D. ROOMS ARE STATE, NOT NEW ROOMS. The hall is ONE asset, location.megaron-hall, with a
     state channel (day|feast|night|contest|battle|aftermath|cleaned). The hut is
     location.eumaeus-hut-interior. If the atlas asks for "night-palace-hall" or
     "festival-ready-hall" or "aftermath-hall" or "cleaned-palace-hall", that is the SAME
     megaron in a different state — cast location.megaron-hall and pass the state, do not
     build or cast a second hall. Same for the hut.

  E. STRUCTURED HANDOFF. Export \`exitOccupancy\` alongside the prose exitState, computed —
     never hand-written:  export const exitOccupancy = occupancyAt(PLAN, MOVES, DURATION, INITIAL);
     The next scene imports it as its INITIAL so continuity stops being a promise.
     If the previous scene in this book exports exitOccupancy, IMPORT IT as your INITIAL.

  F. ADDITIVE. You may create your new scene file and nothing else. Do NOT modify any file
     that already exists (\`git status --short\` must show your scene only, as \`??\`).
     Books I–XV must be untouched.

WRITE ${outPath} exporting \`export const scene\` (and \`export default scene\`) per the contract:
  id, title, book:${A.book}, beats:[...], exitState:"...", duration:<sec>,
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
     Check specifically: figures stand ON the floor of the room at a believable size against its architecture,
     nobody is coincident with anybody, and the room is actually painted (not an empty field).
  4. Render a SECOND time at a different moment (--t near the end of the scene) and read that too —
     blocking bugs (two bodies converging on one point, a figure drifting off the floor) only show up
     across time, and this is exactly what the plan system exists to prevent.
  5. Revise up to 3× until it validates and both frames read.

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
/* SEQUENTIAL, in scene order — each scene imports the previous scene's computed
   exitOccupancy as its INITIAL. That handoff is the whole point of the plan system;
   building these in parallel would make continuity a coincidence again. */
const ordered = [...scenes].sort((a,b)=> String(a.id).localeCompare(String(b.id)));
const sceneResults = [];
for (let i = 0; i < ordered.length; i++){
  const s = ordered[i], prev = i ? ordered[i-1] : null;
  const r = await agent(scenePrompt(s, builtIds, prev), {
    label:`scene:${s.id}`, phase:'Scenes', schema: SCENE_RESULT });
  sceneResults.push(r);
  log(`${s.id} ${r?.ok ? 'OK' : 'needs work'} (${i+1}/${ordered.length})`);
}

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
