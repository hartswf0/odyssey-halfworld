/* location.megaron-hall — THE GREAT HALL OF ODYSSEUS. One room, seven states.
   ADDITIVE, Books XVI–XXIV. Modifies nothing; shadows nothing.

   WHY THIS FILE EXISTS. Books XVI, XVII, XVIII, XX, XXI, XXII and XXIII all
   play in this room. The atlas would otherwise fragment it into five
   look-alike locations (night-palace-hall / festival-ready-hall /
   aftermath-hall / cleaned-palace-hall / palace-night-interior) and they would
   drift into five different rooms — fatal in XXI–XXII, where the two doors,
   the sill and the line of twelve axes are PLOT, sustained across dozens of
   shots. So: ONE room, one file, and a STATE channel — exactly the way
   assets/character/odysseus-b16.mjs reconciles six drifted bodies with `guise`.

   THE ROOM IS NOT HAND-DRAWN. Every fixture is placed by projecting a station
   of scenes/_plans/megaron.mjs through engine/blocking.mjs `project()`. A
   figure blocked at `threshold` therefore stands ON the sill painted here, and
   plan.ray("shot_mark","door_main",u) runs straight down the lane painted
   here, through all twelve helve-rings. There are no parallel numbers.

   STATES (state.state, default "day") — each changes what is DRAWN:
     day       ordinary hall, arms on the walls, low fire, benches in order
     feast     tables laden, benches shoved about, high fire, litter (XVI–XVIII)
     night     banked embers, shutters closed, arms GONE from the walls (XX)
     contest   fire raked flat, floor cleared, twelve axe helves in the spine (XXI)
     battle    doors barred, tables overturned, arrows in floor and pillar (XXII)
     aftermath bodies cleared, blood, ash, wreck heaped in the corner (XXII end)
     cleaned   scoured, sulphur brazier smoking, order restored (XXIII)

   SOLID tone + hard contour only; the engine dotify pass supplies the halftone.
   NO characters baked in.
   Verify: node harness/render.mjs assets/location/megaron-hall.mjs --state contest */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";
import { project } from "../../engine/blocking.mjs";
import megaron from "../../scenes/_plans/megaron.mjs";

/* ---- the projection, unclamped ------------------------------------------
   project() (blocking.mjs) clamps z to [0.08,1] because a FIGURE never stands
   outside the room. The room SHELL has to run past the near clip and up to the
   roof, so it uses the identical formula un-clamped. Same law, wider domain:
     x = 0.5 + (x-0.5)(0.42 + 0.58 z)      y = 0.50 + 0.46 z^1.08      README §5
   Every station still goes through project() itself, via A(). */
const SPREAD = z => 0.42 + 0.58 * z;
const px = (x, z) => 0.5 + (x - 0.5) * SPREAD(z);
const py = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const HORIZON = 0.50;                       // the z→0 asymptote: floor meets wall

const AXE_FIX = megaron.fixtures.find(f => f.id === "axe_line") || { count: 12 };

const params = {
  plan:"megaron",
  roofRise:0.30,     // ceiling height above the horizon at the far wall
  roofRake:0.26,     // how fast the ceiling climbs toward the camera
  axes:AXE_FIX.count || 12,
  laneHalf:0.085,    // half-width of the spine lane, in PLAN x
  rafters:6, stairSteps:7, spears:5, clerestory:5,
  doorHalf:0.15,     // half-width of the great doors, in PLAN x
  doorHeight:0.32,   // in unit height (README §5: h = H·s·(0.60+0.50d))
};
const ceilY = z => HORIZON - (params.roofRise + params.roofRake * Math.pow(z, 1.08));

/* ---- the state channel ---------------------------------------------------
   `lift` is a single lighting offset over the whole room; everything else in
   the row changes what geometry is built. */
const MODES = {
  day:      { lift:0, status:"THE HALL",  doors:"ajar", fire:"low",    sky:"bright", arms:true,  furniture:"order",   litter:"none",   axes:false, bar:false, stool:true  },
  feast:    { lift:0, status:"MISRULE",   doors:"open", fire:"high",   sky:"bright", arms:true,  furniture:"feast",   litter:"feast",  axes:false, bar:false, stool:true  },
  night:    { lift:1, status:"BANKED",    doors:"shut", fire:"banked", sky:"dark",   arms:false, furniture:"stacked", litter:"none",   axes:false, bar:false, stool:true, floorLift:1 },
  contest:  { lift:0, status:"STRUNG",    doors:"shut", fire:"raked",  sky:"bright", arms:false, furniture:"cleared", litter:"none",   axes:true,  bar:false, stool:false },
  battle:   { lift:1, status:"SLAUGHTER", doors:"shut", fire:"kicked", sky:"bright", arms:false, furniture:"wrecked", litter:"battle", axes:true,  bar:true,  stool:false },
  aftermath:{ lift:1, status:"REEKING",   doors:"shut", fire:"dead",   sky:"haze",   arms:false, furniture:"piled",   litter:"blood",  axes:true,  bar:true,  stool:false },
  cleaned:  { lift:0, status:"SCOURED",   doors:"open", fire:"fresh",  sky:"bright", arms:false, furniture:"order",   litter:"none",   axes:false, bar:false, stool:true, sulphur:true, floorLift:-1 },
};

const LAYERS = ["shell","roof","farwall","doors","sill","racks","postern","maidsdoor",
                "stair","pillars","lane","hearth","furniture","axes","litter","throne"];

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "day";
  const M    = MODES[mode];
  const T    = (st && st.t) || 0;
  const layers = (st && st.layers) || LAYERS;
  const has = l => layers.includes(l);

  const tn = l => inkLevel(clamp(Math.round(l + M.lift), 0, 7));
  const fn = l => inkLevel(clamp(Math.round(l + M.lift + (M.floorLift || 0)), 0, 7));
  const S  = l => toneSolid(tn(l));
  const SF = l => toneSolid(fn(l));

  const X  = (x, z) => px(x, z) * W;
  const Y  = z => py(z) * H;
  const Cy = z => ceilY(z) * H;
  const SZ = z => 0.60 + 0.50 * clamp(z, 0.08, 1);         // apparent size factor
  /* the ONLY way a station becomes pixels */
  const A  = n => { const p = megaron.at(n); return { x:p.x*W, y:p.y*H, d:p.d, s:0.60+0.50*p.d }; };
  const R  = rnd(20941);

  /* a rectangle of FLOOR in plan space, optionally lifted off it */
  const quad = (x0,x1,z0,z1,h0=0,h1=0) => () => {
    const P = [[x0,z0,h0],[x1,z0,h0],[x1,z1,h1],[x0,z1,h1]];
    P.forEach(([x,z,h],i)=>{ const XX=X(x,z), YY=Y(z)-h*SZ(z)*H;
      if(i===0) g.moveTo(XX,YY); else g.lineTo(XX,YY); });
    g.closePath();
  };
  /* wall / ceiling junction, sampled — y is non-linear in z so it is a curve */
  const rail = (xPlan, yf, z0, z1, n=22) => {
    for(let i=0;i<=n;i++){ const z=lerp(z0,z1,i/n); g.lineTo(X(xPlan,z), yf(z)*H); }
  };
  /* a box standing on the floor: top face + near face. z1 is the NEAR edge. */
  const planBox = (x0,x1,z0,z1,h,topL,frontL,lw=4) => {
    pen.paint(quad(x0,x1,z0,z1,h,h), S(topL), lw);
    pen.paint(()=>{ const xa=X(x0,z1), xb=X(x1,z1), yb=Y(z1), yt=yb-h*SZ(z1)*H;
      g.moveTo(xa,yt); g.lineTo(xb,yt); g.lineTo(xb,yb); g.lineTo(xa,yb); g.closePath(); },
      S(frontL), lw);
  };
  /* a door / opening cut in a SIDE wall, between two depths */
  const wallDoor = (xPlan, z0, z1, hUnit, innerL, frameL) => {
    const path = () => {
      g.moveTo(X(xPlan,z0), Y(z0));
      g.lineTo(X(xPlan,z1), Y(z1));
      g.lineTo(X(xPlan,z1), Y(z1)-hUnit*SZ(z1)*H);
      g.lineTo(X(xPlan,z0), Y(z0)-hUnit*SZ(z0)*H);
      g.closePath();
    };
    pen.paint(path, S(innerL), 5);
    // jamb posts + lintel, so the opening reads as built and not as a stain
    pen.ink(()=>{ g.moveTo(X(xPlan,z0),Y(z0)); g.lineTo(X(xPlan,z0),Y(z0)-hUnit*SZ(z0)*H); }, 5);
    pen.ink(()=>{ g.moveTo(X(xPlan,z1),Y(z1)); g.lineTo(X(xPlan,z1),Y(z1)-hUnit*SZ(z1)*H); }, 5);
    pen.paint(()=>{ const t0=Y(z0)-hUnit*SZ(z0)*H, t1=Y(z1)-hUnit*SZ(z1)*H, k=H*0.022;
      g.moveTo(X(xPlan,z0), t0-k); g.lineTo(X(xPlan,z1), t1-k);
      g.lineTo(X(xPlan,z1), t1);   g.lineTo(X(xPlan,z0), t0); g.closePath(); }, S(frameL), 4);
  };

  /* ================= SHELL — ceiling, side walls, far wall, floor ========= */
  if (has("shell")){
    g.fillStyle = tn(3); g.fillRect(0,0,W,H);                       // side walls
    // ceiling plane (the two side wedges are what is left of the fill above)
    pen.paint(()=>{ g.moveTo(X(0,.08), Cy(.08)); g.lineTo(X(1,.08),Cy(.08));
      rail(1,ceilY,.08,1.0); rail(0,ceilY,1.0,.08); g.closePath(); }, S(4), 5);
    // FAR WALL — the plane the great doors are cut into
    pen.paint(()=>{ g.rect(X(0,.08), Cy(.08), X(1,.08)-X(0,.08), Y(.08)-Cy(.08)); }, S(2), 5);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.22;            // stone courses
    for(let j=1;j<=5;j++){ const y=lerp(Cy(.08),Y(.08),j/6);
      g.beginPath(); g.moveTo(X(0,.08),y); g.lineTo(X(1,.08),y); g.stroke(); }
    g.globalAlpha=1;
    // FLOOR — sampled junctions, so wall and floor meet exactly on the law
    pen.paint(()=>{ g.moveTo(X(0,.08), Y(.08)); rail(0,py,.08,1.28);
      g.lineTo(X(1,1.28), Y(1.28)); rail(1,py,1.28,.08); g.closePath(); }, SF(2), 5);
    // side-wall ashlar: verticals along each wall at fixed depths
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.20;
    for(const sd of [0,1]) for(const z of [.16,.28,.44,.64,.88]){
      g.beginPath(); g.moveTo(X(sd,z), Y(z)); g.lineTo(X(sd,z), Math.max(0, Cy(z))); g.stroke(); }
    g.globalAlpha=1;
  }

  /* ================= ROOF — rafters, transverse beams, smoke louver ======= */
  if (has("roof")){
    const zEnd = 0.78;                                   // where the roof leaves frame
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.34;
    for(let i=1;i<params.rafters;i++){ const xp=i/params.rafters;
      g.beginPath(); g.moveTo(X(xp,.08),Cy(.08)); g.lineTo(X(xp,zEnd),Cy(zEnd)); g.stroke(); }
    g.globalAlpha=1;
    for(const z of [.14,.30,.52,.74]){                   // transverse roof beams
      pen.paint(()=>{ const k=H*0.020*SZ(z);
        g.moveTo(X(0,z),Cy(z)); g.lineTo(X(1,z),Cy(z));
        g.lineTo(X(1,z),Cy(z)+k); g.lineTo(X(0,z),Cy(z)+k); g.closePath(); }, S(6), 3);
    }
    // the smoke louver, directly over the hearth
    const hz = megaron.stations.hearth.z;
    pen.paint(()=>{ const z0=hz-.08, z1=hz+.08;
      g.moveTo(X(.42,z0),Cy(z0)); g.lineTo(X(.58,z0),Cy(z0));
      g.lineTo(X(.58,z1),Cy(z1)); g.lineTo(X(.42,z1),Cy(z1)); g.closePath(); },
      toneSolid(M.sky==="dark" ? tn(6) : M.sky==="haze" ? tn(3) : inkLevel(1)), 5);
  }

  /* ================= FAR WALL fittings + THE GREAT DOORS ================== */
  if (has("farwall")){
    // clerestory slots under the roof — shuttered at night, hazed after XXII
    const cl = M.sky==="dark" ? 6 : M.sky==="haze" ? 3 : 1;
    for(let i=0;i<params.clerestory;i++){
      const u=(i+0.5)/params.clerestory, xw=X(0,.08), ww=X(1,.08)-xw;
      pen.paint(()=>{ g.rect(xw+ww*(u-0.07), Cy(.08)+H*0.048, ww*0.10, H*0.046); },
        toneSolid(M.sky==="dark"?tn(6):M.sky==="haze"?tn(3):inkLevel(cl)), 4);
    }
  }
  if (has("doors")){
    const D = A("door_main");
    const dw = (px(.5+params.doorHalf,.10) - px(.5-params.doorHalf,.10)) * W;
    const dh = params.doorHeight * D.s * H;
    const x0 = D.x - dw/2, yTop = D.y - dh;
    // the deep jambs + lintel of the great doorway
    pen.paint(()=>{ g.rect(x0-W*0.026, yTop-H*0.030, dw+W*0.052, dh+H*0.030); }, S(5), 5);
    // the opening itself
    const openTone = M.doors==="open" ? inkLevel(1) : M.doors==="ajar" ? tn(3) : tn(4);
    pen.paint(()=>{ g.rect(x0, yTop, dw, dh); }, toneSolid(openTone), 5);
    if (M.doors!=="open"){                              // two leaves, shut or ajar
      const ajar = M.doors==="ajar" ? 0.42 : 1.0;       // fraction of each leaf closed
      for(const sgn of [-1,1]){
        const lw2 = (dw/2)*ajar;
        const lx = sgn<0 ? x0 : x0+dw-lw2;
        pen.paint(()=>{ g.rect(lx, yTop, lw2, dh); }, S(5), 4);
        g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.5;
        for(let j=1;j<=3;j++){ const yy=yTop+dh*(j/4);
          g.beginPath(); g.moveTo(lx,yy); g.lineTo(lx+lw2,yy); g.stroke(); }
        g.globalAlpha=1;
        pen.paint(()=>{ g.arc(sgn<0? lx+lw2*0.80 : lx+lw2*0.20, yTop+dh*0.56, W*0.008,0,7); }, S(7), 2);
      }
    }
    if (M.bar){                                          // XXII: the doors barred
      pen.paint(()=>{ g.rect(x0-W*0.034, yTop+dh*0.46, dw+W*0.068, H*0.026); }, S(7), 5);
      pen.paint(()=>{ g.rect(x0-W*0.040, yTop+dh*0.40, W*0.022, H*0.052); }, S(6), 4);
      pen.paint(()=>{ g.rect(x0+dw+W*0.018, yTop+dh*0.40, W*0.022, H*0.052); }, S(6), 4);
    }
  }

  /* ================= THE SILL — XXI.420, he shoots from here ============== */
  if (has("sill")){
    const s0 = megaron.stations.threshold.z;
    pen.paint(quad(.34,.66, s0-.045, s0+.045, 0.030, 0.030), S(5), 5);   // slab top
    pen.paint(()=>{ const z1=s0+.045, k=0.030*SZ(z1)*H;
      g.moveTo(X(.34,z1),Y(z1)-k); g.lineTo(X(.66,z1),Y(z1)-k);
      g.lineTo(X(.66,z1),Y(z1));   g.lineTo(X(.34,z1),Y(z1)); g.closePath(); }, S(6), 5);
    pen.ink(()=>{ g.moveTo(X(.34,s0),Y(s0)-0.030*SZ(s0)*H); g.lineTo(X(.66,s0),Y(s0)-0.030*SZ(s0)*H); }, 3);
  }

  /* ================= WALL ARMS — full to XVIII, GONE from XX on =========== */
  if (has("racks")){
    for(const sgn of [-1,1]){
      const cxr = X(0.5 + sgn*0.30, .08), bw = W*0.055, by = Y(.08), top = by - H*0.20;
      pen.paint(()=>{ g.rect(cxr-bw/2, top, bw, by-top); }, S(2), 4);        // backing board
      pen.paint(()=>{ g.rect(cxr-bw*0.62, top+H*0.010, bw*1.24, H*0.016); }, S(5), 3); // upper peg rail
      pen.paint(()=>{ g.rect(cxr-bw*0.62, by-H*0.030, bw*1.24, H*0.020); }, S(5), 3);  // lower rail
      if (M.arms){
        for(let i=0;i<params.spears;i++){
          const u = params.spears>1 ? i/(params.spears-1) : .5;
          const bx = cxr + (u-0.5)*bw*0.86, tx = cxr + (u-0.5)*bw*0.42;
          pen.ink(()=>{ g.moveTo(bx, by-H*0.012); g.lineTo(tx, top-H*0.052); }, 3);
          g.fillStyle = tn(7); g.beginPath();
          g.moveTo(tx, top-H*0.086); g.lineTo(tx-W*0.008, top-H*0.046);
          g.lineTo(tx+W*0.008, top-H*0.046); g.closePath(); g.fill();
        }
        pen.paint(()=>{ g.arc(cxr, top-H*0.032, W*0.030, 0, 7); }, S(4), 5);  // hung shield
        pen.paint(()=>{ g.arc(cxr, top-H*0.032, W*0.011, 0, 7); }, S(6), 3);  // boss
      } else {
        for(let i=0;i<params.spears;i++){                                     // the bare pegs
          const u = i/(params.spears-1), bx = cxr + (u-0.5)*bw*0.86;
          pen.ink(()=>{ g.moveTo(bx, top+H*0.010); g.lineTo(bx, top-H*0.014); }, 4);
        }
      }
    }
  }

  /* ================= POSTERN + STOREROOM PASSAGE (left wall) ==============
     Melanthius' route in XXII. The two stations sit inside one opening:
     postern (.06,.24) is the standing spot a step inside it; storeroom
     (.02,.30) is through it. */
  if (has("postern")){
    wallDoor(0, .17, .35, 0.28, M.bar || mode==="battle" ? 6 : 5, 6);
    // the passage beyond — a darker throat with two steps down to the arms
    pen.paint(()=>{ const z0=.235,z1=.315, h=0.20;
      g.moveTo(X(0,z0),Y(z0)); g.lineTo(X(0,z1),Y(z1));
      g.lineTo(X(0,z1),Y(z1)-h*SZ(z1)*H); g.lineTo(X(0,z0),Y(z0)-h*SZ(z0)*H); g.closePath(); },
      S(mode==="battle" ? 3 : 7), 4);
    const stR = A("storeroom");
    pen.ink(()=>{ g.moveTo(stR.x-W*0.020, stR.y-H*0.010); g.lineTo(stR.x+W*0.014, stR.y-H*0.010); }, 3);
    pen.ink(()=>{ g.moveTo(stR.x-W*0.020, stR.y+H*0.006); g.lineTo(stR.x+W*0.014, stR.y+H*0.006); }, 3);
  }

  /* ================= THE MAIDS' DOORWAY (right wall) ====================== */
  if (has("maidsdoor")){
    wallDoor(1, .32, .50, 0.26, 6, 6);
  }

  /* ================= THE STAIR to Penelope's chamber ====================== */
  if (has("stair")){
    const f = A("stair_up"), n = params.stairSteps;
    const tw = W*0.072, rise = H*0.028, run = W*0.011;
    for(let i=0;i<n;i++){
      const sx = f.x + run*i, sy = f.y - rise*i;
      pen.paint(()=>{ g.rect(sx, sy-rise, tw, rise*0.92); }, S(3+(i%2)), 3);
    }
    pen.paint(()=>{ g.moveTo(f.x, f.y); g.lineTo(f.x+run*n, f.y-rise*n);
      g.lineTo(f.x+run*n+W*0.020, f.y-rise*n); g.lineTo(f.x+W*0.020, f.y); g.closePath(); }, S(5), 4);
    pen.paint(()=>{ g.rect(f.x+run*n, f.y-rise*n-H*0.115, W*0.070, H*0.118); }, S(6), 4);  // upper door
  }

  /* ================= THE TWO PILLARS ====================================== */
  if (has("pillars")){
    for(const nm of ["pillar_l","pillar_r"]){
      const p = A(nm), z = megaron.stations[nm].z;
      const half = 0.05 * SPREAD(z) * W, top = Math.max(H*0.052, Cy(z));
      pen.paint(()=>{ g.rect(p.x-half, top, half*2, p.y-top); }, S(4), 5);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.42;
      for(const q of [-0.45,0.45]){ g.beginPath(); g.moveTo(p.x+half*q, top); g.lineTo(p.x+half*q, p.y); g.stroke(); }
      g.globalAlpha=1;
      pen.paint(()=>{ g.rect(p.x-half*1.55, top, half*3.1, H*0.030); }, S(6), 4);            // capital
      pen.paint(()=>{ g.rect(p.x-half*1.35, p.y-H*0.026, half*2.7, H*0.028); }, S(5), 4);    // base
    }
    // the roof beam the two pillars carry
    const l=A("pillar_l"), r=A("pillar_r"), z=megaron.stations.pillar_l.z;
    const bt = Math.max(H*0.052, Cy(z));
    pen.paint(()=>{ g.rect(l.x-W*0.10, bt-H*0.030, (r.x-l.x)+W*0.20, H*0.032); }, S(6), 4);
  }

  /* ================= THE SPINE — dressed lane, door to throne =============
     Always drawn. This is the ground the twelve axes stand in and the ground
     plan.ray("shot_mark","door_main",u) travels. */
  if (has("lane")){
    const lh = params.laneHalf;
    pen.paint(quad(.5-lh, .5+lh, .10, 1.28), SF(3), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.30;             // flagstone courses
    for(const z of [.16,.26,.38,.52,.68,.86,1.06]){
      g.beginPath(); g.moveTo(X(0,z),Y(z)); g.lineTo(X(1,z),Y(z)); g.stroke(); }
    for(const xp of [.14,.30,.70,.86]){
      g.beginPath(); g.moveTo(X(xp,.09),Y(.09)); g.lineTo(X(xp,1.28),Y(1.28)); g.stroke(); }
    g.globalAlpha=1;
    if (M.axes){                                                     // XXI: the trench
      pen.paint(quad(.455,.545,.24,.78), S(6), 4);
      pen.paint(quad(.545,.605,.24,.78), S(4), 3);                   // heaped spoil
    }
  }

  /* ================= THE HEARTH at centre ================================ */
  if (has("hearth")){
    const h = A("hearth"), hz = megaron.stations.hearth.z;
    const rx = 0.105 * SPREAD(hz) * W;
    const yFar = Y(hz-.075), yNear = Y(hz+.075), ry = (yNear-yFar)/2, cy = (yNear+yFar)/2;
    const flat = (M.fire==="raked" || M.fire==="kicked" || M.fire==="dead");
    // the stone ring — raised when the hall is a hall, raked flush for the contest
    pen.paint(()=>{ g.ellipse(h.x, cy, rx, ry, 0, 0, 7); }, S(flat ? 3 : 5), 5);
    pen.paint(()=>{ g.ellipse(h.x, cy, rx*0.70, ry*0.70, 0, 0, 7); }, S(flat ? 2 : 6), 4);
    if (!flat){                                                       // the raised kerb
      pen.paint(()=>{ g.moveTo(h.x-rx, cy); g.lineTo(h.x-rx, cy-H*0.020);
        g.lineTo(h.x+rx, cy-H*0.020); g.lineTo(h.x+rx, cy); g.closePath(); }, S(5), 4);
    }
    if (M.fire==="high" || M.fire==="low" || M.fire==="fresh"){
      const n = M.fire==="high" ? 7 : M.fire==="fresh" ? 5 : 4;
      const tall = M.fire==="high" ? 0.135 : M.fire==="fresh" ? 0.085 : 0.055;
      for(let i=0;i<n;i++){
        const u=(i+0.5)/n, fx0=h.x+(u-0.5)*rx*1.30;
        const fh=H*tall*(0.55+0.65*Math.abs(Math.sin(i*2.1+T*1.7)));
        g.fillStyle=tn(7); g.beginPath();
        g.moveTo(fx0-rx*0.14, cy); g.lineTo(fx0+(i%2?rx*0.06:-rx*0.06), cy-fh);
        g.lineTo(fx0+rx*0.14, cy); g.closePath(); g.fill();
      }
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.30;            // smoke to the louver
      for(let i=0;i<3;i++){ g.beginPath();
        g.moveTo(h.x+(i-1)*rx*0.42, cy-H*tall);
        g.bezierCurveTo(h.x+(i-1)*rx*0.9, cy-H*(tall+0.14),
                        h.x-(i-1)*rx*0.5, cy-H*(tall+0.24), h.x, Cy(hz)+H*0.03); g.stroke(); }
      g.globalAlpha=1;
      for(const sgn of [-1,1]) pen.paint(()=>{                        // firedogs
        g.rect(h.x+sgn*rx*0.72-W*0.008, cy-H*0.030, W*0.016, H*0.034); }, S(6), 3);
    }
    if (M.fire==="banked"){                                           // XX: raked over, alive under
      pen.paint(()=>{ g.ellipse(h.x, cy, rx*0.52, ry*0.60, 0, 0, 7); }, S(4), 4);
      for(let i=0;i<5;i++){ const a=i*1.257;
        pen.paint(()=>{ g.arc(h.x+Math.cos(a)*rx*0.34, cy+Math.sin(a)*ry*0.34, W*0.007, 0, 7); }, S(7), 2); }
    }
    if (M.fire==="kicked" || M.fire==="dead"){
      for(let i=0;i<11;i++){ const a=R()*6.28, rr=0.7+R()*1.8;
        const ex=h.x+Math.cos(a)*rx*rr, ey=cy+Math.sin(a)*ry*rr, er=W*0.006+W*0.006*R();
        pen.paint(()=>{ g.arc(ex, ey, er, 0, 7); }, S(M.fire==="kicked"?7:4), 2); }
    }
    if (M.sulphur){                                                   // XXIII: the fumigation
      const bx = h.x + rx*1.9, by = cy + H*0.012;
      pen.paint(()=>{ g.rect(bx-W*0.030, by-H*0.030, W*0.060, H*0.026); }, S(5), 4);
      pen.paint(()=>{ g.moveTo(bx-W*0.020, by-H*0.004); g.lineTo(bx, by+H*0.038);
        g.lineTo(bx+W*0.020, by-H*0.004); g.closePath(); }, S(6), 3);
      g.strokeStyle=INK; g.lineWidth=4; g.globalAlpha=.34;
      for(let i=0;i<4;i++){ g.beginPath(); g.moveTo(bx+(i-1.5)*W*0.010, by-H*0.032);
        g.bezierCurveTo(bx+(i-1.5)*W*0.04, by-H*0.10, bx-(i-1.5)*W*0.05, by-H*0.16,
                        bx+(i-1.5)*W*0.012, by-H*0.24); g.stroke(); }
      g.globalAlpha=1;
    }
  }

  /* ================= THE SUITORS' GROUND — benches and tables ============ */
  if (has("furniture")){
    const F = M.furniture;
    /* an overturned piece: the slab on edge with its legs in the air */
    const tumbled = (s, hx, hz2, tilt) => {
      const cx2 = X(s.x, s.z), cy2 = Y(s.z), w2 = hx*SPREAD(s.z)*W*2, h2 = 0.13*SZ(s.z)*H;
      pen.paint(()=>{ g.ellipse(cx2, cy2, w2*0.52, hz2*SPREAD(s.z)*H*0.55, 0,0,7); }, S(3), 3);
      g.save(); g.translate(cx2, cy2); g.rotate(tilt);
      for(const q of [-0.66,-0.22,0.22,0.66])
        pen.paint(()=>{ g.rect(q*w2-W*0.008, -h2*2.4, W*0.016, h2*1.1); }, S(6), 3);
      pen.paint(()=>{ g.rect(-w2/2, -h2*1.5, w2, h2*0.46); }, S(4), 5);
      g.restore();
    };
    const bench = (nm, tilt=0) => {
      const s = megaron.stations[nm];
      if (tilt) return tumbled(s, 0.075, 0.045, tilt);
      planBox(s.x-0.075, s.x+0.075, s.z-0.038, s.z+0.038, 0.075, 3, 5);
    };
    const table = (nm, laden, tilt=0) => {
      const s = megaron.stations[nm];
      if (tilt) return tumbled(s, 0.095, 0.060, tilt);
      planBox(s.x-0.095, s.x+0.095, s.z-0.058, s.z+0.058, 0.135, 4, 5);
      const hh = 0.135*SZ(s.z)*H;
      for(const q of [-0.72,0.72]) pen.paint(()=>{
        g.rect(X(s.x+q*0.095, s.z+0.05)-W*0.008, Y(s.z+0.05)-hh, W*0.016, hh); }, S(6), 3);
      if (laden){                                                     // cups, platters, krater
        for(let i=0;i<5;i++){ const u=(i+0.5)/5;
          const cx2=X(s.x-0.075+0.15*u, s.z-0.02), cy3=Y(s.z-0.02)-hh;
          pen.paint(()=>{ g.rect(cx2-W*0.008, cy3-H*0.026, W*0.016, H*0.026); }, S(4), 3);
          pen.paint(()=>{ g.ellipse(cx2, cy3, W*0.014, H*0.008, 0,0,7); }, S(5), 3); }
        pen.paint(()=>{ g.ellipse(X(s.x,s.z+0.02), Y(s.z+0.02)-hh-H*0.014, W*0.030, H*0.020, 0,0,7); }, S(6), 4);
      }
    };

    if (F==="order" || F==="feast" || F==="stacked"){
      bench("bench_l1"); bench("bench_l2"); bench("bench_r1"); bench("bench_r2");
      table("table_l", F==="feast"); table("table_r", F==="feast");
      if (F==="stacked"){                                     // XX: stools up on the boards
        for(const nm of ["table_l","table_r"]){ const s=megaron.stations[nm];
          planBox(s.x-0.045, s.x+0.045, s.z-0.030, s.z+0.030, 0.235, 3, 5); }
      }
      if (F==="feast"){                                       // the suitors' disorder
        for(const nm of ["bench_l2","bench_r1"]){ const s=megaron.stations[nm];
          pen.paint(quad(s.x-0.075, s.x+0.075, s.z-0.070, s.z-0.014, 0.075, 0.075), S(2), 3); }
      }
    } else if (F==="cleared"){                                 // XXI: pushed to the walls
      for(const [nm,dx] of [["bench_l1",-0.07],["bench_l2",-0.07],["bench_r1",0.07],["bench_r2",0.07]]){
        const s=megaron.stations[nm];
        planBox(s.x+dx-0.075, s.x+dx+0.075, s.z-0.034, s.z+0.034, 0.070, 3, 5);
      }
      for(const [nm,dx] of [["table_l",-0.12],["table_r",0.12]]){
        const s=megaron.stations[nm];
        planBox(s.x+dx-0.070, s.x+dx+0.070, s.z-0.048, s.z+0.048, 0.130, 4, 6);
      }
    } else if (F==="wrecked"){                                 // XXII
      bench("bench_l1", 0.42); bench("bench_r1", -0.36);
      bench("bench_l2", -0.55); bench("bench_r2", 0.50);
      table("table_l", false, 0.62); table("table_r", false, -0.70);
    } else if (F==="piled"){                                   // XXII end: heaped at the corner
      const c = megaron.stations.corner_dead;
      for(let i=0;i<5;i++)
        tumbled({ x:c.x+0.02+i*0.014, z:c.z-0.12+i*0.026 }, 0.078, 0.048, (i%2?1:-1)*(0.45+0.16*i));
      const s2 = megaron.stations.table_r;
      tumbled({ x:s2.x+0.06, z:s2.z }, 0.095, 0.060, -0.78);
      const s3 = megaron.stations.bench_l1;
      tumbled({ x:s3.x, z:s3.z }, 0.075, 0.045, 0.52);
    }
  }

  /* ================= BOOK XXI — THE TWELVE AXES ==========================
     Placed by plan.ray(axe_first → axe_last), evenly in PLAN space, per the
     plan's own fixture. Twelve helve-rings on one line: the arrow's aperture. */
  if (has("axes") && M.axes){
    const N = params.axes;
    for(let i=0;i<N;i++){
      const u = N>1 ? i/(N-1) : 0.5;
      const p = megaron.ray("axe_first","axe_last",u);
      const bx = p.x*W, by = p.y*H, sc = 0.60+0.50*p.d;
      const hw = W*0.013*sc, hh = H*0.185*sc, rr = W*0.021*sc;
      pen.paint(()=>{ g.rect(bx-hw*2.0, by-H*0.013*sc, hw*4.0, H*0.015*sc); }, S(6), 3); // set in the earth
      pen.paint(()=>{ g.rect(bx-hw, by-hh, hw*2, hh); }, S(5), 3);                       // the helve
      const ry0 = by - hh*0.86;
      for(const sgn of [-1,1])                                                            // the double blade
        pen.paint(()=>{ g.moveTo(bx+sgn*rr*0.6, ry0-rr*0.95); g.lineTo(bx+sgn*rr*2.2, ry0-rr*0.25);
          g.lineTo(bx+sgn*rr*2.2, ry0+rr*0.25); g.lineTo(bx+sgn*rr*0.6, ry0+rr*0.95); g.closePath(); }, S(6), 3);
      // THE RING — the hole the shaft flies through. Light inside, hard contour.
      pen.paint(()=>{ g.arc(bx, ry0, rr*1.08, 0, 7); }, S(7), 3);
      pen.paint(()=>{ g.arc(bx, ry0, rr*0.60, 0, 7); }, toneSolid(inkLevel(0)), 4);
    }
  }

  /* ================= LITTER, BLOOD, ARROWS =============================== */
  if (has("litter") && M.litter!=="none"){
    const spots = [];
    for(let i=0;i<26;i++) spots.push({ x:0.10+R()*0.80, z:0.34+R()*0.62 });
    if (M.litter==="feast"){                                    // bones and fallen cups
      for(const s of spots.slice(0,14)){
        const sx=X(s.x,s.z), sy=Y(s.z), k=SZ(s.z);
        if (R()<0.5) pen.paint(()=>{ g.ellipse(sx,sy,W*0.012*k,H*0.006*k,0,0,7); }, S(5), 2);
        else pen.ink(()=>{ g.moveTo(sx-W*0.013*k, sy); g.lineTo(sx+W*0.013*k, sy-H*0.009*k); }, 3);
      }
    }
    if (M.litter==="battle" || M.litter==="blood"){
      const h=A("hearth");
      for(let i=0;i<9;i++){ const a=R()*6.28, rr=0.9+R()*2.4;
        const ax=h.x+Math.cos(a)*W*0.085*rr, ay=h.y+Math.sin(a)*H*0.035*rr;
        pen.paint(()=>{ g.ellipse(ax, ay, W*0.024, H*0.011, 0,0,7); }, SF(3), 2); }
      const cd = A("corner_dead");
      const pools = [[cd.x,cd.y,1.7],[X(.34,.72),Y(.72),1.0],[X(.62,.60),Y(.60),0.8],
                     [X(.24,.86),Y(.86),1.3],[X(.70,.82),Y(.82),1.1],[X(.46,.66),Y(.66),0.7]];
      for(const [bx,by,k] of pools){
        pen.paint(()=>{ g.ellipse(bx, by, W*0.052*k, H*0.020*k, 0.2*k, 0, 7); }, S(M.litter==="blood"?7:6), 3);
        pen.paint(()=>{ g.ellipse(bx+W*0.036*k, by+H*0.011*k, W*0.020*k, H*0.008*k, 0,0,7); }, S(6), 2);
      }
      for(let i=0;i<7;i++){                                     // arrows stuck in the floor
        const s=spots[i+3], sx=X(s.x,s.z), sy=Y(s.z), k=SZ(s.z), a=-1.05-R()*0.5;
        g.save(); g.translate(sx,sy); g.rotate(a);
        pen.ink(()=>{ g.moveTo(0,0); g.lineTo(H*0.085*k, 0); }, 3);
        pen.ink(()=>{ g.moveTo(H*0.085*k,0); g.lineTo(H*0.070*k,-H*0.013*k); }, 3);
        pen.ink(()=>{ g.moveTo(H*0.085*k,0); g.lineTo(H*0.070*k, H*0.013*k); }, 3);
        g.restore();
      }
      const pl=A("pillar_l");                                   // and three in the left pillar
      for(let i=0;i<3;i++){ const yy=pl.y-H*(0.17+0.09*i);
        pen.ink(()=>{ g.moveTo(pl.x+W*0.022, yy); g.lineTo(pl.x+W*0.086, yy-H*0.017); }, 3);
        pen.ink(()=>{ g.moveTo(pl.x+W*0.086, yy-H*0.017); g.lineTo(pl.x+W*0.068, yy-H*0.031); }, 3); }
    }
  }

  /* ================= THE THRONE, near camera, facing the doors ============
     Open-work back on purpose: it must frame the lane, not block it. */
  if (has("throne")){
    const s = megaron.stations.throne;
    if (M.stool) planBox(s.x-0.048, s.x+0.048, s.z-0.150, s.z-0.095, 0.045, 4, 6);
    planBox(s.x-0.080, s.x+0.080, s.z-0.060, s.z+0.060, 0.100, 3, 5);
    const zb = s.z+0.060, base = Y(zb), k = SZ(zb);
    const bh = 0.200*k*H, xl = X(s.x-0.080, zb), xr = X(s.x+0.080, zb);
    for(const bxp of [xl, xr-W*0.024])
      pen.paint(()=>{ g.rect(bxp, base-bh, W*0.024, bh); }, S(5), 4);
    pen.paint(()=>{ g.rect(xl, base-bh, xr-xl, H*0.028); }, S(6), 4);
    pen.paint(()=>{ g.moveTo(xl+W*0.022, base-bh); g.lineTo((xl+xr)/2, base-bh-H*0.042);
      g.lineTo(xr-W*0.022, base-bh); g.closePath(); }, S(5), 4);
    pen.ink(()=>{ g.moveTo(xl+W*0.034, base-bh*0.56); g.lineTo(xr-W*0.034, base-bh*0.56); }, 4);
  }
}

/* ---- anchors are DERIVED from the plan, never authored ------------------- */
const ANCHORS = {};
for (const n of megaron.names()){
  const p = megaron.at(n);
  ANCHORS[n] = { x:+p.x.toFixed(4), y:+p.y.toFixed(4) };
}
ANCHORS["entrance:main"] = ANCHORS.door_main;
ANCHORS["entrance:postern"] = ANCHORS.postern;
ANCHORS["exit:stair"] = ANCHORS.stair_up;
ANCHORS["exit:storeroom"] = ANCHORS.storeroom;
ANCHORS["camera:wide"] = { x:.50, y:.50 };
ANCHORS["camera:doors"] = { x:.50, y:.54 };
ANCHORS["camera:hearth"] = { x:.50, y:.66 };
ANCHORS["camera:corner"] = { x:.18, y:.82 };

const node = (state, extra={}) => ({ preview:{ state, t:0.4, status:MODES[state].status, ...extra } });

export const asset = {
  id:"location.megaron-hall",
  type:"LOCATION",
  name:"Megaron Hall",
  statusWord:"THE HALL",
  scene:"OD-B21-S05",
  plan:"megaron",
  continuityOf:"location.odysseuss-palace-threshold-and-hall",

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  zones:{
    walkable:      { x0:.12, y0:.55, x1:.88, y1:.98 },
    "lane:spine":  { x0:.44, y0:.55, x1:.56, y1:.98 },
    "sill":        { x0:.42, y0:.55, x1:.58, y1:.59 },
    "suitors:left":{ x0:.17, y0:.74, x1:.34, y1:.90 },
    "suitors:right":{x0:.66, y0:.74, x1:.83, y1:.90 },
    "corner:dead": { x0:.06, y0:.86, x1:.24, y1:.97 },
    "postern:mouth":{x0:.18, y0:.56, x1:.29, y1:.65 },
  },

  /* ONE room. The channel is `state`; nothing here is a separate location. */
  states:{
    initial:"day",
    nodes:{
      day:      node("day"),
      feast:    node("feast"),
      night:    node("night"),
      contest:  node("contest"),
      battle:   node("battle"),
      aftermath:node("aftermath"),
      cleaned:  node("cleaned"),
    },
    edges:[["day","feast"],["feast","day"],["feast","night"],["day","night"],
           ["night","contest"],["day","contest"],["contest","battle"],
           ["battle","aftermath"],["aftermath","cleaned"],["cleaned","day"]],
  },
  channels:["state","reveal","camera","light","hearth","t"],

  preview:()=>({ state:"day", t:0.4, status:"THE HALL", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones }; },
};
export default asset;
