/* location.farmhouse-feast — THE FARMHOUSE OF LAERTES, INSIDE.
   ADDITIVE, Book XXIV. Creates nothing but itself; modifies nothing.

   WHY THIS FILE EXISTS. Odyssey XXIV.361–412 and 489–501 both play in ONE room
   and the room has to carry both: the Sicilian woman bathes and anoints the old
   king and Athena fills out his limbs; they sit down to meat; Dolius comes in
   from the field and takes Odysseus' hand; and then, with the militia on the
   road, the same room turns into an armoury — "they put on their armour" — and
   a son is sent to the door to LOOK OUT. Bath, dressing, table, food, weapon
   readiness, lookout: six beats, one set, and the set has to change state
   under them without becoming a different building between shots.

   THIS IS NOT THE HALL AND NOT THE HUT. The great hall is location.megaron-hall
   (day|feast|night|contest|battle|aftermath|cleaned); the swineherd's hut is
   location.eumaeus-hut-interior. This is the steading house on Laertes' farm —
   the building drawn from OUTSIDE on its cut terrace in location.laertess-orchard,
   seen here from within. It is a farm hall: low roof on broken tie beams, rubble
   walls, a cook hearth on the west side, a bathing bay paved on the east, small
   separate tables (Homer's diners each get their own polished board — which is
   also why nothing here spans the frame), and the arms of the house on the wall
   either side of the yard door. It shares the megaron's projection law exactly,
   so a body blocked here and a body blocked in the hall stand on one floor.

   THE TWO OPENINGS ARE LOAD-BEARING and must not move:
     · door_yard  the yard door in the far wall — out to the feast yard and the
                  approach road drawn in location.laertess-orchard
     · slit       the lookout slot beside it, shuttered until XXIV.491, with a
                  standing block (station `lookout`) under it. The transition
                  the book turns on is a shutter and a step, so both are built.

   STATES (state.state, default "table") — each changes what is DRAWN:
     bath      tub filled on its plinth, cauldron over the fire, screen up,
               steam to the rafters, boards bare, arms still on the wall
     dressing  tub drained, chest open, folded cloth and the fresh mantle down
               off its peg, linen and oil on the stool, boards bare
     table     the three boards laden — loaves, joint, mixing bowl, cups —
               stools drawn in, hearth low, door ajar
     arming    food gone, ARMS DOWN: pegs and spear block bare, helmet, spears
               and shield laid out across the boards, door open
     lookout   shutter open on the slit, door wide, a hard blade of daylight
               across the floor, boards and walls empty, a stool shoved over
     bare      the navigable set only — no fittings, no dressing

   SOLID tone + hard contour only; the engine dotify pass supplies the halftone.
   NO characters baked in — the bath, the dressing stand and the lookout block
   are FIXTURES, and the seats are seats.
   Verify: node harness/render.mjs assets/location/farmhouse-feast.mjs --pipeline MESH */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";
import { makePlan } from "../../engine/blocking.mjs";

/* ---- the projection, identical to megaron-hall and the mill house --------
   x = 0.5 + (x-0.5)(0.42 + 0.58 z)      y = 0.50 + 0.46 z^1.08     README §5
   project() clamps z for FIGURES; the shell uses the same formula unclamped so
   walls run past the near clip. Every station still goes through plan.at(). */
const SPREAD = z => 0.42 + 0.58 * z;
const px = (x, z) => 0.5 + (x - 0.5) * SPREAD(z);
const py = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const HORIZON = 0.50;

/* ---- THE PLAN ------------------------------------------------------------
   Authored here (there is no scenes/_plans/farmhouse.mjs and this file may not
   create one). Exported so OD-B24-S05 can block through it BY NAME instead of
   inventing anchors. x: 0 left..1 right, z: 0 far..1 near.

   THE BOARDS ARE THREE, NOT ONE. Three small tables at three different depths
   is both Homeric and structural: a single long trestle would lie across the
   frame as one bar, and one bar is what kills a room in the dot lattice. */
const stations = {
  /* openings */
  door_yard:   { x:.38, z:.10 },   // out to the feast yard / the approach road
  threshold:   { x:.38, z:.21 },   // one step inside it
  lookout:     { x:.70, z:.20 },   // the standing block under the slit (XXIV.491)
  door_store:  { x:.06, z:.40 },   // the inner store, cut in the west wall
  /* the cook side (west) */
  hearth:      { x:.19, z:.46 },
  pot:         { x:.09, z:.38 },   // the cauldron on its tripod, west of the fire
  /* the bathing bay (east) */
  bath:        { x:.82, z:.40 },   // the tub on its paved plinth
  bath_stand:  { x:.65, z:.45 },   // where the bath is attended from
  linen:       { x:.95, z:.55 },   // stool: folded linen and the oil flask
  /* dressing — set at the head of the bathing bay, clear of the east board */
  chest:       { x:.90, z:.60 },   // the clothes chest
  dress_stand: { x:.70, z:.62 },   // where a man is dressed and armed
  /* the boards, staggered in depth */
  board_w:     { x:.24, z:.72 },
  board_c:     { x:.49, z:.86 },
  board_e:     { x:.75, z:.71 },
  seat_w:      { x:.22, z:.62 },
  seat_c:      { x:.49, z:.75 },
  seat_e:      { x:.77, z:.61 },
  seat_near:   { x:.40, z:.99 },   // the near stool — shoved over in `lookout`
  /* the arms of the house */
  spear_block: { x:.13, z:.16 },   // butt block against the far wall, west of the door
  shield_pegs: { x:.62, z:.13 },   // two pegs east of the door
  arm_up:      { x:.42, z:.35 },   // the floor a man is armed on
  /* CONTACT PAIR — two bodies that touch must not resolve to one point.
     XXIV.397: Dolius runs to Odysseus and takes his hand and kisses it. */
  greet_l:     { x:.43, z:.53 },
  greet_r:     { x:.57, z:.53 },
  /* stores in the near corners */
  jars:        { x:.08, z:.90 },
  gear:        { x:.92, z:.96 },
  centre:      { x:.50, z:.58 },
};

export const farmhouse = makePlan({
  id:"laertes-farmhouse",
  name:"The Farmhouse at Laertes' Steading",
  notes:"Two openings are load-bearing and must not move: door_yard is the way " +
        "out to the feast yard and the approach road (location.laertess-orchard), " +
        "and `slit` + `lookout` is the shuttered slot a son of Dolius is sent to " +
        "at XXIV.491. greet_l/greet_r is the contact pair for Dolius taking " +
        "Odysseus' hand. The three boards are separate tables at three depths.",
  stations,
  fixtures:[
    { id:"boards",  kind:"prop", at:["board_w","board_c","board_e"], count:3,
      note:"three polished boards, one per diner, staggered in depth" },
    { id:"bath_tub", kind:"prop", at:"bath", note:"tub on a paved plinth; drained after `bath`" },
    { id:"arms",     kind:"prop", at:["spear_block","shield_pegs"],
      note:"the arms of the house: spears in the block, shields on the pegs, " +
           "both bare from state `arming` onward" },
  ],
});

const params = {
  plan:"laertes-farmhouse",
  roofRise:0.205,     // low farm roof — this is not the hall
  roofRake:0.245,
  doorHalf:0.120,     // half-width of the yard door, in PLAN x
  doorHeight:0.300,   // in unit height (README §5: h = H·s·(0.60+0.50d))
  laneHalf:0.150,     // the swept lane from the door to the boards
  beams:3, rafters:4, boards:3, spears:4, shields:2,
  plinthH:0.030,      // the bath's paved plinth
  tableH:0.086,       // board height off the floor
};
const ceilY = z => HORIZON - (params.roofRise + params.roofRake * Math.pow(z, 1.08));

/* ---- the state channel ---------------------------------------------------
   Everything in a row changes what GEOMETRY is built; there is no lighting
   fudge and no gradient anywhere in this file. */
const MODES = {
  bath:     { status:"THE BATH",  door:"ajar", shutter:"shut", fire:"high", tub:"full",
              screen:true,  chest:"shut", cloth:"peg",  food:"none",  arms:"wall",  seats:"back",  steam:true  },
  dressing: { status:"ANOINTED",  door:"ajar", shutter:"shut", fire:"low",  tub:"drained",
              screen:false, chest:"open", cloth:"down", food:"none",  arms:"wall",  seats:"back",  steam:false },
  table:    { status:"AT MEAT",   door:"ajar", shutter:"shut", fire:"low",  tub:"drained",
              screen:false, chest:"shut", cloth:"none", food:"laid",  arms:"wall",  seats:"drawn", steam:false },
  arming:   { status:"ARMING",    door:"open", shutter:"shut", fire:"embers", tub:"drained",
              screen:false, chest:"open", cloth:"none", food:"cleared", arms:"boards", seats:"drawn", steam:false },
  lookout:  { status:"THEY COME", door:"wide", shutter:"open", fire:"embers", tub:"drained",
              screen:false, chest:"shut", cloth:"none", food:"none",  arms:"gone",  seats:"upset", steam:false },
  bare:     { status:"THE HOUSE", door:"ajar", shutter:"shut", fire:"none", tub:"none",
              screen:false, chest:"none", cloth:"none", food:"none",  arms:"none",  seats:"none",  steam:false },
};

/* DRAW ORDER, back→front. `light` sits directly on the floor, UNDER every
   fitting: drawn late it is paper-white paint and it punched a hole through
   the centre board and the near stool. */
const LAYERS = ["shell","light","roof","farwall","door","slit","storedoor","hearth",
                "bath","dress","racks","boards","food","arms","steam","stores"];

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "table";
  const M    = MODES[mode];
  const T    = (st && st.t) || 0;
  const layers = (st && st.layers) || LAYERS;
  const has = l => layers.includes(l);

  const S  = l => toneSolid(inkLevel(clamp(Math.round(l), 0, 7)));
  const X  = (x, z) => px(x, z) * W;
  const Y  = z => py(z) * H;
  const Cy = z => ceilY(z) * H;
  const SZ = z => 0.60 + 0.50 * clamp(z, 0.08, 1);
  const A  = n => { const p = farmhouse.at(n); return { x:p.x*W, y:p.y*H, d:p.d, s:0.60+0.50*p.d }; };
  const P  = n => stations[n];
  const R  = rnd(24051);

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
  /* the faint arc idiom the atlas uses for smoke, steam and sound */
  const fan = (cx,cy,r0,dir,n,alpha) => {
    g.strokeStyle=INK; g.lineWidth=4; g.globalAlpha=alpha;
    for(let i=0;i<n;i++){ const r=r0*(1+i*0.52);
      g.beginPath(); g.arc(cx, cy, r, dir-0.68, dir+0.68); g.stroke(); }
    g.globalAlpha=1;
  };
  /* a small flame: solid, quantized, never a glow */
  const flame = (fx,fy,r,h,lvl) => {
    pen.paint(()=>{
      g.moveTo(fx-r, fy);
      g.quadraticCurveTo(fx-r*0.70, fy-h*0.55, fx-r*0.18, fy-h*0.88);
      g.quadraticCurveTo(fx-r*0.05, fy-h*0.44, fx+r*0.12, fy-h*1.00);
      g.quadraticCurveTo(fx+r*0.36, fy-h*0.50, fx+r*0.44, fy-h*0.70);
      g.quadraticCurveTo(fx+r*0.84, fy-h*0.36, fx+r, fy);
      g.closePath(); }, S(lvl), 3);
  };
  /* a three-legged stool at a station */
  const stool = (n, wf, upset=false) => {
    const p = P(n), s = SZ(p.z), cx = X(p.x,p.z), cy = Y(p.z);
    const rx = W*wf*SPREAD(p.z), sh = H*0.052*s;
    if (upset){                                   // shoved over: top face to us
      pen.paint(()=>{ g.ellipse(cx, cy-H*0.012*s, rx*0.98, rx*0.62, 0.5, 0,7); }, S(2), 4);
      for(const o of [-0.55,0.05,0.62]) pen.ink(()=>{
        g.moveTo(cx+rx*o*0.7, cy-H*0.012*s);
        g.lineTo(cx+rx*o*0.7 - W*0.030, cy-H*0.030*s - o*H*0.020); }, 4);
      return;
    }
    pen.paint(()=>{ g.ellipse(cx, cy-sh, rx, rx*0.38, 0,0,7); }, S(2), 4);
    for(const o of [-0.72, 0, 0.72]) pen.paint(()=>{
      g.rect(cx + rx*o - rx*0.11, cy-sh, rx*0.22, sh*(o?0.90:1.0)); }, S(5), 3);
  };
  /* one polished board on its trestles */
  const boardAt = (n, wf) => {
    const p = P(n), s = SZ(p.z), cx = X(p.x,p.z), cy = Y(p.z);
    const hw = wf*SPREAD(p.z), th = params.tableH;
    planBox(p.x-hw, p.x+hw, p.z-0.030, p.z+0.030, th, 1, 3, 4);
    // two legs, inset, so the board never reads as a solid block
    const top = cy - th*s*H;
    for(const o of [-0.62, 0.62]) pen.paint(()=>{
      g.rect(cx + hw*W*o - W*0.008*s, top + H*0.006, W*0.016*s, cy-top-H*0.006); }, S(5), 3);
    return { cx, cy, top, s, hw:hw*W };
  };

  /* ================= SHELL — walls, ceiling, floor ======================== */
  if (has("shell")){
    g.fillStyle = inkLevel(2); g.fillRect(0,0,W,H);                     // side walls
    // ceiling plane — kept PALE. It is a quarter of the frame; darker and the
    // room grows a lid of solid ink and stops breathing.
    pen.paint(()=>{ g.moveTo(X(0,.08), Cy(.08)); g.lineTo(X(1,.08),Cy(.08));
      rail(1,ceilY,.08,1.30); rail(0,ceilY,1.30,.08); g.closePath(); }, S(1), 5);
    // FAR WALL — the plane the yard door and the slit are cut into
    pen.paint(()=>{ g.rect(X(0,.08), Cy(.08), X(1,.08)-X(0,.08), Y(.08)-Cy(.08)); }, S(1), 5);
    // FLOOR — beaten earth. One step darker than the walls so the swept lane
    // reads off it and the daylight blade reads off the lane: three values on
    // the ground, none of them heavy.
    pen.paint(()=>{ g.moveTo(X(0,.08), Y(.08)); rail(0,py,.08,1.30);
      g.lineTo(X(1,1.30), Y(1.30)); rail(1,py,1.30,.08); g.closePath(); }, S(2), 5);
    // rubble coursing on the side walls — VERTICAL joints only, so the walls
    // are read as stone without a single rule crossing the frame
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.20;
    for(const sd of [0,1]) for(const z of [.13,.24,.38,.55,.76,1.02]){
      g.beginPath(); g.moveTo(X(sd,z), Y(z)); g.lineTo(X(sd,z), Math.max(0,Cy(z))); g.stroke(); }
    // and short stub courses, each only a step long, staggered
    for(const sd of [0,1]) for(const [z0,z1] of [[.13,.24],[.38,.55],[.76,1.02]]){
      const k = sd ? 0.34 : 0.28;
      g.beginPath();
      g.moveTo(X(sd,z0), Y(z0)-(Y(z0)-Cy(z0))*k);
      g.lineTo(X(sd,z1), Y(z1)-(Y(z1)-Cy(z1))*k); g.stroke();
    }
    g.globalAlpha=1;
    // the swept lane from the door down between the boards, a shade lighter
    const lh = params.laneHalf;
    pen.paint(quad(.38-lh, .38+lh, .13, 1.30), S(1), 3);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.24;
    g.beginPath();
    g.moveTo(X(.38-lh,.13),Y(.13)); g.lineTo(X(.38-lh,1.30),Y(1.30));
    g.moveTo(X(.38+lh,.13),Y(.13)); g.lineTo(X(.38+lh,1.30),Y(1.30));
    g.stroke(); g.globalAlpha=1;
    // BROKEN floor courses — only ever across the lane, never wall to wall
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.26;
    for(const z of [.26,.40,.58,.80,1.06]){
      g.beginPath(); g.moveTo(X(.38-lh,z),Y(z)); g.lineTo(X(.38+lh,z),Y(z)); g.stroke(); }
    g.globalAlpha=1;
    // the paved apron of the bathing bay, east side only
    pen.paint(quad(.68,1.02,.30,.58), S(1), 4);
  }

  /* ================= THE DAYLIGHT THROUGH THE DOOR ========================
     Stated as a hard-edged blade of paper on the floor — never a gradient, and
     drawn HERE, on the floor, under every fitting. */
  if (has("light") && M.door!=="shut"){
    const D = A("door_yard");
    const dw = (px(.38+params.doorHalf,.10) - px(.38-params.doorHalf,.10)) * W;
    const wide = M.door==="wide";
    const zEnd = wide ? 0.86 : 0.52;
    const spread = wide ? 1.55 : 0.95;
    pen.fillPath(()=>{
      g.moveTo(D.x-dw*0.46, Y(.21)); g.lineTo(D.x+dw*0.46, Y(.21));
      g.lineTo(D.x+dw*spread, Y(zEnd)); g.lineTo(D.x-dw*spread, Y(zEnd));
      g.closePath(); }, inkLevel(0));
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.24;
    g.beginPath();
    g.moveTo(D.x-dw*0.46, Y(.21)); g.lineTo(D.x-dw*spread, Y(zEnd));
    g.moveTo(D.x+dw*0.46, Y(.21)); g.lineTo(D.x+dw*spread, Y(zEnd));
    g.lineTo(D.x-dw*spread, Y(zEnd));
    g.stroke(); g.globalAlpha=1;
    if (M.shutter==="open"){
      // the second blade, off the slit — short, and it lands on the lookout block
      const b = P("lookout");
      pen.fillPath(()=>{
        g.moveTo(X(b.x-0.050,.13), Y(.13)); g.lineTo(X(b.x+0.050,.13), Y(.13));
        g.lineTo(X(b.x+0.098,.31), Y(.31)); g.lineTo(X(b.x-0.098,.31), Y(.31));
        g.closePath(); }, inkLevel(0));
    }
  }

  /* ================= ROOF — broken tie beams, rafters, the louvre ========= */
  if (has("roof")){
    // NO BEAM CROSSES THE FRAME. Each tie is two SHORT segments, the gap is at
    // a different plan-x on every beam, and no segment reaches both walls —
    // three unbroken ties would close the room like a grate.
    const BEAMS = [
      { z:.20, runs:[[0.02,0.26],[0.54,0.97]] },
      { z:.46, runs:[[0.10,0.34],[0.62,0.90]] },
      { z:.78, runs:[[0.00,0.20],[0.44,0.74]] },
    ];
    for(const B of BEAMS){
      const z = B.z;
      for(const [x0,x1] of B.runs){
        pen.paint(()=>{ const k=H*0.013*SZ(z);
          g.moveTo(X(x0,z),Cy(z)); g.lineTo(X(x1,z),Cy(z));
          g.lineTo(X(x1,z),Cy(z)+k); g.lineTo(X(x0,z),Cy(z)+k); g.closePath(); }, S(4), 3);
        // the corbel under each END of each run, so the ties are carried
        for(const xe of [x0,x1]) pen.paint(()=>{ const k=H*0.016*SZ(z), w=W*0.011*SZ(z);
          g.rect(X(xe,z)-w/2, Cy(z)+k*0.85, w, k); }, S(5), 3);
      }
    }
    // rafters, faint, stopping short of the near edge
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.24;
    for(const xp of [.16,.30,.62,.84]){
      g.beginPath(); g.moveTo(X(xp,.08),Cy(.08)); g.lineTo(X(xp,.88),Cy(.88)); g.stroke(); }
    g.globalAlpha=1;
    // THE LOUVRE over the cook hearth — open to the sky, which is why the west
    // side of this room is lit at all
    const vz0=.36, vz1=.50;
    pen.paint(()=>{ g.moveTo(X(.11,vz0),Cy(vz0)); g.lineTo(X(.27,vz0),Cy(vz0));
      g.lineTo(X(.27,vz1),Cy(vz1)); g.lineTo(X(.11,vz1),Cy(vz1)); g.closePath(); }, S(0), 5);
    pen.ink(()=>{ g.moveTo(X(.19,vz0),Cy(vz0)); g.lineTo(X(.19,vz1),Cy(vz1)); }, 3);
    /* NO KING POST. A post standing from the near tie to the floor is a black
       column three-quarters of the frame tall — the single loudest thing in the
       room, and it is only structure. The ties are carried on wall corbels. */
    // herbs and onion ropes hung off the middle beam — small, dark, unequal
    for(const [hx,hz,hl] of [[.30,.46,0.055],[.36,.46,0.038],[.72,.46,0.046]]){
      const bx=X(hx,hz), by=Cy(hz)+H*0.014;
      pen.ink(()=>{ g.moveTo(bx,by); g.lineTo(bx,by+H*hl*0.35); }, 3);
      pen.paint(()=>{ g.moveTo(bx-W*0.013, by+H*hl*0.35); g.lineTo(bx+W*0.013, by+H*hl*0.35);
        g.lineTo(bx, by+H*hl); g.closePath(); }, S(5), 3);
    }
  }

  /* ================= FAR WALL — plaster, pegs, a shelf stub ============== */
  if (has("farwall")){
    const wx=X(0,.08), ww=X(1,.08)-wx, top=Cy(.08), bot=Y(.08);
    // a plaster patch above the stone, WEST END ONLY — the span stays broken
    pen.paint(()=>{ g.rect(wx+ww*0.05, top+H*0.018, ww*0.21, H*0.018); }, S(3), 3);
    // a short shelf at the EAST end with two crocks on it — thin, and set well
    // clear of the shutter, which the two of them merged into one dark bar
    const sy = top + H*0.104;
    pen.paint(()=>{ g.rect(wx+ww*0.84, sy, ww*0.14, H*0.007); }, S(4), 3);
    for(const [u,r] of [[0.875,0.014],[0.935,0.010]]){
      pen.paint(()=>{ g.ellipse(wx+ww*u, sy-H*0.012, W*r, H*0.012, 0,0,7); }, S(1), 3);
      pen.paint(()=>{ g.ellipse(wx+ww*u, sy-H*0.022, W*r*0.55, H*0.004, 0,0,7); }, S(5), 2);
    }
    // the low stone footing of the far wall — three short runs, cut at the
    // doorway and cut again under the pegs, so it never reads as one rule
    for(const [u0,u1] of [[0.0,0.22],[0.52,0.72],[0.80,1.0]]){
      pen.paint(()=>{ g.rect(wx+ww*u0, bot-H*0.015, ww*(u1-u0), H*0.015); }, S(3), 3);
    }
  }

  /* ================= THE YARD DOOR ========================================
     Out to the feast yard and the approach road. The whole of XXIV.491–501
     comes through this opening. */
  if (has("door")){
    const D = A("door_yard");
    const dw = (px(.38+params.doorHalf,.10) - px(.38-params.doorHalf,.10)) * W;
    const dh = params.doorHeight * D.s * H;
    const x0 = D.x - dw/2, yTop = D.y - dh;
    pen.paint(()=>{ g.rect(x0-W*0.021, yTop-H*0.024, dw+W*0.042, dh+H*0.024); }, S(3), 5); // jambs
    const wide = M.door==="wide", open = M.door!=="shut";
    if (open){
      // the yard beyond: paper-bright, with the far hill shoulder and two
      // stakes of the yard fence stated in it. No gradient, no haze.
      pen.paint(()=>{ g.rect(x0, yTop, dw, dh); }, S(0), 5);
      const gy = yTop + dh*0.62;
      pen.paint(()=>{ g.moveTo(x0, gy);
        g.quadraticCurveTo(x0+dw*0.5, gy-dh*0.20, x0+dw, gy-dh*0.07);
        g.lineTo(x0+dw, gy); g.closePath(); }, S(2), 3);
      pen.ink(()=>{ g.moveTo(x0, gy); g.lineTo(x0+dw, gy); }, 3);
      for(let i=0;i<3;i++) pen.paint(()=>{
        g.rect(x0+dw*(0.14+i*0.30), gy-dh*(0.26+ (i%2)*0.05), dw*0.055, dh*(0.26+(i%2)*0.05)); }, S(5), 2);
      // the leaf, folded back against the jamb — a whole leaf when wide open
      pen.paint(()=>{ g.rect(x0-W*(wide?0.052:0.028), yTop+H*0.005,
                             W*(wide?0.048:0.026), dh-H*0.005); }, S(4), 4);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.55;
      for(let j=1;j<=3;j++){ const yy=yTop+dh*(j/4);
        g.beginPath(); g.moveTo(x0-W*(wide?0.050:0.026),yy); g.lineTo(x0-W*0.002,yy); g.stroke(); }
      g.globalAlpha=1;
    } else {
      pen.paint(()=>{ g.rect(x0, yTop, dw, dh); }, S(5), 5);
      for(let i=1;i<4;i++) pen.ink(()=>{
        g.moveTo(x0+dw*(i/4), yTop+dh*0.03); g.lineTo(x0+dw*(i/4), yTop+dh*0.97); }, 3);
    }
    // worn threshold stone + the step down into the room
    pen.paint(quad(.38-params.doorHalf, .38+params.doorHalf, .15, .21, 0.020, 0.020), S(3), 4);
    pen.paint(()=>{ const z1=.21, k=0.020*SZ(z1)*H;
      g.moveTo(X(.38-params.doorHalf,z1),Y(z1)-k); g.lineTo(X(.38+params.doorHalf,z1),Y(z1)-k);
      g.lineTo(X(.38+params.doorHalf,z1),Y(z1));   g.lineTo(X(.38-params.doorHalf,z1),Y(z1));
      g.closePath(); }, S(5), 4);
  }

  /* ================= THE LOOKOUT SLIT + ITS BLOCK =========================
     XXIV.491 — "one of you go out and look, in case they are on us already."
     Shuttered in every state but `lookout`; a standing block under it always. */
  if (has("slit")){
    const wx=X(0,.08), ww=X(1,.08)-wx, top=Cy(.08);
    const sx = wx+ww*0.62, sw = ww*0.19, sy = top+H*0.034, sh2 = H*0.038;
    pen.paint(()=>{ g.rect(sx-W*0.007, sy-H*0.007, sw+W*0.014, sh2+H*0.014); }, S(3), 4);  // frame
    if (M.shutter==="open"){
      pen.paint(()=>{ g.rect(sx, sy, sw, sh2); }, S(0), 4);
      pen.ink(()=>{ g.moveTo(sx+sw*0.52, sy); g.lineTo(sx+sw*0.52, sy+sh2); }, 3);         // mullion
      // the shutter itself, swung in against the wall
      pen.paint(()=>{ g.rect(sx+sw+W*0.010, sy-H*0.004, W*0.024, sh2+H*0.008); }, S(5), 3);
    } else {
      // BOARDED, not blacked: a level-5 panel this size printed as a slab and
      // out-shouted the door. Light boards, dark battens.
      pen.paint(()=>{ g.rect(sx, sy, sw, sh2); }, S(2), 4);
      for(const u of [0.30,0.62]) pen.paint(()=>{
        g.rect(sx+sw*u, sy, sw*0.09, sh2); }, S(5), 2);
      pen.ink(()=>{ g.moveTo(sx, sy+sh2*0.5); g.lineTo(sx+sw, sy+sh2*0.5); }, 3);
    }
    // the block a body stands on to reach the slit
    const b = P("lookout");
    planBox(b.x-0.055, b.x+0.055, b.z-0.030, b.z+0.030, 0.034, 1, 4, 4);
  }

  /* ================= THE STORE DOOR, cut in the west wall =================
     Kept SMALL and mid-toned. At full height and level 6 it was a black slab
     down the left third — the loudest thing in a room whose subject is a
     bath and three tables. */
  if (has("storedoor")){
    const z0=.24, z1=.37, hU=0.165;
    const face = (k, lvl, lw) => pen.paint(()=>{
      g.moveTo(X(0,z0), Y(z0)); g.lineTo(X(0,z1), Y(z1));
      g.lineTo(X(0,z1), Y(z1)-hU*k*SZ(z1)*H); g.lineTo(X(0,z0), Y(z0)-hU*k*SZ(z0)*H);
      g.closePath(); }, S(lvl), lw);
    face(1.16, 2, 4);          // the jamb reveal, light
    face(1.00, 5, 4);          // the store beyond — one contained dark accent
    // the lintel timber over it, and a sack just inside catching the light
    pen.paint(()=>{ const t=0.020;
      g.moveTo(X(0,z0), Y(z0)-hU*1.16*SZ(z0)*H); g.lineTo(X(0,z1), Y(z1)-hU*1.16*SZ(z1)*H);
      g.lineTo(X(0,z1), Y(z1)-(hU*1.16+t)*SZ(z1)*H); g.lineTo(X(0,z0), Y(z0)-(hU*1.16+t)*SZ(z0)*H);
      g.closePath(); }, S(5), 3);
    const jx=X(0.03,.42), jy=Y(.42), k=SZ(.42);
    pen.paint(()=>{ g.ellipse(jx+W*0.010, jy-H*0.018*k, W*0.019*k, H*0.024*k, 0,0,7); }, S(2), 4);
  }

  /* ================= THE COOK HEARTH ====================================== */
  if (has("hearth") && M.fire!=="none"){
    const h = P("hearth"), hx=X(h.x,h.z), hy=Y(h.z), k=SZ(h.z);
    const r = W*0.062*SPREAD(h.z);
    // ash bed and its ring of stones — light bed, mid stones, small dark fire
    pen.paint(()=>{ g.ellipse(hx, hy, r*1.05, r*0.44, 0,0,7); }, S(2), 4);
    for(let i=0;i<9;i++){ const a=i/9*Math.PI*2;
      pen.paint(()=>{ g.ellipse(hx+Math.cos(a)*r, hy+Math.sin(a)*r*0.44,
                                r*0.23, r*0.17, 0,0,7); }, S(i%2?4:3), 3); }
    if (M.fire==="high"){
      flame(hx, hy-r*0.10, r*0.42, r*1.35, 6);
      flame(hx-r*0.44, hy, r*0.22, r*0.66, 5);
    } else if (M.fire==="low"){
      flame(hx, hy-r*0.06, r*0.30, r*0.72, 6);
    } else {
      pen.paint(()=>{ g.ellipse(hx, hy-r*0.04, r*0.44, r*0.20, 0,0,7); }, S(5), 3);   // embers
    }
    // the cauldron on its tripod, standing BEHIND the fire at `pot`
    const p = P("pot"), pxp=X(p.x,p.z), pyp=Y(p.z), pk=SZ(p.z), pr=W*0.040*SPREAD(p.z);
    for(const o of [-1,0,1]) pen.ink(()=>{
      g.moveTo(pxp+o*pr*0.62, pyp); g.lineTo(pxp+o*pr*0.22, pyp-H*0.052*pk); }, 4);
    pen.paint(()=>{
      g.moveTo(pxp-pr, pyp-H*0.052*pk);
      g.bezierCurveTo(pxp-pr*1.06, pyp-H*0.012*pk, pxp+pr*1.06, pyp-H*0.012*pk, pxp+pr, pyp-H*0.052*pk);
      g.closePath(); }, S(4), 4);
    pen.paint(()=>{ g.ellipse(pxp, pyp-H*0.052*pk, pr, pr*0.30, 0,0,7); },
              S(M.fire==="high"?1:2), 3);
    pen.ink(()=>{ g.moveTo(pxp-pr, pyp-H*0.054*pk);
      g.quadraticCurveTo(pxp, pyp-H*0.092*pk, pxp+pr, pyp-H*0.054*pk); }, 3);   // bail
    if (M.fire==="high") fan(hx+W*0.010, hy-H*0.090, W*0.030, -Math.PI/2, 3, 0.22);
  }

  /* ================= THE BATH ============================================= */
  if (has("bath") && M.tub!=="none"){
    const b = P("bath"), bx=X(b.x,b.z), by=Y(b.z), k=SZ(b.z);
    const rx = W*0.088*SPREAD(b.z), ry = rx*0.40;
    // the paved plinth it stands on
    planBox(b.x-0.115, b.x+0.125, b.z-0.068, b.z+0.068, params.plinthH, 1, 3, 4);
    const topY = by - params.plinthH*k*H;
    // the tub: light body, a dark rim band, water only when the bath is drawn.
    // Drained it keeps a level-1 interior — a level-0 basin is a hole in the
    // paper and the vessel disappears.
    pen.paint(()=>{ g.moveTo(bx-rx, topY-H*0.026*k);
      g.bezierCurveTo(bx-rx*1.02, topY+H*0.036*k, bx+rx*1.02, topY+H*0.036*k, bx+rx, topY-H*0.026*k);
      g.closePath(); }, S(2), 5);
    pen.paint(()=>{ g.ellipse(bx, topY-H*0.026*k, rx, ry, 0,0,7); }, S(5), 5);        // rim band
    pen.paint(()=>{ g.ellipse(bx, topY-H*0.026*k, rx*0.86, ry*0.80, 0,0,7); },
              S(M.tub==="full" ? 3 : 1), 4);
    if (M.tub==="full"){
      // the water surface: two flat ripples, quantized, no shimmer
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.45;
      for(const u of [-0.28, 0.20]){ g.beginPath();
        g.ellipse(bx+rx*u*0.5, topY-H*0.026*k+ry*u, rx*0.44, ry*0.28, 0, 0.2, Math.PI-0.2); g.stroke(); }
      g.globalAlpha=1;
      // the jug standing in the tub's lee
      pen.paint(()=>{ g.ellipse(bx-rx*1.24, topY+H*0.008*k, W*0.017*k, H*0.024*k, 0,0,7); }, S(4), 3);
    } else {
      // drained: the bailing bowl upturned on the plinth
      pen.paint(()=>{ g.ellipse(bx+rx*1.05, topY+H*0.014*k, W*0.019*k, H*0.010*k, 0,0,7); }, S(4), 3);
    }
    // THE SCREEN — three boards on a frame, east of the tub, only while bathing
    if (M.screen){
      const z0=b.z-0.10, z1=b.z+0.12, xw=1.00, hU=0.230;
      const post = (z,lvl)=> pen.paint(()=>{ const hh=hU*SZ(z)*H, w=W*0.013*SZ(z);
        g.rect(X(xw,z)-w/2, Y(z)-hh, w, hh); }, S(lvl), 3);
      pen.paint(()=>{
        g.moveTo(X(xw,z0), Y(z0)); g.lineTo(X(xw,z1), Y(z1));
        g.lineTo(X(xw,z1), Y(z1)-hU*SZ(z1)*H); g.lineTo(X(xw,z0), Y(z0)-hU*SZ(z0)*H);
        g.closePath(); }, S(2), 4);
      post(z0,5); post(z1,5);
      g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.5;
      for(const u of [0.34,0.66]){ const zz=lerp(z0,z1,u), hh=hU*SZ(zz)*H;
        g.beginPath(); g.moveTo(X(xw,zz), Y(zz)); g.lineTo(X(xw,zz), Y(zz)-hh); g.stroke(); }
      g.globalAlpha=1;
    }
    // the linen stool: folded cloth and the oil flask
    const L = P("linen"), lx=X(L.x,L.z), ly=Y(L.z), lk=SZ(L.z), lw=W*0.030*SPREAD(L.z);
    pen.paint(()=>{ g.rect(lx-lw, ly-H*0.048*lk, lw*2, H*0.014*lk); }, S(4), 3);
    for(const o of [-0.74,0.74]) pen.paint(()=>{
      g.rect(lx+lw*o-lw*0.10, ly-H*0.034*lk, lw*0.20, H*0.034*lk); }, S(5), 2);
    pen.paint(()=>{ g.rect(lx-lw*0.72, ly-H*0.074*lk, lw*1.2, H*0.026*lk); }, S(1), 3);  // linen
    pen.ink(()=>{ g.moveTo(lx-lw*0.72, ly-H*0.062*lk); g.lineTo(lx+lw*0.48, ly-H*0.062*lk); }, 2);
    pen.paint(()=>{ g.ellipse(lx+lw*0.80, ly-H*0.062*lk, W*0.011*lk, H*0.017*lk, 0,0,7); }, S(5), 3); // oil
  }

  /* ================= DRESSING — the chest, the peg, the mantle ============ */
  if (has("dress") && M.chest!=="none"){
    const c = P("chest"), cx=X(c.x,c.z), cy=Y(c.z), ck=SZ(c.z);
    const hw = 0.085, hU = 0.078;
    planBox(c.x-hw, c.x+hw, c.z-0.045, c.z+0.045, hU, 1, 3, 4);
    const top = cy - hU*ck*H;
    // two hoop bands on the near face — the chest's signature
    for(const u of [0.30,0.70]) pen.paint(()=>{
      g.rect(cx - hw*SPREAD(c.z)*W + hw*2*SPREAD(c.z)*W*u - W*0.006, top+H*0.006,
             W*0.012, cy-top-H*0.006); }, S(5), 2);
    if (M.chest==="open"){
      // the lid stood back on its hinge, and folded cloth in the box
      pen.paint(()=>{
        g.moveTo(X(c.x-hw,c.z-0.045), Y(c.z-0.045)-hU*SZ(c.z-0.045)*H);
        g.lineTo(X(c.x+hw,c.z-0.045), Y(c.z-0.045)-hU*SZ(c.z-0.045)*H);
        g.lineTo(X(c.x+hw*0.92,c.z-0.045), Y(c.z-0.045)-(hU+0.105)*SZ(c.z-0.045)*H);
        g.lineTo(X(c.x-hw*0.92,c.z-0.045), Y(c.z-0.045)-(hU+0.105)*SZ(c.z-0.045)*H);
        g.closePath(); }, S(2), 4);   // the lid is a big plane: keep it pale
      pen.paint(()=>{ g.ellipse(cx, top-H*0.010, W*0.052*ck, H*0.016*ck, 0,0,7); }, S(1), 4);
      pen.ink(()=>{ g.moveTo(cx-W*0.040*ck, top-H*0.014); g.lineTo(cx+W*0.040*ck, top-H*0.016); }, 2);
    }
    // the peg on the east wall and what hangs from it
    const pz=.58, wx1=X(1,pz), wy=Y(pz), wh=Y(pz)-Cy(pz);
    pen.ink(()=>{ g.moveTo(wx1, wy-wh*0.62); g.lineTo(wx1-W*0.020, wy-wh*0.60); }, 4);
    if (M.cloth==="peg"){
      pen.paint(()=>{
        g.moveTo(wx1-W*0.030, wy-wh*0.60);
        g.lineTo(wx1-W*0.048, wy-wh*0.20);
        g.quadraticCurveTo(wx1-W*0.014, wy-wh*0.10, wx1+W*0.004, wy-wh*0.26);
        g.closePath(); }, S(2), 4);
      pen.ink(()=>{ g.moveTo(wx1-W*0.030, wy-wh*0.46); g.lineTo(wx1-W*0.006, wy-wh*0.40); }, 2);
    }
    if (M.cloth==="down"){
      // the fresh mantle carried to the dressing stand and laid over the stool
      const d = P("dress_stand"), dx=X(d.x,d.z), dy=Y(d.z), dk=SZ(d.z);
      pen.paint(()=>{ g.ellipse(dx, dy-H*0.030*dk, W*0.046*dk, H*0.020*dk, 0,0,7); }, S(2), 4);
      pen.paint(()=>{ g.rect(dx-W*0.030*dk, dy-H*0.030*dk, W*0.060*dk, H*0.030*dk); }, S(1), 3);
      pen.ink(()=>{ g.moveTo(dx-W*0.026*dk, dy-H*0.018*dk); g.lineTo(dx+W*0.026*dk, dy-H*0.020*dk); }, 2);
    }
  }

  /* ================= THE ARMS OF THE HOUSE, on the far wall =============== */
  if (has("racks") && M.arms!=="none"){
    const onWall = M.arms==="wall";
    // spear block, west of the door: a low block with four butts standing in it
    const sb = P("spear_block");
    planBox(sb.x-0.055, sb.x+0.055, sb.z-0.028, sb.z+0.028, 0.030, 2, 5, 3);
    if (onWall){
      // a STAND of spears, not four separate poles: they all lean the same way
      // out of one block, fanned, with the heads clearing each other
      const bx0=X(sb.x,sb.z), by0=Y(sb.z)-0.030*SZ(sb.z)*H;
      for(let i=0;i<params.spears;i++){
        const o=(i-(params.spears-1)/2)*W*0.011;
        const lean=W*(0.018 + i*0.009);
        const hgt=H*(0.155 - (i%2)*0.016);
        pen.ink(()=>{ g.moveTo(bx0+o, by0); g.lineTo(bx0+o+lean, by0-hgt); }, 5);
        pen.paint(()=>{ const tx=bx0+o+lean, ty=by0-hgt;
          g.moveTo(tx-W*0.008, ty+H*0.022); g.lineTo(tx+W*0.002, ty-H*0.014);
          g.lineTo(tx+W*0.010, ty+H*0.020); g.closePath(); }, S(6), 2);
      }
    }
    // two shield pegs east of the door, at UNEQUAL heights so they never pair
    // into a bar across the wall
    const sp = P("shield_pegs"), spx=X(sp.x,sp.z), spy=Y(sp.z), sk=SZ(sp.z);
    const wallTop = Cy(.08);
    for(let i=0;i<params.shields;i++){
      const cxp = spx + i*W*0.070;
      const cyp = wallTop + H*(0.088 + i*0.030);
      pen.ink(()=>{ g.moveTo(cxp, cyp-H*0.030); g.lineTo(cxp, cyp-H*0.014); }, 3);   // the peg
      if (onWall){
        const rr = W*0.040*sk*(1-i*0.12);
        pen.paint(()=>{ g.ellipse(cxp, cyp+rr*0.42, rr, rr*0.98, 0,0,7); }, S(2), 5);
        pen.ink(()=>{ g.ellipse(cxp, cyp+rr*0.42, rr*0.66, rr*0.64, 0,0,7); }, 3);
        pen.paint(()=>{ g.ellipse(cxp, cyp+rr*0.42, rr*0.20, rr*0.19, 0,0,7); }, S(6), 3); // boss
      }
    }
    // a helmet on the shelf stub, kept while the arms are on the wall
    if (onWall){
      const hx2 = X(0,.08)+(X(1,.08)-X(0,.08))*0.885, hy2 = wallTop+H*0.062;
      pen.paint(()=>{ g.moveTo(hx2-W*0.019, hy2);
        g.quadraticCurveTo(hx2, hy2-H*0.040, hx2+W*0.019, hy2); g.closePath(); }, S(4), 4);
      pen.ink(()=>{ g.moveTo(hx2-W*0.004, hy2-H*0.030); g.lineTo(hx2+W*0.002, hy2-H*0.050); }, 4); // crest stem
    }
  }

  /* ================= THE THREE BOARDS + THEIR SEATS ======================= */
  if (has("boards") && M.seats!=="none"){
    const B = {};
    B.w = boardAt("board_w", 0.088);
    B.e = boardAt("board_e", 0.082);
    B.c = boardAt("board_c", 0.098);
    if (M.seats!=="none"){
      stool("seat_w", 0.030);
      stool("seat_e", 0.028);
      stool("seat_c", 0.032);
      if (M.seats==="upset") stool("seat_near", 0.034, true);
      else if (M.seats==="drawn") stool("seat_near", 0.034);
    }

    /* ---- FOOD on the boards ---- */
    if (has("food") && M.food!=="none"){
      const laid = M.food==="laid";
      // west board: two loaves and a cup
      for(const [o,r] of [[-0.42,0.020],[0.02,0.017]]){
        pen.paint(()=>{ g.ellipse(B.w.cx+B.w.hw*o, B.w.top-H*0.010*B.w.s,
                                  W*r*B.w.s, H*r*0.62*B.w.s, 0,0,7); }, S(laid?2:1), 4);
        if (laid) pen.ink(()=>{ g.moveTo(B.w.cx+B.w.hw*o-W*r*0.5*B.w.s, B.w.top-H*0.012*B.w.s);
                                g.lineTo(B.w.cx+B.w.hw*o+W*r*0.5*B.w.s, B.w.top-H*0.014*B.w.s); }, 2);
      }
      pen.paint(()=>{ g.rect(B.w.cx+B.w.hw*0.56, B.w.top-H*0.026*B.w.s, W*0.017*B.w.s, H*0.026*B.w.s); }, S(4), 3);
      // centre board: the mixing bowl and, when laid, the joint on its platter
      pen.paint(()=>{ g.moveTo(B.c.cx-W*0.040*B.c.s, B.c.top-H*0.020*B.c.s);
        g.bezierCurveTo(B.c.cx-W*0.044*B.c.s, B.c.top+H*0.012*B.c.s,
                        B.c.cx+W*0.044*B.c.s, B.c.top+H*0.012*B.c.s,
                        B.c.cx+W*0.040*B.c.s, B.c.top-H*0.020*B.c.s); g.closePath(); }, S(2), 5);
      pen.paint(()=>{ g.ellipse(B.c.cx, B.c.top-H*0.020*B.c.s, W*0.040*B.c.s, H*0.014*B.c.s, 0,0,7); },
                S(laid?4:1), 4);
      if (laid){
        pen.paint(()=>{ g.ellipse(B.c.cx+W*0.072*B.c.s, B.c.top-H*0.008*B.c.s,
                                  W*0.032*B.c.s, H*0.013*B.c.s, 0,0,7); }, S(1), 4);
        pen.paint(()=>{ g.ellipse(B.c.cx+W*0.072*B.c.s, B.c.top-H*0.017*B.c.s,
                                  W*0.022*B.c.s, H*0.011*B.c.s, 0,0,7); }, S(5), 3);
      }
      // east board: a cup and a basket
      pen.paint(()=>{ g.rect(B.e.cx-B.e.hw*0.30, B.e.top-H*0.024*B.e.s, W*0.016*B.e.s, H*0.024*B.e.s); }, S(4), 3);
      pen.paint(()=>{ g.moveTo(B.e.cx+B.e.hw*0.26, B.e.top-H*0.026*B.e.s);
        g.lineTo(B.e.cx+B.e.hw*0.74, B.e.top-H*0.026*B.e.s);
        g.lineTo(B.e.cx+B.e.hw*0.62, B.e.top); g.lineTo(B.e.cx+B.e.hw*0.38, B.e.top);
        g.closePath(); }, S(laid?2:1), 4);
    }

    /* ---- ARMS LAID OUT on the boards (XXIV.496–499) ---- */
    if (has("arms") && M.arms==="boards"){
      // helmet on the centre board
      const hx3=B.c.cx-W*0.060*B.c.s, hy3=B.c.top-H*0.004;
      pen.paint(()=>{ g.moveTo(hx3-W*0.026*B.c.s, hy3);
        g.quadraticCurveTo(hx3, hy3-H*0.052*B.c.s, hx3+W*0.026*B.c.s, hy3); g.closePath(); }, S(4), 5);
      pen.ink(()=>{ g.moveTo(hx3-W*0.004, hy3-H*0.040*B.c.s); g.lineTo(hx3+W*0.004, hy3-H*0.064*B.c.s); }, 5);
      pen.paint(()=>{ g.ellipse(hx3, hy3, W*0.026*B.c.s, H*0.007*B.c.s, 0,0,7); }, S(6), 3);
      // two spears lying across the west board, at different angles
      for(const [o,a] of [[-0.15,-0.10],[0.10,-0.16]]){
        const x1=B.w.cx-B.w.hw*1.15, y1=B.w.top+H*(0.004+o*0.04);
        const x2=B.w.cx+B.w.hw*1.10, y2=y1+H*a*0.30;
        pen.ink(()=>{ g.moveTo(x1,y1); g.lineTo(x2,y2); }, 5);
        pen.paint(()=>{ g.moveTo(x2, y2-H*0.008); g.lineTo(x2+W*0.030, y2-H*0.004);
          g.lineTo(x2, y2+H*0.006); g.closePath(); }, S(6), 3);
      }
      // a shield leaning against the east board, face to us
      const rr=W*0.052*B.e.s;
      pen.paint(()=>{ g.ellipse(B.e.cx+B.e.hw*1.05, B.e.cy-rr*0.86, rr, rr*1.02, 0.10, 0,7); }, S(2), 5);
      pen.ink(()=>{ g.ellipse(B.e.cx+B.e.hw*1.05, B.e.cy-rr*0.86, rr*0.64, rr*0.66, 0.10, 0,7); }, 3);
      pen.paint(()=>{ g.ellipse(B.e.cx+B.e.hw*1.05, B.e.cy-rr*0.86, rr*0.20, rr*0.20, 0,0,7); }, S(6), 3);
    }
  }

  /* ================= STEAM off the bath =================================== */
  if (has("steam") && M.steam){
    const b = P("bath"), bx=X(b.x,b.z), by=Y(b.z)-params.plinthH*SZ(b.z)*H;
    fan(bx, by-H*0.075, W*0.034, -Math.PI/2, 3, 0.26);
    fan(bx-W*0.030, by-H*0.130, W*0.026, -Math.PI/2+0.4, 2, 0.18);
  }

  /* ================= NEAR-CORNER STORES =================================== */
  if (has("stores") && M.arms!=="none"){
    // jars, near left: three, unequal, and none of them tall enough to post
    const j = P("jars");
    for(let i=0;i<3;i++){
      const jz=j.z-i*0.055, jx=X(j.x+i*0.030, jz), jy=Y(jz), jk=SZ(jz);
      const rr=W*(0.028-i*0.005)*jk;
      pen.paint(()=>{ g.moveTo(jx-rr, jy-H*0.030*jk);
        g.bezierCurveTo(jx-rr*1.24, jy-H*0.098*jk, jx+rr*1.24, jy-H*0.098*jk, jx+rr, jy-H*0.030*jk);
        g.bezierCurveTo(jx+rr*0.72, jy+H*0.006*jk, jx-rr*0.72, jy+H*0.006*jk, jx-rr, jy-H*0.030*jk);
        g.closePath(); }, S(2), 5);
      pen.paint(()=>{ g.ellipse(jx, jy-H*0.098*jk, rr*0.52, rr*0.24, 0,0,7); }, S(5), 3);
    }
    // kindling and a basket, near right
    const gp = P("gear"), gx=X(gp.x,gp.z), gy=Y(gp.z), gk=SZ(gp.z);
    pen.paint(()=>{ g.moveTo(gx-W*0.050*gk, gy); g.lineTo(gx+W*0.050*gk, gy);
      g.lineTo(gx+W*0.036*gk, gy-H*0.052*gk); g.lineTo(gx-W*0.036*gk, gy-H*0.052*gk);
      g.closePath(); }, S(2), 5);
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.5;
    for(const u of [0.3,0.6]){ const yy=gy-H*0.052*gk*u;
      g.beginPath(); g.moveTo(gx-W*0.046*gk, yy); g.lineTo(gx+W*0.046*gk, yy); g.stroke(); }
    g.globalAlpha=1;
    for(let i=0;i<4;i++) pen.ink(()=>{
      g.moveTo(gx-W*0.060*gk, gy-H*0.006*i*gk);
      g.lineTo(gx-W*0.120*gk, gy-H*0.030*gk-H*0.008*i*gk); }, 3);
  }
}

/* ---- anchors are DERIVED from the plan, never authored ------------------- */
const ANCHORS = {};
for (const n of farmhouse.names()){
  const p = farmhouse.at(n);
  ANCHORS[n] = { x:+p.x.toFixed(4), y:+p.y.toFixed(4) };
}
ANCHORS["entrance:yard"]   = ANCHORS.door_yard;
ANCHORS["exit:yard"]       = ANCHORS.door_yard;
ANCHORS["exit:store"]      = ANCHORS.door_store;
ANCHORS["threshold:yard"]  = ANCHORS.threshold;
ANCHORS["lookout:slit"]    = ANCHORS.lookout;
ANCHORS["contact:greet_l"] = ANCHORS.greet_l;
ANCHORS["contact:greet_r"] = ANCHORS.greet_r;
ANCHORS["camera:wide"]     = { x:.50, y:.50 };
ANCHORS["camera:door"]     = { x:.44, y:.55 };
ANCHORS["camera:bath"]     = { x:.66, y:.62 };
ANCHORS["camera:boards"]   = { x:.50, y:.78 };
ANCHORS["camera:hearth"]   = { x:.36, y:.64 };

const node = (state) => ({ preview:{ state, t:0.4, status:MODES[state].status } });

export const asset = {
  id:"location.farmhouse-feast",
  type:"LOCATION",
  name:"Farmhouse Feast",
  statusWord:"AT MEAT",
  scene:"OD-B24-S05",
  plan:"laertes-farmhouse",
  adjacentTo:"location.laertess-orchard",

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  zones:{
    walkable:        { x0:.30, y0:.55, x1:.72, y1:.98 },
    "lane:door":     { x0:.36, y0:.54, x1:.55, y1:.98 },
    "bay:bath":      { x0:.62, y0:.58, x1:.86, y1:.76 },
    "side:hearth":   { x0:.30, y0:.60, x1:.44, y1:.76 },
    "boards:table":  { x0:.30, y0:.72, x1:.74, y1:.96 },
    "wall:arms":     { x0:.28, y0:.30, x1:.72, y1:.54 },
    "doorway:mouth": { x0:.38, y0:.52, x1:.50, y1:.58 },
    "post:lookout":  { x0:.55, y0:.53, x1:.66, y1:.60 },
  },
  /* the house is ONE room; `state` is the channel that carries the scene. */
  states:{
    initial:"table",
    nodes:{ bath:node("bath"), dressing:node("dressing"), table:node("table"),
            arming:node("arming"), lookout:node("lookout"), bare:node("bare") },
    edges:[["bath","dressing"],["dressing","table"],["table","arming"],
           ["arming","lookout"],["lookout","arming"],["table","bath"],
           ["bare","bath"],["bare","table"]],
  },
  channels:["state","reveal","camera","light","fire","steam","t"],

  preview:()=>({ state:"table", t:0.4, status:"AT MEAT", progress:.24 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones, plan:farmhouse }; },
};
export default asset;
