/* creature.goat-herd — Melanthius' drove of DOMESTIC goats, driven down the
   narrow Ithaca road past the spring.
   CREATURE asset (quadruped, NOT humanoid): fully custom geometry on engine
   primitives. One reusable GOAT template drawn N times as a DROVE — the read
   here is not a wild herd on a hillside (that is creature.wild-goats) but
   owned stock being PUSHED: bunched, nose-to-tail, funnelled by a bottleneck,
   a drover's crook pressing from behind, dust off the hooves, bell collars,
   rope on the necks of the ones going up as tribute.
   Distinct silhouette from the wild goats on purpose: stockier barrel, shorter
   legs, short back-curled horns (some hornless nannies, one polled kid), long
   PENDULOUS DROP EARS, pied saddle patches, udders, bells.
   Members are placed by DEPTH (far members sit higher, smaller, on a receding
   ground band) so the drove reads as a column in a lane, never a flat lineup.
   Articulation: walk cycle phase, gallop, brace/balk, headDrop, gaze/alert,
   jaw (bleat), plus bound-legs and roped states.
   Light planes, dark accents (hoof / horn / bell / rope); the engine POST pass
   supplies the dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B17-S02 — driven animals passing through narrow road and fountain space. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});

/* ---- tone levels. The drove prints LIGHT: hides at 2, so the hard black
   contour, the hooves, the horns and the bells are the only dark marks and
   plenty of paper stays open between the animals. ---- */
const T_BODY   = ()=> toneSolid(inkLevel(2));   // pale domestic hide
const T_BELLY  = ()=> toneSolid(inkLevel(1));   // paler underline
const T_PATCH  = ()=> toneSolid(inkLevel(4));   // pied saddle / rump patch
const T_NECK   = ()=> toneSolid(inkLevel(2));
const T_HEAD   = ()=> toneSolid(inkLevel(2));
const T_MUZZLE = ()=> toneSolid(inkLevel(1));
const T_NEARLEG= ()=> toneSolid(inkLevel(3));
const T_FARLEG = ()=> toneSolid(inkLevel(4));
const T_HOOF   = ()=> toneSolid(inkLevel(6));   // hard split hoof
const T_HORN   = ()=> toneSolid(inkLevel(5));
const T_HORNFAR= ()=> toneSolid(inkLevel(4));
const T_EAR    = ()=> toneSolid(inkLevel(3));
const T_EARFAR = ()=> toneSolid(inkLevel(2));
const T_BEARD  = ()=> toneSolid(inkLevel(4));
const T_TAIL   = ()=> toneSolid(inkLevel(3));
const T_UDDER  = ()=> toneSolid(inkLevel(3));
const T_COLLAR = ()=> toneSolid(inkLevel(6));
const T_BELL   = ()=> toneSolid(inkLevel(6));
const T_ROPE   = ()=> toneSolid(inkLevel(5));
const T_STAFF  = ()=> toneSolid(inkLevel(6));

/* ---------- shared skeleton math. drawGoat() and the rope/bell riggers both
   resolve positions through this, so a collar drawn by the rope pass lands on
   exactly the collar the animal is wearing. ---------- */
function goatGeom(cx, groundY, S, dir, o={}){
  const gsc      = o.gsc ?? 1;
  const headDrop = clamp(o.headDrop ?? 0, 0, 1);
  const gallop   = o.gallop ?? 0;
  const brace    = o.brace ?? 0;

  const U    = S*0.20*gsc;
  const back = S*0.158*gsc;                 // withers height
  const gY   = groundY - gallop*back*0.14;  // a bounding goat clears the ground

  const shoulderX = cx + dir*U*0.34;
  const hipX      = cx - dir*U*0.46;

  const wither = P(shoulderX + dir*U*0.02, gY - back*1.00);
  const croup  = P(hipX + dir*U*0.06,      gY - back*0.96);
  const rump   = P(hipX - dir*U*0.20,      gY - back*0.62);
  const bellyR = P(hipX + dir*U*0.08,      gY - back*0.44);
  const bellyF = P(shoulderX - dir*U*0.06, gY - back*0.42);
  const chest  = P(shoulderX + dir*U*0.26, gY - back*0.60);

  // head: carried high on a long neck (driven) -> down (drinking at the spring)
  const HCraise = P(shoulderX + dir*U*(0.72 + brace*0.10), gY - back*(1.62 + brace*0.08));
  const HCgraze = P(shoulderX + dir*U*0.88,                gY - back*0.14);
  const HC = P(lerp(HCraise.x, HCgraze.x, headDrop), lerp(HCraise.y, HCgraze.y, headDrop));
  const hr = U*0.32;

  // collar sits on the neck axis, chest -> head
  const cf = 0.52;
  const collar = P(lerp(chest.x, HC.x, cf), lerp(chest.y, HC.y, cf));
  const nAng = Math.atan2(HC.y - chest.y, HC.x - chest.x);

  return { U, back, gY, gsc, shoulderX, hipX, wither, croup, rump,
           bellyR, bellyF, chest, HC, hr, collar, nAng };
}

/* one short cloven leg: two segments + a split hoof block */
function drawLeg(pen, hip, knee, foot, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.82);
  pen.paint(()=>{ g.rect(foot.x - w*0.56, foot.y - w*0.04, w*0.46, w*0.44); }, T_HOOF(), 2.6);
  pen.paint(()=>{ g.rect(foot.x + w*0.10, foot.y - w*0.04, w*0.46, w*0.44); }, T_HOOF(), 2.6);
}

/* short back-curled domestic horn (a scimitar third the length of a wild
   goat's sweep). off separates the pair; tone/lw give near vs far. */
function drawHorn(pen, HC, hr, dir, off, tone, lw, len=1.0){
  const g = pen.ctx;
  const bx = HC.x - dir*hr*0.10 + off, by = HC.y - hr*0.70;
  const tx = bx - dir*hr*1.10*len,     ty = by - hr*0.42*len;   // tip: back, only just above the poll
  pen.paint(()=>{
    g.moveTo(bx + dir*hr*0.30, by);
    g.quadraticCurveTo(bx - dir*hr*0.14*len, by - hr*1.05*len,  // rises off the poll
                       tx, ty);                                  // then curls back
    g.quadraticCurveTo(bx - dir*hr*0.26*len, by - hr*0.48*len,  // under-curve home
                       bx - dir*hr*0.14, by + hr*0.02);
    g.closePath();
  }, tone, lw);
  pen.ink(()=>{ for(let i=1;i<=2;i++){ const f=i/3;
    const x=lerp(bx + dir*hr*0.06, tx, f), y=lerp(by - hr*0.52*len, ty, f);
    g.moveTo(x - dir*hr*0.12, y); g.lineTo(x + dir*hr*0.10, y + hr*0.13); } }, 2.2);
}

/* long PENDULOUS DROP EAR — the domestic-goat read. hangs past the jaw;
   alert swings it out and forward. */
function drawDropEar(pen, HC, hr, dir, tone, alert, side){
  const g = pen.ctx;
  const sw = lerp(0.0, 0.60, alert);                    // swing outward
  const bx = HC.x - dir*hr*(0.10 + side*0.14);
  const by = HC.y - hr*(0.34 - side*0.06);
  pen.paint(()=>{
    g.moveTo(bx + dir*hr*0.20, by - hr*0.10);
    g.quadraticCurveTo(bx - dir*hr*(0.85+sw*1.10), by + hr*(0.60-sw*0.70),
                       bx - dir*hr*(0.70+sw*1.85), by + hr*(1.62-sw*1.20));
    g.quadraticCurveTo(bx - dir*hr*(0.10+sw*0.85), by + hr*(1.52-sw*0.95),
                       bx + dir*hr*0.26, by + hr*0.46);
    g.closePath();
  }, tone, 3.4);
}

/* the goat HEAD: short straight-profile skull, eye, drop ears, horns, beard. */
function drawHead(pen, HC, hr, dir, o={}){
  const g = pen.ctx;
  const alert = o.alert ?? 0, gaze = o.gaze ?? 0, jaw = o.jaw ?? 0;

  if (o.horns !== "none") drawHorn(pen, HC, hr, dir, -dir*hr*0.20, T_HORNFAR(), 3.0,
                                   o.horns==="nub" ? 0.34 : 0.84);
  drawDropEar(pen, HC, hr, dir, T_EARFAR(), alert, 1);      // far ear behind skull

  // short blocky skull: poll -> brow -> straight muzzle -> jaw
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.44, HC.y - hr*0.68);
    g.quadraticCurveTo(HC.x + dir*hr*0.50, HC.y - hr*0.66,
                       HC.x + dir*hr*0.92, HC.y - hr*0.26);
    g.lineTo(HC.x + dir*hr*1.32, HC.y + hr*0.16);                    // straight nose bridge
    g.quadraticCurveTo(HC.x + dir*hr*1.34, HC.y + hr*0.46,
                       HC.x + dir*hr*1.10, HC.y + hr*(0.60 + jaw*0.55));
    g.quadraticCurveTo(HC.x + dir*hr*0.30, HC.y + hr*(0.86 + jaw*0.42),
                       HC.x - dir*hr*0.32, HC.y + hr*0.46);
    g.closePath();
  }, T_HEAD(), 4);

  // pale muzzle block
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.86, HC.y - hr*0.10);
    g.lineTo(HC.x + dir*hr*1.30, HC.y + hr*0.18);
    g.quadraticCurveTo(HC.x + dir*hr*1.30, HC.y + hr*0.46,
                       HC.x + dir*hr*1.06, HC.y + hr*0.56);
    g.lineTo(HC.x + dir*hr*0.84, HC.y + hr*0.30);
    g.closePath();
  }, T_MUZZLE(), 3);

  // open mouth on a bleat
  if (jaw > 0.05){
    pen.paint(()=>{
      g.moveTo(HC.x + dir*hr*1.16, HC.y + hr*0.44);
      g.lineTo(HC.x + dir*hr*0.62, HC.y + hr*0.52);
      g.lineTo(HC.x + dir*hr*0.78, HC.y + hr*(0.52 + jaw*0.52));
      g.lineTo(HC.x + dir*hr*1.06, HC.y + hr*(0.50 + jaw*0.40));
      g.closePath();
    }, toneSolid(inkLevel(6)), 2.6);
  }

  if (o.beard){
    pen.paint(()=>{
      const bx = HC.x + dir*hr*0.34, by = HC.y + hr*(0.78 + jaw*0.30);
      g.moveTo(bx - dir*hr*0.28, by - hr*0.06);
      g.lineTo(bx + dir*hr*0.22, by);
      g.quadraticCurveTo(bx + dir*hr*0.10, by + hr*0.98, bx - dir*hr*0.06, by + hr*1.10);
      g.quadraticCurveTo(bx - dir*hr*0.26, by + hr*0.62, bx - dir*hr*0.28, by - hr*0.06);
      g.closePath();
    }, T_BEARD(), 3);
  }

  if (o.horns !== "none") drawHorn(pen, HC, hr, dir, dir*hr*0.02, T_HORN(), 3.4,
                                   o.horns==="nub" ? 0.38 : 1.0);
  drawDropEar(pen, HC, hr, dir, T_EAR(), alert, 0);        // near ear over the skull

  // eye + nostril
  const ey = HC.y - hr*0.14 + gaze*hr*0.18;
  g.fillStyle = INK; g.beginPath();
  g.ellipse(HC.x + dir*hr*0.48, ey, hr*0.19, hr*0.15, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(HC.x + dir*hr*1.16, HC.y + hr*0.26, hr*0.11, hr*0.08, 0, 0, 7); g.fill();
}

/* bell collar: band across the neck axis + a dark trapezoid bell and clapper.
   The sound of the drove coming down the road, drawn. */
function drawCollar(pen, G, dir, bell){
  const g = pen.ctx;
  const w = G.hr*0.95, a = G.nAng;
  const nx = -Math.sin(a), ny = Math.cos(a);
  pen.limb(()=>{ g.moveTo(G.collar.x - nx*w, G.collar.y - ny*w);
                 g.lineTo(G.collar.x + nx*w, G.collar.y + ny*w); }, T_COLLAR(), G.hr*0.20);
  if (!bell) return;
  const bx = G.collar.x + nx*w*0.55, by = G.collar.y + ny*w*0.55 + G.hr*0.10;
  pen.paint(()=>{
    g.moveTo(bx - G.hr*0.21, by);
    g.lineTo(bx + G.hr*0.21, by);
    g.lineTo(bx + G.hr*0.34, by + G.hr*0.62);
    g.lineTo(bx - G.hr*0.34, by + G.hr*0.62);
    g.closePath();
  }, T_BELL(), 3);
  g.fillStyle = INK; g.beginPath();
  g.arc(bx, by + G.hr*0.64, G.hr*0.10, 0, 7); g.fill();
}

/* ONE goat. Everything the rig drives lives in opts:
     headDrop 0..1  raised -> nose in the spring
     alert    0..1  ear swing + gaze
     jaw      0..1  bleat
     gait     0..1  walk-cycle amplitude, driven by `phase`
     gallop   0..1  frozen bound (bolting)
     brace    0..1  balking: forefeet planted, weight back
     horns    "curl" | "nub" | "none"   patch 0|1|2   bell/beard/udder/bound  */
function drawGoat(pen, cx, groundY, S, dir, o={}){
  const g = pen.ctx;
  const G = goatGeom(cx, groundY, S, dir, o);
  const { U, back, gY, shoulderX, hipX, wither, croup, rump, bellyR, bellyF, chest, HC, hr } = G;
  const gait = o.gait ?? 0, ph = o.phase ?? 0, gallop = o.gallop ?? 0, brace = o.brace ?? 0;

  // ground shadow (an oval, never a bar)
  g.save(); g.fillStyle="rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, groundY+3, U*0.72, U*0.12, 0, 0, 7); g.fill(); g.restore();

  // ---- short flag TAIL, cocked back over the rump ----
  const tb = P(hipX - dir*U*0.16, gY - back*0.88);
  pen.limb(()=>{ g.moveTo(tb.x, tb.y);
    g.quadraticCurveTo(hipX - dir*U*0.34, gY - back*1.00,
                       hipX - dir*U*0.40, gY - back*1.08); }, T_TAIL(), U*0.055);

  // ---- foot targets ----
  const swF = gait*Math.sin(ph)*U*0.26 + gallop*dir*U*0.56 + brace*dir*U*0.34;
  const swR = gait*Math.sin(ph + 2.9)*U*0.24 - gallop*dir*U*0.50 - brace*dir*U*0.06;
  const swFf = gait*Math.sin(ph + Math.PI)*U*0.22 + gallop*dir*U*0.40 + brace*dir*U*0.22;
  const swRf = gait*Math.sin(ph + 2.9 + Math.PI)*U*0.20 - gallop*dir*U*0.36;
  const kb = (gallop + brace)*U*0.09;

  // ---- FAR legs ----
  const fo = dir*U*0.07;
  drawLeg(pen, P(shoulderX-fo, gY-back*0.62), P(shoulderX-fo+dir*U*0.03+kb, gY-back*0.30),
          P(shoulderX-fo+swFf, gY), U*0.066, T_FARLEG());
  drawLeg(pen, P(hipX-fo, gY-back*0.62), P(hipX-fo+dir*U*0.02-kb, gY-back*0.30),
          P(hipX-fo+swRf, gY), U*0.066, T_FARLEG());

  // ---- deep stocky barrel ----
  pen.paint(()=>{
    g.moveTo(chest.x, chest.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.20, wither.y - back*0.02, wither.x, wither.y);
    g.quadraticCurveTo(cx + dir*U*0.02, gY - back*1.02, croup.x, croup.y);
    g.quadraticCurveTo(hipX - dir*U*0.18, croup.y + back*0.08, rump.x, rump.y);
    g.quadraticCurveTo(hipX - dir*U*0.10, bellyR.y, bellyR.x, bellyR.y);
    g.quadraticCurveTo(cx, bellyR.y + back*0.14, bellyF.x, bellyF.y);
    g.quadraticCurveTo(shoulderX + dir*U*0.14, bellyF.y - back*0.04, chest.x, chest.y);
    g.closePath();
  }, T_BODY(), 4.5);

  // pale underline — FILL ONLY. (A contour here would draw a hard horizontal
  // bar the width of the barrel across every animal in the drove.)
  pen.fillPath(()=>{ g.ellipse(cx + dir*U*0.02, gY - back*0.46, U*0.44, back*0.16, 0, 0, 7); },
               inkLevel(1));

  // pied saddle / rump patch — the dark accent that keeps the herd from
  // reading as one flat gray mass
  if (o.patch === 1){
    pen.paint(()=>{
      g.moveTo(cx + dir*U*0.10, gY - back*0.99);
      g.quadraticCurveTo(cx - dir*U*0.12, gY - back*1.01, cx - dir*U*0.30, gY - back*0.93);
      g.quadraticCurveTo(cx - dir*U*0.18, gY - back*0.60, cx + dir*U*0.06, gY - back*0.64);
      g.quadraticCurveTo(cx + dir*U*0.16, gY - back*0.82, cx + dir*U*0.10, gY - back*0.99);
      g.closePath();
    }, T_PATCH(), 3);
  } else if (o.patch === 2){
    pen.paint(()=>{
      g.moveTo(hipX + dir*U*0.14, gY - back*0.96);
      g.quadraticCurveTo(hipX - dir*U*0.16, gY - back*0.92, rump.x + dir*U*0.02, rump.y);
      g.quadraticCurveTo(hipX + dir*U*0.02, gY - back*0.44, hipX + dir*U*0.20, gY - back*0.56);
      g.closePath();
    }, T_PATCH(), 3);
  }

  // shaggy belly fringe (long-haired stock)
  pen.ink(()=>{ for(let i=-2;i<=2;i++){
    const x = cx + i*U*0.16, y = gY - back*0.32;
    g.moveTo(x, y); g.lineTo(x - dir*U*0.04, y + back*0.12); } }, 2);

  if (o.udder){
    pen.paint(()=>{ g.ellipse(hipX + dir*U*0.16, gY - back*0.26, U*0.16, back*0.14, 0, 0, 7); }, T_UDDER(), 3);
  }

  // ---- neck wedge ----
  pen.paint(()=>{
    g.moveTo(wither.x + dir*U*0.04, wither.y + back*0.02);
    g.quadraticCurveTo(lerp(shoulderX,HC.x,0.5) + dir*U*0.08, lerp(wither.y,HC.y,0.5) - back*0.08,
                       HC.x - dir*hr*0.34, HC.y - hr*0.52);
    g.lineTo(HC.x + dir*hr*0.16, HC.y + hr*0.50);
    g.quadraticCurveTo(chest.x + dir*U*0.12, chest.y - back*0.04, chest.x, chest.y);
    g.closePath();
  }, T_NECK(), 4.5);

  drawHead(pen, HC, hr, dir, { alert:o.alert||0, gaze:(o.alert||0)*0.3 + (o.headDrop||0)*0.4,
                               jaw:o.jaw||0, horns:o.horns||"curl", beard:o.beard });

  if (o.bell || o.collar) drawCollar(pen, G, dir, !!o.bell);

  // ---- NEAR legs (over the barrel) ----
  drawLeg(pen, P(shoulderX, gY-back*0.62), P(shoulderX+dir*U*0.04+kb, gY-back*0.30),
          P(shoulderX+swF, gY), U*0.080, T_NEARLEG());
  drawLeg(pen, P(hipX, gY-back*0.62), P(hipX+dir*U*0.02-kb, gY-back*0.30),
          P(hipX+swR, gY), U*0.080, T_NEARLEG());

  // ---- forelegs roped together: livestock handed over as tribute ----
  if (o.bound){
    const ax = shoulderX + swF*0.5, ay = gY - back*0.14;
    pen.limb(()=>{ g.moveTo(ax - U*0.16, ay); g.lineTo(ax + U*0.16, ay); }, T_ROPE(), U*0.055);
    pen.limb(()=>{ g.moveTo(ax - U*0.14, ay + U*0.07); g.lineTo(ax + U*0.14, ay + U*0.07); }, T_ROPE(), U*0.045);
  }
  return G;
}

/* the drover's crook entering from behind the drove: a staff with a hooked
   head. No figure — the pressure is what the herd asset owns. */
function drawCrook(pen, x0, y0, x1, y1, U){
  const g = pen.ctx;
  // stroked directly, not through limb(): limb() adds a heavy black casing and
  // the goad would out-weigh the animals it is driving.
  g.save(); g.strokeStyle = inkLevel(6); g.lineWidth = Math.max(5, U*0.075); g.lineCap="round";
  g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.stroke();
  g.beginPath(); g.moveTo(x1,y1);
  g.quadraticCurveTo(x1 + U*0.34, y1 - U*0.14, x1 + U*0.20, y1 - U*0.38); g.stroke();
  g.restore();
}

/* dust kicked off the hooves — short ticks + open rings, never a cloud wash */
function drawDust(pen, x, y, U, n, seed){
  const g = pen.ctx;
  g.save(); g.strokeStyle = inkLevel(5); g.lineWidth = 4.2; g.lineCap="round";
  for(let i=0;i<n;i++){
    const a = (seed + i*2.399);
    const dx = Math.cos(a)*U*(0.34 + (i%3)*0.26), dy = -Math.abs(Math.sin(a))*U*0.30;
    g.beginPath(); g.moveTo(x+dx, y+dy); g.lineTo(x+dx - U*0.22, y+dy + U*0.07); g.stroke();
  }
  g.restore();
  g.save(); g.strokeStyle = inkLevel(3); g.lineWidth = 4;
  for(let i=0;i<Math.max(2,n>>1);i++){
    const a = seed + i*1.7;
    g.beginPath(); g.arc(x + Math.cos(a)*U*0.55, y - Math.abs(Math.sin(a))*U*0.38, U*0.16, 0.6, 4.2); g.stroke();
  }
  g.restore();
}

/* the spring: a broken water lip with ripple arcs. Not a full-width band. */
function drawWaterLip(pen, W, y, x0, x1){
  const g = pen.ctx;
  g.save(); g.strokeStyle = inkLevel(3); g.lineWidth = 3.4; g.lineCap="round";
  for (let i=0;i<6;i++){
    const a = lerp(x0, x1, i/6 + 0.01), b = lerp(x0, x1, (i+1)/6 - 0.05);
    g.beginPath(); g.moveTo(a, y + (i%2)*3); g.lineTo(b, y + (i%2)*3); g.stroke();
  }
  g.strokeStyle = inkLevel(2); g.lineWidth = 2.6;
  for (let i=0;i<4;i++){
    const cx = lerp(x0, x1, 0.14 + i*0.24);
    g.beginPath(); g.arc(cx, y + 16, 14 + i*4, Math.PI*1.12, Math.PI*1.88); g.stroke();
  }
  g.restore();
}

/* ================= DROVE LAYOUT =================
   member: { x 0..1, d 0..1 depth (1 = nearest), dir, + rig opts }
   Depth resolves to a ground line and a scale, so the drove recedes up the
   lane instead of standing in a row. */
function layoutFor(pose){
  switch(pose){
    case "drove": return {
      goats:[
        {x:0.46, d:0.08, dir:+1, gait:1, phase:0.4, horns:"none", alert:0.3, patch:2, udder:true},
        {x:0.60, d:0.34, dir:+1, gait:1, phase:2.6, horns:"curl", alert:0.2, bell:true},
        {x:0.38, d:0.56, dir:+1, gait:1, phase:1.3, horns:"nub",  alert:0.4, patch:1, gsc:0.76},
        {x:0.58, d:0.78, dir:+1, gait:1, phase:4.1, horns:"curl", alert:0.5, beard:true, bell:true, patch:1},
        {x:0.40, d:1.00, dir:+1, gait:1, phase:5.4, horns:"none", alert:0.3, patch:2, udder:true},
      ], crook:true, dust:[{x:0.66,d:0.98,n:5,seed:1.1}],
    };
    case "squeeze": return {   // funnelled to a file through the bottleneck
      goats:[
        {x:0.47, d:0.06, dir:+1, gait:1, phase:0.9, horns:"curl", alert:0.6},
        {x:0.52, d:0.30, dir:+1, gait:1, phase:2.2, horns:"none", alert:0.7, udder:true, patch:2},
        {x:0.44, d:0.58, dir:+1, gait:1, phase:3.6, horns:"nub",  alert:0.8, gsc:0.74},
        {x:0.54, d:0.88, dir:+1, gait:1, phase:5.0, horns:"curl", alert:0.9, bell:true, beard:true, patch:1},
      ], crook:true, dust:[{x:0.50,d:0.94,n:7,seed:0.4}],
    };
    case "drink": return {     // heads down at the sacred spring
      goats:[
        {x:0.30, d:0.16, dir:+1, headDrop:0.92, horns:"none", patch:2, udder:true},
        {x:0.66, d:0.38, dir:-1, headDrop:1.00, horns:"curl", bell:true},
        {x:0.34, d:0.66, dir:+1, headDrop:0.88, horns:"nub", gsc:0.74},
        {x:0.68, d:0.94, dir:-1, headDrop:1.00, horns:"curl", beard:true, patch:1, bell:true},
      ], water:true,
    };
    case "balk": return {      // one animal plants and bleats; the drove piles up
      goats:[
        {x:0.62, d:0.16, dir:+1, gait:1, phase:1.8, horns:"none", alert:0.6, udder:true},
        {x:0.66, d:0.48, dir:+1, gait:1, phase:3.4, horns:"nub", alert:0.7, gsc:0.76, patch:2},
        {x:0.38, d:0.92, dir:+1, brace:1, horns:"curl", alert:1.0, jaw:1.0, beard:true, bell:true, patch:1},
      ], crook:true, dust:[{x:0.44,d:0.96,n:5,seed:2.7}],
    };
    case "tribute": return {   // roped collar-to-collar, going up to the palace
      goats:[
        {x:0.32, d:0.22, dir:+1, gait:1, phase:1.0, horns:"none", alert:0.6, collar:true, patch:2},
        {x:0.62, d:0.50, dir:+1, gait:1, phase:2.8, horns:"nub",  alert:0.7, collar:true, gsc:0.80},
        {x:0.38, d:0.96, dir:+1, horns:"curl", alert:0.9, beard:true, bell:true, bound:true, patch:1},
      ], rope:true,
    };
    case "scatter": return {   // the drove breaks
      goats:[
        {x:0.26, d:0.24, dir:-1, gallop:1, horns:"none", alert:1.0, udder:true},
        {x:0.70, d:0.44, dir:+1, gallop:1, horns:"curl", alert:1.0, bell:true, patch:1},
        {x:0.34, d:0.74, dir:-1, gallop:1, horns:"nub",  alert:1.0, gsc:0.76},
        {x:0.72, d:1.00, dir:+1, gallop:1, horns:"curl", alert:1.0, beard:true, patch:2},
      ], dust:[{x:0.30,d:0.80,n:6,seed:3.3},{x:0.74,d:1.0,n:6,seed:1.9}],
    };
    default: return layoutFor("drove");
  }
}

const groundOf = (H, d) => lerp(H*0.31, H*0.86, d);
const scaleOf  = (d)     => lerp(0.62, 1.14, d);

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 0.86;
  const t = state.t || 0;
  const L = layoutFor(state.pose || "drove");

  if (L.water) drawWaterLip(pen, W, groundOf(H,1.0)+18, W*0.16, W*0.86);

  // the crook pressing in from behind the drove
  if (L.crook) drawCrook(pen, W*0.03, groundOf(H,1.04),
                         W*0.20, groundOf(H,0.79), S*0.24);

  // near-side dust, behind the animals
  for (const dz of (L.dust||[])) drawDust(pen, W*dz.x, groundOf(H,dz.d), S*0.20*scaleOf(dz.d), dz.n, dz.seed);

  // rope string through the collars (computed from the same skeleton)
  if (L.rope){
    const pts = L.goats.map(m=>{
      const G = goatGeom(W*m.x, groundOf(H,m.d), S, m.dir,
        { gsc:(m.gsc||1)*scaleOf(m.d), headDrop:m.headDrop||0, brace:m.brace||0, gallop:m.gallop||0 });
      return G.collar;
    });
    // stroked directly (limb() would put a heavy black casing on a rope and
    // stripe the frame with it)
    ctx.save(); ctx.strokeStyle = inkLevel(5); ctx.lineWidth = 5; ctx.lineCap="round";
    for (let i=0;i<pts.length-1;i++){
      const a = pts[i], b = pts[i+1];
      ctx.beginPath(); ctx.moveTo(a.x,a.y);
      ctx.quadraticCurveTo((a.x+b.x)/2, (a.y+b.y)/2 + S*0.05, b.x, b.y); ctx.stroke();
    }
    // the lead rope, taut off toward the palace — stops at the frame edge, short
    const lead = pts[0];
    ctx.beginPath(); ctx.moveTo(lead.x, lead.y);
    ctx.quadraticCurveTo(W*0.80, lead.y - H*0.05, W*0.97, groundOf(H,0.0) - S*0.10);
    ctx.stroke();
    ctx.restore();
  }

  // the drove, far members first
  const sorted = [...(L.goats||[])].sort((a,b)=>a.d-b.d);
  for (const m of sorted){
    const gsc = (m.gsc || 1) * scaleOf(m.d);
    drawGoat(pen, W*m.x, groundOf(H, m.d), S, m.dir, {
      ...m, gsc, phase:(m.phase||0) + t*0.9,
    });
  }
}

export const asset = {
  id:"creature.goat-herd",
  type:"CREATURE",
  name:"Goat herd",
  statusWord:"DRIVEN",
  scene:"OD-B17-S02",

  // procedural knobs
  params:{
    drove:5,               // members driven in the drove
    hide:"#ded4c2",        // pale domestic hide
    hornCurl:0.9,          // 0..1 length of the short back-curl (0 => polled)
    dropEars:true,         // pendulous ears — the domestic read
    bells:true,            // bell collars on the lead animals
    pied:true,             // dark saddle/rump patches
    laneWidth:0.34,        // 0..1 bottleneck width the drove is funnelled through
    collision:true,        // barrel + trotter footprint used for collision
  },
  // back -> front draw order the scene honors
  layers:["water","crook","dust","rope","shadow","tail","far-legs","body",
          "belly","patch","fringe","udder","neck","far-horn","far-ear","head",
          "muzzle","beard","near-horn","near-ear","collar","bell","near-legs","bindings"],
  // normalized 0..1 attention / contact / placement anchors
  anchors:{
    "drove:center":{x:.50,y:.60}, "drove:lead":{x:.30,y:.74}, "drove:tail":{x:.30,y:.42},
    "goat:head-lead":{x:.40,y:.58}, "goat:collar-lead":{x:.36,y:.62},
    "goat:drink":{x:.68,y:.76}, "goat:balk":{x:.38,y:.68},
    "drover:goad":{x:.06,y:.66}, "tribute:rope":{x:.97,y:.17},
    "lane:enter":{x:.50,y:.38}, "lane:exit":{x:.50,y:.94},
    "camera:drove":{x:.50,y:.58},
  },
  // footprints for placement / pathing / collision
  zones:{
    "drove:body":{ x0:.16,y0:.36,x1:.86,y1:.80 },
    walkable:{ x0:.10,y0:.38,x1:.90,y1:.92 },
    "lane:narrow":{ x0:.33,y0:.36,x1:.67,y1:.92 },
    "collision:barrel":{ x0:.22,y0:.56,x1:.62,y1:.78 },
    "spring:water":{ x0:.16,y0:.76,x1:.86,y1:.88 },
  },
  states:{
    initial:"drove",
    nodes:{
      drove:{   preview:{ pose:"drove",   t:0.2 } },  // pushed down the road, bunched
      squeeze:{ preview:{ pose:"squeeze", t:0.5 } },  // funnelled to a file at the bottleneck
      drink:{   preview:{ pose:"drink",   t:0.3 } },  // heads down at the sacred spring
      balk:{    preview:{ pose:"balk",    t:0.6 } },  // one plants and bleats, drove piles up
      tribute:{ preview:{ pose:"tribute", t:0.4 } },  // roped in a string, led up as tribute
      scatter:{ preview:{ pose:"scatter", t:0.8 } },  // the drove breaks and bolts
    },
    edges:[
      ["drove","squeeze"],["squeeze","drove"],["squeeze","drink"],["drink","drove"],
      ["drove","balk"],["balk","drove"],["balk","scatter"],["squeeze","scatter"],
      ["drove","tribute"],["tribute","drove"],["scatter","drove"],
    ],
  },
  channels:["pose","gait","gaze","alert","jaw","headDrop","density","t"],

  preview:()=>({ pose:"drove", t:0.2, status:"DRIVEN", progress:.26 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
