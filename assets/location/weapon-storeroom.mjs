/* location.weapon-storeroom — THE ARMS STORE OF ODYSSEUS. One room, five states.
   ADDITIVE, Book XIX (OD-B19-S01). Modifies nothing; shadows nothing.

   WHY THIS FILE EXISTS. This is the room on the far side of the hall's postern:
   `location.megaron-hall` already paints that opening on its left wall and puts
   two steps DOWN through it (station `storeroom`). Everything the plot does with
   arms happens in here and nowhere else —
     XIX.1–33   father and son carry every spear, shield and helmet OUT of the
                hall by night and stow them here; the door is pulled to.
     XXI.5–62   Penelope climbs to it with the crooked key, draws the thong,
                shoots the bolt back, and lifts down the bow of Iphitus and the
                twelve axes.
     XXII.126–200  Melanthius gets in twice: down the passage while the door
                stands open, then — when it is shut on him — up through the
                ORSOTHYRE, the high loophole under the eaves, which is why this
                room is built with a concealed access and foot-notches under it.
   So the atlas gets ONE arms store with a STATE channel, the same discipline
   megaron-hall uses, rather than a fresh look-alike room per book.

   NOT HAND-PLACED. Every fixture is projected from the local plan below through
   the identical depth law the hall uses (engine/blocking.mjs `project()`), so a
   figure blocked at `door` stands on the sill painted here and the aisle painted
   here is the aisle they walk. The plan is exported for scenes to block through.

   STATES (state.state, default "sealed") — each changes what is DRAWN:
     sealed   door shut and thonged, loophole shuttered, the room's own old arms
     open     leaves swung in, daylight on the steps, the bow down off its peg (XXI)
     stocked  the hall's arms just carried in and heaped, racks full (XIX)
     raided   loophole open, plank down from it, pegs stripped, chest lids up (XXII)
     barred   door shut from the hall side, loophole still open — the trap (XXII)

   SOLID tone + hard contour only; the engine dotify pass supplies the halftone.
   Light planes, dark accents — the room must read as a pale vault with iron in
   it, never as one black mass. NO characters baked in.
   Verify: node harness/render.mjs assets/location/weapon-storeroom.mjs --state raided */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";
import { makePlan } from "../../engine/blocking.mjs";

/* ---- THE PLAN ------------------------------------------------------------
   x 0..1 left..right, z 0..1 far..near. Exported so scenes block through it:
     import { storeroomPlan } from "../assets/location/weapon-storeroom.mjs";  */
export const storeroomPlan = makePlan({
  id:"weapon-storeroom",
  name:"The Weapon Storeroom",
  notes:"Reached from megaron.postern; the hall floor is two steps ABOVE this "+
        "one, so `door` is at the head of the flight and `step_foot` at its "+
        "bottom. `loophole_floor` is where a body lands coming in by the high way.",
  stations:{
    door:          { x:.50, z:.12 },   // the stout door back into the hall passage
    step_foot:     { x:.50, z:.22 },   // bottom of the three steps
    aisle_far:     { x:.50, z:.34 },
    aisle_mid:     { x:.50, z:.56 },
    aisle_near:    { x:.50, z:.86 },
    rack_l:        { x:.19, z:.48 },   // standing at the left spear rack
    rack_r:        { x:.81, z:.48 },
    bow_peg:       { x:.84, z:.18 },   // the bow of Iphitus, in its case, on the wall
    axe_crate:     { x:.31, z:.68 },   // the twelve axes, helve-up in their crate
    chest_l:       { x:.19, z:.92 },
    chest_r:       { x:.81, z:.86 },
    loophole_floor:{ x:.26, z:.26 },   // the floor under the orsothyre — Melanthius lands here
    corner_dark:   { x:.13, z:.26 },
    lamp_stand:    { x:.68, z:.42 },   // where the golden lamp is set down (XIX)
    // CONTACT PAIR — two bodies that touch must not resolve to one point.
    centre_l:      { x:.43, z:.66 },
    centre_r:      { x:.57, z:.66 },
  },
  fixtures:[
    { id:"rack_left",  kind:"set_piece", at:"rack_l", span:[.30,.78] },
    { id:"rack_right", kind:"set_piece", at:"rack_r", span:[.26,.74] },
    { id:"orsothyre",  kind:"threshold", at:"loophole_floor" },
    { id:"axe_line",   kind:"prop",      at:"axe_crate", count:12 },
  ],
});

/* ---- the projection, unclamped -------------------------------------------
   project() clamps z to [0.08,1] because a FIGURE never stands outside the
   room. The SHELL has to run past the near clip and up to the joists, so it
   uses the identical formula un-clamped. Same law, wider domain. */
const SPREAD = z => 0.42 + 0.58 * z;
const px = (x, z) => 0.5 + (x - 0.5) * SPREAD(z);
const py = z => 0.50 + 0.46 * Math.pow(z, 1.08);
const HORIZON = 0.50;

const params = {
  plan:"weapon-storeroom",
  roofRise:0.21,     // low ceiling — this is a cellar off the hall, not a hall
  roofRake:0.30,
  joists:7,
  aisleHalf:0.115,   // half-width of the carrying aisle, in PLAN x
  doorHalf:0.155,
  doorHeight:0.27,
  steps:3,           // the flight down from the hall
  rackSpears:6,      // per wall
  axes:12,
  /* the orsothyre, high in the FAR wall left of the door — expressed as
     fractions of that wall so it moves with the shell and never drifts. */
  loophole:{ u:0.155, w:0.20, top:0.09, h:0.30 },
  rackLo:0.05, rackMid:0.23, rackHi:0.35,          // rack heights, in unit height
  rackX:0.06,                                      // rack front face, in PLAN x off the wall
  /* the rack runs, in plan z. The LEFT wall is deliberately in two pieces:
     the gap between them is bare wall under the loophole — which is the only
     reason a man can come down it into this room. */
  runs:{ 0:[[.28,.44],[.56,.74]], 1:[[.24,.42],[.52,.70]] },
};
const ceilY = z => HORIZON - (params.roofRise + params.roofRake * Math.pow(z, 1.08));

/* ---- the state channel ---------------------------------------------------
   `lift` is one lighting offset over the whole room; the rest changes geometry. */
const MODES = {
  sealed: { lift:0, status:"LOCKED",  door:"shut", vent:"shut", racks:"old",     heap:false, bow:"cased", lids:"down", plank:false, lamp:false },
  open:   { lift:0, status:"UNBOLTED",door:"open", vent:"shut", racks:"old",     heap:false, bow:"down",  lids:"up",   plank:false, lamp:false },
  stocked:{ lift:0, status:"STOWED",  door:"ajar", vent:"shut", racks:"full",    heap:true,  bow:"cased", lids:"down", plank:false, lamp:true  },
  raided: { lift:1, status:"BREACHED",door:"shut", vent:"open", racks:"stripped",heap:false, bow:"gone",  lids:"up",   plank:true,  lamp:false },
  barred: { lift:1, status:"TRAPPED", door:"barred",vent:"open",racks:"stripped",heap:false, bow:"gone",  lids:"up",   plank:true,  lamp:false },
};

const LAYERS = ["shell","ceiling","farwall","door","steps","racks","loophole",
                "stores","aisle","foreground"];

function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const key  = st && (st.state || st.mode);
  const mode = MODES[key] ? key : "sealed";
  const M    = MODES[mode];
  const T    = (st && st.t) || 0;
  const layers = (st && st.layers) || LAYERS;
  const has = l => layers.includes(l);

  const tn = l => inkLevel(clamp(Math.round(l + M.lift), 0, 7));
  const S  = l => toneSolid(tn(l));
  const X  = (x, z) => px(x, z) * W;
  const Y  = z => py(z) * H;
  const Cy = z => ceilY(z) * H;
  const SZ = z => 0.60 + 0.50 * clamp(z, 0.08, 1);
  /* the ONLY way a station becomes pixels */
  const A  = n => { const p = storeroomPlan.at(n); return { x:p.x*W, y:p.y*H, d:p.d, s:0.60+0.50*p.d }; };
  const R  = rnd(19222);

  /* a rectangle of FLOOR in plan space, optionally lifted off it */
  const quad = (x0,x1,z0,z1,h0=0,h1=0) => () => {
    const P = [[x0,z0,h0],[x1,z0,h0],[x1,z1,h1],[x0,z1,h1]];
    P.forEach(([x,z,h],i)=>{ const XX=X(x,z), YY=Y(z)-h*SZ(z)*H;
      if(i===0) g.moveTo(XX,YY); else g.lineTo(XX,YY); });
    g.closePath();
  };
  /* sampled wall/ceiling junction — y is non-linear in z, so it is a curve */
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
  /* a panel ON a side wall: side 0|1, depth z0..z1, from hLo to hHi in unit height */
  const wallPanel = (side, z0, z1, hLo, hHi, level, lw=3) => {
    pen.paint(()=>{
      g.moveTo(X(side,z0), Y(z0)-hLo*SZ(z0)*H);
      g.lineTo(X(side,z1), Y(z1)-hLo*SZ(z1)*H);
      g.lineTo(X(side,z1), Y(z1)-hHi*SZ(z1)*H);
      g.lineTo(X(side,z0), Y(z0)-hHi*SZ(z0)*H);
      g.closePath();
    }, S(level), lw);
  };
  /* a point on a side wall */
  const WP = (side, z, h) => ({ x:X(side,z), y:Y(z)-h*SZ(z)*H });

  /* ================= SHELL — side walls, floor, far wall ================== */
  if (has("shell")){
    g.fillStyle = tn(2); g.fillRect(0,0,W,H);                       // side walls
    // FAR WALL — the plane the door is cut into
    pen.paint(()=>{ g.rect(X(0,.08), Cy(.08), X(1,.08)-X(0,.08), Y(.08)-Cy(.08)); }, S(2), 5);
    // FLOOR — sampled junctions, so wall and floor meet exactly on the law
    pen.paint(()=>{ g.moveTo(X(0,.08), Y(.08)); rail(0,py,.08,1.30);
      g.lineTo(X(1,1.30), Y(1.30)); rail(1,py,1.30,.08); g.closePath(); }, S(1), 5);
    // side-wall courses: verticals at fixed depths, faint. No horizontal runs.
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.18;
    for(const sd of [0,1]) for(const z of [.18,.30,.46,.66,.90]){
      g.beginPath(); g.moveTo(X(sd,z), Y(z)); g.lineTo(X(sd,z), Math.max(0, Cy(z))); g.stroke(); }
    // far-wall courses — deliberately short, broken either side of the door
    for(let j=1;j<=3;j++){ const y=lerp(Cy(.08),Y(.08),j/4);
      g.beginPath(); g.moveTo(X(0,.08),y); g.lineTo(X(.30,.08),y);
                     g.moveTo(X(.70,.08),y); g.lineTo(X(1,.08),y); g.stroke(); }
    g.globalAlpha=1;
  }

  /* ================= CEILING — joists in perspective, one split tie-beam ===
     The joists RUN AWAY from the camera on purpose: a store this low would
     stripe the frame if its timbers were painted across it. */
  if (has("ceiling")){
    pen.paint(()=>{ g.moveTo(X(0,.08), Cy(.08)); g.lineTo(X(1,.08),Cy(.08));
      rail(1,ceilY,.08,1.0); rail(0,ceilY,1.0,.08); g.closePath(); }, S(3), 5);
    g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.36;
    for(let i=1;i<params.joists;i++){ const xp=i/params.joists;
      g.beginPath(); g.moveTo(X(xp,.08),Cy(.08)); g.lineTo(X(xp,.82),Cy(.82)); g.stroke(); }
    g.globalAlpha=1;
    // ONE tie-beam, in two pieces with the aisle open between them
    for(const [xa,xb] of [[0,.38],[.62,1]]){
      const z=.30, k=H*0.016*SZ(z);
      pen.paint(()=>{ g.moveTo(X(xa,z),Cy(z)); g.lineTo(X(xb,z),Cy(z));
        g.lineTo(X(xb,z),Cy(z)+k); g.lineTo(X(xa,z),Cy(z)+k); g.closePath(); }, S(4), 3);
    }
  }

  /* ================= THE DOOR back into the hall passage ==================
     Set high in the far wall: the hall floor is above this one, so the sill is
     at the head of the steps and light coming in falls DOWN into the room. */
  if (has("door")){
    const D = A("door"), lift = 0.075;                        // sill above this floor
    const dw = (px(.5+params.doorHalf,.10) - px(.5-params.doorHalf,.10)) * W;
    const dh = params.doorHeight * D.s * H;
    const yBase = D.y - lift*D.s*H, x0 = D.x - dw/2, yTop = yBase - dh;
    // jambs + lintel — a short, framed opening, not a band across the wall
    pen.paint(()=>{ g.rect(x0-W*0.028, yTop-H*0.028, dw+W*0.056, dh+H*0.028); }, S(4), 5);
    const openTone = M.door==="open" ? inkLevel(0) : M.door==="ajar" ? inkLevel(1) : tn(3);
    pen.paint(()=>{ g.rect(x0, yTop, dw, dh); }, toneSolid(openTone), 5);
    if (M.door!=="open"){
      const shut = M.door==="ajar" ? 0.70 : 1.0;
      for(const sgn of [-1,1]){
        const lw2 = (dw/2)*shut, lx = sgn<0 ? x0 : x0+dw-lw2;
        pen.paint(()=>{ g.rect(lx, yTop, lw2, dh); }, S(3), 4);
        g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.55;     // planks, vertical
        for(let j=1;j<=2;j++){ const xx=lx+lw2*(j/3);
          g.beginPath(); g.moveTo(xx,yTop); g.lineTo(xx,yTop+dh); g.stroke(); }
        g.globalAlpha=1;
        // the bronze ring and, on the left leaf, the thong-and-hook of XXI.46
        pen.paint(()=>{ g.arc(sgn<0? lx+lw2*0.82 : lx+lw2*0.18, yTop+dh*0.54, W*0.009,0,7); }, S(6), 3);
      }
      if (M.door!=="ajar"){                                      // the strap hinges
        for(const f of [0.22,0.78]) pen.paint(()=>{
          g.rect(x0+dw*0.06, yTop+dh*f-H*0.006, dw*0.26, H*0.013); }, S(5), 2);
      }
    }
    if (M.door==="barred"){                                      // XXII: shut on him
      pen.paint(()=>{ g.rect(x0-W*0.036, yTop+dh*0.44, dw+W*0.072, H*0.024); }, S(6), 5);
      for(const sgn of [-1,1]) pen.paint(()=>{
        g.rect(D.x+sgn*(dw/2+W*0.030)-W*0.011, yTop+dh*0.38, W*0.022, H*0.048); }, S(5), 4);
    }
    if (M.door==="open" || M.door==="ajar"){                     // light spilling down the steps
      const spill = M.door==="open" ? 0 : 1;
      pen.paint(quad(.36,.64,.12,.30), toneSolid(inkLevel(spill)), 2);
    }
  }

  /* ================= THE THREE STEPS DOWN ================================= */
  if (has("steps")){
    const n = params.steps;
    for(let i=0;i<n;i++){
      const u0=i/n, u1=(i+1)/n;
      const z0=lerp(.12,.23,u0), z1=lerp(.12,.23,u1);
      const h =0.075*(1-u1);                                     // descending to the floor
      const hw=0.150 + 0.016*i;                                  // the flight widens as it falls
      pen.paint(quad(.5-hw,.5+hw,z0,z1,h,h), S(1), 4);           // tread — light, it takes the light
      pen.paint(()=>{ const xa=X(.5-hw,z1), xb=X(.5+hw,z1), yb=Y(z1), yt=yb-h*SZ(z1)*H;
        g.moveTo(xa,yt); g.lineTo(xb,yt); g.lineTo(xb,yb); g.lineTo(xa,yb); g.closePath(); }, S(3), 3);
    }
    // the two stringers, so the flight reads as a flight and not as a bench
    for(const sgn of [-1,1]){
      pen.paint(()=>{ const xa=X(.5+sgn*0.150,.12), xb=X(.5+sgn*0.198,.23);
        g.moveTo(xa, Y(.12)-0.075*SZ(.12)*H); g.lineTo(xb, Y(.23));
        g.lineTo(xb+sgn*W*0.016, Y(.23)); g.lineTo(xa+sgn*W*0.014, Y(.12)-0.075*SZ(.12)*H);
        g.closePath(); }, S(5), 4);
    }
  }

  /* ================= THE RACKS — both side walls, in perspective ===========
     Spear butts in a floor trough, shafts leaning to an upper rail, shields and
     helmets on pegs above. The left run BREAKS at the loophole; that gap is the
     reason the orsothyre is reachable at all. */
  if (has("racks")){
    const hLo=params.rackLo, hMid=params.rackMid, hHi=params.rackHi;
    const stripped = M.racks==="stripped";
    const dense = M.racks==="full";
    for(const side of [0,1]){
      const dir = side ? -1 : 1;
      const xw = side ? 1-params.rackX : params.rackX;   // the rack's front face
      for(const [z0,z1] of params.runs[side]){
        const span = z1-z0;
        // the butt trough on the floor and the rail above it. Both rake away
        // with the room: nothing here is a horizontal bar across the frame.
        wallPanel(xw, z0, z1, 0, hLo, 4, 4);                    // the trough, a low kerb
        wallPanel(xw, z0, z1, hMid, hMid+0.030, 4, 4);          // the rail
        for(const ze of [z0,z1]){                               // the two uprights that carry it
          const a=WP(xw,ze,0), b=WP(xw,ze,hMid+0.030);
          pen.paint(()=>{ g.moveTo(a.x-W*0.009, a.y); g.lineTo(a.x+W*0.009, a.y);
            g.lineTo(b.x+W*0.009, b.y); g.lineTo(b.x-W*0.009, b.y); g.closePath(); }, S(3), 4);
        }
        const n = 3;
        for(let i=0;i<n;i++){
          const u=(i+0.5)/n, z=lerp(z0,z1,u);
          if (stripped){                              // bare pegs. Nothing hangs.
            const peg = WP(xw, z, hMid+0.030);
            pen.ink(()=>{ g.moveTo(peg.x, peg.y); g.lineTo(peg.x+dir*W*0.024, peg.y-H*0.010); }, 5);
            continue;
          }
          // the shaft: butt in the trough, leaning back over the rail
          const foot = WP(xw, z, hLo), head = WP(xw-dir*0.030, z, hHi+0.060);
          pen.ink(()=>{ g.moveTo(foot.x, foot.y); g.lineTo(head.x, head.y); }, 3);
          g.fillStyle=tn(6); g.beginPath();                     // the head — a dark accent
          g.moveTo(head.x, head.y-H*0.026); g.lineTo(head.x-W*0.008, head.y-H*0.002);
          g.lineTo(head.x+W*0.008, head.y-H*0.002); g.closePath(); g.fill();
          if (dense){                                           // XIX: a second rank in front
            const f2=WP(xw+dir*0.036,z,0.02), h2=WP(xw+dir*0.006,z,hHi+0.030);
            pen.ink(()=>{ g.moveTo(f2.x, f2.y); g.lineTo(h2.x, h2.y); }, 3);
          }
        }
        // one shield per run, hung on the WALL above: light disc, one dark boss
        if (!(stripped && span>0.16)){                          // XXII: twelve carried off
          const z = lerp(z0, z1, 0.34), p = WP(side, z, hHi+0.070), rr = W*0.038*SZ(z);
          pen.paint(()=>{ g.ellipse(p.x+dir*W*0.036, p.y, rr, rr*1.04, 0,0,7); }, S(2), 5);
          pen.paint(()=>{ g.ellipse(p.x+dir*W*0.036, p.y, rr*0.60, rr*0.62, 0,0,7); }, S(3), 3);
          pen.paint(()=>{ g.ellipse(p.x+dir*W*0.036, p.y, rr*0.22, rr*0.23, 0,0,7); }, S(7), 3);
        }
        // a helmet standing on the rail — small blocky dome with a crest stem
        if (!stripped && span>0.15){
          const z=lerp(z0,z1,0.86), p=WP(xw,z,hMid+0.030), rr=W*0.022*SZ(z);
          pen.paint(()=>{ g.moveTo(p.x-rr, p.y); g.lineTo(p.x-rr, p.y-rr*0.60);
            g.quadraticCurveTo(p.x, p.y-rr*2.3, p.x+rr, p.y-rr*0.60);
            g.lineTo(p.x+rr, p.y); g.closePath(); }, S(3), 4);
          pen.ink(()=>{ g.moveTo(p.x, p.y-rr*2.0); g.lineTo(p.x, p.y-rr*3.2); }, 5);
        }
      }
    }
  }

  /* ================= THE ORSOTHYRE — the concealed high access ============
     XXII.126–143. A loophole under the joists in the LEFT wall, with cut
     foot-notches below it. Shuttered it is a pale panel you would not look at
     twice; open it is a hole with the daylight of the yard behind it. */
  if (has("loophole")){
    const L = params.loophole;
    const opn = M.vent==="open";
    const fx0=X(0,.08), fx1=X(1,.08), fyT=Cy(.08), fyB=Y(.08);
    const FW=fx1-fx0, FH=fyB-fyT;
    const cx2 = fx0 + FW*L.u, wd = FW*L.w, ht = FH*L.h, yt = fyT + FH*L.top;
    const pad = FW*0.030;
    // dressed stone surround, then the deep reveal, then what fills it
    pen.paint(()=>{ g.rect(cx2-wd/2-pad, yt-pad, wd+pad*2, ht+pad*2); }, S(4), 5);
    pen.paint(()=>{ g.rect(cx2-wd/2, yt, wd, ht); }, S(opn ? 7 : 2), 5);
    if (!opn){                                            // the shutter board, cross-braced
      pen.ink(()=>{ g.moveTo(cx2-wd*0.42, yt+ht*0.08); g.lineTo(cx2+wd*0.42, yt+ht*0.92); }, 4);
      pen.ink(()=>{ g.moveTo(cx2-wd*0.42, yt+ht*0.92); g.lineTo(cx2+wd*0.42, yt+ht*0.08); }, 4);
      pen.paint(()=>{ g.arc(cx2, yt+ht*0.50, wd*0.10, 0, 7); }, S(6), 3);
    } else {
      // daylight of the yard beyond — a hard pale slot inside the black reveal
      pen.paint(()=>{ g.rect(cx2-wd*0.30, yt+ht*0.16, wd*0.60, ht*0.62); }, toneSolid(inkLevel(0)), 4);
    }
    // the foot-notches cut in the wall below it — this is HOW a man gets up
    for(let i=0;i<4;i++){
      const ny = fyB - FH*0.10 - i*FH*0.155, nx = cx2 + (i%2 ? wd*0.16 : -wd*0.16);
      pen.paint(()=>{ g.rect(nx-wd*0.24, ny-FH*0.045, wd*0.48, FH*0.048); }, S(4), 4);
    }
    if (M.plank){                                         // the plank he brings down after him
      const foot = A("loophole_floor");
      pen.paint(()=>{ g.moveTo(cx2-wd*0.16, yt+ht*0.94); g.lineTo(cx2+wd*0.14, yt+ht*0.94);
        g.lineTo(foot.x+W*0.030, foot.y); g.lineTo(foot.x-W*0.006, foot.y); g.closePath(); }, S(4), 4);
    }
  }

  /* ================= THE STORES — bow case, crate of axes, chests ========= */
  if (has("stores")){
    // THE BOW OF IPHITUS, on the right wall by the door, in its case
    const bz = 0.18, bp = WP(1, bz, 0.27);
    if (M.bow!=="gone"){
      const hgt = H*0.135*SZ(bz), wid = W*0.026*SZ(bz);
      pen.paint(()=>{ g.rect(bp.x-wid*2.0, bp.y-hgt, wid*1.6, hgt); }, S(3), 4);   // the case
      pen.ink(()=>{ g.moveTo(bp.x-wid*2.0, bp.y-hgt*0.66); g.lineTo(bp.x-wid*0.4, bp.y-hgt*0.66); }, 3);
      pen.paint(()=>{ g.rect(bp.x-wid*1.6, bp.y-hgt-H*0.020, wid*0.8, H*0.022); }, S(6), 3); // the peg
      if (M.bow==="down"){                                                        // XXI: lifted out
        const c = A("chest_r");
        g.save(); g.translate(c.x-W*0.030, c.y-H*0.120); g.rotate(-0.26);
        pen.ink(()=>{ g.moveTo(0,-H*0.078); g.bezierCurveTo(W*0.052,-H*0.034, W*0.052,H*0.034, 0,H*0.078); }, 7);
        pen.ink(()=>{ g.moveTo(0,-H*0.078); g.lineTo(0,H*0.078); }, 3);
        g.restore();
      }
    } else {
      pen.ink(()=>{ g.moveTo(bp.x-W*0.034, bp.y-H*0.024); g.lineTo(bp.x-W*0.014, bp.y-H*0.030); }, 5);
    }

    // THE TWELVE AXES — helve-up in their crate, two ranks of six, countable
    const c = storeroomPlan.stations.axe_crate;
    planBox(c.x-0.100, c.x+0.100, c.z-0.052, c.z+0.052, 0.070, 2, 4);
    const N = params.axes, half = N/2;
    for(let rank=0; rank<2; rank++){
      const z = c.z - 0.026 + rank*0.040;
      for(let i=0;i<half;i++){
        const u=(i+0.5)/half, x=c.x-0.086+0.172*u + (rank?0.014:-0.014);
        const bx=X(x,z), by=Y(z)-0.070*SZ(z)*H, k=SZ(z);
        const hw=W*0.0070*k, hh=H*0.082*k;
        pen.paint(()=>{ g.rect(bx-hw, by-hh, hw*2, hh); }, S(rank?2:3), 2);        // the helve
        pen.paint(()=>{ g.rect(bx-hw*1.6, by-hh-H*0.015*k, hw*3.2, H*0.015*k); }, S(5), 2); // the head
      }
    }

    // TWO ARMS CHESTS, lids down or thrown up
    for(const nm of ["chest_l","chest_r"]){
      const s = storeroomPlan.stations[nm];
      planBox(s.x-0.090, s.x+0.090, s.z-0.055, s.z+0.055, 0.090, 2, 3);
      const hh = 0.090*SZ(s.z)*H;
      // iron straps on the near face — vertical, so nothing bands the frame
      for(const q of [-0.55,0.55]) pen.paint(()=>{
        g.rect(X(s.x+q*0.090, s.z+0.055)-W*0.007, Y(s.z+0.055)-hh, W*0.014, hh); }, S(5), 2);
      pen.paint(()=>{ g.rect(X(s.x,s.z+0.055)-W*0.012, Y(s.z+0.055)-hh*0.62, W*0.024, H*0.026); }, S(6), 2);
      if (M.lids==="up"){                                                          // lid thrown back
        pen.paint(()=>{ const zb=s.z-0.055, k=SZ(zb);
          g.moveTo(X(s.x-0.090,zb), Y(zb)-0.090*k*H);
          g.lineTo(X(s.x+0.090,zb), Y(zb)-0.090*k*H);
          g.lineTo(X(s.x+0.078,zb), Y(zb)-0.215*k*H);
          g.lineTo(X(s.x-0.078,zb), Y(zb)-0.215*k*H); g.closePath(); }, S(3), 4);
      }
    }
  }

  /* ================= THE AISLE — the carrying lane to the steps ===========
     Always drawn. This is the ground an armful of spears is walked down. */
  if (has("aisle")){
    const ah = params.aisleHalf;
    pen.paint(quad(.5-ah, .5+ah, .23, 1.30), toneSolid(inkLevel(0)), 3);   // the swept lane
    pen.ink(()=>{ g.moveTo(X(.5-ah,.23),Y(.23)); g.lineTo(X(.5-ah,1.30),Y(1.30));
                  g.moveTo(X(.5+ah,.23),Y(.23)); g.lineTo(X(.5+ah,1.30),Y(1.30)); }, 3);
    // flagstones: BROKEN courses only — a full-width rule would stripe the room
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=.24;
    for(const z of [.34,.50,.72,.98]){
      g.beginPath(); g.moveTo(X(.10,z),Y(z)); g.lineTo(X(.38,z),Y(z));
                     g.moveTo(X(.62,z),Y(z)); g.lineTo(X(.90,z),Y(z)); g.stroke(); }
    g.globalAlpha=1;
  }

  /* ================= FOREGROUND — the heap of XIX, the lamp, the wreck ==== */
  if (has("foreground")){
    if (M.heap){
      // XIX.31: what father and son carried in, set down where it landed
      const hz=0.46;
      for(let i=0;i<4;i++){                                    // shields leaning on each other
        const x=0.205+i*0.026, z=hz+i*0.013, p={x:X(x,z),y:Y(z)}, rr=W*0.034*SZ(z);
        pen.paint(()=>{ g.ellipse(p.x, p.y-rr*0.86, rr*0.80, rr, 0.16, 0, 7); }, S(2), 5);
        pen.paint(()=>{ g.ellipse(p.x, p.y-rr*0.86, rr*0.24, rr*0.28, 0.16, 0, 7); }, S(5), 3);
      }
      for(let i=0;i<5;i++){                                    // spears bundled against the wall
        const z=0.42+i*0.012, a=WP(1,z,0.03), b=WP(1,z,0.52);
        pen.ink(()=>{ g.moveTo(a.x-W*0.060-i*W*0.008, a.y); g.lineTo(b.x-W*0.012, b.y); }, 3);
      }
    }
    if (M.lamp){                                               // the stand Athena's lamp is set on
      const p = A("lamp_stand");
      pen.paint(()=>{ g.rect(p.x-W*0.010, p.y-H*0.085, W*0.020, H*0.085); }, S(4), 3);
      pen.paint(()=>{ g.ellipse(p.x, p.y-H*0.090, W*0.030, H*0.011, 0,0,7); }, S(3), 4);
      pen.paint(()=>{ g.ellipse(p.x, p.y, W*0.026, H*0.010, 0,0,7); }, S(4), 3);
      g.strokeStyle=INK; g.lineWidth=3; g.globalAlpha=.24;     // the light it throws, as rays
      for(let i=0;i<5;i++){ const a=(i-2)*0.42 - Math.PI/2 + 0.05*Math.sin(T);
        g.beginPath(); g.moveTo(p.x+Math.cos(a)*W*0.030, p.y-H*0.096+Math.sin(a)*H*0.014);
        g.lineTo(p.x+Math.cos(a)*W*0.090, p.y-H*0.096+Math.sin(a)*H*0.044); g.stroke(); }
      g.globalAlpha=1;
    }
    if (M.racks==="stripped"){
      // XXII: what he dropped on the way out — a shield on its face, a helmet rolled
      const f = A("loophole_floor");
      pen.paint(()=>{ g.ellipse(f.x+W*0.070, f.y+H*0.030, W*0.042, H*0.017, 0.1,0,7); }, S(3), 5);
      pen.paint(()=>{ g.ellipse(f.x+W*0.070, f.y+H*0.030, W*0.013, H*0.006, 0.1,0,7); }, S(6), 3);
      const hx=X(.62,.94), hy=Y(.94);
      pen.paint(()=>{ g.moveTo(hx-W*0.026, hy); g.lineTo(hx-W*0.026, hy-H*0.014);
        g.quadraticCurveTo(hx, hy-H*0.062, hx+W*0.026, hy-H*0.014);
        g.lineTo(hx+W*0.026, hy); g.closePath(); }, S(3), 5);
      for(let i=0;i<6;i++){                                    // scuffed dust across the floor
        const sx=X(0.16+R()*0.42, 0.62+R()*0.36), sy=Y(0.62+R()*0.36);
        pen.paint(()=>{ g.ellipse(sx, sy, W*0.016, H*0.005, 0,0,7); }, S(2), 2);
      }
    }
  }
}

/* ---- anchors are DERIVED from the plan, never authored ------------------- */
const ANCHORS = {};
for (const n of storeroomPlan.names()){
  const p = storeroomPlan.at(n);
  ANCHORS[n] = { x:+p.x.toFixed(4), y:+p.y.toFixed(4) };
}
ANCHORS["entrance:door"]      = ANCHORS.door;
ANCHORS["entrance:loophole"]  = ANCHORS.loophole_floor;      // the concealed access
ANCHORS["exit:door"]          = ANCHORS.door;
ANCHORS["threshold:steps"]    = ANCHORS.step_foot;
ANCHORS["store:racks-left"]   = ANCHORS.rack_l;
ANCHORS["store:racks-right"]  = ANCHORS.rack_r;
ANCHORS["store:bow"]          = ANCHORS.bow_peg;
ANCHORS["store:axes"]         = ANCHORS.axe_crate;
ANCHORS["camera:wide"]        = { x:.50, y:.50 };
ANCHORS["camera:door"]        = { x:.50, y:.54 };
ANCHORS["camera:loophole"]    = { x:.22, y:.62 };
ANCHORS["camera:aisle"]       = { x:.50, y:.72 };

const node = state => ({ preview:{ state, t:0.4, status:MODES[state].status } });

export const asset = {
  id:"location.weapon-storeroom",
  type:"LOCATION",
  name:"Weapon Storeroom",
  statusWord:"LOCKED",
  scene:"OD-B19-S01",
  plan:"weapon-storeroom",
  adjoins:{ "location.megaron-hall":{ via:"postern", station:"storeroom" } },

  params,
  layers:LAYERS,
  anchors:ANCHORS,
  zones:{
    walkable:        { x0:.14, y0:.55, x1:.86, y1:.98 },
    "aisle:carry":   { x0:.42, y0:.56, x1:.58, y1:.98 },
    "steps":         { x0:.43, y0:.55, x1:.57, y1:.61 },
    "rack:left":     { x0:.16, y0:.62, x1:.30, y1:.86 },
    "rack:right":    { x0:.70, y0:.62, x1:.84, y1:.86 },
    "loophole:below":{ x0:.29, y0:.55, x1:.43, y1:.66 },
    "corner:dark":   { x0:.10, y0:.56, x1:.26, y1:.66 },
  },

  /* ONE room. The channel is `state`; nothing here is a separate location. */
  states:{
    initial:"sealed",
    nodes:{
      sealed: node("sealed"),
      open:   node("open"),
      stocked:node("stocked"),
      raided: node("raided"),
      barred: node("barred"),
    },
    edges:[["sealed","stocked"],["stocked","sealed"],["sealed","open"],
           ["open","sealed"],["open","stocked"],["sealed","raided"],
           ["open","raided"],["raided","barred"],["barred","raided"]],
  },
  channels:["state","reveal","camera","light","door","t"],

  preview:()=>({ state:"sealed", t:0.4, status:"LOCKED", progress:.24 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:ANCHORS, zones:asset.zones }; },
};
export default asset;
