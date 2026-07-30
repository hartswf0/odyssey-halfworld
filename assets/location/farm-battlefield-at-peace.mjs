/* location.farm-battlefield-at-peace — the open ground BELOW Laertes's steading,
   where the militia's charge meets the king's household and where, in the same
   minute, the last fight of the poem is stopped and converted into an oath.
   LOCATION asset: an EMPTY navigable set (no figures baked in — the grounded
   arms and the grave mounds are furniture, the same way a bier is furniture).
   Solid grays + hard contour into the offscreen ctx; the engine dotify pass
   supplies the halftone.

   THIS IS NOT THE ORCHARD. `location.laertess-orchard` is the worked farm — the
   yard, the rows, the labour plot — and its "muster" state is the picket at the
   yard mouth. This set is the ground OUTSIDE that: the steading sits small in
   the middle distance with the FARM GATE at its lip, and the whole lower two
   thirds of the frame is open combat terrain. The two sets share a horizon and a
   depth ladder so a scene can cut between them without the world changing size.

   THE SHAPE OF OD-B24-S09. The scene is one continuous conversion — charge, halt,
   separation, oath — so all four are authored into ONE ground as geometry and
   switched by state, never by redrawing the room:

     CHARGE LINES  — two surveyed lanes with chevrons: the militia's, entering
                     from the town road at the left lip, and the household's,
                     coming down out of the farm gate. They converge on the CLASH
                     BAND, a churned run broken into three pieces so it never
                     stripes the frame.
     THE FALLEN    — two low grave mounds drawn out of the lane, and a scatter of
                     dropped kit (shields on their faces, helms, a lying spear).
                     Furniture, not bodies: the set never bakes a figure.
     THE BOLT SCAR — the mark Zeus put before Athena's feet. A pale scoured disc
                     with a fused black centre and a star of cracks: the one
                     place on the field with full black in it, and the reason the
                     command is irresistible. Absent in "charge".
     SEPARATION    — two swept stands, people-side near left and household-side
                     right, each with its own broken kerb, its GROUNDED ARMS
                     (spears stacked in a tripod, shields on their rims) and a
                     CONTACT PAIR, plus a dashed DISPERSAL lane running off the
                     near left corner: the way home without more blood.
     THE OATH RING — near, centre, big: a swept disc inside a ring of set stones
                     with a low oath slab at its middle, its count cut as BARS
                     (numerals dissolve in the dot lattice) and a paired station
                     `meet:oath_l` / `meet:oath_r` so king and people swear at two
                     coordinates and not at one.

   ONE DEPTH LADDER. depthAtY() maps ground height to scale; every stamp — stack,
   shield, stone, mound, tree — is sized from its own y, so the far gate and the
   near oath ring agree about the size of the world.

   NOTHING SPANS THE FRAME. The far range is two separate humps stopped short of
   both edges; the orchard boundary is three runs cut at the gate; the clash band
   is three pieces; the terrace under the steading is two short steps; the
   horizon is a tone change, not a rule.

   LIGHT GROUND, DARK ACCENTS. A battlefield that renders as one black mass has
   no peace in it. The field is level 2, the swept zones level 1, and the only
   heavy ink is the gate mouth, the bolt scar, the shield bosses and the stacked
   spearheads.

   States: "charge" (lanes hot, no scar, arms still in hands — the last clash),
   "halt" (the bolt scar struck, kit dropped where it fell), "separation" (the
   two stands lit, arms grounded, the dispersal lane marked), "oath" (the ring
   struck in — the default), "peace" (lanes going back to grass, the field
   cleared to ring, mounds and stacks), "survey" (every zone and contact pair
   lit for previs), "bare" (the navigable terrain only).

   Serves OD-B24-S09. Atlas: combat terrain transitioning from charge lines and
   bodies to lowered weapons, separation, and oath circle. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const MODES = ["charge", "halt", "separation", "oath", "peace", "survey", "bare"];

const params = {
  horizon:0.300,      // sky / ground split as a fraction of H
  farmBase:0.452,     // ground line of the steading terrace
  gateX:0.404,        // the farm gate: the household's way onto the field
  wallU:0.470,        // ground line of the orchard boundary east of the gate
  hedges:5,           // field divisions converging on the steading
  zonesLit:false,     // stands + oath ring struck in as survey
};

/* ---------- THE ONE DEPTH LADDER ---------- */
const NEAR_Y  = 1.040;
const groundU = y => clamp((y - params.horizon) / (NEAR_Y - params.horizon), 0, 1);
const depthAtY = y => lerp(0.070, 1.000, Math.pow(groundU(y), 1.22));

/* ---------- the fixed geometry of the fight ---------- */
const CLASH = { x:0.486, y:0.706 };             // where the two lanes meet
const SCAR  = { x:0.508, y:0.768 };             // the bolt, before her feet
const OATH  = { x:0.500, y:0.928, r:0.112 };    // the ring, near and large
const STAND = {
  people:    { x:0.222, y:0.874, r:0.080 },     // the militia drawn off, town side
  household: { x:0.800, y:0.806, r:0.062 },     // the king's side, farm side
};

/* the lanes: polylines in asset space, each ending ON the clash point so the
   network is actually connected. `head` is where a scene puts the front rank. */
const LANES = {
  people:    [[-0.030,0.548],[0.126,0.598],[0.292,0.656],[0.470,0.702]],
  household: [[ 0.398,0.470],[0.418,0.534],[0.450,0.606],[0.478,0.688]],
  disperse:  [[ 0.436,0.744],[0.306,0.812],[0.156,0.886],[0.014,0.958]],
};
function lanePt(pts, t){
  const n = pts.length - 1, u = clamp(t,0,1)*n;
  const i = Math.min(Math.floor(u), n-1), s = u - i;
  return { x: lerp(pts[i][0], pts[i+1][0], s), y: lerp(pts[i][1], pts[i+1][1], s) };
}
function laneTan(pts, t){
  const a = lanePt(pts, clamp(t-0.02,0,1)), b = lanePt(pts, clamp(t+0.02,0,1));
  const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx,dy)||1;
  return { x:dx/n, y:dy/n };
}

/* the clash band: three churned pieces with real gaps between them */
const BAND = [
  { x0:0.150, x1:0.336, y:0.690 },
  { x0:0.404, x1:0.606, y:0.708 },
  { x0:0.668, x1:0.818, y:0.686 },
];
/* the fallen, drawn out of the lane: two mounds, furniture not figures */
const MOUNDS = [ { x:0.352, y:0.660 }, { x:0.706, y:0.648 } ];
/* kit dropped where it fell — the visible fact of "weapons lowered" */
const KIT = [
  { x:0.300, y:0.732, k:"shield" }, { x:0.398, y:0.762, k:"helm"  },
  { x:0.588, y:0.722, k:"shield" }, { x:0.660, y:0.752, k:"spear" },
  { x:0.226, y:0.702, k:"helm"   }, { x:0.726, y:0.694, k:"shield" },
];
/* grounded arms: where each side stacks what it was carrying */
const STACKS = [ { x:0.148, y:0.822 }, { x:0.868, y:0.778 }, { x:0.644, y:0.872 } ];

/* ---------- anchors: read off the lanes and the ladder, never hand-tuned ---- */
const nz = p => ({ x:+clamp(p.x,0,1).toFixed(3), y:+clamp(p.y,0,1).toFixed(3) });
const ln = (k,t) => nz(lanePt(LANES[k], t));
export const anchors = {
  "field:centre":          nz(CLASH),
  "field:near":            { x:0.500, y:0.996 },
  "clash:line":            nz(CLASH),
  "line:people":           { x:0.318, y:0.694 },
  "line:household":        { x:0.614, y:0.696 },
  "charge:people-head":    ln("people", 0.62),
  "charge:people-rear":    ln("people", 0.08),
  "charge:household-head": ln("household", 0.66),
  "charge:household-rear": ln("household", 0.06),
  "mark:bolt-scar":        nz(SCAR),
  "halt:before-scar":      { x:SCAR.x, y:+(SCAR.y + 0.052).toFixed(3) },
  "meet:parley_l":         { x:0.428, y:0.748 },
  "meet:parley_r":         { x:0.582, y:0.734 },
  "stand:people":          { x:STAND.people.x, y:STAND.people.y },
  "meet:people_l":         { x:+(STAND.people.x - 0.056).toFixed(3), y:+(STAND.people.y + 0.008).toFixed(3) },
  "meet:people_r":         { x:+(STAND.people.x + 0.056).toFixed(3), y:+(STAND.people.y - 0.006).toFixed(3) },
  "stand:household":       { x:STAND.household.x, y:STAND.household.y },
  "meet:household_l":      { x:+(STAND.household.x - 0.044).toFixed(3), y:+(STAND.household.y + 0.006).toFixed(3) },
  "meet:household_r":      { x:+(STAND.household.x + 0.044).toFixed(3), y:+(STAND.household.y - 0.004).toFixed(3) },
  "oath:circle":           { x:OATH.x, y:OATH.y },
  "oath:stone":            { x:OATH.x, y:+(OATH.y - 0.014).toFixed(3) },
  "meet:oath_l":           { x:+(OATH.x - 0.082).toFixed(3), y:+(OATH.y + 0.010).toFixed(3) },
  "meet:oath_r":           { x:+(OATH.x + 0.082).toFixed(3), y:+(OATH.y - 0.006).toFixed(3) },
  "arms:stack_l":          nz(STACKS[0]),
  "arms:stack_r":          nz(STACKS[1]),
  "arms:stack_c":          nz(STACKS[2]),
  "grave:mound_l":         nz(MOUNDS[0]),
  "grave:mound_r":         nz(MOUNDS[1]),
  "threshold:farm-gate":   { x:params.gateX, y:0.462 },
  "exit:farm":             { x:params.gateX, y:0.462 },
  "farm:house-door":       { x:0.296, y:0.446 },
  "marker:herm":           { x:0.086, y:0.566 },
  "exit:road":             { x:0.010, y:0.552 },
  "exit:disperse":         ln("disperse", 1.0),
  "exit:fields":           { x:0.978, y:0.612 },
  "camera:wide":           { x:0.500, y:0.716 },
  "camera:lines":          { x:0.486, y:0.694 },
  "camera:scar":           { x:SCAR.x, y:0.800 },
  "camera:oath":           { x:OATH.x, y:OATH.y },
  "camera:farm":           { x:0.372, y:0.500 },
};

/* ---------- small stamps ---------- */
function oliveTree(pen, g, x, base, s, tone){
  pen.paint(() => {
    g.moveTo(x - s*0.072, base);
    g.lineTo(x - s*0.088, base - s*0.36);
    g.lineTo(x + s*0.078, base - s*0.38);
    g.lineTo(x + s*0.062, base);
    g.closePath();
  }, toneSolid(inkLevel(5)), 2);
  for (const [ox, oy, r] of [[-0.24,-0.56,0.32],[0.24,-0.60,0.29],[0.00,-0.78,0.26]])
    pen.paint(() => { g.ellipse(x + s*ox, base + s*oy, s*r, s*r*0.72, 0, 0, 7); }, tone, 2.4);
}
function bush(pen, g, x, base, s, tone){
  pen.paint(() => { g.ellipse(x, base - s*0.52, s*0.62, s*0.42, 0, 0, 7); }, tone, 2.2);
  pen.ink(() => { g.moveTo(x, base); g.lineTo(x, base - s*0.44); }, 1.8);
}
function block(pen, g, x, base, w, h, tone, roofTone, door){
  pen.paint(() => { g.rect(x - w/2, base - h, w, h); }, tone, 2.5);
  pen.paint(() => {
    g.moveTo(x - w*0.58, base - h);
    g.lineTo(x, base - h - h*0.44);
    g.lineTo(x + w*0.58, base - h);
    g.closePath();
  }, roofTone, 2.5);
  if (door) pen.paint(() => { g.rect(x - w*0.15, base - h*0.58, w*0.30, h*0.58); },
                      toneSolid(inkLevel(7)), 2);
}
function stoneRun(pen, g, a, b, th, tone, courses = 6){
  pen.paint(() => {
    g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
    g.lineTo(b.x, b.y + th*0.42); g.lineTo(a.x, a.y + th); g.closePath();
  }, tone, 2.5);
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.6; g.globalAlpha = 0.30;
  for (let i = 1; i < courses; i++){
    const k = i/courses, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
    g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + lerp(th, th*0.42, k)); g.stroke();
  }
  g.restore();
}
function dashPath(g, pts, lw, alpha, dash){
  g.save(); g.strokeStyle = INK; g.lineWidth = lw; g.globalAlpha = alpha;
  g.lineCap = "round"; g.setLineDash(dash);
  g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
  g.stroke(); g.setLineDash([]); g.restore();
}
/* a shield lying on its face: light disc, dark boss — light plane, dark accent */
function shieldDown(pen, g, x, y, s){
  pen.paint(() => { g.ellipse(x, y, s*0.50, s*0.24, 0.10, 0, 7); }, toneSolid(inkLevel(2)), 2.6);
  pen.paint(() => { g.ellipse(x, y, s*0.30, s*0.14, 0.10, 0, 7); }, toneSolid(inkLevel(4)), 1.8);
  pen.paint(() => { g.ellipse(x, y, s*0.11, s*0.055, 0, 0, 7); }, toneSolid(inkLevel(7)), 1.4);
}
/* a shield standing on its rim against a stack: a light disc seen edge-on-ish */
function shieldRim(pen, g, x, base, s){
  pen.paint(() => { g.ellipse(x, base - s*0.34, s*0.30, s*0.36, 0.08, 0, 7); },
            toneSolid(inkLevel(2)), 2.6);
  pen.paint(() => { g.ellipse(x, base - s*0.34, s*0.10, s*0.12, 0, 0, 7); },
            toneSolid(inkLevel(6)), 1.6);
}
function helm(pen, g, x, y, s){
  pen.paint(() => { g.ellipse(x, y - s*0.14, s*0.20, s*0.20, 0, Math.PI, 0); }, toneSolid(inkLevel(4)), 2.2);
  pen.paint(() => { g.rect(x - s*0.22, y - s*0.15, s*0.44, s*0.07); }, toneSolid(inkLevel(6)), 1.6);
}
function spearDown(pen, g, x, y, s, a){
  g.save(); g.translate(x, y); g.rotate(a);
  pen.paint(() => { g.rect(-s*0.46, -s*0.026, s*0.92, s*0.052); }, toneSolid(inkLevel(4)), 1.8);
  pen.paint(() => {
    g.moveTo(s*0.46, -s*0.058); g.lineTo(s*0.66, 0); g.lineTo(s*0.46, s*0.058); g.closePath();
  }, toneSolid(inkLevel(7)), 1.6);
  g.restore();
}
/* GROUNDED ARMS: three spears stacked in a tripod, bound at the neck, a shield
   set on its rim beside them. The visible form of "lowered weapons". */
function armsStack(pen, g, x, base, s){
  pen.paint(() => { g.ellipse(x, base + s*0.04, s*0.60, s*0.13, 0, 0, 7); }, toneSolid(inkLevel(1)), 2);
  const legs = [[-0.34, -0.02],[0.30, 0.04],[-0.04, 0.00]];
  for (const [dx, dt] of legs){
    pen.paint(() => {
      g.moveTo(x + s*dx - s*0.030, base);
      g.lineTo(x + s*(dt) - s*0.026, base - s*0.86);
      g.lineTo(x + s*(dt) + s*0.026, base - s*0.86);
      g.lineTo(x + s*dx + s*0.030, base);
      g.closePath();
    }, toneSolid(inkLevel(4)), 2);
    pen.paint(() => {
      g.moveTo(x + s*dt - s*0.052, base - s*0.86);
      g.lineTo(x + s*dt, base - s*1.04);
      g.lineTo(x + s*dt + s*0.052, base - s*0.86);
      g.closePath();
    }, toneSolid(inkLevel(7)), 1.6);
  }
  pen.paint(() => { g.rect(x - s*0.13, base - s*0.72, s*0.26, s*0.062); },
            toneSolid(inkLevel(6)), 1.6);
  shieldRim(pen, g, x + s*0.62, base + s*0.02, s*0.92);
}
/* a grave mound: a light swell with a dark kerb arc and one set stone */
function mound(pen, g, x, base, s){
  pen.paint(() => { g.ellipse(x, base, s*0.62, s*0.20, 0, 0, 7); }, toneSolid(inkLevel(3)), 2.4);
  pen.paint(() => { g.ellipse(x, base - s*0.06, s*0.50, s*0.22, 0, Math.PI, 0); },
            toneSolid(inkLevel(2)), 2.6);
  pen.paint(() => { g.rect(x - s*0.055, base - s*0.36, s*0.11, s*0.30); },
            toneSolid(inkLevel(5)), 2);
}
/* a count cut as BARS on a stone face — geometry, because type dissolves */
function bars(pen, g, x, y, w, h, n, gap){
  for (let i = 0; i < n; i++)
    pen.paint(() => { g.rect(x - w/2, y + i*(h + gap), w, h); }, toneSolid(inkLevel(7)), 1.2);
}

/* ---------- the set ---------- */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode = MODES.includes(st.state) ? st.state : "oath";
  const bare   = mode === "bare";
  const charge = mode === "charge";
  const zones  = (st.zonesLit ?? params.zonesLit) || mode === "survey";
  /* what each moment of the conversion puts on the ground */
  const hasScar    = !charge && !bare;
  const hasKit     = !charge && !bare && mode !== "peace";
  const hasStacks  = mode === "separation" || mode === "oath" || mode === "peace" || mode === "survey";
  const hasRing    = mode === "oath" || mode === "peace" || mode === "survey";
  const hasDisperse= mode === "separation" || mode === "oath" || mode === "survey";
  const laneInk    = charge ? 0.88 : mode === "halt" ? 0.66 : mode === "peace" ? 0.20 : 0.52;
  const standInk   = (mode === "separation" || mode === "oath" || mode === "peace" || zones) ? 1 : 0.34;

  const layers = st.layers || (bare
    ? ["sky","hills","ground","fields","farm","trees","fg"]
    : ["sky","hills","ground","fields","farm","trees","band","lanes","fallen",
       "scar","stands","arms","ring","zones","fg"]);
  const has = l => layers.includes(l);

  /* tone table — the field stays light; the ink is spent on accents */
  const T = mode === "peace"
      ? { sky:1, far:2, ridge:3, ground:2, field:3, stone:4, build:2, dark:5, swept:1, leaf:3 }
      : charge
      ? { sky:2, far:3, ridge:4, ground:2, field:3, stone:4, build:2, dark:6, swept:1, leaf:4 }
      : { sky:1, far:2, ridge:3, ground:2, field:3, stone:4, build:2, dark:6, swept:1, leaf:3 };

  const hz = params.horizon * H;
  const S  = p => ({ x:p.x*W, y:p.y*H });
  const VP = { x: params.gateX*W, y: hz };            // the country converges on the gate
  const NEAR = H*NEAR_Y;
  const FP = (x, u) => ({ x: lerp(x*W, VP.x, u), y: lerp(NEAR, VP.y, u) });

  /* ---- SKY ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, hz);
    g.fillStyle = inkLevel(T.sky + 1);
    for (let i = 0; i < 3; i++){
      g.beginPath();
      g.ellipse(W*(0.22 + i*0.29), hz*(0.28 + 0.22*(i%2)), W*0.108, H*0.010, 0, 0, 7);
      g.fill();
    }
    /* CHARGE: the sky over the farm carries the weather Zeus is about to spend —
       a short bank of hard cloud, cut well short of both edges. */
    if (charge){
      g.fillStyle = inkLevel(T.sky + 2);
      g.beginPath(); g.ellipse(W*0.560, hz*0.44, W*0.150, H*0.016, 0, 0, 7); g.fill();
      g.beginPath(); g.ellipse(W*0.410, hz*0.58, W*0.110, H*0.012, 0, 0, 7); g.fill();
    }
  }

  /* ---- GROUND: the horizon is a tone change, not a rule ---- */
  if (has("ground")){ g.fillStyle = inkLevel(T.ground); g.fillRect(0, hz, W, H - hz); }

  /* ---- HILLS: two humps of the far range and a short near ridge behind the
     steading. Filled, then only the CREST inked, so nothing lays a rule. ---- */
  if (has("hills")){
    const hump = (pts, level, lw) => {
      const trace = () => {
        g.moveTo(pts[0][0]*W, hz + pts[0][1]*H);
        g.quadraticCurveTo(pts[1][0]*W, hz + pts[1][1]*H, pts[2][0]*W, hz + pts[2][1]*H);
        g.quadraticCurveTo(pts[3][0]*W, hz + pts[3][1]*H, pts[4][0]*W, hz + pts[4][1]*H);
      };
      g.beginPath(); trace();
      g.lineTo(pts[4][0]*W, hz + H*0.05); g.lineTo(pts[0][0]*W, hz + H*0.05);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
      g.save(); g.strokeStyle = INK; g.lineWidth = lw; g.lineJoin = "round";
      g.beginPath(); trace(); g.stroke(); g.restore();
    };
    hump([[0.048,0.006],[0.17,-0.086],[0.29,-0.028],[0.38,0.004],[0.442,0.008]], T.far, 3.5);
    hump([[0.522,0.008],[0.67,-0.094],[0.81,-0.024],[0.89,0.002],[0.952,0.008]], T.far, 3.5);
    hump([[0.386,0.022],[0.56,-0.024],[0.72,0.006],[0.85,0.024],[0.958,0.020]], T.ridge, 3);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.24;
    for (const u of [0.22, 0.46, 0.70]){
      g.beginPath();
      g.moveTo(W*(0.14 + u*0.60), hz - H*0.048 + H*0.020*u);
      g.lineTo(W*(0.14 + u*0.60) + W*0.020, hz - H*0.006);
      g.stroke();
    }
    g.restore();
  }

  /* ---- FIELDS: perspective plots and converging hedges. The ground recedes;
     it does not stripe — every plot stops short of the frame. ---- */
  if (has("fields")){
    const quad = (xa, xb, u0, u1, level) => {
      const a = FP(xa,u0), b = FP(xb,u0), c = FP(xb,u1), d = FP(xa,u1);
      g.beginPath();
      g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.lineTo(d.x,d.y);
      g.closePath(); g.fillStyle = inkLevel(level); g.fill();
    };
    const PLOTS = [
      [-0.72,-0.30,0.02,0.22], [-0.40,-0.06,0.30,0.46], [ 1.18,1.72,0.04,0.22],
      [ 1.02, 1.46,0.28,0.42], [ 0.06,0.34,0.62,0.74], [-0.18,0.12,0.50,0.60],
    ];
    PLOTS.forEach(p => quad(p[0], p[1], p[2], p[3], T.field));
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.14;
    for (const p of PLOTS){
      for (let r = 0; r < 3; r++){
        const u = lerp(p[2], p[3], (r + 0.5)/3), sc = lerp(0.018, 0.004, u);
        for (let k = 0; k < 7; k++){
          const q = FP(lerp(p[0], p[1], (k + 0.5)/7), u);
          if (q.x < -W*0.04 || q.x > W*1.04) continue;
          g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - H*sc); g.stroke();
        }
      }
    }
    g.restore();
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.4; g.globalAlpha = 0.18;
    for (let i = 0; i < params.hedges; i++){
      const x = -0.70 + i * (2.30 / (params.hedges - 1));
      const a = FP(x, 0.04), b = FP(x, 0.74);
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.stroke();
    }
    g.restore();
    for (const [xa, xb, u, du] of [[-0.60,-0.24,0.26,0.05],[1.14,1.62,0.10,0.05]]){
      const a = FP(xa,u), b = FP(xb, u + du);
      if (b.x < -W*0.05 || a.x > W*1.05) continue;
      stoneRun(pen, g, a, b, H*lerp(0.012,0.004,u), toneSolid(inkLevel(T.field)), 6);
    }
    /* the town road entering at the left lip — the way the militia came in —
       and the herm that marks the farm's boundary, its count cut as bars */
    const rd = [S({x:-0.02,y:0.548}), S({x:0.086,y:0.566}), S({x:0.176,y:0.590})];
    dashPath(g, rd, 3.0, 0.40, [W*0.014, W*0.012]);
    const hx = 0.086*W, hy = 0.566*H, hs = depthAtY(0.566);
    pen.paint(() => { g.rect(hx - W*0.011*hs, hy - H*0.086*hs, W*0.022*hs, H*0.086*hs); },
              toneSolid(inkLevel(T.stone - 1)), 3);
    pen.paint(() => { g.ellipse(hx, hy - H*0.086*hs, W*0.015*hs, H*0.011*hs, 0, 0, 7); },
              toneSolid(inkLevel(T.dark)), 2.5);
    bars(pen, g, hx, hy - H*0.062*hs, W*0.014*hs, H*0.006*hs, 2, H*0.011*hs);
  }

  /* ---- THE STEADING: small, middle distance, on its cut terrace, with the
     FARM GATE at its lip and the orchard boundary running away east. ---- */
  if (has("farm")){
    const base = params.farmBase * H, gx = params.gateX * W, wu = params.wallU * H;
    for (const [x0, x1] of [[0.222,0.284],[0.318,0.368]])   // terrace: two steps
      pen.paint(() => { g.rect(W*x0, base + H*0.004, W*(x1-x0), H*0.006); },
                toneSolid(inkLevel(T.stone)), 2);
    block(pen, g, W*0.296, base - H*0.002, W*0.070, H*0.038,
          toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), true);
    block(pen, g, W*0.356, base - H*0.001, W*0.048, H*0.024,
          toneSolid(inkLevel(T.build + 1)), toneSolid(inkLevel(T.build)), false);
    block(pen, g, W*0.238, base - H*0.001, W*0.036, H*0.018,
          toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), false);
    // the yard wall, cut short of the gate
    stoneRun(pen, g, { x:W*0.212, y:base - H*0.010 }, { x:W*0.286, y:base - H*0.011 },
             H*0.011, toneSolid(inkLevel(T.build)), 5);
    stoneRun(pen, g, { x:W*0.330, y:base - H*0.011 }, { x:gx - W*0.016, y:base - H*0.010 },
             H*0.011, toneSolid(inkLevel(T.build)), 4);
    // THE FARM GATE — two posts, a dark mouth, a light slab under it
    for (const s of [-1, 1])
      pen.paint(() => { g.rect(gx + s*W*0.015 - W*0.005, base - H*0.026, W*0.010, H*0.026); },
                toneSolid(inkLevel(T.dark)), 2.5);
    pen.paint(() => { g.rect(gx - W*0.010, base - H*0.021, W*0.020, H*0.021); },
              toneSolid(inkLevel(7)), 2);
    pen.paint(() => { g.ellipse(gx, base + H*0.004, W*0.026, H*0.006, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2);
    // the orchard boundary east of the gate: three runs with real gaps
    for (const [x0, x1, dy] of [[0.452,0.586,0.000],[0.626,0.760,0.006],[0.812,0.948,0.012]])
      stoneRun(pen, g, { x:W*x0, y:wu + H*dy }, { x:W*x1, y:wu + H*(dy + 0.008) },
               H*0.012, toneSolid(inkLevel(T.stone)), 7);
    // the smoke of the house — the one soft thing, and why the farm reads lived in
    g.save();
    g.strokeStyle = inkLevel(T.field); g.lineWidth = W*0.008; g.lineCap = "round";
    g.globalAlpha = 0.50;
    g.beginPath();
    g.moveTo(W*0.296, base - H*0.058);
    g.quadraticCurveTo(W*0.330, base - H*0.108, W*0.302, base - H*0.156);
    g.stroke(); g.restore();
  }

  /* ---- TREES: the orchard canopies behind the wall, and scrub in the field
     margins, so the middle ground is neither bald nor barred ---- */
  if (has("trees")){
    /* the orchard canopies stand BEHIND the boundary, so their feet are on a far
       ground line but their crowns must still be legible: the ladder is floored
       for them, or they print as four dots and the middle distance goes bald. */
    for (const [x, y] of [[0.474,0.470],[0.552,0.462],[0.668,0.478],[0.742,0.470],
                          [0.856,0.484],[0.930,0.476],[0.608,0.456],[0.800,0.460]])
      oliveTree(pen, g, x*W, y*H, W*0.070*Math.max(0.46, depthAtY(y)), toneSolid(inkLevel(T.leaf)));
    /* three olives standing IN the open field, west and east of the fighting
       ground: they break the bald middle and give a figure something to pass. */
    for (const [x, y] of [[0.086,0.612],[0.930,0.596],[0.882,0.664]])
      oliveTree(pen, g, x*W, y*H, W*0.104*depthAtY(y), toneSolid(inkLevel(T.leaf + 1)));
    for (const [x, y] of [[0.176,0.548],[0.056,0.512],[0.968,0.542],[0.300,0.578],
                          [0.972,0.700],[0.036,0.716]])
      bush(pen, g, x*W, y*H, W*0.062*depthAtY(y), toneSolid(inkLevel(T.field)));
    /* two broken field walls flanking the fighting ground — short runs, cut well
       clear of both edges, so the open ground has boundaries and no bars. */
    stoneRun(pen, g, { x:W*0.020, y:H*0.646 }, { x:W*0.146, y:H*0.664 },
             H*0.014, toneSolid(inkLevel(T.field)), 7);
    stoneRun(pen, g, { x:W*0.858, y:H*0.618 }, { x:W*0.974, y:H*0.634 },
             H*0.013, toneSolid(inkLevel(T.field)), 6);
    /* the fold and the cairn: the two pieces of farm furniture standing between
       the steading and the fighting ground. A picket of five stakes with a gap
       in it, and a stacked marker cairn — incident in the middle distance, and
       both of them things the militia had to come round. */
    for (let i = 0; i < 6; i++){
      if (i === 3) continue;                                  // the gap the flock goes through
      const x = lerp(0.560, 0.688, i/5), y = 0.552 + 0.004*(i%2);
      const s = H*0.030*depthAtY(y);
      pen.paint(() => { g.rect(x*W - W*0.0045, y*H - s, W*0.009, s); },
                toneSolid(inkLevel(T.stone)), 1.8);
    }
    (() => {
      const x = 0.726*W, y = 0.592*H, s = W*0.052*depthAtY(0.592);
      pen.paint(() => { g.ellipse(x, y, s*0.72, s*0.22, 0, 0, 7); }, toneSolid(inkLevel(T.field)), 2.2);
      pen.paint(() => { g.rect(x - s*0.34, y - s*0.44, s*0.68, s*0.44); }, toneSolid(inkLevel(T.stone)), 2.2);
      pen.paint(() => { g.rect(x - s*0.22, y - s*0.74, s*0.44, s*0.32); }, toneSolid(inkLevel(T.stone - 1)), 2);
      pen.paint(() => { g.ellipse(x, y - s*0.76, s*0.16, s*0.10, 0, 0, 7); }, toneSolid(inkLevel(T.dark)), 1.8);
    })();
    /* tussocks: the open ground is grazing, not a floor. Sized off the ladder,
       kept off the fighting band and the near zones. */
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.2; g.globalAlpha = 0.30; g.lineCap = "round";
    for (let i = 0; i < 26; i++){
      const x = 0.030 + ((i*0.2137) % 0.94), y = 0.520 + ((i*0.1319) % 0.44);
      if (y > 0.660 && y < 0.740) continue;                       // the churned band
      if (Math.hypot(x - OATH.x, (y - OATH.y)*2.2) < OATH.r*1.5) continue;
      const s = H*0.020*depthAtY(y), px = x*W, py = y*H;
      g.beginPath();
      g.moveTo(px, py); g.lineTo(px - s*0.44, py - s);
      g.moveTo(px, py); g.lineTo(px + s*0.10, py - s*1.24);
      g.moveTo(px, py); g.lineTo(px + s*0.52, py - s*0.86);
      g.stroke();
    }
    g.restore();
  }

  /* ---- THE CLASH BAND: three churned pieces with gaps. Light scoured ground
     with dark scuff ticks — the fight as terrain, not as tone. ---- */
  if (has("band")){
    for (let i = 0; i < BAND.length; i++){
      const b = BAND[i], cx = (b.x0 + b.x1)/2*W, cy = b.y*H;
      const rx = (b.x1 - b.x0)/2*W, ry = H*0.020*depthAtY(b.y)*2.2;
      pen.paint(() => { g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(T.swept)), 2.6);
      g.save(); g.strokeStyle = INK; g.lineWidth = 3.2;
      g.globalAlpha = charge ? 0.72 : 0.52; g.lineCap = "round";
      for (let k = 0; k < 11; k++){
        const u = (k + 0.5)/11, x = lerp(b.x0, b.x1, u)*W;
        const y = cy + (k % 3 - 1)*ry*0.46;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + W*0.016*(k%2?1:-1), y - H*0.011); g.stroke();
      }
      g.restore();
      // clods thrown out of the churn — small dark accents on light ground
      g.fillStyle = inkLevel(5);
      for (let k = 0; k < 5; k++){
        const u = (k + 0.5)/5, x = lerp(b.x0, b.x1, u)*W + W*0.010*((k%2)?1:-1);
        g.beginPath(); g.ellipse(x, cy + ry*(k%2?0.86:-0.80), W*0.009, H*0.004, 0, 0, 7); g.fill();
      }
    }
  }

  /* ---- THE CHARGE LANES: surveyed spines with chevrons pointing at the clash.
     They are hot in "charge", struck out in "peace" — the same geometry, one
     channel. Nothing about the ground is redrawn between moments. ---- */
  if (has("lanes")){
    const drawLane = (pts, alpha, chevs, back) => {
      const N = 24, band = [];
      for (let i = 0; i <= N; i++){
        const t = i/N, p = lanePt(pts, t), v = laneTan(pts, t);
        const hw = W*lerp(0.012, 0.040, depthAtY(p.y));
        band.push({ p:{ x:p.x*W, y:p.y*H }, v, hw });
      }
      g.beginPath();
      band.forEach((s, i) => { const x = s.p.x - s.v.y*s.hw, y = s.p.y + s.v.x*s.hw;
        i ? g.lineTo(x, y) : g.moveTo(x, y); });
      for (let i = band.length - 1; i >= 0; i--){
        const s = band[i]; g.lineTo(s.p.x + s.v.y*s.hw, s.p.y - s.v.x*s.hw);
      }
      g.closePath(); g.fillStyle = inkLevel(T.swept); g.fill();
      // the surveyed spine: broken, so the lane is a survey and not a rail
      g.save(); g.strokeStyle = INK; g.globalAlpha = alpha*0.72; g.lineCap = "round";
      g.setLineDash([W*0.020, W*0.016]); g.lineWidth = 3.2;
      g.beginPath();
      band.forEach((s, i) => (i ? g.lineTo(s.p.x, s.p.y) : g.moveTo(s.p.x, s.p.y)));
      g.stroke(); g.setLineDash([]); g.restore();
      /* the chevrons: FILLED heads, sized off the ladder. Direction is the whole
         information the lane carries, so it is drawn as solid geometry — a
         stroked V dissolves in the lattice at this size. */
      for (let c = 0; c < chevs; c++){
        const t = (c + 1)/(chevs + 1.4);
        const p = lanePt(pts, t), v = laneTan(pts, t);
        const d = back ? -1 : 1, s = W*0.039*(0.55 + 0.90*depthAtY(p.y));
        const px = p.x*W, py = p.y*H, nx = -v.y*d, ny = v.x*d;
        g.save(); g.globalAlpha = Math.min(1, alpha + 0.34);
        pen.paint(() => {
          g.moveTo(px + v.x*d*s*0.86, py + v.y*d*s*0.86);
          g.lineTo(px + (nx - v.x*d*0.46)*s, py + (ny - v.y*d*0.46)*s);
          g.lineTo(px - v.x*d*s*0.12, py - v.y*d*s*0.12);
          g.lineTo(px + (-nx - v.x*d*0.46)*s, py + (-ny - v.y*d*0.46)*s);
          g.closePath();
        }, toneSolid(inkLevel(6)), 2);
        g.restore();
      }
    };
    drawLane(LANES.people, laneInk, 3, false);
    drawLane(LANES.household, laneInk, 2, false);
    if (hasDisperse) drawLane(LANES.disperse, 0.52, 3, false);
    /* PEACE: the lanes go back to grass — stubble ticks sown across them */
    if (mode === "peace"){
      g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.24;
      for (const key of ["people","household"]){
        for (let i = 0; i < 16; i++){
          const t = (i + 0.5)/16, p = lanePt(LANES[key], t);
          const off = ((i%3) - 1)*0.024, s = H*0.014*depthAtY(p.y);
          const x = (p.x + off)*W, y = p.y*H;
          g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - s); g.stroke();
        }
      }
      g.restore();
    }
  }

  /* ---- THE FALLEN: mounds drawn out of the lane, and the kit dropped where it
     fell. Furniture, never figures. ---- */
  if (has("fallen")){
    for (const m of MOUNDS) mound(pen, g, m.x*W, m.y*H, W*0.132*depthAtY(m.y));
    if (hasKit) for (const k of KIT){
      const s = W*0.090*depthAtY(k.y);
      if (k.k === "shield") shieldDown(pen, g, k.x*W, k.y*H, s);
      else if (k.k === "helm") helm(pen, g, k.x*W, k.y*H, s);
      else spearDown(pen, g, k.x*W, k.y*H, s, 0.24);
    }
  }

  /* ---- THE BOLT SCAR: struck before her feet. The only full black on the open
     field, and small — a pale scoured disc, a fused centre, a star of cracks. */
  if (has("scar") && hasScar){
    const cx = SCAR.x*W, cy = SCAR.y*H, s = W*0.186*depthAtY(SCAR.y);
    pen.paint(() => { g.ellipse(cx, cy, s*0.96, s*0.34, 0, 0, 7); }, toneSolid(inkLevel(1)), 3);
    pen.paint(() => { g.ellipse(cx, cy, s*0.46, s*0.16, 0, 0, 7); }, toneSolid(inkLevel(4)), 2.4);
    pen.paint(() => { g.ellipse(cx, cy, s*0.13, s*0.048, 0, 0, 7); }, toneSolid(inkLevel(7)), 1.8);
    /* the cracks: thin, so the strike reads as a fracture in light ground and
       not as one more black lump on the field */
    g.save(); g.strokeStyle = INK; g.lineWidth = 2.2; g.lineCap = "round";
    for (let i = 0; i < 10; i++){
      const a = Math.PI*2*(i/10) + 0.22, r0 = s*0.20, r1 = s*(0.62 + 0.26*(i%3)/2);
      const kx = Math.cos(a), ky = Math.sin(a)*0.34;
      g.beginPath();
      g.moveTo(cx + kx*r0, cy + ky*r0);
      g.lineTo(cx + kx*r1*0.70 + s*0.06*((i%2)?1:-1), cy + ky*r1*0.70);
      g.lineTo(cx + kx*r1, cy + ky*r1);
      g.stroke();
    }
    g.restore();
    // scorch pits thrown clear of the strike
    g.fillStyle = inkLevel(6);
    for (let i = 0; i < 7; i++){
      const a = Math.PI*2*(i/7) + 0.9, r = s*(1.02 + 0.22*(i%3));
      g.beginPath();
      g.ellipse(cx + Math.cos(a)*r, cy + Math.sin(a)*r*0.34, s*0.045, s*0.022, 0, 0, 7);
      g.fill();
    }
  }

  /* ---- THE TWO STANDS: where the sides are drawn apart. A swept disc, a broken
     kerb of set stones, and a contact pair. Nothing spans; the kerb is a
     picket. ---- */
  if (has("stands")){
    for (const [key, z] of Object.entries(STAND)){
      const cx = z.x*W, cy = z.y*H, rx = z.r*W, ry = z.r*H*0.34;
      pen.paint(() => { g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(T.swept)), 2.8);
      g.save(); g.globalAlpha = standInk;
      const arcs = key === "people" ? [[0.10,0.36],[0.52,0.86]] : [[0.06,0.40],[0.58,0.90]];
      for (const [a0, a1] of arcs){
        for (let i = 0; i <= 4; i++){
          const a = Math.PI*2*lerp(a0, a1, i/4);
          const px = cx + Math.cos(a)*rx*1.14, py = cy + Math.sin(a)*ry*1.20;
          pen.paint(() => { g.rect(px - W*0.005, py - H*0.016*depthAtY(z.y), W*0.010, H*0.016*depthAtY(z.y)); },
                    toneSolid(inkLevel(T.stone)), 1.6);
        }
      }
      g.restore();
    }
  }

  /* ---- GROUNDED ARMS: the stacks. This is the picture of the scene's turn. ---- */
  if (has("arms") && hasStacks){
    for (const s of STACKS) armsStack(pen, g, s.x*W, s.y*H, W*0.098*depthAtY(s.y));
  }

  /* ---- THE OATH RING: near, centre, large. A swept floor inside a ring of set
     stones, a low oath slab at the middle with its count cut as BARS, and the
     libation mark poured beside it. ---- */
  if (has("ring") && hasRing){
    const cx = OATH.x*W, cy = OATH.y*H, rx = OATH.r*W, ry = OATH.r*H*0.40;
    pen.paint(() => { g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(1)), 3.5);
    // the ring: 14 set stones, alternating tall and low, each its own object
    for (let i = 0; i < 14; i++){
      const a = Math.PI*2*(i/14) + 0.12;
      const px = cx + Math.cos(a)*rx*1.10, py = cy + Math.sin(a)*ry*1.16;
      const hgt = H*(i % 2 ? 0.026 : 0.016)*depthAtY(OATH.y);
      pen.paint(() => { g.rect(px - W*0.0085, py - hgt, W*0.017, hgt); },
                toneSolid(inkLevel(i % 2 ? T.stone : T.stone - 1)), 2);
      pen.paint(() => { g.ellipse(px, py, W*0.013, H*0.004, 0, 0, 7); },
                toneSolid(inkLevel(T.field)), 1.4);
    }
    // the oath slab: a light plane on a dark plinth, the count cut in bars
    const sx = cx, sy = cy - ry*0.16, sw = W*0.062, sh = H*0.030;
    pen.paint(() => { g.rect(sx - sw/2, sy - sh, sw, sh); }, toneSolid(inkLevel(2)), 3);
    pen.paint(() => { g.rect(sx - sw*0.60, sy, sw*1.20, sh*0.28); }, toneSolid(inkLevel(T.dark)), 2.4);
    bars(pen, g, sx, sy - sh*0.76, sw*0.44, sh*0.16, 2, sh*0.22);
    // the libation: a dark pour beside the slab, and the cup ring it came from
    pen.paint(() => { g.ellipse(sx + sw*0.86, sy + sh*0.16, W*0.016, H*0.006, 0, 0, 7); },
              toneSolid(inkLevel(7)), 1.8);
    pen.paint(() => { g.ellipse(sx - sw*0.92, sy + sh*0.14, W*0.013, H*0.005, 0, 0, 7); },
              toneSolid(inkLevel(5)), 1.6);
  }

  /* ---- ZONES: contact pairs and stations struck in for previs ---- */
  if (has("zones")){
    const ZS = [
      { c:STAND.people,    pair:0.056 }, { c:STAND.household, pair:0.044 },
      { c:{ x:OATH.x, y:OATH.y, r:OATH.r }, pair:0.082 },
      { c:{ x:0.505, y:0.741, r:0.058 }, pair:0.077 },   // the parley pair at the scar
    ];
    for (const z of ZS){
      const cx = z.c.x*W, cy = z.c.y*H, rx = z.c.r*W, ry = z.c.r*H*0.34;
      g.save();
      g.strokeStyle = INK; g.lineWidth = zones ? 3.2 : 2;
      g.globalAlpha = zones ? 0.80 : 0.20;
      g.setLineDash([W*0.012, W*0.010]);
      g.beginPath(); g.ellipse(cx, cy, rx*1.20, ry*1.26, 0, 0, 7); g.stroke();
      g.setLineDash([]);
      if (zones){
        g.lineWidth = 3.4; g.globalAlpha = 0.92;
        for (const s of [-1, 1]){
          const px = cx + s*z.pair*W;
          g.beginPath();
          g.moveTo(px - W*0.011, cy); g.lineTo(px + W*0.011, cy);
          g.moveTo(px, cy - H*0.009); g.lineTo(px, cy + H*0.009);
          g.stroke();
        }
      }
      g.restore();
    }
  }

  /* ---- FOREGROUND OCCLUSION: what a figure passes behind ---- */
  if (has("fg")){
    oliveTree(pen, g, W*0.952, H*1.048, W*0.150, toneSolid(inkLevel(T.field + 1)));
    stoneRun(pen, g, { x:-W*0.02, y:H*0.996 }, { x:W*0.104, y:H*1.014 },
             H*0.024, toneSolid(inkLevel(T.field + 1)), 6);
    g.fillStyle = inkLevel(T.field);
    for (let i = 0; i < 3; i++){
      const x = W*(0.700 + i*0.096), y = H*(1.026 - 0.006*(i%3));
      g.beginPath(); g.ellipse(x, y, W*0.026, H*0.011, 0, 0, 7); g.fill();
    }
  }
}

export const asset = {
  id:"location.farm-battlefield-at-peace",
  type:"LOCATION",
  name:"Farm Battlefield at Peace",
  statusWord:"ARMS GROUNDED",
  scene:"OD-B24-S09",

  params,
  // back -> front draw order the set honors; a scene may pass a subset
  layers:["sky","hills","ground","fields","farm","trees","band","lanes","fallen",
          "scar","stands","arms","ring","zones","fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky","hills","fields","farm","trees"],
              ground:["ground","band","lanes","fallen","scar","stands","arms","ring","zones"],
              front:["fg"] },
  // normalized 0..1 placement / camera anchors — read off the lanes + the ladder
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.02,y0:.47,x1:.98,y1:.99 },
    field:{ x0:.04,y0:.50,x1:.96,y1:.99 },
    "clash-band":{ x0:.14,y0:.66,x1:.83,y1:.73 },
    "people-side":{ x0:.04,y0:.54,x1:.47,y1:.96 },
    "household-side":{ x0:.47,y0:.47,x1:.96,y1:.90 },
    "lane-people":{ x0:.00,y0:.53,x1:.49,y1:.72 },
    "lane-household":{ x0:.38,y0:.46,x1:.52,y1:.71 },
    "lane-disperse":{ x0:.00,y0:.73,x1:.46,y1:.98 },
    "stand-people":{ x0:.14,y0:.84,x1:.31,y1:.91 },
    "stand-household":{ x0:.73,y0:.78,x1:.87,y1:.84 },
    "oath-ground":{ x0:.37,y0:.89,x1:.63,y1:.97 },
    "scar-ground":{ x0:.44,y0:.74,x1:.58,y1:.80 },
    graves:{ x0:.30,y0:.63,x1:.76,y1:.68 },
    threshold_farm_gate:{ x0:.38,y0:.44,x1:.43,y1:.48 },
    threshold_town_road:{ x0:.00,y0:.53,x1:.10,y1:.58 },
  },
  states:{
    initial:"oath",
    nodes:{
      // the last clash: lanes hot, no scar, nothing grounded yet
      charge:{ preview:{ state:"charge" } },
      // the bolt struck before her feet; kit dropped where it fell
      halt:{ preview:{ state:"halt" } },
      // the sides drawn apart, arms stacked, the way home marked
      separation:{ preview:{ state:"separation" } },
      // the ring struck in and sworn over — the default
      oath:{ preview:{ state:"oath" } },
      // the field cleared, the lanes going back to grass
      peace:{ preview:{ state:"peace" } },
      // stations + contact pairs lit for previs / blocking
      survey:{ preview:{ state:"survey", zonesLit:true } },
      // the navigable terrain only
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["charge","halt"],["halt","separation"],["separation","oath"],
           ["oath","peace"],["peace","oath"],["oath","separation"],
           ["halt","charge"],["oath","survey"],["survey","oath"],
           ["oath","bare"],["bare","oath"]],
  },
  channels:["state","lanes","scar","separation","oath","zones","camera","light"],

  preview:()=>({ state:"oath", t:0, status:"ARMS GROUNDED", progress:.72 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
