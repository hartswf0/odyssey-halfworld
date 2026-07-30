/* location.palace-outer-yard — THE PRIVATE SIDE YARD OF ODYSSEUS'S HOUSE: the
   strip of ground beside the megaron, between the hall's SIDE DOOR, the door of
   the arms store, and the COURTYARD GATE — the one piece of the compound the men
   in the hall cannot see into. ADDITIVE, Book XXI. Modifies nothing; shadows
   nothing.

   WHY THIS IS NOT A ROOM WE ALREADY HAVE.
     · location.megaron-hall is the great hall, INSIDE. This is outdoors.
     · location.eumaeus-hut-interior is the steading. Not this.
     · location.fight-threshold is the courtyard FRONT — standing square to the
       great doors, looking at the porch across the ring the suitors cleared.
       That set is public ground: its whole point is that a hundred men are
       watching. This set is its opposite and its neighbour — the FLANK, round
       the corner, entered by the small door in the long wall. Its whole point is
       that nobody is watching.
     · location.palace-dung-heap-and-gate is outside the precinct, on the road.
   Four different pieces of one compound; this is the only private one.

   THE SET IS THE PLOT (XXI.188–244). Odysseus takes Eumaeus and Philoetius OUT
   of the hall to test them, shows the scar, and gives three orders — the bow to
   be handed over, the courtyard gate to be locked, the women's doors to be
   secured. All three orders are geography, and the set has to hold them with no
   figure in it:

     1. THE SIGHTLINE. The hall's side door is a lit hole in a long wall, and
        what it can see is a CONE of ground swept out from its own jambs. That
        cone is PAINTED — a darker wedge of yard running out of the doorway
        down the middle of the frame. Everything else is BLIND GROUND. The oath
        is sworn outside the cone; the gate stands outside the cone; the route to
        the arms store crosses it only at its narrow root. Where a body may stand
        is therefore a fact of the paint, not a director's opinion.
        The cone is ASYMMETRIC: the leaf stands open against the LEFT jamb and
        cuts that ray short, so the doorway sees down and to its right and the
        whole west side of the yard is dead ground. That asymmetry is the only
        reason this yard is safe, so it is built into the geometry.
     2. THE WEAPON ROUTE. A broken run of dressed slabs along the wall foot from
        the hall door to the low arms door — the ground the armour was carried
        over in XIX, and will be carried back over in XXII. It is laid in the
        SET so every shot of it agrees.
     3. THE GATE. The gateway in the yard wall, with the mooring post beside it
        that the ship's cable is made fast to. The cable and its tackle are
        prop.courtyard-gate-and-cable — the set owns the OPENING, the post, the
        ring and the anchor, and paints no rope.

   PROJECTION. Every fixture is placed through the law the blocking engine uses
   (README §5), so a figure blocked on this ground stands where the paint says:
       x = 0.5 + (x-0.5)(0.42 + 0.58 z)      y = 0.50 + 0.46 z^1.08
   The station table below is a real plan (makePlan) and the ANCHORS are
   PROJECTED from it, never eyeballed. `oath_l` / `oath_c` / `oath_r` are a
   CONTACT TRIO: three men who embrace resolve to three different coordinates.

   TWO RULES THIS SET IS BUILT AROUND:
   · GROUND FIRST — the yard and its cone are laid before any masonry, or their
     fill erases the wall feet and the whole compound stands in air.
   · NOTHING SPANS THE FRAME — the long flank is laid in bays capped one by one,
     the roof is three stepped blocks, the yard wall is staggered in depth, and
     the route is slabs with gaps. No horizontal rule crosses the picture.

   STATES (state.state, default "private"):
     private   day, side door ajar, gate standing open, the cone drawn
     oath      the trodden patch scuffed by three pairs of feet (XXI.222)
     armed     the arms door open, drag marks along the weapon route
     barred    the gate leaves shut and barred, the post ring taken up
     night     one level darker, both doors shut, the yard unlit

   SOLID tone + hard contour only; the engine dotify pass supplies the halftone.
   NO characters baked in — the herdsmen get footprints and anchors, not paint.
   Verify: node harness/render.mjs assets/location/palace-outer-yard.mjs --pipeline MESH */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";
import { makePlan } from "../../engine/blocking.mjs";

/* ---- the law, unclamped (the set shell runs past where a body may stand) -- */
const SPREAD  = z => 0.42 + 0.58 * z;
const px      = (x, z) => 0.5 + (x - 0.5) * SPREAD(z);
const py      = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const SZu     = z => 0.60 + 0.50 * clamp(z, 0.08, 1);
const HORIZON = 0.50;

/* the yard wall, bay by bay, STAGGERED IN DEPTH. One z gives one straight foot
   and one straight head clean across the frame; four z values give a broken
   silhouette on both edges. Bay 1 carries the gateway. */
const YWALL = [
  { x0:0.625, x1:0.755, z:0.355, h:0.096 },
  { x0:0.762, x1:1.045, z:0.440, h:0.138, gate:true },
  { x0:1.052, x1:1.240, z:0.390, h:0.104 },
  { x0:1.000, x1:1.300, z:0.560, h:0.128 },
];
const GATE = YWALL[1];
const GATE_L = 0.800, GATE_R = 1.008;          // the opening, between the piers

const params = {
  flankZ:0.16,               // the megaron's long side wall
  flankBays:6,
  hallDoor:{ x:0.395, half:0.075, h:0.235 },   // the side door — the hall's eye
  armsDoor:{ x:0.095, half:0.058, h:0.152 },   // the low door of the arms store
  cone:{ x:0.400, z:0.310, left:-0.14, right:0.20, run:0.85 }, // the sightline
  wall:YWALL,
  gate:{ l:GATE_L, r:GATE_R, z:GATE.z, h:0.152 },
  post:{ x:0.755, z:0.500, h:0.108 },          // the cable is the PROP's, not ours
  route:3,                                     // dressed slabs, hall door -> store
  routeLine:{ x0:0.300, x1:0.108, z0:0.402, z1:0.282 },
  oath:{ x:0.645, z:0.690, rx:0.120, rz:0.076 },
  wood:{ x:0.900, z:0.930 },
  jar:{ x:0.300, z:0.862, r:0.048 },
};

/* ---- the plan. Stations are named; the anchors are projected from here. --- */
const HD = params.hallDoor, AD = params.armsDoor, OA = params.oath;
export const plan = makePlan({
  id:"palace-outer-yard", name:"Palace outer yard",
  notes:"The private flank of the compound: side door, arms store, courtyard gate. "
       +"The painted cone is what the hall can see; stand outside it.",
  stations:{
    door_hall:   { x:HD.x,  z:params.flankZ },
    door_sill:   { x:HD.x,  z:params.flankZ+0.072 },
    door_foot:   { x:0.372, z:params.flankZ+0.178 },
    arms_door:   { x:AD.x,  z:params.flankZ },
    arms_sill:   { x:AD.x,  z:params.flankZ+0.078 },
    route_a:     { x:0.282, z:0.390 },
    route_mid:   { x:0.204, z:0.342 },
    route_b:     { x:0.126, z:0.294 },
    corner:      { x:0.612, z:0.248 },       // the re-entrant angle of the yard
    lee_wall:    { x:0.700, z:0.520 },       // the wall foot, deep out of sight
    oath_l:      { x:OA.x-0.090, z:OA.z+0.030 },   // CONTACT TRIO — the embrace
    oath_c:      { x:OA.x,       z:OA.z-0.020 },
    oath_r:      { x:OA.x+0.090, z:OA.z+0.030 },
    oath_watch:  { x:0.560, z:0.830 },       // whoever keeps the doorway in view
    gate_mouth:  { x:(GATE_L+GATE_R)/2, z:GATE.z },
    gate_sill:   { x:(GATE_L+GATE_R)/2 - 0.020, z:GATE.z+0.070 },
    gate_post:   { x:params.post.x, z:params.post.z },
    yard_centre: { x:0.620, z:0.620 },
    yard_near:   { x:0.660, z:0.940 },
    seen_ground: { x:0.420, z:0.750 },       // INSIDE the cone — do not stand here
    wood_stack:  { x:params.wood.x, z:params.wood.z },
    jar:         { x:params.jar.x,  z:params.jar.z },
  },
  fixtures:[
    { id:"sightline", kind:"cone", from:"door_hall",
      left:params.cone.left, right:params.cone.right },
    { id:"weapon-route", kind:"path", from:"door_foot", to:"arms_sill" },
  ],
});

/* ---- the state channel --------------------------------------------------- */
const MODES = {
  private:{ lift:0, status:"OUT OF SIGHT", door:"ajar", arms:"shut", gate:"open",
            cone:true, marks:false, drag:false, ring:false, litter:false },
  oath:   { lift:0, status:"SWORN",        door:"ajar", arms:"shut", gate:"open",
            cone:true, marks:true,  drag:false, ring:false, litter:false },
  armed:  { lift:0, status:"ARMS MOVED",   door:"ajar", arms:"open", gate:"open",
            cone:true, marks:true,  drag:true,  ring:false, litter:true  },
  barred: { lift:0, status:"GATE BARRED",  door:"ajar", arms:"shut", gate:"shut",
            cone:true, marks:true,  drag:true,  ring:true,  litter:true  },
  night:  { lift:1, status:"UNLIT",        door:"shut", arms:"shut", gate:"shut",
            cone:false,marks:false, drag:false, ring:true,  litter:false },
};

/* GROUND FIRST: "yard" and "sight" precede every built thing. */
const LAYERS = ["sky","yard","sight","flank","roof","halldoor","armsdoor",
                "wall","gate","route","oath","post","kerb","litter","foreground"];

function drawSet(ctx, W, H, st){
  const pen  = makePen(ctx, { outline:true });
  const g    = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "private";
  const M    = MODES[mode];
  const layers = (st && st.layers) || LAYERS;
  const has  = l => layers.includes(l);
  const R    = rnd(52108);

  const tn = l => inkLevel(clamp(Math.round(l + M.lift), 0, 7));
  const S  = l => toneSolid(tn(l));
  const X  = (x, z) => px(x, z) * W;
  const Y  = z => py(z) * H;
  const SZ = z => SZu(z);

  /* a rectangle of GROUND in plan space, optionally lifted off it */
  const quad = (x0,x1,z0,z1,h0=0,h1=0) => () => {
    [[x0,z0,h0],[x1,z0,h0],[x1,z1,h1],[x0,z1,h1]].forEach(([x,z,h],i)=>{
      const XX = X(x,z), YY = Y(z) - h*SZ(z)*H;
      if(i===0) g.moveTo(XX,YY); else g.lineTo(XX,YY);
    });
    g.closePath();
  };
  /* a slab standing on the ground: top face + near face */
  const planBox = (x0,x1,z0,z1,h,topL,frontL,lw=4) => {
    pen.paint(quad(x0,x1,z0,z1,h,h), S(topL), lw);
    pen.paint(()=>{ const xa=X(x0,z1), xb=X(x1,z1), yb=Y(z1), yt=yb-h*SZ(z1)*H;
      g.moveTo(xa,yt); g.lineTo(xb,yt); g.lineTo(xb,yb); g.lineTo(xa,yb); g.closePath(); },
      S(frontL), lw);
  };
  /* a broken run of ground line — never a rule all the way across the frame */
  const dashRow = (z, x0, x1, n, alpha=0.24) => {
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=alpha;
    for(let i=0;i<n;i++){
      const a = lerp(x0,x1,i/n), b = lerp(x0,x1,(i+0.56)/n);
      g.beginPath(); g.moveTo(X(a,z),Y(z)); g.lineTo(X(b,z),Y(z)); g.stroke();
    }
    g.globalAlpha=1;
  };
  /* a point on one edge of the sightline cone, in PLAN space */
  const C = params.cone;
  const coneEdge = (side, u) => ({
    x: C.x + (side<0 ? C.left : C.right) * u,
    z: C.z + C.run * u,
  });

  const FZ = params.flankZ;
  const flankBase = Y(FZ);

  /* ================= SKY ================================================== */
  if (has("sky")){ g.fillStyle = inkLevel(M.lift ? 2 : 1); g.fillRect(0,0,W,HORIZON*H); }

  /* ================= THE YARD floor — BEFORE anything stands on it ========= */
  if (has("yard")){
    g.fillStyle = tn(1); g.fillRect(0, HORIZON*H, W, H-HORIZON*H);
    /* beaten earth in two unequal patches — FILLED, never outlined: an outlined
       ground quad lays a rule clean across the frame. */
    g.fillStyle = tn(2);
    g.beginPath(); quad(0.30, 0.98, 0.30, 0.52)(); g.fill();
    g.beginPath(); quad(0.62, 1.26, 0.54, 0.78)(); g.fill();
    g.beginPath(); quad(-0.14, 0.26, 0.36, 0.66)(); g.fill();   // the west dead ground
    for(const z of [0.58, 0.80, 1.02]) dashRow(z, 0.10, 0.94, 5, 0.15);
  }

  /* ================= THE SIGHTLINE — the one argument of the set ===========
     The cone the hall's side door can see out of. It is GROUND, so it is laid
     with the ground; every station in the plan is either in it or out of it. */
  if (has("sight") && M.cone){
    const N = 14;
    g.fillStyle = tn(3);
    g.beginPath();
    for(let i=0;i<=N;i++){ const p = coneEdge(-1, i/N*1.20);
      const XX=X(p.x,p.z), YY=Y(p.z); if(i===0) g.moveTo(XX,YY); else g.lineTo(XX,YY); }
    for(let i=N;i>=0;i--){ const p = coneEdge(1, i/N*1.20);
      g.lineTo(X(p.x,p.z), Y(p.z)); }
    g.closePath(); g.fill();
    /* the two rays stated as BROKEN lines: the edge of what can be seen is a
       hard fact, but a solid ruled line across the yard reads as a wire. */
    for(const side of [-1,1]){
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.42;
      for(let i=0;i<9;i++){
        const a = coneEdge(side, (i+0.10)/9*1.20), b = coneEdge(side, (i+0.62)/9*1.20);
        g.beginPath(); g.moveTo(X(a.x,a.z),Y(a.z)); g.lineTo(X(b.x,b.z),Y(b.z)); g.stroke();
      }
      g.globalAlpha=1;
    }
  }

  /* ================= THE MEGARON FLANK — the long wall, bay by bay =========
     Each bay capped on its own, with a gap and a pilaster between: one coping
     course would stripe the whole picture. */
  if (has("flank")){
    const N = params.flankBays, x0=-0.62, x1=0.640;
    for(let i=0;i<N;i++){
      const a = lerp(x0,x1,i/N)+0.008, b = lerp(x0,x1,(i+1)/N)-0.008;
      const mid = (a+b)/2;
      const rise = 0.232 + 0.026*((i*5)%3)/2;
      const top = flankBase - H*rise;
      pen.paint(()=>{ g.rect(X(a,FZ), top, X(b,FZ)-X(a,FZ), flankBase-top); }, S(2), 5);
      pen.paint(()=>{ g.rect(X(a,FZ)-W*0.008, top, (X(b,FZ)-X(a,FZ))+W*0.016, H*0.015); }, S(4), 4);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.20;                 // ashlar
      for(let j=1;j<=3;j++){ const y=lerp(top,flankBase,j/4);
        g.beginPath(); g.moveTo(X(a,FZ),y); g.lineTo(X(b,FZ),y); g.stroke(); }
      g.beginPath(); g.moveTo(X(mid,FZ),top+H*0.018); g.lineTo(X(mid,FZ),flankBase); g.stroke();
      g.globalAlpha=1;
      if (i<N-1){                                                          // pilaster
        const bx = lerp(x0,x1,(i+1)/N);
        pen.paint(()=>{ g.rect(X(bx,FZ)-W*0.008, top+H*0.022, W*0.016, flankBase-top-H*0.022); }, S(3), 3);
      }
      // plinth course, per bay — the wall is terminated on the ground, not in air
      pen.paint(()=>{ g.rect(X(a,FZ), flankBase-H*0.013, X(b,FZ)-X(a,FZ), H*0.013); }, S(4), 3);
    }
    // the re-entrant return at the right end: the corner the yard turns round
    pen.paint(()=>{ g.rect(X(0.618,FZ), flankBase-H*0.208, X(0.700,FZ)-X(0.618,FZ), H*0.208); }, S(3), 5);
    pen.paint(()=>{ g.rect(X(0.612,FZ), flankBase-H*0.212, X(0.706,FZ)-X(0.612,FZ), H*0.016); }, S(5), 4);
  }

  /* ================= THE UPPER STOREY — masses that STAND ON the bays ======
     Each block runs from its own top DOWN INTO the bay tops. Drawn as a band
     floating at roof height it reads as a slab hung in the sky; drawn as mass
     it reads as a house. The skyline steps three times and no cap is shared. */
  if (has("roof")){
    const BAYTOP = flankBase - H*0.226;
    const block = (a,b,rise,tone) => {
      const top = flankBase - H*rise;
      pen.paint(()=>{ g.rect(X(a,FZ), top, X(b,FZ)-X(a,FZ), BAYTOP-top+H*0.020); }, S(tone), 5);
      pen.paint(()=>{ g.rect(X(a,FZ)-W*0.014, top, (X(b,FZ)-X(a,FZ))+W*0.028, H*0.019); }, S(4), 4);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.20;
      for(let j=1;j<=2;j++){ const y=lerp(top+H*0.024,BAYTOP,j/3);
        g.beginPath(); g.moveTo(X(a,FZ),y); g.lineTo(X(b,FZ),y); g.stroke(); }
      g.globalAlpha=1;
    };
    /* left to right the skyline steps: tall turret, LOW arms store, tall hall,
       and the corner return. The low block is where the arms door is — the
       store is legibly a lesser building than the megaron beside it. */
    block(-0.060, 0.215, 0.318, 3);         // the arms store, low
    block( 0.228, 0.600, 0.386, 2);         // the megaron, over the side door
    /* the stair turret: MASS from the ground, not a box in the air, and kept
       INSIDE the frame — the precinct wall runs on off the left edge below it,
       which is what says the compound is bigger than the shot. */
    pen.paint(()=>{ g.rect(X(-0.300,FZ), flankBase-H*0.430,
      X(-0.090,FZ)-X(-0.300,FZ), H*0.430); }, S(2), 5);
    pen.paint(()=>{ g.rect(X(-0.320,FZ), flankBase-H*0.434,
      X(-0.070,FZ)-X(-0.320,FZ), H*0.020); }, S(4), 4);
    for(const u of [-0.250,-0.140])         // two slots: the only near-black up top
      pen.paint(()=>{ g.rect(X(u,FZ)-W*0.012, flankBase-H*0.386, W*0.024, H*0.040); }, S(6), 4);
    // one high window in the hall block, off the door's centre line
    pen.paint(()=>{ g.rect(X(0.520,FZ)-W*0.014, flankBase-H*0.318, W*0.028, H*0.042); }, S(6), 4);
  }

  /* ================= THE HALL'S SIDE DOOR — the eye this yard hides from === */
  if (has("halldoor")){
    const k = SZ(FZ);
    const xL = X(HD.x-HD.half, FZ), xR = X(HD.x+HD.half, FZ);
    const dh = HD.h * k * H, yTop = flankBase - dh;
    pen.paint(()=>{ g.rect(xL-W*0.017, yTop-H*0.022, (xR-xL)+W*0.034, dh+H*0.022); }, S(3), 5); // jambs
    pen.paint(()=>{ g.rect(xL-W*0.024, yTop-H*0.028, (xR-xL)+W*0.048, H*0.026); }, S(4), 4);    // lintel
    if (M.door==="shut"){
      pen.paint(()=>{ g.rect(xL, yTop, xR-xL, dh); }, S(3), 5);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.52;
      for(let j=1;j<=4;j++){ const yy=yTop+dh*(j/5);
        g.beginPath(); g.moveTo(xL,yy); g.lineTo(xR,yy); g.stroke(); }
      g.globalAlpha=1;
      pen.paint(()=>{ g.arc(xR-(xR-xL)*0.20, yTop+dh*0.56, W*0.007,0,7); }, S(6), 2);
    } else {
      // the throat, with the hall's firelight standing in it — a way through,
      // not a painted black panel. This is the light that draws the cone.
      pen.paint(()=>{ g.rect(xL, yTop, xR-xL, dh); }, S(6), 5);
      pen.paint(()=>{ g.rect(xL+(xR-xL)*0.30, yTop+dh*0.16, (xR-xL)*0.26, dh*0.84); }, S(1), 3);
      // the leaf standing open against the LEFT jamb — what cuts that ray short
      pen.paint(()=>{ g.rect(xL-W*0.030, yTop+dh*0.04, W*0.034, dh*0.96); }, S(3), 4);
    }
    // the sill and one broad step down into the yard — the apron of the cone
    planBox(HD.x-HD.half-0.022, HD.x+HD.half+0.022, FZ+0.030, FZ+0.086, 0.026, 2, 5, 5);
    planBox(HD.x-HD.half-0.058, HD.x+HD.half+0.058, FZ+0.086, FZ+0.142, 0.016, 1, 4, 4);
  }

  /* ================= THE ARMS DOOR — where the weapon route ends =========== */
  if (has("armsdoor")){
    const k = SZ(FZ);
    const xL = X(AD.x-AD.half, FZ), xR = X(AD.x+AD.half, FZ);
    const dh = AD.h * k * H, yTop = flankBase - dh;
    pen.paint(()=>{ g.rect(xL-W*0.013, yTop-H*0.018, (xR-xL)+W*0.026, dh+H*0.018); }, S(3), 5);
    if (M.arms==="open"){
      pen.paint(()=>{ g.rect(xL, yTop, xR-xL, dh); }, S(6), 5);
      pen.paint(()=>{ g.rect(xL+(xR-xL)*0.34, yTop+dh*0.22, (xR-xL)*0.24, dh*0.78); }, S(2), 3);
    } else {
      pen.paint(()=>{ g.rect(xL, yTop, xR-xL, dh); }, S(4), 5);
      // the drawbar across it — the store kept shut
      pen.paint(()=>{ g.rect(xL-W*0.008, yTop+dh*0.46, (xR-xL)+W*0.016, H*0.018); }, S(6), 3);
    }
    planBox(AD.x-AD.half-0.016, AD.x+AD.half+0.016, FZ+0.026, FZ+0.078, 0.020, 2, 4, 4);
  }

  /* ================= THE YARD WALL — bays staggered in depth =============== */
  if (has("wall")){
    for(const B of params.wall){
      const base = Y(B.z), k = SZ(B.z), top = base - B.h*k*H;
      if (B.gate){
        for(const [a,b] of [[B.x0, GATE_L],[GATE_R, B.x1]]){    // the two piers
          pen.paint(()=>{ g.rect(X(a,B.z), top, X(b,B.z)-X(a,B.z), base-top); }, S(3), 5);
          pen.paint(()=>{ g.rect(X(a,B.z)-W*0.007, top, (X(b,B.z)-X(a,B.z))+W*0.014, H*0.016); }, S(5), 4);
          g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.24;
          for(let j=1;j<=3;j++){ const y=lerp(top,base,j/4);
            g.beginPath(); g.moveTo(X(a,B.z),y); g.lineTo(X(b,B.z),y); g.stroke(); }
          g.globalAlpha=1;
        }
        continue;
      }
      pen.paint(()=>{ g.rect(X(B.x0,B.z), top, X(B.x1,B.z)-X(B.x0,B.z), base-top); }, S(2), 5);
      pen.paint(()=>{ g.rect(X(B.x0,B.z)-W*0.007, top, (X(B.x1,B.z)-X(B.x0,B.z))+W*0.014, H*0.015); }, S(4), 4);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.22;
      for(let j=1;j<=3;j++){ const y=lerp(top,base,j/4);
        g.beginPath(); g.moveTo(X(B.x0,B.z),y); g.lineTo(X(B.x1,B.z),y); g.stroke(); }
      g.beginPath(); g.moveTo(X((B.x0+B.x1)/2,B.z),top+H*0.016);
      g.lineTo(X((B.x0+B.x1)/2,B.z),base); g.stroke();
      g.globalAlpha=1;
      pen.paint(()=>{ g.rect(X(B.x0,B.z), base-H*0.012, X(B.x1,B.z)-X(B.x0,B.z), H*0.012); }, S(4), 3);
    }
  }

  /* ================= THE COURTYARD GATE ===================================
     The opening Philoetius locks. The set owns the hole, the jambs, the sill
     and the anchor — the cable is prop.courtyard-gate-and-cable. */
  if (has("gate")){
    const z = GATE.z, k = SZ(z), base = Y(z);
    const xL = X(GATE_L, z), xR = X(GATE_R, z);
    const dh = params.gate.h * k * H, yTop = base - dh;
    pen.paint(()=>{ g.rect(xL-W*0.014, yTop-H*0.026, (xR-xL)+W*0.028, H*0.030); }, S(4), 5);  // lintel
    pen.paint(()=>{ g.rect(xL, yTop, xR-xL, dh); }, S(5), 5);                                 // the hole
    if (M.gate==="open"){
      // the reveals, then the daylight of the road standing at the far end:
      // without them the gateway prints as a flat black panel
      const rv = (xR-xL)*0.22;
      pen.paint(()=>{ g.moveTo(xL, yTop); g.lineTo(xL+rv, yTop+dh*0.12);
        g.lineTo(xL+rv, yTop+dh); g.lineTo(xL, yTop+dh); g.closePath(); }, S(2), 4);
      pen.paint(()=>{ g.rect(xL+(xR-xL)*0.42, yTop+dh*0.14, (xR-xL)*0.26, dh*0.86); },
        toneSolid(inkLevel(M.lift ? 2 : 0)), 4);
    } else {
      for(const [u0,u1] of [[0.00,0.50],[0.50,1.00]]){
        const lx = xL+(xR-xL)*u0, lw2 = (xR-xL)*(u1-u0);
        pen.paint(()=>{ g.rect(lx, yTop+dh*0.04, lw2, dh*0.96); }, S(3), 4);
        g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.50;
        for(let j=1;j<=4;j++){ const yy=yTop+dh*(j/5);
          g.beginPath(); g.moveTo(lx,yy); g.lineTo(lx+lw2,yy); g.stroke(); }
        g.globalAlpha=1;
      }
      // the bar dropped across both leaves
      pen.paint(()=>{ g.rect(xL-W*0.010, yTop+dh*0.50, (xR-xL)+W*0.020, H*0.020); }, S(6), 4);
    }
    planBox(GATE_L-0.020, GATE_R+0.020, z+0.030, z+0.084, 0.022, 2, 4, 4);   // the sill
  }

  /* ================= THE WEAPON ROUTE — dressed slabs, with gaps ===========
     Hall door to arms door along the wall foot. Slabs, never a paved band: a
     continuous strip is a bar laid across the frame. */
  if (has("route")){
    const n = params.route, RL = params.routeLine;
    for(let i=0;i<n;i++){
      const u0 = i/n + 0.026, u1 = (i+1)/n - 0.026;
      const xa = lerp(RL.x0, RL.x1, u1), xb = lerp(RL.x0, RL.x1, u0);
      const za = lerp(RL.z0, RL.z1, u1), zb = lerp(RL.z0, RL.z1, u0);
      pen.paint(quad(xa, xb, za-0.042, zb+0.042), S(i%2 ? 2 : 3), 4);
    }
    if (M.drag){    // two furrows worn along it, where the armour was hauled
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.34;
      for(const off of [-0.018, 0.016]){
        g.beginPath();
        for(let i=0;i<=10;i++){ const u=i/10;
          const xx = lerp(params.routeLine.x0, params.routeLine.x1, u)+off,
                zz = lerp(params.routeLine.z0-0.006, params.routeLine.z1+0.006, u);
          if(i===0) g.moveTo(X(xx,zz),Y(zz)); else g.lineTo(X(xx,zz),Y(zz)); }
        g.stroke();
      }
      g.globalAlpha=1;
    }
  }

  /* ================= THE OATH GROUND — trodden bare, outside the cone ======
     The patch the three men stand in. The SET owns the wear and the prints;
     nobody is painted. It is the lightest field in the picture on purpose —
     the safe ground reads as paper. */
  if (has("oath")){
    const O = params.oath;
    g.fillStyle = tn(0);
    g.beginPath();
    for(let i=0;i<=40;i++){
      const a=(i/40)*Math.PI*2, wob = 0.90+0.16*Math.sin(a*3+1.1);
      const xx=O.x+Math.cos(a)*O.rx*wob, zz=O.z+Math.sin(a)*O.rz*wob;
      if(i===0) g.moveTo(X(xx,zz),Y(zz)); else g.lineTo(X(xx,zz),Y(zz));
    }
    g.closePath(); g.fill();
    // its rim stated in kicked stones, not in a contour: an outlined patch of
    // ground hovers like a tabletop
    for(let i=0;i<13;i++){
      const a=(i/13)*Math.PI*2 + 0.2;
      const xx=O.x+Math.cos(a)*O.rx*1.06, zz=O.z+Math.sin(a)*O.rz*1.06, k=SZ(zz);
      pen.paint(()=>{ g.ellipse(X(xx,zz), Y(zz), W*0.010*k, H*0.005*k, a, 0, 7); }, S(3), 2);
    }
    if (M.marks){   // three pairs of prints, unequal — the trio that stood here
      g.fillStyle = tn(4);
      const feet = [[-0.090,0.030],[0,-0.020],[0.090,0.030]];
      for(const [dx,dz] of feet){
        for(const s of [-1,1]){
          const xx=O.x+dx+s*0.020, zz=O.z+dz+(s<0?0.006:0);
          const k=SZ(zz);
          g.beginPath(); g.ellipse(X(xx,zz), Y(zz), W*0.009*k, H*0.005*k, s*0.24, 0, 7); g.fill();
        }
      }
    }
  }

  /* ================= THE MOORING POST beside the gate ====================== */
  if (has("post")){
    const P = params.post, k = SZ(P.z), bx = X(P.x,P.z), by = Y(P.z), hh = P.h*k*H;
    g.fillStyle = tn(2);                                   // the shadow it stands in
    g.beginPath(); g.ellipse(bx, by, W*0.026*k, H*0.010*k, 0,0,7); g.fill();
    pen.paint(()=>{ g.rect(bx-W*0.014*k, by-hh, W*0.028*k, hh); }, S(3), 4);
    pen.paint(()=>{ g.rect(bx-W*0.020*k, by-hh-H*0.016*k, W*0.040*k, H*0.018*k); }, S(5), 3);
    // the ring the cable is made fast to — an ANCHOR with a shape, no rope
    pen.ink(()=>{ g.ellipse(bx+W*0.020*k, by-hh*0.52, W*0.014*k, H*0.011*k, 0, 0, 7); }, 4);
    if (M.ring)      // taken up: the ring stands proud, the bight loop shown empty
      pen.ink(()=>{ g.ellipse(bx+W*0.026*k, by-hh*0.52, W*0.020*k, H*0.015*k, 0, 0, 7); }, 3);
  }

  /* ================= THE KERB along the safe edge of the cone ==============
     A run of set stones the household laid where the doorway's view stops. The
     line is a fact of the ground, so every shot of it agrees. */
  if (has("kerb") && M.cone){
    for(let i=0;i<6;i++){
      const p = coneEdge(1, 0.24 + i*0.166);
      const k = SZ(p.z);
      pen.paint(()=>{ g.ellipse(X(p.x,p.z)+W*0.020*k, Y(p.z), W*0.021*k, H*0.009*k, 0.18, 0, 7); },
        S(i%3===0 ? 4 : 3), 3);
    }
  }

  /* ================= LITTER of the work done here ========================== */
  if (has("litter") && M.litter){
    for(let i=0;i<8;i++){
      const xx = 0.40 + R()*0.44, zz = 0.52 + R()*0.34, k = SZ(zz);
      const sx = X(xx,zz), sy = Y(zz);
      if (R()<0.5) pen.paint(()=>{ g.ellipse(sx,sy,W*0.011*k,H*0.005*k,0,0,7); }, S(3), 2);
      else pen.ink(()=>{ g.moveTo(sx-W*0.013*k, sy); g.lineTo(sx+W*0.012*k, sy-H*0.008*k); }, 3);
    }
  }

  /* ================= FOREGROUND — kept to the RIGHT half ==================
     Everything near stands on the blind side. The near LEFT is left as the
     cone's own tone and nothing else: that is the picture's breathing room,
     and the card owns the bottom-left corner. */
  if (has("foreground")){
    const Wd = params.wood, k = SZ(Wd.z), bx = X(Wd.x,Wd.z), by = Y(Wd.z);
    g.fillStyle = tn(2);
    g.beginPath(); g.ellipse(bx, by, W*0.10*k, H*0.015*k, 0,0,7); g.fill();
    // split billets stacked: two courses, the upper shorter, so the pile has a
    // stepped silhouette instead of reading as one filled block
    for(let row=0; row<2; row++){
      const n = 4-row, y = by - H*0.034*k*(row+1);
      for(let i=0;i<n;i++){
        const cx = bx - W*0.072*k + W*0.048*k*i + W*0.024*k*row;
        pen.paint(()=>{ g.ellipse(cx, y, W*0.023*k, H*0.017*k, 0, 0, 7); }, S(row===1 ? 2 : 3), 4);
        pen.ink(()=>{ g.moveTo(cx-W*0.010*k, y-H*0.005*k); g.lineTo(cx+W*0.009*k, y+H*0.005*k); }, 2);
      }
    }
    const J = params.jar, jk = SZ(J.z), jx = X(J.x,J.z), jy = Y(J.z);
    const rw = W*J.r*jk, rh = H*J.r*1.28*jk;
    g.fillStyle = tn(2);
    g.beginPath(); g.ellipse(jx, jy, rw*1.16, rh*0.20, 0,0,7); g.fill();
    pen.paint(()=>{
      g.moveTo(jx-rw*0.42, jy);
      g.bezierCurveTo(jx-rw*1.02, jy-rh*0.55, jx-rw*0.78, jy-rh*1.32, jx-rw*0.32, jy-rh*1.52);
      g.lineTo(jx+rw*0.32, jy-rh*1.52);
      g.bezierCurveTo(jx+rw*0.78, jy-rh*1.32, jx+rw*1.02, jy-rh*0.55, jx+rw*0.42, jy);
      g.closePath(); }, S(2), 5);
    pen.paint(()=>{ g.ellipse(jx, jy-rh*1.52, rw*0.32, rh*0.12, 0,0,7); }, S(5), 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.26;
    g.beginPath(); g.ellipse(jx, jy-rh*0.84, rw*0.84, rh*0.15, 0, 0, Math.PI); g.stroke();
    g.globalAlpha=1;
  }
}

/* ---- anchors are PROJECTED from the plan, never authored ----------------- */
const ANCHORS = {};
for (const n of plan.names()){
  const p = plan.at(n);
  ANCHORS[n] = { x:+clamp(p.x,0,1).toFixed(4), y:+clamp(p.y,0,1).toFixed(4) };
}
ANCHORS["entrance:hall"]  = ANCHORS.door_sill;
ANCHORS["entrance:gate"]  = ANCHORS.gate_sill;
ANCHORS["exit:hall"]      = ANCHORS.door_hall;
ANCHORS["exit:gate"]      = ANCHORS.gate_mouth;
ANCHORS["exit:store"]     = ANCHORS.arms_door;
ANCHORS["route:start"]    = ANCHORS.door_foot;
ANCHORS["route:end"]      = ANCHORS.arms_sill;
ANCHORS["cable:make-fast"]= ANCHORS.gate_post;
ANCHORS["camera:wide"]    = { x:.50, y:.50 };
ANCHORS["camera:door"]    = { x:.34, y:.48 };
ANCHORS["camera:oath"]    = { x:.55, y:.66 };
ANCHORS["camera:gate"]    = { x:.78, y:.62 };
ANCHORS["camera:low"]     = { x:.46, y:.84 };

const node = state => ({ preview:{ state, status:MODES[state].status } });

export const asset = {
  id:"location.palace-outer-yard",
  type:"LOCATION",
  name:"Palace Outer Yard",
  statusWord:"OUT OF SIGHT",
  scene:"OD-B21-S04",
  plan:"local:palace-outer-yard",
  adjacentTo:"location.megaron-hall",            // through "door_hall"
  adjacentToStore:"location.weapon-storeroom",   // through "arms_door"
  adjacentToGate:"location.palace-dung-heap-and-gate",   // through "gate_mouth"
  adjacentToFront:"location.fight-threshold",    // round the corner, past "corner"

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  zones:{
    walkable:        { x0:.08, y0:.56, x1:.95, y1:.99 },
    /* the cone: NOT walkable while the hall is occupied — this is the zone the
       whole scene is blocked against */
    "sight:seen":    { x0:.26, y0:.62, x1:.60, y1:.99 },
    "sight:blind":   { x0:.60, y0:.58, x1:.95, y1:.99 },
    "blind:west":    { x0:.06, y0:.62, x1:.26, y1:.99 },
    "oath:ground":   { x0:.52, y0:.77, x1:.72, y1:.86 },
    "route:weapons": { x0:.29, y0:.58, x1:.42, y1:.66 },
    "gate:mouth":    { x0:.70, y0:.66, x1:.90, y1:.76 },
    "door:steps":    { x0:.36, y0:.55, x1:.52, y1:.64 },
    "wall:lee":      { x0:.60, y0:.68, x1:.86, y1:.78 },
  },
  /* depth layers, for scenes that interleave bodies with the set */
  occlusion:{ background:["sky","flank","roof","halldoor","armsdoor","wall","gate"],
              middle:["yard","sight","route","oath","post","kerb","litter"],
              foreground:["foreground"] },

  states:{
    initial:"private",
    nodes:{ private:node("private"), oath:node("oath"), armed:node("armed"),
            barred:node("barred"),   night:node("night") },
    edges:[["private","oath"],["oath","armed"],["armed","barred"],
           ["barred","private"],["private","night"],["night","private"],
           ["oath","private"],["barred","night"]],
  },
  channels:["state","reveal","camera","light","sightline","t"],

  preview:()=>({ state:"private", t:0.4, status:"OUT OF SIGHT", progress:.26 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones }; },
};
export default asset;
