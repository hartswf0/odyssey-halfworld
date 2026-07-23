/* ensemble.cicones-army — the disciplined inland host of the Cicones.
   ENSEMBLE asset. Scene function (OD-B09-S02): after Odysseus' men sack Ismaros
   and linger to feast, the coastal Cicones call in their kinsmen from inland —
   REINFORCED, DISCIPLINED fighters who arrive "as many as the leaves and flowers
   in spring", in RANKED FORMATION, with SPEARS and CHARIOTS, and bring ordered
   PRESSURE to bear on the beach.

   Built as a repeatable group from ONE separable member template (drawSpearman)
   instanced N times deterministically across depth-sorted RANKS, plus a
   foreground line of CHARIOTS (drawChariot) and a rising SPEAR FOREST that reads
   the ordered mass. Uniformity is the point: the men are near-identical, evenly
   spaced, spears vertical and aligned — DISCIPLINE. Exposes: formation
   (ranked-line | chariot-wedge | column), density (perRow), pressure (0 = held
   at the tree-line .. 1 = leaned forward, spears couched, the advance), and
   reaction/advance channels. Drawn in SOLID grays + hard contour; the engine
   dotify pass supplies the halftone. Odysseus' beached men are NOT baked in — a
   lower-left FOCUS pole marks where the pressure is aimed. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const params = {
  formation:"ranked-line", // ranked-line | chariot-wedge | column
  rows:4,                  // depth tiers of ranked spearmen (back..front)
  perRow:[12,10,8,7],      // members per tier (density) — a broad ordered front, gaps visible
  pressure:0.4,            // 0 = halted at the inland tree-line .. 1 = advance, spears couched
  chariots:2,              // foreground chariots rolling in ahead of the ranks
  showChariots:true,
  showTreeLine:true,       // inland horizon the reinforcements emerge from
  showFocusPole:true,      // lower-left marker for the beached Greeks under pressure
  frontY:0.70,             // front rank footline as fraction of H
  backY:0.40,              // back rank footline as fraction of H
};

/* ============================================================
   ONE member template — a disciplined Cicones spearman.
   Compact, near-uniform (that uniformity IS the discipline read). Geometry
   keyed off `s` (member scale). `lean` in 0..1 tilts the man + couches the
   spear forward under PRESSURE. `feat` carries small deterministic identity
   (crest height, beard, shield boss) so the ordered mass still breathes.
   ============================================================ */
function drawSpearman(pen, m){
  const g = pen.ctx, s = m.s;
  const skin   = toneSolid(inkLevel(m.sh.skin));
  const tunic  = toneSolid(inkLevel(m.sh.tunic));
  const armor  = toneSolid(inkLevel(m.sh.armor));
  const helm   = toneSolid(inkLevel(m.sh.helm));
  const shieldT= toneSolid(inkLevel(m.sh.shield));
  const cw = Math.max(1.6, s*0.02);

  const footY   = m.baseY;
  const shoY    = footY - s*0.66;          // shoulders
  const shoHalf = s*0.165;
  const hipHalf = s*0.125;
  const hipY    = footY - s*0.16;
  const cx      = m.cx;
  const lean    = m.lean;                    // 0..1 forward pressure
  const px      = lean * s * 0.10;           // shoulders shear toward the target (left)
  const shoCx   = cx - px;
  const headR   = s*0.115 * m.feat.headS;
  const headCx  = shoCx - px*0.5;
  const headCy  = shoY - headR*1.05;

  // ---- SPEAR (behind body): tall, aligned; couches forward under pressure ----
  const gripX = cx + s*0.10, gripY = shoY + s*0.02;
  const upAng = -Math.PI/2 + lean*0.52;      // vertical at rest, tips forward-left when pressed
  const spLen = s*(1.34 - lean*0.18);
  const tipX  = gripX + Math.cos(upAng)*spLen*(m.feat.aim);
  const tipY  = gripY + Math.sin(upAng)*spLen;
  pen.limb(()=>{ g.moveTo(gripX,gripY); g.lineTo(tipX,tipY); }, toneSolid(inkLevel(5)), Math.max(1.6,s*0.028));
  // leaf blade at the tip (darkest)
  const bx = tipX + Math.cos(upAng)*s*0.10, by = tipY + Math.sin(upAng)*s*0.10;
  pen.paint(()=>{ g.ellipse(bx, by, s*0.028, s*0.075, upAng+Math.PI/2, 0,7); }, toneSolid(inkLevel(7)), cw*0.7);

  // ---- LEGS : two short greaved legs (planted, disciplined stance) ----
  const legW = Math.max(2, s*0.075);
  for (const side of [-1,1]){
    const hp={x:cx+side*hipHalf*0.7, y:hipY};
    const fp={x:cx+side*hipHalf*0.85 + lean*s*0.04*(side<0?1:0.4), y:footY};
    pen.limb(()=>{ g.moveTo(hp.x,hp.y); g.lineTo(fp.x,fp.y); }, tunic, legW);
    pen.paint(()=>{ g.ellipse(fp.x-s*0.02, fp.y, s*0.06, s*0.028, 0,0,7); }, toneSolid(inkLevel(7)), cw*0.5);
  }

  // ---- TORSO : cuirass trapezoid (kilt/tunic below), slightly hunched ----
  pen.paint(()=>{
    g.moveTo(cx-hipHalf, hipY);
    g.lineTo(cx+hipHalf, hipY);
    g.lineTo(shoCx+shoHalf, shoY);
    g.lineTo(shoCx-shoHalf, shoY);
    g.closePath();
  }, armor, cw);
  // belt + pectoral seams so the armour reads
  pen.seam(()=>{ g.moveTo(cx-hipHalf, hipY-s*0.01); g.lineTo(cx+hipHalf, hipY-s*0.01); }, cw*0.6);
  pen.seam(()=>{ g.moveTo(shoCx-shoHalf*0.6, shoY+s*0.05); g.quadraticCurveTo(shoCx, shoY+s*0.10, shoCx+shoHalf*0.6, shoY+s*0.05); }, cw*0.55);

  // ---- SPEAR ARM : grips the shaft near the shoulder ----
  pen.limb(()=>{ g.moveTo(shoCx+shoHalf*0.7, shoY+s*0.03); g.lineTo(gripX, gripY); }, armor, Math.max(2,s*0.055));

  // ---- NECK + HEAD ----
  pen.limb(()=>{ g.moveTo(shoCx, shoY+s*0.005); g.lineTo(headCx, headCy+headR*0.75); }, skin, s*0.05);
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.9, headR, 0,0,7); }, skin, cw*0.7);
  if (m.feat.beard)
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.5, headCy+headR*0.26);
      g.quadraticCurveTo(headCx, headCy+headR*1.28, headCx+headR*0.5, headCy+headR*0.26);
      g.quadraticCurveTo(headCx, headCy+headR*0.6, headCx-headR*0.5, headCy+headR*0.26);
    }, toneSolid(inkLevel(6)), cw*0.55);

  // ---- HELMET : dome cap + nasal + upright disciplined crest ----
  pen.paint(()=>{
    g.moveTo(headCx-headR*1.02, headCy+headR*0.10);
    g.quadraticCurveTo(headCx-headR*1.05, headCy-headR*1.15, headCx, headCy-headR*1.2);
    g.quadraticCurveTo(headCx+headR*1.05, headCy-headR*1.15, headCx+headR*1.02, headCy+headR*0.10);
    g.quadraticCurveTo(headCx, headCy-headR*0.2, headCx-headR*1.02, headCy+headR*0.10);
  }, helm, cw*0.8);
  // crest : an upright ridge (uniform across the host — the discipline signature)
  pen.paint(()=>{
    const ch = headR*(1.05 + m.feat.crest*0.5);
    g.moveTo(headCx-headR*0.16, headCy-headR*1.05);
    g.quadraticCurveTo(headCx-headR*0.02, headCy-headR-ch, headCx+headR*0.20, headCy-headR-ch*0.82);
    g.quadraticCurveTo(headCx+headR*0.14, headCy-headR*1.05, headCx+headR*0.16, headCy-headR*1.0);
    g.closePath();
  }, toneSolid(inkLevel(Math.min(7,m.sh.helm+1))), cw*0.55);

  // ---- SHIELD : round, presented on the target (left) side, overlaps torso ----
  const sx = shoCx - shoHalf*0.5, sy = shoY + s*0.22, sr = s*0.21;
  pen.paint(()=>{ g.arc(sx, sy, sr, 0,7); }, shieldT, cw);
  pen.ink(()=>{ g.arc(sx, sy, sr*0.82, 0,7); }, cw*0.55);          // inner rim
  pen.paint(()=>{ g.arc(sx, sy, sr*0.22, 0,7); }, toneSolid(inkLevel(7)), cw*0.5); // boss
  if (m.feat.blazon){                                              // a spoke blazon on some shields
    g.strokeStyle=INK; g.lineWidth=cw*0.5;
    for(let a=0;a<4;a++){ g.beginPath(); g.moveTo(sx,sy); g.lineTo(sx+Math.cos(a*Math.PI/2)*sr*0.78, sy+Math.sin(a*Math.PI/2)*sr*0.78); g.stroke(); }
  }

  return { head:{x:headCx,y:headCy}, r:headR, tip:{x:tipX,y:tipY} };
}

/* ============================================================
   ONE chariot template — a light two-horse war-car rolling in ahead of the ranks.
   Two spoked wheels, a rail car, a draught pole to a paired horse silhouette,
   and two helmeted busts aboard (driver + fighter). Geometry keyed off `s`.
   ============================================================ */
function drawChariot(pen, cx, baseY, s, lean){
  const g = pen.ctx;
  const dark = toneSolid(inkLevel(7));
  const wheelT= toneSolid(inkLevel(5));
  const carT  = toneSolid(inkLevel(4));
  const horseT= toneSolid(inkLevel(6));
  const cw = Math.max(2, s*0.02);
  const dir = -1;                       // team faces / presses LEFT toward the beach

  // ---- draught POLE + PAIRED HORSES (ahead of the car, toward the target) ----
  const poleY = baseY - s*0.30;
  const teamX = cx + dir*s*1.15;
  pen.limb(()=>{ g.moveTo(cx+dir*s*0.20, poleY); g.lineTo(teamX+dir*s*0.10, poleY-s*0.06); }, toneSolid(inkLevel(5)), Math.max(2,s*0.03));
  for (const off of [0.0, 0.16]){       // two horses, near + far
    const hx = teamX + off*s, hy = poleY - off*s*0.9;
    // body
    pen.paint(()=>{ g.ellipse(hx, hy, s*0.34, s*0.17, -0.05, 0,7); }, horseT, cw);
    // arched neck + head reaching forward-left
    pen.paint(()=>{
      g.moveTo(hx+dir*s*0.30, hy-s*0.02);
      g.quadraticCurveTo(hx+dir*s*0.55, hy-s*0.34, hx+dir*s*0.60, hy-s*0.44);
      g.lineTo(hx+dir*s*0.52, hy-s*0.46);
      g.quadraticCurveTo(hx+dir*s*0.42, hy-s*0.30, hx+dir*s*0.20, hy-s*0.04);
      g.closePath();
    }, horseT, cw*0.8);
    // legs (four, planted-galloping)
    g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.045); g.lineCap="round";
    for (const lx of [-0.22,-0.06,0.14,0.28]){
      g.beginPath(); g.moveTo(hx+lx*s, hy+s*0.13);
      g.lineTo(hx+lx*s + dir*lean*s*0.10, baseY+s*0.02); g.stroke();
    }
  }

  // ---- WHEELS (two, back one smaller for a hint of depth) ----
  for (const [wx,wr,tn] of [[cx+s*0.12, s*0.42, wheelT],[cx-s*0.10, s*0.46, wheelT]]){
    pen.paint(()=>{ g.arc(wx, baseY, wr, 0,7); }, tn, cw);
    pen.ink(()=>{ g.arc(wx, baseY, wr*0.72, 0,7); }, cw*0.6);         // felloe
    pen.paint(()=>{ g.arc(wx, baseY, wr*0.16, 0,7); }, dark, cw*0.5);// hub
    g.strokeStyle=INK; g.lineWidth=cw*0.55;                          // spokes
    for(let a=0;a<6;a++){ g.beginPath(); g.moveTo(wx,baseY); g.lineTo(wx+Math.cos(a*Math.PI/3)*wr*0.7, baseY+Math.sin(a*Math.PI/3)*wr*0.7); g.stroke(); }
  }

  // ---- CAR (rail box the crew stand in) ----
  const carY = baseY - s*0.30;
  pen.paint(()=>{
    g.moveTo(cx-s*0.42, carY);
    g.lineTo(cx+s*0.30, carY);
    g.quadraticCurveTo(cx+s*0.46, carY, cx+s*0.42, carY+s*0.34);
    g.lineTo(cx-s*0.40, carY+s*0.34);
    g.closePath();
  }, carT, cw);
  pen.seam(()=>{ g.moveTo(cx-s*0.40, carY+s*0.16); g.lineTo(cx+s*0.42, carY+s*0.16); }, cw*0.6);

  // ---- CREW : two helmeted busts (driver + fighter) rising from the car ----
  const crew = [[cx-s*0.16,0.9,true],[cx+s*0.16,1.0,false]];
  for (const [bx,bs,driver] of crew){
    const hr = s*0.15*bs, hy = carY - hr*1.15;
    // shoulders
    pen.paint(()=>{ g.moveTo(bx-s*0.18*bs, carY); g.lineTo(bx+s*0.18*bs, carY);
                    g.lineTo(bx+s*0.12*bs, carY-s*0.22*bs); g.lineTo(bx-s*0.12*bs, carY-s*0.22*bs); g.closePath(); },
              toneSolid(inkLevel(4)), cw);
    // head + helmet + crest
    pen.paint(()=>{ g.ellipse(bx, hy, hr*0.9, hr, 0,0,7); }, toneSolid(inkLevel(2)), cw*0.7);
    pen.paint(()=>{
      g.moveTo(bx-hr*1.02, hy+hr*0.1);
      g.quadraticCurveTo(bx, hy-hr*1.2, bx+hr*1.02, hy+hr*0.1);
      g.quadraticCurveTo(bx, hy-hr*0.2, bx-hr*1.02, hy+hr*0.1);
    }, toneSolid(inkLevel(6)), cw*0.7);
    pen.paint(()=>{ g.moveTo(bx-hr*0.14, hy-hr*1.05); g.quadraticCurveTo(bx, hy-hr*2.0, bx+hr*0.24, hy-hr*1.7);
                    g.quadraticCurveTo(bx+hr*0.1, hy-hr*1.1, bx-hr*0.14, hy-hr*1.05); g.closePath(); },
              toneSolid(inkLevel(7)), cw*0.5);
    // the fighter levels a spear forward; the driver holds reins
    if (!driver){
      pen.limb(()=>{ g.moveTo(bx, carY-s*0.1); g.lineTo(bx+dir*s*0.9, carY-s*0.26); }, toneSolid(inkLevel(5)), Math.max(2,s*0.026));
    } else {
      pen.ink(()=>{ g.moveTo(bx, carY-s*0.06); g.lineTo(cx+dir*s*0.9, carY-s*0.12); }, cw*0.5);   // reins
    }
  }
}

/* -------- inland TREE-LINE / horizon the reinforcements pour out of -------- */
function drawTreeLine(pen, W, H, horizon){
  const g = pen.ctx;
  // low inland hills (light)
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,horizon);
  g.fillStyle=inkLevel(2);
  g.beginPath();
  g.moveTo(0,horizon);
  for(let x=0;x<=W;x+=W*0.06){ const t=x/W; g.lineTo(x, horizon - (Math.sin(t*7)*0.5+0.5)*H*0.04 - H*0.02); }
  g.lineTo(W,horizon); g.closePath(); g.fill();
  // a darker treeline band (the woods they muster from)
  g.fillStyle=inkLevel(3);
  for(let x=0;x<W;x+=W*0.028){
    const h = H*(0.03 + 0.02*Math.abs(Math.sin(x*0.05)));
    g.beginPath(); g.moveTo(x,horizon); g.lineTo(x+W*0.014, horizon-h); g.lineTo(x+W*0.028,horizon); g.closePath(); g.fill();
  }
  pen.ink(()=>{ g.moveTo(0,horizon); g.lineTo(W,horizon); }, 3);
}

/* -------- the FOCUS pole (lower-left): where the pressure is aimed --------- */
function drawFocusPole(pen, cx, baseY, s){
  const g = pen.ctx;
  // a beached prow / mooring stake — the Greeks' position under threat
  pen.paint(()=>{ g.rect(cx-s*0.14, baseY-s*1.0, s*0.28, s*1.0); }, toneSolid(inkLevel(5)), 4);
  pen.paint(()=>{ g.rect(cx-s*0.28, baseY-s*1.0, s*0.56, s*0.12); }, toneSolid(inkLevel(6)), 4);
  pen.paint(()=>{
    g.moveTo(cx-s*0.7, baseY); g.quadraticCurveTo(cx, baseY+s*0.32, cx+s*0.7, baseY);
    g.lineTo(cx+s*0.5, baseY-s*0.16); g.lineTo(cx-s*0.5, baseY-s*0.16); g.closePath();
  }, toneSolid(inkLevel(4)), 4);
  // a small accent — the point of contact / pressure
  g.fillStyle=ACCENT; g.beginPath(); g.arc(cx+s*0.1, baseY-s*0.9, Math.max(2,s*0.05), 0,7); g.fill();
}

/* ============================================================
   Build the ranked host deterministically from params + state.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const rows = Math.max(1, p.rows|0);
  const perRow = p.perRow || [15,13,11,9];
  const pressure = clamp01(p.pressure);
  const wedge = p.formation==="chariot-wedge";
  const column = p.formation==="column";

  const members = [];
  for (let r=0;r<rows;r++){
    const depth = rows>1 ? r/(rows-1) : 0;          // 0=back .. 1=front
    const n = perRow[Math.min(r, perRow.length-1)] || (12-2*r);
    const scale = H*lerp(0.098, 0.150, depth);
    const rowY  = H*lerp(p.backY, p.frontY, depth);
    const marginX = lerp(0.10, 0.06, depth);
    const stagger = (r%2)*0.5;                        // nest ranks into the gaps ahead
    for (let i=0;i<n;i++){
      const t = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
      let px = lerp(marginX, 1-marginX, clamp01(t));
      if (wedge){                                     // ranks narrow toward the front (a wedge)
        px = 0.5 + (px-0.5)*lerp(1.15, 0.6, depth);
      }
      if (column){                                    // tight marching column down the middle
        px = 0.5 + (px-0.5)*0.42;
      }
      const cx = W*px;
      const by = rowY;
      // pressure ripples front-to-back: the front ranks lean/couch first
      const localLean = clamp01(pressure*1.2 - (1-depth)*0.35);
      const rng = rnd((r*211+i*37+13)>>>0);
      const feat = {
        beard: rng()<0.7,
        headS: 0.94 + rng()*0.12,
        crest: 0.7 + rng()*0.6,            // small crest-height variation
        aim:   0.9 + rng()*0.2,            // slight spear-length variation
        blazon: rng()<0.4,
      };
      const sh = {
        skin:  Math.round(lerp(1, 2, depth)),
        tunic: Math.round(lerp(2, 3, depth)),
        armor: Math.round(lerp(3, 4, depth)),
        helm:  Math.round(lerp(4, 5, depth)),
        shield:Math.round(lerp(2, 3, depth)) + (i%2),
      };
      members.push({ cx, baseY:by, s:scale, lean:localLean, feat, sh, depth, r });
    }
  }
  // painter order: back (small baseY) -> front (large baseY)
  members.sort((a,b)=> a.baseY - b.baseY);
  return { members, pressure,
           chariots:p.chariots|0, showChariots:p.showChariots,
           showTreeLine:p.showTreeLine, showFocusPole:p.showFocusPole,
           frontY:p.frontY };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const horizon = H*(params.backY - 0.06);

  // inland tree-line the reinforcements muster from
  if (B.showTreeLine) drawTreeLine(pen, W, H, horizon);

  // dusty plain the host stands on (light ground band, faint order lines)
  g.fillStyle=inkLevel(1); g.fillRect(0,horizon,W,H-horizon);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.16;
  for(let k=1;k<=4;k++){ const y=lerp(horizon+H*0.02, H*0.9, k/4);
    g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // the ranked spearmen, painter-sorted back -> front
  for (const m of B.members) drawSpearman(pen, m);

  // foreground CHARIOTS rolling in ahead of the front rank
  if (B.showChariots && B.chariots>0){
    const cn = B.chariots;
    const cs = W*0.125;
    const cy = H*0.905;
    const lean = clamp01(B.pressure);
    for (let i=0;i<cn;i++){
      const t = cn>1 ? i/(cn-1) : 0.5;
      const cx = lerp(W*0.28, W*0.74, t) + (i%2?W*0.02:0);
      drawChariot(pen, cx, cy, cs, lean);
    }
  }

  // lower-left FOCUS pole — the beached Greeks the pressure bears on
  if (B.showFocusPole) drawFocusPole(pen, W*0.075, H*0.80, W*0.05);
}

export const asset = {
  id:"ensemble.cicones-army",
  type:"ENSEMBLE",
  name:"Cicones army",
  statusWord:"DISCIPLINED",
  scene:"OD-B09-S02",

  params,
  // ONE spearman template + ONE chariot template, instanced deterministically
  member:{ template:"spearman", extras:["chariot"] },
  // back -> front draw order the ensemble honors
  layers:["tree-line","plain","back-rank","mid-ranks","front-rank","chariots","focus-pole"],
  // normalized 0..1 anchors: formation handles, the chariot line, the aimed pressure
  anchors:{
    "rank:back":{x:.50,y:.40},   "rank:front":{x:.50,y:.72},
    "wing:left":{x:.08,y:.66},   "wing:right":{x:.92,y:.66},
    "chariot:a":{x:.34,y:.92},   "chariot:b":{x:.72,y:.92},
    "focus:beach":{x:.075,y:.80},"tree-line":{x:.50,y:.34},
    "center":{x:.50,y:.58},      "camera:wide":{x:.50,y:.52},
  },
  // ordered ground the host occupies (for scene placement / pathing)
  zones:{
    host:{ x0:.05,y0:.36,x1:.95,y1:.80 },
    chariotLine:{ x0:.18,y0:.82,x1:.90,y1:.98 },
    treeLine:{ x0:.0,y0:.26,x1:1.0,y1:.36 },
    beach:{ x0:.0,y0:.72,x1:.16,y1:.90 },
  },
  states:{
    initial:"mustering",
    nodes:{
      // pouring out of the inland woods into ranks, spears upright, not yet moving
      mustering: { preview:{ formation:"ranked-line", pressure:0.12, status:"MUSTERING" } },
      // ranks dressed and formed, disciplined pressure building, chariots up
      formed:    { preview:{ formation:"ranked-line", pressure:0.55, status:"DISCIPLINED" } },
      // the advance — spears couched, leaned into the beach, chariots leading a wedge
      advancing: { preview:{ formation:"chariot-wedge", pressure:0.95, status:"ADVANCING" } },
      // moving inland-to-shore as a tight marching column
      column:    { preview:{ formation:"column", pressure:0.4, perRow:[9,9,9,9], status:"MARCHING" } },
    },
    edges:[
      ["mustering","formed"],["formed","advancing"],
      ["advancing","formed"],["mustering","column"],["column","formed"],
    ],
  },
  channels:["pressure","formation","density","chariots","advance"],

  // neutral preview = ranks dressed and formed, disciplined pressure building
  preview:()=>({ formation:"ranked-line", pressure:0.55, status:"DISCIPLINED", progress:0.45 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
