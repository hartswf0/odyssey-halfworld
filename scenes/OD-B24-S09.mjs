/* ============================================================
   SCENE  OD-B24-S09 — Athena Makes Peace
   Book XXIV, scene 9 — the last scene of the book and of the poem.
   ADDITIVE: creates nothing, modifies nothing. Shape copied from the reference
   scene, scenes/OD-B16-S03.mjs, and from the scene immediately before this one,
   OD-B24-S08, whose ground, ladder, lanes and plate arithmetic this file
   inherits verbatim so the two scenes stand on one floor.

   THE ROOM IS THE SAME ROOM, IN FOUR MORE OF ITS STATES. This is the scene
   location.farm-battlefield-at-peace was authored for — its own header says so
   ("THE SHAPE OF OD-B24-S09... one continuous conversion — charge, halt,
   separation, oath — so all four are authored into ONE ground as geometry and
   switched by state, never by redrawing the room"). Brief section D is therefore
   taken literally: NO second field is built or cast, and the state channel is
   driven on the master clock:

     charge     t <  22   the lanes still hot, no scar, nothing grounded. This is
                          the frame OD-B24-S08 handed over, unchanged.
     halt       t <  56   the bolt scar struck before her feet, and the kit lying
                          where it fell out of their hands.
     separation t <  80   the two stands lit, the arms stacked in tripods, the
                          dispersal lane dashed off the near-left corner.
     oath       t < 112   the ring struck in around its slab.
     peace      t >= 112  the lanes going back to grass, the dropped kit picked
                          up, the ring and the mounds and the stacks left.

   `fallen` IS WITHHELD UNTIL THE HALT AND THEN LEFT IN FOR GOOD. S08 withheld it
   because it paints two grave mounds and nobody had been buried yet; this scene
   is where that changes. It is also the layer that carries the DROPPED KIT —
   shields on their faces, helms, a spear lying — which is the single most
   important image in the first beat, because Homer's Ithacans do not lay their
   arms down, the arms fall out of their hands. `zones` is never passed: it is
   the previs overlay.

   THE PLAN IS S08'S PLAN, EXTENDED, NOT A NEW ONE. Same division: THE PLAN OWNS
   TOPOLOGY and THE SET OWNS THE GROUND. engine/blocking's project() puts a d=1
   body at screen y .96 and bottoms out at y .5288 with a 1.7:1 falloff, which
   cannot carry a 13:1 landscape whose horizon is at y .300 and whose near edge
   is at y 1.040 — so groundOf() and sizeOf() take a station name straight back
   to the set's own exported anchors, its own drawn lanes and its own depthAtY(),
   and the plan's z IS depthAtY() at the station. Not one figure coordinate in
   this file is typed. Every station of S08's plan is reproduced with the same
   name and the same derivation, so the inherited occupancy resolves without a
   translation map, and six more are added: the set's own `halt:before-scar`
   stance, the two halves of its oath-ring pair, the two halves of its
   household-stand pair, one point on the militia lane to disperse to, and
   `pursue`, the one place on the near ground the last charge reaches.

   THE PARLEY PAIR IS SURVEYED AND LEFT EMPTY, AND S08 GUESSED WRONG ABOUT IT.
   S08's header calls `meet:parley_l`/`meet:parley_r` "where the two sides will
   stand to be stopped in S09". They never do: Homer's Ithacans are not talked
   round at arm's length, they are shouted at from across a field, and they drop
   what they are holding and run for the town. Standing Athena on `parley_l`
   (x .428) was drafted and rendered and it also fails on the floor — the
   militia's own point stands at x .417 with 46 px of ground between them, so a
   228 px goddess and a 196 px front rank print as one mass. THE HALT HAPPENS ON
   `before_scar` INSTEAD, which is the set's own `halt:before-scar` anchor and
   is authored for precisely this: the stance the pursuit cannot advance past,
   x .508, 52 px of floor in front of the mark the bolt makes. She is standing
   on the field's centre line with the scoured disc opening at her feet, 102 px
   clear of the wedge and 213 px clear of the king. The two sides of this scene
   stand at arm's length exactly once, at the oath ring, and that pair IS used
   as a pair (brief section B) — as is `house_l`/`house_r` at the household's
   own stand.

   WHY THE KING STANDS ON THE LEFT OF THE RING AND MENTOR ON THE RIGHT. The pair
   has no side ownership — the set calls them `meet:oath_l` / `meet:oath_r`, "so
   king and people swear at two coordinates and not at one" — and the routing
   decides it. Odysseus ends the fight on the near LEFT, at `pursue`, because
   that is where he was running when he was stopped; Athena ends it on the
   centre line. If the king took the right-hand stone he would have to cross the
   whole near foreground, where every body in this scene is at its largest, and
   the only line he can walk passes through the left-hand stone at 15 px of floor
   — he would walk through the goddess to swear with her. Drafted that way twice
   and measured both times. So Athena comes straight down the centre off the
   scar to the right-hand stone, and Odysseus goes to the stone he is already
   standing beside. Neither path crosses the other at any t.

   EUPITHES IS CARRIED OUT OF THE LANE, AND THE SET TAKES HIM OVER. He is the one
   body this scene inherits dead: S08 ends with Laertes's cast through his helmet
   and the man who called the muster down at `point`. He holds that station,
   struck, for the whole of the halt — the fight cannot be stopped without the
   reason for stopping it in frame — and at the SEPARATION flip he is hidden,
   because that is the flip at which the set's own `fallen` layer takes over: the
   mound at (.352,.660) is drawn "out of the lane", eighty stage px west of where
   his body was standing. Furniture, never figures, is the set's rule and this is
   the handover. It also solves a real collision: `point` (x .417) and `oath_l`
   (x .418) are the same x, and a 336 px king on the near ground would have
   printed clean over a 196 px corpse for the last third of the scene.

   THE MILITIA GOES BACK UP THE ROAD IT CAME DOWN, AND ITS PLATE IS S08'S PLATE.
   ensemble.revenge-militia is again hung off a blocked ground point rather than
   placed by hand, with the same four numbers solved the same way (see the block
   below): the SHEET is solved ONCE, on the wedge at spread 1, exactly as S08
   solved it, so this is physically the same sheet of men — and then the live
   blit is fitted every frame so the module's own lead slot lands on the station
   the militia is blocked to, at the height this ground paints a man there. Two
   changes from S08 and both are forced by the beat:
     · THE LEAD SLOT IS FORMATION-AWARE. slots() reads row 0 of FORM_TABLE, and
       that row is a different nx in every formation (wedge .740, rout .628,
       column .782). S08 could hardcode the wedge row; this scene changes
       formation twice, so the row is a table here and the plate stays fitted
       through each flip. All the rows are band 2, so the lead's ny and its size
       are unchanged and the plate never resizes on a flip.
     · THE MILITIA IS NOW A BLOCKED BODY OF ITS OWN. In S08 it was fitted to
       Eupithes, which was right while the point of the wedge was a man walking.
       He has stopped walking. So the wedge is blocked separately, from `point`
       (where S08's fitting left it, so the join costs nothing) back up its own
       drawn lane to `road_hold`, and Eupithes stays where he fell. `showLead`
       stays FALSE — the point is a hole in the formation, which is the whole
       visible fact of losing him — and `showKit` stays FALSE for the same reason
       it did in S08 and one more: the module would draw the dropped helmet and
       shield in the CURRENT lead slot, so the kit would walk backwards up the
       road with them. The set's `fallen` layer already scatters dropped kit at
       fixed places on the ground, which is where dropped kit stays.

   THERE IS EXACTLY ONE FORMATION FLIP AND IT HAPPENS WHILE THE PLATE IS STANDING
   STILL. wedge/`collide` -> rout/`rout` at t=34, eight seconds before they start
   walking, so the re-layout does not also slide. TWO OTHER STATES WERE DRAFTED,
   RENDERED AND THROWN OUT, and both failures are the same failure — a spear at
   the wrong angle is a ruled line across the frame:
     · `waver`/`broken-line` between the shout and the turn. PHASES.waver carries
       the shafts to deg -72..-96, a vertical picket a third of the frame high
       over a formation half the frame wide, and it overshot the sheet and laid a
       hard clipped bar across the whole thing. `collide` (spears down on the
       level) holds until they turn instead, which is also what the poem says —
       they do not waver, they drop everything at once.
     · `column`/`advance` once they have stopped on the road. deg -52 shoulders
       the spear up and back, and at the road's scale that is a single unbroken
       diagonal 437 px long lying across the empty top-left quarter. PHASES.rout
       trails the shaft at deg 132, down and behind a running man, and it is
       also the truer picture: Homer's Ithacans do not march home in order.
   The sheet is nonetheless blitted with a .22 BLEED so a raised shaft can never
   be cut by its own canvas edge again. `density` falls from 1.0 to .70 across
   the retreat, and the frame does the rest: nine men on the field become six on
   the road, of whom three are already past the left edge on their way to the
   town and one is the vacated point, so what is left standing on that road in
   the last frame of the poem is three men and the hole where the man who called
   them out used to walk. That is what dispersal looks like from a fixed camera.

   THE TWO DIVINE INSTRUMENTS ARE PLACED, NOT PASTED, AND BOTH ARE CUT DOWN TO
   THE LAYERS THIS FRAME CAN CARRY.

   · divine_fx.zeuss-stopping-thunderbolt is a full plate that draws its OWN
     field, its own Athena and its own frozen pursuit. All three are dropped:
     this scene has a field, a goddess and a militia, and the brief forbids
     baked-in unrelated figures. What is kept is the event — `aperture`, `bolt`,
     `smoke` — and the plate is then fitted so its own `target:ground` anchor
     lands exactly on the set's own `mark:bolt-scar`. ONE number does it: at
     BOLT_S .92 the fx's target sits on the scar, its sky aperture opens at frame
     (.710,.142) in clear sky, and its smoke column stands from the scar up to
     y .658. The `scar` layer is dropped too — the SET owns the mark, because the
     mark outlives the effect: the bolt is gone by t=52 and the scoured disc with
     the fused centre is still on that ground in the last frame of the poem.
     `veil` is dropped last and least willingly: the arrest dome's footprint maps
     to x .361..0.655, y .566..0.851 of this frame, which is a lattice of vertical
     hold-bars standing over the parley pair and the goddess inside it. The
     arrest is carried instead by the bodies — the militia's phase, and a king
     pulled up short — which is where it belongs.
     THE FORK IS BRIEF ON PURPOSE. `strike` is open for twelve seconds. A bolt
     that leans from x .710 in the sky to x .508 on the ground passes through
     x .614 at y .44, which is Laertes's head at `cast`; a lightning stroke
     crossing in front of a man for one flash is a picture, and one standing in
     front of him for ninety seconds is a mistake.

   · divine-fx.ithacan-peace-oath is a covenant diagram — parties, knot,
     reciprocity ladder, memory suppression, future stores — and it is hung in
     the OPEN SKY like the decree in OD-B24-S07, for the same reason and against
     the same constraint: placeInstance forces its box to the stage aspect, so
     one number places it. THE SKY IS ONLY .21 OF THE FRAME HIGH HERE. The set's
     far range crests at y .215 and the plate's own content, measured off the
     module's params rather than guessed (disc top = discCy - discR·W/H = .0265,
     knot foot = knotCy + knotS·W/H = .3115), is .285 of its box tall. Solving
     the whole instrument into .04..0.21 gives a plate .38 of the frame wide, at
     which the counted pips in the reciprocity rungs are six px across and die in
     the dot lattice — the known trap. So the LADDER, the MEMORY PLATE and the
     ABUNDANCE RANK are withheld and the SOURCE of the instrument is kept:
     `parties` (the two sworn discs, the crown block and the three household
     marks), `yoke` (the broken beams falling inward from both discs) and `knot`
     (the two square hooks that slide together and INTERLOCK as `bind` closes).
     That is the oath itself, and at OATH_S .52 the discs are 34 px across and
     the knot's hooks 34 px — geometry, not type, and it survives. `bind` is a
     ramp on the master clock, not a preview: the hooks are open when she starts
     speaking and interlocked when the poem ends.

   TONE. The field's `oath` and `peace` tables are its lightest (sky 1, far 2,
   ridge 3, ground 2, swept 1) and the ink is spent where the set spends it: the
   gate mouth, the scar's fused centre, the shield bosses, the stacked spearheads
   and the ring stones. Six figures, a thinning plate of six men and two small
   diagrams occupy well under a third of the frame; the rest is grazing. ZERO
   hand-drawn ctx overpaint on any figure or effect in this file. The rig and the
   modules do all of it.

   ONE BODY, NO GUISE RAMP. Odysseus is character.odysseus-b16 holding
   `guise:"restored"` from the first frame to the last, exactly as in S03..S08 —
   Book XXIV has no disguise in it. The atlas asks for `character.odysseus` and
   this is that man: brief section C says ONE module with a guise channel, never
   a cut between modules, so the b16 body is cast and the guise names the state.
   Athena is in disguise and her disguise is a whole authored module
   (character.athena-as-mentor); there is no transformation on screen, so there
   is no discontinuity for divine_fx.athenas-restoration to cover and it is not
   cast.

   Beats (Od. 24.529-548):
     1. Athena cries out for both sides to stop and tells the Ithacans to
        disperse without more blood.
     2. Zeus hurls a thunderbolt before her feet, making the command irresistible.
     3. Odysseus attempts one more charge until Athena restrains and redirects him.
     4. She establishes binding oaths between king and people in Mentor's form.
     5. The poem ends with the household restored and the violence converted
        into civic peace.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S09.mjs --t 26   (the halt)
            node harness/render-scene.mjs scenes/OD-B24-S09.mjs --t 124  (the oath)
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
import bolt       from "../assets/divine_fx/zeuss-stopping-thunderbolt.mjs";
import oath       from "../assets/divine_fx/ithacan-peace-oath.mjs";

const FIELD_ASSET = "location.farm-battlefield-at-peace";
const D = 132;

/* ==========================================================================
   THE SET'S OWN GEOMETRY, RESTATED — identical to OD-B24-S08's copy, so the two
   scenes measure the same floor. The set keeps its depth ladder and its charge
   lanes private; both are copied verbatim, so that a station is a point ON a
   drawn lane and a body's size is the size that patch of ground is painted at.
   ========================================================================== */
const HORIZON = 0.300, NEAR_Y = 1.040;
const groundU  = y => clamp((y - HORIZON) / (NEAR_Y - HORIZON), 0, 1);
const depthAtY = y => lerp(0.070, 1.000, Math.pow(groundU(y), 1.22));
const yAtDepth = d =>
  HORIZON + (NEAR_Y - HORIZON) * Math.pow(clamp01((d - 0.070) / 0.930), 1 / 1.22);

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
   THE LOCAL PLAN — S08's, station for station, plus the peace.
   ON-LANE stations carry the lane and the parameter they were cut at (a transit
   between two of them follows the drawn lane); FIXED stations are the set's own
   exported anchors; DERIVED stations are a named fraction between two exported
   anchors, optionally dropped toward the set's own near edge.
   ========================================================================== */
const atSet = key => {
  const a = FIELD[key];
  if (!a) throw new Error(`[OD-B24-S09] the set exports no anchor "${key}"`);
  return { x:a.x, y:a.y };
};
const onLane = (lane, k) => ({ lane, k, p:lanePt(lane, k) });
const fixed  = p => ({ lane:null, k:null, p });

const GATE    = atSet("threshold:farm-gate");
const DOOR    = atSet("farm:house-door");
const CLASH   = atSet("clash:line");
const LINE_P  = atSet("line:people");
const LINE_H  = atSet("line:household");
const STAND_P = atSet("stand:people");
const STAND_H = atSet("stand:household");
const SCAR    = atSet("mark:bolt-scar");
const NEAR    = atSet("field:near");

const between = (a, b, f) => ({ x:lerp(a.x, b.x, f), y:lerp(a.y, b.y, f) });
/* the same point brought `f` of the way toward the set's own near edge. x is
   held: this ground is 13:1 and pulling x toward centre with depth (the way
   project() does) would swing a running man sideways across the field. */
const drop = (p, f) => ({ x:p.x, y:lerp(p.y, NEAR.y, f) });

const GROUND = {
  /* ---- FIXTURES: surveyed, never occupied ------------------------------- */
  steading:    fixed(DOOR),
  herm:        fixed(atSet("marker:herm")),
  road_out:    fixed(atSet("exit:road")),
  fields_e:    fixed(atSet("exit:fields")),
  disperse_out:fixed(atSet("exit:disperse")),
  band_c:      fixed(CLASH),
  line_p:      fixed(LINE_P),
  line_h:      fixed(LINE_H),
  stand_p:     fixed(STAND_P),
  stand_h:     fixed(STAND_H),
  scar:        fixed(SCAR),
  oath_ring:   fixed(atSet("oath:circle")),
  /* ---- THE MILITIA LANE: the road in, and the road back out -------------- */
  road_lip:    onLane("people", 0.22),
  road_hold:   onLane("people", 0.38),
  lane_p_mid:  onLane("people", 0.58),
  point:       onLane("people", 0.90),
  /* ---- THE HOUSEHOLD LANE ------------------------------------------------ */
  gate_mouth:  fixed(GATE),
  lane_h_foot: onLane("household", 0.80),
  /* ---- S08'S STANDING PLACES, unchanged so the handoff needs no map ------ */
  arm_l:       fixed(atSet("meet:household_l")),
  arm_r:       fixed(atSet("meet:household_r")),
  mentor:      fixed(between(GATE, LINE_H, 0.46)),
  cast:        fixed(LINE_H),
  near_lane:   fixed(drop(LINE_H, 0.52)),
  charge_n:    fixed(drop(LINE_P, 0.66)),
  charge_f:    fixed(drop(between(LINE_H, STAND_H, 0.55), 0.24)),
  /* ---- THE PEACE ---------------------------------------------------------
     `pursue` is the one place the last charge reaches: .30 of the way from the
     militia's own front line toward the militia's stand, dropped .34 toward the
     near edge — up-field and left of `charge_n`, which is a man going further
     in, and 143 stage px clear of the point of the wedge he is going for.
     `parley_l`/`parley_r` and `oath_l`/`oath_r` and `house_l`/`house_r` are the
     set's three authored contact pairs, used as pairs. */
  pursue:      fixed(drop(between(LINE_P, STAND_P, 0.30), 0.34)),
  before_scar: fixed(atSet("halt:before-scar")),
  parley_l:    fixed(atSet("meet:parley_l")),
  parley_r:    fixed(atSet("meet:parley_r")),
  oath_l:      fixed(atSet("meet:oath_l")),
  oath_r:      fixed(atSet("meet:oath_r")),
  house_l:     fixed(atSet("meet:household_l")),
  house_r:     fixed(atSet("meet:household_r")),
};

export const laertesFieldAtPeace = makePlan({
  id:"laertes-farm-field-peace",
  name:"The open ground below Laertes's steading — the fight stopped, the ring struck",
  notes:"Local plan for OD-B24-S09, cut off location.farm-battlefield-at-peace's " +
        "own charge-lane polylines and its own exported anchors, and reproducing " +
        "every station of OD-B24-S08's plan under the same name and the same " +
        "derivation so the inherited occupancy needs no translation map. z IS " +
        "the set's depthAtY() at the station, because project() bottoms out at " +
        "y .5288 and its 1.7:1 falloff cannot carry a 13:1 landscape whose " +
        "horizon is at y .300. Added here: `pursue`, the near-ground point the " +
        "last charge reaches, and the three authored contact pairs the peace is " +
        "made on — `before_scar` on the field's centre line, " +
        "`oath_l`/`oath_r` either side of the ring's slab, `house_l`/`house_r` " +
        "at the household's stand. `steading`, `herm`, `road_out`, `fields_e`, " +
        "`disperse_out`, `band_c`, `line_p`, `line_h`, `stand_p`, `stand_h`, " +
        "`scar` and `oath_ring` are survey references, not standing places. " +
        "`house_l`/`house_r` are the same two coordinates as S08's " +
        "`arm_l`/`arm_r`, kept under both names: S08's name says what they were " +
        "for then (weapons changing hands), this one says what they are for now.",
  stations:Object.fromEntries(Object.entries(GROUND).map(([k, g]) => [k, {
    x:+clamp(g.p.x, 0, 1).toFixed(4),
    z:+depthAtY(g.p.y).toFixed(4),
  }])),
  fixtures:[
    { id:"farm_gate",   kind:"threshold", at:"gate_mouth"   },
    { id:"steading",    kind:"building",  at:"steading"     },
    { id:"herm",        kind:"marker",    at:"herm"         },
    { id:"clash_band",  kind:"terrain",   at:"band_c"       },
    { id:"bolt_scar",   kind:"mark",      at:"scar"         },
    { id:"parley",      kind:"meeting",   at:"parley_l"     },  // surveyed, never used
    { id:"halt_stance", kind:"stance",    at:"before_scar"  },
    { id:"oath_ring",   kind:"ring",      at:"oath_ring"    },
    { id:"disperse",    kind:"exit",      at:"disperse_out" },
  ],
});

/* ---- the set's ground, resolved off blockingAt's own from/to/u ------------ */
const G = name => {
  const g = GROUND[name];
  if (!g) throw new Error(`[OD-B24-S09] station "${name}" has no ground`);
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
   FIGURE SIZE — S08's calibration, unchanged. BOX .58 solves .9·BOX·depthAtY(.462)
   against the set's own farm gate (a door a man walks through), and figure-hero
   stands a body with its feet at .905 of the box it is given, so FOOT pushes the
   box down by exactly that fraction and the SOLE lands on the station.
   ========================================================================== */
const MAN  = 0.58;
const FOOT = 0.095;
const boxOf   = p => MAN * sizeOf(p);
const standOn = p => {
  const g = groundOf(p);
  return { anchor:{ x:g.x, y:g.y + FOOT * boxOf(p) }, scale:boxOf(p) };
};
const manH = y => 0.9 * MAN * depthAtY(y);

/* ==========================================================================
   THE MILITIA'S OWN LAW, RESTATED — S08's copy, made formation-aware.
   slots() reads row 0 of FORM_TABLE for the point of the formation, and that row
   is a different nx in every formation. All four rows this scene uses are BAND 2,
   so the lead's ny and its size are identical across the flips and the plate
   never resizes when the formation changes — only its x-registration moves.
   ========================================================================== */
const MILITIA_SEED = 2408;
const BAND_Y  = [0.588, 0.702, 0.854];
const BAND_S  = [162, 200, 240];
const LEAD_ROW = {                        // FORM_TABLE row 0, per formation
  wedge:[0.740, 2], column:[0.782, 2], "broken-line":[0.782, 2], rout:[0.628, 2],
};
const MEMBER_X0 = 0.075;                  // slots() clamps nx to .075 .. .845
const JIT = (() => { const R = rnd(MILITIA_SEED >>> 0), j = [];
                     for (let i = 0; i < 12; i++) j.push(R()); return j; })();
const leadSlot = (formation, spread) => {
  const [bx, band] = LEAD_ROW[formation] || LEAD_ROW.wedge;
  return {
    nx: clamp(0.500 + (bx - 0.500)*spread + (JIT[0] - 0.5)*0.018, 0.075, 0.845),
    ny: clamp(BAND_Y[band] + (JIT[5] - 0.5)*0.030, 0.560, 0.878),
    s:  BAND_S[band] * (0.925 + 0.150*JIT[9]),
  };
};
/* THE SHEET is solved ONCE, on the wedge at spread 1 and at `point` — the same
   arithmetic S08 ran, so this is physically the same sheet of men. Height: the
   back band must stand where the ground paints a man BAND_S[0]/BAND_S[2] the size
   of the front one. Width: the last man lands at frame x .040 with the point on
   `point`. */
const TAIL_X = 0.040;
function plateSheet(W, H){
  const L = leadSlot("wedge", 1);
  const yP = G("point").p.y, dP = depthAtY(yP);
  const K  = (manH(yP) * H) / (0.95 * L.s);
  const yF = yAtDepth(dP * BAND_S[0] / BAND_S[2]);
  const dh = (yP - yF) * H / (L.ny - BAND_Y[0]);
  const dw = (G("point").p.x - TAIL_X) * W / (L.nx - MEMBER_X0);
  return { w: dw / K, h: dh / K };
}
/* the live rect: the plate is fitted so the CURRENT formation's own lead slot
   lands on the militia's blocked ground, at the size this ground paints a man. */
function plateRect(W, H, g, formation, spread){
  const L = leadSlot(formation, spread), S = plateSheet(W, H);
  const K  = (manH(g.y) * H) / (0.95 * L.s);
  const dw = K * S.w, dh = K * S.h;
  return { dx: g.x*W - L.nx*dw, dy: g.y*H - L.ny*dh, dw, dh,
           sw: Math.round(S.w), sh: Math.round(S.h) };
}

/* ==========================================================================
   THE TWO INSTRUMENTS, SOLVED AGAINST THIS SET
   Both numbers below are read off the modules' own exported anchors and params,
   not measured by eye, so if either module moves its geometry this scene moves
   with it.
   ========================================================================== */
/* placeInstance puts a box of w=S·W, h=S·H with its CENTRE at anchor.x and its
   BOTTOM at anchor.y. A point (fx,fy) inside that box therefore lands at
   ( ax + S·(fx-0.5), ay - S·(1-fy) ). Invert it for the bolt's own target. */
const BOLT_TGT = bolt.anchors["target:ground"];        // (.380,.780) in fx space
const BOLT_S   = 0.92;
const BOLT_X   = SCAR.x + BOLT_S * (0.5 - BOLT_TGT.x);
const BOLT_Y   = SCAR.y + BOLT_S * (1 - BOLT_TGT.y);

/* the oath plate's own content extent, measured off its params rather than
   guessed: the discs' top and the knot's foot. Its box is forced to the stage
   aspect, so a radius given as a fraction of W is W/H as much of H. */
const OP = oath.params, AR = 1120 / 760;
const OATH_TOP = OP.discCy - OP.discR * AR;            // .0265 of the box
const OATH_BOT = OP.knotCy + OP.knotS * AR;            // .3115 of the box
const OATH_S   = 0.52;
const OATH_X   = 0.50;
const OATH_Y   = 0.040 + OATH_S * (1 - OATH_TOP);      // content top at y .040

/* ==========================================================================
   CONTINUITY IN — the same field, the same five bodies, no translation.
   OD-B24-S08 ends on this ground with ATHENA on `mentor`, EUPITHES struck on
   `point`, LAERTES on `cast`, ODYSSEUS on `charge_n` and TELEMACHUS on
   `charge_f`. Every one of those stations exists in this plan under the same
   name and is derived from the same set anchor, so brief section F does not
   apply and NOBODY IS DROPPED: this scene opens on S08's last frame exactly.
   The militia is not in that occupancy because S08 fitted its plate to Eupithes
   rather than blocking it; it enters this file's MOVES table from `point`, which
   is the station S08's fitting left its lead slot standing on.
   ========================================================================== */
import { exitOccupancy as INITIAL } from "./OD-B24-S08.mjs";

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   · ATHENA comes down off `mentor` onto `before_scar` — the set's own
     `halt:before-scar`, the stance a pursuit is stopped from — and calls the
     halt from there. The bolt then lands on `scar`, on her own x and 52 stage
     px up-field of her soles, which is what "before her feet" is on a 13:1
     ground: the scoured disc opens between her and the men she is shouting at.
     She holds that stance through the whole arrest and then comes straight
     down the centre line onto `oath_r`.
   · ODYSSEUS makes one more charge, `charge_n` -> `pursue`: further in and to
     the left, at the men who are turning. He never reaches them. From t=40 he is
     stopped, and from t=86 he walks up out of the near-left ground onto `oath_l`,
     the stone he is already standing beside.
   · THE MILITIA turns at `point` and goes back up its own drawn lane, through
     `lane_p_mid` to `road_hold` — .38 of the way along the lane, at the lip of
     the town road they marched in on. A transit between two stations cut on the
     SAME lane interpolates that lane's parameter, so they retreat along the
     chevrons the set painted, not across the field.
   · LAERTES and TELEMACHUS come off the fighting line onto their own stand,
     `house_l`/`house_r`, and ground what they were carrying.
   · EUPITHES does not move. He is dead on `point`.

   NOBODY SHARES A STATION EXCEPT BY CONSTRUCTION. The militia and Eupithes both
   hold `point` until t=42, and that is the ensemble contract, not a collision:
   with `showLead:false` the module's point slot is VACATED, so there is exactly
   one body and one hole and they are the same place — S08's arrangement, held
   one scene longer. The tightest paper gap between two drawn silhouettes at any
   t is 4 px, between Laertes and Telemachus on the household pair (the same pair
   S08 stood Odysseus and Telemachus on for its first sixty seconds), and they
   are 7 px apart in ground height with the queue sorting them. The last frame
   reads left to right as six separated things on six ground lines: the thinned
   plate on the road (feet y .55..0.61), the two grave mounds and the scar in the
   middle distance, the king on the ring's left stone (feet y .938), Mentor on its
   right (y .922), and the old king and his grandson on the household stand
   (y .812 and .802). */
const MOVES = [
  // the god comes down between the lines, then crosses and takes the ring
  { who:"athena",     from:"mentor",    to:"before_scar",t0:10, t1:22 },
  { who:"athena",     from:"before_scar",to:"oath_r",    t0:70, t1:90 },
  // one more charge, and then the long walk to the stone
  { who:"odysseus",   from:"charge_n",  to:"pursue",     t0:26, t1:40 },
  { who:"odysseus",   from:"pursue",    to:"oath_l",     t0:86, t1:104 },
  // the vendetta goes back up the road it came down
  { who:"militia",    from:"point",     to:"lane_p_mid", t0:42, t1:72 },
  { who:"militia",    from:"lane_p_mid",to:"road_hold",  t0:72, t1:100 },
  // the house comes off the line onto its own ground
  { who:"laertes",    from:"cast",      to:"house_l",    t0:58, t1:76 },
  { who:"telemachus", from:"charge_f",  to:"house_r",    t0:60, t1:78 },
];

/* --- THE MASTER CLOCK ----------------------------------------------------- */
const SHOUT = 16;      // she cries out for both sides to stop
const STRIKE = 22;     // the bolt lands: the command becomes irresistible
const TURN = 34;       // the Ithacans break and go
const CHECK = 40;      // the king is pulled up short
const SEP = 56;        // the sides drawn apart; the dead carried out of the lane
const RING = 80;       // the ring struck in
const SWEAR = 96;      // the oath begins to bind
const PEACE = 112;     // the lanes going back to grass

const fieldStateAt = t => t < STRIKE ? "charge" : t < SEP ? "halt"
                        : t < RING ? "separation" : t < PEACE ? "oath" : "peace";
const BASE_LAYERS = ["sky","hills","ground","fields","farm","trees","band","lanes"];
function fieldLayersAt(t){
  const L = [...BASE_LAYERS];
  if (t >= STRIKE) L.push("fallen", "scar");
  if (t >= SEP)    L.push("stands", "arms");
  if (t >= RING)   L.push("ring");
  return L;
}

/* the militia, as four continuous ramps and one flip, put at t=34 where the
   plate is still standing still */
const militiaAt = t => ({
  formation: t < TURN ? "wedge" : "rout",
  phase:     t < TURN ? "collide" : "rout",
  /* the shock front is already all the way back through the ranks when this
     scene opens — S08 spent it — and it runs again on the shout */
  wave:      t < SHOUT ? 1.30 : lerp(1.30, 0.42, clamp01((t - SHOUT) / 44)),
  waveLag:   0.68,
  /* every head on the goddess while she is speaking; on the road after that */
  attention: t < SHOUT ? 0.34
           : t < TURN  ? lerp(0.34, 0.94, clamp01((t - SHOUT) / 12))
           : lerp(0.94, 0.12, clamp01((t - TURN) / 40)),
  spread:    lerp(1.10, 1.00, clamp01((t - TURN) / 46)),
  density:   lerp(1.00, 0.70, clamp01((t - 42) / 58)),
  leaderDown:1,
});

/* the bolt: one event, four ramps and a fork that is open for seven seconds */
const boltAt = t => ({
  live:      t >= SHOUT - 2 && t < SEP,
  t:         clamp01((t - (SHOUT - 2)) / 26) * 3.4,
  intensity: clamp01((t - (SHOUT - 2)) / 8),
  charge:    t < STRIKE ? clamp01((t - (SHOUT - 2)) / 8)
                        : lerp(1.0, 0.42, clamp01((t - STRIKE) / 18)),
  strike:    t < STRIKE ? 0 : 1 - clamp01((t - STRIKE) / 12),
  burn:      clamp01((t - STRIKE) / 4),
  freeze:    clamp01((t - STRIKE) / 8),
  smoke:     clamp01((t - STRIKE - 2) / 14) * (1 - clamp01((t - (SEP - 10)) / 10)),
  advance:   1.0,
});

/* the covenant: hooks open when she starts, interlocked when the poem ends */
const oathAt = t => ({
  live:      t >= RING - 4,
  t:         clamp01((t - (RING - 4)) / 40) * 2.7,
  intensity: lerp(0.20, 1.25, clamp01((t - (RING - 4)) / 34)),
  bind:      clamp01((t - SWEAR) / 22),
});

export const scene = {
  id:"OD-B24-S09",
  title:"Athena Makes Peace",
  book:24,
  plan:"laertes-farm-field-peace",
  duration:D,
  beats:[
    "Athena cries out for both sides to stop and tells the Ithacans to disperse without more blood.",
    "Zeus hurls a thunderbolt before her feet, making the command irresistible.",
    "Odysseus attempts one more charge until Athena restrains and redirects him.",
    "She establishes binding oaths between king and people in Mentor's form.",
    "The poem ends with the household restored and the violence converted into civic peace.",
  ],
  exitState:"On the open ground below Laertes's steading, the field in its last " +
    "state `peace`: both charge lanes sown with stubble ticks and going back to " +
    "grass, the dropped kit picked up off the ground, and what is left standing " +
    "is what the fight converted into — the SCAR before Athena's feet, a scoured " +
    "disc with a fused black centre and a star of cracks, the only full black on " +
    "the open field; TWO GRAVE MOUNDS drawn out of the lane, one of them " +
    "Eupithes, who called the muster and was the first man down in it; THE " +
    "GROUNDED ARMS, three tripods of stacked spears with shields set on their " +
    "rims, at the people's stand, at the household's, and between them; and THE " +
    "OATH RING, near and large, a swept disc inside a ring of set stones with " +
    "the oath slab at its middle. ODYSSEUS stands on `oath_l`, the ring's left " +
    "stone, hand raised, still king and no longer at war with his own island. " +
    "ATHENA stands on `oath_r`, the right stone, facing him, still in Mentor's " +
    "grey — the covenant is sworn to a neighbour's face and not to a goddess's, " +
    "which is the whole of why she keeps the disguise on to the last line. " +
    "LAERTES and TELEMACHUS hold the household stand, `house_l` and `house_r`, " +
    "three generations of the house alive on their own ground at once. THE " +
    "MILITIA is a thinned rout of six on `road_hold`, .38 of the way up the " +
    "lane it charged down, halted at the lip of the town road with its wedge " +
    "gone and the hole where its point used to walk still open in it. EUPITHES " +
    "is no longer a figure: from the separation he is the set's own furniture, " +
    "the mound. The vendetta is over, the poem is over, and nothing on this " +
    "ground is moving.",
  exitOccupancy:occupancyAt(laertesFieldAtPeace, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{
    athena:"t=0, already on `mentor`, between the two lines — OD-B24-S08 left " +
           "her there with Zeus's order in her hands and unspent",
    odysseus:"t=0, already on `charge_n`, in among the militia's front rank on " +
             "the near ground",
    laertes:"t=0, already on `cast`, the household's front line, the shaft gone",
    telemachus:"t=0, already on `charge_f`, on the near right",
    eupithes:"t=0, already on `point`, struck — he does not enter, he is what " +
             "the scene has to stop happening again",
    militia_01:"t=0, fitted to `point` — S08 hung this plate off Eupithes and " +
               "left its lead slot on that ground; here the plate is blocked in " +
               "its own right and walks away from him",
    bolt_01:"t=14, the sky aperture opening at frame (.710,.142); the fork " +
            "lands at t=22 on the set's own `mark:bolt-scar`",
    oath_01:"t=76, in the open sky above the far range: the two sworn discs " +
            "face each other with the yoke beams down and the hooks open",
  },
  exits:{
    athena:"none — `oath_r`, the ring's right stone, in Mentor's grey",
    odysseus:"none — `oath_l`, the ring's left stone, hand raised",
    laertes:"none — `house_l`, the household stand",
    telemachus:"none — `house_r`, beside him",
    eupithes:"t=56 — hidden at the separation flip, carried out of the lane. " +
             "The set's `fallen` layer takes him over from that frame: the mound " +
             "at (.352,.660) is him, and furniture is what the set draws instead " +
             "of a body",
    militia_01:"none — `road_hold`, halted at the lip of the town road, six men " +
               "left of nine",
    bolt_01:"t=56 — the smoke is out and the effect leaves. The MARK does not: " +
            "the set owns the scar and it is on that ground in the last frame",
    oath_01:"none — it is a STATE, not an event; the knot stays interlocked",
  },
  walkable:"the standing stations of the local plan `laertes-farm-field-peace` " +
           "and nothing else: the militia lane (`road_lip`, `road_hold`, " +
           "`lane_p_mid`, `point`), the household lane (`gate_mouth`, " +
           "`lane_h_foot`), `mentor`, `cast`, `charge_n`, `charge_f`, " +
           "`near_lane`, `pursue`, `before_scar` (the set's own halt stance, " +
           "the one place a god stops a pursuit from), and the two authored " +
           "contact pairs that are actually stood on — `oath_l`/`oath_r` and " +
           "`house_l`/`house_r`, the second of which is S08's `arm_l`/`arm_r` " +
           "under its peacetime name. The steading, the herm, the town road, " +
           "the east fields, the marked dispersal exit, the clash band, the two " +
           "front lines, the two stands, the scar, the ring's centre and BOTH " +
           "HALVES OF THE PARLEY PAIR are FIXTURES: the parley never happens, " +
           "so the pair S08 surveyed for it stays empty. blockingAt() throws on " +
           "anything else. THE DASHED DISPERSAL LANE IS DRAWN AND NOT WALKED: it " +
           "is the set's mark for the way home off the near-left corner, and a " +
           "plate walked down it would be at depth .75 by its second station — " +
           "the militia would leave the field by growing to twice the size of " +
           "the king. They go back up the lane they charged down, which recedes, " +
           "and dispersal on a 13:1 ground is something that gets smaller.",
  depthOrder:"the set paints the field first, back to front, in the layer list " +
             "its state has earned by that second — sky, the far range, the " +
             "ground, the perspective plots and hedges, the steading on its " +
             "terrace, the orchard canopies, the churned clash band in three " +
             "pieces, the lanes with their chevrons, then (from the strike) the " +
             "fallen and the scar, then (from the separation) the two swept " +
             "stands and the grounded arms, then (from t=80) the oath ring. Then " +
             "ONE queue sorted by the ground line each thing stands on, far " +
             "first: the oath plate at the sky line, the militia plate at its own " +
             "back rank's ground line, Eupithes at the point, Laertes, " +
             "Telemachus, Athena, the bolt at the scar's own ground line, and " +
             "Odysseus on the near ground. Then the set AGAIN for its declared " +
             "front layer — the near olive, the corner stone run and the near " +
             "tussocks — so the ring and the king pass behind them.",
  gazeTargets:{
    athena:"the militia, across the width of the field, from the moment she " +
           "comes off `mentor` onto `before_scar` — she is talking to them and " +
           "to nobody else; then " +
           "one look up at the sky her father just used; then Odysseus, held, " +
           "while she turns him; then, from the ring, the king's raised hand",
    odysseus:"the front rank of the wedge, level, all the way through the charge; " +
             "then the bolt scar at his feet; then Mentor, and only Mentor",
    laertes:"the place Eupithes was standing; then his son; then the ring",
    telemachus:"his father, then the ring",
    eupithes:"nothing. His gaze is the one in this scene that is not a target",
    militia_01:"every head on the goddess at `attention` .94 while she speaks; " +
               "the turn takes them off her and onto the road",
  },
  attachments:[
    { at:  0, who:"field_01",   change:"state CHARGE — the frame S08 handed over" },
    { at: 10, who:"athena",     change:"coming down off `mentor` between the lines" },
    { at: 16, who:"athena",     change:"COMMAND — arm out across the field: hold, " +
      "Ithacans, and go home without more blood" },
    { at: 20, who:"militia_01", change:"every head on her — the wedge stops " +
      "driving and the shock front runs again" },
    { at: 22, who:"bolt_01",    change:"THE FORK — it lands in the dirt before " +
      "her feet and strikes nobody" },
    { at: 22, who:"field_01",   change:"state HALT — the scar struck, the kit " +
      "lying where it fell out of their hands" },
    { at: 26, who:"odysseus",   change:"CONFRONTATION — one more charge, at the " +
      "men who are turning" },
    { at: 34, who:"militia_01", change:"ROUT — the arms fall out of their hands " +
      "and they turn and go back up the road" },
    { at: 40, who:"athena",     change:"MARSHAL — she stops him with a word" },
    { at: 40, who:"odysseus",   change:"pulled up short: LEAN BACKWARD, the charge " +
      "cut off at the knee" },
    { at: 52, who:"odysseus",   change:"TORSO OPEN — redirected; the hands come " +
      "off the weapon" },
    { at: 56, who:"field_01",   change:"state SEPARATION — the two stands lit, " +
      "the arms stacked, the way home dashed off the near-left corner" },
    { at: 56, who:"eupithes",   change:"carried out of the lane — the set's " +
      "`fallen` layer takes the body over as a mound" },
    { at: 76, who:"oath_01",    change:"the two parties entered, the yoke beams " +
      "down, the hooks open" },
    { at: 80, who:"field_01",   change:"state OATH — the ring struck in around " +
      "its slab" },
    { at: 96, who:"odysseus",   change:"ONE ARM RAISED — the king swears" },
    { at: 96, who:"athena",     change:"ONE ARM RAISED — and Mentor swears back" },
    { at: 96, who:"oath_01",    change:"BINDING — the two hooks slide together" },
    { at:112, who:"field_01",   change:"state PEACE — the lanes going back to " +
      "grass, the kit picked up, the ring and the mounds left standing" },
  ],
  sound:[
    { at: 4, source:"point",      cue:"the sound the palace made, again, outdoors" },
    { at:16, source:"before_scar",cue:"one voice over a field, and every man on it hears it" },
    { at:22, source:"scar",       cue:"the sky splitting once, close, and no thunder after" },
    { at:26, source:"charge_n",   cue:"a man running who should not be" },
    { at:30, source:"lane_p_mid", cue:"iron hitting grass, nine times, not thrown down" },
    { at:40, source:"before_scar",cue:"his own name, said flatly" },
    { at:58, source:"stand_h",    cue:"spears going up into a tripod" },
    { at:80, source:"oath_ring",  cue:"stones being set, and one slab dropped level" },
    { at:96, source:"oath_ring",  cue:"two men swearing the same words at the same time" },
    { at:120,source:"road_out",   cue:"an island, in the afternoon, with nobody fighting on it" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"oath" },
    { asset:"divine-fx.ithacan-peace-oath", instance:"oath_01",
      anchor:{x:OATH_X,y:OATH_Y}, scale:OATH_S },
    { asset:"ensemble.revenge-militia", instance:"militia_01",
      anchor:{x:.15,y:.61}, scale:.42, pose:"routed" },
    { asset:"character.eupithes", instance:"eupithes",
      anchor:{x:.417,y:.715}, scale:.286, band:"threeq", pose:"eup_struck" },
    { asset:"character.laertes", instance:"laertes",
      anchor:{x:.756,y:.845}, scale:.385, band:"threeq", pose:"lae_doubting" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.844,y:.834}, scale:.380, band:"threeq", pose:"lean_forward" },
    { asset:"character.athena-as-mentor", instance:"athena",
      anchor:{x:.582,y:.968}, scale:.477, band:"threeq", pose:"mentor_still" },
    { asset:"divine-fx.zeuss-stopping-thunderbolt", instance:"bolt_01",
      anchor:{x:BOLT_X,y:BOLT_Y}, scale:BOLT_S },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.418,y:.985}, scale:.489, band:"threeq", pose:"confrontation" },
  ],

  timeline:[
    // 1 — the goddess comes down and calls the halt
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"odysseus",   at: 0.0, args:{ gaze:{ x:-.52, y:.02 } } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"confrontation" } },
    { op:"actor.gaze", target:"telemachus", at: 0.0, args:{ gaze:{ x:-.48, y:.04 } } },
    { op:"actor.pose", target:"laertes",    at: 0.0, args:{ pose:"lae_doubting" } },
    { op:"actor.gaze", target:"laertes",    at: 0.0, args:{ gaze:{ x:-.44, y:.10 } } },
    { op:"actor.pose", target:"athena",     at: 0.0, args:{ pose:"mentor_marshal" } },
    { op:"actor.gaze", target:"athena",     at: 0.0, args:{ gaze:{ x:-.40, y:.10 } } },
    { op:"actor.pose", target:"eupithes",   at: 0.0, args:{ pose:"eup_struck" } },
    { op:"actor.gaze", target:"eupithes",   at: 0.0, args:{ gaze:{ x:-.30, y:-.34 } } },
    { op:"actor.pose", target:"athena",     at:10.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"athena",     at:16.0, args:{ pose:"mentor_command" } },
    { op:"actor.gaze", target:"athena",     at:16.0, args:{ gaze:{ x:-.50, y:.02 } } },
    // 2 — the bolt
    { op:"fx.play",    target:"bolt_01",    at:22.0, args:{ dir:"strike" } },
    { op:"actor.gaze", target:"athena",     at:22.0, args:{ gaze:{ x:.16, y:-.62 } } },
    { op:"actor.gaze", target:"laertes",    at:24.0, args:{ gaze:{ x:-.18, y:.26 } } },
    // 3 — one more charge, and the god who stops it
    { op:"actor.pose", target:"odysseus",   at:26.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze", target:"odysseus",   at:26.0, args:{ gaze:{ x:-.54, y:.04 } } },
    { op:"actor.pose", target:"athena",     at:40.0, args:{ pose:"mentor_marshal" } },
    { op:"actor.gaze", target:"athena",     at:40.0, args:{ gaze:{ x:-.28, y:.22 } } },
    { op:"actor.pose", target:"odysseus",   at:40.0, args:{ pose:"lean_backward" } },
    { op:"actor.gaze", target:"odysseus",   at:40.0, args:{ gaze:{ x:-.10, y:.44 } } },
    { op:"actor.pose", target:"odysseus",   at:52.0, args:{ pose:"torso_open" } },
    { op:"actor.gaze", target:"odysseus",   at:52.0, args:{ gaze:{ x:.30, y:.06 } } },
    { op:"actor.hide", target:"eupithes",   at:56.0, args:{} },
    // 4 — the house comes off the line; the god crosses to the ring
    { op:"actor.pose", target:"laertes",    at:58.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"athena",     at:58.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"telemachus", at:60.0, args:{ pose:"walk_neutral" } },
    { op:"actor.pose", target:"laertes",    at:76.0, args:{ pose:"lae_examining" } },
    { op:"actor.gaze", target:"laertes",    at:76.0, args:{ gaze:{ x:-.30, y:.16 } } },
    { op:"actor.pose", target:"telemachus", at:78.0, args:{ pose:"listening" } },
    { op:"actor.gaze", target:"telemachus", at:78.0, args:{ gaze:{ x:-.34, y:.14 } } },
    { op:"actor.pose", target:"athena",     at:86.0, args:{ pose:"mentor_counsel" } },
    { op:"actor.gaze", target:"athena",     at:86.0, args:{ gaze:{ x:-.36, y:.04 } } },
    { op:"actor.pose", target:"odysseus",   at:86.0, args:{ pose:"walk_neutral" } },
    // 5 — the oath, and the end of the poem
    { op:"fx.play",    target:"oath_01",    at:96.0, args:{ dir:"bind" } },
    { op:"actor.pose", target:"odysseus",   at:96.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"odysseus",   at:96.0, args:{ gaze:{ x:.34, y:.00 } } },
    { op:"actor.pose", target:"athena",     at:96.0, args:{ pose:"one_arm_raised" } },
    { op:"actor.gaze", target:"athena",     at:96.0, args:{ gaze:{ x:-.34, y:.00 } } },
    { op:"actor.pose", target:"laertes",    at:104.0,args:{ pose:"torso_open" } },
    { op:"actor.pose", target:"telemachus", at:104.0,args:{ pose:"torso_open" } },
    { op:"timeline.capture", target:"OD-B24-S09", at:126.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s    = stateAt(scene, t);
    const blk  = blockingAt(laertesFieldAtPeace, MOVES, t, INITIAL);
    const prog = Math.min(.96, .06 + .88*(t/D));
    const mil  = militiaAt(t);
    const bl   = boltAt(t);
    const ot   = oathAt(t);
    const mode = fieldStateAt(t);
    const statusWord = t < STRIKE ? "HOLD, ITHACANS" : t < CHECK ? "STRUCK"
                     : t < SEP ? "TURNED BACK" : t < RING ? "ARMS GROUNDED"
                     : t < PEACE ? "SWEARING" : "PEACE";

    /* --- THE FIELD, back and ground layers ------------------------------ */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:mode, t:0.42, progress:prog,
              layers:fieldLayersAt(t), status:statusWord },
    });

    /* ONE queue, sorted by the ground line each thing stands on: the floor
       decides who is in front, not the order these blocks are written in. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- THE COVENANT: hung in the open sky, so it enters at the sky line - */
    if (ot.live) add(0.0, () => placeInstance(offctx, W, H, oath, {
      anchor:{ x:OATH_X, y:OATH_Y }, scale:OATH_S,
      state:{
        t:ot.t, intensity:ot.intensity, bind:ot.bind,
        link:0, forget:0, abundance:0,
        layers:["yoke","knot","parties"],
        status: ot.bind >= 1 ? "SWORN" : ot.bind > 0 ? "BINDING" : "OFFERED",
        progress:prog,
      },
    }));

    /* --- THE WEDGE, COMING APART: fitted to its own point, every frame ----
       PAD .22. The plate is a sheet exactly as tall as its own men stand, and in
       `waver` the module carries their spears up to within a few degrees of the
       vertical — a raised shaft overshoots the sheet, and a sheet drawn without
       bleed CUTS IT, which lays a hard horizontal edge the full width of the
       formation across the frame. keyedModuleCanvas's own bleed margin exists
       for exactly this ("staffs, raised arms, wings"), so the canvas is grown
       .22 of the sheet on every side and the blit is grown with it. */
    {
      const p = blk.militia, g = groundOf(p);
      const R = plateRect(W, H, g, mil.formation, mil.spread);
      const PAD = 0.22;
      add((R.dy + BAND_Y[0]*R.dh) / H, () => {
        const cv = keyedModuleCanvas(militia, R.sw, R.sh,
          { phase:mil.phase, formation:mil.formation, count:9, density:mil.density,
            spread:mil.spread, wave:mil.wave, waveLag:mil.waveLag,
            attention:mil.attention, leaderDown:mil.leaderDown,
            /* the point is a hole, and the kit it dropped belongs to the ground */
            showLead:false, showKit:false, showRoad:false, showOpposition:false,
            layer:"full", t:(t*0.24) % 1,
            status: mil.phase === "collide" ? "COLLIDING"
                  : t < 100 ? "GOING HOME" : "DISPERSED",
            progress:prog },
          `b24s09|mil|${mil.formation}|${mil.phase}|${mil.wave.toFixed(3)}` +
          `|${mil.spread.toFixed(3)}|${mil.density.toFixed(3)}|${mil.attention.toFixed(3)}`,
          0.895, PAD);
        offctx.drawImage(cv, 0, 0, cv.width, cv.height,
          R.dx - PAD*R.dw, R.dy - PAD*R.dh, R.dw*(1 + 2*PAD), R.dh*(1 + 2*PAD));
      });
    }

    /* --- EUPITHES: the reason to stop, until the set takes him over ------- */
    if (s.eupithes && s.eupithes.visible !== false){
      const p = blk.eupithes, c = s.eupithes, g = groundOf(p);
      add(g.y, () => placeInstance(offctx, W, H, eupithes, {
        ...standOn(p),
        state:{
          t:0.5, band:"threeq",
          pose: c.pose || "eup_struck",
          gaze: c.gaze || { x:-.30, y:-.34 },
          browUp:.74, browKnit:.28, eyeWide:.80, jaw:.62,
          status:"STRUCK", progress:prog,
        },
      }));
    }

    /* --- LAERTES: the old king, off the line and onto his own ground ------ */
    {
      const p = blk.laertes, c = s.laertes || {}, g = groundOf(p);
      const staring = t < 24;
      const sworn   = t >= SWEAR;
      add(g.y, () => placeInstance(offctx, W, H, laertes, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5, band:"threeq",
          pose: c.pose || "lae_doubting",
          gaze: c.gaze || { x:-.44, y:.10 },
          browUp:   sworn ? .46 : staring ? .38 : .26,
          browKnit: staring ? .44 : .14,
          eyeNarrow:staring ? .34 : .22,
          frown:    staring ? .22 : 0,
          smile:    sworn ? .24 : 0,
          status:   sworn ? "THREE OF US" : staring ? "THE MAN HE KILLED" : "THE OLD KING",
          progress: prog,
        },
      }));
    }

    /* --- TELEMACHUS: the son, and the last of the house to stand down ----- */
    {
      const p = blk.telemachus, c = s.telemachus || {}, g = groundOf(p);
      const fighting = t < CHECK;
      const sworn    = t >= SWEAR;
      add(g.y, () => placeInstance(offctx, W, H, telemachus, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5, band:"threeq",
          pose: c.pose || "confrontation",
          gaze: c.gaze || { x:-.48, y:.04 },
          browUp:   sworn ? .34 : .14,
          browKnit: fighting ? .62 : .20,
          eyeNarrow:fighting ? .38 : .14,
          frown:    fighting ? .32 : 0,
          jaw:      fighting ? .34 : 0,
          smile:    sworn ? .20 : 0,
          status:   sworn ? "AT PEACE" : fighting ? "WITH HIS FATHER" : "STANDING DOWN",
          progress: prog,
        },
      }));
    }

    /* --- ATHENA AS MENTOR: the voice that stops it, and the oath it becomes */
    {
      const p = blk.athena, c = s.athena || {}, g = groundOf(p);
      const calling = t >= SHOUT && t < STRIKE;
      const turning = t >= CHECK && t < SEP;
      const swearing= t >= SWEAR;
      add(g.y, () => placeInstance(offctx, W, H, mentor, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5, band:"threeq",
          pose: c.pose || "mentor_marshal",
          gaze: c.gaze || { x:-.40, y:.10 },
          browUp:   calling ? .40 : swearing ? .24 : .16,
          browKnit: turning ? .50 : calling ? .28 : .12,
          eyeNarrow:turning ? .34 : .16,
          jaw:      calling ? .52 : turning ? .34 : 0,
          smile:    swearing ? .18 : 0,
          status:   swearing ? "SWORN" : turning ? "ENOUGH"
                  : calling ? "HOLD, ITHACANS" : "MENTOR",
          progress: prog,
        },
      }));
    }

    /* --- THE BOLT: fitted so its own target lands on the set's own mark --- */
    if (bl.live) add(SCAR.y, () => placeInstance(offctx, W, H, bolt, {
      anchor:{ x:BOLT_X, y:BOLT_Y }, scale:BOLT_S,
      state:{
        t:bl.t, intensity:bl.intensity, charge:bl.charge, strike:bl.strike,
        burn:bl.burn, freeze:bl.freeze, smoke:bl.smoke, advance:bl.advance,
        /* the set owns the ground, the goddess, the scar and the militia */
        layers:["aperture","smoke","bolt"],
        status: bl.strike > 0 ? "STRUCK" : t < STRIKE ? "GATHERING" : "HOLDING",
        progress:prog,
      },
    }));

    /* --- ODYSSEUS: one body, one guise, and the last charge of the poem --- */
    {
      const p = blk.odysseus, c = s.odysseus || {}, g = groundOf(p);
      const charging = t >= 26 && t < CHECK;
      const checked  = t >= CHECK && t < 52;
      const swearing = t >= SWEAR;
      add(g.y, () => placeInstance(offctx, W, H, odysseus, {
        ...standOn(p),
        state:{
          t: p.moving ? (t*0.58) % 1 : 0.5,
          guise:"restored", band:"threeq",
          pose: c.pose || "confrontation",
          gaze: c.gaze || { x:-.52, y:.02 },
          browUp:   checked ? .58 : swearing ? .22 : .08,
          browKnit: charging ? .70 : checked ? .30 : .18,
          eyeNarrow:charging ? .42 : .16,
          eyeWide:  checked ? .34 : 0,
          frown:    charging ? .36 : 0,
          jaw:      charging ? .40 : checked ? .28 : 0,
          smile:    swearing ? .16 : 0,
          status:   swearing ? "THE KING" : checked ? "STOPPED"
                  : charging ? "ONE MORE" : t < 26 ? "AT THEM" : "ITHACA",
          progress: prog,
        },
      }));
    }

    /* far → near, by the set's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());

    /* --- THE FIELD AGAIN, front layer only ------------------------------- */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:mode, t:0.42, progress:prog, layers:["fg"], status:statusWord },
    });
  },
};
export default scene;

/* named binding so a later scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
