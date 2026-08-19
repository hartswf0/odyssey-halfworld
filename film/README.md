# film/ — the renders are NOT in the repository

Everything in this directory except this file is gitignored. The Odyssey master
is 12.7 GB; the short film is 434 MB. Both are reproducible from what IS
tracked — the scenes, the atlas, the engine, the voice recordings and the
harness. This file is the instruction for rebuilding them.

Requires `ffmpeg`/`ffprobe` on PATH and a local web server at the repository
root (`python3 -m http.server 8000`), because every render driver loads a page.

---

## SPOKEN INTO BEING — the short film (4m43s, 1920×1080, 24 fps)

Eight movements cut from real material: 32 atlas assets and 6 staged scenes,
each printed in the words of its own scene. Voice is the studio recording for
that scene, trimmed to the segment the cue is built on. The bed is five
movements of *Bronze Council, Waking Son*, anchored to cue ids rather than to
seconds, so re-timing the cut re-times the music with it.

```
# 1 · score + soundtrack (both derived from the same pass — they cannot drift)
node harness/build-sundance.mjs            # writes film/sundance-score.json
                                           #    and film/sundance-audio.m4a
node harness/build-sundance.mjs --score    # score only, no ffmpeg

# 2 · picture, driven off odyssey-sundance.html at the film's spec.
#     The page NAMES its own soundtrack (window.__title.track), so there is no
#     --audio flag: step 1 must have run, or the mux has nothing to attach.
node harness/render-title.mjs --page odyssey-sundance.html \
     --out film/SPOKEN-INTO-BEING.mp4 --w 1920 --fps 24
```

`build-sundance.mjs` refuses to finish if the soundtrack does not match the
score's total to within 0.15 s, and refuses to start a bed movement it cannot
fill from its track. Both refusals exist because a mix once passed the length
check while being silent — the file was the right length and empty inside it.

**Verify** (do this; the length check alone has lied before):

```
ffprobe -v error -show_entries stream=width,height,r_frame_rate -of csv=p=0 \
        film/SPOKEN-INTO-BEING.mp4                       # 1920,1080,24/1
ffprobe -v error -count_frames -select_streams v \
        -show_entries stream=nb_read_frames -of csv=p=0 \
        film/SPOKEN-INTO-BEING.mp4                       # 6796 = 283.17s × 24
for t in 5 90 190 268 280; do \
  ffmpeg -hide_banner -ss $t -t 2 -i film/SPOKEN-INTO-BEING.mp4 \
         -af volumedetect -f null - 2>&1 | grep mean_volume; done
```

The render prints `muxed audio: …` when the soundtrack attached. `no audio
track named by the page` means it did not, and the file beside it is silent.

No probe may come back at −91 dB. That is digital silence, and it is what
twenty-one seconds of this film's ending used to be.

If only the sound needs rebuilding, the picture does not have to be rendered
again — `render-title.mjs` leaves a `.silent.mp4` beside its output:

```
ffmpeg -y -i film/SPOKEN-INTO-BEING.silent.mp4 -i film/sundance-audio.m4a \
       -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -movflags +faststart \
       film/SPOKEN-INTO-BEING.mp4
```

---

## THE ODYSSEY — the full master (~3h, 12.7 GB)

```
node harness/build-film.mjs                # score from drive/ + the atlas
node harness/build-film-audio.mjs          # film/odyssey-audio.m4a
node harness/render-film.mjs               # film/odyssey-video.mp4 (hours)
node harness/assemble.mjs                  # title + credits + film → ODYSSEY.mp4
```

`assemble.mjs` renders the title (`odyssey-title` in the harness) and the end
credits (`odyssey-credits.html`) **through the film's own pipeline at the film's
own spec** rather than converting them afterwards, then conforms every piece
with the film's exact encoder arguments:

```
-color_range pc -c:v h264_videotoolbox -b:v 10M -allow_sw 1 -pix_fmt yuvj420p
```

and refuses to concatenate unless all pieces agree on `width`, `height`,
`pix_fmt`, `color_range`, `profile`, `level` and `r_frame_rate`. A concat of
mismatched pieces produces a file that plays and is wrong.

---

## Why nothing here is committed

The dot law makes these files large and perfectly deterministic: same scenes,
same atlas, same engine, same frames. Storing the output would be storing a
cache of the repository. What is worth keeping is the instruction that
reproduces it, and the refusals that stop it being reproduced wrongly.
