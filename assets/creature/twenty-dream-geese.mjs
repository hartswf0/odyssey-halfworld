/* creature.twenty-dream-geese — the flock in Penelope's dream (Book XIX).
   CREATURE asset (bird, NOT humanoid): fully custom geometry on engine
   primitives. ONE reusable domestic-goose template drawn exactly TWENTY times,
   deterministically, as an individually COUNTABLE flock — twenty is the number
   the dream states aloud, so the asset must survive being counted.

   The read is DOMESTIC, not wild: fat white farmyard geese with heavy bodies,
   short legs, blunt bills, feeding on scattered wheat out of broken troughs
   inside the house. Then the mountain eagle: only its SHADOW and its stoop
   line live here (the raptor itself is divine-fx.dream-eagle-with-odysseus-voice
   — this asset must not compete with it). What this asset owns is what happens
   to the BIRDS: the panic, the broken necks, the fallen array laid out in rows
   so the dreamer can count her twenty dead, and the dream-reset in which the
   whole flock re-materialises at the trough as if nothing happened.

   Performances (states):
     feed    — twenty geese feeding at the troughs, heads down, calm
     alarm   — necks up, heads high, the flock reads the sky
     attack  — the stoop: shadow across the floor, birds bolting, first dead
     fallen  — the countable ARRAY: twenty dead in rows, necks broken, tally
     reset   — the dream loops: the flock returns as faint ghosts at the trough

   Light planes (hides at ink level 1–2), dark accents only on bills, feet,
   eyes, wing coverts and grain. The engine POST pass supplies the halftone —
   do NOT pre-dither. Atlas: OD-B19-S06. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});
const TAU = Math.PI*2;
/* deterministic per-index jitter — no Math.random anywhere */
const h1 = i => { const s = Math.sin((i+1)*12.9898)*43758.5453; return s - Math.floor(s); };

/* ---- tone levels. The flock prints LIGHT: white domestic plumage at 1, a
   level-3 folded covert to keep twenty birds from reading as empty outlines,
   and the only heavy marks are bills, webbed feet, eyes and spilled grain. ---- */
const T_BODY   = ()=> toneSolid(inkLevel(1));   // white domestic plumage
const T_COVERT = ()=> toneSolid(inkLevel(3));   // folded wing / flank shade
const T_PRIMARY= ()=> toneSolid(inkLevel(4));   // open-wing primaries
const T_HEAD   = ()=> toneSolid(inkLevel(1));
const T_BILL   = ()=> toneSolid(inkLevel(5));   // blunt domestic bill
const T_LEG    = ()=> toneSolid(inkLevel(3));
const T_FOOT   = ()=> toneSolid(inkLevel(4));   // webbed foot
const T_TROUGH = ()=> toneSolid(inkLevel(2));
const T_TROUGHD= ()=> toneSolid(inkLevel(4));   // trough rim, the dark accent
const T_SHADOW = ()=> toneSolid(inkLevel(2));   // the raptor's shadow on the floor

/* ================= ONE GOOSE — shared skeleton =================
   Every rigger (neck, bill, feet, the broken-neck pass) resolves through this,
   so a bill drawn by the head pass lands on the head the body pass built. */
function gooseGeom(cx, groundY, S, dir, o={}){
  const gsc  = o.gsc ?? 1;
  const U    = S*0.072*gsc;                    // the goose unit
  const dead = clamp(o.dead ?? 0, 0, 1);
  const headDrop = clamp(o.headDrop ?? 0, 0, 1);
  const alarm    = clamp(o.alarm ?? 0, 0, 1);

  const bodyCy = groundY - U*(dead ? 0.34 : 0.94);
  const bodyRx = U*0.70, bodyRy = U*0.44;
  const chest  = P(cx + dir*U*0.50, bodyCy - U*0.18);

  // head: down in the grain -> carried level -> stretched up on alarm.
  // The fed head stops WELL above the floor (trough-rim height) — a head laid
  // flat on the ground turns the neck into a bar that chains bird to bird.
  const HCup = P(cx + dir*U*(0.94 - alarm*0.16), groundY - U*(2.06 + alarm*0.46));
  const HCdn = P(cx + dir*U*0.98,                groundY - U*0.68);
  const HC   = dead
    ? P(cx + dir*U*1.48, groundY - U*0.13)     // neck flung out flat on the floor
    : P(lerp(HCup.x, HCdn.x, headDrop), lerp(HCup.y, HCdn.y, headDrop));
  const hr = U*0.215;

  return { U, gsc, gY:groundY, bodyCy, bodyRx, bodyRy, chest, HC, hr, dead };
}

/* one short leg: thigh + shank + a webbed foot triangle.
   Stroked DIRECTLY, not through limb(): at goose scale limb()'s black casing
   (lw + LW*1.9) is wider than the leg itself and prints a solid black column
   under every bird in the flock. A leg this size is one dark line. */
function drawGooseLeg(pen, hip, foot, w, dir, tone, spread){
  const g = pen.ctx;
  const knee = P(lerp(hip.x, foot.x, .52) - dir*w*1.10, lerp(hip.y, foot.y, .55));
  g.save();
  g.strokeStyle = inkLevel(5); g.lineCap = "round"; g.lineJoin = "round";
  g.lineWidth = Math.max(2.4, w);
  g.beginPath(); g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); g.lineTo(foot.x,foot.y);
  g.stroke();
  g.restore();
  pen.fillPath(()=>{                               // web: a flat splayed triangle
    g.moveTo(foot.x - dir*w*0.6, foot.y - w*0.5);
    g.lineTo(foot.x + dir*w*(3.6*spread), foot.y + w*0.7);
    g.lineTo(foot.x - dir*w*1.7, foot.y + w*0.8);
    g.closePath();
  }, inkLevel(6));
}

/* the small head: rounded skull, blunt wedge bill, knob at the base, eye dot */
function drawGooseHead(pen, HC, hr, dir, o={}){
  const g = pen.ctx;
  const gape = clamp(o.gape ?? 0, 0, 1);
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, hr*1.12, hr*0.92, dir>0?-0.16:0.16, 0, TAU); }, T_HEAD(), 3.2);
  // blunt domestic bill (a wedge, not a hook) + the knob at its base
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.70, HC.y - hr*0.44);
    g.lineTo(HC.x + dir*hr*2.05, HC.y - hr*(0.10 - gape*0.30));
    g.lineTo(HC.x + dir*hr*2.00, HC.y + hr*(0.30 + gape*0.10));
    g.lineTo(HC.x + dir*hr*0.66, HC.y + hr*0.46);
    g.closePath();
  }, T_BILL(), 2.6);
  if (gape > 0.05){                                  // open bill: the alarm cry
    pen.paint(()=>{
      g.moveTo(HC.x + dir*hr*0.78, HC.y + hr*0.34);
      g.lineTo(HC.x + dir*hr*1.98, HC.y + hr*(0.34 + gape*0.72));
      g.lineTo(HC.x + dir*hr*1.90, HC.y + hr*(0.72 + gape*0.86));
      g.lineTo(HC.x + dir*hr*0.72, HC.y + hr*0.62);
      g.closePath();
    }, T_BILL(), 2.2);
  }
  g.fillStyle = INK; g.beginPath();
  g.ellipse(HC.x + dir*hr*0.30, HC.y - hr*0.18, hr*0.20, hr*0.20, 0, 0, TAU); g.fill();
}

/* the folded wing: a covert plate laid along the flank, the domestic read.
   Open (`wing`->1) it lifts off the back into a half-spread with primaries. */
function drawWing(pen, G, dir, wing){
  const g = pen.ctx;
  const { bodyCy, bodyRx, bodyRy, U } = G;
  const cx = G.chest.x - dir*U*0.50;
  if (wing < 0.12){                                  // folded plate
    pen.paint(()=>{
      g.moveTo(cx + dir*bodyRx*0.42, bodyCy - bodyRy*0.28);
      g.quadraticCurveTo(cx - dir*bodyRx*0.30, bodyCy - bodyRy*0.86,
                         cx - dir*bodyRx*0.98, bodyCy - bodyRy*0.16);
      g.quadraticCurveTo(cx - dir*bodyRx*0.30, bodyCy + bodyRy*0.52,
                         cx + dir*bodyRx*0.42, bodyCy - bodyRy*0.28);
      g.closePath();
    }, T_COVERT(), 3);
    pen.seam(()=>{ g.moveTo(cx + dir*bodyRx*0.10, bodyCy - bodyRy*0.10);
                   g.lineTo(cx - dir*bodyRx*0.72, bodyCy - bodyRy*0.06); }, 2);
    return;
  }
  // half-open wing thrown up off the shoulder
  const lift = lerp(0.35, 0.85, wing);
  const tipX = cx - dir*bodyRx*(0.55 + wing*0.85);
  const tipY = bodyCy - bodyRy*(0.85 + lift*0.70);
  pen.paint(()=>{
    g.moveTo(cx + dir*bodyRx*0.34, bodyCy - bodyRy*0.36);
    g.quadraticCurveTo(cx + dir*bodyRx*0.10, bodyCy - bodyRy*(0.85+lift*0.45), tipX, tipY);
    g.quadraticCurveTo(cx - dir*bodyRx*0.98, bodyCy - bodyRy*(0.50+lift*0.30),
                       cx - dir*bodyRx*0.86, bodyCy - bodyRy*0.10);
    g.quadraticCurveTo(cx - dir*bodyRx*0.20, bodyCy - bodyRy*0.28,
                       cx + dir*bodyRx*0.34, bodyCy - bodyRy*0.36);
    g.closePath();
  }, T_COVERT(), 3.2);
  g.strokeStyle = INK; g.lineWidth = Math.max(2, U*0.055); g.lineCap = "round";
  for (let k=0;k<3;k++){
    const f = 0.42 + k*0.18;
    const px = lerp(cx + dir*bodyRx*0.30, tipX, f), py = lerp(bodyCy - bodyRy*0.4, tipY, f);
    g.beginPath(); g.moveTo(px, py);
    g.lineTo(px - dir*bodyRx*0.36, py + bodyRy*(0.30 + k*0.16)); g.stroke();
  }
}

/* ---- a LIVE goose ---- */
function drawGooseAlive(pen, cx, groundY, S, dir, o={}){
  const g = pen.ctx;
  const G = gooseGeom(cx, groundY, S, dir, o);
  const { U, bodyCy, bodyRx, bodyRy, chest, HC, hr } = G;
  const wing = clamp(o.wing ?? 0, 0, 1);
  const lifted = clamp(o.lift ?? 0, 0, 1);          // feet off the floor (bolting)
  const ph = (o.phase ?? 0);
  const step = (o.gait ?? 0)*Math.sin(ph)*U*0.20;

  // ground shadow — an oval, never a bar
  g.save(); g.fillStyle = `rgba(0,0,0,${0.075*(1-lifted*0.7)})`;
  g.beginPath(); g.ellipse(cx, groundY + U*0.06, U*0.66, U*0.12, 0, 0, TAU); g.fill(); g.restore();

  // tail wedge, cocked off the stern
  pen.paint(()=>{
    g.moveTo(cx - dir*bodyRx*0.66, bodyCy - bodyRy*0.42);
    g.lineTo(cx - dir*bodyRx*1.62, bodyCy - bodyRy*(0.94 + lifted*0.30));
    g.lineTo(cx - dir*bodyRx*1.34, bodyCy + bodyRy*0.14);
    g.closePath();
  }, T_BODY(), 3);

  // far leg (behind the barrel)
  if (lifted < 0.5)
    drawGooseLeg(pen, P(cx - dir*U*0.10, bodyCy + bodyRy*0.52),
                 P(cx - dir*U*0.16 - step, groundY), U*0.070, dir, T_LEG(), 0.8);
  else
    drawGooseLeg(pen, P(cx - dir*U*0.10, bodyCy + bodyRy*0.52),
                 P(cx - dir*U*0.92, bodyCy + bodyRy*1.30), U*0.066, dir, T_LEG(), 0.5);

  // the heavy domestic barrel
  pen.paint(()=>{ g.ellipse(cx, bodyCy, bodyRx, bodyRy, dir>0 ? -0.13 : 0.13, 0, TAU); },
            T_BODY(), 4);
  // pale keel under the barrel — FILL ONLY (a contour here would rule a hard
  // horizontal bar the width of the body through every bird in the flock)
  pen.fillPath(()=>{ g.ellipse(cx + dir*U*0.04, bodyCy + bodyRy*0.42, bodyRx*0.62, bodyRy*0.26, 0, 0, TAU); },
               inkLevel(0));

  drawWing(pen, G, dir, wing);

  // long neck: chest -> head, a swan-S when raised, a straight dip when feeding
  const cxN = lerp(chest.x, HC.x, 0.30) + dir*U*(0.34 - (o.headDrop??0)*0.50);
  const cyN = lerp(chest.y, HC.y, 0.62);
  pen.limb(()=>{ g.moveTo(chest.x, chest.y); g.quadraticCurveTo(cxN, cyN, HC.x, HC.y); },
           T_BODY(), U*0.270);

  drawGooseHead(pen, HC, hr, dir, { gape:o.gape ?? 0 });

  // near leg (over the barrel)
  if (lifted < 0.5)
    drawGooseLeg(pen, P(cx + dir*U*0.16, bodyCy + bodyRy*0.56),
                 P(cx + dir*U*0.22 + step, groundY), U*0.082, dir, T_LEG(), 1.0);
  else
    drawGooseLeg(pen, P(cx + dir*U*0.16, bodyCy + bodyRy*0.56),
                 P(cx - dir*U*0.66, bodyCy + bodyRy*1.55), U*0.078, dir, T_LEG(), 0.6);
  return G;
}

/* ---- a DEAD goose: body toppled onto its side, the neck BROKEN — a kink
   partway along it and the head lying on the floor, feet turned up. This is
   the whole point of the fallen array, so it must read at flock scale. ---- */
function drawGooseDead(pen, cx, groundY, S, dir, o={}){
  const g = pen.ctx;
  const G = gooseGeom(cx, groundY, S, dir, { ...o, dead:1 });
  const { U, bodyCy, bodyRx, bodyRy, HC, hr } = G;
  const roll = (o.roll ?? 0.28)*(dir>0?1:-1);

  g.save(); g.fillStyle = "rgba(0,0,0,0.075)";
  g.beginPath(); g.ellipse(cx, groundY + U*0.10, U*0.88, U*0.13, 0, 0, TAU); g.fill(); g.restore();

  // tail, flat on the floor
  pen.paint(()=>{
    g.moveTo(cx - dir*bodyRx*0.62, bodyCy - bodyRy*0.30);
    g.lineTo(cx - dir*bodyRx*1.42, bodyCy - bodyRy*0.06);
    g.lineTo(cx - dir*bodyRx*1.18, bodyCy + bodyRy*0.44);
    g.closePath();
  }, T_BODY(), 3);

  // legs turned up off the toppled body — SHORT. Long upturned legs build a
  // row of peaks and the fallen array stops reading as bodies at all.
  for (let s=-1;s<=1;s+=2){
    const hip = P(cx + dir*U*(0.06 + s*0.14), bodyCy);
    const foot= P(hip.x - dir*U*(0.20 + s*0.10), bodyCy - bodyRy*(0.78 + s*0.22));
    drawGooseLeg(pen, hip, foot, U*0.066, -dir, T_LEG(), 0.7);
  }

  // barrel, rolled onto its flank
  pen.paint(()=>{ g.ellipse(cx, bodyCy, bodyRx*1.06, bodyRy*0.92, roll, 0, TAU); }, T_BODY(), 4);
  // one wing splayed loose across the body
  pen.paint(()=>{
    g.moveTo(cx + dir*bodyRx*0.30, bodyCy - bodyRy*0.26);
    g.quadraticCurveTo(cx - dir*bodyRx*0.40, bodyCy - bodyRy*1.05,
                       cx - dir*bodyRx*1.12, bodyCy - bodyRy*0.52);
    g.quadraticCurveTo(cx - dir*bodyRx*0.36, bodyCy - bodyRy*0.05,
                       cx + dir*bodyRx*0.30, bodyCy - bodyRy*0.26);
    g.closePath();
  }, T_COVERT(), 3);

  // the BROKEN neck: out of the chest, a hard kink, then slack to the floor
  const kink = P(cx + dir*U*0.94, groundY - U*(0.50 + (o.kink ?? 0.25)*0.55));
  pen.limb(()=>{ g.moveTo(cx + dir*bodyRx*0.62, bodyCy - bodyRy*0.10);
                 g.lineTo(kink.x, kink.y); }, T_BODY(), U*0.255);
  pen.limb(()=>{ g.moveTo(kink.x, kink.y);
                 g.quadraticCurveTo(kink.x + dir*U*0.44, kink.y + U*0.40, HC.x, HC.y); },
           T_BODY(), U*0.235);
  drawGooseHead(pen, HC, hr, dir, { gape:0.35 });
  // a couple of loose feathers by the body — short slivers, never a wash
  g.save(); g.strokeStyle = inkLevel(4); g.lineWidth = Math.max(2, U*0.05); g.lineCap="round";
  for (let k=0;k<2;k++){
    const a = 0.7 + k*1.9 + (o.seed ?? 0);
    const fx = cx + Math.cos(a)*U*1.15, fy = groundY - Math.abs(Math.sin(a))*U*0.40;
    g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx - dir*U*0.34, fy - U*0.16); g.stroke();
  }
  g.restore();
  return G;
}

function drawGoose(pen, cx, groundY, S, dir, o={}){
  return (o.dead ? drawGooseDead : drawGooseAlive)(pen, cx, groundY, S, dir, o);
}

/* ================= the house furniture of the dream =================
   Feeding troughs: BROKEN into short blocks with real gaps, so the wheat line
   never rules a bar across the frame. Grain spills out of each block. */
function drawTroughRun(pen, W, y, x0, x1, S, blocks, seed){
  const g = pen.ctx;
  const span = x1 - x0, bw = span/(blocks + (blocks-1)*0.52);
  for (let i=0;i<blocks;i++){
    const bx = x0 + i*(bw*1.52), h = S*0.036;
    /* FILLED, NOT OUTLINED. A closed contour around a box this wide prints a
       hard black bar the width of the block; the vessel is read instead from
       a light plane, two dark end walls and a broken lip. */
    pen.fillPath(()=>{
      g.moveTo(bx, y - h);
      g.lineTo(bx + bw, y - h*0.90);
      g.lineTo(bx + bw - h*0.40, y);
      g.lineTo(bx + h*0.34, y);
      g.closePath();
    }, inkLevel(2));
    // end walls — the only heavy marks on the trough
    pen.paint(()=>{ g.rect(bx - h*0.16, y - h*1.20, h*0.42, h*1.24); }, T_TROUGHD(), 2.2);
    pen.paint(()=>{ g.rect(bx + bw - h*0.30, y - h*1.12, h*0.42, h*1.16); }, T_TROUGHD(), 2.2);
    // broken lip + broken base: two dashes each, never a ruled edge
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = "round";
    g.beginPath(); g.moveTo(bx + h*0.55, y - h*1.02); g.lineTo(bx + bw*0.40, y - h*0.98);
    g.moveTo(bx + bw*0.56, y - h*0.96);  g.lineTo(bx + bw - h*0.50, y - h*0.94);
    g.moveTo(bx + h*0.62, y - h*0.04);   g.lineTo(bx + bw*0.42, y - h*0.02);
    g.moveTo(bx + bw*0.60, y - h*0.02);  g.lineTo(bx + bw - h*0.62, y - h*0.04);
    g.stroke(); g.restore();
    // wheat heaped in the box + spilled on the floor beside it
    g.save(); g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(2, S*0.006); g.lineCap="round";
    for (let k=0;k<7;k++){
      const a = seed + i*1.7 + k*2.399;
      const gx = bx + bw*(0.10 + 0.80*((a*7)%1));
      const gy = y - h*(0.30 + 0.42*((a*13)%1));
      g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + S*0.012, gy - S*0.010); g.stroke();
    }
    for (let k=0;k<5;k++){
      const a = seed + i*2.9 + k*1.61;
      const gx = bx + bw*(-0.14 + 1.24*((a*11)%1));
      const gy = y + S*0.014*((a*5)%1) + S*0.006;
      g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + S*0.010, gy - S*0.008); g.stroke();
    }
    g.restore();
  }
}

/* wheat spilled loose on the floor, away from any trough — short ticks in a
   loose patch, never a wash and never a line. */
function drawSpilledGrain(pen, x, y, S, seed){
  const g = pen.ctx;
  g.save(); g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(2, S*0.006); g.lineCap="round";
  for (let k=0;k<11;k++){
    const a = seed + k*2.399;
    const gx = x + Math.cos(a*5.1)*S*0.055*(0.4 + (k%4)*0.3);
    const gy = y + Math.sin(a*3.7)*S*0.016;
    g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + S*0.011, gy - S*0.009); g.stroke();
  }
  g.restore();
}

/* the raptor's SHADOW crossing the floor. The bird itself belongs to
   divine-fx.dream-eagle-with-odysseus-voice — here only what it casts. */
function drawRaptorShadow(pen, cx, cy, S, grow){
  const g = pen.ctx;
  const r = S*0.15*grow;
  pen.fillPath(()=>{
    g.moveTo(cx - r*0.10, cy - r*0.30);
    g.quadraticCurveTo(cx - r*1.30, cy - r*0.58, cx - r*1.72, cy - r*0.06);
    g.quadraticCurveTo(cx - r*1.05, cy + r*0.14, cx - r*0.16, cy + r*0.16);
    g.lineTo(cx + r*0.62, cy + r*0.34);
    g.lineTo(cx + r*0.30, cy + r*0.02);
    g.quadraticCurveTo(cx + r*1.10, cy + r*0.10, cx + r*1.66, cy - r*0.30);
    g.quadraticCurveTo(cx + r*0.96, cy - r*0.54, cx + r*0.08, cy - r*0.28);
    g.closePath();
  }, inkLevel(2));
}

/* the stoop LINE: a dashed vector entering from the upper right with an
   arrowhead, so the attack direction is legible as a diagram. */
function drawStoopLine(pen, W, H, tx, ty, reach){
  const g = pen.ctx;
  const x0 = W*0.97, y0 = H*0.06;
  const x1 = lerp(x0, tx, reach), y1 = lerp(y0, ty, reach);
  g.save();
  g.strokeStyle = INK; g.globalAlpha = 0.55;
  g.lineWidth = Math.max(3, W*0.006); g.lineCap = "round";
  g.setLineDash([W*0.022, W*0.018]);
  g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(W*0.86, H*0.30, x1, y1); g.stroke();
  g.setLineDash([]);
  const ang = Math.atan2(y1 - H*0.30, x1 - W*0.86), ah = W*0.028;
  g.globalAlpha = 0.85; g.fillStyle = INK;
  g.beginPath(); g.moveTo(x1,y1);
  g.lineTo(x1 - Math.cos(ang-0.42)*ah, y1 - Math.sin(ang-0.42)*ah);
  g.lineTo(x1 - Math.cos(ang+0.42)*ah, y1 - Math.sin(ang+0.42)*ah);
  g.closePath(); g.fill();
  g.restore();
}

/* loose feathers in the air after the strike — slivers, never a cloud */
function drawFeatherBurst(pen, x, y, S, n, seed){
  const g = pen.ctx;
  g.save(); g.strokeStyle = inkLevel(5); g.lineWidth = Math.max(2, S*0.0065); g.lineCap="round";
  for (let i=0;i<n;i++){
    const a = seed + i*2.399;
    const dx = Math.cos(a)*S*(0.06 + (i%3)*0.045), dy = -Math.abs(Math.sin(a))*S*0.075;
    g.beginPath(); g.moveTo(x+dx, y+dy);
    g.quadraticCurveTo(x+dx - S*0.020, y+dy - S*0.014, x+dx - S*0.046, y+dy - S*0.006);
    g.stroke();
  }
  g.restore();
}

/* ================= the COUNT: twenty, drawn as geometry =================
   No small type anywhere — the tally is four gates of five strokes and the
   numeral is seven-segment bars, both large enough to survive the dot lattice. */
const SEG7 = { 0:"abcdef", 1:"bc", 2:"abged", 3:"abgcd", 4:"fgbc",
               5:"afgcd", 6:"afgedc", 7:"abc", 8:"abcdefg", 9:"abcfgd" };
function drawDigit(pen, x, y, w, h, d, tone){
  const g = pen.ctx, th = w*0.30, on = SEG7[d] || "";
  const bar = (bx,by,bw,bh)=> pen.paint(()=>{ g.rect(bx,by,bw,bh); }, tone, 2.4);
  if (on.includes("a")) bar(x+th*0.5, y,               w-th,   th);
  if (on.includes("d")) bar(x+th*0.5, y+h-th,          w-th,   th);
  if (on.includes("g")) bar(x+th*0.5, y+h/2-th/2,      w-th,   th);
  if (on.includes("f")) bar(x,        y+th*0.5,        th,     h/2-th);
  if (on.includes("b")) bar(x+w-th,   y+th*0.5,        th,     h/2-th);
  if (on.includes("e")) bar(x,        y+h/2+th*0.5,    th,     h/2-th);
  if (on.includes("c")) bar(x+w-th,   y+h/2+th*0.5,    th,     h/2-th);
}
function drawTally(pen, x, y, S, filled){
  const g = pen.ctx;
  g.save(); g.strokeStyle = inkLevel(6); g.lineWidth = Math.max(3, S*0.008); g.lineCap="round";
  const gw = S*0.058, sp = S*0.0128, hgt = S*0.042;
  for (let gate=0; gate<4; gate++){
    const gx = x + gate*(gw + S*0.028);
    for (let k=0;k<4;k++){
      const n = gate*5 + k;
      g.globalAlpha = n < filled ? 1 : 0.22;
      g.beginPath(); g.moveTo(gx + k*sp, y); g.lineTo(gx + k*sp, y - hgt); g.stroke();
    }
    g.globalAlpha = (gate*5+4) < filled ? 1 : 0.22;
    g.beginPath(); g.moveTo(gx - sp*0.5, y - hgt*0.9); g.lineTo(gx + sp*3.6, y - hgt*0.12); g.stroke();
  }
  g.globalAlpha = 1; g.restore();
}

/* ================= FLOCK LAYOUT — exactly twenty, deterministic =================
   Four ranks of five. Ranks stagger and every member carries a fixed jitter
   from its index, so the flock reads as a bunched farmyard mob rather than a
   parade — but it is still a grid underneath, and it still counts to twenty. */
const FLOCK_N = 20;
function baseFlock(){
  const m = [];
  for (let i=0;i<FLOCK_N;i++){
    const r = Math.floor(i/5), c = i%5;
    const x = 0.150 + c*0.152 + (r%2 ? 0.062 : 0) + (h1(i*3)-0.5)*0.042;
    /* the depth jitter is deliberately LARGE (±0.055 of the whole depth run):
       four tidy ranks would rule four horizontal bands across the frame, and a
       flock is a mob, not a parade. */
    const d = 0.045 + r*0.315 + (h1(i*7)-0.5)*0.210;
    const dir = x < 0.44 ? 1 : (x > 0.60 ? -1 : (h1(i*11) < 0.5 ? 1 : -1));
    m.push({ i, x, d, dir, gsc: 0.90 + h1(i*13)*0.22, seed: h1(i*17)*6.28 });
  }
  return m;
}
/* the FALLEN array is deliberately tidier: bodies laid in rows so the dreamer
   can walk the line and count her twenty. Still staggered, never ruled. */
function fallenArray(){
  const m = [];
  for (let i=0;i<FLOCK_N;i++){
    const r = Math.floor(i/5), c = i%5;
    m.push({ i,
      x: 0.145 + c*0.168 + (c>2 ? 0.030 : 0) + (r%2 ? 0.030 : 0) + (h1(i*3)-0.5)*0.020,
      d: 0.035 + r*0.322 + (h1(i*7)-0.5)*0.075,
      dir: (r%2 ? -1 : 1), gsc: 0.78 + h1(i*13)*0.14,
      dead: 1, roll: 0.18 + h1(i*19)*0.30, kink: 0.10 + h1(i*23)*0.34,
      seed: h1(i*17)*6.28 });
  }
  return m;
}

const groundOf = (H, d) => lerp(H*0.215, H*0.855, clamp(d, 0, 1.08));
const scaleOf  = (d)     => lerp(0.62, 1.06, clamp(d, 0, 1.08));

function layoutFor(pose, t){
  const beat = Math.sin(t*1.6);
  if (pose === "fallen"){
    return { geese: fallenArray(), feathers:[{x:0.30,y:0.62,n:5,seed:1.1},
                                             {x:0.72,y:0.44,n:4,seed:2.7}],
             count:20, grain:[{x:0.30,d:0.30},{x:0.62,d:0.72},{x:0.46,d:0.98}] };
  }
  const m = baseFlock();
  switch (pose){
    case "alarm":
      return { geese: m.map(o=>({ ...o,
                 headDrop:0, alarm: 0.72 + h1(o.i*29)*0.28,
                 gape: h1(o.i*31) < 0.45 ? 0.8 : 0.15,
                 wing: h1(o.i*37) < 0.30 ? 0.35 : 0,
                 gait: 0.4, phase:o.seed + t*2.2 })),
               troughs:[{d:0.36, x0:0.22, x1:0.62, blocks:2, seed:0.4},
                        {d:0.92, x0:0.34, x1:0.86, blocks:3, seed:1.9}],
               shadow:{ x:0.66, d:0.20, grow:0.55 },
               stoop:{ x:0.66, d:0.24, reach:0.55 } };
    case "attack": {
      const geese = m.map(o=>{
        const roleR = h1(o.i*41);
        if (roleR < 0.25) return { ...o, dead:1, roll:0.20+h1(o.i*19)*0.30,
                                   kink:0.08+h1(o.i*23)*0.30 };
        if (roleR < 0.52) return { ...o, alarm:1, gape:0.9, wing:0.85,
                                   lift: 0.55 + h1(o.i*43)*0.45,
                                   dx: (o.x<0.5?-1:1)*0.035, dy:-0.020 - h1(o.i*47)*0.035,
                                   phase:o.seed + t*3 };
        return { ...o, alarm:1, gape:0.6, wing:0.45, gait:1, phase:o.seed + t*3.4,
                 dx:(o.x<0.5?-1:1)*0.02 };
      });
      return { geese,
               troughs:[{d:0.94, x0:0.30, x1:0.72, blocks:2, seed:1.3}],
               shadow:{ x:0.50, d:0.60, grow:0.74 + beat*0.05 },
               stoop:{ x:0.50, d:0.58, reach:0.94 },
               feathers:[{x:0.34,y:0.56,n:6,seed:0.9},{x:0.62,y:0.40,n:5,seed:3.1},
                         {x:0.48,y:0.76,n:5,seed:2.2}] };
    }
    case "reset":
      return { geese: m.map(o=>({ ...o,
                 headDrop: h1(o.i*53) < 0.55 ? 0.92 : 0.30,
                 alarm:0, wing:0, gait:0.25, phase:o.seed + t*1.1,
                 ghost: 0.38 + 0.50*(1 - o.d) })),
               troughs:[{d:0.34, x0:0.20, x1:0.60, blocks:2, seed:0.4},
                        {d:0.96, x0:0.32, x1:0.84, blocks:3, seed:1.9}],
               loop:true };
    case "feed":
    default:
      return { geese: m.map(o=>({ ...o,
                 headDrop: h1(o.i*53) < 0.45 ? 0.90 + h1(o.i*59)*0.10 : 0.10 + h1(o.i*61)*0.26,
                 alarm:0, wing: h1(o.i*67) < 0.14 ? 0.30 : 0,
                 gait: 0.35, phase:o.seed + t*1.2 })),
               troughs:[{d:0.34, x0:0.20, x1:0.60, blocks:2, seed:0.4},
                        {d:0.96, x0:0.32, x1:0.84, blocks:3, seed:1.9}],
               count:20 };
  }
}

/* ================= THE RENDER ================= */
function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const S = Math.min(W, H)*0.92;
  const t = state.t || 0;
  const pose = state.pose || "feed";
  const L = layoutFor(pose, t);
  const layers = state.layers || ["troughs","grain","shadow","stoop","flock","feathers","count"];
  const has = l => layers.includes(l);

  // troughs first — the flock stands over them
  if (has("troughs")) for (const tr of (L.troughs||[]))
    drawTroughRun(pen, W, groundOf(H, tr.d), W*tr.x0, W*tr.x1, S, tr.blocks, tr.seed);
  if (has("troughs")) for (const gr of (L.grain||[]))
    drawSpilledGrain(pen, W*gr.x, groundOf(H, gr.d), S, gr.x*7.3 + gr.d*3.1);

  // the shadow the mountain bird throws across the floor
  if (has("shadow") && L.shadow)
    drawRaptorShadow(pen, W*L.shadow.x, groundOf(H, L.shadow.d) - S*0.05, S, L.shadow.grow);

  // the flock, far rank first
  if (has("flock")){
    const sorted = [...(L.geese||[])].sort((a,b)=>a.d - b.d);
    for (const o of sorted){
      const gsc = (o.gsc || 1)*scaleOf(o.d);
      const gx = W*(o.x + (o.dx || 0));
      const gy = groundOf(H, o.d) + H*(o.dy || 0) - (o.lift ? S*0.055*o.lift : 0);
      const alpha = o.ghost != null ? clamp(o.ghost, 0.12, 1) : 1;
      g.save();
      if (alpha < 1){ g.globalAlpha = alpha; g.setLineDash([S*0.020, S*0.014]); }
      drawGoose(pen, gx, gy, S, o.dir, { ...o, gsc });
      g.restore();
    }
  }

  // the stoop vector, over the flock so the attack direction stays legible
  if (has("stoop") && L.stoop)
    drawStoopLine(pen, W, H, W*L.stoop.x, groundOf(H, L.stoop.d) - S*0.08, L.stoop.reach);

  if (has("feathers")) for (const f of (L.feathers||[]))
    drawFeatherBurst(pen, W*f.x, H*f.y, S, f.n, f.seed);

  // the count, drawn as geometry: tally gates + a seven-segment numeral
  if (has("count") && L.count){
    const y = H*0.935, x = W*0.095;
    drawTally(pen, x, y, S, L.count);
    const dh = S*0.086, dw = dh*0.60;
    drawDigit(pen, W*0.760,           y - dh, dw, dh, 2, toneSolid(inkLevel(6)));
    drawDigit(pen, W*0.760 + dw*1.34, y - dh, dw, dh, 0, toneSolid(inkLevel(6)));
  }

  // the dream loop: a return arc from the fallen ground back to the trough
  if (L.loop){
    g.save(); g.strokeStyle = INK; g.globalAlpha = 0.35;
    g.lineWidth = Math.max(3, W*0.005); g.lineCap="round";
    g.setLineDash([W*0.016, W*0.020]);
    g.beginPath();
    g.moveTo(W*0.90, groundOf(H, 1.0));
    g.quadraticCurveTo(W*0.975, H*0.42, W*0.87, groundOf(H, 0.10) + H*0.02);
    g.stroke();
    g.setLineDash([]);
    g.globalAlpha = 0.7; g.fillStyle = INK;
    const ay = groundOf(H, 0.10);
    g.beginPath();
    g.moveTo(W*0.855, ay - H*0.006);                 // apex, up the arc
    g.lineTo(W*0.902, ay + H*0.026);
    g.lineTo(W*0.872, ay + H*0.034);
    g.closePath(); g.fill();
    g.restore();
  }
}

export const asset = {
  id:"creature.twenty-dream-geese",
  type:"CREATURE",
  name:"Twenty dream geese",
  statusWord:"COUNTED",
  scene:"OD-B19-S06",

  // procedural knobs
  params:{
    flock:20,              // the number the dream names — always exactly twenty
    plumage:"#f2efe6",     // white domestic goose
    bodyUnit:0.092,        // goose unit as a fraction of the short side
    ranks:4,               // depth ranks the flock is distributed over
    neckLen:2.0,           // neck length in body units (the domestic S-curve)
    billBlunt:true,        // wedge bill + basal knob, not a raptor hook
    troughs:true,          // broken wheat troughs the flock feeds from
    countable:true,        // tally + seven-segment numeral drawn as geometry
    collision:true,        // per-bird barrel footprint used for collision
  },
  // back -> front draw order the scene honors
  layers:["troughs","grain","shadow","flock-shadows","tail","far-leg","body",
          "keel","wing","neck","head","bill","near-leg","stoop","feathers","count"],
  // normalized 0..1 attention / contact / placement anchors
  anchors:{
    "flock:center":{x:.50,y:.60},
    "flock:lead":{x:.22,y:.42},        "flock:tail":{x:.78,y:.86},
    "trough:near":{x:.58,y:.88},       "trough:far":{x:.40,y:.51},
    "goose:first":{x:.15,y:.40},       "goose:twentieth":{x:.82,y:.88},
    "strike:point":{x:.50,y:.66},      // where the eagle takes the flock
    "raptor:shadow":{x:.50,y:.62},     // floor shadow — cast the eagle FX above it
    "stoop:entry":{x:.97,y:.06},       // the attack vector enters upper-right
    "array:origin":{x:.15,y:.36},      // top-left corner of the fallen array
    "count:tally":{x:.09,y:.96},       "count:numeral":{x:.80,y:.93},
    "dream:reset":{x:.90,y:.42},       // the loop arc back to the trough
    "camera:flock":{x:.50,y:.60},
  },
  // footprints for placement / pathing / collision
  zones:{
    "flock:body":{ x0:.10,y0:.28,x1:.90,y1:.92 },
    walkable:{ x0:.06,y0:.30,x1:.94,y1:.94 },
    "feed:ground":{ x0:.18,y0:.46,x1:.86,y1:.92 },
    "collision:barrel":{ x0:.12,y0:.34,x1:.88,y1:.90 },
    "array:grid":{ x0:.13,y0:.32,x1:.87,y1:.90 },
  },
  // the four performances the scene drives, plus the loop back to the start
  states:{
    initial:"feed",
    nodes:{
      feed:{   preview:{ pose:"feed",   t:0.2, status:"FEEDING",  progress:.22 } },
      alarm:{  preview:{ pose:"alarm",  t:0.5, status:"ALARM",    progress:.44 } },
      attack:{ preview:{ pose:"attack", t:0.6, status:"STOOP",    progress:.68 } },
      fallen:{ preview:{ pose:"fallen", t:0.0, status:"TWENTY",   progress:.92 } },
      reset:{  preview:{ pose:"reset",  t:0.3, status:"DREAMING", progress:.12 } },
    },
    edges:[
      ["feed","alarm"],["alarm","attack"],["attack","fallen"],
      ["fallen","reset"],["reset","feed"],["alarm","feed"],["feed","attack"],
    ],
  },
  duration:6.0,
  channels:["pose","t","headDrop","alarm","gape","wing","gait","lift","ghost","count"],

  // neutral preview: the twenty at the troughs, heads down in the wheat
  preview:()=>({ pose:"feed", t:0.2, status:"FEEDING", progress:.22 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
