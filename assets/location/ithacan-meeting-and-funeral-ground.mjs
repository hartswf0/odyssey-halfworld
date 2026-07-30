/* location.ithacan-meeting-and-funeral-ground — the open ground below the town
   where Ithaca lays out its dead and, in the same hour, argues itself into a
   war. LOCATION asset: an EMPTY navigable set (no figures baked in — the
   shrouded biers are furniture, the same way a bed is furniture). Solid grays +
   hard contour into the offscreen ctx; the engine dotify pass supplies the
   halftone.

   THE SHAPE OF OD-B24-S06. Five things have to be true of this ground at once,
   so all five are authored as geometry, not as decoration:

     BODY DISPLAY   — the bier line the corpses are carried down to, broken into
                      two short runs (three biers, a gap, two) so it never
                      stripes the frame. Each bier is a light pall over a dark
                      trestle: light plane, dark accent.
     FAMILY CLUSTERS— four swept kerb-discs ringing the floor, each its own
                      island with a stele, an offering bowl and a tally of
                      courses cut in the stone (a count as BARS — numerals
                      dissolve in the dot lattice). Every cluster carries a
                      CONTACT PAIR so two mourners can touch without landing on
                      one coordinate.
     SPEAKER POSNS  — the raised stone at the centre of the cleared floor plus
                      two low flanking slabs: three speakers in this scene
                      (Medon-and-Phemius, Halitherses, Eupithes) and they must
                      not share a station.
     ARMAMENT POINT — the paved slab at the head of the farm road: a fan of
                      leaning spears, two shields on their rims, a pile of
                      helms. This is where the argument becomes a militia.
     FARMWARD EXIT  — the road out to Laertes's steading, entering at the herm
                      on the east lip and bleeding off the near right corner.
                      The town road (the way the bodies come down from the
                      palace) enters at the far LEFT, so the ground reads as a
                      passage from palace to farm.

   THE SPLIT IS PART OF THE SET. Some citizens refuse to march. The caution
   ground is a separate swept disc at the near LEFT — town side, as far from the
   armament point as the frame allows — with its own broken bench run. The
   scene's division into militia and caution group is a walk between two
   authored stations, not a piece of staging invented per shot.

   ONE DEPTH LADDER. depthAtY() maps ground height to scale; every stamp — bier,
   stele, spear, herm, urn — is sized from its own y, so the far gate and the
   near kerb agree about the size of the world.

   NOTHING SPANS THE FRAME. The far range is two separate humps stopped short of
   both edges; the town wall is three runs cut at the gate; the bier line is two
   runs with a gap; the caution bench is a broken picket; the horizon is a tone
   change, not a rule.

   States: "mourning" (the default — bodies laid out, families gathered),
   "assembly" (the floor cleared and the speaking stone struck in), "muster"
   (arms broken out, the picket up, the farm road chevroned), "pyres" (biers
   emptied, the pyres burning on the far ground), "dusk", "survey" (zones and
   contact pairs lit for previs), "bare" (the navigable set only).

   Serves OD-B24-S06. Atlas: body display, family clusters, speaker positions,
   armament point, and farmward exit. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const MODES = ["mourning", "assembly", "muster", "pyres", "dusk", "survey", "bare"];

const params = {
  horizon:0.262,      // sky / ground split as a fraction of H
  townBase:0.398,     // ground line of the town terrace under the palace
  biersA:2,           // the upper run of the bier line
  biersB:1,           // the lower run, past the gap
  clusters:4,         // family mourning grounds ringing the floor
  speakerStone:true,  // the raised stone at the centre of the cleared floor
  armsPoint:true,     // the arming slab at the head of the farm road
  zonesLit:false,     // contact pairs + swept grounds struck in for previs
};

/* ---------- THE ONE DEPTH LADDER ---------- */
const NEAR_Y   = 1.040;
const groundU  = y => clamp((y - params.horizon) / (NEAR_Y - params.horizon), 0, 1);
const depthAtY = y => lerp(0.075, 1.000, Math.pow(groundU(y), 1.22));

/* ---------- THE TWO ROADS ----------
   Centrelines in normalized space, each with its own half-width; the band is
   built in PIXEL space so the taper never skews with the canvas aspect. */
const TOWN_ROAD = [                       // palace gate -> the bier line
  { x:0.294, y:0.392, hw:0.007 },
  { x:0.320, y:0.422, hw:0.011 },
  { x:0.356, y:0.452, hw:0.015 },
  { x:0.408, y:0.472, hw:0.020 },
  { x:0.470, y:0.488, hw:0.023 },
];
const FARM_ROAD = [                       // the east herm -> off the east edge
  { x:0.800, y:0.612, hw:0.014 },
  { x:0.872, y:0.662, hw:0.020 },
  { x:0.948, y:0.714, hw:0.026 },
  { x:1.028, y:0.766, hw:0.033 },
  { x:1.090, y:0.808, hw:0.038 },
];

/* ---------- THE BIER LINE ----------
   Two runs with a gap: the display never becomes a bar across the frame, and
   each bier is drawn big enough to read as a strapped pall at halftone scale. */
const BIERS = [
  { x:0.150, y:0.496 }, { x:0.360, y:0.516 },
  /* gap — the offering stand stands in it */
  { x:0.700, y:0.556 },
];
const STAND = { x:0.548, y:0.534 };       // the offering stand, in the break

/* ---------- THE CLEARED FLOOR + THE SPEAKING STONE ---------- */
const FLOOR = { x:0.430, y:0.706, rx:0.300, ry:0.105 };
const BEMA  = { x:0.418, y:0.694 };
const SLAB_L= { x:0.268, y:0.728 };
const SLAB_R= { x:0.560, y:0.708 };

/* ---------- THE SWEPT GROUNDS ----------
   Each carries a contact PAIR: an embrace over a body needs two coordinates. */
const MEET = {
  fam_a:  { x:0.092, y:0.628, r:0.062, bars:3 },
  fam_b:  { x:0.132, y:0.812, r:0.078, bars:2 },
  fam_c:  { x:0.360, y:0.900, r:0.090, bars:4 },
  fam_d:  { x:0.630, y:0.876, r:0.086, bars:2 },
  caution:{ x:0.178, y:0.912, r:0.074, bars:0 },
  arms:   { x:0.852, y:0.800, r:0.070, bars:0 },
};
const ARMS = { x:MEET.arms.x, y:MEET.arms.y };
const HERM = { x:FARM_ROAD[0].x, y:FARM_ROAD[0].y };

/* ---------- anchors: read off the roads, the discs and the ladder ---------- */
const nz = p => ({ x:+clamp(p.x, 0, 1).toFixed(3), y:+clamp(p.y, 0, 1).toFixed(3) });
const pairL = (z, d) => ({ x:+(z.x - d).toFixed(3), y:+(z.y + d*0.22).toFixed(3) });
const pairR = (z, d) => ({ x:+(z.x + d).toFixed(3), y:+(z.y - d*0.18).toFixed(3) });

export const anchors = {
  // THE BODY DISPLAY — every bier addressable, plus the head of the line
  "display:bier_1": nz(BIERS[0]), "display:bier_2": nz(BIERS[1]), "display:bier_3": nz(BIERS[2]),
  "display:stand":  nz(STAND),
  "display:head":   { x:0.036, y:0.500 },
  "display:foot":   { x:0.792, y:0.576 },
  "display:centre": { x:0.430, y:0.530 },
  // SPEAKER POSITIONS — three, so three speakers never share a station
  "speak:stone":    nz(BEMA),
  "speak:slab_l":   nz(SLAB_L),
  "speak:slab_r":   nz(SLAB_R),
  "speak:floor_n":  { x:0.430, y:0.784 },
  "speak:floor_f":  { x:0.430, y:0.632 },
  // FAMILY CLUSTERS + their contact pairs
  "family:a":       nz(MEET.fam_a), "family:b": nz(MEET.fam_b),
  "family:c":       nz(MEET.fam_c), "family:d": nz(MEET.fam_d),
  "mourn:a_l": pairL(MEET.fam_a, 0.040), "mourn:a_r": pairR(MEET.fam_a, 0.040),
  "mourn:b_l": pairL(MEET.fam_b, 0.052), "mourn:b_r": pairR(MEET.fam_b, 0.052),
  "mourn:c_l": pairL(MEET.fam_c, 0.056), "mourn:c_r": pairR(MEET.fam_c, 0.056),
  "mourn:d_l": pairL(MEET.fam_d, 0.042), "mourn:d_r": pairR(MEET.fam_d, 0.042),
  // THE ARMAMENT POINT
  "arms:point":     nz(ARMS),
  "arms:spears":    { x:+(ARMS.x - 0.014).toFixed(3), y:+(ARMS.y - 0.004).toFixed(3) },
  "arms:shields":   { x:+(ARMS.x + 0.048).toFixed(3), y:+(ARMS.y + 0.012).toFixed(3) },
  "arms:helms":     { x:+(ARMS.x - 0.058).toFixed(3), y:+(ARMS.y + 0.014).toFixed(3) },
  "muster:line_l":  { x:0.664, y:0.672 }, "muster:line_c": { x:0.744, y:0.702 },
  "muster:line_r":  { x:0.824, y:0.732 },
  // THE CAUTION GROUND — the citizens who refuse to march
  "hold:caution":   nz(MEET.caution),
  "hold:bench_l":   { x:0.128, y:0.878 }, "hold:bench_r": { x:0.234, y:0.893 },
  // THE FARMWARD EXIT
  "threshold:farm-herm": nz(HERM),
  "road:farm-far":  nz(FARM_ROAD[1]), "road:farm-bend": nz(FARM_ROAD[2]),
  "road:farm-near": nz(FARM_ROAD[3]),
  "exit:farmward":  nz(FARM_ROAD[4]),
  // THE TOWN SIDE — where the bodies come down from the palace
  "threshold:town-gate": { x:0.294, y:0.392 },
  "road:town-near": nz(TOWN_ROAD[3]),
  "exit:town":      { x:0.294, y:0.392 },
  "exit:palace":    { x:0.230, y:0.372 },
  // cameras
  "camera:wide":    { x:0.500, y:0.700 },
  "camera:display": { x:0.400, y:0.560 },
  "camera:speaker": { x:0.418, y:0.700 },
  "camera:arms":    { x:0.840, y:0.800 },
  "camera:exit":    { x:0.930, y:0.700 },
  "camera:caution": { x:0.180, y:0.930 },
};

/* ---------- stamps ---------- */

/* a road band, built in pixel space so the taper is true */
function roadBand(pen, g, pts, W, H, level, kerbs){
  const P = pts.map(p => ({ x:p.x*W, y:p.y*H, hw:p.hw*W }));
  const nrm = i => {
    const a = P[Math.max(i-1, 0)], b = P[Math.min(i+1, P.length-1)];
    const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx, dy) || 1;
    return { x:-dy/n, y:dx/n };
  };
  const edge = s => { for (let i=0;i<P.length;i++){ const v = nrm(i);
    const x = P[i].x + s*v.x*P[i].hw, y = P[i].y + s*v.y*P[i].hw;
    (i || s<0) ? g.lineTo(x, y) : g.moveTo(x, y); } };
  g.beginPath(); edge(1);
  for (let i=P.length-1;i>=0;i--){ const v = nrm(i);
    g.lineTo(P[i].x - v.x*P[i].hw, P[i].y - v.y*P[i].hw); }
  g.closePath(); g.fillStyle = inkLevel(level); g.fill();
  g.save(); g.strokeStyle = INK; g.lineWidth = 3.2; g.lineJoin = "round";
  for (const s of [1, -1]){ g.beginPath(); edge(s); g.stroke(); }
  g.restore();
  if (kerbs){                       // set stones alternating along the verges
    g.fillStyle = inkLevel(kerbs);
    for (let i=1;i<P.length;i++){
      const v = nrm(i), s = (i%2) ? 1.32 : -1.34, r = P[i].hw*0.30 + 2;
      g.beginPath();
      g.ellipse(P[i].x + v.x*P[i].hw*s, P[i].y + v.y*P[i].hw*s, r, r*0.62, 0, 0, 7); g.fill();
    }
    // broken ruts: what makes an empty band read as a road that is walked
    g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.26;
    for (const off of [-0.40, 0.40]){
      for (let i=0;i<P.length-1;i++){
        const a = P[i], b = P[i+1], va = nrm(i), vb = nrm(i+1);
        g.lineWidth = 1.2 + i*0.7;
        for (const [t0, t1] of [[0.05, 0.42], [0.56, 0.92]]){
          const p = (t) => ({ x:lerp(a.x + va.x*a.hw*off, b.x + vb.x*b.hw*off, t),
                              y:lerp(a.y + va.y*a.hw*off, b.y + vb.y*b.hw*off, t) });
          const p0 = p(t0), p1 = p(t1);
          g.beginPath(); g.moveTo(p0.x, p0.y); g.lineTo(p1.x, p1.y); g.stroke();
        }
      }
    }
    g.restore();
  }
}

/* THE BIER: a light pall, strapped, over a dark trestle. Furniture, not a
   figure — no anatomy is drawn, only the covered mass and the boards under it.
   The two dark straps are what make a white mound read as a wrapped body. */
function bier(pen, g, x, base, s, T, covered){
  g.fillStyle = "rgba(20,20,20,.13)";                 // the bier's own shadow
  g.beginPath(); g.ellipse(x, base + s*0.03, s*0.52, s*0.08, 0, 0, 7); g.fill();
  g.save(); g.strokeStyle = INK; g.lineWidth = Math.max(2, s*0.055); g.lineCap = "round";
  for (const sd of [-1, 1]){                          // splayed trestle legs
    g.beginPath();
    g.moveTo(x + sd*s*0.40, base); g.lineTo(x + sd*s*0.30, base - s*0.19);
    g.lineTo(x + sd*s*0.20, base); g.stroke();
  }
  g.restore();
  pen.paint(() => {                                   // the boards
    g.moveTo(x - s*0.44, base - s*0.19); g.lineTo(x + s*0.44, base - s*0.21);
    g.lineTo(x + s*0.44, base - s*0.15); g.lineTo(x - s*0.44, base - s*0.13);
    g.closePath();
  }, toneSolid(inkLevel(T.stone - 1)), 2);
  if (covered){
    pen.paint(() => {                                 // the pall, overhanging the boards
      g.moveTo(x - s*0.52, base - s*0.24);
      g.quadraticCurveTo(x - s*0.44, base - s*0.52, x - s*0.10, base - s*0.53);
      g.quadraticCurveTo(x + s*0.34, base - s*0.54, x + s*0.52, base - s*0.26);
      g.lineTo(x + s*0.52, base - s*0.17); g.lineTo(x - s*0.52, base - s*0.15);
      g.closePath();
    }, toneSolid(inkLevel(1)), 3);
    for (const k of [-0.26, 0.14])                    // the straps, thin
      pen.paint(() => {
        g.moveTo(x + s*k, base - s*0.16); g.lineTo(x + s*(k + 0.048), base - s*0.16);
        g.lineTo(x + s*(k + 0.070), base - s*0.50); g.lineTo(x + s*(k + 0.026), base - s*0.505);
        g.closePath();
      }, toneSolid(inkLevel(T.stone + 1)), 1.4);
  }
  // the head stake with its hung cloth — which end of the bier is the head
  pen.paint(() => { g.rect(x - s*0.66, base - s*0.50, s*0.045, s*0.50); },
            toneSolid(inkLevel(T.stone)), 1.8);
  pen.paint(() => { g.rect(x - s*0.68, base - s*0.50, s*0.13, s*0.14); },
            toneSolid(inkLevel(2)), 1.8);
}

/* a FAMILY GROUND: swept disc, broken kerb, a stele with a tally cut in bars
   (a count must be geometry — small numerals dissolve in the dot lattice) */
function ground(pen, g, cx, cy, rx, ry, s, T, bars, gapAt){
  pen.paint(() => { g.ellipse(cx, cy, rx, ry, 0, 0, 7); }, toneSolid(inkLevel(0)), 3);
  for (let i=0;i<10;i++){
    if (i === gapAt) continue;                       // the way in
    const a = Math.PI*2*i/10 + 0.15;
    pen.paint(() => { g.ellipse(cx + Math.cos(a)*rx, cy + Math.sin(a)*ry,
                                s*0.088, s*0.044, 0, 0, 7); },
              toneSolid(inkLevel(T.stone)), 1.5);
  }
  if (bars){
    pen.paint(() => { g.rect(cx - s*0.075, cy - ry - s*0.50, s*0.150, s*0.50); },
              toneSolid(inkLevel(T.build)), 2.2);    // the stele
    pen.paint(() => { g.ellipse(cx, cy - ry - s*0.50, s*0.078, s*0.052, 0, 0, 7); },
              toneSolid(inkLevel(T.stone)), 1.8);    // its cap
    for (let i=0;i<bars;i++)
      pen.paint(() => { g.rect(cx - s*0.115, cy - ry - s*0.44 + i*s*0.115, s*0.230, s*0.052); },
                toneSolid(inkLevel(6)), 1.3);        // the tally, cut as courses
    pen.paint(() => { g.ellipse(cx + rx*0.46, cy + ry*0.34, s*0.085, s*0.042, 0, 0, 7); },
              toneSolid(inkLevel(T.dark)), 1.8);     // the offering bowl
  }
}

/* THE ARMAMENT POINT: a fan of leaning spears, two shields on their rims, a
   heap of helms — the moment the argument turns into a march. */
function armsStand(pen, g, x, base, s, T, broken){
  pen.paint(() => { g.ellipse(x, base, s*0.98, s*0.24, 0, 0, 7); }, toneSolid(inkLevel(1)), 2.6);
  /* STACKED spears: feet spread wide, heads converging near one point. A fan of
     parallel shafts reads as a picket fence; a stack reads as arms. */
  const N = broken ? 3 : 6;
  for (let i=0;i<N;i++){
    const k = N === 1 ? 0.5 : i/(N-1);
    const foot = lerp(-0.62, 0.58, k), top = lerp(-0.11, 0.13, k);
    const hgt = 1.10 + 0.10*Math.sin(k*3.1);
    g.save(); g.strokeStyle = INK; g.lineCap = "round";
    g.lineWidth = Math.max(2, s*0.030);
    g.beginPath(); g.moveTo(x + foot*s, base + s*0.02);
    g.lineTo(x + top*s, base - s*hgt); g.stroke(); g.restore();
    pen.paint(() => {                                    // the head
      g.moveTo(x + top*s, base - s*(hgt + 0.22));
      g.lineTo(x + top*s + s*0.050, base - s*hgt);
      g.lineTo(x + top*s - s*0.050, base - s*hgt); g.closePath();
    }, toneSolid(inkLevel(T.dark)), 1.8);
  }
  for (const [ox, r] of broken ? [[0.66, 0.34]] : [[-0.66, 0.40], [0.70, 0.34]]){
    pen.paint(() => { g.ellipse(x + ox*s, base - r*s*0.94, r*s, r*s*1.04, 0, 0, 7); },
              toneSolid(inkLevel(2)), 3);                // the light face
    pen.seam(() => { g.ellipse(x + ox*s, base - r*s*0.94, r*s*0.66, r*s*0.70, 0, 0, 7); }, 2);
    pen.paint(() => { g.ellipse(x + ox*s, base - r*s*0.94, r*s*0.22, r*s*0.23, 0, 0, 7); },
              toneSolid(inkLevel(T.dark)), 2);           // the boss
  }
  for (let i=0;i<(broken ? 1 : 3);i++)                    // the heap of helms
    pen.paint(() => { g.ellipse(x + (-0.28 + i*0.22)*s, base + s*0.10 - i*s*0.04,
                                s*0.115, s*0.090, 0, Math.PI, 0); },
              toneSolid(inkLevel(T.stone + 1)), 1.8);
}

/* a small roofed block: town house, storehouse, the palace on its rise */
function block(pen, g, x, base, w, h, tone, roofTone, door){
  pen.paint(() => { g.rect(x - w/2, base - h, w, h); }, tone, 2.5);
  pen.paint(() => {
    g.moveTo(x - w*0.60, base - h); g.lineTo(x, base - h - h*0.44);
    g.lineTo(x + w*0.60, base - h); g.closePath();
  }, roofTone, 2.5);
  if (door) pen.paint(() => { g.rect(x - w*0.16, base - h*0.58, w*0.32, h*0.58); },
                      toneSolid(inkLevel(7)), 2);
}
function stoneRun(pen, g, a, b, th, tone, courses = 6){
  pen.paint(() => {
    g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
    g.lineTo(b.x, b.y + th*0.44); g.lineTo(a.x, a.y + th); g.closePath();
  }, tone, 2.5);
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.6; g.globalAlpha = 0.30;
  for (let i=1;i<courses;i++){
    const k = i/courses, bx = lerp(a.x, b.x, k), by = lerp(a.y, b.y, k);
    g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + lerp(th, th*0.44, k)); g.stroke();
  }
  g.restore();
}
function dashPath(g, pts, lw, alpha, dash){
  g.save(); g.strokeStyle = INK; g.lineWidth = lw; g.globalAlpha = alpha;
  g.lineCap = "round"; g.setLineDash(dash);
  g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
  for (let i=1;i<pts.length;i++) g.lineTo(pts[i].x, pts[i].y);
  g.stroke(); g.setLineDash([]); g.restore();
}

/* ---------- the set ---------- */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode   = MODES.includes(st.state) ? st.state : "mourning";
  const dusk   = mode === "dusk";
  const muster = mode === "muster";
  const pyres  = mode === "pyres";
  const assembly = mode === "assembly";
  const zones  = (st.zonesLit ?? params.zonesLit) || mode === "survey";
  const layers = st.layers || (mode === "bare"
    ? ["sky","hills","ground","town","road-town","display","floor","bema","families","road-farm","caution"]
    : ["sky","hills","sea","town","ground","walls","road-town","display","pyres","floor",
       "bema","families","arms","road-farm","caution","muster","zones","verge","fg"]);
  const has = l => layers.includes(l);

  /* the whole set lights from this one table. LIGHT PLANES, DARK ACCENTS:
     nothing above level 3 covers area; the swept grounds stay at 0. */
  const T = dusk   ? { sky:3, far:3, ridge:4, ground:3, field:4, stone:5, build:4, dark:6, road:2 }
          : muster ? { sky:2, far:3, ridge:4, ground:2, field:3, stone:5, build:3, dark:6, road:1 }
                   : { sky:1, far:2, ridge:3, ground:2, field:3, stone:4, build:3, dark:5, road:1 };

  const hz = params.horizon * H;
  const S  = p => ({ x:p.x*W, y:p.y*H });
  const D  = y => depthAtY(y);

  /* ---- SKY ---- */
  if (has("sky")){
    g.fillStyle = inkLevel(T.sky); g.fillRect(0, 0, W, hz);
    g.fillStyle = inkLevel(T.sky + 1);
    for (let i=0;i<3;i++){
      g.beginPath();
      g.ellipse(W*(0.26 + i*0.26), hz*(0.30 + 0.24*(i%2)), W*0.108, H*0.009, 0, 0, 7); g.fill();
    }
  }

  /* ---- GROUND: the horizon is a tone change, not a rule ---- */
  if (has("ground")){ g.fillStyle = inkLevel(T.ground); g.fillRect(0, hz, W, H - hz); }

  /* ---- HILLS: two humps, neither reaching a frame edge ---- */
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
    hump([[0.040,0.006],[0.14,-0.070],[0.27,-0.030],[0.35,0.000],[0.412,0.006]], T.far, 3.5);
    hump([[0.548,0.006],[0.70,-0.082],[0.83,-0.022],[0.90,0.002],[0.962,0.006]], T.far, 3.5);
    hump([[0.352,0.020],[0.50,-0.016],[0.66,0.004],[0.80,0.022],[0.930,0.018]], T.ridge, 3);
  }

  /* ---- THE HARBOUR: a light strip of water off the east shoulder ---- */
  if (has("sea")){
    g.save();
    g.beginPath();
    g.moveTo(W*0.640, hz + H*0.004);
    g.quadraticCurveTo(W*0.800, hz - H*0.008, W*1.002, hz + H*0.002);
    g.lineTo(W*1.002, hz + H*0.052);
    g.quadraticCurveTo(W*0.840, hz + H*0.062, W*0.662, hz + H*0.046);
    g.closePath();
    g.fillStyle = inkLevel(T.far - 1); g.fill();
    g.strokeStyle = INK; g.lineWidth = 2.4; g.stroke();
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.30;
    for (const [x0, x1, y] of [[0.690,0.760,0.020],[0.820,0.900,0.030],[0.740,0.800,0.040]]){
      g.beginPath(); g.moveTo(W*x0, hz + H*y); g.lineTo(W*x1, hz + H*y); g.stroke();
    }
    g.restore();
  }

  /* ---- THE TOWN on its terrace: the palace, the houses, the gate ---- */
  if (has("town")){
    const base = params.townBase*H;
    for (const [x0, x1] of [[0.116,0.190],[0.230,0.310],[0.360,0.412]])   // terrace, in steps
      pen.paint(() => { g.rect(W*x0, base + H*0.004, W*(x1-x0), H*0.005); },
                toneSolid(inkLevel(2)), 1.8);
    block(pen, g, W*0.232, base - H*0.004, W*0.108, H*0.056,
          toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), true);   // the palace
    g.fillStyle = inkLevel(1);                                                     // its column slots
    for (let i=-2;i<=2;i++) g.fillRect(W*0.232 + i*W*0.019 - W*0.005, base - H*0.048, W*0.010, H*0.036);
    block(pen, g, W*0.128, base - H*0.002, W*0.058, H*0.028,
          toneSolid(inkLevel(T.build + 1)), toneSolid(inkLevel(T.build)), false);
    block(pen, g, W*0.386, base - H*0.002, W*0.064, H*0.030,
          toneSolid(inkLevel(T.build)), toneSolid(inkLevel(T.build + 1)), true);
    block(pen, g, W*0.470, base - H*0.000, W*0.048, H*0.022,
          toneSolid(inkLevel(T.build + 1)), toneSolid(inkLevel(T.build)), false);
    // THE TOWN GATE — the threshold the bodies are carried through
    const gx = 0.294*W, gy = 0.392*H;
    for (const s of [-1, 1])
      pen.paint(() => { g.rect(gx + s*W*0.022 - W*0.005, gy - H*0.034, W*0.010, H*0.034); },
                toneSolid(inkLevel(T.dark)), 2.4);
    pen.paint(() => { g.rect(gx - W*0.030, gy - H*0.042, W*0.060, H*0.010); },
              toneSolid(inkLevel(T.stone)), 2.2);
    pen.paint(() => { g.ellipse(gx, gy + H*0.004, W*0.028, H*0.007, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2.2);
  }

  /* ---- WALLS: short runs of town wall, cut at the gate; never one span ---- */
  if (has("walls")){
    for (const [x0, x1, y0, y1] of [[0.046,0.180,0.420,0.416],
                                    [0.374,0.492,0.414,0.420],
                                    [0.664,0.804,0.430,0.438]])
      stoneRun(pen, g, { x:W*x0, y:H*y0 }, { x:W*x1, y:H*y1 }, H*0.010,
               toneSolid(inkLevel(2)), 6);
  }

  /* ---- THE TOWN ROAD: the way the dead come down from the palace ---- */
  if (has("road-town")) roadBand(pen, g, TOWN_ROAD, W, H, T.road, T.stone);

  /* ---- THE PYRES on the far ground: only when the ground is burning ---- */
  if (has("pyres") && pyres){
    for (const [x, y] of [[0.176,0.470],[0.330,0.480],[0.484,0.490]]){
      const s = W*0.300*D(y), px = x*W, py = y*H;
      for (let i=0;i<3;i++)                       // the crossed stack
        pen.paint(() => { g.rect(px - s*0.40, py - s*0.16 - i*s*0.13, s*0.80, s*0.10); },
                  toneSolid(inkLevel(T.stone + (i%2))), 1.8);
      pen.paint(() => {                            // the flame, cut as facets
        g.moveTo(px - s*0.30, py - s*0.52); g.lineTo(px - s*0.06, py - s*0.96);
        g.lineTo(px + s*0.10, py - s*0.66); g.lineTo(px + s*0.28, py - s*1.06);
        g.lineTo(px + s*0.34, py - s*0.50); g.closePath();
      }, toneSolid(inkLevel(2)), 2.2);
      g.save();                                    // the smoke — the one soft thing
      g.strokeStyle = inkLevel(T.field); g.lineWidth = W*0.008; g.lineCap = "round";
      g.globalAlpha = 0.44;
      g.beginPath(); g.moveTo(px + s*0.06, py - s*1.06);
      g.quadraticCurveTo(px + s*0.44, py - s*1.72, px + s*0.14, py - s*2.30); g.stroke();
      g.restore();
    }
  }

  /* ---- THE BODY DISPLAY: two short runs of bier with a gap between ---- */
  if (has("display")){
    /* the swept ground the biers stand on: an UNCONTOURED light wash, cut in two
       so no oval outline competes with the palls and nothing bars the frame */
    for (const [x0, x1, y0, y1] of [[0.010,0.510,0.500,0.528],[0.560,0.836,0.552,0.566]]){
      g.beginPath();
      g.ellipse(W*(x0+x1)/2, H*(y0+y1)/2 + H*0.014, W*(x1-x0)/2, H*0.030, 0, 0, 7);
      g.fillStyle = inkLevel(0); g.fill();
    }
    BIERS.forEach(b => bier(pen, g, b.x*W, b.y*H, W*0.460*D(b.y), T, !pyres));
    {   // the offering stand, standing in the break between the runs
      const sx = STAND.x*W, sy = STAND.y*H, s = W*0.300*D(STAND.y);
      pen.paint(() => { g.rect(sx - s*0.075, sy - s*0.60, s*0.150, s*0.60); },
                toneSolid(inkLevel(T.build)), 2.2);
      pen.paint(() => { g.ellipse(sx, sy - s*0.64, s*0.22, s*0.10, 0, 0, 7); },
                toneSolid(inkLevel(T.dark)), 2.2);
      pen.paint(() => { g.ellipse(sx, sy + s*0.02, s*0.28, s*0.09, 0, 0, 7); },
                toneSolid(inkLevel(1)), 2.2);
    }
  }

  /* ---- THE CLEARED FLOOR: where the town stands to hear the speakers ---- */
  if (has("floor")){
    pen.paint(() => { g.ellipse(FLOOR.x*W, FLOOR.y*H, FLOOR.rx*W, FLOOR.ry*H, 0, 0, 7); },
              toneSolid(inkLevel(0)), 3.5);
    g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = assembly ? 0.34 : 0.20;
    for (let i=0;i<14;i++){        // radial paving struck from the speaking stone
      const a = Math.PI*2*i/14 + 0.11;
      g.beginPath(); g.moveTo(BEMA.x*W, BEMA.y*H);
      g.lineTo(BEMA.x*W + Math.cos(a)*FLOOR.rx*W*0.94,
               BEMA.y*H + Math.sin(a)*FLOOR.ry*H*0.94); g.stroke();
    }
    g.globalAlpha = assembly ? 0.44 : 0.26;
    g.beginPath(); g.ellipse(FLOOR.x*W, FLOOR.y*H, FLOOR.rx*W*0.62, FLOOR.ry*H*0.62, 0, 0, 7); g.stroke();
    g.restore();
  }

  /* ---- SPEAKER POSITIONS: the raised stone and its two flanking slabs ---- */
  if (has("bema") && params.speakerStone){
    const bx = BEMA.x*W, by = BEMA.y*H, s = W*0.230*D(BEMA.y);
    pen.paint(() => { g.ellipse(bx, by + s*0.20, s*0.52, s*0.16, 0, 0, 7); },
              toneSolid(inkLevel(T.stone - 1)), 3);              // the base slab
    pen.paint(() => { g.rect(bx - s*0.34, by - s*0.20, s*0.68, s*0.36); },
              toneSolid(inkLevel(T.stone + 1)), 3.2);            // the riser
    pen.paint(() => { g.ellipse(bx, by - s*0.20, s*0.40, s*0.13, 0, 0, 7); },
              toneSolid(inkLevel(1)), 3);                        // the standing top
    pen.seam(() => { g.moveTo(bx - s*0.34, by + s*0.02); g.lineTo(bx + s*0.34, by + s*0.00); }, 2.4);
    for (const z of [SLAB_L, SLAB_R]){                           // the two low slabs
      const sx = z.x*W, sy = z.y*H, ss = W*0.150*D(z.y);
      pen.paint(() => { g.ellipse(sx, sy, ss*0.46, ss*0.16, 0, 0, 7); },
                toneSolid(inkLevel(1)), 2.8);
      pen.seam(() => { g.moveTo(sx - ss*0.14, sy); g.lineTo(sx + ss*0.14, sy);
                       g.moveTo(sx, sy - ss*0.07); g.lineTo(sx, sy + ss*0.07); }, 2.4);
    }
  }

  /* ---- THE FAMILY CLUSTERS: four swept grounds, each its own island ---- */
  if (has("families")){
    let k = 0;
    for (const key of ["fam_a","fam_b","fam_c","fam_d"]){
      const z = MEET[key];
      ground(pen, g, z.x*W, z.y*H, z.r*W, z.r*H*0.34, W*0.230*D(z.y), T, z.bars, 6 + (k++ % 3));
    }
  }

  /* ---- THE ARMAMENT POINT + the herm that marks the farm road's head ---- */
  if (has("arms") && params.armsPoint){
    armsStand(pen, g, ARMS.x*W, ARMS.y*H, W*0.240*D(ARMS.y), T, muster);
    const hx = HERM.x*W, hy = HERM.y*H, hs = W*0.200*D(HERM.y);
    pen.paint(() => { g.rect(hx - hs*0.10, hy - hs*0.86, hs*0.20, hs*0.86); },
              toneSolid(inkLevel(T.build)), 2.4);
    pen.paint(() => { g.ellipse(hx, hy - hs*0.92, hs*0.13, hs*0.15, 0, 0, 7); },
              toneSolid(inkLevel(T.stone)), 2.2);
    pen.paint(() => { g.ellipse(hx, hy + hs*0.05, hs*0.34, hs*0.11, 0, 0, 7); },
              toneSolid(inkLevel(1)), 2.2);
  }

  /* ---- THE FARMWARD EXIT ---- */
  if (has("road-farm")) roadBand(pen, g, FARM_ROAD, W, H, T.road, T.stone);

  /* ---- THE CAUTION GROUND: the citizens who refuse to march ---- */
  if (has("caution")){
    const z = MEET.caution;
    ground(pen, g, z.x*W, z.y*H, z.r*W, z.r*H*0.34, W*0.230*D(z.y), T, 0, 4);
    // a broken bench run — two seats with a gap, never one beam
    for (const [x0, y0, x1, y1] of [[0.096,0.874,0.160,0.882],[0.200,0.888,0.268,0.898]]){
      const s = W*0.150*D(y0);
      pen.paint(() => {
        g.moveTo(W*x0, H*y0); g.lineTo(W*x1, H*y1);
        g.lineTo(W*x1, H*y1 + s*0.13); g.lineTo(W*x0, H*y0 + s*0.14); g.closePath();
      }, toneSolid(inkLevel(T.stone)), 2.4);
      for (const k of [0.16, 0.84]){
        const lx = lerp(W*x0, W*x1, k), ly = lerp(H*y0, H*y1, k) + s*0.13;
        pen.paint(() => { g.rect(lx - s*0.045, ly, s*0.090, s*0.20); },
                  toneSolid(inkLevel(T.dark)), 2);
      }
    }
  }

  /* ---- MUSTER: the picket at the road head + the chevroned march ---- */
  if (has("muster") && muster){
    const pts = [[0.664,0.672],[0.704,0.687],[0.744,0.702],[0.784,0.717],[0.824,0.732]];
    for (let i=0;i<pts.length;i++){
      if (i === 2) continue;                            // the gap they file through
      const px = pts[i][0]*W, py = pts[i][1]*H, s = W*0.170*D(pts[i][1]);
      pen.paint(() => { g.rect(px - s*0.030, py - s*0.62, s*0.060, s*0.62); },
                toneSolid(inkLevel(T.stone + 1)), 2);
      if (i%2 === 0)
        pen.paint(() => { g.ellipse(px, py - s*0.56, s*0.115, s*0.095, 0, 0, 7); },
                  toneSolid(inkLevel(T.build)), 2.2);
    }
    g.save(); g.strokeStyle = INK; g.lineWidth = 3.2; g.globalAlpha = 0.62;
    for (let i=0;i<3;i++){                              // the direction of the march
      const k = 1 + i, a = FARM_ROAD[k], b = FARM_ROAD[k+1];
      const dx = b.x-a.x, dy = b.y-a.y, n = Math.hypot(dx*W, dy*H) || 1;
      const ux = dx*W/n, uy = dy*H/n, w = a.hw*W*0.80;
      const cx = (a.x + dx*0.5)*W, cy = (a.y + dy*0.5)*H;
      g.beginPath();
      g.moveTo(cx + uy*w, cy - ux*w);
      g.lineTo(cx + ux*w*1.10, cy + uy*w*1.10);
      g.lineTo(cx - uy*w, cy + ux*w); g.stroke();
    }
    g.restore();
  }

  /* ---- SWEPT GROUNDS + CONTACT PAIRS struck in for previs ---- */
  if (has("zones")){
    for (const [key, z] of Object.entries(MEET)){
      const cx = z.x*W, cy = z.y*H, rx = z.r*W, ry = z.r*H*0.32;
      g.save();
      g.strokeStyle = INK; g.lineWidth = zones ? 3.2 : 2;
      g.globalAlpha = zones ? 0.78 : 0.20;
      g.setLineDash([W*0.012, W*0.010]);
      g.beginPath(); g.ellipse(cx, cy, rx*1.12, ry*1.18, 0, 0, 7); g.stroke();
      g.setLineDash([]);
      if (zones && /^fam_/.test(key)){
        const pair = z.r*0.58*W;
        g.lineWidth = 3.4; g.globalAlpha = 0.92;
        for (const s of [-1, 1]){
          g.beginPath();
          g.moveTo(cx + s*pair - W*0.011, cy); g.lineTo(cx + s*pair + W*0.011, cy);
          g.moveTo(cx + s*pair, cy - H*0.009); g.lineTo(cx + s*pair, cy + H*0.009);
          g.stroke();
        }
      }
      g.restore();
    }
    // the two ways off this ground, dashed: town behind, farm to the east
    dashPath(g, [S({x:0.296,y:0.432}), S({x:0.360,y:0.486}), S({x:0.430,y:0.528})], 2.6, 0.40,
             [W*0.012, W*0.010]);
    dashPath(g, FARM_ROAD.slice(0, 5).map(S), 2.6, 0.40, [W*0.012, W*0.010]);
  }

  /* ---- VERGE: broken field walls flanking the near ground ---- */
  if (has("verge")){
    stoneRun(pen, g, { x:-W*0.010, y:H*0.716 }, { x:W*0.058, y:H*0.732 }, H*0.018,
             toneSolid(inkLevel(T.field)), 5);
    stoneRun(pen, g, { x:W*0.938, y:H*0.902 }, { x:W*1.010, y:H*0.928 }, H*0.024,
             toneSolid(inkLevel(T.field)), 5);
  }

  /* ---- FOREGROUND OCCLUSION: what a figure passes behind ---- */
  if (has("fg")){
    for (const [x, y, r] of [[0.212,1.006,0.052],[0.286,1.020,0.040]]){   // grave jars
      const s = W*r;
      pen.paint(() => { g.ellipse(W*x, H*y - s*0.30, s, s*1.10, 0, 0, 7); },
                toneSolid(inkLevel(T.field)), 3);
      pen.paint(() => { g.ellipse(W*x, H*y - s*1.28, s*0.44, s*0.16, 0, 0, 7); },
                toneSolid(inkLevel(T.stone)), 2.4);
    }
    stoneRun(pen, g, { x:W*0.822, y:H*0.964 }, { x:W*0.960, y:H*0.982 }, H*0.026,
             toneSolid(inkLevel(T.field + 1)), 6);
    g.fillStyle = inkLevel(T.field);
    for (let i=0;i<3;i++){                                               // scattered stones
      const x = W*(0.470 + i*0.062), y = H*(1.010 - 0.006*(i%2));
      g.beginPath(); g.ellipse(x, y, W*0.024, H*0.010, 0, 0, 7); g.fill();
    }
  }
}

export const asset = {
  id:"location.ithacan-meeting-and-funeral-ground",
  type:"LOCATION",
  name:"Ithacan Meeting and Funeral Ground",
  statusWord:"BODIES LAID",
  scene:"OD-B24-S06",

  params,
  // back -> front draw order the set honors; a scene may pass a subset
  layers:["sky","hills","sea","town","ground","walls","road-town","display","pyres","floor",
          "bema","families","arms","road-farm","caution","muster","zones","verge","fg"],
  // occlusion layers a scene may place figures between
  occlusion:{ behind:["sky","hills","sea","town","walls"],
              ground:["ground","road-town","display","pyres","floor","bema","families",
                      "arms","road-farm","caution","muster","zones"],
              front:["verge","fg"] },
  anchors,
  // walkable ground + interaction regions for scene placement and pathing
  zones:{
    walkable:{ x0:.02,y0:.44,x1:.99,y1:.99 },
    display:{ x0:.03,y0:.46,x1:.80,y1:.58 },
    floor:{ x0:.13,y0:.60,x1:.73,y1:.81 },
    bema:{ x0:.36,y0:.65,x1:.48,y1:.73 },
    "speaker-slabs":{ x0:.21,y0:.68,x1:.62,y1:.75 },
    families:{ x0:.02,y0:.58,x1:.73,y1:.94 },
    "family-a":{ x0:.03,y0:.60,x1:.16,y1:.66 },
    "family-b":{ x0:.05,y0:.78,x1:.21,y1:.84 },
    "family-c":{ x0:.27,y0:.86,x1:.45,y1:.93 },
    "family-d":{ x0:.54,y0:.84,x1:.72,y1:.90 },
    arms:{ x0:.76,y0:.72,x1:.99,y1:.84 },
    "farm-road":{ x0:.75,y0:.58,x1:.99,y1:.84 },
    caution:{ x0:.10,y0:.87,x1:.26,y1:.94 },
    "muster-line":{ x0:.64,y0:.65,x1:.84,y1:.75 },
    town:{ x0:.06,y0:.36,x1:.52,y1:.43 },
    threshold_town_gate:{ x0:.26,y0:.36,x1:.33,y1:.41 },
    threshold_farm_herm:{ x0:.76,y0:.57,x1:.84,y1:.63 },
  },
  states:{
    initial:"mourning",
    nodes:{
      // the bodies carried down and laid out, each house at its own ground
      mourning:{ preview:{ state:"mourning" } },
      // the floor cleared, the speaking stone struck in: testimony and warning
      assembly:{ preview:{ state:"assembly" } },
      // arms broken out, the picket up, the road east chevroned
      muster:{ preview:{ state:"muster" } },
      // the biers empty, the pyres burning on the far ground
      pyres:{ preview:{ state:"pyres" } },
      dusk:{ preview:{ state:"dusk" } },
      // swept grounds + contact pairs lit for previs / blocking
      survey:{ preview:{ state:"survey", zonesLit:true } },
      // the navigable set only
      bare:{ preview:{ state:"bare" } },
    },
    edges:[["mourning","assembly"],["assembly","mourning"],["assembly","muster"],
           ["mourning","muster"],["muster","assembly"],["mourning","pyres"],
           ["pyres","mourning"],["assembly","pyres"],["mourning","dusk"],["dusk","mourning"],
           ["pyres","dusk"],["mourning","survey"],["survey","mourning"],
           ["mourning","bare"],["bare","mourning"]],
  },
  channels:["state","reveal","camera","light","zones","grief","muster"],

  preview:()=>({ state:"mourning", t:0, status:"BODIES LAID", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
