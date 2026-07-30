/* ============================================================
   SCENE  OD-B19-S01 — The Weapons Leave the Hall
   Book XIX, scene 1 — the FIRST scene of Book XIX. ADDITIVE: creates nothing,
   modifies nothing. Shape copied from the reference scene, OD-B16-S03.mjs.

   WHAT THIS SCENE IS FOR. Books XXI and XXII depend on one fact established
   here and nowhere else: the hall is EMPTY OF ARMS. The contest, the sill, the
   slaughter, and Melanthius' two trips down the passage read as plot only if
   the audience watched the sixteen pieces go out. So this is built as a
   TRANSFER, not a tableau, and three state channels are driven off one clock:
     location.megaron-hall        day  -> night     (`night` is the state in
                                  which that module takes the arms off the
                                  walls and leaves bare pegs)
     location.weapon-storeroom    sealed -> open -> stocked
     prop.palace-weapon-collection  displayed -> counted -> transit -> stored
   They agree because they are all read off the same plan and the same t.

   ROOM. location.megaron-hall, blocked through scenes/_plans/megaron.mjs. No
   second hall is built or cast. `postern` and `storeroom` are the plan's own
   stations for the passage the arms go out through, and the storeroom is shown
   as a SECTION CUT in the left quarter of the frame — the postern wall opened
   up — so the two rooms sit on one drawing instead of being intercut. The son
   delivers at x≈.25, which is the projected `postern`: the exact line where the
   cut is. The rooms touch where the plan says they touch.

   ONE BODY, ONE GUISE. Odysseus is character.odysseus-b16 with guise:"beggar"
   held for the whole scene. In Book XIX he is the beggar in his own house;
   there is no restoration here, so there is no ramp and no cut to another
   module. The guise channel is still the only thing deciding how he looks.

   CONTINUITY IN. First scene of the book, so INITIAL is declared against the
   plan rather than imported: the suitors have just gone out (Od. 18.428),
   Odysseus is at the hearth where he sat through Book XVIII, Telemachus is on
   the right-hand bench, and the arms are on the right-hand wall where the
   hall's `day` state paints its racks. Nothing is inherited and nothing is
   dropped. CONTINUITY OUT is computed, and it carries the two men AND the two
   plan-blocked props, so the next scene — and Book XXI when it comes for the
   bow — opens with the weapons in the room they were actually carried to.

   THE LAMP. divine_fx.athenas-golden-lamp is placed as a LOCAL cutout on its
   own blocked station, not as a full-frame plate: full-frame it strafes the
   room with rays and buries the great doors under its own lamp body. Its
   `travel` channel is not hand-keyed either — it is read off the lamp's plan
   position, so the light goes before the carriers because the plan says so.
   Two of its layers are switched off deliberately. `rays` is the spoke burst,
   which at this size reads as clutter across the far wall. `watch` is the
   sightline from the women's door to Eurycleia, and its geometry is fixed in
   the fx's OWN frame — it cannot be aligned to this room's `doorway_maid`, and
   an unaligned dashed door would be a second women's door in the wrong wall.
   So Eurycleia's beat is played through a door that stays shut: she is not
   cast, because at this hour she is shut in with the maids (Od. 19.15-30) and a
   figure standing in the hall would contradict the beat it is meant to serve.
   Her line is carried by the son's status word, IT IS THE SMOKE. The goddess
   herself is never drawn: her only body in the frame is the dashed bearer-void
   hanging under a lamp that nothing is holding.

   Beats (Od. 19.1-33):
     1. The suitors are gone; Odysseus tells Telemachus every weapon must go.
     2. Athena goes before them with a golden lamp and the hall burns with it.
     3. Father and son carry shields, spears, helmets, corselets to the store.
     4. The women are shut in; the smoke is the reason given, not the truth.
     5. The hall is left bare and looks defenceless, which is the whole point.

   Verify:  node harness/render-scene.mjs scenes/OD-B19-S01.mjs --t 16
            node harness/render-scene.mjs scenes/OD-B19-S01.mjs --t 48
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp01, smooth } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field       from "../assets/location/megaron-hall.mjs";
import store       from "../assets/location/weapon-storeroom.mjs";
import odysseus    from "../assets/character/odysseus-b16.mjs";
import telemachus  from "../assets/character/telemachus.mjs";
import weapons     from "../assets/prop/palace-weapon-collection.mjs";
import lamp        from "../assets/divine_fx/athenas-golden-lamp.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 56;

/* --- CONTINUITY IN. Declared against the plan; this book has no predecessor
   scene to import from. ---------------------------------------------------- */
const INITIAL = {
  odysseus:   "hearth",
  telemachus: "bench_r1",
  lamp:       "pillar_r",
  weapons:    "bench_r2",
};

/* --- BLOCKING. Stations, not coordinates. --------------------------------
   The work is a RELAY, and the relay is what keeps the two bodies apart: the
   father strips the right-hand wall at `bench_r2` (near camera, right, inside
   the z-range where the hall paints its peg rails) and the son runs the
   diagonal `pillar_r` -> `postern` three times along the far side of the lane.
   The father then HOLDS bench_r2 to the end. He was staged walking down the
   spine to the throne, and it was wrong twice over: `throne` is a seat, and the
   hall draws a near-camera plinth and backrest across it, so a figure standing
   at that station comes out as a bust rising from the chair with no legs; and
   every clear spine station (`axe_first`, `axe_last`, `hearth`) either sits in
   the fire ring or lies directly on the son's crossing line, where the two of
   them converge. So the closing image is the emptiness between them, not a
   third position: bare pegs behind the father, the store door behind the son.
   The pair that touches — the armful going from hand to hand — resolves to
   bench_r2 / pillar_r: two DIFFERENT stations at two different depths, so the
   hand-off reads as one man behind the other and can never land on one point.
   `lamp` and `weapons` are blocked as props on the same plan, so the light and
   the inventory are continuity, not decoration. */
const MOVES = [
  // he is called off the bench and told
  { who:"telemachus", from:"bench_r1", to:"pillar_r",  t0: 3, t1: 8 },
  // the father goes to the arms on the right-hand wall
  { who:"odysseus",   from:"hearth",   to:"bench_r2",  t0:10, t1:16 },
  // three crossings of the lane, an armful each
  { who:"telemachus", from:"pillar_r", to:"postern",   t0:19, t1:25 },
  { who:"telemachus", from:"postern",  to:"pillar_r",  t0:25, t1:30 },
  { who:"telemachus", from:"pillar_r", to:"postern",   t0:31, t1:37 },
  { who:"telemachus", from:"postern",  to:"pillar_r",  t0:37, t1:42 },
  // the last armful; he ends at the store door, having just pulled it to
  { who:"telemachus", from:"pillar_r", to:"postern",   t0:46, t1:52 },
  // the light GOES BEFORE THEM and then holds the store door: it crosses the
  // lane once, early, well ahead of the first armful, and waits there for the
  // rest of the work. Blocked this way it is always ahead of the carrier
  // instead of walking the same route at the same speed — which is what makes
  // the two of them converge on one point.
  { who:"lamp",       from:"axe_first", to:"postern",  t0:12, t1:22, kind:"prop" },
  // and so do the arms
  { who:"weapons",    from:"bench_r2", to:"storeroom", t0:19, t1:52, kind:"prop" },
];

/* the hall's own state cut: `night` is the state in which this room keeps bare
   pegs instead of arms, so it is switched on the frame the LAST armful leaves
   the wall — t=46, when the son starts the final crossing. Any earlier and the
   ledger would still be counting pieces the walls no longer have. */
const BARE_AT = 46;
/* the lamp is kindled when the work is agreed and withdraws when it is done */
const LIT0 = 5, LIT1 = 11, OUT0 = 42, OUT1 = 48;
const litAt = t => t <= LIT0 ? 0
              : t <  LIT1 ? (t - LIT0) / (LIT1 - LIT0)
              : t <  OUT0 ? 1
              : t >= OUT1 ? 0
              : 1 - (t - OUT0) / (OUT1 - OUT0);

/* ---- composite helpers. Engine primitives only; no hand-drawn art. ------- */

/* SLAB — draw a whole location OPAQUELY into a rectangle of the stage, with a
   window of the module mapped onto it. This is a section cut, not a cutout:
   the storeroom really does replace the hall's left wall, because that is
   where the plan puts it. (placeInstance's full-bleed branch does the same
   thing for the whole frame; this is the same operation on a sub-rect.) */
function slab(offctx, W, H, mod, dst, win, state){
  const dx = dst.x0 * W, dy = dst.y0 * H;
  const dw = (dst.x1 - dst.x0) * W, dh = (dst.y1 - dst.y0) * H;
  const cw = dw / (win.x1 - win.x0), ch = dh / (win.y1 - win.y0);
  offctx.save();
  offctx.beginPath(); offctx.rect(dx, dy, dw, dh); offctx.clip();
  offctx.translate(dx - win.x0 * cw, dy - win.y0 * ch);
  mod.draw(offctx, cw, ch, { ...(mod.preview ? mod.preview() : {}), ...state, card:false });
  offctx.restore();
}

/* PLATE — blit a window of a whole-frame plate at 1:1 so the art keeps its own
   scale. Dropped into a stage at a small uniform scale a plate's detail clogs;
   stretched, it distorts. So the module is drawn at the size its crop demands
   and only the declared window lands. Keyed, so the room shows between its
   lines. cw/ch are given explicitly, which lets two windows of one drawing
   (the count and its census rail) come off ONE cached canvas. */
function plate(offctx, W, H, mod, cw, ch, win, dst, state, sig, thr = 0.895){
  const cv = keyedModuleCanvas(mod, cw, ch, state, sig, thr);
  offctx.drawImage(cv,
    win.x0 * cw, win.y0 * ch, (win.x1 - win.x0) * cw, (win.y1 - win.y0) * ch,
    dst.x0 * W,  dst.y0 * H,  (dst.x1 - dst.x0) * W, (dst.y1 - dst.y0) * H);
}

/* GLOW — a divine_fx as a LOCAL keyed cutout, sized and placed from the plan.
   The fx declares blend:"multiply", which is right for its full-frame iso-lux
   field: the paper core drops out and only the ink lands. It is wrong for the
   SOURCE, which is the one thing in the room made of light — multiplied, the
   lamp's own light planes come out darker than the wall behind them. So the
   source is composited normally over a dot-law key: its ink stays hard black,
   its light planes stay light, and its paper flushes away. */
function glow(offctx, W, H, mod, dst, state, sig){
  const dw = (dst.x1 - dst.x0) * W, dh = (dst.y1 - dst.y0) * H;
  const cv = keyedModuleCanvas(mod, dw, dh, state, sig, 0.895);
  offctx.drawImage(cv, dst.x0 * W, dst.y0 * H);
}

/* WHERE THE PLATES SIT.
   STORE — the section cut, the left quarter, full height. Its right edge stops
   short of the projected `postern` (x≈.254) so the son delivers AT the cut and
   never stands inside the other room's air.
   LEDGER — two windows of ONE cached drawing of the transfer diagram, both at
   1:1 so nothing is scaled down into mush and no small type is relied on:
     ARMS  the HALL column of the inventory — its four shields and six spears —
           hung high on the right wall above the peg rails, emptying slot by
           slot as the pieces cross. In this room the hall side IS the right
           side and the store is away to the left, which is why the hall column
           is the one on the wall.
     RAIL  the census, on the near floor clear of the throne and clear of the
           card's own status block: one chunky notch per piece, hollow while it
           is in the hall and solid once it is in the store. */
const STORE_DST  = { x0:0.000, y0:0.000, x1:0.215, y1:1.000 };
const STORE_WIN  = { x0:0.090, y0:0.030, x1:0.910, y1:1.000 };
const LED_CW = 858, LED_CH = 660;
const ARMS_WIN   = { x0:0.038, y0:0.168, x1:0.410, y1:0.640 };
const ARMS_DST   = { x0:0.700, y0:0.068, x1:0.985, y1:0.478 };
const RAIL_WIN   = { x0:0.050, y0:0.846, x1:0.470, y1:0.912 };
const RAIL_DST   = { x0:0.662, y0:0.898, x1:0.984, y1:0.956 };

export const scene = {
  id:"OD-B19-S01",
  title:"The Weapons Leave the Hall",
  book:19,
  plan:"megaron",
  duration:D,
  beats:[
    "The suitors have gone out for the night; Odysseus tells Telemachus every weapon must leave the hall.",
    "Athena goes before them with a golden lamp and the beams, panels and pillars burn with the light.",
    "Father and son carry shields, spears, helmets and corselets down the passage to the storeroom.",
    "Telemachus tells Eurycleia to shut the women in — the smoke has spoiled the arms, and drink makes quarrels.",
    "The hall is left bare and apparently defenceless, which is the whole point of the contest to come.",
  ],
  exitState:"The megaron is stripped: nothing hangs on the peg rails, the great doors are shut, the fire is banked, and the hall looks defenceless. All sixteen pieces are in the storeroom off the postern and the count is closed. The women are shut in behind their own door and were told the smoke had spoiled the bronze. Odysseus stands as the beggar at the stripped right-hand wall with the bare pegs behind him; Telemachus is at the postern with the store just pulled to behind him.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan or from a declared window.
     Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"day" },
    { asset:"location.weapon-storeroom", instance:"store_01",
      anchor:{x:.11,y:1.00}, scale:.22, state:"sealed" },
    { asset:"divine-fx.athenas-golden-lamp", instance:"lamp",
      anchor:{x:.66,y:.69}, scale:.30, blend:"multiply" },
    { asset:"prop.palace-weapon-collection", instance:"weapons",
      anchor:{x:.83,y:.95}, scale:.32, state:"displayed" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.79,y:.84}, scale:.46, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.telemachus", instance:"telemachus",
      anchor:{x:.66,y:.69}, scale:.44, band:"threeq", pose:"lean_forward" },
  ],

  timeline:[
    { op:"actor.pose", target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose", target:"telemachus", at: 0.0, args:{ pose:"lean_forward" } },
    { op:"prop.state", target:"weapons",    at: 0.0, args:{ mode:"displayed" } },
    { op:"actor.pose", target:"odysseus",   at: 3.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze", target:"odysseus",   at: 3.0, args:{ gaze:{ x:.34, y:-.04 } } },
    { op:"fx.play",    target:"lamp",       at:LIT0, args:{ dir:"kindle" } },
    { op:"actor.pose", target:"telemachus", at: 8.0, args:{ pose:"head_lowered" } },
    { op:"prop.state", target:"weapons",    at:10.0, args:{ mode:"counted" } },
    { op:"set.state",  target:"store_01",   at:19.0, args:{ state:"open" } },
    { op:"actor.pose", target:"odysseus",   at:16.0, args:{ pose:"reach_forward" } },
    { op:"actor.gaze", target:"odysseus",   at:16.0, args:{ gaze:{ x:.24, y:-.34 } } },
    { op:"actor.pose", target:"telemachus", at:17.0, args:{ pose:"reach_forward" } },
    { op:"prop.state", target:"weapons",    at:19.0, args:{ mode:"transit" } },
    { op:"actor.pose", target:"telemachus", at:30.0, args:{ pose:"reach_forward" } },
    { op:"actor.pose", target:"odysseus",   at:36.0, args:{ pose:"offering_hand" } },
    { op:"set.state",  target:"field_01",   at:BARE_AT, args:{ state:"night" } },
    { op:"set.state",  target:"store_01",   at:52.0, args:{ state:"stocked" } },
    { op:"actor.pose", target:"odysseus",   at:46.0, args:{ pose:"arms_crossed" } },
    { op:"actor.gaze", target:"odysseus",   at:46.0, args:{ gaze:{ x:-.30, y:-.28 } } },
    { op:"prop.state", target:"weapons",    at:52.0, args:{ mode:"stored" } },
    { op:"actor.pose", target:"telemachus", at:52.0, args:{ pose:"head_lowered" } },
    { op:"prop.state", target:"weapons",    at:55.0, args:{ mode:"sealed" } },
    { op:"timeline.capture", target:"OD-B19-S01", at:54.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st   = stateAt(scene, t);
    const blk  = blockingAt(megaron, MOVES, t, INITIAL);
    const bare = t >= BARE_AT;
    const lit  = litAt(t);

    /* 1. THE HALL. It paints the room; everything else keys onto it. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state: bare ? "night" : "day", t:0.5,
              progress:Math.min(.94, .2 + .7*(t/D)),
              status: bare ? "BANKED" : "THE HALL" },
    });

    /* --- the two prop/set state channels, READ OFF THE PLAN. The arms are a
       blocked prop; where they are decides what the store and the ledger show,
       so there is no second, hand-written table of times to drift out of step. */
    const wp = blk.weapons;
    const inStore  = !wp.moving && wp.station === "storeroom";
    const storeSt  = wp.moving ? "open" : inStore ? "stocked" : "sealed";
    const ledgerSt = wp.moving ? "transit"
                   : inStore   ? (t >= 55 ? "sealed" : "stored")
                   : (t >= 10  ? "counted" : "displayed");

    /* 2. THE STOREROOM, the section cut where the postern wall was. */
    slab(offctx, W, H, store, STORE_DST, STORE_WIN,
      { state:storeSt, t:0.4, status:"THE STORE",
        layers:["shell","ceiling","farwall","door","steps","racks","loophole","stores","aisle"] });

    /* 3. THE LAMP, on its plan position, multiplied into the room.
       travel is read off the plan and remapped onto the fx's own rail, then
       the box is placed so the fx's own lamp lands exactly on the blocked
       point and its bearer-void stands on the blocked floor line. */
    if (lit > 0.06){
      const p  = blk.lamp;
      /* the hall's traffic runs right-to-left; the fx's own rail runs
         left-to-right. So progress along the plan is mapped onto travel, not
         position: travel=0 at the head of the lane, 1 at the store door. */
      const travel = clamp01((0.500 - p.x) / (0.500 - 0.254));
      const lx = 0.300 + (0.436 - 0.300) * smooth(travel);   // the fx's own lamp x
      const wf = 0.36, hf = 0.40;                            // box, fractions of W/H
      const x0 = p.x - lx*wf, y0 = p.y - 0.868*hf;           // its floor line on the plan's
      const q = `${Math.round(lit*20)}|${Math.round(travel*20)}`;
      glow(offctx, W, H, lamp, { x0, y0, x1:x0+wf, y1:y0+hf },
        { t:t*0.5, lit, travel, veil:1, watch:0,
          layers:["void","lamp"],
          status: lit >= .98 ? "BLAZING" : "LEADING",
          progress: Math.min(.96, t/D) }, "lamp|"+q);
    }

    /* 4. THE LEDGER. Two windows, one cached drawing: the hall column of the
       inventory on the wall, and the census rail on the floor. */
    {
      const ls = { mode:ledgerSt, t:0.4, status:"THE COUNT",
                   progress:Math.min(.96, t/D) };
      plate(offctx, W, H, weapons, LED_CW, LED_CH, ARMS_WIN, ARMS_DST, ls, "led|"+ledgerSt);
      plate(offctx, W, H, weapons, LED_CW, LED_CH, RAIL_WIN, RAIL_DST, ls, "led|"+ledgerSt);
    }

    /* 5. THE TWO MEN, ordered back to front by their own blocked depth so the
       far one is never painted over the near one. */
    const draw = {
      odysseus: () => {
        const p = blk.odysseus;
        const s = st.odysseus || {};
        const working = t >= 16 && t < 40;
        const done    = t >= 46;
        placeInstance(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale:0.46 * p.scale,
          state:{
            t: p.moving ? (t*0.42) % 4 : 0.5,
            guise:"beggar", band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "three_quarter_left"),
            gaze: s.gaze || { x:.20, y:-.06 },
            browKnit: done ? .44 : working ? .26 : .34,
            eyeNarrow: done ? .40 : .28,
            browUp: t < 8 ? .30 : .12,
            smile: done ? .14 : 0,
            mouthAsym: done ? .58 : .18,
            status: done ? "DEFENCELESS" : working ? "STRIPPING THE WALL"
                  : t >= 8 ? "BY LAMPLIGHT" : "TAKE THEM DOWN",
            progress: Math.min(.96, .16 + .76*(t/D)),
          },
        });
      },
      telemachus: () => {
        const p = blk.telemachus;
        const s = st.telemachus || {};
        const told     = t >= 3 && t < 12;
        const carrying = t >= 19 && t < 52;
        const shut     = t >= 52;
        placeInstance(offctx, W, H, telemachus, {
          anchor:{ x:p.x, y:p.y }, scale:0.44 * p.scale,
          state:{
            t: p.moving ? (t*0.42) % 4 : 0.5,
            band:"threeq",
            pose: p.moving ? "walk_neutral" : (s.pose || "lean_forward"),
            gaze: s.gaze || (p.moving ? { x:-.30, y:.06 } : { x:.26, y:-.04 }),
            eyeWide:  told ? .34 : .14,
            browUp:   told ? .44 : .20,
            browKnit: carrying ? .34 : shut ? .28 : .10,
            jaw:      carrying ? .22 : 0,
            frown:    carrying ? .18 : 0,
            status:   shut ? "SHUT AND THONGED" : carrying ? "IT IS THE SMOKE"
                    : told ? "EVERY PIECE" : "WAITING",
            progress: Math.min(.96, .14 + .78*(t/D)),
          },
        });
      },
    };
    for (const who of ["odysseus","telemachus"].sort((a,b) => blk[a].d - blk[b].d))
      draw[who]();
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
