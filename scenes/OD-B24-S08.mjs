/* ============================================================
   SCENE  OD-B24-S08 — The Last Clash
   Book XXIV, scene 8 of the book. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from the
   two scenes immediately before this one, OD-B24-S06 and OD-B24-S07.

   WHERE, AND WHY THE INHERITED OCCUPANCY IS ONE BODY AND NOT TWO. OD-B24-S07
   plays on OLYMPUS and hands over two gods: Zeus on `dais_e`, back beside his
   throne with the verdict given, and Athena on `descent`, on the cloud sill in
   the one gap in the back wall, already turned out of the hall and facing down
   toward Ithaca with the order in her hands. This scene is the ground she was
   looking at. So brief section F applies and the map is declared in full:
   ZEUS IS DROPPED — he is the fixed point of the Olympian scene and the poem
   never brings him down; the weather over this farm is the whole of his
   presence here. ATHENA IS TRANSLATED, and hers is the one continuity in the
   book that costs nothing: `descent` is a station whose entire meaning is "on
   her way down to this field", and the station it becomes is `gate_mouth`, the
   farm gate at the lip of Laertes's terrace — the high ground above the fight,
   which is where a god who has just come down out of the sky over a steading
   is standing. She opens the scene there, walks down between the two lines,
   and never goes back up. Nothing else crosses: the militia was on the road at
   the end of S06 and has been walking ever since, and Odysseus, Telemachus and
   Laertes have been inside the farmhouse since S05.

   THE SET IS THE ONE THE ATLAS BUILT FOR THIS FIGHT, IN ITS FIRST STATE.
   location.farm-battlefield-at-peace is the open ground BELOW the steading,
   and its own header names `charge` as "the last clash: lanes hot, no scar,
   arms still in hands". That is this scene, start to finish, so the room is
   held in ONE state for the whole master clock and the state channel is not
   flipped once (brief section D). What the state buys is exactly what this
   scene must not show: in `charge` the set withholds the bolt scar, the
   dropped kit, the grounded arms stacks, the dispersal lane and the oath ring
   — every one of them a thing that has not happened yet. The one layer the
   state does NOT gate is `fallen`, which paints two grave mounds whenever it
   is drawn, so `fallen` IS LEFT OUT OF THE LAYER LIST. Nobody has been buried
   on this ground; the mounds belong to the men who die in this scene and they
   are S09's furniture, not this scene's. Left in, the field would open on the
   graves of the dead it is about to make.

   THE PLAN IS DERIVED FROM THE SET, AND THE SET OWNS THE GROUND. Same division
   as OD-B24-S04 and OD-B24-S07: engine/blocking's project() puts a d=1 body at
   screen y .96 and bottoms out at y .5288 with a 1.7:1 size falloff, and this
   set is a 13:1 landscape whose horizon is at y .300 and whose near edge is at
   y 1.040. So THE PLAN OWNS TOPOLOGY — who is at which named station, what a
   transit interpolates along, what the unknown-station throw protects, what
   exitOccupancy hands on — and THE SET OWNS THE GROUND: groundOf() and sizeOf()
   take a station name straight back to location.farm-battlefield-at-peace's own
   exported anchors, its own two charge lanes and its own depthAtY(). The plan's
   z IS depthAtY() at the station, so the plan and the ground agree about who is
   in front. Not one figure coordinate in this file is typed: every station is
   an exported anchor of the set, a point cut at a named parameter on one of the
   set's two drawn lanes, or a named fraction between two of the set's anchors.

   THE LANES ARE WALKED, NOT CUT ACROSS. The set draws two charge lanes with
   chevrons — the militia's, entering at the left lip from the town road, and
   the household's, coming down out of the farm gate — and they are the reason
   this ground is legible. A transit between two stations cut on the SAME lane
   interpolates that lane's own parameter, so the militia comes down the drawn
   militia lane and Laertes comes down the drawn household lane. Nobody crosses
   the field on a straight line the set did not paint.

   THE TWO LANES CONVERGE, AND THAT IS THE ONE REAL TRAP IN THIS FILE. Both
   lanes END on `clash:line` — that is what makes them a fight — so the two
   fronts CANNOT be blocked to their lane ends or every body in the scene lands
   on one coordinate. The set solves it itself and this scene uses its solution:
   `line:people` and `line:household` are two separate front lines .296 of the
   frame apart, and `meet:parley_l`/`meet:parley_r` is an authored contact pair
   on the axis between them. So the militia's point stops at parameter .90 on
   its lane — short of the meeting — Laertes stands on `line:household`, and the
   parley pair is surveyed here and deliberately LEFT EMPTY: it is where the two
   sides will stand to be stopped in S09, and nobody stands on it while they are
   still killing each other.

   THE MILITIA IS A PLATE HUNG OFF ONE MAN, AND EVERY NUMBER IN IT IS SOLVED.
   ensemble.revenge-militia was authored for this scene (`scene:"OD-B24-S08"`)
   and its own header states the contract: the point of the wedge is an ANCHOR,
   never a baked character, and with `showLead:false` that slot is VACATED so
   character.eupithes can be cast into it. This scene therefore does NOT block
   the militia as a body of its own. EUPITHES IS BLOCKED, down the militia lane,
   and THE WEDGE IS FITTED TO HIM: the plate's blit rect is solved every frame
   so that the module's own lead slot lands exactly on Eupithes's live ground.
   That is not a convenience, it is what a wedge IS — a formation with a point —
   and it means the two can never drift apart and can never collide, because
   there is only one body and one hole and they are the same place. Four numbers
   fall out of it and each is solved against this set rather than picked:
     · THE LEAD SLOT IS COMPUTED, NOT READ OFF THE ANCHOR TABLE. The module
       exports `anchors.lead` at (.790,.762), but `slots()` actually puts member
       0 at (.7434,.8615) with a size of 252.4 — the anchor is a round number and
       the slot is the truth. The module's own law (its seed 2408, its twelve
       jitter draws, its formation table row, its band tables) is restated below
       and evaluated here, so the hole in the wedge and the man standing in it
       are computed from the same arithmetic.
     · THE BLIT RATIO IS THE SET'S OWN SIZE FOR A MAN AT THAT SPOT. K solves
       0.95·s_lead·K = the height this ground paints a standing figure at the
       lead's ground line, so the militia grows down the lane exactly as fast as
       the field's depth ladder says it should.
     · THE SHEET'S HEIGHT IS SOLVED ON THE BAND RATIO. The module sizes its
       three bands 162 / 200 / 240 at fixed sheet fractions .588 / .702 / .854,
       so the sheet height is whatever makes the back band's ground line fall
       where this set paints a man 162/240 the size of the front one. Any other
       number and the wedge has its own private perspective.
     · THE SHEET'S WIDTH IS SOLVED ON THE TAIL. It is whatever puts the last man
       of the wedge at frame x .040 when the point reaches `point` — the militia
       fills the road it came in on and stops short of the left edge.
   `showRoad` is FALSE: the module will paint its own town, field wall and cart
   track, and this scene already has a field. The set owns the ground; the
   ensemble owns the men.

   EUPITHES IS ONE BODY AND HE IS NOT SWAPPED FOR HIS OWN KIT. The module's
   `leaderDown` channel drops a helmet, a shield and a spear in the vacated slot
   as the visible fact of losing him. That is the right answer when the point is
   an anchor and there is no character on it; it is the wrong answer here,
   because character.eupithes IS on it and his module authors `eup_struck` —
   "the cast lands: head snapped back, arms flung, knees gone" — for this exact
   frame. So `leaderDown` is driven to 1 on the cast (the ranks must know) and
   `showKit` is held FALSE for the whole scene: the body stays, one module, no
   cut, and nothing is drawn twice.

   NOTHING SHARES A STATION AND NOTHING FUSES. The frame at the end reads, left
   to right, as five silhouettes on five different ground lines: the wedge
   (x .04..0.47 of the frame, feet on y .56..0.69), Eupithes struck at its point
   (feet y .688), Odysseus charging in on the near ground at y .894 — 157 stage
   px nearer than the man he is charging past, which is why he prints over the
   front rank instead of standing in it — Athena between the lines at y .570,
   Laertes on the household line at y .696, and Telemachus on the near right at
   y .814. The tightest paper gap between two silhouettes at the same depth is
   26 px, between Laertes and Telemachus, and the two of them are 195 px apart
   in ground height. Where bodies do overlap they are separated by more than
   half a body's height of floor and the queue sorts them correctly, which is
   what a battle looks like; nobody is ever coincident. Two routings were forced
   by this and both are in the MOVES table: Laertes leaves the house down the
   drawn household lane instead of straight across the field, which would have
   walked him through Athena at t=38, and Odysseus charges by way of `near_lane`
   on the near ground, so he crosses IN FRONT of his father's line instead of
   through it.

   TONE. The set's `charge` table is its darkest (sky 2, ridge 4, dark 6) and it
   is still a light field: ground 2, swept lanes 1, and the ink spent on the gate
   mouth, the chevron heads and the churn ticks. The militia is authored the same
   way — near-paper tunics and pale shields under a hard contour, black only on
   hair, spearheads, hafts, crests and boots. Five figures and a nine-man wedge
   occupy well under a quarter of the frame; the rest is grazing. ZERO hand-drawn
   ctx overpaint on any figure in this file. The rig does all of it.

   ONE BODY, NO GUISE RAMP. Odysseus is character.odysseus-b16 holding
   `guise:"restored"` from the first frame to the last, exactly as in S03, S04
   and S05 — Book XXIV has no disguise in it, there is no discontinuity anywhere
   in this file, and divine_fx.athenas-restoration is therefore not cast. Athena
   is in disguise, and her disguise is a whole authored module
   (character.athena-as-mentor) with the divine tell painted last; there is no
   transformation on screen, so there is nothing to ramp.

   Beats (Od. 24.489-525):
     1. Odysseus sees the armed relatives coming and arms the farm household.
     2. Athena comes as Mentor and calls Laertes's line to prove itself.
     3. Laertes prays, casts, and kills Eupithes through the helmet.
     4. Odysseus and Telemachus charge the rest.
     5. The killing starts again, and it is the killing peace has to stop.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S08.mjs --t 24  (the approach)
            node harness/render-scene.mjs scenes/OD-B24-S08.mjs --t 88  (the clash)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, clamp01, lerp, rnd }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field, { anchors as FIELD } from "../assets/location/farm-battlefield-at-peace.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import telemachus from "../assets/character/telemachus.mjs";
import laertes    from "../assets/character/laertes.mjs";
import mentor     from "../assets/character/athena-as-mentor.mjs";
import eupithes   from "../assets/character/eupithes.mjs";
import militia    from "../assets/ensemble/revenge-militia.mjs";

const FIELD_ASSET = "location.farm-battlefield-at-peace";
const D = 100;

/* ==========================================================================
   THE SET'S OWN GEOMETRY, RESTATED
   location.farm-battlefield-at-peace keeps its depth ladder and its two charge
   lanes private. Both are copied here verbatim from the set so that a station
   is a point ON a drawn lane and a body's size is the size that patch of ground
   is painted at. If the set ever moves them, this scene is wrong in a way that
   shows in the first frame — which is the point of copying rather than guessing.
   ========================================================================== */
const HORIZON = 0.300, NEAR_Y = 1.040;
const groundU  = y => clamp((y - HORIZON) / (NEAR_Y - HORIZON), 0, 1);
const depthAtY = y => lerp(0.070, 1.000, Math.pow(groundU(y), 1.22));
/* the inverse, used once: to ask the ground where a man of a given size stands */
const yAtDepth = d =>
  HORIZON + (NEAR_Y - HORIZON) * Math.pow(clamp01((d - 0.070) / 0.930), 1 / 1.22);

/* the two charge lanes, as polylines in the set's own space. Each ENDS on the
   clash point, which is why no front rank may be blocked to a lane end. */
const LANES = {
  people:    [[-0.030,0.548],[0.126,0.598],[0.292,0.656],[0.470,0.702]],
  household: [[ 0.398,0.470],[0.418,0.534],[0.450,0.606],[0.478,0.688]],
};
function lanePt(key, t){
  const pts = LANES[key], n = pts.length - 1;
  const u = clamp(t, 0, 1) * n, i = Math.min(Math.floor(u), n - 1), s = u - i;
  return { x: lerp(pts[i][0], pts[i+1][0], s), y: lerp(pts[i][1], pts[i+1][1], s) };
}

/* ==========================================================================
   THE LOCAL PLAN
   Three kinds of station and not one of them a typed coordinate: ON-LANE
   stations carry the lane and the parameter they were cut at (a transit between
   two of them follows the drawn lane), FIXED stations are the set's own exported
   anchors, and DERIVED stations are a named fraction between two exported
   anchors, optionally dropped toward the set's own near edge.
   ========================================================================== */
const atSet = key => {
  const a = FIELD[key];
  if (!a) throw new Error(`[OD-B24-S08] the set exports no anchor "${key}"`);
  return { x:a.x, y:a.y };
};
const onLane = (lane, k) => ({ lane, k, p:lanePt(lane, k) });
const fixed  = p => ({ lane:null, k:null, p });

const GATE    = atSet("threshold:farm-gate");   // the household's way onto the field
const DOOR    = atSet("farm:house-door");       // the steading itself
const CLASH   = atSet("clash:line");            // where the two lanes meet
const LINE_P  = atSet("line:people");           // the militia's front line
const LINE_H  = atSet("line:household");        // the king's front line
const STAND_H = atSet("stand:household");       // the household's own ground
const NEAR    = atSet("field:near");            // the near edge of the field

/* a named fraction between two of the set's anchors */
const between = (a, b, f) => ({ x:lerp(a.x, b.x, f), y:lerp(a.y, b.y, f) });
/* the same point brought `f` of the way toward the set's own near edge. x is
   held: this ground is 13:1 and pulling x toward centre with depth (the way
   project() does) would swing a charging man sideways across the field. */
const drop = (p, f) => ({ x:p.x, y:lerp(p.y, NEAR.y, f) });

const GROUND = {
  /* ---- FIXTURES: surveyed, never occupied ---------------------------------
     The parley pair is the set's authored contact pair on the axis between the
     two front lines. It is where the two sides are stopped and made to talk in
     the next scene, and it is EMPTY in this one on purpose. */
  steading:    fixed(DOOR),
  herm:        fixed(atSet("marker:herm")),
  road_out:    fixed(atSet("exit:road")),
  fields_e:    fixed(atSet("exit:fields")),
  band_c:      fixed(CLASH),
  line_p:      fixed(LINE_P),
  line_h:      fixed(LINE_H),
  parley_l:    fixed(atSet("meet:parley_l")),
  parley_r:    fixed(atSet("meet:parley_r")),
  stand_p:     fixed(atSet("stand:people")),
  oath_ring:   fixed(atSet("oath:circle")),
  /* ---- THE MILITIA LANE: the road in, and the point of the wedge ----------
     `point` is cut at .90 and not at 1.0 because 1.0 IS the clash coordinate
     and the household's lane ends there too. .90 leaves the whole wedge on its
     own side of the meeting, with the churned band under its feet. */
  road_lip:    onLane("people", 0.22),
  lane_p_mid:  onLane("people", 0.58),
  point:       onLane("people", 0.90),
  /* ---- THE HOUSEHOLD LANE: out of the gate and down onto the field -------- */
  gate_mouth:  fixed(GATE),
  lane_h_foot: onLane("household", 0.80),
  /* ---- THE STANDING PLACES ------------------------------------------------
     `arm_l`/`arm_r` are the set's own contact pair at the household stand: two
     men at arm's length with a weapon changing hands between them, which is
     what a pair station is for. `mentor` is .46 of the way from the farm gate
     to the household's front line — a god come down out of the gate and stopped
     between the two lines, on open floor, on nobody's line. `cast` is the
     household front line itself. `charge_n` is the MILITIA's own front line
     dropped .66 toward the near edge: the king goes in on the enemy's line, on
     ground so much nearer that he prints over its front rank instead of
     standing among it — and, as measured in the blocking note, it is the one
     x on the near ground that leaves the point of the wedge clear on his
     right, so the man Laertes has just killed is not hidden behind him. */
  arm_l:       fixed(atSet("meet:household_l")),
  arm_r:       fixed(atSet("meet:household_r")),
  mentor:      fixed(between(GATE, LINE_H, 0.46)),
  cast:        fixed(LINE_H),
  near_lane:   fixed(drop(LINE_H, 0.52)),
  charge_n:    fixed(drop(LINE_P, 0.66)),
  charge_f:    fixed(drop(between(LINE_H, STAND_H, 0.55), 0.24)),
};

export const laertesField = makePlan({
  id:"laertes-farm-field",
  name:"The open ground below Laertes's steading — two lanes, two lines, one point",
  notes:"Local plan for OD-B24-S08, cut off location.farm-battlefield-at-peace's " +
        "own two charge-lane polylines and its own exported anchors. z IS the " +
        "set's depthAtY() at the station, because project() bottoms out at " +
        "y .5288 and its 1.7:1 falloff cannot carry a 13:1 landscape whose " +
        "horizon is at y .300. Both lanes END on `clash:line`, so no front rank " +
        "is ever blocked to a lane end: the militia stops at parameter .90 and " +
        "the household stands on `line:household`. `parley_l`/`parley_r` are the " +
        "set's authored contact pair between the two lines and are LEFT EMPTY — " +
        "they are where the fight is stopped in the next scene. `steading`, " +
        "`herm`, `road_out`, `fields_e`, `band_c`, `line_p`, `line_h`, " +
        "`stand_p` and `oath_ring` are survey references, not standing places. " +
        "`arm_l`/`arm_r` are the set's own household pair and hold the two men " +
        "between whom the weapons change hands.",
  stations:Object.fromEntries(Object.entries(GROUND).map(([k, g]) => [k, {
    x:+clamp(g.p.x, 0, 1).toFixed(4),
    z:+depthAtY(g.p.y).toFixed(4),
  }])),
  fixtures:[
    { id:"farm_gate",   kind:"threshold", at:"gate_mouth" },
    { id:"steading",    kind:"building",  at:"steading"   },
    { id:"herm",        kind:"marker",    at:"herm"       },
    { id:"clash_band",  kind:"terrain",   at:"band_c"     },
    { id:"parley",      kind:"meeting",   at:"parley_l"   },
    { id:"oath_ring",   kind:"ring",      at:"oath_ring"  },
  ],
});

/* ---- the set's ground, resolved off blockingAt's own from/to/u ------------
   A transit between two stations cut on the SAME lane interpolates that lane's
   parameter and is evaluated on the lane, so the militia walks the drawn
   militia lane and Laertes walks the drawn household lane. */
const G = name => {
  const g = GROUND[name];
  if (!g) throw new Error(`[OD-B24-S08] station "${name}" has no ground`);
  return g;
};
function groundOf(p){
  if (!p.moving){ const g = G(p.station); return { x:g.p.x, y:g.p.y }; }
  const a = G(p.from), b = G(p.to), u = p.u;
  if (a.lane && a.lane === b.lane) return lanePt(a.lane, lerp(a.k, b.k, u));
  return { x:lerp(a.p.x, b.p.x, u), y:lerp(a.p.y, b.p.y, u) };
}
const sizeOf = p => depthAtY(groundOf(p).y);

/* ==========================================================================
   FIGURE SIZE — one box height for every standing body on this field, times the
   set's own falloff, and every sole put down by hand-off rather than by eye.

   BOX .58 IS CALIBRATED ON THE SET'S OWN FARM. The steading is drawn with its
   house block .038 of the frame high standing on the terrace at y .452, and the
   gate mouth beside it .026 high — a door a man walks through. Solving
   .9 · BOX · depthAtY(.462) · H = the height that puts a standing figure's crown
   just over that gate lintel gives BOX .58, which then paints a man at the
   household stand 258 stage px tall and a man at the point of the wedge 196 —
   against the set's own near-camera olive at 79 px of canopy and its orchard
   trees at 33. Drafted at .72 the household stood taller than the farmhouse
   they came out of; at .40 the militia was a line of stamps and the wedge had
   no point.

   figure-hero fits the rig to min(H·.9, W·1.26) of the box it is given and
   stands it with its feet at .905 of that box, so a figure anchored at a
   station's ground y hangs ~9.5% of its own box in the air. FOOT pushes the box
   down by exactly that fraction so the SOLE lands on the station.
   ========================================================================== */
const MAN  = 0.58;
const FOOT = 0.095;
const boxOf   = p => MAN * sizeOf(p);
const standOn = p => {
  const g = groundOf(p);
  return { anchor:{ x:g.x, y:g.y + FOOT * boxOf(p) }, scale:boxOf(p) };
};
/* the height this ground paints a standing figure at, as a fraction of H */
const manH = y => 0.9 * MAN * depthAtY(y);

/* ==========================================================================
   THE MILITIA'S OWN LAW, RESTATED
   ensemble.revenge-militia keeps its seed, its jitter, its formation table and
   its band tables private, and the lead ANCHOR it exports (.790,.762) is a
   round number rather than the slot `slots()` actually builds. So the law is
   copied here verbatim and evaluated, and the hole in the wedge and the man
   standing in it come out of the same arithmetic. If the module reseeds, the
   plate and Eupithes move together — which is the whole reason to compute it.
   ========================================================================== */
const MILITIA_SEED = 2408;
const BAND_Y  = [0.588, 0.702, 0.854];
const BAND_S  = [162, 200, 240];
const LEAD_BX = 0.740, LEAD_BAND = 2;      // FORM_TABLE.wedge row 0
const MEMBER_X0 = 0.075;                   // slots() clamps nx to .075 .. .845
const JIT = (() => { const R = rnd(MILITIA_SEED >>> 0), j = [];
                     for (let i = 0; i < 12; i++) j.push(R()); return j; })();
const leadSlot = spread => ({
  nx: clamp(0.500 + (LEAD_BX - 0.500)*spread + (JIT[0] - 0.5)*0.018, 0.075, 0.845),
  ny: clamp(BAND_Y[LEAD_BAND] + (JIT[5] - 0.5)*0.030, 0.560, 0.878),
  s:  BAND_S[LEAD_BAND] * (0.925 + 0.150*JIT[9]),
});

/* THE SHEET. Solved against this set at the station the fight lands on, not
   chosen — see the header. Height: the back band must stand where the ground
   paints a man BAND_S[0]/BAND_S[2] the size of the front one. Width: the last
   man of the wedge lands at frame x .040 when the point reaches `point`. */
const TAIL_X = 0.040;
function plateSheet(W, H){
  const L = leadSlot(1);
  const yP = G("point").p.y, dP = depthAtY(yP);
  const K  = (manH(yP) * H) / (0.95 * L.s);
  const yF = yAtDepth(dP * BAND_S[0] / BAND_S[2]);
  const dh = (yP - yF) * H / (L.ny - BAND_Y[0]);
  const dw = (G("point").p.x - TAIL_X) * W / (L.nx - MEMBER_X0);
  return { w: dw / K, h: dh / K };
}
/* the live rect: the plate is fitted so its own lead slot lands on the point's
   ground, at the size this ground paints a man there. */
function plateRect(W, H, g, spread){
  const L = leadSlot(spread), S = plateSheet(W, H);
  const K  = (manH(g.y) * H) / (0.95 * L.s);
  const dw = K * S.w, dh = K * S.h;
  return { dx: g.x*W - L.nx*dw, dy: g.y*H - L.ny*dh, dw, dh,
           sw: Math.round(S.w), sh: Math.round(S.h) };
}

/* ==========================================================================
   CONTINUITY IN — one god comes down, one god stays where he is.
   OD-B24-S07 ends on Olympus with Zeus on `dais_e` and Athena on `descent`.
   Neither station exists in this plan and blockingAt() would throw on both,
   correctly. The map names each one and says what happens to it:

     dais_e    zeus   -> DROPPED. He is back on his throne with the verdict
                        given. The poem never brings him to this field; the
                        weather the set hangs over the farm in `charge` is the
                        whole of his presence in it.
     descent   athena -> gate_mouth. `descent` means "on the sill of the gap,
                        turned out of the hall, facing down at Ithaca with the
                        order in her hands". The ground it lands on is the farm
                        gate at the lip of Laertes's terrace: the high place
                        above this fight, and the only station in the plan that
                        a god arriving out of the sky over a steading can be
                        standing on. She is in the frame from t=0 because she
                        was already on her way at the end of the last scene.
   ========================================================================== */
import { exitOccupancy as PREV_EXIT } from "./OD-B24-S07.mjs";

const OLYMPUS_TO_FIELD = { dais_e:null, descent:"gate_mouth" };
const INITIAL = Object.fromEntries(
  Object.entries(PREV_EXIT)
    .map(([who, st]) => [who, OLYMPUS_TO_FIELD[st] ?? null])
    .filter(([, st]) => st));

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   Five bodies, and between them the shape of a vendetta running out of road.

   · EUPITHES walks the militia lane from the left lip to the point, and the
     whole wedge is fitted to him every frame. He is the only body in this scene
     that crosses the field, and he crosses it to die at the end of it. He stops
     at parameter .90 — short of the clash coordinate both lanes end on — and
     from t=56 he holds that station struck.
   · ATHENA opens on the farm gate, having just come down onto it, and walks to
     `mentor`, .46 of the way from the gate to the household's front line: open
     floor between the two lines, on nobody's line, up-field of the killing.
     She does not move again. A god who has come to make one man throw one spear
     has no other business on the ground.
   · LAERTES comes out of the steading door, DOWN THE DRAWN HOUSEHOLD LANE to
     its foot, and out onto `cast`, the household's front line. The lane is not
     decoration: drafted straight from the door to the line he walked through
     Athena at t=38 at her own ground height, and the lane takes him round the
     west of her at a whole depth step's remove. He never leaves `cast`. The old
     man's entire part in this scene is one cast made standing still.
   · ODYSSEUS holds `arm_l` — his half of the set's own household pair — for
     sixty-two seconds while he watches the road and puts weapons into hands,
     and then charges by way of `near_lane`. The waypoint is the second routing
     the field forced: the straight line from the household stand to `charge_n`
     runs through his father's line at his father's own ground height, and
     `near_lane` drops him .52 of the way to the near edge first, so the charge
     crosses IN FRONT of the line instead of through it and he arrives on ground
     157 px nearer than the front rank he is charging. WHERE HE STOPS WAS MOVED
     ONCE, AND THE FIRST DRAFT IS WHY THE SECOND IS RIGHT: at .75 of the way
     from the clash toward the militia's line he landed at frame x .360, and at
     that x his near body — 310 px tall, 118 px across — covered the ground from
     .296 to .402 and printed straight over the point of the wedge, so the man
     Laertes had just killed disappeared behind the man charging past him. On
     the militia's own front line (frame x .318) he covers the front rank he is
     charging, which is the beat, and leaves 14 px of paper between his shoulder
     and Eupithes's.
   · TELEMACHUS holds `arm_r`, takes what his father hands him, and goes forward
     onto `charge_f` on the near right. His leg is the shortest in the file and
     that is the ground's doing, not a choice: the household stand is already on
     the field, and the floor between it and the fighting line is 143 px wide.

   Nobody shares a station. The two closest approaches at the same depth are
   both measured: Laertes on `cast` against Telemachus on `charge_f`, 114 px
   between centres whose half-widths sum to 88 — 26 px of paper, with 90 px of
   ground height between their feet — and Athena on `mentor` against Eupithes on
   `point`, 94 px apart with 33 px of paper. Everything else in the frame that
   overlaps is separated by more than half a body's height of floor and sorted
   by the queue, which is what a fight looks like from the side. */
const MOVES = [
  // the vendetta, walked down its own lane
  { who:"eupithes",   from:"road_lip",  to:"lane_p_mid",  t0: 6, t1:34 },
  { who:"eupithes",   from:"lane_p_mid",to:"point",       t0:34, t1:54 },
  // the god comes down off the gate and stops between the lines
  { who:"athena",     from:"gate_mouth",to:"mentor",      t0:12, t1:22 },
  // the old king comes out of his house and takes the line, down the lane
  { who:"laertes",    from:"steading",  to:"lane_h_foot", t0:30, t1:44 },
  { who:"laertes",    from:"lane_h_foot",to:"cast",       t0:44, t1:56 },
  // the charge, across the near ground and in front of the line
  { who:"odysseus",   from:"arm_l",     to:"near_lane",   t0:62, t1:72 },
  { who:"odysseus",   from:"near_lane", to:"charge_n",    t0:72, t1:84 },
  { who:"telemachus", from:"arm_r",     to:"charge_f",    t0:66, t1:84 },
];

/* --- THE CAST, on the master clock ---------------------------------------
   THE SPEAR LEAVES AT t=56 AND EVERYTHING IN THE FILE IS HUNG ON THAT SECOND:
   Laertes goes to `lae_throwing` on it, Eupithes goes to `eup_struck` on it,
   the militia's phase turns from `advance` to `leader-down` on it, and the
   module's reaction wave starts running backward through the ranks from it. It
   is the only discontinuity in the scene and every channel takes it together. */
const CAST_T = 56;

/* the militia, as four continuous ramps and one flip on the cast */
const militiaAt = t => ({
  phase:  t < CAST_T ? "advance" : t < 74 ? "leader-down" : "collide",
  /* the shock front, radiating BACKWARD from the point. It starts below zero so
     that nobody in the wedge reacts before the cast lands and the ranks nearest
     the point break first: at CAST_T the front is at 0 and only the point's own
     neighbours are inside it. */
  wave:   t < CAST_T ? 0 : lerp(0, 1.30, clamp01((t - CAST_T) / 30)),
  waveLag:0.68,
  /* every head on the farm gate on the way in; then on the man who threw */
  attention: lerp(0.86, 0.34, clamp01((t - CAST_T) / 26)),
  /* the wedge loses its cohesion once the point is gone — the ranks open around
     a man who is no longer walking */
  spread: lerp(1.00, 1.10, clamp01((t - CAST_T) / 22)),
  leaderDown: t >= CAST_T ? 1 : 0,
});

export const scene = {
  id:"OD-B24-S08",
  title:"The Last Clash",
  book:24,
  plan:"laertes-farm-field",
  duration:D,
  beats:[
    "Odysseus sees the armed relatives approaching and distributes weapons among the farm household.",
    "Athena appears as Mentor and urges Laertes's line to prove its strength.",
    "Laertes prays, throws a spear, and kills Eupithes through the helmet.",
    "Odysseus and Telemachus charge the remaining attackers.",
    "The final battle begins to repeat the slaughter that peace must stop.",
  ],
  exitState:"On the open ground below Laertes's steading, the field still in " +
    "state `charge`: both lanes hot with their chevrons on the clash band, no " +
    "bolt scar on the ground, no arms grounded, nothing dropped, nothing " +
    "buried. THE MILITIA is in the wedge it marched in, colliding — the front " +
    "rank driving in with the spears back down on the level and the shields up, " +
    "the shock of the cast having run all the way back through the ranks, the " +
    "formation opened around the hole where its point used to walk. EUPITHES " +
    "holds `point`, .90 of the way down the militia lane, STRUCK: Laertes's " +
    "cast took him through the bronze cheek-piece of his helmet, and the man " +
    "who called the muster is the first man down in the fight he called. " +
    "LAERTES stands on `cast`, the household's front line, empty-handed and " +
    "upright, the vow made and the shaft gone. ODYSSEUS is on `charge_n`, on " +
    "the near ground .75 of the way from the clash toward the militia's own " +
    "line, in among the front rank and printing over it. TELEMACHUS is on " +
    "`charge_f`, on the near right, come forward off the household stand. " +
    "ATHENA is on `mentor`, between the two lines, up-field of all of it, still " +
    "in Mentor's grey, holding the order Zeus gave her and not yet using it. " +
    "This is the incoming condition of the next scene: the killing has started " +
    "again, the man who can stop it is standing in the middle of it in disguise, " +
    "and the ground under them is already surveyed for a bolt scar, two stands, " +
    "a dispersal lane and an oath ring that none of them can see yet.",
  exitOccupancy:occupancyAt(laertesField, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    eupithes:"t=0, on `road_lip`, .22 down the militia lane from the town road " +
             "at the left lip of the field, at the head of the wedge",
    militia_01:"t=0, fitted to Eupithes — the wedge is not a separate arrival, " +
               "it is the formation hanging off the man who is arriving",
    athena:"t=0, already on `gate_mouth`, the farm gate at the lip of the " +
           "terrace. She is the one body this scene inherits: OD-B24-S07 left " +
           "her on the cloud sill facing down at this island",
    laertes:"t=30, out of `steading` — the steading door, up on the farm terrace",
    odysseus:"t=0, already on `arm_l`, his half of the household's own pair",
    telemachus:"t=0, already on `arm_r`, the other half of it",
  },
  exits:{
    eupithes:"none — `point`, struck, and he stays on it",
    militia_01:"none — the wedge is still on the field and still coming",
    athena:"none — `mentor`, between the lines, with the order unspent",
    laertes:"none — `cast`, the household line, the shaft gone",
    odysseus:"none — `charge_n`, in among the front rank",
    telemachus:"none — `charge_f`, on the near right",
  },
  walkable:"the standing stations of the local plan `laertes-farm-field` and " +
           "nothing else: the militia lane (`road_lip`, `lane_p_mid`, `point`), " +
           "the household lane (`gate_mouth`, `lane_h_foot`), the household's " +
           "own pair (`arm_l`, `arm_r`), and the four places on the field " +
           "(`mentor`, `cast`, `near_lane`, `charge_n`, `charge_f`). The " +
           "steading, the herm, the town road, the east fields, the clash band, " +
           "the two front lines, the militia's stand and the oath ring are " +
           "FIXTURES. `parley_l`/`parley_r`, the set's authored contact pair " +
           "between the lines, is surveyed and LEFT EMPTY: it is where the next " +
           "scene stops the fight. blockingAt() throws on anything else — " +
           "including both Olympian stations this scene inherits from, which is " +
           "why OLYMPUS_TO_FIELD exists and why it drops one of them.",
  depthOrder:"the set paints the field first, back to front — sky with the " +
             "weather Zeus has not spent yet, the far range, the ground, the " +
             "perspective plots and hedges, the steading on its terrace with " +
             "the gate at its lip, the orchard canopies and the field olives, " +
             "the churned clash band in three pieces, and the two charge lanes " +
             "with their chevrons. The `fallen` layer is WITHHELD: it paints " +
             "grave mounds, and nobody has been buried on this ground yet. Then " +
             "ONE queue sorted by the ground line each body stands on, far " +
             "first: the militia plate enters it at its own back rank's ground " +
             "line, then Athena, then Eupithes at the point, then Laertes on the " +
             "line, then Telemachus, then Odysseus on the near ground. Then the " +
             "set AGAIN for its declared front layer — the near olive, the corner " +
             "stone run and the near tussocks — so the charge passes behind them.",
  gazeTargets:{
    eupithes:"the farm gate, level, the whole way down the lane — he is walking " +
             "at a building, not at a man; then, for one second, at the man who " +
             "threw; then nothing",
    athena:"Laertes, across the width of the field, from the moment she comes " +
           "off the gate — she looks at nobody else in the scene, which is the " +
           "whole content of her being here; then out at the wedge as it comes on",
    laertes:"the sky over the farm while he prays, then Eupithes and only " +
            "Eupithes, then the place Eupithes was standing",
    odysseus:"the town road and the dust on it, then his son's hands as the " +
             "weapons go across, then the front rank of the wedge",
    telemachus:"his father's hands, then the same front rank",
    militia_01:"every head on the farm gate at `attention` .86 on the way in; " +
               "the wave takes them off it and onto their own point as it falls",
  },
  attachments:[
    { at: 0, who:"field_01",   change:"state CHARGE — lanes hot, no scar, " +
      "nothing grounded, nothing buried" },
    { at: 6, who:"odysseus",   change:"POINTING — he has seen the dust on the " +
      "town road and named it" },
    { at:14, who:"odysseus",   change:"OFFERING — the farm's weapons going out " +
      "of his hands into the household's" },
    { at:16, who:"telemachus", change:"REACHING — he takes his" },
    { at:22, who:"athena",     change:"MENTOR, on the field — grey elder, " +
      "counsel first, between the two lines" },
    { at:40, who:"athena",     change:"COMMAND — she calls Laertes's line to " +
      "prove itself, arm out across the field" },
    { at:46, who:"laertes",    change:"PRAYING — hands washed, arms up, the vow " +
      "to Athena before the cast" },
    { at:56, who:"laertes",    change:"CASTING — stature restored, the shaft " +
      "gone out of his hand" },
    { at:56, who:"eupithes",   change:"STRUCK — through the bronze cheek-piece; " +
      "head snapped back, arms flung, knees gone" },
    { at:56, who:"militia_01", change:"LEADER DOWN — the point vacated, the " +
      "shock front starting backward through the ranks from it" },
    { at:58, who:"athena",     change:"MARSHAL — both arms up; the charge" },
    { at:62, who:"odysseus",   change:"leaving the household stand, down the " +
      "near ground and across the front of his father's line" },
    { at:74, who:"militia_01", change:"COLLIDE — spears back down on the level, " +
      "shields up, the wedge opened around the hole" },
    { at:84, who:"odysseus",   change:"CONFRONTATION — in among the front rank" },
    { at:84, who:"telemachus", change:"CONFRONTATION — on the near right" },
  ],
  sound:[
    { at: 2, source:"road_lip",   cue:"boots on a dry road, a long way off" },
    { at:10, source:"arm_l",      cue:"a farm's iron coming off its pegs" },
    { at:24, source:"mentor",     cue:"an old neighbour's voice where no neighbour is" },
    { at:40, source:"mentor",     cue:"prove yourself the son of your fathers" },
    { at:46, source:"cast",       cue:"an old man washing his hands, and a vow" },
    { at:56, source:"point",      cue:"bronze going through bronze, once" },
    { at:58, source:"point",      cue:"a man's armour hitting the ground with him inside it" },
    { at:64, source:"lane_p_mid", cue:"a shout that starts at the front and arrives at the back" },
    { at:74, source:"charge_n",   cue:"two men running on grass" },
    { at:90, source:"band_c",     cue:"the sound the palace made, again, outdoors" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"charge" },
    { asset:"ensemble.revenge-militia", instance:"militia_01",
      anchor:{x:.28,y:.69}, scale:.56, pose:"advancing" },
    { asset:"character.athena-as-mentor", instance:"athena",
      anchor:{x:.501,y:.589}, scale:.198, band:"threeq", pose:"mentor_still" },
    { asset:"character.eupithes", instance:"eupithes",
      anchor:{x:.417,y:.715}, scale:.286, band:"threeq", pose:"eup_marching" },
    { asset:"character.laertes", instance:"laertes",
      anchor:{x:.614,y:.724}, scale:.292, band:"threeq", pose:"lae_doubting" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.716,y:.851}, scale:.386, band:"threeq", pose:"lean_forward" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.756,y:.849}, scale:.385, band:"threeq", pose:"three_quarter_left" },
  ],

  timeline:[
    // 1 — the dust on the road, and the farm's iron going out
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0, args:{ gaze:{ x:-.52, y:-.04 } } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"lean_forward" } },
    { op:"actor.gaze", target:"telemachus", at: 0.0, args:{ gaze:{ x:-.44, y:.06 } } },
    { op:"actor.pose", target:"eupithes",   at: 0.0, args:{ pose:"eup_marching" } },
    { op:"actor.gaze", target:"eupithes",   at: 0.0, args:{ gaze:{ x:.46, y:-.10 } } },
    { op:"actor.pose", target:"athena",     at: 0.0, args:{ pose:"mentor_still" } },
    { op:"actor.gaze", target:"athena",     at: 0.0, args:{ gaze:{ x:.30, y:.24 } } },
    { op:"actor.pose", target:"laertes",    at: 0.0, args:{ pose:"lae_doubting" } },
    { op:"actor.gaze", target:"laertes",    at: 0.0, args:{ gaze:{ x:-.30, y:.10 } } },
    { op:"actor.pose", target:"odysseus",   at: 6.0, args:{ pose:"pointing_arm" } },
    { op:"actor.pose", target:"odysseus",   at:14.0, args:{ pose:"offering_hand" } },
    { op:"actor.gaze", target:"odysseus",   at:14.0, args:{ gaze:{ x:.34, y:.26 } } },
    { op:"actor.pose", target:"telemachus", at:16.0, args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"telemachus", at:16.0, args:{ gaze:{ x:-.36, y:.30 } } },
    // 2 — Mentor on the field
    { op:"actor.pose", target:"athena",     at:12.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"athena",     at:22.0, args:{ pose:"mentor_counsel" } },
    { op:"actor.gaze", target:"athena",     at:22.0, args:{ gaze:{ x:.42, y:.04 } } },
    { op:"actor.pose", target:"laertes",    at:30.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"eupithes",   at:34.0, args:{ pose:"eup_charging" } },
    { op:"actor.gaze", target:"eupithes",   at:34.0, args:{ gaze:{ x:.50, y:.02 } } },
    { op:"actor.pose", target:"athena",     at:40.0, args:{ pose:"mentor_command" } },
    { op:"actor.gaze", target:"athena",     at:40.0, args:{ gaze:{ x:.48, y:.02 } } },
    // 3 — the vow, and the cast
    { op:"actor.pose", target:"laertes",    at:46.0, args:{ pose:"lae_praying" } },
    { op:"actor.gaze", target:"laertes",    at:46.0, args:{ gaze:{ x:.10, y:-.58 } } },
    { op:"actor.pose", target:"laertes",    at:56.0, args:{ pose:"lae_throwing" } },
    { op:"actor.gaze", target:"laertes",    at:56.0, args:{ gaze:{ x:-.50, y:.02 } } },
    { op:"actor.pose", target:"eupithes",   at:56.0, args:{ pose:"eup_struck" } },
    { op:"actor.gaze", target:"eupithes",   at:56.0, args:{ gaze:{ x:-.30, y:-.34 } } },
    { op:"actor.pose", target:"athena",     at:58.0, args:{ pose:"mentor_marshal" } },
    { op:"actor.gaze", target:"athena",     at:58.0, args:{ gaze:{ x:-.20, y:.16 } } },
    // 4 — the charge
    { op:"actor.pose", target:"odysseus",   at:62.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at:62.0, args:{ gaze:{ x:-.50, y:.06 } } },
    { op:"actor.pose", target:"telemachus", at:66.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"telemachus", at:66.0, args:{ gaze:{ x:-.48, y:.04 } } },
    { op:"actor.pose", target:"laertes",    at:74.0, args:{ pose:"torso_open" } },
    // 5 — and it is the slaughter again
    { op:"actor.pose", target:"odysseus",   at:84.0, args:{ pose:"confrontation" } },
    { op:"actor.pose", target:"telemachus", at:84.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"athena",     at:88.0, args:{ gaze:{ x:-.44, y:.10 } } },
    { op:"timeline.capture", target:"OD-B24-S08", at:98.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s    = stateAt(scene, t);
    const blk  = blockingAt(laertesField, MOVES, t, INITIAL);
    const prog = Math.min(.96, .06 + .88*(t/D));
    const mil  = militiaAt(t);

    /* --- THE FIELD, back and ground layers -------------------------------
       `fallen` is withheld: it paints grave mounds, and this scene is the one
       that makes the men who go in them. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{
        state:"charge", t:0.42, progress:prog,
        layers:["sky","hills","ground","fields","farm","trees","band","lanes"],
        status: t < CAST_T ? "THEY ARE COMING" : "THE LAST CLASH",
      },
    });

    /* ONE queue, sorted by the ground line each thing stands on: the floor
       decides who is in front, not the order these blocks happen to be written
       in. The militia plate is IN the queue, at the ground line its own back
       rank stands on. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- THE WEDGE: fitted to its own point, every frame ------------------ */
    {
      const p = blk.eupithes, g = groundOf(p);
      const R = plateRect(W, H, g, mil.spread);
      add((R.dy + BAND_Y[0]*R.dh) / H, () => {
        const cv = keyedModuleCanvas(militia, R.sw, R.sh,
          { phase:mil.phase, formation:"wedge", count:9, density:1.0,
            spread:mil.spread, wave:mil.wave, waveLag:mil.waveLag,
            attention:mil.attention, leaderDown:mil.leaderDown,
            /* the point is a character, not a stamp, and his kit is on him */
            showLead:false, showKit:false, showRoad:false, showOpposition:false,
            layer:"full", t:(t*0.24) % 1,
            status: mil.phase === "advance" ? "ADVANCING"
                  : mil.phase === "leader-down" ? "LEADERLESS" : "COLLIDING",
            progress:prog },
          `b24s08|mil|${mil.phase}|${mil.wave.toFixed(3)}|${mil.spread.toFixed(3)}` +
          `|${mil.attention.toFixed(3)}|${mil.leaderDown}`);
        offctx.drawImage(cv, 0, 0, cv.width, cv.height, R.dx, R.dy, R.dw, R.dh);
      });
    }

    /* --- ATHENA AS MENTOR: the grey elder between the lines --------------- */
    {
      const p = blk.athena, c = s.athena || {};
      const g = groundOf(p);
      const arriving = t < 22;
      const urging   = t >= 40 && t < 58;
      const loosing  = t >= 58;
      add(g.y, () => placeInstance(offctx, W, H, mentor, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "mentor_still",
          gaze: c.gaze || { x:.30, y:.24 },
          browUp:   urging ? .34 : arriving ? .10 : .22,
          browKnit: loosing ? .48 : urging ? .30 : .12,
          eyeNarrow:loosing ? .30 : .14,
          jaw:      urging ? .46 : loosing ? .30 : 0,
          status:   loosing ? "GO ON" : urging ? "PROVE YOURSELF"
                  : arriving ? "COME DOWN" : "MENTOR",
          progress: prog,
        },
      }));
    }

    /* --- EUPITHES: one body, one direction, and it ends here -------------- */
    {
      const p = blk.eupithes, c = s.eupithes || {};
      const g = groundOf(p);
      const marching = t < 34;
      const charging = t >= 34 && t < CAST_T;
      const struck   = t >= CAST_T;
      add(g.y, () => placeInstance(offctx, W, H, eupithes, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "eup_marching",
          gaze: c.gaze || { x:.46, y:-.10 },
          browUp:   struck ? .74 : .16,
          browKnit: struck ? .28 : charging ? .82 : .60,
          eyeWide:  struck ? .80 : 0,
          eyeNarrow:struck ? 0 : charging ? .44 : .30,
          frown:    struck ? 0 : charging ? .40 : .24,
          jaw:      struck ? .62 : charging ? .36 : .12,
          status:   struck ? "STRUCK" : charging ? "CHARGING" : "MARCHING",
          progress: prog,
        },
      }));
    }

    /* --- LAERTES: the vow, and the one cast that ends the vendetta -------- */
    {
      const p = blk.laertes, c = s.laertes || {};
      const g = groundOf(p);
      const praying = t >= 46 && t < CAST_T;
      const casting = t >= CAST_T && t < 74;
      const spent   = t >= 74;
      add(g.y, () => placeInstance(offctx, W, H, laertes, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "lae_doubting",
          gaze: c.gaze || { x:-.30, y:.10 },
          browUp:   praying ? .72 : spent ? .40 : .26,
          browKnit: casting ? .74 : praying ? .10 : .46,
          eyeWide:  praying ? .34 : 0,
          eyeNarrow:casting ? .40 : spent ? .30 : .34,
          frown:    casting ? .36 : spent ? .12 : .20,
          jaw:      praying ? .30 : casting ? .22 : 0,
          status:   spent ? "THE SHAFT GONE" : casting ? "CASTING"
                  : praying ? "VOWING" : "THE OLD KING",
          progress: prog,
        },
      }));
    }

    /* --- TELEMACHUS: takes what is handed to him, and goes forward -------- */
    {
      const p = blk.telemachus, c = s.telemachus || {};
      const g = groundOf(p);
      const taking   = t >= 16 && t < 40;
      const charging = t >= 66;
      add(g.y, () => placeInstance(offctx, W, H, telemachus, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          band:"threeq",
          pose: c.pose || "lean_forward",
          gaze: c.gaze || { x:-.44, y:.06 },
          browUp:   taking ? .34 : .16,
          browKnit: charging ? .62 : .28,
          eyeNarrow:charging ? .38 : .16,
          frown:    charging ? .32 : .06,
          jaw:      charging ? .34 : taking ? .18 : 0,
          status:   charging ? "WITH HIS FATHER" : taking ? "ARMED"
                  : "THEY ARE COMING",
          progress: prog,
        },
      }));
    }

    /* --- ODYSSEUS: one body, one guise, no disguise left in the poem ------ */
    {
      const p = blk.odysseus, c = s.odysseus || {};
      const g = groundOf(p);
      const seeing  = t >= 6 && t < 14;
      const arming  = t >= 14 && t < 40;
      const charging= t >= 62;
      add(g.y, () => placeInstance(offctx, W, H, odysseus, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          guise:"restored", band:"threeq",
          pose: c.pose || "three_quarter_left",
          gaze: c.gaze || { x:-.52, y:-.04 },
          browUp:   seeing ? .30 : arming ? .18 : .06,
          browKnit: charging ? .66 : seeing ? .40 : .22,
          eyeNarrow:charging ? .40 : seeing ? .34 : .18,
          frown:    charging ? .34 : .06,
          jaw:      charging ? .38 : arming ? .22 : 0,
          status:   charging ? "AT THEM" : arming ? "ARM THE HOUSE"
                  : seeing ? "THEY ARE COMING" : "THE KING",
          progress: prog,
        },
      }));
    }

    /* far → near, by the set's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());

    /* --- THE FIELD AGAIN, front layer only: the near olive, the corner stone
       run and the near tussocks, so the charge passes behind them. ---------- */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{
        state:"charge", t:0.42, progress:prog, layers:["fg"],
        status: t < CAST_T ? "THEY ARE COMING" : "THE LAST CLASH",
      },
    });
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
