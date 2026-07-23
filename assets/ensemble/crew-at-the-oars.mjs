/* ensemble.crew-at-the-oars — the wax-deaf rowing bank of the Sirens passage.
   ENSEMBLE asset. A galley bank built from ONE separable member template
   (drawRower: a seated oarsman hauling a single oar over the side) instanced
   along a ROWING-BANK formation — a near bench of large rowers plus a smaller
   far bench for depth. Unlike a straining crew, this bank is DEAF and CALM:
   every rower shares ONE cadence phase (perfect unison on the stroke), every
   ear is stoppered with a plug of WAX, every face is level and impassive. They
   ignore their commander's release signal — a blue RELEASE beacon flags at the
   stern with dashed signal-rays fanning across the bank, and not one head turns
   (attention holds at 0). Two channels carry the idea: CADENCE (the shared
   stroke phase catch->drive->finish->recovery) and WAX (how stopped/blank the
   ears + faces read); ATTENTION stays low so the release is ignored.
   Drawn in SOLID grays + hard contour into the offscreen ctx; the engine
   dotify POST pass supplies the halftone. No named character is baked in.
   Atlas OD-B12-S03 — wax-deaf rowers maintaining cadence while ignoring their
   commander's release signals. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const norm    = v => { const m=Math.hypot(v.x,v.y)||1; return { x:v.x/m, y:v.y/m }; };
const TAU = Math.PI*2;

const params = {
  formation:"rowing-bank",  // rowing-bank | tight-bank
  nearCount:5,              // rowers on the near bench (large, foreground)
  farCount:4,               // rowers on the far bench (small, behind the gunwale)
  cadence:0.30,             // SHARED stroke phase 0..1 (catch->drive->finish->recovery)
  wax:1.0,                  // ear-wax stopper + blank-face factor (0 open .. 1 stopped)
  attention:0.0,            // heads turned to the release signal (0 deaf .. 1 turned)
  effort:0.6,               // amplitude of the stroke lean (0 slack .. 1 full swing)
  oarSide:1,                // sea side the oars reach (+1 right, -1 left)
  showSignal:true,          // the ignored blue RELEASE beacon + signal-rays
  showHull:true,            // the galley hull + gunwale rail
  waterY:0.66,              // waterline as fraction of H
};

/* gunwale sheer: the seat/pivot line along the hull vs normalized station t
   (0 stern .. 1 prow). Dips amidships, lifts at the ends. Returns y-fraction. */
function sheer(t){ return 0.480 + Math.sin(clamp01(t)*Math.PI)*0.045 - (clamp01(t)-0.5)*0.10; }

/* two-segment arm shoulder->elbow->wrist toward a target; elbow bows outward. */
function armTo(pen, sh, wr, tone, w, bow){
  const g = pen.ctx;
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x:mx + (bow||0), y:my + Math.abs(wr.x-sh.x)*0.05 + w*0.4 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(wr.x,wr.y); }, tone, w*0.86);
  return { el, wr };
}

/* ============================================================
   ONE member template — a rower at his bench, in profile, facing the sea.
   m: { cx, gun, s, face(+1 sea side), drive(-1 catch..+1 finish), amp,
        wax, headTurn, sh{tunic,skin,hair}, feat }
   The whole bank is fed the SAME drive/amp so it reads as one cadence.
   ============================================================ */
function drawRower(pen, m){
  const g = pen.ctx, s = m.s, F = m.face;
  const tunic = toneSolid(inkLevel(m.sh.tunic));
  const skin  = toneSolid(inkLevel(m.sh.skin));
  const hair  = toneSolid(inkLevel(m.sh.hair));
  const oarT  = toneSolid(inkLevel(4));
  const lw    = Math.max(2, s*0.03);

  const dN = (m.drive+1)/2;                 // 0 catch .. 1 finish
  // waist sits just below the gunwale so the foreground rail covers the hips
  const waist = { x:m.cx, y:m.gun + s*0.06 };
  const hipHalf = s*0.14, shoHalf = s*0.165;
  const torsoLen = s*0.42;

  // lean: torso pitches FORWARD to the sea at the catch, ROCKS BACK at the
  // finish. One shared value across the bank => the unison read.
  const a = F * lerp(0.30, -0.34, dN) * (0.55 + 0.45*m.amp);
  const sho = { x: waist.x + Math.sin(a)*torsoLen, y: waist.y - Math.cos(a)*torsoLen };
  const shoHalfE = shoHalf*(1-0.12*Math.abs(Math.sin(a)));

  const headR = s*0.125*m.feat.headS;
  const headBase = { x: sho.x + Math.sin(a)*headR*0.5, y: sho.y - headR*0.95 };
  // attention: a level head that only turns toward the signal if attention>0.
  const head = { x: headBase.x - F*m.headTurn*headR*0.6, y: headBase.y };

  const shN = { x: sho.x + F*shoHalfE*0.85, y: sho.y + s*0.01 };  // near (sea-side) shoulder
  const shF = { x: sho.x - F*shoHalfE*0.85, y: sho.y + s*0.01 };  // far shoulder
  const armW = Math.max(3, s*0.058);

  // ---- OAR : handle (hands, inboard) -> pivot (tholepin) -> blade (outboard) ----
  // hands reach out over the sea at the catch, draw back to the lap at the finish
  const handle = {
    x: sho.x + F*lerp(s*0.30, s*0.05, dN),
    y: sho.y + lerp(s*0.02, s*0.20, dN),
  };
  const pivot = { x: m.cx + F*s*0.33, y: m.gun + s*0.02 };
  // blade buried deep at the catch, feathered up at the finish
  const bdir  = norm({ x:F*1.0, y: lerp(0.78, 0.34, dN) });
  const bn    = { x:-bdir.y, y:bdir.x };
  const bladeLen = s*0.80;
  const blade = { x: pivot.x + bdir.x*bladeLen, y: pivot.y + bdir.y*bladeLen };

  // loom (hands->tholepin) + shaft (tholepin->water), behind the body
  pen.limb(()=>{ g.moveTo(handle.x,handle.y); g.lineTo(pivot.x,pivot.y); }, oarT, Math.max(3,s*0.05));
  pen.limb(()=>{ g.moveTo(pivot.x,pivot.y); g.lineTo(blade.x,blade.y); }, oarT, Math.max(3,s*0.055));
  pen.paint(()=>{
    g.moveTo(blade.x - bdir.x*s*0.04 + bn.x*s*0.055, blade.y - bdir.y*s*0.04 + bn.y*s*0.055);
    g.lineTo(blade.x + bdir.x*s*0.17 + bn.x*s*0.078, blade.y + bdir.y*s*0.17 + bn.y*s*0.078);
    g.lineTo(blade.x + bdir.x*s*0.17 - bn.x*s*0.078, blade.y + bdir.y*s*0.17 - bn.y*s*0.078);
    g.lineTo(blade.x - bdir.x*s*0.04 - bn.x*s*0.055, blade.y - bdir.y*s*0.04 - bn.y*s*0.055);
    g.closePath();
  }, toneSolid(inkLevel(6)), lw*0.8);

  // ---- FAR arm (behind the torso), reaching to the handle ----
  armTo(pen, shF, handle, skin, armW*0.9, F*s*0.03);

  // ---- TORSO : rower's tunic, sheared by the lean ----
  pen.paint(()=>{
    g.moveTo(waist.x - hipHalf, waist.y);
    g.lineTo(waist.x + hipHalf, waist.y);
    g.lineTo(sho.x + shoHalfE,  sho.y);
    g.lineTo(sho.x - shoHalfE,  sho.y);
    g.closePath();
  }, tunic, lw);
  // a shoulder-seam stripe across the back
  pen.seam(()=>{ g.moveTo(sho.x - F*shoHalfE*0.6, sho.y+s*0.02); g.lineTo(waist.x + F*hipHalf*0.4, waist.y-s*0.02); }, Math.max(2,s*0.016));

  // ---- neck ----
  pen.paint(()=>{ g.rect(head.x-headR*0.28, sho.y-headR*0.5, headR*0.56, headR*0.8); }, skin, Math.max(2,s*0.018));

  // ---- HEAD ----
  const bald = m.feat.hair==="bald";
  if (!bald) pen.paint(()=>{ g.ellipse(head.x, head.y+headR*0.10, headR*1.12, headR*1.18, 0,0,7); }, hair, Math.max(2,s*0.024));
  pen.paint(()=>{ g.ellipse(head.x, head.y, headR*0.94, headR, 0,0,7); }, skin, Math.max(2,s*0.026));

  // ---- FACE : level, impassive. Wax deadens it toward a blank mask. ----
  const eyeY = head.y - headR*0.02;
  const eN = head.x + F*headR*0.34;
  // half-lidded eye — a short flat line, drooping further as wax rises
  g.strokeStyle=INK; g.lineWidth=Math.max(2,headR*0.16); g.lineCap="round";
  g.beginPath(); g.moveTo(eN - F*headR*0.20, eyeY); g.lineTo(eN + F*headR*0.16, eyeY + headR*0.05*m.wax); g.stroke();
  // level brow (no alarm)
  g.lineWidth=Math.max(2,headR*0.13);
  g.beginPath(); g.moveTo(eN - F*headR*0.26, eyeY-headR*0.30); g.lineTo(eN + F*headR*0.20, eyeY-headR*0.30); g.stroke();
  // nose (profile bias toward the sea)
  g.lineWidth=Math.max(2,headR*0.12);
  g.beginPath(); g.moveTo(head.x + F*headR*0.55, eyeY+headR*0.12); g.lineTo(head.x + F*headR*0.68, eyeY+headR*0.42); g.stroke();
  // straight, closed mouth — no cry, no word heard
  g.lineWidth=Math.max(2,headR*0.12);
  g.beginPath(); g.moveTo(head.x + F*headR*0.12, head.y+headR*0.52); g.lineTo(head.x + F*headR*0.50, head.y+headR*0.52); g.stroke();
  // beard
  if (m.feat.beard) pen.paint(()=>{
    g.moveTo(head.x - F*headR*0.1, head.y+headR*0.3);
    g.quadraticCurveTo(head.x + F*headR*0.5, head.y+headR*1.25, head.x + F*headR*0.68, head.y+headR*0.3);
    g.quadraticCurveTo(head.x + F*headR*0.4, head.y+headR*0.6, head.x - F*headR*0.1, head.y+headR*0.3);
  }, hair, Math.max(2,s*0.016));
  // hair front cap
  if (!bald) pen.paint(()=>{
    g.moveTo(head.x-headR*0.9, head.y-headR*0.02);
    g.quadraticCurveTo(head.x, head.y-headR*1.28, head.x+headR*0.9, head.y-headR*0.02);
    g.quadraticCurveTo(head.x+headR*0.45, head.y-headR*0.5, head.x, head.y-headR*0.42);
    g.quadraticCurveTo(head.x-headR*0.45, head.y-headR*0.5, head.x-headR*0.9, head.y-headR*0.02);
  }, hair, Math.max(2,s*0.018));

  // ---- the WAX PLUG in the (stern-side, viewer-near) ear ----
  if (m.wax > 0.02){
    const ex = head.x - F*headR*0.62, ey = head.y + headR*0.12;
    const er = headR*(0.20 + 0.10*m.wax);
    // ear shell
    pen.paint(()=>{ g.ellipse(ex, ey, er*0.9, er*1.05, 0,0,7); }, skin, Math.max(2,headR*0.10));
    // pale beeswax stopper (near paper), unmistakably plugging the ear
    pen.paint(()=>{ g.arc(ex, ey, er*0.62, 0,7); }, toneSolid(inkLevel(1)), Math.max(2,headR*0.10));
    // a couple of coil marks in the wax
    pen.seam(()=>{ g.arc(ex, ey, er*0.34, 0,7); }, Math.max(1.5,headR*0.06));
  }

  // ---- NEAR arm on top, gripping the handle ----
  armTo(pen, shN, handle, skin, armW, F*s*0.04);
  pen.paint(()=>{ g.arc(handle.x, handle.y, headR*0.24, 0,7); }, skin, lw*0.7);   // fists on the loom

  return { head, headR, blade };
}

/* the sea plane the oars dip into (light, so hull + crew read against it) */
function drawSea(pen, W, H, waterY){
  const g = pen.ctx;
  const wy = waterY*H;
  g.fillStyle = inkLevel(2); g.fillRect(0, wy, W, H-wy);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.16;
  for (let k=0;k<=4;k++){ const y=wy + (H-wy)*(k/5)+ (H-wy)*0.05;
    g.beginPath();
    for (let x=0;x<=W;x+=W*0.05) (x===0?g.moveTo:g.lineTo).call(g, x, y + Math.sin(x/W*10 + k)*H*0.006);
    g.stroke();
  }
  g.globalAlpha=1;
}

/* the galley hull (drawn behind the crew) */
function drawHullBack(pen, W, H){
  const g = pen.ctx;
  const x0=W*0.05, x1=W*0.99, bottom=H*0.80;
  pen.paint(()=>{
    g.moveTo(x0, sheer(x0/W)*H);
    for (let x=x0; x<=x1; x+=W*0.02) g.lineTo(x, sheer(x/W)*H);
    g.lineTo(x1, sheer(x1/W)*H);
    for (let x=x1; x>=x0; x-=W*0.02) g.lineTo(x, bottom - Math.sin(x/W*Math.PI)*H*0.02);
    g.closePath();
  }, toneSolid(inkLevel(4)), 5);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.35;
  for (let k=1;k<=3;k++){
    g.beginPath();
    for (let x=x0; x<=x1; x+=W*0.03){ const y=lerp(sheer(x/W)*H, bottom, k/4); (x===x0?g.moveTo:g.lineTo).call(g,x,y); }
    g.stroke();
  }
  g.globalAlpha=1;
  // dark waterline strake
  pen.paint(()=>{
    for (let x=x0; x<=x1; x+=W*0.02) (x===x0?g.moveTo:g.lineTo).call(g, x, bottom - Math.sin(x/W*Math.PI)*H*0.02);
    for (let x=x1; x>=x0; x-=W*0.02) g.lineTo(x, bottom - Math.sin(x/W*Math.PI)*H*0.02 + H*0.028);
    g.closePath();
  }, toneSolid(inkLevel(6)), 3);
  // prow sweeping up at the sea end (right)
  pen.paint(()=>{
    const px=x1, py=sheer(1)*H;
    g.moveTo(px-W*0.03, py+H*0.02);
    g.quadraticCurveTo(px+W*0.04, py-H*0.12, px+W*0.005, py-H*0.19);
    g.quadraticCurveTo(px-W*0.02, py-H*0.08, px-W*0.08, py+H*0.02);
    g.closePath();
  }, toneSolid(inkLevel(6)), 4);
}

/* foreground gunwale rail with shield discs, over the rowers' hips */
function drawGunwaleRail(pen, W, H){
  const g = pen.ctx;
  const x0=W*0.06, x1=W*0.96;
  pen.paint(()=>{
    g.moveTo(x0, sheer(x0/W)*H + H*0.02);
    for (let x=x0; x<=x1; x+=W*0.02) g.lineTo(x, sheer(x/W)*H + H*0.02);
    for (let x=x1; x>=x0; x-=W*0.02) g.lineTo(x, sheer(x/W)*H + H*0.075);
    g.closePath();
  }, toneSolid(inkLevel(4)), 4);
  const n=9;
  for (let i=0;i<n;i++){
    const t=(i+0.5)/n, x=lerp(x0+W*0.02, x1-W*0.02, t), y=sheer(x/W)*H + H*0.047;
    pen.paint(()=>{ g.arc(x, y, W*0.026, 0,7); }, toneSolid(inkLevel(i%2?5:3)), 3);
    pen.seam(()=>{ g.arc(x, y, W*0.026*0.5, 0,7); }, 2);
  }
}

/* ============================================================
   THE IGNORED RELEASE SIGNAL — a blue beacon flag at the stern end with
   dashed signal-rays fanning across the bank. It is the one thing the crew
   should answer and do not: the rays cross every rower but no head turns.
   ============================================================ */
function drawSignal(pen, W, H, F, members){
  const g = pen.ctx;
  // beacon on the stern side (opposite the sea/oar side)
  const bx = F>0 ? W*0.085 : W*0.915;
  const topY = H*0.14, baseY = sheer(bx/W)*H;
  // staff
  g.strokeStyle=ACCENT; g.lineWidth=Math.max(3,W*0.008); g.lineCap="round";
  g.beginPath(); g.moveTo(bx, topY); g.lineTo(bx, baseY); g.stroke();
  // triangular flag
  g.fillStyle=ACCENT;
  g.beginPath();
  g.moveTo(bx, topY);
  g.lineTo(bx + F*W*0.075, topY + H*0.028);
  g.lineTo(bx, topY + H*0.056);
  g.closePath(); g.fill();
  // dashed signal-rays fanning to the rowers (unheeded)
  g.strokeStyle=ACCENT; g.globalAlpha=0.32; g.lineWidth=Math.max(2,W*0.005);
  g.setLineDash([W*0.014, W*0.020]);
  const src = { x:bx, y:topY + H*0.03 };
  const tgt = members.filter(m=>m.depth>=0.5);
  for (const m of tgt){
    g.beginPath(); g.moveTo(src.x, src.y); g.lineTo(m.cx, m.gun - m.s*0.60); g.stroke();
  }
  g.setLineDash([]); g.globalAlpha=1;
}

/* ============================================================
   build the bank : two benches of the member template, ALL on one cadence. */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const F = p.oarSide>=0 ? 1 : -1;
  const cad = clamp01(p.cadence);
  const wax = clamp01(p.wax);
  const attention = clamp01(p.attention);
  const amp = clamp01(p.effort);
  const tight = (p.formation==="tight-bank");

  // ONE shared stroke value for the whole crew -> perfect unison cadence.
  // drive = cos(2π·phase): -1 catch (reach) .. +1 finish (lean back).
  const drive = -Math.cos(cad*TAU);

  const members = [];
  const benchDefs = tight ? [
    { count: Math.max(1,p.nearCount|0), depth:1.0, s:250, dy: 0.010, x0:0.20, x1:0.82, lvl:{tunic:3,skin:2,hair:5} },
    { count: Math.max(0,p.farCount|0),  depth:0.0, s:158, dy:-0.055, x0:0.28, x1:0.74, lvl:{tunic:4,skin:3,hair:6} },
  ] : [
    { count: Math.max(0,p.farCount|0),  depth:0.0, s:158, dy:-0.055, x0:0.24, x1:0.80, lvl:{tunic:4,skin:3,hair:6} },
    { count: Math.max(1,p.nearCount|0), depth:1.0, s:250, dy: 0.010, x0:0.16, x1:0.86, lvl:{tunic:3,skin:2,hair:5} },
  ];

  for (const B of benchDefs){
    const n=B.count; if (!n) continue;
    for (let i=0;i<n;i++){
      const t = n>1 ? i/(n-1) : 0.5;
      const xFrac = lerp(B.x0, B.x1, t);
      const rng = rnd((B.depth>0?911:409) + i*137 + 17);
      const feat = { beard: rng()<0.55, hair: rng()<0.12?"bald":"full", headS:0.92+rng()*0.18 };
      const gun = sheer(xFrac)*H + B.dy*H;
      members.push({
        cx: xFrac*W, gun, s:B.s, depth:B.depth, face:F,
        drive, amp, wax, headTurn: attention*(0.4+0.6*rng()),
        feat, sh:{ tunic:B.lvl.tunic + (i%2?1:0), skin:B.lvl.skin, hair:B.lvl.hair },
      });
    }
  }
  members.sort((a,b)=> a.depth-b.depth || a.cx-b.cx);
  return { members, F, waterY:p.waterY, showSignal:p.showSignal, showHull:p.showHull, cadence:cad };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const B = buildMembers(W, H, st);

  drawSea(pen, W, H, B.waterY);
  if (B.showHull) drawHullBack(pen, W, H);

  const far  = B.members.filter(m=>m.depth<0.5);
  const near = B.members.filter(m=>m.depth>=0.5);
  far.forEach(m=>drawRower(pen, m));
  if (B.showHull) drawGunwaleRail(pen, W, H);   // rail rides between the two benches
  near.forEach(m=>drawRower(pen, m));

  if (B.showSignal) drawSignal(pen, W, H, B.F, B.members);

  // a faint CADENCE beat-rule across the bank — every oar on the same count
  const g=ctx;
  g.strokeStyle=INK; g.globalAlpha=0.14; g.lineWidth=Math.max(2,W*0.004);
  g.setLineDash([W*0.006, W*0.03]);
  const by = H*0.40 + Math.sin(B.cadence*TAU)*H*0.01;
  g.beginPath(); g.moveTo(W*0.10, by); g.lineTo(W*0.90, by); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
}

export const asset = {
  id:"ensemble.crew-at-the-oars",
  type:"ENSEMBLE",
  name:"Crew at the oars",
  statusWord:"WAX-DEAF",
  scene:"OD-B12-S03",

  params,
  // ONE rower member template, instanced across two benches on ONE cadence
  member:{ template:"rower", channels:["cadence","wax"], formations:["rowing-bank","tight-bank"] },
  // back -> front draw order
  layers:["sea","hull","far-bench","gunwale-rail","near-bench","signal","cadence-rule"],
  // normalized 0..1 placement / rig / camera anchors (NOT baked characters)
  anchors:{
    "bench:near":{x:.50,y:.62}, "bench:far":{x:.50,y:.56},
    "prow:sea":{x:.90,y:.52}, "stern":{x:.10,y:.62},
    "oar:pivot":{x:.68,y:.60}, "waterline":{x:.50,y:.74},
    "signal:beacon":{x:.085,y:.14}, "ear:wax":{x:.50,y:.50},
    "camera:wide":{x:.50,y:.50}, "camera:bank":{x:.55,y:.56},
  },
  zones:{ deck:{ x0:.10,y0:.50,x1:.90,y1:.68 }, sea:{ x0:.00,y0:.74,x1:1.0,y1:1.0 } },
  states:{
    initial:"deaf-cadence",
    nodes:{
      // the whole bank mid-drive, ears stopped, ignoring the flagged release
      "deaf-cadence":{ preview:{ cadence:0.30, wax:1.0, attention:0.0, effort:0.6, showSignal:true } },
      // the catch — every oar reaching forward together, blades biting
      "catch":       { preview:{ cadence:0.0,  wax:1.0, attention:0.0, effort:0.7, showSignal:false } },
      // the finish — every torso rocked back together at the end of the pull
      "finish":      { preview:{ cadence:0.5,  wax:1.0, attention:0.0, effort:0.7, showSignal:false } },
      // the release ignored — signal flagging hard, not one head turns
      "ignoring-signal":{ preview:{ cadence:0.35, wax:1.0, attention:0.0, effort:0.55, showSignal:true } },
    },
    edges:[
      ["deaf-cadence","catch"],["catch","finish"],["finish","deaf-cadence"],
      ["deaf-cadence","ignoring-signal"],["ignoring-signal","deaf-cadence"],
    ],
  },
  channels:["cadence","wax","attention","effort","formation"],

  // neutral preview = the wax-deaf bank mid-stroke, release-flag ignored
  preview:()=>({ cadence:0.30, wax:1.0, attention:0.0, effort:0.6, formation:"rowing-bank",
                 showSignal:true, status:"WAX-DEAF", progress:0.30 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
