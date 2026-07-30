/* location.upper-chamber-and-stair — PENELOPE'S UPPER ROOM AND THE WAY DOWN.
   ADDITIVE, Book XXIII (OD-B23-S01). Modifies nothing; shadows nothing.

   WHY THIS FILE EXISTS. Book XXIII opens with a journey, not a room: Eurycleia
   climbs, wakes Penelope on the bed, the queen is dressed, and then she goes
   DOWN — and the whole scene turns on the last step of that descent, where she
   stops on the threshold of the hall and looks at a man across the fire without
   crossing to him. `location.megaron-hall` already owns the bottom of that
   journey: it paints the flight in its right corner (station `stair_up`, the
   little door at its head). THIS asset is everything ABOVE that door: the
   chamber, the dog-leg stair, and the threshold she stops on. One asset, because
   S01 has to play the wake, the dressing and the descent on ONE clock — cutting
   them into three rooms is exactly the collage the Book XVI+ convention exists
   to stop.

   HOW IT IS DRAWN — and why not in one-point perspective. The hall, the hut and
   the storeroom are single-floor rooms, so they use the README §5 depth law and
   a plan. A stair is a room that changes FLOOR LEVEL, and y = 0.50 + 0.46·z^1.08
   cannot put anything above the horizon: an upper storey is unreachable by that
   law. So this set is a CUTAWAY SECTION — the house sliced open, both storeys
   true, the descent readable end to end in one frame. It is the most
   diagrammatic thing in the atlas and it is the only honest one for a stair.
   Consequence for scenes: block figures through STATIONS (exported below) with
   `stationAt(name)`, which hands back { x, y, scale } in the same normalized
   space `placeInstance` wants — NOT through blockingAt()/makePlan, whose
   projection assumes one floor. Ground-floor stations agree with the megaron's
   `stair_up` corner, so the two rooms join.

   STATES (state.state, default "night") — each changes what is DRAWN:
     night        shutters barred, lamp burning, bed made, chamber door shut
     waking       lamp raked high, the covers thrown back — Eurycleia's news
     dressing     chest open, the robe gone off its peg, door open
     descent      lamp low, the stair alight from below, light on the low floor
     first_sight  hall doorway wide and burning: the threshold she stops on
     dawn         shutters open, lamp out, bed made again, the room emptied

   Light planes, dark accents. The paper is the room; the ink is the structure.
   NO characters baked in.
   Verify: node harness/render.mjs assets/location/upper-chamber-and-stair.mjs --state first_sight */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

/* ---- THE LAYOUT ----------------------------------------------------------
   ONE table of numbers. Both the drawing and the anchors are read out of it,
   so a fixture and the station a body stands on cannot drift apart. All values
   are fractions of the frame (x of W, y of H); y grows downward. */
export const L = {
  build:   { x0:.045, x1:.955, y0:.062, y1:.952 },  // the sliced house
  wall:    .040,                                     // cut wall thickness
  roofY:   .128,                                     // underside of the roof slab
  floorY:  .455,                                     // top of the upper floor  ← chamber feet
  slabT:   .046,                                     // thickness of that floor
  groundY: .885,                                     // the lower floor         ← ground feet
  plinth:  .050,
  pier:    { x0:.385, x1:.421, doorTop:.196 },       // chamber wall + its doorway
  stairA:  { xTop:.385, xBot:.210, n:5 },            // upper flight, down to the LEFT
  land:    { x0:.083, x1:.215, t:.040 },             // half landing
  stairB:  { xTop:.130, xBot:.400, n:5 },            // lower flight, down to the RIGHT
  riser:   .0391,                                    // 11 risers, .455 → .885
  thresh:  { x0:.505, x1:.735, jamb:.032, head:.575 },// the doorway into the hall
  bed:     { x0:.655, x1:.906, top:.300, mat:.348, rail:.402 },
  hang:    { x0:.770, x1:.902, y0:.148, y1:.286 },   // the web on the wall
  truss:   { y:.196, post:.232 },                    // the tie over the stair well
  chest:   { x0:.520, x1:.634, top:.392 },
  lamp:    { x:.478, bowl:.338 },
  peg:     { x:.700, y:.168 },
  win:     { y0:.192, y1:.312 },                     // shutter in the right wall
  bench:   { x0:.775, x1:.888, top:.828 },
};
const IN_L = L.build.x0 + L.wall, IN_R = L.build.x1 - L.wall;
const A_Y  = i => L.floorY + i * L.riser;                       // flight-A tread i
const A_X  = i => L.stairA.xTop + (L.stairA.xBot - L.stairA.xTop) * i / L.stairA.n;
const LAND_Y = A_Y(L.stairA.n);                                  // .6505
const B_Y  = i => LAND_Y + (i + 1) * L.riser;                    // flight-B tread i
const B_X  = i => L.stairB.xTop + (L.stairB.xBot - L.stairB.xTop) * i / L.stairB.n;

const params = {
  section:"cutaway", storeys:2, risers:11,
  stepsUpper:L.stairA.n, stepsLower:L.stairB.n,
  /* what a figure's `scale` should be on each floor — the storeys are not the
     same height, and a body that ignores that reads as a giant on the stair. */
  scales:{ chamber:.30, stair:.33, ground:.37, bed:.24 },
  /* occlusion order for anything placed in the set */
  occlusion:{ behind:["backwall","hallbeyond"], on:["chamber","stair","ground"],
              front:["understair","plinth","bench","threshjamb"] },
};

const MODES = {
  night:      { status:"SLEEPING",   shutters:"shut", lamp:"lit",  bed:"made", chest:"closed", robe:"peg",  door:"shut", hall:"dim",  glow:0, day:false },
  waking:     { status:"ROUSED",     shutters:"shut", lamp:"high", bed:"back", chest:"closed", robe:"peg",  door:"shut", hall:"dim",  glow:0, day:false },
  dressing:   { status:"ROBING",     shutters:"shut", lamp:"lit",  bed:"back", chest:"open",   robe:"gone", door:"open", hall:"dim",  glow:0, day:false },
  descent:    { status:"DESCENDING", shutters:"shut", lamp:"low",  bed:"back", chest:"open",   robe:"gone", door:"open", hall:"lit",  glow:1, day:false },
  first_sight:{ status:"DIVIDED",    shutters:"shut", lamp:"low",  bed:"back", chest:"open",   robe:"gone", door:"open", hall:"fire", glow:2, day:false },
  dawn:       { status:"EMPTY",      shutters:"open", lamp:"out",  bed:"made", chest:"closed", robe:"gone", door:"open", hall:"day",  glow:0, day:true  },
};

const LAYERS = ["field","shell","roof","backwall","window","upperfloor","pier",
                "bed","chest","lamp","peg","stair","understair","rail",
                "threshold","hallbeyond","ground","furniture","light"];

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "night";
  const M    = MODES[mode];
  const T    = (st && st.t) || 0;
  const layers = (st && st.layers) || LAYERS;
  const has = l => layers.includes(l);
  const R = rnd(70231);

  const S = l => toneSolid(inkLevel(clamp(Math.round(l), 0, 7)));
  const X = x => x*W, Y = y => y*H;
  const box = (x0,y0,x1,y1,l,lw=4) =>
    pen.paint(()=>{ g.rect(X(x0), Y(y0), X(x1-x0), Y(y1-y0)); }, S(l), lw);
  const poly = (pts,l,lw=4) => pen.paint(()=>{
    pts.forEach(([x,y],i)=> i ? g.lineTo(X(x),Y(y)) : g.moveTo(X(x),Y(y))); g.closePath(); }, S(l), lw);
  const rule = (x0,y0,x1,y1,lw=3,a=1) => { g.globalAlpha=a;
    pen.ink(()=>{ g.moveTo(X(x0),Y(y0)); g.lineTo(X(x1),Y(y1)); }, lw); g.globalAlpha=1; };
  /* a horizontal band, deliberately BROKEN: no span in this set runs edge to
     edge, or the frame stripes. */
  const broken = (x0,x1,y0,y1,l,gaps,lw=4) => {
    let cx = x0;
    for (const [gs,ge] of gaps){ if (gs>cx) box(cx,y0,gs,y1,l,lw); cx = Math.max(cx,ge); }
    if (cx < x1) box(cx,y0,x1,y1,l,lw);
  };

  /* ================= FIELD — the sheet the house is drawn on ============== */
  if (has("field")){
    g.fillStyle = inkLevel(0); g.fillRect(0,0,W,H);
    // the ground the house stands on: one line, ticked, never a bar
    rule(0, L.build.y1+.012, 1, L.build.y1+.012, 3, .55);
    for (let i=0;i<9;i++){ const x=.06+i*.11;
      rule(x, L.build.y1+.012, x-.022, L.build.y1+.034, 2, .30); }
  }

  /* ================= SHELL — the two cut walls, the interiors ============= */
  if (has("shell")){
    // interiors first, so the wall bands print over their edges
    box(IN_L, L.roofY,   IN_R, L.floorY,   1, 4);                  // upper storey
    box(IN_L, L.floorY, L.pier.x0, L.floorY+L.slabT, 1, 3);        // the open well
    box(IN_L, L.floorY+L.slabT, IN_R, L.groundY, 1, 4);            // lower storey
    // the sliced side walls — dark accents, held to their own width
    box(L.build.x0, L.build.y0, IN_L, L.build.y1, 4, 5);
    box(IN_R, L.build.y0, L.build.x1, L.build.y1, 4, 5);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.30;           // coursing in the cut
    for (let y=L.build.y0+.05; y<L.build.y1; y+=.062){
      g.beginPath(); g.moveTo(X(L.build.x0),Y(y)); g.lineTo(X(IN_L),Y(y)); g.stroke();
      g.beginPath(); g.moveTo(X(IN_R),Y(y)); g.lineTo(X(L.build.x1),Y(y)); g.stroke(); }
    g.globalAlpha=1;
    pen.ink(()=>{ g.rect(X(L.build.x0),Y(L.build.y0), X(L.build.x1-L.build.x0), Y(L.build.y1-L.build.y0)); }, 5);
  }

  /* ================= ROOF — slab, purlin blocks, rafter feet ============== */
  if (has("roof")){
    broken(L.build.x0, L.build.x1, L.build.y0, L.roofY, 2,
           [[.300,.345],[.600,.645]], 5);                          // two purlin gaps
    for (const x of [.300,.600]) box(x, L.build.y0-.004, x+.045, L.roofY+.010, 5, 4);
    for (let i=0;i<7;i++){ const x=.115+i*.118;                    // rafter feet
      box(x, L.roofY, x+.020, L.roofY+.020, 5, 3); }
    /* THE TIE over the stair well. The shaft is the only span in the house with
       no floor in it, so it is the one place a roof truss shows — and it keeps
       the top-left quarter of the frame built instead of blank. */
    const t=L.truss;
    broken(IN_L+.004, L.pier.x0, t.y, t.y+.026, 3, [[t.post-.004, t.post+.030]], 4);
    box(t.post, L.roofY+.014, t.post+.026, t.y+.026, 4, 4);        // king post
    g.strokeStyle=INK; g.lineWidth=6; g.lineCap="round";
    g.beginPath(); g.moveTo(X(IN_L+.024),Y(t.y)); g.lineTo(X(t.post),Y(L.roofY+.026));
    g.moveTo(X(L.pier.x0-.020),Y(t.y)); g.lineTo(X(t.post+.026),Y(L.roofY+.026)); g.stroke();
    // the high slit that lights the well
    box(L.build.x0, .300, IN_L+.008, .368, 5, 4);
    box(L.build.x0+.006, .312, IN_L+.002, .356, M.day?0:3, 3);
  }

  /* ================= BACK WALL of the chamber — broken coursing =========== */
  if (has("backwall")){
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.20;
    const rows=[[.44,.72],[.46,.90],[.42,.66],[.55,.91]];
    rows.forEach((seg,i)=>{ const y=L.roofY+.052+i*.062;
      g.beginPath(); g.moveTo(X(seg[0]),Y(y)); g.lineTo(X(seg[1]),Y(y)); g.stroke(); });
    g.globalAlpha=1;
  }

  /* ================= THE SHUTTERED WINDOW in the right wall =============== */
  if (has("window")){
    const w=L.win, x0=IN_R-.006, x1=L.build.x1+.004;
    box(x0-.030, w.y0-.020, x1, w.y1+.020, 5, 4);                  // the reveal frame
    if (M.shutters==="open"){
      box(x0-.018, w.y0, x1, w.y1, 0, 4);                          // sky
      rule(x0-.018, (w.y0+w.y1)/2, x1, (w.y0+w.y1)/2, 3, .8);      // one transom, not bars
      box(x0-.030, w.y0-.004, x0-.014, w.y1+.004, 3, 3);           // the leaf, folded back
    } else {
      box(x0-.018, w.y0, x1, w.y1, 3, 4);                          // two leaves, barred
      rule(x0-.018, (w.y0+w.y1)/2, x1, (w.y0+w.y1)/2, 3, .9);
      box(x0-.026, (w.y0+w.y1)/2-.011, x1, (w.y0+w.y1)/2+.011, 6, 3);  // the bar
    }
  }

  /* ================= THE UPPER FLOOR — the slab she walks on ============= */
  if (has("upperfloor")){
    broken(L.pier.x0, IN_R, L.floorY, L.floorY+L.slabT, 4, [[.628,.664],[.812,.844]], 5);
    for (let i=0;i<6;i++){ const x=.445+i*.078;                    // joist ends
      box(x, L.floorY+.010, x+.016, L.floorY+.032, 6, 3); }
    box(L.pier.x0-.026, L.floorY, L.pier.x0+.004, L.floorY+.070, 5, 4);   // corbel at the well
  }

  /* ================= THE PIER + THE CHAMBER DOOR ========================= */
  if (has("pier")){
    const p=L.pier;
    box(p.x0, L.roofY, p.x1, p.doorTop, 4, 5);                     // lintel over the door
    box(p.x0-.010, p.doorTop-.020, p.x1+.010, p.doorTop, 5, 4);
    if (M.door==="shut"){
      box(p.x0+.002, p.doorTop, p.x1-.002, L.floorY, 3, 4);
      for (let i=1;i<4;i++){ const y=lerp(p.doorTop,L.floorY,i/4);
        rule(p.x0+.004, y, p.x1-.004, y, 3, .55); }
      box(p.x0+.004, lerp(p.doorTop,L.floorY,.52), p.x0+.014, lerp(p.doorTop,L.floorY,.62), 6, 2);
    } else {
      // the leaf swung back into the chamber, stood against its own wall
      poly([[p.x1,p.doorTop+.006],[p.x1+.036,p.doorTop+.022],
            [p.x1+.036,L.floorY],[p.x1,L.floorY]], 3, 4);
      rule(p.x1+.018, p.doorTop+.016, p.x1+.018, L.floorY-.004, 3, .5);
      for (const y of [p.doorTop+.030, L.floorY-.030])             // hinges
        box(p.x0+.026, y, p.x0+.040, y+.014, 6, 2);
    }
  }

  /* ================= THE BED — light plane, dark frame ===================
     Not the rooted bed: that is prop.olive-tree-marriage-bed, and it belongs
     to the chamber of Book XXIII S04, not to this one. A plain bedstead. */
  if (has("bed")){
    const b=L.bed;
    box(b.x1-.034, b.top-.016, b.x1, b.rail, 3, 5);                // headboard
    for (const y of [b.top+.014, b.top+.046])                      // its two carved slots
      box(b.x1-.028, y, b.x1-.008, y+.014, 5, 2);
    box(b.x0, b.mat-.014, b.x0+.024, b.rail, 3, 5);                // footboard
    box(b.x0, b.rail, b.x1, b.rail+.026, 4, 4);                    // the rail
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.45;           // the leather webbing
    for (let i=0;i<7;i++){ const x=b.x0+.034+i*.030;
      g.beginPath(); g.moveTo(X(x),Y(b.rail+.024)); g.lineTo(X(x+.018),Y(b.rail+.004)); g.stroke(); }
    g.globalAlpha=1;
    for (const x of [b.x0+.006, (b.x0+b.x1)/2-.008, b.x1-.026])    // legs
      box(x, b.rail+.026, x+.018, L.floorY, 5, 3);
    box(b.x0+.012, b.mat, b.x1-.012, b.rail, 1, 4);                // the mattress
    box(b.x1-.080, b.top+.006, b.x1-.036, b.mat, 1, 4);            // the pillow
    rule(b.x1-.072, b.top+.028, b.x1-.044, b.top+.028, 2, .55);
    if (M.bed==="made"){
      poly([[b.x0+.008,b.mat+.002],[b.x0+.024,b.mat-.024],         // the covers, drawn up
            [b.x1-.084,b.mat-.030],[b.x1-.074,b.mat+.002]], 2, 4);
      box(b.x0+.008, b.mat, b.x1-.074, b.mat+.030, 2, 4);
      for (let i=0;i<5;i++){ const x=b.x0+.038+i*.036;
        rule(x, b.mat-.020, x, b.mat+.026, 2, .45); }
    } else {                                                       // thrown back
      box(b.x0+.008, b.mat-.006, b.x0+.078, b.mat+.030, 2, 4);
      poly([[b.x0+.078,b.mat-.026],[b.x0+.152,b.mat-.060],         // the heaped fold
            [b.x0+.178,b.mat-.012],[b.x0+.108,b.mat+.030],
            [b.x0+.078,b.mat+.030]], 3, 4);
      rule(b.x0+.096, b.mat-.030, b.x0+.156, b.mat-.006, 2, .6);
      rule(b.x0+.104, b.mat+.004, b.x0+.164, b.mat-.022, 2, .45);
    }
  }

  /* ================= THE WEB on the wall over the bed ==================== */
  if (has("bed")){
    const h=L.hang;
    box(h.x0-.010, h.y0-.014, h.x1+.010, h.y0, 5, 4);              // the rod
    box(h.x0, h.y0, h.x1, h.y1, 1, 4);                             // the cloth
    for (let r=0;r<3;r++){ const y=h.y0+.030+r*.038;               // its woven bands
      broken(h.x0+.008, h.x1-.008, y, y+.016, 3,
             [[h.x0+.048, h.x0+.068],[h.x0+.098, h.x0+.114]], 3); }
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.30;           // warp
    for (let i=0;i<6;i++){ const x=h.x0+.014+i*.020;
      g.beginPath(); g.moveTo(X(x),Y(h.y0+.006)); g.lineTo(X(x),Y(h.y1-.006)); g.stroke(); }
    g.globalAlpha=1;
  }

  /* ================= THE CLOTHES CHEST =================================== */
  if (has("chest")){
    const c=L.chest;
    box(c.x0, c.top, c.x1, L.floorY, 2, 4);                        // the body
    for (const x of [c.x0+.020, c.x1-.032]) box(x, c.top+.006, x+.012, L.floorY-.004, 5, 2);
    if (M.chest==="closed"){
      box(c.x0-.008, c.top-.024, c.x1+.008, c.top+.002, 4, 4);
      box((c.x0+c.x1)/2-.010, c.top+.004, (c.x0+c.x1)/2+.010, c.top+.020, 6, 2);
    } else {
      poly([[c.x1-.006,c.top-.002],[c.x1+.016,c.top-.086],         // lid, stood up
            [c.x0+.030,c.top-.098],[c.x0+.010,c.top-.014]], 4, 4);
      // linen taken out and hung over the front — the dressing
      poly([[c.x0+.024,c.top+.004],[c.x0+.086,c.top+.004],
            [c.x0+.078,L.floorY-.004],[c.x0+.034,L.floorY-.004]], 1, 4);
      for (let i=0;i<3;i++){ const x=c.x0+.038+i*.016;
        rule(x, c.top+.012, x+.004, L.floorY-.012, 2, .5); }
    }
  }

  /* ================= THE LAMP ============================================ */
  if (has("lamp")){
    const p=L.lamp;
    box(p.x-.024, L.floorY-.014, p.x+.024, L.floorY, 4, 3);        // foot
    box(p.x-.006, p.bowl, p.x+.006, L.floorY-.012, 4, 3);          // stem
    box(p.x-.030, p.bowl-.016, p.x+.030, p.bowl, 3, 4);            // bowl
    if (M.lamp!=="out"){
      const k = M.lamp==="high" ? 1.5 : M.lamp==="low" ? .62 : 1;
      const f = .034*k*(.82+.22*Math.abs(Math.sin(T*2.1)));
      pen.paint(()=>{ g.moveTo(X(p.x-.013),Y(p.bowl-.014));
        g.lineTo(X(p.x),Y(p.bowl-.014-f)); g.lineTo(X(p.x+.013),Y(p.bowl-.014));
        g.closePath(); }, S(7), 3);
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.34;         // four rays, no glow
      for (let i=0;i<4;i++){ const a=-2.6+i*.62, r0=.052*k, r1=.086*k;
        g.beginPath();
        g.moveTo(X(p.x+Math.cos(a)*r0*.6), Y(p.bowl-.020+Math.sin(a)*r0));
        g.lineTo(X(p.x+Math.cos(a)*r1*.6), Y(p.bowl-.020+Math.sin(a)*r1)); g.stroke(); }
      g.globalAlpha=1;
    } else {
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.28;         // the last of the smoke
      g.beginPath(); g.moveTo(X(p.x),Y(p.bowl-.018));
      g.bezierCurveTo(X(p.x+.026),Y(p.bowl-.060), X(p.x-.020),Y(p.bowl-.092),
                      X(p.x+.010),Y(p.bowl-.130)); g.stroke(); g.globalAlpha=1;
    }
  }

  /* ================= THE PEG on the wall ================================= */
  if (has("peg")){
    const p=L.peg;
    box(p.x-.030, p.y, p.x+.030, p.y+.014, 5, 3);
    for (const x of [p.x-.020, p.x+.014]) box(x, p.y+.014, x+.010, p.y+.030, 6, 2);
    if (M.robe==="peg"){
      poly([[p.x-.030,p.y+.026],[p.x+.030,p.y+.026],
            [p.x+.048,p.y+.150],[p.x-.048,p.y+.150]], 2, 4);
      for (let i=0;i<4;i++){ const u=(i+1)/5;
        rule(lerp(p.x-.026,p.x+.026,u), p.y+.036,
             lerp(p.x-.042,p.x+.042,u), p.y+.142, 2, .5); }
      rule(p.x-.048, p.y+.150, p.x+.048, p.y+.150, 3, .9);
    }
  }

  /* ================= THE DOG-LEG STAIR =================================== */
  const flightPts = (xOf, yOf, n, soffit) => {
    const p=[[xOf(0), yOf(0)]];
    for (let i=0;i<n;i++){ p.push([xOf(i+1), yOf(i)]); p.push([xOf(i+1), yOf(i+1)]); }
    p.push([xOf(n), yOf(n)+soffit]); p.push([xOf(0), yOf(0)+soffit]);
    return p;
  };
  /* risers drawn as their own faces over the flight fill — without them the
     two flights print as plain diagonal bands and the descent stops counting */
  const risers = (xOf, yOf, n, dir) => {
    for (let i=0;i<n;i++){
      const xa=xOf(i+1), y0=yOf(i), y1=yOf(i+1);
      box(Math.min(xa,xa+dir*.012), y0, Math.max(xa,xa+dir*.012), y1, 4, 3);
      rule(xOf(i), y0, xOf(i+1), y0, 4, .95);                      // the nosing
    }
  };
  if (has("stair")){
    const SOF=.062;
    poly(flightPts(A_X, A_Y, L.stairA.n, SOF), 1, 5);              // the upper flight
    risers(A_X, A_Y, L.stairA.n, +1);
    poly([[A_X(L.stairA.n), A_Y(L.stairA.n)+.006],                 // its stringer, under
          [A_X(L.stairA.n), A_Y(L.stairA.n)+SOF],
          [L.stairA.xTop,   L.floorY+SOF],
          [L.stairA.xTop,   L.floorY+.006]], 3, 3);
    box(L.land.x0, LAND_Y, L.land.x1, LAND_Y+L.land.t, 2, 5);      // the half landing
    box(L.land.x0, LAND_Y+L.land.t-.012, L.land.x1-.026, LAND_Y+L.land.t, 5, 3);
  }
  if (has("understair")){
    /* the lower flight is not a floating ramp — it is the top of a solid mass
       that carries it, so it prints as one built thing, not a second diagonal */
    const p=[[B_X(0), B_Y(0)]];
    for (let i=0;i<L.stairB.n;i++){ p.push([B_X(i+1), B_Y(i)]); p.push([B_X(i+1), B_Y(i+1)]); }
    p.push([IN_L, L.groundY]); p.push([IN_L, B_Y(0)]);
    poly(p, 2, 5);
    risers(B_X, B_Y, L.stairB.n, -1);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.26;           // coursing in the mass
    for (const [x0,x1,y] of [[.096,.286,.800],[.150,.354,.845],[.092,.226,.756]]){
      g.beginPath(); g.moveTo(X(x0),Y(y)); g.lineTo(X(x1),Y(y)); g.stroke(); }
    g.globalAlpha=1;
    box(.150, .796, .238, L.groundY, 4, 4);                        // a low store recess
    box(.160, .810, .228, L.groundY-.010, 1, 3);
  }
  if (has("rail")){
    // the open side of the upper flight — the one thing standing in the shaft
    const xa=L.stairA.xTop-.006, ya=L.floorY, xb=L.stairA.xBot+.010, yb=LAND_Y, drop=.086;
    poly([[xa,ya-drop],[xb,yb-drop],[xb,yb-drop+.020],[xa,ya-drop+.020]], 4, 4);
    for (let i=0;i<=3;i++){ const u=i/3, x=lerp(xa,xb,u), y=lerp(ya,yb,u);
      box(x-.007, y-drop+.014, x+.007, y-.004, 5, 3); }
    box(L.stairA.xTop-.022, L.floorY-.112, L.stairA.xTop+.002, L.floorY, 5, 4);  // newel
    box(L.land.x0+.004, LAND_Y-.092, L.land.x0+.028, LAND_Y, 5, 4);              // landing post
  }

  /* ================= WHAT IS BEYOND THE HALL DOORWAY ===================== */
  if (has("hallbeyond")){
    const t=L.thresh, o0=t.x0+t.jamb, o1=t.x1-t.jamb;
    const lvl = M.hall==="dim" ? 3 : M.hall==="day" ? 1 : 0;
    box(o0, t.head, o1, L.groundY, lvl, 4);
    if (M.hall!=="dim"){
      box(o0+.052, t.head+.030, o0+.100, L.groundY, 3, 4);         // a pillar of the hall
      box(o0+.044, t.head+.016, o0+.108, t.head+.036, 4, 3);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.30;         // its floor courses
      for (const y of [.802,.842,.876]){ g.beginPath();
        g.moveTo(X(o0+.006),Y(y)); g.lineTo(X(o1-.006),Y(y)); g.stroke(); }
      g.globalAlpha=1;
    }
    if (M.hall==="fire"){                                          // the hearth, burning
      const hx=o1-.052, hy=L.groundY-.006;
      box(hx-.036, hy-.020, hx+.036, hy, 4, 3);
      for (let i=0;i<4;i++){ const u=(i+.5)/4, fx=hx-.030+.060*u;
        const fh=.030+.024*Math.abs(Math.sin(i*2.3+T*1.9));
        pen.paint(()=>{ g.moveTo(X(fx-.013),Y(hy-.018));
          g.lineTo(X(fx+(i%2?.005:-.005)),Y(hy-.018-fh));
          g.lineTo(X(fx+.013),Y(hy-.018)); g.closePath(); }, S(7), 2); }
    }
  }
  if (has("threshold")){
    const t=L.thresh;
    box(t.x0, t.head-.030, t.x1, t.head, 5, 4);                    // the lintel
    box(t.x0, t.head, t.x0+t.jamb, L.groundY, 5, 4);               // the two jambs
    box(t.x1-t.jamb, t.head, t.x1, L.groundY, 5, 4);
    box(t.x0-.010, L.groundY-.016, t.x1+.010, L.groundY, 6, 4);    // the sill she stops on
    rule(t.x0+t.jamb, L.groundY-.016, t.x1-t.jamb, L.groundY-.016, 3, .9);
  }

  /* ================= THE LOW FLOOR + WHAT STANDS ON IT =================== */
  if (has("ground")){
    broken(L.build.x0, L.build.x1, L.groundY, L.groundY+L.plinth, 5,
           [[.300,.352],[.640,.700]], 5);
    for (const x of [.300,.640]) box(x, L.groundY+.006, x+.052, L.groundY+L.plinth-.006, 3, 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.28;
    for (let i=0;i<5;i++){ const x=.42+i*.108;
      g.beginPath(); g.moveTo(X(x),Y(L.groundY)); g.lineTo(X(x),Y(L.groundY-.020)); g.stroke(); }
    g.globalAlpha=1;
  }
  if (has("furniture")){
    const b=L.bench;
    box(b.x0, b.top, b.x1, b.top+.026, 2, 4);                      // a bench by the wall
    for (const x of [b.x0+.008, b.x1-.024]) box(x, b.top+.026, x+.016, L.groundY, 5, 3);
    poly([[.742,L.groundY],[.736,.836],[.748,.822],[.770,.822],    // a water jar
          [.782,.836],[.776,L.groundY]], 2, 4);
    rule(.740, .852, .778, .852, 3, .7);
  }

  /* ================= LIGHT — hard-edged wedges, never a gradient ========= */
  if (has("light")){
    if (M.glow){
      const t=L.thresh;
      // the hall throwing its light back along the low floor to the stair foot
      poly([[t.x0+t.jamb-.004, t.head+.020],[t.x0+t.jamb-.004, L.groundY-.016],
            [L.stairB.xBot-.030, L.groundY-.016],
            [t.x0+t.jamb-.004-.130, t.head+.140]], 0, 3);
      g.globalAlpha=.32;
      pen.ink(()=>{ g.moveTo(X(t.x0+t.jamb-.004),Y(t.head+.020));
        g.lineTo(X(t.x0+t.jamb-.004-.130),Y(t.head+.140)); }, 3);
      g.globalAlpha=1;
      if (M.glow>1){                                               // and up the stair well
        poly([[L.stairB.xBot-.030, L.groundY-.016],[L.stairB.xBot-.030, B_Y(L.stairB.n)-.010],
              [B_X(2), B_Y(2)-.014],[B_X(2)+.060, L.groundY-.016]], 0, 3);
      }
    }
    if (M.day){
      const w=L.win;                                               // dawn in at the shutter
      poly([[IN_R-.004, w.y0+.006],[IN_R-.004, w.y1+.010],
            [L.bed.x0+.030, L.floorY-.004],[L.bed.x0-.020, L.floorY-.004]], 0, 3);
      g.globalAlpha=.30;
      pen.ink(()=>{ g.moveTo(X(IN_R-.004),Y(w.y0+.006)); g.lineTo(X(L.bed.x0-.020),Y(L.floorY-.004)); }, 3);
      g.globalAlpha=1;
    }
  }
}

/* ---- STATIONS ------------------------------------------------------------
   Read out of L, so a station and the fixture it belongs to cannot drift.
   `scale` is what placeInstance() should be given for a body standing there —
   the two storeys are not the same height, and `bed_lie` is a body off its feet.
   Scenes: `const p = stationAt("bed_side");
            placeInstance(ctx,W,H,mod,{ anchor:{x:p.x,y:p.y}, scale:p.scale });`
   blockingAt()/makePlan are NOT used here: their projection assumes one floor
   and cannot reach an upper storey. Interpolate between stations for a move. */
const SC = params.scales;
export const STATIONS = {
  // ── the upper chamber (feet on L.floorY) ──
  bed_head:     { x:L.bed.x1-.042,           y:L.floorY, scale:SC.chamber, floor:"chamber" },
  bed_side:     { x:(L.bed.x0+L.bed.x1)/2,   y:L.floorY, scale:SC.chamber, floor:"chamber" },
  bed_foot:     { x:L.bed.x0+.014,           y:L.floorY, scale:SC.chamber, floor:"chamber" },
  bed_lie:      { x:(L.bed.x0+L.bed.x1)/2+.014, y:L.bed.top+.046, scale:SC.bed, floor:"bed" },
  chest:        { x:(L.chest.x0+L.chest.x1)/2, y:L.floorY, scale:SC.chamber, floor:"chamber" },
  lamp:         { x:L.lamp.x,                y:L.floorY, scale:SC.chamber, floor:"chamber" },
  window:       { x:IN_R-.028,               y:L.floorY, scale:SC.chamber, floor:"chamber" },
  chamber_door: { x:L.pier.x1+.020,          y:L.floorY, scale:SC.chamber, floor:"chamber" },
  // CONTACT PAIR — nurse and queen at the bedside must not resolve to one point
  bedside_l:    { x:(L.bed.x0+L.bed.x1)/2-.048, y:L.floorY, scale:SC.chamber, floor:"chamber" },
  bedside_r:    { x:(L.bed.x0+L.bed.x1)/2+.048, y:L.floorY, scale:SC.chamber, floor:"chamber" },
  // ── the descent ──
  stair_head:   { x:A_X(0)-.014, y:A_Y(0),               scale:SC.stair,  floor:"stair" },
  stair_upper:  { x:A_X(2)-.010, y:A_Y(2),               scale:SC.stair,  floor:"stair" },
  landing:      { x:(L.land.x0+L.land.x1)/2, y:LAND_Y,   scale:SC.stair,  floor:"stair" },
  stair_lower:  { x:B_X(3),      y:B_Y(3),               scale:SC.stair,  floor:"stair" },
  stair_foot:   { x:L.stairB.xBot+.022, y:L.groundY,     scale:SC.ground, floor:"ground" },
  // ── the low floor and the threshold of the hall ──
  low_floor:    { x:.470, y:L.groundY, scale:SC.ground, floor:"ground" },
  threshold:    { x:(L.thresh.x0+L.thresh.x1)/2, y:L.groundY, scale:SC.ground, floor:"ground" },
  threshold_l:  { x:L.thresh.x0+L.thresh.jamb+.026, y:L.groundY, scale:SC.ground, floor:"ground" },
  threshold_r:  { x:L.thresh.x1-L.thresh.jamb-.026, y:L.groundY, scale:SC.ground, floor:"ground" },
  hall_beyond:  { x:(L.thresh.x0+L.thresh.x1)/2, y:L.groundY-.030, scale:SC.ground*.86, floor:"hall" },
  bench:        { x:(L.bench.x0+L.bench.x1)/2, y:L.groundY, scale:SC.ground, floor:"ground" },
};
export function stationAt(name){
  const s = STATIONS[name];
  if (!s) throw new Error(`[upper-chamber-and-stair] unknown station "${name}" — `+
                          `have: ${Object.keys(STATIONS).join(", ")}`);
  return { ...s };
}
/** the descent, as one parameter 0→1: chamber door → hall threshold.
    Scenes ramp `u` over the beat instead of hand-placing eleven steps. */
const DESCENT = ["chamber_door","stair_head","stair_upper","landing","stair_lower",
                 "stair_foot","low_floor","threshold"];
export function descentAt(u){
  const t = clamp(u,0,1) * (DESCENT.length-1);
  const i = Math.min(DESCENT.length-2, Math.floor(t)), f = t-i;
  const a = STATIONS[DESCENT[i]], b = STATIONS[DESCENT[i+1]];
  return { x:lerp(a.x,b.x,f), y:lerp(a.y,b.y,f), scale:lerp(a.scale,b.scale,f),
           from:DESCENT[i], to:DESCENT[i+1] };
}

const ANCHORS = {};
for (const [n,s] of Object.entries(STATIONS)) ANCHORS[n] = { x:+s.x.toFixed(4), y:+s.y.toFixed(4) };
ANCHORS["entrance:stair"]      = ANCHORS.stair_foot;
ANCHORS["entrance:hall"]       = ANCHORS.threshold;
ANCHORS["exit:hall"]           = ANCHORS.threshold;
ANCHORS["exit:chamber-door"]   = ANCHORS.chamber_door;
ANCHORS["prop:lamp"]           = { x:L.lamp.x, y:L.lamp.bowl-.014 };
ANCHORS["prop:chest-lid"]      = { x:(L.chest.x0+L.chest.x1)/2, y:L.chest.top };
ANCHORS["prop:peg"]            = { x:L.peg.x, y:L.peg.y+.026 };
ANCHORS["camera:wide"]         = { x:.50, y:.50 };
ANCHORS["camera:bed"]          = { x:.78, y:.40 };
ANCHORS["camera:stair"]        = { x:.26, y:.66 };
ANCHORS["camera:threshold"]    = { x:.62, y:.78 };

const node = (state) => ({ preview:{ state, t:0.4, status:MODES[state].status } });

export const asset = {
  id:"location.upper-chamber-and-stair",
  type:"LOCATION",
  name:"Upper Chamber and Stair",
  statusWord:"SLEEPING",
  scene:"OD-B23-S01",
  section:"cutaway",
  adjoins:{ "location.megaron-hall":{ via:"threshold", station:"stair_up" } },

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  stations:STATIONS,
  zones:{
    "walkable:chamber": { x0:.425, y0:.440, x1:.912, y1:.462 },
    "walkable:ground":  { x0:.410, y0:.870, x1:.912, y1:.892 },
    "walkable:stair":   { x0:.090, y0:.455, x1:.400, y1:.892 },
    "bed:surface":      { x0:.665, y0:.360, x1:.896, y1:.404 },
    "threshold":        { x0:.537, y0:.575, x1:.703, y1:.892 },
    "landing":          { x0:.083, y0:.640, x1:.215, y1:.660 },
    "occlude:understair":{ x0:.085, y0:.740, x1:.400, y1:.892 },
    "occlude:plinth":   { x0:.045, y0:.885, x1:.955, y1:.935 },
  },

  /* ONE set. The channel is `state`; the chamber, the stair and the threshold
     are three parts of one room, never three locations. */
  states:{
    initial:"night",
    nodes:{
      night:      node("night"),
      waking:     node("waking"),
      dressing:   node("dressing"),
      descent:    node("descent"),
      first_sight:node("first_sight"),
      dawn:       node("dawn"),
    },
    edges:[["night","waking"],["waking","dressing"],["dressing","descent"],
           ["descent","first_sight"],["first_sight","dawn"],["dawn","night"],
           ["waking","night"],["descent","dressing"]],
  },
  channels:["state","light","lamp","door","shutters","camera","t"],

  preview:()=>({ state:"night", t:0.4, status:"SLEEPING", progress:.20 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones }; },
};
export default asset;
