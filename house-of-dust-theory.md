# House of Dust / Odyssey Halfworld

I will first construct the <theory-of-the-program>, then generate <program text> only after the theory is explicit.

## 1. <Initial Interpretation>

A description can name a house without specifying its construction. This experiment lets a reader operate four lines while seeing the particular spatial interpretation made by the program.

The program adapts the combinatorial structure of Alison Knowles and James Tenney's House of Dust to this repository's Odyssey atlas. The words are original adaptation, not Homer quotations. Historical context: https://reframingthehouseofdust.com/about/

The user activity is composing, watching, keeping, scattering, and returning to possible dwellings. A passage supplies an initial relationship between shelter, host, stranger, and homecoming. Mixing lines creates deliberate departures from the epic.

## 2. <Theory Skeleton>

<entities> := {score, vocabulary, material, site, light, inhabitants, passage, interpretation, atlas asset, printed field, history}

[operations] := {choose passage, change line, hold line, cast, compose, print, scatter, return, undo, read, share, inspect sources}

<states> := {opening atlas, composing candidate, active house, scattered field, paused field, failed candidate}

<constraints> := {four categories, finite authored vocabulary, actual asset identifiers, bounded rendering resolution, at most two inhabitant modules}

<invariants>:
- Text and active construction commit together after required assets load.
- Each material changes the dwelling's drawn surface; each site changes its actual backdrop; each light changes the composed field; each inhabitant choice changes its cast.
- Holding a category preserves that category when casting.
- A failed candidate retains the active house and reports the failure.
- One final halftone pass prints the composed continuous-tone image.
- Shared scores retain their version, vocabulary indices, random seed, and holds.
- No generated poem or new behavior is attributed to Homer, Knowles, or Tenney.
- Cached pose animation is not presented as recognition, autonomous choice, or a physical simulation.

## 3. <Assumption Ledger>

<safe>: Reuse the repository's engine, manifest, drawing modules, palette, and scene links.
<safe>: Add a separate experiment and a link from the index.
<safe>: Four-variable combinations may depart from narrative chronology.
<uncertain>: A depicted dwelling is an adequate first construction medium; no structural physics is claimed.
<uncertain>: Preset passages are useful entrances into a freely recombinable world.
<requires-user-decision>: Any later expansion to free-language LLM interpretation or structural simulation requires a new contract. Neither blocks this implementation.

## 4. <Operational Description>

<passage> [selects] <initial score>
<reader> [changes or holds] <line>
<score + authored mappings> [resolve] <location module + inhabitant modules + shell + light>
<successful asset loading> [enables] <candidate becoming the active house>
<continuous-tone field> [samples onto lattice] <printed dots>
<pointer or scatter slider> [displaces] <printed dots>
<return> [restores] <lattice positions>
<undo> [restores] <previous score>
<score> [serializes into URL] <reopenable composition>
<source drawer> [exposes] <mapping decisions + original atlas prompts + scene>

## 5. <Failure Description>

Invalid scores are rejected before asset loading. Bad saved data returns to the Ithaca default. Failed network loads expose Retry. Candidate failure keeps the previous world; request tokens prevent stale loads replacing a newer choice. Missing clipboard permission exposes a selectable URL. Speech uses browser speech synthesis only after Read, and the button is disabled where the API is unavailable. Save operations use browser downloads.

The engine's existing inkCutout helper can internally catch drawing errors; meaningful render verification remains necessary when adding new asset families. A pose appearing is evidence of a drawing, not proof that its dramatic meaning has been enacted.

## 6. <Change Test>

What would change if the requirements changed?

1. Change the renderer to LEGO. Keep the score and source records; replace the shell and asset adapters. Record brick and material substitutions.
2. Replace authored interpretation with an LLM. Keep immutable source scores, but store the model identity, instructions, returned proposal, and schema validation before committing a candidate.
3. Add another material. Add a vocabulary item and a renderer branch, then show that the image changes. A label without a drawing rule is incomplete.
4. Change vocabulary ordering. Increment the score schema version or provide a migration. Existing shared indices must never silently point to different phrases.

## 7. <Implementation Plan>

A single new HTML page carries CSS, finite score data, pure score operations, browser state, and rendering. It imports the existing Halfworld engine and manifest on demand.

The page first paints a procedural dwelling, then adds the selected atlas background and keyed character/creature cutouts. Asset imports and cutouts are cached. Pose samples change every six seconds; small positional sway continues while playing. A continuous-tone field is sampled at a 4.5-pixel lattice, then rendered in 12 batched radius groups. Touch displacement and the slider move these same printed dots.

Mobile uses a vertical arrangement with full wrapped line text and native selects. Desktop places the score beside the world. Small screens may scroll; controls are not clipped to force a fixed-height screen. Reduced-motion preference starts paused.

## 8. <Program Text>

- house-of-dust.html: complete experience, vocabulary, score engine, and renderer.
- .github/workflows/house-of-dust.yml: scoped browser verification and screenshots.
- index.html: entry in the experiment index.

Open house-of-dust.html from the repository's HTTP server or GitHub Pages. No API key, install step, or external frontend package is needed to use the page.

## 9. <Theory-Code Mapping>

<types>: validated versioned score objects and named vocabulary categories.
<functions>: validate, fromPreset, permute, choices, lines, assetIds, encode, decode.
<functions>: apply and build implement candidate loading and atomic visual/text commit.
<functions>: shell, light, compose, render implement the authored interpretation.
<classes>: none required.
<tests>: pure score validation, deterministic permutation, held categories, URL round trips, manifest references, and browser interaction/render checks.
<comments>: distinguish continuous-tone composition from the final print and explain operational constraints.
<configuration>: BANK and PRESETS retain vocabulary, material kind, scene association, book association, asset IDs, and interpretation notes.

## 10. <Residual Human Theory>

The dwelling is an authored visual interpretation. Dust, salt, stone, cloth, and wood are drawing rules; they are not simulated structural materials. Inhabitants are atlas pose performances with breathing sway. They do not recognize, decide, admit, imprison, or converse.

A maintainer must keep this distinction visible. The scene notes describe the associated epic passage; the interpretation notes describe what this program actually draws. Source links and prompts let those decisions be questioned.

The URL preserves the score, not a frozen version of every upstream drawing module. Reproducing a historical image exactly also requires the repository commit and animation time.
