/* location.fight-threshold — THE COURTYARD SIDE OF THE PALACE DOOR, with the
   small trodden ring the suitors clear in front of it, the drag path worn
   across the yard to the courtyard gate, and the wall foot they prop a beaten
   man against. ADDITIVE, Book XVIII. Modifies nothing; shadows nothing.

   WHY THIS IS NOT A ROOM WE ALREADY HAVE. location.megaron-hall is the great
   hall — INSIDE, looking at the great doors from the throne. This is the
   reverse field: OUTSIDE those doors, standing in the courtyard, looking back
   at them across the porch. location.palace-dung-heap-and-gate is the far side
   of the precinct wall, seen from the road. This set is the ground BETWEEN the
   two — the yard the beggars fight in (XVIII.30–110) and the ground Odysseus
   drags Irus over "through the porch to the courtyard and the gates", to leave
   him sitting against the wall. No hall, no hut: the yard.

   THE SET IS THE PLOT. Three things must be legible with no figure in them,
   because all three are staged on later and must not drift between shots:
     1. THE RING   a small circle of ground trodden bare at the door foot,
                   kerbed with the stones kicked out of it, ringed by the
                   spectators' standing marks and their shoved-back stools —
                   an ARC open toward camera, so the ring is never fenced off.
     2. THE DRAG   two heel-furrows leaving the ring on the gate side and
                   running to the gateway. They belong to the GROUND, so every
                   shot of the drag agrees with every other.
     3. THE PROP   the wall foot beside the gate, worn hollow, where the body
                   is set upright. It is an ANCHOR, not paint.

   PROJECTION. Every fixture is placed through the law the blocking engine uses
   (README §5), so a figure blocked on this ground stands where the paint says:
       x = 0.5 + (x-0.5)(0.42 + 0.58 z)      y = 0.50 + 0.46 z^1.08
   The station table below is a real plan (makePlan) and the ANCHORS are
   PROJECTED from it — never eyeballed. `ring_l` / `ring_r` are a CONTACT PAIR:
   two bodies that grapple resolve to different coordinates.

   TWO RULES THIS SET IS BUILT AROUND, both learned from the render:
   · GROUND FIRST. The yard is painted before the house, or its fill erases
     the column feet, the sill and the steps standing on it.
   · NOTHING SPANS THE FRAME. The palace front is laid in bays capped one by
     one, the porch architrave is broken over the doorway, and the yard wall is
     staggered in depth so neither its top nor its foot is one rule across.

   STATES (state.state, default "ring"):
     empty      the plain yard: stools stowed by the wall, no ring
     ring       the circle cleared, stools set back in their arc (XVIII.40)
     fight      the arc pressed in, dust up, the middle scuffed bare
     drag       the ring broken open on the gate side, furrows to the gate
     aftermath  furrows deep, stools tipped, the wall foot worn (XVIII.100)
     night      one level darker, doors shut, the two door-posts lit

   SOLID tone + hard contour only; the engine dotify pass supplies the halftone.
   NO characters baked in — spectators are footprints, stools and anchors.
   Verify: node harness/render.mjs assets/location/fight-threshold.mjs --pipeline MESH */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";
import { makePlan } from "../../engine/blocking.mjs";

/* ---- the law, unclamped (the set shell runs past where a body may stand) -- */
const SPREAD  = z => 0.42 + 0.58 * z;
const px      = (x, z) => 0.5 + (x - 0.5) * SPREAD(z);
const py      = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const SZu     = z => 0.60 + 0.50 * clamp(z, 0.08, 1);
const HORIZON = 0.50;

/* the yard wall, bay by bay, STAGGERED IN DEPTH. A wall laid at one z has one
   straight foot and one straight head clean across the frame; three z values
   give it a broken silhouette on both edges. Bay 2 is the gateway. */
const WALL = [
  { x0:0.42, x1:0.655, z:0.736, h:0.112 },
  { x0:0.665,x1:0.845, z:0.800, h:0.150 },
  { x0:0.860,x1:1.010, z:0.774, h:0.128, gate:true },
  { x0:1.025,x1:1.290, z:0.742, h:0.104 },
  { x0:1.300,x1:1.640, z:0.806, h:0.146 },
];
const GATE = WALL[2];

const params = {
  faceZ:0.12,          // the palace front plane
  porchZ:0.24,         // the column plane standing off it
  faceBays:7,          // the front is laid in bays, never one block
  doorHalf:0.130,      // half-width of the hall doors, in PLAN x
  doorHeight:0.28,     // unit height of the opening
  colX:[0.16,0.34,0.66,0.84], colHalf:0.032, colHeight:0.26,
  ring:{ x:0.40, z:0.56, rx:0.21, rz:0.140 },
  kerb:16,             // stones kicked out of the circle to make its rim
  seats:7,             // stools the spectators stood up from
  wall:WALL,
  furrows:2,
  torchZ:0.42, torchX:[0.06,0.94], torchH:0.150,
  jars:[{ x:0.02, z:0.82, r:0.052 }, { x:0.14, z:0.88, r:0.042 }],
};

/* ---- the plan. Stations are named; the anchors are projected from here. --- */
const R3 = params.ring;
const onRing = (deg, k=1) => ({                 // a point on the ring, in plan
  x: R3.x + Math.cos(deg*Math.PI/180) * R3.rx * k,
  z: R3.z + Math.sin(deg*Math.PI/180) * R3.rz * k,
});
export const plan = makePlan({
  id:"fight-threshold", name:"Fight threshold",
  notes:"Courtyard side of the hall door: the ring, the drag path, the gate.",
  stations:{
    door_main:   { x:0.50, z:params.faceZ },
    door_sill:   { x:0.50, z:params.faceZ+0.070 },
    step_foot:   { x:0.50, z:params.faceZ+0.190 },
    porch_l:     { x:0.34, z:params.porchZ },
    porch_r:     { x:0.66, z:params.porchZ },
    ring_centre: { x:R3.x, z:R3.z },
    ring_l:      onRing(180, 0.44),        // CONTACT PAIR — the two fighters
    ring_r:      onRing(  0, 0.44),
    ring_door:   onRing(270, 1.00),
    ring_near:   onRing( 90, 1.00),
    ring_gate:   onRing( 28, 1.18),        // where the ring opens for the drag
    yard_centre: { x:0.30, z:0.80 },
    yard_near:   { x:0.42, z:1.00 },
    gate_mouth:  { x:(GATE.x0+GATE.x1)/2, z:GATE.z },
    gate_sill:   { x:(GATE.x0+GATE.x1)/2, z:GATE.z+0.050 },
    propped:     { x:0.78, z:0.840 },      // the wall foot. Anchor, not paint.
    torch_l:     { x:params.torchX[0], z:params.torchZ },
    torch_r:     { x:params.torchX[1], z:params.torchZ },
    stools_stow: { x:0.60, z:0.70 },
    jars:        { x:params.jars[0].x, z:params.jars[0].z },
  },
  fixtures:[
    { id:"ring", kind:"circle", x:R3.x, z:R3.z, rx:R3.rx, rz:R3.rz },
    { id:"drag", kind:"path", from:"ring_gate", to:"propped" },
  ],
});

/* ---- the state channel --------------------------------------------------- */
const MODES = {
  empty:    { lift:0, status:"THE YARD", ring:false, seats:"stowed",  doors:"ajar",
              furrows:"none", propped:false, litter:false, torch:"cold", dust:false, marks:false },
  /* `ring` keeps the old scuffed track to the gate: this yard has hauled things
     out of that door for twenty years, and the path is part of the ground. */
  ring:     { lift:0, status:"THE RING", ring:true,  seats:"arc",     doors:"open",
              furrows:"scuff",propped:false, litter:false, torch:"cold", dust:false, marks:true },
  fight:    { lift:0, status:"MATCHED",  ring:true,  seats:"pressed", doors:"open",
              furrows:"scuff",propped:false, litter:true,  torch:"cold", dust:true,  marks:true },
  drag:     { lift:0, status:"DRAGGED",  ring:true,  seats:"pressed", doors:"open",
              furrows:"drag", propped:false, litter:true,  torch:"cold", dust:true,  marks:true },
  aftermath:{ lift:0, status:"PROPPED",  ring:true,  seats:"broken",  doors:"open",
              furrows:"drag", propped:true,  litter:true,  torch:"cold", dust:false, marks:true },
  night:    { lift:1, status:"TORCHLIT", ring:true,  seats:"arc",     doors:"shut",
              furrows:"none", propped:false, litter:false, torch:"lit",  dust:false, marks:false },
};

/* GROUND FIRST: "yard" precedes every built thing, or its fill erases the feet
   of everything standing on it. */
const LAYERS = ["sky","yard","facade","door","porch","leftwall","rightwall","gate",
                "ring","marks","seats","furrows","propped","torches","litter","foreground"];

function drawSet(ctx, W, H, st){
  const pen  = makePen(ctx, { outline:true });
  const g    = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "ring";
  const M    = MODES[mode];
  const T    = (st && st.t) || 0;
  const layers = (st && st.layers) || LAYERS;
  const has  = l => layers.includes(l);
  const R    = rnd(31877);

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
      const a = lerp(x0,x1,i/n), b = lerp(x0,x1,(i+0.58)/n);
      g.beginPath(); g.moveTo(X(a,z),Y(z)); g.lineTo(X(b,z),Y(z)); g.stroke();
    }
    g.globalAlpha=1;
  };
  /* an ellipse in PLAN space, sampled then projected — a circle on this floor
     is not a canvas ellipse, and drawing it as one lifts the ring off the ground */
  const planEllipse = (cx,cz,rx,rz,k=1,n=48) => () => {
    for(let i=0;i<=n;i++){
      const a = (i/n)*Math.PI*2;
      const xx = cx + Math.cos(a)*rx*k, zz = cz + Math.sin(a)*rz*k;
      if(i===0) g.moveTo(X(xx,zz), Y(zz)); else g.lineTo(X(xx,zz), Y(zz));
    }
    g.closePath();
  };

  const FZ = params.faceZ, PZ = params.porchZ, GH = params.doorHalf;
  const faceBase = Y(FZ);

  /* ================= SKY ================================================== */
  if (has("sky")){ g.fillStyle = inkLevel(M.lift ? 2 : 1); g.fillRect(0,0,W,HORIZON*H); }

  /* ================= THE YARD floor — BEFORE anything stands on it ======== */
  if (has("yard")){
    g.fillStyle = tn(1); g.fillRect(0, HORIZON*H, W, H-HORIZON*H);
    // the shade the porch throws down its own steps: the middle ground gets a
    // value without another built thing being put in it
    g.fillStyle = tn(2);
    g.beginPath(); quad(0.06, 0.94, PZ+0.040, 0.34)(); g.fill();
    /* the dressed apron off the steps — FILLED, never outlined: an outlined
       ground quad puts a rule clean across the frame. Its edges are stated by
       broken courses instead. */
    g.fillStyle = tn(3);
    g.beginPath(); quad(0.18, 0.82, 0.34, 0.47)(); g.fill();
    for(const z of [0.350, 0.405, 0.462]) dashRow(z, 0.20, 0.80, 4, 0.30);
    for(const u of [0.34, 0.66]){
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.22;
      g.beginPath(); g.moveTo(X(u,0.355),Y(0.355)); g.lineTo(X(u,0.462),Y(0.462)); g.stroke();
      g.globalAlpha=1;
    }
    // beaten earth beyond the apron, in two unequal patches
    g.fillStyle = tn(2);
    g.beginPath(); quad(-0.26, 0.20, 0.52, 1.12)(); g.fill();
    g.beginPath(); quad(0.66, 1.20, 0.50, 0.74)(); g.fill();
    for(const z of [0.70, 0.90, 1.10]) dashRow(z, 0.04, 0.96, 5, 0.15);
  }

  /* ================= THE PALACE FRONT =====================================
     Laid in bays with a gap and a pilaster between each, each bay capped on
     its own. The centre bays are the doorway block, taller, carrying the
     megaron gable. */
  if (has("facade")){
    const N = params.faceBays, x0=-0.22, x1=1.22;
    for(let i=0;i<N;i++){
      const a = lerp(x0,x1,i/N)+0.008, b = lerp(x0,x1,(i+1)/N)-0.008;
      const mid = (a+b)/2;
      if (Math.abs(mid-0.5) < 0.11) continue;                 // the door block owns the middle
      const rise = 0.216 + 0.030*((i*5)%3)/2;
      const top = faceBase - H*rise;
      pen.paint(()=>{ g.rect(X(a,FZ), top, X(b,FZ)-X(a,FZ), faceBase-top); }, S(2), 5);
      pen.paint(()=>{ g.rect(X(a,FZ)-W*0.008, top, (X(b,FZ)-X(a,FZ))+W*0.016, H*0.016); }, S(4), 4);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.20;                   // ashlar
      for(let j=1;j<=3;j++){ const y=lerp(top,faceBase,j/4);
        g.beginPath(); g.moveTo(X(a,FZ),y); g.lineTo(X(b,FZ),y); g.stroke(); }
      g.beginPath(); g.moveTo(X(mid,FZ),top+H*0.020); g.lineTo(X(mid,FZ),faceBase); g.stroke();
      g.globalAlpha=1;
      if (i<N-1){                                                            // pilaster in the joint
        const bx = lerp(x0,x1,(i+1)/N);
        pen.paint(()=>{ g.rect(X(bx,FZ)-W*0.008, top+H*0.024, W*0.016, faceBase-top-H*0.024); }, S(3), 3);
      }
    }
    const da=0.29, db=0.71, dtop = faceBase - H*0.286;
    pen.paint(()=>{ g.rect(X(da,FZ), dtop, X(db,FZ)-X(da,FZ), faceBase-dtop); }, S(2), 5);
    pen.paint(()=>{ g.rect(X(da,FZ)-W*0.012, dtop, (X(db,FZ)-X(da,FZ))+W*0.024, H*0.018); }, S(4), 4);
    pen.paint(()=>{ g.moveTo(X(da-0.02,FZ), dtop);
      g.lineTo(X(0.50,FZ), dtop-H*0.084);
      g.lineTo(X(db+0.02,FZ), dtop); g.closePath(); }, S(3), 5);
    for(const u of [0.41,0.59])                                    // the only near-black up top
      pen.paint(()=>{ g.rect(X(u,FZ)-W*0.013, dtop+H*0.030, W*0.026, H*0.034); }, S(6), 4);
  }

  /* ================= THE HALL DOORS, from OUTSIDE ========================= */
  if (has("door")){
    const k = SZ(FZ);
    const xL = X(0.5-GH, FZ), xR = X(0.5+GH, FZ);
    const dh = params.doorHeight * k * H, yTop = faceBase - dh;
    pen.paint(()=>{ g.rect(xL-W*0.020, yTop-H*0.024, (xR-xL)+W*0.040, dh+H*0.024); }, S(3), 5); // jambs
    const openTone = M.doors==="open" ? 6 : M.doors==="ajar" ? 5 : 3;
    pen.paint(()=>{ g.rect(xL, yTop, xR-xL, dh); }, S(openTone), 5);
    if (M.doors!=="open"){
      const ajar = M.doors==="ajar" ? 0.66 : 1.0;
      for(const sgn of [-1,1]){
        const lw2=((xR-xL)/2)*ajar, lx = sgn<0 ? xL : xR-lw2;
        pen.paint(()=>{ g.rect(lx, yTop, lw2, dh); }, S(3), 4);
        g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.5;
        for(let j=1;j<=3;j++){ const yy=yTop+dh*(j/4);
          g.beginPath(); g.moveTo(lx,yy); g.lineTo(lx+lw2,yy); g.stroke(); }
        g.globalAlpha=1;
        pen.paint(()=>{ g.arc(sgn<0? lx+lw2*0.82 : lx+lw2*0.18, yTop+dh*0.55, W*0.007,0,7); }, S(6), 2);
      }
    } else {
      // firelight of the hall standing in the throat, so the doorway reads as a
      // way through and not as a painted black panel
      pen.paint(()=>{ g.rect(xL+(xR-xL)*0.34, yTop+dh*0.20, (xR-xL)*0.26, dh*0.80); }, S(2), 3);
    }
    // THE SILL — the stone Odysseus sat on, the ground Irus tried to take
    planBox(0.5-GH-0.02, 0.5+GH+0.02, FZ+0.028, FZ+0.086, 0.028, 2, 5, 5);
    // three steps down into the yard, each one shorter than the one above it
    for(let i=0;i<3;i++){
      const w2 = GH + 0.062 - i*0.006, z0 = FZ+0.086+i*0.034;
      planBox(0.5-w2, 0.5+w2, z0, z0+0.034, 0.020-i*0.006, 1+(i%2), 4, 4);
    }
  }

  /* ================= THE PORCH — four columns, architrave broken over the
     doorway so the door is seen THROUGH the porch and not behind a bar ====== */
  if (has("porch")){
    const k = SZ(PZ), base = Y(PZ);
    const ch = params.colHeight * k * H, top = base - ch;
    /* no stylobate: a plinth under the columns runs straight through the
       steps in x and the two of them pile up into one illegible heap. The
       columns stand on their own bases, on the yard. */
    for(const [a,b] of [[0.09,0.40],[0.60,0.91]])           // architrave, gap at the door
      pen.paint(()=>{ g.rect(X(a,PZ), top-H*0.024, X(b,PZ)-X(a,PZ), H*0.024); }, S(2), 4);
    for(const cx of params.colX){
      const a = X(cx-params.colHalf, PZ), b = X(cx+params.colHalf, PZ);
      pen.paint(()=>{ g.rect(a, top, b-a, base-top); }, S(2), 5);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.32;                     // two flutes
      for(const q of [0.34,0.66]){ const xq=lerp(a,b,q);
        g.beginPath(); g.moveTo(xq, top+H*0.016); g.lineTo(xq, base-H*0.012); g.stroke(); }
      g.globalAlpha=1;
      pen.paint(()=>{ g.rect(a-W*0.011, top, (b-a)+W*0.022, H*0.022); }, S(4), 4);       // capital
      pen.paint(()=>{ g.rect(a-W*0.009, base-H*0.020, (b-a)+W*0.018, H*0.022); }, S(4), 4); // base
    }
  }

  /* ================= THE LEFT OF THE YARD =================================
     Closed by a low parapet FACING camera, not by a second receding plane: a
     wall seen edge-on down the margin projects to a black spike. */
  if (has("leftwall")){
    planBox(-0.22, 0.05, 0.40, 0.48, 0.105, 2, 3, 5);
    const zb=0.48, k=SZ(zb), yb=Y(zb)-0.105*k*H;
    pen.paint(()=>{ g.rect(X(-0.22,zb), yb-H*0.013, X(0.05,zb)-X(-0.22,zb), H*0.015); }, S(4), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.22;
    for(const u of [-0.13,-0.04]){ g.beginPath();
      g.moveTo(X(u,zb), yb); g.lineTo(X(u,zb), Y(zb)); g.stroke(); }
    g.globalAlpha=1;
  }

  /* ================= THE YARD WALL, staggered, and THE GATE ===============
     Bay by bay at three different depths, each capped on its own: the head and
     the foot of the run are both broken, and the gateway is one whole bay of
     it rather than a hole punched through a continuous band. */
  const bayFace = (B) => {
    const xa=X(B.x0,B.z), xb=X(B.x1,B.z), yb=Y(B.z);
    const yt = yb - B.h*SZ(B.z)*H;
    return { xa, xb, yb, yt };
  };
  if (has("rightwall")){
    for(const B of WALL){
      if (B.gate) continue;
      const { xa, xb, yb, yt } = bayFace(B);
      pen.paint(()=>{ g.rect(xa, yt, xb-xa, yb-yt); }, S(2), 5);
      pen.paint(()=>{ g.rect(xa-W*0.008, yt, (xb-xa)+W*0.016, H*0.016); }, S(4), 4);   // coping
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.20;                             // ashlar
      for(let j=1;j<=2;j++){ const y=lerp(yt,yb,j/3);
        g.beginPath(); g.moveTo(xa,y); g.lineTo(xb,y); g.stroke(); }
      g.beginPath(); g.moveTo((xa+xb)/2, yt+H*0.018); g.lineTo((xa+xb)/2, yb); g.stroke();
      g.globalAlpha=1;
    }
    // the corner pier that ends the run where it turns out of frame
    const B0 = WALL[0], f0 = bayFace(B0);
    pen.paint(()=>{ g.rect(f0.xa-W*0.026, f0.yt-H*0.030, W*0.030, (f0.yb-f0.yt)+H*0.030); }, S(3), 5);
    pen.paint(()=>{ g.rect(f0.xa-W*0.034, f0.yt-H*0.034, W*0.046, H*0.020); }, S(5), 4);
  }

  if (has("gate")){
    const { xa, xb, yb, yt } = bayFace(GATE);
    pen.paint(()=>{ g.rect(xa, yt, xb-xa, yb-yt); }, S(5), 5);                 // the throat
    pen.paint(()=>{ g.rect(xa+(xb-xa)*0.30, yt+(yb-yt)*0.12, (xb-xa)*0.34, (yb-yt)*0.88); },
      S(M.lift?2:0), 4);                                                        // daylight in it
    for(const sx of [xa,xb]) pen.ink(()=>{ g.moveTo(sx, yb); g.lineTo(sx, yt); }, 5);
    pen.paint(()=>{ g.rect(xa-W*0.020, yt-H*0.028, (xb-xa)+W*0.040, H*0.030); }, S(5), 5);  // lintel
    for(const sx of [xa-W*0.020, xb-W*0.006])                                   // gate posts
      pen.paint(()=>{ g.rect(sx, yt, W*0.026, yb-yt); }, S(3), 4);
    planBox(GATE.x0-0.02, GATE.x1+0.02, GATE.z+0.012, GATE.z+0.058, 0.020, 2, 5, 4); // worn sill
  }

  /* ================= THE RING ============================================
     Trodden bare and kerbed by the stones kicked out of it. LIGHT inside — the
     ring is where the paper shows most; the darks are the kerb and the scuff. */
  if (has("ring") && M.ring){
    const { x:cx, z:cz, rx, rz } = params.ring;
    pen.paint(planEllipse(cx,cz,rx,rz,1.00), S(3), 5);
    pen.paint(planEllipse(cx,cz,rx,rz,0.66), S(M.dust ? 2 : 1), 3);
    for(let i=0;i<params.kerb;i++){                       // the kerb stones, unequal
      const a = (i/params.kerb)*360;
      if (M.furrows==="drag" && a>4 && a<58) continue;     // broken open on the gate side
      const rr = 1.03 + 0.07*R();
      const p = { x: cx + Math.cos(a*Math.PI/180)*rx*rr,
                  z: cz + Math.sin(a*Math.PI/180)*rz*rr };
      const k = SZ(p.z), sx = X(p.x,p.z), sy = Y(p.z);
      const w2 = W*(0.008+0.008*R())*k;
      pen.paint(()=>{ g.ellipse(sx, sy, w2, w2*0.58, 0.2*R(), 0, 7); }, S(i%3===0 ? 5 : 3), 3);
    }
    if (M.dust){                                          // scuff arcs where the heels went
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.32;
      for(let i=0;i<4;i++){
        const a0 = 40+i*74, k = 0.40+0.15*i;
        g.beginPath();
        for(let j=0;j<=10;j++){ const a=(a0+j*16)*Math.PI/180;
          const xx=cx+Math.cos(a)*rx*k, zz=cz+Math.sin(a)*rz*k;
          if(j===0) g.moveTo(X(xx,zz),Y(zz)); else g.lineTo(X(xx,zz),Y(zz)); }
        g.stroke();
      }
      g.globalAlpha=1;
    }
  }

  /* ================= THE SPECTATORS =======================================
     Not painted. What the set carries is where they STOOD: pairs of feet
     trodden into the dust on an arc round the ring, open toward camera. */
  const ARC = [186, 212, 240, 268, 296, 326, 154];
  const arcPoint = (deg, k) => {
    const { x:cx, z:cz, rx, rz } = params.ring;
    return { x: cx + Math.cos(deg*Math.PI/180)*rx*k*1.10,
             z: cz + Math.sin(deg*Math.PI/180)*rz*k*1.12 };
  };
  if (has("marks") && M.marks){
    const k = M.seats==="pressed" ? 1.06 : 1.18;
    for(const a of ARC){
      const p = arcPoint(a, k), kk = SZ(p.z);
      const bx = X(p.x,p.z), by = Y(p.z);
      for(const q of [-1,1])
        pen.paint(()=>{ g.ellipse(bx+q*W*0.012*kk, by+q*H*0.003*kk,
          W*0.011*kk, H*0.006*kk, 0.25*q, 0, 7); }, S(4), 2);
    }
  }

  /* ================= THE STOOLS they stood up from ======================== */
  if (has("seats") && M.seats!=="none"){
    const stool = (x,z,tilt=0) => {
      if (!tilt) return planBox(x-0.038, x+0.038, z-0.026, z+0.026, 0.052, 2, 4, 4);
      const bx=X(x,z), by=Y(z), k=SZ(z), w2=W*0.050*k, h2=H*0.030*k;
      g.save(); g.translate(bx,by); g.rotate(tilt);
      for(const q of [-0.62,0.62])
        pen.paint(()=>{ g.rect(q*w2-W*0.006, -h2*2.1, W*0.012, h2*1.0); }, S(5), 3);
      pen.paint(()=>{ g.rect(-w2/2, -h2*1.4, w2, h2*0.44); }, S(3), 4);
      g.restore();
    };
    if (M.seats==="stowed"){
      for(let i=0;i<4;i++) stool(0.50 + i*0.090, 0.66 + i*0.016);
    } else {
      const k = M.seats==="pressed" ? 1.26 : 1.42;
      ARC.forEach((a,i)=>{
        const p = arcPoint(a, k);
        const tip = M.seats==="broken" && (i===1 || i===4) ? (i===1?0.52:-0.44) : 0;
        stool(p.x, p.z, tip);
      });
    }
  }

  /* ================= THE DRAG PATH ======================================== */
  if (has("furrows") && M.furrows!=="none"){
    const a = plan.stations.ring_gate, b = plan.stations.propped;
    const deep = M.furrows==="drag";
    g.strokeStyle=INK; g.lineCap="round";
    for(let r=0;r<params.furrows;r++){
      const off = (r-0.5)*0.055;
      g.lineWidth = deep ? 5 : 4; g.globalAlpha = deep ? 0.56 : 0.34;
      g.beginPath();
      for(let i=0;i<=16;i++){
        const u=i/16, sag = Math.sin(u*Math.PI)*0.055;
        const xx = lerp(a.x,b.x,u) + off*(1-0.4*u);
        const zz = lerp(a.z,b.z,u) + sag + off*0.3;
        if(i===0) g.moveTo(X(xx,zz),Y(zz)); else g.lineTo(X(xx,zz),Y(zz));
      }
      g.stroke();
    }
    g.globalAlpha=1;
    if (deep){                                   // heel divots along it
      for(let i=1;i<7;i++){
        const u=i/7, xx=lerp(a.x,b.x,u), zz=lerp(a.z,b.z,u)+Math.sin(u*Math.PI)*0.055;
        const k=SZ(zz);
        pen.paint(()=>{ g.ellipse(X(xx,zz), Y(zz), W*0.013*k, H*0.006*k, 0.3, 0, 7); }, S(4), 2);
      }
    }
  }

  /* ================= THE PROPPED POSITION =================================
     The wall foot beside the gate. A body is set here and left sitting. What
     the SET owns is the worn hollow, the staff leaned where a hand let it go,
     and the anchor "prop:wall". Nobody is painted. */
  if (has("propped") && M.propped){
    const p = plan.stations.propped;
    const bx = X(p.x,p.z), by = Y(p.z), k = SZ(p.z);
    g.fillStyle = tn(3);                                   // ground stain, no rim
    g.beginPath(); g.ellipse(bx, by, W*0.052*k, H*0.021*k, 0, 0, 7); g.fill();
    pen.paint(()=>{ g.ellipse(bx, by-H*0.004*k, W*0.030*k, H*0.011*k, 0, 0, 7); }, S(1), 3);
    pen.paint(()=>{ g.moveTo(bx+W*0.008*k, by);            // the staff, leaned on the wall
      g.lineTo(bx+W*0.050*k, by-H*0.132*k);
      g.lineTo(bx+W*0.062*k, by-H*0.128*k);
      g.lineTo(bx+W*0.020*k, by+H*0.002*k); g.closePath(); }, S(5), 3);
    pen.paint(()=>{ g.ellipse(bx-W*0.042*k, by+H*0.008*k, W*0.019*k, H*0.008*k, 0.3,0,7); }, S(4), 3);
  }

  /* ================= THE DOOR-POSTS with their lamps ====================== */
  if (has("torches")){
    for(const tx of params.torchX){
      const z=params.torchZ, bx=X(tx,z), by=Y(z), k=SZ(z), hh=params.torchH*k*H;
      pen.paint(()=>{ g.rect(bx-W*0.013*k, by-hh, W*0.026*k, hh); }, S(2), 4);
      pen.paint(()=>{ g.rect(bx-W*0.023*k, by-hh-H*0.022*k, W*0.046*k, H*0.024*k); }, S(5), 4);
      pen.paint(()=>{ g.rect(bx-W*0.021*k, by-H*0.013*k, W*0.042*k, H*0.015*k); }, S(4), 3);
      if (M.torch==="lit"){
        for(let i=0;i<3;i++){
          const fh = H*0.050*k*(0.60+0.52*Math.abs(Math.sin(i*2.3+T*1.9)));
          const fx = bx+(i-1)*W*0.012*k;
          g.fillStyle=tn(7); g.beginPath();
          g.moveTo(fx-W*0.007*k, by-hh-H*0.022*k);
          g.lineTo(fx+(i%2?W*0.005:-W*0.005)*k, by-hh-H*0.022*k-fh);
          g.lineTo(fx+W*0.007*k, by-hh-H*0.022*k); g.closePath(); g.fill();
        }
      }
    }
  }

  /* ================= LITTER thrown down round the ring ==================== */
  if (has("litter") && M.litter){
    const { x:cx, z:cz, rx, rz } = params.ring;
    for(let i=0;i<11;i++){
      const a=R()*6.28, rr=1.30+R()*1.05;
      const xx=cx+Math.cos(a)*rx*rr, zz=cz+Math.sin(a)*rz*rr;
      const k=SZ(zz), sx=X(xx,zz), sy=Y(zz);
      if (R()<0.55) pen.paint(()=>{ g.ellipse(sx,sy,W*0.011*k,H*0.005*k,0,0,7); }, S(4), 2);
      else pen.ink(()=>{ g.moveTo(sx-W*0.012*k, sy); g.lineTo(sx+W*0.012*k, sy-H*0.008*k); }, 3);
    }
  }

  /* ================= FOREGROUND — two storage jars, near left =============
     Round mass against all that orthogonal masonry, and small: the near-left
     of the yard is the paper that lets the ring breathe, and the card's status
     word sits in that corner. */
  if (has("foreground")){
    for(const J of params.jars){
      const k=SZ(J.z), bx=X(J.x,J.z), by=Y(J.z);
      const rw = W*J.r*k, rh = H*J.r*1.30*k;
      g.fillStyle = tn(2);                                   // the shadow it stands in
      g.beginPath(); g.ellipse(bx, by, rw*1.20, rh*0.20, 0,0,7); g.fill();
      pen.paint(()=>{                                        // the belly
        g.moveTo(bx-rw*0.42, by);
        g.bezierCurveTo(bx-rw*1.05, by-rh*0.55, bx-rw*0.80, by-rh*1.35, bx-rw*0.34, by-rh*1.55);
        g.lineTo(bx+rw*0.34, by-rh*1.55);
        g.bezierCurveTo(bx+rw*0.80, by-rh*1.35, bx+rw*1.05, by-rh*0.55, bx+rw*0.42, by);
        g.closePath(); }, S(2), 5);
      pen.paint(()=>{ g.ellipse(bx, by-rh*1.55, rw*0.34, rh*0.13, 0,0,7); }, S(5), 4);  // mouth
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.28;                              // rib
      g.beginPath(); g.ellipse(bx, by-rh*0.86, rw*0.86, rh*0.16, 0, 0, Math.PI); g.stroke();
      g.globalAlpha=1;
    }
  }
}

/* ---- anchors are PROJECTED from the plan, never authored ----------------- */
const ANCHORS = {};
for (const n of plan.names()){
  const p = plan.at(n);
  ANCHORS[n] = { x:+clamp(p.x,0,1).toFixed(4), y:+clamp(p.y,0,1).toFixed(4) };
}
ANCHORS["entrance:door"] = ANCHORS.door_sill;
ANCHORS["entrance:gate"] = ANCHORS.gate_sill;
ANCHORS["exit:door"]     = ANCHORS.door_main;
ANCHORS["exit:gate"]     = ANCHORS.gate_mouth;
ANCHORS["prop:wall"]     = ANCHORS.propped;
ANCHORS["drag:start"]    = ANCHORS.ring_gate;
ANCHORS["drag:end"]      = ANCHORS.propped;
ANCHORS["camera:wide"]   = { x:.50, y:.50 };
ANCHORS["camera:ring"]   = { x:.46, y:.62 };
ANCHORS["camera:door"]   = { x:.50, y:.46 };
ANCHORS["camera:gate"]   = { x:.76, y:.72 };
ANCHORS["camera:low"]    = { x:.44, y:.84 };

const node = state => ({ preview:{ state, status:MODES[state].status } });

export const asset = {
  id:"location.fight-threshold",
  type:"LOCATION",
  name:"Fight Threshold",
  statusWord:"THE RING",
  scene:"OD-B18-S02",
  plan:"local:fight-threshold",
  adjacentTo:"location.megaron-hall",                   // through "door_main"
  adjacentToGate:"location.palace-dung-heap-and-gate",  // through "gate_mouth"

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  zones:{
    walkable:      { x0:.08, y0:.56, x1:.92, y1:.99 },
    "ring:floor":  { x0:.29, y0:.68, x1:.58, y1:.80 },
    "ring:kerb":   { x0:.26, y0:.66, x1:.61, y1:.82 },
    "porch:steps": { x0:.36, y0:.55, x1:.64, y1:.62 },
    "spectators":  { x0:.16, y0:.62, x1:.70, y1:.80 },
    "drag:path":   { x0:.56, y0:.76, x1:.80, y1:.90 },
    "gate:mouth":  { x0:.78, y0:.72, x1:.98, y1:.86 },
    "yard:open":   { x0:.08, y0:.82, x1:.56, y1:.99 },
  },
  /* depth layers, for scenes that interleave bodies with the set */
  occlusion:{ background:["sky","facade","door","porch"],
              middle:["yard","leftwall","rightwall","gate","ring","marks","seats",
                      "furrows","propped","torches","litter"],
              foreground:["foreground"] },

  states:{
    initial:"ring",
    nodes:{ empty:node("empty"), ring:node("ring"), fight:node("fight"),
            drag:node("drag"), aftermath:node("aftermath"), night:node("night") },
    edges:[["empty","ring"],["ring","fight"],["fight","drag"],["drag","aftermath"],
           ["aftermath","empty"],["ring","night"],["night","ring"],["ring","empty"]],
  },
  channels:["state","reveal","camera","light","torch","t"],

  preview:()=>({ state:"ring", t:0.4, status:"THE RING", progress:.26 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones }; },
};
export default asset;
