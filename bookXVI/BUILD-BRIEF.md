# BUILD BRIEF — Books XVI–XXIV

You are building one piece of a procedural halftone atlas of the Odyssey.
Repo root: `/Users/gaia/Downloads/odyssey-halfworld` — `cd` there first.

## THE ONE HARD RULE

**ADDITIVE.** Books I–XV are finished and must stay bit-identical. Create only the new
file(s) you were assigned. Never modify a tracked file. When you finish, run
`git status --short`: your new file(s) must appear as `??` and **nothing** may appear as ` M`.
(Exception: if you were explicitly assigned an existing *untracked* Book XVI+ file, editing
that one is fine.)

## READ FIRST (do not skip — these define the quality floor)

1. `engine/halfworld-engine.mjs` — primitives, `renderAsset`, `placeInstance`, the dot law, the card
2. `engine/asset-contract.mjs` — the contract, `TYPE_SPEC`, `validateAsset`
3. `engine/figure-hero.mjs` — the rig, `POSES`, `POSE_ALIAS` (only if you are building a figure)
4. A **sibling exemplar of the same type** already in `assets/<type>/` — open its `.mjs` AND
   render it so you *see* the target look before writing anything.

## THE LOOK (the quality floor — match it exactly)

- Warm off-white paper, HARD black structural contour, eight quantized ink levels, ordered-dot HALFTONE.
- Blocky, diagrammatic, procedural geometry. Crisp monochrome.
- NO gradients, painterly texture, photorealism, cinematic blur, or baked-in unrelated figures.
- The engine draws the card (label top-left, blue mark top-right, status word + meter bottom-left).
- **Tonal balance matters**: a room or figure that renders as one near-black mass fails, and so does
  one that renders nearly empty. Aim for the range you see in the exemplar — plenty of paper showing.

## THE LOOP (this is the point — verify against a real image, not your imagination)

```
node harness/render.mjs <your-path.mjs> --pipeline MESH      # assets
node harness/render-scene.mjs scenes/<ID>.mjs --t <sec>      # scenes
```

Both print `[OK]`/`[FAIL]` + JSON with errors and write a PNG. **Read the PNG with the Read
tool and look at it critically.** Does it read as the thing? Right silhouette and structure?
Clean contour? Good tonal range? Card correct? Revise and re-render — up to 3 iterations.
Stop only when it both validates and genuinely looks right.

---

# IF YOU ARE BUILDING A SCENE

Books I–XV were collages: every scene invented its own anchors, so the same room was a
different room each time. That cannot survive Books XXI–XXII, where the axe line, the two
doors and the position of every body are **plot**, sustained across dozens of shots.

**Read `scenes/OD-B16-S03.mjs` first — it is the reference scene. Copy its shape.**

**A. No hand-placed figure anchors.** Import the room's plan and resolve every position through it:

```js
import { megaron } from "./_plans/megaron.mjs";          // or ./_plans/eumaeus-hut.mjs
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
const MOVES = [ { who:"odysseus", from:"threshold", to:"hearth", t0:6, t1:11 }, ... ];
const block = blockingAt(PLAN, MOVES, t, INITIAL);       // -> { who: {x,y,scale,d} }
```

Stations are referenced **by name**. `blockingAt()` throws on an unknown station — that is the
cross-room continuity check; don't work around it, use a real station. If the scene plays
somewhere with no authored plan (a road, an orchard, the underworld, Olympus), author a small
local plan at the top of the file with `makePlan({ id, name, stations })` and block through it
the same way. Keep the discipline outdoors too.

**B. Contact pairs.** Two bodies that touch — embrace, grapple, hand something over, a killing
blow — must never resolve to the same station or they land on identical coordinates. Use a
paired station (`centre_l`/`centre_r` and their kin), or add a pair to your local plan.

**C. One body, many guises.** Odysseus in Books XVI+ is `character.odysseus-b16`
(`assets/character/odysseus-b16.mjs`) — ONE module with a guise channel
(`king | restored | beggar | old-beggar | trojan-beggar | memory`), never a cut between
`.odysseus-as-beggar` and `.odysseus-restored`. Pass `{ guise:"beggar" }`, or during a
transformation `{ guise:{ from:"beggar", to:"king", u } }` with `u` ramping 0→1: skin, hair and
height interpolate continuously and the garment **snaps** at `u=0.5`. Put
`divine_fx.athenas-restoration` on exactly that snap frame — the flare exists to cover the one
discontinuity. Read the module before using it.

**D. Rooms are state, not new rooms.** The great hall is ONE asset, `location.megaron-hall`,
with a state channel (`day|feast|night|contest|battle|aftermath|cleaned`). The swineherd's hut is
`location.eumaeus-hut-interior`. If the atlas asks for "night-palace-hall", "festival-ready-hall",
"aftermath-hall", "cleaned-palace-hall" or "palace-night-interior", that is the **same megaron in a
different state** — cast `location.megaron-hall` and pass the state. Never build or cast a second hall.

**E. Structured handoff.** Export `exitOccupancy` next to the prose `exitState`, **computed**, never
hand-written:

```js
export const exitOccupancy = occupancyAt(PLAN, MOVES, DURATION, INITIAL);
```

If the previous scene of the book exports `exitOccupancy`, import it as your `INITIAL`
(`import { exitOccupancy as INITIAL } from "./OD-BNN-SNN.mjs";`) so this scene opens with every
body exactly where the last one left it.

**F. Scene shape.** Follow `scenes/_scene-contract.mjs` exactly: export `scene` (and default) with
`id, title, book, beats, exitState, duration, cast[], timeline[], stage(offctx,W,H,t)`.
In `stage()`, import the asset modules and call `placeInstance(...)` for each cast member —
**place, never redraw**. Order cast back→front. Keep it deterministic (no `Date`, no `Math.random`).
The engine runs one dotify + one card over the whole stage, so the scene shares a single halftone.

**Verify a scene at two moments** (`--t` early and `--t` late) and read both PNGs. Blocking bugs —
two bodies converging on one point, a figure drifting off the floor — only show up across time.
