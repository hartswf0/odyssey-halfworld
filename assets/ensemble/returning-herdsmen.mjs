/* ensemble.returning-herdsmen — farm-hands bringing the herd home at dusk.
   ENSEMBLE asset. A repeatable group built from ONE separable MEMBER template
   (a herdsman figure + a task rig) plus a small PIG template, instanced N times
   across depth bands. Formation channel cycles the evening chores
   (drive -> pen -> settle) and a "weariness" channel droops the heads/shoulders;
   attention turns the weary heads toward the hearth. Drawn in SOLID grays +
   hard contour into the offscreen ctx; the engine dotify POST pass supplies the
   halftone. Do NOT bake in named characters.
   Atlas OD-B14-S04 — workers driving pigs, closing pens, eating, settling for night. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---- the four evening chores the scene requires ---- */
const TASKS = ["drive","pen","eat","settle"];

/* member roster: a separable template on a deterministic list.
   band 0=back(small,light) .. 2=front(large,dark). x is normalized 0..1.
   flip: +1 faces right (toward the pen), -1 faces left. */
const MEMBERS = [
  { task:"drive",  band:0, x:0.28, flip:1  },
  { task:"pen",    band:0, x:0.82, flip:-1 },
  { task:"drive",  band:1, x:0.20, flip:1  },
  { task:"eat",    band:2, x:0.30, flip:1  },
  { task:"eat",    band:2, x:0.54, flip:-1 },
  { task:"settle", band:2, x:0.78, flip:-1 },
];

/* the herd — a separable PIG template driven home, clustered ahead of the
   drovers (to their +flip side) and milling by the pen mouth. */
const PIGS = [
  { band:0, x:0.44, flip:1  },
  { band:1, x:0.38, flip:1  },
  { band:1, x:0.50, flip:1  },
  { band:2, x:0.13, flip:1  },
];

const params = {
  count: MEMBERS.length,
  herd: PIGS.length,
  bands: 3,                  // depth rows
  floorLevel: 0.50,          // horizon fraction of H (dusk sky above)
  focus: { x:0.50, y:0.86 }, // the hearth/fire the weary hands settle toward
  weariness: 0.55,           // 0 upright .. 1 heads down, shoulders sagging
  attention: 0.45,           // 0 heads-down at chore .. 1 turned to the fire
  spread: 1.0,               // formation width multiplier about centre
  density: 1.0,              // 0 sparse (front band only) .. 1 whole yard
  formation: "settle",       // drive | pen | settle — narrative phase
};

const BAND_Y   = [0.605, 0.750, 0.910];   // footline per band
const BAND_S   = [150, 196, 262];         // member height px per band
const BAND_LVL = [3, 4, 4];               // garment ink level per band

/* ============================================================
   PIG TEMPLATE — one stout pig, drawn deterministically.
   px/footY/ps in px; F facing +1 right / -1 left.
   ============================================================ */
function pig(pen, g, px, footY, ps, F){
  const body = toneSolid(inkLevel(4));
  const dark = toneSolid(inkLevel(5));
  const cw   = Math.max(2, ps*0.03);
  const by   = footY - ps*0.42;                 // body centre
  const bw   = ps*0.72, bh = ps*0.42;

  // ground shadow
  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(px, footY+ps*0.02, bw*0.9, ps*0.06, 0,0,7); g.fill();

  // legs (four stubby posts)
  for(const dx of [-bw*0.62,-bw*0.24,bw*0.24,bw*0.62]){
    pen.paint(()=>{ g.rect(px+dx-ps*0.05, by+bh*0.4, ps*0.10, ps*0.42); }, body, cw);
  }
  // barrel body
  pen.paint(()=>{ g.ellipse(px, by, bw, bh, 0,0,7); }, body, cw);
  // curly tail (rear = -F side)
  pen.ink(()=>{
    g.moveTo(px-F*bw*0.92, by-bh*0.1);
    g.quadraticCurveTo(px-F*bw*1.18, by-bh*0.5, px-F*bw*0.98, by-bh*0.7);
  }, cw*0.8);
  // head + snout (front = +F side)
  const hx = px+F*bw*0.92, hy = by+bh*0.15;
  pen.paint(()=>{ g.ellipse(hx, hy, ps*0.26, ps*0.24, 0,0,7); }, dark, cw);
  pen.paint(()=>{ g.ellipse(hx+F*ps*0.24, hy+ps*0.03, ps*0.12, ps*0.10, 0,0,7); }, body, cw); // snout
  pen.ink(()=>{ g.moveTo(hx+F*ps*0.30, hy-ps*0.01); g.lineTo(hx+F*ps*0.30, hy+ps*0.07); }, cw*0.7); // nostril line
  // ear (little triangle up-back)
  pen.paint(()=>{
    g.moveTo(hx-F*ps*0.02, hy-ps*0.16);
    g.lineTo(hx-F*ps*0.16, hy-ps*0.30);
    g.lineTo(hx-F*ps*0.14, hy-ps*0.08); g.closePath();
  }, dark, cw*0.8);
  // eye
  g.fillStyle=INK; g.beginPath(); g.arc(hx+F*ps*0.06, hy-ps*0.02, ps*0.025, 0,7); g.fill();
}

/* ============================================================
   HERDSMAN MEMBER TEMPLATE — one farm-hand, drawn deterministically.
   cx/footY/s in px; task selects posture + prop; lvl garment tone;
   opt carries the weary head offset {headDX, headDown}.
   drive/pen are standing; eat/settle are seated by the fire.
   ============================================================ */
function herdsman(pen, g, cx, footY, s, task, lvl, m, opt){
  const cloth = toneSolid(inkLevel(lvl));
  const skin  = toneSolid(inkLevel(2));
  const hair  = toneSolid(inkLevel(6));
  const prop  = toneSolid(inkLevel(Math.min(6, lvl+2)));
  const propMid = toneSolid(inkLevel(Math.min(5, lvl+1)));
  const cw = Math.max(3, s*0.018);
  const F  = m.flip;
  const seated = (task==="eat" || task==="settle");

  if (seated) return herdsmanSeated(pen,g,cx,footY,s,task,F,cloth,skin,hair,prop,propMid,cw,opt);

  // ---- STANDING (drive / pen) ----
  const hemY      = footY;
  const torsoH    = s*0.50;
  const lean      = F*s*0.05 + F*(opt.wear||0)*s*0.05;   // drovers stoop into the walk
  const shoulderY = hemY - torsoH;
  const shoulderW = s*0.30;
  const hemW      = s*0.40;
  const headR     = s*0.135;
  const headCy    = shoulderY - headR*1.05;
  const hx = cx + lean*0.6 + (opt.headDX||0);
  const hy = headCy + (opt.headDown||0);

  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, hemY+s*0.02, hemW*0.60, s*0.045, 0,0,7); g.fill();

  // back arm (behind torso)
  const bsh={x:cx-F*shoulderW*0.5, y:shoulderY+s*0.05};
  let bd = task==="pen" ? {x:F*0.5,y:0.7} : {x:-F*0.2,y:0.95};
  const bn=Math.hypot(bd.x,bd.y); bd={x:bd.x/bn,y:bd.y/bn};
  const bwr={x:bsh.x+bd.x*s*0.30, y:bsh.y+bd.y*s*0.30};
  pen.limb(()=>{ g.moveTo(bsh.x,bsh.y); g.lineTo(bwr.x,bwr.y); }, cloth, s*0.055);
  pen.paint(()=>{ g.arc(bwr.x,bwr.y,s*0.03,0,7); }, skin, cw*0.7);

  // torso tunic (blocky trapezoid, leaning)
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+lean, shoulderY);
    g.lineTo(cx+shoulderW/2+lean, shoulderY);
    g.lineTo(cx+hemW/2, hemY);
    g.lineTo(cx-hemW/2, hemY);
    g.closePath();
  }, cloth, cw);
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.5+lean,shoulderY+torsoH*0.46); g.lineTo(cx+shoulderW*0.5,shoulderY+torsoH*0.46); }, cw*0.7);
  // two legs below the hem — the leading (+F) leg strides for the drovers
  const stride = task==="drive" ? s*0.11 : s*0.03;
  const legT = toneSolid(inkLevel(Math.min(6,lvl+2)));
  pen.limb(()=>{ g.moveTo(cx-F*hemW*0.20,hemY-s*0.04); g.lineTo(cx-F*hemW*0.20-F*stride*0.3, footY+s*0.11); }, legT, s*0.062); // trailing
  pen.limb(()=>{ g.moveTo(cx+F*hemW*0.16,hemY-s*0.04); g.lineTo(cx+F*hemW*0.16+F*stride, footY+s*0.11); }, legT, s*0.062);   // leading

  // neck + head (weary droop)
  pen.limb(()=>{ g.moveTo(cx+lean,shoulderY+s*0.01); g.lineTo(hx,hy+headR*0.7); }, skin, s*0.05);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  pen.paint(()=>{ g.arc(hx, hy-headR*0.06, headR*1.02, Math.PI*(1.02+0.04*F), Math.PI*(1.98+0.04*F)); }, hair, cw*0.8);

  // front arm + prop
  const fsh={x:cx+F*shoulderW*0.42+lean, y:shoulderY+s*0.06};
  if (task==="drive"){
    // driving staff/goad held diagonally forward over the herd
    const grip={x:cx+F*s*0.16, y:shoulderY+s*0.10};
    const tip ={x:cx+F*s*0.46, y:hemY-s*0.02};
    pen.limb(()=>{ g.moveTo(fsh.x,fsh.y); g.lineTo(grip.x,grip.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(grip.x,grip.y,s*0.032,0,7); }, skin, cw*0.7);
    pen.limb(()=>{ g.moveTo(grip.x-F*s*0.02,grip.y-s*0.30); g.lineTo(tip.x,tip.y); }, propMid, s*0.028); // the staff
  } else { // pen — pushing the gate shut
    const wr={x:cx+F*s*0.30, y:shoulderY+s*0.10};
    pen.limb(()=>{ g.moveTo(fsh.x,fsh.y); g.lineTo(cx+F*s*0.18,shoulderY+s*0.06); g.lineTo(wr.x,wr.y); }, cloth, s*0.055);
    pen.paint(()=>{ g.arc(wr.x,wr.y,s*0.032,0,7); }, skin, cw*0.7);
  }
}

/* seated herdsman for eat / settle, gathered low by the fire */
function herdsmanSeated(pen,g,cx,footY,s,task,F,cloth,skin,hair,prop,propMid,cw,opt){
  const hipY  = footY - s*0.02;
  const torsoH= s*0.30;                       // compact when crouched
  const shoulderY = hipY - torsoH;
  const shoulderW = s*0.30;
  const hemW      = s*0.44;
  const headR     = s*0.125;
  const bend = (task==="settle") ? 1 : 0.6;   // settlers curl further over
  const headCy = shoulderY - headR*0.7 + bend*s*0.06;
  const hx = cx + F*s*0.06 + (opt.headDX||0);
  const hy = headCy + (opt.headDown||0) + bend*s*0.03;

  g.fillStyle="rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, footY+s*0.02, hemW*0.62, s*0.05, 0,0,7); g.fill();

  // folded legs / lap (low block in front)
  pen.paint(()=>{ g.ellipse(cx+F*s*0.06, footY-s*0.05, hemW*0.55, s*0.10, 0,0,7); }, cloth, cw);
  // hunched torso trapezoid
  pen.paint(()=>{
    g.moveTo(cx-shoulderW/2+F*s*0.03, shoulderY);
    g.lineTo(cx+shoulderW/2+F*s*0.03, shoulderY);
    g.lineTo(cx+hemW/2, hipY);
    g.lineTo(cx-hemW/2, hipY);
    g.closePath();
  }, cloth, cw);
  pen.seam(()=>{ g.moveTo(cx-shoulderW*0.4,shoulderY+torsoH*0.5); g.lineTo(cx+shoulderW*0.5,shoulderY+torsoH*0.5); }, cw*0.6);

  // neck + head (dropped forward, weary)
  pen.limb(()=>{ g.moveTo(cx+F*s*0.02,shoulderY+s*0.01); g.lineTo(hx,hy+headR*0.7); }, skin, s*0.048);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0,7); }, skin, cw);
  pen.paint(()=>{ g.arc(hx, hy-headR*0.06, headR*1.02, Math.PI*(1.02+0.04*F), Math.PI*(1.98+0.04*F)); }, hair, cw*0.8);

  if (task==="eat"){
    // bowl brought up to the mouth with both hands
    const bx=hx+F*s*0.02, by=hy+headR*0.9;
    pen.limb(()=>{ g.moveTo(cx+F*shoulderW*0.4,shoulderY+s*0.06); g.lineTo(bx-F*s*0.06,by+s*0.02); }, cloth, s*0.05);
    pen.paint(()=>{ g.moveTo(bx-s*0.09,by-s*0.02); g.quadraticCurveTo(bx,by+s*0.09,bx+s*0.09,by-s*0.02); g.closePath(); }, prop, cw); // bowl
    pen.paint(()=>{ g.arc(bx-F*s*0.09,by-s*0.01,s*0.028,0,7); }, skin, cw*0.7); // near hand
  } else { // settle — cloak pulled up over the shoulders, arms tucked, curled low
    pen.paint(()=>{
      g.moveTo(cx-shoulderW*0.60, shoulderY+s*0.01);
      g.quadraticCurveTo(cx-shoulderW*0.66, hipY-s*0.02, cx-hemW*0.52, hipY+s*0.02);
      g.lineTo(cx+hemW*0.52, hipY+s*0.02);
      g.quadraticCurveTo(cx+shoulderW*0.66, hipY-s*0.02, cx+shoulderW*0.60, shoulderY+s*0.01);
      g.closePath();
    }, toneSolid(inkLevel(5)), cw); // whole cloak wrap, solid
    pen.seam(()=>{ g.moveTo(cx, shoulderY+s*0.04); g.lineTo(cx-F*s*0.03, hipY); }, cw*0.6); // centre fold
  }
}

/* ============================================================
   STAGE — dusk yard (sky + hill + ground), pen fence + gate on the right,
   a low hearth as the focus, then the herd + hands drawn back->front.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const weariness = st.weariness ?? params.weariness;
  const attention = st.attention ?? params.attention;
  const spread    = st.spread ?? params.spread;
  const density   = st.density ?? params.density;
  const focus     = st.focus || params.focus;
  const focusX    = focus.x * W;
  const focusY    = focus.y * H;

  // ---- dusk sky (light up top, banded lower) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,0,W,horizon);
  g.fillStyle=inkLevel(2);
  for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(W*(0.2+i*0.22), horizon*0.42+((i%2)*H*0.03), W*0.13, H*0.022, 0,0,7); g.fill(); } // low cloud band
  // setting sun disc, low near the pen
  pen.paint(()=>{ g.arc(W*0.86, horizon-H*0.05, W*0.05, 0,7); }, toneSolid(inkLevel(3)), 4);

  // ---- low hill on the horizon (mid tone) ----
  pen.paint(()=>{
    g.moveTo(0, horizon);
    g.quadraticCurveTo(W*0.3, horizon-H*0.07, W*0.55, horizon-H*0.015);
    g.quadraticCurveTo(W*0.75, horizon-H*0.05, W, horizon-H*0.02);
    g.lineTo(W, horizon); g.closePath();
  }, toneSolid(inkLevel(3)), 4);

  // ---- ground (lightest, receding) ----
  g.fillStyle=inkLevel(1); g.fillRect(0,horizon,W,H-horizon);
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
  for(let i=-5;i<=5;i++){ g.beginPath(); g.moveTo(W*0.5,horizon); g.lineTo(W*0.5+i*W*0.17,H); g.stroke(); }
  for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // ---- PEN on the right: post-and-rail fence with a swung gate ----
  const penY = horizon + (H-horizon)*0.30;   // fence footline (mid depth)
  const postH = H*0.11;
  const x0 = W*0.66, x1 = W*0.99;
  // rails
  for(const ry of [penY-postH*0.9, penY-postH*0.45]){
    pen.limb(()=>{ g.moveTo(x0, ry); g.lineTo(x1, ry); }, toneSolid(inkLevel(4)), Math.max(3,W*0.006));
  }
  // posts
  for(let i=0;i<=4;i++){ const px=lerp(x0,x1,i/4);
    pen.paint(()=>{ g.rect(px-W*0.006, penY-postH, W*0.012, postH); }, toneSolid(inkLevel(5)), 3); }
  // the gate leaf being closed (angled, near the pen mouth on the left of the pen)
  const gx = x0 - W*0.005, gTop = penY-postH*0.95;
  pen.paint(()=>{ g.moveTo(gx, gTop); g.lineTo(gx+W*0.10, gTop+H*0.012); g.lineTo(gx+W*0.10, penY); g.lineTo(gx, penY-H*0.008); g.closePath(); }, toneSolid(inkLevel(4)), Math.max(3,W*0.006));
  pen.ink(()=>{ g.moveTo(gx,gTop); g.lineTo(gx+W*0.10,penY); }, 3); // diagonal brace

  // ---- HEARTH / fire — the settling focus (front centre) ----
  const fx=focusX, fy=focusY;
  const fr=W*0.045;
  // stone ring
  for(let a=0;a<8;a++){ const ang=a/8*Math.PI*2; pen.paint(()=>{ g.ellipse(fx+Math.cos(ang)*fr, fy+Math.sin(ang)*fr*0.5, W*0.012, W*0.010, 0,0,7); }, toneSolid(inkLevel(4)), 3); }
  // flame (dark tongues) + light bloom above
  g.fillStyle=inkLevel(2); g.beginPath(); g.ellipse(fx, fy-fr*0.4, fr*1.4, fr*1.1, 0,0,7); g.fill();
  pen.paint(()=>{ g.moveTo(fx-fr*0.5,fy); g.quadraticCurveTo(fx-fr*0.2,fy-fr*1.2,fx,fy-fr*0.3); g.quadraticCurveTo(fx+fr*0.3,fy-fr*1.4,fx+fr*0.5,fy); g.closePath(); }, toneSolid(inkLevel(6)), 3);

  // ---- build a combined draw list (members + pigs), painter-ordered by band ----
  const list = [];
  MEMBERS.forEach((m,i)=> list.push({ kind:"member", m, i }));
  PIGS.forEach((p,i)=> list.push({ kind:"pig", m:p, i:100+i }));
  const roster = list
    .filter(({m})=> density>=1 ? true : m.band >= Math.round((1-density)*(params.bands-1)))
    .sort((a,b)=> (a.m.band - b.m.band) || (a.m.x - b.m.x));

  roster.forEach(({kind,m,i})=>{
    const footY = BAND_Y[m.band]*H;
    const s     = BAND_S[m.band];
    const nx = 0.5 + (m.x-0.5)*spread;
    const cx = clamp(nx,0.05,0.97)*W;
    if (kind==="pig"){ pig(pen,g,cx,footY,s*0.46,m.flip); return; }
    const lvl = BAND_LVL[m.band];
    // weary head droop (down + slightly forward) eased by turning to the fire
    const toFire = clamp((focusX-cx)/(W*0.5), -1, 1);
    const headDX = clamp(toFire*attention*s*0.08 + m.flip*weariness*s*0.03, -s*0.10, s*0.10);
    const headDown = weariness * s*0.055 * (1 - 0.4*attention);
    herdsman(pen, g, cx, footY, s, m.task, lvl, m, { headDX, headDown, wear:weariness });
  });
}

export const asset = {
  id:"ensemble.returning-herdsmen",
  type:"ENSEMBLE",
  name:"Returning herdsmen",
  statusWord:"WEARY",
  scene:"OD-B14-S04",

  params,
  // one member template + task rig + a pig template, instanced across depth bands
  member:{ template:"herdsman", tasks:TASKS, roster:MEMBERS, herd:{ template:"pig", roster:PIGS } },
  // back -> front draw order the stage honors
  layers:["sky","hill","ground","pen-fence","gate","hearth","band-back","band-mid","band-front"],
  // normalized placement / camera / focus anchors (NOT baked characters)
  anchors:{
    "focus:hearth":{x:.50,y:.86},
    "pen:gate":{x:.66,y:.74},
    "pen:mouth":{x:.72,y:.74},
    "herd:path":{x:.40,y:.72},
    "station:drive":{x:.24,y:.68},
    "station:eat":{x:.42,y:.91},
    "station:settle":{x:.78,y:.91},
    "camera:wide":{x:.50,y:.55},
    "entrance:left":{x:.05,y:.86}, "exit:pen":{x:.95,y:.74},
  },
  // walkable yard + the fenced pen enclosure for scene pathing/placement
  zones:{
    walkable:{ x0:.05,y0:.52,x1:.97,y1:.98 },
    pen:{ x0:.66,y0:.60,x1:.99,y1:.80 },
    hearth:{ x0:.40,y0:.82,x1:.60,y1:.94 },
  },
  states:{
    initial:"driving-home",
    nodes:{
      "driving-home":{ preview:{ formation:"drive",  weariness:0.35, attention:0.15, spread:1.05, density:1.0 } },
      "penning":{      preview:{ formation:"pen",     weariness:0.5,  attention:0.35, spread:1.0,  density:1.0 } },
      "settling":{     preview:{ formation:"settle",  weariness:0.75, attention:0.7,  spread:0.95, density:1.0 } },
    },
    edges:[["driving-home","penning"],["penning","settling"],["settling","driving-home"]],
  },
  channels:["formation","weariness","attention","density","light"],

  preview:()=>({ formation:"settle", weariness:0.6, attention:0.5, spread:1.0, density:1.0, status:"WEARY", progress:.24 }),
  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
