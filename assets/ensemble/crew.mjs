/* ensemble.crew — mourner-sailors at a comrade's funeral rites.
   ENSEMBLE asset. A repeatable group built from ONE separable member template
   (drawMourner — a bowed sailor + a task rig) instanced N times across depth
   bands around a shared FOCAL object. The scene (OD-B12-S01) runs the whole
   sequence of burial rites, so the crew is driven by a FORMATION channel that
   reshapes the same roster into each beat:
       wood   — gathering wood, cradling branch-bundles toward a growing pile
       carry  — bearing the shrouded body on a two-pole bier
       pyre   — tending the burning pyre (body on the pile, flames + sparks)
       mound  — heaping earth from baskets into a burial mound
       plant  — the finished mound with a grave-marker driven in; heads bowed
   A SOLEMN attention channel bows every head and slumps the shoulders toward
   the focal (0 upright/at-work .. 1 deep grief). Drawn in SOLID grays + hard
   contour into the offscreen ctx; the engine dotify POST pass supplies the
   halftone. Do NOT bake named characters in — each member is an addressable,
   identical-template mourner. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const FORMATIONS = ["wood","carry","pyre","mound","plant"];

/* ---- the mourning roster: the SAME member template ringed in a solemn
   semicircle facing the focal. Depth bands: near members are large + low +
   dark, far members small + high + light. left members face right (+1) toward
   centre, right members face left (-1). `slot` names the standing position;
   the per-formation task map (TASKS) assigns what each is doing. */
const ROSTER = [
  { slot:"far-left",   nx:0.235, footY:0.590, s:150, lvl:3, face: 1, band:0 },
  { slot:"far-right",  nx:0.765, footY:0.590, s:150, lvl:3, face:-1, band:0 },
  { slot:"mid-left",   nx:0.315, footY:0.735, s:205, lvl:4, face: 1, band:1 },
  { slot:"mid-right",  nx:0.685, footY:0.735, s:205, lvl:4, face:-1, band:1 },
  { slot:"near-left",  nx:0.170, footY:0.905, s:262, lvl:4, face: 1, band:2 },
  { slot:"near-right", nx:0.830, footY:0.905, s:262, lvl:5, face:-1, band:2 },
];

/* per-formation task assignment by slot. tasks:
   branch = cradle a wood bundle · reach = hands out to the shared object
   basket = carry / tip a basket of earth · mourn = hands clasped, bowed */
const TASKS = {
  wood:  { "far-left":"branch","far-right":"branch","mid-left":"branch","mid-right":"reach","near-left":"branch","near-right":"reach" },
  carry: { "far-left":"mourn","far-right":"mourn","mid-left":"reach","mid-right":"reach","near-left":"reach","near-right":"reach" },
  pyre:  { "far-left":"mourn","far-right":"mourn","mid-left":"reach","mid-right":"mourn","near-left":"mourn","near-right":"branch" },
  mound: { "far-left":"basket","far-right":"mourn","mid-left":"basket","mid-right":"reach","near-left":"basket","near-right":"mourn" },
  plant: { "far-left":"mourn","far-right":"mourn","mid-left":"mourn","mid-right":"reach","near-left":"mourn","near-right":"mourn" },
};

const params = {
  count: ROSTER.length,
  formation:"plant",       // which rite beat (see FORMATIONS)
  solemn:0.85,             // 0 upright/at-work .. 1 bowed in grief
  fire:0.0,                // pyre flame intensity (auto 1 in "pyre")
  spread:1.0,              // formation width multiplier about the axis
  floorLevel:0.80,         // the working ground as a fraction of H
  focus:{ x:0.5, y:0.72 }, // the shared focal (pile / bier / mound / marker)
};

/* ============================================================
   FOCAL OBJECTS — the shared thing the rite is organised around.
   Each returns nothing; drawn in solid grays at the focus point.
   ============================================================ */
function drawWoodpile(pen,g,W,H,fx,fy,scale){
  const w=W*0.20*scale, rows=4;
  for(let r=0;r<rows;r++){
    const ry = fy - r*H*0.036;
    const rw = w*(1 - r*0.16);
    const logs = 5-r;
    for(let i=0;i<logs;i++){
      const lx = fx - rw/2 + rw*((i+0.5)/logs);
      pen.paint(()=>{ g.ellipse(lx, ry, rw/logs*0.62, H*0.020, 0,0,7); }, toneSolid(inkLevel(4+ (i+r)%2)), 4);
      pen.seam(()=>{ g.moveTo(lx-rw/logs*0.3, ry); g.lineTo(lx+rw/logs*0.3, ry); }, 2);
    }
  }
}
function drawShroudBody(pen,g,W,H,cx,cy,len){
  // a wrapped body: a long rounded lump with binding seams
  pen.paint(()=>{ g.ellipse(cx, cy, len*0.5, H*0.034, 0,0,7); }, toneSolid(inkLevel(3)), 5);
  g.strokeStyle=INK; g.lineWidth=Math.max(2,W*0.004); g.globalAlpha=0.7;
  for(let k=-2;k<=2;k++){ g.beginPath(); g.moveTo(cx+k*len*0.16, cy-H*0.030); g.lineTo(cx+k*len*0.16, cy+H*0.030); g.stroke(); }
  g.globalAlpha=1;
  // the crown of the head end (slightly raised)
  pen.paint(()=>{ g.ellipse(cx-len*0.42, cy-H*0.006, len*0.10, H*0.024, 0,0,7); }, toneSolid(inkLevel(2)), 4);
}
function drawBier(pen,g,W,H,fx,fy){
  const len=W*0.34;
  // two carrying poles running under the body
  for(const dy of [-H*0.026, H*0.030]){
    pen.paint(()=>{ g.rect(fx-len/2, fy+dy, len, H*0.014); }, toneSolid(inkLevel(5)), 4);
  }
  drawShroudBody(pen,g,W,H,fx,fy-H*0.006,len*0.86);
}
function drawMound(pen,g,W,H,fx,floorY,{marker,partial}){
  const rx=W*0.22, ry=H*0.115*(partial?0.62:1);
  const top=floorY-ry;
  // the earth mound (half dome)
  pen.paint(()=>{
    g.moveTo(fx-rx, floorY);
    g.bezierCurveTo(fx-rx*0.5, top, fx+rx*0.5, top, fx+rx, floorY);
    g.closePath();
  }, toneSolid(inkLevel(5)), 5);
  // clods / heaped-earth texture as small arcs
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,W*0.003); g.globalAlpha=0.5;
  const R=rnd(4021);
  for(let i=0;i<22;i++){
    const u=(i/22)*Math.PI, ex=fx+Math.cos(u)*rx*0.86*(0.4+R()*0.6), ey=floorY-Math.sin(u)*ry*(0.3+R()*0.6);
    g.beginPath(); g.arc(ex,ey, W*0.010*(0.6+R()*0.7), Math.PI*0.1, Math.PI*0.95); g.stroke();
  }
  g.globalAlpha=1;
  if(marker){
    // a planted OAR as the grave-marker (Elpenor's oar upon the mound)
    const mx=fx, mh=H*0.22, mtop=top-mh;
    pen.paint(()=>{ g.rect(mx-W*0.013, mtop+H*0.04, W*0.026, mh+ry*0.5-H*0.04); }, toneSolid(inkLevel(6)), 4); // shaft
    pen.paint(()=>{ g.ellipse(mx, mtop+H*0.028, W*0.030, H*0.050, 0,0,7); }, toneSolid(inkLevel(6)), 4);        // blade
    pen.seam(()=>{ g.moveTo(mx, mtop-H*0.012); g.lineTo(mx, mtop+H*0.07); }, 3);                                 // blade rib
  }
}
function drawFlames(pen,g,W,H,fx,fy,t,fire){
  if(fire<=0.02) return;
  const n=7;
  for(let i=0;i<n;i++){
    const u=(i-(n-1)/2)/n;
    const bx=fx+u*W*0.24;
    const flick=Math.sin(t*3.1 + i*1.7)*0.5+0.5;
    const fh=H*(0.06+0.10*fire)*(0.6+0.6*flick);
    const bw=W*0.026*(1-Math.abs(u)*0.4);
    pen.paint(()=>{
      g.moveTo(bx-bw, fy);
      g.quadraticCurveTo(bx-bw*0.4, fy-fh*0.6, bx, fy-fh);
      g.quadraticCurveTo(bx+bw*0.4, fy-fh*0.6, bx+bw, fy);
      g.closePath();
    }, toneSolid(inkLevel(2+ (i%2))), 3);
  }
  // rising sparks
  g.fillStyle=INK; g.globalAlpha=0.6;
  const R=rnd(77);
  for(let k=0;k<14;k++){
    const a=R(), rise=((t*0.3 + a)%1);
    const sx=fx+(R()-0.5)*W*0.28, sy=fy-rise*H*0.24;
    g.beginPath(); g.arc(sx,sy, W*0.004*(1-rise), 0,7); g.fill();
  }
  g.globalAlpha=1;
}

/* ============================================================
   MEMBER TEMPLATE — one bowed mourner-sailor.
   o = { cx, footY, s, lvl, face, task, solemn, focus:{x,y}, seed }
   Stands in a subdued contrapposto, shoulders slumped and head bowed toward
   the focal by `solemn`; arms are posed by `task` (cradle branches / reach to
   the shared object / carry a basket / clasp in grief).
   ============================================================ */
function drawMourner(pen,g,W,H,o){
  const s=o.s, cx=o.cx, footY=o.footY, F=o.face;
  const solemn=clamp01(o.solemn);
  const cloth=toneSolid(inkLevel(o.lvl));
  const limbT=toneSolid(inkLevel(Math.min(6,o.lvl+1)));
  const skin =toneSolid(inkLevel(2));
  const hair =toneSolid(inkLevel(6));
  const cw=Math.max(3,s*0.019);

  const hipY=footY - s*0.40;
  const bow = solemn * s*0.05;                 // trunk sinks toward the focal
  const lean= F * bow*1.4;
  const shoulderY=hipY - s*0.42*(1-0.06*solemn) + bow;
  const shoulderCx=cx + lean;
  const shoulderW=s*0.30;
  const hipW=s*0.24;
  const headR=s*0.125;

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.12)";
  g.beginPath(); g.ellipse(cx, footY+s*0.010, s*0.30, s*0.040, 0,0,7); g.fill();

  // ---- LEGS: quiet standing stance, feet slightly apart ----
  const hipL={x:cx-hipW*0.36,y:hipY}, hipR={x:cx+hipW*0.36,y:hipY};
  const footL=cx-s*0.12, footR=cx+s*0.13, kneeY=hipY+s*0.20;
  pen.limb(()=>{ g.moveTo(hipL.x,hipL.y); g.lineTo(footL,kneeY); g.lineTo(footL-s*0.01,footY); }, limbT, s*0.056);
  pen.limb(()=>{ g.moveTo(hipR.x,hipR.y); g.lineTo(footR,kneeY); g.lineTo(footR+s*0.01,footY); }, limbT, s*0.058);
  pen.paint(()=>{ g.ellipse(footL-s*0.02,footY,s*0.058,s*0.024,0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  pen.paint(()=>{ g.ellipse(footR+s*0.02,footY,s*0.060,s*0.025,0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);

  // ---- TORSO: tunic trapezoid, sheared by the bow ----
  pen.paint(()=>{
    g.moveTo(shoulderCx-shoulderW/2, shoulderY);
    g.lineTo(shoulderCx+shoulderW/2, shoulderY);
    g.lineTo(cx+hipW/2, hipY);
    g.lineTo(cx-hipW/2, hipY);
    g.closePath();
  }, cloth, cw);
  pen.seam(()=>{ g.moveTo(cx-hipW*0.5,hipY-s*0.01); g.lineTo(cx+hipW*0.5,hipY-s*0.01); }, cw*0.6);
  pen.seam(()=>{ g.moveTo(shoulderCx, shoulderY+s*0.02); g.lineTo(cx, hipY-s*0.02); }, cw*0.5);

  // ---- NECK + BOWED HEAD ----
  const headCx=shoulderCx + F*(s*0.03 + bow*0.6);
  const headCy=shoulderY - headR*(0.92 - 0.5*solemn);
  pen.limb(()=>{ g.moveTo(shoulderCx,shoulderY+s*0.01); g.lineTo(headCx,headCy+headR*0.7); }, skin, s*0.052);
  pen.paint(()=>{ g.arc(headCx,headCy,headR,0,7); }, skin, cw);
  // hair cap over crown + the down-turned back of the head
  pen.paint(()=>{ g.arc(headCx,headCy-headR*0.06,headR*1.02, Math.PI*0.78, Math.PI*1.92); }, hair, cw*0.8);
  drawMournFace(pen,g,headCx,headCy,headR,F,solemn);

  // ---- ARMS by task ----
  const shInner={x:shoulderCx+F*shoulderW*0.40,y:shoulderY+s*0.04};
  const shOuter={x:shoulderCx-F*shoulderW*0.30,y:shoulderY+s*0.06};
  const task=o.task||"mourn";
  if(task==="branch"){
    // both forearms cradle a bundle held across the front
    const hx=cx+F*s*0.02, hy=hipY-s*0.10;
    drawArm(pen,g,shInner,{x:hx+F*s*0.10,y:hy}, s, cloth, skin, +1);
    drawArm(pen,g,shOuter,{x:hx-F*s*0.10,y:hy}, s, cloth, skin, -1);
    drawBundle(pen,g,W,H,hx,hy,s,F);
  } else if(task==="reach"){
    const tx=o.focus.x, ty=o.focus.y;
    drawArm(pen,g,shInner,{x:tx,y:ty}, s, cloth, skin, +1);
    drawArm(pen,g,shOuter,{x:tx-F*s*0.06,y:ty+s*0.03}, s, cloth, skin, -1);
  } else if(task==="basket"){
    const hx=cx+F*s*0.16, hy=hipY+s*0.02;
    drawArm(pen,g,shInner,{x:hx,y:hy-s*0.02}, s, cloth, skin, +1);
    drawArm(pen,g,shOuter,{x:hx-F*s*0.05,y:hy}, s, cloth, skin, -1);
    drawBasket(pen,g,W,H,hx,hy,s);
  } else { // mourn — hands clasped low at the waist, or one to the brow
    const hx=cx+F*s*0.02, hy=hipY+s*0.02;
    drawArm(pen,g,shInner,{x:hx,y:hy}, s, cloth, skin, +1);
    drawArm(pen,g,shOuter,{x:hx-F*s*0.02,y:hy}, s, cloth, skin, -1);
    pen.paint(()=>{ g.ellipse(hx,hy,s*0.045,s*0.036,0,0,7); }, skin, cw*0.8);
  }
}

function drawArm(pen,g,sh,hand,s,cloth,skin,side){
  const mx=lerp(sh.x,hand.x,0.5)+side*s*0.03, my=lerp(sh.y,hand.y,0.5)+s*0.04;
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(mx,my); }, cloth, s*0.048);
  pen.limb(()=>{ g.moveTo(mx,my); g.lineTo(hand.x,hand.y); }, skin, s*0.040);
}
function drawBundle(pen,g,W,H,hx,hy,s,F){
  // a cradled bundle of sticks angled across the arms
  for(let i=-2;i<=2;i++){
    const off=i*s*0.028;
    pen.paint(()=>{
      g.save?0:0;
      g.ellipse(hx+off*0.3, hy+off*0.5, s*0.22, s*0.022, -F*0.35, 0,7);
    }, toneSolid(inkLevel(4+(i+2)%2)), 3);
  }
  // binding cord
  pen.seam(()=>{ g.moveTo(hx-s*0.02,hy-s*0.06); g.lineTo(hx+s*0.02,hy+s*0.06); }, s*0.02);
}
function drawBasket(pen,g,W,H,hx,hy,s){
  pen.paint(()=>{
    g.moveTo(hx-s*0.11,hy-s*0.05);
    g.lineTo(hx+s*0.11,hy-s*0.05);
    g.lineTo(hx+s*0.08,hy+s*0.09);
    g.lineTo(hx-s*0.08,hy+s*0.09);
    g.closePath();
  }, toneSolid(inkLevel(4)), Math.max(3,s*0.016));
  // weave seams + a mound of earth heaped above the rim
  g.strokeStyle=INK; g.lineWidth=Math.max(1.5,s*0.010); g.globalAlpha=0.6;
  for(let k=-1;k<=1;k++){ g.beginPath(); g.moveTo(hx-s*0.10,hy-s*0.01+k*s*0.03); g.lineTo(hx+s*0.10,hy-s*0.01+k*s*0.03); g.stroke(); }
  g.globalAlpha=1;
  pen.paint(()=>{ g.ellipse(hx,hy-s*0.05,s*0.10,s*0.030,0,Math.PI,0); }, toneSolid(inkLevel(6)), 2);
}
/* a downcast, grieving face turned toward the focal (F). closed/heavy eyes,
   a drawn-down mouth. */
function drawMournFace(pen,g,hx,hy,headR,F,solemn){
  const eyeY=hy+headR*0.04;              // eyes sit low on the bowed face
  const edx=headR*0.30;
  g.strokeStyle=INK; g.lineCap="round";
  // downcast / closed eyes (shallow down-curves)
  g.lineWidth=Math.max(2,headR*0.11);
  const eye=(ex,r)=>{ g.beginPath(); g.moveTo(ex-r,eyeY); g.quadraticCurveTo(ex,eyeY+headR*0.09,ex+r,eyeY); g.stroke(); };
  eye(hx+F*edx, headR*0.22);
  eye(hx-F*edx*0.5, headR*0.15);
  // sorrowed brows
  g.lineWidth=Math.max(2,headR*0.10);
  g.beginPath(); g.moveTo(hx+F*edx-headR*0.14,eyeY-headR*0.30); g.lineTo(hx+F*edx+headR*0.10,eyeY-headR*0.16); g.stroke();
  // nose toward the focal
  g.lineWidth=Math.max(2,headR*0.07);
  g.beginPath(); g.moveTo(hx+F*edx*0.4,eyeY+headR*0.06); g.lineTo(hx+F*edx*0.62,eyeY+headR*0.30); g.stroke();
  // down-drawn mouth
  const my=hy+headR*0.52;
  g.lineWidth=Math.max(2,headR*0.09);
  g.beginPath(); g.moveTo(hx+F*headR*0.02-headR*0.16,my);
  g.quadraticCurveTo(hx+F*headR*0.02, my-headR*0.10*solemn, hx+F*headR*0.02+headR*0.16, my); g.stroke();
}

/* ============================================================
   STAGE — the ground, the shared focal for this formation, and the roster
   in painter's order (far band -> focal -> near bands).
   ============================================================ */
function drawEnsemble(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const formation=FORMATIONS.includes(st.formation)?st.formation:params.formation;
  const solemn=st.solemn ?? params.solemn;
  const spread=st.spread ?? params.spread;
  const floorY=(st.floorLevel ?? params.floorLevel)*H;
  const t=st.t||0;
  let fire=st.fire ?? params.fire;
  if(formation==="pyre") fire=Math.max(fire,0.9);

  const fx=(st.focus?.x ?? params.focus.x)*W;
  // focal vertical anchor varies by beat
  const focalY = formation==="carry" ? H*0.52 : floorY;

  // ---- ground ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,H);
  g.fillStyle=inkLevel(2); g.fillRect(0,floorY,W,H-floorY);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.22;
  g.beginPath(); g.moveTo(0,floorY); g.lineTo(W,floorY); g.stroke(); g.globalAlpha=1;

  // resolve each member's placement + reach target for this formation
  const members=ROSTER.map((m,i)=>{
    const nx=0.5+(m.nx-0.5)*spread;
    const cx=clamp(nx,0.07,0.93)*W;
    const task=(TASKS[formation]||TASKS.plant)[m.slot] || "mourn";
    // reach target: the focal, biased toward this member's side
    const rx = formation==="carry"
        ? (m.slot.includes("left")? fx-W*0.14 : fx+W*0.14)
        : lerp(cx, fx, 0.62);
    const ry = formation==="carry" ? focalY+H*0.02 : focalY-H*0.03;
    return { m, cx, task, focus:{x:rx,y:ry}, seed:311+i*101 };
  });

  const drawMember=(b)=> drawMourner(pen,g,W,H,{
    cx:b.cx, footY:b.m.footY*H, s:b.m.s, lvl:b.m.lvl, face:b.m.face,
    task:b.task, solemn, focus:b.focus, seed:b.seed });

  // FAR band (behind the focal)
  members.filter(b=>b.m.band===0).forEach(drawMember);

  // ---- FOCAL object for this beat ----
  if(formation==="wood") drawWoodpile(pen,g,W,H,fx,floorY-H*0.01,1.0);
  else if(formation==="carry") drawBier(pen,g,W,H,fx,focalY);
  else if(formation==="pyre"){
    drawWoodpile(pen,g,W,H,fx,floorY-H*0.01,1.0);
    drawShroudBody(pen,g,W,H,fx,floorY-H*0.14,W*0.28);
    drawFlames(pen,g,W,H,fx,floorY-H*0.12,t,fire);
  }
  else if(formation==="mound") drawMound(pen,g,W,H,fx,floorY,{marker:false,partial:true});
  else drawMound(pen,g,W,H,fx,floorY,{marker:true,partial:false}); // plant

  // MID + NEAR bands (in front of the focal)
  members.filter(b=>b.m.band===1).forEach(drawMember);
  members.filter(b=>b.m.band===2).forEach(drawMember);
}

export const asset = {
  id:"ensemble.crew",
  type:"ENSEMBLE",
  name:"Crew",
  statusWord:"MOURNING",
  scene:"OD-B12-S01",

  params,
  // ONE member template, instanced across the roster around a shared focal
  member:{ template:"mourner", roster:ROSTER.map(r=>r.slot), formation:"solemn-semicircle" },
  // back -> front draw order the stage honors
  layers:["ground","band-far","focal","band-mid","band-near","fire"],
  // normalized placement / camera / focal anchors (NOT baked characters)
  anchors:{
    "focal:rite":{ x:0.50, y:0.72 },
    "stand:far-left":{ x:0.235, y:0.590 }, "stand:far-right":{ x:0.765, y:0.590 },
    "stand:mid-left":{ x:0.315, y:0.735 }, "stand:mid-right":{ x:0.685, y:0.735 },
    "stand:near-left":{ x:0.170, y:0.905 }, "stand:near-right":{ x:0.830, y:0.905 },
    "pyre:apex":{ x:0.50, y:0.60 }, "marker:head":{ x:0.50, y:0.42 },
    "camera:wide":{ x:0.50, y:0.50 }, "camera:focal":{ x:0.50, y:0.66 },
  },
  // the working ground the crew stands on
  zones:{ ground:{ x0:0.06, y0:0.56, x1:0.94, y1:0.96 }, rite:{ x0:0.34, y0:0.60, x1:0.66, y1:0.86 } },
  states:{
    initial:"plant",
    nodes:{
      wood:  { preview:{ formation:"wood",  solemn:0.55, fire:0.0 } },
      carry: { preview:{ formation:"carry", solemn:0.80, fire:0.0 } },
      pyre:  { preview:{ formation:"pyre",  solemn:0.85, fire:1.0, t:0.6 } },
      mound: { preview:{ formation:"mound", solemn:0.70, fire:0.0 } },
      plant: { preview:{ formation:"plant", solemn:0.90, fire:0.0 } },
    },
    edges:[["wood","carry"],["carry","pyre"],["pyre","mound"],["mound","plant"]],
  },
  channels:["formation","solemn","attention","fire","spread"],

  preview:()=>({ formation:"plant", solemn:0.88, fire:0.0, spread:1.0, t:0, status:"MOURNING", progress:0.5 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
