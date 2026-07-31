# media/ — the same 152 scenes, in other media

Drop folder for scene renderings made **outside** the procedural halftone engine: ukiyo-e
woodblock prints, cartoon/comic panels, claymation diorama photographs, video clips from other
tools. `odyssey-syncwatch.html` shows them as extra panes on the same master clock, so one beat
can be compared across media.

## The convention

```
media/<styleName>/<anything-containing-a-scene-id>.<ext>
```

One folder per style. The folder name **is** the style (`ukiyo-e`, `clay`, `cartoon`, `sora`).
The filename only has to contain the scene id somewhere — the rest is yours.

```
media/ukiyo-e/OD-B17-S03.png
media/clay/od-b17-s03_take2.jpg            ← lowercase, suffix, different extension
media/cartoon/OD-B17-S03-beat2.png         ← beat 2 of that scene
media/sora/OD-B22-S01.mp4                  ← video
media/ukiyo-e/ODB24S09.png                 ← no hyphens at all
media/clay/kitchen-table-lit-well-ODB16S01-final.jpeg
```

**Scene id** is matched case-insensitively as `OD-?B<book>-?S<scene>` anywhere in the name and
normalised to the canonical `OD-BNN-SNN`. `od-b17-s03`, `ODB17S03` and `OD-B17-S03` are the same
scene. The canonical list of 152 ids is `scenes/*.mjs`.

**Beat (optional).** A `-beat<N>`, `_beat<N>`, `-b<N>` or `_b<N>` suffix *after* the scene id gives
the beat number: `OD-B22-S01-beat3.png` is beat 3. Read only from the tail, so the book number in
`od_b17_s03` can never be mistaken for a beat. No suffix → `beat: null`.

**Extensions.** `png jpg jpeg webp avif` are images; `mp4 webm mov` are video. Anything else is
skipped and reported.

**Several files for one scene** is fine and useful: multiple beats, or several takes. The pane
holds a single image for the whole scene, and dissolves between several across the scene's
duration — numbered beats set the timing, unnumbered takes divide the duration evenly. Order is
beats ascending first, then unnumbered by filename.

**Subfolders** inside a style folder are allowed (they are flattened; the path still has to carry
the id).

## Build

```
node harness/build-media-manifest.mjs          # writes viewer/media-manifest.json
node harness/build-media-manifest.mjs --quiet  # skip the "next to generate" lists
```

It prints, per style, how many of the 152 scenes are covered and the first few scene ids still
missing — that list is your generation queue.

## Notes

- Re-run the builder after every drop; the viewer reads the manifest, never the folder.
- **Serving video:** `harness/serve.mjs` has no MIME entry for `.mp4` / `.webm` / `.mov` / `.webp`,
  so browsers get `application/octet-stream` and refuse to decode the clip. Add them to its `MIME`
  table (one line) before using video panes — not done here because that file is tracked and this
  build is strictly additive. Images (png/jpg/jpeg) already work as-is.
- Video panes are **scrubbed** by the master clock, never played on their own timebase, so a clip
  of any length maps onto the scene's duration. Clips close to the real scene length read best.
- Keep files reasonably small — every pane in syncwatch loads at once.
- `media/README.md` and `media/.gitkeep` are the only files committed here by default; check the
  repo's policy before committing large binaries.
