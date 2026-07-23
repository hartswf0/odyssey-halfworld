/* ensemble.nestor-and-pylian-host — the sacrificing multitude of Pylos.
   ENSEMBLE asset. Scene function (OD-B03-S01): King Nestor's royal family,
   his priests, his attendants, and the thousands of Pylian citizens all
   organized AROUND A SACRIFICE on the shore — bulls burning to Poseidon —
   as Telemachos and Mentor come up from the sea to the left.

   Built as a repeatable group from ONE separable member template
   (drawWorshipper) instanced N times deterministically, plus a background
   CITIZEN MASS band (the "thousands"), all painter-sorted around a central
   ALTAR set piece with flame + smoke. The altar is the organizing focus.

   Exposes: formation (arc | rows | cluster), density (perRow + citizen band),
   attention (0 = the host turns LEFT to greet the arriving guest .. 1 = all
   returned to the ALTAR at center), reaction-wave (ripple/lag of the turn
   across the crowd), and foreground/background depth controls. Drawn in SOLID
   grays + hard contour; the engine dotify pass supplies the halftone. The
   guest (Telemachos) is NOT baked in — a lower-left FOCUS pole marks where he
   lands; only the altar and the host are drawn. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const params = {
  formation:"arc",       // arc | rows | cluster
  rows:3,                // depth tiers of DETAILED worshippers (back..front)
  perRow:[11,9,7],       // members per tier (density)
  attention:0.7,         // 0 = host turned LEFT to the guest .. 1 = all on the ALTAR (center)
  wave:0.7,              // reaction-wave: how much the turn LAGS across the crowd
  citizens:0.9,          // background CITIZEN MASS density (the "thousands") 0..1
  background:true,       // draw the far citizen band
  showAltar:true,        // draw the central sacrificial altar (the focus)
  showGuestPole:true,    // draw the lower-left focus pole (the arriving guest)
  showSmoke:true,        // draw the sacrifice smoke plume
  seatY:0.70,            // front-row baseline as fraction of H
};

/* -------- ONE member template: a standing, robed Pylian --------
   Geometry keyed off `s` (member height). `headTurn` in -1..1 aims the
   face/gaze toward the current focus. `role` swaps in identity gear:
     priest  — both arms raised over the altar (orant pose)
     royal   — a tall staff/scepter (Nestor's line)
     attendant/citizen — plain draped figure.
   `feat` carries deterministic identity (beard, hair, scale). */
function drawWorshipper(pen, cx, baseY, s, shade, headTurn, feat, role){
  const g = pen.ctx;
  const robe = toneSolid(inkLevel(shade.robe));
  const skin = toneSolid(inkLevel(shade.skin));
  const dark = toneSolid(inkLevel(shade.hair));

  const shoulderY = baseY - s*0.80;
  const shoTop = s*0.115;              // shoulder half-width
  const hemW   = s*0.165;              // hem half-width (ground)
  const headR  = s*0.085*feat.headS;
  const headCy = shoulderY - headR*1.05;
  const hx = cx + headTurn*headR*0.30; // head slides toward the focus

  // raised priest arms (drawn behind the robe so the sleeves read as drape)
  if (role==="priest"){
    const dir = headTurn>=0 ? 1 : -1;  // raise toward the altar side
    pen.limb(()=>{ g.moveTo(cx-shoTop*0.6, shoulderY); g.lineTo(cx-shoTop*1.7-dir*s*0.05, shoulderY - s*0.42); }, skin, Math.max(3,s*0.055));
    pen.limb(()=>{ g.moveTo(cx+shoTop*0.6, shoulderY); g.lineTo(cx+shoTop*1.7-dir*s*0.05, shoulderY - s*0.42); }, skin, Math.max(3,s*0.055));
  }
  // royal staff
  if (role==="royal"){
    pen.ink(()=>{ g.moveTo(cx+hemW*0.95, baseY); g.lineTo(cx+hemW*0.95, shoulderY - s*0.34); }, Math.max(3,s*0.03));
    g.fillStyle=inkLevel(6); g.beginPath(); g.arc(cx+hemW*0.95, shoulderY-s*0.34, s*0.05, 0,7); g.fill();
  }

  // robe: tall trapezoid, shoulders -> ground
  pen.paint(()=>{
    g.moveTo(cx-shoTop, shoulderY);
    g.lineTo(cx+shoTop, shoulderY);
    g.lineTo(cx+hemW, baseY);
    g.lineTo(cx-hemW, baseY);
    g.closePath();
  }, robe, Math.max(2,s*0.03));
  // vertical drapery seams
  pen.seam(()=>{ g.moveTo(cx, shoulderY+s*0.02); g.lineTo(cx-headTurn*s*0.03, baseY); }, Math.max(1.5,s*0.018));
  pen.seam(()=>{ g.moveTo(cx-shoTop*0.45, shoulderY+s*0.05); g.lineTo(cx-hemW*0.55, baseY); }, Math.max(1.4,s*0.013));
  pen.seam(()=>{ g.moveTo(cx+shoTop*0.45, shoulderY+s*0.05); g.lineTo(cx+hemW*0.55, baseY); }, Math.max(1.4,s*0.013));

  // neck
  pen.paint(()=>{ g.rect(cx-headR*0.30, shoulderY-headR*0.45, headR*0.60, headR*0.75); }, skin, Math.max(1.5,s*0.015));

  // hair BACK mass
  if (feat.hair!=="bald")
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.14, headR*1.12, headR*1.20, 0,0,7); }, dark, Math.max(2,s*0.02));
  // head
  pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, Math.max(2,s*0.022));

  // face (eyes/brow/nose all offset by headTurn — the ATTENTION cue)
  const eyeY = headCy - headR*0.05;
  const gx   = headTurn*headR*0.30;
  const eyeR = headR*0.11;
  g.fillStyle=INK;
  const eL = hx - headR*0.32 + gx, eR = hx + headR*0.32 + gx;
  if (headTurn > -0.55){ g.beginPath(); g.ellipse(eR, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  if (headTurn <  0.55){ g.beginPath(); g.ellipse(eL, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  // brow
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,headR*0.16); g.lineCap="round";
  g.beginPath(); g.moveTo(hx-headR*0.46+gx, eyeY-headR*0.32); g.lineTo(hx+headR*0.46+gx, eyeY-headR*0.32); g.stroke();
  // nose (points the way the head faces)
  g.lineWidth=Math.max(1.5,headR*0.12);
  g.beginPath(); g.moveTo(hx+gx*0.6, eyeY+headR*0.05);
  g.lineTo(hx + headTurn*headR*0.42, eyeY+headR*0.42); g.stroke();

  // hair FRONT cap + optional beard
  if (feat.hair!=="bald")
    pen.paint(()=>{
      g.moveTo(hx-headR*0.92, headCy-headR*0.03);
      g.quadraticCurveTo(hx, headCy-headR*1.32, hx+headR*0.92, headCy-headR*0.03);
      g.quadraticCurveTo(hx, headCy-headR*0.5, hx-headR*0.92, headCy-headR*0.03);
    }, dark, Math.max(1.5,s*0.016));
  if (feat.beard)
    pen.paint(()=>{
      g.moveTo(hx-headR*0.55, headCy+headR*0.30);
      g.quadraticCurveTo(hx, headCy+headR*1.45, hx+headR*0.55, headCy+headR*0.30);
      g.quadraticCurveTo(hx, headCy+headR*0.72, hx-headR*0.55, headCy+headR*0.30);
    }, dark, Math.max(1.5,s*0.015));

  return { head:{x:hx,y:headCy}, r:headR };
}

/* -------- the central ALTAR: the focus the whole host organizes around ---- */
function drawAltar(pen, cx, baseY, s, showSmoke){
  const g = pen.ctx;
  // smoke plume behind the flame (light, rising) — drawn first so flame sits over it
  if (showSmoke){
    g.fillStyle=inkLevel(2);
    for (let i=0;i<5;i++){
      g.beginPath();
      g.ellipse(cx+Math.sin(i*1.25)*s*0.22, baseY-s*(1.55+i*0.5), s*(0.30+i*0.12), s*0.24, 0,0,7);
      g.fill();
    }
  }
  // stone block
  pen.paint(()=>{ g.rect(cx-s*0.52, baseY-s*0.72, s*1.04, s*0.72); }, toneSolid(inkLevel(4)), 5);
  pen.paint(()=>{ g.rect(cx-s*0.64, baseY-s*0.86, s*1.28, s*0.16); }, toneSolid(inkLevel(5)), 5); // top slab
  pen.paint(()=>{ g.rect(cx-s*0.64, baseY-s*0.14, s*1.28, s*0.16); }, toneSolid(inkLevel(5)), 5); // base
  // block face seams
  pen.seam(()=>{ g.moveTo(cx, baseY-s*0.70); g.lineTo(cx, baseY-s*0.02); }, 3);
  // flame on the slab (darkest)
  g.fillStyle=inkLevel(7);
  g.beginPath();
  g.moveTo(cx-s*0.24, baseY-s*0.86);
  g.quadraticCurveTo(cx-s*0.34, baseY-s*1.20, cx-s*0.06, baseY-s*1.34);
  g.quadraticCurveTo(cx-s*0.16, baseY-s*1.02, cx+s*0.02, baseY-s*1.50);
  g.quadraticCurveTo(cx+s*0.16, baseY-s*1.08, cx+s*0.30, baseY-s*1.30);
  g.quadraticCurveTo(cx+s*0.34, baseY-s*0.98, cx+s*0.24, baseY-s*0.86);
  g.closePath(); g.fill();
  // inner flame highlight (lighter tongue)
  g.fillStyle=inkLevel(4);
  g.beginPath();
  g.moveTo(cx-s*0.06, baseY-s*0.86);
  g.quadraticCurveTo(cx-s*0.10, baseY-s*1.06, cx+s*0.01, baseY-s*1.20);
  g.quadraticCurveTo(cx+s*0.10, baseY-s*1.04, cx+s*0.08, baseY-s*0.86);
  g.closePath(); g.fill();
}

/* -------- background CITIZEN MASS: the thousands, packed + receding -------- */
function drawCitizenMass(pen, W, H, density){
  const g = pen.ctx;
  const d = clamp01(density);
  const bandTop = H*0.26, bandBot = H*0.40;
  const bands = 3;
  for (let b=0;b<bands;b++){
    const depth = b/(bands-1);                    // 0 far/top .. 1 near/bottom of band
    const y = lerp(bandTop, bandBot, depth);
    const hr = lerp(H*0.009, H*0.016, depth);     // head radius grows toward front
    const tone = inkLevel(Math.round(lerp(2,3,depth)));
    const step = hr*2.0*lerp(1.35,1.0,d);         // denser when density high
    const jseed = rnd((b*911+37)>>>0);
    for (let x=W*0.06; x<W*0.94; x+=step){
      const jx = (jseed()-0.5)*step*0.5;
      const jy = (jseed()-0.5)*hr*0.7;
      const cx = x+jx, cy = y+jy;
      // shoulders
      g.fillStyle=tone;
      g.beginPath(); g.ellipse(cx, cy+hr*1.5, hr*1.7, hr*1.2, 0,0,7); g.fill();
      // head
      g.beginPath(); g.arc(cx, cy, hr, 0,7); g.fill();
      // thin contour so the mass keeps some structure
      g.strokeStyle=INK; g.lineWidth=1; g.stroke();
    }
  }
}

/* -------- the GUEST focus pole (lower-left): where Telemachos lands -------- */
function drawGuestPole(pen, cx, baseY, s, lit){
  const g = pen.ctx;
  // a mooring post / prow marker on the shore
  pen.paint(()=>{ g.rect(cx-s*0.16, baseY-s*1.0, s*0.32, s*1.0); }, toneSolid(inkLevel(lit?6:4)), 4);
  pen.paint(()=>{ g.rect(cx-s*0.30, baseY-s*1.0, s*0.60, s*0.12); }, toneSolid(inkLevel(6)), 4);
  // a small hull curve at the waterline
  pen.paint(()=>{
    g.moveTo(cx-s*0.7, baseY); g.quadraticCurveTo(cx, baseY+s*0.34, cx+s*0.7, baseY);
    g.lineTo(cx+s*0.5, baseY-s*0.16); g.lineTo(cx-s*0.5, baseY-s*0.16); g.closePath();
  }, toneSolid(inkLevel(5)), 4);
}

/* -------- build the member set deterministically from params + state ------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const attention = clamp01(p.attention);
  const wave = clamp01(p.wave);
  const rows = p.formation==="cluster" ? 3 : Math.max(1, p.rows|0);
  const perRow = p.perRow || [11,9,7];

  const altarPt = { x:W*0.50, y:H*(p.seatY-0.04) };   // center focus (the flame)
  const guestPt = { x:W*0.08, y:H*0.78 };             // lower-left focus (the guest)
  const gap = 0.10;                                    // half-width of the altar gap (front row)

  const members = [];
  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 0;             // 0 = back .. 1 = front
    const n = perRow[Math.min(r, perRow.length-1)] || (11-2*r);
    const scale = H*lerp(0.095, 0.155, depth);
    const rowY  = H*(0.44 + depth*(p.seatY-0.44));
    const marginX = lerp(0.115, 0.075, depth);
    const stagger = (r%2)*0.5;                          // nest front rows into back-row gaps
    for (let i=0;i<n;i++){
      const t = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
      const px = lerp(marginX, 1-marginX, clamp01(t));
      // front-most row leaves a gap in the center for the altar
      if (r===rows-1 && Math.abs(px-0.5) < gap) continue;

      let cx = W*px;
      let by = rowY;
      if (p.formation!=="rows"){
        // shallow arc: the wings dip forward, wrapping the altar
        by = rowY + Math.sin(clamp01(t)*Math.PI)*scale*0.10;
      }
      if (p.formation==="cluster"){
        cx += (rnd(r*97+i*13)()-0.5)*scale*0.6;
        by += (rnd(r*57+i*29)()-0.5)*scale*0.2;
      }

      // reaction-wave: the LEFT (guest) side leads the turn, the right lags
      const spread = wave*0.7;
      const localAtt = clamp01(attention*(1+spread) - (1-px)*spread);
      const focus = { x:lerp(guestPt.x, altarPt.x, localAtt), y:lerp(guestPt.y, altarPt.y, localAtt) };
      const headTurn = clamp((focus.x - cx)/(scale*1.25), -1, 1);

      // deterministic identity
      const rng = rnd((r*131+i*17+7)>>>0);
      const feat = {
        beard: rng()<0.55,
        hair:  rng()<0.12 ? "bald" : "full",
        headS: 0.9 + rng()*0.22,
      };
      const shade = {
        robe: Math.round(lerp(2, 3, depth)) + (i%2),
        skin: Math.round(lerp(1, 2, depth)),
        hair: Math.round(lerp(4, 6, depth)),
      };
      members.push({ cx, baseY:by, s:scale, shade, feat, headTurn, focus, depth, px, r, role:"attendant" });
    }
  }

  // assign special foreground roles among the FRONT row
  const front = members.filter(m => m.r===rows-1).sort((a,b)=>a.cx-b.cx);
  if (front.length){
    front[0].role = "royal";                                   // Nestor at the near left
    const leftPriest  = front.filter(m=>m.px<0.5).pop();       // just left of the altar gap
    const rightPriest = front.filter(m=>m.px>0.5)[0];          // just right of the altar gap
    if (leftPriest)  leftPriest.role  = "priest";
    if (rightPriest) rightPriest.role = "priest";
  }

  // painter order: back (small baseY) -> front (large baseY)
  members.sort((a,b)=> a.baseY-b.baseY);
  return { members, altarPt, guestPt, attention,
           showAltar:p.showAltar, showGuestPole:p.showGuestPole, showSmoke:p.showSmoke,
           background:p.background, citizens:p.citizens };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  // background CITIZEN MASS (the thousands) — furthest back
  if (B.background) drawCitizenMass(pen, W, H, B.citizens);

  // curved ground / shore tiers under the host (light — reads as sand + ranks)
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.24;
  for (let k=1;k<=3;k++){
    const y = H*(0.48 + k*0.08);
    g.beginPath();
    for (let x=0;x<=W;x+=8){ const t=x/W; const yy=y+Math.sin(t*Math.PI)*18; x===0?g.moveTo(x,yy):g.lineTo(x,yy); }
    g.stroke();
  }
  g.globalAlpha=1;

  // the host, painter-sorted back -> front, with the altar dropped in by depth
  const altarBaseY = H*(params.seatY + 0.02);
  const altarS = W*0.115;
  let altarDrawn = false;
  const heads = [];
  for (const m of B.members){
    if (B.showAltar && !altarDrawn && m.baseY >= altarBaseY){
      drawAltar(pen, B.altarPt.x, altarBaseY, altarS, B.showSmoke);
      altarDrawn = true;
    }
    heads.push(drawWorshipper(pen, m.cx, m.baseY, m.s, m.shade, m.headTurn, m.feat, m.role));
  }
  if (B.showAltar && !altarDrawn) drawAltar(pen, B.altarPt.x, altarBaseY, altarS, B.showSmoke);

  // the lower-left GUEST pole (lit as the host turns to it)
  if (B.showGuestPole) drawGuestPole(pen, B.guestPt.x, B.guestPt.y, W*0.055, B.attention<0.5);
}

export const asset = {
  id:"ensemble.nestor-and-pylian-host",
  type:"ENSEMBLE",
  name:"Nestor and Pylian host",
  statusWord:"REVERENT",
  scene:"OD-B03-S01",

  params,
  // back -> front draw order the ensemble honors
  layers:["citizen-mass","ground","back-row","altar","mid-row","front-row","royal","priests","guest-pole"],
  // normalized 0..1 anchors: the sacrificial focus, the guest pole, placement handles
  anchors:{
    "focus:altar":{x:.50,y:.70},   "focus:guest":{x:.08,y:.78},
    "royal:nestor":{x:.14,y:.74},  "priest:left":{x:.40,y:.74},
    "priest:right":{x:.60,y:.74},  "row:back":{x:.50,y:.46},
    "row:front":{x:.50,y:.74},     "citizens":{x:.50,y:.37},
    "center":{x:.50,y:.58},        "camera:wide":{x:.50,y:.52},
  },
  zones:{
    host:{ x0:.05,y0:.42,x1:.95,y1:.82 },
    altar:{ x0:.40,y0:.56,x1:.60,y1:.74 },
    citizens:{ x0:.05,y0:.26,x1:.95,y1:.46 },
    shore:{ x0:.02,y0:.70,x1:.18,y1:.86 },
  },
  states:{
    initial:"at-sacrifice",
    nodes:{
      // the whole host rapt on the altar, mid-rite
      "at-sacrifice":  { preview:{ attention:1.0, wave:0.2, status:"REVERENT" } },
      // the ripple of the turn as the crowd notices the guest on the shore
      "noticing":      { preview:{ attention:0.5, wave:0.95, status:"NOTICING" } },
      // the host fully turned LEFT to greet the arriving stranger
      "greeting":      { preview:{ attention:0.0, wave:0.25, status:"WELCOMING" } },
      // the multitude loosened into a milling cluster around the fire
      "feasting":      { preview:{ attention:0.8, wave:0.5, formation:"cluster", status:"FEASTING" } },
    },
    edges:[
      ["at-sacrifice","noticing"],["noticing","greeting"],
      ["greeting","at-sacrifice"],["at-sacrifice","feasting"],
      ["feasting","noticing"],
    ],
  },
  channels:["attention","wave","density","formation","depth"],

  // neutral preview = rite in progress, a first ripple of notice at the left wing
  preview:()=>({ attention:0.7, wave:0.7, formation:"arc", status:"REVERENT", progress:0.4 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
