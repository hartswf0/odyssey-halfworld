# House of Dust: operative permutation

## 1. <Initial Interpretation>
The previous version replaced the generative poem with an atlas browser. It was technically interactive but did not implement House of Dust's central relation: permutation of a finite verbal vocabulary produces a different dwelling.

The revised program makes four independently editable lines operate a composed household. This is an Odyssey adaptation after Knowles and Tenney, not a reconstruction of their historical installation.

## 2. <Theory Skeleton>
<entities> := {score, matter, place, light, inhabitants, original asset, held line, camera, performance time}
[operations] := {choose a line, hold, cast, compose, inhabit, inspect, return, restore, share}
<states> := {loading candidate, dwelling, inspecting, paused, load failed}
<constraints> := {four lines remain visible, finite vocabulary, no API requirement, original asset modules}
<invariants> := {score and world commit together; held lines survive cast; changing a slot preserves the other slot values; no document scrolling; geometry comes from existing drawings}

## 3. <Assumption Ledger>
<safe>: Five vocabularies of household matter, five places, four lights, five pairs of inhabitants produce 500 scores.
<safe>: A house can be organized around the things that sustain household activities.
<uncertain>: Matter is interpreted as a household's organizing material or activity, not as a claim that all architectural surfaces physically consist of that material.
<uncertain>: The inhabitants are possible encounters in an Odyssey permutation, not a claim of canonical co-presence.
No additional user decision is required for this correction.

## 4. <Operational Description>
<four selected indices> [resolve] <recipe>
<matter> [chooses] <three original household objects>
<place> [chooses] <original architectural or landscape setting>
<light> [grades] <surface visibility>; <firelight> [adds] <original hearth>
<inhabitants> [choose] <two original figures and a four-beat performance>
<recipe> [loads and validates] <asset modules>
<validated candidate> [replaces together] <poem and dwelling>
<held lines> [block] <their own permutation>
<time> [drives] <pitcher lift, water, loom, lyre, gestures and listening turns>
<tap or Things> [opens] <original drawing states and supported film face>
<Return> [restores] <composed dwelling>

## 5. <Failure Description>
A failed candidate retains the previous committed poem and scene. The selector rolls back and Retry appears. Request serials prevent a stale import from replacing a newer score. All four held lines disable Cast. Unknown URL values normalize to defaults. A missing optional film face retains its atlas drawing. Clipboard failure points to the shareable address.

## 6. <Change Test>
What would change if the requirements changed?
- Changing the place changes the setting asset, while object and inhabitant IDs remain unchanged.
- Changing inhabitants changes figure IDs and their performance beats, while the setting and household objects remain unchanged.
- A new matter entry needs three existing object IDs and an activity description; the permutation mechanism stays unchanged.
- A short landscape screen moves the poem beside the world; phone portrait keeps it underneath.

## 7. <Implementation Plan>
house-of-dust-score.mjs defines vocabulary, pure recipe construction, held permutations and URL encoding.
house-of-dust-program.mjs loads existing drawing modules, composes them on a shared floor, runs their states and renders one final dot field.
house-of-dust.html is a fixed viewport with a world and four-line operator surface.
house-of-dust-atlas.html preserves the previous atlas explorer.
The program loads drawings from the same paths as the existing Odyssey atlas. It never requires an API key.

## 8. <Program Text>
house-of-dust.html
house-of-dust-score.mjs
house-of-dust-program.mjs
house-of-dust-atlas.html

## 9. <Theory-Code Mapping>
<types>: score and recipe objects express the distinct slot domains.
<functions>: recipe, cast, encode, decode, construct, performer, propState, room and inspect implement their operations.
<classes>: none added.
<tests>: 500 pure score round-trips and recipes; four browser viewports; causal line changes; held lines; undo; link reload; original states; animation; failed imports.
<comments>: record atomic commit, shared floor, turn-taking and surface-light interpretation.
<configuration>: VOCAB and ASSETS are the vocabulary and drawing provenance.

## 10. <Residual Human Theory>
This remains a poetic household construction. It does not simulate load-bearing architecture, material mechanics or optical transport. The original assets retain their own abstractions and proportions. The compositor establishes a shared floor and ordering, not a collision-resolved 3D scene. Actors use authored gestures in a recurring four-beat score; they do not autonomously infer tasks. Close-up faces reuse the film rig. Source performances and recordings remain accessible in the preserved Atlas explorer.
