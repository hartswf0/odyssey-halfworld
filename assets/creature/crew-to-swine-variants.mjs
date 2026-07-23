/* creature.crew-to-swine-variants — Odysseus' crew transformed by Circe.
   CREATURE asset (quadruped swine, NOT humanoid): fully custom geometry on
   engine primitives. A reusable PIG template drawn a couple of times: a fat
   barrel body, four short cloven-trottered legs, a projecting snout with a
   disc nose + two nostrils, big triangular ears, a small curly tail — but the
   read that makes them unsettling is the FACE: they keep unmistakably HUMAN
   EYES (white sclera, round iris + pupil, an upper lid, and grief-angled brows)
   set into the swine skull, so the gaze still holds a sailor's memory and
   sorrow. Members are placed/posed deterministically so the pair is one
   composition, never a flattened illustration.
   States: pig-form (standing, grieving human gaze) / penned (herded behind
   Circe's sty rails) / restoring (a translucent human self rising out of the
   swine body as the spell breaks). Drawn in SOLID grays + hard contour; the
   engine POST pass supplies the dot-matrix halftone — do NOT pre-dither.
   Atlas: OD-B10-S04 — human performers mapped into pig bodies while preserving
   identity, gaze, memory, restoration. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "/engine/halfworld-engine.mjs";

const P = (x,y)=>({x,y});

/* ---- tone levels (flat grays; the POST pass turns them into dots).
   The hide is kept MID/LIGHT so the crisp black contour and — above all — the
   pale human eye-whites read against it. ---- */
const T_BODY    = ()=> toneSolid(inkLevel(3));   // pale pink-grey hide
const T_BELLY   = ()=> toneSolid(inkLevel(2));   // paler underbelly
const T_HEAD    = ()=> toneSolid(inkLevel(3));
const T_SNOUT   = ()=> toneSolid(inkLevel(4));   // darker projecting snout
const T_NOSE    = ()=> toneSolid(inkLevel(5));   // the flat nose disc
const T_EAR     = ()=> toneSolid(inkLevel(4));
const T_EARIN   = ()=> toneSolid(inkLevel(2));   // pale inner ear
const T_NEARLEG = ()=> toneSolid(inkLevel(4));
const T_FARLEG  = ()=> toneSolid(inkLevel(5));
const T_TROTTER = ()=> toneSolid(inkLevel(6));   // hard cloven trotter
const T_TAIL    = ()=> toneSolid(inkLevel(4));
const T_SCLERA  = ()=> toneSolid(inkLevel(0));   // white of a human eye
const T_RAIL    = ()=> toneSolid(inkLevel(6));   // dark sty rail
const T_GHOST   = ()=> toneSolid(inkLevel(1));   // rising human self

/* -------------------------------------------------------------
   THE HUMAN EYE — the whole point of the asset. Almond sclera, a
   round dark iris with a pupil + a catch-light, a heavy upper lid,
   and a brow lifted at the INNER corner (toward the snout) so the
   look reads as grief, not animal blankness. dir = facing sign. -------------------------------------------------------------- */
function drawHumanEye(pen, ex, ey, ew, eh, dir, { gaze=0, grief=1 }={}){
  const g = pen.ctx;
  // almond sclera (pointed canthi) — pale, so it pops from the hide
  pen.paint(()=>{
    g.moveTo(ex - ew, ey);
    g.quadraticCurveTo(ex - ew*0.2, ey - eh, ex + ew, ey - eh*0.15);   // upper lid arc
    g.quadraticCurveTo(ex + ew*0.1, ey + eh*0.9, ex - ew, ey);         // lower lid arc
    g.closePath();
  }, T_SCLERA(), 3);
  // iris + pupil (looks slightly down/aside = downcast)
  const ix = ex + dir*ew*0.10 + gaze*ew*0.5;
  const iy = ey - eh*0.02 + eh*0.30;      // ride low in the socket
  const ir = eh*0.72;
  g.save();
  // clip the iris to the sclera almond so it never spills the lids
  g.beginPath();
  g.moveTo(ex - ew, ey);
  g.quadraticCurveTo(ex - ew*0.2, ey - eh, ex + ew, ey - eh*0.15);
  g.quadraticCurveTo(ex + ew*0.1, ey + eh*0.9, ex - ew, ey);
  g.closePath(); g.clip();
  g.fillStyle = inkLevel(6); g.beginPath(); g.arc(ix, iy, ir, 0, 7); g.fill();      // iris
  g.fillStyle = INK;         g.beginPath(); g.arc(ix, iy, ir*0.5, 0, 7); g.fill();  // pupil
  g.fillStyle = inkLevel(0); g.beginPath(); g.arc(ix - dir*ir*0.3, iy - ir*0.35, ir*0.22, 0, 7); g.fill(); // catch-light
  g.restore();
  // heavy upper lid line + lash weight (the human read)
  pen.ink(()=>{
    g.moveTo(ex - ew, ey);
    g.quadraticCurveTo(ex - ew*0.2, ey - eh*1.02, ex + ew, ey - eh*0.15);
  }, 3.2);
  // lower lid crease
  pen.ink(()=>{
    g.moveTo(ex - ew*0.7, ey + eh*0.12);
    g.quadraticCurveTo(ex + ew*0.1, ey + eh*0.62, ex + ew*0.85, ey + eh*0.02);
  }, 1.8);
  // GRIEF brow — lifted at the inner (snout-side) corner, sloping down outward
  const inn = ex + dir*ew*0.9, out = ex - dir*ew*1.05;
  pen.ink(()=>{
    g.moveTo(inn, ey - eh*(1.15 + grief*0.55));
    g.quadraticCurveTo(ex, ey - eh*(1.35 + grief*0.35), out, ey - eh*(0.9 + grief*0.05));
  }, 3.4);
}

/* the swine HEAD: rounded skull, projecting snout + disc nose, two big ears,
   and the pair of human eyes. gaze/grief drive the sorrowful look; headLow
   droops the whole head for the penned grief read. */
function drawHead(pen, HC, hr, dir, { gaze=0, grief=1 }={}){
  const g = pen.ctx;

  // ---- FAR ear (behind skull) ----
  pen.paint(()=>{
    g.moveTo(HC.x - dir*hr*0.55, HC.y - hr*0.70);
    g.lineTo(HC.x - dir*hr*1.05, HC.y - hr*1.55);
    g.lineTo(HC.x - dir*hr*0.05, HC.y - hr*1.05);
    g.closePath();
  }, T_EAR(), 3.5);

  // ---- skull (rounded) ----
  pen.paint(()=>{ g.ellipse(HC.x, HC.y, hr*1.02, hr*0.94, 0, 0, 7); }, T_HEAD(), 4.5);

  // ---- projecting SNOUT: cheek -> muzzle bridge -> flat nose ----
  const nx = HC.x + dir*hr*1.62, ny = HC.y + hr*0.34;   // nose-disc centre
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.30, HC.y - hr*0.34);            // top of muzzle root
    g.quadraticCurveTo(HC.x + dir*hr*1.30, HC.y - hr*0.28,   // bridge
                       nx - dir*hr*0.02, ny - hr*0.46);      // up to nose top
    g.lineTo(nx + dir*hr*0.10, ny + hr*0.52);                // down the nose face
    g.quadraticCurveTo(HC.x + dir*hr*1.05, HC.y + hr*0.92,   // under-jowl
                       HC.x + dir*hr*0.18, HC.y + hr*0.74);  // back to jaw
    g.closePath();
  }, T_SNOUT(), 4);

  // ---- the flat NOSE DISC + two nostrils ----
  pen.paint(()=>{ g.ellipse(nx, ny, hr*0.30, hr*0.52, dir*0.12, 0, 7); }, T_NOSE(), 3.5);
  g.fillStyle = INK;
  g.beginPath(); g.ellipse(nx - dir*hr*0.06, ny - hr*0.16, hr*0.055, hr*0.13, dir*0.1, 0, 7); g.fill();
  g.beginPath(); g.ellipse(nx - dir*hr*0.06, ny + hr*0.18, hr*0.055, hr*0.13, dir*0.1, 0, 7); g.fill();

  // ---- NEAR ear (over skull, bolder) with pale inner ----
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.30, HC.y - hr*0.72);
    g.lineTo(HC.x + dir*hr*0.06, HC.y - hr*1.72);
    g.lineTo(HC.x + dir*hr*0.92, HC.y - hr*1.02);
    g.closePath();
  }, T_EAR(), 4);
  pen.paint(()=>{
    g.moveTo(HC.x + dir*hr*0.34, HC.y - hr*0.80);
    g.lineTo(HC.x + dir*hr*0.24, HC.y - hr*1.40);
    g.lineTo(HC.x + dir*hr*0.72, HC.y - hr*0.98);
    g.closePath();
  }, T_EARIN(), 2);

  // ---- the HUMAN EYES (far eye smaller for the 3/4 turn) ----
  const eScale = hr*0.50;
  // far eye
  drawHumanEye(pen, HC.x - dir*eScale*0.30, HC.y - hr*0.16, eScale*0.74, eScale*0.66, dir, { gaze, grief });
  // near eye (larger, forward)
  drawHumanEye(pen, HC.x + dir*eScale*1.10, HC.y - hr*0.08, eScale*1.02, eScale*0.92, dir, { gaze, grief });

  // ---- a downturned human mouth-line under the snout root (adds sorrow) ----
  pen.ink(()=>{
    g.moveTo(HC.x + dir*hr*0.20, HC.y + hr*0.58);
    g.quadraticCurveTo(HC.x + dir*hr*0.52, HC.y + hr*0.50, HC.x + dir*hr*0.86, HC.y + hr*0.60);
  }, 2.2);
}

/* one short cloven leg: two stubby segments + a split trotter block */
function drawLeg(pen, hip, knee, foot, w, tone){
  const g = pen.ctx;
  pen.limb(()=>{ g.moveTo(hip.x,hip.y); g.lineTo(knee.x,knee.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(knee.x,knee.y); g.lineTo(foot.x,foot.y); }, tone, w*0.82);
  // split (cloven) trotter: two small dark blocks
  pen.paint(()=>{ g.rect(foot.x - w*0.46, foot.y - w*0.06, w*0.38, w*0.52); }, T_TROTTER(), 2.5);
  pen.paint(()=>{ g.rect(foot.x + w*0.08, foot.y - w*0.06, w*0.38, w*0.52); }, T_TROTTER(), 2.5);
}

/* ONE pig template. opts:
     headLow 0..1  grief head-droop (0 up & searching, 1 dropped low)
     grief   0..1  brow / gaze sorrow strength
     restore 0..1  translucent human self rising out of the body
     gsc           member scale
     t             idle phase (breath) */
function drawPig(pen, cx, groundY, S, dir, opts={}){
  const g = pen.ctx;
  const gsc = opts.gsc ?? 1.0;
  const headLow = opts.headLow ?? 0;
  const grief = opts.grief ?? 1;
  const restore = opts.restore ?? 0;
  const t = opts.t || 0;

  const U = S*0.20*gsc;
  const back = S*0.185*gsc;                  // withers height
  const bob = Math.sin(t*2 + cx*0.01)*back*0.012;
  const gY = groundY;

  const shoulderX = cx + dir*U*0.48;
  const hipX      = cx - dir*U*0.52;
  const bodyCy    = gY - back*0.66 + bob;

  // ---- ground shadow ----
  g.save(); g.fillStyle="rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, groundY+4, U*0.98, U*0.15, 0, 0, 7); g.fill(); g.restore();

  // ---- rising HUMAN SELF (restore): translucent standing figure behind ----
  if (restore > 0){
    drawRisingHuman(pen, cx, groundY, U, back, dir, restore);
  }

  // ---- small curly TAIL (behind rump) ----
  const tb = P(hipX - dir*U*0.30, bodyCy - back*0.18);
  pen.limb(()=>{
    g.moveTo(tb.x, tb.y);
    g.quadraticCurveTo(tb.x - dir*U*0.26, tb.y - back*0.28, tb.x - dir*U*0.06, tb.y - back*0.30);
    g.quadraticCurveTo(tb.x + dir*U*0.14, tb.y - back*0.32, tb.x - dir*U*0.02, tb.y - back*0.10);
  }, T_TAIL(), U*0.05);

  // ---- FAR legs (drawn first, deeper tone, inset) ----
  const foff = dir*U*0.06;
  drawLeg(pen, P(shoulderX-foff, bodyCy+back*0.10), P(shoulderX-foff+dir*U*0.02, gY-back*0.20),
          P(shoulderX-foff, gY), U*0.115, T_FARLEG());
  drawLeg(pen, P(hipX-foff, bodyCy+back*0.10), P(hipX-foff-dir*U*0.02, gY-back*0.20),
          P(hipX-foff, gY), U*0.115, T_FARLEG());

  // ---- barrel BODY (fat ellipse — the pig read) ----
  pen.paint(()=>{ g.ellipse(cx + dir*U*0.02, bodyCy, U*0.84, back*0.56, 0, 0, 7); }, T_BODY(), 4.5);
  // pale underbelly band
  pen.paint(()=>{ g.ellipse(cx + dir*U*0.04, bodyCy + back*0.28, U*0.56, back*0.18, 0, 0, 7); }, T_BELLY(), 0);
  // shoulder/ham crease
  pen.ink(()=>{ g.moveTo(shoulderX + dir*U*0.10, bodyCy - back*0.42);
                g.lineTo(shoulderX - dir*U*0.06, bodyCy + back*0.40); }, 2);

  // ---- NECK wedge rising to the head ----
  const HCup   = P(shoulderX + dir*U*0.72, gY - back*1.14 + bob);   // head up / searching
  const HCdown = P(shoulderX + dir*U*0.84, gY - back*0.66);         // head dropped in grief
  const HC = P(lerp(HCup.x, HCdown.x, headLow), lerp(HCup.y, HCdown.y, headLow));
  const hr = U*0.42;
  pen.paint(()=>{
    g.moveTo(shoulderX - dir*U*0.06, bodyCy - back*0.44);                 // nape at withers
    g.quadraticCurveTo(lerp(shoulderX,HC.x,0.5)+dir*U*0.06, lerp(bodyCy,HC.y,0.4)-back*0.10,
                       HC.x - dir*hr*0.35, HC.y - hr*0.60);               // crest -> poll
    g.lineTo(HC.x + dir*hr*0.30, HC.y + hr*0.70);                         // throat at head
    g.quadraticCurveTo(shoulderX + dir*U*0.28, bodyCy + back*0.20,
                       shoulderX + dir*U*0.06, bodyCy + back*0.30);       // throat -> brisket
    g.closePath();
  }, T_HEAD(), 4.5);

  // ---- head with the human eyes ----
  drawHead(pen, HC, hr, dir, { gaze: 0.15 + headLow*0.25, grief });

  // ---- NEAR legs (over body) ----
  drawLeg(pen, P(shoulderX, bodyCy+back*0.10), P(shoulderX+dir*U*0.03, gY-back*0.20),
          P(shoulderX, gY), U*0.13, T_NEARLEG());
  drawLeg(pen, P(hipX, bodyCy+back*0.10), P(hipX-dir*U*0.03, gY-back*0.20),
          P(hipX, gY), U*0.13, T_NEARLEG());
}

/* the translucent HUMAN SELF rising from the swine body as the spell lifts:
   a pale standing head-and-shoulders, dashed contour, fading upward. */
function drawRisingHuman(pen, cx, groundY, U, back, dir, k){
  const g = pen.ctx;
  const topY = groundY - back*(1.4 + k*1.4);
  const headCy = topY + back*0.30;
  const hr = U*0.34;
  g.save();
  g.globalAlpha = 0.55 + 0.35*k;
  // shoulders
  pen.paint(()=>{
    g.moveTo(cx - U*0.55, groundY - back*0.55);
    g.quadraticCurveTo(cx - U*0.42, headCy + hr*1.2, cx - hr*0.7, headCy + hr*0.9);
    g.lineTo(cx + hr*0.7, headCy + hr*0.9);
    g.quadraticCurveTo(cx + U*0.42, headCy + hr*1.2, cx + U*0.55, groundY - back*0.55);
    g.closePath();
  }, T_GHOST(), 0);
  // head
  pen.paint(()=>{ g.ellipse(cx, headCy, hr*0.8, hr, 0, 0, 7); }, T_GHOST(), 0);
  g.restore();
  // dashed rising contour (crisp, the spell-seam)
  g.save();
  g.setLineDash([6,5]); g.strokeStyle = INK; g.lineWidth = 2.4; g.lineJoin="round";
  g.beginPath();
  g.ellipse(cx, headCy, hr*0.8, hr, 0, 0, 7);
  g.moveTo(cx - hr*0.72, headCy + hr*0.7);
  g.quadraticCurveTo(cx - U*0.42, headCy + hr*1.2, cx - U*0.55, groundY - back*0.55);
  g.moveTo(cx + hr*0.72, headCy + hr*0.7);
  g.quadraticCurveTo(cx + U*0.42, headCy + hr*1.2, cx + U*0.55, groundY - back*0.55);
  g.stroke();
  g.restore();
  // faint human eyes in the ghost head (identity preserved)
  g.save(); g.globalAlpha = 0.8;
  g.fillStyle = INK;
  g.beginPath(); g.arc(cx - hr*0.30, headCy - hr*0.05, hr*0.08, 0, 7); g.fill();
  g.beginPath(); g.arc(cx + hr*0.30, headCy - hr*0.05, hr*0.08, 0, 7); g.fill();
  g.restore();
}

/* the sty RAILS drawn across the FOREGROUND for the penned state */
function drawPen(pen, W, H, groundY){
  const g = pen.ctx;
  const postXs = [0.10, 0.38, 0.66, 0.94];
  const topY = groundY - H*0.20, botY = H*0.96;
  // two horizontal rails
  for (const ry of [topY, topY + (botY-topY)*0.5]){
    pen.paint(()=>{ g.rect(W*0.05, ry, W*0.90, H*0.028); }, T_RAIL(), 4);
  }
  // vertical posts
  for (const px of postXs){
    pen.paint(()=>{ g.rect(W*px - W*0.014, topY - H*0.03, W*0.028, botY - topY + H*0.03); }, T_RAIL(), 4);
  }
}

/* ================= SCENE ================= */
function layoutFor(state){
  const pose = state.pose || "pig-form";
  switch(pose){
    // both face RIGHT and huddle in depth so BOTH grieving faces stay in frame:
    // a smaller pig set BACK (higher, up-left), a larger pig in FRONT (lower).
    case "pig-form":
      return { pigs:[
        {x:0.26, dir:+1, headLow:0.30, grief:1.0, gsc:0.82, gy:0.50},   // back
        {x:0.44, dir:+1, headLow:0.12, grief:1.0, gsc:1.08, gy:0.66},   // front
      ] };
    case "penned":
      return { pigs:[
        {x:0.26, dir:+1, headLow:0.78, grief:1.0, gsc:0.82, gy:0.54},
        {x:0.44, dir:+1, headLow:0.68, grief:1.0, gsc:1.08, gy:0.70},
      ], pen:true };
    case "restoring":
      return { pigs:[
        {x:0.26, dir:+1, headLow:0.25, grief:0.8, restore:0.35, gsc:0.82, gy:0.54},
        {x:0.46, dir:+1, headLow:0.06, grief:0.5, restore:0.75, gsc:1.10, gy:0.70},
      ] };
    default:
      return { pigs:[ {x:0.26, dir:+1, headLow:0.3, grief:1.0, gsc:0.82, gy:0.54},
                      {x:0.44, dir:+1, headLow:0.12, grief:1.0, gsc:1.08, gy:0.70} ] };
  }
}

function drawScene(ctx, W, H, state){
  const pen = makePen(ctx, { outline:true });
  const S = Math.min(W, H) * 1.02;
  const t = state.t || 0;
  const L = layoutFor(state);
  const frontGY = H*0.70;

  // faint shared ground line (at the front pig's feet)
  ctx.save(); ctx.strokeStyle="rgba(0,0,0,0.10)"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*0.03, frontGY+2); ctx.lineTo(W*0.97, frontGY+2); ctx.stroke(); ctx.restore();

  // pigs — far members first for depth (sort by gy asc = further back drawn first)
  const sorted = [...(L.pigs||[])].sort((a,b)=>(a.gy||0.70)-(b.gy||0.70));
  for (const m of sorted){
    drawPig(pen, W*m.x, H*(m.gy||0.70), S, m.dir,
      { headLow:m.headLow, grief:m.grief, restore:m.restore, gsc:m.gsc, t });
  }

  // sty rails last (foreground occlusion) for the penned state
  if (L.pen) drawPen(pen, W, H, frontGY);
}

export const asset = {
  id:"creature.crew-to-swine-variants",
  type:"CREATURE",
  name:"Crew-to-swine variants",
  statusWord:"GRIEVING",
  scene:"OD-B10-S04",

  // procedural knobs
  params:{
    count:2,              // pigs in the pair template
    hide:"#c9b6a6",       // pale pink-grey swine hide
    humanEyes:true,       // KEEP human eyes/expression
    curlyTail:true,
    cloven:true,          // split trotters
    grief:1.0,            // 0..1 sorrow in gaze/brow
  },
  // back -> front draw order each pig honors
  layers:["ground","shadow","ghost","tail","far-legs","body","belly","neck",
          "far-ear","head","snout","nose","near-ear","human-eyes","near-legs","pen"],
  // normalized 0..1 attention / handling / placement anchors
  anchors:{
    "pig-a:head":{x:.42,y:.42}, "pig-a:gaze":{x:.52,y:.44}, "pig-a:body":{x:.34,y:.62},
    "pig-b:head":{x:.60,y:.46}, "pig-b:gaze":{x:.50,y:.48}, "pig-b:body":{x:.68,y:.62},
    "pen:gate":{x:.10,y:.82}, "circe:mark":{x:.94,y:.40},
    "restore:rising":{x:.36,y:.30}, "camera:pair":{x:.50,y:.52},
  },
  // swine footprints for placement / pathing / collision
  zones:{
    "pig-a:collision":{ x0:.16,y0:.56,x1:.52,y1:.88 },
    "pig-b:collision":{ x0:.52,y0:.56,x1:.86,y1:.86 },
    "sty:pen":{ x0:.06,y0:.60,x1:.94,y1:.96 },
    walkable:{ x0:.06,y0:.64,x1:.94,y1:.92 },
  },
  states:{
    initial:"pig-form",
    nodes:{
      "pig-form":{  preview:{ pose:"pig-form",  t:0.2 } },   // standing swine, grieving human gaze
      penned:{      preview:{ pose:"penned",     t:0.3 } },   // herded behind Circe's sty rails
      restoring:{   preview:{ pose:"restoring",  t:0.5 } },   // human selves rising as the spell breaks
    },
    edges:[
      ["pig-form","penned"],["penned","pig-form"],
      ["penned","restoring"],["pig-form","restoring"],
    ],
  },
  channels:["pose","gaze","grief","headLow","restore"],

  preview:()=>({ pose:"pig-form", t:0.2, status:"GRIEVING", progress:.22 }),
  draw(ctx,W,H,state){ drawScene(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
