# House of Dust / Odyssey scene exploration

## 1. <Initial Interpretation>
The user found the added house and lighting intrusive, and the scrolling interface concealed the existing atlas. The program is now an exploration surface for authored scenes, objects and inhabitants. Scene construction is supplied by existing scene modules.

## 2. <Theory Skeleton>
<entities> := {authored scene, atlas asset, object state, character face, recorded turn, source, camera}
[operations] := {enter scene, pan, select object, transform, hear voice, perform, return, cast, inspect source}
<states> := {loading, scene, object inspection, character close-up, artifact performance, source page, failed load}
<constraints> := {fixed viewport, finite paginated shelf, actual atlas references}
<invariants> := {no added house shell, no added sun/moon/light overlay, one final halftone pass, no document scrolling, explicit source attribution}

## 3. <Assumption Ledger>
<safe>: Preserve scene.stage choreography and its actual drawing modules.
<safe>: Keep every object available through a paginated shelf.
<safe>: Import the same close-up face, speech and direction modules as odyssey-performances.html.
<uncertain>: Some scenes need a setting inherited from an earlier scene in their book; this is disclosed in Source.
<requires-user-decision>: Further free-language recombination is outside this revision.

## 4. <Operational Description>
<scene selection> [loads] <authored scene + cast>
<scene.stage> [draws] <continuous-tone field>
<drawImage placement> [records] <actual object hit bounds>
<tap or object shelf> [opens] <large original asset>
<object state selection or slider> [changes] <asset channels>
<supported character> [opens] <film close-up>
<Hear voice> [plays] <recorded turn>; <audio.currentTime> [drives] <mouth and speech carriage>
<Perform> [runs] <existing artifact motion score>
<Source> [pages through] <score, original prompt, actual code>
<Return> [restores] <scene exploration>

## 5. <Failure Description>
Unknown scenes and failed imports retain the last active scene and expose Retry. Scene construction is rendered before the candidate replaces the active scene. Request tokens discard stale scene and object loads. If a character has no close-up rig, the original atlas figure remains available. Voice playback errors are reported. Unsupported clipboard access exposes the address in Source.

## 6. <Change Test>
What would change if the requirements changed?
- New atlas objects enter through the manifest and authored cast; they need no new substitute geometry.
- New character rigs enter through the film face module; unsupported figures retain their atlas drawing.
- A smaller screen changes page capacity and camera framing, without introducing page scrolling.
- An updated scene.stage retains its blocking because the explorer calls that authored function.

## 7. <Implementation Plan>
house-of-dust.html is a single-page explorer. The document uses a fixed three-row viewport: scene navigation, the rendered world, and a paginated object shelf with transport. Source is a fixed dialog with explicit page navigation.

The original renderer composes each scene. Module wrappers associate temporary canvases with asset IDs; observed drawImage destinations supply hit targets for those actual placements. Objects without a tracked image placement remain selectable through the shelf.

Inspection uses the original asset and its state previews. Character close-ups reuse assets/character/_close/face.mjs, engine/speech.mjs and scenes/_direction.mjs. Voice records join the drive script and voice manifest by segment index, using authored spoken text when available. Mouth tracks follow the performance page's existing text-derived timing method.

## 8. <Program Text>
house-of-dust.html
.github/workflows/house-of-dust.yml

## 9. <Theory-Code Mapping>
<types>: authored scene/asset contracts, face specification, recorded turn.
<functions>: openScene, selectObject, renderScene, draw, currentState, turnsFor, drawPerformer.
<classes>: none added.
<tests>: four viewport sizes; no document or source-dialog scrolling; actual vessel states; URL reload; scene imports; film faces and animation; recorded playback; existing artifact performance.
<comments>: explain canvas provenance tracking and the inspection framing.
<configuration>: the manifest, scene modules and original object state definitions; SPECIAL maps known objects to existing artifact performances.

## 10. <Residual Human Theory>
The four-line score is an original reading generated from the scene and selected object. It is not a quotation from Homer or Knowles. A rendered object state is an authored performance, not a material simulation. Close-up characters use the existing film performance rules; waveform-independent viseme tracks are approximate.

The main scene is a two-dimensional authored field with pan and crop, not a rebuilt 3D room. Bounding hit tests follow tracked image placements and can include transparent portions; the object shelf is the reliable alternate selection path. Shared links preserve scene, selected object, state and scene time, not frozen versions of upstream modules.
