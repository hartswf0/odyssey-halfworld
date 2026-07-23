/* ensemble.gathering-shades — the crowding dead at the blood-pit (THE DEAD panel).
   ENSEMBLE asset. Scene function (OD-B11-S01): a crowd of PALE TRANSLUCENT shades
   — the transparent dead of varied ages and wounds — draw toward the fresh blood
   but are HELD OUTSIDE a sword boundary. Built from ONE separable member template
   (drawShade) instanced N times deterministically around a CROWD-RING that wraps
   the back + sides of the pit, leaving the near-front open (where the living stand,
   sword drawn).

   The shades are deliberately LIGHT INK (near-paper) with a wispy, dissolving lower
   body — so the engine dotify pass renders them as faint, translucent halftone —
   while the BLOOD and the SWORD are the only dark, hard-contour elements, so the
   eye reads: a dark focal pit + a bright ring of hollow-eyed ghosts held at its rim.

   Exposes formation (crowd-ring), density (rows/perRow), attention (the all-to-blood
   pull that leans every shade inward + lifts a reaching arm), boundary (how strongly
   the sword-line holds them out), depth, and a single `nearest` channel selecting the
   one shade pulled closest to the rim. The living hero + the sword's owner are NOT
   baked in — only the diegetic blood-pit + the laid sword that mark the boundary. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const params = {
  formation:"ring",        // ring | crescent  (crowd-ring wraps the back+sides of the pit)
  rows:3,                  // radial tiers (back..front)
  perRow:[9,7,5],          // members per tier (density) back -> front
  blood:{ x:0.50, y:0.74 },// the blood-pit the whole crowd is drawn toward (0..1)
  attention:0.92,          // all-to-blood pull: 0=slack .. 1=every shade leans + reaches in
  boundary:0.9,            // how hard the sword-line holds them out (rim recoil + gap)
  nearest:0.5,             // WHICH shade is pulled closest to the rim (position 0..1)
  showBlood:true,          // draw the pit + laid sword + faint held-line
  groundY:0.66,            // front-tier base as fraction of H
};

/* ---------------- one wispy arm, shoulder->elbow->wrist (elbow sags) ---------------- */
function ghostArm(g, sh, wr, hex, edge, w){
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x:mx, y:my + Math.abs(wr.x-sh.x)*0.06 + w*0.4 };
  g.lineCap="round"; g.lineJoin="round";
  g.strokeStyle=edge; g.lineWidth=w*1.7;
  g.beginPath(); g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); g.lineTo(wr.x,wr.y); g.stroke();
  g.strokeStyle=hex; g.lineWidth=w;
  g.beginPath(); g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); g.lineTo(wr.x,wr.y); g.stroke();
  return el;
}

/* ============================================================
   ONE member template — a PALE TRANSLUCENT SHADE. A leaning torso rising from a
   dissolving, tongue-scalloped wisp instead of legs; a gaunt hollow-eyed head;
   varied AGE (young / adult / elder-with-beard) and a varied WOUND mark. Every
   shade leans toward the blood and, when attention is high, lifts a reaching arm
   toward the rim — but is held short by the sword boundary.
   ============================================================ */
function drawShade(g, m){
  const s = m.s;
  const robe = inkLevel(m.shade.robe);       // near-paper garment
  const skin = inkLevel(m.shade.skin);       // faintly darker so the face reads
  const wisp = inkLevel(m.shade.wisp);       // the lightest — the dissolving lower body
  const edge = inkLevel(m.shade.edge);       // faint gray contour (NOT hard black)
  const dark = inkLevel(m.shade.dark);       // hollow eyes / wound accents
  const lw   = Math.max(1.4, s*0.020);
  const dir  = m.dir;                          // +1 / -1 toward the blood
  const att  = m.att;

  const headR   = s*0.150*m.feat.headS;
  const torsoLen= s*(m.feat.age==="young"?0.30:0.36);
  const shoHalf = s*(m.feat.age==="elder"?0.17:0.20);
  const hipHalf = s*0.15;
  const lean    = m.lean;                      // px lean of shoulders toward blood
  const shoulderY = m.cy;
  const shoCx   = m.cx + lean;
  const hipY    = shoulderY + torsoLen;
  const bx = m.bloodX, by = m.bloodY;

  // ---- dissolving WISP lower body: a tapering shroud scalloped into tongues ----
  const yBot = hipY + s*0.52;
  g.beginPath();
  g.moveTo(shoCx - shoHalf*0.9, shoulderY + torsoLen*0.25);
  g.lineTo(m.cx - hipHalf, hipY);
  const tongues = 3;
  for (let k=0;k<tongues;k++){
    const x0 = lerp(m.cx - hipHalf, m.cx + hipHalf, k/tongues);
    const x1 = lerp(m.cx - hipHalf, m.cx + hipHalf, (k+1)/tongues);
    const xm = (x0+x1)/2;
    const tip = yBot - (k===1?0:s*0.10);       // uneven, trailing tongues
    g.quadraticCurveTo(xm, tip, x1, hipY + s*0.03);
  }
  g.lineTo(m.cx + hipHalf, hipY);
  g.lineTo(shoCx + shoHalf*0.9, shoulderY + torsoLen*0.25);
  g.closePath();
  g.fillStyle=wisp; g.fill();
  g.strokeStyle=edge; g.lineWidth=lw*0.8; g.lineJoin="round"; g.stroke();
  // a couple faint vertical wisp-streaks so the lower body reads as vapor
  g.strokeStyle=edge; g.lineWidth=lw*0.7; g.globalAlpha=0.6;
  for (let k=-1;k<=1;k++){
    g.beginPath();
    g.moveTo(m.cx + k*hipHalf*0.7, hipY);
    g.quadraticCurveTo(m.cx + k*hipHalf*0.7 + s*0.03, hipY+s*0.25, m.cx + k*hipHalf*0.55, yBot-s*0.06);
    g.stroke();
  }
  g.globalAlpha=1;

  // ---- torso: light robe trapezoid, leaning toward the blood ----
  g.beginPath();
  g.moveTo(m.cx - hipHalf, hipY);
  g.lineTo(m.cx + hipHalf, hipY);
  g.lineTo(shoCx + shoHalf, shoulderY);
  g.lineTo(shoCx - shoHalf, shoulderY);
  g.closePath();
  g.fillStyle=robe; g.fill();
  g.strokeStyle=edge; g.lineWidth=lw; g.lineJoin="round"; g.stroke();
  // one faint shroud fold
  g.strokeStyle=edge; g.lineWidth=lw*0.7; g.globalAlpha=0.7;
  g.beginPath(); g.moveTo(shoCx, shoulderY+s*0.02); g.lineTo(m.cx - dir*hipHalf*0.3, hipY); g.stroke();
  g.globalAlpha=1;

  // ---- shoulders (toward / away from blood) ----
  const shFront = { x: shoCx + dir*shoHalf*0.86, y: shoulderY + s*0.01 };
  const shBack  = { x: shoCx - dir*shoHalf*0.86, y: shoulderY + s*0.01 };
  const armW    = Math.max(2, s*0.038);

  // ---- FAR arm: hangs slack toward the wisp ----
  ghostArm(g, shBack, { x: m.cx - dir*s*0.06, y: hipY - s*0.02 }, robe, edge, armW*0.85);

  // ---- head geometry: turned + reaching toward the blood ----
  const headCx = shoCx + dir*headR*0.22;
  const headCy = shoulderY - headR*0.98;

  // neck
  g.beginPath(); g.rect(headCx - headR*0.24, shoulderY - headR*0.5, headR*0.48, headR*0.72);
  g.fillStyle=skin; g.fill(); g.strokeStyle=edge; g.lineWidth=lw*0.8; g.stroke();

  // hair-back / crown (very light; elders grayer)
  if (m.feat.age!=="young" || m.feat.hair){
    g.beginPath(); g.ellipse(headCx, headCy - headR*0.05, headR*1.06, headR*1.12, 0,0,7);
    g.fillStyle=inkLevel(m.shade.robe+ (m.feat.age==="elder"?1:0)); g.fill();
  }

  // ---- head (pale, gaunt) ----
  g.beginPath(); g.ellipse(headCx, headCy, headR*0.9, headR*1.02, 0,0,7);
  g.fillStyle=skin; g.fill(); g.strokeStyle=edge; g.lineWidth=lw; g.stroke();
  // sunken cheek shadow (faint) for the gaunt dead look
  g.strokeStyle=edge; g.lineWidth=lw*0.7; g.globalAlpha=0.6;
  g.beginPath(); g.arc(headCx - dir*headR*0.05, headCy + headR*0.35, headR*0.55, Math.PI*0.15, Math.PI*0.85); g.stroke();
  g.globalAlpha=1;

  // ---- HOLLOW EYES: two dark empty sockets (the death mask) ----
  const eyeY = headCy - headR*0.06;
  const eyeDX = headR*0.36, eyeRx = headR*0.17, eyeRy = headR*0.24;
  g.fillStyle=dark;
  g.beginPath(); g.ellipse(headCx - eyeDX, eyeY, eyeRx, eyeRy, 0,0,7); g.fill();
  g.beginPath(); g.ellipse(headCx + eyeDX, eyeY, eyeRx, eyeRy, 0,0,7); g.fill();
  // a faint brow line above the hollows
  g.strokeStyle=dark; g.lineWidth=Math.max(1.5, headR*0.09); g.lineCap="round"; g.globalAlpha=0.7;
  g.beginPath();
  g.moveTo(headCx - headR*0.55, eyeY - headR*0.36);
  g.lineTo(headCx + headR*0.55, eyeY - headR*0.34);
  g.stroke(); g.globalAlpha=1;
  // nose: a thin faint line toward the blood
  g.strokeStyle=edge; g.lineWidth=Math.max(1.5, headR*0.10);
  g.beginPath(); g.moveTo(headCx, eyeY + headR*0.10); g.lineTo(headCx + dir*headR*0.16, eyeY + headR*0.4); g.stroke();
  // mouth: a small dark open gape (the silent, thirsting dead)
  g.fillStyle=dark; g.globalAlpha=0.85;
  g.beginPath(); g.ellipse(headCx + dir*headR*0.04, headCy + headR*0.52, headR*0.16, headR*0.12, 0,0,7); g.fill();
  g.globalAlpha=1;

  // ---- AGE marks: elder beard (light gray) / young smaller already handled ----
  if (m.feat.age==="elder"){
    g.beginPath();
    g.moveTo(headCx-headR*0.5, headCy+headR*0.34);
    g.quadraticCurveTo(headCx, headCy+headR*1.35, headCx+headR*0.5, headCy+headR*0.34);
    g.quadraticCurveTo(headCx, headCy+headR*0.7, headCx-headR*0.5, headCy+headR*0.34);
    g.closePath();
    g.fillStyle=inkLevel(m.shade.robe+1); g.fill();
    g.strokeStyle=edge; g.lineWidth=lw*0.7; g.stroke();
  }

  // ---- WOUND: a varied dark death-mark (gash / throat-cut / arrow stub) ----
  if (m.feat.wound){
    g.strokeStyle=dark; g.lineCap="round";
    if (m.feat.wound==="chest"){
      g.lineWidth=Math.max(2, s*0.03);
      g.beginPath();
      g.moveTo(shoCx - dir*shoHalf*0.2, shoulderY + torsoLen*0.35);
      g.lineTo(shoCx + dir*shoHalf*0.35, shoulderY + torsoLen*0.62);
      g.stroke();
    } else if (m.feat.wound==="throat"){
      g.lineWidth=Math.max(2, s*0.028);
      g.beginPath();
      g.moveTo(headCx - headR*0.4, shoulderY - headR*0.15);
      g.lineTo(headCx + headR*0.4, shoulderY - headR*0.05);
      g.stroke();
    } else if (m.feat.wound==="head"){
      g.lineWidth=Math.max(2, s*0.026);
      g.beginPath();
      g.moveTo(headCx - headR*0.5, headCy - headR*0.6);
      g.lineTo(headCx + headR*0.05, headCy - headR*0.05);
      g.stroke();
    } else { // arrow stub protruding from the torso
      g.lineWidth=Math.max(2, s*0.03);
      const ax = shoCx, ay = shoulderY + torsoLen*0.4;
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax + dir*s*0.14, ay - s*0.06); g.stroke();
      g.lineWidth=Math.max(1.5, s*0.018);
      g.beginPath();
      g.moveTo(ax + dir*s*0.14, ay - s*0.06); g.lineTo(ax + dir*s*0.10, ay - s*0.10);
      g.moveTo(ax + dir*s*0.14, ay - s*0.06); g.lineTo(ax + dir*s*0.17, ay - s*0.02);
      g.stroke();
    }
  }

  // ---- NEAR arm: reaches toward the blood when attention is high, held short ----
  const toB = { x: bx - shFront.x, y: by - shFront.y };
  const L = Math.hypot(toB.x, toB.y) || 1;
  const reach = Math.min(L*0.55, s*0.20 + s*0.18*att*(m.near?1.5:1)); // held short of the rim
  const wrist = { x: shFront.x + toB.x/L*reach, y: shFront.y + toB.y/L*reach };
  ghostArm(g, shFront, wrist, robe, edge, armW);
  // faint reaching hand
  g.beginPath(); g.ellipse(wrist.x, wrist.y, headR*0.26, headR*0.2, 0,0,7);
  g.fillStyle=skin; g.fill(); g.strokeStyle=edge; g.lineWidth=lw*0.7; g.stroke();

  return { head:{ x:headCx, y:headCy }, r:headR, near:m.near, cx:m.cx, cy:shoulderY };
}

/* ============================================================
   build the crowd-ring deterministically. Members wrap the back + sides of the
   pit (a horseshoe open at the near-front). Rows are concentric tiers: back =
   small/high/far, front = large/low/near. The `nearest` scalar selects the one
   shade pulled to the very rim. Boundary recoils the ring outward.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st, blood:{ ...params.blood, ...(st&&st.blood||{}) } };
  const att = clamp01(p.attention);
  const bound = clamp01(p.boundary);
  const rows = Math.max(1, p.rows|0);
  const perRow = p.perRow || [9,7,5];
  const bx = p.blood.x*W, by = p.blood.y*H;
  const cres = p.formation==="crescent";

  // enumerate seats so `nearest` can pick one by global position
  const seats = [];
  for (let r=0;r<rows;r++){
    const depth = rows>1 ? r/(rows-1) : 0;    // 0=back .. 1=front
    const n = perRow[Math.min(r, perRow.length-1)] || 5;
    for (let i=0;i<n;i++) seats.push({ r, i, n, depth });
  }
  const total = seats.length;
  const nearIdx = Math.round(clamp01(p.nearest)*(total-1));

  const members = [];
  seats.forEach((seat, idx)=>{
    const { i, n, depth } = seat;
    // arc sweep: over the top + down both sides, leaving the near-front open.
    // crescent narrows the sweep to the far side.
    const angA = cres ? Math.PI*1.05 : Math.PI*1.14;
    const angB = cres ? Math.PI*0.30 : -Math.PI*0.14;
    const stagger = (seat.r%2)*0.5/Math.max(1,n-1);
    const t = n>1 ? clamp01(i/(n-1) + stagger) : 0.5;
    const ang = lerp(angA, angB, t);

    const ringRx = lerp(W*0.30, W*0.42, depth) * (1 + bound*0.06);
    const ringRy = lerp(H*0.13, H*0.19, depth);
    const cyRow  = lerp(H*0.38, p.groundY*H, depth);
    const cx = W*0.5 + ringRx*Math.cos(ang);
    const cy = cyRow - ringRy*Math.sin(ang);
    // back-top shades read smaller (farther); side/front larger
    const scale = lerp(100, 150, depth) * (1 - 0.16*Math.max(0,Math.sin(ang)));

    const rng = rnd((seat.r*137 + i*29 + 7)>>>0);
    const ar = rng();
    const age = ar<0.22 ? "young" : ar<0.66 ? "adult" : "elder";
    const wr = rng();
    const wound = wr<0.30 ? "chest" : wr<0.48 ? "throat" : wr<0.64 ? "head" : wr<0.78 ? "arrow" : null;
    const feat = { age, wound, hair: rng()<0.7, headS: (age==="young"?0.82:age==="elder"?1.06:1.0) };

    // orientation + lean toward the blood
    const dir = (bx <= cx) ? -1 : 1;
    const isNear = idx===nearIdx;
    const lean = dir * scale*0.05 * att * (isNear?1.4:1);

    members.push({
      cx, cy, s:scale, depth, dir, att, lean, near:isNear,
      bloodX:bx, bloodY:by, feat,
      shade:{
        robe: 1,                                        // near-paper garment (all shades stay pale)
        skin: 2,                                         // face just readable
        wisp: 1,                                         // lightest lower body
        edge: 3,                                         // faint gray contour
        dark: 5,                                         // hollow eyes / wounds
      },
    });
  });

  // draw back -> front so nearer shades occlude the far ranks
  members.sort((a,b)=> a.cy - b.cy);
  return { members, blood:{ x:bx, y:by }, bound, showBlood:p.showBlood };
}

/* -------- the BLOOD-PIT + laid SWORD (the boundary the dead are held outside) --------
   The only dark, hard-contour elements — a black pit of blood ringed by a trench, a
   sword laid across the near rim with a single ACCENT gleam, and a faint held-line
   arc marking where the shades are stopped. The living are NOT drawn. */
function drawBloodBoundary(pen, g, W, H, B){
  const bx = B.blood.x, by = B.blood.y;

  // faint HELD-LINE the shades are stopped at (upper arc, dashed, quiet)
  g.save();
  g.strokeStyle=inkLevel(4); g.globalAlpha=0.22*(0.4+0.6*B.bound); g.lineWidth=Math.max(2,W*0.004);
  g.setLineDash([7,9]);
  g.beginPath(); g.ellipse(bx, by - H*0.015, W*0.235, H*0.165, 0, Math.PI*1.02, Math.PI*1.98); g.stroke();
  g.setLineDash([]); g.globalAlpha=1; g.restore();

  // trench / dug earth ring
  pen.paint(()=>{ g.ellipse(bx, by, W*0.135, H*0.062, 0,0,7); }, toneSolid(inkLevel(4)), 3);
  // the pooled blood (darkest focal)
  pen.paint(()=>{ g.ellipse(bx, by, W*0.095, H*0.042, 0,0,7); }, toneSolid(inkLevel(7)), 3);
  // a few blood glints / ripple ticks
  g.strokeStyle=inkLevel(2); g.globalAlpha=0.5; g.lineWidth=Math.max(1.5,W*0.003);
  for (let k=-1;k<=1;k++){ g.beginPath(); g.ellipse(bx+k*W*0.03, by, W*0.03, H*0.012, 0, Math.PI*0.1, Math.PI*0.9); g.stroke(); }
  g.globalAlpha=1;

  // the SWORD laid across the near rim = the boundary
  const s0={ x:W*0.32, y:H*0.83 }, s1={ x:W*0.62, y:H*0.775 };
  const bladeW = W*0.018;
  const dx=s1.x-s0.x, dy=s1.y-s0.y, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L;
  // blade (metal: black outline + mid-gray core), tapered to a rounded point at s0
  pen.limb(()=>{ g.moveTo(s0.x + ux*W*0.02, s0.y + uy*W*0.02); g.lineTo(s1.x, s1.y); }, toneSolid(inkLevel(5)), bladeW);
  // ACCENT gleam down the blade
  g.strokeStyle=ACCENT; g.lineWidth=Math.max(1.5,W*0.004); g.lineCap="round"; g.globalAlpha=0.85;
  g.beginPath(); g.moveTo(s0.x+ux*W*0.02, s0.y+uy*W*0.02); g.lineTo(s1.x-ux*W*0.06, s1.y-uy*W*0.06); g.stroke();
  g.globalAlpha=1;
  // crossguard + grip + pommel at the hilt (near end s1)
  const gx=s1.x, gy=s1.y;
  pen.limb(()=>{ g.moveTo(gx - uy*bladeW*1.7, gy + ux*bladeW*1.7); g.lineTo(gx + uy*bladeW*1.7, gy - ux*bladeW*1.7); }, toneSolid(inkLevel(6)), bladeW*0.8);
  pen.limb(()=>{ g.moveTo(gx,gy); g.lineTo(gx+ux*W*0.045, gy+uy*W*0.045); }, toneSolid(inkLevel(6)), bladeW*0.9);
  pen.paint(()=>{ g.arc(gx+ux*W*0.05, gy+uy*W*0.05, bladeW*0.9, 0, 7); }, toneSolid(inkLevel(6)), 3);
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  // faint cold ground-mist rules under the ring
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.10;
  for (let k=0;k<=3;k++){ const y=H*(0.60+k*0.09); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // the crowd of shades, back -> front (pale, translucent)
  const heads = B.members.map(m => drawShade(g, m));

  // the dark blood-pit + laid sword boundary, on top (the focal anchor)
  if (B.showBlood) drawBloodBoundary(pen, g, W, H, B);

  // mark the ONE shade pulled to the rim with a faint blue reach-arc
  const near = heads.find(h=>h.near);
  if (near){
    g.strokeStyle=ACCENT; g.globalAlpha=0.5; g.lineWidth=Math.max(2,W*0.004);
    g.beginPath(); g.arc(near.head.x, near.head.y, near.r*1.8, Math.PI*0.15, Math.PI*0.85); g.stroke();
    g.globalAlpha=1;
  }
}

export const asset = {
  id:"ensemble.gathering-shades",
  type:"ENSEMBLE",
  name:"Gathering shades",
  statusWord:"THIRSTING",
  scene:"OD-B11-S01",

  params,
  // back -> front draw order the ensemble honors
  layers:["mist","back-ring","mid-ring","front-ring","blood-pit","sword-boundary","held-line","nearest-mark"],
  // normalized 0..1 anchors: the pit, the sword boundary, ring handles, the rim shade
  anchors:{
    "blood:pit":{x:.50,y:.72}, "boundary:sword":{x:.46,y:.79}, "boundary:hilt":{x:.63,y:.755},
    "ring:back":{x:.50,y:.30}, "ring:left":{x:.16,y:.56}, "ring:right":{x:.84,y:.56},
    "ring:front-left":{x:.28,y:.72}, "ring:front-right":{x:.72,y:.72},
    "shade:nearest":{x:.50,y:.58}, "gap:approach":{x:.50,y:.90}, "camera:wide":{x:.50,y:.52},
  },
  zones:{
    crowd:{ x0:.08,y0:.24,x1:.92,y1:.80 },      // where the ring stands (held outside)
    forbidden:{ x0:.34,y0:.62,x1:.66,y1:.84 },  // inside the boundary — no shade may enter
  },
  states:{
    initial:"gathering",
    nodes:{
      // the dead crowd in, drawn by the blood, leaning + reaching, held at the rim
      gathering:{ preview:{ attention:0.9, boundary:0.9, nearest:0.5, status:"GATHERING" } },
      // the pull peaks — every shade strains toward the pit, the ring presses the line
      pressing:{ preview:{ attention:1.0, boundary:0.85, nearest:0.5, status:"THIRSTING" } },
      // the sword holds hard — the ring recoils outward, arms falling
      held:{ preview:{ attention:0.55, boundary:1.0, nearest:0.5, status:"HELD BACK" } },
      // one shade is let to the rim — it reaches over the line toward the blood
      "one-forward":{ preview:{ attention:0.8, boundary:0.7, nearest:0.5, status:"ONE COMES" } },
    },
    edges:[
      ["gathering","pressing"],["pressing","held"],["held","one-forward"],
      ["one-forward","gathering"],["gathering","held"],
    ],
  },
  channels:["attention","boundary","formation","density","nearest","depth"],

  // neutral preview = the crowd gathered, thirsting, leaning to the blood, held at the rim
  preview:()=>({ attention:0.92, boundary:0.9, nearest:0.5, formation:"ring",
                 status:"THIRSTING", progress:0.44 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
