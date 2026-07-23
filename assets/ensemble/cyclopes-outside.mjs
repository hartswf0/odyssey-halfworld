/* ensemble.cyclopes-outside — the neighbour Cyclopes at Polyphemus' sealed cave.
   ENSEMBLE asset. Scene function (OD-B09-S09): roused by the blinded giant's
   bellowing, the other one-eyed Cyclopes come over the night hillside and
   GATHER as distant silhouettes at the boulder-SEALED cave threshold, call in
   their voices — then, told "Nobody" is killing him, DISPERSE back to their
   own caves. Built from ONE separable member template (drawGiant) instanced N
   times deterministically. Each giant is a brute silhouette with the signature
   SINGLE EYE. Exposes: formation (gathering | gathered | dispersing), gather
   (0 scattered/away .. 1 massed at the threshold), attention (0 turned away ..
   1 all eyes on the sealed mouth), distance (atmospheric farness of the whole
   band), and density. Drawn in SOLID grays + hard contour; the engine dotify
   pass supplies the halftone. Polyphemus is NOT baked in — only his sealed
   threshold, the thing they gather at, is drawn. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"gathered",   // gathering | gathered | dispersing
  gather:0.7,             // 0 = scattered / streaming away .. 1 = massed at the threshold
  attention:0.85,         // 0 = eyes turned away .. 1 = every eye on the sealed mouth
  distance:0.45,          // 0 = looming near .. 1 = far distant silhouettes (lift + shrink + lighten)
  count:6,                // number of giant silhouettes
  showThreshold:true,     // the boulder-sealed cave mouth they gather at
  showHills:true,         // night hill / horizon they come over
  thresholdX:0.50,        // sealed cave mouth position (fraction of W)
  thresholdY:0.40,
};

/* ============================================================
   ONE member template — a one-eyed Cyclops giant, read as a night SILHOUETTE.
   Brutish, hunched, top-heavy. Drawn as a stack of solid masses in a single
   dark body tone + hard contour so it reads as one shape. The signature is the
   SINGLE EYE: a pale disc with a dark pupil aimed by `gaze` (toward the sealed
   mouth when attentive). `feat` carries deterministic identity (club, slouch,
   head size). `s` = giant height in px.
   ============================================================ */
function drawGiant(pen, m){
  const g = pen.ctx, s = m.s;
  const body = toneSolid(inkLevel(m.sh.body));
  const dark = toneSolid(inkLevel(Math.min(7, m.sh.body+1)));
  const cw   = Math.max(1.6, s*0.018);
  const dir  = m.dir;                         // -1 faces left .. +1 faces right (toward threshold)

  const footY   = m.baseY;
  const hipY    = footY - s*0.40;
  const shoY    = footY - s*0.70;
  const shoHalf = s*0.27 * (0.9 + m.feat.bulk*0.2);   // broad brute shoulders
  const hipHalf = s*0.175;
  const headR   = s*0.185 * m.feat.headS;
  const slouch  = m.feat.slouch * s * 0.06;           // head/shoulders lean forward (over the cave)
  const shoCx   = m.cx + dir*slouch;
  const headCx  = shoCx + dir*(slouch*0.6 + s*0.02);
  const headCy  = shoY - headR*0.92;

  // ---- ground shadow (grounds the giant, keeps feet from floating) ----
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(m.cx, footY+s*0.01, s*0.30, s*0.055, 0,0,7); g.fill();

  // ---- LEGS : two thick columns, slightly apart (a heavy stance) ----
  const legW = Math.max(3, s*0.11);
  for (const side of [-1,1]){
    const hx = m.cx + side*hipHalf*0.62;
    const fx = m.cx + side*hipHalf*0.78;
    pen.limb(()=>{ g.moveTo(hx, hipY); g.lineTo(fx, footY); }, body, legW);
    // a blocky foot
    pen.paint(()=>{ g.ellipse(fx+dir*s*0.02, footY, s*0.075, s*0.032, 0,0,7); }, dark, cw*0.7);
  }

  // ---- TORSO : a heavy trapezoid boulder of a body ----
  pen.paint(()=>{
    g.moveTo(m.cx-hipHalf, hipY+s*0.02);
    g.lineTo(m.cx+hipHalf, hipY+s*0.02);
    g.lineTo(shoCx+shoHalf, shoY);
    g.quadraticCurveTo(shoCx, shoY-s*0.05, shoCx-shoHalf, shoY);
    g.closePath();
  }, body, cw);

  // ---- ARMS : two heavy arms hanging; the near one may hold a club/rock ----
  // far arm (behind, drawn first)
  const farShX = shoCx - dir*shoHalf*0.72, farShY = shoY + s*0.04;
  pen.limb(()=>{ g.moveTo(farShX, farShY); g.lineTo(farShX - dir*s*0.06, hipY+s*0.06); },
           toneSolid(inkLevel(Math.max(1,m.sh.body-1))), Math.max(2,s*0.075));
  // near arm
  const nearShX = shoCx + dir*shoHalf*0.78, nearShY = shoY + s*0.05;
  if (m.feat.club){
    // arm bent up gripping a knotted club resting on the shoulder
    const gripX = nearShX + dir*s*0.10, gripY = shoY - s*0.06;
    pen.limb(()=>{ g.moveTo(nearShX, nearShY); g.lineTo(gripX, gripY); }, body, Math.max(3,s*0.09));
    const clubAng = -Math.PI*0.5 - dir*0.55;
    const clen = s*0.5;
    const tipX = gripX + Math.cos(clubAng)*clen, tipY = gripY + Math.sin(clubAng)*clen;
    pen.limb(()=>{ g.moveTo(gripX,gripY); g.lineTo(tipX,tipY); }, dark, Math.max(2.5,s*0.05));
    pen.paint(()=>{ g.ellipse(tipX, tipY, s*0.075, s*0.09, clubAng, 0,7); }, dark, cw*0.7);
  } else {
    const hx = nearShX + dir*s*0.03, hy = hipY + s*0.05;
    pen.limb(()=>{ g.moveTo(nearShX, nearShY); g.lineTo(hx, hy); }, body, Math.max(3,s*0.085));
    pen.paint(()=>{ g.arc(hx, hy, s*0.055, 0,7); }, body, cw*0.7);   // heavy fist
  }

  // ---- NECK + HEAD : short neck, one shaggy round head ----
  pen.limb(()=>{ g.moveTo(shoCx+dir*s*0.01, shoY-s*0.01); g.lineTo(headCx, headCy+headR*0.7); }, body, s*0.09);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.98, headR, 0,0,7); }, body, cw*0.8);
  // shaggy hair/brow ridge over the CROWN only (kept high so it never covers the eye)
  pen.paint(()=>{
    g.moveTo(headCx-headR*0.98, headCy-headR*0.35);
    g.lineTo(headCx-headR*0.5,  headCy-headR*1.18);
    g.lineTo(headCx-headR*0.12, headCy-headR*0.72);
    g.lineTo(headCx+headR*0.3,  headCy-headR*1.24);
    g.lineTo(headCx+headR*0.6,  headCy-headR*0.7);
    g.lineTo(headCx+headR*0.98, headCy-headR*0.35);
    g.quadraticCurveTo(headCx, headCy-headR*0.62, headCx-headR*0.98, headCy-headR*0.35);
    g.closePath();
  }, dark, cw*0.6);

  // ---- THE SINGLE EYE — the signature. A large paper-pale socket + dark pupil.
  const eyeR = headR*0.52;
  const ex = headCx + dir*headR*0.06;
  const ey = headCy + headR*0.10;
  // pale socket (paper level -> a clear hole in the dark head under the dot pass)
  pen.paint(()=>{ g.ellipse(ex, ey, eyeR, eyeR*0.9, 0,0,7); }, toneSolid(inkLevel(0)), cw*0.9);
  // iris ring + pupil, offset toward whatever the giant regards
  const px = ex + m.gaze.x*eyeR*0.4, py = ey + m.gaze.y*eyeR*0.34;
  g.fillStyle = INK; g.beginPath(); g.arc(px, py, eyeR*0.5, 0,7); g.fill();
  // a heavy single brow ridge above the eye
  g.strokeStyle=INK; g.lineWidth=Math.max(2, headR*0.2); g.lineCap="round";
  g.beginPath(); g.moveTo(ex-eyeR*1.25, ey-eyeR*1.15); g.lineTo(ex+eyeR*1.25, ey-eyeR*1.0); g.stroke();

  return { head:{x:headCx,y:headCy}, r:headR, eye:{x:ex,y:ey} };
}

/* ============================================================
   The sealed cave THRESHOLD they gather at: a dark cliff face with an arched
   mouth wholly PLUGGED by a great round boulder. Faint seams read the seal; a
   single small ACCENT at the seam marks the sealed point (the thing attended).
   Drawn behind the giants so they can crowd in front of it.
   ============================================================ */
function drawThreshold(pen, W, H, st){
  const g = pen.ctx;
  const cx = W*(st.thresholdX ?? params.thresholdX);
  const cy = H*(st.thresholdY ?? params.thresholdY);
  const cw = W*0.006;
  const base = H*0.60;                        // outcrop foot — a mid-ground knoll, NOT a tower
  // rocky outcrop rising behind the mouth (compact, rounded)
  pen.paint(()=>{
    g.moveTo(cx-W*0.115, base);
    g.lineTo(cx-W*0.12, cy-H*0.06);
    g.quadraticCurveTo(cx-W*0.05, cy-H*0.15, cx, cy-H*0.145);
    g.quadraticCurveTo(cx+W*0.06, cy-H*0.14, cx+W*0.12, cy-H*0.05);
    g.lineTo(cx+W*0.115, base);
    g.closePath();
  }, toneSolid(inkLevel(4)), cw);
  // the cave mouth arch (dark recess) — mostly hidden by the boulder
  pen.paint(()=>{
    g.moveTo(cx-W*0.062, base);
    g.lineTo(cx-W*0.062, cy+H*0.005);
    g.quadraticCurveTo(cx, cy-H*0.065, cx+W*0.062, cy+H*0.005);
    g.lineTo(cx+W*0.062, base);
    g.closePath();
  }, toneSolid(inkLevel(6)), cw*0.9);
  // the sealing BOULDER — a great rounded stone wedged into the mouth
  pen.paint(()=>{ g.ellipse(cx, cy+H*0.035, W*0.066, H*0.078, 0,0,7); }, toneSolid(inkLevel(5)), cw*1.1);
  // seams so the boulder reads as a wedged stone, not a hole
  pen.seam(()=>{ g.moveTo(cx-W*0.035, cy-H*0.01); g.quadraticCurveTo(cx-W*0.005, cy+H*0.035, cx-W*0.04, cy+H*0.08); }, cw*0.55);
  pen.seam(()=>{ g.moveTo(cx+W*0.022, cy-H*0.03); g.quadraticCurveTo(cx+W*0.045, cy+H*0.02, cx+W*0.015, cy+H*0.085); }, cw*0.55);
  // the seal line where boulder meets arch + a small accent marking the sealed point
  pen.ink(()=>{ g.moveTo(cx-W*0.064, cy+H*0.006); g.quadraticCurveTo(cx, cy-H*0.056, cx+W*0.064, cy+H*0.006); }, cw*0.7);
  g.fillStyle=ACCENT; g.beginPath(); g.arc(cx+W*0.064, cy+H*0.006, Math.max(2.4, W*0.006), 0,7); g.fill();
}

/* ============================================================
   Build the giant band deterministically. Each giant interpolates between a
   deterministic SCATTER home (spread wide over the hillside, streaming to the
   edges = dispersed) and a GATHER target (massed on an arc before the sealed
   mouth). `gather` drives the blend; `attention` aims each eye; `distance`
   lifts + shrinks + lightens the whole band into far silhouettes.
   ============================================================ */
function scaleForY(H, y){ return H*lerp(0.155, 0.29, clamp01((y/H - 0.58)/(0.86-0.58))); }

function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const n = Math.max(2, p.count|0);
  const gather = clamp01(p.gather);
  const attention = clamp01(p.attention);
  const distance = clamp01(p.distance);
  const THx = W*(p.thresholdX);
  const THmouth = { x: THx, y: H*(p.thresholdY)+H*0.03 };   // the sealed mouth (what they look at)
  const gatherProg = smooth(gather);

  const members = [];
  for (let i=0;i<n;i++){
    const rng = rnd((i*137 + 29)>>>0);
    const t = n>1 ? i/(n-1) : 0.5;                     // 0..1 left->right across the band
    const u = t - 0.5;                                 // -0.5..0.5 (0 = in front of the mouth)

    // GATHER target: a wide shallow CRESCENT wrapping the front of the mouth,
    // ends dipping forward (nearer) so the whole band faces the cave.
    let gx = THx + u*W*0.86 + (rng()-0.5)*W*0.02;
    let gy = H*0.67 + Math.abs(u)*H*0.16 + (rng()-0.5)*H*0.02;   // center higher/behind, wings forward

    // SCATTER home: strung wide toward the edges and lifted up the slope (away)
    const edge = u<0 ? -1 : 1;
    const sx = THx + edge*W*(0.24 + Math.abs(u)*0.9) + (rng()-0.5)*W*0.05;
    const sy = H*(0.55 + rng()*0.16);

    // blend scatter -> gather
    let cx = lerp(sx, gx, gatherProg);
    let by = lerp(sy, gy, gatherProg);

    // distance: lift the whole band up the slope (far), hold it off the floor
    by -= distance * H*0.09 * (0.6 + rng()*0.8);
    by  = clamp(by, H*0.54, H*0.87);
    cx  = clamp(cx, W*0.06, W*0.94);

    // scale from depth, shrunk further by distance
    const s = scaleForY(H, by) * (0.85 + rng()*0.22) * lerp(1.0, 0.68, distance);

    // facing: toward the mouth when massed, outward (their exit) when dispersing
    const towardTH = (THx - cx) >= 0 ? 1 : -1;
    const dir = gatherProg > 0.5 ? towardTH : edge;

    // gaze: eye turns to the sealed mouth in proportion to ATTENTION
    const dx = THmouth.x - (cx + dir*s*0.05), dy = THmouth.y - (by - s*0.58);
    const gl = Math.hypot(dx,dy) || 1;
    const gaze = { x: (dx/gl)*attention, y: clamp((dy/gl)*attention, -0.9, 0.5) };

    // depth shading: near = darker silhouette, far = lighter; distance lightens all
    const depth = (by/H - 0.54)/(0.87-0.54);           // 0 far .. 1 near
    const bodyLevel = Math.round(lerp(3, 6, clamp01(depth)) - distance*1.4);
    const sh = { body: clamp(bodyLevel, 2, 6) };
    const feat = {
      headS: 0.9 + rng()*0.24,
      bulk:  rng(),
      slouch: 0.3 + gatherProg*0.7*rng(),   // lean over the cave when massed
      club:  rng() < 0.5,
    };
    members.push({ cx, baseY:by, s, dir, gaze, sh, feat, depth });
  }
  // painter order: far (small baseY) -> near (large baseY)
  members.sort((a,b)=> a.baseY - b.baseY);
  return { members, showThreshold:p.showThreshold, showHills:p.showHills, distance };
}

/* -------- night hills / horizon the Cyclopes come over -------- */
function drawHills(pen, W, H){
  const g = pen.ctx;
  const horizon = H*0.44;
  // pale night sky
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,horizon);
  // a low moon disc, upper-left (a single quiet light)
  pen.paint(()=>{ g.arc(W*0.16, H*0.16, H*0.05, 0,7); }, toneSolid(inkLevel(2)), 3);
  // far ridge line
  g.fillStyle = inkLevel(3);
  g.beginPath(); g.moveTo(0,horizon);
  for(let x=0;x<=W;x+=W*0.05){ const tt=x/W; g.lineTo(x, horizon - (Math.sin(tt*6.1+1)*0.5+0.5)*H*0.055 - H*0.01); }
  g.lineTo(W,horizon); g.closePath(); g.fill();
  // nearer hill band the giants stand on (slightly darker)
  g.fillStyle = inkLevel(2);
  g.beginPath(); g.moveTo(0,horizon+H*0.02);
  for(let x=0;x<=W;x+=W*0.07){ const tt=x/W; g.lineTo(x, horizon+H*0.02 - Math.sin(tt*4.0)*H*0.02); }
  g.lineTo(W,H); g.lineTo(0,H); g.closePath(); g.fill();
  pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 2);
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const B = buildMembers(W, H, st);

  if (B.showHills) drawHills(pen, W, H);
  if (B.showThreshold) drawThreshold(pen, W, H, { ...params, ...st });

  // the band of one-eyed giants, painter-sorted far -> near
  for (const m of B.members) drawGiant(pen, m);
}

export const asset = {
  id:"ensemble.cyclopes-outside",
  type:"ENSEMBLE",
  name:"Cyclopes outside",
  statusWord:"GATHERING",
  scene:"OD-B09-S09",

  params,
  // ONE giant-silhouette template, instanced deterministically
  member:{ template:"giant" },
  // back -> front draw order the ensemble honors
  layers:["night-sky","hills","threshold","giant-band"],
  // normalized 0..1 anchors: the sealed mouth, the gather arc, the disperse exits
  anchors:{
    "threshold:sealed":{x:.615,y:.545},
    "gather:arc":{x:.615,y:.68},
    "exit:left":{x:.06,y:.74},   "exit:right":{x:.94,y:.74},
    "voice:pole":{x:.615,y:.55},
    "center":{x:.50,y:.60},      "camera:wide":{x:.50,y:.52},
  },
  // hillside the band occupies (for scene placement / pathing)
  zones:{
    hillside:{ x0:.04,y0:.50,x1:.96,y1:.88 },
    threshold:{ x0:.48,y0:.34,x1:.76,y1:.72 },
  },
  channels:["formation","gather","attention","distance","density"],
  states:{
    initial:"gathering",
    nodes:{
      // silhouettes coming over the hill, converging on the bellowing cave
      approaching:{ preview:{ formation:"gathering", gather:0.35, attention:0.7,  distance:0.6,  status:"APPROACHING" } },
      // massed at the sealed mouth, every eye turned on it, calling in
      gathering:  { preview:{ formation:"gathered",  gather:0.8,  attention:0.9,  distance:0.4,  status:"GATHERING" } },
      // told "Nobody" — attention breaks, they begin to turn away
      answered:   { preview:{ formation:"gathered",  gather:0.7,  attention:0.35, distance:0.45, status:"ANSWERED" } },
      // streaming back to their own caves, distant again
      dispersing: { preview:{ formation:"dispersing",gather:0.12, attention:0.15, distance:0.7,  status:"DISPERSING" } },
    },
    edges:[
      ["approaching","gathering"],["gathering","answered"],
      ["answered","dispersing"],["dispersing","approaching"],
    ],
  },

  // neutral preview = massed at the sealed threshold, eyes on the mouth
  preview:()=>({ formation:"gathered", gather:0.7, attention:0.85, distance:0.45, status:"GATHERING", progress:0.62 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
