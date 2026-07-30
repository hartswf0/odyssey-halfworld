/* ============================================================
   SCENE  OD-B23-S06 — Departure for Laertes                (Od. 23.366–372)
   Book XXIII, scene 6 — the LAST scene of the book, and the last thing that
   happens in it: four armed men walk out of the town toward the old man's farm.
   ADDITIVE: adds nothing to Books I–XV, modifies no existing module (not the
   set, not the effect, not the ensemble), and casts only assets that already
   exist. Shape copied from the reference scene scenes/OD-B16-S03.mjs and from
   its immediate predecessor scenes/OD-B23-S05.mjs.

   Beats (causal order, one master clock):
     1. At dawn Odysseus arms himself with Telemachus, Eumaeus, and Philoetius.
     2. He orders Penelope and the women to remain inside and reveal nothing.
     3. Athena covers the four men in darkness as they leave the city.
     4. They travel toward Laertes's farm before the suitors' deaths become
        public.

   ---- HOW THIS SCENE IS BUILT (Book XVI+ discipline) ----------------------

   A. THE ROOM IS A ROAD, AND IT IS THE ROAD'S OWN STATE CHANNEL THAT TELLS
      BEAT 3. The field is location.road-to-laertess-farm — authored for this
      scene (`scene:"OD-B23-S06"` in its own header), cast at scale 1.0 so it
      fills the stage the way every Book XVI+ field does. Its state channel
      carries the whole light curve of the scene, so nothing has to be hand
      drawn for it:  `day` (first light — the dawn S05 released, sky at ink 1,
      the road the brightest thing in the frame) while they arm and while he
      gives his order -> `night-cover` at COVER (Athena's screen over the town
      end: the world drops a level, the town gate goes dim and gets its lamp,
      a hatch is laid over the streets, AND THE ROAD STAYS AT INK 1 — the
      set's own tone table pins it there, which is why the covered stretch
      does not print as one black mass) -> `day` again at RELEASE (they are
      clear, the cover is let go, and the morning they were hidden from
      arrives).
      ATHENA'S DARK IS THEREFORE DRAWN TWICE ONLY WHERE IT MEANS TWO DIFFERENT
      THINGS: as a change of state in the landscape she is dimming, and as a
      travelling pocket in the effect's own section register (note E). It is
      never drawn as a wash over the plate — a wash is what the dot pass eats.

   B. THE FIELD IS PLACED AT y = 1.000, NOT AT THE CUSTOMARY 0.99, AND THAT IS
      A MEASURED CHANGE. This scene resolves every foot line directly off the
      set's own published anchors and its own depth ladder (notes C and D). At
      anchor y = 0.99 the full-bleed branch of placeInstance draws the set from
      y = −7.6px, which slides the painted carriageway up 7.6px while the
      figures stay where the anchors put them: four men standing 7.6px under
      their own road. At y = 1.000 the set's fractions map 1:1 onto the stage
      and a foot line means what it says.

   C. NO HAND-PLACED ANCHORS, AND THE PLAN IS INVERTED OUT OF THE SET.
      location.road-to-laertess-farm authors no makePlan() plan; it publishes
      37 anchors cut from its own road cubic. So the local plan below is
      DERIVED, exactly as OD-B17-S02 derives the town road: unproject() solves
      README §5's projection the other way, and `st(name, dx)` returns the plan
      station whose forward projection IS the set's own exported anchor,
      optionally shifted dx ACROSS the carriageway in plan space (a lateral
      offset in plan space shrinks on screen with depth, which is what a road
      does). Nothing in this file is a typed coordinate: every station is a
      published anchor plus a lane.
      st() ROUND-TRIPS EVERY STATION AND THROWS ON ANY THAT DOES NOT COME
      BACK, AND THAT IS THE CROSS-ROOM CHECK APPLIED TO A LANDSCAPE. The
      projection y = 0.50 + 0.46·z^1.08 cannot put anything above y = 0.50 and
      saturates at 0.96, so the set's far half — `road:upper`,
      `road:farm-approach`, `threshold:farm-gate`, the whole steading
      (y 0.396–0.455) and the orchard head — is UNREACHABLE by it: inverted
      they all clamp to z = 0.08 and come back at y 0.530, 30 to 100px from
      where the set painted them. st() re-projects each inverted station,
      compares it with the anchor it came from, and throws if the drift exceeds
      0.012 of H (9px, inside every carriageway on this road) rather than
      silently clamping. `road:lower` (y 0.969) is the one station that
      saturates and still passes: it lands at y 0.960, 7px up-frame, in a
      carriageway 105px wide, and it is recorded here rather than hidden.
      THIS IS ALSO WHY NO BODY STANDS IN THE CITY GATE. `threshold:city-gate`
      IS a legal station (y 0.568) and it is kept in the plan for Book XXIV,
      but the set draws that gate as a middle-distance miniature — a 35px
      opening — and a figure resolved to it prints at 92px, two and a half
      times the height of the door it is coming out of. The town is scenery in
      this plate, not a stage: the file musters on the near carriageway, just
      outside it, at the boundary stone.

   D. THE PLAN OWNS WHERE A BODY STANDS; THE SET OWNS HOW BIG IT IS THERE.
      Lifted from OD-B17-S02, for the same reason and with the same care.
      project()'s scale ramp spans only 1.7x from the near floor to the far
      wall because it is tuned for a room four paces deep. This road is not: the
      set's own published law is one ladder off ground height,
      depthAtY(y) = 0.070 + 0.930·groundU(y)^1.22, and the set draws EVERYTHING
      that stands on its ground through it — trees, waymarks, the well, the
      farm. Sizing figures with project() instead makes a man walk up the road
      and not get smaller. So blockingAt() resolves x and y and the moving
      flag, and depthAtY() of the RESOLVED y resolves the height, continuously,
      so a body shrinks exactly like the road it is on. The three constants are
      the set's own (its horizon is read off `field.params`; NEAR_Y, the
      exponent and the range are restated because the module does not export
      them, and they are restated to the digit).
      THE SIZE WAS SET AGAINST THE ARCHITECTURE, NOT AGAINST THE FRAME. At
      MAN = 0.34 a body box at the near muster is 258px, the man inside it is
      about 145px, and the carriageway under his feet is 105px wide: a man a
      little taller than the track is wide, which is what a country cart road
      looks like. He falls to about 70px at `mid` — 4/5 of the way to the farm
      gate — and the farm he is walking toward is 33px high. Nobody is sent
      past `mid`: the last two road anchors would put a 40px man beside a 40px
      fruit tree, under the dot pitch, and the story does not need them. They
      are TRAVELLING toward the farm at the last frame; Book XXIV arrives.

   E. THE EFFECT IS ONE KEYED WINDOW ON THE ONE CLEAR PLANE, AND IT IS THE
      SECTION REGISTER. divine_fx.athenas-departure-darkness was authored for
      this scene (`scene:"OD-B23-S06"`, `pairsWith:"location.road-to-laertess-
      farm"`). Cast whole at scale 1.0 it would repaint the plate; so, exactly
      as S05 did with its prophecy, it is blitted as ONE 1:1 WINDOW — layers
      `section / seen`, window x .058–.940, y .682–.958 of its own square box,
      onto the sky at x .5051–.965, y .018–.2301. Source box 584px, crop
      515x161, destination 515x161: no resampling, which matters because the
      module draws its contour in absolute pixel widths.
      WHAT THAT CROP HOLDS IS THE ONE CLAIM OF THE ASSET: the four travellers
      in section — four blocky armed marks, spear and shield, 78px tall — each
      TETHERED BY A DASHED LINE UP INTO THE LID of a chamfered envelope of open
      vertical curtain. The dark has an address that keeps changing and it is
      fixed to the bodies, not to a place. Dawn's rays arrive on the lid and
      die there on heavy termination courses; the envelope drifts with
      `travel`; and the count of men who saw them (00, seven-segment bars, with
      a shut eye and a cross) closes it. All four channels — t, dark, travel,
      watch — run on the scene's own clock.
      THE PLAN REGISTER IS CROPPED AWAY, AND FOR TWO REASONS, BOTH SPECIFIC.
      First, the set already paints this town, in elevation, with the gate they
      leave by and the palace roofline behind it: drawing the same town again
      in plan, 40px above it, is the collage this convention exists to stop.
      Second, it does not survive the crop. The widest window the sky will take
      above the far range's crest (which reaches y 189) is 515px; the plan
      register is 0.85 of the module's width, so at 1:1 it would need a 606px
      box, in which its twelve blocks come out 97px wide and its street
      centre-dashes are drawn — in absolute widths — at 2.2px, under this
      pipeline's dot pitch (MESH cell 5 at DPR 2 = 4.1 CSS px). That is the
      failure the brief names: structure dissolving in the lattice. The route
      out of town is still TOLD — it is the whole of beat 3, it is on this
      clock as `travel`, and it is what makes the envelope drift — and the
      travelling pocket's own witness sightlines are told by the count that
      survived: nobody saw them.
      THE READOUTS ARE BARS, NOT TYPE. The one numeral in the frame is the
      module's seven-segment `00`, 36px high with 8px bars. There is no text
      anywhere in this scene, and the only blue mark in the plate is the
      engine's own card.

   F. FOUR BODIES, THREE INSTANCES, AND THE ENSEMBLE IS BLITTED INTO A BOX OF
      CHOSEN ASPECT. ensemble.eumaeus-and-philoetius is ONE instance carrying
      TWO men, and its roster puts them at x .285 and .655 of its own box — so
      the box's ASPECT is what sets how far apart the swineherd and the cowherd
      stand. Blitted through placeInstance's 1.47 stage aspect they come out
      119px apart on a 105px road, straddling it. At AR_PAIR = 1.06 they are
      97px apart, each about 145px tall, both boots on the carriageway. Its
      shell is dropped (`showShell:false` — it paints a megaron floor and two
      column stubs, and this is a road), its rear rank is dropped
      (`density:0`, `background:0` — Homer sends four men, not a household) and
      its foreground shield crop is dropped (`foreground:0` — that rim is the
      king's own shield, and the king is IN this frame at his own scale).
      BEAT 1 IS THIS MODULE'S `arming` CHANNEL, RUN ONCE, ON THE REAL BODIES.
      Its kit ladder crosses farm kit -> helmet in the hand -> THE SNAP (helmet
      on, shield and spear take the two hands) -> shield at the shoulder, and
      one global number drives both men through a per-member stagger, so the
      swineherd is already a soldier while the cowherd still has the helmet in
      his fist. That wave, from 0 to 1 across ARM..ORDER, IS the arming, drawn
      on the two men who are actually arming, with no prop asset cast and no
      hand-drawn mark. Their formation walks with it: `serving` -> `arming` ->
      `shield-wall` -> `advance` when they step off, which is the module's own
      walking row (stride .15, spear at 52°, lean .11).

   G. ONE BODY, ONE GUISE, NO FLARE. Odysseus is character.odysseus-b16 at guise
      `restored` for the whole scene: the channel is used, held at its end
      value, exactly as S05 held it. The atlas asks for `character.odysseus`;
      that module is the Books I–XV body and this is Book XXIII, so the cast id
      is its declared continuity heir (`continuityOf:"character.odysseus"`).
      The ramp was spent in OD-B16-S03 and nothing about him changes here, so
      divine_fx.athenas-restoration is not imported.

   H. ONE MIRROR FLIP IN THE WHOLE SCENE, AND IT IS A TURN. The road's net
      direction of travel is up and to the RIGHT (from x 281 at the muster to
      x 548 at `mid`), and the town he is leaving is up and to the LEFT (the
      gate at x 151, the palace roofline behind it). The ensemble's men face
      screen right natively and are never flipped. Telemachus is `mirror:true`
      throughout — square to the road, looking back over his shoulder at his
      father by explicit gaze, which is applied after the mirror is composed
      and is therefore already in final screen terms. Odysseus is
      `mirror:false` while he faces the town and gives his order, and
      `mirror:true` from SETOUT: ONE flip, on the frame he turns from the house
      to the road. It is a body turning, not a cut between two bodies.

   I. PENELOPE IS DROPPED, AND THE DROP IS BEAT 2. OD-B23-S05 exports
      { odysseus:"bed_in_l", penelope:"bed_in_r" } — marks in the marriage
      chamber, which blockingAt would (correctly) throw on out here. The map is
      one line long:  bed_in_l -> fork_king. HE GETS UP OUT OF THAT BED AND
      WALKS OUT OF THE TOWN, and SHE DOES NOT: `bed_in_r` has no road
      equivalent because Penelope has none — beat 2 is him ordering her and the
      women to stay inside and say nothing, so the correct render of her is a
      body that is not on this road, behind the wall the set paints, in the
      house under the roofline over his left shoulder. Casting her here would
      un-tell the order. Telemachus, Eumaeus and Philoetius are not in S05's
      exit at all (S05 dropped them in the great hall); they enter this scene
      on the near carriageway through their own first legs.

   J. TONE. Hand-drawn ctx overpaint in this file is ZERO: every mark on the
      plate is made by a module. The set is `day` (sky ink 1, ground 2, road 1)
      for the first two beats and the last, and one level down for the covered
      stretch in the middle, where the set's own table still pins the road at
      ink 1 — the road stays the brightest thing in the frame, which is what
      the set was built to do. The sky is a light plane and the crop of the
      effect that sits in it is a light plane too: white-cored boxes and open
      curtain hatch, not a fill. The darkest masses in the plate are the town
      gate's arch, the orchard's fruit trees and four heads of hair.

   CONTINUITY OUT — computed, never written:
     { odysseus:"mid_king", telemachus:"spur_son", herdsmen:"bend" }
   A file of four strung out along the carriageway, four fifths of the way to
   the orchard wall and still walking. `exitOccupancyRoad` folds the three lanes
   back onto the set's own centre-line anchors for any Book XXIV scene that
   resumes on this road off the published anchors alone.

   Verify (the arming under first light; and the covered file on the road):
     node harness/render-scene.mjs scenes/OD-B23-S06.mjs --t 16
     node harness/render-scene.mjs scenes/OD-B23-S06.mjs --t 64
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, clamp01, smooth }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt, SPREAD_FAR } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { anchors as ROAD } from "../assets/location/road-to-laertess-farm.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import herdsmen   from "../assets/ensemble/eumaeus-and-philoetius.mjs";
import cover      from "../assets/divine_fx/athenas-departure-darkness.mjs";

const FIELD_ASSET = "location.road-to-laertess-farm";
const D = 84;

/* the set, split on its own declared occlusion order (`occlusion.front`) so the
   near verge wall and the near fig tree are drawn OVER a body that passes them */
const BACK_LAYERS  = ["sky","hills","ground","fields","tracks","city","orchard",
                      "farm","road","spur","halt"];
const FRONT_LAYERS = ["verge","fg"];

/* ---- THE SET'S OWN DEPTH LADDER (note D) --------------------------------
   horizon is read off the module; NEAR_Y, the exponent and the range are the
   set's own three numbers, restated because it does not export them. */
const HORIZON = field.params.horizon;          // 0.300
const NEAR_Y  = 1.040;
const groundU = y => clamp((y - HORIZON) / (NEAR_Y - HORIZON), 0, 1);
const depthAtY = y => 0.070 + 0.930 * Math.pow(groundU(y), 1.22);

/* ---- THE PLAN, INVERTED OUT OF THE SET'S OWN ANCHORS (note C) ------------ */
function unproject(X, Y){
  const z = clamp(Math.pow(Math.max(1e-4, Y - 0.50) / 0.46, 1 / 1.08), 0.08, 1);
  const spread = SPREAD_FAR + (1 - SPREAD_FAR) * z;
  return { x: 0.5 + (X - 0.5) / spread, z };
}
const reproject = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const st = (name, dx = 0) => {
  const a = ROAD[name];
  if (!a) throw new Error(`[OD-B23-S06] the set exports no anchor "${name}"`);
  const p = unproject(a.x, a.y);
  /* the ROUND-TRIP CHECK, and it is the cross-room check applied to a
     landscape: if the forward projection of the inverted station does not land
     back on the set's own anchor, the projection cannot represent that ground
     and no body may be sent there. 0.012 of H is 9px — inside every
     carriageway on this road; anything worse is a lie about where a man is. */
  const back = reproject(p.z), drift = Math.abs(back - a.y);
  if (drift > 0.012)
    throw new Error(`[OD-B23-S06] anchor "${name}" (y=${a.y}) is outside the ` +
      `projection's reach — it inverts to z=${p.z.toFixed(3)} and comes back at ` +
      `y=${back.toFixed(3)}, ${(drift*760).toFixed(0)}px away. See note C; it ` +
      `cannot be a station.`);
  return { x:+(p.x + dx).toFixed(4), z:+p.z.toFixed(4) };
};
/* three lanes across the carriageway. Small on purpose: this track is 105px
   wide at the muster and 54px at `mid`, and a lane wide enough to read as a
   second file would put a man in the stubble. */
const LANE = { king:-0.030, son:0.035, herds:0 };
/* the five road anchors the projection can reach, near -> far, plus the one
   that saturates (`lower`, note C) */
const ROW = { lower:"road:lower", boundary:"road:boundary", fork:"road:cart-fork",
              bend:"road:bend", spur:"road:city-spur", mid:"road:mid" };
const STATIONS = {};
for (const [row, anchor] of Object.entries(ROW)){
  STATIONS[row] = st(anchor);                                  // the centre-line
  for (const [lane, dx] of Object.entries(LANE))
    STATIONS[`${row}_${lane}`] = st(anchor, dx);
}
/* declared, kept for Book XXIV, and deliberately unoccupied — note C */
STATIONS.city_gate = st("threshold:city-gate");

export const roadToLaertes = makePlan({
  id:"road-to-laertes",
  name:"The Road out of the Town to Laertes's Farm",
  notes:"Local plan for OD-B23-S06, inverted out of location.road-to-laertess-" +
        "farm's own exported anchors so the plan and the painted road are one " +
        "road. Six rows of the carriageway, near -> far, each with three lanes " +
        "across it; heights are NOT taken from this plan but from the set's own " +
        "depth ladder (note D). The far half of the set — the farm, the farm " +
        "gate, the orchard head — has no stations: the projection cannot reach " +
        "above y 0.958 and st() throws rather than clamp (note C).",
  stations:STATIONS,
  fixtures:[
    { id:"boundary_stone", kind:"prop", at:"boundary" },   // the set draws it at x 126
    { id:"city_gate",      kind:"set_piece", at:"city_gate" },
  ],
});

/* ---- THE CLOCK ---------------------------------------------------------- */
const ARM     =  0;   // first light. The two herdsmen cross the kit ladder
const ORDER   = 26;   // he turns back to the town: stay inside, say nothing
const COVER   = 38;   // Athena pours the night over the four of them
const SETOUT  = 44;   // the file steps off
const RELEASE = 74;   // clear of the town's land — the cover is let go

/* ---- CONTINUITY IN: imported, and translated (note I) -------------------- */
import { exitOccupancy as PREV_EXIT } from "./OD-B23-S05.mjs";
const CHAMBER_TO_ROAD = { bed_in_l:"fork_king" };
const INITIAL = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, station]) => [who, CHAMBER_TO_ROAD[station]])
    .filter(([, station]) => station));

/* ---- BLOCKING. Stations, not coordinates. A file of four up one road. ---- */
const MOVES = [
  // the king is at the head of it and steps off first
  { who:"odysseus",   from:"fork_king",     to:"bend_king", t0:44, t1:53 },
  { who:"odysseus",   from:"bend_king",     to:"spur_king", t0:53, t1:61 },
  { who:"odysseus",   from:"spur_king",     to:"mid_king",  t0:61, t1:70 },
  // his son, one leg behind him the whole way
  { who:"telemachus", from:"boundary_son",  to:"fork_son",  t0:47, t1:56 },
  { who:"telemachus", from:"fork_son",      to:"bend_son",  t0:56, t1:64 },
  { who:"telemachus", from:"bend_son",      to:"spur_son",  t0:64, t1:73 },
  // the two herdsmen last, on the centre-line, two legs behind
  { who:"herdsmen",   from:"lower",         to:"boundary",  t0:50, t1:59 },
  { who:"herdsmen",   from:"boundary",      to:"fork",      t0:59, t1:67 },
  { who:"herdsmen",   from:"fork",          to:"bend",      t0:67, t1:76 },
];

/* ---- THE RAMPS. One number each, and every one of them is a beat. -------- */
const arming  = t => smooth(clamp01((t - ARM) / (ORDER - ARM)));      // beat 1
const dark    = t => t < COVER   ? 0
                   : t < RELEASE ? smooth(clamp01((t - COVER) / 8))
                   : 1 - 0.92 * smooth(clamp01((t - RELEASE) / 6));   // beat 3
const travel  = t => clamp01((t - COVER) / (RELEASE - COVER));        // beat 3/4
const watch   = t => t < COVER   ? 0.25
                   : t < RELEASE ? 0.25 + 0.75 * smooth(clamp01((t - COVER) / 4))
                   : 1 - 0.82 * smooth(clamp01((t - RELEASE) / 6));

/* ---- ONE HEIGHT LAW FOR EVERY HUMAN ON THIS ROAD (note D) --------------- */
const MAN     = 0.60;            // body-box height at depth 1, fraction of H
const AR_MAN  = 1120 / 760;      // the stage aspect placeInstance would give
const FLOOR_MAN = 0.94;          // figure-hero plants the ankles at .94 of its box
const PAIR    = MAN * 1.10;      // the ensemble's band is .585 of its box, the
                                 // rig's body about .64 of its own: this equalises
const AR_PAIR = 1.06;            // 97px between the two herdsmen (note F)
const FLOOR_PAIR = 0.955;        // BAND.front.footY
const FX_PAIR = 0.470;           // the roster's own midpoint between the two men

/* placeBody — blit a module into a box of chosen aspect, standing on its own
   published floor line, at the plan's x and y. `sig` is required:
   keyedModuleCanvas caches on pose/band/formation/t only. */
function placeBody(offctx, W, H, mod, { x, y, hFrac, ar, floor, fx = 0.5,
                                        state = {}, sig = "", pad = 0.10 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, 0.895, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - floor * h - pad * h);
}

/* ---- THE COVER WINDOW (note E) ------------------------------------------
   One 1:1 keyed window of the section register, laid on the sky above the far
   range's crest. 584px source box -> a 515x161 crop -> a 515x161 destination. */
const FX_C   = 584;
const FX_WIN = { x0:.058, y0:.682, x1:.940, y1:.958 };
const FX_DST = { x0:.5051, y0:.018, x1:.965, y1:.2301 };
const FX_LAYERS = ["section","seen"];
function placeCover(offctx, W, H, state, sig){
  const cv = keyedModuleCanvas(cover, FX_C, FX_C, state, sig);
  offctx.drawImage(cv,
    FX_WIN.x0 * FX_C, FX_WIN.y0 * FX_C,
    (FX_WIN.x1 - FX_WIN.x0) * FX_C, (FX_WIN.y1 - FX_WIN.y0) * FX_C,
    FX_DST.x0 * W, FX_DST.y0 * H,
    (FX_DST.x1 - FX_DST.x0) * W, (FX_DST.y1 - FX_DST.y0) * H);
}

export const scene = {
  id:"OD-B23-S06",
  title:"Departure for Laertes",
  book:23,
  plan:"road-to-laertes",
  duration:D,
  beats:[
    "At dawn Odysseus arms himself with Telemachus, Eumaeus, and Philoetius.",
    "He orders Penelope and the women to remain inside and reveal nothing.",
    "Athena covers the four men in darkness as they leave the city.",
    "They travel toward Laertes's farm before the suitors' deaths become public.",
  ],
  exitState:
    "The road out of the town of Ithaca, in first light, and THE FOUR OF THEM " +
    "ARE ON IT AND STILL WALKING. They are a file strung out along one " +
    "carriageway, near to far: the two herdsmen on the centre-line at the bend " +
    "(`bend`, 145px men), Telemachus one leg ahead of them in the right-hand " +
    "lane at the city spur (`spur_son`), and ODYSSEUS AT THE HEAD OF IT in the " +
    "left-hand lane at `mid` — four fifths of the way to the orchard wall, with " +
    "the farm gate and the smoke of the old man's house at the far end of the " +
    "same road, unreached. THEY ARE ARMED. ensemble.eumaeus-and-philoetius has " +
    "run its whole kit ladder on this clock — farm kit, the helmet taken up in " +
    "the fist, THE SNAP where the tool leaves the hand and shield and spear " +
    "take it, shield at the shoulder — staggered, so the swineherd was a " +
    "soldier while the cowherd was still holding his helmet, and both of them " +
    "are now in the module's own walking formation, `advance`. THE ORDER WAS " +
    "GIVEN AND IT STANDS: Penelope and the women of the house are inside, " +
    "behind the wall this set paints, under the palace roofline over his left " +
    "shoulder, and they will say nothing — she is the one body S05 handed over " +
    "that is deliberately NOT on this road. THE COVER IS SPENT. " +
    "divine_fx.athenas-departure-darkness ran all four of its channels here: " +
    "the pocket of night gathered at first light, took the four of them into a " +
    "chamfered envelope with each man tethered by a dashed line up into its " +
    "lid, travelled the whole run out of town with dawn's rays dying on that " +
    "lid, and was LET GO at RELEASE — the envelope is a shallow remnant, the " +
    "tethers are gone, the men stand free of it in open morning, and the count " +
    "that closes the register is 00: nobody in the town saw them go. THE DEATHS " +
    "ARE STILL NOT PUBLIC. Odysseus is ONE body at guise `restored`, held, no " +
    "ramp and no flare: nothing about him changed in this scene either. The " +
    "household Book XXIV inherits is split — four armed men on the road to " +
    "Laertes, a queen and her women silent in the house, and a town that does " +
    "not yet know.",
  exitOccupancy:occupancyAt(roadToLaertes, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    odysseus:"none — he is already on the carriageway at t=0, at `fork_king`, " +
             "translated from S05's `bed_in_l` through the declared " +
             "chamber->road map (note I). He got out of that bed and came out " +
             "of the town, which is off the bottom edge of this set.",
    telemachus:"none — on the road at `boundary_son` from t=0, beside the " +
               "boundary stone the set draws at x 126",
    herdsmen:"none — on the near centre-line at `lower` from t=0, the nearest " +
             "and largest bodies in the plate, because the ARMING is drawn on " +
             "them (note F)",
    cover_01:"not a body: the window comes up at COVER=38, the second the dark " +
             "is poured, and it does not go down — it is let go, which is a " +
             "different thing and is drawn (note E)",
    penelope:"NONE, AND THAT IS BEAT 2 (note I). She is inside the house, " +
             "behind the town wall this set paints, and is not cast.",
  },
  exits:{
    odysseus:"none — he holds `mid_king`, walking, into Book XXIV",
    telemachus:"none — holds `spur_son`, one leg behind his father",
    herdsmen:"none — hold `bend` on the centre-line, two legs behind",
    "the cover":"RELEASED at 74. This is the one thing in the scene that ends: " +
                "the set goes back to `day` and the effect's envelope collapses " +
                "to a remnant with no tethers.",
  },
  walkable:"the set's own `walkable` band (x .02–.98, y .40–.99) narrowed to its " +
           "own `road` band, and in practice to the carriageway itself: six rows " +
           "of the road cubic, near to far (`lower`, `boundary`, `cart-fork`, " +
           "`bend`, `city-spur`, `mid`), each with three lanes across it. The " +
           "carriageway is 105px wide at the muster and 54px at `mid`, so the " +
           "lanes are ±0.03 in plan space and no more — a wider lane puts a man " +
           "in the stubble. NOTHING above y 0.958 is walkable in this scene: the " +
           "farmyard, the farm gate and the orchard head are outside the " +
           "projection's reach and st() throws on them (note C).",
  depthOrder:"one queue, on the set's own declared occlusion order: the set's " +
             "BACK layers (sky, the two humps of the far range, ground, fields, " +
             "rural tracks, the town and its gate, the orchard, the farm, the " +
             "road, the city spur, the well and the boundary stone); then the " +
             "three body instances sorted by their resolved plan depth, far " +
             "first, so a nearer man is drawn over a farther one; then the set's " +
             "FRONT layers (the near verge walls and the cropped fig tree at the " +
             "bottom-right corner), which a body passes behind. The cover window " +
             "is over everything, because it is not a thing in the landscape at " +
             "all — it is the section through it.",
  gazeTargets:{
    odysseus:"up the road, north-east toward the orchard wall and the farm, " +
             "while he arms; then BACK AND LEFT at the town — the gate at x 151 " +
             "and the palace roofline behind it, which is where Penelope is — " +
             "for the whole of the order; then, from COVER, up-left at the dark " +
             "coming over them; then up the road again from SETOUT and never off " +
             "it again",
    telemachus:"square to the road but looking back over his shoulder at his " +
               "father for the arming and the order; then up-left at the cover; " +
               "then up the road",
    herdsmen:"the module's own `focus` and `attention` channels: both heads come " +
             "round onto the king (focus low-left in their box) while they arm, " +
             "and onto the road ahead (focus high-right) once they step off",
    cover_01:"n/a — its tethers point one way, up from four heads into the lid " +
             "the dark is hung from",
  },
  attachments:[
    { at:ARM,     who:"herdsmen", change:"`serving`, arming 0: farm kit — staff, " +
      "ox-hide, jug; bare head" },
    { at:10,      who:"herdsmen", change:"`arming` — the tool is set down and the " +
      "helmet comes up in the fist, staggered so the two men are not at the same " +
      "stage on the same frame" },
    { at:22,      who:"herdsmen", change:"`shield-wall`, arming -> 1: helmet on, " +
      "shield and spear in the two hands. THE SNAP is beat 1" },
    { at:ORDER,   who:"odysseus", change:"turns to the town: mirror false held, " +
      "`confrontation`, the order given (note H)" },
    { at:COVER,   who:"cover_01", change:"cast, `section`+`seen`: the dark " +
      "gathers, the envelope grows down out of its lid and the four tethers take" },
    { at:COVER,   who:"road_01",  change:"`night-cover` — the world drops a " +
      "level, the gate lamp comes on, a hatch is laid over the streets, and the " +
      "road stays at ink 1 (note A)" },
    { at:SETOUT,  who:"odysseus", change:"mirror false -> TRUE. ONE flip in the " +
      "scene, and it is the turn from the house to the road (note H)" },
    { at:SETOUT,  who:"herdsmen", change:"`advance` — the module's own walking " +
      "row: stride .15, spear at 52°, lean .11" },
    { at:RELEASE, who:"cover_01", change:"dark -> 0.08, watch -> 0.18: the " +
      "tethers go, the envelope collapses to a remnant, the men stand free in " +
      "the morning" },
    { at:RELEASE, who:"road_01",  change:"`day` — the cover is let go and the " +
      "first light they were hidden from arrives on the whole landscape" },
    { at:"never", who:"odysseus", change:"nothing. Guise `restored`, held; no " +
      "ramp, no flare, no cut (note G)" },
  ],
  sound:[
    { at:ARM,     source:"lower",     cue:"bronze being taken up by two men who " +
      "have never worn it — a jug set down on stone, a helmet knocking a shield rim" },
    { at:ORDER,   source:"fork_king", cue:"one voice, low and short, aimed back " +
      "at a house: nobody goes out, nobody says anything" },
    { at:COVER,   source:"city_gate", cue:"the town going quiet a street at a " +
      "time, and no door opening" },
    { at:SETOUT,  source:"boundary",  cue:"four pairs of feet finding one road" },
    { at:RELEASE, source:"mid_king",  cue:"birds, and the morning arriving on " +
      "open country with nobody behind them" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"road_01",
      anchor:{x:.50,y:1.00}, scale:1.0, state:"day" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.152,y:.811}, scale:.225, band:"threeq", pose:"confrontation" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.189,y:.890}, scale:.264, band:"threeq", pose:"alert" },
    { asset:"ensemble.eumaeus-and-philoetius", instance:"herdsmen",
      anchor:{x:.251,y:.960}, scale:.329, state:"serving" },
    { asset:"divine-fx.athenas-departure-darkness", instance:"cover_01",
      anchor:{x:.735,y:.230}, scale:.46, blend:"multiply" },
  ],

  timeline:[
    // 1. first light, and two herdsmen becoming soldiers
    { op:"actor.pose", target:"odysseus",   at:ARM,     args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus",   at:ARM,     args:{ gaze:{ x:.30, y:-.20 } } },
    { op:"actor.pose", target:"telemachus", at:ARM,     args:{ pose:"alert" } },
    { op:"actor.gaze", target:"telemachus", at:ARM,     args:{ gaze:{ x:-.34, y:-.14 } } },
    { op:"actor.pose", target:"odysseus",   at:14,      args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus",   at:14,      args:{ gaze:{ x:.34, y:-.26 } } },
    // 2. he turns back on the house and gives the order
    { op:"actor.pose", target:"odysseus",   at:ORDER,   args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",   at:ORDER,   args:{ gaze:{ x:-.36, y:-.30 } } },
    { op:"actor.pose", target:"telemachus", at:ORDER,   args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at:ORDER,   args:{ gaze:{ x:-.30, y:-.22 } } },
    // 3. Athena pours the night over the four of them
    { op:"fx.play",    target:"cover_01",   at:COVER,   args:{ dir:"gathering" } },
    { op:"actor.pose", target:"odysseus",   at:COVER,   args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus",   at:COVER,   args:{ gaze:{ x:-.16, y:-.42 } } },
    { op:"actor.gaze", target:"telemachus", at:COVER,   args:{ gaze:{ x:-.12, y:-.40 } } },
    { op:"actor.pose", target:"telemachus", at:COVER,   args:{ pose:"protective_block" } },
    // 4. the file steps off up the road
    { op:"actor.pose", target:"odysseus",   at:SETOUT,  args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at:SETOUT,  args:{ gaze:{ x:.34, y:-.18 } } },
    { op:"actor.pose", target:"telemachus", at:SETOUT+3,args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"telemachus", at:SETOUT+3,args:{ gaze:{ x:.30, y:-.16 } } },
    { op:"actor.gaze", target:"odysseus",   at:RELEASE, args:{ gaze:{ x:.30, y:-.24 } } },
    { op:"timeline.capture", target:"OD-B23-S06", at:D - 1, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const stt    = stateAt(scene, t);
    const blk    = blockingAt(roadToLaertes, MOVES, t, INITIAL);
    const breath = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle
    const prog   = clamp01(0.05 + 0.92 * (t / D));
    const a      = arming(t);
    const dk     = dark(t), tv = travel(t), wt = watch(t);
    const walking = t >= SETOUT;
    const roomState = t < COVER ? "day" : t < RELEASE ? "night-cover" : "day";
    const status = t < 14      ? "THEY ARM AT FIRST LIGHT"
                 : t < ORDER   ? "FOUR, AND FOUR SPEARS"
                 : t < COVER   ? "STAY INSIDE, SAY NOTHING"
                 : t < SETOUT  ? "NIGHT POURED OVER FOUR MEN"
                 : t < RELEASE ? "LED OUT OF THE TOWN"
                 :               "TOWARD THE OLD MAN'S FARM";

    /* --- 1. THE LANDSCAPE, back layers (notes A, B). It paints the field;
       every foot line in the scene keys onto its own ladder. -------------- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:1.00 }, scale:1.0,
      state:{ state:roomState, t:breath, layers:BACK_LAYERS,
              status, progress:prog },
    });

    /* --- 2. THE FILE: three instances, four men, far drawn first --------- */
    const order = ["odysseus","telemachus","herdsmen"]
      .sort((p, q) => (blk[p].y - blk[q].y) || (blk[p].x - blk[q].x));

    for (const who of order){
      const p = blk[who];
      const s = stt[who] || {};
      const d = depthAtY(p.y);                    // the SET's ladder (note D)

      if (who === "odysseus"){
        /* ONE BODY, ONE GUISE, HELD (note G). Mirrored once, at SETOUT, and
           that flip is him turning from the house to the road (note H). */
        const arms    = t < ORDER;
        const commands= t >= ORDER && t < COVER;
        const covered = t >= COVER && t < SETOUT;
        const pose = s.pose || "torso_open";
        const gaze = s.gaze || { x:.30, y:-.20 };
        placeBody(offctx, W, H, odysseus, {
          x:p.x, y:p.y, hFrac:MAN * d, ar:AR_MAN, floor:FLOOR_MAN,
          state:{
            t:breath, guise:"restored", band:"threeq", mirror:walking, pose, gaze,
            browUp:   covered ? .34 : commands ? .12 : .18,
            browKnit: commands ? .48 : covered ? .26 : .22,
            eyeNarrow:commands ? .38 : walking ? .30 : .18,
            eyeWide:  covered ? .22 : 0,
            jaw:      commands ? .30 : 0,
            mouthAsym:commands ? .18 : .08,
            smile:    0,
            frown:    commands ? .28 : 0,
            status:   walking ? "AT THE HEAD OF IT"
                    : covered ? "SHE IS LEADING US OUT"
                    : commands ? "NOBODY GOES OUT" : arms ? "ARMED AT DAWN" : "",
            progress: prog,
          },
          sig:`ody|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${walking?1:0}|${commands?1:0}|${covered?1:0}|${arms?1:0}`,
        });

      } else if (who === "telemachus"){
        const listens = t < COVER;
        const covered = t >= COVER && t < SETOUT;
        const pose = s.pose || "alert";
        const gaze = s.gaze || { x:-.34, y:-.14 };
        placeBody(offctx, W, H, telemachus, {
          x:p.x, y:p.y, hFrac:MAN * d, ar:AR_MAN, floor:FLOOR_MAN,
          state:{
            t:breath, band:"threeq", mirror:true, pose, gaze,
            browUp:   covered ? .46 : .30,
            browKnit: listens ? .24 : .14,
            eyeWide:  covered ? .40 : .20,
            eyeNarrow:walking ? .24 : 0,
            jaw:      covered ? .22 : 0,
            frown:    0,
            status:   walking ? "ONE LEG BEHIND HIM"
                    : covered ? "THE DARK CAME DOWN" : "HE LISTENS",
            progress: prog,
          },
          sig:`tel|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
             + `|${walking?1:0}|${covered?1:0}|${listens?1:0}`,
        });

      } else {
        /* THE TWO HERDSMEN: one ensemble instance, its shell, rear rank and
           foreground crop all dropped, in a box whose ASPECT sets how far
           apart the swineherd and the cowherd stand (note F). Beat 1 is its
           own `arming` channel, run once. */
        const formation = walking      ? "advance"
                        : a >= 0.92    ? "shield-wall"
                        : a >= 0.30    ? "arming" : "serving";
        placeBody(offctx, W, H, herdsmen, {
          x:p.x, y:p.y, hFrac:PAIR * d, ar:AR_PAIR, floor:FLOOR_PAIR, fx:FX_PAIR,
          state:{
            t:breath, formation, arming:a,
            stagger:0.34, span:0.52,
            density:0, background:0, foreground:0, showShell:false,
            attention:0.82, resolve:walking ? 0.92 : 0.30 + 0.62 * a,
            wave:1.4,
            focus: walking ? { x:0.95, y:0.30 } : { x:0.05, y:0.26 },
            status: walking ? "UNDER ARMS, WALKING"
                  : a >= 0.92 ? "SHIELD AND SPEAR" : "TWO HERDSMEN ARMING",
            progress: prog,
          },
          sig:`pair|${formation}|${Math.round(a*24)}|${walking?1:0}`,
        });
      }
    }

    /* --- 3. THE LANDSCAPE, front layers: the near verge walls and the
       cropped fig tree, which a body passes behind. ---------------------- */
    placeInstance(offctx, W, H, field, {
      anchor:{ x:.50, y:1.00 }, scale:1.0,
      state:{ state:roomState, t:breath, layers:FRONT_LAYERS,
              status, progress:prog },
    });

    /* --- 4. THE COVER: one keyed window of the section register, on the sky,
       from the frame the dark is poured (note E). ------------------------ */
    if (t >= COVER){
      const phase = dk < 0.35 ? "gathering" : t < RELEASE ? "leading" : "released";
      placeCover(offctx, W, H, {
        t:breath * 3, dark:dk, travel:tv, watch:wt, layers:FX_LAYERS,
        status: phase === "released" ? "RELEASED"
              : phase === "leading"  ? "LEADING" : "GATHERING",
        progress: clamp01(0.12 + 0.84 * tv),
      }, `cover|${phase}|${Math.round(dk*20)}|${Math.round(tv*24)}`
        + `|${Math.round(wt*10)}|${Math.round(breath*12)}`);
    }
  },
};
export default scene;

/* named binding so a Book XXIV scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;

/* the same occupancy folded onto the set's own CENTRE-LINE rows, for a Book XXIV
   scene that resumes on this road off the published anchors alone (brief note F:
   declare the map, do not guess). The lanes are this file's; the rows are the
   set's, and a file that stops walking closes up onto the middle of the road. */
const TO_CENTRE = { mid_king:"mid", spur_son:"spur", bend:"bend" };
export const exitOccupancyRoad = Object.fromEntries(
  Object.entries(exitOccupancy)
    .map(([who, station]) => [who, station in TO_CENTRE ? TO_CENTRE[station] : station])
    .filter(([, station]) => station));
