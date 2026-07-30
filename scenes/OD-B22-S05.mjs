/* ============================================================
   SCENE  OD-B22-S05 — Athena Tests the Battle   (Od. 22.205–309)
   Book XXII, scene 5. ADDITIVE: adds nothing to Books I–XV, modifies no
   existing module, and casts only assets that already exist. Shape copied from
   the reference scene, scenes/OD-B16-S03.mjs, and from its predecessor,
   scenes/OD-B22-S04.mjs, whose room, layer list, figure scale, props, corpses,
   hanging man and near-floor register are inherited here verbatim.

   Beats (causal order, one master clock):
     1. Athena comes into the hall wearing Mentor; Odysseus challenges her for
        standing off while the arms went to the enemy.
     2. She rebukes him — and then does NOT come to his side. She keeps the
        disguise on and keeps the help back: the test is whether the four men
        hold the sill on their own.
     3. She goes up out of the fight to the roof beam. The suitors cast six
        spears together and every shaft is turned into the building.
     4. The four on the sill answer with one coordinated volley and four men go
        down out of the rank.
     5. The aegis is raised from the roof beam and what is left of the
        formation comes apart.

   Every pixel figure below is in the stage's own 1120x760 space (renderScene
   hands stage() srcW=1120, srcH=760 and the PNG is that at DPR 2), and every
   one of them was COMPUTED off scenes/_plans/megaron.mjs through project(),
   not estimated.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. ROOM, NOT ROOMS, AND THE STATE STILL DOES NOT ADVANCE. The atlas casts no
      location for this scene. It plays in the megaron, so the field is
      location.megaron-hall in state `contest` with the SAME layer list S01-S04
      used, at the same anchor (.50,.99) and scale 1.0, so this hall registers
      to the pixel on all five and the shots cut together.
      S04's note A left an instruction — advance to `battle` for "the general
      slaughter from S05 onward" — and DRAFT 1 OF THIS FILE OBEYED IT AND HAD TO
      BE REVERSED. `battle` carries lift:1, a single lighting offset applied to
      the whole room, and the megaron exposes no channel to hold it back. With
      it on, the ceiling plane, the far wall, both side walls, the pillars and
      the floor all came up one quantized ink level at once and the frame
      printed as a mid-grey field with the figures barely off it — the exact
      failure the brief names first ("a room that renders as one near-black mass
      fails"). Held at `contest` the room is paper with dark accents and the ten
      bodies read. So the advance is deferred to S06, where the room is
      cleared and the state change has litter and wreck to justify it; what
      escalates HERE is what is happening in the room, not the room's exposure:
      the sign in the roof, the shafts in the walls and the mass coming apart.
      `furniture`, `litter` and `throne` stay dropped for the reasons S01 gives;
      the wreck in this room is still the two PROPS S03 authored.

   B. NO HAND-PLACED ANCHORS, AND NOBODY WALKS. Every body resolves through
      megaron.mjs by station NAME; there is not one hand anchor on a figure in
      this file. MOVES IS EMPTY, and that is a statement about the scene rather
      than a shortcut: 22.205–309 is a standoff across the sill. The four
      defenders hold the threshold and the store door, the enemy holds the
      near-left corner, and nobody crosses the floor until S06 clears it. The
      only body that changes place leaves the FLOOR ENTIRELY — Athena goes up
      to the roof beam — and a vertical rise has no station in a plan, so it is
      not faked as one (note D). blockingAt() still resolves every inherited
      key through the plan every frame, which is the cross-room check, and
      occupancyAt() therefore hands S06 exactly the stations S04 handed us,
      plus Athena.

   C. THE FRAME IS ALREADY FULL, SO BOTH PLATES GET A MEASURED PATCH OF WALL.
      Four of the five instances the atlas asks for are whole-frame authored
      plates or a crowd box; only two of them are bodies. The hall at the
      closing frame of S04 has nine bodies in it and exactly two clear patches
      of far wall, and both are measured off the plan rather than guessed —
      figure ink half-width is 0.1095 of the figure box (the 0.219 figure-ink
      WIDTH measured in S01 and used unchanged since), so:
        · melanthius hangs at `storeroom`, ink 200..283
        · odysseus stands at `threshold`, ink 522..598
      giving
        · THE LEFT PATCH  x 13..196  (frame edge -> the hanging man's ink)
          -> divine-fx.deflected-spear-field, as a detail window, from CAST on
        · THE SLOT        x 289..516 (between the two of them), top edge on
          the middle transverse roof beam
          -> prop.aegis, as an OBJECT hung from that beam, from AEGIS on
      Both are computed in slotAt()/sprDst() from the two stations every frame,
      so if the plan ever moves the store or the sill the overlays move with it.
      Draft 1 stacked both into the slot and time-shared them on the clock; that
      works, but it made the window 212x182 with its bottom rule 4px off
      Philoetius' crown, and it left the largest clear area in the frame — the
      far wall left of the hanging man — as dead paper for the whole scene.
      Two patches, no panel over anybody's head, and neither instrument has to
      wait for the other.

   D. ATHENA IS A BODY UNTIL SHE ISN'T, AND THEN SHE IS THE SIGN.
      character.athena-as-mentor stands at `doorway_maid` — x 881, feet 510,
      the maids' door in the right wall, a station no other body holds. She is
      NOT brought to Odysseus' side, and that is beat 2: the goddess stays
      across the room with the sill between them while she withholds. She is
      not mirrored, because the rig's directive poses are authored to screen
      LEFT and everything she addresses (the sill at 560, the hall, the mob at
      the near-left) is to her left.
      At BEAM she goes up. She is not lifted into the roof, because in this
      room's projection she CANNOT be: the three transverse roof beams the hall
      draws sit at y 125, 90 and 46 (ceil(z) = .50 − (.30 + .26 z^1.08) at
      z .16/.34/.56), and a figure whose feet are at y 90 has a 276px box that
      leaves the top of the frame. So the scene does the honest thing instead of
      a fudged half-scale perch: she EXITS the mortal frame at BEAM, and from
      AEGIS her presence in the room IS prop.aegis, hung from the beam she went
      up to. ensemble.suitor-terror-wave is authored for exactly this reading —
      "Athena is NOT drawn: what is drawn is the SOURCE ... with `aegis:source`
      as its anchor so a scene can place prop.aegis exactly on it" — and this
      scene runs that relation in the other direction: the sign's place is solved
      off the ROOM (note E) and the crowd's `sourceX`/`sourceY` are then set to
      wherever that put it, so the fright is measured from the object the
      audience can see (note F).

   E. THE SIGN'S PLACE IS SOLVED OFF THE ROOM, NOT CHOSEN.
      prop.aegis is a portrait 3:4 plate with a header register, a herd lane and
      a ten-notch ledger. Keyed whole into the room it would print three
      instruments across the far wall; keyed at a crop it is an OBJECT. So:
        · the crop is the disc and nothing else — a SQUARE of half-extent
          1.50R about the disc centre (.500,.425, r .255 of W). 1.50 and not
          1.34: `enemy-break` throws a five-arrow drive fan out to 1.36R and
          its arrowheads another 0.11R past that, and a clipped arrowhead reads
          as a printing error. The header (y .062), the herd lane (.762) and the
          ledger (.872) all fall outside it; the roof bracket the sign hangs
          from (cy − 1.16R) falls INSIDE it, which is the point — the object
          arrives with its own evidence of being held down from a roof.
        · IT IS KEYED SMALL, NOT BIG: 300x400, so the crop is 229px and the
          blit into the 227px slot is a reduction of 0.99 — essentially none.
          This is the opposite of what S04 does for the rope chamber and it is
          the same argument run the other way. A PROP's strokes are absolute
          pixel widths against its own canvas, so the FINAL stroke weight is
          lineWidth x (destination / canvas): keyed at 440 the aegis' 4.2px rim,
          its 24 tassels and its tick band came into the room at 0.68 and the
          POST pass, whose cell is 2.5 stage px, sampled them as scattered dots
          — draft 2 printed the sign as noise. Keyed at 300 the same geometry
          lays out identically (all of it is fractional) and arrives at native
          weight, which is what a 151px-wide object needs.
        · the same reasoning sizes the ballistics window in note G.
        · the square's TOP EDGE sits on the middle transverse beam (z .34,
          y 90) — the beam the two roof pillars carry — so the sign hangs from
          a timber the room actually draws.
        · its centre x is the midpoint of the slot and its half-width the slot's,
          so: cx 402, side 227, disc diameter 151, crown of the square on the
          beam at y 90 and the fringe stopping at 317 — clear of Philoetius'
          crown at 268 and Amphinomus' at 312, because at those two x offsets
          the square's corners hold no ink (nothing is drawn past 1.50R of the
          centre).
        · MODE walks `raised` -> `fear-emission` -> `enemy-break` on the same
          clock as the crowd. Nothing of it is on screen before AEGIS, because
          before AEGIS the aegis is not in the hall.

   F. THE ENEMY IS THE SAME MASS S02–S04 BUILT, RUN BACKWARDS.
      ensemble.armed-suitors converted a panicking huddle into a rank of spear
      throwers. ensemble.suitor-terror-wave is authored to run that conversion
      backwards and faster, and it is built on the same member geometry (72/150
      px bands, seatY .906, the same band x-spread), so it stands on S02/S03/
      S04's BOX, to the pixel: cw 415, ch 380, midX .68 on `corner_dead`,
      nearRow .86 on `bench_l2`. The mass therefore does not jump between two
      adjacent shots — the men who were issued shields in S04 are the men who
      drop them here, in the same places.
        · `floor`, `beam`, `threshold` and `source` are OFF: they would print a
          second architecture, a second roof and a second doorway over the
          megaron's own. `rose` is off because the heading rose is an instrument
          authored against its own card and in a 415px box it is a 98px
          scribble. `flight` and `terror-front` are off because both are drawn
          in ACCENT and the POST pass quantizes by luminance — a blue arc
          prints BLACK, and a black dashed ellipse across the near floor is not
          a semantic accent, it is a stain. That is S04's note H, unchanged.
        · `dropped` is ON and does the tonal work: the shed shields are big
          light discs and they are what keeps a corner full of breaking bodies
          off the black end of the scale.
        · THE TERROR FRONT IS AIMED AT THE REAL AEGIS. `sourceX`/`sourceY` are
          the computed position of the sign of note E expressed in the crowd
          box's own normalized space — (1.261, −0.349), outside the box, which
          is exactly where the sign is: up and to the right of the near-left
          corner. So the men nearest the thing break first and the collapse
          rolls away from it, and the two placements cannot disagree.
        · THE VOLLEY IS A CENSUS CHANGE. At VOLLEY perRow goes [6,6,5] -> [5,5,3]
          — four men out of seventeen, which is the four Homer names — and the
          formation goes `wedge` -> `crumbling` in the same frame. The template
          is deterministic in i and n, so the survivors re-index: the mass
          reconfigures on the beat, as an event, instead of drifting. The counts
          are [6,6,5] and not the asset's own [8,7,6]: that default is written
          against a 660-wide card, and in a 415-wide box eight men to a band is
          52px of pitch under a 150px front-band figure. Nor are they S04's
          [3,4,4]: this box runs a third of its width off the near-left edge, so
          three to a band leaves four visible men and the rank reads as
          stragglers rather than as the formation the aegis has to break.
        · THE COLLAPSE IS A LADDER, NOT A TRANSLATION — see crowdAt(): the
          formation stops at `crumbling` and `rout` is capped, because a box that
          runs off frame plus `stampede` at rout 0.9 walks the whole left half of
          the mass out of the picture.

   G. THE BALLISTICS WINDOW PANS ALONG ITS OWN ROUTE.
      divine-fx.deflected-spear-field is a proof, not a picture of chaos: six
      casts, one aim reticle, a standing lens, a measured turn at each crossing,
      six lodged shafts and a two-digit ledger reading 0 on flesh and 6 on
      stone. It is a whole-frame plate — it draws its own house and fills its
      own field, so it cannot be keyed into the room (its level-1 field is below
      borderKey's threshold and stays opaque). It is a DETAIL WINDOW, the device
      S04 note G and OD-B21-S02/S03 use, at 183x244 in the LEFT PATCH of note C,
      keyed SMALL at 240x320 for the reason note E gives — the blit is then 0.95
      and the shafts arrive as continuous lines instead of as dotted scatter.
      The crop is the HOUSE side of the plate, x .18..0.98: the lens apex, the
      turned shafts, the four members that take them, the defended volume and
      the ledger. The cast rank and the six-row mapping table are cropped OUT —
      at 183px wide they would be pips 2px across — and what the window has to
      carry is where the bronze ENDED UP.
      It CROPS TWICE and lerps between them on the same ramp the shafts fly on:
        A (t=CAST+3)  y .020..0.820 — the shafts arriving and turning
        B (t=LODGED)  y .120..0.920 — the same, with the two-digit ledger
                      brought up under them: 0 on flesh, 6 on stone
      The two crops are the SAME SIZE (0.800 x 0.800 of a 3:4 canvas = 192x256px
      = the destination's own 0.750), so the aspect is exactly constant at every
      point of the pan and nothing is stretched at either end or anywhere
      between. The window is a camera tracking down the route, and once the
      shafts are standing it stays open as the record of them.

   H. THE ISSUE REGISTER, THE BOARDS, THE CORPSES AND THE HANGING MAN ARE
      INHERITED VERBATIM. prop.defender-armor-set stays in S03/S04's crop at
      S03/S04's destination on the one clear strip of near floor. Its mode is
      the only thing this scene touches: `throw` (two shafts already gone, from
      S04) -> `block` while the enemy volley is in the air -> `throw` when the
      four answer. The three dead keep S04's stations, poses, faces and
      constants; the wrecked dining tables and Antinous' overturned board keep
      S03/S04's window geometry and reference points; Melanthius still hangs in
      the arms-store at `storeroom`, bound 1 hoist 1, on S04's own ceiling-law
      lift (recomputed here from the same formula, not copied as a number).
      Nothing in the room moves between two adjacent shots except the people
      and the two divine objects whose business this scene is.

   I. TONE. Six standing rig figures, three dead ones and one hanging one, all
      with ZERO ctx overpaint — no pixel of any body is drawn by this file. One
      crowd box whose heaviest elements are light shields. One window that is
      mostly paper with dark accents on the shafts, the tokens and the ledger
      beads. One disc that is a light plane inside a hard rim. The room is one
      level up from S04 and the compensation is that the upper-left quarter, the
      right-hand floor and the whole near-right band stay paper, and the darkest
      masses in the frame are still the roof beams the room owns.

   CONTINUITY IN — INHERITED, NOT ASSERTED.
      import { exitOccupancy as PREV_EXIT } from "./OD-B22-S04.mjs";
   S04 ends in THIS room and every station it hands over (`threshold`,
   `axe_last`, `storeroom`, `postern`, `table_l`, `table_r`, `pillar_l`,
   `pillar_r`, `bench_r1`, `corner_dead`, `axe_first`) is a megaron station, so
   no translation table is needed and NOBODY IS DROPPED. One key is added:
   `athena`, who comes in at the maids' door. `suitors` keeps its key and its
   station — the same mass, a different module (note F).

   Verify (the rebuke on the floor, and the sign in the roof):
     node harness/render-scene.mjs scenes/OD-B22-S05.mjs --t 26
     node harness/render-scene.mjs scenes/OD-B22-S05.mjs --t 80
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, lerp, INK, PAPER }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import athena      from "../assets/character/athena-as-mentor.mjs";
import eumaeus     from "../assets/character/eumaeus.mjs";
import philoetius  from "../assets/character/philoetius.mjs";
import melanthius  from "../assets/character/melanthius-b22.mjs";
import eurymachus  from "../assets/character/eurymachus.mjs";
import amphinomus  from "../assets/character/amphinomus.mjs";
import antinous    from "../assets/character/antinous.mjs";
import terror      from "../assets/ensemble/suitor-terror-wave.mjs";
import aegis       from "../assets/prop/aegis.mjs";
import spearfield  from "../assets/divine_fx/deflected-spear-field.mjs";
import tables      from "../assets/prop/raised-dining-tables.mjs";
import board       from "../assets/prop/antinouss-cup-and-feast-table.mjs";
import armour      from "../assets/prop/defender-armor-set.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 84;

/* the same room S01–S04 leave behind, layer for layer (note A) */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth","axes"];

/* ---- THE CLOCK ---------------------------------------------------------- */
const ENTER   = 4;    // Mentor is in the doorway
const CHALL   = 13;   // "where were you while they armed?"
const REBUKE  = 23;   // she rebukes him — and stays where she is
const BEAM    = 32;   // she goes up out of the fight, to the roof beam
const CAST    = 38;   // the six spears leave together
const DEFLECT = 47;   // the turns are measured
const LODGED  = 55;   // all six standing in stone and timber, none in flesh
const VOLLEY  = 61;   // the four on the sill answer; four men fall
const AEGIS   = 69;   // the sign is raised from the beam
const EMIT    = 74;   // the field goes out
const BREAK   = 78;   // the formation is gone

const ramp = (t, a, b) => clamp01((t - a) / Math.max(1e-6, b - a));

/* ---- CONTINUITY IN (note "CONTINUITY IN") ------------------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B22-S04.mjs";
const ENTERING = { athena:"doorway_maid" };   // in at the maids' door
const INITIAL  = { ...PREV_EXIT, ...ENTERING };

/* ---- BLOCKING. Stations, not coordinates. MOVES is empty on purpose (B). - */
const MOVES = [];

/* one figure scale for the whole cast; the plan's depth law does the rest */
const K = 0.42;
/* the rig plants its ankles at 0.90 of its box; 0.752 of a figure box is
   surviving ink in height and 0.219 in width — both measured in S01 and used
   unchanged since. The width one is what solves the slot in note C. */
const FIG_INK   = 0.752;
const FIG_INK_W = 0.219;

/* placeFigure — verbatim in intent from S01–S04: the lift puts FEET on the
   mark. Every figure in this scene is pure rig with no ctx-drawn cloth, so the
   default landscape box is the regime the modules were authored in. */
function placeFigure(offctx, W, H, mod, { anchor, scale, state }){
  placeInstance(offctx, W, H, mod, {
    anchor:{ x:anchor.x, y:anchor.y + 0.10 * scale }, scale, state,
  });
}
/* the half-width of a figure's surviving ink at a station, in px */
const inkHalf = (W, p) => 0.5 * FIG_INK_W * W * K * p.scale;

/* ---- THE ROOM'S OWN CEILING LAW (notes D, E, H) -------------------------- */
/* megaron-hall's un-clamped ceiling, the same formula the room draws its roof
   with, so anything solved off it agrees with the roof by construction. */
const ceilAt = z => 0.50 - (0.30 + 0.26 * Math.pow(z, 1.08));
/* the three transverse roof beams the room lays across that plane */
const BEAM_Z = [0.16, 0.34, 0.56];

/* ---- THE HANGING MAN — S04's lift, recomputed from the same law (note H) -- */
/* MEASURED off the module's own card, renders/character__melanthius-b22__hoisted
   .png: with hoist=1 its surviving ink runs 0.111..0.750 of the box height (the
   module's internal 0.17 lift is already inside those numbers). CROWN_CLEAR is
   how far under the ceiling plane AT HIS OWN STATION the crown hangs. */
const HOIST_TOP = 0.111, HOIST_BOT = 0.750, CROWN_CLEAR = 0.018;
function hoistExtra(H, p){
  const boxH   = H * K * p.scale;
  const boxTop = (p.y + 0.10 * K * p.scale) * H - boxH;
  return Math.max(0, boxTop + HOIST_TOP * boxH - (ceilAt(p.d) + CROWN_CLEAR) * H);
}

/* ---- THE SLOT (note C) --------------------------------------------------
   Solved from the plan every frame in slotAt(): the clear patch of far wall
   between the hanging man's ink and the man on the sill's ink. */
const SLOT_MARGIN = 6;
function slotAt(W){
  const m = megaron.at("storeroom"), o = megaron.at("threshold");
  const left  = m.x * W + inkHalf(W, m);
  const right = o.x * W - inkHalf(W, o);
  const cx = (left + right) / 2;
  const half = Math.max(40, (right - left) / 2 - SLOT_MARGIN);
  return { cx, half, left, right };
}

/* ---- THE SIGN, as an object (note E) ------------------------------------- */
const AEG_CW = 300, AEG_CH = Math.round(300 * 4 / 3);   // the authored 3:4, keyed SMALL
const AEG_K  = 1.50;                                    // crop half-extent, in R
const AEG_R  = 0.255;                                   // the disc radius, in W
const AEG_WIN = {
  x0: 0.500 - AEG_K * AEG_R,  x1: 0.500 + AEG_K * AEG_R,
  y0: 0.425 - AEG_K * AEG_R * 3 / 4, y1: 0.425 + AEG_K * AEG_R * 3 / 4,
};
const aegisMode = t => t < EMIT ? "raised" : t < BREAK ? "fear-emission"
                                          : "enemy-break";
/* the square: top edge on the middle transverse beam, centre and width from
   the slot. Returns the destination rect AND the disc centre, so the crowd's
   terror front can be aimed at the same point (note F). */
function aegisBox(W, H){
  const s = slotAt(W);
  const top = ceilAt(BEAM_Z[1]) * H;
  const side = 2 * s.half;
  return { x0:s.cx - s.half, y0:top, x1:s.cx + s.half, y1:top + side,
           cx:s.cx, cy:top + s.half, r:s.half / AEG_K };
}
function placeAegis(offctx, W, H, mode, prog){
  const b = aegisBox(W, H);
  const cv = keyedModuleCanvas(aegis, AEG_CW, AEG_CH,
               { mode, t:0, status:mode.toUpperCase(), progress:prog }, `aeg|${mode}`);
  offctx.drawImage(cv,
    AEG_WIN.x0 * AEG_CW, AEG_WIN.y0 * AEG_CH,
    (AEG_WIN.x1 - AEG_WIN.x0) * AEG_CW, (AEG_WIN.y1 - AEG_WIN.y0) * AEG_CH,
    b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
}

/* ---- WINDOW MACHINERY (device verbatim from S04 / OD-B21-S02) ------------ */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* a DETAIL WINDOW has to BE one: its own paper field and one hard rule, the
   same device the engine's card uses. Keyed straight onto the room, the roof
   plane's rafters run through the drawing and it stops reading as a diagram. */
function detailField(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save(); offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h); offctx.restore();
}
/* and the rule goes on AFTERWARDS: the sheets' floor planes are level-1 fills,
   not paper, so borderKey does not key them out and the blit lays an opaque
   light plane over anything drawn under it. 7px, because a 5px rule on paper
   comes back out of the dotify pass dotted. */
function detailRule(offctx, W, H, dst){
  const x = dst.x0 * W, y = dst.y0 * H;
  const w = (dst.x1 - dst.x0) * W, h = (dst.y1 - dst.y0) * H;
  offctx.save(); offctx.strokeStyle = INK; offctx.lineWidth = 7;
  offctx.strokeRect(x + 3.5, y + 3.5, w - 7, h - 7); offctx.restore();
}

/* ---- THE BALLISTICS WINDOW (note G) ------------------------------------- */
const SPR_CW = 240, SPR_CH = 320;                 // the authored 3:4, keyed SMALL
/* the crop: the HOUSE side of the plate — the lens apex, the turned shafts and
   the four members that take them. The cast rank and the mapping table are left
   out on purpose; what the window has to carry at this reduction is where the
   bronze ENDED UP. Both crops are the same size, so the aspect is exactly
   constant at every point of the pan and nothing is stretched. */
const SPR_CROP = { w:0.800, h:0.800 };            // 192 x 256 px — 0.750 portrait
const SPR_A = { x0:0.180, y0:0.020 };             // the shafts arriving
const SPR_B = { x0:0.180, y0:0.120 };             // ... and the ledger under them
const sprWin = u => {
  const x0 = lerp(SPR_A.x0, SPR_B.x0, u), y0 = lerp(SPR_A.y0, SPR_B.y0, u);
  return { x0, y0, x1:x0 + SPR_CROP.w, y1:y0 + SPR_CROP.h };
};
/* destination: the empty patch of far wall LEFT of the hanging man, whose right
   edge is his own computed ink edge and whose top clears the card's label. */
const SPR_LEFT = 13, SPR_TOP = 52, SPR_GAP = 3;
function sprDst(W, H){
  const m = megaron.at("storeroom");
  const right = m.x * W - inkHalf(W, m) - SPR_GAP;
  const w = right - SPR_LEFT;
  const h = w * (SPR_CROP.h * SPR_CH) / (SPR_CROP.w * SPR_CW);
  return { x0:SPR_LEFT / W, y0:SPR_TOP / H, x1:right / W, y1:(SPR_TOP + h) / H };
}
/* the fx clock: the casts release at CAST, the turns are struck through
   DEFLECT, everything is lodged at LODGED and then it stands as a record. */
function spearState(t, prog){
  const u = ramp(t, CAST, LODGED);
  return {
    t: u, charge: ramp(t, CAST, CAST + 7),
    intent: 1 - 0.86 * ramp(t, CAST + 2, LODGED),
    bloom: ramp(t, DEFLECT, LODGED),
    status: t < DEFLECT ? "CAST" : t < LODGED ? "MEASURED" : "SPENT",
    progress: prog,
  };
}

/* ---- THE ENEMY, BREAKING — S02/S03/S04's box (note F) -------------------- */
const CROWD = { cw:415, ch:380, rows:3, nearRow:0.86, midX:0.68 };
function crowdBox(W, H){
  return { x: megaron.at("corner_dead").x * W - CROWD.midX * CROWD.cw,
           y: megaron.at("bench_l2").y * H - CROWD.nearRow * CROWD.ch };
}
/* THE BOX HAS TO BE KEYED HARDER THAN THE DEFAULT. ensemble.suitor-terror-wave
   opens by filling its whole canvas with inkLevel(1) — "the lightest possible
   field", correct for a card and fatal in a room: level 1 is luminance 0.859,
   under borderKey's 0.895 threshold, so the default key leaves it OPAQUE and
   draft 1 printed a 415x380 light-grey slab over the near-left quarter of the
   megaron. Keyed at 0.82 the field goes and the crowd does not: every light
   plane that matters — a shield face, a pale tunic — is enclosed by its own
   hard contour, so the flood cannot reach it from the border. */
const CROWD_KEY = 0.82;
function placeCrowd(offctx, W, H, state){
  const b = crowdBox(W, H);
  const sig = `tw|${state.formation}|${Math.round((state.wave ?? 0) * 20)}`
            + `|${Math.round((state.rout ?? 0) * 20)}`
            + `|${Math.round((state.panic ?? 1) * 20)}|${(state.perRow || []).join("")}`
            + `|${(state.layers || []).join("")}`;
  offctx.drawImage(
    keyedModuleCanvas(terror, CROWD.cw, CROWD.ch, state, sig, CROWD_KEY), b.x, b.y);
}
/* the terror front is aimed at the real sign: the aegis centre expressed in the
   crowd box's own normalized space (note F). */
function crowdAt(t, W, H){
  const a = aegisBox(W, H), b = crowdBox(W, H);
  const swept = ramp(t, EMIT, D - 3);
  const dead  = t >= VOLLEY;
  return {
    /* `crumbling` and NOT `stampede` after the volley. stampede displaces every
       man by out*(0.10 + 0.26*terror*rout), and THIS box (S02's) runs off the
       near-left edge on purpose, so at rout 0.9 the whole left half of the mass
       walks out of frame and the rout reads as an empty corner. Draft 2 printed
       exactly that. In `crumbling` the displacement is out*push*0.14*(0.4+depth)
       — under 0.18 of the box even at the front — so the collapse is carried
       where the asset actually authors it: by the STANCE ladder (rank, flinch,
       shed, cover, flee, down), by the facings coming apart, and by the gear on
       the boards. `rout` is capped at 0.45 for the same reason. */
    formation: t < CAST   ? "line"
             : t < VOLLEY ? "wedge"
             :              "crumbling",
    rows:CROWD.rows, perRow: dead ? [5,5,3] : [6,6,5], density:1.0,
    panic:  t < VOLLEY ? 0.10 : t < EMIT ? 0.30 : 1.0,
    wave:   t < VOLLEY ? 0.0 : t < EMIT ? 0.16 : 0.20 + 1.30 * swept,
    waveSpread:0.34,
    rout:   t < VOLLEY ? 0.0 : t < EMIT ? 0.08 : 0.10 + 0.35 * swept,
    attention: t < EMIT ? 0.94 : 0.94 - 0.52 * swept,
    sourceX:(a.cx - b.x) / CROWD.cw, sourceY:(a.cy - b.y) / CROWD.ch,
    targetX:0.99, targetY:0.20,
    showFloor:false, showBeam:false, showThreshold:false, showSource:false,
    showRose:false, showFlight:false, showFront:false, showDropped:true,
    layers:["dropped","band-back","band-mid","band-front"],
    status: t < CAST   ? "A RANK OF THEM"
          : t < VOLLEY ? "SPEARS UP TOGETHER"
          : t < EMIT   ? "FOUR OF THEM DOWN"
          : t < BREAK  ? "SOMETHING ON THE BEAM"
          :              "LIKE CATTLE A GADFLY HAS SCATTERED",
  };
}

/* ---- THE ISSUE REGISTER — S03/S04's crop at S04's destination (note H) --- */
const ARM_CW = 820, ARM_CH = Math.round(820 * 760 / 1120);   // 820 x 556
const ARM_WIN = { x0:.137, y0:.856, x1:.863, y1:.940 };
const ARM_DST = { x0:.300, y0:.880, x1:.682, y1:.924 };
const armMode = t => t < CAST ? "throw" : t < VOLLEY ? "block" : "throw";

/* ---- THE THREE DINING TABLES — S03/S04's constants, unchanged (note H) --- */
const TAB_CW = 312, TAB_CH = Math.round(312 * 760 / 1120);   // 312 x 212
const TAB_WIN = { x0:.190, x1:1.0, y0:0, y1:1.0 };
const TAB_REF_X = .44;
const TAB_REF_Y = { set:.933, shoved:.972, raised:.908, wrecked:.759 };
const TAB_STATION = "table_l";
function placeTables(offctx, W, H, state){
  const p  = megaron.at(TAB_STATION, { kind:"prop" });
  const ww = (TAB_WIN.x1 - TAB_WIN.x0) * TAB_CW;
  const wh = (TAB_WIN.y1 - TAB_WIN.y0) * TAB_CH;
  const x  = p.x * W - (TAB_REF_X - TAB_WIN.x0) * TAB_CW;
  const y  = p.y * H - (TAB_REF_Y[state.config] - TAB_WIN.y0) * TAB_CH;
  const cv = keyedModuleCanvas(tables, TAB_CW, TAB_CH, state,
               `tab|${state.config}|${Math.round((state.strike ?? 1) * 20)}`);
  offctx.drawImage(cv,
    TAB_WIN.x0 * TAB_CW, TAB_WIN.y0 * TAB_CH, ww, wh, x, y, ww, wh);
}

/* ---- ANTINOUS' OWN BOARD — S01–S04 constants, unchanged (note H) --------- */
const PROP_CW = 289, PROP_CH = 504;
const PROP_WIN = { x0:.150, y0:.386, x1:.940, y1:.858 };
const PROP_BOARD = { x0:.185, x1:.672, floor:.808 };
function placeBoard(offctx, W, H, state){
  const p  = megaron.at("table_r", { kind:"prop" });
  const ww = (PROP_WIN.x1 - PROP_WIN.x0) * PROP_CW;
  const wh = (PROP_WIN.y1 - PROP_WIN.y0) * PROP_CH;
  const fx = ((PROP_BOARD.x0 + PROP_BOARD.x1) / 2 - PROP_WIN.x0) * PROP_CW / ww;
  const fy = (PROP_BOARD.floor - PROP_WIN.y0) * PROP_CH / wh;
  const cv = keyedModuleCanvas(board, PROP_CW, PROP_CH, state, `board|${state.mode}`);
  offctx.drawImage(cv,
    PROP_WIN.x0 * PROP_CW, PROP_WIN.y0 * PROP_CH, ww, wh,
    p.x * W - fx * ww, p.y * H - fy * wh, ww, wh);
}

export const scene = {
  id:"OD-B22-S05",
  title:"Athena Tests the Battle",
  book:22,
  plan:"megaron",
  duration:D,
  beats:[
    "Athena comes into the hall wearing Mentor and Odysseus challenges her for standing off while the enemy was armed.",
    "She rebukes him, and then does not come to his side: the disguise stays on and the help stays back.",
    "She goes up out of the fight to the roof beam of the smoky hall.",
    "The suitors cast six spears together and every shaft is turned into wall, lintel, doorpost and door.",
    "The four on the sill answer with one coordinated volley and four men go down out of the rank.",
    "The aegis is raised from the roof beam and what is left of the formation comes apart.",
  ],
  exitState:
    "The megaron, STILL IN ITS `contest` STATE — great doors shut, hearth raked " +
    "flush, the twelve axe helves still standing down the spine, the wall pegs " +
    "still bare. The state does NOT advance to `battle` here: that lift is one " +
    "offset over the whole room and it prints the hall as a grey mass, so the " +
    "advance is handed on to S06 with the wreck and the litter that justify it " +
    "(note A). " +
    "ATHENA IS ALOFT: she came in at the maids' door (`doorway_maid`) as " +
    "Mentor, was challenged, rebuked him, kept the disguise on and kept the " +
    "help back, and at BEAM went up out of the fight to the middle transverse " +
    "roof beam. She is no longer a body on the floor and the plan authors no " +
    "roof station, so her occupancy key holds the station she ROSE FROM; from " +
    "AEGIS her presence in the hall is prop.aegis, hung from that beam over the " +
    "middle of the room in mode `enemy-break`, sign flared and the drive fan " +
    "out. Nothing takes it down inside this scene. " +
    "THE ENEMY'S CAST IS SPENT: six spears thrown together, six lodged in the " +
    "house — one in the wall course, one in the lintel, two in the doorpost, " +
    "two in the door leaf — and NONE in flesh. THE DEFENDERS' ANSWER LANDED: " +
    "four more men are down out of the rank, so the mass at `corner_dead` is " +
    "seven where it was eleven, and by the closing frame it is not a rank at " +
    "all — routed, gear shed on the boards, heads and headings splayed, driven " +
    "outward from under the sign. That is what S06 walks into. " +
    "The four defenders have not moved a foot: Odysseus still on the great " +
    "threshold (`threshold`), as himself, guise `restored`; Telemachus at the " +
    "last axe helve (`axe_last`); Philoetius holding the store door " +
    "(`postern`); Eumaeus out in the hall at the wrecked boards (`table_l`). " +
    "Their panoplies (`arms`) are back in mode `throw` at `axe_first`. " +
    "MELANTHIUS STILL HANGS in the arms-store (`storeroom`), bound 1 hoist 1, " +
    "crown close under the roof beams, alive. Eurymachus is still down at the " +
    "right roof-pillar (`pillar_r`), Amphinomus at the left (`pillar_l`), " +
    "Antinous across his own overturned board (`bench_r1` / `table_r`), and the " +
    "three dining tables (`table_l`) are still wrecked.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared box or
     window. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"contest" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.29, band:"threeq", pose:"confrontation" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.50,y:.85}, scale:.44, band:"threeq", pose:"protective_block" },
    { asset:"character.athena-as-mentor", instance:"athena",
      anchor:{x:.79,y:.67}, scale:.36, band:"threeq", pose:"mentor_still" },
    { asset:"character.philoetius", instance:"philoetius",
      anchor:{x:.25,y:.60}, scale:.33, band:"threeq", pose:"phi_barred" },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.28,y:.81}, scale:.43, band:"threeq", pose:"eum_ward" },
    { asset:"character.melanthius-b22", instance:"melanthius",
      anchor:{x:.22,y:.63}, scale:.34, band:"threeq", pose:"m22_hoist" },
    { asset:"character.eurymachus", instance:"eurymachus",
      anchor:{x:.66,y:.69}, scale:.41, band:"threeq", pose:"kneel" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.34,y:.69}, scale:.38, band:"threeq", pose:"kneel" },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.75,y:.77}, scale:.38, band:"threeq", pose:"crouch" },
    { asset:"ensemble.suitor-terror-wave", instance:"suitors",
      anchor:{x:.12,y:.91}, scale:.37, state:"holding" },
    { asset:"divine-fx.deflected-spear-field", instance:"spears_01",
      anchor:{x:.36,y:.18}, scale:.19, state:"cast" },
    { asset:"prop.aegis", instance:"aegis_01",
      anchor:{x:.36,y:.27}, scale:.20, state:"raised" },
    { asset:"prop.raised-dining-tables", instance:"tables_01",
      anchor:{x:.29,y:.81}, scale:.28, state:"wrecked" },
    { asset:"prop.antinouss-cup-and-feast-table", instance:"board_01",
      anchor:{x:.71,y:.81}, scale:.23, state:"overturned" },
    { asset:"prop.defender-armor-set", instance:"arms",
      anchor:{x:.50,y:.94}, scale:.53, state:"throw" },
  ],

  timeline:[
    // opening frame = S04's closing frame
    { op:"actor.pose",  target:"odysseus",   at:0.0,     args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",   at:0.0,     args:{ gaze:{ x:-.40, y:.16 } } },
    { op:"actor.pose",  target:"telemachus", at:0.0,     args:{ pose:"protective_block" } },
    { op:"actor.gaze",  target:"telemachus", at:0.0,     args:{ gaze:{ x:-.34, y:.10 } } },
    { op:"actor.pose",  target:"philoetius", at:0.0,     args:{ pose:"phi_barred" } },
    { op:"actor.pose",  target:"eumaeus",    at:0.0,     args:{ pose:"eum_ward" } },
    { op:"actor.pose",  target:"melanthius", at:0.0,     args:{ pose:"m22_hoist" } },
    { op:"actor.pose",  target:"eurymachus", at:0.0,     args:{ pose:"kneel" } },
    { op:"actor.pose",  target:"amphinomus", at:0.0,     args:{ pose:"kneel" } },
    { op:"actor.pose",  target:"antinous",   at:0.0,     args:{ pose:"crouch" } },
    { op:"prop.state",  target:"tables_01",  at:0.0,     args:{ config:"wrecked" } },
    { op:"prop.state",  target:"board_01",   at:0.0,     args:{ mode:"overturned" } },
    { op:"prop.state",  target:"arms",       at:0.0,     args:{ mode:"throw" } },
    { op:"crowd.state", target:"suitors",    at:0.0,     args:{ formation:"line" } },
    // 1. Mentor in the doorway, and the challenge
    { op:"actor.enter", target:"athena",     at:ENTER,   args:{ via:"maids-door", note:"in the familiar shape of Mentor" } },
    { op:"actor.pose",  target:"athena",     at:ENTER,   args:{ pose:"mentor_still" } },
    { op:"actor.gaze",  target:"athena",     at:ENTER,   args:{ gaze:{ x:-.34, y:.02 } } },
    { op:"sound.cue",   target:"athena",     at:ENTER,   args:{ src:"doorway_maid", cue:"a known voice at the women's door" } },
    { op:"actor.pose",  target:"odysseus",   at:CHALL,   args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:CHALL,   args:{ gaze:{ x:.54, y:-.06 } } },
    { op:"sound.cue",   target:"odysseus",   at:CHALL,   args:{ src:"threshold", cue:"Mentor — where were you while they armed?" } },
    // 2. the rebuke, and the help kept back
    { op:"actor.pose",  target:"athena",     at:REBUKE,  args:{ pose:"mentor_command" } },
    { op:"actor.gaze",  target:"athena",     at:REBUKE,  args:{ gaze:{ x:-.40, y:-.04 } } },
    { op:"sound.cue",   target:"athena",     at:REBUKE,  args:{ src:"doorway_maid", cue:"fight, and you will see what Mentor does" } },
    { op:"actor.pose",  target:"odysseus",   at:REBUKE+5,args:{ pose:"torso_open" } },
    { op:"actor.gaze",  target:"odysseus",   at:REBUKE+5,args:{ gaze:{ x:.44, y:.04 } } },
    // 3. she leaves the floor
    { op:"actor.pose",  target:"athena",     at:BEAM-3,  args:{ pose:"mentor_marshal" } },
    { op:"actor.gaze",  target:"athena",     at:BEAM-3,  args:{ gaze:{ x:-.14, y:-.62 } } },
    { op:"actor.exit",  target:"athena",     at:BEAM,    args:{ via:"roof-beam", note:"up out of the fight, like a swallow to the beam" } },
    // 4. the enemy cast, taken out of the air
    { op:"actor.pose",  target:"odysseus",   at:CAST,    args:{ pose:"protective_block" } },
    { op:"actor.gaze",  target:"odysseus",   at:CAST,    args:{ gaze:{ x:-.44, y:.10 } } },
    { op:"actor.pose",  target:"telemachus", at:CAST,    args:{ pose:"protective_block" } },
    { op:"crowd.state", target:"suitors",    at:CAST,    args:{ formation:"wedge" } },
    { op:"fx.play",     target:"spears_01",  at:CAST,    args:{ dir:"cast" } },
    { op:"prop.state",  target:"arms",       at:CAST,    args:{ mode:"block" } },
    { op:"sound.cue",   target:"suitors",    at:CAST,    args:{ src:"corner_dead", cue:"six shafts together" } },
    { op:"fx.play",     target:"spears_01",  at:DEFLECT, args:{ dir:"deflect" } },
    { op:"sound.cue",   target:"spears_01",  at:LODGED,  args:{ src:"door_main", cue:"bronze into stone and timber, none into flesh" } },
    // 5. the answer
    { op:"actor.pose",  target:"odysseus",   at:VOLLEY,  args:{ pose:"one_arm_raised" } },
    { op:"actor.pose",  target:"telemachus", at:VOLLEY,  args:{ pose:"one_arm_raised" } },
    { op:"actor.pose",  target:"philoetius", at:VOLLEY,  args:{ pose:"one_arm_raised" } },
    { op:"actor.pose",  target:"eumaeus",    at:VOLLEY,  args:{ pose:"one_arm_raised" } },
    { op:"prop.state",  target:"arms",       at:VOLLEY,  args:{ mode:"throw" } },
    { op:"actor.pose",  target:"odysseus",   at:VOLLEY+3,args:{ pose:"reach_forward" } },
    { op:"actor.pose",  target:"telemachus", at:VOLLEY+3,args:{ pose:"reach_forward" } },
    { op:"actor.pose",  target:"philoetius", at:VOLLEY+3,args:{ pose:"reach_forward" } },
    { op:"actor.pose",  target:"eumaeus",    at:VOLLEY+3,args:{ pose:"reach_forward" } },
    { op:"crowd.state", target:"suitors",    at:VOLLEY,  args:{ formation:"crumbling", note:"four out of the rank" } },
    { op:"sound.cue",   target:"odysseus",   at:VOLLEY,  args:{ src:"threshold", cue:"all four at once" } },
    // 6. the sign
    { op:"prop.state",  target:"aegis_01",   at:AEGIS,   args:{ mode:"raised" } },
    { op:"actor.pose",  target:"odysseus",   at:AEGIS,   args:{ pose:"confrontation" } },
    { op:"actor.gaze",  target:"odysseus",   at:AEGIS,   args:{ gaze:{ x:-.28, y:-.60 } } },
    { op:"actor.gaze",  target:"telemachus", at:AEGIS,   args:{ gaze:{ x:-.24, y:-.66 } } },
    { op:"prop.state",  target:"aegis_01",   at:EMIT,    args:{ mode:"fear-emission" } },
    { op:"sound.cue",   target:"aegis_01",   at:EMIT,    args:{ src:"roof-beam", cue:"the wits go out of them" } },
    { op:"prop.state",  target:"aegis_01",   at:BREAK,   args:{ mode:"enemy-break" } },
    { op:"crowd.state", target:"suitors",    at:BREAK,   args:{ formation:"stampede" } },
    { op:"actor.pose",  target:"odysseus",   at:BREAK,   args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:BREAK,   args:{ gaze:{ x:-.50, y:.24 } } },
    { op:"actor.pose",  target:"telemachus", at:BREAK,   args:{ pose:"pointing_arm" } },
    { op:"timeline.capture", target:"OD-B22-S05", at:82.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st     = stateAt(scene, t);
    const blk    = blockingAt(megaron, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);   // deterministic idle phase
    const prog   = clamp01(0.12 + 0.84 * (t / D));

    /* --- 1. THE HALL. It paints the room; everything else keys onto it. --- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:.99 }, scale:1.0,
      state:{
        state:"contest", t:breath, layers:HALL_LAYERS,
        status: t < CHALL   ? "MENTOR IS HERE"
              : t < BEAM    ? "SHE KEEPS IT BACK"
              : t < CAST    ? "SHE IS ON THE BEAM"
              : t < LODGED  ? "SIX SHAFTS IN THE AIR"
              : t < VOLLEY  ? "NONE IN FLESH"
              : t < AEGIS   ? "FOUR OF THEM DOWN"
              : t < BREAK   ? "THE SIGN IS UP"
              :               "THE HALL IS BREAKING",
        progress: prog,
      },
    });

    /* --- 2. EVERY BODY, ordered back to front by its own resolved depth --- */
    const draw = [];

    /* ODYSSEUS — the sill, and he never leaves it. One guise, one mirror: the
       rig's reaching poses are authored to screen LEFT and everything he does
       goes screen RIGHT, exactly as S01–S04 draw him. No transformation here,
       so no divine_fx.athenas-restoration. */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const challenging = t >= CHALL && t < BEAM;
      const throwing    = t >= VOLLEY && t < AEGIS;
      const seeing      = t >= AEGIS;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, guise:"restored", band:"threeq", mirror:true,
            pose: s.pose || "confrontation",
            gaze: s.gaze || { x:-.40, y:.16 },
            browUp:   challenging ? .48 : seeing ? .40 : .16,
            browKnit: challenging ? .58 : throwing ? .52 : .54,
            eyeNarrow:throwing ? .48 : .34,
            eyeWide:  seeing ? .26 : 0,
            jaw:      challenging ? .40 : throwing ? .34 : .18,
            mouthAsym:.22,
            frown:    challenging ? .28 : 0,
            status: t < CHALL   ? "THE NEAR END IS HELD"
                  : challenging ? "WHERE WERE YOU"
                  : t < CAST    ? "NO HELP COMING"
                  : t < VOLLEY  ? "TAKE IT ON THE SHIELDS"
                  : throwing    ? "ALL FOUR AT ONCE"
                  : t < BREAK   ? "THE SIGN IS UP"
                  :               "DRIVE THEM",
            progress: prog,
          },
        });
      }});
    }

    /* TELEMACHUS — the last axe helve, the nearest man in the frame. */
    {
      const p = blk.telemachus, s = st.telemachus || {};
      const throwing = t >= VOLLEY && t < AEGIS;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, telemachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq",
            pose: s.pose || "protective_block",
            gaze: s.gaze || { x:-.34, y:.10 },
            browUp:   t >= AEGIS ? .46 : .22,
            browKnit: throwing ? .42 : .44,
            eyeNarrow:throwing ? .40 : .38,
            eyeWide:  t >= AEGIS ? .30 : 0,
            jaw:      throwing ? .36 : 0,
            frown:    .16,
            mouthAsym:.14,
            status: t < CAST   ? "SHIELD UP"
                  : t < VOLLEY ? "BEHIND THE POST"
                  : throwing   ? "WITH MY FATHER"
                  : t < BREAK  ? "LOOK AT IT"
                  :              "THEY ARE RUNNING",
            progress: prog,
          },
        });
      }});
    }

    /* ATHENA AS MENTOR — the maids' door, across the room from the sill, and
       gone from the floor at BEAM (note D). Not mirrored: the rig's directive
       arm goes screen LEFT, which from x 881 is at the sill. */
    if (t >= ENTER && t < BEAM){
      const p = blk.athena, s = st.athena || {};
      const rebuking = t >= REBUKE;
      const rising   = t >= BEAM - 3;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, athena, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq",
            pose: s.pose || "mentor_still",
            gaze: s.gaze || { x:-.34, y:.02 },
            browUp:   rising ? .46 : rebuking ? .32 : .14,
            browKnit: rebuking ? .18 : .06,
            eyeNarrow:rebuking ? .22 : .18,
            eyeWide:  rising ? .34 : 0,
            jaw:      rising ? .38 : rebuking ? .24 : 0,
            smile:    rebuking ? 0 : .10,
            mouthAsym:.16,
            status: rising    ? "UP TO THE BEAM"
                  : rebuking  ? "FIGHT AND YOU WILL SEE"
                  : t >= CHALL? "SHE LETS HIM SAY IT"
                  :             "A KNOWN FACE",
            progress: prog,
          },
        });
      }});
    }

    /* PHILOETIUS — still on the store door. Mirrored, so his cast goes screen
       LEFT, down the hall at the corner the enemy is in. */
    {
      const p = blk.philoetius, s = st.philoetius || {};
      const throwing = t >= VOLLEY && t < AEGIS;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, philoetius, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq", mirror:true,
            pose: s.pose || "phi_barred",
            gaze: s.gaze || { x:-.34, y:.06 },
            browKnit: throwing ? .46 : .64,
            browUp:   t >= AEGIS ? .38 : .22,
            eyeNarrow:.34, frown:.24,
            jaw:      throwing ? .34 : .18,
            status: t < VOLLEY ? "THE STORE DOOR"
                  : throwing   ? "MINE WENT HOME"
                  :              "THEY ARE COMING APART",
            progress: prog,
          },
        });
      }});
    }

    /* EUMAEUS — out in the hall at the wrecked boards, mirrored the same way. */
    {
      const p = blk.eumaeus, s = st.eumaeus || {};
      const throwing = t >= VOLLEY && t < AEGIS;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, eumaeus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq", mirror:true,
            pose: s.pose || "eum_ward",
            gaze: s.gaze || { x:-.36, y:.04 },
            browUp:   t >= AEGIS ? .36 : .18,
            browKnit: throwing ? .44 : .62,
            eyeNarrow:.32,
            jaw:      throwing ? .40 : .10,
            frown:    .28, mouthAsym:.12,
            status: t < VOLLEY ? "AT THE BOARDS"
                  : throwing   ? "AND MINE"
                  :              "GOD IN THE ROOF",
            progress: prog,
          },
        });
      }});
    }

    /* MELANTHIUS — hanging where S04 left him, on the same computed lift, and
       sorting BEHIND `postern` as he did there (note H). */
    {
      const p = blk.melanthius;
      const lift = hoistExtra(H, p);
      draw.push({ d: p.d - 0.12, run(){
        placeFigure(offctx, W, H, melanthius, {
          anchor:{ x:p.x, y:p.y - lift / H }, scale: K * p.scale,
          state:{
            t: breath, band:"threeq", pose:"m22_hoist",
            gaze:{ x:-.18, y:.44 },
            bound:1, hoist:1, suspension:"cord",
            status:"SUSPENDED", progress:prog,
          },
        });
      }});
    }

    /* THE THREE DEAD — S04's closing values, verbatim (note H). */
    {
      const p = blk.eurymachus;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, eurymachus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", pose:"kneel", gaze:{ x:-.04, y:.54 },
                  blink:1, browUp:.18, browKnit:.34, eyeWide:0, eyeNarrow:0,
                  jaw:.44, frown:.50, smile:0, mouthAsym:0,
                  status:"THROUGH THE CHEST", progress:prog },
        });
      }});
    }
    {
      const p = blk.amphinomus;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, amphinomus, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", mirror:true, pose:"kneel",
                  gaze:{ x:.04, y:.54 },
                  blink:1, browUp:.40, browKnit:.36, eyeWide:0,
                  jaw:.42, frown:.48, mouthAsym:0,
                  status:"BETWEEN THE SHOULDERS", progress:prog },
        });
      }});
    }
    {
      const p = blk.antinous;
      draw.push({ d:p.d, run(){
        placeFigure(offctx, W, H, antinous, {
          anchor:{ x:p.x, y:p.y }, scale: K * p.scale,
          state:{ t:breath, band:"threeq", pose:"crouch", gaze:{ x:-.06, y:.52 },
                  blink:1, browUp:.10, browKnit:.34, eyeWide:0, eyeNarrow:0,
                  jaw:.46, frown:.50, smile:0, mouthAsym:0,
                  status:"THROUGH THE THROAT", progress:prog },
        });
      }});
    }

    /* THE WRECKED DINING TABLES and ANTINOUS' BOARD — inherited (note H). */
    draw.push({ d:megaron.at(TAB_STATION, { kind:"prop" }).d, run(){
      placeTables(offctx, W, H, { config:"wrecked", strike:1, t:0,
                                 status:"WRECKED", progress:prog });
    }});
    draw.push({ d:megaron.at("table_r", { kind:"prop" }).d, run(){
      placeBoard(offctx, W, H, { mode:"overturned", t:0,
                                 status:"OVERTURNED", progress:prog });
    }});

    /* THE ENEMY, BREAKING — S02/S03/S04's box on their stations (note F). */
    {
      const c = crowdAt(t, W, H);
      draw.push({ d:megaron.at("corner_dead").d, run(){
        placeCrowd(offctx, W, H, { ...c, t:Math.min(.98, t / D), progress:prog });
      }});
    }

    draw.sort((a, b) => a.d - b.d).forEach(x => x.run());

    /* --- 3. THE OVERLAYS, always last (notes C, E, G). ------------------- */
    /* THE PROOF, in the patch of far wall left of the hanging man, from the
       moment the shafts leave: it opens as an event and then stands as the
       record of one. */
    if (t >= CAST){
      const dst = sprDst(W, H);
      const win = sprWin(ramp(t, CAST + 3, LODGED));
      const s   = spearState(t, prog);
      detailField(offctx, W, H, dst);
      plate(offctx, W, H, spearfield, SPR_CW, SPR_CH, win, dst, s,
            `spr|${Math.round(s.t * 24)}|${Math.round(s.charge * 8)}`);
      detailRule(offctx, W, H, dst);
    }
    /* THE SIGN, hung from the middle transverse beam in the slot of note C. */
    if (t >= AEGIS) placeAegis(offctx, W, H, aegisMode(t), prog);

    /* THE ISSUE REGISTER — S03/S04's crop at S04's destination (note H). */
    {
      const mode = armMode(t);
      const as = { mode, t:0, status:mode.toUpperCase(), progress:prog };
      detailField(offctx, W, H, ARM_DST);
      plate(offctx, W, H, armour, ARM_CW, ARM_CH, ARM_WIN, ARM_DST, as, `arm|${mode}`);
      detailRule(offctx, W, H, ARM_DST);
    }
  },
};
export default scene;

/* named binding so OD-B22-S06 can `import { exitOccupancy as INITIAL }`.
   S06 plays in this same hall, so every station below is a megaron station and
   it needs no translation table. `athena` holds the station she ROSE FROM: she
   is aloft on the roof beam and the plan authors no roof station (note D). */
export const exitOccupancy = scene.exitOccupancy;
