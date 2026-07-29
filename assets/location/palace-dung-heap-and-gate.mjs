/* location.palace-dung-heap-and-gate — THE OUTER GATE OF ODYSSEUS'S HOUSE,
   seen from the road, with the mule-dung heaped against the precinct wall.
   ADDITIVE, Book XVII. Modifies nothing; shadows nothing.

   WHY THIS IS NOT A ROOM WE ALREADY HAVE. location.megaron-hall is the great
   hall and location.eumaeus-hut-interior is the steading. This is neither: it
   is the EXTERIOR threshold — the last thirty feet of road, the courtyard gate,
   and the dung heap piled outside it. XVII.290: Argos lies here, on the dung of
   mules and cattle heaped before the gate, waiting for slaves who never come to
   cart it onto the fields. The set has to carry the book's one argument in its
   geometry: the same threshold that once kept a king's order now keeps a heap.

   THE ARGUMENT IS SPATIAL, NOT DECORATIVE. The frame is split by the lane.
   RIGHT of the gate the royal work survives — dressed ashlar, the stone seat,
   the offering basin on its plinth, coping unbroken. LEFT of the gate the same
   masonry is fouled — the heap, the tipped dung cart, weeds in the wall foot,
   coping gone from two bays. One wall, two fates, one shot. The `state`
   channel then plays the contrast in time: `remembered` clears the heap and
   hangs the pennon back on its pole; `neglect` is the present.

   PROJECTION. Every fixture is placed through the same law the blocking
   engine uses (README §5), so a figure blocked on this ground stands where
   the paint says it stands:
       x = 0.5 + (x-0.5)(0.42 + 0.58 z)      y = 0.50 + 0.46 z^1.08
   Anchors below are COMPUTED from that law, never eyeballed.

   STATES (state.state, default "neglect"):
     neglect     the heap, the tipped cart, weeds, a gate leaf off its pin (XVII)
     remembered  the same gate kept: heap gone, kennels manned, pennon flying
     night       unwatched, shutters of the gate drawn, one level darker
     swept       cleared and scoured after XXII — heap carted, cart righted

   SOLID tone + hard contour only; the engine dotify pass supplies the halftone.
   NO characters baked in — Argos gets an anchor ("heap:hollow"), not paint.
   Verify: node harness/render.mjs assets/location/palace-dung-heap-and-gate.mjs --pipeline MESH */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

/* ---- the law, unclamped (the set shell runs past where a body may stand) -- */
const SPREAD  = z => 0.42 + 0.58 * z;
const px      = (x, z) => 0.5 + (x - 0.5) * SPREAD(z);
const py      = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const SZu     = z => 0.60 + 0.50 * clamp(z, 0.08, 1);
const HORIZON = 0.50;

const params = {
  wallZ:0.14,        // depth of the precinct wall plane
  gateHalf:0.20,     // half-width of the gateway, in PLAN x
  gateHeight:0.30,   // unit height of the opening
  bays:4,            // masonry bays in each wall run
  heap:{ x:0.26, z:0.62, hx:0.20, hz:0.13, h:0.115 },   // the dung heap, in plan
  clumps:9,          // lumps crowning the heap
  ruts:2,            // cart ruts running out of the gate
  weeds:7,
};

/* ---- the state channel --------------------------------------------------- */
const MODES = {
  neglect:   { lift:0, status:"FOULED",     heap:true,  cart:"tipped",  leaf:"hanging",
               weeds:true,  coping:"broken", sky:1, kennels:false, pennon:false },
  remembered:{ lift:0, status:"AS IT WAS",  heap:false, cart:"none",    leaf:"open",
               weeds:false, coping:"whole",  sky:1, kennels:true,  pennon:true  },
  night:     { lift:1, status:"UNWATCHED",  heap:true,  cart:"tipped",  leaf:"shut",
               weeds:true,  coping:"broken", sky:2, kennels:false, pennon:false },
  swept:     { lift:0, status:"CARTED",     heap:false, cart:"upright", leaf:"open",
               weeds:false, coping:"broken", sky:1, kennels:false, pennon:false },
};

const LAYERS = ["sky","ridge","palace","wall","gate","apron","lane","order",
                "heap","cart","weeds","foreground"];

function drawSet(ctx, W, H, st){
  const pen  = makePen(ctx, { outline:true });
  const g    = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "neglect";
  const M    = MODES[mode];
  const layers = (st && st.layers) || LAYERS;
  const has  = l => layers.includes(l);
  const R    = rnd(70417);

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
  /* a broken run of ground line — never a bar all the way across the frame */
  const dashRow = (z, x0, x1, n, alpha=0.26) => {
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=alpha;
    for(let i=0;i<n;i++){
      const a = lerp(x0,x1,i/n), b = lerp(x0,x1,(i+0.62)/n);
      g.beginPath(); g.moveTo(X(a,z),Y(z)); g.lineTo(X(b,z),Y(z)); g.stroke();
    }
    g.globalAlpha=1;
  };

  const WZ = params.wallZ, GH = params.gateHalf;
  const wallBase = Y(WZ);
  const wallTop  = wallBase - H*0.150;
  const towerTop = wallBase - H*0.232;

  /* ================= SKY ================================================== */
  if (has("sky")){
    g.fillStyle = inkLevel(M.sky); g.fillRect(0,0,W,HORIZON*H);
  }

  /* ================= FAR RIDGE beyond the town ============================ */
  if (has("ridge")){
    pen.paint(()=>{
      g.moveTo(0, H*0.415);
      g.quadraticCurveTo(W*0.20, H*0.352, W*0.40, H*0.404);
      g.quadraticCurveTo(W*0.62, H*0.452, W*0.80, H*0.386);
      g.quadraticCurveTo(W*0.92, H*0.350, W, H*0.398);
      g.lineTo(W, HORIZON*H); g.lineTo(0, HORIZON*H); g.closePath();
    }, S(2), 4);
  }

  /* ================= THE PALACE MASS standing over its own wall ===========
     Two roof blocks, offset either side of the gate, so the skyline steps
     instead of striping. The house is still the biggest thing on the island;
     the point of the shot is what is heaped at its foot. */
  if (has("palace")){
    const roof = (x0,x1,rise,tone,piers) => {
      const a=X(x0,WZ), b=X(x1,WZ), top=wallBase-H*rise;
      pen.paint(()=>{ g.rect(a, top, b-a, wallBase-top); }, S(tone), 5);
      pen.paint(()=>{ g.rect(a-W*0.014, top, (b-a)+W*0.028, H*0.018); }, S(4), 4);  // eaves
      // pilaster rhythm — the wing is columned, not a blank suburban box
      for(let i=1;i<piers;i++){
        const xq = lerp(a,b,i/piers);
        pen.paint(()=>{ g.rect(xq-W*0.007, top+H*0.020, W*0.014, wallBase-top-H*0.020); }, S(3), 3);
      }
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.22;                          // courses
      for(let j=1;j<=3;j++){ const y=lerp(top,wallBase,j/4);
        g.beginPath(); g.moveTo(a,y); g.lineTo(b,y); g.stroke(); }
      g.globalAlpha=1;
    };
    roof(0.02, 0.34, 0.300, 2, 3);
    roof(0.66, 1.02, 0.342, 2, 4);
    // the ridge-pole gable of the megaron itself, dead behind the gateway
    pen.paint(()=>{
      g.moveTo(X(0.32,WZ), wallBase-H*0.300);
      g.lineTo(X(0.50,WZ), wallBase-H*0.392);
      g.lineTo(X(0.68,WZ), wallBase-H*0.300);
      g.closePath();
    }, S(3), 5);
    // two dark clerestory slots — the only near-black in the upper third
    for(const u of [0.40,0.60])
      pen.paint(()=>{ g.rect(X(u,WZ)-W*0.016, wallBase-H*0.286, W*0.032, H*0.040); }, S(6), 4);
  }

  /* ================= THE PRECINCT WALL — bays, buttresses, coping =========
     Drawn bay by bay with a gap and a buttress between each, and the coping
     capped per bay: one continuous stone bar would stripe the whole frame. */
  if (has("wall")){
    const run = (xa, xb, fouled) => {
      const n = params.bays;
      for(let i=0;i<n;i++){
        const a = lerp(xa,xb,i/n) + 0.006, b = lerp(xa,xb,(i+1)/n) - 0.006;
        const jit = 0.86 + 0.20*((i*7)%3)/2;
        const top = wallBase - (wallBase-wallTop)*jit;
        // the bay is MASS, not an outline: a mid plane so the buttresses read
        // as thickened wall and not as the legs of a table
        pen.paint(()=>{ g.rect(X(a,WZ), top, X(b,WZ)-X(a,WZ), wallBase-top); }, S(3), 5);
        // coping cap — present, notched, or gone
        const gone = fouled && M.coping==="broken" && (i===1 || i===2);
        if (!gone){
          pen.paint(()=>{ g.rect(X(a,WZ)-W*0.006, top, (X(b,WZ)-X(a,WZ))+W*0.012, H*0.013); }, S(4), 4);
        } else {
          for(let k=0;k<3;k++){                       // stumps of a lost course
            const u0=lerp(a,b,(k+0.10)/3), u1=lerp(a,b,(k+0.45)/3);
            pen.paint(()=>{ g.rect(X(u0,WZ), top+H*0.004, X(u1,WZ)-X(u0,WZ), H*0.011); }, S(4), 3);
          }
        }
        // ashlar joints
        g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.24;
        for(let j=1;j<=3;j++){ const y=lerp(top,wallBase,j/4);
          g.beginPath(); g.moveTo(X(a,WZ),y); g.lineTo(X(b,WZ),y); g.stroke(); }
        g.beginPath(); g.moveTo(X(lerp(a,b,.5),WZ),top); g.lineTo(X(lerp(a,b,.5),WZ),wallBase); g.stroke();
        g.globalAlpha=1;
        // plinth course at the foot of the bay — terminates the wall on the
        // ground instead of leaving it standing in air
        pen.paint(()=>{ g.rect(X(a,WZ), wallBase-H*0.014, X(b,WZ)-X(a,WZ), H*0.014); }, S(4), 3);
        // buttress at the joint, same mass as the wall + a hard edge
        if (i<n-1){
          const bx = lerp(xa,xb,(i+1)/n);
          pen.paint(()=>{ g.rect(X(bx,WZ)-W*0.010, top+H*0.020, W*0.020, wallBase-top-H*0.020); }, S(4), 4);
        }
      }
    };
    run(-0.62, 0.5-GH-0.08, true);    // the fouled run, left of the gate
    run(0.5+GH+0.08, 1.62, false);    // the kept run, right of the gate
  }

  /* ================= THE GATEWAY ========================================== */
  if (has("gate")){
    const zt = WZ, k = SZ(zt);
    const xL = X(0.5-GH, zt), xR = X(0.5+GH, zt);
    const dh = params.gateHeight * k * H;
    const yTop = wallBase - dh;
    // two gate towers
    for(const [a,b] of [[0.5-GH-0.08, 0.5-GH],[0.5+GH, 0.5+GH+0.08]]){
      pen.paint(()=>{ g.rect(X(a,zt), towerTop, X(b,zt)-X(a,zt), wallBase-towerTop); }, S(3), 5);
      pen.paint(()=>{ g.rect(X(a,zt)-W*0.008, towerTop, (X(b,zt)-X(a,zt))+W*0.016, H*0.020); }, S(5), 4);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.30;
      for(let j=1;j<=4;j++){ const y=lerp(towerTop,wallBase,j/5);
        g.beginPath(); g.moveTo(X(a,zt),y); g.lineTo(X(b,zt),y); g.stroke(); }
      g.globalAlpha=1;
    }
    // lintel over the opening
    pen.paint(()=>{ g.rect(xL-W*0.014, yTop-H*0.030, (xR-xL)+W*0.028, H*0.034); }, S(5), 5);
    // THE OPENING — the deep dark of the courtyard beyond. The set's one hole.
    pen.paint(()=>{ g.rect(xL, yTop, xR-xL, dh); }, S(5), 5);
    /* the two REVEALS: the thickness of the wall, splayed into the passage.
       Without them the gateway prints as a flat black panel; with them the
       eye reads a throat, and the bright slot at the end is the courtyard. */
    const rv = (xR-xL)*0.26;
    pen.paint(()=>{ g.moveTo(xL, yTop); g.lineTo(xL+rv, yTop+dh*0.12);
      g.lineTo(xL+rv, yTop+dh); g.lineTo(xL, yTop+dh); g.closePath(); }, S(3), 4);
    pen.paint(()=>{ g.moveTo(xR, yTop); g.lineTo(xR-rv, yTop+dh*0.12);
      g.lineTo(xR-rv, yTop+dh); g.lineTo(xR, yTop+dh); g.closePath(); }, S(4), 4);
    // daylight standing at the far end of the throat
    pen.paint(()=>{ g.rect(xL+(xR-xL)*0.38, yTop+dh*0.22, (xR-xL)*0.24, dh*0.78); },
      toneSolid(inkLevel(M.lift ? 2 : 0)), 4);
    // the leaves
    if (M.leaf==="shut" || M.leaf==="hanging"){
      const spec = M.leaf==="shut" ? [[0,0.5,0],[0.5,1,0]] : [[0.60,1,0.14]];
      for(const [u0,u1,tilt] of spec){
        const lx0=xL+(xR-xL)*u0, lw2=(xR-xL)*(u1-u0);
        g.save(); g.translate(lx0, yTop+dh); g.rotate(tilt); g.translate(-lx0, -(yTop+dh));
        pen.paint(()=>{ g.rect(lx0, yTop+dh*0.06, lw2, dh*0.94); }, S(4), 4);
        g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.5;
        for(let j=1;j<=3;j++){ const yy=yTop+dh*(j/4);
          g.beginPath(); g.moveTo(lx0,yy); g.lineTo(lx0+lw2,yy); g.stroke(); }
        g.globalAlpha=1;
        pen.paint(()=>{ g.rect(lx0+lw2*0.14, yTop+dh*0.42, lw2*0.24, H*0.014); }, S(6), 3);
        g.restore();
      }
      if (M.leaf==="hanging"){   // the pin it came off, still in the jamb
        pen.paint(()=>{ g.rect(xR-W*0.014, yTop+dh*0.30, W*0.014, H*0.020); }, S(6), 3);
      }
    }
    // the worn stone sill of the gateway
    planBox(0.5-GH, 0.5+GH, WZ+0.020, WZ+0.070, 0.028, 2, 5, 5);
    // the pennon pole beside the right tower
    if (M.pennon){
      const pxp = X(0.5+GH+0.10, zt);
      pen.paint(()=>{ g.rect(pxp-W*0.006, towerTop-H*0.110, W*0.012, H*0.116); }, S(5), 3);
      pen.paint(()=>{ g.moveTo(pxp+W*0.006, towerTop-H*0.104);
        g.lineTo(pxp+W*0.072, towerTop-H*0.080);
        g.lineTo(pxp+W*0.006, towerTop-H*0.052); g.closePath(); }, S(4), 4);
    }
  }

  /* ================= GROUND, APRON, LANE ================================== */
  if (has("apron")){
    g.fillStyle = tn(1); g.fillRect(0, HORIZON*H, W, H-HORIZON*H);   // the road dust
    /* the dressed apron outside the gate. FILLED, not outlined — a contour
       round a patch of ground makes it hover like a tabletop. Its only hard
       edge is the near lip, and that is broken. */
    g.fillStyle = tn(2);
    g.beginPath(); quad(0.5-GH-0.05, 0.5+GH+0.05, WZ+0.055, 0.40)(); g.fill();
    dashRow(0.40, 0.5-GH-0.05, 0.5+GH+0.05, 3, 0.55);                // the near lip
    // slab joints across the apron, broken into courses
    for(const z of [0.19, 0.26, 0.34]) dashRow(z, 0.5-GH-0.03, 0.5+GH+0.03, 4, 0.30);
    for(const u of [0.5-GH*0.5, 0.5+GH*0.5]){
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.28;
      g.beginPath(); g.moveTo(X(u,WZ+0.06),Y(WZ+0.06)); g.lineTo(X(u,0.40),Y(0.40)); g.stroke();
      g.globalAlpha=1;
    }
    if (M.coping==="broken"){        // slabs lifted out of the fouled half
      for(const [a,z] of [[0.34,0.24],[0.40,0.33],[0.31,0.36]])
        pen.paint(quad(a-0.035, a+0.035, z-0.028, z+0.028), S(3), 3);
    }
    /* verge patches either side — trodden earth. FILLED, never outlined; and
       broken into unequal scuffs, because one big quad per side lays its far
       edge clean across the frame as a tone rule. */
    g.fillStyle = tn(2);
    const scuff = [[-0.26,0.12,0.30,0.46],[-0.10,0.22,0.50,0.66],[0.02,0.30,0.72,0.92],
                   [0.74,1.16,0.34,0.50],[0.66,1.00,0.56,0.70],[0.80,1.26,0.76,0.98]];
    for(const [a,b,z0,z1] of scuff){ g.beginPath(); quad(a,b,z0,z1)(); g.fill(); }
  }

  if (has("lane")){
    // cart ruts running out of the gate toward camera — the road that carries
    // the heap away, on the day anyone bothers to carry it
    g.strokeStyle=INK; g.lineCap="round";
    for(let r=0;r<params.ruts;r++){
      const u = 0.46 + r*0.08;
      g.lineWidth=5; g.globalAlpha=.60;
      g.beginPath();
      for(let i=0;i<=18;i++){ const z=lerp(0.18,1.24,i/18);
        const xx = X(u + (z-0.18)*0.10*(r?1:-1), z), yy = Y(z);
        if(i===0) g.moveTo(xx,yy); else g.lineTo(xx,yy); }
      g.stroke(); g.globalAlpha=1;
    }
    for(const z of [0.46, 0.68, 0.94]) dashRow(z, 0.10, 0.90, 5, 0.20);
  }

  /* ================= THE KEPT SIDE — stone seat, basin, kennels ===========
     Everything on the right of the lane is masonry that still does its job. */
  if (has("order")){
    // the polished stone seat outside the gate (Odysseus's own, XVII).
    // Open-backed: two posts and a rail, so it frames rather than blocks.
    planBox(0.70, 0.88, 0.46, 0.55, 0.058, 1, 3, 4);
    { const zb=0.55, kk=SZ(zb), yb=Y(zb)-0.058*kk*H, bh=0.062*kk*H;
      for(const u of [0.70, 0.88-0.022])
        pen.paint(()=>{ g.rect(X(u,zb), yb-bh, W*0.016, bh); }, S(4), 3);
      pen.paint(()=>{ g.rect(X(0.70,zb), yb-bh, X(0.88,zb)-X(0.70,zb), H*0.016); }, S(4), 3);
    }
    // the offering basin on its plinth, further back
    planBox(0.87, 0.97, 0.34, 0.39, 0.080, 2, 3, 4);
    { const zb=0.39, kk=SZ(zb), yb=Y(zb)-0.080*kk*H;
      pen.paint(()=>{ g.ellipse(X(0.92,zb), yb-H*0.010, W*0.032, H*0.014, 0,0,7); }, S(4), 4);
      pen.paint(()=>{ g.ellipse(X(0.92,zb), yb-H*0.012, W*0.017, H*0.007, 0,0,7); }, S(1), 3);
    }
    if (M.kennels){
      for(let i=0;i<2;i++){
        const a=0.68+i*0.14;
        planBox(a, a+0.10, 0.24+i*0.03, 0.31+i*0.03, 0.085, 2, 4, 3);
        pen.paint(()=>{ const zb=0.31+i*0.03, kk=SZ(zb);
          g.rect(X(a+0.032,zb), Y(zb)-0.070*kk*H, W*0.030, 0.070*kk*H); }, S(6), 3);
      }
    }
  }

  /* ================= THE HEAP ============================================
     Mule and cattle dung, heaped where it was dropped. Body kept mid-tone so
     the paper still breathes; the darks are the crowning lumps and the hollow
     worn into the near face — the shape of a dog that has lain there for years.
     Argos is NOT painted. He gets the anchor "heap:hollow". */
  if (has("heap") && M.heap){
    const Hp = params.heap, z = Hp.z;
    const base = Y(z), k = SZ(z);
    const cx = X(Hp.x, z);
    const halfW = (X(Hp.x+Hp.hx, z) - X(Hp.x-Hp.hx, z))/2;
    const hh = Hp.h * k * H;
    // ground stain the heap sits in — FILLED, no contour: a hard-outlined
    // ellipse round the foot reads as a puddle rim instead of soiled ground
    g.fillStyle = tn(2);
    g.beginPath(); g.ellipse(cx, base+H*0.012, halfW*1.16, H*0.032, 0,0,7); g.fill();
    // the mound — a lumpy profile, walked round from left foot to right foot
    pen.paint(()=>{
      g.moveTo(cx-halfW, base+H*0.004);
      const N=7;
      for(let i=0;i<=N;i++){
        const u = i/N, ang = Math.PI*(1-u);
        const wob = 0.86 + 0.24*((i*5)%4)/3;
        const xx = cx + Math.cos(ang)*halfW;
        const yy = base + H*0.004 - Math.sin(ang)*hh*wob;
        if(i===0) g.lineTo(xx,yy);
        else g.quadraticCurveTo(cx + Math.cos(ang+0.22)*halfW*1.02,
                                base + H*0.004 - Math.sin(ang+0.22)*hh*wob*1.06, xx, yy);
      }
      g.lineTo(cx+halfW, base+H*0.010);
      g.closePath();
    }, S(3), 5);
    // crowning lumps — the dark accent of the whole left half
    for(let i=0;i<params.clumps;i++){
      const u = (i+0.5)/params.clumps;
      const ang = Math.PI*(1-u);
      const lx = cx + Math.cos(ang)*halfW*(0.62+0.28*R());
      const ly = base - Math.sin(ang)*hh*(0.52+0.36*R());
      const lr = W*0.014 + W*0.014*R();
      pen.paint(()=>{ g.ellipse(lx, ly, lr, lr*0.62, 0,0,7); }, S(i%3===0 ? 5 : 4), 3);
    }
    // straw and stalks standing out of it
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.62;
    for(let i=0;i<13;i++){
      const u=R(), ang=Math.PI*(1-u);
      const sx=cx+Math.cos(ang)*halfW*(0.30+0.60*R());
      const sy=base-Math.sin(ang)*hh*(0.40+0.50*R());
      g.beginPath(); g.moveTo(sx,sy);
      g.lineTo(sx+(R()-0.5)*W*0.036, sy-H*0.020-H*0.020*R()); g.stroke();
    }
    g.globalAlpha=1;
    /* THE HOLLOW worn into the near-left face — where a dog has lain twenty
       years. Kept SHALLOW and un-paired: an outlined oval with a curve under
       it turns into a face at halftone scale, which is the last thing this
       shot needs. One light scoop, one lip. */
    const hx0 = cx - halfW*0.50, hy0 = base - hh*0.24;
    pen.paint(()=>{ g.ellipse(hx0, hy0, halfW*0.30, hh*0.22, -0.14, 0, 7); }, S(1), 3);
    pen.ink(()=>{ g.moveTo(hx0-halfW*0.30, hy0+hh*0.20);
      g.lineTo(hx0+halfW*0.26, hy0+hh*0.26); }, 3);
    // flies over it
    g.fillStyle=tn(6);
    for(let i=0;i<7;i++){
      g.beginPath(); g.arc(cx+(R()-0.5)*halfW*1.7, base-hh*(1.05+0.55*R()), W*0.005, 0, 7); g.fill();
    }
  }

  /* ================= THE DUNG CART ======================================== */
  if (has("cart") && M.cart!=="none"){
    const z=0.80, base=Y(z), k=SZ(z), cx=X(0.86, z);
    const bw=W*0.150*k, bh=H*0.062*k, wr=W*0.052*k;
    const tip = M.cart==="tipped";
    g.save(); g.translate(cx, base); if(tip) g.rotate(0.30);
    // the bed
    pen.paint(()=>{ g.rect(-bw/2, -bh*2.0, bw, bh); }, S(3), 5);
    pen.paint(()=>{ g.rect(-bw/2, -bh*2.6, bw*0.10, bh*0.70); }, S(5), 3);
    pen.paint(()=>{ g.rect(bw*0.40, -bh*2.6, bw*0.10, bh*0.70); }, S(5), 3);
    // the shafts, up in the air when it is tipped
    pen.ink(()=>{ g.moveTo(bw*0.44, -bh*1.7); g.lineTo(bw*1.30, -bh*2.9); }, 5);
    pen.ink(()=>{ g.moveTo(bw*0.44, -bh*1.2); g.lineTo(bw*1.28, -bh*2.3); }, 5);
    // the wheel — the near one whole, hub dark
    pen.paint(()=>{ g.ellipse(-bw*0.18, -bh*0.60, wr, wr, 0,0,7); }, S(2), 5);
    g.strokeStyle=INK; g.lineWidth=3;
    for(let i=0;i<6;i++){ const a=i*Math.PI/3 + (tip?0.4:0);
      g.beginPath(); g.moveTo(-bw*0.18, -bh*0.60);
      g.lineTo(-bw*0.18+Math.cos(a)*wr*0.92, -bh*0.60+Math.sin(a)*wr*0.92); g.stroke(); }
    pen.paint(()=>{ g.ellipse(-bw*0.18, -bh*0.60, wr*0.24, wr*0.24, 0,0,7); }, S(6), 3);
    g.restore();
    if (tip){   // the load that went over with it
      pen.paint(()=>{ g.ellipse(cx-W*0.075, base+H*0.006, W*0.056, H*0.020, 0,0,7); }, S(4), 4);
      pen.paint(()=>{ g.ellipse(cx-W*0.100, base-H*0.004, W*0.026, H*0.013, 0,0,7); }, S(5), 3);
    }
  }

  /* ================= WEEDS in the wall foot =============================== */
  if (has("weeds") && M.weeds){
    /* clustered and unequal — an evenly spaced row of identical tufts reads as
       a comb, not as neglect. */
    for(let i=0;i<params.weeds;i++){
      const xp = -0.26 + (i/params.weeds)*0.76 + (R()-0.5)*0.10;
      const z  = WZ + 0.030 + 0.10*R();
      const bx = X(xp, z), by = Y(z), k = SZ(z) * (0.62 + 0.85*R());
      pen.paint(()=>{
        g.moveTo(bx-W*0.016*k, by);
        g.lineTo(bx-W*0.004*k, by-H*0.048*k);
        g.lineTo(bx+W*0.006*k, by-H*0.016*k);
        g.lineTo(bx+W*0.018*k, by-H*0.040*k);
        g.lineTo(bx+W*0.016*k, by);
        g.closePath();
      }, S(4), 3);
    }
    // a tussock breaking the apron edge on the fouled side
    pen.paint(()=>{ g.ellipse(X(0.30,0.44), Y(0.44), W*0.030, H*0.014, 0,0,7); }, S(3), 3);
  }

  /* ================= FOREGROUND — one stub each side, low, well apart =====
     Both stubs used to sit near the bottom-right with the cart and the drum,
     and the three of them clotted into one black mass. Split them: the ruined
     precinct return comes in at the LEFT edge, the fallen drum lies at the
     RIGHT, and the road runs out between them. */
  if (has("foreground")){
    planBox(-0.40, -0.02, 0.94, 1.22, 0.150, 2, 4, 5);
    // a fallen column drum lying in the road, near right, clear of the cart
    const z=1.06, base=Y(z), k=SZ(z), dx=X(0.78,z);
    pen.paint(()=>{ g.ellipse(dx, base-H*0.024*k, W*0.058*k, H*0.026*k, 0.10, 0,7); }, S(2), 5);
    pen.paint(()=>{ g.ellipse(dx-W*0.048*k, base-H*0.024*k, W*0.018*k, H*0.026*k, 0.10, 0,7); }, S(4), 4);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.42;
    for(const q of [-0.4,0,0.4]){ g.beginPath();
      g.moveTo(dx+W*0.058*k*q, base-H*0.048*k); g.lineTo(dx+W*0.058*k*q, base+H*0.000*k); g.stroke(); }
    g.globalAlpha=1;
  }
}

/* ---- anchors are DERIVED from the projection law, never authored --------- */
const P = (x,z) => ({ x:+clamp(px(x,z),0,1).toFixed(4), y:+clamp(py(z),0,1).toFixed(4) });
const HP = params.heap;
const heapCrest  = { x:+px(HP.x,HP.z).toFixed(4),
                     y:+(py(HP.z) - HP.h*SZu(HP.z)).toFixed(4) };
const heapHollow = { x:+px(HP.x-HP.hx*0.46, HP.z).toFixed(4),
                     y:+(py(HP.z) - HP.h*SZu(HP.z)*0.30).toFixed(4) };

const ANCHORS = {
  "gate:mouth":      P(0.50, params.wallZ),
  "gate:sill":       P(0.50, params.wallZ+0.055),
  "gate:post-l":     P(0.50-params.gateHalf, params.wallZ+0.03),
  "gate:post-r":     P(0.50+params.gateHalf, params.wallZ+0.03),
  "apron:centre":    P(0.50, 0.30),
  "apron:left":      P(0.36, 0.36),
  "apron:right":     P(0.64, 0.36),
  "heap:crest":      heapCrest,
  "heap:hollow":     heapHollow,          // Argos lies here — anchor, not paint
  "heap:foot":       P(HP.x+0.06, HP.z+0.10),
  "heap:lee":        P(HP.x-HP.hx-0.05, HP.z+0.02),
  "seat:stone":      P(0.79, 0.55),
  "basin:offering":  P(0.92, 0.40),
  "kennel:row":      P(0.75, 0.30),
  "cart:broken":     P(0.86, 0.80),
  "drum:fallen":     P(0.78, 1.00),
  "lane:mid":        P(0.50, 0.62),
  "lane:near":       P(0.50, 0.98),
  "verge:left":      P(0.16, 0.50),
  "verge:right":     P(0.90, 0.62),
  "entrance:gate":   P(0.50, params.wallZ+0.055),
  "entrance:road":   P(0.50, 1.00),
  "exit:gate":       P(0.50, params.wallZ),
  "exit:road":       P(0.42, 1.00),
  "camera:wide":     { x:.50, y:.50 },
  "camera:gate":     { x:.50, y:.46 },
  "camera:heap":     { x:.32, y:.66 },
  "camera:low":      { x:.44, y:.80 },
};

const node = state => ({ preview:{ state, status:MODES[state].status } });

export const asset = {
  id:"location.palace-dung-heap-and-gate",
  type:"LOCATION",
  name:"Palace Dung Heap and Gate",
  statusWord:"FOULED",
  scene:"OD-B17-S03",
  plan:"local:gate-approach",
  adjacentTo:"location.megaron-hall",     // through "gate:mouth"

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  zones:{
    walkable:     { x0:.06, y0:.56, x1:.96, y1:.99 },
    "lane:road":  { x0:.36, y0:.58, x1:.64, y1:.99 },
    "apron:gate": { x0:.38, y0:.56, x1:.62, y1:.70 },
    "heap":       { x0:.15, y0:.65, x1:.48, y1:.82 },
    "verge:kept": { x0:.64, y0:.62, x1:.96, y1:.84 },
    "threshold":  { x0:.40, y0:.55, x1:.60, y1:.60 },
  },
  /* depth layers, for scenes that need to interleave bodies with the set */
  occlusion:{ background:["sky","ridge","palace","wall","gate"],
              middle:["apron","lane","order","heap","cart","weeds"],
              foreground:["foreground"] },

  states:{
    initial:"neglect",
    nodes:{ neglect:node("neglect"), remembered:node("remembered"),
            night:node("night"),     swept:node("swept") },
    edges:[["neglect","remembered"],["remembered","neglect"],
           ["neglect","night"],["night","neglect"],["neglect","swept"],["swept","neglect"]],
  },
  channels:["state","reveal","camera","light","t"],

  preview:()=>({ state:"neglect", status:"FOULED", progress:.24 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones }; },
};
export default asset;
