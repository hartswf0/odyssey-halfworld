/* ============================================================
   SCENE  OD-B19-S04 — Eurycleia Finds the Scar            (Od. 19.308–507)
   Book XIX, scene 4. ADDITIVE: creates no asset, modifies no tracked file,
   casts only modules that already exist. Shape copied from the reference scene
   scenes/OD-B16-S03.mjs, with the mature compositing helpers of its Book XXI
   sibling OD-B21-S01 (portrait figure box, windowed plate, propAt).

   WHAT THIS SCENE IS FOR. Four of the five modules the atlas asks for here were
   authored FOR this scene and say so in their own headers — prop.foot-washing-
   basin (`scene:"OD-B19-S04"`, seven states ending in SPILLED), set_piece.boar-
   scar (`recognition trigger, continuity validation`), divine_fx.penelopes-
   diverted-attention (`she does not see it`), and character.eurycleia. The
   scene's whole job is to run those three state machines against each other on
   ONE clock: the vessel fills, is stood in, is struck and goes over; the marker
   goes hidden -> bared -> touched; and the queen's sightline goes attending ->
   averted -> released. The recognition happens, the loudest thing in the house
   happens with it, and the one person who must not see it is looking somewhere
   else. That simultaneity is the content, so nothing here is a poster of a
   single moment: every one of the three machines is a function of t.

   ROOM — rooms are state, not new rooms. Same night as S01–S03, so the field is
   location.megaron-hall in state `night`, blocked through scenes/_plans/
   megaron.mjs. No second hall is built or cast.
     TONE. `night` is the one state in the hall's table that carries BOTH
     lift:1 and floorLift:1 — every tone in the room is pushed a level darker and
     the floor two, which is why S03 prints as a near-black room. The state is
     right and cannot be argued with, so the tone is bought back the only way a
     scene is allowed to: by dropping the layers that are pure mass. `furniture`
     (night = benches STACKED), `throne` and `litter` are out; they are the four
     large near-black blocks that fill the bottom third of S03's frame, and this
     scene needs exactly that ground for the basin, the kneeling nurse and the
     spilled water. `racks` stays — after S01 stripped the walls it draws bare
     pegs, which are light. What is left is shell, roof, far wall, the shut great
     doors, the sill, both side doors, the stair, the two roof-pillars, the lane
     and the banked hearth: the architecture the plan names, and paper between it.

   ONE BODY, ONE GUISE. Odysseus is character.odysseus-b16 with guise:"beggar"
   held flat for all 58 seconds — never a cut to `.odysseus-as-beggar`, which is
   the id the atlas asks for by name. There is no restoration in Book XIX and the
   guise channel does not move; the whole danger of the scene is that the disguise
   holds everywhere except on one square inch of thigh, and a body that changed
   would throw that away. The scar is therefore carried by a SET_PIECE that
   declares `attach:{ to:"character.odysseus-b16", bone:"thigh.right" }`, not by a
   second figure module.

   CONTINUITY IN — inherited, computed, nothing retyped.
     import { exitOccupancy as PREV_EXIT } from "./OD-B19-S03.mjs"  ->
       { odysseus:"pillar_l", penelope:"pillar_r",
         melantho:"doorway_maid", weapons:"storeroom", eurybates:"door_main" }
   Same room, so no station map is needed and nothing has to be translated.
     · odysseus  KEPT at `pillar_l`. He has been standing at the left roof-pillar
       since S02 and does not move in this scene either: Od. 19.389 has him turn
       AWAY from the firelight into the dark rather than walk anywhere, and that
       turn is a head and a body yaw, not a station change.
     · penelope  KEPT at `pillar_r`. The measured gap S02 set and S03 held is
       held again, and this is the scene that pays for it: she is close enough to
       give the order and to be reached for, and far enough that a goddess only
       has to bend one sightline to keep her out of it.
     · melantho  KEPT at `doorway_maid`, never drawn — still behind the women's
       door in the right wall, as in S02/S03. Book XX needs her there.
     · weapons   KEPT at `storeroom`, never drawn — the sixteen pieces behind the
       postern wall. Book XXI comes for them.
     · eurybates DROPPED. He was S03's remembered herald: a body only inside a
       description, who entered and left through great doors that never opened.
       Carrying him would put a real Ithacan herald on the threshold of the hall
       at midnight on the strength of a simile. Dropping a figure the story left
       in another register is the same operation as dropping one the story left
       in another room.
     · eurycleia ADDED at `doorway_maid`, because that is where the poem keeps
       her: Od. 19.15–46 has her shut the women in and Od. 19.357 has Penelope
       call her out again. She shares the station with Melantho for the first six
       seconds and neither is drawn there; a doorway is not a contact.

   BLOCKING. Stations, never coordinates. Two of the four bodies never move, and
   all the traffic in the scene belongs to the nurse and to what she is carrying.
     · THE ROUTE ROUND THE FIRE. `doorway_maid` (x .94, z .40) to the beggar's
       side of the hall is a straight line through the hearth: the ring occupies
       plan x .395–.605, z .445–.595, and the direct path crosses x .50 at
       z ≈ .53, i.e. through the embers. So she is routed on the NEAR side in
       three declared legs — out to `bench_r2`, across the front of the room at a
       constant z .76, then up and in to `bench_l1`. z .76 clears the ring by a
       sixth of the room's depth at the closest point. She passes Penelope at
       t ≈ 12 with 0.13 of frame x between them and a clear depth step, near
       figure drawn last.
     · TWO STATIONS FOR THE NURSE, AND WHY. She washes from `bench_l1` and is
       caught at `bench_l2`, one plan step further out, because the two beats want
       opposite things. Washing wants her hands ON the leg, so bench_l1 (frame
       x .251) laps the beggar (x .338) and the vessel between them; that lap is
       the staging, not a fault — she is drawn last because she is nearer, so it
       is always hers to win. The grip wants two readable silhouettes, and at
       bench_l1 the first draft gave a single congested mass of nurse, beggar and
       tipped bronze across 0.23 of the frame's width. So the drop puts her back
       onto bench_l2 (frame x .207): motivated by the beat itself — she has let a
       grown man's foot fall and is trying to get across the room to the queen —
       and it opens the group out to 0.30 without anyone leaving the plan.
     · THE CONTACT PAIR is therefore `pillar_l` and `bench_l2`, adjacent and not
       the same station, and the plan's own projection says how far apart that
       puts them: scale factors .886 and 1.058, a ratio of 1.19, so if he stands
       five metres off she stands about four. In the frame his thrown hand lands
       at x .240 of W and y .36 of H and her blocked throat at x .207, y .387 —
       thirty-seven pixels across and nineteen down, which is one hand's width at
       this body scale. The grip closes without either body being moved onto the
       other's mark.
     · No body enters the hearth ring at any t, at any leg of any move.

   THE BASIN IS BLOCKED LIKE A BODY. prop.foot-washing-basin gets its own MOVES
   rows with kind:"prop", riding the nurse's three legs out of the door and then
   parting from her on the last one: she stops at `bench_l1` and the vessel goes
   on to `pillar_l`, which is the ground under the beggar's feet. While the legs
   are shared it is drawn lifted to her hands off her own live blocked body
   height, so a carried vessel cannot drift off the woman carrying it; once it is
   down it stands on the floor the plan gave it and never moves again — it only
   tips. Its exit station is the same as his because the truth at the end of the
   scene is that the thing is lying over on its side at his feet.
     WHY `foot:0` THROUGHOUT. The prop draws its own diagrammatic shin-and-foot
     stub (a section-cut calf rising out of the water) and gates the scar
     registration brackets behind it. Here there is a real rig leg standing in
     that exact place, and at this vessel's drawn width the stub's calf is within
     a few pixels of the rig's own shin: two contours, one leg. So the stub is off
     and the vessel is drawn AFTER the figure, which puts its near rim across his
     ankles — the occlusion does the work the stub was for, and his foot is in the
     water because the bronze is in front of it. The reveal beat is carried by the
     set piece, which is the module that owns the marker anyway.
     SCALE, HONESTLY. The vessel is drawn about 1.3x its metric size: params give
     the rim as 0.46 m, his body renders 333 px tall, so true scale is 90 px of
     rim and this is 117 px. Draft 1 had it at 0.125 W of lug-to-lug bronze (1.8x)
     and the tipped bowl became a dark crescent lying across the beggar's shins;
     draft 2's 0.103 W is the smallest width at which the bowl, the water line and
     the ring foot all still survive the dot lattice, and the smallest at which it
     stops eating the figure it belongs to. The atlas calls props out at their own
     scale rather than lose them — the axe chest in OD-B21-S01 is drawn by the
     same licence — but only as far as it has to.

   THE SCAR IS A SHEET, NOT A DETAIL ON A LEG. set_piece.boar-scar is a close-up
   registration plate: the limb fills its frame from hip cut to calf cut. There is
   no size at which it can be composited onto a 302-px body and still be the
   thing it is — the welt would be four pixels of ribbon. So it is hung in the
   left margin as a DOCUMENT, on its own paper ground (the `sheet` operation S03
   introduced for the cloak record), and it is the only object in the frame that
   changes mode rather than position: hidden while the rag is over the leg,
   `bared` from the moment the nurse pushes the cloth back, `touched` on the frame
   her hand finds the ridge — which is when the plate grows its own reticle and
   three fingertip contact pads, i.e. HER HAND as an addressable target instead of
   a figure painted on a plate — and then `fresh` for four seconds, which is the
   Parnassus digression (see scarMode below), before it comes back to `touched`.
   It arrives at the frame the washing is agreed to, not at t=0: an order to wash a
   guest's feet is what turns a healed thigh into the one fact that can undo the
   whole plot, and before that the marker has no business in the frame. The
   plate's seven-segment index (`19`, bottom
   left) is cropped out: at this destination its digits would be 14 x 23 px, the
   numerals-as-mush failure, and the plate is already identified by the reticle.
   The sheet also does tonal work. It is 0.20 x 0.29 of the frame of opaque PAPER
   in the upper left of a room whose state pushes every tone a level darker; the
   frame needs that much paper somewhere, and the one place it can be put without
   covering a body is the wall above the nurse's back.

   THE DIVERSION IS COMPOSITED FULL-FRAME, MIRRORED, AND MISSING TWO LAYERS.
   divine_fx.penelopes-diverted-attention is not a callout — it is a diagram of a
   sightline crossing this room, and windowed into a margin it would be a picture
   of a line that goes nowhere. So it is laid over the whole stage, and three
   decisions make that land:
     · MIRRORED. The module puts the queen at x .300 and the recognition at
       x .780 — queen left, event right. This hall has inherited the opposite
       arrangement from S02 and S03 and continuity outranks a module's handedness,
       so the cached frame is blitted with a negative x scale. It costs nothing:
       the module draws no type and no numerals anywhere (its readout is a box,
       an arc and three charge pips), so there is nothing in it that can come out
       backwards. Mirrored, its own eye anchor lands at frame x .662 and the
       queen's blocked station projects to x .662; its aim point lands at x .347
       and the beggar's thigh is at x .338. The fit is the reason this is done
       full-frame at all: the effect was authored against the same depth model
       the plan projects through.
     · TWO LAYERS OFF. `queen` is off — the module draws its own seated
       diagrammatic Penelope, and character.penelope is standing at pillar_r;
       two queens in one hall is the collage failure Book XVI+ exists to end.
       `event` is off — it draws a tipped basin, a burst and corner brackets in
       the region where the REAL basin is tipping, and a diagram of a spill on top
       of a spill is mush. What is kept is exactly the part no body can carry: the
       unseen origin, the interposed screen, the sightline that strikes it and
       kinks away to a focus holding nothing, and the charge readout.
     · ONE UNIFORM SCALE, PINNED AT HER EYE. The blit is 0.88 of the stage in
       both axes — no anisotropy, so the source ring stays a circle — positioned
       so the module's `target:eye` anchor sits on the queen's actual blocked eye.
       Everything else in the effect then falls where the blocking already put it.
   Drawn LAST, over everything: it is an overlay on the room, not furniture in it.
   Her body says the same thing the diagram says — from the moment the screen is
   down she is turned up and away, and she never turns back.

   Beats (Od. 19.308–507):
     1. Penelope orders Eurycleia to wash the stranger's feet: his age, his hands
        and his feet are her husband's age, hands and feet.
     2. Odysseus sees the danger and cannot refuse it; he turns his face out of
        the firelight into the dark of the hall.
     3. The nurse's hands find the old boar-wound above the knee and she knows him.
     4. She lets the foot fall — the bronze rings, the water goes over the floor —
        and turns toward the queen with his name in her mouth.
     5. He has her by the throat, gently and without pity, and she swears silence.

   Verify:  node harness/render-scene.mjs scenes/OD-B19-S04.mjs --t 15
            node harness/render-scene.mjs scenes/OD-B19-S04.mjs --t 50
   ============================================================ */
import { placeInstance, keyedModuleCanvas, PAPER, clamp, clamp01, lerp }
  from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field     from "../assets/location/megaron-hall.mjs";
import odysseus  from "../assets/character/odysseus-b16.mjs";
import penelope  from "../assets/character/penelope.mjs";
import eurycleia from "../assets/character/eurycleia.mjs";
import basin     from "../assets/prop/foot-washing-basin.mjs";
import scar      from "../assets/set_piece/boar-scar.mjs";
import diverted  from "../assets/divine_fx/penelopes-diverted-attention.mjs";

/* CONTINUITY IN — the previous scene's computed exit, imported, not asserted. */
import { exitOccupancy as PREV_EXIT } from "./OD-B19-S03.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 58;

/* the hall minus the three layers that are pure mass at lift:1 (see header). */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks",
                     "postern","maidsdoor","stair","pillars","lane","hearth"];

/* eurybates dropped (a body inside a description, not a body in the hall);
   eurycleia added at the women's door, where Od. 19.15–46 shut her in. */
const { eurybates:_droppedHerald, ...CARRIED } = PREV_EXIT;
const INITIAL = { ...CARRIED, eurycleia:"doorway_maid", basin:"doorway_maid" };

/* --- THE CLOCK. One set of gates; every machine in the scene reads them. --- */
const ORDER   = 3;      // the queen gives the order
const ASSENT  = 8;      // he cannot refuse; he turns out of the light
const EU_OUT0 = 6,  EU_OUT1 = 11;    // the nurse out of the women's door
const EU_CR0  = 11, EU_CR1  = 19;    // across the near floor, round the fire
const EU_SET0 = 19, EU_SET1 = 23;    // in to his stool; the basin set down
const FILL0   = 23, FILL1   = 28;    // cold water, then hot
const WASH    = 28;                  // brimful, still
const BARE    = 32;                  // the rag pushed back off the thigh
const TOUCH   = 37;                  // her hand on the ridge — she knows him
const FLASH0  = 39, FLASH1 = 43;     // Parnassus: the wound as it was made
const DROP    = 43;                  // the foot falls, the bronze rings
const TURN    = 45;                  // she turns toward the queen
const SPILL   = 46;                  // the water is on the floor
const GRIP    = 48;                  // his hand at her throat
const HUSH    = 52;                  // she swears
const FX_IN   = 20;                  // the goddess begins to turn her mind

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Two rows for the queen and the beggar: none. Three legs for the nurse and
   three for what she is carrying, parting on the last one. -------------------- */
const MOVES = [
  { who:"eurycleia", from:"doorway_maid", to:"bench_r2", t0:EU_OUT0, t1:EU_OUT1 },
  { who:"eurycleia", from:"bench_r2",     to:"bench_l2", t0:EU_CR0,  t1:EU_CR1  },
  { who:"eurycleia", from:"bench_l2",     to:"bench_l1", t0:EU_SET0, t1:EU_SET1 },
  /* THE RECOIL. She starts back off the leg onto the station she came in by, and
     that is where he catches her: it is one plan step, it is motivated (she has
     just let a grown man's foot fall and is trying to get to the queen), and it
     is what makes the last beat legible — at bench_l1 her ink laps the beggar's
     by 0.07 of W and the tipped vessel by half its width, and at bench_l2 it laps
     neither. The grip still closes: her blocked throat lands at x .207 and his
     thrown hand at x .199, eight pixels apart. */
  { who:"eurycleia", from:"bench_l1",     to:"bench_l2", t0:DROP,    t1:TURN    },
  { who:"basin", from:"doorway_maid", to:"bench_r2", t0:EU_OUT0, t1:EU_OUT1, kind:"prop" },
  { who:"basin", from:"bench_r2",     to:"bench_l2", t0:EU_CR0,  t1:EU_CR1,  kind:"prop" },
  { who:"basin", from:"bench_l2",     to:"pillar_l", t0:EU_SET0, t1:EU_SET1, kind:"prop" },
];

/* WHICH SIDE THE ARM GOES. The rig throws every directional pose with the RIGHT
   arm, i.e. to screen right, and ships a `mirror` flag that swaps the limb pairs
   properly — so pointing the other way is one flag and never a hand-drawn arm.
   Odysseus has both his targets to his LEFT here (the nurse at his feet, the
   basin under them), so every directional pose of his is mirrored. Penelope's one
   target, the stranger at pillar_l, is also to her left, so the same set S02 and
   S03 mirrored is mirrored again. Eurycleia is the exception: kneeling at
   bench_l1 she has the leg she is washing on her RIGHT and the queen she turns
   to further right again, so nothing of hers is mirrored at all. */
const MIRROR_ODY = new Set(["confrontation","reach_forward","pointing_arm",
                            "guarded_withdrawal","protective_block","lean_forward"]);
const MIRROR_PEN = new Set(["confrontation","palm_up_question","penelope_plea",
                            "pointing_arm"]);

/* ---- THE BOX A BODY IS DRAWN IN (the OD-B21-S01 rule) --------------------
   placeInstance() hands a module a box of the STAGE's aspect, 1120x760.
   figure-hero caps the skeleton height so a body survives a wide box, but every
   width-relative decoration stretches with W — and character.eurycleia lays her
   dress skirt, her apron and her opaque headscarf out in box-W fractions (a hem
   at 0.162W, a scarf 1.30 head-radii wide). In a landscape box the nurse renders
   as a wide bell under a flattened kerchief. Every figure here is therefore drawn
   into the PORTRAIT box the atlas uses for characters, 660/880, and blitted.
   FIG_FLOOR is the rig's own floor line: figure-hero plants the ankles at H*0.90
   of its box, so anchoring by the box's bottom edge would hang the body a tenth
   of its height above the mark the plan gave it. */
const FIG_AR    = 660 / 880;
const FIG_FLOOR = 0.90;
const FIG_PAD   = 0.07;
/* ONE body height for this room, times the plan's own depth falloff. B21-S01 uses
   0.50 in this hall for a scene of twelve suitors and two doors; this one has four
   bodies and its whole content is a hand, a leg and a face, so it is drawn a
   tenth larger. At 0.50 the beggar's torso disappeared into the pale left
   roof-pillar he is standing at and only his head survived; at 0.55 his body
   carries enough ink to hold its own contour against the fixture. */
const K_HALL    = 0.55;

/* blit a module into a box of a chosen aspect, anchored by a point INSIDE the
   box. `sig` is required: keyedModuleCanvas caches on pose/band/t only, so
   without it a change of gaze or brow returns the previous frame's canvas. */
function place(offctx, W, H, mod, { x, y, hFrac, ar, fx = 0.5, fy = 1.0,
                                    state = {}, sig = "", pad = 0, thr = 0.895 }){
  const h = H * hFrac, w = h * ar;
  const cv = keyedModuleCanvas(mod, w, h, state, sig, thr, pad);
  offctx.drawImage(cv, x * W - fx * w - pad * w, y * H - fy * h - pad * h);
}

/* PLATE — blit one declared WINDOW of a whole-frame drawing, keyed, so the room
   shows between its lines and the plate's own header, gauge column and numerals
   stay out of frame. `cw`/`ch` is the canvas the drawing is made on. */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}
/* SHEET — a plate laid down on its OWN PAPER instead of keyed into the room. A
   record is a document and gets a document's ground, so every level on it reads
   exactly as it does on the module's own card instead of fighting a wall that
   halftones to the same density. Same operation placeInstance's full-bleed
   branch performs for a set piece, done on a sub-rect. */
function sheet(offctx, W, H, mod, cw, ch, win, dst, state, sig){
  const dx = dst.x0*W, dy = dst.y0*H;
  const dw = (dst.x1 - dst.x0)*W, dh = (dst.y1 - dst.y0)*H;
  offctx.save(); offctx.fillStyle = PAPER; offctx.fillRect(dx, dy, dw, dh); offctx.restore();
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, 0.895);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dx, dy, dw, dh);
}
/* place a windowed plate by its FOOT MARK — the middle of its bottom edge — so a
   prop stands on the ground the plan gave it instead of on a hand anchor. */
function propAt(offctx, W, H, mod, { x, y, wFrac, hFrac, cw, ch, win, state, sig }){
  plate(offctx, W, H, mod, cw, ch, win,
        { x0: x - wFrac / 2, y0: y - hFrac, x1: x + wFrac / 2, y1: y },
        state, sig);
}
/* MIRRORED FULL-FRAME OVERLAY — one cached frame of a whole-stage effect,
   blitted with a negative x scale. Used once, for the diversion (see header). */
function mirrorFrame(offctx, W, H, mod, cw, ch, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  const dx = dst.x0*W, dy = dst.y0*H;
  const dw = (dst.x1 - dst.x0)*W, dh = (dst.y1 - dst.y0)*H;
  offctx.save();
  offctx.translate(dx + dw, dy); offctx.scale(-1, 1);
  offctx.drawImage(cv, 0, 0, cw, ch, 0, 0, dw, dh);
  offctx.restore();
}

/* ---- WHERE THE THREE NON-BODIES SIT ------------------------------------
   THE SCAR SHEET. Window: the whole limb from hip cut to below the kneecap plus
   the left registration crosses and the right measure rule, and NOT the
   seven-segment index below it. At the destination the window is 1.018 wide to
   high, so 0.200 of W gives 0.290 of H and the plate is never scaled off its own
   proportions. x ends at .222, forty pixels clear of the beggar's ink. */
const SC_CW = 233, SC_CH = 311;
const SC_WIN = { x0:0.020, y0:0.055, x1:0.980, y1:0.762 };
const SC_DST = { x0:0.022, y0:0.150, x1:0.222, y1:0.4395 };

/* THE BASIN. Window: the bowl, both lug plates, the folded linen on the far rim,
   the dipper standing in it, and the floor band the spill puddle runs onto —
   cropped above the dipper's raised handle and left of the gauge column, so
   neither the ladder nor the plate's key elevation enters the room. The window is
   1.506 wide to high; wFrac 0.136 of W puts 0.125 W of lug-to-lug bronze on the
   floor, and hFrac follows from the window, not from taste. */
const BA_CW = 201, BA_CH = 268;
const BA_WIN  = { x0:0.020, y0:0.330, x1:0.775, y1:0.706 };
const BA_WFRAC = 0.112, BA_HFRAC = 0.1094;
const BA_GROUND = 0.162;   // the plate's ground line, as a fraction of the window
                           // height up from its bottom edge — the foot mark

/* THE DIVERSION. 0.88 of the stage, uniform, mirrored, pinned so the module's
   `target:eye` (its .336,.444) lands on the queen's blocked eye (.662,.384). */
const FX_S  = 0.88;
const FX_CW = Math.round(1120 * FX_S), FX_CH = Math.round(760 * FX_S);
const FX_DST = { x0: 0.662 - (1 - 0.336) * FX_S, y0: 0.384 - 0.444 * FX_S,
                 x1: 0.662 + 0.336 * FX_S,       y1: 0.384 + 0.556 * FX_S };
/* `glyph` joins `queen` and `event` on the floor: mirrored, the module's readout
   box lands at x .205 / y .16, which is exactly on top of the scar sheet — the
   one corner of this frame that is already carrying a document. Three of six
   layers off, and what is kept is the sightline and the thing that bends it. */
const FX_LAYERS = ["source","screen","rays"];

/* ---- the three state machines, as functions of one t --------------------- */
const seg = (t, a, b) => clamp01((t - a) / Math.max(1e-6, b - a));

/* the vessel: carried dry -> set down -> filled -> stood in -> struck -> over */
function basinState(t){
  const carried = t < EU_SET1;
  const fill = t < FILL0 ? 0
             : t < FILL1 ? 0.88 * seg(t, FILL0, FILL1)
             : t < DROP  ? 0.88
             : t < SPILL ? lerp(0.88, 0.34, seg(t, DROP, SPILL))
             :             0.10;
  const tilt = t < DROP  ? (carried ? -0.06 : 0)
             : t < SPILL ? lerp(0, -0.34, seg(t, DROP, SPILL))
             :             lerp(-0.34, -0.46, seg(t, SPILL, SPILL + 3));
  const spill = t < DROP ? 0 : t < SPILL ? 0.20 * seg(t, DROP, SPILL)
                                        : Math.min(1, 0.20 + 0.80 * seg(t, SPILL, SPILL + 2.5));
  return {
    t: 0.5, foot: 0, raise: 0, mark: 0,
    lift: carried ? 1 : 0, grip: carried ? 1 : 0,
    fill, tilt, spill,
    stream: t >= FILL0 && t < FILL1 ? 1 : 0,
    ring:   t < DROP ? 0 : t < SPILL ? 1 : 0.40,
    cloth:  1, dipper: t >= SPILL ? 0 : 1,
    status: t >= SPILL ? "SPILLED" : t >= DROP ? "STRUCK"
          : t >= WASH  ? "WASHING" : t >= FILL0 ? "FILLING"
          : carried    ? "CARRIED" : "RESET",
    progress: clamp01(0.06 + 0.88 * (t / D)),
  };
}
/* the marker: under the rag -> bared -> found -> and, for four seconds, the wound
   as it was made. The `fresh` mode is not decoration: Od. 19.392–466 is a sixty-
   line digression to the Parnassus boar hunt, cut in at exactly the moment the
   nurse's fingers close on the ridge, and the module's own header says `fresh`
   is "the continuity source ... what makes the marker continuity-validating
   across the memory cut". So the plate runs the poem's order — found, then how
   it was got, then found again. */
const scarMode = t => t >= FLASH0 && t < FLASH1 ? "fresh"
                    : t >= TOUCH ? "touched" : t >= BARE ? "bared" : "hidden";

/* the diversion: attending -> averted -> released, driven by these beats and
   not by the module's own free period. */
function divertAt(t){
  if (t < FX_IN) return 0;
  if (t < BARE)  return 0.05 + 0.18 * seg(t, FX_IN, BARE);
  if (t < DROP)  return 0.23 + 0.77 * seg(t, BARE, DROP);
  if (t < GRIP)  return 1;
  return 1 - 0.55 * seg(t, GRIP, D);
}
function downAt(t){
  if (t < FX_IN) return 0;
  if (t < BARE)  return 0.10 + 0.35 * seg(t, FX_IN, BARE);
  if (t < DROP)  return 0.45 + 0.55 * seg(t, BARE, DROP);
  if (t < HUSH)  return 1;
  return 1 - 0.70 * seg(t, HUSH, D);
}

export const scene = {
  id:"OD-B19-S04",
  title:"Eurycleia Finds the Scar",
  book:19,
  plan:"megaron",
  duration:D,
  beats:[
    "Penelope orders Eurycleia to wash the stranger's feet because his age resembles Odysseus's.",
    "Odysseus recognizes the danger but cannot refuse without suspicion.",
    "The nurse touches the old boar scar and instantly knows him.",
    "She drops the foot into the basin, spilling water, and reaches toward Penelope.",
    "Odysseus grips her throat gently but firmly and makes her swear silence.",
  ],
  exitState:"Night in the stripped megaron, the fire banked, the great doors shut. The washing has happened and the recognition with it. Odysseus still holds the left-hand roof-pillar as the beggar, unnamed to the house, turned out of the firelight with his right hand shut on the old nurse's throat; Eurycleia has started back off the leg one step, to the near bench on his left, caught there and sworn to silence and holding it — the boar-scar above his knee bared and found, and known by her for the rest of the poem. The foot-washing basin lies tipped over on the floor at his feet where she struck it, the water gone out across the flags, the dipper thrown clear; it is empty and it has not been righted. Penelope holds the right-hand roof-pillar across the hearth exactly where S02 and S03 left her, turned up and away toward nothing — Athena's screen is lifting out of her sight but the event is already over and she never knew it happened. Melantho is still behind the women's door and the sixteen pieces of armour are still shut in the storeroom off the postern.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"night" },
    { asset:"set-piece.boar-scar", instance:"scar_01",
      anchor:{x:.12,y:.44}, scale:.20, state:"hidden" },
    { asset:"character.penelope", instance:"penelope",
      anchor:{x:.66,y:.69}, scale:.44, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.34,y:.69}, scale:.44, band:"threeq", pose:"three_quarter_right" },
    { asset:"prop.foot-washing-basin", instance:"basin",
      anchor:{x:.34,y:.71}, scale:.14, state:"reset" },
    { asset:"character.eurycleia", instance:"eurycleia",
      anchor:{x:.25,y:.77}, scale:.49, band:"threeq", pose:"eury_clasp" },
    { asset:"divine-fx.penelopes-diverted-attention", instance:"diverted_01",
      anchor:{x:.50,y:.99}, scale:1.0 },
  ],

  timeline:[
    /* beat 1 — the queen gives the order */
    { op:"actor.pose", target:"odysseus",  at: 0.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze", target:"odysseus",  at: 0.0, args:{ gaze:{ x:.34, y:.04 } } },
    { op:"actor.pose", target:"penelope",  at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"penelope",  at: 0.0, args:{ gaze:{ x:-.34, y:.06 } } },
    { op:"actor.pose", target:"penelope",  at:ORDER,args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"penelope",  at:ORDER,args:{ gaze:{ x:-.44, y:.18 } } },
    /* beat 2 — he cannot refuse; he turns out of the light */
    { op:"actor.pose", target:"odysseus",  at:ASSENT, args:{ pose:"head_lowered" } },
    { op:"actor.gaze", target:"odysseus",  at:ASSENT, args:{ gaze:{ x:-.16, y:.30 } } },
    { op:"actor.pose", target:"eurycleia", at:EU_OUT0,args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"eurycleia", at:EU_OUT0,args:{ gaze:{ x:-.30, y:.10 } } },
    { op:"actor.pose", target:"odysseus",  at:12.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze", target:"odysseus",  at:12.0, args:{ gaze:{ x:-.52, y:.14 } } },
    { op:"actor.pose", target:"penelope",  at:14.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"penelope",  at:14.0, args:{ gaze:{ x:-.30, y:.10 } } },
    { op:"prop.state", target:"basin",     at:EU_SET1,args:{ mode:"fill" } },
    { op:"actor.pose", target:"eurycleia", at:EU_SET1,args:{ pose:"kneel" } },
    { op:"actor.gaze", target:"eurycleia", at:EU_SET1,args:{ gaze:{ x:.22, y:.34 } } },
    { op:"fx.play",    target:"diverted_01",at:FX_IN, args:{ dir:"divert" } },
    { op:"actor.pose", target:"penelope",  at:FX_IN, args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope",  at:FX_IN, args:{ gaze:{ x:-.10, y:.30 } } },
    { op:"actor.pose", target:"odysseus",  at:WASH,  args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",  at:WASH,  args:{ gaze:{ x:-.44, y:.10 } } },
    /* beat 3 — the leg bared, the ridge found */
    { op:"prop.state", target:"scar_01",   at:BARE,  args:{ mode:"bared" } },
    { op:"actor.gaze", target:"eurycleia", at:BARE,  args:{ gaze:{ x:.26, y:.28 } } },
    { op:"actor.pose", target:"penelope",  at:BARE,  args:{ pose:"lean_backward" } },
    { op:"actor.gaze", target:"penelope",  at:BARE,  args:{ gaze:{ x:.28, y:-.30 } } },
    { op:"prop.state", target:"scar_01",   at:TOUCH, args:{ mode:"touched" } },
    { op:"actor.pose", target:"eurycleia", at:TOUCH, args:{ pose:"crouch" } },
    { op:"actor.gaze", target:"eurycleia", at:TOUCH, args:{ gaze:{ x:.34, y:.22 } } },
    { op:"prop.state", target:"scar_01",   at:FLASH0,args:{ mode:"fresh" } },
    { op:"prop.state", target:"scar_01",   at:FLASH1,args:{ mode:"touched" } },
    /* beat 4 — the foot falls, the bronze rings, she turns to the queen */
    { op:"prop.state", target:"basin",     at:DROP,  args:{ mode:"drop" } },
    { op:"actor.pose", target:"eurycleia", at:DROP,  args:{ pose:"eury_alarm" } },
    { op:"actor.gaze", target:"eurycleia", at:DROP,  args:{ gaze:{ x:.10, y:-.20 } } },
    { op:"actor.pose", target:"odysseus",  at:DROP,  args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"odysseus",  at:DROP,  args:{ gaze:{ x:-.50, y:.34 } } },
    { op:"actor.pose", target:"eurycleia", at:TURN,  args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"eurycleia", at:TURN,  args:{ gaze:{ x:.62, y:-.06 } } },
    { op:"prop.state", target:"basin",     at:SPILL, args:{ mode:"spill" } },
    { op:"actor.pose", target:"penelope",  at:SPILL, args:{ pose:"penelope_mourn" } },
    { op:"actor.gaze", target:"penelope",  at:SPILL, args:{ gaze:{ x:.24, y:-.26 } } },
    /* beat 5 — the throat, and the oath */
    { op:"actor.pose", target:"odysseus",  at:GRIP,  args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",  at:GRIP,  args:{ gaze:{ x:-.56, y:.20 } } },
    { op:"actor.pose", target:"eurycleia", at:GRIP,  args:{ pose:"desperation" } },
    { op:"actor.gaze", target:"eurycleia", at:GRIP,  args:{ gaze:{ x:.30, y:-.32 } } },
    { op:"actor.pose", target:"eurycleia", at:HUSH,  args:{ pose:"eury_hush" } },
    { op:"actor.gaze", target:"eurycleia", at:HUSH,  args:{ gaze:{ x:.30, y:-.10 } } },
    { op:"actor.pose", target:"penelope",  at:54.0, args:{ pose:"penelope_grief" } },
    { op:"actor.gaze", target:"penelope",  at:54.0, args:{ gaze:{ x:.20, y:-.18 } } },
    { op:"timeline.capture", target:"OD-B19-S04", at:56.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st   = stateAt(scene, t);
    const blk  = blockingAt(megaron, MOVES, t, INITIAL);
    const brth = 0.35 + 0.30 * Math.sin(t * 0.62);      // deterministic idle

    /* 1. THE HALL at night, three mass layers dropped. It paints the room and
       everything else keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"night", t:brth, layers:HALL_LAYERS,
              status: t >= TOUCH ? "SHE KNOWS HIM" : "BANKED",
              progress: clamp01(0.14 + 0.80 * (t / D)) },
    });

    /* 2. THE MARKER, as a document on the wall above her back. It arrives when
       the leg does — the order to wash is what turns a healed thigh into the one
       fact that can undo the whole plot — and it is drawn before the bodies, so
       wherever the sheet and a shoulder meet, the body wins. */
    if (t >= ASSENT){
      const mode = scarMode(t);
      const found = mode === "touched" || mode === "fresh";
      sheet(offctx, W, H, scar, SC_CW, SC_CH, SC_WIN, SC_DST,
            { mode, t: found ? clamp(0.35 + 0.10 * (t - TOUCH), 0.35, 1) : 0,
              status: mode === "fresh" ? "FRESH" : found ? "KNOWN"
                    : mode === "bared" ? "BARED" : "HIDDEN",
              progress: mode === "fresh" ? .22 : found ? .92
                      : mode === "bared" ? .46 : .12 },
            "scar|" + mode + "|" + Math.round(t / 3));
    }

    /* 3. THE QUEEN. No move row all scene: she holds the mark S02 set. From the
       moment the screen is down her body says what the diagram says. */
    {
      const p = blk.penelope, s = st.penelope || {};
      const pose = s.pose || "three_quarter_left";
      const ordering = t >= ORDER && t < 14;
      const averted  = t >= BARE;
      const gaze = s.gaze || { x:-.34, y:.06 };
      place(offctx, W, H, penelope, {
        x:p.x, y:p.y, hFrac:K_HALL * p.scale, ar:FIG_AR,
        fx:0.5, fy:FIG_FLOOR, pad:FIG_PAD,
        state:{
          t:brth, band:"threeq", pose, mirror: MIRROR_PEN.has(pose), gaze,
          mouth:    ordering ? .52 : averted ? -1 : .18,
          browUp:   ordering ? .44 : averted ? .62 : .30,
          browKnit: averted ? .40 : .20,
          frown:    averted ? .48 : 0,
          eyeNarrow:averted ? .26 : .08,
          jaw:      ordering ? .38 : 0,
          status:   t >= HUSH ? "SHE NEVER KNEW"
                  : averted   ? "HER MIND TURNED ASIDE"
                  : t >= FX_IN? "THINKING OF HIM"
                  : ordering  ? "WASH THE STRANGER'S FEET" : "THE QUEEN",
          progress: clamp01(0.12 + 0.82 * (t / D)),
        },
        sig:`pen|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
           +`|${averted?1:0}|${ordering?1:0}`,
      });
    }

    /* 4. THE BEGGAR. One body, one guise, no move row. The face is the whole
       craft of the scene: the danger is played in the brow and the turn of the
       head, and the recognition beat takes expression AWAY — a man who is being
       recognized and cannot afford to be must go blank. */
    {
      const p = blk.odysseus, s = st.odysseus || {};
      const pose = s.pose || "three_quarter_right";
      const trapped = t >= ASSENT && t < WASH;
      const holding = t >= WASH   && t < DROP;
      const lunging = t >= DROP   && t < GRIP;
      const gripping= t >= GRIP;
      const gaze = s.gaze || { x:.34, y:.04 };
      place(offctx, W, H, odysseus, {
        x:p.x, y:p.y, hFrac:K_HALL * p.scale, ar:FIG_AR,
        fx:0.5, fy:FIG_FLOOR, pad:FIG_PAD,
        state:{
          t:brth, guise:"beggar", band:"threeq", pose,
          mirror: MIRROR_ODY.has(pose), gaze,
          browKnit: gripping ? .70 : lunging ? .54 : trapped ? .44 : .18,
          browUp:   trapped ? .30 : .08,
          eyeNarrow:holding ? .48 : gripping ? .40 : .24,
          eyeWide:  lunging ? .28 : 0,
          frown:    gripping ? .40 : 0,
          mouthAsym:holding ? 0 : trapped ? .40 : .18,
          smile:    0,
          jaw:      lunging ? .34 : 0,
          status:   gripping ? "NOT A WORD"
                  : lunging  ? "HIS HAND GOES OUT"
                  : holding  ? "EYES HARD AS HORN"
                  : trapped  ? "HE CANNOT REFUSE" : "THE BEGGAR",
          progress: clamp01(0.16 + 0.78 * (t / D)),
        },
        sig:`ody|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
           +`|${holding?1:0}|${gripping?1:0}|${lunging?1:0}`,
      });
    }

    /* 5. THE VESSEL. Blocked like a body, kind:"prop". While it is on the
       nurse's legs it is drawn lifted to her hands off her own live blocked body
       height, so it cannot drift off her; once it is down it stands on the floor
       the plan gave it and only tips. Drawn AFTER the beggar at the same station
       so the near rim crosses his ankles — that occlusion is what puts his foot
       in the water (see header, `foot:0`). */
    const carried = t < EU_SET1;
    const drawBasin = () => {
      const b  = blk.basin;
      const bs = basinState(t);
      const wF = BA_WFRAC * (b.scale / 0.75);
      const hF = BA_HFRAC * (b.scale / 0.75);
      /* her hands, from her own blocked box — not a guessed offset */
      const eh = blk.eurycleia ? K_HALL * blk.eurycleia.scale * 0.78 : 0.36;
      propAt(offctx, W, H, basin, {
        x: b.x,
        y: carried ? b.y - 0.46 * eh : b.y + BA_GROUND * hF,
        wFrac:wF, hFrac:hF, cw:BA_CW, ch:BA_CH, win:BA_WIN,
        state:bs,
        sig:`basin|${bs.status}|${Math.round(bs.fill*20)}|${Math.round(bs.tilt*40)}`
           +`|${Math.round(bs.spill*20)}`,
      });
    };

    /* 6. THE NURSE. The only walker — out of the women's door, round the near side
       of the fire, down on her knees at his feet, and back off them. `walk_neutral`
       is forced only on the three crossing legs: the recoil at DROP is one plan
       step played on the pose the beat gives her, not a walk cycle. */
    const drawNurse = () => {
      const p = blk.eurycleia, s = st.eurycleia || {};
      const knowing = t >= TOUCH && t < DROP;
      const crying  = t >= DROP  && t < GRIP;
      const caught  = t >= GRIP  && t < HUSH;
      const sworn   = t >= HUSH;
      const walking = p.moving && t < EU_SET1;
      const pose = walking ? "walk_neutral" : (s.pose || "eury_clasp");
      const gaze = s.gaze || { x:-.30, y:.10 };
      place(offctx, W, H, eurycleia, {
        x:p.x, y:p.y, hFrac:K_HALL * p.scale, ar:FIG_AR,
        fx:0.5, fy:FIG_FLOOR, pad:FIG_PAD,
        state:{
          t: walking ? (t * 0.40) % 4 : brth,
          band:"threeq", pose, gaze,
          mouth:    crying ? -1 : caught ? .48 : sworn ? .12 : .16,
          browUp:   crying ? .78 : caught ? .70 : knowing ? .66 : .38,
          browKnit: sworn ? .60 : knowing ? .34 : .26,
          eyeWide:  crying ? .55 : caught ? .48 : knowing ? .42 : .10,
          eyeNarrow:sworn ? .34 : 0,
          frown:    crying ? .40 : sworn ? .06 : .14,
          jaw:      crying ? .42 : caught ? .34 : 0,
          status:   sworn   ? "NOT A WORD"
                  : caught  ? "BY THE THROAT"
                  : crying  ? "IT IS ODYSSEUS"
                  : knowing ? "THE OLD BOAR-WOUND"
                  : t >= WASH   ? "WASHING HIS FEET"
                  : t >= EU_SET1? "ON HER KNEES" : "THE NURSE",
          progress: clamp01(0.10 + 0.84 * (t / D)),
        },
        sig:`eu|${pose}|${Math.round(gaze.x*40)}|${Math.round(gaze.y*40)}`
           +`|${knowing?1:0}|${crying?1:0}|${caught?1:0}|${sworn?1:0}`,
      });
    };

    /* WHICH OF THE TWO GOES LAST. While the vessel is on her legs it is in her
       HANDS, so it is nearer than she is and is drawn after her. Once it is on the
       floor at the beggar's station it is a whole depth step behind her and is
       drawn before her, which is what lets her arms cross its near rim while she
       washes. The rule is the blocked depth in both cases; only the carry inverts
       it, because a carried thing rides in front of the body carrying it. */
    if (t >= EU_OUT0){
      if (carried){ drawNurse(); drawBasin(); }
      else        { drawBasin(); drawNurse(); }
    }

    /* 7. THE DIVERSION, over everything: mirrored, two layers off, pinned at her
       eye. The screen goes down between the queen and the recognition, the
       sightline strikes it and kinks up to a focus that holds nothing, and the
       loudest thing in the house goes by unseen. */
    if (t >= FX_IN){
      const dv = divertAt(t), dn = downAt(t);
      const inten = t < BARE ? lerp(0.45, 0.90, seg(t, FX_IN, BARE))
                  : t < GRIP ? 1.10
                  :            lerp(1.10, 0.70, seg(t, GRIP, D));
      mirrorFrame(offctx, W, H, diverted, FX_CW, FX_CH, FX_DST,
        { t: clamp01(0.10 + 0.86 * (t - FX_IN) / (D - FX_IN)),
          divert:dv, down:dn, intensity:inten, layers:FX_LAYERS,
          status: dv >= .95 ? "AVERTED" : t >= GRIP ? "RELEASED" : "ATTENDING",
          progress: clamp01(t / D) },
        `divert|${Math.round(dv*24)}|${Math.round(dn*24)}`);
    }
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
