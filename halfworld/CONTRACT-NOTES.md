# CONTRACT NOTES — the Odyssey as a HALFWORLD corpus

What `harness/build-halfworld-memory.mjs` emitted, contract by contract: what
mapped cleanly, what was lossy, what the loader wanted that this corpus does not
have — and four things this repo invented that arguably belong in the contracts
themselves.

Everything below was checked against **`halfworld-studio.html`**, not the README.
The loader is the spec; the README is the description. Where they disagree the
loader wins, and the disagreement is recorded.

---

## 0. Where the README and the loader disagree

Five differences, all load-bearing. Each one would have produced a file the
studio silently mangles or hard-crashes on.

| README says | The loader actually does | Consequence |
|---|---|---|
| `schema:"halfworld/v1"` | `SAVE_KEY='halfworld.studio.v2'`, `newProject()` stamps `halfworld/v2`; `load()` accepts `/^halfworld\/v[12]$/` but `normalizeProject()` treats v1 as legacy and **forces every `cast.face` to 0** | emitting v1 would erase all 403 facings. We emit **v2**. |
| MEMORY `{cast, stages, scores, worlds, ledger, scenes}` | `{schema, name, cast{}, assets{}, instances[], score{fps,rows}, scenes{}, ledger[], nextId, turn}` | there is no `stages`, no `scores`, no `worlds`. The project **is** one stage; `scenes` is the map of frozen stages. |
| CAST `{id, look:{…}, face:{style,tone}, pose, facing}` | `{id, spec, x, z, face, pose, decals}`; `initCharRuntime` does `c.F = c.face \|\| 0` | `look` is `spec`; `face` is a **number** (the facing angle), not an object; there is no separate `facing`. |
| STAGE assets `{kind, dots}` | `{id, word, grid:{cols,rows,cells:[{i,j,v}]}}`, and `drawAsset()` dereferences `a.grid.cols` **unguarded** | an asset without a real dot grid is a `TypeError`, not a degraded render. |
| SCORE `s`,`d` (unit unstated; the brief assumed frames) | `scoredState()` computes `u=(t-r.s)/r.d` against a **seconds** playhead; `tc(s)` renders `r.s` as seconds; `scoreDur()` returns seconds | **s and d are SECONDS.** `fps` is carried on the score (24, from `const FPS=24`) but the row units are not frames. Emitting frames would have made every line 24× too long. |

Two more the loader enforces and the README never mentions:

* **World units.** `WORLD_X=10`, `clampX: x∈[-10,10]`, `clampZ: z∈[0.04,1]`. Plan
  space is `x 0..1, z 0..1 far..near`, so **z passes through untouched** and x is
  placed on the loader's own axis: `wx = (planX-0.5)·20`. Nothing is re-projected
  to screen space.
* **`m` accepts exactly three cue keys** — `pose=`, `walk=x,z`, `face=` — and
  `parseCues()` *silently drops* everything else, including values outside the
  38-key `POSES` map and the 4-key `FACINGS` map.

---

## 1. The numbers

24 books · 152 scenes · **5,644 KB** of book files + 10 KB index = **5,789,555 bytes**.

| Book | Title | Scenes | Cast | Assets | Inst | Rows | Derived | KB |
|---:|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | Athena Inspires the Prince | 6 | 13 | 14 | 14 | 51 | 6 | 250 |
| 2 | Telemachus Sets Sail | 7 | 17 | 12 | 12 | 55 | 7 | 248 |
| 3 | King Nestor Remembers | 6 | 14 | 11 | 11 | 42 | 6 | 184 |
| 4 | The King and Queen of Sparta | 7 | 20 | 10 | 10 | 55 | 7 | 241 |
| 5 | Odysseus—Nymph and Shipwreck | 6 | 11 | 10 | 10 | 47 | 6 | 186 |
| 6 | The Princess and the Stranger | 4 | 7 | 10 | 10 | 29 | 4 | 173 |
| 7 | Phaeacia's Halls and Gardens | 4 | 10 | 5 | 5 | 28 | 4 | 91 |
| 8 | A Day for Songs and Contests | 5 | 13 | 10 | 10 | 39 | 5 | 181 |
| 9 | In the One-Eyed Giant's Cave | 11 | 16 | 29 | 30 | 72 | 11 | 476 |
| 10 | The Bewitching Queen of Aeaea | 8 | 17 | 15 | 15 | 63 | 8 | 257 |
| 11 | The Kingdom of the Dead | 8 | 16 | 16 | 16 | 57 | 8 | 298 |
| 12 | The Cattle of the Sun | 7 | 11 | 15 | 15 | 52 | 7 | 290 |
| 13 | Ithaca at Last | 5 | 9 | 8 | 8 | 40 | 5 | 168 |
| 14 | The Loyal Swineherd | 4 | 8 | 5 | 5 | 24 | 4 | 102 |
| 15 | The Prince Sets Sail for Home | 5 | 14 | 6 | 6 | 43 | 5 | 157 |
| 16 | Father and Son | 6 | 18 | 7 | 7 | 123 | 0 | 143 |
| 17 | Stranger at the Gates | 7 | 25 | 9 | 11 | 187 | 0 | 197 |
| 18 | The Beggar-King of Ithaca | 5 | 16 | 9 | 9 | 107 | 1 | 188 |
| 19 | Penelope and Her Guest | 6 | 15 | 12 | 14 | 134 | 0 | 231 |
| 20 | Portents Gather | 5 | 18 | 8 | 8 | 88 | 1 | 185 |
| 21 | Odysseus Strings His Bow | 7 | 28 | 22 | 26 | 188 | 1 | 408 |
| 22 | Slaughter in the Hall | 8 | 41 | 28 | 28 | 195 | 0 | 491 |
| 23 | The Great Rooted Bed | 6 | 18 | 7 | 7 | 121 | 2 | 176 |
| 24 | Peace | 9 | 28 | 16 | 16 | 216 | 1 | 323 |
| **all** | | **152** | **403** | **294** | **303** | **2056** | **99** | **5644** |

The Books XVI–XXIV column tells the story on its own: **0–2 derived stages and
~150 score rows per book**, against **every stage derived and ~45 rows** for
Books I–XV. The difference is not more work; it is `scenes/_plans/` and
`engine/blocking.mjs`. See §7.2.

---

## 2. CAST — *who exists*

**Emitted:** 403 cast entries across 152 stages, from 81 rig-capable figure
modules (`assets/character/*.mjs` whose `params.skin` is a hex string — which is
the loader's own test, `normalizeSpec`).

### Mapped cleanly

Our figure params *are* look params, so most of the contract is a rename:

| ours | theirs | note |
|---|---|---|
| `params.skin` | `spec.skin` | verbatim hex. **Required**: if it is not `"#…"`, `normalizeSpec()` discards the entire spec and substitutes a preset — every Odysseus would come back as HERO. |
| `params.scale` | `spec.h` | our figure scale *is* a height multiplier; `mkMetrics` reads `spec.h` for every limb length. |
| `params.hair` | `spec.hair` | closed→closed: `short→cap`, `curly→curly`, `long→long`, `bald→none`. All four of our values land in their eight. |
| `params.beard` | `spec.beard` | verbatim. |
| `params.glasses` | `spec.glasses` | verbatim — and it is always `false` in this corpus, so it is *real*, not omitted-and-defaulted. |
| `params.garment` | `spec.garment` | `robe→dress`; `tunic`/`rags`/`armor`/`cloak`/`bare` **pass through raw**. halfworld only special-cases `dress` and `hoodie`, so these render as the default long garment *and* the roster prints the true word. Flattening them to `sweater` would have been strictly worse. |
| scene `band` + `pose` | `spec`-independent `face` number | `three_quarter_left → -0.62`, `_right → +0.62`, `profile → ∓1`, `back → 1.6`, `front → 0`, taken from the loader's own `POSES[p].facing` so `face` agrees with `pose` instead of fighting it. |

### Lossy

* **`hairColor` is dropped, 403 times.** halfworld draws hair in `INK`, full stop.
  It has `spec.skin` and `spec.shirt` but no hair colour. Odysseus's
  `#241d16 → #a9a49b` ramp — the single most legible signal that a man has aged
  twenty years and come home disguised — has nowhere to live in CAST. It is
  preserved in `x_odyssey.hairColor`.
* **`cloak` and `bareLegs` are dropped** — no counterpart. Preserved additively.
* **Scene-level figure scale is dropped.** halfworld sizes a character purely
  from `spec.h` and the ground-plane perspective; there is no per-placement
  character scale (`P.cast[id]` has no `scale` field, unlike `instances[]`).
  Preserved as `x_odyssey.figureScale`.

### What the loader required that we could not supply

Four `spec` fields the loader *reads* and this corpus does not carry. Each is
filled from halfworld's own `CAST_PRESETS.HERO` and **declared**, never faked:

| field | read by | supplied |
|---|---|---|
| `build` | `mkMetrics` — shoulder and hip width | `1.00` ×403 |
| `headS` | `mkMetrics` — head radius | `1.00` ×403 |
| `shirt` | `mkCharTones` → `mkTone(spec.shirt,…)` | `#d3d3cd` ×403 |
| `browW`,`eyeS`,`mouthW` | face drawing | HERO values ×403 |

`build` is the honest sting: this corpus describes 81 distinct bodies and has no
word for how heavy any of them is. Every Odyssey figure therefore arrives in
halfworld with the same shoulders. `shirt` is worse in effect — all 403 wear the
same grey — because our garments are named (`tunic`, `rags`, `armor`) but never
coloured.

### The guise decision — one CAST id, variants alongside

Two assets carry a `guise` channel (`character.odysseus-b16`,
`character.odysseus-revealed`), each with five named looks
(`king`, `restored`, `beggar`, `old-beggar`, `trojan-beggar`).

**Chosen: ONE cast id per body, with the guise names and the entry guise recorded
in `x_odyssey.guises` / `x_odyssey.guiseAt`.** Not one CAST per guise.

The reason is not taste, it is the loader. `scoredState(id,t)` seeds position from
`P.cast[id].x/.z` and then accumulates *only that id's* `walk` cues down the
score. Split Odysseus into `odysseus-beggar` and `odysseus-restored` and the
reveal at OD-B22-S01 t=6 does three things at once: the body teleports (the new id
starts from its own untravelled `x,z`), every row addressed to the old id goes
inert, and the leap `axe_first → threshold` that the snap is deliberately placed
*inside* gets cut in half. One body, one id, one walk history. The look ramp is
additive because the contract has no slot for it — which is exactly the argument
in §7.1.

---

## 3. STAGE — *what exists, where*

**Emitted:** 152 stages, 294 assets, 303 instances, all with measured ink.

### Mapped cleanly

* **Plan stations pass straight through.** For the 53 scenes that resolve to an
  authored plan, a station's `x,z` *is* the contract's `x,z`. `z` is identical in
  both spaces (0..1, far..near); `x` is placed on the loader's own axis with
  `wx=(planX−0.5)·20` because `clampX` is `[-10,10]`, not `[0,1]`. Nothing is
  projected to screen space. Verified on OD-B22-S01: `bench_r1 (.82,.62) →
  x=6.4, z=0.62`; `table_r (.76,.70) → x=5.2, z=0.70`; `corner_dead (.10,.90) →
  x=−8, z=0.90`.
* **Every asset carries real ink.** Each non-figure module is drawn through this
  repo's own `keyedModuleCanvas` (which applies `borderKey`, the dot-law paper
  key), area-averaged into a 32×22 field, thresholded at the loader's own `0.14`,
  quantised to **ink 0–7**, and **bbox-trimmed**. 248 assets, 0 failures.
* **`instances[].scale` is derived by ink-fit.** The loader prints
  `gw = grid.cols·(W/16)·0.14·scale`, so `scale' = authoredScale/(GRID_W·0.00875)`
  — and `cols` cancels, because `cols` came from measuring the art. Size follows
  the ink, never the box. This is §7.4.

### Lossy / derived

* **99 of 152 stages are `derived:true`.** Books I–XV are collages with hand
  anchors and no shared plan. Their `z` is recovered by inverting the same depth
  model every scene composes through
  (`y' = 0.50 + 0.46·d^1.08`, `x' = 0.5 + (x−0.5)·(0.42+0.58·d)`), which is a
  bijection on the domain — so the inversion is exact *arithmetic* on a
  *reconstructed* premise. Every such stage is flagged, per scene, in
  `x_odyssey.derived`, and every reconstructed member carries
  `x_odyssey.derivedFrom = {anchor, model}`. Nobody should mistake it for
  authored blocking.
* **141 room placements have nowhere to go.** halfworld's STAGE has **no backdrop
  slot**: the ground plane is procedural and every entry in `instances[]` is a
  sprite hung on a floor mark. A `location.megaron-hall` downsampled into a
  32-column sprite and anchored at an `(x,z)` is a black slab over the scene. All
  `LOCATION`/`ENVIRONMENT` casts are therefore recorded in `x_odyssey.field`
  instead of being forced into a shape the contract does not have. **This is the
  single biggest structural gap**: open a book in the studio today and the people
  and props are right and the room is gone.
* **Whole-frame studies.** Some modules paint a *study* (the object in elevation,
  in plan, in section, with a caliper ledger) rather than an object on paper; they
  trim to a near-solid block. The scenes solve this with a hand-authored window
  per use (`PROP_WIN` in OD-B22-S01) — the contract has no window, so such assets
  are flagged `x_odyssey.wholeFrame:true` rather than silently printed as slabs.
  `ensemble.suitors` is one: 32×22, fill 1.00.
* **`rot` is always 0.** Nothing in the corpus authors a sprite rotation.

---

## 4. SCORE — *when it happens*

**Emitted:** 2,056 rows @ `fps:24`, `s`/`d` in **seconds**.
706 dialogue · 262 movement · 1,088 pose.

### Mapped cleanly — this is the richest win

* **`c` is the TRUE speaker.** From `performance-turns.sp`, never from
  `drive-script.speakerId`, which files ~76% of segments under
  `PERFORMER.NARRATOR`. Of 706 dialogue rows, **485 bind to a rig cast member**
  and 20 to a crowd instance. The join reduces a guise id to the person
  (`character.athena-as-mentor → athena`) across a closed, authored suffix set.
* **`t` is the authored first-person line**, from `spoken-lines.json` — not the
  third-person beat text. This is the difference between a character saying
  *"Now for another mark, one no man here has hit"* and a character saying
  *"Odysseus strips off his rags"*. See §7.3.
* **`s`/`d` are real studio timings.** **703 of 706 rows** are timed from
  `voice-manifest.json`'s per-segment `{gi,start,dur}`, joined through
  `drive-script`'s `sourceTurnId`; where a turn spans several segments the row
  takes `min(start)` to `max(start+dur)`. Only 3 rows fall back to a cursor.
* **Movement is authored, not guessed.** 262 `walk=x,z` rows come from each
  scene's own `MOVES` table with its real `t0`/`t1` — recovered by evaluating the
  scene module's top-level declarations (`MOVES` and `INITIAL` are module-local,
  so they are not importable), with the file's own imports bound first so that
  `INITIAL = {...PREV_EXIT}` resolves to the previous scene's `exitOccupancy`.
  **58 of 58** `MOVES` tables and **53 of 54** `INITIAL` tables parse.
* **Scrub-determinism holds.** Every row is `pose=`, `walk=`, or a `t` line, all
  of which `scoredState` derives from the playhead alone. Two consecutive runs of
  the builder produce **byte-identical** files.

### Lossy

* **Pose vocabulary: 57.6% resolved.** Of 1,961 pose uses, 1,130 resolve to one of
  the engine's 42 canonical `POSE_ID`s and then translate into halfworld's 38;
  **831 do not.** Those are per-actor poses (`eum_listen`, `penelope_grief`,
  `athena_resolute`) that this repo's *own* shared rig already collapses —
  `figure-hero.mjs:238` is literally
  `poseId = POSE_ALIAS[poseId] || (POSES[poseId] ? poseId : "neutral_front")`.
  We reproduce that rule exactly rather than guessing from English, plus one
  mechanical widening (retry an actor-prefixed name on its own tail against the
  same alias table: `eum_listen → listen → lean_forward`), which recovers 75 uses.
  Unresolved poses emit `neutral` and keep the true name in `x_odyssey.pose`.
* **Four canonical poses have no counterpart at all** and fall to `neutral`:
  `lean_forward`, `lean_backward`, `crouch`, `kneel`. halfworld's 38 have no torso
  lean and no lowered body. `lean_forward` alone is 19 cast uses — it is how this
  corpus writes *listening*.
* **1,204 `actor.gaze` ops are dropped.** `parseCues` has no gaze cue. Counted per
  scene in `x_odyssey.gaze`.
* **316 rows address a non-cast channel** (15% of all rows) and will never be
  applied by `scoredState`. 150 are `NARRATOR` — halfworld's SCORE has no bodiless
  voice, every row must address a cast id. The rest are crowd speakers
  (`ensemble.suitors` is a dot sprite, not a rig figure) and off-stage speakers
  (a god who speaks into a scene without being cast in it). The lines and timings
  survive in the file and in the EDL; only the *staging* of them is lost.
* **`fx.play` / `sound.cue` / `*.state` have no SCORE slot** and are preserved in
  `x_odyssey.fx`, `.sound`, `.states`.

---

## 5. MIND — *who decides*

**Not emitted, deliberately.** MIND is `{reply, changes:[op ≤ 8, validated,
clamped]}` — a *runtime* contract describing what a director may do to a stage,
not a persisted one. `MEMORY` has no `mind` field; the loader stores the mind's
endpoint in `localStorage['halfworld.mind']`, entirely outside the project.

What this corpus contributes to MIND is on the other side of the law of the
packet: the whole emitted score is **exactly what a MIND would have been allowed
to emit**. Every row is a `pose`, a `walk`, or a `say` — the same clamped verb set
a finger has, produced here by a build script instead of a model. The `ledger` in
each book records the generation as ops (`note`, `scene-save`), which is the
audit trail MIND's packets would land in.

The one Odyssey structure that is genuinely MIND-shaped and has no home:
`turn.conceal[]` / `turn.reveal[]` — what a speaker is *withholding* versus what
the line puts on the table. That is a decision model, and it is preserved per row
in `x_odyssey.conceal` / `.reveal`.

---

## 6. MEMORY — *what persists*

**Mapped cleanly.** One file per book, each a complete `halfworld/v2` project:

```
{ schema:"halfworld/v2", name:"ODYSSEY 22 · SLAUGHTER IN THE HALL",
  cast{}, assets{}, instances[], score{fps,rows},   ← the book's first scene, live
  scenes{ "OD-B22-S01 · Antinous Falls": {cast,assets,instances,score}, … },
  ledger[], nextId, turn, x_odyssey{…} }
```

This is `sceneSnap()`/`loadScene()`'s own model, not an invention: the project *is*
a stage, and `scenes` is the map of frozen stages. Opening a book shows its first
scene; the scene list is the book. `character ⊂ scene ⊂ world` holds — and one
book is a legible unit of "world". The whole poem in one file would be 5.6 MB and
152 scenes deep in a `<select>`.

`ledger` is append-only and records the build: a note, one `scene-save` per scene,
and a closing note with the counts and the ink resolution.

**Lossy:** the README's `worlds` key does not exist in the loader, so there is no
level above the book. `odyssey.index.json` is that level, outside the contract.

---

## 7. Four inventions from this repo that arguably belong in the contracts

### 7.1 `guise` belongs in CAST

**What it is.** One body, one base spec, and a set of named look-deltas with
continuous interpolation between them (`engine/guise.mjs`). Odysseus is
`king | restored | beggar | old-beggar | trojan-beggar`, one skin ramp, one hair
ramp, one scale ramp, and a garment that *snaps* at u=0.5.

**Proposed shape.** `CAST { id, spec, variants:{name:Δspec}, guise }` — where
`guise` is either a name or `{from,to,u}`, and `spec` at runtime is
`base ⊕ lerp(Δfrom, Δto, u)`.

**What breaks without it.** Character drift, and it is not hypothetical — this
repo already lived it. Before `guise.mjs`, Odysseus was *six separate modules*
(`odysseus`, `odysseus-restored`, `odysseus-as-beggar`, `odysseus-as-old-beggar`,
`odysseus-as-trojan-beggar`, `odysseus-memory-variant`) that had drifted apart;
one of them turned out to be params-identical to the base but for `scale:1.05` —
a *state* that had become a file. Without a variant channel, a contract forces
that outcome: the only way to say "the same man, disguised" is a second `id`.
And a second `id` in halfworld is a second body — `scoredState` seeds from
`P.cast[id].x,z` and accumulates only that id's walks, so the disguise costs you
the character's entire position and motion history at the moment of the reveal.
The Odyssey's central formal device — a man who is two people for six books and
one person again in the seventh — is exactly the thing the contract cannot say.

### 7.2 Plan-space stations + occupancy handoff belong in STAGE

**What it is.** A room authored **once**, top-down, as named points
(`scenes/_plans/megaron.mjs`: `threshold`, `axe_first`, `bench_r1`, `postern`).
Scenes reference stations by *name* and never compute an anchor. `blockingAt(plan,
MOVES, t)` resolves positions; `occupancyAt()` hands the room off to the next
scene as structured state, so `INITIAL = {...PREV_EXIT}` is literally where
everybody was standing when the last scene ended.

**Proposed shape.** `STAGE { plan:{id, stations:{name:{x,z}}}, instances:[{…,
station}], enter:{who:station}, exit:{who:station} }` — `x,z` stay, `station` is
the authored name they came from.

**What breaks without it: re-improvised rooms.** The numbers in §1 are the whole
argument. Books I–XV: every stage `derived:true`, ~45 rows a book. Books XVI–XXIV:
0–2 derived, ~150 rows. Same corpus, same tooling, one difference. Without a plan,
each scene invents its own anchors, which survives episodic travel and dies the
moment geometry becomes plot: in Book XXI the axe line, the two doors and the
sill are *facts sustained across dozens of shots*, and you cannot re-improvise the
hall each scene and have an arrow fly straight. And without occupancy handoff,
every scene must re-declare where everyone is, so continuity is retyped rather
than inherited — which is how it silently stops being true. The contract as
written has `instances[{x,z}]` and no memory: it can describe a room, but it
cannot describe *the same room again*.

### 7.3 Authored spoken lines + per-turn studio audio belong in SCORE

**What it is.** 706 turns each carrying an authored first-person **line**
(`spoken-lines.json`) *and* a **direction** (the stage business), separately; and
`voice-manifest.json`, which gives every turn a real recorded `{start, dur}` from
the studio take.

**Proposed shape.** `SCORE rows [{c, s, d, t, m, dir?, audio?:{file,start,dur}}]`
— `t` is what the character says, `dir` is what they do, and `s`/`d` may be
*sourced from* a take rather than typed.

**What breaks without it: characters speak stage directions.** The contract has a
single `t` per row and calls it what the character says. Feed it the beat text and
Odysseus's line becomes *"Odysseus strips off his rags, leaps onto the threshold,
and pours the remaining arrows before him."* — a character reading his own
blocking aloud. Keeping `t` and `dir` distinct is what lets the same row drive a
speech bubble and a pose. And without an audio binding, `s`/`d` are typed guesses:
here **703 of 706 rows** are timed from the actual recording, so scrubbing the
score and scrubbing the take are the same gesture. A score that cannot cite a
take is a score you have to re-time by hand every time the read changes.

### 7.4 Ink-fit placement — *measure the art, never the box* — belongs to the dot law

**What it is.** An asset's size is the extent of its **ink**, not the extent of
the canvas it was drawn on: draw, key the paper, bbox-trim, and let the trimmed
`cols×rows` be the object. This repo goes further and measures in *both*
directions — OD-B22-S01 sizes the feast board so a 0.82 m table prints 141 px
against a 288 px man, and lifts every figure by `0.10·scale` because the rig's
floor line sits at `H·0.90` of its own box, so feet land on the mark instead of
floating above it.

**Proposed shape.** State it in the law of the dot: *a placement is registered to
measured ink extents and named contact anchors, never to the drawing's box.*
Give assets `anchors:{feet,head,…}` — this repo's asset contract already has them
— and let `instances` place by anchor.

**What breaks without it: clipped art and floating bodies.** The contract's
`instances:[{assetId,x,z,scale,rot}]` places a *box* at a point, which silently
assumes the art fills its box and stands on its bottom edge. Neither is true.
Art that overshoots gets truncated at the canvas edge (`keyedModuleCanvas` has a
`pad` parameter for exactly this — staffs, raised arms, wings); art that
undershoots hangs in the air by however much margin it happened to be drawn with;
and two objects that must *touch* — a man and the board he falls across — can only
be aligned by hand-tuning `scale` per scene until it looks right, which is the
same drift as §7.1 in a different register. The dot law already promises that
"any renderer can draw any contract." It should promise the second half too: that
any renderer will draw it *the same size*.

---

## 8. Honest ledger

**What the loader required that we could not supply:** `spec.build`, `spec.headS`,
`spec.shirt` and the face metrics `browW/eyeS/mouthW` — 403 characters each, filled
from halfworld's own `HERO` preset and declared here. This corpus names 81 bodies
and 7 garments but records no body mass and no cloth colour.

**Everything additive is namespaced** under `x_odyssey` — on the project, on each
scene, on each cast entry, each asset, each instance and each score row. A strict
loader ignores it (`normalizeProject` never touches unknown keys and
`serializeProject` only strips `_`-prefixed and runtime keys), so the files are
valid `halfworld/v2` with the Odyssey riding along in the margin.

**Verification:** 24/24 books validate against a checker written from the loader's
code paths (`harness/validate-halfworld-memory.mjs`) — 0 errors, 316 warnings, all
one class (rows addressing a non-cast channel). All 24 re-read and re-parse with
counts matching the index exactly. Two consecutive builds are byte-identical.

**Live load.** Book 22 was served to an unmodified `halfworld-studio.html` and
handed to its own embedding surface:

```
window.HALFWORLD.load(book22)          -> true
P.cast                                 -> ["odysseus","telemachus","antinous"]
P.scenes                               -> 8
page errors                            -> 0
stage ink                              -> 58,520 painted pixels

scoredState("odysseus", 13)
  { x:0, z:0.16, pose:"stop", face:-0.62, talk:1,
    say:{ text:"Now for another mark, one no man here has hit.", u:0.144 } }
```

At t=13 s the studio has him on the sill (`threshold` = plan `.50,.16`, arrived at
t=8 by the `axe_first → threshold` walk row), in a forward-reaching pose, three-
quarter left, one seventh of the way through the line — driven entirely by
`scoredState` off the playhead. The corpus is not merely valid; it plays.

The render also makes §3's `wholeFrame` flag visible: the feast board, a
whole-frame study, prints as a large dense block on the right of the stage
because the contract gave it no window to crop to.
