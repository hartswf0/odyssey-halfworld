export const meta = {
  name: 'finish-odyssey-books-17-24',
  description: 'Autonomous completion of Books XVII–XXIV: 125 assets + 53 plan-blocked scenes',
  phases: [
    { title: 'Assets', detail: 'one agent per asset job: write module, render, read the PNG, revise' },
    { title: 'Scenes', detail: 'one agent per scene, sequential in id order so exitOccupancy chains' },
    { title: 'Sweep',  detail: 'render every new scene, report failures, commit the book' },
  ],
};

const ROOT = '/Users/gaia/Downloads/odyssey-halfworld';
const PLAN = typeof args === 'string' ? JSON.parse(args) : (args || []);

const ASSET_RESULT = {
  type:'object', additionalProperties:false,
  required:['id','path','ok','selfAssessment'],
  properties:{
    id:{type:'string'}, path:{type:'string'}, ok:{type:'boolean'},
    iterations:{type:'integer'},
    selfAssessment:{type:'string', description:'1-2 sentences incl. any remaining weakness'},
  },
};
const SCENE_RESULT = {
  type:'object', additionalProperties:false,
  required:['id','path','ok','selfAssessment'],
  properties:{
    id:{type:'string'}, path:{type:'string'}, ok:{type:'boolean'},
    handoffOk:{type:'boolean', description:'did the previous scene exitOccupancy import work'},
    missingAssets:{type:'array', items:{type:'string'}},
    selfAssessment:{type:'string'},
  },
};
const SWEEP_RESULT = {
  type:'object', additionalProperties:false,
  required:['book','scenesRendered','failures','committed','notes'],
  properties:{
    book:{type:'integer'},
    scenesRendered:{type:'integer'},
    failures:{type:'array', items:{type:'string'}},
    committed:{type:'boolean'},
    notes:{type:'string'},
  },
};

const BRIEF = `cd ${ROOT} and READ bookXVI/BUILD-BRIEF.md FIRST — it is the complete spec: the ADDITIVE
rule (Books I–XV must stay bit-identical; create only your new file), what to read before writing,
THE LOOK (warm off-white paper, hard black contour, eight quantized ink levels, ordered-dot halftone,
blocky diagrammatic geometry, no gradients/blur/photorealism), and the mandatory loop:
render -> READ the PNG with the Read tool -> revise, up to 3 iterations.`;

const CRAFT = `KNOWN TRAPS (other agents hit these on first draft — skip the mistake):
- Everything 2-3 ink levels too dark. Prefer light planes with dark accents; plenty of paper must show.
- Full-width horizontal bars (terraces, beams, racks, shelves) stripe the frame. Break every span.
- Small type dissolves in the dot lattice. Draw numerals/labels as GEOMETRY (seven-segment bars) or
  size them ~33px+. Never rely on 20px text.
- A blue ACCENT mark prints BLACK (the POST pass quantizes by luminance). Accents are semantic, not colour.
- Figures: keep hand-drawn ctx overpaint at ZERO if you can. The rig should do the work; overpaint is
  exactly what made the six Odysseus modules drift out of family.`;

function assetPrompt(book, i){
  return `${BRIEF}

Build ONE new asset module for Book ${book}. Its spec — id, type, name, prompt, and the scene
performances it must support — is entry [${i}] of the "jobs" array in ${ROOT}/book${book}/jobs.json.
Read that file, take jobs[${i}], and write the module to assets/<type-dir>/<slug>.mjs following the
path convention already used in the repo (e.g. assets/character/, assets/divine_fx/, assets/set_piece/).

Before writing, open AND render a sibling exemplar of the same type from assets/<type-dir>/ so you
see the target look. If your asset is a figure, also read engine/figure-hero.mjs.

${CRAFT}

ROOMS ARE ALREADY BUILT: the great hall is location.megaron-hall (states day|feast|night|contest|
battle|aftermath|cleaned) and the swineherd's hut is location.eumaeus-hut-interior. If your job looks
like another hall/hut, it is a STATE of one of those — do not build a competing room; instead report
ok:true with selfAssessment explaining it was skipped as a duplicate room, and write no file.

Verify with: node harness/render.mjs <your-path> --pipeline MESH
Then READ the PNG it writes and revise until it validates AND looks right.
Finish by running \`git status --short\` and confirming nothing shows as modified (\` M\`).

Return the structured result.`;
}

function scenePrompt(book, id, prev){
  return `${BRIEF}

Build ONE scene: ${ROOT}/scenes/${id}.mjs (Book ${book}).
Its spec — title, beats, composePrompt, exitState, required assets — is in the "scenes" array of
${ROOT}/book${book}/jobs.json under the entry whose id is "${id}". Read it.

THE SCENE CONVENTION IS IN THE BRIEF (section "IF YOU ARE BUILDING A SCENE") — follow it exactly:
plans not hand anchors, contact pairs for touching bodies, character.odysseus-b16 with a guise
channel (never a cut between beggar and restored modules), rooms-as-state, computed exitOccupancy.
ALSO READ ${ROOT}/scenes/OD-B16-S03.mjs — the reference scene — and copy its shape.

${prev
  ? `CONTINUITY IN: the previous scene ${ROOT}/scenes/${prev}.mjs exists and exports a computed
\`exitOccupancy\`. Import it as your INITIAL:
    import { exitOccupancy as INITIAL } from "./${prev}.mjs";
so this scene opens with every body where the last one left it. If that export is genuinely absent,
say so in selfAssessment and open from sensible plan stations.`
  : `CONTINUITY IN: first scene of this book — establish opening positions from the plan.`}

Rooms: the hall is location.megaron-hall blocked through scenes/_plans/megaron.mjs; the hut is
location.eumaeus-hut-interior blocked through scenes/_plans/eumaeus-hut.mjs. Anywhere else (a road,
an orchard, the underworld, Olympus, a bedchamber), author a SMALL LOCAL plan at the top of the file
with makePlan({id,name,stations}) and block through it — keep the discipline outdoors too.

${CRAFT}

VERIFY: render at TWO different moments (early and late):
  node harness/render-scene.mjs scenes/${id}.mjs --t <early>
  node harness/render-scene.mjs scenes/${id}.mjs --t <late>
READ BOTH PNGs. Blocking bugs — two bodies converging on one point, a figure drifting off the floor,
a fixture fusing under someone's legs — only show up across time. Revise up to 3 iterations until it
validates and both frames read: figures on the floor, believable scale against the architecture,
nobody coincident, the room actually painted.
Finish with \`git status --short\`: nothing may show as modified (\` M\`).

Return the structured result.`;
}

function sweepPrompt(book, sceneIds){
  return `cd ${ROOT}. Book ${book} has just been generated. Do a verification sweep and then commit it.

1. For EACH of these scenes, render one frame and confirm it validates:
${sceneIds.map(s=>`     node harness/render-scene.mjs scenes/${s}.mjs --t 12`).join('\n')}
   Record any that FAIL (validation errors, or a thrown module error) in \`failures\`.
2. READ two of the rendered PNGs (pick the two most complex scenes) and confirm they actually read as
   staged frames — room painted, figures on the floor at sane scale, nobody coincident.
3. Run \`git status --short\`. Confirm NOTHING is listed as modified (\` M\`) — Books I–XV must be
   untouched. If something tracked was modified, do NOT commit; report it in notes and stop.
4. If step 3 is clean, commit ONLY this book's own files. Stage EXPLICIT PATHS — never \`git add -A\`:
   other books' agents are writing into this same tree concurrently, and -A would sweep in scenes
   you never rendered under a message claiming they are Book ${book}'s.
     git add ${sceneIds.map(s=>`scenes/${s}.mjs`).join(' ')} <plus any asset files THIS book added>
     git commit -m "Book ${book}: assets + plan-blocked scenes (additive)"
   To find this book's own new assets, check which untracked assets its scenes actually import.
   Leave every other untracked file alone — it belongs to another book's sweep.
   Set committed=true only if the commit actually succeeded.

Return the structured result. Be accurate about failures — do not report success you did not verify.`;
}

/* Books pipeline: book N's scenes run while book N+1's assets build.
   Within a book: assets parallel, scenes STRICTLY SEQUENTIAL (the exitOccupancy chain). */
const results = await pipeline(
  PLAN,
  async (b) => {
    log(`Book ${b.book}: building ${b.build.length} assets`);
    const assets = await parallel(b.build.map(i => () =>
      agent(assetPrompt(b.book, i), { label:`B${b.book}:asset[${i}]`, phase:'Assets', schema: ASSET_RESULT })
    ));
    const ok = assets.filter(Boolean).filter(a => a.ok).length;
    log(`Book ${b.book}: assets ${ok}/${b.build.length} ok`);
    return { b, assets: assets.filter(Boolean) };
  },
  async ({ b, assets }) => {
    const ids = [...b.scenes].sort();
    const scenes = [];
    for (let i = 0; i < ids.length; i++){
      const r = await agent(scenePrompt(b.book, ids[i], i ? ids[i-1] : null),
        { label:`B${b.book}:${ids[i]}`, phase:'Scenes', schema: SCENE_RESULT });
      scenes.push(r);
      log(`${ids[i]} ${r?.ok ? 'ok' : 'NEEDS WORK'} (${i+1}/${ids.length})`);
    }
    return { b, assets, scenes: scenes.filter(Boolean) };
  },
  async ({ b, assets, scenes }) => {
    const sweep = await agent(sweepPrompt(b.book, [...b.scenes].sort()),
      { label:`B${b.book}:sweep`, phase:'Sweep', schema: SWEEP_RESULT });
    log(`Book ${b.book} DONE — assets ${assets.filter(a=>a.ok).length}/${b.build.length}, ` +
        `scenes ${scenes.filter(s=>s.ok).length}/${b.scenes.length}, committed ${sweep?.committed}`);
    return { book: b.book, assets, scenes, sweep };
  },
);

const flat = results.filter(Boolean);
return {
  books: flat.map(r => ({
    book: r.book,
    assetsOk: r.assets.filter(a=>a.ok).length,
    assetsTotal: r.assets.length,
    scenesOk: r.scenes.filter(s=>s.ok).length,
    scenesTotal: r.scenes.length,
    committed: r.sweep?.committed,
    failures: r.sweep?.failures || [],
    notes: r.sweep?.notes,
  })),
  weaknesses: flat.flatMap(r => [
    ...r.assets.filter(a=>!a.ok).map(a=>`${a.id}: ${a.selfAssessment}`),
    ...r.scenes.filter(s=>!s.ok).map(s=>`${s.id}: ${s.selfAssessment}`),
  ]),
};
