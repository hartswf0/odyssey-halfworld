/* location.hand-mills-and-grain-room — THE MILL HOUSE OF ODYSSEUS' PALACE.
   ADDITIVE, Book XX. Creates nothing but itself; modifies nothing.

   WHY THIS FILE EXISTS. Odyssey XX.105–121: twelve women grind the wheat and
   barley for the suitors' bread in the mill house beside the hall. Eleven have
   finished and gone to sleep; ONE, the weakest, is still turning her stone
   before dawn when Zeus thunders out of a clear sky, and it is HER prayer —
   "let this be the suitors' last supper" — that Odysseus, lying awake in the
   portico, hears through the doorway. So this room is not scenery: it is an
   acoustic instrument. Two openings carry sound, and they are load-bearing —
     · door_hall   the doorway through to the megaron (her voice goes out)
     · roof_vent   the smoke/louvre slot (Zeus' thunder comes in)
   Both are drawn, both are anchors, and the `sound` layer draws the two
   channels as an explicit diagram so a scene can show what travels where.

   THIS IS NOT THE HALL AND NOT THE HUT. The great hall is
   location.megaron-hall (states day|feast|night|contest|battle|aftermath|
   cleaned) and the swineherd's hut is location.eumaeus-hut-interior. The mill
   house is a separate service room off the hall — twelve saddle mills in two
   staggered ranks either side of a carrying aisle — so it gets its own file
   and its own plan. It shares the megaron's projection law exactly, so a
   figure blocked here and a figure blocked in the hall stand on one floor and
   the two rooms can be intercut without the ground shifting.

   STATES (state.state, default "night") — each changes what is DRAWN:
     night     eleven mills stopped, ONE turning, lamp lit, hall doorway dark
     grinding  all twelve turning, day light, dust thick   (the working day)
     stopped   all twelve still, meal heaped, day light     (work finished)
     empty     swept out: no meal, no sacks, bare stones    (before the harvest)

   SOLID tone + hard contour only; the engine dotify pass supplies the
   halftone. NO characters baked in — the worker positions are MATS.
   Verify: node harness/render.mjs assets/location/hand-mills-and-grain-room.mjs --pipeline MESH */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";
import { makePlan } from "../../engine/blocking.mjs";

/* ---- the projection, identical to megaron-hall -------------------------
   x = 0.5 + (x-0.5)(0.42 + 0.58 z)      y = 0.50 + 0.46 z^1.08     README §5
   project() clamps z for FIGURES; the room shell uses the same formula
   unclamped so walls can run past the near clip. Every station still goes
   through the plan's own at(). */
const SPREAD = z => 0.42 + 0.58 * z;
const px = (x, z) => 0.5 + (x - 0.5) * SPREAD(z);
const py = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const HORIZON = 0.50;

/* ---- THE PLAN ------------------------------------------------------------
   Authored here (there is no scenes/_plans/mill-house.mjs and this file may
   not create one). Exported so OD-B20-S02 can block through it by name
   instead of inventing anchors. x: 0 left..1 right, z: 0 far..1 near. */
/* THE TWELVE: three ranks of four, not two files of six. Six mills deep on a
   side crowd in projection — Y(.24)..Y(.84) is 0.29 of the frame, and one mill
   is 0.10 of it tall, so the file silts up into an unreadable reef. Three
   ranks of four give every stone clear air, and four across (two, aisle, two)
   is countable at a glance. The outer stone of each rank is set back half a
   step so a rank never reads as one bar across the room. */
const ROWS = [0.34, 0.58, 0.82];
const COLS = [
  { x:0.300, dz: 0.00, side:-1 },   // inner left  — the aisle side
  { x:0.700, dz: 0.00, side: 1 },   // inner right
  { x:0.110, dz:-0.05, side:-1 },   // outer left, set back
  { x:0.890, dz:-0.05, side: 1 },   // outer right, set back
];
const MILLS = [];
for (const rz of ROWS) for (const c of COLS) MILLS.push({ x:c.x, z:rz + c.dz, side:c.side });
/* draw order is far→near; mill_01 stays the inner stone of the FAR rank, the
   one nearest the doorway — that is the weary woman's. */
const MILL_ORDER = MILLS.map((m,i)=>i).sort((a,b)=> MILLS[a].z - MILLS[b].z);

const stations = {
  door_hall:  { x:.50, z:.10 },   // through to the megaron — her voice goes out here
  threshold:  { x:.50, z:.18 },   // a step inside the mill house
  listener:   { x:.50, z:.06 },   // where a body in the hall stands to hear (outside)
  aisle_far:  { x:.50, z:.32 },
  aisle_mid:  { x:.50, z:.58 },
  aisle_near: { x:.50, z:.86 },
  bin_left:   { x:.15, z:.17 },   // grain bins, split either side of the doorway
  bin_right:  { x:.85, z:.17 },
  /* the two floor props sit at the NEAR clip, in the bottom corners. They are
     drawn after the mills, so they have to be nearer than every mill or they
     would occlude a rank that stands in front of them. */
  sieves:     { x:.045, z:.94 },  // sieves and the meal shovel, near left
  lamp:       { x:.97, z:.44 },   // the night lamp on its bracket
  meal_store: { x:.955, z:.96 },  // finished flour, sacked, near right
  /* CONTACT PAIR — two bodies that touch must not resolve to one point. */
  aisle_l:    { x:.44, z:.70 },
  aisle_r:    { x:.56, z:.70 },
};
MILLS.forEach((m, i) => {
  const n = String(i + 1).padStart(2, "0");
  stations[`mill_${n}`] = { x:m.x, z:m.z };
  // the worker kneels in FRONT of her stone, facing it — never inside it,
  // and never beside it, where she would land on the next mill along.
  stations[`mat_${n}`]  = { x:m.x, z:m.z + 0.085 };
});
stations.mill_weary = { ...stations.mill_01 };   // XX.110 — the last one still turning
stations.mat_weary  = { ...stations.mat_01 };

export const millHouse = makePlan({
  id:"mill-house",
  name:"The Mill House at Ithaca",
  notes:"Two openings are load-bearing and must not move: door_hall carries the " +
        "mill woman's prayer out to Odysseus in the portico (XX.120), and roof_vent " +
        "lets Zeus' thunder in (XX.103). mill_01 / mat_01 is the weary woman's stone — " +
        "the one still turning when the other eleven have stopped.",
  stations,
  fixtures:[
    { id:"mill_rank", kind:"prop", along:["mill_01","mill_12"], count:12,
      note:"twelve saddle mills, two staggered ranks of six either side of the aisle" },
    { id:"mill_lamp", kind:"prop", at:"lamp" },
  ],
});

const params = {
  plan:"mill-house",
  mills:12,
  roofRise:0.17,      // low service roof — this is not the hall
  roofRake:0.22,
  aisleHalf:0.145,    // half-width of the carrying aisle, in PLAN x
  doorHalf:0.115,     // half-width of the doorway to the megaron, in PLAN x
  doorHeight:0.24,
  beams:3, vents:2, sacks:3,
  millHalf:0.066,     // half-width of one mill bed, in PLAN x
};
const ceilY = z => HORIZON - (params.roofRise + params.roofRake * Math.pow(z, 1.08));

/* ---- the state channel --------------------------------------------------- */
const MODES = {
  night:    { status:"ONE TURNING", turning:[0],           floorL:1, doorL:4, ventL:5, lamp:true,  dust:"low",  meal:"heaped", sacks:"full", flour:true  },
  grinding: { status:"TWELVE",      turning:[0,1,2,3,4,5,6,7,8,9,10,11], floorL:1, doorL:1, ventL:0, lamp:false, dust:"high", meal:"heaped", sacks:"full", flour:true  },
  stopped:  { status:"SILENT",      turning:[],            floorL:1, doorL:1, ventL:0, lamp:false, dust:"none", meal:"heaped", sacks:"full", flour:true  },
  empty:    { status:"SWEPT",       turning:[],            floorL:1, doorL:1, ventL:0, lamp:false, dust:"none", meal:"none",   sacks:"none", flour:false },
};

const LAYERS = ["shell","roof","farwall","door","bins","mills","mats","stores","lamp","dust","sound"];

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "night";
  const M    = MODES[mode];
  const T    = (st && st.t) || 0;
  const layers = (st && st.layers) || LAYERS;
  const has = l => layers.includes(l);

  const S  = l => toneSolid(inkLevel(clamp(Math.round(l), 0, 7)));
  const X  = (x, z) => px(x, z) * W;
  const Y  = z => py(z) * H;
  const Cy = z => ceilY(z) * H;
  const SZ = z => 0.60 + 0.50 * clamp(z, 0.08, 1);
  const A  = n => { const p = millHouse.at(n); return { x:p.x*W, y:p.y*H, d:p.d, s:0.60+0.50*p.d }; };
  const R  = rnd(20205);

  /* a rectangle of FLOOR in plan space, optionally lifted off it */
  const quad = (x0,x1,z0,z1,h0=0,h1=0) => () => {
    const P = [[x0,z0,h0],[x1,z0,h0],[x1,z1,h1],[x0,z1,h1]];
    P.forEach(([x,z,h],i)=>{ const XX=X(x,z), YY=Y(z)-h*SZ(z)*H;
      if(i===0) g.moveTo(XX,YY); else g.lineTo(XX,YY); });
    g.closePath();
  };
  const rail = (xPlan, yf, z0, z1, n=20) => {
    for(let i=0;i<=n;i++){ const z=lerp(z0,z1,i/n); g.lineTo(X(xPlan,z), yf(z)*H); }
  };
  /* a box standing on the floor: top face + near face. z1 is the NEAR edge. */
  const planBox = (x0,x1,z0,z1,h,topL,frontL,lw=4) => {
    pen.paint(quad(x0,x1,z0,z1,h,h), S(topL), lw);
    pen.paint(()=>{ const xa=X(x0,z1), xb=X(x1,z1), yb=Y(z1), yt=yb-h*SZ(z1)*H;
      g.moveTo(xa,yt); g.lineTo(xb,yt); g.lineTo(xb,yb); g.lineTo(xa,yb); g.closePath(); },
      S(frontL), lw);
  };
  /* faint arcs — the idiom the hall uses for smoke; here it is SOUND. */
  const fan = (cx,cy,r0,dir,n,alpha) => {
    g.strokeStyle=INK; g.lineWidth=4; g.globalAlpha=alpha;
    for(let i=0;i<n;i++){ const r=r0*(1+i*0.55);
      g.beginPath(); g.arc(cx, cy, r, dir-0.72, dir+0.72); g.stroke(); }
    g.globalAlpha=1;
  };

  /* ================= SHELL — ceiling, side walls, far wall, floor ========= */
  if (has("shell")){
    g.fillStyle = inkLevel(2); g.fillRect(0,0,W,H);                    // side walls
    // ceiling plane — kept PALE. It is a third of the frame; at any darker
    // level it becomes a lid of solid ink and the room stops breathing.
    pen.paint(()=>{ g.moveTo(X(0,.08), Cy(.08)); g.lineTo(X(1,.08),Cy(.08));
      rail(1,ceilY,.08,1.30); rail(0,ceilY,1.30,.08); g.closePath(); }, S(1), 5);
    // FAR WALL — the plane the hall doorway is cut into. Light: it must read.
    pen.paint(()=>{ g.rect(X(0,.08), Cy(.08), X(1,.08)-X(0,.08), Y(.08)-Cy(.08)); }, S(1), 5);
    // FLOOR
    pen.paint(()=>{ g.moveTo(X(0,.08), Y(.08)); rail(0,py,.08,1.30);
      g.lineTo(X(1,1.30), Y(1.30)); rail(1,py,1.30,.08); g.closePath(); }, S(M.floorL), 5);
    // side-wall coursing — verticals only, so nothing stripes the frame
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.22;
    for(const sd of [0,1]) for(const z of [.14,.26,.42,.62,.86,1.12]){
      g.beginPath(); g.moveTo(X(sd,z), Y(z)); g.lineTo(X(sd,z), Math.max(0, Cy(z))); g.stroke(); }
    g.globalAlpha=1;
    // the carrying aisle, dressed a shade lighter than the working floor
    const ah = params.aisleHalf;
    pen.paint(quad(.5-ah, .5+ah, .12, 1.30), S(Math.max(0, M.floorL-1)), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.26;
    g.beginPath();
    g.moveTo(X(.5-ah,.12),Y(.12)); g.lineTo(X(.5-ah,1.30),Y(1.30));
    g.moveTo(X(.5+ah,.12),Y(.12)); g.lineTo(X(.5+ah,1.30),Y(1.30));
    g.stroke(); g.globalAlpha=1;
    // BROKEN floor courses: drawn only across the aisle, never wall to wall
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.30;
    for(const z of [.22,.34,.48,.64,.82,1.04]){
      g.beginPath(); g.moveTo(X(.5-ah,z),Y(z)); g.lineTo(X(.5+ah,z),Y(z)); g.stroke(); }
    g.globalAlpha=1;
  }

  /* ================= ROOF — broken tie beams + the sound vent ============= */
  if (has("roof")){
    // each beam is drawn as TWO segments with a gap over the aisle: an
    // unbroken beam would stripe the whole frame.
    const gap = params.aisleHalf * 0.62;
    for(const z of [.18,.42,.74]){
      for(const [x0,x1] of [[0,.5-gap],[.5+gap,1]]){
        pen.paint(()=>{ const k=H*0.016*SZ(z);
          g.moveTo(X(x0,z),Cy(z)); g.lineTo(X(x1,z),Cy(z));
          g.lineTo(X(x1,z),Cy(z)+k); g.lineTo(X(x0,z),Cy(z)+k); g.closePath(); }, S(4), 3);
      }
      // the corbel that carries each half-beam, at the wall
      for(const sd of [0,1]) pen.paint(()=>{ const k=H*0.020*SZ(z), w=W*0.014*SZ(z);
        g.rect(X(sd,z) - (sd?w:0), Cy(z)+k*0.9, w, k); }, S(5), 3);
    }
    // rafters, faint, and deliberately NOT reaching the near edge
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.26;
    for(const xp of [.14,.32,.68,.86]){
      g.beginPath(); g.moveTo(X(xp,.08),Cy(.08)); g.lineTo(X(xp,.86),Cy(.86)); g.stroke(); }
    g.globalAlpha=1;
    // THE ROOF VENT — off-centre on purpose. Zeus' thunder comes in here.
    const vz0=.32, vz1=.42;
    pen.paint(()=>{ g.moveTo(X(.63,vz0),Cy(vz0)); g.lineTo(X(.75,vz0),Cy(vz0));
      g.lineTo(X(.75,vz1),Cy(vz1)); g.lineTo(X(.63,vz1),Cy(vz1)); g.closePath(); }, S(M.ventL), 5);
    pen.ink(()=>{ g.moveTo(X(.69,vz0),Cy(vz0)); g.lineTo(X(.69,vz1),Cy(vz1)); }, 3);
  }

  /* ================= FAR WALL fittings ==================================== */
  if (has("farwall")){
    // two high slots either side of the doorway, unequal — no symmetry stripe
    const wx=X(0,.08), ww=X(1,.08)-wx, top=Cy(.08);
    for(const [u,w2] of [[0.14,0.085],[0.88,0.060]]){
      pen.paint(()=>{ g.rect(wx+ww*(u-w2/2), top+H*0.028, ww*w2, H*0.036); }, S(M.ventL), 4);
    }
    // peg rail — left half only, so the span stays broken. Pegs, nothing hung:
    // hanging sieves here would collide with the grain bin below it.
    const ry = top + H*0.086;
    pen.paint(()=>{ g.rect(wx+ww*0.07, ry, ww*0.26, H*0.010); }, S(4), 3);
    for(const u of [0.11,0.19,0.29]){
      const hx = wx+ww*u;
      pen.ink(()=>{ g.moveTo(hx, ry+H*0.010); g.lineTo(hx+ww*0.014, ry+H*0.026); }, 3);
    }
  }

  /* ================= THE DOORWAY TO THE HALL ==============================
     XX.120 — the weary woman's prayer travels through this opening and
     Odysseus, lying in the portico, hears it. It is the plot of the room. */
  if (has("door")){
    const D = A("door_hall");
    const dw = (px(.5+params.doorHalf,.10) - px(.5-params.doorHalf,.10)) * W;
    const dh = params.doorHeight * D.s * H;
    const x0 = D.x - dw/2, yTop = D.y - dh;
    pen.paint(()=>{ g.rect(x0-W*0.022, yTop-H*0.026, dw+W*0.044, dh+H*0.026); }, S(3), 5); // jambs
    pen.paint(()=>{ g.rect(x0, yTop, dw, dh); }, S(M.doorL), 5);                            // opening
    // a worn stone sill, and a step down into the mill house
    pen.paint(quad(.5-params.doorHalf, .5+params.doorHalf, .14, .20, 0.022, 0.022), S(3), 4);
    pen.paint(()=>{ const z1=.20, k=0.022*SZ(z1)*H;
      g.moveTo(X(.5-params.doorHalf,z1),Y(z1)-k); g.lineTo(X(.5+params.doorHalf,z1),Y(z1)-k);
      g.lineTo(X(.5+params.doorHalf,z1),Y(z1));   g.lineTo(X(.5-params.doorHalf,z1),Y(z1));
      g.closePath(); }, S(5), 4);
    // one leaf, folded back against the left jamb — the door is never shut on her
    pen.paint(()=>{ g.rect(x0-W*0.030, yTop+H*0.006, W*0.028, dh-H*0.006); }, S(3), 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.55;
    for(let j=1;j<=3;j++){ const yy=yTop+dh*(j/4);
      g.beginPath(); g.moveTo(x0-W*0.030,yy); g.lineTo(x0-W*0.002,yy); g.stroke(); }
    g.globalAlpha=1;
  }

  /* ================= GRAIN BINS — split either side of the doorway ======== */
  if (has("bins")){
    const bin = (x0, x1, h) => {
      const z0=.12, z1=.24;
      planBox(x0, x1, z0, z1, h, 1, 3, 5);
      // lid boards on the top face, broken into three
      const zt=z0+0.02;
      for(const u of [0.30,0.68]){
        const bx=lerp(x0,x1,u);
        pen.ink(()=>{ g.moveTo(X(bx,zt), Y(zt)-h*SZ(zt)*H);
                      g.lineTo(X(bx,z1), Y(z1)-h*SZ(z1)*H); }, 3);
      }
      // one hoop band on the near face
      const hh=h*SZ(z1)*H, ya=Y(z1);
      pen.paint(()=>{ g.rect(X(x0,z1), ya-hh*0.52, X(x1,z1)-X(x0,z1), H*0.011); }, S(5), 2);
    };
    // deliberately unequal: two bins of one height would bar the far wall
    bin(.045, .265, 0.105);
    bin(.735, .955, 0.078);
  }

  /* ================= THE TWELVE MILLS =====================================
     One saddle mill = plinth + bed stone + runner stone + hopper + turning
     handle + a meal trough on the AISLE side. Placed by station, never by
     hand. Ranks are staggered in z so the two rows never read as one bar. */
  if (has("mills")){
    /* PASS A — the flour. All twelve pools go down BEFORE any stone: drawn
       per-mill they are paper-white fills, so a near mill's pool punched a
       hole through the plinth of the mill behind it. */
    if (M.flour) MILL_ORDER.forEach((i) => {
      const m = MILLS[i], s = SZ(m.z);
      const rx = params.millHalf * 0.88 * SPREAD(m.z) * W;
      pen.fillPath(()=>{ g.ellipse(X(m.x,m.z), Y(m.z)+H*0.006*s, rx*1.30, rx*0.34*1.55, 0,0,7); },
        inkLevel(0));
    });
    /* PASS B — the stones */
    MILL_ORDER.forEach((i) => {
      const m = MILLS[i];
      const turning = M.turning.includes(i);
      const x=m.x, z=m.z, side=m.side;
      const s = SZ(z), sp = SPREAD(z);
      const bx = X(x,z), by = Y(z);
      const mh = params.millHalf;
      const rx = mh * 0.88 * sp * W, ry = rx * 0.30;
      /* the stand has to be TALL. At 0.026 the whole mill collapsed into
         thirty pixels of stacked outline and the rank read as flat plates;
         a quern stands at working height and its block face is what carries
         the object in the dot lattice. */
      const plinthH = 0.068;

      // --- plinth: light top, one mid-dark near face. Nothing else.
      /* FOUR ascending values stacked on one axis is what makes a mill read
         through the dot lattice: pale stand → mid bed slab → dark runner →
         black handle. Same tone on stand and slab and the two merge. */
      planBox(x-mh, x+mh, z-0.032, z+0.032, plinthH, 0, 1, 4);
      const topY = by - plinthH * s * H;
      // --- the bed stone: a saddle slab overhanging the stand on every side
      pen.paint(()=>{ g.ellipse(bx, topY, rx, ry, 0,0,7); }, S(2), 5);
      // --- the runner: a short DRUM, not a disc — wall plus top face, so it
      //     has thickness. Twelve dark drums in three ranks is the count.
      const drumH = H*0.026*s, drumR = rx*0.60, runY = topY - drumH;
      pen.paint(()=>{ g.rect(bx-drumR, runY, drumR*2, drumH + ry*0.55); }, S(5), 4);   // wall
      pen.paint(()=>{ g.ellipse(bx, runY, drumR, ry*0.55, 0,0,7); }, S(4), 4);         // top face
      pen.paint(()=>{ g.ellipse(bx, runY, drumR*0.28, ry*0.18, 0,0,7); }, S(0), 2);    // the eye
      // --- the turning handle: the readable signature of a hand mill.
      //     It stands on the AISLE side, where the woman kneels to work it.
      const ang = turning ? 0.40*Math.sin(T*2.2 + i) : (i%2 ? 0.20 : -0.15);
      const hx0 = bx - side*drumR*0.78, hy0 = runY;
      const hx1 = hx0 + Math.sin(ang)*W*0.017*s, hy1 = hy0 - H*0.070*s;
      pen.ink(()=>{ g.moveTo(hx0,hy0); g.lineTo(hx1,hy1); }, Math.max(3, W*0.0060*s));
      pen.paint(()=>{ g.ellipse(hx1, hy1, W*0.011*s, H*0.009*s, 0,0,7); }, S(5), 3);
      // --- the sweep of a stone actually being turned
      if (turning){
        g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.34;
        for(const k of [1.16,1.38]){ g.beginPath();
          g.ellipse(bx, runY, drumR*k, ry*0.62*k, 0, Math.PI*0.06, Math.PI*1.12); g.stroke(); }
        g.globalAlpha=1;
      }
      // --- the meal that has fallen from the stone, caught at the stand's foot
      if (M.meal==="heaped" && i%3===0){
        const tz = z + 0.052, tX = X(x + side*0.026, tz), tY = Y(tz);
        pen.paint(()=>{ g.ellipse(tX, tY, W*0.020*SPREAD(tz), H*0.011*SZ(tz), 0,0,7); }, S(2), 3);
      }
    });
  }

  /* ================= WORKER POSITIONS — MATS, not figures ================= */
  if (has("mats")){
    MILL_ORDER.forEach((i) => {
      const nm = `mat_${String(i+1).padStart(2,"0")}`;
      const p = millHouse.stations[nm];
      const working = M.turning.includes(i);
      // a plain woven mat: light field, hard contour, ONE rule. A worker
      // position is stated by the mat — never by a baked-in body.
      pen.paint(quad(p.x-0.038, p.x+0.038, p.z-0.020, p.z+0.020), S(working?4:2), 3);
    });
  }

  /* ================= STORES — sacks of finished meal, sieves, shovel ====== */
  if (has("stores")){
    if (M.sacks!=="none"){
      const base = millHouse.stations.meal_store;
      for(let i=0;i<params.sacks;i++){
        const sx = base.x + (i%3)*0.036 - 0.036, sz = base.z + Math.floor(i/3)*0.070;
        const cx2 = X(sx,sz), cy2 = Y(sz), k = SZ(sz);
        pen.paint(()=>{
          g.moveTo(cx2-W*0.030*k, cy2);
          g.bezierCurveTo(cx2-W*0.040*k, cy2-H*0.060*k, cx2-W*0.020*k, cy2-H*0.078*k, cx2, cy2-H*0.080*k);
          g.bezierCurveTo(cx2+W*0.020*k, cy2-H*0.078*k, cx2+W*0.040*k, cy2-H*0.060*k, cx2+W*0.030*k, cy2);
          g.closePath(); }, S(2), 4);
        pen.paint(()=>{ g.ellipse(cx2, cy2-H*0.080*k, W*0.011*k, H*0.008*k, 0,0,7); }, S(5), 3); // tied neck
        pen.ink(()=>{ g.moveTo(cx2-W*0.016*k, cy2-H*0.040*k); g.lineTo(cx2+W*0.016*k, cy2-H*0.046*k); }, 2);
      }
    }
    // two sieves leaning on the left wall + the long meal shovel
    const sv = millHouse.stations.sieves, sX=X(sv.x,sv.z), sY=Y(sv.z), sk=SZ(sv.z);
    for(let i=0;i<2;i++) pen.paint(()=>{
      g.ellipse(sX+i*W*0.012, sY-H*0.020-i*H*0.026*sk, W*0.030*sk, H*0.038*sk, 0.28, 0,7); }, S(1), 5);
    pen.ink(()=>{ g.moveTo(sX+W*0.056, sY); g.lineTo(sX+W*0.086, sY-H*0.170*sk); }, 5);
    pen.paint(()=>{ g.ellipse(sX+W*0.089, sY-H*0.184*sk, W*0.018, H*0.024, 0.28, 0,7); }, S(2), 4);
  }

  /* ================= THE NIGHT LAMP ======================================= */
  if (has("lamp")){
    const p = millHouse.stations.lamp, lx=X(p.x,p.z), ly=Y(p.z)-H*0.185*SZ(p.z);
    pen.paint(()=>{ g.rect(lx-W*0.018, ly-H*0.010, W*0.036, H*0.014); }, S(5), 3);   // bracket
    pen.paint(()=>{ g.moveTo(lx-W*0.024, ly+H*0.004); g.lineTo(lx+W*0.024, ly+H*0.004);
      g.lineTo(lx+W*0.012, ly+H*0.026); g.lineTo(lx-W*0.012, ly+H*0.026); g.closePath(); }, S(4), 4);
    if (M.lamp){
      const fh = H*0.030*(0.80+0.24*Math.abs(Math.sin(T*2.6)));
      g.fillStyle=inkLevel(7); g.beginPath();
      g.moveTo(lx-W*0.009, ly+H*0.002); g.lineTo(lx+W*0.002, ly+H*0.002-fh);
      g.lineTo(lx+W*0.009, ly+H*0.002); g.closePath(); g.fill();
      // the lamp's reach, stated as a light pool on the floor, not a gradient
      pen.paint(()=>{ g.ellipse(lx-W*0.026, Y(p.z)+H*0.006, W*0.044, H*0.016, 0,0,7); }, S(0), 2);
    }
  }

  /* ================= FLOUR DUST — light specks, never a grey wash ========= */
  if (has("dust") && M.dust!=="none"){
    const n = M.dust==="high" ? 120 : 44;
    for(let i=0;i<n;i++){
      const src = MILLS[Math.floor(R()*MILLS.length)];
      const live = M.dust==="high" || M.turning.includes(MILLS.indexOf(src));
      if (!live && R()<0.82) continue;
      const dx = X(src.x + (R()-0.5)*0.18, src.z);
      const dy = Y(src.z) - H*(0.05 + R()*0.30)*SZ(src.z);
      const rr = W*0.0022 + W*0.0034*R();
      pen.fillPath(()=>{ g.arc(dx, dy, rr, 0, 7); }, inkLevel(R()<0.4 ? 3 : 2));
    }
  }

  /* ================= THE TWO SOUND CHANNELS ==============================
     Drawn as a diagram, faint, on its own layer: a scene can hide it. The
     room exists because these two paths exist. */
  if (has("sound")){
    const w = A("mill_weary"), d = A("door_hall");
    fan(w.x, w.y - H*0.05, W*0.045, Math.atan2(d.y-w.y, d.x-w.x), 3, 0.30);   // her voice → the hall
    const vX = X(.69,.37), vY = Cy(.37);
    fan(vX, vY, W*0.040, Math.PI/2, 3, 0.24);                                  // the vent → the room
    // the sill mark her voice crosses
    pen.ink(()=>{ g.moveTo(X(.42,.20), Y(.20)); g.lineTo(X(.58,.20), Y(.20)); }, 4);
  }
}

/* ---- anchors are DERIVED from the plan, never authored ------------------- */
const ANCHORS = {};
for (const n of millHouse.names()){
  const p = millHouse.at(n);
  ANCHORS[n] = { x:+p.x.toFixed(4), y:+p.y.toFixed(4) };
}
ANCHORS["entrance:hall"]  = ANCHORS.door_hall;
ANCHORS["exit:hall"]      = ANCHORS.door_hall;
ANCHORS["threshold:hall"] = ANCHORS.threshold;
ANCHORS["sound:out"]      = ANCHORS.door_hall;      // the prayer leaves here
ANCHORS["sound:in"]       = { x:.6100, y:.3300 };   // the roof vent — thunder enters here
ANCHORS["camera:wide"]    = { x:.50, y:.50 };
ANCHORS["camera:door"]    = { x:.50, y:.56 };
ANCHORS["camera:weary"]   = { x:.38, y:.60 };
ANCHORS["camera:aisle"]   = { x:.50, y:.80 };

const node = (state) => ({ preview:{ state, t:0.4, status:MODES[state].status } });

export const asset = {
  id:"location.hand-mills-and-grain-room",
  type:"LOCATION",
  name:"Hand Mills and Grain Room",
  statusWord:"ONE TURNING",
  scene:"OD-B20-S02",
  plan:"mill-house",
  adjacentTo:"location.megaron-hall",

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  zones:{
    walkable:        { x0:.30, y0:.55, x1:.70, y1:.98 },
    "aisle:carry":   { x0:.36, y0:.55, x1:.64, y1:.98 },
    "rank:left":     { x0:.06, y0:.58, x1:.32, y1:.96 },
    "rank:right":    { x0:.68, y0:.58, x1:.94, y1:.96 },
    "bins:far":      { x0:.24, y0:.53, x1:.76, y1:.58 },
    "doorway:mouth": { x0:.44, y0:.53, x1:.56, y1:.58 },
    "stores:right":  { x0:.72, y0:.60, x1:.94, y1:.72 },
  },
  /* the room is ONE room; `state` is the channel. */
  states:{
    initial:"night",
    nodes:{ night:node("night"), grinding:node("grinding"), stopped:node("stopped"), empty:node("empty") },
    edges:[["grinding","night"],["night","stopped"],["stopped","grinding"],
           ["stopped","empty"],["empty","grinding"],["night","grinding"]],
  },
  channels:["state","reveal","camera","light","dust","sound","t"],

  preview:()=>({ state:"night", t:0.4, status:"ONE TURNING", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones, plan:millHouse }; },
};
export default asset;
