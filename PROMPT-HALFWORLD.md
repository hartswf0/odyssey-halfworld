# THE HALFWORLD ADAPTATION PROMPT
### Paste this into Claude with any book, epic, play, album, or poem. It reproduces the full pipeline: a procedural halftone atlas where the film IS the program.

> **USAGE:** Replace `<WORK>` below (e.g. *The Divine Comedy*, *Paradise Lost*, *Moby-Dick*, a poetry collection, an album's lyrics). Everything else is the method. Give Claude a working directory and let it run the phases in order. Books/cantos/chapters are the unit of pacing — build a few, verify, then fan out.

---

You are building **`<WORK>` HALFWORLD**: a complete adaptation of `<WORK>` as executable drawings. No raster media is ever stored. Every character, location, prop, creature, ensemble, and effect is a small JavaScript module (~200–400 lines) that draws itself in solid tone; every scene is a program that directs those modules; one shared post-pass reduces the composed field to black dots on warm paper (the lineage of Knowlton's BEFLIX: the film is a grid of cells, and the footage is the program that fills them). Because the film is its source, the same files become a card catalog, a periodic table, a previs deck, a performance stage, a walkable game, a timeline editor, and a music-scoring suite.

## PHASE 0 — THE ATLAS BREAKDOWN
Read `<WORK>`. Produce `atlas.json`: for each book/canto/chapter, a scene list. Each scene:
```json
{ "id": "XX-B01-S01", "title": "...", "book": 1, "bookTitle": "...",
  "beats": ["4–6 causal beats, each one sentence, each CAUSING the next"],
  "assets": ["character.x", "location.y", "prop.z", "ensemble.w", "fx.v"],
  "exitState": "one sentence: the state handed to the next scene" }
```
Asset types: `character, location, prop, creature, ensemble, divine_fx (or work-appropriate fx), set_piece, environment, vehicle, sound_source, wearable`. Reuse assets aggressively across scenes — the atlas is a cast, not a per-scene art dump. Target ~15–20 assets per book, ~5–8 scenes per book.

## PHASE 1 — THE ENGINE (build once, ~700 lines, `engine/halfworld-engine.mjs`)
Constants: paper `#f4f4f0`, post-paper `#fdfdfa`, ink `#141414`, one accent color, mono aesthetic.

1. **The dot law** — `dotifyField(g, src, SW,SH, CW,CH, post)`: sample the composed field on a square lattice of pitch Δ; per cell `L = (0.299R+0.587G+0.114B)/255`, `d = 1−L`; if `d < 0.10` print nothing; else a disc of radius `d^0.9 · Δ · 0.62 · gain`. One dotify per frame unifies everything. Faint under-texture (dot grid or ruled lines) so the empty field prints paper.
2. **Batched realtime dotifier** (every front-end): bucket dots into ~12 radius classes, one `fill()` per class (~11 ms vs seconds), plus a dirty flag.
3. **Dot-law keying** — `borderKey(ctx,w,h,θ=.895)`: border-connected flood; passable = `α<10` or `L·α+(1−α) ≥ θ`; reached light pixels → `α=0`. Enclosed whites (eyes, teeth) survive. Cache keyed canvases by `(id|size|pose|band|t·4|θ)`.
4. **inkCutout(mod, state)** — THE no-crop primitive. Modules recompose art to any canvas, so fixed-aspect frames always eventually crop. Instead: draw once at a generous square (560²), key, measure the true ink bounding box (+2.5% margin), return `{cv,x,y,w,h,ar}`. Callers blit exactly the ink. Cropping becomes impossible by construction. Use it for ALL standalone renders (thumbs, cards, prints) and in the restage draw.
5. **normStateNodes(mod)** — generated rigs WILL vary in shape (array of `{key, preview()}` vs map of `{name:{preview:{}}}`). One normalizer to `[{key, prev()}]`, used by every front-end. Without this, half the cast silently won't perform.
6. **makeRestage(sceneMod, resolveMod, resolveType, overrides)** — rebuild any scene on ONE ground plane: location alone paints the field (+20% white wash); every other cast member is a keyed ink-cutout with
   depth `d = clamp((anchor_y−.42)/.58, .08, 1)`, foot line `y = H(.50+.46d^1.08)`, height `h = H·s·(.60+.50d)·k` (k=1.08 figures, .92 others, ≤.92H), width `h·cut.ar`; 3-pass anti-crowding relaxation (same-depth pairs pushed until gap ≥ .30(w₁+w₂)); ground shadows; undirected figures rotate their own state nodes per beat; gaze bends toward the current timeline op's target; blend default: **characters/creatures source-over (full presence), everything else darken** (light fields melt into the set — no "window" panels). Per-instance override store `{dx,dz,scale,blend,key,flip,hidden}` + `cloneInstance/removeInstance`, persisted per scene in localStorage — the ARRANGE layer that every front-end honors.

## PHASE 2 — CONTRACTS
**Asset module:**
```js
export default { id:"character.x", type:"character", name:"X",
  states:{ nodes:[ { key:"grieving", preview:()=>({pose:"...", jaw:.2, ...}) } ] },
  preview:()=>({...signature state...}),
  draw(ctx, W, H, state){ /* SOLID TONE ONLY. paper/ink/accent. never dots. */ } }
```
State channels: `pose` (walk/stand/gesture cycles keyed by `t`), `band` (front/profile), facial channels (`jaw, smile, frown, browUp, browKnit, eyeWide, eyeNarrow, mouthPucker, gaze`) so faces are drivable live from MediaPipe FaceLandmarker.

**Scene module:** `{ id, title, book, duration, cast:[{asset,instance,anchor:{x,y},scale,pose,band,gaze}], timeline:[{op,target,at,args}], beats, exitState, stage(og,W,H,t) }`.

**Manifest builder** (`harness/build-manifest.mjs`): join everything into one JSON — per asset: `books, uses, scenes, prompt (VERBATIM generation prompt), perfs:[{scene, perf}]`; per scene: `beats, composePrompt, exitState`. The film's genome ships inside the film.

## PHASE 3 — AGENTIC GENERATION
1. `harness/gen-book-jobs.mjs <book>` reads the atlas and emits one job per missing asset/scene.
2. Fan jobs to parallel subagents. Each asset brief (~200 tokens): the visual grammar, the scene function ("great warrior speaking with stripped-down regret"), required states, the full contract. Each returns a module (median ~300 lines ≈ 3.5k tokens).
3. **Verify headlessly** (`harness/render.mjs <path>` via node-canvas): render; reject contract violations — painted backgrounds that would occlude, missing states, off-palette color — re-queue with the violation appended to the prompt.
4. Scene agents receive cast + beats and author `cast/timeline/stage`. Every prompt is retained verbatim in the manifest. Write a **performance direction** per character per scene ("newly composed public speaker whose grief breaks through his formal accusation") — these power talk/chat/inspection everywhere.
5. Serve with a tiny static server (`harness/serve.mjs`) — **must send `Accept-Ranges`/206 responses** (audio seeking) and `cache-control: no-store`.

## PHASE 4 — THE FRONT-ENDS (each one page, self-contained, importing the engine)
Aesthetic A (paper): warm off-white, ink, one accent, letterspaced caps, mono. Aesthetic B (gel): near-black, hot cyan, lane/column UI. Build in this order:
1. **index.html — the paper as a film**: ambition, experiments index, methods with LIVE figures rendered by the real engine (dot-law Δ-sweep; BEFLIX cell mosaic with a scanline writing ink levels 0–7; RAW⟷KEYED wipe; live restage with a diagnosis overlay of depth lines and layout boxes; camera punch-in), a masthead film strip of dotified cels, a PRINTING FLOOR (2 featured agent lanes typing the real prompt while the real module code streams and the image prints beneath a red head line, token meters both ways; a swarm of 4–48 compressed agents; a FOREMAN log narrating the actual pipeline with real job names; a conveyor of shipped prints), and a scene-reassembly figure annotated with real anchors/depths. Measure the economics from shipped files (median lines, token totals) — state numbers, not vibes.
2. **stage.html**: book spine, scene strip, PLAY (restage), EMBODY (possess any cast member: arrows/WASD + drag + click-to-walk, number keys fire state nodes, T talk viseme, camera-face capture, live rig sliders for facial channels), ARRANGE (tap element → drag along floor, wheel scale, chip bar cycling blend/key, right-click/long-press → duplicate/flip/delete, UNDO stack, SNAP exporting PNG **and** an `arrangement.json` of all placements).
3. **cards.html — the periodic table**: element cells by book/type/uses, hover live-render, detail sheets with the FULL generation prompt, print view.
4. **previs.html — study the cut**: compile each scene into shots (WIDE ESTABLISH → LINEUP → per-op CUs cropped from the LIVE restaged frame at `focus=(x, y−.74h)`, zoom `1−.26·ease(u)` → RE-ESTABLISH → COVERAGE for unshown cast → EXIT), SMPTE at 24fps, copyable shot list + EDL, board strip.
5. **game.html — walk the book**: each book a side-scrolling level; the player IS the protagonist's real module (walk cycle, flip, idle); each scene a stretch of road with its location full-bleed and ≤4 cast standing alive (rotating states, gazing at you when near); a **magic-circle rule card** per book (rule + spoil-sport, in Huizinga's sense); tap NPC → walk over + talk (their real per-scene performance line), tap again → chat (lines composed from their genome), hold → duel (hearts, strike/react poses); procedural WebAudio foley (footsteps, speech blips, strike/hurt/win/lose, book-transition drone); the book's album track as level music; road's end loads the next book; touch deck for mobile.
6. **timeline.html — gel columns**: every scene a COLUMN (monitor on top playing the live restage, all its assets as ink-cutout bands beneath, beats at the foot); AUTO (most-visible column plays itself), ▶ BOOK/FILM sequential playback with the book's track underneath; marks/notes/mute/reorder persisted; `{}` verification overlays showing BEATS + COMPOSE PROMPT + EXIT STATE + THE CODE THAT SHIPPED for every scene and asset.
7. **suite.html — score the books** (if there is music; there should be): one clock over all books, each book scored by an assignable album track (numbered albums map track NN→book NN); scenes spread across each track; the film canvas renders the restaged scene at the proportional moment; NOW = current beat; ON STAGE = each figure's performance direction; a collapsed MUSIC PROMPT drawer (scene cue + book genome from the promptbook); cues dropped with M `{g, book, scene, at, prog, track}` shared via localStorage and shown as ticks in every other interface; EXPORT a score-sheet JSON; ELEMENTS chips → full-screen INSPECTOR (ink-cutout render + full atlas prompt + perfs) with a **CHAT tab**: talk to anything in the story — offline replies scored by word-overlap against the element's genome; optional ⚙ plug-in (OpenAI-format endpoint/model/key) where a real model performs the character from its atlas card, opening each reply with a parenthetical stage direction; always fall back to the genome on error.
8. **operator.html — the OP console**: black-bar brutalist deck; nest breadcrumb (`e1 › dN › cN › t`); book spine; scene strip with cue ticks; live board with PEN/BOX/ERASE/CLEAR + tones + size drawing as persisted vector annotations per scene; rebuilds the suite clock independently so ● CUE lands on the shared score; SUITE ▸ hands off at the exact second; verbs A–E jump to the other surfaces.

## PHASE 5 — THE MUSIC LAYER (optional but transformative)
Write a **lineage jukebox promptbook** derived from the atlas: per book a soundtrack LINEAGE_GENOME (yaml: seed, epochs, textures, rhythms, instruments) + an AI-ECHO; per scene a cue prompt that follows the scene's causal beats exactly and ends by "reducing the whole cue to the sonic consequence of the final beat, ready to seed the next scene without a reset." Generate tracks (Suno or similar), number them `NN_` per book, drop the album folder into `audio/`, run `harness/build-albums.mjs` (scans folders → `albums.json` with parsed track numbers). The suite maps numbered tracks to their books automatically.

## HARD-WON RULES (do not relearn these)
- Verify EVERYTHING in the browser as you build; a dirty flag + batched dotifier is the difference between 0.3fps and 60fps.
- Same-URL hash navigation does NOT reload the page — stale module maps; always `location.reload()`.
- Hidden browser panes freeze rAF and IntersectionObserver and report zero-size canvases — expose `window.__debug` handles with tick functions and simulate frames to verify headless.
- Synthetic key events may arrive as "Right"/"Left" — normalize.
- `setPointerCapture` throws on synthetic pointers — guard it.
- Characters must NEVER darken-blend into a dark set; only field-like types melt.
- Every front-end that renders an asset standalone MUST use inkCutout — never a fixed-aspect canvas.
- The generation prompts are as valuable as the drawings. Retain and surface all of them, everywhere.
- Update a memory/log file after every verified milestone with what worked, what broke, and the exact fix.

## DELIVERABLES CHECKLIST
`atlas.json` · `engine/halfworld-engine.mjs` · `assets/**/*.mjs` · `scenes/*.mjs` · `harness/{serve,render,render-scene,gen-book-jobs,build-manifest,build-albums}.mjs` · `viewer/manifest.json` · the 8 front-end pages · `audio/promptbook.md` + `albums.json` · `README.md` written as a publishable code-and-math paper (abstract, dot law, keying, restage equations, camera model, generation economics measured from the shipped files, reproduction commands).
