/* ============================================================
   SCENE  OD-B24-S02 — Agamemnon Hears of Penelope's Fidelity
   Book XXIV, scene 2 of the book. ADDITIVE: creates nothing, modifies nothing.
   Shape copied from the reference scene, scenes/OD-B16-S03.mjs, and from the
   outdoor variant of this book, scenes/OD-B24-S01.mjs.

   WHERE. The same place OD-B24-S01 ended: the muster ground in the meadow of
   asphodel, at the head of the road to Hades. There is no authored plan for the
   underworld, so per the brief a SMALL LOCAL plan is authored at the top of this
   file and every position resolves through it by station name. The discipline is
   kept outdoors.

   THE CAMERA HAS COME ROUND, AND THAT IS WHY THE GROUND LAW CHANGES. S01 is a
   TRANSIT: a whole road in one frame, five thresholds deep, every body read off
   the set's own way curve because the thing being shown is distance. S02 is an
   ASSEMBLY: four beats of speech between named shades, and a face is the content.
   On S01's ladder the asphodel is depth .075 — a man there is a 27-pixel smudge,
   and Agamemnon's verdict on two wives cannot be played by a smudge. So this
   scene stands the camera ON the muster ground looking back down the way: the
   road's own sky, plain, ridge, asphodel and muster ring paint the world BEHIND
   the assembly (see the layer note in stage() — the thresholds this crowd has
   already passed are behind the camera and are not drawn), and the assembly
   itself is blocked in the near field on the ordinary room law,
   engine/blocking.mjs project(), whose y band (.53 .. .96) is exactly the near
   plain the set paints under it. Nothing here is a hand-tuned anchor; every
   figure is a station name put through project().

   CONTINUITY IN — translated, not guessed. OD-B24-S01 exports a computed
   exitOccupancy over ITS plan (a road), whose station names do not exist in this
   one (an assembly ground). Per brief section F an explicit map is declared and
   the inherited occupancy is translated through it:
     muster_r      -> new_dead   (the flock Hermes delivered, still stood off)
     asphodel_edge -> chorus     (the war-dead who came down to hear)
     muster_l      -> DROPPED    (Hermes)
   HERMES IS DROPPED ON PURPOSE. S01's own exitState says the escort is
   discharged and he is no longer leading; Book XXIV never speaks of him again
   after line 100. The three named shades were inside those two crowds in S01 and
   are not in its occupancy, so they are opened here from named stations — the
   two kings already standing (Homer has them mid-conversation when the new dead
   arrive) and Amphimedon still at the edge of his own flock, which is where he
   has to be for beat 2 to be a man stepping out to speak.

   CONTACT PAIRS. Two pairs of bodies close in this scene and neither pair may
   resolve to one coordinate. (1) THE TWO KINGS debate across `aga_stand` /
   `ach_stand` — 167 stage pixels apart in x and two depth steps apart, so they
   read as facing each other and never as one body. (2) THE VERDICT: Agamemnon
   comes forward to `aga_verdict` and Amphimedon stands at `witness`, 190 pixels
   apart across the open front, with the chorus's own focus arc drawn on the
   ground between them. The chorus never enters either: it is one rank across the
   back at `chorus`, and when it comes forward at the end it comes to
   `chorus_near`, still a full depth step behind every principal.

   THE TESTIMONY IS A PANEL, NOT A SET. divine_fx.penelope-memory-tableau is a
   four-register diagram of the whole household plot — loom, beggar, contest,
   recognition — stacked down a full sheet. Blitted whole it would be a second
   background. It is cast instead as a DETAIL PLATE (the device OD-B24-S01 uses
   for the wand, and OD-B20-S03 / OD-B21-S0x before it), WINDOWED TO ONE REGISTER
   AT A TIME and hung in the sunless sky above the assembly, where the set is
   open paper. The window walks the registers on the master clock, so the panel
   is not a poster of the whole plot but the part of the story being spoken:
   loom -> beggar -> contest under Amphimedon, and the fourth register under
   Agamemnon's verdict, where the gutter thread runs into its solid terminus —
   the module's own mark for the story closing into song, which is beat 4. The
   window keeps the left gutter (x .045) because the register ordinals are cut
   there as TALLY BARS: counts as geometry, never as small type.

   TONE, AND WHY THE TWO SPEAKERS ARE CAST `solid`. The set is a bleached sunless
   plain and stays mostly paper. Every module here draws a shade translucent, and
   in the first draft that inverted the frame: a 62%-ink contour quantizes two
   levels lighter than the chorus's full-ink contour, so the CROWD behind read
   darker and harder than the principals in front of it and the whole assembly
   came out as one grey tangle. Agamemnon's and Amphimedon's modules ship the
   switch for exactly this — `solid` — so the two men who speak are given their
   hard black contour back while their interiors stay what they always were, pale
   planes with the wounds a level or two above them. That is the house look (light
   planes, dark accents, plenty of paper), not a change of character: the ghosting
   is still carried by Achilles, who keeps his translucency and his lower-body wash
   into the asphodel, and by both crowd plates. Nothing here paints a second
   ground: the chorus's own meadow and horizon are switched OFF, the flock's
   meadow / gate / bat layers are OFF, and the road paints the world. The
   chorus's travelling wave-front is OFF as well — it is a full-height dashed
   rule and would stripe the frame through the panel.

   Beats (Od. 24.99–204):
     1. Agamemnon and Achilles debate the honour of their deaths and funerals.
     2. Amphimedon tells how Penelope delayed the suitors, how Odysseus returned
        as a beggar, and how the bow contest became slaughter.
     3. Agamemnon praises Penelope's enduring intelligence and condemns
        Clytemnestra by contrast.
     4. The underworld recognizes Odysseus's household victory as a new song.

   Verify:  node harness/render-scene.mjs scenes/OD-B24-S02.mjs --t 10   (the kings)
            node harness/render-scene.mjs scenes/OD-B24-S02.mjs --t 40   (the contest)
            node harness/render-scene.mjs scenes/OD-B24-S02.mjs --t 66   (the song)
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, PAPER, INK }
  from "../engine/halfworld-engine.mjs";
import { makePlan, blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/road-to-hades.mjs";
import agamemnon  from "../assets/character/agamemnons-shade.mjs";
import achilles   from "../assets/character/achilless-shade.mjs";
import amphimedon from "../assets/character/amphimedons-shade.mjs";
import warriors   from "../assets/ensemble/warrior-shades.mjs";
import newdead    from "../assets/ensemble/suitors-shades.mjs";
import tableau    from "../assets/divine_fx/penelope-memory-tableau.mjs";

const FIELD_ASSET = "location.road-to-hades";
const D = 72;

/* ==========================================================================
   THE LOCAL PLAN — the muster ground as an assembly, in plan space
   (x 0..1 left..right, z 0..1 far..near). Read through project(): a station at
   z .50 lands at y .717 and one at z .90 at y .910, which is the near plain the
   road paints. The two crowds sit at the back, the three named shades in front.
   ========================================================================== */
export const asphodelAssembly = makePlan({
  id:"asphodel-assembly",
  name:"The muster ground in the meadow of asphodel",
  notes:"Local plan for OD-B24-S02. The camera stands on the muster ground S01 " +
        "delivered the flock to and looks back down the way, so location." +
        "road-to-hades paints the world behind the assembly while the assembly " +
        "itself is blocked on the ordinary project() law. `aga_stand`/`ach_stand` " +
        "are the kings' debate pair and `witness`/`aga_verdict` the testimony " +
        "pair; no two of them are ever one coordinate.",
  stations:{
    /* the two crowds, back */
    chorus:      { x:.48, z:.08 },   // the war-dead of Troy, one rank ON the meadow line
    chorus_near: { x:.48, z:.18 },   // they come a step forward for the acclaim
    new_dead:    { x:.06, z:.70 },   // the suitors' shades, stood off to the west
    flock_edge:  { x:.16, z:.76 },   // the near edge of that flock — where a witness starts
    /* the speaking ground, front */
    witness:     { x:.44, z:.86 },   // Amphimedon's testimony ground, open front-centre
    aga_stand:   { x:.70, z:.80 },   // Agamemnon, mid-conversation with Achilles
    aga_verdict: { x:.62, z:.90 },   // he comes forward to answer the testimony
    ach_stand:   { x:.90, z:.68 },   // Achilles, east of him, the debate pair
    ach_close:   { x:.86, z:.74 },   // he closes a step to hear the verdict
  },
  fixtures:[
    { id:"muster_ring", kind:"set_piece", at:"chorus"  },
    { id:"open_front",  kind:"ground",    at:"witness" },
  ],
});

/* one height for every standing shade, times the plan's own falloff. .46 rather
   than .34: drafted at .34 the three named shades came out the same size as the
   chorus behind them — five ranks of the same small ghost, and no scene. At .46
   a principal is about 320 stage pixels against a 118-pixel chorus member, which
   is what puts the speech in the front of the frame where it belongs. Higher
   than .50 and Agamemnon's crown crosses into the memory panel. */
const MAN = 0.46;

/* ==========================================================================
   CONTINUITY IN — translated from the road, then opened.
   ========================================================================== */
import { exitOccupancy as PREV_EXIT } from "./OD-B24-S01.mjs";

/* a station only exists in its own plan; declare the crossing explicitly.
   `muster_l` — Hermes — is deliberately absent: the escort is discharged. */
const ROAD_TO_ASSEMBLY = {
  muster_r:      "new_dead",
  asphodel_edge: "chorus",
};
const INHERITED = Object.fromEntries(
  Object.entries(PREV_EXIT || {})
    .map(([who, st]) => [who, ROAD_TO_ASSEMBLY[st]])
    .filter(([, st]) => st));

const INITIAL = {
  ...INHERITED,
  /* the three named shades were inside those crowds in S01 and are not in its
     occupancy, so they open from named stations of this plan. */
  agamemnon:  "aga_stand",
  achilles:   "ach_stand",
  amphimedon: "flock_edge",
};

/* --- BLOCKING. Stations, not coordinates. -------------------------------- */
const MOVES = [
  /* 2 — the witness steps out of his own flock onto the open front */
  { who:"amphimedon", from:"flock_edge", to:"witness",     t0:16, t1:22 },
  /* 3 — the great heart closes to hear it; the king comes forward to answer */
  { who:"achilles",   from:"ach_stand",  to:"ach_close",   t0:44, t1:50 },
  { who:"agamemnon",  from:"aga_stand",  to:"aga_verdict", t0:46, t1:52 },
  /* 4 — the dead crowd in on the new song */
  { who:"warriors",   from:"chorus",     to:"chorus_near", t0:60, t1:68 },
];

/* ==========================================================================
   THE TWO CROWD PLATES
   Both ensembles are whole-frame drawings, not figures placeInstance can size:
   each lays its members out across its own sheet. So each is blitted into a RECT
   computed from its station, with the plate's own reference line put on the
   station's ground.

     · ensemble.warrior-shades sizes members as fractions of its sheet HEIGHT, so
       it is rendered AT the destination size and never resampled. ONE RANK, not
       a three-tier chorus: `layer:"foreground"` keeps the near rank only, which
       is the module's own answer for a scene that has principals in front of it.
     · ensemble.suitors-shades sizes members in ABSOLUTE source pixels (134 back
       .. 228 near) while spacing them as fractions of the sheet, so its scale is
       a blit ratio and the sheet is WINDOWED to its front band — the knots the
       flock broke into when Hermes put it down, not the whole delivered file.

   AND BOTH ARE KEYED AT A THRESHOLD THEY SURVIVE. This is the one real trap in
   blitting an ensemble. keyedModuleCanvas() flood-clears paint lighter than
   luminance .895 that is reachable from the canvas border — the dot law, meant
   to stop an asset's own paper landing as a rectangle. But BOTH of these plates
   are built out of near-paper planes (pale robes, dissolving wisp lower bodies,
   pale cuirasses) with their ink spent only on wounds, eye-sockets and crests.
   At the default threshold the flood walks straight through those planes and
   eats the crowd, and what survives is a scatter of black death-marks with no
   men under them — which is exactly what the first two drafts rendered. Neither
   plate paints a background here (meadow / gate / horizon layers are all off),
   so there is nothing to key OUT: they are blitted at thr .999, where only true
   white clears, and the ghosts keep their bodies.
   ========================================================================== */
const KEY_THR = 0.999;               // see above — light-plane crowds must survive
const WAR_DW = 1180, WAR_DH = 620;   // one rank, members .19·DH = 118 stage px
const WAR_GY = 0.62;                 // the rank's shoulder line in the sheet
const WAR_FOOT = 0.745;              // that rank's feet in the sheet

/* THE FLOCK IS WINDOWED TO ONE KNOT, AND THAT IS THE WHOLE POINT. The sheet
   lays fourteen men over five social clusters on three depth bands. Blitted
   whole at a size where a man is legible it is 1400 stage pixels wide and owns
   the frame; blitted small enough to fit, every man is 60 pixels and the crowd
   is dot noise — both drafts rendered exactly that. So the window is cluster 3,
   the NEAR-LEFT knot (sheet x .134..422, feet at y .848): three or four of the
   new dead at 194 stage pixels, standing off at the west edge with the rest of
   the flock running off frame behind them, which is what a crowd stood aside at
   an assembly looks like from inside the assembly. */
const SHADE_CW = 1240, SHADE_CH = 1160, SHADE_K = 0.850;
const SHADE_WIN = { x0:0.10, y0:0.66, x1:0.50, y1:0.96 };   // the near-left knot
const SHADE_FOOT = 0.848;            // that knot's footline in the sheet

function blitPlate(offctx, mod, cw, ch, dst, state, sig){
  const cv = keyedModuleCanvas(mod, Math.round(cw), Math.round(ch), state, sig,
                               KEY_THR);
  offctx.drawImage(cv, 0, 0, cv.width, cv.height, dst.x, dst.y, dst.w, dst.h);
}
/* blit ONE declared window of a sheet so the plain shows between its lines. */
function blitWindow(offctx, mod, cw, ch, win, dst, state, sig, thr = KEY_THR){
  const cv = keyedModuleCanvas(mod, Math.round(cw), Math.round(ch), state, sig, thr);
  offctx.drawImage(cv,
    win.x0*cw, win.y0*ch, (win.x1-win.x0)*cw, (win.y1-win.y0)*ch,
    dst.x, dst.y, dst.w, dst.h);
}

/* ==========================================================================
   THE MEMORY PANEL — one register of the tableau, hung in the sky.
   The window is [x .045 .. .955] (the gutter tally bars kept) by one register
   plus a hair of bleed, and the sheet is sized so that window blits 1:1 into the
   destination — no resampling, so the register's own contour weight survives.
   The panel is dropped clear of the card label the engine paints afterwards.
   ========================================================================== */
const TAB_WIN_X0 = 0.045, TAB_WIN_X1 = 0.955;
const TAB_PAD    = 0.006;                       // bleed above/below the register
const TAB_DST    = { x0:0.400, y0:0.048, x1:0.970, y1:0.319 };
const REGS = {
  loom:        { y0:0.082, y1:0.285 },
  beggar:      { y0:0.297, y1:0.500 },
  contest:     { y0:0.512, y1:0.715 },
  recognition: { y0:0.727, y1:0.930 },
};
const REG_ORDER = ["loom","beggar","contest","recognition"];
/* the register the telling is dwelling in, on the master clock. Nothing before
   t=21: beat 1 is the two kings and the sky is empty over them. */
const TAB_REG = t => t < 21 ? null
                  : t < 31 ? "loom"
                  : t < 39 ? "beggar"
                  : t < 47 ? "contest"
                           : "recognition";

function detailField(offctx, W, H, dst){
  const x = dst.x0*W, y = dst.y0*H, w = (dst.x1-dst.x0)*W, h = (dst.y1-dst.y0)*H;
  offctx.save();
  offctx.fillStyle = PAPER; offctx.fillRect(x, y, w, h);
  offctx.strokeStyle = INK; offctx.lineWidth = 4;
  offctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  offctx.restore();
}
function memoryPanel(offctx, W, H, t){
  const key = TAB_REG(t);
  if (!key) return;
  const reg = REGS[key];
  const win = { x0:TAB_WIN_X0, y0:reg.y0 - TAB_PAD, x1:TAB_WIN_X1, y1:reg.y1 + TAB_PAD };
  const dw = (TAB_DST.x1 - TAB_DST.x0)*W, dh = (TAB_DST.y1 - TAB_DST.y0)*H;
  /* 1:1 sheet: window width in sheet px == dw, window height == dh */
  const cw = dw / (win.x1 - win.x0), ch = dh / (win.y1 - win.y0);
  const i = REG_ORDER.indexOf(key);
  const glow = [0,1,2,3].map(k => k === i ? 1 : 0.42);
  detailField(offctx, W, H, TAB_DST);
  blitWindow(offctx, tableau, cw, ch, win,
    { x:TAB_DST.x0*W, y:TAB_DST.y0*H, w:dw, h:dh },
    { glow, t:0.5, layers:["thread", key] }, `b24s02|tab|${key}`, 0.895);
}

export const scene = {
  id:"OD-B24-S02",
  title:"Agamemnon Hears of Penelope's Fidelity",
  book:24,
  plan:"asphodel-assembly",
  duration:D,
  beats:[
    "Agamemnon and Achilles debate the honor of their deaths and funerals.",
    "Amphimedon tells how Penelope delayed the suitors, how Odysseus returned as a beggar, and how the bow contest became slaughter.",
    "Agamemnon praises Penelope's enduring intelligence and condemns Clytemnestra by contrast.",
    "The underworld recognizes Odysseus's household victory as a new song.",
  ],
  exitState:"The muster ground in the meadow of asphodel, the account given and " +
    "answered. Amphimedon's shade holds the open front where he testified: he has " +
    "told the dead the whole household plot from the losing side — the shroud " +
    "woven by day and unpicked by night for three years, the beggar nobody " +
    "searched, the axes set in a line, the bow no suitor could string, the doors " +
    "shut, and the bodies still unwashed in the hall — and has fallen silent. " +
    "Agamemnon's shade stands forward of his old place at the front of the " +
    "assembly, the verdict delivered: Penelope's intelligence is called enduring " +
    "and a song is promised her among men, and Clytemnestra is named against her, " +
    "a shame on every woman after. Achilles's shade has closed a step from the " +
    "east and stands with his regret lifted, hearing another man's homecoming " +
    "come out right. The suitors' shades are still stood off to the west, out of " +
    "file, with nothing left to answer. The war-dead of Troy have come forward " +
    "off the back of the meadow into the acclaim: the rank is no longer listening " +
    "but assenting, and the household victory has been taken up as fame. The " +
    "memory of Penelope hangs over the assembly on its last register, the thread " +
    "of the telling run down into its solid terminus — the story fixed as song. " +
    "Nothing more is owed in the underworld; the next scene is above ground.",
  exitOccupancy:occupancyAt(asphodelAssembly, MOVES, D, INITIAL),

  /* --- declarations the composePrompt asks for --------------------------- */
  entrances:{ agamemnon:"none — already standing at aga_stand, mid-debate",
              achilles:"none — already standing at ach_stand, mid-debate",
              amphimedon:"flock_edge — he steps out of the suitors' shades at t=16",
              warriors:"none — inherited at chorus (S01 left them at asphodel_edge)",
              shades:"none — inherited at station new_dead (S01 left them at muster_r)",
              hermes:"DROPPED — the escort was discharged at the end of S01" },
  exits:{ amphimedon:"none — he holds witness, silent",
          agamemnon:"none — aga_verdict, forward of the assembly",
          achilles:"none — ach_close",
          warriors:"none — chorus_near, in the acclaim",
          shades:"none — new_dead, stood off" },
  walkable:"the muster ground of the asphodel plan: the two crowd stations and " +
           "their forward pair (chorus / chorus_near, new_dead / flock_edge) and " +
           "the speaking ground in front of them (witness, aga_stand, " +
           "aga_verdict, ach_stand, ach_close). The plan owns them; blockingAt() " +
           "throws on anything else, which is the cross-scene check.",
  depthOrder:"one queue sorted by the plan's own projected ground y, far first: " +
             "the war-dead rank, the suitors' knot, then Achilles, Agamemnon and " +
             "Amphimedon as the plan's z puts them. The memory panel is a diagram " +
             "and is laid over the sky last.",
  gazeTargets:{ agamemnon:"Achilles while they debate, then across at the witness, " +
                          "then out past him at the assembly for the verdict",
                achilles:"Agamemnon, then the witness, then lifted for the song",
                amphimedon:"Agamemnon, the man who asked him the question",
                warriors:"the witness's ground while he speaks, the king's after",
                shades:"the witness — one of their own, speaking for them" },
  attachments:[
    { at: 0, who:"tableau_01", change:"absent — the sky over the two kings is empty" },
    { at:21, who:"tableau_01", change:"memory panel struck in on register I, LOOM" },
    { at:31, who:"tableau_01", change:"panel walks to register II, BEGGAR" },
    { at:39, who:"tableau_01", change:"panel walks to register III, CONTEST" },
    { at:47, who:"tableau_01", change:"panel walks to register IV, RECOGNITION — " +
      "the gutter thread runs into its terminus, the story fixed as song" },
    { at:20, who:"warriors",   change:"the chorus's focus tick and aiming arc come " +
      "on, laid on the witness's ground" },
    { at:52, who:"warriors",   change:"the focus moves off the witness onto the king" },
  ],
  sound:[
    { at: 0, source:"ach_stand",   cue:"two kings arguing quietly over funerals; no echo in the asphodel" },
    { at:13, source:"aga_stand",   cue:"Agamemnon puts the question: how did so many young men die on one day" },
    { at:22, source:"witness",     cue:"a thin new voice, giving evidence; the rank goes still" },
    { at:31, source:"witness",     cue:"the loom — a shuttle counted off three years at a time" },
    { at:39, source:"witness",     cue:"the bow strung; the doors shut; the hall turning over" },
    { at:47, source:"aga_verdict", cue:"the verdict: a song for one wife, a curse on the other" },
    { at:62, source:"chorus",      cue:"the war-dead taking it up — assent, then acclaim" },
  ],

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"arrival" },
    { asset:"ensemble.warrior-shades", instance:"warriors",
      anchor:{x:.514,y:.718}, scale:.55, pose:"listening" },
    { asset:"ensemble.suitors-shades", instance:"shades",
      anchor:{x:.193,y:.764}, scale:.43, pose:"clusters" },
    { asset:"character.achilless-shade", instance:"achilles",
      anchor:{x:.821,y:.794}, scale:.34, band:"threeq", pose:"ach_regret" },
    { asset:"character.agamemnons-shade", instance:"agamemnon",
      anchor:{x:.675,y:.851}, scale:.34, band:"threeq", pose:"aga_shame" },
    { asset:"character.amphimedons-shade", instance:"amphimedon",
      anchor:{x:.350,y:.891}, scale:.34, band:"threeq", pose:"amph_calm" },
    { asset:"divine-fx.penelope-memory-tableau", instance:"tableau_01",
      anchor:{x:.645,y:.356}, scale:.65, pose:"loom" },
  ],

  timeline:[
    // 1 — the two kings, on the honour of their deaths
    { op:"actor.pose", target:"agamemnon",  at: 0.0, args:{ pose:"aga_shame" } },
    { op:"actor.gaze", target:"agamemnon",  at: 0.0, args:{ gaze:{ x:.26, y:.10 } } },
    { op:"actor.pose", target:"achilles",   at: 0.0, args:{ pose:"ach_regret" } },
    { op:"actor.gaze", target:"achilles",   at: 0.0, args:{ gaze:{ x:-.24, y:.16 } } },
    { op:"actor.pose", target:"amphimedon", at: 0.0, args:{ pose:"amph_calm" } },
    { op:"set.state",  target:"warriors",   at: 0.0, args:{ state:"listening" } },
    { op:"set.state",  target:"shades",     at: 0.0, args:{ state:"clusters" } },
    { op:"actor.pose", target:"achilles",   at: 7.0, args:{ pose:"ach_confess" } },
    { op:"actor.pose", target:"agamemnon",  at: 9.0, args:{ pose:"aga_warn" } },
    { op:"actor.pose", target:"achilles",   at:13.0, args:{ pose:"ach_revived" } },
    // the question that opens the testimony
    { op:"actor.pose", target:"agamemnon",  at:15.0, args:{ pose:"aga_ask" } },
    { op:"actor.gaze", target:"agamemnon",  at:15.0, args:{ gaze:{ x:-.34, y:.02 } } },
    // 2 — the witness steps out and gives the account
    { op:"actor.pose", target:"amphimedon", at:17.0, args:{ pose:"amph_testify" } },
    { op:"actor.gaze", target:"amphimedon", at:17.0, args:{ gaze:{ x:.34, y:-.10 } } },
    { op:"actor.pose", target:"achilles",   at:20.0, args:{ pose:"ach_martial" } },
    { op:"actor.gaze", target:"achilles",   at:20.0, args:{ gaze:{ x:-.44, y:.04 } } },
    { op:"actor.pose", target:"agamemnon",  at:24.0, args:{ pose:"aga_calm" } },
    { op:"fx.play",    target:"tableau_01", at:21.0, args:{ dir:"loom" } },
    { op:"actor.pose", target:"amphimedon", at:24.0, args:{ pose:"amph_count" } },
    { op:"set.state",  target:"tableau_01", at:31.0, args:{ state:"beggar" } },
    { op:"actor.pose", target:"amphimedon", at:32.0, args:{ pose:"amph_testify" } },
    { op:"set.state",  target:"warriors",   at:30.0, args:{ state:"turning" } },
    { op:"set.state",  target:"tableau_01", at:39.0, args:{ state:"contest" } },
    { op:"actor.pose", target:"amphimedon", at:39.0, args:{ pose:"amph_recoil" } },
    { op:"actor.pose", target:"amphimedon", at:44.0, args:{ pose:"amph_wound" } },
    { op:"actor.gaze", target:"amphimedon", at:44.0, args:{ gaze:{ x:.16, y:.40 } } },
    // 3 — the verdict on the two wives
    { op:"set.state",  target:"tableau_01", at:47.0, args:{ state:"recognition" } },
    { op:"actor.pose", target:"agamemnon",  at:47.0, args:{ pose:"aga_ask" } },
    { op:"actor.gaze", target:"agamemnon",  at:47.0, args:{ gaze:{ x:-.20, y:-.10 } } },
    { op:"set.state",  target:"warriors",   at:46.0, args:{ state:"assenting" } },
    { op:"actor.pose", target:"amphimedon", at:52.0, args:{ pose:"amph_calm" } },
    { op:"actor.pose", target:"agamemnon",  at:56.0, args:{ pose:"aga_warn" } },
    { op:"actor.gaze", target:"agamemnon",  at:56.0, args:{ gaze:{ x:.10, y:-.04 } } },
    // 4 — the underworld takes it up as a song
    { op:"actor.pose", target:"achilles",   at:62.0, args:{ pose:"ach_revived" } },
    { op:"actor.gaze", target:"achilles",   at:62.0, args:{ gaze:{ x:-.10, y:-.18 } } },
    { op:"set.state",  target:"warriors",   at:62.0, args:{ state:"acclaim" } },
    { op:"actor.pose", target:"agamemnon",  at:66.0, args:{ pose:"aga_calm" } },
    { op:"timeline.capture", target:"OD-B24-S02", at:70.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const s   = stateAt(scene, t);
    const blk = blockingAt(asphodelAssembly, MOVES, t, INITIAL);
    const prog = Math.min(.96, .12 + .82*(t/D));

    /* the field first — it paints the world, everything else keys onto it.
       THE LAYER SUBSET IS THE CAMERA POSITION, NOT A SECOND SET. The camera
       stands ON the muster ground at the head of the way, so the Gates of the
       Sun, the country of dreams, the White Rock, the streams of Ocean and the
       near boulders are all BEHIND it — three of them are thresholds this
       assembly has already passed. Drawn anyway (the first draft did), the gate
       mouth is a five-level black slab that lands at frame y .52 and the chorus
       rank fuses into it, and the five tally steles stand up through the
       principals like railings. The module's own `layers` channel is the right
       instrument: sky, plain, ridge, the meadow of asphodel, the way, and the
       lit muster ring — which in state `arrival` is exactly the ground this
       scene is standing on. */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"arrival", t:0.4, progress:prog, status:"THE ASPHODEL",
              layers:["sky","plain","ridge","meadow","way","rings"] },
    });

    /* one queue, sorted by the plan's own projected ground y: the floor decides
       who stands in front, not the order these blocks happen to be written in. */
    const queue = [];
    const add = (y, draw) => queue.push({ y, draw });

    /* --- THE WAR-DEAD: one rank across the back of the meadow -------------- */
    {
      const p = blk.warriors;
      const dst = { x:p.x*W - WAR_DW*0.5, y:p.y*H - WAR_DH*WAR_FOOT,
                    w:WAR_DW, h:WAR_DH };
      // the chorus is aimed at whoever is speaking, in the plate's own space
      const sp = t < 47 ? blk.amphimedon : blk.agamemnon;
      const phase = t < 30 ? "listening" : t < 46 ? "turning"
                  : t < 62 ? "assenting" : "acclaim";
      const wave = clamp(0.12 + 0.88*((t - 26)/34), 0.08, 1);
      const att  = clamp(0.34 + 0.66*((t - 14)/26), 0.30, 1);
      add(p.y, () => blitPlate(offctx, warriors, WAR_DW, WAR_DH, dst, {
        formation:"chorus-arc", rows:2, perRow:[4,5], layer:"foreground",
        phase, wave, waveLag:0.7, attention:att,
        focus:{ x:clamp((sp.x*W - dst.x)/WAR_DW, -0.4, 1.4),
                y:clamp((sp.y*H - dst.y)/WAR_DH,  0.2, 1.4) },
        /* the road paints the world: the plate's own meadow and horizon stay
           off, and so does the wave-front, which is a full-height dashed rule
           and would stripe the frame straight through the memory panel. The
           focus tick and aiming arc DO come on — they are long thin ink that
           holds at rank size and they say the one thing the beat is about:
           this rank is aimed at the man giving evidence. */
        showMeadow:false, showWave:false, showFocus: t >= 20,
        groundY:WAR_GY,
        status: phase === "acclaim" ? "A NEW SONG" : "THE FAMOUS DEAD",
        progress: prog,
      }, `b24s02|w|${phase}|${wave.toFixed(2)}|${att.toFixed(2)}`));
    }

    /* --- THE SUITORS' SHADES: stood off to the west, nothing to answer ----- */
    {
      const p = blk.shades;
      const k = SHADE_K;
      /* ONE mapping from sheet to frame: sheet (0.5, SHADE_FOOT) is put on the
         station's ground, and the window is a crop of that one mapping — so the
         flock stands where the plan says it stands. The station is far enough
         west that the sheet's outer file runs off the left edge, which is what a
         crowd stood off at the side of an assembly looks like. */
      const wcx = (SHADE_WIN.x0 + SHADE_WIN.x1) * 0.5;
      const ox = p.x*W - wcx*SHADE_CW*k;
      const oy = p.y*H - SHADE_FOOT*SHADE_CH*k;
      const dst = { x:ox + SHADE_WIN.x0*SHADE_CW*k, y:oy + SHADE_WIN.y0*SHADE_CH*k,
                    w:(SHADE_WIN.x1-SHADE_WIN.x0)*SHADE_CW*k,
                    h:(SHADE_WIN.y1-SHADE_WIN.y0)*SHADE_CH*k };
      const wp = blk.amphimedon;
      const answering = t >= 17 && t < 52;
      add(p.y, () => blitWindow(offctx, newdead, SHADE_CW, SHADE_CH, SHADE_WIN, dst, {
        formation:"clusters", density:1.0,
        attention: answering ? 0.86 : 0.52,
        wave: clamp(0.14 + 0.70*((t % 23)/23), 0, 1),
        waveWidth:0.26,
        fear: answering ? 0.30 : 0.44,
        foreground:0.70, background:0.56,
        focus:{ x:clamp((wp.x*W - ox)/(SHADE_CW*k), -0.6, 1.6),
                y:clamp((wp.y*H - oy)/(SHADE_CH*k), -0.4, 1.6) },
        // the road paints the world; the sheet's own meadow, gate and bats stay off
        showMeadow:false, showGate:false, showBats:false,
        showTestimony: t >= 22 && t < 50,
        status: answering ? "SPOKEN FOR" : "OUT OF FILE",
        progress: prog,
      }, `b24s02|n|${answering?1:0}|${Math.round(t)}`));
    }

    /* --- ACHILLES: regret, then another man's homecoming come out right ---- */
    {
      const p = blk.achilles, c = s.achilles || {};
      const proud   = t >= 13 && t < 20;
      const singing = t >= 62;
      add(p.y, () => placeInstance(offctx, W, H, achilles, {
        anchor:{ x:p.x, y:p.y }, scale:MAN * p.scale,
        state:{
          t:0.5, band:"threeq",
          pose: c.pose || "ach_regret",
          gaze: c.gaze || { x:-.24, y:.16 },
          ghostAlpha: singing ? 0.86 : proud ? 0.82 : 0.74,
          browUp:   singing ? .46 : proud ? .48 : .52,
          browKnit: singing ? .08 : proud ? .08 : .46,
          smile:    singing ? .30 : proud ? .30 : 0,
          frown:    singing ? 0 : proud ? 0 : .42,
          eyeWide:  singing ? .28 : proud ? .28 : 0,
          jaw:      proud ? .32 : .30,
          status:   singing ? "ANOTHER MAN'S HOUSE" : proud ? "REVIVED" : "REGRETFUL",
          progress: prog,
        },
      }));
    }

    /* --- AGAMEMNON: the murdered king who asks, hears, and judges ---------- */
    {
      const p = blk.agamemnon, c = s.agamemnon || {};
      const asking  = t >= 15 && t < 24;
      const hearing = t >= 24 && t < 47;
      const praise  = t >= 47 && t < 56;
      const curse   = t >= 56 && t < 66;
      add(p.y, () => placeInstance(offctx, W, H, agamemnon, {
        anchor:{ x:p.x, y:p.y }, scale:MAN * p.scale,
        state:{
          t:0.5, band:"threeq", solid:true,
          pose: c.pose || "aga_shame",
          gaze: c.gaze || { x:.26, y:.10 },
          browUp:   praise ? .70 : asking ? .74 : curse ? .44 : .30,
          browKnit: curse ? .66 : hearing ? .38 : .44,
          frown:    curse ? .48 : praise ? .10 : .30,
          eyeNarrow:curse ? .44 : hearing ? .24 : .10,
          jaw:      curse ? .36 : praise ? .30 : asking ? .30 : .12,
          smile:    praise ? .16 : 0,
          mouthAsym:curse ? .30 : 0,
          status:   curse ? "AND CLYTEMNESTRA" : praise ? "ENDURING PENELOPE"
                  : hearing ? "HEARING IT" : asking ? "HOW DID YOU DIE" : "UNGRIEVED",
          progress: prog,
        },
      }));
    }

    /* --- AMPHIMEDON: the only witness the poem gives from inside the defeat - */
    {
      const p = blk.amphimedon, c = s.amphimedon || {};
      const stepping  = t >= 16 && t < 22;
      const counting  = t >= 24 && t < 32;
      const ambushed  = t >= 39 && t < 44;
      const unburied  = t >= 44 && t < 52;
      const finished  = t >= 52;
      add(p.y, () => placeInstance(offctx, W, H, amphimedon, {
        anchor:{ x:p.x, y:p.y }, scale:MAN * p.scale,
        state:{
          t:0.5, band:"threeq", solid:true,
          pose: c.pose || "amph_calm",
          gaze: c.gaze || { x:.34, y:-.10 },
          browUp:   ambushed ? .86 : unburied ? .30 : finished ? .12 : .50,
          browKnit: unburied ? .54 : finished ? .26 : .36,
          frown:    unburied ? .46 : finished ? .20 : .16,
          eyeWide:  ambushed ? .62 : 0,
          eyeNarrow:unburied ? .42 : counting ? .26 : .14,
          jaw:      ambushed ? .66 : finished ? 0 : .40,
          mouthAsym:finished ? 0 : .20,
          status:   finished ? "SAID" : unburied ? "UNBURIED" : ambushed ? "AMBUSHED"
                  : counting ? "THREE YEARS" : stepping ? "STEPPING OUT" : "TESTIFYING",
          progress: prog,
        },
      }));
    }

    /* far → near, by the plan's own ground line */
    queue.sort((a, b) => a.y - b.y).forEach(j => j.draw());

    /* --- THE MEMORY, as its own panel: a drawing of what is being said, not a
       second world. Laid over the sunless sky last. */
    memoryPanel(offctx, W, H, t);
  },
};
export default scene;

/* named binding so the next scene can `import { exitOccupancy as INITIAL }`
   — the scene-object property alone cannot be linked. */
export const exitOccupancy = scene.exitOccupancy;
