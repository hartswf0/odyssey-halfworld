/* ============================================================
   SCENE  OD-B22-S08 — The House Calls Penelope   (Od. 22.480–end)
   Book XXII, scene 8 — the last scene of the book. ADDITIVE: adds nothing to
   Books I–XV, modifies no existing module, and casts only assets that already
   exist. Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and
   from its predecessor, scenes/OD-B22-S07.mjs, whose room, figure law, layer
   discipline, window machinery and near-floor register are inherited here.

   Beats (causal order, one master clock):
     1. Odysseus calls the nurse for fire and sulphur so the hall can be
        purified; she fetches them by the postern.
     2. The fumigation sweeps the hall from the throne end out through the
        great doors, and the room comes out of `aftermath` into `cleaned`.
     3. The women who kept faith come down from their quarters with torches
        and stop short of him: they will not believe it.
     4. They read the scar and the voice, the arc collapses inward, and they
        take his head and his hands and his shoulders, weeping.
     5. He receives them with the grief held down and the doors still watched,
        and sends Eurycleia up the stair to wake the queen.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ONE ROOM, ONE PLAN, ONE CLOCK. Everything plays in the megaron and every
      body resolves through scenes/_plans/megaron.mjs by station NAME. There is
      not one hand anchor on a figure in this file, and no second room: the
      women's quarters and the queen's chamber are both OFF this plan and are
      reached through stations that exist on it (`doorway_maid`, `stair_up`).

   B. THE ROOM IS STATE, AND IT ADVANCES EXACTLY ONCE. S07 handed the hall over
      still in `aftermath` — "the washing itself is S08's, where Odysseus calls
      for fire and sulphur" — and megaron-hall has no half-purified node. So
      the field is location.megaron-hall in `aftermath` up to PURE and in
      `cleaned` after it, and that single cut is the ONLY discontinuity in the
      picture. It is placed the way the guise snap is placed in the reference
      scene: on the one frame the cover exists for it. At PURE the sulphur
      window is at its peak — the front has crossed the last zone and the
      chevron is off the end of the strip — and the room that comes back has
      its great doors OPEN, a fresh fire, bright clerestory, no blood, and the
      sulphur brazier smoking beside the hearth, which `cleaned` draws itself.
      Nothing else in this file cuts.

   C. THE LAYER LIST IS S07'S, MINUS THE THINGS THE RING WOULD STAND IN.
      `furniture` and `throne` are OFF: in `cleaned` the benches come back to
      `bench_l1`/`bench_r1` (frame 280 and 839 at y 589) and the throne is a
      near-camera box across the spine at y 632..700 — all three land inside
      the contact ring's own floor band (note E) and would print out from
      under the women. `axes` is OFF for the same reason: the twelve helves
      are a black column down the spine exactly where Odysseus ends up
      standing, and S07's note H records what that column does to a figure.
      `stair` is ON, and it is ON because it is PLOT: the last beat is a body
      being sent up it. `litter` is ON and carries itself — `blood` while the
      hall is `aftermath`, `none` the moment it is `cleaned`.

   D. THE RING IS THE ASSET'S OWN SPINE, SOLVED ONTO THE PLAN — NOT PLACED.
      ensemble.loyal-maids is authored for this scene and is one movement: a
      wary arc that becomes an embrace. It owns a FOCUS (the floor point the
      man stands on, .545,.762 of its box), a contact RING round it, an ENTRY
      (their door) and one depth ramp. So the box is SOLVED off Odysseus'
      blocked mark every frame — his projected station is put on the asset's
      own FOCUS — and the ring therefore closes on the body the plan is
      tracking, not on a guess. Two things follow and both are the point:
        · CONTACT WITHOUT CO-LOCATION. Nobody stands on the focus; every woman
          keeps her own stand-off (`radMul*(0.90+0.24*rng)`) and her hands are
          aimed at CHEST/SCAR/head in world space and stop short by her own
          reach. The embrace is contact, not two bodies on one point, which is
          exactly what note B of the brief asks a touching pair to solve.
        · THE ENSEMBLE IS MIRRORED. Its ENTRY sits 0.433 of a box-width to the
          LEFT of its focus; the megaron's women's door (`doorway_maid`) and
          the queen's stair (`stair_up`) are both on the RIGHT, at plan x .94
          and .92. Blitting the box mirrored puts the door the women come out
          of at frame (950, 400) — deep right, against the drawn `maidsdoor`
          wall — instead of at the postern, which is the arms passage and the
          wrong side of the house. Mirroring is geometrically total: every
          woman turns inward on the focus, so nothing about the convergence
          changes, and it is a blit transform, not a redraw. CTX OVERPAINT ON
          EVERY FIGURE IN THIS FILE IS ZERO.

   E. THE ENSEMBLE'S MEMBERS ARE ABSOLUTE PIXELS, SO THE BOX IS SOLVED, NOT
      GUESSED (S07 note D, same law). loyal-maids sizes a woman in PIXELS —
      depthScale() ramps 76px at its yBack to 152px at its yFront — while
      every position it uses is a fraction of its canvas. So rendering it on a
      SMALLER canvas and blitting it up leaves the composition untouched and
      grows the women by exactly the blit factor, and the stroke weights grow
      with them because the member template scales every line off s.
      The box is then fitted against the ROOM'S own figure law
      (h = H·K·(0.60+0.50 d)·1.08, the same law every rig figure in Books
      XVI+ stands by), read at the two floor lines the ring actually has:
        ZOOM 1.72, box 900 x 960, focus on `axe_last` (frame 560, 632)
          ring BACK   floor y 521  member 180px   plan body 222 x WOMAN 178
          ring FRONT  floor y 744  member 240px   plan body 299 x WOMAN 239
      WOMAN is 0.80 here and not the 0.94 S07 used for the same reason S07
      solved a separate zoom per formation: the number is fitted to the
      picture, not assumed. At 0.94 (zoom 2.00) the twelve came out 279px on
      the near line against a 264px king standing at the middle of his own
      ring, every crown landed in one horizontal band, and HE DISAPPEARED —
      the subject of the scene lost inside the crowd that is supposed to be
      recognizing him. At 0.80 the tallest woman is 240px, he is 264px and
      drawn between the two bands, and he is the largest body on the floor,
      which is what the shot is about. Under-shooting the other way is worse
      and known: a draft blitted at 1.0 would put a woman on the near floor at
      70px against a 299px body on the same line — S07's "they read as
      children". The box is 523x558 in source and 900x960 on the stage; the
      halftone is run once over the whole frame afterwards, so the blit lives
      inside the same dot lattice as everything else.

   F. NOBODY IS COINCIDENT, AND THE RING WAS SIZED TO KEEP IT THAT WAY.
      ODYSSEUS holds `axe_last` (frame 560, feet 632, 264px) from t=42 — dead
      centre of the ring, on the cleaned spine, with `axes` off so the spine is
      empty ground. Before that he is on S07's own `table_r` (801, 618), where
      the order for fire is given, exactly as S07's exitState says.
      EURYCLEIA goes out by the `postern` for the coals and comes back down
      the LEFT of the hall to `bench_l1` (280, feet 589, 247px), which the
      layer list has left as clear floor — a draft brought her back to
      `axe_first` instead and stood her dead on the spine with the barred
      great doors printing a black panel the exact width of her head directly
      behind it. From `bench_l1` she crosses to `doorway_maid` (881, feet 510,
      218px) to call the women down, and she holds that mark through the whole
      recognition: it is one depth band DEEPER than the ring's nearest
      right-hand member (837, feet 649) and 139px above its floor line, so she
      reads as a smaller body standing behind the group's right shoulder and
      never merges with it. Both of her crossings happen before the women are
      in the hall at all. The one place she is close to them is deliberate and
      lasts eight seconds: the mirrored ensemble's own door lands at frame
      (950, 400) and its aisle runs from there to (875, 565), so between COME
      and WARY the file comes out PAST HER, at the door she called them
      through — she is deeper and higher than every woman in it (crown 292
      against the nearest member's 375) and the group reads as coming from
      where she is standing, which is the fact of the beat.
      THE TWELVE stand on the ellipse: frame x 274..846, floor y 521..744, and
      their own per-member stand-off keeps them off each other.
      `stair_up` (938, 603) is 101px clear of the ring's right end, which is
      why the ring was fitted at 900 wide and not wider.

   G. THE FUMIGATION IS A DETAIL WINDOW, BECAUSE THE ROOM ALREADY OWNS THE
      BRAZIER. environment.sulfur-and-purification-fire is a whole 3:4 working
      plate — gauge strip, a section of the hall along its length, a zone strip
      and a seven-segment readout. Stood in the megaron as an object it would
      dissolve; and the thing it depicts, the smoking brazier, is drawn by
      `cleaned` itself at the hearth's own coordinates. So it is laid down the
      way S03/S04/S07 and OD-B21-S02 lay down their instruments: as a DETAIL
      WINDOW with its own paper field and one hard rule, blitted at a declared
      crop, drawn last.
        · WINDOW = x .062..0.940, y .628..0.892 of the plate — the ZONE STRIP
          and nothing else: five megaron zones in sweep order, each a light
          plane with a hard contour, carrying flecks while it is still
          tainted, a diagonal hatch while the front is crossing it and one
          bold X when it is purged, with a state chip hung under each and the
          front's stub and chevron crossing the row. `layers:["zones"]` — the
          section, the gauge and the readout are not drawn at all: at this
          reduction the readout's digits would be 27px marks in a dot lattice,
          which is the failure the brief names. What survives is GEOMETRY.
        · DESTINATION = x .578..0.950, y .048..0.2679 (417 x 167, the crop's
          own 2.50 aspect, so nothing is stretched), the same top-right patch
          S04 and S07 used, above every crown in the room.
        · IT COMES DOWN AT COME. Once the women are on the stair the hall is
          purified and the instrument has nothing left to report; the frame
          from there on belongs to the ring. One window at a time, never two,
          and for the last half of the scene, none.

   H. THE STAIR IS NOT CLIMBED, AND THAT IS DELIBERATE. megaron-hall draws the
      stair as a compressed elevation — seven treads of H*0.026 and an upper
      door only H*0.094 tall — so a 253px nurse walked up it would arrive four
      times the height of the doorway she is being sent through. The honest
      reading of "he sends her up" is a body on `stair_up`, at the stair's
      foot, turned onto it, with the order still in the air; the climb belongs
      to Book XXIII. `exitOccupancy` records her there, which is precisely the
      state the next scene needs.

   I. TONE. Two rig figures with ZERO ctx overpaint; one ensemble box whose
      big shapes are LIGHT peploi (levels 1–3) with dark girdles, hair and
      torch heads; a room held to S07's frame, with the upper third, the two
      near corners and the whole lower fifth of the floor left as paper by
      construction; and one window that is five paper tiles with the ink in
      the contours, the flecks, the hatch and the X. No ACCENT marks anywhere:
      the POST pass quantizes by luminance and a blue mark prints BLACK. The
      `cleaned` state lifts the floor a level (`floorLift:-1`) and opens the
      doors, so the second half of the scene is measurably lighter than the
      first — which is the whole subject.

   J. WHO IS DROPPED, AND WHY. S07 hands over seventeen keys. NOTHING is
      dropped from the OCCUPANCY. Fourteen are dropped from the PICTURE,
      keeping their keys and stations so Book XXIII receives the room as
      Book XXII left it:
        · `telemachus`, `melanthius`, `maids` (the disloyal twelve) —
          all three went OUT in S07 and are in the courtyard; `maids` is
          recorded on `threshold`, the hall station it left by, and the twelve
          hang there dead. None of them is in this room.
        · `suitors`, `antinous`, `eurymachus`, `amphinomus`, `leiodes` — the
          dead, carried out to the wall by the twelve in S07. Their keys are
          the ground those bodies were lifted off, not bodies.
        · `phemius`, `medon` — spared at the doors in S06 and not cast here;
          the atlas asks for the loyal women, the nurse and the king.
        · `eumaeus`, `philoetius` — off the working floor on S06's own marks.
        · `tables`, `board`, `arms` — props S03–S07 window in; this scene has
          its own window and it is the fumigation.
      One key is ADDED: `women` (ensemble.loyal-maids) at `hearth` — the
      room's heart, where the ring closes. It is deliberately NOT `axe_last`:
      NO STATION IN THIS FILE CARRIES TWO DRAWN BODIES, and Odysseus is on
      `axe_last`. (`axe_last` does carry `philoetius` as well, on the mark S06
      left him — but he is bookkeeping, not a body, and that is the whole
      list.) The group's transit from the door to the ring is INTERNAL to
      the asset (its own ENTRY -> radial -> contact-ring spine, driven by the
      `approach` channel), which is why `women` needs no move: the plan
      records where the group IS, and the asset owns how it got there.

   CONTINUITY IN — INHERITED, NOT ASSERTED.
      import { exitOccupancy as INITIAL } from "./OD-B22-S07.mjs";
   S07 ends in THIS hall and every station it hands over is a megaron station,
   so no translation table is needed and nobody is dropped from the occupancy.

   Verify (the fumigation, and the embrace):
     node harness/render-scene.mjs scenes/OD-B22-S08.mjs --t 34
     node harness/render-scene.mjs scenes/OD-B22-S08.mjs --t 82
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import eurycleia  from "../assets/character/eurycleia.mjs";
import women      from "../assets/ensemble/loyal-maids.mjs";
import sulfur     from "../assets/environment/sulfur-and-purification-fire.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 100;

/* ---- THE CLOCK ---------------------------------------------------------- */
const ORDER  =  6;   // "fire, and sulphur, and let the hall be purified"
const FETCH0 =  9;   // the nurse crosses to the postern
const FETCH1 = 17;   // and is out of the room
const BACK0  = 21;   // back with coals and a lump of sulphur, down the spine
const BACK1  = 31;
const KINDLE = 24;   // the sulphur catches and hisses
const SWEEP  = 30;   // the front starts down the hall
const CALL0  = 42;   // she goes to the women's door to call them down
const CALL1  = 49;
const WALK0  = 36;   // he comes off the tables into the middle of his own hall
const WALK1  = 46;
const SAT    = 40;   // the hall full wall to wall
const PURE   = 46;   // THE ONE CUT: aftermath -> cleaned
const COME   = 50;   // the women who kept faith come down with torches
const WARY   = 58;   // they stop: they will not believe it
const SCAR   = 64;   // torches lowered onto the mark above the knee
const RECOG  = 70;   // the wave goes through them
const HOLD   = 78;   // head, hands, shoulders
const SEND   = 88;   // "go up and wake her"
const STAIR0 = 88;
const STAIR1 = 94;

const ramp = (t, a, b) => clamp01((t - a) / Math.max(1e-6, b - a));

/* ---- CONTINUITY IN — INHERITED, NOT ASSERTED (note J) ------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B22-S07.mjs";
const ENTERING = { women:"hearth" };          // the one key this scene adds
const INITIAL  = { ...PREV_EXIT, ...ENTERING };

/* ---- BLOCKING. Stations, not coordinates. -------------------------------
   Three moves and no more: the nurse goes out for the fire and comes back,
   the king walks into the middle of the purified hall, and the nurse is sent
   to the stair. The twelve women do not appear here because their transit is
   the ensemble's own spine (note J). */
const MOVES = [
  { who:"eurycleia", from:"doorway_maid", to:"postern",      t0:FETCH0, t1:FETCH1 },
  { who:"eurycleia", from:"postern",      to:"bench_l1",     t0:BACK0,  t1:BACK1  },
  { who:"eurycleia", from:"bench_l1",     to:"doorway_maid", t0:CALL0,  t1:CALL1  },
  { who:"odysseus",  from:"table_r",      to:"axe_last",     t0:WALK0,  t1:WALK1  },
  { who:"eurycleia", from:"doorway_maid", to:"stair_up",     t0:STAIR0, t1:STAIR1 },
];

/* one figure scale for the whole cast; the plan's depth law does the rest.
   K is S01–S07's, unchanged. */
const K = 0.42;
/* a woman of the house against the plan's own body on the same floor line.
   FITTED, not assumed — see note E: 0.94 buried the king inside his own ring. */
const WOMAN = 0.80;

/* placeFigure — verbatim in intent from S01–S07: the lift puts FEET on the
   mark. Every figure in this scene is pure rig with no ctx-drawn cloth. */
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  placeInstance(offctx, W, H, mod, {
    anchor:{ x:anchor.x, y:anchor.y + 0.10 * scale }, scale, state,
  });
}

/* ---- THE RING (notes D, E). One blit, one zoom, one solved box. ---------
   RING.fx/fy are the ASSET'S OWN focus in its box space, so putting them on
   the projected mark stands the contact ellipse on the plan's floor rather
   than on a guess — and because the point comes from blockingAt() and not
   from a station name, the ring walks with Odysseus if he ever moves again.
   MIRROR flips the blit so the women come out of the right-hand door. */
const RING = { cw:900, ch:960, zoom:1.72, fx:0.545, fy:0.762 };
function ringRect(W, H, p){
  return { w:RING.cw, h:RING.ch,
           x: p.x * W - (1 - RING.fx) * RING.cw,   // mirrored: 1 - fx
           y: p.y * H - RING.fy * RING.ch };
}
/* the shell (their door, a pillar, a broken wall line), the convergence field
   diagram and the focus mark are the ASSET'S OWN room fragment and would
   print straight through the megaron; they are off. What is left on that
   canvas is twelve women and the two faint sight bundles that say what each
   face is reading him by.
   TWO BANDS, NOT ONE (note F). The asset sorts every member into band-back
   (deeper than the focus), band-mid (level with it) and band-front (nearer),
   and says so: "a scene may pass a subset for reveal / occlusion". So the ring
   is blitted TWICE — the far arc AND the arc level with him behind the king,
   the near arc in front of him — and he is drawn between them. One blit would
   have pasted him flat on top of women standing nearer the camera than he is;
   a draft that did exactly that lost him entirely inside a band of heads all
   the same height, which is the failure the whole fit in note E exists to
   prevent. */
const RING_BACK  = ["sight","band-back","band-mid"];
const RING_FRONT = ["band-front"];
function blitRing(offctx, rect, state, layers, tag){
  const cw = Math.max(64, Math.round(rect.w / RING.zoom));
  const ch = Math.max(64, Math.round(rect.h / RING.zoom));
  const sig = `lm${tag}|${state.formation}|${Math.round((state.approach ?? 0) * 20)}`
            + `|${Math.round((state.wave ?? 0) * 20)}`
            + `|${Math.round((state.radius ?? 1) * 20)}`
            + `|${Math.round((state.weeping ?? 0) * 20)}`
            + `|${Math.round((state.density ?? 1) * 20)}`
            + `|${state.torches ?? 0}|${cw}`;
  const cv = keyedModuleCanvas(women, cw, ch, { ...state, layers }, sig);
  offctx.save();
  offctx.translate(rect.x + rect.w, rect.y);
  offctx.scale(-1, 1);
  offctx.drawImage(cv, 0, 0, rect.w, rect.h);
  offctx.restore();
}

/* the recognition ladder on the master clock. One number renders each channel
   — nothing here is a branch inside the asset's body. */
function ringAt(t){
  const closing = ramp(t, RECOG, HOLD);
  const formation = t < WARY  ? "file"
                  : t < RECOG ? "wary-arc"
                  : t < HOLD  ? "converging"
                  :             "embracing";
  return {
    formation, count:12, spread:0.85, lag:0.62, seed:2208,
    density: t < WARY ? 0.55 + 0.45 * ramp(t, COME, WARY) : 1.0,
    approach: t < WARY  ? 0.18 + 0.34 * ramp(t, COME, WARY)
            : t < RECOG ? 1.0
            :             0.72 + 0.26 * closing,
    /* the ring never closes tighter than 1.06. The asset's own `embracing`
       preview wants 0.86, and at 0.86 twelve gowns at this blit fused into one
       black band with the king inside it; 1.06 keeps a hand's width of paper
       between the women and still lands every reaching hand on him, because
       the hands are aimed in WORLD space and stop short by their own reach. */
    radius: t < SCAR  ? 1.06
          : t < RECOG ? 1.26
          : t < HOLD  ? 1.14
          :             1.06,
    wave: t < SCAR  ? 0.05
        : t < RECOG ? 0.06 + 0.52 * ramp(t, SCAR, RECOG)
        :             0.62 + 0.46 * closing,
    waveSpread: t < RECOG ? 0.22 : 0.32,
    attention: t < WARY ? 0.62 : t < RECOG ? 0.98 : 0.90,
    weeping: t < RECOG ? 0 : 0.26 + 0.24 * ramp(t, HOLD, D),
    torches: t < WARY ? 5 : t < RECOG ? 6 : t < HOLD ? 3 : 2,
    showShell:false, showField:false, showFocus:false,
    status: t < WARY  ? "COMING DOWN"
          : t < SCAR  ? "NOT BELIEVING"
          : t < RECOG ? "THE SCAR"
          : t < HOLD  ? "RECOGNIZING"
          :             "EMBRACING",
  };
}

/* ---- WINDOW MACHINERY (device verbatim from S03 / S04 / S07) ------------ */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
function detailField(offctx, W, H, dst){
  offctx.save(); offctx.fillStyle = PAPER;
  offctx.fillRect(dst.x0 * W, dst.y0 * H,
                  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
  offctx.restore();
}
function detailRule(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save(); offctx.strokeStyle = INK; offctx.lineWidth = 7;
  offctx.strokeRect(x + 3.5, y + 3.5, w - 7, h - 7); offctx.restore();
}

/* THE FUMIGATION STRIP (note G). The plate is authored against the harness
   card, 3:4, and is keyed at more than card resolution so the reduction has
   marks to give away. */
const SUL_CW = 760, SUL_CH = 1013;
const SUL_WIN = { x0:.062, y0:.646, x1:.940, y1:.892 };   // 667 x 249, 2.68:1
const SUL_DST = { x0:.578, y0:.048, x1:.950, y1:.2528 };  // 417 x 156, 2.68:1
function sulfurAt(t){
  const u = ramp(t, SWEEP, PURE);
  return {
    t: 0.4 + 3.2 * clamp01((t - KINDLE) / Math.max(1, PURE - KINDLE)),
    front: t < KINDLE ? 0 : t < SWEEP ? 0.04 * ramp(t, KINDLE, SWEEP) : 0.05 + 0.95 * u,
    intensity: t < KINDLE ? 0 : t < SWEEP ? 0.35 : t < SAT ? 1.0 : 0.75,
    fume:      t < KINDLE ? 0 : t < SWEEP ? 0.25 : t < SAT ? 1.15 : 0.85,
    vent:      t < SWEEP ? 0.04 : t < SAT ? 0.55 : 1.20,
    hiss:      t < KINDLE ? 0 : t < SAT ? 1.0 : 0.35,
    taint:     t < KINDLE ? 1.0 : clamp01(1 - 0.96 * u),
    layers:["zones"],
    status: t < KINDLE ? "WASHED" : t < SWEEP ? "CHARGED"
          : t < SAT    ? "FUMIGATING" : t < PURE ? "SATURATED" : "VENTING",
    progress: clamp01(0.08 + 0.90 * (t / PURE)),
  };
}

export const scene = {
  id:"OD-B22-S08",
  title:"The House Calls Penelope",
  book:22,
  plan:"megaron",
  duration:D,
  beats:[
    "Odysseus orders Eurycleia to bring sulphur and fire so the hall can be purified.",
    "The fumigation sweeps the megaron from the throne end out through the great doors, and the room comes out of its aftermath.",
    "The women who kept faith come down from their quarters with torches and stop short of him, not believing it.",
    "They read the scar and the voice; the arc collapses inward and they take his head and his hands and his shoulders, weeping.",
    "Odysseus receives them with the grief held down and the doors still watched.",
    "He sends Eurycleia up the stair to wake Penelope and tell her that her husband is home.",
  ],
  exitState:
    "THE HALL IS `cleaned` AND IT WILL STAY THAT WAY INTO BOOK XXIII: great " +
    "doors open, fresh fire on the hearth, clerestory bright, the floor a level " +
    "lighter, no blood, the contest gear struck, and the sulphur brazier still " +
    "smoking beside the hearth where `cleaned` draws it. The fumigation is spent " +
    "— the front has crossed all five zones of the megaron and vented through " +
    "the smoke-hole and the doors. ODYSSEUS STANDS AT THE MIDDLE OF HIS OWN " +
    "HALL on `axe_last`, as himself, guise `restored`, with the loyal women of " +
    "the house closed round him on the contact ring centred on that mark: they " +
    "have his head and his hands and his shoulders, they are weeping, and he is " +
    "receiving them with the grief held down and the doors still watched. THE " +
    "TWELVE LOYAL WOMEN are recorded as `women` at `hearth`, the room's heart, " +
    "formation `embracing` — the only key this scene adds, and the group Book " +
    "XXIII inherits standing in this room. EURYCLEIA IS AT THE FOOT OF THE " +
    "STAIR (`stair_up`), turned onto it, sent up to Penelope's chamber to wake " +
    "the queen and tell her that the man she has waited twenty years for is " +
    "downstairs; the climb itself is Book XXIII's. Every other key S07 handed " +
    "over is passed on unchanged: TELEMACHUS (`door_main`), THE TWELVE DISLOYAL " +
    "MAIDS (`threshold`) and MELANTHIUS (`postern`) are all still out in the " +
    "courtyard; the dead are the ground they were lifted off; nobody else is " +
    "alive in this room. The house is clean, it is lit, and it has not yet told " +
    "the woman upstairs.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"aftermath" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.83}, scale:.42, band:"threeq", pose:"torso_open" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:.79,y:.67}, scale:.42, band:"threeq", pose:"eury_clasp" },
    { asset:"ensemble.loyal-maids", instance:"women",
      anchor:{x:.50,y:.83}, scale:.80, state:"recognizing" },
    { asset:"environment.sulfur-and-purification-fire", instance:"fume",
      anchor:{x:.76,y:.16}, scale:.37, state:"sweep-hall" },
  ],

  timeline:[
    // opening frame = S07's closing frame
    { op:"actor.pose",  target:"odysseus",  at:0.0,     args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",  at:0.0,     args:{ gaze:{ x:.38, y:.06 } } },
    { op:"actor.pose",  target:"eurycleia", at:0.0,     args:{ pose:"eury_clasp" } },
    { op:"actor.gaze",  target:"eurycleia", at:0.0,     args:{ gaze:{ x:-.42, y:.18 } } },
    // 1. fire and sulphur
    { op:"actor.pose",  target:"odysseus",  at:ORDER,   args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",  at:ORDER,   args:{ gaze:{ x:.46, y:-.04 } } },
    { op:"sound.cue",   target:"odysseus",  at:ORDER,   args:{ src:"table_r", cue:"bring me fire, old woman, and sulphur to purge this hall" } },
    { op:"actor.pose",  target:"eurycleia", at:ORDER+1, args:{ pose:"eury_alarm" } },
    { op:"actor.pose",  target:"eurycleia", at:FETCH0,  args:{ pose:"walk_neutral" } },
    { op:"actor.exit",  target:"eurycleia", at:FETCH1,  args:{ via:"postern", note:"out by the store passage for coals and sulphur" } },
    // 2. the fumigation
    { op:"env.play",    target:"fume",      at:KINDLE,  args:{ node:"kindle" } },
    { op:"actor.pose",  target:"eurycleia", at:BACK0,   args:{ pose:"eury_clasp" } },
    { op:"actor.gaze",  target:"eurycleia", at:BACK0,   args:{ gaze:{ x:-.40, y:.26 } } },
    { op:"env.play",    target:"fume",      at:SWEEP,   args:{ node:"sweep-hall" } },
    { op:"actor.pose",  target:"odysseus",  at:WALK0,   args:{ pose:"walk_neutral" } },
    { op:"env.play",    target:"fume",      at:SAT,     args:{ node:"saturate" } },
    { op:"actor.pose",  target:"odysseus",  at:WALK1,   args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",  at:WALK1,   args:{ gaze:{ x:.06, y:-.06 } } },
    { op:"set.state",   target:"field_01",  at:PURE,    args:{ state:"cleaned", note:"THE ONE CUT — the hall comes out of aftermath" } },
    { op:"env.play",    target:"fume",      at:PURE,    args:{ node:"vent" } },
    // 3. the women who kept faith
    { op:"actor.pose",  target:"eurycleia", at:COME,    args:{ pose:"eury_hush" } },
    { op:"crowd.state", target:"women",     at:COME,    args:{ formation:"file", note:"down from the women's quarters with torches" } },
    { op:"sound.cue",   target:"women",     at:COME,    args:{ src:"doorway_maid", cue:"torches on the stair, and nobody saying anything" } },
    { op:"actor.pose",  target:"odysseus",  at:WARY,    args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",  at:WARY,    args:{ gaze:{ x:-.20, y:.16 } } },
    { op:"crowd.state", target:"women",     at:WARY,    args:{ formation:"wary-arc", note:"they stop: they will not believe it" } },
    { op:"crowd.state", target:"women",     at:SCAR,    args:{ formation:"wary-arc", note:"torches down on the mark above the knee" } },
    // 4. the arc collapses
    { op:"actor.pose",  target:"odysseus",  at:RECOG,   args:{ pose:"offering_hand" } },
    { op:"crowd.state", target:"women",     at:RECOG,   args:{ formation:"converging" } },
    { op:"crowd.state", target:"women",     at:HOLD,    args:{ formation:"embracing", note:"his head, his hands, his shoulders" } },
    { op:"actor.pose",  target:"odysseus",  at:HOLD,    args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",  at:HOLD,    args:{ gaze:{ x:.02, y:.28 } } },
    { op:"actor.pose",  target:"eurycleia", at:HOLD,    args:{ pose:"eury_weep" } },
    // 5. the stair
    { op:"actor.pose",  target:"odysseus",  at:SEND,    args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",  at:SEND,    args:{ gaze:{ x:.52, y:-.10 } } },
    { op:"sound.cue",   target:"odysseus",  at:SEND,    args:{ src:"axe_last", cue:"go up, and wake her, and tell her who is standing in her hall" } },
    { op:"actor.pose",  target:"eurycleia", at:STAIR1,  args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"eurycleia", at:STAIR1,  args:{ gaze:{ x:.40, y:-.30 } } },
    { op:"timeline.capture", target:"OD-B22-S08", at:98.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);   // deterministic idle phase
    const prog   = clamp01(0.08 + 0.88 * (t / D));
    const pure   = t >= PURE;
    const draw   = [];

    /* --- THE ROOM. One asset, one state channel, one cut (note B). -------- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state: pure ? "cleaned" : "aftermath", t:breath,
        /* note C: no furniture, no throne, no axes — the ring stands there */
        layers:["shell","roof","farwall","doors","sill","racks","postern",
                "maidsdoor","stair","pillars","lane","hearth","litter"],
        status: t < ORDER ? "STILL REEKING"
              : t < SWEEP ? "FIRE AND SULPHUR"
              : !pure     ? "PURGING"
              : t < COME  ? "SCOURED"
              : t < RECOG ? "THE WOMEN COME DOWN"
              :             "THE HOUSE IS ITS OWN AGAIN",
        progress: prog,
      },
    });

    /* --- THE RING. Box solved off the king's own blocked mark (note D). --- */
    if (t >= COME){
      const p = blk.odysseus;
      const r = ringRect(W, H, p);
      const rs = { ...ringAt(t), t:Math.min(.98, t / D), progress:prog };
      draw.push({ d:p.d - 0.06, run(){ blitRing(offctx, r, rs, RING_BACK,  "b"); }});
      draw.push({ d:p.d + 0.06, run(){ blitRing(offctx, r, rs, RING_FRONT, "f"); }});
    }

    /* --- EURYCLEIA. The women's door, the postern and back, then the stair.
       Not mirrored: the hall is to her left from x .787, and the rig's
       directive poses are authored to screen left. ------------------------- */
    {
      const p = blk.eurycleia, s = st.eurycleia || {};
      const gone   = t >= FETCH1 && t < BACK0;          // out of the room
      const bearing= t >= BACK0 && t < COME;
      const weeping= t >= HOLD && t < SEND;
      if (!gone) draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, eurycleia, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t:breath, band:"threeq",
            pose: s.pose || "eury_clasp",
            gaze: s.gaze || { x:-.40, y:.20 },
            browUp:   weeping ? .62 : bearing ? .40 : .34,
            browKnit: weeping ? .48 : .24,
            eyeWide:  t >= ORDER && t < FETCH0 ? .46 : .12,
            jaw:      t >= ORDER && t < FETCH0 ? .30 : 0,
            frown:    weeping ? .52 : .12,
            status: t < ORDER  ? "AT THE WOMEN'S DOOR"
                  : t < FETCH1 ? "FIRE AND SULPHUR"
                  : t < COME   ? "COALS IN A DISH"
                  : t < HOLD   ? "CALLING THEM DOWN"
                  : t < SEND   ? "WEEPING"
                  :              "UP TO THE QUEEN",
            progress: prog,
          },
        });
      }});
    }

    /* --- ODYSSEUS. One body, guise `restored`, no mirror: the door he speaks
       to and the stair he sends her up are both on his right, and that is a
       gaze (note F). ------------------------------------------------------- */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const calling = t >= ORDER && t < FETCH1;
      const held    = t >= HOLD;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t:breath, guise:"restored", band:"threeq",
            pose: s.pose || "three_quarter_left",
            gaze: s.gaze || { x:.34, y:.06 },
            /* the whole late performance is one held face: brows up and knit,
               eyes narrowed onto the doors, jaw shut. Grief restrained, and
               the room still watched. */
            browUp:   held ? .46 : .18,
            browKnit: held ? .52 : .44,
            eyeNarrow:held ? .26 : .40,
            frown:    held ? .40 : .14,
            jaw:      calling ? .38 : t >= SEND ? .32 : .06,
            mouthAsym:held ? .10 : .22,
            status: t < ORDER ? "STILL STANDING IN IT"
                  : calling   ? "FIRE AND SULPHUR"
                  : t < PURE  ? "PURGE IT"
                  : t < COME  ? "THE HALL IS CLEAN"
                  : t < RECOG ? "LET THEM LOOK"
                  : t < HOLD  ? "THE WOMEN OF MY HOUSE"
                  : t < SEND  ? "NOT YET, NOT YET"
                  :             "GO UP AND WAKE HER",
            progress: prog,
          },
        });
      }});
    }

    draw.sort((a, b) => a.d - b.d).forEach(x => x.run());

    /* --- THE WINDOW. One at a time, and after COME, none (note G). -------- */
    if (t < COME){
      const k = sulfurAt(t);
      detailField(offctx, W, H, SUL_DST);
      plate(offctx, W, H, sulfur, SUL_CW, SUL_CH, SUL_WIN, SUL_DST, k,
            `sul|${Math.round(k.front * 40)}|${Math.round(k.taint * 20)}`);
      detailRule(offctx, W, H, SUL_DST);
    }
  },
};
export default scene;

/* named binding so the first scene of Book XXIII can
   `import { exitOccupancy as INITIAL }` — the scene-object property alone
   cannot be linked. Book XXIII opens in this same hall and every station
   below is a megaron station, so it needs no translation table. */
export const exitOccupancy = scene.exitOccupancy;

/* WOMAN is exported beside it because the ring's zoom was fitted against it
   (note E): a woman of the house is 0.94 of the plan's own body on the same
   floor line, and any later scene that stands loyal-maids in this room must
   fit its blit to the same number or the group will drift out of family. */
export const RING_FIT = { ...RING, woman:WOMAN, plan:"megaron", focus:"axe_last" };
