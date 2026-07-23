# ODYSSEY HALFWORLD
### A Procedural Halftone Atlas of the *Odyssey* — Assets as Code, Scenes as Programs, the Film as an Executable

**Status:** Books I–XV live · 307 assets · 93 scene modules · engine `hw-engine/1.1.0`
**Root:** `~/Downloads/odyssey-halfworld/` · serve with `node harness/serve.mjs` → http://127.0.0.1:8877

---

## Abstract

We present a system in which an entire animated adaptation of Homer's *Odyssey* is generated,
staged, edited, and played **as code**. No raster media is produced or stored: every character,
location, prop, creature, ensemble, and divine effect is a small JavaScript module (~200–400
lines) that *draws itself* — in continuous warm-paper tone — and every scene is a program that
casts those modules onto a single stage, directs them over a timeline, and hands the composed
field to one shared post-pass that reduces it to a lawful halftone: black dots on paper, in the
lineage of Ken Knowlton's BEFLIX (Bell Labs, 1963), where a film is a grid of cells with ink
values and the "footage" is the program that fills them. Because the film *is* its source, the
same 400 files are simultaneously: a printable card catalog, a periodic table, a previs shot
compiler with an EDL, a performance-capture stage, a walkable video game, and a timeline editor.
This document is the methods paper; `index.html` is the same paper with the process playing as
a film; `odyssey-timeline.html` is the edit/score surface.

## 1. Ambition

Adapting all 24 books of the *Odyssey* would classically require thousands of drawings or a
generative-video budget. Our claim: **a drawing described precisely enough is an asset**, and an
asset that is code can be re-posed, re-lit, re-staged, re-cut, and re-played forever at zero
marginal cost. The atlas targets **440 assets across 24 books**; Books I–XV (307 assets, 93
scenes) are built and verified; XVI–XXIV are specified and paused. Every asset records the full
natural-language prompt that generated it — the film's genome ships inside the film.

## 2. The Substrate: Dot Law

Asset modules draw in **solid continuous tone** on warm paper (`#f4f4f0`), hard black contour
(`#141414`), one blue accent (`#0033cc`). They never draw dots. The halftone exists only in the
final shared pass, `dotifyField`, which samples the composed source field on a square lattice of
pitch Δ (the *cell*, MESH default 5·DPR·0.68, min 3):

For each lattice point (x, y), with source pixel (R,G,B):

```
L = (0.299·R + 0.587·G + 0.114·B) / 255          (luminance, 0..1)
d = 1 − L                                          (darkness)
if d < 0.10  →  print nothing                      (the paper threshold)
else         →  disc of radius  r = d^0.9 · Δ · 0.62 · gain
```

Two consequences make this a *law* rather than a filter:

1. **Uniformity.** Every element — a god, a wave, a wall — passes through the same lattice, so
   heterogeneous drawings unify into one print. There is exactly one dotify per frame.
2. **The keying corollary (§4).** Any pixel with L ≥ 0.90 prints *no ink*. Therefore a region
   too light to print has no right to occlude — which is checkable, and enforceable, per pixel.

The empty field is not blank: an under-texture (faint dot grid or ruled lines at 0.72Δ,
alpha .08–.10) prints the paper itself, so even silence has a surface.

### 2.1 BEFLIX lineage

BEFLIX (Bell Flicks) modeled a film as a 252×184 mosaic of cells holding ink levels 0–7,
mutated by operations (PAINT, LINE, ZOOM, DISSOLVE); the camera photographed the mosaic.
Halfworld is the same machine with three substitutions: the cell grid is the dot lattice Δ; the
ink level is continuous darkness d; and the operation set is the full 2-D canvas API wielded by
asset programs. `engine/halfworld-engine.mjs` even carries an 8-step quantizer
(`inkLevel(l), l ∈ 0..7`) as a direct homage. As in BEFLIX, *the negative never existed* —
re-running the program is re-shooting the film.

## 3. Contracts

### 3.1 Asset contract
```js
export default {
  id: "character.odysseus", type: "character", name: "ODYSSEUS",
  states: { nodes: [ { key, label, preview() → state } … ] },   // expressive repertoire
  preview() → state,                                            // signature pose
  draw(ctx, W, H, state)                                        // solid tone only
}
```
State channels: `pose` (walk/stand/gesture cycles keyed by `t`), `band` (front/profile),
facial channels (`jaw, smile, browUp, eyeWide, gaze, …` — drivable live from MediaPipe
FaceLandmarker), plus type-specific extras. 11 types:
character 67 · location 49 · ensemble 47 · prop 45 · divine_fx 40 · creature 21 ·
set_piece 11 · environment 11 · vehicle 11 · sound_source 3 · wearable 2.

### 3.2 Scene contract
```js
export default {
  id: "OD-B09-S06", title, book, duration,
  cast:     [ { asset, instance, anchor:{x,y}, scale, pose, band, gaze } … ],
  timeline: [ { op, target, at, args } … ],       // direction as events
  beats:    [ …prose beats… ],
  exitState,                                       // handoff to the next scene
  stage(og, W, H, t)                               // authored composite (optional path)
}
```

### 3.3 Manifest
`viewer/odyssey-manifest.json` joins both sides: for each asset — `books, uses, scenes,
prompt` (the complete generation prompt), `perfs` (per-scene performance directions); for each
scene — `beats, composePrompt, exitState`. Rebuilt by
`node harness/build-odyssey-studio-manifest.mjs`.

## 4. Dot-Law Keying (occlusion without mattes)

Problem: layered cutouts occlude as rectangles. Solution: enforce §2's corollary. Each cast
module is drawn to a transparent canvas and passed through `borderKey` — a border-connected
flood fill (explicit Int32Array stack, O(N)):

```
passable(p) =  α(p) < 10                                   (unpainted)
            ∨  L(p)·α + (1−α) ≥ θ,  θ = 0.895              (too light to print)
flood from all four borders; every reached light pixel → α := 0
```

Border-connectivity is the point: enclosed whites (eyes, teeth, highlights *inside* ink) are
unreachable and survive. Results are cached (`keyedModuleCanvas`, LRU ≈ 360 entries) keyed by
`(id | w×h | pose | band | t-quantized | gaze | θ)`.

## 5. RESTAGE: one ground plane, live performance

Scenes authored as collages ("backgrounds on backgrounds") are rebuilt at runtime by
`makeRestage(sceneMod, resolveMod, resolveType, overrides)`: the location alone paints the
field (plus a 20% white wash); every other cast member becomes a keyed cutout on **one floor**.

**Depth model.** From the authored feet-line a_y:

```
d  = clamp((a_y − 0.42)/0.58, 0.08, 1)          depth, 0 far → 1 near
y  = H·(0.50 + 0.46·d^1.08)                      foot line (perspective floor)
h  = H·s·(0.60 + 0.50·d)·k,  k = 1.08 figures | 0.92 props,   h ≤ 0.92·H
```

**Anti-crowding relaxation.** 3 passes over same-depth pairs (|d_i − d_j| ≤ 0.30):

```
gap_min = 0.30·(w_i + w_j);   if |x_j − x_i| < gap_min, push both apart by half the deficit
```

**Performance.** Undirected cast rotate their own `states.nodes` per beat; timeline ops override
pose in a ±(0..4 s) window; every figure's `gaze` is bent toward the current op's target
(clamped ±0.6/±0.3); a per-instance seeded idle sway (±0.7% h) keeps the frame alive.
Ground shadows: ellipse (0.33 w × 0.075 w) under every foot line.

**Blending (the window fix).** Each cutout draws with a per-type default composite:

```
divine_fx | sound_source | ensemble  →  multiply     (light fields melt into the set)
all else                             →  source-over
```
Under multiply, C = C_top · C_under: white (1) is identity, so a vision-panel's paper field
vanishes and only its ink lands on the set — panels stop being windows. Per-instance
**overrides** `{dx, dz, scale, blend, key, hidden}` (the ARRANGE layer, §7) persist per scene in
`localStorage["odyssey.arrange.<sceneId>"]` and are honored by every front-end.

## 6. The Camera

All shots are crops of the live restaged field (never of standalone previews, whose lighting
the scene can't know). For a subject placed by `layout()` at (x, y, w, h):

```
frame_h = 0.92·h (figures) | 1.35·h (props)
zoom(u) = 1 − 0.26·ease(u)                        punch-in over the shot
crop_h  = clamp(frame_h·zoom, 0.30·SRCH, 0.96·SRCH),  crop_w = crop_h·SRCW/SRCH
focus   = (x, y − 0.74·h)                          faces, not navels
```
The previs compiler emits: WIDE ESTABLISH → LINEUP ("the manifest") → per-op CUs (merged by
target) → RE-ESTABLISH after 3+ CUs → COVERAGE inserts for cast the cut skipped → WIDE EXIT;
SMPTE at 24 fps from 01:00:00:00; copyable shot list + EDL.

## 7. The Experiments (index)

| # | Page | What it proves |
|---|------|----------------|
| E1 | `odyssey-world-studio.html` | the atlas as one navigable world; sprite LOD billboards |
| E2 | `odyssey-stage.html` | play any scene; **EMBODY** (drive a character, WASD + states); **ARRANGE** (drag/scale/blend/key per element, saved per scene) |
| E3 | `viewer/cards.html` | ODYSSEY TABLE — periodic table by book/type/uses; full atlas prompts; print cards |
| E4 | `odyssey-previs.html` | the cut as an object: shots, boards, SMPTE, EDL |
| E5 | `odyssey-synthcine.html` | per-scene performance lab; MediaPipe face → facial channels |
| E6 | `odyssey-game.html` | each book a walkable level; talk (E) answers with atlas performance lines |
| E7 | `odyssey-timeline.html` | GEL-style timeline: scene rows, asset strips, marks/score, book playback |
| — | `index.html` | this paper, with the process playing as a film |

## 8. Generation Pipeline (how the 400 files were made)

1. **Job synthesis.** `node harness/gen-book-jobs.mjs <book>` reads the book's scene breakdown
   and emits jobs `{book, jobs, scenes, existing}` — one per missing asset/scene.
2. **Agentic fan-out.** A workflow dispatches each job to a subagent carrying the *full atlas
   prompt* (visual grammar, scene function, state requirements, the asset contract). The agent
   writes the `.mjs` module; a verifier renders it via `node harness/render.mjs <path>` and
   rejects contract violations (missing states, painted backgrounds, off-palette color).
3. **Scene assembly.** Scene agents receive the cast manifest + beats and author
   `cast/timeline/stage`; verified with `node harness/render-scene.mjs scenes/<id>.mjs --t <s>`.
4. **Manifest + indices.** `build-odyssey-studio-manifest.mjs` re-joins everything.

Every prompt is retained; E3 displays them verbatim. The atlas is thus *reproducible in
distribution*: re-running a job yields a different but contract-equal drawing.

## 9. Performance Notes

Per-dot `fill()` costs ~seconds/frame at 85k dots. All realtime surfaces use a **batched
dotifier**: dots bucketed into 12–14 radius classes, one `fill()` per class (~11 ms), plus a
dirty flag that skips composition entirely when nothing moved. Browser rAF throttling while a
pane is hidden freezes playback in screenshots but not live.

## 10. Reproduce

```bash
cd ~/Downloads/odyssey-halfworld
node harness/serve.mjs                    # → http://127.0.0.1:8877  (index.html)
node harness/render.mjs assets/character/polyphemus.mjs        # render one asset
node harness/render-scene.mjs scenes/OD-B09-S06.mjs --t 21     # render one scene frame
node harness/build-odyssey-studio-manifest.mjs                 # rebuild the manifest
node harness/gen-book-jobs.mjs 16                              # resume Book XVI (paused)
```

## 11. Limitations & Open Problems

Restage ignores authored `stage()` choreography beyond cast/timeline (walk cues are an open
vocabulary); multiply-blending sacrifices light-on-dark fx (screen-blend per instance is the
manual escape); the 93 static scene PNGs predate the current engine; scoring/audio is data-ready
(sound_source assets, timeline `at`s, the timeline editor) but no synthesis is wired yet.

---
*Halfworld: because a halftone is half the world — the other half is the paper, and the paper
is the program listing.*
