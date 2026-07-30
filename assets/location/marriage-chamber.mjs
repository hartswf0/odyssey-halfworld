/* location.marriage-chamber — THE THALAMOS. The room Odysseus built with his own
   hands around a living olive, and the one secret in the poem that only two
   people hold. ADDITIVE, Book XXIII. Modifies nothing; shadows nothing.

   WHY THIS FILE EXISTS. XXIII.177–204 is a test conducted on furniture: Penelope
   orders the bed carried OUT, and the man who built it says it cannot be — he
   trimmed the trunk of a long-leaved olive from the root up, made it a bedpost,
   and laid the close-set stone walls of this chamber AROUND it. So the plot fact
   of this room is not a mood, it is a JOINT: the bed is continuous with the
   ground. This set therefore paints the trunk still rooted, the paving cut open
   around its flare, and the tenon where the bed rail is pegged into living wood.
   Everything else in the room is subordinate to that one immovable post.

   NOT THE MEGARON, NOT THE UPPER CHAMBER. The great hall is
   location.megaron-hall (state channel day|feast|night|contest|battle|
   aftermath|cleaned); Penelope's workroom at the head of the stair is
   location.upper-chamber-and-stair. This is the third room: the marriage
   chamber, entered only at the very end of XXIII, one doorway, no stair, no
   loom, no bench line. It is a LOCATION — an empty navigable set. No characters
   are baked in.

   STATES (state.state, default "closed") — each changes what is DRAWN:
     unused      twenty years shut: bed bare to the thongs, pegs empty, no lamp
     lamplit     the maids have made it and gone; torch-lamp high, doors open
     closed      doors shut and barred, lamp low                    (XXIII.295)
     night-held  Athena holds Dawn at the Ocean stream — the dawn gauge is
                 pinned at the sill by a stop bar and cannot rise  (XXIII.241–6)
     dawn        the stop bar gone, the gauge full, one leaf ajar, lamp
                 guttering, clothing taken up off the pegs          (XXIII.344)

   THE ROOM IS PROJECTED, NOT HAND-DRAWN. Every fixture is placed by pushing a
   station of the local plan (exported as `plan`, built with the same
   engine/blocking.mjs makePlan the two authored rooms use) through the README §5
   depth law. A figure blocked at `bed_r` therefore stands on the right side of
   the bed painted here, and `plan.ray("door_pair","bed_head",u)` walks the real
   floor. Scenes must import { plan as thalamos } and block through it.

   SOLID tone + hard contour only; the engine dotify pass supplies the halftone.
   Verify: node harness/render.mjs assets/location/marriage-chamber.mjs --state dawn */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";
import { makePlan } from "../../engine/blocking.mjs";

/* ---- THE PLAN — authored here, once. x: 0 left..1 right, z: 0 far..1 near --- */
export const plan = makePlan({
  id: "thalamos",
  name: "The Marriage Chamber at Ithaca",
  notes: "One doorway only, in the far wall right of centre — Homer gives the " +
         "chamber jointed close-fitting doors and nothing else. The olive post " +
         "is at the bed's NEAR-LEFT corner and is ROOTED: it may never be " +
         "re-placed, re-scaled or moved, in this or any scene. The bed is the " +
         "proof of identity; the room is only its casing.",
  stations: {
    // --- architecture ---
    door_pair:   { x:.62, z:.10 },   // the jointed doors, far wall
    threshold:   { x:.62, z:.20 },   // one step inside them
    dawn_slot:   { x:.98, z:.23 },   // the high slot in the RIGHT wall = the gauge
    lamp_stand:  { x:.94, z:.70 },   // Eurynome's torch, set in its stand
    clothes_pegs:{ x:.04, z:.40 },   // the pegs on the left wall
    clothes_chest:{x:.14, z:.30 },   // the chest, far-left corner
    // --- the bed, and the post that cannot be lifted ---
    bed_head:    { x:.55, z:.46 },
    bed_l:       { x:.34, z:.64 },   // paired contact stations: two bodies that
    bed_r:       { x:.76, z:.64 },   // touch across the bed resolve apart
    bed_foot:    { x:.55, z:.84 },
    olive_post:  { x:.30, z:.82 },   // THE ROOTED TRUNK. Do not move.
    root_flare:  { x:.18, z:.86 },   // where the paving is cut open
    // --- standing room ---
    floor_near:  { x:.55, z:1.02 },  // downstage, facing the bed
    corner_far:  { x:.16, z:.16 },
  },
  fixtures: [
    { id:"olive_bed", kind:"prop", at:"olive_post",
      note:"prop.olive-tree-marriage-bed is the same object seen close; its post " +
           "must land on station olive_post at this scale or the test breaks" },
    { id:"lamp", kind:"sound_source", at:"lamp_stand" },
  ],
});

/* ---- the projection, unclamped ------------------------------------------
   project() clamps z to [0.08,1] because a FIGURE never stands outside the
   room. The SHELL has to run past the near clip and up to the roof, so it uses
   the identical formula un-clamped. Same law, wider domain (README §5):
     x = 0.5 + (x-0.5)(0.42 + 0.58 z)      y = 0.50 + 0.46 z^1.08
   Every station still goes through plan.at() itself, via A(). */
const SPREAD = z => 0.42 + 0.58 * z;
const px = (x, z) => 0.5 + (x - 0.5) * SPREAD(z);
const py = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const HORIZON = 0.50;

const params = {
  plan:"thalamos",
  roofRise:0.21,      // a LOW ceiling — this is a private room, not the hall
  roofRake:0.17,
  rafters:4,
  doorHalf:0.11,      // half-width of the jointed doors, in PLAN x
  doorHeight:0.30,    // unit height (README §5: h = H s (0.60+0.50 d))
  bedX0:0.30, bedX1:0.80, bedZ0:0.46, bedZ1:0.82,
  bedHeight:0.072,    // frame top off the floor, unit
  headHeight:0.150,   // headboard above the frame, unit
  postHeight:0.405,   // the lopped olive: unit height above the floor
  postWidth:0.075,    // "thick as a pillar" — XXIII.191
  roots:4,
  inlays:3,
  thongs:7,           // the ox-hide lattice under the bedding
};
const ceilY = z => HORIZON - (params.roofRise + params.roofRake * Math.pow(z, 1.08));

/* ---- the state channel. `lift` is one lighting offset over the whole room;
   everything else in the row changes what geometry is built. ---------------- */
const MODES = {
  unused:      { lift:1, floorLift:1,  status:"SEALED",   doors:"shut", bar:true,  lamp:"none",      bedding:"bare",  clothes:false, dawn:"none" },
  lamplit:     { lift:0, floorLift:0,  status:"MADE",     doors:"open", bar:false, lamp:"high",      bedding:"made",  clothes:true,  dawn:"none" },
  closed:      { lift:0, floorLift:0,  status:"SHUT",     doors:"shut", bar:true,  lamp:"low",       bedding:"made",  clothes:true,  dawn:"none" },
  "night-held":{ lift:1, floorLift:0,  status:"HELD",     doors:"shut", bar:true,  lamp:"low",       bedding:"slept", clothes:true,  dawn:"held" },
  dawn:        { lift:0, floorLift:-1, status:"RELEASED", doors:"ajar", bar:false, lamp:"guttering", bedding:"slept", clothes:false, dawn:"full" },
};

const LAYERS = ["shell","roof","farwall","gauge","doors","threshold","pegs","chest",
                "bed","bedding","trunk","lamp","light"];

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "closed";
  const M    = MODES[mode];
  const T    = (st && st.t) || 0;
  const layers = (st && st.layers) || LAYERS;
  const has = l => layers.includes(l);
  const P = params;

  const tn = l => inkLevel(clamp(Math.round(l + M.lift), 0, 7));
  const fn = l => inkLevel(clamp(Math.round(l + M.lift + M.floorLift), 0, 7));
  const S  = l => toneSolid(tn(l));
  const SF = l => toneSolid(fn(l));
  const LIT = toneSolid(inkLevel(0));                  // paper-bright: light itself

  const X  = (x, z) => px(x, z) * W;
  const Y  = z => py(z) * H;
  const Cy = z => ceilY(z) * H;
  const SZ = z => 0.60 + 0.50 * clamp(z, 0.08, 1);
  const A  = n => { const p = plan.at(n); return { x:p.x*W, y:p.y*H, d:p.d, s:0.60+0.50*p.d }; };
  const R  = rnd(23177);                               // XXIII.177 — "carry it out"

  /* a rectangle of FLOOR in plan space, optionally lifted off it */
  const quad = (x0,x1,z0,z1,h0=0,h1=0) => () => {
    const Q = [[x0,z0,h0],[x1,z0,h0],[x1,z1,h1],[x0,z1,h1]];
    Q.forEach(([x,z,h],i)=>{ const XX=X(x,z), YY=Y(z)-h*SZ(z)*H;
      if(i===0) g.moveTo(XX,YY); else g.lineTo(XX,YY); });
    g.closePath();
  };
  /* wall / ceiling junction, sampled — y is non-linear in z, so it is a curve */
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
  /* a panel cut in a SIDE wall, between two depths, between two heights.
     hLow/hHigh are unit heights above the floor, so the panel skews with the
     wall exactly the way the floor does. */
  const wallPanel = (side, z0, z1, hLow, hHigh) => () => {
    g.moveTo(X(side,z0), Y(z0)-hHigh*SZ(z0)*H);
    g.lineTo(X(side,z1), Y(z1)-hHigh*SZ(z1)*H);
    g.lineTo(X(side,z1), Y(z1)-hLow *SZ(z1)*H);
    g.lineTo(X(side,z0), Y(z0)-hLow *SZ(z0)*H);
    g.closePath();
  };
  /* LIGHT is drawn as paper: a flat unoutlined pool. A contour would make it
     an object lying on the floor instead of an absence of ink. */
  const pool = (x0,x1,z0,z1,lev=0) => { g.beginPath(); quad(x0,x1,z0,z1)();
    g.fillStyle = fn(lev); g.fill(); };
  /* a BROKEN horizontal run: never a bar across the frame. spans are [u0,u1]
     fractions of x0..x1, with paper left in the gaps. */
  const brokenRun = (x0, x1, y, spans, alpha=0.24, lw=2) => {
    g.strokeStyle=INK; g.lineWidth=lw; g.globalAlpha=alpha;
    for(const [u0,u1] of spans){
      g.beginPath(); g.moveTo(lerp(x0,x1,u0), y); g.lineTo(lerp(x0,x1,u1), y); g.stroke();
    }
    g.globalAlpha=1;
  };

  /* ================= SHELL — ceiling, side walls, far wall, floor ========= */
  if (has("shell")){
    g.fillStyle = tn(2); g.fillRect(0,0,W,H);                        // side walls
    pen.paint(()=>{ g.moveTo(X(0,.08), Cy(.08)); g.lineTo(X(1,.08),Cy(.08));
      rail(1,ceilY,.08,1.0); rail(0,ceilY,1.0,.08); g.closePath(); }, S(3), 5);
    // the FAR WALL one level lighter than the side walls, so the room has a back
    pen.paint(()=>{ g.rect(X(0,.08), Cy(.08), X(1,.08)-X(0,.08), Y(.08)-Cy(.08)); }, S(1), 5);
    pen.paint(()=>{ g.moveTo(X(0,.08), Y(.08)); rail(0,py,.08,1.30);
      g.lineTo(X(1,1.30), Y(1.30)); rail(1,py,1.30,.08); g.closePath(); }, SF(1), 5);
    // side-wall courses: verticals at fixed depths, so the walls read as built
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.20;
    for(const sd of [0,1]) for(const z of [.18,.32,.50,.72,.98]){
      g.beginPath(); g.moveTo(X(sd,z), Y(z)); g.lineTo(X(sd,z), Math.max(0, Cy(z))); g.stroke(); }
    g.globalAlpha=1;
  }

  /* ================= ROOF — four rafters, two BROKEN tie beams ============ */
  if (has("roof")){
    const zEnd = 0.74;
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.42;
    for(let i=1;i<P.rafters;i++){ const xp=i/P.rafters;
      g.beginPath(); g.moveTo(X(xp,.08),Cy(.08)); g.lineTo(X(xp,zEnd),Cy(zEnd)); g.stroke(); }
    g.globalAlpha=1;
    // the tie beams are cut into three pieces so nothing stripes the frame
    for(const z of [.16,.34,.60]){
      const k=H*0.012*SZ(z);
      for(const [u0,u1] of [[0.02,0.30],[0.37,0.63],[0.70,0.98]]){
        pen.paint(()=>{ const xa=X(u0,z), xb=X(u1,z);
          g.moveTo(xa,Cy(z)); g.lineTo(xb,Cy(z)); g.lineTo(xb,Cy(z)+k); g.lineTo(xa,Cy(z)+k);
          g.closePath(); }, S(4), 3);
      }
    }
  }

  /* ================= FAR WALL — the close-set stones (XXIII.193) ===========
     Broken ashlar: short course spans with paper in the gaps, and staggered
     vertical joints. Homer's word for this wall is its tightness. */
  if (has("farwall")){
    const wx0=X(0,.08), wx1=X(1,.08), wy0=Cy(.08), wy1=Y(.08);
    const D = A("door_pair");
    const dw = (px(.5+P.doorHalf,.10) - px(.5-P.doorHalf,.10)) * W;
    const dL = (D.x-dw/2-wx0)/(wx1-wx0), dR = (D.x+dw/2-wx0)/(wx1-wx0);
    for(let j=1;j<=5;j++){
      const y = lerp(wy0, wy1, j/6);
      const spans = j%2
        ? [[0.03, dL*0.46],[dL*0.56, dL-0.02],[dR+0.02, 0.72],[0.79, 0.97]]
        : [[0.05, dL*0.62],[dL*0.72, dL-0.02],[dR+0.03, 0.66],[0.74, 0.95]];
      brokenRun(wx0, wx1, y, spans, .52, 2);
      // staggered joints between the courses — three sets, so no two courses
      // put a joint at the same x and the wall never grows a long vertical
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.44;
      const jU = [[0.09,0.24,0.79,0.93],[0.15,0.30,0.73,0.87],[0.06,0.20,0.83,0.96]][j%3];
      for(const u of jU){ const jx=lerp(wx0,wx1,u), y2=lerp(wy0,wy1,(j+1)/6);
        g.beginPath(); g.moveTo(jx,y); g.lineTo(jx,y2); g.stroke(); }
      g.globalAlpha=1;
    }
  }

  /* ================= THE DAWN GAUGE — high slot, left of the doors ========
     XXIII.241–246: Athena holds the long night at the Ocean stream and keeps
     golden-throned Dawn at her horses. The slot is where that is VISIBLE:
       none  a dark slot            (ordinary night, nothing coming)
       held  light risen one step and STOPPED under a heavy bar
       full  the bar gone, the slot full of paper-white morning
     The bar is the arrest itself. It is geometry, not a colour. */
  if (has("gauge")){
    const z0=.12, z1=.34, hLow=0.20, hHigh=0.31, rng=hHigh-hLow, zm=lerp(z0,z1,.5);
    pen.paint(wallPanel(1, z0-.030, z1+.030, hLow-0.028, hHigh+0.028), S(2), 5);  // the reveal
    pen.paint(wallPanel(1, z0, z1, hLow, hHigh), S(5), 4);            // the opening
    if (M.dawn!=="full"){
      // SHUTTERED. Two leaves, jointed like the doors — so the night wall stays a
      // light plane with a hard contour and never becomes a black stain.
      pen.paint(wallPanel(1, z0, zm, hLow, hHigh), S(3), 4);
      pen.paint(wallPanel(1, zm, z1, hLow, hHigh), S(3), 4);
      pen.ink(()=>{ g.moveTo(X(1,zm), Y(zm)-hLow*SZ(zm)*H);
                    g.lineTo(X(1,zm), Y(zm)-hHigh*SZ(zm)*H); }, 5);
      pen.paint(wallPanel(1, lerp(z0,zm,.55), lerp(z0,zm,.75), hLow+rng*0.44, hLow+rng*0.58), S(6), 2);
    }
    if (M.dawn==="held"){
      // dawn risen ONE STEP under the shutter and stopped there by a bar
      pen.paint(wallPanel(1, z0, z1, hLow, hLow+rng*0.16), LIT, 3);
      pen.paint(wallPanel(1, z0-.060, z1+.060, hLow-0.026, hLow-0.004), S(7), 4);   // THE STOP
      for(const zz of [z0-.048, z1+.048])                             // its two keeps
        pen.paint(wallPanel(1, zz-.024, zz+.024, hLow-0.044, hLow+rng*0.30), S(5), 3);
    }
    if (M.dawn==="full"){
      pen.paint(wallPanel(1, z0, z1, hLow, hHigh), LIT, 3);           // morning, the whole slot
      pen.ink(()=>{ g.moveTo(X(1,zm), Y(zm)-(hLow+rng*0.06)*SZ(zm)*H);
        g.lineTo(X(1,zm), Y(zm)-(hHigh-rng*0.06)*SZ(zm)*H); }, 3);    // the mullion
      pool(.84,1.00,.16,.60);                                         // the light let onto the floor
      pool(.34,.70,.88,1.12);                                         // and downstage, past the bed
    }
    // the sill under the slot, in two pieces so it does not stripe the wall
    for(const [a,b] of [[z0-.02,lerp(z0,z1,.42)],[lerp(z0,z1,.58),z1+.02]])
      pen.paint(wallPanel(1, a, b, hLow-0.038, hLow-0.020), S(5), 3);
  }

  /* ================= THE JOINTED DOORS (XXIII.194 — "close-fitting") ======= */
  if (has("doors")){
    const D = A("door_pair");
    const dw = (px(.5+P.doorHalf,.10) - px(.5-P.doorHalf,.10)) * W;
    const dh = P.doorHeight * D.s * H;
    const x0 = D.x - dw/2, yTop = D.y - dh;
    pen.paint(()=>{ g.rect(x0-W*0.024, yTop-H*0.026, dw+W*0.048, dh+H*0.026); }, S(4), 5); // jambs
    const openTone = M.doors==="shut" ? tn(5) : inkLevel(0);
    pen.paint(()=>{ g.rect(x0, yTop, dw, dh); }, toneSolid(openTone), 5);
    if (M.doors!=="open"){
      const leaves = M.doors==="ajar" ? [-1] : [-1,1];                // ajar: one leaf only
      for(const sgn of leaves){
        const lw2 = dw/2, lx = sgn<0 ? x0 : x0+dw-lw2;
        pen.paint(()=>{ g.rect(lx, yTop, lw2, dh); }, S(3), 4);
        pen.ink(()=>{ const jx=lx+lw2*0.5;                            // one plank seam per leaf
          g.moveTo(jx, yTop+dh*0.06); g.lineTo(jx, yTop+dh*0.94); }, 3);
        pen.paint(()=>{ g.arc(sgn<0 ? lx+lw2*0.80 : lx+lw2*0.20, yTop+dh*0.55, W*0.009, 0, 7); }, S(6), 3);
      }
      if (M.doors==="shut")                                           // the close-fitting joint
        pen.ink(()=>{ g.moveTo(D.x, yTop+dh*0.03); g.lineTo(D.x, D.y-dh*0.02); }, 6);
      if (M.doors==="ajar"){
        // the swung leaf, foreshortened inward toward the camera
        const hx = x0+dw, nx = hx + dw*0.46, nz = D.y + H*0.030;
        pen.paint(()=>{ g.moveTo(hx, yTop); g.lineTo(nx, yTop+dh*0.10);  // ajar, swung inward
          g.lineTo(nx, nz); g.lineTo(hx, D.y); g.closePath(); }, S(4), 5);
        pen.ink(()=>{ g.moveTo(lerp(hx,nx,.5), yTop+dh*0.06); g.lineTo(lerp(hx,nx,.5), lerp(D.y,nz,.5)); }, 3);
      }
    }
    if (M.bar){                                                       // barred from inside
      pen.paint(()=>{ g.rect(x0-W*0.030, yTop+dh*0.50, dw+W*0.060, H*0.024); }, S(6), 5);
      for(const sgn of [-1,1])
        pen.paint(()=>{ g.rect(D.x+sgn*(dw/2+W*0.020)-W*0.010, yTop+dh*0.44, W*0.020, H*0.048); }, S(5), 4);
    }
    if (M.dawn==="full" && M.doors!=="open"){                         // light under the leaf
      pen.paint(()=>{ g.rect(x0, D.y-H*0.008, dw*0.5, H*0.009); }, LIT, 2);
    }
  }

  /* ================= THE STEP inside the doors ============================ */
  if (has("threshold")){
    const s0 = plan.stations.threshold.z;
    pen.paint(quad(.50,.74, s0-.040, s0+.040, 0.024, 0.024), S(2), 5);
    pen.paint(()=>{ const z1=s0+.040, k=0.024*SZ(z1)*H;
      g.moveTo(X(.50,z1),Y(z1)-k); g.lineTo(X(.74,z1),Y(z1)-k);
      g.lineTo(X(.74,z1),Y(z1));   g.lineTo(X(.50,z1),Y(z1)); g.closePath(); }, S(5), 5);
  }

  /* ================= THE CLOTHING PEGS (left wall) ========================
     XXIII.366: at the dawn release he takes his clothes up off these pegs and
     dresses. In `dawn` the pegs are therefore BARE — the room records that he
     has gone out to the farm. */
  if (has("pegs")){
    const z0=.30, z1=.52, hU=0.235;
    const bx0=X(0,z0), by0=Y(z0), bx1=X(0,z1), by1=Y(z1);
    const t0=by0-hU*SZ(z0)*H, t1=by1-hU*SZ(z1)*H;
    pen.paint(()=>{ g.moveTo(bx0,by0); g.lineTo(bx1,by1); g.lineTo(bx1,t1); g.lineTo(bx0,t0); g.closePath(); }, S(2), 3);
    const rail0=lerp(t0,by0,0.10), rail1=lerp(t1,by1,0.10);           // the peg rail
    pen.paint(()=>{ g.moveTo(bx0,rail0); g.lineTo(bx1,rail1);
      g.lineTo(bx1,rail1+H*0.014); g.lineTo(bx0,rail0+H*0.014); g.closePath(); }, S(4), 3);
    for(let i=0;i<2;i++){
      const u=0.26+0.48*i, fx=lerp(bx0,bx1,u), fy=lerp(rail0,rail1,u);
      pen.ink(()=>{ g.moveTo(fx, fy+H*0.008); g.lineTo(fx+W*0.020, fy-H*0.004); }, 5);
      if (M.clothes){                                                 // two garments, hung
        // cloth on a peg: narrow at the shoulder, hanging STRAIGHT down, flat hem
        const top=fy+H*0.010, gh2=H*0.112, hw=W*0.042;
        pen.paint(()=>{ g.moveTo(fx-hw*0.16, top); g.lineTo(fx+hw*0.34, top+H*0.004);
          g.lineTo(fx+hw*0.52, top+gh2); g.lineTo(fx-hw*0.44, top+gh2*0.97); g.closePath(); },
          S(i?2:1), 4);
        for(const v of [0.30,0.62])                                   // two straight fold lines
          pen.ink(()=>{ g.moveTo(lerp(fx-hw*0.10, fx+hw*0.30, v), top+H*0.012);
            g.lineTo(lerp(fx-hw*0.34, fx+hw*0.44, v), top+gh2*0.93); }, 3);
        pen.ink(()=>{ g.moveTo(fx-hw*0.40, top+gh2*0.80); g.lineTo(fx+hw*0.48, top+gh2*0.84); }, 3);
      }
    }
  }

  /* ================= THE CHEST, far-left corner =========================== */
  if (has("chest")){
    const c = plan.stations.clothes_chest;
    planBox(c.x-0.075, c.x+0.075, c.z-0.055, c.z+0.055, 0.062, 2, 4);
    const zb=c.z+0.055, base=Y(zb), k=SZ(zb);
    const xl=X(c.x-0.075, zb), xr=X(c.x+0.075, zb);
    pen.ink(()=>{ g.moveTo(xl+W*0.006, base-0.062*k*H*0.42); g.lineTo(xr-W*0.006, base-0.062*k*H*0.42); }, 3);
    pen.paint(()=>{ g.rect((xl+xr)/2-W*0.008, base-0.062*k*H*0.52, W*0.016, H*0.016); }, S(6), 3); // the lock
    if (M.clothes){                                                    // folded cloth on the lid
      const ty = Y(c.z-0.030) - 0.062*SZ(c.z)*H;
      pen.paint(()=>{ g.rect((xl+xr)/2-W*0.044, ty-H*0.030, W*0.088, H*0.030); }, S(1), 4);
      pen.ink(()=>{ g.moveTo((xl+xr)/2-W*0.040, ty-H*0.015); g.lineTo((xl+xr)/2+W*0.040, ty-H*0.015); }, 2);
    }
  }

  /* ================= THE BED — frame, headboard, three plain posts ========
     Drawn BEFORE the trunk: the olive is its near-left corner and must overlap
     everything it carries. */
  if (has("bed")){
    const { bedX0:x0, bedX1:x1, bedZ0:z0, bedZ1:z1, bedHeight:bh } = P;
    // the two far posts (behind the frame)
    for(const xp of [x1]){
      const pxs=X(xp,z0), base=Y(z0), k=SZ(z0), pw=W*0.017*k;
      pen.paint(()=>{ g.rect(pxs-pw/2, base-(bh+P.headHeight)*k*H, pw, (bh+P.headHeight)*k*H); }, S(4), 4);
    }
    // HEADBOARD — a light panel with BROKEN inlay bands (gold, silver, ivory)
    const hk=SZ(z0), hbase=Y(z0)-bh*hk*H, hh=P.headHeight*hk*H;
    const hx0=X(x0,z0), hx1=X(x1,z0);
    pen.paint(()=>{ g.rect(hx0, hbase-hh, hx1-hx0, hh); }, S(2), 5);
    for(let i=0;i<P.inlays;i++){
      const y=hbase-hh*(0.30+0.22*i), lev=[5,3,1][i%3];
      for(const [u0,u1] of (i%2 ? [[0.08,0.34],[0.42,0.70],[0.78,0.95]] : [[0.05,0.28],[0.36,0.62],[0.70,0.92]]))
        pen.paint(()=>{ g.rect(lerp(hx0,hx1,u0), y, (u1-u0)*(hx1-hx0), hh*0.085); }, S(lev), 2);
    }
    // the frame: top face light (linen), near face darker (worked wood)
    pen.paint(quad(x0,x1,z0,z1,bh,bh), S(1), 5);
    pen.paint(()=>{ const xa=X(x0,z1), xb=X(x1,z1), yb=Y(z1), yt=yb-bh*SZ(z1)*H;
      g.moveTo(xa,yt); g.lineTo(xb,yt); g.lineTo(xb,yb); g.lineTo(xa,yb); g.closePath(); }, S(3), 5);
    // the rail groove, in three pieces
    const gy=Y(z1)-bh*SZ(z1)*H*0.45;
    brokenRun(X(x0,z1), X(x1,z1), gy, [[0.06,0.30],[0.38,0.64],[0.72,0.94]], .46, 3);
    // the ox-hide THONGS: the lattice the mattress lies on, visible when bare
    if (M.bedding==="bare"){
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.44;
      for(let i=1;i<P.thongs;i++){ const u=i/P.thongs;
        g.beginPath(); g.moveTo(X(lerp(x0,x1,u),z0), Y(z0)-bh*SZ(z0)*H);
        g.lineTo(X(lerp(x0,x1,u),z1), Y(z1)-bh*SZ(z1)*H); g.stroke(); }
      for(const z of [.54,.62,.70,.78]){
        g.beginPath(); g.moveTo(X(x0,z), Y(z)-bh*SZ(z)*H); g.lineTo(X(x1,z), Y(z)-bh*SZ(z)*H); g.stroke(); }
      g.globalAlpha=1;
    }
    // near-right foot post
    const fpx=X(x1,z1), fbase=Y(z1), fk=SZ(z1), fpw=W*0.021*fk;
    pen.paint(()=>{ g.rect(fpx-fpw/2, fbase-bh*fk*H-H*0.030, fpw, bh*fk*H+H*0.034); }, S(4), 4);
    pen.paint(()=>{ g.rect(fpx-fpw*0.80, fbase-bh*fk*H-H*0.046, fpw*1.6, H*0.018); }, S(5), 3);
  }

  /* ================= THE BEDDING ========================================== */
  if (has("bedding") && M.bedding!=="bare"){
    const { bedX0:x0, bedX1:x1, bedZ0:z0, bedZ1:z1, bedHeight:bh } = P;
    const slept = M.bedding==="slept";
    const lift = bh + 0.030;
    pen.paint(quad(x0+0.015, x1-0.015, z0+0.03, z1-0.02, lift, lift), S(1), 4);   // the coverlet
    // fold seams, running with the depth, offset when the bed has been slept in
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.40;
    for(let i=1;i<=4;i++){
      const u = i/5 + (slept ? (i%2 ? 0.035 : -0.030) : 0);
      const za = z0+0.05, zb = z1-0.04;
      g.beginPath();
      g.moveTo(X(lerp(x0,x1,u), za), Y(za)-lift*SZ(za)*H);
      g.lineTo(X(lerp(x0,x1,u)+(slept?0.03:0), zb), Y(zb)-lift*SZ(zb)*H);
      g.stroke();
    }
    g.globalAlpha=1;
    // the turned-back hem at the foot, in two pieces
    for(const [u0,u1] of [[0.06,0.44],[0.54,0.92]]){
      const zb=z1-0.05;
      pen.paint(()=>{ const xa=X(lerp(x0,x1,u0),zb), xb2=X(lerp(x0,x1,u1),zb), yy=Y(zb)-lift*SZ(zb)*H;
        g.moveTo(xa,yy); g.lineTo(xb2,yy); g.lineTo(xb2,yy+H*0.020); g.lineTo(xa,yy+H*0.020);
        g.closePath(); }, S(3), 3);
    }
    // two bolsters at the head; the left one dented once the night has happened
    for(const [i,u] of [[0,0.29],[1,0.71]]){
      const zp=z0+0.055, k=SZ(zp), cxp=X(lerp(x0,x1,u),zp), cyp=Y(zp)-lift*k*H;
      const bwp=W*0.056*k, bhp=H*0.026*k, dent=(slept&&i===0)?bhp*0.34:0;
      pen.paint(()=>{ g.moveTo(cxp-bwp, cyp-bhp*0.30);
        g.quadraticCurveTo(cxp-bwp*1.10, cyp-bhp, cxp-bwp*0.68, cyp-bhp);
        g.lineTo(cxp+bwp*0.68, cyp-bhp+dent);
        g.quadraticCurveTo(cxp+bwp*1.10, cyp-bhp+dent, cxp+bwp, cyp-bhp*0.30);
        g.quadraticCurveTo(cxp+bwp*0.92, cyp+bhp*0.42, cxp, cyp+bhp*0.42);
        g.quadraticCurveTo(cxp-bwp*0.92, cyp+bhp*0.42, cxp-bwp, cyp-bhp*0.30);
        g.closePath(); }, S(slept&&i===0?2:1), 4);
      pen.ink(()=>{ g.moveTo(cxp-bwp*0.62, cyp-bhp*0.06+dent*0.5);
        g.lineTo(cxp+bwp*0.62, cyp-bhp*0.10+dent*0.5); }, 3);
    }
  }

  /* ================= THE ROOTED OLIVE — the whole point ==================
     Base at station olive_post. The paving is cut open around the flare, five
     roots run out of it into the floor, the trunk is trimmed smooth, the bed
     rail is PEGGED into it, and the crown is lopped flat well below the roof.
     Nothing about this post can be lifted, so the bed cannot be carried out. */
  if (has("trunk")){
    const O = A("olive_post");
    const k = O.s, bw = W*P.postWidth*k, tw = W*(P.postWidth*0.78)*k;
    const top = O.y - P.postHeight*k*H;

    // 1. the paving CUT OPEN around the flare — close-set flags, lifted, gapped.
    //    Only on the far and lateral sides: the near side is left clear so the
    //    root flare itself is not read as more masonry.
    for(const a of [-2.55,-1.95,-1.35,-0.75,-0.20,0.42]){
      const rr = bw*1.40;
      const fx = O.x + Math.cos(a)*rr*1.30, fy = O.y + Math.sin(a)*rr*0.52;
      g.save(); g.translate(fx, fy); g.rotate(Math.sin(a)*0.20);
      pen.paint(()=>{ g.rect(-bw*0.36, -H*0.010, bw*0.72, H*0.019); }, SF(4), 3);
      g.restore();
    }
    // 2. the ROOTS — four, thick, short, running out of the cut into the ground
    const tips = [[.18,.79],[.13,.88],[.24,.96],[.42,.94]];
    for(let i=0;i<Math.min(P.roots,tips.length);i++){
      const t = plan.at({ x:tips[i][0], z:tips[i][1] });
      const txp=t.x*W, typ=t.y*H;
      const ang = Math.atan2(typ-O.y, txp-O.x), nx=-Math.sin(ang), ny=Math.cos(ang);
      const wRoot = bw*(0.62 - 0.07*i);
      pen.paint(()=>{
        g.moveTo(O.x+nx*wRoot, O.y+ny*wRoot);
        g.quadraticCurveTo(lerp(O.x,txp,.60)+nx*wRoot*0.78, lerp(O.y,typ,.60)+ny*wRoot*0.78, txp, typ);
        g.quadraticCurveTo(lerp(O.x,txp,.60)-nx*wRoot*0.78, lerp(O.y,typ,.60)-ny*wRoot*0.78,
                           O.x-nx*wRoot, O.y-ny*wRoot);
        g.closePath(); }, SF(3), 4);
    }
    // 3. the flare, then the trimmed shaft — thick as a pillar (XXIII.191)
    pen.paint(()=>{
      g.moveTo(O.x-bw*1.16, O.y+H*0.008);
      g.quadraticCurveTo(O.x-bw*0.82, O.y-H*0.026, O.x-bw*0.56, O.y-H*0.060);
      g.lineTo(O.x+bw*0.56, O.y-H*0.060);
      g.quadraticCurveTo(O.x+bw*0.82, O.y-H*0.026, O.x+bw*1.16, O.y+H*0.008);
      g.closePath(); }, S(4), 5);
    // The silhouette is CURVED and slightly uneven — a trimmed trunk, not a pipe.
    pen.paint(()=>{
      g.moveTo(O.x-bw*0.56, O.y-H*0.050);
      g.bezierCurveTo(O.x-bw*0.40, lerp(O.y,top,.34), O.x-tw*0.62, lerp(O.y,top,.66),
                      O.x-tw*0.46, top);
      g.lineTo(O.x+tw*0.50, top);
      g.bezierCurveTo(O.x+tw*0.40, lerp(O.y,top,.62), O.x+bw*0.44, lerp(O.y,top,.30),
                      O.x+bw*0.56, O.y-H*0.050);
      g.closePath(); }, S(3), 5);
    // bark seams — adzed smooth, so few and long
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.62;
    for(let i=0;i<3;i++){
      const u=(i+1)/4;
      g.beginPath();
      g.moveTo(lerp(O.x-bw*0.50, O.x+bw*0.50, u), O.y-H*0.056);
      g.bezierCurveTo(lerp(O.x-tw*0.44, O.x+tw*0.44, u)+(i-1)*W*0.009, lerp(O.y,top,.42),
                      lerp(O.x-tw*0.44, O.x+tw*0.44, u)-(i-1)*W*0.007, lerp(O.y,top,.74),
                      lerp(O.x-tw*0.40, O.x+tw*0.40, u), top+H*0.018);
      g.stroke();
    }
    g.globalAlpha=1;
    // two lopped branch scars up the shaft: proof it was a tree
    for(const [sgn,v,r] of [[-1,0.42,1.0],[1,0.72,0.78]]){
      const sx=O.x+sgn*tw*0.30, sy=lerp(O.y-H*0.06, top, v);
      pen.paint(()=>{ g.ellipse(sx, sy, W*0.015*r, H*0.012*r, sgn*0.38, 0, 7); }, S(5), 3);
      pen.ink(()=>{ g.moveTo(sx-W*0.008*r, sy+H*0.002); g.lineTo(sx+W*0.008*r, sy-H*0.002); }, 2);
    }
    // 4. THE JOINT — the bed rail pegged into living wood, at frame height
    const jy = O.y - P.bedHeight*k*H*0.62;
    pen.paint(()=>{ g.rect(O.x+tw*0.30, jy-H*0.030, W*0.052, H*0.034); }, S(5), 4);
    for(const dx of [W*0.013, W*0.037])
      pen.paint(()=>{ g.arc(O.x+tw*0.30+dx, jy-H*0.013, W*0.006, 0, 7); }, S(7), 2);
    // 5. THE LOPPED CROWN — cut flat, pale new wood, ringed hard
    pen.paint(()=>{ g.ellipse(O.x, top, tw*0.52, H*0.015, 0, 0, 7); }, S(1), 5);
    for(const [u,v] of [[-0.34,0.30],[0.02,-0.34],[0.36,0.22]])       // adze marks on the cut
      pen.ink(()=>{ g.moveTo(O.x+tw*u, top+H*0.011*v); g.lineTo(O.x+tw*(u+0.16), top-H*0.011*v); }, 3);
  }

  /* ================= THE LAMP — Eurynome's torch in its stand ============= */
  if (has("lamp") && M.lamp!=="none"){
    const L = A("lamp_stand"), k=L.s;
    const sh = 0.240*k*H, cw = W*0.016*k;
    for(const sgn of [-1,0,1])                                        // tripod feet
      pen.ink(()=>{ g.moveTo(L.x, L.y-H*0.016); g.lineTo(L.x+sgn*W*0.026*k, L.y+H*0.004); }, 4);
    pen.paint(()=>{ g.rect(L.x-cw/2, L.y-sh, cw, sh); }, S(4), 4);     // the column
    for(const u of [0.34,0.66])                                       // two collars
      pen.paint(()=>{ g.rect(L.x-cw*1.05, L.y-sh*u, cw*2.1, H*0.012); }, S(5), 3);
    const by = L.y-sh;
    pen.paint(()=>{ g.moveTo(L.x-W*0.040*k, by-H*0.026); g.lineTo(L.x+W*0.040*k, by-H*0.026);
      g.lineTo(L.x+W*0.024*k, by); g.lineTo(L.x-W*0.024*k, by); g.closePath(); }, S(5), 4); // the bowl
    const n = M.lamp==="high" ? 3 : M.lamp==="low" ? 2 : 1;
    const tall = M.lamp==="high" ? 0.072 : M.lamp==="low" ? 0.040 : 0.020;
    for(let i=0;i<n;i++){
      const u=(i+0.5)/n, fx=L.x+(u-0.5)*W*0.048*k;
      const fh=H*tall*(0.62+0.55*Math.abs(Math.sin(i*2.3+T*2.1)));
      g.fillStyle=tn(7); g.beginPath();
      g.moveTo(fx-W*0.009*k, by-H*0.026); g.lineTo(fx+(i%2?W*0.004:-W*0.004), by-H*0.026-fh);
      g.lineTo(fx+W*0.009*k, by-H*0.026); g.closePath(); g.fill();
    }
    if (M.lamp==="guttering"){                                        // one thread of smoke
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.30;
      g.beginPath(); g.moveTo(L.x, by-H*0.046);
      g.bezierCurveTo(L.x+W*0.030, by-H*0.100, L.x-W*0.024, by-H*0.150, L.x+W*0.010, by-H*0.205);
      g.stroke(); g.globalAlpha=1;
    }
  }

  /* ================= THE LAMPLIGHT ON THE FLOOR ==========================
     Light is drawn as PAPER, hard-edged: a flat pool, not a gradient. */
  if (has("light") && (M.lamp==="high" || M.lamp==="low")){
    const r = M.lamp==="high" ? 1.0 : 0.62;
    pool(.80, 1.00, .70-0.20*r, .70+0.24*r);
  }
}

/* ---- anchors are DERIVED from the plan, never authored ------------------- */
const ANCHORS = {};
for (const n of plan.names()){
  const p = plan.at(n);
  ANCHORS[n] = { x:+p.x.toFixed(4), y:+p.y.toFixed(4) };
}
ANCHORS["entrance:doors"] = ANCHORS.door_pair;
ANCHORS["exit:doors"]     = ANCHORS.threshold;
ANCHORS["contact:bed-l"]  = ANCHORS.bed_l;
ANCHORS["contact:bed-r"]  = ANCHORS.bed_r;
ANCHORS["camera:wide"]    = { x:.50, y:.50 };
ANCHORS["camera:bed"]     = { x:.52, y:.66 };
ANCHORS["camera:post"]    = { x:.34, y:.70 };
ANCHORS["camera:doors"]   = { x:.56, y:.52 };

const node = state => ({ preview:{ state, t:0.45, status:MODES[state].status } });

export const asset = {
  id:"location.marriage-chamber",
  type:"LOCATION",
  name:"Marriage Chamber",
  statusWord:"ROOTED",
  scene:"OD-B23-S05",
  plan:"thalamos",

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  zones:{
    walkable:      { x0:.10, y0:.55, x1:.90, y1:.99 },
    bed:           { x0:.30, y0:.62, x1:.75, y1:.90 },
    "bed:left":    { x0:.24, y0:.70, x1:.34, y1:.90 },
    "bed:right":   { x0:.70, y0:.70, x1:.82, y1:.90 },
    "threshold":   { x0:.50, y0:.55, x1:.62, y1:.62 },
    "post:rooted": { x0:.26, y0:.64, x1:.40, y1:.92 },
    "corner:chest":{ x0:.18, y0:.58, x1:.34, y1:.66 },
    downstage:     { x0:.30, y0:.90, x1:.78, y1:.99 },
  },
  occlusion:[
    { layer:"bg",  of:["shell","roof","farwall","gauge","doors"] },
    { layer:"mid", of:["threshold","pegs","chest","bed","bedding"] },
    { layer:"fg",  of:["trunk","lamp"], note:"the olive post occludes the bed it carries" },
  ],

  /* ONE room, one channel. `night-held` and `dawn` are STATES of this chamber,
     never separate locations. */
  states:{
    initial:"closed",
    nodes:{
      unused:       node("unused"),
      lamplit:      node("lamplit"),
      closed:       node("closed"),
      "night-held": node("night-held"),
      dawn:         node("dawn"),
    },
    edges:[["unused","lamplit"],["lamplit","closed"],["closed","night-held"],
           ["night-held","dawn"],["dawn","lamplit"],["dawn","unused"]],
  },
  channels:["state","dawn","lamp","bedding","reveal","camera","t"],

  preview:()=>({ state:"closed", t:0.45, status:"ROOTED", progress:.24 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones }; },
};
export default asset;
