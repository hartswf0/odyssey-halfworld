/* ============================================================
   SCENE  OD-B18-S03 — The Warning to Amphinomus
   Book XVIII, scene 3. ADDITIVE: creates nothing, modifies nothing; it only
   COMPOSES assets that already exist. Shape copied from the reference scene
   scenes/OD-B16-S03.mjs and from its Book XVIII siblings OD-B18-S01.mjs (the
   megaron case) and OD-B18-S02.mjs (the registered-diagram case).

   ROOM. location.megaron-hall, state "feast" — and it is the SAME PAINT as
   OD-B18-S01: identical layer list, so every fixture this scene names stands
   where S01 painted it. Two things the feast state buys that "day" does not:
   the great doors stand OPEN (an aperture of bare paper in the far wall), and
   the fire is high. The open door is not decoration — it is the subject. The
   whole scene is an exit that stays open and stays unusable, and the man being
   offered it can see straight through it while a beggar sits on the sill.
   The `furniture`, `litter` and `throne` layers are dropped, for the reason S01
   dropped them and nobody has undone: the floor was shoved open for the fight
   in S01, the fight was held outside in S02, and the benches, the laden tables
   and the master's chair are still back against the walls. That also frees the
   six bench/table stations, which are the ONLY stations this plan has off the
   spine and below the pillars — the megaron draws its furniture exactly at
   bench_l1/l2, bench_r1/r2, table_l and table_r, so a body blocked there while
   the layer is on stands inside a laden table. Everything load-bearing stays:
   shell, roof, far wall, the great doors, THE SILL, the arms racks, the
   postern, the maids' door, the stair, both pillars, the dressed spine and the
   hearth. ONE hall asset with a state channel; no second hall is built or cast.

   BLOCKING. No hand-placed figure anchors. Both bodies resolve through
   scenes/_plans/megaron.mjs via blockingAt(), by station NAME:

     odysseus    threshold  — THE SILL, where 18.110 sets him down with the
                              portion Amphinomus has just given him, and where
                              S01 left him. He does not move once in this scene:
                              the man in the doorway IS the reason the doorway
                              is not an exit. Static hero, moving diagram.
     amphinomus  table_l -> bench_l1
                            — he takes the warning standing at his own place on
                              the near left, close enough to camera to have a
                              face, and when it lands he gives that floor back
                              and withdraws upstage to his bench. 18.157 sends
                              him "back through the hall to sit down in his
                              chair"; the benches are still shoved against the
                              wall from the fight, so there is nothing there to
                              sit on, and he stands at it instead.

   WHICH STATIONS, AND WHY NOT THE OTHERS — read off the render, not guessed.
   · `pillar_l` is a PILLAR station and the room draws a shaft, a capital and a
     base block on it. Draft 1 blocked Amphinomus there and he printed as a
     caryatid: the shaft's two scored lines ran down through his torso, its base
     plinth sat under his heels, and the column was as wide as he was. He is on
     open floor now and the pillars are left to hold the roof up.
   · The spine stations (`axe_first`, `hearth`, `axe_last`, `shot_mark`,
     `throne`) are all x .50 after projection — the same x as the man on the
     sill — so none of them can hold a second body without stacking it under
     him. That is why the second body is on the left flank.
   · He does not cross the spine. At this depth a near body's head sits ABOVE
     the far body's feet (head y .475 against feet y .536), so anyone walking
     from the left flank to the right one passes through Odysseus and the two
     silhouettes print as one column for the length of the walk. The withdrawal
     therefore stays on the left, which is also the side the diagram's escape
     arc breaks toward.
   The two never share a station and never share a depth: the sill is z .16 on
   the spine, his table is z .70 and his bench z .62. At the sizes below they
   are 0.20 of frame apart in x at the closest, and the near man stands 236px
   to the far man's 201px — the 1.4x the projection owes him.

   ONE BODY, ONE GUISE. The atlas asks for `character.odysseus-as-beggar`. That
   is character.odysseus-b16 with guise:"beggar" — the same body Books XVI, XVII
   and XVIII S01/S02 used, never a cut to a second module. THERE IS NO GUISE
   CHANGE HERE and no restoration flare. The guise is held flat at "beggar" from
   the first frame to the last, and that flatness is the content: the man who
   says "Odysseus will be here before you can get out of this hall" is looking
   at Amphinomus over the rim of a cup, in rags, and is not believed.

   THE DIAGRAM, AND WHERE IT IS ALLOWED TO LAND. divine-fx.doom-pull is
   authored for this scene (`scene:"OD-B18-S03"`) and it is a plan-view routing
   diagram of an overwrite: a fixed design pin, an assigned corridor, a token
   collared by a tether, an escape arc that breaks toward an offered door and is
   hooked back, and an assigned station at the corridor's mouth. Four rules:
   · It is REGISTERED, not floated. The plate's own `target:amphinomus` anchor
     (x .395, y .470 — the token's station on the route) is landed on a PLAN
     STATION projected through the same project() the room's fixtures are
     painted with, so the diagram lies on this floor and not on the glass:
         anchor.x = station.x + (0.500 - tokenX) * FX_S
         anchor.y = station.y + (1.000 - tokenY) * FX_S
     Registering the TOKEN rather than the corridor head is what keeps the
     assigned station on the frame: the plate carries 0.392 of its own height
     below the token, so a token landed lower than y .70 drags the consequence
     off the bottom edge — which is exactly the mark the last beat is about.
     That is also why the token cannot be landed on the man himself: the near
     band this scene stands him in is all below y .78.
   · The ground it is pinned to is a point on the plan RAY from `pillar_r`
     toward `hearth`, three tenths of the way along — plan space, named
     stations, the device the axe line and the arrow already use. It is chosen
     because it is EMPTY: no pillar foot, no fire, no body, and the whole
     near-right quadrant below it is bare flagstone for the corridor to run
     into. Draft 2 pinned it at `pillar_l` and the plate's own doorway glyph
     (0.114 of frame wide) came down on the postern and on Amphinomus at once,
     printing one dark blob where the left of the room should have two things
     in it.
   · It is registered to plan GROUND, not to the live body, and it does not move
     when he does. A diagram that chased him would drag its assigned station off
     the frame at the exact moment he walks; and a design that moved when its
     subject moved would not be a design.
   · `field`, `gauge` and `door` are dropped. The gauge is margin furniture and
     in a STAGE the margins are occupied floor; the broad chevron field lays
     small marks over the whole plate and would print a grey wash across a room
     that is already painted. The doorway glyph is dropped for a better reason
     than clearance: this stage HAS the door in it. The great doors stand open
     in the far wall with the man who is about to close them sitting on the
     sill, and the escape arc breaks left out of the corridor straight toward
     them. A drawn diagram of a door, six inches from a painted one, is a
     second door. What is kept is the load-bearing diagram: corridor, escape,
     tether, source, token — and `consequence` only from t=36,
     when the assigned station is what the shot is about. The plate floods its
     canvas with inkLevel(1) (lum .858) before drawing anything, and
     placeInstance keys at .895, which would leave that flood standing as an
     opaque panel over the hall — so it is keyed by hand at 0.85 (the device
     S01 uses for the crowd) and only its marks land. It is painted BEFORE the
     bodies: it is on the floor, the men stand on it, and no diagram stroke
     crosses a face. It is also drawn LARGE (0.56 of frame) on purpose — at the
     third of that this room's near band would have allowed, the corridor rails
     and the chevrons fall below the dot pitch and print as grey fur.

   THE PROP. prop.wine-cup gets no private geometry either. It stands on a point
   of the plan RAY from `threshold` to `table_l`, six tenths of the way along,
   and takes that ray's own projected scale — between the two men who are
   drinking from it, which is where a mixing bowl stands at a feast — and it
   walks its own fill/tilt channels through OFFERED -> DRINKING -> KEPT as
   Odysseus pledges him, drinks, and keeps the cup. It is NOT in his fist, and
   that is measured over
   three drafts, not lazy. At his station the room paints the dark jamb across
   x .402 .. .598 and the two pillar shafts from .312 and .636, so the ONLY pale
   ground at hand height is the door aperture — and his own body fills it. Draft
   1 held the cup there at 0.028 offset and the vessel vanished inside his
   silhouette; draft 2 moved it clear and it printed as a dark wedge welded to
   the jamb; draft 3 set it on the floor too small and the rim ellipse, the grip
   lugs and the adze rows all fell under the dot pitch. This module is a big
   crude two-lugged ivy-wood serving bowl with a hewn foot and a `contact:base`
   anchor — it was cut to ply a Cyclops, not to be a stemmed kylix — and at
   0.165 of its ray's scale, on bare flagstone in front of the fire, it reads as
   exactly that. The wine level does the acting: brimming, drunk down, kept. Its
   `grip` layer is held at 0 on purpose: a hand painted on the lug at this size
   is a second hand next to the rig's own, and the rig should do the work.

   Beats (Od. 18.119–157):
     1. Odysseus drinks to Amphinomus and warns that no man should become
        lawless in prosperity.
     2. He predicts that Odysseus will return before the suitor can leave.
     3. Amphinomus walks away shaken, sensing danger but unable to escape
        Athena's design.
     4. The warning becomes another unheeded exit offered before the slaughter.

   CONTINUITY IN. scenes/OD-B18-S02.mjs exports a computed `exitOccupancy`
   ({odysseus:"ring_l", irus:"propped", antinous:"torch_r",
     amphinomus:"ring_gate"}) and it is imported here. Those are LOCAL
   fight-threshold stations out in the courtyard and this scene is back inside
   the hall, so they are translated through an explicit YARD_TO_HALL map
   (rule F), and two men are DROPPED because the story leaves them out there.
   See the map for who and why.

   Verify:  node harness/render-scene.mjs scenes/OD-B18-S03.mjs --t 8
            node harness/render-scene.mjs scenes/OD-B18-S03.mjs --t 38
   ============================================================ */
import { placeInstance, keyedModuleCanvas, clamp, lerp, smooth } from "../engine/halfworld-engine.mjs";
import { blockingAt, occupancyAt } from "../engine/blocking.mjs";
import { megaron } from "./_plans/megaron.mjs";
import { stateAt } from "./_scene-contract.mjs";

import field      from "../assets/location/megaron-hall.mjs";
import odysseus   from "../assets/character/odysseus-b16.mjs";
import amphinomus from "../assets/character/amphinomus.mjs";
import cup        from "../assets/prop/wine-cup.mjs";
import doom       from "../assets/divine_fx/doom-pull.mjs";

const FIELD_ASSET = "location.megaron-hall";
const D = 44;

/* the room, minus the benches, the laden tables, the litter and the master's
   chair — all still shoved back from the fight. Identical to S01's list, so the
   hall S01 painted is the hall this scene paints. */
const HALL_LAYERS = ["shell","roof","farwall","doors","sill","racks","postern",
                     "maidsdoor","stair","pillars","lane","hearth"];

/* --- CONTINUITY IN. Computed upstream, translated here. -------------------
   A station only exists in its own plan: `ring_l`, `ring_gate`, `propped` and
   `torch_r` belong to location.fight-threshold's courtyard and blockingAt()
   would (correctly) throw on them here. `door_main` is the doorway the two
   plans share, and the two cameras face each other across it — the yard set
   looks at the facade from outside, the megaron looks at the same doors from
   within — so the translation is a step through that doorway, not a lookup:

     ring_l    -> threshold  the ring is trodden bare at the door foot; one step
                             up through the doors from it is the doorstone, and
                             18.110 puts him down on it with the portion in his
                             hands. He holds it for the whole scene.
     ring_gate -> table_l    the donor of that portion comes in ahead of him and
                             goes back to his own place at the near left-hand
                             table — the gate side of the yard is the left flank
                             of the hall once you are through the doors and
                             facing the other way.

   DROPPED, and correctly:
     irus     `propped` — left sitting against the courtyard wall foot with his
                          jaw broken, warned not to come back. He does not.
     antinous `torch_r` — still out at the door-post with the rest of them,
                          laughing over the man in the dirt. That is why this
                          hall is quiet enough for one suitor to be spoken to
                          alone, and it is the last time anybody offers him
                          anything. Bringing him in would also cost the picture
                          the only unfurnished near ground the plan has. */
const YARD_TO_HALL = { ring_l:"threshold", ring_gate:"table_l" };
import { exitOccupancy as PREV_EXIT } from "./OD-B18-S02.mjs";
const INITIAL = Object.fromEntries(Object.entries(PREV_EXIT)
  .map(([who, st]) => [who, YARD_TO_HALL[st]])
  .filter(([, st]) => st));

/* --- BLOCKING. Stations, not coordinates. -------------------------------- */
const MOVES = [
  // he gives the near floor back and withdraws upstage to his own bench
  { who:"amphinomus", from:"table_l", to:"bench_l1", t0:26, t1:34 },
  // Odysseus never leaves the sill. That is the plot of the doorway.
];

/* --- FIGURE SIZES (multiplied by the station's own plan scale) ------------
   0.50 is the size OD-B18-S01 gives this body on this station; keeping it
   means the man on the sill is the same man at the same distance in both
   shots. 0.42 on the near table is a shade over the 0.40 S01 gives Irus on
   the same station — a lord rather than a beggar — and the plan scale does the
   rest: he prints 236px to the sill's 201px, which is the 1.4x the projection
   owes a body 0.54 of the room's depth nearer the camera. */
const FIG_OD = 0.50, FIG_AM = 0.42;

/* NOTE ON THE ARITHMETIC ABOVE. Measured off renders, not assumed (it is
   OD-B18-S02's note): the hero rig draws ~0.72 of its placed box tall with its
   feet at ~0.93 of the box height, which is where 0.42 x 1.026 x 0.72 = 236px
   of a 760px frame comes from. No constant is needed for it here — nothing in
   this scene registers onto a body; the diagram and the bowl both land on plan
   ground, which is already a floor point. */

/* --- THE PULL WINDOW. One clock drives the whole diagram. ----------------
   It is not on the floor before the warning is spoken: beats 1..2 are two men
   and a cup, and a great deal of paper. */
const P0 = 14, P1 = 42;
const pullT = t => clamp((t - P0) / (P1 - P0), 0, 1);
/* how far the will vector still pushes back: it rises while he is being told,
   peaks as he turns away, and is gone by the end. */
function hesitationAt(t){
  if (t < 26) return lerp(0.55, 0.95, clamp((t - P0) / 12, 0, 1));
  if (t < 34) return lerp(0.95, 0.30, clamp((t - 26) / 8, 0, 1));
  return lerp(0.30, 0.04, clamp((t - 34) / 8, 0, 1));
}
/* how much of the aborted escape arc is drawn: he tries the door as he goes,
   and the attempt is withdrawn rather than completed. */
function escapeAt(t){
  if (t < 20) return 0;
  if (t < 28) return clamp((t - 20) / 8, 0, 1);
  if (t < 38) return lerp(1, 0.22, clamp((t - 28) / 10, 0, 1));
  return 0;
}
/* the plate's own token anchor (`target:amphinomus`), the ground it is pinned
   to, and the layers that are allowed onto an occupied floor. The ground is a
   point on the plan RAY from the right pillar toward the hearth — plan space,
   named stations, the same device the axe line and the arrow use — because it
   is open floor and neither pillar foot nor fire stands on it. */
const FX_TOK_X  = 0.395, FX_TOK_Y = 0.470;
const FX_FROM   = "pillar_r", FX_TO = "hearth", FX_U = 0.30;
const FX_S      = 0.52;                       // box, as a fraction of the frame
const FX_LAYERS = ["corridor","escape","tether","source","token"];
const FX_KEY    = 0.85;                       // the plate floods at inkLevel(1)

/* the diagram is keyed by hand — placeInstance's .895 would leave the flood
   standing as an opaque panel over the hall. */
function placeDiagram(offctx, W, H, anchor, scale, state){
  const w = W * scale, h = H * scale;
  const x = anchor.x * W - w / 2, y = anchor.y * H - h;
  const sig = `${Math.round((state.pull ?? 0)*20)}|${Math.round((state.hesitation ?? 0)*20)}`
            + `|${Math.round((state.escape ?? 0)*20)}|${(state.layers || []).length}`;
  offctx.drawImage(keyedModuleCanvas(doom, w, h, state, sig, FX_KEY), x, y);
}

export const scene = {
  id:"OD-B18-S03",
  title:"The Warning to Amphinomus",
  book:18,
  plan:"megaron",
  duration:D,
  beats:[
    "Odysseus drinks to Amphinomus and warns that no man should become lawless in prosperity.",
    "He predicts that Odysseus will return before the suitor can leave the palace.",
    "Amphinomus walks away shaken, sensing danger but unable to escape Athena's design.",
    "The warning becomes another unheeded exit offered before the slaughter.",
  ],
  exitState:"The great hall with the doors standing open and the fire high, the benches and the laden tables still shoved back from the fight. Odysseus has not moved off the sill: he holds the doorstone in the beggar's rags, and he has said out loud, to the one suitor who has been decent to him, that the master of this house will be back before that man can get out of this hall. Nobody in the room takes it for anything but a beggar's talk. The bowl Amphinomus pledged him in stands on the floor between them in front of the fire, drunk down and kept. Amphinomus has given the near floor back and withdrawn to his own bench on the left, shaking his head, carrying the sense of the thing without the words for it — he has understood enough to be afraid and not enough to leave, and the benches are still against the wall so he does not even sit. The exit stands open behind Odysseus and it is not usable: Athena's design is pinned above the floor on the right, the corridor from the ground he was warned on to the station where Telemachus's spear will take him from behind is assigned and drawn, the escape arc has been withdrawn, and the slack in the tether is used up. The warning has been given, offered and refused; Irus is still propped against the courtyard wall and the rest of the suitors are still out in the yard laughing at him.",
  exitOccupancy:occupancyAt(megaron, MOVES, D, INITIAL),

  /* anchors below are PLACEHOLDERS satisfying the cast contract; stage()
     overrides every one of them from the plan. Do not hand-tune them. */
  cast:[
    { asset:FIELD_ASSET, instance:"field_01",
      anchor:{x:.50,y:.99}, scale:1.0, state:"feast" },
    { asset:"character.odysseus-b16", instance:"odysseus",
      anchor:{x:.50,y:.56}, scale:.37, band:"threeq", pose:"three_quarter_left" },
    { asset:"character.amphinomus", instance:"amphinomus",
      anchor:{x:.30,y:.82}, scale:.43, band:"threeq", pose:"courteous_offer" },
    { asset:"prop.wine-cup", instance:"cup_01",
      anchor:{x:.39,y:.71}, scale:.15 },
    { asset:"divine-fx.doom-pull", instance:"doom_01",
      anchor:{x:.67,y:.98}, scale:FX_S, blend:"multiply" },
  ],

  timeline:[
    { op:"actor.pose",  target:"odysseus",   at: 0.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.gaze",  target:"odysseus",   at: 0.0, args:{ gaze:{ x:-.34, y:.14 } } },
    { op:"actor.pose",  target:"amphinomus", at: 0.0, args:{ pose:"courteous_offer" } },
    { op:"actor.gaze",  target:"amphinomus", at: 0.0, args:{ gaze:{ x:.34, y:-.10 } } },
    // 1. the pledge, then the warning about prosperity
    { op:"prop.state",  target:"cup_01",     at: 1.0, args:{ mode:"offer" } },
    { op:"actor.pose",  target:"odysseus",   at: 3.0, args:{ pose:"one_arm_raised" } },
    { op:"prop.state",  target:"cup_01",     at: 5.0, args:{ mode:"drink" } },
    { op:"actor.pose",  target:"amphinomus", at: 6.0, args:{ pose:"three_quarter_right" } },
    { op:"actor.gaze",  target:"amphinomus", at: 6.0, args:{ gaze:{ x:.30, y:-.04 } } },
    { op:"prop.state",  target:"cup_01",     at:11.0, args:{ mode:"kept" } },
    { op:"actor.pose",  target:"odysseus",   at:12.0, args:{ pose:"torso_open" } },
    { op:"fx.play",     target:"doom_01",    at:P0,   args:{ dir:"constrain" } },
    { op:"actor.pose",  target:"amphinomus", at:15.0, args:{ pose:"uneasy_reserve" } },
    { op:"actor.gaze",  target:"amphinomus", at:15.0, args:{ gaze:{ x:.22, y:.26 } } },
    // 2. the prediction: before you can get out of this hall
    { op:"actor.pose",  target:"odysseus",   at:20.0, args:{ pose:"pointing_arm" } },
    { op:"actor.gaze",  target:"odysseus",   at:20.0, args:{ gaze:{ x:-.44, y:.06 } } },
    { op:"actor.gaze",  target:"amphinomus", at:22.0, args:{ gaze:{ x:.10, y:-.34 } } },
    // 3. he walks away shaken
    { op:"actor.pose",  target:"amphinomus", at:26.0, args:{ pose:"walk_neutral" } },
    { op:"actor.gaze",  target:"amphinomus", at:26.0, args:{ gaze:{ x:-.16, y:.22 } } },
    { op:"actor.pose",  target:"odysseus",   at:28.0, args:{ pose:"three_quarter_left" } },
    { op:"actor.pose",  target:"amphinomus", at:34.0, args:{ pose:"guarded_withdrawal" } },
    { op:"actor.gaze",  target:"amphinomus", at:34.0, args:{ gaze:{ x:.26, y:.18 } } },
    // 4. the exit stays open and stays unusable
    { op:"actor.pose",  target:"amphinomus", at:40.0, args:{ pose:"uneasy_reserve" } },
    { op:"actor.gaze",  target:"amphinomus", at:40.0, args:{ gaze:{ x:.08, y:.30 } } },
    { op:"timeline.capture", target:"OD-B18-S03", at:43.0, args:{ label:"EXIT" } },
  ],

  stage(offctx, W, H, t){
    const st  = stateAt(scene, t);
    const blk = blockingAt(megaron, MOVES, t, INITIAL);

    const pledging = t <  11;                 // the cup up, drinking to him
    const warned   = t >= 11 && t < 20;        // no man lawless in prosperity
    const foretold = t >= 20 && t < 26;        // before you can get out of this hall
    const leaving  = t >= 26 && t < 34;        // he walks away shaking his head
    const held     = t >= 34;                  // and does not get out

    /* the field first — it paints the room, everything else keys onto it */
    placeInstance(offctx, W, H, field, {
      anchor:{x:.50,y:.99}, scale:1.0,
      state:{ state:"feast", t:0.55, layers:HALL_LAYERS,
              progress:Math.min(.94, .2 + .7*(t/D)),
              status: held ? "THE DOOR STANDS OPEN" : "MISRULE" },
    });

    /* --- THE ASSIGNED ROUTE, on the floor, under everybody ----------------
       The plate's token is landed on the plan station FX_AT — a floor point,
       projected by the same project() that placed the room's fixtures — and it
       stays there for the rest of the scene. placeInstance boxes are anchored
       bottom-centre and take the frame aspect, so the box solves exactly:
         X = anchor.x + (tokX - 0.5) * FX_S   ->  anchor.x = X + (0.5 - tokX)*FX_S
         Y = anchor.y - (1 - tokY) * FX_S     ->  anchor.y = Y + (1   - tokY)*FX_S */
    const pt = pullT(t);
    if (pt > 0.001){
      const g0     = megaron.ray(FX_FROM, FX_TO, FX_U);
      const layers = t >= 36 ? [...FX_LAYERS, "consequence"] : FX_LAYERS;
      placeDiagram(offctx, W, H,
        { x:g0.x + (0.5 - FX_TOK_X) * FX_S,
          y:g0.y + (1   - FX_TOK_Y) * FX_S },
        FX_S,
        { t:pt, pull:0.30 + 0.70 * smooth(pt),
          hesitation:hesitationAt(t), escape:escapeAt(t),
          layers,
          status: held ? "ASSIGNED" : leaving ? "RETURNED"
                : foretold ? "HELD" : "OFFERED",
          progress:pt });
    }

    /* --- the painted bodies, ordered by the blocking ---------------------
       Amphinomus changes depth (z .44 -> .62) and comes toward camera, so the
       order is SORTED on the resolved y rather than fixed in the source. */
    const draws = [];

    /* ODYSSEUS — one body, guise held flat at "beggar", and he does not move
       off the sill for a single frame of this scene. */
    {
      const p = blk.odysseus;
      const s = st.odysseus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, odysseus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_OD * p.scale,
          state:{
            t:0.45, guise:"beggar", band:"threeq",
            pose: s.pose || "three_quarter_left",
            gaze: s.gaze || { x:-.34, y:.14 },
            browKnit: foretold ? .50 : warned ? .34 : .20,
            browUp:   pledging ? .30 : held ? .22 : .12,
            eyeNarrow:foretold ? .46 : .30,
            smile:    pledging ? .24 : held ? .18 : 0,
            mouthAsym:foretold ? .52 : .28,
            jaw:      warned || foretold ? .30 : 0,
            status:   held ? "HE WAS WARNED" : foretold ? "BEFORE YOU GET OUT"
                    : warned ? "NO MAN LAWLESS" : "I DRINK TO YOU",
            progress: Math.min(.96, .16 + .76*(t/D)),
          },
        });
      }});
    }

    /* AMPHINOMUS — courtesy, then misgiving, then a man withdrawing from a
       thing he has half understood. */
    {
      const p = blk.amphinomus;
      const s = st.amphinomus || {};
      draws.push({ y:p.y, run(){
        placeInstance(offctx, W, H, amphinomus, {
          anchor:{ x:p.x, y:p.y }, scale:FIG_AM * p.scale,
          state:{
            t:0.5, band:"threeq",
            pose: s.pose || "courteous_offer",
            gaze: s.gaze || { x:.34, y:-.10 },
            browUp:   warned ? .52 : held ? .44 : .34,
            browKnit: foretold ? .56 : leaving ? .48 : .18,
            eyeWide:  foretold ? .42 : .16,
            eyeNarrow:held ? .24 : 0,
            frown:    held ? .40 : leaving ? .30 : 0,
            smile:    pledging ? .20 : 0,
            jaw:      foretold ? .26 : 0,
            mouthAsym:held ? .34 : .10,
            status:   held ? "HE DOES NOT GO" : leaving ? "SHAKING HIS HEAD"
                    : foretold ? "HE SENSES IT" : warned ? "LISTENING" : "COURTEOUS",
            progress: Math.min(.96, .12 + .80*(t/D)),
          },
        });
      }});
    }

    /* --- THE BOWL: no private geometry ----------------------------------
       It stands on the plan RAY from the doorstone to his table, six tenths of
       the way along — between the two men who are drinking from it, which is
       where a mixing bowl stands at a feast — and it takes that ray's own
       projected prop scale. It is NOT put in Odysseus's fist, and that is
       measured, not lazy: at his station the room paints the dark jamb from
       x .402 to .598 and the two pillar shafts from .312 and .636, so the only
       clear background at hand height is the door aperture, which his own body
       already fills. Draft 1 held it there at 0.028 offset and the vessel
       disappeared inside his silhouette; draft 2 moved it clear and it printed
       as a dark wedge welded to the jamb; draft 3 stood it on the floor too
       small and the rim ellipse, the lugs and the adze rows all fell below the
       dot pitch. At this size, on bare flagstone, in front of the fire, it
       reads as the thing it is — a big crude two-lugged serving bowl with a
       hewn foot, which is what this module is (it was cut for the Cyclops's
       cave), not a stemmed kylix. The wine level does the acting: brimming,
       drunk down, kept. */
    {
      const g1   = megaron.ray("threshold", "table_l", 0.60);
      const mode = t >= 11 ? "kept" : t >= 5 ? "drink" : "offer";
      draws.push({ y:g1.y, run(){
        placeInstance(offctx, W, H, cup, {
          anchor:{ x:g1.x, y:g1.y }, scale:0.165 * g1.scale,
          state:{
            t:0.5,
            fill: mode === "drink" ? 0.44 : mode === "kept" ? 0.30 : 0.66,
            tilt:0, pour:0, grip:0, spill:0,
            status: mode === "drink" ? "DRINKING" : mode === "kept" ? "KEPT" : "OFFERED",
            progress: Math.min(.96, .2 + .7*(t/D)),
          },
        });
      }});
    }

    draws.sort((a, b) => a.y - b.y).forEach(d => d.run());
  },
};
export default scene;

/* named binding so the next scene of the book can
   `import { exitOccupancy as INITIAL }` — the scene-object property alone
   cannot be linked.

   NOTE FOR THE NEXT SCENE. These are MEGARON stations, so a following scene in
   the hall can import them straight. Two men are NOT in this occupancy and must
   not be conjured into the next shot without a station: Irus is propped against
   the courtyard wall outside, and Antinous is still out at the door-post with
   the rest of the suitors — when they come back in, they come back in through
   `door_main`. */
export const exitOccupancy = scene.exitOccupancy;
