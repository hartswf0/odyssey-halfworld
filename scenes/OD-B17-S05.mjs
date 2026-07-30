/* ============================================================
   SCENE  OD-B17-S05 — Antinous Throws the Stool
   Book XVII, scene 5 of 7. ADDITIVE: creates nothing, modifies nothing; it
   only COMPOSES modules that already exist. Shape copied from the reference
   scene scenes/OD-B16-S03.mjs and from its own immediate predecessor,
   scenes/OD-B17-S04.mjs, which solved this room, this hour and these four
   bodies one beat earlier. Everything S04 argued about the megaron is inherited:
   the same room asset in the same `feast` state, the same MAN height, the same
   portrait figure box, the same right-hand pair of stations. This scene is the
   next minute of that one, and it drops two more hall layers for reasons the
   renders gave it — see HALL_LAYERS.

   ROOM. location.megaron-hall, state "feast" — ONE hall with a state channel;
   no second hall is built or cast. Every body resolves through
   scenes/_plans/megaron.mjs by station NAME, so the sill this beggar goes back
   and sits on is the sill he shoots from in XXI.

   CONTINUITY IN — computed, and for once it needs no translation. S04 exports
   exitOccupancy = { eumaeus:"bench_l2", odysseus:"bench_r2", telemachus:"table_l",
   antinous:"table_r" }. All four are megaron stations, this scene plays in the
   megaron, so INITIAL is that object unchanged and nobody is dropped. The frame
   opens exactly where S04's last frame closed: the beggar standing at the near
   end of the right-hand benches in front of the last man he came to, the
   ringleader forward at his own table with his question still in the air, the
   swineherd at the prince's side, the prince holding his tongue.

   THE ONE MOVE, AND WHY IT IS THE ONLY ONE. Homer's blocking after the blow is
   explicit: Odysseus does not stagger, he goes BACK to the threshold, sits down
   on it and lays his full scrip beside him (17.462–466), and only then does the
   hall turn on Antinous. So the scene has exactly one journey —
   bench_r2 -> threshold, t 46–56 — and the plan's own straight line makes it a
   safe one. bench_r2 is plan (.84,.76) and threshold is (.50,.16); at the
   hearth's own depth (plan z .52) the path is at plan x .704 and at the ring's
   near lip (z .445) it is at x .662, clearing the fire's plan x .395–.605 by
   .099 and .057. He walks up the right-hand side of his own fire, which is the
   same side S04 brought him down. Antinous, Telemachus and Eumaeus never move:
   the ringleader throws from his seat without standing up, which is the insult,
   and the prince not moving is the whole of his part in this book.

   THREE THINGS OCCUPY THE MIDDLE OF THE FLOOR AND NONE OF THEM IS A FIGURE:

   1 · THE STOOL — prop.thrown-footstool, whose own `scene` field is this scene.
     It is ONE instance stepped through its own state machine on the master
     clock: rest (AT TABLE) -> lift (SEIZED) -> aim (AIMED) -> flight (IN
     FLIGHT) -> impact (STRUCK) -> fall (FALLING) -> evidence (EVIDENCE). The
     module draws itself about its own front-edge midpoint at a per-mode
     rotation and foreshortening, so the same carpentry tumbles continuously.
     Its box is solved BACKWARDS from where the stool has to be: STOOL_POSE
     below mirrors the module's own cx/cy/s for each mode, and placeStool()
     inverts them, so a target point on this floor becomes a box. The three
     modes that draw their own broken floor line (rest, fall, evidence) are placed by
     that FLOOR LINE, not by the slab, so the ground the prop draws for itself
     is the ground the plan gives at that x — a floor tick 60px above the real
     floor is the fixture-fusing failure with the fixture merely small.

   2 · THE VOW — divine_fx.silent-revenge-vow, also written for this scene. It
     is a sighting instrument, and only the instrument is used: layers are
     ["bearing","reticle","cue"], and "stand", "target" and "source" — which
     draw a plinth, a light blocky Antinous and the beggar's own sealed head —
     are DROPPED. Those three are baked figures, the one thing the look forbids,
     and in this scene the marked man and the man marking him are both cast
     bodies with names standing on the floor. "field" is dropped too (a pale
     disc, i.e. a second background), and so are "index" and "clock": at the
     size that welds the reticle to a real body, the index plate is 84x45px and
     its seven-segment numeral 13px wide, and the clock strip puts ten
     graduations in 114px. Both dissolve in the dot lattice, which is exactly
     the trap the brief names, so they are not drawn small — they are not drawn.
     THE INSTRUMENT IS MIRRORED. geom() runs from params.eyeX/eyeY up-and-RIGHT
     to lockX/lockY, and on this floor the beggar stands to the RIGHT of the man
     he is marking, so the panel is blitted flipped in x and the bearing runs
     right-to-left, out of Odysseus's own body and into Antinous. The tail lands
     on his hip rather than on his eye: the diagram wants its source .256 of its
     own height BELOW its target, and this projection puts every head on this
     floor within a few pixels of the same y — a plan where figures come nearer
     by getting bigger AND lower keeps heads level, so no box exists that hits
     both eyes. Welding the lock to the marked man is the half that carries the
     meaning, and it is the half that is welded (see ON_BODY for where on him).

   3 · THE HALL'S OPINION — ensemble.suitor-reaction, whose entire content is
     the laugh dying in the middle of itself. TWO instances, ONE depth, TWO
     members each, and every one of those numbers is the room's:
       · rows:1. The module's member is a FIXED PIXEL HEIGHT, lerp(80,148,depth),
         and only the front band (depth 1, 148px, about 158px of drawn man) has
         to be reconciled with this hall's size law. Measured against the rig:
         a named man is 0.707·MAN·(0.60+0.50z)·1.08·H tall, which is 205px at
         the benches (z .76) and 145px at z .19. So MAG is 0.92 — the crowd is
         drawn at very nearly its NATIVE size and blitted down by 8%. The first
         pass magnified it by 1.35 on a crown-at-zero arithmetic error and put
         four 214px men in the middle distance, taller than the men in the front
         row. Nothing here is upscaled, so nothing here is soft.
       · z .19 — deep, and NOT on the spine. `feast` gives the hearth seven
         flames of solid ink 7 over screen x .424–.576 rising to y .60. A band
         standing at z .19 has its footline at y .577, and at y .594 after the
         formation's own forward curl of the wings: ABOVE the flame tips, so the
         fire and the crowd never overlap and the depth can never be got wrong.
         Deeper than that the doors and the sill are needed clear; nearer and
         the crowd stands in its own fire. The two banks are derived through the
         plan from plan x .16–.38 and .62–.84 at that z.
       · four members at screen x .320 / .436 / .564 / .680, 131px apart, 74px
         wide, 57px of paper between one and the next. Each named body in the
         near band is drawn AFTER them with its own hard contour, so where a
         deep member stands behind Telemachus's or Antinous's shoulder the
         result is occlusion, which is what a hall behind a man looks like.
       · formation "bank" from the first frame to the last. The formation
         channel decides WHERE members stand; changing it mid-scene teleports
         six bodies. Only the attitude channels move: wave, attention, mirth,
         arrest. The crowd does not walk. It changes its mind, which is the
         beat, and it changes it left to right as a front, so at t 50 half the
         room is still braying while half has already gone quiet.
       · layers ["band-back"]. With rows:1 the single band is band 0, so
         "band-back" is the layer that carries it. "hall", "floor" and
         "threshold" would stack a second room, a second ground plane and a
         second doorway on this one; "sign" is the disguised-god diamond, a
         diagram of a cloaked traveller, and the cloaked traveller is sitting on
         the sill in this frame; "front-marker" is a dashed ACCENT pole from the
         horizon to the floor — a full-height span in blue, which prints BLACK.
       · thr .855. drawEnsemble opens with fillRect over its whole box at ink
         level 1 — gray 219, luminance .859, just DARK enough to survive the
         default .895 border key as an opaque light rectangle over the hall.
         .855 clears it. Nothing else in the band is level 1 (tunics at depth 1
         come out 3 or 4) and every limb and plane carries its own INK contour,
         so the flood stops at the bodies.

   ONE BODY, ONE GUISE. character.odysseus-b16 with guise held flat at
   "beggar" — the same body Athena restored in XVI, never
   character.odysseus-as-beggar, which is what the atlas asks for and is the
   older module. Nothing penetrates the disguise here; there is no ramp and
   therefore no restoration flare. The content of the scene is that a stool can
   be thrown into his shoulder in his own house and he stays inside it.

   THE SCRIP CHANGES SIDES. S04 hung prop.begging-bag on his INBOARD (left)
   hip, because outboard it landed inside the near seated suitor. There is no
   near seated suitor in this frame — the reacting crowd is 200px deeper — and
   the left side of his body is where the stool arrives and where the impact
   burst, the shock arcs and the contact bracket are drawn. So the LADEN bag
   goes outboard, at x .837, y .750, on clear paper. It stays on his hip when he
   sits: S04 measured the sill's near face (ink 6, y .5445–.583) swallowing it
   whole and the lap silhouette falling across the ink-0 doorway.

   Beats (Od. 17.415–491):
     1. Odysseus tells a false story of former wealth and Egyptian disaster to Antinous.
     2. Antinous insults him and orders him away from the table.
     3. The beggar answers boldly; Antinous hurls a footstool into his shoulder.
     4. Odysseus does not stagger and silently prays for Antinous's death.
     5. Even the other suitors condemn the violation of a stranger.

   Verify:  node harness/render-scene.mjs scenes/OD-B17-S05.mjs --t 10  (the story)
            node harness/render-scene.mjs scenes/OD-B17-S05.mjs --t 36  (struck, and the vow)
            node harness/render-scene.mjs scenes/OD-B17-S05.mjs --t 58  (back on the sill; the hall turns)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, lerp, smooth } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import eumaeus    from "../assets/character/eumaeus.mjs";
import antinous   from "../assets/character/antinous.mjs";
import reaction   from "../assets/ensemble/suitor-reaction.mjs";
import stool      from "../assets/prop/thrown-footstool.mjs";
import vow        from "../assets/divine_fx/silent-revenge-vow.mjs";
import bag        from "../assets/prop/begging-bag.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 66;

/* the room, minus the two layers S04 argued out of it for this floor: the
   `feast` furniture (the ensemble members carry their own seating) and the
   master's chair, whose open back frames the near spine and closes the only
   lane across the near floor. Everything load-bearing stays. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "pillars","lane","hearth","litter"];
/* TWO MORE LAYERS ARE DROPPED HERE, and the renders are the only thing that
   could have said so. Both stand in the right-hand corner of the hall, and the
   station continuity puts the beggar on — bench_r2, screen x .793, figure box
   .696–.890 — is that corner:
     · `stair`. The stair to Penelope's chamber, plan (.92,.66), screen x .837,
       drawn as a stack of dark stepped blocks from y .41 to y .78. The steps
       landed inside his silhouette and read as a striped terrace across him.
     · `maidsdoor`. Plan (.94,.40), screen x .787 — a door leaf seen edge-on, a
       solid dark quadrilateral from y .41 to y .78, i.e. dead behind him.
   The first two renders came back with the two bodies the scene is about — the
   man who throws and the man who is struck — welded into one black tangle with
   that corner. S04 could keep both because it had four seated suitors painted
   in front of them; nobody stands there in this scene. Nobody uses either: the
   maids are shut in their own quarters until XXII, and Penelope stays upstairs
   for the whole of Book XVII. `racks` is KEPT — the arms on the walls are a
   fact XXII turns on, and with the maids' door gone they read as shields. */

/* --- SIZES: one man, times the plan's own falloff (S04, S03, S02 all use it) */
const MAN = 0.36;
/* --- THE BOX A BODY IS DRAWN IN (S04's reasoning, unchanged) --------------
   placeInstance() hands a module a box of the STAGE's aspect (1.474 wide), and
   every width-relative decoration — a herdsman's staff, a hide mantle — is
   stretched with it. So figures are drawn into the PORTRAIT box makeRestage()
   uses for every character in the atlas and blitted. FIG_FLOOR is the rig's
   own ankle line: the box bottom is not the floor. */
const FIG_AR    = 660 / 880;
const FIG_PAD   = 0.06;
const FIG_FLOOR = 0.90;
/* WHERE A POINT ON A BODY IS, MEASURED OFF THE FIRST RENDER (the only place it
   could be measured). The rig does NOT fill its box: figure-hero sizes the
   skeleton off min(H·0.9, W·1.26) and then leaves headroom, so in this portrait
   box the crown lands at 0.193 of the box and the ankle at FIG_FLOOR = 0.90 —
   a man 0.707 of his own box tall. The first pass assumed crown-at-zero and put
   the vow's reticle 63px above Antinous's head and the stool's impact corner
   above his shoulder. ON_BODY is fractions of the FIGURE, converted here. */
const CROWN = 0.193, BODY = FIG_FLOOR - CROWN;      // 0.193 .. 0.90 of the box
/* and the rig's head is 0.28 of the man, so these are the SECOND set of
   fractions, read off the second render: chin .28, shoulders .31, hip .58. */
const ON_BODY = { eye:0.13, throat:0.30, shoulder:0.31, lock:0.42, hip:0.58 };
/* `lock` is the vow's reticle centre and it is deliberately NOT the throat the
   fx module names. drawReticle puts an inner ring at 0.58 R, four crosshair
   stubs at 0.30–0.46 R and a cleared pip disc at its exact centre; aimed at the
   throat, all three land on the face and the marked man stops being a face at
   all — the third render came back with a dartboard where Antinous's head was.
   Aimed at mid-chest, the pip and the crosshair sit on his tunic, and only the
   outer ring crosses him, at the jaw, where the ring's own arc gap is. */
const bodyPoint = (p, figH, part) =>
  p.y - (FIG_FLOOR - (CROWN + ON_BODY[part] * BODY)) * figH;

const BAG      = 0.38;
const BAG_BODY = { x:.54, y:.610 };

/* blit a module into a box of a chosen aspect, anchored by a point inside it.
   sigExtra is REQUIRED: keyedModuleCanvas caches on pose/band/t only. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                   state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* --- CONTINUITY IN — no translation needed, all four are megaron stations -- */
import { exitOccupancy as PREV_EXIT } from "./OD-B17-S04.mjs";
const INITIAL = { ...PREV_EXIT };

/* --- BLOCKING. Stations, not coordinates. --------------------------------- */
const MOVES = [
  // he does not stagger, and he does not stay: back to his own ash sill
  { who:"odysseus", from:"bench_r2", to:"threshold", t0:46, t1:56 },
];

/* --- THE STOOL ON THE CLOCK ----------------------------------------------- */
const STOOL_MODES = [
  [ 0, "rest"], [20, "lift"], [25, "aim"], [29, "flight"],
  [31, "impact"], [34, "fall"], [39, "evidence"],
];
const stoolMode = t => { let m = "rest"; for (const [t0, k] of STOOL_MODES) if (t >= t0) m = k; return m; };
/* the module's own POSE table, which it does not export: cx/cy are the box
   fractions its transform origin lands on, s is the half-width as a fraction
   of the box width, floor is the y its own broken ground line is drawn at.
   placeStool() inverts these — a point on THIS floor becomes a box. */
const STOOL_POSE = {
  rest:     { cx:0.50, cy:0.522, s:0.300, floor:0.680 },
  lift:     { cx:0.50, cy:0.420, s:0.288 },
  aim:      { cx:0.35, cy:0.370, s:0.250 },
  flight:   { cx:0.45, cy:0.395, s:0.245 },
  impact:   { cx:0.42, cy:0.400, s:0.240 },
  fall:     { cx:0.50, cy:0.480, s:0.235, floor:0.680 },
  evidence: { cx:0.47, cy:0.453, s:0.262, floor:0.680 },
};
/* 40px of half-width — an 80px slab against a 237px man, which is what a foot
   rest is next to the man whose foot it is for. */
const STOOL_HALF = 0.036;
const STOOL_AR   = 660 / 880;

/* where the stool is, mode by mode. `floorY` (not y) for the three modes that
   draw their own ground line: the line is put on the plan's floor and the slab
   follows it up. */
const STOOL_AT = {
  rest:     { x:.672, floorY:.825 },   // tucked under his own table
  lift:     { x:.660, y:.690 },        // seized, held out at his outboard hip so
                                       // the slab straddles his own contour
  aim:      { x:.668, y:.540 },        // cocked BACK, above and behind his head,
                                       // on clear wall; the module's own sight
                                       // reticle lands in the gap between them
  flight:   { x:.745, y:.520 },        // OVER both crowns, in clear paper: the
                                       // module's parabola then runs .699 -> .808
                                       // with its apex at y .428. At the earlier
                                       // arithmetically-correct height, y .639,
                                       // the airborne slab was inside Antinous's
                                       // own silhouette and simply invisible —
                                       // a thrown thing has to be in the air
  impact:   { x:.749, y:.607 },        // leading corner ON the beggar's shoulder
  fall:     { x:.730, floorY:.865 },   // tumbling down and away, toward camera
  evidence: { x:.700, floorY:.878 },   // where it comes to rest, in clear floor
};

function placeStool(offctx, W, H, mode, t){
  const P = STOOL_POSE[mode], A = STOOL_AT[mode];
  const wFrac = STOOL_HALF / P.s;                       // box width, frac of W
  const hFrac = wFrac * W / (STOOL_AR * H);             // box height, frac of H
  const y = A.y != null ? A.y : A.floorY - (P.floor - P.cy) * hFrac;
  const left = A.x - P.cx * wFrac, top = y - P.cy * hFrac;
  const w = wFrac * W, h = hFrac * H, pad = 0.10;
  const cv = keyedModuleCanvas(stool, w, h, {
    mode, t,
    status: mode === "rest" ? "AT TABLE" : mode === "lift" ? "SEIZED"
          : mode === "aim" ? "AIMED" : mode === "flight" ? "IN FLIGHT"
          : mode === "impact" ? "STRUCK" : mode === "fall" ? "FALLING" : "EVIDENCE",
    progress: clamp(0.10 + 0.9 * (t / D), 0, 1),
  }, "stool|" + mode, 0.895, pad);
  offctx.drawImage(cv, left * W - pad * w, top * H - pad * h);
}

/* --- THE VOW: an instrument, welded by its lock, and mirrored -------------
   the module's own geometry, in box fractions: the bearing leaves eye and
   arrives at lock. Mirrored in x, so lock sits LEFT of eye on the stage. */
const VOW_EYE  = { x:0.205, y:0.608 };
const VOW_LOCK = { x:0.625, y:0.352 };
/* the box. VOW_W sets the reticle radius (0.195 of it) and the reach of the
   bearing (0.42 of it); .30 is the largest that keeps the bearing's tail ON
   Odysseus's body — 0.42·.30 = .126, and his silhouette ends .049 from his own
   centre line. It gives a 65px ring, which clears Antinous's 25px-wide head by
   40px of paper. The first pass used .24: a 52px ring with an 11px stroke at
   full lock, which welded to his hair and read as a blot, not an instrument.
   VOW_H .53 sets how far below the lock the tail sits — his hip, y .75. */
const VOW_W = 0.30, VOW_H = 0.53;          // box, as fractions of W and H
const VOW_LAYERS = ["bearing","reticle","cue"];
const VOW_T0 = 33, VOW_T1 = 47;

function placeVow(offctx, W, H, lockAt, st){
  /* mirrored: a box point (px,py) lands at left + (1−px)·w, top + py·h */
  const left = lockAt.x - (1 - VOW_LOCK.x) * VOW_W;
  const top  = lockAt.y - VOW_LOCK.y * VOW_H;
  const w = VOW_W * W, h = VOW_H * H, pad = 0.06;
  const cv = keyedModuleCanvas(vow, w, h, { ...st, layers:VOW_LAYERS },
    "vow|" + Math.round((st.lock ?? 0) * 20) + "|" + Math.round((st.cue ?? 0) * 20), 0.895, pad);
  const px = Math.round(w * pad), py = Math.round(h * pad);
  offctx.save();
  offctx.translate(left * W - px + cv.width, top * H - py);
  offctx.scale(-1, 1);
  offctx.drawImage(cv, 0, 0);
  offctx.restore();
}

/* --- THE TWO BANKS -------------------------------------------------------
   derived through the plan at z .34, either side of the hearth's own flames.
   The module lays its members at internal fractions .275 .. .945, so the BOX
   is the placement: boxW = (x1−x0)/0.67, boxLeft = x0 − 0.275·boxW. */
const CROWD_Z   = 0.19;
const MAG       = 0.92;      // a 158px member becomes the 145px man z .19 wants
const CROWD_HI  = 250;       // internal canvas height, px (fits a 158px man)
const CROWD_SEAT= 0.75;      // internal footline
const CROWD_PAD = 0.06;
const crowdFootY = megaron.at({ x:.5, z:CROWD_Z }).y;
const crowdBox = (x0, x1) => {
  const w = (x1 - x0) / 0.67;
  const h = CROWD_HI * MAG / 760;
  return { w, left: x0 - 0.275 * w, h, top: crowdFootY - CROWD_SEAT * h };
};
const bankX = plan => megaron.at({ x:plan, z:CROWD_Z }).x;
const CROWD_L = crowdBox(bankX(0.16), bankX(0.38));   // left of the fire
const CROWD_R = crowdBox(bankX(0.62), bankX(0.84));   // right of the fire
const SEED_L = 1741, SEED_R = 1747;

function placeBank(offctx, W, H, box, seed, focusScreenX, st){
  const wS = W * box.w, hS = H * box.h;
  const wI = wS / MAG, hI = hS / MAG;
  const sig = `${seed}|${Math.round((st.wave ?? 0) * 20)}|${Math.round((st.attention ?? 0) * 20)}`
            + `|${Math.round((st.mirth ?? 0) * 20)}|${Math.round((st.arrest ?? 1) * 20)}`
            + `|${Math.round((focusScreenX - box.left) / box.w * 40)}`;
  const cv = keyedModuleCanvas(reaction, wI, hI, {
    ...st, seed, rows:1, perRow:[2], density:1.0, formation:"bank",
    seatY:CROWD_SEAT, waveSpread:0.17,
    focusX:(focusScreenX - box.left) / box.w, focusY:CROWD_SEAT,
    layers:["band-back"], showSign:false, showThreshold:false,
    showHall:false, showFront:false,
  }, sig, 0.855, CROWD_PAD);
  offctx.drawImage(cv, box.left * W - CROWD_PAD * wS, box.top * H - CROWD_PAD * hS,
                   cv.width * MAG, cv.height * MAG);
}

/* the hall's attitude as a function of the clock and nothing else. `wave` is a
   front travelling across the members; `arrest` is a ceiling on how far any of
   them gets — 0.52 holds the whole room at discomfort with nobody speaking. */
const W0 = 40, W1 = 54;
function crowdAt(t){
  if (t < 14) return { attention:0.18, wave:-0.30, arrest:1.00, mirth:0.55, status:"AT THEIR MEAT" };
  if (t < 25) return { attention:0.34, wave:-0.10, arrest:1.00, mirth:0.90, status:"ENJOYING IT" };
  if (t < 31) return { attention:0.58, wave:-0.10, arrest:1.00, mirth:1.00, status:"HE WINDS UP" };
  if (t < W0) return { attention:0.62, wave:-0.10, arrest:1.00, mirth:1.00, status:"THE HALL LAUGHS" };
  if (t < W1) return { attention:lerp(0.62,0.88,smooth((t-W0)/(W1-W0))),
                       wave:smooth((t - W0) / (W1 - W0)), arrest:1.00, mirth:0.85,
                       status:"THE LAUGH DIES" };
  if (t < 60) return { attention:0.86, wave:1.30, arrest:0.52, mirth:0.40, status:"NOBODY LAUGHS" };
  return          { attention:0.95, wave:1.30, arrest:1.00, mirth:0.30, status:"YOU DID NOT DO WELL" };
}

export const scene = {
  id:"OD-B17-S05",
  title:"Antinous Throws the Stool",
  book:17,
  plan:"megaron",
  duration:D,
  beats:[
    "Odysseus tells a false story of former wealth and Egyptian disaster to Antinous.",
    "Antinous insults him and orders him away from the table.",
    "The beggar answers boldly; Antinous hurls a footstool into his shoulder.",
    "Odysseus does not stagger and silently prays for Antinous's death.",
    "Even the other suitors condemn the violation of a stranger.",
  ],
  exitState:"Still midday in the great hall, the same hour and the same fire as OD-B17-S04, and the first blood-debt of Book XXII has been incurred. Odysseus, begging in his own house, told Antinous the false story he has been telling all week — a man once rich, ruined by an Egyptian venture, sold into slavery, washed up here — and Antinous alone of the suitors gave him nothing, insulted him in front of everybody and ordered him away from his table. The beggar answered him back, boldly and to his face, in front of the whole room. Antinous did not get up: he took the footstool from under his own feet and hurled it, and it struck Odysseus on the right shoulder at the base of the neck. He did not stagger. He stood like a rock, shook his head once in silence, and made no sound at all — and inside that silence he filed the man: a lock closed on Antinous and the first arrow of the killing indexed against it, not fired, kept. Nothing of that is visible to anybody in the room. Then he went back across his own floor to the ash sill at the great doors and sat down on it with the laden scrip still on his hip, which is where this scene leaves him: threshold, plan (.50,.16), the station he will stand on to shoot. The stool is on the floor between the benches where it came to rest and it stays there as evidence. Antinous is where he threw it from, at table_r, and has not been made to answer for it. The hall has: the laugh that went up when the stool landed died in the middle of itself and travelled out across both banks as a front, and by the last frame the room is saying out loud that he did not do well to strike a wretched wanderer, since a god may walk the earth looking like one. Telemachus watched his father struck in his own house and said nothing, which is what he was told to do, and swelled with it. Eumaeus is still at the prince's side. Nothing has been revealed, the guise is intact, the doors are open, the arms are on the walls, and the twelve axes have not been thought of yet.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ odysseus:"already at bench_r2 from OD-B17-S04 (guise:beggar)",
              antinous:"already at table_r", telemachus:"already at table_l",
              eumaeus:"already at bench_l2",
              suitors_l:"already banked left of the hearth at plan z .34",
              suitors_r:"already banked right of the hearth at plan z .34",
              stool_01:"already at table_r, under Antinous's own feet (mode:rest)" },
  exits:{ /* nobody leaves the hall. That is the trap the whole book is building */ },
  walkable:"megaron zones.walkable + lane:spine, MINUS the hearth ring (plan " +
           "x .395–.605, z .445–.595, flames to screen y .60), MINUS the near " +
           "spine (the master's chair's ground, with the fire behind it), MINUS " +
           "the two bank footprints at plan z .34. Resting ground in this scene " +
           "is bench_r2, table_r, table_l, bench_l2 and threshold; the only " +
           "path walked is bench_r2 -> threshold, up the right of the fire.",
  depthOrder:"one queue, sorted by the plan's own z: the two banks (.34) behind " +
             "antinous (.70) behind telemachus (.70) behind odysseus (.76 -> .16 " +
             "on the walk back) behind eumaeus (.76). The STOOL rides the queue " +
             "too — .70 while it is Antinous's furniture, .76 in flight, .78 from " +
             "the impact on, so the burst and the fallen slab are in front of the " +
             "body they belong to. The VOW is not in the queue: it is an " +
             "instrument and is drawn over everything.",
  gazeTargets:{ odysseus:"Antinous's face while he lies to it, then nothing at all, then his own doorway",
                antinous:"the beggar, and after the throw the hall that has stopped laughing",
                telemachus:"his father being struck, and then the floor, because he may not speak",
                eumaeus:"the stool, then Antinous, then the prince",
                suitors_l:"their cups, then the threshold, as the front reaches them",
                suitors_r:"the same, one beat earlier — the wave starts on their side" },
  attachments:[
    { at: 0, who:"stool_01", change:"house furniture, under Antinous's feet at table_r (mode:rest)" },
    { at:20, who:"stool_01", change:"seized off the floor — grip on the front rail (mode:lift)" },
    { at:25, who:"stool_01", change:"cocked past his shoulder, sighted (mode:aim)" },
    { at:29, who:"stool_01", change:"released — no longer attached to anybody (mode:flight)" },
    { at:31, who:"stool_01", change:"contact:shoulder on Odysseus's right shoulder (mode:impact)" },
    { at:39, who:"stool_01", change:"on the floor, unclaimed, evidence (mode:evidence)" },
    { at: 0, who:"bag_01",   change:"laden scrip carried at the outboard hip" },
    { at:33, who:"vow_01",   change:"lock welded to Antinous's chest; bearing tail on Odysseus's hip" },
    { at:47, who:"vow_01",   change:"filed and closed — the vow is brief" },
  ],
  sound:[
    { at: 0, source:"bench_r2", cue:"the beggar's voice, patient, telling a lie about Egypt" },
    { at:14, source:"table_r",  cue:"Antinous over him: get away from my table" },
    { at:22, source:"bench_r2", cue:"the beggar answering him back, level and clear" },
    { at:29, source:"table_r",  cue:"wood leaving a hand" },
    { at:31, source:"bench_r2", cue:"the flat crack of a stool on a shoulder; then the hall roaring" },
    { at:34, source:"bench_r2", cue:"nothing. He makes no sound at all" },
    { at:39, source:"bench_r2", cue:"the stool settling on the floor and being left there" },
    { at:56, source:"threshold",cue:"a man sitting down on stone; the laugh going out of the room" },
    { at:60, source:"pillar_r", cue:"the hall, muttering: you did not do well" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"ensemble.suitor-reaction", instance:"suitors_l",
      anchor:{x:.378,y:.577}, scale:.179 },
    { asset:"ensemble.suitor-reaction", instance:"suitors_r",
      anchor:{x:.622,y:.577}, scale:.179 },
    { asset:"character.antinous", instance:"antinous",
      anchor:{x:.715,y:.813}, scale:.369, band:"threeq", pose:"skepticism" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.285,y:.813}, scale:.369, band:"threeq", pose:"lean_forward" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.793,y:.842}, scale:.381, band:"threeq", pose:"offering_hand" },
    { asset:"prop.begging-bag", instance:"bag_01",
      anchor:{x:.837,y:.750}, scale:.145 },
    { asset:"character.eumaeus", instance:"eumaeus",
      anchor:{x:.207,y:.842}, scale:.381, band:"threeq", pose:"lean_forward" },
    { asset:"prop.thrown-footstool", instance:"stool_01",
      anchor:{x:.672,y:.843}, scale:.120 },
    { asset:"divine-fx.silent-revenge-vow", instance:"vow_01",
      anchor:{x:.715,y:.661}, scale:.300, blend:"multiply" },
  ],

  timeline:[
    // 1 — the false story, told to the one man who will give nothing
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0, args:{ gaze:{ x:-.34, y:.04 } } },
    { op:"actor.pose", target:"antinous",   at: 0.0, args:{ pose:"skepticism" } },
    { op:"actor.gaze", target:"antinous",   at: 0.0, args:{ gaze:{ x:.30, y:.06 } } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at: 0.0, args:{ gaze:{ x:.44, y:.02 } } },
    { op:"actor.pose", target:"eumaeus",    at: 0.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"eumaeus",    at: 0.0, args:{ gaze:{ x:.46, y:.04 } } },
    { op:"actor.pose", target:"odysseus",   at: 8.0, args:{ pose:"torso_open" } },
    { op:"prop.state", target:"bag_01",     at: 0.0, args:{ mode:"laden" } },
    // 2 — the insult, and get away from my table
    { op:"actor.pose", target:"antinous",   at:14.0, args:{ pose:"jabbing_accusation" } },
    { op:"actor.gaze", target:"antinous",   at:14.0, args:{ gaze:{ x:.42, y:.06 } } },
    { op:"actor.pose", target:"odysseus",   at:16.0, args:{ pose:"palm_up_question" } },
    { op:"actor.pose", target:"telemachus", at:18.0, args:{ pose:"skepticism" } },
    // 3 — the beggar answers, and the stool is seized and thrown
    { op:"actor.pose", target:"odysseus",   at:22.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",   at:22.0, args:{ gaze:{ x:-.44, y:.00 } } },
    { op:"prop.state", target:"stool_01",   at:20.0, args:{ mode:"lift" } },
    { op:"actor.pose", target:"antinous",   at:20.0, args:{ pose:"reach_forward" } },
    { op:"prop.state", target:"stool_01",   at:25.0, args:{ mode:"aim" } },
    { op:"actor.pose", target:"antinous",   at:25.0, args:{ pose:"one_arm_raised" } },
    { op:"prop.state", target:"stool_01",   at:29.0, args:{ mode:"flight" } },
    { op:"actor.pose", target:"antinous",   at:29.0, args:{ pose:"pointing_arm" } },
    { op:"actor.pose", target:"odysseus",   at:29.0, args:{ pose:"neutral_front" } },
    { op:"prop.state", target:"stool_01",   at:31.0, args:{ mode:"impact" } },
    { op:"actor.pose", target:"telemachus", at:31.0, args:{ pose:"protective_block" } },
    { op:"actor.pose", target:"eumaeus",    at:31.0, args:{ pose:"skepticism" } },
    // 4 — he does not stagger. He shakes his head once, and files the man.
    { op:"actor.pose", target:"odysseus",   at:33.0, args:{ pose:"rapid_head_shake" } },
    { op:"actor.gaze", target:"odysseus",   at:33.0, args:{ gaze:{ x:-.10, y:.22 } } },
    { op:"fx.play",    target:"vow_01",     at:33.0, args:{ dir:"lock" } },
    { op:"prop.state", target:"stool_01",   at:34.0, args:{ mode:"fall" } },
    { op:"actor.pose", target:"odysseus",   at:37.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",   at:37.0, args:{ gaze:{ x:-.40, y:-.04 } } },
    { op:"prop.state", target:"stool_01",   at:39.0, args:{ mode:"evidence" } },
    { op:"actor.pose", target:"telemachus", at:40.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"telemachus", at:40.0, args:{ gaze:{ x:.10, y:.34 } } },
    // 5 — back to the sill, and the hall turns on the man who threw it
    { op:"actor.pose", target:"odysseus",   at:46.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at:46.0, args:{ gaze:{ x:.10, y:.10 } } },
    { op:"crowd.state",target:"suitors_r",  at:W0,   args:{ wave:0, status:"THE LAUGH DIES" } },
    { op:"crowd.state",target:"suitors_l",  at:W0,   args:{ wave:0, status:"THE LAUGH DIES" } },
    { op:"actor.pose", target:"antinous",   at:48.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"antinous",   at:48.0, args:{ gaze:{ x:-.20, y:-.06 } } },
    { op:"actor.pose", target:"odysseus",   at:56.0, args:{ pose:"crouch" } },
    { op:"actor.gaze", target:"odysseus",   at:56.0, args:{ gaze:{ x:-.30, y:.06 } } },
    { op:"crowd.state",target:"suitors_l",  at:W1,   args:{ wave:1, status:"NOBODY LAUGHS" } },
    { op:"crowd.state",target:"suitors_r",  at:W1,   args:{ wave:1, status:"NOBODY LAUGHS" } },
    { op:"actor.pose", target:"eumaeus",    at:58.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"eumaeus",    at:58.0, args:{ gaze:{ x:.44, y:-.02 } } },
    { op:"actor.pose", target:"antinous",   at:60.0, args:{ pose:"guarded_withdrawal" } },
    { op:"timeline.capture", target:"OD-B17-S05", at:64.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s     = stateAt(scene, t);
    const blk   = blockingAt(megaron, MOVES, t, INITIAL);
    const crowd = crowdAt(t);
    const mode  = stoolMode(t);

    /* the field first — the hall, the doors, the sill, the fire, the litter.
       ONE state for the whole scene: the same feast S04 opened. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"feast", t:0.55, layers:HALL_LAYERS,
              progress:Math.min(.94, .20 + .74*(t/D)), status:"MISRULE" },
    });

    /* one queue, sorted by the plan's own depth */
    const queue = [];
    const add = (d, draw) => queue.push({ d, draw });

    /* --- THE TWO BANKS: the hall's opinion, deepest thing on the floor --- */
    add(CROWD_Z, () => {
      const fx = blk.odysseus.x;
      placeBank(offctx, W, H, CROWD_R, SEED_R, fx, { ...crowd, t:Math.min(.98, t/D) });
      placeBank(offctx, W, H, CROWD_L, SEED_L, fx, { ...crowd, t:Math.min(.98, t/D) });
    });

    /* --- ANTINOUS: he insults, he throws, he does not stand up ----------- */
    {
      const p = blk.antinous, c = s.antinous || {};
      const ordering = t >= 14 && t < 25;
      const throwing = t >= 25 && t < 33;
      const alone    = t >= W1;
      const pose = c.pose || "skepticism";
      add(p.d, () => place(offctx, W, H, antinous, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"ant|" + pose + "|" + (alone?"a":throwing?"t":ordering?"o":"i"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:.30, y:.06 },
          browKnit: throwing ? .80 : ordering ? .70 : alone ? .34 : .34,
          browUp:   alone ? .30 : .10,
          eyeNarrow:throwing ? .46 : ordering ? .42 : .28,
          frown:    throwing ? .50 : ordering ? .44 : alone ? .30 : .18,
          jaw:      ordering && t < 22 ? .52 : 0,
          mouthAsym:alone ? .16 : .48,
          status:   alone    ? "NOBODY IS LAUGHING NOW"
                  : throwing ? "HE DOES NOT EVEN STAND UP"
                  : ordering ? "GET AWAY FROM MY TABLE" : "A LIE ABOUT EGYPT",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* --- TELEMACHUS: he watches his father struck and may not speak ------ */
    {
      const p = blk.telemachus, c = s.telemachus || {};
      const struck  = t >= 31 && t < 40;
      const holding = t >= 40;
      const pose = c.pose || "lean_forward";
      add(p.d, () => place(offctx, W, H, telemachus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"tel|" + pose + "|" + (holding?"h":struck?"k":"w"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:.44, y:.02 },
          browUp:   struck ? .56 : .20,
          browKnit: holding ? .70 : struck ? .40 : .22,
          eyeWide:  struck ? .44 : 0,
          eyeNarrow:holding ? .42 : .14,
          frown:    holding ? .52 : struck ? .30 : 0,
          jaw:      struck && t < 34 ? .38 : 0,
          mouthAsym:holding ? .24 : 0,
          status:   holding ? "HE SHEDS NO TEAR"
                  : struck  ? "HIS FATHER, IN HIS OWN HOUSE" : "THE PRINCE'S TABLE",
          progress: Math.min(.96, .16 + .76*(t/D)),
        },
      }));
    }

    /* --- ODYSSEUS: one body, guise flat at "beggar" ---------------------- */
    let odyBody = null;
    {
      const p = blk.odysseus, c = s.odysseus || {};
      const figH = MAN * p.scale;
      odyBody = { p, figH };
      const telling  = t < 14;
      const answered = t >= 22 && t < 31;
      const struck   = t >= 31 && t < 37;
      const marking   = t >= 37 && t < 46;
      const walking  = t >= 46 && t < 56;
      const sitting  = t >= 56;
      const pose = c.pose || "offering_hand";
      add(p.d, () => {
        place(offctx, W, H, odysseus, {
          x:p.x, y:p.y, hFrac:figH, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
          sig:"ody|" + pose + "|" + (sitting?"s":walking?"w":marking?"m"
                                    :struck?"k":answered?"a":telling?"l":"x"),
          state:{
            t:0.5, guise:"beggar", band:"threeq", pose,
            gaze: c.gaze || { x:-.34, y:.04 },
            browUp:   telling ? .34 : struck ? .28 : .18,
            browKnit: marking ? .62 : struck ? .44 : answered ? .38 : .22,
            eyeNarrow:marking ? .52 : answered ? .34 : .16,
            eyeWide:  struck && t < 33 ? .26 : 0,
            frown:    marking ? .42 : struck ? .30 : 0,
            smile:    telling ? .12 : 0,
            jaw:      telling ? .26 : answered && t < 28 ? .30 : 0,
            mouthAsym:marking ? .12 : .22,
            status:   sitting  ? "BACK ON HIS OWN ASH SILL"
                    : walking  ? "HE GOES BACK TO THE DOOR"
                    : marking  ? "HE SAYS NOTHING, AND FILES THE MAN"
                    : struck   ? "HE DOES NOT STAGGER"
                    : answered ? "THE BEGGAR ANSWERS HIM"
                               : "A LIE ABOUT EGYPT",
            progress: Math.min(.96, .14 + .78*(t/D)),
          },
        });
        /* THE SCRIP — laden, on his OUTBOARD hip, which in this scene is the
           side the stool does NOT arrive on. Through his blocked point. */
        const bagH = BAG * figH;
        place(offctx, W, H, bag, {
          x:p.x + 0.042 * p.scale, y:p.y - 0.24 * figH,
          hFrac:bagH, ar:FIG_AR, fx:BAG_BODY.x, fy:BAG_BODY.y, pad:0.04,
          sig:"bag|laden|" + Math.round(t * 2),
          state:{ mode:"laden", t, open:1, status:"LADEN",
                  progress:Math.min(.94, .40 + .5*(t/D)) },
        });
      });
    }

    /* --- EUMAEUS: at the prince's side, watching it happen -------------- */
    {
      const p = blk.eumaeus, c = s.eumaeus || {};
      const struck  = t >= 31 && t < 46;
      const saying  = t >= 58;
      const pose = c.pose || "lean_forward";
      add(p.d, () => place(offctx, W, H, eumaeus, {
        x:p.x, y:p.y, hFrac:MAN * p.scale, ar:FIG_AR, fy:FIG_FLOOR, pad:FIG_PAD,
        sig:"eum|" + pose + "|" + (saying?"s":struck?"k":"w"),
        state:{
          t:0.5, band:"threeq", pose,
          gaze: c.gaze || { x:.46, y:.04 },
          browUp:   struck ? .54 : .30,
          browKnit: saying ? .64 : struck ? .36 : .20,
          eyeNarrow:saying ? .34 : .12,
          eyeWide:  struck && t < 36 ? .38 : 0,
          frown:    saying ? .44 : struck ? .24 : 0,
          jaw:      saying && t < 63 ? .42 : 0,
          mouthAsym:saying ? .20 : 0,
          status:   saying ? "A GOD MAY LOOK LIKE THAT"
                  : struck ? "AT A GUEST, IN THIS HOUSE" : "AT THE PRINCE'S HAND",
          progress: Math.min(.96, .18 + .74*(t/D)),
        },
      }));
    }

    /* --- THE STOOL: Antinous's furniture, then a missile, then evidence.
       Its depth is the depth of whatever it belongs to at the time. ------- */
    {
      const d = mode === "rest" || mode === "lift" || mode === "aim" ? 0.70
              : mode === "flight" ? 0.76 : 0.78;
      add(d, () => placeStool(offctx, W, H, mode, t));
    }

    queue.sort((a, b) => a.d - b.d).forEach(j => j.draw());

    /* --- THE VOW: not in the queue. It is an instrument, and it is drawn
       over the room, welded by its lock to the throat of the man across the
       floor and by its tail to the body of the man who says nothing. ------ */
    if (t >= VOW_T0 && t < VOW_T1){
      const u = (t - VOW_T0) / (VOW_T1 - VOW_T0);
      const a = blk.antinous;
      const lockAt = { x:a.x, y:bodyPoint(a, MAN * a.scale, "lock") };
      placeVow(offctx, W, H, lockAt, {
        t:(t - VOW_T0),
        intensity: lerp(0.30, 1.20, smooth(u)),
        lock:   smooth(clamp((t - VOW_T0) / 7, 0, 1)),
        cue:    smooth(clamp((t - VOW_T0 - 5) / 8, 0, 1)),
        silence:smooth(clamp((t - VOW_T0) / 4, 0, 1)),
        status:"MARKED", progress:0.90,
      });
    }
  },
};
export default scene;

/* named binding so OD-B17-S06 can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
